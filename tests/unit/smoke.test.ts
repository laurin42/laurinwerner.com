import { describe, expect, it } from "vitest";
import pkg from "@/package.json";

describe("test setup", () => {
  it("resolves the @/ path alias", () => {
    expect(pkg.name).toBe("laurinwerner.com");
  });
});
