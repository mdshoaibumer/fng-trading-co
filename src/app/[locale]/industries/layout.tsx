// Metadata for this route is set by the sibling page.tsx's own generateMetadata,
// which Next always uses over a layout's — a layout-level generateMetadata here
// would be silently discarded, so this stays a pure passthrough.
export default function IndustriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
