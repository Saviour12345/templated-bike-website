/**
 * Token-driven hover utility class strings (WS6f). All are transform/opacity only
 * and gated behind `motion-safe:` so the reduced-motion kill-switch neutralises them.
 */
export const hoverLift =
  'transition-[transform,box-shadow] duration-200 ease-brand motion-safe:hover:-translate-y-1 hover:shadow-lg';

export const hoverZoomImage =
  'transition-transform duration-300 ease-brand motion-safe:group-hover:scale-105';

export const hoverIconNudge =
  'transition-transform duration-200 ease-brand motion-safe:group-hover:translate-x-1';

export const hoverScale =
  'transition-transform duration-fast ease-brand motion-safe:hover:scale-[1.03]';

/** Animated underline reveal for inline links. */
export const hoverUnderline =
  'bg-gradient-to-r from-primary to-primary bg-[length:0%_2px] bg-left-bottom bg-no-repeat ' +
  'transition-[background-size] duration-300 ease-brand hover:bg-[length:100%_2px]';
