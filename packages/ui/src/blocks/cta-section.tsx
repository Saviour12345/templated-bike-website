import type { ReactNode } from 'react';
import { Section } from '../layout/section';
import { Button } from '../primitives/button';

export interface CTASectionProps {
  title: string;
  subtitle?: string;
  primary?: { label: string; href: string; track?: string };
  /** Secondary action slot (e.g. <WhatsAppButton/> or <ClickToCall/>). */
  secondary?: ReactNode;
}

/** Inverted conversion band. The primary button uses the accent colour for contrast on the brand band. */
export function CTASection({ title, subtitle, primary, secondary }: CTASectionProps) {
  return (
    <Section tone="primary">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        {subtitle && <p className="text-primary-fg/80">{subtitle}</p>}
        {(primary || secondary) && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {primary && (
              <Button
                href={primary.href}
                variant="accent"
                size="lg"
                track={primary.track ?? 'cta_click'}
                trackData={{ channel: 'cta_band' }}
              >
                {primary.label}
              </Button>
            )}
            {secondary}
          </div>
        )}
      </div>
    </Section>
  );
}
