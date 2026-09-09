'use client';

import { useEffect, useState } from 'react';

/**
 * 21st.dev inspired top scroll progress bar.
 * Renders an ultra-thin 2.5px gradient beam across the top of the viewport
 * showing the user's reading position across the page.
 * Uses GPU-accelerated scaleX, zero layout shift.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            setProgress(Math.min(1, Math.max(0, window.scrollY / totalHeight)));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2.5px',
        zIndex: 9999,
        pointerEvents: 'none',
        background: 'linear-gradient(90deg, var(--deep-forest) 0%, var(--accent) 50%, var(--sky-blue) 100%)',
        transform: `scaleX(${progress})`,
        transformOrigin: '0% 50%',
        transition: 'transform 80ms linear',
        boxShadow: '0 0 10px rgba(141, 184, 51, 0.6)',
      }}
    />
  );
}
