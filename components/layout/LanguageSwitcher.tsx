"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { localeNames, routing } from "@/i18n/routing";

/** Links to the current page in the other language. */
export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const target =
    routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <Link
      href={pathname}
      locale={target}
      hrefLang={target}
      lang={target}
      aria-label={localeNames[target]}
      className="inline-flex h-10 items-center rounded-md px-2 text-sm font-medium hover:bg-muted"
    >
      {target.toUpperCase()}
    </Link>
  );
}
