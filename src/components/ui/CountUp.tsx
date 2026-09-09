'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { segmentValue, renderCountUp, hasNumbers, isGrouped, easeOutCubic } from '@/lib/countUp';

/**
 * Counts a stat up to its final value the first time it scrolls into view.
 *
 * Takes the value as authored rather than as a bare number — see src/lib/
 * countUp.ts for how "100+", "15–30" and "2,500 kg" are handled.
 *
 * Behaviour that matters:
 * - The server renders the FINAL value, so crawlers, no-JS visitors and the
 *   pre-hydration paint all see the real number. The rewind to zero happens in
 *   a layout effect, before the browser paints, so there is no flash of the
 *   final value being yanked back.
 * - prefers-reduced-motion skips the animation entirely. The global CSS
 *   kill-switch in globals.css cannot help here — this is a rAF loop, not a
 *   CSS animation — so it is checked explicitly.
 * - requestAnimationFrame with an ease-out, not setInterval on a fixed tick:
 *   the count tracks the display's refresh rate and decelerates into its final
 *   value instead of arriving at a constant mechanical rate.
 */

/** React warns about useLayoutEffect during SSR; fall back there. */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function CountUp({
  value,
  durationMs = 1400,
  className,
  style,
}: {
  /** The stat exactly as authored, e.g. "500", "100+", "15–30", "2,500 kg". */
  value: string | number;
  durationMs?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const text = String(value);
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  // Starts complete so the server (and the first client paint) shows the real
  // figure; the layout effect below rewinds it only when it is safe to animate.
  const [progress, setProgress] = useState(1);

  const segments = segmentValue(text);
  const animatable = hasNumbers(segments);
  const grouped = isGrouped(text);

  useIsomorphicLayoutEffect(() => {
    if (!animatable || prefersReducedMotion()) return;
    setProgress(0);
  }, [animatable]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !animatable || prefersReducedMotion()) return;

    let start: number | null = null;
    const step = (now: number) => {
      if (start === null) start = now;
      const t = Math.min(1, (now - start) / durationMs);
      setProgress(easeOutCubic(t));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Once only: a stat that counts up again every time it scrolls past
        // reads as a glitch rather than as a flourish.
        observer.disconnect();
        rafRef.current = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    observer.observe(node);

    // If the observer never fires — an element already scrolled past on a
    // restored position, say — the value must not be left sitting at zero.
    const fallback = setTimeout(() => setProgress(1), 3000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animatable, durationMs]);

  const counting = progress < 1;

  return (
    <span
      ref={ref}
      className={className}
      style={{
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
        ...style,
      }}
      // The animating digits are noise to a screen reader, which would
      // otherwise hear the number change dozens of times. It reads the final
      // value once instead.
      aria-label={counting ? text : undefined}
    >
      <span aria-hidden={counting || undefined}>
        {renderCountUp(segments, progress, grouped)}
      </span>
    </span>
  );
}
