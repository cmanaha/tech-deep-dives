import React from 'react';
import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Link from '@cloudscape-design/components/link';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import { SectionShell } from '../components/SectionShell';

interface RidgeRow {
  chip: string;
  peakFlops: string;
  bandwidth: string;
  ridge: string;
  citation: string;
  url: string;
}

const ridgeRows: RidgeRow[] = [
  {
    chip: 'NVIDIA H100 SXM (FP8)',
    peakFlops: '3,958 TFLOPS (FP8 tensor, sparse)',
    bandwidth: '3.35 TB/s HBM3',
    ridge: '~1,181 FLOPs/byte',
    citation: 'NVIDIA H100 product page, accessed 2026-04-23',
    url: 'https://www.nvidia.com/en-us/data-center/h100/',
  },
  {
    chip: 'NVIDIA H200 SXM (FP8)',
    peakFlops: '3,958 TFLOPS (FP8 tensor, sparse)',
    bandwidth: '4.8 TB/s HBM3e',
    ridge: '~825 FLOPs/byte',
    citation: 'NVIDIA H200 product page, accessed 2026-04-23',
    url: 'https://www.nvidia.com/en-us/data-center/h200/',
  },
  {
    chip: 'NVIDIA H200 SXM (BF16)',
    peakFlops: '1,979 TFLOPS (BF16 tensor)',
    bandwidth: '4.8 TB/s HBM3e',
    ridge: '~412 FLOPs/byte',
    citation: 'NVIDIA H200 product page, accessed 2026-04-23',
    url: 'https://www.nvidia.com/en-us/data-center/h200/',
  },
];

export function RooflineAndArithmeticIntensity() {
  return (
    <SectionShell
      status="draft"
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
    >
      <SpaceBetween size="l">
        <Header variant="h2">Definitions</Header>
        <Box variant="p">
          The roofline model was introduced by Samuel Williams, Andrew Waterman, and David
          Patterson in{' '}
          <Link
            external
            href="https://dl.acm.org/doi/10.1145/1498765.1498785"
          >
            &quot;Roofline: An Insightful Visual Performance Model for Multicore Architectures&quot;
          </Link>
          {' '}(Communications of the ACM, April 2009). It gives you a single picture that
          answers the question &quot;is this workload compute-bound or memory-bound on this
          silicon&quot;.
        </Box>
        <Box variant="p">
          <strong>Arithmetic intensity</strong> is the number of floating-point operations a
          workload performs per byte of DRAM traffic. It is a property of the workload and its
          implementation, not of the silicon. A dense GEMM with large re-used tiles has high
          arithmetic intensity; a streaming memory copy has an arithmetic intensity of zero.
        </Box>
        <Box variant="p">
          <strong>Peak FLOPs</strong> is the silicon's maximum sustained throughput. On modern
          accelerators this number is precision-dependent — FP8 peak is typically 2× BF16 peak
          which is typically 2× FP32 peak, and so on.
        </Box>
        <Box variant="p">
          <strong>Peak bandwidth</strong> is the silicon's maximum memory throughput to DRAM
          (or HBM). Vendor spec sheets publish this as a single number; achievable bandwidth is
          usually 70-90% of it under realistic access patterns.
        </Box>
        <Box variant="p">
          <strong>Ridge point</strong> is where the two rooflines meet: peak FLOPs divided by
          peak bandwidth, expressed in FLOPs per byte. Workloads with arithmetic intensity
          below the ridge point are bandwidth-bound — adding more FLOPs to the silicon will
          not help them go faster. Workloads above the ridge point are compute-bound — adding
          bandwidth will not help them.
        </Box>

        <Header variant="h2">Ridge points from vendor data</Header>
        <Table
          items={ridgeRows}
          columnDefinitions={[
            { id: 'chip', header: 'Chip / precision', cell: (r) => r.chip },
            { id: 'flops', header: 'Peak FLOPs', cell: (r) => r.peakFlops },
            { id: 'bw', header: 'Peak HBM bandwidth', cell: (r) => r.bandwidth },
            { id: 'ridge', header: 'Ridge point', cell: (r) => r.ridge },
            {
              id: 'src',
              header: 'Source',
              cell: (r) => (
                <Link external href={r.url}>
                  {r.citation}
                </Link>
              ),
            },
          ]}
          variant="embedded"
          wrapLines
        />
        <Box variant="small">
          Ridge point values computed from the vendor-stated peak FLOPs and peak HBM bandwidth.
          FLOPs figures are the tensor-core peaks reported in the cited vendor pages; sparse
          numbers are used where the vendor reports them as the headline figure. B200 and B300
          figures intentionally omitted pending a Tier 1 fetch — see the NVIDIA Blackwell
          section for verified numbers.
        </Box>
        <Alert type="warning" header="UNKNOWN">
          B200 and B300 ridge points are not yet in this table. Current vendor pages emphasize
          HGX-level aggregate bandwidth rather than per-GPU HBM bandwidth at the level of
          precision these calculations need. Will be closed when the Blackwell datasheet is
          read directly in the NVIDIA Blackwell section.
        </Alert>

        <Header variant="h2">Where LLM workloads sit on the roofline</Header>
        <Box variant="p">
          <strong>Prefill</strong> — the initial pass over the prompt that fills the KV cache —
          performs large matmuls with high operand re-use (each weight is used across all
          prompt tokens in the batch). Prefill's arithmetic intensity scales with prompt
          length and batch size; for realistic prompts it lands near or above the ridge point
          on H100 and H200 class silicon. Prefill is normally compute-bound.
        </Box>
        <Box variant="p">
          <strong>Decode</strong> — the per-token generation loop — performs a matmul where
          one operand (the weights) is re-read from HBM for every single token. Each weight
          byte is multiplied against a single activation and then discarded. Arithmetic
          intensity is roughly 2 FLOPs per parameter byte per token for dense models, modified
          by batch size. At batch size 1 on an FP16 model, that is 2 FLOPs per byte — two to
          three orders of magnitude below the H200 BF16 ridge point of ~412 FLOPs/byte.
          Decode is deeply memory-bound.
        </Box>
        <Box variant="p">
          Two practical consequences follow. First, the observable decode throughput on any
          modern accelerator is roughly HBM bandwidth divided by active parameter bytes per
          token — a number computable from the spec sheet. Second, every successful technique
          for accelerating decode (KV cache tricks, grouped-query attention, quantization,
          speculative decoding, disaggregated prefill/decode) works by changing arithmetic
          intensity, not by making the silicon faster.
        </Box>

        <Header variant="h2">Batch size moves the workload along the x-axis</Header>
        <Box variant="p">
          Batching multiple decode requests lets them share a single weight read, which is the
          cheapest lever for arithmetic intensity. Running two concurrent decode streams
          doubles the arithmetic intensity (the same weight bytes are re-used across two
          activations); running 64 doubles it six times. This is why inference serving stacks
          (vLLM, TensorRT-LLM, SGLang) spend so much code on continuous batching — at batch 1
          the silicon is starved, at batch 64 it is well-utilized.
        </Box>
        <Box variant="p">
          The ceiling on batch size is KV cache memory, not compute. Each in-flight request
          carries its own KV cache, and the KV cache scales with context length. Section 20
          (KV Cache and FlashAttention) walks this tradeoff in detail.
        </Box>

        <Header variant="h2">What moves the ridge point</Header>
        <Box variant="p">
          The ridge point is a ratio. Raising peak FLOPs (a new tensor core, a lower precision
          format like FP4) moves the ridge to the right — more workloads become memory-bound.
          Raising HBM bandwidth (HBM3 → HBM3e → HBM4) moves it to the left — more workloads
          become compute-bound. Modern silicon generations tend to raise FLOPs faster than
          bandwidth, so the ridge drifts right with each generation and more workloads fall
          into the bandwidth-bound regime over time.
        </Box>
        <Box variant="p">
          The software lever is operator fusion — combining several operators into one kernel
          so that intermediate tensors never leave on-chip memory. Fusion reduces the byte
          count in the denominator of arithmetic intensity without changing the FLOP count in
          the numerator. FlashAttention is the canonical example; it fuses attention's matmul,
          softmax, and second matmul into one kernel and keeps the working tile resident in
          SMEM / TMEM throughout. This is one of the reasons sections 14 and 16 (compiler and
          kernel tooling) matter — the compiler's tiling decisions directly determine where
          the workload sits on the roofline.
        </Box>
      </SpaceBetween>
    </SectionShell>
  );
}
