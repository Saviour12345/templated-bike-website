'use client';

import { useEffect } from 'react';
import { track } from './track';

/**
 * Mount once in the root layout. Delegates clicks for any element carrying a
 * `data-track` attribute and fires the named conversion event — so presentational
 * components (Button, WhatsAppButton, ClickToCall) stay server components and
 * never import analytics directly.
 *
 *   <a data-track="whatsapp_click" data-track-channel="floating" ...>
 */
export function AnalyticsListener(): null {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const el = target?.closest<HTMLElement>('[data-track]');
      if (!el) return;
      const event = el.dataset.track;
      if (!event) return;
      const params: Record<string, string> = {};
      for (const [key, value] of Object.entries(el.dataset)) {
        if (key.startsWith('track') && key !== 'track' && value) {
          // data-track-channel -> trackChannel -> channel
          const name = key.slice('track'.length);
          params[name.charAt(0).toLowerCase() + name.slice(1)] = value;
        }
      }
      track(event, params);
    }
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
