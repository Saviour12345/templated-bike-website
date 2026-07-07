import type { ElementType, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Container } from './container';

export interface SectionProps {
  as?: ElementType;
  /** Surface tint: page background, subtle surface, or inverted primary band. */
  tone?: 'default' | 'surface' | 'primary';
  /** Wrap children in a Container (default) or let them span full-bleed. */
  contained?: boolean;
  containerSize?: 'default' | 'narrow' | 'wide';
  id?: string;
  className?: string;
  children: ReactNode;
}

const tones = {
  default: 'bg-bg text-fg',
  surface: 'bg-surface text-fg',
  primary: 'bg-primary text-primary-fg',
} as const;

/** Vertical page rhythm band. Padding uses the --space-section token. */
export function Section({
  as: Tag = 'section',
  tone = 'default',
  contained = true,
  containerSize = 'default',
  id,
  className,
  children,
}: SectionProps) {
  const inner = contained ? <Container size={containerSize}>{children}</Container> : children;
  return (
    <Tag
      id={id}
      className={cn('py-[var(--space-section)]', tones[tone], className)}
    >
      {inner}
    </Tag>
  );
}
