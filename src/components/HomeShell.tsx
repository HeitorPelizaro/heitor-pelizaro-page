"use client";

import dynamic from "next/dynamic";
import { AppSettingsProvider } from "@/context/AppSettingsContext";
import { ThemeAccentProvider } from "@/context/ThemeAccentContext";
import type { Locale } from "@/lib/i18n/messages";
import { GraphCanvas } from "@/components/immersive/GraphCanvas";
import { CustomCursor } from "@/components/immersive/CustomCursor";
import { HUD } from "@/components/nav/HUD";
import { EasterEggListener } from "@/components/gamification/EasterEggListener";
import { AchievementToast } from "@/components/gamification/AchievementToast";
import { AchievementBadge } from "@/components/gamification/AchievementBadge";
import { HtmlLangSync } from "@/components/HtmlLangSync";
import { HeroSection } from "@/components/sections/HeroSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { AuthoritySection } from "@/components/sections/AuthoritySection";
import { InstagramSection } from "@/components/sections/InstagramSection";
import { ContactSection } from "@/components/sections/ContactSection";

const DistortionBackdrop = dynamic(
  () =>
    import("@/components/immersive/DistortionBackdrop").then((m) => ({
      default: m.DistortionBackdrop,
    })),
  { ssr: false }
);

export function HomeShell({ initialLocale }: { initialLocale: Locale }) {
  return (
    <AppSettingsProvider initialLocale={initialLocale}>
      <ThemeAccentProvider>
        <HtmlLangSync locale={initialLocale} />
        <div className="scanlines relative min-h-dvh">
          <GraphCanvas />
          <DistortionBackdrop />
          <HUD />
          <main>
            <HeroSection locale={initialLocale} />
            <SkillsSection locale={initialLocale} />
            <ProjectsSection locale={initialLocale} />
            <AuthoritySection locale={initialLocale} />
            <InstagramSection locale={initialLocale} />
            <ContactSection locale={initialLocale} />
          </main>
        <CustomCursor />
        <EasterEggListener />
        <AchievementToast />
        <AchievementBadge />
        </div>
      </ThemeAccentProvider>
    </AppSettingsProvider>
  );
}
