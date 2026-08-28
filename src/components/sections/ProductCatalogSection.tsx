import type { Product } from '@/lib/supabase';
import ProductCard from './ProductCard';

/**
 * Shared by the homepage printer catalog and the office-equipment catalog —
 * they were previously two ~98%-identical client components that each did
 * their own client-side fetch (with a loading spinner) against the admin
 * API. This version takes already-fetched data as a prop from a server
 * component, so there's no fetch waterfall, no spinner flash, and only one
 * copy of the card markup to maintain.
 */
export default function ProductCatalogSection({
  products, isAr, basePath, tag, title, subtitle,
}: {
  products: Product[];
  isAr: boolean;
  basePath: string;
  tag: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="catalog-section" style={{
      padding: 'clamp(60px, 10vw, 120px) 0', background: 'linear-gradient(180deg, #FFFFFF 0%, #F4F7F2 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(141,184,51,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 8vw, 80px)' }}>
          <span style={{
            display: 'inline-block', color: '#8DB833', background: 'rgba(141, 184, 51, 0.1)',
            padding: '8px 20px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 700,
            marginBottom: '16px', textTransform: 'uppercase', letterSpacing: isAr ? '0' : '1px',
          }}>
            {tag}
          </span>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 5vw, 4rem)', fontWeight: 800, color: '#1A3D2B', marginBottom: '24px',
            fontFamily: isAr ? 'IBM Plex Sans Arabic, sans-serif' : 'Inter, sans-serif',
            letterSpacing: isAr ? '0' : '-1px',
          }}>
            {title}
          </h2>
          <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.15rem)', color: '#555', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            {subtitle}
          </p>
        </div>

        <div className="catalog-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(16px, 3vw, 32px)', alignItems: 'stretch',
        }}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} isAr={isAr} productUrl={`${basePath}/${product.id}`} />
          ))}
        </div>
      </div>
      <style>{`
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
