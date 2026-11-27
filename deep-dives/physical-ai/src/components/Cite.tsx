import type { ReactNode } from 'react';
import Badge from '@cloudscape-design/components/badge';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import registry from '../data/registry.json';

/**
 * Inline citation for the Physical AI dive.
 *
 * A citation names a claim-register entry by its ID (for example "F03-25"). The entry's pinned
 * source, tier, venue and provenance are looked up in src/data/registry.json, which
 * revamp/tools/gen-registry.mjs builds from research/2026-11/. The page never prints the ID; the
 * reader sees the tier, the venue of a paper, a provenance marker, the linked source and the date
 * it was read.
 *
 * Tiers: 0 = our own measurement; 1 = code at a pinned ref, official docs, API references;
 * 2 = first-party vendor or lab posts (their performance numbers stay claims); 3 = papers and
 * third-party analysis. Tier 4 is never cited. Entries that join or interpret other entries
 * (tier -1 in the registry) render as "our arithmetic" or "our reading" with no link of their own.
 */

/** Date every source of this dive was read. */
export const ACCESSED = '2026-11-20';

export type Tier = -1 | 0 | 1 | 2 | 3;
export type CiteKind = 'vendor-claim' | 'author-reported' | 'our-run' | 'derived' | 'our-reading' | 'code';

interface RegistryRecord {
  t: number;
  u?: string;
  l?: string;
  v?: string;
  k?: string;
  i?: string[];
  /** Access date when it differs from ACCESSED. */
  a?: string;
}

const REG = registry as Record<string, RegistryRecord>;

export interface CiteProps {
  /** Register entry ID, for example "F03-25". */
  id: string;
  /** Short visible title of the source, for example "V-JEPA 2 paper, section 4.2". */
  children: ReactNode;
  /** Overrides the provenance marker the registry derives from the entry. */
  kind?: CiteKind;
}

const tierColor: Record<number, 'green' | 'blue' | 'grey' | 'severity-low'> = {
  0: 'green',
  1: 'blue',
  2: 'grey',
  3: 'severity-low',
};

const kindLabel: Record<CiteKind, string> = {
  'vendor-claim': 'vendor claim',
  'author-reported': 'author reported',
  'our-run': 'single run',
  derived: 'derived',
  'our-reading': 'analysis',
  code: 'read from source',
};

/** Look up a register entry; exported for the sources appendix. */
export function lookup(id: string): RegistryRecord | undefined {
  return REG[id];
}

export function Cite({ id, children, kind }: CiteProps) {
  const rec = REG[id];
  if (!rec) {
    return (
      <span data-cite-id={id} data-cite-missing="true">
        <Badge color="red">unresolved citation {id}</Badge> {children}
      </span>
    );
  }
  const k = (kind ?? rec.k) as CiteKind | undefined;
  if (rec.t === -1) {
    return (
      <span data-cite-id={id} data-cite-tier="synthesis">
        <Badge color="severity-medium">{kindLabel[k ?? 'our-reading']}</Badge>{' '}
        <Box variant="small" display="inline" color="text-body-secondary">
          {children}
        </Box>
      </span>
    );
  }
  return (
    <span data-cite-id={id} data-cite-tier={rec.t}>
      <Badge color={tierColor[rec.t]}>{rec.t === 0 ? 'Tier 0: our measurement' : `Tier ${rec.t}`}</Badge>{' '}
      {rec.v && (
        <>
          <Badge color="grey">{rec.v}</Badge>{' '}
        </>
      )}
      {k && (
        <>
          <Badge color="severity-medium">{kindLabel[k]}</Badge>{' '}
        </>
      )}
      {rec.u ? (
        <Link external href={rec.u}>
          {children}
        </Link>
      ) : (
        <Box variant="span" display="inline">
          {children} <Box variant="small" display="inline" color="text-body-secondary">(log in the repository: {rec.l})</Box>
        </Box>
      )}{' '}
      <Box variant="small" display="inline" color="text-body-secondary">
        (accessed {rec.a ?? ACCESSED})
      </Box>
    </span>
  );
}

/**
 * A made-up number used to illustrate an idea. The citation check skips it; the prose around it
 * must say it is an illustration.
 */
export function Toy({ children }: { children: ReactNode }) {
  return <span data-num="toy">{children}</span>;
}

/**
 * A number we computed from cited figures and that no register entry prints. The citation check
 * skips it; the arithmetic must be visible in the same sentence or block.
 */
export function Derived({ children }: { children: ReactNode }) {
  return <span data-num="derived">{children}</span>;
}
