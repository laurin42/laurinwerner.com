import { getTranslations } from "next-intl/server";
import { getProfile } from "@/content";
import type { Locale } from "@/i18n/routing";
import { sectionId } from "@/lib/sections";
import { Section } from "./Section";

export async function About({ locale }: { locale: Locale }) {
  const t = await getTranslations();
  const profile = getProfile(locale);
  const id = sectionId("about", locale);

  return (
    <Section id={id} title={t("nav.about")}>
      <p className="max-w-2xl">{profile.about}</p>

      <h3 id={`${id}-stack`} className="mt-12 text-lg font-semibold">
        {t("home.stackHeading")}
      </h3>
      <dl
        aria-labelledby={`${id}-stack`}
        className="mt-4 grid gap-6 sm:grid-cols-3"
      >
        {profile.stack.map((group) => (
          <div key={group.group}>
            <dt className="font-medium">{group.group}</dt>
            <dd className="mt-1 text-muted-foreground">
              {group.items.join(", ")}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-12">
        {profile.cv ? (
          <a
            href={profile.cv}
            download
            className="underline underline-offset-4"
          >
            {t("home.cvDownload")}
          </a>
        ) : (
          t("home.cvMissing")
        )}
      </p>
    </Section>
  );
}
