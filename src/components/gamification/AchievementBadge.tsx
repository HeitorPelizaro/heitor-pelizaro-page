"use client";

import { useEffect, useState } from "react";
import { ACHIEVEMENT_KEYS, loadUnlocked } from "@/lib/achievements";
import { messages } from "@/lib/i18n/messages";
import { useAppSettings } from "@/context/AppSettingsContext";

export function AchievementBadge() {
  const { locale, lastAchievement } = useAppSettings();
  const t = messages[locale];
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(loadUnlocked().size);
  }, [lastAchievement]);

  return (
    <div
      className="panel-glass fixed bottom-6 right-6 z-[85] hidden rounded-lg px-3 py-2 font-mono text-[10px] text-[var(--text-muted)] md:block"
      title={t.achievements.title}
    >
      <span className="text-[var(--neon-cyan)]">ACH</span>{" "}
      <span className="text-[var(--text-primary)]">
        {count}/{ACHIEVEMENT_KEYS.length}
      </span>
    </div>
  );
}
