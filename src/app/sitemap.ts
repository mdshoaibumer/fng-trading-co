import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteContact';
import { supabaseAdmin } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  
  // Static pages in both languages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/eco-inks',
    '/equipment',
    '/faq',
    '/industries',
    '/printers',
    '/printer-parts',
    '/sourcing',
    '/sustainability',
    '/privacy-policy',
    '/terms',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static pages
  for (const page of staticPages) {
    sitemapEntries.push({
      url: `${baseUrl}/ar${page}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: page === '' ? 1.0 : 0.8,
    });
    sitemapEntries.push({
      url: `${baseUrl}/en${page}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: page === '' ? 0.9 : 0.7,
    });
  }

  // Add dynamic products from Supabase
  try {
    const { data: products, error } = await supabaseAdmin
      .from('printers')
      .select('id, created_at');

    if (!error && products) {
      for (const prod of products) {
        const isEquipment = prod.id.startsWith('eq-');
        const path = isEquipment ? `/equipment/${prod.id}` : `/printers/${prod.id}`;
        const lastMod = prod.created_at ? new Date(prod.created_at) : new Date();

        sitemapEntries.push({
          url: `${baseUrl}/ar${path}`,
          lastModified: lastMod,
          changeFrequency: 'weekly',
          priority: 0.6,
        });
        sitemapEntries.push({
          url: `${baseUrl}/en${path}`,
          lastModified: lastMod,
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    }
  } catch (err) {
    console.error('Sitemap dynamic generation error:', err);
  }

  return sitemapEntries;
}
