import { test, expect } from '@playwright/test';

// ---- Testimonials ----
test('/testimonials lists cards with quote, rating, and route+driver links', async ({ page }) => {
  await page.goto('/testimonials');
  const cards = page.locator('[data-testid="testimonial-card"]');
  await expect(cards).toHaveCount(1);
  const body = page.locator('body');
  await expect(body).toContainText('Jane（英国）'); // zh author
  await expect(body).toContainText('张师傅全程细心'); // zh quote
  await expect(cards.first().locator('.stars')).toContainText('★★★★★');
  await expect(page.locator('a[href="/routes/kunming-dali-lijiang-lugu-lake"]')).toHaveCount(1);
  await expect(page.locator('a[href="/drivers/lao-li"]')).toHaveCount(1);
});

test('/en/testimonials renders English author/quote and /en/ links', async ({ page }) => {
  await page.goto('/en/testimonials');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const body = page.locator('body');
  await expect(body).toContainText('Jane (UK)');
  await expect(body).toContainText('Master Zhang was attentive');
  await expect(page.locator('a[href="/en/routes/kunming-dali-lijiang-lugu-lake"]')).toHaveCount(1);
  await expect(page.locator('a[href="/en/drivers/lao-li"]')).toHaveCount(1);
});

// ---- FAQ ----
test('/faq groups questions under category headings in fixed order', async ({ page }) => {
  await page.goto('/faq');
  const headings = page.locator('[data-testid="faq-group"] h2');
  await expect(headings).toHaveText(['价格', '预订']); // pricing before booking
  const body = page.locator('body');
  await expect(body).toContainText('包车价格包含哪些？'); // pricing question
  await expect(body).toContainText('油费、过路费'); // rendered answer body
  await expect(body).toContainText('如何预订和定制行程？'); // booking question
});

test('/en/faq renders English category headings and questions', async ({ page }) => {
  await page.goto('/en/faq');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const headings = page.locator('[data-testid="faq-group"] h2');
  await expect(headings).toHaveText(['Pricing', 'Booking']);
  await expect(page.locator('body')).toContainText("What's included in the charter price?");
});

// ---- Homepage featured testimonials ----
test('homepage shows featured testimonials', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.featured-testimonials [data-testid="testimonial-card"]');
  await expect(cards).toHaveCount(1);
  await expect(page.locator('.featured-testimonials')).toContainText('张师傅全程细心');
});

test('/en/ homepage shows featured testimonials in English', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const cards = page.locator('.featured-testimonials [data-testid="testimonial-card"]');
  await expect(cards).toHaveCount(1);
  await expect(page.locator('.featured-testimonials')).toContainText('Master Zhang was attentive');
});
