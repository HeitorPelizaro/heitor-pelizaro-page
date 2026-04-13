"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Locale } from "@/lib/i18n/messages";
import { unlock, type AchievementId } from "@/lib/achievements";

type AppSettings = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  performanceMode: boolean;
  setPerformanceMode: (v: boolean) => void;
  reduceMotionOverride: boolean | null;
  setReduceMotionOverride: (v: boolean | null) => void;
  effectiveReduceMotion: boolean;
  immersiveCursor: boolean;
  onAchievement: (id: AchievementId) => void;
  lastAchievement: AchievementId | null;
  clearLastAchievement: () => void;
};

const Ctx = createContext<AppSettings | null>(null);

const PERF_KEY = "heitor_lab_performance";
const MOTION_KEY = "heitor_lab_reduce_motion_override";

export function AppSettingsProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [performanceMode, setPerformanceModeState] = useState(false);
  const [reduceMotionOverride, setReduceMotionOverrideState] = useState<
    boolean | null
  >(null);
  const [systemReduceMotion, setSystemReduceMotion] = useState(false);
  const [lastAchievement, setLastAchievement] =
    useState<AchievementId | null>(null);

  useEffect(() => {
    try {
      const p = localStorage.getItem(PERF_KEY);
      if (p === "1") setPerformanceModeState(true);
      const m = localStorage.getItem(MOTION_KEY);
      if (m === "1") setReduceMotionOverrideState(true);
      if (m === "0") setReduceMotionOverrideState(false);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fn = () => setSystemReduceMotion(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const effectiveReduceMotion =
    reduceMotionOverride === true ||
    (reduceMotionOverride === null && systemReduceMotion);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
  }, []);

  useEffect(() => {
    setLocaleState(initialLocale);
  }, [initialLocale]);

  const setPerformanceMode = useCallback((v: boolean) => {
    setPerformanceModeState(v);
    try {
      localStorage.setItem(PERF_KEY, v ? "1" : "0");
    } catch {
      /* ignore */
    }
    if (v) unlock("performance_mode", (id) => setLastAchievement(id));
  }, []);

  const setReduceMotionOverride = useCallback((v: boolean | null) => {
    setReduceMotionOverrideState(v);
    try {
      if (v === null) localStorage.removeItem(MOTION_KEY);
      else localStorage.setItem(MOTION_KEY, v ? "1" : "0");
    } catch {
      /* ignore */
    }
    if (v === true) unlock("a11y_motion", (id) => setLastAchievement(id));
  }, []);

  const onAchievement = useCallback((id: AchievementId) => {
    unlock(id, (newId) => setLastAchievement(newId));
  }, []);

  const clearLastAchievement = useCallback(() => setLastAchievement(null), []);

  const [immersiveCursor, setImmersiveCursor] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    setImmersiveCursor(
      !performanceMode && !effectiveReduceMotion && fine
    );
  }, [performanceMode, effectiveReduceMotion]);

  useEffect(() => {
    document.body.classList.toggle("immersive-cursor", immersiveCursor);
    document.body.classList.toggle("reduce-fx", performanceMode || effectiveReduceMotion);
    return () => {
      document.body.classList.remove("immersive-cursor", "reduce-fx");
    };
  }, [immersiveCursor, performanceMode, effectiveReduceMotion]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      performanceMode,
      setPerformanceMode,
      reduceMotionOverride,
      setReduceMotionOverride,
      effectiveReduceMotion,
      immersiveCursor,
      onAchievement,
      lastAchievement,
      clearLastAchievement,
    }),
    [
      locale,
      setLocale,
      performanceMode,
      setPerformanceMode,
      reduceMotionOverride,
      setReduceMotionOverride,
      effectiveReduceMotion,
      immersiveCursor,
      onAchievement,
      lastAchievement,
      clearLastAchievement,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppSettings() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAppSettings outside provider");
  return v;
}
