import { z } from "zod";
import type { Locale } from "@/i18n/routing";
import { experience as experienceData } from "./experience";
import { type Localize, localize } from "./localize";
import { legal as legalData } from "./legal";
import { profile as profileData } from "./profile";
import { burchartz } from "./projects/burchartz";
import { burnheartMockery } from "./projects/burnheart-mockery";
import { praxisWerner } from "./projects/praxis-werner";
import { wetterstrucksi } from "./projects/wetterstrucksi";
import {
  experienceSchema,
  legalSchema,
  profileSchema,
  projectSchema,
} from "./schema";

// Validated once at module load, so invalid content fails the build.
const projects = z
  .array(projectSchema)
  .refine((items) => new Set(items.map((p) => p.slug)).size === items.length, {
    message: "project slugs must be unique",
  })
  .parse([praxisWerner, burchartz, wetterstrucksi, burnheartMockery])
  .sort((a, b) => a.order - b.order);

const experience = z.array(experienceSchema).parse(experienceData);
const profile = profileSchema.parse(profileData);
const legal = legalSchema.parse(legalData);

export type LocalizedProject = Localize<z.infer<typeof projectSchema>>;
export type LocalizedExperience = Localize<z.infer<typeof experienceSchema>>;
export type LocalizedProfile = Localize<z.infer<typeof profileSchema>>;
export type LocalizedLegal = Localize<z.infer<typeof legalSchema>>;

/** All projects, ordered for display. */
export function getProjects(locale: Locale): LocalizedProject[] {
  return projects.map((project) => localize(project, locale));
}

export function getFeaturedProjects(locale: Locale): LocalizedProject[] {
  return getProjects(locale).filter((project) => project.featured);
}

export function getProjectSlugs(): string[] {
  return projects.map((project) => project.slug);
}

export function getProject(
  slug: string,
  locale: Locale,
): LocalizedProject | undefined {
  const project = projects.find((p) => p.slug === slug);
  return project && localize(project, locale);
}

/** The project after `slug` in display order, wrapping around to the first. */
export function getNextProject(
  slug: string,
  locale: Locale,
): LocalizedProject | undefined {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return undefined;
  const next = projects[(index + 1) % projects.length];
  return next && localize(next, locale);
}

export function getExperience(locale: Locale): LocalizedExperience[] {
  return experience.map((entry) => localize(entry, locale));
}

export function getProfile(locale: Locale): LocalizedProfile {
  return localize(profile, locale);
}

export function getLegal(locale: Locale): LocalizedLegal {
  return localize(legal, locale);
}

/** Raw, unlocalized content for tests and build-time checks. */
export const rawContent = { projects, experience, profile, legal };
