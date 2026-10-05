import type { Metadata } from "next";
import Link from "next/link";
import { dictionaries } from "@/i18n/copy";
import { siteOrigin } from "@/i18n/metadata";
import "./globals.css";
import "./portfolio.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin || "http://localhost:3000"),
  title: "Page not found | Alex Serrano",
  robots: { index: false, follow: false },
};
export default function GlobalNotFound() {
  const t = dictionaries.en.error;
  return (
    <html lang="en">
      <body>
        <main className="container not-found" id="main">
          <p className="section-label">404</p>
          <h1>{t.title}</h1>
          <p>{t.description}</p>
          <Link className="button primary" href="/en">
            {t.back}
          </Link>
        </main>
      </body>
    </html>
  );
}
