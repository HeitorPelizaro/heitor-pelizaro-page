const UNLOCK_KEY = "heitor_lab_glitch_unlocked";
const ENABLED_KEY = "heitor_lab_glitch_enabled";

export function readGlitchUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

export function readGlitchEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(ENABLED_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeGlitchUnlock(): void {
  try {
    localStorage.setItem(UNLOCK_KEY, "1");
    localStorage.setItem(ENABLED_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function writeGlitchEnabled(v: boolean): void {
  try {
    localStorage.setItem(ENABLED_KEY, v ? "1" : "0");
  } catch {
    /* ignore */
  }
}
