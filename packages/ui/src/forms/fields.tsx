import type { FieldConfig } from './types';
import { cn } from '../lib/cn';

const controlClasses =
  'w-full rounded border border-border bg-bg px-3 py-2.5 text-fg shadow-sm ' +
  'placeholder:text-muted/70 focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-ring focus-visible:border-primary';

/** Renders one labelled field from a FieldConfig (uncontrolled — read via FormData). */
export function Field({ field }: { field: FieldConfig }) {
  const id = `f-${field.name}`;
  const common = {
    id,
    name: field.name,
    required: field.required,
    placeholder: field.placeholder,
    autoComplete: field.autoComplete,
    'aria-required': field.required || undefined,
  };

  return (
    <div className={cn('flex flex-col gap-1.5', field.full && 'sm:col-span-2')}>
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {field.label}
        {field.required && <span className="text-accent"> *</span>}
      </label>

      {field.type === 'textarea' ? (
        <textarea {...common} rows={5} defaultValue={field.defaultValue} className={cn(controlClasses, 'resize-y')} />
      ) : field.type === 'select' ? (
        <select {...common} className={controlClasses} defaultValue={field.defaultValue ?? ''}>
          <option value="" disabled>
            {field.placeholder ?? '—'}
          </option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input {...common} type={field.type} defaultValue={field.defaultValue} className={controlClasses} />
      )}
    </div>
  );
}

/** Visually-hidden honeypot. Real users never focus it; bots fill it. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden" tabIndex={-1}>
      <label htmlFor="company_url">Bedrijfs-URL (niet invullen)</label>
      <input id="company_url" name="company_url" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
