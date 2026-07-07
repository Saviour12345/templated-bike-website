import { cn } from '../lib/cn';
import { PhoneIcon } from '../primitives/icons';

export interface ClickToCallProps {
  /** E.164, e.g. "+31615863403". */
  e164: string;
  /** Human display, e.g. "+31 6 15863403". */
  display?: string;
  className?: string;
  iconOnly?: boolean;
  ariaLabel?: string;
}

/** Tap-to-call link. Fires `click_to_call` via the analytics listener. */
export function ClickToCall({ e164, display, className, iconOnly, ariaLabel }: ClickToCallProps) {
  const text = display ?? e164;
  return (
    <a
      href={`tel:${e164}`}
      data-track="click_to_call"
      aria-label={ariaLabel ?? `Bel ${text}`}
      className={cn('inline-flex items-center gap-2 font-medium hover:text-primary', className)}
    >
      <PhoneIcon className="h-4 w-4 shrink-0" />
      {!iconOnly && <span>{text}</span>}
    </a>
  );
}
