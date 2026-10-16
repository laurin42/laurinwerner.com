import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * A full-width rule that draws itself in on entry, led by a red tip; from the
 * middle when `centered`, otherwise from the left.
 */
export function Rule({ centered = false }: { centered?: boolean }) {
  return (
    <Reveal
      variant="line"
      className={`rule h-px ${centered ? "origin-center" : "origin-left"}`}
    >
      {null}
    </Reveal>
  );
}

/**
 * Lets a heading rise into place on entry, as if from under the rule above it.
 * Only what is below the box is hidden, so accents above stay visible.
 */
export function MaskedHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Reveal
      variant="mask"
      delay={0.15}
      className={`[clip-path:inset(-1em_-1em_0_-1em)] ${className}`}
    >
      {children}
    </Reveal>
  );
}
