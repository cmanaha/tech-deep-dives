import { useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import FormField from '@cloudscape-design/components/form-field';
import Select from '@cloudscape-design/components/select';
import type { SelectProps } from '@cloudscape-design/components/select';
import Input from '@cloudscape-design/components/input';
import Slider from '@cloudscape-design/components/slider';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Alert from '@cloudscape-design/components/alert';
import Button from '@cloudscape-design/components/button';
import {
  Cite,
  arxiv,
  gh,
  E2_URL,
  GUIDE_URL,
  LLAMA_MODELS_TAG,
  TORCHTITAN_NEURON_TAG,
  TORCHTITAN_TAG,
} from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import {
  DENSE_MODELS,
  DEFAULT_MFU,
  INSTANCES,
  PRICES_READ_ON,
  SOURCES,
  shapeOf,
  type DenseModelId,
  type InstanceId,
  type Source,
} from '../lib/presets';
import {
  denseRuntimeInputs,
  estimateRun,
  flopsPerToken,
  priceRun,
  type AttentionMode,
  type CostLine,
  type RuntimeModelInputs,
  type RuntimeResult,
} from '../lib/runtime';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Chowdhery et al., PaLM: MFU definition (Sec 4.1) and the 6N + 12LHQT count (Appendix B). */
const PALM = arxiv('2204.02311v5');
/** Narayanan et al., Efficient Large-Scale Language Model Training on GPU Clusters (SC 2021). */
const PTDP = arxiv('2104.04473v5');
/** Kaplan et al., Scaling Laws for Neural Language Models: Table 1 (per-operation FLOPs). */
const KAPLAN = arxiv('2001.08361v1');
/** Korthikanti et al., Reducing Activation Recomputation in Large Transformer Models. */
const KORTHIKANTI = arxiv('2205.05198v1');
/** The Llama 3 Herd of Models. */
const LLAMA3 = arxiv('2407.21783v3');
/** MegaScale: Scaling Large Language Model Training to More Than 10,000 GPUs. */
const MEGASCALE = arxiv('2402.15627v1');
/** DeepSeek-V3 Technical Report. */
const DEEPSEEK = arxiv('2412.19437v2');
/** Hoffmann et al., Training Compute-Optimal Large Language Models (Chinchilla), Table 3. */
const CHINCHILLA = arxiv('2203.15556v1');
/** Llama 3.1 model card at llama-models v0.2.0: GPU-hours per model and training tokens. */
const LLAMA_CARD = gh('meta-llama/llama-models', LLAMA_MODELS_TAG, 'models/llama3_1/MODEL_CARD.md', 'L104-L154');
/** The same card's training-token figure, "15T+". */
const LLAMA_CARD_TOKENS = gh('meta-llama/llama-models', LLAMA_MODELS_TAG, 'models/llama3_1/MODEL_CARD.md', 'L46');
/** Hugging Face model metadata at pinned revisions (exact parameter counts). */
const HF_8B = 'https://huggingface.co/api/models/meta-llama/Llama-3.1-8B/revision/d04e592bb4f6aa9cfee91e2e20afa771667e1d4b';
const HF_70B = 'https://huggingface.co/api/models/meta-llama/Llama-3.1-70B/revision/349b2ddb53ce8f2849a6c168a81980ab25258dac';
const HF_405B = 'https://huggingface.co/api/models/meta-llama/Llama-3.1-405B/revision/b906e4dc842aa489c962f9db26554dcfdde901fe';
/** Vendor specification pages. */
const H100_SPEC = 'https://www.nvidia.com/en-us/data-center/h100/';
const HGX_SPEC = 'https://www.nvidia.com/en-us/data-center/hgx/';
const TRN2_SPEC = 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html';
const SPARK_HW = 'https://docs.nvidia.com/dgx/dgx-spark/hardware.html';
const EC2_AC = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';
/** NVIDIA Megatron Bridge 0.7.0 docs: performance archive with model TFLOP/s per GPU. */
const MB_ARCHIVE = 'https://docs.nvidia.com/nemo/megatron-bridge/0.7.0/performance-summary-archive.html';
/** TorchTitan v0.4.0: the FLOP count behind its MFU column, and its peak table. */
const TT_ATTN = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/models/common/flops.py', 'L20-L51');
const TT_PARAMS = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/models/common/flops.py', 'L84-L144');
const TT_LLAMA = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/models/llama3/model.py', 'L91-L109');
const TT_METRICS = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/observability/metrics.py', 'L115-L135');
const TT_PEAKS = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/tools/utils.py', 'L111-L232');
/** TorchTitan Neuron's validated layouts, and the prices and AWS pages the experiment protocols cite. */
const TT_NEURON = SOURCES.torchtitanNeuron.url;
const TTN_PEAK = gh('aws-neuron/torchtitan-neuron', TORCHTITAN_NEURON_TAG, 'torchtitan/tools/utils.py', 'L194-L206');
const SAGEMAKER_PRICE_USE2 = SOURCES.sagemakerUse2.url;
const EC2_PRICE_USE1 = SOURCES.ec2PriceUse1.url;
const CB_PRICING = SOURCES.capacityBlocks.url;
const WARM_POOLS = 'https://docs.aws.amazon.com/sagemaker/latest/dg/train-warm-pools.html';

/** Register rows cited without re-opening the source keep the register's date. */
const REGISTER_DATE = '2026-10-30';

/** Conditions every E2 figure carries. */
const E2_TITLE = 'E2: step time and MFU against a measured ceiling on one GB10, PyTorch 2.15.0, two runs';

/* ------------------------------------------------------------------------ */
/* Number formatting (display only; every value comes from src/lib)         */
/* ------------------------------------------------------------------------ */

function sci(x: number): string {
  return x.toExponential(2).replace('e+', 'e');
}

function sig3(x: number): string {
  if (x >= 1e6) return `${Number((x / 1e6).toPrecision(3)).toLocaleString('en-US')}M`;
  return Number(x.toPrecision(3)).toLocaleString('en-US');
}

function usd(x: number): string {
  if (x >= 1e6) return `$${Number((x / 1e6).toPrecision(3))}M`;
  return `$${Number(x.toPrecision(3)).toLocaleString('en-US')}`;
}

function pct(x: number, digits = 1): string {
  return `${(x * 100).toFixed(digits)}%`;
}

/* ------------------------------------------------------------------------ */
/* Diagram data: per-token FLOPs from Calculator A's own function           */
/* ------------------------------------------------------------------------ */

const SEQ_LENGTHS = [2_048, 4_096, 8_192, 16_384, 32_768, 65_536, 131_072];
const SEQ_LABELS = ['2K', '4K', '8K', '16K', '32K', '64K', '128K'];

interface AttnBar {
  seq: number;
  label: string;
  /** GFLOPs per token. */
  dense: number;
  causal: number;
  noDiscount: number;
  causalShare: number;
  noDiscountShare: number;
}

function attnBars(id: DenseModelId): AttnBar[] {
  const inputs = denseRuntimeInputs(shapeOf(DENSE_MODELS[id]), 'matmul');
  return SEQ_LENGTHS.map((seq, i) => {
    const c = flopsPerToken({ ...inputs, sequenceLength: seq, attention: 'causal' });
    const n = flopsPerToken({ ...inputs, sequenceLength: seq, attention: 'noDiscount' });
    return {
      seq,
      label: SEQ_LABELS[i],
      dense: c.dense / 1e9,
      causal: c.attention / 1e9,
      noDiscount: n.attention / 1e9,
      causalShare: c.attentionShare,
      noDiscountShare: n.attentionShare,
    };
  });
}

const BARS_8B = attnBars('llama-3.1-8b');
const BARS_70B = attnBars('llama-3.1-70b');

/* ------------------------------------------------------------------------ */
/* Diagram: per-token FLOPs as stacked bars across sequence lengths         */
/* ------------------------------------------------------------------------ */

const ARITH_NARROW_PX = 700;

const INK = '#16191f';
const MUTED = '#414d5c';
const DENSE_FILL = '#0972d3';
const ATTN_FILL = '#c05600';
const GRID = '#e9ebed';
const FONT = 'sans-serif';

interface PanelProps {
  x: number;
  y: number;
  width: number;
  title: string;
  bars: AttnBar[];
  ticks: number[];
  max: number;
}

const PANEL_H = 292;
/** Narrow viewBox width: at a 390px viewport an 11-unit label still paints at about 9.5px. */
const NARROW_W = 360;

function AttnPanel({ x, y, width, title, bars, ticks, max }: PanelProps) {
  const left = x + 52;
  const right = x + width - 8;
  const top = y + 52;
  const bottom = y + 252;
  const scale = (bottom - top) / max;
  const slot = (right - left) / bars.length;
  const barW = slot * 0.62;
  const yOf = (v: number) => bottom - v * scale;
  const dense = bars[0].dense;
  return (
    <g>
      <text x={x + 4} y={y + 16} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
        {title}
      </text>
      <text x={x + 4} y={y + 33} fontFamily={FONT} fontSize={11} fill={MUTED}>
        {`GFLOPs per training token; 6N = ${dense >= 100 ? dense.toFixed(0) : dense.toFixed(1)}`}
      </text>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={left} y1={yOf(t)} x2={right} y2={yOf(t)} stroke={GRID} strokeWidth={1} />
          <text x={left - 6} y={yOf(t) + 4} fontFamily={FONT} fontSize={11} fill={MUTED} textAnchor="end">
            {t.toLocaleString('en-US')}
          </text>
        </g>
      ))}
      <line x1={left} y1={bottom} x2={right} y2={bottom} stroke={MUTED} strokeWidth={1} />
      <text x={left - 6} y={bottom + 32} fontFamily={FONT} fontSize={11} fill={MUTED} textAnchor="end">
        share
      </text>
      {bars.map((b, i) => {
        const bx = left + i * slot + (slot - barW) / 2;
        const yDense = yOf(b.dense);
        const yCausal = yOf(b.dense + b.causal);
        const yFull = yOf(b.dense + b.noDiscount);
        return (
          <g key={b.seq}>
            <rect x={bx} y={yDense} width={barW} height={bottom - yDense} fill={DENSE_FILL} />
            <rect
              x={bx}
              y={yCausal}
              width={barW}
              height={Math.max(yDense - yCausal - 1, 0.5)}
              fill={ATTN_FILL}
            />
            <rect
              x={bx + 0.75}
              y={yFull}
              width={barW - 1.5}
              height={Math.max(yCausal - yFull - 1, 0.5)}
              fill="url(#arith-attn-hatch)"
              stroke={ATTN_FILL}
              strokeWidth={1}
            />
            <text x={bx + barW / 2} y={bottom + 16} fontFamily={FONT} fontSize={11} fill={INK} textAnchor="middle">
              {b.label}
            </text>
            <text x={bx + barW / 2} y={bottom + 32} fontFamily={FONT} fontSize={11} fill={MUTED} textAnchor="middle">
              {pct(b.causalShare)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function LegendItem({ x, y, kind, text }: { x: number; y: number; kind: 'dense' | 'causal' | 'extra'; text: string }) {
  return (
    <g>
      {kind === 'dense' && <rect x={x} y={y - 10} width={12} height={12} fill={DENSE_FILL} />}
      {kind === 'causal' && <rect x={x} y={y - 10} width={12} height={12} fill={ATTN_FILL} />}
      {kind === 'extra' && (
        <rect x={x + 0.5} y={y - 9.5} width={11} height={11} fill="url(#arith-attn-hatch)" stroke={ATTN_FILL} strokeWidth={1} />
      )}
      <text x={x + 18} y={y} fontFamily={FONT} fontSize={11} fill={INK}>
        {text}
      </text>
    </g>
  );
}

function AttentionFlopsDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, ARITH_NARROW_PX);

  const W = narrow ? NARROW_W : 900;
  const legendRows = narrow
    ? [
        { x: 6, y: 18, kind: 'dense' as const, text: '6N with the matmul parameter count' },
        { x: 6, y: 36, kind: 'causal' as const, text: 'attention, causal kernel (6Lhs per token)' },
        { x: 6, y: 54, kind: 'extra' as const, text: 'added with no causal discount (12Lhs)' },
      ]
    : [
        { x: 6, y: 20, kind: 'dense' as const, text: '6N with the matmul parameter count' },
        { x: 270, y: 20, kind: 'causal' as const, text: 'attention, causal kernel (6Lhs per token)' },
        { x: 560, y: 20, kind: 'extra' as const, text: 'added with no causal discount (12Lhs)' },
      ];
  const panels = narrow
    ? [
        { x: 0, y: 66, width: NARROW_W },
        { x: 0, y: 66 + PANEL_H + 12, width: NARROW_W },
      ]
    : [
        { x: 0, y: 40, width: 440 },
        { x: 460, y: 40, width: 440 },
      ];
  const H = narrow ? 66 + 2 * PANEL_H + 12 + 6 : 40 + PANEL_H + 6;

  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="arith-attn-title"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <title id="arith-attn-title">
          {`Per-token training FLOPs of Llama 3.1 8B and 70B as stacked bars for sequence lengths from 2K to 128K tokens. The dense 6N part stays constant, ${BARS_8B[0].dense.toFixed(1)} GFLOPs for 8B and ${BARS_70B[0].dense.toFixed(0)} for 70B, while attention grows in proportion to sequence length. With a causal kernel attention is ${pct(BARS_8B[2].causalShare)} of the 8B model's FLOPs at 8K tokens and ${pct(BARS_8B[6].causalShare)} at 128K, and ${pct(BARS_70B[2].causalShare)} and ${pct(BARS_70B[6].causalShare)} for 70B. Counting the full score matrix with no causal discount doubles the attention part.`}
        </title>
        <defs>
          <pattern id="arith-attn-hatch" width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect x={0} y={0} width={6} height={6} fill="#fdf3ec" />
            <line x1={0} y1={0} x2={0} y2={6} stroke={ATTN_FILL} strokeWidth={2} />
          </pattern>
        </defs>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
        {legendRows.map((l) => (
          <LegendItem key={l.text} x={l.x} y={l.y} kind={l.kind} text={l.text} />
        ))}
        <AttnPanel {...panels[0]} title="Llama 3.1 8B" bars={BARS_8B} ticks={[0, 50, 100, 150, 200, 250]} max={270} />
        <AttnPanel {...panels[1]} title="Llama 3.1 70B" bars={BARS_70B} ticks={[0, 500, 1_000, 1_500]} max={1_600} />
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
const numHead: CSSProperties = { ...headCell, textAlign: 'right' };
/** Numbers never break inside a figure; the header text beside them still wraps. */
const nowrap: CSSProperties = { whiteSpace: 'nowrap' };

function AttentionShareTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ ...headCell, ...nowrap }}>Tokens</th>
            <th style={numHead}>8B: causal / no discount</th>
            <th style={numHead}>70B: causal / no discount</th>
          </tr>
        </thead>
        <tbody>
          {BARS_8B.map((b, i) => (
            <tr key={b.seq}>
              <td style={{ ...cell, ...nowrap }}>{b.seq.toLocaleString('en-US')}</td>
              <td style={{ ...numCell, ...nowrap }}>
                {pct(b.causalShare)} / {pct(b.noDiscountShare)}
              </td>
              <td style={{ ...numCell, ...nowrap }}>
                {pct(BARS_70B[i].causalShare)} / {pct(BARS_70B[i].noDiscountShare)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Calculator A                                                             */
/* ------------------------------------------------------------------------ */

type ModelChoice = DenseModelId | 'custom';
type BasisChoice = 'full' | 'matmul' | 'nonEmbedding';

interface RunPreset {
  id: string;
  label: string;
  model: DenseModelId;
  tokensT: string;
  instance: InstanceId;
  instances: string;
  mfuPct: number;
}

const DEFAULT_MFU_PCT = Math.round(DEFAULT_MFU.value * 100);

/** Register 01 W8's table (32 instances, 40% MFU, 6N on the full count), plus 01 W7's 405B check. */
const PRESETS: RunPreset[] = [
  { id: '70b-1t-p5', label: '70B, 1T tokens, 32 p5.48xlarge', model: 'llama-3.1-70b', tokensT: '1', instance: 'p5.48xlarge', instances: '32', mfuPct: DEFAULT_MFU_PCT },
  { id: '70b-1t-b200', label: '70B, 1T tokens, 32 p6-b200.48xlarge', model: 'llama-3.1-70b', tokensT: '1', instance: 'p6-b200.48xlarge', instances: '32', mfuPct: DEFAULT_MFU_PCT },
  { id: '70b-1t-trn2', label: '70B, 1T tokens, 32 trn2.48xlarge', model: 'llama-3.1-70b', tokensT: '1', instance: 'trn2.48xlarge', instances: '32', mfuPct: DEFAULT_MFU_PCT },
  { id: '70b-15t-p5', label: '70B, 15T tokens, 32 p5.48xlarge', model: 'llama-3.1-70b', tokensT: '15', instance: 'p5.48xlarge', instances: '32', mfuPct: DEFAULT_MFU_PCT },
  { id: '70b-15t-b200', label: '70B, 15T tokens, 32 p6-b200.48xlarge', model: 'llama-3.1-70b', tokensT: '15', instance: 'p6-b200.48xlarge', instances: '32', mfuPct: DEFAULT_MFU_PCT },
  { id: '8b-1t-p5', label: '8B, 1T tokens, 32 p5.48xlarge', model: 'llama-3.1-8b', tokensT: '1', instance: 'p5.48xlarge', instances: '32', mfuPct: DEFAULT_MFU_PCT },
  { id: '8b-1t-b200', label: '8B, 1T tokens, 32 p6-b200.48xlarge', model: 'llama-3.1-8b', tokensT: '1', instance: 'p6-b200.48xlarge', instances: '32', mfuPct: DEFAULT_MFU_PCT },
  { id: '8b-1t-trn2', label: '8B, 1T tokens, 32 trn2.48xlarge', model: 'llama-3.1-8b', tokensT: '1', instance: 'trn2.48xlarge', instances: '32', mfuPct: DEFAULT_MFU_PCT },
  {
    id: '405b-check',
    label: "Llama 3 405B check: 15.6T tokens, 16,384 H100 at 41% MFU (Meta's 16K-GPU row)",
    model: 'llama-3.1-405b',
    tokensT: '15.6',
    instance: 'p5.48xlarge',
    instances: '2048',
    mfuPct: 41,
  },
];

const CUSTOM_PRESET = 'yours';

const INSTANCE_IDS: InstanceId[] = [
  'p4d.24xlarge',
  'p4de.24xlarge',
  'p5.48xlarge',
  'p5e.48xlarge',
  'p5en.48xlarge',
  'p6-b200.48xlarge',
  'p6-b300.48xlarge',
  'p6e-gb200.36xlarge',
  'trn1.32xlarge',
  'trn1n.32xlarge',
  'trn2.48xlarge',
];

const MODEL_LABEL: Record<ModelChoice, string> = {
  'llama-3.1-8b': 'Llama 3.1 8B',
  'llama-3.1-70b': 'Llama 3.1 70B',
  'llama-3.1-405b': 'Llama 3.1 405B',
  custom: 'Your model (enter N, L and attention width)',
};

const MODEL_SOURCE: Record<DenseModelId, string> = {
  'llama-3.1-8b': HF_8B,
  'llama-3.1-70b': HF_70B,
  'llama-3.1-405b': HF_405B,
};

const BASIS_LABEL: Record<BasisChoice, string> = {
  full: 'All parameters (default)',
  matmul: 'Matmul parameters only: layers and output head',
  nonEmbedding: "All but the embedding table (TorchTitan v0.4.0's count)",
};

const ATTENTION_LABEL: Record<AttentionMode, string> = {
  none: 'None: 6N only (default)',
  causal: 'Causal kernel: 6Lhs per token',
  noDiscount: "No causal discount: 12Lhs per token (PaLM's and TorchTitan's count)",
};

/** Short titles for the preset sources, so no register ID reaches the page. */
const SOURCE_TITLE: Record<string, string> = {
  [SOURCES.h100.url]: 'NVIDIA H100 specification; dense is half the sparse figure',
  [SOURCES.h200.url]: 'NVIDIA H200 specification; dense is half the sparse figure',
  [SOURCES.a100.url]: 'NVIDIA A100 specification',
  [SOURCES.hgx.url]: 'NVIDIA HGX specification; dense is half the sparse figure',
  [SOURCES.gb200.url]: 'NVIDIA GB200 NVL72 specification; dense is half the sparse figure',
  [SOURCES.trainium.url]: 'AWS Neuron documentation, Trainium',
  [SOURCES.trainium2.url]: 'AWS Neuron documentation, Trainium2',
  [SOURCES.ec2Specs.url]: 'Amazon EC2 accelerated computing instance specifications',
  [SOURCES.trn2Arch.url]: 'AWS Neuron documentation, Trn2 architecture',
  [SOURCES.ec2PriceUse1.url]: 'AWS Price List, AmazonEC2 us-east-1, version 20261029175634',
  [SOURCES.ec2PriceUse2.url]: 'AWS Price List, AmazonEC2 us-east-2, version 20261029175634',
  [SOURCES.ec2PriceAllRegions.url]: 'AWS Price List, AmazonEC2 all Regions, version 20261029175634',
  [SOURCES.capacityBlocks.url]: 'EC2 Capacity Blocks pricing',
};

/** Sources this research re-opened on 2026-10-31; the rest keep the register's date. */
const REREAD_ON_RESEARCH_DATE = new Set<string>([SOURCES.h100.url, SOURCES.hgx.url]);

function SourceCite({ source, accessed }: { source: Source; accessed?: string }) {
  // Preset labels carry register IDs in parentheses; the page never prints those.
  const title = SOURCE_TITLE[source.url] ?? source.label.replace(/\s*\([^()]*\)/g, '');
  return (
    <Cite
      tier={source.tier}
      href={source.url}
      kind={source.basis === 'vendor-specification' ? 'vendor-claim' : undefined}
      accessed={accessed ?? (REREAD_ON_RESEARCH_DATE.has(source.url) ? undefined : REGISTER_DATE)}
    >
      {title}
    </Cite>
  );
}

interface CalcInputs {
  model: ModelChoice;
  customParamsB: string;
  customLayers: string;
  customWidth: string;
  basis: BasisChoice;
  attention: AttentionMode;
  seq: number;
  tokensT: string;
  instance: InstanceId;
  instances: string;
  mfuPct: number;
}

type CalcOutcome =
  | { ok: true; result: RuntimeResult; accelerators: number; lines: CostLine[] }
  | { ok: false; message: string };

function parsePositive(field: string, raw: string): number {
  const v = Number(raw);
  if (raw.trim() === '' || !Number.isFinite(v) || v <= 0) throw new RangeError(`${field} must be a number greater than 0 (got "${raw}")`);
  return v;
}

function parseWhole(field: string, raw: string): number {
  const v = parsePositive(field, raw);
  if (!Number.isInteger(v)) throw new RangeError(`${field} must be a whole number (got "${raw}")`);
  return v;
}

/** Reads the form, calls Calculator A and the price rows; every formula lives in src/lib. */
function runCalculator(inp: CalcInputs): CalcOutcome {
  try {
    const modelInputs: RuntimeModelInputs =
      inp.model === 'custom'
        ? {
            parameters: parsePositive('Parameters', inp.customParamsB) * 1e9,
            parameterBasis: 'custom',
            layers: parseWhole('Layers', inp.customLayers),
            attentionWidth: parseWhole('Attention width', inp.customWidth),
          }
        : denseRuntimeInputs(shapeOf(DENSE_MODELS[inp.model]), inp.basis);
    const preset = INSTANCES[inp.instance];
    const accelerators = parseWhole('Instances', inp.instances) * preset.acceleratorsPerInstance.value;
    const result = estimateRun({
      ...modelInputs,
      tokens: parsePositive('Training tokens', inp.tokensT) * 1e12,
      sequenceLength: inp.seq,
      attention: inp.attention,
      peakTflopsPerAccelerator: preset.denseBf16TflopsPerAccelerator.value,
      accelerators,
      mfu: inp.mfuPct / 100,
    });
    const cost = priceRun({ acceleratorHours: result.acceleratorHours, accelerators, instance: inp.instance });
    const lines = cost.lines.filter((l) => l.path === 'ec2OnDemand' || l.path === 'capacityBlock');
    return { ok: true, result, accelerators, lines };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, message };
  }
}

function flopCountWords(inp: CalcInputs): string {
  const n =
    inp.model === 'custom'
      ? 'the N you entered'
      : inp.basis === 'full'
        ? 'the full parameter count'
        : inp.basis === 'matmul'
          ? 'the matmul parameter count'
          : 'every parameter but the embedding table';
  const a =
    inp.attention === 'none'
      ? 'no attention term'
      : inp.attention === 'causal'
        ? `a causal attention term, 6Lhs at ${inp.seq.toLocaleString('en-US')} tokens`
        : `an attention term with no causal discount, 12Lhs at ${inp.seq.toLocaleString('en-US')} tokens`;
  const tt =
    inp.model !== 'custom' && inp.basis === 'nonEmbedding' && inp.attention === 'noDiscount'
      ? "; this is TorchTitan v0.4.0's count"
      : '';
  return `6N with ${n}, plus ${a}${tt}`;
}

function option<T extends string>(value: T, label: string, description?: string): SelectProps.Option {
  return { value, label, description };
}

const SEQ_OPTIONS = SEQ_LENGTHS.map((s) => option(String(s), `${s.toLocaleString('en-US')} tokens`));

function CalculatorA() {
  const first = PRESETS[0];
  const [presetId, setPresetId] = useState<string>(first.id);
  const [inp, setInp] = useState<CalcInputs>({
    model: first.model,
    customParamsB: '8.03',
    customLayers: '32',
    customWidth: '4096',
    basis: 'full',
    attention: 'none',
    seq: 8_192,
    tokensT: first.tokensT,
    instance: first.instance,
    instances: first.instances,
    mfuPct: first.mfuPct,
  });

  const update = (patch: Partial<CalcInputs>) => {
    setPresetId(CUSTOM_PRESET);
    setInp((prev) => ({ ...prev, ...patch }));
  };

  const applyPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    setPresetId(id);
    setInp((prev) => ({
      ...prev,
      model: p.model,
      basis: 'full',
      attention: 'none',
      seq: 8_192,
      tokensT: p.tokensT,
      instance: p.instance,
      instances: p.instances,
      mfuPct: p.mfuPct,
    }));
  };

  const outcome = useMemo(() => runCalculator(inp), [inp]);
  const inst = INSTANCES[inp.instance];

  const presetOptions: SelectProps.Option[] = [
    ...PRESETS.map((p) => option(p.id, p.label)),
    option(CUSTOM_PRESET, 'Your inputs'),
  ];
  const modelOptions = (Object.keys(MODEL_LABEL) as ModelChoice[]).map((m) => option(m, MODEL_LABEL[m]));
  const basisOptions = (Object.keys(BASIS_LABEL) as BasisChoice[]).map((b) => option(b, BASIS_LABEL[b]));
  const attentionOptions = (Object.keys(ATTENTION_LABEL) as AttentionMode[]).map((a) => option(a, ATTENTION_LABEL[a]));
  const instanceOptions = INSTANCE_IDS.map((id) => {
    const p = INSTANCES[id];
    return option(
      id,
      id,
      `${p.acceleratorsPerInstance.value} x ${p.accelerator}, ${p.denseBf16TflopsPerAccelerator.value.toLocaleString('en-US')} TFLOPS dense BF16 each`,
    );
  });
  const find = (opts: SelectProps.Option[], v: string) => opts.find((o) => o.value === v) ?? null;

  let outputs: ReactNode;
  if (!outcome.ok) {
    outputs = (
      <Alert type="error" header="The estimate cannot be computed from these inputs">
        {outcome.message}
      </Alert>
    );
  } else {
    const r = outcome.result;
    const f = r.flopsPerToken;
    const perInstance = inst.acceleratorsPerInstance.value;
    const days = r.wallClockDays;
    outputs = (
      <SpaceBetween size="s">
        <KeyValuePairs
          columns={3}
          items={[
            {
              label: 'FLOPs per token',
              value:
                f.attention > 0
                  ? `${sci(f.dense)} (6N) + ${sci(f.attention)} (attention) = ${sci(f.total)}`
                  : `${sci(f.total)} (6N only)`,
            },
            {
              label: 'Attention share of those FLOPs',
              value: inp.attention === 'none' ? 'not counted' : pct(f.attentionShare),
            },
            { label: 'Total FLOPs for the run', value: sci(r.totalFlops) },
            { label: 'Accelerator-hours', value: sig3(r.acceleratorHours) },
            { label: 'Instance-hours', value: sig3(r.acceleratorHours / perInstance) },
            {
              label: `Wall-clock time on ${outcome.accelerators.toLocaleString('en-US')} accelerators`,
              value: days < 2 ? `${sig3(r.wallClockSeconds / 3_600)} hours` : `${sig3(days)} days`,
            },
            {
              label: 'Tokens per second per accelerator',
              value: Math.round(r.tokensPerSecondPerAccelerator).toLocaleString('en-US'),
            },
          ]}
        />
        {outcome.lines.map((l) => (
          <Box variant="p" key={`${l.path}-${l.unit}`}>
            <strong>{l.path === 'ec2OnDemand' ? 'EC2 On-Demand' : 'Capacity Block'}:</strong> {usd(l.usd)}{' '}
            for {sig3(l.unitHours)} {l.unit} hours at ${l.usdPerUnitHour.toLocaleString('en-US')} per hour,{' '}
            {l.region}, read {l.date}
            {l.path === 'capacityBlock' ? ', charged at the price quoted at purchase' : ''}{' '}
            <SourceCite source={l.source} accessed={PRICES_READ_ON} />
          </Box>
        ))}
        <Box variant="small" color="text-body-secondary">
          FLOP count in use: {flopCountWords(inp)}. MFU {inp.mfuPct}%, BF16, no overhead factor for
          restarts, evaluation or other stages: {r.label}.
        </Box>
      </SpaceBetween>
    );
  }

  return (
    <SpaceBetween size="m">
      <FormField
        label="Start from a preset"
        description="Each preset fills every input below; changing any input switches to your inputs."
      >
        <Select
          selectedOption={find(presetOptions, presetId)}
          options={presetOptions}
          onChange={({ detail }) => {
            const v = detail.selectedOption.value ?? '';
            if (v !== CUSTOM_PRESET) applyPreset(v);
          }}
        />
      </FormField>
      <ColumnLayout columns={2}>
        <FormField
          label="Model"
          description={
            inp.model === 'custom' ? (
              'Enter the parameter count your FLOP count should use, the layer count and heads x head dimension.'
            ) : (
              <>
                Parameters from{' '}
                <Cite tier={1} href={MODEL_SOURCE[inp.model]}>
                  Meta&apos;s model metadata
                </Cite>
                ; layers and widths from{' '}
                <Cite tier={3} href={LLAMA3} venue="preprint">
                  Llama 3 Herd of Models, Table 3
                </Cite>
              </>
            )
          }
        >
          <Select
            selectedOption={find(modelOptions, inp.model)}
            options={modelOptions}
            onChange={({ detail }) => update({ model: (detail.selectedOption.value ?? 'llama-3.1-70b') as ModelChoice })}
          />
        </FormField>
        <FormField
          label="Training tokens D, in trillions"
          description="Chinchilla's compute-optimal ratio is about 20 tokens per parameter; Llama 3.1 trained on about 15T."
        >
          <Input type="number" value={inp.tokensT} onChange={({ detail }) => update({ tokensT: detail.value })} />
        </FormField>
        {inp.model === 'custom' && (
          <>
            <FormField label="Parameters N, in billions">
              <Input type="number" value={inp.customParamsB} onChange={({ detail }) => update({ customParamsB: detail.value })} />
            </FormField>
            <FormField label="Layers L">
              <Input type="number" value={inp.customLayers} onChange={({ detail }) => update({ customLayers: detail.value })} />
            </FormField>
            <FormField label="Attention width: heads x head dimension (h for Llama)">
              <Input type="number" value={inp.customWidth} onChange={({ detail }) => update({ customWidth: detail.value })} />
            </FormField>
          </>
        )}
        <FormField
          label="Parameter count used for N in 6N"
          description="The full count is the one section 29's tokens-per-second figures use; the matmul count is strictly the N of 6N."
        >
          <Select
            disabled={inp.model === 'custom'}
            selectedOption={find(basisOptions, inp.basis)}
            options={basisOptions}
            onChange={({ detail }) => update({ basis: (detail.selectedOption.value ?? 'full') as BasisChoice })}
          />
        </FormField>
        <FormField
          label="Attention term"
          description="TorchTitan v0.4.0's MFU column counts all but the embedding table, plus attention with no causal discount."
          secondaryControl={
            <Button
              disabled={inp.model === 'custom'}
              onClick={() => update({ basis: 'nonEmbedding', attention: 'noDiscount' })}
            >
              Use TorchTitan&apos;s count
            </Button>
          }
        >
          <Select
            selectedOption={find(attentionOptions, inp.attention)}
            options={attentionOptions}
            onChange={({ detail }) => update({ attention: (detail.selectedOption.value ?? 'none') as AttentionMode })}
          />
        </FormField>
        <FormField label="Sequence length s" description="Changes the estimate only when an attention term is counted.">
          <Select
            selectedOption={find(SEQ_OPTIONS, String(inp.seq))}
            options={SEQ_OPTIONS}
            onChange={({ detail }) => update({ seq: Number(detail.selectedOption.value ?? 8_192) })}
          />
        </FormField>
        <FormField
          label="Instance"
          description={
            <>
              Dense BF16 peak, a vendor specification:{' '}
              <SourceCite source={inst.denseBf16TflopsPerAccelerator.source} />; accelerators per
              instance: <SourceCite source={inst.acceleratorsPerInstance.source} />
            </>
          }
        >
          <Select
            selectedOption={find(instanceOptions, inp.instance)}
            options={instanceOptions}
            onChange={({ detail }) => update({ instance: (detail.selectedOption.value ?? 'p5.48xlarge') as InstanceId })}
          />
        </FormField>
        <FormField label="Instances" description={`${inst.acceleratorsPerInstance.value} accelerators each.`}>
          <Input type="number" value={inp.instances} onChange={({ detail }) => update({ instances: detail.value })} />
        </FormField>
        <FormField
          label={`MFU: ${inp.mfuPct}%`}
          description={
            <>
              An assumption: estimate; confirm with a measured step. The default 40% sits inside the
              38% to 43% BF16 MFU of Llama 3 405B on H100{' '}
              <Cite tier={3} href={LLAMA3} venue="preprint">
                Llama 3 Herd of Models, Table 4
              </Cite>
              . No first-party MFU for dense Llama-class training on H200 or Trainium2 was located in
              this research.
            </>
          }
        >
          <Slider
            value={inp.mfuPct}
            min={10}
            max={70}
            step={1}
            referenceValues={[40]}
            valueFormatter={(v) => `${v}%`}
            ariaLabel="MFU in percent"
            onChange={({ detail }) => update({ mfuPct: detail.value })}
          />
        </FormField>
      </ColumnLayout>
      <Box variant="p">
        <code>time = D x FLOPs per token / (accelerators x dense peak x MFU)</code>, with{' '}
        <code>FLOPs per token = 6N + attention</code> and attention 0, 6Lhs or 12Lhs per token.
      </Box>
      {outputs}
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function Arithmetic() {
  const b8 = BARS_8B[2];
  const b70 = BARS_70B[2];
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Estimate a run's accelerator-hours from its parameters, its training tokens and the share of peak arithmetic it achieves, and know which way the estimate errs (papers, vendor specifications, TorchTitan v0.4.0 and our DGX Spark run, read 2026-10-31)"
          >
            4. Counting the Arithmetic: 6ND, MFU &amp; Run Time
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A training run costs a number of floating-point operations (FLOPs) that the model&apos;s
            size and its training tokens fix before any hardware is chosen: about 6 for every
            parameter, for every token. Turning that bill into accelerator-hours, days and dollars
            takes two more numbers, the accelerator&apos;s peak and the share of it the run achieves.
          </Box>
          <Box variant="p">
            The challenge is to make that one estimate, which every reservation, budget and layout in
            this dive starts from, and to know which way it errs. It holds up against Llama 3 405B, a
            large run with enough published to check: 6ND reproduces Meta&apos;s own 3.8e25-FLOP
            budget.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Turn parameters, tokens and an efficiency into accelerator-hours: Llama 3.1 70B on 1T tokens comes to about 297,000 H100-hours at 40% MFU"
          >
            MFU, and the identity that turns FLOPs into time
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            MFU (model FLOPs utilization) is the share of the accelerators&apos; dense peak that the
            model&apos;s own arithmetic achieves: tokens per second times FLOPs per token, divided by
            accelerators times dense peak{' '}
            <Cite tier={3} href={PALM} venue="preprint">
              PaLM, Section 4.1 and Appendix B
            </Cite>
            . The dense peak is the matrix-unit peak without 2:4 structured sparsity. MFU counts only
            the model&apos;s FLOPs, 6N plus an attention term, so work the hardware repeats raises HFU
            (hardware FLOPs utilization) and leaves MFU where it was{' '}
            <Cite tier={3} href={PALM} venue="preprint">
              PaLM, Section 4.1
            </Cite>
            . The usual repeated work is recomputation, also called activation checkpointing: keeping
            each layer&apos;s input and re-running its forward pass during the backward pass instead of
            storing every activation (section 5, The Memory Budget).
          </Box>
          <Box variant="p">Rearranged for time, the definition gives the identity this dive sizes runs with:</Box>
          <Box variant="p">
            <code>time = 6ND / (accelerators x dense peak x MFU)</code>
          </Box>
          <Box variant="p">
            N is the parameter count and D the training tokens, so 6ND is the run&apos;s total FLOPs
            before attention. No source located in this research prints the identity in this form; it
            is our rearrangement of PaLM&apos;s definition.
          </Box>
          <Box variant="p">
            A worked example: Llama 3.1 70B has 70,553,706,496 parameters{' '}
            <Cite tier={1} href={HF_70B}>
              Meta&apos;s Llama 3.1 70B model metadata
            </Cite>
            , so 1T training tokens is 6ND = 4.23e23 FLOPs. On H100s at 989.5 TFLOPS (trillion FLOPs
            per second), the dense BF16 (bfloat16: 16 bits with the exponent range of FP32, 32-bit
            floating point) peak{' '}
            <Cite tier={1} href={H100_SPEC} kind="vendor-claim">
              NVIDIA H100 specification
            </Cite>
            , and an assumed 40% MFU, inside the 38% to 43% that Llama 3 405B measured{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Table 4
            </Cite>
            , that is about 297,000 H100-hours: 48 days on 256 GPUs, 32 Amazon EC2 (Elastic Compute
            Cloud) p5.48xlarge instances{' '}
            <Cite tier={1} href={EC2_AC} accessed={REGISTER_DATE}>
              Amazon EC2 accelerated computing instance specifications
            </Cite>
            .
          </Box>
          <Box variant="small" color="text-body-secondary">
            Our arithmetic. Assumptions: 6N only with the full parameter count, BF16, MFU 40%, no
            attention term, no restarts or other stages.
          </Box>
          <ExpandableSection headerText="The arithmetic, and Megatron-LM's form of the identity">
            <SpaceBetween size="s">
              <Box variant="p">
                <code>6 x 70,553,706,496 x 1e12 = 4.23e23 FLOPs</code>;{' '}
                <code>4.23e23 / (989.5e12 x 0.40) / 3,600 = 297,093 H100-hours</code>; divided by 256
                GPUs and 24 hours, 48.4 days. The 989.5 is half the 1,979 TFLOPS NVIDIA lists for BF16
                &quot;with sparsity&quot;.
              </Box>
              <Box variant="p">
                Megatron-LM prints its estimate as end-to-end training time of about 8TP/(nX), for T
                training tokens, P parameters, n GPUs and X achieved FLOPs per second per GPU. The 8 is
                6 for the forward and backward passes plus 2 for a recomputed forward pass, so its X
                counts recomputation. Its example, GPT-3&apos;s 175B parameters on 300B tokens over
                1,024 A100s at 140 TFLOPS each, comes to 34 days{' '}
                <Cite tier={3} href={PTDP} venue="SC 2021">
                  Efficient Large-Scale Language Model Training on GPU Clusters, Section 5.1
                </Cite>
                ; <code>8 x 300e9 x 175e9 / (1,024 x 140e12) = 2.93e6 s = 33.9 days</code>, our check.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know when 6N stops being enough: with a causal kernel, attention passes half of Llama 3.1 8B's per-token FLOPs at about 57K tokens"
          >
            Attention: the term 6N leaves out
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The 6N rule counts the multiply-adds against the weights. Attention also multiplies
            activations by activations: each token&apos;s query against every key, then the scores
            against the values. Those matrix multiplies add 12LHQT FLOPs per token across the forward
            and backward passes, for L layers and H heads of dimension Q at sequence length T{' '}
            <Cite tier={3} href={PALM} venue="preprint">
              PaLM, Appendix B
            </Cite>
            . In every Llama 3.1 size the heads times the head dimension equal the hidden size h, so the
            term is 12Lhs, and it grows with the sequence length s while 6N stays fixed (our arithmetic
            from the Llama 3 paper&apos;s Table 3).
          </Box>
          <Box variant="p">
            The sources differ by a factor of two on this term. PaLM and Megatron-LM count the full s x
            s score matrix{' '}
            <Cite tier={3} href={PTDP} venue="SC 2021">
              Efficient Large-Scale Language Model Training on GPU Clusters, Appendix: Floating-point
              operations
            </Cite>
            , Kaplan et al. count half as much{' '}
            <Cite tier={3} href={KAPLAN} venue="preprint">
              Scaling Laws for Neural Language Models, Table 1
            </Cite>
            , and none of the three states a discount for causal masking. A causal kernel computes only
            the scores against earlier tokens, about half of the matrix, which is our reading of the
            gap.
            The diagram and the calculator carry both counts.
          </Box>
          <Box variant="p">
            For Llama 3.1 8B at 8,192 tokens, attention is {pct(b8.causalShare)} of per-token FLOPs
            with a causal kernel and {pct(b8.noDiscountShare, 0)} without the discount, and it passes
            half at about 57K tokens (causal) or 29K. For 70B the shares at 8,192 tokens are{' '}
            {pct(b70.causalShare)} and {pct(b70.noDiscountShare)}, and half falls at about 106K or 53K
            tokens. These shares use the matmul parameter count of the next block; measured against 6N
            with the full count instead, the term adds 13% to 27% to an 8B sequence at 8,192 tokens,
            the figure section 3, One Training Step, quotes. All our arithmetic.
          </Box>
          <AttentionFlopsDiagram />
          <Box variant="small" color="text-body-secondary">
            Our arithmetic from the Llama 3 paper&apos;s Table 3 shapes, computed by Calculator A&apos;s
            own function: 6N with the matmul parameter count, attention 6Lhs with a causal kernel and
            12Lhs without. Percentages under each bar: attention&apos;s share of per-token FLOPs with a
            causal kernel. Each panel has its own scale. Not measured.
          </Box>
          <ExpandableSection headerText="Attention's share of per-token FLOPs at each length">
            <AttentionShareTable />
          </ExpandableSection>
          <Box variant="p">
            At Llama 3&apos;s 8,192-token pre-training length attention is {pct(b70.causalShare, 0)} to{' '}
            {pct(b8.noDiscountShare, 0)} of per-token FLOPs across the two sizes and counts; at a
            128K-token stage it is most of the work for both sizes, which is why
            Meta did not train on long sequences earlier: &quot;the compute in self-attention layers
            grows quadratically in the sequence length&quot;{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.4.2
            </Cite>
            . A budget follows the same logic: price each stage of a run at its own sequence length, with
            the attention term switched on (our reading).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Compare two efficiency figures only when they count the same parameters and the same work: TorchTitan's MFU column and 6N alone differ by a fifth on Llama 3.1 8B at 8K tokens"
          >
            Which parameters, and which FLOPs, count
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">Three choices change the FLOP count behind any MFU figure.</Box>
          <ul>
            <li>
              <strong>Which N.</strong> 6N charges every parameter one multiply-add forward and two
              backward, so strictly N counts the parameters that enter a matrix multiply. The input
              embedding is a table lookup charged 4 x d_model FLOPs per token in the forward pass, while
              the output head is a full matrix multiply{' '}
              <Cite tier={3} href={KAPLAN} venue="preprint">
                Scaling Laws for Neural Language Models, Table 1
              </Cite>
              , so this dive&apos;s matmul count is the layers plus the output head (our reading). Kaplan
              et al. leave the embedding out of N and the output head out of their compute estimate{' '}
              <Cite tier={3} href={KAPLAN} venue="preprint">
                Scaling Laws, Section 2.1
              </Cite>
              , TorchTitan leaves out the embedding table only, and Meta&apos;s model metadata counts
              everything. Counting the embedding overstates the 8B model&apos;s FLOPs by 7%
              (8,030,261,248{' '}
              <Cite tier={1} href={HF_8B}>
                Meta&apos;s Llama 3.1 8B model metadata
              </Cite>{' '}
              against 7,504,658,432 parameters in matrix multiplies, from the untied 128,256-entry
              output head and layer shapes in{' '}
              <Cite tier={1} href={SOURCES.llamaModelCode.url} kind="code" accessed={REGISTER_DATE}>
                llama-models v0.2.0 model.py
              </Cite>
              ) and the 70B model&apos;s by 1.5%, our arithmetic. For Llama 3 405B, 6ND is 3.80e25 FLOPs
              with the full count and 3.78e25 with the matmul count, and both print as Meta&apos;s 3.8e25.
              Calculator A uses the full count by default, the count of its presets and of the
              tokens-per-second figures in section 29, What to Measure in a Run, and offers the other two
              as options.
            </li>
            <li>
              <strong>Which attention term.</strong> TorchTitan v0.4.0 logs MFU as FLOPs per token times tokens per second over the peak{' '}
              <Cite tier={1} href={TT_METRICS} kind="code">
                TorchTitan v0.4.0 metrics.py L115-L135
              </Cite>
              , and counts the FLOPs a third way: 6 times every parameter but the embedding table{' '}
              <Cite tier={1} href={TT_PARAMS} kind="code">
                TorchTitan v0.4.0 flops.py L84-L144
              </Cite>
              , plus attention with no causal discount{' '}
              <Cite tier={1} href={TT_ATTN} kind="code">
                flops.py L20-L51
              </Cite>{' '}
              <Cite tier={1} href={TT_LLAMA} kind="code">
                llama3/model.py L91-L109
              </Cite>
              . At 40% MFU on an H100 and 8,192-token sequences that count gives about 6,800 tokens per
              second for 8B and 820 for 70B, where 6N with the full count gives about 8,200 and 935. A
              run at 4,000 tokens per second on 8B reads as about 23% in TorchTitan&apos;s column and
              about 19.5% by 6N alone. All our arithmetic; the calculator reproduces either count.
            </li>
            <li>
              <strong>Whether recomputed work counts.</strong> A recomputed forward pass is real
              arithmetic that MFU leaves out. Full recomputation adds about a third to the layers&apos;
              FLOPs, &quot;the expected 33%&quot;{' '}
              <Cite tier={3} href={KORTHIKANTI} venue="MLSys 2023">
                Reducing Activation Recomputation, Section 6.2
              </Cite>
              . On one GB10 it lengthened the step of a 1B Llama-shaped model at 2,048 tokens by 14% to
              16% across two runs, below the 30% to 40% Korthikanti et al. observed in their own
              training runs{' '}
              <Cite tier={3} href={KORTHIKANTI} venue="MLSys 2023">
                Reducing Activation Recomputation, Section 1
              </Cite>
              , and MFU fell from 29.0% to 24.9% in one run and from 27.9% to 24.5% in the other{' '}
              <Cite tier={0} href={E2_URL}>
                {E2_TITLE}
              </Cite>
              : the GPU did more arithmetic per token, and MFU, which counts only the model&apos;s, went
              down.
            </li>
          </ul>
          <Box variant="p">
            The same split separates published figures. Megatron-LM&apos;s 52% of peak for a
            1T-parameter model on 3,072 GPUs counts the recomputed forward pass and is measured end to
            end{' '}
            <Cite tier={3} href={PTDP} venue="SC 2021">
              Efficient Large-Scale Language Model Training on GPU Clusters, Section 5.1
            </Cite>
            , so it sits closer to HFU (our reading); Llama 3&apos;s 38% to 43% is MFU in PaLM&apos;s sense{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.2
            </Cite>
            . Comparing the two compares different quantities. Before setting your MFU against a
            published one, check that both count the same N, the same attention term and the same
            treatment of recomputation.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick the denominator that makes an MFU comparable: an H100's BF16 peak is 989.5 TFLOPS, half the figure NVIDIA prints"
          >
            Divide by the dense peak at the training precision
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            MFU divides by the dense peak at the precision the run trains in. NVIDIA&apos;s product
            pages print the figure with 2:4 structured sparsity, which dense training matrix multiplies
            do not use: the H100 page lists 1,979 TFLOPS for BF16 &quot;with sparsity&quot;{' '}
            <Cite tier={1} href={H100_SPEC} kind="vendor-claim">
              NVIDIA H100 specification
            </Cite>
            , and the HGX page notes that dense is half the sparse figure it shows for B200{' '}
            <Cite tier={1} href={HGX_SPEC} kind="vendor-claim">
              NVIDIA HGX specification
            </Cite>
            . The BF16 denominators are therefore 989.5 TFLOPS per H100, the same per H200{' '}
            <Cite tier={1} href={SOURCES.h200.url} kind="vendor-claim" accessed={REGISTER_DATE}>
              NVIDIA H200 specification
            </Cite>
            , 2,250 per B200, and 667 per Trainium2 chip, which AWS lists as a dense figure{' '}
            <Cite tier={1} href={TRN2_SPEC} kind="vendor-claim" accessed={REGISTER_DATE}>
              AWS Neuron documentation, Trainium2
            </Cite>
            . Llama 3&apos;s own numbers fit the dense H100 peak: 430 TFLOPS per GPU at 43% MFU implies a
            denominator of about 1,000{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Table 4
            </Cite>
            . Divided by the sparse figure, every MFU halves.
          </Box>
          <Box variant="p">
            The denominator a framework uses is a line of code worth reading. TorchTitan v0.4.0 divides by
            989 TFLOPS on an H100. For Trainium2 it charges each rank 79 TFLOPS per NeuronCore times the
            two NeuronCores a rank drives at LNC (logical NeuronCore configuration) 2, and a GPU missing
            from its table falls back to the A100&apos;s 312 TFLOPS with a logged warning{' '}
            <Cite tier={1} href={TT_PEAKS} kind="code">
              TorchTitan v0.4.0 tools/utils.py L111-L232
            </Cite>
            . That is 632 TFLOPS per Trainium2 chip, 79 per core over the chip&apos;s eight cores{' '}
            <Cite tier={1} href={TRN2_SPEC} kind="vendor-claim" accessed={REGISTER_DATE}>
              AWS Neuron documentation, Trainium2
            </Cite>
            , below the 667 the chip page lists, so a TorchTitan MFU on Trainium2 reads about 5.5% higher
            than one against 667 (our arithmetic). Convert before comparing:{' '}
            <code>MFU against 667 = printed MFU x 632 / 667</code>. Our reading of the code; check the
            denominator in the log before trusting an MFU column on new hardware.
          </Box>
          <ExpandableSection headerText="Our DGX Spark run: one step against a measured and a missing denominator">
            <Box variant="p">
              NVIDIA&apos;s DGX Spark hardware page gives its compute as up to 1 PFLOP (petaFLOP) at FP4
              (4-bit floating point) &quot;with sparsity&quot; and lists no BF16 peak{' '}
              <Cite tier={1} href={SPARK_HW} kind="vendor-claim">
                NVIDIA DGX Spark hardware overview
              </Cite>
              , so the run measured one. A sweep of BF16 matrix multiplies on one GB10 peaked at 96.2
              and 97.3 TFLOPS in two runs, and a 1B Llama-shaped model at 2,048 tokens trained at 29.0%
              and 27.9% MFU against that measured ceiling, or 30.5% and 29.5% with causal attention FLOPs
              counted{' '}
              <Cite tier={0} href={E2_URL}>
                {E2_TITLE}
              </Cite>
              . TorchTitan v0.4.0&apos;s table has no GB10 entry, so its log would divide the same run by
              the A100&apos;s 312 TFLOPS: about 9% at the same FLOP count (our arithmetic). An MFU
              compares with another only when both use the same denominator and the same FLOP count. The
              GB10 itself is covered in the{' '}
              <Link href="../silicon-memory-inference/">
                Silicon, Memory and Modern Inference dive, section 17: Edge Shared-Memory Silicon: DGX
                Spark and Jetson
              </Link>
              .
            </Box>
          </ExpandableSection>
          <Box variant="p">
            Calculator A fixes BF16, the precision of Llama 3&apos;s measured range. For FP8 (8-bit
            floating point), NVIDIA&apos;s Megatron Bridge performance archive lists model TFLOPS per
            GPU for Llama 3 pre-training: 731 on 64 H100s for 70B, and 1,576 on 8 B200s for 8B{' '}
            <Cite tier={1} href={MB_ARCHIVE} kind="vendor-claim">
              NVIDIA Megatron Bridge 0.7.0 performance archive
            </Cite>
            . Against dense FP8 peaks of 1,979 TFLOPS for H100 and 4,500 for B200, half of each
            page&apos;s sparse figure, those are 36.9% and 35.0%, and the archive&apos;s Llama
            pre-training rows on H100 and B200, in FP8 and MXFP8 (microscaled FP8), run from about 34%
            to 42%, most of them between 34% and 38%. Our arithmetic on NVIDIA&apos;s claims, with the
            archive silent on how it counts model FLOPs. An FP8 estimate divides by the FP8 dense peak;
            section 6, Precision for Training, covers what FP8 changes.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Trust the estimate as far as one published run supports it: 6ND reproduces Meta's 3.8e25-FLOP budget for Llama 3 405B, and the published hours are 1.1 to 1.3 times the estimate"
          >
            The check against Llama 3 405B
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Meta pre-trained Llama 3 405B on 15.6T tokens for a budget of 3.8e25 FLOPs, on up to 16K
            H100s{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Sections 1, 3.2.1 and 3.3.1
            </Cite>
            . With N = 405,853,388,800{' '}
            <Cite tier={1} href={HF_405B}>
              Meta&apos;s Llama 3.1 405B model metadata
            </Cite>
            , <code>6ND = 6 x 405.85e9 x 15.6e12 = 3.80e25 FLOPs</code>: 6ND reproduces Meta&apos;s own
            3.8e25-FLOP budget, our arithmetic. The paper does not state how it counts FLOPs, and its
            scaling-law pairing for the same budget, 402B parameters on 16.55T tokens, comes to 3.99e25
            by 6ND{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.2.1
            </Cite>
            , so the match holds for the configuration Meta trained and says nothing about Meta&apos;s
            counting rule.
          </Box>
          <Box variant="p">
            The run measured 380 to 430 TFLOPS per GPU, 38% to 43% MFU, across its three published
            layouts{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Table 4
            </Cite>
            . At those rates 3.80e25 FLOPs is 24.5M to 27.8M GPU-hours. The Llama 3.1 model card
            publishes 30.84M GPU-hours for 405B{' '}
            <Cite tier={1} href={LLAMA_CARD}>
              Llama 3.1 model card, llama-models v0.2.0
            </Cite>
            , 1.1 to 1.3 times the estimate, our arithmetic. The card calls its figure &quot;the total
            GPU time required for training each model&quot; and does not split it by stage, so the
            gap cannot be attributed from these sources. It is consistent with what a run
            spends beyond steady 8K pre-training: a long-context stage at 38% MFU, annealing,
            post-training and work lost to interruptions (our reading).
          </Box>
          <ExpandableSection headerText="The same card's 8B and 70B hours">
            <Box variant="p">
              The same card&apos;s 8B and 70B hours, 1.46M and 7.0M, are about 2.9 and 1.6 times a
              40%-MFU estimate at 15T tokens. The card gives the tokens as &quot;15T+&quot;, so those
              ratios are upper bounds.
            </Box>
          </ExpandableSection>
          <ExpandableSection headerText="Published MFU, and what each figure counts">
            <ul>
              <li>
                <strong>PaLM 540B:</strong> 46.2% MFU with attention FLOPs counted, 45.7% without, at
                238.3K tokens per second on 6,144 TPU (Tensor Processing Unit) v4 chips; 57.8% HFU once rematerialization
                (recomputation) is counted{' '}
                <Cite tier={3} href={PALM} venue="preprint">
                  PaLM, Section 4.1
                </Cite>
                .
              </li>
              <li>
                <strong>MegaScale:</strong> 55.2% for a 175B model on 12,288 Ampere GPUs at 2,048
                tokens, against Megatron-LM&apos;s 41.2% at the same 6,144-sequence batch. In its
                256-GPU ablation, model changes (a parallel transformer block and sliding-window
                attention) supplied 5.6 of the 17.6 points gained, and a tripled batch, made possible
                by a change of optimizer, 3.0{' '}
                <Cite tier={3} href={MEGASCALE} venue="NSDI 2024">
                  MegaScale, Section 6.1
                </Cite>
                .
              </li>
              <li>
                <strong>Llama 3 405B:</strong> 43% on 8,192 H100s, 41% on 16,384, and 38% on 16,384 at
                131,072-token sequences{' '}
                <Cite tier={3} href={LLAMA3} venue="preprint">
                  Llama 3 Herd of Models, Table 4
                </Cite>
                . Meta reports MFU without stating whether attention FLOPs are counted.
              </li>
              <li>
                <strong>DeepSeek-V3:</strong> 2.788M H800 GPU-hours in total and 180K per trillion
                pre-training tokens; DeepSeek-V3 reports no MFU{' '}
                <Cite tier={3} href={DEEPSEEK} venue="preprint">
                  DeepSeek-V3 Technical Report, Section 1
                </Cite>
                .
              </li>
            </ul>
          </ExpandableSection>
          <Box variant="p">
            With the card silent on what its hours include, the 405B ratio is a single data point.
            Calculator A applies no overhead factor, so read its hours as the steady-state floor of a
            run.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Set D before you price it: compute-optimal is about 20 tokens per parameter, and a model served many times trains on far more"
          >
            How many tokens
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Scaling laws enter the estimate only through D. Chinchilla&apos;s compute-optimal rule
            grows parameters and tokens together, and its projections work out to about 20 tokens per
            parameter: 1B parameters on 20.2B tokens, 10B on 205.1B, 67B on 1.5T{' '}
            <Cite tier={3} href={CHINCHILLA} venue="preprint">
              Training Compute-Optimal Large Language Models, Table 3
            </Cite>
            . Production models train far past that on purpose: Meta trained its smaller Llama 3 models
            &quot;much longer than is compute-optimal&quot; because they &quot;perform better than
            compute-optimal models at the same inference budget&quot;{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 1
            </Cite>
            . Llama 3.1 8B saw at least 1,870 tokens per parameter: the card&apos;s &quot;15T+&quot;
            training tokens{' '}
            <Cite tier={1} href={LLAMA_CARD_TOKENS}>
              Llama 3.1 model card, training data
            </Cite>{' '}
            over 8.03B parameters{' '}
            <Cite tier={1} href={HF_8B}>
              Meta&apos;s Llama 3.1 8B model metadata
            </Cite>
            . A model that will serve many requests is sized for its inference cost, and its training
            bill grows with D (our reading of these sources).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Estimate your own run's accelerator-hours, days and price with every assumption visible, then replace the 40% with the MFU of a measured step"
          >
            Calculator A: run time and accelerator-hours
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The presets reproduce this section&apos;s worked numbers, from 297,000 H100-hours for 70B
            on 1T tokens to the 405B check, where 6ND reproduces Meta&apos;s 3.8e25-FLOP budget and 41%
            MFU gives 26.0M GPU-hours. The default count is 6N with the full parameter count and no
            attention term; the attention select and the TorchTitan button change it. A p5en.48xlarge
            gives the same hours as a p5.48xlarge because the H200&apos;s dense peak is the H100&apos;s
            (our reading).
          </Box>
          <CalculatorA />
          <ExpandableSection headerText="A2 protocol (not yet run)">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>What it would measure.</strong> Tokens per second, MFU against 989.5 TFLOPS,
                peak memory and EFA (Elastic Fabric Adapter) bytes per step for Llama 3.1 8B in
                TorchTitan v0.4.0: FSDP (Fully Sharded Data Parallel) over 8 GPUs on one instance, and
                flat FSDP over 16 and HSDP (hybrid sharded data parallel, shard 8, replicate 2) on two,
                each with and without deferred gradient reduction, at 8 micro-batches of 8,192 tokens (
                <Link external href={GUIDE_URL}>
                  research guide, section 5
                </Link>
                ).
              </Box>
              <Box variant="p">
                <strong>On what.</strong> Two p5.48xlarge.
              </Box>
              <Box variant="p">
                <strong>Prediction, our reading and not a result.</strong> The research guide predicts
                traffic and memory for these layouts (section 8, Data Parallelism &amp; Sharding, carries them) and states no MFU;
                the run would put a measured H100 figure beside this calculator&apos;s 40% assumption.
              </Box>
              <Box variant="p">
                <strong>Cost.</strong> About three hours, run with two other experiments in one 7-hour
                window: $771 On-Demand at $55.04 per instance-hour in us-east-1 on 2026-10-30{' '}
                <Cite tier={1} href={EC2_PRICE_USE1} accessed={REGISTER_DATE}>
                  AWS Price List, AmazonEC2 us-east-1, version 20261029175634
                </Cite>
                , or $2,292 for a one-day Capacity Block for two instances at $47.757 per
                instance-hour in US East (N. Virginia) on 2026-10-30, a block being charged at the
                price quoted at purchase{' '}
                <Cite tier={1} href={CB_PRICING} accessed={REGISTER_DATE}>
                  EC2 Capacity Blocks pricing
                </Cite>
                . Teardown: one stack, deleted at the end and verified by listing instances by the
                stack&apos;s tag.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <ExpandableSection headerText="A5 protocol (not yet run)">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>What it would measure.</strong> Tokens per second and MFU against 667 TFLOPS
                per Trainium2 chip over 200 steps of the Llama3-8B layout TorchTitan Neuron validates
                on one trn2.48xlarge, TP (tensor parallelism) 4 x FSDP 16 across 64 ranks{' '}
                <Cite tier={1} href={TT_NEURON} accessed={REGISTER_DATE}>
                  aws-neuron-sdk v2.33.0, TorchTitan Neuron overview
                </Cite>{' '}
                (
                <Link external href={GUIDE_URL}>
                  research guide, section 5
                </Link>
                ). The trainer prints MFU against 632 per chip{' '}
                <Cite tier={1} href={TTN_PEAK} kind="code">
                  torchtitan-neuron release-2.33.0 tools/utils.py L194-L206
                </Cite>
                , so the run would convert it with the formula in Divide by the dense peak at the training
                precision, above.
              </Box>
              <Box variant="p">
                <strong>On what.</strong> A SageMaker training job on one ml.trn2.48xlarge in
                us-east-2.
              </Box>
              <Box variant="p">
                <strong>Prediction, our reading and not a result.</strong> The research guide states
                none; the run would replace the 40% that this calculator&apos;s Trainium2 rows assume.
              </Box>
              <Box variant="p">
                <strong>Cost.</strong> About three hours at $97.52 per instance-hour, the training-job
                rate in US East (Ohio) on 2026-10-30, so about $293{' '}
                <Cite tier={1} href={SAGEMAKER_PRICE_USE2} accessed={REGISTER_DATE}>
                  AWS Price List, AmazonSageMaker us-east-2, version 20261029165009
                </Cite>
                . Teardown: the job ends itself; the warm-pool keep-alive stays at 0 so no instance is
                kept, because a warm pool is billed while it waits{' '}
                <Cite tier={1} href={WARM_POOLS} accessed={REGISTER_DATE}>
                  SageMaker managed warm pools
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            Run the preset nearest your plan, then put in your own model, tokens and instance. At
            bring-up, measure tokens per second on one node (section 31, Bring-Up), turn it into MFU with
            the same FLOP count this calculator uses, and move the slider to the measured figure.
            Section 14, Set My Ranks, takes the compute time of each step from the same identity, and
            section 22, Capacity &amp; Cost, prices the hours across every purchase path.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
