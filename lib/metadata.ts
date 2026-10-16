import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

/** Open Graph locale tags (`language_TERRITORY`). */
const ogLocales: Record<Locale, string> = { de: "de_DE", en: "en_US" };

/** The localized path of `href`, e.g. `/projects/x` → `/en/projects/x`. */
export function localizedPath(href: string, locale: Locale): string {
  return getPathname({ href, locale });
}

/** The absolute URL of a path on this site. */
export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).href;
}

/**
 * Canonical URL and hreflang links for a page that exists in every language.
 * `x-default` points to the default language, which has no prefix.
 */
export function alternates(
  href: string,
  locale: Locale,
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localizedPath(href, locale),
    languages: {
      ...Object.fromEntries(
        routing.locales.map((l) => [l, localizedPath(href, l)]),
      ),
      "x-default": localizedPath(href, routing.defaultLocale),
    },
  };
}

/**
 * Open Graph fields shared by every page. Next replaces `openGraph` as a whole
 * when a page sets it, so pages spread this instead of relying on the layout.
 * The image comes from the nearest `opengraph-image` file.
 */
export function openGraph(locale: Locale) {
  return {
    siteName: siteConfig.name,
    locale: ogLocales[locale],
    alternateLocale: routing.locales
      .filter((l) => l !== locale)
      .map((l) => ogLocales[l]),
  };
}

/**
 * Serializes structured data for a `<script type="application/ld+json">`.
 * `<` is escaped, so no string in the data can close the script element.
 */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Whether a content value is still a `TODO(laurin)` placeholder. */
export function isTodo(value: unknown): boolean {
  return typeof value === "string" && value.startsWith("TODO(laurin)");
}
