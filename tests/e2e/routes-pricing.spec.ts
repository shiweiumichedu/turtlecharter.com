import { test, expect } from '@playwright/test';

// ---- Routes list ----
test('/routes lists route cards with a "from" price', async ({ page }) => {
  await page.goto('/routes');
  const cards = page.locator('[data-testid="route-card"]');
  await expect(cards).toHaveCount(2);
  await expect(page.locator('body')).toContainText('大理环洱海'); // Dali route zh title
  await expect(page.locator('body')).toContainText('¥800'); // Dali "from" (lowest of 800/1300)
  await expect(page.locator('a[href="/routes/dali-day-charter"]')).toHaveCount(1);
});

test('/en/routes renders English titles and lang=en', async ({ page }) => {
  await page.goto('/en/routes');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('body')).toContainText('Dali Erhai Lake Day Charter');
  await expect(page.locator('body')).toContainText('from');
  await expect(page.locator('a[href="/en/routes/dali-day-charter"]')).toHaveCount(1);
});

// ---- Route detail: per-day pricing ----
test('/routes/dali-day-charter shows itinerary and a per-day pricing table', async ({ page }) => {
  await page.goto('/routes/dali-day-charter');
  const body = page.locator('body');
  await expect(body).toContainText('大理环洱海');
  await expect(body).toContainText('环洱海一日游'); // itinerary body (rendered markdown)
  const pricing = page.locator('[data-testid="pricing-table"]');
  await expect(pricing).toContainText('每日价'); // per_day mode label
  await expect(pricing).toContainText('轿车'); // sedan type label
  await expect(pricing).toContainText('¥800');
  await expect(pricing).toContainText('¥1,300');
});

// ---- Route detail: package pricing ----
test('/routes/kunming-dali-lijiang-lugu-lake shows a package pricing table', async ({ page }) => {
  await page.goto('/routes/kunming-dali-lijiang-lugu-lake');
  const pricing = page.locator('[data-testid="pricing-table"]');
  await expect(pricing).toContainText('套餐总价'); // package mode label
  await expect(pricing).toContainText('¥4,800');
  await expect(pricing).toContainText('¥7,200');
});

test('/en/routes/kunming-dali-lijiang-lugu-lake renders English mode label and note', async ({ page }) => {
  await page.goto('/en/routes/kunming-dali-lijiang-lugu-lake');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const pricing = page.locator('[data-testid="pricing-table"]');
  await expect(pricing).toContainText('Package price');
  await expect(pricing).toContainText('¥4,800');
  await expect(pricing).toContainText("excl. meals"); // English price note
});

// ---- Homepage featured routes ----
test('homepage shows only featured routes', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.featured-routes [data-testid="route-card"]');
  await expect(cards).toHaveCount(1); // only the grand loop is featured
  await expect(page.locator('.featured-routes')).toContainText('经典环线'); // grand loop
  await expect(page.locator('.featured-routes')).not.toContainText('大理环洱海'); // Dali not featured
});

test('/en/ homepage shows featured routes in English', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const cards = page.locator('.featured-routes [data-testid="route-card"]');
  await expect(cards).toHaveCount(1);
  await expect(page.locator('.featured-routes')).toContainText('Classic Loop');
});
