import Image from 'next/image';
import { Grid } from '../layout/grid';
import type { GalleryImage } from '../lib/types';

export interface GalleryProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
}

/** Responsive image grid with a subtle hover zoom (frozen under reduced-motion). */
export function Gallery({ images, columns = 3 }: GalleryProps) {
  if (images.length === 0) return null;
  return (
    <Grid cols={columns} gap="md">
      {images.map((img, i) => (
        <figure key={`${img.src}-${i}`} className="group overflow-hidden rounded-lg border border-border bg-surface">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 ease-brand motion-safe:group-hover:scale-105"
            />
          </div>
          {img.caption && <figcaption className="p-3 text-sm text-muted">{img.caption}</figcaption>}
        </figure>
      ))}
    </Grid>
  );
}
