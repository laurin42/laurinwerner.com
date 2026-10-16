"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/**
 * Last-resort error page, when even the root layout fails: it replaces the
 * whole document, so it has no site styles, fonts or locale. Reports the error
 * to GlitchTip (render errors in the browser are not reported otherwise).
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          padding: "4rem 1.25rem",
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1.5,
        }}
      >
        <title>Fehler · Error – Laurin Werner</title>
        <h1>Etwas ist schiefgelaufen.</h1>
        <p lang="en">Something went wrong.</p>
        <button type="button" onClick={() => retry()}>
          Erneut versuchen · <span lang="en">Try again</span>
        </button>
      </body>
    </html>
  );
}
