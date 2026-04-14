"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ACHIEVEMENT_KEYS, loadUnlocked } from "@/lib/achievements";
import { messages, type Locale } from "@/lib/i18n/messages";
import { RewardFireworks } from "@/components/gamification/RewardFireworks";

export function RewardRoute({ locale }: { locale: Locale }) {
  const t = messages[locale];
  const r = t.reward;
  const homeHref = locale === "en" ? "/en/" : "/";
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setAllowed(loadUnlocked().size >= ACHIEVEMENT_KEYS.length);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fn = () => setReduceMotion(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  if (allowed === null) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#050508] font-mono text-xs text-[var(--text-muted)]">
        {t.reward.loading}
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="relative flex min-h-dvh flex-col items-center justify-center bg-[#050508] px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--neon-cyan)]">
          {r.gateTitle}
        </p>
        <p className="mt-4 max-w-sm text-sm text-[var(--text-muted)]">
          {r.gateBody}
        </p>
        <Link
          href={homeHref}
          className="mt-8 rounded-lg border border-[var(--neon-magenta)]/35 px-5 py-2.5 font-mono text-xs text-[var(--neon-amber)] transition hover:border-[var(--neon-cyan)]/50 hover:text-[var(--text-primary)]"
        >
          {r.gateCta}
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#050508] text-[var(--text-primary)]">
      <RewardFireworks reduced={reduceMotion} />
      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--neon-cyan)]">
          {r.fireworksEyebrow}
        </p>
        <h1 className="mt-4 font-sans text-3xl font-bold md:text-4xl">
          {r.fireworksTitle}
        </h1>
        <p className="mt-3 max-w-md text-sm text-[var(--text-muted)]">
          {r.fireworksSub}
        </p>

        <div className="panel-glass mt-12 max-w-lg rounded-2xl border border-white/15 px-6 py-6 text-left">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--neon-magenta)]">
            {r.prizeTitle}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
            {r.prizeBody}
          </p>
          <p className="mt-4 border-t border-white/10 pt-4 text-[11px] italic text-[var(--text-muted)]/80">
            {r.prizeFoot}
          </p>
        </div>

        <Link
          href={homeHref}
          className="mt-10 font-mono text-xs text-[var(--neon-cyan)] underline decoration-[var(--border-glow)] underline-offset-4 hover:text-[var(--neon-magenta)]"
        >
          {r.backHome}
        </Link>
      </div>
    </div>
  );
}
