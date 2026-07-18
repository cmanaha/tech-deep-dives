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
import { AwsCompilerStack } from '../components/AwsCompilerStack';

interface ToolRow {
  layer: string;
  what: string;
  consumed: string;
}

const toolRows: ToolRow[] = [
  { layer: 'PyTorch / JAX model', what: 'Model authoring; the application layer', consumed: 'Application code' },
  { layer: 'torch-neuronx / jax-neuron', what: 'Framework integration; graph capture and partitioning for the Neuron compiler', consumed: 'PyTorch or JAX graph' },
  { layer: 'XLA HLO', what: 'OpenXLA intermediate representation; layout normalization and standard XLA passes', consumed: 'Captured graph' },
  { layer: 'NKI (Neuron Kernel Interface)', what: 'Python DSL for hand-authored kernels against SBUF / PSUM / systolic array', consumed: 'NKI kernels in Python' },
  { layer: 'Neuron HLO', what: 'AWS-specific operator fusion, SBUF tiling, schedule construction', consumed: 'XLA HLO and NKI output' },
  { layer: 'NEFF', what: 'Neuron Executable File Format — ahead-of-time binary; the fixed schedule', consumed: 'Neuron HLO' },
  { layer: 'Neuron runtime', what: 'Loads NEFF, dispatches to NeuronCores, manages CC-Cores for collectives', consumed: 'NEFF binary' },
  { layer: 'Neuron profiler', what: 'neuron-ls, neuron-top, neuron-profile, TensorBoard plugin — closes the feedback loop', consumed: 'Compiled and running model' },
  { layer: 'Neuron Distributed', what: 'Tensor parallel, pipeline parallel, sequence parallel, optimizer partitioning', consumed: 'Single-device model' },
];

export function AwsCompilersAndTooling() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The path from Python code to a NEFF binary running on Trainium NeuronCores"
          >
            AWS compilers and kernel tooling
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why this section.</strong> Section 17 covered Trainium and
            Inferentia at the silicon level. This section covers the toolchain that
            targets that silicon — the AWS counterpart to the NVIDIA compiler stack
            in Section 16. The two stacks make different bets, and most of those
            differences trace back to one architectural choice: Trainium uses
            ahead-of-time compilation. The NEFF binary <em>is</em> the schedule.
          </Box>
          <Box variant="p">
            <strong>What &ldquo;Neuron&rdquo; is at this level.</strong> Not one
            tool — an SDK that owns everything from PyTorch / JAX integration through
            the operator-fusion compiler down to the runtime that dispatches to
            NeuronCores. NKI sits beside the standard graph path as a hand-authoring
            escape hatch when the compiler&apos;s default kernel choice is not enough.
            Neuron Distributed sits on top, providing tensor-parallel, pipeline-
            parallel, and sequence-parallel patterns. The Neuron profiler closes the
            loop.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The lowering path from Python through XLA to NEFF"
          >
            The stack, visualized
          </Header>
        }
      >
        <SpaceBetween size="m">
          <AwsCompilerStack />
          <Box variant="p">
            Most workloads enter through PyTorch eager or torch.compile and hand off
            to torch-neuronx, which captures the graph as XLA HLO. The Neuron
            compiler runs its own passes — operator fusion, SBUF tiling, schedule
            construction — and emits a NEFF binary. JAX takes the same path through
            jax-neuron and XLA. NKI is the second entry point: a Python DSL for
            hand-written kernels that lower into the same Neuron HLO and join the
            standard graph path
            ({' '}
            <Link external href="https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/nki/">
              NKI documentation
            </Link>
            , accessed 2026-04-23).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Each layer, what it does, and what it consumes"
          >
            The nine layers
          </Header>
        }
      >
        <Table
          items={toolRows}
          columnDefinitions={[
            { id: 'layer', header: 'Layer', cell: (r) => r.layer, minWidth: 220 },
            { id: 'what', header: 'What it does', cell: (r) => r.what },
            { id: 'cons', header: 'Consumes', cell: (r) => r.consumed },
          ]}
          variant="embedded"
          wrapLines
        />
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The single architectural choice that drives most of Neuron's properties"
          >
            Ahead-of-time compilation as the discipline
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The Neuron compiler emits the entire schedule into a NEFF before the
            workload runs. The runtime loads the NEFF and walks it. There is no
            warp scheduler, no operand-staging heuristic, no cache-eviction policy
            in the loop. Every byte that lives in SBUF at any given clock was put
            there by the compiler, and every operation that fires on the systolic
            array was fired because the NEFF said it should fire that clock.
          </Box>
          <Alert type="info" header="The properties that fall out">
            <strong>Determinism.</strong> Same NEFF, same input, same silicon
            produces the same output in the same order. This is the property
            regulated workloads point to. Section 29 (Determinism) covers it in
            depth.{' '}
            <strong>Compile-time-visible misses.</strong> A schedule slip is
            detectable in the NEFF, not at runtime. The optimizer fix is a
            re-tile, not a profiler-driven kernel rewrite.{' '}
            <strong>Predictable wall-clock.</strong> No runtime variance from
            warp-scheduling decisions or cache contention.
          </Alert>
          <Alert type="warning" header="The compile-cost dial">
            AOT compilation costs time at compile time. For a training loop the
            cost amortizes — compile once, run many epochs — and the persistent
            NEFF cache makes repeat builds fast. For inference serving with
            stable graphs the cost is paid at deployment. For workloads with
            highly dynamic graph shapes (variable shapes, conditional control
            flow), recompiles can become a real operational concern. The
            compiler caching strategy and partial recompilation are first-class
            in Neuron docs precisely because of this.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The Python kernel-authoring DSL — the AWS counterpart to Triton"
          >
            NKI in detail
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">What NKI is</Box>
              <Box variant="p">
                A Python DSL for authoring kernels directly against the Trainium
                / Inferentia substrate. The author writes Python code that
                operates on tile-shaped operands; NKI compiles it into Neuron HLO
                and joins the standard schedule. NKI exposes SBUF and PSUM
                explicitly — unlike Triton on a GPU, where the compiler manages
                SMEM with cache-style heuristics, NKI puts that decision in
                the kernel author&apos;s hands.
              </Box>
            </div>
            <div>
              <Box variant="h3">When to reach for NKI</Box>
              <Box variant="p">
                Most Trainium workloads do not need NKI — torch-neuronx with
                stock operators handles the common cases. NKI matters when the
                compiler&apos;s default tiling does not hit peak, when the
                workload uses an operator the compiler does not fuse well, or
                when the model needs a kernel shape (custom attention,
                domain-specific accelerator) that no standard operator
                expresses. The MoE NKI kernels (Router Top-K, MoE CTE, MoE TKG,
                Blockwise Matmul) shipped in Neuron 2.27.0 are an example of
                NKI-authored kernels graduating into first-class library code.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The library that handles distributed-training patterns"
          >
            Neuron Distributed
          </Header>
        }
      >
        <Box variant="p">
          Neuron Distributed is the AWS-maintained library for distributed-training
          patterns on Trainium clusters: tensor parallel (split a layer across
          NeuronCores), pipeline parallel (split layers across stages), sequence
          parallel (shard along the sequence dimension), expert parallel (shard
          experts across chips), and ZeRO-style optimizer-state partitioning. The
          library composes with SageMaker HyperPod for large-cluster orchestration
          ({' '}
          <Link
            external
            href="https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/neuronx-distributed/"
          >
            Neuron Distributed docs
          </Link>
          , accessed 2026-04-23).
        </Box>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Closing the feedback loop"
          >
            Profiling — the Neuron toolset
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">neuron-ls and neuron-top</Box>
            <Box variant="p">
              Real-time inventory and counter views. <code>neuron-ls</code>
              enumerates devices, NeuronCores, and topology;{' '}
              <code>neuron-top</code> shows live utilization, SBUF residency,
              memory pressure, and CC-Core activity per chip. The first tools
              you reach for when something is wrong.
            </Box>
          </div>
          <div>
            <Box variant="h3">neuron-profile + TensorBoard</Box>
            <Box variant="p">
              <code>neuron-profile</code> captures per-instruction traces from a
              run; the TensorBoard plugin renders them as a timeline showing
              SBUF residency, collective timing, and host-device interaction.
              The Trainium analog of NVIDIA Nsight Compute / Systems —
              difference is that Trainium traces are deterministic, so two
              runs of the same NEFF on the same input produce identical traces.
            </Box>
          </div>
        </ColumnLayout>
        <ExpandableSection headerText="Compiler caching strategy">
          <Box variant="p">
            The Neuron compiler maintains a persistent NEFF cache keyed on the
            graph hash. A training loop compiles each unique graph shape once
            and reuses the NEFF across epochs. For models with mostly-static
            shapes the steady-state cost is zero. For models with shape
            polymorphism, partial recompilation paths re-emit only the changed
            subgraphs. CI integration uses the cache to make NEFF builds
            reproducible across runners.
          </Box>
        </ExpandableSection>
      </Container>
    </SpaceBetween>
  );
}
