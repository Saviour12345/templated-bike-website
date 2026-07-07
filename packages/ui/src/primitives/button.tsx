import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import type { TrackEvent } from '../analytics/track';

export type ButtonVariant = 'primary' | 'accent' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded font-semibold leading-none ' +
  'transition-[transform,background-color,box-shadow,color] duration-fast ease-brand ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 ' +
  'motion-safe:active:translate-y-px';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-fg hover:bg-primary/90 shadow-sm hover:shadow-md',
  accent: 'bg-accent text-accent-fg hover:bg-accent/90 shadow-sm hover:shadow-md',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-fg',
  ghost: 'text-fg hover:bg-surface',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-base',
  lg: 'h-14 px-8 text-lg',
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  /** Fires this conversion event on click (handled by <AnalyticsListener/>). */
  track?: TrackEvent | string;
  /** Extra params for the tracked event, e.g. { channel: 'hero' }. */
  trackData?: Record<string, string>;
}

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'> & {
    href: string;
  };

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: undefined;
  };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

function trackAttrs(track?: string, trackData?: Record<string, string>) {
  if (!track) return {};
  const attrs: Record<string, string> = { 'data-track': track };
  if (trackData) for (const [k, v] of Object.entries(trackData)) attrs[`data-track-${k}`] = v;
  return attrs;
}

/**
 * Themed CTA. Renders a Next `<Link>` when `href` is set (handles external links
 * too), otherwise a `<button>`. Server-component friendly — click tracking is
 * delegated via data attributes, so this never needs `'use client'`.
 */
export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, children, track, trackData } = props;
  const classes = cn(base, variants[variant], sizes[size], className);
  const dataAttrs = trackAttrs(track, trackData);

  if (props.href !== undefined) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, track: _t, trackData: _td, ...rest } =
      props;
    const isExternal = /^(https?:|tel:|mailto:)/.test(href);
    if (isExternal) {
      return (
        <a href={href} className={classes} {...dataAttrs} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...dataAttrs} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, track: _t, trackData: _td, href: _h, type, ...rest } =
    props;
  return (
    <button type={type ?? 'button'} className={classes} {...dataAttrs} {...rest}>
      {children}
    </button>
  );
}
