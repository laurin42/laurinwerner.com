import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { container } from "@/lib/ui";

type SectionProps = {
  id: string;
  title: string;
  /** Centers the heading block, e.g. for the projects section. */
  centered?: boolean;
  children: ReactNode;
};

/** A homepage section: full-width rule, `<h2>`, then content. */
export function Section({
  id,
  title,
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
          className={`flex border-t border-foreground pt-4 ${centered ? "justify-center text-center" : ""}`}
        >
          <h2 id={headingId} className="type-display text-5xl sm:text-6xl">
            {title}
          </h2>
        </div>
      </Reveal>
      <div className="mt-12 sm:mt-16">{children}</div>
    </section>
  );
}
