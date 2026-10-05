"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dictionaries } from "@/i18n/copy";
import { isLocale, localePath } from "@/i18n/routes";
import { ArrowLeft } from "lucide-react";
export default function NotFound() {
  const candidate = usePathname().split("/")[1];
  const locale = isLocale(candidate) ? candidate : "en";
  const t = dictionaries[locale].error;
  return (
    <main id="main" className="container not-found">
      <p className="section-label">{t.label}</p>
      <h1>{t.title}</h1>
      <p>{t.description}</p>
      <Link href={localePath(locale)} className="button primary">
        <ArrowLeft size={17} />
        {t.back}
      </Link>
    </main>
  );
}
