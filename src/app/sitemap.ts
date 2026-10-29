import type { MetadataRoute } from "next";
import { diary } from "@/data/diary";
import { projects } from "@/data/portfolio";
import { locales, localePath } from "@/i18n/routes";
import { siteOrigin } from "@/i18n/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin;
  if (!origin) return [];
  const paths = [
    "",
    "/about",
    "/contact",
    "/diary",
    ...diary.map((entry) => `/diary/${entry.slug}`),
    ...projects.map((p) => `/projects/${p.slug}`),
  ];
  return [
    { url: `${origin}/`, changeFrequency: "monthly", priority: 1 },
    ...locales.flatMap((locale) =>
      paths.map((path) => ({
        url: `${origin}${localePath(locale, path)}`,
        changeFrequency: "monthly" as const,
        priority: path ? 0.8 : 0.9,
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
