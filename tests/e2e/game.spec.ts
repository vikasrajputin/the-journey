import { expect, test } from "@playwright/test";

test("begins the journey and drifts into the first moment", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Begin the journey" }).click();
  await expect(page.getByRole("navigation", { name: "Moments in time" })).toBeVisible();
  // no levels, scores or quizzes any more
  await expect(page.getByText(/Level \d/)).toHaveCount(0);
  await page.getByRole("button", { name: "Forward in time" }).click();
  await expect(page.getByRole("heading", { name: "The Big Bang" })).toBeVisible({ timeout: 15000 });
});

test("the timeline jumps through time", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Begin the journey" }).click();
  await page.getByRole("button", { name: "The First Stars" }).click();
  await expect(page.getByRole("heading", { name: "The First Stars" })).toBeVisible({ timeout: 15000 });
  await page.getByRole("button", { name: "Back in time" }).click();
  await expect(page.getByRole("heading", { name: "The Fog Clears" })).toBeVisible({ timeout: 15000 });
});

test("Learn more shows the details and the sources", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Begin the journey" }).click();
  await page.getByRole("button", { name: "Forward in time" }).click();
  await page.getByRole("button", { name: "Learn more about The Big Bang" }).click({ timeout: 15000 });
  const panel = page.getByRole("dialog", { name: "The Big Bang" });
  await expect(panel).toBeVisible();
  await expect(panel.getByRole("link", { name: "WMAP Overview" })).toHaveAttribute("href", /nasa\.gov/);
  await panel.getByRole("button", { name: "Close" }).click();
  await expect(panel).toBeHidden();
});
