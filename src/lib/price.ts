import type { AppLocale } from '@/i18n/routing';

/**
 * Locale-aware euro amount WITHOUT the € sign (callers place it, e.g. "€ 649,50"
 * on cards and "€{price}" in the WhatsApp i18n messages).
 *
 * Whole euros stay clean ("150"); odd cents from the CycleSoftware feed keep two
 * decimals with the locale's separators — nl: "1.249,50", en: "1,249.50".
 */
export function formatPrice(price: number, locale: AppLocale): string {
  return new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'nl-NL', {
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(price);
}
