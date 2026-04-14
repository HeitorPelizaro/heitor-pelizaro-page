"use client";

import { useState } from "react";
import { messages, type Locale } from "@/lib/i18n/messages";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  INSTAGRAM_WIDGET_IFRAME_SRC,
} from "@/lib/site";
import { MagneticButton } from "@/components/ui/MagneticButton";

function IgPlaceholder() {
  return (
    <div className="flex h-full min-h-[120px] w-full items-center justify-center bg-gradient-to-br from-[#833ab4]/35 via-[#fd1d1d]/15 to-[#fcb045]/25">
      <svg
        className="h-8 w-8 opacity-40"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    </div>
  );
}

const IG_GRID_EXTENSIONS = [".jpg", ".jpeg", ".webp", ".png"] as const;

function IgCell({ index }: { index: number }) {
  const [extIdx, setExtIdx] = useState(0);
  const [broken, setBroken] = useState(false);
  const src = `/instagram/grid-${index}${IG_GRID_EXTENSIONS[extIdx]}`;

  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-square overflow-hidden rounded-xl border border-white/10 transition hover:border-[var(--neon-magenta)]/50"
    >
      {broken ? (
        <IgPlaceholder />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
          onError={() => {
            if (extIdx + 1 < IG_GRID_EXTENSIONS.length) {
              setExtIdx((i) => i + 1);
            } else {
              setBroken(true);
            }
          }}
        />
      )}
    </a>
  );
}

export function InstagramSection({ locale }: { locale: Locale }) {
  const t = messages[locale].instagram;

  return (
    <section
      id="instagram"
      className="relative px-6 py-24 md:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-sans text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
          {t.title}
        </h2>
        <p className="mt-2 font-mono text-sm text-[var(--text-muted)]">
          {t.subtitle}
        </p>

        <div className="panel-glass mt-10 overflow-hidden rounded-2xl border border-white/10">
          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[0.85rem] bg-[var(--bg-deep)]">
                  <svg
                    className="h-8 w-8 text-[var(--text-primary)]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[var(--neon-cyan)]">
                  @{INSTAGRAM_HANDLE}
                </p>
                <p className="mt-2 max-w-md text-sm text-[var(--text-muted)]">
                  {t.body}
                </p>
              </div>
            </div>
            <MagneticButton
              href={INSTAGRAM_URL}
              external
              className="panel-glass shrink-0 rounded-lg px-6 py-3 font-mono text-sm text-[var(--neon-magenta)]"
            >
              {t.cta}
            </MagneticButton>
          </div>

          {INSTAGRAM_WIDGET_IFRAME_SRC ? (
            <div className="border-t border-white/10 px-4 pb-6 pt-2">
              <iframe
                title="Instagram feed"
                src={INSTAGRAM_WIDGET_IFRAME_SRC}
                className="h-[480px] w-full max-w-2xl mx-auto rounded-lg border border-white/10 bg-black/20"
                loading="lazy"
              />
            </div>
          ) : null}

          <div className="border-t border-white/10 bg-black/20 p-4 md:p-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <IgCell key={i} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
