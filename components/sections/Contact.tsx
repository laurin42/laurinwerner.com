import { getTranslations } from "next-intl/server";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { getProfile } from "@/content";
import type { Locale } from "@/i18n/routing";
import { sectionId } from "@/lib/sections";
import { Section } from "./Section";

export async function Contact({ locale }: { locale: Locale }) {
  const t = await getTranslations();
  const profile = getProfile(locale);
  const linkClass = "underline underline-offset-4";

  return (
    <Section id={sectionId("contact", locale)} title={t("nav.contact")}>
      <ul className="flex flex-col gap-3">
        <li>
          {t("home.contactEmail")}:{" "}
          <a href={`mailto:${profile.email}`} className={linkClass}>
            {profile.email}
          </a>
        </li>
        <li>
          <ExternalLink href={profile.links.linkedin} className={linkClass}>
            LinkedIn
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href={profile.links.github} className={linkClass}>
            GitHub
          </ExternalLink>
        </li>
      </ul>
    </Section>
  );
}
