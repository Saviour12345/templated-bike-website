'use client';

import Image from 'next/image';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button, useReducedMotion } from '@max/ui';
import { ebikeScene, PART_PRICES } from '@/scenes/ebike';
import { lp } from '@/lib/href';

const ASSEMBLED = ebikeScene.base.src ?? '';
const EXPLODED = ebikeScene.parts.find((p) => p.id === 'exploded-view')?.src ?? '';
const HOTSPOTS = ebikeScene.parts.filter((p) => p.hotspot && p.priceKey);

/**
 * Eco Bike hero. Shows the assembled bike (clean — no hotspots). The first hover
 * (desktop) or tap (touch) explodes it into parts and it STAYS exploded. Once
 * exploded, hovering a hotspot reveals its price card. Cards render outside the
 * clipped photo stage, so they're never cut off.
 */
export function InteractiveHero() {
  const t = useTranslations('scene');
  const locale = useLocale();
  const reduced = useReducedMotion();
  const [exploded, setExploded] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const figureRef = useRef<HTMLElement>(null);

  const explode = () => setExploded(true); // sticky — never reassembles

  const clearHide = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };
  const showCard = (id: string) => {
    clearHide();
    setActive(id);
  };
  const scheduleHide = () => {
    clearHide();
    hideTimer.current = setTimeout(() => setActive(null), 180);
  };

  useEffect(() => clearHide, []);

  // Escape or an outside tap closes the card (touch parity).
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActive(null);
    const onDown = (e: PointerEvent) => {
      if (figureRef.current && !figureRef.current.contains(e.target as Node)) setActive(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [active]);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    if (isMobile) {
      setExploded(true);
    } else {
      const timer = setTimeout(() => {
        setExploded(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const fade = reduced ? '' : 'transition-opacity duration-500';

  return (
    <figure ref={figureRef} className="relative">
      {/* Instruction overlay - Floating badge above the frame */}
      <div
        className={`absolute inset-x-0 -top-7 sm:-top-8 z-10 flex justify-center pointer-events-none px-4 transition-opacity duration-500 ${
          exploded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="bg-surface backdrop-blur-md px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-primary-dark shadow-md text-center border border-primary/20">
          {t('instruction')}
        </p>
      </div>

      {/* Photo stage — clips the two cross-fading images to the rounded box. */}
      <div
        className="relative w-full overflow-hidden rounded-xl bg-surface"
        style={{ aspectRatio: ebikeScene.aspectRatio ?? '16 / 9' }}
        onMouseEnter={explode}
        onClick={() => {
          explode();
          setActive(null);
        }}
      >
        <Image
          src={ASSEMBLED}
          alt={ebikeScene.base.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-contain ${fade}`}
          style={{ opacity: exploded ? 0 : 1 }}
        />
        <Image
          src={EXPLODED}
          alt="Opengewerkte fiets met losse onderdelen"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-contain ${fade}`}
          style={{ opacity: exploded ? 1 : 0 }}
        />
      </div>

      {/* Hotspots + cards live OUTSIDE the clipped stage, so cards are never cut off.
          They appear only once exploded; the scene then stays exploded (sticky). */}
      {exploded &&
        HOTSPOTS.map((p) => {
          const hs = p.hotspot!;
          const price = p.priceKey ? PART_PRICES[p.priceKey] : undefined;
          const isActive = active === p.id;
          const above = hs.yPct > 50;
          const tx = hs.xPct <= 30 ? '-15%' : hs.xPct >= 70 ? '-85%' : '-50%';
          const ty = above ? 'calc(-100% - 14px)' : '14px';
          return (
            <Fragment key={p.id}>
              <button
                type="button"
                aria-label={p.label}
                aria-expanded={isActive}
                onMouseEnter={() => showCard(p.id)}
                onMouseLeave={scheduleHide}
                onFocus={() => showCard(p.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  showCard(p.id);
                }}
                style={{ left: `${hs.xPct}%`, top: `${hs.yPct}%` }}
                className="absolute z-20 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-fg shadow-lg ring-2 ring-bg transition-transform duration-fast ease-brand hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span
                  className="absolute inset-0 rounded-full bg-primary/50 motion-safe:animate-ping"
                  aria-hidden
                />
                <span className="relative h-2 w-2 rounded-full bg-primary-fg" aria-hidden />
              </button>

              {isActive && (
                <div
                  role="dialog"
                  aria-label={p.label}
                  onMouseEnter={clearHide}
                  onMouseLeave={scheduleHide}
                  style={{ left: `${hs.xPct}%`, top: `${hs.yPct}%`, transform: `translate(${tx}, ${ty})` }}
                  className="absolute z-30 w-56 max-w-[80vw] rounded-xl border border-border bg-surface p-4 text-left shadow-xl"
                >
                  <h3 className="font-display text-base font-bold">{p.label}</h3>
                  <dl className="mt-2 space-y-1 text-sm">
                    {price?.material && (
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted">{t('material')}</dt>
                        <dd className="text-right font-semibold">{price.material}</dd>
                      </div>
                    )}
                    {price?.service && (
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted">{t('service')}</dt>
                        <dd className="text-right font-semibold">{price.service}</dd>
                      </div>
                    )}
                  </dl>
                  <Button
                    href={lp(locale, `/booking?part=${p.id}`)}
                    size="sm"
                    className="mt-3 w-full"
                    track="booking_request"
                    trackData={{ part: p.id }}
                  >
                    {t('bookThis')}
                  </Button>
                </div>
              )}
            </Fragment>
          );
        })}
    </figure>
  );
}
