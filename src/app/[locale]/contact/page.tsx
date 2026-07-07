import type { Metadata } from 'next';
import { ContactForm, JsonLd, MapHours, Section, breadcrumbSchema, buildMetadata, localBusinessSchema } from '@max/ui';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { AppLocale } from '@/i18n/routing';
import { MAP_QUERY, NAP, SITE_NAME, SITE_URL } from '@/site.config';
import { lp } from '@/lib/href';
import { PageHeader } from '@/components/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return buildMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    baseUrl: SITE_URL,
    siteName: SITE_NAME,
    locale,
    path: '/contact',
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const al = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: 'contact' });
  const tf = await getTranslations({ locale, namespace: 'forms' });
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const waPhone = NAP.whatsapp ?? NAP.phone.replace(/[^\d]/g, '');

  return (
    <>
      <JsonLd
        data={[
          localBusinessSchema({
            type: 'BikeStore',
            nap: NAP,
            url: SITE_URL,
            priceRange: '€€',
            sameAs: NAP.socials?.map((s) => s.url),
          }),
          breadcrumbSchema([
            { name: tn('home'), url: `${SITE_URL}/${al}` },
            { name: tn('contact'), url: `${SITE_URL}/${al}/contact` },
          ]),
        ]}
      />
      <PageHeader
        crumbs={[{ name: tn('home'), href: lp(al, '') }, { name: tn('contact') }]}
        title={t('title')}
        intro={t('intro')}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 font-display text-2xl font-bold">{t('formTitle')}</h2>
            <ContactForm
              context={{ site: 'eco-bike', locale: al }}
              whatsapp={{
                phone: waPhone,
                intro: tf('waContactIntro'),
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
          <MapHours
            mapQuery={MAP_QUERY}
            hours={NAP.openingHours ?? []}
            addressLine={`${NAP.streetAddress}, ${NAP.postalCode} ${NAP.city}`}
          />
        </div>
      </Section>
    </>
  );
}
