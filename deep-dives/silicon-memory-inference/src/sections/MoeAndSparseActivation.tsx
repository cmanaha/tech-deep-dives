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
import { MoeRoutingDiagram } from '../components/MoeRoutingDiagram';
import { MoeParamsChart } from '../components/MoeParamsChart';

interface SiliconRow {
  silicon: string;
  status: string;
  fabric: string;
  precision: string;
  citation: string;
  url: string;
}

const siliconRows: SiliconRow[] = [
  {
    silicon: 'NVIDIA Blackwell GB200 / GB300 NVL72',
    status: 'Wide-EP (EP > 8) shipped in TensorRT-LLM v0.21.0; fused MoE module; NVFP4 cubins for mid-high concurrency in v1.0',
    fabric: 'MNNVL (Multi-Node NVLink) at 1.8 TB/s per GPU; 130 TB/s aggregate across 72 GPUs',
    precision: 'BF16, FP8, NVFP4 (E2M1, block size 16)',
    citation: 'TRT-LLM Wide-EP, GB200 NVL72 product page',
    url: 'https://github.com/NVIDIA/TensorRT-LLM/tree/main/examples/wide_ep',
  },
  {
    silicon: 'AWS Trainium2 / Trn2 UltraServer',
    status: 'MoE NKI kernels (Router Top-K, MoE CTE, MoE TKG, Blockwise MM) shipped Neuron 2.27.0 (Dec 2025); EP currently uses All-Gather; All-to-All-v is on the roadmap',
    fabric: 'NeuronLink-v3: 1.28 TB/s per chip intra-node, 256 GB/s per chip inter-instance; 64-chip 3D Torus in Trn2 UltraServer',
    precision: 'BF16, FP8 (Neuron compiler emits)',
    citation: 'Neuron SDK release notes 2.27.0',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/release-notes/',
  },
  {
    silicon: 'Cerebras WSE-3',
    status: 'Production MoE inference: Llama 4 Scout / Maverick, Qwen3-235B-A22B, GPT-OSS-120B, GLM-4.7. Reported 2,522 tokens/s on Llama 4 Maverick (third-party benchmark)',
    fabric: 'On-wafer SRAM, no HBM in steady state — expert switching is a wafer-internal routing event',
    precision: 'Vendor-managed; FP16 / BF16 published',
    citation: 'Cerebras inference page',
    url: 'https://www.cerebras.ai/inference',
  },
  {
    silicon: 'Groq LPU',
    status: 'Mixtral and Llama 4 Scout served on GroqCloud; published optimization blog (May 2025); MoE-specific architecture detail not public',
    fabric: 'Deterministic dataflow with on-chip SRAM; cluster-level interconnect undocumented at the level NVLink is',
    precision: 'INT8 production',
    citation: 'Groq pricing / model docs',
    url: 'https://groq.com/',
  },
  {
    silicon: 'SambaNova SN40L / SN50',
    status: 'Samba-CoE published with 150 experts and 1T parameters; SN40L paper claims 3.7x DGX H100 on 8 sockets; current product is SN50',
    fabric: 'Three-tier memory (SRAM / HBM / DDR); inter-RDU fabric details limited in public docs',
    precision: 'BF16',
    citation: 'SN40L arXiv 2405.07518',
    url: 'https://arxiv.org/abs/2405.07518',
  },
  {
    silicon: 'Compute-in-memory (HBM-PIM, HyperCIM)',
    status: 'Samsung HBM-PIM: published gains target generic GEMV / HPC kernels — no MoE benchmark from Samsung; HyperCIM publicly markets a multi-database / data-fabric LPU rather than LLM inference',
    fabric: 'Compute happens inside the memory array — bus traversal eliminated for supported operators',
    precision: 'Constrained to the in-array operator set',
    citation: 'Samsung Tech Blog (PIM)',
    url: 'https://semiconductor.samsung.com/news-events/tech-blog/',
  },
];

export function MoeAndSparseActivation() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Why sparse activation is the single biggest cost lever in 2026 inference, and which silicon is built for it"
          >
            Mixture of Experts and sparse activation
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The architectural shift.</strong> The dominant frontier-model pattern in
            2025-2026 is no longer dense transformers. It is{' '}
            <em>Mixture of Experts</em> (MoE) — a sparse-activation architecture in which a
            small router sub-network selects only{' '}
            <em>top-k of N</em> experts per token, and the remaining experts stay quiet for
            that token. DeepSeek-V3 has 671B total parameters but activates only 37B per
            token. Kimi K2 has 1T total / 32B active. Mixtral 8x7B has 46.7B total / 12.9B
            active. The dense-decoder mental model that dominated 2023-2024 silicon
            roadmaps is now wrong by an order of magnitude for the models that matter most.
          </Box>
          <Box variant="p">
            <strong>Why this section exists in this deep dive.</strong> Section 3 framed
            inference economics around the roofline model. The roofline assumes a known
            arithmetic intensity. MoE rewrites that intensity at runtime: each token reads
            only the selected experts, so bytes-per-token drops by roughly the top-k / N
            ratio. That single change moves decode workloads measurably to the right on the
            roofline, and it moves the comparative ranking of silicon — Cerebras gains
            because experts live in on-wafer SRAM; AWS Trn2 UltraServer gains because the
            64-chip coherent domain handles expert collectives over NeuronLink; NVIDIA
            GB200 NVL72 was sized in part for MoE all-to-all. The bandwidth wall (Section 6)
            still binds, but it binds against a smaller numerator.
          </Box>
          <Box variant="p">
            <strong>What the section covers.</strong> The routing math and the per-token
            byte calculation; the production model lineup with vendor-cited parameter
            counts; the all-to-all communication problem; per-silicon support status with
            Tier 1 citations; where MoE breaks the dense playbook.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A single MoE layer in decode: token → router → top-k experts → weighted combine"
          >
            How routing actually works
          </Header>
        }
      >
        <SpaceBetween size="m">
          <MoeRoutingDiagram />
          <Box variant="p">
            For each token in each MoE layer, a small dense router (a linear projection
            followed by a softmax and a top-k selection) emits scores over the N experts
            and picks the top-k. Only the selected experts process this token; the other
            N-k contribute nothing for this token at this layer. The selected experts&apos;
            outputs are weighted by the router&apos;s scores and summed. The next layer&apos;s
            router may pick an entirely different subset.
          </Box>
          <Box variant="p">
            The economics follow directly. On a dense 70B model, decode reads ~70B
            parameter bytes per token. On DeepSeek-V3 (671B / 37B active, top-8 of 256 +
            1 shared), decode reads roughly 37B bytes per token plus the shared expert and
            attention weights — about 18× less per-token bytes than naively scaling to the
            full 671B. Throughput per HBM byte rises by the same factor. This is the
            single largest lever pulled in inference architecture between 2023 and 2026.
          </Box>
          <Alert type="info" header="The router is dense, the experts are sparse">
            The router must run for every token at every MoE layer. It is small (typically
            &lt; 1% of layer FLOPs) but it cannot be skipped, and it lives on the same
            silicon as the experts. The compiler / kernel must keep router and expert
            scheduling tight or the gate becomes a serialization point, even though the
            FLOPs and bytes look trivial.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The production MoE lineup — all numbers from author docs or HuggingFace model cards"
          >
            What the major MoE models look like
          </Header>
        }
      >
        <SpaceBetween size="m">
          <MoeParamsChart />
          <Box variant="small">
            Parameter counts and routing configurations track each model&apos;s
            authoritative source: Mistral{' '}
            <Link external href="https://mistral.ai/news/mixtral-of-experts/">
              Mixtral
            </Link>
            ; DeepSeek{' '}
            <Link external href="https://huggingface.co/deepseek-ai/DeepSeek-V3">
              DeepSeek-V3 model card
            </Link>
            {' '}and{' '}
            <Link external href="https://arxiv.org/abs/2412.19437">
              technical report
            </Link>
            ; Alibaba Qwen3-235B-A22B model card; OpenAI GPT-OSS model card; Databricks{' '}
            <Link
              external
              href="https://www.databricks.com/blog/introducing-dbrx-new-state-art-open-llm"
            >
              DBRX
            </Link>
            ; Meta{' '}
            <Link external href="https://ai.meta.com/blog/llama-4-multimodal-intelligence/">
              Llama 4
            </Link>
            ; Moonshot Kimi K2 docs. All access dates 2026-04-24.
          </Box>
          <Box variant="p">
            <strong>What this picture shows.</strong> The light bar is total parameter
            count, which determines the memory capacity required to host the model. The
            dark bar is active parameters per token, which determines the HBM bytes read
            per token in decode. The ratio is the sparse-activation ratio. DeepSeek-V3 at
            18:1 and Kimi K2 at 31:1 are the most aggressive — they need a lot of memory
            to hold but very little bandwidth per token, which is the opposite of the
            dense story.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Per-silicon MoE support, with Tier 1 vendor citations"
          >
            How the silicon families handle MoE
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={siliconRows}
            columnDefinitions={[
              { id: 'sil', header: 'Silicon', cell: (r) => r.silicon, minWidth: 200 },
              { id: 'status', header: 'MoE support status', cell: (r) => r.status },
              { id: 'fabric', header: 'All-to-all fabric', cell: (r) => r.fabric },
              { id: 'prec', header: 'Production precision', cell: (r) => r.precision },
              {
                id: 'src',
                header: 'Source',
                cell: (r) => (
                  <Link external href={r.url}>
                    {r.citation}
                  </Link>
                ),
              },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">All vendor-cited rows accessed 2026-04-24.</Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The hidden cost everyone learns about the hard way"
          >
            All-to-all: where MoE pays its tax
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Expert parallelism (EP=N) shards the experts across N devices. The router
            still sees every token, but each token has to be sent to whichever device(s)
            hold its selected experts. Across a batch of tokens, the routing decisions
            are essentially uniform — every device sends a subset of its tokens to every
            other device. This is an{' '}
            <em>all-to-all</em> communication pattern, and on real hardware it is rarely
            free.
          </Box>
          <Alert type="warning" header="NVIDIA's own framing">
            From the NVIDIA Technical Blog on GB200 NVL72 + Dynamo for MoE: &ldquo;If the
            selected experts reside on GPUs that sit on different nodes, the all-to-all
            communication becomes bottlenecked by slower internode communication
            protocols, such as InfiniBand.&rdquo; The blog argues that NVL72 was sized so
            that EP=64 (the minimum to hold all 256 DeepSeek-R1 experts at 4
            experts/GPU) fits inside one NVLink domain at 1.8 TB/s per GPU. That choice
            is an MoE choice, not a generic FLOPs choice
            {' ('}
            <Link
              external
              href="https://developer.nvidia.com/blog/how-nvidia-gb200-nvl72-and-nvidia-dynamo-boost-inference-performance-for-moe-models/"
            >
              NVIDIA Technical Blog
            </Link>
            , accessed 2026-04-24).
          </Alert>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">NVIDIA</Box>
              <Box variant="p">
                MNNVL (Multi-Node NVLink) carries Wide-EP all-to-all on GB200 / GB300
                NVL72; TensorRT-LLM exposes <code>--moe_tp_size</code> /{' '}
                <code>--moe_ep_size</code> with the constraint{' '}
                <code>moe_tp_size × moe_ep_size = tp_size</code>. DeepEP from DeepSeek
                publishes 153 GB/s NVLink intranode and 51 GB/s RDMA at 64-EP on H800/CX7
                ({' '}
                <Link external href="https://github.com/deepseek-ai/DeepEP">
                  DeepEP repo
                </Link>
                , accessed 2026-04-24).
              </Box>
            </div>
            <div>
              <Box variant="h3">AWS Trainium</Box>
              <Box variant="p">
                Today&apos;s Neuron SDK uses All-Gather rather than All-to-All-v for EP;
                the All-to-All-v primitive (<code>torch.all_to_all_vdev_2d</code>) is
                documented as planned. CC-Cores (16 per chip) carry collectives, and the
                Trn2 UltraServer&apos;s 3D Torus over NeuronLink-v3 is the analogous
                fabric story. The gap vs NVIDIA NCCL is real and worth flagging in
                customer conversations.
              </Box>
            </div>
            <div>
              <Box variant="h3">Cerebras</Box>
              <Box variant="p">
                With the entire model resident in on-wafer SRAM, expert &ldquo;routing&rdquo;
                is a wafer-internal event — there is no inter-node fabric to congest. This
                is the architectural reason Cerebras&apos;s third-party-measured Llama 4
                Maverick throughput (Artificial Analysis: 2,522 tokens/s, May 2025) sits
                ahead of dense-equivalent GPU silicon, and it is a Zigfrid Zvezdin
                (Cerebras Solution Architect, STAC London 2026 panelist)
                talking point worth being ready for.
              </Box>
            </div>
            <div>
              <Box variant="h3">Open-source serving</Box>
              <Box variant="p">
                vLLM enables EP via <code>--enable-expert-parallel</code> with kernels
                drawn from CUTLASS / TRT-LLM-Gen / CuTeDSL. SGLang ships the most
                explicit MoE story: <code>--moe-a2a-backend</code> is a swappable enum
                with <code>deepep</code>, <code>flashinfer</code>, <code>mooncake</code>,{' '}
                <code>nixl</code>, <code>mori</code>, <code>ascend_fuseep</code>{' '}
                ({' '}
                <Link external href="https://docs.sglang.ai/">
                  SGLang docs
                </Link>
                , accessed 2026-04-24).
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Quantization, capacity, and disaggregation interact differently with MoE"
          >
            Where MoE breaks the dense playbook
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ExpandableSection
            headerText="Quantization works harder for MoE than for dense"
            defaultExpanded
          >
            <Box variant="p">
              Lower precision compresses the parameter footprint, which matters more for
              MoE because the total parameter count is much larger than the active count.
              NVIDIA reports that NVFP4 (Blackwell&apos;s 4-bit floating point, E2M1,
              16-element block size) reduced the DeepSeek-V3.2 footprint to 415 GB versus
              690 GB at FP8 — a 1.7× reduction, accessed via the{' '}
              <Link
                external
                href="https://developer.nvidia.com/blog/nvidia-blackwell-leads-on-new-semianalysis-inferencemax-benchmarks/"
              >
                NVIDIA Blackwell SemiAnalysis InferenceMAX blog
              </Link>
              {' '}(2026-04-24). FP4 lands a model in fewer GPUs, which lowers EP and
              shrinks the all-to-all fabric requirement. For MoE this is a
              throughput-and-cost change, not just a memory change.
            </Box>
          </ExpandableSection>
          <ExpandableSection headerText="Memory capacity becomes a first-order variable">
            <Box variant="p">
              For dense decode the first-order silicon variable is HBM bandwidth. For MoE
              decode, capacity matters at least as much: a 671B parameter model has to
              live somewhere even if only 37B of it is active per token. NVIDIA&apos;s
              B300 (288 GB HBM3e+) versus B200 (180 GB) and the GB300 NVL72&apos;s 20 TB
              aggregate GPU memory are sized for exactly this. AWS&apos;s Trn2 UltraServer
              (six terabytes of aggregate HBM across 64 chips) lands in the same space.
              Cerebras&apos;s sales argument inverts the question — the model fits because
              the wafer is the memory.
            </Box>
          </ExpandableSection>
          <ExpandableSection headerText="Disaggregated serving and MoE compose well">
            <Box variant="p">
              MoE prefill and MoE decode have different computational profiles — prefill
              activates more experts due to batch dimension, decode is sparser. Several
              production stacks (NVIDIA Dynamo, SGLang, DeepSeek-V3 reference deployment)
              now disaggregate prefill and decode onto different node groups, optimizing
              each for its profile. Section 24 covers the disaggregated serving story in
              detail; for MoE specifically it is the difference between paying for one
              fleet sized for the worse case and paying for two fleets each sized for
              their own case.
            </Box>
          </ExpandableSection>
          <ExpandableSection headerText="Where MoE does not help">
            <Box variant="p">
              MoE&apos;s sparse activation is a decode-phase win and a memory-bandwidth
              win. It does not help compute-bound prefill — every expert in the chosen
              top-k still does full-precision GEMMs on every prompt token, and prefill
              remains compute-bound. It does not help latency-sensitive workloads that
              cannot batch — at batch 1 the all-to-all overhead is unhidden. And it does
              not help capacity-constrained edge or single-GPU deployments where the
              total parameter count cannot fit in available memory regardless of how
              many parameters are active per token. Reach for MoE when the bandwidth-
              vs-capacity ratio is favorable and the request stream supports continuous
              batching; not otherwise.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
