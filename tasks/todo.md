# Phase 6 – Legal and monitoring

Plan (PLAN.md §5, Phase 6):

- [x] GlitchTip via `@sentry/nextjs` (D5): DSN, URL, org and project only from
      env vars; no PII, no tracing, no session envelopes, no replays, no logs.
- [x] Own tunnel at `/monitoring` (the SDK's `tunnelRoute` only rewrites to
      sentry.io): forwards envelopes for the configured DSN only, no client IP.
- [x] Server errors via `instrumentation.ts` (`onRequestError`), render errors
      via `app/global-error.tsx`.
- [x] Opt-in test route for Laurin to throw a deliberate error.
- [x] Legal page `/legal` (`#imprint`, `#privacy`), DE + EN: imprint structure
      from the old repo, address as `TODO(laurin)`; privacy policy describing
      what actually happens (server logs, GlitchTip, no cookies, localStorage
      for the theme, self-hosted fonts, e-mail, rights).
- [x] Tests: no third-party requests, tunnel rejects foreign DSNs, legal page.
- [x] Checks green, commits, summary to Laurin (not legal advice).

## Review

- GlitchTip: DSN, URL, org, project and auth token only from env vars. Only
  the user agent is collected (no IP, cookies, other headers, query strings,
  bodies or local variables); no tracing, sessions, replays or logs. Verified
  against a fake GlitchTip: nothing on page load; browser and server errors
  arrive; the only extra item is a "crashed" server session sent with an error.
- Own tunnel `/monitoring`: forwards only our DSN (400 otherwise), max 256 kB,
  no visitor headers (spoofed X-Forwarded-For does not arrive).
- `/legal`: imprint (§ 5 DDG, address TODO) and privacy policy draft in DE/EN,
  `noindex`. No cookies; localStorage `theme` only after toggling (tested).
- No third-party requests (tested). Sentry costs ~36 kB gzip of client JS
  (184 → 221 kB on `/`).
- Checks: lint, typecheck, 53 unit tests, build, 97 E2E tests, audit green.
