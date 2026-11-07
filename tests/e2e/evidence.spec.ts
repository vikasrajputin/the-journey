import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("the evidence page explains each method and the status labels", async ({ page }) => {
  await page.goto("/evidence");
  for (const name of ["Radiometric dating", "Radiocarbon dating", "Ice and sediment cores", "Ancient DNA and molecular clocks"]) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }
  await page.goto("/evidence#reading-evidence");
  await expect(page.locator("#reading-evidence")).toContainText("Well established");
  await expect(page.locator("#reading-evidence")).toContainText("Debated");
});

test("a chapter's label link lands on the label guide", async ({ page }) => {
  await page.goto("/journey/first-life#evidence");
  await page.getByRole("link", { name: "How to read these labels" }).click();
  await expect(page).toHaveURL(/\/evidence#reading-evidence$/);
  await expect(page.getByRole("heading", { name: "Reading the evidence labels" })).toBeInViewport();
});

test("the source directory groups and filters sources", async ({ page }) => {
  await page.goto("/sources");
  await expect(page.getByRole("heading", { level: 2, name: /Chapter 1:/ })).toBeVisible();
  const all = await page.locator("[data-source-item]:visible").count();
  await page.getByLabel("Filter sources").fill("radiocarbon");
  await expect(page.getByText(/entries match/)).toBeVisible();
  const filtered = await page.locator("[data-source-item]:visible").count();
  expect(filtered).toBeGreaterThan(0);
  expect(filtered).toBeLessThan(all);
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});

test("search finds passages and links to them", async ({ page }) => {
  await page.goto("/search?q=Neanderthals");
  await expect(page.getByRole("searchbox")).toHaveValue("Neanderthals");
  await expect(page.getByText(/results for “Neanderthals”/)).toBeVisible();
  await page.locator(".search-result").first().click();
  await expect(page).not.toHaveURL(/\/search/);
});

test("sitemap and robots are served", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/journey/before-everything");
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
  expect((await request.get("/og.png")).headers()["content-type"]).toContain("image/png");
});
