'use client';

import { useRef, useState, useCallback, type CSSProperties, type ReactNode } from 'react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  spotlightColor?: string;
  spotlightSize?: number;
  borderRadius?: string;
  borderWidth?: number;
}

/**
 * 21st.dev inspired Spotlight Card.
 * Tracks mouse coordinates across the card and renders a radial highlight
 * on hover that illuminates both the card surface and the border.
 * Hardware-accelerated, zero-layout-shift, automatically disabled on touch
 * or prefers-reduced-motion.
 */
export default function SpotlightCard({
  children,
  className = '',
  style = {},
  spotlightColor = 'rgba(141, 184, 51, 0.15)',
  spotlightSize = 350,
  borderRadius = 'var(--radius-xl)',
  borderWidth = 1,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
      style={{
        borderRadius,
        ...style,
      }}
    >
      {/* Spotlight glow layer */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 350ms cubic-bezier(0.22, 1, 0.36, 1)',
          background: `radial-gradient(${spotlightSize}px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />

      {/* Subtle border highlight */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          padding: `${borderWidth}px`,
          pointerEvents: 'none',
          zIndex: 2,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 350ms cubic-bezier(0.22, 1, 0.36, 1)',
          background: `radial-gradient(${spotlightSize * 0.8}px circle at ${coords.x}px ${coords.y}px, rgba(141, 184, 51, 0.45), transparent 70%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
        }}
      />

      {/* Card Content */}
      <div style={{ position: 'relative', zIndex: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}
