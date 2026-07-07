'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks `prefers-reduced-motion`. Starts `false` (SSR/first paint = motion-safe
 * markup) then corrects after mount. Components must still render a usable static
 * fallback when this is true.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
