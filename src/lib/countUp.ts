/**
 * Pure helpers behind the <CountUp> stat animation.
 *
 * The site's stats are not plain integers — "500", "100+", "15–30", "70%",
 * "2,500 kg" and "SABER" all appear in the content. Rather than ask every call
 * site to split a number from its decoration, these split the authored string
 * into digit runs and everything else, so a range counts up on both ends, a
 * suffix stays put, and a value with no digits renders untouched.
 *
 * Kept out of the component so the parsing and formatting can be tested
 * without a DOM.
 */

// Digit runs, keeping thousands separators together so "2,500" is one number
// rather than "2" and "500".
const NUMERIC_RUN = /\d[\d,]*/g;

export interface CountUpSegment {
  /** The literal text of this run. */
  text: string;
  /** Its numeric value, or null when the run is not a number. */
  value: number | null;
  /** Width to zero-pad to, so a padded "01" stays two characters mid-count. */
  pad: number;
}

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/** True when the value contains a grouped number like "2,500". */
export const isGrouped = (value: string): boolean => /\d,\d/.test(value);

export function segmentValue(value: string): CountUpSegment[] {
  const out: CountUpSegment[] = [];
  let last = 0;
  for (const match of value.matchAll(NUMERIC_RUN)) {
    const start = match.index;
    if (start > last) out.push({ text: value.slice(last, start), value: null, pad: 0 });
    const raw = match[0];
    out.push({
      text: raw,
      value: Number(raw.replace(/,/g, '')),
      pad: /^0\d/.test(raw) ? raw.length : 0,
    });
    last = start + raw.length;
  }
  if (last < value.length) out.push({ text: value.slice(last), value: null, pad: 0 });
  return out;
}

/** True when there is anything here worth animating. */
export const hasNumbers = (segments: CountUpSegment[]): boolean =>
  segments.some((s) => s.value !== null);

/**
 * The value at a given 0..1 progress. At progress 1 the original string is
 * returned verbatim, so the final frame is always exactly what was authored
 * rather than a reformatted approximation of it.
 */
export function renderCountUp(segments: CountUpSegment[], progress: number, grouped: boolean): string {
  if (progress >= 1) return segments.map((s) => s.text).join('');
  return segments
    .map((s) => {
      if (s.value === null) return s.text;
      const current = Math.round(s.value * Math.max(0, progress));
      const text = grouped ? current.toLocaleString('en-US') : String(current);
      return s.pad ? text.padStart(s.pad, '0') : text;
    })
    .join('');
}
