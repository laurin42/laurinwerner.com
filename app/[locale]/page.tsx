import { getLocale, getTranslations } from "next-intl/server";
import { getProfile } from "@/content";
import { sectionId, sections } from "@/lib/sections";

// Skeleton only: the real sections follow in Phase 3.
export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations("nav");
  const profile = getProfile(locale);

  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="py-24">
        <h1 className="text-3xl font-semibold tracking-tight">
          {profile.name}
        </h1>
        <p className="mt-2 text-muted-foreground">{profile.role}</p>
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
