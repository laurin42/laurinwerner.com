# Phase 5 – SEO and metadata

Plan (PLAN.md §5, Phase 5):

- [x] Metadata helpers (`lib/metadata.ts`): canonical + hreflang (`de`, `en`,
      `x-default`), shared Open Graph fields, JSON-LD serializer (escapes `<`).
- [x] Layout: `metadataBase`, title template `%s – Laurin Werner`, site name,
      Twitter card, locale.
- [x] Home: title "Laurin Werner – Frontend-Entwickler in Düsseldorf", description
      150–160 characters (from known facts only, in `content/profile.ts`, for
      Laurin to review), canonical, hreflang, JSON-LD `Person`.
- [x] Case study: title, description (project summary), canonical, hreflang,
      JSON-LD `CreativeWork`; no `TODO(laurin)` values in metadata.
- [ ] ~~Not-found: localized title~~ – not possible: only the root
      `not-found` supports metadata. It keeps the site name; `noindex` comes
      from Next.
- [x] OG images with `next/og` and Archivo (static TTFs, OFL, `assets/fonts/`):
      home per language (name, role, red last name), case study per project.
- [x] `sitemap.ts` (both languages, all slugs, hreflang alternates), `robots.ts`.
- [x] Icons: generated `icon` (32, 192, 512), `apple-icon` (180), `favicon.ico`,
      `manifest.ts`.
- [x] Tests: unit (alternates, JSON-LD, sitemap), E2E (head tags per page and
      language, OG image is a 1200×630 PNG, sitemap, robots, icons, manifest).
- [x] Checks green, commits, summary to Laurin.

## Review

- Titles, descriptions, canonical, hreflang (`de`, `en`, `x-default`), Open
  Graph and Twitter tags on home and case studies in both languages.
- Share images: home (role · location, "LAURIN" white, "WERNER" red, dark), case
  studies (label · name, title), 1200×630 PNG, cached after the first request.
- JSON-LD `Person` (home) and `CreativeWork` (case studies), no TODO values.
- `sitemap.xml` (10 URLs with alternates), `robots.txt`, `manifest.webmanifest`,
  icons 32/192/512, apple icon 180, new `favicon.ico` (16/32/48), all "LW".
- Checks: lint, typecheck, 48 unit tests, build, 85 E2E tests green.
- For Laurin: review the meta description; check the LinkedIn preview with the
  Post Inspector and the JSON-LD with the Rich Results Test once deployed
  (needs the public URL, Phase 8).
