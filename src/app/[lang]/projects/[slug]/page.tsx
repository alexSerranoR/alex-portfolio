import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/data/portfolio";
import { getProjects } from "@/i18n/content";
import { dictionaries } from "@/i18n/copy";
import { isLocale, localePath } from "@/i18n/routes";
import { localizedMetadata } from "@/i18n/metadata";
import { ProjectDiagram } from "@/components/diagrams";
import { ProjectMetrics, Status } from "@/components/project-card";
import { Reveal, ScrollScene } from "@/components/ui";

export const dynamicParams = true;
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

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug, lang } = await params;
  if (!isLocale(lang)) notFound();
  const localizedProjects = getProjects(lang);
  const t = dictionaries[lang].case;
  const index = localizedProjects.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  const project = localizedProjects[index];
  const next = localizedProjects[(index + 1) % localizedProjects.length];
  return (
    <main id="main" className="case-study container">
      <Link href={localePath(lang, "#work")} className="back-link">
        <ArrowLeft size={16} />
        {t.back}
      </Link>
      <div className="case-heading">
        <div className="case-meta">
          <Status status={project.status} locale={lang} />
          <span>{project.period}</span>
          <span>{project.category}</span>
        </div>
        <h1>
          {project.name}
          <span>.</span>
        </h1>
        <p className="case-label">{project.label}</p>
        <p className="case-summary">{project.summary}</p>
        <a
          href={project.repository}
          className="button primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={17} />
          {t.repository}
          <ArrowUpRight size={16} />
        </a>
      </div>
      <ScrollScene className="case-visual">
        <figure>
          <h2>{t.architecture}</h2>
          <ProjectDiagram slug={project.slug} locale={lang} />
          <figcaption>{t.conceptual}</figcaption>
        </figure>
      </ScrollScene>
      <ProjectMetrics project={project} />
      <div className="case-tech">
        <h2>{dictionaries[lang].work.technologies}</h2>
        <p>{project.technologies.join(" · ")}</p>
      </div>
      <div className="case-body">
        <div className="case-prose">
          {[
            { id: "problem", title: t.problem, text: project.problem },
            {
              id: "approach",
              title: project.status === "Ongoing" ? t.building : t.built,
              text: project.approach,
            },
            {
              id: "contribution",
              title: t.contribution,
              text: project.contribution,
            },
            {
              id: "learnings",
              title:
                project.status === "Ongoing" ? t.ongoingLearnings : t.learnings,
              text: project.learnings,
            },
          ].map((section) => (
            <Reveal key={section.id}>
              <section id={section.id}>
                <h2>{section.title}</h2>
                <p>{section.text}</p>
              </section>
            </Reveal>
          ))}
          <a
            href={project.repository}
            className="text-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={18} />
            {t.source}
            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
      <Link
        href={localePath(lang, `/projects/${next.slug}`)}
        className="next-project"
      >
        <div>
          <span className="section-label">{t.next}</span>
          <h2>{next.name}</h2>
        </div>
        <ArrowUpRight size={32} />
      </Link>
    </main>
  );
}
