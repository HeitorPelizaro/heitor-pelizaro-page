/**
 * Física do grafo de fundo: molas, repulsão (grade espacial), teia dinâmica.
 * Arestas rompem por esticamento, pelo mouse “cortando” o fio, e religam por proximidade.
 */

export type GraphNode = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  restX: number;
  restY: number;
  anchorX: number;
  anchorY: number;
  pinned: boolean;
};

export type GraphEdge = {
  a: number;
  b: number;
  restLength: number;
  maxStretch: number;
};

export type GraphState = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  cx: number;
  cy: number;
  frame: number;
  pairCooldownUntil: Map<string, number>;
};

const SPATIAL_CELL = 130;
const PAIR_COOLDOWN_FRAMES = 112;
const PAIR_COOLDOWN_MOUSE = 38;
const SWAY_TIME = 0.012;
const SWAY_AMP = 1.35;
const SWAY_BLEND = 0.038;

/** Atração entre nós (simbionte / ímã); repulsão a curta distância evita colapso. */
const MAGNET_D_MIN = 48;
const MAGNET_D_MAX = 400;
const MAGNET_SOFTEN = 7800;

/** Distância do ponto ao segmento AB (px). */
function distPointToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const ab2 = abx * abx + aby * aby || 1;
  let t = (apx * abx + apy * aby) / ab2;
  t = Math.max(0, Math.min(1, t));
  const qx = ax + t * abx;
  const qy = ay + t * aby;
  return Math.hypot(px - qx, py - qy);
}

function edgeKey(a: number, b: number): string {
  return a < b ? `${a},${b}` : `${b},${a}`;
}

function hasEdge(edges: GraphEdge[], a: number, b: number): boolean {
  for (const e of edges) {
    if ((e.a === a && e.b === b) || (e.a === b && e.b === a)) return true;
  }
  return false;
}

function degreeCount(n: number, edges: GraphEdge[]): Int32Array {
  const d = new Int32Array(n);
  for (const e of edges) {
    d[e.a]++;
    d[e.b]++;
  }
  return d;
}

function buildBuckets(
  nodes: GraphNode[],
  n: number,
  cell: number,
): Map<string, number[]> {
  const buckets = new Map<string, number[]>();
  for (let i = 0; i < n; i++) {
    const xi = Math.floor(nodes[i].x / cell);
    const yi = Math.floor(nodes[i].y / cell);
    const key = `${xi},${yi}`;
    let arr = buckets.get(key);
    if (!arr) {
      arr = [];
      buckets.set(key, arr);
    }
    arr.push(i);
  }
  return buckets;
}

export function createGraph(nNodes: number, w: number, h: number): GraphState {
  const cx = w / 2;
  const cy = h / 2;
  const spreadR = Math.min(w, h) * 0.175;
  const nodes: GraphNode[] = [];

  nodes.push({
    id: 0,
    x: cx,
    y: cy,
    vx: 0,
    vy: 0,
    restX: cx,
    restY: cy,
    anchorX: cx,
    anchorY: cy,
    pinned: true,
  });

  const ring = Math.max(1, nNodes - 1);
  for (let i = 1; i < nNodes; i++) {
    const t = ((i - 1) / ring) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
    const rr = spreadR * (0.28 + Math.random() * 0.72);
    const ax = cx + Math.cos(t) * rr;
    const ay = cy + Math.sin(t) * rr;
    nodes.push({
      id: i,
      x: ax + (Math.random() - 0.5) * 10,
      y: ay + (Math.random() - 0.5) * 10,
      vx: 0,
      vy: 0,
      restX: ax,
      restY: ay,
      anchorX: ax,
      anchorY: ay,
      pinned: false,
    });
  }

  const edges: GraphEdge[] = [];
  for (let i = 0; i < nNodes; i++) {
    const rest1 = 58 + (i % 5) * 8;
    const rest2 = 72 + ((i * 3) % 5) * 8;
    edges.push({
      a: i,
      b: (i + 1) % nNodes,
      restLength: rest1,
      maxStretch: 1.68 + Math.random() * 0.22,
    });
    edges.push({
      a: i,
      b: (i + 7) % nNodes,
      restLength: rest2,
      maxStretch: 1.62 + Math.random() * 0.24,
    });
  }

  for (let i = 1; i < nNodes; i += 2) {
    const nx = nodes[i].x - cx;
    const ny = nodes[i].y - cy;
    const d0 = Math.sqrt(nx * nx + ny * ny) || 1;
    edges.push({
      a: 0,
      b: i,
      restLength: d0 * 0.88,
      maxStretch: 1.48 + Math.random() * 0.12,
    });
  }

  return {
    nodes,
    edges,
    cx,
    cy,
    frame: 0,
    pairCooldownUntil: new Map(),
  };
}

export type StepParams = {
  w: number;
  h: number;
  mouse: {
    x: number;
    y: number;
    active: boolean;
    /** Deslocamento desde o frame anterior (px) — para “cortar” fios */
    vx: number;
    vy: number;
  };
  performanceMode: boolean;
};

function pruneCooldowns(map: Map<string, number>, frame: number) {
  if (frame % 240 !== 0) return;
  for (const [k, until] of map) {
    if (until < frame) map.delete(k);
  }
}

/** Tenta religar pares próximos sem aresta (vizinhança espacial). */
function snapProximityEdges(
  state: GraphState,
  f: number,
  pairCooldownUntil: Map<string, number>,
  snapR: number,
  maxDeg: number,
  performanceMode: boolean,
  maxNewPerFrame: number,
): void {
  const { nodes, edges } = state;
  const n = nodes.length;
  const cell = SPATIAL_CELL;
  const buckets = buildBuckets(nodes, n, cell);
  const deg = degreeCount(n, edges);
  let added = 0;

  outer: for (let i = 0; i < n; i++) {
    if (deg[i] >= maxDeg) continue;
    const xi = Math.floor(nodes[i].x / cell);
    const yi = Math.floor(nodes[i].y / cell);
    for (let ox = -1; ox <= 1; ox++) {
      for (let oy = -1; oy <= 1; oy++) {
        const list = buckets.get(`${xi + ox},${yi + oy}`);
        if (!list) continue;
        for (const j of list) {
          if (j <= i) continue;
          if (deg[j] >= maxDeg) continue;
          const k = edgeKey(i, j);
          if (hasEdge(edges, i, j)) continue;
          if ((pairCooldownUntil.get(k) ?? 0) > f) continue;
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const minD = performanceMode ? 14 : 12;
          if (d < snapR && d > minD) {
            edges.push({
              a: i,
              b: j,
              restLength: d * 0.82,
              maxStretch: 1.9 + Math.random() * 0.36,
            });
            pairCooldownUntil.delete(k);
            deg[i]++;
            deg[j]++;
            added++;
            if (added >= maxNewPerFrame) break outer;
          }
        }
      }
    }
  }
}

/** Uma nova aresta por frame quando abaixo do mínimo — reconexão gradual (estilo ímã). */
function addOneRepairEdge(
  state: GraphState,
  f: number,
  pairCooldownUntil: Map<string, number>,
  maxDeg: number,
): void {
  const { nodes, edges } = state;
  const n = nodes.length;
  const cell = SPATIAL_CELL;
  const buckets = buildBuckets(nodes, n, cell);
  const deg = degreeCount(n, edges);
  let bestI = -1;
  let bestJ = -1;
  let bestD = Infinity;

  const consider = (i: number, j: number, dMax: number) => {
    if (deg[i] >= maxDeg || deg[j] >= maxDeg) return;
    const k = edgeKey(i, j);
    if (hasEdge(edges, i, j)) return;
    if ((pairCooldownUntil.get(k) ?? 0) > f) return;
    const dx = nodes[j].x - nodes[i].x;
    const dy = nodes[j].y - nodes[i].y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 14 || d > dMax) return;
    if (d < bestD) {
      bestD = d;
      bestI = i;
      bestJ = j;
    }
  };

  for (let i = 0; i < n; i++) {
    if (deg[i] >= maxDeg) continue;
    const xi = Math.floor(nodes[i].x / cell);
    const yi = Math.floor(nodes[i].y / cell);
    for (let ox = -1; ox <= 1; ox++) {
      for (let oy = -1; oy <= 1; oy++) {
        const list = buckets.get(`${xi + ox},${yi + oy}`);
        if (!list) continue;
        for (const j of list) {
          if (j <= i) continue;
          consider(i, j, 235);
        }
      }
    }
  }

  if (bestI < 0) {
    for (let i = 0; i < n; i++) {
      if (deg[i] >= maxDeg) continue;
      const xi = Math.floor(nodes[i].x / cell);
      const yi = Math.floor(nodes[i].y / cell);
      for (let ox = -2; ox <= 2; ox++) {
        for (let oy = -2; oy <= 2; oy++) {
          const list = buckets.get(`${xi + ox},${yi + oy}`);
          if (!list) continue;
          for (const j of list) {
            if (j <= i) continue;
            consider(i, j, 320);
          }
        }
      }
    }
  }

  if (bestI >= 0 && bestJ >= 0) {
    edges.push({
      a: bestI,
      b: bestJ,
      restLength: bestD * 0.85,
      maxStretch: 1.88 + Math.random() * 0.34,
    });
    pairCooldownUntil.delete(edgeKey(bestI, bestJ));
  }
}

export function stepGraph(state: GraphState, p: StepParams): void {
  const { nodes, edges, pairCooldownUntil } = state;
  const n = nodes.length;
  const w = p.w;
  const h = p.h;
  const margin = 22;
  const kBoundary = p.performanceMode ? 0.026 : 0.034;
  state.frame += 1;
  const f = state.frame;

  const repulse = p.performanceMode ? 2700 : 4000;
  const spring = p.performanceMode ? 0.0175 : 0.021;
  const kHome = p.performanceMode ? 0.0052 : 0.0068;
  const damping = p.performanceMode ? 0.92 : 0.93;
  const attractR = p.performanceMode ? 100 : 165;

  const mx = p.mouse.x;
  const my = p.mouse.y;
  const mvx = p.mouse.active ? p.mouse.vx : 0;
  const mvy = p.mouse.active ? p.mouse.vy : 0;
  const mouseSpeedSq = mvx * mvx + mvy * mvy;

  pruneCooldowns(pairCooldownUntil, f);

  const cell = SPATIAL_CELL;
  const buckets = buildBuckets(nodes, n, cell);

  for (let i = 0; i < n; i++) {
    const xi = Math.floor(nodes[i].x / cell);
    const yi = Math.floor(nodes[i].y / cell);
    for (let ox = -1; ox <= 1; ox++) {
      for (let oy = -1; oy <= 1; oy++) {
        const list = buckets.get(`${xi + ox},${yi + oy}`);
        if (!list) continue;
        for (const j of list) {
          if (j <= i) continue;
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const d2 = dx * dx + dy * dy + 40;
          if (d2 > 220 * 220) continue;
          const rep = repulse / d2;
          const inv = 1 / Math.sqrt(d2);
          const nx = dx * inv * rep;
          const ny = dy * inv * rep;
          nodes[i].vx -= nx;
          nodes[i].vy -= ny;
          nodes[j].vx += nx;
          nodes[j].vy += ny;
        }
      }
    }
  }

  const magnetMul = p.mouse.active ? 0.36 : 1;
  const magnetK = (p.performanceMode ? 40 : 64) * magnetMul;
  for (let i = 0; i < n; i++) {
    if (nodes[i].pinned) continue;
    const xi = Math.floor(nodes[i].x / cell);
    const yi = Math.floor(nodes[i].y / cell);
    for (let ox = -2; ox <= 2; ox++) {
      for (let oy = -2; oy <= 2; oy++) {
        const list = buckets.get(`${xi + ox},${yi + oy}`);
        if (!list) continue;
        for (const j of list) {
          if (j <= i || nodes[j].pinned) continue;
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAGNET_D_MIN || d > MAGNET_D_MAX) continue;
          const inv = 1 / d;
          const ux = dx * inv;
          const uy = dy * inv;
          const falloff = 1 - (d - MAGNET_D_MIN) / (MAGNET_D_MAX - MAGNET_D_MIN);
          const fm =
            (magnetK * falloff) / (d * d + MAGNET_SOFTEN);
          nodes[i].vx += ux * fm;
          nodes[i].vy += uy * fm;
          nodes[j].vx -= ux * fm;
          nodes[j].vy -= uy * fm;
        }
      }
    }
  }

  /** Puxo ao núcleo (colônia / simbionte): sem mouse, a teia tende a reunir-se ao hub. */
  {
    const hubK = p.mouse.active
      ? p.performanceMode
        ? 0.0065
        : 0.01
      : p.performanceMode
        ? 0.028
        : 0.042;
    const { cx, cy } = state;
    for (let i = 1; i < n; i++) {
      const node = nodes[i];
      const dx = cx - node.x;
      const dy = cy - node.y;
      const d = Math.sqrt(dx * dx + dy * dy) + 52;
      node.vx += (dx / d) * hubK;
      node.vy += (dy / d) * hubK;
    }
  }

  for (let ei = edges.length - 1; ei >= 0; ei--) {
    const e = edges[ei];
    const A = nodes[e.a];
    const B = nodes[e.b];
    const dx = B.x - A.x;
    const dy = B.y - A.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dist > e.restLength * e.maxStretch) {
      pairCooldownUntil.set(edgeKey(e.a, e.b), f + PAIR_COOLDOWN_FRAMES);
      edges.splice(ei, 1);
      continue;
    }
    const force = (dist - e.restLength) * spring;
    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;
    A.vx += fx;
    A.vy += fy;
    B.vx -= fx;
    B.vy -= fy;
  }

  if (p.mouse.active) {
    const sliceDist = p.performanceMode ? 18 : 24;
    const speedCut = p.performanceMode ? 2.5 : 2.0;
    const speedCutSq = speedCut * speedCut;
    const hardDist = 11;
    for (let ei = edges.length - 1; ei >= 0; ei--) {
      const e = edges[ei];
      const A = nodes[e.a];
      const B = nodes[e.b];
      const dSeg = distPointToSegment(mx, my, A.x, A.y, B.x, B.y);
      const cutBySpeed =
        dSeg < sliceDist && mouseSpeedSq > speedCutSq;
      const cutByCross = dSeg < hardDist && mouseSpeedSq > 0.35;
      if (cutBySpeed || cutByCross) {
        pairCooldownUntil.set(
          edgeKey(e.a, e.b),
          f + PAIR_COOLDOWN_MOUSE,
        );
        edges.splice(ei, 1);
      }
    }
  }

  const homeMul = p.mouse.active ? 0.52 : 1;
  const t = f * SWAY_TIME;
  for (const node of nodes) {
    if (node.pinned) continue;
    const off = node.id * 0.89;
    const targetX = node.anchorX + Math.sin(t + off) * SWAY_AMP;
    const targetY = node.anchorY + Math.cos(t + off * 1.06) * SWAY_AMP;
    node.restX += SWAY_BLEND * (targetX - node.restX);
    node.restY += SWAY_BLEND * (targetY - node.restY);
    node.vx += kHome * homeMul * (node.restX - node.x);
    node.vy += kHome * homeMul * (node.restY - node.y);
  }

  if (p.mouse.active) {
    const outer = attractR * 2.25;
    for (const node of nodes) {
      if (node.pinned) continue;
      const dx = node.x - mx;
      const dy = node.y - my;
      const d = Math.sqrt(dx * dx + dy * dy) + 1;
      if (d < outer) {
        const falloff = 1 - d / outer;
        const pull = falloff * 0.62;
        node.vx -= (dx / d) * pull * 2.1;
        node.vy -= (dy / d) * pull * 2.1;
        const tx = -dy / d;
        const ty = dx / d;
        const swirl = falloff * 0.38;
        node.vx += tx * swirl;
        node.vy += ty * swirl;
      }
    }
  }

  for (const node of nodes) {
    node.vx *= damping;
    node.vy *= damping;
    node.x += node.vx;
    node.y += node.vy;
    if (node.pinned) {
      node.x = state.cx;
      node.y = state.cy;
      node.vx = 0;
      node.vy = 0;
    } else {
      if (node.x < margin) node.vx += (margin - node.x) * kBoundary;
      if (node.x > w - margin) node.vx -= (node.x - (w - margin)) * kBoundary;
      if (node.y < margin) node.vy += (margin - node.y) * kBoundary;
      if (node.y > h - margin) node.vy -= (node.y - (h - margin)) * kBoundary;
    }
  }

  snapProximityEdges(
    state,
    f,
    pairCooldownUntil,
    p.performanceMode ? 54 : 64,
    7,
    p.performanceMode,
    p.performanceMode ? 2 : 4,
  );

  const minEdges = Math.max(12, Math.floor(n * 0.36));
  if (edges.length < minEdges) {
    addOneRepairEdge(state, f, pairCooldownUntil, 7);
  }
  if (edges.length < minEdges) {
    addOneRepairEdge(state, f, pairCooldownUntil, 7);
  }
}
