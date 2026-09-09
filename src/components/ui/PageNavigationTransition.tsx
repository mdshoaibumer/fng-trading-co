'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Brand-colored page navigation transition system for Future Next Gen.
 * 
 * Features:
 * 1. Ultra-sleek 3px glowing progress beam in FNG brand colors (Deep Forest #1A3D2B -> Eco Lime #8DB833)
 * 2. Floating glassmorphic top pill with eco-lime circular spinner just below the navbar
 * 3. Automatic instant scroll-to-top reset (window.scrollTo(0,0)) on route change
 * 4. Content cascade-down from top trigger
 */
export default function PageNavigationTransition() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPill, setShowPill] = useState(false);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pillTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = useCallback(() => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (pillTimerRef.current) clearTimeout(pillTimerRef.current);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);

    setIsNavigating(true);
    setProgress(15);

    // Only show the floating spinner pill if the page takes more than 150ms to load (avoids visual flicker on instant cached clicks)
    pillTimerRef.current = setTimeout(() => {
      setShowPill(true);
    }, 150);

    // Gradual progress crawl towards 80% while waiting for the next page to mount
    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 40) return prev + 15;
        if (prev < 70) return prev + 6;
        if (prev < 88) return prev + 2;
        return prev;
      });
    }, 120);
  }, []);

  const completeProgress = useCallback(() => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (pillTimerRef.current) clearTimeout(pillTimerRef.current);

    // Complete to 100%
    setProgress(100);

    // Always reset scroll cleanly to the top whenever navigation completes
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      
      // Re-trigger top-down entrance animation on the main content
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.classList.remove('page-enter-from-top');
        // Trigger reflow to restart CSS animation
        void mainContent.offsetWidth;
        mainContent.classList.add('page-enter-from-top');
      }
    }

    // Fade out after completion
    fadeTimerRef.current = setTimeout(() => {
      setIsNavigating(false);
      setShowPill(false);
      setProgress(0);
    }, 240);
  }, []);

  // Intercept click on internal links
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      const targetAttr = anchor.getAttribute('target');

      // Ignore external links, new tabs, downloads, hash-only anchors, or mailto/tel
      if (
        !href ||
        targetAttr === '_blank' ||
        anchor.hasAttribute('download') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        href.startsWith('javascript:')
      ) {
        return;
      }

      // Check if same origin and different destination
      try {
        const targetUrl = new URL(anchor.href, window.location.href);
        const currentUrl = new URL(window.location.href);

        if (targetUrl.origin === currentUrl.origin) {
          // If navigating to the exact same pathname and search, skip
          if (targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search) {
            // If it's a hash jump on the same page, do not trigger loading transition
            if (targetUrl.hash) return;
          }

          // Trigger navigation transition
          startProgress();
        }
      } catch {
        // Ignore invalid URLs
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (pillTimerRef.current) clearTimeout(pillTimerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, [startProgress]);

  // When pathname or searchParams change, the new route has mounted -> complete progress
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    completeProgress();
  }, [pathname, searchParams, completeProgress]);

  if (!isNavigating && progress === 0) {
    return null;
  }

  return (
    <>
      {/* Top Brand Glowing Progress Beam */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3.5px',
          zIndex: 100000,
          pointerEvents: 'none',
          opacity: progress === 100 ? 0 : 1,
          transition: progress === 100 ? 'opacity 220ms ease-out, transform 150ms ease-out' : 'transform 180ms ease-out',
          transformOrigin: '0% 50%',
          transform: `scaleX(${progress / 100})`,
          background: 'linear-gradient(90deg, var(--deep-forest, #1A3D2B) 0%, #3B6149 25%, var(--accent, #8DB833) 75%, #A6D845 100%)',
          boxShadow: '0 0 12px rgba(141, 184, 51, 0.85), 0 0 4px rgba(141, 184, 51, 1)',
        }}
      >
        {/* Glowing Head Bead */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 100%)',
            boxShadow: '0 0 15px 3px rgba(141, 184, 51, 0.9)',
          }}
        />
      </div>

      {/* Floating Top Loading Circle Pill */}
      {showPill && (
        <aside
          aria-label="Loading page"
          style={{
            position: 'fixed',
            top: '76px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 16px',
            borderRadius: '9999px',
            background: 'rgba(15, 42, 28, 0.9)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(141, 184, 51, 0.35)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(141, 184, 51, 0.2)',
            animation: 'fngTopPillEnter 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Eco-Lime Circular Spinner */}
          <div
            style={{
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              border: '2px solid rgba(141, 184, 51, 0.2)',
              borderTopColor: 'var(--accent, #8DB833)',
              animation: 'fngSpinnerRotate 0.75s linear infinite',
            }}
          />
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            FNG <span style={{ color: 'var(--accent, #8DB833)', fontWeight: 600 }}>Loading...</span>
          </span>
        </aside>
      )}

      {/* Inline styles for keyframe animations */}
      <style jsx global>{`
        @keyframes fngSpinnerRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes fngTopPillEnter {
          from {
            opacity: 0;
            transform: translate(-50%, -10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
