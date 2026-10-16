"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "./icons";

/**
 * Renders the same markup on server and client; which icon is visible is decided
 * by the `.dark` class in CSS. That avoids both a hydration mismatch and the
 * "render nothing until mounted" layout shift.
 */
export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={label}
      title={label}
      // From xl on the box hangs into the header grid's gaps, so the icon
      // itself lines up with the portrait's right edge.
      className="inline-flex size-10 items-center justify-center hover:bg-muted xl:-mx-2.5"
    >
      <SunIcon className="dark:hidden" />
      <MoonIcon className="hidden dark:block" />
    </button>
  );
}
