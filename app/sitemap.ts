import type { MetadataRoute } from "next";
import { getProjectSlugs } from "@/content";
import { routing } from "@/i18n/routing";
import { absoluteUrl, alternates } from "@/lib/metadata";

/** Every page in every language, each with its hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const hrefs = ["/", ...getProjectSlugs().map((slug) => `/projects/${slug}`)];
  return hrefs.flatMap((href) =>
    routing.locales.map((locale) => {
      const { canonical, languages } = alternates(href, locale);
      return {
        url: absoluteUrl(String(canonical)),
        alternates: {
          languages: Object.fromEntries(
            Object.entries(languages ?? {}).map(([lang, path]) => [
              lang,
              absoluteUrl(String(path)),
            ]),
          ),
        },
      };
    }),
  );
}
