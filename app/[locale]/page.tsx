import { getLocale, getTranslations } from "next-intl/server";
import { sectionId, sections } from "@/lib/sections";
import { siteConfig } from "@/lib/site-config";

// Skeleton only: the real sections follow in Phase 3.
export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations("nav");

  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="py-24">
        <h1 className="text-3xl font-semibold tracking-tight">
          {siteConfig.name}
        </h1>
        <p className="mt-2 text-muted-foreground">{siteConfig.role[locale]}</p>
      </div>
      {sections.map((section) => {
        const id = sectionId(section, locale);
        return (
          <section
            key={section}
            id={id}
            aria-labelledby={`${id}-heading`}
            className="py-16"
          >
            <h2 id={`${id}-heading`} className="text-2xl font-semibold">
              {t(section)}
            </h2>
          </section>
        );
      })}
    </div>
  );
}
