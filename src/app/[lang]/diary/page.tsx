import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { diary } from "@/data/diary";
import { diaryPhotos } from "@/data/diary-photos";
import { dictionaries } from "@/i18n/copy";
import { localizedMetadata } from "@/i18n/metadata";
import { isLocale, localePath } from "@/i18n/routes";
import { formatDate } from "@/lib/dates";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = dictionaries[lang].diary;
  return localizedMetadata(lang, "/diary", t.heading, t.intro);
}

export default async function DiaryIndex({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = dictionaries[lang];
  return (
    <main id="main" className="page-pad page-top">
      <h1 className="section-heading">{t.diary.heading}</h1>
      <p className="section-intro">{t.diary.intro}</p>
      <ul className="diary-list">
        {diary.map((entry) => (
          <li key={entry.slug}>
            <Link
              href={localePath(lang, `/diary/${entry.slug}`)}
              className="diary-card"
            >
              <figure className="photo">
                <Image
                  src={diaryPhotos[entry.cover.image]}
                  alt={entry.cover.alt[lang]}
                  sizes="(max-width: 720px) 90vw, 420px"
                  placeholder="blur"
                />
              </figure>
              <div>
                <p className="small-caps">
                  <time dateTime={entry.date}>
                    {formatDate(entry.date, lang)}
                  </time>{" "}
                  · {entry.place[lang]}
                </p>
                <h2
                  className="display"
                  style={{
                    fontWeight: 600,
                    fontSize: "clamp(2rem, 4vw, 2.8rem)",
                    margin: "0.5rem 0 0.6rem",
                  }}
                >
                  {entry.title[lang]}
                </h2>
                <p>{entry.dek[lang]}</p>
                <span className="read">
                  {t.diary.read}
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
