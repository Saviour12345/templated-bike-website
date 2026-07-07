import { cn } from '../lib/cn';
import type { PricingTier } from '../lib/types';
import { Button } from '../primitives/button';
import { CheckIcon } from '../primitives/icons';

export function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-lg border bg-bg p-6 transition-shadow duration-200',
        tier.highlighted ? 'border-primary shadow-lg ring-1 ring-primary/30' : 'border-border',
      )}
    >
      {tier.highlighted && (
        <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-fg">
          Aanbevolen
        </span>
      )}
      <h3 className="text-lg font-semibold">{tier.name}</h3>
      <div className="mt-3 flex items-baseline gap-2">
        {tier.anchorPrice && (
          <span className="text-base text-muted line-through">{tier.anchorPrice}</span>
        )}
        <span className="font-display text-3xl font-extrabold">{tier.price}</span>
        {tier.period && <span className="text-sm text-muted">{tier.period}</span>}
      </div>
      {tier.note && <p className="mt-1 text-xs text-muted">{tier.note}</p>}
      <ul className="mt-5 flex-1 space-y-2 text-sm">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      {tier.ctaLabel && tier.ctaHref && (
        <Button
          href={tier.ctaHref}
          variant={tier.highlighted ? 'primary' : 'outline'}
          className="mt-6 w-full"
          track="quote_request"
          trackData={{ tier: tier.name }}
        >
          {tier.ctaLabel}
        </Button>
      )}
    </div>
  );
}

export interface PricingTableProps {
  tiers: PricingTier[];
  className?: string;
}

export function PricingTable({ tiers, className }: PricingTableProps) {
  return (
    <div
      className={cn(
        'grid gap-6',
        tiers.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {tiers.map((tier) => (
        <PricingCard key={tier.name} tier={tier} />
      ))}
    </div>
  );
}
