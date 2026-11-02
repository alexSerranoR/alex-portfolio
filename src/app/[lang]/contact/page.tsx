import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Download, Github, Linkedin } from "lucide-react";
import { profile } from "@/data/portfolio";
import { dictionaries } from "@/i18n/copy";
import { localizedMetadata } from "@/i18n/metadata";
import { isLocale } from "@/i18n/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = dictionaries[lang].contact;
  return localizedMetadata(lang, "/contact", t.heading, t.intro);
}

export default async function Contact({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = dictionaries[lang].contact;
  const cvs =
    lang === "es"
      ? ([
          ["es", t.cvEs],
          ["en", t.cvEn],
        ] as const)
      : ([
          ["en", t.cvEn],
          ["es", t.cvEs],
        ] as const);
  return (
    <main id="main" className="page-pad contact-page">
      <h1 className="section-heading">{t.heading}</h1>
      <p className="section-intro">{t.intro}</p>
      <a href={`mailto:${profile.email}`} className="email">
        <span className="sr-only">{t.email}: </span>
        {profile.email}
      </a>
      <div className="contact-actions">
        {cvs.map(([language, label], index) => (
          <a
            key={language}
            href={profile.cv[language]}
            className={index === 0 ? "button primary" : "button"}
            download
          >
            <Download size={16} aria-hidden="true" />
            {label}
          </a>
        ))}
        <a
          href={profile.github}
          className="button"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={16} aria-hidden="true" />
          {t.github}
        </a>
        <a
          href={profile.linkedin}
          className="button"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin size={16} aria-hidden="true" />
          {t.linkedin}
        </a>
      </div>
      <p className="small-caps" style={{ marginTop: "2.5rem" }}>
        {t.location}
      </p>
    </main>
  );
}
