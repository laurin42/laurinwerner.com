"use client";

import { type ReactNode, useEffect, useRef } from "react";

type ColorizeProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Marks its box `data-in-view` while it crosses the middle of the screen; CSS
 * (globals.css) shows the image inside in colour then, and in greyscale
 * otherwise. So the project in focus is the one in colour.
 */
export function Colorize({ children, className }: ColorizeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        element.toggleAttribute("data-in-view", entry?.isIntersecting),
      // A band across the middle third of the screen.
      { rootMargin: "-33% 0px -33% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-colorize className={className}>
      {children}
    </div>
  );
}
