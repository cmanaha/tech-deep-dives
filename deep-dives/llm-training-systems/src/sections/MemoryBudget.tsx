import { useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import FormField from '@cloudscape-design/components/form-field';
import Select from '@cloudscape-design/components/select';
import type { SelectProps } from '@cloudscape-design/components/select';
import Input from '@cloudscape-design/components/input';
import Toggle from '@cloudscape-design/components/toggle';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Link from '@cloudscape-design/components/link';
import {
  Cite,
  arxiv,
  gh,
  E1_URL,
  E2_URL,
  GUIDE_URL,
  LLAMA_MODELS_TAG,
  MEGATRON_TAG,
  NEURON_SDK_SHA,
  PYTORCH_TAG,
  TORCHTITAN_TAG,
  TRANSFORMER_ENGINE_TAG,
} from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import {
  DENSE_MODELS,
  GB,
  INSTANCES,
  rankFacts,
  shapeOf,
  type DenseModelId,
  type InstanceId,
  type MemoryFigure,
  type OptimizerRowId,
} from '../lib/presets';
import {
  memoryBudget,
  modelStateBytes,
  optimizerComponents,
  type GradientDtype,
  type LogitsMode,
  type MemoryInput,
  type MemoryResult,
  type RecomputeMode,
  type ZeroStage,
} from '../lib/memory';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Register rows cited without re-opening the source keep the register's date. */
const REGISTER_DATE = '2026-10-30';

/** Rajbhandari et al., ZeRO: Sec 1 (stages), 3.1 (16 bytes), 3.2 (residual memory), 5 (stage formulas). */
const ZERO = arxiv('1910.02054v3');
/** Korthikanti et al., Reducing Activation Recomputation: Sec 4.1, 4.2.3, 4.3, 5 (Table 2), 6.2. */
const KORTHIKANTI = arxiv('2205.05198v1');
/** Dao et al., FlashAttention, Sec 3.1. */
const FLASH = arxiv('2205.14135v2');
/** DeepSeek-V3 Technical Report, Sec 3.3.3 (low-precision optimizer states). */
const DEEPSEEK_V3 = arxiv('2412.19437v2');
/** Dettmers et al., 8-bit Optimizers via Block-wise Quantization (ICLR 2022). */
const ADAM_8BIT = arxiv('2110.02861v2');
/** Liu et al., Muon is Scalable for LLM Training, Sec 2.2 (AdamW for non-matrix parameters) and 2.3 (one buffer). */
const MUON = arxiv('2502.16982v1');
/** Shazeer and Stern, Adafactor, Abstract. */
const ADAFACTOR = arxiv('1804.04235v1');
/** Chen et al., Training Deep Nets with Sublinear Memory Cost, Sec 5.4. */
const CHEN = arxiv('1604.06174v2');
/** Narayanan et al., Megatron-LM PTD-P (SC 2021), Sec 5.6. */
const PTDP = arxiv('2104.04473v5');
/** The Llama 3 Herd of Models, Table 3 (shapes) and Sec 3.3.2 (pipeline memory imbalance). */
const LLAMA3 = arxiv('2407.21783v3');

const H100_SPEC = 'https://www.nvidia.com/en-us/data-center/h100/';
const H200_SPEC = 'https://www.nvidia.com/en-us/data-center/h200/';
const EC2_AC = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';
const TRN2_SPEC =
  'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html';
const TRN2_ARCH = 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trn2-arch.html';
const TT_NEURON = gh('aws-neuron/aws-neuron-sdk', NEURON_SDK_SHA, 'training/torchtitan/about-torchtitan-neuron.rst');
const HF_8B =
  'https://huggingface.co/api/models/meta-llama/Llama-3.1-8B/revision/d04e592bb4f6aa9cfee91e2e20afa771667e1d4b';
const HF_70B =
  'https://huggingface.co/api/models/meta-llama/Llama-3.1-70B/revision/349b2ddb53ce8f2849a6c168a81980ab25258dac';
const LLAMA_TOKENIZER = gh('meta-llama/llama-models', LLAMA_MODELS_TAG, 'models/llama3/tokenizer.py', 'L53-L103');
const LLAMA_UPCAST = gh('meta-llama/llama-models', LLAMA_MODELS_TAG, 'models/llama3/model.py', 'L308');

const MG_DIST_OPT = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'docs/user-guide/features/dist_optimizer.md', 'L14-L20');
const MG_FP32_GRADS = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/training/arguments.py', 'L1121-L1134');
const MG_PRECISION_CONFIG = gh(
  'NVIDIA/Megatron-LM',
  MEGATRON_TAG,
  'megatron/core/optimizer/optimizer_config.py',
  'L188-L207',
);
const MG_PRECISION_FLAGS = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/training/arguments.py', 'L3606-L3624');
const MG_CE_UPCAST = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/tensor_parallel/cross_entropy.py', 'L25');
const MG_CE_DEFAULT = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/model_parallel_config.py', 'L355-L363');
const MG_CE_TE_MIN = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/training/arguments.py', 'L1659-L1666');
const MG_CP = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'docs/user-guide/features/context_parallel.md', 'L19');

const TE_CE_SAVE = gh(
  'NVIDIA/TransformerEngine',
  TRANSFORMER_ENGINE_TAG,
  'transformer_engine/pytorch/triton/cross_entropy.py',
  'L45-L51',
);
const TE_CE_DTYPE = gh(
  'NVIDIA/TransformerEngine',
  TRANSFORMER_ENGINE_TAG,
  'transformer_engine/pytorch/cross_entropy.py',
  'L115-L116',
);

const TT_ACTIVATION = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/models/common/activation.py', 'L166-L177');
const TT_BENCH = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'docs/benchmarks/llama3_h100_202412_torchtitan.md', 'L10-L53');

const PT_MUON = gh('pytorch/pytorch', PYTORCH_TAG, 'torch/optim/_muon.py', 'L160-L163');
const PT_ADAFACTOR = gh('pytorch/pytorch', PYTORCH_TAG, 'torch/optim/_adafactor.py', 'L101-L114');
const PT_ALLOCATOR = gh('pytorch/pytorch', PYTORCH_TAG, 'docs/source/notes/cuda.md', 'L534-L542');
const PT_ALLOC_CONF = gh('pytorch/pytorch', PYTORCH_TAG, 'docs/source/notes/cuda.md', 'L557-L566');
const PT_EXPANDABLE = gh('pytorch/pytorch', PYTORCH_TAG, 'docs/source/notes/cuda.md', 'L630-L662');
const PT_MEMORY_API = gh('pytorch/pytorch', PYTORCH_TAG, 'torch/cuda/memory.py', 'L543-L606');

const BNB_STATE = gh('bitsandbytes-foundation/bitsandbytes', '0.50.2', 'bitsandbytes/optim/optimizer.py', 'L491-L530');

/** Conditions every E1 and E2 figure carries. */
const E1_TITLE = 'E1: activation memory per Llama 3.1 8B layer on one GB10, PyTorch 2.15.0, one run';
const E2_TITLE = 'E2: step time and recomputation on one GB10, PyTorch 2.15.0, two runs';

/* ------------------------------------------------------------------------ */
/* Shared formatting                                                        */
/* ------------------------------------------------------------------------ */

function fmtGB(bytes: number): string {
  const gb = bytes / GB;
  const digits = Math.abs(gb) < 1 ? 2 : 1;
  return `${gb.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })} GB`;
}

const cell: CSSProperties = {
  padding: '6px 8px',
  borderBottom: '1px solid #e9ebed',
  textAlign: 'left',
  verticalAlign: 'top',
};
const headCell: CSSProperties = { ...cell, fontWeight: 700, borderBottom: '2px solid #d1d5db' };
const numCell: CSSProperties = { ...cell, textAlign: 'right', whiteSpace: 'nowrap' };

/* ------------------------------------------------------------------------ */
/* Worked configurations (01 W5), computed by Calculator B                  */
/* ------------------------------------------------------------------------ */

const M8 = shapeOf(DENSE_MODELS['llama-3.1-8b']);
const M70 = shapeOf(DENSE_MODELS['llama-3.1-70b']);
const P5_HBM = rankFacts(INSTANCES['p5.48xlarge']).hbmPerRank;

/** Llama 3.1 8B at s = 8,192, b = 1, mixed-precision Adam, FP32 logits, on an H100: the 01 W4 baseline. */
function onH100(overrides: Partial<MemoryInput>): MemoryInput {
  return {
    model: M8,
    optimizer: { row: 'adamMixed', gradientDtype: 'bf16' },
    zero: { stage: 0, degree: 1 },
    recompute: 'none',
    activations: { swiglu: 'fused' },
    microBatch: 1,
    sequenceLength: 8_192,
    logits: 'fp32Upcast',
    hbmPerRank: P5_HBM,
    ...overrides,
  };
}

interface WorkedConfig {
  id: string;
  wide: string;
  narrow: string;
  input: MemoryInput;
}

const WORKED: WorkedConfig[] = [
  { id: '8b-one', wide: '8B on one GPU, unsharded', narrow: '8B, one GPU, unsharded', input: onH100({}) },
  {
    id: '8b-fsdp8',
    wide: '8B, FSDP 8 on one p5.48xlarge',
    narrow: '8B, FSDP 8',
    input: onH100({ zero: { stage: 3, degree: 8 } }),
  },
  {
    id: '8b-b2',
    wide: '8B, FSDP 8, micro-batch 2',
    narrow: '8B, FSDP 8, b = 2',
    input: onH100({ zero: { stage: 3, degree: 8 }, microBatch: 2 }),
  },
  {
    id: '8b-b2-full',
    wide: '8B, FSDP 8, b = 2, full recompute',
    narrow: '8B, FSDP 8, b = 2, full recompute',
    input: onH100({ zero: { stage: 3, degree: 8 }, microBatch: 2, recompute: 'full' }),
  },
  {
    id: '70b-tp8',
    wide: '70B, TP 8 + SP, ZeRO-1 over DP 32',
    narrow: '70B, TP 8 + SP, ZeRO-1, DP 32',
    input: onH100({ model: M70, zero: { stage: 1, degree: 32 }, tensorParallel: { degree: 8, sequenceParallel: true } }),
  },
  {
    id: '70b-fsdp256',
    wide: '70B, FSDP 256, no recompute',
    narrow: '70B, FSDP 256, no recompute',
    input: onH100({ model: M70, zero: { stage: 3, degree: 256 } }),
  },
  {
    id: '70b-fsdp256-full',
    wide: '70B, FSDP 256, full recompute',
    narrow: '70B, FSDP 256, full recompute',
    input: onH100({ model: M70, zero: { stage: 3, degree: 256 }, recompute: 'full' }),
  },
];

interface WorkedRow extends WorkedConfig {
  state: number;
  activations: number;
  logits: number;
  total: number;
}

function peakParts(r: MemoryResult): { activations: number; logits: number } {
  const stage = r.peakStage === 'first' ? r.firstStage : r.lastStage;
  return { activations: stage.activationBytes, logits: stage.logitBytes };
}

const WORKED_ROWS: WorkedRow[] = WORKED.map((c) => {
  const r = memoryBudget(c.input);
  const parts = peakParts(r);
  return { ...c, state: r.modelState.totalBytes, ...parts, total: r.totalBytes };
});

function worked(id: string): WorkedRow {
  const row = WORKED_ROWS.find((w) => w.id === id);
  if (!row) throw new Error(`MemoryBudget: no worked configuration with id ${id}`);
  return row;
}

/** The same 70B layout with Megatron's FP32 main gradients (the 18-byte row). */
const W70_FP32_GRADS = memoryBudget({
  ...worked('70b-tp8').input,
  optimizer: { row: 'adamMixed', gradientDtype: 'fp32' },
});
/** 8B FSDP 8 with TorchTitan v0.4.0's eager SwiGLU (41 sbh). */
const W8_EAGER = memoryBudget(onH100({ zero: { stage: 3, degree: 8 }, activations: { swiglu: 'eager' } }));
/** 8B activations for one sequence across 32 layers, fused and eager. */
const ACT8_FUSED = memoryBudget(onH100({}));
const ACT8_EAGER = memoryBudget(onH100({ activations: { swiglu: 'eager' } }));
const ACT8_BF16_LOGITS = memoryBudget(onH100({ logits: 'bf16Fused' }));
/** TorchTitan's published 70B layout, computed in BF16 at 8,192 tokens (02 section 3.2, W1-23). */
const TT70 = memoryBudget(
  onH100({
    model: M70,
    zero: { stage: 3, degree: 32 },
    tensorParallel: { degree: 8, sequenceParallel: true },
    microBatch: 16,
    recompute: 'full',
  }),
);

/* ------------------------------------------------------------------------ */
/* Diagram: per-GPU memory for the worked configurations                    */
/* ------------------------------------------------------------------------ */

const BAR_MAX_GB = 200;
const BAR_COLORS = { state: '#0972d3', activations: '#6f4cc4', logits: '#ec7211' };
const REF_LINES = [
  { gb: 60, wide: '60 GB: 75% target', narrow: '60 target', color: '#5f6b7a', dash: '5 4', anchor: 'end' as const },
  { gb: 80, wide: '80 GB: one H100', narrow: '80 H100', color: '#16191f', dash: undefined, anchor: 'start' as const },
  { gb: 141, wide: '141 GB: one H200', narrow: '141 H200', color: '#037f0c', dash: undefined, anchor: 'start' as const },
];

function verdict(totalBytes: number): string {
  const gb = totalBytes / GB;
  if (gb <= 60) return 'under the 60 GB target';
  if (gb <= 80) return 'above the target, inside 80 GB';
  if (gb <= 141) return 'over 80 GB, inside 141 GB';
  return 'over 141 GB';
}

function MemoryBarsDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref);
  const font = 'sans-serif';
  const ink = '#16191f';
  const muted = '#414d5c';

  const W = narrow ? 400 : 900;
  const x0 = narrow ? 12 : 330;
  const x1 = narrow ? 388 : 884;
  const scale = (x1 - x0) / BAR_MAX_GB;
  const x = (gb: number) => x0 + gb * scale;
  const lineLabelY = narrow ? 80 : 90;
  const plotTop = narrow ? 88 : 100;
  const rowH = 46;
  const plotBottom = plotTop + WORKED_ROWS.length * rowH;
  const H = plotBottom + 30;
  const barY = (i: number) => plotTop + i * rowH + (narrow ? 20 : 10);
  const barH = narrow ? 16 : 24;
  const legend = [
    { label: 'Model state', color: BAR_COLORS.state },
    { label: 'Activations', color: BAR_COLORS.activations },
    { label: 'Logits', color: BAR_COLORS.logits },
  ];
  const ticks = [0, 50, 100, 150, 200];

  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="memory-bars-title"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <title id="memory-bars-title">
          Memory per GPU at the peak of a step for seven layouts at 8,192 tokens, split into model
          state, activations and logits, against a 60 GB headroom target, the 80 GB of one H100 and
          the 141 GB of one H200. Llama 3.1 8B on one GPU needs 171.3 GB; FSDP over eight GPUs brings
          it to 58.9 GB; micro-batch 2 raises that to 101.7 GB and full recomputation brings it back
          to 35.2 GB. Llama 3.1 70B with tensor and sequence parallelism over eight GPUs and ZeRO-1
          over 32 needs 61.9 GB; FSDP over 256 GPUs needs 190.6 GB without recomputation and 23.7 GB
          with it.
        </title>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />

        <text x={narrow ? 12 : 16} y={narrow ? 20 : 24} fontFamily={font} fontSize={narrow ? 12 : 13} fontWeight={600} fill={ink}>
          {narrow ? 'Memory per GPU at the peak of a step' : 'Memory per GPU at the peak of a step, 8,192-token sequences'}
        </text>
        <text x={narrow ? 12 : 16} y={narrow ? 36 : 42} fontFamily={font} fontSize={narrow ? 10 : 11} fill={muted}>
          {narrow
            ? 's = 8,192; Adam, BF16 gradients; FP32 logits'
            : 'Mixed-precision Adam with BF16 gradients, fused SwiGLU, FlashAttention-style kernel, FP32 logits with their BF16 source'}
        </text>
        {legend.map((item, i) => {
          const lx = (narrow ? 12 : 16) + i * (narrow ? 100 : 130);
          const ly = narrow ? 48 : 54;
          return (
            <g key={item.label}>
              <rect x={lx} y={ly} width={narrow ? 10 : 12} height={narrow ? 10 : 12} fill={item.color} />
              <text x={lx + (narrow ? 14 : 17)} y={ly + (narrow ? 9 : 10)} fontFamily={font} fontSize={narrow ? 10 : 11} fill={ink}>
                {item.label}
              </text>
            </g>
          );
        })}

        {REF_LINES.map((l) => (
          <text
            key={`label-${l.gb}`}
            x={l.anchor === 'end' ? x(l.gb) - 4 : x(l.gb) + 4}
            y={lineLabelY}
            fontFamily={font}
            fontSize={narrow ? 10 : 11}
            fontWeight={600}
            fill={l.color}
            textAnchor={l.anchor}
          >
            {narrow ? l.narrow : l.wide}
          </text>
        ))}

        {WORKED_ROWS.map((row, i) => {
          const y = barY(i);
          const segs = [
            { w: row.state, color: BAR_COLORS.state },
            { w: row.activations, color: BAR_COLORS.activations },
            { w: row.logits, color: BAR_COLORS.logits },
          ];
          let cursor = 0;
          return (
            <g key={row.id}>
              {narrow ? (
                <text x={x0} y={plotTop + i * rowH + 13} fontFamily={font} fontSize={11} fontWeight={600} fill={ink}>
                  {`${row.narrow}: ${fmtGB(row.total)}`}
                </text>
              ) : (
                <>
                  <text x={16} y={plotTop + i * rowH + 20} fontFamily={font} fontSize={12} fontWeight={600} fill={ink}>
                    {row.wide}
                  </text>
                  <text x={16} y={plotTop + i * rowH + 35} fontFamily={font} fontSize={11} fill={muted}>
                    {`${fmtGB(row.total)}, ${verdict(row.total)}`}
                  </text>
                </>
              )}
              {segs.map((s, k) => {
                const start = x(cursor / GB);
                cursor += s.w;
                const width = (s.w / GB) * scale;
                return width > 0 ? (
                  <rect key={k} x={start} y={y} width={width} height={barH} fill={s.color} stroke="#ffffff" strokeWidth={1} />
                ) : null;
              })}
              {narrow &&
                REF_LINES.map((l) => (
                  <line
                    key={`seg-${l.gb}`}
                    x1={x(l.gb)}
                    y1={y - 3}
                    x2={x(l.gb)}
                    y2={y + barH + 3}
                    stroke={l.color}
                    strokeWidth={1.5}
                    strokeDasharray={l.dash}
                  />
                ))}
            </g>
          );
        })}

        {!narrow &&
          REF_LINES.map((l) => (
            <line
              key={`line-${l.gb}`}
              x1={x(l.gb)}
              y1={plotTop - 2}
              x2={x(l.gb)}
              y2={plotBottom}
              stroke={l.color}
              strokeWidth={1.5}
              strokeDasharray={l.dash}
            />
          ))}

        <line x1={x0} y1={plotBottom + 2} x2={x1} y2={plotBottom + 2} stroke={muted} strokeWidth={1} />
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x(t)} y1={plotBottom + 2} x2={x(t)} y2={plotBottom + 6} stroke={muted} strokeWidth={1} />
            <text
              x={x(t)}
              y={plotBottom + 18}
              fontFamily={font}
              fontSize={10}
              fill={muted}
              textAnchor={t === 0 ? 'start' : t === BAR_MAX_GB ? 'end' : 'middle'}
            >
              {t === BAR_MAX_GB ? '200 GB' : t}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Tables                                                                   */
/* ------------------------------------------------------------------------ */

interface OptimizerTableRow {
  name: string;
  choice: { row: OptimizerRowId; gradientDtype?: GradientDtype };
  approx?: boolean;
}

const OPTIMIZER_TABLE: OptimizerTableRow[] = [
  { name: 'AdamW, BF16 gradients', choice: { row: 'adamMixed', gradientDtype: 'bf16' } },
  { name: "AdamW, FP32 gradients (Megatron's)", choice: { row: 'adamMixed', gradientDtype: 'fp32' } },
  { name: 'AdamW, BF16 moments (DeepSeek-V3)', choice: { row: 'adamBf16MomentsFp32Grads' } },
  { name: 'Muon', choice: { row: 'muon' } },
  { name: '8-bit Adam', choice: { row: 'adam8bit' } },
  { name: 'Adafactor, no momentum', choice: { row: 'adafactorNoMomentum' }, approx: true },
];

function bytesPerParameter(choice: OptimizerTableRow['choice']): number {
  const c = optimizerComponents(choice);
  return c.weightBytes + c.gradientBytes + c.masterBytes + c.stateBytes;
}

function gbNumber(bytes: number): string {
  return (bytes / GB).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function OptimizerRowsTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>Optimizer row</th>
            <th style={{ ...headCell, textAlign: 'right' }}>Bytes</th>
            <th style={{ ...headCell, textAlign: 'right' }}>8B, GB</th>
            <th style={{ ...headCell, textAlign: 'right' }}>70B, GB</th>
          </tr>
        </thead>
        <tbody>
          {OPTIMIZER_TABLE.map((r) => {
            const bpp = bytesPerParameter(r.choice);
            return (
              <tr key={r.name}>
                <td style={cell}>{r.name}</td>
                <td style={numCell}>{r.approx ? `about ${bpp}` : bpp}</td>
                <td style={numCell}>{gbNumber(modelStateBytes(M8.totalParameters, bpp))}</td>
                <td style={numCell}>{gbNumber(modelStateBytes(M70.totalParameters, bpp))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface LeverRow {
  lever: ReactNode;
  divides: ReactNode;
  costs: ReactNode;
}

function LeverTable({ rows }: { rows: LeverRow[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref);
  if (narrow) {
    return (
      <div ref={ref}>
        <SpaceBetween size="s">
          {rows.map((r, i) => (
            <div key={i} style={{ borderBottom: '1px solid #e9ebed', paddingBottom: 8 }}>
              <Box variant="p">{r.lever}</Box>
              <Box variant="p">
                <strong>Divides:</strong> {r.divides}
              </Box>
              <Box variant="p">
                <strong>Costs:</strong> {r.costs}
              </Box>
            </div>
          ))}
        </SpaceBetween>
      </div>
    );
  }
  return (
    <div ref={ref} style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>Lever</th>
            <th style={headCell}>What it divides</th>
            <th style={headCell}>What it costs</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={cell}>{r.lever}</td>
              <td style={cell}>{r.divides}</td>
              <td style={cell}>{r.costs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function E1Table() {
  const rows = [
    { setting: 'Fused SwiGLU', saved: '1.142', coef: '34.03' },
    { setting: "Eager SwiGLU (TorchTitan v0.4.0's), under any of three attention backends", saved: '1.377', coef: '41.03' },
    { setting: 'Full recomputation, either SwiGLU', saved: '0.067', coef: '2.00' },
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>Setting</th>
            <th style={{ ...headCell, textAlign: 'right' }}>GB per layer</th>
            <th style={{ ...headCell, textAlign: 'right' }}>Bytes per sbh</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.setting}>
              <td style={cell}>{r.setting}</td>
              <td style={numCell}>{r.saved}</td>
              <td style={numCell}>{r.coef}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function E2Table() {
  const rows = [
    { mode: 'None', time: ['2.181', '2.235'], peak: '29.6', added: ['0', '0'] },
    { mode: 'Full', time: ['2.536', '2.552'], peak: '24.3', added: ['+16.3%', '+14.2%'] },
    { mode: 'Selective: keep matmul and attention outputs', time: ['2.428', '2.413'], peak: '26.0', added: ['+11.3%', '+8.0%'] },
  ];
  const pair = (values: string[]) => values.map((v, i) => <div key={i}>{v}</div>);
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>Recomputation</th>
            <th style={{ ...headCell, textAlign: 'right' }}>Step, s</th>
            <th style={{ ...headCell, textAlign: 'right' }}>Peak, GB</th>
            <th style={{ ...headCell, textAlign: 'right' }}>Added</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.mode}>
              <td style={cell}>{r.mode}</td>
              <td style={numCell}>{pair(r.time)}</td>
              <td style={numCell}>{r.peak}</td>
              <td style={numCell}>{pair(r.added)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Calculator B                                                             */
/* ------------------------------------------------------------------------ */

type CalcInstanceId = Extract<
  InstanceId,
  'p4d.24xlarge' | 'p4de.24xlarge' | 'p5.48xlarge' | 'p5en.48xlarge' | 'p6-b200.48xlarge' | 'p6-b300.48xlarge' | 'trn2.48xlarge'
>;

const CALC_INSTANCES: Array<{ id: CalcInstanceId; label: string }> = [
  { id: 'p5.48xlarge', label: 'p5.48xlarge: H100, per GPU' },
  { id: 'p5en.48xlarge', label: 'p5en.48xlarge: H200, per GPU' },
  { id: 'p6-b200.48xlarge', label: 'p6-b200.48xlarge: B200, per GPU' },
  { id: 'p6-b300.48xlarge', label: 'p6-b300.48xlarge: B300, per GPU' },
  { id: 'p4de.24xlarge', label: 'p4de.24xlarge: A100 80 GB, per GPU' },
  { id: 'p4d.24xlarge', label: 'p4d.24xlarge: A100 40 GB, per GPU' },
  { id: 'trn2.48xlarge', label: 'trn2.48xlarge: Trainium2, per logical NeuronCore' },
];

const MODEL_OPTIONS: Array<{ id: DenseModelId; label: string }> = [
  { id: 'llama-3.1-8b', label: 'Llama 3.1 8B' },
  { id: 'llama-3.1-70b', label: 'Llama 3.1 70B' },
  { id: 'llama-3.1-405b', label: 'Llama 3.1 405B' },
];

const OPTIMIZER_OPTIONS: Array<{ id: OptimizerRowId; label: string; defaultGrad: GradientDtype }> = [
  { id: 'adamMixed', label: 'AdamW, FP32 master and moments', defaultGrad: 'bf16' },
  { id: 'adamBf16MomentsFp32Grads', label: 'AdamW with BF16 moments (DeepSeek-V3)', defaultGrad: 'fp32' },
  { id: 'muon', label: 'Muon, one momentum buffer', defaultGrad: 'bf16' },
  { id: 'adam8bit', label: '8-bit Adam', defaultGrad: 'bf16' },
  { id: 'adafactorNoMomentum', label: 'Adafactor without momentum', defaultGrad: 'bf16' },
];

const ZERO_OPTIONS: Array<{ id: ZeroStage; label: string }> = [
  { id: 0, label: 'Replicated, as DDP (Distributed Data Parallel)' },
  { id: 1, label: 'Stage 1: optimizer state sharded' },
  { id: 2, label: 'Stage 2: plus gradients' },
  { id: 3, label: 'Stage 3 or FSDP: plus weights' },
];

const RECOMPUTE_OPTIONS: Array<{ id: RecomputeMode; label: string }> = [
  { id: 'none', label: 'None' },
  { id: 'selective', label: "Selective, Megatron's attention-only form" },
  { id: 'full', label: 'Full, every layer' },
];

const LOGITS_OPTIONS: Array<{ id: LogitsMode; label: string }> = [
  { id: 'fp32Upcast', label: 'FP32 upcast (Meta reference, Megatron Core default)' },
  { id: 'bf16Fused', label: "Fused BF16 cross-entropy (Transformer Engine's)" },
];

const SWIGLU_OPTIONS: Array<{ id: 'fused' | 'eager'; label: string }> = [
  { id: 'fused', label: 'Fused SwiGLU (34 sbh for 8B)' },
  { id: 'eager', label: "Eager SwiGLU, TorchTitan v0.4.0's (41 sbh for 8B)" },
];

const DEGREE_OPTIONS = [1, 2, 4, 8].map((n) => ({ value: String(n), label: String(n) }));

interface CalcForm {
  model: DenseModelId;
  optimizer: OptimizerRowId;
  gradientDtype: GradientDtype;
  zeroStage: ZeroStage;
  zeroDegree: string;
  tp: string;
  sp: boolean;
  pp: string;
  chunks: string;
  cp: string;
  recompute: RecomputeMode;
  swiglu: 'fused' | 'eager';
  microBatch: string;
  seq: string;
  logits: LogitsMode;
  instance: CalcInstanceId;
  headroomPct: string;
}

const BASE_FORM: CalcForm = {
  model: 'llama-3.1-8b',
  optimizer: 'adamMixed',
  gradientDtype: 'bf16',
  zeroStage: 3,
  zeroDegree: '8',
  tp: '1',
  sp: false,
  pp: '1',
  chunks: '1',
  cp: '1',
  recompute: 'none',
  swiglu: 'fused',
  microBatch: '1',
  seq: '8192',
  logits: 'fp32Upcast',
  instance: 'p5.48xlarge',
  headroomPct: '75',
};

const CALC_PRESETS: Array<{ id: string; label: string; form: CalcForm }> = [
  { id: '8b-fsdp8', label: 'Llama 3.1 8B, FSDP 8 on one p5.48xlarge', form: BASE_FORM },
  {
    id: '8b-b2-full',
    label: 'Llama 3.1 8B, FSDP 8, micro-batch 2, full recomputation',
    form: { ...BASE_FORM, microBatch: '2', recompute: 'full' },
  },
  {
    id: '70b-tp8',
    label: 'Llama 3.1 70B, TP 8 + SP, ZeRO-1 over DP 32 (256 H100)',
    form: { ...BASE_FORM, model: 'llama-3.1-70b', zeroStage: 1, zeroDegree: '32', tp: '8', sp: true },
  },
  {
    id: '70b-pp4',
    label: 'Llama 3.1 70B, TP 8 x PP 4 x DP 8, ZeRO-1, 5 chunks per stage',
    form: { ...BASE_FORM, model: 'llama-3.1-70b', zeroStage: 1, zeroDegree: '8', tp: '8', sp: true, pp: '4', chunks: '5' },
  },
  {
    id: '70b-fsdp256-full',
    label: 'Llama 3.1 70B, FSDP over 256 H100, full recomputation',
    form: { ...BASE_FORM, model: 'llama-3.1-70b', zeroStage: 3, zeroDegree: '256', recompute: 'full' },
  },
  {
    id: '70b-torchtitan',
    label: "Llama 3.1 70B, TorchTitan's TP 8 x FSDP 32, local batch 16, full recomputation",
    form: {
      ...BASE_FORM,
      model: 'llama-3.1-70b',
      zeroStage: 3,
      zeroDegree: '32',
      tp: '8',
      sp: true,
      microBatch: '16',
      recompute: 'full',
    },
  },
];

type FieldKey = 'zeroDegree' | 'tp' | 'pp' | 'chunks' | 'cp' | 'microBatch' | 'seq' | 'headroomPct';
type ParseOutcome = { ok: true; input: MemoryInput } | { ok: false; errors: Partial<Record<FieldKey, string>> };
type BudgetOutcome = { ok: true; result: MemoryResult } | { ok: false; message: string };

function parseWhole(text: string): number | undefined {
  if (!/^\s*\d+\s*$/.test(text)) return undefined;
  const n = Number(text);
  return Number.isSafeInteger(n) && n > 0 ? n : undefined;
}

/** Reads the form into Calculator B's input, or names each field that does not parse. */
function parseForm(f: CalcForm): ParseOutcome {
  const errors: Partial<Record<FieldKey, string>> = {};
  const whole = (key: FieldKey, label: string): number => {
    const n = parseWhole(f[key] as string);
    if (n === undefined) errors[key] = `${label} must be a whole number of 1 or more`;
    return n ?? 1;
  };
  const zeroDegree = f.zeroStage === 0 ? 1 : whole('zeroDegree', 'Sharding degree');
  const tp = whole('tp', 'Tensor-parallel degree');
  const pp = whole('pp', 'Pipeline stages');
  const chunks = whole('chunks', 'Chunks per stage');
  const cp = whole('cp', 'Context-parallel degree');
  const microBatch = whole('microBatch', 'Micro-batch');
  const seq = whole('seq', 'Sequence length');
  const pct = Number(f.headroomPct);
  if (!Number.isFinite(pct) || pct <= 0 || pct > 100) errors.headroomPct = 'Headroom target must be between 1 and 100%';
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    input: {
      model: shapeOf(DENSE_MODELS[f.model]),
      optimizer: { row: f.optimizer, gradientDtype: f.gradientDtype },
      zero: { stage: f.zeroStage, degree: zeroDegree },
      tensorParallel: { degree: tp, sequenceParallel: f.sp },
      pipelineParallel: { degree: pp, interleavedChunks: chunks },
      contextParallel: cp,
      recompute: f.recompute,
      activations: { swiglu: f.swiglu },
      microBatch,
      sequenceLength: seq,
      logits: f.logits,
      hbmPerRank: rankFacts(INSTANCES[f.instance]).hbmPerRank,
      headroomFraction: pct / 100,
    },
  };
}

/** Runs Calculator B; a RangeError names the field that the combination breaks. */
function runBudget(input: MemoryInput): BudgetOutcome {
  try {
    return { ok: true, result: memoryBudget(input) };
  } catch (e) {
    if (e instanceof RangeError) return { ok: false, message: e.message };
    throw e;
  }
}

function capacityText(figures: readonly MemoryFigure[], capacityBytes: number): string {
  const listed = figures.map((f) => `${f.value} ${f.unit}`).join(' and ');
  return figures.length > 1 ? `${fmtGB(capacityBytes)}, the smaller of ${listed}` : `${fmtGB(capacityBytes)} (${listed})`;
}

function selectOf<T extends string | number>(
  options: Array<{ id: T; label: string }>,
  value: T,
): { options: SelectProps.Option[]; selected: SelectProps.Option } {
  const opts = options.map((o) => ({ value: String(o.id), label: o.label }));
  return { options: opts, selected: opts.find((o) => o.value === String(value)) ?? opts[0] };
}

function MemoryCalculator() {
  const [presetId, setPresetId] = useState(CALC_PRESETS[0].id);
  const [form, setForm] = useState<CalcForm>(CALC_PRESETS[0].form);
  const set = <K extends keyof CalcForm>(key: K, value: CalcForm[K]) => setForm((f) => ({ ...f, [key]: value }));

  const parsed = useMemo(() => parseForm(form), [form]);
  const outcome = useMemo<BudgetOutcome | undefined>(() => (parsed.ok ? runBudget(parsed.input) : undefined), [parsed]);
  const err = (key: FieldKey) => (parsed.ok ? undefined : parsed.errors[key]);

  const presetSel = selectOf(
    CALC_PRESETS.map((p) => ({ id: p.id, label: p.label })),
    presetId,
  );
  const modelSel = selectOf(MODEL_OPTIONS, form.model);
  const optSel = selectOf(OPTIMIZER_OPTIONS, form.optimizer);
  const gradSel = selectOf(
    [
      { id: 'bf16' as GradientDtype, label: 'BF16 gradients' },
      { id: 'fp32' as GradientDtype, label: 'FP32 main gradients' },
    ],
    form.gradientDtype,
  );
  const zeroSel = selectOf(ZERO_OPTIONS, form.zeroStage);
  const recSel = selectOf(RECOMPUTE_OPTIONS, form.recompute);
  const logSel = selectOf(LOGITS_OPTIONS, form.logits);
  const swiSel = selectOf(SWIGLU_OPTIONS, form.swiglu);
  const instSel = selectOf(CALC_INSTANCES, form.instance);

  const numberField = (key: FieldKey, label: string, description?: ReactNode, disabled?: boolean) => (
    <FormField label={label} description={description} errorText={err(key)}>
      <Input
        type="number"
        inputMode="numeric"
        value={form[key] as string}
        disabled={disabled}
        onChange={({ detail }) => set(key, detail.value)}
      />
    </FormField>
  );

  return (
    <SpaceBetween size="m">
      <FormField label="Start from a worked layout" description="Sets every input below; change any of them afterwards.">
        <Select
          selectedOption={presetSel.selected}
          options={presetSel.options}
          onChange={({ detail }) => {
            const p = CALC_PRESETS.find((x) => x.id === detail.selectedOption.value);
            if (!p) return;
            setPresetId(p.id);
            setForm(p.form);
          }}
        />
      </FormField>

      <ColumnLayout columns={3}>
        <FormField label="Model">
          <Select
            selectedOption={modelSel.selected}
            options={modelSel.options}
            onChange={({ detail }) => set('model', detail.selectedOption.value as DenseModelId)}
          />
        </FormField>
        <FormField label="Optimizer row">
          <Select
            selectedOption={optSel.selected}
            options={optSel.options}
            onChange={({ detail }) => {
              const o = OPTIMIZER_OPTIONS.find((x) => x.id === detail.selectedOption.value);
              if (!o) return;
              setForm((f) => ({ ...f, optimizer: o.id, gradientDtype: o.defaultGrad }));
            }}
          />
        </FormField>
        <FormField label="Gradient dtype" description="16 or 18 bytes per parameter for AdamW">
          <Select
            selectedOption={gradSel.selected}
            options={gradSel.options}
            onChange={({ detail }) => set('gradientDtype', detail.selectedOption.value as GradientDtype)}
          />
        </FormField>
        <FormField label="Sharding of model state">
          <Select
            selectedOption={zeroSel.selected}
            options={zeroSel.options}
            onChange={({ detail }) => set('zeroStage', Number(detail.selectedOption.value) as ZeroStage)}
          />
        </FormField>
        {numberField(
          'zeroDegree',
          'Sharding degree d',
          'Ranks the state is split over: the data-parallel degree',
          form.zeroStage === 0,
        )}
        <FormField label="Accelerator">
          <Select
            selectedOption={instSel.selected}
            options={instSel.options}
            onChange={({ detail }) => set('instance', detail.selectedOption.value as CalcInstanceId)}
          />
        </FormField>
        <FormField label="Tensor-parallel degree t">
          <Select
            selectedOption={DEGREE_OPTIONS.find((o) => o.value === form.tp) ?? { value: form.tp, label: form.tp }}
            options={DEGREE_OPTIONS}
            onChange={({ detail }) => set('tp', detail.selectedOption.value ?? '1')}
          />
        </FormField>
        <FormField label="Sequence parallelism" description="Splits what TP leaves whole">
          <Toggle checked={form.sp} onChange={({ detail }) => set('sp', detail.checked)}>
            {form.sp ? 'On' : 'Off'}
          </Toggle>
        </FormField>
        <FormField label="Context-parallel degree">
          <Select
            selectedOption={DEGREE_OPTIONS.find((o) => o.value === form.cp) ?? { value: form.cp, label: form.cp }}
            options={DEGREE_OPTIONS}
            onChange={({ detail }) => set('cp', detail.selectedOption.value ?? '1')}
          />
        </FormField>
        {numberField('pp', 'Pipeline stages p')}
        {numberField('chunks', 'Interleaved chunks per stage v', '1 for plain 1F1B')}
        <FormField label="Recomputation">
          <Select
            selectedOption={recSel.selected}
            options={recSel.options}
            onChange={({ detail }) => set('recompute', detail.selectedOption.value as RecomputeMode)}
          />
        </FormField>
        <FormField label="SwiGLU implementation" description="Measured in our E1 run">
          <Select
            selectedOption={swiSel.selected}
            options={swiSel.options}
            onChange={({ detail }) => set('swiglu', detail.selectedOption.value as 'fused' | 'eager')}
          />
        </FormField>
        {numberField('microBatch', 'Micro-batch b', 'Sequences per forward and backward pass')}
        {numberField('seq', 'Sequence length s', 'Tokens per sequence')}
        <FormField label="Loss and logits">
          <Select
            selectedOption={logSel.selected}
            options={logSel.options}
            onChange={({ detail }) => set('logits', detail.selectedOption.value as LogitsMode)}
          />
        </FormField>
        {numberField(
          'headroomPct',
          'Headroom target, % of memory',
          'An assumption: estimate; confirm with a measured step',
        )}
      </ColumnLayout>

      <CalculatorResult outcome={outcome} pipelined={parsed.ok && (parsed.input.pipelineParallel?.degree ?? 1) > 1} />
    </SpaceBetween>
  );
}

function CalculatorResult({ outcome, pipelined }: { outcome: BudgetOutcome | undefined; pipelined: boolean }) {
  if (!outcome) {
    return <Box color="text-status-error">Correct the highlighted fields to see the budget.</Box>;
  }
  if (!outcome.ok) {
    return <Box color="text-status-error">This combination is not valid: {outcome.message}.</Box>;
  }
  const r = outcome.result;
  const stage = r.peakStage === 'first' ? r.firstStage : r.lastStage;
  const pct = Math.round(r.headroomFraction * 100);
  const status = !r.fits ? (
    <StatusIndicator type="error">
      Does not fit: {fmtGB(-r.freeBytes)} over the {fmtGB(r.capacity.bytes)} per rank
    </StatusIndicator>
  ) : r.confirmWithMeasuredStep ? (
    <StatusIndicator type="warning">
      Above the {pct}% target with {fmtGB(r.freeBytes)} left: {r.label}
    </StatusIndicator>
  ) : (
    <StatusIndicator type="success">
      Under the {pct}% target with {fmtGB(r.freeBytes)} left: {r.label}
    </StatusIndicator>
  );
  const stageName = !pipelined ? 'the only stage' : r.peakStage === 'first' ? 'the first stage' : 'the last stage';
  return (
    <SpaceBetween size="s">
      <Box variant="h3">Per rank, at the peak of the step</Box>
      {status}
      <KeyValuePairs
        columns={3}
        items={[
          {
            label: 'Model state',
            value: `${fmtGB(r.modelState.totalBytes)}: weights ${fmtGB(r.modelState.weightsBytes)}, gradients ${fmtGB(
              r.modelState.gradientsBytes,
            )}, optimizer ${fmtGB(r.modelState.optimizerBytes)}`,
          },
          {
            label: 'Activations',
            value: `${fmtGB(stage.activationBytes)} on ${stageName}, ${r.activations.sbhPerLayer.toFixed(
              1,
            )} sbh per layer before any split`,
          },
          { label: 'Logits', value: stage.logitBytes > 0 ? fmtGB(stage.logitBytes) : 'none on this stage' },
          { label: 'Total per rank', value: fmtGB(r.totalBytes) },
          { label: 'Memory per rank', value: capacityText(r.capacity.figures, r.capacity.bytes) },
          { label: `Headroom target (${pct}%)`, value: fmtGB(r.headroomTargetBytes) },
        ]}
      />
      <Box variant="small" color="text-body-secondary">
        GB is 10^9 bytes and GiB 2^30; where AWS and NVIDIA print different units the calculator
        takes the smaller figure. Buffers, gathered FSDP layers and fragmentation are left to the
        headroom.
      </Box>
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function MemoryBudget() {
  const w8one = worked('8b-one');
  const w8fsdp = worked('8b-fsdp8');
  const w8b2 = worked('8b-b2');
  const w8b2full = worked('8b-b2-full');
  const w70tp = worked('70b-tp8');
  const w70fsdp = worked('70b-fsdp256');
  const w70full = worked('70b-fsdp256-full');
  const logitsFp32 = ACT8_FUSED.logits.fp32Bytes;
  const logitsBf16 = ACT8_BF16_LOGITS.logits.bf16Bytes;
  const act8 = ACT8_FUSED.firstStage.activationBytes;

  const levers: LeverRow[] = [
    {
      lever: (
        <>
          <strong>Sharding</strong> over d data-parallel ranks: ZeRO (Zero Redundancy Optimizer) stages 1 to 3,
          and FSDP (Fully Sharded Data Parallel), which is stage 3
        </>
      ),
      divides: (
        <>
          Model state. Stage 1 shards the optimizer state, 4 + 12/d bytes per parameter; stage 2 adds the
          gradients, 2 + 14/d; stage 3 adds the weights, 16/d{' '}
          <Cite tier={3} href={ZERO} venue="preprint">
            ZeRO, Section 5
          </Cite>
        </>
      ),
      costs: (
        <>
          Collectives every step; stage 3 adds about 50% to data parallelism&apos;s communication volume{' '}
          <Cite tier={3} href={ZERO} venue="preprint">
            ZeRO, Section 1
          </Cite>
          . Section 8, Data Parallelism &amp; Sharding.
        </>
      ),
    },
    {
      lever: (
        <>
          <strong>TP (tensor parallelism)</strong> of degree t, with <strong>SP (sequence parallelism)</strong>
        </>
      ),
      divides: (
        <>
          Model state by t, and activations by t. Without SP the norm inputs and the projections&apos;
          shared inputs, 8 sbh for Llama&apos;s layer, stay whole on every rank (our count, from the
          paper&apos;s Table 2){' '}
          <Cite tier={3} href={KORTHIKANTI} venue="preprint">
            Reducing Activation Recomputation, Table 2
          </Cite>
        </>
      ),
      costs: 'Collectives inside every layer of every micro-batch, which keep TP inside one instance. Section 9, Tensor & Sequence Parallelism.',
    },
    {
      lever: (
        <>
          <strong>Full recomputation</strong>: keep each layer&apos;s input and re-run its forward pass during the
          backward pass
        </>
      ),
      divides: (
        <>
          Activations, to 2 sbh per layer plus one layer&apos;s full set while it is recomputed{' '}
          <Cite tier={3} href={KORTHIKANTI} venue="preprint">
            Reducing Activation Recomputation, Table 2
          </Cite>
          ; our run measured 2.00 sbh{' '}
          <Cite tier={0} href={E1_URL}>
            {E1_TITLE}
          </Cite>
        </>
      ),
      costs: (
        <>
          One more forward pass, about 33% more FLOPs (floating-point operations){' '}
          <Cite tier={3} href={KORTHIKANTI} venue="preprint">
            Reducing Activation Recomputation, Section 6.2
          </Cite>
          ; 14% to 16% more step time in our run on one GB10 (details below)
        </>
      ),
    },
    {
      lever: (
        <>
          <strong>Selective recomputation</strong>: recompute only the large, cheap tensors
        </>
      ),
      divides: (
        <>
          In Megatron&apos;s attention-only form, the attention scores: 70% of GPT-3&apos;s activations for 2.7%
          more FLOPs{' '}
          <Cite tier={3} href={KORTHIKANTI} venue="preprint">
            Reducing Activation Recomputation, Section 5
          </Cite>
        </>
      ),
      costs: (
        <>
          7% more time on the paper&apos;s measured layer{' '}
          <Cite tier={3} href={KORTHIKANTI} venue="preprint">
            Reducing Activation Recomputation, Section 6.2
          </Cite>
          . A FlashAttention-style kernel never stores those scores{' '}
          <Cite tier={3} href={FLASH} venue="preprint">
            FlashAttention, Section 3.1
          </Cite>
          , so this form saves nothing further on a Llama stack, and Calculator B counts it as none (our
          reading).
        </>
      ),
    },
    {
      lever: (
        <>
          <strong>A smaller micro-batch</strong> b
        </>
      ),
      divides: 'Activations and logits, in proportion to b.',
      costs: 'More, smaller passes per update for the same global batch, B = b x m x d (section 3).',
    },
    {
      lever: (
        <>
          <strong>CP (context parallelism)</strong> of degree c
        </>
      ),
      divides: (
        <>
          The inputs and every activation, along the sequence{' '}
          <Cite tier={1} href={MG_CP}>
            Megatron Core context parallelism guide, L19
          </Cite>
          ; the weights stay whole on every rank of the group
        </>
      ),
      costs: 'An all-gather of keys and values in the forward pass and again in the backward. Section 11, Long Sequences.',
    },
    {
      lever: (
        <>
          <strong>PP (pipeline parallelism)</strong> over p stages
        </>
      ),
      divides: (
        <>
          Model state by p, and the first stage&apos;s activations not at all. Under 1F1B (one forward, one
          backward) that stage holds p micro-batches of L/p layers, L layers&apos; worth whatever p is, times 1 +
          (p - 1)/(p x v) with v interleaved chunks{' '}
          <Cite tier={3} href={KORTHIKANTI} venue="preprint">
            Reducing Activation Recomputation, Section 4.2.3
          </Cite>
        </>
      ),
      costs: 'The bubble, the idle time at the start and end of each step. Section 10, Pipeline Parallelism & the Bubble.',
    },
  ];

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Know whether a model fits before you launch it, and which lever buys memory back at what price: 16 bytes per parameter of model state before the first activation, then activations that grow with the tokens in flight (papers, and code at PyTorch v2.15.0, TorchTitan v0.4.0, Megatron Core core_v0.20.0, Transformer Engine v2.21.0, bitsandbytes 0.50.2 and llama-models v0.2.0, read 2026-10-31, and our DGX Spark runs)"
          >
            5. The Memory Budget
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The memory budget is what one accelerator holds at the peak of a training step: the model
            state that persists from step to step, the activations that live from a forward pass to its
            backward pass, the logits at the output head, and the buffers the framework allocates around
            all three. Each part follows from the model&apos;s shape and the layout before anything runs.
          </Box>
          <Box variant="p">
            The challenge is to know before the launch whether that sum fits in the accelerator&apos;s
            memory, and when it does not, which lever closes the gap at the lowest price. Every lever
            trades memory for something else: communication, arithmetic or more passes per update.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Price your model's state before it reads a token, and state the gradient dtype with every total: 16 bytes per parameter is 128.5 GB for Llama 3.1 8B, 1.6 times one 80 GB H100"
          >
            Model state: 16 bytes per parameter, 12 of them the optimizer&apos;s
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Model state is the weights, the gradients and the optimizer state, and it stays allocated for
            the whole run. Mixed-precision Adam holds 16 bytes per parameter{' '}
            <Cite tier={3} href={ZERO} venue="preprint">
              ZeRO, Section 3.1
            </Cite>
            :
          </Box>
          <ul>
            <li>
              2 bytes for the BF16 (bfloat16: 16 bits with FP32&apos;s exponent range) working weights that the
              forward and backward passes read;
            </li>
            <li>2 bytes for the BF16 gradients;</li>
            <li>
              12 bytes for the optimizer: an FP32 (32-bit floating point) master copy of the weights and
              Adam&apos;s two moments, the running averages of each gradient and of its square, at 4 bytes each.
            </li>
          </ul>
          <Box variant="p">
            Megatron-LM&apos;s BF16 recipe accumulates and all-reduces gradients in FP32 unless{' '}
            <code>--grad-reduce-in-bf16</code> is set{' '}
            <Cite tier={1} href={MG_FP32_GRADS} kind="code">
              Megatron-LM core_v0.20.0 arguments.py L1121-L1134
            </Cite>
            , and its own table prices that setting at 18 bytes per parameter{' '}
            <Cite tier={1} href={MG_DIST_OPT}>
              Megatron Core distributed optimizer guide L14-L20
            </Cite>
            . Those two bytes are why every byte total in this dive states its gradient dtype.
          </Box>
          <Box variant="p">
            For Llama 3.1 8B, with 8,030,261,248 parameters{' '}
            <Cite tier={1} href={HF_8B}>
              Meta&apos;s Llama 3.1 8B model metadata
            </Cite>
            , 16 bytes per parameter is 128.5 GB before a single activation, 1.6 times the 80 GB of one
            H100{' '}
            <Cite tier={1} href={H100_SPEC} kind="vendor-claim" accessed={REGISTER_DATE}>
              NVIDIA H100 specification
            </Cite>
            . Llama 3.1 70B, with 70,553,706,496{' '}
            <Cite tier={1} href={HF_70B}>
              Meta&apos;s Llama 3.1 70B model metadata
            </Cite>
            , needs 1,128.9 GB at 16 bytes and 1,270.0 GB at 18 (our arithmetic).
          </Box>
          <Box variant="p">
            The optimizer owns 12 of the 16 bytes, so the optimizer is where alternatives move the total.
            Each row below keeps BF16 weights and an FP32 master copy of them. The training framework
            keeps that master; the optimizer libraries hold only their own state (our reading of the
            code in the disclosure below). Megatron Core&apos;s opt-in precision-aware optimizer can store
            the master as a 16-bit remainder beside the BF16 weight, 2 bytes instead of 4, and the moments
            in BF16 or FP8 (8-bit floating point){' '}
            <Cite tier={1} href={MG_PRECISION_CONFIG} kind="code">
              Megatron Core optimizer_config.py L188-L207
            </Cite>{' '}
            <Cite tier={1} href={MG_PRECISION_FLAGS} kind="code">
              Megatron-LM arguments.py L3606-L3624
            </Cite>
            .
          </Box>
          <OptimizerRowsTable />
          <Box variant="small" color="text-body-secondary">
            Bytes per parameter, and model state in GB before sharding at Meta&apos;s parameter counts.
            Every row keeps BF16 weights and an FP32 master; AdamW keeps both moments in FP32 unless the
            row says otherwise, and Muon keeps one FP32 buffer. Totals are our arithmetic on the byte
            counts each source gives; none of the papers totals its row this way.
          </Box>
          <ExpandableSection headerText="Where each optimizer row comes from">
            <SpaceBetween size="s">
              <ul>
                <li>
                  <strong>DeepSeek-V3, 14 bytes.</strong> AdamW&apos;s moments in BF16, with the master
                  weights and the gradients kept in FP32{' '}
                  <Cite tier={3} href={DEEPSEEK_V3} venue="preprint">
                    DeepSeek-V3 Technical Report, Section 3.3.3
                  </Cite>
                  : 2 + 4 + 4 + 2 + 2, our count.
                </li>
                <li>
                  <strong>Muon, 12 bytes.</strong> One momentum buffer where AdamW keeps two, and only for
                  matrix parameters: AdamW still handles the norms, the output head and the embedding{' '}
                  <Cite tier={3} href={MUON} venue="preprint">
                    Muon is Scalable for LLM Training, Sections 2.2 and 2.3
                  </Cite>
                  . PyTorch v2.15.0&apos;s Muon allocates that buffer in the gradient&apos;s dtype{' '}
                  <Cite tier={1} href={PT_MUON} kind="code">
                    PyTorch _muon.py L160-L163
                  </Cite>
                  , which is FP32 when the optimizer steps an FP32 master copy (our reading). For Llama 3.1 8B the 1.05 billion embedding and head parameters would stay at 16 bytes
                  (our arithmetic: 2 x 128,256 x 4,096).
                </li>
                <li>
                  <strong>8-bit Adam, 10 bytes.</strong> Block-wise quantization takes Adam&apos;s two
                  states from 8 bytes per parameter to 2{' '}
                  <Cite tier={3} href={ADAM_8BIT} venue="ICLR 2022">
                    8-bit Optimizers via Block-wise Quantization, Section 1.1
                  </Cite>
                  . bitsandbytes 0.50.2 stores them as 8-bit integers with one FP32 maximum per 256 values,
                  about 2.03 bytes, keeps FP32 states for tensors under 4,096 elements, and updates the
                  parameter in place without a master copy of its own{' '}
                  <Cite tier={1} href={BNB_STATE} kind="code">
                    bitsandbytes 0.50.2 optimizer.py L491-L530
                  </Cite>
                  ; the paper&apos;s blocks are 2,048 values.
                </li>
                <li>
                  <strong>Adafactor without momentum, about 8 bytes.</strong> The second moment of a
                  matrix is kept as row and column sums, and momentum is dropped, leaving &quot;very little
                  auxiliary storage&quot;{' '}
                  <Cite tier={3} href={ADAFACTOR} venue="preprint">
                    Adafactor, Abstract
                  </Cite>
                  . PyTorch v2.15.0 keeps the two factors for matrices and a full variance only for
                  one-dimensional tensors{' '}
                  <Cite tier={1} href={PT_ADAFACTOR} kind="code">
                    PyTorch _adafactor.py L101-L114
                  </Cite>
                  , so the row is 2 + 2 + 4 plus almost nothing.
                </li>
              </ul>
              <Box variant="p">
                The evidence behind the cheaper rows is small: 8-bit Adam&apos;s results are at 1.5 billion
                parameters and Adafactor&apos;s on translation models, and this research located no
                Llama-scale production report for either.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Estimate activations from the tokens in flight, then check the two code choices that move them: the attention kernel, worth ten times at 8,192 tokens, and the SwiGLU implementation, worth 21%"
          >
            Activations: about 34 sbh bytes per layer, then the logits
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Activations are the tensors the forward pass saves for the backward pass. They scale with the
            tokens in flight, so their unit is s x b x h, written sbh: sequence length, times micro-batch
            size (the sequences that go through one forward and backward pass together), times hidden
            size. Korthikanti et al.&apos;s method adds up the bytes of every saved tensor{' '}
            <Cite tier={3} href={KORTHIKANTI} venue="preprint">
              Reducing Activation Recomputation, Section 4.1
            </Cite>
            . Applied to Llama&apos;s layer with a FlashAttention-style kernel, which keeps the attention
            output and per-row softmax statistics and never stores the s x s score matrix{' '}
            <Cite tier={3} href={FLASH} venue="preprint">
              FlashAttention, Section 3.1
            </Cite>
            , it gives 34 sbh bytes per layer for the 8B model and 33.5 for 70B, our derivation (section 3
            lists the tensors).
          </Box>
          <Box variant="p">Two implementation choices move that coefficient:</Box>
          <ul>
            <li>
              <strong>The attention kernel.</strong> An eager attention that stores the scores adds the
              paper&apos;s 5as/h term, a being the number of attention heads. For the 8B model at 8,192
              tokens that makes each layer about ten times larger, and the gap grows with sequence length
              (our arithmetic, in the disclosure below).
            </li>
            <li>
              <strong>The SwiGLU implementation</strong>, the gated MLP (multilayer perceptron) Llama uses.
              Our run on one GB10 measured 34.03 sbh with a fused SwiGLU that saves only its two inputs,
              and 41.03 sbh with the eager <code>F.silu(gate) * up</code> that TorchTitan v0.4.0&apos;s
              model code computes, 21% more{' '}
              <Cite tier={0} href={E1_URL}>
                {E1_TITLE}
              </Cite>{' '}
              <Cite tier={1} href={TT_ACTIVATION} kind="code">
                TorchTitan v0.4.0 activation.py L166-L177
              </Cite>
              . Whether <code>torch.compile</code> brings TorchTitan back to 34 was not tested.
            </li>
          </ul>
          <Box variant="p">
            The same run found the coefficient unchanged from 2,048 to 8,192 tokens, at micro-batch 1 and
            2 and under three attention backends, and measured full recomputation storing exactly 2.00
            sbh per layer, the layer&apos;s input. For Llama 3.1 8B at 8,192 tokens and micro-batch 1 that
            is {fmtGB(act8)} across 32 layers at 34 sbh, nearly half of an 80 GB H100 for one sequence,
            and about {Math.round(ACT8_EAGER.firstStage.activationBytes / GB)} GB at 41 sbh (Calculator B).
          </Box>

          <Box variant="h3">The logits at the output head</Box>
          <Box variant="p">
            The output head turns each token&apos;s hidden state into logits, one score per vocabulary
            entry, so the logits hold s x b x V values. When the loss upcasts them to FP32, as Meta&apos;s
            reference code does{' '}
            <Cite tier={1} href={LLAMA_UPCAST} kind="code">
              llama-models v0.2.0 model.py L308
            </Cite>{' '}
            and as Megatron Core&apos;s default loss does{' '}
            <Cite tier={1} href={MG_CE_UPCAST} kind="code">
              Megatron Core cross_entropy.py L25
            </Cite>{' '}
            <Cite tier={1} href={MG_CE_DEFAULT} kind="code">
              Megatron Core model_parallel_config.py L355-L363
            </Cite>
            , they take 4 bytes each: {fmtGB(logitsFp32)} for one 8,192-token sequence over Llama&apos;s
            128,256-entry vocabulary{' '}
            <Cite tier={1} href={LLAMA_TOKENIZER} kind="code">
              llama-models v0.2.0 tokenizer.py L53-L103
            </Cite>
            , 11.5% of the {fmtGB(act8)} in the layers (our arithmetic). Korthikanti et al. treat the
            output layer as negligible{' '}
            <Cite tier={3} href={KORTHIKANTI} venue="preprint">
              Reducing Activation Recomputation, Section 4.3
            </Cite>
            . That holds beside their eager attention&apos;s 5as/h term and a 51,200-entry vocabulary; with
            a FlashAttention-style kernel removing that term and Llama&apos;s vocabulary in place, it no
            longer holds (our reading).
          </Box>
          <Box variant="p">
            A fused cross-entropy changes that bill. Transformer Engine&apos;s (NVIDIA&apos;s library of
            fused transformer kernels) accepts BF16 logits and saves a BF16 copy plus two FP32 statistics
            per token{' '}
            <Cite tier={1} href={TE_CE_DTYPE} kind="code">
              Transformer Engine v2.21.0 cross_entropy.py L115-L116
            </Cite>{' '}
            <Cite tier={1} href={TE_CE_SAVE} kind="code">
              Transformer Engine v2.21.0 triton/cross_entropy.py L45-L51
            </Cite>
            , {fmtGB(logitsBf16)} for the same sequence. Megatron Core selects it with{' '}
            <code>--cross-entropy-loss-fusion --cross-entropy-fusion-impl te</code> on Transformer Engine
            2.19.0 or later{' '}
            <Cite tier={1} href={MG_CE_TE_MIN} kind="code">
              Megatron-LM arguments.py L1659-L1666
            </Cite>
            .
          </Box>
          <Box variant="p">
            Budget the logits at their peak. In our run an upcasting head and loss saved 4.27 GB for one
            8,192-token sequence and briefly held 8.5 GB during the forward pass and 11.6 GB during the
            backward pass, gradients excluded{' '}
            <Cite tier={0} href={E1_URL}>
              {E1_TITLE}
            </Cite>
            . Calculator B budgets {fmtGB(ACT8_FUSED.logits.totalBytes)}, the FP32 logits plus their BF16
            source; the rest of that peak is what the headroom target below has to cover (our reading).
          </Box>
          <ExpandableSection headerText="Our measurements, and the eager-attention arithmetic">
            <SpaceBetween size="s">
              <Box variant="p">
                Our run built one, two and four layers of the 8B shape with random BF16 weights, read the
                CUDA caching allocator&apos;s byte count before and after the forward pass at 2,048, 4,096
                and 8,192 tokens and micro-batch 1 and 2, and took the slope over layers. One run on one
                GB10 with 128 GB of unified memory, PyTorch 2.15.0; the GB column is the bytes saved per
                layer at s = 8,192 and b = 1, without recomputation unless the row says so:
              </Box>
              <E1Table />
              <Box variant="p">
                The extra 0.03 sbh over the derivation is FP32 per-row statistics. The coefficients are
                byte counts set by the model code and the PyTorch version, so we read them as carrying to
                an H100; peak memory there also depends on the allocator and on kernel workspaces, which
                the run did not measure{' '}
                <Cite tier={0} href={E1_URL}>
                  {E1_TITLE}
                </Cite>
                .
              </Box>
              <Box variant="p">
                Eager attention, our arithmetic on the paper&apos;s GPT-layer formula sbh(34 + 5as/h){' '}
                <Cite tier={3} href={KORTHIKANTI} venue="preprint">
                  Reducing Activation Recomputation, Section 4.1
                </Cite>
                : for the 8B model, <code>5as/h = 5 x 32 x 8,192 / 4,096 = 320</code>, so a layer is
                (34 + 320) / 34 = 10.4 times the FlashAttention figure at 8,192 tokens and 3.4 times at
                2,048, where 5as/h is 80.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Close a gap with the cheapest lever first: sharding pays in communication, tensor parallelism in collectives inside every layer, recomputation in arithmetic, a smaller micro-batch in passes, and pipelining leaves the first stage's activations where they were"
          >
            The levers, and the price of each
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each lever divides one part of the budget and pays with another resource. A rank, in what
            follows, is the process that drives one accelerator.
          </Box>
          <LeverTable rows={levers} />
          <Box variant="p">
            Recomputation can raise throughput as well as cost it. Megatron-LM measured up to 33% lower
            throughput with it at small batches, and up to twice the best throughput without it once the
            freed memory bought a larger batch and a smaller pipeline bubble{' '}
            <Cite tier={3} href={PTDP} venue="SC 2021">
              Efficient Large-Scale Language Model Training on GPU Clusters, Section 5.6
            </Cite>
            . Llama 3 names the pipeline imbalance in production: the first stage uses more memory,
            because of the embedding and the warm-up micro-batches{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.2
            </Cite>
            .
          </Box>
          <MemoryBarsDiagram />
          <Box variant="small" color="text-body-secondary">
            Calculator B&apos;s totals per GPU at s = 8,192 and micro-batch 1 unless shown, with a fused
            SwiGLU (34 sbh per layer for 8B, 33.5 for 70B), mixed-precision Adam with BF16 gradients, and
            FP32 logits with their BF16 source. Formula totals before buffers and fragmentation, not
            measured.
          </Box>
          <Box variant="p">
            The 8B model needs sharding before any other lever: {fmtGB(w8one.total)} on one GPU, and{' '}
            {fmtGB(w8fsdp.total)} with FSDP over the eight H100s of one p5.48xlarge. Doubling the
            micro-batch to 2 takes that layout to {fmtGB(w8b2.total)}, and full recomputation brings it
            back to {fmtGB(w8b2full.total)} for about a third more FLOPs. For 70B over 256 GPUs, TP 8 with
            SP and ZeRO-1 over 32 data-parallel ranks lands at {fmtGB(w70tp.total)}, just over the 60 GB
            target, while plain FSDP needs full recomputation to fit at all: {fmtGB(w70fsdp.total)} without
            it, {fmtGB(w70full.total)} with it.
          </Box>
          <Box variant="p">
            The gradient dtype moves a total as far as a lever does. The same 70B layout with FP32 main
            gradients is {fmtGB(W70_FP32_GRADS.totalBytes)} per GPU, against 80 GB, and the 8B FSDP layout
            with TorchTitan&apos;s eager SwiGLU is {fmtGB(W8_EAGER.totalBytes)}, above the target (all
            figures Calculator B&apos;s).
          </Box>
          <ExpandableSection headerText="What recomputation cost on one GB10">
            <SpaceBetween size="s">
              <Box variant="p">
                The FLOP cost of full recomputation is about 33%, one more forward pass{' '}
                <Cite tier={3} href={KORTHIKANTI} venue="preprint">
                  Reducing Activation Recomputation, Section 6.2
                </Cite>
                , and it counts in HFU (hardware FLOPs utilization) but not in MFU (model FLOPs
                utilization), section 4. The papers report 30% to 40% more execution time on their own
                models and GPUs{' '}
                <Cite tier={3} href={KORTHIKANTI} venue="preprint">
                  Reducing Activation Recomputation, Section 1
                </Cite>{' '}
                <Cite tier={3} href={CHEN} venue="preprint">
                  Training Deep Nets with Sublinear Memory Cost, Section 5.4
                </Cite>
                . Our run measured less (step time and its increase for each of two runs, peak memory
                allocated):
              </Box>
              <E2Table />
              <Box variant="p">
                Llama 3.2 1B&apos;s shape (16 layers, hidden size 2,048, 128,256-entry vocabulary) from
                random weights, sequence 2,048, micro-batch 1, four micro-batches per step, AdamW over FP32
                parameters under BF16 autocast, 50 steps per mode with the first 5 excluded; two runs
                minutes apart on one GB10 with 128 GB of unified memory, PyTorch 2.15.0{' '}
                <Cite tier={0} href={E2_URL}>
                  {E2_TITLE}
                </Cite>
                .
              </Box>
              <Box variant="p">
                Two reasons the price came in under the FLOP cost, both our reading and neither isolated
                by the run: the step holds work that is not recomputed (the output head and FP32
                cross-entropy over 128,256 classes, the embedding, gradient clipping and the AdamW
                update), and at 28% to 30% of the measured matrix-multiply ceiling the step is far from
                compute-bound on this host, so a recomputed forward pass adds less time than FLOPs. On an
                H100 at 8,192 tokens the layer matrix multiplies take more of the step, which pushes the
                price toward its FLOP cost. The selective mode here bought back 68% of full
                recomputation&apos;s memory saving for 56% to 69% of its time cost, because with a
                FlashAttention-style kernel there is no score matrix left to drop, only pointwise
                intermediates.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Plan for the memory no formula counts: keep a headroom target, and read a published peak as a reminder of the gap rather than a correction factor"
          >
            Beyond the formula: buffers, fragmentation and a measured peak
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Two consumers sit outside model state and activations. Temporary buffers: a gradient
            all-reduce or norm computation fuses the gradients into one flattened buffer, which can be
            FP32 and comes to 6 GB for a 1.5-billion-parameter model. Fragmentation: ZeRO&apos;s authors
            saw out-of-memory errors with over 30% of memory still free in extreme cases{' '}
            <Cite tier={3} href={ZERO} venue="preprint">
              ZeRO, Section 3.2
            </Cite>
            .
          </Box>
          <Box variant="p">
            PyTorch&apos;s caching allocator keeps freed memory for reuse, so <code>nvidia-smi</code>{' '}
            reports it as used{' '}
            <Cite tier={1} href={PT_ALLOCATOR}>
              PyTorch v2.15.0 CUDA semantics, memory management
            </Cite>
            . It is configured through <code>PYTORCH_ALLOC_CONF</code>, with{' '}
            <code>PYTORCH_CUDA_ALLOC_CONF</code> kept as an alias for backward compatibility{' '}
            <Cite tier={1} href={PT_ALLOC_CONF}>
              PyTorch v2.15.0 CUDA semantics, PYTORCH_ALLOC_CONF
            </Cite>
            , and its <code>expandable_segments</code> option, experimental and off by default, grows one
            segment per stream to avoid the slivers that varying allocation sizes leave behind{' '}
            <Cite tier={1} href={PT_EXPANDABLE}>
              PyTorch v2.15.0 CUDA semantics, expandable_segments
            </Cite>
            .
          </Box>
          <Box variant="p">
            A published peak shows the size of the gap. TorchTitan&apos;s 70B run, TP 8 x FSDP 32 on 256
            H100s with 96 GB each, Float8 (TorchTitan&apos;s FP8 training), local batch 16 and full
            recomputation, peaked at 67.6 to 71.9 GiB, which is 72.6 to 77.2 GB, and its benchmark page
            states no sequence length{' '}
            <Cite tier={1} href={TT_BENCH}>
              TorchTitan v0.4.0 Llama 3 H100 benchmarks, Table 4
            </Cite>
            . Calculator B gives {fmtGB(TT70.totalBytes)} for the same layout, batch and recomputation in
            BF16 at 8,192 tokens. The precision differs and the length is unconfirmed, so the gap is a
            reminder that buffers and fragmentation add real memory; it is too loosely matched to serve as
            a correction factor.
          </Box>
          <Box variant="p">
            Calculator B therefore flags any total above a headroom target, 75% of the accelerator&apos;s
            memory by default (60 GB of an 80 GB H100), with &quot;estimate; confirm with a measured
            step&quot;. The 75% is our reading: no source we read states a headroom figure.
          </Box>
          <ExpandableSection headerText="A2 protocol (not yet run)">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>What it would measure.</strong> Peak memory, tokens per second, MFU against 989.5
                TFLOPS and EFA (Elastic Fabric Adapter) bytes per step for Llama 3.1 8B under TorchTitan
                v0.4.0: FSDP 8 on one node, then flat FSDP 16 and HSDP (hybrid sharded data parallel,
                shard 8 and replicate 2) on two, each with and without deferred gradient reduction, at 8
                micro-batches of 8,192 tokens (
                <Link external href={GUIDE_URL}>
                  research guide, section 5
                </Link>
                ). For this section the number is the measured peak against Calculator B&apos;s.
              </Box>
              <Box variant="p">
                <strong>On what.</strong> Two p5.48xlarge, about three hours, as one stack with its
                teardown built in.
              </Box>
              <Box variant="p">
                <strong>Prediction, our reading and not a result.</strong> Calculator B gives{' '}
                {fmtGB(w8fsdp.total)} per GPU for FSDP 8 at micro-batch 1 with a fused SwiGLU and{' '}
                {fmtGB(W8_EAGER.totalBytes)} with TorchTitan&apos;s eager one, without recomputation and with
                an upcasting loss. The measured peak should land above whichever applies, by an amount no
                source we read predicts.
              </Box>
              <Box variant="p">
                <strong>Cost.</strong> The research guide runs A2 with two other experiments in one 7-hour
                window on the same two instances: 2 x 7 x $55.04 = $771 at the On-Demand rate in us-east-1
                on 2026-10-30, or $2,292 for a one-day Capacity Block (accelerators reserved for a fixed
                date window) for two instances at $47.757 per instance-hour in US East (N. Virginia) on
                2026-10-30, a block being charged at the price quoted at purchase (
                <Link external href={GUIDE_URL}>
                  research guide, section 5
                </Link>
                ).
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Enter your model, layout and accelerator, and leave with the per-rank total, the part that dominates it, and the figure to check against your first measured step"
          >
            Calculator B: will your layout fit?
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The calculator applies the formulas above to one rank at the peak of the step: the first
            pipeline stage, or the last when its logits weigh more. On Trainium2 a rank is one logical
            NeuronCore, a quarter of a chip&apos;s memory (our arithmetic below).
          </Box>
          <MemoryCalculator />
          <ExpandableSection headerText="The formulas the calculator applies">
            <ul>
              <li>
                <code>model state per rank = N / (t x p) x (weights + gradients + optimizer bytes)</code>,
                with the optimizer divided by d from stage 1, the gradients from stage 2 and the weights at
                stage 3.
              </li>
              <li>
                <code>activations per layer = coefficient x (s / c) x b x h</code>, divided by t with SP;
                without SP, 8 sbh stays whole and the rest divides by t.
              </li>
              <li>
                <code>first stage = L / p layers x min(p, micro-batches) x (1 + (p - 1) / (p x v))</code>{' '}
                layers&apos; worth, the interleaving factor applying when v is above 1.
              </li>
              <li>
                <code>full recomputation = 2 x (s / c) x b x h per layer held, plus one layer&apos;s full set</code>
                , the 2 divided by t with SP.
              </li>
              <li>
                <code>logits on the last stage = (4 + 2) x (s / c) x b x V / t</code> bytes with an FP32
                upcast, <code>2 x (s / c) x b x V / t</code> with the fused BF16 loss.
              </li>
              <li>
                <code>fits when total &lt;= memory per rank</code>; flagged above{' '}
                <code>headroom x memory per rank</code>.
              </li>
            </ul>
          </ExpandableSection>
          <ExpandableSection headerText="Where each input comes from">
            <ul>
              <li>
                Model shapes:{' '}
                <Cite tier={3} href={LLAMA3} venue="preprint">
                  Llama 3 Herd of Models, Table 3
                </Cite>
                ; parameter counts from Meta&apos;s model metadata (8B and 70B cited above); vocabulary
                128,256 from the tokenizer code cited above.
              </li>
              <li>
                Optimizer rows and gradient dtype: the sources in the optimizer disclosure, with{' '}
                <Cite tier={3} href={ZERO} venue="preprint">
                  ZeRO, Section 3.1
                </Cite>{' '}
                for 16 bytes and{' '}
                <Cite tier={1} href={MG_DIST_OPT}>
                  Megatron Core distributed optimizer guide L14-L20
                </Cite>{' '}
                for 18.
              </li>
              <li>
                Sharding stages:{' '}
                <Cite tier={3} href={ZERO} venue="preprint">
                  ZeRO, Section 5
                </Cite>
                . TP, SP, recomputation and pipeline stages:{' '}
                <Cite tier={3} href={KORTHIKANTI} venue="preprint">
                  Reducing Activation Recomputation, Table 2 and Section 4.2.3
                </Cite>
                , adapted to Llama&apos;s layer by our count. Context parallelism:{' '}
                <Cite tier={1} href={MG_CP}>
                  Megatron Core context parallelism guide, L19
                </Cite>
                .
              </li>
              <li>
                SwiGLU coefficient:{' '}
                <Cite tier={0} href={E1_URL}>
                  {E1_TITLE}
                </Cite>
                . Logits: the Meta, Megatron Core and Transformer Engine code cited above.
              </li>
              <li>
                Memory per rank: AWS&apos;s accelerated computing instance specifications in GiB{' '}
                <Cite tier={1} href={EC2_AC} accessed={REGISTER_DATE}>
                  AWS accelerated computing instance specifications
                </Cite>
                , and NVIDIA&apos;s pages in GB for H100 and H200{' '}
                <Cite tier={1} href={H200_SPEC} kind="vendor-claim" accessed={REGISTER_DATE}>
                  NVIDIA H200 specification
                </Cite>
                . Trainium2: 96 GiB per chip{' '}
                <Cite tier={1} href={TRN2_SPEC} kind="vendor-claim" accessed={REGISTER_DATE}>
                  AWS Neuron Trainium2 architecture
                </Cite>{' '}
                , 16 chips per trn2.48xlarge{' '}
                <Cite tier={1} href={TRN2_ARCH} kind="vendor-claim" accessed={REGISTER_DATE}>
                  AWS Neuron Trn2 architecture
                </Cite>{' '}
                and 64 ranks per instance under TorchTitan{' '}
                <Cite tier={1} href={TT_NEURON} accessed={REGISTER_DATE}>
                  TorchTitan Neuron overview, Neuron SDK 2.33
                </Cite>
                , so 24 GiB per rank, our arithmetic.
              </li>
              <li>Headroom target: our reading; no source states a headroom figure.</li>
            </ul>
          </ExpandableSection>
          <Box variant="p">To turn the result into a launch decision:</Box>
          <ol>
            <li>
              Start from the 16 bytes per parameter. If model state alone does not fit, raise the sharding
              stage or degree before touching activations.
            </li>
            <li>
              Then bring activations down with the cheapest lever the layout allows: TP with SP inside one
              instance, then recomputation, then a smaller micro-batch. Check the gradient dtype and the
              loss implementation your framework actually uses, since each moves the total by gigabytes.
            </li>
            <li>Keep the total under the headroom target, and treat a flag as a reason to measure.</li>
            <li>
              Run one step and read <code>torch.cuda.max_memory_allocated</code> against the
              calculator&apos;s total, and <code>max_memory_reserved</code> minus it as the allocator&apos;s
              slack{' '}
              <Cite tier={1} href={PT_MEMORY_API} kind="code">
                PyTorch v2.15.0 torch/cuda/memory.py L543-L606
              </Cite>
              . Section 14, Set My Ranks, runs the same check for every candidate layout.
            </li>
          </ol>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
