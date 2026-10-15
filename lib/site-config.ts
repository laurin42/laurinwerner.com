import type { Locale } from "@/i18n/routing";

/** Normalizes a base URL to its origin, e.g. `https://example.com/` → `https://example.com`. */
export function resolveSiteUrl(raw: string | undefined): string {
  return new URL(raw || "http://localhost:3000").origin;
}

export const siteConfig = {
  name: "Laurin Werner",
  role: {
    de: "Frontend-Entwickler",
    en: "Frontend Developer",
  } satisfies Record<Locale, string>,
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
};
