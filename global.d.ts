import type { Locale } from "@/i18n/routing";
import type messages from "@/messages/de.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
