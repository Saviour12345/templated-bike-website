import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['nl', 'en'],
  defaultLocale: 'nl',
  // NL is canonical; both locales are always prefixed so canonicals/hreflang stay explicit.
  localePrefix: 'always',
});

export type AppLocale = (typeof routing.locales)[number];
