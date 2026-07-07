'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Header, LanguageSwitcher } from '@max/ui';
import { usePathname } from '@/i18n/navigation';
import { NAP } from '@/site.config';
import { lp } from '@/lib/href';
import { BikeMarkLogo } from './brand-logo';

export function SiteHeader() {
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();

  const nav = [
    { href: lp(locale, '/repair'), label: t('repair') },
    { href: lp(locale, '/pricing'), label: t('pricing') },
    { href: lp(locale, '/refurbished'), label: t('refurbished') },
    { href: lp(locale, '/contact'), label: t('contact') },
  ];

  const switcher = (
    <LanguageSwitcher
      current={locale}
      links={[
        { locale: 'nl', href: `/nl${pathname}`, label: 'NL' },
        { locale: 'en', href: `/en${pathname}`, label: 'EN' },
      ]}
    />
  );

  return (
    <Header
      brandHref={lp(locale, '')}
      logo={<BikeMarkLogo className="h-10 w-auto sm:h-11" />}
      nav={nav}
      cta={{ href: lp(locale, '/booking'), label: tc('bookRepair'), track: 'booking_request' }}
      phone={{ e164: NAP.phone, display: NAP.phoneDisplay ?? NAP.phone }}
      localeSwitcher={switcher}
    />
  );
}
