import Image from 'next/image';
import { cn } from '@max/ui';
import { SITE_NAME } from '@/site.config';

/** Generic bike mark — replace `public/img/brand/bike-mark.svg` to customize. */
export function BikeMarkLogo({ className = 'h-8 w-auto text-primary' }: { className?: string }) {
  return (
    <Image
      src="/img/brand/bike-mark.svg"
      alt=""
      width={64}
      height={64}
      priority
      className={className}
      aria-hidden
    />
  );
}

/** Business name wordmark — driven by `SITE_NAME` in site.config.ts. */
export function BrandWordmarkText({
  className,
  layout = 'stacked',
  tone = 'brand',
}: {
  className?: string;
  layout?: 'stacked' | 'inline';
  tone?: 'brand' | 'footer';
}) {
  const baseClass = tone === 'footer' ? 'text-fg' : 'text-primary';

  if (layout === 'inline') {
    return (
      <span
        aria-label={SITE_NAME}
        className={cn(
          'font-display font-extrabold uppercase leading-none tracking-tight',
          className,
        )}
      >
        <span className={baseClass}>{SITE_NAME}</span>
      </span>
    );
  }

  return (
    <span
      aria-label={SITE_NAME}
      className={cn(
        'font-display font-extrabold uppercase leading-none tracking-tight',
        className,
      )}
    >
      <span className={baseClass}>{SITE_NAME}</span>
    </span>
  );
}

/** Bike mark + business name wordmark. */
export function BrandLockup({
  className,
  layout = 'inline',
  markClassName = 'h-9 w-auto sm:h-10 text-primary',
  wordmarkClassName = 'text-lg sm:text-xl',
  tagline,
  taglineClassName = 'max-w-xs text-sm text-muted',
}: {
  className?: string;
  layout?: 'inline' | 'stacked';
  markClassName?: string;
  wordmarkClassName?: string;
  tagline?: string;
  taglineClassName?: string;
}) {
  if (layout === 'stacked') {
    return (
      <span className={cn('inline-flex flex-col items-start gap-2', className)}>
        <BrandWordmarkText layout="inline" className={wordmarkClassName} />
        <BikeMarkLogo className={markClassName} />
        {tagline ? <span className={taglineClassName}>{tagline}</span> : null}
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <BikeMarkLogo className={markClassName} />
      <BrandWordmarkText className={wordmarkClassName} />
    </span>
  );
}
