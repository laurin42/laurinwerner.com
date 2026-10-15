import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";
import { sectionId, sections } from "@/lib/sections";

describe("sectionId", () => {
  it.each(routing.locales)("returns unique, URL-safe ids for %s", (locale) => {
    const ids = sections.map((section) => sectionId(section, locale));
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z][a-z0-9-]*$/);
  });
});
