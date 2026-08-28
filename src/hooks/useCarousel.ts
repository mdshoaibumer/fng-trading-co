'use client';

import { useCallback, useEffect, useState } from 'react';

interface UseCarouselOptions {
  length: number;
  /** Auto-advance interval in ms. Omit/0 to disable autoplay. */
  autoplayMs?: number;
  /** Track which indices have been visited, for lazy-mounting slide content. */
  lazyMount?: boolean;
}

export function useCarousel({ length, autoplayMs, lazyMount = false }: UseCarouselOptions) {
  const [current, setCurrent] = useState(0);
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(() => new Set([0]));

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    if (lazyMount) {
      setLoadedIndices(prev => (prev.has(idx) ? prev : new Set(prev).add(idx)));
    }
  }, [lazyMount]);

  const next = useCallback(() => {
    if (length > 0) goTo((current + 1) % length);
  }, [current, length, goTo]);

  const prev = useCallback(() => {
    if (length > 0) goTo((current - 1 + length) % length);
  }, [current, length, goTo]);

  useEffect(() => {
    if (!autoplayMs || length <= 1) return;
    const timer = setInterval(next, autoplayMs);
    return () => clearInterval(timer);
    // Reset on `current` too, so manual navigation restarts the countdown
    // instead of being immediately overridden by a pending auto-advance.
  }, [autoplayMs, length, next, current]);

  const isLoaded = useCallback(
    (idx: number) => !lazyMount || loadedIndices.has(idx),
    [lazyMount, loadedIndices]
  );

  return { current, goTo, next, prev, isLoaded };
}
