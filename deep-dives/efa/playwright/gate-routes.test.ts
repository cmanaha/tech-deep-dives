import { test, expect } from '@playwright/test';
import { PREVIEW_URL } from './lib/env';
import { SECTIONS } from './lib/sections';
import { openApp, visitSection } from './lib/app';
import {
  writeGateReport,
  failureMessage,
  diveRoot,
  type Finding,
  type GateReport,
} from './lib/report';

/**
 * gate-routes: every section in the nav can be selected and mounts real
 * content.
 *
 * This is the load-bearing gate for this app. All 20 sections are React.lazy
 * behind one Suspense boundary and there is no error boundary, so a broken
 * import does not fail the build, does not fail typecheck, and does not fail a
 * unit test. It shows up only at runtime, as a spinner that never resolves.
 * Nothing but a browser catches it.
 *
 * Checks, per section:
 *   1. the nav link exists and is reachable at this viewport
 *   2. an h1 appears in the content region within the timeout
 *   3. the h1 differs from the previous section's, which is what proves the
 *      new chunk mounted rather than the old body lingering behind a spinner
 *   4. the content region carries a real amount of text, not just a heading
 *   5. no uncaught page error fired during the transition
 *
 * It also compares the rendered nav against playwright/lib/sections.ts and
 * fails on drift in either direction, so the duplicated list cannot rot.
 *
 * Runs under both the desktop-1440 and mobile-390 projects. At 390 the nav
 * lives in a closed drawer, so this is also the gate that proves every
 * section is reachable on a phone.
 */

const MIN_CONTENT_CHARS = 400;

test('every nav section mounts real content', async ({ page }, testInfo) => {
  const viewport = testInfo.project.name;
  const size = page.viewportSize() ?? { width: 0, height: 0 };
  const findings: Finding[] = [];
  const visited: string[] = [];
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  let previousH1 = await openApp(page, PREVIEW_URL);

  // Nav integrity first. The rest of the gate walks a list, so the list being
  // right is a precondition for the walk meaning anything.
  const navHrefs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href^="#"]'))
      .map((a) => a.getAttribute('href') ?? '')
      .filter((href) => href.length > 1)
      .map((href) => href.slice(1)),
  );
  const expected = SECTIONS.map((s) => s.id);
  expected
    .filter((id) => !navHrefs.includes(id))
    .forEach((id) =>
      findings.push({
        section: id,
        subject: 'nav integrity',
        detail: `section id "${id}" is listed in playwright/lib/sections.ts but is not in the rendered nav`,
      }),
    );
  navHrefs
    .filter((id) => !expected.includes(id))
    .forEach((id) =>
      findings.push({
        section: id,
        subject: 'nav integrity',
        detail: `section id "${id}" is in the rendered nav but is not listed in playwright/lib/sections.ts`,
      }),
    );

  const seenHeadings = new Map<string, string>();

  for (const section of SECTIONS) {
    if (!navHrefs.includes(section.id)) continue;
    const errorsBefore = pageErrors.length;

    try {
      previousH1 = await visitSection(page, section.id, previousH1);
    } catch (error) {
      const message = error instanceof Error ? error.message.split('\n')[0] : String(error);
      findings.push({
        section: section.id,
        subject: section.title,
        detail: `did not mount: ${message}. Either the lazy chunk failed to load or the Suspense fallback is still standing in for the section body.`,
      });
      // Reload so the next section starts from a known state.
      previousH1 = await openApp(page, PREVIEW_URL);
      continue;
    }

    visited.push(section.id);

    const contentChars = await page.evaluate(() => {
      const main = document.querySelector('main');
      const h1 = main?.querySelector('h1');
      if (!main || !h1) return 0;
      let root: Element = h1;
      while (root.parentElement && root.parentElement !== main) {
        root = root.parentElement;
      }
      return (root.textContent ?? '').trim().length;
    });

    if (contentChars < MIN_CONTENT_CHARS) {
      findings.push({
        section: section.id,
        subject: section.title,
        detail: `content region holds only ${contentChars} characters, expected at least ${MIN_CONTENT_CHARS}. The section mounted but rendered almost nothing.`,
      });
    }

    const duplicate = seenHeadings.get(previousH1);
    if (duplicate !== undefined) {
      findings.push({
        section: section.id,
        subject: section.title,
        detail: `h1 "${previousH1}" is identical to the h1 of section "${duplicate}", so this gate cannot tell the two apart. Give each section a distinct h1.`,
      });
    } else {
      seenHeadings.set(previousH1, section.id);
    }

    pageErrors.slice(errorsBefore).forEach((message) =>
      findings.push({
        section: section.id,
        subject: section.title,
        detail: `uncaught page error while mounting: ${message}`,
      }),
    );
  }

  const report: GateReport = {
    gate: 'gate-routes',
    viewport,
    width: size.width,
    height: size.height,
    baseUrl: PREVIEW_URL,
    subjectLabel: 'nav sections',
    subjectsChecked: navHrefs.length,
    sectionsVisited: visited,
    findings,
    notes: [
      'Served from the production build in dist/, which is what ships.',
      'A section counts as mounted only when a new h1 replaces the previous one, so a stuck Suspense spinner reads as a failure rather than a pass.',
      'At 390 wide the side nav starts closed, so each click also exercises the drawer toggle.',
    ],
  };
  const file = writeGateReport(diveRoot(testInfo), report);
  await testInfo.attach('gate-routes report', { path: file, contentType: 'text/markdown' });

  expect(findings, failureMessage(report, file)).toEqual([]);
});
