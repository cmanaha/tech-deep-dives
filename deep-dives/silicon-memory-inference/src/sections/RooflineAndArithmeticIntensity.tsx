import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function RooflineAndArithmeticIntensity() {
  return (
    <SectionShell
      title="Roofline and Arithmetic Intensity"
      subtitle="The ridge point and why decode sits on the memory-bound slope"
      tldr={[
        'Arithmetic intensity is operations per byte of memory traffic. The roofline model plots achievable throughput against arithmetic intensity.',
        'Below the ridge point the workload is memory-bound and performance is gated by bandwidth. Above it the workload is compute-bound and performance is gated by peak FLOPs.',
        'Prefill sits near or above the ridge point. Decode sits far below it. That single observation drives most of modern inference architecture.',
        'Ridge point is architecture-specific. A chip with huge FLOPs and mediocre bandwidth has a ridge point far to the right, so more workloads fall into the memory-bound regime.',
      ]}
      scope={[
        'Formal definition of arithmetic intensity and the roofline model (Williams 2009).',
        'Ridge point calculation per architecture — H100, H200, B200, Trainium2, Graviton5, EPYC Turin, Xeon 6.',
        'Prefill vs decode arithmetic intensity for modern LLMs with GQA and FlashAttention.',
        'Batch size as a lever — why decode with batch 1 is pathological and batch 64 is acceptable.',
        'What moves the ridge point — larger SRAM, higher HBM bandwidth, lower precision, operator fusion.',
        'Measuring arithmetic intensity in practice: profiler counters, roofline plots from Nsight or perf.',
      ]}
      panelistMap="Shared vocabulary. Every panelist will invoke some form of this framing; giving the audience the formal shape up front keeps later claims honest. AWS ties this to choosing between P5 (high FLOPs) and Trainium (balanced) for specific workloads."
      evaluationLens={[
        'Where on the roofline does the target workload sit at the target batch size?',
        'Does the architecture put the ridge point far left (bandwidth-rich) or far right (FLOP-rich)?',
        'What is the effective arithmetic intensity after operator fusion and tiling — not the naive one?',
        'Is batching an option, or is the SLA single-request?',
      ]}
    />
  );
}
