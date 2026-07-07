import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRightIcon,
  Button,
  Container,
  FAQ,
  InstagramFeed,
  JsonLd,
  MapHours,
  PricingTable,
  ReviewsBlock,
  WhatsAppButton,
  buildMetadata,
  cn,
  faqSchema,
  localBusinessSchema,
  offerCatalogSchema,
} from '@max/ui';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { AppLocale } from '@/i18n/routing';
import { MAP_QUERY, NAP, SAME_AS, SITE_NAME, SITE_URL, SOCIAL } from '@/site.config';
import { lp } from '@/lib/href';
import { formatPrice } from '@/lib/price';
import { BRANDS, getFaq, getPricing, getServices } from '@/content/eco';
import { getInstagramPosts, getReviewSummary, getReviews } from '@/content/social';
import { getFeaturedBike } from '@/content/bikes';
import { ICONS, LeafIcon } from '@/components/icons';
import { InteractiveHero } from '@/components/interactive-hero';
import { BikeCard } from '@/components/bike-card';
import { BrandLockup } from '@/components/brand-logo';
import { BrandMarquee } from '@/components/brand-marquee';
import { StatCountUp } from '@/components/stat-countup';

const AREA = ['Amsterdam', 'Haarlem', 'Utrecht'];
const DARK = 'bg-[rgb(var(--color-brand-dark))] text-[rgb(var(--color-brand-dark-fg))]';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  return buildMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    baseUrl: SITE_URL,
    siteName: SITE_NAME,
    locale,
    path: '',
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const al = locale as AppLocale;

  const t = await getTranslations({ locale, namespace: 'home' });
  const tc = await getTranslations({ locale, namespace: 'common' });
  const tt = await getTranslations({ locale, namespace: 'trust' });
  const ts = await getTranslations({ locale, namespace: 'sale' });
  const tsoc = await getTranslations({ locale, namespace: 'social' });
  const tp = await getTranslations({ locale, namespace: 'pricing' });

  const reviews = await getReviews(al);
  const reviewSummary = await getReviewSummary();
  const instagram = await getInstagramPosts(al);

  const services = getServices(al);
  const featured = await getFeaturedBike(al);
  const feature = services.find((s) => s.iconKey === 'battery');
  const rest = services.filter((s) => s.iconKey !== 'battery');

  const pricing = getPricing(al).map((tier) => ({
    ...tier,
    ctaHref: tier.ctaHref ? lp(al, tier.ctaHref) : undefined,
  }));
  const faq = getFaq(al);

  const schema = [
    localBusinessSchema({
      type: 'BikeStore',
      nap: NAP,
      url: SITE_URL,
      description: t('metaDescription'),
      priceRange: '€€',
      areaServed: AREA,
      // Social profiles + Instagram + Google listing. Deliberately NO self-serving
      // Review/AggregateRating markup (SOCIAL-PROOF-PLAN §7).
      sameAs: SAME_AS,
    }),
    offerCatalogSchema(t('pricingTitle'), getPricing(al)),
    faqSchema(faq),
  ];

  return (
    <>
      <JsonLd data={schema} />

      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 h-[44rem] w-[44rem] rounded-full bg-gradient-to-br from-accent/30 via-primary/15 to-transparent blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl"
        />
        <Container>
          <div className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_1.75fr] lg:py-24">
            <div className="space-y-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-semibold text-primary shadow-sm">
                <LeafIcon className="h-4 w-4" />
                {t('heroEyebrow')}
              </span>
              <h1 className="m-0">
                <BrandLockup
                  layout="inline"
                  markClassName="h-14 w-auto sm:h-16 text-primary"
                  wordmarkClassName="text-2xl sm:text-3xl lg:text-4xl"
                />
              </h1>
              <p className="max-w-xl text-lg text-muted">{t('heroSubtitle')}</p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  href={lp(al, '/booking')}
                  size="lg"
                  className="rounded-full shadow-lg shadow-primary/20"
                  track="booking_request"
                  trackData={{ channel: 'hero' }}
                >
                  {tc('bookRepair')}
                  <ArrowRightIcon className="h-5 w-5" />
                </Button>
                {NAP.whatsapp && (
                  <WhatsAppButton phone={NAP.whatsapp} variant="inline" label={tc('whatsapp')} className="rounded-full" />
                )}
              </div>
            </div>

            {/* Bike on a gradient "stage" */}
            <div className="relative">
              <div className="rounded-[var(--radius-xl)] border border-border bg-gradient-to-br from-accent/15 via-surface to-primary/10 p-3 shadow-xl sm:p-4">
                <InteractiveHero />
              </div>
            </div>
          </div>
        </Container>

        {/* Brand marquee */}
        <div className="border-y border-border bg-bg py-5">
          <Container>
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-muted">
              {t('brandsTitle')}
            </p>
          </Container>
          <BrandMarquee items={BRANDS} />
        </div>
      </section>

      {/* ─────────────────────── Services ─────────────────────── */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHead kicker={t('servicesKicker')} title={t('servicesTitle')} intro={t('servicesIntro')} />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {feature && (
              <FeatureCard
                title={feature.title}
                description={feature.description}
                href={lp(al, feature.href ?? '')}
                badge={feature.priceLabel}
                cta={tc('moreInfo')}
                icon={renderIcon(feature.iconKey, 'h-8 w-8')}
              />
            )}
            <div className="grid gap-6">
              {rest.map((s) => (
                <MiniCard
                  key={s.title}
                  title={s.title}
                  description={s.description}
                  href={lp(al, s.href ?? '')}
                  cta={tc('moreInfo')}
                  icon={renderIcon(s.iconKey, 'h-6 w-6')}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ──────────────────── Stats (dark band) ──────────────────── */}
      <section className={DARK}>
        <Container>
          <div className="py-16 sm:py-20">
            <h2 className="max-w-2xl font-display text-3xl font-extrabold sm:text-4xl">{t('statsTitle')}</h2>
            <div className="mt-12 grid grid-cols-3 items-start gap-6 sm:gap-10">
              <StatCountUp value={840} label={tt('projects')} />
              <StatCountUp value={148} label={tt('clients')} />
              <StatCountUp value={33} label={tt('awards')} />
            </div>
          </div>
        </Container>
      </section>

      {/* ───────────────────── Refurb feature ───────────────────── */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-5">
              <Kicker>{t('refurbKicker')}</Kicker>
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl">{t('refurbTitle')}</h2>
              <p className="max-w-prose text-lg text-muted">{t('refurbBody')}</p>
              <Button href={lp(al, '/refurbished')} variant="outline" className="rounded-full">
                {t('refurbCta')}
                <ArrowRightIcon className="h-5 w-5" />
              </Button>
            </div>
            {featured ? (
              <div className="mx-auto w-full max-w-sm">
                <BikeCard
                  bike={featured}
                  locale={al}
                  enquiryHref={lp(al, '/refurbished')}
                  fromLabel={ts('from')}
                  ctaLabel={ts('cta')}
                  ctaAria={ts('ctaAria')}
                  whatsappPhone={NAP.whatsapp ?? NAP.phone.replace(/[^\d]/g, '')}
                  whatsappMessage={
                    featured.priceIsFrom
                      ? ts('waMessage', { bike: featured.name, price: formatPrice(featured.price, al) })
                      : ts('waMessageExact', {
                          bike: featured.name,
                          price: formatPrice(featured.price, al),
                          ref: featured.objectId ? String(featured.objectId) : featured.slug,
                        })
                  }
                  whatsappLabel={ts('waLabel')}
                />
              </div>
            ) : (
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[var(--radius-xl)] bg-gradient-to-br from-primary/10 via-surface to-accent/20 shadow-inner">
                <span className="text-sm font-semibold text-muted">Refurbished</span>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ───────────────────────── Pricing ───────────────────────── */}
      <section className="bg-surface py-20 sm:py-24">
        <Container>
          <SectionHead kicker={t('pricingKicker')} title={t('pricingTitle')} intro={t('pricingIntro')} center />
          <div className="mt-12">
            <PricingTable tiers={pricing} />
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-5">
              <h3 className="font-display text-base font-bold">{tp('includedTitle')}</h3>
              <p className="mt-2 text-sm text-muted">{tp('included')}</p>
            </div>
            <div className="rounded-lg border border-border bg-bg p-5">
              <h3 className="font-display text-base font-bold">{tp('extraTitle')}</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                <li>{tp('extraMount')}</li>
                <li>{tp('extraParts')}</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────── FAQ ─────────────────────────── */}
      <section className="py-20 sm:py-24">
        <Container size="narrow">
          <SectionHead title={t('faqTitle')} center />
          <div className="mt-10">
            <FAQ items={faq} />
          </div>
        </Container>
      </section>

      {/* ─────────────────── Instagram ("See our work") ─────────────────── */}
      {instagram.length > 0 && (
        <section className="py-20 sm:py-24">
          <Container>
            <SectionHead kicker={tsoc('instagramKicker')} title={tsoc('instagramTitle')} intro={tsoc('instagramIntro')} />
            <div className="mt-12">
              <InstagramFeed
                posts={instagram}
                max={6}
                followLabel={tsoc('follow', { handle: SOCIAL.instagramHandle ?? '' })}
                profileUrl={SOCIAL.instagramProfileUrl}
              />
            </div>
          </Container>
        </section>
      )}

      {/* ─────────────── Reviews (trust block, near the bottom) ─────────────── */}
      {/* Real Google rating (5,0 · 40) + curated review cards, just before the
          contact CTA. No self-serving Review/AggregateRating schema (§7). */}
      {(reviews.length > 0 || reviewSummary.count > 0) && (
        <section className="bg-surface py-20 sm:py-24">
          <Container>
            <SectionHead
              kicker={tsoc('reviewsKicker')}
              title={tsoc('reviewsTitle')}
              intro={tsoc('reviewsIntro')}
              center
            />
            <div className="mt-12">
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
            </div>
          </Container>
        </section>
      )}

      {/* ─────────────────────── CTA band ─────────────────────── */}
      <section className={cn('relative overflow-hidden', DARK)}>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
        />
        <Container>
          <div className="relative flex flex-col items-start gap-6 py-20 sm:py-24">
            <Kicker tone="dark">{t('ctaKicker')}</Kicker>
            <h2 className="max-w-2xl font-display text-4xl font-extrabold sm:text-5xl">{t('ctaTitle')}</h2>
            <p className="max-w-xl text-lg text-[rgb(var(--color-brand-dark-fg))]/75">{t('ctaSubtitle')}</p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                href={lp(al, '/booking')}
                variant="accent"
                size="lg"
                className="rounded-full"
                track="booking_request"
                trackData={{ channel: 'cta_band' }}
              >
                {tc('bookRepair')}
                <ArrowRightIcon className="h-5 w-5" />
              </Button>
              {NAP.whatsapp && (
                <WhatsAppButton phone={NAP.whatsapp} variant="inline" label={tc('whatsapp')} className="rounded-full" />
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ─────────────────────── Visit / map ─────────────────────── */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHead title={t('visitTitle')} />
          <div className="mt-10">
            <MapHours
              mapQuery={MAP_QUERY}
              hours={NAP.openingHours ?? []}
              addressLine={`${NAP.streetAddress}, ${NAP.postalCode} ${NAP.city}`}
            />
          </div>
        </Container>
      </section>
    </>
  );
}

/* ── local presentational helpers ─────────────────────────────── */

function renderIcon(key: string, className: string): ReactNode {
  const Icon = ICONS[key];
  return Icon ? <Icon className={className} /> : null;
}

function Kicker({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest',
        tone === 'dark' ? 'text-[rgb(var(--color-accent))]' : 'text-primary',
      )}
    >
      <span className="h-px w-8 bg-current" />
      {children}
    </span>
  );
}

function SectionHead({
  kicker,
  title,
  intro,
  center,
}: {
  kicker?: string;
  title: string;
  intro?: string;
  center?: boolean;
}) {
  return (
    <div className={cn('max-w-2xl', center && 'mx-auto text-center')}>
      {kicker && (
        <div className={cn('mb-4', center && 'flex justify-center')}>
          <Kicker>{kicker}</Kicker>
        </div>
      )}
      <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{title}</h2>
      {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
    </div>
  );
}

function FeatureCard({
  title,
  description,
  href,
  badge,
  cta,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  badge?: string;
  cta: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] border border-primary/30 bg-gradient-to-br from-primary/10 via-surface to-accent/15 p-8 shadow-sm transition-[transform,box-shadow] duration-200 ease-brand motion-safe:hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-fg shadow-lg">
          {icon}
        </span>
        {badge && (
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-fg">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-10">
        <h3 className="font-display text-2xl font-extrabold sm:text-3xl">{title}</h3>
        <p className="mt-3 max-w-md text-muted">{description}</p>
        <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
          {cta}
          <ArrowRightIcon className="h-5 w-5 transition-transform duration-200 ease-brand motion-safe:group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function MiniCard({
  title,
  description,
  href,
  cta,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-5 rounded-[var(--radius-lg)] border border-border bg-surface p-6 transition-[transform,box-shadow,border-color] duration-200 ease-brand motion-safe:hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-200 ease-brand motion-safe:group-hover:scale-110">
        {icon}
      </span>
      <span className="flex-1">
        <span className="font-display text-xl font-bold">{title}</span>
        <span className="mt-1 block text-sm text-muted">{description}</span>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          {cta}
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 ease-brand motion-safe:group-hover:translate-x-1" />
        </span>
      </span>
    </Link>
  );
}

