import { describe, it, expect } from 'vitest';
import { safeJsonLd } from './safeJsonLd';

describe('safeJsonLd', () => {
  it('produces valid, parseable JSON for a normal schema.org object', () => {
    const schema = { '@context': 'https://schema.org', '@type': 'Product', name: 'HP LaserJet Pro' };
    const out = safeJsonLd(schema);
    expect(JSON.parse(out)).toEqual(schema);
  });

  // This is the actual bug it exists to prevent: an admin-entered product
  // name containing "</script>" breaking out of the <script> tag it's
  // embedded in via dangerouslySetInnerHTML.
  it('escapes "<" so a "</script>" in the data cannot break out of the script tag', () => {
    const malicious = { name: 'Innocent</script><script>alert(1)</script>' };
    const out = safeJsonLd(malicious);
    // The dangerous sequence must not appear literally — only `<` needs
    // escaping to defuse it; a bare `>` is harmless on its own.
    expect(out).not.toContain('</script>');
    expect(out).toContain('\\u003c/script>');
  });

  it('still round-trips to the original value once parsed back', () => {
    const malicious = { name: 'Innocent</script><script>alert(1)</script>' };
    const out = safeJsonLd(malicious);
    expect(JSON.parse(out)).toEqual(malicious);
  });

  it('handles nested objects and arrays the same way JSON.stringify would', () => {
    const schema = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home' },
        { '@type': 'ListItem', position: 2, name: 'Printers' },
      ],
    };
    expect(JSON.parse(safeJsonLd(schema))).toEqual(schema);
  });
});
