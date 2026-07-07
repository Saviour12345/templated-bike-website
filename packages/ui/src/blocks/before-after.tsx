'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { GalleryImage } from '../lib/types';
import { cn } from '../lib/cn';

export interface BeforeAfterProps {
  before: GalleryImage;
  after: GalleryImage;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

/**
 * Draggable before/after comparison. The range input IS the control (keyboard +
 * touch accessible); the handle is decorative. Only clip-path moves — no layout
 * shift.
 */
export function BeforeAfter({
  before,
  after,
  beforeLabel = 'Voor',
  afterLabel = 'Na',
  className,
}: BeforeAfterProps) {
  const [pos, setPos] = useState(50);

  return (
    <div className={cn('relative select-none overflow-hidden rounded-lg border border-border', className)}>
      <div className="relative aspect-[4/3]">
        <Image src={before.src} alt={before.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={after.src} alt={after.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        </div>

        {/* Handle line */}
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${pos}%` }} />

        <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
          {beforeLabel}
        </span>
        <span className="absolute right-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
          {afterLabel}
        </span>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`${beforeLabel} / ${afterLabel} vergelijking`}
          className="absolute inset-x-0 bottom-3 mx-auto w-[90%] cursor-ew-resize accent-primary"
        />
      </div>
    </div>
  );
}
