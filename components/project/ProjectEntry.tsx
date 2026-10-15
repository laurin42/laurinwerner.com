import Image from "next/image";
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
 * One project across the full content width: image, then title and text in two
 * columns. The whole entry is clickable via a stretched title link, so the link
 * text stays the project title.
 */
export function ProjectEntry({
  project,
  stackLabel,
  eager = false,
}: ProjectEntryProps) {
  const { cover } = project.images;

  return (
    <article className="group @container relative">
      <Reveal variant="clip">
        <Image
          src={cover.src}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
          sizes="(min-width: 1152px) 1088px, 100vw"
          loading={eager ? "eager" : "lazy"}
          className="h-auto w-full"
        />
      </Reveal>
      <Reveal className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-12">
        {/* Sized to the entry width (cqi) to match the title column, so even
            "Wetterstrucksi.de" fits on one line. */}
        <h3 className="type-display text-[clamp(2rem,13cqi,5.5rem)] break-words md:text-[clamp(2rem,7cqi,5.5rem)]">
          <Link
            href={`/projects/${project.slug}`}
            className="decoration-4 underline-offset-8 group-hover:underline after:absolute after:inset-0"
          >
            {project.title}
          </Link>
        </h3>
        <div className="flex flex-col gap-4">
          <p className="text-lg">{project.summary}</p>
          <StackTags items={project.stack} label={stackLabel} />
        </div>
      </Reveal>
    </article>
  );
}
