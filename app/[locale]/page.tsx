import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { getProfile } from "@/content";
import { alternates, localizedPath, openGraph } from "@/lib/metadata";
import { personJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const profile = getProfile(locale);
  const title = `${profile.name} – ${profile.role} in ${profile.location}`;
  return {
    title: { absolute: title },
    description: profile.description,
    alternates: alternates("/", locale),
    openGraph: {
      ...openGraph(locale),
      type: "website",
      title,
      description: profile.description,
      url: localizedPath("/", locale),
    },
  };
}

export default async function HomePage() {
  const locale = await getLocale();

  return (
    <>
      <JsonLd data={personJsonLd(getProfile(locale), locale)} />
      <Hero locale={locale} />
      <Projects locale={locale} />
      <About locale={locale} />
      <Experience locale={locale} />
      <Contact locale={locale} />
    </>
  );
}
