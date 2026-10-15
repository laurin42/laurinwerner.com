import { expect, type Page, test } from "@playwright/test";

const slugs = [
  "praxis-werner",
  "burchartz",
  "wetterstrucksi",
  "burnheart-mockery",
];

async function expectSingleH1(page: Page) {
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
}

test.describe("homepage", () => {
  test("shows all sections in both languages", async ({ page }) => {
    await page.goto("/");
    await expectSingleH1(page);
    for (const name of ["Projekte", "Über mich", "Werdegang", "Kontakt"]) {
      await expect(page.getByRole("region", { name })).toBeVisible();
    }

    await page.goto("/en");
    await expectSingleH1(page);
    for (const name of ["Projects", "About", "Experience", "Contact"]) {
      await expect(page.getByRole("region", { name })).toBeVisible();
    }
  });

  test("project cards link to the case studies", async ({ page }) => {
    await page.goto("/en");
    const projects = page.getByRole("region", { name: "Projects" });
    await expect(projects.getByRole("article")).toHaveCount(slugs.length);
    await projects.getByRole("link", { name: "BurchARTz" }).click();
    await expect(page).toHaveURL("/en/projects/burchartz");
  });

  test("every image has a non-empty alt text", async ({ page }) => {
    for (const path of [
      "/",
      "/en",
      ...slugs.map((slug) => `/projects/${slug}`),
    ]) {
      await page.goto(path);
      for (const image of await page.locator("img").all()) {
        expect(await image.getAttribute("alt")).toBeTruthy();
      }
    }
  });
});

test.describe("case studies", () => {
  for (const slug of slugs) {
    test(`${slug} renders its sections`, async ({ page }) => {
      await page.goto(`/projects/${slug}`);
      await expectSingleH1(page);
      for (const name of ["Ausgangslage", "Lösung", "Highlights"]) {
        await expect(page.getByRole("region", { name })).toBeVisible();
      }
    });
  }

  test("'next project' cycles through all projects", async ({ page }) => {
    await page.goto(`/en/projects/${slugs[0]}`);
    for (const slug of [...slugs.slice(1), slugs[0]]) {
      await page
        .getByRole("navigation", { name: "Next project" })
        .getByRole("link")
        .click();
      await expect(page).toHaveURL(`/en/projects/${slug}`);
    }
  });

  test("an unknown slug returns 404", async ({ page }) => {
    const response = await page.goto("/projects/gibt-es-nicht");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Seite nicht gefunden",
    );
  });

  test("external links do not leak opener or referrer", async ({ page }) => {
    await page.goto("/projects/burchartz");
    const live = page.getByRole("link", { name: "Website ansehen" });
    await expect(live).toHaveAttribute("href", "https://lennartburchartz.de");
    await expect(live).toHaveAttribute("rel", "noopener noreferrer");
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the homepage content is visible", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Laurin Werner" }),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: "Projekte" }).getByRole("article"),
    ).toHaveCount(slugs.length);
    await expect(page.getByText("Praktikum Softwareentwicklung")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "laurin.werner@protonmail.com" }),
    ).toBeVisible();
  });

  test("a case study is visible", async ({ page }) => {
    await page.goto("/en/projects/wetterstrucksi");
    await expect(
      page.getByRole("heading", { level: 1, name: "Wetterstrucksi.de" }),
    ).toBeVisible();
    await expect(
      page.getByText("Migration from WordPress to headless Ghost", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.getByRole("img").first()).toBeVisible();
  });
});
