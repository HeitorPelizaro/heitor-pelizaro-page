"use client";

import { useEffect } from "react";
import { messages } from "@/lib/i18n/messages";
import { useAppSettings } from "@/context/AppSettingsContext";
import type { AchievementId } from "@/lib/achievements";

const labels: Record<
  AchievementId,
  keyof (typeof messages)["pt"]["achievements"]
> = {
  a11y_motion: "a11y",
  performance_mode: "perf",
  switched_lang: "lang",
  visited_projects: "projects",
  easter_egg: "egg",
};

export function AchievementToast() {
  const { locale, lastAchievement, clearLastAchievement } = useAppSettings();
  const t = messages[locale];

  useEffect(() => {
    if (!lastAchievement) return;
    const tmr = window.setTimeout(clearLastAchievement, 4200);
    return () => clearTimeout(tmr);
  }, [lastAchievement, clearLastAchievement]);

  if (!lastAchievement) return null;
  const key = labels[lastAchievement];

  return (
    <div
      className="panel-glass fixed bottom-6 left-1/2 z-[90] max-w-sm -translate-x-1/2 rounded-lg border border-[var(--neon-magenta)]/40 px-4 py-3 font-mono text-xs text-[var(--text-primary)] shadow-[0_0_30px_rgba(255,45,106,0.25)]"
      role="status"
    >
      <p className="text-[10px] uppercase tracking-widest text-[var(--neon-cyan)]">
        {t.achievements.title}
      </p>
      <p className="mt-1 text-[var(--neon-amber)]">
        {(t.achievements as Record<string, string>)[key]}{" "}
        <span className="text-[var(--text-muted)]">
          — {t.achievements.unlocked}
        </span>
      </p>
    </div>
  );
}
