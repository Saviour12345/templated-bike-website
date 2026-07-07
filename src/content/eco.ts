import type { FaqItem, PricingTier, ServiceItem } from '@max/ui';
import type { AppLocale } from '@/i18n/routing';

/**
 * Eco Bike domain content. Local seed data while the Sanity Studio is pending
 * (CMS credentials are a kickoff blocker — see BLOCKERS.md). Shapes match the
 * shared Sanity types so this swaps to GROQ later without touching components.
 *
 * TODO(client): confirm exact package inclusions and indicative part prices.
 */

const pick = <T,>(locale: AppLocale, nl: T, en: T): T => (locale === 'en' ? en : nl);

export function getPricing(locale: AppLocale): PricingTier[] {
  const cta = pick(locale, 'Boek deze beurt', 'Book this service');
  return [
    {
      name: 'City',
      price: pick(locale, '€49,99', '€49.99'),
      priceValue: 49.99,
      priceCurrency: 'EUR',
      period: pick(locale, 'per beurt', 'per service'),
      note: pick(locale, 'Voor standaard stadsfietsen', 'For standard city bikes'),
      features: pick(
        locale,
        [
          'Algemene controle van de fiets',
          'Remmen controleren en afstellen',
          'Verlichting controleren',
          'Bandenspanning controleren',
          'Ketting en kabels inspecteren',
          'Kleine afstellingen uitvoeren',
          'Fiets reinigen',
        ],
        [
          'General bike inspection',
          'Check and adjust brakes',
          'Check lights',
          'Check tyre pressure',
          'Inspect chain and cables',
          'Carry out minor adjustments',
          'Clean the bike',
        ],
      ),
      ctaLabel: cta,
      ctaHref: '/booking?package=City',
    },
    {
      name: 'Premium',
      price: pick(locale, '€69,99', '€69.99'),
      priceValue: 69.99,
      priceCurrency: 'EUR',
      period: pick(locale, 'per beurt', 'per service'),
      highlighted: true,
      note: pick(locale, 'Voor fietsen met versnellingen', 'For bikes with gears'),
      features: pick(
        locale,
        [
          'Alles van het City Package',
          'Nexus 3 / 7 / 8 controle',
          'Derailleur afstellen',
          'Kettingspanning controleren',
          'Kabels controleren en afstellen',
          'Bouten en moeren nalopen',
          'Extra onderhoud en afstelling',
        ],
        [
          'Everything in the City package',
          'Nexus 3 / 7 / 8 check',
          'Adjust derailleur',
          'Check chain tension',
          'Check and adjust cables',
          'Check bolts and nuts',
          'Extra maintenance and tuning',
        ],
      ),
      ctaLabel: cta,
      ctaHref: '/booking?package=Premium',
    },
    {
      name: 'E-bike',
      price: pick(locale, '€99,99', '€99.99'),
      priceValue: 99.99,
      priceCurrency: 'EUR',
      period: pick(locale, 'per beurt', 'per service'),
      note: pick(locale, 'Voor elektrische fietsen & fatbikes', 'For e-bikes & fatbikes'),
      features: pick(
        locale,
        [
          'Alles van het Premium Package',
          'E-bike diagnose',
          'Motor controle',
          'Accu controle',
          'Elektrische systemen inspecteren',
          'Fatbike onderhoud',
          'Uitgebreide veiligheidscontrole',
        ],
        [
          'Everything in the Premium package',
          'E-bike diagnostics',
          'Motor check',
          'Battery check',
          'Inspect electrical systems',
          'Fatbike maintenance',
          'Extended safety check',
        ],
      ),
      ctaLabel: cta,
      ctaHref: '/booking?package=E-bike',
    },
    {
      name: 'Green Rebuild',
      price: pick(locale, '€119,99+', '€119.99+'),
      priceValue: 119.99,
      priceCurrency: 'EUR',
      period: pick(locale, 'vanaf', 'from'),
      note: pick(locale, 'Recycle & complete rebuild service', 'Recycle & complete rebuild service'),
      features: pick(
        locale,
        [
          'Complete fietscontrole',
          'Rebuild van gebruikte fietsen',
          'Recycle & Green Work service',
          'Oude fiets professioneel opknappen',
          'Hergebruik van onderdelen waar mogelijk',
          'Reinigen en opnieuw afstellen',
          'Duurzame en betaalbare oplossing',
        ],
        [
          'Complete bike inspection',
          'Rebuild of used bikes',
          'Recycle & Green Work service',
          'Professionally refurbish old bikes',
          'Reuse parts where possible',
          'Clean and re-tune',
          'Sustainable and affordable solution',
        ],
      ),
      ctaLabel: cta,
      ctaHref: '/booking?package=Green',
    },
  ];
}

export function getServices(locale: AppLocale): (ServiceItem & { iconKey: string })[] {
  return [
    {
      title: pick(locale, 'Reparatie & onderhoud', 'Repair & maintenance'),
      description: pick(
        locale,
        'Snel en vakkundig: van lekke band tot complete onderhoudsbeurt.',
        'Fast and expert: from a flat tyre to a full service.',
      ),
      href: '/repair',
      iconKey: 'wrench',
    },
    {
      title: pick(locale, 'E-bike accu service', 'E-bike battery service'),
      description: pick(
        locale,
        'Diagnose, onderhoud en vervanging van e-bike accu’s en mid-motoren.',
        'Diagnostics, maintenance and replacement of e-bike batteries and mid-motors.',
      ),
      href: '/repair#ebike',
      iconKey: 'battery',
      priceLabel: pick(locale, 'Hoog rendement', 'High value'),
    },
    {
      title: pick(locale, 'Refurbished & kringloopfietsen', 'Refurbished & recycled bikes'),
      description: pick(
        locale,
        'Wij maken van oude fietsen weer betrouwbare, betaalbare modellen.',
        'We turn old bikes into reliable, affordable models again.',
      ),
      href: '/refurbished',
      iconKey: 'recycle',
    },
  ];
}

export function getFaq(locale: AppLocale): FaqItem[] {
  return pick<FaqItem[]>(
    locale,
    [
      {
        question: 'Moet ik een afspraak maken voor een reparatie?',
        answer:
          'Een afspraak is niet verplicht, maar wel handig. Via “Boek een reparatie” plan je snel een moment dat jou uitkomt.',
      },
      {
        question: 'Repareren jullie ook e-bikes en accu’s?',
        answer:
          'Ja. We doen diagnose, onderhoud en vervanging van e-bike accu’s, mid-motoren en displays — een van onze specialismen.',
      },
      {
        question: 'Wat is een kringloopfiets?',
        answer:
          'Een oude fiets die wij volledig nakijken en opknappen tot een betrouwbare, betaalbare fiets. Goed voor je portemonnee én het milieu.',
      },
    ],
    [
      {
        question: 'Do I need an appointment for a repair?',
        answer:
          'An appointment is not required, but it helps. Use “Book a repair” to quickly pick a time that suits you.',
      },
      {
        question: 'Do you repair e-bikes and batteries?',
        answer:
          'Yes. We diagnose, service and replace e-bike batteries, mid-motors and displays — one of our specialities.',
      },
      {
        question: 'What is a recycled bike?',
        answer:
          'An old bike we fully inspect and refurbish into a reliable, affordable bike. Good for your wallet and the planet.',
      },
    ],
  );
}

export const BRANDS = [
  'Trek',
  'Flyer',
  'Giant',
  'Van Raam',
  'Sapim',
  'Victoria',
  'Pegasus',
  'Scott',
  'Liv',
  'Focus',
  'Electra',
  'Bergamont',
  'Vogue',
];
