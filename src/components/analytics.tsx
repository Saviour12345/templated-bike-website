'use client';

import Script from 'next/script';
import { DEFAULT_CONSENT } from '@max/ui';

/**
 * Loads GA4 with Consent Mode v2 defaulting to DENIED. The consent default is
 * queued onto dataLayer before `config`, so analytics_storage stays denied until
 * the ConsentBanner sends an update. No-ops without NEXT_PUBLIC_GA_ID.
 */
export function Analytics({ gaId }: { gaId?: string }) {
  if (!gaId) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',${JSON.stringify(
          DEFAULT_CONSENT,
        )});gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
