"use client";

import gsap from "gsap";
import { useRef, type ReactNode } from "react";
import { useAppSettings } from "@/context/AppSettingsContext";

type Props = {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  external?: boolean;
};

export function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  type = "button",
  external,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { immersiveCursor, effectiveReduceMotion } = useAppSettings();
  const strength = immersiveCursor && !effectiveReduceMotion ? 0.35 : 0.12;

  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(el, {
      x: x * strength,
      y: y * strength,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const leave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1,0.5)" });
  };

  const inner = (
    <div
      ref={ref}
      className="inline-block will-change-transform"
      onMouseMove={move}
      onMouseLeave={leave}
    >
      {children}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className={className}
        onClick={onClick}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type={type} className={className} onClick={onClick}>
      {inner}
    </button>
  );
}
