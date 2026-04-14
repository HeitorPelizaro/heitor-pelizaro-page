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
    <header className="fixed left-0 right-0 top-0 z-40 flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between md:p-6">
      <div className="panel-glass flex flex-wrap items-center gap-2 rounded-lg px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] md:text-xs">
        <span className="text-[var(--neon-cyan)]">{t.hud.orbit}</span>
        <span className="opacity-40">|</span>
        <span>{t.hud.sys}</span>
        <span className="text-[var(--neon-amber)]">::</span>
        <span className="text-[var(--text-primary)]">ONLINE</span>
      </div>

      <nav
        className="panel-glass flex max-w-full flex-wrap items-center justify-center gap-1 rounded-lg px-2 py-2 md:max-w-[min(100%,520px)] md:justify-end md:gap-2"
        aria-label={locale === "pt" ? "Seções" : "Sections"}
      >
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToId(s.id)}
            className="rounded px-2 py-1 font-mono text-[10px] text-[var(--text-muted)] transition hover:bg-white/5 hover:text-[var(--neon-cyan)] md:text-xs"
          >
            {t.nav[s.key]}
          </button>
        ))}
      </nav>

      <div className="panel-glass flex flex-wrap items-center justify-end gap-3 rounded-lg px-3 py-2 md:flex-nowrap">
        <div className="flex items-center gap-2">
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
        <label className="flex cursor-pointer items-center gap-2 font-mono text-[10px] text-[var(--text-muted)]">
          <input
            type="checkbox"
            checked={performanceMode}
            onChange={(e) => setPerformanceMode(e.target.checked)}
            className="accent-[var(--neon-cyan)]"
          />
          {t.hud.perf}
        </label>
        <label className="flex cursor-pointer items-center gap-2 font-mono text-[10px] text-[var(--text-muted)]">
          <input
            type="checkbox"
            checked={effectiveReduceMotion}
            onChange={(e) =>
              setReduceMotionOverride(e.target.checked ? true : false)
            }
            className="accent-[var(--neon-magenta)]"
          />
          {t.hud.motion}
        </label>
        {glitchHydrated && glitchUnlocked ? (
          <label
            className="flex cursor-pointer items-center gap-2 font-mono text-[10px] text-[var(--neon-amber)]"
            title={locale === "pt" ? "Tema exclusivo do lab 100%" : "Exclusive lab-100% theme"}
          >
            <input
              type="checkbox"
              checked={glitchOn}
              onChange={(e) => setGlitchEnabled(e.target.checked)}
              className="accent-[var(--neon-amber)]"
            />
            {t.hud.glitch}
          </label>
        ) : null}
      </div>
    </header>
  );
}
