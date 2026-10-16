"use client";

import type gsap from "gsap";
import { type ReactNode, useEffect, useRef } from "react";
import { loadGsap } from "@/lib/gsap";

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
  /**
   * Draws a rule along its length, its leading tip in red (`--tip`, see `.rule`
   * in globals.css), which then recedes. The CSS `transform-origin` sets where
   * it draws from.
   */
  line: {
    from: { scaleX: 0, "--tip": "88%" },
    to: { scaleX: 1, duration: 0.9, ease: "power3.inOut" },
    then: { "--tip": "100%", duration: 0.6, ease: "power2.inOut" },
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
} satisfies Record<
  string,
  { from: gsap.TweenVars; to: gsap.TweenVars; then?: gsap.TweenVars }
>;

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

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    // The CSS fallback (globals.css) stands down: the entrance is ours now.
    element.dataset.revealReady = "";
    // Nothing is hidden with reduced motion, so there is nothing to play.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timeline: gsap.core.Timeline | undefined;
    let cancelled = false;
    const show = () => {
      element.dataset.revealed = "";
    };

    // GSAP is only loaded once something scrolls into view, so it never
    // blocks the main thread while the page starts up.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        loadGsap().then((gsap) => {
          if (cancelled) return;
          const { from, to } = variants[variant];
          const then =
            "then" in variants[variant] ? variants[variant].then : null;
          const target =
            variant === "mask"
              ? (element.firstElementChild ?? element)
              : element;
          // The CSS pre-hide goes first: GSAP would read its transform as a
          // starting offset. `fromTo` sets the same state again before the
          // next paint, so nothing flashes.
          show();
          timeline = gsap.timeline({ delay }).fromTo(target, from, to);
          if (then) timeline.to(target, then);
        }, show);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);

    return () => {
      cancelled = true;
      observer.disconnect();
      timeline?.revert();
      delete element.dataset.revealed;
    };
  }, [variant, delay]);

  return (
    <div ref={ref} data-reveal={variant} className={className}>
      {children}
    </div>
  );
}
