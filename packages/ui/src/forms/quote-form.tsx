import type { ReactNode } from 'react';
import { LeadForm } from './lead-form';
import type { FieldConfig, LeadContext, WhatsAppIntakeOptions } from './types';

export interface QuoteFormLabels {
  name: string;
  email: string;
  phone: string;
  service?: string;
  servicePlaceholder?: string;
  message: string;
  submit: string;
  successTitle: string;
  successBody: string;
  error: string;
  privacyNote?: ReactNode;
}

export interface QuoteFormProps {
  context: LeadContext;
  labels: QuoteFormLabels;
  /** When provided, renders a service <select>; otherwise the service is taken from context. */
  serviceOptions?: Array<{ value: string; label: string }>;
  /** Pre-fills the message textarea, e.g. "I'm interested in: City bike". */
  defaultMessage?: string;
  /** When set, the form opens a prefilled WhatsApp message on submit instead of POSTing. */
  whatsapp?: WhatsAppIntakeOptions;
  endpoint?: string;
  turnstileSiteKey?: string;
}

export function QuoteForm({ context, labels, serviceOptions, defaultMessage, whatsapp, endpoint, turnstileSiteKey }: QuoteFormProps) {
  const fields: FieldConfig[] = [
    { name: 'name', label: labels.name, type: 'text', required: true, autoComplete: 'name' },
    { name: 'email', label: labels.email, type: 'email', required: true, autoComplete: 'email' },
    { name: 'phone', label: labels.phone, type: 'tel', autoComplete: 'tel' },
  ];
  if (serviceOptions?.length && labels.service) {
    fields.push({
      name: 'service',
      label: labels.service,
      type: 'select',
      required: true,
      placeholder: labels.servicePlaceholder,
      options: serviceOptions,
    });
  }
  fields.push({ name: 'message', label: labels.message, type: 'textarea', required: true, full: true, defaultValue: defaultMessage });

  return (
    <LeadForm
      kind="quote"
      context={context}
      whatsapp={whatsapp}
      endpoint={endpoint}
      turnstileSiteKey={turnstileSiteKey}
      submitLabel={labels.submit}
      successTitle={labels.successTitle}
      successBody={labels.successBody}
      errorMessage={labels.error}
      privacyNote={labels.privacyNote}
      fields={fields}
    />
  );
}
