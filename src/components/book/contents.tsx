"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project, ProjectKind } from "@/data/portfolio";
import { dictionaries } from "@/i18n/copy";
import { localePath, type Locale } from "@/i18n/routes";
import { Seals } from "./seals";

type Filter = "all" | "awarded" | ProjectKind;
const groups: Project["status"][] = ["Ongoing", "Completed", "Paused"];

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
  const matches = (project: Project, filter: Filter) =>
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
      count: projects.filter((p) => matches(p, filter)).length,
    }))
    .filter(({ filter, count }) => filter === "all" || count > 0);
  const shown = projects.filter((p) => matches(p, kind)).length;

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
      </div>
      {groups.map((status) => {
        const members = projects.filter((p) => p.status === status);
        if (!members.length) return null;
        const id = `chapters-${status.toLowerCase()}`;
        return (
          <section
            key={status}
            className="toc-group"
            aria-labelledby={id}
            hidden={!members.some((p) => matches(p, kind))}
          >
            <h3 id={id} className="small-caps">
              {t.groups[status]}
            </h3>
            <ul className="toc">
              {members.map((project) => (
                <li
                  key={project.slug}
                  className="toc-entry"
                  hidden={!matches(project, kind)}
                >
                  <Link href={localePath(locale, `/projects/${project.slug}`)}>
                    <span className="toc-name">{project.name}</span>
                    <span className="toc-sub">{project.label}</span>
                    <Seals
                      project={project}
                      label={dictionaries[locale].work.seals}
                      small
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <p className="toc-empty" aria-live="polite" hidden={shown > 0}>
        {t.empty}{" "}
        <button type="button" onClick={() => setKind("all")}>
          {t.reset}
        </button>
      </p>
    </>
  );
}
