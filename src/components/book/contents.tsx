"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Project, ProjectKind } from "@/data/portfolio";
import { dictionaries } from "@/i18n/copy";
import { localePath, type Locale } from "@/i18n/routes";
import { roman } from "@/lib/roman";
import { Seals } from "./seals";

type Filter = "all" | "awarded" | ProjectKind;

// Filters only hide entries: without JavaScript every chapter stays listed.
export function Contents({
  projects,
  locale,
}: {
  projects: Project[];
  locale: Locale;
}) {
  const t = dictionaries[locale].index;
  const [kind, setKind] = useState<Filter>("all");
  const [year, setYear] = useState<number | null>(null);
  const years = useMemo(
    () => [...new Set(projects.flatMap((p) => p.years))].sort((a, b) => b - a),
    [projects],
  );
  const matchesKind = (project: Project, filter: Filter) =>
    filter === "all" ||
    (filter === "awarded"
      ? Boolean(project.event?.seals?.length)
      : project.kind === filter);
  const kinds = (
    [
      "all",
      "awarded",
      "hackathon",
      "impact",
      "research",
      "engineering",
    ] as const
  )
    .map((filter) => ({
      filter,
      count: projects.filter(
        (p) => matchesKind(p, filter) && (!year || p.years.includes(year)),
      ).length,
    }))
    .filter(({ filter, count }) => filter === "all" || count > 0);
  const visible = (project: Project) =>
    matchesKind(project, kind) && (!year || project.years.includes(year));
  const shown = projects.filter(visible).length;

  return (
    <>
      <div className="filters" role="group" aria-label={t.filters}>
        <div className="filter-row">
          {kinds.map(({ filter, count }) => (
            <button
              key={filter}
              type="button"
              aria-pressed={kind === filter}
              onClick={() => setKind(filter)}
            >
              {t.kinds[filter]}
              <span className="count">{count}</span>
            </button>
          ))}
        </div>
        <div className="filter-row" aria-label={t.years} role="group">
          <button
            type="button"
            aria-pressed={year === null}
            onClick={() => setYear(null)}
          >
            {t.anyYear}
          </button>
          {years.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={year === value}
              onClick={() => setYear(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <section className="toc-group" aria-labelledby="chapters-heading">
        <h3 id="chapters-heading" className="small-caps">
          {t.chapters}
        </h3>
        <ol className="toc">
          {projects.map((project, index) => (
            <li
              key={project.slug}
              className="toc-entry"
              hidden={!visible(project)}
            >
              <Link href={localePath(locale, `/projects/${project.slug}`)}>
                <span className="toc-numeral" aria-hidden="true">
                  {roman(index + 1)}
                </span>
                <span className="toc-title">
                  <span className="toc-name">
                    <span className="sr-only">
                      {t.chapter} {roman(index + 1)}:{" "}
                    </span>
                    {project.name}
                  </span>
                  <span className="toc-sub">{project.label}</span>
                  <Seals
                    project={project}
                    label={dictionaries[locale].work.seals}
                    small
                  />
                </span>
                <span className="toc-leader" aria-hidden="true" />
                <span className="toc-page">{project.period}</span>
              </Link>
            </li>
          ))}
        </ol>
        <p className="toc-empty" aria-live="polite" hidden={shown > 0}>
          {t.empty}{" "}
          <button
            type="button"
            onClick={() => {
              setKind("all");
              setYear(null);
            }}
          >
            {t.reset}
          </button>
        </p>
      </section>
    </>
  );
}
