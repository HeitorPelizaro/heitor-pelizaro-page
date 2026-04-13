/** URLs públicas — ajuste via env em CI se necessário */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://heitor.pelizaro.com.br";

export const GITHUB_URL =
  process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/heitorcpelizaro";

export const EMAIL = process.env.NEXT_PUBLIC_EMAIL ?? "heitor@pelizaro.com.br";

export const LINKEDIN_URL =
  process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "";

/** Pronto Dental — site público (deploy) */
export const PRONTO_DENTAL_URL =
  process.env.NEXT_PUBLIC_PRONTO_DENTAL_URL ?? "https://italo.pelizaro.com.br";

/** Instagram @heitor.pelizaro */
export const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
  "https://www.instagram.com/heitor.pelizaro/";

export const INSTAGRAM_HANDLE = "heitor.pelizaro";

/** Opcional: iframe de widget (ex. SnapWidget). Se vazio, só o bloco nativo + grade de imagens. */
export const INSTAGRAM_WIDGET_IFRAME_SRC =
  process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_IFRAME_SRC ?? "";
