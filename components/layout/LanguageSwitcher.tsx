"use client";

import { getPathname, usePathname } from "@/i18n/navigation";
import { type Locale, localeNames } from "@/i18n/routing";

/**
 * Links to the current page in `locale`. A plain link is enough: switching the
 * language swaps the root layout, so it is a full page load either way.
 * From xl on its padding hangs into the gaps of the header grid, so the label
 * itself is what lines up.
 */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <a
      href={getPathname({ href: pathname, locale })}
      hrefLang={locale}
      lang={locale}
      aria-label={localeNames[locale]}
      className="inline-flex h-10 items-center px-3 type-label hover:text-muted-foreground xl:-mx-3 xl:text-[0.6875rem]"
    >
      {locale.toUpperCase()}
    </a>
  );
}
