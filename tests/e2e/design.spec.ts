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

  test("hero name flies into the header name and back", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const headerName = page.locator("[data-header-name]");
    const heroWord = page.locator("#hero-name [data-name-word]").first();
    const logoWord = headerName.locator("[data-name-word]").first();
    await expect(headerName).toBeHidden();
    await expect(heroWord).toHaveCSS("opacity", "1");

    // The morph starts once the CSS hero entrance has finished.
    await page.waitForFunction(() =>
      document
        .getAnimations()
        .every((animation) => animation.playState === "finished"),
    );
    const resting = () =>
      logoWord.evaluate((el) =>
        ["none", "matrix(1, 0, 0, 1, 0, 0)"].includes(
          getComputedStyle(el).transform,
        ),
      );

    // Once the hero name slides under the header, the logo takes over and its
    // words fly from the hero into place.
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(headerName).toBeVisible();
    await expect(heroWord).toHaveCSS("opacity", "0");
    expect(await resting()).toBe(false);
    await expect.poll(resting).toBe(true);

    // Back to the top: the words fly back and the hero shows its name again.
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(headerName).toBeHidden();
    await expect(heroWord).toHaveCSS("opacity", "1");

    await page.goto("/projects/burchartz");
    await expect(headerName).toBeVisible();
  });

  test("with reduced motion the header name just appears", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const headerName = page.locator("[data-header-name]");
    await expect(headerName).toBeHidden();
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(headerName).toBeVisible();
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
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

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the header name is always visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-header-name]")).toBeVisible();
  });
});

test.describe("hero", () => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1280, height: 720 },
    { width: 390, height: 844 },
  ]) {
    test(`fills the first screen at ${viewport.width}×${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await expect(page.locator("#projekte-heading")).not.toBeInViewport();
    });
  }
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
