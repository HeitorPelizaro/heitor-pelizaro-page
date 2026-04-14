"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { messages, type Locale } from "@/lib/i18n/messages";
import { useGlitchLab } from "@/context/GlitchLabThemeContext";

function localeFromPath(pathname: string | null): Locale {
  if (!pathname) return "pt";
  return pathname.startsWith("/en") ? "en" : "pt";
}

export function GlitchInteractiveLayer() {
  const pathname = usePathname();
  const { enabled, unlocked, hydrated } = useGlitchLab();
  const [flare, setFlare] = useState<string | null>(null);
  const raf = useRef<number>(0);
  const last = useRef({ x: -1, y: -1 });
  /** IDs de timer no browser são `number`; evita colisão NodeJS.Timeout vs DOM no `next build`. */
  const flareTimerRef = useRef<number | null>(null);
  const loopTimerRef = useRef<number | null>(null);

  const onMouseMove = useCallback((e: MouseEvent) => {
    const dx = Math.abs(e.clientX - last.current.x);
    const dy = Math.abs(e.clientY - last.current.y);
    if (dx + dy < 4) return;
    last.current = { x: e.clientX, y: e.clientY };
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      document.documentElement.style.setProperty(
        "--glitch-cx",
        `${((e.clientX / w) * 100).toFixed(2)}%`,
      );
      document.documentElement.style.setProperty(
        "--glitch-cy",
        `${((e.clientY / h) * 100).toFixed(2)}%`,
      );
    });
  }, []);

  useEffect(() => {
    if (!hydrated || !unlocked || !enabled) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const onClick = () => {
      document.documentElement.classList.add("glitch-lab-flash");
      window.setTimeout(() => {
        document.documentElement.classList.remove("glitch-lab-flash");
      }, 120);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("click", onClick, true);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick, true);
      if (raf.current) cancelAnimationFrame(raf.current);
      document.documentElement.style.removeProperty("--glitch-cx");
      document.documentElement.style.removeProperty("--glitch-cy");
      document.documentElement.classList.remove("glitch-lab-flash");
    };
  }, [hydrated, unlocked, enabled, onMouseMove]);

  useEffect(() => {
    if (!hydrated || !unlocked || !enabled) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const flares = messages[localeFromPath(pathname)].glitchLab.flares;
    let cancelled = false;

    const scheduleNext = () => {
      if (cancelled) return;
      const delay = 22000 + Math.floor(Math.random() * 28000);
      loopTimerRef.current = window.setTimeout(() => {
        if (cancelled) return;
        const msg = flares[Math.floor(Math.random() * flares.length)] ?? "";
        setFlare(msg);
        if (flareTimerRef.current) window.clearTimeout(flareTimerRef.current);
        flareTimerRef.current = window.setTimeout(() => {
          setFlare(null);
          flareTimerRef.current = null;
        }, 2600);
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      cancelled = true;
      if (loopTimerRef.current) window.clearTimeout(loopTimerRef.current);
      if (flareTimerRef.current) window.clearTimeout(flareTimerRef.current);
      loopTimerRef.current = null;
      flareTimerRef.current = null;
      setFlare(null);
    };
  }, [hydrated, unlocked, enabled, pathname]);

  if (!hydrated || !unlocked || !enabled) return null;
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return null;
  }

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[46]"
        aria-hidden
        style={{
          background: `
            radial-gradient(340px circle at var(--glitch-cx, 50%) var(--glitch-cy, 42%),
              color-mix(in srgb, var(--neon-cyan) 12%, transparent) 0%,
              transparent 70%),
            radial-gradient(200px circle at calc(var(--glitch-cx, 50%) + 6%) calc(var(--glitch-cy, 42%) - 5%),
              color-mix(in srgb, var(--neon-magenta) 10%, transparent) 0%,
              transparent 68%)
          `,
        }}
      />
      {flare ? (
        <div
          className="pointer-events-none fixed bottom-4 left-4 z-[53] max-w-[min(92vw,300px)] font-mono text-[9px] leading-snug text-[var(--neon-amber)]"
          aria-hidden
        >
          <span className="inline-block border border-[var(--neon-magenta)]/30 bg-black/75 px-2 py-1 text-[var(--text-primary)]">
            {flare}
          </span>
        </div>
      ) : null}
    </>
  );
}
