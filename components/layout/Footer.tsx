import { getLocale, getTranslations } from "next-intl/server";
import { getProfile } from "@/content";
import { Link } from "@/i18n/navigation";

async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

const linkClass = "hover:text-foreground hover:underline";

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const profile = getProfile(locale);
  const year = await currentYear();

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
              <a
                href={profile.links.github}
                rel="noopener noreferrer"
                className={linkClass}
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href={profile.links.linkedin}
                rel="noopener noreferrer"
                className={linkClass}
              >
                LinkedIn
              </a>
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
