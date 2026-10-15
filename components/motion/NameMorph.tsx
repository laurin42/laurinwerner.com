"use client";

import gsap from "gsap";
import { useEffect } from "react";

type Target = { x: number; dy: number; scale: number };

/**
 * Scroll-linked morph of the hero name into the header name: each word of
 * `#hero-name` moves and shrinks onto the same word in `[data-header-name]`,
 * then the header name takes over. Scrolling back reverses it. With reduced
 * motion the header name simply appears once the hero name has scrolled away.
 * Without JavaScript nothing is hidden (see globals.css).
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
    // Each word heads for the header quickly and settles into place. The words
    // are staggered (first word leads), so they never cross each other.
    const ease = gsap.parseEase("power2.out");
    const span = 0.75;
    const lag = heroWords.length > 1 ? (1 - span) / (heroWords.length - 1) : 0;
    let targets: Target[] = [];
    let end = 1;
    let frame = 0;
    let cancelled = false;

    /** Measures untransformed positions; the header is sticky, so its words stay put. */
    function measure() {
      gsap.set(heroWords, { clearProps: "transform" });
      const scrollY = window.scrollY;
      targets = heroWords.map((word, index) => {
        const from = word.getBoundingClientRect();
        const to = logoWords[index]!.getBoundingClientRect();
        // Same font, so the width ratio is the font-size ratio. Line heights
        // differ, so the words are aligned on their vertical centers.
        const scale = to.width / from.width;
        return {
          x: to.left - from.left,
          dy:
            to.top +
            to.height / 2 -
            (from.height * scale) / 2 -
            (from.top + scrollY),
          scale,
        };
      });
      // Done when the hero name would have scrolled under the header on its own.
      end = Math.max(
        1,
        hero!.getBoundingClientRect().bottom +
          scrollY -
          header!.getBoundingClientRect().bottom,
      );
    }

    function render() {
      frame = 0;
      const scrollY = window.scrollY;
      const progress = gsap.utils.clamp(0, 1, scrollY / end);
      const done = progress >= 1;
      logo!.style.visibility = done ? "visible" : "hidden";
      if (reducedMotion.matches) return;

      // Lifts the moving words above the sticky header while they travel.
      hero!.toggleAttribute("data-morphing", progress > 0 && !done);
      heroWords.forEach((word, index) => {
        const target = targets[index]!;
        const own = gsap.utils.clamp(0, 1, (progress - index * lag) / span);
        // Size and horizontal position settle in the first half, the height in
        // the whole window: a word reaches its slot in the line before it
        // arrives at the header's height, so it never covers the word before.
        const across = ease(Math.min(1, own * 2));
        const down = ease(own);
        gsap.set(word, {
          x: across * target.x,
          // Blends the word's scrolled position into the header position.
          y: down * (target.dy + scrollY),
          scale: 1 + across * (target.scale - 1),
          transformOrigin: "0 0",
          opacity: done ? 0 : 1,
        });
      });
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(render);
    }

    function onResize() {
      measure();
      render();
    }

    function reset() {
      gsap.set(heroWords, { clearProps: "transform,opacity" });
      hero!.removeAttribute("data-morphing");
    }

    function onMotionChange() {
      reset();
      onResize();
    }

    // Measure after the fonts are in and the CSS hero entrance has finished.
    Promise.all([
      document.fonts.ready,
      ...hero.getAnimations().map((animation) => animation.finished),
    ])
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return;
        onResize();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);
        reducedMotion.addEventListener("change", onMotionChange);
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      reducedMotion.removeEventListener("change", onMotionChange);
      reset();
      logo.style.visibility = "";
    };
  }, []);

  return null;
}
