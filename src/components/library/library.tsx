"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { Lang, LibraryController, Rect } from "./scene";

const SEEN_KEY = "babel:intro-seen";
const books: { lang: Lang; href: string; label: string; plaque: string }[] = [
  {
    lang: "es",
    href: "/es",
    label: "Abrir el portfolio en español",
    plaque: "Español",
  },
  {
    lang: "en",
    href: "/en",
    label: "Open the portfolio in English",
    plaque: "English",
  },
];

type Mode = "static" | "loading" | "intro" | "idle" | "opening";

function webglAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

// Deterministic spines for the drawn fallback shelf (no JavaScript or no WebGL).
function spines(seed: number, count: number) {
  let a = seed;
  const next = () => {
    a = (a * 9301 + 49297) % 233280;
    return a / 233280;
  };
  const tones = [
    "#4a3a2c",
    "#5b4632",
    "#3a3530",
    "#6b5a44",
    "#2f2a26",
    "#54443a",
    "#5a3a2e",
    "#33322c",
    "#463c36",
    "#2c3a2e",
  ];
  return Array.from({ length: count }, () => ({
    width: 7 + Math.round(next() * 9),
    height: 72 + Math.round(next() * 24),
    background: tones[Math.floor(next() * tones.length)],
  }));
}

function Shelf({
  seed,
  children,
}: {
  seed: number;
  children?: React.ReactNode;
}) {
  const left = spines(seed, 9);
  const right = spines(seed + 50, 9);
  return (
    <div className="fallback-shelf">
      {left.map((style, i) => (
        <span
          key={`l${i}`}
          className="spine"
          style={{
            width: style.width,
            height: `${style.height}%`,
            background: style.background,
          }}
        />
      ))}
      {children}
      {right.map((style, i) => (
        <span
          key={`r${i}`}
          className="spine"
          style={{
            width: style.width,
            height: `${style.height}%`,
            background: style.background,
          }}
        />
      ))}
    </div>
  );
}

export function Library() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<LibraryController | null>(null);
  const linkRefs = useRef<Record<Lang, HTMLAnchorElement | null>>({
    es: null,
    en: null,
  });
  const [mode, setMode] = useState<Mode>("static");
  const [chosen, setChosen] = useState<Lang | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !webglAvailable()) return;
    let cancelled = false;
    setMode("loading");
    import("./scene")
      .then(({ createLibrary }) => {
        if (cancelled) return;
        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        let seen = false;
        try {
          seen = window.localStorage.getItem(SEEN_KEY) === "1";
        } catch {
          // Storage can be blocked; then the intro simply plays again.
        }
        const intro = !reduced && !seen;
        const controller = createLibrary(canvas, {
          onFrame: (rects: Record<Lang, Rect>) => {
            for (const lang of ["es", "en"] as const) {
              const link = linkRefs.current[lang];
              if (!link) continue;
              const r = rects[lang];
              link.style.transform = `translate(${r.x}px, ${r.y}px)`;
              link.style.width = `${r.w}px`;
              link.style.height = `${r.h}px`;
            }
          },
          onIdle: () => {
            setMode((current) => (current === "opening" ? current : "idle"));
            try {
              window.localStorage.setItem(SEEN_KEY, "1");
            } catch {
              // Not remembering the visit is harmless.
            }
          },
        });
        controllerRef.current = controller;
        const still = new URLSearchParams(window.location.search).get("t");
        if (still !== null) {
          controller.freeze(Number(still));
          setMode("idle");
          return;
        }
        controller.play(intro);
        setMode(intro ? "intro" : "idle");
      })
      .catch(() => setMode("static"));
    return () => {
      cancelled = true;
      controllerRef.current?.dispose();
      controllerRef.current = null;
    };
  }, []);

  const open =
    (lang: Lang, href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      const controller = controllerRef.current;
      if (
        !controller ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.button !== 0
      )
        return;
      event.preventDefault();
      if (mode === "opening") return;
      setMode("opening");
      setChosen(lang);
      controller.hover(null);
      controller.open(lang).then(() => {
        window.setTimeout(() => window.location.assign(href), 520);
      });
    };

  const live = mode !== "static";

  return (
    <main className={`library mode-${mode}`} id="main">
      <h1 className="sr-only">Alex Serrano · Portfolio</h1>

      <div className="fallback" aria-hidden={live}>
        <div className="fallback-vault" />
        <div className="fallback-wall">
          {[11, 23, 37].map((seed, bay) => (
            <div className="fallback-bay" key={seed}>
              {[0, 1, 2, 3, 4].map((row) =>
                bay === 1 && row === 2 ? (
                  <Shelf seed={seed + row} key={row}>
                    {books.map((book) => (
                      <a
                        key={book.lang}
                        href={book.href}
                        hrefLang={book.lang}
                        lang={book.lang}
                        className={`fallback-book book-${book.lang}`}
                        aria-label={book.label}
                        tabIndex={live ? -1 : undefined}
                      >
                        <span>Portfolio · {book.lang.toUpperCase()}</span>
                      </a>
                    ))}
                  </Shelf>
                ) : (
                  <Shelf seed={seed + row * 7} key={row} />
                ),
              )}
              {bay === 1 && (
                <span className="fallback-plaque">Español · English</span>
              )}
            </div>
          ))}
        </div>
        <div className="fallback-light" />
      </div>

      <canvas ref={canvasRef} className="library-canvas" aria-hidden="true" />

      {live && (
        <nav className="book-links" aria-label="Portfolio">
          {books.map((book) => (
            <a
              key={book.lang}
              ref={(node) => {
                linkRefs.current[book.lang] = node;
              }}
              href={book.href}
              hrefLang={book.lang}
              lang={book.lang}
              className="book-link"
              aria-label={book.label}
              onClick={open(book.lang, book.href)}
              onPointerEnter={() => controllerRef.current?.hover(book.lang)}
              onPointerLeave={() => controllerRef.current?.hover(null)}
              onFocus={() => controllerRef.current?.hover(book.lang)}
              onBlur={() => controllerRef.current?.hover(null)}
            >
              <span className="book-tip">{book.plaque}</span>
            </a>
          ))}
        </nav>
      )}

      {mode === "intro" && (
        <button
          type="button"
          className="skip-intro"
          onClick={() => {
            controllerRef.current?.skip();
          }}
        >
          <span lang="es">Saltar</span> · <span lang="en">Skip</span>
        </button>
      )}

      <div className="vignette" aria-hidden="true" />
      <div
        className={chosen ? "paper-fade is-on" : "paper-fade"}
        aria-hidden="true"
      >
        <span className="small">Ex libris</span>
        <span className="name">Alex Serrano</span>
      </div>
    </main>
  );
}
