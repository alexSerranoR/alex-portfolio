import type { Metadata, Viewport } from "next";
import { siteOrigin } from "@/i18n/metadata";
import { fontVariables } from "../fonts";
import "../library.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin || "http://localhost:3000"),
  title: "Alex Serrano · Portfolio",
  description:
    "A library of hexagonal galleries. Choose a book: the portfolio of Alex Serrano, software engineer, in Spanish or English.",
  alternates: {
    ...(siteOrigin ? { canonical: "/" } : {}),
    languages: { es: "/es", en: "/en", "x-default": "/" },
  },
  openGraph: {
    title: "Alex Serrano · Portfolio",
    description:
      "Software engineer in Madrid. Portfolio in Spanish and English.",
    type: "website",
    siteName: "Alex Serrano",
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#9aa1a6" };

export default function LibraryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
