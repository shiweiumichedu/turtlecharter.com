import { test, expect } from '@playwright/test';

// ---- Destinations listing ----
test('/destinations lists destination cards with images that have alt text', async ({ page }) => {
  await page.goto('/destinations');
  const cards = page.locator('[data-testid="destination-card"]');
  await expect(cards).toHaveCount(6);
  await expect(page.locator('body')).toContainText('大理');
  await expect(page.locator('body')).toContainText('丽江');

  // Every destination image must load and carry non-empty alt text.
  const imgs = page.locator('[data-testid="destination-card"] img');
  await expect(imgs).toHaveCount(6);
  for (let i = 0; i < 6; i++) {
    const img = imgs.nth(i);
    await expect(img).toHaveJSProperty('complete', true);
    expect(await img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    expect((await img.getAttribute('alt'))?.trim().length ?? 0).toBeGreaterThan(0);
  }
});

test('/en/destinations renders English names and lang=en', async ({ page }) => {
  await page.goto('/en/destinations');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('body')).toContainText('Shangri-La');
  await expect(page.locator('body')).toContainText('Kunming');
});

// ---- Covers wired into route surfaces ----
test('route cards show a cover image', async ({ page }) => {
  await page.goto('/routes');
  const cover = page.locator('[data-testid="route-card"] img.media-card__img').first();
  await expect(cover).toHaveJSProperty('complete', true);
  expect(await cover.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  expect((await cover.getAttribute('alt'))?.trim().length ?? 0).toBeGreaterThan(0);
});

test('route detail page shows a hero image', async ({ page }) => {
  await page.goto('/routes/dali-day-charter');
  const hero = page.locator('.route-hero__img');
  await expect(hero).toHaveCount(1);
  expect(await hero.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
});

// ---- Navigation ----
test('primary nav links to destinations', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-testid="primary-nav"] a[href="/destinations"]')).toHaveCount(1);
});
