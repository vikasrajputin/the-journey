import { expect, test } from "@playwright/test";

test("plays level 1 with the keyboard, answers the quiz and moves on", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Play" }).click();
  await expect(page.getByText("Level 1/7")).toBeVisible({ timeout: 5000 });
  await page.locator(".game").focus();
  await page.keyboard.down("Space");
  await page.waitForTimeout(2300);
  await page.keyboard.up("Space");
  await expect(page.getByRole("heading", { name: "Space is born!" })).toBeVisible({ timeout: 6000 });
  await page.getByRole("button", { name: "About 13.8 billion years" }).click();
  await expect(page.getByText(/^Yes!/)).toBeVisible();
  await page.getByRole("button", { name: /Next level/ }).click();
  await expect(page.getByText("Level 2/7")).toBeVisible({ timeout: 5000 });
});

test("Learn more shows the details and the sources", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Play" }).click();
  await page.getByRole("button", { name: "Learn more about this level" }).click();
  const panel = page.getByRole("dialog", { name: "The Big Bang" });
  await expect(panel).toBeVisible();
  await expect(panel.getByRole("link", { name: "WMAP Overview" })).toHaveAttribute("href", /nasa\.gov/);
  await panel.getByRole("button", { name: "Close" }).click();
  await expect(panel).toBeHidden();
});

test("levels unlock in order and progress is remembered", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pick a level" }).click();
  await expect(page.getByRole("button", { name: /The Big Bang/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /Space Stretches/ })).toBeDisabled();
  await page.getByRole("button", { name: /The Big Bang/ }).click();
  await page.getByRole("button", { name: "Skip" }).click();
  await page.getByRole("button", { name: "Level map" }).click();
  await page.reload();
  await page.getByRole("button", { name: "Pick a level" }).click();
  await expect(page.getByRole("button", { name: /Space Stretches/ })).toBeEnabled();
});
