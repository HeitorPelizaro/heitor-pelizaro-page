"use client";

import { useCallback, useEffect, useState } from "react";
import { ACHIEVEMENT_KEYS, loadUnlocked, type AchievementId } from "@/lib/achievements";
import { messages } from "@/lib/i18n/messages";
import { useAppSettings } from "@/context/AppSettingsContext";

export function AchievementBadge() {
  const { locale, lastAchievement } = useAppSettings();
  const t = messages[locale];
  const items = t.achievements.items;
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [unlocked, setUnlocked] = useState<Set<AchievementId>>(new Set());

  const refresh = useCallback(() => {
    const s = loadUnlocked();
    setUnlocked(s);
    setCount(s.size);
  }, []);

  useEffect(() => {
    refresh();
  }, [lastAchievement, refresh]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          refresh();
          setOpen(true);
        }}
        className="panel-glass fixed bottom-24 right-4 z-[85] cursor-pointer rounded-lg px-3 py-2 text-left font-mono text-[10px] text-[var(--text-muted)] transition hover:border-[var(--neon-cyan)]/40 hover:text-[var(--text-primary)] md:bottom-6 md:right-6"
        title={t.achievements.title}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span className="text-[var(--neon-cyan)]">ACH</span>{" "}
        <span className="text-[var(--text-primary)]">
          {count}/{ACHIEVEMENT_KEYS.length}
        </span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[95] flex items-end justify-end p-4 md:items-center md:justify-center md:p-8"
          role="dialog"
          aria-modal
          aria-labelledby="ach-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            aria-label={t.achievements.close}
            onClick={() => setOpen(false)}
          />
          <div className="panel-glass relative z-[1] max-h-[min(72dvh,520px)] w-full max-w-md overflow-hidden rounded-2xl border border-white/15 shadow-[0_0_40px_rgba(0,240,255,0.08)]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h2
                id="ach-modal-title"
                className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--neon-cyan)]"
              >
                {t.achievements.title}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded px-2 py-1 font-mono text-[10px] text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text-primary)]"
              >
                {t.achievements.close}
              </button>
            </div>
            <ul className="max-h-[min(60dvh,440px)] space-y-2 overflow-y-auto p-3 font-mono text-xs">
              {ACHIEVEMENT_KEYS.map((id) => {
                const ok = unlocked.has(id);
                const row = items[id];
                return (
                  <li
                    key={id}
                    className={`rounded-lg border px-3 py-2.5 ${
                      ok
                        ? "border-[var(--neon-magenta)]/35 bg-[var(--neon-magenta)]/5"
                        : "border-white/10 bg-black/20 opacity-75"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={
                          ok
                            ? "text-[var(--neon-amber)]"
                            : "text-[var(--text-muted)]"
                        }
                      >
                        {row.name}
                      </p>
                      <span
                        className={`shrink-0 text-[9px] uppercase tracking-wider ${
                          ok ? "text-[var(--neon-cyan)]" : "text-[var(--text-muted)]"
                        }`}
                      >
                        {ok ? "✓" : t.achievements.lockedLabel}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] leading-relaxed text-[var(--text-muted)]">
                      {row.desc}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
