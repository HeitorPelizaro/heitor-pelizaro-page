"use client";

import { GlitchLabThemeProvider } from "@/context/GlitchLabThemeContext";

export function ClientLabProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GlitchLabThemeProvider>{children}</GlitchLabThemeProvider>;
}
