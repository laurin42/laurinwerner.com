import type { LocalizedProfile, LocalizedProject } from "@/content";
import type { Locale } from "@/i18n/routing";
import { absoluteUrl, isTodo, localizedPath } from "@/lib/metadata";

/** Stable id of the person, so case studies can refer to the same entity. */
const personId = () => `${absoluteUrl("/")}#person`;

/** schema.org `Person` for the homepage. */
export function personJsonLd(profile: LocalizedProfile, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId(),
    name: profile.name,
    jobTitle: profile.role,
    description: profile.description,
    url: absoluteUrl(localizedPath("/", locale)),
    image: absoluteUrl(profile.portrait.src),
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location,
      addressCountry: "DE",
    },
    sameAs: [profile.links.linkedin, profile.links.github],
    knowsAbout: profile.stack.flatMap((group) => group.items),
  };
}

/**
 * schema.org `CreativeWork` for a case study. Facts that are still
 * `TODO(laurin)` placeholders are left out instead of published.
 */
export function creativeWorkJsonLd(
  project: LocalizedProject,
  profile: LocalizedProfile,
  locale: Locale,
) {
  const stack = project.stack.filter((item) => !isTodo(item));
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    ...(isTodo(project.summary) ? {} : { description: project.summary }),
    url: absoluteUrl(localizedPath(`/projects/${project.slug}`, locale)),
    image: absoluteUrl(project.images.cover.src),
    inLanguage: locale,
    ...(typeof project.year === "number"
      ? { dateCreated: String(project.year) }
      : {}),
    ...(stack.length > 0 ? { keywords: stack.join(", ") } : {}),
    author: {
      "@type": "Person",
      "@id": personId(),
      name: profile.name,
      url: absoluteUrl(localizedPath("/", locale)),
    },
  };
}
