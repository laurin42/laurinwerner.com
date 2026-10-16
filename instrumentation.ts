import * as Sentry from "@sentry/nextjs";
import { dataCollection, sentryDsn } from "@/lib/monitoring";

// Server errors go straight from the server to GlitchTip. Same rules as in the
// browser (instrumentation-client.ts): errors only, no personal data.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  Sentry.init({
    dsn: sentryDsn,
    enabled: Boolean(sentryDsn),
    dataCollection,
    beforeSendLog: () => null,
    // Release-health sessions would report every request, not only errors.
    integrations: [Sentry.httpIntegration({ sessions: false })],
  });
}

/** Errors thrown while rendering or in route handlers. */
export const onRequestError = Sentry.captureRequestError;
