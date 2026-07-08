import { test, expect } from '@playwright/test';

test('header present with logo, nav, language switch and custom-trip CTA', async ({ page }) => {
  await page.goto('/');
  const header = page.locator('[data-testid="site-header"]');
  await expect(header).toBeVisible();
  await expect(header.locator('[data-testid="lang-switch"]')).toBeVisible();
  const cta = header.locator('[data-testid="cta-custom-trip"]');
  await expect(cta).toBeVisible();
  await expect(cta).toHaveText('免费定制');
  await expect(cta).toHaveAttribute('href', '/contact');
});

test('header CTA links to English contact on English pages', async ({ page }) => {
  await page.goto('/en/');
  const cta = page.locator('[data-testid="cta-custom-trip"]');
  await expect(cta).toHaveText('Free custom trip');
  await expect(cta).toHaveAttribute('href', '/en/contact');
});

test('footer shows email + WeChat and no WhatsApp', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('[data-testid="site-footer"]');
  await expect(footer).toBeVisible();
  await expect(footer).toContainText('微信');
  await expect(footer).toContainText('邮箱');
  await expect(footer).not.toContainText(/whatsapp/i);
});

test('language switch preserves the current page', async ({ page }) => {
  await page.goto('/contact');
  await page.locator('[data-testid="lang-switch"]').click();
  await expect(page).toHaveURL('/en/contact');
  await page.locator('[data-testid="lang-switch"]').click();
  await expect(page).toHaveURL('/contact');
});

test('mobile: primary nav collapses behind a toggle and opens on click', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile-only behavior');
  await page.goto('/');
  const nav = page.locator('[data-testid="primary-nav"]');
  const toggle = page.locator('[data-testid="menu-toggle"]');
  await expect(toggle).toBeVisible();
  await expect(nav).toBeHidden();
  await toggle.click();
  await expect(nav).toBeVisible();
  await toggle.click();
  await expect(nav).toBeHidden();
});

test('mobile: no horizontal overflow (single readable column)', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile-only layout check');
  for (const path of ['/', '/en/', '/contact']) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1); // allow sub-pixel rounding
  }
});

test('mobile: sticky inquiry CTA stays visible and links to contact', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile-only behavior');
  await page.goto('/');
  const sticky = page.locator('[data-testid="sticky-cta"]');
  await expect(sticky).toBeVisible();
  await expect(sticky).toHaveAttribute('href', '/contact');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(sticky).toBeVisible();
});
