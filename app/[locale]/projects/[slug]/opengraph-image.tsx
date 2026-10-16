import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { getProfile, getProject, getProjectSlugs } from "@/content";
import { routing } from "@/i18n/routing";
import { balanceLines, ogImage, ogSize } from "@/lib/og";

export const contentType = "image/png";

type Params = { locale?: string; slug?: string };

function find({ locale, slug }: Params) {
  if (!locale || !slug || !hasLocale(routing.locales, locale)) return null;
  const project = getProject(slug, locale);
  return project ? { locale, project, profile: getProfile(locale) } : null;
}

// An image route does not inherit the page's params; it lists its own.
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getProjectSlugs().map((slug) => ({ locale, slug })),
  );
}

// Next also calls this without params, only to list the image ids.
export async function generateImageMetadata({
  params,
}: {
  params: Params | Promise<Params>;
}) {
  const found = find(await params);
  return [
    {
      id: "default",
      size: ogSize,
      contentType,
      ...(found && {
        alt: `${found.project.title} – ${found.profile.name}`,
      }),
    },
  ];
}

/** Share image of a case study: its title, with the author above it. */
export default async function Image({ params }: { params: Promise<Params> }) {
  const found = find(await params);
  if (!found) notFound();
  const { locale, project, profile } = found;
  const t = await getTranslations({ locale, namespace: "caseStudy" });
  return ogImage({
    label: `${t("ogLabel")} · ${profile.name}`,
    lines: balanceLines(project.title),
  });
}
