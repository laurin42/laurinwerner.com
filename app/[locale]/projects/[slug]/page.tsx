import Image from "next/image";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { CaseStudySection } from "@/components/project/CaseStudySection";
import { StackTags } from "@/components/project/StackTags";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { getNextProject, getProject, getProjectSlugs } from "@/content";
import { Link } from "@/i18n/navigation";
import { sectionId } from "@/lib/sections";
import { container, quietLink, textLink } from "@/lib/ui";

// Only the known projects exist; any other slug is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { slug } = await params;
  const locale = await getLocale();
  const project = getProject(slug, locale);
  if (!project) notFound();

  const t = await getTranslations("caseStudy");
  const next = getNextProject(slug, locale);
  const { cover, gallery = [] } = project.images;

  return (
    <article className={`${container} pt-10 pb-24 sm:pt-16`}>
      <Link
        href={`/#${sectionId("projects", locale)}`}
        className={`type-label ${quietLink}`}
      >
        ← {t("allProjects")}
      </Link>

      <header className="@container mt-10 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-end md:gap-14">
        <div className="hero-in">
          <h1 className="type-display text-[clamp(2rem,12.5cqi,9rem)] break-words md:text-[clamp(2rem,7cqi,9rem)]">
            {/* Morphs from the project entry on the homepage (same name). */}
            <ViewTransition
              name={`project-title-${project.slug}`}
              share="morph"
              default="none"
            >
              <span className="inline-block">{project.title}</span>
            </ViewTransition>
          </h1>
          {project.tagline && (
            <p className="mt-6 text-2xl font-semibold sm:text-3xl">
              {project.tagline}
            </p>
          )}
          <p className="mt-4 max-w-[50ch] text-lg text-muted-foreground">
            {project.summary}
          </p>
        </div>
        <div className="hero-in flex flex-col gap-6 [--delay:120ms]">
          <h2 className="sr-only">{t("facts")}</h2>
          <dl className="flex flex-col">
            {[
              [t("client"), project.client],
              [t("year"), String(project.year)],
              [t("role"), project.role],
            ].map(([term, value]) => (
              <div
                key={term}
                className="grid grid-cols-[6rem_minmax(0,1fr)] gap-4 border-t border-border py-3"
              >
                <dt className="pt-0.5 type-label text-muted-foreground">
                  {term}
                </dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <StackTags items={project.stack} label={t("stack")} />
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-lg font-semibold">
            <li>
              <ExternalLink href={project.links.live} className={textLink}>
                {t("liveSite")}
              </ExternalLink>
            </li>
            {project.links.code && (
              <li>
                <ExternalLink href={project.links.code} className={textLink}>
                  {t("code")}
                </ExternalLink>
              </li>
            )}
          </ul>
        </div>
      </header>

      <div className="hero-clip mt-16">
        <ViewTransition
          name={`project-cover-${project.slug}`}
          share="morph"
          default="none"
        >
          <div>
            <Image
              src={cover.src}
              alt={cover.alt}
              width={cover.width}
              height={cover.height}
              sizes="(min-width: 1152px) 1088px, 100vw"
              preload
              className="h-auto w-full"
            />
          </div>
        </ViewTransition>
      </div>

      <div className="mt-20 flex flex-col gap-16 sm:mt-28 sm:gap-24">
        <CaseStudySection id="problem" title={t("problem")}>
          <p>{project.problem}</p>
        </CaseStudySection>

        <CaseStudySection id="solution" title={t("solution")}>
          <p>{project.solution}</p>
        </CaseStudySection>

        <CaseStudySection id="highlights" title={t("highlights")}>
          <ul className="flex flex-col">
            {project.highlights.map((item) => (
              <li key={item} className="border-b border-border py-3 first:pt-0">
                {item}
              </li>
            ))}
          </ul>
        </CaseStudySection>

        {project.results && (
          <CaseStudySection id="results" title={t("results")}>
            <ul className="flex flex-col">
              {project.results.map((item) => (
                <li
                  key={item}
                  className="border-b border-border py-3 first:pt-0"
                >
                  {item}
                </li>
              ))}
            </ul>
          </CaseStudySection>
        )}

        {project.testimonial && (
          <CaseStudySection id="testimonial" title={t("testimonial")}>
            <figure>
              <blockquote className="text-2xl font-semibold">
                <p>„{project.testimonial.quote}“</p>
              </blockquote>
              <figcaption className="mt-4 type-label text-muted-foreground">
                {project.testimonial.author}
              </figcaption>
            </figure>
          </CaseStudySection>
        )}

        {gallery.length > 0 && (
          <CaseStudySection id="gallery" title={t("gallery")}>
            <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {gallery.map((image) => (
                <li key={image.src}>
                  <Reveal variant="clip">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      sizes="(min-width: 640px) 320px, 100vw"
                      className="h-auto w-full max-w-xs"
                    />
                  </Reveal>
                </li>
              ))}
            </ul>
          </CaseStudySection>
        )}
      </div>

      {next && next.slug !== project.slug && (
        <nav
          aria-label={t("nextProject")}
          className="@container mt-28 border-t border-foreground pt-4"
        >
          <p className="type-label text-muted-foreground">{t("nextProject")}</p>
          <Link
            href={`/projects/${next.slug}`}
            className="mt-6 inline-block type-display text-[clamp(2rem,11cqi,7.5rem)] break-words decoration-accent decoration-4 underline-offset-8 hover:underline"
          >
            {next.title} →
          </Link>
        </nav>
      )}
    </article>
  );
}
