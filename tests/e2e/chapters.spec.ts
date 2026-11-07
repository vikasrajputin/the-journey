import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const slugs = ["before-everything", "planet-earth", "first-life", "diversification", "age-of-giants", "human-story", "civilisation", "age-of-ideas", "world-we-built", "you"];

for (const slug of slugs) {
  test(`chapter ${slug} renders from content with no accessibility violations`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      // Photos and films load from Wikimedia, which this test sandbox may not reach.
      const remote = m.text().startsWith("Failed to load resource") && /wikimedia\.org/.test(m.location().url);
      if (m.type() === "error" && !remote) errors.push(m.text());
    });
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
  // Let the scroll and any late layout (hero media, fonts) settle before measuring.
  await expect.poll(async () => { const a = await page.evaluate(() => window.scrollY); await page.waitForTimeout(150); return a === (await page.evaluate(() => window.scrollY)); }).toBe(true);
  // And let the section's reveal transition finish, so the click lands on a still target.
  await term.evaluate((el) => Promise.all((el.closest("[data-reveal]") ?? el).getAnimations({ subtree: true }).map((a) => a.finished)));
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

test("reading progress advances and the home page offers to continue", async ({ page, isMobile }) => {
  await page.goto("/journey/human-story");
  const bar = page.locator(".chapter-progress [style]");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await expect.poll(async () => bar.evaluate((el) => (el as HTMLElement).style.transform)).not.toBe("scaleX(0)");
  if (!isMobile) await expect(page.getByRole("link", { name: "Chapter 6: The Human Story Begins" })).toHaveAttribute("aria-current", "page");
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Continue: Chapter 6/ })).toBeVisible();
});

test("a chapter card grows into its chapter and leaves nothing covering the page", async ({ page }) => {
  await page.goto("/journey");
  await page.getByRole("link", { name: /^Chapter 2 A Planet Is Born/ }).click();
  await expect(page).toHaveURL(/\/journey\/planet-earth$/);
  await expect(page.getByRole("heading", { level: 1, name: "A Planet Is Born" })).toBeVisible();
  await expect(page.locator(".expand-clone")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveAttribute("data-expanding", "");
});

test("each chapter opens with a flight into its era that can be skipped, and is left out when motion is reduced", async ({ page }) => {
  await page.goto("/journey/age-of-giants");
  const warp = page.locator(".warp");
  await expect(warp).toBeVisible();
  await expect(warp).toContainText("252 to 66 million years ago");
  await expect(warp).toContainText("Artist’s impression");
  await page.getByRole("link", { name: "Skip the flight" }).click();
  await expect.poll(() => page.evaluate(() => Math.round(document.getElementById("chapter-start")!.getBoundingClientRect().top))).toBeLessThan(200);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(warp).toBeHidden();
});
