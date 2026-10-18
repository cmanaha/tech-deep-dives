import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { TrainiumChipDiagram, TrainiumFabricDiagram } from '../components/TrainiumChipDiagram';
import { Cite } from '../components/Cite';
import { S } from '../sources/AwsCustomSilicon';

interface SiliconRow {
  silicon: string;
  cores: React.ReactNode;
  sbuf: React.ReactNode;
  hbm: React.ReactNode;
}

const rows: SiliconRow[] = [
  {
    silicon: 'Trainium2 (Trn2)',
    cores: (
      <>
        8 NeuronCore-v3
        <Cite s={S.trainium2Arch} />
      </>
    ),
    sbuf: (
      <>
        28 MiB per core, 224 MiB per chip
        <Cite s={S.nkiTrn2Arch} />
        <Cite s={S.trainium2Arch} />
      </>
    ),
    hbm: (
      <>
        96 GiB at 2.9 TB/s
        <Cite s={S.trainium2Arch} />
      </>
    ),
  },
  {
    silicon: 'Trainium3 (Trn3)',
    cores: (
      <>
        8 NeuronCore-v4
        <Cite s={S.trainium3Arch} />
      </>
    ),
    sbuf: (
      <>
        32 MiB per core, 256 MiB per chip
        <Cite s={S.nkiTrn3Arch} />
        <Cite s={S.trainium3Arch} />
      </>
    ),
    hbm: (
      <>
        144 GiB at 4.9 TB/s
        <Cite s={S.trainium3Arch} />
      </>
    ),
  },
  {
    silicon: 'Inferentia2 (Inf2)',
    cores: (
      <>
        2 NeuronCore-v2
        <Cite s={S.inferentia2Arch} />
      </>
    ),
    sbuf: (
      <>
        24 MiB per core
        <Cite s={S.nkiTrnInf2Arch} />
      </>
    ),
    hbm: (
      <>
        32 GiB at 820 GiB/s
        <Cite s={S.inferentia2Arch} />
      </>
    ),
  },
];

export function AwsCustomSilicon() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="What a Trainium chip holds, why Trn3's switched fabric changes how mixture-of-experts (MoE) models exchange tokens, and which chips current Neuron releases serve"
          >
            AWS Trainium, Inferentia and Neuron
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What it is.</strong> Trainium and Inferentia are AWS&apos;s accelerators, both
            built from NeuronCores: four engines (Tensor, Vector, Scalar and GPSIMD, a
            general-purpose SIMD engine) around software-managed on-chip SRAM, with a systolic
            array as the Tensor engine.
            <Cite s={S.neuronCoreV3} />
          </Box>
          <Box variant="p">
            <strong>How it differs from a GPU.</strong> The Neuron compiler fixes memory
            allocation and instruction order ahead of time in a NEFF (Neuron Executable File
            Format)
            <Cite s={S.nkiOverview} />, so no warp scheduler picks work at run time; dynamic
            shapes and control flow still run, through ISA (instruction set architecture)
            extensions on Trainium2 and Trainium3.
            <Cite s={S.trainium2Arch} />
            <Cite s={S.trainium3Arch} /> The two on-chip scratchpads, SBUF (State Buffer) and
            PSUM (Partial Sum buffer), are software-managed: the compiler or an NKI (Neuron
            Kernel Interface) kernel decides what sits in them.
            <Cite s={S.nkiTrnInf2Arch} />
            <Cite s={S.neuronCoreV3} /> <em>AWS Compilers and Kernel Tooling</em> covers both.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where operands live, and the buffer sizes a kernel's tiles have to fit"
          >
            Inside a Trainium2 chip
          </Header>
        }
      >
        <SpaceBetween size="m">
          <TrainiumChipDiagram />
          <Box variant="small" color="text-body-secondary">
            Cores, CC-Cores (Collective Communication cores) and HBM (High Bandwidth Memory)
            <Cite s={S.trainium2Arch} />; SBUF and PSUM
            <Cite s={S.nkiTrn2Arch} />; NeuronLink-v3
            <Cite s={S.trn2Arch} />. The HBM blocks do not show the stack count.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">SBUF</Box>
              <Box variant="p">
                Feeds the Tensor engine: 28 MiB per NeuronCore-v3 and 32 MiB per NeuronCore-v4
                <Cite s={S.nkiTrn2Arch} />
                <Cite s={S.nkiTrn3Arch} />, about 126 times the 228 KB of shared memory in a
                Hopper SM (Streaming Multiprocessor).
                <Cite s={S.hopperTuningGuide} />
                <Cite s={S.nkiTrn2Arch} kind="derived" note="28 MiB / 228 KB, with 1 KB = 1,024 bytes: about 126." />
              </Box>
            </div>
            <div>
              <Box variant="h3">PSUM</Box>
              <Box variant="p">
                The Tensor engine&apos;s accumulator, 2 MiB per NeuronCore on both chips.
                <Cite s={S.nkiTrn2Arch} />
                <Cite s={S.nkiTrn3Arch} /> It caps the matmul tile: the moving tile&apos;s free
                dimension stops at 512 elements on NeuronCore-v2 and v3, and at 4,096 FP32 or
                8,192 BF16 elements (eight PSUM banks) on NeuronCore-v4.
                <Cite s={S.ncMatmul} /> A wider tile written for Trainium3 has to be split for
                Trainium2.
              </Box>
            </div>
            <div>
              <Box variant="h3">CC-Cores</Box>
              <Box variant="p">
                16 per chip on Trainium2 and Trainium3.
                <Cite s={S.trainium2Arch} />
                <Cite s={S.trainium3Arch} /> They are dedicated synchronization processors that
                decide when the data movement engines transfer data at each step of a collective;
                the engines move the bytes.
                <Cite s={S.collectives} /> On a GPU, NCCL (NVIDIA Collective Communications
                Library) collectives mostly run on the SMs that also run the model.
                <Cite
                  s={S.ncclV2283}
                  note="NCCL 2.28 added copy-engine collectives for all-to-all, all-gather, gather and scatter inside one (MN)NVLink domain to reduce SM use. They are opt-in: register buffers into symmetric windows and set NCCL_CTA_POLICY_ZERO."
                />
              </Box>
            </div>
            <div>
              <Box variant="h3">NeuronLink-v3</Box>
              <Box variant="p">
                1,024 GB/s per chip to the chips in its instance, plus 256 GB/s per chip to the
                other instances of a Trn2 UltraServer.
                <Cite s={S.trn2Arch} /> A Ring collective hop inside an instance takes about 1 to
                2 µs, depending on HBM load.
                <Cite s={S.intranodeCollectives} /> Between Trn2 servers over EFA (Elastic Fabric
                Adapter), not NeuronLink, a minimal HBM-to-HBM packet takes 15 µs in
                ib_write_lat.
                <Cite s={S.collectives} kind="measured" />
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The per-chip memory and buffer sizes to fit a model against, generation by generation"
          >
            Trainium2, Trainium3 and Inferentia2
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={rows}
            columnDefinitions={[
              { id: 'sil', header: 'Silicon', cell: (r) => r.silicon, minWidth: 140 },
              { id: 'cores', header: 'NeuronCores', cell: (r) => r.cores, minWidth: 150 },
              { id: 'sbuf', header: 'SBUF', cell: (r) => r.sbuf, minWidth: 200 },
              { id: 'hbm', header: 'HBM', cell: (r) => r.hbm, minWidth: 170 },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="p">
            <em>Roofline and Arithmetic Intensity</em> sets these bandwidths against each
            chip&apos;s compute. Trainium4 is on the roadmap: AWS claims at least 6x
            Trainium3&apos;s FP4 performance and 4x its memory bandwidth, with NVIDIA NVLink Fusion
            support; this research found no date or specification sheet.
            <Cite s={S.trainium3AboutAmazon} kind="roadmap" />
          </Box>
          <ExpandableSection headerText="Trainium3's chip-to-chip bandwidth appears three ways">
            <Box variant="p">
              AWS pages give Trainium3&apos;s NeuronLink-v4 as 2.56 TB/s
              <Cite s={S.trainium3Arch} />, 2,048 GiB/s
              <Cite s={S.trn3Arch} /> and 2 TB/s
              <Cite s={S.trn3Page} /> per chip. The per-level figures this section uses sum to
              704 GB/s, bidirectional per chip.
              <Cite s={S.trn3Arch} kind="derived" note="256 + 320 + 128 = 704 GB/s, bidirectional per chip." />
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Trn2 links each chip directly to 6 of the other 63, Trn3 links it to switches, and that decides where an expert group belongs"
          >
            MoE on Trainium: from a torus to switches
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An MoE layer dispatches tokens to the chips that hold their experts and combines the
            results back: two all-to-all exchanges
            <Cite s={S.pytorchNative} />, in which every chip sends to every other chip.
            <Cite s={S.intranodeCollectives} /> The path between every pair of chips counts.{' '}
            <em>Mixture of Experts and Sparse Activation</em> covers the routing.
          </Box>
          <Box variant="p">
            <strong>Trn2 is a torus.</strong> A trn2.48xlarge links 16 chips in a 4x4 2D torus,
            each to four neighbours; a Trn2 UltraServer joins four instances and rings
            same-position chips together, two more neighbours.
            <Cite s={S.trn2Arch} />
            <Cite s={S.collectives} /> A chip has direct links to 6 of the other 63 chips
            <Cite s={S.collectives} kind="derived" note="4 torus neighbours in the instance plus 2 on the ring across instances, out of 63 other chips in a 64-chip UltraServer." />
            ; traffic to the rest is routed through chips in between, which over-subscribes
            links.
            <Cite s={S.intranodeCollectives} />
          </Box>
          <Box variant="p">
            <strong>Trn3 is switched.</strong> A PCIe switch-based interconnect (NeuronSwitch-v1)
            carries all chip-to-chip traffic, replacing Trn2&apos;s point-to-point NeuronLink
            topology. In the layout the Trn3 page describes, four chips share a switch in their
            server (256 GB/s per chip), switches join a rack&apos;s servers (320 GB/s), and a
            direct link reaches the same-position chip in another rack (128 GB/s), all
            bidirectional.
            <Cite s={S.trn3Arch} /> AWS describes this all-to-all topology as optimized for MoE
            models.
            <Cite s={S.trn3Arch} />
          </Box>
          <TrainiumFabricDiagram />
          <Box variant="small" color="text-body-secondary">
            Trn2 topology and routing
            <Cite s={S.collectives} />
            <Cite s={S.trn2Arch} />
            <Cite s={S.intranodeCollectives} />; Trn3 layouts and bandwidths
            <Cite s={S.trn3Arch} />. Trn3 is drawn with four chips per server (the Gen2 layout);
            the page gives no rack size. Each orange route is one example.
          </Box>
          <Box variant="p">
            <strong>Placing experts</strong> (our reading of these figures). A Trn2 chip has four
            times the NeuronLink bandwidth inside its instance as across instances, so an
            expert-parallel group that fits on one instance&apos;s 16 chips keeps dispatch off the
            slower links.
            <Cite s={S.trn2Arch} kind="derived" note="1,024 GB/s inside the instance against 256 GB/s across instances, per chip." />{' '}
            On Trn3 the narrowest path is between racks, 128 GB/s per chip against 256 or 320
            inside one.
            <Cite s={S.trn3Arch} kind="derived" /> The Trn3 page gives no rack chip count, so
            confirm it with AWS before sizing a group that may span racks.
          </Box>
          <Alert type="info" header="How to get MoE dispatch right on Trainium">
            Use the collectives that ship: Neuron Runtime AllToAllV on Trn2 and Trn3 from Neuron
            2.32.0,{' '}
            <code>nki.collectives.all_to_all_v</code> from 2.29.0, NKI Library MoE kernels such
            as Router Top-K from 2.28.0, and Wide-EP (wide expert parallelism) in vLLM Neuron, a
            beta.
            <Cite s={S.neuronWhatsNew} /> The gap left is PyTorch&apos;s native dispatch and combine ops
            (<code>torch.all_to_all_vdev_2d</code> and its <code>_offset</code> variant), which
            TorchNeuron, a closed beta, lists for future releases; it matters only to code written
            against TorchNeuron.
            <Cite s={S.pytorchNative} /> <em>AWS Compilers and Kernel Tooling</em> covers vLLM
            Neuron and NKI.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which instance to ask for, and which Neuron release still serves it"
          >
            Trainium and Inferentia on AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Trn3 UltraServer</Box>
              <Box variant="p">
                Generally available since 2 December 2025.
                <Cite s={S.trn3WhatsNew} /> Gen1: 64 chips, 9,216 GiB of HBM at 313.6 TB/s.
                Gen2: 144 chips, 20,736 GiB at 705.6 TB/s, 362 dense MXFP8 (microscaling FP8)
                PFLOPS.
                <Cite s={S.trn3Arch} /> AWS claims up to 4.4x a Trn2 UltraServer&apos;s
                performance.
                <Cite s={S.trn3WhatsNew} kind="vendor-claim" /> The EC2 instance specification
                lists no Trn3 instance type.
                <Cite s={S.ec2AcceleratedSpecs} />
              </Box>
            </div>
            <div>
              <Box variant="h3">Trn2 UltraServer and Trn2</Box>
              <Box variant="p">
                The previous generation: four trn2u.48xlarge instances, 64 Trainium2 chips and
                6,144 GiB of HBM in one NeuronLink 3D torus.
                <Cite s={S.trn2Arch} />
                <Cite s={S.collectives} /> A trn2.48xlarge has 16 chips, a trn2.3xlarge one.
                <Cite s={S.ec2AcceleratedSpecs} />
              </Box>
            </div>
            <div>
              <Box variant="h3">Trn1 and Inf2</Box>
              <Box variant="p">
                Both remain on EC2.
                <Cite s={S.ec2AcceleratedSpecs} /> NxD Inference (NeuronX Distributed Inference)
                dropped them in Neuron 2.29.0, so serving either with it pins to Neuron 2.28;
                vLLM Neuron serves Trn2 and Trn3.
                <Cite s={S.neuronWhatsNew} /> This research found no announced Inferentia
                successor.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>Before you commit a model to a target</strong>, check that vLLM Neuron serves
            the chip, which links your expert group crosses, and, when runs must match, that{' '}
            <code>NEURON_RT_STOCHASTIC_ROUNDING_SEED</code> is fixed
            <Cite
              s={S.neuronEnvVars}
              note="NEURON_RT_STOCHASTIC_ROUNDING_SEED: set to a fixed value to ensure reproducibility between runs."
            />
            , because both Trainium generations let you choose stochastic rounding.
            <Cite s={S.trainium2Arch} />
            <Cite s={S.trainium3Arch} /> <em>Determinism: NEFF and GPU Reproducibility</em>{' '}
            covers the rest.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
