import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { MaskedHeading, Rule } from "@/components/motion/HeadingReveal";

type CaseStudySectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

/** Heading on the left, content on the right; stacked on small screens. */
export function CaseStudySection({
  id,
  title,
  children,
}: CaseStudySectionProps) {
  return (
    <section aria-labelledby={id}>
      <Rule />
      <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12">
        <MaskedHeading>
          <h2 id={id} className="type-display text-4xl">
            {title}
          </h2>
        </MaskedHeading>
        <Reveal className="max-w-[60ch] text-lg">{children}</Reveal>
      </div>
    </section>
  );
}
