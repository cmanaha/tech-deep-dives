import fs from 'node:fs';
import path from 'node:path';

/**
 * Per-gate markdown reports, written to the ADR-004 output convention:
 *
 *   deep-dives/{topic}/audit-reports/playwright/gate-{name}-{viewport}.md
 *
 * The point of writing to disk instead of streaming findings back is that a
 * run can be read later, diffed against the previous run, and triaged one
 * gate at a time without holding all of it in working memory.
 *
 * Every gate collects findings for all 20 sections before it asserts, so a
 * problem in section 3 never hides sections 4 through 20 from the report.
 */

export interface Finding {
  /** Section id from the nav, e.g. "datapath". */
  section: string;
  /** What the finding is about: a diagram title, an element, a URL. */
  subject: string;
  /** One line a human can act on. */
  detail: string;
}

export interface GateReport {
  gate: string;
  viewport: string;
  width: number;
  height: number;
  baseUrl: string;
  /** What the gate counted, e.g. "diagrams" or "nav links". */
  subjectLabel: string;
  subjectsChecked: number;
  sectionsVisited: string[];
  findings: Finding[];
  /**
   * Observations that are worth a human's attention but are not what this
   * gate asserts on. They never change the verdict. Keeping them separate is
   * the point: a gate that fails on judgement calls stops being a gate.
   */
  advisories?: Finding[];
  /** Scope limits and anything else a reader needs to trust the verdict. */
  notes?: string[];
}

function reportDir(rootDir: string): string {
  return path.join(rootDir, 'audit-reports', 'playwright');
}

/**
 * The deep-dive directory, which is where audit-reports/ belongs.
 *
 * testInfo.config.rootDir resolves to the testDir (playwright/), not the
 * directory holding playwright.config.ts, so it would bury reports one level
 * too deep. The config file path is the unambiguous anchor.
 */
export function diveRoot(testInfo: { config: { configFile?: string; rootDir: string } }): string {
  const configFile = testInfo.config.configFile;
  if (configFile) return path.dirname(configFile);
  return path.resolve(testInfo.config.rootDir, '..');
}

function escapePipes(value: string): string {
  return value.replace(/\|/g, '\\|');
}

function renderMarkdown(report: GateReport): string {
  const status = report.findings.length === 0 ? 'PASS' : 'FAIL';
  const lines: string[] = [];

  lines.push(`# ${report.gate} (${report.viewport})`);
  lines.push('');
  lines.push(`Status: **${status}** (${report.findings.length} finding(s))`);
  lines.push('');
  lines.push('| field | value |');
  lines.push('| --- | --- |');
  lines.push(`| generated | ${new Date().toISOString()} |`);
  lines.push(`| viewport | ${report.width} x ${report.height} |`);
  lines.push(`| base URL | ${report.baseUrl} |`);
  lines.push(`| sections visited | ${report.sectionsVisited.length} |`);
  lines.push(`| ${escapePipes(report.subjectLabel)} checked | ${report.subjectsChecked} |`);
  lines.push('');

  if (report.notes && report.notes.length > 0) {
    lines.push('## Scope');
    lines.push('');
    report.notes.forEach((note) => lines.push(`- ${note}`));
    lines.push('');
  }

  const renderGrouped = (items: Finding[]): void => {
    const bySection = new Map<string, Finding[]>();
    items.forEach((f) => {
      const bucket = bySection.get(f.section) ?? [];
      bucket.push(f);
      bySection.set(f.section, bucket);
    });
    for (const [section, sectionItems] of bySection) {
      lines.push(`### ${section} (${sectionItems.length})`);
      lines.push('');
      const bySubject = new Map<string, Finding[]>();
      sectionItems.forEach((f) => {
        const bucket = bySubject.get(f.subject) ?? [];
        bucket.push(f);
        bySubject.set(f.subject, bucket);
      });
      for (const [subject, subjectItems] of bySubject) {
        lines.push(`**${subject}**`);
        lines.push('');
        subjectItems.forEach((f) => lines.push(`- ${f.detail}`));
        lines.push('');
      }
    }
  };

  lines.push('## Findings');
  lines.push('');
  if (report.findings.length === 0) {
    lines.push('None.');
    lines.push('');
  } else {
    renderGrouped(report.findings);
  }

  if (report.advisories && report.advisories.length > 0) {
    lines.push('## Advisories');
    lines.push('');
    lines.push('These do not change the verdict above. They are a human judgement call.');
    lines.push('');
    renderGrouped(report.advisories);
  }

  lines.push('## Sections visited');
  lines.push('');
  lines.push(report.sectionsVisited.join(', '));
  lines.push('');

  return lines.join('\n');
}

/** Writes the report and returns the absolute path it landed at. */
export function writeGateReport(rootDir: string, report: GateReport): string {
  const dir = reportDir(rootDir);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${report.gate}-${report.viewport}.md`);
  fs.writeFileSync(file, renderMarkdown(report), 'utf8');
  return file;
}

/** Short assertion message pointing at the full report. */
export function failureMessage(report: GateReport, file: string): string {
  const preview = report.findings
    .slice(0, 8)
    .map((f) => `  [${f.section}] ${f.subject}: ${f.detail}`)
    .join('\n');
  const more =
    report.findings.length > 8 ? `\n  ...and ${report.findings.length - 8} more` : '';
  return `${report.gate} (${report.viewport}): ${report.findings.length} finding(s)\n${preview}${more}\nFull report: ${file}`;
}
