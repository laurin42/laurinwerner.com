"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type ReactNode, useRef } from "react";

gsap.registerPlugin(useGSAP);

const variants = {
  /** Fades in while rising a little; for text. */
  rise: {
    from: { opacity: 0, y: 24 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
  },
  /** Uncovers from the bottom edge; for images. */
  clip: {
    from: { clipPath: "inset(100% 0% 0% 0%)" },
    to: { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power4.inOut" },
  },
  /** Draws a rule along its length; the CSS `transform-origin` sets where from. */
  line: {
    from: { scaleX: 0 },
    to: { scaleX: 1, duration: 0.9, ease: "power3.inOut" },
  },
  /**
   * Its content rises from below its bottom edge, which clips (see
   * <MaskedHeading>). The box itself stays put, so it can be observed.
   */
  mask: {
    // More than 100 %: accents (Ü) reach above the tight display line box.
    from: { yPercent: 140 },
    to: { yPercent: 0, duration: 0.8, ease: "power3.out" },
  },
} satisfies Record<string, { from: gsap.TweenVars; to: gsap.TweenVars }>;

type RevealProps = {
  children: ReactNode;
  variant?: keyof typeof variants;
  /** Seconds; use small steps (0.1) to stagger neighbouring elements. */
  delay?: number;
  className?: string;
};

/**
 * Plays a one-off entrance when the element scrolls into view. Progressive
 * enhancement: without JavaScript or with reduced motion the content is simply
 * visible (see the `[data-reveal]` rules in globals.css).
 */
export function Reveal({
  children,
  variant = "rise",
  delay = 0,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const { from, to } = variants[variant];
        const target =
          variant === "mask" ? (element.firstElementChild ?? element) : element;
        // Ready first: the CSS pre-hide (globals.css) must not apply anymore
        // when GSAP reads the starting transform.
        element.dataset.revealReady = "";
        gsap.set(target, from);

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry?.isIntersecting) return;
            observer.disconnect();
            gsap.to(target, { ...to, delay });
          },
          { rootMargin: "0px 0px -10% 0px" },
        );
        observer.observe(element);
        return () => observer.disconnect();
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        element.dataset.revealReady = "";
      });
    },
    { scope: ref, dependencies: [variant, delay] },
  );

  return (
    <div ref={ref} data-reveal={variant} className={className}>
      {children}
    </div>
  );
}
