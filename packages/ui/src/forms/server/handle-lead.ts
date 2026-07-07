/**
 * Shared route-handler logic for lead submissions. Apps wire it into
 * `app/api/lead/route.ts`. No SDK deps — Turnstile + Resend via plain fetch.
 *
 * Build/preview without secrets: if RESEND_API_KEY is unset it logs the lead and
 * returns ok (so the UX works in previews); document that keys are required for
 * real delivery (see BLOCKERS.md).
 */
import type { LeadPayload } from '../types';

export interface HandleLeadOptions {
  /** Recipient inbox, e.g. "info@maxecobike.com". */
  to: string;
  /** Verified sender, e.g. "leads@maxecobike.com". */
  from: string;
  subjectPrefix?: string;
  resendApiKey?: string;
  turnstileSecret?: string;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

async function verifyTurnstile(token: string | undefined, secret: string, ip?: string): Promise<boolean> {
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set('remoteip', ip);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

function renderEmail(payload: LeadPayload, subjectPrefix: string) {
  const { kind, data, context } = payload;
  const rows = Object.entries(data)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td>${escapeHtml(v)}</td></tr>`)
    .join('');
  const ctx = `${context.site}${context.service ? ` · ${context.service}` : ''}${context.package ? ` · ${context.package}` : ''}`;
  const subject = `${subjectPrefix} [${kind}] ${data.name ?? 'Nieuwe aanvraag'} — ${ctx}`;
  const html = `
    <h2 style="font-family:sans-serif">Nieuwe ${kind}-aanvraag</h2>
    <p style="font-family:sans-serif;color:#666">${ctx} · ${context.locale} · ${context.sourcePath ?? ''}</p>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${rows}</table>`;
  const text = Object.entries(data)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  return { subject, html, text };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function handleLead(req: Request, options: HandleLeadOptions): Promise<Response> {
  let payload: LeadPayload;
  try {
    payload = (await req.json()) as LeadPayload;
  } catch {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
  }

  // Honeypot — silently accept and drop.
  if (payload.company_url && payload.company_url.trim()) {
    return jsonResponse({ ok: true });
  }

  if (!payload.kind || !payload.data || !payload.data.email) {
    return jsonResponse({ ok: false, error: 'missing_fields' }, 422);
  }

  // Turnstile (only enforced when a secret is configured).
  if (options.turnstileSecret) {
    const ip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? undefined;
    const ok = await verifyTurnstile(payload.turnstileToken, options.turnstileSecret, ip ?? undefined);
    if (!ok) return jsonResponse({ ok: false, error: 'captcha_failed' }, 403);
  }

  const { subject, html, text } = renderEmail(payload, options.subjectPrefix ?? 'Max');

  if (!options.resendApiKey) {
    // eslint-disable-next-line no-console
    console.warn('[handleLead] RESEND_API_KEY not set — lead not emailed:', subject, payload.data);
    return jsonResponse({ ok: true, delivered: false });
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${options.resendApiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: options.from,
        to: options.to,
        reply_to: payload.data.email,
        subject,
        html,
        text,
      }),
    });
    if (!res.ok) return jsonResponse({ ok: false, error: 'send_failed' }, 502);
    return jsonResponse({ ok: true, delivered: true });
  } catch {
    return jsonResponse({ ok: false, error: 'send_error' }, 502);
  }
}
