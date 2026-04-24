import React from 'react';
import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Link from '@cloudscape-design/components/link';
import Table from '@cloudscape-design/components/table';
import { SectionShell } from '../components/SectionShell';

interface TriangleRow {
  architecture: string;
  instruction: string;
  data: string;
  shape: string;
  stall: string;
}

const triangleRows: TriangleRow[] = [
  {
    architecture: 'Graviton / Xeon / EPYC (out-of-order host CPU)',
    instruction: 'Branch predictor + BTB + wide fetch, speculation, out-of-order issue',
    data: 'L1/L2/L3 cache hierarchy, hardware prefetch, TLB',
    shape: 'Scalar, SVE2 (Arm), AVX-512, AMX tiles',
    stall: 'Mispredict → pipeline drain and refill; cache miss → DRAM round trip',
  },
  {
    architecture: 'NVIDIA Hopper / Blackwell (SIMT GPU)',
    instruction: 'Warp scheduler, static fetch, no speculation, tcgen05 / wgmma issue',
    data: 'SMEM, TMEM, L2, HBM — staged by software (CUTLASS, Triton)',
    shape: 'Tiled matmul on tensor cores; precisions from FP4 to FP64',
    stall: 'Pipeline bubble on warp; lost FLOPs scale with tensor core width',
  },
  {
    architecture: 'AWS Trainium (compile-time scheduled systolic array)',
    instruction: 'NEFF descriptor — no runtime scheduler, schedule fixed ahead of time',
    data: 'SBUF and PSUM scratchpads, compiler-managed',
    shape: 'Tiles sized by the Neuron compiler to fit SBUF residency',
    stall: 'Schedule slip — compiler-visible, not runtime-visible',
  },
  {
    architecture: 'Cerebras WSE-3 (wafer-scale dataflow)',
    instruction: 'Static dataflow, per-PE program; no global scheduler',
    data: 'Entire model weights in on-wafer SRAM (no external DRAM for inference)',
    shape: 'Row/column tiling over the wafer fabric',
    stall: 'Fabric congestion — handled by static routing, not dynamic arbitration',
  },
  {
    architecture: 'Compute-in-Memory (PIM / HyperCIM)',
    instruction: 'A small set of primitives implemented at the memory array itself',
    data: 'Compute happens where the data lives — no bus traversal',
    shape: 'Constrained operator set; typically matmul-class',
    stall: 'Operator miss → fall back to the host, which is catastrophic for the model',
  },
];

export function HeterogeneityFact() {
  return (
    <SectionShell
      status="draft"
      title="The Heterogeneity Fact"
      subtitle="Instruction, data, and data shape must arrive at the unit together"
      tldr={[
        'Silicon has never been more heterogeneous. Each architecture optimizes a different subset of the triangle: instruction delivery, data delivery, and data-shape fit.',
        'To land on a FLOP you need three things simultaneously — the instruction decoded at the unit, the operand staged from the right memory tier, and the shape (tile, precision, layout, alignment) native to the unit.',
        'Workload character selects the bet. Enterprise OLTP and business-logic code leans on branch prediction, speculation, and retirement ordering. Transformer decode leans on wide tensor pipes, predictable streaming, and staged memory.',
        'Retirement and stall semantics are architecture-specific. A mispredict on an out-of-order core is a different event from a pipeline bubble on a tensor core or a systolic array. The cost of being wrong is not portable.',
        'Peak FLOPs is the last number that matters. Ask first how the instruction reaches the unit, how the data reaches the unit, and what happens when either is late.',
      ]}
      scope={[
        'The instruction-data-shape triangle as an organizing frame.',
        'Front-end heterogeneity: branch prediction, BTB, TAGE, speculation depth, fetch width — and their irrelevance on dataflow architectures.',
        'Back-end heterogeneity: ROB, retirement, load-store queue, register rename — versus compile-time scheduled tensor pipes and systolic arrays.',
        'Data-shape fit: tile size, precision, layout, stride, alignment. Why NVFP4 is not drop-in on a core that thinks in BF16.',
        'Stall and bubble semantics per architecture class. What happens when an operand is late on a Xeon, on a GPU SM, on a Trainium array, on a WSE-3.',
        'Why "compare FLOPs" is not a comparison. What to compare instead.',
      ]}
      panelistMap="Foundational for the whole panel. Land this before any vendor-specific question — it makes the rest of the conversation vocabulary-clean. Especially useful when Cerebras or HyperCIM describe a completely different execution model; this section primes the audience to hear it as 'different triangle' rather than 'strange chip'."
      evaluationLens={[
        'Which vertex of the triangle is this architecture betting on — instruction, data, or shape?',
        'What does the architecture do when the other two vertices are not aligned?',
        'Is the workload front-end bound, memory-bound, or shape-mismatch bound? The fix for each is different.',
        'Is the ISA expressive enough to emit the kernel the model needs, or does the compiler have to fall back?',
        'What is the cost of a stall on this architecture, and who pays for it — hardware, compiler, or programmer?',
      ]}
    >
      <SpaceBetween size="l">
        <Header variant="h2">The three legs, in detail</Header>
        <Box variant="p">
          A FLOP happens when a functional unit executes a specified operation on a specified
          operand. For that to happen, the architecture has to deliver three things to the unit
          at the same clock:
        </Box>
        <Box variant="p">
          <strong>Instruction delivery.</strong> The front end has to fetch, decode, and issue
          an instruction that encodes the operation the workload wants. Out-of-order host cores
          do this with a branch predictor, a big BTB, TAGE-style prediction, and speculative
          execution — they bet on what the next instruction will be and replay if they lose.
          GPU SMs do it with warp schedulers and no speculation. Trainium does not do it at all
          at runtime — the Neuron compiler
          {' ('}
          <Link
            external
            href="https://awsdocs-neuron.readthedocs-hosted.com/"
          >
            Neuron SDK documentation
          </Link>
          , accessed 2026-04-23) emits the NEFF descriptor ahead of time and the runtime plays it
          back. Dataflow architectures like Cerebras WSE-3 bake the program into per-PE state so
          there is no front end at all.
        </Box>
        <Box variant="p">
          <strong>Data delivery.</strong> The operand bytes have to be resident in the tier the
          unit reads from. On a host core that tier is the register file sourced from L1; on a
          GPU SM it is the register file sourced from SMEM and (on Blackwell) TMEM; on Trainium
          it is SBUF and PSUM. Data delivery is where the memory hierarchy's seven tiers earn
          their place — every miss upstream is either a stall or a compiler-visible schedule slip.
        </Box>
        <Box variant="p">
          <strong>Shape fit.</strong> The operand layout has to match what the unit expects.
          AMX tile registers on Intel Xeon 6 hold 16 rows of up to 64 bytes each
          {' ('}
          <Link
            external
            href="https://www.intel.com/content/www/us/en/developer/articles/technical/advanced-matrix-extensions-overview.html"
          >
            Intel AMX technical overview
          </Link>
          , accessed 2026-04-23). Blackwell tensor cores with tcgen05.mma operate on TMEM tiles
          in specific shapes. Trainium's systolic array consumes tiles sized by the Neuron
          compiler. A kernel whose tiles are the wrong size either loses peak (under-fills the
          unit) or is recompiled into a fallback path that does not hit tensor-core throughput.
          This is why precision conversation (NVFP4, MXFP8, BF16) is a shape question, not just
          a bits-per-operand question — the layout changes too.
        </Box>

        <Header variant="h2">How the live architectures place their bets</Header>
        <Table
          items={triangleRows}
          columnDefinitions={[
            { id: 'arch', header: 'Architecture', cell: (r) => r.architecture },
            { id: 'inst', header: 'Instruction delivery', cell: (r) => r.instruction },
            { id: 'data', header: 'Data delivery', cell: (r) => r.data },
            { id: 'shape', header: 'Shape fit', cell: (r) => r.shape },
            { id: 'stall', header: 'Stall / cost of being wrong', cell: (r) => r.stall },
          ]}
          variant="embedded"
          wrapLines
        />
        <Box variant="small">
          Table compiled from vendor documentation for each architecture — see the per-vendor
          sections (8-16) for inline citations and verified numbers.
        </Box>

        <Header variant="h2">Workload character selects the bet</Header>
        <Box variant="p">
          The same box looks like a different machine depending on what you run on it. A
          business-logic workload — order books, payment clearing, user sessions — lives in
          branchy code, short-lived objects, and working sets that fit in L2 and L3. On that
          workload the branch predictor and the L3 hit rate are the first-order variables;
          tensor cores are irrelevant. Swap to transformer decode and the same silicon's
          branches are sparse and easily predicted, the front end is over-provisioned, and the
          bottleneck is HBM bandwidth staging weights into the tensor pipe.
        </Box>
        <Box variant="p">
          This is why "which chip is fastest" is an ill-formed question. Fastest at what? An
          HFT matching engine at p99.9 latency, a RAG pipeline at tokens per second per dollar,
          a foundation-model training run at time-to-convergence, and a mixed-tenant SaaS
          backend at cost per request are four different architectures of problem. They select
          different triangles and, often, different silicon.
        </Box>

        <Header variant="h2">The cost of being wrong is not portable</Header>
        <Box variant="p">
          A subtle point that shows up in every technical evaluation: the cost of a stall is an
          architectural property, not a universal constant. A branch mispredict on an
          out-of-order core costs on the order of 15-20 cycles of drained pipeline plus the
          front-end re-steer. A pipeline bubble on a tensor core costs the matmul's worth of
          FLOPs that did not retire that clock. A schedule slip on Trainium is
          compiler-visible — the NEFF already encoded when each operand has to arrive, so a
          slip shows up as a compile-time artifact rather than a runtime surprise. A fabric
          congestion event on WSE-3 is handled by the static routing plan, which means either
          the plan avoided it or the model does not fit.
        </Box>
        <Box variant="p">
          Transferring optimization intuitions between these architectures is dangerous. A
          CUDA kernel that over-subscribes SMEM to hide latency is doing something that has no
          counterpart on Trainium, where the compiler has already decided what is resident.
          "We cut p99 by raising speculation depth" does not translate to a systolic array
          because there is no speculation depth to raise.
        </Box>
      </SpaceBetween>
    </SectionShell>
  );
}
