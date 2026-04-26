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
import { BlackwellDieDiagram } from '../components/BlackwellDieDiagram';

interface SpecRow {
  spec: string;
  b200: string;
  b300: string;
}

const specRows: SpecRow[] = [
  { spec: 'Die', b200: 'GB100 (two reticles + NV-HBI)', b300: 'GB100-derived (Blackwell Ultra)' },
  { spec: 'HBM generation', b200: 'HBM3e', b300: 'HBM3e+' },
  { spec: 'HBM capacity per GPU', b200: 'up to 180 GB', b300: '288 GB' },
  { spec: 'HBM bandwidth per GPU', b200: '~8 TB/s class', b300: '8 TB/s' },
  { spec: 'NVLink Gen 5 per GPU', b200: '1.8 TB/s', b300: '1.8 TB/s' },
  { spec: 'Tensor Core', b200: '5th gen — tcgen05.mma', b300: '5th gen — tcgen05.mma' },
  { spec: 'TMEM per SM', b200: '256 KB', b300: '256 KB' },
  { spec: 'NVFP4 (E2M1)', b200: 'Yes — first generation', b300: 'Yes' },
  { spec: 'FP4 PFLOPS per GPU', b200: '—', b300: '14 PFLOPS' },
  { spec: 'AWS instance family', b200: 'P6-B200', b300: 'P6-B300, P6e UltraServer (GB200)' },
];

export function NvidiaBlackwell() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Two-reticle die, 5th-gen Tensor Core, NVFP4 — the Blackwell generation"
          >
            NVIDIA Blackwell — B200 and B300
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What Blackwell is.</strong> NVIDIA&apos;s 10th-generation data-center
            GPU architecture. The most architecturally aggressive part is GB100 — two
            reticle-sized dies joined by NV-HBI (a custom high-bandwidth interface)
            and presented to the CUDA programmer as a single coherent GPU. The new
            tier-2 memory level — TMEM, 256 KB per SM — sits between SMEM and the
            5th-generation Tensor Core. The new precision format — NVFP4, an E2M1
            4-bit float with 16-element block scaling — roughly halves model
            footprint at FP8 with minimal accuracy loss.
          </Box>
          <Box variant="p">
            <strong>Why this matters.</strong> Blackwell collapses three things at
            once: more HBM capacity per GPU (B300 ships 288 GB vs H200&apos;s 141 GB),
            more bandwidth (8 TB/s class), and lower-precision arithmetic (FP4 reaching
            14 PFLOPS per GPU on B300). For MoE workloads with 671B-1T parameter
            counts, the capacity move alone can be the difference between fitting in a
            single rack and not fitting at all.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="One logical GPU, two physical dies, joined transparently"
          >
            The two-reticle die
          </Header>
        }
      >
        <SpaceBetween size="m">
          <BlackwellDieDiagram />
          <Box variant="p">
            Reticle limits cap how big a single die can be at the lithography step.
            GB100 walks past that limit by stitching two reticle-sized dies with
            NV-HBI — a custom high-bandwidth interface running at roughly 10 TB/s
            aggregate (NVIDIA stated at announcement; verified per-link rate not
            currently in the public datasheet I fetched). The two dies present as one
            logical GPU at the CUDA layer: one device ID, one unified address space,
            no NUMA in the programming model.
          </Box>
          <Alert type="warning" header="Per-die specifics not directly fetched">
            The exact HBM stack split between the two dies, the NV-HBI per-link rate,
            and the tcgen05.mma cycle counts are not documented on the public pages I
            fetched for this iteration. Numbers above (180 GB B200, 288 GB B300, 8 TB/s
            class, 14 PFLOPS FP4) come from NVIDIA product positioning. The public
            HGX and GB200 NVL72 pages emphasize system-level NVLink aggregates, not
            per-GPU HBM. Where deeper datasheet numbers are required, they will land
            in a future iteration with direct datasheet citations.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The new tier between SMEM and the tensor core"
          >
            TMEM and the 5th-generation Tensor Core
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>TMEM (Tensor Memory).</strong> 256 KB per SM dedicated to tensor-core
            operand staging. Distinct from SMEM. The 5th-generation Tensor Core
            consumes operands from TMEM via the new <code>tcgen05.mma</code>
            instruction family — seven new instructions for matmul that NVIDIA describes
            as 2× to 4× faster than Hopper&apos;s wgmma. CUTLASS exposes TMEM as a
            first-class data locale, which is why example 92 (Blackwell MoE GEMM) was
            the first CUTLASS example to ship with the SM100 target
            ({' '}
            <Link
              external
              href="https://github.com/NVIDIA/cutlass/tree/main/examples/92_blackwell_moe_gemm"
            >
              CUTLASS example 92
            </Link>
            , accessed 2026-04-23).
          </Box>
          <Box variant="p">
            <strong>NVFP4 (E2M1).</strong> NVIDIA&apos;s 4-bit floating point format,
            block-scaled with 16 elements per block. Two-level scaling: a fine-grained
            E4M3 scaling factor per block plus an FP32 scalar per tensor. Memory
            reduction is approximately 3.5× over FP16 and 1.8× over FP8. NVFP4 reduced
            DeepSeek-V3.2&apos;s footprint from 690 GB FP8 to 415 GB
            ({' '}
            <Link
              external
              href="https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/"
            >
              NVIDIA developer blog — Introducing NVFP4
            </Link>
            , accessed 2026-04-23). For MoE specifically, this lets a model fit in
            fewer GPUs, which lowers EP, which shrinks the all-to-all fabric
            requirement.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Per-product specs"
          >
            B200 vs B300 — at a glance
          </Header>
        }
      >
        <Table
          items={specRows}
          columnDefinitions={[
            { id: 'spec', header: 'Spec', cell: (r) => r.spec, minWidth: 220 },
            { id: 'b200', header: 'B200', cell: (r) => r.b200 },
            { id: 'b300', header: 'B300 (Blackwell Ultra)', cell: (r) => r.b300 },
          ]}
          variant="embedded"
          wrapLines
        />
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What Blackwell is built for"
          >
            Workload fit
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Wins on Blackwell</Box>
            <ul>
              <li>MoE inference at 600B-1T parameter scale (capacity + NVFP4)</li>
              <li>Workloads that map to tcgen05.mma + TMEM (matmul-dominated)</li>
              <li>Long-context decode that benefits from larger HBM</li>
              <li>FP4-tolerant precision regimes — saves bytes per token</li>
              <li>Throughput-per-watt-sensitive deployments</li>
            </ul>
          </div>
          <div>
            <Box variant="h3">Watch out</Box>
            <ul>
              <li>Operators not yet on the Blackwell tcgen05 path — falls back to slower kernels</li>
              <li>Workloads that already fit in 141 GB H200 — Hopper economics may win</li>
              <li>Precision-sensitive numerics — NVFP4 is not drop-in for every model</li>
              <li>Tooling maturity — CUTLASS / Triton / Inductor catching up to Hopper coverage</li>
            </ul>
          </div>
        </ColumnLayout>
        <ExpandableSection headerText="Why Blackwell silicon and Blackwell software shipped on different schedules">
          <Box variant="p">
            Blackwell hardware was sampled and announced before the full software stack
            (TensorRT-LLM Wide-EP, CUTLASS SM100 kernels, Triton SM100 backends) was
            production-ready. The 2025-2026 cadence shows in the version history:
            CUTLASS example 92 first appeared in v4.0.0 (June 2025), simplified MoE API
            arrived in v4.3.0 (November 2025), and the per-decoding scale variant in
            v4.4.0 (February 2026). TRT-LLM NVFP4 cubins for MoE shipped in v1.0. If a
            workload depends on a specific kernel path, check the version it landed in
            — &ldquo;Blackwell supports X&rdquo; in marketing is sometimes still
            &ldquo;X is on the next release&rdquo; in software.
          </Box>
        </ExpandableSection>
      </Container>
    </SpaceBetween>
  );
}
