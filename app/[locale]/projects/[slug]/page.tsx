import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { CaseStudySection } from "@/components/project/CaseStudySection";
import { StackTags } from "@/components/project/StackTags";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { getNextProject, getProject, getProjectSlugs } from "@/content";
import { Link } from "@/i18n/navigation";
import { sectionId } from "@/lib/sections";

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
  const linkClass = "underline underline-offset-4";

  return (
    <article className="mx-auto max-w-5xl px-6 py-16">
      <Link
        href={`/#${sectionId("projects", locale)}`}
        className={`text-sm ${linkClass}`}
      >
        {t("allProjects")}
      </Link>

      <header className="mt-8">
        <h1 className="text-4xl font-semibold tracking-tight">
          {project.title}
        </h1>
        {project.tagline && (
          <p className="mt-2 text-xl text-muted-foreground">
            {project.tagline}
          </p>
        )}
        <p className="mt-6 max-w-2xl text-lg">{project.summary}</p>

        <h2 className="sr-only">{t("facts")}</h2>
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-muted-foreground">{t("client")}</dt>
            <dd>{project.client}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">{t("year")}</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">{t("role")}</dt>
            <dd>{project.role}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <StackTags items={project.stack} label={t("stack")} />
        </div>
        <ul className="mt-6 flex flex-wrap gap-4">
          <li>
            <ExternalLink href={project.links.live} className={linkClass}>
              {t("liveSite")}
            </ExternalLink>
          </li>
          {project.links.code && (
            <li>
              <ExternalLink href={project.links.code} className={linkClass}>
                {t("code")}
              </ExternalLink>
            </li>
          )}
        </ul>
      </header>

      <Image
        src={cover.src}
        alt={cover.alt}
        width={cover.width}
        height={cover.height}
        sizes="(min-width: 1024px) 976px, 100vw"
        preload
        className="mt-12 h-auto w-full"
      />

      <CaseStudySection id="problem" title={t("problem")}>
        <p>{project.problem}</p>
      </CaseStudySection>

      <CaseStudySection id="solution" title={t("solution")}>
        <p>{project.solution}</p>
      </CaseStudySection>

      <CaseStudySection id="highlights" title={t("highlights")}>
        <ul className="list-disc space-y-1 pl-5">
          {project.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CaseStudySection>

      {project.results && (
        <CaseStudySection id="results" title={t("results")}>
          <ul className="list-disc space-y-1 pl-5">
            {project.results.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </CaseStudySection>
      )}

      {project.testimonial && (
        <CaseStudySection id="testimonial" title={t("testimonial")}>
          <figure>
            <blockquote className="border-l-2 border-border pl-4 italic">
              <p>{project.testimonial.quote}</p>
            </blockquote>
            <figcaption className="mt-2 text-sm text-muted-foreground">
              {project.testimonial.author}
            </figcaption>
          </figure>
        </CaseStudySection>
      )}

      {gallery.length > 0 && (
        <CaseStudySection id="gallery" title={t("gallery")}>
          <ul className="grid gap-6 sm:grid-cols-2">
            {gallery.map((image) => (
              <li key={image.src}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(min-width: 640px) 320px, 100vw"
                  className="mx-auto h-auto w-full max-w-xs"
                />
              </li>
            ))}
          </ul>
        </CaseStudySection>
      )}

      {next && next.slug !== project.slug && (
        <nav
          aria-label={t("nextProject")}
          className="mt-16 border-t border-border pt-8"
        >
          <p className="text-sm text-muted-foreground">{t("nextProject")}</p>
          <Link
            href={`/projects/${next.slug}`}
            className={`mt-1 inline-block text-2xl font-semibold ${linkClass}`}
          >
            {next.title}
          </Link>
        </nav>
      )}
    </article>
  );
}
