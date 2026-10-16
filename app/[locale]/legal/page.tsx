import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getLegal, getProfile } from "@/content";
import { alternates, openGraph } from "@/lib/metadata";
import { container, textLink } from "@/lib/ui";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("legal");
  return {
    title: t("title"),
    alternates: alternates("/legal", locale),
    openGraph: { ...openGraph(locale), title: t("title") },
    // Required, but nothing anyone should land on from a search.
    robots: { index: false, follow: true },
  };
}

/** Imprint (`#imprint`) and privacy policy (`#privacy`) on one page. */
export default async function LegalPage() {
  const locale = await getLocale();
  const t = await getTranslations("legal");
  const { imprint, privacy } = getLegal(locale);
  const { email } = getProfile(locale);

  return (
    <div className={`${container} pt-10 pb-24 sm:pt-16`}>
      <h1 className="type-display text-[clamp(3rem,10vw,6rem)]">
        {t("title")}
      </h1>

      <div className="mt-16 flex max-w-[65ch] flex-col gap-20 sm:mt-20">
        {/* Headings scale with the viewport: "Datenschutzerklärung" is one
            long word and must fit on a 320 px screen. */}
        <section id="imprint" aria-labelledby="imprint-heading">
          <h2
            id="imprint-heading"
            className="border-t border-foreground pt-4 type-display text-[clamp(1.5rem,9vw,3rem)]"
          >
            {imprint.title}
          </h2>
          <div className="mt-8 flex flex-col gap-6 text-lg">
            <p className="type-label text-muted-foreground">{imprint.basis}</p>
            <address className="not-italic">
              {imprint.name}
              <br />
              {imprint.address}
            </address>
            <div>
              <h3 className="font-semibold">{imprint.contactLabel}</h3>
              <a href={`mailto:${email}`} className={textLink}>
                {email}
              </a>
            </div>
            <div>
              <h3 className="font-semibold">{imprint.responsibleLabel}</h3>
              <p>{imprint.responsible}</p>
            </div>
          </div>
        </section>

        <section id="privacy" aria-labelledby="privacy-heading">
          <h2
            id="privacy-heading"
            className="border-t border-foreground pt-4 type-display text-[clamp(1.5rem,9vw,3rem)]"
          >
            {privacy.title}
          </h2>
          <p className="mt-4 type-label text-muted-foreground">
            {privacy.updated}
          </p>
          <div className="mt-10 flex flex-col gap-10">
            {privacy.sections.map((section) => (
              <section key={section.title}>
                <h3 className="text-xl font-semibold">{section.title}</h3>
                <div className="mt-3 flex flex-col gap-3">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.list && (
                    <ul className="list-disc pl-5">
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.after?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
