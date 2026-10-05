"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { profile } from "@/data/portfolio";
import { dictionaries } from "@/i18n/copy";
import type { Locale } from "@/i18n/routes";

// A re-interpretation of the original engineering map: the same connected
// foundation, reduced to geometry for the cover rather than explanatory labels.
const nodes = [
  [100, 88],
  [380, 68],
  [430, 232],
  [285, 340],
  [85, 300],
  [40, 192],
  [445, 340],
  [250, 195],
];
const edges = [
  [0, 7],
  [1, 7],
  [2, 7],
  [3, 7],
  [4, 7],
  [5, 7],
  [6, 7],
  [0, 1],
  [1, 2],
  [2, 6],
  [6, 3],
  [3, 4],
  [4, 5],
  [5, 0],
];

export function Cover({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLElement>(null);
  const t = dictionaries[locale];
  useEffect(() => {
    const node = ref.current!;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const render = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const progress = preference.matches
        ? 0
        : Math.min(1, Math.max(0, -rect.top / rect.height));
      node.style.setProperty("--cover-progress", progress.toFixed(3));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const pointer = (event: PointerEvent) => {
      if (preference.matches || event.pointerType !== "mouse") return;
      const rect = node.getBoundingClientRect();
      node.style.setProperty(
        "--pointer-x",
        `${(event.clientX / rect.width - 0.5) * 12}px`,
      );
      node.style.setProperty(
        "--pointer-y",
        `${((event.clientY - rect.top) / rect.height - 0.5) * 12}px`,
      );
    };
    const reset = () => {
      node.style.setProperty("--pointer-x", "0px");
      node.style.setProperty("--pointer-y", "0px");
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", render);
    node.addEventListener("pointermove", pointer);
    node.addEventListener("pointerleave", reset);
    render();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", render);
      node.removeEventListener("pointermove", pointer);
      node.removeEventListener("pointerleave", reset);
    };
  }, []);
  return (
    <section
      ref={ref}
      className="portfolio-cover"
      id="home"
      aria-labelledby="cover-name"
    >
      <div className="cover-network" aria-hidden="true">
        <svg viewBox="0 0 500 400" fill="none">
          <circle className="network-orbit" cx="250" cy="195" r="135" />
          <circle
            className="network-orbit outer-orbit"
            cx="250"
            cy="195"
            r="195"
          />
          {edges.map(([a, b], i) => (
            <path
              key={i}
              pathLength="1"
              d={`M${nodes[a][0]} ${nodes[a][1]} L${nodes[b][0]} ${nodes[b][1]}`}
            />
          ))}
          {nodes.map(([x, y], i) => (
            <g key={i}>
              <circle
                className="network-halo"
                cx={x}
                cy={y}
                r={i === 7 ? 18 : 9}
              />
              <circle
                className="network-node"
                cx={x}
                cy={y}
                r={i === 7 ? 5 : 3}
              />
            </g>
          ))}
          <path className="network-cross" d="M240 195h20 M250 185v20" />
        </svg>
      </div>
      <div className="container cover-composition">
        <div className="cover-identity">
          <h1 id="cover-name">
            <span>ALEX</span>
            <span>
              SERRANO<span className="cover-period">.</span>
            </span>
          </h1>
          <p className="cover-role">{t.hero.role.join(" ")}</p>
        </div>
        <nav className="cover-navigation" aria-label={t.cover.navigation}>
          {[
            [t.nav.projects, "work"],
            [t.nav.about, "about"],
            [t.nav.education, "education"],
            [t.nav.contact, "contact"],
          ].map(([label, id], index) => (
            <Link href={`#${id}`} key={id}>
              <span>{label}</span>
              <ArrowUpRight size={32} strokeWidth={1.4} />
              <span className="cover-link-index" aria-hidden="true">
                0{index + 1}
              </span>
            </Link>
          ))}
        </nav>
        <div className="cover-footer">
          <div className="cover-socials">
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub <ArrowUpRight size={14} />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <ArrowUpRight size={14} />
            </a>
          </div>
          <Link className="cover-scroll" href="#positioning">
            {t.cover.scroll}
            <ArrowDown size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
