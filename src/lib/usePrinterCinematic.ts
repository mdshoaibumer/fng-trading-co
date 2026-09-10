'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Drives the M428fdw cinematic hero: a single continuous scroll-scrubbed
 * camera sequence (hero -> reveal -> inspect -> engineering macro -> exploded
 * view -> component-by-component descent -> reassembly -> final hero),
 * rendered as a linear frame sequence on a canvas. Unlike `usePrinterStory`
 * (a 4-photo crossfade), every frame here comes from real generated footage,
 * so scroll position maps directly to a frame index — no blending needed.
 *
 * Frame counts can differ between desktop/mobile (mobile samples fewer
 * frames from the same footage to cut payload) — the frame-index formula
 * below is written in terms of `totalFrames` for whichever set is active, so
 * both devices reuse the same linear mapping.
 */

export type CinematicPhaseKey =
  | 'hero'
  | 'reveal'
  | 'inspect'
  | 'architecture'
  | 'exploded'
  | 'scanner'
  | 'imaging'
  | 'fuser'
  | 'paperFeed'
  | 'electronics'
  | 'cassette'
  | 'reassembly'
  | 'ready';

export interface CinematicPhaseLabel {
  key: CinematicPhaseKey;
  en: string;
  ar: string;
  descEn?: string;
  descAr?: string;
}

// Breakpoints are fractions of total scroll progress, tuned against the
// actual rendered clip durations (see PrinterCinematicSection's frame
// manifest) — not evenly spaced, since the source clips aren't equal length.
// The six component sub-phases (scanner..cassette) split the "component
// descent" clip evenly, matching a steady top-to-bottom camera move.
const PHASES: { end: number; label: CinematicPhaseLabel }[] = [
  { end: 0.10, label: { key: 'hero', en: '', ar: '' } },
  { end: 0.20, label: { key: 'reveal', en: 'Reveal', ar: 'الكشف' } },
  { end: 0.3143, label: { key: 'inspect', en: 'Inspect', ar: 'الفحص' } },
  { end: 0.4429, label: { key: 'architecture', en: 'Internal Architecture', ar: 'البنية الداخلية' } },
  { end: 0.5857, label: { key: 'exploded', en: 'Exploded View', ar: 'العرض المفكك' } },
  {
    end: 0.6143,
    label: {
      key: 'scanner', en: 'ADF / Scanner', ar: 'وحدة المسح الضوئي',
      descEn: 'Automatic document feeding and scanning assembly',
      descAr: 'مجموعة التغذية التلقائية للمستندات والمسح الضوئي',
    },
  },
  {
    end: 0.6429,
    label: {
      key: 'imaging', en: 'Imaging System', ar: 'نظام التصوير',
      descEn: 'Photosensitive drum and toner imaging components',
      descAr: 'أسطوانة التصوير الحساسة للضوء ومكونات الحبر',
    },
  },
  {
    end: 0.6714,
    label: {
      key: 'fuser', en: 'Fuser', ar: 'وحدة التثبيت',
      descEn: 'Heat and pressure assembly that bonds toner to paper',
      descAr: 'وحدة الحرارة والضغط التي تثبت الحبر على الورق',
    },
  },
  {
    end: 0.70,
    label: {
      key: 'paperFeed', en: 'Paper Feed', ar: 'تغذية الورق',
      descEn: 'Rollers and mechanical feed path',
      descAr: 'الأسطوانات ومسار التغذية الميكانيكي',
    },
  },
  {
    end: 0.7286,
    label: {
      key: 'electronics', en: 'Control Electronics', ar: 'الدوائر الإلكترونية',
      descEn: 'Core control and processing electronics',
      descAr: 'لوحة التحكم والمعالجة الأساسية',
    },
  },
  {
    end: 0.7571,
    label: {
      key: 'cassette', en: 'Paper Cassette', ar: 'درج الورق',
      descEn: 'Input paper storage and feed assembly',
      descAr: 'مجموعة تخزين وتغذية الورق',
    },
  },
  { end: 0.90, label: { key: 'reassembly', en: 'Reassembly', ar: 'إعادة التجميع' } },
  { end: 1.001, label: { key: 'ready', en: 'Ready', ar: 'جاهزة' } },
];

/** Pure + testable: which phase label is active at a given scroll progress. */
export function phaseForProgress(progress: number): CinematicPhaseLabel {
  const p = Math.max(0, Math.min(1, progress));
  for (const { end, label } of PHASES) {
    if (p < end) return label;
  }
  return PHASES[PHASES.length - 1].label;
}

/** Pure + testable: linear progress -> frame index for a given sequence length. */
export function frameIndexForProgress(progress: number, totalFrames: number): number {
  const p = Math.max(0, Math.min(1, progress));
  return Math.min(totalFrames - 1, Math.floor(p * totalFrames));
}

interface UsePrinterCinematicOptions {
  desktopTotalFrames: number;
  mobileTotalFrames: number;
  desktopFramePath: (index: number) => string;
  mobileFramePath: (index: number) => string;
  onProgress?: (progress: number) => void;
}

interface UsePrinterCinematicResult {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  scrollProgress: number;
  /** 0-1 across the active (desktop or mobile) frame set. */
  loadProgress: number;
  /** True once the first frame has painted — gate the canvas reveal on this, not full load. */
  firstFrameReady: boolean;
  /** Percent rect of the canvas box the letterboxed/pillarboxed frame actually occupies. */
  frameRect: { xPct: number; yPct: number; widthPct: number; heightPct: number };
  isMobile: boolean;
  prefersReducedMotion: boolean;
  phase: CinematicPhaseLabel;
}

/** Pure + testable: generate sparse keyframe indices for skeleton scrubbing. */
export function getSparseKeyframeIndices(totalFrames: number, stride = 10): number[] {
  if (totalFrames <= 0) return [];
  const indices: number[] = [];
  for (let i = 0; i < totalFrames; i += stride) {
    indices.push(i);
  }
  if (indices[indices.length - 1] !== totalFrames - 1) {
    indices.push(totalFrames - 1);
  }
  return indices;
}

/** Pure + testable: calculate active lookahead window around current scroll frame. */
export function getLookaheadWindowIndices(
  currentFrame: number,
  totalFrames: number,
  forwardRadius = 30,
  backwardRadius = 10
): number[] {
  if (totalFrames <= 0) return [];
  const clampedCurrent = Math.max(0, Math.min(totalFrames - 1, currentFrame));
  const start = Math.max(0, clampedCurrent - backwardRadius);
  const end = Math.min(totalFrames - 1, clampedCurrent + forwardRadius);
  const indices: number[] = [];
  for (let i = start; i <= end; i++) {
    indices.push(i);
  }
  return indices;
}

export function usePrinterCinematic({
  desktopTotalFrames,
  mobileTotalFrames,
  desktopFramePath,
  mobileFramePath,
  onProgress,
}: UsePrinterCinematicOptions): UsePrinterCinematicResult {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const requestedRef = useRef<boolean[]>([]);
  const lastDrawnIndexRef = useRef(-1);
  const currentFrameRef = useRef(0);
  const drawRafRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const scrollTickingRef = useRef(false);
  const lastCanvasSizeRef = useRef({ width: 0, height: 0, dpr: 0 });
  const onProgressRef = useRef(onProgress);
  useEffect(() => { onProgressRef.current = onProgress; }, [onProgress]);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [frameRect, setFrameRect] = useState({ xPct: 0, yPct: 0, widthPct: 100, heightPct: 100 });
  const frameRectRef = useRef(frameRect);
  const [phase, setPhase] = useState<CinematicPhaseLabel>(PHASES[0].label);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Queue and concurrency management for progressive loading
  const queueRef = useRef<number[]>([]);
  const inFlightCountRef = useRef(0);
  const isVisibleRef = useRef(true);
  const isCancelledRef = useRef(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const totalFrames = isMobile ? mobileTotalFrames : desktopTotalFrames;

  // Nearest already-loaded frame to `target`, searching outward both ways.
  const nearestLoadedIndex = useCallback((target: number) => {
    const loaded = loadedRef.current;
    if (loaded[target]) return target;
    for (let d = 1; d < loaded.length; d++) {
      if (target - d >= 0 && loaded[target - d]) return target - d;
      if (target + d < loaded.length && loaded[target + d]) return target + d;
    }
    return -1;
  }, []);

  const drawFrame = useCallback((requestedIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const index = nearestLoadedIndex(requestedIndex);
    if (index === -1) return;
    const img = imagesRef.current[index];
    if (!img || !img.complete) return;
    lastDrawnIndexRef.current = index;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    const last = lastCanvasSizeRef.current;
    if (last.width !== displayWidth || last.height !== displayHeight || last.dpr !== dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      lastCanvasSizeRef.current = { width: displayWidth, height: displayHeight, dpr };
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, displayWidth, displayHeight);
    if (!displayWidth || !displayHeight) return;

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = displayWidth / displayHeight;
    let drawWidth: number, drawHeight: number, startX: number, startY: number;
    if (canvasAspect > imgAspect) {
      drawHeight = displayHeight;
      drawWidth = img.naturalWidth * (displayHeight / img.naturalHeight);
      startX = (displayWidth - drawWidth) / 2;
      startY = 0;
    } else {
      drawWidth = displayWidth;
      drawHeight = img.naturalHeight * (displayWidth / img.naturalWidth);
      startX = 0;
      startY = (displayHeight - drawHeight) / 2;
    }
    ctx.drawImage(img, startX, startY, drawWidth, drawHeight);

    const nextRect = {
      xPct: (startX / displayWidth) * 100,
      yPct: (startY / displayHeight) * 100,
      widthPct: (drawWidth / displayWidth) * 100,
      heightPct: (drawHeight / displayHeight) * 100,
    };
    const prevRect = frameRectRef.current;
    if (Math.abs(prevRect.xPct - nextRect.xPct) > 0.01 || Math.abs(prevRect.widthPct - nextRect.widthPct) > 0.01) {
      frameRectRef.current = nextRect;
      setFrameRect(nextRect);
    }
  }, [nearestLoadedIndex]);

  // Concurrency-capped progressive frame loader
  const MAX_CONCURRENT = 4;
  const processQueueRef = useRef<() => void>(() => {});

  const processQueue = useCallback(() => {
    if (isCancelledRef.current || !isVisibleRef.current) return;
    const framePath = isMobile ? mobileFramePath : desktopFramePath;

    while (inFlightCountRef.current < MAX_CONCURRENT && queueRef.current.length > 0) {
      const index = queueRef.current.shift();
      if (index === undefined) break;
      if (requestedRef.current[index]) continue;

      requestedRef.current[index] = true;
      inFlightCountRef.current++;

      const img = new Image();
      img.decoding = 'async';
      img.src = framePath(index);

      const onSettled = () => {
        inFlightCountRef.current--;
        if (isCancelledRef.current) return;

        loadedRef.current[index] = true;
        const totalLoaded = loadedRef.current.filter(Boolean).length;
        setLoadProgress(totalLoaded / totalFrames);

        if (index === 0) {
          setFirstFrameReady(true);
          drawFrame(currentFrameRef.current);
        } else if (
          currentFrameRef.current === index ||
          lastDrawnIndexRef.current === -1 ||
          Math.abs(currentFrameRef.current - index) <= 2
        ) {
          drawFrame(currentFrameRef.current);
        }

        processQueueRef.current();
      };

      img.onload = onSettled;
      img.onerror = onSettled;
      imagesRef.current[index] = img;
    }
  }, [isMobile, mobileFramePath, desktopFramePath, totalFrames, drawFrame]);

  useEffect(() => {
    processQueueRef.current = processQueue;
  }, [processQueue]);


  const enqueueFrames = useCallback((indices: number[], highPriority = false) => {
    if (isCancelledRef.current) return;
    const toAdd: number[] = [];
    for (const idx of indices) {
      if (idx >= 0 && idx < totalFrames && !requestedRef.current[idx]) {
        toAdd.push(idx);
      }
    }
    if (toAdd.length === 0) return;

    if (highPriority) {
      // Prepend to front of queue
      queueRef.current = [...toAdd, ...queueRef.current.filter((i) => !toAdd.includes(i))];
    } else {
      // Append to back
      const existing = new Set(queueRef.current);
      for (const idx of toAdd) {
        if (!existing.has(idx)) {
          queueRef.current.push(idx);
          existing.add(idx);
        }
      }
    }
    processQueue();
  }, [totalFrames, processQueue]);

  // On mount: load Frame 0 immediately.
  // If prefersReducedMotion: STOP. Zero additional network downloads.
  // Otherwise: enqueue initial primer buffer (1..25) and sparse skeleton.
  useEffect(() => {
    isCancelledRef.current = false;
    imagesRef.current = new Array(totalFrames).fill(null);
    loadedRef.current = new Array(totalFrames).fill(false);
    requestedRef.current = new Array(totalFrames).fill(false);
    queueRef.current = [];
    inFlightCountRef.current = 0;

    // Stage 0: Instant poster frame (Frame 0)
    enqueueFrames([0], true);

    if (prefersReducedMotion) {
      return () => { isCancelledRef.current = true; };
    }

    // Stage 1 & 2: Staged background loader using requestIdleCallback / setTimeout
    let timerId: ReturnType<typeof setTimeout> | null = null;
    const scheduleBackgroundLoading = () => {
      // Interaction primer buffer: frames 1..25
      const primerIndices: number[] = [];
      for (let i = 1; i <= Math.min(25, totalFrames - 1); i++) {
        primerIndices.push(i);
      }
      enqueueFrames(primerIndices, false);

      // Sparse skeleton keyframes across the whole sequence (stride 10 desktop, 8 mobile)
      const stride = isMobile ? 8 : 10;
      const sparseIndices = getSparseKeyframeIndices(totalFrames, stride).filter((i) => i > 25);
      enqueueFrames(sparseIndices, false);
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleHandle = window.requestIdleCallback(scheduleBackgroundLoading, { timeout: 1200 });
      return () => {
        isCancelledRef.current = true;
        window.cancelIdleCallback?.(idleHandle);
      };
    } else {
      timerId = setTimeout(scheduleBackgroundLoading, 250);
      return () => {
        isCancelledRef.current = true;
        if (timerId) clearTimeout(timerId);
      };
    }
  }, [totalFrames, prefersReducedMotion, isMobile, enqueueFrames]);

  // Visibility gating: pause queue when section is scrolled out of viewport
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          processQueue();
        }
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [processQueue]);

  const computeProgress = useCallback(() => {
    scrollTickingRef.current = false;
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const sectionHeight = sectionRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrolled = -rect.top;
    const totalScroll = sectionHeight - viewportHeight;
    const progress = Math.max(0, Math.min(1, scrolled / totalScroll));
    onProgressRef.current?.(progress);
    setScrollProgress(progress);
    setPhase((prev) => {
      const next = phaseForProgress(progress);
      return next.key === prev.key ? prev : next;
    });
    const frameIndex = frameIndexForProgress(progress, totalFrames);
    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;

      // Active Lookahead Window: stream surrounding frames with high priority
      if (!prefersReducedMotion) {
        const lookaheadIndices = getLookaheadWindowIndices(frameIndex, totalFrames, 30, 8);
        enqueueFrames(lookaheadIndices, true);
      }

      if (drawRafRef.current) cancelAnimationFrame(drawRafRef.current);
      drawRafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
    }
  }, [totalFrames, drawFrame, prefersReducedMotion, enqueueFrames]);

  const handleScroll = useCallback(() => {
    if (scrollTickingRef.current) return;
    scrollTickingRef.current = true;
    scrollRafRef.current = requestAnimationFrame(computeProgress);
  }, [computeProgress]);

  useEffect(() => {
    if (firstFrameReady) drawFrame(currentFrameRef.current);
  }, [firstFrameReady, drawFrame]);

  useEffect(() => {
    const onResize = () => drawFrame(currentFrameRef.current);
    window.addEventListener('resize', onResize, { passive: true });

    if (prefersReducedMotion) {
      currentFrameRef.current = 0;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScrollProgress(0);
      setPhase(PHASES[0].label);

      onProgressRef.current?.(0);
      drawFrame(0);
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onResize);
      if (drawRafRef.current) cancelAnimationFrame(drawRafRef.current);
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, [handleScroll, drawFrame, prefersReducedMotion]);

  return { sectionRef, canvasRef, scrollProgress, loadProgress, firstFrameReady, frameRect, isMobile, prefersReducedMotion, phase };
}

