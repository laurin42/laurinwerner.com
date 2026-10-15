import { describe, expect, it } from "vitest";
import { localize } from "@/content/localize";

describe("localize", () => {
  const value = {
    title: "BurchARTz",
    summary: { de: "Hallo", en: "Hello" },
    highlights: { de: ["eins", "zwei"], en: ["one", "two"] },
    images: [{ src: "/a.webp", alt: { de: "Bild", en: "Image" }, width: 1 }],
  };

  it("replaces nested { de, en } pairs with one language", () => {
    expect(localize(value, "en")).toEqual({
      title: "BurchARTz",
      summary: "Hello",
      highlights: ["one", "two"],
      images: [{ src: "/a.webp", alt: "Image", width: 1 }],
    });
  });

  it("leaves objects with more keys than de and en untouched", () => {
    const mixed = { de: "a", en: "b", fr: "c" };
    expect(localize(mixed, "de")).toEqual(mixed);
  });

  it("does not mutate the input", () => {
    const copy = structuredClone(value);
    localize(value, "de");
    expect(value).toEqual(copy);
  });
});
