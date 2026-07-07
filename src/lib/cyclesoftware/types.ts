/**
 * CycleSoftware Articledata V4 response types (`GET /api/v4/articledata/entries.json`).
 *
 * IMPORTANT: built from the CS docs + the CYCLESOFTWARE-SYNC plan while the shop's
 * CS Connect credentials are still pending (Phase 0). Every field is optional and the
 * mapper treats records defensively, so schema drift degrades to "listing hidden",
 * never a crash. Verify field names against a real payload during deploy-verify.
 */

/** Article/object photo on the CS CDN (`cdn.cyclesoftware.nl` — see next.config.mjs). */
export interface ArticledataImage {
  url_large?: string | null;
  url_thumb?: string | null;
}

/**
 * One physical bicycle (per-SKU). This is the unit that becomes a marketplace card:
 * exact e-commerce price, availability, used/demo flags.
 */
export interface ArticledataObject {
  object_id?: number | string | null;
  object_code?: string | null;
  available?: boolean | null;
  is_used?: boolean | null;
  is_demo?: boolean | null;
  /** Exact webshop price in euro cents; preferred over the article-level price. */
  ecommerce_price_cents?: number | null;
  store_id?: number | string | null;
  /** Odometer for e-bikes. */
  km_age?: number | null;
  modified_at?: string | null;
}

export type ArticledataPropertyValue = string | number | boolean | null;

/** Array-form property (`[{ key, value }]`). CS also ships map-form; see mapper. */
export interface ArticledataProperty {
  key?: string | null;
  code?: string | null;
  name?: string | null;
  value?: ArticledataPropertyValue;
}

/**
 * One article (bike model) with its physical objects nested under `objects[]`.
 * `properties` carries the spec sheet (brand, frame size, gear system, …) either as
 * an array of key/value records or as a plain map — the mapper normalizes both.
 */
export interface ArticledataEntry {
  article_id?: number | string | null;
  barcode?: string | null;
  brand?: string | null;
  model?: string | null;
  pos_description?: string | null;
  description?: string | null;
  sales_text?: string | null;
  /** Article-level webshop price in euro cents (fallback when the object has none). */
  ecommerce_price_cents?: number | null;
  properties?: ArticledataProperty[] | Record<string, ArticledataPropertyValue> | null;
  images?: ArticledataImage[] | null;
  objects?: ArticledataObject[] | null;
  modified_at?: string | null;
}

export interface ArticledataPagination {
  next_url?: string | null;
}

export interface ArticledataResponse {
  data?: ArticledataEntry[] | null;
  pagination?: ArticledataPagination | null;
}
