'use client';

import dynamic from 'next/dynamic';

// Code-split out of the initial bundle — the panel is closed by default on
// every page, so there's no reason to ship framer-motion (its only consumer)
// before a visitor actually opens the chat.
const AIChatWidget = dynamic(() => import('./AIChatWidget'), { ssr: false });

export default function ChatWidgetLoader({ welcomeMessage }: { welcomeMessage?: string }) {
  return <AIChatWidget welcomeMessage={welcomeMessage} />;
}
