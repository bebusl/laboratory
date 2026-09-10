import { expect, test } from '@playwright/test';

test('renders the complex form lab navigation', async ({ page }) => {
  await page.goto('/complex-form');

  await expect(page.getByLabel('저장 상태')).toBeVisible();
});
