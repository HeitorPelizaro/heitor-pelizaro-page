"use client";

import { GlitchInteractiveLayer } from "@/components/gamification/GlitchInteractiveLayer";
import { GlitchLabThemeProvider } from "@/context/GlitchLabThemeContext";

export function ClientLabProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GlitchLabThemeProvider>
      {children}
      <GlitchInteractiveLayer />
    </GlitchLabThemeProvider>
  );
}
