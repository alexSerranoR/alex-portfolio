import { ImageResponse } from "next/og";
import { dictionaries } from "@/i18n/copy";
import type { Locale } from "@/i18n/routes";

export const alt =
  "Alex Serrano | Software Engineer. Portfolio in Spanish and English.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A title page: the same paper, ink and oxblood as the book.
export function createSocialImage(locale: Locale) {
  const t = dictionaries[locale];
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#f3ecdc",
        color: "#241c14",
        padding: 40,
        fontFamily: "serif",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid #d3c39f",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 8,
            color: "#6b573d",
          }}
        >
          {`EX LIBRIS · ${t.book.edition.toUpperCase()}`}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 128,
            marginTop: 30,
            letterSpacing: -2,
          }}
        >
          Alex Serrano
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 46,
            fontStyle: "italic",
            color: "#7a2a20",
            marginTop: 10,
          }}
        >
          {t.title.role}
        </div>
        <div
          style={{
            display: "flex",
            width: 90,
            height: 2,
            background: "#a8843f",
            marginTop: 34,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#4a3c2d",
            marginTop: 30,
          }}
        >
          {t.seo.social}
        </div>
      </div>
    </div>,
    size,
  );
}
