import type { CSSProperties } from 'react';
import type { Product } from '@/lib/supabase';
import ProductCard from './ProductCard';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import Reveal from '@/components/ui/Reveal';

/**
 * Shared by the homepage printer catalog and the office-equipment catalog —
 * they were previously two ~98%-identical client components that each did
 * their own client-side fetch (with a loading spinner) against the admin
 * API. This version takes already-fetched data as a prop from a server
 * component, so there's no fetch waterfall, no spinner flash, and only one
 * copy of the card markup to maintain.
 */
export default function ProductCatalogSection({
  products, error, isAr, basePath, tag, title, subtitle, asH1 = false,
}: {
  products: Product[];
  /** True when the catalog fetch itself failed — distinct from a successful fetch that found zero rows. */
  error?: boolean;
  isAr: boolean;
  basePath: string;
  tag: string;
  title: string;
  subtitle: string;
  asH1?: boolean;
}) {
  const HeadingTag = asH1 ? 'h1' : 'h2';

  return (
    <section className="catalog-section" style={{
      // As a page's opening section (asH1: /printers, /equipment) the top
      // padding must clear the fixed header (~64px on phones, ~98px desktop);
      // 60px let the eyebrow slide under it on mobile. Mid-page (home) keeps
      // the original rhythm.
      padding: asH1 ? 'clamp(112px, 12vw, 168px) 0 clamp(60px, 10vw, 120px)' : 'clamp(60px, 10vw, 120px) 0',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F4F7F2 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div className="catalog-ambient-blob" style={{
        position: 'absolute', top: '-10%', right: '-5%', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(141,184,51,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div className="container">
        <Reveal style={{ textAlign: 'center', marginBottom: 'clamp(40px, 8vw, 80px)' }}>
          <span style={{
            display: 'inline-block', color: 'var(--accent-text)', background: 'rgba(141, 184, 51, 0.1)',
            padding: '8px 20px', borderRadius: 'var(--radius-2xl)', fontSize: '0.9rem', fontWeight: 700,
            marginBottom: '16px', textTransform: 'uppercase', letterSpacing: isAr ? '0' : '1px',
          }}>
            {tag}
          </span>
          <HeadingTag style={{
            fontSize: 'clamp(1.8rem, 5vw, 4rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: '24px',
            fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif',
            letterSpacing: isAr ? '0' : '-1px',
          }}>
            {title}
          </HeadingTag>
          <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.15rem)', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            {subtitle}
          </p>
        </Reveal>

        {error ? (
          <ErrorState
            title={isAr ? 'تعذّر تحميل الكتالوج' : "Couldn't load the catalog"}
            description={isAr ? 'حدث خطأ أثناء تحميل المنتجات. يرجى المحاولة مرة أخرى.' : 'Something went wrong while loading products. Please try again.'}
            retryLabel={isAr ? 'إعادة المحاولة' : 'Retry'}
            retryHref={basePath}
          />
        ) : products.length === 0 ? (
          <EmptyState
            title={isAr ? 'لا تتوفر أي منتجات حالياً' : 'No products are currently available'}
            description={isAr ? 'يرجى المراجعة لاحقاً.' : 'Please check back soon.'}
          />
        ) : (
          // Fixed column counts, not auto-fit: auto-fit sizes the whole grid's
          // column count once from the container width, so any row short of a
          // full set (e.g. 6 items in 4 columns = a trailing row of 2) left
          // visibly empty tracks instead of the cards growing to fill them.
          // Three columns divides today's catalog evenly and keeps a partial
          // trailing row short and unremarkable as it grows — capped at the
          // actual item count too (via --catalog-count, read via CSS min() at
          // every breakpoint below), so a thin catalog like a single-item
          // equipment line doesn't strand one card in an otherwise-empty row.
          <div className="catalog-grid" style={{
            display: 'grid', gridTemplateColumns: `repeat(${Math.min(3, products.length)}, 1fr)`,
            gap: 'clamp(16px, 3vw, 32px)', alignItems: 'stretch',
            ...(products.length < 3
              ? { maxWidth: `${products.length * 380 + (products.length - 1) * 32}px`, margin: '0 auto' }
              : {}),
            '--catalog-count': products.length,
          } as CSSProperties}>
            {products.map((product, i) => (
              <Reveal key={product.id} delay={Math.min(i, 5) * 90} style={{ display: 'flex' }}>
                <ProductCard product={product} isAr={isAr} productUrl={`${basePath}/${product.id}`} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .catalog-ambient-blob { animation: catalogBlobDrift 16s ease-in-out infinite; }
        }
        @keyframes catalogBlobDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-4%, 3%) scale(1.08); }
        }
        @media (max-width: 1080px) {
          .catalog-grid { grid-template-columns: repeat(min(2, var(--catalog-count)), 1fr) !important; }
        }
        @media (max-width: 768px) {
          .catalog-grid {
            grid-template-columns: 1fr !important;
            max-width: 420px !important;
            margin: 0 auto !important;
          }
        }
      `}</style>
    </section>
  );
}
