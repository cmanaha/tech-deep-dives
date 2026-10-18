import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { HbmStackDiagram } from '../components/HbmStackDiagram';
import { Cite } from '../components/Cite';
import { S } from '../sources/HbmAndBandwidthWall';

const ratioNote = '4.8 / 3.35 = 1.43 for bandwidth; 141 / 80 = 1.76 for capacity.';

const sparseNote =
  'NVIDIA lists FP8 at 3,958 TFLOPS "With sparsity" on both GPUs. Its Hopper architecture blog gives dense and sparse Tensor Core peaks at a 1:2 ratio, so dense is 1,979.';

const nvlinkNote =
  'NVIDIA lists 900 GB/s per GPU; its Blackwell Ultra blog gives Hopper NVLink as 900 GB/s bidirectional, 450 GB/s each way.';

const sweepNote = 'Sweeps per second: bandwidth divided by capacity.';

interface HbmRow {
  id: string;
  chip: React.ReactNode;
  gen: React.ReactNode;
  capacity: React.ReactNode;
  bandwidth: React.ReactNode;
  sweeps: React.ReactNode;
}

const rows: HbmRow[] = [
  {
    id: 'h100',
    chip: 'NVIDIA H100 SXM',
    gen: 'HBM3',
    capacity: (
      <>
        80 GB
        <Cite s={S.h100Page} />
      </>
    ),
    bandwidth: (
      <>
        3.35 TB/s
        <Cite s={S.h100Page} />
      </>
    ),
    sweeps: (
      <>
        42
        <Cite s={S.h100Page} kind="derived" note={`${sweepNote} 3.35 TB/s / 80 GB = 41.9.`} />
      </>
    ),
  },
  {
    id: 'h200',
    chip: 'NVIDIA H200 SXM',
    gen: 'HBM3e',
    capacity: (
      <>
        141 GB
        <Cite s={S.h200Page} />
      </>
    ),
    bandwidth: (
      <>
        4.8 TB/s
        <Cite s={S.h200Page} />
      </>
    ),
    sweeps: (
      <>
        34
        <Cite s={S.h200Page} kind="derived" note={`${sweepNote} 4.8 TB/s / 141 GB = 34.0.`} />
      </>
    ),
  },
  {
    id: 'b200',
    chip: 'NVIDIA B200',
    gen: (
      <>
        HBM3e
        <Cite s={S.blackwellTuningGuide} />
      </>
    ),
    capacity: (
      <>
        Up to 180 GB
        <Cite s={S.blackwellTuningGuide} />
      </>
    ),
    bandwidth: (
      <>
        8 TB/s
        <Cite
          s={S.dgxB200}
          kind="derived"
          note="DGX B200 lists 64 TB/s of HBM3e bandwidth across 8 GPUs; 64 / 8 = 8 TB/s."
        />
      </>
    ),
    sweeps: (
      <>
        44
        <Cite s={S.dgxB200} kind="derived" note={`${sweepNote} 8 TB/s / 180 GB = 44.4.`} />
      </>
    ),
  },
  {
    id: 'b300',
    chip: 'NVIDIA B300',
    gen: (
      <>
        HBM3e, eight 12-high stacks
        <Cite s={S.blackwellUltraBlog} />
      </>
    ),
    capacity: (
      <>
        288 GB
        <Cite s={S.blackwellUltraBlog} />
      </>
    ),
    bandwidth: (
      <>
        8 TB/s
        <Cite s={S.blackwellUltraBlog} />
      </>
    ),
    sweeps: (
      <>
        28
        <Cite s={S.blackwellUltraBlog} kind="derived" note={`${sweepNote} 8 TB/s / 288 GB = 27.8.`} />
      </>
    ),
  },
  {
    id: 'rubin',
    chip: 'NVIDIA Rubin',
    gen: 'HBM4',
    capacity: (
      <>
        288 GB
        <Cite s={S.hgxPage} />
      </>
    ),
    bandwidth: (
      <>
        22 TB/s
        <Cite s={S.hgxPage} note="Individual GPU Specifications table: 288 GB HBM4 | 22 TB/s." />
      </>
    ),
    sweeps: (
      <>
        76
        <Cite s={S.hgxPage} kind="derived" note={`${sweepNote} 22 TB/s / 288 GB = 76.4.`} />
      </>
    ),
  },
  {
    id: 'mi355x',
    chip: 'AMD Instinct MI355X',
    gen: (
      <>
        HBM3E
        <Cite s={S.amdMi355x} />
      </>
    ),
    capacity: (
      <>
        288 GB
        <Cite s={S.amdMi355x} />
      </>
    ),
    bandwidth: (
      <>
        8 TB/s
        <Cite s={S.amdMi355x} />
      </>
    ),
    sweeps: (
      <>
        28
        <Cite s={S.amdMi355x} kind="derived" note={`${sweepNote} 8 TB/s / 288 GB = 27.8.`} />
      </>
    ),
  },
  {
    id: 'mi455x',
    chip: (
      <>
        AMD Instinct MI455X
        <Cite
          s={S.amdMi455x}
          kind="roadmap"
          note="AMD lists a launch date of 7/23/2026. This research located no shipment confirmation."
        />
      </>
    ),
    gen: (
      <>
        HBM4, 12 stacks
        <Cite s={S.amdMi455x} />
      </>
    ),
    capacity: (
      <>
        432 GB
        <Cite s={S.amdMi455x} />
      </>
    ),
    bandwidth: (
      <>
        23.3 TB/s
        <Cite s={S.amdMi455x} />
      </>
    ),
    sweeps: (
      <>
        54
        <Cite s={S.amdMi455x} kind="derived" note={`${sweepNote} 23.3 TB/s / 432 GB = 53.9.`} />
      </>
    ),
  },
  {
    id: 'trn3',
    chip: 'AWS Trainium3',
    gen: (
      <>
        Not on AWS&apos;s Trainium3 page
        <Cite s={S.trainium3Arch} />
      </>
    ),
    capacity: (
      <>
        144 GiB
        <Cite s={S.trainium3Arch} />
      </>
    ),
    bandwidth: (
      <>
        4.9 TB/s
        <Cite s={S.trainium3Arch} />
      </>
    ),
    sweeps: (
      <>
        32
        <Cite
          s={S.trainium3Arch}
          kind="derived"
          note={`${sweepNote} 144 GiB = 154.6 GB; 4.9 TB/s / 154.6 GB = 31.7.`}
        />
      </>
    ),
  },
  {
    id: 'tpu7x',
    chip: 'Google TPU7x (Ironwood)',
    gen: (
      <>
        Not on Google&apos;s TPU7x page
        <Cite s={S.tpu7x} />
      </>
    ),
    capacity: (
      <>
        192 GiB
        <Cite s={S.tpu7x} />
      </>
    ),
    bandwidth: (
      <>
        7,380 GB/s
        <Cite s={S.tpu7x} />
      </>
    ),
    sweeps: (
      <>
        36
        <Cite
          s={S.tpu7x}
          kind="derived"
          note={`${sweepNote} 192 GiB = 206.2 GB; 7,380 GB/s / 206.2 GB = 35.8.`}
        />
      </>
    ),
  },
];

export function HbmAndBandwidthWall() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Bandwidth sets how long each decode step takes and capacity sets how many requests share it: the two numbers to read off any accelerator's memory spec"
          >
            HBM and the Bandwidth Wall
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            HBM (High Bandwidth Memory) is DRAM (dynamic random-access memory) built for width:
            DRAM dies stacked on a base logic die, joined by TSVs (through-silicon vias), beside
            the accelerator on its package.
            <Cite s={S.jedecHbm3} />
            <Cite s={S.samsungHbm4} /> Every decode step reads the weights and the KV (key-value)
            cache from it (<em>Roofline and Arithmetic Intensity</em>).
          </Box>
          <Box variant="p">
            <strong>Two numbers, two jobs.</strong> Bandwidth sets the step time: a step reads
            the weights once for the batch plus each sequence&apos;s KV cache, and takes at least
            those bytes over the bandwidth. Capacity sets the batch: HBM left after the weights
            holds KV cache, and every sequence there shares the weight read. Throughput is batch
            over step time, so both move it. H200 shows both: 1.43x H100&apos;s bandwidth and 4x
            the batch gave NVIDIA&apos;s 1.9x rating.
            <Cite s={S.h200Page} kind="vendor-claim" />
            <Cite s={S.h200Page} kind="derived" note={ratioNote} />
          </Box>
          <Box variant="p">
            <strong>Why it is a wall.</strong> Both levers are packaging work. Bandwidth means
            faster signalling on every data wire, and a B300 has 8,192 of them.
            <Cite
              s={S.blackwellUltraBlog}
              note="HBM configuration: eight 12-Hi stacks, 16 x 512-bit controllers (8,192-bit total width)."
            />{' '}
            Capacity means taller stacks, or more of them around the die. SK hynix reports
            &quot;customer demand exceeds supply capabilities&quot;.
            <Cite s={S.skhynixQ2} />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="H200 kept H100's compute and ran 4x the batch to reach 1.9x, so compare chips at the batch each one holds"
          >
            The two levers, observed
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">What stayed the same</Box>
              <ul>
                <li>
                  FP8 Tensor Core peak, 1,979 TFLOPS dense
                  <Cite s={S.h100Page} note={sparseNote} />
                  <Cite s={S.h200Page} note={sparseNote} />
                  <Cite s={S.hopperArchBlog} kind="derived" note={sparseNote} />
                </li>
                <li>
                  NVLink, 900 GB/s bidirectional
                  <Cite s={S.h100Page} />
                  <Cite s={S.h200Page} />
                  <Cite s={S.blackwellUltraBlog} note={nvlinkNote} />
                </li>
                <li>
                  Power, up to 700 W
                  <Cite s={S.h100Page} />
                  <Cite s={S.h200Page} />
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">What changed</Box>
              <ul>
                <li>HBM3 to HBM3e</li>
                <li>
                  80 GB to 141 GB (1.76x)
                  <Cite s={S.h200Page} kind="derived" note={ratioNote} />
                </li>
                <li>
                  3.35 TB/s to 4.8 TB/s (1.43x)
                  <Cite s={S.h200Page} kind="derived" note={ratioNote} />
                </li>
              </ul>
            </div>
          </ColumnLayout>
          <Box variant="p">
            NVIDIA rates H200 at 1.9x H100 on Llama 2 70B and 1.6x on GPT-3 175B, with H200 at
            the larger batch: 32 against 8 on one GPU, and 128 against 64 on eight.
            <Cite s={S.h200Page} kind="vendor-claim" /> At a fixed batch, 1.43x the bandwidth caps
            the gain at 1.43x. The rest is the batch the extra 61 GB holds: 4x the sequences
            share each read of the weights.
            <Cite s={S.h200Page} kind="derived" note="141 GB - 80 GB = 61 GB; batch 32 / 8 = 4x." />{' '}
            The Llama run used 2K input and 128 output tokens, so prefill is in the measurement too.
            <Cite s={S.h200Page} /> <em>NVIDIA Hopper</em> takes the result apart further.
          </Box>
          <Box variant="p">
            <strong>Compare chips at the batch each one holds.</strong> A benchmark at one shared
            batch measures the bandwidth ratio alone. Check which kind a vendor comparison ran
            before reading its ratio.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Capacity, bandwidth and how many times a second each chip can read its whole memory, the three figures that size decode"
          >
            Per-chip HBM on current accelerators
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={rows}
            trackBy="id"
            columnDefinitions={[
              { id: 'chip', header: 'Accelerator', cell: (r) => r.chip, minWidth: 170 },
              { id: 'gen', header: 'HBM generation', cell: (r) => r.gen, minWidth: 150 },
              { id: 'cap', header: 'Capacity', cell: (r) => r.capacity, minWidth: 110 },
              { id: 'bw', header: 'Bandwidth', cell: (r) => r.bandwidth, minWidth: 120 },
              { id: 'sweeps', header: 'Sweeps per second', cell: (r) => r.sweeps, minWidth: 110 },
            ]}
            variant="embedded"
            wrapLines
          />
          <ExpandableSection headerText="Which Rubin bandwidth figure the table uses">
            <Box variant="p">
              22 TB/s, from the HGX page&apos;s individual-GPU table, as in <em>Roofline and
              Arithmetic Intensity</em>. NVIDIA&apos;s Vera Rubin NVL72 page gives 19.2 TB/s per
              GPU, and the HGX Rubin NVL8 board 130 TB/s across eight, 16.25 each.
              <Cite s={S.hgxPage} />
              <Cite s={S.veraRubinNvl72} />
              <Cite s={S.hgxPage} kind="derived" note="130 TB/s / 8 = 16.25 TB/s." />
            </Box>
          </ExpandableSection>
          <Box variant="p">
            <strong>Sweeps per second</strong> is bandwidth over capacity. With memory full of
            weights and KV cache, it caps decode steps per second, and so each sequence&apos;s
            tokens per second. Capacity raises the batch and lowers that cap: a full B300, 1.6x
            B200&apos;s memory at the same 8 TB/s, sweeps 28 times a second to B200&apos;s 44.
            <Cite s={S.blackwellUltraBlog} kind="derived" note="288 GB / 180 GB = 1.6; 8 TB/s / 288 GB = 27.8; 8 TB/s / 180 GB = 44.4." />{' '}
            MI455X and Rubin set the levers apart: bandwidth within 6%, capacity 1.5x.
            <Cite s={S.amdMi455x} kind="derived" note="23.3 / 22 TB/s = 1.06; 432 / 288 GB = 1.5. MI455X has a 7/23/2026 launch date and no located shipment confirmation." />
            <Cite s={S.hgxPage} />
          </Box>
          <Box variant="p">
            <em>High Bandwidth Flash</em> covers the capacity-first sibling of this DRAM table,
            NAND in an HBM-like stack, which trades sweeps per second for capacity.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Width, not pin speed, is what makes a stack fast, and the reason it has to sit next to the die"
          >
            What HBM looks like, physically
          </Header>
        }
      >
        <SpaceBetween size="m">
          <HbmStackDiagram />
          <Box variant="small" color="text-body-secondary">
            Per-stack figures are width times pin rate, our arithmetic on the standards
            <Cite s={S.jedecHbm3} />
            <Cite s={S.jedecHbm4} /> and vendor figures
            <Cite s={S.samsungHbm4} kind="vendor-claim" />
            <Cite s={S.micronHbm4} kind="vendor-claim" />; stack height and capacity
            <Cite s={S.samsungHbm4} />
            <Cite s={S.micronHbm4} />; B300 wires
            <Cite s={S.blackwellUltraBlog} />.
          </Box>
          <Box variant="p">
            An HBM3 stack drives 1,024 data bits through 16 channels at up to 6.4 Gb/s per pin,
            819 GB/s per stack.
            <Cite
              s={S.jedecHbm3}
              note="JEDEC gives 16 channels and 6.4 Gb/s, 819 GB/s per device; 819.2 GB/s x 8 / 6.4 Gb/s = 1,024 data bits."
            />{' '}
            HBM4 doubles that to 2,048 bits in 32 channels.
            <Cite s={S.jedecHbm4} /> A DDR5 (Double Data Rate 5) DIMM (dual in-line memory module)
            channel carries 64 data bits
            <Cite
              s={S.epyc9755Page}
              kind="derived"
              note="614 GB/s per socket over 12 DDR5-6400 channels: 614 / 12 / 6.4 GT/s = 8 bytes, 64 bits, per transfer."
            />
            <Cite s={S.epyc9005Datasheet} /> at up to 8,800 Mb/s per pin
            <Cite s={S.jedecDdr5c} />, so width is the difference: an HBM4 stack is 32 DDR5
            channels wide.
            <Cite s={S.jedecHbm4} kind="derived" note="2,048 / 64 = 32." /> Wires that dense need
            silicon under them rather than an organic substrate, which keeps HBM on the package.
            <Cite s={S.jedecSphbm4} />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="HBM4 doubled the width and shipping parts run past the standard's pin rate, so size with each accelerator's own bandwidth"
          >
            How HBM4 adds bandwidth
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Standard and shipping parts.</strong> JESD270-4 sets HBM4 at 2,048 bits and up
            to 8 Gb/s per pin, 2 TB/s per stack, in stacks of 4 to 16 dies of up to 64 GB.
            <Cite s={S.jedecHbm4} /> All three DRAM makers ship it in volume: Samsung from February
            2026, Micron from the first quarter, SK hynix from the second.
            <Cite s={S.samsungHbm4} />
            <Cite s={S.micronHbm4} />
            <Cite s={S.skhynixQ2} /> Their pins run past the standard: Samsung&apos;s at 11.7 Gb/s
            and up to 13, for up to 3.3 TB/s per stack; Micron&apos;s above 11 Gb/s and 2.8 TB/s;
            SK hynix quotes over 2.8 TB/s.
            <Cite s={S.samsungHbm4} kind="vendor-claim" />
            <Cite s={S.micronHbm4} kind="vendor-claim" />
            <Cite s={S.skhynixHbm4} kind="vendor-claim" /> Samsung and Micron ship 12-high stacks
            of up to 36 GB; Micron samples 16-high, 48 GB.
            <Cite s={S.samsungHbm4} />
            <Cite s={S.micronHbm4} />
          </Box>
          <Box variant="p">
            <strong>B300 and MI455X run their stacks below the parts&apos; best rates.</strong>{' '}
            B300 moves 8 TB/s over 8,192 bits of HBM3e, about 7.8 Gb/s per pin, against
            Samsung&apos;s 9.6 Gb/s HBM3E maximum.
            <Cite s={S.blackwellUltraBlog} kind="derived" note="8 TB/s x 8 bits / 8,192 pins = 7.8 Gb/s." />
            <Cite s={S.samsungHbm4} kind="vendor-claim" /> MI455X spreads 23.3 TB/s over 12 HBM4
            stacks, about 1.9 TB/s and 36 GB each, near the JEDEC 8 Gb/s bin.
            <Cite
              s={S.amdMi455x}
              kind="derived"
              note="23.3 / 12 = 1.94 TB/s and 432 / 12 = 36 GB per stack; 1.94 TB/s x 8 / 2,048 = 7.6 Gb/s per pin."
            />{' '}
            A memory maker&apos;s per-stack figure is a ceiling, never the accelerator&apos;s number.
          </Box>
          <Box variant="p">
            <strong>Packaging is the other half.</strong> JESD330-4, published in June 2026, defines SPHBM4 (Standard
            Package HBM4): 512 data signals at 4:1 serialization for HBM4-level throughput, at a
            bump pitch an organic substrate can take.
            <Cite s={S.jedecJc422} />
            <Cite s={S.jedecSphbm4} /> It trades width back for signalling speed to get off the
            silicon interposer.
          </Box>
          <Box variant="p">
            <strong>HBM4E.</strong> SK hynix shipped 12-high HBM4E samples in June 2026: up to 16
            Gb/s per pin, 48 GB.
            <Cite s={S.skhynixHbm4e} kind="roadmap" /> As of October 2026, JEDEC&apos;s HBM
            committee lists no HBM4E standard among its published documents.
            <Cite s={S.jedecJc422} />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Prefill and training lean on FLOPS and fabric, so check arithmetic intensity before paying for bandwidth"
          >
            When bandwidth is not the limit
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Prefill reuses each weight read across every prompt token, so it runs above the ridge,
            is compute-bound on H100- and H200-class chips (<em>Roofline and Arithmetic
            Intensity</em>) and gains less than proportionally from extra bandwidth.
            <Cite s={S.distServe} /> Training mixes compute-bound and bandwidth-bound phases, and
            at scale its step time also rides on the scale-out fabric: NVLink between GPUs, EFA
            (Elastic Fabric Adapter) between instances.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Each route swaps the bandwidth wall for a different limit; pick the one your workload can live with"
          >
            Three routes around the wall
          </Header>
        }
      >
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="h3">Keep the weights in SRAM</Box>
            <Box variant="p">
              Cerebras&apos;s WSE-3 (Wafer-Scale Engine 3) holds the weights in 44 GB of on-wafer
              SRAM (static RAM) at 21 PB/s, about 480,000 sweeps a second to Rubin&apos;s 76.
              <Cite s={S.cerebrasS1} />
              <Cite s={S.cerebrasS1} kind="derived" note="21 PB/s / 44 GB = 477,000." /> The wall
              becomes a capacity wall: a larger model splits across wafers.
              <Cite s={S.cerebrasInferenceBlog} /> NVIDIA&apos;s Groq 3 LPX runs decode&apos;s
              FFN (feed-forward network) and MoE (mixture of experts) layers SRAM-first beside
              Rubin GPUs.
              <Cite s={S.lpxBlog} /> See <em>Cerebras Wafer-Scale</em> and <em>Groq, SambaNova and
              Dataflow</em>.
            </Box>
          </div>
          <div>
            <Box variant="h3">Compute in the memory</Box>
            <Box variant="p">
              Samsung&apos;s HBM2-PIM (processing-in-memory) puts small FP16 units beside the DRAM
              banks, stepped by ordinary read and write commands; they see 4.92 TB/s to the
              host&apos;s 1.23 TB/s.
              <Cite s={S.samsungPimHc33} kind="vendor-claim" /> Samsung calls it a demonstrator,
              this research located no commercial availability, and the operator set is narrow.
              See <em>Compute-in-Memory</em>.
            </Box>
          </div>
          <div>
            <Box variant="h3">Split prefill from decode</Box>
            <Box variant="p">
              Disaggregated serving gives prefill and decode their own pools and moves the KV
              cache between them, so each pool runs at its own arithmetic intensity on the same
              silicon.
              <Cite s={S.distServe} /> See <em>Disaggregated Serving and Speculative
              Decoding</em>.
            </Box>
          </div>
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
}
