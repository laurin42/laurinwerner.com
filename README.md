# laurinwerner.com

Source of the portfolio site of Laurin Werner, frontend developer in Düsseldorf.

> Work in progress — the site is being rebuilt. A full README with architecture
> notes and Lighthouse scores follows once the site is live.

## Development

Requires Node (see `.nvmrc`) and pnpm (see `packageManager` in `package.json`).

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Checks: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, `pnpm build`.

## Quality

CI (`.github/workflows/ci.yml`) runs on every push and pull request:

- ESLint, TypeScript, Vitest, `pnpm audit --prod`.
- Playwright against the production build in Chromium and WebKit, desktop and
  mobile, including an axe scan of every page in both themes (no serious or
  critical violations).
- Lighthouse CI (`lighthouserc.json`), simulated mobile, median of five runs:
  performance ≥ 95, accessibility, best practices and SEO = 100. `/legal` is
  left out on purpose: it is `noindex`, which the SEO score counts against it.

To run E2E and Lighthouse locally, build with the test server's origin, so
canonical URLs match the tested page:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3100 pnpm build
pnpm test:e2e      # starts `pnpm start` on 3100 with CI=1, else `pnpm dev`
pnpm lighthouse    # starts its own server on 3100
```

### JavaScript on the homepage

Measured 2026-10-16 (gzip, production build):

| What                                                 | Size   |
| ---------------------------------------------------- | ------ |
| Loaded with the page (React, Next.js, components)    | 157 kB |
| GSAP, loaded after the hero entrance (`lib/gsap.ts`) | 27 kB  |
| Total                                                | 184 kB |

Case studies load 163 kB; GSAP follows only once an animated element scrolls
into view, and never with reduced motion.
