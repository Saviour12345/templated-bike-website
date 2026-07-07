'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { applyConsent, readStoredConsent, storeConsent, type ConsentChoices } from '../analytics/consent';
import { cn } from '../lib/cn';

export interface ConsentBannerProps {
  title?: string;
  description: string;
  acceptAllLabel: string;
  acceptNecessaryLabel: string;
  privacyHref: string;
  privacyLabel: string;
  /** Optional second policy link (e.g. privacy policy next to the cookie policy). */
  secondaryHref?: string;
  secondaryLabel?: string;
}

/**
 * GDPR consent banner wired to Consent Mode v2. The app sets the DEFAULT (denied)
 * state before any tag loads; this only sends the user's *update*. Until a choice
 * is stored, analytics/marketing storage stays denied.
 */
export function ConsentBanner({
  title,
  description,
  acceptAllLabel,
  acceptNecessaryLabel,
  privacyHref,
  privacyLabel,
  secondaryHref,
  secondaryLabel,
}: ConsentBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!readStoredConsent()) setVisible(true);
  }, []);

  function choose(granted: boolean) {
    const choices: ConsentChoices = {
      analytics: granted ? 'granted' : 'denied',
      marketing: granted ? 'granted' : 'denied',
    };
    applyConsent(choices);
    storeConsent(choices);
    setVisible(false);
  }

  if (!visible) return null;

  const btn =
    'inline-flex h-11 items-center justify-center rounded px-5 text-sm font-semibold ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

  return (
    <div
      role="dialog"
      aria-label={title ?? 'Cookies'}
      aria-modal="false"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-container flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-prose text-sm text-fg">
          {title ? <p className="mb-1 font-semibold">{title}</p> : null}
          <p className="text-muted">
            {description}{' '}
            <Link href={privacyHref} className="font-medium text-primary underline">
              {privacyLabel}
            </Link>
            {secondaryHref && secondaryLabel ? (
              <>
                {' · '}
                <Link href={secondaryHref} className="font-medium text-primary underline">
                  {secondaryLabel}
                </Link>
              </>
            ) : null}
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button type="button" onClick={() => choose(false)} className={cn(btn, 'border border-border text-fg hover:bg-surface')}>
            {acceptNecessaryLabel}
          </button>
          <button type="button" onClick={() => choose(true)} className={cn(btn, 'bg-primary text-primary-fg hover:bg-primary/90')}>
            {acceptAllLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
