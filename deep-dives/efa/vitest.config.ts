import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: false,
    // Unit tests only. The Playwright gates under playwright/ are named
    // gate-*.test.ts and match Vitest's default glob, but they import
    // @playwright/test and need a browser, so Vitest collecting them fails the
    // whole run. They belong to scripts/audit.sh, not to scripts/ci.sh.
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**', 'playwright/**'],
  },
});
