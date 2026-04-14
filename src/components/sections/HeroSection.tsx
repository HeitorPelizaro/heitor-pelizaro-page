"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { messages, type Locale } from "@/lib/i18n/messages";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeAccent } from "@/context/ThemeAccentContext";

/** Mesmo mapeamento da roda cônica: topo = 0° de matiz. */
function pointerToHue(clientX: number, clientY: number, el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const dx = clientX - (r.left + r.width / 2);
  const dy = clientY - (r.top + r.height / 2);
  const rad = Math.atan2(dy, dx);
  return ((rad * 180) / Math.PI + 90 + 360) % 360;
}

/**
 * Anel visual: div 79% de L; máscara radial ~58%–77% do raio desse div.
 * Hit-test alinhado + margem extra para clicar/arrastar com mais folga.
 */
function ringMetrics(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const L = Math.min(r.width, r.height);
  const half = (L * 0.79) / 2;
  const innerR = half * 0.52;
  const outerR = half * 0.82;
  return { r, innerR, outerR };
}

function distFromCardCenter(clientX: number, clientY: number, el: HTMLElement) {
  const { r } = ringMetrics(el);
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  return Math.hypot(clientX - cx, clientY - cy);
}

export function HeroSection({ locale }: { locale: Locale }) {
  const t = messages[locale].hero;
  const { applyFromHue, reset } = useThemeAccent();
  const { performanceMode, effectiveReduceMotion } = useAppSettings();
  const cardRef = useRef<HTMLDivElement>(null);
  const ringDrag = useRef(false);

  const simpleThemeUi = performanceMode || effectiveReduceMotion;

  const applyFromPointer = useCallback(
    (clientX: number, clientY: number, el: HTMLElement) => {
      applyFromHue(pointerToHue(clientX, clientY, el));
    },
    [applyFromHue]
  );

  const isInRing = useCallback((clientX: number, clientY: number) => {
    const el = cardRef.current;
    if (!el) return false;
    const d = distFromCardCenter(clientX, clientY, el);
    const { innerR, outerR } = ringMetrics(el);
    return d >= innerR && d <= outerR;
  }, []);

  const ringGradient =
    "conic-gradient(from 0deg, hsl(0,92%,55%), hsl(60,92%,52%), hsl(120,88%,48%), hsl(180,90%,50%), hsl(240,90%,58%), hsl(300,88%,58%), hsl(0,92%,55%))";

  return (
    <section
      id="hero"
      className="relative flex min-h-dvh flex-col justify-center px-4 pb-20 pt-[clamp(7.5rem,22vw,10rem)] sm:px-6 sm:pb-24 sm:pt-36 md:px-16 md:pt-32"
    >
      <div className="mx-auto grid w-full min-w-0 max-w-7xl gap-10 sm:gap-12 md:grid-cols-[1.72fr_1fr] md:items-center md:gap-x-10 lg:gap-x-16">
        <div className="min-w-0">
          <p className="break-words font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--neon-cyan)] sm:text-xs sm:tracking-[0.35em]">
            heitor.pelizaro.com.br
          </p>
          <h1 className="mt-3 font-sans text-3xl font-bold leading-[1.1] text-[var(--text-primary)] sm:mt-4 sm:text-5xl md:text-6xl">
            <span className="text-glow-cyan">Heitor</span>{" "}
            <span className="text-glow-magenta">Pelizaro</span>
          </h1>
          <p className="mt-4 font-mono text-sm text-[var(--neon-amber)] md:text-base">
            {t.role}
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--text-muted)] sm:mt-6 sm:text-lg md:text-xl">
            {t.tagline}
          </p>
          <p className="mt-3 max-w-xl text-sm italic leading-relaxed text-[var(--text-muted)]/90 sm:mt-4">
            {t.sub}
          </p>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[min(260px,88vw)] sm:max-w-[300px] md:mx-0 md:ml-auto md:w-[min(92vw,270px)] md:-mr-1 lg:w-[min(92vw,288px)] lg:translate-x-3 lg:-mr-3 xl:translate-x-5 xl:-mr-4">
          <div
            ref={cardRef}
            role="group"
            aria-label={t.themePicker}
            aria-describedby="hero-theme-hint"
            className="relative aspect-square w-full select-none bg-transparent [-webkit-tap-highlight-color:transparent] outline-none focus-visible:rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--neon-cyan)]"
            tabIndex={0}
            onPointerDown={(e) => {
              const el = cardRef.current;
              if (!el || simpleThemeUi) return;
              if (ringDrag.current) return;
              if (!isInRing(e.clientX, e.clientY)) return;
              ringDrag.current = true;

              const onMove = (ev: PointerEvent) => {
                if (!ringDrag.current) return;
                const box = cardRef.current;
                if (!box) return;
                applyFromPointer(ev.clientX, ev.clientY, box);
              };
              const onUp = () => {
                ringDrag.current = false;
                window.removeEventListener("pointermove", onMove);
                window.removeEventListener("pointerup", onUp);
                window.removeEventListener("pointercancel", onUp);
              };

              window.addEventListener("pointermove", onMove, { passive: true });
              window.addEventListener("pointerup", onUp);
              window.addEventListener("pointercancel", onUp);
              applyFromPointer(e.clientX, e.clientY, el);
            }}
          >
            <Image
              src="/heitor.svg"
              alt="Heitor Pelizaro"
              width={400}
              height={400}
              draggable={false}
              className={`relative z-0 h-full w-full object-contain select-none ${!simpleThemeUi ? "pointer-events-none" : ""}`}
              priority
            />
            {!simpleThemeUi && (
              <div
                className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
                aria-hidden
              >
                <div
                  className="aspect-square h-[79%] w-[79%] rounded-full"
                  style={{
                    background: ringGradient,
                    boxShadow:
                      "0 0 16px color-mix(in srgb, var(--neon-cyan) 20%, transparent)",
                    maskImage:
                      "radial-gradient(circle, transparent 58%, black 59.5%, black 77%, transparent 78.5%)",
                    WebkitMaskImage:
                      "radial-gradient(circle, transparent 58%, black 59.5%, black 77%, transparent 78.5%)",
                    maskSize: "100% 100%",
                    WebkitMaskSize: "100% 100%",
                  }}
                />
              </div>
            )}
          </div>
          <p
            id="hero-theme-hint"
            className="mt-2 text-center font-mono text-[10px] text-[var(--text-muted)]"
          >
            {simpleThemeUi ? t.themeSimpleHint : t.themeRingHint}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-1 w-full font-mono text-[10px] uppercase tracking-wider text-[var(--neon-cyan)] underline decoration-[var(--border-glow)] underline-offset-2 hover:text-[var(--neon-magenta)]"
          >
            {t.themeReset}
          </button>
        </div>
      </div>
    </section>
  );
}
