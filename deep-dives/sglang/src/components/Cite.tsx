import type { ReactNode } from 'react';
import Badge from '@cloudscape-design/components/badge';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';

/**
 * Inline citation for the SGLang dive.
 *
 * The reader sees three things without clicking: the source tier, the linked
 * source, and the date it was read. Code citations are pinned to the release
 * tag the dive describes, so a reader can open the exact line.
 *
 * Tiers follow the repo standard (CLAUDE.md, "Fact-Checking & Sources"):
 *   1 = source code at a pinned ref, official docs, API reference, release notes
 *   2 = project or vendor blog, talk, product page (their performance numbers stay claims)
 *   3 = third-party analysis, papers, press
 *
 * Same contract as the vLLM dive's Cite, so the two sibling dives read alike.
 */

/** The SGLang release every code citation in this dive is pinned to. */
export const SGLANG_TAG = 'v0.5.22';
/** Commit the tag points at, for prose that names the exact source tree. */
export const SGLANG_SHA = 'baa9befa381511cd4d56f83980951e5a45fffc6d';
/** Date the sources for this dive were read. */
export const ACCESSED = '2026-10-24';

export type Tier = 1 | 2 | 3;

/** How the claim relates to its source, when that is more than "the source says so". */
export type CiteKind = 'code' | 'doc-code-conflict';

const REPO = 'https://github.com/sgl-project/sglang';

/** Build a tag-pinned GitHub permalink into the SGLang repository (path from the repo root). */
export function sglangUrl(path: string, lines?: string): string {
  const base = `${REPO}/blob/${SGLANG_TAG}/${path.replace(/^\//, '')}`;
  return lines ? `${base}#${lines}` : base;
}

/** Build a tag-pinned GitHub link to a directory in the SGLang repository. */
export function sglangTreeUrl(dir: string): string {
  return `${REPO}/tree/${SGLANG_TAG}/${dir.replace(/^\//, '')}`;
}

/**
 * Tag-pinned source of a docs page, e.g. sglangDocsSrcUrl('advanced_features/hicache', 'L10-L20').
 * The rendered docs site is unversioned, so version-specific claims cite this form.
 */
export function sglangDocsSrcUrl(page: string, lines?: string): string {
  return sglangUrl(`docs/docs/${page.replace(/^\//, '')}.mdx`, lines);
}

/** Rendered docs page on docs.sglang.io (tracks the default branch). */
export function sglangDocsUrl(page: string): string {
  return `https://docs.sglang.io/docs/${page.replace(/^\//, '')}`;
}

export interface CiteProps {
  /** Tier of the source. */
  tier: Tier;
  /** Full URL. Use sglangUrl() for SGLang code so the tag pin is applied. */
  href: string;
  /** Short visible title, e.g. "scheduler.py L1975-L2010" or "SGLang docs: HiCache". */
  children: ReactNode;
  /** Date read. Defaults to this dive's research date. */
  accessed?: string;
  /** Optional provenance marker. */
  kind?: CiteKind;
}

const tierColor: Record<Tier, 'blue' | 'grey' | 'severity-low'> = {
  1: 'blue',
  2: 'grey',
  3: 'severity-low',
};

const kindLabel: Record<CiteKind, string> = {
  code: 'read from source',
  'doc-code-conflict': 'docs vs code',
};

export function Cite({ tier, href, children, accessed = ACCESSED, kind }: CiteProps) {
  return (
    <span data-cite-tier={tier}>
      <Badge color={tierColor[tier]}>{`Tier ${tier}`}</Badge>{' '}
      {kind && (
        <>
          <Badge color={kind === 'doc-code-conflict' ? 'red' : 'severity-medium'}>
            {kindLabel[kind]}
          </Badge>{' '}
        </>
      )}
      <Link external href={href}>
        {children}
      </Link>{' '}
      <Box variant="small" display="inline" color="text-body-secondary">
        (accessed {accessed})
      </Box>
    </span>
  );
}
