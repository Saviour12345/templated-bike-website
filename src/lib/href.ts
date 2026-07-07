/** Build a locale-prefixed path (the shared @max/ui uses plain next/link). */
export const lp = (locale: string, path = ''): string => `/${locale}${path}`;
