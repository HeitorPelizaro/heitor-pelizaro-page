"use client";

import { useEffect, useRef } from "react";
import { useAppSettings } from "@/context/AppSettingsContext";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function EasterEggListener() {
  const i = useRef(0);
  const { onAchievement } = useAppSettings();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expect = KONAMI[i.current];
      const expNorm = expect.length === 1 ? expect.toLowerCase() : expect;
      if (key === expNorm) {
        i.current += 1;
        if (i.current >= KONAMI.length) {
          i.current = 0;
          onAchievement("easter_egg");
          console.log(
            "%c[heitor.lab] combinação registrada.",
            "color:#00f0ff;font-weight:bold;"
          );
        }
      } else {
        i.current = key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onAchievement]);

  return null;
}
