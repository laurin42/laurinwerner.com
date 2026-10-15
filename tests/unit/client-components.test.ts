import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Server Components by default: only these files may opt into client rendering.
const ALLOWED = [
  "components/layout/LanguageSwitcher.tsx",
  "components/layout/MobileMenu.tsx",
  "components/layout/ThemeToggle.tsx",
];

async function sourceFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && /\.tsx?$/.test(entry.name))
    .map((entry) =>
      path.relative(process.cwd(), path.join(entry.parentPath, entry.name)),
    );
}

describe('"use client"', () => {
  it("only appears in the allowed components", async () => {
    const files = [
      ...(await sourceFiles("app")),
      ...(await sourceFiles("components")),
    ];
    const clientFiles: string[] = [];
    for (const file of files) {
      if (/^\s*["']use client["']/m.test(await readFile(file, "utf8")))
        clientFiles.push(file);
    }
    expect(clientFiles.sort()).toEqual(ALLOWED);
  });
});
