import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { sectionId, sections } from "@/lib/sections";
import { NameWords } from "@/components/ui/NameWords";
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
    // Named, so it stays put while pages change (view transitions, globals.css).
    <header className="sticky top-0 z-40 bg-background [view-transition-name:site-header]">
      {/* From xl on the same columns as the hero: menu, language and theme
          share one subgrid that spans exactly the portrait's width, spaced
          evenly, the outer items on its edges. Labels are a size smaller
          there, so all six fit with room between them. */}
      <div
        className={`${container} relative flex h-16 items-center justify-between gap-4 xl:grid xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] xl:gap-14`}
      >
        <Link
          href={home}
          data-header-name
          className="type-display text-xl whitespace-nowrap sm:text-2xl"
        >
          <NameWords name={siteConfig.name} />
        </Link>
        <div className="flex items-center gap-1 xl:grid xl:grid-cols-[repeat(6,auto)] xl:justify-between">
          <nav
            aria-label={t("label")}
            className="hidden xl:col-span-4 xl:grid xl:grid-cols-subgrid"
          >
            <ul className="col-span-4 grid grid-cols-subgrid items-center">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block py-2 type-label text-[0.6875rem] hover:text-muted-foreground"
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
      <div
        aria-hidden="true"
        data-scroll-progress
        className="absolute inset-x-0 bottom-0 h-1 bg-accent"
      />
    </header>
  );
}
