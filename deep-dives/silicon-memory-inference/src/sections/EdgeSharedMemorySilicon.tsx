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
import { EdgeSocComparisonDiagram } from '../components/EdgeSocComparisonDiagram';
import { SparkTopologyCapture } from '../components/SparkTopologyCapture';

interface SpecRow {
  spec: string;
  spark: string;
  jetson: string;
}

const specRows: SpecRow[] = [
  { spec: 'CPU', spark: '20 cores: 10x Cortex-X925 + 10x Cortex-A725 (Armv9.2)', jetson: '6x Cortex-A78AE, homogeneous (Armv8.2)' },
  { spec: 'CPU topology', spark: 'Two mixed clusters, each 5x X925 (2 MB L2) + 5x A725 (512 KB L2); L3 16 MB + 8 MB', jetson: 'One quad cluster + one dual cluster, same core type' },
  { spec: 'CPU clocks', spark: '3.9 GHz X925 / 2.8 GHz A725 (Tier 0, our unit; NVIDIA publishes none)', jetson: '1.5 GHz base, 1.7 GHz MAXN_SUPER' },
  { spec: 'GPU', spark: 'Blackwell, 6,144 CUDA cores, 5th-gen Tensor Cores', jetson: 'Ampere, 1,024 CUDA cores, 32 Tensor Cores' },
  { spec: 'AI perf (marketed)', spark: 'Up to 1 PFLOP FP4, sparse (no dense figure published)', jetson: '67 TOPS INT8 sparse; 33 TOPS dense' },
  { spec: 'Memory', spark: '128 GB LPDDR5X, unified and coherent', jetson: '8 GB LPDDR5, shared SoC DRAM' },
  { spec: 'Memory bus', spark: '256-bit, LPDDR5X-8533', jetson: '128-bit' },
  { spec: 'Bandwidth', spark: '273 GB/s', jetson: '68 GB/s base, 102 GB/s MAXN_SUPER' },
  { spec: 'CPU-GPU link', spark: 'NVLink-C2C, coherent, "5x PCIe Gen 5" (no absolute GB/s published)', jetson: 'None: CPU and iGPU share one memory controller' },
  { spec: 'Power', spark: '240 W PSU, 140 W SoC TDP', jetson: '7 to 25 W configurable modes' },
  { spec: 'Scale-out', spark: 'ConnectX-7 200 Gbps, two-unit cluster up to 405B params', jetson: 'None (single module)' },
  { spec: 'Price', spark: 'UNKNOWN in this research pass (see product page)', jetson: '$249 developer kit' },
];

interface BenchRow {
  device: string;
  model: string;
  decode: string;
  source: string;
}

const benchRows: BenchRow[] = [
  { device: 'DGX Spark', model: 'Llama 3.1 8B (NVIDIA-published config)', decode: '38.65 t/s', source: 'NVIDIA blog (Tier 2)' },
  { device: 'DGX Spark', model: 'gpt-oss-20B (MXFP4, llama.cpp)', decode: '50 to 80 t/s (sources disagree)', source: 'llama.cpp thread / JetsonHacks (Tier 3)' },
  { device: 'DGX Spark', model: 'gpt-oss-120B (MXFP4, llama.cpp)', decode: '35 to 53 t/s', source: 'llama.cpp thread / JetsonHacks (Tier 3)' },
  { device: 'DGX Spark', model: 'Llama 3.1 70B (FP8, SGLang, batch 1)', decode: '2.7 t/s', source: 'LMSYS review (Tier 3)' },
  { device: '2x DGX Spark', model: 'Qwen3 235B (over ConnectX-7)', decode: '11.73 t/s', source: 'NVIDIA blog (Tier 2)' },
  { device: 'Orin Nano Super', model: 'Llama 3.2 3B (INT4, MLC)', decode: '43.07 t/s', source: 'Jetson AI Lab (Tier 2)' },
  { device: 'Orin Nano Super', model: 'Llama 3.1 8B (INT4, MLC)', decode: '19.14 t/s', source: 'Jetson AI Lab (Tier 2)' },
  { device: 'Orin Nano Super', model: 'Gemma 2 9B (INT4, MLC)', decode: '9.21 t/s', source: 'Jetson AI Lab (Tier 2)' },
];

export function EdgeSharedMemorySilicon() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The NVL72 unified-memory idea, scaled down to a desk and to a robot"
          >
            Edge shared-memory silicon: DGX Spark and Jetson Orin Nano
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>TLDR.</strong> Both machines put CPU and GPU on one memory
            pool, so the whole pool is model-addressable: no PCIe copy, no
            separate VRAM budget. The pool is LPDDR, not HBM, so capacity is
            generous and bandwidth is the ceiling. DGX Spark (GB10) gives 128 GB
            at 273 GB/s behind a 240 W plug; Jetson Orin Nano Super gives 8 GB
            at 102 GB/s inside 25 W. Decode speed on both tracks memory
            bandwidth, which is why the community runs MoE (Mixture of Experts) models and quantized SLMs (Small Language Models)
            rather than dense 70B models. Same thesis as Section 1, third
            hardware scale.
          </Box>
          <Box variant="p">
            <strong>Why these two share a page.</strong> They bracket the
            shared-memory design space. Spark is two dies joined by a coherent
            interconnect, a shrunk Grace-Blackwell. Jetson is one SoC where
            sharing is free because there is only one memory controller. Between
            them they show that "unified memory" is one promise with two very
            different mechanisms, and that the mechanism decides what you pay
            for coherence.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Prerequisites and the memory continuum">
            Where this sits in the study
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Read this after Section 3 (roofline: decode at batch 1 is
            bandwidth-bound), Section 7 (LPDDR5X economics: capacity per dollar
            and per watt, at the cost of bandwidth), and Section 14
            (Grace-Blackwell: NVLink-C2C and the coherent-domain idea at rack
            scale). Sections 24 (Small Language Models) and 25 (Quantization)
            explain the model side of what the community runs here.
          </Box>
          <Box variant="p">
            The continuum is the map: an NVL72 rack holds 30 TB of coherent
            memory with a 130 TB/s NVLink domain; a DGX Spark holds 128 GB at
            273 GB/s; a Jetson Orin Nano holds 8 GB at 102 GB/s. Three orders of
            magnitude in capacity and bandwidth, one architectural idea: put the
            model where both CPU and GPU can reach it without copies. Every
            trade-off in this section is the rack-scale trade-off of Section 14
            re-priced for a desk or a robot arm.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Same promise, two mechanisms">
            The two architectures side by side
          </Header>
        }
      >
        <SpaceBetween size="m">
          <EdgeSocComparisonDiagram />
          <Table
            items={specRows}
            columnDefinitions={[
              { id: 'spec', header: 'Spec', cell: (r) => r.spec, minWidth: 140 },
              { id: 'spark', header: 'DGX Spark (GB10)', cell: (r) => r.spark },
              { id: 'jetson', header: 'Jetson Orin Nano Super', cell: (r) => r.jetson },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            Spark figures:{' '}
            <Link external href="https://docs.nvidia.com/dgx/dgx-spark/hardware.html">
              DGX Spark hardware overview
            </Link>
            ,{' '}
            <Link external href="https://www.nvidia.com/en-us/products/workstations/dgx-spark/">
              DGX Spark product page
            </Link>
            {' '}and{' '}
            <Link external href="https://docs.nvidia.com/dgx/dgx-spark-porting-guide/overview.html">
              DGX Spark porting guide
            </Link>
            . Jetson figures: NVIDIA Jetson Orin Nano Series Modules Data Sheet
            DS-11105-001_v1.5 (Dec 2024) and the{' '}
            <Link
              external
              href="https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/nano-super-developer-kit/"
            >
              Orin Nano Super Developer Kit page
            </Link>
            . All accessed 2026-07-18. Spark CPU clocks are our own measurement
            (lscpu on a physical unit, 2026-07-18); NVIDIA does not publish
            them.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Tier 0: lstopo run on a physical DGX Spark"
          >
            Inside GB10, measured on our own machine
          </Header>
        }
      >
        <SpaceBetween size="m">
          <SparkTopologyCapture />
          <Box variant="p">
            Three things in this capture do not appear on any spec sheet. First,
            the clusters are mixed: each ten-core cluster holds five X925
            performance cores and five A725 efficiency cores, visible here by
            their L2 sizes (2 MB vs 512 KB). The porting guide confirms the
            layout
            ({' '}
            <Link external href="https://docs.nvidia.com/dgx/dgx-spark-porting-guide/overview.html">
              DGX Spark porting guide
            </Link>
            , accessed 2026-07-18). Second, the L3 is asymmetric: one cluster
            gets 16 MB, the other 8 MB. Third, the whole machine is one NUMA
            node: all twenty cores and 122 GB of host-visible memory (the 128 GB
            module minus carve-outs) in a single domain, with the GPU&apos;s
            affinity spanning every core.
          </Box>
          <Alert type="info" header="The tell that memory is truly unified">
            nvidia-smi on this machine reports Memory-Usage as &quot;Not
            Supported&quot;. There is no dedicated VRAM pool to report. The GPU
            allocates from the same 128 GB LPDDR5X the CPU uses, which is the
            entire point of the design: a 70B-class quantized model is
            addressable without a discrete GPU&apos;s VRAM budget. Tier 0
            observation, our unit, 2026-07-18; raw evidence in research/dgx-spark/.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Coherent interconnect vs single memory controller"
          >
            The CPU-GPU link is the architectural fork
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Spark: two complexes, one coherent link</Box>
              <Box variant="p">
                GB10 joins a CPU complex and a Blackwell GPU complex with
                NVLink-C2C, the same coherency protocol as Grace-Hopper and
                Grace-Blackwell (Section 14). NVIDIA states the link carries
                &quot;5x the bandwidth of fifth-generation PCIe&quot; and keeps
                CPU and GPU coherent
                ({' '}
                <Link
                  external
                  href="https://nvidianews.nvidia.com/news/nvidia-announces-dgx-spark-and-dgx-station-personal-ai-computers"
                >
                  NVIDIA newsroom
                </Link>
                , accessed 2026-07-18). Teardown analysis describes two TSMC N3
                dies (CPU S-die co-designed with MediaTek, GPU G-die) on a
                CoWoS-R (chip-on-wafer-on-substrate with redistribution layer) interposer, reported by TechInsights and by Hot Chips
                2025 coverage; NVIDIA&apos;s own documentation does not state a
                die count.
              </Box>
            </div>
            <div>
              <Box variant="h3">Jetson: one SoC, sharing is structural</Box>
              <Box variant="p">
                On Tegra-family parts there is nothing to interconnect:
                &quot;both the CPU (Host) and the iGPU share SoC DRAM
                memory&quot;
                ({' '}
                <Link external href="https://docs.nvidia.com/cuda/cuda-for-tegra-appnote/index.html">
                  CUDA for Tegra application note
                </Link>
                , accessed 2026-07-18). Zero-copy mapped memory and unified
                memory allocations land in the same physical LPDDR5. The caveat
                is coherency maintenance: unified memory on Tegra pays cache
                management at kernel launch and sync boundaries, and NVIDIA
                recommends stream-attach prefetch hints to control it.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="warning" header="UNKNOWN: the GB10 C2C number">
            NVIDIA publishes no absolute GB/s figure for NVLink-C2C on GB10.
            The 900 GB/s figure from Grace-Hopper does not transfer. TechInsights
            derives roughly 600 GB/s bidirectional from the &quot;5x PCIe Gen
            5&quot; claim (Tier 3 derivation, 2025-12-05, accessed 2026-07-18).
            Treat any absolute GB10 C2C number you see quoted as derived, not
            vendor-published.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Wall power vs power modes, and reading marketed TOPS"
          >
            Power, and the sparse-numbers trap
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">DGX Spark: 240 W plug, 140 W SoC</Box>
              <Box variant="p">
                The external supply is rated 240 W and the GB10 SoC TDP is
                140 W
                ({' '}
                <Link external href="https://docs.nvidia.com/dgx/dgx-spark/hardware.html">
                  hardware overview
                </Link>
                , accessed 2026-07-18). At idle our unit draws about 10 W on the
                GPU rail at 39 C (Tier 0, 2026-07-18). A community stress test
                reported about 94 W GPU draw at 80 C, and a forum statement
                attributed to an NVIDIA employee puts the GPU ceiling at 120 W
                (Tier 3, unofficial).
              </Box>
            </div>
            <div>
              <Box variant="h3">Jetson: 7 to 25 W, chosen per deployment</Box>
              <Box variant="p">
                Orin Nano exposes configurable power modes from 7 to 25 W, with
                MAXN_SUPER raising CPU, GPU, and memory clocks together. Super
                mode is a JetPack software change on unchanged silicon: the
                same module that shipped at 40 sparse TOPS in 2022 became 67
                sparse TOPS in December 2024, and the developer kit price moved
                from $499 to $249
                ({' '}
                <Link
                  external
                  href="https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost/"
                >
                  NVIDIA developer blog
                </Link>
                , accessed 2026-07-18).
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="warning" header="Both headline numbers are sparse">
            Spark&apos;s &quot;1 PFLOP FP4&quot; carries a product-page footnote:
            theoretical FP4 TOPS using the sparsity feature. Jetson&apos;s
            &quot;67 TOPS&quot; is the sparse INT8 figure; the module datasheet
            puts dense INT8 at 33 TOPS, and only the datasheet says so. LLM
            inference without structured sparsity should be reasoned about from
            the dense numbers. This is the Section 3 lesson applied to marketing:
            peak FLOPs are conditional, bandwidth is not.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Measured decode rates, and the pattern they reveal"
          >
            What the community actually runs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={benchRows}
            columnDefinitions={[
              { id: 'device', header: 'Device', cell: (r) => r.device, minWidth: 110 },
              { id: 'model', header: 'Model (quant, framework)', cell: (r) => r.model },
              { id: 'decode', header: 'Decode', cell: (r) => r.decode, minWidth: 100 },
              { id: 'source', header: 'Source', cell: (r) => r.source },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            Sources, all accessed 2026-07-18:{' '}
            <Link
              external
              href="https://developer.nvidia.com/blog/how-nvidia-dgx-sparks-performance-enables-intensive-ai-tasks/"
            >
              NVIDIA developer blog (2025-10-24)
            </Link>
            ,{' '}
            <Link external href="https://github.com/ggml-org/llama.cpp/discussions/16578">
              llama.cpp DGX Spark performance thread
            </Link>
            ,{' '}
            <Link external href="https://www.lmsys.org/blog/2025-10-13-nvidia-dgx-spark/">
              LMSYS in-depth review (2025-10-13)
            </Link>
            ,{' '}
            <Link external href="https://www.jetson-ai-lab.com/archive/benchmarks.html">
              Jetson AI Lab benchmarks (MLC, Machine Learning Compilation, at INT4)
            </Link>
            . Where two Tier 3 sources disagree (gpt-oss-20B decode: 60.85 vs
            79.74 t/s on different llama.cpp builds) the table shows the range.
            Tokens/sec figures age with every framework release; treat them as
            snapshots, not specs.
          </Box>
          <Box variant="p">
            <strong>The pattern.</strong> The community converged on MoE models
            (gpt-oss-20B/120B, Qwen3-Coder-30B-A3B) and quantized SLMs, not
            dense 70B models. Dense Llama 3.1 70B fits comfortably in
            Spark&apos;s 128 GB and still decodes at 2.7 t/s at batch 1, because
            decode must stream every active weight per token through 273 GB/s.
            MoE splits the difference: capacity holds the full expert set,
            bandwidth only pays for activated experts. On Jetson, NVIDIA itself
            frames the 8 GB module as a machine for models up to roughly 4B
            parameters
            ({' '}
            <Link
              external
              href="https://developer.nvidia.com/blog/getting-started-with-edge-ai-on-nvidia-jetson-llms-vlms-and-foundation-models-for-robotics/"
            >
              NVIDIA edge AI blog, 2025-12-11
            </Link>
            , accessed 2026-07-18), with 3B-class SLMs at around 43 t/s and VLMs (Vision Language Models)
            like Qwen2.5-VL-3B as the ceiling of comfort.
          </Box>
          <ExpandableSection headerText="Two Sparks: the 405B claim vs the worked example">
            <Box variant="p">
              NVIDIA&apos;s product page states two ConnectX-7-linked Sparks
              handle models up to 405B parameters. The concrete worked example
              NVIDIA publishes is Qwen3 235B across two units at 11.73 t/s
              decode, with the pair&apos;s QSFP (Quad Small Form-factor Pluggable) link measured near 190 Gbps RoCE (RDMA over Converged Ethernet) (RDMA over Converged Ethernet)
              in the official playbook. The 405B figure is a capacity claim, not
              a throughput claim: at that scale the pair still decodes through
              the same two 273 GB/s memory systems. Community attempts to push
              past it (GLM-class models at 1-bit quantization over llama.cpp
              RPC) reach 1.5 to 8.9 t/s and their own authors call them
              impractical (Tier 4, NVIDIA forum, 2026-06-25).
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Our derivation: bandwidth ceilings vs measured decode"
          >
            The roofline check
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 3&apos;s method, applied here and labeled as our own
            arithmetic: batch-1 decode cannot exceed memory bandwidth divided by
            bytes moved per token (roughly the active weight footprint). Spark,
            Llama 3.1 70B at FP8: 70 GB per token into 273 GB/s gives a ceiling
            near 3.9 t/s; LMSYS measured 2.7. Jetson, Llama 3.1 8B at INT4:
            about 4 GB per token into 102 GB/s gives a ceiling near 25 t/s;
            Jetson AI Lab measured 19.14. Both land at 70 to 80 percent of the
            bandwidth ceiling, which is normal once KV (key-value) cache reads and
            scheduling overhead join the weight stream.
          </Box>
          <Alert type="info" header="Why prefill feels so much faster">
            The same machines prefill at thousands of tokens per second (Spark:
            10,256.9 t/s on Llama 3.1 8B, NVIDIA-published). Prefill batches
            many tokens per weight fetch, so it rides the compute roofline;
            decode rides the bandwidth roofline. EXO Labs built a whole
            deployment pattern on this asymmetry: prefill on Spark, decode on a
            higher-bandwidth machine (Tier 3, accessed 2026-07-18). That is
            disaggregated serving (Section 26) rediscovered at desk scale.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Questions to ask when this hardware comes up">
            Evaluation lens
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <ul>
              <li>
                Is the workload capacity-bound (big model, small batch) or
                bandwidth-bound (fast decode)? Shared LPDDR helps the first and
                caps the second.
              </li>
              <li>
                Is the marketed TOPS/FLOPS figure sparse or dense, and does the
                workload actually use structured sparsity?
              </li>
              <li>
                For a two-complex design: what is the CPU-GPU link bandwidth,
                and is it vendor-published or derived?
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li>
                Does the deployment need coherence (zero-copy, in-place
                KV-cache handoff) or just capacity? Coherence is the expensive
                promise.
              </li>
              <li>
                What does the same dollar buy in cloud inference, and is local
                data gravity, privacy, or iteration speed the real reason for
                edge hardware?
              </li>
            </ul>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Open items for this section">
            UNKNOWN register
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            1. GB10 NVLink-C2C absolute bandwidth: vendor-unpublished; only the
            relative &quot;5x PCIe Gen 5&quot; claim exists.
          </Box>
          <Box variant="p">
            2. Dense FP4 throughput for Spark and Tensor/RT core counts for
            GB10: not published.
          </Box>
          <Box variant="p">
            3. On our own Spark, no ConnectX-7 device enumerates on the PCI bus
            (two empty NVIDIA bridges instead), while the spec sheet lists it.
            Likely power-gated with no QSFP cable attached; unresolved.
          </Box>
          <Box variant="p">
            4. Whisper-class ASR (automatic speech recognition) officially benchmarked on the Orin Nano tier:
            not found at Tier 1/2 (AGX Orin tables exist).
          </Box>
          <Box variant="p">
            5. Jetson vendor clocks vs Spark: NVIDIA publishes Jetson clocks in
            the module datasheet but no CPU clocks for GB10 anywhere; our
            Tier 0 lscpu measurement stands in.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
