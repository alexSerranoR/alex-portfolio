"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from "react";
import type { Gallery } from "./gallery";

type Lang = "es" | "en";

const volumes: {
  lang: Lang;
  href: string;
  label: string;
  number: string;
  name: string;
}[] = [
  {
    lang: "es",
    href: "/es",
    label: "Abrir el portfolio en español",
    number: "Tomo I",
    name: "Español",
  },
  {
    lang: "en",
    href: "/en",
    label: "Open the portfolio in English",
    number: "Volume II",
    name: "English",
  },
];

// The page around the volumes speaks the visitor's language.
const copy = {
  en: {
    eyebrow: "The Library of Babel",
    role: "Software engineer · backend, AI, data and blockchain",
    nav: "Portfolio editions",
  },
  es: {
    eyebrow: "La Biblioteca de Babel",
    role: "Ingeniero de software · backend, IA, datos y blockchain",
    nav: "Ediciones del portfolio",
  },
} as const;

const NAME = "Alex Serrano";

// The browser's language never changes while the page is open.
const noSubscription = () => () => {};
const browserLang = (): Lang =>
  navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
const serverLang = (): Lang => "en";

export function Library() {
  const hallRef = useRef<HTMLCanvasElement>(null);
  const dustRef = useRef<HTMLCanvasElement>(null);
  const galleryRef = useRef<Gallery | null>(null);
  const [ready, setReady] = useState(false);
  const [entering, setEntering] = useState<Lang | null>(null);
  const lang = useSyncExternalStore(noSubscription, browserLang, serverLang);

  useEffect(() => {
    const hall = hallRef.current;
    const dust = dustRef.current;
    if (!hall || !dust) return;
    let cancelled = false;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    import("./gallery")
      .then(({ createGallery }) => createGallery(hall, dust, { reducedMotion }))
      .then((gallery) => {
        if (cancelled) return gallery.dispose();
        galleryRef.current = gallery;
        setReady(true);
      })
      .catch(() => {
        // The still photograph behind the canvas stays in place.
      });
    return () => {
      cancelled = true;
      galleryRef.current?.dispose();
      galleryRef.current = null;
    };
  }, []);

  // Coming back with the browser's back button restores the page as it was left.
  useEffect(() => {
    const reset = (event: PageTransitionEvent) => {
      if (event.persisted) setEntering(null);
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const open =
    (target: Lang, href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      const gallery = galleryRef.current;
      if (
        !gallery ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
        return;
      event.preventDefault();
      if (entering) return;
      setEntering(target);
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced) {
        window.location.assign(href);
        return;
      }
      gallery.enter(1500);
      window.setTimeout(() => window.location.assign(href), 1400);
    };

  const t = copy[lang];

  return (
    <main
      className={`library${ready ? " is-ready" : ""}${entering ? " is-entering" : ""}`}
      id="main"
      lang={lang}
    >
      <canvas ref={hallRef} className="library-canvas" aria-hidden="true" />
      <div className="library-beams" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="library-shade" aria-hidden="true" />
      <canvas
        ref={dustRef}
        className="library-canvas library-dust"
        aria-hidden="true"
      />

      <header className="library-title">
        <p className="library-eyebrow">{t.eyebrow}</p>
        <h1 aria-label={NAME}>
          {[...NAME].map((ch, i) => (
            <span
              key={i}
              aria-hidden="true"
              style={{ animationDelay: `${0.9 + i * 0.07}s` }}
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </h1>
        <p className="library-role">{t.role}</p>
      </header>

      <nav className="volumes" aria-label={t.nav}>
        {volumes.map((volume) => (
          <a
            key={volume.lang}
            className="volume"
            href={volume.href}
            hrefLang={volume.lang}
            lang={volume.lang}
            aria-label={volume.label}
            onClick={open(volume.lang, volume.href)}
          >
            <span className="volume-number">{volume.number}</span>
            <span className="volume-name">{volume.name}</span>
            <span className="volume-rule" aria-hidden="true" />
            <span className="volume-kind">Portfolio</span>
          </a>
        ))}
      </nav>

      <p className="library-quote" lang="es">
        «La Biblioteca es ilimitada y periódica.» <cite>J. L. Borges</cite>
      </p>

      <p className="library-credit">
        Photo:{" "}
        <a
          href="https://commons.wikimedia.org/wiki/File:Austria_-_Admont_Abbey_Library_-_1267.jpg"
          rel="noopener"
          target="_blank"
        >
          Admont Abbey Library, Jorge Royan
        </a>
        ,{" "}
        <a
          href="https://creativecommons.org/licenses/by-sa/3.0/"
          rel="noopener license"
          target="_blank"
        >
          CC BY-SA 3.0
        </a>
        , retouched.
      </p>

      <div className="library-veil" aria-hidden="true" />
    </main>
  );
}
