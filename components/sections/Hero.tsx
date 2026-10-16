import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { NameMorph } from "@/components/motion/NameMorph";
import { NameWords } from "@/components/ui/NameWords";
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
      // Fills the first screen below the header, so the next section starts below
      // the fold and the calls to action stand on their own. Narrow screens stack
      // text and portrait; the portrait takes whatever height is left.
      className={`${container} flex min-h-[calc(100svh-4rem)] flex-col gap-8 pt-8 pb-6 md:grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:content-center md:items-start md:gap-14 md:py-12`}
    >
      <div>
        {/* CSS-only entrance (globals.css): it starts with the first paint instead
            of waiting for hydration, so the largest element is not held back.
            `text-box` trims the line box to the cap height, so the first line
            starts exactly at the top edge of the portrait. */}
        <h1
          id="hero-name"
          className="hero-in type-display text-[clamp(3rem,12vw,7.5rem)] [text-box:trim-both_cap_alphabetic]"
        >
          <NameWords name={profile.name} />
        </h1>
        <NameMorph />
        <div className="hero-in [--delay:120ms]">
          <p className="mt-5 text-2xl font-semibold sm:mt-6 sm:text-3xl">
            {profile.role}
          </p>
          <p className="mt-3 max-w-[40ch] text-lg text-muted-foreground sm:mt-4">
            {profile.tagline}
          </p>
        </div>
        <div className="hero-in [--delay:240ms]">
          <ul className="mt-5 flex flex-col gap-1 type-label text-muted-foreground sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-x-6">
            <li>
              <span className="sr-only">{t("location")}: </span>
              {profile.location}
            </li>
            <li>{profile.availability}</li>
          </ul>
          <p className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-lg font-semibold sm:mt-8">
            <a href={`#${sectionId("projects", locale)}`} className={textLink}>
              {t("viewProjects")}
            </a>
            <a href={`#${sectionId("contact", locale)}`} className={textLink}>
              {t("contact")}
            </a>
          </p>
        </div>
      </div>
      <div className="hero-clip relative min-h-48 flex-1 md:flex-none">
        <Image
          src={portrait.src}
          alt={portrait.alt}
          width={portrait.width}
          height={portrait.height}
          sizes="(min-width: 1152px) 420px, (min-width: 768px) 38vw, 100vw"
          preload
          className="absolute inset-0 size-full object-cover object-[50%_25%] grayscale md:static md:h-auto"
        />
      </div>
    </div>
  );
}
