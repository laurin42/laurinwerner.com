import { afterEach, describe, expect, it, vi } from "vitest";
import { envelopeUrl } from "@/lib/monitoring";

const DSN = "https://publickey@errors.example.com/7";

describe("envelopeUrl", () => {
  it("points to the DSN's project envelope endpoint", () => {
    expect(envelopeUrl(DSN)).toBe("https://errors.example.com/api/7/envelope/");
    expect(envelopeUrl("https://key@example.com/glitchtip/3")).toBe(
      "https://example.com/glitchtip/api/3/envelope/",
    );
  });

  it("rejects malformed DSNs", () => {
    expect(envelopeUrl("not a url")).toBeNull();
    expect(envelopeUrl("https://key@example.com/")).toBeNull();
  });
});

describe("tunnel route", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  async function tunnel(dsn: string | undefined) {
    vi.stubEnv("NEXT_PUBLIC_SENTRY_DSN", dsn ?? "");
    vi.resetModules();
    const fetch = vi.fn(async () => new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetch);
    const { POST } = await import("@/app/monitoring/route");
    const post = (body: string, headers: Record<string, string> = {}) =>
      POST(
        new Request("http://localhost/monitoring", {
          method: "POST",
          body,
          headers,
        }),
      );
    return { post, fetch };
  }

  const envelope = (dsn: string) =>
    `${JSON.stringify({ dsn })}\n{"type":"event"}\n{"message":"x"}`;

  it("forwards envelopes for our DSN, without the visitor's headers", async () => {
    const { post, fetch } = await tunnel(DSN);
    const response = await post(envelope(DSN), {
      "x-forwarded-for": "203.0.113.9",
      cookie: "a=b",
    });
    expect(response.status).toBe(200);
    expect(fetch).toHaveBeenCalledOnce();
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://errors.example.com/api/7/envelope/");
    expect(init.headers).toEqual({
      "Content-Type": "application/x-sentry-envelope",
    });
  });

  it("relays nothing else", async () => {
    const { post, fetch } = await tunnel(DSN);
    expect((await post(envelope("https://k@attacker.example/1"))).status).toBe(
      400,
    );
    expect((await post("not json")).status).toBe(400);
    expect((await post("x".repeat(300 * 1024))).status).toBe(413);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("is off without a DSN", async () => {
    const { post, fetch } = await tunnel(undefined);
    expect((await post(envelope(DSN))).status).toBe(404);
    expect(fetch).not.toHaveBeenCalled();
  });
});
