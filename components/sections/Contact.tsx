import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { getProfile } from "@/content";
import type { Locale } from "@/i18n/routing";
import { sectionId } from "@/lib/sections";
import { textLink } from "@/lib/ui";
import { Section } from "./Section";

export async function Contact({ locale }: { locale: Locale }) {
  const t = await getTranslations();
  const profile = getProfile(locale);

  return (
    <Section id={sectionId("contact", locale)} title={t("nav.contact")}>
      <Reveal className="flex flex-col gap-8">
        <p>
          <span className="block type-label text-muted-foreground">
            {t("home.contactEmail")}
          </span>
          <a
            href={`mailto:${profile.email}`}
            className={`${textLink} mt-2 inline-block text-[clamp(1.25rem,4.5vw,3rem)] font-bold break-all`}
          >
            {profile.email}
          </a>
        </p>
        <ul className="flex flex-wrap gap-x-8 gap-y-3 text-lg font-semibold">
          <li>
            <ExternalLink href={profile.links.linkedin} className={textLink}>
              LinkedIn
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href={profile.links.github} className={textLink}>
              GitHub
            </ExternalLink>
          </li>
        </ul>
      </Reveal>
    </Section>
  );
}
