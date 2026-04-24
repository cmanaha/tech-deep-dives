import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import { RooflineChart } from '../components/RooflineChart';

interface RidgeRow {
  chip: string;
  peakFlops: string;
  bandwidth: string;
  ridge: string;
  url: string;
}

const ridgeRows: RidgeRow[] = [
  {
    chip: 'NVIDIA H100 SXM  — FP8 tensor (sparse)',
    peakFlops: '3,958 TFLOPS',
    bandwidth: '3.35 TB/s HBM3',
    ridge: '≈ 1,181 FLOPs / byte',
    url: 'https://www.nvidia.com/en-us/data-center/h100/',
  },
  {
    chip: 'NVIDIA H200 SXM  — FP8 tensor (sparse)',
    peakFlops: '3,958 TFLOPS',
    bandwidth: '4.8 TB/s HBM3e',
    ridge: '≈ 825 FLOPs / byte',
    url: 'https://www.nvidia.com/en-us/data-center/h200/',
  },
  {
    chip: 'NVIDIA H200 SXM  — BF16 tensor',
    peakFlops: '1,979 TFLOPS',
    bandwidth: '4.8 TB/s HBM3e',
    ridge: '≈ 412 FLOPs / byte',
    url: 'https://www.nvidia.com/en-us/data-center/h200/',
  },
];

export function RooflineAndArithmeticIntensity() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The single model you need to place any workload on any silicon"
          >
            Roofline and arithmetic intensity
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The model.</strong> Williams, Waterman, and Patterson published the
            roofline in{' '}
            <Link external href="https://dl.acm.org/doi/10.1145/1498765.1498785">
              &ldquo;Roofline: an insightful visual performance model for multicore
              architectures&rdquo;
            </Link>
            {' '}(Communications of the ACM, April 2009). It gives a single picture that
            answers the question &ldquo;is this workload compute-bound or memory-bound on
            this silicon?&rdquo; It has held up across fifteen years of architecture
            changes because it reduces the question to a ratio between two quantities both
            vendors publish.
          </Box>
          <Box variant="p">
            <strong>The three quantities.</strong>{' '}
            <em>Arithmetic intensity</em> (FLOPs per byte of DRAM traffic) is a property of
            the workload and its implementation. <em>Peak FLOPs</em> is the silicon&apos;s
            ceiling at a given precision. <em>Peak bandwidth</em> is the silicon&apos;s
            DRAM throughput. The <em>ridge point</em> is peak FLOPs divided by peak
            bandwidth. Below the ridge: memory-bound, adding FLOPs does not help. Above:
            compute-bound, adding bandwidth does not help.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The plot most inference conversations should start with"
          >
            The roofline, placed
          </Header>
        }
      >
        <SpaceBetween size="m">
          <RooflineChart />
          <Box variant="p">
            Each marker on the chart is a real workload class. Dense GEMM with large tiles
            sits on the compute-bound ceiling — its arithmetic intensity is high enough that
            the silicon runs at peak. Prefill on a long prompt sits near the ridge, which is
            why prefill benefits modestly from more bandwidth and substantially from more
            FLOPs. Decode at batch 1 sits two orders of magnitude below the ridge — the
            silicon is starved and extra FLOPs are wasted. Batching decode requests raises
            arithmetic intensity because the same weight read is re-used across multiple
            activations.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Computed from the vendor-cited peak FLOPs and peak HBM bandwidth"
          >
            Ridge points, from vendor data
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={ridgeRows}
            columnDefinitions={[
              { id: 'chip', header: 'Chip / precision', cell: (r) => r.chip, minWidth: 220 },
              { id: 'flops', header: 'Peak FLOPs', cell: (r) => r.peakFlops },
              { id: 'bw', header: 'Peak HBM bandwidth', cell: (r) => r.bandwidth },
              { id: 'ridge', header: 'Ridge point', cell: (r) => r.ridge },
              {
                id: 'src',
                header: 'Vendor page',
                cell: (r) => (
                  <Link external href={r.url}>
                    Source
                  </Link>
                ),
              },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">All vendor-cited figures accessed 2026-04-23.</Box>
          <Alert type="warning" header="UNKNOWN — B200 and B300">
            Per-GPU HBM bandwidth for the Blackwell family is not on the pages fetched for
            this iteration; those pages emphasize HGX-aggregate NVLink bandwidth instead
            (NVIDIA HGX B200/B300: 1.8 TB/s GPU-to-GPU, 14.4 TB/s total NVLink). Ridge
            points for B200 and B300 will land here once the Blackwell section reads the
            datasheet directly.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The practical reason the ridge point matters: decode is far left, prefill is far right"
          >
            Prefill vs decode — the same silicon on two different workloads
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Prefill — near / above the ridge</Box>
              <Box variant="p">
                Prefill fills the KV cache by processing the whole prompt in parallel. Every
                weight byte is re-used across every prompt token in the batch. Arithmetic
                intensity scales with prompt length × batch size, so on a 4k-token prompt
                at batch 16 the intensity easily clears the H200 ridge. Prefill is
                compute-bound on H100/H200-class silicon; more FLOPs help directly, more
                HBM bandwidth helps only marginally.
              </Box>
            </div>
            <div>
              <Box variant="h3">Decode — deep below the ridge</Box>
              <Box variant="p">
                Decode generates one token at a time. Each weight byte is multiplied by a
                single activation and discarded. Intensity is roughly 2 FLOPs per parameter
                byte per token for a dense model. On an FP16 model at batch 1 that is
                ~2 FLOPs/byte — three orders of magnitude under H200&apos;s BF16 ridge of
                ≈ 412 FLOPs/byte. Decode is deeply memory-bound; tokens per second tracks
                HBM bandwidth almost linearly until some other limit binds.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            Two consequences drive most of modern inference serving. First, a decode TPS
            estimate is computable from the spec sheet: HBM bandwidth divided by active
            parameter bytes per token. Second, every successful technique for accelerating
            decode — grouped-query attention, KV-cache quantization, FlashAttention-class
            operator fusion, speculative decoding, disaggregated prefill/decode — works by
            changing arithmetic intensity, not by making the silicon faster.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Batch size is the first-order lever, operator fusion is the second"
          >
            Moving the workload along the x-axis
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Batching.</strong> Two concurrent decode streams double arithmetic
            intensity — the same weight bytes are re-used across two activations. Sixty-four
            streams raise it 64×. This is why inference servers (vLLM, TensorRT-LLM, SGLang,
            Neuron-Distributed) spend so much code on continuous batching. At batch 1 the
            silicon is starved; at batch 64 it is well-utilized. The ceiling on batch size
            is KV cache capacity, not compute, because each in-flight request carries its
            own KV cache that grows with context length. Section 20 walks this tradeoff in
            detail.
          </Box>
          <Box variant="p">
            <strong>Operator fusion.</strong> The software lever that is invisible to
            benchmarks but dominant in production is fusion. Combining operators into one
            kernel keeps intermediate tensors resident in SMEM, TMEM, or SBUF rather than
            round-tripping to HBM. FlashAttention is the canonical example — it fuses the
            attention matmul, softmax, and second matmul into a single kernel and keeps the
            working tile resident throughout, which both lowers HBM traffic and raises
            arithmetic intensity. Section 20 covers the current state (FlashAttention-3,
            paged variants). Sections 14 and 16 cover the compiler surfaces — CUTLASS /
            CuTe / Triton on NVIDIA, NKI on Trainium — that emit the fused kernels.
          </Box>
          <Box variant="p">
            <strong>Precision.</strong> Lower precision halves the byte count per operand
            without halving the FLOP count, so FP8 roughly doubles arithmetic intensity
            versus BF16 for the same algorithm. NVFP4 (E2M1) and MXFP8 push further.
            Precision is a shape question, not just a bits-per-operand question; Section
            21 covers the full precision ladder and the numerics work that makes FP4 and
            FP8 safe at model scale.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What moves the ridge point itself"
          >
            What the silicon vendors are actually competing on
          </Header>
        }
      >
        <Box variant="p">
          The ridge point is a ratio. Raising peak FLOPs (a new tensor core, a lower
          precision format like FP4) moves the ridge right — more workloads become
          memory-bound. Raising HBM bandwidth (HBM3 → HBM3e → HBM4) moves it left — more
          workloads become compute-bound. Modern silicon generations raise FLOPs faster
          than bandwidth, so the ridge drifts right each generation and more workloads
          fall into the bandwidth-bound regime over time. This is why the bandwidth wall
          (Section 5) is such a central story in inference silicon, and why architectures
          that avoid the HBM tier altogether (Cerebras, compute-in-memory) are structurally
          interesting even when their raw FLOPs numbers are lower.
        </Box>
      </Container>
    </SpaceBetween>
  );
}
