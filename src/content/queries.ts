// Pure query helpers over content-collection data.
// Pages call Astro's getCollection() and feed the resulting `.data` objects here,
// so all logic stays unit-testable without the Astro runtime.
import { localizedValue, type Locale } from '../i18n/utils';

/**
 * Resolve a bilingual `${base}_zh` / `${base}_en` field pair to one string for a
 * locale, falling back to Chinese when the English value is absent.
 */
export function localizedField(
  data: Record<string, unknown>,
  base: string,
  locale: Locale,
): string {
  const zh = (data[`${base}_zh`] as string) ?? '';
  const en = data[`${base}_en`] as string | undefined;
  return localizedValue({ zh, en }, locale);
}

/** Return a new array sorted ascending by `order` (stable; input not mutated). */
export function byOrder<T extends { order?: number }>(items: readonly T[]): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => (a.item.order ?? 0) - (b.item.order ?? 0) || a.index - b.index)
    .map(({ item }) => item);
}

/** Return only entries marked `featured: true`. */
export function featured<T extends { featured?: boolean }>(items: readonly T[]): T[] {
  return items.filter((item) => item.featured === true);
}

/** Return the single entry whose `slug` matches, or undefined. */
export function bySlug<T extends { slug: string }>(
  items: readonly T[],
  slug: string,
): T | undefined {
  return items.find((item) => item.slug === slug);
}

/**
 * Find the destination whose `region` matches one of a route's `regions`, trying
 * regions in their listed order (so the route's primary region wins). → undefined
 * when the route has no regions or none has a matching destination.
 */
export function destinationForRoute<T extends { region: string }>(
  destinations: readonly T[],
  route: { regions?: readonly string[] },
): T | undefined {
  for (const region of route.regions ?? []) {
    const match = destinations.find((d) => d.region === region);
    if (match) return match;
  }
  return undefined;
}

/** Resolve a reference slug to its target entry; undefined slug or no match → undefined. */
export function resolveRef<T extends { slug: string }>(
  items: readonly T[],
  slug: string | undefined,
): T | undefined {
  return slug === undefined ? undefined : items.find((item) => item.slug === slug);
}

/** Display order for FAQ categories; must cover every `faqSchema` category enum value. */
export const FAQ_CATEGORY_ORDER = [
  'pricing',
  'booking',
  'logistics',
  'payment',
  'general',
] as const;

export interface CategoryGroup<T> {
  category: string;
  items: T[];
}

/**
 * Bucket FAQ entries into groups following `FAQ_CATEGORY_ORDER`, with each group's
 * items sorted by `order`. Categories with no entries are omitted.
 */
export function groupByCategory<T extends { category?: string; order?: number }>(
  entries: readonly T[],
): CategoryGroup<T>[] {
  return FAQ_CATEGORY_ORDER.map((category) => ({
    category,
    items: byOrder(entries.filter((entry) => entry.category === category)),
  })).filter((group) => group.items.length > 0);
}
