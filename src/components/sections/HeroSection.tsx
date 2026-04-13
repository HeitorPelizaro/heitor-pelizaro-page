"use client";

import Image from "next/image";
import { messages, type Locale } from "@/lib/i18n/messages";
import { EMAIL, GITHUB_URL } from "@/lib/site";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function HeroSection({ locale }: { locale: Locale }) {
  const t = messages[locale].hero;

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] flex-col justify-center px-6 pb-24 pt-32 md:px-16"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--neon-cyan)]">
            heitor.pelizaro.com.br
          </p>
          <h1 className="mt-4 font-sans text-4xl font-bold leading-tight text-[var(--text-primary)] md:text-6xl">
            <span className="text-glow-cyan">Heitor</span>{" "}
            <span className="text-glow-magenta">Pelizaro</span>
          </h1>
          <p className="mt-4 font-mono text-sm text-[var(--neon-amber)] md:text-base">
            {t.role}
          </p>
          <p className="mt-6 max-w-xl text-lg text-[var(--text-muted)] md:text-xl">
            {t.tagline}
          </p>
          <p className="mt-4 max-w-xl text-sm italic text-[var(--text-muted)]/90">
            {t.sub}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <MagneticButton
              href={GITHUB_URL}
              external
              className="panel-glass rounded-lg px-6 py-3 font-mono text-sm text-[var(--neon-cyan)] transition hover:border-[var(--neon-magenta)]"
            >
              {t.ctaGithub}
            </MagneticButton>
            <MagneticButton
              href={`mailto:${EMAIL}`}
              className="panel-glass rounded-lg px-6 py-3 font-mono text-sm text-[var(--neon-magenta)] transition hover:border-[var(--neon-cyan)]"
            >
              {t.ctaEmail}
            </MagneticButton>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[320px] md:max-w-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-magenta)]/20 blur-2xl" />
          <div className="panel-glass relative overflow-hidden rounded-2xl border-2 border-[var(--border-glow)]">
            <Image
              src="/heitor.svg"
              alt="Heitor Pelizaro"
              width={400}
              height={400}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
