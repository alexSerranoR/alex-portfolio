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

export const projectOrder = [
  "mapping-blockchain-ecosystem",
  "la-abuelita",
  "aws-cloud-devops-lab",
  "algorithmic-techniques",
  "quadratic-voting-dao",
  "wheel-of-fortune",
] as const;
