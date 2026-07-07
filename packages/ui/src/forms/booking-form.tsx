import type { ReactNode } from 'react';
import { LeadForm } from './lead-form';
import type { FieldConfig, LeadContext, WhatsAppIntakeOptions } from './types';

export interface BookingFormLabels {
  name: string;
  email: string;
  phone: string;
  bikeType: string;
  bikeTypePlaceholder?: string;
  issue: string;
  package: string;
  packagePlaceholder?: string;
  preferredDate: string;
  submit: string;
  successTitle: string;
  successBody: string;
  error: string;
  privacyNote?: ReactNode;
}

export interface BookingFormProps {
  context: LeadContext;
  labels: BookingFormLabels;
  bikeTypeOptions: Array<{ value: string; label: string }>;
  packageOptions: Array<{ value: string; label: string }>;
  /** When set, the form opens a prefilled WhatsApp message on submit instead of POSTing. */
  whatsapp?: WhatsAppIntakeOptions;
  endpoint?: string;
  turnstileSiteKey?: string;
}

/**
 * Eco Bike repair-booking request: bike type, issue, package, preferred date.
 * In WhatsApp-intake mode it opens a prefilled `wa.me` message; the field shape
 * stays stable so a Cal.com embed or the Phase-2 assistant can attach later.
 */
export function BookingForm({
  context,
  labels,
  bikeTypeOptions,
  packageOptions,
  whatsapp,
  endpoint,
  turnstileSiteKey,
}: BookingFormProps) {
  const fields: FieldConfig[] = [
    { name: 'name', label: labels.name, type: 'text', required: true, autoComplete: 'name' },
    { name: 'email', label: labels.email, type: 'email', required: true, autoComplete: 'email' },
    { name: 'phone', label: labels.phone, type: 'tel', autoComplete: 'tel' },
    {
      name: 'bikeType',
      label: labels.bikeType,
      type: 'select',
      required: true,
      placeholder: labels.bikeTypePlaceholder,
      options: bikeTypeOptions,
    },
    {
      name: 'package',
      label: labels.package,
      type: 'select',
      placeholder: labels.packagePlaceholder,
      options: packageOptions,
    },
    { name: 'preferredDate', label: labels.preferredDate, type: 'date' },
    { name: 'issue', label: labels.issue, type: 'textarea', required: true, full: true },
  ];

  return (
    <LeadForm
      kind="booking"
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
