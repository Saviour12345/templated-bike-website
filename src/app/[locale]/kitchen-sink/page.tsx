import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import {
  BeforeAfter,
  Breadcrumbs,
  Button,
  CTASection,
  ClickToCall,
  Container,
  FAQ,
  Gallery,
  InstagramFeed,
  PricingTable,
  ReviewsBlock,
  Section,
  ServicesGrid,
  TestimonialBlock,
  TrustBar,
  WhatsAppButton,
  buildMetadata,
} from '@max/ui';
import { setRequestLocale } from 'next-intl/server';
import type { AppLocale } from '@/i18n/routing';
import { SITE_NAME, SITE_URL, NAP } from '@/site.config';
import { BatteryIcon, RecycleIcon, WrenchIcon } from '@/components/icons';
import { InteractiveHero } from '@/components/interactive-hero';

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  // Dev sandbox — never index.
  return buildMetadata({
    title: 'Kitchen sink — @max/ui',
    description: 'Component sandbox',
    baseUrl: SITE_URL,
    siteName: SITE_NAME,
    locale,
    path: '/kitchen-sink',
    noindex: true,
  });
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

const img = (label: 'before' | 'after' | 'shop') => ({
  src: `/img/ph-${label}.svg`,
  alt: `Placeholder ${label}`,
  width: 400,
  height: 300,
});

// Sample data — sandbox only (noindex). Demonstrates the populated state of the
// social-proof components; the live pages read real (or empty) data from content/social.ts.
const SAMPLE_IG = Array.from({ length: 6 }, (_, i) => ({
  src: `/img/ph-${(['shop', 'before', 'after'] as const)[i % 3]}.svg`,
  alt: `Sample Instagram post ${i + 1}`,
  width: 400,
  height: 400,
  caption: 'Reparatie in de werkplaats #yourbikeshop',
  permalink: '#',
}));

const SAMPLE_REVIEWS = [
  { author: 'Sanne', rating: 5, text: 'Snel geholpen en eerlijk advies. Mijn e-bike rijdt weer als nieuw!', reviewedAt: '2026-03-12', sourceUrl: '#' },
  { author: 'Pieter', rating: 5, text: 'Vakkundige fietsenmaker, scherpe prijs. Aanrader in Amsterdam.', reviewedAt: '2026-02-28', sourceUrl: '#' },
  { author: 'Fatima', rating: 4, text: 'Refurbished fiets gekocht — top staat en netjes nagekeken.', reviewedAt: '2026-01-19', sourceUrl: '#' },
];

export default async function KitchenSink({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  return (
    <Section>
      <Container>
        <div className="space-y-12">
          <header>
            <Breadcrumbs items={[{ name: 'Home', href: `/${locale}` }, { name: 'Kitchen sink' }]} />
            <h1 className="mt-4 font-display text-4xl font-extrabold">@max/ui — kitchen sink (eco-green)</h1>
            <p className="mt-2 text-muted">
              Every shared component in this site’s theme. Magic Touch and Globus expose the same route in
              their own themes.
            </p>
          </header>

          <Block title="Buttons">
            <div className="flex flex-wrap items-center gap-3">
              <Button href="#" variant="primary">Primary</Button>
              <Button href="#" variant="accent">Accent</Button>
              <Button href="#" variant="outline">Outline</Button>
              <Button href="#" variant="ghost">Ghost</Button>
              <Button href="#" size="sm">Small</Button>
              <Button href="#" size="lg">Large</Button>
            </div>
          </Block>

          <Block title="Conversion">
            <div className="flex flex-wrap items-center gap-4">
              {NAP.whatsapp && <WhatsAppButton phone={NAP.whatsapp} variant="inline" />}
              <ClickToCall e164={NAP.phone} display={NAP.phoneDisplay} />
            </div>
          </Block>

          <Block title="ServicesGrid">
            <ServicesGrid
              items={[
                { title: 'Reparatie', description: 'Snel en vakkundig.', href: '#', icon: <WrenchIcon className="h-6 w-6" />, ctaLabel: 'Meer info' },
                { title: 'E-bike accu', description: 'Diagnose en vervanging.', href: '#', icon: <BatteryIcon className="h-6 w-6" />, priceLabel: 'Specialiteit', ctaLabel: 'Meer info' },
                { title: 'Refurbished', description: 'Tweede leven voor fietsen.', href: '#', icon: <RecycleIcon className="h-6 w-6" />, ctaLabel: 'Meer info' },
              ]}
            />
          </Block>

          <Block title="PricingTable">
            <PricingTable
              tiers={[
                { name: 'Zilver', price: '€49,99', features: ['Controle', 'Reparatie', 'Schoonmaken'], ctaLabel: 'Boek', ctaHref: '#' },
                { name: 'Goud', price: '€69,99', highlighted: true, features: ['+ Derailleur', '+ Nexus'], ctaLabel: 'Boek', ctaHref: '#' },
                { name: 'Platina', price: '€99,99', features: ['+ E-bike', '+ Fatbike'], ctaLabel: 'Boek', ctaHref: '#' },
              ]}
            />
          </Block>

          <Block title="TrustBar">
            <TrustBar stats={[{ value: '13', label: 'Merken' }, { value: '4', label: 'Pakketten' }, { value: '0', label: 'Wordt verborgen' }]} />
          </Block>

          <Block title="TestimonialBlock">
            <TestimonialBlock
              items={[
                { quote: 'Snel geholpen, eerlijk advies.', author: 'Sanne', role: 'Amsterdam', rating: 5 },
                { quote: 'Mijn e-bike rijdt weer als nieuw.', author: 'Pieter', rating: 4 },
              ]}
            />
          </Block>

          <Block title="ReviewsBlock (curated Google reviews — sample data)">
            <ReviewsBlock
              reviews={SAMPLE_REVIEWS}
              locale={locale as AppLocale}
              reviewsNoun="Google reviews"
              viaLabel="via Google"
              readAllUrl="#"
              readAllLabel="Lees alle reviews op Google"
              leaveReviewUrl="#"
              leaveReviewLabel="Schrijf een review"
            />
          </Block>

          <Block title="InstagramFeed (self-hosted — sample data)">
            <InstagramFeed posts={SAMPLE_IG} max={6} followLabel="Volg @yourbikeshop" profileUrl="#" />
          </Block>

          <Block title="Gallery">
            <Gallery images={[img('shop'), img('after'), img('before')]} />
          </Block>

          <Block title="BeforeAfter">
            <div className="max-w-md">
              <BeforeAfter before={img('before')} after={img('after')} />
            </div>
          </Block>

          <Block title="FAQ">
            <FAQ
              items={[
                { question: 'Moet ik een afspraak maken?', answer: 'Niet verplicht, wel handig.' },
                { question: 'Repareren jullie e-bikes?', answer: 'Ja, dat is onze specialiteit.' },
              ]}
            />
          </Block>

          <Block title="ExplodedScene (interactive hero)">
            <div className="max-w-2xl">
              <InteractiveHero />
            </div>
          </Block>
        </div>
      </Container>

      <div className="mt-16">
        <CTASection title="CTASection" subtitle="Inverted brand band with accent CTA." primary={{ href: '#', label: 'Primary action' }} />
      </div>
    </Section>
  );
}
