import type { MetadataRoute } from "next";
import { siteOrigin } from "@/i18n/metadata";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(siteOrigin ? { sitemap: `${siteOrigin}/sitemap.xml` } : {}),
  };
}
