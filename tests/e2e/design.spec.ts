import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const pages = [
  "/",
  "/en",
  "/projects/praxis-werner",
  "/en/projects/burchartz",
  "/projects/wetterstrucksi",
  "/en/projects/burnheart-mockery",
  "/gibt-es-nicht",
];

/** Scrolls to the bottom in steps, so every lazy image and reveal is triggered. */
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (
      let y = 0;
      y < document.body.scrollHeight;
      y += window.innerHeight / 2
    ) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  });
}

test.describe("accessibility", () => {
  // Final colours without entrance animations, which would fade text mid-scan.
  test.use({ reducedMotion: "reduce" });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`no serious or critical axe violations in ${colorScheme} mode`, async ({
      page,
    }) => {
      test.slow();
      await page.emulateMedia({ colorScheme });
      for (const path of pages) {
        await page.goto(path);
        const { violations } = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        const severe = violations
          .filter((v) => v.impact === "serious" || v.impact === "critical")
          .map((v) => `${path}: ${v.id} (${v.nodes.length}×)`);
        expect(severe).toEqual([]);
      }
    });
  }
});

test.describe("motion", () => {
  test("nothing moves with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await scrollThrough(page);
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    for (const element of await page.locator("[data-reveal]").all()) {
      await expect(element).toHaveCSS("opacity", "1");
      await expect(element).toHaveCSS("transform", "none");
    }
  });

  test("reveals content below the fold when it scrolls into view", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const contact = page.locator("#kontakt [data-reveal]").first();
    await expect(contact).toHaveCSS("opacity", "0");
    await contact.scrollIntoViewIfNeeded();
    await expect(contact).toHaveCSS("opacity", "1");
  });

  test("header name appears once the hero name has scrolled away", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const headerName = page.locator("[data-header-name]");
    await expect(headerName).toBeHidden();
    await page.evaluate(() =>
      window.scrollTo(0, document.querySelector("h1")!.offsetHeight + 400),
    );
    await expect(headerName).toBeVisible();
    await expect(headerName).toHaveCSS("opacity", "1");

    await page.goto("/projects/burchartz");
    await expect(headerName).toBeVisible();

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(headerName).toBeVisible();
  });

  test("layout shift stays below 0.05", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    for (const path of ["/", "/projects/burchartz"]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await scrollThrough(page);
      await page.waitForTimeout(1500);
      const cls = await page.evaluate(
        () =>
          new Promise<number>((resolve) => {
            let total = 0;
            new PerformanceObserver((list) => {
              for (const entry of list.getEntries() as unknown as {
                value: number;
                hadRecentInput: boolean;
              }[]) {
                if (!entry.hadRecentInput) total += entry.value;
              }
            }).observe({ type: "layout-shift", buffered: true });
            setTimeout(() => resolve(total), 100);
          }),
      );
      expect(cls, path).toBeLessThan(0.05);
    }
  });
});

test.describe("small screens", () => {
  test.use({ viewport: { width: 320, height: 640 } });

  test("no page scrolls horizontally at 320 px", async ({ page }) => {
    for (const path of pages) {
      await page.goto(path);
      const width = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      expect(width, path).toBeLessThanOrEqual(320);
    }
  });
});
