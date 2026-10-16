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
  "/legal",
  "/en/legal",
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
    const contact = page.locator('#kontakt [data-reveal="rise"]').first();
    await expect(contact).toHaveCSS("opacity", "0");
    await contact.scrollIntoViewIfNeeded();
    await expect(contact).toHaveCSS("opacity", "1");

    // The section heading rises out of its mask into place.
    const heading = page.locator("#kontakt-heading");
    await expect
      .poll(() => heading.evaluate((el) => getComputedStyle(el).transform))
      .toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
    await expect(heading).toBeInViewport();
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
        // Scroll-driven ones (reading progress) never finish.
        .filter((animation) => animation.timeline instanceof DocumentTimeline)
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

  test("the project in focus is in colour, the others grey", async ({
    page,
  }) => {
    await page.goto("/");
    const entries = page.locator("#projekte article");
    await entries.nth(1).scrollIntoViewIfNeeded();
    await page.evaluate(() => {
      const cover = document.querySelectorAll("#projekte article img")[1]!;
      const { top, height } = cover.getBoundingClientRect();
      window.scrollBy(0, top + height / 2 - window.innerHeight / 2);
    });
    await expect(entries.nth(1).locator("img")).toHaveCSS("filter", "none");
    await expect(entries.nth(3).locator("img")).toHaveCSS(
      "filter",
      "grayscale(1)",
    );
  });

  test("a project's cover and title morph into its case study", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const entry = page.locator("#projekte article").nth(1);
    await entry.scrollIntoViewIfNeeded();
    // Let the link prefetch the case study, so it renders in the same commit.
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      const start = Document.prototype.startViewTransition;
      (window as unknown as { morphs: string[] }).morphs = [];
      document.startViewTransition = function (
        this: Document,
        ...args: Parameters<Document["startViewTransition"]>
      ) {
        const transition = start.apply(this, args);
        void transition.ready.then(() => {
          (window as unknown as { morphs: string[] }).morphs.push(
            ...document
              .getAnimations()
              .map(
                (animation) =>
                  (animation.effect as KeyframeEffect).pseudoElement,
              )
              .filter(
                (name): name is string => !!name?.includes("-group(project"),
              ),
          );
        });
        return transition;
      };
    });
    await entry.locator("h3 a").click();
    await expect(page).toHaveURL("/projects/burchartz");
    await expect
      .poll(() =>
        page.evaluate(() =>
          (window as unknown as { morphs: string[] }).morphs.toSorted(),
        ),
      )
      .toEqual([
        "::view-transition-group(project-cover-burchartz)",
        "::view-transition-group(project-title-burchartz)",
      ]);
  });

  test("red accents: last name, reading progress, rule tip", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const name = page.getByRole("heading", { level: 1 });
    await expect(name).toHaveAccessibleName("Laurin Werner");
    await expect(name.locator(".text-accent")).toHaveText("Werner");

    // The progress line grows with the scroll position.
    const progress = page.locator("[data-scroll-progress]");
    const scale = () =>
      progress.evaluate(
        (el) => new DOMMatrix(getComputedStyle(el).transform).a,
      );
    expect(await scale()).toBeLessThan(0.01);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect.poll(scale).toBeGreaterThan(0.99);

    // Once drawn, a rule is plain black again: its red tip has receded.
    const rule = page.locator("#kontakt .rule");
    await expect
      .poll(() =>
        rule.evaluate((el) => getComputedStyle(el).getPropertyValue("--tip")),
      )
      .toBe("100%");
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

  test("project covers are in colour", async ({ page }) => {
    await page.goto("/");
    for (const cover of await page.locator("#projekte img").all())
      await expect(cover).toHaveCSS("filter", "none");
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
