/**
 * Motion tokens (TS mirror of the CSS custom properties in base.css).
 *
 * Consumed by motion components (ExplodedScene, hover utilities) that need the
 * numeric values in JS — e.g. staggering transforms. Keep these in sync with
 * the `--motion-*` variables in `@max/tokens/base.css`.
 */
export const motion = {
  /** ms */
  durationFast: 150,
  /** ms */
  duration: 250,
  /** ms */
  durationSlow: 450,
  ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  /** px — default exploded travel distance */
  travel: 24,
  /** ms — per-item stagger */
  stagger: 60,
} as const;

export type MotionTokens = typeof motion;
