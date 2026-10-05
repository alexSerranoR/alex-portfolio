import type { Metadata } from "next";
import { Header } from "@/components/ui";
import { Footer } from "@/components/sections";
import { profile } from "@/data/portfolio";
import { notFound } from "next/navigation";
import { dictionaries } from "@/i18n/copy";
import { isLocale, locales } from "@/i18n/routes";
import { localizedMetadata, siteOrigin } from "@/i18n/metadata";
import "../globals.css";
import "../portfolio.css";
import "../project-motion.css";
import "../opening.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return localizedMetadata(lang);
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = dictionaries[lang];
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    alternateName: profile.name,
    ...(siteOrigin ? { url: `${siteOrigin}/${lang}` } : {}),
    sameAs: [profile.github, profile.linkedin],
    description: t.seo.person,
    knowsLanguage: ["Spanish", "English"],
  };
  return (
    <html lang={lang}>
      <body>
        <a href="#main" className="skip-link">
          {t.nav.skip}
        </a>
        <Header locale={lang} />
        {children}
        <Footer locale={lang} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(person).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
