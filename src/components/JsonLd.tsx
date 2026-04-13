import {
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  SITE_URL,
} from "@/lib/site";
import { messages, type Locale } from "@/lib/i18n/messages";

export function JsonLd({ locale }: { locale: Locale }) {
  const m = messages[locale];
  const sameAs = [GITHUB_URL, LINKEDIN_URL].filter(Boolean);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Heitor Cunha Pelizaro",
    url: SITE_URL,
    email: EMAIL,
    jobTitle: m.jsonLd.jobTitle,
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "IFTM — Ciência da Computação",
    },
    sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
