import type { ReactNode } from "react";
import { MaskedHeading, Rule } from "@/components/motion/HeadingReveal";
import { container } from "@/lib/ui";

type SectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

/** A homepage section: full-width rule, `<h2>`, then content. */
export function Section({ id, title, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`${container} py-20 sm:py-28`}
    >
      <Rule />
      <MaskedHeading className="pt-4">
        <h2 id={headingId} className="type-display text-5xl sm:text-6xl">
          {title}
        </h2>
      </MaskedHeading>
      <div className="mt-12 sm:mt-16">{children}</div>
    </section>
  );
}
