import { expect, type Page, test } from "@playwright/test";

// Head tags and metadata routes do not depend on the viewport.
test.skip(({ isMobile }) => isMobile, "desktop only");

/** Path of an absolute URL: the base URL is set at build time, not here. */
const pathOf = (url: string | null) => (url ? new URL(url).pathname : null);

/** Width and height from a PNG's IHDR chunk. */
function pngSize(body: Buffer) {
  expect(body.subarray(1, 4).toString()).toBe("PNG");
  return { width: body.readUInt32BE(16), height: body.readUInt32BE(20) };
}

async function meta(page: Page, selector: string) {
  return page.locator(selector).first().getAttribute("content");
}

const pages = [
  {
    path: "/",
    title: "Laurin Werner – Frontend-Entwickler in Düsseldorf",
    alternates: { de: "/", en: "/en", "x-default": "/" },
    jsonLd: "Person",
  },
  {
    path: "/en",
    title: "Laurin Werner – Frontend Developer in Düsseldorf",
    alternates: { de: "/", en: "/en", "x-default": "/" },
    jsonLd: "Person",
  },
  {
    path: "/projects/burchartz",
    title: "BurchARTz – Laurin Werner",
    alternates: {
      de: "/projects/burchartz",
      en: "/en/projects/burchartz",
      "x-default": "/projects/burchartz",
    },
    jsonLd: "CreativeWork",
  },
  {
    path: "/en/projects/praxis-werner",
    title: "Praxis Janis Werner – Laurin Werner",
    alternates: {
      de: "/projects/praxis-werner",
      en: "/en/projects/praxis-werner",
      "x-default": "/projects/praxis-werner",
    },
    jsonLd: "CreativeWork",
  },
];

test.describe("page metadata", () => {
  for (const expected of pages) {
    test(`is complete on ${expected.path}`, async ({ page, request }) => {
      await page.goto(expected.path);
      await expect(page).toHaveTitle(expected.title);

      const description = await meta(page, 'meta[name="description"]');
      expect(description?.length).toBeGreaterThan(50);
      expect(description).not.toContain("TODO");

      const canonical = page.locator('link[rel="canonical"]');
      expect(pathOf(await canonical.getAttribute("href"))).toBe(expected.path);
      for (const [lang, path] of Object.entries(expected.alternates)) {
        const link = page.locator(`link[rel="alternate"][hreflang="${lang}"]`);
        expect(pathOf(await link.getAttribute("href"))).toBe(path);
      }

      expect(await meta(page, 'meta[property="og:title"]')).toBeTruthy();
      expect(pathOf(await meta(page, 'meta[property="og:url"]'))).toBe(
        expected.path,
      );
      expect(await meta(page, 'meta[property="og:image:alt"]')).toBeTruthy();
      expect(await meta(page, 'meta[name="twitter:card"]')).toBe(
        "summary_large_image",
      );

      // The share image loads under its own URL, without a redirect.
      const image = new URL((await meta(page, 'meta[property="og:image"]'))!);
      const response = await request.get(image.pathname + image.search, {
        maxRedirects: 0,
      });
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toBe("image/png");
      expect(pngSize(await response.body())).toEqual({
        width: 1200,
        height: 630,
      });

      const jsonLd = JSON.parse(
        (await page
          .locator('script[type="application/ld+json"]')
          .textContent())!,
      );
      expect(jsonLd["@context"]).toBe("https://schema.org");
      expect(jsonLd["@type"]).toBe(expected.jsonLd);
      expect(JSON.stringify(jsonLd)).not.toContain("TODO");
    });
  }

  test("unknown pages are not indexed", async ({ page }) => {
    await page.goto("/gibt-es-nicht");
    expect(await meta(page, 'meta[name="robots"]')).toBe("noindex");
  });
});

test.describe("metadata routes", () => {
  test("robots.txt allows crawling and points to the sitemap", async ({
    request,
  }) => {
    const body = await (await request.get("/robots.txt")).text();
    expect(body).toContain("Allow: /");
    expect(body).toMatch(/Sitemap: .*\/sitemap\.xml/);
  });

  test("the sitemap lists every page in both languages", async ({
    request,
  }) => {
    const body = await (await request.get("/sitemap.xml")).text();
    const urls = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
      pathOf(m[1]!),
    );
    expect(urls).toHaveLength(10);
    expect(urls).toEqual(
      expect.arrayContaining(["/", "/en", "/projects/burchartz"]),
    );
    expect(body).toContain('hreflang="x-default"');
  });

  test("icons and the manifest are served", async ({ page, request }) => {
    await page.goto("/");
    const icons = await page
      .locator('link[rel="icon"], link[rel="apple-touch-icon"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
    expect(icons.length).toBeGreaterThanOrEqual(4);
    for (const href of icons) {
      const response = await request.get(href, { maxRedirects: 0 });
      expect(response.status(), href).toBe(200);
      expect(response.headers()["content-type"]).toMatch(/^image\//);
    }

    const manifest = await (await request.get("/manifest.webmanifest")).json();
    expect(manifest.name).toContain("Laurin Werner");
    for (const icon of manifest.icons) {
      const response = await request.get(icon.src, { maxRedirects: 0 });
      expect(response.status(), icon.src).toBe(200);
      expect(pngSize(await response.body())).toEqual({
        width: Number(icon.sizes.split("x")[0]),
        height: Number(icon.sizes.split("x")[1]),
      });
    }
  });
});
