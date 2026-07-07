import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { ArrowRightIcon } from '../primitives/icons';

export interface ServiceCardProps {
  title: string;
  description: string;
  href?: string;
  icon?: ReactNode;
  priceLabel?: string;
  ctaLabel?: string;
  className?: string;
}

/**
 * Service tile with hover lift + shadow + accent reveal (WS6f). When `href` is
 * set the whole card is a link (overlay pattern keeps the accessible name on the
 * heading). Motion is transform/opacity only and frozen under reduced-motion.
 */
export function ServiceCard({
  title,
  description,
  href,
  icon,
  priceLabel,
  ctaLabel,
  className,
}: ServiceCardProps) {
  return (
    <div
      className={cn(
        'group relative flex flex-col gap-3 rounded-lg border border-border bg-bg p-6',
        'transition-[transform,box-shadow,border-color] duration-200 ease-brand',
        href && 'motion-safe:hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg',
        className,
      )}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-surface text-primary transition-transform duration-200 ease-brand motion-safe:group-hover:scale-110">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold">
        {href ? (
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {title}
          </Link>
        ) : (
          title
        )}
      </h3>
      <p className="flex-1 text-sm text-muted">{description}</p>
      {priceLabel && <p className="text-sm font-semibold text-primary">{priceLabel}</p>}
      {href && (
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          {ctaLabel ?? 'Meer info'}
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 ease-brand motion-safe:group-hover:translate-x-1" />
        </span>
      )}
    </div>
  );
}
