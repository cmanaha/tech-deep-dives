import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { PrecisionLadder } from '../components/PrecisionLadder';

interface FormatRow {
  format: string;
  silicon: string;
  bytes: string;
  use: string;
}

const formatRows: FormatRow[] = [
  { format: 'FP64', silicon: 'All GPUs (HPC paths only)', bytes: '8', use: 'Scientific compute, not LLM' },
  { format: 'FP32', silicon: 'All silicon', bytes: '4', use: 'Master weights, optimizer state' },
  { format: 'TF32', silicon: 'NVIDIA Ampere onward', bytes: '4 storage / 19 mantissa', use: 'Internal Tensor Core path on FP32 ops' },
  { format: 'BF16', silicon: 'All modern training silicon', bytes: '2', use: 'Standard training and inference precision' },
  { format: 'FP16', silicon: 'Older inference deployments', bytes: '2', use: 'Inference where FP8 not yet validated' },
  { format: 'FP8 E4M3', silicon: 'Hopper / Blackwell / Trainium', bytes: '1', use: 'Forward pass tensors' },
  { format: 'FP8 E5M2', silicon: 'Hopper / Blackwell / Trainium', bytes: '1', use: 'Backward gradients (more dynamic range)' },
  { format: 'NVFP4 (E2M1)', silicon: 'Blackwell only', bytes: '0.5', use: 'Inference; block-16 dual-level scaling' },
  { format: 'MXFP4', silicon: 'Multi-vendor (OCP)', bytes: '0.5', use: 'Inference; block-32 microscaling' },
  { format: 'INT8', silicon: 'All silicon (CPU, GPU, Trainium)', bytes: '1', use: 'Production inference for many models' },
];

export function QuantizationAndPrecision() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Bytes per value drives bandwidth-per-token directly — the cleanest lever on the roofline"
          >
            Quantization and precision
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why this section.</strong> Section 3 listed precision as the
            third lever (alongside batching and operator fusion) for moving decode
            workloads rightward on the roofline. Section 22 (MoE) showed NVFP4
            cutting DeepSeek-V3.2 from 690 GB FP8 to 415 GB. This section walks
            the precision ladder formally, explains what each format buys and
            costs, and shows what the major silicon families support.
          </Box>
          <Box variant="p">
            <strong>The single mechanism.</strong> Bytes per value is the variable.
            Every byte saved per parameter is a byte not read from HBM in decode,
            and decode tokens-per-second tracks HBM bandwidth divided by active
            parameter bytes per token. Halve the bytes, roughly double the
            throughput — until something else binds.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The full precision ladder from FP64 down to NVFP4"
          >
            The ladder
          </Header>
        }
      >
        <SpaceBetween size="m">
          <PrecisionLadder />
          <Box variant="p">
            Each row halves the byte count (or near-halves it) while reducing
            either dynamic range, mantissa precision, or both. The interesting
            thing is that quantization is not a single technique — it is a
            choice of where on this ladder to live for which tensor. Modern
            stacks use mixed precision throughout: FP32 master weights, BF16 or
            FP8 tensors during training, FP8 / FP4 / INT8 weights at inference.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What each format means in production"
          >
            Format-by-format guide
          </Header>
        }
      >
        <Table
          items={formatRows}
          columnDefinitions={[
            { id: 'fmt', header: 'Format', cell: (r) => r.format, minWidth: 160 },
            { id: 'sil', header: 'Where it ships', cell: (r) => r.silicon },
            { id: 'b', header: 'Bytes / value', cell: (r) => r.bytes },
            { id: 'use', header: 'Production use', cell: (r) => r.use },
          ]}
          variant="embedded"
          wrapLines
        />
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The 4-bit story — Blackwell-specific NVFP4 versus the OCP MXFP4 standard"
          >
            FP4 — the precision that moves the bandwidth equation
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">NVFP4 (E2M1)</Box>
              <Box variant="p">
                NVIDIA&apos;s Blackwell-introduced 4-bit floating point. E2M1
                format (1 sign, 2 exponent, 1 mantissa). Block size 16 with
                two-level scaling: a fine-grained E4M3 scaling factor per
                block plus an FP32 scalar per tensor. Memory reduction
                approximately 3.5× over FP16 and 1.8× over FP8. Native
                Tensor Core support via tcgen05.mma
                ({' '}
                <Link
                  external
                  href="https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/"
                >
                  NVIDIA Introducing NVFP4
                </Link>
                , accessed 2026-04-23).
              </Box>
            </div>
            <div>
              <Box variant="h3">MXFP4 (OCP standard)</Box>
              <Box variant="p">
                Open Compute Project Microscaling Format — block size 32, single
                E8M0 scaling factor per block. The vendor-neutral standard for
                4-bit floating point. Slightly less aggressive scaling than
                NVFP4 (larger block size) but supported across multiple
                vendors. GPT-OSS-120B uses MXFP4 on its MoE weights.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="success" header="Concrete vendor-cited number">
            NVIDIA reports DeepSeek-V3.2 at NVFP4 occupies 415 GB versus 690 GB
            at FP8 — a 1.7× reduction with negligible accuracy loss
            ({' '}
            <Link
              external
              href="https://developer.nvidia.com/blog/nvidia-blackwell-leads-on-new-semianalysis-inferencemax-benchmarks/"
            >
              NVIDIA Blackwell SemiAnalysis InferenceMAX blog
            </Link>
            , accessed 2026-04-23). For MoE specifically that footprint
            reduction means fewer GPUs needed for EP, which shrinks the
            all-to-all fabric requirement.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The numerics work that makes low precision safe at scale"
          >
            Why FP4 / FP8 do not destroy accuracy
          </Header>
        }
      >
        <ExpandableSection headerText="Block scaling — the technique that makes 4-bit work">
          <SpaceBetween size="s">
            <Box variant="p">
              Naïvely quantizing a weight tensor to 4 bits is catastrophic — 4
              bits gives you 16 distinct values, far too few for typical
              activation distributions. The technique that makes 4-bit precision
              practical is block scaling: divide the tensor into small blocks
              (16 or 32 elements), assign each block its own scaling factor, and
              encode each block&apos;s values relative to that scale. The block
              size is small enough that the values inside the block have
              similar magnitude; the scale captures the magnitude separately.
            </Box>
            <Box variant="p">
              NVFP4 takes this further with two-level scaling: a fine-grained
              FP8 (E4M3) scale per 16-element block, plus an FP32 scalar per
              tensor. The two levels handle different dynamic-range concerns —
              the per-block FP8 scale handles per-region variance, and the
              per-tensor FP32 scalar handles global tensor magnitude. The cost
              is metadata bytes alongside the 4-bit weights, but the metadata
              fraction is small for sufficiently large tensors.
            </Box>
          </SpaceBetween>
        </ExpandableSection>
        <ExpandableSection headerText="What still goes wrong">
          <Box variant="p">
            FP8 forward + FP8 backward training is now standard for many models
            but still requires careful scaling. FP4 inference is generally safe
            for stable open-weights models with documented quantization
            recipes; less safe for models with unusual activation distributions
            or extreme weight outliers. Production deployment usually involves
            calibration on a representative dataset to validate the scaling
            strategy. KV-cache quantization (FP8 or INT8) is increasingly
            common but introduces additional accuracy considerations because
            attention scores are sensitive to dynamic range across the KV.
          </Box>
        </ExpandableSection>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="How precision composes with the other levers"
          >
            Composing precision with batching, fusion, and MoE
          </Header>
        }
      >
        <Box variant="p">
          The roofline framing makes the composition explicit. Batching shares
          weight reads across requests — arithmetic intensity rises by the
          batch factor. Fusion (FlashAttention) keeps tiles in scratchpad —
          arithmetic intensity rises by removing HBM round trips. Quantization
          shrinks bytes per value — arithmetic intensity rises in the FLOPs-
          per-byte ratio. MoE selects only a fraction of weights per token —
          arithmetic intensity rises by the (k/N) ratio. All four levers are
          multiplicative: an MoE model in NVFP4 with batched continuous
          requests using FlashAttention can be compute-bound on the same
          silicon where dense BF16 batch-1 decode was deeply memory-bound.
        </Box>
        <Alert type="info">
          The frontier production stacks (NVIDIA Wide-EP with NVFP4 MoE on
          NVL72, AWS Neuron MoE NKI with FP8 on Trn2 UltraServer, vLLM with
          FlashInfer FP4 cubins) are all examples of stacking these levers.
          The marketing number for each generation tends to be one
          single-axis improvement, but the deployed wins compound across the
          full stack.
        </Alert>
      </Container>
    </SpaceBetween>
  );
}
