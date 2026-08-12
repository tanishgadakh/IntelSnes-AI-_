// Minimal Playwright test example (requires Playwright installation)
const { test, expect } = require('@playwright/test');

test('assistant page loads and shows model center link', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page).toHaveTitle(/IntelSense/);
});
