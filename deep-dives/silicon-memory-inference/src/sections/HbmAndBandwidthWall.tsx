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
import { HbmStackDiagram } from '../components/HbmStackDiagram';

interface GpuRow {
  product: string;
  hbmGen: string;
  capacity: string;
  bandwidth: string;
  url: string;
}

const rows: GpuRow[] = [
  {
    product: 'NVIDIA H100 SXM',
    hbmGen: 'HBM3',
    capacity: '80 GB',
    bandwidth: '3.35 TB/s',
    url: 'https://www.nvidia.com/en-us/data-center/h100/',
  },
  {
    product: 'NVIDIA H200 SXM',
    hbmGen: 'HBM3e',
    capacity: '141 GB',
    bandwidth: '4.8 TB/s',
    url: 'https://www.nvidia.com/en-us/data-center/h200/',
  },
  {
    product: 'NVIDIA B200 / B300 (HGX)',
    hbmGen: 'HBM3e / HBM3e+',
    capacity: 'UNKNOWN — pending Blackwell datasheet',
    bandwidth: 'UNKNOWN — page emphasizes NVLink aggregate',
    url: 'https://www.nvidia.com/en-us/data-center/hgx/',
  },
];

export function HbmAndBandwidthWall() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Why decode tokens-per-second tracks HBM pin speed almost linearly"
          >
            HBM and the bandwidth wall
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The claim in one sentence.</strong> On modern accelerators, decode-phase
            inference throughput scales with HBM bandwidth per GPU until something else
            binds. Peak FLOPs, peak NVLink bandwidth, and precision format all matter
            further along — but the first-order variable for the largest single category of
            inference workload is how many terabytes per second the HBM stacks can deliver.
          </Box>
          <Box variant="p">
            <strong>Why it is a &ldquo;wall.&rdquo;</strong> HBM is a 2.5D-packaged
            technology: DRAM dies stacked vertically with through-silicon vias on a base
            logic die, placed on the same silicon interposer as the accelerator. Raising
            pin speed costs signal-integrity work, thermal headroom, and yield. Raising
            capacity costs more dies per stack and more stacks per package. Both levers are
            tightly coupled to packaging supply — which is why HBM is a first-order
            commercial variable for the entire accelerator market in 2026.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A cross-section of the structure that makes TB/s-class bandwidth physically possible"
          >
            What HBM looks like, physically
          </Header>
        }
      >
        <SpaceBetween size="m">
          <HbmStackDiagram />
          <Box variant="p">
            An HBM (High Bandwidth Memory) generation 3 stack exposes <strong>1,024 bits
            of data per stack</strong> through sixteen 64-bit channels, versus 64 bits for
            a single DDR5 DIMM (Dual In-line Memory Module) channel. Width is the main
            reason HBM delivers TB/s-class bandwidth at relatively modest pin speeds. The
            vertical TSVs (Through-Silicon Vias) connect the stacked DRAM (Dynamic
            Random-Access Memory) dies to the base logic die, which in turn connects to the
            accelerator over the silicon interposer. The short, wide, dense electrical path
            is what makes HBM3 pin speeds in the 6.4 Gb/s range — and HBM3e pin speeds in
            the 8-9 Gb/s range — electrically
            feasible. An off-package DDR DIMM over a PCB cannot tolerate those speeds.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Tier 1 vendor-cited HBM specs for current production silicon"
          >
            Per-GPU HBM on modern accelerators
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={rows}
            columnDefinitions={[
              { id: 'prod', header: 'Accelerator', cell: (r) => r.product, minWidth: 200 },
              { id: 'gen', header: 'HBM generation', cell: (r) => r.hbmGen },
              { id: 'cap', header: 'Capacity', cell: (r) => r.capacity },
              { id: 'bw', header: 'Peak bandwidth', cell: (r) => r.bandwidth },
              {
                id: 'src',
                header: 'Source',
                cell: (r) => (
                  <Link external href={r.url}>
                    NVIDIA page
                  </Link>
                ),
              },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">All vendor-cited figures accessed 2026-04-23.</Box>
          <Alert type="warning" header="UNKNOWN — Blackwell per-GPU HBM">
            NVIDIA&apos;s current HGX overview page emphasizes system-level NVLink
            aggregate numbers (1.8 TB/s GPU-to-GPU, 14.4 TB/s total NVLink on HGX B200/B300)
            rather than per-GPU HBM specs. The HGX Rubin NVL8 row on the same page shows a
            3.6 TB/s NVLink figure for the next generation. Per-GPU HBM capacity and
            bandwidth for B200 and B300 will land in Section 13 when the Blackwell
            datasheet is read directly.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="H100 → H200 is the cleanest case study available"
          >
            The bandwidth wall, observed
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">What stayed the same</Box>
              <ul>
                <li>Same GH100 die</li>
                <li>Same SM count</li>
                <li>Same peak tensor FLOPs at every precision (FP8: 3,958 TFLOPS, BF16: 1,979 TFLOPS)</li>
                <li>Same NVLink bandwidth (900 GB/s)</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">What changed</Box>
              <ul>
                <li>HBM3 → HBM3e</li>
                <li>80 GB → 141 GB (&ldquo;nearly double the capacity&rdquo;)</li>
                <li>3.35 TB/s → 4.8 TB/s (&ldquo;1.4× more memory bandwidth&rdquo;)</li>
                <li>Power envelope within SXM thermals</li>
              </ul>
            </div>
          </ColumnLayout>
          <Alert type="success">
            NVIDIA reports the observed inference uplift at this level as &ldquo;up to 1.9×
            faster Llama2 70B inference&rdquo; and &ldquo;1.6× faster GPT-3 175B
            inference&rdquo;
            {' ('}
            <Link external href="https://www.nvidia.com/en-us/data-center/h200/">
              NVIDIA H200 product page
            </Link>
            , accessed 2026-04-23). Peak FLOPs did not move; HBM bandwidth did; inference
            throughput moved with the HBM bandwidth. That is the roofline prediction for
            decode, delivered verbatim by the vendor.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why 8-9 Gb/s per pin is electrically non-trivial"
          >
            Why HBM pin speed is hard
          </Header>
        }
      >
        <ExpandableSection headerText="Signal integrity, power, and thermals" defaultExpanded>
          <SpaceBetween size="s">
            <Box variant="p">
              <strong>Signal integrity.</strong> Every generation adds work on the
              interposer — new termination schemes on the DRAM die, improved channel
              equalization, tighter impedance control. Pin speeds in the 8-9 Gb/s range
              stretch what silicon bridges and advanced interposers can reliably deliver at
              yield.
            </Box>
            <Box variant="p">
              <strong>Power.</strong> HBM pin speed scales power roughly linearly per pin;
              multiply by 1,024 pins per stack and by 4-8 stacks per package, and the HBM
              tier can consume 150 W or more on a single accelerator. Power-per-pin is a
              first-order constraint on packaging and cooling.
            </Box>
            <Box variant="p">
              <strong>Thermals.</strong> HBM sits millimeters from the accelerator die and
              shares a cold-plate contact. Stack height (more dies → more capacity) runs
              against cold-plate flatness and thermal conductivity. The physical package
              becomes a thermal constraint before it becomes an electrical one.
            </Box>
            <Box variant="p">
              <strong>HBM4.</strong> Rather than winning everything on pin speed, the HBM4
              standards work widens the bus to 2,048 bits per stack — betting that width
              scales more cleanly than frequency. Section 13 carries the verified numbers
              as Blackwell and Rubin roadmaps arrive.
            </Box>
          </SpaceBetween>
        </ExpandableSection>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="HBM bandwidth is the decode variable; for other workload classes check arithmetic intensity first"
          >
            Where HBM bandwidth does not help
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Prefill-heavy serving.</strong> Prefill runs with high arithmetic
            intensity (Section 3) and is compute-bound on H100/H200-class silicon. Extra
            HBM bandwidth yields less than proportional improvement. A serving stack that
            is mostly prefill — long prompts, small outputs — is FLOP-bound, not
            bandwidth-bound.
          </Box>
          <Box variant="p">
            <strong>Training.</strong> Activation reads are bandwidth-sensitive, but
            optimizer steps and weight updates frequently see diminishing returns from HBM
            above a threshold. Training mixes compute-bound and bandwidth-bound phases, and
            the economics are more sensitive to scale-out fabric (NVLink, EFA, NIXL) than
            to HBM pin speed.
          </Box>
          <Box variant="p">
            <strong>Vision and tabular.</strong> Convolutional vision models and gradient
            boosted trees over tabular data frequently run out of FLOPs before they run
            out of bandwidth. For these workloads the ridge point is the wrong mental
            model; throughput per dollar tracks peak FLOPs and memory capacity.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Three architectural routes that sidestep HBM pin speed as the ceiling"
          >
            Alternatives to the HBM bandwidth wall
          </Header>
        }
      >
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="h3">On-chip SRAM at wafer scale</Box>
            <Box variant="p">
              Cerebras WSE-3 abandons HBM as a discrete tier and holds the model in
              on-wafer SRAM. No external DRAM in the steady state. The tradeoff is model
              size — the model has to fit. Section 19 walks capacity, bandwidth, and the
              programming model.
            </Box>
          </div>
          <div>
            <Box variant="h3">Compute-in-memory</Box>
            <Box variant="p">
              Samsung HBM-PIM and HyperCIM move arithmetic units into the memory array so
              the operation happens where the data lives, eliminating most bus traversal.
              The tradeoff is a constrained operator set. Section 21 carries the details.
            </Box>
          </div>
          <div>
            <Box variant="h3">Disaggregated prefill / decode</Box>
            <Box variant="p">
              Less radical. Split the serving cluster: prefill on FLOP-rich GPUs, decode
              on bandwidth-optimized GPUs, move the KV cache between them over a fast
              fabric. Changes the arithmetic intensity profile per node without changing
              the silicon. Section 26 covers the current state of the art.
            </Box>
          </div>
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
}
