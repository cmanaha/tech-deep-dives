import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';

interface ArchRow {
  architecture: string;
  instruction: string;
  data: string;
  shape: string;
  stall: string;
}

const rows: ArchRow[] = [
  {
    architecture: 'Graviton / Xeon / EPYC host core',
    instruction: 'Branch predictor, BTB, wide fetch, speculation, OoO issue',
    data: 'L1 → L2 → L3 with hardware prefetch and TLB',
    shape: 'Scalar, SVE2 (Arm), AVX-512, AMX tiles (Xeon 6)',
    stall: 'Mispredict → pipeline drain; cache miss → DRAM round trip',
  },
  {
    architecture: 'NVIDIA Hopper / Blackwell SM',
    instruction: 'Warp scheduler, no speculation, tcgen05 / wgmma issue',
    data: 'SMEM / TMEM / L2 / HBM staged by CUTLASS, Triton, or Inductor',
    shape: 'Tensor-core tiles at FP4 - FP64; shape follows CuTe layout',
    stall: 'Pipeline bubble on warp; lost FLOPs scale with tensor-core width',
  },
  {
    architecture: 'AWS Trainium NeuronCore',
    instruction: 'NEFF descriptor from the Neuron compiler, no runtime scheduler',
    data: 'SBUF + PSUM scratchpads, compiler-managed',
    shape: 'Tiles sized at compile time for SBUF residency',
    stall: 'Schedule slip visible in NEFF, not at runtime',
  },
  {
    architecture: 'Cerebras WSE-3 wafer',
    instruction: 'Static dataflow, per-PE program, no global scheduler',
    data: 'Entire model in on-wafer SRAM — no external DRAM in steady state',
    shape: 'Row / column tiling over the wafer fabric',
    stall: 'Fabric congestion handled by static routing plan',
  },
  {
    architecture: 'Compute-in-Memory (HBM-PIM / HyperCIM)',
    instruction: 'Small set of primitives implemented inside the memory array',
    data: 'Compute happens where the data lives — no bus traversal',
    shape: 'Constrained operator set, typically matmul-class',
    stall: 'Operator miss → fall back to host = catastrophic for the model',
  },
];

export function HeterogeneityFact() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Why the silicon you are reasoning about is not a commodity, and the cost of being wrong is architecture-specific"
          >
            The heterogeneity fact
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The problem with &ldquo;chip&rdquo; as a noun.</strong> Inference silicon
            in 2026 is not a single class of device with different clock speeds. It is a
            lineup of fundamentally different execution models: out-of-order host cores that
            speculate on branches, SIMT GPUs that retire warps in lockstep, compile-time
            scheduled systolic arrays that have no front end at runtime, wafer-scale dataflow
            fabrics that route packets through a static graph, and memory arrays that
            perform arithmetic in place. These are not small variations. They are different
            ways of holding the instruction-data-shape triangle together.
          </Box>
          <Box variant="p">
            <strong>Why this matters now.</strong> Ten years ago the decision was GPU vs CPU.
            Five years ago it was GPU family vs GPU family. Today a single workload owner may
            be asked to compare P5 (Hopper), P6 (Blackwell), Trn2 UltraServer (Trainium2
            with 64-chip coherent domain), a Cerebras CS-3, a Groq rack, and an M8i fleet
            with AMX — each with a different precision format, a different memory hierarchy
            topology, and a different compiler surface. The question is not &ldquo;which
            FLOPs budget wins.&rdquo; It is &ldquo;which bet about the triangle matches my
            workload.&rdquo;
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={<Header variant="h2">How the live architectures place their bets</Header>}
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The rows below are not a feature comparison; they are a bet comparison. Each
            architecture optimizes a different answer to how the instruction reaches the
            unit, how the data reaches the unit, what shape the unit expects, and what the
            cost of being late is.
          </Box>
          <Table
            items={rows}
            columnDefinitions={[
              { id: 'arch', header: 'Architecture', cell: (r) => r.architecture, minWidth: 180 },
              { id: 'inst', header: 'Instruction delivery', cell: (r) => r.instruction },
              { id: 'data', header: 'Data delivery', cell: (r) => r.data },
              { id: 'shape', header: 'Shape fit', cell: (r) => r.shape },
              { id: 'stall', header: 'Cost of being wrong', cell: (r) => r.stall },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            Row entries are compiled from vendor documentation for each architecture; the
            per-vendor sections (8-19) carry the Tier 1 inline citations and verified
            numbers. The Neuron compiler and NEFF descriptor references track{' '}
            <Link external href="https://awsdocs-neuron.readthedocs-hosted.com/">
              the AWS Neuron SDK documentation
            </Link>
            {' '}(accessed 2026-04-23).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Retirement semantics are not portable between architecture classes"
          >
            Stall and retirement semantics
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A subtle point that changes the playbook in every technical review: the cost of
            a stall is an architectural property, not a universal constant. Engineers who
            spent a decade tuning out-of-order cores carry intuitions about speculation
            depth, reorder buffer pressure, and branch target buffer misses. None of those
            concepts exist on a compile-time scheduled systolic array. Engineers trained on
            CUDA carry intuitions about occupancy, warp divergence, and SMEM bank conflicts.
            None of those apply to a dataflow fabric that bakes the program into per-PE
            state.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Out-of-order host core</Box>
              <ul>
                <li>Mispredict cost: ~15-20 cycles to drain + re-steer the pipeline</li>
                <li>Cache miss cost: hundreds of cycles of out-of-order shadow</li>
                <li>Recovery: hardware (ROB, RAS, BTB retraining)</li>
                <li>Visible to compiler: no — only to the profiler</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">NVIDIA SIMT GPU</Box>
              <ul>
                <li>Bubble cost: the tensor core&apos;s worth of FLOPs for that clock</li>
                <li>Latency-hiding mechanism: concurrent warps, not speculation</li>
                <li>Recovery: warp scheduler chooses a ready warp</li>
                <li>Visible to compiler: partially — occupancy and tile size matter</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">AWS Trainium systolic array</Box>
              <ul>
                <li>Schedule slip: fixed at compile time, visible in NEFF</li>
                <li>Mitigation: compiler retiling and operator fusion</li>
                <li>Recovery: none at runtime — the NEFF is the schedule</li>
                <li>Visible to compiler: entirely — this is the compiler&apos;s job</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Wafer-scale dataflow (WSE-3)</Box>
              <ul>
                <li>Fabric congestion: handled by static routing plan</li>
                <li>Mitigation: placement + routing at compile time</li>
                <li>Recovery: either the plan avoided it or the model does not fit</li>
                <li>Visible to compiler: entirely — there is no dynamic arbitration</li>
              </ul>
            </div>
          </ColumnLayout>
          <ExpandableSection headerText="Why this breaks benchmark transplants">
            <SpaceBetween size="s">
              <Box variant="p">
                A common error is to run an identical kernel on two architectures and
                compare wall-clock time. The comparison is fine as a raw measurement, but
                the <em>interpretation</em> is wrong because the two architectures are not
                paying the same costs. On an out-of-order host, 30% of the time may be
                spent in speculative shadow that never retires — it does not count against
                the useful throughput. On a GPU, 30% of the time may be a warp scheduler
                blocking for operands — invisible to a host-side profiler. On Trainium, the
                schedule is static, so the wall-clock time equals the NEFF prediction with
                no runtime variance.
              </Box>
              <Box variant="p">
                The right methodology is to compare placement on the roofline (Section 3),
                not raw wall-clock — and to characterize the workload&apos;s instruction,
                data, and shape requirements independently before collapsing them into a
                single &ldquo;throughput&rdquo; number.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
