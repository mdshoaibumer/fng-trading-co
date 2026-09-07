'use client';

import type { ButtonHTMLAttributes, CSSProperties, MouseEvent, ReactNode } from 'react';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  icon: ReactNode;
  /** Required — becomes the button's accessible name. */
  label: string;
  size?: number;
  background?: string;
  hoverBackground?: string;
  color?: string;
  style?: CSSProperties;
}

/**
 * Small circular icon-only button with a consistent shape/hover pattern and
 * an enforced accessible name (the `label` prop is required at the type
 * level, so it's impossible to render an icon button with no aria-label).
 */
export default function IconButton({
  icon,
  label,
  size = 32,
  background = 'transparent',
  hoverBackground,
  color = 'currentColor',
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background,
        border: 'none',
        color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
        ...style,
      }}
      onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
        if (hoverBackground) e.currentTarget.style.background = hoverBackground;
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.background = background;
        onMouseLeave?.(e);
      }}
      {...rest}
    >
      {icon}
    </button>
  );
}
