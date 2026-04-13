/** Parse #rgb #rrggbb from computed style */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.trim().replace(/^#/, "");
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    return { r, g, b };
  }
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    return { r, g, b };
  }
  return null;
}

export function readCssHexVar(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (raw.startsWith("#")) return raw;
  const m = raw.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (m) {
    const r = Number(m[1]);
    const g = Number(m[2]);
    const b = Number(m[3]);
    const h = (n: number) => n.toString(16).padStart(2, "0");
    return `#${h(r)}${h(g)}${h(b)}`;
  }
  return fallback;
}

/** HSL: h 0–360, s/l 0–100 → #rrggbb */
export function hslToHex(h: number, s: number, l: number): string {
  const H = ((h % 360) + 360) % 360;
  const S = Math.min(100, Math.max(0, s)) / 100;
  const L = Math.min(100, Math.max(0, l)) / 100;
  const c = (1 - Math.abs(2 * L - 1)) * S;
  const x = c * (1 - Math.abs(((H / 60) % 2) - 1));
  const m = L - c / 2;
  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (H < 60) {
    rp = c;
    gp = x;
  } else if (H < 120) {
    rp = x;
    gp = c;
  } else if (H < 180) {
    gp = c;
    bp = x;
  } else if (H < 240) {
    gp = x;
    bp = c;
  } else if (H < 300) {
    rp = x;
    bp = c;
  } else {
    rp = c;
    bp = x;
  }
  const to = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${to(rp)}${to(gp)}${to(bp)}`;
}
