import { cn } from '../lib/cn';
import type { Testimonial } from '../lib/types';
import { StarIcon } from '../primitives/icons';

function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex gap-0.5 text-accent" aria-label={`${rating} van 5 sterren`}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} className={cn('h-4 w-4', i < rounded ? 'opacity-100' : 'opacity-25')} />
      ))}
    </div>
  );
}

export function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <figure className="flex h-full flex-col gap-4 rounded-lg border border-border bg-bg p-6">
      {typeof item.rating === 'number' && item.rating > 0 && <Stars rating={item.rating} />}
      <blockquote className="flex-1 text-fg">“{item.quote}”</blockquote>
      <figcaption className="text-sm">
        <span className="font-semibold">{item.author}</span>
        {item.role && <span className="text-muted"> · {item.role}</span>}
      </figcaption>
    </figure>
  );
}

export interface TestimonialBlockProps {
  items: Testimonial[];
  className?: string;
}

/** Renders only real testimonials passed in — no fabricated AggregateRating, ever. */
export function TestimonialBlock({ items, className }: TestimonialBlockProps) {
  if (items.length === 0) return null;
  return (
    <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {items.map((item, i) => (
        <TestimonialCard key={`${item.author}-${i}`} item={item} />
      ))}
    </div>
  );
}
