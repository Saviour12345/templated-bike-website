import type { ReactElement, SVGProps } from 'react';

const base = (p: SVGProps<SVGSVGElement>) => ({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...p,
});

export const WrenchIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2 2.3-2.3Z" />
  </svg>
);

export const BatteryIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="2" y="8" width="16" height="9" rx="2" />
    <line x1="22" y1="11" x2="22" y2="14" />
    <line x1="6" y1="12.5" x2="9" y2="12.5" />
    <line x1="7.5" y1="11" x2="7.5" y2="14" />
  </svg>
);

export const RecycleIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M7 19H5a2 2 0 0 1-1.7-3l1.3-2.2" />
    <path d="m9.5 4.5 1.2-2a2 2 0 0 1 3.4 0l1.2 2" />
    <path d="M17 19h2a2 2 0 0 0 1.7-3l-1.2-2" />
    <polyline points="7 16 7 19 10 19" />
    <polyline points="14.5 4 16.5 5 15.5 7" />
  </svg>
);

export const LeafIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M11 20A7 7 0 0 1 4 13c0-5 5-9 16-9 0 9-4 16-9 16Z" />
    <path d="M4 20c4-6 8-8 13-9" />
  </svg>
);

export const ICONS: Record<string, (p: SVGProps<SVGSVGElement>) => ReactElement> = {
  wrench: WrenchIcon,
  battery: BatteryIcon,
  recycle: RecycleIcon,
  leaf: LeafIcon,
};
