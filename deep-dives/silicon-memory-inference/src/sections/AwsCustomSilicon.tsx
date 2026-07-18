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
import { TrainiumChipDiagram } from '../components/TrainiumChipDiagram';

interface SiliconRow {
  silicon: string;
  cores: string;
  sbuf: string;
  hbm: string;
  notes: string;
}

const rows: SiliconRow[] = [
  {
    silicon: 'Trainium2 (Trn2)',
    cores: '8 NeuronCore-v3',
    sbuf: '28 MiB / NeuronCore-v3 (224 MiB / chip)',
    hbm: '96 GiB at 2.9 TB/s',
    notes: 'Trn2 UltraServer = 64 chips in 3D Torus over NeuronLink-v3',
  },
  {
    silicon: 'Inferentia2 (Inf2)',
    cores: '2 NeuronCore-v2 per chip',
    sbuf: '24 MiB / NeuronCore-v2',
    hbm: '32 GiB at 0.8 TB/s',
    notes: 'Inference-tuned sibling; production for Mixtral-class serving',
  },
];

export function AwsCustomSilicon() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Trainium and Inferentia — AWS-designed accelerators with compile-time scheduled determinism"
          >
            AWS Trainium, Inferentia, and Neuron silicon
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What AWS custom silicon is.</strong> Two product lines designed by
            Annapurna Labs for AWS: Trainium (training-optimized) and Inferentia
            (inference-optimized). Both share the same NeuronCore architecture
            family — a systolic array with explicit SBUF (state buffer) and PSUM
            (partial sum) scratchpads, plus dedicated CC-Cores (Collective
            Communication cores) for fabric-side collectives. The execution model is
            compile-time scheduled: the Neuron compiler emits a NEFF descriptor
            ahead of time, and the runtime walks it deterministically.
          </Box>
          <Box variant="p">
            <strong>Why this section sits where it does.</strong> Section 13 covered
            NVIDIA at the silicon level. This section is the AWS counterpart at the
            silicon level — the same kind of hardware deep dive, focused on what is
            in the package and how operands flow through it. Section 18 covers the
            compiler stack on top.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Schematic layout of a Trainium2 chip"
          >
            Inside a Trainium2 chip
          </Header>
        }
      >
        <SpaceBetween size="m">
          <TrainiumChipDiagram />
          <Box variant="p">
            Each Trainium2 chip ships 8 NeuronCore-v3 engines, 16 CC-Cores for
            collectives, and 96 GiB of HBM at 2.9 TB/s aggregate. Per NeuronCore-v3:
            28 MiB of SBUF and 2 MiB of PSUM. A NeuronCore-v3 is built around a
            systolic array; the Neuron compiler tiles operations to fit SBUF
            residency and emits a NEFF that the runtime plays back without a
            scheduler in the loop
            ({' '}
            <Link external href="https://awsdocs-neuron.readthedocs-hosted.com/">
              AWS Neuron SDK documentation
            </Link>
            , accessed 2026-04-23).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The four primitives that anchor Neuron silicon"
          >
            SBUF, PSUM, CC-Cores, NeuronLink
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">SBUF (State Buffer)</Box>
            <Box variant="p">
              The compiler-managed scratchpad that holds activations and weights for
              the systolic array. 28 MiB per NeuronCore-v3 — roughly two orders of
              magnitude larger than NVIDIA Hopper&apos;s 228 KB SMEM, because the
              compiler is responsible for everything that lives there and does not
              rely on a cache to make eviction decisions. SBUF residency is the
              first-order tuning variable for Neuron compiler output.
            </Box>
          </div>
          <div>
            <Box variant="h3">PSUM (Partial Sum)</Box>
            <Box variant="p">
              The output side of the systolic array. 2 MiB per NeuronCore-v3. Holds
              accumulated partial sums before they are written back. PSUM has a
              free-dim constraint (≤ 512) that the compiler must respect when tiling
              — a real limit that surfaces in NKI kernel authoring.
            </Box>
          </div>
          <div>
            <Box variant="h3">CC-Cores (Collective Communication cores)</Box>
            <Box variant="p">
              16 per chip on Trainium2. Dedicated silicon for collectives —
              all-reduce, all-gather, all-to-all. The CC-Cores handle the fabric
              side of distributed training and inference without occupying
              NeuronCore compute. The MoE all-to-all-v primitive (when it ships)
              will run here.
            </Box>
          </div>
          <div>
            <Box variant="h3">NeuronLink-v3</Box>
            <Box variant="p">
              The chip-to-chip fabric. 1.28 TB/s per chip intra-node, 256 GB/s per
              chip inter-instance. Trn2 UltraServer composes 64 chips into a 3D
              Torus, giving a single coherent domain for tensor-parallel and
              expert-parallel deployments. Cross-server HBM-to-HBM latency: 15 µs
              (vendor-cited).
            </Box>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two product lines, same NeuronCore family"
          >
            Trainium and Inferentia
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={rows}
            columnDefinitions={[
              { id: 'sil', header: 'Silicon', cell: (r) => r.silicon, minWidth: 200 },
              { id: 'cores', header: 'NeuronCores', cell: (r) => r.cores },
              { id: 'sbuf', header: 'SBUF', cell: (r) => r.sbuf },
              { id: 'hbm', header: 'HBM', cell: (r) => r.hbm },
              { id: 'notes', header: 'Notes', cell: (r) => r.notes },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            All numbers track the AWS Neuron documentation, accessed 2026-04-23.
            Trainium3 (Trn3) is announced; full per-chip specifications were not
            directly verified in the pages fetched for this iteration and remain
            UNKNOWN here pending datasheet publication.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The properties that make Trainium architecturally distinct from a GPU"
          >
            What Trainium is, that a GPU is not
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Compile-time scheduling.</strong> The Neuron compiler emits the
            entire schedule into the NEFF binary. There is no warp scheduler, no
            occupancy decision, no runtime branching among ready warps. The runtime
            executes the NEFF deterministically — same NEFF, same input, same silicon
            produces the same output in the same order. This is the property that
            makes Trainium a candidate for regulated workloads where reproducibility
            is a first-class requirement.
          </Box>
          <Box variant="p">
            <strong>Software-managed memory throughout.</strong> No L1, L2, L3
            caches in the conventional sense. SBUF and PSUM are scratchpads. The
            compiler decides what is resident at each moment. There is no
            cache-coherence protocol to participate in across NeuronCores; the
            schedule says where everything is.
          </Box>
          <Box variant="p">
            <strong>Dedicated collective silicon.</strong> CC-Cores carry collectives
            without contending with compute. On a GPU, NCCL collectives run as kernels
            on the same SMs that run the model — competing for resources. On
            Trainium, collectives run on dedicated silicon.
          </Box>
          <Alert type="warning" header="The MoE all-to-all gap">
            Trainium MoE NKI kernels (Router Top-K, MoE CTE, MoE TKG, Blockwise
            Matmul) shipped in Neuron 2.27.0 (December 2025). Expert parallelism
            today uses All-Gather rather than All-to-All-v. The All-to-All-v
            primitive (<code>torch.all_to_all_vdev_2d</code>) is on the roadmap as of
            Neuron 2.29
            ({' '}
            <Link external href="https://awsdocs-neuron.readthedocs-hosted.com/en/latest/release-notes/">
              Neuron release notes
            </Link>
            , accessed 2026-04-23). For MoE workloads in 2026 this is a real and
            citeable gap relative to NVIDIA NCCL with MNNVL.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What ships on EC2"
          >
            Trainium and Inferentia on AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Trn2 UltraServer</Box>
              <Box variant="p">
                64 Trainium2 chips in a single coherent 3D Torus over NeuronLink-v3.
                The headline AWS frontier-training and large-MoE-inference platform.
              </Box>
            </div>
            <div>
              <Box variant="h3">Trn2 / Trn1</Box>
              <Box variant="p">
                Standard 8-chip Trainium2 instance (Trn2) and the previous-gen
                Trainium1 instance (Trn1). General training workloads at sub-frontier
                scale.
              </Box>
            </div>
            <div>
              <Box variant="h3">Inf2</Box>
              <Box variant="p">
                Inferentia2 — production inference for medium-class models. The
                fleet that handled SageMaker hosted endpoints and Bedrock inference
                paths before Trainium2 inference matured.
              </Box>
            </div>
          </ColumnLayout>
          <ExpandableSection headerText="Where Trainium wins, where it does not">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Wins.</strong> Reproducibility-required workloads (regulated
                finance, healthcare audit). High-throughput training where the model
                fits the Neuron compiler&apos;s tiling well. Cost-sensitive inference
                serving on Mixtral / Llama / Qwen-class models with stable
                graph shapes.
              </Box>
              <Box variant="p">
                <strong>Watch out.</strong> MoE workloads that need All-to-All-v
                today (NVIDIA NCCL is more mature). Models with highly dynamic
                graphs that defeat NEFF caching. Workloads that depend on a CUDA-
                specific kernel for which there is no NKI equivalent yet.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
