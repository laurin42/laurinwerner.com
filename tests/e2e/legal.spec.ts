import { expect, test } from "@playwright/test";

test.describe("legal page", () => {
  for (const [path, footer, heading] of [
    ["/", "Impressum", "Impressum"],
    ["/en", "Privacy policy", "Privacy policy"],
  ] as const) {
    test(`the footer link "${footer}" on ${path} reaches its section`, async ({
      page,
    }) => {
      await page.goto(path);
      const legalNav = page.getByRole("contentinfo").getByRole("navigation", {
        name: path === "/" ? "Rechtliches" : "Legal",
      });
      await legalNav.getByRole("link", { name: footer }).click();
      await expect(page).toHaveURL(/\/legal#(imprint|privacy)$/);
      await expect(
        page.getByRole("heading", { level: 2, name: heading }),
      ).toBeInViewport();
    });
  }

  test("is not indexed", async ({ page }) => {
    await page.goto("/legal");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, follow",
    );
  });
});

test.describe("privacy in practice", () => {
  test("no request leaves the site", async ({ page, baseURL }) => {
    const origin = new URL(baseURL!).origin;
    const foreign: string[] = [];
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (url.protocol.startsWith("http") && url.origin !== origin)
        foreign.push(request.url());
    });
    for (const path of ["/", "/en/projects/burchartz", "/legal"]) {
      await page.goto(path);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForLoadState("networkidle");
    }
    expect(foreign).toEqual([]);
  });

  test("no cookies; local storage only for a chosen colour scheme", async ({
    page,
    context,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(await context.cookies()).toEqual([]);
    const storage = () =>
      page.evaluate(() => ({
        local: Object.keys(localStorage),
        session: Object.keys(sessionStorage),
      }));
    expect(await storage()).toEqual({ local: [], session: [] });

    await page
      .getByRole("button", { name: "Farbschema wechseln" })
      .first()
      .click();
    expect(await storage()).toEqual({ local: ["theme"], session: [] });
    expect(await context.cookies()).toEqual([]);
  });
});
