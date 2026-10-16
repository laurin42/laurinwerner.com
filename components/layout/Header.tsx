import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { sectionId, sections } from "@/lib/sections";
import { NameWords } from "@/components/ui/NameWords";
import { siteConfig } from "@/lib/site-config";
import { container, quietLink } from "@/lib/ui";
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
    // Named, so it stays put while pages change (view transitions, globals.css).
    <header className="sticky top-0 z-40 bg-background [view-transition-name:site-header]">
      {/* From lg on the same columns as the hero, so the menu spans exactly
          the width of the portrait below it. */}
      <div
        className={`${container} relative flex h-16 items-center lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-14`}
      >
        <div className="flex flex-1 items-center justify-between gap-4">
          <Link
            href={home}
            data-header-name
            className="type-display text-xl whitespace-nowrap sm:text-2xl"
          >
            <NameWords name={siteConfig.name} />
          </Link>
          <div className="flex items-center gap-1">
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
        <nav aria-label={t("label")} className="hidden lg:block">
          {/* No side padding on the links: the first and last label sit
              exactly on the portrait's edges. */}
          <ul className="flex items-center justify-between">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block py-2 type-label ${quietLink}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div
        aria-hidden="true"
        data-scroll-progress
        className="absolute inset-x-0 bottom-0 h-1 bg-accent"
      />
    </header>
  );
}
