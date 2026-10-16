import type { init } from "@sentry/nextjs";

/**
 * GlitchTip (Sentry-compatible) configuration shared by browser and server.
 * The DSN comes only from the environment; without it nothing is sent.
 */
export const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN || undefined;

/**
 * What a report may contain beyond the error itself (D5: no personal data).
 * Only the user agent is kept, for browser and OS; no user fields (IP), no
 * cookies, no other headers, no query strings, no bodies, no local variables.
 * The privacy policy (content/legal.ts) describes exactly this.
 */
export const dataCollection = {
  userInfo: false,
  cookies: false,
  httpHeaders: { request: { allow: ["user-agent"] }, response: false },
  httpBodies: [],
  urlQueryParams: false,
  stackFrameVariables: false,
  databaseQueryData: false,
  queues: false,
  graphQL: { document: false, variables: false },
  genAI: { inputs: false, outputs: false },
} satisfies NonNullable<Parameters<typeof init>[0]>["dataCollection"];

/** Same-origin path the browser sends error reports to (see app/monitoring). */
export const tunnelPath = "/monitoring";

/**
 * Where the tunnel forwards an envelope for `dsn`: the DSN's host, its path
 * prefix (if any) and its project id. Returns null for a malformed DSN.
 */
export function envelopeUrl(dsn: string): string | null {
  try {
    const url = new URL(dsn);
    const segments = url.pathname.split("/").filter(Boolean);
    const projectId = segments.pop();
    if (!projectId || !/^\d+$/.test(projectId)) return null;
    const prefix = segments.length > 0 ? `/${segments.join("/")}` : "";
    return `${url.protocol}//${url.host}${prefix}/api/${projectId}/envelope/`;
  } catch {
    return null;
  }
}
