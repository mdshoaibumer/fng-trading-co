'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { StyleRegistry, createStyleRegistry } from 'styled-jsx';

/**
 * Server-renders styled-jsx rules (App Router pattern from the Next.js
 * "CSS-in-JS" guide). Without it, `<style jsx>` blocks only arrive once the
 * client hydrates, so the first paint uses inline styles alone — e.g. on
 * phones the Navbar showed its full desktop link row, overlapping the logo,
 * until JavaScript loaded.
 */
export default function StyledJsxRegistry({ children }: { children: React.ReactNode }) {
  // Create the stylesheet once (lazy initial state).
  const [jsxStyleRegistry] = useState(() => createStyleRegistry());

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles();
    jsxStyleRegistry.flush();
    return <>{styles}</>;
  });

  return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>;
}
