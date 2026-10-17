import { tierDescription } from '../components/Cite';
import { TIERS, type CitedSource } from './index';

/**
 * Renders sources.md from the same records the inline citations use.
 * src/__tests__/sources.test.ts compares the result against the committed
 * file, so the bibliography cannot drift from the page. To regenerate after
 * adding sources: pnpm --filter @tech-deep-dives/silicon-memory-inference
 * exec vitest run -u
 */
export function renderSourcesMarkdown(sources: CitedSource[]): string {
  const lines: string[] = [
    '# Sources: Silicon, Memory, and Modern Inference',
    '',
    'Generated from `src/sources/*.ts` by `src/sources/markdown.ts`. Do not edit by hand:',
    'edit the per-section source file and run the dive tests with `-u`.',
    '',
    'Tiers: Tier 0 is our own experiment (logged under `research/`). Tier 1 is official',
    'documentation, a specification, a filing or source code pinned to a commit or tag.',
    'Tier 2 is a vendor press release, blog, product page or keynote; performance figures',
    'from Tier 2 are vendor claims and the page labels them as such. Tier 3 is third-party',
    'analysis, an academic paper or trade press.',
    '',
    'Claim registers with the evidence behind each figure, including every UNKNOWN, are in',
    '`research/2026-10-refresh/`.',
    '',
    `Total distinct sources: ${sources.length}.`,
  ];

  for (const tier of TIERS) {
    const group = sources.filter((s) => s.tier === tier);
    if (group.length === 0) continue;
    lines.push('', `## ${tierDescription[tier]}`, '');
    lines.push('| Publisher | Source | Accessed | Cited in |');
    lines.push('| --- | --- | --- | --- |');
    for (const s of group) {
      const title = s.title.replace(/\|/g, '/');
      lines.push(
        `| ${s.publisher} | [${title}](${s.url}) | ${s.accessed} | ${s.sections.join(', ')} |`
      );
    }
  }
  lines.push('');
  return lines.join('\n');
}
