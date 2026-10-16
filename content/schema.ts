import { z } from "zod";

const text = z.string().trim().min(1);

/** A value in every supported language. */
export function localized<T extends z.ZodType>(schema: T) {
  return z.object({ de: schema, en: schema }).strict();
}

/** Placeholder for information Laurin still has to supply, e.g. `TODO(laurin): Jahr`. */
export const todoSchema = z.string().regex(/^TODO\(laurin\): .+/);

export const imageSchema = z
  .object({
    src: z.string().regex(/^\/images\/.+\.webp$/),
    alt: localized(text),
    width: z.int().positive(),
    height: z.int().positive(),
  })
  .strict();

export const projectSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    title: text,
    client: text,
    year: z.union([z.int().min(2020).max(2100), todoSchema]),
    role: localized(text),
    summary: localized(text),
    tagline: localized(text).optional(),
    stack: z.array(text).min(1),
    problem: localized(text),
    solution: localized(text),
    highlights: localized(z.array(text).min(1).max(5)),
    results: localized(z.array(text).min(1)).optional(),
    testimonial: z
      .object({ quote: localized(text), author: text })
      .strict()
      .optional(),
    links: z.object({ live: z.url(), code: z.url().optional() }).strict(),
    images: z
      .object({ cover: imageSchema, gallery: z.array(imageSchema).optional() })
      .strict(),
    featured: z.boolean(),
    order: z.int(),
  })
  .strict();

/** A month as `YYYY-MM`. */
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);

export const experienceSchema = z
  .object({
    title: localized(text),
    organization: localized(text),
    location: localized(text).optional(),
    start: month,
    /** `null` means ongoing. */
    end: month.nullable(),
    description: localized(text),
    tags: z.array(text),
  })
  .strict()
  .refine((entry) => entry.end === null || entry.end >= entry.start, {
    message: "end must not be before start",
  });

export const profileSchema = z
  .object({
    name: text,
    role: localized(text),
    location: text,
    portrait: imageSchema,
    /** One-sentence positioning for the hero. */
    tagline: localized(text),
    availability: localized(text),
    about: localized(text),
    /** Meta description of the homepage, for search results and link previews. */
    description: localized(text.min(150).max(160)),
    email: z.email(),
    links: z.object({ github: z.url(), linkedin: z.url() }).strict(),
    /** Path of the CV PDF in `public/`, once Laurin supplies it (D6). */
    cv: z
      .string()
      .regex(/^\/cv\/.+\.pdf$/)
      .optional(),
    stack: z.array(
      z
        .object({ group: localized(text), items: z.array(text).min(1) })
        .strict(),
    ),
  })
  .strict();

const legalSectionSchema = z
  .object({
    title: localized(text),
    paragraphs: z.array(localized(text)).min(1),
    /** Bullet list after the paragraphs. */
    list: z.array(localized(text)).optional(),
    /** Paragraphs after the list. */
    after: z.array(localized(text)).optional(),
  })
  .strict();

/** Imprint and privacy policy (content/legal.ts). */
export const legalSchema = z
  .object({
    imprint: z
      .object({
        title: localized(text),
        basis: localized(text),
        name: text,
        address: localized(text),
        contactLabel: localized(text),
        responsibleLabel: localized(text),
        responsible: localized(text),
      })
      .strict(),
    privacy: z
      .object({
        title: localized(text),
        updated: localized(text),
        sections: z.array(legalSectionSchema).min(1),
      })
      .strict(),
  })
  .strict();

export type Image = z.infer<typeof imageSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Legal = z.infer<typeof legalSchema>;
