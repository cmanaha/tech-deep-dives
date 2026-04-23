import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function InferenceMemoryTechniques() {
  return (
    <SectionShell
      title="Inference Memory Techniques"
      subtitle="How software attacks the bandwidth wall"
      tldr={[
        'KV cache is the dominant consumer of HBM during decode. Reducing its footprint is the single largest lever in inference optimization.',
        'GQA and MQA share K and V across query heads to cut KV cache size; PagedAttention manages the cache like an OS manages virtual memory.',
        'FlashAttention-3 fuses attention into a single streaming kernel that never materializes the full attention matrix in HBM.',
        'Quantization (INT8, FP8, FP4, NVFP4, MXFP8) is a memory optimization first and a compute optimization second — the bandwidth savings usually dominate the FLOP savings.',
        'Speculative decoding and disaggregated prefill-decode serving change the arithmetic intensity of the workload, not just the schedule.',
      ]}
      scope={[
        'KV cache anatomy: per-token, per-layer, per-head memory; prefill vs decode growth.',
        'Attention variants: MHA, MQA, GQA — cache-size vs quality trade-off.',
        'PagedAttention and vLLM: block-based KV management, fragmentation avoidance.',
        'FlashAttention-2 and FlashAttention-3 — streaming, tiling, and SMEM/TMEM usage.',
        'Quantization formats: INT8, FP8, FP6, FP4 with block scaling (NVFP4 E2M1, MXFP4, MXFP8).',
        'Speculative decoding families: draft-target, PARD, PACE — how they shift arithmetic intensity.',
        'Disaggregated serving: separating prefill (compute-bound) from decode (memory-bound), splitware across instance types.',
      ]}
      panelistMap="Shared territory. AWS can speak to vLLM on P5/P6, Bedrock batch inference, and SageMaker model servers. Cerebras and HyperCIM will have their own analogues — note how each architecture's native memory model changes which of these tricks matter."
      evaluationLens={[
        'Does the model serve with GQA or MQA? If MHA, the KV cache is carrying load that could be eliminated.',
        'Is attention actually using FlashAttention-3, or falling back to a materialized kernel?',
        'What quantization format is deployed in production — and does the silicon execute it natively or via software emulation?',
        'Is prefill disaggregated from decode? If not, decode is paying for prefill-sized kernels.',
      ]}
    />
  );
}
