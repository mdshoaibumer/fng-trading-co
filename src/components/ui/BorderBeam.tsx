'use client';

import type { CSSProperties } from 'react';

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
  style?: CSSProperties;
}

/**
 * 21st.dev inspired BorderBeam.
 * An animated glowing laser beam that traces the perimeter of any card or container.
 * Uses GPU-accelerated rotation masked strictly to the border.
 */
export default function BorderBeam({
  className = '',
  size = 250,
  duration = 8,
  borderWidth = 1.5,
  colorFrom = 'var(--accent)',
  colorTo = 'var(--sky-blue)',
  delay = 0,
  style = {},
}: BorderBeamProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] ${className}`}
      style={{
        border: `${borderWidth}px solid transparent`,
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        WebkitMaskComposite: 'xor',
        zIndex: 5,
        ...style,
      }}
    >
      <div
        className="border-beam-motion absolute aspect-square"
        style={{
          width: `${size}px`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: `conic-gradient(from 0deg, transparent 0deg, transparent 280deg, ${colorTo} 330deg, ${colorFrom} 360deg)`,
          animation: `border-beam-spin ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
        }}
      />
      <style jsx>{`
        @keyframes border-beam-spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .border-beam-motion {
            animation: none !important;
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
