import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite } from '../components/Cite';
import { SlmParamsChart, slmModels, valueLabel } from '../components/SlmParamsChart';
import { S } from '../sources/SmallLanguageModels';

const ridgeNote =
  'A decode step does 2 FLOP per weight per sequence; 16-bit weights are 2 bytes, so batch 1 is about 1 FLOP per byte. H200 dense BF16 is 989.5 TFLOPS (half the page\'s sparse 1,979) over 4.8 TB/s: a ridge of 206 FLOP per byte.';
const cacheNote = '1B parameters x 1 byte (INT8) = 1 GB, twice the 512 MB L3 of the EPYC 9755.';
const ceilingNote =
  '614 GB/s / 1 GB read per token = 614 tokens/s, 1.6 ms per token; 230.4 GB/s per r8i node / 1 GB = 230 tokens/s. Weights only: KV-cache reads lower both.';
const subMsNote =
  'Under 1 ms per token at 614 GB/s means under 0.614 GB read per token: about 0.6B parameters at 1 byte each.';
const kvNote =
  'config.json: 6 of 24 layers are full attention, with 2 KV heads of dimension 256. Per token: 6 layers x 2 (K and V) x 2 heads x 256 x 2 bytes (BF16) = 12,288 bytes. At 262,144 tokens: 3.2 GB. With all 24 layers full attention: 12.9 GB.';
const sizeNote =
  '7B x 2 bytes (BF16) = 14 GB; x 1 byte (FP8) = 7 GB. NVFP4 stores 4 bits per value plus one 8-bit E4M3 scale per 16 values, 4.5 bits: 7B x 4.5 / 8 = 3.9 GB.';
const migNote = '23 GB slice minus about 7 GB of FP8 weights = about 16 GB for KV cache and activations.';
const qatDeltaNote =
  'GSM8K on Meta\'s evaluation: BF16 44.4, vanilla PTQ 33.1 (11.3 lower), SpinQuant 40.6 (3.8 lower), QAT plus LoRA 46.5 (2.1 higher).';

interface QuantRow {
  build: string;
  mmlu: string;
  gsm8k: string;
  decode: string;
  file: string;
}

const quantRows: QuantRow[] = [
  { build: 'BF16 (baseline)', mmlu: '49.3', gsm8k: '44.4', decode: '19.2', file: '2,358 MB' },
  {
    build: 'Naive PTQ (not released)',
    mmlu: '43.3',
    gsm8k: '33.1',
    decode: 'not published',
    file: 'not published',
  },
  { build: 'SpinQuant', mmlu: '47.3', gsm8k: '40.6', decode: '50.2', file: '1,083 MB' },
  { build: 'QAT plus LoRA (Meta: "QLoRA")', mmlu: '49.0', gsm8k: '46.5', decode: '45.8', file: '1,127 MB' },
];

export function SmallLanguageModels() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Models under 15B parameters decode only as fast as their memory streams the weights, and lose accuracy at 4 bits unless trained for it"
          >
            Small Language Models
          </Header>
        }
      >
        <Box variant="p">
          A small language model (SLM) here is one under 15B parameters: small enough for one GPU,
          one MIG (Multi-Instance GPU) slice, a host CPU or a phone, or to run beside a large model
          as its drafter. At this size capacity stops being the limit, and three choices take over:
          memory bandwidth, the drafter and the precision. Precision carries a measured accuracy
          cost: naive 4-bit quantization costs Llama 3.2 1B 11 points on a grade-school math
          benchmark, and Meta&apos;s quantization-aware checkpoint wins them back.
          <Cite s={S.llama32Card} kind="derived" note={qatDeltaNote} />
        </Box>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which current small models to choose from, the memory each needs and the context each reads"
          >
            The 2025-2026 small-model lineup
          </Header>
        }
      >
        <SpaceBetween size="m">
          <SlmParamsChart />
          <Box variant="small" color="text-body-secondary">
            Stored parameters are safetensors totals at each pinned revision, including any vision
            and audio encoders. SmolLM3-3B trains at 64K and extends to 128K.
            <Cite s={S.smollm3} /> Sources: the table below.
          </Box>
          <Box variant="p">
            Size memory on the stored count and per-token work on the effective count: Gemma 4 E2B
            stores 5.1B parameters and computes like 2.3B, because its Per-Layer Embeddings (PLE)
            are tables read by lookup.
            <Cite s={S.gemma4E2b} /> Llama 3.2 (September 2024) is still Meta&apos;s newest small
            general-purpose model on Hugging Face.
            <Cite s={S.hfMetaListing} />
          </Box>
          <ExpandableSection headerText="Figures and pinned model cards for the chart">
            <Table
              items={slmModels}
              columnDefinitions={[
                { id: 'name', header: 'Model', cell: (m) => m.name, minWidth: 130 },
                { id: 'params', header: 'Parameters', cell: (m) => valueLabel(m), minWidth: 150 },
                { id: 'context', header: 'Context', cell: (m) => m.context, minWidth: 110 },
                {
                  id: 'source',
                  header: 'Source',
                  minWidth: 140,
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
            description="Divide memory bandwidth by the bytes each token reads, and you have the batch-1 token rate before you benchmark"
          >
            SLM decode is a bandwidth budget
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Batch-1 decode reads every weight once per token, about 200 times below the H200&apos;s
            ridge point (<em>Roofline and Arithmetic Intensity</em>).
            <Cite s={S.h200Page} kind="derived" note={ridgeNote} /> Small weights do not change
            that. A 1B-parameter model at INT8 (8-bit integer) is 1 GB, twice the 512 MB L3 of the
            largest EPYC Turin parts
            <Cite s={S.epyc9005Datasheet} kind="derived" note={cacheNote} />; an r8i Xeon 6 node
            has 160 MB
            <Cite s={S.chipsAndCheeseXeon6} /> and a Graviton5 NUMA (Non-Uniform Memory Access)
            node at most 96 MB.
            <Cite s={S.gravitonReadme} /> Every token streams the weights from DRAM.
          </Box>
          <Box variant="p">
            So bandwidth sets the ceiling: a Turin socket&apos;s 614 GB/s
            <Cite s={S.epyc9755Page} /> allows at most about 614 tokens per second for that 1 GB
            model, 1.6 ms per token, and one r8i node&apos;s 230.4 GB/s about 230.
            <Cite s={S.chipsAndCheeseXeon6} kind="derived" note={ceilingNote} /> Sub-millisecond
            batch-1 decode needs a model under about 0.6B parameters at INT8 on a whole socket.
            <Cite s={S.epyc9755Page} kind="derived" note={subMsNote} />
          </Box>
          <Box variant="p">
            Batching raises throughput, because one weight read serves every sequence in the batch.
            That is where AMX (Advanced Matrix Extensions) on Xeon 6 P-cores
            <Cite s={S.llvmX86Td} note="FeatureAMXFP16 is in the Granite Rapids feature list." />{' '}
            and the BF16 (bfloat16) and INT8 MMLA (matrix multiply-accumulate) instructions on
            Graviton3, Graviton4 and Graviton5
            <Cite s={S.gravitonLlamaCpp} /> pay off; the batch-1 ceiling stays where memory puts it
            (<em>Intel Xeon 6</em>, <em>Graviton Deep Dive</em>). A host CPU suits low-rate
            tenants, such as internal tools, where an accelerator would sit idle.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two designs that change how much memory a small model needs, and so which device it fits"
          >
            Hybrid attention and small-active mixture of experts
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Hybrid attention keeps the KV (key-value) cache small.</strong> Qwen3.5&apos;s small models
            use Gated DeltaNet, a linear attention with a fixed-size state, in three of every four
            layers
            <Cite s={S.qwen35_08b} />; Gemma 4 E2B and E4B interleave 512-token sliding-window
            layers with global ones.
            <Cite s={S.gemma4E2b} /> The KV cache grows with context only in the
            global layers: Qwen3.5-2B at its full 262,144 tokens holds about 3.2 GB of BF16 KV
            cache, a quarter of the all-global figure
            <Cite s={S.qwen35_2bConfig} kind="derived" note={kvNote} />, which is how 128K to 262K
            contexts fit in edge memory (<em>KV Cache and FlashAttention</em>).
          </Box>
          <Box variant="p">
            <strong>A small-active MoE (mixture of experts) trades capacity for bandwidth.</strong> gpt-oss-20b holds 21B
            parameters, activates 3.6B per token and runs within 16 GB.
            <Cite s={S.gptOss20b} /> Memory holds every expert and decode reads only the active
            ones (<em>Mixture of Experts and Sparse Activation</em>), so on a 128 GB, 273 GB/s DGX
            Spark
            <Cite s={S.sparkHardware} /> or Jetson AGX Thor
            <Cite s={S.thorBlog} />, compare such a model against a dense 3B to 7B one (
            <em>Edge Shared-Memory Silicon</em>).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Size each placement from its bytes: a GPU, a MIG slice, or a share of the target's GPU as its drafter"
          >
            Where SLMs run
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>One GPU.</strong> A 7B model&apos;s weights are about 14 GB in BF16, 7 GB in FP8
            (8-bit floating point) and 4 GB in NVFP4, NVIDIA&apos;s 4-bit format with an 8-bit
            scale per 16 values.
            <Cite s={S.nvfp4Blog} kind="derived" note={sizeNote} />
          </Box>
          <Box variant="p">
            <strong>A MIG slice.</strong> MIG splits a data-center GPU into up to seven
            hardware-isolated instances.
            <Cite s={S.migSupportedGpus} />
            <Cite s={S.migConcepts} /> B200&apos;s <code>1g.23gb</code> profile gives seven per
            GPU
            <Cite s={S.migSupportedProfiles} />; NVIDIA&apos;s Blackwell Ultra blog splits
            B300&apos;s 288 GB into up to seven of 34 GB
            <Cite s={S.blackwellUltraBlog} />, though the MIG guide has no HGX B300 table.
            <Cite s={S.migSupportedGpus} /> A 7B FP8 model leaves about 16 GB of a 23 GB slice for
            KV cache.
            <Cite s={S.migSupportedProfiles} kind="derived" note={migNote} /> Past seven tenants,
            isolation is the serving software&apos;s job (<em>Isolation: NIE and MIG</em>).
          </Box>
          <Box variant="p">
            <strong>As a drafter.</strong> A small model proposes tokens that the target verifies
            in one pass (<em>Disaggregated Serving and Speculative Decoding</em>). New families ship
            their own: Gemma 4 publishes an MTP (multi-token prediction) assistant for every size
            <Cite s={S.gemma4Qat} />, 78M parameters for E2B
            <Cite s={S.gemma4E2bAssistant} />, and Qwen3.5&apos;s small models carry an MTP layer.
            <Cite s={S.qwen35_2bConfig} note="mtp_num_hidden_layers: 1." /> Use the shipped drafter
            where one exists; vLLM rates it above a separate draft model at high request rates.
            <Cite s={S.vllmSpecReadme} note="Method table, high QPS (queries per second) column: EAGLE and MTP 'Medium to high gain', draft model 'Medium gain'." />
          </Box>
          <ExpandableSection headerText="Configuring the drafter in vLLM">
            <Box variant="p">
              vLLM rates EAGLE (Extrapolation Algorithm for Greater Language-model Efficiency) and
              MTP drafters &quot;Medium to high gain&quot; at high request rates, against
              &quot;Medium gain&quot; for a separate draft model.
              <Cite s={S.vllmSpecReadme} /> Gemma 4 assistants run as <code>&quot;method&quot;: &quot;mtp&quot;</code>; a startup
              log showing <code>method=&apos;draft_model&apos;</code> for one means the installed
              vLLM lacks Gemma 4 MTP support.
              <Cite s={S.vllmSpecReadme} /> Qwen3.5&apos;s card recommends{' '}
              <code>{'{"method":"qwen3_next_mtp","num_speculative_tokens":2}'}</code>.
              <Cite s={S.qwen35_2b} /> A separate draft model uses{' '}
              <code>&quot;method&quot;: &quot;draft_model&quot;</code> and must share the
              target&apos;s vocabulary unless <code>use_heterogeneous_vocab</code> is set, which
              requires greedy draft sampling.
              <Cite s={S.vllmDraftModel} />
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where a larger model still earns its cost, measured inside one model family"
          >
            What SLMs do not replace
          </Header>
        }
      >
        <Box variant="p">
          A context window sets how much a model can read, and within one family what it does with
          that input improves with size. On Google&apos;s evaluation, Gemma 4 E2B scores 19.1% on
          8-needle retrieval at 128K tokens (MRCR v2, multi-round coreference resolution) against
          66.4% for Gemma 4 31B, and 24.5% against 76.9% on the Tau2 agent benchmark.
          <Cite s={S.gemma4E2b} kind="measured" /> Judge per task on your own evaluation, and route
          mixed traffic so each request goes to the smallest model that handles it.
        </Box>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Start from the vendor's quantization-aware checkpoint: it keeps the accuracy that naive 4-bit quantization loses"
          >
            Shipping an SLM at 4 bits
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            At 4 bits the method matters. Meta scored three 4-bit builds of Llama 3.2 1B against
            BF16 on MMLU (Massive Multitask Language Understanding) and GSM8K (grade-school math),
            and timed them on a OnePlus 12 phone: naive PTQ (post-training quantization, not
            released), SpinQuant (learned rotations plus GPTQ, generative post-training
            quantization) and QAT (quantization-aware training) with LoRA (low-rank adaptation).
            <Cite s={S.llama32Card} />
          </Box>
          <Table
            items={quantRows}
            columnDefinitions={[
              { id: 'build', header: 'Llama 3.2 1B build', cell: (r) => r.build, minWidth: 160 },
              {
                id: 'mmlu',
                header: (
                  <>
                    MMLU
                    <Cite s={S.llama32Card} kind="measured" />
                  </>
                ),
                cell: (r) => r.mmlu,
                minWidth: 130,
              },
              {
                id: 'gsm8k',
                header: (
                  <>
                    GSM8K
                    <Cite s={S.llama32Card} kind="measured" />
                  </>
                ),
                cell: (r) => r.gsm8k,
                minWidth: 130,
              },
              {
                id: 'decode',
                header: (
                  <>
                    Decode, tokens/s
                    <Cite s={S.llama32Card} kind="vendor-claim" />
                  </>
                ),
                cell: (r) => r.decode,
                minWidth: 150,
              },
              {
                id: 'file',
                header: (
                  <>
                    File
                    <Cite s={S.llama32Card} />
                  </>
                ),
                cell: (r) => r.file,
                minWidth: 120,
              },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="p">
            Four-bit weights halve the file and speed phone decode 2.4x to 2.6x.
            <Cite s={S.llama32Card} kind="vendor-claim" /> Naive PTQ loses 11 GSM8K points,
            SpinQuant 4, and QAT plus LoRA ends 2 above BF16.
            <Cite s={S.llama32Card} kind="derived" note={qatDeltaNote} /> The quantized builds run
            at 8K context, against 128K for BF16.
            <Cite s={S.llama32Card} />
          </Box>
          <Box variant="p">
            <strong>Start from the vendor&apos;s QAT checkpoint.</strong> For Llama 3.2 1B that is{' '}
            <code>Llama-3.2-1B-Instruct-QLORA_INT4_EO8</code>.
            <Cite s={S.llama32Qat} /> For Gemma 4, Google publishes Q4_0 GGUF files (the llama.cpp
            model format) for every size and w4a16 (4-bit weights, 16-bit activations) checkpoints
            for vLLM on E2B, E4B, 12B and 31B, and a QAT target needs the QAT build of its MTP assistant at the same
            precision.
            <Cite s={S.gemma4Qat} /> Then rerun your own evaluation on the quantized build: these
            scores are each vendor&apos;s own benchmarks.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
