import { expect, test } from "@playwright/test";

const selected = (page: import("@playwright/test").Page) => page.locator('.timeline-marker[aria-pressed="true"]');
const announcer = (page: import("@playwright/test").Page) => page.locator(".timeline-explorer p[aria-live]");

test("timeline events can be explored with the keyboard", async ({ page }) => {
  await page.goto("/timeline");
  await expect(selected(page)).toHaveAttribute("aria-label", /13\.8 billion/);
  await selected(page).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#timeline-selected-title")).toHaveText(/Hydrogen and helium/);
  await expect(announcer(page)).toContainText("Event 2 of");
  await page.keyboard.press("End");
  await expect(page.locator("#timeline-selected-title")).toHaveText(/World Wide Web/);
  await expect(page.locator(":focus")).toHaveAttribute("aria-label", /World Wide Web/);
  // Only the selected marker is in the tab order.
  await expect(page.locator('.timeline-marker[tabindex="0"]')).toHaveCount(1);
});

test("zoom levels change the scale and say how many events are shown", async ({ page }) => {
  await page.goto("/timeline");
  await page.getByRole("button", { name: "Human history" }).click();
  await expect(page.getByRole("button", { name: "Human history" })).toHaveAttribute("aria-pressed", "true");
  await expect(announcer(page)).toContainText("Human history view");
  await expect(page.locator("#timeline-selected-title")).toHaveText(/Göbekli Tepe/);
  await page.getByRole("button", { name: "Later event" }).click();
  await expect(page.locator("#timeline-selected-title")).toHaveText(/Farming begins/);
});

test("a chapter link opens the timeline at that chapter", async ({ page }) => {
  await page.goto("/journey/age-of-giants");
  await page.getByRole("link", { name: /See this chapter on the full timeline/ }).click();
  await expect(page).toHaveURL(/chapter=age-of-giants/);
  await expect(page.locator("#timeline-selected-title")).toHaveText(/first dinosaurs/i);
  await expect(page.getByText("Highlighting Chapter 5")).toBeVisible();
});

test("without JavaScript the timeline is a complete text list", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/timeline");
  await expect(page.locator(".timeline-explorer")).toBeHidden();
  await expect(page.locator('li[id^="event-"]')).toHaveCount(35);
  await expect(page.getByRole("table")).toContainText("230,000 times wider");
  await context.close();
});
