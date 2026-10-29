import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { diary } from "@/data/diary";
import { diaryPhotos } from "@/data/diary-photos";
import { getProjects } from "@/i18n/content";
import { dictionaries } from "@/i18n/copy";
import { localizedMetadata } from "@/i18n/metadata";
import { isLocale, localePath } from "@/i18n/routes";
import { formatDate } from "@/lib/dates";
import { Fragment } from "react";

export const dynamicParams = false;
export function generateStaticParams() {
  return diary.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const entry = diary.find((e) => e.slug === slug);
  if (!entry) notFound();
  return localizedMetadata(
    lang,
    `/diary/${slug}`,
    entry.title[lang],
    entry.dek[lang],
  );
}

export default async function DiaryEntryPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const entry = diary.find((e) => e.slug === slug);
  if (!entry) notFound();
  const t = dictionaries[lang];
  const related = entry.related
    ? getProjects(lang).find((p) => p.slug === entry.related)
    : undefined;
  return (
    <main id="main" className="page-pad page-top">
      <article>
        <header className="entry-head">
          <Link
            href={localePath(lang, "/diary")}
            className="small-caps text-link"
          >
            <ArrowLeft size={13} aria-hidden="true" />
            {t.diary.back}
          </Link>
          <h1 className="display">{entry.title[lang]}</h1>
          <p className="dek">{entry.dek[lang]}</p>
          <p className="small-caps">
            <time dateTime={entry.date}>{formatDate(entry.date, lang)}</time> ·{" "}
            {entry.place[lang]}
          </p>
        </header>
        <figure className="photo entry-cover">
          <Image
            src={diaryPhotos[entry.cover.image]}
            alt={entry.cover.alt[lang]}
            sizes="(max-width: 960px) 94vw, 900px"
            placeholder="blur"
            priority
          />
        </figure>
        <div className="entry-body prose">
          {entry.body[lang].map((paragraph, index) => (
            <Fragment key={index}>
              <p
                className={
                  index === 0
                    ? "drop-cap"
                    : index === entry.body[lang].length - 1
                      ? "coda"
                      : undefined
                }
              >
                {paragraph}
              </p>
              {entry.figure && entry.figure.after === index && (
                <figure className="photo entry-figure">
                  <Image
                    src={diaryPhotos[entry.figure.image]}
                    alt={entry.figure.alt[lang]}
                    sizes="(max-width: 720px) 94vw, 680px"
                    placeholder="blur"
                  />
                  <figcaption>{entry.figure.caption[lang]}</figcaption>
                </figure>
              )}
            </Fragment>
          ))}
          <p className="signature">Alex</p>
        </div>
        {related && (
          <aside className="entry-related">
            <p className="small-caps">{t.diary.related}</p>
            <Link href={localePath(lang, `/projects/${related.slug}`)}>
              <span>{related.name}</span>
              <ArrowRight size={22} aria-hidden="true" />
            </Link>
          </aside>
        )}
      </article>
    </main>
  );
}
