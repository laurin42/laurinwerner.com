import { expect, type Page, test } from "@playwright/test";

/** Opens the mobile menu, retrying in case the click lands before hydration. */
async function openMobileMenu(page: Page) {
  await expect(async () => {
    await page
      .getByRole("button", { name: "Menü öffnen" })
      .click({ timeout: 1000 });
    await expect(
      page.getByRole("button", { name: "Menü schließen" }),
    ).toHaveAttribute("aria-expanded", "true", { timeout: 1000 });
  }).toPass();
}

test.describe("i18n routing", () => {
  test("German is served without prefix, English under /en", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await expect(
      page.getByRole("link", { name: "Zum Inhalt springen" }),
    ).toBeAttached();

    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(
      page.getByRole("link", { name: "Skip to content" }),
    ).toBeAttached();
  });

  test("the /de prefix redirects to the unprefixed URL", async ({ page }) => {
    await page.goto("/de");
    await expect(page).toHaveURL("/");
  });

  test("the language switch keeps the current path", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL("/en");
    await page.getByRole("link", { name: "Deutsch" }).click();
    await expect(page).toHaveURL("/");

    // Any path is kept, including ones without a page yet.
    await page.goto("/gibt-es-nicht");
    await expect(page.getByRole("link", { name: "English" })).toHaveAttribute(
      "href",
      "/en/gibt-es-nicht",
    );
  });

  test("unknown paths return a localized 404", async ({ page }) => {
    const de = await page.goto("/gibt-es-nicht");
    expect(de?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Seite nicht gefunden",
    );

    const en = await page.goto("/en/does-not-exist");
    expect(en?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Page not found",
    );
  });
});

test.describe("layout", () => {
  test("renders without console errors or hydration warnings", async ({
    page,
  }) => {
    const problems: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" || /hydrat/i.test(message.text())) {
        problems.push(message.text());
      }
    });
    page.on("pageerror", (error) => problems.push(error.message));

    for (const path of ["/", "/en"]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
    }
    expect(problems).toEqual([]);
  });

  test("the skip link is the first focusable element and moves focus to main", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Zum Inhalt springen" });
    await expect(skipLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });

  test("the theme toggle switches between light and dark", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveClass(/light/);

    await page.getByRole("button", { name: "Farbschema wechseln" }).click();
    await expect(html).toHaveClass(/dark/);
    await page.getByRole("button", { name: "Farbschema wechseln" }).click();
    await expect(html).toHaveClass(/light/);
  });

  test("footer links to the legal page in the current language", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Impressum" })).toHaveAttribute(
      "href",
      "/legal#imprint",
    );
    await page.goto("/en");
    await expect(
      page.getByRole("link", { name: "Legal notice" }),
    ).toHaveAttribute("href", "/en/legal#imprint");
  });
});

test.describe("desktop navigation", () => {
  test.skip(({ isMobile }) => isMobile, "desktop only");

  test("anchor links target the localized sections", async ({ page }) => {
    await page.goto("/en");
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await nav.getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL("/en#projects");
    await expect(page.locator("#projects")).toBeInViewport();
  });

  test("is fully reachable by keyboard", async ({ page }) => {
    await page.goto("/");
    const expected = [
      "Zum Inhalt springen",
      "Laurin Werner",
      "Projekte",
      "Über mich",
      "Werdegang",
      "Kontakt",
      "English",
      "Farbschema wechseln",
    ];
    for (const name of expected) {
      await page.keyboard.press("Tab");
      await expect(page.locator(":focus")).toHaveAccessibleName(name);
    }
  });
});

test.describe("mobile menu", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile only");

  test("opens, traps focus and closes with Escape", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Menü öffnen" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await openMobileMenu(page);

    const close = page.getByRole("button", { name: "Menü schließen" });
    await expect(close).toHaveAttribute("aria-expanded", "true");
    const menu = page.getByRole("navigation", { name: "Hauptnavigation" });
    await expect(menu.getByRole("link", { name: "Projekte" })).toBeFocused();

    // Tab past the last link wraps around to the toggle button.
    for (let i = 0; i < 4; i++) await page.keyboard.press("Tab");
    await expect(close).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(menu.getByRole("link", { name: "Kontakt" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test("closes after choosing a link", async ({ page }) => {
    await page.goto("/");
    await openMobileMenu(page);
    const menu = page.getByRole("navigation", { name: "Hauptnavigation" });
    await menu.getByRole("link", { name: "Werdegang" }).click();
    await expect(page).toHaveURL("/#werdegang");
    await expect(menu).toBeHidden();
  });
});
