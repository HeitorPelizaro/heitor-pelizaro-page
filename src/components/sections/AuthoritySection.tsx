"use client";

import { messages, type Locale } from "@/lib/i18n/messages";

export function AuthoritySection({ locale }: { locale: Locale }) {
  const t = messages[locale].authority;

  return (
    <section
      id="authority"
      className="relative px-6 py-24 md:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-sans text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
          {t.title}
        </h2>
        <p className="mt-2 font-mono text-sm text-[var(--text-muted)]">
          {t.subtitle}
        </p>
        <div className="panel-glass mt-10 rounded-2xl p-8 md:p-12">
          <p className="max-w-2xl text-lg text-[var(--text-muted)]">{t.body}</p>
          <p className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--neon-amber)]">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--neon-amber)]" />
            {t.soon}
          </p>
        </div>
      </div>
    </section>
  );
}
