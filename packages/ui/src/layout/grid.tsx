import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface GridProps {
  /** Column count at the largest breakpoint (responsive ramp built in). */
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
  children: ReactNode;
}

const colClasses: Record<NonNullable<GridProps['cols']>, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

const gaps = { sm: 'gap-4', md: 'gap-6', lg: 'gap-8' } as const;

export function Grid({ cols = 3, gap = 'md', className, children }: GridProps) {
  return <div className={cn('grid', colClasses[cols], gaps[gap], className)}>{children}</div>;
}
