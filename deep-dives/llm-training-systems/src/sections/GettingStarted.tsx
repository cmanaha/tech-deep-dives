import { useRef } from 'react';
import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, arxiv } from '../components/Cite';
import { useNarrow } from '../components/useNarrow';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Chowdhery et al., PaLM, Appendix B: 6N matmul FLOPs per token, 2N forward and 4N backward. */
const PALM = arxiv('2204.02311v5');
/** Rajbhandari et al., ZeRO: Sec 3.1 (16 bytes per parameter), Sec 7.1 (all-reduce as two steps). */
const ZERO = arxiv('1910.02054v3');
/** The Llama 3 Herd of Models: Sec 3.3.1 (up to 16K H100) and Sec 3.3.4 (interruptions). */
const LLAMA3 = arxiv('2407.21783v3');
/** Meta's Hugging Face model metadata for Llama 3.1 8B at a pinned revision (exact parameter count). */
const HF_LLAMA_8B =
  'https://huggingface.co/api/models/meta-llama/Llama-3.1-8B/revision/d04e592bb4f6aa9cfee91e2e20afa771667e1d4b';
/** NVIDIA H100 product specifications (vendor specification). */
const H100_SPEC = 'https://www.nvidia.com/en-us/data-center/h100/';
/** NVIDIA NVLink page: 900 GB/s per Hopper GPU (vendor specification). */
const NVLINK_PAGE = 'https://www.nvidia.com/en-us/data-center/nvlink/';
/** EC2 accelerated computing instance specifications (p5.48xlarge rows). */
const EC2_AC = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';

/* ------------------------------------------------------------------------ */
/* Sections, stages and routes                                              */
/* ------------------------------------------------------------------------ */

/** Navigation titles from App.tsx, without the number. */
const TITLES: Record<number, string> = {
  1: 'A Training Run Is Three Budgets',
  2: 'Getting Started',
  3: 'One Training Step: What It Computes and Keeps',
  4: 'Counting the Arithmetic: 6ND, MFU & Run Time',
  5: 'The Memory Budget',
  6: 'Precision for Training: BF16, FP8 & Microscaled Formats',
  7: 'Collectives & What They Cost',
  8: 'Data Parallelism & Sharding: DDP, ZeRO, FSDP & HSDP',
  9: 'Tensor & Sequence Parallelism',
  10: 'Pipeline Parallelism & the Bubble',
  11: 'Long Sequences: Context Parallelism',
  12: 'Mixture of Experts: Expert Parallelism',
  13: 'Composing the Dimensions',
  14: 'Set My Ranks: The Sizing Procedure',
  15: 'The Framework Map',
  16: 'Fine-Tuning & Post-Training Runs',
  17: 'Failure Is the Steady State',
  18: 'Checkpointing',
  19: 'Resuming Correctly',
  20: 'Who Owns What on AWS',
  21: 'Training Hardware on AWS',
  22: 'Capacity & Cost',
  23: 'Storage for Training',
  24: 'The Slurm Family',
  25: 'The Kubernetes Family',
  26: 'SageMaker Training Jobs',
  27: 'Trainium: The Neuron Path',
  28: 'Choosing Your Path',
  29: 'What to Measure in a Run',
  30: 'The Telemetry Stack on AWS',
  31: 'Bring-Up: From One Node to the Full Run',
  32: 'Glossary & Sources',
};

/** "section 14, Set My Ranks: The Sizing Procedure" */
function sec(n: number): string {
  return `section ${n}, ${TITLES[n]}`;
}

/** The same reference at the start of a sentence or list item. */
function Sec(n: number): string {
  return `Section ${n}, ${TITLES[n]}`;
}

/** Short node labels for the map, at most two lines, no acronyms. A line ending in a hyphen joins the next without a space. */
const SHORT: Record<number, string[]> = {
  1: ['1. Three', 'budgets'],
  2: ['2. Getting', 'started'],
  3: ['3. One', 'training step'],
  4: ['4. Arithmetic', 'and run time'],
  5: ['5. The memory', 'budget'],
  6: ['6. Precision', 'for training'],
  7: ['7. Collectives', 'and their cost'],
  8: ['8. Data parallel', 'and sharding'],
  9: ['9. Tensor and', 'sequence parallel'],
  10: ['10. Pipeline', 'and the bubble'],
  11: ['11. Context', 'parallelism'],
  12: ['12. Expert', 'parallelism'],
  13: ['13. Composing', 'the dimensions'],
  14: ['14. Set my', 'ranks'],
  15: ['15. Framework', 'map'],
  16: ['16. Fine-tuning', 'and post-training'],
  17: ['17. Failure is', 'the steady state'],
  18: ['18. Check-', 'pointing'],
  19: ['19. Resuming', 'correctly'],
  20: ['20. Who owns', 'what on AWS'],
  21: ['21. Training', 'hardware'],
  22: ['22. Capacity', 'and cost'],
  23: ['23. Storage'],
  24: ['24. Slurm', 'family'],
  25: ['25. Kubernetes', 'family'],
  26: ['26. SageMaker', 'training jobs'],
  27: ['27. Trainium'],
  28: ['28. Choosing', 'your path'],
  29: ['29. What to', 'measure'],
  30: ['30. Telemetry', 'stack on AWS'],
  31: ['31. Bring-up'],
  32: ['32. Glossary', 'and sources'],
};

type BandId = 'framing' | 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 'ref';

interface Band {
  id: BandId;
  label: string;
  sections: number[];
}

const BANDS: Record<BandId, Band> = {
  framing: { id: 'framing', label: 'Framing', sections: [1, 2] },
  s1: { id: 's1', label: 'Stage 1. One accelerator', sections: [3, 4, 5, 6] },
  s2: { id: 's2', label: 'Stage 2. Many accelerators', sections: [7, 8, 9, 10, 11, 12, 13, 14] },
  s3: { id: 's3', label: 'Stage 3. The software', sections: [15, 16] },
  s4: { id: 's4', label: 'Stage 4. Keeping it alive', sections: [17, 18, 19] },
  s5: { id: 's5', label: 'Stage 5. Running it on AWS', sections: [20, 21, 22, 23, 24, 25, 26, 27, 28] },
  s6: { id: 's6', label: 'Stage 6. Operating a run', sections: [29, 30, 31] },
  ref: { id: 'ref', label: 'Reference', sections: [32] },
};

type RouteId = 'ranks' | 'budget' | 'tune' | 'theory';

/** A stop on a route: one section, or a choice of one among several. */
type Stop = number | { oneOf: number[] };

interface Route {
  id: RouteId;
  letter: string;
  color: string;
  question: string;
  endsOn: string;
  stops: Stop[];
  /** Sections read only when a condition holds, with the condition. */
  extras: { n: number; when: string }[];
}

/** The four shorter routes, exactly as SCOPE.md section 2 gives them. */
const ROUTES: Route[] = [
  {
    id: 'ranks',
    letter: 'R',
    color: '#0972d3',
    question: 'Help me set my ranks',
    endsOn: 'Ends on two or three layouts worth measuring for your model and cluster.',
    stops: [2, 3, 4, 5, 7, 8, 9, 10, 13, 21, 14],
    extras: [
      {
        n: 11,
        when: 'when activations outgrow tensor parallelism and recomputation (re-running part of the forward pass during the backward pass instead of storing its activations)',
      },
      { n: 12, when: 'for a mixture-of-experts (MoE) model' },
      { n: 6, when: 'for FP8 training' },
    ],
  },
  {
    id: 'budget',
    letter: 'B',
    color: '#a04a00',
    question: 'Help me pick an AWS path and a budget',
    endsOn: 'Ends on one of seven AWS paths, with its fee and the work it leaves your team.',
    stops: [1, 2, 3, 4, 5, 17, 18, 20, 21, 22, 23, { oneOf: [24, 25, 26, 27] }, 28],
    extras: [],
  },
  {
    id: 'tune',
    letter: 'F',
    color: '#037f0c',
    question: 'I am fine-tuning, not pre-training',
    endsOn: 'Ends on a sized run, the training engine to reuse and the AWS path to run it on.',
    stops: [2, 3, 5, 7, 8, 14, 15, 16, 20, 22, 26, 28],
    extras: [],
  },
  {
    id: 'theory',
    letter: 'T',
    color: '#6f4cc4',
    question: 'I want the theory properly',
    endsOn: 'Ends on the checkpoint interval, the arithmetic of the third budget.',
    stops: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 17, 18],
    extras: [],
  },
];

type Mark = 'on' | 'sometimes' | 'none';

/** How route r reads section n: on the route, read when it applies or as one of a choice, or not at all. */
function markFor(route: Route, n: number): Mark {
  for (const s of route.stops) {
    if (typeof s === 'number' && s === n) return 'on';
    if (typeof s !== 'number' && s.oneOf.includes(n)) return 'sometimes';
  }
  if (route.extras.some((e) => e.n === n)) return 'sometimes';
  return 'none';
}

/* ------------------------------------------------------------------------ */
/* Diagram: the reading map                                                 */
/* ------------------------------------------------------------------------ */

const FONT = 'sans-serif';
const INK = '#16191f';
const MUTED = '#414d5c';
const ARROW = '#5f6b7a';
const BAND_FILL = '#f4f6f8';
const BAND_STROKE = '#d1d5db';
const NODE_STROKE = '#879596';

const MAP_TITLE =
  "The dive's reading map. Sections 1 and 2 frame the dive. Six stages then run in order, each handing the next what it needs: " +
  'one accelerator (sections 3 to 6) gives the two bills that many accelerators (7 to 14) split; the software (15 and 16) ' +
  'implements the splits; keeping it alive (17 to 19) gives the failure arithmetic that running it on AWS (20 to 28) answers; ' +
  'operating a run (29 to 31) brings up and watches the cluster. Section 32 is the reference. Lettered marks inside each ' +
  'section show which of the four shorter routes reads it.';

const MAP_DESC =
  'R, help me set my ranks: sections 2, 3, 4, 5, 7, 8, 9, 10, 13, 21 and 14, with 11, 12 and 6 when they apply. ' +
  'B, help me pick an AWS path and a budget: sections 1, 2, 3, 4, 5, 17, 18, 20, 21, 22 and 23, then one of 24, 25, 26 ' +
  'or 27, then 28. F, I am fine-tuning, not pre-training: sections 2, 3, 5, 7, 8, 14, 15, 16, 20, 22, 26 and 28. ' +
  'T, I want the theory properly: section 2, then 3 to 14 in order, then 17 and 18. A dashed mark means read when it ' +
  'applies, or pick one of the family sections.';

function Pip({ route, cx, cy, mark, r = 7 }: { route: Route; cx: number; cy: number; mark: Mark; r?: number }) {
  if (mark === 'none') return null;
  const dashed = mark === 'sometimes';
  const size = r >= 8 ? 11 : 10;
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={dashed ? '#ffffff' : route.color}
        stroke={route.color}
        strokeWidth={dashed ? 1.6 : 1}
        strokeDasharray={dashed ? '3 2' : undefined}
      />
      <text
        x={cx}
        y={cy + size * 0.36}
        textAnchor="middle"
        fontFamily={FONT}
        fontSize={size}
        fontWeight={700}
        fill={dashed ? route.color : '#ffffff'}
      >
        {route.letter}
      </text>
    </g>
  );
}

/* Wide layout ------------------------------------------------------------- */

const WIDE_W = 900;
const MARGIN = 14;
const BAND_PAD = 8;
const BAND_HEAD = 24;
const NODE_GAP = 8;
const NODE_H = 60;
const BAND_H = BAND_HEAD + NODE_H + BAND_PAD;
const ROW_GAP = 30;
const BAND_GAP = 36;

interface PlacedBand {
  band: Band;
  x: number;
  y: number;
  w: number;
  nodeW: number;
}

function bandWidth(n: number, nodeW: number): number {
  return n * nodeW + (n - 1) * NODE_GAP + 2 * BAND_PAD;
}

function placeRow(ids: BandId[], y: number, nodeW: number): PlacedBand[] {
  let x = MARGIN;
  return ids.map((id) => {
    const band = BANDS[id];
    const w = bandWidth(band.sections.length, nodeW);
    const placed = { band, x, y, w, nodeW };
    x += w + BAND_GAP;
    return placed;
  });
}

const ROW_Y = [8, 8 + (BAND_H + ROW_GAP), 8 + 2 * (BAND_H + ROW_GAP), 8 + 3 * (BAND_H + ROW_GAP), 8 + 4 * (BAND_H + ROW_GAP)];
const LEGEND_H = 132;
const WIDE_H = ROW_Y[4] + LEGEND_H + 8;

function WideNode({ n, x, y, w }: { n: number; x: number; y: number; w: number }) {
  const here = n === 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={NODE_H}
        rx={5}
        fill="#ffffff"
        stroke={here ? MUTED : NODE_STROKE}
        strokeWidth={here ? 2.5 : 1.2}
      />
      {SHORT[n].map((line, i) => (
        <text
          key={line}
          x={x + 7}
          y={y + 16 + i * 14}
          fontFamily={FONT}
          fontSize={11}
          fontWeight={i === 0 ? 600 : 400}
          fill={INK}
        >
          {line}
        </text>
      ))}
      {ROUTES.map((route, i) => (
        <Pip key={route.id} route={route} cx={x + 13 + i * 19} cy={y + 46} mark={markFor(route, n)} />
      ))}
    </g>
  );
}

function WideBand({ p }: { p: PlacedBand }) {
  return (
    <g>
      <rect x={p.x} y={p.y} width={p.w} height={BAND_H} rx={7} fill={BAND_FILL} stroke={BAND_STROKE} strokeWidth={1.2} />
      <text x={p.x + BAND_PAD} y={p.y + 17} fontFamily={FONT} fontSize={12} fontWeight={700} fill={INK}>
        {p.band.label}
      </text>
      {p.band.sections.map((n, i) => (
        <WideNode key={n} n={n} x={p.x + BAND_PAD + i * (p.nodeW + NODE_GAP)} y={p.y + BAND_HEAD} w={p.nodeW} />
      ))}
    </g>
  );
}

function ReadingMapWide() {
  const row0 = placeRow(['framing', 's1'], ROW_Y[0], 100);
  const row1 = placeRow(['s2'], ROW_Y[1], 100);
  const row2 = placeRow(['s3', 's4'], ROW_Y[2], 100);
  const row3 = placeRow(['s5'], ROW_Y[3], 88);
  const row4 = placeRow(['s6', 'ref'], ROW_Y[4], 100);
  const all = [...row0, ...row1, ...row2, ...row3, ...row4];
  const by = (id: BandId) => all.find((p) => p.band.id === id) as PlacedBand;
  const mid = (p: PlacedBand) => p.x + p.w / 2;
  const nodeMidY = (p: PlacedBand) => p.y + BAND_HEAD + NODE_H / 2;
  const arrow = { stroke: ARROW, strokeWidth: 1.8, fill: 'none', markerEnd: 'url(#getting-started-map-ah)' };

  const framing = by('framing');
  const s1 = by('s1');
  const s3 = by('s3');
  const s4 = by('s4');
  const s6 = by('s6');
  const ref = by('ref');

  /** Vertical stage arrow from the bottom of one row to the top of the next, with its label to the right. */
  const down = (x: number, rowFrom: number, label: string) => {
    const y1 = ROW_Y[rowFrom] + BAND_H;
    const y2 = ROW_Y[rowFrom + 1];
    return (
      <g key={label}>
        <path d={`M ${x} ${y1} V ${y2 - 2}`} style={arrow} />
        <text x={x + 10} y={(y1 + y2) / 2 + 4} fontFamily={FONT} fontSize={11} fill={MUTED}>
          {label}
        </text>
      </g>
    );
  };

  const legendX = ref.x + ref.w + 24;
  const legendW = WIDE_W - MARGIN - legendX;
  const legendY = ROW_Y[4];

  return (
    <svg
      viewBox={`0 0 ${WIDE_W} ${WIDE_H}`}
      role="img"
      aria-labelledby="getting-started-map-title"
      aria-describedby="getting-started-map-desc"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <title id="getting-started-map-title">{MAP_TITLE}</title>
      <desc id="getting-started-map-desc">{MAP_DESC}</desc>
      <defs>
        <marker
          id="getting-started-map-ah"
          viewBox="0 0 10 10"
          refX={9}
          refY={5}
          markerWidth={7}
          markerHeight={7}
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={ARROW} />
        </marker>
      </defs>
      <rect x={0} y={0} width={WIDE_W} height={WIDE_H} rx={8} fill="#ffffff" />

      {all.map((p) => (
        <WideBand key={p.band.id} p={p} />
      ))}

      {/* The path from stage to stage */}
      <path d={`M ${framing.x + framing.w} ${nodeMidY(framing)} H ${s1.x - 2}`} style={arrow} />
      {down(mid(s1), 0, 'the two bills to split')}
      {down(mid(s3), 1, 'the splits each engine implements')}
      <path d={`M ${s3.x + s3.w} ${nodeMidY(s3)} H ${s4.x - 2}`} style={arrow} />
      {down(mid(s4), 2, 'the failure arithmetic each path answers')}
      {down(mid(s6), 3, 'a cluster to bring up and watch')}

      {/* Legend */}
      <rect x={legendX} y={legendY} width={legendW} height={LEGEND_H} rx={7} fill="#ffffff" stroke={BAND_STROKE} strokeWidth={1.2} />
      <text x={legendX + 10} y={legendY + 17} fontFamily={FONT} fontSize={12} fontWeight={700} fill={INK}>
        Shorter routes
      </text>
      {ROUTES.map((route, i) => (
        <g key={route.id}>
          <Pip route={route} cx={legendX + 18} cy={legendY + 33 + i * 17} mark="on" />
          <text x={legendX + 32} y={legendY + 37 + i * 17} fontFamily={FONT} fontSize={11} fill={INK}>
            {route.question}
          </text>
        </g>
      ))}
      <Pip route={ROUTES[0]} cx={legendX + 18} cy={legendY + 33 + 4 * 17} mark="sometimes" />
      <text x={legendX + 32} y={legendY + 37 + 4 * 17} fontFamily={FONT} fontSize={11} fill={INK}>
        Dashed: when it applies, or one family of four
      </text>
      <rect x={legendX + 11} y={legendY + 113} width={14} height={10} rx={2} fill="#ffffff" stroke={MUTED} strokeWidth={2.5} />
      <text x={legendX + 32} y={legendY + 122} fontFamily={FONT} fontSize={11} fill={INK}>
        Thick border: this section
      </text>
    </svg>
  );
}

/* Narrow layout ----------------------------------------------------------- */

const NARROW_W = 350;
const N_ROW = 26;
const N_HEAD = 26;
const N_BAND_GAP = 8;
const N_TOP = 34;
const N_PIP_X = [254, 278, 302, 326];
const N_ORDER: BandId[] = ['framing', 's1', 's2', 's3', 's4', 's5', 's6', 'ref'];
const N_LINE = 20;
const N_LEGEND_H = 30 + 6 * N_LINE;

/** One line for the narrow map: the short label's lines, re-joined across a hyphenated break. */
function oneLine(n: number): string {
  return SHORT[n].reduce((acc, line) => (acc.endsWith('-') ? acc.slice(0, -1) + line : `${acc} ${line}`));
}

function ReadingMapNarrow() {
  let y = N_TOP;
  const blocks = N_ORDER.map((id) => {
    const band = BANDS[id];
    const top = y;
    const h = N_HEAD + band.sections.length * N_ROW + 6;
    y += h + N_BAND_GAP;
    return { band, top, h };
  });
  const legendY = y;
  const H = legendY + N_LEGEND_H + 8;
  const legendRow = (i: number) => legendY + 36 + i * N_LINE;

  return (
    <svg
      viewBox={`0 0 ${NARROW_W} ${H}`}
      role="img"
      aria-labelledby="getting-started-map-narrow-title"
      aria-describedby="getting-started-map-narrow-desc"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <title id="getting-started-map-narrow-title">{MAP_TITLE}</title>
      <desc id="getting-started-map-narrow-desc">{MAP_DESC}</desc>
      <rect x={0} y={0} width={NARROW_W} height={H} rx={8} fill="#ffffff" />

      <text x={10} y={22} fontFamily={FONT} fontSize={12} fontWeight={600} fill={MUTED}>
        Stages in reading order
      </text>
      {ROUTES.map((route, i) => (
        <text
          key={route.id}
          x={N_PIP_X[i]}
          y={22}
          textAnchor="middle"
          fontFamily={FONT}
          fontSize={13}
          fontWeight={700}
          fill={route.color}
        >
          {route.letter}
        </text>
      ))}

      {blocks.map(({ band, top, h }) => (
        <g key={band.id}>
          <rect x={4} y={top} width={NARROW_W - 8} height={h} rx={6} fill={BAND_FILL} stroke={BAND_STROKE} strokeWidth={1} />
          <text x={12} y={top + 18} fontFamily={FONT} fontSize={13} fontWeight={700} fill={INK}>
            {band.label}
          </text>
          {band.sections.map((n, i) => {
            const rowY = top + N_HEAD + i * N_ROW;
            const here = n === 2;
            return (
              <g key={n}>
                <rect
                  x={10}
                  y={rowY}
                  width={NARROW_W - 20}
                  height={N_ROW - 3}
                  rx={4}
                  fill="#ffffff"
                  stroke={here ? MUTED : '#e9ebed'}
                  strokeWidth={here ? 2 : 1}
                />
                <text
                  x={16}
                  y={rowY + 16}
                  fontFamily={FONT}
                  fontSize={12.5}
                  fontWeight={here ? 700 : 400}
                  fill={INK}
                >
                  {oneLine(n)}
                </text>
                {ROUTES.map((route, k) => (
                  <Pip key={route.id} route={route} cx={N_PIP_X[k]} cy={rowY + 11.5} mark={markFor(route, n)} r={8.5} />
                ))}
              </g>
            );
          })}
        </g>
      ))}

      <rect x={4} y={legendY} width={NARROW_W - 8} height={N_LEGEND_H} rx={6} fill="#ffffff" stroke={BAND_STROKE} strokeWidth={1.2} />
      <text x={12} y={legendY + 19} fontFamily={FONT} fontSize={13} fontWeight={700} fill={INK}>
        Shorter routes
      </text>
      {ROUTES.map((route, i) => (
        <g key={route.id}>
          <Pip route={route} cx={22} cy={legendRow(i) - 4.5} mark="on" r={8.5} />
          <text x={38} y={legendRow(i)} fontFamily={FONT} fontSize={12} fill={INK}>
            {route.question}
          </text>
        </g>
      ))}
      <Pip route={ROUTES[0]} cx={22} cy={legendRow(4) - 4.5} mark="sometimes" r={8.5} />
      <text x={38} y={legendRow(4)} fontFamily={FONT} fontSize={12} fill={INK}>
        Dashed: when it applies, or one family of four
      </text>
      <rect x={14} y={legendRow(5) - 11} width={16} height={12} rx={2} fill="#ffffff" stroke={MUTED} strokeWidth={2} />
      <text x={38} y={legendRow(5)} fontFamily={FONT} fontSize={12} fill={INK}>
        Thick border: this section
      </text>
    </svg>
  );
}

function ReadingMap() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, 680);
  return (
    <SpaceBetween size="xs">
      <div ref={ref}>{narrow ? <ReadingMapNarrow /> : <ReadingMapWide />}</div>
      <Box variant="small" color="text-body-secondary">
        Compiled from the dive&apos;s own sections, not measured. Stages run in reading order, and within a stage
        sections read in number order except where a route lists them otherwise. Sections 19 and 29 to 31 are on
        no shorter route: read them once a run is planned and about to start.
      </Box>
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Cards                                                                    */
/* ------------------------------------------------------------------------ */

function IdeaCard({ title, children, where }: { title: string; children: ReactNode; where: ReactNode }) {
  return (
    <div>
      <Box variant="h3">{title}</Box>
      <Box variant="p">{children}</Box>
      <Box variant="small" color="text-body-secondary">
        {where}
      </Box>
    </div>
  );
}

function stopText(s: Stop): string {
  if (typeof s === 'number') {
    const t = Sec(s);
    return s === 2 ? `${t} (this section)` : t;
  }
  const parts = s.oneOf.map((n) => `${n}, ${TITLES[n]}`);
  return `The family section you lean toward: ${parts.slice(0, -1).join('; ')}; or ${parts[parts.length - 1]}`;
}

function RouteCard({ route }: { route: Route }) {
  return (
    <div>
      <Box variant="h3">
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            minWidth: 22,
            marginRight: 8,
            borderRadius: 11,
            background: route.color,
            color: '#ffffff',
            textAlign: 'center',
            fontSize: 13,
          }}
        >
          {route.letter}
        </span>
        &quot;{route.question}&quot;
      </Box>
      <Box variant="p">{route.endsOn}</Box>
      <ol style={{ marginTop: 0, paddingLeft: 22 }}>
        {route.stops.map((s) => (
          <li key={typeof s === 'number' ? s : s.oneOf.join('-')}>{stopText(s)}</li>
        ))}
      </ol>
      {route.extras.length > 0 && (
        <Box variant="p">
          Add{' '}
          {route.extras.map((e, i) => (
            <span key={e.n}>
              {i > 0 && (i === route.extras.length - 1 ? '; and ' : '; ')}
              {sec(e.n)}, {e.when}
            </span>
          ))}
          .
        </Box>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function GettingStarted() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Hold four ideas before the first technical section, see why the dive runs in the order it does, and take the shortest of four routes for the question you came with (sources read 2026-10-31)"
          >
            2. Getting Started
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The dive runs to 32 sections, from the arithmetic of one training step to bringing a run up on AWS.
            Every later section builds on a few ideas from earlier ones, so a reader with one question can skip most
            of the dive and still follow it.
          </Box>
          <Box variant="p">
            The challenge is choosing that subset without skipping a section that a later one leans on. This section
            sets out what the dive assumes you know, the four ideas every later section uses, the order of its six
            stages and the reason for it, how the sections hand numbers to each other, and four shorter routes, each
            built to keep every section its last stop depends on.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Check that the dive starts where your experience ends, and know where to look up a term met out of order"
          >
            Who the dive is written for
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The dive is written for a technical lead who knows systems, networking, GPUs, inference engines and agents
            in practice, has run inference at scale, knows NCCL (NVIDIA Collective Communications Library) and EFA
            (Elastic Fabric Adapter) by name, and has not run large-scale distributed training. It takes these from
            that background as given:
          </Box>
          <ul>
            <li>
              Accelerator memory, HBM (high-bandwidth memory), as a capacity and a bandwidth, as in the{' '}
              <Link href="../silicon-memory-inference/">
                Silicon, Memory and Modern Inference dive, section 6: HBM and the Bandwidth Wall
              </Link>{' '}
              and{' '}
              <Link href="../silicon-memory-inference/">section 3: Roofline and Arithmetic Intensity</Link>.
            </li>
            <li>
              NVLink, NeuronLink and EFA as links with a bandwidth each, as in the{' '}
              <Link href="../efa/">EFA dive, section 8: Instance Support Matrix</Link> and the{' '}
              <Link href="../silicon-memory-inference/">
                Silicon, Memory and Modern Inference dive, section 29: Communication and Scale-Out
              </Link>
              .
            </li>
            <li>
              A transformer layer as attention plus an MLP (multilayer perceptron), with attention heads and KV (key and
              value) heads.
            </li>
            <li>
              Inference arithmetic: a forward pass costs about 2 FLOPs (floating-point operations) per parameter per
              token of a prompt{' '}
              <Cite tier={3} href={PALM} venue="preprint">
                PaLM, Appendix B
              </Cite>
              .
            </li>
            <li>
              Tensor parallelism (TP) as serving engines use it, as in the{' '}
              <Link href="../vllm/">vLLM dive, section 9: Distributed Inference</Link> and the{' '}
              <Link href="../sglang/">SGLang dive, section 14: Parallelism: TP, DP Attention &amp; EP</Link> (data-parallel
              attention and expert parallelism).
            </li>
            <li>The Adam optimizer by name; sections 3 and 5 say what it stores.</li>
          </ul>
          <Box variant="p">
            No calculus is needed beyond knowing that backpropagation produces one gradient per weight. Every training
            term is defined where it is first used. For a term a shorter route brings you to out of order, {sec(32)},
            lists every term and acronym with the section that defines it, and repeats the notation that section 3
            introduces.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Hold four ideas and any section on any route reads: each is stated here in a few lines, and the section named under it defines it with its evidence"
          >
            Four ideas to hold
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">Every later section leans on these four. Each card states one and names where it is built.</Box>
          <ColumnLayout columns={2} variant="text-grid">
            <IdeaCard title="The step and its two kinds of state" where={<>Defined in {sec(3)}.</>}>
              A training step runs a forward pass, a backward pass and an optimizer update. Model state, the weights,
              the gradients and the optimizer&apos;s state, persists from step to step. Activations, the tensors the
              forward pass saves for the backward pass, live only from a forward pass to its backward pass. Every
              memory lever in the dive acts on one of the two.
            </IdeaCard>
            <IdeaCard
              title="The two bills"
              where={
                <>
                  Section 4 turns the FLOPs into accelerator-hours at an assumed MFU (model FLOPs utilization, the share
                  of the accelerators&apos; peak arithmetic a run achieves); section 5, {TITLES[5]}, adds the
                  activations and checks the fit.
                </>
              }
            >
              A step costs about 6 FLOPs per parameter per token: 2 in the forward pass and 4 in the backward pass{' '}
              <Cite tier={3} href={PALM} venue="preprint">
                PaLM, Appendix B
              </Cite>
              . Model state costs 16 bytes per parameter with mixed-precision Adam (16-bit weights and gradients, a
              32-bit master copy and two moments){' '}
              <Cite tier={3} href={ZERO} venue="SC 2020">
                ZeRO, Section 3.1
              </Cite>
              , before a single activation. Llama 3.1 8B, at 8.03 billion parameters{' '}
              <Cite tier={1} href={HF_LLAMA_8B}>
                Meta&apos;s Llama 3.1 8B model metadata
              </Cite>
              , holds 128.5 GB of model state, 1.6 times one 80 GB H100{' '}
              <Cite tier={1} href={H100_SPEC} kind="vendor-claim">
                NVIDIA H100 specification
              </Cite>
              .
            </IdeaCard>
            <IdeaCard
              title="Ranks, degrees and collectives"
              where={
                <>
                  Defined in {sec(7)}. NCCL configuration on EFA is in the{' '}
                  <Link href="../efa/">EFA dive, section 9: NCCL over EFA: the aws-ofi-nccl Plugin</Link>.
                </>
              }
            >
              A rank is one training process, usually one per accelerator, and the world size is the number of ranks in
              the job. Each parallelism has a degree, the number of ranks it splits its work across, and the degrees of
              a layout multiply to the world size: TP 8 x PP (pipeline parallelism) 4 x DP (data parallelism) 8 is 256
              ranks, or 32 p5.48xlarge instances of eight H100 GPUs each{' '}
              <Cite tier={1} href={EC2_AC}>
                AWS accelerated computing instance specifications
              </Cite>
              . Ranks exchange data through collectives (all-reduce, reduce-scatter, all-gather, all-to-all, and send
              and receive), each priced as bytes over the bandwidth of the link it crosses. An all-reduce is a
              reduce-scatter followed by an all-gather{' '}
              <Cite tier={3} href={ZERO} venue="SC 2020">
                ZeRO, Section 7.1
              </Cite>
              .
            </IdeaCard>
            <IdeaCard
              title="The bandwidth hierarchy"
              where={
                <>
                  Built in section 7; {sec(21)}, gives the figures for the other training instances.
                </>
              }
            >
              Data moves at three speeds: HBM inside the accelerator, NVLink or NeuronLink
              between the accelerators of one instance, and EFA between instances. On a p5.48xlarge each H100 has 900
              GB/s of NVLink, 450 GB/s in each direction on our reading of NVIDIA&apos;s table{' '}
              <Cite tier={1} href={NVLINK_PAGE} kind="vendor-claim">
                NVIDIA NVLink specifications
              </Cite>
              , against a 50 GB/s share of the instance&apos;s 3,200 Gb/s, or 400 GB/s, of EFA{' '}
              <Cite tier={1} href={EC2_AC}>
                AWS accelerated computing instance specifications
              </Cite>
              . <strong>Per GPU, NVLink is nine times EFA</strong>, our arithmetic from those two pages. Collectives that
              combine data inside the instance first can spread their crossing over the instance&apos;s whole 400
              GB/s, which section 7 prices.
            </IdeaCard>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See what each of the six stages adds and why it comes where it does, so a section you skip still lands inside a frame you hold"
          >
            The path, and why in this order
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Read in full, the dive runs in six stages after the two opening sections, and each stage carries one way of
            thinking about the run.
          </Box>
          <ol>
            <li>
              <Box variant="p">
                <strong>One accelerator, sections 3 to 6.</strong> The two bills before anything is split, and what
                changes when the arithmetic runs in BF16 (bfloat16) or FP8 (8-bit floating point). A step is a fixed
                bill in FLOPs and a fixed bill in bytes.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <strong>Many accelerators, sections 7 to 14.</strong> Each parallelism as a way to split a bill, paid
                for with a collective: data parallelism and its sharded forms, DDP (Distributed Data Parallel), ZeRO
                (Zero Redundancy Optimizer), FSDP (Fully Sharded Data Parallel) and HSDP (hybrid sharded data parallel),
                then tensor, pipeline, context and expert parallelism, their composition, and the sizing procedure.
                Every split trades memory for a collective, and how often the collective fires decides which link it
                can ride. Tensor parallelism fires inside every layer of every micro-batch, the slice of a step&apos;s
                batch that one forward and backward pass processes, so it stays on NVLink; data and pipeline
                parallelism fire once per step or once per micro-batch and can cross EFA, nine times slower per GPU on
                a p5.48xlarge.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <strong>The software, sections 15 and 16.</strong> The engines that implement the splits, and the
                fine-tuning and post-training frameworks built on them. Three engines, PyTorch distributed, DeepSpeed
                and Megatron Core, implement the parallelism, and every other framework the dive maps configures one of
                them.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <strong>Keeping it alive, sections 17 to 19.</strong> Failure arithmetic first, then checkpoints and
                resumption. A synchronous job stops when any node stops, so its time between failures divides by its
                node count: Llama 3 405B, trained on up to 16K GPUs, saw one unexpected interruption every 3.1 hours
                over a 54-day window of pre-training{' '}
                <Cite tier={3} href={LLAMA3} venue="preprint">
                  Llama 3 Herd of Models, Sections 3.3.1 and 3.3.4
                </Cite>
                .
              </Box>
            </li>
            <li>
              <Box variant="p">
                <strong>Running it on AWS, sections 20 to 28.</strong> The ownership map first, then the hardware,
                capacity and cost, storage, the Slurm, Kubernetes and job-scoped families, Trainium, and the choice. The
                step is the same on every path; what differs is who owns the cluster around it: who keeps it standing,
                who replaces a broken node and who restarts the job.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <strong>Operating a run, sections 29 to 31.</strong> What to measure, the telemetry stack, and bring-up.
                Three layers of signal, model health, job efficiency and hardware health, checked rung by rung from one
                node up.
              </Box>
            </li>
          </ol>
          <Box variant="p">
            The order follows the dependencies. The sizing procedure needs both bills and the collective cost model.
            The software comes after the splits because each engine is a choice of which splits to implement, and
            before reliability because checkpoint formats and restart behaviour belong to the engine. The AWS choice
            comes after the reliability arithmetic because restart ownership is what differs most between paths, our
            reading of sections 20 to 28. Bring-up closes the dive because it checks every earlier estimate against a
            measured step.
          </Box>
          <ReadingMap />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know which section's output becomes which later section's input, so a number you carry forward arrives where the next section expects it"
          >
            How the sections feed each other
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">Four calculators carry numbers forward, and the AWS and operating stages build on what came before:</Box>
          <ul>
            <li>
              Calculator A, run time and accelerator-hours (section 4), feeds the cost panel of {sec(22)}.
            </li>
            <li>
              Calculator B, the memory budget (section 5), is the memory check inside Calculator C, parallelism sizing
              (section 14). Calculator C prices bytes per link with section 7&apos;s cost model and the per-instance
              bandwidths of section 21, and takes its compute time per step from section 4&apos;s identity.
            </li>
            <li>
              The failure rates of section 17 feed Calculator D, checkpoint interval and storage (section 18), whose
              save target sizes the storage of {sec(23)}.
            </li>
            <li>
              {Sec(20)}, frames the family sections 24 to 26 and the choice in section 28.
            </li>
            <li>
              The metrics of {sec(29)}, are what {sec(31)}, compares against section 4&apos;s MFU estimate and section
              7&apos;s collective arithmetic, so the dive ends by replacing its estimates with your measured step.
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick the route that matches the question you came with, and read only the sections it needs, in the order it needs them"
          >
            Four shorter routes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each route ends on the section that answers its question and keeps every earlier section that one leans
            on. The lettered marks on the map show where each route runs; here are the stops in reading order.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            {ROUTES.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </ColumnLayout>
          <Box variant="p">
            Where a section on a shorter route uses a term from a section you skipped, it glosses the term in one
            clause with a pointer, as when section 21 introduces tensor parallelism as &quot;splitting every
            layer&apos;s matrices across the accelerators of one instance; section 9&quot;.
          </Box>
          <ExpandableSection headerText="What each route keeps, and why">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Set my ranks.</strong> Section 4 is on the route because every communication check on the way
                divides bytes by compute time from section 4&apos;s identity, as when section 9 sets one layer&apos;s
                tensor-parallel traffic against its compute. Section 21 comes before section 14 because Calculator C
                takes an instance, and section 21 supplies the three numbers it reads: memory per accelerator, peak
                arithmetic, and how many accelerators share the fast link. Context parallelism, splitting one sequence
                across GPUs, joins when activations still do not fit after tensor parallelism and recomputation.
              </Box>
              <Box variant="p">
                <strong>Pick an AWS path and a budget.</strong> Sections 3 and 5 are on it because the memory bill sets
                the floor on the accelerator count, as section 21 shows when it counts the p5.48xlarge instances that
                Llama 3.1 70B&apos;s model state alone needs. Sections 17 and 18 come before the AWS sections because
                restart ownership is where the paths differ most, and the checkpoint interval sizes the storage line of
                the bill in section 23. Read the one family section, 24 to 27, for the path you lean toward, then section
                28 for the choice.
              </Box>
              <Box variant="p">
                <strong>Fine-tuning.</strong> Section 7 is on the route because section 8&apos;s case for sharding
                (splitting model state across ranks instead of copying it to each) rests on the all-reduce identity and
                on keeping the gathers on NVLink instead of EFA. Section 14 sets the layout of a full fine-tune, whose
                model state section 16 shows spreading across many GPUs. Section 15 comes before section 16 because
                section 16 picks a framework by the training engine it reuses. Sections 20 and 22 come before 26 and 28 because
                the paths are framed by the ownership map, and capacity comes first.
              </Box>
              <Box variant="p">
                <strong>The theory.</strong> It starts here for the four ideas, reads the one-accelerator and
                many-accelerator stages in order, and ends with sections 17 and 18, the arithmetic of the third budget:
                how often a job fails, and how often to save it.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            Pick the route that matches your question. If you came straight here, the AWS path and budget route starts
            with{' '}
            {sec(1)}; every other route, and the full path, continues at {sec(3)}. Keep section 32 open for any term a
            route brings you to early.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
