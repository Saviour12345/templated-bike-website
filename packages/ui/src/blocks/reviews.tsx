import Image from 'next/image';
import { cn } from '../lib/cn';
import type { GoogleReview, Locale } from '../lib/types';
import { StarIcon } from '../primitives/icons';

/** Star row. `aria-label` carries the value so it reads correctly to AT. */
function Stars({ rating, label }: { rating: number; label?: string }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex gap-0.5 text-accent" role="img" aria-label={label ?? `${rating} / 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} aria-hidden className={cn('h-4 w-4', i < rounded ? 'opacity-100' : 'opacity-25')} />
      ))}
    </div>
  );
}

const LOCALE_TAG: Record<Locale, string> = { nl: 'nl-NL', en: 'en-GB' };

function formatDate(iso: string | undefined, locale: Locale): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], { year: 'numeric', month: 'short' }).format(d);
}

/**
 * Aggregate over real reviews only. Returns null when there is nothing real,
 * so callers never render a "0" (CLAUDE.md hard rule). Average is rounded to 1dp.
 */
export function reviewAggregate(reviews: GoogleReview[]): { count: number; average: number } | null {
  const real = reviews.filter((r) => typeof r.rating === 'number' && r.rating > 0);
  if (real.length === 0) return null;
  const average = Math.round((real.reduce((sum, r) => sum + r.rating, 0) / real.length) * 10) / 10;
  return { count: real.length, average };
}

export interface ReviewCardProps {
  review: GoogleReview;
  locale?: Locale;
  /** Small attribution, e.g. "via Google". Links to the review when sourceUrl is set. */
  viaLabel?: string;
}

export function ReviewCard({ review, locale = 'nl', viaLabel }: ReviewCardProps) {
  const date = formatDate(review.reviewedAt, locale);
  return (
    <figure className="flex h-full flex-col gap-4 rounded-lg border border-border bg-bg p-6">
      {review.rating > 0 && <Stars rating={review.rating} />}
      <blockquote className="flex-1 text-fg">“{review.text}”</blockquote>
      <figcaption className="flex items-center gap-3 text-sm">
        {review.authorPhoto && (
          <Image
            src={review.authorPhoto}
            alt=""
            width={36}
            height={36}
            loading="lazy"
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        )}
        <span className="min-w-0">
          <span className="block font-semibold">{review.author}</span>
          <span className="text-muted">
            {date && <span>{date}</span>}
            {date && viaLabel && <span> · </span>}
            {viaLabel &&
              (review.sourceUrl ? (
                <a
                  href={review.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-bg"
                >
                  {viaLabel}
                </a>
              ) : (
                <span>{viaLabel}</span>
              ))}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export interface ReviewsBlockProps {
  /** Real reviews only. Renders nothing when empty (section hides gracefully). */
  reviews: GoogleReview[];
  /**
   * Real Google aggregate (e.g. from the GBP listing). Lets the block show the
   * genuine average + count even before individual review cards are curated.
   * Ignored unless count/average are real (never renders a "0").
   */
  summary?: { average: number; count: number } | null;
  locale?: Locale;
  /** Noun for the aggregate line, e.g. "Google reviews". Shown only when reviews are real. */
  reviewsNoun?: string;
  /** "Read all reviews on Google" → the listing URL. */
  readAllUrl?: string;
  readAllLabel?: string;
  /** Optional "Leave a review" CTA → seeds the reviews flywheel. */
  leaveReviewUrl?: string;
  leaveReviewLabel?: string;
  /** Per-card attribution, e.g. "via Google". */
  viaLabel?: string;
  className?: string;
}

/**
 * Curated Google-review block. Surfaces the real count + average (never a "0"),
 * a grid of cards, and outbound "read all / leave a review" links. Self-hosted —
 * no third-party scripts, no consent gate. Emits NO Review/AggregateRating schema.
 */
export function ReviewsBlock({
  reviews,
  summary,
  locale = 'nl',
  reviewsNoun,
  readAllUrl,
  readAllLabel,
  leaveReviewUrl,
  leaveReviewLabel,
  viaLabel,
  className,
}: ReviewsBlockProps) {
  // Prefer the real GBP summary for the headline (it reflects the TRUE total —
  // the cards are a curated subset); fall back to the aggregate of shown cards.
  const agg =
    (summary && summary.count > 0 && summary.average > 0 ? summary : null) ??
    reviewAggregate(reviews);
  if (reviews.length === 0 && !agg) return null;
  const averageText = agg
    ? agg.average.toLocaleString(LOCALE_TAG[locale], { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    : undefined;

  return (
    <div className={cn('flex flex-col gap-8', className)}>
      {agg && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-display text-3xl font-extrabold text-primary">{averageText}</span>
          <Stars rating={agg.average} label={`${averageText} / 5`} />
          <span className="text-sm text-muted">
            {agg.count}
            {reviewsNoun ? ` ${reviewsNoun}` : ''}
          </span>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <ReviewCard key={`${review.author}-${i}`} review={review} locale={locale} viaLabel={viaLabel} />
          ))}
        </div>
      )}

      {(readAllUrl || leaveReviewUrl) && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold">
          {readAllUrl && readAllLabel && (
            <a
              href={readAllUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-track="reviews_click"
              data-track-channel="google_read_all"
              className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {readAllLabel}
            </a>
          )}
          {leaveReviewUrl && leaveReviewLabel && (
            <a
              href={leaveReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-track="reviews_click"
              data-track-channel="google_leave"
              className="text-muted hover:text-fg hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {leaveReviewLabel}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
