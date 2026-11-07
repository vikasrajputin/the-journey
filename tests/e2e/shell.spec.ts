import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const isRemoteMediaFailure = (msg: { text(): string; location(): { url: string } }) =>
  msg.text().startsWith("Failed to load resource") && /wikimedia\.org/.test(msg.location().url);

const routes = ["/", "/journey", "/journey/before-everything", "/journey/you", "/timeline", "/evidence", "/sources", "/about", "/glossary", "/search"];

for (const route of routes) {
  test(`${route} loads without console errors or accessibility violations`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      // Photos and films load from Wikimedia, which this test sandbox may not reach.
      if (msg.type() === "error" && !isRemoteMediaFailure(msg)) errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main#main")).toBeVisible();

    // No horizontal overflow at this viewport.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("unknown routes show the custom 404", async ({ page }) => {
  const response = await page.goto("/journey/not-a-chapter");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "This part of the map is empty" })).toBeVisible();
});

test("skip link moves focus to the main content", async ({ page }) => {
  await page.goto("/about");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("content is visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Before Everything" })).toBeVisible();
  await expect(page.locator(".scene-caption", { hasText: "13.8 billion years ago, everything you can see" })).toBeVisible();
  await expect(page.getByRole("link", { name: "ten chapters", exact: true })).toBeVisible();
  await context.close();
});

test("motion preference can be reduced and is remembered", async ({ page, isMobile }) => {
  await page.goto("/about");
  if (isMobile) await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("button", { name: "Reduce motion" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");
});

test("mobile menu opens, navigates and closes with Escape", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/about");
  await page.getByRole("button", { name: "Menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Site menu" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await page.getByRole("button", { name: "Menu" }).click();
  await dialog.getByRole("link", { name: /The Age of Giants/ }).click();
  await expect(page).toHaveURL(/\/journey\/age-of-giants$/);
  await expect(dialog).toBeHidden();
});

test("no page scrolls sideways from phone to wide desktop", async ({ browser }) => {
  const pages = ["/", "/timeline", "/evidence", "/sources", "/journey/civilisation", "/search?q=moon"];
  for (const width of [360, 768, 1024, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    for (const route of pages) {
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${route} at ${width}px`).toBeLessThanOrEqual(0);
    }
    await context.close();
  }
});

test("each scene labels what is real and opens its proof", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Enter in silence" }).click();
  const scene = page.locator("#beginning");
  await expect(scene.locator(".scene-see")).toContainText("Simulation");
  await scene.getByRole("button", { name: /How do we know/ }).click();
  const proof = page.getByRole("dialog", { name: "Before Everything" });
  await expect(proof).toBeVisible();
  await expect(proof.getByRole("link", { name: "WMAP Overview" })).toHaveAttribute("href", /nasa\.gov/);
  await proof.getByRole("button", { name: "Close" }).click();
  await expect(proof).toBeHidden();
});
