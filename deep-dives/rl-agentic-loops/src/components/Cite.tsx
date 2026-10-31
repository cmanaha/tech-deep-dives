import type { ReactNode } from 'react';
import Badge from '@cloudscape-design/components/badge';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';

/**
 * Inline citation for the RL and agentic learning loops dive.
 *
 * The reader sees, without clicking: the source tier, the venue of a paper (or "preprint"),
 * any provenance marker, the linked source, and the date it was read. Code citations are pinned
 * to a release tag or a 40-character commit, and arXiv citations to a paper version, so a
 * reader can open exactly what was read.
 *
 * Tiers follow the dive's research guide (RESEARCH-GUIDE.md section 1):
 *   0 = our own experiments (logged under research/)
 *   1 = source code at a pinned ref, official framework docs, first-party AWS docs and pricing
 *   2 = first-party lab or vendor posts and talks (their performance numbers stay claims)
 *   3 = papers (venue or "preprint" shown) and third-party technical analysis
 * Tier 4 (tutorials, summaries, press) is never cited.
 *
 * Same contract as the SGLang and vLLM dives' Cite, extended with Tier 0 and paper venues.
 */

/** Date the sources for this dive were read. */
export const ACCESSED = '2026-10-30';

/** Framework and repository pins used across the dive. */
export const TRL_TAG = 'v1.16.0';
/** TRL release that last shipped the PPO trainer (removed in v1.13.0). */
export const TRL_PPO_TAG = 'v1.12.0';
export const VERL_TAG = 'v0.9.1';
export const OPENRLHF_TAG = 'v0.11.2';
export const SLIME_TAG = 'v0.4.0';
export const PRIME_RL_TAG = 'v0.10.0';
export const VLLM_TAG = 'v0.28.0';
export const DSPY_TAG = '3.4.1';
export const GEPA_TAG = 'v0.1.4';
export const AUTORESEARCH_SHA = '228791fb499afffb54b46200aca536f79142f117';
export const HYPERPOD_RECIPES_SHA = 'a6030c319908c8a1b74cb619b00476f8e6baa04f';

/**
 * Commit of this repository that holds the Tier 0 experiment logs. Tier 0 links point at it,
 * so the log a reader opens is the one the page describes.
 */
export const DIVE_REPO_SHA = 'b763d34a9a5a1e3e28a33daf44b67fb03781a757';

export type Tier = 0 | 1 | 2 | 3;

/** How the claim relates to its source, when that is more than "the source says so". */
export type CiteKind = 'code' | 'doc-code-conflict' | 'vendor-claim';

/** Versioned arXiv abstract page. The id must carry its version, e.g. arxiv('2402.03300v3'). */
export function arxiv(idWithVersion: string): string {
  return `https://arxiv.org/abs/${idWithVersion}`;
}

/** Tag- or SHA-pinned GitHub permalink to a file, with an optional line fragment ('L10-L20'). */
export function gh(repo: string, ref: string, path: string, lines?: string): string {
  const base = `https://github.com/${repo}/blob/${ref}/${path.replace(/^\//, '')}`;
  return lines ? `${base}#${lines}` : base;
}

/** Tag- or SHA-pinned GitHub link to a directory (or the repository root when dir is empty). */
export function ghTree(repo: string, ref: string, dir = ''): string {
  const d = dir.replace(/^\//, '');
  return `https://github.com/${repo}/tree/${ref}${d ? `/${d}` : ''}`;
}

/** Link to a file of this dive's research folder at the pinned repository commit (Tier 0 logs). */
export function researchUrl(path: string): string {
  return gh(
    'cmanaha/tech-deep-dives',
    DIVE_REPO_SHA,
    `deep-dives/rl-agentic-loops/research/${path.replace(/^\//, '')}`,
  );
}

/** The E0 log: GRPO smoke test on a DGX Spark. */
export const E0_URL = researchUrl('2026-10/E0-spark-smoke.md');

export interface CiteProps {
  /** Tier of the source. */
  tier: Tier;
  /** Full URL. Use arxiv(), gh(), ghTree() or researchUrl() so the version pin is applied. */
  href: string;
  /** Short visible title, e.g. "GEPA, Table 1" or "TRL grpo_config.py L681-L688". */
  children: ReactNode;
  /** For Tier 3 papers: the confirmed venue ("NeurIPS 2025") or "preprint". */
  venue?: string;
  /** Date read. Defaults to this dive's research date. */
  accessed?: string;
  /** Optional provenance marker. */
  kind?: CiteKind;
}

const tierColor: Record<Tier, 'green' | 'blue' | 'grey' | 'severity-low'> = {
  0: 'green',
  1: 'blue',
  2: 'grey',
  3: 'severity-low',
};

const kindLabel: Record<CiteKind, string> = {
  code: 'read from source',
  'doc-code-conflict': 'docs vs code',
  'vendor-claim': 'vendor claim',
};

const kindColor: Record<CiteKind, 'red' | 'severity-medium'> = {
  code: 'severity-medium',
  'doc-code-conflict': 'red',
  'vendor-claim': 'severity-medium',
};

export function Cite({ tier, href, children, venue, accessed = ACCESSED, kind }: CiteProps) {
  return (
    <span data-cite-tier={tier}>
      <Badge color={tierColor[tier]}>{tier === 0 ? 'Tier 0: our run' : `Tier ${tier}`}</Badge>{' '}
      {venue && (
        <>
          <Badge color="grey">{venue}</Badge>{' '}
        </>
      )}
      {kind && (
        <>
          <Badge color={kindColor[kind]}>{kindLabel[kind]}</Badge>{' '}
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
