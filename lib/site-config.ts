import { rawContent } from "@/content";

/** Normalizes a base URL to its origin, e.g. `https://example.com/` → `https://example.com`. */
export function resolveSiteUrl(raw: string | undefined): string {
  return new URL(raw || "http://localhost:3000").origin;
}

export const siteConfig = {
  name: rawContent.profile.name,
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
};
