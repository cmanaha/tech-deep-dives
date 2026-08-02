import { defineConfig, devices } from '@playwright/test';
import { PREVIEW_URL, DEV_URL, PORTS, VIEWPORTS } from './playwright/lib/env';

/**
 * Tier 2 browser-invariant gates for the EFA deep dive (ADR-004 Phase 2).
 *
 * Deterministic (no LLM, same input gives the same verdict), but they need a
 * browser and they are slow, so per ADR-004 they belong to scripts/audit.sh
 * and never to scripts/ci.sh.
 *
 * Two servers come up for a single pass:
 *
 *   preview (dist/)  the production build. Everything that ships is measured
 *                    here: routing, layout geometry, SVG coordinates.
 *   dev (source)     the Vite dev server. React strips its development
 *                    warnings from a production build and this dive also sets
 *                    terser drop_console, so a console gate pointed at dist/
 *                    could never see a key warning or a DOM-nesting warning.
 *                    gate-no-console-errors points here instead.
 *
 * Both viewports run every gate. 1440 is the desktop reading width, 390 is a
 * phone, which CLAUDE.md requires diagrams stay legible at.
 */

export default defineConfig({
  testDir: './playwright',
  testMatch: /gate-.*\.test\.ts$/,
  // Each gate walks all 20 lazy sections inside one test so a finding in
  // section 3 cannot hide sections 4 through 20 from the report.
  timeout: 420_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  forbidOnly: true,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'playwright-report/results.json' }]],
  use: {
    baseURL: PREVIEW_URL,
    ...devices['Desktop Chrome'],
    // The SVG gate compares glyph bounding boxes. Motion during measurement
    // would make the verdict depend on timing.
    contextOptions: { reducedMotion: 'reduce' },
    trace: 'off',
    screenshot: 'off',
    video: 'off',
  },
  projects: [
    {
      name: 'desktop-1440',
      use: { ...devices['Desktop Chrome'], viewport: VIEWPORTS['desktop-1440'] },
    },
    {
      name: 'mobile-390',
      use: { ...devices['Desktop Chrome'], viewport: VIEWPORTS['mobile-390'] },
    },
  ],
  webServer: [
    {
      command: `pnpm exec vite preview --host 127.0.0.1 --port ${PORTS.preview} --strictPort`,
      url: PREVIEW_URL,
      reuseExistingServer: true,
      timeout: 120_000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    {
      command: `pnpm exec vite --host 127.0.0.1 --port ${PORTS.dev} --strictPort`,
      url: DEV_URL,
      reuseExistingServer: true,
      timeout: 120_000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
  ],
});
