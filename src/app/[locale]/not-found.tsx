'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

// Branded, localized 404. Rendered inside the [locale] layout, so the Navbar
// and Footer frame it — replacing Next's unstyled default not-found page.
export default function NotFound() {
  const params = useParams();
  const locale = (params?.locale as string) === 'ar' ? 'ar' : 'en';
  const isAr = locale === 'ar';

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
      <h1 style={{ margin: 0 }}>{isAr ? 'الصفحة غير موجودة' : 'Page not found'}</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '480px' }}>
        {isAr
          ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
          : "Sorry, the page you're looking for doesn't exist or has moved."}
      </p>
      <Link href={`/${locale}`} className="btn-primary" style={{ marginTop: '8px' }}>
        {isAr ? 'العودة إلى الرئيسية' : 'Back to home'}
      </Link>
    </main>
  );
}
