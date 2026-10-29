import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RunningHead } from "@/components/book/header";
import { Colophon } from "@/components/book/colophon";
import { profile } from "@/data/portfolio";
import { dictionaries } from "@/i18n/copy";
import { isLocale, locales } from "@/i18n/routes";
import { localizedMetadata, siteOrigin } from "@/i18n/metadata";
import { fontVariables } from "../fonts";
import "../book.css";

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

export default async function BookLayout({
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
    <html lang={lang} className={fontVariables}>
      <body>
        <a href="#main" className="skip-link">
          {t.nav.skip}
        </a>
        <div className="sheet sheet-in">
          <RunningHead locale={lang} />
          {children}
          <Colophon locale={lang} />
        </div>
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
