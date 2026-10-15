import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

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
    <section aria-labelledby={id} className="border-t border-foreground pt-4">
      <Reveal className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12">
        <h2 id={id} className="type-display text-4xl">
          {title}
        </h2>
        <div className="max-w-[60ch] text-lg">{children}</div>
      </Reveal>
    </section>
  );
}
