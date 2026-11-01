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
import SegmentedControl from '@cloudscape-design/components/segmented-control';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Link from '@cloudscape-design/components/link';
import {
  Cite,
  arxiv,
  gh,
  ghTree,
  E1_URL,
  E2_URL,
  E3_URL,
  GUIDE_URL,
  TORCHTITAN_TAG,
  MEGATRON_TAG,
  NEMO_TAG,
  NEMO_2_TAG,
  DEEPSPEED_TAG,
  NEURON_SDK_SHA,
  AWSOME_DISTRIBUTED_TRAINING_SHA,
  LLAMA_MODELS_TAG,
} from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import {
  DEEPSEEK_V3,
  DENSE_MODELS,
  GB,
  INSTANCES,
  customLlamaShape,
  moeShapeOf,
  rankFacts,
  shapeOf,
  type DenseModelId,
  type InstanceId,
  type ModelShape,
} from '../lib/presets';
import {
  UNEVEN_STAGES_FLAG,
  evaluateLayout,
  sizeMoeGrids,
  sizeParallelism,
  type Candidate,
  type GradientSync,
  type Layout,
  type LinkLoad,
  type MoeInput,
  type MoeResult,
  type ParallelismInput,
  type ParallelismResult,
  type Sharding,
} from '../lib/parallelism';
import type { GradientDtype, RecomputeMode, ZeroStage } from '../lib/memory';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Register rows cited without re-opening the source keep the register's date. */
const REGISTER_DATE = '2026-10-30';

const ZERO = arxiv('1910.02054v3');
const PTDP = arxiv('2104.04473v5');
const KORTHIKANTI = arxiv('2205.05198v1');
const LLAMA3 = arxiv('2407.21783v3');
const TT_PAPER = arxiv('2410.06511v3');
const DSV3 = arxiv('2412.19437v2');
const FOLDING = arxiv('2504.14960v3');
const ALPA = arxiv('2201.12023v3');
const GALVATRON = arxiv('2211.13878v1');

const H100_SPEC = 'https://www.nvidia.com/en-us/data-center/h100/';
const H200_SPEC = 'https://www.nvidia.com/en-us/data-center/h200/';
const NVLINK_PAGE = 'https://www.nvidia.com/en-us/data-center/nvlink/';
const EC2_AC = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';
const HF_70B =
  'https://huggingface.co/api/models/meta-llama/Llama-3.1-70B/revision/349b2ddb53ce8f2849a6c168a81980ab25258dac';
const LLAMA_TOKENIZER = gh('meta-llama/llama-models', LLAMA_MODELS_TAG, 'models/llama3/tokenizer.py', 'L53-L103');
const TT_NEURON = gh('aws-neuron/aws-neuron-sdk', NEURON_SDK_SHA, 'training/torchtitan/about-torchtitan-neuron.rst');

const mg = (path: string, lines?: string): string => gh('NVIDIA/Megatron-LM', MEGATRON_TAG, path, lines);
const MG_GUIDE = 'docs/user-guide/parallelism-guide.md';
const MG_ARGS = 'megatron/training/arguments.py';
const MG_DIST_OPT = mg('docs/user-guide/features/dist_optimizer.md', 'L14-L20');
const MG_DIST_OPT_FLAG = mg(MG_ARGS, 'L3102-L3103');
const MG_HEADS_CHECK = mg('megatron/core/transformer/transformer_config.py', 'L1746-L1773');
const MG_NUM_MICROBATCHES = mg('megatron/core/num_microbatches_calculator.py', 'L381-L388');
const MG_UNEVEN_FLAGS = mg(MG_ARGS, 'L3041-L3056');
const MG_ACCOUNT_FOR = mg('megatron/core/transformer/transformer_config.py', 'L151-L157');
const MG_DENSE_WORLD = mg(MG_ARGS, 'L468-L495');
const MG_EXPERT_WORLD = mg('megatron/core/parallel_state.py', 'L946-L960');
const MG_MOE_README = 'megatron/core/transformer/moe/README.md';

const BRIDGE_SHA = '04ce2b3efd6f2e387fc244e9f37afd0a1f7952fb';
const BRIDGE_RECIPE = gh('NVIDIA-NeMo/Megatron-Bridge', BRIDGE_SHA, 'src/megatron/bridge/recipes/llama/h100/llama3.py', 'L717-L802');

const TT_LESS_LAYERS = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/config/parallelism.py', 'L95-L105');
const TT_BENCH = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'docs/benchmarks/llama3_h100_202412_torchtitan.md', 'L10-L53');

const DS_PARTITION_DEFAULT = gh('deepspeedai/DeepSpeed', DEEPSPEED_TAG, 'deepspeed/runtime/pipe/module.py', 'L116-L133');
const DS_AUTOTUNER = gh('deepspeedai/DeepSpeed', DEEPSPEED_TAG, 'deepspeed/autotuning/README.md', 'L79-L97');
const DS_AUTOTUNER_MP = gh('deepspeedai/DeepSpeed', DEEPSPEED_TAG, 'deepspeed/autotuning/README.md', 'L317-L319');
const DS_ZERO2_REDUCE = gh('deepspeedai/DeepSpeed', DEEPSPEED_TAG, 'deepspeed/runtime/zero/stage_1_and_2.py', 'L2293-L2295');

const NEMO_AUTOCONF_README = gh('NVIDIA/NeMo', NEMO_2_TAG, 'examples/llm/auto_configurator/README.md');
const NEMO_GRID = gh('NVIDIA/NeMo', NEMO_2_TAG, 'nemo/collections/llm/tools/auto_configurator/core/training_config.py', 'L72-L77');
const NEMO_HEURISTIC = gh('NVIDIA/NeMo', NEMO_2_TAG, 'nemo/collections/llm/tools/auto_configurator/core/training_config.py', 'L364-L398');
const NEMO_3_README = gh('NVIDIA/NeMo', NEMO_TAG, 'README.md');
const BRIDGE_TREE = ghTree('NVIDIA-NeMo/Megatron-Bridge', BRIDGE_SHA);

const PLAYBOOK = 'https://huggingface.co/spaces/nanotron/ultrascale-playbook/tree/c93890dd4b22356ee18ed9b863e6f2d0909729bc';
const CALCULON_CODE = gh('calculon-ai/calculon', 'c2aba03022c4870c62a42f127f7e2b97c2ce7de2', 'calculon/llm/llm.py');
const CALCULON_SC23 =
  'https://web.archive.org/web/2024/https://sc23.supercomputing.org/proceedings/tech_paper/tech_paper_pages/pap552.html';

const ADT_P5_SAMPLE = gh(
  'aws-samples/awsome-distributed-training',
  AWSOME_DISTRIBUTED_TRAINING_SHA,
  'micro-benchmarks/nccl-tests/README.md',
  'L206-L243',
);

const EC2_PRICE_LIST =
  'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv';
const CB_PRICING = 'https://aws.amazon.com/ec2/capacityblocks/pricing/';
const OD_QUOTAS = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html';

const E1_TITLE = 'E1: activation memory per Llama 3.1 8B layer on one GB10, PyTorch 2.15.0, one run';
const E2_TITLE = 'E2: step time and MFU against a measured ceiling on one GB10, PyTorch 2.15.0, two runs';
const E3_TITLE = 'E3: FSDP2 collectives per step, two processes on one DGX Spark CPU, PyTorch 2.15.0';

/* ------------------------------------------------------------------------ */
/* Number formatting (display only; every value comes from src/lib)         */
/* ------------------------------------------------------------------------ */

function gb(bytes: number, digits = 1): string {
  return `${(bytes / GB).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })} GB`;
}

function pct(fraction: number, digits = 1): string {
  return `${(fraction * 100).toFixed(digits)}%`;
}

function sec(seconds: number, digits = 1): string {
  return `${seconds.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })} s`;
}

function range(c: Candidate, digits = 1): string {
  return `${c.stepSeconds.low.toFixed(digits)} to ${c.stepSeconds.high.toFixed(digits)} s`;
}

function ordinal(n: number): string {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  const last = n % 10;
  return `${n}${last === 1 ? 'st' : last === 2 ? 'nd' : last === 3 ? 'rd' : 'th'}`;
}

/** The calculator's messages name register rows for the fact checkers; the page does not print them. */
function withoutRegisterIds(message: string): string {
  return message.replace(/\s*\((?:[TUCW]\d{1,2}-\d+(?:,\s*)?)+\)/g, '').replace(/\s*\(\d{2} section [^)]*\)/g, '');
}

function linkOf(c: Candidate, dimension: LinkLoad['dimension']): LinkLoad {
  const l = c.links.find((x) => x.dimension === dimension);
  if (!l) throw new Error(`worked layout ${c.description} has no ${dimension} link`);
  return l;
}

const cell: CSSProperties = {
  padding: '6px 8px',
  borderBottom: '1px solid #e9ebed',
  textAlign: 'left',
  verticalAlign: 'top',
};
const headCell: CSSProperties = { ...cell, fontWeight: 700, borderBottom: '2px solid #d1d5db' };
const tableStyle: CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 14 };

/* ------------------------------------------------------------------------ */
/* Worked examples, computed by Calculator C (src/lib/parallelism.ts)        */
/* ------------------------------------------------------------------------ */

const M70 = shapeOf(DENSE_MODELS['llama-3.1-70b']);
const P5 = INSTANCES['p5.48xlarge'];
const P5EN = INSTANCES['p5en.48xlarge'];
const SEQUENCE = 8_192;
const SEQUENCES = 512;

function lay(o: Partial<Layout>): Layout {
  return {
    tp: 1,
    cp: 1,
    pp: 1,
    dp: 1,
    interleavedChunks: 1,
    sharding: 'zero1',
    microBatch: 1,
    recompute: 'none',
    gradientSync: 'oncePerStep',
    ...o,
  };
}

/** Example 1: Llama 3.1 70B on 32 p5.48xlarge, 512 sequences of 8,192 tokens, 6N FLOPs per token. */
const EX1_INPUT: ParallelismInput = {
  model: M70,
  instance: P5,
  instanceCount: 32,
  sequenceLength: SEQUENCE,
  globalBatch: { sequences: SEQUENCES },
  attention: 'none',
};
const EX1_A_LAYOUT = lay({ tp: 8, pp: 4, dp: 8, interleavedChunks: 5 });
const EX1_B_LAYOUT = lay({ tp: 8, dp: 32, sharding: 'fsdp', gradientSync: 'everyMicroBatch', microBatch: 16, recompute: 'full' });
const EX1_A = evaluateLayout(EX1_INPUT, EX1_A_LAYOUT);
const EX1_A_FP32 = evaluateLayout({ ...EX1_INPUT, gradientDtype: 'fp32' }, EX1_A_LAYOUT);
const EX1_A_V1 = evaluateLayout(EX1_INPUT, { ...EX1_A_LAYOUT, interleavedChunks: 1 });
const EX1_B = evaluateLayout(EX1_INPUT, EX1_B_LAYOUT);
const EX1_B_MB1 = evaluateLayout(EX1_INPUT, { ...EX1_B_LAYOUT, microBatch: 1 });
const EX1_B_MB1_DEFERRED = evaluateLayout(EX1_INPUT, { ...EX1_B_LAYOUT, microBatch: 1, gradientSync: 'deferred' });
const EX1_REPLICATED = evaluateLayout(EX1_INPUT, lay({ dp: 256, sharding: 'ddp' }));

/** Megatron Bridge v0.7.0's 70B recipe on 32 H100, FP32 main gradients, with and without the distributed optimizer. */
const BRIDGE_INPUT: ParallelismInput = { ...EX1_INPUT, instanceCount: 4, gradientDtype: 'fp32' };
const BRIDGE_LAYOUT = lay({ tp: 4, cp: 2, pp: 4, dp: 1, interleavedChunks: 5 });
const BRIDGE_DISTOPT = evaluateLayout(BRIDGE_INPUT, BRIDGE_LAYOUT);
const BRIDGE_NO_DISTOPT = evaluateLayout(BRIDGE_INPUT, { ...BRIDGE_LAYOUT, sharding: 'ddp' });

/** Example 2: the same model and batch on 4 p5en.48xlarge (32 H200). */
const EX2_INPUT: ParallelismInput = { ...EX1_INPUT, instance: P5EN, instanceCount: 4 };
const EX2_ZERO1 = evaluateLayout(EX2_INPUT, lay({ dp: 32 }));
const EX2_ZERO2 = evaluateLayout(EX2_INPUT, lay({ dp: 32, sharding: 'zero2' }));
const EX2_FSDP = evaluateLayout(EX2_INPUT, lay({ dp: 32, sharding: 'fsdp', gradientSync: 'everyMicroBatch' }));
const EX2_FSDP_FULL = evaluateLayout(EX2_INPUT, lay({ dp: 32, sharding: 'fsdp', gradientSync: 'everyMicroBatch', recompute: 'full' }));
const EX2_HSDP = evaluateLayout(EX2_INPUT, lay({ dp: 32, sharding: 'hsdp', gradientSync: 'everyMicroBatch' }));
const EX2_HSDP_FULL = evaluateLayout(EX2_INPUT, lay({ dp: 32, sharding: 'hsdp', gradientSync: 'everyMicroBatch', recompute: 'full' }));
const EX2_TP8 = evaluateLayout(EX2_INPUT, lay({ tp: 8, dp: 4 }));
const EX2_TP8_FP32 = evaluateLayout({ ...EX2_INPUT, gradientDtype: 'fp32' }, lay({ tp: 8, dp: 4 }));
const EX2_TP8_ZERO2 = evaluateLayout(EX2_INPUT, lay({ tp: 8, dp: 4, sharding: 'zero2' }));
const EX2_TP8_PP2 = evaluateLayout(EX2_INPUT, lay({ tp: 8, pp: 2, dp: 2 }));
const EX2_ON_H100: ParallelismInput = { ...EX2_INPUT, instance: P5 };
const EX2_H100_TP8 = evaluateLayout(EX2_ON_H100, lay({ tp: 8, dp: 4 }));
const EX2_H100_TP8_FULL = evaluateLayout(EX2_ON_H100, lay({ tp: 8, dp: 4, recompute: 'full' }));
const EX2_H100_TP8_PP4 = evaluateLayout(EX2_ON_H100, lay({ tp: 8, pp: 4, dp: 1, sharding: 'ddp' }));

const EX2_FSDP_LINK = linkOf(EX2_FSDP_FULL, 'FSDP');
const EX2_FSDP_PER_MB_BYTES = EX2_FSDP_LINK.bytesPerStep / EX2_FSDP_FULL.microBatchesPerStep;
const EX2_FSDP_PER_MB_SECONDS = EX2_FSDP_LINK.seconds / EX2_FSDP_FULL.microBatchesPerStep;
const EX2_COMPUTE_PER_MB_RECOMPUTED =
  (EX2_FSDP_FULL.computeSeconds * EX2_FSDP_FULL.recomputeFactor) / EX2_FSDP_FULL.microBatchesPerStep;

const P5_FACTS = rankFacts(P5);

/* ------------------------------------------------------------------------ */
/* Diagram: the procedure as a decision flow                                */
/* ------------------------------------------------------------------------ */

const INK = '#16191f';
const MUTED = '#414d5c';
const FONT = 'sans-serif';
const BLUE = '#0972d3';
const BLUE_FILL = '#f2f8fd';
const AMBER = '#8b6c00';
const AMBER_FILL = '#fbf3d5';
const GREEN = '#037f0c';
const GREEN_FILL = '#ecf7ec';

interface FlowStep {
  title: string;
  check: string;
  section: string;
  phase: 0 | 1 | 2;
}

const PHASES = [
  { label: 'Fit one copy: steps 1 to 7', stroke: BLUE, fill: BLUE_FILL },
  { label: 'Check every candidate: 8 to 11', stroke: AMBER, fill: AMBER_FILL },
  { label: 'Measure: step 12', stroke: GREEN, fill: GREEN_FILL },
] as const;

const FLOW_STEPS: FlowStep[] = [
  { title: '1. Gather inputs', check: 'model, cluster, batch', section: 'sections 3 to 5', phase: 0 },
  { title: '2. Check 16N bytes', check: '18N with 32-bit gradients', section: 'section 5', phase: 0 },
  { title: '3. Shard over DP', check: 'optimizer state first', section: 'section 8', phase: 0 },
  { title: '4. Add TP with SP', check: 'up to one instance', section: 'section 9', phase: 0 },
  { title: '5. Add smallest PP', check: 'uneven end stages allowed', section: 'section 10', phase: 0 },
  { title: '6. Add CP if needed', check: 'activations still too big', section: 'section 11', phase: 0 },
  { title: '7. Set expert grid', check: 'experts get their own grid', section: 'section 12', phase: 0 },
  { title: '8. Check divisors', check: 'product is world size', section: 'sections 9 and 10', phase: 1 },
  { title: '9. Check the bubble', check: '(p - 1) / (v x m)', section: 'section 10', phase: 1 },
  { title: '10. Price each link', check: 'bytes / link speed', section: 'sections 7 to 9', phase: 1 },
  { title: '11. Nest by speed', check: 'TP inside, DP outside', section: 'section 13', phase: 1 },
  { title: '12. Measure', check: 'a few hundred steps', section: 'section 31', phase: 2 },
];

const FLOW_NARROW_PX = 760;

function FlowLegend({ x, y, dx, dy, size }: { x: number; y: number; dx: number; dy: number; size: number }) {
  return (
    <g>
      {PHASES.map((p, i) => (
        <g key={p.label}>
          <rect x={x + i * dx} y={y + i * dy} width={size} height={size} rx={3} fill={p.fill} stroke={p.stroke} strokeWidth={1.5} />
          <text x={x + i * dx + size + 8} y={y + i * dy + size - 3} fontFamily={FONT} fontSize={13} fill={INK}>
            {p.label}
          </text>
        </g>
      ))}
    </g>
  );
}

function FlowWide() {
  const W = 900;
  const boxW = 196;
  const boxH = 96;
  const gapX = 28;
  const x0 = 16;
  const rowY = [56, 188, 320];
  const H = 432;
  const pos = FLOW_STEPS.map((_, i) => {
    const row = Math.floor(i / 4);
    const k = i % 4;
    const col = row === 1 ? 3 - k : k;
    return { x: x0 + col * (boxW + gapX), y: rowY[row], row };
  });
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto' }}
      role="img"
      aria-labelledby="set-my-ranks-flow-title"
      aria-describedby="set-my-ranks-flow-desc"
    >
      <title id="set-my-ranks-flow-title">
        The sizing procedure as a flow: seven steps that fit one copy of the model, four checks on every candidate, and one measurement
      </title>
      <desc id="set-my-ranks-flow-desc">
        Twelve boxes in three rows, read left to right, then right to left, then left to right. Each box names the step, its check and the section that derives it.
      </desc>
      <defs>
        <marker id="set-my-ranks-flow-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={MUTED} />
        </marker>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="#ffffff" />
      <FlowLegend x={16} y={14} dx={292} dy={0} size={16} />
      {FLOW_STEPS.map((s, i) => {
        const p = pos[i];
        const phase = PHASES[s.phase];
        return (
          <g key={s.title} className="set-my-ranks-flow-step">
            <rect x={p.x} y={p.y} width={boxW} height={boxH} rx={8} fill={phase.fill} stroke={phase.stroke} strokeWidth={1.5} />
            <text x={p.x + 12} y={p.y + 26} fontFamily={FONT} fontSize={14} fontWeight={700} fill={INK}>
              {s.title}
            </text>
            <text x={p.x + 12} y={p.y + 52} fontFamily={FONT} fontSize={12} fill={INK}>
              {s.check}
            </text>
            <text x={p.x + 12} y={p.y + 76} fontFamily={FONT} fontSize={12} fill={MUTED}>
              {s.section}
            </text>
          </g>
        );
      })}
      {pos.slice(0, -1).map((p, i) => {
        const q = pos[i + 1];
        if (q.row !== p.row) {
          const cx = p.x + boxW / 2;
          return (
            <line
              key={`a${i}`}
              x1={cx}
              y1={p.y + boxH + 2}
              x2={cx}
              y2={q.y - 3}
              stroke={MUTED}
              strokeWidth={1.5}
              markerEnd="url(#set-my-ranks-flow-ah)"
            />
          );
        }
        const leftToRight = q.x > p.x;
        const y = p.y + boxH / 2;
        return (
          <line
            key={`a${i}`}
            x1={leftToRight ? p.x + boxW + 2 : p.x - 2}
            y1={y}
            x2={leftToRight ? q.x - 3 : q.x + boxW + 3}
            y2={y}
            stroke={MUTED}
            strokeWidth={1.5}
            markerEnd="url(#set-my-ranks-flow-ah)"
          />
        );
      })}
    </svg>
  );
}

function FlowNarrow() {
  const W = 400;
  const x = 16;
  const boxW = 368;
  const boxH = 58;
  const gap = 18;
  const top = 84;
  const H = top + FLOW_STEPS.length * boxH + (FLOW_STEPS.length - 1) * gap + 12;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto' }}
      role="img"
      aria-labelledby="set-my-ranks-flow-narrow-title"
    >
      <title id="set-my-ranks-flow-narrow-title">
        The sizing procedure as a flow: seven steps that fit one copy of the model, four checks on every candidate, and one measurement
      </title>
      <defs>
        <marker id="set-my-ranks-flow-narrow-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={MUTED} />
        </marker>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="#ffffff" />
      <FlowLegend x={16} y={10} dx={0} dy={24} size={14} />
      {FLOW_STEPS.map((s, i) => {
        const y = top + i * (boxH + gap);
        const phase = PHASES[s.phase];
        return (
          <g key={s.title} className="set-my-ranks-flow-narrow-step">
            <rect x={x} y={y} width={boxW} height={boxH} rx={8} fill={phase.fill} stroke={phase.stroke} strokeWidth={1.5} />
            <text x={x + 12} y={y + 23} fontFamily={FONT} fontSize={14} fontWeight={700} fill={INK}>
              {s.title}
            </text>
            <text x={x + boxW - 12} y={y + 23} fontFamily={FONT} fontSize={12} fill={MUTED} textAnchor="end">
              {s.section}
            </text>
            <text x={x + 12} y={y + 45} fontFamily={FONT} fontSize={12} fill={INK}>
              {s.check}
            </text>
            {i < FLOW_STEPS.length - 1 ? (
              <line
                x1={W / 2}
                y1={y + boxH + 2}
                x2={W / 2}
                y2={y + boxH + gap - 3}
                stroke={MUTED}
                strokeWidth={1.5}
                markerEnd="url(#set-my-ranks-flow-narrow-ah)"
              />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

function ProcedureFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, FLOW_NARROW_PX);
  return (
    <SpaceBetween size="xs">
      <div ref={ref}>{narrow ? <FlowNarrow /> : <FlowWide />}</div>
      <Box variant="small" color="text-body-secondary">
        Illustrative, not measured. A layout that fails a check in steps 8 to 11 goes back to steps 3
        to 7 for another dimension or degree.
      </Box>
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Example 1: how the ranking treats the two published layouts              */
/* ------------------------------------------------------------------------ */

function shapeKey(l: Layout): string {
  return `${l.tp}x${l.cp}x${l.pp}x${l.dp}`;
}

/** The best-ranked variant of each shape (TP x CP x PP x DP), in the calculator's order. */
function bestPerShape(candidates: readonly Candidate[]): Candidate[] {
  const seen = new Set<string>();
  const out: Candidate[] = [];
  for (const c of candidates) {
    const k = shapeKey(c.layout);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(c);
  }
  return out;
}

function rangesOverlap(a: Candidate, b: Candidate): boolean {
  return a.stepSeconds.low <= b.stepSeconds.high && b.stepSeconds.low <= a.stepSeconds.high;
}

const ALL = 1_000_000;

/** The best variant of a shape in a ranked list, with its place (1-based), or undefined. */
function placeOf(list: readonly Candidate[], l: Layout): { place: number; best: Candidate } | undefined {
  const i = list.findIndex((c) => shapeKey(c.layout) === shapeKey(l));
  return i >= 0 ? { place: i + 1, best: list[i] } : undefined;
}

function placeText(p: { place: number; best: Candidate } | undefined, total: number): string {
  return p ? `${ordinal(p.place)} of ${total}, at ${range(p.best)}` : 'not among the survivors';
}

function Example1Ranking() {
  const r = useMemo(() => {
    const noCp = bestPerShape(sizeParallelism({ ...EX1_INPUT, maxContextParallel: 1, limit: ALL }).survivors);
    const wide = bestPerShape(sizeParallelism({ ...EX1_INPUT, limit: ALL }).survivors);
    return {
      noCp,
      wide,
      aNoCp: placeOf(noCp, EX1_A_LAYOUT),
      bNoCp: placeOf(noCp, EX1_B_LAYOUT),
      aWide: placeOf(wide, EX1_A_LAYOUT),
      bWide: placeOf(wide, EX1_B_LAYOUT),
    };
  }, []);
  const top = r.noCp[0];
  const overlapAll =
    top !== undefined &&
    r.aNoCp !== undefined &&
    r.bNoCp !== undefined &&
    rangesOverlap(top, r.aNoCp.best) &&
    rangesOverlap(top, r.bNoCp.best);
  return (
    <SpaceBetween size="s">
      <Box variant="p">
        Step 6 adds CP only when activations still do not fit, so the calculator first runs with CP
        held at 1. It finds {r.noCp.length} shapes (degree combinations TP x CP x PP x DP) within the
        memory target, and its first is {top ? `${top.description}, at ${range(top)}` : 'none'}. The
        best variant of layout A&apos;s shape ranks {placeText(r.aNoCp, r.noCp.length)}; layout
        B&apos;s ranks {placeText(r.bNoCp, r.noCp.length)}.
        {overlapAll ? ' All three ranges overlap, so on paper they tie.' : ''}
      </Box>
      <Box variant="p">
        Allow CP up to 8 and {r.wide.length} shapes pass, with CP layouts in the first places: layout
        A&apos;s shape drops to {r.aWide ? ordinal(r.aWide.place) : 'outside the list'} and layout
        B&apos;s to {r.bWide ? ordinal(r.bWide.place) : 'outside the list'}. That follows from how the
        calculator counts: with eight KV heads, CP&apos;s K and V exchange is small, while TP&apos;s
        NVLink traffic sits in the no-overlap end of every range (our reading of the calculator). A
        per-GPU model has limits the papers name: the best micro-batch depends on the model&apos;s
        throughput and memory, the pipeline depth, the data-parallel size and the batch{' '}
        <Cite tier={3} href={PTDP} venue="SC 2021" accessed={REGISTER_DATE}>
          PTD-P paper, Section 3.4, Takeaway #3
        </Cite>
        , and the Ultra-Scale Playbook&apos;s authors saw the faster of TP and PP change as they
        optimised each implementation{' '}
        <Cite tier={3} href={PLAYBOOK} accessed={REGISTER_DATE}>
          The Ultra-Scale Playbook, benchmark sweep
        </Cite>
        . The ranking orders the candidates, and the measurement chooses.
      </Box>
    </SpaceBetween>
  );
}

/** Example 2's shortlist: the calculator's first shape with CP held at 1, against the procedure's TP 8 x DP 4. */
function Example2Shortlist() {
  const r = useMemo(() => {
    const shapes = bestPerShape(sizeParallelism({ ...EX2_INPUT, maxContextParallel: 1, limit: ALL }).survivors);
    return { shapes, flat: placeOf(shapes, lay({ tp: 8, dp: 4 })) };
  }, []);
  const top = r.shapes[0];
  const flat = r.flat;
  if (!top || !flat) return null;
  const same = shapeKey(top.layout) === shapeKey(flat.best.layout);
  return (
    <Box variant="p">
      Then measure. Take the top two or three shapes, one from each family where they differ (a
      pipelined layout against a flat one), and run each for a few hundred steps on the cluster you
      will train on, keeping the one with the best measured tokens per second; the step count is our
      reading of the sources in step 12. For example 2, with CP held at 1, the calculator&apos;s first
      shape is {top.description}, at {range(top)}
      {same
        ? '.'
        : `, and the procedure's TP 8 x DP 4 ranks ${ordinal(flat.place)}, at ${range(flat.best)}${
            rangesOverlap(top, flat.best) ? ': the ranges overlap' : ''
          }.`}{' '}
      Measure those two, with TP 8 x PP 2 x DP 2 at {gb(EX2_TP8_PP2.memory.firstStage.totalBytes)} as
      the margin option. Section 31, Bring-Up: From One Node to the Full Run, runs that bake-off.
    </Box>
  );
}

/* ------------------------------------------------------------------------ */
/* Calculator C                                                             */
/* ------------------------------------------------------------------------ */

type Mode = 'rank' | 'check' | 'moe';
type ModelChoice = DenseModelId | 'custom';
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

const MODEL_OPTIONS: Array<{ id: ModelChoice; label: string }> = [
  { id: 'llama-3.1-8b', label: 'Llama 3.1 8B' },
  { id: 'llama-3.1-70b', label: 'Llama 3.1 70B' },
  { id: 'llama-3.1-405b', label: 'Llama 3.1 405B' },
  { id: 'custom', label: 'Custom Llama-shaped model' },
];

const SHARDING_OPTIONS: Array<{ id: Sharding; label: string }> = [
  { id: 'ddp', label: 'Replicated, as DDP (Distributed Data Parallel)' },
  { id: 'zero1', label: 'ZeRO-1 or the distributed optimizer' },
  { id: 'zero2', label: 'ZeRO-2: plus gradients' },
  { id: 'fsdp', label: 'FSDP: everything, over all DP ranks' },
  { id: 'hsdp', label: 'HSDP: sharded inside each instance' },
];

const RECOMPUTE_OPTIONS: Array<{ id: RecomputeMode; label: string }> = [
  { id: 'none', label: 'None' },
  { id: 'selective', label: 'Selective (attention only)' },
  { id: 'full', label: 'Full, every layer' },
];

const SYNC_ONCE: Array<{ id: GradientSync; label: string }> = [{ id: 'oncePerStep', label: 'Once per step' }];
const SYNC_FSDP: Array<{ id: GradientSync; label: string }> = [
  { id: 'everyMicroBatch', label: 'Every micro-batch (FSDP2 default)' },
  { id: 'deferred', label: 'Deferred to the last micro-batch' },
];

const FLOP_OPTIONS: Array<{ id: 'none' | 'causal'; label: string }> = [
  { id: 'none', label: '6N per token (the worked examples)' },
  { id: 'causal', label: '6N plus causal attention' },
];

const SWIGLU_OPTIONS: Array<{ id: 'fused' | 'eager'; label: string }> = [
  { id: 'fused', label: 'Fused SwiGLU (34 sbh for 8B)' },
  { id: 'eager', label: 'Eager SwiGLU (41 sbh for 8B)' },
];

const GRAD_OPTIONS: Array<{ id: GradientDtype; label: string }> = [
  { id: 'bf16', label: 'BF16 gradients, 16 bytes per parameter' },
  { id: 'fp32', label: 'FP32 main gradients, 18 bytes' },
];

const CP_OPTIONS: Array<{ id: string; label: string }> = ['1', '2', '4', '8'].map((n) => ({
  id: n,
  label: n === '1' ? '1 (no CP)' : `up to ${n}`,
}));

const ZERO_OPTIONS: Array<{ id: string; label: string }> = [
  { id: '1', label: 'ZeRO-1 on both grids' },
  { id: '2', label: 'ZeRO-2 on both grids' },
  { id: '3', label: 'ZeRO-3 on both grids' },
];

interface RanksForm {
  mode: Mode;
  model: ModelChoice;
  layers: string;
  hidden: string;
  ffn: string;
  heads: string;
  kvHeads: string;
  headDim: string;
  vocab: string;
  instance: CalcInstanceId;
  instances: string;
  seq: string;
  batch: string;
  gradientDtype: GradientDtype;
  mfuPct: string;
  flops: 'none' | 'causal';
  swiglu: 'fused' | 'eager';
  maxCp: string;
  headroomPct: string;
  tp: string;
  cp: string;
  pp: string;
  chunks: string;
  sharding: Sharding;
  sync: GradientSync;
  microBatch: string;
  recompute: RecomputeMode;
  zeroStage: string;
}

const BASE_FORM: RanksForm = {
  mode: 'rank',
  model: 'llama-3.1-70b',
  layers: '32',
  hidden: '4096',
  ffn: '14336',
  heads: '32',
  kvHeads: '8',
  headDim: '128',
  vocab: '128256',
  instance: 'p5.48xlarge',
  instances: '32',
  seq: '8192',
  batch: '512',
  gradientDtype: 'bf16',
  mfuPct: '40',
  flops: 'none',
  swiglu: 'fused',
  maxCp: '1',
  headroomPct: '75',
  tp: '8',
  cp: '1',
  pp: '4',
  chunks: '5',
  sharding: 'zero1',
  sync: 'oncePerStep',
  microBatch: '1',
  recompute: 'none',
  zeroStage: '1',
};

const EX2_FORM: RanksForm = { ...BASE_FORM, instance: 'p5en.48xlarge', instances: '4' };

const CALC_PRESETS: Array<{ id: string; label: string; form: RanksForm }> = [
  { id: 'ex1-rank', label: 'Example 1: 70B on 32 p5.48xlarge, rank every layout', form: BASE_FORM },
  { id: 'ex1-a', label: 'Example 1, layout A: TP 8 x PP 4 (v 5) x DP 8, ZeRO-1', form: { ...BASE_FORM, mode: 'check' } },
  {
    id: 'ex1-b',
    label: "Example 1, layout B: TorchTitan's TP 8 x FSDP 32, micro-batch 16, full recomputation",
    form: { ...BASE_FORM, mode: 'check', pp: '1', chunks: '1', sharding: 'fsdp', sync: 'everyMicroBatch', microBatch: '16', recompute: 'full' },
  },
  { id: 'ex2-rank', label: 'Example 2: 70B on 4 p5en.48xlarge, rank every layout', form: EX2_FORM },
  {
    id: 'ex2-tp8',
    label: 'Example 2: TP 8 x DP 4, ZeRO-1, no recomputation',
    form: { ...EX2_FORM, mode: 'check', pp: '1', chunks: '1' },
  },
  {
    id: 'ex2-fsdp',
    label: 'Example 2: flat FSDP 32, full recomputation',
    form: { ...EX2_FORM, mode: 'check', tp: '1', pp: '1', chunks: '1', sharding: 'fsdp', sync: 'everyMicroBatch', recompute: 'full' },
  },
  {
    id: 'ex2-h100',
    label: "Example 2's TP 8 x DP 4 on 4 p5.48xlarge, full recomputation",
    form: { ...EX2_FORM, instance: 'p5.48xlarge', mode: 'check', pp: '1', chunks: '1', recompute: 'full' },
  },
  {
    id: 'bridge',
    label: "Megatron Bridge's 70B recipe on 32 H100: TP 4 x CP 2 x PP 4 (v 5), FP32 gradients",
    form: { ...BASE_FORM, mode: 'check', instances: '4', tp: '4', cp: '2', pp: '4', chunks: '5', gradientDtype: 'fp32' },
  },
  {
    id: 'trn2-8b',
    label: "Llama 3.1 8B on one trn2.48xlarge: TorchTitan Neuron's TP 4 x FSDP 16",
    form: {
      ...BASE_FORM,
      mode: 'check',
      model: 'llama-3.1-8b',
      instance: 'trn2.48xlarge',
      instances: '1',
      batch: '16',
      tp: '4',
      pp: '1',
      chunks: '1',
      sharding: 'fsdp',
      sync: 'everyMicroBatch',
    },
  },
  {
    id: 'moe',
    label: 'DeepSeek-V3 on 256 p5.48xlarge: MoE grids',
    form: { ...BASE_FORM, mode: 'moe', instances: '256' },
  },
];

type FieldKey =
  | 'layers'
  | 'hidden'
  | 'ffn'
  | 'heads'
  | 'kvHeads'
  | 'headDim'
  | 'vocab'
  | 'instances'
  | 'seq'
  | 'batch'
  | 'mfuPct'
  | 'headroomPct'
  | 'tp'
  | 'cp'
  | 'pp'
  | 'chunks'
  | 'microBatch';

type Parsed =
  | { ok: true; kind: 'rank'; input: ParallelismInput }
  | { ok: true; kind: 'check'; input: ParallelismInput; layout: Layout }
  | { ok: true; kind: 'moe'; input: MoeInput }
  | { ok: false; errors: Partial<Record<FieldKey, string>>; message?: string };

type Outcome =
  | { ok: true; kind: 'rank'; result: ParallelismResult; input: ParallelismInput }
  | { ok: true; kind: 'check'; candidate: Candidate; input: ParallelismInput }
  | { ok: true; kind: 'moe'; result: MoeResult }
  | { ok: false; message: string };

const MAX_INSTANCES = 2_048;

function parseWhole(text: string): number | undefined {
  if (!/^\s*\d+\s*$/.test(text)) return undefined;
  const n = Number(text);
  return Number.isSafeInteger(n) && n > 0 ? n : undefined;
}

function buildModel(f: RanksForm, whole: (key: FieldKey, label: string) => number): ModelShape | string {
  if (f.model !== 'custom') return shapeOf(DENSE_MODELS[f.model]);
  const shape = {
    name: 'Custom model',
    layers: whole('layers', 'Layers'),
    hidden: whole('hidden', 'Hidden size'),
    ffn: whole('ffn', 'MLP width'),
    heads: whole('heads', 'Attention heads'),
    kvHeads: whole('kvHeads', 'KV heads'),
    headDim: whole('headDim', 'Head dimension'),
    vocab: whole('vocab', 'Vocabulary'),
  };
  try {
    return customLlamaShape(shape);
  } catch (e) {
    if (e instanceof RangeError) return withoutRegisterIds(e.message);
    throw e;
  }
}

/** Reads the form into Calculator C's input, or names each field that does not parse. */
function parseForm(f: RanksForm): Parsed {
  const errors: Partial<Record<FieldKey, string>> = {};
  const whole = (key: FieldKey, label: string): number => {
    const n = parseWhole(f[key]);
    if (n === undefined) errors[key] = `${label} must be a whole number of 1 or more`;
    return n ?? 1;
  };
  const instanceCount = whole('instances', 'Instance count');
  if (instanceCount > MAX_INSTANCES) errors.instances = `This page's calculator takes up to ${MAX_INSTANCES.toLocaleString('en-US')} instances`;
  const headroom = Number(f.headroomPct);
  if (!Number.isFinite(headroom) || headroom <= 0 || headroom > 100) errors.headroomPct = 'Headroom target must be between 1 and 100%';
  const instance = INSTANCES[f.instance];

  if (f.mode === 'moe') {
    if (Object.keys(errors).length > 0) return { ok: false, errors };
    return {
      ok: true,
      kind: 'moe',
      input: {
        model: moeShapeOf(DEEPSEEK_V3),
        instance,
        instanceCount,
        gradientDtype: f.gradientDtype,
        zeroStage: Number(f.zeroStage) as ZeroStage,
        headroomFraction: headroom / 100,
        limit: 8,
      },
    };
  }

  const model = buildModel(f, whole);
  const sequenceLength = whole('seq', 'Sequence length');
  const sequences = whole('batch', 'Global batch');
  const mfu = Number(f.mfuPct);
  if (!Number.isFinite(mfu) || mfu <= 0 || mfu > 100) errors.mfuPct = 'MFU must be between 1 and 100%';
  if (typeof model === 'string') return { ok: false, errors, message: model };
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  const input: ParallelismInput = {
    model,
    instance,
    instanceCount,
    sequenceLength,
    globalBatch: { sequences },
    headroomFraction: headroom / 100,
    gradientDtype: f.gradientDtype,
    mfu: mfu / 100,
    attention: f.flops,
    activations: { swiglu: f.swiglu },
    maxContextParallel: Number(f.maxCp),
    limit: ALL,
  };
  if (f.mode === 'rank') return { ok: true, kind: 'rank', input };

  const tp = whole('tp', 'TP degree');
  const cp = whole('cp', 'CP degree');
  const pp = whole('pp', 'Pipeline stages');
  const chunks = whole('chunks', 'Chunks per stage');
  const microBatch = whole('microBatch', 'Micro-batch');
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  const world = rankFacts(instance).ranksPerInstance * instanceCount;
  const modelRanks = tp * cp * pp;
  if (world % modelRanks !== 0) {
    errors.tp = `TP x CP x PP = ${modelRanks} must divide the ${world.toLocaleString('en-US')} ranks`;
    return { ok: false, errors };
  }
  const layout: Layout = {
    tp,
    cp,
    pp,
    dp: world / modelRanks,
    interleavedChunks: chunks,
    sharding: f.sharding,
    microBatch,
    recompute: f.recompute,
    gradientSync: f.sync,
  };
  return { ok: true, kind: 'check', input, layout };
}

/** Runs Calculator C; a RangeError names the field that the combination breaks. */
function runCalculator(p: Parsed): Outcome | undefined {
  if (!p.ok) return p.message ? { ok: false, message: p.message } : undefined;
  try {
    if (p.kind === 'rank') return { ok: true, kind: 'rank', result: sizeParallelism(p.input), input: p.input };
    if (p.kind === 'check') return { ok: true, kind: 'check', candidate: evaluateLayout(p.input, p.layout), input: p.input };
    return { ok: true, kind: 'moe', result: sizeMoeGrids(p.input) };
  } catch (e) {
    if (e instanceof RangeError) return { ok: false, message: withoutRegisterIds(e.message) };
    throw e;
  }
}

function selectOf<T extends string>(
  options: Array<{ id: T; label: string }>,
  value: T,
): { options: SelectProps.Option[]; selected: SelectProps.Option } {
  const opts = options.map((o) => ({ value: o.id, label: o.label }));
  return { options: opts, selected: opts.find((o) => o.value === value) ?? opts[0] };
}

function isTrainium(input: ParallelismInput | MoeInput): boolean {
  return input.instance.id.startsWith('trn');
}

function FlagLine({ flag }: { flag: string }) {
  if (flag === UNEVEN_STAGES_FLAG) {
    return (
      <StatusIndicator type="info">
        Uneven stages: Megatron Core needs <code>--decoder-first/last-pipeline-num-layers</code> or{' '}
        <code>--pipeline-model-parallel-layout</code>; TorchTitan&apos;s default already splits this way
      </StatusIndicator>
    );
  }
  return <StatusIndicator type="warning">{withoutRegisterIds(flag)}</StatusIndicator>;
}

function statusOf(c: Candidate): ReactNode {
  const m = c.memory;
  const target = Math.round(m.headroomFraction * 100);
  const status =
    c.status === 'doesNotFit' ? (
      <StatusIndicator type="error">Does not fit: {gb(-m.freeBytes)} over capacity</StatusIndicator>
    ) : c.status === 'fitsAboveHeadroom' ? (
      <StatusIndicator type="warning">
        Above the {target}% target, {gb(m.freeBytes)} left
      </StatusIndicator>
    ) : (
      <StatusIndicator type="success">
        Under the {target}% target, {gb(m.freeBytes)} left
      </StatusIndicator>
    );
  return (
    <SpaceBetween size="xxs">
      {status}
      <Box variant="small" color="text-body-secondary">
        Estimate; confirm with a measured step.
      </Box>
    </SpaceBetween>
  );
}

function linkText(l: LinkLoad, trainium: boolean): string {
  const where = l.link === 'EFA' ? 'EFA' : trainium ? 'NeuronLink' : 'NVLink';
  const basis = l.basis === 'per instance' ? 'per instance' : trainium ? 'per rank' : 'per GPU';
  return `${l.dimension} on ${where}, ${l.what}: ${gb(l.bytesPerStep)} ${basis} per step, ${sec(l.seconds, 2)}, ${pct(
    l.shareOfCompute,
  )} of compute`;
}

function CandidateDetail({ c, trainium }: { c: Candidate; trainium: boolean }) {
  const m = c.memory;
  const pipelined = c.layout.pp > 1;
  const stage = m.peakStage === 'first' ? m.firstStage : m.lastStage;
  const stageName = !pipelined ? '' : m.peakStage === 'first' ? ' on the first stage' : ' on the last stage';
  const interleavedFew = c.layout.interleavedChunks > 1 && c.microBatchesPerStep < 2 * c.layout.pp;
  const rank = trainium ? 'rank' : 'GPU';
  return (
    <SpaceBetween size="xs">
      {statusOf(c)}
      <KeyValuePairs
        columns={3}
        items={[
          { label: `Memory per ${rank}${stageName}`, value: `${gb(m.totalBytes)} of ${gb(m.capacity.bytes)}` },
          {
            label: 'Of which',
            value: `model state ${gb(m.modelState.totalBytes)}, activations ${gb(stage.activationBytes)}, logits ${
              stage.logitBytes > 0 ? gb(stage.logitBytes) : 'none on this stage'
            }`,
          },
          { label: 'Step estimate', value: range(c) },
          { label: 'Micro-batches per step m', value: c.microBatchesPerStep.toLocaleString('en-US') },
          { label: 'Bubble (p - 1) / (v x m)', value: pipelined ? pct(c.bubbleFraction, 2) : 'none, no pipeline' },
          {
            label: 'Compute x recomputation factor',
            value: `${sec(c.computeSeconds)} x ${c.recomputeFactor.toFixed(2)}`,
          },
        ]}
      />
      {c.links.length > 0 ? (
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {c.links.map((l) => (
            <li key={`${l.dimension}-${l.what}`}>{linkText(l, trainium)}</li>
          ))}
        </ul>
      ) : (
        <Box variant="small">No collective traffic: one rank holds the whole model.</Box>
      )}
      {c.flags.map((f) => (
        <FlagLine key={f} flag={f} />
      ))}
      {interleavedFew ? (
        <StatusIndicator type="info">
          Interleaved with fewer than 2p micro-batches: the first-stage activation figure is the upper value
        </StatusIndicator>
      ) : null}
    </SpaceBetween>
  );
}

function RankOutcome({ result, input }: { result: ParallelismResult; input: ParallelismInput }) {
  const trainium = isTrainium(input);
  const shapes = bestPerShape(result.survivors);
  const above = bestPerShape(result.aboveHeadroom);
  const top = shapes.slice(0, 3);
  const rest = shapes.slice(3, 10);
  const tied = top.length > 1 && top.slice(1).every((c) => rangesOverlap(top[0], c));
  return (
    <SpaceBetween size="m">
      <KeyValuePairs
        columns={3}
        items={[
          { label: 'World size', value: `${result.worldSize.toLocaleString('en-US')} ranks` },
          {
            label: 'Global batch',
            value: `${result.sequencesPerStep.toLocaleString('en-US')} sequences, ${result.tokensPerStep.toLocaleString('en-US')} tokens`,
          },
          { label: `Compute per step at ${Math.round(result.mfu * 100)}% MFU`, value: sec(result.computeSeconds) },
          {
            label: 'Layouts evaluated',
            value: `${result.counts.evaluated.toLocaleString('en-US')}: ${result.counts.survivors.toLocaleString(
              'en-US',
            )} within the target, ${result.counts.aboveHeadroom.toLocaleString('en-US')} above it, ${result.counts.doesNotFit.toLocaleString(
              'en-US',
            )} do not fit`,
          },
          { label: 'Shapes within the target', value: `${shapes.length.toLocaleString('en-US')}` },
        ]}
      />
      {top.length === 0 ? (
        <SpaceBetween size="s">
          <Box color="text-status-error">
            No layout fits under the headroom target. Add instances, pick an instance with more memory
            per rank, or shorten the sequence.
          </Box>
          {above.slice(0, 3).map((c) => (
            <SpaceBetween key={c.description} size="xs">
              <Box variant="h4">Above the target: {c.description}</Box>
              <CandidateDetail c={c} trainium={trainium} />
            </SpaceBetween>
          ))}
        </SpaceBetween>
      ) : (
        <SpaceBetween size="m">
          {top.map((c, i) => (
            <SpaceBetween key={c.description} size="xs">
              <Box variant="h4">
                {i + 1}. {c.description}
              </Box>
              <CandidateDetail c={c} trainium={trainium} />
            </SpaceBetween>
          ))}
          {tied ? (
            <StatusIndicator type="info">
              The first {top.length} ranges overlap: on paper they tie, and a measured run decides
            </StatusIndicator>
          ) : null}
          {rest.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={headCell}>#</th>
                    <th style={headCell}>Best variant of the next shapes</th>
                    <th style={headCell}>GB per {trainium ? 'rank' : 'GPU'}</th>
                    <th style={headCell}>Step, s</th>
                  </tr>
                </thead>
                <tbody>
                  {rest.map((c, i) => (
                    <tr key={c.description}>
                      <td style={cell}>{i + 4}</td>
                      <td style={cell}>{c.description}</td>
                      <td style={cell}>{(c.memory.totalBytes / GB).toFixed(1)}</td>
                      <td style={cell}>
                        {c.stepSeconds.low.toFixed(1)} to {c.stepSeconds.high.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </SpaceBetween>
      )}
      <Box variant="small" color="text-body-secondary">
        Ranked by the midpoint of each range; within a shape the calculator keeps the best variant
        (sharding, micro-batch, recomputation, sync mode). GB is 10^9 bytes; where AWS and NVIDIA print
        different units the calculator takes the smaller figure. Gathered FSDP layers, buffers and
        fragmentation are left to the headroom.
      </Box>
    </SpaceBetween>
  );
}

function MoeOutcome({ result, input }: { result: MoeResult; input: MoeInput }) {
  const trainium = isTrainium(input);
  const first = result.candidates[0];
  return (
    <SpaceBetween size="m">
      <KeyValuePairs
        columns={3}
        items={[
          { label: 'Grid pairs evaluated', value: result.counts.evaluated.toLocaleString('en-US') },
          { label: 'Pass both world-size checks', value: result.counts.valid.toLocaleString('en-US') },
          { label: 'Model state within the target', value: result.counts.withinHeadroom.toLocaleString('en-US') },
        ]}
      />
      {first ? (
        <SpaceBetween size="s">
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headCell}>Candidate grid to test</th>
                  <th style={headCell}>State per {trainium ? 'rank' : 'GPU'}, GB</th>
                  <th style={headCell}>EP crosses instances</th>
                </tr>
              </thead>
              <tbody>
                {result.candidates.map((c) => (
                  <tr key={c.description}>
                    <td style={cell}>{c.description.replace('candidate grid to test: ', '')}</td>
                    <td style={cell}>{c.modelState.totalGB.toFixed(1)}</td>
                    <td style={cell}>{c.expertTraffic.epSpansInstances ? 'yes' : 'no'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <KeyValuePairs
            columns={3}
            items={[
              {
                label: 'Expert traffic per token per MoE layer',
                value: `${first.expertTraffic.dispatchBytesPerTokenPerMoeLayer.toLocaleString('en-US')} bytes dispatch (FP8), ${first.expertTraffic.combineBytesPerTokenPerMoeLayer.toLocaleString(
                  'en-US',
                )} bytes combine (BF16)`,
              },
              {
                label: 'Across all MoE layers, forward',
                value: `${(first.expertTraffic.bytesPerTokenAllMoeLayers / 1e6).toFixed(2)} MB per token`,
              },
              { label: 'Activation memory', value: first.activations },
            ]}
          />
        </SpaceBetween>
      ) : (
        <Box color="text-status-error">No grid holds the model state under the headroom target on this cluster.</Box>
      )}
      <Box variant="small" color="text-body-secondary">
        Ordered for reading, not by an estimate: expert parallelism inside one instance first, then
        fewer stages, then less state. Candidate grids to test; activation memory is not modelled;
        measure a step.
      </Box>
    </SpaceBetween>
  );
}

function CalculatorOutcome({ outcome, parsed }: { outcome: Outcome | undefined; parsed: Parsed }) {
  if (!outcome) return <Box color="text-status-error">Correct the highlighted fields to see the layouts.</Box>;
  if (!outcome.ok) return <Box color="text-status-error">This combination is not valid: {outcome.message}.</Box>;
  if (outcome.kind === 'rank') return <RankOutcome result={outcome.result} input={outcome.input} />;
  if (outcome.kind === 'check') {
    return (
      <SpaceBetween size="xs">
        <Box variant="h4">{outcome.candidate.description}</Box>
        <CandidateDetail c={outcome.candidate} trainium={isTrainium(outcome.input)} />
      </SpaceBetween>
    );
  }
  return parsed.ok && parsed.kind === 'moe' ? <MoeOutcome result={outcome.result} input={parsed.input} /> : null;
}

function RanksCalculator() {
  const [presetId, setPresetId] = useState(CALC_PRESETS[0].id);
  const [form, setForm] = useState<RanksForm>(CALC_PRESETS[0].form);
  const set = <K extends keyof RanksForm>(key: K, value: RanksForm[K]) => setForm((f) => ({ ...f, [key]: value }));

  const parsed = useMemo(() => parseForm(form), [form]);
  const outcome = useMemo(() => runCalculator(parsed), [parsed]);
  const err = (key: FieldKey) => (parsed.ok ? undefined : parsed.errors[key]);

  const presetSel = selectOf(
    CALC_PRESETS.map((p) => ({ id: p.id, label: p.label })),
    presetId,
  );
  const modelSel = selectOf(MODEL_OPTIONS, form.model);
  const instSel = selectOf(CALC_INSTANCES, form.instance);
  const gradSel = selectOf(GRAD_OPTIONS, form.gradientDtype);
  const flopSel = selectOf(FLOP_OPTIONS, form.flops);
  const swiSel = selectOf(SWIGLU_OPTIONS, form.swiglu);
  const cpSel = selectOf(CP_OPTIONS, form.maxCp);
  const shardSel = selectOf(SHARDING_OPTIONS, form.sharding);
  const fsdpLike = form.sharding === 'fsdp' || form.sharding === 'hsdp';
  const syncSel = selectOf(fsdpLike ? SYNC_FSDP : SYNC_ONCE, form.sync);
  const recSel = selectOf(RECOMPUTE_OPTIONS, form.recompute);
  const zeroSel = selectOf(ZERO_OPTIONS, form.zeroStage);

  const numberField = (key: FieldKey, label: string, description?: ReactNode) => (
    <FormField label={label} description={description} errorText={err(key)}>
      <Input type="number" inputMode="numeric" value={form[key]} onChange={({ detail }) => set(key, detail.value)} />
    </FormField>
  );

  return (
    <SpaceBetween size="m">
      <FormField label="Start from a worked case" description="Sets every input below; change any of them afterwards.">
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
      <FormField label="What to run">
        <SegmentedControl
          selectedId={form.mode}
          onChange={({ detail }) => set('mode', detail.selectedId as Mode)}
          options={[
            { id: 'rank', text: 'Rank layouts' },
            { id: 'check', text: 'Check one layout' },
            { id: 'moe', text: 'MoE grids' },
          ]}
        />
      </FormField>

      <ColumnLayout columns={3}>
        {form.mode === 'moe' ? (
          <FormField label="Model" description="The MoE mode's preset">
            <Input value="DeepSeek-V3" disabled />
          </FormField>
        ) : (
          <FormField label="Model">
            <Select
              selectedOption={modelSel.selected}
              options={modelSel.options}
              onChange={({ detail }) => set('model', detail.selectedOption.value as ModelChoice)}
            />
          </FormField>
        )}
        <FormField label="Instance">
          <Select
            selectedOption={instSel.selected}
            options={instSel.options}
            onChange={({ detail }) => set('instance', detail.selectedOption.value as CalcInstanceId)}
          />
        </FormField>
        {numberField('instances', 'Instance count', `Up to ${MAX_INSTANCES.toLocaleString('en-US')} on this page`)}
        {form.mode !== 'moe' ? numberField('seq', 'Sequence length s', 'Tokens per sequence') : null}
        {form.mode !== 'moe' ? numberField('batch', 'Global batch B', 'Sequences per optimizer step') : null}
        <FormField label="Gradient dtype">
          <Select
            selectedOption={gradSel.selected}
            options={gradSel.options}
            onChange={({ detail }) => set('gradientDtype', detail.selectedOption.value as GradientDtype)}
          />
        </FormField>
        {form.mode !== 'moe' ? numberField('mfuPct', 'MFU, %', 'An assumption: estimate; confirm with a measured step') : null}
        {form.mode !== 'moe' ? (
          <FormField label="FLOP count">
            <Select
              selectedOption={flopSel.selected}
              options={flopSel.options}
              onChange={({ detail }) => set('flops', detail.selectedOption.value as 'none' | 'causal')}
            />
          </FormField>
        ) : null}
        {form.mode !== 'moe' ? (
          <FormField label="SwiGLU implementation" description="Measured in our E1 run">
            <Select
              selectedOption={swiSel.selected}
              options={swiSel.options}
              onChange={({ detail }) => set('swiglu', detail.selectedOption.value as 'fused' | 'eager')}
            />
          </FormField>
        ) : null}
        {form.mode === 'rank' ? (
          <FormField label="Largest CP degree to try" description="Step 6: raise it only when nothing fits without CP">
            <Select
              selectedOption={cpSel.selected}
              options={cpSel.options}
              onChange={({ detail }) => set('maxCp', detail.selectedOption.value ?? '8')}
            />
          </FormField>
        ) : null}
        {form.mode === 'moe' ? (
          <FormField label="Sharding of model state">
            <Select
              selectedOption={zeroSel.selected}
              options={zeroSel.options}
              onChange={({ detail }) => set('zeroStage', detail.selectedOption.value ?? '1')}
            />
          </FormField>
        ) : null}
        {numberField('headroomPct', 'Headroom target, % of memory', 'An assumption: estimate; confirm with a measured step')}
      </ColumnLayout>

      {form.mode !== 'moe' && form.model === 'custom' ? (
        <ColumnLayout columns={4}>
          {numberField('layers', 'Layers L')}
          {numberField('hidden', 'Hidden size h')}
          {numberField('ffn', 'MLP width')}
          {numberField('heads', 'Attention heads')}
          {numberField('kvHeads', 'KV heads')}
          {numberField('headDim', 'Head dimension')}
          {numberField('vocab', 'Vocabulary V')}
        </ColumnLayout>
      ) : null}

      {form.mode === 'check' ? (
        <ColumnLayout columns={3}>
          {numberField('tp', 'TP degree t', 'Within one instance')}
          {numberField('cp', 'CP degree')}
          {numberField('pp', 'Pipeline stages p')}
          {numberField('chunks', 'Interleaved chunks per stage v', '1 for plain 1F1B')}
          <FormField label="DP degree" description="The ranks left over: world size / (TP x CP x PP)">
            <Input value={parsed.ok && parsed.kind === 'check' ? String(parsed.layout.dp) : ''} disabled />
          </FormField>
          {numberField('microBatch', 'Micro-batch b', 'Sequences per forward and backward pass')}
          <FormField label="Sharding of model state">
            <Select
              selectedOption={shardSel.selected}
              options={shardSel.options}
              onChange={({ detail }) => {
                const sharding = detail.selectedOption.value as Sharding;
                const fsdp = sharding === 'fsdp' || sharding === 'hsdp';
                setForm((f) => ({ ...f, sharding, sync: fsdp ? (f.sync === 'oncePerStep' ? 'everyMicroBatch' : f.sync) : 'oncePerStep' }));
              }}
            />
          </FormField>
          <FormField label="Gradient sync">
            <Select
              selectedOption={syncSel.selected}
              options={syncSel.options}
              onChange={({ detail }) => set('sync', detail.selectedOption.value as GradientSync)}
            />
          </FormField>
          <FormField label="Recomputation">
            <Select
              selectedOption={recSel.selected}
              options={recSel.options}
              onChange={({ detail }) => set('recompute', detail.selectedOption.value as RecomputeMode)}
            />
          </FormField>
        </ColumnLayout>
      ) : null}

      <Box variant="h3">Result</Box>
      <CalculatorOutcome outcome={outcome} parsed={parsed} />
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function SetMyRanks() {
  const exA_dp = linkOf(EX1_A, 'DP');
  const exA_tp = linkOf(EX1_A, 'TP');
  const exB_fsdp = linkOf(EX1_B, 'FSDP');
  const exB_mb1 = linkOf(EX1_B_MB1, 'FSDP');
  const exB_def = linkOf(EX1_B_MB1_DEFERRED, 'FSDP');
  const ex2_tp_dp = linkOf(EX2_TP8, 'DP');
  const ex2_tp_tp = linkOf(EX2_TP8, 'TP');
  const ranksPerP5 = P5_FACTS.ranksPerInstance;

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Turn a model, a cluster, a memory target and a global batch into two or three layouts worth measuring: for Llama 3.1 70B on four p5en.48xlarge the obvious data-parallel layouts fail the memory check or fit only by recomputing, and eight-way tensor parallelism with four data-parallel replicas fits at 85 GB per GPU with no pipeline and no recomputation (Megatron Core core_v0.20.0, TorchTitan v0.4.0, PyTorch v2.15.0, DeepSpeed v0.19.9 and NeMo v2.7.3, read 2026-10-31, and our DGX Spark runs)"
          >
            14. Set My Ranks: The Sizing Procedure
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Setting the ranks means choosing how many ways to split a training job along each
            dimension. TP (tensor parallelism) splits every layer&apos;s matrices across GPUs, with SP
            (sequence parallelism) splitting what TP leaves whole; PP (pipeline parallelism) gives each
            group of GPUs a block of consecutive layers; CP (context parallelism) splits each sequence;
            DP (data parallelism) gives each copy of the model its own slice of the batch. The degrees
            multiply to the world size, the number of ranks (training processes, one per GPU) in the
            job, so every choice constrains the others. Together they set the memory each GPU needs,
            the time it waits and the bytes on each link, and they are chosen before the first step
            runs.
          </Box>
          <Box variant="p">
            The procedure runs in two passes. The first adds dimensions until one copy of the model and
            its activations fits, in the order that costs the least communication: shard the model
            state, then split layers inside an instance, then split the depth. The second puts every
            candidate through the same checks (divisibility, the bubble, bytes per link) and keeps two
            or three to measure. Formulas choose the candidates; a measured run chooses the winner.
          </Box>
          <Box variant="p">
            Two worked examples carry it. Llama 3.1 70B on 32 p5.48xlarge is a case where the first
            choices work. The same model on four p5en.48xlarge is one where they fail, and the layout
            that fits, TP 8 x DP 4 at {gb(EX2_TP8.memory.totalBytes)} per GPU with no pipeline and no
            recomputation, depends on the H200&apos;s memory. Calculator C at the end runs the same
            checks on your model and cluster.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Follow one ordered list from the inputs to two or three candidate layouts, with each step's check and the section that derives it"
          >
            The procedure in twelve steps
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ProcedureFlow />
          <Box variant="p">
            No single source states all twelve steps. The list below assembles them from the published
            procedures and guides, and where a step&apos;s position is our reading of these sources it
            says so.
          </Box>
          <ol style={{ margin: 0, paddingLeft: 24 }}>
            <li>
              <Box variant="p">
                <strong>Gather the inputs.</strong> The model&apos;s shape (layers, hidden size, attention
                heads and KV (key and value) heads), the instance type and count, the sequence length,
                the global batch (the sequences in one optimizer step), and a memory headroom target.
                The dive&apos;s default target is 75% of HBM (high-bandwidth memory), our assumption: no
                source read in this research states one. Sections 3 to 5 define these inputs, and
                section 21 lists each instance&apos;s memory.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <strong>Check the model state against memory.</strong> Mixed-precision Adam keeps 16
                bytes per parameter: 2 each for the 16-bit weights and gradients and 12 for the FP32
                (32-bit floating point) master weights and two moments{' '}
                <Cite tier={3} href={ZERO} venue="preprint" accessed={REGISTER_DATE}>
                  ZeRO, Section 3.1
                </Cite>
                , or 18 with Megatron&apos;s FP32 main gradients{' '}
                <Cite tier={1} href={MG_DIST_OPT}>
                  Megatron Core dist_optimizer.md L14-L20
                </Cite>
                . The ZeRO paper&apos;s 16-bit format is FP16; BF16 (bfloat16) is the same size. For
                Llama 3.1 70B, with 70,553,706,496 parameters{' '}
                <Cite tier={1} href={HF_70B} accessed={REGISTER_DATE}>
                  Hugging Face model metadata, Llama 3.1 70B
                </Cite>
                , that is {gb(EX1_REPLICATED.memory.modelState.totalBytes)} before a single activation,
                more than 14 times an 80 GB H100 (section 5, The Memory Budget).
              </Box>
            </li>
            <li>
              <Box variant="p">
                <strong>Shard the model state over DP before adding model parallelism</strong> (TP and
                PP, the dimensions that split the model itself). Sharding splits the state across ranks
                instead of copying it, and at one micro-batch per step its first two stages keep data
                parallelism&apos;s communication volume while the third adds about half again: &quot;same communication
                volume as DP&quot; for ZeRO (Zero Redundancy Optimizer) stages 1 and 2, &quot;a modest
                50% increase&quot; for stage 3{' '}
                <Cite tier={3} href={ZERO} venue="preprint" accessed={REGISTER_DATE}>
                  ZeRO, Section 1
                </Cite>
                . So the order is Megatron&apos;s distributed optimizer (its ZeRO-1) or ZeRO-1 first, then
                ZeRO-2, then FSDP (Fully Sharded Data Parallel, which shards weights too), and HSDP
                (hybrid sharded data parallel) when the bytes between instances dominate (section 8, Data
                Parallelism &amp; Sharding). Megatron Core&apos;s guide begins with data parallelism only
                and adds TP &quot;if the model does not fit&quot;{' '}
                <Cite tier={1} href={mg(MG_GUIDE, 'L237-L241')}>
                  Megatron Core parallelism guide L237-L241
                </Cite>
                , and TorchTitan&apos;s authors call FSDP &quot;often sufficient as the first degree of
                parallelism when communication is faster than computation (e.g., up to 512 GPUs)&quot;{' '}
                <Cite tier={3} href={TT_PAPER} venue="preprint" accessed={REGISTER_DATE}>
                  TorchTitan paper, Section 3.3.1
                </Cite>
                . Putting this step before TP is our reading of these sources.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <strong>Add TP up to the size of one instance, with SP.</strong> TP&apos;s all-reduces
                run on every layer, so it belongs on the fastest link: &quot;tensor model parallelism
                should generally be used up to degree g when using g-GPU servers&quot;{' '}
                <Cite tier={3} href={PTDP} venue="SC 2021" accessed={REGISTER_DATE}>
                  PTD-P paper, Section 3.2, Takeaway #1
                </Cite>
                , PTD-P being Megatron&apos;s pipeline, tensor and data parallelism. Megatron Core&apos;s
                guide says of SP: &quot;Always enable when using TP&quot;{' '}
                <Cite tier={1} href={mg(MG_GUIDE, 'L225-L230')}>
                  Megatron Core parallelism guide L225-L230
                </Cite>
                . Section 9, Tensor &amp; Sequence Parallelism, prices it.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <strong>Add the smallest PP that fits.</strong> Uneven first and last stages are allowed:
                Megatron Core takes <code>--decoder-first-pipeline-num-layers</code> and{' '}
                <code>--decoder-last-pipeline-num-layers</code>{' '}
                <Cite tier={1} href={MG_UNEVEN_FLAGS} kind="code">
                  Megatron-LM arguments.py L3041-L3056
                </Cite>{' '}
                or its <code>--account-for-*</code> flags{' '}
                <Cite tier={1} href={MG_ACCOUNT_FOR} kind="code">
                  Megatron Core transformer_config.py L151-L157
                </Cite>
                , TorchTitan&apos;s default split gives the first and last stages fewer layers{' '}
                <Cite tier={1} href={TT_LESS_LAYERS} kind="code">
                  TorchTitan parallelism.py L95-L105
                </Cite>
                , and DeepSpeed balances stages by parameter count by default{' '}
                <Cite tier={1} href={DS_PARTITION_DEFAULT} kind="code">
                  DeepSpeed pipe/module.py L116-L133
                </Cite>
                . Section 10, Pipeline Parallelism &amp; the Bubble, has the schedule.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <strong>Add CP only when activations still do not fit.</strong> Megatron Core&apos;s guide
                lists CP for long sequences, &quot;8K+ Tokens&quot;{' '}
                <Cite tier={1} href={mg(MG_GUIDE, 'L31')}>
                  Megatron Core parallelism guide L31
                </Cite>
                ; section 11, Long Sequences: Context Parallelism, sizes it.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <strong>Set the expert grid separately for MoE (mixture of experts) models.</strong> The
                expert layers run on their own grid, ETP (expert tensor parallelism) x EP (expert
                parallelism) x EDP (expert data parallelism) x PP, which shares only the pipeline with
                the attention layers{' '}
                <Cite tier={1} href={mg(MG_MOE_README, 'L332-L336')}>
                  Megatron Core MoE guide L332-L336
                </Cite>{' '}
                <Cite tier={3} href={FOLDING} venue="preprint" accessed={REGISTER_DATE}>
                  MoE Parallel Folding, Section 3.2
                </Cite>
                . Section 12, Mixture of Experts: Expert Parallelism, covers it.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <strong>Check divisibility.</strong> TP x CP x PP x DP must equal the world size for the
                dense layers{' '}
                <Cite tier={1} href={MG_DENSE_WORLD} kind="code">
                  Megatron-LM arguments.py L468-L495
                </Cite>
                , and ETP x EP x EDP x PP for the expert layers{' '}
                <Cite tier={1} href={MG_EXPERT_WORLD} kind="code">
                  Megatron Core parallel_state.py L946-L960
                </Cite>
                . Each degree must divide what it splits: the attention heads by TP, with the KV heads a
                multiple or a divisor of it{' '}
                <Cite tier={1} href={MG_HEADS_CHECK} kind="code">
                  Megatron Core transformer_config.py L1746-L1773
                </Cite>
                , the layers by PP (with the uneven-stage exception), and the global batch by micro-batch
                x DP{' '}
                <Cite tier={1} href={MG_NUM_MICROBATCHES} kind="code">
                  Megatron Core num_microbatches_calculator.py L381-L388
                </Cite>
                .
              </Box>
            </li>
            <li>
              <Box variant="p">
                <strong>Check the bubble</strong>, the idle time at the start and end of a pipelined
                step: <code>(p - 1) / (v x m)</code> of the compute under the interleaved 1F1B (one
                forward, one backward) schedule, with p stages, v interleaved chunks per stage and m
                micro-batches per step{' '}
                <Cite tier={3} href={PTDP} venue="SC 2021" accessed={REGISTER_DATE}>
                  PTD-P paper, Section 2.2.2
                </Cite>
                . DP divides the batch, so more DP means fewer micro-batches and a larger bubble (section
                10).
              </Box>
            </li>
            <li>
              <Box variant="p">
                <strong>Check bytes per link against compute.</strong> Each dimension&apos;s collective
                moves a known number of bytes per step; divide by the link&apos;s bandwidth and compare
                with the step&apos;s compute. Traffic inside an instance is counted per GPU over NVLink
                at 450 GB/s, our reading of NVIDIA&apos;s 900 GB/s as both directions together{' '}
                <Cite tier={1} href={NVLINK_PAGE} kind="vendor-claim" accessed={REGISTER_DATE}>
                  NVIDIA NVLink page
                </Cite>
                ; traffic between instances is counted per instance over its whole EFA (Elastic Fabric
                Adapter) bandwidth, 400 GB/s on p5.48xlarge and p5en.48xlarge{' '}
                <Cite tier={1} href={EC2_AC} accessed={REGISTER_DATE}>
                  EC2 accelerated computing instance specifications
                </Cite>
                . That per-instance count is our reading of how NCCL (NVIDIA Collective Communications
                Library) spreads a collective&apos;s crossing over an instance&apos;s network cards
                (section 7), supported by a sample AWS publishes in which 16 GiB all-reduced across two
                p5.48xlarge in 66 ms{' '}
                <Cite tier={2} href={ADT_P5_SAMPLE} kind="vendor-claim">
                  awsome-distributed-training nccl-tests README L206-L243
                </Cite>
                . Sections 7 to 9 give each dimension&apos;s bytes.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <strong>Nest the dimensions innermost-fastest.</strong> The dimension that talks most
                often gets the closest ranks: Llama 3 orders its ranks [TP, CP, PP, DP], TP innermost{' '}
                <Cite tier={3} href={LLAMA3} venue="preprint" accessed={REGISTER_DATE}>
                  The Llama 3 Herd of Models, Section 3.3.2
                </Cite>
                . Section 13, Composing the Dimensions, maps ranks to instances.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <strong>Measure the survivors for a few hundred steps</strong> and keep the one with the
                best measured throughput. The step count is our reading of these sources: NeMo&apos;s
                Auto Configurator ranked its candidates by measured throughput from short runs{' '}
                <Cite tier={1} href={NEMO_AUTOCONF_README} accessed={REGISTER_DATE}>
                  NeMo v2.7.3 Auto Configurator README
                </Cite>
                , and the Ultra-Scale Playbook found the winner changed as its authors optimised each
                implementation{' '}
                <Cite tier={3} href={PLAYBOOK} accessed={REGISTER_DATE}>
                  The Ultra-Scale Playbook
                </Cite>
                . Section 31, Bring-Up: From One Node to the Full Run, runs the measurement.
              </Box>
            </li>
          </ol>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Use each published planner for what it searches, and expect them to disagree on the starting point, which is why every procedure here ends in a measured sweep"
          >
            What the published tools and guides do
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The published planners differ in what they search, and they disagree on where to start. For an 8B model at 8,192 tokens, NeMo&apos;s heuristics
            start at TP 2 or 4{' '}
            <Cite tier={1} href={NEMO_HEURISTIC} kind="code" accessed={REGISTER_DATE}>
              NeMo v2.7.3 training_config.py L364-L398
            </Cite>
            , TorchTitan published FSDP 8 on one node for Llama 3.1 8B, at a sequence length its
            table does not state{' '}
            <Cite tier={1} href={TT_BENCH}>
              TorchTitan Llama 3 H100 benchmarks
            </Cite>
            , and Megatron Core&apos;s guide lists CP 2 on 8 GPUs for Llama 3 8B{' '}
            <Cite tier={1} href={mg(MG_GUIDE, 'L155-L158')}>
              Megatron Core parallelism guide L155-L158
            </Cite>
            . Three reasonable starting points, three different layouts: each tool picks candidates,
            and the measured run picks among them. Section 8 works the 8B case through.
          </Box>
          <ExpandableSection headerText="What each tool searches">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>NeMo 2.x Auto Configurator.</strong> It generated a grid of TP, PP, CP, EP,
                micro-batch and activation-checkpointing candidates from model-size and sequence-length
                heuristics, filtered them by divisibility, then ran short jobs and ranked the measured
                throughput; its README warns that &quot;Some of the candidate configurations may not work
                due to high-memory usage&quot;{' '}
                <Cite tier={1} href={NEMO_AUTOCONF_README} accessed={REGISTER_DATE}>
                  NeMo v2.7.3 Auto Configurator README
                </Cite>
                . The README says it searches &quot;four critical hyperparameters&quot; and then lists
                six; the code&apos;s grid loops over TP, PP, CP, EP and micro-batch, and the code is the
                authority{' '}
                <Cite tier={1} href={NEMO_GRID} kind="code" accessed={REGISTER_DATE}>
                  NeMo v2.7.3 training_config.py L72-L77
                </Cite>
                . It was not located in NVIDIA&apos;s current NeMo repositories during this research: the
                NVIDIA/NeMo repository focuses on audio, speech and multimodal LLMs at v3.0.0{' '}
                <Cite tier={1} href={NEMO_3_README} accessed={REGISTER_DATE}>
                  NeMo v3.0.0 README
                </Cite>
                , and Megatron Bridge v0.7.0 does not carry it{' '}
                <Cite tier={1} href={BRIDGE_TREE} kind="code" accessed={REGISTER_DATE}>
                  Megatron Bridge source tree at v0.7.0
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>DeepSpeed&apos;s autotuner.</strong> It tunes the ZeRO stage, the micro-batch
                size and other ZeRO settings{' '}
                <Cite tier={1} href={DS_AUTOTUNER} accessed={REGISTER_DATE}>
                  DeepSpeed autotuning README L79-L97
                </Cite>
                , and takes the model-parallel degree as a fixed input, <code>mp_size</code>{' '}
                <Cite tier={1} href={DS_AUTOTUNER_MP} accessed={REGISTER_DATE}>
                  DeepSpeed autotuning README L317-L319
                </Cite>
                . It answers step 3 for a TP and PP you have already chosen.
              </Box>
              <Box variant="p">
                <strong>The Ultra-Scale Playbook.</strong> Hugging Face&apos;s guide gives three steps:
                fit one model instance in memory, reach the target global batch, then optimise
                throughput. Its sweep of several thousand configurations on 1 to 64 nodes of 8 H100
                found that whether TP or PP was faster depended on implementation: &quot;After optimizing
                our PP code, it became the faster option&quot;{' '}
                <Cite tier={3} href={PLAYBOOK} accessed={REGISTER_DATE}>
                  The Ultra-Scale Playbook
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <ExpandableSection headerText="Cross-checking an estimate with Calculon">
            <SpaceBetween size="s">
              <Box variant="p">
                For an independent estimate of dense layouts, Calculon is a parameterized analytical
                performance model of transformer training{' '}
                <Cite tier={3} href={CALCULON_SC23} venue="SC 2023">
                  Calculon, SC23 technical paper
                </Cite>
                . Its code takes the TP, PP and DP degrees, per-dimension networks, micro-batch size,
                recomputation mode, interleaving and optimizer sharding, and estimates step time and
                memory{' '}
                <Cite tier={1} href={CALCULON_CODE} kind="code">
                  Calculon llm/llm.py at the sc23 tag
                </Cite>
                . Our reading of that code: it does not model CP, EP or FSDP-style parameter sharding, and
                its attention type is multi-head or multi-query only, so GQA (grouped-query attention)
                needs an approximation. Alpa{' '}
                <Cite tier={3} href={ALPA} venue="OSDI 2022">
                  Alpa
                </Cite>{' '}
                and Galvatron{' '}
                <Cite tier={3} href={GALVATRON} venue="PVLDB 16(3)">
                  Galvatron
                </Cite>{' '}
                search parallel plans automatically.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Watch two published layouts pass every check on 256 H100s, and see the micro-batch decide whether FSDP's traffic is 6% or 94% of compute"
          >
            Example 1: 70B on 32 p5.48xlarge, where the first choices work
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The inputs: Llama 3.1 70B on 32 p5.48xlarge,{' '}
            {(P5_FACTS.ranksPerInstance * EX1_INPUT.instanceCount).toLocaleString('en-US')} H100 GPUs of 80 GB each{' '}
            <Cite tier={1} href={H100_SPEC} kind="vendor-claim" accessed={REGISTER_DATE}>
              NVIDIA H100 specification
            </Cite>
            , at 8,192 tokens per sequence and a global batch of 512 sequences, 4,194,304 tokens per
            step. At 6N FLOPs (floating-point operations) per token, the H100&apos;s dense BF16 peak of
            989.5 TFLOPS (NVIDIA prints the sparse figure, 1,979; the dense figure is half){' '}
            <Cite tier={1} href={H100_SPEC} kind="vendor-claim">
              NVIDIA H100 specification
            </Cite>{' '}
            and an assumed MFU (model FLOPs utilization) of 40%, inside the 38% to 43% that
            Llama 3 measured on H100{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint" accessed={REGISTER_DATE}>
              The Llama 3 Herd of Models, Table 4
            </Cite>
            , compute is {sec(EX1_A.computeSeconds)} per step. Activations use the per-layer formula that
            our E1 run confirmed on one GB10 for the 8B shape{' '}
            <Cite tier={0} href={E1_URL}>
              {E1_TITLE}
            </Cite>
            . The memory target is 60 GB, 75% of 80 GB.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headCell}>Check</th>
                  <th style={headCell}>Layout A</th>
                  <th style={headCell}>Layout B</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={cell}>Layout</td>
                  <td style={cell}>TP 8 x PP 4 x DP 8, ZeRO-1, five interleaved chunks per stage (v 5)</td>
                  <td style={cell}>
                    TP 8 x FSDP 32, each rank&apos;s 16 sequences as one micro-batch, full recomputation
                  </td>
                </tr>
                <tr>
                  <td style={cell}>Memory per GPU</td>
                  <td style={cell}>
                    {gb(EX1_A.memory.totalBytes)} ({gb(EX1_A_FP32.memory.totalBytes)} with FP32 main gradients)
                  </td>
                  <td style={cell}>{gb(EX1_B.memory.totalBytes)}</td>
                </tr>
                <tr>
                  <td style={cell}>Bubble</td>
                  <td style={cell}>
                    {pct(EX1_A.bubbleFraction, 2)} at m = {EX1_A.microBatchesPerStep} ({pct(EX1_A_V1.bubbleFraction, 2)}{' '}
                    without interleaving)
                  </td>
                  <td style={cell}>None: no pipeline</td>
                </tr>
                <tr>
                  <td style={cell}>Between instances</td>
                  <td style={cell}>DP {pct(exA_dp.shareOfCompute)} of compute</td>
                  <td style={cell}>FSDP {pct(exB_fsdp.shareOfCompute)} of compute</td>
                </tr>
                <tr>
                  <td style={cell}>Inside the instance</td>
                  <td style={cell}>TP {pct(exA_tp.shareOfCompute)} on NVLink</td>
                  <td style={cell}>TP {pct(linkOf(EX1_B, 'TP').shareOfCompute)} on NVLink</td>
                </tr>
                <tr>
                  <td style={cell}>Step estimate</td>
                  <td style={cell}>{range(EX1_A)}</td>
                  <td style={cell}>{range(EX1_B)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Both pass every check (our arithmetic in Calculator C). Layout A follows PTD-P&apos;s takeaways
            (TP inside the instance, a four-stage pipeline across instances), here with ZeRO-1 over the
            eight data-parallel copies,
            whose reduce-scatter and all-gather cross the network once per step at{' '}
            {gb(exA_dp.bytesPerStep)} per instance. Layout B is the layout TorchTitan published for this
            model{' '}
            <Cite tier={1} href={TT_BENCH}>
              TorchTitan Llama 3 H100 benchmarks
            </Cite>
            , and it passes for a reason its configuration does not state.
          </Box>
          <Box variant="p">
            FSDP2, PyTorch&apos;s current FSDP, all-gathers each unit&apos;s parameters twice and
            reduce-scatters its gradients once per micro-batch by default, as our E3 run counted on one
            DGX Spark{' '}
            <Cite tier={0} href={E3_URL}>
              {E3_TITLE}
            </Cite>
            . Layout B runs each rank&apos;s 16 sequences as a single micro-batch, so that happens once
            per step: {gb(exB_fsdp.bytesPerStep)} out of each instance, {sec(exB_fsdp.seconds, 2)} at 400
            GB/s, {pct(exB_fsdp.shareOfCompute)} of the {sec(EX1_B.computeSeconds)} of compute and{' '}
            {pct(exB_fsdp.seconds / EX1_B.stepSeconds.low)} of the {sec(EX1_B.stepSeconds.low)} step that
            full recomputation makes. Run the same layout at micro-batch 1 and it has{' '}
            {EX1_B_MB1.microBatchesPerStep} micro-batches, each with its own gathers and scatter:{' '}
            {gb(exB_mb1.bytesPerStep, 0)} per instance ({gb(exB_mb1.bytesPerStep / ranksPerP5, 0)} per GPU),{' '}
            {sec(exB_mb1.seconds)}, {pct(exB_mb1.shareOfCompute, 0)} of compute. Deferring the gradient sync
            to the last micro-batch brings that to {pct(exB_def.shareOfCompute, 0)} and costs a full
            unsharded gradient on every rank, {gb(EX1_B_MB1_DEFERRED.memory.modelState.totalBytes)} of state
            against {gb(EX1_B_MB1.memory.modelState.totalBytes)}. The micro-batch decides whether
            layout B survives step 10.
          </Box>
          <Box variant="p">
            The memory figures are lower bounds. TorchTitan measured layout B at 67.6 to 71.9 GiB per GPU
            (72.6 to 77.2 GB) on 96 GB H100s with Float8, local batch 16 and full recomputation, at a
            sequence length its benchmark does not state{' '}
            <Cite tier={1} href={TT_BENCH}>
              TorchTitan Llama 3 H100 benchmarks
            </Cite>
            . The calculator&apos;s {gb(EX1_B.memory.totalBytes)} counts {gb(EX1_B.memory.modelState.totalBytes)}{' '}
            of model state, {gb(EX1_B.memory.firstStage.activationBytes)} of activations (the checkpoint
            each layer keeps under full recomputation, plus one layer&apos;s working set) and{' '}
            {gb(EX1_B.memory.logits.totalBytes)} of logits, in FP32 plus their BF16 copy at Llama&apos;s
            128,256-entry vocabulary{' '}
            <Cite tier={1} href={LLAMA_TOKENIZER} kind="code" accessed={REGISTER_DATE}>
              llama-models v0.2.0 tokenizer.py L53-L103
            </Cite>
            . Gathered FSDP layers, communication buffers and allocator fragmentation are left to the
            headroom, so plan for measured peaks above formula totals.
          </Box>
          <ExpandableSection headerText="How Calculator C ranks these two">
            <Example1Ranking />
          </ExpandableSection>
          <ExpandableSection headerText="Megatron Bridge's recipe for the same model, and why the distributed optimizer matters">
            <Box variant="p">
              Megatron Bridge v0.7.0&apos;s recipe for Llama 3 70B on 32 H100 is TP 4 x PP 4 x VP 5 x CP 2
              (VP 5 is five virtual pipeline chunks per stage, section 10&apos;s v), sequence parallelism
              on, micro-batch 1 and global batch 512 at 8,192 tokens, with the distributed optimizer on{' '}
              <Cite tier={1} href={BRIDGE_RECIPE} kind="code" accessed={REGISTER_DATE}>
                Megatron Bridge llama3.py L717-L802
              </Cite>
              . With Megatron&apos;s FP32 main gradients, the calculator holds{' '}
              {gb(BRIDGE_DISTOPT.memory.modelState.totalBytes)} of model state per GPU with the
              distributed optimizer sharding over the two ranks that hold each model shard (CP ranks
              join the data-parallel group for the gradient reduction, section 11), and{' '}
              {gb(BRIDGE_NO_DISTOPT.memory.modelState.totalBytes)} without it, which would leave under 1 GB
              of an 80 GB H100 for activations. Megatron Core&apos;s guide recommends the distributed
              optimizer &quot;for all multi-GPU training&quot;{' '}
              <Cite tier={1} href={mg(MG_GUIDE, 'L211-L216')}>
                Megatron Core parallelism guide L211-L216
              </Cite>
              , and Megatron-LM turns it on only when <code>--use-distributed-optimizer</code> is passed{' '}
              <Cite tier={1} href={MG_DIST_OPT_FLAG} kind="code">
                Megatron-LM arguments.py L3102-L3103
              </Cite>
              . Pass it.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Follow the procedure past four layouts that fail the memory check and one that fits only by recomputing, to the layout that fits at 85 GB per GPU, and see what the H200's memory buys over the H100"
          >
            Example 2: 70B on four p5en.48xlarge, where the first choices fail
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Same model and batch, now on four p5en.48xlarge: 32 H200 GPUs. NVIDIA lists 141 GB per H200{' '}
            <Cite tier={1} href={H200_SPEC} kind="vendor-claim" accessed={REGISTER_DATE}>
              NVIDIA H200 specification
            </Cite>{' '}
            and AWS lists 141 GiB{' '}
            <Cite tier={1} href={EC2_AC} accessed={REGISTER_DATE}>
              EC2 accelerated computing instance specifications
            </Cite>
            ; the calculator takes the smaller, {gb(EX2_TP8.memory.capacity.bytes, 0)}, so the target is{' '}
            {gb(EX2_TP8.memory.headroomTargetBytes)}. The H200 has the H100&apos;s compute, and with an
            eighth of the GPUs the step&apos;s compute is {sec(EX2_TP8.computeSeconds)} at the same 40% MFU.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headCell}>Layout</th>
                  <th style={headCell}>Per GPU</th>
                  <th style={headCell}>Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={cell}>ZeRO-1 over DP 32</td>
                  <td style={cell}>{gb(EX2_ZERO1.memory.modelState.totalBytes)} of model state</td>
                  <td style={cell}>Fails the memory check</td>
                </tr>
                <tr>
                  <td style={cell}>ZeRO-2 over DP 32</td>
                  <td style={cell}>{gb(EX2_ZERO2.memory.modelState.totalBytes)} of model state</td>
                  <td style={cell}>Fails the memory check</td>
                </tr>
                <tr>
                  <td style={cell}>FSDP 32, no recomputation</td>
                  <td style={cell}>{gb(EX2_FSDP.memory.totalBytes)}</td>
                  <td style={cell}>Fails on activations</td>
                </tr>
                <tr>
                  <td style={cell}>FSDP 32, full recomputation</td>
                  <td style={cell}>{gb(EX2_FSDP_FULL.memory.totalBytes)}</td>
                  <td style={cell}>Fits, at a third more compute and about 7% to 9% on EFA</td>
                </tr>
                <tr>
                  <td style={cell}>HSDP, sharded inside each instance</td>
                  <td style={cell}>{gb(EX2_HSDP.memory.modelState.totalBytes)} of model state</td>
                  <td style={cell}>Fails once any activation is stored</td>
                </tr>
                <tr>
                  <td style={cell}>TP 8 x DP 4, ZeRO-1</td>
                  <td style={cell}>
                    {gb(EX2_TP8.memory.totalBytes)} ({gb(EX2_TP8_FP32.memory.totalBytes)} with FP32 gradients)
                  </td>
                  <td style={cell}>Fits: no pipeline, no recomputation</td>
                </tr>
                <tr>
                  <td style={cell}>TP 8 x PP 2 x DP 2, ZeRO-1</td>
                  <td style={cell}>{gb(EX2_TP8_PP2.memory.firstStage.totalBytes)} on the first stage</td>
                  <td style={cell}>Fits with margin</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            The first two options of step 3 fail. ZeRO-1 shards only the optimizer state, so each GPU still holds the full
            BF16 weights and gradients: {gb(EX2_ZERO1.memory.modelState.totalBytes)}. ZeRO-2 also shards
            the gradients and holds {gb(EX2_ZERO2.memory.modelState.totalBytes)}. Both are above 141 GB
            before an activation is stored (our arithmetic in Calculator C).
          </Box>
          <Box variant="p">
            Flat FSDP over all 32 GPUs shards everything, to {gb(EX2_FSDP.memory.modelState.totalBytes)}{' '}
            of state, and then fails on {gb(EX2_FSDP.memory.firstStage.activationBytes)} of activations.
            Full recomputation, rerunning each layer&apos;s forward pass during the backward pass instead
            of storing its activations, brings it to {gb(EX2_FSDP_FULL.memory.totalBytes)}, and the
            layout pays twice. Compute grows by a third. FSDP2&apos;s defaults then send at least{' '}
            {gb(EX2_FSDP_PER_MB_BYTES)} out of each instance per micro-batch, {sec(EX2_FSDP_PER_MB_SECONDS, 2)}{' '}
            at 400 GB/s against {sec(EX2_COMPUTE_PER_MB_RECOMPUTED)} of compute per micro-batch with
            recomputation, about {pct(EX2_FSDP_PER_MB_SECONDS / EX2_COMPUTE_PER_MB_RECOMPUTED, 0)}.
          </Box>
          <ExpandableSection headerText="FSDP 32's traffic and memory, cross-checked">
            <Box variant="p">
              Per micro-batch, a flat ring would send 410.1 GB out of each instance, 1.03 s, about 9%
              (our arithmetic, on the per-instance count of step 10). The calculator prints the same
              bytes per step, {gb(EX2_FSDP_LINK.bytesPerStep, 0)}, as {pct(EX2_FSDP_LINK.shareOfCompute)}{' '}
              of the {sec(EX2_FSDP_FULL.computeSeconds)} of compute before recomputation. Its{' '}
              {gb(EX2_FSDP_FULL.memory.totalBytes)} leaves to the headroom the two BF16 layers FSDP holds
              gathered while it computes; adding them gives 58.0 GB (our arithmetic).
            </Box>
          </ExpandableSection>
          <Box variant="p">
            HSDP shards inside each instance and replicates across the four, so each GPU holds an eighth
            of the state: {gb(EX2_HSDP.memory.modelState.totalBytes)}, more than the 141 GB NVIDIA lists
            and under AWS&apos;s 141 GiB (151.4 GB). Either way it fails once activations are stored:{' '}
            {gb(EX2_HSDP_FULL.memory.totalBytes)} even with full recomputation.
          </Box>
          <Box variant="p">
            Step 4 is the answer. TP 8 inside each instance, with SP, divides the weights, gradients and
            activations by eight: {gb(EX2_TP8.memory.modelState.weightsBytes + EX2_TP8.memory.modelState.gradientsBytes)}{' '}
            of weights and gradients, {gb(EX2_TP8.memory.modelState.optimizerBytes)} of optimizer state
            sharded over the four replicas, {gb(EX2_TP8.memory.firstStage.activationBytes)} of activations
            and {gb(EX2_TP8.memory.firstStage.logitBytes)} of logits. That is{' '}
            {gb(EX2_TP8.memory.totalBytes)} per GPU with no pipeline and no recomputation, and{' '}
            {gb(EX2_TP8_FP32.memory.totalBytes)} with FP32 main gradients, still under the target. The
            64 attention heads and 8 KV heads both divide by 8, so step 8 passes. TP&apos;s traffic stays
            on NVLink at {pct(ex2_tp_tp.shareOfCompute)} of compute, and DP&apos;s crossing is{' '}
            {gb(ex2_tp_dp.bytesPerStep)} per instance per step, {pct(ex2_tp_dp.shareOfCompute)} of compute.
            Its step estimate is {range(EX2_TP8)}.
          </Box>
          <Box variant="p">
            The ZeRO-2 variant of this shape holds {gb(EX2_TP8_ZERO2.memory.totalBytes)}. The ZeRO paper counts ZeRO-2 at ZeRO-1&apos;s
            volume{' '}
            <Cite tier={3} href={ZERO} venue="preprint" accessed={REGISTER_DATE}>
              ZeRO, Section 1
            </Cite>
            , which holds at one micro-batch per step. DeepSpeed reduces ZeRO-2&apos;s partitioned
            gradients on every backward pass and ZeRO-1&apos;s at the accumulation boundary{' '}
            <Cite tier={1} href={DS_ZERO2_REDUCE} kind="code">
              DeepSpeed stage_1_and_2.py L2293-L2295
            </Cite>
            , so at {EX2_TP8_ZERO2.microBatchesPerStep} micro-batches per step its crossing is{' '}
            {gb(linkOf(EX2_TP8_ZERO2, 'DP').bytesPerStep)} per instance per step,{' '}
            {pct(linkOf(EX2_TP8_ZERO2, 'DP').shareOfCompute)} of compute.
          </Box>
          <Box variant="p">
            The margin option is TP 8 x PP 2 x DP 2:{' '}
            {gb(EX2_TP8_PP2.memory.firstStage.totalBytes)} on the first stage, which holds the most
            activations under 1F1B{' '}
            <Cite tier={3} href={KORTHIKANTI} venue="MLSys 2023" accessed={REGISTER_DATE}>
              Reducing Activation Recomputation in Large Transformer Models, Section 4.2.3
            </Cite>
            , and {gb(EX2_TP8_PP2.memory.lastStage.totalBytes)} on the last. The 80 layers split into 40
            per stage, and with {EX2_TP8_PP2.microBatchesPerStep} micro-batches per step the bubble is{' '}
            {pct(EX2_TP8_PP2.bubbleFraction, 2)}.
          </Box>
          <Box variant="p">
            On 32 H100 (four p5.48xlarge), the same TP 8 x DP 4 needs the same{' '}
            {gb(EX2_H100_TP8.memory.totalBytes)} and does not fit 80 GB. With full recomputation it is{' '}
            {gb(EX2_H100_TP8_FULL.memory.totalBytes)}, which fits on paper above the 60 GB target, at a
            third more compute; the pipeline layout TP 8 x PP 4 fits at{' '}
            {gb(EX2_H100_TP8_PP4.memory.totalBytes)} with no recomputation. The H200&apos;s memory removes
            either the pipeline or the recomputation: section 21, Training Hardware on AWS, makes that
            choice across every instance. For this cluster, take TP 8 x DP 4 at{' '}
            {gb(EX2_TP8.memory.totalBytes)} and TP 8 x PP 2 x DP 2 into step 12.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Enter your model, cluster, sequence length and batch to get the layouts that fit, each with a step-time range and its per-link shares, then measure the top two or three"
          >
            Calculator C: parallelism sizing
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Calculator C runs steps 2 to 10 over every layout the cluster allows. It enumerates TP
            (divisors of the instance&apos;s ranks that the head counts allow), CP (from 8,192 tokens),
            PP and interleaved chunks, the DP or FSDP degree, the micro-batch, the recomputation mode and
            FSDP&apos;s gradient-sync mode; checks each layout&apos;s memory through Calculator B (section
            5), the unsharded gradient that deferral adds included; and ranks the survivors by one
            estimated step time:
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
            <code>
              {[
                'step    = compute x recomputation factor x (1 + (p - 1) / (v x m))',
                '          + exposed communication (0 to the sum of bytes / bandwidth)',
                'compute = FLOPs per token x tokens per step',
                '          / (ranks x dense peak per rank x MFU)',
                'm       = global batch / (micro-batch x DP)',
              ].join('\n')}
            </code>
          </pre>
          <Box variant="p">
            Read the result as a range. Its low end is compute, recomputation and the bubble, which no
            overlap can hide; its width is communication, which may hide behind compute or may not. Two
            layouts whose ranges overlap are a tie on paper, and ties are common: the published layouts
            of example 1 tie with the calculator&apos;s first choice. The page calls{' '}
            <code>sizeParallelism</code> and <code>evaluateLayout</code> in the dive&apos;s{' '}
            <code>src/lib/parallelism.ts</code>; an agent can call the same functions with the same inputs.
          </Box>
          <RanksCalculator />
          <ExpandableSection headerText="Where each input comes from">
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>
                <Box variant="p">
                  Llama 3.1 shapes from Llama 3&apos;s Table 3{' '}
                  <Cite tier={3} href={LLAMA3} venue="preprint" accessed={REGISTER_DATE}>
                    The Llama 3 Herd of Models, Table 3
                  </Cite>
                  , parameter counts from the published weights&apos; metadata{' '}
                  <Cite tier={1} href={HF_70B} accessed={REGISTER_DATE}>
                    Hugging Face model metadata, Llama 3.1 70B
                  </Cite>
                  ; DeepSeek-V3&apos;s shape from its report{' '}
                  <Cite tier={3} href={DSV3} venue="preprint" accessed={REGISTER_DATE}>
                    DeepSeek-V3 Technical Report, Section 4.2
                  </Cite>
                  . Custom shapes are counted as Llama layers: grouped-query attention, a three-matrix
                  SwiGLU MLP (multilayer perceptron) and an untied output head.
                </Box>
              </li>
              <li>
                <Box variant="p">
                  Ranks per instance, memory and EFA bandwidth from the EC2 (Elastic Compute Cloud)
                  specifications{' '}
                  <Cite tier={1} href={EC2_AC} accessed={REGISTER_DATE}>
                    EC2 accelerated computing instance specifications
                  </Cite>
                  ; dense BF16 peaks are half of NVIDIA&apos;s sparse figures, a vendor specification{' '}
                  <Cite tier={1} href={H100_SPEC} kind="vendor-claim" accessed={REGISTER_DATE}>
                    NVIDIA H100 specification
                  </Cite>
                  . A trn2.48xlarge runs 64 ranks, one per LNC (logical NeuronCore) at the default LNC=2{' '}
                  <Cite tier={1} href={TT_NEURON} accessed={REGISTER_DATE}>
                    TorchTitan Neuron overview, aws-neuron-sdk
                  </Cite>
                  , so each rank has 24 GiB, a quarter of a Trainium2&apos;s 96 GiB (our arithmetic).
                </Box>
              </li>
              <li>
                <Box variant="p">
                  MFU 40% and the 75% headroom target are assumptions; the first sits inside Llama
                  3&apos;s measured 38% to 43% on H100, and no first-party MFU for dense Llama-class
                  training on H200 or Trainium2 was located during this research. Our E2 run shows how
                  far the denominator matters on one GB10{' '}
                  <Cite tier={0} href={E2_URL}>
                    {E2_TITLE}
                  </Cite>
                  .
                </Box>
              </li>
              <li>
                <Box variant="p">
                  Memory from Calculator B: 16 or 18 bytes per parameter, then activations at 34 sbh per
                  layer for the 8B shape with a fused SwiGLU and 41 sbh eager, as our E1 run measured on
                  one GB10{' '}
                  <Cite tier={0} href={E1_URL}>
                    {E1_TITLE}
                  </Cite>
                  , with the first stage holding L layers&apos; worth under 1F1B{' '}
                  <Cite tier={3} href={KORTHIKANTI} venue="MLSys 2023" accessed={REGISTER_DATE}>
                    Reducing Activation Recomputation in Large Transformer Models, Section 4.2.3
                  </Cite>
                  . Full recomputation costs one more forward pass, a factor of 4/3 on compute (sections 4 and 5).
                </Box>
              </li>
              <li>
                <Box variant="p">
                  The bubble from the interleaved 1F1B schedule{' '}
                  <Cite tier={3} href={PTDP} venue="SC 2021" accessed={REGISTER_DATE}>
                    PTD-P paper, Section 2.2.2
                  </Cite>
                  ; FSDP2&apos;s collective counts from our E3 run{' '}
                  <Cite tier={0} href={E3_URL}>
                    {E3_TITLE}
                  </Cite>
                  ; the per-instance count of traffic between instances is our reading of AWS&apos;s
                  nccl-tests sample{' '}
                  <Cite tier={2} href={ADT_P5_SAMPLE} kind="vendor-claim">
                    awsome-distributed-training nccl-tests README L206-L243
                  </Cite>
                  .
                </Box>
              </li>
            </ul>
          </ExpandableSection>
          <ExpandableSection headerText="A1 protocol (not yet run)">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>What it would measure.</strong> nccl-tests <code>all_reduce_perf</code>,{' '}
                <code>reduce_scatter_perf</code>, <code>all_gather_perf</code> and{' '}
                <code>alltoall_perf</code> from 8 B to 16 GB on one p5.48xlarge (NVLink) and on two (EFA),
                recording bus bandwidth (
                <Link external href={GUIDE_URL}>
                  research guide, section 5
                </Link>
                ). It would replace the link peaks in step 10 with measured figures.
              </Box>
              <Box variant="p">
                <strong>On what.</strong> Two p5.48xlarge in a cluster placement group.
              </Box>
              <Box variant="p">
                <strong>Prediction, our reading and not a result.</strong> All-reduce across two instances
                in the range of AWS&apos;s sample, 487 GB/s of bus bandwidth at 16 GiB, far above one
                GPU&apos;s 50 GB/s share of EFA, which is what the per-instance count assumes.
              </Box>
              <Box variant="p">
                <strong>Cost.</strong> About two hours on two instances: 2 x 2 x $55.04 = $220 at the
                On-Demand rate in us-east-1 on 2026-10-30{' '}
                <Cite tier={1} href={EC2_PRICE_LIST} accessed={REGISTER_DATE}>
                  AWS Price List, AmazonEC2 us-east-1, version 20261029175634
                </Cite>
                , after raising the On-Demand quota for P instances from its starting 0 vCPUs (virtual
                CPUs){' '}
                <Cite tier={1} href={OD_QUOTAS} accessed={REGISTER_DATE}>
                  EC2 On-Demand Instance quotas
                </Cite>
                . The research guide runs it with two other experiments in one 7-hour window: $771
                On-Demand, or $2,292 for a one-day Capacity Block for two instances at $47.757 per
                instance-hour in US East (N. Virginia) on 2026-10-30, charged at the price quoted at
                purchase{' '}
                <Cite tier={1} href={CB_PRICING} accessed={REGISTER_DATE}>
                  EC2 Capacity Blocks pricing
                </Cite>
                . Teardown: one stack, deleted at the end and verified by listing instances by the
                stack&apos;s tag.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <ExpandableSection headerText="A2 protocol (not yet run)">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>What it would measure.</strong> Tokens per second, MFU against 989.5 TFLOPS, peak
                memory per GPU and EFA bytes per step for TorchTitan v0.4.0 training Llama 3.1 8B at
                8,192 tokens and 8 micro-batches, in FSDP 8 on one p5.48xlarge and in flat FSDP 16 and
                HSDP on two, each with and without deferred gradient reduction (
                <Link external href={GUIDE_URL}>
                  research guide, section 5
                </Link>
                ). It would put measured peaks beside the calculator&apos;s memory figures and a measured
                MFU in place of the 40% assumption.
              </Box>
              <Box variant="p">
                <strong>On what.</strong> The same two p5.48xlarge as A1.
              </Box>
              <Box variant="p">
                <strong>Prediction, our reading and not a result.</strong> Measured peaks above the
                calculator&apos;s totals, because the totals leave buffers, gathered layers and
                fragmentation to the headroom; EFA bytes per instance at or above the calculator&apos;s
                lower bounds. No tokens-per-second figure is predicted.
              </Box>
              <Box variant="p">
                <strong>Cost.</strong> About three hours on two instances: 2 x 3 x $55.04 = $330 at the
                same On-Demand rate{' '}
                <Cite tier={1} href={EC2_PRICE_LIST} accessed={REGISTER_DATE}>
                  AWS Price List, AmazonEC2 us-east-1, version 20261029175634
                </Cite>
                , inside the same 7-hour window as A1. Teardown: one stack, deleted at the end and
                verified by listing instances by the stack&apos;s tag.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Example2Shortlist />
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
