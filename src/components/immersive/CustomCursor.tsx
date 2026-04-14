"use client";

import { useEffect, useRef } from "react";
import { useAppSettings } from "@/context/AppSettingsContext";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const { immersiveCursor } = useAppSettings();

  useEffect(() => {
    if (!immersiveCursor) return;

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0)`;
      }
    };

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx - 16}px, ${ry - 16}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [immersiveCursor]);

  if (!immersiveCursor) return null;

  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-8 w-8 rounded-full border border-[var(--neon-cyan)] mix-blend-difference md:block"
        style={{ willChange: "transform" }}
        aria-hidden
      />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[101] hidden h-2 w-2 rounded-full bg-[var(--neon-magenta)] shadow-[0_0_12px_var(--neon-magenta)] md:block"
        style={{ willChange: "transform" }}
        aria-hidden
      />
    </>
  );
}
