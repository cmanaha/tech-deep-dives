import { useRef } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import {
  Cite,
  gh,
  GUIDE_URL,
  HYPERPOD_RECIPES_TAG,
  KUBEFLOW_TRAINER_SHA,
  KUEUE_SHA,
  MEGATRON_TAG,
} from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import { memoryBudget } from '../lib/memory';
import { DENSE_MODELS, EKS_FEES, INSTANCES, PRICES, shapeOf } from '../lib/presets';
import type { PricePath } from '../lib/presets';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Register date for rows cited without re-opening their source. */
const R1 = '2026-10-30';

const EKS_UG = 'https://docs.aws.amazon.com/eks/latest/userguide/';
const EKS_COMPUTE = `${EKS_UG}ml-compute-management.html`;
const EKS_NODE_GROUPS = `${EKS_UG}ml-node-groups.html`;
const EKS_REPAIR = `${EKS_UG}ml-validate-gpu-node-repair.html`;
const EKS_TOPOLOGY = `${EKS_UG}ml-workload-topology.html`;
const EKS_NEURON = `${EKS_UG}device-management-neuron.html`;
const EKS_AMI = `${EKS_UG}ml-eks-optimized-ami.html`;
const EKS_VERSIONS = `${EKS_UG}kubernetes-versions.html`;
const EKS_BP_COMPUTE = 'https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html';
const EKS_PRICE = 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEKS/20261027191639/us-east-1/index.json';
const EC2_CB = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html';

const kueue = (lines: string) => gh('kubernetes-sigs/kueue', KUEUE_SHA, 'README.md', lines);
const trainer = (lines: string) => gh('kubeflow/trainer', KUBEFLOW_TRAINER_SHA, 'README.md', lines);
const JOBSET_TAG = 'v0.13.0';
const jobset = (lines: string) => gh('kubernetes-sigs/jobset', JOBSET_TAG, 'README.md', lines);

const BATCH_UG = 'https://docs.aws.amazon.com/batch/latest/userguide/';
const BATCH_EKS = `${BATCH_UG}eks.html`;
const BATCH_SHARED = `${BATCH_UG}eks-ce-shared-responsibility.html`;
const BATCH_MNP = `${BATCH_UG}mnp-eks-jobs.html`;
const BATCH_MNP_RUN = `${BATCH_UG}mnp-eks-running-mnp-jobs.html`;
const BATCH_EFA = `${BATCH_UG}efa.html`;
const BATCH_PRICING = 'https://aws.amazon.com/batch/pricing/';

const SM_DG = 'https://docs.aws.amazon.com/sagemaker/latest/dg/';
const HP_EKS = `${SM_DG}sagemaker-hyperpod-eks.html`;
const HP_HMA = `${SM_DG}sagemaker-hyperpod-eks-resiliency-health-monitoring-agent.html`;
const HP_EKS_DEEP = `${SM_DG}sagemaker-hyperpod-eks-resiliency-deep-health-checks.html`;
const HP_SLURM_DEEP = `${SM_DG}sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html`;
const HP_EKS_RECOVERY = `${SM_DG}sagemaker-hyperpod-eks-resiliency-node-recovery.html`;
const HP_GOVERNANCE = `${SM_DG}sagemaker-hyperpod-eks-operate-console-ui-governance.html`;
const HP_OPERATOR = `${SM_DG}sagemaker-eks-operator.html`;
const HP_OPERATOR_USAGE = `${SM_DG}sagemaker-eks-operator-usage.html`;
const HP_ELASTIC = `${SM_DG}sagemaker-eks-elastic-training.html`;
const HP_CKPTLESS = `${SM_DG}sagemaker-eks-checkpointless.html`;
const HP_CKPTLESS_IPR = `${SM_DG}sagemaker-eks-checkpointless-in-process-recovery.html`;
const HP_CKPTLESS_NOTES = `${SM_DG}sagemaker-eks-checkpointless-release-notes.html`;
const HP_AMI_EKS = `${SM_DG}sagemaker-hyperpod-release-ami-eks.html`;

const WN = 'https://aws.amazon.com/about-aws/whats-new/';
const WN_GOVERNANCE = `${WN}2024/12/task-governance-amazon-sagemaker-hyperpod/`;
const WN_OPERATOR = `${WN}2025/06/amazon-sagemaker-hyperpod-training-operator/`;
const WN_CKPTLESS = `${WN}2025/12/amazon-sagemaker-hyperpod-checkpointless-training/`;
const WN_GANG = `${WN}2026/04/sagemaker-hyperpod-gang-scheduling/`;

/** The one checkpointless pre-training recipe at HyperPod recipes 2.0.11: Llama 3 70B on 16 ml.p5.48xlarge. */
const recipe = (lines: string) =>
  gh(
    'aws/sagemaker-hyperpod-recipes',
    HYPERPOD_RECIPES_TAG,
    'hyperpod_recipes/recipes_src/training/llama/checkpointless_llama3_70b_pretrain.yaml',
    lines,
  );
const MG_DDP_CONFIG = gh(
  'NVIDIA/Megatron-LM',
  MEGATRON_TAG,
  'megatron/core/distributed/distributed_data_parallel_config.py',
  'L38-L41',
);
const MG_DIST_OPT = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'docs/user-guide/features/dist_optimizer.md', 'L14-L20');
const HF_70B =
  'https://huggingface.co/api/models/meta-llama/Llama-3.1-70B/revision/349b2ddb53ce8f2849a6c168a81980ab25258dac';
const H100_SPEC = 'https://www.nvidia.com/en-us/data-center/h100/';

const EFA_EKS_LINK = <Link href="../efa/">EFA dive, section 15: EFA on Amazon EKS</Link>;

/* ------------------------------------------------------------------------ */
/* Numbers                                                                  */
/* ------------------------------------------------------------------------ */

/** us-east-1 p5.48xlarge price rows, taken from the calculators' table so the page cannot disagree with them. */
function p5Row(path: PricePath) {
  const row = PRICES.find((p) => p.instance === 'p5.48xlarge' && p.path === path && p.region === 'US East (N. Virginia)');
  if (!row) throw new RangeError(`KubernetesFamily: no us-east-1 p5.48xlarge price row for path ${path}`);
  return row.usdPerUnitHour;
}
const EC2_P5 = p5Row('ec2OnDemand');
const HP_P5 = p5Row('hyperpod');

const EKS_CLUSTER = EKS_FEES.clusterUsdPerHour.value;
const EKS_EXTENDED = EKS_FEES.extendedSupportExtraUsdPerHour.value;
const autoModeP5 = EKS_FEES.autoModeUsdPerInstanceHour['p5.48xlarge'];
if (!autoModeP5) throw new RangeError('KubernetesFamily: no EKS Auto Mode fee for p5.48xlarge');
const AUTO_P5 = autoModeP5.value;

/** Our arithmetic: a 30-day month and the dive's 32-instance reference fleet. */
const MONTH_HOURS = 30 * 24;
const FLEET = 32;
const FLEET_GPUS = FLEET * INSTANCES['p5.48xlarge'].acceleratorsPerInstance.value;
const AUTO_MONTH = AUTO_P5 * FLEET * MONTH_HOURS;
const EKS_MONTH = EKS_CLUSTER * MONTH_HOURS;
const AUTO_SHARE = AUTO_P5 / EC2_P5.value;

/** A4's cost: five hours of one ml.p5.48xlarge HyperPod node (RESEARCH-GUIDE section 5). */
const A4_HOURS = 5;
const A4_COST = HP_P5.value * A4_HOURS;

/**
 * Checkpointless training's memory price on AWS's 70B recipe (TP 8 x PP 4 on 16 ml.p5.48xlarge, so DP 4),
 * computed with Calculator B: Megatron's distributed optimizer shards the FP32 master weights and Adam
 * moments over DP / num_distributed_optimizer_instances ranks (ZeRO stage 1 in the calculator), with the
 * recipe's FP32 gradient reduction (6 + 12/d bytes per parameter, Megatron's own table).
 */
const RECIPE = { nodes: 16, gpusPerNode: 8, tp: 8, pp: 4, seq: 2_048, microBatch: 1 } as const;
const RECIPE_GPUS = RECIPE.nodes * RECIPE.gpusPerNode;
const RECIPE_DP = RECIPE_GPUS / (RECIPE.tp * RECIPE.pp);
const M70 = shapeOf(DENSE_MODELS['llama-3.1-70b']);
const P5 = INSTANCES['p5.48xlarge'];

function modelStatePerGpu(optimizerInstances: number) {
  return memoryBudget({
    model: M70,
    optimizer: { row: 'adamMixed', gradientDtype: 'fp32' },
    zero: { stage: 1, degree: RECIPE_DP / optimizerInstances },
    tensorParallel: { degree: RECIPE.tp, sequenceParallel: true },
    pipelineParallel: { degree: RECIPE.pp },
    recompute: 'none',
    microBatch: RECIPE.microBatch,
    sequenceLength: RECIPE.seq,
    logits: 'fp32Upcast',
    hbmPerRank: P5.hbmPerAccelerator,
  });
}
const ONE_INSTANCE = modelStatePerGpu(1);
const TWO_INSTANCES = modelStatePerGpu(2);
const GB = 1e9;
const STATE_ONE_GB = ONE_INSTANCE.modelState.totalBytes / GB;
const STATE_TWO_GB = TWO_INSTANCES.modelState.totalBytes / GB;
const EXTRA_GB = STATE_TWO_GB - STATE_ONE_GB;
const EXTRA_CLUSTER_GB = EXTRA_GB * RECIPE_GPUS;
const HBM_GB = TWO_INSTANCES.capacity.gb;

const usd = (v: number) => `$${Math.round(v).toLocaleString('en-US')}`;
const usd2 = (v: number) => `$${v.toFixed(2)}`;
const gb1 = (v: number) => `${v.toFixed(1)} GB`;
const pct1 = (v: number) => `${(100 * v).toFixed(1)}%`;

/* ------------------------------------------------------------------------ */
/* Diagram 1: the Kubernetes stack for a training job                       */
/* ------------------------------------------------------------------------ */

const FONT = 'sans-serif';
const INK = '#16191f';
const MUTED = '#414d5c';

type Who = 'you' | 'eks' | 'hp' | 'batch';

const WHO_STYLE: Record<Who, { fill: string; stroke: string }> = {
  you: { fill: '#fbf3d5', stroke: '#8b6c00' },
  eks: { fill: '#d6e9fb', stroke: '#0972d3' },
  hp: { fill: '#e6f4f2', stroke: '#1f7a70' },
  batch: { fill: '#efe7fb', stroke: '#6f4cc4' },
};

const WHO_LEGEND: { who: Who; wide: string; narrow: string }[] = [
  { who: 'you', wide: 'You choose, install or run it', narrow: 'You install or run it' },
  { who: 'eks', wide: 'EKS runs it once turned on', narrow: 'EKS runs it' },
  { who: 'hp', wide: 'HyperPod EKS adds it', narrow: 'HyperPod EKS adds it' },
  { who: 'batch', wide: 'AWS Batch on EKS takes it', narrow: 'Batch on EKS takes it' },
];

interface StackChip {
  who: Who;
  /** One or two lines of at most 24 characters, so a chip fits both layouts. */
  lines: string[];
}

interface StackLayer {
  n: number;
  title: string;
  sub: string;
  chips: StackChip[];
}

/** Top of the stack first; layer 1 is drawn at the bottom. */
const STACK: StackLayer[] = [
  {
    n: 5,
    title: 'Recovery',
    sub: 'node back, then job back',
    chips: [
      { who: 'eks', lines: ['Node monitoring agent', 'and auto repair'] },
      { who: 'you', lines: ['Your job controller', 'restarts the pods'] },
      { who: 'hp', lines: ['Health agent, deep', 'checks, node recovery'] },
      { who: 'hp', lines: ['Training operator:', 'in-place restarts'] },
    ],
  },
  {
    n: 4,
    title: 'Job API',
    sub: 'one resource per job',
    chips: [
      { who: 'you', lines: ['JobSet v0.13.0,', 'API v1alpha2'] },
      { who: 'you', lines: ['TrainJob, Kubeflow', 'Trainer v2.3.0, alpha'] },
      { who: 'you', lines: ['PyTorchJob,', 'deprecated in Kueue'] },
      { who: 'hp', lines: ['HyperPodPyTorchJob', '(training operator)'] },
    ],
  },
  {
    n: 3,
    title: 'Gang scheduler',
    sub: 'all ranks or none',
    chips: [
      { who: 'you', lines: ['Kueue v0.20.4,', 'all-or-nothing'] },
      { who: 'you', lines: ['Volcano v1.16.0'] },
      { who: 'batch', lines: ['Batch multi-node', 'parallel jobs'] },
      { who: 'hp', lines: ['Task governance:', 'Kueue, gang scheduling'] },
    ],
  },
  {
    n: 2,
    title: 'Device plugins',
    sub: 'GPUs, EFA, Neuron',
    chips: [
      { who: 'you', lines: ['NVIDIA device plugin', 'on Amazon Linux AMIs'] },
      { who: 'eks', lines: ['Auto Mode, Bottlerocket:', 'NVIDIA plugin built in'] },
      { who: 'you', lines: ['EFA device plugin', 'on EKS AMIs'] },
      { who: 'you', lines: ['Neuron DRA driver', 'or device plugin'] },
    ],
  },
  {
    n: 1,
    title: 'Accelerated nodes',
    sub: 'capacity and image',
    chips: [
      { who: 'you', lines: ['Node groups or', 'Karpenter'] },
      { who: 'eks', lines: ['EKS Auto Mode,', 'fee per node-hour'] },
      { who: 'batch', lines: ['Batch-managed nodes,', 'zero when idle'] },
      { who: 'hp', lines: ['HyperPod worker nodes', 'on the HyperPod AMI'] },
    ],
  },
];

const CONTAINER_WIDE =
  'Your training container: framework, NCCL, aws-ofi-nccl and checkpoint code, yours to pin on all three paths';
const CONTAINER_NARROW = ['Framework, NCCL, aws-ofi-nccl and checkpoint', 'code: yours to pin on all three paths'];

const STACK_TITLE =
  'The Kubernetes stack under a synchronous training job, five layers from the bottom: accelerated nodes, device ' +
  'plugins for GPUs, EFA and Neuron, a gang scheduler that admits all ranks or none, a job API, and recovery of the ' +
  'node and then the job. On self-managed EKS you install or run most pieces, and EKS itself runs Auto Mode and the ' +
  'node monitoring agent with automatic repair; AWS Batch on EKS takes over the nodes and gang scheduling; HyperPod ' +
  'EKS adds its worker nodes, task governance on Kueue, its own job resource, health checks with node recovery, and a ' +
  'training operator that restarts processes in place. The training container stays yours on all three paths.';

function centredLines(lines: string[], mid: number, fontSize: number, gap: number): number[] {
  const first = lines.length === 1 ? mid + fontSize * 0.36 : mid - (gap * (lines.length - 1)) / 2 + fontSize * 0.36;
  return lines.map((_, i) => first + i * gap);
}

function Chip({ x, y, w, h, chip }: { x: number; y: number; w: number; h: number; chip: StackChip }) {
  const s = WHO_STYLE[chip.who];
  const ys = centredLines(chip.lines, y + h / 2, 11, 14);
  return (
    <g className="kubernetes-stack-chip">
      <rect x={x} y={y} width={w} height={h} rx={5} fill={s.fill} stroke={s.stroke} strokeWidth={1.2} />
      {chip.lines.map((line, i) => (
        <text key={line} x={x + w / 2} y={ys[i]} textAnchor="middle" fontFamily={FONT} fontSize={11} fill={INK}>
          {line}
        </text>
      ))}
    </g>
  );
}

function Legend({ x, y, narrow }: { x: number; y: number; narrow: boolean }) {
  if (narrow) {
    return (
      <g>
        {WHO_LEGEND.map((item, i) => {
          const lx = x + (i % 2) * 194;
          const ly = y + Math.floor(i / 2) * 20;
          const s = WHO_STYLE[item.who];
          return (
            <g key={item.who}>
              <rect x={lx} y={ly} width={12} height={12} rx={3} fill={s.fill} stroke={s.stroke} strokeWidth={1.2} />
              <text x={lx + 18} y={ly + 10} fontFamily={FONT} fontSize={11} fill={INK}>
                {item.narrow}
              </text>
            </g>
          );
        })}
      </g>
    );
  }
  let lx = x;
  return (
    <g>
      {WHO_LEGEND.map((item) => {
        const at = lx;
        lx += 14 + 6 + Math.ceil(item.wide.length * 6.1) + 20;
        const s = WHO_STYLE[item.who];
        return (
          <g key={item.who}>
            <rect x={at} y={y} width={14} height={14} rx={3} fill={s.fill} stroke={s.stroke} strokeWidth={1.2} />
            <text x={at + 20} y={y + 11} fontFamily={FONT} fontSize={11} fill={INK}>
              {item.wide}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function StackWide() {
  const W = 900;
  const top = 84;
  const labelX = 26;
  const chipX0 = 206;
  const chipW = 160;
  const chipGap = 10;
  const chipH = 42;
  const bandH = 58;
  const bandGap = 8;
  const containerH = 44;
  const H = top + containerH + bandGap + STACK.length * (bandH + bandGap) + 6;
  const bandX = 12;
  const bandW = W - 24;
  const chipsRight = chipX0 + 4 * chipW + 3 * chipGap;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby="kubernetes-stack-title"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <title id="kubernetes-stack-title">{STACK_TITLE}</title>
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
      <text x={14} y={24} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
        Five layers under a Kubernetes training job, and who provides each piece
      </text>
      <text x={14} y={42} fontFamily={FONT} fontSize={11} fill={MUTED}>
        Read from the bottom; each layer needs the one below it
      </text>
      <Legend x={14} y={54} narrow={false} />
      <g>
        <rect x={bandX} y={top} width={bandW} height={containerH} rx={6} fill="#f8f9fa" stroke="#d1d5db" />
        <text x={labelX} y={top + 19} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
          Training container
        </text>
        <text x={labelX} y={top + 34} fontFamily={FONT} fontSize={11} fill={MUTED}>
          above the stack
        </text>
        <rect
          x={chipX0}
          y={top + 7}
          width={chipsRight - chipX0}
          height={containerH - 14}
          rx={5}
          fill={WHO_STYLE.you.fill}
          stroke={WHO_STYLE.you.stroke}
          strokeWidth={1.2}
          strokeDasharray="5 3"
        />
        <text
          x={(chipX0 + chipsRight) / 2}
          y={top + containerH / 2 + 4}
          textAnchor="middle"
          fontFamily={FONT}
          fontSize={11}
          fill={INK}
        >
          {CONTAINER_WIDE}
        </text>
      </g>
      {STACK.map((layer, i) => {
        const y = top + containerH + bandGap + i * (bandH + bandGap);
        return (
          <g key={layer.n}>
            <rect x={bandX} y={y} width={bandW} height={bandH} rx={6} fill="#f8f9fa" stroke="#d1d5db" />
            <text x={labelX} y={y + 25} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
              {`${layer.n}. ${layer.title}`}
            </text>
            <text x={labelX} y={y + 41} fontFamily={FONT} fontSize={11} fill={MUTED}>
              {layer.sub}
            </text>
            {layer.chips.map((chip, j) => (
              <Chip
                key={chip.lines.join(' ')}
                x={chipX0 + j * (chipW + chipGap)}
                y={y + (bandH - chipH) / 2}
                w={chipW}
                h={chipH}
                chip={chip}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function StackNarrow() {
  const W = 400;
  const top = 96;
  const bandX = 8;
  const bandW = W - 16;
  const inX = 18;
  const chipGap = 8;
  const chipW = (W - 2 * inX - chipGap) / 2;
  const chipH = 40;
  const rowGap = 6;
  const bandH = 28 + 2 * chipH + rowGap + 10;
  const bandGap = 8;
  const containerH = 70;
  const H = top + containerH + bandGap + STACK.length * (bandH + bandGap) + 4;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby="kubernetes-stack-narrow-title"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <title id="kubernetes-stack-narrow-title">{STACK_TITLE}</title>
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
      <text x={12} y={22} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
        Five layers under a training job
      </text>
      <text x={12} y={40} fontFamily={FONT} fontSize={11} fill={MUTED}>
        Read from the bottom; who provides each piece
      </text>
      <Legend x={12} y={54} narrow />
      <g>
        <rect x={bandX} y={top} width={bandW} height={containerH} rx={6} fill="#f8f9fa" stroke="#d1d5db" />
        <text x={inX} y={top + 18} fontFamily={FONT} fontSize={12} fontWeight={600} fill={INK}>
          Training container, above the stack
        </text>
        <rect
          x={inX}
          y={top + 26}
          width={W - 2 * inX}
          height={36}
          rx={5}
          fill={WHO_STYLE.you.fill}
          stroke={WHO_STYLE.you.stroke}
          strokeWidth={1.2}
          strokeDasharray="5 3"
        />
        {CONTAINER_NARROW.map((line, i) => (
          <text key={line} x={W / 2} y={top + 40 + i * 14} textAnchor="middle" fontFamily={FONT} fontSize={11} fill={INK}>
            {line}
          </text>
        ))}
      </g>
      {STACK.map((layer, i) => {
        const y = top + containerH + bandGap + i * (bandH + bandGap);
        return (
          <g key={layer.n}>
            <rect x={bandX} y={y} width={bandW} height={bandH} rx={6} fill="#f8f9fa" stroke="#d1d5db" />
            <text x={inX} y={y + 18} fontFamily={FONT} fontSize={12} fontWeight={600} fill={INK}>
              {`${layer.n}. ${layer.title}: ${layer.sub}`}
            </text>
            {layer.chips.map((chip, j) => (
              <Chip
                key={chip.lines.join(' ')}
                x={inX + (j % 2) * (chipW + chipGap)}
                y={y + 28 + Math.floor(j / 2) * (chipH + rowGap)}
                w={chipW}
                h={chipH}
                chip={chip}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function KubernetesStackDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, 700);
  return (
    <SpaceBetween size="xs">
      <div ref={ref}>{narrow ? <StackNarrow /> : <StackWide />}</div>
      <Box variant="small" color="text-body-secondary">
        Illustrative, not measured. The colours follow section 20&apos;s ownership matrix: amber pieces are yours on
        self-managed EKS, blue ones EKS runs once you turn them on, and teal and purple mark what HyperPod EKS and AWS
        Batch on EKS provide in their place. Each piece is cited in the text below.
      </Box>
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 2: the recovery ladder                                           */
/* ------------------------------------------------------------------------ */

interface Rung {
  n: number;
  title: string;
  /** Lines for the wide layout (about 38 characters each). */
  wide: string[];
  /** Lines for the narrow layout (about 56 characters each). */
  narrow: string[];
}

const RUNGS: Rung[] = [
  {
    n: 1,
    title: 'In-process recovery',
    wide: ['Trigger: an exception in the code', 'Restarts: a code block, inside the', 'same live processes', 'State: still in GPU memory'],
    narrow: ['Trigger: an exception in the code', 'Restarts: a code block, inside the same live processes', 'State: still in GPU memory'],
  },
  {
    n: 2,
    title: 'Process-level restart',
    wide: ['Trigger: a dead process or a', 'corrupted CUDA context', 'Restarts: processes; pods stay up', 'State: from peers or your checkpoint'],
    narrow: [
      'Trigger: a dead process or a corrupted CUDA context',
      'Restarts: the processes; the pods stay up',
      'State: from peers or from your checkpoint',
    ],
  },
  {
    n: 3,
    title: 'Job-level restart',
    wide: ['Trigger: a node that must be replaced', 'Restarts: every pod of the job', 'State: from peers if feasible, else', 'from your last checkpoint'],
    narrow: [
      'Trigger: a node that must be replaced',
      'Restarts: every pod of the job, on the new node',
      'State: from peers if feasible, else your last checkpoint',
    ],
  },
];

interface Climber {
  label: string;
  who: Who;
  /** First rung this path offers; every path ends at rung 3. */
  from: number;
}

const CLIMBERS: Climber[] = [
  { label: 'HyperPod checkpointless training', who: 'hp', from: 1 },
  { label: 'HyperPod training operator', who: 'hp', from: 2 },
  { label: 'JobSet or PyTorchJob, self-managed EKS', who: 'you', from: 3 },
];

const LADDER_TITLE =
  'Three rungs of recovery after a fault, cheapest first. In-process recovery re-runs a block of training code ' +
  'inside the live processes, with the state still in GPU memory. A process-level restart restarts the training ' +
  'processes while the pods stay up. A job-level restart replaces the node and restarts every pod, taking state ' +
  'from healthy peers if feasible and otherwise from the last checkpoint. HyperPod checkpointless training offers ' +
  'all three rungs, the HyperPod training operator offers the process-level and job-level restarts, and a JobSet ' +
  'or PyTorchJob on self-managed EKS offers only the job-level restart.';

function LadderWide() {
  const W = 900;
  const boxW = 268;
  const boxGap = 32;
  const x0 = 16;
  const boxY = 58;
  const boxH = 132;
  const barTop = boxY + boxH + 18;
  const barH = 22;
  const barGap = 8;
  const H = barTop + CLIMBERS.length * (barH + barGap) + 8;
  const bx = (n: number) => x0 + (n - 1) * (boxW + boxGap);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby="kubernetes-recovery-title"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <title id="kubernetes-recovery-title">{LADDER_TITLE}</title>
      <defs>
        <marker id="kubernetes-recovery-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
        </marker>
      </defs>
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
      <text x={14} y={24} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
        How far back a fault sends the job
      </text>
      <text x={14} y={42} fontFamily={FONT} fontSize={11} fill={MUTED}>
        Each rung hands over to the next when it cannot recover; the bars show which rungs each path offers
      </text>
      {RUNGS.map((r) => {
        const x = bx(r.n);
        return (
          <g key={r.n}>
            <rect x={x} y={boxY} width={boxW} height={boxH} rx={6} fill="#f2f8fd" stroke="#0972d3" strokeWidth={1.2} />
            <text x={x + 12} y={boxY + 24} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
              {`${r.n}. ${r.title}`}
            </text>
            {r.wide.map((line, i) => (
              <text key={line} x={x + 12} y={boxY + 50 + i * 18} fontFamily={FONT} fontSize={11} fill={INK}>
                {line}
              </text>
            ))}
          </g>
        );
      })}
      {[1, 2].map((n) => (
        <line
          key={n}
          x1={bx(n) + boxW + 4}
          y1={boxY + boxH / 2}
          x2={bx(n + 1) - 4}
          y2={boxY + boxH / 2}
          stroke="#5f6b7a"
          strokeWidth={1.5}
          markerEnd="url(#kubernetes-recovery-ah)"
        />
      ))}
      {CLIMBERS.map((c, i) => {
        const y = barTop + i * (barH + barGap);
        const x1 = bx(c.from);
        const x2 = bx(3) + boxW;
        const s = WHO_STYLE[c.who];
        return (
          <g key={c.label}>
            <rect x={x1} y={y} width={x2 - x1} height={barH} rx={4} fill={s.fill} stroke={s.stroke} strokeWidth={1.2} />
            <text x={(x1 + x2) / 2} y={y + 15} textAnchor="middle" fontFamily={FONT} fontSize={11} fill={INK}>
              {c.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function LadderNarrow() {
  const W = 400;
  const x = 12;
  const boxW = W - 24;
  const top = 56;
  const boxH = 96;
  const arrowGap = 22;
  const gridTop = top + RUNGS.length * boxH + (RUNGS.length - 1) * arrowGap + 26;
  const rowH = 30;
  const sq = 18;
  const sqX = (n: number) => 290 + (n - 1) * 32;
  const H = gridTop + 22 + CLIMBERS.length * rowH + 8;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby="kubernetes-recovery-narrow-title"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <title id="kubernetes-recovery-narrow-title">{LADDER_TITLE}</title>
      <defs>
        <marker
          id="kubernetes-recovery-narrow-ah"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
        </marker>
      </defs>
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
      <text x={12} y={22} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
        How far back a fault sends the job
      </text>
      <text x={12} y={40} fontFamily={FONT} fontSize={11} fill={MUTED}>
        Each rung hands over to the next when it cannot recover
      </text>
      {RUNGS.map((r, i) => {
        const y = top + i * (boxH + arrowGap);
        return (
          <g key={r.n}>
            <rect x={x} y={y} width={boxW} height={boxH} rx={6} fill="#f2f8fd" stroke="#0972d3" strokeWidth={1.2} />
            <text x={x + 12} y={y + 22} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
              {`${r.n}. ${r.title}`}
            </text>
            {r.narrow.map((line, j) => (
              <text key={line} x={x + 12} y={y + 44 + j * 17} fontFamily={FONT} fontSize={11} fill={INK}>
                {line}
              </text>
            ))}
            {i < RUNGS.length - 1 && (
              <line
                x1={W / 2}
                y1={y + boxH + 3}
                x2={W / 2}
                y2={y + boxH + arrowGap - 3}
                stroke="#5f6b7a"
                strokeWidth={1.5}
                markerEnd="url(#kubernetes-recovery-narrow-ah)"
              />
            )}
          </g>
        );
      })}
      <text x={12} y={gridTop + 12} fontFamily={FONT} fontSize={12} fontWeight={600} fill={INK}>
        Rungs each path offers
      </text>
      {RUNGS.map((r) => (
        <text key={r.n} x={sqX(r.n) + sq / 2} y={gridTop + 12} textAnchor="middle" fontFamily={FONT} fontSize={11} fill={MUTED}>
          {r.n}
        </text>
      ))}
      {CLIMBERS.map((c, i) => {
        const y = gridTop + 22 + i * rowH;
        const s = WHO_STYLE[c.who];
        return (
          <g key={c.label}>
            <text x={12} y={y + 13} fontFamily={FONT} fontSize={11} fill={INK}>
              {c.label}
            </text>
            {RUNGS.map((r) => (
              <rect
                key={r.n}
                x={sqX(r.n)}
                y={y}
                width={sq}
                height={sq}
                rx={3}
                fill={r.n >= c.from ? s.fill : '#ffffff'}
                stroke={r.n >= c.from ? s.stroke : '#d1d5db'}
                strokeWidth={1.2}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function RecoveryLadderDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, 700);
  return (
    <SpaceBetween size="xs">
      <div ref={ref}>{narrow ? <LadderNarrow /> : <LadderWide />}</div>
      <Box variant="small" color="text-body-secondary">
        Illustrative, not measured. Rungs and triggers follow HyperPod&apos;s failure-type table for checkpointless
        training; where a rung takes its state from depends on whether checkpointless training is on, as the text
        explains.
      </Box>
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function KubernetesFamily() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Assemble the five layers a synchronous training job needs on Kubernetes, and know which of them AWS runs on self-managed EKS (Amazon Elastic Kubernetes Service), AWS Batch on EKS and HyperPod EKS (AWS documentation, Kueue v0.20.4, Kubeflow Trainer v2.3.0, JobSet v0.13.0 and HyperPod recipes 2.0.11, read 2026-10-31)"
          >
            25. The Kubernetes Family
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Kubernetes runs pods, and its default scheduler places them one at a time{' '}
            <Cite tier={1} href={EKS_TOPOLOGY}>
              EKS User Guide, network topology
            </Cite>
            . A synchronous training job needs every rank (one training process per accelerator) running at once,
            because each step ends in a collective every rank must join, and it needs a restart that brings all ranks
            back to the same step. The challenge is to add the pieces that turn a pool of GPU or Trainium nodes into
            that, and to decide which of them your team runs.
          </Box>
          <Box variant="p">
            AWS offers three ways: self-managed EKS, where you add the pieces;
            AWS Batch on EKS, which schedules jobs from outside the cluster onto nodes it creates; and SageMaker
            HyperPod with EKS, which keeps your EKS control plane and owns the worker nodes. Section 20, Who Owns What
            on AWS, maps who owns each concern; this section goes one level down, into how each path runs a training
            job. EFA (Elastic Fabric Adapter) setup on EKS is in the {EFA_EKS_LINK}.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See the five pieces a synchronous job needs, and which of them AWS Batch and HyperPod EKS take over from you"
          >
            Five layers between a node pool and a training run
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Read the stack from the bottom. Nodes boot an AMI (Amazon Machine Image) with the GPU or Neuron driver.
            Device plugins, or the Neuron DRA (dynamic resource allocation) driver for Trainium, make GPUs, EFA
            interfaces and Neuron devices visible to pods. A gang scheduler admits a job only when all of its pods can
            start. A job API describes one training job as one resource. Recovery puts a healthy node back, then
            restarts the training processes from a known state. Your training container, with its framework and NCCL
            (NVIDIA Collective Communications Library), runs on top.
          </Box>
          <KubernetesStackDiagram />
          <Box variant="p">
            The training container stays yours on all three paths, our reading. The EKS-optimized accelerated AMIs
            carry the host side, the NVIDIA driver, the EFA kernel module and rdma-core, while
            the CUDA runtime and libraries come from your container{' '}
            <Cite tier={1} href={EKS_AMI}>
              EKS User Guide, accelerated AMIs
            </Cite>
            . AWS&apos;s checkpointless training container, for one, pins NCCL 2.27.5 and
            aws-ofi-nccl, the plugin that carries NCCL over EFA, at 1.16.0{' '}
            <Cite tier={1} href={HP_CKPTLESS_NOTES}>
              HyperPod checkpointless training release notes
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Provision a fixed training fleet without a per-node fee, plan for the Capacity Block's end, and make every accelerator and EFA interface visible to pods"
          >
            Layers 1 and 2: nodes, capacity and devices
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            EKS provisions accelerated nodes three ways. Auto Mode is AWS-managed compute with a built-in Karpenter
            (the open-source node provisioner) and Bottlerocket images that include the NVIDIA drivers and device
            plugins. Self-managed Karpenter gives the same model with your own images. Node groups are EC2 (Amazon
            Elastic Compute Cloud) Auto Scaling groups sized upfront in a launch template, which the guide names for
            training with a known, static footprint{' '}
            <Cite tier={1} href={EKS_COMPUTE}>
              EKS User Guide, accelerated compute
            </Cite>
            . Auto Mode adds ${AUTO_P5} per p5.48xlarge-hour in us-east-1{' '}
            <Cite tier={1} href={EKS_PRICE}>
              Amazon EKS Price List, us-east-1, version 20261027191639
            </Cite>
            : on {FLEET} p5.48xlarge ({FLEET_GPUS} H100 GPUs) over a 30-day month that is{' '}
            <strong>{usd(AUTO_MONTH)}</strong>, against {usd(EKS_MONTH)} for the cluster at {usd2(EKS_CLUSTER)} per
            hour, or {pct1(AUTO_SHARE)} on top of the ${EC2_P5.value} On-Demand rate{' '}
            <Cite tier={1} href={EC2_P5.source.url}>
              EC2 Price List, us-east-1, version 20261029175634
            </Cite>
            . Our arithmetic: <code>{`${AUTO_P5} x ${FLEET} x ${MONTH_HOURS}`}</code>. The offer lists no fee for node
            groups or self-managed Karpenter beyond the cluster-hour, our reading of it.
          </Box>
          <Box variant="p">
            A Capacity Block (accelerators reserved for a fixed window; section 22, Capacity &amp; Cost) reaches a node
            group through a custom launch template that targets the reservation, in a subnet of the block&apos;s
            Availability Zone. Its end is the deadline that matters: EC2 begins shutting the instances down 30 minutes
            before the reservation ends, and a managed node group on a block drains itself 40 minutes before the end
            through a scheduled scaling policy it creates{' '}
            <Cite tier={1} href={EKS_NODE_GROUPS}>
              EKS User Guide, node groups
            </Cite>
            . Put the last checkpoint before the earlier edge.
          </Box>
          <Box variant="p">
            On Karpenter, keep consolidation off busy training nodes. Karpenter can replace a fully used GPU node with
            a cheaper instance type that fits, which interrupts the job; the EKS best-practice guide recommends{' '}
            <code>consolidationPolicy: WhenEmpty</code> with a <code>consolidateAfter</code> such as one hour{' '}
            <Cite tier={1} href={EKS_BP_COMPUTE}>
              EKS Best Practices Guide, AI/ML compute
            </Cite>
            .
          </Box>
          <Box variant="p">
            The Amazon Linux NVIDIA AMIs leave out the NVIDIA Kubernetes device plugin, which you install, while the
            Bottlerocket NVIDIA AMIs include it; with EFA, on either, you install the EFA device plugin{' '}
            <Cite tier={1} href={EKS_AMI}>
              EKS User Guide, accelerated AMIs
            </Cite>
            . For Trainium on Kubernetes 1.34 and later, AWS recommends the Neuron DRA driver,
            which publishes each device&apos;s topology and EFA locality and allocates connected groups of 1,
            4, 8 or 16 Neuron devices; DRA is not currently supported on Auto Mode, where the Neuron device plugin and
            its integer counts remain{' '}
            <Cite tier={1} href={EKS_NEURON}>
              EKS User Guide, Neuron devices
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Install a gang scheduler before the first multi-node job, so that a job starts whole or waits whole"
          >
            Layer 3: admit all ranks or none
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Pods that start before the rest of their job hold accelerators and wait. The EKS guide tells training users
            to add a batch scheduler or queueing system with gang scheduling, all-or-nothing admission, because the
            default scheduler does not provide it{' '}
            <Cite tier={1} href={EKS_TOPOLOGY}>
              EKS User Guide, network topology
            </Cite>
            . Kueue at v0.20.4 starts no pod until there is quota for all of them, by default, places communicating
            pods close together, and shares quota across teams with borrowing and optional preemption{' '}
            <Cite tier={1} href={kueue('L19-L26')}>
              Kueue README at v0.20.4, L19-L26
            </Cite>
            ; its core APIs are <code>v1beta2</code> and it is used in production{' '}
            <Cite tier={1} href={kueue('L108-L117')}>
              Kueue README, production readiness
            </Cite>
            . Volcano (v1.16.0) is the other scheduler Kubeflow Trainer integrates for topology-aware scheduling{' '}
            <Cite tier={1} href={trainer('L21-L24')}>
              Kubeflow Trainer README at v2.3.0
            </Cite>
            .
          </Box>
          <Box variant="p">
            For placement, EKS labels nodes on supported instance types with their position in the EC2 network,{' '}
            <code>topology.k8s.aws/network-node-layer-1</code> to <code>-4</code>, for a gang scheduler to use as its
            placement domain. The bottom layer your family reports (3 or 4) gives the tightest placement and the
            smallest pool, so jobs wait longer; layer 2 widens the pool. The placement is best effort: to guarantee it,
            reserve the instances together in a Capacity Block or a cluster placement group{' '}
            <Cite tier={1} href={EKS_TOPOLOGY}>
              EKS User Guide, network topology
            </Cite>
            . The API behind the labels is in the{' '}
            <Link href="../efa/">EFA dive, section 7: The EC2 Instance Topology API</Link>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Choose a job resource your scheduler still supports and that restarts the whole job from your checkpoint, knowing every candidate carries a status warning"
          >
            Layer 4: pick a job API and pin it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A job API turns &quot;run {FLEET} pods as ranks 0 to {FLEET_GPUS - 1}&quot; into one resource a scheduler
            can queue and a controller can restart. Batch on EKS uses its own job definitions; elsewhere there are four
            candidates.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <SpaceBetween size="xxs">
              <Box variant="h4">PyTorchJob (Kubeflow Training Operator v1)</Box>
              <Box variant="p">
                Deprecated in Kueue, which says to migrate to TrainJob or JobSet{' '}
                <Cite tier={1} href={kueue('L40')}>
                  Kueue README, L40
                </Cite>
                ; maintained on the <code>release-1.9</code> branch{' '}
                <Cite tier={1} href={trainer('L102-L108')}>
                  Kubeflow Trainer README, L102-L108
                </Cite>
                .
              </Box>
            </SpaceBetween>
            <SpaceBetween size="xxs">
              <Box variant="h4">TrainJob (Kubeflow Trainer v2.3.0)</Box>
              <Box variant="p">
                &quot;currently in alpha status, and APIs may change&quot;{' '}
                <Cite tier={1} href={trainer('L104')}>
                  Kubeflow Trainer README, L104
                </Cite>
                ; TrainJob and Runtimes, through the Kubeflow Python SDK{' '}
                <Cite tier={1} href={trainer('L61-L63')}>
                  Kubeflow Trainer README, L61-L63
                </Cite>
                .
              </Box>
            </SpaceBetween>
            <SpaceBetween size="xxs">
              <Box variant="h4">JobSet v0.13.0</Box>
              <Box variant="p">
                API <code>v1alpha2</code>, under the Kubernetes deprecation policy{' '}
                <Cite tier={1} href={jobset('L33-L35')}>
                  JobSet README at v0.13.0, L33-L35
                </Cite>
                ; a built-in Kueue integration and migration target{' '}
                <Cite tier={1} href={kueue('L34-L40')}>
                  Kueue README, L34-L40
                </Cite>
                .
              </Box>
            </SpaceBetween>
            <SpaceBetween size="xxs">
              <Box variant="h4">HyperPodPyTorchJob (HyperPod EKS)</Box>
              <Box variant="p">
                The HyperPod training operator&apos;s resource{' '}
                <Cite tier={1} href={HP_OPERATOR_USAGE}>
                  SageMaker Developer Guide, running jobs with the training operator
                </Cite>
                ; HyperPod also auto-resumes PyTorchJob{' '}
                <Cite tier={1} href={HP_EKS}>
                  SageMaker Developer Guide, HyperPod with EKS
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ColumnLayout>
          <Box variant="p">
            On a new self-managed cluster, start from JobSet, our reading of those lines. Its failure policy is the
            restart a training job needs: when a child job fails, JobSet recreates the whole set, up to a maximum number
            of restarts you set, so the workload resumes from its last checkpoint; with no policy, one failed job fails
            the JobSet{' '}
            <Cite tier={1} href={jobset('L19')}>
              JobSet README at v0.13.0, L19
            </Cite>
            . Set that maximum and pin the JobSet and Kueue versions. Take TrainJob if you want Kubeflow&apos;s
            runtimes and accept changing APIs; keep PyTorchJob only where it already runs. What the script does on each
            restart is section 19, Resuming Correctly.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Turn on node monitoring and automatic repair, budget the minutes a repair waits, and leave the job restart to your job controller and checkpoint"
          >
            Layer 5 on self-managed EKS: EKS repairs the node, you restart the job
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The EKS node monitoring agent reads Xid errors (the NVIDIA driver&apos;s numbered GPU error reports) from
            DCGM (NVIDIA Data Center GPU Manager) and sets the node&apos;s <code>AcceleratedHardwareReady</code>{' '}
            condition to False; automatic node repair then replaces or reboots the node. Both are on by default in Auto
            Mode; on self-managed Karpenter you add the <code>eks-node-monitoring-agent</code> add-on and the{' '}
            <code>NodeRepair</code> feature gate. Four details shape a training job. The condition is node-level, so
            one critical Xid marks the whole node. The repair waits after the condition changes: in the page&apos;s
            worked example, 10 minutes on Auto Mode and 30 on Karpenter v1.15.0 and later. On Auto Mode and Karpenter
            before v1.15.0 it does not drain the node first. And when too many nodes in a NodePool are unhealthy, it
            stops repairing{' '}
            <Cite tier={1} href={EKS_REPAIR}>
              EKS User Guide, GPU node repair
            </Cite>
            .
          </Box>
          <Box variant="p">
            The job restart stays yours: rescheduling the pods and restarting the job rely on standard Kubernetes
            mechanisms and the job&apos;s restart policy{' '}
            <Cite tier={1} href={EKS_BP_COMPUTE}>
              EKS Best Practices Guide, AI/ML compute
            </Cite>
            . With JobSet that is the failure policy above: every pod is recreated, and the script loads the newest
            checkpoint.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Use Batch on EKS for queues and scale-to-zero across many jobs, and check the two pieces its pages leave open before a long multi-node run"
          >
            AWS Batch on EKS: an overlay that owns nodes and admission
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AWS Batch orchestrates from outside the EKS cluster with no operators or custom resources to install,
            creates its own nodes, taints them so other workloads stay off, and scales them to zero by default when its
            queue is empty{' '}
            <Cite tier={1} href={BATCH_EKS}>
              AWS Batch User Guide, EKS compute environments
            </Cite>
            . Its multi-node parallel jobs are gang scheduling under another name, commonly used for large, tightly
            coupled work such as large language model training{' '}
            <Cite tier={1} href={BATCH_MNP}>
              AWS Batch User Guide, multi-node parallel jobs on EKS
            </Cite>
            , up to 1,000 instances of one type with one pod per node{' '}
            <Cite tier={1} href={BATCH_MNP_RUN}>
              AWS Batch User Guide, running multi-node parallel jobs
            </Cite>
            . Batch adds no charge of its own{' '}
            <Cite tier={1} href={BATCH_PRICING} accessed={R1}>
              AWS Batch pricing
            </Cite>
            , and updating the AMI and Kubernetes version stays yours{' '}
            <Cite tier={1} href={BATCH_SHARED}>
              AWS Batch User Guide, shared responsibility for EKS nodes
            </Cite>
            .
          </Box>
          <Box variant="p">
            Two pieces are open. No Batch page read in this research describes GPU node health handling for EKS
            compute environments{' '}
            <Cite tier={1} href={BATCH_MNP_RUN}>
              AWS Batch User Guide, running multi-node parallel jobs
            </Cite>
            . Batch&apos;s EFA page, which does not mention EKS, puts all EFA instances in one cluster placement group{' '}
            <Cite tier={1} href={BATCH_EFA}>
              AWS Batch User Guide, EFA
            </Cite>
            , and Capacity Blocks do not support placement groups{' '}
            <Cite tier={1} href={EC2_CB}>
              EC2 User Guide, Capacity Blocks
            </Cite>
            ; whether Batch on EKS relaxes that rule was not located. Our reading is that Batch on EKS fits many
            independent jobs beside a training cluster (evaluation sweeps, data preparation, small fine-tunes) better
            than one long pre-training run.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know what HyperPod adds on top of your EKS control plane, from health taints to process-level restarts, and which versions to test before you rely on it"
          >
            HyperPod EKS: AWS takes the nodes, their health and the restart
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            HyperPod EKS maps one EKS cluster, whose control plane you keep, to one HyperPod cluster of worker nodes{' '}
            <Cite tier={1} href={HP_EKS}>
              SageMaker Developer Guide, HyperPod with EKS
            </Cite>
            , and adds to every layer above them.
          </Box>
          <Box variant="p">
            <strong>Health.</strong> An agent checks every node continuously: DCGM policy violations, nvidia-smi
            errors, EC2 platform logs and the GPU count on NVIDIA, the Neuron monitor and device count on Trainium. A
            fault becomes Kubernetes state, a health label, a <code>NoSchedule</code> taint and a node condition{' '}
            <Cite tier={1} href={HP_HMA}>
              SageMaker Developer Guide, HyperPod health monitoring
            </Cite>
            . Deep health checks run at cluster creation and update, or on demand through{' '}
            <code>StartClusterHealthCheck</code>: DCGM diagnostics at level 4, EFA latency and bandwidth and an NCCL
            test on GPU instances; a Neuron hardware check that runs a training workload, and collective tests within
            and across Trainium nodes{' '}
            <Cite tier={1} href={HP_EKS_DEEP}>
              SageMaker Developer Guide, HyperPod EKS deep health checks
            </Cite>
            . HyperPod&apos;s Slurm page puts DCGM level 4 at about 45 to 90 minutes{' '}
            <Cite tier={1} href={HP_SLURM_DEEP} accessed={R1}>
              HyperPod Slurm deep health checks
            </Cite>
            . With automatic node recovery, the recommended setting, a faulty node is rebooted or replaced{' '}
            <Cite tier={1} href={HP_EKS_RECOVERY}>
              SageMaker Developer Guide, HyperPod EKS node recovery
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Admission.</strong> Task governance adds per-team compute allocations, priorities, lending of idle
            compute and preemption{' '}
            <Cite tier={1} href={HP_GOVERNANCE}>
              SageMaker Developer Guide, HyperPod task governance
            </Cite>
            , generally available since 2024-12-04{' '}
            <Cite tier={2} href={WN_GOVERNANCE}>
              AWS What&apos;s New, 2024-12-04
            </Cite>
            , and AWS recommends installing Kueue through it{' '}
            <Cite tier={1} href={HP_ELASTIC}>
              SageMaker Developer Guide, HyperPod elastic training
            </Cite>
            . Since 2026-04-08 it gang-schedules: a job whose pods are not all ready within a set time is pulled back
            and requeued{' '}
            <Cite tier={2} href={WN_GANG}>
              AWS What&apos;s New, 2026-04-08
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Restart.</strong> The HyperPod training operator, generally available since 2025-06-30{' '}
            <Cite tier={2} href={WN_OPERATOR}>
              AWS What&apos;s New, 2025-06-30
            </Cite>
            , restarts failed training processes in place before it restarts the whole job{' '}
            <Cite tier={1} href={HP_OPERATOR}>
              SageMaker Developer Guide, HyperPod training operator
            </Cite>
            . AWS&apos;s sample allows 3 process-level restarts in a 6-hour window before a job-level restart, and 1
            job-level restart before the job fails. Hang detection watches the log: each rule is a regular expression
            with a time to first match, a maximum gap between matches, or a threshold on a captured number such as
            samples per second, and the sample calls 5 minutes without a new batch line a hang. The log must go to{' '}
            <code>sys.stdout</code>{' '}
            <Cite tier={1} href={HP_OPERATOR_USAGE}>
              SageMaker Developer Guide, running jobs with the training operator
            </Cite>
            . Elastic training, which grows and shrinks a running job by its number of data-parallel replicas{' '}
            <Cite tier={1} href={HP_ELASTIC}>
              SageMaker Developer Guide, HyperPod elastic training
            </Cite>
            , is in section 19.
          </Box>
          <Box variant="p">
            <strong>Versions.</strong> The operator lists Kubernetes 1.28 to 1.33, Kueue v0.12.2 or v0.12.3 (suggested),
            and PyTorch 2.4.0 to 2.7.1{' '}
            <Cite tier={1} href={HP_OPERATOR}>
              SageMaker Developer Guide, HyperPod training operator
            </Cite>
            , while HyperPod&apos;s EKS AMI of 2026-10-16 ships for Kubernetes 1.31 to 1.36{' '}
            <Cite tier={1} href={HP_AMI_EKS}>
              HyperPod EKS AMI release notes
            </Cite>{' '}
            and EKS keeps 1.31 to 1.33 only on extended support{' '}
            <Cite tier={1} href={EKS_VERSIONS}>
              EKS User Guide, Kubernetes versions
            </Cite>
            , at {usd2(EKS_EXTENDED)} more per cluster-hour{' '}
            <Cite tier={1} href={EKS_PRICE}>
              Amazon EKS Price List, us-east-1
            </Cite>
            . Treat the operator&apos;s table as behind the platform, our reading, and confirm the operator on your
            Kubernetes, Kueue and PyTorch versions on a test cluster before a long run depends on it.
          </Box>
          <ExpandableSection headerText="A4 protocol (not yet run)">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>What it would measure.</strong> On one HyperPod EKS cluster with one ml.p5.48xlarge: the time
                the on-start deep health checks take; the training operator running a HyperPod recipe for Llama 3.1 8B
                fine-tuning at release 2.0.11; one killed process, to observe the in-place restart; a stalled log, to
                observe hang detection; and AWS&apos;s managed tiered checkpointing example, run unmodified (
                <Link external href={GUIDE_URL}>
                  research guide, section 5
                </Link>
                ).
              </Box>
              <Box variant="p">
                <strong>Prediction, our reading and not a result.</strong> Deep health checks inside the 45 to 90
                minutes above; the process restarted without a job-level restart; the hang rule firing after its
                maximum gap; and an answer on whether the operator runs on Kubernetes above 1.33.
              </Box>
              <Box variant="p">
                <strong>Cost and teardown.</strong> {A4_HOURS} hours at HyperPod&apos;s ${HP_P5.value} per
                ml.p5.48xlarge-hour is {usd(A4_COST)}, plus {usd2(EKS_CLUSTER)} per hour for EKS and EBS (Amazon
                Elastic Block Store) storage, our arithmetic on us-east-1 rates{' '}
                <Cite tier={1} href={HP_P5.source.url}>
                  SageMaker Price List, us-east-1, version 20261029165009
                </Cite>
                . Delete the HyperPod cluster, then the EKS cluster, then confirm with <code>list-clusters</code>.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Decide whether recovering from peers' memory is worth ${gb1(EXTRA_GB)} of every H100 in AWS's 70B recipe, and keep the storage checkpoint it falls back to`}
          >
            Checkpointless training: recovery from peers, paid for in HBM (high-bandwidth memory)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Checkpointless training is HyperPod EKS&apos;s deepest recovery: after a fault the job recovers from state
            its healthy peers hold in memory. It needs training operator v1.2.0 or later and is built on NVIDIA&apos;s
            NeMo framework{' '}
            <Cite tier={1} href={HP_CKPTLESS}>
              SageMaker Developer Guide, checkpointless training
            </Cite>
            ; v1.0.0 shipped on 2025-12-03 and v1.0.1 on 2026-04-10{' '}
            <Cite tier={1} href={HP_CKPTLESS_NOTES}>
              HyperPod checkpointless training release notes
            </Cite>
            . Model and optimizer states are replicated across groups of nodes; the healthy replicas finish their
            optimizer step and send the updated states to the recovering ones. Recovery tries in-process recovery
            first, then a process-level restart, and a job-level restart, with the failed node replaced, for a
            permanent node or GPU failure or a catastrophic one such as several nodes failing at once; where peer
            recovery is not feasible, or fails, it loads a checkpoint from storage{' '}
            <Cite tier={1} href={HP_CKPTLESS_IPR}>
              SageMaker Developer Guide, checkpointless in-process recovery
            </Cite>
            .
          </Box>
          <RecoveryLadderDiagram />
          <Box variant="p">
            The ladder places the other two paths too. The operator without checkpointless training starts at the
            second rung, where a restarted process has no peer state to receive and loads the job&apos;s checkpoint,
            our reading. A JobSet on self-managed EKS has only the third rung.
          </Box>
          <Box variant="p">
            The replication is the price. Checkpointless training requires{' '}
            <code>num_distributed_optimizer_instances</code> of at least 2, and AWS estimates one redundant replica at
            roughly one DCP (PyTorch Distributed Checkpoint) checkpoint&apos;s worth of device memory{' '}
            <Cite tier={1} href={HP_CKPTLESS_IPR}>
              SageMaker Developer Guide, checkpointless in-process recovery
            </Cite>
            . In Megatron Core the setting divides the data-parallel domain the distributed optimizer shards over{' '}
            <Cite tier={1} href={MG_DDP_CONFIG} kind="code">
              Megatron Core distributed_data_parallel_config.py L38-L41
            </Cite>
            , so at 2 each GPU holds twice as much FP32 (32-bit floating point) optimizer state. AWS&apos;s checkpointless
            pre-training recipe, Llama 3 70B on {RECIPE.nodes} ml.p5.48xlarge at TP (tensor parallelism) {RECIPE.tp}{' '}
            x PP (pipeline parallelism) {RECIPE.pp}, leaves DP (data parallelism) {RECIPE_DP}{' '}
            <Cite tier={1} href={recipe('L15-L55')} kind="code">
              HyperPod recipes 2.0.11, checkpointless_llama3_70b_pretrain.yaml L15-L55
            </Cite>
            . There, peer recovery costs <strong>{gb1(EXTRA_GB)} of each {HBM_GB.toFixed(0)} GB H100</strong>
            <Cite tier={1} href={H100_SPEC} kind="vendor-claim" accessed={R1}>
              NVIDIA H100 specification
            </Cite>
            , about {Math.round(EXTRA_CLUSTER_GB).toLocaleString('en-US')} GB across {RECIPE_GPUS} GPUs, in line with
            AWS&apos;s estimate; our arithmetic with Calculator B (section 5, The Memory Budget); estimate; confirm
            with a measured step.
          </Box>
          <ExpandableSection headerText={`How the ${gb1(EXTRA_GB)} is computed`}>
            <Box variant="p">
              Megatron prices BF16 (bfloat16) parameters with FP32 gradients at <code>6 + 12/d</code> bytes per
              parameter over d sharding ranks{' '}
              <Cite tier={1} href={MG_DIST_OPT}>
                Megatron Core distributed optimizer guide L14-L20
              </Cite>
              , and the recipe reduces gradients in FP32 with BF16 mixed precision{' '}
              <Cite tier={1} href={recipe('L48-L55')} kind="code">
                checkpointless_llama3_70b_pretrain.yaml L48-L55
              </Cite>
              . Each GPU holds 1/{RECIPE.tp * RECIPE.pp} of the model (TP x PP). With one optimizer instance, d ={' '}
              {RECIPE_DP} and each GPU holds {gb1(STATE_ONE_GB)} of model state; with the recipe&apos;s two, d ={' '}
              {RECIPE_DP / 2} and it holds {gb1(STATE_TWO_GB)}. The model size is Calculator B&apos;s Llama 3.1 70B
              preset of 70,553,706,496 parameters{' '}
              <Cite tier={1} href={HF_70B} accessed={R1}>
                Meta&apos;s Llama 3.1 70B model metadata
              </Cite>
              , which shares the recipe&apos;s 128,256-token vocabulary{' '}
              <Cite tier={1} href={recipe('L95-L98')} kind="code">
                checkpointless_llama3_70b_pretrain.yaml L95-L98
              </Cite>{' '}
              and, in our reading, the same 70B shape.
            </Box>
          </ExpandableSection>
          <Box variant="p">
            Three constraints come with it. The documented recipes are NeMo-based on p5.48xlarge{' '}
            <Cite tier={1} href={HP_CKPTLESS}>
              SageMaker Developer Guide, checkpointless training
            </Cite>
            , with a container pinned to PyTorch 2.6.0{' '}
            <Cite tier={1} href={HP_CKPTLESS_NOTES}>
              HyperPod checkpointless training release notes
            </Cite>
            ; AWS states that custom PyTorch models integrate with minimal modifications{' '}
            <Cite tier={2} href={WN_CKPTLESS} kind="vendor-claim">
              AWS What&apos;s New, 2025-12-03
            </Cite>
            . Elastic training does not currently support it{' '}
            <Cite tier={1} href={HP_ELASTIC}>
              SageMaker Developer Guide, HyperPod elastic training
            </Cite>
            . And it still writes checkpoints, asynchronously{' '}
            <Cite tier={1} href={recipe('L42')} kind="code">
              checkpointless_llama3_70b_pretrain.yaml L42
            </Cite>{' '}
            every 20 steps in the 70B recipe{' '}
            <Cite tier={1} href={recipe('L112')} kind="code">
              checkpointless_llama3_70b_pretrain.yaml L112
            </Cite>
            , for the storage fallback. AWS&apos;s goodput figure, upwards of 95% on clusters with thousands of
            accelerators, comes with no job size, failure rate or baseline{' '}
            <Cite tier={2} href={WN_CKPTLESS} kind="vendor-claim">
              AWS What&apos;s New, 2025-12-03
            </Cite>
            ; section 17, Failure Is the Steady State, weighs such figures.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Build the self-managed recipe for your own control, or the HyperPod EKS one for process-level restarts and hang detection, then prove each layer on a test run"
          >
            Assemble your cluster: two recipes and three checks
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Your own control: self-managed EKS.</strong> Provision a fixed fleet with node groups, or Karpenter
            with <code>consolidationPolicy: WhenEmpty</code>, reaching the Capacity Block through a launch template;
            weigh Auto Mode&apos;s convenience against {usd(AUTO_MONTH)} a month on {FLEET} p5.48xlarge. Install the
            NVIDIA and EFA device plugins (the Neuron DRA driver for Trainium), Kueue, and JobSet with a failure
            policy, versions pinned. Turn on node monitoring and automatic repair. Put the last save before the
            block&apos;s earliest edge: 40 minutes before the end on a managed node group, 30 otherwise.
          </Box>
          <Box variant="p">
            <strong>Process-level restarts and hang detection: HyperPod EKS.</strong> Keep automatic node recovery on,
            run deep health checks before a long run, install Kueue through task governance, and launch a{' '}
            <code>HyperPodPyTorchJob</code> with a log rule on the per-step line your script prints to{' '}
            <code>sys.stdout</code>, after confirming the operator on your versions. Add checkpointless training if you
            train with NeMo and can give up {gb1(EXTRA_GB)} of each H100.
          </Box>
          <Box variant="p">
            <strong>Then prove each layer.</strong> Submit a job larger than the free capacity and confirm none of its
            pods start. On one test node, inject Xid 79 (GPU fallen off the bus) with AWS&apos;s validation procedure{' '}
            <Cite tier={1} href={EKS_REPAIR}>
              EKS User Guide, GPU node repair
            </Cite>{' '}
            and watch the node replaced and the job resumed from its checkpoint. On HyperPod, stall the log and watch
            the hang rule fire. Section 24, The Slurm Family, is the Slurm counterpart, and section 28, Choosing Your
            Path, weighs the families.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
