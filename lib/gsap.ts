import type gsap from "gsap";

let loading: Promise<typeof gsap> | undefined;

/**
 * GSAP, loaded on first use. Everything it animates is below the fold or
 * starts after the CSS hero entrance, so it stays off the critical path: it
 * neither delays the first paint nor blocks the main thread at startup.
 */
export function loadGsap(): Promise<typeof gsap> {
  loading ??= import("gsap").then((module) => module.default);
  return loading;
}
