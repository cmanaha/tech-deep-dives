import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { DataflowSiliconDiagram } from '../components/DataflowSiliconDiagram';

export function GroqSambanovaDataflow() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Two dataflow architectures that take very different bets on the memory hierarchy"
          >
            Groq, SambaNova, and dataflow silicon
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What &ldquo;dataflow&rdquo; means here.</strong> Both Groq and
            SambaNova are dataflow architectures — the program is mapped onto a
            spatial fabric of functional units, and operands flow between units
            along compiled-in routes rather than through a register file managed
            by a scheduler. The contrast with both NVIDIA SIMT and AWS Trainium
            (which is also compile-time scheduled but built around a systolic
            array, not a spatial dataflow fabric) is real.
          </Box>
          <Box variant="p">
            <strong>Why one section.</strong> Groq and SambaNova are
            architecturally adjacent but make different bets about the memory
            hierarchy. Groq holds all weights in on-chip SRAM and ships
            deterministic dataflow. SambaNova ships a three-tier SRAM / HBM /
            DDR architecture with reconfigurable dataflow units. Putting them
            side by side surfaces the trade clearly.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Side-by-side schematic of the two silicon families"
          >
            Two bets, side by side
          </Header>
        }
      >
        <SpaceBetween size="m">
          <DataflowSiliconDiagram />
          <Box variant="p">
            Groq pushes the SRAM-only argument: 230 MB of on-chip SRAM per LPU
            with ~80 TB/s on-chip bandwidth, no HBM in the inference path.
            SambaNova pushes the tiered argument: ~520 MB of on-chip SRAM, plus
            64 GB of HBM3, plus up to 1.5 TB of DDR memory per socket — three
            tiers that the compiler maps the model graph across. Both target
            inference at scale; both make their economics by changing the
            memory access pattern, not by improving FLOPs.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The deterministic-dataflow inference accelerator"
          >
            Groq — LPU and the SRAM-only bet
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What an LPU is.</strong> Groq&apos;s Language Processing
            Unit. A single chip with 230 MB of on-chip SRAM, deterministic
            dataflow execution, and no out-of-order or speculative behavior.
            Programs are compiled into a static schedule; the chip executes that
            schedule cycle by cycle. There is no DRAM traffic in the inference
            path — the model has to fit (or be sharded across multiple LPUs in
            a rack).
          </Box>
          <Box variant="p">
            <strong>Production claims.</strong> Groq publishes per-model
            throughput on the GroqCloud serving platform: Llama 4 Scout at
            460+ tokens/s at $0.11 / $0.34 per million input / output tokens
            ({' '}
            <Link external href="https://groq.com/">
              Groq
            </Link>
            , accessed 2026-04-23). The architectural argument is that
            deterministic dataflow eliminates two big sources of variance —
            cache contention and warp scheduling — and the SRAM-only memory
            model eliminates the third (HBM round-trips). For batch-1
            inference latency this combination is competitive with
            wafer-scale.
          </Box>
          <Alert type="info" header="What is not public">
            Groq&apos;s published architectural detail is thinner than NVIDIA
            and AWS&apos;s. Per-LPU FLOPs at each precision, the inter-LPU
            fabric design, and the scaling envelope for multi-LPU racks are
            not documented at the level a tuning guide provides. Treat
            production claims as Tier 2 vendor numbers and verify against
            third-party benchmarks (Artificial Analysis being the cleanest
            available).
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The reconfigurable-dataflow tiered-memory accelerator"
          >
            SambaNova — SN40L and Samba-CoE
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What an SN40L is.</strong> SambaNova&apos;s 4th-generation
            Reconfigurable Dataflow Unit (RDU). Three tiers of memory in one
            socket: hundreds of MB of on-chip SRAM, 64 GB of HBM3, and up to
            1.5 TB of DDR-attached memory. The compiler maps the model graph
            onto the RDU fabric and tiers the activations and weights across
            SRAM / HBM / DDR based on access pattern. The published SN40L
            paper documents this architecture in detail
            ({' '}
            <Link external href="https://arxiv.org/abs/2405.07518">
              SambaNova SN40L (arXiv:2405.07518)
            </Link>
            , accessed 2026-04-23).
          </Box>
          <Box variant="p">
            <strong>Samba-CoE — the MoE framing.</strong> SambaNova&apos;s
            inference platform deploys a Composition of Experts (CoE) — 150
            experts at 1T parameters total, claimed to deliver 3.7× the
            performance of an 8-socket DGX H100 on the same workload. The
            three-tier memory architecture lets the platform host more
            experts than fit in HBM alone — DDR-attached memory holds
            cold experts that are paged into HBM and SRAM as routing
            decisions activate them.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What deterministic dataflow buys for capital markets"
          >
            Why HFT engineers like deterministic dataflow
          </Header>
        }
      >
        <Box variant="p">
          The capital-markets framing in Section 30 will land on this point
          again, but it is worth flagging here. Both Groq and SambaNova produce
          the per-token wall-clock time as a property of the compiled schedule,
          not of runtime contention. For a tick-to-trade pipeline that needs
          consistent p99.9 latency, the predictability is more valuable than
          peak throughput. The Cerebras bet (Section 19) generalizes the same
          argument to wafer-scale; Groq and SambaNova generalize it to chip-
          scale with different memory choices.
        </Box>
        <ExpandableSection headerText="Where these architectures fall short">
          <SpaceBetween size="s">
            <Box variant="p">
              <strong>Tooling depth.</strong> Neither vendor matches the depth
              of the CUDA ecosystem. Triton, FlashAttention, CUTLASS, vLLM,
              TensorRT-LLM — none of these directly target Groq or SambaNova.
              The vendors ship their own compilers and inference servers; if
              the workload depends on a specific external library, integration
              cost is real.
            </Box>
            <Box variant="p">
              <strong>Marketplace availability.</strong> Groq sells inference-
              as-a-service via GroqCloud. SambaNova sells appliances and hosted
              inference. Neither is currently in EC2. AWS-native architectures
              that require a Groq or SambaNova endpoint pay the cross-cloud
              networking cost.
            </Box>
            <Box variant="p">
              <strong>Public architectural documentation.</strong> Both
              vendors are thinner than NVIDIA, AWS, and even Cerebras on
              published architectural detail. Production claims need
              third-party benchmark verification.
            </Box>
          </SpaceBetween>
        </ExpandableSection>
      </Container>
    </SpaceBetween>
  );
}
