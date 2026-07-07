import Link from 'next/link';
import { cn } from '../lib/cn';

export interface LanguageSwitcherProps {
  current: string;
  /** One entry per locale; href is the equivalent page in that locale. */
  links: Array<{ locale: string; href: string; label: string }>;
  className?: string;
}

/** Presentational locale toggle. Apps compute `links` from next-intl routing. */
export function LanguageSwitcher({ current, links, className }: LanguageSwitcherProps) {
  return (
    <div className={cn('flex items-center gap-1 text-sm', className)} role="group" aria-label="Language">
      {links.map((l, i) => (
        <span key={l.locale} className="contents">
          {i > 0 && (
            <span aria-hidden className="text-muted">
              /
            </span>
          )}
          <Link
            href={l.href}
            hrefLang={l.locale}
            aria-current={l.locale === current ? 'true' : undefined}
            className={cn(
              'rounded px-1.5 py-0.5 uppercase tracking-wide',
              l.locale === current ? 'font-bold text-fg' : 'text-muted hover:text-fg',
            )}
          >
            {l.label}
          </Link>
        </span>
      ))}
    </div>
  );
}
