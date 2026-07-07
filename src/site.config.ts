import type { Nap } from '@max/ui';

/**
 * Canonical origin. Override per environment with NEXT_PUBLIC_SITE_URL.
 * Replace all placeholder values below with your shop's real business details.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://your-bike-shop.vercel.app';
export const SITE_NAME = 'Your Bike Shop';

/** Optional integrations — components/handlers no-op safely when unset. */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** Placeholder NAP — edit before going live. Single source for footer + LocalBusiness schema. */
export const NAP: Nap = {
  businessName: 'Your Bike Shop',
  legalName: 'Your Bike Shop B.V.',
  streetAddress: 'Voorbeeldstraat 1',
  postalCode: '1234 AB',
  city: 'Amsterdam',
  region: 'Noord-Holland',
  country: 'NL',
  phone: '+31600000000',
  phoneDisplay: '+31 6 00000000',
  whatsapp: '31600000000',
  email: 'info@yourbikeshop.nl',
  kvk: '00000000',
  btw: 'NL000000000B01',
  openingHours: [
    { days: ['Monday'], opens: '13:00', closes: '18:00' },
    { days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
    { days: ['Saturday', 'Sunday'] },
  ],
  socials: [],
};

/** Address string for the keyless Google Maps embed. */
export const MAP_QUERY = 'Your Bike Shop, Voorbeeldstraat 1, 1234 AB Amsterdam';

/** Google Place ID — set via NEXT_PUBLIC_GOOGLE_PLACE_ID when you have a verified listing. */
export const GOOGLE_PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;

export const SOCIAL = {
  instagramHandle: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE,
  instagramProfileUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  googlePlaceId: GOOGLE_PLACE_ID,
  googleReviewUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL,
} as const;

export const SAME_AS: string[] = [
  ...(NAP.socials?.map((s) => s.url) ?? []),
  SOCIAL.instagramProfileUrl,
  SOCIAL.googleReviewUrl,
].filter((url): url is string => Boolean(url));
