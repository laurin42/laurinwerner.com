"use client";

import gsap from "gsap";
import { useEffect } from "react";

/** Seconds for one word's flight between hero and header. */
const DURATION = 0.7;
/** Seconds by which each word starts after the previous one. */
const STAGGER = 0.08;

/**
 * Morphs the hero name into the header name: once `#hero-name` starts to slide
 * under the sticky header, the header words fly from the hero words' places
 * into theirs; scrolling back, the hero words fly back from the header.
 *
 * Each flight is time-based (FLIP: start and end are measured once), and the
 * words that move always land somewhere stable: in the sticky header, or in the
 * page flow. Nothing follows the scroll position frame by frame, because that
 * jitters: the browser scrolls on another thread, a frame ahead of script.
 * With reduced motion the swap is instant. Without JavaScript nothing is hidden
 * (see globals.css).
 */
export function NameMorph() {
  useEffect(() => {
    const hero = document.getElementById("hero-name");
    const logo = document.querySelector<HTMLElement>("[data-header-name]");
    const header = logo?.closest("header");
    if (!hero || !logo || !header) return;
    const heroWords = [
      ...hero.querySelectorAll<HTMLElement>("[data-name-word]"),
    ];
    const logoWords = [
      ...logo.querySelectorAll<HTMLElement>("[data-name-word]"),
    ];
    if (heroWords.length === 0 || heroWords.length !== logoWords.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const all = [...heroWords, ...logoWords];
    let inHeader: boolean | undefined;
    let observer: IntersectionObserver | undefined;
    let cancelled = false;

    /** Hero words visible, or header words visible; never both. */
    function show(header: boolean) {
      logo!.style.visibility = header ? "visible" : "hidden";
      gsap.set(heroWords, { opacity: header ? 0 : 1 });
    }

    /**
     * Moves `words` from where `sources` currently are (transforms included)
     * into their own resting places.
     */
    function flip(words: HTMLElement[], sources: HTMLElement[]) {
      const from = sources.map((word) => word.getBoundingClientRect());
      gsap.killTweensOf(all);
      gsap.set(all, { clearProps: "transform" });
      const rest = words.map((word) => word.getBoundingClientRect());
      // Same font, so the width ratio is the font-size ratio. Line heights
      // differ, so the words are aligned on their vertical centers.
      const start = rest.map((to, index) => {
        const source = from[index]!;
        const scale = source.width / to.width;
        return {
          x: source.left - to.left,
          y: source.top + source.height / 2 - (to.height * scale) / 2 - to.top,
          scale,
        };
      });
      // Lifts the hero words above the sticky header while they fly back.
      hero!.toggleAttribute("data-morphing", words === heroWords);
      gsap.fromTo(
        words,
        {
          x: (index: number) => start[index]!.x,
          y: (index: number) => start[index]!.y,
          scale: (index: number) => start[index]!.scale,
          transformOrigin: "0 0",
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          duration: DURATION,
          ease: "power3.inOut",
          stagger: STAGGER,
          onComplete: () => hero!.removeAttribute("data-morphing"),
        },
      );
    }

    function update(toHeader: boolean, instant: boolean) {
      if (toHeader === inHeader) return;
      inHeader = toHeader;
      if (!instant && !reducedMotion.matches) {
        if (toHeader) flip(logoWords, heroWords);
        else flip(heroWords, logoWords);
      }
      show(toHeader);
    }

    // Start after the fonts are in and the CSS hero entrance has finished.
    Promise.all([
      document.fonts.ready,
      ...hero.getAnimations().map((animation) => animation.finished),
    ])
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return;
        let first = true;
        observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry?.rootBounds) return;
            // In the header as soon as the hero name slides under it.
            update(entry.boundingClientRect.top < entry.rootBounds.top, first);
            first = false;
          },
          {
            rootMargin: `-${header.getBoundingClientRect().height}px 0px 0px 0px`,
            threshold: [0, 1],
          },
        );
        observer.observe(hero);
      });

    return () => {
      cancelled = true;
      observer?.disconnect();
      gsap.killTweensOf(all);
      gsap.set(all, { clearProps: "transform,opacity" });
      hero.removeAttribute("data-morphing");
      logo.style.visibility = "";
    };
  }, []);

  return null;
}
