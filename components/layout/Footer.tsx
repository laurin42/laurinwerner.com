import { getLocale, getTranslations } from "next-intl/server";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { getProfile } from "@/content";
import { Link } from "@/i18n/navigation";

const linkClass = "hover:text-foreground hover:underline";

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const profile = getProfile(locale);
  // Pages are static, so this is the build year.
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {profile.name}
        </p>
        <nav aria-label={t("contactNav")}>
          <ul className="flex gap-4">
            <li>
              <a href={`mailto:${profile.email}`} className={linkClass}>
                {t("email")}
              </a>
            </li>
            <li>
              <ExternalLink href={profile.links.github} className={linkClass}>
                GitHub
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={profile.links.linkedin} className={linkClass}>
                LinkedIn
              </ExternalLink>
            </li>
          </ul>
        </nav>
        <nav aria-label={t("legalNav")}>
          <ul className="flex gap-4">
            <li>
              <Link href="/legal#imprint" className={linkClass}>
                {t("imprint")}
              </Link>
            </li>
            <li>
              <Link href="/legal#privacy" className={linkClass}>
                {t("privacy")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
