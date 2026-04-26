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
import { HopperSmDiagram } from '../components/HopperSmDiagram';

interface SpecRow {
  spec: string;
  h100: string;
  h200: string;
}

const specRows: SpecRow[] = [
  { spec: 'Die', h100: 'GH100 (TSMC 4N)', h200: 'GH100 (same die)' },
  { spec: 'SM count', h100: '132 active (144 physical)', h200: '132 active (same)' },
  { spec: 'Register file / SM', h100: '64K × 32-bit', h200: '64K × 32-bit' },
  { spec: 'SMEM / SM', h100: 'up to 228 KB', h200: 'up to 228 KB' },
  { spec: 'L1 + SMEM combined', h100: '256 KB', h200: '256 KB' },
  { spec: 'L2 cache', h100: '50 MB', h200: '50 MB' },
  { spec: 'HBM generation', h100: 'HBM3', h200: 'HBM3e' },
  { spec: 'HBM capacity', h100: '80 GB', h200: '141 GB' },
  { spec: 'HBM bandwidth', h100: '3.35 TB/s', h200: '4.8 TB/s' },
  { spec: 'NVLink Gen 4 BW per GPU', h100: '900 GB/s', h200: '900 GB/s' },
  { spec: 'FP8 Tensor Core (sparse)', h100: '3,958 TFLOPS', h200: '3,958 TFLOPS' },
  { spec: 'BF16 Tensor Core', h100: '1,979 TFLOPS', h200: '1,979 TFLOPS' },
  { spec: 'AWS instance family', h100: 'P5, P5e', h200: 'P5en' },
];

export function NvidiaHopper() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Same compute, different memory — the cleanest evidence the bandwidth wall binds"
          >
            NVIDIA Hopper — H100 and H200
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What Hopper is.</strong> NVIDIA&apos;s 9th-generation data-center GPU
            architecture, built on TSMC 4N. The Hopper SM introduced 4th-generation
            Tensor Cores with FP8 support, asynchronous data movement (Tensor Memory
            Accelerator and async copy), and the Distributed Shared Memory model.
            Hopper ships in two product variants: H100 (HBM3) launched late 2022, and
            H200 (HBM3e) launched November 2023 — same GH100 die, different memory.
          </Box>
          <Box variant="p">
            <strong>Why these two products matter together.</strong> The H100 → H200
            transition is the cleanest piece of evidence in the entire deep dive that
            inference economics are bandwidth-bound. The compute did not change. The
            memory did. And the inference performance moved with the memory, exactly as
            the roofline (Section 3) predicts for decode workloads.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What lives inside one streaming multiprocessor"
          >
            The SM in detail
          </Header>
        }
      >
        <SpaceBetween size="m">
          <HopperSmDiagram />
          <Box variant="p">
            Hopper&apos;s SM holds 64 concurrent warps with 32 threads each, up to 32
            thread blocks, and a 64K × 32-bit register file. SMEM and L1 share 256 KB,
            with SMEM configurable up to 228 KB per SM (a 39% increase over A100&apos;s
            164 KB). The 4th-generation Tensor Cores are dispatched via the
            <code> wgmma</code> instruction, which operates on tiles staged through SMEM
            ({' '}
            <Link external href="https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html">
              Hopper Tuning Guide
            </Link>
            , accessed 2026-04-23).
          </Box>
          <Alert type="info" header="Latency hiding via concurrency, not speculation">
            The warp scheduler picks ready warps each clock and rotates among them
            while others wait on operands. There is no branch prediction, no
            speculation, and no out-of-order issue per warp. Latency is hidden by
            having enough concurrent warps that some are always ready — the
            occupancy variable that comes up in every CUDA tuning conversation.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Vendor-cited numbers per product"
          >
            H100 vs H200 — what changed
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={specRows}
            columnDefinitions={[
              { id: 'spec', header: 'Spec', cell: (r) => r.spec, minWidth: 220 },
              { id: 'h100', header: 'H100 SXM', cell: (r) => r.h100 },
              { id: 'h200', header: 'H200 SXM', cell: (r) => r.h200 },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            All numbers track the{' '}
            <Link external href="https://www.nvidia.com/en-us/data-center/h100/">
              NVIDIA H100 product page
            </Link>
            {' '}and{' '}
            <Link external href="https://www.nvidia.com/en-us/data-center/h200/">
              NVIDIA H200 product page
            </Link>
            , accessed 2026-04-23. Hopper SM internals from the Hopper Tuning Guide
            (same access date).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The vendor delivered the roofline prediction in their own marketing"
          >
            The bandwidth wall, observed
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Same FLOPs.</strong> H100 and H200 have identical FP8 (3,958 TFLOPS),
            BF16 (1,979 TFLOPS), and FP16 peaks. NVLink bandwidth is identical at 900
            GB/s per GPU. SM count, register file, SMEM, and L2 are identical.
          </Box>
          <Box variant="p">
            <strong>Different memory.</strong> H100 ships 80 GB of HBM3 at 3.35 TB/s.
            H200 ships 141 GB of HBM3e at 4.8 TB/s. NVIDIA describes this as
            &ldquo;nearly double the capacity&rdquo; and &ldquo;1.4× more memory
            bandwidth.&rdquo;
          </Box>
          <Alert type="success" header="The vendor's own number">
            NVIDIA reports H200 at &ldquo;up to 1.9× faster Llama2 70B
            inference&rdquo; and &ldquo;1.6× faster GPT-3 175B inference&rdquo;
            ({' '}
            <Link external href="https://www.nvidia.com/en-us/data-center/h200/">
              NVIDIA H200 product page
            </Link>
            , accessed 2026-04-23). Compute did not change, memory bandwidth went up
            1.4×, decode throughput went up 1.6-1.9×. This is the roofline prediction
            for decode delivered verbatim by the silicon vendor.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What customers see — P5 / P5e / P5en on AWS"
          >
            Hopper on AWS
          </Header>
        }
      >
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="h3">P5</Box>
            <Box variant="p">
              8× H100 SXM. EFA v2. Capacity Blocks for ML support. The original
              GA platform for distributed training; still ships heavily in 2026 for
              workloads tuned to it.
            </Box>
          </div>
          <div>
            <Box variant="h3">P5e</Box>
            <Box variant="p">
              8× H100 SXM with same compute and increased GPU memory tier. EFA v2.
              Aimed at workloads that needed more HBM headroom than the P5 baseline.
            </Box>
          </div>
          <div>
            <Box variant="h3">P5en</Box>
            <Box variant="p">
              8× H200 SXM. EFA v3 (built on Nitro v5). The Hopper-class machine that
              ships H200 silicon — the right pick when the workload is decode-heavy
              and the H100 → H200 1.9× number above applies.
            </Box>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="When Hopper is still the right call vs Blackwell"
          >
            Where Hopper still wins
          </Header>
        }
      >
        <ExpandableSection headerText="Mature kernel ecosystem" defaultExpanded>
          <Box variant="p">
            Five years of FlashAttention generations, fused MoE kernels, vLLM /
            TensorRT-LLM tuning, and CUTLASS / Triton libraries are all production-
            hardened on Hopper. Blackwell is catching up fast (CUTLASS example 92,
            tcgen05 path, NVFP4) but the long-tail of operators and the most
            thoroughly tested fused paths still ship on Hopper first.
          </Box>
        </ExpandableSection>
        <ExpandableSection headerText="Capacity Blocks pricing curves">
          <Box variant="p">
            P5 and P5en pricing through Capacity Blocks for ML can be the
            controlling variable for time-bounded training runs. When the model fits
            in 80 GB / 141 GB and the workload is throughput-not-latency, the
            economics often favor a Hopper Capacity Block over chasing Blackwell on
            on-demand pricing.
          </Box>
        </ExpandableSection>
        <ExpandableSection headerText="When Hopper is wrong">
          <ul>
            <li>Workloads that need NVFP4 or tcgen05.mma — Blackwell-only</li>
            <li>MoE deployments that benefit from MNNVL all-to-all in NVL72</li>
            <li>Models that exceed 141 GB and would otherwise fit in B200 / B300</li>
            <li>Workloads that benefit from coherent CPU memory via NVLink-C2C (Grace-Blackwell territory)</li>
          </ul>
        </ExpandableSection>
      </Container>
    </SpaceBetween>
  );
}
