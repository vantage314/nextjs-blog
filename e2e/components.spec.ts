import { test, expect } from '@playwright/test';

test.describe('Components', () => {
  test('should render navigation menu correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('nav a')).toHaveCount(5);
  });

  test('should handle form validation', async ({ page }) => {
    await page.goto('/contact');
    await page.click('button[type="submit"]');
    await expect(page.locator('.error-message')).toBeVisible();
  });

  test('should handle responsive design', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('.mobile-menu')).toBeVisible();
  });
}); 