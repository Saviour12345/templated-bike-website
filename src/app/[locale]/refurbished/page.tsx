import type { Metadata } from 'next';
import { InstagramFeed, JsonLd, MapHours, QuoteForm, ReviewsBlock, Section, breadcrumbSchema, buildMetadata } from '@max/ui';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { AppLocale } from '@/i18n/routing';
import { MAP_QUERY, NAP, SITE_NAME, SITE_URL, SOCIAL } from '@/site.config';
import { lp } from '@/lib/href';
import { formatPrice } from '@/lib/price';
import { PageHeader } from '@/components/page-header';
import { BikeCard } from '@/components/bike-card';
import { getBikesForSale } from '@/content/bikes';
import { getInstagramPosts, getReviewSummary, getReviews } from '@/content/social';

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'refurbished' });
  return buildMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    baseUrl: SITE_URL,
    siteName: SITE_NAME,
    locale,
    path: '/refurbished',
    image: '/img/sale/stadsfiets.jpg',
  });
}

export default async function RefurbishedPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale as AppLocale);
  const al = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: 'refurbished' });
  const ts = await getTranslations({ locale, namespace: 'sale' });
  const tf = await getTranslations({ locale, namespace: 'forms' });
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const tsoc = await getTranslations({ locale, namespace: 'social' });
  const tc = await getTranslations({ locale, namespace: 'common' });

  const bikes = await getBikesForSale(al);
  const reviews = await getReviews(al);
  const reviewSummary = await getReviewSummary();
  const instagram = await getInstagramPosts(al);
  const trust = t.raw('trust') as string[];

  // The card the visitor clicked "Aanvragen/Enquire" on (?bike=<slug>), used to pre-fill the form.
  const selectedSlug = typeof sp.bike === 'string' ? sp.bike : undefined;
  const selectedBike = bikes.find((b) => b.slug === selectedSlug);
  const enquiryHref = lp(al, '/refurbished');
  const waPhone = NAP.whatsapp ?? NAP.phone.replace(/[^\d]/g, '');
  // Seed cards use "vanaf" pricing; live CycleSoftware listings are exact per-SKU prices.
  const hasFromPricing = bikes.some((b) => b.priceIsFrom);

  // WhatsApp: from-price wording for seed cards; exact price + CS object reference
  // for live listings so staff can look the bike up in CycleSoftware instantly.
  const waMessageFor = (b: (typeof bikes)[number]) =>
    b.priceIsFrom
      ? ts('waMessage', { bike: b.name, price: formatPrice(b.price, al) })
      : ts('waMessageExact', {
          bike: b.name,
          price: formatPrice(b.price, al),
          ref: b.objectId ? String(b.objectId) : b.slug,
        });

  // Product schema per listing; offers tie into the home BikeStore via @id.
  // Live per-SKU listings carry an exact-price Offer; seed type-cards keep AggregateOffer (from-price).
  const productSchema = bikes.map((b) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: b.name,
    description: b.blurb,
    ...(b.image ? { image: b.image.startsWith('http') ? b.image : `${SITE_URL}${b.image}` } : {}),
    ...(b.objectId ? { sku: String(b.objectId) } : {}),
    category: b.category === 'ebike' ? 'Electric bicycle' : 'Bicycle',
    itemCondition: 'https://schema.org/RefurbishedCondition',
    offers: {
      ...(b.priceIsFrom ? { '@type': 'AggregateOffer', lowPrice: b.price } : { '@type': 'Offer', price: b.price }),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/RefurbishedCondition',
      url: `${SITE_URL}/${al}/refurbished#${b.slug}`,
      seller: { '@id': `${SITE_URL}/#business` },
    },
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: tn('home'), url: `${SITE_URL}/${al}` },
            { name: tn('refurbished'), url: `${SITE_URL}/${al}/refurbished` },
          ]),
          ...productSchema,
        ]}
      />

      <PageHeader
        crumbs={[{ name: tn('home'), href: lp(al, '') }, { name: tn('refurbished') }]}
        eyebrow={t('eyebrow')}
        title={t('title')}
        intro={t('intro')}
      />

      {/* Bikes for sale */}
      <Section>
        <ul className="mb-8 flex flex-wrap gap-x-6 gap-y-2">
          {trust.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm font-semibold">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-4 w-4 flex-none text-primary"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="mb-8 max-w-prose text-sm text-muted">{ts('leadNote')}</p>

        {bikes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bikes.map((bike, i) => (
              <BikeCard
                key={bike.slug}
                bike={bike}
                locale={al}
                enquiryHref={enquiryHref}
                fromLabel={ts('from')}
                ctaLabel={ts('cta')}
                ctaAria={ts('ctaAria')}
                whatsappPhone={waPhone}
                whatsappMessage={waMessageFor(bike)}
                whatsappLabel={ts('waLabel')}
                priority={i < 3}
              />
            ))}
          </div>
        ) : (
          // Live feed reachable but every bike is sold — honest empty state; the
          // enquiry section below stays as the conversion path.
          <p className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
            {ts('emptyNote')}
          </p>
        )}

        {/* No pricing disclaimer under an empty grid — it reads contradictory next to the sold-out note. */}
        {bikes.length > 0 && (
          <p className="mt-8 max-w-prose text-xs text-muted">{ts(hasFromPricing ? 'disclaimer' : 'disclaimerLive')}</p>
        )}
      </Section>

      {/* Refurb shots from Instagram (before/after, completed builds) */}
      {instagram.length > 0 && (
        <Section>
          <h2 className="mb-8 font-display text-2xl font-bold">{tsoc('instagramTitle')}</h2>
          <InstagramFeed
            posts={instagram}
            max={6}
            followLabel={tsoc('follow', { handle: SOCIAL.instagramHandle ?? '' })}
            profileUrl={SOCIAL.instagramProfileUrl}
          />
        </Section>
      )}

      {/* Social proof */}
      {(reviews.length > 0 || reviewSummary.count > 0) && (
        <Section tone="surface" className="border-t border-border">
          <h2 className="mb-8 font-display text-2xl font-bold">{tsoc('reviewsTitle')}</h2>
          <ReviewsBlock
            reviews={reviews}
            summary={reviewSummary}
            locale={al}
            reviewsNoun={tsoc('reviewsNoun')}
            viaLabel={tsoc('via')}
            readAllUrl={SOCIAL.googleReviewUrl}
            readAllLabel={tsoc('readAll')}
            leaveReviewUrl={SOCIAL.googleReviewUrl}
            leaveReviewLabel={tsoc('leaveReview')}
          />
        </Section>
      )}

      {/* Don't see it? Enquiry — pre-filled when arriving via a card's "Aanvragen/Enquire" CTA. */}
      <Section id="enquiry" tone="surface" className="border-t border-border">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold">{t('enquiryTitle')}</h2>
            <p className="text-muted">{t('enquiryIntro')}</p>
          </div>
          <QuoteForm
            key={selectedBike?.slug ?? 'all'}
            context={{ site: 'eco-bike', locale: al, service: 'refurbished', bike: selectedBike?.slug }}
            defaultMessage={selectedBike ? ts('enquiryPrefill', { bike: selectedBike.name }) : undefined}
            whatsapp={{
              phone: waPhone,
              intro: tf('waEnquiryIntro'),
              callE164: NAP.phone,
              callDisplay: NAP.phoneDisplay,
              callLabel: tf('orCall'),
            }}
            labels={{
              name: tf('name'),
              email: tf('email'),
              phone: tf('phone'),
              message: tf('message'),
              submit: tf('waSend'),
              successTitle: tf('waSuccessTitle'),
              successBody: tf('waSuccessBody'),
              error: tf('error'),
              privacyNote: tf('waPrivacy'),
            }}
          />
        </div>
      </Section>

      <Section className="border-t border-border">
        <h2 className="mb-8 font-display text-2xl font-bold">{tc('visitTitle')}</h2>
        <MapHours
          mapQuery={MAP_QUERY}
          hours={NAP.openingHours ?? []}
          addressLine={`${NAP.streetAddress}, ${NAP.postalCode} ${NAP.city}`}
        />
      </Section>
    </>
  );
}
