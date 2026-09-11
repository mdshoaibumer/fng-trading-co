import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Leaf, Layers } from 'lucide-react';

/**
 * Home-page bridge between the printer hero and the printer catalogue: tells a
 * visitor that the machines they're about to browse can run on Eco Inks, and
 * sends them to the Eco Inks page. Server-rendered — no client JS.
 *
 * Copy is deliberately limited to plain product facts (what each toner line
 * is); performance and environmental claims stay on the Eco Inks page.
 */
export default async function EcoInksTeaserSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'ecoTeaser' });
  const isAr = locale === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const lines = [
    { key: 'green', Icon: Leaf },
    { key: 'premium', Icon: Layers },
  ] as const;

  return (
    <section id="eco-inks-teaser" className="eco-teaser" aria-labelledby="eco-teaser-title">
      <div className="container">
        <div className="eco-teaser-card">
          <div className="eco-teaser-copy">
            <span className="section-tag">{t('tag')}</span>
            <h2 id="eco-teaser-title" className="eco-teaser-title">{t('title')}</h2>
            <p className="eco-teaser-subtitle">{t('subtitle')}</p>

            <ul className="eco-teaser-lines">
              {lines.map(({ key, Icon }) => (
                <li key={key} className="eco-teaser-line">
                  <span className="eco-teaser-line-icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={1.9} />
                  </span>
                  <span>
                    <span className="eco-teaser-line-name">
                      {t(`${key}.name`)}
                      <span className="eco-teaser-line-type">{t(`${key}.type`)}</span>
                    </span>
                    <span className="eco-teaser-line-desc">{t(`${key}.desc`)}</span>
                  </span>
                </li>
              ))}
            </ul>

            <Link href={`/${locale}/eco-inks`} className="btn-primary eco-teaser-cta">
              {t('cta')}
              <Arrow size={18} aria-hidden="true" />
            </Link>
          </div>

          {/* position is also set inline: next/image `fill` needs a positioned
              parent even if the stylesheet hasn't applied yet. */}
          <div className="eco-teaser-media" style={{ position: 'relative' }}>
            <Image
              src="/toners/green/green-toner-set.png"
              alt={t('imageAlt')}
              fill
              sizes="(max-width: 900px) 100vw, 480px"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
