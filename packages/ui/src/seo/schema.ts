/**
 * Schema.org JSON-LD builders. Plain objects → pass to <JsonLd data={...} />.
 * Validate output in Google Rich Results Test before launch (Workstream 5).
 */
import type { FaqItem, Nap, OpeningHours, PricingTier } from '../lib/types';

/** LocalBusiness subtypes we use across the three sites. */
export type LocalBusinessType =
  | 'LocalBusiness'
  | 'BikeStore'
  | 'HomeAndConstructionBusiness'
  | 'ProfessionalService'
  | 'Plumber'
  | 'Electrician'
  | 'GeneralContractor'
  | 'Organization';

const dayUrl = (day: string) => `https://schema.org/${day}`;

export function openingHoursSpecification(hours: OpeningHours[]) {
  return hours
    .filter((h) => h.opens && h.closes)
    .map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map(dayUrl),
      opens: h.opens,
      closes: h.closes,
    }));
}

function postalAddress(nap: Nap) {
  return {
    '@type': 'PostalAddress',
    ...(nap.streetAddress ? { streetAddress: nap.streetAddress } : {}),
    ...(nap.postalCode ? { postalCode: nap.postalCode } : {}),
    addressLocality: nap.city,
    ...(nap.region ? { addressRegion: nap.region } : {}),
    addressCountry: nap.country,
  };
}

export interface LocalBusinessSchemaInput {
  type: LocalBusinessType;
  nap: Nap;
  /** Canonical site URL, e.g. "https://maxecobike.com". */
  url: string;
  description?: string;
  /** Absolute logo/image URLs. */
  image?: string[];
  priceRange?: string; // e.g. "€€"
  /** City/region names served. */
  areaServed?: string[];
  /** Profile URLs (social + listings). */
  sameAs?: string[];
}

/**
 * Parametrized LocalBusiness factory — one call per site.
 * `geo`, `openingHours`, `sameAs`, address fields all flow from the NAP object,
 * so footer and schema can never drift.
 */
export function localBusinessSchema(input: LocalBusinessSchemaInput) {
  const { type, nap, url, description, image, priceRange, areaServed, sameAs } = input;
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}/#business`,
    name: nap.businessName,
    ...(nap.legalName ? { legalName: nap.legalName } : {}),
    url,
    ...(description ? { description } : {}),
    ...(image && image.length ? { image } : {}),
    telephone: nap.phone,
    email: nap.email,
    address: postalAddress(nap),
    ...(nap.geo ? { geo: { '@type': 'GeoCoordinates', latitude: nap.geo.lat, longitude: nap.geo.lng } } : {}),
    ...(nap.openingHours?.length
      ? { openingHoursSpecification: openingHoursSpecification(nap.openingHours) }
      : {}),
    ...(priceRange ? { priceRange } : {}),
    ...(areaServed && areaServed.length
      ? { areaServed: areaServed.map((name) => ({ '@type': 'City', name })) }
      : {}),
    ...(sameAs && sameAs.length ? { sameAs } : {}),
    ...(nap.kvk ? { vatID: nap.btw, identifier: nap.kvk } : {}),
  };
}

export interface ServiceSchemaInput {
  name: string;
  description?: string;
  url: string;
  providerUrl: string;
  serviceType?: string;
  areaServed?: string[];
}

export function serviceSchema(input: ServiceSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    ...(input.serviceType ? { serviceType: input.serviceType } : {}),
    url: input.url,
    provider: { '@id': `${input.providerUrl}/#business` },
    ...(input.areaServed && input.areaServed.length
      ? { areaServed: input.areaServed.map((name) => ({ '@type': 'City', name })) }
      : {}),
  };
}

/** OfferCatalog built from pricing tiers (Eco Bike packages, Globus packages). */
export function offerCatalogSchema(name: string, tiers: PricingTier[], currency = 'EUR') {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name,
    itemListElement: tiers.map((tier) => ({
      '@type': 'Offer',
      name: tier.name,
      ...(tier.priceValue !== undefined
        ? { price: tier.priceValue, priceCurrency: tier.priceCurrency ?? currency }
        : {}),
      ...(tier.features.length ? { description: tier.features.join('; ') } : {}),
    })),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export interface OrganizationSchemaInput {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  description?: string;
}

export function organizationSchema(input: OrganizationSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${input.url}/#org`,
    name: input.name,
    url: input.url,
    ...(input.logo ? { logo: input.logo } : {}),
    ...(input.description ? { description: input.description } : {}),
    ...(input.sameAs && input.sameAs.length ? { sameAs: input.sameAs } : {}),
  };
}
