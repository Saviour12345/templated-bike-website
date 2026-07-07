import type { Metadata } from 'next';
import { JsonLd, MapHours, PricingTable, Section, breadcrumbSchema, buildMetadata, offerCatalogSchema } from '@max/ui';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { AppLocale } from '@/i18n/routing';
import { MAP_QUERY, NAP, SITE_NAME, SITE_URL } from '@/site.config';
import { lp } from '@/lib/href';
import { getPricing } from '@/content/eco';
import { PageHeader } from '@/components/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });
  return buildMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    baseUrl: SITE_URL,
    siteName: SITE_NAME,
    locale,
    path: '/pricing',
  });
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const al = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: 'pricing' });
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const tc = await getTranslations({ locale, namespace: 'common' });

  const pricing = getPricing(al).map((tier) => ({
    ...tier,
    ctaHref: tier.ctaHref ? lp(al, tier.ctaHref) : undefined,
  }));

  return (
    <>
      <JsonLd
        data={[
          offerCatalogSchema(t('title'), getPricing(al)),
          breadcrumbSchema([
            { name: tn('home'), url: `${SITE_URL}/${al}` },
            { name: tn('pricing'), url: `${SITE_URL}/${al}/pricing` },
          ]),
        ]}
      />
      <PageHeader
        crumbs={[{ name: tn('home'), href: lp(al, '') }, { name: tn('pricing') }]}
        eyebrow={t('kicker')}
        title={t('title')}
        intro={t('intro')}
      />
      <Section>
        <PricingTable tiers={pricing} />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-5">
            <h2 className="font-display text-base font-bold">{t('includedTitle')}</h2>
            <p className="mt-2 text-sm text-muted">{t('included')}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-display text-base font-bold">{t('extraTitle')}</h2>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              <li>{t('extraMount')}</li>
              <li>{t('extraParts')}</li>
            </ul>
          </div>
        </div>
        <p className="mt-8 max-w-prose text-sm text-muted">{t('disclaimer')}</p>
      </Section>

      <Section tone="surface" className="border-t border-border">
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
