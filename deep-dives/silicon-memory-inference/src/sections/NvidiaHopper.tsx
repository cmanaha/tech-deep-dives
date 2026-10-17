import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { HopperSmDiagram } from '../components/HopperSmDiagram';
import { Cite } from '../components/Cite';
import { S } from '../sources/NvidiaHopper';

interface SpecRow {
  spec: string;
  h100: React.ReactNode;
  h200: React.ReactNode;
}

const sparseNote =
  'NVIDIA marks this figure "With sparsity". Its Hopper architecture blog lists H100 SXM5 Tensor Core peaks as dense/sparse pairs at a 1:2 ratio, so dense is half.';

const nvlinkNote =
  'NVIDIA lists 900 GB/s per GPU; its Blackwell Ultra blog (Table 1) gives Hopper NVLink as 900 in bidirectional GB/s, which is 450 GB/s each way.';

const ratioNote = '4.8 / 3.35 = 1.43 for bandwidth; 141 / 80 = 1.76 for capacity.';

const specRows: SpecRow[] = [
  {
    spec: 'Compute capability',
    h100: (
      <>
        9.0 (<code>sm_90</code>)
        <Cite s={S.cudaGpus} />
      </>
    ),
    h200: (
      <>
        9.0 (<code>sm_90</code>)
        <Cite s={S.cudaGpus} />
      </>
    ),
  },
  {
    spec: 'SMs',
    h100: (
      <>
        132 (the full GH100 die has 144)
        <Cite s={S.hopperArchBlog} />
      </>
    ),
    h200: (
      <>
        Not on NVIDIA&apos;s H200 page
        <Cite s={S.h200Page} />
      </>
    ),
  },
  {
    spec: 'L2 cache',
    h100: (
      <>
        50 MB
        <Cite s={S.hopperTuningGuide} />
      </>
    ),
    h200: (
      <>
        Not on NVIDIA&apos;s H200 page
        <Cite s={S.h200Page} />
      </>
    ),
  },
  {
    spec: 'FP8 Tensor Core',
    h100: (
      <>
        3,958 TFLOPS sparse, about 1,979 dense
        <Cite s={S.h100Page} />
        <Cite s={S.hopperArchBlog} kind="derived" note={sparseNote} />
      </>
    ),
    h200: (
      <>
        3,958 TFLOPS sparse, about 1,979 dense
        <Cite s={S.h200Page} />
        <Cite s={S.hopperArchBlog} kind="derived" note={sparseNote} />
      </>
    ),
  },
  {
    spec: 'BF16 (bfloat16) Tensor Core',
    h100: (
      <>
        1,979 TFLOPS sparse, about 990 dense
        <Cite s={S.h100Page} />
        <Cite s={S.hopperArchBlog} kind="derived" note={sparseNote} />
      </>
    ),
    h200: (
      <>
        1,979 TFLOPS sparse, about 990 dense
        <Cite s={S.h200Page} />
        <Cite s={S.hopperArchBlog} kind="derived" note={sparseNote} />
      </>
    ),
  },
  {
    spec: 'NVLink per GPU',
    h100: (
      <>
        900 GB/s bidirectional (450 GB/s each way)
        <Cite s={S.h100Page} />
        <Cite s={S.blackwellUltraBlog} note={nvlinkNote} />
      </>
    ),
    h200: (
      <>
        900 GB/s bidirectional (450 GB/s each way)
        <Cite s={S.h200Page} />
        <Cite s={S.blackwellUltraBlog} note={nvlinkNote} />
      </>
    ),
  },
  {
    spec: 'HBM',
    h100: (
      <>
        80 GB of HBM3
        <Cite s={S.h100Page} />
      </>
    ),
    h200: (
      <>
        141 GB of HBM3e (1.76x)
        <Cite s={S.h200Page} />
        <Cite s={S.h200Page} kind="derived" note={ratioNote} />
      </>
    ),
  },
  {
    spec: 'HBM bandwidth',
    h100: (
      <>
        3.35 TB/s
        <Cite s={S.h100Page} />
      </>
    ),
    h200: (
      <>
        4.8 TB/s (1.43x)
        <Cite s={S.h200Page} />
        <Cite s={S.h200Page} kind="derived" note={ratioNote} />
      </>
    ),
  },
  {
    spec: 'On AWS',
    h100: (
      <>
        P5 (p5.4xlarge, p5.48xlarge)
        <Cite s={S.ec2AcceleratedSpecs} />
      </>
    ),
    h200: (
      <>
        P5e and P5en (p5e.48xlarge, p5en.48xlarge)
        <Cite s={S.ec2AcceleratedSpecs} />
      </>
    ),
  },
];

interface InstanceRow {
  size: string;
  gpus: React.ReactNode;
  host: React.ReactNode;
  pick: React.ReactNode;
}

const instanceRows: InstanceRow[] = [
  {
    size: 'p5.4xlarge',
    gpus: (
      <>
        1 x H100, 80 GiB
        <Cite s={S.ec2AcceleratedSpecs} />
      </>
    ),
    host: (
      <>
        AMD EPYC 7R13, Nitro v4; 100 Gbps EFA, no GPUDirect RDMA (remote direct memory
        access)
        <Cite s={S.ec2AcceleratedSpecs} />
        <Cite s={S.p5Page} />
      </>
    ),
    pick: 'The only single-GPU Hopper size: development and single-GPU serving.',
  },
  {
    size: 'p5.48xlarge',
    gpus: (
      <>
        8 x H100, 640 GiB (8 x 80)
        <Cite s={S.ec2AcceleratedSpecs} />
      </>
    ),
    host: (
      <>
        AMD EPYC 7R13, Nitro v4; 3,200 Gbps second-generation EFA
        <Cite s={S.ec2AcceleratedSpecs} />
        <Cite s={S.p5Page} />
      </>
    ),
    pick: 'H100 at node and cluster scale, when the model and its batch fit in 80 GB per GPU.',
  },
  {
    size: 'p5e.48xlarge',
    gpus: (
      <>
        8 x H200, 1,128 GiB (8 x 141)
        <Cite s={S.ec2AcceleratedSpecs} />
      </>
    ),
    host: (
      <>
        AMD EPYC 7R13, Nitro v4; 3,200 Gbps second-generation EFA
        <Cite s={S.ec2AcceleratedSpecs} />
        <Cite s={S.p5Page} />
      </>
    ),
    pick: 'H200 capacity and bandwidth on the P5 host.',
  },
  {
    size: 'p5en.48xlarge',
    gpus: (
      <>
        8 x H200, 1,128 GiB (8 x 141)
        <Cite s={S.ec2AcceleratedSpecs} />
      </>
    ),
    host: (
      <>
        Intel Xeon Sapphire Rapids, Nitro v5, PCIe Gen5 between CPU and GPU; 3,200 Gbps
        third-generation EFA
        <Cite s={S.ec2AcceleratedSpecs} />
        <Cite s={S.p5Page} />
      </>
    ),
    pick: (
      <>
        H200 when host-to-GPU traffic or collective latency matters. AWS cites up to 4x the
        CPU-to-GPU bandwidth of P5e and P5, and up to 35% lower latency than P5.
        <Cite s={S.p5Page} kind="vendor-claim" />
      </>
    ),
  },
];

export function NvidiaHopper() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="One compute design with two memory configurations: what H200's extra memory buys an inference workload, and which P5 instance to pick"
          >
            NVIDIA Hopper: H100 and H200
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What Hopper is.</strong> Hopper is the NVIDIA data-center GPU generation
            before Blackwell (see <em>NVIDIA Blackwell</em>), sold as H100 and H200, both
            compute capability 9.0.
            <Cite s={S.cudaGpus} /> Its streaming multiprocessors (SMs) add FP8 to the
            fourth-generation Tensor Cores
            <Cite s={S.hopperArchBlog} />, a Tensor Memory Accelerator (TMA) that bulk-copies
            tensors between global and shared memory, and thread block clusters whose blocks can
            read, write and run atomics on each other&apos;s shared memory (Distributed Shared
            Memory).
            <Cite s={S.hopperTuningGuide} /> H100 (HBM3, High Bandwidth Memory) reached full
            production in September 2022
            <Cite s={S.hopperFullProduction} />; H200 (HBM3e) was announced in November 2023,
            with systems expected from the second quarter of 2024.
            <Cite s={S.h200Announcement} />
          </Box>
          <Box variant="p">
            <strong>Why the pair matters.</strong> The compute stays fixed and the memory
            changes. H200 carries 141 GB of HBM3e at 4.8 TB/s against H100&apos;s 80 GB of HBM3
            at 3.35 TB/s
            <Cite s={S.h200Page} />
            <Cite s={S.h100Page} />, and NVIDIA rates it 1.9x faster on Llama 2 70B inference,
            run at 4x the batch size.
            <Cite s={S.h200Page} kind="vendor-claim" /> That makes the pair the cleanest view
            in this dive of what memory buys an inference workload: bandwidth sets the step
            time, capacity sets the batch.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where wgmma finds its operands, how far each memory level sits from the Tensor Cores, and what caps the warps that hide that distance"
          >
            Inside one Hopper SM
          </Header>
        }
      >
        <SpaceBetween size="m">
          <HopperSmDiagram />
          <Box variant="small" color="text-body-secondary">
            Per-SM figures, L2 and TMA
            <Cite s={S.hopperTuningGuide} />
            <Cite s={S.computeCapabilities} />; SM count
            <Cite s={S.hopperArchBlog} />; wgmma
            <Cite s={S.ptxIsa} />; FP8
            <Cite s={S.h100Page} />
            <Cite s={S.hopperArchBlog} kind="derived" note={sparseNote} />; HBM
            <Cite s={S.h100Page} />
            <Cite s={S.h200Page} />
            <Cite s={S.h200Page} kind="derived" note={ratioNote} />. Cycle counts come from a
            third-party microbenchmark on an H800 PCIe (Hopper with HBM2e, 1,755 MHz maximum
            clock); the HBM figure is its global-memory latency.
            <Cite s={S.luoHopperBench} kind="measured" />
          </Box>
          <Box variant="p">
            <strong>wgmma is the Tensor Core path.</strong> Hopper&apos;s Tensor Cores are
            driven by <code>wgmma</code>, the warpgroup-level matrix multiply-accumulate
            instruction. Operand B always comes from shared memory (SMEM), operand A from SMEM
            or registers, and the accumulator D stays in registers.
            <Cite s={S.ptxIsa} /> The TMA fills SMEM in bulk while the block keeps working on
            other instructions
            <Cite s={S.hopperTuningGuide} />, so a kernel can copy the next tile in while it
            multiplies the current one.
          </Box>
          <Box variant="p">
            <strong>Occupancy hides the distance.</strong> A thread&apos;s instructions run in
            sequence, so the SM hides a stalled warp&apos;s latency by running other warps.
            Occupancy is the ratio of active warps per SM to the maximum.
            <Cite s={S.cudaBestPractices} /> The register file caps it: 64K registers across 64
            warps of 32 threads is 32 registers per thread, so a kernel that needs 128 fits at
            most 16 warps.
            <Cite
              s={S.hopperTuningGuide}
              kind="derived"
              note="65,536 registers / (64 warps x 32 threads) = 32 per thread; 65,536 / (128 x 32) = 16 warps."
            />{' '}
            When occupancy comes in low, registers per thread is the first number to check.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Every compute figure NVIDIA publishes for both GPUs matches; only the memory rows move"
          >
            H100 and H200 side by side
          </Header>
        }
      >
        <Table
          items={specRows}
          columnDefinitions={[
            { id: 'spec', header: 'Spec', cell: (r) => r.spec, minWidth: 130 },
            { id: 'h100', header: 'H100 SXM', cell: (r) => r.h100, minWidth: 170 },
            { id: 'h200', header: 'H200 SXM', cell: (r) => r.h200, minWidth: 170 },
          ]}
          variant="embedded"
          wrapLines
        />
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="H200 ran 4x the batch to reach 1.9x on Llama 2 70B: bandwidth sets the step time, capacity sets the batch"
          >
            What 1.9x is made of
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            NVIDIA rates H200 at 1.9x the inference throughput of H100 on Llama 2 70B, and 1.6x
            on GPT-3 175B.
            <Cite s={S.h200Page} kind="vendor-claim" /> The footnote changes the batch size
            along with the GPU: Llama 2 70B ran at batch size 8 on one H100 and 32 on one H200,
            and GPT-3 175B at 64 on eight H100s and 128 on eight H200s.
            <Cite s={S.h200Page} /> With the compute identical, both memory changes are at work
            in the result.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Bandwidth sets the step time</Box>
              <Box variant="p">
                A decode step reads the weights and the KV (key-value) cache from HBM, so at a
                fixed batch it runs faster by at most the bandwidth ratio: 4.8 / 3.35 = 1.43x.
                <Cite s={S.h200Page} kind="derived" note={ratioNote} /> Bandwidth alone stops
                short of 1.9x. <em>Roofline and Arithmetic Intensity</em> shows why decode sits
                on the bandwidth side of the roofline.
              </Box>
            </div>
            <div>
              <Box variant="h3">Capacity sets the batch</Box>
              <Box variant="p">
                Our reading of the footnote: the weights take the same space on both GPUs, so
                H200&apos;s extra 61 GB is free for KV cache, and four times as many sequences
                share each read of the weights.
                <Cite s={S.h200Page} kind="derived" note="141 GB - 80 GB = 61 GB; batch 32 / 8 = 4x." />{' '}
                The 1.9x is both effects together. GPT-3 175B fits the same reading with a
                smaller step: 2x the batch, 1.6x the throughput.
              </Box>
            </div>
          </ColumnLayout>
          <ExpandableSection headerText="The rest of NVIDIA's benchmark footnote">
            <Box variant="p">
              Llama 2 70B ran 2K input and 128 output tokens in throughput mode; GPT-3 175B ran
              80 input and 200 output tokens. NVIDIA labels the footnote &quot;Preliminary
              specifications. May be subject to change.&quot;
              <Cite s={S.h200Page} />
            </Box>
          </ExpandableSection>
          <Box variant="p">
            <strong>Sizing with both halves.</strong> Compare GPUs for decode-heavy serving at
            the largest batch each one&apos;s memory holds; a benchmark at one shared batch size
            measures the bandwidth ratio alone. Two numbers size the deployment: HBM bandwidth
            for the step time, and the capacity left after the weights for the batch.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which P5 size to pick: one H100, eight H100s, or eight H200s on the older or the newer host"
          >
            Hopper on AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            P5 carries H100; P5e and P5en carry H200, the GPU behind the 1.9x result.
            <Cite s={S.p5Page} /> P5e and P5en have the same eight H200s and differ in the host
            and the EFA (Elastic Fabric Adapter) generation. All four sizes can be reserved for
            a future date through Capacity Blocks for ML.
            <Cite s={S.capacityBlocks} />
          </Box>
          <Table
            items={instanceRows}
            columnDefinitions={[
              { id: 'size', header: 'Instance', cell: (r) => <code>{r.size}</code>, minWidth: 120 },
              { id: 'gpus', header: 'GPUs and memory', cell: (r) => r.gpus, minWidth: 150 },
              { id: 'host', header: 'Host and network', cell: (r) => r.host, minWidth: 200 },
              { id: 'pick', header: 'Pick it for', cell: (r) => r.pick, minWidth: 220 },
            ]}
            variant="embedded"
            wrapLines
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="When Hopper is the cheaper answer, when Blackwell is, and the kernel check to run before you move"
          >
            Choosing Hopper, and moving off it
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Blackwell is the better fit for</Box>
            <ul>
              <li>
                Workloads that need NVFP4 (NVIDIA&apos;s 4-bit float) or{' '}
                <code>tcgen05.mma</code>, which target Blackwell and later.
                <Cite s={S.ptxIsa} />
              </li>
              <li>
                Models that exceed 141 GB per GPU and fit B200&apos;s 180 GB or B300&apos;s 288
                GB
                <Cite s={S.blackwellTuningGuide} />
                <Cite s={S.blackwellUltraBlog} />, listed on AWS as 179 GiB and 268 GiB per GPU.
                <Cite s={S.ec2AcceleratedSpecs} />
              </li>
              <li>
                Mixture-of-experts (MoE) serving that needs all-to-all across a rack-scale NVLink
                domain, and workloads that want CPU memory coherent with the GPU over NVLink-C2C
                (see <em>Grace-Blackwell and UltraServer</em>).
              </li>
            </ul>
          </div>
          <div>
            <Box variant="h3">Getting Hopper right, and the move after it</Box>
            <ul>
              <li>
                Price Hopper first when the model fits: AWS cut On-Demand prices 44% for P5 and
                25% for P5en from the May 31, 2025 baseline.
                <Cite s={S.gpuPriceCut} />
              </li>
              <li>
                FlashAttention-3 is optimized for Hopper GPUs; its README lists H100 or H800 with
                CUDA 12.3 or later and calls it a beta release.
                <Cite s={S.flashAttentionReadme} /> See <em>KV Cache and FlashAttention</em>.
              </li>
              <li>
                Move to Blackwell kernel by kernel: confirm that each kernel on the critical path
                has a Blackwell build before the workload moves. Watch for <code>wgmma</code>: it
                requires <code>sm_90a</code>
                <Cite s={S.ptxIsa} />, so a Hopper kernel built on it has no Blackwell build and
                needs a <code>tcgen05</code> rewrite (see <em>NVIDIA Blackwell</em> and{' '}
                <em>NVIDIA Compilers and Kernel Tooling</em>).
              </li>
            </ul>
          </div>
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
}
