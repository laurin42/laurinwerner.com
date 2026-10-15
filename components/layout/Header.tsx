import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { sectionId, sections } from "@/lib/sections";
import { siteConfig } from "@/lib/site-config";
import { container } from "@/lib/ui";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

export async function Header() {
  const locale = await getLocale();
  const t = await getTranslations("nav");
  const home = getPathname({ href: "/", locale });
  const otherLocale =
    routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;
  // Real anchor links on the homepage, so navigation works without JavaScript.
  const items = sections.map((section) => ({
    href: `${home}#${sectionId(section, locale)}`,
    label: t(section),
  }));

  return (
    <header className="sticky top-0 z-40 bg-background">
      <div
        className={`${container} relative flex h-16 items-center justify-between gap-4`}
      >
        <Link
          href={home}
          data-header-name
          className="type-display text-xl whitespace-nowrap sm:text-2xl"
        >
          {siteConfig.name}
        </Link>
        <div className="flex items-center gap-1">
          <nav aria-label={t("label")} className="hidden md:block">
            <ul className="flex items-center">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="px-3 py-2 type-label hover:underline hover:underline-offset-4"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <LanguageSwitcher locale={otherLocale} />
          <ThemeToggle label={t("toggleTheme")} />
          <MobileMenu
            items={items}
            navLabel={t("label")}
            openLabel={t("openMenu")}
            closeLabel={t("closeMenu")}
          />
        </div>
      </div>
    </header>
  );
}
