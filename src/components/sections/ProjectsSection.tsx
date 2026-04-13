"use client";

import { useEffect, useRef } from "react";
import { messages, type Locale } from "@/lib/i18n/messages";
import { PRONTO_DENTAL_URL } from "@/lib/site";
import { useAppSettings } from "@/context/AppSettingsContext";

export function ProjectsSection({ locale }: { locale: Locale }) {
  const t = messages[locale].projects;
  const ref = useRef<HTMLElement>(null);
  const { onAchievement } = useAppSettings();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          onAchievement("visited_projects");
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [onAchievement]);

  return (
    <section
      ref={ref}
      id="projects"
      className="relative px-6 py-24 md:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-sans text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
          {t.title}
        </h2>
        <p className="mt-2 max-w-2xl font-mono text-sm text-[var(--text-muted)]">
          {t.subtitle}
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <article className="panel-glass rounded-2xl p-8">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-sans text-2xl text-[var(--neon-cyan)]">
                {t.nhPong.name}
              </h3>
              <span className="rounded border border-white/10 px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
                {t.nhPong.tag}
              </span>
            </div>
            <p className="mt-4 text-[var(--text-muted)]">{t.nhPong.desc}</p>
          </article>
          <article className="panel-glass rounded-2xl p-8">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-sans text-2xl text-[var(--neon-magenta)]">
                {t.pronto.name}
              </h3>
              <span className="rounded border border-white/10 px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
                {t.pronto.tag}
              </span>
            </div>
            <p className="mt-4 text-[var(--text-muted)]">{t.pronto.desc}</p>
            <a
              href={PRONTO_DENTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block font-mono text-sm text-[var(--neon-cyan)] underline-offset-4 hover:underline"
            >
              {t.pronto.link} →
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
