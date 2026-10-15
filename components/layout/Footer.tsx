import { getLocale, getTranslations } from "next-intl/server";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { getProfile } from "@/content";
import { Link } from "@/i18n/navigation";
import { container } from "@/lib/ui";

const linkClass = "hover:underline hover:underline-offset-4";

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const profile = getProfile(locale);
  // Pages are static, so this is the build year.
  const year = new Date().getFullYear();

  return (
    <footer className={`${container} pb-10`}>
      <div className="flex flex-col gap-4 border-t border-foreground pt-4 type-label sm:flex-row sm:items-start sm:justify-between">
        <p>
          © {year} {profile.name}
        </p>
        <nav aria-label={t("contactNav")}>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
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
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
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
