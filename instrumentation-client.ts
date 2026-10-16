import * as Sentry from "@sentry/nextjs";
import { dataCollection, sentryDsn, tunnelPath } from "@/lib/monitoring";

// Errors only (D5): no tracing (no `tracesSampleRate`), no replays, no logs,
// no personal data. Reports go through the same-origin tunnel.
Sentry.init({
  dsn: sentryDsn,
  enabled: Boolean(sentryDsn),
  tunnel: tunnelPath,
  dataCollection,
  // Logs only come from `Sentry.logger`, which the site never calls; drop any.
  beforeSendLog: () => null,
  // Session tracking would send a report on every page load, not only on errors.
  integrations: (defaults) =>
    defaults.filter((integration) => integration.name !== "BrowserSession"),
});
