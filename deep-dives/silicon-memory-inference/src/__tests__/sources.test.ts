import { describe, it, expect } from 'vitest';
import { collectSources, sourceFiles } from '../sources';
import { renderSourcesMarkdown } from '../sources/markdown';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const BRANCH_PIN = /github\.com\/[^/]+\/[^/]+\/(blob|tree)\/(main|master)\//;
const HF_BRANCH_PIN = /huggingface\.co\/.+\/(blob|tree|resolve)\/main\//;

describe('source registry', () => {
  const files = sourceFiles();

  it('has at least one source file with records', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files.map((f) => [`${f.section}.${f.key}`, f.source] as const))(
    '%s is a complete, pinned record',
    (_id, source) => {
      expect(source.title.trim()).not.toBe('');
      expect(source.publisher.trim()).not.toBe('');
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.url).not.toMatch(BRANCH_PIN);
      expect(source.url).not.toMatch(HF_BRANCH_PIN);
      expect([0, 1, 2, 3]).toContain(source.tier);
      expect(source.accessed).toMatch(ISO_DATE);
    }
  );

  it('gives one URL the same tier everywhere it is cited', () => {
    const tierByUrl = new Map<string, number>();
    const conflicts: string[] = [];
    for (const { section, source } of files) {
      const seen = tierByUrl.get(source.url);
      if (seen !== undefined && seen !== source.tier) {
        conflicts.push(`${source.url}: tier ${seen} vs ${source.tier} in ${section}`);
      }
      tierByUrl.set(source.url, source.tier);
    }
    expect(conflicts).toEqual([]);
  });

  it('gives one URL the same title everywhere it is cited', () => {
    const titleByUrl = new Map<string, string>();
    const conflicts: string[] = [];
    for (const { section, source } of files) {
      const seen = titleByUrl.get(source.url);
      if (seen !== undefined && seen !== source.title) {
        conflicts.push(`${source.url}: "${seen}" vs "${source.title}" in ${section}`);
      }
      titleByUrl.set(source.url, source.title);
    }
    expect(conflicts).toEqual([]);
  });

  it('keeps sources.md in sync with the registry', async () => {
    await expect(renderSourcesMarkdown(collectSources())).toMatchFileSnapshot(
      '../../sources.md'
    );
  });
});
