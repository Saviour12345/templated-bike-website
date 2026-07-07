import type { ElementType, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface ContainerProps {
  as?: ElementType;
  size?: 'default' | 'narrow' | 'wide';
  className?: string;
  children: ReactNode;
}

const sizes = {
  narrow: 'max-w-3xl',
  default: 'max-w-container',
  wide: 'max-w-[88rem]',
} as const;

/** Horizontal page gutter + max width. */
export function Container({ as: Tag = 'div', size = 'default', className, children }: ContainerProps) {
  return <Tag className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizes[size], className)}>{children}</Tag>;
}
