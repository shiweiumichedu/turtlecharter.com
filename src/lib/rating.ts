// Presentation helper for star ratings. Pure so it can be unit-tested directly,
// reused by the testimonial card.

const MAX_STARS = 5;

/**
 * Map an integer rating to a fixed 5-element array of fill states
 * (`true` = filled star), clamping the rating into 0..5.
 * e.g. 4 → [true, true, true, true, false].
 */
export function stars(rating: number): boolean[] {
  const filled = Math.max(0, Math.min(MAX_STARS, Math.round(rating)));
  return Array.from({ length: MAX_STARS }, (_, i) => i < filled);
}
