import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { StackTags } from "@/components/project/StackTags";
import { getExperience } from "@/content";
import type { Locale } from "@/i18n/routing";
import { formatPeriod } from "@/lib/format";
import { sectionId } from "@/lib/sections";
import { Section } from "./Section";

export async function Experience({ locale }: { locale: Locale }) {
  const t = await getTranslations();
  const entries = getExperience(locale);

  return (
    <Section id={sectionId("experience", locale)} title={t("nav.experience")}>
      <ol className="flex flex-col">
        {entries.map((entry) => (
          <li
            key={entry.start}
            className="border-t border-border py-8 first:border-t-0 first:pt-0"
          >
            <Reveal className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12">
              <p className="type-label text-muted-foreground">
                <time dateTime={entry.start}>
                  {formatPeriod(
                    entry.start,
                    entry.end,
                    locale,
                    t("home.present"),
                  )}
                </time>
              </p>
              <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-bold">{entry.title}</h3>
                <p className="text-muted-foreground">
                  {[entry.organization, entry.location]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="max-w-[60ch]">{entry.description}</p>
                {entry.tags.length > 0 && (
                  <StackTags items={entry.tags} label={t("home.techStack")} />
                )}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
