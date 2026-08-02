import { test, expect } from '@playwright/test';
import { DEV_URL } from './lib/env';
import { SECTIONS } from './lib/sections';
import { openApp, visitSection, expandAllSections } from './lib/app';
import {
  writeGateReport,
  failureMessage,
  diveRoot,
  type Finding,
  type GateReport,
} from './lib/report';

/**
 * gate-no-console-errors: visiting every section produces no console error,
 * no uncaught page error, and no React warning.
 *
 * This gate points at the Vite dev server, not at dist/, and that is the
 * whole reason it can find anything. React compiles its warnings out of a
 * production build, and this dive's vite.config.ts sets terser drop_console
 * on top of that, so a console gate aimed at dist/ could never see a key
 * warning, a DOM-nesting warning or a bad-prop warning. It would pass by
 * being blind. The dev server runs the same source with warnings intact.
 *
 * Everything else about the run matches the other gates: same 20 sections,
 * same two viewports, ExpandableSections opened so lazily-rendered children
 * are exercised too.
 */

// Console noise that says nothing about the app. Kept short and explicit on
// purpose: a broad ignore list is how a gate quietly stops working.
const IGNORED = [
  /\[vite\] (connecting|connected|hot updated)/i,
  /Download the React DevTools/i,
  /Failed to load resource.*favicon/i,
];

// React logs these through console.error in development, so most are caught
// by the error branch already. The patterns below promote the handful that
// React routes through console.warn instead.
const REACT_WARNING = [
  /^Warning:/,
  /validateDOMNesting/,
  /Each child in a list should have a unique "key"/,
  /cannot appear as a descendant of/,
  /React does not recognize the .* prop/,
  /Invalid DOM property/,
  /is deprecated in StrictMode/,
];

const isIgnored = (text: string): boolean => IGNORED.some((re) => re.test(text));
const isReactWarning = (text: string): boolean => REACT_WARNING.some((re) => re.test(text));

test('no console errors or React warnings while visiting every section', async ({
  page,
}, testInfo) => {
  const viewport = testInfo.project.name;
  const size = page.viewportSize() ?? { width: 0, height: 0 };
  const findings: Finding[] = [];
  const visited: string[] = [];
  let messagesSeen = 0;

  // `current` is rebound as the walk moves through sections so each message
  // is attributed to the section that was mounting when it fired.
  let current = 'app shell';
  const record = (subject: string, detail: string) => {
    findings.push({ section: current, subject, detail });
  };

  page.on('console', (message) => {
    const text = message.text().replace(/\s+/g, ' ').trim();
    messagesSeen += 1;
    if (isIgnored(text)) return;
    if (message.type() === 'error') {
      record('console.error', text.slice(0, 400));
      return;
    }
    if (message.type() === 'warning' && isReactWarning(text)) {
      record('React warning', text.slice(0, 400));
    }
  });

  page.on('pageerror', (error) => {
    record('uncaught page error', `${error.message}`.split('\n')[0].slice(0, 400));
  });

  page.on('requestfailed', (request) => {
    const url = request.url();
    if (!/\.(m?js|ts|tsx|css)(\?|$)/.test(url)) return;
    record('failed request', `${url} failed: ${request.failure()?.errorText ?? 'unknown'}`);
  });

  let previousH1 = await openApp(page, DEV_URL);

  for (const section of SECTIONS) {
    current = section.id;
    try {
      previousH1 = await visitSection(page, section.id, previousH1);
    } catch {
      // gate-routes owns mount failures against the production build.
      previousH1 = await openApp(page, DEV_URL);
      continue;
    }
    visited.push(section.id);
    await expandAllSections(page);
    // Give React a beat to flush warnings raised during commit.
    await page.waitForTimeout(150);
  }

  const report: GateReport = {
    gate: 'gate-no-console-errors',
    viewport,
    width: size.width,
    height: size.height,
    baseUrl: DEV_URL,
    subjectLabel: 'console messages',
    subjectsChecked: messagesSeen,
    sectionsVisited: visited,
    findings,
    notes: [
      'Run against the Vite dev server on purpose. React strips its development warnings from a production build and this dive also sets terser drop_console, so the same gate aimed at dist/ would pass without being able to see anything.',
      'Counted as findings: any console.error, any uncaught page error, any failed script or stylesheet request, and console.warn messages matching the React warning patterns in this file.',
      'Ignored: Vite HMR connection chatter and the React DevTools suggestion.',
    ],
  };
  const file = writeGateReport(diveRoot(testInfo), report);
  await testInfo.attach('gate-no-console-errors report', {
    path: file,
    contentType: 'text/markdown',
  });

  expect(findings, failureMessage(report, file)).toEqual([]);
});
