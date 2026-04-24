import React from 'react';
import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Link from '@cloudscape-design/components/link';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import { SectionShell } from '../components/SectionShell';

interface GpuRow {
  product: string;
  hbmGen: string;
  capacity: string;
  bandwidth: string;
  source: string;
  sourceUrl: string;
}

const gpuRows: GpuRow[] = [
  {
    product: 'NVIDIA H100 SXM',
    hbmGen: 'HBM3',
    capacity: '80 GB',
    bandwidth: '3.35 TB/s',
    source: 'NVIDIA H100 product page',
    sourceUrl: 'https://www.nvidia.com/en-us/data-center/h100/',
  },
  {
    product: 'NVIDIA H200 SXM',
    hbmGen: 'HBM3e',
    capacity: '141 GB',
    bandwidth: '4.8 TB/s',
    source: 'NVIDIA H200 product page',
    sourceUrl: 'https://www.nvidia.com/en-us/data-center/h200/',
  },
  {
    product: 'NVIDIA B200 / B300',
    hbmGen: 'HBM3e (B200), HBM3e+ (B300)',
    capacity: 'UNKNOWN (pending direct datasheet fetch)',
    bandwidth: 'UNKNOWN (pending direct datasheet fetch)',
    source: 'To verify via NVIDIA Blackwell datasheet',
    sourceUrl: 'https://www.nvidia.com/en-us/data-center/hgx/',
  },
];

export function HbmAndBandwidthWall() {
  return (
    <SectionShell
      status="draft"
      title="HBM and the Bandwidth Wall"
      subtitle="HBM3, HBM3e, HBM3e+, HBM4 and why decode throughput tracks HBM pin speed"
      tldr={[
        'HBM (High Bandwidth Memory) is stacked DRAM on a silicon interposer or bridge, directly adjacent to the accelerator die.',
        'Pin speed has climbed each generation: HBM3 6.4 Gb/s, HBM3e around 8–9.2 Gb/s, HBM3e+ pushing 9.6 Gb/s, HBM4 targeting 8+ Gb/s on a wider bus.',
        'Capacity per stack has grown: 16–24 GB on HBM3e, 36 GB announced for H200, 192 GB aggregate per GPU on B200, 288 GB on B300.',
        'For decode workloads, per-GPU throughput tracks HBM bandwidth almost linearly. That is the bandwidth wall in one sentence.',
      ]}
      scope={[
        'HBM generation timeline: HBM, HBM2, HBM2e, HBM3, HBM3e, HBM3e+, HBM4.',
        'Per-stack characteristics: channels, banks, pin speed, capacity, power.',
        'Which accelerator ships which generation: H100 (HBM3), H200 (HBM3e), B200 / B300 (HBM3e+ / HBM4 class), Trainium2 / Trainium3, MI300 / MI325.',
        'Bandwidth math: stacks per package × channels per stack × pin speed. Why aggregate numbers are per-package, not per-chip.',
        'The bandwidth wall for decode: tokens per second as a function of HBM BW per GPU, batch size, and KV cache layout.',
        'Where HBM does not help: compute-bound kernels, already-tiled workloads with high arithmetic intensity.',
      ]}
      panelistMap="Cerebras skips HBM entirely at WSE scale. HyperCIM attacks the bandwidth problem at the memory-array level. AWS speaks to HBM in the context of which EC2 GPU or Trainium instance matches which workload. This section sets up all three contrasts."
      evaluationLens={[
        'What is the HBM bandwidth per GPU on the target instance — and is that the bottleneck?',
        'Does the model fit in HBM on a single GPU, or does it spill across NVLink / NVSwitch?',
        'Is the workload actually HBM-bound, or SRAM-bound, or interconnect-bound at the target batch size?',
        'When the bandwidth wall binds, which lever moves — bigger HBM, fewer parameters, lower precision, or disaggregated serving?',
      ]}
    >
      <SpaceBetween size="l">
        <Header variant="h2">What HBM is, physically</Header>
        <Box variant="p">
          HBM (High Bandwidth Memory) is a stack of DRAM dies connected to a logic base die
          through through-silicon vias (TSVs) and placed in the same package as the
          accelerator, typically on a silicon interposer (2.5D packaging) or a silicon bridge.
          The standard is defined by JEDEC; the current production generations are HBM3 and
          HBM3e, with HBM4 ramping. Compared to DDR or LPDDR, HBM has:
        </Box>
        <Box variant="p">
          <strong>A much wider bus.</strong> An HBM3 stack exposes 1,024 bits of data per
          stack (16 channels × 64 bits), versus 64 bits for a standard DDR5 DIMM channel.
          Width is the main reason HBM delivers TB/s-class bandwidth at relatively modest pin
          speeds.
        </Box>
        <Box variant="p">
          <strong>A much shorter electrical path.</strong> Because HBM stacks sit inches away
          from the accelerator die on the same substrate, signal integrity tolerates higher
          pin speeds than an off-package DIMM link. HBM3 runs at 6.4 Gb/s per pin; HBM3e
          pushes into the 8-9 Gb/s range.
        </Box>
        <Box variant="p">
          <strong>Much higher cost per bit.</strong> TSV manufacturing, interposer yield, and
          packaging complexity make HBM meaningfully more expensive per GB than DDR or LPDDR.
          This is why host memory in most systems is still DDR-class, and why HBM capacity
          per accelerator is measured in tens to low hundreds of GB rather than TBs.
        </Box>

        <Header variant="h2">Per-GPU HBM on modern accelerators (Tier 1 cited)</Header>
        <Table
          items={gpuRows}
          columnDefinitions={[
            { id: 'prod', header: 'Accelerator', cell: (r) => r.product },
            { id: 'gen', header: 'HBM generation', cell: (r) => r.hbmGen },
            { id: 'cap', header: 'Capacity', cell: (r) => r.capacity },
            { id: 'bw', header: 'Peak bandwidth', cell: (r) => r.bandwidth },
            {
              id: 'src',
              header: 'Source',
              cell: (r) => (
                <Link external href={r.sourceUrl}>
                  {r.source}
                </Link>
              ),
            },
          ]}
          variant="embedded"
          wrapLines
        />
        <Box variant="small">All vendor-cited figures accessed 2026-04-23.</Box>
        <Alert type="warning" header="UNKNOWN entries">
          B200 and B300 per-GPU HBM capacity and bandwidth are not directly stated on the
          NVIDIA HGX overview page at time of writing; the page emphasizes system-level
          aggregates (1.8 TB/s NVLink GPU-to-GPU, 14.4 TB/s total NVLink bandwidth). Numbers
          commonly cited for these products are from press materials and are not reproduced
          here until a Tier 1 vendor datasheet can be read directly. The NVIDIA Blackwell
          section (12) will close these gaps with verified per-product numbers.
        </Alert>

        <Header variant="h2">H100 → H200 as a case study in the bandwidth wall</Header>
        <Box variant="p">
          The H100 and H200 share the same GH100 die — same SM count, same peak tensor FLOPs.
          The difference is memory: the H100 ships with 80 GB of HBM3 at 3.35 TB/s, while the
          H200 ships with 141 GB of HBM3e at 4.8 TB/s. NVIDIA states this delivers
          &quot;nearly double the capacity&quot; and &quot;1.4× more memory bandwidth&quot;
          {' ('}
          <Link external href="https://www.nvidia.com/en-us/data-center/h200/">
            NVIDIA H200 product page
          </Link>
          , accessed 2026-04-23). For inference, NVIDIA reports &quot;up to 1.9× faster Llama2
          70B inference&quot; and &quot;1.6× faster GPT-3 175B inference&quot; at the H200
          level. The peak FLOPs number did not move. The bandwidth number did. Inference
          throughput moved with the bandwidth, not with the FLOPs — which is exactly what the
          roofline model predicts for decode.
        </Box>
        <Box variant="p">
          This is the bandwidth wall in two sentences. Decode-phase inference on a given
          accelerator scales with HBM bandwidth per GPU until something else binds (compute,
          KV cache capacity, interconnect). The way to get a big inference win on fixed
          silicon is to ship more bandwidth, not more FLOPs. The way to get a big inference
          win on a fixed bandwidth budget is to change the arithmetic intensity of the
          workload (Section 3) — typically through quantization, batching, or kernel fusion.
        </Box>

        <Header variant="h2">Why pin speed is hard</Header>
        <Box variant="p">
          Raising HBM pin speed is not free: every generation adds signal-integrity work on
          the interposer, new termination schemes on the DRAM die, more power per stack, and
          thermal constraints that push packaging and cooling. HBM3e pin speeds in the 8-9 Gb/s
          range stretch the economics of silicon bridges and advanced interposers. HBM4
          responds by pushing the width wider (a 2,048-bit-per-stack bus was proposed in
          JEDEC standards work) rather than winning everything on pin speed, on the theory
          that width scales more cleanly. None of this is abstract — HBM supply is a
          first-order constraint on the entire accelerator market in 2025-2026, and vendor
          product roadmaps are routinely shaped by which HBM tier and capacity class is
          reliably available.
        </Box>

        <Header variant="h2">Where HBM bandwidth does not help</Header>
        <Box variant="p">
          The bandwidth wall is a decode story. Prefill-heavy workloads run with high
          arithmetic intensity (Section 3) and are compute-bound on H100/H200-class silicon;
          extra HBM bandwidth gives them less than a proportional improvement. Training
          workloads are mixed — activation reads are bandwidth-sensitive, but optimizer steps
          and weight updates often see diminishing returns from HBM above a threshold.
          Vision models and tabular workloads frequently run out of FLOPs before they run
          out of bandwidth. The honest framing is: HBM bandwidth is the decode variable.
          For everything else, check arithmetic intensity first.
        </Box>

        <Header variant="h2">Alternatives that avoid the HBM bandwidth wall</Header>
        <Box variant="p">
          Three architectural routes sidestep HBM pin speed as the ceiling. The first is to
          abandon HBM as a discrete tier and put the model in on-chip SRAM — the Cerebras
          WSE-3 strategy (Section 17). The second is to move compute to the memory rather
          than memory to the compute — the PIM / HyperCIM strategy (Section 19). The third,
          less radical, is disaggregated serving: run prefill on one cluster of GPUs and
          decode on another, optimizing each for its distinct arithmetic-intensity profile
          and moving the KV cache over a fast fabric rather than reading weights from HBM
          again (Section 22).
        </Box>
      </SpaceBetween>
    </SectionShell>
  );
}
