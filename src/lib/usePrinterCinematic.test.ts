import { describe, it, expect } from 'vitest';
import {
  phaseForProgress,
  frameIndexForProgress,
  getSparseKeyframeIndices,
  getLookaheadWindowIndices,
} from './usePrinterCinematic';

describe('phaseForProgress', () => {
  it('starts on the blank hero phase', () => {
    expect(phaseForProgress(0).key).toBe('hero');
    expect(phaseForProgress(0.05).key).toBe('hero');
  });

  it('walks through the story beats in order', () => {
    expect(phaseForProgress(0.15).key).toBe('reveal');
    expect(phaseForProgress(0.25).key).toBe('inspect');
    expect(phaseForProgress(0.40).key).toBe('architecture');
    expect(phaseForProgress(0.50).key).toBe('exploded');
  });

  it('names each component during the descent, in top-to-bottom order', () => {
    expect(phaseForProgress(0.60).key).toBe('scanner');
    expect(phaseForProgress(0.63).key).toBe('imaging');
    expect(phaseForProgress(0.66).key).toBe('fuser');
    expect(phaseForProgress(0.685).key).toBe('paperFeed');
    expect(phaseForProgress(0.715).key).toBe('electronics');
    expect(phaseForProgress(0.75).key).toBe('cassette');
  });

  it('ends on reassembly, then ready', () => {
    expect(phaseForProgress(0.85).key).toBe('reassembly');
    expect(phaseForProgress(1).key).toBe('ready');
  });

  it('clamps out-of-range input', () => {
    expect(phaseForProgress(-0.5).key).toBe('hero');
    expect(phaseForProgress(1.5).key).toBe('ready');
  });
});

describe('frameIndexForProgress', () => {
  it('maps the ends of the scroll range to the first and last frame', () => {
    expect(frameIndexForProgress(0, 560)).toBe(0);
    expect(frameIndexForProgress(1, 560)).toBe(559);
  });

  it('is monotonic — scrolling forward never moves the frame index backward', () => {
    let prev = -1;
    for (let p = 0; p <= 1; p += 0.01) {
      const index = frameIndexForProgress(p, 560);
      expect(index).toBeGreaterThanOrEqual(prev);
      prev = index;
    }
  });

  it('clamps out-of-range input', () => {
    expect(frameIndexForProgress(-0.5, 100)).toBe(0);
    expect(frameIndexForProgress(1.5, 100)).toBe(99);
  });
});

describe('getSparseKeyframeIndices', () => {
  it('generates correct stride keyframes and includes the final frame', () => {
    const indices = getSparseKeyframeIndices(100, 10);
    expect(indices[0]).toBe(0);
    expect(indices[1]).toBe(10);
    expect(indices[indices.length - 1]).toBe(99);
  });

  it('handles non-multiple frame counts by appending final frame', () => {
    const indices = getSparseKeyframeIndices(25, 10);
    expect(indices).toEqual([0, 10, 20, 24]);
  });

  it('returns empty array for invalid frame counts', () => {
    expect(getSparseKeyframeIndices(0)).toEqual([]);
    expect(getSparseKeyframeIndices(-10)).toEqual([]);
  });
});

describe('getLookaheadWindowIndices', () => {
  it('calculates sliding window around current frame', () => {
    const window = getLookaheadWindowIndices(50, 100, 20, 10);
    expect(window[0]).toBe(40);
    expect(window[window.length - 1]).toBe(70);
    expect(window).toContain(50);
  });

  it('clamps window boundaries at start and end of sequence', () => {
    const startWindow = getLookaheadWindowIndices(2, 100, 20, 10);
    expect(startWindow[0]).toBe(0);
    expect(startWindow[startWindow.length - 1]).toBe(22);

    const endWindow = getLookaheadWindowIndices(98, 100, 20, 10);
    expect(endWindow[0]).toBe(88);
    expect(endWindow[endWindow.length - 1]).toBe(99);
  });
});

