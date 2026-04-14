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
      className="relative px-4 py-20 sm:px-6 sm:py-24 md:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-sans text-2xl font-bold text-[var(--text-primary)] sm:text-3xl md:text-4xl">
          {t.title}
        </h2>
        <p className="mt-2 max-w-2xl font-mono text-sm text-[var(--text-muted)]">
          {t.subtitle}
        </p>
        <div className="mt-10 grid gap-6 sm:mt-12 sm:gap-8 md:grid-cols-2">
          <article className="panel-glass rounded-2xl p-5 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <h3 className="min-w-0 font-sans text-xl text-[var(--neon-cyan)] sm:text-2xl">
                {t.nhPong.name}
              </h3>
              <span className="w-fit shrink-0 rounded border border-white/10 px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
                {t.nhPong.tag}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
              {t.nhPong.desc}
            </p>
          </article>
          <article className="panel-glass rounded-2xl p-5 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <h3 className="min-w-0 font-sans text-xl text-[var(--neon-magenta)] sm:text-2xl">
                {t.pronto.name}
              </h3>
              <span className="w-fit shrink-0 rounded border border-white/10 px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
                {t.pronto.tag}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
              {t.pronto.desc}
            </p>
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
