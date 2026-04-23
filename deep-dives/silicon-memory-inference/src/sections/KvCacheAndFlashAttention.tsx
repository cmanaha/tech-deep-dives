import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function KvCacheAndFlashAttention() {
  return (
    <SectionShell
      title="KV Cache and FlashAttention"
      subtitle="Attention variants, PagedAttention, and streaming kernels"
      tldr={[
        'During decode, the KV cache dominates HBM footprint and bandwidth. Every generated token reads the entire cache for that sequence.',
        'MHA (Multi-Head Attention) keeps K and V per head. MQA (Multi-Query) shares one K/V across all heads. GQA (Grouped-Query) groups heads and shares K/V per group — a quality-preserving middle ground.',
        'PagedAttention treats the KV cache like an OS treats virtual memory: allocate in blocks, avoid fragmentation, share prefix blocks across requests.',
        'FlashAttention-3 fuses the attention computation into a single streaming kernel — the full attention matrix never materializes in HBM.',
      ]}
      scope={[
        'KV cache anatomy: per-layer, per-head, per-token, per-sequence. Footprint formulas for typical models.',
        'Attention variants: MHA, MQA, GQA — quality-throughput trade-off and which models use which.',
        'PagedAttention: block-based allocation, prefix sharing, fragmentation avoidance, vLLM implementation.',
        'FlashAttention-1 / 2 / 3: streaming, tiling, SMEM and TMEM usage, IO-aware design.',
        'Prefill vs decode cache behavior: prefill writes, decode reads — the asymmetry drives disaggregated serving.',
        'Cache eviction, cache reuse (prefix caching, system-prompt caching), and cache compression.',
      ]}
      panelistMap="Shared technical ground across all panelists. AWS leads on vLLM + Bedrock serving. Cerebras collapses the cache into wafer SRAM. HyperCIM would attack the attention matmul at the memory-array level."
      evaluationLens={[
        'What attention variant does the target model use — is it already GQA-optimized?',
        'Is the runtime using FlashAttention-3, FlashAttention-2, or a materialized kernel?',
        'Is the serving stack PagedAttention-aware, or is it fragmenting the KV budget?',
        'Does the workload benefit from prefix caching — are many requests sharing a long prompt?',
      ]}
    />
  );
}
