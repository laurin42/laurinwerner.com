import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getProfile } from "@/content";
import type { Locale } from "@/i18n/routing";
import { sectionId } from "@/lib/sections";
import { container, textLink } from "@/lib/ui";

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations("home");
  const profile = getProfile(locale);
  const { portrait } = profile;

  return (
    <div
      className={`${container} grid grid-cols-1 gap-10 pt-12 pb-8 sm:pt-20 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-start md:gap-14`}
    >
      <div>
        {/* CSS-only entrance (globals.css): it starts with the first paint instead
            of waiting for hydration, so the largest element is not held back.
            `text-box` trims the line box to the cap height, so the first line
            starts exactly at the top edge of the portrait. */}
        <h1
          id="hero-name"
          className="hero-in type-display text-[clamp(4rem,15vw,10.5rem)] [text-box:trim-both_cap_alphabetic]"
        >
          {profile.name}
        </h1>
        <div className="hero-in [--delay:120ms]">
          <p className="mt-6 text-2xl font-semibold sm:text-3xl">
            {profile.role}
          </p>
          <p className="mt-4 max-w-[40ch] text-lg text-muted-foreground">
            {profile.tagline}
          </p>
        </div>
        <div className="hero-in [--delay:240ms]">
          <ul className="mt-8 flex flex-col gap-1 type-label text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-6">
            <li>
              <span className="sr-only">{t("location")}: </span>
              {profile.location}
            </li>
            <li>{profile.availability}</li>
          </ul>
          <p className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-lg font-semibold">
            <a href={`#${sectionId("projects", locale)}`} className={textLink}>
              {t("viewProjects")}
            </a>
            <a href={`#${sectionId("contact", locale)}`} className={textLink}>
              {t("contact")}
            </a>
          </p>
        </div>
      </div>
      <div className="hero-clip max-w-sm md:max-w-none">
        <Image
          src={portrait.src}
          alt={portrait.alt}
          width={portrait.width}
          height={portrait.height}
          sizes="(min-width: 1152px) 420px, (min-width: 768px) 38vw, 384px"
          preload
          className="h-auto w-full grayscale"
        />
      </div>
    </div>
  );
}
