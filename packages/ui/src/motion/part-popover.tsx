import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { CloseIcon } from '../primitives/icons';

export interface PartPopoverProps {
  title: string;
  xPct: number;
  yPct: number;
  onClose: () => void;
  children: ReactNode;
  id?: string;
  labelledById?: string;
  closeLabel?: string;
  className?: string;
}

/** Price/detail popover anchored to a hotspot. Content is live HTML (CMS), not baked into the image. */
export function PartPopover({
  title,
  xPct,
  yPct,
  onClose,
  children,
  id,
  closeLabel = 'Sluiten',
  className,
}: PartPopoverProps) {
  // Keep the card inside the box: flip horizontal anchor past the midpoint.
  const flipX = xPct > 60;
  const flipY = yPct > 55;

  return (
    <div
      id={id}
      role="dialog"
      aria-label={title}
      style={{ left: `${xPct}%`, top: `${yPct}%` }}
      className={cn(
        'absolute z-40 w-64 max-w-[80vw] rounded-lg border border-border bg-bg p-4 text-fg shadow-xl',
        flipX ? '-translate-x-full' : 'translate-x-3',
        flipY ? '-translate-y-full' : 'translate-y-3',
        'motion-safe:animate-fade-in-up',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-semibold">{title}</h4>
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="-m-1 rounded p-1 text-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2 text-sm">{children}</div>
    </div>
  );
}
