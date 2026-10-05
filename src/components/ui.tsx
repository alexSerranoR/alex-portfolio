"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { dictionaries } from "@/i18n/copy";
import { localePath, switchLocalePath, type Locale } from "@/i18n/routes";

export function Header({ locale = "en" }: { locale?: Locale }) {
  const pathname = usePathname();
  const t = dictionaries[locale].nav;
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href={localePath(locale)} className="brand">
          <span className="brand-mark" aria-hidden="true">
            as<span>↗</span>
          </span>
          <span>
            Alex Serrano
            <span className="brand-dot" aria-hidden="true">
              .
            </span>
          </span>
        </Link>
        <nav
          aria-label={t.label}
          id="main-navigation"
          className={open ? "navigation is-open" : "navigation"}
        >
          {[
            [t.projects, localePath(locale, "#work")],
            [t.education, localePath(locale, "#education")],
            [t.about, localePath(locale, "#about")],
            [t.contact, localePath(locale, "#contact")],
          ].map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-controls">
          <div
            className="language-control"
            role="group"
            aria-label={t.language}
          >
            {(["en", "es"] as const).map((language, index) => (
              <span key={language}>
                {index > 0 && (
                  <span className="language-divider" aria-hidden="true">
                    /
                  </span>
                )}
                <a
                  href={switchLocalePath(pathname, language)}
                  hrefLang={language}
                  lang={language}
                  aria-current={locale === language ? "page" : undefined}
                  aria-label={
                    language === "en"
                      ? "EN — Switch to English"
                      : "ES — Cambiar a español"
                  }
                  onClick={(event) => {
                    event.currentTarget.href = `${switchLocalePath(pathname, language)}${window.location.search}${window.location.hash}`;
                    setOpen(false);
                  }}
                >
                  {language.toUpperCase()}
                </a>
              </span>
            ))}
          </div>
          <button
            className="menu-toggle"
            aria-label={open ? t.close : t.open}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    node.classList.add("will-reveal");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

const systemPositions = [
  { x: 20, y: 22, core: true },
  { x: 76, y: 17, core: true },
  { x: 86, y: 58, core: true },
  { x: 57, y: 85, core: false },
  { x: 17, y: 75, core: false },
  { x: 8, y: 48, core: false },
  { x: 89, y: 85, core: false },
];

export function SystemMap({ locale = "en" }: { locale?: Locale }) {
  const t = dictionaries[locale].system;
  const systemNodes = systemPositions.map((position, index) => ({
    ...position,
    ...t.nodes[index],
  }));
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="system-map">
      <div className="system-canvas">
        <svg viewBox="0 0 500 400" className="system-edges" aria-hidden="true">
          <defs>
            <radialGradient id="core-glow">
              <stop offset="0%" stopColor="#c7ef81" stopOpacity=".11" />
              <stop offset="100%" stopColor="#c7ef81" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="250" cy="190" r="165" fill="url(#core-glow)" />
          <circle className="orbit orbit-one" cx="250" cy="190" r="115" />
          <circle className="orbit orbit-two" cx="250" cy="190" r="165" />
          {systemNodes.map((n, i) => (
            <g key={n.title}>
              <path
                className={active === i ? "edge active-edge" : "edge"}
                d={`M 250 190 Q ${n.x * 5} 190 ${n.x * 5} ${n.y * 4}`}
              />
              <circle className="signal" r="2.5" fill="#c7ef81">
                <animateMotion
                  dur={`${5 + i}s`}
                  repeatCount="indefinite"
                  path={`M 250 190 Q ${n.x * 5} 190 ${n.x * 5} ${n.y * 4}`}
                />
              </circle>
            </g>
          ))}
          <path
            className="edge secondary-edge"
            d="M100 88 L380 68 L430 232 L285 340 L85 300 L40 192 Z M285 340 L445 340 L430 232"
          />
        </svg>
        <div className="system-core">
          <span className="core-icon">⌘</span>
          <strong>{t.title}</strong>
          <span className="core-foundation">{t.foundation}</span>
        </div>
        {systemNodes.map((n, i) => (
          <button
            key={n.title}
            type="button"
            className={`system-node ${n.core ? "core-node" : ""} ${active === i ? "node-active" : ""}`}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            onClick={() => setActive(i)}
            aria-label={`${n.title}: ${n.description}`}
          >
            <span />
            {n.title}
          </button>
        ))}
      </div>
      <div className="diagram-caption">
        <span className="status-dot" />
        <span>
          {active === null ? t.caption : systemNodes[active].description}
        </span>
      </div>
    </div>
  );
}

// Progress belongs to the diagram, not to page text. Off-screen scenes do no
// scroll work, and both reduced-motion and no-JS views show the complete system.
export function ScrollScene({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    const render = () => {
      frame = 0;
      if (preference.matches) {
        node.style.setProperty("--scene-progress", "1");
        node.dataset.stage = "4";
        node.classList.remove("scene-motion", "scene-visible");
        return;
      }
      const rect = node.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(
          1,
          (window.innerHeight * 0.9 - rect.top) /
            (Math.min(rect.height, window.innerHeight) +
              window.innerHeight * 0.2),
        ),
      );
      node.style.setProperty("--scene-progress", progress.toFixed(3));
      node.dataset.stage = String(Math.min(4, Math.floor(progress * 5)));
      node.classList.add("scene-motion");
    };
    const schedule = () => {
      if (visible && !frame && !preference.matches)
        frame = requestAnimationFrame(render);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        node.classList.toggle("scene-visible", visible && !preference.matches);
        if (visible) render();
      },
      { rootMargin: "15% 0px 15% 0px" },
    );
    observer.observe(node);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", render);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", render);
    };
  }, []);
  return (
    <div ref={ref} className={`scroll-scene ${className}`} data-stage="4">
      {children}
    </div>
  );
}
