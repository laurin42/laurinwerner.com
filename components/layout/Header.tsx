import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { sectionId, sections } from "@/lib/sections";
import { siteConfig } from "@/lib/site-config";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

export async function Header() {
  const locale = await getLocale();
  const t = await getTranslations("nav");
  const home = getPathname({ href: "/", locale });
  // Real anchor links on the homepage, so navigation works without JavaScript.
  const items = sections.map((section) => ({
    href: `${home}#${sectionId(section, locale)}`,
    label: t(section),
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="relative mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-6">
        <Link href={home} className="font-semibold">
          {siteConfig.name}
        </Link>
        <div className="flex items-center gap-2">
          <nav aria-label={t("label")} className="hidden md:block">
            <ul className="flex items-center gap-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-md px-3 py-2 hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <LanguageSwitcher />
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
