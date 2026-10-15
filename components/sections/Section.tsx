import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { container } from "@/lib/ui";

type SectionProps = {
  id: string;
  title: string;
  /** Short label on the right of the heading rule, e.g. a count. */
  meta?: string;
  /** Centers the heading block, e.g. for the projects section. */
  centered?: boolean;
  children: ReactNode;
};

/** A homepage section: full-width rule, `<h2>`, then content. */
export function Section({
  id,
  title,
  meta,
  centered = false,
  children,
}: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`${container} py-20 sm:py-28`}
    >
      <Reveal>
        <div
          className={`flex gap-4 border-t border-foreground pt-4 ${centered ? "flex-col items-center gap-3 text-center" : "items-baseline justify-between"}`}
        >
          <h2 id={headingId} className="type-display text-5xl sm:text-6xl">
            {title}
          </h2>
          {meta && <p className="type-label text-muted-foreground">{meta}</p>}
        </div>
      </Reveal>
      <div className="mt-12 sm:mt-16">{children}</div>
    </section>
  );
}
