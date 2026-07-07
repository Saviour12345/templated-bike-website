/**
 * Shared Tailwind preset for the Max portfolio.
 *
 * Maps the @max/tokens CSS-variable contract onto Tailwind's theme so every
 * component is written once and re-themed per site purely by swapping the
 * imported token file (eco-green / trades-steel / agency-premium).
 *
 * Colours are stored as space-separated RGB channels (e.g. `--color-primary: 21 128 61`)
 * so Tailwind's `<alpha-value>` opacity modifiers keep working (`bg-primary/80`).
 */

/** @param {string} v CSS custom property name */
const channel = (v) => `rgb(var(${v}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  // `content` is set per-app (each app adds the @max/ui source glob).
  theme: {
    extend: {
      colors: {
        bg: channel('--color-bg'),
        fg: channel('--color-fg'),
        surface: channel('--color-surface'),
        primary: {
          DEFAULT: channel('--color-primary'),
          fg: channel('--color-primary-fg'),
        },
        accent: {
          DEFAULT: channel('--color-accent'),
          fg: channel('--color-accent-fg'),
        },
        muted: channel('--color-muted'),
        border: channel('--color-border'),
        ring: channel('--color-ring'),
      },
      borderColor: {
        DEFAULT: channel('--color-border'),
      },
      ringColor: {
        DEFAULT: channel('--color-ring'),
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
      },
      transitionTimingFunction: {
        brand: 'var(--motion-ease)',
        'brand-out': 'var(--motion-ease-out)',
      },
      transitionDuration: {
        fast: 'var(--motion-duration-fast)',
        DEFAULT: 'var(--motion-duration)',
        slow: 'var(--motion-duration-slow)',
      },
      maxWidth: {
        container: '80rem',
        prose: '70ch',
      },
      keyframes: {
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(var(--motion-travel))' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up var(--motion-duration-slow) var(--motion-ease-out) both',
        'pulse-soft': 'pulse-soft 2.4s var(--motion-ease) infinite',
      },
    },
  },
  plugins: [],
};
