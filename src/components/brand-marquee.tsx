import { cn } from '@max/ui';

/**
 * Kinetic, infinitely-scrolling brand strip. The visual row is duplicated and
 * translated -50% for a seamless loop; CSS freezes it under prefers-reduced-motion.
 * A visually-hidden list keeps it accessible.
 */
export function BrandMarquee({ items, className }: { items: string[]; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent" />
      <ul
        aria-hidden
        className="animate-brand-marquee flex w-max items-center gap-12 will-change-transform hover:[animation-play-state:paused]"
      >
        {row.map((b, i) => (
          <li key={`${b}-${i}`} className="whitespace-nowrap text-xl font-bold text-fg/35">
            {b}
          </li>
        ))}
      </ul>
      <span className="sr-only">{items.join(', ')}</span>
    </div>
  );
}
