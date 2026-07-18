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
import { DeterminismDiagram } from '../components/DeterminismDiagram';

interface RegRow {
  framework: string;
  scope: string;
  determinismHook: string;
}

const regRows: RegRow[] = [
  { framework: 'SR 11-7 (Federal Reserve)', scope: 'Model risk management', determinismHook: 'Reproducibility of model outputs is a control point' },
  { framework: 'MiFID II / RTS 6', scope: 'Algorithmic trading governance', determinismHook: 'Order generation must be reconstructable' },
  { framework: 'CFTC Part 1.31 / SEC Rule 17a-4', scope: 'Recordkeeping', determinismHook: 'Replayable inference enables compliant audit trails' },
  { framework: 'DORA', scope: 'EU operational resilience', determinismHook: 'ICT risk management benefits from deterministic runtime' },
  { framework: 'HIPAA / clinical use', scope: 'Healthcare AI', determinismHook: 'Same input → same output is a fairness and audit property' },
  { framework: 'FINRA 3110', scope: 'Broker-dealer supervision', determinismHook: 'Demonstrable separation of decision logic per request' },
];

export function DeterminismAOT() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Per-call reproducibility as a regulatory and operational feature"
          >
            Determinism — NEFF AOT and GPU reproducibility
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why this section.</strong> Capital markets, healthcare,
            and audit-sensitive workloads increasingly treat per-call
            determinism as a first-class requirement. Not approximate
            reproducibility — bit-exact output for the same input on the
            same silicon, every time. Section 28 covered the spatial
            isolation story (tenant separation). This section covers the
            temporal isolation story (per-call reproducibility).
          </Box>
          <Box variant="p">
            <strong>Two architectural paths.</strong> Trainium delivers
            determinism by construction — the NEFF binary is the schedule,
            and the schedule is fixed at compile time. NVIDIA GPUs deliver
            determinism through opt-in flags: cuBLAS deterministic mode,
            cuDNN deterministic kernel selection, CCCL collective
            determinism, careful PRNG seeding, careful reduction-order
            management. The two paths produce the same property; they
            arrive at it differently.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Trainium NEFF AOT versus GPU determinism opt-in"
          >
            Two paths to the same property
          </Header>
        }
      >
        <SpaceBetween size="m">
          <DeterminismDiagram />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The compile-time-scheduled accelerator path"
          >
            Trainium — determinism as a free side effect
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>How the property emerges.</strong> The Neuron compiler
            emits the entire computation schedule into the NEFF binary —
            which kernel runs when, which operands are resident in SBUF at
            each clock, what the reduction order looks like across the
            systolic array, where collective synchronization points fall.
            The runtime walks that schedule. There is no runtime kernel
            selection, no warp-scheduling decision, and no cache-eviction
            policy. Therefore, given the same NEFF, the same input, and the
            same silicon, the system produces the same output in the same
            order.
          </Box>
          <Alert type="success" header="What the property buys you">
            Audit reconstruction is replay, not approximate reproduction.
            For a regulated trading firm asked to demonstrate that a model
            ran a certain way on a certain day, the NEFF binary plus the
            input is sufficient — there is no &ldquo;within tolerance&rdquo;
            answer to give a regulator. The output is bit-exact to what was
            produced in production
            ({' '}
            <Link external href="https://awsdocs-neuron.readthedocs-hosted.com/">
              AWS Neuron SDK documentation
            </Link>
            , accessed 2026-04-23).
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The runtime-scheduled accelerator path"
          >
            NVIDIA GPU — determinism on opt-in
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>How non-determinism arises.</strong> A standard GPU
            inference path has multiple sources of non-determinism: atomic
            reductions whose order depends on warp scheduling; cuBLAS /
            cuDNN kernel selection that may pick different kernels on
            different runs; PRNG state initialization; floating-point
            associativity in reductions across multiple warps. Any one of
            these is enough to produce slightly different bit patterns on
            two runs of the same model with the same input.
          </Box>
          <Box variant="p">
            <strong>What you turn on for determinism.</strong> CUDA
            deterministic mode (avoids non-deterministic atomic operations),
            cuBLAS deterministic algorithm flag, cuDNN deterministic kernel
            selection, CCCL 3.1 collective determinism for multi-GPU runs,
            explicit PRNG seeding at well-defined points, and reduction-order
            management when emitting custom kernels. The combination is
            achievable, but each layer must be configured deliberately and
            validated end-to-end.
          </Box>
          <Alert type="warning" header="The throughput cost is real">
            Deterministic kernels are not always the fastest kernels.
            Avoiding atomic-add reductions costs throughput. Locking kernel
            selection prevents the runtime from picking the optimal variant
            for the current workload shape. Multi-GPU determinism requires
            ordering constraints on collectives that reduce overlap. For
            workloads where determinism is mandatory, the cost is paid; for
            workloads where it is optional, the cost is the reason it is not
            on by default.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why regulated workloads care about reproducibility"
          >
            The regulatory map
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Different regulatory regimes treat determinism differently —
            some explicitly require reproducibility, others use it as a
            control mechanism for broader risk-management requirements. The
            table below maps the major regimes that touch AI inference in
            capital markets, healthcare, and adjacent regulated industries.
          </Box>
          <Table
            items={regRows}
            columnDefinitions={[
              { id: 'fw', header: 'Regulatory framework', cell: (r) => r.framework, minWidth: 200 },
              { id: 'scope', header: 'Scope', cell: (r) => r.scope },
              { id: 'hook', header: 'Why determinism matters', cell: (r) => r.determinismHook },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            Regulatory mapping is general — specific compliance approaches
            depend on jurisdiction and individual firm interpretation.
            Treat as a starting point for the conversation, not as legal
            guidance.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The composition with isolation"
          >
            Determinism + isolation
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Spatial — what Section 28 covered</Box>
            <Box variant="p">
              NIE on Graviton5 (formally verified host isolation), MIG on
              NVIDIA (hardware GPU partitioning), TEE-I/O on Blackwell
              (cryptographic per-MIG-instance encryption), compiler-managed
              SBUF on Trainium. Spatial isolation means tenants cannot
              affect each other&apos;s state.
            </Box>
          </div>
          <div>
            <Box variant="h3">Temporal — what this section adds</Box>
            <Box variant="p">
              NEFF AOT on Trainium (deterministic by construction), GPU
              determinism opt-in (deterministic by configuration). Temporal
              isolation means each call produces the same result regardless
              of when it runs, what else is running, and whether anyone
              looks at the schedule.
            </Box>
          </div>
        </ColumnLayout>
        <ExpandableSection headerText="What full reproducibility actually requires in practice">
          <SpaceBetween size="s">
            <Box variant="p">
              Bit-exact reproducibility requires every layer to cooperate.
              Same model weights at the same precision (no silent
              quantization difference). Same kernel implementation (so
              reduction order is preserved). Same PRNG state if any
              stochasticity exists (sampling temperature, dropout in
              training). Same hardware revision (some operations are
              FP-associative-equivalent across silicon revisions but not
              bit-exact). Same input including padding and tokenization.
            </Box>
            <Box variant="p">
              Trainium gets most of these properties for free because the
              compiler is the source of truth for the schedule. GPU paths
              get them through deliberate engineering. Both can deliver
              the property; the cost-of-engineering profile is different.
            </Box>
          </SpaceBetween>
        </ExpandableSection>
      </Container>
    </SpaceBetween>
  );
}
