import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DM_Sans, Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { AnalyticsListener, ConsentBanner, WhatsAppButton } from '@max/ui';

import '@max/tokens/base.css';
import '@max/tokens/themes/bike-steel.css';
import '@max/ui/styles.css';
import '@/styles/globals.css';

import { routing, type AppLocale } from '@/i18n/routing';
import { GA_ID, NAP, SITE_NAME, SITE_URL } from '@/site.config';
import { lp } from '@/lib/href';
import { Analytics } from '@/components/analytics';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = DM_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as AppLocale)) notFound();
  setRequestLocale(locale as AppLocale);

  const messages = await getMessages();
  const tc = await getTranslations({ locale, namespace: 'consent' });
  return (
    <html lang={locale} className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-bg font-sans text-fg">
        <Analytics gaId={GA_ID} />
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-fg"
          >
            {locale === 'en' ? 'Skip to content' : 'Naar inhoud'}
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter locale={locale as AppLocale} />
          {NAP.whatsapp && <WhatsAppButton phone={NAP.whatsapp} variant="floating" />}
          <ConsentBanner
            description={tc('description')}
            acceptAllLabel={tc('acceptAll')}
            acceptNecessaryLabel={tc('acceptNecessary')}
            privacyHref={lp(locale, '/cookies')}
            privacyLabel={tc('cookiePolicy')}
            secondaryHref={lp(locale, '/privacy')}
            secondaryLabel={tc('privacy')}
          />
          <AnalyticsListener />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
