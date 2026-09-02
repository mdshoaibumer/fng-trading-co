'use client';

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';

/**
 * Scroll-reveal wrapper: children start slightly offset and transparent and
 * ease into place the first time they enter the viewport. Only `opacity` and
 * `transform` are animated (compositor-friendly, no layout or paint work), so
 * it is cheap enough to wrap every card in a grid.
 *
 * - `delay` staggers siblings (e.g. `index * 80`).
 * - `from` picks the direction: 'up' (default), 'down', 'start' / 'end'
 *   (logical, so it mirrors correctly under RTL), or 'scale'.
 * - Respects prefers-reduced-motion and environments without
 *   IntersectionObserver by rendering the final state immediately.
 * - Server-rendered HTML carries the hidden state, so there is no flash of
 *   un-animated content; a client that never runs JS still sees everything
 *   because the fallback below flips to visible after a short timeout.
 */
export default function Reveal({
  children,
  delay = 0,
  from = 'up',
  distance = 28,
  duration = 700,
  threshold = 0.15,
  once = true,
  as: Tag = 'div',
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  from?: 'up' | 'down' | 'start' | 'end' | 'scale' | 'none';
  distance?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // One-off: no observer to subscribe to in this environment, so the
      // element simply shows. Not a cascading update — it runs once per mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(node);
    // Safety net: if the observer never fires (e.g. the element is already
    // fully past the viewport on a restored scroll position), show it anyway.
    const fallback = setTimeout(() => setVisible(true), 2500);
    return () => { observer.disconnect(); clearTimeout(fallback); };
  }, [threshold, once]);

  const hidden: string = (() => {
    switch (from) {
      case 'down': return `translate3d(0, ${-distance}px, 0)`;
      case 'start': return `translate3d(calc(var(--reveal-dir, 1) * ${-distance}px), 0, 0)`;
      case 'end': return `translate3d(calc(var(--reveal-dir, 1) * ${distance}px), 0, 0)`;
      case 'scale': return 'scale(0.92)';
      case 'none': return 'none';
      default: return `translate3d(0, ${distance}px, 0)`;
    }
  })();

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : hidden,
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
}
