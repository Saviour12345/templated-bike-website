import { cn } from '../lib/cn';
import type { Locale } from '../lib/types';
import { StarIcon } from '../primitives/icons';

const LOCALE_TAG: Record<Locale, string> = { nl: 'nl-NL', en: 'en-GB' };

export interface RatingSnippetProps {
  /** Average rating, e.g. 5. */
  average: number;
  /** Number of reviews, e.g. 40. */
  count: number;
  locale?: Locale;
  /** Parenthetical noun, e.g. "reviews on Google". */
  label?: string;
  /** Links to the listing when set (opens in a new tab). */
  href?: string;
  /** 'full' = five stars (footer / top bar); 'compact' = single star (tight spaces). */
  variant?: 'full' | 'compact';
  className?: string;
}

/**
 * Compact "★ 5,0 (40 reviews on Google)" trust badge. Real values only — renders
 * nothing if count/average aren't real (never a "0"). Self-hosted (no third-party
 * script); links out to the listing. NOT structured-data — humans only (§7).
 */
export function RatingSnippet({
  average,
  count,
  locale = 'nl',
  label,
  href,
  variant = 'full',
  className,
}: RatingSnippetProps) {
  if (!(count > 0 && average > 0)) return null;

  const avg = average.toLocaleString(LOCALE_TAG[locale], {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const countText = label ? `${count} ${label}` : `${count}`;
  const ariaLabel = `${avg} / 5 — ${countText}`;
  const starCount = variant === 'full' ? 5 : 1;
  const rounded = Math.round(average);

  const inner = (
    <>
      <span className="flex items-center gap-0.5 text-accent" aria-hidden>
        {Array.from({ length: starCount }, (_, i) => (
          <StarIcon key={i} className={cn('h-4 w-4', variant === 'full' && i >= rounded && 'opacity-25')} />
        ))}
      </span>
      <span className="font-semibold text-fg">{avg}</span>
      <span className="text-muted">({countText})</span>
    </>
  );

  const classes = cn('inline-flex items-center gap-1.5 text-sm', className);

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        data-track="reviews_click"
        data-track-channel="rating_snippet"
        className={cn(
          classes,
          'rounded hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        )}
      >
        {inner}
      </a>
    );
  }
  return (
    <span className={classes} aria-label={ariaLabel}>
      {inner}
    </span>
  );
}
