import { describe, it, expect } from 'vitest';
import { matchesFileSignature } from './fileValidation';

const PNG_SIGNATURE = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]);
const JPEG_SIGNATURE = new Uint8Array([0xff, 0xd8, 0xff, 0, 0, 0]);
const GIF87_SIGNATURE = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x37, 0x61, 0, 0]);
const GIF89_SIGNATURE = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0, 0]);
const WEBP_SIGNATURE = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]);
const HTML_POLYGLOT = new TextEncoder().encode('<html><script>alert(1)</script></html>');

describe('matchesFileSignature', () => {
  it('accepts real PNG bytes for image/png', () => {
    expect(matchesFileSignature('image/png', PNG_SIGNATURE)).toBe(true);
  });

  it('accepts real JPEG bytes for image/jpeg', () => {
    expect(matchesFileSignature('image/jpeg', JPEG_SIGNATURE)).toBe(true);
  });

  it('accepts both GIF87a and GIF89a signatures for image/gif', () => {
    expect(matchesFileSignature('image/gif', GIF87_SIGNATURE)).toBe(true);
    expect(matchesFileSignature('image/gif', GIF89_SIGNATURE)).toBe(true);
  });

  it('accepts real WebP (RIFF/WEBP) bytes for image/webp', () => {
    expect(matchesFileSignature('image/webp', WEBP_SIGNATURE)).toBe(true);
  });

  // This is the actual attack this function exists to stop: a file that
  // claims to be an image but is really HTML/script content.
  it('rejects an HTML file mislabeled as image/png (the polyglot upload attack)', () => {
    expect(matchesFileSignature('image/png', HTML_POLYGLOT)).toBe(false);
  });

  it('rejects a PNG-labeled file with a truncated/missing signature', () => {
    expect(matchesFileSignature('image/png', new Uint8Array([0x89, 0x50]))).toBe(false);
  });

  it('rejects real image bytes claimed under the wrong declared type', () => {
    // Real PNG bytes, but declared as JPEG — must not pass.
    expect(matchesFileSignature('image/jpeg', PNG_SIGNATURE)).toBe(false);
  });

  it('rejects an unsupported/unknown declared MIME type outright', () => {
    expect(matchesFileSignature('image/svg+xml', PNG_SIGNATURE)).toBe(false);
    expect(matchesFileSignature('text/html', HTML_POLYGLOT)).toBe(false);
  });
});
