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
import { IsolationLayers } from '../components/IsolationLayers';

interface MigRow {
  gpu: string;
  capacity: string;
  config: string;
}

const migRows: MigRow[] = [
  { gpu: 'A100 (40 GB)', capacity: '40 GB', config: '7 × ~5 GB · 3 × ~10 GB · 1 × 40 GB' },
  { gpu: 'A100 (80 GB) / H100 SXM', capacity: '80 GB', config: '7 × ~10 GB · 3 × ~20 GB · 1 × 80 GB' },
  { gpu: 'H200 SXM', capacity: '141 GB', config: '7 × ~18 GB · 3 × ~35 GB · 1 × 141 GB' },
  { gpu: 'B200', capacity: '180 GB', config: '7 × ~23 GB · 2 × ~95 GB · 1 × 192 GB' },
  { gpu: 'B300 (Blackwell Ultra)', capacity: '288 GB', config: '7 × ~34 GB · 4 × ~70 GB · 2 × ~140 GB · 1 × 288 GB' },
];

export function IsolationNie() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The three-pillar isolation story — host, accelerator, software"
          >
            Isolation — NIE and MIG
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why this section.</strong> Multi-tenant inference is
            cheaper than single-tenant inference. Multi-tenant inference is
            also where noisy neighbors, cache contention, and shared-fabric
            interference live. For capital markets and regulated workloads,
            tenant isolation is not a cost-management feature — it is a
            compliance requirement (MiFID II, DORA, SEC Rule 17a-4, CFTC
            Part 1.31). This section walks AWS&apos;s three-pillar isolation
            story across the layers of the stack.
          </Box>
          <Box variant="p">
            <strong>The three pillars together.</strong> Host-level isolation
            via the Nitro Isolation Engine. Accelerator-level partitioning
            via MIG (NVIDIA) or compiler-managed SBUF (Trainium). Software-
            level isolation via NEFF AOT compilation (covered in Section 27).
            Each pillar addresses a different class of jitter source. Together
            they map directly to the regulated-workloads compliance
            requirements every capital-markets firm has to satisfy.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What lives at each pillar"
          >
            The three pillars, side by side
          </Header>
        }
      >
        <SpaceBetween size="m">
          <IsolationLayers />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The first formally verified cloud hypervisor"
          >
            Pillar 1 — Nitro Isolation Engine on Graviton5
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What NIE is.</strong> A minimal Rust software module that
            sits beneath the Nitro Hypervisor and enforces VM-to-VM
            isolation. Announced at re:Invent 2025 alongside Graviton5 and
            the M9g preview instances. Distinct from the Nitro Hypervisor
            itself — NIE is the isolation layer; the Nitro Hypervisor is the
            virtualization layer
            ({' '}
            <Link external href="https://www.aboutamazon.com/news/aws/aws-graviton-5-cpu-amazon-ec2">
              AWS Graviton 5 announcement
            </Link>
            , accessed 2026-04-23).
          </Box>
          <Box variant="p">
            <strong>The formal verification.</strong> NIE is verified using
            Isabelle/HOL — the same interactive theorem-prover toolchain used
            for the seL4 microkernel and major cryptographic algorithm
            proofs. Roughly 250,000 lines of Isabelle proof script, checking
            in approximately 30 minutes on a standard laptop. AWS positions
            NIE as the first formally verified cloud hypervisor.
          </Box>
          <Alert type="success" header="What the proof actually establishes">
            For all possible execution traces, a VM running on a Graviton5
            host with NIE cannot read or write another VM&apos;s memory,
            cannot observe another VM&apos;s cache state through the
            timing side channels NIE covers, cannot escape its scheduling
            quantum in a way that affects another VM, and cannot bypass the
            Nitro Hypervisor&apos;s admission control. These properties hold
            mathematically — not empirically. Bugs in the covered surface
            cannot exist by construction.
          </Alert>
          <Box variant="p">
            <strong>Why this matters for capital markets.</strong> The
            standard compliance path for tenant isolation in regulated
            finance has been: document the isolation architecture, demonstrate
            SOC 2 / ISO 27001 controls, accept residual risk of undiscovered
            hypervisor bugs. NIE adds a new tier to that demonstration —
            mathematical proof. Auditors can inspect the Isabelle proof
            script. Regulators can verify independently. This is qualitatively
            different from &ldquo;we have not seen a bypass in
            production&rdquo; — it is &ldquo;a bypass is logically impossible
            within the covered interface.&rdquo;
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Hardware partitioning of an NVIDIA GPU into up to 7 instances"
          >
            Pillar 2 — MIG and TEE-I/O on NVIDIA
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What MIG is.</strong> Multi-Instance GPU. Hardware
            partitioning of an NVIDIA data-center GPU into up to 7
            independent GPU instances. Each instance appears to Linux as a
            separate CUDA device with its own PCI function. The partitioning
            is enforced at the hardware register level — no SM sharing, no
            L2 sharing, no HBM bandwidth sharing across instances
            ({' '}
            <Link external href="https://www.nvidia.com/en-us/technologies/multi-instance-gpu/">
              NVIDIA MIG
            </Link>
            , accessed 2026-04-23).
          </Box>
          <Table
            items={migRows}
            columnDefinitions={[
              { id: 'gpu', header: 'GPU', cell: (r) => r.gpu, minWidth: 200 },
              { id: 'cap', header: 'Total HBM', cell: (r) => r.capacity },
              { id: 'cfg', header: 'Example MIG configurations', cell: (r) => r.config },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="p">
            Each MIG instance gets its own dedicated SM count, L2 slice,
            HBM region, HBM bandwidth (allocated by the memory controllers,
            not shared), copy engines, and decode engines. The core property:
            deterministic memory bandwidth per tenant. One MIG instance
            running a hot decode workload cannot cause another instance&apos;s
            HBM bandwidth to degrade.
          </Box>
          <Alert type="info" header="TEE-I/O on Blackwell adds cryptographic isolation">
            Blackwell extends hardware Trusted Execution Environment
            capabilities to MIG instances via TEE-I/O and inline NVLink
            protection. Encrypted GPU memory per MIG instance, inline-
            encrypted NVLink traffic between GPUs in the same confidential
            compute domain, and cryptographic attestation of the MIG
            instance&apos;s boot state. The combination is mathematical
            isolation on the host (NIE) plus cryptographic isolation on the
            GPU (TEE-I/O) plus hardware partitioning (MIG) — three layers
            that compose for tenant separation that no other public cloud
            currently offers end-to-end.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The Trainium side of accelerator isolation"
          >
            Pillar 2 (Trainium variant) — compiler-managed SBUF partitioning
          </Header>
        }
      >
        <Box variant="p">
          On Trainium, the equivalent of MIG is compiler-managed SBUF
          partitioning. Because all memory residency is decided ahead of
          time by the Neuron compiler — there is no cache to share or
          bandwidth to contend for — the isolation property is structural
          rather than runtime-enforced. Each NeuronCore&apos;s SBUF and
          PSUM are explicitly assigned by the NEFF; there is no shared
          dynamic allocator that two tenants could compete for. The
          property looks different from MIG (no register-level partition
          scheme to configure), but the operational outcome is the same:
          one tenant&apos;s work cannot starve another tenant&apos;s
          memory budget.
        </Box>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What this means at the architecture level"
          >
            What the compose buys you
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">For multi-tenant inference</Box>
            <ul>
              <li>NIE: tenant VMs cannot read each other&apos;s memory</li>
              <li>MIG: per-tenant HBM bandwidth is hardware-partitioned</li>
              <li>TEE-I/O: tenant data is encrypted at rest on the GPU</li>
              <li>Trainium NEFF: tenant schedule is compile-time fixed</li>
            </ul>
          </div>
          <div>
            <Box variant="h3">For regulatory audit</Box>
            <ul>
              <li>NIE: cite the Isabelle proof — mathematical separation</li>
              <li>MIG: cite the hardware partition table — physical separation</li>
              <li>TEE-I/O: cite cryptographic attestation — verifiable separation</li>
              <li>NEFF: cite the binary — reproducible separation per call</li>
            </ul>
          </div>
        </ColumnLayout>
        <ExpandableSection headerText="Where the boundaries are not absolute">
          <Box variant="p">
            NIE covers VM-to-VM isolation on Graviton5 hosts. It does not
            cover GPU memory isolation (that is MIG / TEE-I/O&apos;s job)
            and does not cover network-fabric isolation (that is the
            Nitro card&apos;s SRD encryption). MIG covers per-instance HBM
            and SM isolation but does not cover NVLink fabric outside the
            confidential-compute domain. The three pillars compose; each
            pillar is honest about what it does and does not cover. For a
            workload that needs end-to-end isolation, all three matter.
          </Box>
        </ExpandableSection>
      </Container>
    </SpaceBetween>
  );
}
