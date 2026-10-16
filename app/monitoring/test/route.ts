// Read the switch at request time, not at build time.
export const dynamic = "force-dynamic";

/**
 * Throws a deliberate server error, to check that reports reach GlitchTip.
 * Off unless the server runs with MONITORING_TEST=enabled (.env.example);
 * otherwise a plain 404.
 */
export function GET() {
  if (process.env.MONITORING_TEST !== "enabled") {
    return new Response(null, { status: 404 });
  }
  throw new Error("GlitchTip test error (MONITORING_TEST=enabled)");
}
