import { test, expect } from '@playwright/test';

test('/about shows the three sections and links to Contact', async ({ page }) => {
  await page.goto('/about');
  const body = page.locator('body');
  await expect(page.locator('h1')).toContainText('关于我们');
  await expect(body).toContainText('为什么选择我们'); // why choose us
  await expect(body).toContainText('预订流程'); // how it works
  await expect(body).toContainText('纯玩无购物'); // a value prop
  await expect(page.locator('.about a[href="/contact"]')).toHaveCount(1);
});

test('/en/about renders in English and links to /en/contact', async ({ page }) => {
  await page.goto('/en/about');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const body = page.locator('body');
  await expect(page.locator('h1')).toContainText('About us');
  await expect(body).toContainText('Why choose us');
  await expect(body).toContainText('How it works');
  await expect(page.locator('.about a[href="/en/contact"]')).toHaveCount(1);
});
