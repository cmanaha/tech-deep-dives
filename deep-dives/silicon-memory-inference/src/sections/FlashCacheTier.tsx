import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { FlashTierLadder } from '../components/FlashTierLadder';
import { FlashBreakEvenChart } from '../components/FlashBreakEvenChart';
import { FlashMemoryClock } from '../components/FlashMemoryClock';
import { FlashBlockIoDiagram } from '../components/FlashBlockIoDiagram';
import { Cite } from '../components/Cite';
import { S } from '../sources/FlashCacheTier';

const breakEvenNote =
  'B* = KV bytes per token x node dense FLOPS / prefill FLOPs per token, where prefill FLOPs per token = 2 x active parameters + layers x query heads x (qk + v head dims) x prefix length. Llama 3.1 70B (80 layers, 64 query heads, 8 KV heads, head dim 128) at an 8K prefix: 327,680 B x 8 x 989.5 TFLOPS / 151.8 GFLOPs = 17.1 GB/s per node, 2.1 per GPU.';
const sparseNote =
  'NVIDIA lists Tensor Core peaks with sparsity; dense is half: 989.5 TFLOPS BF16 and 1,979 TFLOPS FP8 per H100 or H200, 4.5 PFLOPS FP8 per B200.';
const floorNote =
  '4,400,000 IOPS x 4,096 B = 18.0 GB/s per instance, 2.25 GB/s per GPU. AWS rates the IOPS aggregated, at 4 KiB, at queue depth saturation.';
const tierRateNote =
  'EBS 12,500 MB/s / 8 = 1.56 GB/s per GPU; FSx 1,200 Gb/s = 150 GB/s per instance, 18.75 per GPU; FSx over EFA without GDS 700 Gb/s = 87.5 GB/s, 10.9 per GPU; FSx without EFA 100 Gb/s = 12.5 GB/s, 1.56 per GPU; EFA 3,200 Gb/s = 400 GB/s per instance, 50 per GPU; PCIe Gen5 at 128 GB/s per H200 across both directions = 64 GB/s per direction (line rate), 512 GB/s across eight GPUs.';
const fsxPerGpuNote =
  'Per-client ceilings / 8 bits / 8 GPUs: 1,200 Gb/s = 18.75 GB/s per GPU, 700 Gb/s = 10.9, 100 Gb/s = 1.56. Break-even 2.1 GB/s per GPU for Llama 3.1 70B at an 8K prefix on 8x H100. These are documented maximums; AWS gives no test setup behind them.';
const fsxSizingNote =
  'Disk-bound: 150,000 MB/s / 1,000 MB/s per TiB = 150 TiB, rounded up to 32 steps of 4.8 TiB = 153.6 TiB. Network-bound: 150,000 / 2,600 = 57.7 TiB, rounded up to 13 x 4.8 = 62.4 TiB. The hot set must fit its RAM cache: 62.4 x 27.3 GiB per TiB = 1,704 GiB. Assumes the per-TiB rates add linearly and one client reaches the 1,200 Gb/s ceiling; no AWS measurement located in this research shows either.';
const clockNote =
  'Usable KV space assumed: about 900 GB of HBM (8 x 141 GB x 0.92, the vLLM default gpu_memory_utilization, minus 141 GB of BF16 weights), 1.5 TB of the 2,048 GiB of host DRAM, 30.4 TB of instance store. Fill rate: 50% of 8 x 989.5 TFLOPS over 1.24 PFLOP per 8K prefix = 26,000 tokens/s. 2.75 M tokens / 26,000 = 105 s; 4.58 M = 176 s; 92.8 M = 3,560 s.';
const blockNote =
  '16 tokens x 327,680 B = 5.24 MB per node; / 8 GPUs = 655 KB; / 80 layers = 8 KiB. 18 GB/s / 8 KiB = 2.2 M IOPS; 18 GB/s / 655 KB = 27,000 IOPS.';

interface InstanceRow {
  instance: string;
  flash: React.ReactNode;
  iops: string;
  floor: string;
  ebs: string;
}

const perGpu = '3.8 TB per GPU';
const instanceRows: InstanceRow[] = [
  { instance: 'p5.48xlarge, p5e.48xlarge', flash: `8 x 3,800 GB, ${perGpu}`, iops: '4.4 M', floor: '18.0 GB/s, 2.25 per GPU', ebs: '10,000 MB/s' },
  { instance: 'p5en, p6-b200, p6-b300 (.48xlarge)', flash: `8 x 3,800 GB, ${perGpu}`, iops: '4.4 M', floor: '18.0 GB/s, 2.25 per GPU', ebs: '12,500 MB/s' },
  {
    instance: 'p6e-gb200.36xlarge (4 GPUs)',
    flash: (
      <>
        3 x 7,500 GB, 5.6 TB per GPU; 405 TB per 72-GPU UltraServer
        <Cite s={S.p6Page} />
      </>
    ),
    iops: '2.55 M',
    floor: '10.4 GB/s, 2.6 per GPU',
    ebs: '7,500 MB/s',
  },
  { instance: 'trn2.48xlarge (16 Trainium2)', flash: '4 x 1,900 GB, 475 GB per chip', iops: '1.72 M', floor: '7.0 GB/s, 0.44 per chip', ebs: '10,000 MB/s' },
];

export function FlashCacheTier() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="When reading a prefix's KV cache from NVMe beats recomputing it, how long each tier remembers, and what to switch on first on P5 and P6"
          >
            Flash as a Cache Tier for Inference
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What a flash cache tier is.</strong> A flash cache tier puts NVMe (Non-Volatile Memory Express)
            flash below GPU HBM (High Bandwidth Memory) and host DRAM in the KV (key-value) cache hierarchy of an
            inference server. It holds the KV of prompt prefixes that later requests will reuse, so a cache hit turns
            prefill compute into a read. <em>KV Cache and FlashAttention</em> covers what the cache holds and how
            fast it grows.
          </Box>
          <Box variant="p">
            <strong>Why it matters.</strong> Reading KV beats recomputing it once a tier delivers more than a fixed
            bandwidth, and for a dense 70B model on an 8x H100 node that bar is about 17 GB/s per node, about 2 GB/s
            per GPU, even at peak compute.
            <Cite s={S.llama3Herd} kind="derived" note={breakEvenNote} /> The NVMe instance store in every 8-GPU P5
            and P6 instance is rated at a floor level with that bar, and what flash adds is time: under full prefill
            load, HBM holds about 105 seconds of a node&apos;s new prefixes and the instance store about an hour.
            <Cite s={S.ec2AcceleratedSpecs} kind="derived" note={clockNote} />
          </Box>
          <FlashTierLadder />
          <Box variant="small" color="text-body-secondary">
            HBM<Cite s={S.h200Page} />; host memory, EFA (Elastic Fabric Adapter), EBS (Elastic Block Store) and the
            instance store&apos;s IOPS (I/O operations per second)
            <Cite s={S.ec2AcceleratedSpecs} /><Cite s={S.ec2AcceleratedSpecs} kind="derived" note={floorNote} />; PCIe
            Gen5 host link<Cite s={S.h200Page} />; FSx for Lustre with EFA and GDS (GPUDirect Storage), over EFA
            alone and without EFA<Cite s={S.fsxPerformance} />; Mooncake Store and the Valkey BLOB (binary large object)
            module, drawn at the EFA line rate<Cite s={S.mooncakeStoreDesign} /><Cite s={S.valkeyLargeObject} />; per-GPU rates<Cite s={S.ec2AcceleratedSpecs} kind="derived" note={tierRateNote} />;
            HBF stack capacity<Cite s={S.ocpHbfSpec} /> and bandwidth, a roadmap part
            <Cite s={S.sandiskHbf} kind="vendor-claim" />.
          </Box>
          <Box variant="p">
            <strong>Flash on the package is a different tier.</strong> High Bandwidth Flash (HBF) stacks NAND beside
            HBM on the accelerator package. The OCP (Open Compute Project) specification fixes 512 GiB per 16-high
            stack and 0.384 to 3.072 TB/s per stack
            <Cite s={S.ocpHbfSpec} />, and Sandisk claims 1.6 TB/s for its first product, about 700x the instance
            store&apos;s per-GPU floor.
            <Cite s={S.sandiskHbf} kind="vendor-claim" note="HBF is not shipping." /><Cite s={S.sandiskHbf} kind="derived" note="1,600 GB/s / 2.25 GB/s = 711." />{' '}
            Our reading: HBF serves
            bytes read on every decode step, and a flash cache tier serves bytes read once per hit. Per-token KV stays
            off HBF because limited write endurance makes it &quot;infeasible for KV Cache data updated for every
            query or generation token&quot;.
            <Cite s={S.maPatterson} /> <em>High Bandwidth Flash</em> covers the device.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="One ratio, and one number for a dense 70B on Hopper (about 17 GB/s per node), tell you whether a tier is fast enough before you buy it"
          >
            When reading KV beats recomputing it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A prefix hit can produce its KV two ways. Recomputing costs about 2 FLOPs per active parameter per token,
            plus attention work that grows with the prefix; fetching costs the KV bytes divided by the tier&apos;s
            bandwidth. The break-even bandwidth B* is KV bytes per token times node FLOPS divided by prefill FLOPs
            per token, and a tier faster than B* wins.
            <Cite s={S.llama3Herd} kind="derived" note={breakEvenNote} />
          </Box>
          <FlashBreakEvenChart />
          <Box variant="small" color="text-body-secondary">
            Model shapes<Cite s={S.llama3Herd} /><Cite s={S.llama70bApi} /><Cite s={S.qwen3Config} /><Cite s={S.qwen3Readme} />
            <Cite s={S.deepseekV3Config} /><Cite s={S.deepseekV3Report} />; dense peaks<Cite s={S.h100Page} note={sparseNote} />
            <Cite s={S.h200Page} note={sparseNote} /><Cite s={S.dgxB200} note={sparseNote} />; tier rates
            <Cite s={S.ec2AcceleratedSpecs} kind="derived" note={tierRateNote} /><Cite s={S.fsxPerformance} />
            <Cite s={S.h200Page} />. Every line is our arithmetic at 100% of dense peak; at 50% MFU (Model FLOPs
            Utilization) every line halves.
          </Box>
          <Box variant="p">
            <strong>The model sets the bar.</strong> B* follows KV bytes per token per active parameter: 4,645 per
            billion for Llama 3.1 70B in BF16 (bfloat16), 8,751 for Qwen3-235B-A22B, a sparse MoE (Mixture of
            Experts) with 22B active, and 1,899 for DeepSeek-V3&apos;s MLA (Multi-head Latent Attention) cache.
            <Cite s={S.qwen3Config} kind="derived" note="327,680 / 70.55 = 4,645; 192,512 / 22 = 8,751; 70,272 / 37 = 1,899." />{' '}
            DeepSeek-V4.1-Flash stores 890 B of global KV cache per token
            <Cite s={S.deepseekV41Flash} />, 111 per billion of its 8B prefill-active parameters, about 40x below a
            dense 70B.
            <Cite s={S.deepseekV41Flash} kind="derived" note="890 / 8 = 111; 4,645 / 111 = 42." /> Faster GPUs raise
            the bar: on 8x B200 at FP8 the same 70B needs 77.7 GB/s at an 8K prefix, 4.5x Hopper&apos;s 17.1, and FP8
            KV halves that to 38.8. On Hopper, moving both KV and compute to FP8 leaves B* where it was.
            <Cite s={S.dgxB200} kind="derived" note={sparseNote} /> Longer prefixes lower it, because attention
            FLOPs grow with the square of the prefix and KV bytes linearly: 18.2 GB/s at 1K, 8.3 at 128K for the 70B
            on Hopper.
            <Cite s={S.llama3Herd} kind="derived" note={breakEvenNote} />
          </Box>
          <Box variant="p">
            <strong>Using it.</strong> Compare B* for your model with the tier&apos;s per-node rate, scaled by your
            MFU. On Hopper the dense 70B bar sits at or under the instance store&apos;s floor; Blackwell and wide-cache
            MoE models at short prefixes need more than that published floor, from FSx, EFA or host DRAM.
          </Box>
          <ExpandableSection headerText="Assumptions, a worked example and a cross-check">
            <Box variant="p">
              Prefill FLOPs are 2 x active parameters x prefix plus causal attention; one 8-GPU node serves one
              replica; the fetch is not overlapped with compute, the worst case for fetch, although LMCache,
              Dynamo&apos;s KV Block Manager (KVBM) and Mooncake all pipeline layer by layer. For Llama 3.1 70B at an
              8K prefix on 8x H100, the prefix holds 2.68 GB of KV and costs 1.24 PFLOP: 0.157 s at peak, 0.314 s at
              50% MFU. Fetching it takes 0.149 s at the instance-store floor, 0.215 s at the EBS cap, 0.018 s from FSx
              with GDS, 0.0067 s over EFA and 0.0052 s from host DRAM at PCIe line rate.
              <Cite s={S.ec2AcceleratedSpecs} kind="derived" note={tierRateNote} /> Mooncake&apos;s authors reach the
              same order: Llama3-70B at an 8K prefix gains from reuse once KV loads at 6 GB/s per 8x A800 node, or 19
              GB/s per 8x H800.
              <Cite s={S.mooncakeFast} kind="simulated" note="Mooncake's analytical model (its Equation 2), not a hardware measurement." /> For MLA models, tensor-parallel attention that makes every
              rank load the full latent multiplies flash reads by the parallel degree unless blocks are broadcast;
              KVBM&apos;s <code>DYN_KVBM_NCCL_MLA_MODE</code> covers that case.
              <Cite s={S.dynamoKvbmDocs} />
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="HBM holds about 105 seconds of a busy node's new prefixes and local flash about an hour, so you can match each tier to the gap between a user's turns or an agent's tool calls"
          >
            How long each tier remembers
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A tier&apos;s memory is the time new prefixes take to fill it: the tokens it holds divided by the rate at
            which misses create KV. A p5en serving Llama 3.1 70B, prefilling new 8K prefixes at 50% MFU, creates
            about 26,000 tokens of KV a second, which fills HBM in about 105 seconds and the instance store in about
            an hour.
            <Cite s={S.ec2AcceleratedSpecs} kind="derived" note={clockNote} /><Cite s={S.vllmCacheConfig} note="gpu_memory_utilization default 0.92." />{' '}
            Every hit lowers the fill rate, so real horizons run longer.
          </Box>
          <FlashMemoryClock />
          <Box variant="small" color="text-body-secondary">
            Tier horizons<Cite s={S.ec2AcceleratedSpecs} kind="derived" note={clockNote} />; tool-call waits
            <Cite s={S.dynamoAgenticBlog} kind="measured" />; DeepSeek disk cache<Cite s={S.deepseekCaching} />.
          </Box>
          <Box variant="p">
            <strong>What reuse looks like.</strong> In NVIDIA&apos;s analysis of Claude Code sessions, every call
            after the first to the same worker hits 85% to 97% of the prefix, reads outnumber writes 11.7 to 1, and a
            2 to 30 second wait for a tool call can let the agent&apos;s blocks age out of GPU memory; reasoning
            tokens, about 40% of generated tokens, are almost never reused.
            <Cite s={S.dynamoAgenticBlog} kind="measured" /> In the Mooncake trace from Kimi, the hit ratio rises
            from 30% to 50% as one shared pool grows from 1,000 to 50,000 blocks of 512 tokens, then stays flat, and
            more than half the blocks are never reused.
            <Cite s={S.mooncakeArxiv} kind="measured" /> DeepSeek serves its API from a disk cache that clears unused
            entries &quot;within a few hours to a few days&quot;
            <Cite s={S.deepseekCaching} />, and prices cache-hit input at 1/50 (deepseek-flash) to 1/30
            (deepseek-v4-pro) of cache-miss input.
            <Cite s={S.deepseekPricing} />
          </Box>
          <Box variant="p">
            <strong>Match the tier to the gap.</strong> HBM catches same-turn and back-to-back requests, seconds
            apart. Host DRAM catches tool-call gaps and fast multi-turn chat, minutes apart. Local flash catches human
            think time, session resumption and system prompts shared across sessions on one node, up to about an hour
            of full-load history. Shared flash catches reuse across nodes, scale-out warm-up and anything longer. For
            compressed caches capacity stops being the limit: 30.4 TB holds 34 billion tokens of DeepSeek-V4.1-Flash
            global KV cache.
            <Cite s={S.deepseekV41Flash} kind="derived" note="30.4 TB / 890 B per token = 34 billion tokens." />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Every 8-GPU P5 and P6 instance carries 30.4 TB of NVMe at no extra charge: what AWS rates it at, and the setting in each serving stack that turns it into a KV tier"
          >
            The flash you already pay for on P5 and P6
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every 8-GPU P5, P5e, P5en, P6-B200 and P6-B300 instance carries 8 x 3,800 GB of NVMe instance store,
            30.4 TB, rated at 4.4 million random-read IOPS at 4 KiB.
            <Cite s={S.ec2AcceleratedSpecs} /> It is included in the instance price
            <Cite s={S.instanceStore} />, and its data does not survive a stop, hibernation or termination
            <Cite s={S.instanceStoreLifetime} />, which suits KV because KV can be recomputed.
          </Box>
          <Table
            items={instanceRows}
            columnDefinitions={[
              { id: 'instance', header: 'Instance', cell: (r) => r.instance, minWidth: 150 },
              { id: 'flash', header: 'Instance store', cell: (r) => <>{r.flash}<Cite s={S.ec2AcceleratedSpecs} /></> },
              { id: 'iops', header: '4 KiB random-read IOPS', cell: (r) => <>{r.iops}<Cite s={S.ec2AcceleratedSpecs} /></> },
              {
                id: 'floor',
                header: 'IOPS-implied read floor',
                cell: (r) => <>{r.floor}<Cite s={S.ec2AcceleratedSpecs} kind="derived" note="IOPS x 4,096 B, divided by accelerators." /></>,
              },
              { id: 'ebs', header: 'EBS cap', cell: (r) => <>{r.ebs}<Cite s={S.ec2AcceleratedSpecs} /></> },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="p">
            <strong>What the rating says, and what it leaves out.</strong> AWS publishes no large-I/O GB/s for
            instance store. The 4 KiB rating alone implies at least 18 GB/s per 8-GPU instance, 2.25 GB/s per GPU
            <Cite s={S.ec2AcceleratedSpecs} kind="derived" note={floorNote} />, level with the 17 GB/s break-even
            for a dense 70B on Hopper. Keep KV off EBS: its per-instance cap of 10,000 to 12,500 MB/s is below both.
            <Cite s={S.ec2AcceleratedSpecs} /> AWS lists no instance-store figure for Trn3 or P6e-GB300 on the EC2
            specification page or the Trn3 product page.
            <Cite s={S.trn3Page} />
          </Box>
          <Box variant="p">
            <strong>Turning it into a KV tier.</strong> Each serving stack has one setting that points its disk tier
            at a local path such as the instance store mount. Pick one offload backend per deployment: Dynamo&apos;s
            docs call LMCache, FlexKV and HiCache &quot;alternatives, not cache layers to stack together&quot;.
            <Cite s={S.dynamoOffloadOverview} /> Section 7, <em>KV-Cache Offloading &amp; Tiers</em>, in the{' '}
            <Link href="../vllm/">vLLM Inference Engine</Link> dive covers how offload works inside the engine.
          </Box>
          <ul>
            <li>
              <strong>NVIDIA Dynamo KVBM</strong> (G1 GPU, G2 pinned host, G3 disk, G4 object storage):{' '}
              <code>DYN_KVBM_DISK_CACHE_GB</code> with <code>DYN_KVBM_DISK_CACHE_DIR</code> turns on G3, and{' '}
              <code>DYN_KVBM_CPU_CACHE_GB</code> turns on G2.
              <Cite s={S.dynamoKvbmDocs} />
            </li>
            <li>
              <strong>SGLang HiCache</strong> (L1 GPU, L2 host DRAM private to one instance, L3 storage): an L3
              backend, <code>file</code> for local disk or <code>mooncake</code>, <code>hf3fs</code>,{' '}
              <code>nixl</code> or <code>aibrix</code> for shared storage.
              <Cite s={S.sglangHicache} />
            </li>
            <li>
              <strong>vLLM OffloadingConnector</strong> (HBM, CPU RAM, filesystem): a <code>secondary_tiers</code>{' '}
              entry with <code>type: fs</code>.
              <Cite s={S.llmdTieredDoc} />
            </li>
            <li>
              <strong>LMCache</strong>: the local-disk backend, with each GPU given its own path on a dedicated drive.
              <Cite s={S.lmcache} />
            </li>
          </ul>
          <ExpandableSection headerText="Three things AWS does not publish, and how to measure them">
            <ul>
              <li>
                The large-I/O read rate: run <code>fio</code> sequential reads and 640 KiB to 10 MiB random reads
                across all eight drives.
              </li>
              <li>
                The drive model and PCIe generation: <code>nvme id-ctrl</code> and <code>lspci -vv</code>.
              </li>
              <li>
                Whether GDS reaches HBM directly. From CUDA 12.8, GDS can use the upstream kernel PCI peer-to-peer DMA
                (P2PDMA) path for local NVMe, switched on with <code>&quot;use_pci_p2pdma&quot;: true</code> in{' '}
                <code>/etc/cufile.json</code>.
                <Cite s={S.gdsOverview} /><Cite s={S.gdsReleaseNotes} /> No AWS document located in this research
                says this works on instance-store NVMe; the GDS path found in AWS documentation is FSx for Lustre.
                <Cite s={S.fsxEfa} /> Where P2P is unavailable, cuFile falls back to a compatibility mode through host
                memory.
                <Cite s={S.gdsOverview} /> Check with <code>gdscheck -p</code>.
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Page-first layouts make KV offload a GB/s problem that GPUDirect Storage or a host bounce already serves; 512-byte drives and GPU-initiated I/O are for reads a few KiB wide"
          >
            Who moves the bytes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Three paths carry KV between flash and HBM. A CPU bounce copies NVMe to host DRAM and then to HBM. GDS
            keeps the CPU on the control path through the cuFile API and lands the DMA (direct memory access) directly
            in GPU memory.
            <Cite s={S.gdsOverview} /> GPU-initiated I/O moves the control path onto the GPU too: GPU threads build
            NVMe commands, ring doorbells and poll completions, as in the BaM research system
            <Cite s={S.bam} /> and NVIDIA&apos;s SCADA (scaled, accelerated data access), where a daemon sets up the
            queues and stays off the hot path.
            <Cite s={S.storageLender} /><Cite s={S.nvidiaStorageBlog} kind="vendor-claim" />
          </Box>
          <FlashBlockIoDiagram />
          <Box variant="small" color="text-body-secondary">
            Block arithmetic<Cite s={S.llama3Herd} kind="derived" note={blockNote} />; page-first layouts
            <Cite s={S.sglangHicache} /><Cite s={S.vastBlog} kind="vendor-claim" />; GDS and BaM by I/O size
            <Cite s={S.bam} kind="measured" />; instance-store IOPS<Cite s={S.ec2AcceleratedSpecs} />.
          </Box>
          <Box variant="p">
            <strong>Layout sets the I/O size.</strong> One 16-token block of Llama 3.1 70B KV is 655 KB per GPU:
            stored layer by layer, 80 reads of 8 KiB; stored page-first, one read.
            <Cite s={S.llama3Herd} kind="derived" note={blockNote} /> BaM&apos;s authors measured CPU-initiated GDS
            filling a PCIe Gen4 x16 link only at 32 KiB and above, and reaching 23.6% of it at 4 KiB.
            <Cite s={S.bam} kind="measured" /> Default blocks run from 16 tokens in vLLM
            <Cite s={S.vllmCacheConfig} /> and 32 in KVBM
            <Cite s={S.dynamoKvbmCode} /> to a recommended 64 in HiCache
            <Cite s={S.sglangHicacheBp} /> and 256-token chunks in LMCache&apos;s example configurations.
            <Cite s={S.lmcache} /> With a page-first layout, KV offload is a bandwidth workload that TLC
            (triple-level cell) NVMe with GDS or a host bounce serves. Watch for layer-first layouts on flash, which
            turn the same bytes into millions of small reads.
          </Box>
          <ExpandableSection headerText="Drives, 512-byte IOPS and CXL flash">
            <SpaceBetween size="s">
              <Box variant="p">
                A PCIe Gen6 data-center drive such as the Micron 9650 reads 28,000 MB/s sequentially and 5.5 million
                4 KiB random reads a second, at 60 µs typical read latency at queue depth 1; its Gen5 predecessor reads
                14,000 MB/s and 3.3 million.
                <Cite s={S.micron9650} kind="vendor-claim" /> At 4 KiB the Gen6 drive is already near its bandwidth
                limit: 22.5 GB/s of 28.
                <Cite s={S.micron9650} kind="derived" note="5.5 M x 4,096 B = 22.5 GB/s." />
              </Box>
              <Box variant="p">
                A second class chases IOPS at 512 bytes for GPU-initiated reads, under NVIDIA&apos;s Storage-Next
                initiative.
                <Cite s={S.kioxiaStorageNext} /> Kioxia&apos;s GP1 claims up to 10 million random reads a second at
                512 B and up to 50 DWPD (drive writes per day), with evaluation samples by the end of 2026 and later
                generations targeting 100 million
                <Cite s={S.kioxiaGp1} kind="vendor-claim" /><Cite s={S.kioxiaGp1} kind="roadmap" />; SK hynix plans AI-N P samples by the end of 2026.
                <Cite s={S.skhynixAin} kind="roadmap" /> Ten million 512 B reads is 5.1 GB/s
                <Cite s={S.kioxiaGp1} kind="derived" note="10 M x 512 B = 5.1 GB/s." />: these drives serve sub-4
                KiB random reads of the kind BaM targets. No primary source located in this research measures them on
                a KV workload.
              </Box>
              <Box variant="p">
                CXL (Compute Express Link) hybrid flash puts a DRAM cache in front of NAND behind the CPU.
                Samsung&apos;s CMM-H prototype, an FPGA controller with 16 GB of DRAM over a 1 TB TLC SSD, reached 4.5
                GB/s against 219 GB/s for local DDR5, with 99.99th-percentile reads at about 450 ns while data fits the
                DRAM cache and about 15 µs once a 32 GB region misses to NAND.
                <Cite s={S.cmmH} kind="measured" /><Cite s={S.cmmH} kind="roadmap" note="An FPGA prototype, not a shipping product." /> <em>DDR5, MRDIMM, LPDDR5X and CXL</em> covers CXL memory.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="When a shared cache is worth the network hop, why FSx for Lustre allows one GPU instance up to 150 GB/s only if created with EFA, and how to predict a vendor's 20x time-to-first-token (TTFT) claim"
          >
            Sharing context across nodes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A node-local tier hits only when the router sends a request back to the node holding its prefix, and
            routers rank lower tiers lower: read from the code, Dynamo credits a prefix block in pinned host memory
            at 0.75 of a GPU hit and on disk at 0.25 by default.
            <Cite s={S.dynamoRouterCode} /> SGLang makes cross-instance reuse &quot;the job of L3&quot;
            <Cite s={S.sglangHicache} />, and Mooncake pools DRAM and SSD across nodes because its authors found
            local DRAM reached about half the theoretical hit rate.
            <Cite s={S.mooncakeFast} kind="measured" /> They report it lets Kimi handle 115% (A800) and 107% (H800)
            more requests in the FAST 2025 paper, and 75% more in the later arXiv version.
            <Cite s={S.mooncakeFast} kind="measured" /><Cite s={S.mooncakeArxiv} kind="measured" />
          </Box>
          <Box variant="p">
            <strong>Shared flash on AWS.</strong> FSx for Lustre allows one client up to 100 Gb/s without EFA,
            700 Gb/s with EFA and 1,200 Gb/s (150 GB/s) with EFA and GDS.
            <Cite s={S.fsxPerformance} /> EFA is set only when the file system is created
            <Cite s={S.fsxEfa} />, and that choice puts the per-GPU ceiling at 18.75 GB/s with EFA and GDS, 10.9
            with EFA or 1.56 without, either side of the ladder&apos;s 2.1 GB/s break-even.
            <Cite s={S.fsxPerformance} kind="derived" note={fsxPerGpuNote} /> GDS clients are P5, P5e, P5en,
            P6-B200 and P6-B300, and EFA clients are Nitro v4 or later EFA instances outside the trn2 family.
            <Cite s={S.fsxEfa} />
          </Box>
          <ExpandableSection headerText="FSx sizing and latency figures">
            <SpaceBetween size="s">
              <Box variant="p">
                An EFA file system at PERSISTENT-1000 is created in 4.8 TiB steps
                <Cite s={S.fsxGettingStarted} />, and one GDS client at full rate needs 153.6 TiB when disk-bound
                (writes, uncached reads) or 62.4 TiB for reads from the servers&apos; memory cache, about 1.7 TiB at
                that size.
                <Cite s={S.fsxSsd} /><Cite s={S.fsxPerformance} /><Cite s={S.fsxSsd} kind="derived" note={fsxSizingNote} />
              </Box>
              <Box variant="p">
                An AWS Storage Blog post&apos;s four-tier framing (HBM, host DRAM, FSx for Lustre, S3) gives FSx 100
                to 500 µs without a measurement
                <Cite s={S.awsStorageKvBlog} kind="vendor-claim" />; the FSx pages located in this research say only
                &quot;sub-millisecond&quot;.
                <Cite s={S.fsxSsd} />
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            <strong>S3 and EFS.</strong> S3 Express One Zone gives single-digit millisecond access
            <Cite s={S.s3Express} />, which suits large chunks fetched ahead of use; KVBM&apos;s G4 tier and the{' '}
            <code>obj</code> plugin of NIXL (NVIDIA Inference Xfer Library) target S3.
            <Cite s={S.dynamoKvbmDocs} /><Cite s={S.nixl} /> NIXL reaches storage through the same plugin
            architecture it uses between GPUs, and its libfabric plugin maps GPUs to EFA devices
            <Cite s={S.nixl} />: <em>Disaggregated Serving and Speculative Decoding</em> covers the GPU-to-GPU half,
            and the <Link href="../efa/">Elastic Fabric Adapter</Link> dive covers EFA. llm-d&apos;s AWS guide puts
            its shared filesystem tier on Amazon EFS (Elastic File System) and recommends Max I/O mode
            <Cite s={S.llmdAwsEfs} />, which AWS calls a previous-generation mode with higher per-operation latency,
            recommending General Purpose for all file systems.
            <Cite s={S.efsPerformance} /> The llm-d connector leaves eviction to the storage system.
            <Cite s={S.llmd} />
          </Box>
          <Box variant="p">
            <strong>Pooled DRAM on AWS.</strong> A pool of peer DRAM rides EFA at 3,200 Gb/s per p5en or p6-b200,
            6,400 on p6-b300.
            <Cite s={S.ec2AcceleratedSpecs} /> Mooncake Store pools DRAM that its clients contribute and moves KV
            between them with its Transfer Engine
            <Cite s={S.mooncakeStoreDesign} /><Cite s={S.mooncakeTransferTask} />, whose EFA transport registers GPU
            buffers as CUDA memory and ships in the separate <code>mooncake-transfer-engine-efa</code> wheels.
            <Cite s={S.mooncakeEfaMr} /><Cite s={S.mooncakeEfaBuild} note="USE_EFA defaults to OFF." /><Cite s={S.mooncakeEfaWheel} />{' '}
            The Valkey BLOB module, <code>valkey-large-object</code>, keeps large values such as KV tensors in
            DRAM, optionally backed by NVMe, with optional EFA transport; it is pre-release, with an API
            experimental until 1.0.
            <Cite s={S.valkeyLargeObject} note="GitHub API on 2026-10-24: no tags and no releases; crate version 0.1.0." />
            <Cite s={S.valkeyAcceptance} kind="roadmap" /> Its clients located in this research register host memory.
            <Cite s={S.lmcacheValkeyPr} /><Cite s={S.lmcacheValkeyL1} /><Cite s={S.glideRdma} /> No ElastiCache
            offering of it was located in this research, which leaves self-managed Valkey on EC2.
            <Cite s={S.elasticacheVersions} />
          </Box>
          <Box variant="p">
            <strong>The managed option.</strong> SageMaker HyperPod managed tiered KV cache runs an L1 in local CPU
            memory and a cluster-wide L2, with <code>tieredstorage</code> (recommended) or <code>redis</code> as the
            L2 backend, behind <code>kvCacheSpec.enableL2Cache</code>.
            <Cite s={S.hyperpodWhatsNew} /><Cite s={S.hyperpodBlog} /> AWS measured Llama-3.1-70B on seven
            p5.48xlarge replicas at 64K context: median TTFT down 94% and throughput up 38% with L1, L2 and
            intelligent routing, against a baseline without them.
            <Cite s={S.hyperpodBlog} kind="vendor-claim" /> The SageMaker docs describe tiered storage as &quot;a
            pooled memory tier that spans cluster nodes&quot;
            <Cite s={S.hyperpodKvDocs} />; only the What&apos;s New post mentions &quot;automatic tiering from CPU
            memory to local SSD&quot;
            <Cite s={S.hyperpodWhatsNew} />, so treat flash inside it as undocumented.
          </Box>
          <ExpandableSection headerText="NVIDIA CMX: a flash tier behind a DPU">
            <Box variant="p">
              NVIDIA CMX (context memory storage) puts BlueField-4 DPUs (data processing units, 800 Gb/s) in front of
              an Ethernet-attached flash tier for KV that NVIDIA labels G3.5, between node-local SSD (G3) and shared
              storage (G4), and treats KV as &quot;transient, derived, and recomputable if lost&quot;.
              <Cite s={S.dpuPage} kind="roadmap" /><Cite s={S.cmxBlog} /> NVIDIA claims up to 5x the tokens per second of
              traditional storage, with BlueField-4 due in the second half of 2026.
              <Cite s={S.cesRelease} kind="vendor-claim" /><Cite s={S.cesRelease} kind="roadmap" /> No AWS offering of
              it was located in this research.
            </Box>
          </ExpandableSection>
          <Box variant="p">
            <strong>Reading a vendor&apos;s claim.</strong> Every headline number from a storage vendor located in
            this research is the vendor&apos;s own, measured against recomputing a long prefix or against HBM alone.
            VAST and CoreWeave report Llama-3.1-405B with a 127,188-token prompt on 8x H100: 62 s TTFT with prefill
            against 3 s loading KV from VAST over 2 x 100 Gb/s NFS (Network File System), peaking at 198 Gb/s.
            <Cite s={S.vastBlog} kind="vendor-claim" /> At FP16 that prompt holds 65.6 GB of KV, which takes 2.65 s
            at 198 Gb/s
            <Cite s={S.llama3Herd} kind="derived" note="2 x 126 layers x 8 KV heads x 128 x 2 B = 516,096 B per token; x 127,188 = 65.6 GB; / 24.75 GB/s = 2.65 s. Assumes FP16 KV." />:
            the 20x comes from the prefix length and the link. The Nebius and WEKA run replayed production agentic
            coding traffic on one 8x B300 node for 8 hours: hit rate 93% against 40% for HBM alone, p95 TTFT 3.82 s
            against 23.12 s, and 3.7x the output tokens per GPU-hour.
            <Cite s={S.nebiusWeka} kind="vendor-claim" /> No independent measurement of any of these products was
            located in this research. Ask any vendor for hit rate, p95 TTFT, link speed and context length.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Host DRAM first, local flash with an admission filter second, shared flash third, and the counters that say whether each step pays"
          >
            Building the tier, in order
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol>
            <li>
              <strong>Host DRAM tier first, larger than the GPU KV pool.</strong> Dynamo recommends a CPU cache of
              at least 100 GB and larger than the device cache; a smaller one makes KVBM churn, &quot;offloading
              blocks after every forward pass&quot;.
              <Cite s={S.dynamoKvbmDocs} /> A p5en or P6-B200 carries 2,048 GiB of host memory, 256 GiB per GPU.
              <Cite s={S.ec2AcceleratedSpecs} /> <em>DDR5, MRDIMM, LPDDR5X and CXL</em> covers what sets this
              tier&apos;s bandwidth.
            </li>
            <li>
              <strong>Local flash next, with an admission filter.</strong> Add the disk tier when the working set
              outgrows HBM plus host DRAM, size it at least as large as the host tier
              <Cite s={S.dynamoKvbmDocs} />, and give each GPU its own drive path.
              <Cite s={S.lmcache} /> Keep the admission filter on: more than half the blocks in the Mooncake trace
              are never reused
              <Cite s={S.mooncakeArxiv} kind="measured" />, and a 1 DWPD 30.72 TB drive absorbs about 356 MB/s of
              continuous writes.
              <Cite s={S.micron9650} kind="derived" note="30.72 TB x 1 drive write per day / 86,400 s = 356 MB/s." />{' '}
              Read from the code at v1.5.1, Dynamo&apos;s default writes a block to disk on its second sighting, with
              counts decaying every 600 seconds; the docs say only that the filter can be disabled.
              <Cite s={S.dynamoKvbmCode} /><Cite s={S.dynamoKvbmFilter} />
            </li>
            <li>
              <strong>Shared flash when reuse crosses nodes.</strong> FSx for Lustre created with EFA, used with
              GDS and sized for throughput; a storage vendor&apos;s KV store; or HyperPod&apos;s managed tier. On FSx
              the connector makes the tier shared: vLLM&apos;s <code>fs</code> tier with every instance on one{' '}
              <code>root_dir</code>, or LMCache&apos;s GDS or <code>fs_native</code> backend.
              <Cite s={S.vllmFsTierDoc} /><Cite s={S.lmcacheGds} /><Cite s={S.lmcacheFsNative} /><Cite s={S.lmcacheFsNativeExists} />{' '}
              KVBM&apos;s disk tier there is one private file per worker process, deleted on exit.
              <Cite s={S.dynamoKvbmDisk} />
            </li>
          </ol>
          <Box variant="p">
            <strong>What to monitor.</strong> Watch load bytes against store bytes, which vLLM exports as{' '}
            <code>vllm:kv_offload_load_bytes</code> and <code>vllm:kv_offload_store_bytes</code>
            <Cite s={S.vllmOffloadMetrics} />: a tier written far more than it is read spends drive endurance and
            bandwidth for no TTFT gain. Track the hit rate, <code>vllm:external_prefix_cache_hits_total</code> over{' '}
            <code>vllm:external_prefix_cache_queries_total</code>.
            <Cite s={S.llmd} /> If the hit rate climbs and TTFT does not fall, compare the tier&apos;s bandwidth with
            the break-even for that model: for a dense 70B on Hopper, about 17 GB/s per node.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
