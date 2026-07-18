import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { SlmParamsChart } from '../components/SlmParamsChart';

export function SmallLanguageModels() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The 1B-7B parameter range that fits on host CPU, in MIG slices, and as drafters"
          >
            Small Language Models (SLMs)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why this section.</strong> Sections 22 and 23 covered LLM
            decode and Mixture-of-Experts inference at frontier scale (70B-1T
            parameters). The other end of the spectrum is increasingly important
            in production: Small Language Models in the 1-7B parameter range that
            fit comfortably on a single accelerator, on a host CPU with AMX
            (Advanced Matrix Extensions, Section 11) or SVE2 BFMMLA (Graviton5,
            Section 9), or in a MIG (Multi-Instance GPU, Section 28) slice. SLMs
            are not a smaller version of the LLM problem — they have different
            economics, different hardware fits, and increasingly distinct
            deployment patterns.
          </Box>
          <Box variant="p">
            <strong>The core argument.</strong> A well-quantized 1-7B SLM costs
            an order of magnitude less per token than a frontier LLM, fits
            single-host budgets, and is increasingly competitive on focused
            tasks (summarization, classification, retrieval-grounded answering,
            agentic tool use). The hardware question is no longer
            &ldquo;which giant accelerator?&rdquo; — it is &ldquo;which single
            host or single GPU slice?&rdquo;
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The production SLM lineup — vendor-cited parameter counts and context windows"
          >
            What ships in production
          </Header>
        }
      >
        <SpaceBetween size="m">
          <SlmParamsChart />
          <Box variant="small">
            All figures from each model&apos;s author docs or HuggingFace model
            card: Microsoft{' '}
            <Link external href="https://huggingface.co/microsoft/Phi-3-mini-4k-instruct">
              Phi-3-mini
            </Link>
            ,{' '}
            <Link external href="https://huggingface.co/microsoft/phi-4">
              Phi-4
            </Link>
            ; Meta{' '}
            <Link external href="https://huggingface.co/meta-llama/Llama-3.2-1B">
              Llama 3.2 1B / 3B
            </Link>
            ; Google{' '}
            <Link external href="https://huggingface.co/google/gemma-2-2b">
              Gemma 2 2B
            </Link>{' '}
            and{' '}
            <Link external href="https://huggingface.co/google/gemma-3-1b-it">
              Gemma 3
            </Link>
            ; Alibaba{' '}
            <Link external href="https://huggingface.co/Qwen/Qwen2.5-1.5B">
              Qwen 2.5
            </Link>
            ; Mistral{' '}
            <Link external href="https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3">
              Mistral 7B
            </Link>
            ; Hugging Face{' '}
            <Link external href="https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B">
              SmolLM2
            </Link>
            . Access dates 2026-04-25.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why SLMs are economically and operationally distinct from LLMs"
          >
            The four reasons SLMs matter
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Cost per token</Box>
            <Box variant="p">
              An SLM in the 1-3B range produces tokens at one-tenth to
              one-hundredth the cost of a frontier LLM for tasks where the SLM
              is sufficient. For high-volume inference fleets — search,
              summarization, classification, structured-output extraction —
              the cost lever often dominates the quality lever.
            </Box>
          </div>
          <div>
            <Box variant="h3">Latency</Box>
            <Box variant="p">
              Sub-millisecond per-token decode is achievable on host CPU with
              AMX and on entry-level GPUs. For agentic workflows that chain
              many small inferences, the per-call latency budget is what
              determines whether the user-facing wall-clock is acceptable.
            </Box>
          </div>
          <div>
            <Box variant="h3">Edge / on-device deployment</Box>
            <Box variant="p">
              Llama 3.2 1B was sized for on-device deployment with explicit
              SpinQuant numbers in Meta&apos;s blog. Gemma 3 1B at 32K context
              fits comfortably on consumer hardware. The
              cloud-versus-on-device tradeoff is now a live design question
              rather than a theoretical one.
            </Box>
          </div>
          <div>
            <Box variant="h3">As drafters for speculative decoding</Box>
            <Box variant="p">
              Speculative decoding (Section 26) pairs an SLM drafter with an
              LLM verifier. Llama 3.2 1B drafting Llama 3.3 70B is a common
              pattern — the small model does the cheap forward passes; the
              large model verifies in a single batch. The SLM&apos;s economic
              role is to amortize the LLM&apos;s decode cost across multiple
              tokens per pass.
            </Box>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where SLMs live in 2026 — four deployment patterns"
          >
            Deployment patterns
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Single-GPU inference</Box>
              <Box variant="p">
                A 7B SLM in BF16 fits in 14 GB of HBM; in FP8, 7 GB; in NVFP4,
                ~3.5 GB. KV cache for the working batch fits comfortably in
                what remains. A single H200 (141 GB) or B200 (180 GB) hosts
                dozens of concurrent SLM tenants on one device.
              </Box>
            </div>
            <div>
              <Box variant="h3">MIG-partitioned multi-tenant</Box>
              <Box variant="p">
                NVIDIA Multi-Instance GPU (MIG) on Blackwell B300 partitions
                288 GB of HBM into up to 7 instances of ~34 GB each, with
                hardware-isolated SMs (Streaming Multiprocessors) and bandwidth
                per instance. Each instance hosts a separate SLM at full FP16
                without contention — the cleanest multi-tenant SLM serving
                substrate available on a public cloud (Section 28).
              </Box>
            </div>
            <div>
              <Box variant="h3">Host-CPU with AMX or SVE2</Box>
              <Box variant="p">
                Xeon 6 with AMX FP16 (Section 11) and Graviton5 with SVE2 BFMMLA
                (Section 9) both run quantized SLMs at meaningful tokens-per-
                second on the host CPU. For workloads where the cost of a
                dedicated accelerator does not pencil out — internal tools,
                low-throughput tenants, retrieval-grounded chat — the host
                path is increasingly attractive.
              </Box>
            </div>
            <div>
              <Box variant="h3">Drafter for speculative decoding</Box>
              <Box variant="p">
                The SLM runs alongside the LLM on the same accelerator,
                producing draft tokens that the LLM verifies in batch. vLLM,
                TensorRT-LLM, and SGLang all support this pattern (Section 26).
                The SLM does not own a separate hardware budget; it borrows
                cycles on the LLM&apos;s silicon.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What changes about the silicon analysis when the model is small"
          >
            The arithmetic intensity argument, revisited for SLMs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 3 said decode is two orders of magnitude below the H200
            ridge point at batch 1. That argument generalizes to SLMs but with
            two important shifts.
          </Box>
          <Alert type="info" header="The working set fits in cache">
            A 1B parameter model in INT8 occupies 1 GB of weight bytes. That
            is well within the L3 cache of modern host CPUs — Graviton5&apos;s
            192 MB distributed L3, EPYC Turin&apos;s 384-512 MB L3, Xeon 6
            6900P&apos;s 504 MB L3 are all in the right size range to keep
            substantial portions of an SLM resident across decode. When the
            cache holds the weights, the bandwidth wall stops binding and the
            workload becomes compute-bound at much smaller batch sizes than a
            70B model would require.
          </Alert>
          <Box variant="p">
            <strong>The MIG slicing math.</strong> A B300 MIG instance with
            ~34 GB of HBM and a fractional share of SMs is precisely sized for
            7B-class SLMs in FP8 with KV cache headroom. Seven independent
            tenants, each running a different SLM (or different copies of the
            same SLM with different prompts), can share one GPU at full
            hardware isolation. For multi-tenant SaaS inference platforms,
            this is the cleanest economic story available.
          </Box>
          <Box variant="p">
            <strong>Quantization is essentially free.</strong> SLMs at INT8 or
            FP8 lose accuracy that is typically within calibration noise on
            the tasks they are deployed for. The quantization-friendly nature
            of small models compounds with the small parameter count to push
            the deployable footprint into single-host territory.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where SLMs are not the right answer"
          >
            What SLMs do not replace
          </Header>
        }
      >
        <ExpandableSection headerText="Long-context understanding and complex reasoning">
          <Box variant="p">
            Despite Phi-3-mini&apos;s 128K context window and Llama 3.2&apos;s
            extended context, the depth of reasoning a 1-3B parameter model can
            sustain over a long input is materially below frontier LLMs and MoE
            models. For tasks that require multi-step reasoning across complex
            documents — legal analysis, scientific literature synthesis, code
            comprehension across large codebases — the LLM remains the right
            tool. SLMs are good at concentrated tasks; they are not a general
            replacement for capability.
          </Box>
        </ExpandableSection>
        <ExpandableSection headerText="High-quality multilingual or domain-specialist work">
          <Box variant="p">
            Frontier-model multilingual quality and specialized domain
            capability (medicine, law, advanced coding) typically lives in the
            70B+ range. SLMs are improving fast in these areas but are still
            usually behind frontier models on hard benchmarks. The honest
            framing is per-task — not &ldquo;SLMs are good enough now&rdquo;
            generically.
          </Box>
        </ExpandableSection>
        <ExpandableSection headerText="The composition that wins in production">
          <Box variant="p">
            The deployments that win in 2026 are usually not pure-SLM or
            pure-LLM. They are routing systems: an SLM handles the easy 80% of
            requests cheaply, an LLM handles the hard 20%, and a router
            decides. Speculative decoding extends the same pattern at the
            kernel level. The SLM section in this deep dive is not arguing
            that SLMs replace frontier models — it is arguing that SLMs
            deserve their own architecture conversation alongside the
            frontier-model story.
          </Box>
        </ExpandableSection>
      </Container>
    </SpaceBetween>
  );
}
