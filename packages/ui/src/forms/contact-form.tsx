import type { ReactNode } from 'react';
import { LeadForm } from './lead-form';
import type { LeadContext, WhatsAppIntakeOptions } from './types';

export interface ContactFormLabels {
  name: string;
  email: string;
  phone: string;
  message: string;
  submit: string;
  successTitle: string;
  successBody: string;
  error: string;
  privacyNote?: ReactNode;
}

export interface ContactFormProps {
  context: LeadContext;
  labels: ContactFormLabels;
  /** When set, the form opens a prefilled WhatsApp message on submit instead of POSTing. */
  whatsapp?: WhatsAppIntakeOptions;
  endpoint?: string;
  turnstileSiteKey?: string;
}

export function ContactForm({ context, labels, whatsapp, endpoint, turnstileSiteKey }: ContactFormProps) {
  return (
    <LeadForm
      kind="contact"
      context={context}
      whatsapp={whatsapp}
      endpoint={endpoint}
      turnstileSiteKey={turnstileSiteKey}
      submitLabel={labels.submit}
      successTitle={labels.successTitle}
      successBody={labels.successBody}
      errorMessage={labels.error}
      privacyNote={labels.privacyNote}
      fields={[
        { name: 'name', label: labels.name, type: 'text', required: true, autoComplete: 'name' },
        { name: 'email', label: labels.email, type: 'email', required: true, autoComplete: 'email' },
        { name: 'phone', label: labels.phone, type: 'tel', autoComplete: 'tel' },
        { name: 'message', label: labels.message, type: 'textarea', required: true, full: true },
      ]}
    />
  );
}
