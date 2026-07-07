import Link from 'next/link';
import type { ReactNode } from 'react';
import type { NavLink, Nap } from '../lib/types';
import { ClickToCall } from '../conversion/click-to-call';
import { MailIcon, MapPinIcon } from '../primitives/icons';

export interface FooterProps {
  nap: Nap;
  /** Overrides the plain `nap.businessName` heading with custom-styled markup. */
  brandMark?: ReactNode;
  tagline?: string;
  columns?: Array<{ title: string; links: NavLink[] }>;
  legalLinks?: NavLink[];
  /** "Website door Max Globus" credit (true for Eco Bike + Magic Touch). */
  poweredBy?: boolean;
  poweredByHref?: string;
  poweredByLabel?: string;
  socialLabel?: string;
  /** Pre-built trust badge (e.g. <RatingSnippet/>) shown under the NAP block. */
  rating?: ReactNode;
}

const DAY_LABELS: Record<string, string> = {
  Monday: 'Ma',
  Tuesday: 'Di',
  Wednesday: 'Wo',
  Thursday: 'Do',
  Friday: 'Vr',
  Saturday: 'Za',
  Sunday: 'Zo',
};

export function Footer({
  nap,
  brandMark,
  tagline,
  columns = [],
  legalLinks = [],
  poweredBy = false,
  poweredByHref = 'https://maxglobus.com',
  poweredByLabel = 'Website door Max Globus',
  socialLabel = 'Volg ons',
  rating,
}: FooterProps) {
  const addressLine = [nap.streetAddress, [nap.postalCode, nap.city].filter(Boolean).join(' ')]
    .filter(Boolean)
    .join(', ');

  return (
    <footer className="border-t border-border bg-surface text-fg">
      <div className="mx-auto grid max-w-container gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* NAP block */}
        <div className="space-y-3">
          <p className="font-display text-lg font-bold">{brandMark ?? nap.businessName}</p>
          {tagline && <p className="max-w-xs text-sm text-muted">{tagline}</p>}
          <address className="space-y-2 text-sm not-italic text-muted">
            {addressLine && (
              <span className="flex items-start gap-2">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{addressLine}</span>
              </span>
            )}
            <ClickToCall e164={nap.phone} display={nap.phoneDisplay} className="text-muted hover:text-primary" />
            <a href={`mailto:${nap.email}`} className="flex items-center gap-2 hover:text-primary">
              <MailIcon className="h-4 w-4 shrink-0" />
              {nap.email}
            </a>
          </address>
          {rating && <div className="pt-1">{rating}</div>}
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">{col.title}</p>
            <ul className="space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-fg hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {/* Hours + socials */}
        <div className="space-y-4">
          {nap.openingHours?.length ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted">Openingstijden</p>
              <ul className="space-y-1 text-sm text-muted">
                {nap.openingHours.map((h, i) => (
                  <li key={i} className="flex justify-between gap-4">
                    <span>{h.days.map((d) => DAY_LABELS[d] ?? d).join(', ')}</span>
                    <span>{h.opens && h.closes ? `${h.opens}–${h.closes}` : 'Gesloten'}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {nap.socials?.length ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted">{socialLabel}</p>
              <ul className="flex flex-wrap gap-2 text-sm">
                {nap.socials.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-full border border-border px-3 py-1 capitalize hover:border-primary hover:text-primary"
                    >
                      {s.label ?? s.platform}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      {/* Legal strip */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-container flex-col gap-3 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              © {nap.businessName}
              {nap.kvk ? ` · KVK ${nap.kvk}` : ''}
              {nap.btw ? ` · BTW ${nap.btw}` : ''}
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-fg">
                {l.label}
              </Link>
            ))}
            {poweredBy && (
              <a href={poweredByHref} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                {poweredByLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
