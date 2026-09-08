import { describe, it, expect } from 'vitest';
import { segmentValue, renderCountUp, hasNumbers, isGrouped, easeOutCubic } from './countUp';

const at = (value: string, progress: number) =>
  renderCountUp(segmentValue(value), progress, isGrouped(value));

describe('segmentValue', () => {
  it('splits a bare number into one animatable run', () => {
    expect(segmentValue('500')).toEqual([{ text: '500', value: 500, pad: 0 }]);
  });

  it('keeps a trailing suffix as a static run', () => {
    expect(segmentValue('100+')).toEqual([
      { text: '100', value: 100, pad: 0 },
      { text: '+', value: null, pad: 0 },
    ]);
  });

  it('treats both ends of a range as animatable', () => {
    expect(segmentValue('15–30')).toEqual([
      { text: '15', value: 15, pad: 0 },
      { text: '–', value: null, pad: 0 },
      { text: '30', value: 30, pad: 0 },
    ]);
  });

  it('keeps a grouped number together rather than splitting on the comma', () => {
    expect(segmentValue('2,500')).toEqual([{ text: '2,500', value: 2500, pad: 0 }]);
  });

  it('records the width of a zero-padded number', () => {
    expect(segmentValue('01')).toEqual([{ text: '01', value: 1, pad: 2 }]);
  });

  it('returns a value with no digits as a single static run', () => {
    expect(segmentValue('SABER')).toEqual([{ text: 'SABER', value: null, pad: 0 }]);
  });

  it('handles digits surrounded by text', () => {
    expect(segmentValue('up to 40% less')).toEqual([
      { text: 'up to ', value: null, pad: 0 },
      { text: '40', value: 40, pad: 0 },
      { text: '% less', value: null, pad: 0 },
    ]);
  });

  it('parses Arabic-Indic digits, keeping the authored glyphs as the text', () => {
    expect(segmentValue('١٢٤')).toEqual([{ text: '١٢٤', value: 124, pad: 0 }]);
  });

  it('keeps a grouped Arabic-Indic number together, as authored in ar.json', () => {
    expect(segmentValue('٢,٥٠٠')).toEqual([{ text: '٢,٥٠٠', value: 2500, pad: 0 }]);
  });
});

describe('hasNumbers', () => {
  it('is true when there is something to animate', () => {
    expect(hasNumbers(segmentValue('70%'))).toBe(true);
  });
  it('is false for a purely textual value', () => {
    expect(hasNumbers(segmentValue('SABER'))).toBe(false);
  });
  it('is true for an Arabic-Indic value', () => {
    expect(hasNumbers(segmentValue('٨٥٪'))).toBe(true);
  });
});

describe('isGrouped', () => {
  it('is true for an ASCII thousands separator', () => {
    expect(isGrouped('2,500')).toBe(true);
  });
  it('is true for an Arabic-Indic thousands separator', () => {
    expect(isGrouped('٢,٥٠٠')).toBe(true);
  });
  it('is false for an ungrouped value', () => {
    expect(isGrouped('124')).toBe(false);
  });
});

describe('renderCountUp', () => {
  it('returns the authored string verbatim at full progress', () => {
    for (const v of ['500', '100+', '15–30', '2,500 kg', 'SABER', '01']) {
      expect(at(v, 1)).toBe(v);
    }
  });

  it('starts every numeric run at zero', () => {
    expect(at('500', 0)).toBe('0');
    expect(at('15–30', 0)).toBe('0–0');
  });

  it('scales each run independently on one shared clock', () => {
    expect(at('15–30', 0.5)).toBe('8–15');
  });

  it('keeps suffixes and separators through the animation', () => {
    expect(at('100+', 0.5)).toBe('50+');
    expect(at('70%', 0.5)).toBe('35%');
  });

  it('preserves zero padding mid-count', () => {
    expect(at('07', 0)).toBe('00');
  });

  it('regroups a thousands separator while counting', () => {
    expect(at('2,500', 0.5)).toBe('1,250');
  });

  it('leaves a value with no digits alone at every progress', () => {
    expect(at('SABER', 0)).toBe('SABER');
    expect(at('SABER', 0.5)).toBe('SABER');
  });

  it('never renders a negative number if progress underflows', () => {
    expect(at('500', -1)).toBe('0');
  });

  it('does not group a number that was authored without separators', () => {
    // 2500 authored bare stays bare, so the animation cannot introduce a comma
    // the designer did not ask for.
    expect(at('2500', 0.5)).toBe('1250');
  });

  it('counts an Arabic-Indic value in Western digits, landing on the authored glyphs', () => {
    // Mid-count is Western digits regardless of locale (same as every other
    // stat); only the final, at-rest frame is the exact authored string.
    expect(at('٢,٥٠٠', 0.5)).toBe('1,250');
    expect(at('٢,٥٠٠', 1)).toBe('٢,٥٠٠');
  });
});

describe('easeOutCubic', () => {
  it('is pinned at both ends', () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
  });

  it('decelerates — more than half the distance is covered by the halfway point', () => {
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });
});
