import { useRef } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, gh, ghTree, HYPERPOD_RECIPES_TAG, SAGEMAKER_SDK_TAG } from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import { DEFAULT_MFU, DENSE_MODELS, INSTANCES, PRICES, SOURCES, shapeOf } from '../lib/presets';
import type { PricePath } from '../lib/presets';
import { denseRuntimeInputs, estimateRun, priceRun } from '../lib/runtime';
import type { CostResult, CostLine } from '../lib/runtime';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Register date for rows cited without re-opening their source. */
const R1 = '2026-10-30';

const SM_DG = 'https://docs.aws.amazon.com/sagemaker/latest/dg/';
const SM_API = 'https://docs.aws.amazon.com/sagemaker/latest/APIReference/';

/* SageMaker Developer Guide pages, re-opened 2026-10-31 unless passed R1. */
const SM_DIST = `${SM_DG}distributed-training.html`;
const SM_CAPACITY = `${SM_DG}train-get-capacity.html`;
const SM_CHECKPOINTS = `${SM_DG}model-checkpoints.html`;
const SM_CHECKPOINT_RESUME = `${SM_DG}model-checkpoints-resume.html`;
const SM_REPAIR = `${SM_DG}model-checkpoints-cluster-repair.html`;
const SM_SPOT = `${SM_DG}model-managed-spot-training.html`;
const SM_WARM = `${SM_DG}train-warm-pools.html`;
const SM_HETERO = `${SM_DG}train-heterogeneous-cluster.html`;
const SM_PLANS = `${SM_DG}reserve-capacity-with-training-plans.html`;
const SM_PLAN_JOBS = `${SM_DG}training-plan-utilization-for-training-jobs.html`;
const SMP_V2 = `${SM_DG}model-parallel-v2.html`;
const SMP_USE = `${SM_DG}model-parallel-use-api-v2.html`;
const SMP_NOTES = `${SM_DG}model-parallel-release-notes.html`;
const SMDDP_NOTES = `${SM_DG}data-parallel-release-notes.html`;
const HP_SLURM = `${SM_DG}sagemaker-hyperpod-slurm.html`;
const HP_RECIPES_DOC = `${SM_DG}sagemaker-hyperpod-recipes.html`;
const HP_CHECKPOINTLESS = `${SM_DG}sagemaker-eks-checkpointless.html`;
const SM_TRN_JOBS_TUTORIAL = `${SM_DG}sagemaker-hyperpod-trainium-sagemaker-training-jobs-pretrain-tutorial.html`;
const SM_PRICING_PAGE = 'https://aws.amazon.com/sagemaker/ai/pricing/';

/* SageMaker API reference. */
const API_DESCRIBE = `${SM_API}API_DescribeTrainingJob.html`;
const API_STOPPING = `${SM_API}API_StoppingCondition.html`;
const API_RETRY = `${SM_API}API_RetryStrategy.html`;
const API_INFRA = `${SM_API}API_InfraCheckConfig.html`;

/* AWS Batch service jobs. */
const BATCH_SERVICE_JOBS = 'https://docs.aws.amazon.com/batch/latest/userguide/service-jobs.html';
const WN_BATCH_JOBS = 'https://aws.amazon.com/about-aws/whats-new/2025/07/aws-batch-sagemaker-training-jobs/';
const WN_BATCH_QUOTA = 'https://aws.amazon.com/about-aws/whats-new/2026/03/aws-batch-quota-management-preemption-sagemaker/';

/* SageMaker Python SDK v3.28.0 (commit 94899a91d3e2e44771cb43c23cdc9923b2459cfe), read 2026-10-31. */
const SDK = 'aws/sagemaker-python-sdk';
const SDK_README = gh(SDK, SAGEMAKER_SDK_TAG, 'README.rst', 'L40-L90');
const SDK_SMP = gh(SDK, SAGEMAKER_SDK_TAG, 'sagemaker-train/src/sagemaker/train/distributed.py', 'L26-L77');
const SDK_TORCHRUN = gh(SDK, SAGEMAKER_SDK_TAG, 'sagemaker-train/src/sagemaker/train/distributed.py', 'L113-L128');
const SDK_DEFAULTS = gh(SDK, SAGEMAKER_SDK_TAG, 'sagemaker-train/src/sagemaker/train/defaults.py', 'L52-L55');
const SDK_STOP_DEFAULT = gh(SDK, SAGEMAKER_SDK_TAG, 'sagemaker-train/src/sagemaker/train/defaults.py', 'L156-L174');
const SDK_TRAINER = 'sagemaker-train/src/sagemaker/train/model_trainer.py';
const SDK_SMP_WIRING = gh(SDK, SAGEMAKER_SDK_TAG, SDK_TRAINER, 'L799-L801');
const SDK_DRY_RUN = gh(SDK, SAGEMAKER_SDK_TAG, SDK_TRAINER, 'L920-L955');
const SDK_INFRA = gh(SDK, SAGEMAKER_SDK_TAG, SDK_TRAINER, 'L1935-L1954');
const SDK_FROM_RECIPE = gh(SDK, SAGEMAKER_SDK_TAG, SDK_TRAINER, 'L1410-L1411');
const SDK_CHECKPOINT_DEFAULT = gh(SDK, SAGEMAKER_SDK_TAG, SDK_TRAINER, 'L738-L742');
const SDK_CHECKPOINT_CONFIG = gh(SDK, SAGEMAKER_SDK_TAG, 'sagemaker-core/src/sagemaker/core/training/configs.py', 'L350-L366');
const SDK_QUEUE = gh(SDK, SAGEMAKER_SDK_TAG, 'sagemaker-train/src/sagemaker/train/aws_batch/training_queue.py', 'L26-L47');

/* HyperPod recipes. */
const RECIPES = 'aws/sagemaker-hyperpod-recipes';
const RECIPES_TREE = ghTree(RECIPES, HYPERPOD_RECIPES_TAG, 'hyperpod_recipes/recipes_src/training');
const RECIPES_SRC_TREE = ghTree(RECIPES, HYPERPOD_RECIPES_TAG, 'hyperpod_recipes/recipes_src');
const RECIPE_70B = gh(
  RECIPES,
  HYPERPOD_RECIPES_TAG,
  'hyperpod_recipes/recipes_src/training/llama/checkpointless_llama3_70b_pretrain.yaml',
  'L3-L112',
);
/** Release v1.5.1 (a commit of 2025-08-14) and the v2.0.0 release notes, read for the register. */
const RECIPES_V151 = ghTree(RECIPES, 'a9ba8bf184ec8b912936bed828ce7ee8554fab3f', 'recipes_collection/recipes/training');
const RECIPES_V200 = 'https://github.com/aws/sagemaker-hyperpod-recipes/releases/tag/v2.0.0';

/* ------------------------------------------------------------------------ */
/* Numbers, all read from the calculators' presets                          */
/* ------------------------------------------------------------------------ */

/** A us-east-1 (or the row's own Region) p5.48xlarge rate from the shared price table. */
function p5Rate(path: PricePath): number {
  const row = PRICES.find((p) => p.instance === 'p5.48xlarge' && p.path === path && p.region === 'US East (N. Virginia)');
  if (!row) throw new RangeError(`TrainingJobs: no us-east-1 p5.48xlarge price row for path ${path}`);
  return row.usdPerUnitHour.value;
}
const EC2_P5 = p5Rate('ec2OnDemand');
const SM_P5 = p5Rate('sagemakerTraining');
const HP_P5 = p5Rate('hyperpod');
const CB_P5 = p5Rate('capacityBlock');
const PLAN_P5 = p5Rate('trainingPlan');
const SM_RATIO = (SM_P5 / EC2_P5).toFixed(2);
const HP_RATIO = (HP_P5 / EC2_P5).toFixed(2);
const PLAN_RATIO = (PLAN_P5 / CB_P5).toFixed(2);
/** Our arithmetic: how far the training-job rate sits below the HyperPod node rate, in percent. */
const SM_BELOW_HP_PCT = ((1 - SM_P5 / HP_P5) * 100).toFixed(1);

/** MaxRuntimeInSeconds tops out at 28 days (StoppingCondition API reference). */
const MAX_RUNTIME_DAYS = 28;
/** ModelTrainer's own MaxRuntimeInSeconds when no stopping condition is passed (defaults.py L55). */
const SDK_DEFAULT_RUNTIME_S = 3_600;

/**
 * Section 22's reference run, recomputed with the same calculator inputs so the two sections agree:
 * Llama 3.1 70B, 15T tokens, 6ND on the full parameter count with no attention term, H100 dense BF16
 * peak, the dive's 40% MFU assumption, on 256 p5.48xlarge (the 256-instance Capacity Block limit).
 */
const P5 = INSTANCES['p5.48xlarge'];
const REF_INSTANCES = 256;
const REF_GPUS = REF_INSTANCES * P5.acceleratorsPerInstance.value;
const REF_MODEL = shapeOf(DENSE_MODELS['llama-3.1-70b']);
const REF_TOKENS = 15e12;
const REF_RUN = estimateRun({
  ...denseRuntimeInputs(REF_MODEL, 'full'),
  tokens: REF_TOKENS,
  sequenceLength: 8_192,
  attention: 'none',
  peakTflopsPerAccelerator: P5.denseBf16TflopsPerAccelerator.value,
  accelerators: REF_GPUS,
  mfu: DEFAULT_MFU.value,
});
const REF_COST: CostResult = priceRun({
  acceleratorHours: REF_RUN.acceleratorHours,
  accelerators: REF_GPUS,
  instance: 'p5.48xlarge',
});
function lineUsd(cost: CostResult, path: CostLine['path']): number {
  const line = cost.lines.find((l) => l.path === path);
  if (!line) throw new RangeError(`TrainingJobs: no ${path} line in the reference run's price`);
  return line.usd;
}
const REF_DAYS = Math.round(REF_COST.wallClockDays);
const REF_JOBS = Math.ceil(REF_COST.wallClockDays / MAX_RUNTIME_DAYS);
const REF_EC2_USD = lineUsd(REF_COST, 'ec2OnDemand');
const REF_SM_USD = lineUsd(REF_COST, 'sagemakerTraining');

const usdRate = (v: number) => `$${v}`;
const usdM = (v: number) => `$${(v / 1e6).toFixed(1)}M`;
const int = (v: number) => Math.round(v).toLocaleString('en-US');

const EFA_SAGEMAKER_LINK = <Link href="../efa/">EFA dive, section 16: EFA on SageMaker and HyperPod</Link>;

/* ------------------------------------------------------------------------ */
/* Diagram: one job's life on one timeline                                  */
/* ------------------------------------------------------------------------ */

/** Container width (px) below which the lifecycle diagram switches to its stacked layout. */
const JOB_NARROW_PX = 720;

type Bill = 'none' | 'billed' | 'repair' | 'warm';
type Tone = 'wait' | 'run' | 'repair';

interface LifePhase {
  key: string;
  name: string;
  /** Wide layout: up to three lines of at most 15 characters. */
  wide: string[];
  /** Narrow layout: up to two lines of at most 36 characters. */
  narrow: string[];
  bill: Bill;
  tone: Tone;
  /** Box width in the wide layout, viewBox units. */
  w: number;
}

const PHASES: LifePhase[] = [
  { key: 'pending', name: 'Pending', wide: ['waiting for', 'capacity'], narrow: ['waiting for capacity'], bill: 'none', tone: 'wait', w: 100 },
  { key: 'starting', name: 'Starting', wide: ['launching', 'instances'], narrow: ['launching the instances'], bill: 'none', tone: 'wait', w: 90 },
  {
    key: 'downloading',
    name: 'Downloading',
    wide: ['container', 'and input data'],
    narrow: ['container image and input data'],
    bill: 'billed',
    tone: 'run',
    w: 104,
  },
  {
    key: 'training',
    name: 'Training',
    wide: ['writes a', 'checkpoint', 'every N steps'],
    narrow: ['writes a checkpoint every N steps;', 'SageMaker syncs it to S3'],
    bill: 'billed',
    tone: 'run',
    w: 150,
  },
  {
    key: 'repair',
    name: 'GPU repair',
    wide: ['reboot or', 'replace the', 'instance'],
    narrow: ['GPU fault: reboot or replace the', 'instance, up to 10 attempts'],
    bill: 'repair',
    tone: 'repair',
    w: 100,
  },
  {
    key: 'training-2',
    name: 'Training',
    wide: ['resumes from', 'the newest', 'checkpoint'],
    narrow: ['resumes from the newest checkpoint,', 'restored from S3 to every instance'],
    bill: 'billed',
    tone: 'run',
    w: 106,
  },
  { key: 'uploading', name: 'Uploading', wide: ['model', 'to S3'], narrow: ['model artifacts to S3'], bill: 'billed', tone: 'run', w: 84 },
];

const TONE: Record<Tone, { fill: string; stroke: string }> = {
  wait: { fill: '#fafafa', stroke: '#879596' },
  run: { fill: '#f2f8fd', stroke: '#0972d3' },
  repair: { fill: '#fbf3d5', stroke: '#8b6c00' },
};

const INK = '#16191f';
const MUTED = '#5f6b7a';
const BLUE = '#0972d3';
const TEAL = '#1f7a70';
const AMBER = '#8b6c00';
const FONT = 'sans-serif';

const LIFECYCLE_TITLE =
  'One SageMaker training job on one timeline. It waits as Pending for capacity, launches its instances, ' +
  'downloads its container and data, then trains, writing checkpoints that SageMaker syncs to an S3 prefix. ' +
  'A GPU fault stops the job; SageMaker reboots or replaces the instance, up to 10 repair attempts that are ' +
  'not billed, and restarts the job from the newest checkpoint, restored from S3. The job then uploads its model ' +
  'and is torn down, or its instances wait in a warm pool for up to 3,600 seconds, billed while kept. Billing ' +
  `runs per second at the training rate, ${SM_RATIO} times the EC2 On-Demand rate, from the download to the upload.`;

function LifecycleWide() {
  const W = 900;
  const H = 286;
  const gap = 8;
  const x0 = 10;
  const boxTop = 60;
  const boxH = 78;

  let x = x0;
  const placed = PHASES.map((p) => {
    const at = { ...p, x };
    x += p.w + gap;
    return at;
  });
  const endX = x;
  const endW = W - 8 - endX;
  const byKey = (k: string) => {
    const p = placed.find((q) => q.key === k);
    if (!p) throw new RangeError(`TrainingJobs: no phase ${k}`);
    return p;
  };
  const dl = byKey('downloading');
  const ta = byKey('training');
  const rp = byKey('repair');
  const tb = byKey('training-2');
  const up = byKey('uploading');

  const s3Top = 184;
  const s3H = 26;
  const billTop = 234;
  const billH = 22;
  const noteY = 274;
  const downX = ta.x + 40;
  const upX = tb.x + 40;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby="training-jobs-lifecycle-title"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <title id="training-jobs-lifecycle-title">{LIFECYCLE_TITLE}</title>
      <defs>
        <marker id="training-jobs-lifecycle-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={MUTED} />
        </marker>
      </defs>
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />

      <text x={x0} y={20} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
        One training job, from queue to teardown
      </text>
      <text x={x0} y={36} fontFamily={FONT} fontSize={11} fill={MUTED}>
        secondary statuses from DescribeTrainingJob, plus one GPU repair and the job&apos;s end
      </text>
      <line x1={x0} y1={50} x2={W - 44} y2={50} stroke={MUTED} strokeWidth={1.2} markerEnd="url(#training-jobs-lifecycle-ah)" />
      <text x={W - 38} y={54} fontFamily={FONT} fontSize={11} fill={MUTED}>
        time
      </text>

      {placed.map((p) => (
        <g key={p.key}>
          <rect x={p.x} y={boxTop} width={p.w} height={boxH} rx={4} fill={TONE[p.tone].fill} stroke={TONE[p.tone].stroke} strokeWidth={1.5} />
          <text x={p.x + p.w / 2} y={boxTop + 19} fontFamily={FONT} fontSize={12} fontWeight={600} fill={INK} textAnchor="middle">
            {p.name}
          </text>
          {p.wide.map((line, i) => (
            <text key={line} x={p.x + p.w / 2} y={boxTop + 36 + i * 14} fontFamily={FONT} fontSize={11} fill={MUTED} textAnchor="middle">
              {line}
            </text>
          ))}
        </g>
      ))}

      {/* The job's end: torn down, or kept warm. */}
      <rect x={endX} y={boxTop} width={endW} height={30} rx={4} fill={TONE.wait.fill} stroke={TONE.wait.stroke} strokeWidth={1.5} />
      <text x={endX + endW / 2} y={boxTop + 20} fontFamily={FONT} fontSize={12} fontWeight={600} fill={INK} textAnchor="middle">
        Torn down
      </text>
      <rect x={endX} y={boxTop + 36} width={endW} height={boxH - 36} rx={4} fill="#e6f4f2" stroke={TEAL} strokeWidth={1.5} />
      <text x={endX + endW / 2} y={boxTop + 53} fontFamily={FONT} fontSize={12} fontWeight={600} fill={INK} textAnchor="middle">
        or warm pool
      </text>
      <text x={endX + endW / 2} y={boxTop + 68} fontFamily={FONT} fontSize={11} fill={MUTED} textAnchor="middle">
        up to 3,600 s
      </text>

      {/* Checkpoints: synced down to S3, restored at the restart. */}
      <text x={x0} y={s3Top + 17} fontFamily={FONT} fontSize={11} fontWeight={600} fill={MUTED}>
        Checkpoints
      </text>
      <rect x={ta.x} y={s3Top} width={tb.x + tb.w - ta.x} height={s3H} rx={4} fill="#ffffff" stroke={MUTED} strokeWidth={1.2} />
      <text x={(ta.x + tb.x + tb.w) / 2} y={s3Top + 17} fontFamily={FONT} fontSize={11} fontWeight={600} fill={INK} textAnchor="middle">
        S3 checkpoint prefix, kept between attempts
      </text>
      <line x1={downX} y1={boxTop + boxH} x2={downX} y2={s3Top - 2} stroke={MUTED} strokeWidth={1.4} markerEnd="url(#training-jobs-lifecycle-ah)" />
      <text x={downX + 6} y={166} fontFamily={FONT} fontSize={11} fill={MUTED}>
        synced to S3
      </text>
      <line x1={upX} y1={s3Top} x2={upX} y2={boxTop + boxH + 2} stroke={MUTED} strokeWidth={1.4} markerEnd="url(#training-jobs-lifecycle-ah)" />
      <text x={upX + 6} y={166} fontFamily={FONT} fontSize={11} fill={MUTED}>
        restored at restart
      </text>

      {/* Billing lane. */}
      <text x={x0} y={billTop + 15} fontFamily={FONT} fontSize={11} fontWeight={600} fill={MUTED}>
        Billing
      </text>
      <rect x={dl.x} y={billTop} width={ta.x + ta.w - dl.x} height={billH} rx={3} fill={BLUE} />
      <text x={(dl.x + ta.x + ta.w) / 2} y={billTop + 15} fontFamily={FONT} fontSize={11} fontWeight={600} fill="#ffffff" textAnchor="middle">
        billed per second
      </text>
      <rect x={rp.x} y={billTop} width={rp.w} height={billH} rx={3} fill="#ffffff" stroke={AMBER} strokeWidth={1.2} strokeDasharray="4 3" />
      <text x={rp.x + rp.w / 2} y={billTop + 15} fontFamily={FONT} fontSize={11} fontWeight={600} fill={AMBER} textAnchor="middle">
        not billed
      </text>
      <rect x={tb.x} y={billTop} width={up.x + up.w - tb.x} height={billH} rx={3} fill={BLUE} />
      <text x={(tb.x + up.x + up.w) / 2} y={billTop + 15} fontFamily={FONT} fontSize={11} fontWeight={600} fill="#ffffff" textAnchor="middle">
        billed
      </text>
      <rect x={endX} y={billTop} width={endW} height={billH} rx={3} fill={TEAL} />
      <text x={endX + endW / 2} y={billTop + 15} fontFamily={FONT} fontSize={11} fontWeight={600} fill="#ffffff" textAnchor="middle">
        billed
      </text>

      <text x={(dl.x + ta.x + ta.w) / 2} y={noteY} fontFamily={FONT} fontSize={11} fill={MUTED} textAnchor="middle">
        {`at ${SM_RATIO} x the EC2 On-Demand rate`}
      </text>
      <text x={rp.x + rp.w / 2} y={noteY} fontFamily={FONT} fontSize={11} fill={MUTED} textAnchor="middle">
        up to 10 tries
      </text>
      <text x={endX + endW / 2} y={noteY} fontFamily={FONT} fontSize={11} fill={MUTED} textAnchor="middle">
        while kept
      </text>
    </svg>
  );
}

const NARROW_BILL: Record<Bill, { label: string; fill: string; stroke: string; ink: string; dash?: string } | null> = {
  none: null,
  billed: { label: 'billed per second', fill: BLUE, stroke: BLUE, ink: '#ffffff' },
  repair: { label: 'not billed', fill: '#ffffff', stroke: AMBER, ink: AMBER, dash: '4 3' },
  warm: { label: 'warm pool: billed', fill: TEAL, stroke: TEAL, ink: '#ffffff' },
};

function LifecycleNarrow() {
  const W = 400;
  const top = 52;
  const rowH = 50;
  const step = 58;
  const boxX = 10;
  const boxW = 250;
  const billX = 268;
  const billW = W - 10 - billX;

  const rows: { key: string; name: string; lines: string[]; bill: Bill; fill: string; stroke: string }[] = [
    ...PHASES.map((p) => ({ key: p.key, name: p.name, lines: p.narrow, bill: p.bill, ...TONE[p.tone] })),
    {
      key: 'end',
      name: 'Torn down, or kept warm',
      lines: ['a warm pool waits up to 3,600 s', 'for the next matching job'],
      bill: 'warm' as Bill,
      fill: '#e6f4f2',
      stroke: TEAL,
    },
  ];
  const footY = top + rows.length * step + 14;
  const H = footY + 14;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby="training-jobs-lifecycle-title"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <title id="training-jobs-lifecycle-title">{LIFECYCLE_TITLE}</title>
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
      <text x={boxX} y={20} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
        One training job, queue to teardown
      </text>
      <text x={boxX} y={37} fontFamily={FONT} fontSize={11} fill={MUTED}>
        top to bottom in time; statuses from DescribeTrainingJob
      </text>
      {rows.map((r, i) => {
        const y = top + i * step;
        const bill = NARROW_BILL[r.bill];
        return (
          <g key={r.key}>
            <rect x={boxX} y={y} width={boxW} height={rowH} rx={4} fill={r.fill} stroke={r.stroke} strokeWidth={1.5} />
            <text x={boxX + 8} y={y + 17} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
              {r.name}
            </text>
            {r.lines.map((line, j) => (
              <text key={line} x={boxX + 8} y={y + 31 + j * 13} fontFamily={FONT} fontSize={12} fill={MUTED}>
                {line}
              </text>
            ))}
            {bill && (
              <g>
                <rect
                  x={billX}
                  y={y + 14}
                  width={billW}
                  height={22}
                  rx={3}
                  fill={bill.fill}
                  stroke={bill.stroke}
                  strokeWidth={1.2}
                  strokeDasharray={bill.dash}
                />
                <text x={billX + billW / 2} y={y + 29} fontFamily={FONT} fontSize={12} fontWeight={600} fill={bill.ink} textAnchor="middle">
                  {bill.label}
                </text>
              </g>
            )}
          </g>
        );
      })}
      <text x={boxX} y={footY} fontFamily={FONT} fontSize={12} fill={MUTED}>
        {`Billed rate: ${SM_RATIO} x the EC2 On-Demand rate`}
      </text>
    </svg>
  );
}

function LifecycleDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, JOB_NARROW_PX);
  return <div ref={ref}>{narrow ? <LifecycleNarrow /> : <LifecycleWide />}</div>;
}

/* ------------------------------------------------------------------------ */
/* The launcher sketch                                                      */
/* ------------------------------------------------------------------------ */

const LAUNCHER = `from sagemaker.train import (
    ModelTrainer)
from sagemaker.train.distributed \\
    import Torchrun
from sagemaker.core.training \\
    import configs as c

trainer = ModelTrainer(
  training_image="<image URI>",
  source_code=c.SourceCode(
    source_dir="src",
    entry_script="train.py"),
  compute=c.Compute(
    instance_type=
      "ml.p5.48xlarge",
    instance_count=2),
  distributed=Torchrun(),
  checkpoint_config=
    c.CheckpointConfig(
      s3_uri=
        "s3://<bucket>/<run>/ckpt",
      local_path=
        "/opt/ml/checkpoints"),
  # SDK default is 3600 s
  stopping_condition=
    c.StoppingCondition(
      max_runtime_in_seconds=
        3 * 86400),
).with_infra_check_config()

trainer.train(
  input_data_config=[c.InputData(
    channel_name="train",
    data_source=
      "s3://<bucket>/tokens/")],
  dry_run=True)  # submits no job`;

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function TrainingJobs() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={`Run fine-tuning, post-training and other runs of up to ${MAX_RUNTIME_DAYS} days on a cluster that exists only while the job runs, billed at ${SM_RATIO} times the EC2 (Amazon Elastic Compute Cloud) On-Demand rate, and start from the SDK (software development kit) and libraries AWS still releases (SageMaker Python SDK v3.28.0 and HyperPod recipes 2.0.11, read 2026-10-31)`}
          >
            26. SageMaker Training Jobs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A SageMaker training job is a cluster that exists for one job. Its instances are provisioned when the job
            starts and released when it completes, and On-Demand capacity is paid per second{' '}
            <Cite tier={1} href={SM_CAPACITY}>
              SageMaker Developer Guide, get compute capacity for training jobs
            </Cite>
            . The rate is SageMaker&apos;s training rate, {SM_RATIO} times EC2 On-Demand: {usdRate(SM_P5)} against{' '}
            {usdRate(EC2_P5)} per p5.48xlarge-hour in us-east-1 on 2026-10-30{' '}
            <Cite tier={1} href={SOURCES.sagemakerUse1.url}>
              SageMaker Price List, us-east-1, version 20261029165009
            </Cite>{' '}
            <Cite tier={1} href={SOURCES.ec2PriceUse1.url}>
              EC2 Price List, us-east-1, version 20261029175634
            </Cite>
            . Inside the container any launcher runs: <code>torchrun</code>, <code>mpirun</code> and PyTorch DDP
            (Distributed Data Parallel) among them{' '}
            <Cite tier={1} href={SM_DIST}>
              SageMaker Developer Guide, distributed training
            </Cite>
            .
          </Box>
          <Box variant="p">
            That contract sets the challenge. A job has a start and an end, can lose an instance in the middle, and
            resumes only from a checkpoint it saved to S3 (Amazon Simple Storage Service). Fitting a training run to it
            means saving where SageMaker copies, choosing how the job waits for capacity, and knowing where the shape
            stops fitting. Who owns each concern on this path is the training-jobs column of section 20, Who Owns What
            on AWS; the fabric side, EFA (Elastic Fabric Adapter) following the instance type, is the{' '}
            {EFA_SAGEMAKER_LINK}.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read each status a job passes through, and know which stretches of its life you pay for"
          >
            A job&apos;s life, from queue to teardown
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A job waits as Pending until capacity exists. On On-Demand you set that wait from 30 minutes to 28 days with{' '}
            <code>MaxPendingTimeInSeconds</code>, and past it the job fails with <code>InsufficientCapacityError</code>;
            all of a job&apos;s instances launch in one subnet, so in one Availability Zone{' '}
            <Cite tier={1} href={SM_CAPACITY}>
              SageMaker Developer Guide, get compute capacity for training jobs
            </Cite>
            . Billing runs from <code>TrainingStartTime</code>, when the job starts on its instances, to{' '}
            <code>TrainingEndTime</code>, so it includes downloading the container and the data{' '}
            <Cite tier={1} href={API_DESCRIBE}>
              SageMaker API reference, DescribeTrainingJob
            </Cite>
            .
          </Box>
          <LifecycleDiagram />
          <Box variant="small">
            Illustrative, not measured: durations are schematic. Status names, limits and billing rules are the
            documented ones cited in this section.
          </Box>
          <Box variant="p">
            Two limits bound the Training stretch. <code>MaxRuntimeInSeconds</code> defaults to 1 day in the API and
            goes up to {MAX_RUNTIME_DAYS} days, and with a retry strategy set it caps all attempts together{' '}
            <Cite tier={1} href={API_STOPPING}>
              SageMaker API reference, StoppingCondition
            </Cite>
            . The SDK&apos;s <code>ModelTrainer</code> fills in its own default of {int(SDK_DEFAULT_RUNTIME_S)} seconds
            when you pass no stopping condition{' '}
            <Cite tier={1} href={SDK_DEFAULTS} kind="code">
              sagemaker-python-sdk defaults.py L52-L55 at v3.28.0
            </Cite>{' '}
            <Cite tier={1} href={SDK_STOP_DEFAULT} kind="code">
              defaults.py L156-L174
            </Cite>
            , so a <code>ModelTrainer</code> job left at its defaults stops after one hour. At the limit, or when you
            stop a job, SageMaker sends <code>SIGTERM</code> and waits 120 seconds before it ends the job{' '}
            <Cite tier={1} href={API_STOPPING}>
              SageMaker API reference, StoppingCondition
            </Cite>
            : a signal handler that finishes a save inside that window keeps the last steps.
          </Box>
          <Box variant="p">
            Watch the job through <code>DescribeTrainingJob</code>: <code>SecondaryStatus</code> carries the names in
            the diagram, <code>SecondaryStatusTransitions</code> their history, and the valid values are subject to
            change{' '}
            <Cite tier={1} href={API_DESCRIBE}>
              SageMaker API reference, DescribeTrainingJob
            </Cite>
            , so a watchdog should treat an unknown status as a reason to look, our reading.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Save to the path SageMaker syncs and give every rank its own file, so a repair, a Spot interruption or the next job resumes where the last one stopped"
          >
            Checkpoints: what crosses from one attempt to the next
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Set a <code>CheckpointConfig</code> and SageMaker syncs a local directory, <code>/opt/ml/checkpoints</code>{' '}
            by default, with an S3 prefix while the job runs. At the start of a job it writes the checkpoints already
            under that prefix into the container, and a checkpoint deleted in the container is deleted in S3 as well{' '}
            <Cite tier={1} href={SM_CHECKPOINTS}>
              SageMaker Developer Guide, checkpoints
            </Cite>
            ; a resumed job receives them on every instance{' '}
            <Cite tier={1} href={SM_CHECKPOINT_RESUME}>
              SageMaker Developer Guide, resume from a checkpoint
            </Cite>
            . In SDK v3 the S3 location defaults to a path that contains the job&apos;s name when you leave it out{' '}
            <Cite tier={1} href={SDK_CHECKPOINT_CONFIG} kind="code">
              sagemaker-core training/configs.py L350-L366 at v3.28.0
            </Cite>{' '}
            <Cite tier={1} href={SDK_CHECKPOINT_DEFAULT} kind="code">
              model_trainer.py L738-L742
            </Cite>
            , so set it yourself: the next job resumes only if it names the same prefix. The prefix can sit in a
            general purpose bucket or an S3 Express One Zone directory bucket{' '}
            <Cite tier={1} href={SM_CHECKPOINTS}>
              SageMaker Developer Guide, checkpoints
            </Cite>
            .
          </Box>
          <Box variant="p">
            The configuration names one S3 location for the whole job, so on more than one instance the script must give
            each file a distinct name or path, and the SDK has no setting for how often to save: the script decides{' '}
            <Cite tier={1} href={SM_CHECKPOINTS}>
              SageMaker Developer Guide, checkpoints, considerations
            </Cite>
            . Our reading for a multi-node run: write each save into its own step directory with the rank in every file
            name, and prune old steps, because every instance receives the whole prefix each time a job starts. Section
            18, Checkpointing, sizes the interval, and section 19, Resuming Correctly, makes the resumed job continue the
            same run.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Match the capacity option to how you work: a warm pool for an edit-and-rerun loop, Spot for checkpointed jobs that can wait, a training plan for a dated window"
          >
            Waiting less and paying less: warm pools, managed Spot and training plans
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={3} variant="text-grid">
            <SpaceBetween size="xs">
              <Box variant="h4">Warm pools</Box>
              <Box variant="p">
                Set <code>KeepAlivePeriodInSeconds</code>, up to 3,600 seconds, and a finished job&apos;s instances wait
                for the next job with the same role, instance type and count, volume and network settings. A pool can
                pass from job to job for up to 28 days, keeps a cache at <code>/opt/ml/sagemaker/warmpoolcache</code>,
                and is billed while kept. It cannot be combined with Spot or with heterogeneous clusters{' '}
                <Cite tier={1} href={SM_WARM}>
                  SageMaker Developer Guide, managed warm pools
                </Cite>
                . <code>WarmPoolStatus</code> reports each job&apos;s billed retention{' '}
                <Cite tier={1} href={API_DESCRIBE}>
                  DescribeTrainingJob
                </Cite>
                .
              </Box>
            </SpaceBetween>
            <SpaceBetween size="xs">
              <Box variant="h4">Managed Spot</Box>
              <Box variant="p">
                The job runs only on Spot capacity, never falls back to On-Demand, and waits for Spot until{' '}
                <code>MaxWaitTimeInSeconds</code>, which must be larger than <code>MaxRuntimeInSeconds</code>; on a
                restart SageMaker copies the checkpoints back from S3. AWS states savings of up to 90%, and the saving
                shows per job as <code>1 - BillableTimeInSeconds / TrainingTimeInSeconds</code>, a figure not
                comparable to EC2 Spot price history{' '}
                <Cite tier={1} href={SM_SPOT} kind="vendor-claim">
                  SageMaker Developer Guide, managed Spot training
                </Cite>
                . The Price List carries no separate Spot rate: it lists Spot training on ml.p5.48xlarge at{' '}
                {usdRate(SM_P5)}, the On-Demand training rate{' '}
                <Cite tier={1} href={SOURCES.sagemakerUse1.url}>
                  SageMaker Price List, us-east-1
                </Cite>
                . Our reading: Spot suits jobs of a few instances that checkpoint often, because a synchronous job stops
                when any of its instances is interrupted (section 17).
              </Box>
            </SpaceBetween>
            <SpaceBetween size="xs">
              <Box variant="h4">Training plans</Box>
              <Box variant="p">
                A plan reserves capacity for one target, here training jobs, and cannot be moved to another such as a
                HyperPod cluster{' '}
                <Cite tier={1} href={SM_PLANS}>
                  SageMaker Developer Guide, training plans
                </Cite>
                . It is paid up front at {PLAN_RATIO} times the Capacity Block rate, {usdRate(PLAN_P5)} against{' '}
                {usdRate(CB_P5)} per p5.48xlarge-hour{' '}
                <Cite tier={1} href={SOURCES.sagemakerUse1.url}>
                  SageMaker Price List, us-east-1
                </Cite>{' '}
                <Cite tier={1} href={SOURCES.capacityBlocks.url} accessed={R1}>
                  EC2 Capacity Blocks pricing
                </Cite>
                . A job on a plan waits for capacity until its stopping condition stops it or, after 2 days pending,
                fails with an <code>InsufficientCapacityError</code>; instances start terminating 30 minutes before
                each of the plan&apos;s Reserved Capacity blocks ends, and the job can read{' '}
                <code>SAGEMAKER_CURRENT_CAPACITY_BLOCK_EXPIRATION_TIMESTAMP</code> to save first{' '}
                <Cite tier={1} href={SM_PLAN_JOBS}>
                  SageMaker Developer Guide, training plans for training jobs
                </Cite>
                . A plan can hold several blocks with gaps between them{' '}
                <Cite tier={1} href={SM_PLANS}>
                  SageMaker Developer Guide, training plans
                </Cite>
                , so a long job can stop at each gap.
              </Box>
            </SpaceBetween>
          </ColumnLayout>
          <Box variant="p">
            The training-plan page&apos;s sample saves when 30 minutes remain before that timestamp, and the page does not
            say whether the timestamp marks the block&apos;s end or the start of termination{' '}
            <Cite tier={1} href={SM_PLAN_JOBS}>
              SageMaker Developer Guide, training plans for training jobs
            </Cite>
            . If it is the end, a 30-minute threshold fires as termination begins; set it to 30 minutes plus your save
            time and a margin, our reading. Section 22, Capacity &amp; Cost, gives every reservation edge, and its cost
            panel prices managed Spot at the discount you enter.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Count on SageMaker to repair the cluster and restart the job after a GPU fault, and turn on the infrastructure check it leaves optional"
          >
            When a GPU fails mid-job
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A job that fails on a GPU gets a GPU health check. A recoverable error reboots the instance; a GPU that needs
            replacing gets the instance replaced. While that runs the job&apos;s status message reads &quot;Repairing
            training cluster due to hardware failure&quot;. SageMaker tries up to 10 repairs, does not bill them, and
            restarts the job from the previous checkpoint; a repair that fails fails the job. Repair starts only after the
            job fails{' '}
            <Cite tier={1} href={SM_REPAIR}>
              SageMaker Developer Guide, cluster repairs for GPU errors
            </Cite>
            . The page names GPU errors only and says nothing of Trainium. A separate retry strategy reruns a job that
            fails with an <code>InternalServerError</code>, 1 to 30 times{' '}
            <Cite tier={1} href={API_RETRY}>
              SageMaker API reference, RetryStrategy
            </Cite>
            .
          </Box>
          <Box variant="p">
            The infrastructure check is opt-in. <code>CreateTrainingJob</code> accepts an <code>InfraCheckConfig</code>,
            a SageMaker-provided health check of instance hardware and cluster network connectivity{' '}
            <Cite tier={1} href={API_INFRA}>
              SageMaker API reference, InfraCheckConfig
            </Cite>
            ; the API reference does not say when it runs or how long it takes, and no Developer Guide page on it was
            located in this research. In SDK v3, <code>with_infra_check_config()</code> turns it on{' '}
            <Cite tier={1} href={SDK_INFRA} kind="code">
              model_trainer.py L1935-L1954 at v3.28.0
            </Cite>
            . Section 20 compares this with HyperPod&apos;s deep health checks, which run when nodes join a standing
            cluster. On this path the protection that matters most is the one the script owns: a recent
            checkpoint, because every restart above begins from it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Put training jobs behind a Batch queue when a team shares capacity, and add CPU instance groups when preprocessing starves the GPUs"
          >
            Team queues and CPU helpers
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AWS Batch service jobs put SageMaker training jobs behind a Batch job queue: Batch holds the queue and
            its priorities, SageMaker runs each job, and service jobs go in through the <code>SubmitServiceJob</code>{' '}
            API, not the console{' '}
            <Cite tier={1} href={BATCH_SERVICE_JOBS}>
              AWS Batch User Guide, service jobs
            </Cite>
            . Batch has scheduled SageMaker training jobs since 2025-07-31, with fair-share scheduling policies across
            teams{' '}
            <Cite tier={2} href={WN_BATCH_JOBS}>
              AWS What&apos;s New, 2025-07-31
            </Cite>
            , and added quota shares and preemption for them on 2026-03-25{' '}
            <Cite tier={2} href={WN_BATCH_QUOTA}>
              AWS What&apos;s New, 2026-03-25
            </Cite>
            . SDK v3 wraps it as <code>TrainingQueue(name).submit(...)</code>, which takes a <code>ModelTrainer</code>, a
            priority, a share identifier or quota share, and a preemption configuration{' '}
            <Cite tier={1} href={SDK_QUEUE} kind="code">
              aws_batch/training_queue.py L26-L47 at v3.28.0
            </Cite>
            . Our reading: this is how a team on training jobs gets the queues and shares that HyperPod task governance
            gives a HyperPod EKS (Amazon Elastic Kubernetes Service) team.
          </Box>
          <Box variant="p">
            A heterogeneous cluster mixes instance groups in one job, for example GPU instances plus cheaper CPU instances
            for CPU-heavy preprocessing; it is set through <code>ModelTrainer</code>, for PyTorch 1.10 or later{' '}
            <Cite tier={1} href={SM_HETERO}>
              SageMaker Developer Guide, heterogeneous clusters
            </Cite>
            , and cannot be combined with warm pools{' '}
            <Cite tier={1} href={SM_WARM}>
              SageMaker Developer Guide, managed warm pools
            </Cite>
            . Section 23, Storage for Training, shows a pre-tokenised text corpus is a trickle beside the checkpoint
            traffic, so for text the CPU groups rarely pay; heavy preprocessing such as images or audio is where they
            do, our reading.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Write the launcher against ModelTrainer on a pinned SDK v3, and bring your training framework in your own container"
          >
            The SDK and libraries to start from
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            SageMaker Python SDK v3 replaces <code>Estimator</code> and the framework estimators such as{' '}
            <code>PyTorchEstimator</code> with one <code>ModelTrainer</code> class, the older interfaces are not
            supported in v3, and <code>pip install sagemaker==2.*</code> keeps 2.x{' '}
            <Cite tier={1} href={SDK_README}>
              sagemaker-python-sdk README.rst at v3.28.0
            </Cite>
            . A notebook written for a <code>PyTorch(...)</code> estimator needs porting, so pin the SDK&apos;s major
            version in the launcher&apos;s requirements, our reading. The sketch below is written from the SDK v3.28.0
            source and has not been run here; <code>dry_run=True</code> validates the request and submits no job{' '}
            <Cite tier={1} href={SDK_DRY_RUN} kind="code">
              model_trainer.py L920-L955 at v3.28.0
            </Cite>
            .
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{LAUNCHER}</pre>
          <Box variant="p">
            SMP (the SageMaker model parallelism library) v2 and SMDDP (the SageMaker distributed data parallelism
            library) are AWS&apos;s own training libraries, and neither has released in more than 18 months (release
            dates below). Our reading: a new project on P5 or P6 gets current PyTorch and NCCL (NVIDIA Collective
            Communications Library) by bringing FSDP2 (PyTorch&apos;s Fully Sharded Data Parallel, version 2; section
            8), TorchTitan or Megatron Core in its own container (section 15, The Framework Map).
          </Box>
          <ExpandableSection headerText="SMP v2 and SMDDP: what they add, how SDK v3 wires SMP, and their last releases">
            <SpaceBetween size="s">
              <Box variant="p">
                SMP v2 aligns its API with PyTorch FSDP (weights, gradients and optimizer state sharded across
                data-parallel ranks), so it takes FSDP training scripts, and adds hybrid sharding, TP (tensor
                parallelism: every layer split across the GPUs of one instance; section 9), activation checkpointing
                and offloading; it runs on training jobs and on HyperPod{' '}
                <Cite tier={1} href={SMP_V2}>
                  SageMaker Developer Guide, SMP v2
                </Cite>
                . Its latest release is v2.8.0 of 2025-04-01, on PyTorch 2.5.1 with NCCL 2.23.4{' '}
                <Cite tier={1} href={SMP_NOTES}>
                  SMP release notes, v2.8.0
                </Cite>
                . SDK v3 takes its settings in code, as <code>Torchrun(smp=SMP(...))</code>, which{' '}
                <code>ModelTrainer</code> passes to the job as <code>mp_parameters</code>{' '}
                <Cite tier={1} href={SDK_SMP} kind="code">
                  distributed.py L26-L77 at v3.28.0
                </Cite>{' '}
                <Cite tier={1} href={SDK_TORCHRUN} kind="code">
                  distributed.py L113-L128
                </Cite>{' '}
                <Cite tier={1} href={SDK_SMP_WIRING} kind="code">
                  model_trainer.py L799-L801
                </Cite>
                , while the SMP v2 guide documents only the SDK v2 <code>PyTorch</code> estimator, on SDK v2.200 or later{' '}
                <Cite tier={1} href={SMP_USE} kind="doc-code-conflict">
                  SageMaker Developer Guide, use SMP v2
                </Cite>
                . That pairing is a code reading, not run end to end here.
              </Box>
              <Box variant="p">
                SMDDP implements an AllGather optimized for instances powered by NVIDIA A100 GPUs{' '}
                <Cite tier={1} href={HP_SLURM}>
                  SageMaker Developer Guide, HyperPod Slurm
                </Cite>
                . Its own release notes end at v2.5.0 of 2024-10-17{' '}
                <Cite tier={1} href={SMDDP_NOTES}>
                  SMDDP release notes
                </Cite>
                , while the SMP v2.8.0 container carries SMDDP 2.6.0{' '}
                <Cite tier={1} href={SMP_NOTES}>
                  SMP release notes, v2.8.0
                </Cite>
                ; the {EFA_SAGEMAKER_LINK} covers which instances it supports.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Start a fine-tuning or post-training job from a recipe, and plan open-weight pre-training on your own stack"
          >
            HyperPod recipes on training jobs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            HyperPod recipes are AWS&apos;s pre-configured training stacks. They run on HyperPod or as training jobs, and
            the documentation points to the GitHub repository for the current list{' '}
            <Cite tier={1} href={HP_RECIPES_DOC}>
              SageMaker Developer Guide, HyperPod recipes
            </Cite>
            . At release 2.0.11 the repository&apos;s training directory holds six recipes: one open-weight
            pre-training recipe (checkpointless Llama 3 70B), a Falcon custom-model example and four Nova continued
            pre-training recipes; no path mentions Trainium or Neuron{' '}
            <Cite tier={1} href={RECIPES_TREE} kind="code">
              sagemaker-hyperpod-recipes tree at 2.0.11
            </Cite>
            . The rest of the collection is fine-tuning and post-training recipes, plus evaluation recipes{' '}
            <Cite tier={1} href={RECIPES_SRC_TREE} kind="code">
              sagemaker-hyperpod-recipes recipes_src at 2.0.11
            </Cite>
            . SDK v3 launches a recipe as a training job
            through <code>ModelTrainer.from_recipe</code>{' '}
            <Cite tier={1} href={SDK_FROM_RECIPE} kind="code">
              model_trainer.py L1410-L1411 at v3.28.0
            </Cite>
            .
          </Box>
          <Box variant="p">
            The one pre-training recipe runs Llama 3 70B on 16 ml.p5.48xlarge at TP 8 x PP (pipeline parallelism) 4, so
            DP (data parallelism) 4 across the 128 GPUs, our arithmetic, in BF16 (bfloat16) mixed precision at
            2,048-token sequences with micro-batch 1 and a global batch of 512 sequences, saving asynchronously every 20
            steps{' '}
            <Cite tier={1} href={RECIPE_70B} kind="code">
              checkpointless_llama3_70b_pretrain.yaml at 2.0.11
            </Cite>
            . Its checkpointless recovery is documented for HyperPod with EKS and the training operator v1.2.0 or later{' '}
            <Cite tier={1} href={HP_CHECKPOINTLESS}>
              SageMaker Developer Guide, checkpointless training
            </Cite>
            , which section 25, The Kubernetes Family, covers; this research located no page that runs it as a training
            job. For open-weight pre-training on this path, bring your own stack.
          </Box>
          <ExpandableSection headerText="The recipe collection across releases, and a tutorial that names a removed recipe">
            <SpaceBetween size="s">
              <Box variant="p">
                Release v1.5.1, a commit of 2025-08-14, held 36 training recipes, among them Llama 3 70B pre-training on
                32, 64 and 128 p5 nodes and Llama 3 8B and 70B on Trn1{' '}
                <Cite tier={1} href={RECIPES_V151} kind="code">
                  sagemaker-hyperpod-recipes tree at v1.5.1
                </Cite>
                . Release v2.0.0 of 2025-12-03 carries the six training recipes above, and its notes list NVIDIA H100,
                A100 and A10G accelerators{' '}
                <Cite tier={1} href={RECIPES_V200}>
                  sagemaker-hyperpod-recipes v2.0.0 release notes
                </Cite>
                .
              </Box>
              <Box variant="p">
                The Developer Guide&apos;s Trainium tutorial for training jobs sets{' '}
                <code>training_recipe=&quot;training/llama/hf_llama3_70b_seq8k_trn1x16_pretrain&quot;</code> with{' '}
                <code>instance_count=1</code>{' '}
                <Cite tier={1} href={SM_TRN_JOBS_TUTORIAL} kind="doc-code-conflict">
                  SageMaker Developer Guide, Trainium training-job tutorial
                </Cite>
                , a recipe that is absent from the 2.0.11 tree{' '}
                <Cite tier={1} href={RECIPES_TREE} kind="code">
                  sagemaker-hyperpod-recipes tree at 2.0.11
                </Cite>
                . A blog post or notebook that names a v1 recipe path needs the repository&apos;s v1 line, our reading.
                Section 27, Trainium: The Neuron Path, gives the stack AWS supports for Trainium training.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Choose training jobs for many short or medium runs and no standing cluster, at ${SM_RATIO} times EC2 for the hours a job runs, and move to a long-lived cluster when a run outgrows ${MAX_RUNTIME_DAYS} days`}
          >
            When a cluster per job is the right shape
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Per busy hour, a training job is the cheaper SageMaker shape: {usdRate(SM_P5)} per ml.p5.48xlarge-hour
            against {usdRate(HP_P5)} for a HyperPod node, {SM_RATIO} and {HP_RATIO} times EC2 On-Demand{' '}
            <Cite tier={1} href={SOURCES.sagemakerUse1.url}>
              SageMaker Price List, us-east-1
            </Cite>
            , so {SM_BELOW_HP_PCT}% lower, our arithmetic. A training job also stops billing when it ends, while a
            HyperPod cluster bills for its whole life, idle hours included{' '}
            <Cite tier={1} href={SM_PRICING_PAGE}>
              SageMaker AI pricing
            </Cite>
            . What a standing cluster buys with its premium is the work around the job: no provisioning wait per job,
            and, when switched on, deep health checks on every node that joins (sections 24 and 25).
          </Box>
          <Box variant="p">
            The shape stops fitting at the job&apos;s limits. Section 22&apos;s reference run is Llama 3.1 70B on 15T
            tokens on {int(REF_GPUS)} H100 at an assumed {Math.round(DEFAULT_MFU.value * 100)}% MFU (model FLOPs
            utilization, FLOPs being floating-point operations), <code>6ND</code> with N ={' '}
            {(REF_MODEL.totalParameters / 1e9).toFixed(1)}B and the H100&apos;s dense BF16 peak of{' '}
            {P5.denseBf16TflopsPerAccelerator.value} TFLOPS (trillion FLOPs per second), a vendor specification{' '}
            <Cite tier={1} href={SOURCES.h100.url} kind="vendor-claim">
              NVIDIA H100 specification
            </Cite>
            : about {REF_DAYS} days. Run as training jobs, that is at least {REF_JOBS} jobs of at most{' '}
            {MAX_RUNTIME_DAYS} days{' '}
            <Cite tier={1} href={API_STOPPING}>
              SageMaker API reference, StoppingCondition
            </Cite>
            , each restoring the checkpoint prefix on every instance, and the training rate turns the{' '}
            {usdM(REF_EC2_USD)} EC2 On-Demand bill into {usdM(REF_SM_USD)}, {usdM(REF_SM_USD - REF_EC2_USD)} more, our
            arithmetic on the Price Lists above. Fine-tuning and post-training jobs of hours or days sit well inside the
            {MAX_RUNTIME_DAYS}-day limit, and that is where this path fits. For a run past it, section 28, Choosing Your Path, picks the
            long-lived family.
          </Box>
          <Box variant="p">
            The first step is a small job that proves the contract before the real one. Pin SDK v3; give{' '}
            <code>ModelTrainer</code> a stopping condition sized to the run, a <code>CheckpointConfig</code> with a
            prefix you chose, and the infrastructure check; have the script save per-rank files under{' '}
            <code>/opt/ml/checkpoints</code> every N steps and on <code>SIGTERM</code>; validate with{' '}
            <code>dry_run=True</code>. Then stop the job mid-run, start a new one on the same prefix, and confirm it
            resumes at the step it saved. Only then scale the instance count, adding a warm pool if you will iterate, Spot
            if the job can wait, or a training plan if it needs a date.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
