import type { ReactNode } from 'react';
import Badge from '@cloudscape-design/components/badge';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';

/**
 * Inline citation for the LLM training systems dive.
 *
 * The reader sees, without clicking: the source tier, the venue of a paper (or "preprint"),
 * any provenance marker, the linked source, and the date it was read. Code citations are pinned
 * to a release tag or a 40-character commit, and arXiv citations to a paper version, so a
 * reader can open exactly what was read.
 *
 * Tiers follow the dive's research guide (RESEARCH-GUIDE.md section 1):
 *   0 = our own experiments (logged under research/)
 *   1 = source code at a pinned ref, official framework docs, first-party AWS and NVIDIA docs,
 *       spec sheets and price files (a spec-sheet peak is a vendor specification)
 *   2 = first-party lab or vendor posts and talks (their performance numbers stay claims)
 *   3 = papers (venue or "preprint" shown) and third-party technical analysis
 * Tier 4 (tutorials, summaries, press) is never cited.
 *
 * Same contract as the RL dive's Cite.
 */

/** Date the sources for this dive were read. */
export const ACCESSED = '2026-10-31';

/** Framework and repository pins used across the dive (tags; SHAs in the research registers). */
export const PYTORCH_TAG = 'v2.15.0';
export const TORCHTITAN_TAG = 'v0.4.0';
export const TORCHTITAN_NEURON_TAG = 'release-2.33.0';
export const MEGATRON_TAG = 'core_v0.20.0';
export const MEGATRON_BRIDGE_TAG = 'v0.7.0';
export const NEMO_TAG = 'v3.0.0';
export const NEMO_2_TAG = 'v2.7.3';
export const NEMO_AUTOMODEL_TAG = 'v0.7.0';
export const NEMO_RL_TAG = 'v0.7.0';
export const DEEPSPEED_TAG = 'v0.19.9';
export const ACCELERATE_TAG = 'v1.15.0';
export const TRANSFORMERS_TAG = 'v5.22.1';
export const TRANSFORMER_ENGINE_TAG = 'v2.21.0';
export const NANOTRON_TAG = 'v0.5';
export const AXOLOTL_TAG = 'v0.21.1';
export const LLAMA_FACTORY_TAG = 'v0.9.5';
export const NCCL_TESTS_TAG = 'v2.21.1';
export const S3_CONNECTOR_TAG = 'v1.5.0';
export const MOUNTPOINT_TAG = 'mountpoint-s3-1.24.0';
export const DCGM_TAG = 'v4.7.0';
export const DCGM_EXPORTER_TAG = '4.8.4';
export const HTA_TAG = 'v0.6.1';
export const NEURON_SDK_SHA = '10832bbcc6b6920b3046a7d7aa59b6b684f6b81a';
export const HYPERPOD_RECIPES_TAG = '2.0.11';
export const HYPERPOD_CLI_TAG = 'v3.13.0';
export const SAGEMAKER_SDK_TAG = 'v3.28.0';
export const PARALLELCLUSTER_TAG = 'v3.16.2';
export const KUEUE_SHA = '14b792888dcb30cf055bf2618b6260a4989cf85f';
export const KUBEFLOW_TRAINER_SHA = '658725bdae5c7e3a0854d93ac6ff492e109a22ab';
export const DLC_SHA = '156076c639a310c6e86ddae64a6e1fce8a34087c';
export const AWSOME_DISTRIBUTED_TRAINING_SHA = '3a1002576ccef26e66ba714303b10ccdaa645691';
export const METASEQ_SHA = 'f7ffa5fd61cf90f498a36d365c13dd7f1a912ff7';
export const LLAMA_MODELS_TAG = 'v0.2.0';

/**
 * Commit of this repository that holds the Tier 0 experiment logs. Tier 0 links point at it,
 * so the log a reader opens is the one the page describes.
 */
export const DIVE_REPO_SHA = 'b0194661bd4b1be854e3cbeaa0b53fa2dd7058b3';

export type Tier = 0 | 1 | 2 | 3;

/** How the claim relates to its source, when that is more than "the source says so". */
export type CiteKind = 'code' | 'doc-code-conflict' | 'vendor-claim';

/** Versioned arXiv abstract page. The id must carry its version, e.g. arxiv('2407.21783v3'). */
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
    `deep-dives/llm-training-systems/research/${path.replace(/^\//, '')}`,
  );
}

/** E1: activation memory per Llama 3.1 8B layer on one GB10. */
export const E1_URL = researchUrl('2026-10/E1-spark-activation-memory.md');
/** E2: step time, recomputation price and MFU against a measured GEMM ceiling on one GB10. */
export const E2_URL = researchUrl('2026-10/E2-spark-step-time-recompute.md');
/** E3: FSDP2 collectives per optimizer step under gradient accumulation. */
export const E3_URL = researchUrl('2026-10/E3-spark-fsdp2-collectives.md');
/** E4: checkpoint staging with dcp.save, bare async_save and a pinned stager. */
export const E4_URL = researchUrl('2026-10/E4-spark-checkpoint-staging.md');
/** The research guide, which holds the AWS experiment protocols A0 to A5 (not yet run). */
export const GUIDE_URL = gh(
  'cmanaha/tech-deep-dives',
  DIVE_REPO_SHA,
  'deep-dives/llm-training-systems/RESEARCH-GUIDE.md',
);

export interface CiteProps {
  /** Tier of the source. */
  tier: Tier;
  /** Full URL. Use arxiv(), gh(), ghTree() or researchUrl() so the version pin is applied. */
  href: string;
  /** Short visible title, e.g. "Llama 3 Herd of Models, Table 5" or "PyTorch fsdp.py L120-L130". */
  children: ReactNode;
  /** For Tier 3 papers: the confirmed venue ("SC 2023") or "preprint". */
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
