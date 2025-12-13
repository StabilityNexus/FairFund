import { test, expect } from '@playwright/test';

test('homepage shows brand', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('text=FairFund')).toBeVisible();
});
