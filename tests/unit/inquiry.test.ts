import { describe, it, expect } from 'vitest';
import { buildInquiryMailto } from '../../src/lib/inquiry';

const to = 'hello@turtlecharter.com';

function parse(url: string) {
  expect(url.startsWith(`mailto:${to}?`)).toBe(true);
  const query = url.slice(`mailto:${to}?`.length);
  const params = new URLSearchParams(query);
  return { subject: params.get('subject'), body: params.get('body') };
}

describe('buildInquiryMailto', () => {
  it('builds a mailto with encoded subject and a labelled body', () => {
    const url = buildInquiryMailto({
      to,
      subject: 'New inquiry',
      fields: [
        { label: 'Name', value: 'Jane' },
        { label: 'Email', value: 'jane@example.com' },
      ],
    });
    const { subject, body } = parse(url);
    expect(subject).toBe('New inquiry');
    // URLSearchParams decodes back to the original text
    expect(body).toBe('Name: Jane\nEmail: jane@example.com');
  });

  it('omits fields whose value is empty or whitespace', () => {
    const url = buildInquiryMailto({
      to,
      subject: 'x',
      fields: [
        { label: 'Name', value: 'Jane' },
        { label: 'Message', value: '   ' },
        { label: 'WeChat', value: '' },
      ],
    });
    const { body } = parse(url);
    expect(body).toBe('Name: Jane');
  });

  it('percent-encodes spaces, newlines, and non-ASCII characters', () => {
    const url = buildInquiryMailto({
      to,
      subject: '包车 咨询',
      fields: [{ label: '留言', value: '你好\nworld' }],
    });
    // raw URL must be percent-encoded (no literal spaces, newlines, or CJK bytes)
    expect(url).not.toMatch(/[ \n]/);
    expect(url).toContain('%20'); // encoded space in subject
    expect(url).toContain('%0A'); // encoded newline in body
    const { subject, body } = parse(url);
    expect(subject).toBe('包车 咨询');
    expect(body).toBe('留言: 你好\nworld');
  });

  it('produces an empty body when no fields have values', () => {
    const url = buildInquiryMailto({ to, subject: 's', fields: [{ label: 'Name', value: '' }] });
    expect(parse(url).body).toBe('');
  });
});
