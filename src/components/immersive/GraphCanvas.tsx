"use client";

import { useEffect, useRef } from "react";
import { useAppSettings } from "@/context/AppSettingsContext";
import { hexToRgb, readCssHexVar } from "@/lib/cssColor";

type Node = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  restX: number;
  restY: number;
  pinned: boolean;
};
type Edge = { a: number; b: number };

function buildGraph(nNodes: number, w: number, h: number) {
  const cx = w / 2;
  const cy = h / 2;
  const spreadR = Math.min(w, h) * 0.22;
  const nodes: Node[] = [];

  nodes.push({
    id: 0,
    x: cx,
    y: cy,
    vx: 0,
    vy: 0,
    restX: cx,
    restY: cy,
    pinned: true,
  });

  const ring = Math.max(1, nNodes - 1);
  for (let i = 1; i < nNodes; i++) {
    const t = ((i - 1) / ring) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
    const rr = spreadR * (0.28 + Math.random() * 0.72);
    const restX = cx + Math.cos(t) * rr;
    const restY = cy + Math.sin(t) * rr;
    nodes.push({
      id: i,
      x: restX + (Math.random() - 0.5) * 10,
      y: restY + (Math.random() - 0.5) * 10,
      vx: 0,
      vy: 0,
      restX,
      restY,
      pinned: false,
    });
  }

  const edges: Edge[] = [];
  for (let i = 0; i < nNodes; i++) {
    edges.push({ a: i, b: (i + 1) % nNodes });
    edges.push({ a: i, b: (i + 7) % nNodes });
  }
  return { nodes, edges, cx, cy };
}

export function GraphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, active: false });
  const { performanceMode, effectiveReduceMotion } = useAppSettings();

  useEffect(() => {
    if (effectiveReduceMotion || performanceMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let graph = buildGraph(64, 1, 1);
    let colorFrame = 0;
    let strokeRgb = "0, 240, 255";
    let gradC = "0, 240, 255";
    let gradM = "255, 45, 106";

    const syncColors = () => {
      const cyanH = readCssHexVar("--neon-cyan", "#00f0ff");
      const magH = readCssHexVar("--neon-magenta", "#ff2d6a");
      const c = hexToRgb(cyanH);
      const m = hexToRgb(magH);
      if (c) strokeRgb = `${c.r}, ${c.g}, ${c.b}`;
      if (c) gradC = `${c.r}, ${c.g}, ${c.b}`;
      if (m) gradM = `${m.r}, ${m.g}, ${m.b}`;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = performanceMode ? 24 : 64;
      graph = buildGraph(count, w, h);
      syncColors();
    };

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.active = true;
    };
    const onLeave = () => {
      mouse.current.active = false;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const attractR = performanceMode ? 100 : 165;
    const repulse = 4200;
    const spring = 0.018;
    /** Mais baixo = nós “respiram” mais com o rato; nó fixo + molas das arestas mantêm o conjunto no centro. */
    const kHome = 0.017;
    const damping = 0.91;

    const step = () => {
      const { nodes, edges, cx, cy } = graph;
      const w = window.innerWidth;
      const h = window.innerHeight;

      colorFrame += 1;
      if (colorFrame % 6 === 0) syncColors();

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const d2 = dx * dx + dy * dy + 40;
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

      for (const e of edges) {
        const A = nodes[e.a];
        const B = nodes[e.b];
        const dx = B.x - A.x;
        const dy = B.y - A.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const rest = 90 + (e.a % 5) * 12;
        const force = (dist - rest) * spring;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        A.vx += fx;
        A.vy += fy;
        B.vx -= fx;
        B.vy -= fy;
      }

      for (const n of nodes) {
        if (!n.pinned) {
          n.vx += kHome * (n.restX - n.x);
          n.vy += kHome * (n.restY - n.y);
        }
      }

      if (mouse.current.active) {
        const mx = mouse.current.x;
        const my = mouse.current.y;
        const outer = attractR * 2.25;
        for (const n of nodes) {
          if (n.pinned) continue;
          const dx = n.x - mx;
          const dy = n.y - my;
          const d = Math.sqrt(dx * dx + dy * dy) + 1;
          if (d < outer) {
            const falloff = 1 - d / outer;
            const pull = falloff * 0.62;
            /* Aproximar / afastar do cursor */
            n.vx -= (dx / d) * pull * 2.1;
            n.vy -= (dy / d) * pull * 2.1;
            /* Componente tangencial: “ondulação” sem arrastar o blob inteiro */
            const tx = -dy / d;
            const ty = dx / d;
            const swirl = falloff * 0.38;
            n.vx += tx * swirl;
            n.vy += ty * swirl;
          }
        }
      }

      for (const n of nodes) {
        n.vx *= damping;
        n.vy *= damping;
        n.x += n.vx;
        n.y += n.vy;
        if (n.pinned) {
          n.x = cx;
          n.y = cy;
          n.vx = 0;
          n.vy = 0;
        } else {
          n.x = Math.max(8, Math.min(w - 8, n.x));
          n.y = Math.max(8, Math.min(h - 8, n.y));
        }
      }

      ctx.fillStyle = "rgba(3, 6, 10, 0.22)";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = `rgba(${strokeRgb}, 0.14)`;
      ctx.lineWidth = 1;
      for (const e of edges) {
        const A = nodes[e.a];
        const B = nodes[e.b];
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
      }

      for (const n of nodes) {
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 5);
        g.addColorStop(0, `rgba(${gradC}, 0.95)`);
        g.addColorStop(0.5, `rgba(${gradM}, 0.35)`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [performanceMode, effectiveReduceMotion]);

  if (effectiveReduceMotion || performanceMode) {
    return (
      <div
        className="pointer-events-none fixed inset-0 -z-10 cyber-grid opacity-40"
        aria-hidden
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      aria-hidden
    />
  );
}
