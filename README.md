# Alex Serrano — Software Engineer

The personal portfolio of Alejandro “Alex” Serrano Ruibal, a final-year Software Engineering student in Madrid. The site opens in a hexagonal library inspired by Borges’ _Library of Babel_: a short camera flight down the central shaft ends at a lit shelf holding two books, the Spanish and English editions. Opening a book leads to the portfolio itself, a scrolling site styled like a printed book: a title page and prologue, a table of contents of project chapters grouped by status, with filters, a diary, an about page with experience and education, and contact with CV downloads.

## Stack

- Next.js App Router, React and strict TypeScript
- Three.js for the library entrance, built procedurally (no 3D models or remote textures)
- `next/font` (Cormorant Garamond and EB Garamond, self-hosted at build time)
- Lucide icons; CSS and SVG diagrams, no animation runtime in the book
- Statically generated routes and PNG social previews
- No backend, analytics or contact-form service

## Local development

Requires Node.js 20.9 or newer and npm. The lockfile pins the installed versions.

```sh
npm ci
npm run dev
```

Open http://localhost:3000 for the library, or go straight to http://localhost:3000/es or http://localhost:3000/en.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

`npm start` serves the production build. Run `build` first. After a fresh checkout, the first build/dev run generates Next.js route types.

The build wrapper in `scripts/build.mjs` clears only this repository's generated `.next` output with native PowerShell on Windows. This avoids OneDrive directory-reparse-point errors and stale generated pages. Stop the local server before building. Other platforms, including Vercel, use Next.js's normal cleanup and build behavior.

For browser QA, install the Chrome testing channel if Chrome is not already installed, then run the suite against a production build:

```sh
npx playwright install chrome
npm run build
npm run test:e2e
npm run format:check
```

Playwright starts the server automatically when port 3000 is free. Set `PLAYWRIGHT_CHROMIUM` to a Chromium executable to use it instead of Chrome. The suite checks both languages, every chapter, the diary, about and contact pages, filters, the mobile menu, the library with and without JavaScript, language switching, legacy redirects, translated facts, PDF integrity, horizontal overflow and WCAG AA accessibility with axe. Screenshots are saved to the ignored `qa-artifacts/` directory.

Use `npm run format` to format source changes. The full dependency audit currently reports five development-only advisories in the Next.js ESLint glob dependency chain. The production-only audit reports zero vulnerabilities; do not apply the suggested forced Next.js lint-config downgrade.

## The library entrance

`src/components/library/scene.ts` builds the whole scene: stacked hexagonal galleries around a shaft, arched bays filled with instanced books, a field of towers seen from above, fog, lamps and a spotlight that falls on the two portfolio books. `library.tsx` overlays real links on those books, so they work with keyboard and screen readers.

- The intro (about 5 s: aerial view, descent, gallery, light) plays once per visit, remembered in `sessionStorage` under `babel:intro-seen`, so returning from a book in the same tab skips it. It has a skip button and is skipped with reduced motion.
- Without JavaScript or WebGL a drawn CSS shelf with the same two books is shown instead.
- For QA, `/?t=2.5` freezes the intro at that second.

## Project structure

```text
src/
  app/
    (library)/               # Root layout and page for the library at /
    [lang]/                  # Root layout for the book in /es and /en
      page.tsx               # Title page, prologue, contents and diary card
      projects/[slug]/       # Chapters (one per project)
      diary/                 # Diary index and entries
      about/ · contact/      # Experience, education and contact
    book.css                 # Book design system (paper, type, seals, diagrams)
    library.css              # Library overlay, fallback shelf and transitions
    fonts.ts                 # next/font setup
    global-not-found.tsx     # Fallback for paths outside the routes
  components/
    library/                 # Three.js scene and its React wrapper
    book/                    # Running head, contents filters, seals, diagrams, footer
    social-image.tsx         # Localized social-preview artwork
  data/
    portfolio.ts             # Typed project facts, links, seals, education, experience
    diary.ts                 # Diary entries (ES/EN) with their photos
  i18n/
    routes.ts                # Locales, route helpers and project order
    copy.ts                  # EN/ES interface copy and diagram labels
    es-content.ts            # Spanish translations of the portfolio facts
    content.ts               # Localized data helpers
  assets/                    # Diary photos and project figures
public/cv/                   # Downloadable CV PDFs
```

## Editing content

Edit **`src/data/portfolio.ts`** for English project facts and **`src/i18n/es-content.ts`** for their Spanish translation. Interface copy lives in `src/i18n/copy.ts`.

To add a project:

1. Add an entry to `projects` with a stable slug, its `kind` (used by the filters) and its `status` (`Ongoing`, `Completed` or `Paused`, which sets its group in the contents). Awards go in `event.seals` and render as wax seals.
2. Add its Spanish translation and its slug to `projectOrder` in `src/i18n/routes.ts`.
3. Optionally add a diagram branch in `src/components/book/diagrams.tsx`, with labels in `copy.ts`.

To add a diary entry, add it to `src/data/diary.ts` with both languages and import its photos from `src/assets/diary/`.

## Language routing

The book lives at `/es/...` and `/en/...`. The language switch keeps the current page and section. Old `/projects/:slug` links permanently redirect to the English chapter. Metadata, document language, social previews and sitemap alternates are localized.

## CV PDFs

The original root PDFs are retained, and byte-identical copies are provided in:

- `public/cv/CV_Alejandro_Serrano_Ruibal_EN.pdf`
- `public/cv/CV_Alejandro_Serrano_Ruibal_ES.pdf`

Replace these public files to update downloads. If filenames change, update `profile.cv` in the data file. Both downloads are linked from the contact section in either website language.

## Deploy to Vercel

1. Push this repository to GitHub and import it into Vercel.
2. Choose **Next.js**. Keep the root directory at the repository root.
3. Use the default install command and `npm run build`; leave the output directory at its default.
4. Set `NEXT_PUBLIC_SITE_URL` to the actual HTTPS origin (e.g. your Vercel hostname or custom domain, without a trailing slash).
5. Deploy. If you change the domain, update this variable and redeploy.

The origin config enables canonical URLs, absolute social metadata and the bilingual sitemap. On Vercel, `VERCEL_PROJECT_PRODUCTION_URL` is the fallback when no custom origin is set. It is intentionally unset locally rather than inventing a production hostname. Preview deployments should be marked non-indexable through Vercel's preview settings.

## Accessibility and performance

Semantic landmarks, a skip link, visible focus rings and an Escape-dismissable mobile menu. The book links in the library are real anchors positioned over the 3D books. The Three.js code loads only on `/`, after checking WebGL, and the book pages ship no 3D code. Reduced motion skips the intro and the reveal animations. All content stays readable with JavaScript disabled.
