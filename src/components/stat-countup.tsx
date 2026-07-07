'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@max/ui';

/** Count-up number that animates once on scroll-into-view. Shows the final value instantly under reduced-motion. */
export function StatCountUp({
  value,
  suffix = '',
  label,
  durationMs = 1300,
}: {
  value: number;
  suffix?: string;
  label: string;
  durationMs?: number;
}) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (reduced) {
      setN(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (t: number) => {
              const p = Math.min(1, (t - start) / durationMs);
              const eased = 1 - Math.pow(1 - p, 3);
              setN(Math.round(eased * value));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, value, durationMs]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-5xl font-extrabold tracking-tight text-[rgb(var(--color-accent))] sm:text-6xl">
        {n}
        {suffix}
      </div>
      <p className="mt-2 text-sm font-medium text-[rgb(var(--color-brand-dark-fg))]/70">{label}</p>
    </div>
  );
}
