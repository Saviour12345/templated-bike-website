import type { OpeningHours } from '../lib/types';
import { cn } from '../lib/cn';
import { ClockIcon, MapPinIcon } from '../primitives/icons';

export interface MapHoursProps {
  /** Full Google Maps embed URL. If omitted, built from `mapQuery`. */
  embedSrc?: string;
  /** Address/place query used to build a keyless maps embed. */
  mapQuery?: string;
  hours: OpeningHours[];
  addressLine?: string;
  title?: string;
  hoursTitle?: string;
  closedLabel?: string;
  className?: string;
}

const DAY_LABELS: Record<string, string> = {
  Monday: 'Maandag',
  Tuesday: 'Dinsdag',
  Wednesday: 'Woensdag',
  Thursday: 'Donderdag',
  Friday: 'Vrijdag',
  Saturday: 'Zaterdag',
  Sunday: 'Zondag',
};

/** Map embed + opening-hours table. The same `hours` array feeds the LocalBusiness schema. */
export function MapHours({
  embedSrc,
  mapQuery,
  hours,
  addressLine,
  title = 'Bezoek ons',
  hoursTitle = 'Openingstijden',
  closedLabel = 'Gesloten',
  className,
}: MapHoursProps) {
  const src =
    embedSrc ?? (mapQuery ? `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed` : undefined);

  return (
    <div className={cn('grid gap-8 lg:grid-cols-2', className)}>
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        {src ? (
          <iframe
            title="Kaart"
            src={src}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full min-h-[20rem] w-full"
          />
        ) : (
          <div className="flex min-h-[20rem] items-center justify-center p-6 text-center text-sm text-muted">
            Kaart wordt toegevoegd zodra het adres bevestigd is.
          </div>
        )}
      </div>

      <div className="space-y-6">
        {addressLine && (
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <MapPinIcon className="h-5 w-5 text-primary" />
              {title}
            </h3>
            <p className="mt-2 text-muted">{addressLine}</p>
          </div>
        )}
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <ClockIcon className="h-5 w-5 text-primary" />
            {hoursTitle}
          </h3>
          <table className="mt-3 w-full max-w-sm text-sm">
            <tbody>
              {hours.map((h, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <th scope="row" className="py-2 text-left font-medium">
                    {h.days.map((d) => DAY_LABELS[d] ?? d).join(', ')}
                  </th>
                  <td className="py-2 text-right text-muted">
                    {h.opens && h.closes ? `${h.opens} – ${h.closes}` : closedLabel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
