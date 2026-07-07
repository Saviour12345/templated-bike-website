const preset = require('@max/config/tailwind-preset');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [preset],
  content: [
    './src/**/*.{ts,tsx,mdx}',
    // Scan the shared component source so its utility classes are generated here.
    './packages/ui/src/**/*.{ts,tsx}',
  ],
};
