import { describe, it, expect } from 'vitest';
import { framePath } from './useScrollFrameSequence';

describe('framePath', () => {
  it('maps a 0-based index to a 1-based, zero-padded webp filename', () => {
    const p = framePath('video-frames');
    expect(p(0)).toBe('/video-frames/01.webp');
    expect(p(8)).toBe('/video-frames/09.webp');
  });

  it('keeps two-digit frame numbers unpadded past 9', () => {
    const p = framePath('eco-inks-frames');
    expect(p(9)).toBe('/eco-inks-frames/10.webp');
    expect(p(98)).toBe('/eco-inks-frames/99.webp');
  });

  it('scopes each getter to its own directory', () => {
    expect(framePath('a')(0)).toBe('/a/01.webp');
    expect(framePath('b')(0)).toBe('/b/01.webp');
  });
});
