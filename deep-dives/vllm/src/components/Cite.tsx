import type { ReactNode } from 'react';
import Badge from '@cloudscape-design/components/badge';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';

/**
 * Inline citation for the vLLM dive.
 *
 * The reader sees three things without clicking: the source tier, the linked
 * source, and the date it was read. Code citations are pinned to the release
 * tag the dive describes, so a reader can open the exact line.
 *
 * Tiers follow the repo standard (CLAUDE.md, "Fact-Checking & Sources"):
 *   1 = source code at a pinned ref, official docs, API reference, release notes
 *   2 = vendor blog, talk, product page (vendor performance numbers stay vendor claims)
 *   3 = third-party analysis, papers, press
 *
 * The shared SourceRef component words its notes for AWS documentation, so this
 * dive keeps a vendor-neutral local equivalent.
 */

/** The vLLM release every code citation in this dive is pinned to. */
export const VLLM_TAG = 'v0.31.0';
/** Commit the tag points at, for prose that names the exact source tree. */
export const VLLM_SHA = 'db9527a46873454610df6dbedf79a36d6bf1a7f6';
/** Date the sources for this revision were read. */
export const ACCESSED = '2026-10-16';

export type Tier = 1 | 2 | 3;

/** How the claim relates to its source, when that is more than "the source says so". */
export type CiteKind = 'code' | 'doc-code-conflict';

/** Build a tag-pinned GitHub permalink into the vLLM repository. */
export function vllmUrl(path: string, lines?: string): string {
  const base = `https://github.com/vllm-project/vllm/blob/${VLLM_TAG}/${path}`;
  return lines ? `${base}#${lines}` : base;
}

/** Build a docs.vllm.ai link for the release this dive describes. */
export function vllmDocsUrl(page: string): string {
  return `https://docs.vllm.ai/en/${VLLM_TAG}/${page.replace(/^\//, '')}`;
}

export interface CiteProps {
  /** Tier of the source. */
  tier: Tier;
  /** Full URL. Use vllmUrl() for vLLM code so the tag pin is applied. */
  href: string;
  /** Short visible title, e.g. "scheduler.py L120-L140" or "vLLM docs: Prefix caching". */
  children: ReactNode;
  /** Date read. Defaults to this revision's research date. */
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
