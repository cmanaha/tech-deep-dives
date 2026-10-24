import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { EdgeSocComparisonDiagram } from '../components/EdgeSocComparisonDiagram';
import { SparkTopologyCapture } from '../components/SparkTopologyCapture';
import { Cite } from '../components/Cite';
import { S } from '../sources/EdgeSharedMemorySilicon';

interface SpecRow {
  spec: string;
  spark: React.ReactNode;
  thor: React.ReactNode;
  orin: React.ReactNode;
}

const specRows: SpecRow[] = [
  {
    spec: 'CPU',
    spark: (
      <>
        20 Arm cores: 10 Cortex-X925 and 10 Cortex-A725
        <Cite s={S.sparkHardware} />
      </>
    ),
    thor: (
      <>
        14 Arm Neoverse-V3AE cores
        <Cite s={S.thorBlog} />
      </>
    ),
    orin: (
      <>
        6 Arm Cortex-A78AE cores
        <Cite s={S.orinNanoDatasheet} />
      </>
    ),
  },
  {
    spec: 'GPU',
    spark: (
      <>
        Blackwell, 6,144 CUDA cores
        <Cite s={S.sparkHardware} />
      </>
    ),
    thor: (
      <>
        Blackwell
        <Cite s={S.thorBlog} />
      </>
    ),
    orin: (
      <>
        Ampere, 1,024 CUDA cores, 32 Tensor Cores
        <Cite s={S.orinNanoDatasheet} />
      </>
    ),
  },
  {
    spec: 'AI compute, as marketed',
    spark: (
      <>
        Up to 1 PFLOP FP4, sparse; no dense figure in NVIDIA's spec pages or Hot Chips slides
        <Cite s={S.sparkHardware} note="Hardware overview: up to 1 PFLOP at FP4 precision with sparsity." />
        <Cite s={S.gb10HotChips} note="The slides give AI: 1000 TOPS NVFP4 and CUDA: 31 TFLOPS FP32, and no dense FP4 figure." />
      </>
    ),
    thor: (
      <>
        Up to 2,070 TFLOPS FP4, sparse
        <Cite s={S.thorBlog} note="Table 1: 2070 TFLOPS (Sparse FP4)." />
      </>
    ),
    orin: (
      <>
        67 TOPS INT8 sparse, 33 TOPS dense
        <Cite s={S.orinNanoDatasheet} />
      </>
    ),
  },
  {
    spec: 'Memory',
    spark: (
      <>
        128 GB LPDDR5X, or 64 GB from OEM partners only; 256-bit
        <Cite s={S.sparkProductPage} />
        <Cite s={S.sparkHardware} />
      </>
    ),
    thor: (
      <>
        128 GB LPDDR5X, 256-bit
        <Cite s={S.thorBlog} />
      </>
    ),
    orin: (
      <>
        8 GB LPDDR5, 128-bit
        <Cite s={S.orinNanoDatasheet} />
      </>
    ),
  },
  {
    spec: 'Memory bandwidth',
    spark: (
      <>
        273 GB/s
        <Cite s={S.sparkHardware} />
      </>
    ),
    thor: (
      <>
        273 GB/s
        <Cite s={S.thorBlog} />
      </>
    ),
    orin: (
      <>
        102 GB/s in MAXN_SUPER mode, 68 GB/s before it
        <Cite s={S.orinNanoSuperPage} />
        <Cite s={S.orinNanoDatasheet} note="Peak Memory Bandwidth: 68 GB/s | 102 GB/s (MAXN_SUPER)." />
      </>
    ),
  },
  {
    spec: 'CPU-GPU coherence',
    spark: (
      <>
        Two-way, in hardware, over NVLink-C2C at about 600 GB/s aggregate
        <Cite s={S.gb10HotChips} />
      </>
    ),
    thor: (
      <>
        Two-way, in hardware
        <Cite s={S.tegraAppNote} />
      </>
    ),
    orin: (
      <>
        One-way (I/O coherency): the GPU side still runs cache maintenance
        <Cite s={S.tegraAppNote} />
      </>
    ),
  },
  {
    spec: 'Power',
    spark: (
      <>
        240 W external supply, 140 W SoC TDP (thermal design power)
        <Cite s={S.sparkHardware} />
      </>
    ),
    thor: (
      <>
        40 to 130 W
        <Cite s={S.thorBlog} />
      </>
    ),
    orin: (
      <>
        7 to 25 W modes
        <Cite s={S.orinNanoDatasheet} />
      </>
    ),
  },
  {
    spec: 'US list price (MSRP)',
    spark: (
      <>
        $4,699 Founders Edition, MSRP as of 23 February 2026
        <Cite s={S.sparkPriceChange} />; 64 GB OEM units from $4,999, on sale from 23 October 2026
        <Cite s={S.spark64Gb} />
      </>
    ),
    thor: (
      <>
        $5,499 developer kit, as of October 2026
        <Cite s={S.jetsonFaq} />
      </>
    ),
    orin: (
      <>
        $399 developer kit, as of October 2026
        <Cite s={S.jetsonFaq} />
      </>
    ),
  },
];

interface DecodeRow {
  device: string;
  model: string;
  setup: string;
  decode: React.ReactNode;
}

const nvidiaOct2025Note =
  'NVIDIA Table 4 of October 2025: every row runs at input length 2048, output length 128, batch size 1.';
const jetsonLabNote = 'Jetson AI Lab table, run with MLC and INT4 quantization.';

const decodeRows: DecodeRow[] = [
  {
    device: 'DGX Spark',
    model: 'Llama 3.1 8B',
    setup: 'NVFP4, TensorRT-LLM',
    decode: (
      <>
        38.65
        <Cite s={S.sparkPerfBlog} kind="vendor-claim" note={nvidiaOct2025Note} />
      </>
    ),
  },
  {
    device: 'DGX Spark',
    model: 'gpt-oss-20b',
    setup: 'MXFP4, llama.cpp',
    decode: (
      <>
        82.74
        <Cite s={S.sparkPerfBlog} kind="vendor-claim" note={nvidiaOct2025Note} />
      </>
    ),
  },
  {
    device: 'DGX Spark',
    model: 'gpt-oss-120b',
    setup: 'MXFP4, llama.cpp',
    decode: (
      <>
        55.37
        <Cite s={S.sparkPerfBlog} kind="vendor-claim" note={nvidiaOct2025Note} />
      </>
    ),
  },
  {
    device: 'DGX Spark',
    model: 'Llama 3.1 70B',
    setup: 'FP8, SGLang',
    decode: (
      <>
        2.7
        <Cite
          s={S.lmsysSpark}
          kind="measured"
          note="LMSYS, October 2025: 803 tokens/s prefill and 2.7 tokens/s decode at FP8. The review lists the FP8 runs under SGLang and does not state the batch size for this result."
        />
      </>
    ),
  },
  {
    device: '2x DGX Spark',
    model: 'Qwen3 235B',
    setup: 'NVFP4, TensorRT-LLM',
    decode: (
      <>
        11.73
        <Cite s={S.sparkPerfBlog} kind="vendor-claim" note={nvidiaOct2025Note} />
      </>
    ),
  },
  {
    device: 'Orin Nano Super',
    model: 'Llama 3.2 3B',
    setup: 'INT4, MLC',
    decode: (
      <>
        43.07
        <Cite s={S.jetsonAiLab} kind="vendor-claim" note={jetsonLabNote} />
      </>
    ),
  },
  {
    device: 'Orin Nano Super',
    model: 'Llama 3.1 8B',
    setup: 'INT4, MLC',
    decode: (
      <>
        19.14
        <Cite s={S.jetsonAiLab} kind="vendor-claim" note={jetsonLabNote} />
      </>
    ),
  },
  {
    device: 'Orin Nano Super',
    model: 'Gemma 2 9B',
    setup: 'INT4, MLC',
    decode: (
      <>
        9.21
        <Cite s={S.jetsonAiLab} kind="vendor-claim" note={jetsonLabNote} />
      </>
    ),
  },
];

export function EdgeSharedMemorySilicon() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="One memory pool for CPU and GPU: capacity decides which model fits, and 273 GB/s decides how fast it decodes"
          >
            Edge shared-memory silicon: DGX Spark and Jetson
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What these machines are.</strong> DGX Spark and the Jetson modules give the CPU
            and GPU one pool of LPDDR (low-power double data rate) memory, so a model can use the
            whole pool with no copy across PCIe (PCI Express) and no separate VRAM (dedicated GPU
            memory) budget. DGX Spark, built on the GB10 chip, holds 128 GB at 273 GB/s behind a
            240 W supply
            <Cite s={S.sparkHardware} />, or 64 GB in units from OEM (original equipment
            manufacturer) partners.
            <Cite s={S.sparkProductPage} /> Jetson AGX Thor puts the same 128 GB at 273 GB/s into a
            robot module of up to 130 W
            <Cite s={S.thorBlog} />, and Jetson Orin Nano Super holds 8 GB at 102 GB/s within
            25 W.
            <Cite s={S.orinNanoSuperPage} />
            <Cite s={S.orinNanoDatasheet} /> LPDDR buys capacity per watt and per dollar, and its
            bandwidth is the ceiling: decode on all three tracks memory bandwidth, which is why MoE
            (Mixture of Experts) models and quantized SLMs (Small Language Models) run well here
            and dense 70B models run slowly.
          </Box>
          <Box variant="p">
            <strong>Why they share a page.</strong> &quot;Unified memory&quot; is one promise
            delivered by two mechanisms. GB10 joins a CPU dielet and a GPU dielet with a coherent
            chip-to-chip link
            <Cite s={S.gb10HotChips} />; a Jetson module is one Tegra SoC (system on chip) whose
            CPU and integrated GPU share the same DRAM.
            <Cite s={S.tegraAppNote} /> The mechanism decides what coherence costs: Spark and Thor
            keep CPU and GPU caches coherent in hardware in both directions, and Orin only in one.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The rack-scale coherent-memory idea at desk and robot scale, and the sections that explain its parts"
          >
            One idea at four scales
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A GB200 NVL72 rack holds about 30 TB of memory, 13.4 TB of HBM3e (High Bandwidth
            Memory) plus 17 TB of LPDDR5X, in one NVLink domain with 130 TB/s of aggregate
            bidirectional bandwidth.
            <Cite
              s={S.gb200Nvl72}
              kind="derived"
              note="13.4 TB HBM3e + 17 TB LPDDR5X = 30.4 TB, our sum of the two per-rack figures on the page."
            />
            <Cite
              s={S.blackwellUltraBlog}
              kind="derived"
              note="72 GPUs x 1.8 TB/s bidirectional = 129.6 TB/s, which NVIDIA gives as 130 TB/s aggregate; neither page labels the aggregate's direction."
            />{' '}
            Spark and Thor carry the same idea at 128 GB and Orin Nano Super at 8 GB: put the
            model where CPU and GPU both reach it without a copy. Between Thor and Orin sits
            the Jetson T4000 module, 64 GB at 273 GB/s in a 40 to 70 W envelope at up to 1,200
            FP4 TFLOPS sparse.
            <Cite s={S.t4000Blog} /> Shared CPU-GPU memory also reaches Windows PCs as RTX Spark:
            laptops and compact desktops with a 20-core Grace CPU, a Blackwell GPU and up to 128 GB
            of unified memory, announced for October 2026; the announcement gives no memory
            bandwidth and names no chip.
            <Cite s={S.rtxSpark} kind="roadmap" note="Announced 2026-09-03 for October 2026. The post does not name the chip, and its 1 petaflop GPU figure carries no sparse or dense label." />
          </Box>
          <Box variant="p">
            Background: <em>Roofline and Arithmetic Intensity</em> (why batch-1 decode is
            bandwidth-bound), <em>DDR5, MRDIMM, LPDDR5X and CXL</em> (what LPDDR5X trades for its
            capacity) and <em>Grace-Blackwell and UltraServer</em> (NVLink-C2C at rack scale).{' '}
            <em>Small Language Models</em> and <em>Quantization and Precision</em> cover the model
            side.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="How the GPU reaches the pool on each machine, and the spec rows to compare before choosing one"
          >
            Same promise, three memory systems
          </Header>
        }
      >
        <SpaceBetween size="m">
          <EdgeSocComparisonDiagram />
          <Table
            items={specRows}
            columnDefinitions={[
              { id: 'spec', header: 'Spec', cell: (r) => r.spec, minWidth: 120 },
              { id: 'spark', header: 'DGX Spark (GB10)', cell: (r) => r.spark, minWidth: 200 },
              { id: 'thor', header: 'Jetson AGX Thor (T5000)', cell: (r) => r.thor, minWidth: 170 },
              { id: 'orin', header: 'Jetson Orin Nano Super', cell: (r) => r.orin, minWidth: 170 },
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
            description="What lstopo and nvidia-smi show on a physical Spark, and the capacity figure to plan against"
          >
            Inside GB10, measured on our own machine
          </Header>
        }
      >
        <SpaceBetween size="m">
          <SparkTopologyCapture />
          <Box variant="p">
            We ran lstopo, lscpu and nvidia-smi on a physical DGX Spark in July 2026.
            <Cite s={S.sparkNotes} /> Each ten-core cluster mixes five Cortex-X925 cores (2 MB L2)
            with five Cortex-A725 cores (512 KB L2)
            <Cite s={S.sparkLstopo} kind="measured" />, and the porting guide also describes five high-performance
            and five high-efficiency cores per cluster.
            <Cite s={S.sparkPortingGuide} /> lscpu reports maximum clocks of 3.9 GHz on the X925
            cores and 2.8 GHz on the A725 cores
            <Cite s={S.sparkLscpu} kind="measured" />; NVIDIA publishes no CPU clock in the
            hardware overview, the product page or the Hot Chips slides.
          </Box>
          <Box variant="p">
            The L3 slices differ: lstopo shows 8 MB on one cluster and 16 MB on the other.
            <Cite s={S.sparkLstopo} kind="measured" /> NVIDIA&apos;s documents disagree with that
            and with each other. The porting guide gives 16 MB to a &quot;high-performance
            cluster&quot; and 8 MB to a &quot;high-efficiency cluster&quot;, which contradicts its
            own mixed-cluster description
            <Cite s={S.sparkPortingGuide} />, and the Hot Chips slides give 16 MB per cluster.
            <Cite s={S.gb10HotChips} />
          </Box>
          <Box variant="p">
            The whole machine is one NUMA (non-uniform memory access) node: all twenty cores and
            122 GB, the host view of the 128 GB after carve-outs, with the GPU&apos;s CPU affinity
            spanning cores 0 to 19.
            <Cite s={S.sparkLstopo} kind="measured" />
            <Cite s={S.sparkNotes} kind="measured" /> Size models against about 122 GB, not 128.
          </Box>
          <Alert type="info" header="Unified memory shows up in nvidia-smi">
            nvidia-smi reports the GPU&apos;s Memory-Usage as &quot;Not Supported&quot;, because
            there is no dedicated VRAM pool to report, while its process list still shows each
            process&apos;s GPU allocation (a Python process at 2,772 MiB in our capture).
            <Cite s={S.sparkNvidiaSmi} kind="measured" /> Watch GPU memory per process. The GPU
            allocates from the LPDDR5X the CPU uses, so a 70B-class quantized model is addressable
            without a discrete GPU&apos;s VRAM budget.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why memory bandwidth sets GB10's decode limit, and where Orin still makes software pay for sharing"
          >
            The CPU-GPU link decides what coherence costs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Unified memory means the CPU and GPU read and write the same physical pages. Two
            properties of the mechanism reach the developer: whether the GPU&apos;s path to memory
            is as wide as the memory, and whether software must run cache maintenance when work
            passes between CPU and GPU.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Spark: two dielets, one coherent link</Box>
              <Box variant="p">
                GB10 is two dielets in TSMC 3 nm on 2.5D packaging: an S-dielet with the CPU and
                the memory subsystem, and a G-dielet with the Blackwell GPU.
                <Cite s={S.gb10HotChips} /> The GPU reaches the LPDDR5X over NVLink-C2C
                (chip-to-chip), the link that also joins Grace to Blackwell in{' '}
                <em>Grace-Blackwell and UltraServer</em>, at about 600 GB/s aggregate
                <Cite
                  s={S.gb10HotChips}
                  note="GPU has access to entire system bandwidth over the C2C interface; ~600GB/s of aggregate bandwidth."
                />
                , which NVIDIA also expresses as 5x the bandwidth of PCIe Gen 5.
                <Cite s={S.gb10Newsroom} /> The link is wider than the 273 GB/s memory behind it,
                so memory sets the decode ceiling. Coherence is two-way in hardware, which removes
                the overhead of cache maintenance operations.
                <Cite s={S.gb10HotChips} />
              </Box>
            </div>
            <div>
              <Box variant="h3">Jetson: one SoC, coherence by generation</Box>
              <Box variant="p">
                On Tegra parts &quot;both the CPU (Host) and the iGPU share SoC DRAM memory&quot;,
                so there is no chip-to-chip link to cross. On Orin, coherency is one-way (I/O
                coherency): the GPU still runs its cache maintenance at kernel launch and
                synchronization, and the app note&apos;s unified-memory examples attach managed
                buffers to a stream with <code>cudaStreamAttachMemAsync</code>. Thor is the
                first Jetson with full two-way coherency, which removes both CPU and GPU cache
                maintenance.
                <Cite s={S.tegraAppNote} />
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What each machine draws, and which marketed figure to size a workload against"
          >
            Power, and reading the headline numbers
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">DGX Spark: 240 W supply, 140 W SoC</Box>
              <Box variant="p">
                The external supply is rated 240 W and the GB10 SoC TDP is 140 W, leaving 100 W
                for the rest of the system.
                <Cite s={S.sparkHardware} /> At idle our unit drew about 10 W on the GPU at 39 C.
                <Cite s={S.sparkNvidiaSmi} kind="measured" />
              </Box>
            </div>
            <div>
              <Box variant="h3">Jetson: power modes chosen per deployment</Box>
              <Box variant="p">
                Orin Nano runs in modes from 7 to 25 W.
                <Cite s={S.orinNanoDatasheet} /> MAXN_SUPER raises the CPU from 1.5 to 1.7 GHz,
                memory bandwidth from 68 to 102 GB/s and sparse INT8 from 40 to 67 TOPS (tera
                operations per second)
                <Cite s={S.orinNanoSuperPage} />, on the same hardware: earlier Orin Nano kits
                gain the mode with a JetPack upgrade.
                <Cite s={S.orinSuperBoostBlog} /> Check which mode a deployment runs, because the
                mode sets the bandwidth that decode tracks. Thor runs from 40 to 130 W.
                <Cite s={S.thorBlog} />
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="warning" header="The headline compute figures are sparse">
            Spark&apos;s 1 PFLOP FP4 is a sparse figure
            <Cite s={S.sparkHardware} note="Hardware overview: up to 1 PFLOP at FP4 precision with sparsity." />, and
            NVIDIA publishes no dense figure for it in the hardware overview, the product page or
            the Hot Chips slides. Thor&apos;s 2,070 TFLOPS is sparse FP4.
            <Cite s={S.thorBlog} /> Orin&apos;s 67 TOPS is sparse INT8; the module datasheet puts
            dense INT8 at 33 TOPS.
            <Cite s={S.orinNanoDatasheet} /> Size LLM inference that does not use structured
            sparsity from dense figures where they exist. <em>Roofline and Arithmetic Intensity</em>{' '}
            explains why: peak FLOPS are conditional, and decode is bound by bandwidth.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The decode rates that show why MoE models and quantized small models suit 273 GB/s, and dense 70B models do not"
          >
            Which models decode well here
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={decodeRows}
            columnDefinitions={[
              { id: 'device', header: 'Device', cell: (r) => r.device, minWidth: 80 },
              {
                id: 'model',
                header: 'Model (precision, backend)',
                cell: (r) => (
                  <>
                    {r.model} ({r.setup})
                  </>
                ),
                minWidth: 120,
              },
              { id: 'decode', header: 'Decode (tokens/s)', cell: (r) => r.decode, minWidth: 100 },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            NVFP4 is NVIDIA&apos;s 4-bit floating point and MXFP4 the Open Compute Project&apos;s
            microscaling 4-bit format (<em>Quantization and Precision</em>); MLC is Machine
            Learning Compilation. The NVIDIA Spark rows are vendor figures from October 2025, the
            70B row is a third-party measurement from the same month, and the Orin rows come from
            NVIDIA&apos;s Jetson AI Lab.
          </Box>
          <Box variant="p">
            Dense Llama 3.1 70B in FP8 fits in Spark&apos;s 128 GB and decodes at 2.7 tokens/s
            <Cite s={S.lmsysSpark} kind="measured" />, because every token streams about 70 GB of
            weights through 273 GB/s. gpt-oss-120b holds 117B parameters and activates 5.1B per
            token
            <Cite s={S.gptOss120bReadme} />, and NVIDIA reports 55.37 tokens/s for it on the same
            machine.
            <Cite s={S.sparkPerfBlog} kind="vendor-claim" /> Capacity holds every expert;
            bandwidth pays only for the active ones.
          </Box>
          <Box variant="p">
            Throughput moves with software. In January 2026 NVIDIA reported that llama.cpp
            updates raised MoE throughput on DGX Spark by 35% on average, and that NVFP4 with
            speculative decoding runs Qwen-235B on two Sparks up to 2.6x faster than FP8.
            <Cite s={S.sparkSoftwareBlog} kind="vendor-claim" /> Treat the table as an October
            2025 snapshot and measure on the current llama.cpp or TensorRT-LLM build before
            sizing.
          </Box>
          <Box variant="p">
            On Jetson, NVIDIA rates the 8 GB Orin Nano for LLMs and VLMs (vision language models)
            up to nearly 4B parameters, such as Qwen2.5-VL-3B or Gemma-3/4B.
            <Cite s={S.jetsonEdgeAiBlog} /> Jetson Orin Nano 2, announced for the first half of
            2027, keeps 8 GB and claims 78 TOPS and twice the inference performance of Orin Nano
            Super through improved Tensor Cores and higher memory bandwidth; the announcement gives
            no bandwidth figure.
            <Cite s={S.orinNano2} kind="roadmap" /> With 8 GB again, the size of model that fits
            does not change.
          </Box>
          <ExpandableSection headerText="Clustering Sparks: capacity scales, per-unit bandwidth does not">
            <SpaceBetween size="s">
              <Box variant="p">
                A ConnectX-7 NIC (network interface card) at 200 Gbps links up to four DGX Spark
                systems. The product page sizes two units (256 GB) for models up to 400B
                parameters and four (512 GB) for up to 700B
                <Cite s={S.sparkProductPage} />, while the hardware overview gives 405B for a
                dual-Spark configuration.
                <Cite s={S.sparkHardware} /> These are capacity figures. NVIDIA&apos;s worked
                example runs Qwen3 235B on two units at 11.73 tokens/s decode (NVFP4,
                TensorRT-LLM)
                <Cite s={S.sparkPerfBlog} kind="vendor-claim" />, and the official playbook
                measures the pair&apos;s link at 189.85 Gbps of RoCE traffic (remote direct memory
                access over Converged Ethernet).
                <Cite s={S.twoSparksPlaybook} kind="measured" /> Each unit still decodes through
                its own 273 GB/s.
              </Box>
              <Box variant="p">
                A 64 GB Spark is rated for models up to 100B parameters, and in NVIDIA&apos;s Qwen
                3.8 27B test two clustered 64 GB units delivered up to 1.7x the performance of one.
                <Cite s={S.spark64Gb} kind="vendor-claim" /> The product page&apos;s specification
                table lists both memory options and a single bandwidth, 273 GB/s.
                <Cite s={S.sparkProductPage} />
              </Box>
              <Box variant="p">
                On our single unit, with no cable attached, no ConnectX-7 device enumerates in{' '}
                <code>lspci</code>: two NVIDIA PCI bridges have nothing behind them.
                <Cite s={S.sparkNotes} kind="measured" /> The playbook&apos;s two-unit setup lists
                the RoCE interfaces once the units are cabled.
                <Cite s={S.twoSparksPlaybook} /> Whether the NIC stays powered down until a cable
                is attached is unresolved, so an empty <code>lspci</code> on an uncabled unit does
                not prove the NIC is missing.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Divide bandwidth by bytes per token to predict decode speed before buying; two published runs land at about 70 and 75% of that ceiling"
          >
            The roofline check
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The method from <em>Roofline and Arithmetic Intensity</em>, as our own arithmetic:
            batch-1 decode cannot exceed memory bandwidth divided by the bytes read per token,
            roughly the active weight footprint. Spark with Llama 3.1 70B at FP8 reads about 70 GB
            per token; 273 GB/s gives a ceiling near 3.9 tokens/s, and LMSYS measured 2.7.
            <Cite s={S.lmsysSpark} kind="derived" note="273 / 70 = 3.9 tokens/s; 2.7 / 3.9 = 69%. LMSYS does not state the batch size for this run." />{' '}
            Jetson Orin Nano Super with Llama 3.1 8B at INT4 reads about 4 GB per token; 102 GB/s
            gives a ceiling near 25.5 tokens/s, and Jetson AI Lab reports 19.14.
            <Cite s={S.jetsonAiLab} kind="derived" note="102 / 4 = 25.5 tokens/s; 19.14 / 25.5 = 75%." />{' '}
            The two land at about 70 and 75% of the bandwidth ceiling, which leaves room for KV
            (key-value) cache reads and scheduling overhead on top of the weight stream.
          </Box>
          <Alert type="info" header="Why prefill runs so much faster">
            Spark prefills at thousands of tokens per second: NVIDIA reports 10,256.9 tokens/s
            for Llama 3.1 8B (NVFP4, TensorRT-LLM, 2,048 input tokens).
            <Cite s={S.sparkPerfBlog} kind="vendor-claim" /> Prefill reuses each weight fetch
            across many tokens, so it rides the compute roofline; decode rides the bandwidth
            roofline. <em>Disaggregated Serving and Speculative Decoding</em> builds a serving
            design on that asymmetry.
          </Alert>
        </SpaceBetween>
      </Container>

      <ExpandableSection
        variant="container"
        headerText="Open items: what NVIDIA does not publish"
        headerDescription="Gaps this research could not close, and what stands in for each"
      >
        <SpaceBetween size="s">
          <Box variant="p">
            1. Dense FP4 throughput for Spark, and Tensor Core and RT (ray tracing) Core counts for
            GB10: not in
            the hardware overview, the product page or the Hot Chips slides; the slides add 31
            TFLOPS FP32.
            <Cite s={S.gb10HotChips} />
          </Box>
          <Box variant="p">
            2. GB10 CPU clocks: not in those three sources; our lscpu reading stands in.
          </Box>
          <Box variant="p">
            3. Memory bandwidth for RTX Spark and Jetson Orin Nano 2: not given in the NVIDIA
            announcements read for this section.
          </Box>
          <Box variant="p">
            4. The ConnectX-7 NIC missing from <code>lspci</code> on our uncabled Spark: likely
            powered down without a cable, unresolved.
          </Box>
          <Box variant="p">
            5. Whisper-class ASR (automatic speech recognition) benchmarks on the Orin Nano tier:
            none located at Tier 1 or 2 during this research; AGX Orin tables exist.
          </Box>
        </SpaceBetween>
      </ExpandableSection>

      <Container
        header={
          <Header
            variant="h2"
            description="Five checks that decide whether a shared LPDDR pool fits a workload"
          >
            Evaluation lens
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <ul>
              <li>
                Is the workload capacity-bound (large model, small batch) or bandwidth-bound (fast
                decode)? Shared LPDDR helps the first and caps the second at 273 GB/s on Spark and
                Thor.
              </li>
              <li>
                Is the marketed TOPS or FLOPS figure sparse or dense, and does the workload use
                structured sparsity?
              </li>
              <li>
                For a two-die design, is the CPU-GPU link wider than the memory behind it? On
                GB10, about 600 GB/s aggregate against 273 GB/s, so memory sets the ceiling.
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li>
                Does the deployment need coherence (zero-copy sharing, in-place KV-cache handoff
                between CPU and GPU) or only capacity? Spark and Thor provide two-way coherence in
                hardware; on Orin the GPU side still pays cache maintenance.
              </li>
              <li>
                What does the same dollar buy in cloud inference, and is data locality, privacy
                or iteration speed the reason for edge hardware?
              </li>
            </ul>
          </div>
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
}
