/** Analytics event wrapper. Safe to call anywhere; no-ops on the server. */

export type TrackEvent =
  | 'form_submit'
  | 'quote_request'
  | 'booking_request'
  | 'whatsapp_click'
  | 'click_to_call'
  | 'cta_click';

export type TrackParams = Record<string, string | number | boolean | undefined>;

interface GtagWindow {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}

/**
 * Push a conversion event. Prefers gtag (GA4) when present, otherwise falls back
 * to dataLayer so a GTM container or a deferred GA load still receives it.
 * Consent is enforced upstream by Consent Mode v2 (default denied), so analytics
 * storage simply stays off until the user consents — we don't gate here.
 */
export function track(event: TrackEvent | string, params: TrackParams = {}): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as GtagWindow;
  w.dataLayer = w.dataLayer ?? [];
  if (typeof w.gtag === 'function') {
    w.gtag('event', event, params);
  } else {
    w.dataLayer.push({ event, ...params });
  }
}
