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
import { CerebrasWaferDiagram } from '../components/CerebrasWaferDiagram';

interface BenchRow {
  model: string;
  cerebras: string;
  blackwell: string;
  source: string;
  url: string;
}

const benchRows: BenchRow[] = [
  {
    model: 'Llama 4 Maverick',
    cerebras: '2,522 tokens/s',
    blackwell: '1,038 tokens/s',
    source: 'Artificial Analysis (May 2025)',
    url: 'https://artificialanalysis.ai/',
  },
  {
    model: 'Qwen3-235B-A22B',
    cerebras: 'Production at $0.60 / $1.20 per Mtok',
    blackwell: 'Comparable model running on B200 / H200 fleets',
    source: 'Cerebras inference page',
    url: 'https://www.cerebras.ai/inference',
  },
  {
    model: 'GPT-OSS-120B',
    cerebras: 'Production deployment',
    blackwell: 'NVIDIA-cited 60,000 TPS/GPU max throughput',
    source: 'Cerebras / NVIDIA blogs',
    url: 'https://www.cerebras.ai/inference',
  },
];

export function CerebrasWaferScale() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The wafer is the chip — 900,000 cores and 44 GB of on-wafer SRAM"
          >
            Cerebras WSE-3 — wafer-scale silicon
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What WSE-3 is.</strong> The third generation of Cerebras&apos;s
            wafer-scale engine. A single piece of silicon ~46,225 mm² in area —
            roughly 57× the area of a flagship GPU die — containing ~900,000
            individual cores and ~44 GB of SRAM <em>on the wafer</em>. There is
            no HBM, no DDR, and no external memory in the steady-state inference
            path. The model is in SRAM. The aggregate on-wafer memory bandwidth
            is in the tens of petabytes per second — about three orders of
            magnitude over a Blackwell GPU&apos;s HBM3e
            ({' '}
            <Link external href="https://www.cerebras.ai/">
              Cerebras
            </Link>
            , accessed 2026-04-23).
          </Box>
          <Box variant="p">
            <strong>Why this matters.</strong> The single technical claim that
            frames every Cerebras conversation is: HBM is a bandwidth-wall
            problem only because compute and memory are in different packages.
            Put them in the same wafer and the wall does not exist. The
            economics of MoE inference (Section 23) lean hard on this —
            experts in on-wafer SRAM switch in nanoseconds, not microseconds.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The wafer in proportion to a typical accelerator package"
          >
            What the silicon looks like
          </Header>
        }
      >
        <SpaceBetween size="m">
          <CerebrasWaferDiagram />
          <Box variant="p">
            A standard accelerator package puts the GPU die in the middle and
            arranges 4-8 HBM stacks around it on a silicon interposer. Bandwidth
            between the GPU and HBM is high (TB/s class) but the path traverses
            the interposer and the HBM PHY. WSE-3 collapses that distance: the
            cores and the memory are <em>the same piece of silicon</em>. Each
            core has its own SRAM and a connection to its neighbors through an
            on-wafer fabric.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The four properties that come out of wafer-scale"
          >
            What changes at wafer scale
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">No bandwidth wall</Box>
            <Box variant="p">
              Aggregate on-wafer memory bandwidth is in the tens of PB/s.
              Section 6&apos;s bandwidth wall — limited by HBM pin speed and
              interposer signal integrity — is a different physical problem
              than &ldquo;cores reading from adjacent SRAM cells.&rdquo; The
              ridge point on a roofline plot moves so far left that decode is
              compute-bound, not bandwidth-bound.
            </Box>
          </div>
          <div>
            <Box variant="h3">Static dataflow execution</Box>
            <Box variant="p">
              The compiler places the program onto specific cores and routes
              activations through the on-wafer fabric. There is no global
              scheduler, no cache hierarchy, no warps. The program is the
              schedule. Closer to Trainium&apos;s NEFF model than to a GPU, but
              spread across nearly a million cores instead of dozens of SMs.
            </Box>
          </div>
          <div>
            <Box variant="h3">MoE expert switching is free</Box>
            <Box variant="p">
              All experts live on-wafer. Routing a token to a different expert
              is a fabric-internal event, not a fabric-crossing event. There is
              no all-to-all-over-NVLink or all-to-all-over-InfiniBand cost
              because there is no HBM and no network in the path.
            </Box>
          </div>
          <div>
            <Box variant="h3">Capacity is the constraint</Box>
            <Box variant="p">
              The model has to fit on the wafer. 44 GB of SRAM means a 70B
              parameter model in BF16 does not fit; it must be quantized or the
              workload must run on a multi-CS-3 cluster. Cerebras&apos;s
              solution is to chain wafers — multiple WSE-3 dies cooperating
              over inter-system links. For models that fit, the architecture
              wins; for models that do not, the cost / capacity calculus
              shifts.
            </Box>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What Cerebras has actually shipped — and what third-party benchmarks say"
          >
            Production inference state
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={benchRows}
            columnDefinitions={[
              { id: 'model', header: 'Model', cell: (r) => r.model, minWidth: 200 },
              { id: 'cb', header: 'Cerebras (third-party measured)', cell: (r) => r.cerebras },
              { id: 'bw', header: 'Comparison silicon', cell: (r) => r.blackwell },
              {
                id: 'src',
                header: 'Source',
                cell: (r) => (
                  <Link external href={r.url}>
                    {r.source}
                  </Link>
                ),
              },
            ]}
            variant="embedded"
            wrapLines
          />
          <Alert type="success">
            On Llama 4 Maverick, Artificial Analysis measured Cerebras at
            2,522 tokens/s — versus Blackwell at 1,038 tokens/s, SambaNova at
            794, and Groq at 549 (May 2025). For an MoE model where experts
            live on-wafer, the throughput gap is not a marketing artifact; it
            is a direct consequence of skipping the HBM-and-fabric round trip.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The places the wafer-scale bet does not pay"
          >
            Where Cerebras struggles
          </Header>
        }
      >
        <ExpandableSection headerText="Capacity and model fit">
          <Box variant="p">
            44 GB of on-wafer SRAM is not in the same league as 288 GB of
            HBM3e on a single B300 GPU, let alone the 13.4 TB / 20 TB of
            aggregate HBM in NVL72. Models that fit comfortably in one B300 may
            need a multi-wafer Cerebras configuration. The economics depend on
            how many wafers it takes to host a model versus how many GPUs.
          </Box>
        </ExpandableSection>
        <ExpandableSection headerText="Software ecosystem and tooling maturity">
          <Box variant="p">
            CUDA and the surrounding ecosystem (cuBLAS, cuDNN, FlashAttention,
            CUTLASS, TensorRT-LLM, vLLM, SGLang, Triton, and so on) is a
            decade of accumulated tuning. Cerebras&apos;s software stack has
            matured but does not have the same long-tail operator coverage. For
            workloads that depend on a specific kernel implementation, GPU
            silicon often wins on availability before it wins on performance.
          </Box>
        </ExpandableSection>
        <ExpandableSection headerText="Marketplace and supply">
          <Box variant="p">
            Cerebras systems are sold as inference-as-a-service and as
            on-premises systems. AWS does not currently host CS-3 in EC2.
            Customers who need an AWS-resident solution have to deploy elsewhere
            or use Cerebras&apos;s hosted inference API. This is a real
            integration cost for AWS-native architectures even when the
            performance argument favors Cerebras.
          </Box>
        </ExpandableSection>
      </Container>
    </SpaceBetween>
  );
}
