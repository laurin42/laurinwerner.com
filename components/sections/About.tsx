import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { getProfile } from "@/content";
import type { Locale } from "@/i18n/routing";
import { sectionId } from "@/lib/sections";
import { textLink } from "@/lib/ui";
import { Section } from "./Section";

export async function About({ locale }: { locale: Locale }) {
  const t = await getTranslations();
  const profile = getProfile(locale);
  const id = sectionId("about", locale);

  return (
    <Section id={id} title={t("nav.about")}>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-12">
        <Reveal className="flex flex-col gap-8">
          <p className="max-w-[55ch] text-xl sm:text-2xl">{profile.about}</p>
          <p className="text-lg font-semibold">
            {profile.cv ? (
              <a href={profile.cv} download className={textLink}>
                {t("home.cvDownload")}
              </a>
            ) : (
              t("home.cvMissing")
            )}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h3 id={`${id}-stack`} className="type-label text-muted-foreground">
            {t("home.stackHeading")}
          </h3>
          <dl aria-labelledby={`${id}-stack`} className="mt-4 flex flex-col">
            {profile.stack.map((group) => (
              <div
                key={group.group}
                className="grid grid-cols-1 gap-1 border-t border-border py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6"
              >
                <dt className="font-semibold">{group.group}</dt>
                <dd>{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
