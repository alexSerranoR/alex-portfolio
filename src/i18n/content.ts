import {
  education,
  experience,
  projects,
  qualities,
  toolkit,
} from "@/data/portfolio";
import {
  spanishEducation,
  spanishExperience,
  spanishProjects,
  spanishQualities,
} from "./es-content";
import { projectOrder, type Locale } from "./routes";

export function localizeDate(date: string, locale: Locale) {
  if (locale === "en") return date;
  return date
    .replace(/October/g, "Octubre")
    .replace(/Sep/g, "Sep")
    .replace(/Jul/g, "Jul")
    .replace(/Jun/g, "Jun")
    .replace(/Feb/g, "Feb")
    .replace(/Present/g, "Actualidad")
    .replace(/expected/g, "previsto");
}

const spanishValues: Record<string, string> = {
  Millions: "Millones",
  "9.9 KB": "9,9 KB",
  "3M+": "+3 M",
};

// Tool names stay as written; only plain-language skills are translated.
const spanishTechnologies: Record<string, string> = {
  Gasification: "Gasificación",
  "Renewable energy": "Energía renovable",
  "Circular economy": "Economía circular",
  Biomass: "Biomasa",
  Branding: "Marca",
};

export function getProjects(locale: Locale) {
  return projectOrder.map((slug) => {
    const project = projects.find((item) => item.slug === slug)!;
    if (locale === "en") return project;
    const { metricLabels, ...translated } = spanishProjects[slug];
    return {
      ...project,
      ...translated,
      period: localizeDate(project.period, locale),
      technologies: project.technologies.map(
        (item) => spanishTechnologies[item] ?? item,
      ),
      metrics: project.metrics.map((metric, index) => ({
        value: spanishValues[metric.value] ?? metric.value,
        label: metricLabels[index],
      })),
    };
  });
}

export function getEducation(locale: Locale) {
  return education.map((item, index) => ({
    ...item,
    ...(locale === "es" ? spanishEducation[index] : {}),
    dates: localizeDate(item.dates, locale),
  }));
}
export function getExperience(locale: Locale) {
  return experience.map((item, index) => ({
    ...item,
    ...(locale === "es" ? spanishExperience[index] : {}),
    dates: localizeDate(item.dates, locale),
  }));
}
export function getQualities(locale: Locale) {
  return locale === "en" ? qualities : spanishQualities;
}

// Regroup the existing skills without adding technologies or proficiency claims.
export function getToolkit() {
  const core = toolkit[0].items;
  const languages = ["C++", "Java", "Python", "C", "JavaScript", "SQL"];
  return [
    languages,
    core.filter((item) => !languages.includes(item)),
    toolkit[1].items,
    [
      ...new Set(
        toolkit
          .slice(2)
          .flatMap((group) => group.items)
          .filter((item) => !languages.includes(item)),
      ),
    ],
  ];
}
