// Pure composer for the inquiry form's `mailto:` submission. Kept free of the DOM
// so it is unit-testable and shared by both the build and the client script.

export interface InquiryField {
  label: string;
  value: string;
}

export interface InquiryMailtoOptions {
  to: string;
  subject: string;
  fields: readonly InquiryField[];
}

/**
 * Compose a `mailto:` URL. Fields whose value is empty/whitespace are dropped; the
 * rest render as `label: value` lines. Subject and body are percent-encoded (via
 * `encodeURIComponent`, so spaces → `%20` and newlines → `%0A`) for a valid URL.
 */
export function buildInquiryMailto({ to, subject, fields }: InquiryMailtoOptions): string {
  const body = fields
    .filter((field) => field.value.trim() !== '')
    .map((field) => `${field.label}: ${field.value}`)
    .join('\n');
  return buildPrefilledMailto(to, subject, body);
}

/**
 * Compose a `mailto:` URL from free-text subject and body (both percent-encoded).
 * Used to pre-fill the per-destination inquiry links so travelers start from a
 * template instead of a blank draft.
 */
export function buildPrefilledMailto(to: string, subject: string, body: string): string {
  const query = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return `mailto:${to}?${query}`;
}
