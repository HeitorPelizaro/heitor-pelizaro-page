"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  col: string;
  size: number;
};

const COLORS = ["#00f0ff", "#ff2d6a", "#ffc857", "#e8e8ff"];

function burst(
  particles: Particle[],
  cx: number,
  cy: number,
  n: number,
  speed: number,
) {
  for (let i = 0; i < n; i++) {
    const ang = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.8;
    const sp = speed * (0.45 + Math.random() * 0.85);
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp - speed * 0.15,
      life: 0.92 + Math.random() * 0.28,
      col: COLORS[Math.floor(Math.random() * COLORS.length)] ?? "#00f0ff",
      size: 1.1 + Math.random() * 2.4,
    });
  }
}

export function RewardFireworks({ reduced }: { reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const burstTimerRef = useRef<number>(0);

  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles = particlesRef.current;
    particles.length = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const spawn = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = w * (0.15 + Math.random() * 0.7);
      const cy = h * (0.18 + Math.random() * 0.45);
      burst(particles, cx, cy, 52, 5 + Math.random() * 3);
    };

    spawn();
    spawn();
    burstTimerRef.current = window.setInterval(spawn, 520);

    const tick = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]!;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.11;
        p.vx *= 0.995;
        p.life -= 0.018;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.min(1, p.life);
        ctx.fillStyle = p.col;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.clearInterval(burstTimerRef.current);
      cancelAnimationFrame(rafRef.current);
      particles.length = 0;
    };
  }, [reduced]);

  if (reduced) {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-0 animate-pulse bg-[radial-gradient(circle_at_50%_30%,rgba(0,240,255,0.12),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(255,45,106,0.1),transparent_50%)]"
        aria-hidden
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden
    />
  );
}
