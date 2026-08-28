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
    // Ensure autoplay on mobile via interaction fallback
    const play = () => { video.play().catch(() => {}); };
    play();
    document.addEventListener('touchstart', play, { once: true });
    return () => document.removeEventListener('touchstart', play);
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height,
      overflow: 'hidden',
    }}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
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
