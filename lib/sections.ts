import type { Locale } from "@/i18n/routing";

/** Sections of the homepage, in page order. Used for anchors and navigation. */
export const sections = ["projects", "about", "experience", "contact"] as const;

export type Section = (typeof sections)[number];

const sectionIds: Record<Locale, Record<Section, string>> = {
  de: {
    projects: "projekte",
    about: "ueber-mich",
    experience: "werdegang",
    contact: "kontakt",
  },
  en: {
    projects: "projects",
    about: "about",
    experience: "experience",
    contact: "contact",
  },
};

/** The localized anchor id of a homepage section, e.g. `projekte`. */
export function sectionId(section: Section, locale: Locale): string {
  return sectionIds[locale][section];
}
