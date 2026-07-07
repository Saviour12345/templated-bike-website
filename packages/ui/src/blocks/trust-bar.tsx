import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import type { TrustStat } from '../lib/types';

export interface TrustBarProps {
  stats?: TrustStat[];
  /** Extra trust content (badge logos, review stars). */
  children?: ReactNode;
  className?: string;
}

/** Returns false for empty / zero-ish values so we NEVER render a "0" (CLAUDE.md hard rule). */
function isRealStat(value: string | number): boolean {
  if (typeof value === 'number') return value > 0;
  const trimmed = value.trim();
  if (trimmed === '') return false;
  // Reject pure-zero strings like "0", "0+", "0.0"
  const numeric = Number(trimmed.replace(/[^\d.,-]/g, '').replace(',', '.'));
  if (!Number.isNaN(numeric) && numeric === 0) return false;
  return true;
}

/**
 * Trust strip of real stats + optional badge/review children.
 * Silently drops any zero/empty stat; renders nothing if nothing is real.
 */
export function TrustBar({ stats = [], children, className }: TrustBarProps) {
  const real = stats.filter((s) => isRealStat(s.value));
  if (real.length === 0 && !children) return null;

  return (
    <div className={cn('flex flex-col gap-8', className)}>
      {real.length > 0 && (
        <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {real.map((s) => (
            <div key={s.label} className="text-center">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-3xl font-extrabold text-primary">{s.value}</dd>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </dl>
      )}
      {children}
    </div>
  );
}
