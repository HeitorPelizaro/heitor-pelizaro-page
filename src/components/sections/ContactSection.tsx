"use client";

import { messages, type Locale } from "@/lib/i18n/messages";
import { EMAIL, GITHUB_URL, INSTAGRAM_URL, LINKEDIN_URL } from "@/lib/site";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function ContactSection({ locale }: { locale: Locale }) {
  const t = messages[locale].contact;
  const foot = messages[locale].footer;

  return (
    <section
      id="contact"
      className="relative px-4 py-20 sm:px-6 sm:py-24 md:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-sans text-2xl font-bold text-[var(--text-primary)] sm:text-3xl md:text-4xl">
          {t.title}
        </h2>
        <p className="mt-2 font-mono text-sm text-[var(--text-muted)]">
          {t.subtitle}
        </p>
        <div className="mt-8 flex min-w-0 flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
          <MagneticButton
            href={`mailto:${EMAIL}`}
            className="panel-glass max-w-full break-all rounded-lg px-4 py-3 text-center font-mono text-xs text-[var(--neon-cyan)] sm:px-6 sm:text-left sm:text-sm"
          >
            {EMAIL}
          </MagneticButton>
          <MagneticButton
            href={GITHUB_URL}
            external
            className="panel-glass max-w-full rounded-lg px-4 py-3 text-center font-mono text-xs text-[var(--neon-magenta)] sm:px-6 sm:text-sm"
          >
            GitHub
          </MagneticButton>
          <MagneticButton
            href={INSTAGRAM_URL}
            external
            className="panel-glass max-w-full rounded-lg px-4 py-3 text-center font-mono text-xs text-[var(--text-primary)] sm:px-6 sm:text-sm"
          >
            {t.instagram}
          </MagneticButton>
          {LINKEDIN_URL ? (
            <MagneticButton
              href={LINKEDIN_URL}
              external
              className="panel-glass max-w-full rounded-lg px-4 py-3 text-center font-mono text-xs text-[var(--text-primary)] sm:px-6 sm:text-sm"
            >
              LinkedIn
            </MagneticButton>
          ) : null}
        </div>
        <footer className="mt-24 border-t border-white/10 pt-8 font-mono text-[10px] text-[var(--text-muted)]">
          {foot.copy}
        </footer>
      </div>
    </section>
  );
}
