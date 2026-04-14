import type { Metadata, Viewport } from "next";
import { Orbitron, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClientLabProviders } from "@/components/ClientLabProviders";
import { SITE_URL } from "@/lib/site";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#03060a",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Heitor Pelizaro · DevOps & fullcycle",
    template: "%s · Heitor Pelizaro",
  },
  description:
    "DevOps na NovaHaus. Infra, CI/CD, Python, cloud e sistemas fullcycle.",
  authors: [{ name: "Heitor Cunha Pelizaro" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Heitor Pelizaro",
    title: "Heitor Pelizaro · DevOps & fullcycle",
    description:
      "DevOps na NovaHaus. Infra, CI/CD, Python, cloud e sistemas fullcycle.",
    images: [{ url: "/og.png", alt: "Heitor Pelizaro" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Heitor Pelizaro · DevOps & fullcycle",
    description:
      "Infra, automação, IA e sistemas fullcycle.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "pt-BR": SITE_URL,
      en: `${SITE_URL}/en/`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`${orbitron.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <ClientLabProviders>{children}</ClientLabProviders>
      </body>
    </html>
  );
}
