import { envelopeUrl, sentryDsn } from "@/lib/monitoring";

/** Error reports are small; anything larger is not ours. */
const MAX_BYTES = 256 * 1024;

/**
 * Tunnel for browser error reports: the browser posts to this same-origin
 * route, the server forwards to GlitchTip. So the browser never contacts a
 * third party, and GlitchTip never sees the visitor's IP address.
 *
 * Only envelopes for our own DSN are forwarded, so the route cannot be used
 * to relay anything else. (The SDK's `tunnelRoute` option only rewrites to
 * sentry.io, hence this handler.)
 */
export async function POST(request: Request) {
  const target = sentryDsn && envelopeUrl(sentryDsn);
  if (!target) return new Response(null, { status: 404 });

  const envelope = await request.text();
  if (envelope.length > MAX_BYTES) return new Response(null, { status: 413 });

  let dsn: unknown;
  try {
    dsn = JSON.parse(envelope.slice(0, envelope.indexOf("\n")))?.dsn;
  } catch {
    return new Response(null, { status: 400 });
  }
  if (dsn !== sentryDsn) return new Response(null, { status: 400 });

  try {
    const response = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/x-sentry-envelope" },
      body: envelope,
    });
    return new Response(null, { status: response.status });
  } catch {
    return new Response(null, { status: 502 });
  }
}
