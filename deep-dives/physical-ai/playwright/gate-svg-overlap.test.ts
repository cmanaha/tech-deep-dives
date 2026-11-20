import { test, expect } from '@playwright/test';
import { PREVIEW_URL } from './lib/env';
import { SECTIONS } from './lib/sections';
import { openApp, visitSection, expandAllSections } from './lib/app';
import { probeSvgs, diagramLabel, round1, type SvgTextBox } from './lib/geometry';
import {
  writeGateReport,
  failureMessage,
  diveRoot,
  type Finding,
  type GateReport,
} from './lib/report';

/**
 * gate-svg-overlap: no <text> in a hand-authored inline SVG collides with
 * another <text>, and none of it falls outside the viewBox.
 *
 * CLAUDE.md's Diagram Standards say to confirm a diagram against the rendered
 * output rather than trusting hand-computed coordinates. This is that check.
 * Roughly 30 diagrams in this dive were authored by writing x/y numbers into
 * .tsx files, and a browser is the only thing that knows how wide a string
 * actually paints.
 *
 * Everything is measured in viewBox user units so a finding maps directly
 * onto the coordinates a human has to edit.
 *
 * Two tolerances, both deliberately loose enough that only real collisions
 * surface:
 *
 *   OVERLAP_TOL  Text bounding boxes include ascender and descender padding,
 *                so stacked label lines share a pixel or two of box without
 *                touching visually. A pair has to overlap by more than this
 *                on BOTH axes to count.
 *   CLIP_TOL     Same padding argument at the viewBox edge.
 *
 * The report names the diagram by its <title> and prints both colliding
 * strings with their authored x/y, so a human can judge whether an adjacency
 * was intentional.
 */

const OVERLAP_TOL = 2;
const CLIP_TOL = 1;

/**
 * Advisory floor for rendered label size, in screen pixels.
 *
 * These diagrams author their smallest labels at 10px inside an 880-unit
 * viewBox. At 390 wide the Cloudscape content column is about 330px, so the
 * whole diagram scales by roughly 0.38 and that 10px label paints at under
 * 4px. Cloudscape's smallest body token is 12px; 8px is about the point where
 * glyph strokes stop resolving at 1x density, so it is a floor that flags only
 * text a reader genuinely cannot make out rather than merely small text.
 *
 * Reported, never asserted. What to do about an illegible diagram on a phone
 * is a design decision (split it, reflow it, or let it scroll), and a gate
 * should not pick.
 */
const LEGIBLE_MIN_PX = 8;

interface Collision {
  a: SvgTextBox;
  b: SvgTextBox;
  overlapX: number;
  overlapY: number;
}

function collisions(texts: SvgTextBox[]): Collision[] {
  const out: Collision[] = [];
  for (let i = 0; i < texts.length; i += 1) {
    for (let j = i + 1; j < texts.length; j += 1) {
      const a = texts[i];
      const b = texts[j];
      const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (overlapX > OVERLAP_TOL && overlapY > OVERLAP_TOL) {
        out.push({ a, b, overlapX, overlapY });
      }
    }
  }
  return out;
}

function coords(box: SvgTextBox): string {
  const authored =
    box.attrX !== null || box.attrY !== null
      ? ` authored x=${box.attrX ?? '-'} y=${box.attrY ?? '-'}`
      : '';
  return `[${round1(box.left)},${round1(box.top)} to ${round1(box.right)},${round1(box.bottom)}]${authored}`;
}

test('inline SVG text does not collide or fall outside the viewBox', async ({
  page,
}, testInfo) => {
  const viewport = testInfo.project.name;
  const size = page.viewportSize() ?? { width: 0, height: 0 };
  const findings: Finding[] = [];
  const advisories: Finding[] = [];
  const visited: string[] = [];
  let diagramsChecked = 0;

  let previousH1 = await openApp(page, PREVIEW_URL);

  for (const section of SECTIONS) {
    try {
      previousH1 = await visitSection(page, section.id, previousH1);
    } catch {
      // gate-routes owns mount failures. Skip here rather than double-report.
      previousH1 = await openApp(page, PREVIEW_URL);
      continue;
    }
    visited.push(section.id);

    // Diagrams inside a collapsed ExpandableSection have zero-size boxes and
    // would be skipped, which would make this gate pass by not looking.
    await expandAllSections(page);

    const svgs = await probeSvgs(page);
    diagramsChecked += svgs.length;

    for (const svg of svgs) {
      const label = diagramLabel(svg);

      for (const hit of collisions(svg.texts)) {
        findings.push({
          section: section.id,
          subject: label,
          detail:
            `overlap ${round1(hit.overlapX)} x ${round1(hit.overlapY)} user units: ` +
            `"${hit.a.text}" ${coords(hit.a)} against "${hit.b.text}" ${coords(hit.b)}`,
        });
      }

      if (svg.viewBox) {
        const { x, y, width, height } = svg.viewBox;
        for (const box of svg.texts) {
          const over: string[] = [];
          if (box.left < x - CLIP_TOL) over.push(`${round1(x - box.left)} past the left edge`);
          if (box.top < y - CLIP_TOL) over.push(`${round1(y - box.top)} past the top edge`);
          if (box.right > x + width + CLIP_TOL) {
            over.push(`${round1(box.right - (x + width))} past the right edge`);
          }
          if (box.bottom > y + height + CLIP_TOL) {
            over.push(`${round1(box.bottom - (y + height))} past the bottom edge`);
          }
          if (over.length > 0) {
            findings.push({
              section: section.id,
              subject: label,
              detail:
                `clipped by viewBox "${x} ${y} ${width} ${height}": "${box.text}" ` +
                `${coords(box)} is ${over.join(' and ')}`,
            });
          }
        }
      } else {
        findings.push({
          section: section.id,
          subject: label,
          detail: 'svg has no viewBox, so it cannot scale to its container and clipping cannot be checked',
        });
      }

      // Legibility. This is why the gate runs at 390 as well as 1440: the
      // geometry verdict is the same at both widths because it is measured in
      // user units, but the rendered size of a label is not.
      const sizes = svg.texts.map((t) => t.screenFontPx).filter((px) => px > 0);
      if (sizes.length > 0) {
        const smallest = Math.min(...sizes);
        if (smallest < LEGIBLE_MIN_PX) {
          const affected = sizes.filter((px) => px < LEGIBLE_MIN_PX).length;
          advisories.push({
            section: section.id,
            subject: label,
            detail:
              `smallest label renders at ${round1(smallest)}px (${affected} of ${sizes.length} labels below ${LEGIBLE_MIN_PX}px). ` +
              `The diagram is ${round1(svg.screenWidth)}px wide here against a ${svg.viewBox ? svg.viewBox.width : '?'}-unit viewBox.`,
          });
        }
      }
    }
  }

  const report: GateReport = {
    gate: 'gate-svg-overlap',
    viewport,
    width: size.width,
    height: size.height,
    baseUrl: PREVIEW_URL,
    subjectLabel: 'diagrams',
    subjectsChecked: diagramsChecked,
    sectionsVisited: visited,
    findings,
    advisories,
    notes: [
      'Scope is every svg in the content region that paints at least one <text>. Cloudscape icon svgs carry no text and are out of scope.',
      `Geometry is in viewBox user units, converted from client rects through the inverse of the svg screen CTM, so nested transform groups are handled.`,
      `A pair counts as colliding only when the boxes overlap by more than ${OVERLAP_TOL} user units on both axes. Text boxes include ascender and descender padding, so adjacent lines of a stacked label do not trip it.`,
      `Text counts as clipped when it sits more than ${CLIP_TOL} user units outside the viewBox.`,
      'Collapsed ExpandableSections are opened before measuring.',
      `Advisory only: any diagram whose smallest label renders below ${LEGIBLE_MIN_PX} screen pixels is listed but does not fail the gate.`,
    ],
  };
  const file = writeGateReport(diveRoot(testInfo), report);
  await testInfo.attach('gate-svg-overlap report', { path: file, contentType: 'text/markdown' });

  expect(findings, failureMessage(report, file)).toEqual([]);
});
