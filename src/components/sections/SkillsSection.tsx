"use client";

import { messages, type Locale } from "@/lib/i18n/messages";

const SKILLS = [
  { id: "py", label: "Python", level: "L1" },
  { id: "cloud", label: "AWS · Azure", level: "L1" },
  { id: "cicd", label: "CI/CD", level: "L1" },
  { id: "docker", label: "Docker", level: "L1" },
  { id: "wp", label: "WordPress", level: "L2" },
  { id: "ai", label: "IA / ML ops", level: "L2" },
  { id: "auto", label: "Automação", level: "L1" },
  { id: "full", label: "Fullcycle web", level: "L2" },
] as const;

export function SkillsSection({ locale }: { locale: Locale }) {
  const t = messages[locale].skills;

  return (
    <section
      id="skills"
      className="relative px-6 py-24 md:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-sans text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
          {t.title}
        </h2>
        <p className="mt-2 max-w-2xl font-mono text-sm text-[var(--text-muted)]">
          {t.subtitle}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--neon-amber)]">
          {t.legend}
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SKILLS.map((s) => (
            <div
              key={s.id}
              className="panel-glass group rounded-xl p-5 transition hover:border-[var(--neon-magenta)]/50"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--neon-cyan)]">
                  {s.level}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon-magenta)] opacity-60 group-hover:opacity-100" />
              </div>
              <p className="mt-3 font-sans text-lg text-[var(--text-primary)]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
