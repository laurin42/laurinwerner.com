import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getProfile } from "@/content";
import { routing } from "@/i18n/routing";
import { ogImage, ogSize } from "@/lib/og";

export const contentType = "image/png";

type Params = { locale?: string };

function find({ locale }: Params) {
  return locale && hasLocale(routing.locales, locale)
    ? getProfile(locale)
    : null;
}

// An image route does not inherit the layout's params; it lists its own.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Next also calls this without params, only to list the image ids.
export async function generateImageMetadata({
  params,
}: {
  params: Params | Promise<Params>;
}) {
  const profile = find(await params);
  return [
    {
      id: "default",
      size: ogSize,
      contentType,
      ...(profile && {
        alt: `${profile.name} – ${profile.role} in ${profile.location}`,
      }),
    },
  ];
}

/** Share image of the homepage (and of every page without its own). */
export default async function Image({ params }: { params: Promise<Params> }) {
  const profile = find(await params);
  if (!profile) notFound();
  return ogImage({
    label: `${profile.role} · ${profile.location}`,
    lines: profile.name.split(" "),
    accentLast: true,
  });
}
