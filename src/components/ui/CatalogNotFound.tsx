'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const COPY = {
  printers: {
    en: { title: 'Printer not found', body: "This printer isn't in our catalog any more, or the link is wrong.", cta: 'Back to printers' },
    ar: { title: 'الطابعة غير موجودة', body: 'هذه الطابعة لم تعد في الكتالوج، أو أن الرابط غير صحيح.', cta: 'العودة إلى الطابعات' },
  },
  equipment: {
    en: { title: 'Item not found', body: "This item isn't in our catalog any more, or the link is wrong.", cta: 'Back to office equipment' },
    ar: { title: 'المنتج غير موجود', body: 'هذا المنتج لم يعد في الكتالوج، أو أن الرابط غير صحيح.', cta: 'العودة إلى التجهيزات المكتبية' },
  },
} as const;

// Same frame as the locale-level not-found page, but the way out leads back
// to the catalog the visitor came from instead of the homepage.
export default function CatalogNotFound({ catalog }: { catalog: keyof typeof COPY }) {
  const params = useParams();
  const locale = (params?.locale as string) === 'ar' ? 'ar' : 'en';
  const isAr = locale === 'ar';
  const c = COPY[catalog][locale];

  return (
    <main
      dir={isAr ? 'rtl' : 'ltr'}
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '96px 24px',
        gap: '16px',
      }}
    >
      <span className="section-tag">{isAr ? 'خطأ ٤٠٤' : 'Error 404'}</span>
      <h1 style={{ margin: 0 }}>{c.title}</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '480px' }}>{c.body}</p>
      <Link href={`/${locale}/${catalog}`} className="btn-primary" style={{ marginTop: '8px' }}>
        {c.cta}
      </Link>
    </main>
  );
}
