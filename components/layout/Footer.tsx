import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";

async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer() {
  const t = await getTranslations("footer");
  const year = await currentYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {siteConfig.name}
        </p>
        <nav aria-label={t("legalNav")}>
          <ul className="flex gap-4">
            <li>
              <Link
                href="/legal#imprint"
                className="hover:text-foreground hover:underline"
              >
                {t("imprint")}
              </Link>
            </li>
            <li>
              <Link
                href="/legal#privacy"
                className="hover:text-foreground hover:underline"
              >
                {t("privacy")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
