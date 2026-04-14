export const ACHIEVEMENT_KEYS = [
  "a11y_motion",
  "performance_mode",
  "switched_lang",
  "visited_projects",
  "graph_untangle",
  "theme_chroma_3",
  "easter_egg",
] as const;

export type AchievementId = (typeof ACHIEVEMENT_KEYS)[number];

const STORAGE_KEY = "heitor_lab_achievements";

export function loadUnlocked(): Set<AchievementId> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(
      arr.filter((k): k is AchievementId =>
        ACHIEVEMENT_KEYS.includes(k as AchievementId),
      ),
    );
  } catch {
    return new Set();
  }
}

export function saveUnlocked(set: Set<AchievementId>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

export function unlock(id: AchievementId, onNew?: (id: AchievementId) => void) {
  const current = loadUnlocked();
  if (current.has(id)) return;
  current.add(id);
  saveUnlocked(current);
  onNew?.(id);
}
