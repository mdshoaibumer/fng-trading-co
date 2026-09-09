'use client';

import { useRef, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Pause, Play } from 'lucide-react';

interface VideoDividerProps {
  src: string;
  height?: string;
  overlay?: string;
  darken?: number;
  /** Optional still shown before play / under reduced motion. */
  poster?: string;
}

export default function VideoDivider({
  src,
  height = 'clamp(200px, 30vw, 400px)',
  overlay,
  darken = 0.45,
  poster,
}: VideoDividerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const params = useParams();
  const isAr = params?.locale === 'ar';
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Track the reduced-motion preference (and react to runtime changes).
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Ensure DOM video properties are explicitly set for autoplay compliance
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
    }
  }, []);

  // Reload ONLY when src actually changes after initial mount
  const prevSrcRef = useRef(src);
  useEffect(() => {
    const video = videoRef.current;
    if (video && prevSrcRef.current !== src) {
      prevSrcRef.current = src;
      video.load();
    }
  }, [src]);

  // Play while visible, not user-paused, and the tab is foregrounded
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (paused) {
      video.pause();
      return;
    }

    let visible = false;

    const tryPlay = () => {
      if (!video || paused) return;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;

      try {
        if (visible && !document.hidden && !paused) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              const onReady = () => {
                if (visible && !document.hidden && !paused) {
                  video.muted = true;
                  video.play().catch(() => {});
                }
              };
              if (video.readyState >= 2) {
                video.muted = true;
                video.play().catch(() => {});
              } else {
                video.addEventListener('loadeddata', onReady, { once: true });
                video.addEventListener('canplay', onReady, { once: true });
              }
            });
          }
        }
      } catch {
        // Safe no-op on synchronous failure
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          tryPlay();
        } else {
          video.pause();
        }
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(video);

    const onVis = () => {
      if (document.hidden) {
        video.pause();
      } else if (visible) {
        tryPlay();
      }
    };

    // First interaction fallback to bypass strict browser autoplay restrictions
    const onGesture = () => {
      if (visible && !document.hidden && !paused) {
        tryPlay();
      }
    };

    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('scroll', onGesture, { passive: true, once: true });
    window.addEventListener('touchstart', onGesture, { passive: true, once: true });
    window.addEventListener('click', onGesture, { passive: true, once: true });

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('scroll', onGesture);
      window.removeEventListener('touchstart', onGesture);
      window.removeEventListener('click', onGesture);
    };
  }, [paused]);

  // No configured video — skip rendering
  if (!src) return null;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        overflow: 'hidden',
      }}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={poster}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'cover',
        }}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            overlay ||
            `linear-gradient(180deg, rgba(15,42,28,${darken}) 0%, rgba(15,42,28,${darken * 0.7}) 50%, rgba(15,42,28,${darken}) 100%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Pause / play control — WCAG 2.2.2 */}
      {!reduced && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={
            paused
              ? isAr
                ? 'تشغيل الفيديو الخلفي'
                : 'Play background video'
              : isAr
                ? 'إيقاف الفيديو الخلفي'
                : 'Pause background video'
          }
          style={{
            position: 'absolute',
            bottom: '12px',
            insetInlineEnd: '12px',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid rgba(255,255,255,0.5)',
            background: 'rgba(13,13,13,0.55)',
            color: '#FFFFFF',
            cursor: 'pointer',
            zIndex: 2,
            backdropFilter: 'blur(4px)',
          }}
        >
          {paused ? <Play size={18} /> : <Pause size={18} />}
        </button>
      )}
    </div>
  );
}
