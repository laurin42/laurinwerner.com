import Image from "next/image";
import { ViewTransition } from "react";
import { Colorize } from "@/components/motion/Colorize";
import { Reveal } from "@/components/motion/Reveal";
import type { LocalizedProject } from "@/content";
import { Link } from "@/i18n/navigation";
import { StackTags } from "./StackTags";

type ProjectEntryProps = {
  project: LocalizedProject;
  stackLabel: string;
  /** Load the cover immediately; for the entry that is visible without scrolling. */
  eager?: boolean;
};

/**
 * One project in a single, centered column: image, title, text. Full width on
 * small screens, a narrower measure from `md` on. The whole entry is clickable
 * via a stretched title link, so the link text stays the project title.
 *
 * Cover and title carry view-transition names shared with the case study, so
 * they morph into its header on navigation. That is their entrance too: the
 * cover takes on colour in focus (<Colorize>) instead of a <Reveal>.
 */
export function ProjectEntry({
  project,
  stackLabel,
  eager = false,
}: ProjectEntryProps) {
  const { cover } = project.images;

  return (
    <article className="group @container relative md:mx-auto md:max-w-3xl">
      <ViewTransition
        name={`project-cover-${project.slug}`}
        share="morph"
        default="none"
      >
        <Colorize className="overflow-hidden">
          <Image
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            sizes="(min-width: 768px) 768px, 100vw"
            loading={eager ? "eager" : "lazy"}
            className="h-auto w-full"
          />
        </Colorize>
      </ViewTransition>
      <div className="mt-6 flex flex-col items-center gap-6 text-center sm:mt-8">
        {/* Sized to the entry width (cqi) so the longest title, "Praxis Janis
            Werner", still spans the full width on one line. */}
        <h3 className="type-display text-[12cqi] break-words">
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0"
          >
            <ViewTransition
              name={`project-title-${project.slug}`}
              share="morph"
              default="none"
            >
              {/* The underline draws in from the left on hover and focus. */}
              <span className="inline-block bg-[linear-gradient(var(--accent),var(--accent))] bg-[length:0%_4px] bg-[position:0_100%] bg-no-repeat pb-[0.06em] group-hover:bg-[length:100%_4px] group-has-[:focus-visible]:bg-[length:100%_4px] motion-safe:transition-[background-size] motion-safe:duration-500 motion-safe:ease-out">
                {project.title}
              </span>
            </ViewTransition>
          </Link>
        </h3>
        <Reveal className="flex max-w-[60ch] flex-col gap-4">
          <p className="text-lg">{project.summary}</p>
          <StackTags
            items={project.stack}
            label={stackLabel}
            className="justify-center"
          />
        </Reveal>
      </div>
    </article>
  );
}
