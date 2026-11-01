import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import phonendoArchitecture from "@/assets/projects/phonendo-arquitectura.png";
import { projects } from "@/data/portfolio";
import { getProjects } from "@/i18n/content";
import { dictionaries } from "@/i18n/copy";
import { isLocale, localePath } from "@/i18n/routes";
import { localizedMetadata } from "@/i18n/metadata";
import { diagramCaption, ProjectDiagram } from "@/components/book/diagrams";
import { Reveal } from "@/components/book/reveal";
import { Seals } from "@/components/book/seals";
import { roman } from "@/lib/roman";

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}): Promise<Metadata> {
  const { slug, lang } = await params;
  if (!isLocale(lang)) notFound();
  const project = getProjects(lang).find((p) => p.slug === slug);
  if (!project) notFound();
  return localizedMetadata(
    lang,
    `/projects/${slug}`,
    project.name,
    project.summary,
  );
}

// AlGas writes its gas inside the seaweed: Al(Gas).
function ChapterTitle({ slug, name }: { slug: string; name: string }) {
  if (slug === "algas")
    return (
      <span className="wordmark" aria-label={name}>
        Al<span>(Gas)</span>
      </span>
    );
  return <>{name}</>;
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug, lang } = await params;
  if (!isLocale(lang)) notFound();
  const localized = getProjects(lang);
  const t = dictionaries[lang];
  const c = t.chapter;
  const index = localized.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  const project = localized[index];
  const previous = localized[(index - 1 + localized.length) % localized.length];
  const next = localized[(index + 1) % localized.length];
  const ongoing = project.status === "Ongoing";
  const status = {
    Ongoing: t.work.ongoing,
    Completed: t.work.completed,
    Paused: t.work.paused,
  }[project.status];

  const sections = [
    { id: "problem", title: c.problem, text: project.problem },
    {
      id: "approach",
      title: ongoing ? c.building : c.built,
      text: project.approach,
    },
    { id: "contribution", title: c.contribution, text: project.contribution },
    ...(project.challenge
      ? [{ id: "challenge", title: c.challenge, text: project.challenge }]
      : []),
    ...(project.highlights
      ? [{ id: "highlights", title: c.highlights, list: project.highlights }]
      : []),
    {
      id: "learnings",
      title: ongoing ? c.ongoingLearnings : c.learnings,
      text: project.learnings,
    },
    ...(project.next
      ? [{ id: "next", title: c.next, text: project.next }]
      : []),
  ];
  let plate = 0;

  return (
    <main id="main" className="page-pad">
      <header className="chapter-head">
        <div>
          <p className="small-caps numeral">{status}</p>
          <h1 className="display">
            <ChapterTitle slug={project.slug} name={project.name} />
          </h1>
          <p className="label">{project.label}</p>
          <p className="event">
            {[project.event?.name, project.period].filter(Boolean).join(" · ")}
          </p>
        </div>
        <Reveal>
          <Seals project={project} label={t.work.seals} />
        </Reveal>
      </header>

      <p className="chapter-summary">{project.summary}</p>
      <div className="chapter-links">
        {project.links?.map((link) => (
          <a
            key={link.kind}
            href={link.href}
            className={link.kind === "demo" ? "button primary" : "button"}
            target="_blank"
            rel="noopener noreferrer"
          >
            {c.links[link.kind]}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        ))}
        {project.repository && (
          <a
            href={project.repository}
            className={project.links?.length ? "button" : "button primary"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={15} aria-hidden="true" />
            {c.repository}
          </a>
        )}
      </div>

      {project.metrics.length > 0 && (
        <dl className="metrics">
          {project.metrics.map((metric) => (
            <div key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="chapter-grid">
        <article className="chapter-article prose">
          {sections.map((section, i) => (
            <div key={section.id}>
              <section id={section.id} aria-labelledby={`${section.id}-title`}>
                <h2 id={`${section.id}-title`}>
                  <span className="roman">{roman(i + 1)}.</span>
                  {section.title}
                </h2>
                {"list" in section && section.list ? (
                  <ul className="highlights">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className={i === 0 ? "drop-cap" : undefined}>
                    {section.text}
                  </p>
                )}
              </section>
              {section.id === "approach" && (
                <Reveal as="figure" className="plate">
                  <ProjectDiagram project={project} locale={lang} />
                  <figcaption>
                    {c.plate} {++plate} · {diagramCaption(project.slug, lang)}
                  </figcaption>
                </Reveal>
              )}
            </div>
          ))}
        </article>

        <aside className="chapter-aside" aria-label={project.name}>
          <div>
            <h2 className="small-caps">{c.status}</h2>
            {status}
          </div>
          <div>
            <h2 className="small-caps">{c.period}</h2>
            {project.period}
          </div>
          <div>
            <h2 className="small-caps">{c.team}</h2>
            {project.team ?? project.category}
          </div>
          <div>
            <h2 className="small-caps">{t.work.technologies}</h2>
            {project.technologies.join(" · ")}
          </div>
          {(project.repository || project.links?.length) && (
            <div>
              <h2 className="small-caps">{c.sources}</h2>
              <ul>
                {project.repository && (
                  <li>
                    <a
                      href={project.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  </li>
                )}
                {project.links?.map((link) => (
                  <li key={link.kind}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {c.links[link.kind]}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {project.slug === "phonendo" && (
        <figure className="plate photo-plate wide-plate">
          <a
            href={phonendoArchitecture.src}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={phonendoArchitecture}
              alt={c.teamDiagram}
              sizes="(max-width: 1120px) 94vw, 1000px"
            />
          </a>
          <figcaption>
            {c.plate} {++plate} · {c.teamDiagram}
          </figcaption>
        </figure>
      )}

      <nav className="chapter-nav" aria-label={t.index.chapters}>
        <Link
          href={localePath(lang, `/projects/${previous.slug}`)}
          className="side"
        >
          <span className="small-caps">
            <ArrowLeft
              size={13}
              aria-hidden="true"
              style={{ display: "inline" }}
            />{" "}
            {c.previous}
          </span>
          <span className="name">{previous.name}</span>
        </Link>
        <Link href={localePath(lang, "#contents")} className="to-index">
          {c.index}
        </Link>
        <Link
          href={localePath(lang, `/projects/${next.slug}`)}
          className="side next"
        >
          <span className="small-caps">
            {c.following}{" "}
            <ArrowRight
              size={13}
              aria-hidden="true"
              style={{ display: "inline" }}
            />
          </span>
          <span className="name">{next.name}</span>
        </Link>
      </nav>
    </main>
  );
}
