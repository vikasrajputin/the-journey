import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const slugs = ["before-everything", "planet-earth", "first-life", "diversification", "age-of-giants", "human-story", "civilisation", "age-of-ideas", "world-we-built", "you"];

for (const slug of slugs) {
  test(`chapter ${slug} renders from content with no accessibility violations`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto(`/journey/${slug}`);
    await expect(page.locator("h1")).toHaveCount(1);
    expect(await page.locator("article section h2").count()).toBeGreaterThanOrEqual(3);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("glossary term opens a definition without moving the page, and Escape closes it", async ({ page }) => {
  await page.goto("/journey/before-everything");
  const term = page.getByRole("button", { name: /redshift: show definition/ }).first();
  await term.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => window.scrollY);
  await term.click();
  const panel = page.locator("#glossary-redshift");
  await expect(panel).toBeVisible();
  await expect(panel).toContainText("stretching of light");
  // Opening a definition must not jump the page (allow sub-line rounding from the click itself).
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThanOrEqual(4);
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
});

test("source marker opens the sources for a passage with external links", async ({ page }) => {
  await page.goto("/journey/age-of-giants");
  await page.getByRole("button", { name: /Sources for this passage/ }).first().click();
  const panel = page.locator("[popover]:popover-open");
  await expect(panel).toBeVisible();
  const link = panel.getByRole("link").first();
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("href", /^https:\/\//);
});

test("chapters link forward and back", async ({ page }) => {
  await page.goto("/journey/first-life");
  await page.getByRole("link", { name: /Next · Chapter 4/ }).click();
  await expect(page).toHaveURL(/\/journey\/diversification$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/journey\/first-life$/);
});
