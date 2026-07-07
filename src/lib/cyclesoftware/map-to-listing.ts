import type { AppLocale } from '@/i18n/routing';
import type { BikeListing } from '@/content/bikes';
import type {
  ArticledataEntry,
  ArticledataObject,
  ArticledataPropertyValue,
} from './types';

/**
 * Pure CycleSoftware → `BikeListing` mapper (CYCLESOFTWARE-SYNC plan, Phase 1).
 *
 * Deliberately free of `server-only` / Next imports so the fixture-based vitest
 * suite (map-to-listing.test.ts) can exercise it directly. All imports from app
 * modules are type-only (erased at runtime).
 *
 * Every available, non-demo, used object with a name and an e-commerce price
 * becomes one marketplace card. Objects missing those minimum fields are hidden
 * (plan §Risks: incomplete CS data must degrade to "card not shown", never to a
 * broken card).
 */

const pick = <T,>(locale: AppLocale, nl: T, en: T): T => (locale === 'en' ? en : nl);

/** Card colors, mirroring the seed catalog's palette. */
const TINTS = {
  bike: { tint: '#1e3a8a', tintFg: '#ffffff', wash: '#e8eef8' },
  ebike: { tint: '#ea580c', tintFg: '#ffffff', wash: '#fef3e8' },
} as const;

const BLURB_MAX = 140;

// Property keys (normalized: lowercased, non-alphanumerics stripped) that carry
// each spec. CS property names vary per shop/language — extend as real payloads
// are observed during deploy-verify.
const BRAND_KEYS = ['merk', 'brand'];
const MODEL_KEYS = ['model'];
const FRAME_SIZE_KEYS = ['framemaat', 'framesize', 'framehoogte', 'frameheight', 'maat', 'size'];
const GEAR_KEYS = ['versnellingen', 'aantalversnellingen', 'gears', 'numberofgears', 'gearsystem', 'versnellingssysteem'];
const COLOR_KEYS = ['kleur', 'framekleur', 'color', 'colour', 'framecolor'];
const BATTERY_KEYS = ['accu', 'accucapaciteit', 'accutype', 'battery', 'batterycapacity', 'batterytype'];
/** Keys whose VALUE may reveal the bike category (e-bike vs regular). */
const CATEGORY_KEYS = ['groep', 'group', 'categorie', 'category', 'producttype', 'soort', 'fietstype', 'biketype', 'dst', 'type'];

const EBIKE_PATTERN = /e-?bike|elektr|electric|pedelec/i;

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * CS ships `properties` either as `[{ key, value }]` records or as a plain map.
 * Normalize both into a flat string map with normalized keys.
 */
export function normalizeProperties(entry: ArticledataEntry): Record<string, string> {
  const out: Record<string, string> = {};
  const add = (key: string | null | undefined, value: ArticledataPropertyValue | undefined) => {
    if (!key || value === null || value === undefined) return;
    const text = String(value).trim();
    if (text) out[normalizeKey(key)] = text;
  };

  const props = entry.properties;
  if (Array.isArray(props)) {
    for (const p of props) add(p.key ?? p.code ?? p.name, p.value);
  } else if (props && typeof props === 'object') {
    for (const [key, value] of Object.entries(props)) add(key, value);
  }
  return out;
}

function firstProp(props: Record<string, string>, keys: string[]): string | undefined {
  for (const key of keys) {
    if (props[key]) return props[key];
  }
  return undefined;
}

/**
 * Default client filter (plan §0.3 — final rules TBD with the shop):
 * only sellable stock: available, not a demo bike, explicitly marked used/refurb.
 * `is_used === true` is strict on purpose — a new bike leaking onto the
 * "Refurbished" page (wrong condition, wrong schema.org markup) is worse than a
 * sloppily-flagged refurb staying hidden; the client checklist makes the shop
 * maintain the flag.
 */
export function passesClientFilter(entry: ArticledataEntry, obj: ArticledataObject): boolean {
  void entry;
  return obj.available === true && obj.is_demo !== true && obj.is_used === true;
}

function detectCategory(
  entry: ArticledataEntry,
  obj: ArticledataObject,
  props: Record<string, string>,
): BikeListing['category'] {
  const categoryHints = CATEGORY_KEYS.map((k) => props[k]).filter(Boolean).join(' ');
  const nameHints = [entry.brand, entry.model, entry.pos_description, entry.description].filter(Boolean).join(' ');
  if (EBIKE_PATTERN.test(`${categoryHints} ${nameHints}`)) return 'ebike';
  if (firstProp(props, BATTERY_KEYS)) return 'ebike';
  if (typeof obj.km_age === 'number' && obj.km_age > 0) return 'ebike';
  return 'bike';
}

function cleanWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function buildName(entry: ArticledataEntry, props: Record<string, string>): string | undefined {
  const brand = cleanWhitespace(entry.brand ?? firstProp(props, BRAND_KEYS) ?? '');
  const model = cleanWhitespace(entry.model ?? firstProp(props, MODEL_KEYS) ?? '');
  if (model) {
    // Avoid "Gazelle Gazelle Orange" when the model already includes the brand.
    return brand && !model.toLowerCase().startsWith(brand.toLowerCase())
      ? cleanWhitespace(`${brand} ${model}`)
      : model;
  }
  // A brand alone ("BSP") is not a product name — prefer the POS description,
  // and keep the bare brand only as a last resort.
  const fallback = cleanWhitespace(entry.pos_description ?? entry.description ?? '');
  return fallback || brand || undefined;
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max).trimEnd()}…`;
}

function buildBlurb(entry: ArticledataEntry, name: string, locale: AppLocale): string {
  const candidates = [entry.sales_text, entry.description, entry.pos_description];
  for (const raw of candidates) {
    const text = cleanWhitespace(raw ?? '');
    // pos_description often IS the name — don't echo the title as the teaser.
    if (text && text.toLowerCase() !== name.toLowerCase()) return truncate(text, BLURB_MAX);
  }
  return pick(
    locale,
    'Vakkundig opgeknapt, getest en rijklaar gemaakt in onze werkplaats.',
    'Expertly refurbished, tested and made road-ready in our workshop.',
  );
}

/** "maat M" reads wrong for numeric sizes — append cm for bare numbers. */
function formatFrameSize(value: string): string {
  return /^\d+$/.test(value) ? `${value} cm` : value;
}

/** Compact spec line under the card title, e.g. "Gazelle · maat 53 cm · 7 versnellingen". */
function buildSpec(
  name: string,
  props: Record<string, string>,
  locale: AppLocale,
): string | undefined {
  const parts: string[] = [];

  const brand = firstProp(props, BRAND_KEYS);
  if (brand && !name.toLowerCase().includes(brand.toLowerCase())) parts.push(brand);

  const frameSize = firstProp(props, FRAME_SIZE_KEYS);
  if (frameSize) parts.push(pick(locale, `maat ${formatFrameSize(frameSize)}`, `size ${formatFrameSize(frameSize)}`));

  const gears = firstProp(props, GEAR_KEYS);
  if (gears) {
    const n = Number(gears);
    if (Number.isFinite(n) && n > 0) {
      parts.push(pick(locale, `${n} ${n === 1 ? 'versnelling' : 'versnellingen'}`, `${n} ${n === 1 ? 'gear' : 'gears'}`));
    } else {
      // Non-numeric gear systems ("Nexus 3", "Enviolo") read fine as-is.
      parts.push(gears);
    }
  }

  return parts.length > 0 ? parts.join(' · ') : undefined;
}

/**
 * Card bullets: remaining specs (color, battery, mileage) padded with the
 * refurb-promise bullets so cards keep a consistent 3-line rhythm. Frame size
 * and gears live in the spec line — not repeated here.
 */
function buildFeatures(
  obj: ArticledataObject,
  props: Record<string, string>,
  category: BikeListing['category'],
  locale: AppLocale,
): string[] {
  const features: string[] = [];

  const color = firstProp(props, COLOR_KEYS);
  if (color) features.push(pick(locale, `Kleur: ${color}`, `Colour: ${color}`));

  if (category === 'ebike') {
    const battery = firstProp(props, BATTERY_KEYS);
    if (battery) features.push(pick(locale, `Accu: ${battery}`, `Battery: ${battery}`));
    if (typeof obj.km_age === 'number' && obj.km_age > 0) {
      const km = obj.km_age.toLocaleString(locale === 'en' ? 'en-GB' : 'nl-NL');
      features.push(pick(locale, `${km} km gereden`, `${km} km ridden`));
    }
  }

  const generic = pick(
    locale,
    ['Volledig nagekeken & rijklaar', 'Servicebeurt inbegrepen', 'Getest & veiligheidsgecheckt'],
    ['Fully serviced & road-ready', 'Service check included', 'Tested & safety-checked'],
  );
  for (const line of generic) {
    if (features.length >= 3) break;
    features.push(line);
  }
  return features.slice(0, 3);
}

function buildSlug(obj: ArticledataObject): { slug: string; objectId?: number } | undefined {
  const rawId = obj.object_id;
  if (rawId !== null && rawId !== undefined && `${rawId}`.trim() !== '') {
    const numeric = Number(rawId);
    return {
      slug: `obj-${String(rawId).trim().toLowerCase()}`,
      objectId: Number.isFinite(numeric) ? numeric : undefined,
    };
  }
  const code = (obj.object_code ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return code ? { slug: `obj-${code}` } : undefined;
}

function resolvePriceEuros(entry: ArticledataEntry, obj: ArticledataObject): number | undefined {
  // Prefer the per-object price over the article-level price (plan §field mapping).
  const cents = [obj.ecommerce_price_cents, entry.ecommerce_price_cents].find(
    (c): c is number => typeof c === 'number' && c > 0,
  );
  return cents === undefined ? undefined : Math.round(cents) / 100;
}

/**
 * Only hosts next.config.mjs `images.remotePatterns` actually allows — an image
 * host outside the allowlist would make `next/image` THROW and 500 the whole
 * page. Off-list hosts degrade to the branded illustration instead. If the real
 * CS feed turns out to serve images from another CDN, extend BOTH lists together
 * (see docs/CYCLESOFTWARE-HANDOFF.md step 2).
 */
function isAllowedImageUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    return (
      url.protocol === 'https:' &&
      (url.hostname === 'cyclesoftware.nl' || url.hostname.endsWith('.cyclesoftware.nl'))
    );
  } catch {
    return false;
  }
}

function pickImage(entry: ArticledataEntry): string | undefined {
  for (const image of entry.images ?? []) {
    const url = image?.url_large ?? image?.url_thumb;
    if (url && isAllowedImageUrl(url)) return url;
  }
  return undefined;
}

export interface MapOptions {
  /** When set (CYCLESOFTWARE_STORE_ID), drop objects tagged with a DIFFERENT store.
   *  Objects without a store_id are kept — unattributable stock shouldn't vanish
   *  because a filter was configured. */
  storeId?: string;
}

/**
 * Flatten Articledata entries into per-SKU marketplace listings:
 * sorted by price (high → low), the top listing flagged `featured` for the
 * home-page refurb section (plan: featured = highest-value available bike).
 */
export function mapArticledataToListings(
  entries: ArticledataEntry[],
  locale: AppLocale,
  opts?: MapOptions,
): BikeListing[] {
  const listings: BikeListing[] = [];
  const seenSlugs = new Set<string>();

  for (const entry of entries) {
    const props = normalizeProperties(entry);
    for (const obj of entry.objects ?? []) {
      if (!passesClientFilter(entry, obj)) continue;
      if (opts?.storeId && obj.store_id !== null && obj.store_id !== undefined && String(obj.store_id) !== opts.storeId) {
        continue;
      }

      const ids = buildSlug(obj);
      const name = buildName(entry, props);
      const price = resolvePriceEuros(entry, obj);
      if (!ids || !name || price === undefined) continue; // minimum fields — hide, never break
      if (seenSlugs.has(ids.slug)) continue;
      seenSlugs.add(ids.slug);

      const category = detectCategory(entry, obj, props);
      listings.push({
        slug: ids.slug,
        objectId: ids.objectId,
        name,
        price,
        category,
        badge: category === 'ebike' ? 'E-bike' : pick(locale, 'Gereviseerd', 'Refurbished'),
        blurb: buildBlurb(entry, name, locale),
        features: buildFeatures(obj, props, category, locale),
        spec: buildSpec(name, props, locale),
        available: true,
        image: pickImage(entry),
        ...TINTS[category],
      });
    }
  }

  listings.sort((a, b) => b.price - a.price);
  const top = listings[0];
  if (top) listings[0] = { ...top, featured: true };
  return listings;
}
