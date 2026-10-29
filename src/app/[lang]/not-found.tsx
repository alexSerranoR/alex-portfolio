"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dictionaries } from "@/i18n/copy";
import { isLocale, localePath } from "@/i18n/routes";

export default function NotFound() {
  const candidate = usePathname().split("/")[1];
  const locale = isLocale(candidate) ? candidate : "en";
  const t = dictionaries[locale].error;
  return (
    <main id="main" className="page-pad not-found">
      <p className="small-caps">{t.label}</p>
      <h1 className="section-heading">{t.title}</h1>
      <p>{t.description}</p>
      <Link href={localePath(locale, "#contents")} className="button primary">
        {t.back}
      </Link>
    </main>
  );
}
