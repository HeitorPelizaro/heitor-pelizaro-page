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
      className="relative px-6 py-24 md:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-sans text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
          {t.title}
        </h2>
        <p className="mt-2 font-mono text-sm text-[var(--text-muted)]">
          {t.subtitle}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <MagneticButton
            href={`mailto:${EMAIL}`}
            className="panel-glass rounded-lg px-6 py-3 font-mono text-sm text-[var(--neon-cyan)]"
          >
            {EMAIL}
          </MagneticButton>
          <MagneticButton
            href={GITHUB_URL}
            external
            className="panel-glass rounded-lg px-6 py-3 font-mono text-sm text-[var(--neon-magenta)]"
          >
            GitHub
          </MagneticButton>
          <MagneticButton
            href={INSTAGRAM_URL}
            external
            className="panel-glass rounded-lg px-6 py-3 font-mono text-sm text-[var(--text-primary)]"
          >
            {t.instagram}
          </MagneticButton>
          {LINKEDIN_URL ? (
            <MagneticButton
              href={LINKEDIN_URL}
              external
              className="panel-glass rounded-lg px-6 py-3 font-mono text-sm text-[var(--text-primary)]"
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
