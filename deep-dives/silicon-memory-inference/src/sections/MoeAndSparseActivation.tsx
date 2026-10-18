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
import { Cite } from '../components/Cite';
import { MoeRoutingDiagram } from '../components/MoeRoutingDiagram';
import {
  MoeParamsChart,
  moeModels,
  fmtParams,
  fmtRatio,
  fmtRouting,
} from '../components/MoeParamsChart';
import { S } from '../sources/MoeAndSparseActivation';

interface SiliconRow {
  silicon: string;
  software: React.ReactNode;
  fabric: React.ReactNode;
}

const siliconRows: SiliconRow[] = [
  {
    silicon: 'NVIDIA GB200 and GB300 NVL72',
    software: (
      <>
        Large-scale EP in TensorRT-LLM from v0.21.0
        <Cite s={S.trtllmV021} />; NVFP4 (NVIDIA&apos;s 4-bit floating point) MoE kernels
        &quot;for mid-high concurrency&quot; from v1.0.0.
        <Cite s={S.trtllmV100} />
      </>
    ),
    fabric: (
      <>
        72 GPUs on one NVLink Switch fabric, 1.8 TB/s per GPU bidirectional (900 GB/s each way)
        <Cite s={S.blackwellUltraBlog} />, 130 TB/s per rack
        <Cite s={S.gb200Nvl72} />
      </>
    ),
  },
  {
    silicon: 'NVIDIA Vera Rubin NVL72 with Groq 3 LPX',
    software: (
      <>
        LPX is in full production
        <Cite s={S.lpxProduction} />. In decode, LPX runs the FFN and MoE experts while Rubin
        GPUs keep prefill and decode attention, a loop NVIDIA Dynamo orchestrates.
        <Cite s={S.lpxBlog} />
      </>
    ),
    fabric: (
      <>
        Activations pass between GPUs and LPUs (Language Processing Units) for each token. Each LPU
        works from 500 MB of on-chip SRAM, with up to 512 GB of DRAM per tray behind it.
        <Cite s={S.lpxBlog} />
      </>
    ),
  },
  {
    silicon: 'AWS Trn2 UltraServer (Trainium2)',
    software: (
      <>
        NKI (Neuron Kernel Interface) Library MoE kernels, Router Top-K among them, from Neuron
        2.28.0 (February 2026)
        <Cite s={S.neuronWhatsNew} />; Blockwise MM Forward in MXFP8 (microscaling FP8) from
        2.32.0.
        <Cite s={S.nkiLibNotes} />
      </>
    ),
    fabric: (
      <>
        64 chips. NeuronLink-v3 gives each chip 1,024 GB/s inside its instance plus 256 GB/s
        across instances, 1.28 TB/s in total; a 4x4 2D torus per instance, rings across the
        four.
        <Cite s={S.trn2Arch} />
        <Cite s={S.trainium2Arch} />
      </>
    ),
  },
  {
    silicon: 'AWS Trn3 UltraServer (Trainium3)',
    software: (
      <>
        AllToAllV in the Neuron Runtime for Trn2 and Trn3 from 2.32.0, NKI{' '}
        <code>all_to_all_v</code> from 2.29.0, and MXFP4 (microscaling 4-bit) weights in vLLM
        Neuron.
        <Cite s={S.neuronWhatsNew} />
      </>
    ),
    fabric: (
      <>
        64 (Gen1) or 144 (Gen2) chips on a switched all-to-all fabric that replaces the torus
        <Cite s={S.trn3Arch} />, NeuronSwitch-v1, which AWS positions for MoE.
        <Cite s={S.trn3Page} kind="vendor-claim" />
      </>
    ),
  },
  {
    silicon: 'Cerebras WSE-3',
    software: (
      <>
        Shared inference serves gpt-oss-120b at about 3,000 tokens/s
        <Cite s={S.cerebrasModels} kind="vendor-claim" />; more model families run as
        dedicated deployments.
        <Cite s={S.cerebrasModels} />
      </>
    ),
    fabric: (
      <>
        Weights sit in on-wafer SRAM; larger models split at layer boundaries across systems
        <Cite s={S.cerebrasInferenceBlog} />, so expert routing stays on one wafer.
      </>
    ),
  },
  {
    silicon: 'Groq LPU (GroqCloud)',
    software: (
      <>
        Production MoE models are gpt-oss-120b and gpt-oss-20b.
        <Cite s={S.groqModels} />
      </>
    ),
    fabric: (
      <>
        Groq licenses this architecture to NVIDIA non-exclusively
        <Cite s={S.groqNvidiaLicense} />; it ships in the LPX row above.
      </>
    ),
  },
  {
    silicon: 'SambaNova SN40L, SN50',
    software: (
      <>
        Composition of Experts (CoE) routes each request, not each token, to one of 150 expert
        models (a trillion parameters in total); an 8-socket SN40L node measured 3.7x a DGX H100.
        <Cite s={S.sn40lPaper} kind="measured" /> SN50 is to ship in the second half of 2026.
        <Cite s={S.sn50Blog} kind="roadmap" />
      </>
    ),
    fabric: (
      <>
        Per socket, 520 MiB of SRAM, 64 GiB of HBM (High Bandwidth Memory) and up to 1.5 TiB of
        DDR; models load from DDR into HBM on demand.
        <Cite s={S.sn40lPaper} />
      </>
    ),
  },
];

export function MoeAndSparseActivation() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="An MoE model needs the memory of its total parameters, reads the bytes of its active ones, and needs thousands of tokens in flight to keep each expert busy"
          >
            Mixture of Experts and sparse activation
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A Mixture of Experts (MoE) model replaces each dense feed-forward network (FFN) with
            many smaller expert FFNs and a router that sends every token to a few of them.
            DeepSeek-V3 holds 671B parameters and activates 37B per token.
            <Cite s={S.deepseekV3Readme} /> Recent open-weight releases, among them
            DeepSeek-V4-Pro, Qwen3.8 and Kimi K3, are MoE models of 1.6T to 2.8T parameters.
            <Cite s={S.deepseekV41Flash} />
            <Cite s={S.qwen38Readme} />
            <Cite s={S.kimiK3Readme} />
          </Box>
          <Box variant="p">
            <strong>One size becomes three.</strong> A dense model&apos;s parameter count sets
            its memory, its bytes per token and its FLOPs per token at once. MoE splits them.
            Memory follows total parameters, because every expert must be resident. Bytes and
            FLOPs per token follow active parameters, because a token touches only the experts it
            picks: DeepSeek-V3 reads 18x fewer bytes per token than a dense model of its size.
            <Cite
              s={S.deepseekV3Readme}
              kind="derived"
              note="671B total / 37B active = 18.1."
            />{' '}
            The work each expert does per step follows the tokens routed to it, and with 8 of 256
            routed experts per token, each expert sees about 1/32 of the batch.
            <Cite s={S.deepseekV3Config} kind="derived" note="k / N = 8 / 256 = 1/32." /> That
            last number is why MoE serving spreads experts across many GPUs and runs very large
            batches.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Each token reads attention, the shared expert and its k routed experts, so bytes per token track active over total parameters"
          >
            How routing works
          </Header>
        }
      >
        <SpaceBetween size="m">
          <MoeRoutingDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative layer with 8 experts shown. DeepSeek-V3 figures: 37B of 671B
            <Cite s={S.deepseekV3Readme} />; 8 of 256 routed experts plus 1 shared
            <Cite s={S.deepseekV3Config} />; percentages
            <Cite s={S.deepseekV3Config} kind="derived" note="37 / 671 = 5.5%; 8 / 256 = 3.1%." />.
          </Box>
          <Box variant="p">
            At each MoE layer the router, a learned linear projection, scores every expert for
            the token and keeps the top k. Only those experts run, and their scores weight their
            outputs in the sum. The score is a sigmoid in DeepSeek-V3 and Kimi K2
            <Cite s={S.deepseekV3Config} />
            <Cite s={S.kimiK2Config} /> and sqrtsoftplus in DeepSeek-V4.
            <Cite s={S.deepseekV4ProConfig} /> The next layer&apos;s router may pick a different
            set.
          </Box>
          <Box variant="p">
            A token reads every weight it touches: attention and any dense layers, the shared
            expert, and its k routed experts. Bytes per token therefore fall to roughly active
            over total parameters, a larger fraction than k over N. DeepSeek-V3 ships FP8 (8-bit
            floating point) weights, one byte each
            <Cite s={S.deepseekV3Config} />, so decode at batch 1 reads about 37 GB per token
            where a dense model of the same size would read 671 GB, and a dense 70B model at 8-bit
            weights about 70 GB.
            <Cite
              s={S.deepseekV3Readme}
              kind="derived"
              note="Parameters x 1 byte per FP8 or 8-bit weight."
            />
          </Box>
          <Alert type="info" header="The router is dense, the experts are sparse">
            The router runs for every token at every MoE layer. In DeepSeek-V3 it costs about
            0.5% of the layer&apos;s expert multiply-adds
            <Cite
              s={S.deepseekV3Config}
              kind="derived"
              note="Router 7,168 x 256 = 1.8M multiply-adds; 9 experts x 3 x 7,168 x 2,048 = 396M."
            />
            , but no expert can start until it has chosen, so it sits on the critical path of
            every layer.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Total parameters set the memory to buy, active parameters the bytes each token reads, and the gap between them is the sparsity ratio"
          >
            What the major MoE models look like
          </Header>
        }
      >
        <SpaceBetween size="m">
          <MoeParamsChart />
          <Box variant="small" color="text-body-secondary">
            Log scale. DeepSeek-V4 counts are the card&apos;s backbone parameters. Sources: the
            table below.
          </Box>
          <Box variant="p">
            DeepSeek-V4-Pro (33:1) and Kimi K2 (31:1) are the sparsest models in the lineup, with
            Kimi K3, Qwen3.8 and Qwen3-Next between 25:1 and 27:1; DeepSeek-V3 sits at 18:1 and
            Mixtral 8x7B at 3.6:1. From DeepSeek-V3 to Kimi K3, total parameters grow 4.2x and
            active parameters 2.8x
            <Cite
              s={S.kimiK3Readme}
              kind="derived"
              note="2,800 / 671 = 4.2; 104 / 37 = 2.8."
            />
            : each step up asks for memory faster than for bandwidth per token.
          </Box>
          <ExpandableSection headerText="Figures and sources for the chart">
            <Table
              items={moeModels}
              columnDefinitions={[
                { id: 'name', header: 'Model', cell: (m) => m.name, minWidth: 150 },
                { id: 'total', header: 'Total', cell: (m) => fmtParams(m.totalB), minWidth: 96 },
                { id: 'active', header: 'Active', cell: (m) => fmtParams(m.activeB), minWidth: 96 },
                { id: 'ratio', header: 'Ratio (derived)', cell: (m) => fmtRatio(m), minWidth: 90 },
                {
                  id: 'route',
                  header: 'Experts per token (k of N, +shared)',
                  cell: (m) => fmtRouting(m),
                  minWidth: 140,
                },
                {
                  id: 'src',
                  header: 'Sources',
                  minWidth: 220,
                  cell: (m) => (
                    <>
                      {m.sources.map((s) => (
                        <Cite key={s.url} s={s} />
                      ))}
                    </>
                  ),
                },
              ]}
              variant="embedded"
              wrapLines
            />
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="MoE cuts the bytes each token reads and also the tokens each expert sees, so at any batch size its experts run at lower arithmetic intensity"
          >
            What MoE does to the roofline
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            At batch 1 an expert and a dense layer do the same work per byte: two FLOPs, a
            multiply and an add, per weight read. MoE cuts bytes and FLOPs per token together, so
            it moves decode down the bandwidth axis, toward less time per token, and leaves its
            position on the roofline where it was (see{' '}
            <em>Roofline and Arithmetic Intensity</em>).
          </Box>
          <Box variant="p">
            Batching is where they part. A dense layer reads its weights once per step and applies
            them to every token in the batch. An expert applies its weights only to the tokens
            routed to it: at batch B with k of N experts per token, about B x k / N. For
            DeepSeek-V3 that is 1/32 of the batch, so its experts run at 1/32 the arithmetic
            intensity of a dense layer at the same batch. On an H200 at FP8, a dense layer reaches
            the ridge point at about 206 tokens per step; giving each DeepSeek-V3 expert 206 tokens
            takes about 6,600 tokens in flight per step across the expert group.
            <Cite
              s={S.h200Page}
              kind="derived"
              note="FP8 3,958 TFLOPS with sparsity, so 1,979 dense; 1,979 TFLOPS / 4.8 TB/s = 412 FLOP per byte; 2 FLOPs per 1-byte weight per token reaches it at 206 tokens; 206 x 256 / 8 = 6,592."
            />
          </Box>
          <Box variant="p">
            DeepSeek&apos;s own deployment shows the pressure. Its decode unit spans 40 nodes and
            320 GPUs with expert parallelism of 320, one expert per GPU, and still &quot;the batch
            size per expert is relatively small (usually within 256 tokens), and the bottleneck
            is memory access rather than computation.&quot; Its prefill unit uses 32-way expert
            parallelism, which &quot;ensures that each expert processes a sufficiently large batch
            size.&quot;
            <Cite s={S.deepseekV3Report} note="Section 3.4, Inference and Deployment." />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Expert parallelism exchanges tokens among all its devices twice per layer; keep that exchange inside one scale-up domain"
          >
            All-to-all: where MoE pays for spreading experts
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Expert parallelism (EP) gathers those tokens. Under EP of N, each of N devices holds a
            share of the experts, so each expert receives tokens from the whole group. After the
            router runs, every device sends each token to the devices holding its experts
            (dispatch) and gathers the results back (combine).
            <Cite s={S.deepEpReadme} /> Routing spreads tokens over all experts, so every device
            sends to every other: an all-to-all, twice per MoE layer.
          </Box>
          <Alert type="info" header="NVIDIA's 64-GPU layout inside a 72-GPU domain">
            NVIDIA&apos;s DeepSeek-R1 decode layout places about four routed experts per GPU, so
            64 GPUs hold all 256: EP of 64 inside one GB200 NVL72 domain
            <Cite s={S.moeBlog} />, where each GPU reaches the others at 1.8 TB/s bidirectional.
            <Cite s={S.blackwellUltraBlog} /> NVIDIA names the cost of leaving the domain:
            &quot;If the selected experts reside on GPUs that sit on different nodes, the
            all-to-all communication becomes bottlenecked by slower internode communication
            protocols, such as InfiniBand.&quot;
            <Cite s={S.moeBlog} /> <em>Grace-Blackwell and UltraServer</em> compares that path
            with EFA (Elastic Fabric Adapter) on AWS.
          </Alert>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">NVIDIA</Box>
              <Box variant="p">
                TensorRT-LLM&apos;s Wide-EP path carries the all-to-all over Multi-Node NVLink
                (MNNVL)
                <Cite s={S.wideEpReadme} />; start from the{' '}
                <Link external href={S.wideEpExample.url}>
                  Wide-EP example at v1.2.1
                </Link>
                <Cite s={S.wideEpExample} />. Its LLM API sets the layout with{' '}
                <code>moe_expert_parallel_size</code>, <code>moe_tensor_parallel_size</code> and{' '}
                <code>moe_cluster_parallel_size</code>
                <Cite s={S.trtllmLlmArgs} />, whose product must equal the MoE world size.
                <Cite s={S.trtllmMapping} /> DeepSeek&apos;s DeepEP normal (high-throughput) kernels measured 153 GB/s
                for EP8 dispatch over NVLink and 51 GB/s for EP64 over RDMA (remote direct memory
                access) on H800 GPUs with 400 Gb/s ConnectX-7 cards, close to each link&apos;s
                maximum of about 160 and 50 GB/s.
                <Cite s={S.deepEpReadme} kind="measured" />
              </Box>
            </div>
            <div>
              <Box variant="h3">AWS Trainium</Box>
              <Box variant="p">
                On a Trn2 UltraServer 16 CC-Cores (collective communication cores) per chip
                orchestrate collectives
                <Cite s={S.trainium2Arch} /> over a NeuronLink torus; a Trn3 UltraServer
                replaces the torus with switches that connect every chip to every other.
                <Cite s={S.trn3Arch} /> Serve MoE with vLLM Neuron, which ships Wide-EP.
                <Cite s={S.neuronWhatsNew} /> NxD Inference (NeuronX Distributed Inference), now
                in maintenance mode
                <Cite s={S.neuronWhatsNew} />, still documents EP over All-Gather.
                <Cite s={S.nxdiMoe} />
              </Box>
            </div>
            <div>
              <Box variant="h3">Cerebras</Box>
              <Box variant="p">
                A model larger than one wafer is split at layer boundaries across systems
                <Cite s={S.cerebrasInferenceBlog} />, so each layer&apos;s experts share one
                wafer&apos;s SRAM and expert routing never leaves it; activations cross
                wafer-to-wafer links between layer groups.
              </Box>
            </div>
            <div>
              <Box variant="h3">Open-source serving</Box>
              <Box variant="p">
                vLLM turns on EP with <code>--enable-expert-parallel</code>
                <Cite s={S.vllmArgUtils} /> and draws MoE kernels from backends including{' '}
                <code>cutlass</code>, <code>flashinfer_trtllm</code>,{' '}
                <code>flashinfer_cutlass</code> and <code>flashinfer_cutedsl</code>.
                <Cite s={S.vllmKernelConfig} /> SGLang&apos;s <code>--moe-a2a-backend</code> takes
                12 values at v0.5.21, among them <code>deepep</code>, <code>deepep_v2</code>,{' '}
                <code>flashinfer</code>, <code>mooncake</code>, <code>nixl</code>,{' '}
                <code>mori</code> and <code>pplx</code>.
                <Cite s={S.sglangExecArgs} />
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which platforms keep an expert group inside one fast domain, and which software path to start from on each"
          >
            How the silicon families handle MoE
          </Header>
        }
      >
        <Table
          items={siliconRows}
          columnDefinitions={[
            { id: 'sil', header: 'Silicon', cell: (r) => r.silicon, minWidth: 160 },
            { id: 'sw', header: 'MoE software and status', cell: (r) => r.software, minWidth: 260 },
            { id: 'fabric', header: 'Where experts and the all-to-all live', cell: (r) => r.fabric, minWidth: 240 },
          ]}
          variant="embedded"
          wrapLines
        />
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Capacity, precision and serving layout each change once experts are sparse; size them in that order"
          >
            Where MoE breaks the dense playbook
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ExpandableSection headerText="Memory capacity becomes a first-order variable" defaultExpanded>
            <Box variant="p">
              For dense decode the first silicon variable is HBM bandwidth. For MoE, capacity
              matters as much: all 671B of DeepSeek-V3&apos;s parameters must be resident although
              37B are read per token. B300 carries 288 GB of
              HBM3e per GPU
              <Cite s={S.blackwellUltraBlog} /> against B200&apos;s 180 GB
              <Cite s={S.dgxB200} kind="derived" note="DGX B200: 1,440 GB across 8 GPUs." />, and
              a GB300 NVL72 rack holds 20 TB.
              <Cite s={S.gb300Nvl72} /> On AWS, a Trn2 UltraServer holds 6,144 GiB across 64
              chips
              <Cite s={S.trn2Arch} /> and a 144-chip Trn3 Gen2 UltraServer 20,736 GiB.
              <Cite s={S.trn3Arch} /> Cerebras answers the question with the wafer itself: 44 GB
              of SRAM per wafer, so a large MoE spans several wafers.
              <Cite s={S.cerebrasInferenceBlog} />
            </Box>
          </ExpandableSection>
          <ExpandableSection headerText="Quantization works harder for MoE than for dense">
            <Box variant="p">
              Lower precision shrinks the total footprint, the binding number for MoE.
              DeepSeek-V3.2 drops from 690 GB of FP8 weights
              <Cite s={S.deepseekV32Files} /> to 415 GB in NVFP4, NVIDIA&apos;s 4-bit format with
              an FP8 scale per 16-value block
              <Cite s={S.deepseekV32Nvfp4Files} />
              <Cite s={S.nvfp4Blog} />, about 1.66x smaller.
              <Cite s={S.deepseekV32Nvfp4Card} /> Fewer GPUs then hold the model, which lowers
              the EP degree and the all-to-all traffic. Some models ship 4-bit experts from
              training: DeepSeek-V4-Pro stores its experts in FP4
              <Cite s={S.deepseekV4ProConfig} />, Kimi K3 trains with MXFP4 weights
              <Cite s={S.kimiK3Readme} /> and gpt-oss-120b ships MXFP4 MoE weights.
              <Cite s={S.gptOss120bConfig} /> <em>Quantization and Precision</em> covers the
              formats.
            </Box>
          </ExpandableSection>
          <ExpandableSection headerText="Disaggregated serving and MoE compose well">
            <Box variant="p">
              Prefill sends many tokens through each expert and decode few, so the two phases want
              different layouts. DeepSeek runs them on separate units, 32 GPUs at EP32 for prefill
              and 320 GPUs at EP320 for decode
              <Cite s={S.deepseekV3Report} />, and NVIDIA Dynamo disaggregates prefill and decode
              for SGLang, TensorRT-LLM and vLLM
              <Cite s={S.dynamoReadme} /> (see{' '}
              <em>Disaggregated Serving and Speculative Decoding</em>). Vera Rubin with Groq 3 LPX
              also splits inside decode: GPUs run attention over the KV (key-value) cache and hand
              activations to LPUs for the FFN and MoE experts, a loop
              NVIDIA calls AFD (attention-FFN disaggregation).
              <Cite s={S.lpxBlog} />
            </Box>
          </ExpandableSection>
          <Box variant="h3">Where MoE helps and where it does not</Box>
          <Box variant="p">
            MoE cuts prefill compute by the same ratio as decode bytes: about 2 x 37B FLOPs per
            DeepSeek-V3 prompt token against 2 x 671B for a dense model of its size.
            <Cite s={S.deepseekV3Readme} kind="derived" note="2 FLOPs per active parameter per token." />{' '}
            What it does not cut is the memory to hold every expert. At batch 1 a single device
            still reads only the active experts, 37 GB per token rather than 671 GB
            <Cite s={S.deepseekV3Readme} kind="derived" note="At FP8, 1 byte per parameter." />;
            once experts span devices, each token also pays an all-to-all that a batch of one
            cannot hide. On
            an edge device or a single GPU, the total parameter count has to fit however few
            parameters are active.
          </Box>
          <Box variant="p">
            Size an MoE deployment in that order: memory for the total parameters, an expert group
            that fits inside one scale-up domain, then enough tokens in flight across that group
            to give every expert a full batch, about 6,600 per step for DeepSeek-V3 on H200 at
            FP8.
            <Cite s={S.h200Page} kind="derived" note="206 tokens per expert x 256 / 8 = 6,592." />
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
