import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Container } from '../layout/container';
import { Button } from '../primitives/button';

export interface HeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  primaryCta?: { label: string; href: string; track?: string };
  /** Secondary action slot (e.g. <WhatsAppButton variant="inline" />). */
  secondary?: ReactNode;
  /** Visual slot — next/image (priority) OR an interactive scene. */
  media?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

/**
 * Page hero: one headline, one primary CTA. When `media` is present it's a
 * two-column layout; the media slot owns the LCP image (mark it priority) — the
 * heading/CTA are plain text so the CTA path is never blocked by an animation.
 */
export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondary,
  media,
  align = 'left',
  className,
}: HeroProps) {
  const hasMedia = Boolean(media);
  return (
    <section className={cn('relative overflow-hidden bg-bg text-fg', className)}>
      <Container>
        <div
          className={cn(
            'grid items-center gap-10 py-16 sm:py-20 lg:py-28',
            hasMedia ? 'lg:grid-cols-2' : 'mx-auto max-w-3xl',
            !hasMedia && align === 'center' && 'text-center',
          )}
        >
          <div className={cn('space-y-6', !hasMedia && align === 'center' && 'mx-auto')}>
            {eyebrow && (
              <p className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-sm font-medium text-primary">
                {eyebrow}
              </p>
            )}
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            {subtitle && <p className="max-w-prose text-lg text-muted">{subtitle}</p>}
            {(primaryCta || secondary) && (
              <div
                className={cn(
                  'flex flex-wrap gap-3 pt-2',
                  !hasMedia && align === 'center' && 'justify-center',
                )}
              >
                {primaryCta && (
                  <Button
                    href={primaryCta.href}
                    size="lg"
                    track={primaryCta.track ?? 'cta_click'}
                    trackData={{ channel: 'hero' }}
                  >
                    {primaryCta.label}
                  </Button>
                )}
                {secondary}
              </div>
            )}
          </div>

          {hasMedia && <div className="relative">{media}</div>}
        </div>
      </Container>
    </section>
  );
}
