import Image from 'next/image';
import { Button, WhatsAppButton } from '@max/ui';
import type { AppLocale } from '@/i18n/routing';
import type { BikeListing } from '@/content/bikes';
import { formatPrice } from '@/lib/price';

export interface BikeCardProps {
  bike: BikeListing;
  /** Price formatting locale (decimal comma vs point, grouping). */
  locale: AppLocale;
  /** Base href for the enquiry CTA; `?bike=<slug>#enquiry` is appended. */
  enquiryHref: string;
  /** "vanaf" / "from" — only shown for `priceIsFrom` (seed) cards; live CS listings have exact prices. */
  fromLabel: string;
  /** "Aanvragen" / "Enquire". */
  ctaLabel: string;
  /** Accessible CTA prefix, e.g. "Aanvragen:" / "Enquire about:". */
  ctaAria: string;
  /** wa.me digits, no "+", e.g. "31615863403". */
  whatsappPhone: string;
  /** Fully-built, localized prefilled message naming this bike. */
  whatsappMessage: string;
  whatsappLabel: string;
  /** First-row cards pass priority to protect LCP. */
  priority?: boolean;
}

/** Branded illustration shown when a type has no real photo (e.g. fatbike). */
function BikeGlyph({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[46%] w-[46%]"
      style={{ color }}
    >
      <circle cx="18.5" cy="17.5" r="3.5" />
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="15" cy="5" r="1" />
      <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-0.5 h-4 w-4 flex-none text-primary"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function BikeCard({
  bike,
  locale,
  enquiryHref,
  fromLabel,
  ctaLabel,
  ctaAria,
  whatsappPhone,
  whatsappMessage,
  whatsappLabel,
  priority,
}: BikeCardProps) {
  const sep = enquiryHref.includes('?') ? '&' : '?';
  const href = `${enquiryHref}${sep}bike=${encodeURIComponent(bike.slug)}#enquiry`;

  return (
    <article
      id={bike.slug}
      className={`group flex scroll-mt-24 flex-col overflow-hidden rounded-xl border bg-surface shadow-sm transition-transform duration-300 ease-brand motion-safe:hover:-translate-y-1 ${
        bike.featured ? 'border-primary ring-2 ring-accent' : 'border-border'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-surface">
        {bike.image ? (
          <Image
            src={bike.image}
            alt={`${bike.name} — ${bike.badge}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-300 ease-brand motion-safe:group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 grid place-items-center"
            style={{ background: `linear-gradient(160deg, #ffffff, ${bike.wash})` }}
          >
            <BikeGlyph color={bike.tint} />
          </div>
        )}
        <span
          className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
          style={{ background: bike.tint, color: bike.tintFg }}
        >
          {bike.badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold">{bike.name}</h3>
        {bike.spec && (
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">{bike.spec}</p>
        )}
        <p className="mt-2 text-sm text-muted">{bike.blurb}</p>

        <ul className="mt-4 flex flex-col gap-2">
          {bike.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <CheckGlyph />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-dashed border-border pt-4">
          <div className="flex flex-col leading-none">
            {bike.priceIsFrom && (
              <span className="text-[0.62rem] font-bold uppercase tracking-wide text-muted">{fromLabel}</span>
            )}
            <b className="font-display text-2xl font-extrabold text-primary-dark">€ {formatPrice(bike.price, locale)}</b>
          </div>
          <Button
            href={href}
            size="sm"
            aria-label={`${ctaAria} ${bike.name}`}
            track="cta_click"
            trackData={{ bike_id: bike.slug }}
          >
            {ctaLabel}
          </Button>
        </div>

        <WhatsAppButton
          phone={whatsappPhone}
          message={whatsappMessage}
          label={whatsappLabel}
          variant="inline"
          trackData={{ bike_id: bike.slug }}
          className="mt-3 w-full"
        />
      </div>
    </article>
  );
}
