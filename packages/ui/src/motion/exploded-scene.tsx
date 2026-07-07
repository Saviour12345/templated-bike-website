'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useReducedMotion } from './use-reduced-motion';
import { Hotspot } from './hotspot';
import { PartPopover } from './part-popover';
import type { PartTransform, SceneManifest, ScenePart } from './types';

export interface ExplodedSceneProps {
  manifest: SceneManifest;
  /** Render the popover body for a part (price + CTA). */
  renderPopover?: (part: ScenePart) => ReactNode;
  /** How disassembly is triggered. Default 'hover' (with tap/keyboard parity). */
  trigger?: 'hover' | 'inview' | 'always';
  /** Start in the exploded state. */
  defaultExploded?: boolean;
  /** Mark the base image as LCP priority (use only on the true hero). */
  priority?: boolean;
  explodeLabel?: string;
  resetLabel?: string;
  className?: string;
}

const PART_DURATION_MS = 450;
const STAGGER_MS = 60;

function toTransform(t?: PartTransform): string {
  if (!t) return 'translate3d(0,0,0)';
  const out: string[] = [`translate3d(${t.x ?? 0}px, ${t.y ?? 0}px, 0)`];
  if (t.scale != null) out.push(`scale(${t.scale})`);
  if (t.rotate != null) out.push(`rotate(${t.rotate}deg)`);
  return out.join(' ');
}

/**
 * Layered exploded scene. Stacks absolutely-positioned part layers over a base
 * image and drives assemble ↔ disassemble via GPU-friendly transforms.
 *
 * Hard rules honoured: transform/opacity only (no layout thrash), zero CLS (the
 * box reserves aspect-ratio), keyboard + touch parity (hotspots are buttons; a
 * visible toggle drives explode), and a fully-usable static fallback under
 * reduced-motion (parts freeze in place, hotspots still open prices).
 */
export function ExplodedScene({
  manifest,
  renderPopover,
  trigger = 'hover',
  defaultExploded = false,
  priority = false,
  explodeLabel = 'Toon onderdelen',
  resetLabel = 'Samenvoegen',
  className,
}: ExplodedSceneProps) {
  const reduced = useReducedMotion();
  const [exploded, setExploded] = useState(defaultExploded);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [canHover, setCanHover] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover)').matches);
  }, []);

  // Scroll-into-view trigger (also good for below-fold lazy reveal).
  useEffect(() => {
    if (trigger !== 'inview' || reduced) return;
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setExploded(true)),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [trigger, reduced]);

  // Escape closes the popover.
  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActiveId(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activeId]);

  const hoverProps =
    trigger === 'hover' && canHover && !reduced
      ? {
          onMouseEnter: () => setExploded(true),
          onMouseLeave: () => {
            setExploded(false);
            setActiveId(null);
          },
        }
      : {};

  // Under reduced-motion we present the requested static state and never animate.
  const isExploded = reduced ? defaultExploded : exploded;
  const activePart = manifest.parts.find((p) => p.id === activeId) ?? null;

  function openPart(part: ScenePart) {
    setExploded(true);
    setActiveId((cur) => (cur === part.id ? null : part.id));
  }

  return (
    <figure className={cn('relative', className)}>
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl bg-surface"
        style={{ aspectRatio: manifest.aspectRatio ?? '16 / 9' }}
        {...hoverProps}
      >
        {/* Base / static fallback layer — fades out when exploded (interactive mode). */}
        <div
          className="absolute inset-0 transition-opacity"
          style={{
            opacity: isExploded && !reduced ? 0 : 1,
            transitionDuration: reduced ? '0ms' : `${PART_DURATION_MS}ms`,
          }}
        >
          {manifest.base.src ? (
            <Image
              src={manifest.base.src}
              alt={manifest.base.alt}
              fill
              priority={priority}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain"
            />
          ) : (
            <PlaceholderBase label={manifest.base.alt} />
          )}
        </div>

        {/* Part layers (only mounted when motion is allowed). */}
        {!reduced &&
          manifest.parts.map((part, i) => {
            const style: CSSProperties = {
              transform: toTransform(isExploded ? part.exploded : part.assembled),
              opacity: (isExploded ? part.exploded?.opacity : part.assembled?.opacity) ?? 1,
              zIndex: part.zIndex ?? 1,
              transitionProperty: 'transform, opacity',
              transitionDuration: `${PART_DURATION_MS}ms`,
              transitionTimingFunction: 'var(--motion-ease-out)',
              transitionDelay: isExploded ? `${i * STAGGER_MS}ms` : '0ms',
            };
            return (
              <div key={part.id} className="absolute inset-0" style={style} aria-hidden>
                {part.src ? (
                  <Image
                    src={part.src}
                    alt={part.alt ?? part.label}
                    fill
                    loading={priority ? 'eager' : 'lazy'}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain"
                  />
                ) : (
                  <PlaceholderPart label={part.label} />
                )}
              </div>
            );
          })}

        {/* Hotspots — always present for keyboard/touch; dimmed until exploded. */}
        {manifest.parts
          .filter((p) => p.hotspot && (renderPopover || p.priceKey))
          .map((part) => (
            <Hotspot
              key={part.id}
              id={`hotspot-${manifest.id}-${part.id}`}
              controls={activeId === part.id ? `popover-${manifest.id}-${part.id}` : undefined}
              label={part.label}
              xPct={part.hotspot!.xPct}
              yPct={part.hotspot!.yPct}
              active={activeId === part.id}
              dimmed={!isExploded}
              onActivate={() => openPart(part)}
              onFocus={() => !reduced && setExploded(true)}
            />
          ))}

        {/* Popover */}
        {activePart?.hotspot && (
          <PartPopover
            id={`popover-${manifest.id}-${activePart.id}`}
            title={activePart.label}
            xPct={activePart.hotspot.xPct}
            yPct={activePart.hotspot.yPct}
            onClose={() => setActiveId(null)}
          >
            {renderPopover ? renderPopover(activePart) : null}
          </PartPopover>
        )}
      </div>

      {/* Visible toggle — drives explode for touch + keyboard (hover is an enhancement). */}
      {!reduced && (
        <button
          type="button"
          onClick={() => {
            setExploded((v) => !v);
            setActiveId(null);
          }}
          aria-pressed={exploded}
          className="mt-3 inline-flex h-10 items-center justify-center rounded border border-border px-4 text-sm font-medium text-fg hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {exploded ? resetLabel : explodeLabel}
        </button>
      )}
    </figure>
  );
}

function PlaceholderBase({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface to-bg p-6 text-center">
      <span className="text-sm text-muted">{label} (asset volgt)</span>
    </div>
  );
}

function PlaceholderPart({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span className="rounded-md border border-dashed border-primary/40 bg-bg/70 px-2 py-1 text-xs text-primary">
        {label}
      </span>
    </div>
  );
}
