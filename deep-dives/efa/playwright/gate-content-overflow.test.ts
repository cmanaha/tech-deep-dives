import { test, expect } from '@playwright/test';
import { PREVIEW_URL } from './lib/env';
import { SECTIONS } from './lib/sections';
import { openApp, visitSection, expandAllSections } from './lib/app';
import { probeOverflow } from './lib/geometry';
import {
  writeGateReport,
  failureMessage,
  diveRoot,
  type Finding,
  type GateReport,
} from './lib/report';

/**
 * gate-content-overflow: nothing spills horizontally out of the box it sits
 * in, at either tested viewport.
 *
 * Two checks, both of which describe a bug a reader would actually hit:
 *
 *   document width  If the document scrolls wider than the viewport, the
 *                   whole page rocks sideways on a phone. The gate then names
 *                   the deepest elements sticking out, skipping anything
 *                   inside a container that scrolls or clips on purpose,
 *                   because a Cloudscape table that scrolls sideways is a
 *                   design decision rather than a defect.
 *   diagram width   Every inline SVG has to fit inside its parent's content
 *                   box. A diagram wider than its container is the specific
 *                   failure CLAUDE.md's responsive rule is about.
 */

test('no element overflows its container horizontally', async ({ page }, testInfo) => {
  const viewport = testInfo.project.name;
  const size = page.viewportSize() ?? { width: 0, height: 0 };
  const findings: Finding[] = [];
  const visited: string[] = [];
  let elementsChecked = 0;

  let previousH1 = await openApp(page, PREVIEW_URL);

  for (const section of SECTIONS) {
    try {
      previousH1 = await visitSection(page, section.id, previousH1);
    } catch {
      // gate-routes owns mount failures.
      previousH1 = await openApp(page, PREVIEW_URL);
      continue;
    }
    visited.push(section.id);
    await expandAllSections(page);

    const probe = await probeOverflow(page);
    elementsChecked += 1;

    if (probe.documentScrollWidth > probe.innerWidth + 1) {
      const overshoot = probe.documentScrollWidth - probe.innerWidth;
      if (probe.wideElements.length === 0) {
        findings.push({
          section: section.id,
          subject: 'document',
          detail: `document scrolls ${overshoot}px wider than the ${probe.innerWidth}px viewport, but no single element could be pinned as the cause`,
        });
      }
      probe.wideElements.forEach((el) =>
        findings.push({
          section: section.id,
          subject: el.selector,
          detail:
            `sticks out horizontally: spans ${el.left} to ${el.right} against a ${probe.innerWidth}px viewport ` +
            `(document is ${overshoot}px too wide). Text: "${el.text}"`,
        }),
      );
    }

    probe.svgOverflows.forEach((svg) =>
      findings.push({
        section: section.id,
        subject: svg.title,
        detail:
          `diagram is wider than its container: ` +
          `${svg.overshootLeft > 0 ? `${svg.overshootLeft}px past the left edge` : ''}` +
          `${svg.overshootLeft > 0 && svg.overshootRight > 0 ? ' and ' : ''}` +
          `${svg.overshootRight > 0 ? `${svg.overshootRight}px past the right edge` : ''}`,
      }),
    );
  }

  const report: GateReport = {
    gate: 'gate-content-overflow',
    viewport,
    width: size.width,
    height: size.height,
    baseUrl: PREVIEW_URL,
    subjectLabel: 'sections measured',
    subjectsChecked: elementsChecked,
    sectionsVisited: visited,
    findings,
    notes: [
      'Elements inside an ancestor whose overflow-x is auto, scroll or hidden are out of scope. Those containers hold their content on purpose.',
      'Only elements crossing the right edge are reported. In an LTR layout nothing left of the origin widens the document, and left: -10000px is how Cloudscape hides text for screen readers.',
      'Only the deepest offender is reported, widest first. An ancestor that is wide only because a child is wide adds nothing.',
      'Collapsed ExpandableSections are opened first, so content that is hidden by default is still measured.',
    ],
  };
  const file = writeGateReport(diveRoot(testInfo), report);
  await testInfo.attach('gate-content-overflow report', {
    path: file,
    contentType: 'text/markdown',
  });

  expect(findings, failureMessage(report, file)).toEqual([]);
});
