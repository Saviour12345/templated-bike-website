import type { Metadata } from 'next';
import { BookingForm, JsonLd, Section, breadcrumbSchema, buildMetadata } from '@max/ui';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { AppLocale } from '@/i18n/routing';
import { NAP, SITE_NAME, SITE_URL } from '@/site.config';
import { lp } from '@/lib/href';
import { PageHeader } from '@/components/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'booking' });
  return buildMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    baseUrl: SITE_URL,
    siteName: SITE_NAME,
    locale,
    path: '/booking',
  });
}

export default async function BookingPage({
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
  const t = await getTranslations({ locale, namespace: 'booking' });
  const tf = await getTranslations({ locale, namespace: 'forms' });
  const tb = await getTranslations({ locale, namespace: 'forms.bikeTypes' });
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const tc = await getTranslations({ locale, namespace: 'common' });
  const waPhone = NAP.whatsapp ?? NAP.phone.replace(/[^\d]/g, '');

  const selectedPackage = typeof sp.package === 'string' ? sp.package : undefined;
  const selectedPart = typeof sp.part === 'string' ? sp.part : undefined;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: tn('home'), url: `${SITE_URL}/${al}` },
          { name: tc('bookRepair'), url: `${SITE_URL}/${al}/booking` },
        ])}
      />
      <PageHeader
        crumbs={[{ name: tn('home'), href: lp(al, '') }, { name: tc('bookRepair') }]}
        title={t('title')}
        intro={t('intro')}
      />
      <Section>
        <div className="mx-auto max-w-2xl">
          <BookingForm
            context={{
              site: 'eco-bike',
              locale: al,
              package: selectedPackage,
              service: selectedPart ? `part:${selectedPart}` : undefined,
            }}
            whatsapp={{
              phone: waPhone,
              intro: tf('waBookingIntro'),
              callE164: NAP.phone,
              callDisplay: NAP.phoneDisplay,
              callLabel: tf('orCall'),
            }}
            bikeTypeOptions={[
              { value: 'city', label: tb('city') },
              { value: 'ebike', label: tb('ebike') },
              { value: 'cargo', label: tb('cargo') },
              { value: 'fat', label: tb('fat') },
              { value: 'other', label: tb('other') },
            ]}
            packageOptions={[
              { value: 'City', label: 'City' },
              { value: 'Premium', label: 'Premium' },
              { value: 'E-bike', label: 'E-bike' },
              { value: 'Green', label: 'Green Rebuild' },
            ]}
            labels={{
              name: tf('name'),
              email: tf('email'),
              phone: tf('phone'),
              bikeType: tf('bikeType'),
              bikeTypePlaceholder: tf('bikeTypePlaceholder'),
              issue: tf('issue'),
              package: tf('package'),
              packagePlaceholder: tf('packagePlaceholder'),
              preferredDate: tf('preferredDate'),
              submit: tf('waBook'),
              successTitle: tf('waSuccessTitle'),
              successBody: tf('waSuccessBody'),
              error: tf('error'),
              privacyNote: tf('waPrivacy'),
            }}
          />
        </div>
      </Section>
    </>
  );
}
