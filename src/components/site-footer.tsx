import { getTranslations } from 'next-intl/server';
import { Footer, RatingSnippet } from '@max/ui';
import type { AppLocale } from '@/i18n/routing';
import { NAP, SOCIAL } from '@/site.config';
import { lp } from '@/lib/href';
import { getReviewSummary } from '@/content/social';
import { BikeMarkLogo, BrandWordmarkText } from '@/components/brand-logo';

export async function SiteFooter({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const tsoc = await getTranslations({ locale, namespace: 'social' });

  const summary = await getReviewSummary();

  return (
    <Footer
      nap={NAP}
      brandMark={
        <span className="inline-flex flex-col items-start gap-2">
          <BikeMarkLogo className="h-16 w-auto sm:h-20" />
          <BrandWordmarkText layout="inline" tone="footer" className="text-xl sm:text-2xl" />
        </span>
      }
      tagline={t('tagline')}
      socialLabel={t('social')}
      rating={
        <RatingSnippet
          average={summary.average}
          count={summary.count}
          locale={locale}
          label={tsoc('onGoogle')}
          href={SOCIAL.googleReviewUrl}
        />
      }
      columns={[
        {
          title: t('servicesCol'),
          links: [
            { href: lp(locale, '/repair'), label: tn('repair') },
            { href: lp(locale, '/pricing'), label: tn('pricing') },
            { href: lp(locale, '/refurbished'), label: tn('refurbished') },
          ],
        },
        {
          title: t('companyCol'),
          links: [{ href: lp(locale, '/contact'), label: tn('contact') }],
        },
      ]}
      legalLinks={[
        { href: lp(locale, '/privacy'), label: t('privacy') },
        { href: lp(locale, '/terms'), label: t('terms') },
        { href: lp(locale, '/cookies'), label: t('cookies') },
      ]}
    />
  );
}
