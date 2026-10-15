import { getLocale } from "next-intl/server";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";

export default async function HomePage() {
  const locale = await getLocale();

  return (
    <>
      <Hero locale={locale} />
      <Projects locale={locale} />
      <About locale={locale} />
      <Experience locale={locale} />
      <Contact locale={locale} />
    </>
  );
}
