import type { Source, Tier } from '../components/Cite';

/**
 * The bibliography, collected from every per-section source file.
 *
 * Each section keeps its sources in src/sources/<SectionName>.ts and exports
 * them as `S`, an object of named Source records. This module gathers all of
 * them so the Glossary and Sources appendix and sources.md are generated from
 * the same records the inline citations use, and cannot drift from them.
 */
type SourceModule = { S: Record<string, Source> };

const modules = import.meta.glob<SourceModule>(['./*.ts', '!./index.ts', '!./markdown.ts'], {
  eager: true,
});

export interface CitedSource extends Source {
  /** Section files that cite this URL, e.g. ['HbmAndBandwidthWall']. */
  sections: string[];
}

function sectionName(path: string): string {
  return path.replace(/^\.\//, '').replace(/\.ts$/, '');
}

/** Every distinct source, keyed by URL, with the sections that cite it. */
export function collectSources(): CitedSource[] {
  const byUrl = new Map<string, CitedSource>();
  for (const [path, mod] of Object.entries(modules)) {
    const section = sectionName(path);
    for (const source of Object.values(mod.S)) {
      const existing = byUrl.get(source.url);
      if (existing) {
        // Tier and title consistency across files is enforced by the tests.
        if (!existing.sections.includes(section)) existing.sections.push(section);
        if (source.accessed > existing.accessed) existing.accessed = source.accessed;
      } else {
        byUrl.set(source.url, { ...source, sections: [section] });
      }
    }
  }
  return [...byUrl.values()].sort(
    (a, b) =>
      a.tier - b.tier ||
      a.publisher.localeCompare(b.publisher) ||
      a.title.localeCompare(b.title)
  );
}

/** Raw per-file records, for the integrity tests. */
export function sourceFiles(): Array<{ section: string; key: string; source: Source }> {
  const out: Array<{ section: string; key: string; source: Source }> = [];
  for (const [path, mod] of Object.entries(modules)) {
    for (const [key, source] of Object.entries(mod.S)) {
      out.push({ section: sectionName(path), key, source });
    }
  }
  return out;
}

export const TIERS: Tier[] = [0, 1, 2, 3];
