import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, arxiv, gh, MEGATRON_TAG, DEEPSPEED_TAG, E2_URL } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Liu et al., Ring Attention with Blockwise Transformers for Near-Infinite Context, Section 3. */
const RING = arxiv('2310.01889v4');
/** Jacobs et al., DeepSpeed Ulysses, Sections 1 and 3.2. */
const ULYSSES = arxiv('2309.14509v2');
/** The Llama 3 Herd of Models: Table 3 (shapes), Section 3.2 (document mask), Section 3.3.2 and Table 4. */
const LLAMA3 = arxiv('2407.21783v3');

/** Megatron Core context parallelism overview at core_v0.20.0. */
function megatronCpDoc(lines: string): string {
  return gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'docs/user-guide/features/context_parallel.md', lines);
}
/** Megatron Core parallelism guide at core_v0.20.0. */
function megatronGuide(lines: string): string {
  return gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'docs/user-guide/parallelism-guide.md', lines);
}
/** Megatron Core mixture-of-experts README at core_v0.20.0: the memory table and the CP guideline. */
function megatronMoe(lines: string): string {
  return gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/transformer/moe/README.md', lines);
}
/** Megatron Core: CP ranks join the data-parallel group for the weight-gradient all-reduce. */
const MEGATRON_PS_CP = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/parallel_state.py', 'L713-L718');
/** Megatron Core: the --cp-comm-type argument and its default. */
const MEGATRON_CP_COMM = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/training/arguments.py', 'L3186-L3191');
/** DeepSpeed-Ulysses at v0.19.9: the KV-head assertion, the uneven path and the KV-group partition. */
function dsLayer(lines: string): string {
  return gh('deepspeedai/DeepSpeed', DEEPSPEED_TAG, 'deepspeed/sequence/layer.py', lines);
}
const H100_SPEC = 'https://www.nvidia.com/en-us/data-center/h100/';
const NVLINK_PAGE = 'https://www.nvidia.com/en-us/data-center/nvlink/';
const EC2_ACCEL = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';

/* ------------------------------------------------------------------------ */
/* Figure: the three CP designs on four GPUs                                */
/* ------------------------------------------------------------------------ */

const CP_BLUE = '#0972d3';
const CP_AMBER = '#8b6c00';
const CP_AMBER_TINT = '#fbf3d5';
const CP_INK = '#16191f';
const CP_MUTED = '#414d5c';
const CP_GRID = '#879596';
const CP_FONT = 'sans-serif';

type CellState = 'held' | 'arriving' | 'empty';

interface VariantSpec {
  id: 'ring' | 'ulysses' | 'allgather';
  name: string;
  source: string;
  /** What GPU g holds of the keys and values for sequence slice `row` and head group `col`. */
  cell: (gpu: number, row: number, col: number) => CellState;
  /** Label of the collective band across all four GPUs; the ring draws hop arrows instead. */
  band?: string;
  queries: string;
  lines: string[];
  title: string;
}

const VARIANTS: VariantSpec[] = [
  {
    id: 'ring',
    name: 'Ring: pass key and value blocks',
    source: "Ring Attention; Megatron Core's default",
    cell: (gpu, row) => (row === gpu ? 'held' : row === (gpu + 3) % 4 ? 'arriving' : 'empty'),
    queries: 'queries: each GPU keeps its own slice',
    lines: [
      '403 MB per GPU per layer, forward',
      '3 hops of 134 MB, each hidden behind a block',
      "of compute once each GPU's slice is long",
      'enough (the threshold chart below)',
    ],
    title:
      'Ring attention on four GPUs. Each GPU keeps its own slice of the sequence and the keys and values of that slice; at every step it computes attention against one block while passing that block to the next GPU, GPU 3 passing to GPU 0. For Llama 3.1 70B at 131,072 tokens each GPU forwards three blocks of 134 MB, 403 MB per attention layer in the forward pass, hidden behind compute when blocks are long enough.',
  },
  {
    id: 'ulysses',
    name: 'All-to-all: swap tokens for heads',
    source: 'DeepSpeed-Ulysses',
    cell: (gpu, _row, col) => (col === gpu ? 'held' : 'empty'),
    band: 'all-to-all before attention, and after',
    queries: 'queries: every token, one group of heads',
    lines: [
      '906 MB per GPU per layer, forward',
      '503 MB of Q, K and V, then 403 MB of output',
      'degree at most the KV-head count, 8 for',
      'every Llama 3.1 size',
    ],
    title:
      'DeepSpeed-Ulysses on four GPUs. An all-to-all before attention turns each GPU slice of the sequence into the whole sequence for one group of heads, and a second all-to-all after attention turns it back. For Llama 3.1 70B at 131,072 tokens each GPU sends 503 MB of queries, keys and values and 403 MB of output, 906 MB per attention layer in the forward pass, and the degree cannot exceed the 8 key-value heads.',
  },
  {
    id: 'allgather',
    name: 'All-gather: collect every key and value',
    source: 'Llama 3',
    cell: () => 'held',
    band: 'all-gather of K and V before attention',
    queries: 'queries: each GPU keeps its own slice',
    lines: [
      '403 MB per GPU per layer, forward',
      'the same bytes as the ring, in one exposed',
      'collective before attention; works with',
      'any mask, such as a document mask',
    ],
    title:
      "Llama 3's all-gather on four GPUs. Each GPU keeps its own slice of queries, gathers the keys and values of every slice before attention, then computes attention for its queries under any mask. For Llama 3.1 70B at 131,072 tokens each GPU moves 403 MB per attention layer in the forward pass, the same bytes as the ring, with the transfer exposed before compute.",
  },
];

const GRID_X = [24, 108, 192, 276];
const GRID_Y = 68;
const CELL = 13;
const GRID_SIZE = 4 * CELL;
const CARD_W = 360;
const CARD_H = 258;
const CARD_STYLE: CSSProperties = { width: '100%', height: 'auto', display: 'block' };

function GpuGrid({ x, y, state }: { x: number; y: number; state: (row: number, col: number) => CellState }) {
  const cells = [];
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const s = state(row, col);
      cells.push(
        <rect
          key={`c-${row}-${col}`}
          x={x + col * CELL}
          y={y + row * CELL}
          width={CELL}
          height={CELL}
          fill={s === 'held' ? CP_BLUE : s === 'arriving' ? CP_AMBER_TINT : '#ffffff'}
          stroke={s === 'arriving' ? CP_AMBER : CP_GRID}
          strokeWidth={s === 'arriving' ? 1.5 : 0.75}
        />,
      );
    }
  }
  return <g>{cells}</g>;
}

/** The drawing inside one card; the svg wrapper and its title live in VariantCard. */
function VariantBody({ spec }: { spec: VariantSpec }) {
  return (
    <g>
      <rect x="0.5" y="0.5" width={CARD_W - 1} height={CARD_H - 1} rx="8" fill="#ffffff" stroke="#d1d5db" />
      <text x="12" y="22" fill={CP_INK} fontSize={13} fontWeight={600} fontFamily={CP_FONT}>
        {spec.name}
      </text>
      <text x="12" y="39" fill={CP_MUTED} fontSize={11} fontFamily={CP_FONT}>
        {spec.source}
      </text>
      {GRID_X.map((gx, gpu) => (
        <g key={`gpu-${gx}`}>
          <text x={gx + GRID_SIZE / 2} y={GRID_Y - 7} fill={CP_MUTED} fontSize={11} fontFamily={CP_FONT} textAnchor="middle">
            GPU {gpu}
          </text>
          <GpuGrid x={gx} y={GRID_Y} state={(row, col) => spec.cell(gpu, row, col)} />
        </g>
      ))}
      {spec.band ? (
        <g>
          <rect x={GRID_X[0]} y={130} width={GRID_X[3] + GRID_SIZE - GRID_X[0]} height={20} rx={4} fill={CP_AMBER} />
          <text x={CARD_W / 2} y={144} fill="#ffffff" fontSize={11} fontWeight={600} fontFamily={CP_FONT} textAnchor="middle">
            {spec.band}
          </text>
        </g>
      ) : (
        <g>
          {GRID_X.slice(0, 3).map((gx) => (
            <line
              key={`hop-${gx}`}
              x1={gx + GRID_SIZE + 4}
              y1={GRID_Y + GRID_SIZE / 2}
              x2={gx + GRID_SIZE + 26}
              y2={GRID_Y + GRID_SIZE / 2}
              stroke={CP_AMBER}
              strokeWidth={1.75}
              markerEnd="url(#context-parallel-ring-ah)"
            />
          ))}
          <path
            d={`M${GRID_X[3] + GRID_SIZE / 2},${GRID_Y + GRID_SIZE + 3} V${GRID_Y + GRID_SIZE + 16} H${GRID_X[0] + GRID_SIZE / 2} V${GRID_Y + GRID_SIZE + 6}`}
            fill="none"
            stroke={CP_AMBER}
            strokeWidth={1.75}
            markerEnd="url(#context-parallel-ring-ah)"
          />
          <text x={CARD_W / 2} y={154} fill={CP_MUTED} fontSize={11} fontFamily={CP_FONT} textAnchor="middle">
            each step: compute on one block, pass it on
          </text>
        </g>
      )}
      <text x="12" y="174" fill={CP_MUTED} fontSize={11} fontFamily={CP_FONT}>
        {spec.queries}
      </text>
      {spec.lines.map((line, i) => (
        <text
          key={line}
          x="12"
          y={198 + i * 16}
          fill={CP_INK}
          fontSize={11}
          fontWeight={i === 0 ? 600 : 400}
          fontFamily={CP_FONT}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

/** One svg per card, with literal title ids so each diagram carries its own accessible name. */
function VariantCard({ spec }: { spec: VariantSpec }) {
  const body = <VariantBody spec={spec} />;
  switch (spec.id) {
    case 'ring':
      return (
        <svg viewBox={`0 0 ${CARD_W} ${CARD_H}`} role="img" aria-labelledby="context-parallel-ring-title" style={CARD_STYLE}>
          <title id="context-parallel-ring-title">{spec.title}</title>
          <defs>
            <marker
              id="context-parallel-ring-ah"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill={CP_AMBER} />
            </marker>
          </defs>
          {body}
        </svg>
      );
    case 'ulysses':
      return (
        <svg viewBox={`0 0 ${CARD_W} ${CARD_H}`} role="img" aria-labelledby="context-parallel-ulysses-title" style={CARD_STYLE}>
          <title id="context-parallel-ulysses-title">{spec.title}</title>
          {body}
        </svg>
      );
    default:
      return (
        <svg viewBox={`0 0 ${CARD_W} ${CARD_H}`} role="img" aria-labelledby="context-parallel-allgather-title" style={CARD_STYLE}>
          <title id="context-parallel-allgather-title">{spec.title}</title>
          {body}
        </svg>
      );
  }
}

function VariantsFigure() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
        gap: 12,
      }}
    >
      {VARIANTS.map((v) => (
        <VariantCard key={v.id} spec={v} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Chart: tokens per GPU a ring needs, against tokens per GPU it has        */
/* ------------------------------------------------------------------------ */

interface ThresholdRow {
  label: string;
  value: number;
  text: string;
  kind: 'needed' | 'held';
}

/** Ring Attention's c >= F/B on an H100 (989.5 TFLOPS dense BF16), and two example slices. */
const THRESHOLD_ROWS: ThresholdRow[] = [
  { label: 'Needed over EFA, K and V at full width', value: 19_790, text: '19.8K', kind: 'needed' },
  { label: 'Needed over NVLink, K and V at full width', value: 2_199, text: '2.2K', kind: 'needed' },
  { label: "Needed over EFA, 70B's 8 KV heads", value: 2_474, text: '2.5K', kind: 'needed' },
  { label: "Needed over NVLink, 70B's 8 KV heads", value: 275, text: '275', kind: 'needed' },
  { label: 'Held by each GPU: CP 8 at 131,072 tokens', value: 16_384, text: '16,384', kind: 'held' },
  { label: 'Held by each GPU: CP 4 at 8,192 tokens', value: 2_048, text: '2,048', kind: 'held' },
];

function ThresholdChart() {
  const W = 360;
  const x0 = 14;
  const x1 = W - 14;
  const sx = (v: number) => x0 + ((x1 - x0) * (Math.log10(v) - 2)) / 3;
  const rowY = (i: number) => 64 + i * 32;
  const axisY = 254;
  const ticks = [
    { v: 100, t: '100' },
    { v: 1_000, t: '1K' },
    { v: 10_000, t: '10K' },
    { v: 100_000, t: '100K tokens' },
  ];
  return (
    <svg
      viewBox={`0 0 ${W} 278`}
      role="img"
      aria-labelledby="context-parallel-threshold-title"
      style={{ width: '100%', maxWidth: 620, height: 'auto', display: 'block' }}
    >
      <title id="context-parallel-threshold-title">
        Tokens of the sequence each GPU must hold for a ring to hide its key and value transfer, on a
        log scale, for the Llama 3.1 70B shape at an H100&apos;s dense BF16 peak. With keys and values
        at full hidden width a ring needs about 19.8K tokens per GPU over EFA and 2.2K over NVLink;
        with 70B&apos;s 8 key-value heads, an eighth of that width, it needs about 2.5K and 275. CP 8
        at 131,072 tokens leaves each GPU 16,384 tokens, past the grouped-query EFA threshold; CP 4 at
        8,192 tokens leaves 2,048, short of it.
      </title>
      <rect x="0" y="0" width={W} height="278" rx="8" fill="#ffffff" />
      <text x={x0} y="20" fill={CP_INK} fontSize={12} fontWeight={600} fontFamily={CP_FONT}>
        Tokens per GPU a ring needs, and tokens held
      </text>
      <text x={x0} y="37" fill={CP_MUTED} fontSize={11} fontFamily={CP_FONT}>
        H100 dense BF16 peak, Llama 3.1 70B, log scale
      </text>
      {THRESHOLD_ROWS.map((r, i) => {
        const y = rowY(i);
        const ty = y + 12;
        const x = sx(r.value);
        const color = r.kind === 'needed' ? CP_AMBER : CP_BLUE;
        // Value label beside the marker, on whichever side has room; about 7 units per bold 11px glyph.
        const labelW = r.text.length * 7;
        const right = x + 10 + labelW > x1;
        const labelFrom = right ? x - 10 - labelW : x + 10;
        const labelTo = right ? x - 10 : x + 10 + labelW;
        const trackTicks = ticks.slice(1, 3).filter((t) => sx(t.v) < labelFrom - 2 || sx(t.v) > labelTo + 2);
        return (
          <g key={r.label}>
            <title>{`${r.label}: ${r.text} tokens per GPU`}</title>
            <text x={x0} y={y} fill={CP_MUTED} fontSize={11} fontFamily={CP_FONT}>
              {r.label}
            </text>
            <line x1={x0} y1={ty} x2={x1} y2={ty} stroke="#e9ebed" strokeWidth={2} />
            {trackTicks.map((t) => (
              <line key={`tk-${t.v}`} x1={sx(t.v)} y1={ty - 3} x2={sx(t.v)} y2={ty + 3} stroke={CP_GRID} strokeWidth={1} />
            ))}
            {r.kind === 'needed' ? (
              <path d={`M${x},${ty - 6} L${x + 6},${ty} L${x},${ty + 6} L${x - 6},${ty} Z`} fill={color} />
            ) : (
              <circle cx={x} cy={ty} r={5} fill={color} />
            )}
            <text
              x={right ? x - 10 : x + 10}
              y={ty + 4}
              fill={CP_INK}
              fontSize={11}
              fontWeight={600}
              fontFamily={CP_FONT}
              textAnchor={right ? 'end' : 'start'}
            >
              {r.text}
            </text>
          </g>
        );
      })}
      <line x1={x0} y1={axisY} x2={x1} y2={axisY} stroke={CP_GRID} strokeWidth={1} />
      {ticks.map((t) => (
        <line key={`tick-${t.v}`} x1={sx(t.v)} y1={axisY} x2={sx(t.v)} y2={axisY + 4} stroke={CP_GRID} strokeWidth={1} />
      ))}
      {ticks.map((t) => (
        <text
          key={`ticklabel-${t.v}`}
          x={sx(t.v)}
          y={axisY + 17}
          fill={CP_MUTED}
          fontSize={11}
          fontFamily={CP_FONT}
          textAnchor={t.v === 100 ? 'start' : t.v === 100_000 ? 'end' : 'middle'}
        >
          {t.t}
        </text>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* Table: memory per GPU for Llama 3.1 70B, 8K against 128K                 */
/* ------------------------------------------------------------------------ */

const cell: CSSProperties = {
  padding: '6px 8px',
  borderBottom: '1px solid #e9ebed',
  textAlign: 'left',
  verticalAlign: 'top',
};
const headCell: CSSProperties = { ...cell, fontWeight: 700, borderBottom: '2px solid #d1d5db' };
const numCell: CSSProperties = { ...cell, whiteSpace: 'nowrap' };

const MEMORY_ROWS: Array<{ layout: string; gb: string }> = [
  { layout: '8,192 tokens: TP 8 x PP 4 x DP 8, no recomputation', gb: '38.0' },
  { layout: '131,072 tokens, same layout, no recomputation', gb: '426, does not fit' },
  { layout: '131,072 tokens, same layout, full recomputation', gb: '41.3' },
  { layout: '131,072 tokens: TP 8 x CP 8 x PP 4 x DP 1, no recomputation', gb: '57.1' },
];

function MemoryTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>Llama 3.1 70B on 32 p5.48xlarge</th>
            <th style={headCell}>GB per GPU</th>
          </tr>
        </thead>
        <tbody>
          {MEMORY_ROWS.map((r) => (
            <tr key={r.layout}>
              <td style={cell}>{r.layout}</td>
              <td style={numCell}>{r.gb}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function ContextParallel() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Split one sequence across GPUs when its activations outgrow the GPU, then choose ring, all-to-all or all-gather by your attention heads and mask: for Llama 3.1 70B at 131,072 tokens on p5.48xlarge, eight-way context parallelism fits without recomputation and its key and value traffic is about 4% of compute even unhidden (Megatron Core core_v0.20.0 and DeepSpeed v0.19.9, read 2026-10-31)"
          >
            11. Long Sequences: Context Parallelism
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            CP (context parallelism) splits one training sequence across GPUs. Each GPU of a CP group
            holds a slice of the sequence&apos;s tokens and every activation that belongs to them, the
            values the forward pass keeps for the backward pass. Activation memory grows about
            linearly with sequence length{' '}
            <Cite tier={1} href={megatronCpDoc('L32')}>
              Megatron Core context parallelism overview, L32
            </Cite>
            , so a layout that trains Llama 3.1 70B at 8,192 tokens holds 16 times the activations
            at 131,072 tokens, far past an 80 GB H100{' '}
            <Cite tier={1} href={H100_SPEC} kind="vendor-claim">
              NVIDIA H100 specification
            </Cite>
            . Llama 3 trained its 128K-token stage with CP 16{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Table 4
            </Cite>
            .
          </Box>
          <Box variant="p">
            The challenge is attention. The rest of a layer works token by token, but each
            token&apos;s query must meet the keys and values of all the tokens in its sequence{' '}
            <Cite tier={1} href={megatronCpDoc('L19')}>
              Megatron Core context parallelism overview, L19
            </Cite>
            , so a GPU holding one slice needs keys and values from all the others. CP pays for its
            memory with that traffic, and the published designs differ in how they move it. This
            section shows what CP divides, the three ways to move keys and values, when the transfer
            hides behind compute on a p5.48xlarge (over NVLink inside the instance and EFA, Elastic
            Fabric Adapter, between instances), and when to add CP at all.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Expect CP to divide activations by its degree while every GPU keeps the full weights, so it is the dimension to add when the sequence outgrows the GPU"
          >
            What CP divides, and what it leaves whole
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            CP partitions the network inputs and all activations along the sequence. SP (sequence
            parallelism), the companion of TP (tensor parallelism, which splits each layer&apos;s
            matrices across the GPUs of one instance; section 9, Tensor &amp; Sequence Parallelism), splits only the sequence of the
            dropout and norm activations{' '}
            <Cite tier={1} href={megatronCpDoc('L19')}>
              Megatron Core context parallelism overview, L19
            </Cite>
            . Linear layers and norms have no operations across tokens, so they run unchanged on a
            slice, and each GPU&apos;s activation memory falls by the CP degree{' '}
            <Cite tier={1} href={megatronCpDoc('L19-L34')}>
              Megatron Core context parallelism overview, L19 and L34
            </Cite>
            .
          </Box>
          <Box variant="p">
            The weights stay whole. Every GPU of a CP group holds the same weights, so Megatron Core
            adds the CP ranks (one training process per GPU) to the data-parallel group for the weight-gradient all-reduce{' '}
            <Cite tier={1} href={MEGATRON_PS_CP} kind="code">
              Megatron Core parallel_state.py L713-L718
            </Cite>
            , and CP saves no weight memory. Megatron&apos;s distributed optimizer, its form of ZeRO
            stage 1 (Zero Redundancy Optimizer, which shards optimizer state across ranks), does
            shard the optimizer state over the data-parallel and CP ranks together{' '}
            <Cite tier={1} href={megatronMoe('L160-L166')}>
              Megatron Core mixture-of-experts README, memory table, L160-L166
            </Cite>
            .
          </Box>
          <Box variant="p">
            Price it on the dive&apos;s running example, Llama 3.1 70B on 32 p5.48xlarge (256 H100
            GPUs), with the memory calculator of section 5, The Memory Budget. The 8,192-token layout is TP 8
            x PP 4 x DP 8: TP over the eight GPUs of each instance, PP (pipeline parallelism) over four
            stages of layers with five interleaved chunks per stage (section 10, Pipeline Parallelism
            &amp; the Bubble), and DP (data parallelism) over eight copies with ZeRO-1. It holds about
            38 GB per GPU without recomputation.
            At 131,072 tokens it needs about 426 GB. Two levers bring it back: recomputation,
            re-running each layer&apos;s forward pass during the backward pass instead of storing its
            activations, or CP.
          </Box>
          <MemoryTable />
          <Box variant="small" color="text-body-secondary">
            Estimate; confirm with a measured step. Section 5&apos;s memory calculator, first pipeline
            stage: micro-batch 1, BF16 (bfloat16) weights and gradients,
            optimizer state sharded over 8 ranks, section 5&apos;s activation count for a 70B layer,
            logits upcast to 32 bits, 80 GB per H100. Five interleaved chunks per stage in the first
            three rows, none in the CP row.
          </Box>
          <Box variant="p">
            Recomputation brings the activations back for about a third more arithmetic per step
            (section 5). CP 8 keeps every activation: each GPU holds 16,384 tokens of the sequence,
            and the eight GPUs CP needs come out of DP, which falls from 8 to 1 on the same 256 GPUs.
            Llama 3 made the same trade at scale. Its 8,192-token stage ran DP 128 on 16,384 GPUs and
            its 131,072-token stage CP 16 x DP 8 on the same count, both with 16 sequences per
            data-parallel group and 16M tokens per batch{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Table 4
            </Cite>
            , so each CP rank held 8,192 tokens, the length of the earlier stage (our arithmetic).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Match the design to the attention layout: the ring hides its hops behind compute, the all-to-all is capped by the count of key and value heads, and the all-gather takes any mask"
          >
            Three ways to move keys and values
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Ring.</strong> Ring Attention arranges the CP group as a ring. Each GPU computes
            attention between its query block and one key-value block while sending that block to the
            next GPU and receiving the previous GPU&apos;s; when computing a block takes longer than
            moving it, the transfer adds no time, in the forward and the backward pass{' '}
            <Cite tier={3} href={RING} venue="preprint">
              Ring Attention, Section 3
            </Cite>
            . Megatron Core gathers keys and values the same way, as point-to-point transfers around a
            ring, and reduce-scatters their gradients in the backward pass{' '}
            <Cite tier={1} href={megatronCpDoc('L19')}>
              Megatron Core context parallelism overview, L19
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>All-to-all.</strong> DeepSpeed-Ulysses, which DeepSpeed calls sequence
            parallelism, swaps the split instead. An all-to-all before attention gives each GPU the
            whole sequence for a non-overlapping subset of the attention heads, each GPU computes
            attention for its heads, and a second all-to-all returns the output to a split by tokens{' '}
            <Cite tier={3} href={ULYSSES} venue="preprint">
              DeepSpeed Ulysses, Section 1
            </Cite>
            . The paper counts 4Nh/P per link per layer, for N tokens, hidden size h and degree P,
            constant when N and P grow together{' '}
            <Cite tier={3} href={ULYSSES} venue="preprint">
              DeepSpeed Ulysses, Section 3.2
            </Cite>
            .
          </Box>
          <Box variant="p">
            Under GQA (grouped-query attention, where several query heads share one key and value
            head) the split follows the KV (key and value) heads, and DeepSpeed v0.19.9 rejects a
            degree above their count{' '}
            <Cite tier={1} href={dsLayer('L35-L37')} kind="code">
              DeepSpeed sequence/layer.py L35-L37
            </Cite>
            . Every Llama 3.1 size has 8 KV heads{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Table 3
            </Cite>
            , so Ulysses stops at 8. TP splits the same heads: with TP 8, each GPU holds one KV head
            of a Llama 3.1 model and Ulysses has nothing left to split (our reading of the code).
          </Box>
          <ExpandableSection headerText="How DeepSpeed v0.19.9 splits heads under GQA">
            <Box variant="p">
              DeepSpeed takes the head count from the key tensor, so each query head lands on the GPU
              holding its KV head{' '}
              <Cite tier={1} href={dsLayer('L544-L547')} kind="code">
                DeepSpeed sequence/layer.py L544-L547
              </Cite>
              , and splits a count that does not divide evenly unevenly{' '}
              <Cite tier={1} href={dsLayer('L286-L288')} kind="code">
                DeepSpeed sequence/layer.py L286-L288
              </Cite>
              ; the file has no path that replicates KV heads.
            </Box>
          </ExpandableSection>
          <Box variant="p">
            <strong>All-gather.</strong> Llama 3 all-gathers the keys and values (K and V), then
            computes attention for its local queries. The all-gather sits on the critical path, and Meta accepted that for two
            reasons: it supports any attention mask, such as the document mask, and GQA makes K and V
            much smaller than Q, so attention at O(S^2) outweighs the all-gather at O(S), for sequence length S{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.2
            </Cite>
            . The document mask, which stops attention between documents packed into one sequence,
            had limited impact in standard pre-training and proved important in continued pre-training
            on very long sequences{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.2
            </Cite>
            . Llama 3 also cuts each sequence into 2 x CP chunks and gives rank i chunks i and 2 x CP
            - 1 - i{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.2
            </Cite>
            . Under a causal mask chunk k attends to k + 1 chunks of keys, so every rank&apos;s pair
            adds up to 2 x CP + 1 chunks of work (our arithmetic).
          </Box>
          <VariantsFigure />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. Each GPU is drawn as a grid of four sequence slices (rows) by
            four head groups (columns). Blue cells are the keys and values the GPU holds, an amber
            outline marks the block arriving from the previous GPU, and an amber band is one collective
            across all four GPUs. Llama 3.1 70B at 131,072 tokens on four GPUs with no TP, BF16, forward
            pass of one attention layer; bytes per GPU are our arithmetic, worked in the block below.
          </Box>
          <Box variant="p">
            The ring and the all-gather move the same bytes and differ in timing: each GPU receives
            (P-1)/P of the sequence&apos;s K and V, the ring in P - 1 hops it can hide, the all-gather
            at once. Ulysses moves queries, keys, values and
            output for its 1/P of the tokens. With g query heads per KV head that is (g + 1)/P times
            the all-gather&apos;s bytes, fewer only when P exceeds g + 1 (our arithmetic). For Llama
            3.1 70B g is 8 and Ulysses stops at 8, so it moves more at every degree it can run; with
            one KV head per query head, g = 1, it moves 2/P of the ring&apos;s bytes.
          </Box>
          <Box variant="p">
            Megatron Core takes the choice per layer: <code>--cp-comm-type</code> accepts{' '}
            <code>p2p</code>, the ring and the default, <code>a2a</code>, <code>allgather</code> or{' '}
            <code>a2a+p2p</code>{' '}
            <Cite tier={1} href={MEGATRON_CP_COMM} kind="code">
              Megatron Core arguments.py L3186-L3191
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="Bytes per attention layer, worked">
            <SpaceBetween size="s">
              <Box variant="p">
                Inputs: Llama 3.1 70B has hidden size 8,192 and 8 KV heads of 128 dimensions, 1,024
                wide{' '}
                <Cite tier={3} href={LLAMA3} venue="preprint">
                  Llama 3 Herd of Models, Table 3
                </Cite>
                ; s = 131,072 tokens, P = 4 GPUs, 2 bytes per BF16 value, forward pass only.
              </Box>
              <Box variant="p">
                Ring and all-gather: each GPU moves the K and V of the other three slices,{' '}
                <code>3/4 x 2 x 131,072 x 1,024 x 2 B = 403 MB</code>; in the ring that is three
                blocks of <code>2 x 32,768 x 1,024 x 2 B = 134 MB</code>, the 4cd bytes per block of
                Ring Attention&apos;s count{' '}
                <Cite tier={3} href={RING} venue="preprint">
                  Ring Attention, Section 3
                </Cite>
                .
              </Box>
              <Box variant="p">
                Ulysses: each GPU sends three quarters of its slice&apos;s Q, K and V,{' '}
                <code>3/4 x 32,768 x (8,192 + 2 x 1,024) x 2 B = 503 MB</code>, and three quarters of
                its output, <code>3/4 x 32,768 x 8,192 x 2 B = 403 MB</code>: 906 MB. With full
                multi-head attention, K and V 8,192 wide, the ring would move 3.2 GB and Ulysses 1.6
                GB. In general, per GPU, Ulysses moves <code>(P-1)/P x (s/P) x 2(h + d_kv)</code>{' '}
                values and the ring <code>(P-1)/P x s x 2 d_kv</code>, a ratio of (h/d_kv + 1)/P.
                All our arithmetic.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Check one ratio before you count on the overlap: on a p5.48xlarge a ring hides its transfer once each GPU holds about 2.2K tokens over NVLink or 19.8K over EFA, and 70B's 8 KV heads cut both eightfold"
          >
            When the ring hides its transfer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Ring Attention gives the condition. A block of c tokens costs 4dc^2 FLOPs (floating-point
            operations) of attention, for hidden size d, while its keys and values cost 4cd bytes in
            BF16, so the transfer hides when c is at least F/B: the GPU&apos;s peak FLOPS over the
            link&apos;s one-way bandwidth in bytes per second{' '}
            <Cite tier={3} href={RING} venue="preprint">
              Ring Attention, Section 3
            </Cite>
            . The block is the slice each GPU holds, the sequence length over the CP degree.
          </Box>
          <Box variant="p">
            On a p5.48xlarge an H100&apos;s dense BF16 peak is 989.5 TFLOPS (trillion floating-point
            operations per second), half the 1,979 NVIDIA lists with sparsity{' '}
            <Cite tier={1} href={H100_SPEC} kind="vendor-claim">
              NVIDIA H100 specification
            </Cite>
            ; NVLink gives each GPU 450 GB/s per direction, our reading of the 900 GB/s NVIDIA states{' '}
            <Cite tier={1} href={NVLINK_PAGE} kind="vendor-claim">
              NVIDIA NVLink specifications
            </Cite>
            ; and EFA gives the instance 3,200 Gb/s, 400 GB/s or 50 GB/s
            per GPU{' '}
            <Cite tier={1} href={EC2_ACCEL}>
              EC2 (Elastic Compute Cloud) accelerated computing instance specifications
            </Cite>
            . A ring then needs about 2.2K tokens per GPU over NVLink and about 19.8K over EFA (our
            arithmetic), the EFA figure for one member of each CP group per instance, which is what TP
            8 gives.
          </Box>
          <Box variant="p">
            Both thresholds assume keys and values as wide as the hidden size. Llama 3.1 70B has 64
            query heads and 8 KV heads{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Table 3
            </Cite>
            , so K and V are an eighth of that width while the attention FLOPs stay the same, and the
            thresholds fall to about 275 and 2.5K tokens (our arithmetic). At the 40% MFU (model FLOPs
            utilization, the share of peak arithmetic a run achieves) this dive assumes, compute runs
            2.5 times slower than peak and every threshold falls 2.5 times again.
          </Box>
          <ThresholdChart />
          <Box variant="small" color="text-body-secondary">
            Our arithmetic from the inputs above, at the dense BF16 peak; at 40% MFU every threshold is
            2.5 times lower. Not measured.
          </Box>
          <Box variant="p">
            This is the section&apos;s mental model: long sequences hide their own communication. A
            block&apos;s attention grows with the square of its tokens and its keys and values only in
            proportion, and over a whole sequence attention is O(S^2) against O(S) for the gather{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.2
            </Cite>
            . The lengths that make CP necessary are the ones that make its traffic cheap. CP 8 at
            131,072 tokens leaves each GPU 16,384 tokens, about 6.6 times the 2.5K that EFA needs with
            GQA; CP 4 at 8,192 tokens leaves 2,048, below the threshold at peak and above it only at
            the 40% assumption, so at short lengths the overlap depends on how fast the kernels
            actually run (our reading).
          </Box>
          <Box variant="p">
            The sizing calculator of section 14, Set My Ranks, prices CP as one all-gather of K and V
            in the forward pass, the way Llama 3 runs it, and one reduce-scatter of their gradients in
            the backward pass, per layer, per instance. For the CP 8 layout at 131,072 tokens that is 601 GB per instance per
            step, 1.5 s at 400 GB/s against 38.9 s of compute: about 4%, with none of it hidden.
            Megatron Core gathers K and V again in the backward pass to save memory{' '}
            <Cite tier={1} href={megatronCpDoc('L19')}>
              Megatron Core context parallelism overview, L19
            </Cite>
            , which adds half again, about 6% (our arithmetic).
          </Box>
          <ExpandableSection headerText="Where the thresholds come from">
            <SpaceBetween size="s">
              <Box variant="p">
                The paper&apos;s condition is <code>4dc^2 / F &gt;= 4cd / B</code>, which gives{' '}
                <code>c &gt;= F / B</code>; it counts only the attention matmuls, so it is the
                stricter case, and its own table puts an A100 at about 1.0K tokens per block over
                NVLink at 300 GB/s and about 24.5K over InfiniBand at 12.5 GB/s{' '}
                <Cite tier={3} href={RING} venue="preprint">
                  Ring Attention, Section 3 and Table 2
                </Cite>
                .
              </Box>
              <Box variant="p">
                H100 on p5.48xlarge: <code>989.5e12 / 450e9 = 2,199</code> tokens over NVLink and{' '}
                <code>989.5e12 / 50e9 = 19,790</code> over EFA. The 989.5 TFLOPS halves the sparse
                figure on the assumption that the footnote means 2:4 structured sparsity; NVIDIA does
                not print the dense number on that page. With K and V at 1,024 of 8,192 dimensions the
                bytes per block fall eight times and the FLOPs do not: <code>2,199 / 8 = 275</code> and{' '}
                <code>19,790 / 8 = 2,474</code>. At 40% MFU the achieved rate is 395.8 TFLOPS, which
                gives about 880 and 7.9K at full width and about 110 and 990 with GQA. All our
                arithmetic.
              </Box>
              <Box variant="p">
                Why the EFA figure applies with TP 8: Megatron Core&apos;s key and value exchange runs
                between a GPU and its counterparts in other TP groups{' '}
                <Cite tier={1} href={megatronCpDoc('L19')}>
                  Megatron Core context parallelism overview, L19
                </Cite>
                , so with TP filling the instance every ring hop crosses to another instance. Each hop
                then rides its GPU&apos;s 50 GB/s share while eight rings share the instance&apos;s
                400 GB/s, the way section 7, Collectives &amp; What They Cost, prices traffic
                addressed GPU to GPU. A CP group with several GPUs in one instance sends some hops
                over NVLink (our reading).
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Reach for CP after TP with SP and the recomputation you accept, size it by the tokens each GPU keeps, and pick the design from the heads and the mask"
          >
            Add CP when the activations do not fit
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Megatron Core recommends CP for long sequences, 8K tokens and more{' '}
            <Cite tier={1} href={megatronGuide('L31')}>
              Megatron Core parallelism guide, L31
            </Cite>{' '}
            <Cite tier={1} href={megatronMoe('L218-L222')}>
              Megatron Core mixture-of-experts README, L218-L222
            </Cite>
            . Llama 3 trained 405B at 8,192 tokens with CP 1{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Table 4
            </Cite>{' '}
            and without activation checkpointing{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.2
            </Cite>
            , while Megatron Core&apos;s own example runs Llama 3 70B at 8,192 tokens on 64 GPUs with
            CP 2{' '}
            <Cite tier={1} href={megatronGuide('L182-L196')}>
              Megatron Core parallelism guide, L182-L196
            </Cite>
            . Our reading: 8K marks where to start checking, and the memory budget decides.
          </Box>
          <Box variant="p">
            When both levers fit, compare the step. At 131,072 tokens on the 256 GPUs above, with the
            step held at 4,194,304 tokens as Llama 3 held its batch, section 14&apos;s calculator puts
            full recomputation at about 60 to 63 s per step and CP 8 at about 42 to 47 s, roughly a
            quarter less. Two terms make the difference. CP skips the third of extra arithmetic, which
            Megatron Core&apos;s overview puts at about 30% of overhead{' '}
            <Cite tier={1} href={megatronCpDoc('L32')}>
              Megatron Core context parallelism overview, L32
            </Cite>
            . And by taking its ranks from DP, CP hands the one pipeline all 32 sequences of the step
            as micro-batches, the slices of the step&apos;s batch that flow through the pipeline one at
            a time, so the bubble, the idle time at the start and end of a pipelined step,
            is 9.4% against 15% for four micro-batches with five chunks. NVIDIA reports the same
            direction for a 175B GPT, TP with CP ahead of full recomputation{' '}
            <Cite tier={1} href={megatronCpDoc('L29-L34')} kind="vendor-claim">
              Megatron Core context parallelism overview, L29-L34
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="Calculator settings behind the 131,072-token comparison">
            <SpaceBetween size="s">
              <Box variant="p">
                Section 14&apos;s calculator, evaluated layout by layout: Llama 3.1 70B, 32
                p5.48xlarge, 131,072-token sequences, 4,194,304 tokens per step (32 sequences),
                micro-batch 1, ZeRO-1, BF16, causal attention FLOPs, 40% MFU of the 989.5 TFLOPS dense
                peak, link peaks, exposed communication as a range from full overlap to none.
              </Box>
              <Box variant="p">
                TP 8 x PP 4 x DP 8 with five chunks per stage and full recomputation: 41.3 GB per GPU,
                compute 38.9 s times 4/3 for recomputation, bubble <code>3 / (5 x 4) = 15%</code>,
                step 59.6 to 62.6 s. TP 8 x CP 8 x PP 4 x DP 1 with no interleaving and no
                recomputation: 57.1 GB, bubble <code>3 / 32 = 9.4%</code>, K and V traffic 1.5 s,
                step 42.5 to 46.9 s. With five chunks the CP layout reaches 63.8 GB, above the
                calculator&apos;s 75% headroom target on an 80 GB GPU, which is why the table uses
                none. Compute at 131,072 tokens is about twice the 18.9 s of the same tokens at 8,192,
                because attention&apos;s FLOPs grow with the sequence (section 4, Counting the
                Arithmetic). The calculator charges full recomputation its FLOP cost, a factor of 4/3;
                this dive&apos;s one measurement of it, on a single GB10 with unified memory and a 1B
                Llama-shaped model at 2,048 tokens, cost 14% to 16% more step time{' '}
                <Cite tier={0} href={E2_URL}>
                  E2: step time and recomputation on one GB10, PyTorch 2.15.0, two runs
                </Cite>
                , which at 1.15 would put the recomputed layout at about 51 to 54 s and narrow the gap
                to about 15% (our arithmetic). Estimates; confirm with a measured step.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">Set the CP dimension in this order:</Box>
          <ol>
            <li>
              <strong>Fit without CP first.</strong> TP up to the instance with SP, then the
              recomputation you are willing to pay for, checked against section 5&apos;s memory
              calculator.
            </li>
            <li>
              <strong>Add CP when the activations still do not fit,</strong> or when recomputation
              costs more than CP&apos;s traffic, about 4% of compute in the example above, or at the
              lengths where Llama 3 used it, CP 16 at 131,072 tokens. Take the smallest degree that
              fits, think of it as tokens per GPU, and take its ranks from DP.
            </li>
            <li>
              <strong>Nest CP next to TP.</strong> Llama 3 orders its dimensions TP, CP, PP, DP from
              innermost to outermost{' '}
              <Cite tier={3} href={LLAMA3} venue="preprint">
                Llama 3 Herd of Models, Section 3.3.2
              </Cite>
              ; with TP 8 on a p5.48xlarge that puts one GPU of each CP group in every instance, each
              hop at 50 GB/s (section 13, Composing the Dimensions).
            </li>
            <li>
              <strong>Choose the design by heads and mask.</strong> A document mask or any other
              custom mask: the all-gather. A model with as many KV heads as query heads, or close to it,
              and heads left over after TP: Ulysses, which moves fewer bytes than the ring once its
              degree passes g + 1, up to the KV-head count. Otherwise the ring, Megatron Core&apos;s default, once
              each GPU&apos;s slice clears F/B for its link.
            </li>
          </ol>
          <Box variant="p">
            Then run section 14&apos;s calculator at your sequence length. It tries CP degrees up to 8
            from 8,192 tokens, prices the key and value traffic per instance and ranks the layouts
            that fit; measure the top two or three.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
