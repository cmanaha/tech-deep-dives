import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { IsolationLayers } from '../components/IsolationLayers';
import { Cite } from '../components/Cite';
import type { Source } from '../components/Cite';
import { S } from '../sources/IsolationNie';

interface MigRow {
  gpu: string;
  layouts: string;
  source: Source;
}

const migRows: MigRow[] = [
  {
    gpu: 'A100, 40 GB',
    layouts: '1g.5gb\u00a0×\u00a07 · 2g.10gb\u00a0×\u00a03 · 7g.40gb\u00a0×\u00a01',
    source: S.migSupportedProfiles,
  },
  {
    gpu: 'A100 or H100 SXM5, 80 GB',
    layouts: '1g.10gb\u00a0×\u00a07 · 2g.20gb\u00a0×\u00a03 · 7g.80gb\u00a0×\u00a01',
    source: S.migSupportedProfiles,
  },
  {
    gpu: 'H200 SXM5, 141 GB',
    layouts: '1g.18gb\u00a0×\u00a07 · 2g.35gb\u00a0×\u00a03 · 7g.141gb\u00a0×\u00a01',
    source: S.migSupportedProfiles,
  },
  {
    gpu: 'B200, 180 GB',
    layouts: '1g.23gb\u00a0×\u00a07 · 3g.90gb\u00a0×\u00a02 · 7g.180gb\u00a0×\u00a01',
    source: S.migSupportedProfiles,
  },
  {
    gpu: 'Blackwell Ultra, 288 GB (NVIDIA blog example)',
    layouts: '7\u00a0×\u00a034 GB · 4\u00a0×\u00a070 GB · 2\u00a0×\u00a0140 GB',
    source: S.blackwellUltraBlog,
  },
  {
    gpu: 'GB300 (DGX Station), 252 GB',
    layouts:
      '1g.31gb\u00a0×\u00a07 · 1g.63gb\u00a0×\u00a04 · 3g.126gb\u00a0×\u00a02 · 7g.251gb\u00a0×\u00a01',
    source: S.migSupportedProfiles,
  },
];

const encryptionCheck = String.raw`aws ec2 describe-instance-types \
    --filters Name=network-info.encryption-in-transit-supported,Values=true \
    --query "InstanceTypes[*].[InstanceType]" \
    --output text | sort`;

// NIE's split of the Nitro Hypervisor: mechanism at EL2, policy at EL1. Every label is
// from the NIE white paper (nieWhitepaper), cited in the caption below the diagram. Wide:
// on a phone the svg keeps a 640 px minimum and the wrapper scrolls sideways.
function NieSplitDiagram() {
  const ink = '#16191f';
  const grey = '#5f6b7a';
  const blue = '#0972d3';
  const amber = '#ec7211';
  const font = 'sans-serif';
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 300"
        role="img"
        aria-labelledby="nie-split-title"
        style={{
          width: '100%',
          minWidth: 640,
          height: 'auto',
          display: 'block',
        }}
      >
        <title id="nie-split-title">
          NIE alone runs at EL2 and controls the CPU page tables, the IOMMU and saved guest CPU
          state. The rest of the Nitro Hypervisor runs at EL1 beside the guest VMs, keeps scheduling
          and the other policy, and reaches guests only through NIE&apos;s hypercall API, so the
          proof covers the mechanism and leaves the policy outside it.
        </title>
        <defs>
          <marker
            id="nie-ah"
            viewBox="0 0 10 10"
            refX={9}
            refY={5}
            markerWidth={8}
            markerHeight={8}
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill={grey} />
          </marker>
        </defs>
        <rect x={0} y={0} width={860} height={300} rx={8} fill="#ffffff" />

        <text x={24} y={88} fontSize={14} fontWeight={700} fill={ink} fontFamily={font}>
          EL1
        </text>
        <text x={24} y={226} fontSize={14} fontWeight={700} fill={ink} fontFamily={font}>
          EL2
        </text>
        <line x1={20} y1={158} x2={840} y2={158} stroke="#d1d5db" strokeDasharray="5 4" />

        {/* EL1: guests and the deprivileged hypervisor, side by side */}
        <rect x={84} y={40} width={150} height={84} rx={8} fill="#f4f4f4" stroke="#879596" />
        <text
          x={159}
          y={76}
          fontSize={13}
          fontWeight={600}
          fill={ink}
          fontFamily={font}
          textAnchor="middle"
        >
          Guest VM
        </text>
        <text x={159} y={96} fontSize={11} fill={grey} fontFamily={font} textAnchor="middle">
          customer A
        </text>
        <rect x={254} y={40} width={150} height={84} rx={8} fill="#f4f4f4" stroke="#879596" />
        <text
          x={329}
          y={76}
          fontSize={13}
          fontWeight={600}
          fill={ink}
          fontFamily={font}
          textAnchor="middle"
        >
          Guest VM
        </text>
        <text x={329} y={96} fontSize={11} fill={grey} fontFamily={font} textAnchor="middle">
          customer B
        </text>
        <rect
          x={424}
          y={40}
          width={416}
          height={84}
          rx={8}
          fill="#fdf3ec"
          stroke={amber}
          strokeWidth={1.5}
        />
        <text x={440} y={62} fontSize={13} fontWeight={600} fill={ink} fontFamily={font}>
          Nitro Hypervisor, deprivileged (policy)
        </text>
        <text x={440} y={82} fontSize={11} fill={ink} fontFamily={font}>
          Scheduling, resource allocation, device emulation,
        </text>
        <text x={440} y={98} fontSize={11} fill={ink} fontFamily={font}>
          interrupt controller, guest creation
        </text>
        <text x={440} y={115} fontSize={11} fontWeight={600} fill={amber} fontFamily={font}>
          Outside the proof
        </text>

        {/* NIE mediates guest state */}
        <line
          x1={159}
          y1={180}
          x2={159}
          y2={128}
          stroke={grey}
          strokeWidth={1.5}
          markerEnd="url(#nie-ah)"
        />
        <line
          x1={329}
          y1={180}
          x2={329}
          y2={128}
          stroke={grey}
          strokeWidth={1.5}
          markerEnd="url(#nie-ah)"
        />
        <text
          x={244}
          y={150}
          fontSize={11}
          fontWeight={600}
          fill={grey}
          fontFamily={font}
          textAnchor="middle"
        >
          all guest access
        </text>
        <line
          x1={632}
          y1={128}
          x2={632}
          y2={180}
          stroke={grey}
          strokeWidth={1.5}
          markerEnd="url(#nie-ah)"
        />
        <text x={644} y={150} fontSize={11} fontWeight={600} fill={grey} fontFamily={font}>
          hypercall API only
        </text>

        {/* EL2: the Nitro Isolation Engine */}
        <rect
          x={84}
          y={184}
          width={756}
          height={92}
          rx={8}
          fill="#f2f8fd"
          stroke={blue}
          strokeWidth={2}
        />
        <text x={100} y={208} fontSize={13} fontWeight={600} fill={blue} fontFamily={font}>
          Nitro Isolation Engine (mechanism), formally verified
        </text>
        <text x={100} y={228} fontSize={11} fill={ink} fontFamily={font}>
          The only component that touches guest state: CPU page tables, IOMMU, saved guest CPU state
        </text>
        <text x={100} y={246} fontSize={11} fill={ink} fontFamily={font}>
          Proof covers VM creation and configuration, virtual CPU management and memory management
        </text>
        <text x={100} y={264} fontSize={11} fill={grey} fontFamily={font}>
          Rust, verified in Isabelle/HOL
        </text>
      </svg>
    </div>
  );
}

export function IsolationNie() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Which boundary keeps workloads apart at each layer, what it guarantees, and the evidence you can show"
          >
            Isolation: NIE and MIG
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Multi-tenant inference is cheaper than single-tenant inference, and sharing raises two
            questions: can one workload read another&apos;s data, and can it slow another down? Each
            layer answers with a different kind of boundary. NIE (Nitro Isolation Engine) keeps
            virtual machines (VMs) apart on Graviton5 hosts, under a proof with a stated scope. MIG
            (Multi-Instance GPU) cuts an NVIDIA GPU into hardware partitions with fixed quotas. On
            Trainium, the Neuron runtime reserves each NeuronCore for one process. Knowing which
            kind you hold tells you what you can claim to a risk team and what you still have to
            measure.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What each boundary separates, what enforces it, and what falls outside it"
          >
            Three boundaries, side by side
          </Header>
        }
      >
        <SpaceBetween size="s">
          <IsolationLayers />
          <Box variant="small" color="text-body-secondary">
            NIE
            <Cite s={S.nieWhitepaper} />
            <Cite s={S.nieComputeBlog} />; MIG
            <Cite s={S.migConcepts} />
            <Cite s={S.migSupportedGpus} />
            <Cite s={S.nvidiaSecureAi} />; NeuronCore reservation
            <Cite s={S.neuronRuntimeConfig} />. The Trainium bandwidth entry reflects the Neuron
            documentation read for this section.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What the proof guarantees about a VM's memory, what it assumes, and what it leaves to design"
          >
            Nitro Isolation Engine on Graviton5
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            NIE is the part of the Nitro Hypervisor that touches guest state: a minimal separation
            kernel, written in Rust
            <Cite s={S.nieComputeBlog} />, that mediates all access to VM memory, CPU register state
            and I/O devices.
            <Cite s={S.nieWhitepaper} /> It runs on every Graviton5 instance and has been generally
            available since June 2026.
            <Cite s={S.nieComputeBlog} />
          </Box>
          <Box variant="p">
            <strong>Mechanism apart from policy.</strong> NIE alone runs at EL2 (Exception Level 2),
            the most privileged hypervisor level on Arm, and alone controls the CPU page tables, the
            IOMMU (I/O Memory Management Unit) and saved guest CPU state. The rest of the Nitro
            Hypervisor is deprivileged to EL1, beside the guests: it keeps the policy and reaches
            guests only through NIE&apos;s hypercall API. Mechanism and policy together made the
            hypervisor too large to verify; separated, the mechanism could be proven on its own.
            <Cite s={S.nieWhitepaper} />
          </Box>
          <NieSplitDiagram />
          <Box variant="p">
            <strong>The verification.</strong> The proof is written in Isabelle/HOL, the theorem
            prover used for seL4, and runs to about 330,000 lines of machine-checked mathematics
            (June 2026).
            <Cite s={S.nieWhitepaper} /> AWS calls the result the first formally verified cloud
            hypervisor, a claim it makes about the Nitro System as a whole.
            <Cite s={S.nieComputeBlog} kind="vendor-claim" />
          </Box>
          <Alert type="info" header="What the proof covers, what it assumes, what it leaves out">
            <SpaceBetween size="xs">
              <Box variant="p">
                <strong>Scope.</strong> Three of the five parts of the VM lifecycle in the hypercall
                API: VM creation and configuration, vCPU (virtual CPU) management, and memory
                management. I/O device management, live update and live migration are not yet
                covered.
                <Cite s={S.nieWhitepaper} />
              </Box>
              <Box variant="p">
                <strong>Four proven properties.</strong> Confidentiality and integrity of each
                VM&apos;s private data (no unauthorized read or write); functional correctness, with
                no behavior beyond the specification; no runtime errors such as panics or arithmetic
                overflows; and memory safety, unsafe Rust included.
                <Cite s={S.nieWhitepaper} />
              </Box>
              <Box variant="p">
                <strong>Assumptions.</strong> The Rust compiler, the more privileged bootloaders and
                firmware, the Graviton5 hardware and the proof tools behave as specified.
                <Cite s={S.nieWhitepaper} />
                <Cite s={S.nieComputeBlog} />
              </Box>
              <Box variant="p">
                <strong>Outside the proof.</strong> Micro-architectural side channels, because the
                model leaves out caches, branch predictors and speculative execution; NIE mitigates
                them by design, with secret-hiding (a guest&apos;s memory is unmapped from NIE
                except while NIE acts for that guest), speculation barriers and no L1 cache shared
                between guests. Concurrent execution across physical CPUs, because the proofs reason
                sequentially; strict two-phase locking is the mitigation. Scheduling, because the
                deprivileged hypervisor decides it.
                <Cite s={S.nieWhitepaper} />
              </Box>
            </SpaceBetween>
          </Alert>
          <Box variant="p">
            <strong>Using it as evidence.</strong> Cite NIE for who can read or write a VM&apos;s
            memory; for latency under contention, measure. Testing covers the cases tried, while
            formal verification covers every input within its scope.
            <Cite s={S.nieWhitepaper} /> The citable artifact today is the white paper. AWS plans to
            make NIE&apos;s source code and formal proofs available to third parties for independent
            review.
            <Cite s={S.nieComputeBlog} />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="How far one GPU splits, the slice sizes per GPU, and what a slice guarantees"
          >
            MIG on NVIDIA GPUs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            MIG splits one NVIDIA GPU into up to seven GPU instances on data-center parts, four on
            the RTX PRO 6000 Blackwell and two on the RTX PRO 5000 and 4500 Blackwell.
            <Cite s={S.migSupportedGpus} /> Each instance has its own SMs (Streaming
            Multiprocessors), L2 cache slice, memory and copy engines
            <Cite s={S.migSupportedProfiles} />, and its memory resources &quot;limit both the
            available capacity and bandwidth, and provide memory QoS&quot; (quality of service),
            with SM performance and errors isolated too.
            <Cite s={S.migConcepts} /> A decode-heavy workload in one instance is held to its own
            slice&apos;s bandwidth. CUDA sees each instance as its own device, with its own MIG
            UUID.
            <Cite s={S.migDeviceNames} />
          </Box>
          <Table
            items={migRows}
            columnDefinitions={[
              { id: 'gpu', header: 'GPU and memory', cell: (r) => r.gpu, minWidth: 120 },
              {
                id: 'layouts',
                header: 'Example layouts (profile × instances)',
                minWidth: 190,
                cell: (r) => (
                  <>
                    {r.layouts}
                    <Cite s={r.source} />
                  </>
                ),
              },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="p">
            Slice sizes follow the product&apos;s memory, as the Blackwell Ultra and GB300 rows
            show. NVIDIA&apos;s MIG page gives the blog&apos;s 7&nbsp;×&nbsp;34 GB split to GB300
            NVL72 and lists HGX B300 as 7&nbsp;×&nbsp;32, 4&nbsp;×&nbsp;67, 2&nbsp;×&nbsp;135 or
            1&nbsp;×&nbsp;270 GB
            <Cite s={S.migProductPage} />, and the MIG guide has no B300 table.
            <Cite s={S.migSupportedGpus} /> Read the profiles on your own instance before you size a
            model to a slice.
          </Box>
          <ExpandableSection headerText="Confidential computing on Blackwell gives whole GPUs to one VM">
            <Box variant="p">
              Blackwell adds TEE-I/O (Trusted Execution Environment for I/O) and inline NVLink
              protection.
              <Cite s={S.blackwellUltraBlog} /> In the confidential-computing modes NVIDIA
              documents, whole GPUs pass through to one confidential VM: one GPU, or up to eight on
              Blackwell with NVLink traffic encrypted, and the GPUs are not shared among VMs.
              CPU-to-GPU traffic is encrypted, and the VM runs on AMD SEV-SNP (Secure Encrypted
              Virtualization with Secure Nested Paging) or Intel TDX (Trust Domain Extensions).
              <Cite s={S.nvidiaSecureAi} /> NVIDIA&apos;s MIG page says confidential computing
              isolates each MIG instance
              <Cite s={S.migProductPage} kind="vendor-claim" />; the white paper lists only
              whole-GPU modes. MIG divides one GPU among workloads; confidential computing protects
              one VM&apos;s data on its way to and between whole GPUs. No EC2 documentation for
              NVIDIA GPU confidential computing was located during this research.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="How Neuron keeps two processes off one NeuronCore, and the resource they still share"
          >
            Trainium: exclusive NeuronCores
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On Trainium the enforced boundary is the Neuron runtime&apos;s. By default it reserves
            every NeuronCore for the current process, and &quot;once a NeuronCore is reserved for a
            process, it cannot be used by another process at all&quot; until that process ends. To
            run several models on one instance, give each process its own cores with{' '}
            <code>NEURON_RT_VISIBLE_CORES</code>; a process that asks for more cores than remain
            free fails.
            <Cite s={S.neuronRuntimeConfig} />
          </Box>
          <Box variant="p">
            Inside a core, the NEFF (Neuron Executable File Format) fixes memory allocation and
            instruction order at compile time
            <Cite s={S.nkiOverview} />, and the core&apos;s SBUF (State Buffer) scratchpad is
            software-managed: compiled code decides what sits there.
            <Cite s={S.nkiTrnInf2Arch} />
            <Cite s={S.neuronCoreV3} /> A NeuronCore belongs to one process, so its SBUF does too.
            HBM (High Bandwidth Memory) capacity and bandwidth are specified per chip
            <Cite s={S.trainium2Arch} />, and no per-NeuronCore bandwidth partition was located in
            the Neuron documentation during this research. Our reading: processes on one chip share
            its HBM bandwidth, so measure them together.{' '}
            <em>Determinism: NEFF and GPU Reproducibility</em> covers what a fixed instruction order
            does and does not make reproducible.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two checks to run today: Nitro encryption between your instances, and the MIG layouts and limits on your GPU instance"
          >
            Before you deploy
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Traffic between instances.</strong> NIE and MIG stop at the machine. Between
            instances, Nitro hardware on supported types encrypts traffic with 256-bit AEAD
            (Authenticated Encryption with Associated Data), within one Region and one VPC (Virtual
            Private Cloud) or peered VPCs, when no load balancer or transit gateway sits in the
            path. The list includes P5, P5e, P5en, P6-B200, P6-B300, P6e-GB200, Trn1, Trn2, Inf2,
            M9g, C9g and R9g; Trn3 and P6e-GB300 were not on it when read for this section. Check
            your types:
            <Cite s={S.ec2DataProtection} />
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{encryptionCheck}</pre>
          </Box>
          <Box variant="p">
            <strong>MIG on your GPU instance.</strong> List the driver&apos;s profiles with{' '}
            <code>nvidia-smi mig -lgip</code>
            <Cite s={S.migGettingStarted} /> and size the model to the slice you get. CUDA addresses
            at most 64 MIG instances across all GPUs, and <code>CUDA_VISIBLE_DEVICES</code> takes at
            most one compute-instance UUID per GPU instance.
            <Cite s={S.migDeviceNames} /> MIG needs driver R570 (570.133.20 or later) on B200, and
            CUDA 13 with R595 (595.58.03 or later) on GB300 in a DGX Station.
            <Cite s={S.migDeployment} />
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
