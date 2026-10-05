# Alex Serrano — Software Engineer

A project-led personal portfolio for Alejandro “Alex” Serrano Ruibal, a final-year Software Engineering student in Madrid. One scrolling journey through six engineering projects, explanatory system diagrams, academic background and real English/Spanish CV downloads. The full site is available in English and Spanish, with shared components and content. Built in the repository root for deployment on Vercel.

## Stack

- Next.js App Router, React and strict TypeScript
- Tailwind CSS v4 plus a custom responsive design system
- Lucide icons; CSS and SVG animations, with no animation runtime
- Statically generated project routes and PNG social preview
- No backend, analytics, remote images, external fonts or contact-form service

## Local development

Requires Node.js 20.9 or newer and npm. The lockfile pins the installed versions.

```sh
npm ci
npm run dev
```

Open http://localhost:3000/en or http://localhost:3000/es. English is the default; `/` permanently redirects to `/en`. The development server uses the repository root.

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

Playwright starts the server automatically when port 3000 is free. Stop any development server first when testing the production build. The 20-test suite checks both languages and all six case studies, same-project language switching, legacy redirects, original facts and repository links, PDF integrity, comparable project section sizes, mobile navigation, keyboard behavior, cover and diagram scroll progress, disclosure animation and reversal, reduced motion, no-JavaScript disclosures, horizontal overflow at five viewport widths and WCAG AA accessibility with axe. Screenshots are saved to the ignored `qa-artifacts/` directory.

Use `npm run format` to format source changes. The full dependency audit currently reports five development-only advisories in the Next.js ESLint glob dependency chain. The production-only audit reports zero vulnerabilities; do not apply the suggested forced Next.js lint-config downgrade.

## Project structure

```text
src/
  app/
    globals.css              # Shared design tokens, hero and base styles
    portfolio.css            # Open project chapters and responsive layouts
    project-motion.css       # Explanatory scroll motion and reduced-motion fallback
    opening.css              # Editorial cover, toolkit and progressive disclosure
    [lang]/
      layout.tsx             # Document language, navigation, metadata and Person schema
      page.tsx               # Shared homepage section composition
      projects/[slug]/page.tsx # Statically generated bilingual case studies
      opengraph-image.tsx     # Localized 1200 × 630 PNG social preview
    opengraph-image.tsx       # Preserved English social-preview URL
    global-not-found.tsx      # Fallback for paths outside locale routes
    icon.svg                 # Initials favicon
    robots.ts / sitemap.ts  # Search engine configuration
  components/
    sections.tsx             # Homepage sections and footer
    cover.tsx                # Name-led cover and atmospheric engineering map
    accordion.tsx            # Native accessible disclosures with measured-height animation
    project-card.tsx         # Equal-weight project chapters, metrics and status labels
    diagrams.tsx             # Conceptual technical diagrams
    ui.tsx                   # Navigation, language switch, scroll scenes and system map
    social-image.tsx         # Shared localized social-preview artwork
  data/
    portfolio.ts             # Typed content, links and chronology
  i18n/
    routes.ts                # Supported locales, route helpers and project order
    copy.ts                  # Typed EN/ES interface, diagram and positioning copy
    es-content.ts            # Spanish translations of existing portfolio facts
    content.ts               # Shared localized data and four toolkit categories
    metadata.ts              # Localized SEO and deployment origin
public/cv/                   # Downloadable CV PDFs
```

## Editing content

Edit **`src/data/portfolio.ts`** for English project facts, technologies, metrics, dates, repository URLs, education, professional experience, toolkit and working qualities. Public email, GitHub, LinkedIn and CV paths live in `profile` in that file. Update the corresponding Spanish translation in `src/i18n/es-content.ts`. Interface, positioning, language context and SEO copy live in `src/i18n/copy.ts`. Repository URLs, technologies and numeric metrics are shared across languages.

To add a project:

1. Add an entry to `projects`, satisfying the `Project` type. Use a stable, unique URL slug.
2. Add only verifiable metrics and technology claims. An empty `metrics` array is supported.
3. Add its Spanish translation to `src/i18n/es-content.ts`.
4. Add its slug to `projectOrder` in `src/i18n/routes.ts`. Homepage numbering and both languages' case-study routes are derived from that order on the next build.
5. Add an accurate conceptual diagram branch in `diagrams.tsx`, with both languages' labels in `copy.ts`.

The diagrams explain concepts rather than claiming a literal deployed architecture. For La Abuelita, contributions remain at team level because individual ownership was not supplied.

## Language routing

All content uses `/en/...` and `/es/...`, including `/en/projects/la-abuelita` and `/es/projects/la-abuelita`. The navbar language control retains the current project, query string and section fragment. Existing `/projects/:slug` links permanently redirect to the equivalent English case study. The old `#work`, `#building` and `#background` anchors are retained; navigation uses Projects, Education, About and Contact.

Both languages reuse the same components, source facts and diagrams. Metadata, document language, social previews and sitemap alternate-language links are localized. No browser-language detection overrides the English default.

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

Semantic landmarks, a skip link, visible focus rings, keyboard-accessible disclosures, an Escape-dismissable mobile menu, download labels and responsive diagrams. `ScrollScene` updates CSS progress through a passive scroll listener and animation frames only while its diagram is in view. Progress reveals graph relationships, cloud delivery stages, traversal, quadratic costs and socket connections. Reduced-motion mode shows the complete diagrams without animated signals; content also remains visible with JavaScript disabled. Typography uses local system fonts to avoid font downloads and layout shifts. Public contact uses `mailto:`; no phone number is rendered on the site.

The cover reinterprets the existing system map as an abstract connected foundation. Scrolling moves the name and navigation gently while expanding the network; desktop pointer movement is limited to a few pixels. A short positioning statement connects it to the unchanged six-project journey. Toolkit stays open; university education stays visible. Earlier education, working qualities, experience while studying and personal interests use native `<details>` disclosures, enhanced with measured-height, opacity and translate animations. They remain functional without JavaScript, support Enter/Space, and open immediately in reduced-motion mode.

## Content maintenance

Review ongoing project statuses, expected graduation and chronology as the work changes. No production deployments, project users or individual hackathon component ownership are assumed. The supplied project metrics describe the hackathon codebase and governance dataset, not site activity.
