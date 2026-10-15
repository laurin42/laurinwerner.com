import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["de", "en"],
  defaultLocale: "de",
  localePrefix: "as-needed",
  // The URL is the only source of truth for the language: no locale cookie and no
  // Accept-Language redirect. Keeps the site cookie-free and `/` always German.
  localeCookie: false,
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

/** Endonyms, shown in the language switcher in their own language. */
export const localeNames: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
};
