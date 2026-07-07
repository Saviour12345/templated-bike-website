import 'server-only';
import { cache } from 'react';
import type { GoogleReview } from '@max/ui';
import type { AppLocale } from '@/i18n/routing';

/**
 * Server-only Google Places (New) fetcher for the live review block.
 *
 * The API key is a SECRET — this module imports `server-only`, so importing it
 * from a Client Component is a build error. Never import this (or content/social)
 * from a 'use client' file; pass the resolved data down as a serializable prop
 * instead (see layout.tsx → SiteHeader).
 *
 * One cached call per render (React `cache`) and one network call per day
 * (`revalidate: 86400`). Returns `null` on missing key / non-OK / error / empty
 * so callers fall back to the curated reviews and the build never breaks.
 */

/** Public + stable; the API key is the only secret. Override per env if needed. */
const PLACE_ID = process.env.GOOGLE_PLACE_ID ?? 'ChIJZ1_Gyxutx0cRu_cuAXLCzJA';

interface PlacesText {
  text?: string;
  languageCode?: string;
}
interface PlacesReview {
  rating?: number;
  text?: PlacesText;
  originalText?: PlacesText;
  publishTime?: string;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
}
interface PlacesResponse {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesReview[];
}

export interface PlaceData {
  /** True average across ALL ratings (not just the returned cards). */
  rating: number;
  /** True total review count. */
  userRatingCount: number;
  googleMapsUri?: string;
  /** Up to ~5 review texts — Google's hard limit on the Places endpoint. */
  reviews: GoogleReview[];
}

function toLocale(code?: string): AppLocale | undefined {
  if (!code) return undefined;
  if (code.startsWith('nl')) return 'nl';
  if (code.startsWith('en')) return 'en';
  return undefined;
}

export const getPlaceData = cache(async (): Promise<PlaceData | null> => {
  // NOTE: env var name is `Places_API` (exact casing — must match Vercel exactly).
  const apiKey = process.env.Places_API;
  if (!apiKey) return null;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,rating,userRatingCount,googleMapsUri,reviews',
      },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as PlacesResponse;
    if (typeof data.rating !== 'number' || !data.userRatingCount) return null;

    const reviews: GoogleReview[] = (data.reviews ?? [])
      .map((r): GoogleReview | null => {
        const text = r.text?.text ?? r.originalText?.text;
        const author = r.authorAttribution?.displayName;
        if (!text || !author || typeof r.rating !== 'number') return null;
        return {
          author,
          authorPhoto: r.authorAttribution?.photoUri,
          rating: r.rating,
          text,
          reviewedAt: r.publishTime,
          sourceUrl: r.authorAttribution?.uri ?? data.googleMapsUri,
          language: toLocale(r.text?.languageCode ?? r.originalText?.languageCode),
        };
      })
      .filter((r): r is GoogleReview => r !== null);

    return {
      rating: data.rating,
      userRatingCount: data.userRatingCount,
      googleMapsUri: data.googleMapsUri,
      reviews,
    };
  } catch {
    return null;
  }
});
