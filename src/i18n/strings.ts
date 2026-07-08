// UI-string lookup. Chrome text (nav, buttons, footer) lives in zh.json / en.json,
// keyed by flat dotted keys. Content-item bilingualism is handled separately.
import zh from './zh.json';
import en from './en.json';
import type { Locale } from './utils';

const dicts: Record<Locale, Record<string, string>> = { zh, en };

/**
 * Look up a UI string for a locale.
 * - en falls back to the zh value when the English string is missing.
 * - Unknown keys return the key itself (never throws, easy to spot in the UI).
 */
export function t(locale: Locale, key: string): string {
  const en = locale === 'en' ? dicts.en[key] : undefined;
  if (en) return en;
  const zhValue = dicts.zh[key];
  return zhValue ?? key;
}
