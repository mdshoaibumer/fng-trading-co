'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  magneticPull?: number; // Maximum offset in px (default: 12)
  onClick?: () => void;
  as?: 'div' | 'span';
}

export default function MagneticButton({
  children,
  className = '',
  style = {},
  magneticPull = 12,
  onClick,
  as = 'div',
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 220, mass: 0.1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (clientX - centerX) / (width / 2);
    const deltaY = (clientY - centerY) / (height / 2);

    mouseX.set(deltaX * magneticPull);
    mouseY.set(deltaY * magneticPull);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const Component = as === 'span' ? motion.span : motion.div;

  if (shouldReduceMotion) {
    return (
      <div className={className} style={{ display: 'inline-block', ...style }} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <Component
      ref={ref}
      className={className}
      style={{
        display: 'inline-block',
        x: springX,
        y: springY,
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {children}
    </Component>
  );
}
