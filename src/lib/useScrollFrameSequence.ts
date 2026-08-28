'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseScrollFrameSequenceOptions {
  totalFrames: number;
  desktopFramePath: (index: number) => string;
  mobileFramePath: (index: number) => string;
  fit: 'contain' | 'stretch';
  /** Defer image loading until the section scrolls near the viewport (for below-the-fold sections). */
  deferUntilNear?: boolean;
  rootMargin?: string;
  /**
   * Fires on every rAF-gated scroll tick with the raw progress value, ahead of
   * (and independent from) the `scrollProgress` state update below. Use this
   * for continuously-varying visual properties (transform/opacity) you want
   * to write straight to the DOM via a ref — it skips React's render/diff
   * entirely, which matters when something re-renders 60x/sec on scroll.
   * `scrollProgress` state remains the right tool for anything that needs to
   * affect JSX output (conditional rendering, text content, class names).
   */
  onProgress?: (progress: number) => void;
}

interface UseScrollFrameSequenceResult {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  scrollProgress: number;
  imagesLoaded: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
}

/**
 * Drives a scroll-scrubbed canvas frame sequence (e.g. a "product disassembly" hero).
 * Scroll position is sampled at most once per animation frame — both the frame draw
 * AND the React state write are rAF-gated, so parallax/label styles derived from
 * `scrollProgress` never fall behind or fight a CSS transition on a fast scroll.
 */
export function useScrollFrameSequence({
  totalFrames,
  desktopFramePath,
  mobileFramePath,
  fit,
  deferUntilNear = false,
  rootMargin = '600px 0px',
  onProgress,
}: UseScrollFrameSequenceOptions): UseScrollFrameSequenceResult {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const drawRafRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const scrollTickingRef = useRef(false);
  const lastCanvasSizeRef = useRef({ width: 0, height: 0, dpr: 0 });
  const onProgressRef = useRef(onProgress);
  useEffect(() => { onProgressRef.current = onProgress; }, [onProgress]);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!deferUntilNear);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

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

  useEffect(() => {
    if (!deferUntilNear) return;
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShouldLoad(true); observer.disconnect(); } },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferUntilNear]);

  const drawFrame = useCallback((frameIndex: number, images?: HTMLImageElement[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imgs = images || imagesRef.current;
    const img = imgs[frameIndex];
    if (!img || !img.complete) return;
    // Cap the backing-store resolution at 2x — a 3x/4x phone panel gains nothing
    // visible here but pays full canvas fill/compositing cost every frame.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    // Setting canvas.width/height reallocates the backing store and wipes it,
    // even to the same size — do it only when the size actually changed
    // instead of on every single frame swap during a scroll.
    const last = lastCanvasSizeRef.current;
    if (last.width !== displayWidth || last.height !== displayHeight || last.dpr !== dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      lastCanvasSizeRef.current = { width: displayWidth, height: displayHeight, dpr };
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, displayWidth, displayHeight);
    if (fit === 'stretch') {
      ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
      return;
    }
    const imgAspect = img.width / img.height;
    const canvasAspect = displayWidth / displayHeight;
    let drawWidth, drawHeight, startX, startY;
    if (canvasAspect > imgAspect) {
      drawHeight = displayHeight;
      drawWidth = img.width * (displayHeight / img.height);
      startX = (displayWidth - drawWidth) / 2;
      startY = 0;
    } else {
      drawWidth = displayWidth;
      drawHeight = img.height * (displayWidth / img.width);
      startX = 0;
      startY = (displayHeight - drawHeight) / 2;
    }
    ctx.drawImage(img, startX, startY, drawWidth, drawHeight);
  }, [fit]);

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
    const totalSteps = totalFrames * 2 - 2;
    const step = Math.min(totalSteps, Math.floor(progress * (totalSteps + 1)));
    const frameIndex = step < totalFrames ? step : totalSteps - step;
    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      if (drawRafRef.current) cancelAnimationFrame(drawRafRef.current);
      drawRafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
    }
  }, [totalFrames, drawFrame]);

  const handleScroll = useCallback(() => {
    if (scrollTickingRef.current) return;
    scrollTickingRef.current = true;
    scrollRafRef.current = requestAnimationFrame(computeProgress);
  }, [computeProgress]);

  useEffect(() => {
    if (!shouldLoad) return;
    let cancelled = false;
    let loadedCount = 0;
    const framePath = isMobile ? mobileFramePath : desktopFramePath;
    const images: HTMLImageElement[] = [];
    for (let index = 0; index < totalFrames; index++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = framePath(index);
      img.onload = () => {
        loadedCount++;
        if (!cancelled && loadedCount === totalFrames) setImagesLoaded(true);
      };
      img.onerror = () => {
        loadedCount++;
        if (!cancelled && loadedCount === totalFrames) setImagesLoaded(true);
      };
      images[index] = img;
    }
    imagesRef.current = images;
    return () => { cancelled = true; };
    // isMobile is intentionally read once per mount (the moment loading starts) —
    // we don't want to reload the whole sequence on an orientation resize.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldLoad]);

  // The canvas is `display: none` until images finish loading, so drawing
  // synchronously inside the load handler above used to read a stale
  // clientWidth of 0 (the DOM hadn't reflected `display: block` yet) and
  // silently produce a 0x0 backing store — the first frame never painted
  // until a later scroll event happened to change the frame index. Drawing
  // from an effect keyed on `imagesLoaded` runs after that DOM commit.
  useEffect(() => {
    if (imagesLoaded) drawFrame(currentFrameRef.current);
  }, [imagesLoaded, drawFrame]);

  useEffect(() => {
    const onResize = () => drawFrame(currentFrameRef.current);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onResize);
      if (drawRafRef.current) cancelAnimationFrame(drawRafRef.current);
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, [handleScroll, drawFrame]);

  return { sectionRef, canvasRef, scrollProgress, imagesLoaded, isMobile, prefersReducedMotion };
}
