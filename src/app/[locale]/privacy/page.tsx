import { setRequestLocale } from 'next-intl/server';
import type { AppLocale } from '@/i18n/routing';
import { LegalPage, legalMetadata } from '@/components/legal-page';

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  return legalMetadata(locale, 'privacyTitle', '/privacy');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  return (
    <LegalPage
      locale={locale as AppLocale}
      titleKey="privacyTitle"
      showSocialProof
      sectionsKey="privacySections"
      updatedKey="privacyUpdated"
    />
  );
}
