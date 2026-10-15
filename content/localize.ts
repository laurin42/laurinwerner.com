import type { Locale } from "@/i18n/routing";

type Localized<T> = { de: T; en: T };

/** The type of `value` after every `{ de, en }` pair is replaced by one language. */
export type Localize<T> =
  T extends Localized<infer U>
    ? Localize<U>
    : T extends readonly (infer E)[]
      ? Localize<E>[]
      : T extends object
        ? { [K in keyof T]: Localize<T[K]> }
        : T;

function isLocalized(value: object): value is Localized<unknown> {
  const keys = Object.keys(value);
  return keys.length === 2 && "de" in value && "en" in value;
}

/** Recursively replaces every `{ de, en }` pair in `value` with the given language. */
export function localize<T>(value: T, locale: Locale): Localize<T> {
  if (Array.isArray(value)) {
    return value.map((item) => localize(item, locale)) as Localize<T>;
  }
  if (typeof value === "object" && value !== null) {
    if (isLocalized(value))
      return localize(value[locale], locale) as Localize<T>;
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        key,
        localize(child, locale),
      ]),
    ) as Localize<T>;
  }
  return value as Localize<T>;
}
