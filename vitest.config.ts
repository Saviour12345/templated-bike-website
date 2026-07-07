import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Unit tests target the pure CycleSoftware mapper (src/lib/cyclesoftware/) — no
// jsdom/Next runtime needed. The '@' alias mirrors tsconfig paths so type-only
// imports of app modules resolve.
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
