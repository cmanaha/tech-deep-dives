import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { DataflowSiliconDiagram } from '../components/DataflowSiliconDiagram';
import { Cite } from '../components/Cite';
import { S } from '../sources/GroqSambanovaDataflow';

export function GroqSambanovaDataflow() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Where an SRAM-first decode engine sits next to GPUs, when a three-tier memory chip fits better, and what you can call today"
          >
            Groq, SambaNova and Dataflow
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What dataflow means here.</strong> Groq and SambaNova compile the program onto
            a spatial fabric of functional units, and operands stream between units along routes
            fixed at compile time.
            <Cite s={S.lpxBlog} />
            <Cite s={S.sn40lPaper} /> A GPU picks ready warps at runtime; AWS Trainium also
            schedules at compile time
            <Cite s={S.nkiOverview} />, around a systolic array.
            <Cite s={S.neuronCoreV3} />
          </Box>
          <Box variant="p">
            <strong>Two bets on where the working set lives.</strong> Groq keeps it, weights
            included, in on-chip SRAM (static RAM) with DRAM (dynamic RAM) behind the chip.
            SambaNova spreads it across SRAM, HBM (High Bandwidth Memory) and DDR (double data
            rate) DRAM. Groq&apos;s bet ships in NVIDIA&apos;s Vera Rubin platform as the NVIDIA
            Groq 3 LPX, its own rack of LPUs (Language Processing Units) deployed alongside the
            Vera Rubin NVL72 GPU racks, built on licensed Groq technology and in full production
            since August 2026.
            <Cite s={S.groqNvidiaLicense} />
            <Cite s={S.lpxBlog} />
            <Cite s={S.lpxProduction} /> In decode, LPX takes latency-sensitive work such as the
            FFN (feed-forward network) and MoE (mixture of experts) expert layers, while Rubin GPUs
            keep attention over the KV (key-value) cache.
            <Cite s={S.lpxBlog} /> The whole rack holds 128 GB of SRAM, less than half the HBM on
            one Rubin GPU: the SRAM-first chip is a decode engine paired with GPUs.
            <Cite s={S.lpxBlog} />
            <Cite s={S.veraRubinNvl72} kind="derived" note="LPX rack: 128 GB of SRAM. Rubin GPU: 288 GB of HBM4. 128 / 288 = 0.44." />{' '}
            <em>Cerebras Wafer-Scale</em> covers the same on-chip memory bet at wafer scale.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where each chip keeps its weights, and the capacity and bandwidth of every tier behind them"
          >
            Two memory bets, side by side
          </Header>
        }
      >
        <SpaceBetween size="m">
          <DataflowSiliconDiagram />
          <Box variant="small" color="text-body-secondary">
            LPU modules (MXM, VXM and SXM: matrix, vector and switch execution; MEM: SRAM), tray
            DRAM and the Vera Rubin split
            <Cite s={S.lpxBlog} />. SN40L tiers, load rate and Samba-CoE
            <Cite s={S.sn40lPaper} />; the paper gives HBM bandwidth as about 2 TB/s in its text
            and 1.8 TB/s in its table.
          </Box>
          <Box variant="p">
            Both chips carry about half a gigabyte of SRAM. They differ in where a larger model goes: Groq
            spreads it across more LPUs, 256 of which act as one system in an LPX rack
            <Cite s={S.lpxBlog} />; SambaNova holds it in the HBM and DDR behind each socket.
            <Cite s={S.sn40lPaper} />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What the LPU keeps on chip, what Vera Rubin hands it, and the GroqCloud price to test against"
          >
            Groq: an SRAM-first decode engine
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What an LPU is.</strong> A chip whose compiler schedules computation, data
            movement and synchronization ahead of time, with no dynamic hardware scheduler at
            runtime. Each Groq 3 LPU works from 500 MB of on-chip SRAM, its primary working
            storage, at 150 TB/s; a 16-LPU tray adds up to 512 GB of DRAM.
            <Cite s={S.lpxBlog} /> The first GroqChip (14 nm) held 230 MB at up to 80 TB/s and was
            built to need no external memory.
            <Cite s={S.groqChipBrief} /> A plesiosynchronous chip-to-chip protocol cancels clock
            drift, so hundreds of LPUs run one compiled schedule.
            <Cite s={S.lpxBlog} />
          </Box>
          <Box variant="p">
            <strong>The work it takes from the GPU.</strong> The rack&apos;s 128 GB of SRAM is
            less than half the 288 GB of HBM4 on a single Rubin GPU.
            <Cite s={S.veraRubinNvl72} />
            <Cite s={S.lpxBlog} kind="derived" note="128 GB / 288 GB = 0.44." /> GPUs keep the
            decode work that needs large memory capacity, such as full-context attention over the
            accumulated KV cache. LPX can also draft tokens for speculative decoding that the GPUs
            verify, and NVIDIA Dynamo routes work between the two.
            <Cite s={S.lpxBlog} /> Nebius is the first AI cloud to adopt LPX and plans to offer it
            through its Token Factory inference platform.
            <Cite s={S.lpxProduction} /> <em>Disaggregated Serving and Speculative Decoding</em>{' '}
            covers both loops.
          </Box>
          <Box variant="p">
            <strong>What you can call today.</strong> Groq licenses its inference technology to
            NVIDIA non-exclusively; its founder and its president joined NVIDIA, and Groq
            continues as an independent company running GroqCloud.
            <Cite s={S.groqNvidiaLicense} /> GroqCloud lists gpt-oss-120b at 500 tokens/s
            <Cite s={S.groqModels} kind="vendor-claim" /> for $0.15 per million input tokens and
            $0.60 per million output tokens.
            <Cite s={S.groqModels} />
          </Box>
          <Alert type="info" header="What to verify yourself">
            No LPU tuning guide or ISA (instruction set architecture)
            reference was located during this research, and the GroqCloud models page omits
            serving precision.
            <Cite s={S.groqModels} /> Measure speed and output quality on your own prompts before
            sizing a workload on the 500 tokens/s.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why DDR behind HBM lets one node serve 150 models, and what SN50 promises for the second half of 2026"
          >
            SambaNova: three memory tiers and whole-model switching
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What an SN40L is.</strong> SambaNova&apos;s fourth-generation RDU
            (Reconfigurable Dataflow Unit).
            <Cite s={S.sn40lGenBlog} />{' '}
            Each socket carries 520 MiB of on-chip SRAM at hundreds of
            TB/s, 64 GiB of HBM at about 1.8 to 2 TB/s and up to 1.5 TiB of DDR at over 200 GB/s;
            software manages the HBM and DDR tiers.
            <Cite s={S.sn40lPaper} />
          </Box>
          <Box variant="p">
            <strong>Samba-CoE.</strong> A Composition of Experts (CoE) routes each whole request
            to one of 150 expert models, a trillion parameters in total. Cold models wait in DDR
            and load into HBM at over 1 TB/s per node, so one node hosts more models than its HBM
            holds.
            <Cite s={S.sn40lPaper} /> An 8-socket SN40L node measured 3.7x a DGX H100, with model
            switching 15x faster.
            <Cite s={S.sn40lPaper} kind="measured" note="Vendor-authored paper (MICRO 2024), author-measured on Samba-CoE. The 8 sockets are the SambaNova node; the baseline is one DGX H100. 3.7x is the batch-8, 20-output-token case; Table V gives 2.6x to 3.7x against DGX H100 across its cases, and model switching 15x against DGX H100 (31x against DGX A100)." />{' '}
            <em>Mixture of Experts and Sparse Activation</em> contrasts this with token-level MoE.
          </Box>
          <Box variant="p">
            <strong>SN50.</strong> The fifth-generation RDU keeps tiered memory and claims five
            times the compute per accelerator of the previous generation.
            <Cite s={S.sn50Blog} kind="vendor-claim" /> A SambaRack holds 16 SN50 chips and
            averages 20 kW, and shipping is planned for the second half of 2026.
            <Cite s={S.sn50Blog} kind="roadmap" /> No shipment confirmation was located during
            this research, and the announcement gives no memory capacity or bandwidth, so the
            SN40L paper stays the architectural reference.
            <Cite s={S.sn40lPaper} /> Intel Capital joined SambaNova&apos;s February 2026 Series
            E, alongside a planned collaboration with Intel.
            <Cite s={S.sambanovaSeriesE} />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The latency claim a trading desk can act on, the chip it holds for, and what to measure before relying on it"
          >
            Deterministic latency: a Groq property
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Groq sets per-token time with the compiled schedule. NVIDIA lists reduced execution
            jitter and per-token latency that stays stable even at small batch sizes
            <Cite s={S.lpxBlog} kind="vendor-claim" />; Groq calls the first GroqChip fully
            deterministic, with no run-to-run variation.
            <Cite s={S.groqChipBrief} kind="vendor-claim" /> For a tick-to-trade pipeline judged
            on p99.9 latency, that predictability is worth more than peak throughput (see{' '}
            <em>Capital Markets Lens</em>).
          </Box>
          <Box variant="p">
            SambaNova compiles its dataflow too, but the SN40L paper makes no determinism claim,
            and a request for a model not yet in HBM waits for it to load from DDR.
            <Cite s={S.sn40lPaper} />
          </Box>
          <ExpandableSection headerText="Tooling and availability to check first">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Tooling.</strong> No evidence was located during this research that
                Triton, FlashAttention, CUTLASS, vLLM or TensorRT-LLM targets Groq or SambaNova
                directly; each vendor ships its own compiler and serving stack, so a workload tied
                to one of those libraries pays an integration cost. NVIDIA reaches the LPU
                through Dynamo.
                <Cite s={S.lpxBlog} />
              </Box>
              <Box variant="p">
                <strong>Availability.</strong> GroqCloud sells inference through an API
                <Cite s={S.groqModels} />, and LPX is set to bring the architecture to other
                clouds.
                <Cite s={S.lpxProduction} /> SambaNova sells SambaRack systems
                <Cite s={S.sn50Blog} /> and is expanding its own cloud capacity.
                <Cite s={S.sambanovaSeriesE} /> No AWS deployment of either was located during
                this research, so an AWS-native architecture pays cross-cloud networking to reach
                them.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            <strong>Where to start.</strong> For a latency-bound decode path, run gpt-oss-120b on
            GroqCloud against your current GPU stack and measure p99.9 end to end through the path
            you would deploy, because the determinism statements describe the chip&apos;s
            execution. For serving many models from one node, SambaNova&apos;s tiered memory is
            built for that pattern; confirm SN50 shipments before planning around it.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
