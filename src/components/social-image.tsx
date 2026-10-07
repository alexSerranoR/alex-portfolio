import { ImageResponse } from "next/og";
import { dictionaries } from "@/i18n/copy";
import type { Locale } from "@/i18n/routes";

export const alt =
  "Alex Serrano | Software Engineer. Projects in algorithms, AI, cloud, data and blockchain.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function createSocialImage(locale: Locale) {
  const t = dictionaries[locale];
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#10130f",
        color: "#edf0e7",
        padding: "70px 80px",
        flexDirection: "column",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 22,
          letterSpacing: 5,
          color: "#c7ef81",
        }}
      >
        ALEX SERRANO / MADRID
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 65,
          fontSize: locale === "es" ? 88 : 104,
          fontWeight: 600,
          letterSpacing: -6,
          lineHeight: 1.02,
        }}
      >
        <span>{t.hero.role[0]}</span>
        <div style={{ display: "flex" }}>
          {t.hero.role[1]}
          <span style={{ color: "#c7ef81" }}>.</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 45,
          color: "#a1aa98",
          fontSize: 26,
        }}
      >
        {t.seo.social}
      </div>
      <div
        style={{
          position: "absolute",
          right: 70,
          top: 155,
          width: 260,
          height: 260,
          border: "1px solid #455a30",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 170,
            height: 170,
            border: "1px solid #667e4a",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              background: "#c7ef81",
              borderRadius: "50%",
            }}
          />
        </div>
      </div>
    </div>,
    size,
  );
}
