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
import Input from '@cloudscape-design/components/input';
import Link from '@cloudscape-design/components/link';
import {
  Cite,
  arxiv,
  gh,
  ghTree,
  AXOLOTL_TAG,
  HYPERPOD_RECIPES_TAG,
  LLAMA_FACTORY_TAG,
  MEGATRON_TAG,
  NEMO_RL_TAG,
  TORCHTITAN_TAG,
} from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import {
  DENSE_MODELS,
  GB,
  INSTANCES,
  memoryFigureBytes,
  rankFacts,
  shapeOf,
  type DenseModelId,
  type MemoryFigure,
} from '../lib/presets';
import { memoryBudget, type MemoryResult, type OptimizerChoice } from '../lib/memory';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Register rows cited without re-opening the source keep the register's date. */
const REGISTER_DATE = '2026-10-30';

/** Hu et al., LoRA: Section 4.2 (practical benefits) and Section 7.1 (parameter budget). */
const LORA = arxiv('2106.09685v2');
/** Dettmers et al., QLoRA: abstract, Section 2 (LoRA, memory of PEFT) and Section 3 (NF4, double quantization). */
const QLORA = arxiv('2305.14314v1');
/** Rajbhandari et al., ZeRO, Section 3.1: 16 bytes per parameter for mixed-precision Adam. */
const ZERO = arxiv('1910.02054v3');
/** Megatron Core distributed-optimizer guide: bytes per parameter by dtype. */
const MEGATRON_DIST_OPT = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'docs/user-guide/features/dist_optimizer.md', 'L14-L20');
/** Meta's Hugging Face model metadata (exact parameter counts). */
const HF_8B = 'https://huggingface.co/api/models/meta-llama/Llama-3.1-8B/revision/d04e592bb4f6aa9cfee91e2e20afa771667e1d4b';
const HF_70B = 'https://huggingface.co/api/models/meta-llama/Llama-3.1-70B/revision/349b2ddb53ce8f2849a6c168a81980ab25258dac';
const HF_405B = 'https://huggingface.co/api/models/meta-llama/Llama-3.1-405B/revision/b906e4dc842aa489c962f9db26554dcfdde901fe';
/** NVIDIA H100 product specifications (vendor specification: 80 GB). */
const H100_SPEC = 'https://www.nvidia.com/en-us/data-center/h100/';
/** EC2 accelerated computing instance specifications (p5.48xlarge: 8 x 80 GiB). */
const EC2_AC = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';

/** Fine-tuning front ends at their pinned tags. */
const AXOLOTL_README = gh('axolotl-ai-cloud/axolotl', AXOLOTL_TAG, 'README.md', 'L100-L102');
const AXOLOTL_ND = gh('axolotl-ai-cloud/axolotl', AXOLOTL_TAG, 'README.md', 'L76');
const LLAMA_FACTORY_HW = gh('hiyouga/LLaMA-Factory', LLAMA_FACTORY_TAG, 'README.md', 'L484-L495');
const LLAMA_FACTORY_NEWS = gh('hiyouga/LLaMA-Factory', LLAMA_FACTORY_TAG, 'README.md', 'L128');
const LLAMA_FACTORY_QLORA = gh('hiyouga/LLaMA-Factory', LLAMA_FACTORY_TAG, 'README.md', 'L214');
const LLAMA_FACTORY_CLI = gh('hiyouga/LLaMA-Factory', LLAMA_FACTORY_TAG, 'README.md', 'L636');
const LLAMA_FACTORY_DS = gh('hiyouga/LLaMA-Factory', LLAMA_FACTORY_TAG, 'examples/README.md', 'L97-L101');

/** Post-training frameworks at the commits the RL dive's register pins. */
const VERL_SHA = '1876b06d0a3e4e71e06230be10af14492ca8a75b'; // v0.9.1
const OPENRLHF_SHA = '17fd4a79cc87dfb2f6185ffac634066525bcd917'; // v0.11.2
const TRL_SHA = '1b5c75ed94b7387f42532adb090c935166d4878d'; // v1.16.0
const SLIME_SHA = '0b0c277d5b4cc66efc3b6db269e2e5184e8f3b1e'; // v0.4.0
const VERL_ACTORS = ghTree('volcengine/verl', VERL_SHA, 'verl/trainer/config/actor');
const VERL_ROLLOUT = gh('volcengine/verl', VERL_SHA, 'verl/trainer/config/rollout/rollout.yaml', 'L4-L8');
const OPENRLHF_STRATEGY = gh('OpenRLHF/OpenRLHF', OPENRLHF_SHA, 'openrlhf/utils/utils.py', 'L25-L37');
const OPENRLHF_VLLM = gh('OpenRLHF/OpenRLHF', OPENRLHF_SHA, 'openrlhf/cli/train_ppo_ray.py', 'L52-L66');
const TRL_DEPS = gh('huggingface/trl', TRL_SHA, 'pyproject.toml', 'L29-L42');
const TRL_VLLM = gh('huggingface/trl', TRL_SHA, 'pyproject.toml', 'L89-L93');
const SLIME_TRAIN = gh('THUDM/slime', SLIME_SHA, 'train.py', 'L47-L90');
const SLIME_BACKENDS = ghTree('THUDM/slime', SLIME_SHA, 'slime/backends');
const NEMO_RL_README = gh('NVIDIA-NeMo/RL', NEMO_RL_TAG, 'README.md', 'L84-L96');
const TORCHTITAN_RELEASE = 'https://github.com/pytorch/torchtitan/releases/tag/v0.4.0';
const TORCHTITAN_RL_README = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'README.md', 'L153-L157');

/** AWS: the HyperPod recipes and the checkpointless recipe table. */
const HYPERPOD_RECIPES_DOC = 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-recipes.html';
const HYPERPOD_TRAINING_TREE = ghTree(
  'aws/sagemaker-hyperpod-recipes',
  HYPERPOD_RECIPES_TAG,
  'hyperpod_recipes/recipes_src/training',
);
const HYPERPOD_V200 = 'https://github.com/aws/sagemaker-hyperpod-recipes/releases/tag/v2.0.0';
const CHECKPOINTLESS_DOC = 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless.html';

/* ------------------------------------------------------------------------ */
/* Calculator B's frozen-base rows                                          */
/* ------------------------------------------------------------------------ */

/** H100 memory as its two sources print it: 80 GiB (EC2 page) and 80 GB (NVIDIA). */
const H100_FIGURES: readonly MemoryFigure[] = rankFacts(INSTANCES['p5.48xlarge']).hbmPerRank;

function h100Figure(unit: 'GB' | 'GiB'): MemoryFigure {
  const f = H100_FIGURES.find((x) => x.unit === unit);
  if (!f) throw new Error(`FineTuning: the p5.48xlarge preset carries no H100 figure in ${unit}`);
  return f;
}

const H100_80GB = h100Figure('GB');
const H100_80GIB = h100Figure('GiB');

/**
 * Model state for a method, from Calculator B. Only `modelState` is read: the sequence length,
 * micro-batch and logits mode fill the input's activation fields and do not change model state.
 */
function modelStateFor(model: DenseModelId, optimizer: OptimizerChoice): MemoryResult['modelState'] {
  return memoryBudget({
    model: shapeOf(DENSE_MODELS[model]),
    optimizer,
    zero: { stage: 0, degree: 1 },
    recompute: 'none',
    microBatch: 1,
    sequenceLength: 8_192,
    logits: 'fp32Upcast',
    hbmPerRank: H100_FIGURES,
  }).modelState;
}

/** GPUs whose memory holds this many bytes when the model state is divided evenly over them. */
function gpusFor(bytes: number, figure: MemoryFigure): number {
  return Math.ceil(bytes / memoryFigureBytes(figure));
}

/** How many GPUs' worth of memory the bytes are, before rounding up. */
function gpuRatio(bytes: number, figure: MemoryFigure, digits: number): string {
  return (bytes / memoryFigureBytes(figure)).toFixed(digits);
}

function fmtGB(bytes: number): string {
  return (bytes / GB).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

const FULL16: OptimizerChoice = { row: 'adamMixed', gradientDtype: 'bf16' };
const FULL18: OptimizerChoice = { row: 'adamMixed', gradientDtype: 'fp32' };

/** The 70B figures the prose and the diagram print (adapters not counted). */
const S70 = {
  full16: modelStateFor('llama-3.1-70b', FULL16),
  full18: modelStateFor('llama-3.1-70b', FULL18),
  lora: modelStateFor('llama-3.1-70b', { frozenBase: 'lora', adapterFraction: 0 }),
  qlora: modelStateFor('llama-3.1-70b', { frozenBase: 'qlora4bit', adapterFraction: 0 }),
};

const T70 = {
  full16: fmtGB(S70.full16.totalBytes),
  full18: fmtGB(S70.full18.totalBytes),
  lora: fmtGB(S70.lora.totalBytes),
  qlora: fmtGB(S70.qlora.totalBytes),
  weights: fmtGB(S70.full16.weightsBytes),
  optimizer: fmtGB(S70.full16.optimizerBytes),
  gpuFull16: gpusFor(S70.full16.totalBytes, H100_80GB),
  gpuFull18: gpusFor(S70.full18.totalBytes, H100_80GB),
  gpuLora: gpusFor(S70.lora.totalBytes, H100_80GB),
  gpuQlora: gpusFor(S70.qlora.totalBytes, H100_80GB),
  gpuFull16Gib: gpusFor(S70.full16.totalBytes, H100_80GIB),
  gpuFull18Gib: gpusFor(S70.full18.totalBytes, H100_80GIB),
  /** 4-bit weights plus QLoRA's double-quantized constants, 0.127 bits per parameter (QLoRA Section 3). */
  qloraWithConstants: fmtGB((DENSE_MODELS['llama-3.1-70b'].totalParameters.value * (4 + 0.127)) / 8),
  /** Half of the 4-bit base on each of two GPUs (LLaMA-Factory's FSDP plus QLoRA mode). */
  qloraHalf: fmtGB(S70.qlora.totalBytes / 2),
  /** 80 GiB in GB. */
  gib80: fmtGB(memoryFigureBytes(H100_80GIB)),
  ratios80: [S70.full16, S70.full18, S70.lora, S70.qlora].map((m, i) => gpuRatio(m.totalBytes, H100_80GB, i < 2 ? 1 : 2)),
  ratios80Gib: [S70.full16, S70.full18, S70.lora, S70.qlora].map((m, i) =>
    gpuRatio(m.totalBytes, H100_80GIB, i < 2 ? 1 : 2),
  ),
};

/* ------------------------------------------------------------------------ */
/* Diagram: model state of Llama 3.1 70B by method, against 80 GB cells     */
/* ------------------------------------------------------------------------ */

interface BarSegment {
  gb: number;
  fill: string;
  stroke: string;
  dashed?: boolean;
  wide: string;
  narrow: string;
}

interface BarRow {
  key: string;
  wide1: string;
  wide2: string;
  narrow1: string;
  narrow2: string;
  segments: BarSegment[];
  noteWide?: string;
  noteNarrow?: string;
}

const BLUE = { fill: '#f2f8fd', stroke: '#0972d3' };
const TEAL = { fill: '#e6f4f2', stroke: '#1f7a70' };
const AMBER = { fill: '#fbf3d5', stroke: '#8b6c00' };
const PURPLE = { fill: '#efe7fb', stroke: '#6f4cc4' };

function FineTuneBarsDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref);

  const g = (bytes: number) => bytes / GB;
  const extraGradients = g(S70.full18.gradientsBytes - S70.full16.gradientsBytes);
  const rows: BarRow[] = [
    {
      key: 'full',
      wide1: `Full fine-tuning: ${T70.full16} GB of model state, ${T70.gpuFull16} H100 at 80 GB`,
      wide2: '2 bytes of BF16 weights, 2 of BF16 gradients and 12 of optimizer state per parameter, mixed-precision Adam',
      narrow1: `Full fine-tuning: ${T70.full16} GB, ${T70.gpuFull16} H100`,
      narrow2: 'BF16 weights 2 + gradients 2 + optimizer 12 bytes',
      segments: [
        { gb: g(S70.full16.weightsBytes), ...BLUE, wide: 'weights 2', narrow: '2' },
        { gb: g(S70.full16.gradientsBytes), ...TEAL, wide: 'gradients 2', narrow: '2' },
        {
          gb: g(S70.full16.optimizerBytes),
          ...AMBER,
          wide: 'optimizer state 12: FP32 master copy and two Adam moments',
          narrow: 'optimizer state 12',
        },
        { gb: extraGradients, fill: '#ffffff', stroke: TEAL.stroke, dashed: true, wide: '+2 FP32', narrow: '+2' },
      ],
      noteWide: `Dashed: 2 more bytes when gradients are kept in FP32, Megatron Core's 18-byte basis: ${T70.full18} GB, ${T70.gpuFull18} H100`,
      noteNarrow: `dashed: FP32 gradients, 18 bytes: ${T70.full18} GB, ${T70.gpuFull18} H100`,
    },
    {
      key: 'lora',
      wide1: `LoRA: ${T70.lora} GB, ${T70.gpuLora} H100`,
      wide2: 'Frozen BF16 weights at 2 bytes per parameter; gradients and optimizer state only for the small adapters, not drawn',
      narrow1: `LoRA: ${T70.lora} GB, ${T70.gpuLora} H100`,
      narrow2: 'BF16 weights, 2 bytes; adapters not drawn',
      segments: [{ gb: g(S70.lora.weightsBytes), ...BLUE, wide: 'weights 2', narrow: '2' }],
    },
    {
      key: 'qlora',
      wide1: `QLoRA: ${T70.qlora} GB, ${T70.gpuQlora} H100`,
      wide2: 'Frozen 4-bit NF4 weights at 0.5 bytes per parameter, plus the small adapters, not drawn',
      narrow1: `QLoRA: ${T70.qlora} GB, ${T70.gpuQlora} H100`,
      narrow2: '4-bit NF4 weights, 0.5 bytes; adapters not drawn',
      segments: [{ gb: g(S70.qlora.weightsBytes), ...PURPLE, wide: '', narrow: '' }],
    },
  ];

  const cellGB = g(memoryFigureBytes(H100_80GB));
  const cells = Math.ceil(g(S70.full18.totalBytes) / cellGB);
  const W = narrow ? 360 : 900;
  const x0 = narrow ? 12 : 24;
  const x1 = W - x0;
  const cellW = (x1 - x0) / cells;
  const xOf = (gbValue: number) => x0 + (gbValue / cellGB) * cellW;

  const ink = '#16191f';
  const muted = '#414d5c';
  const font = 'sans-serif';
  const trackH = 30;
  const rowTops: number[] = [];
  let y = narrow ? 56 : 62;
  for (const r of rows) {
    rowTops.push(y);
    y += 40 + trackH + (r.noteWide ? 20 : 0) + 22;
  }
  const H = y - 6;

  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="fine-tuning-bars-title"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <title id="fine-tuning-bars-title">
          {`Model state of Llama 3.1 70B before activations, by fine-tuning method, drawn to scale against a row of 80 GB H100s. Full fine-tuning with mixed-precision Adam holds ${T70.full16} GB: ${T70.weights} GB of BF16 weights, ${T70.weights} GB of BF16 gradients and ${T70.optimizer} GB of optimizer state, which needs ${T70.gpuFull16} H100; keeping gradients in FP32 adds ${T70.weights} GB, for ${T70.full18} GB and ${T70.gpuFull18} H100. LoRA keeps only the frozen BF16 weights, ${T70.lora} GB on ${T70.gpuLora} H100, and QLoRA the frozen 4-bit weights, ${T70.qlora} GB on ${T70.gpuQlora} H100; their small adapters are not drawn.`}
        </title>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />

        <text x={x0} y={narrow ? 22 : 26} fontFamily={font} fontSize={13} fontWeight={600} fill={ink}>
          {narrow ? 'Llama 3.1 70B model state by method' : 'Llama 3.1 70B: model state before activations, by fine-tuning method'}
        </text>
        <text x={x0} y={narrow ? 38 : 44} fontFamily={font} fontSize={11} fill={muted}>
          {narrow
            ? 'before activations; each cell is one 80 GB H100'
            : "70.55 billion parameters times bytes per parameter; GB = 10^9 bytes; each cell is one H100 at NVIDIA's 80 GB"}
        </text>

        {rows.map((r, i) => {
          const top = rowTops[i];
          const trackY = top + 40;
          let acc = 0;
          return (
            <g key={r.key}>
              <text x={x0} y={top + 14} fontFamily={font} fontSize={13} fontWeight={600} fill={ink}>
                {narrow ? r.narrow1 : r.wide1}
              </text>
              <text x={x0} y={top + 30} fontFamily={font} fontSize={11} fill={muted}>
                {narrow ? r.narrow2 : r.wide2}
              </text>
              <rect x={x0} y={trackY} width={x1 - x0} height={trackH} fill="#ffffff" stroke="#879596" strokeWidth={1} />
              {Array.from({ length: cells - 1 }, (_, c) => (
                <line
                  key={c}
                  x1={x0 + (c + 1) * cellW}
                  y1={trackY}
                  x2={x0 + (c + 1) * cellW}
                  y2={trackY + trackH}
                  stroke="#d1d5db"
                  strokeWidth={1}
                />
              ))}
              {r.segments.map((s) => {
                const sx = xOf(acc);
                acc += s.gb;
                const sw = xOf(acc) - sx;
                const label = narrow ? s.narrow : s.wide;
                return (
                  <g key={`${r.key}-${s.wide}-${s.gb}`}>
                    <rect
                      x={sx}
                      y={trackY}
                      width={sw}
                      height={trackH}
                      fill={s.fill}
                      stroke={s.stroke}
                      strokeWidth={1.5}
                      strokeDasharray={s.dashed ? '5 3' : undefined}
                    />
                    {label && (
                      <text
                        x={sx + sw / 2}
                        y={trackY + trackH / 2 + 4}
                        fontFamily={font}
                        fontSize={11}
                        fontWeight={600}
                        fill={ink}
                        textAnchor="middle"
                      >
                        {label}
                      </text>
                    )}
                  </g>
                );
              })}
              {r.noteWide && (
                <text x={x0} y={trackY + trackH + 16} fontFamily={font} fontSize={11} fill={muted}>
                  {narrow ? r.noteNarrow : r.noteWide}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Tables                                                                   */
/* ------------------------------------------------------------------------ */

const cell: CSSProperties = {
  padding: '6px 8px',
  borderBottom: '1px solid #e9ebed',
  textAlign: 'left',
  verticalAlign: 'top',
};
const headCell: CSSProperties = { ...cell, fontWeight: 700, borderBottom: '2px solid #d1d5db' };
const numCell: CSSProperties = { ...cell, textAlign: 'right' };

interface EngineRow {
  framework: string;
  trains: ReactNode;
  generates: ReactNode;
}

const ENGINE_ROWS: EngineRow[] = [
  {
    framework: 'verl v0.9.1',
    trains: (
      <>
        FSDP, Megatron, VeOmni or TorchTitan, chosen per actor by <code>strategy</code>
      </>
    ),
    generates: (
      <>
        <code>hf</code>, <code>vllm</code>, <code>sglang</code> or <code>trtllm</code>
      </>
    ),
  },
  { framework: 'OpenRLHF v0.11.2', trains: 'DeepSpeed, at the configured ZeRO stage', generates: 'vLLM engines' },
  { framework: 'TRL v1.16.0', trains: 'transformers and Accelerate', generates: 'vLLM, an optional extra' },
  { framework: 'slime v0.4.0', trains: 'Megatron', generates: 'SGLang' },
  {
    framework: 'NeMo RL v0.7.0',
    trains: 'DTensor (PyTorch-native) or Megatron through Megatron Bridge',
    generates: "vLLM or Megatron's own inference backend",
  },
  {
    framework: 'TorchTitan v0.4.0 (TitanRL)',
    trains: "TorchTitan's own training engine",
    generates: 'vLLM, from the same model definitions',
  },
];

function EngineTable() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref);
  if (narrow) {
    return (
      <div ref={ref}>
        <SpaceBetween size="s">
          {ENGINE_ROWS.map((r) => (
            <div key={r.framework} style={{ borderBottom: '1px solid #e9ebed', paddingBottom: 8 }}>
              <Box variant="p">
                <strong>{r.framework}</strong>
              </Box>
              <Box variant="p">
                <strong>Trains on:</strong> {r.trains}
              </Box>
              <Box variant="p">
                <strong>Generates with:</strong> {r.generates}
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
            <th style={headCell}>Framework, pinned</th>
            <th style={headCell}>Training engine</th>
            <th style={headCell}>Rollout engine</th>
          </tr>
        </thead>
        <tbody>
          {ENGINE_ROWS.map((r) => (
            <tr key={r.framework}>
              <td style={cell}>{r.framework}</td>
              <td style={cell}>{r.trains}</td>
              <td style={cell}>{r.generates}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Widget: the frozen-base rows of Calculator B for any preset model        */
/* ------------------------------------------------------------------------ */

const SIZER_MODELS: DenseModelId[] = ['llama-3.1-8b', 'llama-3.1-70b', 'llama-3.1-405b'];

function modelLabel(id: DenseModelId): string {
  const p = DENSE_MODELS[id];
  return `${p.name}, ${(p.totalParameters.value / 1e9).toFixed(2)} billion parameters`;
}

type ShareOutcome = { ok: true; fraction: number } | { ok: false; message: string };

/** Reads the adapter share (percent of the base parameters) into Calculator B's fraction. */
function parseShare(text: string): ShareOutcome {
  if (!/^\s*\d+(\.\d+)?\s*$/.test(text)) return { ok: false, message: 'Enter a percentage from 0 to 100' };
  const pct = Number(text);
  if (!Number.isFinite(pct) || pct < 0 || pct > 100) return { ok: false, message: 'Enter a percentage from 0 to 100' };
  return { ok: true, fraction: pct / 100 };
}

interface SizerRow {
  key: string;
  method: string;
  detail: string;
  bytes: number;
}

function sizerRows(model: DenseModelId, adapterFraction: number): SizerRow[] {
  const full16 = modelStateFor(model, FULL16);
  const full18 = modelStateFor(model, FULL18);
  const lora = modelStateFor(model, { frozenBase: 'lora', adapterFraction });
  const loraBase = modelStateFor(model, { frozenBase: 'lora', adapterFraction: 0 });
  const qlora = modelStateFor(model, { frozenBase: 'qlora4bit', adapterFraction });
  const qloraBase = modelStateFor(model, { frozenBase: 'qlora4bit', adapterFraction: 0 });
  const adapters = (withAdapters: number, base: number) =>
    `16 per adapter parameter: base ${fmtGB(base)} GB + adapters ${fmtGB(withAdapters - base)} GB`;
  return [
    { key: 'full16', method: 'Full fine-tuning, 16 bytes', detail: 'BF16 gradients', bytes: full16.totalBytes },
    {
      key: 'full18',
      method: 'Full fine-tuning, 18 bytes',
      detail: "FP32 main gradients, Megatron Core's basis",
      bytes: full18.totalBytes,
    },
    {
      key: 'lora',
      method: 'LoRA, 2 bytes per frozen parameter',
      detail: adapters(lora.totalBytes, loraBase.totalBytes),
      bytes: lora.totalBytes,
    },
    {
      key: 'qlora',
      method: 'QLoRA, 0.5 bytes per frozen parameter',
      detail: `4-bit weights only; ${adapters(qlora.totalBytes, qloraBase.totalBytes)}`,
      bytes: qlora.totalBytes,
    },
  ];
}

function FineTuneSizer() {
  const [model, setModel] = useState<DenseModelId>('llama-3.1-70b');
  const [share, setShare] = useState('0.2');
  const parsed = useMemo(() => parseShare(share), [share]);
  const rows = useMemo(() => (parsed.ok ? sizerRows(model, parsed.fraction) : []), [model, parsed]);
  const options = SIZER_MODELS.map((id) => ({ value: id, label: modelLabel(id) }));
  const selected = options.find((o) => o.value === model) ?? options[1];

  return (
    <SpaceBetween size="m">
      <ColumnLayout columns={2}>
        <FormField label="Model">
          <Select
            selectedOption={selected}
            options={options}
            onChange={({ detail }) => setModel(detail.selectedOption.value as DenseModelId)}
          />
        </FormField>
        <FormField
          label="Adapter parameters, percent of the base"
          description="0.2% is the share QLoRA's authors call commonly used; estimate; confirm with a measured step"
          errorText={parsed.ok ? undefined : parsed.message}
        >
          <Input type="number" inputMode="decimal" value={share} onChange={({ detail }) => setShare(detail.value)} />
        </FormField>
      </ColumnLayout>
      {parsed.ok && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={headCell}>Method, bytes per parameter</th>
                <th style={{ ...headCell, textAlign: 'right' }}>Model state, GB</th>
                <th style={{ ...headCell, textAlign: 'right' }}>H100s at 80 GB</th>
                <th style={{ ...headCell, textAlign: 'right' }}>H100s at 80 GiB</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key}>
                  <td style={cell}>
                    {r.method}
                    <Box variant="small" display="block" color="text-body-secondary">
                      {r.detail}
                    </Box>
                  </td>
                  <td style={numCell}>{fmtGB(r.bytes)}</td>
                  <td style={numCell}>{gpusFor(r.bytes, H100_80GB)}</td>
                  <td style={numCell}>{gpusFor(r.bytes, H100_80GIB)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Box variant="small" color="text-body-secondary">
        Model state only, divided evenly over the GPUs counted, as FSDP or ZeRO stage 3 divides it,
        before activations, temporary buffers and headroom. GB is 10^9 bytes and GiB 2^30 bytes: NVIDIA
        lists the H100 at 80 GB{' '}
        <Cite tier={1} href={H100_SPEC} kind="vendor-claim" accessed={REGISTER_DATE}>
          NVIDIA H100 specification
        </Cite>
        , the EC2 page at 80 GiB, {T70.gib80} GB{' '}
        <Cite tier={1} href={EC2_AC} accessed={REGISTER_DATE}>
          AWS accelerated computing instance specifications
        </Cite>
        . Adapters train with mixed-precision Adam at 16 bytes per adapter parameter, Calculator B&apos;s
        assumption; the 0.2% default comes from{' '}
        <Cite tier={3} href={QLORA} venue="NeurIPS 2023">
          QLoRA, Section 2
        </Cite>
        . Parameter counts from Meta&apos;s model metadata for{' '}
        <Cite tier={1} href={HF_8B} accessed={REGISTER_DATE}>
          8B
        </Cite>
        ,{' '}
        <Cite tier={1} href={HF_70B}>
          70B
        </Cite>{' '}
        and{' '}
        <Cite tier={1} href={HF_405B} accessed={REGISTER_DATE}>
          405B
        </Cite>
        . Estimate; confirm with a measured step.
      </Box>
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function FineTuning() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={`Size a fine-tuning or RL (reinforcement learning) run's memory and pick the framework by the training engine it reuses: freezing Llama 3.1 70B's weights and storing them in 4 bits takes its model state from ${T70.gpuFull16} H100 at 80 GB each to one (papers, AWS documentation, and framework code and docs at Megatron Core core_v0.20.0, TorchTitan v0.4.0, Axolotl v0.21.1, LLaMA-Factory v0.9.5, NeMo RL v0.7.0, verl v0.9.1, OpenRLHF v0.11.2, TRL (Transformers Reinforcement Learning) v1.16.0 and slime v0.4.0, read 2026-10-31)`}
          >
            16. Fine-Tuning &amp; Post-Training Runs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Fine-tuning continues to train a model that is already pre-trained, on far fewer tokens, to
            fit it to a task, a domain or a style of answer. Post-training covers the stages after
            pre-training: supervised fine-tuning on example answers, preference training on ranked
            answers, and RL, which trains on answers the model generates and a reward scores. These
            runs execute the same training step as pre-training on the same sharding engines. What
            changes is the memory budget, because most of the weights can stay frozen: LoRA (low-rank
            adaptation: small trainable matrices beside frozen weights) trains only small added
            matrices, and QLoRA (LoRA over a base quantised to 4 bits) also shrinks the frozen weights.
          </Box>
          <Box variant="p">
            The challenge is to size the run from that one change, then to choose a framework by the
            engine underneath it, since the engine decides the run&apos;s parallelism, checkpoints and
            precision. The algorithms belong to the{' '}
            <Link href="../rl-agentic-loops/">Fine-Tuning, RL and Agentic Learning Loops dive</Link>; this section
            is the systems side.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Predict a fine-tuning run's model state from one number per method, 16 bytes per parameter for full fine-tuning, about 2 with LoRA and about 0.5 with QLoRA: for Llama 3.1 70B that is ${T70.gpuFull16} H100 down to one`}
          >
            What a frozen base leaves in memory
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Model state is what a training step keeps from one step to the next: the weights, their
            gradients and the optimizer state. With mixed-precision Adam it is 16 bytes per parameter:
            2 for 16-bit weights, 2 for 16-bit gradients, and 12 for the optimizer&apos;s FP32 (32-bit
            floating-point) master copy of the weights and Adam&apos;s two moments, the running
            averages of each gradient and of its square{' '}
            <Cite tier={3} href={ZERO} venue="SC 2020" accessed={REGISTER_DATE}>
              ZeRO (Zero Redundancy Optimizer), Section 3.1
            </Cite>
            . A framework that keeps FP32 main gradients pays 18, Megatron Core&apos;s figure for BF16
            (bfloat16) parameters with FP32 gradients{' '}
            <Cite tier={1} href={MEGATRON_DIST_OPT}>
              Megatron Core distributed optimizer guide L14-L20
            </Cite>
            .
          </Box>
          <Box variant="p">
            A frozen parameter is never updated, so it needs no optimizer state and no gradient of its
            own, and only its weight stays in memory. LoRA&apos;s authors put its memory saving down to
            storing no optimizer state for the frozen parameters, and a 25% training speedup on GPT-3
            175B to computing no gradient for the vast majority of them{' '}
            <Cite tier={3} href={LORA} venue="preprint">
              LoRA, Section 4.2
            </Cite>
            .
          </Box>
          <ul>
            <li>
              <strong>LoRA</strong> adds to each adapted projection the scaled product of two thin
              matrices, so a projection <code>XW</code> becomes <code>XW + sXL1L2</code> with only{' '}
              <code>L1</code> and <code>L2</code> trained{' '}
              <Cite tier={3} href={QLORA} venue="NeurIPS 2023">
                QLoRA, Section 2, Equation 3
              </Cite>
              . For a large Transformer trained with Adam its authors report up to two thirds less
              training memory, and for GPT-3 175B a fall from 1.2 TB to 350 GB{' '}
              <Cite tier={3} href={LORA} venue="preprint">
                LoRA, Section 4.2
              </Cite>
              . 350 GB is 2 bytes for each of 175 billion parameters: the frozen 16-bit weights and
              little else, by our arithmetic from the paper&apos;s figures.
            </li>
            <li>
              <strong>QLoRA</strong> stores the frozen base in 4-bit NormalFloat (NF4), a 4-bit data
              type its authors built for normally distributed weights; quantises each block&apos;s
              scaling constant a second time (double quantization); and pages optimizer state out to
              CPU memory when the GPU runs short (paged optimizers){' '}
              <Cite tier={3} href={QLORA} venue="NeurIPS 2023">
                QLoRA, Section 3
              </Cite>
              . Gradients flow through the frozen 4-bit base into LoRA adapters, and its authors
              fine-tuned a 65B model on a single 48 GB GPU while reporting full 16-bit fine-tuning task
              performance{' '}
              <Cite tier={3} href={QLORA} venue="NeurIPS 2023">
                QLoRA, abstract
              </Cite>
              . Four bits is half a byte per parameter.
            </li>
          </ul>
          <Box variant="p">
            For Llama 3.1 70B, with 70,553,706,496 parameters{' '}
            <Cite tier={1} href={HF_70B}>
              Meta&apos;s Llama 3.1 70B model metadata
            </Cite>
            , those per-parameter figures give the model state below, counted against H100s at the 80
            GB NVIDIA lists{' '}
            <Cite tier={1} href={H100_SPEC} kind="vendor-claim" accessed={REGISTER_DATE}>
              NVIDIA H100 specification
            </Cite>
            .
          </Box>
          <FineTuneBarsDiagram />
          <Box variant="small" color="text-body-secondary">
            Bar lengths to scale, from Calculator B&apos;s rows for Llama 3.1 70B: mixed-precision Adam
            for full fine-tuning, 2 and 0.5 bytes per frozen parameter for LoRA and QLoRA, adapters not
            drawn. GB is 10^9 bytes. Each cell is one H100 at 80 GB; at the 80 GiB per GPU ({T70.gib80} GB)
            that the EC2 (Elastic Compute Cloud) instance page lists, full fine-tuning needs{' '}
            {T70.gpuFull16Gib} H100 at 16 bytes and {T70.gpuFull18Gib} at 18. Model state only:
            activations, buffers and headroom come on top.
          </Box>
          <Box variant="p">
            Full fine-tuning of the 70B model therefore holds {T70.full16} GB of model state at 16
            bytes per parameter, {T70.gpuFull16} H100 at 80 GB each before a single activation is
            stored. LoRA holds {T70.lora} GB, {T70.gpuLora} H100, and QLoRA {T70.qlora} GB, one H100.
            The QLoRA figure counts the 4-bit weights only: after double quantization the scaling
            constants add 0.127 bits per parameter{' '}
            <Cite tier={3} href={QLORA} venue="NeurIPS 2023">
              QLoRA, Section 3
            </Cite>
            , which makes {T70.qloraWithConstants} GB by our arithmetic, still one GPU.
          </Box>
          <Box variant="p">
            Freezing shrinks the model state, and once the base is small the activations, the tensors
            the forward pass saves for the backward pass, become the part to plan. In QLoRA&apos;s
            measurement on a 7B model at batch size 1, with adapters at &quot;commonly used 0.2%&quot;
            of the weights, the &quot;LoRA input gradients&quot; took 567 MB against 26 MB for the
            adapters themselves, and about 18 MB per sequence with gradient checkpointing, while the
            4-bit base took 5,048 MB{' '}
            <Cite tier={3} href={QLORA} venue="NeurIPS 2023">
              QLoRA, Section 2
            </Cite>
            . Gradient checkpointing is the recomputation of section 5, The Memory Budget: re-running
            each layer&apos;s forward pass during the backward pass instead of storing its activations.
          </Box>
          <ExpandableSection headerText="How the 70B figures are counted, and a published estimate to check them against">
            <SpaceBetween size="s">
              <Box variant="p">
                <code>
                  70,553,706,496 x 16 = {T70.full16} GB, of which 2 x N = {T70.weights} GB weights, 2 x N ={' '}
                  {T70.weights} GB gradients, 12 x N = {T70.optimizer} GB optimizer state
                </code>
                . At 18 bytes, {T70.full18} GB; at 2 bytes, {T70.lora} GB; at 0.5 bytes, {T70.qlora} GB;
                at 4.127 bits, {T70.qloraWithConstants} GB. Against 80 GB per H100 these are{' '}
                {T70.ratios80.join(', ')} GPUs, so {T70.gpuFull16}, {T70.gpuFull18}, {T70.gpuLora} and{' '}
                {T70.gpuQlora}; against 80 GiB, {T70.gib80} GB, they are {T70.ratios80Gib.join(', ')}, so{' '}
                {T70.gpuFull16Gib}, {T70.gpuFull18Gib},{' '}
                {T70.gpuLora} and {T70.gpuQlora}. Our arithmetic; every byte total in this dive is in GB
                of 10^9 bytes, and the GPU counts change with the unit.
              </Box>
              <Box variant="p">
                LLaMA-Factory&apos;s hardware table, marked &quot;estimated&quot;, prints 1,200 GB for
                full fine-tuning of a 70B model in BF16 or FP16 (the older 16-bit floating-point format), 160 GB for the row that
                groups LoRA with Freeze, GaLore, APOLLO, BAdam and OFT, and 48 GB for 4-bit QLoRA{' '}
                <Cite tier={1} href={LLAMA_FACTORY_HW}>
                  LLaMA-Factory v0.9.5 README L484-L495
                </Cite>
                . Its own per-parameter column, 18x, 2x and x/2 GB for x billion parameters, gives
                1,260, 140 and 35 GB, so the printed cells are rounded or padded estimates. Read
                against the arithmetic above, the full figure sits between the 16- and 18-byte bases
                and the LoRA and QLoRA figures sit above the weights alone (our reading).
              </Box>
              <Box variant="p">
                The adapters are small at the LoRA paper&apos;s own setting: a budget of 18M trainable
                parameters on GPT-3 175B, &quot;roughly 35MB if stored in FP16&quot;, at rank 4 on two
                attention matrices{' '}
                <Cite tier={3} href={LORA} venue="preprint">
                  LoRA, Section 7.1
                </Cite>
                . That is 0.01% of the model; at 16 bytes per adapter parameter for mixed-precision
                Adam, about 0.29 GB of model state, by our arithmetic. Calculator B charges adapters
                those 16 bytes.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read a fine-tuning framework's sharding, checkpoints and precision from the engine it runs on, so you know which version decides them"
          >
            Fine-tuning frameworks configure an engine
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 15, The Framework Map, sorts training software into a few engines that implement
            parallelism, and front ends that configure one of them. The engines are PyTorch&apos;s
            FSDP2 and DTensor (PyTorch&apos;s distributed tensor), NVIDIA&apos;s Megatron Core, and
            DeepSpeed. FSDP (Fully Sharded Data Parallel) splits model state across the data-parallel
            ranks, one process per GPU, instead of copying it to each (section 8, Data Parallelism
            &amp; Sharding); FSDP2 is PyTorch&apos;s second implementation of it, and DeepSpeed&apos;s
            ZeRO stages do the same split. The configuration-file fine-tuning frameworks are front
            ends of this kind:
          </Box>
          <ul>
            <li>
              <strong>Axolotl v0.21.1</strong> configures a whole pipeline from one YAML file; its
              methods include full fine-tuning, LoRA, QLoRA, preference tuning and RL, and it trains
              across GPUs on FSDP2 or DeepSpeed{' '}
              <Cite tier={1} href={AXOLOTL_README}>
                Axolotl v0.21.1 README L100-L102
              </Cite>
              . It composes context, tensor and fully sharded data parallelism inside a node and across
              nodes{' '}
              <Cite tier={1} href={AXOLOTL_ND}>
                Axolotl v0.21.1 README L76
              </Cite>
              .
            </li>
            <li>
              <strong>LLaMA-Factory v0.9.5</strong> runs YAML recipes through{' '}
              <code>llamafactory-cli train</code>{' '}
              <Cite tier={1} href={LLAMA_FACTORY_CLI}>
                LLaMA-Factory v0.9.5 README L636
              </Cite>{' '}
              on DeepSpeed{' '}
              <Cite tier={1} href={LLAMA_FACTORY_DS}>
                LLaMA-Factory v0.9.5 examples/README.md L97-L101
              </Cite>{' '}
              or FSDP, including an FSDP plus QLoRA mode that &quot;fine-tunes a 70B model
              on 2x24GB GPUs&quot;{' '}
              <Cite tier={1} href={LLAMA_FACTORY_QLORA}>
                LLaMA-Factory v0.9.5 README L214
              </Cite>
              , and since 2025-10-26 on a Megatron Core backend through Alibaba&apos;s{' '}
              <code>mcore_adapter</code>{' '}
              <Cite tier={1} href={LLAMA_FACTORY_NEWS}>
                LLaMA-Factory v0.9.5 README L128
              </Cite>
              .
            </li>
          </ul>
          <Box variant="p">
            The two-GPU claim fits the bars above: {T70.qlora} GB of 4-bit weights split over two cards
            is about {T70.qloraHalf} GB on each 24 GB GPU before activations, by our arithmetic. On our
            reading of these sources, that is the model for every front end: its memory and scaling
            behaviour is its engine&apos;s, configured, and the version that decides a default is the
            engine&apos;s.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Treat an RL run as a training engine plus a rollout engine, and read its sharding, checkpoints and precision from the training side"
          >
            RL is an inference job inside a training job
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An RL step generates answers with the current model, trains on the scored answers, and
            copies the new weights back to the generator; slime&apos;s top-level training loop is that
            sequence{' '}
            <Cite tier={1} href={SLIME_TRAIN} kind="code">
              slime v0.4.0 train.py L47-L90
            </Cite>
            . The generation, called the rollout, is inference, so a post-training framework pairs a
            rollout engine with a training engine; an RL run, and any preference run that generates its
            own answers, is an inference job inside a training job (our reading). The RL dive covers the
            algorithms and the step as a system, including where each engine runs and how weights move
            between them, in{' '}
            <Link href="../rl-agentic-loops/">
              Fine-Tuning, RL and Agentic Learning Loops dive, section 22: An RL Step Is an Inference
              Job Inside a Training Job
            </Link>
            . What this dive adds is which training engine each framework reuses:
          </Box>
          <EngineTable />
          <Box variant="p">
            Every post-training framework read in this research reuses a training engine, so its
            parallelism, checkpoint and precision behaviour is the engine&apos;s (our reading of these
            sources). On that reading, verl on its Megatron backend shards and checkpoints the way
            section 15 describes for Megatron Core, and OpenRLHF behaves as the DeepSpeed ZeRO stage it
            is given. TorchTitan, the PyTorch team&apos;s reference trainer, moved its RL stack out of
            the experimental folder in v0.4.0: TitanRL now shares the core training engine and
            supports pipeline and context parallel training{' '}
            <Cite tier={1} href={TORCHTITAN_RELEASE}>
              TorchTitan v0.4.0 release notes
            </Cite>
            , with one model definition shared by the trainer and vLLM{' '}
            <Cite tier={1} href={TORCHTITAN_RL_README}>
              TorchTitan v0.4.0 README L153-L157
            </Cite>
            .
          </Box>
          <Box variant="p">
            The rollout side is an inference engine with the usual inference concerns. The{' '}
            <Link href="../sglang/">SGLang dive, section 13: SGLang as an RL Rollout Engine</Link>{' '}
            covers one of them in that role.
          </Box>
          <ExpandableSection headerText="Where each row of the table was read">
            <ul>
              <li>
                verl v0.9.1: training backend per actor configuration{' '}
                <Cite tier={1} href={VERL_ACTORS} kind="code">
                  verl actor configs
                </Cite>
                ; rollout names and the async default{' '}
                <Cite tier={1} href={VERL_ROLLOUT} kind="code">
                  verl rollout.yaml L4-L8
                </Cite>
                .
              </li>
              <li>
                OpenRLHF v0.11.2: the training strategy is a <code>DeepspeedStrategy</code> built with
                the configured ZeRO stage{' '}
                <Cite tier={1} href={OPENRLHF_STRATEGY} kind="code">
                  OpenRLHF utils.py L25-L37
                </Cite>
                ; vLLM engines for generation{' '}
                <Cite tier={1} href={OPENRLHF_VLLM} kind="code">
                  OpenRLHF train_ppo_ray.py L52-L66
                </Cite>
                .
              </li>
              <li>
                TRL v1.16.0: transformers and Accelerate in the core dependencies{' '}
                <Cite tier={1} href={TRL_DEPS} kind="code">
                  TRL pyproject.toml L29-L42
                </Cite>
                , vLLM as an optional extra{' '}
                <Cite tier={1} href={TRL_VLLM} kind="code">
                  TRL pyproject.toml L89-L93
                </Cite>
                .
              </li>
              <li>
                slime v0.4.0: Megatron and SGLang backends{' '}
                <Cite tier={1} href={SLIME_BACKENDS} kind="code">
                  slime backends directory
                </Cite>
                .
              </li>
              <li>
                NeMo RL v0.7.0: training and generation backends{' '}
                <Cite tier={1} href={NEMO_RL_README}>
                  NeMo RL v0.7.0 README L84-L96
                </Cite>
                .
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Start an AWS fine-tuning or RL run from a published recipe, and read its node count as a working configuration set well above the memory floor"
          >
            Where AWS&apos;s recipes start you
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            HyperPod recipes are AWS&apos;s pre-built training stacks, which run on SageMaker HyperPod
            clusters or as SageMaker training jobs{' '}
            <Cite tier={1} href={HYPERPOD_RECIPES_DOC} accessed={REGISTER_DATE}>
              SageMaker HyperPod recipes guide
            </Cite>
            . At release 2.0.11 the repository is a fine-tuning and post-training collection: its
            training directory holds only six recipes, one open-weight pre-training recipe (a
            checkpointless Llama 3 70B), a Falcon custom-model example and four Nova continued
            pre-training recipes{' '}
            <Cite tier={1} href={HYPERPOD_TRAINING_TREE} kind="code" accessed={REGISTER_DATE}>
              sagemaker-hyperpod-recipes 2.0.11 training directory
            </Cite>
            ; the v2.0.0 release that set this shape lists verl, checkpointless and elastic training
            among its additions{' '}
            <Cite tier={1} href={HYPERPOD_V200} accessed={REGISTER_DATE}>
              sagemaker-hyperpod-recipes v2.0.0 release notes
            </Cite>
            . Section 20, Who Owns What on AWS, and section 26, SageMaker Training Jobs, place them.
          </Box>
          <Box variant="p">
            AWS&apos;s checkpointless recipe table runs its Llama 3 70B LoRA example on 2 p5.48xlarge,
            16 H100, and its GPT OSS 120B examples on 2 p5.48xlarge for LoRA and 16 for full
            fine-tuning{' '}
            <Cite tier={1} href={CHECKPOINTLESS_DOC}>
              HyperPod checkpointless training guide, recipe table
            </Cite>
            . The 70B example uses eight times the {T70.gpuLora} H100 that a 70B model&apos;s frozen BF16
            weights need by the arithmetic above. The
            memory floor says which method fits at all; how many GPUs a run should use is then set by
            its activations and the step time it wants (our reading).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Leave with a method that fits your GPUs and an engine to pin: full fine-tuning, LoRA or QLoRA from the model-state floor below, then the framework that runs on the engine you already operate"
          >
            Size your run, then pick the engine
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Choose a model and an adapter share. The table prints Calculator B&apos;s frozen-base rows
            beside its full fine-tuning rows, with each GPU count on both units an H100 is sold in.
          </Box>
          <FineTuneSizer />
          <Box variant="p">
            Read each row as a floor: model state alone, before activations. For Llama 3.1 70B the
            floor is {T70.gpuFull16} H100 at 80 GB each for full fine-tuning at 16 bytes per parameter
            and one for QLoRA. Add activations at your sequence length and micro-batch, the sequences
            that pass through the model together, from the calculator in section 5, which counts them
            the same for every optimizer row. For a frozen base that is our assumption, not a
            measurement; QLoRA&apos;s measurement above says activations, not adapters, are the part to
            watch.
          </Box>
          <Box variant="p">Then pick the framework by the engine you already run, and pin both versions:</Box>
          <ul>
            <li>
              <strong>PyTorch&apos;s FSDP or DTensor:</strong> Axolotl, LLaMA-Factory, verl&apos;s{' '}
              <code>fsdp</code> or <code>torchtitan</code> backend, NeMo RL&apos;s DTensor backend,
              TorchTitan&apos;s TitanRL.
            </li>
            <li>
              <strong>Megatron Core:</strong> LLaMA-Factory&apos;s <code>mcore_adapter</code> backend,
              verl&apos;s <code>megatron</code> backend, slime, NeMo RL&apos;s Megatron backend.
            </li>
            <li>
              <strong>DeepSpeed:</strong> Axolotl, LLaMA-Factory, OpenRLHF.
            </li>
            <li>
              <strong>Accelerate:</strong> TRL; section 15 shows what Accelerate runs underneath.
            </li>
          </ul>
          <Box variant="p">
            The engine&apos;s version decides the sharding, checkpoint and precision defaults that
            section 15 lists, so pin it beside the front end&apos;s, and size the GPUs from the floor
            above before you reserve them.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
