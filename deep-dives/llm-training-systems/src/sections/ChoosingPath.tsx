import { useRef } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import {
  Cite,
  gh,
  ghTree,
  AWSOME_DISTRIBUTED_TRAINING_SHA,
  HYPERPOD_RECIPES_TAG,
  KUEUE_SHA,
  NEURON_SDK_SHA,
} from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import { EKS_FEES, INSTANCES, PCS_FEES, SOURCES } from '../lib/presets';
import type { InstanceId, PricePath } from '../lib/presets';
import { priceRun } from '../lib/runtime';
import type { CostResult, FeeLine } from '../lib/runtime';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Register date for rows cited without re-opening their source. */
const R1 = '2026-10-30';

/* SageMaker training jobs and pricing */
const SM_DG = 'https://docs.aws.amazon.com/sagemaker/latest/dg/';
const SM_CAPACITY = `${SM_DG}train-get-capacity.html`;
const API_STOPPING = 'https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_StoppingCondition.html';
const SM_PLANS = `${SM_DG}reserve-capacity-with-training-plans.html`;
const SM_PRICING_PAGE = 'https://aws.amazon.com/sagemaker/ai/pricing/';

/* SageMaker HyperPod */
const HP_HMA = `${SM_DG}sagemaker-hyperpod-eks-resiliency-health-monitoring-agent.html`;
const HP_SLURM_HEALTH = `${SM_DG}sagemaker-hyperpod-resiliency-slurm-cluster-health-check.html`;
const HP_SLURM_DEEP = `${SM_DG}sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html`;
const HP_EKS_DEEP = `${SM_DG}sagemaker-hyperpod-eks-resiliency-deep-health-checks.html`;
const HP_AUTO_RESUME = `${SM_DG}sagemaker-hyperpod-resiliency-slurm-auto-resume.html`;
const HP_OPERATOR = `${SM_DG}sagemaker-eks-operator.html`;
const HP_OPERATOR_USAGE = `${SM_DG}sagemaker-eks-operator-usage.html`;
const HP_ELASTIC = `${SM_DG}sagemaker-eks-elastic-training.html`;
const RECIPES_TREE = ghTree('aws/sagemaker-hyperpod-recipes', HYPERPOD_RECIPES_TAG);

/* Slurm, ParallelCluster and PCS */
const SLURM_SBATCH = 'https://slurm.schedmd.com/sbatch.html';
const PC_WHATIS = 'https://docs.aws.amazon.com/parallelcluster/latest/ug/what-is-aws-parallelcluster.html';
const PC_SUPPORT = 'https://docs.aws.amazon.com/parallelcluster/latest/ug/support-policy.html';
const PCS_SETTINGS = 'https://docs.aws.amazon.com/pcs/latest/userguide/slurm-custom-settings-cluster.html';
const AWSOME_70B_RESUME = gh(
  'awslabs/awsome-distributed-ai',
  AWSOME_DISTRIBUTED_TRAINING_SHA,
  'examples/training/fsdp/slurm/llama3_1_70b-training.sbatch',
  'L104-L109',
);

/* EKS, Kueue and AWS Batch */
const EKS_UG = 'https://docs.aws.amazon.com/eks/latest/userguide/';
const EKS_REPAIR = `${EKS_UG}ml-validate-gpu-node-repair.html`;
const EKS_TOPOLOGY = `${EKS_UG}ml-workload-topology.html`;
const KUEUE_GANG = gh('kubernetes-sigs/kueue', KUEUE_SHA, 'README.md', 'L19-L26');
const BATCH_UG = 'https://docs.aws.amazon.com/batch/latest/userguide/';
const BATCH_EKS = `${BATCH_UG}eks.html`;
const BATCH_MNP_RUN = `${BATCH_UG}mnp-eks-running-mnp-jobs.html`;
const BATCH_PRICING = 'https://aws.amazon.com/batch/pricing/';

/* Capacity */
const EC2_CB = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html';
const OD_QUOTAS = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html';

/* Neuron SDK documentation at the 2.33.0 commit */
function neuron(path: string, lines: string): string {
  return gh('aws-neuron/aws-neuron-sdk', NEURON_SDK_SHA, path, lines);
}
const TTN_ABOUT = 'training/torchtitan/about-torchtitan-neuron.rst';
const TTN_STACK = neuron(TTN_ABOUT, 'L19-L26');
const TTN_MATRIX = neuron(TTN_ABOUT, 'L37-L60');
const TTN_VALIDATED = neuron(TTN_ABOUT, 'L165-L200');
const NXDT_ARCHIVE = neuron('archive/nxd-training/index.rst', 'L21-L27');

/* ------------------------------------------------------------------------ */
/* Numbers: the dive's reference fleet, 32 p5.48xlarge for a 30-day month,  */
/* priced by Calculator A's cost panel so this page and sections 22 to 25   */
/* print the same figures                                                   */
/* ------------------------------------------------------------------------ */

const NVA = 'US East (N. Virginia)';
const P5: InstanceId = 'p5.48xlarge';
const FLEET = 32;
const MONTH_DAYS = 30;
const MONTH_HOURS = MONTH_DAYS * 24;
const GPUS_PER_P5 = INSTANCES[P5].acceleratorsPerInstance.value;

/** MaxRuntimeInSeconds tops out at 28 days (StoppingCondition API reference). */
const MAX_JOB_DAYS = 28;

const RUN: CostResult = priceRun({
  acceleratorHours: FLEET * GPUS_PER_P5 * MONTH_HOURS,
  accelerators: FLEET * GPUS_PER_P5,
  instance: P5,
  pcsControllerSize: 'small',
});

function pathLine(path: PricePath) {
  const line = RUN.lines.find((l) => l.path === path && l.region === NVA);
  if (!line) throw new RangeError(`ChoosingPath: no us-east-1 ${path} line for ${P5}`);
  return line;
}

function feeLine(fee: FeeLine['fee']): FeeLine {
  const line = RUN.fees.find((f) => f.fee === fee);
  if (!line) throw new RangeError(`ChoosingPath: no ${fee} fee for ${FLEET} x ${P5}`);
  return line;
}

const EC2 = pathLine('ec2OnDemand');
const TRAIN = pathLine('sagemakerTraining');
const HP = pathLine('hyperpod');
const EC2_RATE = EC2.usdPerUnitHour;
const TRAIN_RATE = TRAIN.usdPerUnitHour;
const HP_RATE = HP.usdPerUnitHour;
const EC2_MONTH = EC2.usd;
const HP_MONTH = HP.usd - EC2.usd;
const HP_DAY = HP_MONTH / MONTH_DAYS;
const PCS_MONTH = feeLine('pcs').usd;
const EKS_MONTH = feeLine('eks').usd;
const AUTO_MONTH = feeLine('eksAutoMode').usd;

const TRAIN_RATIO = (TRAIN_RATE / EC2_RATE).toFixed(2);
/** Our arithmetic: how far the training-job rate sits below the HyperPod node rate. */
const TRAIN_BELOW_HP = ((1 - TRAIN_RATE / HP_RATE) * 100).toFixed(1);

const PCS_SMALL_RATE = PCS_FEES.controllerUsdPerHour.small.value;
const PCS_SMALL_MAX = PCS_FEES.maxInstances.small.value;
const PCS_NODE_RATE = PCS_FEES.advancedNodeUsdPerInstanceHour.value;
const EKS_RATE = EKS_FEES.clusterUsdPerHour.value;
const autoModeP5 = EKS_FEES.autoModeUsdPerInstanceHour[P5];
if (!autoModeP5) throw new RangeError('ChoosingPath: no EKS Auto Mode fee for p5.48xlarge');
const AUTO_RATE = autoModeP5.value;

const usd = (v: number) => `$${Math.round(v).toLocaleString('en-US')}`;
const share = (v: number) => `${((100 * v) / EC2_MONTH).toFixed(1)}%`;

const PCS_SHARE = share(PCS_MONTH);
const HP_SHARE = share(HP_MONTH);

/* ------------------------------------------------------------------------ */
/* Diagram: the four-question tree with the seven paths as leaves           */
/* ------------------------------------------------------------------------ */

const FONT = 'sans-serif';
const INK = '#16191f';
const INK_DARK = '#0f1b2a';
const MUTED = '#5f6b7a';
const SLATE = '#414d5c';
const BLUE = '#0972d3';
const FEE_INK = '#8b6c00';

type Tone = 'question' | 'leaf' | 'capacity' | 'script' | 'trainium';
const TONES: Record<Tone, { fill: string; stroke: string }> = {
  question: { fill: '#f2f8fd', stroke: '#0972d3' },
  leaf: { fill: '#ffffff', stroke: '#879596' },
  capacity: { fill: '#fbf3d5', stroke: '#8b6c00' },
  script: { fill: '#e6f4f2', stroke: '#1f7a70' },
  trainium: { fill: '#efe7fb', stroke: '#6f4cc4' },
};

type LineKind = 'title' | 'ref' | 'when' | 'fee' | 'body';
interface Line {
  text: string;
  kind: LineKind;
}
const LINE_STYLE: Record<LineKind, { size: number; weight: number; fill: string }> = {
  title: { size: 13, weight: 600, fill: INK_DARK },
  ref: { size: 11, weight: 600, fill: BLUE },
  when: { size: 11, weight: 400, fill: MUTED },
  fee: { size: 11, weight: 600, fill: FEE_INK },
  body: { size: 11, weight: 400, fill: INK },
};

const FIRST = 18;
const STEP = 14;
const PAD = 12;
function cardH(lines: number): number {
  return FIRST + (lines - 1) * STEP + PAD;
}

const t = (text: string): Line => ({ text, kind: 'title' });
const r = (text: string): Line => ({ text, kind: 'ref' });
const w = (text: string): Line => ({ text, kind: 'when' });
const f = (text: string): Line => ({ text, kind: 'fee' });
const b = (text: string): Line => ({ text, kind: 'body' });

function Card({
  x,
  y,
  width,
  lines,
  tone,
  refRight,
  center,
}: {
  x: number;
  y: number;
  width: number;
  lines: Line[];
  tone: Tone;
  refRight?: string;
  center?: boolean;
}) {
  const c = TONES[tone];
  return (
    <g>
      <rect x={x} y={y} width={width} height={cardH(lines.length)} rx={6} fill={c.fill} stroke={c.stroke} strokeWidth={1.5} />
      {lines.map((l, i) => {
        const s = LINE_STYLE[l.kind];
        return (
          <text
            key={`${i}-${l.text}`}
            x={center ? x + width / 2 : x + 10}
            y={y + FIRST + i * STEP}
            fontFamily={FONT}
            fontSize={s.size}
            fontWeight={s.weight}
            fill={s.fill}
            textAnchor={center ? 'middle' : 'start'}
          >
            {l.text}
          </text>
        );
      })}
      {refRight && (
        <text
          x={x + width - 10}
          y={y + FIRST}
          fontFamily={FONT}
          fontSize={11}
          fontWeight={600}
          fill={BLUE}
          textAnchor="end"
        >
          {refRight}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, marker }: { x1: number; y1: number; x2: number; y2: number; marker: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={SLATE} strokeWidth={1.5} markerEnd={`url(#${marker})`} />;
}

function Spine({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return <line x1={x} y1={y1} x2={x} y2={y2} stroke={SLATE} strokeWidth={1.5} />;
}

function EdgeLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} fontFamily={FONT} fontSize={11} fontWeight={600} fill={SLATE}>
      {text}
    </text>
  );
}

function ArrowHead({ id }: { id: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill={SLATE} />
    </marker>
  );
}

interface Leaf {
  id: string;
  name: string;
  section: string;
  when: string;
  fee: string;
  yours: [string, string];
}

const SLURM_LEAVES: Leaf[] = [
  {
    id: 'ec2',
    name: 'Your own Slurm on EC2',
    section: 'section 24',
    when: 'When: a cluster you already run',
    fee: '$0 fee, plus the controller instance',
    yours: ['Yours: controller, node images, GPU', 'checks, node replacement and requeue'],
  },
  {
    id: 'pcs',
    name: 'AWS PCS',
    section: 'section 24',
    when: 'When: AWS runs only the controller',
    fee: `${usd(PCS_MONTH)} a month (${PCS_SHARE}), Small controller`,
    yours: ['Yours: node images, GPU health checks,', 'node replacement and requeue'],
  },
  {
    id: 'hps',
    name: 'HyperPod Slurm',
    section: 'section 24',
    when: 'When: AWS checks nodes, resumes the job',
    fee: `${usd(HP_MONTH)} a month (${HP_SHARE}), idle hours too`,
    yours: ['Yours: srun --auto-resume=1, on-start', 'deep checks switched on, a spare worker'],
  },
];

const K8S_LEAVES: Leaf[] = [
  {
    id: 'eks',
    name: 'Self-managed EKS',
    section: 'section 25',
    when: 'When: EKS repairs nodes, you restart jobs',
    fee: `${usd(EKS_MONTH)} a month; ${usd(AUTO_MONTH)} on Auto Mode`,
    yours: ['Yours: gang scheduler (Kueue), job API', 'and its restart (JobSet), device plugins'],
  },
  {
    id: 'batch',
    name: 'AWS Batch on EKS',
    section: 'section 25',
    when: 'When: many independent jobs share a queue',
    fee: `${usd(EKS_MONTH)} a month, the EKS cluster fee`,
    yours: ['Yours: image and Kubernetes updates; GPU', 'health and EFA not in the pages read'],
  },
  {
    id: 'hpe',
    name: 'HyperPod EKS',
    section: 'section 25',
    when: 'When: AWS checks nodes, restarts processes',
    fee: `${usd(HP_MONTH)} + ${usd(EKS_MONTH)} a month (${HP_SHARE}), idle too`,
    yours: ['Yours: containers, a per-step log line for', 'hang rules, checking operator versions'],
  },
];

function leafLines(l: Leaf): Line[] {
  return [t(l.name), w(l.when), f(l.fee), b(l.yours[0]), b(l.yours[1])];
}

const TREE_TITLE =
  `A decision tree of four questions for choosing an AWS training path, with fees for 32 p5.48xlarge over a ` +
  `30-day month in us-east-1, beyond the ${usd(EC2_MONTH)} EC2 On-Demand bill. Question 1, how long the cluster ` +
  `must exist: if every run fits one ${MAX_JOB_DAYS}-day job, SageMaker training jobs, at ${TRAIN_RATIO} times ` +
  `EC2 On-Demand while a job runs. Otherwise question 2, which scheduler the team runs, then question 3, who ` +
  `owns node health and the job restart. On Slurm: your own Slurm on EC2 for a cluster already running, no fee ` +
  `beyond the controller instance; AWS PCS, ${usd(PCS_MONTH)} a month, ${PCS_SHARE} of the EC2 bill; HyperPod ` +
  `Slurm, ${usd(HP_MONTH)} a month, ${HP_SHARE}. On Kubernetes: self-managed EKS, ${usd(EKS_MONTH)} a month or ` +
  `${usd(AUTO_MONTH)} on Auto Mode; AWS Batch on EKS, ${usd(EKS_MONTH)}; HyperPod EKS, ${usd(HP_MONTH)} plus ` +
  `${usd(EKS_MONTH)}. Question 4 applies to every leaf: on Trainium the team builds the Neuron training stack. ` +
  `Before any leaf, capacity comes first, and on every leaf the training script owns its checkpoints, the save ` +
  `before the reservation ends and a log line every step.`;

const Q1_TITLE = '1. How long must the cluster exist?';
const Q2_TITLE = '2. Which scheduler does your team already run?';
const Q3_TITLE = '3. Who owns node health and restart?';
const Q3_SUB = 'Read down the column: AWS owns more';
const ANSWER_JOBS = `every run fits one ${MAX_JOB_DAYS}-day job`;
const ANSWER_LONG = `a run past ${MAX_JOB_DAYS} days, or a shared pool`;

function TreeWide() {
  const W = 900;
  const M = 'choosing-tree-ah';
  const col1 = { x: 10, w: 236 };
  const col2 = { x: 260, w: 308 };
  const col3 = { x: 582, w: 308 };
  const q2 = { x: col2.x, w: col3.x + col3.w - col2.x };

  const q1Y = 50;
  const q1H = cardH(2);
  const rowY = q1Y + q1H + 36;
  const q2H = cardH(2);
  const q3Y = rowY + q2H + 32;
  const q3H = cardH(2);
  const cardsY = q3Y + q3H + 16;
  const leafH = cardH(5);
  const leafGap = 10;
  const leafY = (i: number) => cardsY + i * (leafH + leafGap);
  const cardsEnd = leafY(2) + leafH;

  const jobsLines = [
    t('SageMaker training jobs'),
    r('section 26'),
    f(`${TRAIN_RATIO}x EC2 On-Demand, billed`),
    f('only while a job runs'),
    b('Yours: your container, and'),
    b('checkpoints to the path SageMaker'),
    b('syncs, reloaded by the next job'),
  ];
  const jobsH = cardH(jobsLines.length);
  const capY = rowY + jobsH + 16;
  const capLines = [
    t('Capacity comes first'),
    b('EC2 P and Trn quotas start at 0;'),
    b('a Capacity Block or training plan'),
    b('fixes the start date, and a plan'),
    b('serves only the target it was'),
    b('bought for: pick the leaf first'),
    r('section 22'),
  ];
  const scriptY = capY + cardH(capLines.length) + 16;
  const scriptLines = [
    t('Your script, on every leaf'),
    b('Writes checkpoints and reloads'),
    b('the newest at start-up, saves'),
    b("before the reservation's edge,"),
    b('logs a line every step'),
    r('section 20'),
  ];

  const q4Y = Math.max(cardsEnd, scriptY + cardH(scriptLines.length)) + 16;
  const q4Lines = [
    t('4. Training on Trainium? On any leaf, the team builds the Neuron training stack: section 27'),
    b('No managed path read ships a current Trainium training recipe; Trainium deep health checks are documented on HyperPod EKS only'),
  ];
  const H = q4Y + cardH(q4Lines.length) + 12;

  const centre = (c: { x: number; w: number }) => c.x + c.w / 2;

  function family(col: { x: number; w: number }, leaves: Leaf[]) {
    const spineX = col.x + 8;
    const cardX = col.x + 22;
    return (
      <g>
        <Card x={col.x} y={q3Y} width={col.w} lines={[t(Q3_TITLE), w(Q3_SUB)]} tone="question" center />
        <Spine x={spineX} y1={q3Y + q3H} y2={leafY(leaves.length - 1) + leafH / 2} />
        {leaves.map((l, i) => (
          <g key={l.id}>
            <Arrow x1={spineX} y1={leafY(i) + leafH / 2} x2={cardX - 1} y2={leafY(i) + leafH / 2} marker={M} />
            <Card x={cardX} y={leafY(i)} width={col.w - 22} lines={leafLines(l)} tone="leaf" refRight={l.section} />
          </g>
        ))}
      </g>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby="choosing-tree-title"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <title id="choosing-tree-title">{TREE_TITLE}</title>
      <defs>
        <ArrowHead id={M} />
      </defs>
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
      <text x={10} y={22} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
        Four questions, seven paths
      </text>
      <text x={10} y={38} fontFamily={FONT} fontSize={11} fill={MUTED}>
        {`Fees: ${FLEET} p5.48xlarge for ${MONTH_DAYS} days in us-east-1, beyond the ${usd(EC2_MONTH)} EC2 On-Demand bill`}
      </text>

      <Card
        x={10}
        y={q1Y}
        width={880}
        lines={[
          t(Q1_TITLE),
          w('A cluster per job bills only while the job runs; a standing cluster bills for its whole life, idle hours included (section 20)'),
        ]}
        tone="question"
        center
      />
      <Arrow x1={centre(col1)} y1={q1Y + q1H} x2={centre(col1)} y2={rowY - 1} marker={M} />
      <EdgeLabel x={centre(col1) + 8} y={q1Y + q1H + 22} text={ANSWER_JOBS} />
      <Arrow x1={centre(q2)} y1={q1Y + q1H} x2={centre(q2)} y2={rowY - 1} marker={M} />
      <EdgeLabel x={centre(q2) + 8} y={q1Y + q1H + 22} text={ANSWER_LONG} />

      <Card x={col1.x} y={rowY} width={col1.w} lines={jobsLines} tone="leaf" />
      <Card x={col1.x} y={capY} width={col1.w} lines={capLines} tone="capacity" />
      <Card x={col1.x} y={scriptY} width={col1.w} lines={scriptLines} tone="script" />

      <Card
        x={q2.x}
        y={rowY}
        width={q2.w}
        lines={[t(Q2_TITLE), w('Slurm admits a whole job by itself; Kubernetes needs a gang scheduler added (sections 24 and 25)')]}
        tone="question"
        center
      />
      <Arrow x1={centre(col2)} y1={rowY + q2H} x2={centre(col2)} y2={q3Y - 1} marker={M} />
      <EdgeLabel x={centre(col2) + 8} y={rowY + q2H + 20} text="Slurm" />
      <Arrow x1={centre(col3)} y1={rowY + q2H} x2={centre(col3)} y2={q3Y - 1} marker={M} />
      <EdgeLabel x={centre(col3) + 8} y={rowY + q2H + 20} text="Kubernetes" />

      {family(col2, SLURM_LEAVES)}
      {family(col3, K8S_LEAVES)}

      <Card x={10} y={q4Y} width={880} lines={q4Lines} tone="trainium" center />
    </svg>
  );
}

function TreeNarrow() {
  const W = 400;
  const M = 'choosing-tree-narrow-ah';
  const right = 392;
  const L0 = 6;
  const L1 = 26;
  const L2 = 46;
  const L3 = 66;
  const gapLabel = 26;

  const q1Y = 62;
  const q1Lines = [t(Q1_TITLE), w('A cluster per job bills while the job runs; a'), w('standing cluster bills for its whole life (section 20)')];
  const q1H = cardH(q1Lines.length);

  const jobsY = q1Y + q1H + gapLabel;
  const jobsLines = [
    t('SageMaker training jobs'),
    f(`${TRAIN_RATIO}x EC2 On-Demand, billed only while a job runs`),
    b('Yours: your container, and checkpoints to the'),
    b('path SageMaker syncs, reloaded by the next job'),
  ];
  const jobsH = cardH(jobsLines.length);

  const q2Y = jobsY + jobsH + gapLabel;
  const q2Lines = [
    t('2. Which scheduler does your team run?'),
    w('Slurm admits a whole job by itself; Kubernetes'),
    w('needs a gang scheduler added (sections 24, 25)'),
  ];
  const q2H = cardH(q2Lines.length);

  const q3H = cardH(2);
  const leafH = cardH(5);
  const leafGap = 10;
  const groupH = q3H + 14 + 3 * leafH + 2 * leafGap;
  const slurmY = q2Y + q2H + gapLabel;
  const k8sY = slurmY + groupH + gapLabel;

  const everyY = k8sY + groupH + 20;
  const everyLines = [
    t('On every leaf'),
    b('Capacity first: EC2 P and Trn quotas start at 0, a'),
    b('Capacity Block or training plan fixes the start date,'),
    b('and a plan serves only the target it was bought for'),
    b('(section 22). Your script writes and reloads checkpoints,'),
    b("saves before the reservation's edge and logs a line every"),
    b('step (section 20).'),
  ];
  const q4Y = everyY + cardH(everyLines.length) + 12;
  const q4Lines = [
    t('4. Training on Trainium?'),
    b('On any leaf the team builds the Neuron training stack'),
    b('(section 27). No managed path read ships a current'),
    b('Trainium training recipe; Trainium deep health checks'),
    b('are documented on HyperPod EKS only.'),
  ];
  const H = q4Y + cardH(q4Lines.length) + 10;

  function group(y: number, label: string, leaves: Leaf[]) {
    const cardsY = y + q3H + 14;
    const leafY = (i: number) => cardsY + i * (leafH + leafGap);
    return (
      <g>
        <EdgeLabel x={L2} y={y - 8} text={label} />
        <Card x={L2} y={y} width={right - L2} lines={[t(Q3_TITLE), w('Read down: AWS owns more')]} tone="question" />
        <Spine x={L2 + 6} y1={y + q3H} y2={leafY(leaves.length - 1) + leafH / 2} />
        {leaves.map((l, i) => (
          <g key={l.id}>
            <Arrow x1={L2 + 6} y1={leafY(i) + leafH / 2} x2={L3 - 1} y2={leafY(i) + leafH / 2} marker={M} />
            <Card x={L3} y={leafY(i)} width={right - L3} lines={leafLines(l)} tone="leaf" refRight={l.section} />
          </g>
        ))}
      </g>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby="choosing-tree-narrow-title"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <title id="choosing-tree-narrow-title">{TREE_TITLE}</title>
      <defs>
        <ArrowHead id={M} />
      </defs>
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
      <text x={8} y={20} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
        Four questions, seven paths
      </text>
      <text x={8} y={36} fontFamily={FONT} fontSize={11} fill={MUTED}>
        {`Fees: ${FLEET} p5.48xlarge, ${MONTH_DAYS} days, us-east-1,`}
      </text>
      <text x={8} y={50} fontFamily={FONT} fontSize={11} fill={MUTED}>
        {`beyond the ${usd(EC2_MONTH)} EC2 On-Demand bill`}
      </text>

      <Card x={L0} y={q1Y} width={right - L0} lines={q1Lines} tone="question" />
      <Spine x={L0 + 6} y1={q1Y + q1H} y2={q2Y + q2H / 2} />
      <EdgeLabel x={L1} y={jobsY - 8} text={`If ${ANSWER_JOBS}:`} />
      <Arrow x1={L0 + 6} y1={jobsY + jobsH / 2} x2={L1 - 1} y2={jobsY + jobsH / 2} marker={M} />
      <Card x={L1} y={jobsY} width={right - L1} lines={jobsLines} tone="leaf" refRight="section 26" />

      <EdgeLabel x={L1} y={q2Y - 8} text={`If ${ANSWER_LONG}:`} />
      <Arrow x1={L0 + 6} y1={q2Y + q2H / 2} x2={L1 - 1} y2={q2Y + q2H / 2} marker={M} />
      <Card x={L1} y={q2Y} width={right - L1} lines={q2Lines} tone="question" />

      <Spine x={L1 + 6} y1={q2Y + q2H} y2={k8sY + q3H / 2} />
      <Arrow x1={L1 + 6} y1={slurmY + q3H / 2} x2={L2 - 1} y2={slurmY + q3H / 2} marker={M} />
      <Arrow x1={L1 + 6} y1={k8sY + q3H / 2} x2={L2 - 1} y2={k8sY + q3H / 2} marker={M} />
      {group(slurmY, 'If the team runs Slurm:', SLURM_LEAVES)}
      {group(k8sY, 'If the team runs Kubernetes:', K8S_LEAVES)}

      <Card x={L0} y={everyY} width={right - L0} lines={everyLines} tone="script" />
      <Card x={L0} y={q4Y} width={right - L0} lines={q4Lines} tone="trainium" />
    </svg>
  );
}

function DecisionTree() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, 640);
  return (
    <SpaceBetween size="xs">
      <div ref={ref}>{narrow ? <TreeNarrow /> : <TreeWide />}</div>
      <Box variant="small" color="text-body-secondary">
        Compiled from sections 20 and 22 to 27, not measured. Fees are our arithmetic on the us-east-1 Price List rates, for{' '}
        {FLEET} p5.48xlarge over a {MONTH_DAYS}-day month, beyond the EC2 On-Demand bill; the disclosure below shows
        each one with its offer version. The When and Yours lines are our reading of the section named on each leaf.
      </Box>
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

const PRE = { margin: 0, whiteSpace: 'pre', overflowX: 'auto' } as const;

const FEE_ARITHMETIC = [
  `EC2 On-Demand   ${EC2_RATE} x ${FLEET} x ${MONTH_HOURS} = ${usd(EC2_MONTH)}`,
  `Training jobs   (${TRAIN_RATE} - ${EC2_RATE}) x the instance-hours a job runs`,
  `PCS, Small      ${PCS_SMALL_RATE} x ${MONTH_HOURS} + ${PCS_NODE_RATE} x ${FLEET} x ${MONTH_HOURS} = ${usd(PCS_MONTH)}`,
  `HyperPod        (${HP_RATE} - ${EC2_RATE}) x ${FLEET} x ${MONTH_HOURS} = ${usd(HP_MONTH)}`,
  `EKS             ${EKS_RATE.toFixed(2)} x ${MONTH_HOURS} = ${usd(EKS_MONTH)}`,
  `EKS Auto Mode   ${AUTO_RATE} x ${FLEET} x ${MONTH_HOURS} + ${usd(EKS_MONTH)} = ${usd(AUTO_MONTH)}`,
].join('\n');

export function ChoosingPath() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={`Answer four questions and land on one of seven AWS paths, with its fee and the work it leaves your team: on ${FLEET} p5.48xlarge for a month, PCS (AWS Parallel Computing Service) adds ${PCS_SHARE} to the EC2 (Amazon Elastic Compute Cloud) bill to run the Slurm controller, and HyperPod ${HP_SHARE} to also check nodes, replace them and resume the job (us-east-1 AWS Price Lists and AWS documentation, read 2026-10-31)`}
          >
            28. Choosing Your Path
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every AWS path runs the same training step, one forward pass, backward pass and weight update (section 3,
            One Training Step: What It Computes and Keeps), with the same collectives over EFA (Elastic Fabric Adapter).
            What a path decides is who does the work around the step: who keeps a cluster standing, who starts a job on
            all of its nodes at once, who finds a failed GPU and replaces the node, and who restarts the job. Sections 20
            to 27 take each path apart. This section puts them back together as four questions asked in order, and each
            answer sends you to the section that sets that path up.
          </Box>
          <Box variant="p">
            The challenge is that each fee buys a different share of that work, and the fees sit far apart. On the
            dive&apos;s reference fleet, {FLEET} p5.48xlarge for a {MONTH_DAYS}-day month in us-east-1, PCS adds{' '}
            {usd(PCS_MONTH)} to a {usd(EC2_MONTH)} EC2 On-Demand bill and SageMaker HyperPod adds {usd(HP_MONTH)}:{' '}
            <strong>
              {PCS_SHARE} against {HP_SHARE}
            </strong>
            . Whether the difference is worth paying depends on what your team would otherwise build and run, which is
            what the questions sort out. The tree is our reading of sections 20 to 27, and each branch cites what it
            rests on.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Walk the tree from the top and stop at a leaf: its fee line says what the path costs beyond EC2, and its last lines say what stays with your team"
          >
            Four questions, seven paths
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Ask the questions in order. The first decides whether you need a standing cluster at all. The second picks
            the family: Slurm, or Kubernetes on EKS (Amazon Elastic Kubernetes Service). The third picks the path inside
            the family by how much of node health and job restart AWS takes on. The fourth applies to every leaf when
            the accelerator is Trainium. Each leaf names the section that sets the path up.
          </Box>
          <DecisionTree />
          <ExpandableSection headerText="How each fee line is computed">
            <SpaceBetween size="s">
              <pre style={PRE}>
                <code>{FEE_ARITHMETIC}</code>
              </pre>
              <Box variant="p">
                Our arithmetic, computed by Calculator A&apos;s cost panel (section 22) for {FLEET} instances over{' '}
                {MONTH_HOURS} hours in us-east-1. Rates: EC2 On-Demand{' '}
                <Cite tier={1} href={SOURCES.ec2PriceUse1.url}>
                  EC2 Price List, us-east-1, version 20261029175634
                </Cite>
                ; the training-job and HyperPod cluster rates{' '}
                <Cite tier={1} href={SOURCES.sagemakerUse1.url}>
                  SageMaker Price List, us-east-1, version 20261029165009
                </Cite>
                ; the PCS controller and the advanced node fee for P and Trn instances{' '}
                <Cite tier={1} href={SOURCES.pcsPrice.url}>
                  AWS PCS Price List, us-east-1, version 20261027150327
                </Cite>
                ; the EKS cluster-hour and the Auto Mode management fee{' '}
                <Cite tier={1} href={SOURCES.eksPrice.url}>
                  Amazon EKS Price List, us-east-1, version 20261027191639
                </Cite>
                . The HyperPod line is the premium inside the cluster rate, about {usd(HP_DAY)} a day; HyperPod EKS adds
                the EKS cluster fee on top. A Small PCS controller holds up to {PCS_SMALL_MAX} instances{' '}
                <Cite tier={1} href={SOURCES.pcsSizes.url} accessed={R1}>
                  AWS PCS User Guide, cluster size
                </Cite>
                , exactly this fleet. Your own Slurm on EC2 adds no fee beyond the controller instance it runs on{' '}
                <Cite tier={1} href={PC_WHATIS}>
                  What is AWS ParallelCluster
                </Cite>
                , and AWS Batch adds no charge of its own over the EKS cluster{' '}
                <Cite tier={1} href={BATCH_PRICING} accessed={R1}>
                  AWS Batch pricing
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
            description={`Pick a cluster per job when every run fits in one job of up to ${MAX_JOB_DAYS} days and nothing needs a standing cluster, because it bills only while the job runs`}
          >
            Question 1: how long the cluster has to exist
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A SageMaker training job is a cluster that exists for one job: its instances are provisioned when the job
            starts and released when it completes, paid per second{' '}
            <Cite tier={1} href={SM_CAPACITY}>
              SageMaker Developer Guide, get compute capacity for training jobs
            </Cite>
            , at {TRAIN_RATIO} times EC2 On-Demand, ${TRAIN_RATE} against ${EC2_RATE} per p5.48xlarge-hour in
            us-east-1{' '}
            <Cite tier={1} href={SOURCES.sagemakerUse1.url}>
              SageMaker Price List, us-east-1
            </Cite>{' '}
            <Cite tier={1} href={SOURCES.ec2PriceUse1.url}>
              EC2 Price List, us-east-1
            </Cite>
            . One job runs for at most {MAX_JOB_DAYS} days{' '}
            <Cite tier={1} href={API_STOPPING}>
              SageMaker API reference, StoppingCondition
            </Cite>
            . Fine-tuning and post-training runs of hours or days fit well inside that limit: section 16, Fine-Tuning
            &amp; Post-Training Runs, sizes them, and section 26, SageMaker Training Jobs, sets them up.
          </Box>
          <Box variant="p">
            A standing cluster bills for every instance it holds, busy or idle: a HyperPod cluster is billed per
            instance-hour for as long as it exists{' '}
            <Cite tier={1} href={SM_PRICING_PAGE} accessed={R1}>
              SageMaker AI pricing
            </Cite>
            . Per busy hour the two SageMaker shapes are close, ${TRAIN_RATE} against ${HP_RATE} per ml.p5.48xlarge-hour,
            the training job {TRAIN_BELOW_HP}% lower, our arithmetic. What separates them is the idle hours a standing
            cluster bills and the start-up each new job pays (section 20, Who Owns What on AWS). A run past{' '}
            {MAX_JOB_DAYS} days, or a pool that a team keeps busy with many jobs, goes on to question 2.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Let the scheduler your team already operates pick the family: the launch script carries over between paths inside a family, and the operating knowledge stays with the family"
          >
            Question 2: Slurm or Kubernetes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A synchronous training job needs all of its ranks (one training process per accelerator) running before it
            takes a step, because every step ends in a collective, an exchange that every rank must join. The scheduler
            therefore has to start the whole job or none of it, which is called gang scheduling. Slurm does it by
            construction: a job asks for a node count that is both its minimum and its maximum, and waits in the queue
            until those nodes are free{' '}
            <Cite tier={1} href={SLURM_SBATCH}>
              Slurm sbatch documentation
            </Cite>
            . The default Kubernetes scheduler does not provide it, so the EKS guide tells training users to add a batch
            scheduler or queueing system that does{' '}
            <Cite tier={1} href={EKS_TOPOLOGY} accessed={R1}>
              EKS User Guide, network topology
            </Cite>
            ; Kueue, for one, starts no pod until there is quota for all of them, by default{' '}
            <Cite tier={1} href={KUEUE_GANG}>
              Kueue README at v0.20.4, L19-L26
            </Cite>
            .
          </Box>
          <Box variant="p">
            Both families train the same model, so the difference is what the team operates. A team that writes{' '}
            <code>slurm.conf</code> and batch scripts today stays on Slurm, and a team that runs EKS clusters and their
            add-ons stays on Kubernetes, our reading. Inside a family the launch carries over: AWS&apos;s Llama 3.1 70B
            sample is one batch script for every Slurm cluster, adding HyperPod&apos;s auto-resume flag only when it
            finds a HyperPod node{' '}
            <Cite tier={1} href={AWSOME_70B_RESUME} kind="code">
              awsome-distributed-ai llama3_1_70b-training.sbatch L104-L109
            </Cite>
            . The family is the choice that is costly to reverse, and the path inside it the cheaper one, our reading.
            Section 24, The Slurm Family, and section 25, The Kubernetes Family, go one level down.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Decide what the fee buys: ${PCS_SHARE} of the EC2 bill for a managed Slurm controller, ${HP_SHARE} for AWS to also check every node, replace a failed one and resume the job`}
          >
            Question 3: who owns node health and the job restart
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A failed GPU needs two recoveries. Node recovery finds the bad node and replaces it. Job recovery restarts
            the training processes and reloads the last checkpoint, the saved weights and optimizer state, which the job
            itself must have written (section 20). The paths in each family differ in how many of the two AWS runs, and
            the fee follows.
          </Box>
          <Box variant="p">
            <strong>On Slurm.</strong> Your own cluster on EC2 leaves every check, replacement and requeue to the team.
            AWS ParallelCluster deploys one and charges nothing itself, and its user guide opens by recommending PCS for
            HPC (high-performance computing) and AI workloads{' '}
            <Cite tier={1} href={PC_WHATIS}>
              AWS ParallelCluster User Guide
            </Cite>
            , so this leaf is for clusters already running. PCS runs the Slurm controller and leaves the node image,
            GPU health checks and requeue to Slurm settings you configure{' '}
            <Cite tier={1} href={PCS_SETTINGS}>
              AWS PCS User Guide, custom Slurm settings for clusters
            </Cite>
            , for ${PCS_SMALL_RATE} per hour for a Small controller plus ${PCS_NODE_RATE} per P or Trn instance-hour{' '}
            <Cite tier={1} href={SOURCES.pcsPrice.url}>
              AWS PCS Price List, us-east-1
            </Cite>
            : {usd(PCS_MONTH)} a month on the reference fleet, {PCS_SHARE}. HyperPod Slurm runs a health-monitoring agent
            on every node{' '}
            <Cite tier={1} href={HP_HMA}>
              SageMaker Developer Guide, HyperPod health monitoring
            </Cite>{' '}
            <Cite tier={1} href={HP_SLURM_HEALTH} accessed={R1}>
              HyperPod Slurm cluster health checks
            </Cite>
            , can screen nodes before they join with deep health checks whose DCGM (NVIDIA Data Center GPU Manager)
            diagnostics typically take about 45 to 90 minutes{' '}
            <Cite tier={1} href={HP_SLURM_DEEP}>
              HyperPod Slurm deep health checks
            </Cite>
            , reboots or replaces faulty nodes by default, and restarts a job step launched with{' '}
            <code>srun --auto-resume=1</code> once the faulty nodes are replaced, the step reloading its own last
            checkpoint{' '}
            <Cite tier={1} href={HP_AUTO_RESUME}>
              HyperPod Slurm auto-resume
            </Cite>
            . Its premium sits in the cluster rate, ${HP_RATE} against ${EC2_RATE} per instance-hour{' '}
            <Cite tier={1} href={SOURCES.sagemakerUse1.url}>
              SageMaker Price List, us-east-1
            </Cite>
            : about {usd(HP_DAY)} a day and {usd(HP_MONTH)} a month on the same fleet, {HP_SHARE}, idle hours included.
          </Box>
          <Box variant="p">
            <strong>On Kubernetes.</strong> Self-managed EKS repairs GPU nodes itself: the EKS node monitoring agent
            reads Xid errors (the NVIDIA driver&apos;s numbered GPU error reports) from DCGM, and automatic node repair
            replaces or reboots the node, on by default in EKS Auto Mode and an add-on plus a Karpenter feature gate
            otherwise{' '}
            <Cite tier={1} href={EKS_REPAIR}>
              EKS User Guide, GPU node repair
            </Cite>
            . Gang admission, the job API and the job restart stay with the team (section 25). EKS charges $
            {EKS_RATE.toFixed(2)} per cluster-hour, {usd(EKS_MONTH)} a month, and Auto Mode adds ${AUTO_RATE} per
            p5.48xlarge-hour, {usd(AUTO_MONTH)} a month with the cluster fee{' '}
            <Cite tier={1} href={SOURCES.eksPrice.url}>
              Amazon EKS Price List, us-east-1
            </Cite>
            . AWS Batch on EKS schedules jobs onto nodes it creates and scales them to zero by default when its queue is
            empty{' '}
            <Cite tier={1} href={BATCH_EKS}>
              AWS Batch User Guide, EKS compute environments
            </Cite>
            ; no Batch page read in this research describes GPU node health handling for its EKS compute environments{' '}
            <Cite tier={1} href={BATCH_MNP_RUN}>
              AWS Batch User Guide, running multi-node parallel jobs
            </Cite>
            , and section 25 reads it as a fit for many independent jobs beside a training cluster. HyperPod EKS adds
            the health agent and deep health checks, Trainium included{' '}
            <Cite tier={1} href={HP_EKS_DEEP}>
              HyperPod EKS deep health checks
            </Cite>
            , and a training operator that restarts failed processes in place before it restarts the whole job{' '}
            <Cite tier={1} href={HP_OPERATOR}>
              SageMaker Developer Guide, HyperPod training operator
            </Cite>
            , at the HyperPod rate plus the EKS cluster fee.
          </Box>
          <Box variant="p">
            Weigh the two numbers that carry this question: {usd(PCS_MONTH)} against {usd(HP_MONTH)} a month for the same{' '}
            {FLEET} instances, <strong>{PCS_SHARE} against {HP_SHARE}</strong> of the EC2 bill. PCS and self-managed
            EKS suit a team that already runs the pieces they leave it, or will build them: burn-in jobs (tests a node
            passes before it takes work), the job restart and, on PCS, the GPU health checks. HyperPod suits a team that
            would otherwise build and staff all of that, our reading. Sections 24 and 25 list what each path leaves you.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="On Trainium, choose the path for its capacity and health checks, and plan to build the Neuron training stack yourself on any of them"
          >
            Question 4: GPU or Trainium
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Trainium runs the same training step on its own software stack, Neuron. NxD (NeuronX Distributed) Training
            reached end-of-support as of Neuron 2.32{' '}
            <Cite tier={1} href={NXDT_ARCHIVE}>
              Neuron 2.33 NxD Training archive L21-L27
            </Cite>
            , and the stack AWS supports for training today is TorchTitan Neuron on TorchNeuron, PyTorch&apos;s native
            Neuron backend{' '}
            <Cite tier={1} href={TTN_STACK}>
              What is TorchTitan Neuron? L19-L26
            </Cite>
            , both in beta at Neuron 2.33.0 (section 27). On every path the team builds that stack: the HyperPod recipes repository holds no Trainium training
            recipe at release {HYPERPOD_RECIPES_TAG}{' '}
            <Cite tier={1} href={RECIPES_TREE} kind="code">
              sagemaker-hyperpod-recipes tree at {HYPERPOD_RECIPES_TAG}
            </Cite>
            , our check of its tree, and none of the managed paths read ships a current one (section 27).
          </Box>
          <Box variant="p">
            What differs between the paths on Trainium is capacity and health checking. trn2.48xlarge Capacity Blocks
            (instances reserved for a fixed date window; section 22) are offered in US East (Ohio) and Asia Pacific
            (Hyderabad){' '}
            <Cite tier={1} href={EC2_CB}>
              EC2 User Guide, Capacity Blocks, supported instance types and Regions
            </Cite>
            . HyperPod EKS documents deep health checks for Trainium, including a Neuron hardware check that runs a
            training workload{' '}
            <Cite tier={1} href={HP_EKS_DEEP}>
              HyperPod EKS deep health checks
            </Cite>
            , while HyperPod Slurm&apos;s deep health checks list GPU instances only{' '}
            <Cite tier={1} href={HP_SLURM_DEEP}>
              HyperPod Slurm deep health checks
            </Cite>
            . Section 27, Trainium: The Neuron Path, counts ranks the Neuron way and lists what each path supplies; for
            a GPU run, section 21, Training Hardware on AWS, picks the instance.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Take the first action your leaf starts with: secure capacity for the path you chose, build the three things your script owns, then create the cluster with the checks its section names"
          >
            Start on your leaf
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Capacity comes first,</strong> because it sets the start date (section 22, Capacity &amp; Cost). On
            EC2 the default quotas for Running On-Demand P and Trn instances are 0{' '}
            <Cite tier={1} href={OD_QUOTAS} accessed={R1}>
              EC2 On-Demand Instance quotas
            </Cite>
            , so open a quota request for your Region; on the SageMaker paths the quota is SageMaker&apos;s, for
            training jobs or for HyperPod, and it must exceed the instance count of any plan you buy{' '}
            <Cite tier={1} href={SM_PLANS}>
              SageMaker Developer Guide, training plans
            </Cite>
            . For a fixed start date, search for a Capacity Block, up to 64 instances each and 256 across an
            organization&apos;s blocks on any date{' '}
            <Cite tier={1} href={EC2_CB}>
              EC2 User Guide, Capacity Blocks
            </Cite>
            , or for a training plan, SageMaker&apos;s reservation of the same kind. Choose the leaf before you buy a
            plan: a plan is specific to its target, training jobs or HyperPod, and cannot be interchanged{' '}
            <Cite tier={1} href={SM_PLANS}>
              SageMaker Developer Guide, training plans
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Then build three things into the training script,</strong> because no leaf does them for you
            (section 20). Write checkpoints and reload the newest at start-up, since every automatic restart on every
            leaf resumes from the job&apos;s own checkpoint. Finish a save before the reservation&apos;s edge: EC2
            begins terminating a Capacity Block&apos;s instances at 11:00 UTC (Coordinated Universal Time) on its final
            day, 30 minutes before the 11:30 end{' '}
            <Cite tier={1} href={EC2_CB}>
              EC2 User Guide, Capacity Blocks
            </Cite>
            , and on a training plan the edge comes 30 minutes before the plan ends for training jobs and one hour
            before for a HyperPod cluster{' '}
            <Cite tier={1} href={SM_PLANS}>
              SageMaker Developer Guide, training plans
            </Cite>
            . And print a log line every step, the heartbeat the HyperPod training operator&apos;s hang detection
            matches{' '}
            <Cite tier={1} href={HP_OPERATOR_USAGE} accessed={R1}>
              SageMaker Developer Guide, running jobs with the training operator
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Then create the cluster with the checks its section names:</strong>
          </Box>
          <ul>
            <li>
              <strong>SageMaker training jobs</strong> (section 26): run a small job that saves per-rank checkpoint
              files under <code>/opt/ml/checkpoints</code>, stop it mid-run, and confirm that a new job on the same
              checkpoint prefix resumes at the saved step.
            </li>
            <li>
              <strong>Your own Slurm on EC2</strong> (section 24): keep a ParallelCluster cluster on the 3.16 line,
              supported to 2028-02-20{' '}
              <Cite tier={1} href={PC_SUPPORT} accessed={R1}>
                AWS ParallelCluster support policy
              </Cite>
              ; add a <code>HealthCheckProgram</code> and <code>--requeue</code>, and build the next cluster on PCS or
              HyperPod Slurm.
            </li>
            <li>
              <strong>AWS PCS</strong> (section 24): size the controller for the largest fleet you expect, since a
              Small controller holds up to {PCS_SMALL_MAX} instances and a different size means a new cluster{' '}
              <Cite tier={1} href={SOURCES.pcsSizes.url} accessed={R1}>
                AWS PCS User Guide, cluster size
              </Cite>
              ; bake a <code>HealthCheckProgram</code> and a burn-in job into your node image, and set{' '}
              <code>JobRequeue</code>.
            </li>
            <li>
              <strong>HyperPod Slurm</strong> (section 24): set <code>OnStartDeepHealthChecks</code> to InstanceStress
              and InstanceConnectivity on the worker groups{' '}
              <Cite tier={1} href={HP_SLURM_DEEP}>
                HyperPod Slurm deep health checks
              </Cite>
              , launch the training step with <code>srun --auto-resume=1</code> inside one exclusive allocation{' '}
              <Cite tier={1} href={HP_AUTO_RESUME}>
                HyperPod Slurm auto-resume
              </Cite>
              , and keep one spare worker so a resume does not wait for a replacement&apos;s checks, our reading of
              the deep health check page in section 24.
            </li>
            <li>
              <strong>Self-managed EKS</strong> (section 25): provision the fleet with node groups or Karpenter,
              install the device plugins, Kueue and JobSet, turn on node monitoring and automatic repair, then submit a
              job larger than the free capacity and confirm that none of its pods start.
            </li>
            <li>
              <strong>AWS Batch on EKS</strong> (section 25): give it evaluation sweeps, data preparation and small
              fine-tunes beside a training cluster, and test GPU fault handling and EFA placement yourself before a long
              multi-node run.
            </li>
            <li>
              <strong>HyperPod EKS</strong> (section 25): keep automatic node recovery on, run deep health checks before
              a long run, install Kueue through task governance{' '}
              <Cite tier={1} href={HP_ELASTIC} accessed={R1}>
                SageMaker Developer Guide, HyperPod elastic training
              </Cite>
              , and confirm the training operator on your versions first, since its support table lists Kubernetes 1.28
              to 1.33{' '}
              <Cite tier={1} href={HP_OPERATOR}>
                SageMaker Developer Guide, HyperPod training operator
              </Cite>
              .
            </li>
            <li>
              <strong>Trainium on any leaf</strong> (section 27): pin Neuron 2.33.0{' '}
              <Cite tier={1} href={TTN_MATRIX}>
                What is TorchTitan Neuron? L37-L60
              </Cite>{' '}
              and run a layout TorchTitan Neuron validates on one trn2.48xlarge before anything larger{' '}
              <Cite tier={1} href={TTN_VALIDATED}>
                What is TorchTitan Neuron? L165-L200
              </Cite>
              .
            </li>
          </ul>
          <Box variant="p">
            Then bring the cluster up one rung at a time, a single node first and the full run last, with section 31,
            Bring-Up: From One Node to the Full Run.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
