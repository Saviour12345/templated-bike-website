import type { ArticledataEntry } from '../types';

/**
 * Hand-built Articledata V4 fixture (plan §Verification 2 — mapper unit test).
 * Shaped after the CS docs while real credentials are pending (Phase 0); once a
 * production payload is available, extend this file with a captured sample.
 *
 * Covers: array- and map-form properties, per-object vs article prices, sold /
 * demo / new / price-less / name-less records (all must be hidden), e-bike
 * detection, multi-store objects, object_code-only ids, and an insecure image URL.
 */
export const fixtureEntries: ArticledataEntry[] = [
  // A — used Gazelle city bike: 1 sellable object + 1 sold object.
  {
    article_id: 1001,
    brand: 'Gazelle',
    model: 'Orange C7',
    pos_description: 'Gazelle Orange C7 herenfiets',
    sales_text:
      'Comfortabele stadsfiets met 7 versnellingen, volledig nagekeken in onze werkplaats en klaar voor dagelijks gebruik. Inclusief nieuwe banden en een servicebeurt.',
    properties: [
      { key: 'merk', value: 'Gazelle' },
      { key: 'framemaat', value: 53 },
      { key: 'versnellingen', value: 7 },
      { key: 'kleur', value: 'Zwart' },
    ],
    images: [
      {
        url_large: 'https://cdn.cyclesoftware.nl/images/1001-large.jpg',
        url_thumb: 'https://cdn.cyclesoftware.nl/images/1001-thumb.jpg',
      },
    ],
    objects: [
      {
        object_id: 232432,
        object_code: 'GZ-53',
        available: true,
        is_used: true,
        is_demo: false,
        ecommerce_price_cents: 64950,
        store_id: 1,
      },
      { object_id: 232433, available: false, is_used: true, ecommerce_price_cents: 59900 },
    ],
  },

  // B — Sparta e-bike: map-form properties, battery + group hint, km_age, thumb-only image.
  {
    article_id: 1002,
    brand: 'Sparta',
    model: 'e-Speed M8b',
    properties: {
      Merk: 'Sparta',
      'Frame maat': 'M',
      Accu: 'Bosch 500 Wh',
      Groep: 'E-bikes',
    },
    images: [{ url_large: null, url_thumb: 'https://cdn.cyclesoftware.nl/images/1002-thumb.jpg' }],
    objects: [
      {
        object_id: 232500,
        available: true,
        is_used: true,
        ecommerce_price_cents: 129900,
        km_age: 1250,
        store_id: 1,
      },
    ],
  },

  // C — demo bike: must be hidden.
  {
    article_id: 1003,
    brand: 'Cube',
    model: 'Touring Hybrid',
    objects: [{ object_id: 232600, available: true, is_used: true, is_demo: true, ecommerce_price_cents: 88800 }],
  },

  // D — NEW bike (is_used false): must be hidden from the refurbished marketplace.
  {
    article_id: 1004,
    brand: 'Batavus',
    model: 'Finez',
    objects: [{ object_id: 232700, available: true, is_used: false, ecommerce_price_cents: 49900 }],
  },

  // E — no e-commerce price anywhere: must be hidden.
  {
    article_id: 1005,
    brand: 'Trek',
    model: 'FX 2',
    ecommerce_price_cents: null,
    objects: [{ object_id: 232800, available: true, is_used: true, ecommerce_price_cents: null }],
  },

  // F — no usable name: must be hidden.
  {
    article_id: 1006,
    properties: [],
    objects: [{ object_id: 232900, available: true, is_used: true, ecommerce_price_cents: 30000 }],
  },

  // G — pos_description-only name, disallowed images (insecure + off-allowlist host),
  // one store-less + one store-2 object.
  {
    article_id: 1007,
    pos_description: 'Omafiets 28 inch',
    properties: [{ key: 'merk', value: 'BSP' }],
    images: [
      { url_large: 'http://cdn.cyclesoftware.nl/insecure.jpg' },
      { url_large: 'https://images.example-cdn.com/1007.jpg' },
    ],
    objects: [
      { object_code: 'OMA-28', available: true, is_used: true, ecommerce_price_cents: 17500 },
      { object_id: 233000, available: true, is_used: true, ecommerce_price_cents: 19900, store_id: 2 },
    ],
  },
];
