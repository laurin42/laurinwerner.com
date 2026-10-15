import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

/** A homepage section with a labelled landmark and an `<h2>`. */
export function Section({ id, title, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="border-t border-border py-16"
    >
      <h2 id={headingId} className="text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}
