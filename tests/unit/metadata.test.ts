import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { getProfile, getProject, getProjectSlugs } from "@/content";
import { routing } from "@/i18n/routing";
import { alternates, isTodo, serializeJsonLd } from "@/lib/metadata";
import { balanceLines } from "@/lib/og";
import { siteConfig } from "@/lib/site-config";
import { creativeWorkJsonLd, personJsonLd } from "@/lib/structured-data";

/** Every string anywhere inside `value`. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (typeof value === "object" && value !== null)
    return Object.values(value).flatMap(strings);
  return [];
}

describe("alternates", () => {
  it("links every language and points x-default to German", () => {
    expect(alternates("/projects/burchartz", "en")).toEqual({
      canonical: "/en/projects/burchartz",
      languages: {
        de: "/projects/burchartz",
        en: "/en/projects/burchartz",
        "x-default": "/projects/burchartz",
      },
    });
    expect(alternates("/", "de").canonical).toBe("/");
  });
});

describe("serializeJsonLd", () => {
  it("cannot close the script element", () => {
    const json = serializeJsonLd({ name: "</script><script>alert(1)" });
    expect(json).not.toContain("<");
    expect(JSON.parse(json)).toEqual({ name: "</script><script>alert(1)" });
  });
});

describe("structured data", () => {
  it("describes the person with links to the profiles", () => {
    for (const locale of routing.locales) {
      const profile = getProfile(locale);
      const person = personJsonLd(profile, locale);
      expect(person["@type"]).toBe("Person");
      expect(person.jobTitle).toBe(profile.role);
      expect(person.sameAs).toEqual([
        profile.links.linkedin,
        profile.links.github,
      ]);
    }
  });

  it("never publishes TODO placeholders", () => {
    for (const locale of routing.locales) {
      const profile = getProfile(locale);
      for (const slug of getProjectSlugs()) {
        const work = creativeWorkJsonLd(
          getProject(slug, locale)!,
          profile,
          locale,
        );
        expect(work["@type"]).toBe("CreativeWork");
        expect(strings(work).filter(isTodo)).toEqual([]);
      }
    }
  });
});

describe("homepage description", () => {
  it("has the length search engines show in full", () => {
    for (const locale of routing.locales) {
      const { description } = getProfile(locale);
      expect(description.length).toBeGreaterThanOrEqual(150);
      expect(description.length).toBeLessThanOrEqual(160);
    }
  });
});

describe("sitemap", () => {
  it("lists every page in every language with its alternates", () => {
    const entries = sitemap();
    const pages = 1 + getProjectSlugs().length;
    expect(entries).toHaveLength(pages * routing.locales.length);
    expect(entries.map((entry) => entry.url)).toContain(
      `${siteConfig.url}/en/projects/burchartz`,
    );
    for (const entry of entries) {
      expect(entry.url.startsWith(siteConfig.url)).toBe(true);
      expect(Object.keys(entry.alternates?.languages ?? {})).toEqual([
        ...routing.locales,
        "x-default",
      ]);
    }
  });
});

describe("balanceLines", () => {
  it("splits a title into two lines of similar length", () => {
    expect(balanceLines("Burnheart Mockery")).toEqual(["Burnheart", "Mockery"]);
    expect(balanceLines("Praxis Janis Werner")).toEqual([
      "Praxis",
      "Janis Werner",
    ]);
    expect(balanceLines("BurchARTz")).toEqual(["BurchARTz"]);
  });
});
