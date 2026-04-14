"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { hexToRgb, hslToHex } from "@/lib/cssColor";
import { useAppSettings } from "@/context/AppSettingsContext";

const STORAGE_KEY = "heitor_lab_theme";

export const DEFAULT_CYAN = "#00f0ff";
export const DEFAULT_MAGENTA = "#ff2d6a";

type ThemeState = {
  cyan: string;
  magenta: string;
};

type Ctx = ThemeState & {
  applyFromHue: (hueDeg: number) => void;
  applyPair: (cyan: string, magenta: string) => void;
  reset: () => void;
  version: number;
};

const ThemeCtx = createContext<Ctx | null>(null);

function applyToRoot(cyan: string, magenta: string) {
  const root = document.documentElement;
  root.style.setProperty("--neon-cyan", cyan);
  root.style.setProperty("--neon-magenta", magenta);
  const c = hexToRgb(cyan);
  const m = hexToRgb(magenta);
  if (c) {
    root.style.setProperty(
      "--border-glow",
      `rgba(${c.r}, ${c.g}, ${c.b}, 0.35)`
    );
    root.style.setProperty(
      "--grid-line",
      `rgba(${c.r}, ${c.g}, ${c.b}, 0.08)`
    );
  }
  if (m) {
    root.style.setProperty("--danger", magenta);
  }
}

function loadStored(): ThemeState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const j = JSON.parse(raw) as { cyan?: string; magenta?: string };
    if (typeof j.cyan === "string" && typeof j.magenta === "string")
      return { cyan: j.cyan, magenta: j.magenta };
  } catch {
    /* ignore */
  }
  return null;
}

function saveStored(s: ThemeState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function ThemeAccentProvider({ children }: { children: ReactNode }) {
  const { onAchievement } = useAppSettings();
  const [state, setState] = useState<ThemeState>({
    cyan: DEFAULT_CYAN,
    magenta: DEFAULT_MAGENTA,
  });
  const [version, setVersion] = useState(0);

  useLayoutEffect(() => {
    const stored = loadStored();
    if (stored) {
      applyToRoot(stored.cyan, stored.magenta);
      setState(stored);
    } else {
      applyToRoot(DEFAULT_CYAN, DEFAULT_MAGENTA);
    }
  }, []);

  const applyPair = useCallback(
    (cyan: string, magenta: string) => {
      setState({ cyan, magenta });
      applyToRoot(cyan, magenta);
      saveStored({ cyan, magenta });
      setVersion((v) => {
        const nv = v + 1;
        if (nv >= 3) {
          queueMicrotask(() => onAchievement("theme_chroma_3"));
        }
        return nv;
      });
    },
    [onAchievement],
  );

  const applyFromHue = useCallback(
    (hueDeg: number) => {
      const h = ((hueDeg % 360) + 360) % 360;
      const cyan = hslToHex(h, 92, 55);
      const magenta = hslToHex((h + 168) % 360, 88, 58);
      applyPair(cyan, magenta);
    },
    [applyPair]
  );

  const reset = useCallback(() => {
    applyPair(DEFAULT_CYAN, DEFAULT_MAGENTA);
  }, [applyPair]);

  const value = useMemo(
    () => ({
      ...state,
      applyFromHue,
      applyPair,
      reset,
      version,
    }),
    [state, applyFromHue, applyPair, reset, version]
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useThemeAccent() {
  const v = useContext(ThemeCtx);
  if (!v) throw new Error("useThemeAccent outside ThemeAccentProvider");
  return v;
}
