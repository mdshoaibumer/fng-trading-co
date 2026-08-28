'use client';

import { useEffect, useRef, useCallback } from 'react';
import createGlobe from 'cobe';

interface RouteMarker {
  id: string;
  location: [number, number];
}

interface RouteArc {
  id: string;
  from: [number, number];
  to: [number, number];
}

// China sourcing hubs (Guangzhou, Shenzhen, Yiwu) and Saudi delivery points
// (Riyadh, Jeddah, Dammam), connected by the shipping routes FNG runs.
const GUANGZHOU: [number, number] = [23.13, 113.26];
const SHENZHEN: [number, number] = [22.54, 114.06];
const YIWU: [number, number] = [29.31, 120.08];
const RIYADH: [number, number] = [24.71, 46.68];
const JEDDAH: [number, number] = [21.49, 39.19];
const DAMMAM: [number, number] = [26.43, 50.10];

const MARKERS: RouteMarker[] = [
  { id: 'guangzhou', location: GUANGZHOU },
  { id: 'shenzhen', location: SHENZHEN },
  { id: 'yiwu', location: YIWU },
  { id: 'riyadh', location: RIYADH },
  { id: 'jeddah', location: JEDDAH },
  { id: 'dammam', location: DAMMAM },
];

const ARCS: RouteArc[] = [
  { id: 'gz-riyadh', from: GUANGZHOU, to: RIYADH },
  { id: 'sz-jeddah', from: SHENZHEN, to: JEDDAH },
  { id: 'yiwu-dammam', from: YIWU, to: DAMMAM },
];

export default function SourcingGlobe({ className = '', maxWidth = '480px', interactive = true }: { className?: string; maxWidth?: string; interactive?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0 });
  const phiOffsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const reducedMotionRef = useRef(false);

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
    // Dragging is user-initiated, so it's fine even under reduced motion —
    // only the automatic idle spin is paused for prefers-reduced-motion.
    isPausedRef.current = reducedMotionRef.current;
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
    let phi = 0;

    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    isPausedRef.current = reducedMotionRef.current;

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
        markers: MARKERS.map((m) => ({ location: m.location, size: 0.06 })),
        arcs: ARCS.map((a) => ({ from: a.from, to: a.to })),
        arcColor: [0.55, 0.72, 0.2],
        arcWidth: 2, arcHeight: 0.35,
        opacity: 0.9,
      });

      function animate() {
        if (!isPausedRef.current) phi += 0.005;
        globe!.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
        });
        animationId = requestAnimationFrame(animate);
      }
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
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
    };
  }, []);

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
