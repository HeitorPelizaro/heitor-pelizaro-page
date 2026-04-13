/** URLs públicas — ajuste via env em CI se necessário */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://heitor.pelizaro.com.br";

export const GITHUB_URL =
  process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/heitorcpelizaro";

export const EMAIL = process.env.NEXT_PUBLIC_EMAIL ?? "heitor@pelizaro.com.br";

export const LINKEDIN_URL =
  process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "";

/** Pronto Dental — substitua pela URL real quando divulgar */
export const PRONTO_DENTAL_URL =
  process.env.NEXT_PUBLIC_PRONTO_DENTAL_URL ?? "https://heitor.pelizaro.com.br";
