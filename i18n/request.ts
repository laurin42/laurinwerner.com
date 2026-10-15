import { locale as rootLocale } from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// Reading the locale from the root param (instead of the proxy header) keeps
// every page statically renderable.
export default getRequestConfig(async () => {
  const param = await rootLocale();
  const locale = hasLocale(routing.locales, param)
    ? param
    : routing.defaultLocale;

  return {
    locale,
    timeZone: "Europe/Berlin",
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
