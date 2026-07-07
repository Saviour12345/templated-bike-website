import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/site.config';
import { routing } from '@/i18n/routing';

const PATHS = ['', '/repair', '/pricing', '/refurbished', '/contact', '/booking', '/privacy', '/terms', '/cookies'];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) languages[locale] = `${SITE_URL}/${locale}${path}`;
    return {
      url: `${SITE_URL}/${routing.defaultLocale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.7,
      alternates: { languages },
    };
  });
}
