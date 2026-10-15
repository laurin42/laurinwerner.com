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
      className="inline-flex size-10 items-center justify-center rounded-md hover:bg-muted"
    >
      <SunIcon className="dark:hidden" />
      <MoonIcon className="hidden dark:block" />
    </button>
  );
}
