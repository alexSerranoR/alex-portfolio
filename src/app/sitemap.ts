import type { MetadataRoute } from "next";
import { projects } from "@/data/portfolio";
import { locales, localePath } from "@/i18n/routes";
import { siteOrigin } from "@/i18n/metadata";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin;
  if (!origin) return [];
  return [
    ...locales.flatMap((locale) =>
      ["", ...projects.map((p) => `/projects/${p.slug}`)].map((path) => ({
        url: `${origin}${localePath(locale, path)}`,
        changeFrequency: "monthly" as const,
        priority: path ? 0.8 : 1,
        alternates: {
          languages: {
            en: `${origin}${localePath("en", path)}`,
            es: `${origin}${localePath("es", path)}`,
          },
        },
      })),
    ),
  ];
}
