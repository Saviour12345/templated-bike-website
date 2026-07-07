import type { GoogleReview, InstagramPost } from '@max/ui';
import type { AppLocale } from '@/i18n/routing';
import { getPlaceData } from '@/lib/google-places';
import { getInstagramMedia } from '@/lib/instagram';
import { SOCIAL } from '@/site.config';

/**
 * Social-proof seed data (SOCIAL-PROOF-PLAN.md).
 *
 * Reviews — the owner must select which real Google reviews to feature and confirm
 * it's OK to show author names (SOCIAL-PROOF-PLAN §9 / CLAUDE.md hard rule: no fake
 * reviews, no fake AggregateRating). Live-first with a curated fallback (see below).
 *
 * Instagram is live-only (Phase B): the latest posts come straight from the Graph API
 * (`lib/instagram.ts`). When the token/user id is unset or the call fails, this returns
 * `[]` and the InstagramFeed section hides cleanly (acceptance: no "0", graceful empty
 * states) — the build never breaks.
 */

export async function getInstagramPosts(locale: AppLocale, max = 3): Promise<InstagramPost[]> {
  void locale; // reserved for future per-locale caption filtering; unused for now.
  const posts = await getInstagramMedia(max);
  return posts ?? [];
}

/**
 * Live-first reviews. When the Google Places API is reachable (key set, listing
 * resolves, reviews present) we surface the real review cards Google returns
 * (≤5 — Google's hard limit). Otherwise we fall back to the curated set below so
 * the section never empties and the build never breaks.
 */
export async function getReviews(locale: AppLocale): Promise<GoogleReview[]> {
  void locale; // Google mixes languages on one listing; show all, both locales.
  const place = await getPlaceData();
  if (place && place.reviews.length > 0) return place.reviews;
  return getCuratedReviews();
}

/**
 * Curated fallback — real Google reviews transcribed verbatim from the live GBP
 * listing (2026-06-18). Dates are month-level approximations of the relative
 * timestamps Google showed. `sourceUrl` points at the listing (no per-review
 * permalinks; never scrape).
 */
function getCuratedReviews(): GoogleReview[] {
  const sourceUrl = SOCIAL.googleReviewUrl;
  return [
    {
      author: 'Dafni Tsiakiri',
      rating: 5,
      text: 'I totally recommend this place if you have any problems with your bicycle! The people there are really helpful, they speak amazing english and it was really easy to communicate. In regards to their work, they fixed my bicycle very quickly and also checked for things that I didn’t realise were wrong. I 100% recommend them due to their work ethic which was excellent, the time and effort they contributed and their hospitality.',
      reviewedAt: '2026-06-12',
      language: 'en',
      sourceUrl,
    },
    {
      author: 'Mengqing Yu',
      rating: 5,
      text: 'Good service! And students can get 10% discount. Recommend!',
      reviewedAt: '2026-06-12',
      language: 'en',
      sourceUrl,
    },
    {
      author: 'Simon McDonagh',
      rating: 5,
      text: 'Excellent and friendly service. Got my old bike shining and riding like new again!',
      reviewedAt: '2026-03-15',
      language: 'en',
      sourceUrl,
    },
  ];
}

/**
 * Live-first review aggregate. Uses the real Places average + TRUE total count
 * when available, else the last verified GBP snapshot (2026-06-18: 5.0 / 40).
 * Never returns a 0 (CLAUDE.md hard rule — the block hides on empty).
 */
export async function getReviewSummary(): Promise<{ average: number; count: number }> {
  const place = await getPlaceData();
  if (place) return { average: place.rating, count: place.userRatingCount };
  return { average: 5.0, count: 40 };
}
