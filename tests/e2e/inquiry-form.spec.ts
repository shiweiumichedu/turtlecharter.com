import { test, expect } from '@playwright/test';

test('/contact renders the inquiry form, consent, and a mailto fallback action', async ({ page }) => {
  await page.goto('/contact');
  const form = page.locator('[data-testid="inquiry-form"]');
  await expect(form).toBeVisible();
  await expect(form.locator('input[name="name"]')).toHaveCount(1);
  await expect(form.locator('input[name="email"]')).toHaveCount(1);
  await expect(form.locator('textarea[name="message"]')).toHaveCount(1);
  await expect(form.locator('.inquiry-consent')).toBeVisible();
  await expect(form).toHaveAttribute('action', 'mailto:contact@turtlecharter.com');
});

test('/contact shows the WeChat contact with a copy button', async ({ page, context }) => {
  await page.goto('/contact');
  const wechat = page.locator('[data-testid="wechat-contact"]');
  await expect(wechat).toContainText('微信');
  await expect(wechat).toContainText('turtlecharter');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await wechat.locator('[data-testid="copy-wechat"]').click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('turtlecharter');
  // The friend-add QR image loads.
  const qr = wechat.locator('img.wechat-contact__qr');
  await qr.scrollIntoViewIfNeeded();
  await expect(qr).toBeVisible();
  expect(await qr.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
});

test('/en/contact renders the form in English', async ({ page }) => {
  await page.goto('/en/contact');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const form = page.locator('[data-testid="inquiry-form"]');
  await expect(form).toContainText('Your name');
  await expect(form).toContainText('Send inquiry');
  await expect(form.locator('.inquiry-consent')).toContainText('reply to this inquiry');
});

test('submitting empty shows a validation message and composes no mail', async ({ page }) => {
  await page.goto('/contact');
  const form = page.locator('[data-testid="inquiry-form"]');
  await form.locator('button[type="submit"]').click();
  await expect(page.locator('[data-testid="inquiry-error"]')).toBeVisible();
  await expect(form).not.toHaveAttribute('data-last-mailto', /.+/);
});

test('name without a contact method is blocked', async ({ page }) => {
  await page.goto('/contact');
  const form = page.locator('[data-testid="inquiry-form"]');
  await form.locator('input[name="name"]').fill('张三');
  await form.locator('button[type="submit"]').click();
  await expect(page.locator('[data-testid="inquiry-error"]')).toBeVisible();
  await expect(form).not.toHaveAttribute('data-last-mailto', /.+/);
});

test('a valid submission composes a mailto with a labelled body', async ({ page }) => {
  await page.goto('/contact');
  const form = page.locator('[data-testid="inquiry-form"]');
  await form.locator('input[name="name"]').fill('张三');
  await form.locator('input[name="email"]').fill('zhangsan@example.com');
  await form.locator('textarea[name="message"]').fill('想去大理');
  await form.locator('button[type="submit"]').click();

  await expect(page.locator('[data-testid="inquiry-error"]')).toBeHidden();
  const mailto = await form.getAttribute('data-last-mailto');
  expect(mailto).not.toBeNull();
  expect(mailto!.startsWith('mailto:contact@turtlecharter.com?subject=')).toBe(true);
  const decoded = decodeURIComponent(mailto!);
  expect(decoded).toContain('称呼: 张三');
  expect(decoded).toContain('邮箱: zhangsan@example.com');
  expect(decoded).toContain('留言: 想去大理');
});
