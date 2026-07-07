import { describe, expect, it } from 'vitest';
import { mapArticledataToListings, normalizeProperties, passesClientFilter } from './map-to-listing';
import { fixtureEntries } from './__fixtures__/articledata';

describe('passesClientFilter', () => {
  it('accepts available, used, non-demo objects', () => {
    expect(passesClientFilter({}, { available: true, is_used: true })).toBe(true);
    expect(passesClientFilter({}, { available: true, is_used: true, is_demo: false })).toBe(true);
  });

  it('rejects sold/reserved, demo, new and unflagged objects', () => {
    expect(passesClientFilter({}, { available: false, is_used: true })).toBe(false);
    expect(passesClientFilter({}, { is_used: true })).toBe(false); // availability unknown
    expect(passesClientFilter({}, { available: true, is_used: true, is_demo: true })).toBe(false);
    expect(passesClientFilter({}, { available: true, is_used: false })).toBe(false);
    expect(passesClientFilter({}, { available: true })).toBe(false); // used flag unknown
  });
});

describe('normalizeProperties', () => {
  it('flattens array-form properties with normalized keys', () => {
    const props = normalizeProperties({
      properties: [
        { key: 'Frame maat', value: 53 },
        { code: 'kleur', value: 'Zwart' },
        { key: 'leeg', value: null },
      ],
    });
    expect(props).toEqual({ framemaat: '53', kleur: 'Zwart' });
  });

  it('flattens map-form properties', () => {
    const props = normalizeProperties({ properties: { Accu: 'Bosch 500 Wh', Groep: 'E-bikes' } });
    expect(props).toEqual({ accu: 'Bosch 500 Wh', groep: 'E-bikes' });
  });
});

describe('mapArticledataToListings', () => {
  const nl = mapArticledataToListings(fixtureEntries, 'nl');
  const en = mapArticledataToListings(fixtureEntries, 'en');

  it('yields one card per sellable object; hides sold, demo, new, price-less and name-less records', () => {
    // A(232432) + B(232500) + G(OMA-28) + G(233000) — everything else filtered.
    expect(nl.map((b) => b.slug).sort()).toEqual(['obj-232432', 'obj-232500', 'obj-233000', 'obj-oma-28']);
    expect(nl.every((b) => b.available)).toBe(true);
  });

  it('sorts by price descending and features the highest-value bike', () => {
    expect(nl.map((b) => b.slug)).toEqual(['obj-232500', 'obj-232432', 'obj-233000', 'obj-oma-28']);
    expect(nl[0]?.featured).toBe(true);
    expect(nl.slice(1).every((b) => !b.featured)).toBe(true);
  });

  it('prefers the object e-commerce price and converts cents → euros', () => {
    const gazelle = nl.find((b) => b.slug === 'obj-232432')!;
    expect(gazelle.price).toBe(649.5);
    expect(gazelle.priceIsFrom).toBeUndefined(); // live listings are exact
    expect(gazelle.objectId).toBe(232432);
  });

  it('builds names without duplicating the brand and falls back to pos_description', () => {
    expect(nl.find((b) => b.slug === 'obj-232432')!.name).toBe('Gazelle Orange C7');
    expect(nl.find((b) => b.slug === 'obj-oma-28')!.name).toBe('Omafiets 28 inch');
  });

  it('detects e-bikes and localizes the badge', () => {
    const ebike = nl.find((b) => b.slug === 'obj-232500')!;
    expect(ebike.category).toBe('ebike');
    expect(ebike.badge).toBe('E-bike');
    const cityNl = nl.find((b) => b.slug === 'obj-232432')!;
    const cityEn = en.find((b) => b.slug === 'obj-232432')!;
    expect(cityNl.category).toBe('bike');
    expect(cityNl.badge).toBe('Gereviseerd');
    expect(cityEn.badge).toBe('Refurbished');
  });

  it('builds a localized spec line, including the brand only when the name lacks it', () => {
    expect(nl.find((b) => b.slug === 'obj-232432')!.spec).toBe('maat 53 cm · 7 versnellingen');
    expect(en.find((b) => b.slug === 'obj-232432')!.spec).toBe('size 53 cm · 7 gears');
    expect(nl.find((b) => b.slug === 'obj-232500')!.spec).toBe('maat M');
    expect(nl.find((b) => b.slug === 'obj-oma-28')!.spec).toBe('BSP');
  });

  it('turns remaining specs into ≤3 feature bullets padded with refurb promises', () => {
    const gazelle = nl.find((b) => b.slug === 'obj-232432')!;
    expect(gazelle.features).toHaveLength(3);
    expect(gazelle.features[0]).toBe('Kleur: Zwart');

    const ebike = en.find((b) => b.slug === 'obj-232500')!;
    expect(ebike.features).toContain('Battery: Bosch 500 Wh');
    expect(ebike.features).toContain('1,250 km ridden');
    expect(ebike.features).toHaveLength(3);
  });

  it('truncates long sales text into a blurb and falls back to localized copy', () => {
    const gazelle = nl.find((b) => b.slug === 'obj-232432')!;
    expect(gazelle.blurb.length).toBeLessThanOrEqual(141);
    expect(gazelle.blurb.endsWith('…')).toBe(true);
    // G's pos_description IS the name → localized default teaser instead of an echo.
    const oma = en.find((b) => b.slug === 'obj-oma-28')!;
    expect(oma.blurb).toBe('Expertly refurbished, tested and made road-ready in our workshop.');
  });

  it('only accepts https *.cyclesoftware.nl images (next/image allowlist) and prefers url_large', () => {
    expect(nl.find((b) => b.slug === 'obj-232432')!.image).toBe('https://cdn.cyclesoftware.nl/images/1001-large.jpg');
    expect(nl.find((b) => b.slug === 'obj-232500')!.image).toBe('https://cdn.cyclesoftware.nl/images/1002-thumb.jpg');
    // http:// and off-allowlist hosts rejected → illustration fallback, never a next/image crash.
    expect(nl.find((b) => b.slug === 'obj-oma-28')!.image).toBeUndefined();
  });

  it('filters by store when configured, keeping store-less objects', () => {
    const filtered = mapArticledataToListings(fixtureEntries, 'nl', { storeId: '1' });
    const slugs = filtered.map((b) => b.slug).sort();
    expect(slugs).toEqual(['obj-232432', 'obj-232500', 'obj-oma-28']); // store-2 object dropped
  });

  it('dedupes objects repeated across entries (paginated overlap)', () => {
    const gazelle = fixtureEntries[0]!;
    const doubled = mapArticledataToListings([gazelle, gazelle], 'nl');
    expect(doubled).toHaveLength(1);
  });

  it('returns [] for an empty feed (the page shows its empty state)', () => {
    expect(mapArticledataToListings([], 'nl')).toEqual([]);
  });
});
