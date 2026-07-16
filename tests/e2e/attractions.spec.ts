import { test, expect } from '@playwright/test';

async function assertLoaded(img: import('@playwright/test').Locator) {
  await expect(img).toHaveJSProperty('complete', true);
  expect(await img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  expect((await img.getAttribute('alt'))?.trim().length ?? 0).toBeGreaterThan(0);
}

// ---- Attractions listing ----
test('/attractions lists attraction cards with loaded images and alt text', async ({ page }) => {
  await page.goto('/attractions');
  const cards = page.locator('[data-testid="attraction-card"]');
  await expect(cards).toHaveCount(7);
  await expect(page.locator('body')).toContainText('洱海');
  await expect(page.locator('body')).toContainText('虎跳峡');
  await expect(page.locator('body')).toContainText('格姆女神山');

  const imgs = page.locator('[data-testid="attraction-card"] img');
  await expect(imgs).toHaveCount(7);
  for (let i = 0; i < 7; i++) await assertLoaded(imgs.nth(i));
});

test('/en/attractions renders English names and lang=en', async ({ page }) => {
  await page.goto('/en/attractions');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('body')).toContainText('Tiger Leaping Gorge');
  await expect(page.locator('body')).toContainText('Pudacuo');
});

// ---- Highlights as photo tiles on the route detail page ----
test('route highlights render as photo tiles', async ({ page }) => {
  await page.goto('/routes/kunming-dali-lijiang-lugu-lake');
  // All four highlights (洱海/玉龙雪山/泸沽湖/格姆女神山) match attractions → four images.
  const tiles = page.locator('.highlights .highlight__media');
  await expect(tiles).toHaveCount(4);
  const imgs = page.locator('.highlights img.highlight__media');
  await expect(imgs).toHaveCount(4);
  for (let i = 0; i < 4; i++) await assertLoaded(imgs.nth(i));
});

test('an unmatched highlight falls back to a text tile', async ({ page }) => {
  await page.goto('/routes/dali-day-charter');
  // 洱海 + 喜洲古镇 match (images); 双廊 has no attraction → text-only tile.
  await expect(page.locator('.highlights img.highlight__media')).toHaveCount(2);
  await expect(page.locator('.highlights .highlight__name', { hasText: '双廊' })).toHaveCount(1);
});

// ---- Structured day-by-day itinerary with photos ----
test('itinerary renders day rows with place photos', async ({ page }) => {
  await page.goto('/routes/kunming-dali-lijiang-lugu-lake');
  const days = page.locator('.day-list .day');
  await expect(days).toHaveCount(6); // six-day loop
  await expect(page.locator('.day-list')).toContainText('第 1 天');
  // Five of six days reference a place → five loaded images (day 6 「返程」 has none).
  const dayImgs = page.locator('.day-list img.day__img');
  await expect(dayImgs).toHaveCount(5);
  for (let i = 0; i < 5; i++) await assertLoaded(dayImgs.nth(i));
});

test('/en itinerary uses English day labels', async ({ page }) => {
  await page.goto('/en/routes/kunming-dali-lijiang-lugu-lake');
  await expect(page.locator('.day-list')).toContainText('Day 1');
  await expect(page.locator('.day-list')).toContainText('Arrive Kunming');
});

// ---- Navigation ----
test('primary nav links to attractions', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-testid="primary-nav"] a[href="/attractions"]')).toHaveCount(1);
});
