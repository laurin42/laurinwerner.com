import { getTranslations } from "next-intl/server";
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
      <ol className="border-l border-border">
        {entries.map((entry) => (
          <li key={entry.start} className="relative pb-10 pl-6 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute top-2 -left-1.5 size-3 rounded-full border border-border bg-background"
            />
            <p className="text-sm text-muted-foreground">
              <time dateTime={entry.start}>
                {formatPeriod(
                  entry.start,
                  entry.end,
                  locale,
                  t("home.present"),
                )}
              </time>
            </p>
            <h3 className="mt-1 text-lg font-semibold">{entry.title}</h3>
            <p className="text-muted-foreground">
              {[entry.organization, entry.location].filter(Boolean).join(", ")}
            </p>
            <p className="mt-2 max-w-2xl">{entry.description}</p>
            {entry.tags.length > 0 && (
              <div className="mt-3">
                <StackTags items={entry.tags} label={t("home.techStack")} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}
