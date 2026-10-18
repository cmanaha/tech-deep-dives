import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

const QUANT = 'vllm/model_executor/layers/quantization';
const QUANT_INIT = `${QUANT}/__init__.py`;
const QUANT_CFG = 'vllm/config/quantization.py';
const WEIGHT_UTILS = 'vllm/model_executor/model_loader/weight_utils.py';
const KERNELS_PY = 'vllm/model_executor/kernels/linear/__init__.py';
const QUANT_DOCS = vllmDocsUrl('features/quantization/');
const ONLINE_DOCS = vllmDocsUrl('features/quantization/online/');
const FP8_DOCS = vllmDocsUrl('features/quantization/llm_compressor/fp8/');
const KV_DOCS = vllmDocsUrl('features/quantization/quantized_kvcache/');
const BNB_PLUGIN = 'https://github.com/vllm-project/vllm-bnb-plugin/blob/v0.0.3';
const GGUF_PLUGIN = 'https://github.com/vllm-project/vllm-gguf-plugin/blob/v0.0.5';

function release(tag: string): string {
  return `https://github.com/vllm-project/vllm/releases/tag/${tag}`;
}

interface FormatRow {
  format: string;
  bits: string;
  family: string;
  notes: ReactNode;
}

const formatRows: FormatRow[] = [
  {
    format: 'AWQ',
    bits: 'W4A16 (weight-only INT4)',
    family: 'Weight-only',
    notes: (
      <>
        Activation-aware weight quantization. Prequantized checkpoints (AutoAWQ or llm-compressor).
        Dequantizes to FP16 or BF16 for the matmul{' '}
        <Cite tier={1} href={vllmUrl(`${QUANT}/auto_awq.py`, 'L229-L230')}>
          auto_awq.py L229-L230
        </Cite>{' '}
        and runs on Marlin kernels where available.{' '}
        <code>awq</code>, <code>awq_marlin</code> and <code>auto_awq</code> are three names for one
        config class{' '}
        <Cite tier={1} href={vllmUrl(QUANT_INIT, 'L156-L159')}>
          __init__.py L156-L159
        </Cite>
        .
      </>
    ),
  },
  {
    format: 'GPTQ / GPTQModel',
    bits: 'W4A16 / W8A16 (weight-only INT4/INT8)',
    family: 'Weight-only',
    notes: (
      <>
        Per-group post-training quantization. GPTQModel produces new 4-bit or 8-bit GPTQ
        checkpoints{' '}
        <Cite tier={1} href={vllmDocsUrl('features/quantization/gptqmodel/')}>
          vLLM docs: GPTQModel
        </Cite>
        . A checkpoint quantized with group
        activation ordering (<code>desc_act=True</code> plus a group size) fails to load: pick one
        with static ordering or <code>desc_act=False</code>{' '}
        <Cite tier={1} href={vllmUrl(`${QUANT}/utils/gptq_utils.py`, 'L23-L50')}>
          gptq_utils.py L23-L50
        </Cite>
        .
      </>
    ),
  },
  {
    format: 'Marlin',
    bits: 'Kernel backend for W4A16 / W8A16 and FP8 / FP4 weights',
    family: 'Kernel backend',
    notes: (
      <>
        Mixed-precision GEMM kernels that AWQ, GPTQ, FP8 and FP4 checkpoints dispatch onto{' '}
        <Cite tier={1} href={QUANT_DOCS}>
          vLLM docs: hardware matrix, Marlin row
        </Cite>
        . Marlin repacks the weights at load time, so it is a kernel path for other formats to run
        on rather than a format of its own{' '}
        <Cite
          tier={1}
          href={vllmUrl('vllm/model_executor/kernels/linear/mixed_precision/marlin.py', 'L74-L110')}
        >
          mixed_precision/marlin.py L74-L110
        </Cite>
        .
      </>
    ),
  },
  {
    format: 'INT8 W8A8',
    bits: 'W8A8 (8-bit weights + activations)',
    family: 'W8A8',
    notes:
      'Weights and activations both in INT8, so the matmul itself runs in INT8. Prequantized with llm-compressor (SmoothQuant-style). A compute speedup on top of the memory saving.',
  },
  {
    format: 'FP8 W8A8 (E4M3)',
    bits: 'W8A8 (8-bit float)',
    family: 'W8A8',
    notes: (
      <>
        The 8-bit path with native FP8 compute on Ada, Hopper and Blackwell{' '}
        <Cite tier={1} href={FP8_DOCS}>
          vLLM docs: FP8 W8A8
        </Cite>
        . Per-tensor, per-channel or per-block weight scales, with dynamic or calibrated static
        activation scales{' '}
        <Cite tier={1} href={vllmUrl(`${QUANT}/fp8.py`, 'L89-L100')}>
          fp8.py L89-L100
        </Cite>
        . From a prequantized checkpoint, or online from a BF16 checkpoint with{' '}
        <code>--quantization fp8_per_tensor</code> (no calibration){' '}
        <Cite tier={1} href={vllmUrl(QUANT_CFG, 'L187-L201')}>
          quantization.py L187-L201
        </Cite>
        .
      </>
    ),
  },
  {
    format: 'FP8 E5M2',
    bits: '8-bit float (KV-cache use)',
    family: 'KV cache',
    notes:
      'Wider exponent, less mantissa than E4M3. Mainly seen as a KV-cache dtype; lower precision than E4M3 for the same 8 bits.',
  },
  {
    format: 'NVFP4 / MXFP4 / MXFP8',
    bits: 'W4A4 / W8A8 (block-scaled low-bit float)',
    family: 'Low-bit float (Blackwell)',
    notes: (
      <>
        Microscaling block formats with hardware acceleration on Blackwell. Authored with NVIDIA
        Model Optimizer or llm-compressor, or applied online with <code>--quantization mxfp4</code>{' '}
        or <code>mxfp8</code>; <code>nvfp4_per_token</code> quantizes the expert layers of MoE
        (mixture-of-experts) models online{' '}
        <Cite tier={1} href={vllmUrl(QUANT_CFG, 'L202-L218')}>
          quantization.py L202-L218
        </Cite>
        .
      </>
    ),
  },
  {
    format: 'Quantized KV cache (FP8 and lower)',
    bits: 'KV entries in FP8, INT8, INT4 or FP4',
    family: 'KV cache',
    notes: (
      <>
        Independent of weight quantization: it shrinks the per-request KV footprint so more
        sequences fit. Set with <code>--kv-cache-dtype</code>: FP8 (E4M3, E5M2), per-token-head
        INT4, INT8 and FP8, NVFP4, and TurboQuant variants{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L39-L58')}>
          cache.py L39-L58
        </Cite>
        .
      </>
    ),
  },
  {
    format: 'bitsandbytes (plugin)',
    bits: 'W8A16 / W4A16 (NF4, 4-bit NormalFloat)',
    family: 'Out-of-tree plugin',
    notes: (
      <>
        Weight quantization at load time with no calibration, or a prequantized bitsandbytes
        checkpoint. Ships as <code>vllm-bnb-plugin</code>; install it before serving{' '}
        <Cite tier={1} href={vllmDocsUrl('features/quantization/bnb/')}>
          vLLM docs: BitsAndBytes
        </Cite>
        .
      </>
    ),
  },
  {
    format: 'GGUF (plugin)',
    bits: 'mixed (Q4_K_M, Q5_K, Q8_0, ...)',
    family: 'Out-of-tree plugin',
    notes: (
      <>
        The llama.cpp checkpoint format, and the only row in the matrix below marked supported on
        every NVIDIA generation listed and on AMD GPUs. Ships as <code>vllm-gguf-plugin</code>; the docs mark GGUF support as
        experimental and under-optimized{' '}
        <Cite tier={1} href={vllmDocsUrl('features/quantization/gguf/')}>
          vLLM docs: GGUF
        </Cite>
        .
      </>
    ),
  },
];

interface HwRow {
  impl: string;
  volta: string;
  turing: string;
  ampere: string;
  ada: string;
  hopper: string;
  amd: string;
}

// Cells from the supported-hardware matrix in
// https://docs.vllm.ai/en/v0.31.0/features/quantization/ (accessed 2026-10-16).
// Y = supported, N = not supported, Y* = caveat. The bitsandbytes and GGUF rows
// load through out-of-tree plugins at v0.31.0.
const hwRows: HwRow[] = [
  { impl: 'AWQ', volta: 'N', turing: 'Y', ampere: 'Y', ada: 'Y', hopper: 'Y', amd: 'N' },
  { impl: 'GPTQ', volta: 'Y', turing: 'Y', ampere: 'Y', ada: 'Y', hopper: 'Y', amd: 'N' },
  {
    impl: 'Marlin (GPTQ/AWQ/FP8/FP4)',
    volta: 'N',
    turing: 'Y*',
    ampere: 'Y',
    ada: 'Y',
    hopper: 'Y',
    amd: 'N',
  },
  { impl: 'INT8 (W8A8)', volta: 'N', turing: 'Y', ampere: 'Y', ada: 'Y', hopper: 'Y', amd: 'N' },
  { impl: 'FP8 (W8A8)', volta: 'N', turing: 'N', ampere: 'N', ada: 'Y', hopper: 'Y', amd: 'Y' },
  {
    impl: 'bitsandbytes (plugin)',
    volta: 'Y',
    turing: 'Y',
    ampere: 'Y',
    ada: 'Y',
    hopper: 'Y',
    amd: 'N',
  },
  { impl: 'GGUF (plugin)', volta: 'Y', turing: 'Y', ampere: 'Y', ada: 'Y', hopper: 'Y', amd: 'Y' },
];

interface OnlineRow {
  name: string;
  layers: string;
  weights: string;
  acts: string;
  watch: ReactNode;
}

const onlineRows: OnlineRow[] = [
  {
    name: 'fp8_per_tensor',
    layers: 'Linear and MoE',
    weights: 'FP8 E4M3, one scale per tensor',
    acts: 'FP8, dynamic per-tensor scale (per-token on Ada and Hopper)',
    watch: (
      <>
        On Turing and Ampere it runs weight-only (W8A16) through FP8 Marlin{' '}
        <Cite tier={1} href={vllmUrl(`${QUANT}/online/fp8.py`, 'L201-L209')}>
          online/fp8.py L201-L209
        </Cite>
        .
      </>
    ),
  },
  {
    name: 'fp8_per_block',
    layers: 'Linear and MoE',
    weights: 'FP8 E4M3, one scale per 128x128 block',
    acts: 'FP8, one scale per 1x128 block',
    watch: 'Finer scales than per-tensor for the same 8 bits.',
  },
  {
    name: 'fp8_per_channel',
    layers: 'Linear and MoE',
    weights: 'FP8 E4M3, one scale per output channel',
    acts: 'FP8, dynamic per-token scale',
    watch: (
      <>
        Needs an FP8 GEMM that honours per-token scales (compute capability 8.9 or newer, or an
        MI3xx GPU on ROCm, AMD&apos;s GPU stack); fails at load where only Marlin applies{' '}
        <Cite tier={1} href={vllmUrl(`${QUANT}/online/fp8.py`, 'L383-L391')}>
          online/fp8.py L383-L391
        </Cite>
        .
      </>
    ),
  },
  {
    name: 'mxfp8',
    layers: 'Linear and MoE',
    weights: 'FP8 E4M3, E8M0 scale per 1x32 block',
    acts: 'Same as weights',
    watch: 'W8A8 needs SM 100 or newer (Blackwell); other GPUs use a W8A16 fallback.',
  },
  {
    name: 'mxfp4',
    layers: 'Linear and MoE',
    weights: 'FP4 E2M1, E8M0 scale per 1x32 block',
    acts: 'MoE: MXFP4. Linear: MXFP4 or BF16, by backend',
    watch: (
      <>
        The linear backend is picked per platform; pin one with <code>--linear-backend</code>.
      </>
    ),
  },
  {
    name: 'int8_per_channel_weight_only',
    layers: 'MoE only',
    weights: 'INT8, one scale per channel',
    acts: '16-bit (weight-only)',
    watch: 'Dense linear layers stay unquantized.',
  },
  {
    name: 'nvfp4_per_token',
    layers: 'MoE only',
    weights: 'NVFP4',
    acts: 'Dynamic per-token scale',
    watch: (
      <>
        Blackwell (SM 100) only; any other GPU fails at load{' '}
        <Cite tier={1} href={vllmUrl(`${QUANT}/online/nvfp4.py`, 'L95-L97')}>
          online/nvfp4.py L95-L97
        </Cite>
        .
      </>
    ),
  },
];

interface UpgradeRow {
  release: ReactNode;
  change: ReactNode;
  symptom: ReactNode;
  fix: ReactNode;
}

const upgradeRows: UpgradeRow[] = [
  {
    release: (
      <Cite tier={1} href={release('v0.24.0')}>
        v0.24.0
      </Cite>
    ),
    change: 'GGUF moved to an out-of-tree plugin (#39612).',
    symptom: 'GGUF models need the plugin installed to load.',
    fix: (
      <>
        <code>uv pip install vllm-gguf-plugin</code>
      </>
    ),
  },
  {
    release: (
      <Cite tier={1} href={release('v0.28.0')}>
        v0.28.0
      </Cite>
    ),
    change: 'bitsandbytes moved to an out-of-tree plugin (#43529).',
    symptom: (
      <>
        Startup stops with <code>Unknown quantization method: bitsandbytes</code>{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/model.py', 'L1418-L1422')}>
          model.py L1418-L1422
        </Cite>
        .
      </>
    ),
    fix: (
      <>
        <code>uv pip install vllm-bnb-plugin</code>
      </>
    ),
  },
  {
    release: (
      <Cite tier={1} href={release('v0.28.0')}>
        v0.28.0
      </Cite>
    ),
    change: (
      <>
        <code>calculate_kv_scales</code>, the warm-up estimate of FP8 KV-cache scales, removed
        (#49389).
      </>
    ),
    symptom: (
      <>
        <code>vllm serve --calculate-kv-scales</code> fails as an unrecognized argument{' '}
        <Cite tier={1} href={vllmUrl('vllm/utils/argparse_utils.py', 'L143-L156')}>
          argparse_utils.py L143-L156
        </Cite>
        .
      </>
    ),
    fix: 'Drop it. Use the default 1.0 scales, or scales calibrated into the checkpoint with llm-compressor.',
  },
  {
    release: (
      <Cite tier={1} href={release('v0.30.0')}>
        v0.30.0
      </Cite>
    ),
    change: 'GPTQ group activation ordering removed (#54809).',
    symptom: (
      <>
        <code>GPTQ group activation ordering (desc_act=True) is no longer supported</code> at load.
      </>
    ),
    fix: (
      <>
        Use a checkpoint with static activation ordering or <code>desc_act=False</code>. With{' '}
        <code>group_size=-1</code> the flag is a no-op and the checkpoint loads.
      </>
    ),
  },
  {
    release: (
      <Cite tier={1} href={release('v0.31.0')}>
        v0.31.0
      </Cite>
    ),
    change: (
      <>
        Online quantization through <code>--quantization fp8</code> replaced by{' '}
        <code>fp8_per_tensor</code> (#53585).
      </>
    ),
    symptom: (
      <>
        A warning, then the run continues as <code>fp8_per_tensor</code>{' '}
        <Cite tier={1} href={vllmUrl(WEIGHT_UTILS, 'L342-L349')}>
          weight_utils.py L342-L349
        </Cite>
        .
      </>
    ),
    fix: (
      <>
        Change the flag to <code>--quantization fp8_per_tensor</code>. FP8 checkpoints that carry
        their own config are unaffected.
      </>
    ),
  },
  {
    release: (
      <Cite tier={1} href={release('v0.31.0')}>
        v0.31.0
      </Cite>
    ),
    change: 'The AllSpark INT8 W8A16 GEMM backend removed (#58001).',
    symptom: (
      <>
        8-bit GPTQ layers take another kernel from the CUDA mixed-precision list, which includes
        Marlin{' '}
        <Cite tier={1} href={vllmUrl(KERNELS_PY, 'L500-L509')}>
          kernels/linear/__init__.py L500-L509
        </Cite>
        .
      </>
    ),
    fix: 'Re-measure throughput for W8A16 models after the upgrade.',
  },
  {
    release: (
      <>
        Deprecated by June 2026{' '}
        <Cite
          tier={1}
          href="https://github.com/vllm-project/vllm/blob/15652a6b703f059767d75e5a511c4a5accf969ad/vllm/model_executor/layers/quantization/__init__.py#L48-L51"
        >
          15652a6b __init__.py L48-L51
        </Cite>{' '}
        and still at v0.31.0{' '}
        <Cite tier={1} href={vllmUrl(QUANT_INIT, 'L52-L55')}>
          __init__.py L52-L55
        </Cite>
      </>
    ),
    change: (
      <>
        <code>fbgemm_fp8</code> and <code>fp_quant</code>.
      </>
    ),
    symptom: (
      <>
        Startup stops with &quot;The quantization method ... is deprecated&quot;{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/model.py', 'L1425-L1438')}>
          model.py L1425-L1438
        </Cite>
        .
      </>
    ),
    fix: (
      <>
        <code>--allow-deprecated-quantization</code> to keep serving while you move to a
        maintained method.
      </>
    ),
  },
];

function DecisionDiagram() {
  const cols = [
    {
      x: 20,
      tone: 'qd-warn',
      gen: 'Volta (SM 7.0)',
      gate: 'no FP8 path',
      leaf: 'GPTQ (weight-only)',
      l1: 'INT4 / INT8 weights;',
      l2: 'or a plugin (below)',
    },
    {
      x: 230,
      tone: 'qd-warn',
      gen: 'Ampere / Turing',
      gate: 'FP8 runs weight-only',
      leaf: 'AWQ / GPTQ W4A16',
      l1: 'on Marlin kernels;',
      l2: 'FP8 runs as W8A16',
    },
    {
      x: 440,
      tone: 'qd-ok',
      gen: 'Ada / Hopper',
      gate: 'FP8 native',
      leaf: 'FP8 W8A8 (E4M3)',
      l1: 'prequantized, or online',
      l2: 'fp8_per_tensor; + FP8 KV',
    },
    {
      x: 650,
      tone: 'qd-new',
      gen: 'Blackwell',
      gate: 'FP4 / MX native',
      leaf: 'NVFP4 / MXFP4 / MXFP8',
      l1: 'prequantized, or online',
      l2: 'mxfp4 / mxfp8',
    },
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 360"
        role="img"
        aria-labelledby="quant-decision-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="quant-decision-title">
          Start from the GPU generation. Volta has no FP8 path, so it runs GPTQ weight-only or a
          plugin format. Ampere and Turing run AWQ or GPTQ 4-bit weights on Marlin and run FP8
          checkpoints weight-only. Ada and Hopper run FP8 W8A8, prequantized or online with
          fp8_per_tensor, plus an FP8 KV cache. Blackwell runs NVFP4, MXFP4 and MXFP8, prequantized
          or online. bitsandbytes and GGUF load through plugins on Volta to Hopper.
        </title>
        <style>{`
          .qd-bg { fill: #ffffff; }
          .qd-root { fill: #f1f3f3; stroke: #5f6b7a; stroke-width: 1.2; }
          .qd-warn { fill: #fbf3e6; stroke: #bd6c1c; stroke-width: 1.2; }
          .qd-ok { fill: #ecf7ec; stroke: #1d8102; stroke-width: 1.2; }
          .qd-new { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.2; }
          .qd-leaf { fill: #ffffff; stroke: #879596; stroke-width: 1.2; }
          .qd-plug { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.2; stroke-dasharray: 5 4; }
          .qd-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .qd-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .qd-p { fill: #16191f; font: 12px sans-serif; text-anchor: middle; }
          .qd-arr { stroke: #5f6b7a; stroke-width: 1.4; fill: none; marker-end: url(#qd-arrow); }
        `}</style>
        <defs>
          <marker
            id="qd-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#5f6b7a" />
          </marker>
        </defs>
        <rect className="qd-bg" x="0" y="0" width="860" height="360" rx="8" />

        <rect className="qd-root" x="330" y="14" width="200" height="46" rx="6" />
        <text className="qd-t" x="430" y="34">
          What silicon?
        </text>
        <text className="qd-s" x="430" y="51">
          (start here)
        </text>

        {cols.map((c, i) => {
          const cx = c.x + 95;
          const sx = 385 + i * 30;
          return (
            <g key={c.gen}>
              <line className="qd-arr" x1={sx} y1={60} x2={cx} y2={100} />
              <rect className={c.tone} x={c.x} y={104} width={190} height={52} rx="6" />
              <text className="qd-t" x={cx} y={126}>
                {c.gen}
              </text>
              <text className="qd-s" x={cx} y={144}>
                {c.gate}
              </text>
              <line className="qd-arr" x1={cx} y1={156} x2={cx} y2={192} />
              <rect className="qd-leaf" x={c.x} y={196} width={190} height={80} rx="6" />
              <text className="qd-t" x={cx} y={220}>
                {c.leaf}
              </text>
              <text className="qd-s" x={cx} y={240}>
                {c.l1}
              </text>
              <text className="qd-s" x={cx} y={258}>
                {c.l2}
              </text>
            </g>
          );
        })}

        <rect className="qd-plug" x="20" y="300" width="820" height="40" rx="6" />
        <text className="qd-p" x="430" y="325">
          Plugins, Volta to Hopper: bitsandbytes (vllm-bnb-plugin) and GGUF (vllm-gguf-plugin)
        </text>
      </svg>
    </div>
  );
}

export function Quantization() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Which formats run on your GPU, the one flag that quantizes a BF16 model at load, and the checkpoints that stop loading when you upgrade (verified against vLLM v0.31.0, commit db9527a4, 2026-10-16)"
          >
            8. Quantization &amp; Precision
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why quantize for serving.</strong> Two scarce resources bound an inference
            deployment: HBM (high-bandwidth memory) capacity and HBM bandwidth. Quantization
            attacks both. Storing weights in 8 or 4 bits instead of 16 shrinks the parameter
            footprint by 2-4x, which either lets a model fit on fewer GPUs or frees HBM that the KV
            (key-value) cache can then use for more concurrent requests. Because decode is
            memory-bandwidth bound (Section 2), moving fewer bytes per parameter per token also
            raises throughput directly. The cost is accuracy: every format trades some numerical
            fidelity for those bytes, and how much depends on the scheme and the model.
          </Box>
          <Box variant="p">
            <strong>Where this section sits.</strong> This is the practitioner&apos;s map of
            vLLM&apos;s quantization <em>support surface</em>: the families it accepts, which run
            on which silicon, and the flags that enable them. How FP8 (8-bit floating point) in
            its E4M3 and E5M2 layouts (4 or 5 exponent bits), NVFP4 (NVIDIA 4-bit floating point),
            and MXFP4 and MXFP8 (the Open Compute Project microscaling formats) are built bit by
            bit, and why block scaling matters in hardware, is covered in
            the{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference
            </Link>{' '}
            deep dive, section 25 (&quot;Quantization and Precision&quot;) and section 13
            (&quot;NVIDIA Blackwell&quot;). How vLLM turns the <code>--quantization</code> flag into
            a concrete kernel (<code>resolve_quant_method()</code>, the chooser functions,{' '}
            <code>--linear-backend</code>) is in section 14, Inside the Codebase, tab &quot;Model
            Layer, Quant &amp; LoRA&quot;.
          </Box>
          <Box variant="small">
            Format, hardware and flag claims below were checked against the v0.31.0 source tree
            and the{' '}
            <Cite tier={1} href={QUANT_DOCS}>
              vLLM v0.31.0 quantization docs
            </Cite>
            . The support matrix moves between releases; re-check it against the docs for the
            release you run before relying on a specific cell.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Whether a format buys you a compute speedup or only a memory saving, decided by two questions"
          >
            The two questions every format answers
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every quantization format in vLLM can be located by answering two questions.{' '}
            <strong>How many bits per weight?</strong> 8, 4, or (on Blackwell) 4-bit float. And{' '}
            <strong>are the activations quantized too?</strong> This is the difference between
            &quot;weight-only&quot; and &quot;W8A8&quot; (8-bit weights, 8-bit activations). That
            second axis is the one practitioners most often miss, and it determines whether you get
            a compute speedup or only a memory saving.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Weight-only (W4A16, W8A16)</Box>
              <Box variant="p">
                Only the weights are stored in low precision; activations stay in FP16 or BF16
                (bfloat16). The kernel <em>dequantizes</em> weights back to 16-bit inside the GEMM
                (general matrix multiply). You save HBM and bandwidth on the weights, and the
                matmul runs at 16-bit math. AWQ (activation-aware weight quantization), GPTQ (a
                per-group post-training method) and the two plugin formats, bitsandbytes and GGUF
                (the llama.cpp checkpoint format), all live here. Best fit: bandwidth-bound decode where the
                weight bytes dominate, and older silicon without 8-bit tensor cores.
              </Box>
            </div>
            <div>
              <Box variant="h3">W8A8 (and lower)</Box>
              <Box variant="p">
                Both weights <em>and</em> activations are quantized, so the matmul itself executes
                in INT8 (8-bit integer) or FP8 on dedicated tensor cores. This is a compute speedup
                on top of the memory saving. It requires hardware with those low-precision tensor
                cores
                (Ada/Hopper for FP8) and is more sensitive to activation outliers, which is why
                W8A8 checkpoints lean on per-token dynamic activation scales or SmoothQuant-style
                calibration.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            <strong>KV-cache quantization is a separate lever.</strong> A quantized KV cache shrinks
            the per-request KV footprint rather than the weights, so it composes with any of the
            formats above. You can run BF16 weights with an FP8 KV cache, or FP8 weights with a
            BF16 KV cache: the <code>quantization</code> and <code>cache_dtype</code> settings are
            independent{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L123-L126')}>
              cache.py L123-L126
            </Cite>
            . See Section 5: Paged KV Cache &amp; Block Tables for why KV footprint is the binding
            constraint on batch size.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What each format stores, what it buys you, and whether vLLM loads it in tree or through a plugin"
          >
            The format catalogue
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={formatRows}
            columnDefinitions={[
              { id: 'format', header: 'Format', cell: (r) => r.format, minWidth: 150 },
              { id: 'bits', header: 'Bits', cell: (r) => r.bits, minWidth: 170 },
              { id: 'family', header: 'Family', cell: (r) => r.family, minWidth: 130 },
              { id: 'notes', header: 'Notes', cell: (r) => r.notes, minWidth: 320 },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            Families and bit-widths from the{' '}
            <Cite tier={1} href={QUANT_DOCS}>
              vLLM docs: Quantization
            </Cite>
            ,{' '}
            <Cite tier={1} href={FP8_DOCS}>
              vLLM docs: FP8 W8A8
            </Cite>{' '}
            and{' '}
            <Cite tier={1} href={KV_DOCS}>
              vLLM docs: Quantized KV cache
            </Cite>
            . The in-tree method list (<code>QuantizationMethods</code>) has no bitsandbytes or
            GGUF entry; the two plugins add them at install time{' '}
            <Cite tier={1} href={vllmUrl(QUANT_INIT, 'L15-L49')}>
              __init__.py L15-L49
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The cell that decides your options: which formats run on which NVIDIA generation and on AMD"
          >
            Hardware-support matrix
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The single most important fact about quantization is that{' '}
            <strong>support is gated by silicon generation</strong>. FP8 compute needs compute
            capability 8.9 or newer (Ada Lovelace, Hopper, Blackwell){' '}
            <Cite tier={1} href={FP8_DOCS}>
              vLLM docs: FP8 W8A8
            </Cite>
            . On Ampere and Turing an FP8 checkpoint runs weight-only through Marlin. Volta
            (compute capability 7.0, written SM 7.0 in the docs) has no FP8 path at all: the FP8
            and online configs require compute capability 7.5, and vLLM stops at startup with
            &quot;Minimum capability: 75&quot;{' '}
            <Cite tier={1} href={vllmUrl(`${QUANT}/fp8.py`, 'L145-L147')}>
              fp8.py L145-L147
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(`${QUANT}/online/base.py`, 'L197-L200')}>
              online/base.py L197-L200
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L925-L931')}>
              vllm.py L925-L931
            </Cite>
            . On Volta, reach for GPTQ or a plugin format instead. The table below reproduces
            vLLM&apos;s compatibility matrix.
          </Box>
          <Table
            items={hwRows}
            columnDefinitions={[
              { id: 'impl', header: 'Implementation', cell: (r) => r.impl, minWidth: 150 },
              { id: 'volta', header: 'Volta', cell: (r) => r.volta },
              { id: 'turing', header: 'Turing', cell: (r) => r.turing },
              { id: 'ampere', header: 'Ampere', cell: (r) => r.ampere },
              { id: 'ada', header: 'Ada', cell: (r) => r.ada },
              { id: 'hopper', header: 'Hopper', cell: (r) => r.hopper },
              { id: 'amd', header: 'AMD GPU', cell: (r) => r.amd },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            Y = supported, N = not supported, Y* = caveat. Cells from the supported-hardware table
            in the{' '}
            <Cite tier={1} href={QUANT_DOCS}>
              vLLM docs: Quantization
            </Cite>
            , where Volta is SM 7.0, Turing SM 7.5, Ampere SM 8.0/8.6, Ada SM 8.9 and Hopper SM
            9.0. The published table also has Intel GPU and CPU columns (omitted here for width).
            Turing carries a caveat: it does not support Marlin MXFP4. On AMD GPUs the matrix marks
            FP8 W8A8 and GGUF (a plugin) as supported. The docs table lists bitsandbytes and GGUF
            without noting the plugins, and lists a DeepSpeedFP row that has no code in the
            v0.31.0 tree and no entry in the accepted method names, so that row is left out here{' '}
            <Cite tier={1} href={vllmUrl(QUANT_INIT, 'L15-L49')} kind="doc-code-conflict">
              __init__.py L15-L49
            </Cite>
            . The grid has no Blackwell column. Blackwell runs the low-bit float formats (NVFP4,
            MXFP4, MXFP8), documented on their own method pages, and FP8 W8A8; INT8 W8A8 does not
            run on compute capability 10.0 or newer{' '}
            <Cite tier={1} href={vllmDocsUrl('features/quantization/llm_compressor/int8_w8a8/')}>
              vLLM docs: INT8 W8A8
            </Cite>
            . Confirm each format against its method page before planning on Blackwell.
          </Box>
          <Alert type="warning">
            <strong>Read the caveats along with the checkmarks.</strong> A green cell means vLLM
            has a kernel path for this format on this generation; speed depends on whether the
            silicon has tensor cores for it. On Ampere and Turing, FP8 checkpoints fall back to
            weight-only W8A16 through Marlin, with no FP8 compute speedup{' '}
            <Cite tier={1} href={FP8_DOCS}>
              vLLM docs: FP8 W8A8
            </Cite>
            . Match the format to silicon that has native tensor-core support for it.
          </Alert>
          <ExpandableSection headerText="Why one checkpoint runs on different kernels on different GPUs">
            <Box variant="p">
              A single checkpoint format maps to several kernels. For block-scaled FP8 the CUDA
              priority list runs FlashInfer DeepGEMM, DeepGEMM, CUTLASS, B12x, Marlin, Humming,
              Triton and a torch fallback{' '}
              <Cite tier={1} href={vllmUrl(KERNELS_PY, 'L455-L467')}>
                kernels/linear/__init__.py L455-L467
              </Cite>
              , and vLLM takes the first entry the device supports. DeepGEMM reports support only
              on Hopper and Blackwell{' '}
              <Cite
                tier={1}
                href={vllmUrl('vllm/model_executor/kernels/linear/scaled_mm/deep_gemm.py', 'L47-L52')}
              >
                deep_gemm.py L47-L52
              </Cite>
              , so an older GPU walks past it to a later entry such as Marlin or Triton, with no
              change to model or config. The chooser rule, <code>resolve_quant_method()</code>,
              and the{' '}
              <code>--linear-backend</code> override that forces a kernel family are walked in
              section 14, Inside the Codebase, tab &quot;Model Layer, Quant &amp; LoRA&quot;.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Serve a prequantized checkpoint with no flag, or quantize a BF16 model at load with one"
          >
            How to enable it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            vLLM learns what quantization to apply in one of two ways, and they cover the two
            common situations.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Checkpoint-embedded config (the common case)</Box>
              <Box variant="p">
                Prequantized checkpoints from the Hub carry a quantization config in their metadata
                (a <code>quantization_config</code> block in <code>config.json</code>). vLLM reads
                it automatically, so you point at the model and serve{' '}
                <Cite tier={1} href={vllmUrl(WEIGHT_UTILS, 'L223-L231')}>
                  weight_utils.py L223-L231
                </Cite>
                . This is the path for any AWQ, GPTQ, FP8 or NVFP4 checkpoint someone has already
                produced. No flag needed; the config in the checkpoint is the source of truth.
              </Box>
            </div>
            <div>
              <Box variant="h3">
                Online quantization with <code>--quantization</code>
              </Box>
              <Box variant="p">
                <code>--quantization fp8_per_tensor</code> (engine arg{' '}
                <code>quantization=&quot;fp8_per_tensor&quot;</code>) quantizes a BF16 or FP16
                checkpoint to FP8 at load time, with no calibration data{' '}
                <Cite tier={1} href={ONLINE_DOCS}>
                  vLLM docs: Online quantization
                </Cite>
                . It is the zero-friction way to get FP8 from a BF16 model, with limited latency
                improvement in this mode{' '}
                <Cite tier={1} href={FP8_DOCS}>
                  vLLM docs: FP8 W8A8
                </Cite>
                . <code>--quantization fp8</code> on an unquantized checkpoint runs as{' '}
                <code>fp8_per_tensor</code> after a deprecation warning.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>The online schemes.</strong> Each shorthand below expands to a preset scheme
            for linear layers, MoE expert layers, or both{' '}
            <Cite tier={1} href={vllmUrl(QUANT_CFG, 'L187-L219')}>
              quantization.py L187-L219
            </Cite>
            . For finer control, <code>--quantization-config</code> sets separate{' '}
            <code>linear</code> and <code>moe</code> schemes or an <code>ignore</code> list on top
            of a shorthand, and <code>--quantization online</code> with a <code>targets</code> map
            assigns a shorthand per layer name or pattern{' '}
            <Cite tier={1} href={vllmUrl(QUANT_CFG, 'L110-L126')}>
              quantization.py L110-L126
            </Cite>
            .
          </Box>
          <Table
            items={onlineRows}
            columnDefinitions={[
              {
                id: 'name',
                header: '--quantization',
                cell: (r) => <code>{r.name}</code>,
                minWidth: 150,
              },
              { id: 'layers', header: 'Layers', cell: (r) => r.layers, minWidth: 100 },
              { id: 'weights', header: 'Weights', cell: (r) => r.weights, minWidth: 170 },
              { id: 'acts', header: 'Activations', cell: (r) => r.acts, minWidth: 170 },
              { id: 'watch', header: 'Watch for', cell: (r) => r.watch, minWidth: 220 },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            Recipes and hardware notes from the{' '}
            <Cite tier={1} href={ONLINE_DOCS}>
              vLLM docs: Online quantization
            </Cite>{' '}
            and the shorthand table in{' '}
            <Cite tier={1} href={vllmUrl(QUANT_CFG, 'L187-L219')}>
              quantization.py L187-L219
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Online on top of a prequantized checkpoint.</strong> An online scheme can also
            fill in the layers a prequantized checkpoint left unquantized; the checkpoint&apos;s
            own method keeps the layers it quantized. For example,{' '}
            <code>--quantization-config.linear mxfp8</code> on a checkpoint that quantized only its
            MoE experts adds MXFP8 to the dense linear layers{' '}
            <Cite tier={1} href={vllmUrl(WEIGHT_UTILS, 'L211-L221')}>
              weight_utils.py L211-L221
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>KV cache is enabled separately.</strong> <code>--kv-cache-dtype fp8</code>{' '}
            (engine arg <code>kv_cache_dtype=&quot;fp8&quot;</code>) stores KV entries in FP8.{' '}
            <code>auto</code>, the default, keeps the model&apos;s dtype, with one exception the
            docs leave out: a ModelOpt checkpoint that declares a KV cache scheme gets that scheme,
            for example FP8{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/utils/torch_utils.py', 'L448-L521')}
              kind="doc-code-conflict"
            >
              torch_utils.py L448-L521
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/engine/arg_utils.py', 'L2199-L2212')} kind="code">
              arg_utils.py L2199-L2212
            </Cite>
            . Scales are either 1.0 (no
            calibration) or calibrated offline with llm-compressor, which the docs recommend for
            accuracy.{' '}
            <code>--kv-cache-dtype-skip-layers</code> keeps chosen layers, by index or by type such
            as <code>sliding_window</code>, at the native dtype{' '}
            <Cite tier={1} href={KV_DOCS}>
              vLLM docs: Quantized KV cache
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L167-L169')}>
              cache.py L167-L169
            </Cite>
            .
          </Box>
          <Alert type="info">
            <strong>Online vs prequantized, in one line.</strong> Online quantization needs no
            separate artifact: weight scales come from the weights alone (per tensor, per channel
            or per block) and activation scales are computed at runtime, with no calibration data.
            A prequantized checkpoint carries scales chosen offline, against a calibration dataset
            when the recipe uses one (AWQ, GPTQ, static activation scales); llm-compressor&apos;s
            FP8_DYNAMIC recipe needs none{' '}
            <Cite tier={1} href={FP8_DOCS}>
              vLLM docs: FP8 W8A8
            </Cite>
            . For production, prefer a calibrated prequantized checkpoint; for a quick
            fit-it-on-the-GPU experiment, online is fine.
          </Alert>
          <ExpandableSection headerText="Prequantized vs online: what differs in the checkpoint">
            <SpaceBetween size="s">
              <Box variant="p">
                A prequantized checkpoint ships the low-precision weights <em>plus</em> the scale
                tensors computed offline. Calibrated recipes in llm-compressor and AutoAWQ run a
                pass over a small dataset to choose per-channel or per-group scales that minimise
                the quantization error where it matters most. vLLM loads those weights and scales
                directly. No weight quantization happens at serve time.
              </Box>
              <Box variant="p">
                Online quantization (<code>--quantization fp8_per_tensor</code> on a BF16 model)
                converts the weights during loading and scales activations dynamically on each
                forward pass, with no calibration data{' '}
                <Cite tier={1} href={ONLINE_DOCS}>
                  vLLM docs: Online quantization
                </Cite>
                . Per-tensor FP8 gives each weight tensor one scale; the per-block and per-channel
                shorthands give finer ones. The mental model: online buys you the memory shrink
                immediately; a calibrated prequantized checkpoint buys the same shrink with scales
                tuned against data, at the cost of producing the artifact.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <ExpandableSection headerText="How bitsandbytes and GGUF plug in, and how to add your own method">
            <Box variant="p">
              A quantization method outside the tree is a <code>QuantizationConfig</code> subclass
              registered under a name with <code>@register_quantization_config</code>, which adds
              the name to the accepted method list{' '}
              <Cite tier={1} href={vllmUrl(QUANT_INIT, 'L61-L109')}>
                __init__.py L61-L109
              </Cite>{' '}
              <Cite tier={1} href={vllmDocsUrl('features/quantization/')}>
                vLLM docs: Out-of-tree quantization plugins
              </Cite>
              . bitsandbytes and GGUF ship exactly this way: each plugin package declares a{' '}
              <code>vllm.general_plugins</code> entry point whose <code>register()</code> call
              registers the method and its model loader{' '}
              <Cite tier={1} href={`${BNB_PLUGIN}/vllm_bnb_plugin/__init__.py#L59-L68`}>
                vllm-bnb-plugin v0.0.3 __init__.py L59-L68
              </Cite>{' '}
              <Cite tier={1} href={`${GGUF_PLUGIN}/vllm_gguf_plugin/plugin.py#L109-L117`}>
                vllm-gguf-plugin v0.0.5 plugin.py L109-L117
              </Cite>
              . Installing the package is the whole setup; nothing changes on the command line.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Six quantization changes between v0.24 and v0.31, and one older deprecation, that stop a working deployment or change its flags, with the fix for each"
          >
            Upgrading a quantized deployment
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Check the checkpoints and launch flags you serve against this table before moving to
            v0.31.0. Five of the seven rows stop startup or loading outright; the other two change
            a flag or a kernel.
          </Box>
          <Table
            items={upgradeRows}
            columnDefinitions={[
              { id: 'release', header: 'Release', cell: (r) => r.release, minWidth: 130 },
              { id: 'change', header: 'Change', cell: (r) => r.change, minWidth: 200 },
              { id: 'symptom', header: 'What you see', cell: (r) => r.symptom, minWidth: 220 },
              { id: 'fix', header: 'What to do', cell: (r) => r.fix, minWidth: 200 },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            Release rows from the GitHub release notes for each version (pull request numbers in
            parentheses); the deprecation row from the source tree at both commits.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The path for your GPU, the accuracy you can give up, and the one command to try before you commit to a checkpoint"
          >
            Choosing a format
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Work backward from the constraint. The decision is rarely &quot;which format is
            best&quot; in the abstract. It is &quot;what does my silicon support, and how much
            accuracy can this workload give up?&quot;
          </Box>
          <DecisionDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic, not measured. Branches follow the hardware matrix above; the online
            shorthands are the ones in the online schemes table.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Start with hardware</Box>
              <Box variant="p">
                The matrix prunes the option set before accuracy enters. Ada or Hopper: FP8 W8A8 is
                the default high-throughput path. Ampere or Turing: INT4/INT8 weight-only (AWQ or
                GPTQ on Marlin). Volta: GPTQ or a plugin format, with no FP8. Blackwell: NVFP4,
                MXFP4 and MXFP8 run natively, prequantized or online.
              </Box>
            </div>
            <div>
              <Box variant="h3">Then accuracy budget</Box>
              <Box variant="p">
                8-bit (FP8/INT8) is the conservative choice. vLLM&apos;s FP8 docs claim a 2x
                reduction in model memory and up to a 1.6x throughput improvement with minimal
                accuracy impact, a project figure whose multiplier depends on model and
                workload{' '}
                <Cite tier={1} href={FP8_DOCS}>
                  vLLM docs: FP8 W8A8 (project claim)
                </Cite>
                . 4-bit weight-only saves the most memory but costs more accuracy and benefits most
                from calibration (AWQ&apos;s activation-aware weighting, GPTQ&apos;s per-group
                scales).
              </Box>
            </div>
            <div>
              <Box variant="h3">Then throughput shape</Box>
              <Box variant="p">
                Weight-only formats help most when weight bytes dominate (small batch,
                bandwidth-bound decode). W8A8 adds a compute speedup that shows up at larger
                batches. Layer an FP8 KV cache on top when KV footprint, rather than weights, is
                what caps your batch size.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>Try it before you commit.</strong> Serve the BF16 checkpoint with the online
            shorthand for your GPU (<code>--quantization fp8_per_tensor</code> on Ada or Hopper,{' '}
            <code>mxfp8</code> or <code>mxfp4</code> on Blackwell) and run your own eval against
            the BF16 baseline; model-card numbers come from someone else&apos;s workload. If
            accuracy holds, move production to a calibrated prequantized checkpoint of the same
            format and load-test it on your own traffic: the 1.6x is the ceiling the project
            claims, and your load test tells you how much of it you get.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
