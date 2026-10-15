import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { container, textLink } from "@/lib/ui";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className={`${container} py-24 sm:py-32`}>
      <p className="type-label text-muted-foreground">404</p>
      <h1 className="mt-4 type-display text-[clamp(3.5rem,12vw,8rem)]">
        {t("title")}
      </h1>
      <p className="mt-6 text-lg text-muted-foreground">{t("description")}</p>
      <Link
        href="/"
        className={`${textLink} mt-10 inline-block text-lg font-semibold`}
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
