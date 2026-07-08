import { test, expect } from '@playwright/test';

// ---- Vehicles list ----
test('/vehicles lists vehicles with names, seats, and per-day rates', async ({ page }) => {
  await page.goto('/vehicles');
  const cards = page.locator('[data-testid="vehicle-card"]');
  await expect(cards).toHaveCount(2);
  await expect(page.locator('body')).toContainText('海狮'); // HiAce zh name
  await expect(page.locator('body')).toContainText('¥1,300');
  await expect(page.locator('body')).toContainText('¥800');
});

test('/en/vehicles renders English names and lang=en', async ({ page }) => {
  await page.goto('/en/vehicles');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('body')).toContainText('HiAce');
  await expect(page.locator('body')).toContainText('¥1,300');
});

// ---- Drivers list ----
test('/drivers lists drivers linking to detail', async ({ page }) => {
  await page.goto('/drivers');
  const cards = page.locator('[data-testid="driver-card"]');
  await expect(cards).toHaveCount(1);
  await expect(page.locator('body')).toContainText('老李');
  await expect(page.locator('a[href="/drivers/lao-li"]')).toHaveCount(1);
});

test('/en/drivers links to English detail with English names', async ({ page }) => {
  await page.goto('/en/drivers');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('body')).toContainText('Lao Li');
  await expect(page.locator('a[href="/en/drivers/lao-li"]')).toHaveCount(1);
});

// ---- Driver detail ----
test('/drivers/lao-li shows fields, bio, and resolved vehicle', async ({ page }) => {
  await page.goto('/drivers/lao-li');
  const body = page.locator('body');
  await expect(body).toContainText('老李');
  await expect(body).toContainText('English'); // a language
  await expect(body).toContainText('12'); // years
  await expect(body).toContainText('大理'); // a region
  await expect(body).toContainText('摄影点位'); // a specialty
  await expect(body).toContainText('滇西北'); // bio_zh
  await expect(body).toContainText('海狮'); // resolved vehicle zh name
});

test('/en/drivers/lao-li renders English detail and lang=en', async ({ page }) => {
  await page.goto('/en/drivers/lao-li');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const body = page.locator('body');
  await expect(body).toContainText('Lao Li');
  await expect(body).toContainText('Photo spots'); // specialty en
  await expect(body).toContainText('twelve years'); // bio_en
  await expect(body).toContainText('HiAce'); // resolved vehicle en name
});
