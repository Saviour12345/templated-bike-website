import { cn } from '../lib/cn';

export interface HotspotProps {
  label: string;
  xPct: number;
  yPct: number;
  active?: boolean;
  dimmed?: boolean;
  id?: string;
  controls?: string;
  onActivate?: () => void;
  onFocus?: () => void;
}

/**
 * Accessible per-part target — a real <button>, focusable and ARIA-labelled,
 * positioned by % over the scene. Opens the price popover (WS6a).
 */
export function Hotspot({ label, xPct, yPct, active, dimmed, id, controls, onActivate, onFocus }: HotspotProps) {
  return (
    <button
      type="button"
      id={id}
      aria-haspopup="dialog"
      aria-expanded={active ?? false}
      aria-controls={controls}
      aria-label={label}
      onClick={onActivate}
      onFocus={onFocus}
      style={{ left: `${xPct}%`, top: `${yPct}%` }}
      className={cn(
        'absolute z-30 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full',
        'bg-primary text-primary-fg shadow-lg ring-2 ring-bg',
        'transition-[transform,opacity] duration-fast ease-brand hover:scale-110',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active && 'scale-110',
        dimmed ? 'opacity-40' : 'opacity-100',
      )}
    >
      <span
        className="absolute inline-flex h-full w-full rounded-full bg-primary/50 motion-safe:animate-ping"
        aria-hidden
      />
      <span className="relative h-2 w-2 rounded-full bg-primary-fg" aria-hidden />
    </button>
  );
}
