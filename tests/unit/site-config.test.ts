import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "@/lib/site-config";

describe("resolveSiteUrl", () => {
  it("falls back to localhost", () => {
    expect(resolveSiteUrl(undefined)).toBe("http://localhost:3000");
    expect(resolveSiteUrl("")).toBe("http://localhost:3000");
  });

  it("reduces the URL to its origin", () => {
    expect(resolveSiteUrl("https://laurinwerner.com/")).toBe(
      "https://laurinwerner.com",
    );
    expect(resolveSiteUrl("https://laurinwerner.com/en?x=1")).toBe(
      "https://laurinwerner.com",
    );
  });

  it("rejects invalid URLs", () => {
    expect(() => resolveSiteUrl("not a url")).toThrow();
  });
});
