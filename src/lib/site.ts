/** Evita string vazia no CI (?? não cobre "") */
function envOr(
  value: string | undefined,
  fallback: string,
): string {
  const t = value?.trim();
  return t ? t : fallback;
}

/** URLs públicas — ajuste via env em CI se necessário */
export const SITE_URL = envOr(
  process.env.NEXT_PUBLIC_SITE_URL,
  "https://heitor.pelizaro.com.br",
);

export const GITHUB_URL = envOr(
  process.env.NEXT_PUBLIC_GITHUB_URL,
  "https://github.com/heitorpelizaro",
);

export const EMAIL = envOr(
  process.env.NEXT_PUBLIC_EMAIL,
  "heitor@pelizaro.com.br",
);

export const LINKEDIN_URL =
  process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim() ?? "";

/** Pronto Dental — site público (deploy) */
export const PRONTO_DENTAL_URL = envOr(
  process.env.NEXT_PUBLIC_PRONTO_DENTAL_URL,
  "https://italo.pelizaro.com.br",
);

/** Instagram — link de contato (perfil público) */
export const INSTAGRAM_URL = envOr(
  process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  "https://www.instagram.com/heitor.pelizaro",
);

export const INSTAGRAM_HANDLE = "heitor.pelizaro";
