import type { ReactNode } from "react";

type CaseStudySectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export function CaseStudySection({
  id,
  title,
  children,
}: CaseStudySectionProps) {
  return (
    <section aria-labelledby={id} className="mt-12">
      <h2 id={id} className="text-xl font-semibold">
        {title}
      </h2>
      <div className="mt-4 max-w-2xl">{children}</div>
    </section>
  );
}
