/**
 * Server endpoints shared by playwright.config.ts and the gate tests.
 *
 * Kept out of the config file so a test importing a URL does not pull the
 * whole config module into the worker.
 */

const PREVIEW_PORT = Number(process.env.EFA_PREVIEW_PORT ?? 4173);
const DEV_PORT = Number(process.env.EFA_DEV_PORT ?? 4174);

/** Production build in dist/. What actually ships, so geometry is measured here. */
export const PREVIEW_URL = `http://127.0.0.1:${PREVIEW_PORT}/`;

/** Vite dev server. The only place React development warnings still exist. */
export const DEV_URL = `http://127.0.0.1:${DEV_PORT}/`;

export const PORTS = { preview: PREVIEW_PORT, dev: DEV_PORT };

/** 1440 is the desktop reading width. 390 is a phone, per CLAUDE.md. */
export const VIEWPORTS = {
  'desktop-1440': { width: 1440, height: 900 },
  'mobile-390': { width: 390, height: 844 },
} as const;

export type ViewportName = keyof typeof VIEWPORTS;
