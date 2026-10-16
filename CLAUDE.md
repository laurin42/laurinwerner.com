# CLAUDE.md

@AGENTS.md

Portfolio of Laurin Werner (frontend/fullstack developer, Düsseldorf), deployed at
`laurinwerner.com`. The full roadmap with phases and acceptance criteria is in
`PLAN.md` — read it before starting work.

## Commands

| Command          | Purpose                                     |
| ---------------- | ------------------------------------------- |
| `pnpm dev`       | Dev server on http://localhost:3000         |
| `pnpm build`     | Production build                            |
| `pnpm lint`      | ESLint                                      |
| `pnpm typecheck` | `next typegen` + `tsc`                      |
| `pnpm test`      | Vitest unit tests (`tests/unit`)            |
| `pnpm test:e2e`  | Playwright E2E tests (`tests/e2e`)          |
| `pnpm format`    | Prettier (with Tailwind class sorting)      |
| `pnpm images`    | Convert project images to WebP (`scripts/`) |

Node version: see `.nvmrc`. pnpm version: pinned via `packageManager`.

## Architecture (target, see PLAN.md §4)

- Next.js 16 App Router, React 19, TypeScript strict + `noUncheckedIndexedAccess`.
- Server Components by default. Every page is statically generated (SSG via
  `generateStaticParams`; `dynamicParams = false` makes unknown slugs a real 404).
  `cacheComponents` is deliberately off: the site has no request-time data, and
  with it unknown slugs became soft 404s (status 200).
- i18n with next-intl: German default without prefix (`/`), English under `/en`
  (`localePrefix: "as-needed"`). The locale comes from `next/root-params` in
  `i18n/request.ts` (no `headers()`, so every page stays static). No locale cookie
  and no Accept-Language detection: the URL alone decides the language.
- Content: `content/schema.ts` (zod) → data files → `content/index.ts`, which validates
  at module load and returns localized objects (`getProjects(locale)`, …) via
  `localize()`. Missing facts are `TODO(laurin): …` strings, never invented text.
- Images: put sources in `<dir>/<slug>/` outside the repo and run
  `pnpm images <dir>`; it writes WebP to `public/images/projects/<slug>/`. Copy the
  printed width/height into the project file (a test checks they match).
- Design (Laurin, Phase 4): layout "A" with typography "B". Black and white plus
  one signal red (`--accent`), OKLch tokens in `app/globals.css` (grey only for
  secondary text; grey and red at AA contrast in both themes). Red is used only
  for: the last name ("WERNER", `<NameWords>`), interaction (link underlines
  via `textLink`/`quietLink` in `lib/ui.ts`, the permanent project-title
  underline, focus ring, selection),
  the reading-progress line under the header (scroll-driven CSS) and the tip of
  a rule while it draws in. Never for running text or areas.
  `type-display` = Archivo 800, 62 % width, uppercase; `type-label` = Archivo
  600, small, uppercase, spaced; body = Archivo. Projects are single-column, centered, full-width
  entries without borders (image, title on one line across the entry width, text;
  narrower `max-w-3xl` from `md` on).
  From `xl` on the header uses the hero's columns: menu, language and theme
  toggle span exactly the portrait's width, evenly spaced, no underlines (below
  `xl` the burger menu).
  Shared container/link classes in `lib/ui.ts`. Grid tracks always `minmax(0, …)`;
  long display titles are sized in `cqi` so they never overflow.
- Motion: `<Reveal>` (GSAP, IntersectionObserver, `gsap.matchMedia`) for content
  below the fold. The hero uses CSS-only `hero-in`/`hero-clip` so the LCP element
  never waits for hydration. On the homepage `<NameMorph>` flies the hero name
  word by word into the header name once it slides under the header, and back
  (IntersectionObserver + time-based GSAP FLIP). Never position elements from
  the scroll position frame by frame: it jitters, because the browser scrolls
  on another thread. With reduced motion the swap is instant, without JS the
  header name is always visible. Section headings: `<Rule>` draws in, then
  `<MaskedHeading>` rises (Reveal `line`/`mask`). Project covers are grey and
  take on colour while in focus or hovered (`<Colorize>`, CSS). Cover and title
  morph into the case study via React `<ViewTransition>` (shared names
  `project-cover-<slug>`/`project-title-<slug>`); morph participants get no
  entrance of their own, and `.hero-in`/`.hero-clip` only play on a full load
  (`data-navigated`, set by the inline script in the layout). Content is only hidden under `.js` (inline script in the layout) and without
  reduced motion; a CSS fallback reveals it after 2.5 s.
- Client components get their strings as props; `NextIntlClientProvider` ships no
  messages. Homepage section anchors are localized via `lib/sections.ts`.
- UI strings in `messages/*.json`; content (projects, experience, profile) as typed,
  zod-validated objects in `content/`. One source of truth per text.
- Animation: GSAP + `@gsap/react` only, as progressive enhancement. No scroll
  hijacking; content must be visible without JS and with reduced motion.
- SEO: `generateMetadata` per page via `lib/metadata.ts` (canonical, hreflang
  with `x-default` = German, shared Open Graph fields: a page's `openGraph`
  replaces the layout's, so spread `openGraph(locale)`). Homepage description in
  `content/profile.ts` (150–160 characters). JSON-LD from `lib/structured-data.ts`
  (`Person`, `CreativeWork`; `TODO(laurin)` values are left out). Share images
  and icons are generated with `next/og` (`lib/og.tsx`) from static Archivo
  TTFs in `assets/fonts/` (OFL; the renderer cannot read variable fonts). Image
  routes list their own `generateStaticParams`, tolerate empty params in
  `generateImageMetadata`, pass the locale explicitly to next-intl (no root
  params in route handlers) and are excluded from the proxy matcher. Absolute
  URLs come from `NEXT_PUBLIC_SITE_URL` at build time.
- Monitoring: GlitchTip via `@sentry/nextjs`, errors only, no tracing, no PII.
- Hosting: self-hosted Coolify (Docker), deploy via webhook from GitHub Actions.

## Decisions (Laurin, 2026-10-15)

D1 contact e-mail: `TODO(laurin)` · D2 DE default without prefix, EN `/en` ·
D3 native scroll, subtle reveals · D4 GSAP only · D5 GlitchTip errors-only ·
D6 CV as PDF download (Laurin supplies the file) · D7 the four client projects,
GitHub only as a link · D8 code/quotes/metrics per project `TODO(laurin)`.

## Rules

1. Never invent content (bio, project details, numbers, quotes, e-mail, links,
   legal address). Use a visible `TODO(laurin): …` placeholder instead and list it
   in the phase summary.
2. Design decisions (colors, fonts, layout, motion style) are Laurin's. Before
   Phase 4 styling stays functional and neutral.
3. Small Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`), one
   logical change each.
4. Before every commit: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`
   green (from Phase 7 on also `pnpm test:e2e`).
5. No secrets or infrastructure details in the repo (IPs, internal hostnames,
   DSNs). Everything via env vars, documented in `.env.example`.
6. Minimal client JS: `"use client"` only where interaction/animation is needed,
   as deep in the tree as possible.
7. Justify every new dependency. `pnpm audit --prod` must have no high/critical
   findings.
8. Ask instead of guessing, especially for anything public-facing or legal
   (imprint, privacy policy, redirects, DNS).
9. Nothing from imartur.com: no copied claims, headings, third-person FAQ or
   horizontal-scroll layout.
