import type { Locale } from "@/i18n/routing";

/** `2024-07` → `Juli 2024` / `July 2024`. */
export function formatMonth(month: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${month}-01T00:00:00Z`));
}

/** A period like `Juli 2024 – März 2025`; `end === null` means ongoing. */
export function formatPeriod(
  start: string,
  end: string | null,
  locale: Locale,
  presentLabel: string,
): string {
  if (end === start) return formatMonth(start, locale);
  return `${formatMonth(start, locale)} – ${end === null ? presentLabel : formatMonth(end, locale)}`;
}
