import { useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import {
  Cite,
  arxiv,
  gh,
  ACCELERATE_TAG,
  MEGATRON_TAG,
  NEMO_AUTOMODEL_TAG,
  NEURON_SDK_SHA,
  TORCHTITAN_NEURON_TAG,
  TORCHTITAN_TAG,
  TRANSFORMER_ENGINE_TAG,
} from '../components/Cite';
import { useNarrow } from '../components/useNarrow';

/* ------------------------------------------------------------------------ */
/* Sources (every one re-opened 2026-10-31)                                 */
/* ------------------------------------------------------------------------ */

/** Micikevicius et al., Mixed Precision Training (ICLR 2018): Sec 3.1 master copy, Sec 3.2 loss scaling, Sec 6. */
const MPT = arxiv('1710.03740v3');
/** Kalamkar et al., A Study of BFLOAT16 for Deep Learning Training: Sec 3 and Table 1. */
const BF16_STUDY = arxiv('1905.12322v3');
/** Micikevicius et al., FP8 Formats for Deep Learning: Sec 2, Sec 3 Table 1, Sec 4 and Table 4. */
const FP8_FORMATS = arxiv('2209.05433v2');
/** DeepSeek-V3 Technical Report: Sec 3.3 (FP8 training). */
const DEEPSEEK_V3 = arxiv('2412.19437v2');
/** Rouhani et al., Microscaling Data Formats for Deep Learning: Sec 4.1 compute flow. */
const MX_PAPER = arxiv('2310.10537v3');
/** NVIDIA, Pretraining Large Language Models with NVFP4: Sec 2, Sec 3, Sec 4.1. */
const NVFP4_PAPER = arxiv('2509.25149v2');
/** Rajbhandari et al., ZeRO: Sec 3.1 (16 bytes per parameter for mixed-precision Adam). */
const ZERO = arxiv('1910.02054v3');
/** The Llama 3 Herd of Models: Sec 3.3.2 and Table 4 (38% to 43% BF16 MFU). */
const LLAMA3 = arxiv('2407.21783v3');
/** OCP Microscaling Formats (MX) Specification v1.0 (Wayback copy; the OCP site blocks direct fetches). */
const OCP_MX =
  'https://web.archive.org/web/20251208023552/https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf';

/** NVIDIA spec sheets (vendor specifications; sparse figures, dense is half). */
const H100_SPEC = 'https://www.nvidia.com/en-us/data-center/h100/';
const H200_SPEC = 'https://www.nvidia.com/en-us/data-center/h200/';
const HGX_SPEC = 'https://www.nvidia.com/en-us/data-center/hgx/';
/** EC2 accelerated computing instance specifications (accelerator per instance type). */
const EC2_AC = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';
/** Meta's Hugging Face model metadata for Llama 3.1 70B (exact parameter count). */
const HF_LLAMA_70B = 'https://huggingface.co/api/models/meta-llama/Llama-3.1-70B';
/** NVIDIA Megatron Bridge 0.7.0 performance summary archive (vendor benchmark). */
const MBRIDGE_PERF = 'https://docs.nvidia.com/nemo/megatron-bridge/0.7.0/performance-summary-archive.html';

/** Transformer Engine v2.21.0. */
const TE = 'NVIDIA/TransformerEngine';
const TE_RECIPE_PATH = 'transformer_engine/common/recipe/__init__.py';
const TE_FORMATS = gh(TE, TRANSFORMER_ENGINE_TAG, TE_RECIPE_PATH, 'L29-L52');
const TE_TENSOR_RECIPES = gh(TE, TRANSFORMER_ENGINE_TAG, TE_RECIPE_PATH, 'L176-L321');
const TE_BLOCK_RECIPES = gh(TE, TRANSFORMER_ENGINE_TAG, TE_RECIPE_PATH, 'L345-L430');
const TE_NVFP4_RECIPE = gh(TE, TRANSFORMER_ENGINE_TAG, TE_RECIPE_PATH, 'L502-L530');
const TE_GATES = gh(TE, TRANSFORMER_ENGINE_TAG, 'transformer_engine/pytorch/quantization.py', 'L151-L187');
const TE_DEFAULT = gh(TE, TRANSFORMER_ENGINE_TAG, 'transformer_engine/pytorch/quantization.py', 'L261-L273');

/** Megatron Core core_v0.20.0 low-precision training guide and config. */
const MG = 'NVIDIA/Megatron-LM';
const MG_GUIDE_PATH = 'docs/user-guide/features/low_precision_training.md';
const MG_RECIPES = gh(MG, MEGATRON_TAG, MG_GUIDE_PATH, 'L39-L46');
const MG_BLOCKWISE = gh(MG, MEGATRON_TAG, MG_GUIDE_PATH, 'L140-L151');
const MG_STABILITY = gh(MG, MEGATRON_TAG, MG_GUIDE_PATH, 'L200');
const MG_MEMORY = gh(MG, MEGATRON_TAG, MG_GUIDE_PATH, 'L211-L213');
const MG_H100 = gh(MG, MEGATRON_TAG, MG_GUIDE_PATH, 'L232-L242');
const MG_B200 = gh(MG, MEGATRON_TAG, MG_GUIDE_PATH, 'L244-L253');
const MG_FP8_DEFAULT = gh(MG, MEGATRON_TAG, 'megatron/core/transformer/transformer_config.py', 'L664-L676');

/** TorchTitan v0.4.0. */
const TT_RELEASE = `https://github.com/pytorch/torchtitan/releases/tag/${TORCHTITAN_TAG}`;
const TT_QUANT = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/quantization/README.md', 'L1-L18');
const TT_MXFP8 = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/quantization/mxfp8/README.md', 'L1-L36');

/** Accelerate v1.15.0 and NeMo AutoModel v0.7.0. */
const ACCELERATE_FP8 = gh('huggingface/accelerate', ACCELERATE_TAG, 'docs/source/usage_guides/low_precision_training.md', 'L33');
const AUTOMODEL_FP8 = gh('NVIDIA-NeMo/Automodel', NEMO_AUTOMODEL_TAG, 'README.md', 'L168-L169');

/** AWS Neuron SDK 2.33 documentation, pinned to the repository commit. */
const NEURON = 'aws-neuron/aws-neuron-sdk';
const NEURON_NC3 = gh(NEURON, NEURON_SDK_SHA, 'about-neuron/arch/neuron-hardware/neuron-core-v3.rst', 'L25-L29');
const NEURON_DTYPES = gh(NEURON, NEURON_SDK_SHA, 'about-neuron/arch/neuron-features/data-types.rst', 'L98-L105');
const NEURON_TRN2 = gh(NEURON, NEURON_SDK_SHA, 'about-neuron/arch/neuron-hardware/trainium2.rst', 'L7-L27');
const NEURON_TRN3 = gh(NEURON, NEURON_SDK_SHA, 'about-neuron/arch/neuron-hardware/trainium3.rst', 'L29-L79');
const NEURON_TORCH = gh(NEURON, NEURON_SDK_SHA, 'torch/about-pytorch-neuron.rst', 'L117-L118');
const NEURON_TN_BETA = gh(NEURON, NEURON_SDK_SHA, 'release-notes/components/torchneuron.rst', 'L18-L20');
const NEURON_TN_MX = gh(NEURON, NEURON_SDK_SHA, 'release-notes/components/torchneuron.rst', 'L186-L187');
const TTN_MXFP8 = gh('aws-neuron/torchtitan-neuron', TORCHTITAN_NEURON_TAG, 'torchtitan_neuron/docs/neuron_mxfp8.md', 'L1-L16');

/* ------------------------------------------------------------------------ */
/* Diagram: where the scale factor lives                                    */
/* ------------------------------------------------------------------------ */

const ink = '#16191f';
const muted = '#414d5c';
const font = 'sans-serif';

const blue = { fill: '#f2f8fd', stroke: '#0972d3' };
const amber = { fill: '#fbf3d5', stroke: '#8b6c00' };
const purple = { fill: '#efe7fb', stroke: '#6f4cc4' };
const teal = { fill: '#e6f4f2', stroke: '#1f7a70' };

interface Rung {
  head: string;
  /** Lines under the graphic (wide layout) or beside it (narrow layout). */
  wide: string[];
  narrow: string[];
}

const RUNGS: Rung[] = [
  {
    head: 'Model',
    wide: ['FP16: one loss scale', 'shared by every tensor;', "BF16 has FP32's range", 'and needs no scale'],
    narrow: ['FP16: one loss scale shared', 'by every tensor. BF16 has', "FP32's range, so no scale."],
  },
  {
    head: 'Tensor',
    wide: ['FP8: one scale per tensor,', 'E4M3 for weights and', 'activations, E5M2 for', 'gradients'],
    narrow: ['FP8: one scale per tensor,', 'E4M3 for weights and', 'activations, E5M2 for', 'gradients'],
  },
  {
    head: 'Block and tile',
    wide: ['DeepSeek-V3: one scale', 'per 128 x 128 weight', 'block and per 1 x 128', 'activation tile'],
    narrow: ['DeepSeek-V3: one scale per', '128 x 128 weight block and', 'per 1 x 128 activation tile'],
  },
  {
    head: 'Runs of 32 and 16',
    wide: ['MXFP8: one power-of-two', 'scale per 32 values;', 'NVFP4: one E4M3 scale', 'per 16, plus one per tensor'],
    narrow: ['MXFP8: one 8-bit power-', 'of-two scale per 32 values.', 'NVFP4: one E4M3 scale per', '16, plus one FP32 per tensor'],
  },
];

/** Panel 1: several tensors inside one model-wide loss scale; the top-right tensor is highlighted. */
function ModelGlyph({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const cols = 3;
  const rows = 2;
  const pad = 10;
  const gap = 10;
  const tw = (w - 2 * pad - (cols - 1) * gap) / cols;
  const th = (h - 2 * pad - (rows - 1) * gap) / rows;
  const cells: ReactNode[] = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const hot = r === 0 && c === cols - 1;
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={x + pad + c * (tw + gap)}
          y={y + pad + r * (th + gap)}
          width={tw}
          height={th}
          rx={3}
          fill={hot ? blue.fill : '#ffffff'}
          stroke={hot ? blue.stroke : '#879596'}
          strokeWidth={hot ? 2 : 1}
        />,
      );
    }
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="#f8f8f8" stroke={muted} strokeWidth={1.5} strokeDasharray="6 4" />
      {cells}
    </g>
  );
}

/** Panel 2: one weight matrix as a grid of blocks; the top-right block is highlighted. */
function TensorGlyph({ x, y, s }: { x: number; y: number; s: number }) {
  const n = 4;
  const b = s / n;
  const lines: ReactNode[] = [];
  for (let i = 1; i < n; i += 1) {
    lines.push(<line key={`v${i}`} x1={x + i * b} y1={y} x2={x + i * b} y2={y + s} stroke="#9fc6ea" strokeWidth={1} />);
    lines.push(<line key={`h${i}`} x1={x} y1={y + i * b} x2={x + s} y2={y + i * b} stroke="#9fc6ea" strokeWidth={1} />);
  }
  return (
    <g>
      <rect x={x} y={y} width={s} height={s} fill={blue.fill} stroke={blue.stroke} strokeWidth={1.5} />
      {lines}
      <rect x={x + (n - 1) * b} y={y} width={b} height={b} fill={amber.fill} stroke={amber.stroke} strokeWidth={2} />
    </g>
  );
}

/** Panel 3: one 128 x 128 block with a 1 x 128 row tile highlighted. */
function BlockGlyph({ x, y, s, fs }: { x: number; y: number; s: number; fs: number }) {
  const stripY = y + 10;
  const stripH = 14;
  return (
    <g>
      <rect x={x} y={y} width={s} height={s} fill={amber.fill} stroke={amber.stroke} strokeWidth={1.5} />
      <rect x={x} y={stripY} width={s} height={stripH} fill={purple.fill} stroke={purple.stroke} strokeWidth={2} />
      <text x={x + s / 2} y={stripY + stripH + fs + 6} fontFamily={font} fontSize={fs} fill={purple.stroke} textAnchor="middle" fontWeight={600}>
        1 x 128 tile
      </text>
      <text x={x + s / 2} y={y + s - fs - 16} fontFamily={font} fontSize={fs + 1} fill={amber.stroke} textAnchor="middle" fontWeight={600}>
        128 x 128
      </text>
      <text x={x + s / 2} y={y + s - 10} fontFamily={font} fontSize={fs} fill={amber.stroke} textAnchor="middle">
        weight block
      </text>
    </g>
  );
}

/** Panel 4: the 1 x 128 tile as four MXFP8 blocks of 32 and eight NVFP4 blocks of 16. */
function RunsGlyph({ x, y, w, fs, barH, bar2Gap }: { x: number; y: number; w: number; fs: number; barH: number; bar2Gap: number }) {
  const y2 = y + barH + bar2Gap;
  const seg = (count: number, top: number, c: { fill: string; stroke: string }) =>
    Array.from({ length: count }, (_, i) => (
      <rect
        key={`${count}-${i}`}
        x={x + (i * w) / count}
        y={top}
        width={w / count}
        height={barH}
        fill={c.fill}
        stroke={c.stroke}
        strokeWidth={1.5}
      />
    ));
  return (
    <g>
      {seg(4, y, purple)}
      <text x={x + w / 2} y={y + barH + fs + 5} fontFamily={font} fontSize={fs} fill={purple.stroke} textAnchor="middle" fontWeight={600}>
        4 blocks of 32
      </text>
      {seg(8, y2, teal)}
      <text x={x + w / 2} y={y2 + barH + fs + 5} fontFamily={font} fontSize={fs} fill={teal.stroke} textAnchor="middle" fontWeight={600}>
        8 blocks of 16
      </text>
    </g>
  );
}

/** Below this container width (px) the wide layout's 12-unit text would paint under about 9px. */
const LADDER_NARROW_PX = 680;

function ScaleLadderDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, LADDER_NARROW_PX);
  return <div ref={ref}>{narrow ? <ScaleLadderNarrow /> : <ScaleLadderWide />}</div>;
}

const LADDER_TITLE =
  'Where the scale factor lives, as four zooms into one model. FP16 shares one loss scale across every tensor in the model, and BF16 needs none. FP8 with per-tensor scaling gives each weight matrix its own scale. DeepSeek-V3 gives each 128 by 128 block of a weight matrix, and each 1 by 128 tile of activations, its own scale. MXFP8 shares one 8-bit power-of-two scale across each run of 32 values, and NVFP4 one E4M3 scale across each run of 16 values plus one FP32 scale per tensor. Each step down in bits moves the scale closer to the data.';

function ScaleLadderWide() {
  const W = 900;
  const H = 384;
  const x0 = 24;
  const pw = 198;
  const gap = 20;
  const px = (i: number) => x0 + i * (pw + gap);
  const gy = 90;
  const gh = 150;
  const sq = 150;
  const sqx = (i: number) => px(i) + (pw - sq) / 2;
  const textTop = 266;
  const fs = 12;

  // Zoom connectors: from the highlighted part of one panel to the next panel's graphic.
  const mPad = 10;
  const mGap = 10;
  const mTw = (pw - 2 * mPad - 2 * mGap) / 3;
  const mTh = (gh - 2 * mPad - mGap) / 2;
  const hotTensor = { x: px(0) + mPad + 2 * (mTw + mGap), y: gy + mPad, w: mTw, h: mTh };
  const hotBlock = { x: sqx(1) + (3 * sq) / 4, y: gy, w: sq / 4, h: sq / 4 };
  const strip = { x: sqx(2), y: gy + 10, w: sq, h: 14 };
  const barX = px(3) + 4;
  const barW = pw - 8;
  const barY = gy + 14;
  const barH = 22;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="precision-ladder-title" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <title id="precision-ladder-title">{LADDER_TITLE}</title>
      <defs>
        <marker id="precision-ladder-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={muted} />
        </marker>
      </defs>
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
      <text x={x0} y={26} fontFamily={font} fontSize={15} fontWeight={600} fill={ink}>
        How many values share one scale factor
      </text>
      <text x={x0} y={45} fontFamily={font} fontSize={fs} fill={muted}>
        Each panel zooms into the highlighted part of the panel before it
      </text>

      {RUNGS.map((r, i) => (
        <text key={r.head} x={px(i) + pw / 2} y={76} fontFamily={font} fontSize={14} fontWeight={600} fill={ink} textAnchor="middle">
          {`${i + 1}. ${r.head}`}
        </text>
      ))}

      <ModelGlyph x={px(0)} y={gy} w={pw} h={gh} />
      <TensorGlyph x={sqx(1)} y={gy} s={sq} />
      <BlockGlyph x={sqx(2)} y={gy} s={sq} fs={fs} />
      <RunsGlyph x={barX} y={barY} w={barW} fs={fs} barH={barH} bar2Gap={38} />

      <g stroke={muted} strokeWidth={1} strokeDasharray="4 3" fill="none">
        <line x1={hotTensor.x + hotTensor.w} y1={hotTensor.y} x2={sqx(1)} y2={gy} />
        <line x1={hotTensor.x + hotTensor.w} y1={hotTensor.y + hotTensor.h} x2={sqx(1)} y2={gy + sq} />
        <line x1={hotBlock.x + hotBlock.w} y1={hotBlock.y} x2={sqx(2)} y2={gy} />
        <line x1={hotBlock.x + hotBlock.w} y1={hotBlock.y + hotBlock.h} x2={sqx(2)} y2={gy + sq} />
        <line x1={strip.x + strip.w} y1={strip.y} x2={barX} y2={barY} />
        <line x1={strip.x + strip.w} y1={strip.y + strip.h} x2={barX} y2={barY + barH} />
      </g>

      {RUNGS.map((r, i) =>
        r.wide.map((line, j) => (
          <text
            key={`${r.head}-${line}`}
            x={px(i) + pw / 2}
            y={textTop + j * 17}
            fontFamily={font}
            fontSize={fs}
            fontWeight={j === 0 ? 600 : 400}
            fill={j === 0 ? ink : muted}
            textAnchor="middle"
          >
            {line}
          </text>
        )),
      )}

      <line x1={x0} y1={H - 18} x2={W - x0} y2={H - 18} stroke={muted} strokeWidth={1.5} markerEnd="url(#precision-ladder-ah)" />
      <text x={W / 2} y={H - 27} fontFamily={font} fontSize={fs} fontWeight={600} fill={muted} textAnchor="middle">
        fewer bits per value, so the scale moves closer to the data
      </text>
    </svg>
  );
}

function ScaleLadderNarrow() {
  const W = 380;
  const gx = 12;
  const gw = 112;
  const tx = 138;
  const top = 60;
  const rowH = 104;
  const rowGap = 28;
  const H = top + 4 * rowH + 3 * rowGap + 46;
  const rowY = (i: number) => top + i * (rowH + rowGap);
  const sq = 96;
  const sqX = gx + (gw - sq) / 2;
  const fs = 12;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby="precision-ladder-narrow-title"
      style={{ width: '100%', height: 'auto', display: 'block', maxWidth: 520, margin: '0 auto' }}
    >
      <title id="precision-ladder-narrow-title">{LADDER_TITLE}</title>
      <defs>
        <marker id="precision-ladder-narrow-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={muted} />
        </marker>
      </defs>
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
      <text x={gx} y={24} fontFamily={font} fontSize={14} fontWeight={600} fill={ink}>
        How many values share one scale factor
      </text>
      <text x={gx} y={42} fontFamily={font} fontSize={fs} fill={muted}>
        Each row zooms into the highlighted part above it
      </text>

      <ModelGlyph x={gx} y={rowY(0)} w={gw} h={sq} />
      <TensorGlyph x={sqX} y={rowY(1)} s={sq} />
      <BlockGlyph x={sqX} y={rowY(2)} s={sq} fs={fs} />
      <RunsGlyph x={gx} y={rowY(3) + 2} w={gw} fs={fs} barH={18} bar2Gap={34} />

      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={gx + gw / 2}
          y1={rowY(i) + sq + 4}
          x2={gx + gw / 2}
          y2={rowY(i + 1) - 4}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd="url(#precision-ladder-narrow-ah)"
        />
      ))}

      {RUNGS.map((r, i) => (
        <g key={r.head}>
          <text x={tx} y={rowY(i) + 14} fontFamily={font} fontSize={14} fontWeight={600} fill={ink}>
            {`${i + 1}. ${r.head}`}
          </text>
          {r.narrow.map((line, j) => (
            <text key={line} x={tx} y={rowY(i) + 34 + j * 17} fontFamily={font} fontSize={fs} fill={muted}>
              {line}
            </text>
          ))}
        </g>
      ))}

      <text x={gx} y={H - 26} fontFamily={font} fontSize={fs} fontWeight={600} fill={muted}>
        Fewer bits per value, so the scale moves
      </text>
      <text x={gx} y={H - 9} fontFamily={font} fontSize={fs} fontWeight={600} fill={muted}>
        closer to the data.
      </text>
    </svg>
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

function BillTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>Llama 3.1 70B, 1T tokens, H100</th>
            <th style={headCell}>BF16</th>
            <th style={headCell}>FP8</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cell}>Dense peak per GPU (vendor specification)</td>
            <td style={cell}>989.5 TFLOPS</td>
            <td style={cell}>1,979 TFLOPS</td>
          </tr>
          <tr>
            <td style={cell}>H100-hours at 40% MFU</td>
            <td style={cell}>297,000</td>
            <td style={cell}>about 148,500, an upper bound on the gain</td>
          </tr>
          <tr>
            <td style={cell}>
              <strong>Model state, 16 bytes per parameter</strong>
            </td>
            <td style={cell}>
              <strong>1,128.9 GB</strong>
            </td>
            <td style={cell}>
              <strong>1,128.9 GB</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

interface AcceleratorEntry {
  name: string;
  peak: ReactNode;
  formats: ReactNode;
  path: ReactNode;
}

function AcceleratorList({ entries }: { entries: AcceleratorEntry[] }) {
  return (
    <ColumnLayout columns={2} variant="text-grid">
      {entries.map((e) => (
        <div key={e.name}>
          <Box variant="h4">{e.name}</Box>
          <ul style={{ paddingLeft: '18px', margin: '4px 0 0 0' }}>
            <li>
              <strong>Dense peak per chip:</strong> {e.peak}
            </li>
            <li>
              <strong>Formats and recipe names:</strong> {e.formats}
            </li>
            <li>
              <strong>Path at the pinned versions:</strong> {e.path}
            </li>
          </ul>
        </div>
      ))}
    </ColumnLayout>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function Precision() {
  const accelerators: AcceleratorEntry[] = [
    {
      name: 'H100 and H200: p5.48xlarge, p5e.48xlarge, p5en.48xlarge',
      peak: (
        <>
          989.5 BF16 and 1,979 FP8 TFLOPS, half NVIDIA&apos;s figures with sparsity, the same on both
          GPUs{' '}
          <Cite tier={1} href={H100_SPEC} kind="vendor-claim">
            NVIDIA H100 specification
          </Cite>{' '}
          <Cite tier={1} href={H200_SPEC} kind="vendor-claim">
            NVIDIA H200 specification
          </Cite>
        </>
      ),
      formats: (
        <>
          BF16; FP8 with per-tensor scaling (<code>DelayedScaling</code>, the default here, or{' '}
          <code>Float8CurrentScaling</code>) or block scaling (<code>Float8BlockScaling</code>, CUDA
          12.9 or later){' '}
          <Cite tier={1} href={TE_GATES} kind="code">
            Transformer Engine v2.21.0 quantization.py L151-L187
          </Cite>
        </>
      ),
      path: (
        <>
          Megatron Core <code>--fp8-recipe tensorwise</code>, <code>delayed</code> or{' '}
          <code>blockwise</code>{' '}
          <Cite tier={1} href={MG_RECIPES}>
            Megatron Core low-precision guide L39-L46
          </Cite>
          ; Accelerate or NeMo AutoModel through Transformer Engine or torchao. TorchTitan v0.4.0
          has no FP8 path on these GPUs{' '}
          <Cite tier={1} href={TT_RELEASE}>
            TorchTitan v0.4.0 release notes
          </Cite>
        </>
      ),
    },
    {
      name: 'B200: p6-b200.48xlarge',
      peak: (
        <>
          2,250 BF16, 4,500 FP8 and 9,000 FP4 TFLOPS per GPU, our arithmetic from the eight-GPU board
          figures (dense is half the sparse figure){' '}
          <Cite tier={1} href={HGX_SPEC} kind="vendor-claim">
            NVIDIA HGX B200 specification
          </Cite>
        </>
      ),
      formats: (
        <>
          Adds <code>MXFP8BlockScaling</code>, Transformer Engine&apos;s default here, and{' '}
          <code>NVFP4BlockScaling</code>{' '}
          <Cite tier={1} href={TE_DEFAULT} kind="code">
            Transformer Engine v2.21.0 quantization.py L261-L273
          </Cite>
        </>
      ),
      path: (
        <>
          Megatron Core <code>--fp8-recipe mxfp8</code>, or <code>--fp4-format e2m1</code> for NVFP4
          on Transformer Engine 2.7.0.dev0 or later{' '}
          <Cite tier={1} href={MG_RECIPES}>
            Megatron Core low-precision guide L39-L46
          </Cite>
          ; TorchTitan v0.4.0 MXFP8 with a TorchAO nightly, and experimental NVFP4
        </>
      ),
    },
    {
      name: 'Trainium2: trn2.48xlarge',
      peak: (
        <>
          667 BF16 and 1,299 FP8 TFLOPS on the chip page{' '}
          <Cite tier={1} href={NEURON_TRN2} kind="vendor-claim">
            Neuron 2.33 Trainium2 architecture
          </Cite>
          ; the per-core page&apos;s 79 and 158 TFLOPS times eight cores give 632 and 1,264, and
          neither page says why the two differ{' '}
          <Cite tier={1} href={NEURON_NC3} kind="vendor-claim">
            Neuron 2.33 NeuronCore-v3 architecture
          </Cite>
        </>
      ),
      formats: (
        <>
          The Tensor Engine takes cFP8, FP16, BF16, TF32 and FP32, with stochastic rounding
          available{' '}
          <Cite tier={1} href={NEURON_NC3}>
            Neuron 2.33 NeuronCore-v3 architecture
          </Cite>
        </>
      ),
      path: (
        <>
          BF16, TorchNeuron&apos;s training baseline at Neuron 2.33; FP8 and MXFP8 require
          Trainium3{' '}
          <Cite tier={1} href={NEURON_TORCH}>
            Neuron 2.33 about-pytorch-neuron.rst L117-L118
          </Cite>
        </>
      ),
    },
    {
      name: 'Trainium3',
      peak: (
        <>
          671 BF16, FP16 or TF32 TFLOPS and 2,517 MXFP8 or MXFP4 TFLOPS, against Trainium2&apos;s
          1,299 FP8{' '}
          <Cite tier={1} href={NEURON_TRN3} kind="vendor-claim">
            Neuron 2.33 Trainium3 architecture
          </Cite>
        </>
      ),
      formats: (
        <>
          MXFP8 and MXFP4 at the 8-bit peak, 3.75 times the BF16 peak by our arithmetic; BF16, FP16
          and TF32 at the 16-bit peak
        </>
      ),
      path: (
        <>
          MXFP8 dense-linear training in the TorchTitan Neuron fork, through torchao with Neuron
          MXFP8 support{' '}
          <Cite tier={1} href={TTN_MXFP8}>
            TorchTitan Neuron release-2.33.0 neuron_mxfp8.md
          </Cite>
          ; whether that runs on the public 2.33.0 packages is open (above)
        </>
      ),
    },
  ];

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Pick a training precision your accelerator runs in its matrix units, and know what each step down costs: on an H100 the FP8 (8-bit floating point) peak is twice the BF16 (bfloat16) peak, so at best half the accelerator-hours, while the 16 bytes per parameter of weights, gradients and optimizer state stay put (papers, Transformer Engine v2.21.0, Megatron Core core_v0.20.0, TorchTitan v0.4.0 and Neuron SDK 2.33, read 2026-10-31)"
          >
            6. Precision for Training: BF16, FP8 &amp; Microscaled Formats
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A training precision is the number format the matrix multiplies of the forward and
            backward passes read and compute in. It sets the peak a run divides by: an H100&apos;s
            matrix units list 1,979 dense TFLOPS (trillion floating-point operations per second) in
            FP8, 8-bit floating point, against 989.5 in BF16 (bfloat16, 16 bits with the exponent
            range of FP32, 32-bit floating point), each half the figure NVIDIA lists with sparsity{' '}
            <Cite tier={1} href={H100_SPEC} kind="vendor-claim">
              NVIDIA H100 specification
            </Cite>
            .
          </Box>
          <Box variant="p">
            The challenge is to take that speed and keep the small numbers training depends on,
            above all weight updates far smaller than the weights they change{' '}
            <Cite tier={3} href={MPT} venue="ICLR 2018">
              Mixed Precision Training, Section 3.1
            </Cite>
            . This section reads every format, from FP16 (16-bit floating point) down to MXFP8
            (microscaled FP8) and NVFP4 (NVIDIA&apos;s 4-bit floating-point format), as a scale factor
            and the number of values that share it, then prices each step down.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read every training format as stored values times a scale, the idea inference quantization already uses, with FP16's loss scaling as its first case"
          >
            A narrow format needs a scale factor
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A floating-point format with few bits covers a narrow window of magnitudes. FP16 turns
            any value below 2^-24 into zero{' '}
            <Cite tier={3} href={MPT} venue="ICLR 2018">
              Mixed Precision Training, Section 3.1
            </Cite>
            , and E4M3, the FP8 encoding with 4 exponent and 3 mantissa bits, tops out at 448{' '}
            <Cite tier={3} href={FP8_FORMATS} venue="preprint">
              FP8 Formats for Deep Learning, Table 1
            </Cite>
            . A tensor is therefore stored as format values times a scale factor: multiply before the
            cast so the tensor&apos;s largest magnitude lands near the format&apos;s maximum, and
            multiply by the inverse afterwards{' '}
            <Cite tier={3} href={FP8_FORMATS} venue="preprint">
              FP8 Formats for Deep Learning, Section 2
            </Cite>
            . It is the idea behind the scales an inference engine keeps beside quantized weights,
            covered in the{' '}
            <Link href="../silicon-memory-inference/">
              Silicon, Memory and Modern Inference dive, section 27: Quantization and Precision
            </Link>
            , with the bit layouts. Training adds one demand: the tensors change every step, so the
            scales have to follow them.
          </Box>
          <Box variant="p">
            Loss scaling is the FP16 case. The loss is multiplied by one factor before the backward
            pass; by the chain rule every gradient is multiplied by the same factor, which lifts small
            gradients above FP16&apos;s smallest value, and the gradients are divided back before
            gradient clipping and the update{' '}
            <Cite tier={3} href={MPT} venue="ICLR 2018">
              Mixed Precision Training, Section 3.2
            </Cite>
            . The original recipe used a constant factor, from 8 to 32K across the networks it
            trained, chosen so that the largest gradient times the factor stays below 65,504,
            FP16&apos;s largest value, and offered skipping the update on overflow as one option{' '}
            <Cite tier={3} href={MPT} venue="ICLR 2018">
              Mixed Precision Training, Section 3.2
            </Cite>
            ; it proposed raising and lowering the factor by watching the gradients for overflow as
            future work{' '}
            <Cite tier={3} href={MPT} venue="ICLR 2018">
              Mixed Precision Training, Section 6
            </Cite>
            . One loss scale for the whole model is the coarsest a scale gets.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict what any recipe needs from one question, how many values share a scale: every tensor in the model for FP16, one tensor for FP8, 32 values for MXFP8, 16 for NVFP4"
          >
            Where the scale factor lives
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Lower precision is a story about where the scale factor lives. Each step down in bits
            narrows the range a format covers, and each recipe answers by sharing a scale across fewer
            values, so the scale sits closer to the data. Smaller groups let a scale follow outliers{' '}
            <Cite tier={3} href={DEEPSEEK_V3} venue="preprint">
              DeepSeek-V3 Technical Report, Section 3.3.2
            </Cite>{' '}
            and narrow the range each block has to cover{' '}
            <Cite tier={3} href={NVFP4_PAPER} venue="preprint">
              Pretraining LLMs with NVFP4, Section 2
            </Cite>
            . The rungs, from coarsest to finest:
          </Box>
          <ul>
            <li>
              <strong>The model: FP16.</strong> One loss scale shared by every tensor, a constant in
              the original recipe, as above.
            </li>
            <li>
              <strong>No scale: BF16.</strong> BF16 keeps FP32&apos;s 8 exponent bits with 7 mantissa
              bits, so its largest value is 3.38e38 against FP16&apos;s 6.55e4, and it trains without
              loss scaling; its matrix multiplies take BF16 inputs and accumulate in FP32{' '}
              <Cite tier={3} href={BF16_STUDY} venue="preprint">
                A Study of BFLOAT16 for Deep Learning Training, Section 3 and Table 1
              </Cite>
              .
            </li>
            <li>
              <strong>The tensor: FP8.</strong> FP8&apos;s range cannot cover every tensor&apos;s
              important values at once, so tensors carry their own scaling factors. The proposal
              recommends E4M3 (largest value 448) for weights and activations and E5M2 (5 exponent and
              2 mantissa bits, largest value 57,344) for gradients, and calls FP16&apos;s practice of
              skipping the update on overflow &quot;not a good choice&quot; for FP8, where overflows
              are much more likely{' '}
              <Cite tier={3} href={FP8_FORMATS} venue="preprint">
                FP8 Formats for Deep Learning, Sections 2 and 3, Table 1
              </Cite>
              . Transformer Engine (NVIDIA&apos;s library that runs transformer layers in FP8 and FP4)
              implements per-tensor scaling twice: <code>DelayedScaling</code> takes the scale from a
              history of each tensor&apos;s largest absolute value, 1,024 steps by default, and{' '}
              <code>Float8CurrentScaling</code> from the tensor itself; both default to E4M3 in the
              forward pass and E5M2 in the backward pass{' '}
              <Cite tier={1} href={TE_FORMATS} kind="code">
                Transformer Engine v2.21.0 recipe L29-L52
              </Cite>{' '}
              <Cite tier={1} href={TE_TENSOR_RECIPES} kind="code">
                recipe L176-L321
              </Cite>
              .
            </li>
            <li>
              <strong>The block and the tile: DeepSeek-V3.</strong> DeepSeek-V3 ran every FP8 matrix
              multiply input in E4M3, with one scale per 1 x 128 tile of activations (one token, 128
              channels) and one per 128 x 128 block of weights, computed online from the current
              values{' '}
              <Cite tier={3} href={DEEPSEEK_V3} venue="preprint">
                DeepSeek-V3 Technical Report, Section 3.3.2
              </Cite>
              . It kept the embedding, the output head, attention and normalization, among other
              modules, in BF16 or FP32{' '}
              <Cite tier={3} href={DEEPSEEK_V3} venue="preprint">
                DeepSeek-V3 Technical Report, Section 3.3.1
              </Cite>
              .
            </li>
            <li>
              <strong>32 values: MXFP8.</strong> An MXFP8 block is 32 FP8 values, E4M3 or E5M2,
              sharing one 8-bit E8M0 scale: 8 exponent bits and no mantissa, so a power of two. A block
              takes 8 + 32 x 8 bits, so (8 + 256) / 32 = 8.25 bits per value{' '}
              <Cite tier={1} href={OCP_MX}>
                OCP Microscaling Formats (MX) Specification v1.0, Sections 5.1, 5.2 and 5.4
              </Cite>
              . That specification, from the OCP (Open Compute Project), defines the encoding only; in
              the training flow of the MX (microscaling) paper the matrix multiplies run in MX and vector operations such as
              normalization and softmax in BF16 or FP32{' '}
              <Cite tier={3} href={MX_PAPER} venue="preprint">
                Microscaling Data Formats for Deep Learning, Section 4.1
              </Cite>
              .
            </li>
            <li>
              <strong>16 values: NVFP4.</strong> NVFP4, NVIDIA&apos;s 4-bit floating-point format,
              halves the block to 16 values, stores each block&apos;s scale in E4M3 rather than as a
              power of two, and adds one FP32 scale per tensor to keep the range of the block scales{' '}
              <Cite tier={3} href={NVFP4_PAPER} venue="preprint">
                Pretraining LLMs with NVFP4, Section 2
              </Cite>
              . Transformer Engine&apos;s NVFP4 recipe shares one scale across a 16 x 16 block for
              weights and rounds gradients stochastically{' '}
              <Cite tier={1} href={TE_NVFP4_RECIPE} kind="code">
                Transformer Engine v2.21.0 recipe L502-L530
              </Cite>
              .
            </li>
          </ul>
          <ScaleLadderDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic, not to scale: the grid in panel 2 stands for a matrix&apos;s 128 x 128 blocks,
            and panel 4 zooms into one 1 x 128 row. Block sizes are the ones cited above; the shapes
            are illustrative, not measured.
          </Box>
          <Box variant="p">
            The FP8 encoding a recipe picks follows from where its scale lives. Per-tensor scaling
            pairs E4M3 with E5M2 for gradients, the <code>HYBRID</code> default of Transformer
            Engine&apos;s two per-tensor recipes. DeepSeek-V3 used E4M3 on all tensors and credited its
            tile and block scaling for making that work{' '}
            <Cite tier={3} href={DEEPSEEK_V3} venue="preprint">
              DeepSeek-V3 Technical Report, Section 3.3.2
            </Cite>
            , and Transformer Engine&apos;s block recipes, <code>MXFP8BlockScaling</code> and{' '}
            <code>Float8BlockScaling</code>, default to E4M3{' '}
            <Cite tier={1} href={TE_BLOCK_RECIPES} kind="code">
              Transformer Engine v2.21.0 recipe L345-L430
            </Cite>
            . Our reading of these sources: per-tensor scales need E5M2&apos;s range for gradients,
            and per-block scales do not. Megatron Core&apos;s example configurations pair their flags
            the same way, <code>--fp8-format hybrid</code> with the per-tensor{' '}
            <code>tensorwise</code> recipe and <code>e4m3</code> with <code>blockwise</code> and{' '}
            <code>mxfp8</code>{' '}
            <Cite tier={1} href={MG_BLOCKWISE}>
              Megatron Core low-precision guide L140-L151
            </Cite>{' '}
            <Cite tier={1} href={MG_H100}>
              L232-L242
            </Cite>{' '}
            <Cite tier={1} href={MG_B200}>
              L244-L253
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Set expectations from the runs that measured it: FP8 within run-to-run noise of 16-bit training or under 0.25% relative loss error, and NVFP4 within 1% of FP8 until the learning rate decays"
          >
            What each step down has cost in published runs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">Three first-party results, each with the conditions that bound it:</Box>
          <ul>
            <li>
              <strong>FP8, in its proposers&apos; runs.</strong> The runs simulated FP8: matrix multiply
              inputs were rounded to FP8 values and the arithmetic ran in FP16 or BF16. Under that
              method FP8 matched 16-bit training within run-to-run noise up to GPT 175B, with
              perplexity 6.68 against 6.65 at 175B, a comparison against a BF16 baseline taken at 75%
              of training because the baseline had not finished{' '}
              <Cite tier={3} href={FP8_FORMATS} venue="preprint">
                FP8 Formats for Deep Learning, Sections 4 and 4.1, Table 4
              </Cite>
              .
            </li>
            <li>
              <strong>FP8 with block scales, DeepSeek-V3.</strong> On two smaller models, similar to
              DeepSeek-V2-Lite and DeepSeek-V2, trained for about 1 trillion tokens, the FP8
              recipe&apos;s relative loss error against BF16 stayed below 0.25%{' '}
              <Cite tier={3} href={DEEPSEEK_V3} venue="preprint">
                DeepSeek-V3 Technical Report, Section 3.3
              </Cite>
              . The figure comes from those validation runs, not from DeepSeek-V3&apos;s own training
              run.
            </li>
            <li>
              <strong>NVFP4, in NVIDIA&apos;s run.</strong> A 12-billion-parameter hybrid
              Mamba-Transformer trained on 10 trillion tokens in NVFP4 kept its relative loss error
              against an FP8 run below 1% through the stable phase, widening to slightly above 1.5%
              during learning-rate decay, the closing phase in which the learning rate is lowered{' '}
              <Cite tier={3} href={NVFP4_PAPER} venue="preprint">
                Pretraining LLMs with NVFP4, Section 3
              </Cite>
              . The run kept 16% of its linear layers, those of the first two and last eight blocks,
              in BF16{' '}
              <Cite tier={3} href={NVFP4_PAPER} venue="preprint">
                Pretraining LLMs with NVFP4, Section 4.1
              </Cite>
              . No independent production report of NVFP4 pretraining was located in this research.
            </li>
          </ul>
          <Box variant="p">
            Each result compares a step down with a higher-precision run of the same model, and the
            later two keep some layers in higher precision. Megatron Core&apos;s low-precision guide
            lists the same move as the first defense against early-training instability under any FP8
            or FP4 recipe: keep the first and last transformer blocks in BF16 with{' '}
            <code>--first-last-layers-bf16</code>{' '}
            <Cite tier={1} href={MG_STABILITY}>
              Megatron Core low-precision guide L200
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Match the format to the chip and the framework before you plan the run: FP8 through Transformer Engine on H100 and H200, MXFP8 on B200, BF16 on Trainium2 at Neuron 2.33"
          >
            What your accelerator and framework run
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On NVIDIA GPUs the gate is the compute capability, and Transformer Engine v2.21.0 checks
            it in code. FP8 needs 8.9 or higher, which the H100 and H200 meet as Hopper GPUs (the code
            tests 9.0 as &quot;hopper and above&quot;); FP8 block scaling needs 9.0 with CUDA 12.9 or
            later; MXFP8 and NVFP4 need 10.0, Blackwell{' '}
            <Cite tier={1} href={TE_GATES} kind="code">
              Transformer Engine v2.21.0 quantization.py L151-L187
            </Cite>
            . With no recipe given, Transformer Engine picks <code>MXFP8BlockScaling</code> wherever
            MXFP8 is supported and <code>DelayedScaling</code> on Hopper{' '}
            <Cite tier={1} href={TE_DEFAULT} kind="code">
              Transformer Engine v2.21.0 quantization.py L261-L273
            </Cite>
            . A configuration that leaves the recipe unset therefore changes its scaling when it
            moves from a p5.48xlarge, with eight H100s, to a p6-b200.48xlarge, with eight B200s{' '}
            <Cite tier={1} href={EC2_AC}>
              AWS accelerated computing instance specifications
            </Cite>
            , by our reading of the code.
          </Box>
          <Box variant="p">The framework decides which of those recipes a run can reach:</Box>
          <ul>
            <li>
              <strong>Megatron Core core_v0.20.0</strong> turns FP8 on with{' '}
              <code>--fp8-format</code> (<code>e4m3</code> or <code>hybrid</code>) and picks the
              scaling with <code>--fp8-recipe</code>: <code>delayed</code>, the default;{' '}
              <code>tensorwise</code>, per-tensor current scaling; <code>blockwise</code>,
              DeepSeek-style 1 x 128 and 128 x 128 blocks on Hopper and Blackwell; and{' '}
              <code>mxfp8</code> on Blackwell. NVFP4 is <code>--fp4-format e2m1</code> on Blackwell{' '}
              <Cite tier={1} href={MG_RECIPES}>
                Megatron Core low-precision guide L39-L46
              </Cite>
              . FP8 stays off unless the format is set{' '}
              <Cite tier={1} href={MG_FP8_DEFAULT} kind="code">
                Megatron Core transformer_config.py L664-L676
              </Cite>
              .
            </li>
            <li>
              <strong>Accelerate v1.15.0</strong> runs FP8 on two actively maintained backends,
              Transformer Engine and torchao{' '}
              <Cite tier={1} href={ACCELERATE_FP8}>
                Accelerate low-precision training guide L33
              </Cite>
              , and <strong>NeMo AutoModel v0.7.0</strong> lists FP8 through the same two{' '}
              <Cite tier={1} href={AUTOMODEL_FP8}>
                NeMo AutoModel README L168-L169
              </Cite>
              .
            </li>
            <li>
              <strong>TorchTitan v0.4.0</strong>, released 2026-10-28, removed its legacy Float8
              training; its low-precision formats are now MXFP8 and experimental NVFP4, both requiring
              Blackwell, and its MXFP8 path needs a TorchAO nightly build because TorchAO 0.18 lacks
              the kernels{' '}
              <Cite tier={1} href={TT_RELEASE}>
                TorchTitan v0.4.0 release notes
              </Cite>
              . At v0.4.0 TorchTitan has no FP8 path on H100 or H200, so FP8 on a p5 or p5en goes
              through Megatron Core, Accelerate or NeMo AutoModel.
            </li>
          </ul>
          <Box variant="p">
            On Trainium the chip and the software give different answers. Trainium2&apos;s matrix
            unit, the Tensor Engine, takes cFP8 (8-bit floating point with configurable range and
            precision), FP16, BF16, TF32 (TensorFloat-32) and FP32, with a programmable rounding mode
            that includes stochastic rounding{' '}
            <Cite tier={1} href={NEURON_NC3}>
              Neuron 2.33 NeuronCore-v3 architecture
            </Cite>{' '}
            <Cite tier={1} href={NEURON_DTYPES}>
              Neuron 2.33 data types
            </Cite>
            , and the chip lists 1,299 dense FP8 TFLOPS against 667 for BF16{' '}
            <Cite tier={1} href={NEURON_TRN2} kind="vendor-claim">
              Neuron 2.33 Trainium2 architecture
            </Cite>
            . TorchNeuron, the native PyTorch backend that Neuron 2.33.0 introduced as a public beta{' '}
            <Cite tier={1} href={NEURON_TN_BETA}>
              TorchNeuron 2.33.0 release notes L18-L20
            </Cite>
            , names <code>bfloat16</code> &quot;the training baseline&quot; and states &quot;FP8 and
            MXFP8 require Trainium 3&quot;{' '}
            <Cite tier={1} href={NEURON_TORCH}>
              Neuron 2.33 about-pytorch-neuron.rst L117-L118
            </Cite>
            . On a trn2.48xlarge at Neuron 2.33 the PyTorch path trains in BF16, although the chip
            lists an FP8 peak.
          </Box>
          <Box variant="p">
            Trainium3 keeps Trainium2&apos;s BF16 peak, 671 against 667 TFLOPS, and roughly doubles
            the 8-bit peak, from 1,299 FP8 TFLOPS on Trainium2 to 2,517 MXFP8 on Trainium3{' '}
            <Cite tier={1} href={NEURON_TRN3} kind="vendor-claim">
              Neuron 2.33 Trainium3 architecture
            </Cite>
            . By our reading, a Trainium3 run collects that generation&apos;s gain only in its
            microscaled formats, MXFP8 and MXFP4, which share the 2,517 TFLOPS peak.
          </Box>
          <ExpandableSection headerText="MXFP8 on Trainium3 at Neuron 2.33: two AWS documents to read together">
            <SpaceBetween size="s">
              <Box variant="p">
                AWS&apos;s TorchTitan Neuron fork at release-2.33.0 documents MXFP8 dense-linear
                training on Trainium3 &quot;on torchao with Neuron MXFP8 support&quot;: attention and
                feed-forward linear layers switch to MXFP8, the output head stays in BF16, and off
                Trainium3 the converter raises a <code>ValueError</code>{' '}
                <Cite tier={1} href={TTN_MXFP8}>
                  TorchTitan Neuron release-2.33.0 neuron_mxfp8.md
                </Cite>
                . The TorchNeuron 2.33.0 release notes say the release &quot;does not include TorchAO
                integration or composite MXFP8 data type support&quot;{' '}
                <Cite tier={1} href={NEURON_TN_MX}>
                  TorchNeuron 2.33.0 release notes L186-L187
                </Cite>
                .
              </Box>
              <Box variant="p">
                The fork and the TorchNeuron documentation agree that Trainium2 has no MXFP8
                training path. Whether the
                fork&apos;s Trainium3 path runs on the public 2.33.0 packages was not settled in this
                research; plan a Trainium3 MXFP8 run as something to verify on the target release.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Budget a step down as at most half the accelerator-hours and the same model state: Llama 3.1 70B's 297,000 H100-hours fall to about 148,500 at best, and its 1,128.9 GB of model state stays"
          >
            Precision moves the compute bill and leaves the model state
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Model state is the weights, the gradients and the optimizer state, the part of memory that
            persists from step to step. Under mixed-precision Adam it is 16 bytes per parameter: 2 for
            16-bit weights, 2 for 16-bit gradients, and 12 for an FP32 master copy of the weights and
            Adam&apos;s two moments, the running averages of each gradient and of its square{' '}
            <Cite tier={3} href={ZERO} venue="preprint">
              ZeRO (Zero Redundancy Optimizer), Section 3.1
            </Cite>
            . Every recipe above keeps that FP32 master for the update{' '}
            <Cite tier={3} href={MPT} venue="ICLR 2018">
              Mixed Precision Training, Section 3.1
            </Cite>{' '}
            <Cite tier={3} href={BF16_STUDY} venue="preprint">
              A Study of BFLOAT16 for Deep Learning Training, Section 3
            </Cite>{' '}
            <Cite tier={3} href={DEEPSEEK_V3} venue="preprint">
              DeepSeek-V3 Technical Report, Section 3.3.3
            </Cite>{' '}
            <Cite tier={3} href={MX_PAPER} venue="preprint">
              Microscaling Data Formats for Deep Learning, Section 4.1
            </Cite>
            , and TorchTitan&apos;s MXFP8 and NVFP4 paths keep persistent model parameters and
            checkpoint state in high precision{' '}
            <Cite tier={1} href={TT_QUANT}>
              TorchTitan v0.4.0 quantization README
            </Cite>
            .
          </Box>
          <Box variant="p">
            None of the 16 bytes depends on the compute format, so precision changes the arithmetic
            bill far more than the memory bill (our reading of these sources). Memory moves at the edges:
            DeepSeek-V3&apos;s FP8 weight-gradient matrix multiply let it store activations, the
            tensors the forward pass saves for the backward pass, in FP8{' '}
            <Cite tier={3} href={DEEPSEEK_V3} venue="preprint">
              DeepSeek-V3 Technical Report, Section 3.3.1
            </Cite>
            , and Megatron Core can keep the 2-byte working copy of the weights in FP8 with{' '}
            <code>--fp8-param-gather</code>{' '}
            <Cite tier={1} href={MG_MEMORY}>
              Megatron Core low-precision guide L211-L213
            </Cite>
            . Section 5, The Memory Budget, prices the optimizer layouts that shrink the rest.
          </Box>
          <Box variant="p">
            In numbers, for Llama 3.1 70B, with N = 70,553,706,496 parameters{' '}
            <Cite tier={1} href={HF_LLAMA_70B}>
              Meta&apos;s Llama 3.1 70B model metadata
            </Cite>
            , trained on D = 1 trillion tokens on H100s, counted as 6ND FLOPs (6 per parameter per token,
            attention left out), at an assumed 40% MFU (model FLOPs utilization, the share of peak
            arithmetic the model&apos;s own FLOPs achieve), inside the 38% to 43% BF16 MFU of Llama 3
            405B&apos;s pre-training on H100{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.2 and Table 4
            </Cite>
            :
          </Box>
          <BillTable />
          <Box variant="p">
            The FP8 column is an upper bound on the gain at equal MFU. It assumes every FLOP runs at
            the FP8 peak, while the recipes above keep vector operations such as normalization in
            BF16 or FP32, and DeepSeek-V3 also kept attention and the output head there; that is our
            reading of why measured gains come in lower. At the same MFU, halving 297,000 H100-hours
            to about 148,500 is the most FP8 can buy on this run, and the 1,128.9 GB of model state
            is the same in both columns.
          </Box>
          <ExpandableSection headerText="The arithmetic, and two vendor figures that sit below the bound">
            <SpaceBetween size="s">
              <Box variant="p">
                <code>6ND = 6 x 70,553,706,496 x 1e12 = 4.23e23 FLOPs</code>.{' '}
                <code>4.23e23 / (989.5e12 x 0.40) / 3,600 = 297,093 H100-hours</code>, and at the
                1,979e12 FP8 peak 148,547. <code>16 x 70,553,706,496 bytes = 1,128.9 GB</code>. The
                dense peaks are half NVIDIA&apos;s &quot;with sparsity&quot; figures of 1,979 BF16 and
                3,958 FP8 TFLOPS{' '}
                <Cite tier={1} href={H100_SPEC} kind="vendor-claim">
                  NVIDIA H100 specification
                </Cite>
                . Our arithmetic; restarts, attention and every other overhead are left out.
              </Box>
              <Box variant="p">
                NVIDIA&apos;s Megatron Bridge 0.7.0 performance archive lists Llama 3 70B
                pre-training on 64 H100s in FP8 (NeMo container 26.04.01, 8,192-token sequences, a
                global batch of 256 sequences, 4-way tensor and 8-way pipeline parallelism) at 731
                model TFLOP/s per GPU{' '}
                <Cite tier={1} href={MBRIDGE_PERF} kind="vendor-claim">
                  Megatron Bridge 0.7.0 performance summary archive
                </Cite>
                , 37% of the 1,979 TFLOPS dense FP8 peak by our arithmetic. A BF16 run at the assumed
                40% MFU reaches 396 TFLOP/s, so the FP8 figure is 1.85 times it, short of the 2 times
                the peaks allow. The two numbers come from different software stacks; read the ratio
                as an indication.
              </Box>
              <Box variant="p">
                TorchTitan&apos;s MXFP8 notes claim up to 2 times BF16 for the matrix multiplies on
                common shapes, and up to 28% for training, on B200{' '}
                <Cite tier={1} href={TT_MXFP8} kind="vendor-claim">
                  TorchTitan v0.4.0 MXFP8 README
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Leave with a format and the flags to set on each AWS accelerator: BF16 on trn2, FP8 through Transformer Engine on p5 and p5en, MXFP8 on p6-b200"
          >
            Choose the format for your accelerator
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">The choice per accelerator at the pinned versions:</Box>
          <ul>
            <li>
              <strong>trn2.48xlarge, Trainium2: BF16.</strong> It is TorchNeuron&apos;s training
              baseline at Neuron 2.33, and FP8 and MXFP8 training require Trainium3.
            </li>
            <li>
              <strong>p5.48xlarge, p5e.48xlarge and p5en.48xlarge, H100 and H200: FP8 through
              Transformer Engine.</strong>{' '}
              Megatron Core&apos;s guide gives{' '}
              <code>--bf16 --fp8-format hybrid --fp8-recipe tensorwise --fp8-param-gather</code> with
              the distributed optimizer as its fastest stable FP8 on H100, and <code>delayed</code> in
              place of <code>tensorwise</code> when the optimizer state is offloaded to the CPU{' '}
              <Cite tier={1} href={MG_H100}>
                Megatron Core low-precision guide L232-L242
              </Cite>
              .
            </li>
            <li>
              <strong>p6-b200.48xlarge, B200: MXFP8.</strong> It is Transformer Engine&apos;s default
              on Blackwell. Megatron Core&apos;s guide gives{' '}
              <code>--fp8-format e4m3 --fp8-recipe mxfp8 --fp8-param-gather --reuse-grad-buf-for-mxfp8-param-ag</code>{' '}
              <Cite tier={1} href={MG_B200}>
                Megatron Core low-precision guide L244-L253
              </Cite>
              , and TorchTitan v0.4.0 runs MXFP8 with a TorchAO nightly. NVFP4 is the next step down
              on this chip, demonstrated so far in its vendor&apos;s run.
            </li>
          </ul>
          <ExpandableSection headerText="Formats, dense peaks and recipe names per accelerator">
            <AcceleratorList entries={accelerators} />
          </ExpandableSection>
          <Box variant="p">
            Then check the choice on the run itself. Keep a short BF16 run of the same model to
            compare the loss against, the comparison every result above made, and if the lower
            format drifts, keep the first and last blocks in BF16 before anything else. Plan the
            accelerator-hours at the BF16 figure and treat the 8-bit gain, at most the halving from
            297,000 to about 148,500 H100-hours for the 70B example, as something a measured step
            confirms; section 4, Counting the Arithmetic, turns a measured step into run time.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
