import Link from "next/link";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Download,
  MapPin,
  MoveUpRight,
} from "lucide-react";
import { profile } from "@/data/portfolio";
import { dictionaries } from "@/i18n/copy";
import {
  getEducation,
  getExperience,
  getProjects,
  getQualities,
  getToolkit,
} from "@/i18n/content";
import { localePath, type Locale } from "@/i18n/routes";
import { ProjectCard } from "./project-card";
import { Reveal } from "./ui";
import { Cover } from "./cover";
import { Accordion } from "./accordion";

export function Hero({ locale }: { locale: Locale }) {
  return (
    <>
      <Cover locale={locale} />
      <section className="positioning container" id="positioning">
        <Reveal>
          <h2>{dictionaries[locale].cover.positioning}</h2>
          <p>{dictionaries[locale].hero.description}</p>
        </Reveal>
      </section>
    </>
  );
}

export function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="section-label">{label}</p>
        <h2>{title}</h2>
      </div>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}

export function Work({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].work;
  return (
    <section className="work-journey" id="work" aria-labelledby="work-heading">
      <div className="container work-intro">
        <Reveal>
          <p className="section-label">{t.label}</p>
          <h2 id="work-heading">{t.title}</h2>
          <p>{t.intro}</p>
        </Reveal>
      </div>
      <span id="building" className="anchor-alias" aria-hidden="true" />
      {getProjects(locale).map((project, index) => (
        <ProjectCard
          key={project.slug}
          project={project}
          number={index + 1}
          locale={locale}
        />
      ))}
    </section>
  );
}

export function Toolkit({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].toolkit;
  return (
    <section className="toolkit-section section" id="toolkit">
      <div className="container">
        <Reveal>
          <SectionHeading
            label={t.label}
            title={t.title}
            description={t.intro}
          />
        </Reveal>
        <div className="toolkit-grid">
          {getToolkit().map((items, index) => (
            <Reveal key={t.categories[index]}>
              <div className="toolkit-group">
                <h3>{t.categories[index]}</h3>
                <p>
                  {items.map((item, itemIndex) => (
                    <span
                      key={item}
                      className={
                        index === 0 || (index === 1 && itemIndex < 3)
                          ? "toolkit-emphasis"
                          : undefined
                      }
                    >
                      {item}
                      {itemIndex < items.length - 1 && (
                        <span className="toolkit-separator"> / </span>
                      )}
                    </span>
                  ))}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Background({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].education;
  const items = getEducation(locale);
  return (
    <section className="section education-section container" id="education">
      <span id="background" className="anchor-alias" aria-hidden="true" />
      <Reveal>
        <SectionHeading label={t.label} title={t.title} description={t.intro} />
      </Reveal>
      <div className="university-grid">
        {items.slice(0, 2).map((item) => (
          <Reveal key={item.short}>
            <article
              className={`education-item ${item.primary ? "primary-education" : ""}`}
            >
              <p className="education-date">{item.dates}</p>
              <h3>{item.degree}</h3>
              <p className="institution">
                {item.institution}
                {item.short === "UCM" && " · UCM"}
              </p>
              <p className="education-description">{item.detail}</p>
            </article>
          </Reveal>
        ))}
      </div>
      <Accordion title={t.earlier} className="earlier-education">
        <div className="school-grid">
          {items.slice(2).map((item) => (
            <div key={item.short}>
              <article className="school-item">
                <h3>{item.degree}</h3>
                <p className="school-meta">
                  {item.institution}
                  <span>{item.dates}</span>
                </p>
                <p>{item.detail}</p>
              </article>
            </div>
          ))}
        </div>
        <div className="education-language">
          <p>{t.languages}</p>
          <p>{t.languageContext}</p>
        </div>
      </Accordion>
    </section>
  );
}

export function About({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].about;
  return (
    <section className="section about-section" id="about">
      <div className="container">
        <Reveal>
          <SectionHeading label={t.label} title={t.title} />
        </Reveal>
        <div className="about-layout">
          <div className="about-intro">
            <p>{t.intro}</p>
            <p>{t.description}</p>
          </div>
        </div>
        <div className="about-disclosures">
          <Accordion title={t.how}>
            <div className="qualities">
              {getQualities(locale).map((quality) => (
                <div key={quality.title}>
                  <div className="quality">
                    <h3>{quality.title}</h3>
                    <p>{quality.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Accordion>
          <Accordion title={t.experience} className="experience-block">
            <p className="disclosure-intro">{t.experienceIntro}</p>
            <div className="experience-list">
              {getExperience(locale).map((item) => (
                <article key={item.company}>
                  <h3>{item.company}</h3>
                  <p className="experience-role">{item.role}</p>
                  <p className="experience-date">{item.dates} · Madrid</p>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </Accordion>
          <Accordion title={t.beyond}>
            <p className="personal-note">{t.sport}</p>
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export function Contact({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].contact;
  return (
    <section className="contact-section container" id="contact">
      <Reveal>
        <div className="contact-top">
          <p className="section-label">{t.label}</p>
          <span className="contact-location">
            <MapPin size={15} />
            {t.location}
          </span>
        </div>
        <div className="contact-main">
          <div>
            <h2>
              {t.title[0]}
              <br />
              {t.title[1]}
              <span>.</span>
            </h2>
            <p>{t.description}</p>
          </div>
          <a
            className="contact-arrow"
            href={`mailto:${profile.email}`}
            aria-label={t.email}
          >
            <MoveUpRight size={60} strokeWidth={1.3} />
          </a>
        </div>
        <a className="email-link" href={`mailto:${profile.email}`}>
          {profile.email}
          <ArrowUpRight size={20} />
        </a>
        <div className="contact-links">
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            <Github size={17} />
            GitHub
            <ArrowUpRight size={14} />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin size={17} />
            LinkedIn
            <ArrowUpRight size={14} />
          </a>
          <span className="contact-link-spacer" />
          <a
            href={profile.cv.en}
            download
            aria-label={dictionaries[locale].hero.cvEn}
          >
            <Download size={16} />
            CV · EN
          </a>
          <a
            href={profile.cv.es}
            download
            aria-label={dictionaries[locale].hero.cvEs}
          >
            <Download size={16} />
            CV · ES
          </a>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer({ locale = "en" }: { locale?: Locale }) {
  const t = dictionaries[locale].footer;
  return (
    <footer className="footer container">
      <span>© {new Date().getFullYear()} Alex Serrano</span>
      <span>{t.message}</span>
      <Link href={localePath(locale, "#home")}>
        {t.top}
        <ArrowUpRight size={14} />
      </Link>
    </footer>
  );
}
