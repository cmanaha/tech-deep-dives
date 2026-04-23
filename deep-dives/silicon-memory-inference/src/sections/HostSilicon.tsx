import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function HostSilicon() {
  return (
    <SectionShell
      title="Host Silicon — Graviton, EPYC, Xeon"
      subtitle="The three server CPU families on AWS and what each one bets on"
      tldr={[
        'Graviton4 is Neoverse V2; Graviton5 is Neoverse V3 with CMN-S3 and 192 MB distributed L3.',
        'AMD EPYC Turin (Zen 5) runs native 512-bit AVX-512, 12 CCDs, and powers AWS M8a, R8a, C8a, and the 5 GHz M8azn.',
        'Intel Xeon 6 Granite Rapids (Redwood Cove) adds AMX FP16, SNC3, and MRDIMM DDR5-8800. AWS ships M8i, R8i, and X8i (up to 6 TB of memory).',
        'Each family optimizes a different part of the triangle: Graviton for energy-per-instruction, EPYC for raw core count and AVX-512 throughput, Xeon for memory bandwidth and AMX tensor density.',
      ]}
      scope={[
        'Graviton4 vs Graviton5 microarchitecture — V2 vs V3 core, CMN-700 vs CMN-S3 mesh, per-core bandwidth curve as core count scales.',
        'EPYC Turin and Turin Dense — Zen 5 vs Zen 5c, native 512-bit AVX-512 datapath, CCD and GMI3-Wide topology.',
        'Xeon 6 6980P — Redwood Cove, AMX with BF16 / INT8 / FP16 (FP16 new in Xeon 6), MRDIMM-8800 support, SNC3 sub-NUMA.',
        'Instance families — M8g, M8a, M8i (general purpose), R8g, R8a, R8i (memory-optimized), C8g, C8a (compute-optimized), X8i (extreme memory).',
        'When to pick which — energy-bound, AVX-heavy, AMX-heavy, memory-capacity-bound, memory-bandwidth-bound.',
        'Inference on CPU — when it actually works (small models, KV cache pressure, low QPS, latency-critical).',
      ]}
      panelistMap="AWS-only territory. Cerebras and HyperCIM do not ship general-purpose CPU silicon, so this is where we demonstrate ownership of the host layer that frames their accelerators."
      evaluationLens={[
        'Is the workload front-end bound, memory-bandwidth bound, or compute bound — and does the chosen CPU match?',
        'Does the code path actually use AVX-512 or AMX, or is it scalar and forfeiting the silicon bet?',
        'Is the working set smaller than the LLC? If yes, LLC bandwidth wins. If no, DRAM bandwidth or MRDIMM wins.',
        'Is the target single-thread, multi-thread, or vector-heavy? Map it to the right family before arguing price.',
      ]}
    />
  );
}
