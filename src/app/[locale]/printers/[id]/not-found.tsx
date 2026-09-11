'use client';

import CatalogNotFound from '@/components/ui/CatalogNotFound';

// Rendered when the printer id doesn't exist. Points back to the catalog the
// visitor was browsing rather than the homepage.
export default function PrinterNotFound() {
  return <CatalogNotFound catalog="printers" />;
}
