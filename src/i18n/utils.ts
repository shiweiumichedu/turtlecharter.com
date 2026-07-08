// Locale utilities for turtlecharter.com.
// zh is the default locale (served at the root, no prefix); en is served under /en/.

export type Locale = 'zh' | 'en';

export const DEFAULT_LOCALE: Locale = 'zh';
export const LOCALES: Locale[] = ['zh', 'en'];

/**
 * Normalize a raw request/build path to a clean, comparable form:
 * strip a `.html` suffix (Astro `format: 'file'` output) and any trailing slash.
 * Root stays `/`.
 */
function normalizePath(path: string): string {
  let p = path;
  if (p.endsWith('/index.html')) p = p.slice(0, -'index.html'.length); // ".../"
  else if (p.endsWith('.html')) p = p.slice(0, -'.html'.length);
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1); // drop trailing slash
  return p === '' ? '/' : p;
}

/** Determine the locale a given path belongs to. */
export function currentLocale(path: string): Locale {
  const p = normalizePath(path);
  return p === '/en' || p.startsWith('/en/') ? 'en' : 'zh';
}

/** Strip any locale prefix, returning the logical (zh) path, always leading-slashed. */
function logicalPath(path: string): string {
  const p = normalizePath(path);
  if (p === '/en') return '/';
  if (p.startsWith('/en/')) return p.slice(3); // drop "/en", keep the rest
  return p;
}

/** Build the URL for `path` in the target locale (default locale is un-prefixed). */
export function localizedUrl(path: string, target: Locale): string {
  const base = logicalPath(path);
  if (target === DEFAULT_LOCALE) return base;
  // en: prefix with /en, keeping a trailing slash for the root
  return base === '/' ? '/en/' : `/en${base}`;
}

/** A field that may have Chinese and (optionally) English text. */
export interface Localized {
  zh: string;
  en?: string;
}

/** Pick the value for a locale, falling back to Chinese when English is absent. */
export function localizedValue(value: Localized, locale: Locale): string {
  if (locale === 'en' && value.en) return value.en;
  return value.zh;
}
