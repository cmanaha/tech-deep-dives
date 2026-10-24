import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import { PrecisionLadder } from '../components/PrecisionLadder';
import { Cite } from '../components/Cite';
import { S } from '../sources/QuantizationAndPrecision';

interface FormatRow {
  format: string;
  runs: React.ReactNode;
  use: React.ReactNode;
}

const formatRows: FormatRow[] = [
  {
    format: 'FP64',
    runs: (
      <>
        Data-center GPUs. B300 rates 10 TFLOPS per 8-GPU board against B200&apos;s 296.
        <Cite s={S.hgxPage} />
      </>
    ),
    use: 'Scientific computing (HPC, high-performance computing)',
  },
  {
    format: 'FP32',
    runs: 'Every CPU, GPU and Trainium',
    use: 'Master weights, optimizer state, accumulators',
  },
  {
    format: 'TF32 (TensorFloat-32)',
    runs: (
      <>
        NVIDIA from compute capability 8.0 (Ampere)
        <Cite s={S.ptxIsa} note="'.tf32 alternate floating point type mma operation ... requires sm_80 or higher'; tf32 has 'the same range as .f32 and reduced precision (>=10 bits)'." />
        ; Trainium
        <Cite s={S.neuronDataTypes} />
      </>
    ),
    use: 'FP32 matmuls at FP32 range with a 10-bit mantissa',
  },
  {
    format: 'BF16',
    runs: (
      <>
        All current GPUs and Trainium
        <Cite s={S.neuronDataTypes} />; x86 CPUs with AMX (Advanced Matrix Extensions)
        <Cite s={S.clangAmxIntrin} note="TDPBF16PS: BF16 tile dot product." />
      </>
    ),
    use: 'Default training and serving format',
  },
  {
    format: 'FP16',
    runs: (
      <>
        All current GPUs and Trainium
        <Cite s={S.neuronDataTypes} />
      </>
    ),
    use: 'Models validated only at 16 bits',
  },
  {
    format: 'FP8 (E4M3, E5M2)',
    runs: (
      <>
        Hopper
        <Cite s={S.h200Page} />, Blackwell and Rubin
        <Cite s={S.hgxPage} />, Trainium2 and Trainium3
        <Cite s={S.neuronDataTypes} />, AMD MI355X
        <Cite s={S.mi355xPage} />
      </>
    ),
    use: (
      <>
        E4M3 for weights, activations and, with block scales, every FP8 training tensor
        <Cite s={S.deepseekV3Report} />; E5M2 for gradients in the older hybrid recipe
        <Cite s={S.deepseekV3Report} />
      </>
    ),
  },
  {
    format: 'MXFP8',
    runs: (
      <>
        Blackwell and Rubin
        <Cite
          s={S.ptxIsa}
          note="tcgen05.mma .kind::mxf8f6f4; tcgen05.mma is supported on 'sm_100f or higher in the same family'."
        />
        <Cite s={S.computeCapabilities} note="Family target compute_100f runs on compute capability 10.0, 10.3 and 10.7." />
        <Cite s={S.cutlassChangelog} note="4.8.0: Added initial Rubin support (SM107)." />
        , Trainium3
        <Cite s={S.trn3Page} />, AMD MI355X
        <Cite s={S.mi355xPage} />
      </>
    ),
    use: (
      <>
        Trainium3&apos;s 8-bit mode; checkpoints such as MiniMax-M3-MXFP8
        <Cite s={S.minimaxM3Mxfp8} />
      </>
    ),
  },
  {
    format: 'NVFP4',
    runs: (
      <>
        NVIDIA Blackwell and Rubin
        <Cite s={S.nvfp4Blog} />
        <Cite s={S.hgxPage} />
      </>
    ),
    use: (
      <>
        4-bit serving on NVIDIA; NVIDIA&apos;s own checkpoints
        <Cite s={S.deepseekV32Nvfp4Card} />
      </>
    ),
  },
  {
    format: 'MXFP4',
    runs: (
      <>
        NVIDIA Blackwell and Rubin
        <Cite s={S.nvfp4Blog} />
        <Cite s={S.ptxIsa} note="tcgen05.mma .kind::mxf4 and .kind::mxf8f6f4, supported on 'sm_100f or higher in the same family'." />
        <Cite s={S.computeCapabilities} note="Family target compute_100f runs on compute capability 10.0, 10.3 and 10.7." />
        <Cite s={S.cutlassChangelog} note="4.8.0: Added initial Rubin support (SM107)." />, Trainium3
        <Cite s={S.trainium3Arch} />, AMD MI355X
        <Cite s={S.mi355xPage} />
      </>
    ),
    use: (
      <>
        Models trained for 4-bit: gpt-oss mixture-of-experts (MoE) weights
        <Cite s={S.gptOssConfig} />, Kimi K3 weights
        <Cite s={S.kimiK3Readme} />
      </>
    ),
  },
  {
    format: 'INT8 (8-bit integer)',
    runs: (
      <>
        Hopper and B200 at the FP8 rate
        <Cite s={S.h200Page} />
        <Cite s={S.hgxPage} />; far below FP8 on B300 and Rubin; no signed INT8 on Trainium
        <Cite s={S.neuronDataTypes} />
      </>
    ),
    use: 'Quantized serving on CPUs, Hopper and B200',
  },
];

export function QuantizationAndPrecision() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Bytes per value set how fast memory-bound decode runs, which makes precision the cheapest lever on the roofline"
          >
            Quantization and Precision
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Quantization stores a model&apos;s numbers in a narrower format. Every weight,
            activation and KV (key-value) cache entry has a format, chosen tensor by tensor, and
            the format fixes the bytes each value costs. DeepSeek-V3.2 takes 690 GB at FP8
            (8-bit floating point)
            <Cite s={S.deepseekV32Files} /> and 415 GB at NVFP4, NVIDIA&apos;s 4-bit format
            <Cite s={S.deepseekV32Nvfp4Files} />, a 1.66x cut.
            <Cite s={S.deepseekV32Nvfp4Card} />
          </Box>
          <Box variant="p">
            A decode step reads every active weight from HBM (High Bandwidth Memory) once, so
            while decode is memory-bound, halving the bytes roughly doubles throughput until
            compute binds (see <em>Roofline and Arithmetic Intensity</em>).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What each step down buys in bytes and gives up in range and resolution"
          >
            The precision ladder
          </Header>
        }
      >
        <SpaceBetween size="m">
          <PrecisionLadder />
          <Box variant="small" color="text-body-secondary">
            FP64 to FP16 layouts and maxima follow from each format&apos;s exponent and
            precision fields
            <Cite s={S.llvmApFloat} kind="derived" note="fltSemantics {maxExponent, minExponent, precision, sizeInBits}: half {15, -14, 11, 16}, BFloat {127, -126, 8, 16}, single {127, -126, 24, 32}, double {1023, -1022, 53, 64}, TF32 {127, -126, 11, 19}. Max = (2 - 2^(1 - precision)) x 2^maxExponent." />
            <Cite s={S.neuronDataTypes} note="Layout table: FP32 1/8/23, TF32 1/8/10, BF16 1/8/7, FP16 1/5/10, FP8_e5m2 1/5/2, FP8_e4m3 1/4/3." />
            ; FP8 and FP4 maxima and the MX block of 32 from the OCP (Open Compute Project)
            Microscaling (MX) specification
            <Cite s={S.ocpMx} note="E4M3 max 448, E5M2 max 57,344, E2M1 max 6.0; MXFP8 and MXFP4 carry one 8-bit E8M0 scale per 32 elements, 0.25 bits per value." />
            ; NVFP4&apos;s 4.5 bits from NVIDIA.
            <Cite s={S.nvfp4Blog} />
          </Box>
          <Box variant="p">
            Each step down gives up exponent bits (range), mantissa bits (resolution) or both,
            and deployments mix rungs by tensor: FP32 master weights, BF16 (bfloat16) or FP8 in training,
            FP8, 4-bit or INT8 weights at inference. FP8 training holds at scale: DeepSeek-V3
            used E4M3 (4 exponent bits, 3 mantissa bits) on every FP8 tensor, gradients included,
            with tile- and block-wise scaling.
            <Cite s={S.deepseekV3Report} /> A 12-billion-parameter model trained on 10 trillion
            tokens in NVFP4 reached loss and downstream accuracy comparable to its FP8 baseline.
            <Cite s={S.nvfp4Pretraining} kind="measured" />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Check that the target chip runs your format in its matrix units before you quantize to it"
          >
            Where each format runs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={formatRows}
            columnDefinitions={[
              { id: 'fmt', header: 'Format', cell: (r) => r.format, minWidth: 110 },
              { id: 'runs', header: 'Where it runs in hardware', cell: (r) => r.runs, minWidth: 220 },
              { id: 'use', header: 'What it is used for', cell: (r) => r.use, minWidth: 200 },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="p">
            INT8 is the format to re-check on a newer chip. H200 and B200 run it at the FP8 rate;
            B300 runs it at 1/24 of FP8 and Rubin at 1/70.
            <Cite
              s={S.hgxPage}
              kind="derived"
              note="Same label on both sides of each ratio. HGX B200 and HGX B300 boards (sparse): INT8 72 and 3 POPS, FP8 72 PFLOPS on both. Rubin per GPU (dense): INT8 250 TOPS, FP8 17.5 PFLOPS."
            />
            <Cite s={S.h200Page} note="INT8 3,958 TOPS and FP8 3,958 TFLOPS, both with sparsity." />{' '}
            Neuron lists no signed INT8 type and converts integer matmuls to FP32.
            <Cite s={S.neuronDataTypes} /> AMD MI355X
            <Cite s={S.mi355xPage} note="5 POPs INT8 and 5 PFLOPs OCP-FP8, both without sparsity." /> and
            x86 CPUs with AMX
            <Cite s={S.clangAmxIntrin} note="TDPBSSD: signed 8-bit dot product into 32-bit accumulators." />{' '}
            keep INT8 matrix math. Requantize INT8 models to FP8 or 4-bit before targeting B300,
            Rubin or Trainium.
          </Box>
        </SpaceBetween>
      </Container>
      <Container
        header={
          <Header
            variant="h2"
            description="Why a 4-bit checkpoint comes out 1.66x smaller than FP8 rather than 2x, and what NVIDIA measured it cost in accuracy"
          >
            Four-bit formats: one shared scale per block
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A 4-bit float (E2M1: two exponent bits, one mantissa bit) has 16 codes and a largest
            value of 6.
            <Cite s={S.ocpMx} /> That is too coarse for a whole tensor, so each small block of
            values gets its own scale, which carries the magnitude. Two formats do this in
            hardware.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">NVFP4</Box>
              <Box variant="p">
                NVIDIA&apos;s format: one E4M3 (FP8) scale per 16 values plus an FP32 scale per
                tensor, 4.5 bits per value and about 1.8x smaller than FP8. The E4M3 scale can be
                fractional, so it fits each block more tightly than a power-of-two scale.
                <Cite s={S.nvfp4Blog} /> Tensor Cores run it through <code>tcgen05.mma</code> (
                <code>.kind::mxf4nvf4</code>) on Blackwell and Rubin.
                <Cite s={S.ptxIsa} />
                <Cite s={S.computeCapabilities} note="Family target compute_100f runs on compute capability 10.0, 10.3 and 10.7." />
                <Cite s={S.cutlassChangelog} note="4.8.0: Added initial Rubin support (SM107)." />
              </Box>
            </div>
            <div>
              <Box variant="h3">MXFP4</Box>
              <Box variant="p">
                The OCP MX standard: one E8M0 (power-of-two) scale per 32 values
                <Cite s={S.ocpMx} />, 4.25 bits per value.
                <Cite s={S.ocpMx} kind="derived" note="4 bits + 8 / 32 bits of scale." /> NVIDIA
                rates its risk of a noticeable accuracy drop against FP8 higher than NVFP4&apos;s.
                <Cite s={S.nvfp4Blog} kind="vendor-claim" /> It runs on NVIDIA Blackwell
                <Cite s={S.nvfp4Blog} />, AMD MI355X
                <Cite s={S.mi355xPage} /> and Trainium3.
                <Cite s={S.trainium3Arch} />
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info" header="Measured by NVIDIA: DeepSeek-V3.2 at NVFP4">
            DeepSeek-V3.2 drops from 690 GB of weights at FP8
            <Cite s={S.deepseekV32Files} /> to 415 GB at NVFP4
            <Cite s={S.deepseekV32Nvfp4Files} />, about 1.66x.
            <Cite s={S.deepseekV32Nvfp4Card} /> Only the linear layers inside the transformer
            blocks are quantized, so the cut stays under the format&apos;s 1.8x.
            <Cite
              s={S.deepseekV32Nvfp4Card}
              kind="derived"
              note="'Only the weights and activations of the linear operators within transformer blocks are quantized.' 689.5 / 415.1 = 1.66; NVFP4's 4.5 bits against FP8's 8 is 1.78."
            />{' '}
            On NVIDIA&apos;s evaluation no score moved more than 0.014: GPQA Diamond 0.849 to
            0.835, AIME 2025 0.934 to 0.923, MMLU Pro 0.802 to 0.799.
            <Cite s={S.deepseekV32Nvfp4Card} kind="measured" note="NVIDIA's benchmarks on B200, temperature 1.0, top_p 0.95. Also LiveCodeBench V6 0.756 on both, SciCode 0.391 to 0.401." />
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Precision, batching and fusion raise arithmetic intensity; MoE lowers it per expert, which is why MoE decode needs thousands of tokens in flight"
          >
            How precision composes with batching, fusion and MoE
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            For a decode matmul, arithmetic intensity is about twice the tokens sharing each
            weight read, divided by bytes per weight. Batching adds tokens per read, fusion such
            as FlashAttention removes HBM round trips (see <em>KV Cache and FlashAttention</em>),
            and FP8 to NVFP4 cuts bytes per weight about 1.8x.
            <Cite s={S.nvfp4Blog} kind="derived" note="2 FLOP per weight per token; 8 bits against 4.5 bits per weight." />
          </Box>
          <Box variant="p">
            When the math drops to the weights&apos; precision, the ridge moves too. H200&apos;s
            dense ridge is 206 FLOP per byte at BF16 and 412 at FP8, so both turn compute-bound
            at about 206 tokens per weight read.
            <Cite
              s={S.h200Page}
              kind="derived"
              note="Dense is half NVIDIA's sparse figures: BF16 989.5 and FP8 1,979 TFLOPS over 4.8 TB/s. Intensity B FLOP per byte with BF16 weights and 2B with FP8 weights reaches the ridge at B = 206 in both cases."
            />{' '}
            Quantizing weights and math together keeps that batch and halves the bytes of every
            memory-bound step below it.
          </Box>
          <Box variant="p">
            MoE pulls the other way. It cuts bytes and FLOPs per token
            together, so batch-1 intensity matches a dense model, but at batch B with k of N
            experts active each expert sees about B x k / N tokens: expert intensity falls by
            k / N. DeepSeek-V3 routes each token to 8 of 256 routed experts, 1/32
            <Cite s={S.deepseekV3Config} />, and reports per-expert decode batches
            &quot;usually within 256 tokens&quot;, bound by memory access.
            <Cite s={S.deepseekV3Report} /> Feeding each routed expert the 206 tokens an H200
            needs at FP8 takes about 6,600 tokens in flight per step across the expert-parallel
            group.
            <Cite s={S.deepseekV3Config} kind="derived" note="206 x 256 / 8 = 6,592 tokens per step." />{' '}
            Size MoE decode by tokens per expert; <em>Mixture of Experts and Sparse
            Activation</em> covers the expert-parallel layouts that gather them.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What to check before committing a model to a format: the checkpoint, the chip, the accuracy and the KV cache"
          >
            Choosing a precision for a deployment
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Start with the checkpoint.</strong> The precision decision increasingly
            arrives with it: gpt-oss ships its MoE weights in MXFP4
            <Cite s={S.gptOssConfig} note="quant_method mxfp4; attention, router, embeddings and lm_head left unconverted." />,
            Kimi K2.5 native INT4
            <Cite s={S.kimiK25Readme} />, Kimi K3 MXFP4 weights and MXFP8 activations,
            quantization-aware trained from supervised fine-tuning onward
            <Cite s={S.kimiK3Readme} />, and DeepSeek-V4-Pro stores its experts in FP4.
            <Cite s={S.deepseekV4ProConfig} /> The question then is whether the target chip runs
            that format in its matrix units (the table above).
          </Box>
          <Box variant="p">
            <strong>Validate accuracy on your own evaluation.</strong> NVIDIA&apos;s DeepSeek-V3.2
            figures describe one recipe (TensorRT Model Optimizer, linear layers only) on
            NVIDIA&apos;s benchmarks.
            <Cite s={S.deepseekV32Nvfp4Card} /> Rerun them for any other model or quantizer,
            calibrating on data that looks like production traffic.
          </Box>
          <Box variant="p">
            <strong>Treat the KV cache as its own decision.</strong> DeepSeek&apos;s vLLM command
            for V4-Pro serves an FP8 KV cache
            <Cite s={S.deepseekV4ProReadme} />, and DeepSeek-V4.1-Flash keeps its main KV cache in
            FP4 (E2M1, one E4M3 scale per 16 channels), part of what brings its global KV cache to
            890 bytes per token.
            <Cite s={S.deepseekV41Flash} /> Evaluate KV precision separately from weights.
          </Box>
          <Box variant="p">
            <strong>Start from a stack that combines the levers.</strong> TensorRT-LLM ships
            NVFP4 MoE kernels
            <Cite s={S.trtllmV100} note="'Add TRTLLM MoE nvfp4 cubins for mid-high concurrency'." /> and a
            wide expert-parallel example
            <Cite s={S.wideEpExample} />; the NKI (Neuron Kernel Interface) library carries MoE
            kernels with MXFP8 variants
            <Cite s={S.nkiLibNotes} note="Kernel list includes Blockwise MM Forward MXFP8 and MX MoE Block TKG Wrapper." />;
            vLLM selects FlashInfer MoE kernels through its <code>flashinfer_trtllm</code> and{' '}
            <code>flashinfer_cutlass</code> backends.
            <Cite s={S.vllmKernelConfig} />
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
