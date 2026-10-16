import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
    // next-intl's ESM build imports `next/navigation` without an extension,
    // which Node's resolver rejects; Vite's resolver handles it.
    server: { deps: { inline: ["next-intl"] } },
  },
});
