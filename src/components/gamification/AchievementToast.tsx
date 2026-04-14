"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ACHIEVEMENT_KEYS, loadUnlocked } from "@/lib/achievements";
import { messages } from "@/lib/i18n/messages";
import { useAppSettings } from "@/context/AppSettingsContext";

const CELEBRATE_REDIRECT_KEY = "heitor_lab_celebrate_redirect_v1";

export function AchievementToast() {
  const router = useRouter();
  const { locale, lastAchievement, clearLastAchievement } = useAppSettings();
  const t = messages[locale];

  useEffect(() => {
    if (!lastAchievement) return;
    const tmr = window.setTimeout(clearLastAchievement, 4200);
    return () => clearTimeout(tmr);
  }, [lastAchievement, clearLastAchievement]);

  useEffect(() => {
    if (!lastAchievement) return;
    if (loadUnlocked().size < ACHIEVEMENT_KEYS.length) return;
    const path = locale === "en" ? "/en/recompensa" : "/recompensa";
    const tmr = window.setTimeout(() => {
      if (sessionStorage.getItem(CELEBRATE_REDIRECT_KEY)) return;
      sessionStorage.setItem(CELEBRATE_REDIRECT_KEY, "1");
      router.replace(path);
    }, 1600);
    return () => clearTimeout(tmr);
  }, [lastAchievement, locale, router]);

  if (!lastAchievement) return null;
  const row = t.achievements.items[lastAchievement];
  if (!row) return null;

  return (
    <div
      className="panel-glass fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-[90] w-[min(100%,22rem)] max-w-[calc(100vw-1.5rem)] -translate-x-1/2 rounded-lg border border-[var(--neon-magenta)]/40 px-3 py-2.5 font-mono text-[11px] text-[var(--text-primary)] shadow-[0_0_30px_rgba(255,45,106,0.25)] sm:bottom-6 sm:max-w-sm sm:px-4 sm:py-3 sm:text-xs"
      role="status"
    >
      <p className="text-[10px] uppercase tracking-widest text-[var(--neon-cyan)]">
        {t.achievements.title}
      </p>
      <p className="mt-1 text-[var(--neon-amber)]">
        {row.name}{" "}
        <span className="text-[var(--text-muted)]">
          ({t.achievements.unlocked})
        </span>
      </p>
    </div>
  );
}
