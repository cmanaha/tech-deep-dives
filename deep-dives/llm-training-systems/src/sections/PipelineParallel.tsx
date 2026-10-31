import { useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import FormField from '@cloudscape-design/components/form-field';
import SegmentedControl from '@cloudscape-design/components/segmented-control';
import Slider from '@cloudscape-design/components/slider';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import {
  Cite,
  arxiv,
  gh,
  DEEPSPEED_TAG,
  MEGATRON_TAG,
  PYTORCH_TAG,
  TORCHTITAN_TAG,
} from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import { DENSE_MODELS, GB, INSTANCES, rankFacts, shapeOf } from '../lib/presets';
import { evaluateLayout, type Candidate, type Layout, type ParallelismInput } from '../lib/parallelism';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Huang et al., GPipe, Sec 2.3: bubble O((K-1)/(M+K-1)) over total time. */
const GPIPE = arxiv('1811.06965v5');
/** Narayanan et al., Megatron-LM on GPU clusters (PTD-P), SC 2021: Sec 2.2 schedules, 3.1 notation, 3.5 recomputation, 4.1 scatter-gather, Appendix FLOPs. */
const PTDP = arxiv('2104.04473v5');
/** Korthikanti et al., Reducing Activation Recomputation in Large Transformer Models, Sec 4.2.3. */
const KORTHIKANTI = arxiv('2205.05198v1');
/** Qi et al., Zero Bubble Pipeline Parallelism: abstract, Sec 2, Table 2. */
const ZERO_BUBBLE = arxiv('2401.10241v1');
/** DeepSeek-V3 Technical Report: Sec 3.2 (layout), 3.2.1 (DualPipe, Table 2), 3.2.3, 4.2 (61 layers). */
const DEEPSEEK_V3 = arxiv('2412.19437v2');
/** The Llama 3 Herd of Models: Table 3 (shapes), Table 4 (layouts), Sec 3.3.2 (pipeline improvements). */
const LLAMA3 = arxiv('2407.21783v3');
/** NVIDIA H100 product specifications (vendor specification; the BF16 figure is with sparsity). */
const H100_SPEC = 'https://www.nvidia.com/en-us/data-center/h100/';
/** AWS accelerated computing instance specifications (p5.48xlarge: 8 H100, 3,200 Gbps). */
const EC2_ACCEL = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';

/** Megatron Core core_v0.20.0: the even-split check runs only when no first or last stage count is set. */
const MEG_EVEN_SPLIT = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/training/arguments.py', 'L879-L891');
/** Megatron Core: --decoder-first/last-pipeline-num-layers and --pipeline-model-parallel-layout. */
const MEG_UNEVEN_FLAGS = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/training/arguments.py', 'L3041-L3056');
/** Megatron Core: account_for_embedding/loss_in_pipeline_split fields. */
const MEG_ACCOUNT_FOR = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/transformer/transformer_config.py', 'L151-L157');
/** Megatron Core: virtual pipeline flags (v). */
const MEG_VPP_FLAGS = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/training/arguments.py', 'L3060-L3063');
/** Megatron Core: number of micro-batches = global batch / (micro-batch x data-parallel size). */
const MEG_NUM_MICROBATCHES = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/num_microbatches_calculator.py', 'L381-L388');
/** Megatron Core: non-interleaved 1F1B warm-up of p - rank - 1 micro-batches, then the steady 1F1B loop. */
const MEG_WARMUP = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/pipeline_parallel/schedules.py', 'L2307-L2310');
const MEG_STEADY = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/pipeline_parallel/schedules.py', 'L2415-L2416');
/** Megatron Core: microbatch_group_size_per_vp_stage (Llama 3's N), default p. */
const MEG_VPP_GROUP = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/model_parallel_config.py', 'L466-L484');
const MEG_VPP_GROUP_DEFAULT = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/model_parallel_config.py', 'L603-L604');
/** Megatron Core: the interleaved schedule's check on m against N and p. */
const MEG_VPP_GROUP_CHECK = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/pipeline_parallel/schedules.py', 'L1161-L1181');
/** Megatron Core: forward of one micro-batch co-scheduled with the backward of another (MoE overlap). */
const MEG_COMBINED_1F1B = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/pipeline_parallel/combined_1f1b.py', 'L54-L61');
const MEG_MOE_OVERLAP = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/transformer/moe/README.md', 'L433-L438');
const MEG_MOE_DEFAULTS = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/transformer/moe/README.md', 'L561-L564');

/** TorchTitan v0.4.0: first and last stage one layer lighter by default. */
const TT_LESS_LAYERS = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/config/parallelism.py', 'L95-L105');
/** TorchTitan v0.4.0: the split counts embedding and head as layers and divides evenly. */
const TT_SPLIT = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/distributed/pipeline_parallel.py', 'L551-L612');
/** TorchTitan v0.4.0: pipeline_parallel_schedule defaults to 1F1B. */
const TT_SCHEDULE = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/config/parallelism.py', 'L114-L121');
/** TorchTitan v0.4.0: num_pp_microbatches defaults to 1. */
const TT_MICROBATCHES = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/config/parallelism.py', 'L130-L135');
/** TorchTitan v0.4.0: gradient accumulation steps from tokens per pipeline step. */
const TT_ACCUMULATION = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/trainer.py', 'L185-L205');
/** TorchTitan v0.4.0: each micro-batch group is one complete pipeline step. */
const TT_GROUPS = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/trainer.py', 'L334-L341');
/** TorchTitan v0.4.0: warning when micro-batches are fewer than stages. */
const TT_WARNING = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/distributed/pipeline_parallel.py', 'L436-L445');

/** DeepSpeed v0.19.9 PipelineModule: partition_method defaults to 'parameters'. */
const DS_PARTITION = gh('deepspeedai/DeepSpeed', DEEPSPEED_TAG, 'deepspeed/runtime/pipe/module.py', 'L396-L417');
const DS_PARTITION_DEFAULT = gh('deepspeedai/DeepSpeed', DEEPSPEED_TAG, 'deepspeed/runtime/pipe/module.py', 'L116-L133');

/** PyTorch v2.15.0 pipelining: the schedule names get_schedule_class accepts. */
const PT_SCHEDULES = gh('pytorch/pytorch', PYTORCH_TAG, 'torch/distributed/pipelining/schedules.py', 'L5227-L5237');

/* ------------------------------------------------------------------------ */
/* Calculator inputs (src/lib/parallelism.ts, Calculator C)                 */
/* ------------------------------------------------------------------------ */

const MODEL_70B = shapeOf(DENSE_MODELS['llama-3.1-70b']);
const P5 = INSTANCES['p5.48xlarge'];
/** 50 GB/s per GPU on a p5.48xlarge: 3,200 Gbps / 8 bits / 8 GPUs (Calculator C's rank facts). */
const EFA_PER_GPU = rankFacts(P5).efaBytesPerSecondPerRank;
const SEQUENCE = 8_192;

function pipelineLayout(pp: number, dp: number, v: number): Layout {
  return {
    tp: 8,
    cp: 1,
    pp,
    dp,
    interleavedChunks: v,
    sharding: 'zero1',
    microBatch: 1,
    recompute: 'none',
    gradientSync: 'oncePerStep',
  };
}

/** 02 section 3.2: Llama 3.1 70B on 32 p5.48xlarge, 512 sequences of 8,192 tokens, 6N compute, 34 sbh. */
const WORKED_INPUT: ParallelismInput = {
  model: MODEL_70B,
  instance: P5,
  instanceCount: 32,
  sequenceLength: SEQUENCE,
  globalBatch: { sequences: 512 },
  attention: 'none',
  activations: { sbhPerLayer: 34 },
};

const WORKED_1F1B = evaluateLayout(WORKED_INPUT, pipelineLayout(4, 8, 1));
const WORKED_V5 = evaluateLayout(WORKED_INPUT, pipelineLayout(4, 8, 5));
const BY_DEGREE = [1, 2, 4].map((pp) => ({ pp, c: evaluateLayout(WORKED_INPUT, pipelineLayout(pp, 32 / pp, 1)) }));

/** The chart's pipeline: the same model at TP 8 x PP 4 on four p5.48xlarge, one data-parallel copy, m sequences. */
function chartCandidate(m: number, v: number): Candidate {
  return evaluateLayout(
    {
      model: MODEL_70B,
      instance: P5,
      instanceCount: 4,
      sequenceLength: SEQUENCE,
      globalBatch: { sequences: m },
      attention: 'none',
    },
    pipelineLayout(4, 1, v),
  );
}

/** Pipeline point-to-point bytes per micro-batch per boundary per direction, from Calculator C's per-step count. */
function ppBytesPerMicroBatch(c: Candidate): number {
  const pp = c.links.find((l) => l.dimension === 'PP');
  if (!pp) throw new Error('PipelineParallel: Calculator C returned no PP link for a pipelined layout');
  return pp.bytesPerStep / (2 * c.microBatchesPerStep * c.layout.interleavedChunks);
}

function ppStepSeconds(c: Candidate): number {
  const pp = c.links.find((l) => l.dimension === 'PP');
  if (!pp) throw new Error('PipelineParallel: Calculator C returned no PP link for a pipelined layout');
  return pp.seconds;
}

function pct(fraction: number): string {
  const p = fraction * 100;
  return p >= 1 ? `${p.toFixed(1)}%` : `${p.toPrecision(2)}%`;
}

function gbText(bytes: number): string {
  return `${(bytes / GB).toFixed(1)} GB`;
}

const PP_MB_PER_MICROBATCH = ppBytesPerMicroBatch(WORKED_1F1B) / 1e6;
const PP_MS_PER_MICROBATCH = (ppBytesPerMicroBatch(WORKED_1F1B) / EFA_PER_GPU) * 1e3;

/* ------------------------------------------------------------------------ */
/* Schedule simulation (the chart is computed from the schedule rules)      */
/* ------------------------------------------------------------------------ */

type ScheduleKind = 'gpipe' | '1f1b' | 'interleaved';

interface Op {
  pass: 'F' | 'B';
  microBatch: number;
  chunk: number;
}

interface PlacedOp extends Op {
  start: number;
  end: number;
}

interface Simulation {
  rows: PlacedOp[][];
  makespan: number;
  /** Work per stage: m forward and m backward passes. */
  busy: number;
  /** Most model chunks whose activations stage 1 holds at once. */
  peakChunksStage1: number;
}

/** Pipeline stages in the chart; the worked example's p. */
const P = 4;
/** Chunks per stage for the interleaved schedule in the chart. */
const V_CHART = 2;
/** Time units: one forward pass of a stage, and one backward pass, twice the forward's FLOPs. */
const T_FORWARD = 1;
const T_BACKWARD = 2;
/** Slider stops for m: all multiples of p, as the interleaved schedule needs. */
const M_STOPS = [8, 12, 16, 24, 32, 48, 64];

/** Per-stage order of passes for each schedule (stage index d from 0). */
function stageOrder(kind: ScheduleKind, m: number, v: number, d: number): Op[] {
  const ops: Op[] = [];
  if (kind === 'gpipe') {
    for (let i = 0; i < m; i += 1) ops.push({ pass: 'F', microBatch: i, chunk: 0 });
    for (let i = 0; i < m; i += 1) ops.push({ pass: 'B', microBatch: i, chunk: 0 });
    return ops;
  }
  if (kind === '1f1b') {
    // Warm up p - d - 1 forwards, then alternate one forward and one backward, then drain.
    const w = Math.min(P - d - 1, m);
    for (let i = 0; i < w; i += 1) ops.push({ pass: 'F', microBatch: i, chunk: 0 });
    for (let i = 0; i < m - w; i += 1) {
      ops.push({ pass: 'F', microBatch: w + i, chunk: 0 });
      ops.push({ pass: 'B', microBatch: i, chunk: 0 });
    }
    for (let i = m - w; i < m; i += 1) ops.push({ pass: 'B', microBatch: i, chunk: 0 });
    return ops;
  }
  // Interleaved 1F1B: groups of p micro-batches run chunk by chunk; warm-up (p - d - 1) x 2 + (v - 1) x p.
  const table: { microBatch: number; chunk: number }[] = [];
  for (let g = 0; g < m; g += P) {
    for (let c = 0; c < v; c += 1) {
      for (let mb = g; mb < Math.min(g + P, m); mb += 1) table.push({ microBatch: mb, chunk: c });
    }
  }
  const total = m * v;
  const w = Math.min((P - d - 1) * 2 + (v - 1) * P, total);
  const fwd = (k: number): Op => ({ pass: 'F', microBatch: table[k].microBatch, chunk: table[k].chunk });
  const bwd = (k: number): Op => ({ pass: 'B', microBatch: table[k].microBatch, chunk: v - 1 - table[k].chunk });
  for (let k = 0; k < w; k += 1) ops.push(fwd(k));
  for (let i = 0; i < total - w; i += 1) {
    ops.push(fwd(w + i));
    ops.push(bwd(i));
  }
  for (let k = total - w; k < total; k += 1) ops.push(bwd(k));
  return ops;
}

/**
 * Places every pass at the earliest time its stage is free and its input exists: a forward needs the
 * previous virtual stage's forward of the same micro-batch, a backward needs the next virtual stage's
 * backward (or, on the last virtual stage, its own forward). Transfers are free.
 */
function simulate(kind: ScheduleKind, m: number): Simulation {
  const v = kind === 'interleaved' ? V_CHART : 1;
  const tf = T_FORWARD / v;
  const tb = T_BACKWARD / v;
  const orders = Array.from({ length: P }, (_, d) => stageOrder(kind, m, v, d));
  const done = new Map<string, number>();
  const key = (pass: 'F' | 'B', virtualStage: number, mb: number) => `${pass}${virtualStage}:${mb}`;
  const next = new Array<number>(P).fill(0);
  const free = new Array<number>(P).fill(0);
  const rows: PlacedOp[][] = Array.from({ length: P }, () => []);
  const lastVirtual = P * v - 1;
  let remaining = orders.reduce((sum, o) => sum + o.length, 0);
  while (remaining > 0) {
    let progressed = false;
    for (let d = 0; d < P; d += 1) {
      while (next[d] < orders[d].length) {
        const op = orders[d][next[d]];
        const vs = op.chunk * P + d;
        let dep: string | null;
        if (op.pass === 'F') dep = vs > 0 ? key('F', vs - 1, op.microBatch) : null;
        else dep = vs < lastVirtual ? key('B', vs + 1, op.microBatch) : key('F', vs, op.microBatch);
        const depEnd = dep === null ? 0 : done.get(dep);
        if (depEnd === undefined) break;
        const start = Math.max(free[d], depEnd);
        const end = start + (op.pass === 'F' ? tf : tb);
        done.set(key(op.pass, vs, op.microBatch), end);
        free[d] = end;
        rows[d].push({ ...op, start, end });
        next[d] += 1;
        remaining -= 1;
        progressed = true;
      }
    }
    if (!progressed) throw new Error(`PipelineParallel: the ${kind} order deadlocked at m = ${m}`);
  }
  // Activations of a chunk are held from the start of its forward to the end of its backward.
  const events: [number, number][] = [];
  for (const op of rows[0]) events.push(op.pass === 'F' ? [op.start, 1] : [op.end, -1]);
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let live = 0;
  let peak = 0;
  for (const [, delta] of events) {
    live += delta;
    peak = Math.max(peak, live);
  }
  return { rows, makespan: Math.max(...free), busy: m * (T_FORWARD + T_BACKWARD), peakChunksStage1: peak };
}

/* ------------------------------------------------------------------------ */
/* Diagram: the schedule chart                                              */
/* ------------------------------------------------------------------------ */

const FONT = 'sans-serif';
const INK = '#16191f';
const MUTED = '#414d5c';
const F_FILL = ['#0972d3', '#065299'];
const B_FILL = ['#2ea597', '#1f7a70'];
const F_TEXT = ['#ffffff', '#ffffff'];
const B_TEXT = ['#0f1b2a', '#ffffff'];
const IDLE_STROKE = '#ec7211';

/** The intervals in which a stage runs nothing, from time 0 to the end of the step. */
function idleSpans(ops: readonly PlacedOp[], makespan: number): [number, number][] {
  const spans: [number, number][] = [];
  let cursor = 0;
  for (const op of [...ops].sort((a, b) => a.start - b.start)) {
    if (op.start > cursor + 1e-9) spans.push([cursor, op.start]);
    cursor = Math.max(cursor, op.end);
  }
  if (makespan > cursor + 1e-9) spans.push([cursor, makespan]);
  return spans;
}

const count = (n: number) => n.toLocaleString('en-US');

const SCHEDULE_NAMES: Record<ScheduleKind, string> = {
  gpipe: 'GPipe',
  '1f1b': '1F1B',
  interleaved: 'Interleaved 1F1B, v = 2',
};

function ScheduleChart({ kind, m, sim }: { kind: ScheduleKind; m: number; sim: Simulation }) {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref);

  const W = narrow ? 360 : 900;
  const x0 = narrow ? 54 : 104;
  const x1 = W - (narrow ? 8 : 16);
  const rowTop = narrow ? 70 : 64;
  const rowH = narrow ? 28 : 34;
  const rowGap = narrow ? 8 : 10;
  const axisY = rowTop + P * rowH + (P - 1) * rowGap + 12;
  const H = axisY + (narrow ? 22 : 24);
  // All three schedules share the time axis of GPipe and 1F1B at this m, so interleaving visibly ends early.
  const span = (m + P - 1) * (T_FORWARD + T_BACKWARD);
  const unit = (x1 - x0) / span;
  const sx = (t: number) => x0 + t * unit;
  const rowY = (d: number) => rowTop + d * (rowH + rowGap);
  const interleaved = kind === 'interleaved';
  const layersPerStage = MODEL_70B.layers / P;
  const layersPerChunk = layersPerStage / V_CHART;
  const stageLayers = (d: number) =>
    interleaved
      ? `${d * layersPerChunk + 1}-${(d + 1) * layersPerChunk}, ${(d + P) * layersPerChunk + 1}-${(d + P + 1) * layersPerChunk}`
      : `layers ${d * layersPerStage + 1}-${(d + 1) * layersPerStage}`;

  const legend: { x: number; y: number; kind: 'F' | 'B' | 'idle' | 'chunk2'; label: string }[] = narrow
    ? [
        { x: 6, y: 34, kind: 'F', label: 'forward' },
        { x: 88, y: 34, kind: 'B', label: 'backward' },
        { x: 182, y: 34, kind: 'idle', label: 'idle: the bubble' },
        ...(interleaved ? [{ x: 6, y: 52, kind: 'chunk2' as const, label: 'darker: second chunk' }] : []),
      ]
    : [
        { x: 8, y: 42, kind: 'F', label: 'forward pass' },
        { x: 138, y: 42, kind: 'B', label: 'backward pass' },
        { x: 278, y: 42, kind: 'idle', label: 'idle: the bubble' },
        ...(interleaved ? [{ x: 438, y: 42, kind: 'chunk2' as const, label: "darker: each stage's second chunk" }] : []),
      ];

  const labelFits = (width: number, text: string) => width >= text.length * 6.4 + 3;
  const stage1Layers = sim.peakChunksStage1 * (interleaved ? layersPerChunk : layersPerStage);
  const bubble = (sim.makespan - sim.busy) / sim.busy;

  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="pipeline-sched-title"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <title id="pipeline-sched-title">
          {`The ${SCHEDULE_NAMES[kind]} schedule for four pipeline stages and ${m} micro-batches per step, computed from the schedule's ordering rules. Every stage idles while the pipeline fills and drains, a bubble of ${pct(bubble)} of the step's ideal compute time, and at its peak stage 1 holds activations worth ${count(stage1Layers)} layers, against the model's ${MODEL_70B.layers}.`}
        </title>
        <defs>
          <pattern id="pipeline-sched-hatch" width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width={6} height={6} fill="#fdf3ec" />
            <line x1={0} y1={0} x2={0} y2={6} stroke={IDLE_STROKE} strokeWidth={1.2} />
          </pattern>
          <marker id="pipeline-sched-ah" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={MUTED} />
          </marker>
        </defs>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />

        <text x={narrow ? 6 : 8} y={narrow ? 16 : 22} fontFamily={FONT} fontSize={narrow ? 12 : 13} fontWeight={600} fill={INK}>
          {narrow ? `${SCHEDULE_NAMES[kind]}, p = 4, m = ${m}` : `${SCHEDULE_NAMES[kind]}: four stages of Llama 3.1 70B, m = ${m} micro-batches`}
        </text>

        {legend.map((item) => (
          <g key={item.label}>
            {item.kind === 'F' && <rect x={item.x} y={item.y - 10} width={14} height={12} fill={F_FILL[0]} />}
            {item.kind === 'B' && <rect x={item.x} y={item.y - 10} width={14} height={12} fill={B_FILL[0]} />}
            {item.kind === 'idle' && (
              <rect x={item.x + 0.5} y={item.y - 9.5} width={13} height={11} fill="url(#pipeline-sched-hatch)" stroke={IDLE_STROKE} strokeWidth={1} />
            )}
            {item.kind === 'chunk2' && (
              <>
                <rect x={item.x} y={item.y - 10} width={7} height={12} fill={F_FILL[1]} />
                <rect x={item.x + 7} y={item.y - 10} width={7} height={12} fill={B_FILL[1]} />
              </>
            )}
            <text x={item.x + 20} y={item.y} fontFamily={FONT} fontSize={11} fill={INK}>
              {item.label}
            </text>
          </g>
        ))}

        {sim.rows.map((ops, d) => {
          const y = rowY(d);
          return (
            <g key={`row-${d}`}>
              <text
                x={narrow ? 6 : 8}
                y={narrow ? y + rowH / 2 + 4 : y + 14}
                fontFamily={FONT}
                fontSize={narrow ? 11 : 12}
                fontWeight={600}
                fill={INK}
              >
                {`Stage ${d + 1}`}
              </text>
              {!narrow && (
                <text x={8} y={y + 28} fontFamily={FONT} fontSize={10} fill={MUTED}>
                  {stageLayers(d)}
                </text>
              )}
              {idleSpans(ops, sim.makespan).map(([a, b]) => (
                <rect
                  key={`idle-${a}`}
                  x={sx(a)}
                  y={y}
                  width={(b - a) * unit}
                  height={rowH}
                  fill="url(#pipeline-sched-hatch)"
                  stroke={IDLE_STROKE}
                  strokeWidth={0.8}
                />
              ))}
              {ops.map((op) => {
                const xa = sx(op.start);
                const w = (op.end - op.start) * unit;
                const gap = Math.min(0.8, w * 0.15);
                const fill = op.pass === 'F' ? F_FILL[op.chunk] : B_FILL[op.chunk];
                const color = op.pass === 'F' ? F_TEXT[op.chunk] : B_TEXT[op.chunk];
                const label = String(op.microBatch + 1);
                return (
                  <g key={`${op.pass}-${op.chunk}-${op.microBatch}`}>
                    <rect x={xa} y={y} width={Math.max(w - gap, 0.2)} height={rowH} fill={fill} />
                    {labelFits(w, label) && (
                      <text
                        x={xa + w / 2}
                        y={y + rowH / 2 + 3.5}
                        fontFamily={FONT}
                        fontSize={10}
                        fill={color}
                        textAnchor="middle"
                      >
                        {label}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        <line x1={x0} y1={axisY} x2={x1} y2={axisY} stroke={MUTED} strokeWidth={1.2} markerEnd="url(#pipeline-sched-ah)" />
        <text x={x0} y={axisY + 15} fontFamily={FONT} fontSize={11} fill={MUTED}>
          {narrow ? 'time' : 'time: one forward pass is one unit, one backward pass two'}
        </text>
      </svg>
    </div>
  );
}

const SCHEDULE_OPTIONS = [
  { id: 'gpipe', text: 'GPipe' },
  { id: '1f1b', text: '1F1B' },
  { id: 'interleaved', text: 'Interleaved' },
];

function ScheduleExplorer() {
  const [kind, setKind] = useState<ScheduleKind>('1f1b');
  const [stop, setStop] = useState(0);
  const m = M_STOPS[stop];
  const sim = useMemo(() => simulate(kind, m), [kind, m]);
  const v = kind === 'interleaved' ? V_CHART : 1;
  // The bubble and stage-1 activations come from Calculator C; the chart's simulated schedule reproduces both.
  const calc = useMemo(() => chartCandidate(m, v), [m, v]);
  const layersPerStage = MODEL_70B.layers / P;
  const stage1Layers =
    kind === 'gpipe' ? sim.peakChunksStage1 * layersPerStage : calc.memory.activations.firstStageLayersHeld;
  const idleOverStep = (sim.makespan - sim.busy) / sim.makespan;

  const stage1Text =
    kind === 'gpipe'
      ? `${m} micro-batches of ${layersPerStage} layers: ${count(stage1Layers)} layers' worth, ${stage1Layers / MODEL_70B.layers} times the model's ${MODEL_70B.layers}`
      : kind === '1f1b'
        ? `${P} micro-batches of ${layersPerStage} layers: ${stage1Layers} layers' worth, all ${MODEL_70B.layers} of the model's layers`
        : `${sim.peakChunksStage1} chunks of ${layersPerStage / V_CHART} layers: ${stage1Layers} layers' worth, ${stage1Layers / MODEL_70B.layers} times the model's ${MODEL_70B.layers}`;

  return (
    <SpaceBetween size="m">
      <ColumnLayout columns={2}>
        <FormField label="Schedule">
          <SegmentedControl
            selectedId={kind}
            options={SCHEDULE_OPTIONS}
            label="Pipeline schedule"
            onChange={({ detail }) => setKind(detail.selectedId as ScheduleKind)}
          />
        </FormField>
        <FormField label={`Micro-batches per step, m = ${m}`} description="Multiples of p = 4, which the interleaved schedule needs.">
          <Slider
            value={stop}
            min={0}
            max={M_STOPS.length - 1}
            step={1}
            tickMarks
            valueFormatter={(i) => `m = ${M_STOPS[i]}`}
            ariaLabel="Micro-batches per step"
            onChange={({ detail }) => setStop(detail.value)}
          />
        </FormField>
      </ColumnLayout>
      <ScheduleChart kind={kind} m={m} sim={sim} />
      <Box variant="small" color="text-body-secondary">
        Illustrative, not measured. Computed from each schedule&apos;s ordering rules with a backward
        pass drawn twice as long as a forward pass, the ratio of their FLOPs (floating-point
        operations){' '}
        <Cite tier={3} href={PTDP} venue="SC 2021">
          Megatron-LM on GPU Clusters, Appendix
        </Cite>
        , and transfers between stages drawn as free. All three schedules share the time axis of
        GPipe and 1F1B at the same m, so the blank space after an interleaved run is time saved.
      </Box>
      <KeyValuePairs
        columns={3}
        items={[
          {
            label: 'Bubble, over ideal compute time',
            value: `${pct(calc.bubbleFraction)}: (p - 1)/(v x m) = 3/${v * m}`,
          },
          {
            label: 'The same idle time, over the whole step',
            value: pct(idleOverStep),
          },
          {
            label: 'Stage 1 activations at their peak',
            value: stage1Text,
          },
        ]}
      />
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Table: what PP divides                                                   */
/* ------------------------------------------------------------------------ */

const cell: CSSProperties = {
  padding: '6px 8px',
  borderBottom: '1px solid #e9ebed',
  textAlign: 'left',
  verticalAlign: 'top',
};
const headCell: CSSProperties = { ...cell, fontWeight: 700, borderBottom: '2px solid #d1d5db' };

function DegreeTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>Layout on 256 H100</th>
            <th style={headCell}>Model state per GPU</th>
            <th style={headCell}>Activations per GPU: stage 1, last stage</th>
          </tr>
        </thead>
        <tbody>
          {BY_DEGREE.map(({ pp, c }) => (
            <tr key={pp}>
              <td style={cell}>{`TP 8 x PP ${pp} x DP ${32 / pp}`}</td>
              <td style={cell}>{gbText(c.memory.modelState.totalBytes)}</td>
              <td style={cell}>{`${gbText(c.memory.firstStage.activationBytes)}, ${gbText(c.memory.lastStage.activationBytes)}`}</td>
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

export function PipelineParallel() {
  const bubble1 = pct(WORKED_1F1B.bubbleFraction);
  const bubble5 = pct(WORKED_V5.bubbleFraction);
  const m = WORKED_1F1B.microBatchesPerStep;
  const stepSeconds = WORKED_1F1B.computeSeconds;
  const ppStep1 = ppStepSeconds(WORKED_1F1B);
  const ppStep5 = ppStepSeconds(WORKED_V5);
  const ppMb5 = ppBytesPerMicroBatch(WORKED_V5) * WORKED_V5.layout.interleavedChunks;

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={`Size the bubble, the idle time at the start and end of a pipelined step, before you add stages, and know which memory pipelining leaves where it was: for Llama 3.1 70B on four stages the bubble is ${bubble1} of the step's compute time, and ${bubble5} with five interleaved chunks (papers, Megatron Core core_v0.20.0, TorchTitan v0.4.0, PyTorch v2.15.0 and DeepSpeed v0.19.9, read 2026-10-31)`}
          >
            10. Pipeline Parallelism &amp; the Bubble
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Pipeline parallelism (PP) splits a model by depth. Each stage, one GPU or one group of
            GPUs, holds a run of consecutive layers, and each step&apos;s batch flows through the
            stages as micro-batches, the slices of the batch that go through the model together. A
            stage hands its neighbour one activation tensor per micro-batch, so the split costs little
            bandwidth and can cross instances.
          </Box>
          <Box variant="p">
            The challenge is keeping every stage busy. At the start of a step the later stages wait for
            their first micro-batch, at the end the earlier stages wait for the last backward pass, and
            that idle time is the bubble. This section shows how to predict it from three numbers, what
            each schedule pays to shrink it, and which memory a pipeline leaves on its first stage.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict a pipeline's idle time from three numbers before you run it: the stages p, the micro-batches per step m, and the chunks per stage v"
          >
            Stages, micro-batches and the bubble
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A pipeline of p stages runs each micro-batch&apos;s forward pass through stage 1, then
            stage 2, on to stage p, which computes the loss; the backward pass returns the same way. A
            stage starts its next micro-batch as soon as it has handed the previous one on, so after p
            - 1 hand-offs every stage has work. The count that matters is m, the micro-batches each
            pipeline runs per step: <code>m = B / (b x d)</code> for a global batch of B sequences,
            micro-batches of b sequences and d data-parallel copies of the pipeline{' '}
            <Cite tier={3} href={PTDP} venue="SC 2021">
              Megatron-LM on GPU Clusters, Section 3.1
            </Cite>
            .
          </Box>
          <Box variant="p">
            The bubble is p - 1 forward passes at the start of the step and p - 1 backward passes at
            the end. Measured against the step&apos;s ideal compute time, m forward and backward
            passes, it is <code>(p - 1) / m</code>{' '}
            <Cite tier={3} href={PTDP} venue="SC 2021">
              Megatron-LM on GPU Clusters, Section 2.2.1
            </Cite>
            . GPipe, which introduced the schedule, states it over the total time instead,{' '}
            <code>(p - 1) / (m + p - 1)</code>{' '}
            <Cite tier={3} href={GPIPE} venue="preprint">
              GPipe, Section 2.3
            </Cite>
            . Both describe the same idle time, so a quoted percentage means little until its
            denominator is stated: four stages and eight micro-batches give 37.5% of ideal time, or
            27.3% of the step, by our arithmetic. This dive uses the ideal-time form, which is also the
            one section 14 (Set My Ranks: The Sizing Procedure) computes with.
          </Box>
          <Box variant="p">
            Stages need not hold equal shares of the layers. The first stage also runs the embedding
            and the last runs the output head and the loss, so production runs give both ends fewer
            transformer layers. Llama 3 removed one layer from each, so that its first model chunk holds
            only the embedding and its last only the output projection and loss{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.2
            </Cite>
            . For 405B&apos;s 126 layers{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Table 3
            </Cite>{' '}
            on 16 stages{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Table 4
            </Cite>{' '}
            that is 7 + 14 x 8 + 7 layers by our arithmetic (126 + 2 = 128 = 16 x 8). DeepSeek-V3 ran
            61 layers{' '}
            <Cite tier={3} href={DEEPSEEK_V3} venue="preprint">
              DeepSeek-V3 Technical Report, Section 4.2
            </Cite>{' '}
            on 16 stages{' '}
            <Cite tier={3} href={DEEPSEEK_V3} venue="preprint">
              Section 3.2
            </Cite>{' '}
            under its DualPipe schedule, which places the shallowest and the deepest layers on the same
            rank{' '}
            <Cite tier={3} href={DEEPSEEK_V3} venue="preprint">
              Section 3.2.3
            </Cite>
            ; the paper does not give the per-stage counts. The three frameworks read for this section
            all support lighter first and last stages, each with its own default.
          </Box>
          <ExpandableSection headerText="Uneven stages in Megatron Core, TorchTitan and DeepSpeed">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Megatron Core core_v0.20.0</strong> checks that the layer count divides by p
                only when neither <code>--decoder-first-pipeline-num-layers</code> nor{' '}
                <code>--decoder-last-pipeline-num-layers</code> is set{' '}
                <Cite tier={1} href={MEG_EVEN_SPLIT} kind="code">
                  Megatron Core arguments.py L879-L891
                </Cite>
                . Those two flags set the first and last stage&apos;s layer counts, and{' '}
                <code>--pipeline-model-parallel-layout</code> takes the whole per-stage layout as a
                string{' '}
                <Cite tier={1} href={MEG_UNEVEN_FLAGS} kind="code">
                  Megatron Core arguments.py L3041-L3056
                </Cite>
                ; <code>--account-for-embedding-in-pipeline-split</code> and{' '}
                <code>--account-for-loss-in-pipeline-split</code> count the embedding and the loss as
                one layer each in the split{' '}
                <Cite tier={1} href={MEG_ACCOUNT_FOR} kind="code">
                  Megatron Core transformer_config.py L151-L157
                </Cite>
                . For Llama 3&apos;s split, first and last counts of 7 leave 112 layers for the 14
                middle stages, 8 each, by our arithmetic.
              </Box>
              <Box variant="p">
                <strong>TorchTitan v0.4.0</strong> gives the first and last stages one layer fewer by
                default: <code>pipeline_parallel_first_stage_less_layers</code> and{' '}
                <code>pipeline_parallel_last_stage_less_layers</code> are both 1{' '}
                <Cite tier={1} href={TT_LESS_LAYERS} kind="code">
                  TorchTitan parallelism.py L95-L105
                </Cite>
                , and the split counts them as extra layers before dividing evenly{' '}
                <Cite tier={1} href={TT_SPLIT} kind="code">
                  TorchTitan pipeline_parallel.py L551-L612
                </Cite>
                . On 126 layers and 16 stages its default gives Llama 3&apos;s 7 + 14 x 8 + 7, by our
                reading of the code.
              </Box>
              <Box variant="p">
                <strong>DeepSpeed v0.19.9</strong> balances a <code>PipelineModule</code>&apos;s stages
                by parameter count unless told otherwise: <code>partition_method</code> defaults to{' '}
                <code>&apos;parameters&apos;</code>{' '}
                <Cite tier={1} href={DS_PARTITION_DEFAULT} kind="code">
                  DeepSpeed pipe/module.py L116-L133
                </Cite>
                , while <code>&apos;uniform&apos;</code> gives equal layer counts and{' '}
                <code>&apos;type:&lt;regex&gt;&apos;</code> balances on matching layer classes{' '}
                <Cite tier={1} href={DS_PARTITION} kind="code">
                  DeepSpeed pipe/module.py L396-L417
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
            description="Watch the bubble shrink as m grows, and see what each schedule pays for a smaller one: GPipe holds every micro-batch, 1F1B (one forward, one backward) caps them at p, interleaving divides the bubble by v"
          >
            Three schedules on four stages
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ul>
            <li>
              <strong>GPipe</strong> runs every micro-batch&apos;s forward pass, then every backward
              pass, so each stage keeps the activations of all m micro-batches until their backward
              passes arrive{' '}
              <Cite tier={3} href={PTDP} venue="SC 2021">
                Megatron-LM on GPU Clusters, Section 2.2.1
              </Cite>
              .
            </li>
            <li>
              <strong>1F1B</strong> (once the pipeline is full, each stage alternates one
              micro-batch&apos;s forward with another&apos;s backward) starts the
              backward passes as soon as the last stage finishes its first micro-batch. The bubble is
              the same size, and a stage holds at most p micro-batches in flight{' '}
              <Cite tier={3} href={PTDP} venue="SC 2021">
                Megatron-LM on GPU Clusters, Section 2.2.1
              </Cite>
              . Megatron Core&apos;s non-interleaved schedule warms up p - 1 - rank micro-batches{' '}
              <Cite tier={1} href={MEG_WARMUP} kind="code">
                Megatron Core schedules.py L2307-L2310
              </Cite>{' '}
              and then runs 1F1B in steady state{' '}
              <Cite tier={1} href={MEG_STEADY} kind="code">
                L2415-L2416
              </Cite>
              , and TorchTitan v0.4.0 selects 1F1B by default{' '}
              <Cite tier={1} href={TT_SCHEDULE} kind="code">
                TorchTitan parallelism.py L114-L121
              </Cite>
              .
            </li>
            <li>
              <strong>Interleaved 1F1B</strong> gives each stage v chunks of non-adjacent layers; the
              paper&apos;s example puts layers 1, 2, 9 and 10 on its first device. Each chunk
              takes 1/v of the time, so the bubble shrinks to <code>(p - 1) / (v x m)</code>, for v
              times as much point-to-point traffic, and the schedule needs m to be a multiple of p{' '}
              <Cite tier={3} href={PTDP} venue="SC 2021">
                Megatron-LM on GPU Clusters, Section 2.2.2
              </Cite>
              . In the chart, with v = 2, stage 1 holds layers 1 to 10 and 41 to 50 of the 70B
              model&apos;s 80, and every micro-batch passes through each stage twice.
            </li>
          </ul>
          <Box variant="p">
            The chart is one pipeline of the worked example at the end of this section: Llama 3.1 70B
            at TP (tensor parallelism, each layer&apos;s matrices split across the eight GPUs of one
            instance) 8, four stages of 20 layers, each stage one p5.48xlarge. Its bubble, and the
            stage-1 figures for 1F1B and interleaving, come from section 14&apos;s calculator, and the
            drawn schedule reproduces them. Drag m to 64, the worked example&apos;s count, and the
            1F1B bubble falls to{' '}
            {pct(chartCandidate(64, 1).bubbleFraction)}.
          </Box>
          <ScheduleExplorer />
          <ExpandableSection headerText="Later schedules: Zero Bubble, DualPipe and Llama 3's changes, and which framework ships them">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Zero Bubble</strong> splits each backward pass in two: the gradient for the
                layer&apos;s input, which the previous stage is waiting for, and the gradient for its
                weights, which can run any time after that on the same stage, so it is placed in the
                gaps. Its first handcrafted schedule, ZB-H1, keeps 1F1B&apos;s peak activation
                memory and cuts the bubble to about a third of 1F1B&apos;s; ZB-H2 reaches a zero
                bubble by holding activations for 2p - 1 micro-batches instead of p{' '}
                <Cite tier={3} href={ZERO_BUBBLE} venue="preprint">
                  Zero Bubble Pipeline Parallelism, Section 2 and Table 2
                </Cite>
                . The authors report up to 23% more throughput than 1F1B at a similar memory limit
                and 31% with the limit relaxed{' '}
                <Cite tier={3} href={ZERO_BUBBLE} venue="preprint">
                  Zero Bubble Pipeline Parallelism, abstract
                </Cite>
                , figures from their own runs.
              </Box>
              <Box variant="p">
                <strong>DualPipe</strong>, DeepSeek&apos;s schedule, feeds micro-batches from both ends
                of the pipeline at once, splits the backward pass the way Zero Bubble does, and pairs
                each forward chunk with a backward chunk so that the MoE (mixture of experts)
                all-to-all, the exchange that sends each token to the GPUs holding its experts, and
                the pipeline sends run behind computation. Its bubble is{' '}
                <code>(PP/2 - 1)(F&amp;B + B - 3W)</code> against 1F1B&apos;s{' '}
                <code>(PP - 1)(F + B)</code>, for two copies of the parameters and activations for PP
                + 1 micro-batches, and it needs the stage and micro-batch counts to be even, without
                requiring m to divide by the stage count{' '}
                <Cite tier={3} href={DEEPSEEK_V3} venue="preprint">
                  DeepSeek-V3 Technical Report, Section 3.2.1 and Table 2
                </Cite>
                . DeepSeek built it because cross-node expert parallelism left its computation and
                communication at about 1:1{' '}
                <Cite tier={3} href={DEEPSEEK_V3} venue="preprint">
                  Section 3.2.1
                </Cite>
                ; on our reading it is a communication-hiding schedule first and a bubble reducer
                second. Section 12 (Mixture of Experts: Expert Parallelism) covers that traffic.
              </Box>
              <Box variant="p">
                <strong>Llama 3</strong> made N, the number of contiguous micro-batches a stage runs
                for one chunk, a free setting so the batch no longer has to divide by the stage
                count, ran the interleaved schedule with a bubble of <code>(PP - 1) / (V x M)</code>,
                and made the point-to-point sends asynchronous{' '}
                <Cite tier={3} href={LLAMA3} venue="preprint">
                  Llama 3 Herd of Models, Section 3.3.2
                </Cite>
                . Meta does not publish V and M for the 405B run, so its bubble is not computed here.
                Megatron Core core_v0.20.0&apos;s equivalent of N, on our reading of its docstring, is{' '}
                <code>--microbatch-group-size-per-virtual-pipeline-stage</code>, the micro-batches run
                at a time for one virtual stage, which defaults to p{' '}
                <Cite tier={1} href={MEG_VPP_GROUP} kind="code">
                  Megatron Core model_parallel_config.py L466-L484
                </Cite>{' '}
                <Cite tier={1} href={MEG_VPP_GROUP_DEFAULT} kind="code">
                  L603-L604
                </Cite>
                ; when m divided by N leaves a remainder from 1 to p - 1, the interleaved schedule
                stops with an error{' '}
                <Cite tier={1} href={MEG_VPP_GROUP_CHECK} kind="code">
                  Megatron Core schedules.py L1161-L1181
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>Which framework ships them.</strong> PyTorch v2.15.0&apos;s pipelining
                library, which TorchTitan v0.4.0 schedules through, accepts GPipe, 1F1B,
                Interleaved1F1B, LoopedBFS, InterleavedZeroBubble, ZBVZeroBubble and DualPipeV by
                name{' '}
                <Cite tier={1} href={PT_SCHEDULES} kind="code">
                  PyTorch pipelining/schedules.py L5227-L5237
                </Cite>{' '}
                <Cite tier={1} href={TT_WARNING} kind="code">
                  TorchTitan pipeline_parallel.py L436-L445
                </Cite>
                . No Zero Bubble or DualPipe pipeline schedule was located in Megatron Core
                core_v0.20.0&apos;s arguments, pipeline schedules or MoE guide. For MoE models it runs
                one micro-batch&apos;s forward beside another&apos;s backward so the all-to-all hides
                behind computation, DualPipe&apos;s overlap applied to expert traffic on our reading{' '}
                <Cite tier={1} href={MEG_COMBINED_1F1B} kind="code">
                  Megatron Core combined_1f1b.py L54-L61
                </Cite>
                , with <code>--overlap-moe-expert-parallel-comm</code> and{' '}
                <code>--delay-wgrad-compute</code>, both off by default and only with expert
                parallelism above 1{' '}
                <Cite tier={1} href={MEG_MOE_OVERLAP}>
                  Megatron Core MoE guide L433-L438
                </Cite>{' '}
                <Cite tier={1} href={MEG_MOE_DEFAULTS}>
                  L561-L564
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
            description={`Check the pipeline's traffic before you place stages on separate instances: ${PP_MB_PER_MICROBATCH.toFixed(1)} MB per GPU per micro-batch for the 70B example, ${PP_MS_PER_MICROBATCH.toFixed(2)} ms on EFA (Elastic Fabric Adapter) against 266 ms of compute`}
          >
            The split that crosses instances
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Between two stages travels one activation tensor per micro-batch on the way forward and
            its gradient on the way back, b x s x h elements per stage boundary in each direction for
            micro-batch b, sequence length s and hidden size h. When each stage is a tensor-parallel
            group of t GPUs, Megatron&apos;s scatter-gather optimization sends each GPU&apos;s 1/t
            slice over that GPU&apos;s own network card and rebuilds the tensor with an all-gather
            over NVLink on the receiving instance, so each GPU sends bsh/t{' '}
            <Cite tier={3} href={PTDP} venue="SC 2021">
              Megatron-LM on GPU Clusters, Section 4.1
            </Cite>
            . Section 9 (Tensor &amp; Sequence Parallelism) covers t itself.
          </Box>
          <Box variant="p">
            For Llama 3.1 70B at TP 8, 8,192-token sequences and micro-batch 1, that is{' '}
            {PP_MB_PER_MICROBATCH.toFixed(1)} MB per GPU per micro-batch in each direction:{' '}
            {PP_MS_PER_MICROBATCH.toFixed(2)} ms over each GPU&apos;s 50 GB/s share of a
            p5.48xlarge&apos;s 3,200 Gbps of EFA bandwidth{' '}
            <Cite tier={1} href={EC2_ACCEL}>
              AWS accelerated computing instance specifications
            </Cite>
            , against about 266 ms of compute for a stage&apos;s 20 layers at 40% MFU (model FLOPs
            utilization, the share of peak arithmetic a run achieves), by our arithmetic below. All
            eight GPUs of a stage send their slices at once, about 134 MB per instance over its 400
            GB/s, which is the same {PP_MS_PER_MICROBATCH.toFixed(2)} ms. The transfer is about a
            tenth of a percent of the work it feeds, and it goes only to the neighbouring stage.
            Megatron&apos;s authors draw the same line: pipeline parallelism&apos;s point-to-point
            sends are cheaper than tensor parallelism&apos;s all-reduces, so they use tensor
            parallelism up to the GPUs of one server and pipeline parallelism across servers{' '}
            <Cite tier={3} href={PTDP} venue="SC 2021">
              Megatron-LM on GPU Clusters, Section 3.2 and Takeaway #1
            </Cite>
            .
          </Box>
          <Box variant="p">
            Interleaving multiplies the sends by v: at v = 5 each GPU sends five{' '}
            {PP_MB_PER_MICROBATCH.toFixed(1)} MB slices per micro-batch in each direction,{' '}
            {(ppMb5 / 1e6).toFixed(0)} MB and about {((ppMb5 / EFA_PER_GPU) * 1e3).toFixed(1)} ms,
            still small against the compute it feeds.
          </Box>
          <ExpandableSection headerText="The arithmetic behind these figures">
            <SpaceBetween size="s">
              <Box variant="p">
                <code>bsh / t = 1 x 8,192 x 8,192 / 8 = 8.39M elements x 2 bytes = 16.8 MB</code>, 2
                bytes per element for BF16 (bfloat16) activations, and{' '}
                <code>16.8 MB / 50 GB/s = 0.34 ms</code>, with 50 GB/s = 3,200 Gbps / 8 bits / 8 GPUs.
              </Box>
              <Box variant="p">
                Compute: Llama 3.1 70B has hidden size 8,192, an MLP (multilayer perceptron) width of
                28,672, 64 attention heads and 8 key-value heads of dimension 128{' '}
                <Cite tier={3} href={LLAMA3} venue="preprint">
                  Llama 3 Herd of Models, Table 3
                </Cite>
                , about 855.6M weights per layer (2 x 8,192 x 8,192 + 2 x 8,192 x 1,024 in attention,
                3 x 8,192 x 28,672 in the MLP). One layer for one micro-batch costs{' '}
                <code>6 x 855.6M x 8,192 / 8 GPUs = 5.26e12 FLOPs</code> per GPU, 13.3 ms at 396
                TFLOPS (trillion FLOPs per second), which is 40% of the H100&apos;s 989.5 TFLOPS
                dense BF16 peak, half the 1,979 TFLOPS NVIDIA lists with sparsity{' '}
                <Cite tier={1} href={H100_SPEC} kind="vendor-claim">
                  NVIDIA H100 specification
                </Cite>
                ; 40% is an assumption inside the 38% to 43% Llama 3 405B reached{' '}
                <Cite tier={3} href={LLAMA3} venue="preprint">
                  Llama 3 Herd of Models, Table 4
                </Cite>
                . A stage of 20 layers takes 20 x 13.3 = 266 ms per micro-batch.
              </Box>
              <Box variant="p">
                Per step at m = {m}, both directions: {gbText(2 * m * ppBytesPerMicroBatch(WORKED_1F1B))}{' '}
                per GPU, {ppStep1.toFixed(2)} s at v = 1 and {ppStep5.toFixed(2)} s at v = 5, against{' '}
                {stepSeconds.toFixed(1)} s of compute if none of it overlaps, by section 14&apos;s
                calculator. The {stepSeconds.toFixed(1)} s counts all 70.55 billion parameters,
                embedding and output head included; {m} micro-batches of 266 ms come to 17.0 s for the
                transformer layers alone.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Know before you add stages that they shrink model state and leave the first stage's activations where they were: ${gbText(WORKED_1F1B.memory.firstStage.activationBytes)} for the 70B example at any p`}
          >
            What a pipeline divides, and what stays on stage 1
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each stage stores only its own layers&apos; model state, the weights, gradients and
            optimizer state that persist from step to step, so model state per GPU falls with p.
            Activations, the tensors a forward pass saves for its backward pass, do not. Under 1F1B
            the first stage starts p micro-batches before it can run its first backward pass and holds
            each one&apos;s activations for its L/p of the model&apos;s L layers, so it stores p x L/p
            = L layers&apos; worth whatever p is; the interleaved schedule raises that to{' '}
            <code>L x (1 + (p - 1) / (p x v))</code>{' '}
            <Cite tier={3} href={KORTHIKANTI} venue="preprint">
              Reducing Activation Recomputation, Section 4.2.3
            </Cite>
            . Llama 3 reports the same imbalance in production: its first stage consumed more memory
            because of the embedding and the warm-up micro-batches{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.2
            </Cite>
            . The last stage runs each backward pass straight after its forward pass, so it holds one
            micro-batch, by our reading of the schedule.
          </Box>
          <Box variant="p">
            For the 70B example on 256 H100, written TP x PP x DP, DP (data parallelism) being the
            number of copies of the pipeline, with the optimizer state sharded over those copies
            (ZeRO-1, Zero Redundancy Optimizer stage 1), at micro-batch 1 and 8,192 tokens. Figures
            from section 14&apos;s calculator, with activations at 34sbh bytes per layer, section
            5&apos;s figure, divided by TP 8:
          </Box>
          <DegreeTable />
          <Box variant="p">
            Model state falls from {gbText(BY_DEGREE[0].c.memory.modelState.totalBytes)} to{' '}
            {gbText(BY_DEGREE[2].c.memory.modelState.totalBytes)} per GPU as p goes from 1 to 4,
            and stage 1 keeps {gbText(WORKED_1F1B.memory.firstStage.activationBytes)} of activations
            throughout ({gbText(WORKED_V5.memory.firstStage.activationBytes)} with five interleaved
            chunks). When activations are what does not fit, more stages do not help; section 5 (The
            Memory Budget) lists the levers that do.
          </Box>
          <Box variant="p">
            The usual lever with a pipeline is activation recomputation, which keeps each
            layer&apos;s input and re-runs its forward pass during the backward pass instead of
            storing every activation. Megatron&apos;s 2021 paper calls it &quot;required to train
            reasonably large models with pipeline parallelism&quot;{' '}
            <Cite tier={3} href={PTDP} venue="SC 2021">
              Megatron-LM on GPU Clusters, Section 3.5
            </Cite>
            . Llama 3 pre-trained 405B on 16 stages with 8,192-token sequences without activation
            checkpointing, after making its schedule flexible and freeing stage inputs and outputs it
            no longer needed{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.2 and Table 4
            </Cite>
            . Treat recomputation as a choice to measure for each layout.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Pick the smallest p that fits, then raise m or v until the bubble is near one percent: ${bubble1} becomes ${bubble5} for the 70B example`}
          >
            Size the bubble for your layout
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The bubble is <code>(p - 1) / (v x m)</code>, and the global batch caps m: with{' '}
            <code>m = B / (b x d)</code>, a fixed batch spread over more data-parallel copies leaves
            fewer micro-batches in each pipeline. That gives an order, on our reading of these
            sources: first the smallest p whose stages fit, since every added stage lengthens the
            bubble and leaves stage 1&apos;s activations as they were; then raise m, through a
            smaller micro-batch or a larger global batch, or raise v at v times the point-to-point
            traffic, until the bubble is near one percent. A smaller micro-batch also gives each
            kernel less work, so Megatron&apos;s authors treat its size as a trade-off between the
            bubble, throughput per GPU and memory{' '}
            <Cite tier={3} href={PTDP} venue="SC 2021">
              Megatron-LM on GPU Clusters, Section 3.4 and Takeaway #3
            </Cite>
            .
          </Box>
          <Box variant="p">
            Worked for Llama 3.1 70B on 32 p5.48xlarge (256 H100) at TP 8 x PP 4 x DP 8 with ZeRO-1,
            8,192-token sequences, an assumed global batch of 512 sequences (4.2M tokens) and micro-batch 1:{' '}
            <code>m = 512 / (1 x 8) = {m}</code> micro-batches per pipeline, a multiple of p as
            interleaving needs. The 1F1B bubble is <code>3 / {m} = {bubble1}</code> of the{' '}
            {stepSeconds.toFixed(1)} s compute step (6 FLOPs per parameter per token at 40% MFU,
            attention excluded), about{' '}
            {(stepSeconds * WORKED_1F1B.bubbleFraction).toFixed(1)} s per step. Five chunks per
            stage, 4 of each stage&apos;s 20 layers per chunk, bring it to{' '}
            <code>3 / (5 x {m}) = {bubble5}</code>, about{' '}
            {(stepSeconds * WORKED_V5.bubbleFraction).toFixed(2)} s, for five times the pipeline
            traffic. Our arithmetic, from section 14&apos;s calculator.
          </Box>
          <Box variant="p">
            Where m is set: Megatron Core derives it from the batch, global batch / (micro-batch x
            data-parallel size), so <code>--global-batch-size</code> and{' '}
            <code>--micro-batch-size</code> set it{' '}
            <Cite tier={1} href={MEG_NUM_MICROBATCHES} kind="code">
              Megatron Core num_microbatches_calculator.py L381-L388
            </Cite>
            , and <code>--num-layers-per-virtual-pipeline-stage</code> or{' '}
            <code>--num-virtual-stages-per-pipeline-rank</code> sets v{' '}
            <Cite tier={1} href={MEG_VPP_FLAGS} kind="code">
              Megatron Core arguments.py L3060-L3063
            </Cite>
            . TorchTitan v0.4.0 takes m as <code>num_pp_microbatches</code>, default 1{' '}
            <Cite tier={1} href={TT_MICROBATCHES} kind="code">
              TorchTitan parallelism.py L130-L135
            </Cite>
            , and runs each gradient-accumulation step as its own pipeline of that many
            micro-batches{' '}
            <Cite tier={1} href={TT_ACCUMULATION} kind="code">
              TorchTitan trainer.py L185-L205
            </Cite>{' '}
            <Cite tier={1} href={TT_GROUPS} kind="code">
              L334-L341
            </Cite>
            ; with fewer micro-batches than stages it logs a warning and runs{' '}
            <Cite tier={1} href={TT_WARNING} kind="code">
              TorchTitan pipeline_parallel.py L436-L445
            </Cite>
            . At that default on four stages every pipeline step carries one micro-batch, a bubble of
            3 times the compute: each stage idles three quarters of the time, by our arithmetic. Set{' '}
            <code>num_pp_microbatches</code> to the m you sized, and pick{' '}
            <code>Interleaved1F1B</code> or a zero-bubble schedule in{' '}
            <code>pipeline_parallel_schedule</code> when the plan has v above 1.
          </Box>
          <Box variant="p">
            Then run the full check for your own model and cluster in section 14 (Set My Ranks: The
            Sizing Procedure), which adds the memory and the traffic of every dimension to this{' '}
            {bubble1} and {bubble5}, and confirm the winner with a measured step.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
