import { describe, expect, it } from "vitest";
import de from "@/messages/de.json";
import en from "@/messages/en.json";

/** All leaf paths of a nested message object, e.g. `nav.projects`. */
function keyPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    keyPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe("messages", () => {
  it("have the same keys in every language", () => {
    expect(keyPaths(en).sort()).toEqual(keyPaths(de).sort());
  });

  it("have no empty strings", () => {
    for (const messages of [de, en]) {
      const values = JSON.stringify(messages).match(/"[^"]*"/g) ?? [];
      expect(values).not.toContain('""');
    }
  });
});
