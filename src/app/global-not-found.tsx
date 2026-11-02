import type { Metadata } from "next";
import { dictionaries } from "@/i18n/copy";
import { siteOrigin } from "@/i18n/metadata";
import { fontVariables } from "./fonts";
import "./book.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin || "http://localhost:3000"),
  title: "Page not found | Alex Serrano",
  robots: { index: false, follow: false },
};
export default function GlobalNotFound() {
  const t = dictionaries.en.error;
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <div className="sheet">
          <main className="page-pad not-found" id="main">
            <p className="small-caps">404</p>
            <h1 className="section-heading">{t.title}</h1>
            <p>{t.description}</p>
            {/* Crosses root layouts, so a plain link is a full load anyway. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a className="button primary" href="/">
              The library
            </a>
          </main>
        </div>
      </body>
    </html>
  );
}
