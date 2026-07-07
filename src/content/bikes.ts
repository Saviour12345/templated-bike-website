import { cache } from 'react';
import type { AppLocale } from '@/i18n/routing';
import { fetchArticledataEntries, isCycleSoftwareConfigured } from '@/lib/cyclesoftware/client';
import { mapArticledataToListings } from '@/lib/cyclesoftware/map-to-listing';

const pick = <T,>(locale: AppLocale, nl: T, en: T): T => (locale === 'en' ? en : nl);

export type BikeCategory = 'bike' | 'ebike';

export interface BikeListing {
  /** URL-safe id (`obj-<object_id>` for live stock), also the card anchor and ?bike= value. */
  slug: string;
  /** CycleSoftware object_id — the shop's reference for WhatsApp enquiries + analytics. */
  objectId?: number;
  name: string;
  /** Price in euros. Exact for live per-SKU listings; a "vanaf" floor when `priceIsFrom`. */
  price: number;
  /** True for seed type-level cards ("vanaf €150"); live CS listings have exact prices. */
  priceIsFrom?: boolean;
  category: BikeCategory;
  /** Localized pill, e.g. "Gereviseerd" / "Refurbished" / "E-bike". */
  badge: string;
  /** Localized 1–2 line teaser. */
  blurb: string;
  /** Localized feature bullets (≤3). */
  features: string[];
  /** Compact spec line, e.g. "Gazelle · maat 53 cm · 7 versnellingen". */
  spec?: string;
  /** Sold/reserved bikes are filtered out upstream; kept for a future sold-badge phase. */
  available: boolean;
  /** Highest-value live bike (or the static seed flag) — accent ring + home-page feature. */
  featured?: boolean;
  /** Badge background + illustration glyph color. */
  tint: string;
  /** Text color on the tint. */
  tintFg: string;
  /** Illustration-fallback panel wash. */
  wash: string;
  /** Real photo (local under /public or CS CDN). When absent, the card shows a branded illustration. */
  image?: string;
}

/**
 * Refurbished catalog (CYCLESOFTWARE-SYNC plan).
 *
 * Live-first: when CS Connect credentials are set, every available refurbished
 * bicycle object from the CycleSoftware Articledata V4 feed becomes one card
 * (exact price, photo, spec). The underlying fetch goes through Next's Data
 * Cache (15 min revalidate + `cyclesoftware` tag — see lib/cyclesoftware/client.ts),
 * so this is cheap to call per request.
 *
 * Fallbacks (the build never breaks):
 * - creds unset (Phase 0 pending) or API error → seed catalog below;
 * - API reachable but zero sellable bikes → `[]` (that's the truth — the
 *   refurbished page shows its empty-state note + enquiry form instead).
 *
 * React `cache` dedupes within one render pass (layout + page both call this).
 */
export const getBikesForSale = cache(async (locale: AppLocale): Promise<BikeListing[]> => {
  if (isCycleSoftwareConfigured()) {
    const entries = await fetchArticledataEntries();
    if (entries) {
      return mapArticledataToListings(entries, locale, {
        storeId: process.env.CYCLESOFTWARE_STORE_ID || undefined,
      });
    }
  }
  return getSeedBikes(locale);
});

/**
 * Seed catalog — the pre-integration type-level card with "from" pricing.
 * Serves until CS Connect is enabled, and as the safety net when the API errors.
 */
function getSeedBikes(locale: AppLocale): BikeListing[] {
  return [
    {
      slug: 'stadsfiets',
      name: pick(locale, 'Stadsfiets', 'City bike'),
      price: 150,
      priceIsFrom: true,
      category: 'bike',
      available: true,
      featured: true,
      badge: pick(locale, 'Instapmodel', 'Entry level'),
      blurb: pick(
        locale,
        'Volledig nagekeken Hollandse stadsfiets, ideaal voor studenten en ritjes door de stad.',
        'Fully serviced Dutch city bike, ideal for students and getting around town.',
      ),
      features: pick(
        locale,
        ['Enkele versnelling of Nexus 3', 'Nieuwe banden waar nodig', 'Servicebeurt inbegrepen'],
        ['Single-speed or Nexus 3', 'New tyres where needed', 'Service check included'],
      ),
      tint: '#1e3a8a',
      tintFg: '#ffffff',
      wash: '#e8eef8',
      image: '/img/sale/stadsfiets.jpg',
    },
  ];
}

/** The featured refurbished bike (highest-value live listing, or the seed card), surfaced on the home page. */
export async function getFeaturedBike(locale: AppLocale): Promise<BikeListing | undefined> {
  return (await getBikesForSale(locale)).find((b) => b.featured);
}
