/** Google Consent Mode v2 helpers — default denied, update on user choice. */

export type ConsentState = 'granted' | 'denied';

export interface ConsentChoices {
  /** analytics_storage */
  analytics: ConsentState;
  /** ad_storage + ad_user_data + ad_personalization */
  marketing: ConsentState;
}

export const CONSENT_STORAGE_KEY = 'max-consent-v1';

/** The default consent state Google must receive BEFORE any tag loads. */
export const DEFAULT_CONSENT = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500,
} as const;

interface GtagWindow {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}

function gtag(...args: unknown[]): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as GtagWindow;
  w.dataLayer = w.dataLayer ?? [];
  // gtag must push `arguments`, not an array, to dataLayer.
  if (typeof w.gtag === 'function') w.gtag(...args);
  else w.dataLayer.push(args);
}

/** Map our two-axis choice to Consent Mode v2 signals and send an update. */
export function applyConsent(choices: ConsentChoices): void {
  gtag('consent', 'update', {
    analytics_storage: choices.analytics,
    ad_storage: choices.marketing,
    ad_user_data: choices.marketing,
    ad_personalization: choices.marketing,
  });
}

export function readStoredConsent(): ConsentChoices | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentChoices>;
    if (parsed.analytics && parsed.marketing) {
      return { analytics: parsed.analytics, marketing: parsed.marketing };
    }
    return null;
  } catch {
    return null;
  }
}

export function storeConsent(choices: ConsentChoices): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(choices));
  } catch {
    /* storage unavailable — consent simply isn't remembered */
  }
}
