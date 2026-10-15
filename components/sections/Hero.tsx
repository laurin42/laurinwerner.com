import { getTranslations } from "next-intl/server";
import { getProfile } from "@/content";
import type { Locale } from "@/i18n/routing";
import { sectionId } from "@/lib/sections";

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations("home");
  const profile = getProfile(locale);

  return (
    <div className="py-24">
      <h1 className="text-4xl font-semibold tracking-tight">{profile.name}</h1>
      <p className="mt-2 text-xl">{profile.role}</p>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        {profile.tagline}
      </p>
      <ul className="mt-6 flex flex-col gap-1 text-sm text-muted-foreground">
        <li>
          <span className="sr-only">{t("location")}: </span>
          {profile.location}
        </li>
        <li>{profile.availability}</li>
      </ul>
      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href={`#${sectionId("projects", locale)}`}
          className="rounded-md bg-foreground px-4 py-2 text-background"
        >
          {t("viewProjects")}
        </a>
        <a
          href={`#${sectionId("contact", locale)}`}
          className="rounded-md border border-border px-4 py-2 hover:bg-muted"
        >
          {t("contact")}
        </a>
      </div>
    </div>
  );
}
