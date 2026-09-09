'use client';

import { useId, type CSSProperties } from 'react';

interface AnimatedBeamProps {
  className?: string;
  duration?: number;
  reverse?: boolean;
  colorFrom?: string;
  colorTo?: string;
  style?: CSSProperties;
  height?: number;
}

/**
 * 21st.dev inspired Animated Flowing Beam.
 * Renders an SVG connector line with a continuous flowing energy pulse.
 * Fully GPU-accelerated and direction/RTL aware.
 */
export default function AnimatedBeam({
  className = '',
  duration = 3,
  reverse = false,
  colorFrom = 'var(--accent)',
  colorTo = 'var(--deep-forest)',
  style = {},
  height = 3,
}: AnimatedBeamProps) {
  const id = useId();

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height: `${height * 3}px`, display: 'flex', alignItems: 'center', ...style }}
      aria-hidden="true"
    >
      <svg
        className="w-full"
        height={height * 2}
        viewBox="0 0 100 2"
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={`beam-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorTo} stopOpacity="0.1" />
            <stop offset="40%" stopColor={colorFrom} stopOpacity="0.3" />
            <stop offset="50%" stopColor={colorFrom} stopOpacity="1" />
            <stop offset="60%" stopColor={colorFrom} stopOpacity="0.3" />
            <stop offset="100%" stopColor={colorTo} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Base inactive line */}
        <line
          x1="0"
          y1="1"
          x2="100"
          y2="1"
          stroke="rgba(141, 184, 51, 0.15)"
          strokeWidth={height * 0.7}
          strokeDasharray="3 3"
        />

        {/* Flowing energy pulse */}
        <line
          x1="0"
          y1="1"
          x2="100"
          y2="1"
          stroke={`url(#beam-grad-${id})`}
          strokeWidth={height}
          className="animated-beam-flow"
        />
      </svg>
      <style jsx>{`
        .animated-beam-flow {
          stroke-dasharray: 25 75;
          animation: beamFlow ${duration}s linear infinite ${reverse ? 'reverse' : 'normal'};
        }
        @keyframes beamFlow {
          from {
            stroke-dashoffset: 100;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animated-beam-flow {
            animation: none !important;
            stroke-dasharray: none;
            stroke-opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}
