import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronDown, Download } from "lucide-react";
import { Contents } from "@/components/book/contents";
import { Reveal } from "@/components/book/reveal";
import { diary } from "@/data/diary";
import { diaryPhotos } from "@/data/diary-photos";
import { profile } from "@/data/portfolio";
import { getProjects } from "@/i18n/content";
import { dictionaries } from "@/i18n/copy";
import { isLocale, localePath } from "@/i18n/routes";

export default async function BookHome({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = dictionaries[lang];
  const projects = getProjects(lang);
  const latest = diary[0];
  const appendices: [string, string, string][] = [
    [t.nav.about, localePath(lang, "/about"), t.about.experience],
    [t.about.education, localePath(lang, "/about#education"), "UCM · UDIMA"],
    [t.nav.diary, localePath(lang, "/diary"), String(diary.length)],
    [t.nav.contact, localePath(lang, "/contact"), "CV · GitHub"],
  ];
  return (
    <main id="main">
      <section className="title-page page-pad" aria-labelledby="book-title">
        <span className="title-frame" aria-hidden="true" />
        <p className="ex-libris small-caps">
          {t.title.exLibris} · {t.book.edition}
        </p>
        <h1 id="book-title" className="display">
          Alex Serrano
        </h1>
        <p className="role">{t.title.role}</p>
        <span className="title-rule" aria-hidden="true" />
        <p className="tagline">{t.title.tagline}</p>
        <p className="location small-caps">{t.title.location}</p>
        <a href="#prologue" className="read-on">
          {t.title.read}
          <ChevronDown size={18} aria-hidden="true" />
        </a>
      </section>

      <section
        id="prologue"
        className="prologue page-pad"
        aria-labelledby="prologue-heading"
      >
        <h2 id="prologue-heading" className="section-heading">
          {t.prologue.heading}
        </h2>
        <Reveal className="prose reveal-fade">
          {t.prologue.paragraphs.map((paragraph, index) => (
            <p key={index} className={index === 0 ? "drop-cap" : undefined}>
              {paragraph}
            </p>
          ))}
          <p className="signature">{t.prologue.signature}</p>
        </Reveal>
        <div className="actions">
          <a href={profile.cv[lang]} className="button primary" download>
            <Download size={16} aria-hidden="true" />
            {t.prologue.cv}
          </a>
          <Link href={localePath(lang, "/contact")} className="button">
            {t.nav.contact}
          </Link>
        </div>
      </section>

      <div className="fleuron" aria-hidden="true">
        <span>◆◆◆</span>
      </div>

      <section
        id="contents"
        className="contents page-pad"
        aria-labelledby="contents-heading"
      >
        <h2 id="contents-heading" className="section-heading">
          {t.index.heading}
        </h2>
        <p className="section-intro">{t.index.intro}</p>
        <Contents projects={projects} locale={lang} />

        <section className="toc-group" aria-labelledby="appendix-heading">
          <h3 id="appendix-heading" className="small-caps">
            {t.index.appendices}
          </h3>
          <ul className="appendix-list">
            {appendices.map(([label, href, note]) => (
              <li key={href}>
                <Link href={href}>
                  <span>{label}</span>
                  <span className="toc-leader" aria-hidden="true" />
                  <span className="toc-page">{note}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <Link
          href={localePath(lang, `/diary/${latest.slug}`)}
          className="diary-card"
        >
          <figure className="photo">
            <Image
              src={diaryPhotos[latest.cover.image]}
              alt={latest.cover.alt[lang]}
              sizes="(max-width: 720px) 90vw, 420px"
              placeholder="blur"
            />
          </figure>
          <div>
            <p className="small-caps" style={{ fontStyle: "normal" }}>
              {t.index.latest} · {latest.place[lang]}
            </p>
            <h3>{latest.title[lang]}</h3>
            <p>{latest.dek[lang]}</p>
            <span className="read">
              {t.diary.read}
              <ArrowRight size={15} aria-hidden="true" />
            </span>
          </div>
        </Link>
      </section>
    </main>
  );
}
