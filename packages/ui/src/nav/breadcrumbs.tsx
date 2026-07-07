import Link from 'next/link';
import { cn } from '../lib/cn';

export interface Crumb {
  name: string;
  href?: string;
}

/** Visual breadcrumbs. Emit matching BreadcrumbList JSON-LD via seo/breadcrumbSchema. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm text-muted', className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${c.name}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden>/</span>}
              {c.href && !isLast ? (
                <Link href={c.href} className="hover:text-fg">
                  {c.name}
                </Link>
              ) : (
                <span aria-current="page" className="text-fg">
                  {c.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
