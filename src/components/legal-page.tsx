import type { Metadata } from 'next';
import { Section, buildMetadata } from '@max/ui';
import { getTranslations } from 'next-intl/server';
import type { AppLocale } from '@/i18n/routing';
import { SITE_NAME, SITE_URL } from '@/site.config';
import { lp } from '@/lib/href';
import { PageHeader } from './page-header';

type LegalKey = 'privacyTitle' | 'termsTitle' | 'cookiesTitle';
type IntroKey = 'privacyIntro' | 'termsIntro' | 'cookiesIntro';

const INTRO_KEY: Record<LegalKey, IntroKey> = {
  privacyTitle: 'privacyIntro',
  termsTitle: 'termsIntro',
  cookiesTitle: 'cookiesIntro',
};

export async function legalMetadata(locale: AppLocale, titleKey: LegalKey, path: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'legal' });
  return buildMetadata({
    title: t(titleKey),
    description: t(INTRO_KEY[titleKey]),
    baseUrl: SITE_URL,
    siteName: SITE_NAME,
    locale,
    path,
  });
}

type LegalSection = { heading: string; body: string[] };

export async function LegalPage({
  locale,
  titleKey,
  /** Privacy page: append the public Instagram + Google-reviews disclosure (SOCIAL-PROOF-PLAN §6). */
  showSocialProof = false,
  /** Render the real policy sections from this `legal.*Sections` array instead of the placeholder. */
  sectionsKey,
  updatedKey,
  introKey,
}: {
  locale: AppLocale;
  titleKey: LegalKey;
  showSocialProof?: boolean;
  sectionsKey?: 'privacySections' | 'termsSections' | 'cookiesSections';
  updatedKey?: 'privacyUpdated' | 'termsUpdated' | 'cookiesUpdated';
  introKey?: IntroKey;
}) {
  const t = await getTranslations({ locale, namespace: 'legal' });
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const sections = sectionsKey ? (t.raw(sectionsKey) as LegalSection[]) : null;

  return (
    <>
      <PageHeader crumbs={[{ name: tn('home'), href: lp(locale, '') }, { name: t(titleKey) }]} title={t(titleKey)} />
      <Section>
        <div className="max-w-prose space-y-4 text-muted">
          {updatedKey && <p className="text-sm text-muted/80">{t(updatedKey)}</p>}
          {sections ? (
            <>
              <p>{t(introKey ?? INTRO_KEY[titleKey])}</p>
              {sections.map((section) => (
                <div key={section.heading} className="space-y-2 pt-2">
                  <h2 className="font-display text-lg font-bold text-fg">{section.heading}</h2>
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ))}
            </>
          ) : (
            <p>{t('placeholder')}</p>
          )}
          {showSocialProof && <p>{t('socialProof')}</p>}
        </div>
      </Section>
    </>
  );
}
