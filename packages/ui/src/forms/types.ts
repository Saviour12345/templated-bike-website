/**
 * Lead payload — the single structured shape every form submits.
 * Deliberately generic (`data` map) so Phase-2's AI assistant can consume the
 * same payload unchanged; field names stay stable (name, email, phone, message,
 * bikeType, issue, preferredDate, service, package, …).
 */
export type LeadKind = 'contact' | 'quote' | 'booking';

export interface LeadContext {
  /** "eco-bike" | "magic-touch" | "globus" */
  site: string;
  locale: string;
  /** Vertical / service slug when relevant (e.g. "loodgieter"). */
  service?: string;
  /** Selected package/tier when relevant (e.g. "Goud", "Basis"). */
  package?: string;
  /** Refurbished-bike slug when the enquiry is about a specific listing. */
  bike?: string;
  /** Path the form was submitted from. */
  sourcePath?: string;
}

export interface LeadPayload {
  kind: LeadKind;
  data: Record<string, string>;
  context: LeadContext;
  /** Cloudflare Turnstile token (verified server-side). */
  turnstileToken?: string;
  /** Honeypot — bots fill it, humans never see it. Must be empty. */
  company_url?: string;
}

/**
 * WhatsApp-intake configuration. When passed to a form, submit composes a
 * prefilled `wa.me/<phone>?text=…` deep-link from the collected fields (labeled,
 * URL-encoded) and opens WhatsApp instead of POSTing to a backend — see
 * WHATSAPP-INTAKE-HANDOFF.md. No route handler, email service or spam tooling.
 */
export interface WhatsAppIntakeOptions {
  /** wa.me target digits, no "+", e.g. "31615863403". */
  phone: string;
  /** Opening line of the message, e.g. "Hoi Max Eco Bike! Ik wil een reparatie boeken." */
  intro: string;
  /** Secondary click-to-call: E.164, e.g. "+31615863403". */
  callE164?: string;
  /** Human display for the call link, e.g. "+31 6 15863403". */
  callDisplay?: string;
  /** Label preceding the call link, e.g. "Of bel ons:". */
  callLabel?: string;
}

export type FieldType = 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'date';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  autoComplete?: string;
  /** Pre-fills the (uncontrolled) field. For selects, pre-selects the matching option. */
  defaultValue?: string;
  /** Span both columns in the two-col grid. */
  full?: boolean;
}
