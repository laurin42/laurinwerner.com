import Image from "next/image";
import type { LocalizedProject } from "@/content";
import { Link } from "@/i18n/navigation";
import { StackTags } from "./StackTags";

type ProjectCardProps = {
  project: LocalizedProject;
  stackLabel: string;
  /** Load the cover immediately; for cards that are visible without scrolling. */
  eager?: boolean;
};

/** The whole card is clickable via a stretched title link; the title stays the link text. */
export function ProjectCard({
  project,
  stackLabel,
  eager = false,
}: ProjectCardProps) {
  const { cover } = project.images;

  return (
    <article className="relative flex flex-col gap-4 rounded-lg border border-border p-4 hover:bg-muted">
      <Image
        src={cover.src}
        alt={cover.alt}
        width={cover.width}
        height={cover.height}
        sizes="(min-width: 1024px) 470px, (min-width: 768px) 50vw, 100vw"
        loading={eager ? "eager" : "lazy"}
        className="h-auto w-full"
      />
      <h3 className="text-xl font-semibold">
        <Link
          href={`/projects/${project.slug}`}
          className="after:absolute after:inset-0 after:rounded-lg"
        >
          {project.title}
        </Link>
      </h3>
      <p className="text-muted-foreground">{project.summary}</p>
      <StackTags items={project.stack} label={stackLabel} />
    </article>
  );
}
