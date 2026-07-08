import { describe, it, expect } from 'vitest';
import { currentLocale, localizedUrl, localizedValue } from '../../src/i18n/utils';

describe('currentLocale', () => {
  it('reports zh for un-prefixed paths', () => {
    expect(currentLocale('/')).toBe('zh');
    expect(currentLocale('/routes')).toBe('zh');
    expect(currentLocale('/drivers/lao-li')).toBe('zh');
  });

  it('reports en for /en-prefixed paths', () => {
    expect(currentLocale('/en')).toBe('en');
    expect(currentLocale('/en/')).toBe('en');
    expect(currentLocale('/en/routes')).toBe('en');
  });
});

describe('currentLocale with built .html paths (format: file)', () => {
  it('detects locale despite a .html suffix', () => {
    expect(currentLocale('/en.html')).toBe('en');
    expect(currentLocale('/en/contact.html')).toBe('en');
    expect(currentLocale('/contact.html')).toBe('zh');
    expect(currentLocale('/index.html')).toBe('zh');
  });
});

describe('localizedUrl with built .html / trailing-slash paths', () => {
  it('produces clean URLs from .html inputs', () => {
    expect(localizedUrl('/contact.html', 'en')).toBe('/en/contact');
    expect(localizedUrl('/en/contact.html', 'zh')).toBe('/contact');
    expect(localizedUrl('/en.html', 'zh')).toBe('/');
    expect(localizedUrl('/index.html', 'en')).toBe('/en/');
  });

  it('produces clean URLs from trailing-slash inputs', () => {
    expect(localizedUrl('/contact/', 'en')).toBe('/en/contact');
    expect(localizedUrl('/en/contact/', 'zh')).toBe('/contact');
  });
});

describe('localizedUrl', () => {
  it('builds the English URL for a Chinese path', () => {
    expect(localizedUrl('/routes', 'en')).toBe('/en/routes');
    expect(localizedUrl('/', 'en')).toBe('/en/');
  });

  it('builds the default (zh) URL with no prefix from an English path', () => {
    expect(localizedUrl('/en/routes', 'zh')).toBe('/routes');
    expect(localizedUrl('/en/', 'zh')).toBe('/');
    expect(localizedUrl('/en', 'zh')).toBe('/');
  });

  it('is idempotent when the path is already in the target locale', () => {
    expect(localizedUrl('/routes', 'zh')).toBe('/routes');
    expect(localizedUrl('/en/routes', 'en')).toBe('/en/routes');
  });
});

describe('localizedValue (Chinese fallback)', () => {
  it('returns the English value on en when present', () => {
    expect(localizedValue({ zh: '路线', en: 'Routes' }, 'en')).toBe('Routes');
  });

  it('falls back to Chinese on en when English is missing', () => {
    expect(localizedValue({ zh: '路线', en: '' }, 'en')).toBe('路线');
    expect(localizedValue({ zh: '路线' }, 'en')).toBe('路线');
  });

  it('always returns Chinese on zh', () => {
    expect(localizedValue({ zh: '路线', en: 'Routes' }, 'zh')).toBe('路线');
  });
});
