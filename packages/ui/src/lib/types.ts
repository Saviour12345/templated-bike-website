/** Shared domain types used across components and the SEO/schema helpers. */

export type Locale = 'nl' | 'en';

export interface NavLink {
  href: string;
  label: string;
  /** Optional child links for dropdowns / mega-menus. */
  children?: NavLink[];
}

export interface SocialLink {
  platform:
    | 'linkedin'
    | 'facebook'
    | 'instagram'
    | 'whatsapp'
    | 'telegram'
    | 'tiktok'
    | 'snapchat'
    | 'youtube';
  url: string;
  label?: string;
}

/** A single opening-hours rule. `days` use schema.org day names (Monday…Sunday). */
export interface OpeningHours {
  days: Array<
    'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  >;
  /** 24h "HH:MM"; omit both opens/closes for a closed day. */
  opens?: string;
  closes?: string;
}

/** Name / address / phone — the single source feeding footer + LocalBusiness schema. */
export interface Nap {
  businessName: string;
  legalName?: string;
  /** Street omitted until the client provides it (Magic Touch / Globus). */
  streetAddress?: string;
  postalCode?: string;
  city: string;
  region?: string;
  country: string; // ISO 3166-1 alpha-2, e.g. "NL"
  /** E.164 for links, e.g. "+31615863403". */
  phone: string;
  /** Human display, e.g. "+31 6 15863403". */
  phoneDisplay?: string;
  email: string;
  /** wa.me link target without "+", e.g. "31615863403". */
  whatsapp?: string;
  openingHours?: OpeningHours[];
  geo?: { lat: number; lng: number };
  socials?: SocialLink[];
  /** Registry identifiers for trust/footer (KVK/BTW). */
  kvk?: string;
  btw?: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  href?: string;
  /** Icon key resolved by the app (keeps @max/ui icon-set agnostic). */
  icon?: string;
  /** Optional indicative price label, e.g. "vanaf €49,99". */
  priceLabel?: string;
}

export interface PricingTier {
  name: string;
  /** Display price, pre-formatted by the app, e.g. "€69,99" or "vanaf €119,99". */
  price: string;
  /** Optional struck-through anchor price (Globus). */
  anchorPrice?: string;
  period?: string; // e.g. "per beurt", "eerste jaar"
  note?: string; // e.g. "excl. 21% btw"
  features: string[];
  highlighted?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  /** Optional machine value for schema Offer.price (number, no currency). */
  priceValue?: number;
  priceCurrency?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  /** 1–5; only rendered when real. */
  rating?: number;
}

export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * A single Instagram post, self-hosted (CLAUDE/SOCIAL-PROOF rule: never hotlink
 * Instagram's CDN). `src` points at our own CDN/Sanity; the tile links out to the
 * original via `permalink`. Same shape whether curated by hand or synced later.
 */
export interface InstagramPost {
  /** Self-hosted image URL (Sanity CDN or /public). */
  src: string;
  alt: string;
  /** Intrinsic dimensions — fixed aspect ratio keeps CLS at zero. */
  width: number;
  height: number;
  caption?: string;
  /** URL of the original post; the tile links here (opens in a new tab). */
  permalink: string;
  mediaType?: 'image' | 'carousel' | 'video';
}

/**
 * A public Google review, curated into the CMS now (or synced later — same shape).
 * Displayed for humans/trust only: we deliberately never emit self-serving
 * Review/AggregateRating schema (SOCIAL-PROOF-PLAN §7).
 */
export interface GoogleReview {
  author: string;
  /** Optional, self-hosted reviewer avatar. */
  authorPhoto?: string;
  /** 1–5. */
  rating: number;
  text: string;
  /** ISO date string, e.g. "2026-03-14". */
  reviewedAt?: string;
  /** Link to the review or the listing on Google. */
  sourceUrl?: string;
  /** Original language — lets the app filter reviews per locale later. */
  language?: Locale;
}

/** Trust stat — the component refuses to render a zero/empty value (CLAUDE.md hard rule). */
export interface TrustStat {
  value: string | number;
  label: string;
}
