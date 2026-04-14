"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  readGlitchEnabled,
  readGlitchUnlocked,
  writeGlitchEnabled,
  writeGlitchUnlock,
} from "@/lib/glitchLabTheme";

type GlitchLabCtx = {
  unlocked: boolean;
  enabled: boolean;
  hydrated: boolean;
  unlockLabTheme: () => void;
  setGlitchEnabled: (v: boolean) => void;
};

const Ctx = createContext<GlitchLabCtx | null>(null);

export function GlitchLabThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUnlocked(readGlitchUnlocked());
    setEnabled(readGlitchEnabled());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      const on = unlocked && enabled;
      const reduced = mq.matches;
      root.classList.toggle("glitch-lab-active", on);
      root.classList.toggle("glitch-lab-reduced", on && reduced);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      root.classList.remove("glitch-lab-active", "glitch-lab-reduced");
    };
  }, [hydrated, unlocked, enabled]);

  const unlockLabTheme = useCallback(() => {
    writeGlitchUnlock();
    setUnlocked(true);
    setEnabled(true);
  }, []);

  const setGlitchEnabled = useCallback((v: boolean) => {
    if (!unlocked) return;
    writeGlitchEnabled(v);
    setEnabled(v);
  }, [unlocked]);

  const value = useMemo(
    () => ({
      unlocked,
      enabled,
      hydrated,
      unlockLabTheme,
      setGlitchEnabled,
    }),
    [unlocked, enabled, hydrated, unlockLabTheme, setGlitchEnabled],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGlitchLab() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useGlitchLab outside GlitchLabThemeProvider");
  return v;
}
