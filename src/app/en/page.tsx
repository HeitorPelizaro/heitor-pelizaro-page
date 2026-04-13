import type { Metadata } from "next";
import { HomeShell } from "@/components/HomeShell";
import { JsonLd } from "@/components/JsonLd";
import { messages } from "@/lib/i18n/messages";
import { SITE_URL } from "@/lib/site";

const t = messages.en;
const enUrl = `${SITE_URL}/en/`;

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
  openGraph: {
    locale: "en_US",
    title: t.metaTitle,
    description: t.metaDescription,
    url: enUrl,
  },
  alternates: {
    canonical: enUrl,
    languages: {
      "pt-BR": SITE_URL,
      en: enUrl,
    },
  },
};

export default function HomeEn() {
  return (
    <>
      <JsonLd locale="en" />
      <HomeShell initialLocale="en" />
    </>
  );
}
