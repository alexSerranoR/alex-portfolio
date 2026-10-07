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
  const networkRef = useRef<SVGSVGElement>(null);
  const t = dictionaries[locale];
  useEffect(() => {
    const node = ref.current!;
    const svg = networkRef.current!;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 761px)",
    );
    const groups = svg.querySelectorAll<SVGGElement>("g");
    const paths = svg.querySelectorAll<SVGPathElement>(".network-edge");
    const cross = svg.querySelector<SVGPathElement>(".network-cross")!;
    const positions = nodes.map(([x, y]) => ({ x, y, proximity: 0 }));
    let cursor: { x: number; y: number } | null = null;
    let frame = 0;
    let animationFrame = 0;
    let previousTime = 0;
    let elapsed = 0;
    let running = false;
    const reset = () => {
      cursor = null;
    };
    const restore = () => {
      positions.forEach((position, i) => {
        position.x = nodes[i][0];
        position.y = nodes[i][1];
        position.proximity = 0;
        groups[i].removeAttribute("transform");
      });
      paths.forEach((path, i) => {
        const [a, b] = edges[i];
        path.setAttribute(
          "d",
          `M${nodes[a][0]} ${nodes[a][1]} L${nodes[b][0]} ${nodes[b][1]}`,
        );
        path.style.removeProperty("stroke");
        path.style.removeProperty("stroke-opacity");
      });
      cross.removeAttribute("transform");
    };
    const animate = (time: number) => {
      animationFrame = 0;
      if (!running) return;
      // Limit SVG updates to 30 fps; interpolation remains time-based.
      const delta = previousTime ? time - previousTime : 1000 / 30;
      if (delta >= 1000 / 30) {
        previousTime = time;
        const step = Math.min(delta, 64);
        elapsed += step;
        const ease = 1 - Math.exp(-step / 180);
        positions.forEach((position, i) => {
          const [x, y] = nodes[i];
          const dx = cursor ? x - cursor.x : 0;
          const dy = cursor ? y - cursor.y : 0;
          const distance = Math.hypot(dx, dy);
          const proximity = cursor ? Math.max(0, 1 - distance / 95) : 0;
          const push = proximity * proximity * 7;
          const targetX =
            x +
            Math.sin(elapsed / 9000 + i) * 0.6 +
            (dx / (distance || 1)) * push;
          const targetY =
            y +
            Math.cos(elapsed / 11000 + i) * 0.6 +
            (dy / (distance || 1)) * push;
          position.x += (targetX - position.x) * ease;
          position.y += (targetY - position.y) * ease;
          position.proximity += (proximity - position.proximity) * ease;
          groups[i].setAttribute(
            "transform",
            `translate(${position.x - x} ${position.y - y})`,
          );
        });
        paths.forEach((path, i) => {
          const [a, b] = edges[i].map((index) => positions[index]);
          path.setAttribute("d", `M${a.x} ${a.y} L${b.x} ${b.y}`);
          path.style.stroke = "var(--accent)";
          path.style.strokeOpacity = String(
            0.3 + Math.max(a.proximity, b.proximity) * 0.25,
          );
        });
        cross.setAttribute(
          "transform",
          `translate(${positions[7].x - nodes[7][0]} ${positions[7].y - nodes[7][1]})`,
        );
      }
      animationFrame = requestAnimationFrame(animate);
    };
    const render = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const progress = preference.matches
        ? 0
        : Math.min(1, Math.max(0, -rect.top / rect.height));
      node.style.setProperty("--cover-progress", progress.toFixed(3));
      running =
        desktop.matches &&
        !preference.matches &&
        !document.hidden &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        progress < 2 / 3;
      if (running && !animationFrame) {
        previousTime = 0;
        animationFrame = requestAnimationFrame(animate);
      } else if (!running) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        reset();
        if (preference.matches || !desktop.matches) restore();
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const pointer = (event: PointerEvent) => {
      if (!running || event.pointerType !== "mouse") return;
      const matrix = svg.getScreenCTM();
      if (!matrix) return;
      cursor = new DOMPoint(event.clientX, event.clientY).matrixTransform(
        matrix.inverse(),
      );
    };
    const scroll = () => {
      reset();
      schedule();
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      render();
    };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", schedule);
    desktop.addEventListener("change", schedule);
    document.addEventListener("visibilitychange", visibility);
    node.addEventListener("pointermove", pointer);
    node.addEventListener("pointerleave", reset);
    render();
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", schedule);
      desktop.removeEventListener("change", schedule);
      document.removeEventListener("visibilitychange", visibility);
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
        <svg ref={networkRef} viewBox="0 0 500 400" fill="none">
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
              className="network-edge"
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
