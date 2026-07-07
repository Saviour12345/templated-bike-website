import type { Metadata } from 'next';
import {
  Button,
  CTASection,
  InstagramFeed,
  JsonLd,
  MapHours,
  ReviewsBlock,
  Section,
  WhatsAppButton,
  breadcrumbSchema,
  buildMetadata,
  serviceSchema,
} from '@max/ui';
import { CheckIcon } from '@max/ui';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { AppLocale } from '@/i18n/routing';
import { MAP_QUERY, NAP, SITE_NAME, SITE_URL, SOCIAL } from '@/site.config';
import { lp } from '@/lib/href';
import { PageHeader } from '@/components/page-header';
import { InteractiveHero } from '@/components/interactive-hero';
import { getInstagramPosts, getReviewSummary, getReviews } from '@/content/social';

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'repair' });
  return buildMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    baseUrl: SITE_URL,
    siteName: SITE_NAME,
    locale,
    path: '/repair',
  });
}

export default async function RepairPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const al = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: 'repair' });
  const tc = await getTranslations({ locale, namespace: 'common' });
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const tsoc = await getTranslations({ locale, namespace: 'social' });

  const covered = t.raw('covered') as string[];
  const reviews = await getReviews(al);
  const reviewSummary = await getReviewSummary();
  const instagram = await getInstagramPosts(al);

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: t('title'),
            description: t('intro'),
            url: `${SITE_URL}/${al}/repair`,
            providerUrl: SITE_URL,
            serviceType: 'Bicycle repair',
          }),
          serviceSchema({
            name: t('ebikeTitle'),
            description: t('ebikeIntro'),
            url: `${SITE_URL}/${al}/repair`,
            providerUrl: SITE_URL,
            serviceType: 'E-bike battery service',
          }),
          breadcrumbSchema([
            { name: tn('home'), url: `${SITE_URL}/${al}` },
            { name: tn('repair'), url: `${SITE_URL}/${al}/repair` },
          ]),
        ]}
      />

      <PageHeader
        crumbs={[{ name: tn('home'), href: lp(al, '') }, { name: tn('repair') }]}
        title={t('title')}
        intro={t('intro')}
      />

      <Section>
        <div className="mx-auto max-w-3xl rounded-[var(--radius-xl)] border border-border bg-gradient-to-br from-accent/15 via-surface to-primary/10 p-4 shadow-xl sm:p-6">
          <InteractiveHero />
        </div>
      </Section>

      <Section>
        <h2 className="mb-6 font-display text-2xl font-bold">{t('coveredTitle')}</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {covered.map((c) => (
            <li key={c} className="flex items-center gap-2 rounded-lg border border-border bg-bg p-4">
              <CheckIcon className="h-5 w-5 shrink-0 text-primary" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="surface" id="ebike">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold">{t('ebikeTitle')}</h2>
          <p className="mt-3 text-lg text-muted">{t('ebikeIntro')}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href={lp(al, '/booking')} track="booking_request">
              {tc('bookRepair')}
            </Button>
            {NAP.whatsapp && <WhatsAppButton phone={NAP.whatsapp} variant="inline" label={tc('whatsapp')} />}
          </div>
        </div>
      </Section>

      {(reviews.length > 0 || reviewSummary.count > 0) && (
        <Section tone="surface">
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

      <CTASection
        title={t('ebikeTitle')}
        primary={{ href: lp(al, '/pricing'), label: tc('viewPricing') }}
      />

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
