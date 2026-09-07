'use client';

import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter((el) => el.offsetParent !== null);
}

/** Hides every element outside `node`'s ancestor chain from assistive tech, up to <body>. */
function hideOthers(node: HTMLElement): () => void {
  const hidden: HTMLElement[] = [];
  let current: HTMLElement | null = node;
  while (current && current !== document.body) {
    const parent: HTMLElement | null = current.parentElement;
    if (parent) {
      Array.from(parent.children).forEach((sibling) => {
        if (sibling === current) return;
        if (sibling.nodeName === 'SCRIPT' || sibling.nodeName === 'STYLE') return;
        const el = sibling as HTMLElement;
        if (!el.hasAttribute('aria-hidden')) {
          el.setAttribute('aria-hidden', 'true');
          hidden.push(el);
        }
      });
    }
    current = parent;
  }
  return () => hidden.forEach((el) => el.removeAttribute('aria-hidden'));
}

/**
 * Wires up the standard dialog/modal accessibility trio for the element `ref` points to:
 * moves focus in on open, traps Tab within it, closes on Escape, hides everything
 * else from assistive tech, and restores focus to the trigger on close.
 */
export function useDialogA11y<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  useEffect(() => {
    if (!open) return;
    const node = ref.current;
    if (!node) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const restoreHidden = hideOthers(node);

    const focusable = getFocusable(node);
    (focusable[0] ?? node).focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = getFocusable(node);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      restoreHidden();
      previouslyFocused?.focus?.();
    };
  }, [open]);

  return ref;
}
