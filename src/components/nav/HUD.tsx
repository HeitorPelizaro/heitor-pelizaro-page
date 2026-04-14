"use client";

import Link from "next/link";
import { messages, type Locale } from "@/lib/i18n/messages";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useGlitchLab } from "@/context/GlitchLabThemeContext";

const sections = [
  { id: "hero", key: "hero" as const },
  { id: "skills", key: "skills" as const },
  { id: "projects", key: "projects" as const },
  { id: "authority", key: "authority" as const },
  { id: "contact", key: "contact" as const },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function HUD() {
  const {
    locale,
    performanceMode,
    setPerformanceMode,
    setReduceMotionOverride,
    effectiveReduceMotion,
    onAchievement,
  } = useAppSettings();
  const { unlocked: glitchUnlocked, enabled: glitchOn, setGlitchEnabled, hydrated: glitchHydrated } =
    useGlitchLab();
  const t = messages[locale];

  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex w-full max-w-[100vw] flex-col gap-2 px-2 pb-2 pt-[max(0.35rem,env(safe-area-inset-top))] sm:gap-3 sm:p-4 md:flex-row md:items-start md:justify-between md:p-6">
      <div className="panel-glass flex min-w-0 flex-wrap items-center gap-2 rounded-lg px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)] sm:px-3 sm:py-2 sm:text-[10px] sm:tracking-[0.2em] md:text-xs">
        <span className="text-[var(--neon-cyan)]">{t.hud.orbit}</span>
        <span className="opacity-40">|</span>
        <span>{t.hud.sys}</span>
        <span className="text-[var(--neon-amber)]">::</span>
        <span className="text-[var(--text-primary)]">ONLINE</span>
      </div>

      <nav
        className="panel-glass flex min-w-0 max-w-full flex-wrap items-center justify-center gap-0.5 rounded-lg px-1.5 py-1.5 sm:gap-1 sm:px-2 sm:py-2 md:max-w-[min(100%,520px)] md:justify-end md:gap-2"
        aria-label={locale === "pt" ? "Seções" : "Sections"}
      >
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToId(s.id)}
            className="rounded px-1.5 py-1 font-mono text-[9px] text-[var(--text-muted)] transition hover:bg-white/5 hover:text-[var(--neon-cyan)] sm:px-2 sm:text-[10px] md:text-xs"
          >
            {t.nav[s.key]}
          </button>
        ))}
      </nav>

      <div className="panel-glass grid w-full min-w-0 grid-cols-2 gap-x-2 gap-y-2 rounded-lg px-2 py-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 sm:px-3 md:flex-nowrap">
        <div className="col-span-2 flex items-center justify-center gap-2 sm:col-span-1 sm:justify-end">
          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            {t.hud.lang}
          </span>
          <div className="flex rounded border border-white/10">
            {(["pt", "en"] as Locale[]).map((l) => (
              <Link
                key={l}
                href={l === "pt" ? "/" : "/en/"}
                className={`px-2 py-0.5 font-mono text-[10px] uppercase ${
                  locale === l
                    ? "bg-[var(--neon-magenta)]/30 text-[var(--neon-cyan)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
                hrefLang={l === "pt" ? "pt-BR" : "en"}
                onClick={() => onAchievement("switched_lang")}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
        <label className="flex min-w-0 cursor-pointer items-center gap-1.5 font-mono text-[9px] text-[var(--text-muted)] sm:gap-2 sm:text-[10px]">
          <input
            type="checkbox"
            checked={performanceMode}
            onChange={(e) => setPerformanceMode(e.target.checked)}
            className="accent-[var(--neon-cyan)]"
          />
          <span className="min-w-0 leading-tight">{t.hud.perf}</span>
        </label>
        <label className="flex min-w-0 cursor-pointer items-center gap-1.5 font-mono text-[9px] text-[var(--text-muted)] sm:gap-2 sm:text-[10px]">
          <input
            type="checkbox"
            checked={effectiveReduceMotion}
            onChange={(e) =>
              setReduceMotionOverride(e.target.checked ? true : false)
            }
            className="accent-[var(--neon-magenta)]"
          />
          <span className="min-w-0 leading-tight">{t.hud.motion}</span>
        </label>
        {glitchHydrated && glitchUnlocked ? (
          <div className="col-span-2 flex items-center justify-center gap-2 sm:col-span-1 sm:justify-end">
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              {t.hud.glitch}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={glitchOn}
              aria-label={t.hud.glitchAria}
              title={locale === "pt" ? "Tema exclusivo (100% no lab)" : "Exclusive theme (lab 100%)"}
              onClick={() => setGlitchEnabled(!glitchOn)}
              className={`relative h-[22px] w-10 shrink-0 rounded-full border transition-colors duration-200 ease-out ${
                glitchOn
                  ? "border-[var(--neon-cyan)]/55 bg-[var(--neon-cyan)]/15"
                  : "border-white/25 bg-black/55"
              }`}
            >
              <span
                className={`pointer-events-none absolute top-[3px] left-[3px] h-4 w-4 rounded-full bg-[var(--text-primary)] shadow transition-transform duration-200 ease-out ${
                  glitchOn ? "translate-x-[18px]" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
