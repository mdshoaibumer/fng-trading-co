'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ChevronsLeftRight } from 'lucide-react';

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  altBefore?: string;
  altAfter?: string;
  aspectRatio?: string;
  className?: string;
  isAr?: boolean;
}

/**
 * 21st.dev inspired Image Comparison Slider.
 * Interactive before/after wipe with draggable glass handle, touch & keyboard support.
 */
export default function ImageComparison({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  altBefore = 'Before condition',
  altAfter = 'After condition',
  aspectRatio = '16 / 10',
  className = '',
  isAr = false,
}: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 5) percentage = 5;
    if (percentage > 95) percentage = 95;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handlePointerUp]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-[var(--radius-2xl)] border border-[rgba(141,184,51,0.2)] shadow-[var(--shadow-lg)] ${className}`}
      style={{ aspectRatio }}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* After image (full background) */}
      <div className="absolute inset-0">
        <Image
          src={afterImage}
          alt={altAfter}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          style={{ objectFit: 'cover' }}
        />
        <div
          className="absolute bottom-4 right-4 z-10 rounded-full bg-[rgba(15,42,28,0.85)] px-3.5 py-1 text-xs font-bold text-[var(--accent)] backdrop-blur-md"
        >
          {afterLabel}
        </div>
      </div>

      {/* Before image (clipped by slider) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
        }}
      >
        <Image
          src={beforeImage}
          alt={altBefore}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          style={{ objectFit: 'cover' }}
        />
        <div
          className="absolute bottom-4 left-4 z-10 rounded-full bg-[rgba(0,0,0,0.7)] px-3.5 py-1 text-xs font-bold text-white backdrop-blur-md"
        >
          {beforeLabel}
        </div>
      </div>

      {/* Draggable Divider line */}
      <div
        className="absolute top-0 bottom-0 z-20 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)]"
        style={{
          left: `${sliderPosition}%`,
          transform: 'translateX(-50%)',
        }}
      >
        {/* Glass handle button */}
        <div
          role="slider"
          aria-valuenow={Math.round(sliderPosition)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={isAr ? 'مقارنة قبل وبعد' : 'Before and after comparison slider'}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setSliderPosition((p) => Math.max(5, p - 5));
            if (e.key === 'ArrowRight') setSliderPosition((p) => Math.min(95, p + 5));
          }}
          className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-white bg-[var(--primary)] text-white shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-transform hover:scale-110 active:scale-95"
        >
          <ChevronsLeftRight size={18} />
        </div>
      </div>
    </div>
  );
}
