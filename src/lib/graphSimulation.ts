/**
 * Física do grafo de fundo: molas, repulsão (grade espacial), teia dinâmica
 * (arestas rompem por stretch e reconectam por proximidade).
 */

export type GraphNode = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  restX: number;
  restY: number;
  /** Ancora da posição de repouso “ideal” (respira com ruído suave) */
  anchorX: number;
  anchorY: number;
  pinned: boolean;
};

export type GraphEdge = {
  a: number;
  b: number;
  restLength: number;
  /** Rompe se dist > restLength * maxStretch */
  maxStretch: number;
};

export type GraphState = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  cx: number;
  cy: number;
  frame: number;
};

const SPATIAL_CELL = 130;

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

export function createGraph(nNodes: number, w: number, h: number): GraphState {
  const cx = w / 2;
  const cy = h / 2;
  const spreadR = Math.min(w, h) * 0.22;
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
    const rest1 = 88 + (i % 5) * 11;
    const rest2 = 102 + ((i * 3) % 5) * 10;
    edges.push({
      a: i,
      b: (i + 1) % nNodes,
      restLength: rest1,
      maxStretch: 2.15 + Math.random() * 0.45,
    });
    edges.push({
      a: i,
      b: (i + 7) % nNodes,
      restLength: rest2,
      maxStretch: 2.05 + Math.random() * 0.5,
    });
  }

  return { nodes, edges, cx, cy, frame: 0 };
}

export type StepParams = {
  w: number;
  h: number;
  mouse: { x: number; y: number; active: boolean };
  performanceMode: boolean;
};

export function stepGraph(state: GraphState, p: StepParams): void {
  const { nodes, edges } = state;
  const n = nodes.length;
  const w = p.w;
  const h = p.h;
  const margin = 22;
  const kBoundary = p.performanceMode ? 0.028 : 0.038;
  state.frame += 1;

  const repulse = p.performanceMode ? 3000 : 4400;
  const spring = p.performanceMode ? 0.016 : 0.019;
  const kHome = p.performanceMode ? 0.0045 : 0.006;
  const kAnchor = 0.0035;
  const damping = p.performanceMode ? 0.9 : 0.91;
  const attractR = p.performanceMode ? 100 : 165;

  const cell = SPATIAL_CELL;
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
          const f = repulse / d2;
          const inv = 1 / Math.sqrt(d2);
          const nx = dx * inv * f;
          const ny = dy * inv * f;
          nodes[i].vx -= nx;
          nodes[i].vy -= ny;
          nodes[j].vx += nx;
          nodes[j].vy += ny;
        }
      }
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

  const restJitter = 0.11;
  for (const node of nodes) {
    if (node.pinned) continue;
    node.vx += kHome * (node.restX - node.x);
    node.vy += kHome * (node.restY - node.y);
    node.restX += (Math.random() - 0.5) * restJitter;
    node.restY += (Math.random() - 0.5) * restJitter;
    node.vx += kAnchor * (node.anchorX - node.restX);
    node.vy += kAnchor * (node.anchorY - node.restY);
  }

  if (p.mouse.active) {
    const mx = p.mouse.x;
    const my = p.mouse.y;
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

  if (state.frame % 18 === 0) {
    const deg = degreeCount(n, edges);
    const maxDeg = 6;
    const relinkR = 92;
    const attempts = p.performanceMode ? 10 : 22;
    const seen = new Set<string>();
    for (let t = 0; t < attempts; t++) {
      const i = 1 + Math.floor(Math.random() * (n - 1));
      const j = 1 + Math.floor(Math.random() * (n - 1));
      if (i === j) continue;
      if (deg[i] >= maxDeg || deg[j] >= maxDeg) continue;
      const k = edgeKey(i, j);
      if (seen.has(k)) continue;
      seen.add(k);
      if (hasEdge(edges, i, j)) continue;
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < relinkR && d > 18) {
        edges.push({
          a: i,
          b: j,
          restLength: d * 0.92,
          maxStretch: 2.05 + Math.random() * 0.45,
        });
        deg[i]++;
        deg[j]++;
      }
    }
  }

  if (edges.length < n) {
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      if (!hasEdge(edges, i, j)) {
        const A = nodes[i];
        const B = nodes[j];
        const d = Math.hypot(B.x - A.x, B.y - A.y) || 90;
        edges.push({
          a: i,
          b: j,
          restLength: Math.min(d, 120),
          maxStretch: 2.8,
        });
      }
    }
  }
}
