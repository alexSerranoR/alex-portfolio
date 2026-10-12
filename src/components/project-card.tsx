import Link from "next/link";
import { ArrowUpRight, Award, Github, Trophy } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { dictionaries } from "@/i18n/copy";
import { localePath, type Locale } from "@/i18n/routes";
import { ProjectDiagram } from "./diagrams";
import { ScrollScene } from "./ui";

export function Status({
  status,
  locale = "en",
}: {
  status: Project["status"];
  locale?: Locale;
}) {
  const t = dictionaries[locale].work;
  return (
    <span
      className={`project-status ${status === "Ongoing" ? "ongoing" : "completed"}`}
    >
      <span aria-hidden="true" />
      {status === "Ongoing" ? t.ongoing : t.completed}
    </span>
  );
}

export function ProjectMetrics({ project }: { project: Project }) {
  if (!project.metrics.length) return null;
  return (
    <dl className="project-metrics">
      {project.metrics.map((metric) => (
        <div key={metric.label}>
          <dt>{metric.label}</dt>
          <dd>{metric.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProjectEvent({
  project,
  locale = "en",
}: {
  project: Project;
  locale?: Locale;
}) {
  if (!project.event) return null;
  const { name, awards } = project.event;
  return (
    <div className="project-event">
      <p className="project-event-name">
        <Trophy size={15} aria-hidden="true" />
        {name}
      </p>
      {awards && awards.length > 0 && (
        <ul
          className="project-awards"
          aria-label={dictionaries[locale].work.awards}
        >
          {awards.map((award) => (
            <li key={award}>
              <Award size={14} aria-hidden="true" />
              {award}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// The existing card API now renders a full chapter in the project journey.
export function ProjectCard({
  project,
  number,
  total,
  locale,
}: {
  project: Project;
  number: number;
  total: number;
  locale: Locale;
}) {
  const t = dictionaries[locale].work;
  return (
    <section
      className={`project-story story-${project.slug}`}
      id={`project-${project.slug}`}
      aria-labelledby={`title-${project.slug}`}
    >
      <ScrollScene className="story-scene">
        <div className="container story-layout">
          <div className="story-copy">
            <div className="story-meta">
              <span className="project-number">
                {String(number).padStart(2, "0")}{" "}
                <span>/ {String(total).padStart(2, "0")}</span>
              </span>
              <Status status={project.status} locale={locale} />
              <span>{project.period}</span>
            </div>
            <ProjectEvent project={project} locale={locale} />
            <h3 id={`title-${project.slug}`}>
              <Link href={localePath(locale, `/projects/${project.slug}`)}>
                {project.name}
              </Link>
            </h3>
            <p className="story-description">{project.summary}</p>
            <div className="story-technologies" aria-label={t.technologies}>
              {project.technologies.slice(0, 4).map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>
            <div className="story-links">
              <Link
                href={localePath(locale, `/projects/${project.slug}`)}
                className="text-link"
              >
                {t.detail}
                <ArrowUpRight size={18} />
              </Link>
              <a
                href={project.repository}
                className="text-link repository-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name}: GitHub`}
              >
                <Github size={17} />
                GitHub
              </a>
            </div>
          </div>
          <div className="story-visual">
            <ProjectDiagram slug={project.slug} locale={locale} />
            <ProjectMetrics project={project} />
          </div>
        </div>
      </ScrollScene>
    </section>
  );
}
