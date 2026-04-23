import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function DisaggregatedServingAndSpeculative() {
  return (
    <SectionShell
      title="Disaggregated Serving and Speculative Decoding"
      subtitle="Splitting prefill from decode and shifting arithmetic intensity"
      tldr={[
        'Prefill is compute-bound. Decode is memory-bound. Running both on the same fleet forces one to waste the other silicon.',
        'Disaggregated serving runs prefill on high-FLOP silicon (B200, Trainium2) and decode on bandwidth-optimized silicon (H200, or the same B200 at a different batch size), migrating the KV cache between them.',
        'KV migration is a fabric problem. NIXL + EFA is the current AWS answer; NVLink-C2C inside an UltraServer rack is another.',
        'Speculative decoding uses a small draft model to propose tokens that a larger target model verifies in parallel. PARD + PACE is the current frontier.',
        'Both techniques change the arithmetic intensity of the workload rather than just the schedule.',
      ]}
      scope={[
        'Prefill vs decode: arithmetic-intensity asymmetry and why it wastes silicon when co-hosted.',
        'Disaggregated serving architectures: DistServe, Mooncake, and production variants.',
        'KV cache migration: serialization, fabric choice, tail-latency of the migration itself.',
        'NIXL (inference-oriented transfer layer) and its integration with EFA on AWS.',
        'Speculative decoding families: draft-target, self-speculation, tree-attention, PARD, PACE.',
        'Continuous batching and chunked prefill as simpler alternatives to full disaggregation.',
        'Cost implications: two fleets, two models of billing, capacity planning.',
      ]}
      panelistMap="AWS-strong. EFA + NIXL plus Trainium plus GPU heterogeneity lets AWS describe disaggregated serving concretely. Cerebras sidesteps by fitting everything on-wafer; HyperCIM reshapes the decode side at the memory level."
      evaluationLens={[
        'Is the target traffic mix long-prompt (prefill-heavy) or short-prompt (decode-dominated)?',
        'Does the application tolerate the tail latency of KV migration under load?',
        'Is speculative decoding appropriate — is there a draft model that preserves enough target-model behavior?',
        'What is the fleet cost of running disaggregated vs batched vs chunked-prefill?',
      ]}
    />
  );
}
