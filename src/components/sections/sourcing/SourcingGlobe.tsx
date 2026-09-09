'use client';

import { useEffect, useMemo, useRef, useCallback } from 'react';
import createGlobe from 'cobe';
import { useServiceRegions } from '@/components/providers/ServiceRegionsProvider';

interface RouteMarker {
  id: string;
  location: [number, number];
}

interface RouteArc {
  id: string;
  from: [number, number];
  to: [number, number];
}

// China sourcing hubs (Guangzhou, Shenzhen, Yiwu) plus one marker per
// country FNG operates in (src/lib/serviceRegions.ts), connected by the
// shipping routes FNG runs from the factories to each office hub.
const GUANGZHOU: [number, number] = [23.13, 113.26];
const SHENZHEN: [number, number] = [22.54, 114.06];
const YIWU: [number, number] = [29.31, 120.08];
const CHINA_HUBS: [number, number][] = [GUANGZHOU, SHENZHEN, YIWU];

interface GlobeMarker extends RouteMarker { size: number }

export default function SourcingGlobe({ className = '', maxWidth = '480px', interactive = true }: { className?: string; maxWidth?: string; interactive?: boolean }) {
  // Markers and arcs used to be module constants built from the hardcoded
  // region list. They are per-render now because the footprint is editable
  // from Admin → Regions; useMemo keeps their identity stable so the effect
  // below doesn't tear down and rebuild the globe on every render.
  const serviceRegions = useServiceRegions();

  const markers = useMemo<GlobeMarker[]>(() => [
    { id: 'shenzhen', location: SHENZHEN, size: 0.045 },
    { id: 'yiwu', location: YIWU, size: 0.045 },
    ...serviceRegions.map((r) => ({ id: r.code.toLowerCase(), location: r.hub, size: r.presence === 'office' ? 0.07 : 0.045 })),
  ], [serviceRegions]);

  // Office hubs get a route from a Chinese factory hub; the wider markets
  // share one consolidation point so the globe reads as a network, not a
  // starburst. That point is the first office country (Riyadh in the built-in
  // list) rather than simply the first row, so reordering the list in Admin
  // can't hang every market route off a country with no office.
  const arcs = useMemo<RouteArc[]>(() => {
    const consolidation = (serviceRegions.find((r) => r.presence === 'office') ?? serviceRegions[0]).hub;
    return [
      ...serviceRegions.filter((r) => r.presence === 'office' && r.code !== 'CN').map((r, i) => ({
        id: `cn-${r.code.toLowerCase()}`,
        from: CHINA_HUBS[i % CHINA_HUBS.length],
        to: r.hub,
      })),
      ...serviceRegions.filter((r) => r.presence === 'market').map((r) => ({
        id: `sa-${r.code.toLowerCase()}`,
        from: consolidation,
        to: r.hub,
      })),
    ];
  }, [serviceRegions]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0 });
  const phiOffsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const offscreenRef = useRef(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!interactive) return;
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
    isPausedRef.current = true;
  }, [interactive]);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      dragOffset.current = { phi: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
    // Idle spin resumes based on reduced-motion/offscreen state — a drag just
    // ended, so there's no need to re-check whether one is still in progress.
    isPausedRef.current = reducedMotionRef.current || offscreenRef.current;
  }, []);

  useEffect(() => {
    if (!interactive) return;
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = { phi: (e.clientX - pointerInteracting.current.x) / 300 };
      }
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [interactive, handlePointerUp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationId: number;
    let renderLoopStopped = false;
    let phi = 0;
    // requestAnimationFrame fires once per display refresh, so a flat
    // per-frame increment ties rotation speed to the viewer's monitor
    // (roughly 2x faster on a 120Hz screen than 60Hz). Scaling by real
    // elapsed time keeps the ~21s/revolution rate identical everywhere.
    // 0.30 rad/s reproduces the previous 60Hz-implied rate (0.005 * 60).
    let lastTs = performance.now();

    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    isPausedRef.current = reducedMotionRef.current || offscreenRef.current;

    function animate() {
      if (!globe) return;
      if (offscreenRef.current) { renderLoopStopped = true; return; }
      const now = performance.now();
      const dt = now - lastTs;
      lastTs = now;
      if (!isPausedRef.current) phi += 0.30 * (dt / 1000);
      globe.update({
        phi: phi + phiOffsetRef.current + dragOffset.current.phi,
      });
      animationId = requestAnimationFrame(animate);
    }

    // Fully stop requesting frames (not just the phi increment) once the globe
    // scrolls well out of view — a running rAF loop keeps costing GPU/CPU even
    // while every frame it draws is invisible.
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        offscreenRef.current = !entry.isIntersecting;
        if (pointerInteracting.current === null) {
          isPausedRef.current = reducedMotionRef.current || offscreenRef.current;
        }
        if (!offscreenRef.current && renderLoopStopped) {
          renderLoopStopped = false;
          // Otherwise the elapsed-time delta since the last frame drawn
          // before going offscreen (potentially minutes ago) would be read
          // as real time and spin the globe forward to catch up.
          lastTs = performance.now();
          animate();
        }
      },
      { rootMargin: '100px 0px' }
    );
    visibilityObserver.observe(canvas);

    function init() {
      const width = canvas!.offsetWidth;
      if (width === 0 || globe) return;

      globe = createGlobe(canvas!, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: width * 2, height: width * 2,
        phi: 0, theta: 0.28, dark: 1, diffuse: 1.2,
        mapSamples: 16000, mapBrightness: 6,
        baseColor: [0.14, 0.28, 0.19],
        markerColor: [0.55, 0.72, 0.2],
        glowColor: [0.35, 0.45, 0.28],
        markerElevation: 0.02,
        markers: markers.map((m) => ({ location: m.location, size: m.size })),
        arcs: arcs.map((a) => ({ from: a.from, to: a.to })),
        arcColor: [0.55, 0.72, 0.2],
        arcWidth: 1.6, arcHeight: 0.3,
        opacity: 0.9,
      });

      animate();

      setTimeout(() => { if (canvas) canvas.style.opacity = '1'; });
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      visibilityObserver.disconnect();
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
    };
    // markers/arcs are memoised on the region list, so in practice this runs
    // once per mount — but listing them keeps the globe honest if the
    // footprint ever changes without a remount.
  }, [markers, arcs]);

  return (
    <div className={`relative aspect-square select-none ${className}`} style={{ maxWidth, margin: '0 auto' }}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        onPointerDown={handlePointerDown}
        style={{
          width: '100%', height: '100%', cursor: interactive ? 'grab' : 'default', opacity: 0,
          transition: 'opacity 1s ease', touchAction: 'none', pointerEvents: interactive ? 'auto' : 'none',
        }}
      />
    </div>
  );
}
