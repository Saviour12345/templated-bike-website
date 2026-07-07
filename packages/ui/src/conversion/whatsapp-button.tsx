import { cn } from '../lib/cn';
import { WhatsAppIcon } from '../primitives/icons';

export interface WhatsAppButtonProps {
  /** wa.me target WITHOUT "+", e.g. "31681110757". */
  phone: string;
  /** Prefilled message (optional). */
  message?: string;
  /** floating = fixed bottom-right FAB; inline = in-flow button. */
  variant?: 'floating' | 'inline';
  label?: string;
  className?: string;
  /** Extra params for the whatsapp_click event, e.g. { bike_id: 'stadsfiets' }. */
  trackData?: Record<string, string>;
}

const WA_GREEN = '#25D366';

/**
 * WhatsApp click-to-chat. Uses the canonical `https://wa.me/<digits>` form
 * (fixes the Globus nested-URL bug). Floating variant gets a gentle pulse that
 * is automatically frozen under prefers-reduced-motion (global kill-switch).
 */
export function WhatsAppButton({
  phone,
  message,
  variant = 'inline',
  label = 'WhatsApp',
  className,
  trackData,
}: WhatsAppButtonProps) {
  const digits = phone.replace(/[^\d]/g, '');
  const href = `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
  const extra: Record<string, string> = {};
  if (trackData) for (const [k, v] of Object.entries(trackData)) extra[`data-track-${k}`] = v;

  if (variant === 'floating') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-track="whatsapp_click"
        data-track-channel="floating"
        {...extra}
        aria-label={`${label} — open chat`}
        className={cn(
          'fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg',
          'transition-transform duration-fast ease-brand hover:scale-105 motion-safe:animate-pulse-soft',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className,
        )}
        style={{ backgroundColor: WA_GREEN }}
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-track="whatsapp_click"
      data-track-channel="inline"
      {...extra}
      className={cn(
        'inline-flex h-11 items-center justify-center gap-2 rounded px-6 font-semibold text-white shadow-sm',
        'transition-transform duration-fast ease-brand hover:scale-[1.02]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        className,
      )}
      style={{ backgroundColor: WA_GREEN }}
    >
      <WhatsAppIcon className="h-5 w-5" />
      {label}
    </a>
  );
}
