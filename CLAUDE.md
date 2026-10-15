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
- Server Components by default. Pages are statically generated.
- i18n with next-intl: German default without prefix (`/`), English under `/en`
  (`localePrefix: "as-needed"`).
- UI strings in `messages/*.json`; content (projects, experience, profile) as typed,
  zod-validated objects in `content/`. One source of truth per text.
- Animation: GSAP + `@gsap/react` only, as progressive enhancement. No scroll
  hijacking; content must be visible without JS and with reduced motion.
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
