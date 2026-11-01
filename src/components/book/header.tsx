"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Library, Menu, X } from "lucide-react";
import { dictionaries } from "@/i18n/copy";
import { localePath, switchLocalePath, type Locale } from "@/i18n/routes";

export function RunningHead({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const t = dictionaries[locale].nav;
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const items: [string, string, string][] = [
    [t.prologue, localePath(locale, "#prologue"), "prologue"],
    [t.chapters, localePath(locale, "#contents"), "projects"],
    [t.diary, localePath(locale, "/diary"), "diary"],
    [t.about, localePath(locale, "/about"), "about"],
    [t.contact, localePath(locale, "/contact"), "contact"],
  ];
  const section = pathname.split("/")[2] ?? "";
  return (
    <header className="running-head">
      <div className="running-head__inner page-pad">
        <Link href={localePath(locale)} className="running-head__brand">
          <span className="monogram" aria-hidden="true">
            as
          </span>
          <span className="brand-text">Alex Serrano · Portfolio</span>
          <span className="sr-only">Alex Serrano</span>
        </Link>
        <nav
          aria-label={t.label}
          id="main-navigation"
          className={open ? "running-nav is-open" : "running-nav"}
        >
          {items.map(([label, href, key]) => (
            <Link
              key={key}
              href={href}
              aria-current={section === key ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="running-head__controls">
          <div className="lang-switch" role="group" aria-label={t.language}>
            {(["es", "en"] as const).map((language) => (
              <a
                key={language}
                href={switchLocalePath(pathname, language)}
                hrefLang={language}
                lang={language}
                aria-current={locale === language ? "page" : undefined}
                aria-label={
                  language === "en"
                    ? "EN: Switch to English"
                    : "ES: Cambiar a español"
                }
                onClick={(event) => {
                  event.currentTarget.href = `${switchLocalePath(pathname, language)}${window.location.search}${window.location.hash}`;
                }}
              >
                {language.toUpperCase()}
              </a>
            ))}
          </div>
          {/* The library is another root layout: a full load either way. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="library-link"
            aria-label={t.libraryLabel}
            title={t.libraryLabel}
          >
            <Library size={19} strokeWidth={1.6} />
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-label={open ? t.close : t.open}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
