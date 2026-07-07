'use client';

import Script from 'next/script';
import { useState, type FormEvent, type ReactNode } from 'react';
import { Field, Honeypot } from './fields';
import type { FieldConfig, LeadContext, LeadKind, WhatsAppIntakeOptions } from './types';
import { track, type TrackEvent } from '../analytics/track';
import { ClickToCall } from '../conversion/click-to-call';
import { WhatsAppIcon } from '../primitives/icons';
import { cn } from '../lib/cn';

export interface LeadFormProps {
  kind: LeadKind;
  fields: FieldConfig[];
  context: LeadContext;
  submitLabel: string;
  successTitle: string;
  successBody: string;
  errorMessage: string;
  /**
   * WhatsApp-intake mode. When set, submit composes a prefilled `wa.me` deep-link
   * from the fields and opens WhatsApp — no backend POST, honeypot or Turnstile.
   * When omitted, the form falls back to the legacy email route handler.
   */
  whatsapp?: WhatsAppIntakeOptions;
  /** Route handler path (legacy email mode). Default "/api/lead". */
  endpoint?: string;
  /** Cloudflare Turnstile site key (legacy email mode) — widget only renders when provided. */
  turnstileSiteKey?: string;
  trackEvent?: TrackEvent;
  privacyNote?: ReactNode;
  className?: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

const DEFAULT_EVENT: Record<LeadKind, TrackEvent> = {
  contact: 'form_submit',
  quote: 'quote_request',
  booking: 'booking_request',
};

/** Conversion event for WhatsApp-intake mode — no `form_submit` (there is no server form). */
const WA_EVENT: Record<LeadKind, TrackEvent> = {
  contact: 'whatsapp_click',
  quote: 'quote_request',
  booking: 'booking_request',
};

const WA_GREEN = '#25D366';

/** Builds the labeled, machine-parseable WhatsApp message from the filled fields. */
function composeWhatsAppMessage(intro: string, fields: FieldConfig[], fd: FormData): string {
  const lines = [intro];
  for (const field of fields) {
    const raw = fd.get(field.name);
    const value = typeof raw === 'string' ? raw.trim() : '';
    if (!value) continue;
    const label = field.options?.find((o) => o.value === value)?.label ?? value;
    lines.push(`• ${field.label}: ${label}`);
  }
  return lines.join('\n');
}

/**
 * Structured lead form core. Uncontrolled (reads FormData), with honeypot +
 * optional Turnstile. Submits a {@link LeadPayload} as JSON to `endpoint`.
 */
export function LeadForm({
  kind,
  fields,
  context,
  submitLabel,
  successTitle,
  successBody,
  errorMessage,
  whatsapp,
  endpoint = '/api/lead',
  turnstileSiteKey,
  trackEvent,
  privacyNote,
  className,
}: LeadFormProps) {
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // WhatsApp-intake mode: compose a prefilled wa.me deep-link and open WhatsApp.
    // No network, no honeypot/Turnstile; the visitor sends from their own WhatsApp.
    if (whatsapp) {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const text = composeWhatsAppMessage(whatsapp.intro, fields, fd);
      const digits = whatsapp.phone.replace(/[^\d]/g, '');
      const url = `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
      track(trackEvent ?? WA_EVENT[kind], {
        site: context.site,
        channel: 'intake',
        ...(context.service ? { service: context.service } : {}),
        ...(context.bike ? { bike_id: context.bike } : {}),
      });
      const win = typeof window !== 'undefined' ? window.open(url, '_blank', 'noopener,noreferrer') : null;
      if (!win && typeof window !== 'undefined') window.location.href = url;
      setStatus('success');
      form.reset();
      return;
    }

    // Honeypot: pretend success, send nothing.
    if ((fd.get('company_url') as string)?.trim()) {
      setStatus('success');
      return;
    }

    const data: Record<string, string> = {};
    for (const field of fields) {
      const v = fd.get(field.name);
      if (typeof v === 'string') data[field.name] = v;
    }
    const turnstileToken = (fd.get('cf-turnstile-response') as string) || undefined;

    setStatus('submitting');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          kind,
          data,
          context: { ...context, sourcePath: typeof window !== 'undefined' ? window.location.pathname : context.sourcePath },
          turnstileToken,
        }),
      });
      if (!res.ok) throw new Error(`Bad status ${res.status}`);
      setStatus('success');
      track(trackEvent ?? DEFAULT_EVENT[kind], {
        site: context.site,
        ...(context.service ? { service: context.service } : {}),
        ...(context.bike ? { bike_id: context.bike } : {}),
      });
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className={cn('rounded-lg border border-primary/30 bg-surface p-6', className)} role="status">
        <h3 className="text-lg font-semibold text-primary">{successTitle}</h3>
        <p className="mt-1 text-muted">{successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn('space-y-5', className)} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <Field key={field.name} field={field} />
        ))}
      </div>

      {/* Honeypot + Turnstile are legacy email-mode only — WhatsApp intake needs neither. */}
      {!whatsapp && <Honeypot />}

      {!whatsapp && turnstileSiteKey && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer strategy="lazyOnload" />
          <div className="cf-turnstile" data-sitekey={turnstileSiteKey} />
        </>
      )}

      {privacyNote && <p className="text-xs text-muted">{privacyNote}</p>}

      {status === 'error' && (
        <p className="text-sm font-medium text-accent" role="alert">
          {errorMessage}
        </p>
      )}

      {whatsapp ? (
        <div className="space-y-3">
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded px-6 font-semibold text-white shadow-sm transition-transform duration-fast ease-brand hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:w-auto"
            style={{ backgroundColor: WA_GREEN }}
          >
            <WhatsAppIcon className="h-5 w-5" />
            {submitLabel}
          </button>
          {whatsapp.callE164 && (
            <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
              {whatsapp.callLabel && <span>{whatsapp.callLabel}</span>}
              <ClickToCall e164={whatsapp.callE164} display={whatsapp.callDisplay} className="text-fg" />
            </p>
          )}
        </div>
      ) : (
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex h-12 w-full items-center justify-center rounded bg-primary px-6 font-semibold text-primary-fg shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-60 sm:w-auto"
        >
          {status === 'submitting' ? '…' : submitLabel}
        </button>
      )}
    </form>
  );
}
