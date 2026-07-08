import { test, expect } from '@playwright/test';

test('/ serves Chinese with lang=zh', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh');
  await expect(page.locator('[data-testid="site-header"]')).toContainText('云南海归包车');
});

test('/en/ serves English with lang=en', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('[data-testid="site-header"]')).toContainText('Yunnan Turtle Charter');
});

test('hreflang alternates link zh and en on both locales', async ({ page }) => {
  for (const path of ['/', '/en/']) {
    await page.goto(path);
    await expect(page.locator('link[rel="alternate"][hreflang="zh"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
  }
});

test('every page has a title and meta description', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/.+/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
});
