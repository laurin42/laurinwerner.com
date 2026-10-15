import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import {
  getExperience,
  getNextProject,
  getProfile,
  getProject,
  getProjects,
  getProjectSlugs,
  rawContent,
} from "@/content";
import {
  experienceSchema,
  profileSchema,
  projectSchema,
} from "@/content/schema";
import { routing } from "@/i18n/routing";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const MAX_IMAGE_BYTES = 500 * 1024;
const MAX_PUBLIC_BYTES = 5 * 1024 * 1024;

/** Every string anywhere inside `value`. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (typeof value === "object" && value !== null)
    return Object.values(value).flatMap(strings);
  return [];
}

async function dirSize(dir: string): Promise<number> {
  let total = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    total += entry.isDirectory()
      ? await dirSize(full)
      : (await stat(full)).size;
  }
  return total;
}

const images = [
  rawContent.profile.portrait,
  ...rawContent.projects.flatMap((project) => [
    project.images.cover,
    ...(project.images.gallery ?? []),
  ]),
];

describe("content", () => {
  it("matches the schemas", () => {
    for (const project of rawContent.projects) projectSchema.parse(project);
    for (const entry of rawContent.experience) experienceSchema.parse(entry);
    profileSchema.parse(rawContent.profile);
  });

  it.each(routing.locales)("is fully localized in %s", (locale) => {
    const localized = [
      getProjects(locale),
      getExperience(locale),
      getProfile(locale),
    ];
    for (const value of strings(localized)) expect(value.trim()).not.toBe("");
    // No `{ de, en }` pair survives localization.
    expect(JSON.stringify(localized)).not.toMatch(/"de":/);
  });

  it("has unique slugs that match the file names", async () => {
    const slugs = getProjectSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
    const files = await readdir(
      path.join(process.cwd(), "content", "projects"),
    );
    expect(files.map((file) => path.parse(file).name).sort()).toEqual(
      [...slugs].sort(),
    );
  });

  it("lists experience newest first", () => {
    const starts = rawContent.experience.map((entry) => entry.start);
    expect(starts).toEqual([...starts].sort().reverse());
  });
});

describe("images", () => {
  it.each(images.map((image) => [image.src, image] as const))(
    "%s exists, is small enough and has the declared size",
    async (src, image) => {
      const file = path.join(PUBLIC_DIR, src);
      expect((await stat(file)).size).toBeLessThanOrEqual(MAX_IMAGE_BYTES);
      const { width, height } = await sharp(file).metadata();
      expect({ width, height }).toEqual({
        width: image.width,
        height: image.height,
      });
    },
  );

  it("keeps public/ under 5 MB", async () => {
    expect(await dirSize(PUBLIC_DIR)).toBeLessThan(MAX_PUBLIC_BYTES);
  });
});

describe("content access", () => {
  it("returns projects in display order", () => {
    const orders = getProjects("de").map((project) => project.slug);
    expect(orders).toEqual(getProjectSlugs());
  });

  it("finds a project by slug and returns undefined for unknown slugs", () => {
    expect(getProject("burchartz", "en")?.title).toBe("BurchARTz");
    expect(getProject("does-not-exist", "en")).toBeUndefined();
  });

  it("wraps around for the next project", () => {
    const slugs = getProjectSlugs();
    const last = slugs.at(-1);
    expect(last).toBeDefined();
    expect(getNextProject(last!, "de")?.slug).toBe(slugs[0]);
    expect(getNextProject(slugs[0]!, "de")?.slug).toBe(slugs[1]);
    expect(getNextProject("does-not-exist", "de")).toBeUndefined();
  });
});
