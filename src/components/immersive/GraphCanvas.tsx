"use client";

import { useEffect, useRef } from "react";
import { useAppSettings } from "@/context/AppSettingsContext";

type Node = { x: number; y: number; vx: number; vy: number; id: number };
type Edge = { a: number; b: number };

function buildGraph(nNodes: number, w: number, h: number) {
  const nodes: Node[] = [];
  for (let i = 0; i < nNodes; i++) {
    nodes.push({
      id: i,
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0,
      vy: 0,
    });
  }
  const edges: Edge[] = [];
  for (let i = 0; i < nNodes; i++) {
    edges.push({ a: i, b: (i + 1) % nNodes });
    edges.push({ a: i, b: (i + 7) % nNodes });
  }
  return { nodes, edges };
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

    const attractR = performanceMode ? 120 : 200;
    const repulse = 4200;
    const spring = 0.018;
    const damping = 0.92;

    const step = () => {
      const { nodes, edges } = graph;
      const w = window.innerWidth;
      const h = window.innerHeight;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const d2 = dx * dx + dy * dy + 40;
          const f = repulse / d2;
          const nx = (dx / Math.sqrt(d2)) * f;
          const ny = (dy / Math.sqrt(d2)) * f;
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

      if (mouse.current.active) {
        const mx = mouse.current.x;
        const my = mouse.current.y;
        for (const n of nodes) {
          const dx = n.x - mx;
          const dy = n.y - my;
          const d = Math.sqrt(dx * dx + dy * dy) + 1;
          if (d < attractR * 2.5) {
            const pull = (1 - d / (attractR * 2.5)) * 0.85;
            n.vx -= (dx / d) * pull * 3;
            n.vy -= (dy / d) * pull * 3;
          }
        }
      }

      for (const n of nodes) {
        n.vx *= damping;
        n.vy *= damping;
        n.x += n.vx;
        n.y += n.vy;
        n.x = Math.max(8, Math.min(w - 8, n.x));
        n.y = Math.max(8, Math.min(h - 8, n.y));
      }

      ctx.fillStyle = "rgba(3, 6, 10, 0.22)";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(0, 240, 255, 0.14)";
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
        g.addColorStop(0, "rgba(0, 240, 255, 0.95)");
        g.addColorStop(0.5, "rgba(255, 45, 106, 0.35)");
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

