import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/book/reveal";
import {
  getEducation,
  getExperience,
  getQualities,
  getToolkit,
} from "@/i18n/content";
import { dictionaries } from "@/i18n/copy";
import { localizedMetadata } from "@/i18n/metadata";
import { isLocale } from "@/i18n/routes";
import { roman } from "@/lib/roman";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = dictionaries[lang].about;
  return localizedMetadata(lang, "/about", t.heading, t.intro);
}

export default async function About({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = dictionaries[lang].about;
  const toolkit = getToolkit();
  return (
    <main id="main" className="page-pad page-top">
      <h1 className="section-heading">{t.heading}</h1>
      <p className="section-intro">{t.intro}</p>

      <div className="about-grid">
        <section
          id="qualities"
          className="about-block"
          aria-labelledby="q-title"
        >
          <h2 id="q-title" className="small-caps">
            {t.qualities}
          </h2>
          <Reveal as="ul" className="entries reveal-fade">
            {getQualities(lang).map((quality, index) => (
              <li key={quality.title}>
                <h3>
                  <span style={{ color: "var(--accent)" }}>
                    {roman(index + 1)}.{" "}
                  </span>
                  {quality.title}
                </h3>
                <p>{quality.text}</p>
              </li>
            ))}
          </Reveal>
        </section>

        <section
          id="experience"
          className="about-block"
          aria-labelledby="x-title"
        >
          <h2 id="x-title" className="small-caps">
            {t.experience}
          </h2>
          <ul className="entries">
            {getExperience(lang).map((item) => (
              <li key={item.company}>
                <h3>{item.role}</h3>
                <p className="meta">
                  {item.company} · {item.dates}
                </p>
                <p>{item.detail}</p>
              </li>
            ))}
          </ul>
          <p
            style={{
              fontStyle: "italic",
              color: "var(--ink-soft)",
              fontSize: "1.05rem",
            }}
          >
            {t.experienceIntro}
          </p>
        </section>

        <section
          id="education"
          className="about-block"
          aria-labelledby="e-title"
        >
          <h2 id="e-title" className="small-caps">
            {t.education}
          </h2>
          <ul className="entries">
            {getEducation(lang).map((item) => (
              <li key={item.institution}>
                <h3>{item.degree}</h3>
                <p className="meta">
                  {item.institution} · {item.dates}
                  {item.primary ? ` · ${t.primary}` : ""}
                </p>
                <p>{item.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="toolkit" className="about-block" aria-labelledby="t-title">
          <h2 id="t-title" className="small-caps">
            {t.toolkit}
          </h2>
          <ul className="entries">
            {toolkit.map((items, index) => (
              <li key={t.toolkitCategories[index]}>
                <h3>{t.toolkitCategories[index]}</h3>
                <ul className="tag-list">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
            <li>
              <h3>{t.languages}</h3>
              <p>{t.languagesValue}</p>
            </li>
            <li>
              <h3>{t.beyond}</h3>
              <p>{t.sport}</p>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
