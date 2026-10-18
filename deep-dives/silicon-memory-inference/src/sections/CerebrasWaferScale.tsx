import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import { Cite } from '../components/Cite';
import { CerebrasWaferDiagram, CerebrasLayerSplitDiagram } from '../components/CerebrasWaferDiagram';
import { S } from '../sources/CerebrasWaferScale';

const denseSparseNote = 'Cerebras does not state whether this peak is dense or sparse.';

const ridgeNote =
  'WSE-3: 125 PFLOPS / 21 PB/s = about 6 FLOP/byte. WSE-3T: 250 / 43.2 = about 5.8. BF16 decode at batch 1 does 2 FLOPs per 2-byte weight, 1 FLOP/byte, so the weight matmuls reach the ridge at a batch of about 6.';

const h200RidgeNote =
  'H200 FP8: 1,979 TFLOPS dense / 4.8 TB/s = about 412 FLOP/byte (Thesis and Framing). FP8 decode does 2 FLOPs per 1-byte weight per token, so the ridge falls at a batch of about 206.';

const gptOssSizeNote =
  '117B parameters x 4.25 bits / 8 = about 62 GB. Attention, router and embeddings stay in BF16 (modules_to_not_convert), so the true size is higher.';

const perRequestNote =
  "Our reading: Cerebras lists one speed per model without defining it, so it compares with NVIDIA's per-user figure.";

const curveNote =
  'Per-GPU throughput falls as per-user speed rises: the same post gives 30,000 tokens/s per GPU at 100 tokens/s per user, with speculative decoding.';

const aaNote =
  'Artificial Analysis figures, quoted in a Cerebras press release. The release ties the NVIDIA figure to eight Blackwell GPUs in a DGX B200.';

interface SpeedRow {
  id: string;
  model: React.ReactNode;
  cerebras: React.ReactNode;
  nvidia: React.ReactNode;
}

const speedRows: SpeedRow[] = [
  {
    id: 'gpt-oss',
    model: (
      <>
        gpt-oss-120b, in the shared catalog
        <Cite s={S.cerebrasModels} />
      </>
    ),
    cerebras: (
      <>
        About 3,000 tokens/s
        <Cite s={S.cerebrasGptOssPage} kind="vendor-claim" note={perRequestNote} />; $0.35 in
        and $0.75 out per million tokens
        <Cite s={S.cerebrasGptOssPage} />
      </>
    ),
    nvidia: (
      <>
        B200, TensorRT-LLM: up to 60,000 tokens/s per GPU, or 1,000 per user
        <Cite s={S.inferenceMaxBlog} kind="vendor-claim" note={curveNote} />
      </>
    ),
  },
  {
    id: 'maverick',
    model: (
      <>
        Llama 4 Maverick, May 2025, since retired from the catalog
        <Cite s={S.cerebrasModels} />
      </>
    ),
    cerebras: (
      <>
        2,522 tokens/s
        <Cite s={S.maverickPress} kind="measured" note={aaNote} />
      </>
    ),
    nvidia: (
      <>
        NVIDIA Blackwell, DGX B200: 1,038 tokens/s
        <Cite s={S.maverickPress} kind="measured" note={aaNote} />
      </>
    ),
  },
];

export function CerebrasWaferScale() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Where a wafer of SRAM beats HBM, where models outgrow it, and how to reach it from AWS today"
          >
            Cerebras Wafer-Scale
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Cerebras builds each accelerator from a whole wafer. The WSE-3 (Wafer-Scale Engine 3)
            is one 46,225 mm² die
            <Cite s={S.cerebrasS1} />, about 57x an H100 die of 814 mm²
            <Cite s={S.hopperArchBlog} kind="derived" note="46,225 / 814 = 56.8." />, with 900,000
            cores and 44 GB of SRAM (static RAM) on the same silicon.
            <Cite s={S.cerebrasS1} /> That SRAM delivers 21 PB/s, 2,625x the HBM (High Bandwidth
            Memory) bandwidth of a B200.
            <Cite s={S.cerebrasS1} note="Cerebras's own comparison, against the B200." />{' '}
            Inference keeps the weights in that SRAM
            <Cite s={S.cerebrasInferenceBlog} />; training adds up to 1.2 PB of external memory.
            <Cite s={S.wse3Press} />
          </Box>
          <Box variant="p">
            The CS-4, announced in August 2026 with first shipments planned for that quarter, puts
            three WSE-3T wafers in a rack, each with the same cores and 44 GB at twice the compute
            and bandwidth (250 PFLOPS, 43.2 PB/s), linked wafer to wafer at as low as 2 µs.
            <Cite s={S.cs4Press} note={denseSparseNote} />
            <Cite s={S.cerebrasChip} note={denseSparseNote} />
            <Cite s={S.cs4Blog} />
          </Box>
          <Box variant="p">
            Put compute and memory on one wafer and the bandwidth wall becomes a capacity wall: a
            model larger than 44 GB is split at layer boundaries across wafers
            <Cite s={S.cerebrasInferenceBlog} />, and the links between wafers become the network
            to plan around.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A wafer and an H100 die at the same scale, and where each keeps its weights"
          >
            What the silicon looks like
          </Header>
        }
      >
        <SpaceBetween size="m">
          <CerebrasWaferDiagram />
          <Box variant="p">
            A GPU package puts HBM stacks beside the die on a silicon interposer: 80 GB on an H100
            <Cite s={S.h100Page} />, 288 GB in eight stacks on a B300.
            <Cite s={S.blackwellUltraBlog} /> Every weight read crosses from a stack to the die.
            On the WSE-3 each core owns 48 kB of SRAM that no other core uses and talks to its
            neighbours over a two-dimensional mesh
            <Cite s={S.cerebrasSdkBlog} />; 900,000 cores at 48 kB is about 43 GB, the 44 GB on
            the spec sheet.
            <Cite s={S.cerebrasSdkBlog} kind="derived" note="900,000 x 48 kB = 43.2 GB." />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="BF16 decode crosses the ridge at a batch of about six, and the compiler fixes where everything runs"
          >
            What changes on one wafer
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">The ridge drops to about 6 FLOP/byte</Box>
            <Box variant="p">
              A WSE-3 peaks at 125 PFLOPS
              <Cite s={S.wse3Press} note={denseSparseNote} /> over 21 PB/s
              <Cite s={S.cerebrasS1} />, a ridge of about 6 FLOP per byte.
              <Cite s={S.cerebrasS1} kind="derived" note={ridgeNote} /> Batch-1 decode in BF16
              (bfloat16) does about 1 FLOP per weight byte, so it still sits below the ridge; the
              weight matmuls cross it at a batch of about six, where an H200 in FP8 needs about
              200.
              <Cite s={S.h200Page} kind="derived" note={h200RidgeNote} /> The WSE-3T doubles
              compute and bandwidth together
              <Cite s={S.cs4Press} />, so its ridge stays near 6.
            </Box>
          </div>
          <div>
            <Box variant="h3">Compiled routes, data-triggered tasks</Box>
            <Box variant="p">
              The compiler places the program on specific cores and fixes the routes through the
              fabric; at run time a core runs a task when its data arrives.
              <Cite s={S.cerebrasSdkBlog} /> With each core&apos;s 48 kB private, there is no
              cache hierarchy to tune and no warps to keep occupied. As with a Trainium NEFF
              (Neuron Executable File Format), placement is settled before the model runs.
            </Box>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Layers split across wafers, and the link between them becomes the network you size"
          >
            When the model outgrows one wafer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            At 16-bit weights one wafer holds a 20B-parameter model; a 70B model runs on as few as
            four systems, split at layer boundaries.
            <Cite s={S.cerebrasInferenceBlog} />
          </Box>
          <CerebrasLayerSplitDiagram />
          <Box variant="small" color="text-body-secondary">
            Wafer-to-wafer latency: as low as 2 µs on CS-4 and 5 µs on CS-3.
            <Cite s={S.cs4Press} />
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Expert routing stays on one wafer</Box>
              <Box variant="p">
                Each layer sits whole on one wafer, so an MoE (Mixture of Experts) layer&apos;s
                router and experts share that wafer&apos;s SRAM and a token&apos;s trip to its
                expert never leaves it.
                <Cite
                  s={S.cerebrasInferenceBlog}
                  kind="derived"
                  note="Follows from splitting at layer boundaries."
                />{' '}
                Only the activation hand-off between layer groups crosses wafers.{' '}
                <em>Mixture of Experts and Sparse Activation</em> sets this against a GPU
                cluster&apos;s all-to-all.
              </Box>
            </div>
            <div>
              <Box variant="h3">Capacity sets the wafer count</Box>
              <Box variant="p">
                gpt-oss-120b has 117B parameters and fits on one 80 GB H100.
                <Cite s={S.gptOss120bReadme} /> At the 4.25 bits per weight of its MXFP4
                (Microscaling FP4) checkpoint it needs at least 62 GB
                <Cite s={S.gptOss120bConfig} kind="derived" note={gptOssSizeNote} />
                <Cite s={S.ocpMx} />, more than one wafer; the Cerebras model page states no
                serving precision.
                <Cite s={S.cerebrasGptOssPage} /> A CS-4 rack holds 132 GB of SRAM
                <Cite s={S.cs4Press} kind="derived" note="Three wafers x 44 GB." />; one B300
                holds 288 GB of HBM3e
                <Cite s={S.blackwellUltraBlog} /> and a GB300 NVL72 20 TB.
                <Cite s={S.gb300Nvl72} />
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>Count wafers before you price.</strong> Weight bytes at the serving precision
            divided by 44 GB, rounded up, is a floor: the KV (key-value) cache needs room too, and
            the Cerebras inference blog does not say where it lives.
            <Cite s={S.cerebrasInferenceBlog} /> Each wafer boundary adds at least 2 µs to every
            token.
            <Cite
              s={S.cs4Blog}
              kind="derived"
              note="One activation hand-off per wafer boundary per decode step, at the CS-4's minimum wafer-to-wafer latency."
            />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Per-request speed on a wafer, set against NVIDIA's figures in the same unit"
          >
            Measured and quoted speed
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={speedRows}
            trackBy="id"
            columnDefinitions={[
              { id: 'model', header: 'Model', cell: (r) => r.model, minWidth: 180 },
              { id: 'cb', header: 'Cerebras', cell: (r) => r.cerebras, minWidth: 200 },
              { id: 'nv', header: 'NVIDIA', cell: (r) => r.nvidia, minWidth: 200 },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="p">
            NVIDIA&apos;s 60,000 tokens/s is one B200&apos;s total across all its users; set its
            1,000 per user
            <Cite s={S.inferenceMaxBlog} kind="vendor-claim" /> against about 3,000 on Cerebras.
            <Cite s={S.cerebrasGptOssPage} kind="vendor-claim" /> The Maverick measurement put
            SambaNova at 794 tokens/s and Groq at 549
            <Cite s={S.maverickPress} kind="measured" note={aaNote} />; <em>Groq, SambaNova and
            Dataflow</em> covers both.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What AWS has announced, what you can subscribe to today, and what to check first"
          >
            Reaching Cerebras from AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Announced: Amazon Bedrock.</strong> In March 2026 AWS and Cerebras announced
            CS-3 systems in AWS data centers, offered exclusively through Amazon Bedrock rather
            than as EC2 instances, with Trainium doing prefill and CS-3 decode over EFA (Elastic
            Fabric Adapter) networking.
            <Cite s={S.awsCerebrasPress} /> Trainium sends the KV cache it computes to the wafer
            <Cite s={S.cerebrasAwsBlog} />, so that transfer crosses EFA;{' '}
            <em>Disaggregated Serving and Speculative Decoding</em> covers when it pays. The
            launch was due &quot;in the next couple of months&quot;.
            <Cite s={S.awsCerebrasPress} /> This research located no AWS launch announcement as
            of 2026-10-16; a trade-press summary of Cerebras&apos;s August 2026 earnings call has
            the CEO expecting Q1 2027.
            <Cite s={S.earningsCallSummary} />
          </Box>
          <Box variant="p">
            <strong>Software coverage.</strong> CUDA&apos;s libraries and serving stacks cover a
            long tail of operators the Cerebras stack does not. The Cerebras API follows the
            OpenAI Chat Completions format
            <Cite s={S.cerebrasInferenceBlog} />, so client code ports as is and the gap bites on
            custom kernels and models outside the catalog.
          </Box>
          <Box variant="p">
            <strong>Supply.</strong> Cerebras sells on-premises systems and cloud inference, and
            two customers dominate its revenue: MBZUAI (Mohamed bin Zayed University of
            Artificial Intelligence) at 62% and G42 at 24% in 2025. An OpenAI agreement is valued
            at more than $20 billion for 750 megawatts.
            <Cite s={S.cerebrasS1} /> Get dedicated capacity committed in the contract.
          </Box>
          <Box variant="p">
            <strong>Available today: AWS Marketplace.</strong> The Cerebras Fast Inference Cloud
            listing is a usage-billed subscription to the OpenAI-compatible Cerebras API.
            <Cite s={S.awsMarketplaceListing} /> Shared inference serves gpt-oss-120b and
            qwen-3.8-27b; other models need a Dedicated Inference deployment.
            <Cite s={S.cerebrasModels} /> Point an OpenAI client at it, measure your own prompts
            at your own concurrency, and plan on Bedrock once AWS announces the launch.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
