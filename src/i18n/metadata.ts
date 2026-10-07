import type { Metadata } from "next";
import { dictionaries } from "./copy";
import { localePath, type Locale } from "./routes";

export const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined);

export function localizedMetadata(
  locale: Locale,
  path = "",
  title?: string,
  description?: string,
): Metadata {
  const t = dictionaries[locale].seo;
  const socialTitle = title ? `${title} | Alex Serrano` : t.title;
  return {
    metadataBase: new URL(siteOrigin || "http://localhost:3000"),
    title: title || { default: t.title, template: "%s | Alex Serrano" },
    description: description || t.description,
    alternates: {
      ...(siteOrigin ? { canonical: localePath(locale, path) } : {}),
      languages: {
        en: localePath("en", path),
        es: localePath("es", path),
        "x-default": localePath("en", path),
      },
    },
    openGraph: {
      title: socialTitle,
      description: description || t.description,
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
      alternateLocale: locale === "es" ? "en_US" : "es_ES",
      siteName: "Alex Serrano",
      images: [
        {
          url: localePath(locale, "/opengraph-image"),
          width: 1200,
          height: 630,
          alt: t.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: description || t.description,
      images: [localePath(locale, "/opengraph-image")],
    },
    icons: { icon: "/icon.svg" },
    robots: { index: true, follow: true },
  };
}
