import type { Metadata } from "next";
import { HomeShell } from "@/components/HomeShell";
import { JsonLd } from "@/components/JsonLd";
import { messages } from "@/lib/i18n/messages";
import { SITE_URL } from "@/lib/site";

const t = messages.pt;

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
  openGraph: {
    locale: "pt_BR",
    title: t.metaTitle,
    description: t.metaDescription,
    url: SITE_URL,
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "pt-BR": SITE_URL,
      en: `${SITE_URL}/en/`,
    },
  },
};

export default function HomePt() {
  return (
    <>
      <JsonLd locale="pt" />
      <HomeShell initialLocale="pt" />
    </>
  );
}
