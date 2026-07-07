import type { Metadata } from 'next';
import type { Locale } from '../lib/types';

export interface SeoInput {
  title: string;
  description: string;
  /** Canonical site origin, e.g. "https://maxecobike.com" (no trailing slash). */
  baseUrl: string;
  siteName: string;
  locale: Locale;
  /** Path WITHOUT locale prefix, e.g. "/pricing". Use "" for home. */
  path?: string;
  locales?: Locale[];
  defaultLocale?: Locale;
  /** Absolute or root-relative OG image. */
  image?: string;
  noindex?: boolean;
  ogType?: 'website' | 'article';
}

/**
 * Build a Next `Metadata` object with correct canonical + reciprocal hreflang.
 * NL is the default/canonical locale; routes are locale-prefixed (/nl, /en).
 */
export function buildMetadata(input: SeoInput): Metadata {
  const {
    title,
    description,
    baseUrl,
    siteName,
    locale,
    path = '',
    locales = ['nl', 'en'],
    defaultLocale = 'nl',
    image,
    noindex = false,
    ogType = 'website',
  } = input;

  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${baseUrl}/${l}${path}`;
  languages['x-default'] = `${baseUrl}/${defaultLocale}${path}`;

  const canonical = `${baseUrl}/${locale}${path}`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    alternates: { canonical, languages },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
    openGraph: {
      type: ogType,
      title,
      description,
      url: canonical,
      siteName,
      locale,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
