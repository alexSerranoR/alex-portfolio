export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function localePath(locale: Locale, path = "") {
  return `/${locale}${path}`;
}

export function switchLocalePath(pathname: string, locale: Locale) {
  const path = pathname.replace(/^\/(en|es)(?=\/|$)/, "");
  return localePath(locale, path === "/" ? "" : path);
}

// Grouped by status in the contents (in development, completed, on hold),
// most recent first within each group.
export const projectOrder = [
  "algas",
  "mapping-blockchain-ecosystem",
  "algorithmic-techniques",
  "phonendo",
  "embarca",
  "la-abuelita",
  "quadratic-voting-dao",
  "wheel-of-fortune",
  "aws-cloud-devops-lab",
] as const;
