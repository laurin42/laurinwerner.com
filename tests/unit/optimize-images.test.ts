import path from "node:path";
import { describe, expect, it } from "vitest";
import { kebabCase, outputPath } from "@/scripts/optimize-images";

describe("kebabCase", () => {
  it.each([
    ["laptopMockup", "laptop-mockup"],
    ["Mobile Shot_2", "mobile-shot-2"],
    ["praxis-werner", "praxis-werner"],
    ["--Hero--", "hero"],
  ])("%s → %s", (input, expected) => {
    expect(kebabCase(input)).toBe(expected);
  });
});

describe("outputPath", () => {
  it("maps source images to WebP files per slug", () => {
    expect(outputPath("praxis-werner", "laptopMockup.PNG")).toBe(
      path.join(
        "public",
        "images",
        "projects",
        "praxis-werner",
        "laptop-mockup.webp",
      ),
    );
  });

  it("writes to a custom output directory", () => {
    expect(
      outputPath("profile", "portrait.jpg", path.join("public", "images")),
    ).toBe(path.join("public", "images", "profile", "portrait.webp"));
  });

  it("ignores non-image files", () => {
    expect(outputPath("burchartz", "notes.txt")).toBeNull();
    expect(outputPath("burchartz", ".DS_Store")).toBeNull();
  });
});
