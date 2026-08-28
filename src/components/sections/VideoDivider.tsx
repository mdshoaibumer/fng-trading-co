'use client';

import { useRef, useEffect } from 'react';

interface VideoDividerProps {
  src: string;
  height?: string;
  overlay?: string;
  darken?: number;
}

export default function VideoDivider({ 
  src, 
  height = 'clamp(200px, 30vw, 400px)',
  overlay,
  darken = 0.45,
}: VideoDividerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const play = () => { video.play().catch(() => {}); };

    // Defer both the real buffering and playback until the divider is
    // actually about to scroll into view, rather than the moment it mounts —
    // there are two of these on the homepage, stacked with other eager media.
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { play(); observer.disconnect(); } },
      { rootMargin: '400px 0px' }
    );
    observer.observe(video);

    document.addEventListener('touchstart', play, { once: true });
    return () => {
      observer.disconnect();
      document.removeEventListener('touchstart', play);
    };
  }, []);

  // No configured video (e.g. a fresh install before Settings has been
  // filled in) — skip rendering rather than emit a <source src=""> that
  // triggers a full unnecessary network re-fetch of the page.
  if (!src) return null;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height,
      overflow: 'hidden',
    }}>
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="metadata"
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
      <div style={{
        position: 'absolute',
        inset: 0,
        background: overlay || `linear-gradient(180deg, rgba(15,42,28,${darken}) 0%, rgba(15,42,28,${darken * 0.7}) 50%, rgba(15,42,28,${darken}) 100%)`,
        pointerEvents: 'none',
      }} />
    </div>
  );
}
