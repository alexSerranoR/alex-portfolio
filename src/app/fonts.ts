import { Cormorant_Garamond, EB_Garamond } from "next/font/google";

export const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const text = EB_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-text",
  display: "swap",
});

export const fontVariables = `${display.variable} ${text.variable}`;
