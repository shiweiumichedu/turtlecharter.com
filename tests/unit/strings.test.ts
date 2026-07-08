import { describe, it, expect } from 'vitest';
import { t } from '../../src/i18n/strings';

describe('t (UI string lookup)', () => {
  it('returns the Chinese string by default locale', () => {
    expect(t('zh', 'nav.routes')).toBe('经典路线');
    expect(t('zh', 'cta.customTrip')).toBe('免费定制');
  });

  it('returns the English string for the en locale', () => {
    expect(t('en', 'nav.routes')).toBe('Routes');
    expect(t('en', 'cta.customTrip')).toBe('Free custom trip');
  });

  it('falls back to Chinese when the English string is missing', () => {
    // Every key defined in zh must resolve on en (fallback), never empty.
    expect(t('en', 'nav.home')).not.toBe('');
  });

  it('returns the key itself for an unknown key (never throws)', () => {
    expect(t('zh', 'does.not.exist')).toBe('does.not.exist');
  });
});
