# Phase 7 – Quality assurance

Plan (PLAN.md §5, Phase 7):

- [x] Playwright: add WebKit (desktop Safari, iPhone) next to Chromium
      (desktop, Pixel 7); fix whatever fails there.
- [x] Fill coverage gaps against the list in PLAN.md: sections in both
      languages, language switch keeps the path, case studies + next project +
      404, mobile menu (keyboard, Escape), theme switch, no JS and reduced
      motion, legal links per locale.
- [x] Accessibility: axe on every page in both themes (exists; check it runs
      in every project).
- [x] Lighthouse CI (`@lhci/cli`): config with budgets (mobile performance
      ≥ 95; accessibility, best practices, SEO = 100) against the production
      build; run locally.
- [x] CI workflow (GitHub Actions): checks, build, E2E, Lighthouse, so
      "green in CI" can be verified. Deploy follows in Phase 8.
- [x] Bundle: first-load JS of the homepage in the README.
- [x] Checks green, commits, summary to Laurin.

## Review

- WebKit (desktop Safari, iPhone 15) added next to Chromium (desktop, Pixel 7).
  Two test-only fixes: on short phones the case-study cover lands below the
  fold, and React skips shared transitions outside the viewport, so only the
  title morphs there (now asserted per viewport). WebKit logs aborted
  prefetches as errors when the test itself navigates away, so the
  console-error test listens per page.
- Coverage gap closed: the language switch is now clicked on a case study and
  on the legal page too.
- Lighthouse was at 0.89–0.97 on mobile; the case studies failed on TBT, which
  came from GSAP: loaded up front, with a forced style recalculation for every
  `<Reveal>` at startup. Now `loadGsap()` (`lib/gsap.ts`) loads it on first use;
  `<Reveal>` waits for its element to intersect (native observer), and the CSS
  pre-hide holds the start state until then. `@gsap/react` removed. Medians
  now 0.97–0.98; accessibility, best practices and SEO 100.
- Canonical audit failed locally only because the build's site URL differed
  from the test server's origin: CI builds with `http://localhost:3100`.
- JS on `/`: 157 kB with the page, plus 27 kB of GSAP after the hero entrance.
- CI workflow `.github/workflows/ci.yml`: checks + audit, then build, E2E (4
  projects) and Lighthouse. Deploy follows in Phase 8.
