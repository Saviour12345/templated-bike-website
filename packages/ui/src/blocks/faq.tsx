import type { FaqItem } from '../lib/types';
import { cn } from '../lib/cn';
import { PlusIcon } from '../primitives/icons';

export interface FAQProps {
  items: FaqItem[];
  className?: string;
}

/**
 * Accordion built on native <details>/<summary> — works with zero JS and is
 * keyboard-accessible by default. Emit matching FAQPage JSON-LD via seo/faqSchema.
 */
export function FAQ({ items, className }: FAQProps) {
  if (items.length === 0) return null;
  return (
    <div className={cn('divide-y divide-border overflow-hidden rounded-lg border border-border bg-bg', className)}>
      {items.map((item, i) => (
        <details key={`${item.question}-${i}`} className="group [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-fg">
            <span>{item.question}</span>
            <PlusIcon className="h-5 w-5 shrink-0 text-primary transition-transform duration-200 ease-brand group-open:rotate-45" />
          </summary>
          <div className="px-5 pb-5 text-muted">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
