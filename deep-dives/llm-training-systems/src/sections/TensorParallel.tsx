import { useRef } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, arxiv, gh, MEGATRON_TAG, TORCHTITAN_TAG } from '../components/Cite';
import { useNarrow } from '../components/useNarrow';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Shoeybi et al., Megatron-LM (1909.08053v4), Sec 3 and Figure 3: column then row, f and g. */
const MEGATRON_LM = arxiv('1909.08053v4');
/** Narayanan et al., PTD-P (SC 2021): Sec 3.2 traffic formula and Takeaway #1; Sec 1 principles. */
const PTDP = arxiv('2104.04473v5');
/** Korthikanti et al., Reducing Activation Recomputation: Sec 4.2.2 (SP), Table 2, Sec 6.2. */
const SP_PAPER = arxiv('2205.05198v1');
/** The Llama 3 Herd of Models: Table 3 (heads, KV heads) and Table 4 (BF16 MFU). */
const LLAMA3 = arxiv('2407.21783v3');
/** Meta's Llama 3.1 70B model metadata at a pinned revision (exact parameter count). */
const HF_70B =
  'https://huggingface.co/api/models/meta-llama/Llama-3.1-70B/revision/349b2ddb53ce8f2849a6c168a81980ab25258dac';
const NVLINK_PAGE = 'https://www.nvidia.com/en-us/data-center/nvlink/';
const H100_SPEC = 'https://www.nvidia.com/en-us/data-center/h100/';
const EC2_ACCEL = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';

/** Megatron Core at the pinned tag. */
function mg(path: string, lines?: string): string {
  return gh('NVIDIA/Megatron-LM', MEGATRON_TAG, path, lines);
}
/** TorchTitan at the pinned tag. */
function tt(path: string, lines?: string): string {
  return gh('pytorch/torchtitan', TORCHTITAN_TAG, path, lines);
}
const MG_MAPPINGS = 'megatron/core/tensor_parallel/mappings.py';
const MG_LAYERS = 'megatron/core/tensor_parallel/layers.py';
const MG_SPECS = 'megatron/core/models/gpt/gpt_layer_specs.py';
const MG_TCONFIG = 'megatron/core/transformer/transformer_config.py';
const MG_PCONFIG = 'megatron/core/model_parallel_config.py';
const MG_ARGS = 'megatron/training/arguments.py';
const MG_COMMON_UTILS = 'megatron/training/utils/common_utils.py';
const MG_GUIDE = 'docs/user-guide/parallelism-guide.md';
const TT_PCONFIG = 'torchtitan/config/parallelism.py';
const TT_CONFIG_UTILS = 'torchtitan/models/common/config_utils.py';
const TT_SHARDING = 'torchtitan/models/common/decoder_sharding.py';
const TT_LLAMA3_FLAVORS = 'torchtitan/models/llama3/flavors.py';

/** Register rows cited without re-opening the source keep the register's date. */
const REGISTER_DATE = '2026-10-30';

/* ------------------------------------------------------------------------ */
/* Diagram: one transformer layer split across four GPUs                    */
/* ------------------------------------------------------------------------ */

/** Container width (px) below which the layer diagrams switch to the vertical layout. */
const LAYER_NARROW_PX = 700;

type LayerItem =
  | { kind: 'rep'; label: string }
  | { kind: 'op'; which: 'in' | 'out' }
  | { kind: 'lane'; l1: string; l2: string }
  | { kind: 'block'; label: string };

/** The layer in reading order. 'block' items are headers drawn only in the vertical layout. */
const LAYER_ITEMS: LayerItem[] = [
  { kind: 'rep', label: 'norm' },
  { kind: 'block', label: 'attention block' },
  { kind: 'op', which: 'in' },
  { kind: 'lane', l1: 'Q, K, V', l2: 'heads 1/4' },
  { kind: 'lane', l1: 'out proj', l2: 'rows 1/4' },
  { kind: 'op', which: 'out' },
  { kind: 'rep', label: 'add, norm' },
  { kind: 'block', label: 'MLP block' },
  { kind: 'op', which: 'in' },
  { kind: 'lane', l1: 'MLP up', l2: 'columns 1/4' },
  { kind: 'lane', l1: 'MLP down', l2: 'rows 1/4' },
  { kind: 'op', which: 'out' },
  { kind: 'rep', label: 'add' },
];

const GPUS = [0, 1, 2, 3];

const INK = '#16191f';
const MUTED = '#414d5c';
const FONT = 'sans-serif';
const BLUE = '#0972d3';
const BLUE_FILL = '#f2f8fd';
const GREY = '#879596';
const GREY_FILL = '#f4f4f4';
const TEAL = '#1f7a70';
const TEAL_FILL = '#e6f4f2';
const AMBER = '#8b6c00';
const AMBER_FILL = '#fbf3d5';

/** Labels of the two boundary operators, per mode and layout. */
function opText(which: 'in' | 'out', sp: boolean, narrow: boolean): string {
  if (sp) {
    if (which === 'in') return narrow ? 'all-gather forward, reduce-scatter backward' : 'all-gather forward';
    return narrow ? 'reduce-scatter forward, all-gather backward' : 'reduce-scatter forward';
  }
  if (which === 'in') return narrow ? 'f: copy forward, all-reduce backward' : 'f: all-reduce backward';
  return narrow ? 'g: all-reduce forward, copy backward' : 'g: all-reduce forward';
}

function legendLines(sp: boolean, narrow: boolean): string[] {
  if (sp) {
    return narrow
      ? [
          'teal: each GPU holds 1/4 of the tokens',
          "blue: each GPU's quarter of the weights",
          'Backward: the all-gathers become reduce-scatters',
          'and the reduce-scatters become all-gathers.',
        ]
      : [
          "teal: each GPU holds 1/4 of the tokens; blue: each GPU's quarter of the weights",
          'Backward pass: each all-gather becomes a reduce-scatter and each reduce-scatter an all-gather.',
        ];
  }
  return narrow
    ? [
        'grey: the full activation, the same on every GPU',
        "blue: each GPU's quarter of the weights",
        'f: copy forward, all-reduce backward',
        'g: all-reduce forward, copy backward',
      ]
    : [
        "grey: the full activation, the same on every GPU; blue: each GPU's quarter of the weights",
        'f: copy forward, all-reduce backward. g: all-reduce forward, copy backward.',
      ];
}

/** Geometry of the horizontal (wide) layout. */
const WIDE = { W: 880, x0: 60, gap: 8, repW: 78, opW: 36, laneW: 88, laneTop: 60, laneH: 40, laneGap: 8 };
/** Geometry of the vertical (narrow) layout. */
const NARROW = { W: 400, x0: 12, colW: 88, colGap: 8, top: 52, repH: 40, laneH: 40, opH: 26, blockH: 18, gap: 8 };

function layerHeight(narrow: boolean): number {
  if (!narrow) return 300;
  let y = NARROW.top;
  LAYER_ITEMS.forEach((it, i) => {
    if (i > 0) y += NARROW.gap;
    y += it.kind === 'op' ? NARROW.opH : it.kind === 'block' ? NARROW.blockH : it.kind === 'rep' ? NARROW.repH : NARROW.laneH;
  });
  return y + 16 + 4 * 16 + 8;
}

function cellFill(kind: 'rep' | 'lane', sp: boolean): { fill: string; stroke: string } {
  if (kind === 'lane') return { fill: BLUE_FILL, stroke: BLUE };
  return sp ? { fill: TEAL_FILL, stroke: TEAL } : { fill: GREY_FILL, stroke: GREY };
}

function repSecondLine(sp: boolean): string {
  return sp ? 'tokens 1/4' : 'full copy';
}

/** Two-line label centred in a box. */
function BoxLabel({ cx, y, h, l1, l2 }: { cx: number; y: number; h: number; l1: string; l2: string }) {
  return (
    <>
      <text x={cx} y={y + h / 2 - 3} fill={INK} fontSize={11} fontWeight={600} fontFamily={FONT} textAnchor="middle">
        {l1}
      </text>
      <text x={cx} y={y + h / 2 + 12} fill={MUTED} fontSize={11} fontFamily={FONT} textAnchor="middle">
        {l2}
      </text>
    </>
  );
}

function WideLayerBody({ sp }: { sp: boolean }) {
  const g = WIDE;
  const items = LAYER_ITEMS.filter((it) => it.kind !== 'block');
  const xs: number[] = [];
  let x = g.x0;
  const widths = items.map((it) => (it.kind === 'op' ? g.opW : it.kind === 'rep' ? g.repW : g.laneW));
  widths.forEach((w) => {
    xs.push(x);
    x += w + g.gap;
  });
  const laneY = (i: number) => g.laneTop + i * (g.laneH + g.laneGap);
  const lanesBottom = laneY(3) + g.laneH;
  const opIdx = items.map((it, i) => (it.kind === 'op' ? i : -1)).filter((i) => i >= 0);
  const blocks = [
    { label: 'attention block', from: opIdx[0], to: opIdx[1] },
    { label: 'MLP block', from: opIdx[2], to: opIdx[3] },
  ];
  const legend = legendLines(sp, false);
  return (
    <g>
      <rect x={0} y={0} width={g.W} height={300} rx={8} fill="#ffffff" />
      <text x={g.x0} y={22} fill={INK} fontSize={13} fontWeight={600} fontFamily={FONT}>
        {sp ? 'The same layer with sequence parallelism, four GPUs' : 'One transformer layer on four GPUs, tensor parallelism'}
      </text>
      {blocks.map((b) => {
        const bx0 = xs[b.from];
        const bx1 = xs[b.to] + g.opW;
        return (
          <g key={b.label}>
            <path d={`M${bx0},54 V48 H${bx1} V54`} stroke={MUTED} strokeWidth={1} fill="none" />
            <text x={(bx0 + bx1) / 2} y={42} fill={MUTED} fontSize={11} fontWeight={600} fontFamily={FONT} textAnchor="middle">
              {b.label}
            </text>
          </g>
        );
      })}
      {GPUS.map((gpu) => (
        <text key={`wl-${gpu}`} x={10} y={laneY(gpu) + g.laneH / 2 + 4} fill={MUTED} fontSize={11} fontWeight={600} fontFamily={FONT}>
          GPU {gpu}
        </text>
      ))}
      {GPUS.map((gpu) =>
        items.slice(0, -1).map((it, i) => {
          const yMid = laneY(gpu) + g.laneH / 2;
          const xa = xs[i] + widths[i];
          const xb = xs[i + 1];
          return <line key={`wc-${gpu}-${xs[i]}`} x1={xa} y1={yMid} x2={xb} y2={yMid} stroke={GREY} strokeWidth={1.2} />;
        }),
      )}
      {items.map((it, i) => {
        if (it.kind === 'op') {
          const cx = xs[i] + g.opW / 2;
          const cy = (g.laneTop + lanesBottom) / 2;
          return (
            <g key={`wo-${xs[i]}`}>
              <rect x={xs[i]} y={g.laneTop} width={g.opW} height={lanesBottom - g.laneTop} rx={4} fill={AMBER_FILL} stroke={AMBER} strokeWidth={1.5} />
              <text
                x={cx}
                y={cy}
                fill={INK}
                fontSize={11}
                fontWeight={600}
                fontFamily={FONT}
                textAnchor="middle"
                dominantBaseline="central"
                transform={`rotate(-90 ${cx} ${cy})`}
              >
                {opText(it.which, sp, false)}
              </text>
            </g>
          );
        }
        const { fill, stroke } = cellFill(it.kind, sp);
        const w = widths[i];
        return (
          <g key={`wi-${xs[i]}`}>
            {GPUS.map((gpu) => (
              <g key={`wb-${xs[i]}-${gpu}`}>
                <rect x={xs[i]} y={laneY(gpu)} width={w} height={g.laneH} rx={4} fill={fill} stroke={stroke} strokeWidth={1.2} />
                <BoxLabel
                  cx={xs[i] + w / 2}
                  y={laneY(gpu)}
                  h={g.laneH}
                  l1={it.kind === 'rep' ? it.label : it.l1}
                  l2={it.kind === 'rep' ? repSecondLine(sp) : it.l2}
                />
              </g>
            ))}
          </g>
        );
      })}
      {legend.map((line, i) => (
        <text key={line} x={g.x0} y={lanesBottom + 26 + i * 18} fill={MUTED} fontSize={11} fontFamily={FONT}>
          {line}
        </text>
      ))}
    </g>
  );
}

function NarrowLayerBody({ sp }: { sp: boolean }) {
  const g = NARROW;
  const H = layerHeight(true);
  const colX = (i: number) => g.x0 + i * (g.colW + g.colGap);
  const fullW = 4 * g.colW + 3 * g.colGap;
  const rows: { it: LayerItem; y: number; h: number }[] = [];
  let y = g.top;
  LAYER_ITEMS.forEach((it, i) => {
    if (i > 0) y += g.gap;
    const h = it.kind === 'op' ? g.opH : it.kind === 'block' ? g.blockH : it.kind === 'rep' ? g.repH : g.laneH;
    rows.push({ it, y, h });
    y += h;
  });
  const bottom = y;
  const legend = legendLines(sp, true);
  return (
    <g>
      <rect x={0} y={0} width={g.W} height={H} rx={8} fill="#ffffff" />
      <text x={g.x0} y={20} fill={INK} fontSize={13} fontWeight={600} fontFamily={FONT}>
        {sp ? 'The same layer with sequence parallelism' : 'One layer on four GPUs, tensor parallelism'}
      </text>
      {GPUS.map((gpu) => (
        <text key={`nl-${gpu}`} x={colX(gpu) + g.colW / 2} y={42} fill={MUTED} fontSize={11} fontWeight={600} fontFamily={FONT} textAnchor="middle">
          GPU {gpu}
        </text>
      ))}
      {GPUS.map((gpu) =>
        rows.slice(0, -1).map((r, i) => {
          const next = rows[i + 1];
          if (r.it.kind === 'block' || next.it.kind === 'block') return null;
          const cx = colX(gpu) + g.colW / 2;
          return <line key={`nc-${gpu}-${r.y}`} x1={cx} y1={r.y + r.h} x2={cx} y2={next.y} stroke={GREY} strokeWidth={1.2} />;
        }),
      )}
      {rows.map(({ it, y: ry, h }) => {
        if (it.kind === 'block') {
          return (
            <text key={`nb-${ry}`} x={g.x0} y={ry + 13} fill={MUTED} fontSize={11} fontWeight={600} fontFamily={FONT}>
              {it.label}
            </text>
          );
        }
        if (it.kind === 'op') {
          return (
            <g key={`no-${ry}`}>
              <rect x={g.x0} y={ry} width={fullW} height={h} rx={4} fill={AMBER_FILL} stroke={AMBER} strokeWidth={1.5} />
              <text x={g.x0 + fullW / 2} y={ry + 17} fill={INK} fontSize={11} fontWeight={600} fontFamily={FONT} textAnchor="middle">
                {opText(it.which, sp, true)}
              </text>
            </g>
          );
        }
        const { fill, stroke } = cellFill(it.kind, sp);
        return (
          <g key={`nr-${ry}`}>
            {GPUS.map((gpu) => (
              <g key={`nx-${ry}-${gpu}`}>
                <rect x={colX(gpu)} y={ry} width={g.colW} height={h} rx={4} fill={fill} stroke={stroke} strokeWidth={1.2} />
                <BoxLabel
                  cx={colX(gpu) + g.colW / 2}
                  y={ry}
                  h={h}
                  l1={it.kind === 'rep' ? it.label : it.l1}
                  l2={it.kind === 'rep' ? repSecondLine(sp) : it.l2}
                />
              </g>
            ))}
          </g>
        );
      })}
      {legend.map((line, i) => (
        <text key={line} x={g.x0} y={bottom + 22 + i * 16} fill={MUTED} fontSize={11} fontFamily={FONT}>
          {line}
        </text>
      ))}
    </g>
  );
}

function TpLayerDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, LAYER_NARROW_PX);
  const W = narrow ? NARROW.W : WIDE.W;
  const H = layerHeight(narrow);
  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="tensor-parallel-layer-title"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <title id="tensor-parallel-layer-title">
          One transformer layer split across four GPUs with tensor parallelism. The norm and the
          residual adds run on the full activation, the same on every GPU. In the attention block
          each GPU computes the query, key and value projections for a quarter of the heads and a
          quarter of the rows of the output projection; in the MLP block each GPU holds a quarter of
          the columns of the up projection and a quarter of the rows of the down projection. Each
          block enters through f, a copy in the forward pass and an all-reduce in the backward pass,
          and leaves through g, an all-reduce in the forward pass and a copy in the backward pass:
          two all-reduces forward and two backward per layer.
        </title>
        {narrow ? <NarrowLayerBody sp={false} /> : <WideLayerBody sp={false} />}
      </svg>
    </div>
  );
}

function SpLayerDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, LAYER_NARROW_PX);
  const W = narrow ? NARROW.W : WIDE.W;
  const H = layerHeight(narrow);
  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="tensor-parallel-sp-layer-title"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <title id="tensor-parallel-sp-layer-title">
          The same transformer layer with sequence parallelism added. The norm and the residual adds
          now run on a quarter of the tokens on each GPU. Each block enters through an all-gather
          that rebuilds the full sequence before the column-split multiplication, and leaves through
          a reduce-scatter that sums the row-split partial results and hands each GPU its quarter of
          the tokens. In the backward pass the all-gather becomes a reduce-scatter and the
          reduce-scatter an all-gather. The weights are split exactly as with tensor parallelism
          alone.
        </title>
        {narrow ? <NarrowLayerBody sp /> : <WideLayerBody sp />}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: one layer's TP traffic against compute, on NVLink and on EFA     */
/* ------------------------------------------------------------------------ */

/** Llama 3.1 70B, TP 8, s = 8,192, b = 1, BF16 (our arithmetic; see the derivation block). */
const LAYER_MS = { compute: 13.3, nvlink: 2.1, efa: 18.8 };

const BARS: Array<{ id: string; l1: string; l2: string; ms: number; color: string }> = [
  { id: 'compute', l1: 'Layer compute per GPU', l2: '40% MFU of 989.5 TFLOPS', ms: LAYER_MS.compute, color: BLUE },
  { id: 'nvlink', l1: 'TP traffic on NVLink', l2: 'one instance, 450 GB/s per GPU', ms: LAYER_MS.nvlink, color: '#037f0c' },
  { id: 'efa', l1: 'TP traffic on EFA', l2: 'one GPU per instance, 50 GB/s per GPU', ms: LAYER_MS.efa, color: '#ec7211' },
];

function LayerTimeDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, 600);
  const W = narrow ? 400 : 760;
  const barX = narrow ? 12 : 276;
  const maxMs = 20;
  const scale = narrow ? 300 / maxMs : 400 / maxMs;
  const rowH = narrow ? 62 : 54;
  const top = narrow ? 70 : 56;
  const barH = 18;
  const ticks = narrow ? [0, 10, 20] : [0, 5, 10, 15, 20];
  const axisY = top + BARS.length * rowH + 4;
  const H = axisY + 34;
  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="tensor-parallel-time-title"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <title id="tensor-parallel-time-title">
          One layer of Llama 3.1 70B at TP 8, per GPU and per micro-batch of one 8,192-token
          sequence. The layer&apos;s compute takes 13.3 ms at 40% MFU. Its tensor-parallel traffic,
          0.94 GB, takes 2.1 ms on NVLink at 450 GB/s when the TP group sits inside one instance,
          and 18.8 ms on EFA at 50 GB/s per GPU when the group&apos;s eight GPUs sit on eight
          different instances, longer than the compute itself.
        </title>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
        <text x={12} y={22} fill={INK} fontSize={13} fontWeight={600} fontFamily={FONT}>
          {narrow ? 'One Llama 3.1 70B layer at TP 8' : 'One Llama 3.1 70B layer at TP 8: 0.94 GB of TP traffic per GPU'}
        </text>
        <text x={12} y={39} fill={MUTED} fontSize={11} fontFamily={FONT}>
          {narrow ? '0.94 GB of TP traffic per GPU per micro-batch' : 'per micro-batch of one 8,192-token sequence, BF16, link peaks, no overlap'}
        </text>
        {narrow && (
          <text x={12} y={54} fill={MUTED} fontSize={11} fontFamily={FONT}>
            8,192 tokens, BF16, link peaks, no overlap
          </text>
        )}
        {BARS.map((b, i) => {
          const rowTop = top + i * rowH;
          const by = narrow ? rowTop + 30 : rowTop + 8;
          const w = b.ms * scale;
          return (
            <g key={b.id}>
              <text x={12} y={narrow ? rowTop + 12 : rowTop + 15} fill={INK} fontSize={12} fontWeight={600} fontFamily={FONT}>
                {b.l1}
              </text>
              <text x={12} y={narrow ? rowTop + 26 : rowTop + 31} fill={MUTED} fontSize={11} fontFamily={FONT}>
                {b.l2}
              </text>
              <rect x={barX} y={by} width={w} height={barH} rx={3} fill={b.color} />
              <text x={barX + w + 6} y={by + 13} fill={INK} fontSize={12} fontWeight={600} fontFamily={FONT}>
                {b.ms.toFixed(1)} ms
              </text>
            </g>
          );
        })}
        <line x1={barX} y1={axisY} x2={barX + maxMs * scale} y2={axisY} stroke={MUTED} strokeWidth={1} />
        {ticks.map((t) => (
          <g key={`tick-${t}`}>
            <line x1={barX + t * scale} y1={axisY} x2={barX + t * scale} y2={axisY + 4} stroke={MUTED} strokeWidth={1} />
            <text x={barX + t * scale} y={axisY + 17} fill={MUTED} fontSize={11} fontFamily={FONT} textAnchor="middle">
              {t}
            </text>
          </g>
        ))}
        <text x={barX + maxMs * scale} y={axisY + 30} fill={MUTED} fontSize={11} fontFamily={FONT} textAnchor="end">
          ms per layer per micro-batch
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function TensorParallel() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Split every layer across the GPUs of one instance, and see why that is where tensor parallelism stops: for Llama 3.1 70B over eight GPUs, each layer moves 0.94 GB per GPU per micro-batch, 2.1 ms on NVLink against 13.3 ms of compute at an assumed 40% model FLOPs utilization (Megatron Core core_v0.20.0 and TorchTitan v0.4.0, read 2026-10-31)"
          >
            9. Tensor &amp; Sequence Parallelism
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Tensor parallelism (TP) is the split inference engines use when a model does not fit one
            GPU: each GPU holds a slice of every weight matrix and computes a slice of every layer,
            and the GPUs combine their partial results with a collective, a call that every GPU in
            the group makes together (section 7, Collectives &amp; What They Cost). The serving form
            is in the <Link href="../vllm/">vLLM dive, section 9: Distributed Inference</Link> and the{' '}
            <Link href="../sglang/">SGLang dive, section 14: Parallelism: TP, DP Attention &amp; EP</Link>.
          </Box>
          <Box variant="p">
            Training adds two things. The backward pass needs collectives of its own, so every block
            pays in both directions. And training keeps activations, the intermediate tensors the
            forward pass saves for the backward pass, which TP divides only in part; SP (sequence
            parallelism) divides the rest. The challenge is frequency: TP&apos;s collectives fire
            inside every layer of every micro-batch (one slice of the step&apos;s batch, run forward
            and backward before the next), so they need the fastest link in the cluster, and on a
            p5.48xlarge, an Amazon EC2 (Elastic Compute Cloud) instance with eight NVIDIA H100 GPUs,
            that link ends at the instance.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Follow one layer across four GPUs and see where its two collectives sit in the forward pass and its two in the backward pass"
          >
            Column, then row: one collective per block in each direction
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The split Megatron-LM introduced, and that Megatron Core and TorchTitan both implement,
            pairs the two matrix multiplications of each block. In the MLP (multilayer perceptron)
            block the first weight matrix is split by columns, so each GPU computes a full slice of
            the hidden features and applies the nonlinearity locally; the second is split by rows,
            so each GPU&apos;s output is a partial sum of the full result, and one all-reduce, which
            sums an array across GPUs and leaves the sum on every one, combines them{' '}
            <Cite tier={3} href={MEGATRON_LM} venue="preprint">
              Megatron-LM, Section 3
            </Cite>
            . Attention splits the same way along its heads: the query, key and value projections
            are split by columns, so each GPU computes whole attention heads on its own, and the
            output projection by rows{' '}
            <Cite tier={3} href={MEGATRON_LM} venue="preprint">
              Megatron-LM, Section 3 and Figure 3
            </Cite>
            .
          </Box>
          <Box variant="p">
            Megatron names the two boundaries f and g. f, on the way into each block, is a copy in
            the forward pass and an all-reduce in the backward pass, where it sums the input gradient
            that every GPU&apos;s slice contributes; g, on the way out, is an all-reduce in the
            forward pass and a copy in the backward pass. A layer therefore costs two all-reduces
            forward and two backward{' '}
            <Cite tier={3} href={MEGATRON_LM} venue="preprint">
              Megatron-LM, Figures 3 and 4
            </Cite>
            . A serving engine runs only the forward pass and pays g alone; training pays f as well,
            which doubles the count (our reading of the operator definitions).
          </Box>
          <TpLayerDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured: four GPUs for legibility, the operator placement of
            Megatron-LM&apos;s Figure 3 drawn for one whole layer.
          </Box>
          <Box variant="p">
            Each GPU holds 1/t of every weight matrix, t being the TP degree. Llama 3.1 70B has
            70,553,706,496 parameters{' '}
            <Cite tier={1} href={HF_70B}>
              Meta&apos;s Llama 3.1 70B model metadata
            </Cite>{' '}
            and 64 attention heads sharing 8 KV (key and value) heads{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint" accessed={REGISTER_DATE}>
              Llama 3 Herd of Models, Table 3
            </Cite>
            , so at TP 8 each GPU holds about 8.8 billion parameters, 8 query heads and 1 KV head (our
            arithmetic).
          </Box>
          <ExpandableSection headerText="The same split in Megatron Core and TorchTitan code">
            <SpaceBetween size="s">
              <Box variant="p">
                Megatron Core implements f as an autograd function whose forward returns its input
                and whose backward all-reduces the gradient, and g as the reverse{' '}
                <Cite tier={1} href={mg(MG_MAPPINGS, 'L205-L241')} kind="code">
                  Megatron Core mappings.py L205-L241
                </Cite>
                ; the wrappers read &quot;forward: copy, backward allreduce&quot; and &quot;forward:
                all reduce, backward copy&quot;{' '}
                <Cite tier={1} href={mg(MG_MAPPINGS, 'L496-L505')} kind="code">
                  Megatron Core mappings.py L496-L505
                </Cite>
                . Its GPT layer builds the query-key-value projection and the MLP&apos;s first
                projection as column-parallel layers and the attention output and the MLP&apos;s
                second projection as row-parallel layers{' '}
                <Cite tier={1} href={mg(MG_SPECS, 'L423-L425')} kind="code">
                  Megatron Core gpt_layer_specs.py L423-L425
                </Cite>{' '}
                <Cite tier={1} href={mg(MG_SPECS, 'L525-L543')} kind="code">
                  gpt_layer_specs.py L525-L543
                </Cite>
                .
              </Box>
              <Box variant="p">
                TorchTitan v0.4.0 builds each Llama 3 layer from shared attention and MLP
                configurations{' '}
                <Cite tier={1} href={tt(TT_LLAMA3_FLAVORS, 'L103-L119')} kind="code">
                  TorchTitan llama3/flavors.py L103-L119
                </Cite>{' '}
                that make the same choices: <code>wqkv</code> is a <code>ColumnParallelLinear</code>{' '}
                and <code>wo</code> a <code>RowParallelLinear</code>{' '}
                <Cite tier={1} href={tt(TT_CONFIG_UTILS, 'L265-L298')} kind="code">
                  TorchTitan config_utils.py L265-L298
                </Cite>
                , and the fused gate-and-up projection <code>w13</code> is column-parallel with the
                down projection <code>w2</code> row-parallel{' '}
                <Cite tier={1} href={tt(TT_CONFIG_UTILS, 'L315-L330')} kind="code">
                  TorchTitan config_utils.py L315-L330
                </Cite>
                .
              </Box>
              <Box variant="p">
                In Megatron Core&apos;s column-parallel layer, f&apos;s backward all-reduce is
                launched asynchronously, ahead of the weight-gradient computation, so the two can
                overlap{' '}
                <Cite tier={1} href={mg(MG_LAYERS, 'L792-L796')} kind="code">
                  Megatron Core layers.py L792-L796
                </Cite>
                , which is the default whenever TP is above 1 and sequence parallelism is off{' '}
                <Cite tier={1} href={mg(MG_LAYERS, 'L1255-L1257')} kind="code">
                  layers.py L1255-L1257
                </Cite>
                . g&apos;s forward all-reduce returns the summed output that the next operation
                reads (our reading of the code), which is why the next block&apos;s estimate counts
                the traffic as if none of it overlapped.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Price TP for Llama 3.1 70B on one p5.48xlarge: 0.94 GB per GPU per layer per micro-batch, 2.1 ms on NVLink against 13.3 ms of compute, about 16%"
          >
            Traffic that follows the activations and fires in every layer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            TP&apos;s collectives carry activations, so their size is set by the tokens in flight and
            the model&apos;s width. Per layer, per GPU and per micro-batch, TP moves 8bsh(t-1)/t
            elements, b being the micro-batch in sequences, s the sequence length and h the hidden
            size{' '}
            <Cite tier={3} href={PTDP} venue="SC 2021">
              Efficient Large-Scale Language Model Training on GPU Clusters, Section 3.2
            </Cite>
            . The 8 is four all-reduces of a b x s x h tensor, each moving 2(t-1)/t of it per GPU,
            the all-reduce cost from section 7 (our reading of the formula). The hidden size is the
            only model dimension in it: the MLP&apos;s width and the parameter count do not appear.
          </Box>
          <Box variant="p">
            For Llama 3.1 70B at TP 8 on one p5.48xlarge, with one 8,192-token sequence per
            micro-batch and BF16 (bfloat16, two bytes per value) activations:
          </Box>
          <ul>
            <li>
              <strong>Traffic:</strong> <code>8 x 1 x 8,192 x 8,192 x 7/8</code> = 470 million
              elements, 0.94 GB per GPU per layer per micro-batch.
            </li>
            <li>
              <strong>Time on NVLink:</strong> 2.1 ms at 450 GB/s per GPU, which reads NVIDIA&apos;s
              900 GB/s for Hopper as both directions together{' '}
              <Cite tier={1} href={NVLINK_PAGE} kind="vendor-claim">
                NVIDIA NVLink specifications
              </Cite>
              . This is the link&apos;s peak; achieved bus bandwidth was not measured for this
              research.
            </li>
            <li>
              <strong>Compute:</strong> each GPU runs one eighth of the layer&apos;s 855.6 million
              weights over 8,192 tokens at 6 FLOPs (floating-point operations) per weight per token
              (section 4, Counting the Arithmetic), 5.26 trillion FLOPs. At an assumed 40% MFU
              (model FLOPs utilization, the share of peak arithmetic a run achieves) of the
              H100&apos;s 989.5 TFLOPS (trillion FLOPs per second)
              dense BF16 peak, half the 1,979 NVIDIA lists with sparsity{' '}
              <Cite tier={1} href={H100_SPEC} kind="vendor-claim">
                NVIDIA H100 specification
              </Cite>
              , that is 396 TFLOPS and 13.3 ms. Attention&apos;s own FLOPs are left out.
            </li>
            <li>
              <strong>Share:</strong> 2.1 ms against 13.3 ms, about 16% of the layer&apos;s compute
              if none of the traffic overlaps it.
            </li>
          </ul>
          <Box variant="small" color="text-body-secondary">
            Our arithmetic on the cited inputs. 40% is this dive&apos;s working assumption, inside
            the 38% to 43% BF16 MFU Llama 3 reports for its H100 runs{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint" accessed={REGISTER_DATE}>
              Llama 3 Herd of Models, Table 4
            </Cite>
            ; a higher MFU shortens the compute and raises TP&apos;s share.
          </Box>
          <Box variant="p">
            The frequency sets the total. Four all-reduces in each of 80 layers is 320 per
            micro-batch, about 75 GB per GPU on NVLink for every sequence that passes through the
            model, where DP (data parallelism) reduces gradients once per step, or once per
            micro-batch when its sync is not deferred (section 8, Data Parallelism &amp; Sharding).
            Section 7 prices a layout by multiplying each collective&apos;s bytes by how often it
            fires and comparing the total with the compute: a collective whose time rivals the
            compute overlaps with it or belongs on a faster link. TP fires in every layer of every
            micro-batch, and each forward all-reduce sits between two multiplications that wait for
            its result (our reading of the code above), so it belongs on the fastest link there is.
          </Box>
          <ExpandableSection headerText="The arithmetic behind 0.94 GB, 2.1 ms and 13.3 ms, and how Calculator C counts the same layer">
            <SpaceBetween size="s">
              <Box variant="p">
                Traffic: b = 1, s = 8,192, h = 8,192 and t = 8 give 8 x 67.1 million x 7/8 = 469.8
                million elements, 0.9395 GB at two bytes each; 0.9395 GB / 450 GB/s = 2.09 ms.
              </Box>
              <Box variant="p">
                Compute: the layer&apos;s weights are 2 x 8,192 x 8,192 for the query and output
                projections, 2 x 8,192 x 1,024 for the key and value projections (8 KV heads of 128)
                and 3 x 8,192 x 28,672 for the MLP, 855,638,016 in all (shape from{' '}
                <Cite tier={3} href={LLAMA3} venue="preprint" accessed={REGISTER_DATE}>
                  Llama 3 Herd of Models, Table 3
                </Cite>
                ). 6 x 855.6 million x 8,192 / 8 = 5.26e12 FLOPs per GPU; 0.40 x 989.5 = 395.8
                TFLOPS; 5.26e12 / 395.8e12 = 13.3 ms. 2.09 / 13.3 = 15.7%.
              </Box>
              <Box variant="p">
                Calculator C (section 14, Set My Ranks: The Sizing Procedure) counts the same traffic
                over a whole step. For TP 8 x DP 32 on 32 p5.48xlarge at 512 sequences per step, 16
                micro-batches per GPU, it gives 1,203 GB of TP traffic per GPU, 2.67 s on NVLink,
                about 14% of the step&apos;s compute; its compute also counts attention FLOPs and the
                output layer, which the per-layer 13.3 ms leaves out.
              </Box>
              <Box variant="p">
                Every time here divides by a link peak. Section 7 holds the measurement that would
                replace it, an nccl-tests run on one and two p5.48xlarge (protocol A1, not yet run).
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See why each doubling of the TP degree roughly doubles its share of the layer, and keep every TP group on one instance's NVLink"
          >
            Why tensor parallelism stops at the instance
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The bytes and the compute scale differently with t. Each GPU&apos;s TP traffic,
            8bsh(t-1)/t, barely moves as t grows, because (t-1)/t only creeps towards 1, while each
            GPU&apos;s share of the layer&apos;s arithmetic falls as 1/t. TP&apos;s share of the layer
            therefore grows roughly in proportion to t. For the 70B layer, TP 16 would halve each
            GPU&apos;s compute to 6.6 ms while its traffic rose to 1.0 GB per layer per micro-batch:
            about 34% of the layer even if every byte moved at NVLink speed, twice the 16% at TP 8
            (our arithmetic on the same formula).
          </Box>
          <Box variant="p">
            Megatron&apos;s scaling paper draws the line at the server. With a TP degree larger than
            the GPUs in one node, tensor parallelism across slower inter-node links &quot;can be
            impractical&quot;, and its first takeaway is that tensor parallelism &quot;should
            generally be used up to degree g when using g-GPU servers&quot;, with pipeline
            parallelism across servers{' '}
            <Cite tier={3} href={PTDP} venue="SC 2021">
              Efficient Large-Scale Language Model Training on GPU Clusters, Section 3.2, Takeaway #1
            </Cite>
            . In its experiments a poor combination of the two cost up to half the throughput, even
            with fast links between servers{' '}
            <Cite tier={3} href={PTDP} venue="SC 2021">
              Efficient Large-Scale Language Model Training on GPU Clusters, Section 1
            </Cite>
            . On a p5.48xlarge the server is the NVLink domain: NVIDIA lists 8-GPU NVLink domains for
            Hopper{' '}
            <Cite tier={1} href={NVLINK_PAGE} kind="vendor-claim">
              NVIDIA NVLink specifications
            </Cite>
            , the instance&apos;s eight H100s{' '}
            <Cite tier={1} href={EC2_ACCEL}>
              EC2 accelerated computing instance specifications
            </Cite>
            , so TP 8 is the ceiling there. Section 21, Training Hardware on AWS, gives the scale-up
            domain of each training instance.
          </Box>
          <Box variant="p">
            A layout can also leave NVLink by accident, through its rank order. If the eight ranks of each TP group
            landed on eight different instances, every TP all-reduce would cross EFA (Elastic Fabric
            Adapter) with one member per instance. Counted per instance, as section 7 prices a
            crossing, eight such groups share each instance&apos;s 3,200 Gb/s, 400 GB/s{' '}
            <Cite tier={1} href={EC2_ACCEL}>
              EC2 accelerated computing instance specifications
            </Cite>
            , which comes to 50 GB/s per GPU, and the same 0.94 GB takes 18.8 ms per layer per
            micro-batch, longer than the layer&apos;s 13.3 ms of compute (our arithmetic).
          </Box>
          <LayerTimeDiagram />
          <Box variant="small" color="text-body-secondary">
            Our arithmetic at link peaks, not measured. Llama 3.1 70B, TP 8, one 8,192-token sequence
            per micro-batch, BF16 activations, 40% MFU, attention FLOPs left out, no overlap.
          </Box>
          <Box variant="p">
            Section 7&apos;s start-up check, that the eight ranks of every TP group report one
            hostname, is what keeps a run on the 2.1 ms bar.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Check a TP degree against the model's attention heads and KV heads before the framework rejects the run"
          >
            Which degrees the attention heads allow
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Attention splits by heads, so the degree has to fit the head counts. Megatron Core
            rejects a configuration unless the number of attention heads is a multiple of the TP
            degree, and unless the number of query groups is a multiple or a divisor of it{' '}
            <Cite tier={1} href={mg(MG_TCONFIG, 'L1746-L1773')} kind="code">
              Megatron Core transformer_config.py L1746-L1773
            </Cite>
            . Query groups are the KV heads of GQA (grouped-query attention), where each key-value
            head serves a group of query heads.
          </Box>
          <Box variant="p">
            Llama 3.1 has 32, 64 and 128 attention heads at 8B, 70B and 405B, and 8 KV heads at every
            size{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint" accessed={REGISTER_DATE}>
              Llama 3 Herd of Models, Table 3
            </Cite>
            . TP 1, 2, 4 and 8 pass both checks for all three, and 3 or 6 fail the first. TP 16
            passes as well, so for these models the head counts are a check and the instance is the
            limit (our arithmetic).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Turn sequence parallelism on with every TP run: it moves no extra bytes and takes the 70B layout from 99.4 GB per GPU, more than an H100 holds, to 61.9 GB"
          >
            Sequence parallelism: the same bytes, and the 70B layout fits
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            TP divides the matrix multiplications and leaves the layer&apos;s cheaper operations whole.
            The layer norms, and dropout in models that use it, run on the full activation on every
            GPU, and the inputs they keep for the backward pass are stored on every GPU. Those
            operations treat each token independently, so sequence parallelism splits them along the
            sequence: each GPU handles 1/t of the tokens{' '}
            <Cite tier={3} href={SP_PAPER} venue="preprint">
              Reducing Activation Recomputation, Section 4.2.2
            </Cite>
            .
          </Box>
          <Box variant="p">
            The boundaries change to match. Where TP all-reduces after a row-split multiplication, SP
            reduce-scatters, which sums the partial results and leaves each GPU only its slice of the
            tokens; where TP copies the full activation into a column-split multiplication, SP
            all-gathers the slices back into the full sequence. In the backward pass each becomes the
            other{' '}
            <Cite tier={3} href={SP_PAPER} venue="preprint">
              Reducing Activation Recomputation, Section 4.2.2
            </Cite>
            . Because an all-reduce is a reduce-scatter followed by an all-gather (section 7), the
            bytes are the same, and the paper concludes that SP adds no communication overhead. The
            same paper measured the pair running slower than one all-reduce of the same data; a layer
            of its 22B model still went from 7.7 ms to 7.2 ms in the forward pass, 6% faster, because
            the norms and dropout ran on 1/t of the data{' '}
            <Cite tier={3} href={SP_PAPER} venue="preprint">
              Reducing Activation Recomputation, Section 6.2
            </Cite>
            .
          </Box>
          <SpLayerDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured: the layer of the first diagram with the sequence-parallel
            boundaries of the paper&apos;s Section 4.2.2.
          </Box>
          <Box variant="p">
            The paper calls memory &quot;the primary advantage of using sequence parallelism&quot;{' '}
            <Cite tier={3} href={SP_PAPER} venue="preprint">
              Reducing Activation Recomputation, Section 6.2
            </Cite>
            . For Llama 3.1 70B at TP 8, 8,192 tokens, micro-batch 1 and no recomputation, the
            activations of all 80 layers come to 60.1 GB per GPU without SP, because about 8 sbh
            bytes per layer (the two norm inputs and the inputs shared by the projections after them)
            stay whole on every GPU, and 22.5 GB with SP (our count, adapting the paper&apos;s Table
            2 to Llama&apos;s layer{' '}
            <Cite tier={3} href={SP_PAPER} venue="preprint">
              Reducing Activation Recomputation, Table 2
            </Cite>
            ). With the optimizer state sharded over 32 data-parallel ranks, that is the difference
            between 99.4 GB per GPU, which does not fit an 80 GB H100, and 61.9 GB, which fits
            (Calculator B in section 5, The Memory Budget, which flags 61.9 GB as above its 60 GB
            headroom target and asks for a measured step).
          </Box>
          <ExpandableSection headerText="What the code does with sequence parallelism">
            <SpaceBetween size="s">
              <Box variant="p">
                Megatron Core&apos;s row-parallel layer reduce-scatters its output when sequence
                parallelism is on and all-reduces it otherwise{' '}
                <Cite tier={1} href={mg(MG_LAYERS, 'L1698-L1703')} kind="code">
                  Megatron Core layers.py L1698-L1703
                </Cite>
                ; its column-parallel matrix multiplication all-gathers the sequence-split input in
                the forward pass{' '}
                <Cite tier={1} href={mg(MG_LAYERS, 'L724-L731')} kind="code">
                  layers.py L724-L731
                </Cite>{' '}
                and reduce-scatters the input gradient in the backward pass, launched asynchronously
                beside the weight-gradient computation{' '}
                <Cite tier={1} href={mg(MG_LAYERS, 'L801-L812')} kind="code">
                  layers.py L801-L812
                </Cite>
                .
              </Box>
              <Box variant="p">
                TorchTitan v0.4.0 keeps the residual stream between blocks split along the sequence
                when sequence parallelism is on{' '}
                <Cite tier={1} href={tt(TT_SHARDING, 'L214-L221')} kind="code">
                  TorchTitan decoder_sharding.py L214-L221
                </Cite>
                .
              </Box>
              <Box variant="p">
                Megatron-LM&apos;s training script switches sequence parallelism off, with a
                warning, when the TP degree is 1{' '}
                <Cite tier={1} href={mg(MG_ARGS, 'L1339-L1348')} kind="code">
                  Megatron-LM arguments.py L1339-L1348
                </Cite>
                , and its option to overlap TP communication with computation,{' '}
                <code>--tp-comm-overlap</code>, refuses to run without sequence parallelism{' '}
                <Cite tier={1} href={mg(MG_ARGS, 'L1350-L1351')} kind="code">
                  arguments.py L1350-L1351
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
            description="Choose the TP degree, check it against the heads and the hosts, turn sequence parallelism on with it, and hand the rest of the memory problem to sharding and pipelining"
          >
            Set the tensor-parallel degree
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol>
            <li>
              <strong>Keep TP inside one instance&apos;s NVLink:</strong> at most 8 on a p5.48xlarge.
              There, each GPU moves 0.94 GB per layer per micro-batch for the 70B model, 2.1 ms
              against 13.3 ms of compute, about 16% before any overlap; going past the instance
              roughly doubles that share and moves it off NVLink.
            </li>
            <li>
              <strong>Check the degree against the heads:</strong> attention heads a multiple of t,
              KV heads a multiple or a divisor of t. For every Llama 3.1 size, 1, 2, 4 and 8 pass.
            </li>
            <li>
              <strong>Turn sequence parallelism on with TP.</strong> TorchTitan v0.4.0 does so by
              default: <code>enable_sequence_parallel</code> is <code>True</code>, beside a{' '}
              <code>tensor_parallel_degree</code> of 1{' '}
              <Cite tier={1} href={tt(TT_PCONFIG, 'L72-L76')} kind="code">
                TorchTitan parallelism.py L72-L76
              </Cite>
              . Megatron Core&apos;s guide says to always enable it when using TP{' '}
              <Cite tier={1} href={mg(MG_GUIDE, 'L225-L233')}>
                Megatron Core parallelism guide L225-L233
              </Cite>
              , and its configuration defaults it to off{' '}
              <Cite tier={1} href={mg(MG_PCONFIG, 'L123-L127')} kind="code">
                Megatron Core model_parallel_config.py L123-L127
              </Cite>
              , so pass <code>--sequence-parallel</code> with{' '}
              <code>--tensor-model-parallel-size 8</code>, the pair the guide shows{' '}
              <Cite tier={1} href={mg(MG_GUIDE, 'L82-L89')}>
                Megatron Core parallelism guide L82-L89
              </Cite>
              .
            </li>
            <li>
              <strong>Confirm each TP group sits on one host</strong> at start-up, with section
              7&apos;s hostname check, so the traffic stays on the 2.1 ms bar.
            </li>
          </ol>
          <ExpandableSection headerText="One start-up requirement on H100 with Megatron-LM's training script">
            <Box variant="p">
              On a GPU older than Blackwell, which includes the H100, Megatron-LM&apos;s training
              script at core_v0.20.0 stops a run with TP or context parallelism above 1 unless{' '}
              <code>CUDA_DEVICE_MAX_CONNECTIONS=1</code> is set; with Torch FSDP2 or Megatron FSDP
              (Fully Sharded Data Parallel), or with communication overlap for MoE (mixture of
              experts) layers, it warns instead{' '}
              <Cite tier={1} href={mg(MG_ARGS, 'L1376-L1405')} kind="code">
                Megatron-LM arguments.py L1376-L1405
              </Cite>
              . The check reads the GPU&apos;s major compute capability, 9 for Hopper{' '}
              <Cite tier={1} href={mg(MG_COMMON_UTILS, 'L621-L623')} kind="code">
                Megatron-LM common_utils.py L621-L623
              </Cite>
              . The column-parallel layer&apos;s backward pass relies on that setting so that its
              asynchronous all-reduce, or its reduce-scatter with sequence parallelism, is scheduled
              before the weight-gradient computation{' '}
              <Cite tier={1} href={mg(MG_LAYERS, 'L794-L812')} kind="code">
                Megatron Core layers.py L794-L812
              </Cite>
              .
            </Box>
          </ExpandableSection>
          <Box variant="p">
            Then hand what still does not fit to the other dimensions: shard the model state across
            data-parallel ranks (section 8, Data Parallelism &amp; Sharding), split the layers into
            pipeline stages across instances (section 10, Pipeline Parallelism &amp; the Bubble), and
            add context parallelism when activations still outgrow TP, SP and recomputation (section
            11, Long Sequences: Context Parallelism). Section 14, Set My Ranks: The Sizing Procedure,
            runs the whole procedure with TP fixed at the instance.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
