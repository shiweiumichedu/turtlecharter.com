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

test('destination detail page renders the sightseeing map with numbered pins and a legend', async ({ page }) => {
  await page.goto('/destinations/lugu-lake');
  await expect(page.locator('[data-testid="spot-map"]')).toHaveCount(1);
  // Numbered markers render client-side from the spot data (no external tiles needed).
  await expect(page.locator('.spot-map__marker')).toHaveCount(8);
  // Pin numbers are the digest 排名 ranks, so they can have gaps.
  await expect(page.locator('.spot-map__marker', { hasText: /^1$/ })).toHaveCount(1);
  // The legend maps each rank to the spot's localized name.
  const legendItems = page.locator('[data-testid="spot-map-legend"] li');
  await expect(legendItems).toHaveCount(8);
  await expect(legendItems.filter({ hasText: '走婚桥' })).toHaveText(/5\s*走婚桥/);
  await expect(legendItems.filter({ hasText: '里格半岛' })).toHaveText(/3\s*里格半岛/);
  // A distance scale renders so viewers can estimate distances.
  await expect(page.locator('.spot-map .leaflet-control-scale-line')).toHaveText(/\d+\s*(km|m)/);
});

test('email inquiry offers copy buttons for visitors without a mail app', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'clipboard permissions are chromium-only in Playwright');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/destinations/kunming');
  const copyEmail = page.locator('[data-testid="copy-email"]').first();
  const copyTemplate = page.locator('[data-testid="copy-template"]').first();
  await copyEmail.click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('kunming@turtlecharter.com');
  await expect(copyEmail).toHaveText(/已复制/);
  await copyTemplate.click();
  const template = await page.evaluate(() => navigator.clipboard.readText());
  expect(template).toContain('主题：咨询昆明包车行程');
  expect(template).toContain('出行日期：');
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
