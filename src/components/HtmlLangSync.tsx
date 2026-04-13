"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n/messages";

export function HtmlLangSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale]);
  return null;
}
