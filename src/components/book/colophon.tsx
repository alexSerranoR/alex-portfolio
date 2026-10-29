import { FileText, Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/data/portfolio";
import { dictionaries } from "@/i18n/copy";
import type { Locale } from "@/i18n/routes";

export function Colophon({ locale }: { locale: Locale }) {
  const t = dictionaries[locale];
  return (
    <footer className="colophon page-pad">
      <div className="fleuron" aria-hidden="true">
        <span>◆◆◆</span>
      </div>
      <div className="links">
        <a href={`mailto:${profile.email}`}>
          <Mail size={16} aria-hidden="true" />
          {profile.email}
        </a>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">
          <Github size={16} aria-hidden="true" />
          GitHub
        </a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
          <Linkedin size={16} aria-hidden="true" />
          LinkedIn
        </a>
        <a href={profile.cv[locale]} download>
          <FileText size={16} aria-hidden="true" />
          {locale === "es" ? t.contact.cvEs : t.contact.cvEn}
        </a>
      </div>
      <p>{t.footer.colophon}</p>
      <p>
        © {new Date().getFullYear()} {profile.fullName}
      </p>
    </footer>
  );
}
