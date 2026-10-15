# PLAN.md – Neuaufbau Portfolio laurinwerner.com

> **An den Agenten:** Lies dieses Dokument vollständig, bevor du irgendetwas tust.
> Es beschreibt Ziel, Ausgangslage, Regeln, Zielarchitektur und die Arbeitsphasen
> mit Abnahmekriterien. Arbeite die Phasen **in Reihenfolge** ab. Am Ende jeder
> Phase: alle Checks grün, committen und Laurin eine kurze Zusammenfassung geben.
> Danach geht es erst nach seinem OK weiter.

---

## 0. Ziel und Kontext

Laurin (früher Laurin **Schmidt**, jetzt Laurin **Werner**) ist Webentwickler in
Düsseldorf und sucht eine Festanstellung als Frontend- bzw. Fullstack-Entwickler
(React, Next.js, TypeScript). Das Portfolio ist sein wichtigstes Bewerbungsargument.

**Die neue Seite muss drei Dinge leisten:**

1. **Projekte als Hauptargument.** Laurin hat vier echte, live geschaltete
   Kundenprojekte, aber nur wenig Berufserfahrung. Die Projekte stehen im
   Mittelpunkt und bekommen eigene Case-Study-Seiten.
2. **Eigene Identität.** Die alte Seite hat Struktur, Texte und Stil von
   https://www.imartur.com weitgehend übernommen. **Nichts davon wird
   wiederverwendet:** keine übersetzten Claims, keine Experience-Überschriften wie
   „Into The Fire“, „Take The Bull By The Horns“ oder „Making It Count“, keine
   FAQ in der dritten Person, und kein Nachbau des Layouts mit horizontalem Scroll.
3. **Der Code ist selbst eine Arbeitsprobe.** Recruiter und Tech-Leads schauen ins
   Repo. Saubere App-Router-Architektur, strikte Typen, Tests, CI und eine gute
   README sind Pflicht.

| | |
|---|---|
| Neue Domain | `laurinwerner.com` |
| Alte Domain | `laurinschmidt.dev` (wird per 301 umgeleitet, siehe Phase 8) |
| Altes Repo | `github.com/laurin42/portfolio` (nur als Quelle, wird später archiviert) |
| Hosting | Eigener Server mit **Coolify** (Docker), Deployment per Webhook aus GitHub Actions |
| Monitoring | Selbst gehostetes **GlitchTip** (Sentry-kompatibel) |

---

## 1. Arbeitsregeln für den Agenten

1. **Erfinde keine Inhalte.** Texte über Laurin, Projektdetails, Zahlen, Kundenzitate,
   E-Mail-Adresse, Social-Links und die Impressumsadresse kommen von ihm. Wo etwas
   fehlt, setze einen sichtbaren Platzhalter `TODO(laurin): …` und führe ihn in der
   Phasen-Zusammenfassung auf.
2. **Design-Entscheidungen trifft Laurin.** Für Farben, Schriften, Layout-Prinzip und
   Animationsstil legst du in Phase 4 zwei oder drei Richtungen vor und lässt ihn
   wählen. Davor wird nur funktional und neutral gestylt.
3. **Kleine, nachvollziehbare Commits** im Conventional-Commits-Stil (`feat:`, `fix:`,
   `chore:`, `docs:`, `test:`). Eine logische Änderung pro Commit.
4. **Vor jedem Commit** müssen `pnpm lint`, `pnpm typecheck`, `pnpm test` und
   `pnpm build` grün sein. Ab Phase 7 auch `pnpm test:e2e`.
5. **Keine Secrets und keine Infrastruktur-Details im Repo.** Keine Server-IPs, keine
   internen Hostnamen, keine DSNs, keine lokalen Netzwerk-IPs. Alles über
   Umgebungsvariablen, dokumentiert in `.env.example`.
6. **So wenig Client-JS wie möglich.** Standard sind Server Components. `"use client"`
   nur für Komponenten, die wirklich Interaktion oder Animation brauchen, und so tief
   im Baum wie möglich.
7. **Abhängigkeiten bewusst wählen.** Vor jeder neuen Dependency kurz begründen,
   warum sie nötig ist. Nach dem Setup `pnpm audit --prod` ausführen: keine
   kritischen oder hohen Findings.
8. **Bei Unklarheit fragen statt raten**, vor allem bei allem, was nach außen sichtbar
   ist oder rechtliche Folgen hat (Impressum, Datenschutz, Redirects, DNS).

---

## 2. Ausgangslage: das alte Repo

Das alte Repo liegt als Referenz unter `../portfolio-old` (vorher klonen:
`git clone https://github.com/laurin42/portfolio ../portfolio-old`). **Nicht darin
arbeiten**, nur lesen und gezielt Dateien übernehmen.

### 2.1 Was übernommen werden kann (mit Anpassungen)

| Bereich | Dateien im alten Repo | Anpassung |
|---|---|---|
| i18n mit next-intl | `i18n/routing.ts`, `i18n/request.ts`, `i18n/navigation.ts`, `proxy.ts` | Locale-Konfiguration laut Entscheidung D2 |
| Theme-Tokens, Dark Mode | `app/globals.css`, `components/theme-provider.tsx`, `components/navigation/ThemeToggle.tsx` | Tokens werden in Phase 4 neu gesetzt; die Struktur (OKLch-Variablen, `next-themes`) bleibt |
| shadcn/ui-Basis | `components.json`, `components/ui/*`, `lib/utils.ts` | Nur Komponenten übernehmen, die wirklich gebraucht werden |
| Playwright und CI | `playwright.config.ts`, `.github/workflows/playwright.yml` | Siehe die bekannten Fehler unten |
| Impressum-Seite | `app/[locale]/legal-notice/page.tsx` | Struktur übernehmen, Inhalt neu (Phase 6) |
| GlitchTip/Sentry | `instrumentation.ts`, `instrumentation-client.ts`, `sentry.*.config.ts` | Neu konfigurieren (Phase 6) |
| Stack-Icons | `public/icons/**` | Nur die tatsächlich verwendeten |
| Projekt-Mockups | `public/images/projects/**` | **Nicht** direkt übernehmen, sondern konvertieren (Phase 2) |

### 2.2 Bekannte Probleme im alten Code, die nicht wiederholt werden dürfen

- **Veraltete Next.js-Version mit Sicherheitslücken.** Version 16.0.7 hat laut
  `pnpm audit` zwei kritische RCE-Lücken (eine davon in der Image-Optimierung) und
  mehrere DoS-Lücken, behoben erst ab 16.3.3. → Aktuelles stabiles Next.js 16.x
  verwenden. `pnpm` gehört nicht in die `dependencies`.
- **Die ganze Seite steckt in einer Client-Komponente.** `app/[locale]/page.tsx` gibt
  nichts zurück, alle Sektionen rendert `components/layout/LayoutClient.tsx`
  (`"use client"`) im Layout. → Die Seite gehört in `page.tsx`, die Sektionen sind
  Server Components.
- **Eine rAF-Schleife läuft ohne Ende.** Die aktive Sektion wird jeden Frame per
  `requestAnimationFrame` und `getBoundingClientRect()` ermittelt. →
  `IntersectionObserver` verwenden.
- **Mobile/Desktop-Weiche per JS-Hook** (`useIsMobile`, startet mit `false`). Das
  führt zu falschem SSR-Markup auf Mobilgeräten und zu Layout-Sprüngen. → Per CSS
  umschalten, für GSAP `gsap.matchMedia()`.
- **Globale GSAP-Selektoren.** `gsap.utils.toArray(".block")` wird außerhalb von
  `gsap.context` aufgerufen, und `block` ist zugleich eine Tailwind-Klasse. → Refs
  oder `data-`-Attribute verwenden, alles in `useGSAP` mit `scope`.
- **Zwei Animationsbibliotheken** (GSAP und Motion). → Nur eine (siehe D4).
- **Inhalte liegen doppelt** (`lib/data/*.ts` neben `dictionary/*.json`), und Texte
  stehen hartcodiert in Komponenten (zum Beispiel englische Sektions-Labels auf der
  deutschen Seite). → Eine einzige, typisierte Inhaltsquelle (siehe Abschnitt 4.3).
- **Riesige Bilder.** `public/` hat 27 MB, ein PNG-Mockup allein 9,6 MB. → Vorher
  konvertieren.
- **Datenschutzerklärung und Code widersprechen sich.** Der Text sagt „kein Tracking,
  keine externen Dienste“, während Sentry mit `tracesSampleRate: 1` und
  `sendDefaultPii: true` läuft. → Siehe Phase 6.
- **Infrastruktur im Repo.** In `next.config.ts` stehen die GlitchTip-URL mit
  Server-IP über `http://` und eine lokale IP in `allowedDevOrigins`. → Alles über
  Umgebungsvariablen.
- **Schwache Metadaten.** Der Titel ist nur der Name, die Description nur
  „Webdeveloper“, es gibt keine OG-Tags, keine Sitemap und keine `robots`-Angabe.
- **Kleinkram:** ungültige Klassen (`aninmate-fadeIn`, `will-transform`),
  `role="text"`, ein leeres `alt` beim Hauptbild eines Projekts, leere Strings in der
  Hero-Liste.
- **Tests und CI:** Ein Test erwartet `/legal-notice`, obwohl der Link bei
  `localePrefix: "always"` `/en/legal-notice` lautet. Im Workflow wird der
  Staging-Deploy nie erreicht. Die README ist noch der Standardtext von
  create-next-app.

---

## 3. Offene Entscheidungen (Laurin)

Diese Punkte stellst du Laurin **zu Beginn von Phase 0** als kompakte Liste vor.
Wo er nichts sagt, gilt die Voreinstellung.

| # | Frage | Voreinstellung |
|---|---|---|
| D1 | Kontakt-E-Mail-Adresse auf der neuen Seite? | `TODO(laurin)` |
| D2 | Standardsprache und URL-Schema? | Deutsch als Standard ohne Präfix (`/`), Englisch unter `/en` (`localePrefix: "as-needed"`) |
| D3 | Gibt es auf der Startseite überhaupt Scroll-Effekte (Smooth Scroll, angepinnte Sektionen)? | Nein: nativer Scroll, dezente Einblendungen, keine Scroll-Übernahme |
| D4 | Welche Animationsbibliothek? | Nur GSAP mit `@gsap/react` (`useGSAP`); Motion entfällt |
| D5 | GlitchTip behalten? | Ja, nur für Fehler, ohne Performance-Tracing und ohne PII |
| D6 | Soll es eine Seite oder ein PDF mit dem Lebenslauf geben? | PDF-Download, Datei liefert Laurin |
| D7 | Welche Projekte, in welcher Reihenfolge? Ist das GitHub-„Code Playground“-Element noch dabei? | Die vier Kundenprojekte; GitHub nur als Link im Footer bzw. in „Über mich“ |
| D8 | Gibt es zu den Projekten öffentlichen Code, Kundenzitate oder Messwerte? | Pro Projekt `TODO(laurin)` |

---

## 4. Zielarchitektur

### 4.1 Tech-Stack

- **Next.js 16.x** (aktuelles stabiles Release), App Router, React 19, **TypeScript
  strict** (zusätzlich `noUncheckedIndexedAccess`)
- **pnpm**, Node LTS, Version gepinnt über `packageManager` in `package.json` und
  `.nvmrc`
- **Tailwind CSS v4**, shadcn/ui nur bei Bedarf
- **next-intl** für i18n
- **GSAP + @gsap/react** für Animationen (laut D4)
- **zod** zur Validierung der Inhalte beim Build
- **Vitest** für Unit-Tests, **Playwright** plus **@axe-core/playwright** für E2E-
  und Barrierefreiheitstests
- **@sentry/nextjs** gegen GlitchTip (laut D5)
- Schriften über `next/font` (wird beim Build selbst gehostet, also keine Anfragen an
  Google zur Laufzeit)

### 4.2 Verzeichnisstruktur

```
app/
  [locale]/
    layout.tsx              # html/body, Provider, Header, Footer (Server Component)
    page.tsx                # Startseite: setzt die Sektionen zusammen (Server Component)
    projects/[slug]/page.tsx  # Case-Study-Seiten, generateStaticParams
    legal/page.tsx          # Impressum und Datenschutz
    not-found.tsx
  opengraph-image.tsx       # dynamisches OG-Bild (next/og)
  sitemap.ts
  robots.ts
  global-error.tsx
components/
  sections/                 # Hero, Projects, About, Experience, Contact (Server Components)
  project/                  # ProjectCard, CaseStudy-Bausteine
  layout/                   # Header, Footer, Nav, LanguageSwitcher, ThemeToggle
  motion/                   # kleine Client-Wrapper für Animationen (Reveal, …)
  ui/                       # shadcn
content/
  projects/
    praxis-werner.ts
    burchartz.ts
    wetterstrucksi.ts
    burnheart-mockery.ts
  experience.ts
  profile.ts                # Name, Rolle, Ort, Links, E-Mail
  schema.ts                 # zod-Schemas und abgeleitete Typen
  index.ts                  # Zugriffsfunktionen: getProjects(locale), getProject(slug, locale), …
messages/
  de.json                   # nur UI-Texte (Navigation, Buttons, Labels)
  en.json
i18n/                       # routing, request, navigation
lib/                        # utils, site-config (Basis-URL usw.)
public/
  images/projects/<slug>/   # optimierte Bilder (webp/avif)
  cv/                       # Lebenslauf-PDF (laut D6)
scripts/
  optimize-images.ts        # sharp: Quelle → webp/avif, maximale Breite, Qualität
tests/
  unit/                     # Vitest
  e2e/                      # Playwright
```

### 4.3 Inhaltsmodell

- **UI-Texte** (Buttons, Labels, Navigation) liegen in `messages/*.json`.
- **Inhalte** (Projekte, Werdegang, Profil) liegen als typisierte TypeScript-Objekte
  in `content/`. Felder, die übersetzt werden, haben die Form `{ de: string; en: string }`.
- Alle Inhalte werden mit **zod** validiert. Ein Vitest-Test prüft, dass jeder Eintrag
  gültig ist, jede Sprache befüllt ist und jedes referenzierte Bild existiert.

**Schema für ein Projekt:**

```ts
type Localized<T = string> = { de: T; en: T };

type Project = {
  slug: string;                    // URL-Segment
  title: string;
  client: string;
  year: number;
  role: Localized;                 // z. B. „Konzept, Design & Entwicklung“
  summary: Localized;              // 1–2 Sätze für die Karte auf der Startseite
  tagline?: Localized;
  stack: string[];
  problem: Localized;              // Ausgangslage
  solution: Localized;             // Was gebaut wurde und warum so
  highlights: Localized<string[]>; // 3–5 technische Punkte
  results?: Localized<string[]>;   // Messbares: Lighthouse, Ladezeit, Reichweite, Ergebnis für den Kunden
  testimonial?: { quote: Localized; author: string };
  links: { live: string; code?: string };
  images: { cover: Img; gallery?: Img[] };   // Img = { src, alt: Localized, width, height }
  featured: boolean;
  order: number;
};
```

Den Inhalt der vier Projekte vorbefüllen: Was auf der alten Seite steht, kommt aus
`../portfolio-old/dictionary/de.json` und `en.json`. Alles Weitere wird
`TODO(laurin)`.

### 4.4 Rendering und Animation

- Alle Seiten werden statisch erzeugt (`generateStaticParams` für Sprachen und Slugs).
- Animationen sind **progressive Verbesserung**. Ohne JS und bei
  `prefers-reduced-motion: reduce` ist der gesamte Inhalt sichtbar und bedienbar.
- Es gibt einen einzigen kleinen Client-Wrapper (z. B. `<Reveal>`), der Kinder
  dezent einblendet. Er nutzt `useGSAP`, ist scoped per Ref, respektiert
  `gsap.matchMedia()` und reduzierte Bewegung.
- Kein Scroll-Hijacking (laut D3). Die Navigation nutzt echte Anker-Links
  (`#projekte`), die auch ohne JS funktionieren.

---

## 5. Phasen

### Phase 0 – Projekt aufsetzen

**Aufgaben**

1. Entscheidungen D1–D8 bei Laurin abfragen (siehe Abschnitt 3).
2. Neues Repo `laurinwerner.com` (Name nach Laurins Wahl) mit `create-next-app`
   anlegen: TypeScript, Tailwind, ESLint, App Router, pnpm.
3. `tsconfig` auf strict plus `noUncheckedIndexedAccess` setzen; Pfad-Alias `@/*`.
4. Scripts in `package.json`: `dev`, `build`, `start`, `lint`, `typecheck`
   (`tsc --noEmit`), `test` (Vitest), `test:e2e` (Playwright), `format` (Prettier),
   `images` (Bild-Skript).
5. Prettier mit Tailwind-Plugin, `.editorconfig`, `.nvmrc`, `.env.example`.
6. Vitest und Playwright einrichten, mit je einem Smoke-Test.
7. `pnpm audit --prod` ohne kritische oder hohe Findings.
8. `CLAUDE.md` mit Befehlen, Architektur-Kurzfassung und den Regeln aus Abschnitt 1.

**Abnahme:** `pnpm lint && pnpm typecheck && pnpm test && pnpm build` laufen grün; das
Repo ist auf GitHub.

### Phase 1 – Grundgerüst, i18n, Layout

**Aufgaben**

1. next-intl einrichten (Konfiguration laut D2), `proxy.ts` mit Matcher, der
   `_next`, statische Dateien und den Monitoring-Tunnel ausschließt.
2. `app/[locale]/layout.tsx`: `<html lang={locale}>`, Schriften, ThemeProvider,
   Header, Footer, Skip-Link „Zum Inhalt springen“.
3. Header: Name bzw. Logo (Link zur Startseite), Anker-Navigation, LanguageSwitcher
   (bleibt auf der aktuellen Seite), ThemeToggle. Auf Mobilgeräten ein zugängliches
   Menü (Fokus-Falle, Escape schließt, `aria-expanded`).
4. Footer: Links, Copyright „Laurin Werner“, Link zu Impressum und Datenschutz.
5. `not-found.tsx` pro Sprache.
6. `lib/site-config.ts`: Basis-URL aus `NEXT_PUBLIC_SITE_URL`, Name, Rolle.

**Abnahme:** Beide Sprachen sind erreichbar; der Sprachwechsel behält den Pfad; die
Navigation ist per Tastatur vollständig bedienbar; es gibt keine Hydration-Warnungen in
der Konsole.

### Phase 2 – Inhaltsmodell und Bilder

**Aufgaben**

1. `content/schema.ts` mit den zod-Schemas aus Abschnitt 4.3, Typen per `z.infer`.
2. `content/profile.ts`, `content/experience.ts` und die vier Projektdateien anlegen
   und mit den vorhandenen Inhalten der alten Seite vorbefüllen, Lücken als
   `TODO(laurin)`.
   **Achtung:** Die alten Werdegang-Überschriften und Claims werden nicht übernommen
   (siehe Abschnitt 0). Für den Werdegang nur sachliche Angaben: Station, Zeitraum,
   Ort, 1–2 Sätze, Stichworte.
3. `content/index.ts` mit Zugriffsfunktionen, die eine Sprache entgegennehmen und
   bereits lokalisierte Objekte zurückgeben.
4. `scripts/optimize-images.ts` mit sharp: Die Quellen aus
   `../portfolio-old/public/images/projects/**` (bzw. von Laurin gelieferte neue
   Screenshots) werden nach `public/images/projects/<slug>/` als WebP konvertiert,
   maximal 2000 px breit, Qualität etwa 80. Ziel: unter 300 KB pro Bild.
   Originale landen **nicht** im Repo.
5. Vitest-Test für die Inhalte: Schema gültig, alle Sprachen befüllt, Slugs
   eindeutig, alle Bildpfade existieren, kein Bild größer als 500 KB.

**Abnahme:** Die Tests laufen grün; `public/` ist kleiner als 5 MB;
`grep -ri schmidt` findet nichts außerhalb von Kommentaren, die auf das alte Repo
verweisen.

### Phase 3 – Seiten und Sektionen (funktional, neutral gestylt)

**Startseite** (`app/[locale]/page.tsx`), Reihenfolge:

1. **Hero:** Name, Rolle (z. B. „Frontend-Entwickler“), ein Satz Positionierung
   `TODO(laurin)`, Ort, Verfügbarkeit („offen für Festanstellung in NRW / remote“),
   CTAs „Projekte ansehen“ und „Kontakt“.
2. **Ausgewählte Projekte:** Karten aus `getProjects(locale)`, mit Cover-Bild, Titel,
   Kurzbeschreibung und Stack-Tags. Die ganze Karte verlinkt auf die Case Study.
3. **Über mich und Stack:** kurzer Fließtext `TODO(laurin)`, Stack als gruppierte
   Textliste (kein Icon-Raster), Download-Link zum Lebenslauf (D6).
4. **Werdegang:** schlichte vertikale Timeline.
5. **Kontakt:** E-Mail als `mailto:`-Link, LinkedIn, GitHub. Kein Formular.

**Case Study** (`app/[locale]/projects/[slug]/page.tsx`): Titel, Kunde, Jahr,
Rolle, Stack, Links (Live und gegebenenfalls Code), dann Ausgangslage, Lösung,
Highlights, Ergebnisse, optional ein Zitat, Galerie. Am Ende „Nächstes Projekt“.
`generateStaticParams` für alle Slugs; unbekannte Slugs führen zu `notFound()`.

**Regeln für diese Phase:** ausschließlich Server Components; semantisches HTML
(`<section aria-labelledby>`, genau ein `<h1>` pro Seite, korrekte
Überschriften-Hierarchie); alle Bilder über `next/image` mit Breite, Höhe,
lokalisiertem `alt` und `sizes`; externe Links mit `rel="noopener noreferrer"`.
Neutrales Styling ist ausreichend.

**Abnahme:** Alle Inhalte sind ohne JavaScript sichtbar (Playwright-Test mit
`javaScriptEnabled: false`); kein `"use client"` außer in Header-Menü,
ThemeToggle und LanguageSwitcher.

### Phase 4 – Design und Animation

**Aufgaben**

1. Lies den aktuellen Stand und schlage Laurin **zwei oder drei Design-Richtungen**
   vor: je eine Schriftpaarung, Farbtokens (hell und dunkel, eine Akzentfarbe),
   Layout-Prinzip und Animationsstil in einem Satz, dazu ein Screenshot oder eine
   kurze Vorschau der Hero- und Projektsektion. Wichtig: eigenständig, nicht
   angelehnt an imartur.com. Schwarz-Weiß mit einer Akzentfarbe ist erlaubt.
2. Nach Laurins Wahl: Tokens in `globals.css` setzen (OKLch, gemeinsamer Satz für
   hell und dunkel), Typo-Skala, Abstände, Komponenten stylen.
3. Den `<Reveal>`-Wrapper (Abschnitt 4.4) bauen und sparsam einsetzen. Optional ein
   besonderer Moment, z. B. im Hero oder bei den Projekt-Covern.
4. Hover- und Fokuszustände für alle interaktiven Elemente; Fokus-Ringe gut sichtbar.

**Abnahme:** Kontrast WCAG AA in beiden Themes; bei `prefers-reduced-motion` keine
Bewegung; kein Layout-Shift durch Animationen (CLS < 0,05); funktioniert ab 320 px
Breite ohne horizontales Scrollen.

### Phase 5 – SEO und Metadaten

**Aufgaben**

1. `generateMetadata` pro Seite und Sprache: Titel nach dem Muster
   „Laurin Werner – Frontend-Entwickler in Düsseldorf“, Description (150–160 Zeichen),
   Canonical-URL, `alternates.languages` (hreflang inklusive `x-default`).
2. `app/opengraph-image.tsx` mit `next/og` (Name, Rolle, Akzentfarbe); für Case
   Studies ein eigenes OG-Bild mit dem Projekttitel.
3. `sitemap.ts` (alle Sprachen und Slugs), `robots.ts`.
4. JSON-LD: `Person` auf der Startseite (Name, Rolle, Ort, `sameAs` mit LinkedIn und
   GitHub), `CreativeWork` auf den Case Studies.
5. Favicon, Apple-Touch-Icon und `manifest.ts`.

**Abnahme:** Die Seite besteht den Rich-Results-Test für das JSON-LD; die
LinkedIn-Vorschau zeigt Titel, Text und Bild (Laurin prüft das mit dem
LinkedIn Post Inspector).

### Phase 6 – Rechtliches und Monitoring

**Aufgaben**

1. **Impressum:** Struktur aus dem alten Repo übernehmen, Name und Adresse von
   Laurin eintragen lassen (`TODO(laurin)`; nicht aus dem alten Repo kopieren,
   ohne nachzufragen).
2. **GlitchTip** (laut D5) neu konfigurieren:
   - DSN nur aus der Umgebungsvariable; `sentryUrl` und Org/Projekt aus
     Umgebungsvariablen. **Keine** IP und kein `http://` im Code.
   - `sendDefaultPii: false`, `tracesSampleRate: 0`, keine Session-Replays,
     `enableLogs: false`.
   - Den Tunnel (`tunnelRoute: "/monitoring"`) beibehalten und im Proxy-Matcher
     ausschließen.
   - Optionen entfernen, die nur für Vercel gelten (`automaticVercelMonitors`).
3. **Datenschutzerklärung** neu schreiben, sodass sie dem tatsächlichen Verhalten
   entspricht: Hosting (Server-Logs), Fehler-Monitoring über GlitchTip (selbst
   gehostet, welche Daten, Rechtsgrundlage berechtigtes Interesse, Speicherdauer),
   keine Cookies (prüfen! `next-themes` nutzt localStorage, keine Cookies), Schriften
   selbst gehostet, Rechte der Betroffenen. Den Entwurf Laurin zur Prüfung vorlegen
   und darauf hinweisen, dass es keine Rechtsberatung ist.

**Abnahme:** Im Netzwerk-Tab gibt es keine Anfragen an Drittanbieter; die Fehlermeldung
eines absichtlich geworfenen Test-Fehlers kommt in GlitchTip an (Laurin prüft das);
die Datenschutzerklärung beschreibt genau das, was passiert.

### Phase 7 – Qualitätssicherung

**Aufgaben**

1. **E2E-Tests** (Playwright, Chromium und WebKit, Desktop und Mobil):
   - Startseite in beiden Sprachen, alle Sektionen vorhanden
   - Sprachwechsel behält den Pfad
   - Jede Case Study lädt, „Nächstes Projekt“ funktioniert, ein unbekannter Slug
     ergibt 404
   - Mobiles Menü: öffnen, per Tastatur navigieren, mit Escape schließen
   - Theme-Wechsel
   - Inhalte sichtbar ohne JS und bei `reducedMotion: "reduce"`
   - Impressum erreichbar; Links mit den richtigen Pfaden je nach Locale-Schema
2. **Barrierefreiheit:** axe-Scan auf jeder Seite, beide Themes, keine Verstöße der
   Stufen „serious“ oder „critical“.
3. **Performance:** Lighthouse CI (`@lhci/cli`) im Workflow mit Budgets: Mobile
   Performance ≥ 95, Accessibility, Best Practices und SEO = 100.
4. **Bundle-Kontrolle:** First-Load-JS der Startseite notieren und in der README
   festhalten.

**Abnahme:** Alle Tests laufen lokal und in der CI grün.

### Phase 8 – CI/CD und Go-live

**Aufgaben**

1. **GitHub Actions** mit getrennten Jobs: `lint` + `typecheck` + `test` → `build` +
   `e2e` + `lighthouse` → `deploy`.
   - `deploy` läuft nur bei Push auf `main` (Produktion). Falls Laurin Staging will:
     eigener Branch `staging` mit eigener Bedingung. Kein toter `else`-Zweig wie im
     alten Workflow.
   - Coolify-Webhook und Token als GitHub Secrets.
   - pnpm-Store cachen, Playwright-Browser cachen.
2. **Dockerfile** mit Next.js `output: "standalone"`, Multi-Stage, Non-Root-User.
   Alternativ den Coolify-Buildpack nutzen; mit Laurin abstimmen.
3. **Go-live-Checkliste** für Laurin schreiben (`docs/go-live.md`), Schritt für Schritt:
   - DNS für `laurinwerner.com` und `www` (Weiterleitung auf die Variante ohne `www`)
   - Domain und TLS in Coolify
   - Umgebungsvariablen in Coolify setzen (aus `.env.example`)
   - **301-Weiterleitungen von `laurinschmidt.dev`:** `/de` und `/de/*` →
     `https://laurinwerner.com/` (bzw. auf den passenden neuen Pfad, je nach D2),
     `/en/*` → `https://laurinwerner.com/en/*`, `/de/legal-notice` und
     `/en/legal-notice` → die neue Rechtsseite. Umsetzung als Redirect-Regel im
     Coolify-Proxy oder als winziger Redirect-Service. Die alte Domain mindestens
     12 Monate behalten.
   - Google Search Console: neue Domain verifizieren, Sitemap einreichen,
     Adressänderung für die alte Domain melden.
   - GlitchTip über HTTPS mit eigener Subdomain erreichbar machen.

**Abnahme:** Ein Push auf `main` deployt automatisch; `curl -I` auf alte URLs liefert
`301` mit dem richtigen Ziel.

### Phase 9 – Dokumentation und Übergabe

**Aufgaben**

1. **README** (sie wird von Recruitern gelesen!): ein Satz, worum es geht, Link zur
   Live-Seite, Screenshot, Tech-Stack, Architektur-Entscheidungen mit kurzer
   Begründung (Server Components, Inhaltsmodell mit zod, Animation als progressive
   Verbesserung, Self-Hosting), Lighthouse-Werte, lokale Befehle, Projektstruktur.
2. `CLAUDE.md` aktualisieren.
3. **Übergabeliste für Laurin** mit allem, was er selbst erledigen muss:
   - alle verbleibenden `TODO(laurin)`
   - GitHub-Profil (Name, Bio, Link auf die neue Domain, Profil-README, gepinnte
     Repos), LinkedIn (Name, URL, Website)
   - Footer-Credits und Links auf den Kundenseiten auf den neuen Namen und die neue
     Domain umstellen
   - E-Mail-Signatur und Lebenslauf-PDF aktualisieren
   - das alte Repo archivieren und in der Beschreibung auf das neue verweisen

---

## 6. Definition of Done (für das Gesamtprojekt)

- [ ] Keine `TODO(laurin)` mehr im Code
- [ ] `pnpm lint`, `typecheck`, `test`, `test:e2e` und `build` laufen grün, lokal und in der CI
- [ ] `pnpm audit --prod` ohne kritische oder hohe Findings
- [ ] Lighthouse mobil: Performance ≥ 95, alle anderen Kategorien 100
- [ ] axe ohne „serious“- oder „critical“-Verstöße
- [ ] Alle Inhalte ohne JS sichtbar; `prefers-reduced-motion` wird respektiert
- [ ] Beide Sprachen vollständig, korrektes hreflang, Sitemap, OG-Bilder
- [ ] Impressum und Datenschutz beschreiben das tatsächliche Verhalten
- [ ] Keine Secrets, IPs oder internen Hostnamen im Repo
- [ ] Keine Texte, Claims oder Layout-Muster von imartur.com
- [ ] 301-Weiterleitungen von laurinschmidt.dev aktiv
- [ ] README und CLAUDE.md aktuell

---

## 7. Anhang: Vorlage für die Case-Study-Texte (für Laurin)

Pro Projekt ein paar Stichpunkte reichen. Der Agent formuliert daraus Texte in beiden
Sprachen und legt sie Laurin zur Freigabe vor.

```
Projekt:
Kunde / Branche:
Jahr, Dauer:
Meine Rolle (allein? mit wem?):
Ausgangslage – was war das Problem oder der Wunsch des Kunden?
Was habe ich gebaut, und warum mit genau diesem Stack?
Größte technische Herausforderung und wie ich sie gelöst habe:
3–5 Highlights (z. B. Online-Terminbuchung, CMS für den Kunden, Migration ohne Datenverlust):
Ergebnisse (Lighthouse, Ladezeit vorher/nachher, Reichweite, Feedback des Kunden):
Zitat des Kunden (falls möglich, mit Erlaubnis):
Code öffentlich? Link:
```
