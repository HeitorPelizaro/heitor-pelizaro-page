"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { messages, type Locale } from "@/lib/i18n/messages";
import { EMAIL, GITHUB_URL } from "@/lib/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeAccent } from "@/context/ThemeAccentContext";

function pointerToHue(clientX: number, clientY: number, el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const dx = clientX - (r.left + r.width / 2);
  const dy = clientY - (r.top + r.height / 2);
  const rad = Math.atan2(dy, dx);
  return ((rad * 180) / Math.PI + 90 + 360) % 360;
}

export function HeroSection({ locale }: { locale: Locale }) {
  const t = messages[locale].hero;
  const { applyFromHue, reset } = useThemeAccent();
  const { performanceMode, effectiveReduceMotion } = useAppSettings();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const simpleThemeUi = performanceMode || effectiveReduceMotion;

  const applyFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const el = wheelRef.current;
      if (!el) return;
      applyFromHue(pointerToHue(clientX, clientY, el));
    },
    [applyFromHue]
  );

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => {
      const root = wrapRef.current;
      if (!root?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] flex-col justify-center px-6 pb-24 pt-32 md:px-16"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--neon-cyan)]">
            heitor.pelizaro.com.br
          </p>
          <h1 className="mt-4 font-sans text-4xl font-bold leading-tight text-[var(--text-primary)] md:text-6xl">
            <span className="text-glow-cyan">Heitor</span>{" "}
            <span className="text-glow-magenta">Pelizaro</span>
          </h1>
          <p className="mt-4 font-mono text-sm text-[var(--neon-amber)] md:text-base">
            {t.role}
          </p>
          <p className="mt-6 max-w-xl text-lg text-[var(--text-muted)] md:text-xl">
            {t.tagline}
          </p>
          <p className="mt-4 max-w-xl text-sm italic text-[var(--text-muted)]/90">
            {t.sub}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <MagneticButton
              href={GITHUB_URL}
              external
              className="panel-glass rounded-lg px-6 py-3 font-mono text-sm text-[var(--neon-cyan)] transition hover:border-[var(--neon-magenta)]"
            >
              {t.ctaGithub}
            </MagneticButton>
            <MagneticButton
              href={`mailto:${EMAIL}`}
              className="panel-glass rounded-lg px-6 py-3 font-mono text-sm text-[var(--neon-magenta)] transition hover:border-[var(--neon-cyan)]"
            >
              {t.ctaEmail}
            </MagneticButton>
          </div>
        </div>
        <div ref={wrapRef} className="relative mx-auto aspect-square w-full max-w-[320px] md:max-w-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-magenta)]/20 blur-2xl" />
          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label={t.themePicker}
            onClick={() => setOpen((o) => !o)}
            className="panel-glass relative w-full overflow-hidden rounded-2xl border-2 border-[var(--border-glow)] text-left outline-none ring-offset-2 ring-offset-[var(--bg-deep)] focus-visible:ring-2 focus-visible:ring-[var(--neon-cyan)]"
          >
            <Image
              src="/heitor.svg"
              alt="Heitor Pelizaro"
              width={400}
              height={400}
              className="h-full w-full object-cover"
              priority
            />
          </button>
          {open && (
            <div
              role="dialog"
              aria-label={t.themePicker}
              className="absolute left-1/2 top-full z-20 mt-3 w-[min(100%,280px)] -translate-x-1/2 rounded-xl border border-[var(--border-glow)] bg-[var(--bg-panel)] p-4 shadow-lg backdrop-blur-md md:left-auto md:right-0 md:translate-x-0"
            >
              {!simpleThemeUi ? (
                <>
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    {t.themeWheelHint}
                  </p>
                  <div
                    ref={wheelRef}
                    className="mx-auto size-36 cursor-pointer touch-none rounded-full"
                    style={{
                      boxShadow:
                        "0 0 24px color-mix(in srgb, var(--neon-cyan) 25%, transparent)",
                      background:
                        "conic-gradient(from 0deg, hsl(0,92%,55%), hsl(60,92%,52%), hsl(120,88%,48%), hsl(180,90%,50%), hsl(240,90%,58%), hsl(300,88%,58%), hsl(0,92%,55%))",
                    }}
                    onPointerDown={(e) => {
                      e.currentTarget.setPointerCapture(e.pointerId);
                      applyFromPointer(e.clientX, e.clientY);
                    }}
                    onPointerMove={(e) => {
                      if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
                      applyFromPointer(e.clientX, e.clientY);
                    }}
                  />
                </>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
                className="mt-4 w-full rounded-lg border border-[var(--border-glow)] py-2 font-mono text-xs text-[var(--neon-cyan)] transition hover:bg-[var(--neon-cyan)]/10"
              >
                {t.themeReset}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
