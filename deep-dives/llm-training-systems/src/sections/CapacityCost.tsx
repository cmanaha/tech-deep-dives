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
import { Cite, arxiv, gh, GUIDE_URL, LLAMA_MODELS_TAG } from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import {
  DENSE_MODELS,
  DEFAULT_MFU,
  EKS_FEES,
  INSTANCES,
  PCS_FEES,
  PRICES,
  PRICES_READ_ON,
  SOURCES,
  shapeOf,
  type DenseModelId,
  type InstanceId,
  type PcsControllerSize,
  type PricePath,
  type PriceRow,
  type Source,
} from '../lib/presets';
import { denseRuntimeInputs, estimateRun, priceRun, type CostLine, type CostResult, type FeeLine } from '../lib/runtime';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Register rows cited without re-opening the source keep the register's date. */
const REGISTER_DATE = '2026-10-30';

/** EC2 On-Demand Instance quotas (re-opened 2026-10-31). */
const OD_QUOTAS = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html';
/** EC2 Capacity Blocks for ML overview and considerations (re-opened 2026-10-31). */
const CB_GUIDE = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html';
/** Find and purchase Capacity Blocks: duration steps (re-read in wave 2, 2026-10-31). */
const CB_PURCHASE = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-purchase.html';
/** Capacity Blocks pricing and billing (register, 2026-10-30). */
const CB_BILLING = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-pricing-billing.html';
/** Capacity Blocks pricing page (register, 2026-10-30). */
const CB_PRICING = SOURCES.capacityBlocks.url;
/** AWS CLI reference, describe-capacity-block-offerings (opened 2026-10-31). */
const CB_CLI = 'https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-block-offerings.html';
/** On-Demand Capacity Reservations (re-read in wave 2, 2026-10-31). */
const ODCR = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html';
/** SageMaker training plans (re-opened 2026-10-31). */
const TRAINING_PLANS = 'https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html';
/** Training plans utilization for training jobs (re-opened 2026-10-31). */
const TP_JOBS = 'https://docs.aws.amazon.com/sagemaker/latest/dg/training-plan-utilization-for-training-jobs.html';
/** SageMaker managed Spot training (re-opened 2026-10-31). */
const MANAGED_SPOT = SOURCES.managedSpot.url;
/** EC2 accelerated computing instance specifications (Spot column re-read in wave 2, 2026-10-31). */
const EC2_TYPES = SOURCES.ec2Specs.url;
/** Spot Instance interruption notices (register, 2026-10-30). */
const SPOT_NOTICE = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html';
/** EKS node groups for AI/ML, Capacity Blocks (register, 2026-10-30). */
const EKS_NODE_GROUPS = 'https://docs.aws.amazon.com/eks/latest/userguide/ml-node-groups.html';
/** EKS accelerated compute management (re-read in wave 2, 2026-10-31). */
const EKS_COMPUTE = 'https://docs.aws.amazon.com/eks/latest/userguide/ml-compute-management.html';
/** AWS PCS with Capacity Blocks (register, 2026-10-30). */
const PCS_CB = 'https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks.html';
/** SageMaker AI pricing page, HyperPod note (register, 2026-10-30). */
const SAGEMAKER_PRICING = 'https://aws.amazon.com/sagemaker/ai/pricing/';
/** The Llama 3 Herd of Models. */
const LLAMA3 = arxiv('2407.21783v3');
/** Llama 3.1 model card at llama-models v0.2.0: GPU-hours per model. */
const LLAMA_CARD = gh('meta-llama/llama-models', LLAMA_MODELS_TAG, 'models/llama3_1/MODEL_CARD.md', 'L104-L154');

/** Short titles for the preset sources, so no register ID reaches the page. */
const SOURCE_TITLE: Record<string, string> = {
  [SOURCES.ec2PriceUse1.url]: 'AWS Price List, AmazonEC2 us-east-1, version 20261029175634',
  [SOURCES.ec2PriceUse2.url]: 'AWS Price List, AmazonEC2 us-east-2, version 20261029175634',
  [SOURCES.ec2PriceAllRegions.url]: 'AWS Price List, AmazonEC2 all Regions, version 20261029175634',
  [SOURCES.capacityBlocks.url]: 'EC2 Capacity Blocks pricing',
  [SOURCES.sagemakerUse1.url]: 'AWS Price List, AmazonSageMaker us-east-1, version 20261029165009',
  [SOURCES.sagemakerUse2.url]: 'AWS Price List, AmazonSageMaker us-east-2, version 20261029165009',
  [SOURCES.instanceTable.url]: 'AWS Price List rates as recorded in our research notes',
  [SOURCES.managedSpot.url]: 'SageMaker managed Spot training',
  [SOURCES.pcsPrice.url]: 'AWS Price List, AWSPCS us-east-1, version 20261027150327',
  [SOURCES.pcsSizes.url]: 'AWS PCS user guide, cluster size',
  [SOURCES.eksPrice.url]: 'AWS Price List, AmazonEKS us-east-1, version 20261027191639',
  [SOURCES.h100.url]: 'NVIDIA H100 specification; dense is half the sparse figure',
  [SOURCES.a100.url]: 'NVIDIA A100 specification',
  [SOURCES.hgx.url]: 'NVIDIA HGX specification; dense is half the sparse figure',
  [SOURCES.gb200.url]: 'NVIDIA GB200 NVL72 specification; dense is half the sparse figure',
  [SOURCES.trainium.url]: 'AWS Neuron documentation, Trainium',
  [SOURCES.trainium2.url]: 'AWS Neuron documentation, Trainium2',
  [SOURCES.h200.url]: 'NVIDIA H200 specification; dense is half the sparse figure',
};

/** Sources this research re-opened on 2026-10-31 (here or in wave 2); the rest keep the register's date. */
const REREAD_ON_RESEARCH_DATE = new Set<string>([
  SOURCES.managedSpot.url,
  SOURCES.pcsPrice.url,
  SOURCES.eksPrice.url,
  SOURCES.h100.url,
  SOURCES.hgx.url,
]);

function SourceCite({ source }: { source: Source }) {
  // Preset labels carry register IDs in parentheses; the page never prints those.
  const title = SOURCE_TITLE[source.url] ?? source.label.replace(/\s*\([^()]*\)/g, '');
  return (
    <Cite
      tier={source.tier}
      href={source.url}
      kind={source.basis === 'vendor-specification' ? 'vendor-claim' : undefined}
      accessed={REREAD_ON_RESEARCH_DATE.has(source.url) ? undefined : REGISTER_DATE}
    >
      {title}
    </Cite>
  );
}

/* ------------------------------------------------------------------------ */
/* Documented reservation limits (EC2 Capacity Blocks and training plans)   */
/* ------------------------------------------------------------------------ */

/** Up to 64 instances per Capacity Block; 256 across blocks per organization on a date (CB_GUIDE). */
const BLOCK_MAX_INSTANCES = 64;
const ORG_MAX_BLOCK_INSTANCES = 256;
/** Blocks: 1-day steps to 14 days, then 7-day steps to 182 (CB_PURCHASE); plans: 1-day steps to 182 (TRAINING_PLANS). */
const MAX_RESERVATION_DAYS = 182;

/** Days to reserve for a run of `days`: a block rounds to its steps, a plan to whole days; undefined past 182. */
function reservedDays(days: number, kind: 'block' | 'plan'): number | undefined {
  const whole = Math.ceil(days - 1e-9);
  const rounded = kind === 'plan' || whole <= 14 ? whole : Math.ceil(whole / 7) * 7;
  return rounded <= MAX_RESERVATION_DAYS ? Math.max(rounded, 1) : undefined;
}

/* ------------------------------------------------------------------------ */
/* Number formatting (display only; every value comes from src/lib)         */
/* ------------------------------------------------------------------------ */

function usd(x: number): string {
  if (x >= 1e6) return `$${Number((x / 1e6).toPrecision(3))}M`;
  return `$${Number(x.toPrecision(3)).toLocaleString('en-US')}`;
}

/** A published rate at the precision the Price List gives it, never fewer than two decimals. */
function rate(x: number): string {
  return `$${x.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
}

/** A derived rate (our arithmetic), shown to the cent. */
function cents(x: number): string {
  return `$${x.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function sig3(x: number): string {
  if (x >= 1e6) return `${Number((x / 1e6).toPrecision(3))}M`;
  return Number(x.toPrecision(3)).toLocaleString('en-US');
}

const NVA = 'US East (N. Virginia)';

/** What each fee charges for, in the run's terms. */
const FEE_BASIS: Record<FeeLine['fee'], string> = {
  pcs: 'for this run: the controller fee over its wall-clock hours plus the node fee per instance-hour',
  eks: "for this run: the cluster fee over its wall-clock hours",
  eksAutoMode: 'for this run: the management fee per instance-hour plus the cluster fee over its wall-clock hours',
};

function uniqueByUrl(sources: Source[]): Source[] {
  return sources.filter((s, i) => sources.findIndex((t) => t.url === s.url) === i);
}

function shortRegion(region: string): string {
  return region
    .replace('US East (N. Virginia)', 'N. Virginia')
    .replace('US East (Ohio)', 'Ohio')
    .replace('Asia Pacific (Hyderabad)', 'Hyderabad')
    .replace('US East (Dallas) Local Zone', 'Dallas Local Zone');
}

const PATH_LABEL: Record<PricePath | 'sagemakerManagedSpot', string> = {
  ec2OnDemand: 'EC2 On-Demand',
  capacityBlock: 'EC2 Capacity Block',
  sagemakerTraining: 'SageMaker training job',
  hyperpod: 'SageMaker HyperPod node',
  trainingPlan: 'SageMaker training plan',
  sagemakerManagedSpot: 'SageMaker managed Spot, your discount',
};

/* ------------------------------------------------------------------------ */
/* The reference run: section 4's Calculator A, priced here                 */
/* ------------------------------------------------------------------------ */

const P5 = INSTANCES['p5.48xlarge'];
const REF_ACCELERATORS = ORG_MAX_BLOCK_INSTANCES * P5.acceleratorsPerInstance.value;
const REF_RUN = estimateRun({
  ...denseRuntimeInputs(shapeOf(DENSE_MODELS['llama-3.1-70b']), 'full'),
  tokens: 15e12,
  sequenceLength: 8_192,
  attention: 'none',
  peakTflopsPerAccelerator: P5.denseBf16TflopsPerAccelerator.value,
  accelerators: REF_ACCELERATORS,
  mfu: DEFAULT_MFU.value,
});
const REF_COST = priceRun({ acceleratorHours: REF_RUN.acceleratorHours, accelerators: REF_ACCELERATORS, instance: 'p5.48xlarge' });
const META_70B_HOURS = 7.0e6;
const META_COST = priceRun({ acceleratorHours: META_70B_HOURS, accelerators: REF_ACCELERATORS, instance: 'p5.48xlarge' });

function lineUsd(cost: CostResult, path: CostLine['path']): number {
  return cost.lines.find((l) => l.path === path)?.usd ?? Number.NaN;
}

const REF_DAYS = Math.round(REF_COST.wallClockDays);
const REF_BLOCK_DAYS = reservedDays(REF_COST.wallClockDays, 'block') ?? Number.NaN;
const REF_BLOCK_WINDOW = priceRun({
  acceleratorHours: REF_BLOCK_DAYS * 24 * REF_ACCELERATORS,
  accelerators: REF_ACCELERATORS,
  instance: 'p5.48xlarge',
});

function priceOf(instance: InstanceId, path: PricePath, unit?: string): PriceRow | undefined {
  return PRICES.find((p) => p.instance === instance && p.path === path && (unit === undefined || p.unit === unit));
}

const P5_OD = priceOf('p5.48xlarge', 'ec2OnDemand')?.usdPerUnitHour.value ?? Number.NaN;
const P5_CB = priceOf('p5.48xlarge', 'capacityBlock')?.usdPerUnitHour.value ?? Number.NaN;
const P5_PER_GPU = P5.acceleratorsPerInstance.value;

/* ------------------------------------------------------------------------ */
/* Diagram: one Capacity Block from search to its final half hour           */
/* ------------------------------------------------------------------------ */

function CapacityWindowDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, 640);

  const ink = '#16191f';
  const muted = '#414d5c';
  const sub = '#5f6b7a';
  const blue = '#0972d3';
  const blueFill = '#f2f8fd';
  const green = '#037f0c';
  const greenFill = '#ecf7ec';
  const orange = '#ec7211';
  const orangeFill = '#fdf3ec';
  const font = 'sans-serif';

  const W = narrow ? 400 : 900;
  const H = narrow ? 472 : 340;

  const stages = [
    { label: 'Search offerings', sub: 'start 30 minutes to 8 weeks ahead' },
    { label: 'Purchase', sub: 'price fixed and paid up front' },
    { label: 'Window opens', sub: '1 to 182 days, cannot be cancelled' },
  ];

  // Final-day axis: 10:00 to 11:30 UTC.
  const ax0 = narrow ? 24 : 250;
  const ax1 = narrow ? 376 : 870;
  const t = (minutesAfterTen: number) => ax0 + ((ax1 - ax0) * minutesAfterTen) / 90;
  const axisY = narrow ? 338 : 224;
  const lane1Y = narrow ? 368 : 240;
  const lane2Y = narrow ? 428 : 290;
  const laneH = narrow ? 30 : 34;

  const sectionLabel = (x: number, y: number, text: string) => (
    <text x={x} y={y} fill={muted} fontFamily={font} fontSize={12} fontWeight={700}>
      {text}
    </text>
  );

  const bar = (x0: number, x1: number, y: number, fill: string, stroke: string, text?: string, textFill = ink) => (
    <g>
      <rect x={x0} y={y} width={x1 - x0} height={laneH} rx={4} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {text && (
        <text
          x={(x0 + x1) / 2}
          y={y + laneH / 2 + 4}
          fill={textFill}
          fontFamily={font}
          fontSize={12}
          textAnchor="middle"
        >
          {text}
        </text>
      )}
    </g>
  );

  const stageBoxes = stages.map((s, i) => {
    if (narrow) {
      const y = 30 + i * 66;
      return (
        <g key={s.label}>
          <rect x={16} y={y} width={368} height={50} rx={6} fill={blueFill} stroke={blue} strokeWidth={1.5} />
          <text x={200} y={y + 21} fill={ink} fontFamily={font} fontSize={13} fontWeight={700} textAnchor="middle">
            {s.label}
          </text>
          <text x={200} y={y + 40} fill={sub} fontFamily={font} fontSize={12} textAnchor="middle">
            {s.sub}
          </text>
          {i < stages.length - 1 && (
            <line x1={200} y1={y + 51} x2={200} y2={y + 65} stroke={sub} strokeWidth={1.5} markerEnd="url(#capacity-cost-window-ah)" />
          )}
        </g>
      );
    }
    const x = 24 + i * 298;
    return (
      <g key={s.label}>
        <rect x={x} y={32} width={256} height={60} rx={6} fill={blueFill} stroke={blue} strokeWidth={1.5} />
        <text x={x + 128} y={56} fill={ink} fontFamily={font} fontSize={13} fontWeight={700} textAnchor="middle">
          {s.label}
        </text>
        <text x={x + 128} y={78} fill={sub} fontFamily={font} fontSize={12} textAnchor="middle">
          {s.sub}
        </text>
        {i < stages.length - 1 && (
          <line x1={x + 260} y1={62} x2={x + 294} y2={62} stroke={sub} strokeWidth={1.5} markerEnd="url(#capacity-cost-window-ah)" />
        )}
      </g>
    );
  });

  // The window bar, with the final day marked and periodic checkpoints below it.
  const winY = narrow ? 238 : 128;
  const winX0 = narrow ? 16 : 24;
  const winX1 = narrow ? 384 : 876;
  const finalX = narrow ? 320 : 790;
  const ticks = narrow ? [60, 110, 160, 210, 260, 310] : [120, 215, 310, 405, 500, 595, 690];

  const times = [
    { m: 0, label: '10:00' },
    { m: 30, label: '10:30' },
    { m: 60, label: '11:00' },
    { m: 90, label: '11:30' },
  ];

  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="capacity-cost-window-title"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <title id="capacity-cost-window-title">
          One Capacity Block from search to its final half hour. You search offerings that start from 30
          minutes to 8 weeks ahead, buy one at the price the offering quotes, paid up front, and the
          window then runs for 1 to 182 days while the job writes checkpoints. On the final day the
          window ends at 11:30 UTC. EC2 starts terminating most block instances at 11:00 UTC, and a
          training plan that serves training jobs does the same; P6e-GB200 UltraServer blocks and
          training plans that serve a HyperPod cluster lose their instances from 10:30 UTC. The
          job&apos;s last save has to finish before its edge.
        </title>
        <defs>
          <marker
            id="capacity-cost-window-ah"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill={sub} />
          </marker>
        </defs>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />

        {sectionLabel(narrow ? 16 : 24, 22, 'Before the window')}
        {stageBoxes}

        {sectionLabel(winX0, winY - 10, 'During the window')}
        <rect x={winX0} y={winY} width={winX1 - winX0} height={34} rx={4} fill={blueFill} stroke={blue} strokeWidth={1.5} />
        <rect x={finalX} y={winY} width={winX1 - finalX} height={34} rx={4} fill={blue} stroke={blue} strokeWidth={1.5} />
        <text x={winX0 + (narrow ? 10 : 16)} y={winY + 22} fill={ink} fontFamily={font} fontSize={12}>
          {narrow ? 'Training, a checkpoint every interval' : 'Training runs and writes a checkpoint every interval (section 18)'}
        </text>
        <text
          x={(finalX + winX1) / 2}
          y={winY + 22}
          fill="#ffffff"
          fontFamily={font}
          fontSize={12}
          fontWeight={700}
          textAnchor="middle"
        >
          final day
        </text>
        {ticks.map((x) => (
          <line key={x} x1={x} y1={winY + 38} x2={x} y2={winY + 48} stroke={green} strokeWidth={2.5} />
        ))}
        {!narrow && (
          <text x={ticks[0] - 8} y={winY + 48} fill={green} fontFamily={font} fontSize={11} textAnchor="end">
            checkpoints
          </text>
        )}

        {sectionLabel(narrow ? 16 : 24, narrow ? 312 : 198, 'The final day, 10:00 to 11:30 UTC')}
        <line x1={ax0} y1={axisY} x2={ax1} y2={axisY} stroke={muted} strokeWidth={1.5} />
        {times.map((tm, i) => (
          <g key={tm.label}>
            <line x1={t(tm.m)} y1={axisY} x2={t(tm.m)} y2={axisY + 6} stroke={muted} strokeWidth={1.5} />
            <text
              x={narrow && i === 0 ? 16 : narrow && i === times.length - 1 ? 384 : t(tm.m)}
              y={axisY - 8}
              fill={muted}
              fontFamily={font}
              fontSize={12}
              textAnchor={narrow && i === 0 ? 'start' : narrow && i === times.length - 1 ? 'end' : 'middle'}
            >
              {tm.label}
            </text>
          </g>
        ))}

        {/* Edge guides, wide layout only: in the narrow layout they would cross the lane labels. */}
        {!narrow && (
          <g>
            <line x1={t(30)} y1={axisY} x2={t(30)} y2={lane2Y + laneH} stroke={orange} strokeWidth={1.5} strokeDasharray="5 4" />
            <line x1={t(60)} y1={axisY} x2={t(60)} y2={lane1Y + laneH} stroke={orange} strokeWidth={1.5} strokeDasharray="5 4" />
          </g>
        )}

        {/* Lane 1: most Capacity Blocks; training plans for training jobs. */}
        {narrow ? (
          <text x={16} y={lane1Y - 8} fill={ink} fontFamily={font} fontSize={12} fontWeight={700}>
            Most blocks; plan for training jobs
          </text>
        ) : (
          <g>
            <text x={24} y={lane1Y + 14} fill={ink} fontFamily={font} fontSize={12} fontWeight={700}>
              Most Capacity Blocks;
            </text>
            <text x={24} y={lane1Y + 30} fill={ink} fontFamily={font} fontSize={12} fontWeight={700}>
              training plan for training jobs
            </text>
          </g>
        )}
        {bar(ax0, t(narrow ? 40 : 42), lane1Y, blueFill, blue, 'training')}
        {bar(t(narrow ? 40 : 42), t(58.5), lane1Y, greenFill, green, 'last save')}
        {bar(t(60), ax1, lane1Y, orangeFill, orange, narrow ? 'from 11:00' : 'terminations from 11:00')}

        {/* Lane 2: P6e-GB200 UltraServer blocks; training plans for HyperPod. */}
        {narrow ? (
          <text x={16} y={lane2Y - 8} fill={ink} fontFamily={font} fontSize={12} fontWeight={700}>
            P6e-GB200 UltraServer; plan for HyperPod
          </text>
        ) : (
          <g>
            <text x={24} y={lane2Y + 14} fill={ink} fontFamily={font} fontSize={12} fontWeight={700}>
              P6e-GB200 UltraServer block;
            </text>
            <text x={24} y={lane2Y + 30} fill={ink} fontFamily={font} fontSize={12} fontWeight={700}>
              training plan for HyperPod
            </text>
          </g>
        )}
        {bar(ax0, t(narrow ? 12 : 14), lane2Y, blueFill, blue, narrow ? undefined : 'training')}
        {bar(t(narrow ? 12 : 14), t(28.5), lane2Y, greenFill, green, 'last save')}
        {bar(t(30), ax1, lane2Y, orangeFill, orange, 'terminations from 10:30')}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Tables                                                                   */
/* ------------------------------------------------------------------------ */

const cell: CSSProperties = {
  padding: '5px 6px',
  fontSize: 13,
  borderBottom: '1px solid #e9ebed',
  textAlign: 'left',
  verticalAlign: 'top',
};
const nameCell: CSSProperties = { ...cell, overflowWrap: 'anywhere' };
/** Wide enough for the part of an instance name after its dot (48xlarge) at 390px. */
const unitCell: CSSProperties = { ...nameCell, minWidth: 74 };
const headCell: CSSProperties = { ...cell, fontWeight: 700, borderBottom: '2px solid #d1d5db' };
const tableStyle: CSSProperties = { borderCollapse: 'collapse', width: '100%' };

function Small({ children }: { children: ReactNode }) {
  return (
    <Box variant="small" display="block" color="text-body-secondary">
      {children}
    </Box>
  );
}

interface CapacityPathRow {
  path: string;
  start: string;
  length: string;
  watch: string;
}

const CAPACITY_PATHS: CapacityPathRow[] = [
  {
    path: 'EC2 On-Demand',
    start: 'Now, when capacity is free',
    length: 'Any',
    watch: 'P and Trn quotas start at 0 vCPUs; nothing is reserved',
  },
  {
    path: 'EC2 Capacity Block',
    start: '30 minutes to 8 weeks ahead',
    length: '1 to 14 days by the day, then by the week to 182',
    watch: 'Up to 64 instances a block, 256 per organization on a date; no cancellation',
  },
  {
    path: 'SageMaker training plan',
    start: '30 minutes to 8 weeks ahead',
    length: '1 to 182 days by the day',
    watch: '1, 2, 4, 8, 16, 32 or 64 instances, for one target only',
  },
  {
    path: 'Spot',
    start: 'When capacity is spare',
    length: 'Until reclaimed, with two minutes of notice',
    watch: 'Not for P6e-GB200 or Trn2 UltraServer instances',
  },
];

function CapacityPathsTable() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, 520);
  if (narrow) {
    // Stacked on a phone: four prose columns do not fit 390px without breaking words.
    return (
      <div ref={ref}>
        <SpaceBetween size="xs">
          {CAPACITY_PATHS.map((r) => (
            <Box variant="p" key={r.path}>
              <strong>{r.path}.</strong> Can start: {r.start}. Length: {r.length}. Watch for: {r.watch}.
            </Box>
          ))}
        </SpaceBetween>
      </div>
    );
  }
  return (
    <div ref={ref} style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headCell}>Path</th>
            <th style={headCell}>Can start</th>
            <th style={headCell}>Length</th>
            <th style={headCell}>Watch for</th>
          </tr>
        </thead>
        <tbody>
          {CAPACITY_PATHS.map((r) => (
            <tr key={r.path}>
              <td style={cell}>
                <strong>{r.path}</strong>
              </td>
              <td style={cell}>{r.start}</td>
              <td style={cell}>{r.length}</td>
              <td style={cell}>{r.watch}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface InstanceRow {
  label: string;
  instance: InstanceId;
  unit?: string;
}

const INSTANCE_ROWS: InstanceRow[] = [
  { label: 'p4d.24xlarge', instance: 'p4d.24xlarge' },
  { label: 'p4de.24xlarge', instance: 'p4de.24xlarge' },
  { label: 'p5.48xlarge', instance: 'p5.48xlarge' },
  { label: 'p5e.48xlarge', instance: 'p5e.48xlarge' },
  { label: 'p5en.48xlarge', instance: 'p5en.48xlarge' },
  { label: 'p6-b200.48xlarge', instance: 'p6-b200.48xlarge' },
  { label: 'p6-b300.48xlarge', instance: 'p6-b300.48xlarge' },
  { label: 'u-p6e-gb200x72, 72 GPUs', instance: 'p6e-gb200.36xlarge', unit: 'u-p6e-gb200x72 UltraServer' },
  { label: 'u-p6e-gb200x36, 36 GPUs', instance: 'p6e-gb200.36xlarge', unit: 'u-p6e-gb200x36 UltraServer' },
  { label: 'trn1.32xlarge', instance: 'trn1.32xlarge' },
  { label: 'trn1n.32xlarge', instance: 'trn1n.32xlarge' },
  { label: 'trn2.48xlarge', instance: 'trn2.48xlarge' },
];

/** An instance name that wraps after its dot on a narrow screen rather than mid-word. */
function InstanceName({ name }: { name: string }) {
  const parts = name.split('.');
  return (
    <>
      {parts.map((part, i) => (
        <span key={`${part}-${i}`}>
          {i > 0 && (
            <>
              .<wbr />
            </>
          )}
          {part}
        </span>
      ))}
    </>
  );
}

function RateCell({ row }: { row: PriceRow | undefined }) {
  if (!row) return <td style={cell}>none published</td>;
  return (
    <td style={cell}>
      {rate(row.usdPerUnitHour.value)}
      {row.region !== NVA && <Small>{shortRegion(row.region)}</Small>}
    </td>
  );
}

function rowsFor(r: InstanceRow, path: PricePath): PriceRow | undefined {
  // UltraServer rows are Capacity Block only; their unit names the UltraServer.
  if (r.unit) return path === 'capacityBlock' ? priceOf(r.instance, path, r.unit) : undefined;
  return priceOf(r.instance, path);
}

function Ec2RatesTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headCell}>Instance</th>
            <th style={headCell}>On-Demand</th>
            <th style={headCell}>Capacity Block</th>
            <th style={headCell}>Block as a share of On-Demand</th>
          </tr>
        </thead>
        <tbody>
          {INSTANCE_ROWS.map((r) => {
            const od = rowsFor(r, 'ec2OnDemand');
            const cb = rowsFor(r, 'capacityBlock');
            const ratio =
              od && cb && od.region === cb.region
                ? (cb.usdPerUnitHour.value / od.usdPerUnitHour.value).toFixed(3)
                : od && cb
                  ? 'different Regions'
                  : 'no pair';
            return (
              <tr key={r.label}>
                <td style={nameCell}>
                  <InstanceName name={r.label} />
                </td>
                <RateCell row={od} />
                <RateCell row={cb} />
                <td style={cell}>{ratio}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SageMakerRatesTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headCell}>Instance (ml.)</th>
            <th style={headCell}>Training job</th>
            <th style={headCell}>HyperPod node</th>
            <th style={headCell}>Training plan</th>
          </tr>
        </thead>
        <tbody>
          {INSTANCE_ROWS.filter((r) => !r.unit).map((r) => (
            <tr key={r.label}>
              <td style={nameCell}>
                  <InstanceName name={r.label} />
                </td>
              <RateCell row={rowsFor(r, 'sagemakerTraining')} />
              <RateCell row={rowsFor(r, 'hyperpod')} />
              <RateCell row={rowsFor(r, 'trainingPlan')} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Rows of register 05's dollars-per-peak table, ordered by the Capacity Block figure. */
const PFLOP_ROWS: InstanceRow[] = [
  { label: 'trn1.32xlarge', instance: 'trn1.32xlarge' },
  { label: 'trn2.48xlarge', instance: 'trn2.48xlarge' },
  { label: 'u-p6e-gb200x72', instance: 'p6e-gb200.36xlarge', unit: 'u-p6e-gb200x72 UltraServer' },
  { label: 'p4d.24xlarge', instance: 'p4d.24xlarge' },
  { label: 'p5.48xlarge', instance: 'p5.48xlarge' },
  { label: 'p6-b200.48xlarge', instance: 'p6-b200.48xlarge' },
  { label: 'p6-b300.48xlarge', instance: 'p6-b300.48xlarge' },
  { label: 'p5en.48xlarge', instance: 'p5en.48xlarge' },
];

/** Peak dense BF16 PFLOPS of one billed unit: accelerators per unit x dense peak (vendor specifications). */
function unitPeakPflops(r: InstanceRow): number {
  const cb = rowsFor(r, 'capacityBlock');
  const accelerators = cb ? cb.acceleratorsPerUnit.value : INSTANCES[r.instance].acceleratorsPerInstance.value;
  return (accelerators * INSTANCES[r.instance].denseBf16TflopsPerAccelerator.value) / 1_000;
}

function perPflop(row: PriceRow | undefined, peak: number): string {
  return row ? `$${(row.usdPerUnitHour.value / peak).toFixed(2)}` : 'no US rate';
}

function PeakPriceTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headCell}>Unit</th>
            <th style={headCell}>Peak BF16 PFLOPS</th>
            <th style={headCell}>On-Demand, $ per PFLOP-hour</th>
            <th style={headCell}>Block, $ per PFLOP-hour</th>
          </tr>
        </thead>
        <tbody>
          {PFLOP_ROWS.map((r) => {
            const peak = unitPeakPflops(r);
            const od = rowsFor(r, 'ec2OnDemand');
            const cb = rowsFor(r, 'capacityBlock');
            const usOd = od && od.region !== 'Asia Pacific (Hyderabad)' ? od : undefined;
            return (
              <tr key={r.label}>
                <td style={unitCell}>
                  <InstanceName name={r.label} />
                  {cb && cb.region !== NVA && <Small>block in {shortRegion(cb.region)}</Small>}
                </td>
                <td style={cell}>{Number(peak.toPrecision(4)).toLocaleString('en-US')}</td>
                <td style={cell}>{perPflop(usOd, peak)}</td>
                <td style={cell}>{perPflop(cb, peak)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Calculator A: the cost panel                                             */
/* ------------------------------------------------------------------------ */

type HoursMode = 'run' | 'hours';
type PcsChoice = 'auto' | PcsControllerSize;

interface CostInputs {
  mode: HoursMode;
  model: DenseModelId;
  tokensT: string;
  mfuPct: number;
  hours: string;
  instance: InstanceId;
  instances: string;
  spotPct: string;
  pcs: PcsChoice;
  eks: 'standard' | 'extended';
}

interface CostPreset {
  id: string;
  label: string;
  patch: Partial<CostInputs>;
}

const DEFAULT_MFU_PCT = Math.round(DEFAULT_MFU.value * 100);

const COST_PRESETS: CostPreset[] = [
  {
    id: 'ref',
    label: 'Llama 3.1 70B, 15T tokens, 256 p5.48xlarge (the worked bill)',
    patch: { mode: 'run', model: 'llama-3.1-70b', tokensT: '15', mfuPct: DEFAULT_MFU_PCT, instance: 'p5.48xlarge', instances: '256' },
  },
  {
    id: 'meta',
    label: "Meta's published 7.0M H100-hours for Llama 3.1 70B, on 256 p5.48xlarge",
    patch: { mode: 'hours', hours: '7000000', instance: 'p5.48xlarge', instances: '256' },
  },
  {
    id: '70b-1t',
    label: 'Llama 3.1 70B, 1T tokens, 32 p5.48xlarge (section 4)',
    patch: { mode: 'run', model: 'llama-3.1-70b', tokensT: '1', mfuPct: DEFAULT_MFU_PCT, instance: 'p5.48xlarge', instances: '32' },
  },
  {
    id: '8b-trn2',
    label: 'Llama 3.1 8B, 1T tokens, 32 trn2.48xlarge (section 4)',
    patch: { mode: 'run', model: 'llama-3.1-8b', tokensT: '1', mfuPct: DEFAULT_MFU_PCT, instance: 'trn2.48xlarge', instances: '32' },
  },
];

const CUSTOM_PRESET = 'yours';

const CALC_INSTANCES: InstanceId[] = [
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

const MODEL_LABEL: Record<DenseModelId, string> = {
  'llama-3.1-8b': 'Llama 3.1 8B',
  'llama-3.1-70b': 'Llama 3.1 70B',
  'llama-3.1-405b': 'Llama 3.1 405B',
};

interface CostOutcomeOk {
  ok: true;
  acceleratorHours: number;
  accelerators: number;
  cost: CostResult;
  blockDays?: number;
  planDays?: number;
  blockWindowUsd?: number;
  planWindowUsd?: number;
  warnings: string[];
}

type CostOutcome = CostOutcomeOk | { ok: false; message: string };

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

/** Strips register IDs such as (T06-35) from library notes before they reach the page. */
function plainNote(note: string): string {
  return note.replace(/\s*\([A-Z]\d{2}-\d+[^)]*\)/g, '');
}

/** Reads the form, calls Calculator A's estimate and cost functions; every formula lives in src/lib. */
function computeCost(inp: CostInputs): CostOutcome {
  try {
    const preset = INSTANCES[inp.instance];
    const instances = parseWhole('Instances', inp.instances);
    const accelerators = instances * preset.acceleratorsPerInstance.value;
    const acceleratorHours =
      inp.mode === 'run'
        ? estimateRun({
            ...denseRuntimeInputs(shapeOf(DENSE_MODELS[inp.model]), 'full'),
            tokens: parsePositive('Training tokens', inp.tokensT) * 1e12,
            sequenceLength: 8_192,
            attention: 'none',
            peakTflopsPerAccelerator: preset.denseBf16TflopsPerAccelerator.value,
            accelerators,
            mfu: inp.mfuPct / 100,
          }).acceleratorHours
        : parsePositive('Accelerator-hours', inp.hours);
    let managedSpotDiscount: number | undefined;
    if (inp.spotPct.trim() !== '') {
      const pct = Number(inp.spotPct);
      if (!Number.isFinite(pct) || pct < 0 || pct >= 100) {
        throw new RangeError(`Managed Spot discount must be at least 0 and below 100 percent (got "${inp.spotPct}")`);
      }
      managedSpotDiscount = pct > 0 ? pct / 100 : undefined;
    }
    const cost = priceRun({
      acceleratorHours,
      accelerators,
      instance: inp.instance,
      managedSpotDiscount,
      pcsControllerSize: inp.pcs === 'auto' ? undefined : inp.pcs,
      eksSupport: inp.eks,
    });

    const warnings: string[] = [];
    if (cost.instances > BLOCK_MAX_INSTANCES) {
      warnings.push(
        `A Capacity Block holds up to ${BLOCK_MAX_INSTANCES} instances, so ${cost.instances} instances take at least ${Math.ceil(cost.instances / BLOCK_MAX_INSTANCES)} blocks, and a training plan's largest quantity is 64 instances.`,
      );
    }
    if (cost.instances > ORG_MAX_BLOCK_INSTANCES) {
      warnings.push(
        `${cost.instances} instances is more than the ${ORG_MAX_BLOCK_INSTANCES} an organization can hold in Capacity Blocks on one date; the documentation read gives no self-serve path past it.`,
      );
    }
    const blockDays = reservedDays(cost.wallClockDays, 'block');
    const planDays = reservedDays(cost.wallClockDays, 'plan');
    if (blockDays === undefined) {
      warnings.push(
        `${sig3(cost.wallClockDays)} days is longer than ${MAX_RESERVATION_DAYS} days, the longest single block or training plan, so the run spans more than one reservation and resumes from a checkpoint across the boundary (our reading).`,
      );
    }
    const windowUsd = (days: number | undefined, path: PricePath) =>
      days === undefined
        ? undefined
        : priceRun({ acceleratorHours: days * 24 * accelerators, accelerators, instance: inp.instance }).lines.find(
            (l) => l.path === path,
          )?.usd;
    return {
      ok: true,
      acceleratorHours,
      accelerators,
      cost,
      blockDays,
      planDays,
      blockWindowUsd: windowUsd(blockDays, 'capacityBlock'),
      planWindowUsd: windowUsd(planDays, 'trainingPlan'),
      warnings,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, message: plainNote(message) };
  }
}

function option(value: string, label: string, description?: string): SelectProps.Option {
  return { value, label, description };
}

function CostLinesTable({ outcome }: { outcome: CostOutcomeOk }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headCell}>Path and source</th>
            <th style={headCell}>Rate per unit-hour</th>
            <th style={headCell}>This run</th>
          </tr>
        </thead>
        <tbody>
          {outcome.cost.lines.map((l) => {
            const windowUsd =
              l.path === 'capacityBlock' ? outcome.blockWindowUsd : l.path === 'trainingPlan' ? outcome.planWindowUsd : undefined;
            const windowDays = l.path === 'capacityBlock' ? outcome.blockDays : outcome.planDays;
            return (
              <tr key={`${l.path}-${l.unit}`}>
                <td style={nameCell}>
                  <strong>{PATH_LABEL[l.path]}</strong>
                  <Small>
                    <SourceCite source={l.source} />
                  </Small>
                </td>
                <td style={cell}>
                  {rate(l.usdPerUnitHour)}
                  <Small>
                    per {l.unit}, {shortRegion(l.region)}
                  </Small>
                </td>
                <td style={cell}>
                  {usd(l.usd)}
                  {windowUsd !== undefined && windowDays !== undefined && (
                    <Small>
                      {usd(windowUsd)} for the whole {windowDays}-day window, paid up front at the price
                      quoted at purchase
                    </Small>
                  )}
                  {l.note && <Small>{l.note}</Small>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CostPanel() {
  const first = COST_PRESETS[0];
  const [presetId, setPresetId] = useState<string>(first.id);
  const [inp, setInp] = useState<CostInputs>({
    mode: 'run',
    model: 'llama-3.1-70b',
    tokensT: '15',
    mfuPct: DEFAULT_MFU_PCT,
    hours: '7000000',
    instance: 'p5.48xlarge',
    instances: '256',
    spotPct: '',
    pcs: 'auto',
    eks: 'standard',
    ...first.patch,
  });

  const update = (patch: Partial<CostInputs>) => {
    setPresetId(CUSTOM_PRESET);
    setInp((prev) => ({ ...prev, ...patch }));
  };
  const applyPreset = (id: string) => {
    const p = COST_PRESETS.find((x) => x.id === id);
    if (!p) return;
    setPresetId(id);
    setInp((prev) => ({ ...prev, spotPct: '', pcs: 'auto', eks: 'standard', ...p.patch }));
  };

  const outcome = useMemo(() => computeCost(inp), [inp]);
  const inst = INSTANCES[inp.instance];

  const presetOptions = [...COST_PRESETS.map((p) => option(p.id, p.label)), option(CUSTOM_PRESET, 'Your inputs')];
  const modeOptions = [
    option('run', "From a run, with section 4's FLOP count"),
    option('hours', 'Accelerator-hours you already have'),
  ];
  const modelOptions = (Object.keys(MODEL_LABEL) as DenseModelId[]).map((m) => option(m, MODEL_LABEL[m]));
  const instanceOptions = CALC_INSTANCES.map((id) =>
    option(id, id, `${INSTANCES[id].acceleratorsPerInstance.value} x ${INSTANCES[id].accelerator}`),
  );
  const pcsOptions = [
    option('auto', 'Smallest that holds the instances'),
    option('small', 'Small, up to 32 instances'),
    option('medium', 'Medium, up to 512 instances'),
    option('large', 'Large, up to 2,048 instances'),
  ];
  const eksOptions = [option('standard', 'Standard support'), option('extended', 'Extended support')];
  const find = (opts: SelectProps.Option[], v: string) => opts.find((o) => o.value === v) ?? null;

  let outputs: ReactNode;
  if (!outcome.ok) {
    outputs = (
      <Alert type="error" header="The bill cannot be computed from these inputs">
        {outcome.message}
      </Alert>
    );
  } else {
    const c = outcome.cost;
    outputs = (
      <SpaceBetween size="s">
        <KeyValuePairs
          columns={3}
          items={[
            { label: 'Accelerator-hours priced', value: sig3(outcome.acceleratorHours) },
            {
              label: 'Instances and accelerators',
              value: `${c.instances.toLocaleString('en-US')} instances, ${outcome.accelerators.toLocaleString('en-US')} accelerators`,
            },
            {
              label: 'Wall-clock time on them',
              value: c.wallClockDays < 2 ? `${sig3(c.wallClockHours)} hours` : `${sig3(c.wallClockDays)} days`,
            },
          ]}
        />
        <CostLinesTable outcome={outcome} />
        <Box variant="h4">Fees for the orchestration around the instances</Box>
        <Box variant="p">
          Each fee adds to an EC2 line above, and a HyperPod cluster orchestrated by Amazon EKS pays the
          EKS cluster fee on top of its node rate, because HyperPod pricing excludes the services
          attached to it{' '}
          <Cite tier={1} href={SAGEMAKER_PRICING} accessed={REGISTER_DATE}>
            SageMaker AI pricing, HyperPod
          </Cite>
          .
        </Box>
        {c.fees.map((f) => (
          <Box variant="p" key={f.fee}>
            <strong>{f.description}:</strong> {usd(f.usd)} {FEE_BASIS[f.fee]},{' '}
            {shortRegion(f.region)}{' '}
            {uniqueByUrl(f.sources).map((s, i) => (
              <span key={s.url}>
                {i > 0 && ' '}
                <SourceCite source={s} />
              </span>
            ))}
          </Box>
        ))}
        {[...outcome.warnings, ...c.notes.map(plainNote)].map((w) => (
          <Alert type="warning" key={w}>
            {w}
          </Alert>
        ))}
        <Box variant="small" color="text-body-secondary">
          Rates read {PRICES_READ_ON}. Hours from the run use 6N with the full parameter count, no
          attention term and no overhead factor, at MFU {inp.mfuPct}%: estimate; confirm with a measured
          step. A HyperPod cluster bills for as long as it exists, idle included; this panel prices only
          the run&apos;s hours.
        </Box>
      </SpaceBetween>
    );
  }

  return (
    <SpaceBetween size="m">
      <FormField
        label="Start from a preset"
        description="Each preset fills the inputs below; changing any input switches to your inputs."
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
        <FormField label="Where the hours come from">
          <Select
            selectedOption={find(modeOptions, inp.mode)}
            options={modeOptions}
            onChange={({ detail }) => update({ mode: (detail.selectedOption.value ?? 'run') as HoursMode })}
          />
        </FormField>
        {inp.mode === 'run' ? (
          <FormField label="Model">
            <Select
              selectedOption={find(modelOptions, inp.model)}
              options={modelOptions}
              onChange={({ detail }) => update({ model: (detail.selectedOption.value ?? 'llama-3.1-70b') as DenseModelId })}
            />
          </FormField>
        ) : (
          <FormField label="Accelerator-hours" description="For example the hours section 4 gives with an attention term.">
            <Input type="number" value={inp.hours} onChange={({ detail }) => update({ hours: detail.value })} />
          </FormField>
        )}
        {inp.mode === 'run' && (
          <FormField label="Training tokens, in trillions">
            <Input type="number" value={inp.tokensT} onChange={({ detail }) => update({ tokensT: detail.value })} />
          </FormField>
        )}
        {inp.mode === 'run' && (
          <FormField
            label={`MFU: ${inp.mfuPct}%`}
            description={
              <>
                An assumption: estimate; confirm with a measured step. The default 40% sits inside the
                38% to 43% BF16 MFU of Llama 3 405B on H100{' '}
                <Cite tier={3} href={LLAMA3} venue="preprint">
                  Llama 3 Herd of Models, Table 4
                </Cite>
                .
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
        )}
        <FormField
          label="Instance"
          description={
            <>
              Dense BF16 peak, a vendor specification: <SourceCite source={inst.denseBf16TflopsPerAccelerator.source} />
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
          label="Managed Spot discount, percent (optional)"
          description={
            <>
              Your expected saving on the training-job rate, for example 1 minus BillableTimeInSeconds over
              TrainingTimeInSeconds from a past job. An assumption: estimate; confirm with a measured step{' '}
              <Cite tier={1} href={MANAGED_SPOT}>
                SageMaker managed Spot training
              </Cite>
            </>
          }
        >
          <Input
            type="number"
            value={inp.spotPct}
            placeholder="none"
            onChange={({ detail }) => update({ spotPct: detail.value })}
          />
        </FormField>
        <FormField label="AWS PCS controller size">
          <Select
            selectedOption={find(pcsOptions, inp.pcs)}
            options={pcsOptions}
            onChange={({ detail }) => update({ pcs: (detail.selectedOption.value ?? 'auto') as PcsChoice })}
          />
        </FormField>
        <FormField label="Amazon EKS version support">
          <Select
            selectedOption={find(eksOptions, inp.eks)}
            options={eksOptions}
            onChange={({ detail }) => update({ eks: (detail.selectedOption.value ?? 'standard') as 'standard' | 'extended' })}
          />
        </FormField>
      </ColumnLayout>
      <Box variant="p">
        <code>path cost = accelerator-hours / accelerators per billed unit x rate per unit-hour</code>;{' '}
        <code>PCS fee = controller rate x wall-clock hours + node fee x instance-hours</code>;{' '}
        <code>EKS fee = cluster rate x wall-clock hours</code>, plus the Auto Mode fee per instance-hour
        where you choose Auto Mode.
      </Box>
      {outputs}
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function CapacityCost() {
  const hours = sig3(REF_RUN.acceleratorHours);
  const od = usd(lineUsd(REF_COST, 'ec2OnDemand'));
  const cb = usd(lineUsd(REF_COST, 'capacityBlock'));
  const plan = usd(lineUsd(REF_COST, 'trainingPlan'));
  const blockWindow = usd(lineUsd(REF_BLOCK_WINDOW, 'capacityBlock'));
  const metaOd = usd(lineUsd(META_COST, 'ec2OnDemand'));
  const metaDays = Math.round(META_COST.wallClockDays);
  const metaRatio = (META_70B_HOURS / REF_RUN.acceleratorHours).toFixed(1);
  const pcsAdvanced = PCS_FEES.advancedNodeUsdPerInstanceHour.value;
  const autoModeP5 = EKS_FEES.autoModeUsdPerInstanceHour['p5.48xlarge']?.value ?? Number.NaN;
  const autoModeShare = ((autoModeP5 / P5_OD) * 100).toFixed(1);
  const trn2Cb = priceOf('trn2.48xlarge', 'capacityBlock')?.usdPerUnitHour.value ?? Number.NaN;
  const trn2Job = priceOf('trn2.48xlarge', 'sagemakerTraining')?.usdPerUnitHour.value ?? Number.NaN;
  const trn2Plan = priceOf('trn2.48xlarge', 'trainingPlan')?.usdPerUnitHour.value ?? Number.NaN;
  const trn2CbBelow = Math.round((1 - trn2Cb / trn2Job) * 100);
  const trn2PlanBelow = Math.round((1 - trn2Plan / trn2Job) * 100);

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={`Get the accelerators for the window you need, then price the run on every AWS path: Llama 3.1 70B on 15T tokens at an assumed 40% MFU is about ${od} On-Demand or ${cb} on Capacity Blocks, ${REF_DAYS} days at the 2,048-GPU self-serve ceiling (prices dated ${PRICES_READ_ON}; sources read 2026-10-31)`}
          >
            22. Capacity &amp; Cost
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A training run is bought twice: once as capacity, the accelerators on the dates the run
            needs them, and once as a bill, accelerator-hours times an hourly rate. For the P and Trn
            instance families the first purchase decides when the run can start, and the second depends
            on how the first was made: one H100-hour costs {cents(P5_OD / P5_PER_GPU)} On-Demand and{' '}
            {cents(P5_CB / P5_PER_GPU)} inside a Capacity Block (accelerators reserved for a fixed date
            window), on a p5.48xlarge in US East (N. Virginia){' '}
            <SourceCite source={SOURCES.ec2PriceUse1} />, our arithmetic per GPU.
          </Box>
          <Box variant="p">
            This section takes the hours that section 4, Counting the Arithmetic: 6ND, MFU &amp; Run
            Time, estimates and turns them into a start date and a bill. The reference run is section
            4&apos;s: Llama 3.1 70B on 15T tokens at 40% MFU (model FLOPs utilization, the share of the
            accelerators&apos; dense peak that the model&apos;s own arithmetic achieves, here an
            assumption), {hours} H100-hours. Capacity comes first, then the edge of a reserved window,
            then the rate on each path, two worked bills, and Calculator A&apos;s cost panel for your
            own run.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know which way of buying can promise the date your run starts, and which limit caps how fast it can finish"
          >
            Capacity first: which purchase gives you a start date
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A new account cannot launch a single P or Trn instance On-Demand. Amazon EC2 (Elastic
            Compute Cloud) counts On-Demand quotas in vCPUs (virtual CPUs) per instance family and
            Region, and the defaults for Running On-Demand P instances and Running On-Demand Trn
            instances are both 0{' '}
            <Cite tier={1} href={OD_QUOTAS}>
              EC2 On-Demand Instance quotas
            </Cite>
            . A p5.48xlarge has 192 vCPUs{' '}
            <Cite tier={1} href={EC2_TYPES} accessed={REGISTER_DATE}>
              EC2 accelerated computing instance specifications
            </Cite>
            , so 32 of them need a quota of 6,144, our arithmetic. A raised quota lets you launch when
            capacity is free and reserves nothing, our reading.
          </Box>
          <Box variant="p">
            An On-Demand Capacity Reservation holds capacity in one Availability Zone and bills whether
            it is used or not, and future-dated reservations are limited to the C, G, I, M, R, T, U and X
            families{' '}
            <Cite tier={1} href={ODCR}>
              EC2 On-Demand Capacity Reservations
            </Cite>
            . For P and Trn instances it can only protect capacity you already hold, our reading of that
            family list. A future start date therefore means one of two products: an EC2 Capacity Block
            for ML, or a SageMaker training plan, SageMaker&apos;s reservation of the same kind for its
            training jobs or a HyperPod cluster.
          </Box>
          <CapacityPathsTable />
          <Box variant="p">
            Both reservations can be bought up to 8 weeks ahead and can start in as little as 30 minutes{' '}
            <Cite tier={1} href={CB_GUIDE}>
              EC2 Capacity Blocks for ML
            </Cite>{' '}
            <Cite tier={1} href={TRAINING_PLANS}>
              SageMaker training plans
            </Cite>
            . Their lengths step differently: a block runs 1 to 14 days in 1-day steps, then in 7-day
            steps up to 182 days{' '}
            <Cite tier={1} href={CB_PURCHASE}>
              Find and purchase Capacity Blocks
            </Cite>
            , while a plan runs 1 to 182 days in 1-day steps, so a 15-day plan exists and a 15-day
            block does not. A plan buys 1, 2, 4, 8, 16, 32 or 64 instances, needs a SageMaker service
            quota above that count, and serves only the target it was bought for: capacity bought for
            training jobs cannot move to a HyperPod cluster later{' '}
            <Cite tier={1} href={TRAINING_PLANS}>
              SageMaker training plans
            </Cite>
            .
          </Box>
          <Box variant="p">
            The limit that caps speed is the instance count. A Capacity Block holds up to 64 instances,
            and an AWS Organization can hold at most 256 instances in Capacity Blocks on any date{' '}
            <Cite tier={1} href={CB_GUIDE}>
              EC2 Capacity Blocks for ML, considerations
            </Cite>
            : 2,048 GPUs on an eight-GPU instance. Wall-clock time on blocks has a floor, the
            run&apos;s accelerator-hours over 2,048, which is {REF_DAYS} days for the reference run.
            The documentation read gives no self-serve path past 256 instances. Whether training plans
            count against the same 256 is not stated: the two limits are documented separately.
          </Box>
          <Box variant="p">
            A block cannot be cancelled, moved or split, so buy the window the run needs. Its instances
            are placed close together inside EC2 UltraClusters and a block takes no placement group, so
            a launch template written for a cluster placement group drops it; block instances also sit
            outside the On-Demand quota{' '}
            <Cite tier={1} href={CB_GUIDE}>
              EC2 Capacity Blocks for ML, considerations
            </Cite>
            . The other block rules are in the{' '}
            <Link href="../efa/">EFA dive, section 18: Pricing Analysis</Link>.
          </Box>
          <Box variant="p">
            Spot, EC2&apos;s spare capacity sold at a discount and reclaimed with a two-minute
            interruption notice{' '}
            <Cite tier={1} href={SPOT_NOTICE} accessed={REGISTER_DATE}>
              EC2 Spot Instance interruption notices
            </Cite>
            , exists for P4d, P4de, P5, P5e, P5en, P6-B200, P6-B300, Trn1, Trn1n and Trn2, and not for
            the P6e-GB200 and Trn2 UltraServer instances{' '}
            <Cite tier={1} href={EC2_TYPES}>
              EC2 instance family summary, Spot support
            </Cite>
            . One reclaimed node stops every rank of a synchronous job, so a Spot run counts each
            interruption as a failure in the arithmetic of section 17, Failure Is the Steady State, our
            reading.
          </Box>
          <ExpandableSection headerText="A0 protocol (not yet run)">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>What it would measure.</strong> Which Capacity Block offerings exist for
                p5e.48xlarge and trn2.48xlarge in us-east-1, with{' '}
                <code>describe-capacity-block-offerings</code>, and which Availability Zones offer each
                instance type on this page, with <code>describe-instance-type-offerings</code> (
                <Link external href={GUIDE_URL}>
                  research guide, section 5
                </Link>
                ). The documents disagree on the first. The Capacity Blocks Region table lists
                p5e.48xlarge in us-east-1{' '}
                <Cite tier={1} href={CB_GUIDE} accessed={REGISTER_DATE} kind="doc-code-conflict">
                  EC2 Capacity Blocks, supported instance types and Regions
                </Cite>
                , while the pricing page and the us-east-1 Price List carry no p5e rate there{' '}
                <Cite tier={1} href={CB_PRICING} accessed={REGISTER_DATE}>
                  EC2 Capacity Blocks pricing
                </Cite>{' '}
                <Cite tier={1} href={SOURCES.ec2PriceUse1.url} accessed={REGISTER_DATE}>
                  AWS Price List, AmazonEC2 us-east-1, version 20261029175634
                </Cite>
                . The Price List carries trn2.48xlarge block rows only for Ohio and Hyderabad{' '}
                <Cite tier={1} href={SOURCES.ec2PriceAllRegions.url}>
                  AWS Price List, AmazonEC2 all Regions, version 20261029175634
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>On what.</strong> Read-only EC2 API calls from an AWS account in us-east-1;
                nothing is launched.
              </Box>
              <Box variant="p">
                <strong>Prediction.</strong> The research guide states none, and this page makes none.
              </Box>
              <Box variant="p">
                <strong>Cost.</strong> $0. Teardown: none.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Schedule the last save before your instances go: 11:00 UTC on the final day for most blocks, 10:30 for GB200 UltraServer blocks and for training plans that serve a HyperPod cluster"
          >
            The window&apos;s edge: when the last checkpoint must finish
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Capacity Blocks and training plans both end at 11:30 UTC (Coordinated Universal Time) on
            their final day, and the instances go earlier. EC2 begins terminating a block&apos;s
            instances at 11:00 UTC, 30 minutes before the end, and P6e-GB200 UltraServer blocks must
            have their instances terminated at least 60 minutes before it{' '}
            <Cite tier={1} href={CB_GUIDE}>
              EC2 Capacity Blocks for ML, considerations
            </Cite>
            . A training plan starts terminating instances 30 minutes before the end when it serves
            training jobs, and one hour before when its target is a HyperPod cluster{' '}
            <Cite tier={1} href={TRAINING_PLANS}>
              SageMaker training plans, end time and termination
            </Cite>
            .
          </Box>
          <CapacityWindowDiagram />
          <Box variant="small">
            Illustrative, not measured: bar lengths and save times are schematic; the clock times are
            the documented edges.
          </Box>
          <Box variant="p">
            Each path hands the edge to the job differently, and on every path the training script owns
            the last checkpoint (section 20, Who Owns What on AWS). A SageMaker training job on a plan
            reads the environment variable{' '}
            <code>SAGEMAKER_CURRENT_CAPACITY_BLOCK_EXPIRATION_TIMESTAMP</code>, a time in milliseconds,
            to decide when to save{' '}
            <Cite tier={1} href={TP_JOBS}>
              Training plans utilization for SageMaker training jobs
            </Cite>
            . EKS node groups on a block scale to zero more than 30 minutes before the end{' '}
            <Cite tier={1} href={EKS_NODE_GROUPS} accessed={REGISTER_DATE}>
              Amazon EKS node groups, Capacity Blocks for ML
            </Cite>
            . On AWS PCS a block that expires terminates its node group&apos;s instances, running jobs
            may fail depending on Slurm settings, and queued jobs wait until another node group or block
            is attached; a node group takes one block at a time{' '}
            <Cite tier={1} href={PCS_CB} accessed={REGISTER_DATE}>
              AWS PCS with Capacity Blocks
            </Cite>
            , so back-to-back blocks need a node group per block in the same queue or a launch template
            that names the next block, our reading. Section 19, Resuming Correctly, shows how a Slurm
            job gets a signal before its time limit.
          </Box>
          <Box variant="p">
            So the last save starts one save time, plus a margin, before the edge that applies to your
            path, our reading; section 18, Checkpointing, gives the save time for your checkpoint and
            storage. A run longer than one window resumes on the next from that checkpoint.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read your instance's rate on all five paths, with its Region, before you multiply: Capacity Block rates sit at or below On-Demand, what a block buys is a fixed schedule, and SageMaker adds a flat 15% or 20%"
          >
            What an hour costs on each path
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Five rates cover the ways to buy training capacity: EC2 On-Demand, an EC2 Capacity Block, a
            SageMaker training job (a cluster per job, torn down when it ends), a SageMaker HyperPod
            node (a long-lived cluster per team) and a SageMaker training plan. The tables read the
            calculator&apos;s own price data, per instance-hour (per UltraServer-hour on the GB200
            rows), in US East (N. Virginia) unless a cell names another Region, all read on{' '}
            {PRICES_READ_ON}{' '}
            <Cite tier={1} href={SOURCES.ec2PriceUse1.url} accessed={REGISTER_DATE}>
              AWS Price List, AmazonEC2 us-east-1, version 20261029175634
            </Cite>{' '}
            <Cite tier={1} href={CB_PRICING} accessed={REGISTER_DATE}>
              EC2 Capacity Blocks pricing
            </Cite>{' '}
            <Cite tier={1} href={SOURCES.sagemakerUse1.url} accessed={REGISTER_DATE}>
              AWS Price List, AmazonSageMaker us-east-1, version 20261029165009
            </Cite>
            .
          </Box>
          <Ec2RatesTable />
          <SageMakerRatesTable />
          <Box variant="p">
            Every block rate in N. Virginia is at or below On-Demand, from 0.998 of it on p5en and
            p6-b200 to 0.443 on trn1, with p5.48xlarge at {rate(P5_CB)} against {rate(P5_OD)}, our
            arithmetic on the rates above. What a block buys is the schedule: a window that starts on a
            known date, paid up front, outside the reach of Savings Plans and Reserved Instance discounts{' '}
            <Cite tier={1} href={CB_BILLING} accessed={REGISTER_DATE}>
              Capacity Blocks pricing and billing
            </Cite>
            .
          </Box>
          <Box variant="p">
            Quote the offering, and use the table for orientation. The pricing page publishes one rate
            per type and Region, next updated in January 2027, and charges a block at the rate
            prevailing when it is bought{' '}
            <Cite tier={1} href={CB_PRICING} accessed={REGISTER_DATE}>
              EC2 Capacity Blocks pricing
            </Cite>
            ; the billing page says a block&apos;s price depends on supply and demand at the time of
            purchase{' '}
            <Cite tier={1} href={CB_BILLING} accessed={REGISTER_DATE}>
              Capacity Blocks pricing and billing
            </Cite>
            . The number that binds is the offering&apos;s <code>UpfrontFee</code>, the total paid up
            front, which <code>describe-capacity-block-offerings</code> returns{' '}
            <Cite tier={1} href={CB_CLI}>
              AWS CLI reference, describe-capacity-block-offerings
            </Cite>
            .
          </Box>
          <Box variant="p">
            The SageMaker paths add a flat multiplier in N. Virginia. A training job costs 1.15 times
            EC2 On-Demand on every type read; a HyperPod node 1.20 times on P5 and P6, 1.18 on P4d and
            P4de and 1.15 on Trn1 and Trn1n; a training plan 1.15 times the Capacity Block rate, paid up
            front, with the hours used inside the plan billed at $0.00{' '}
            <Cite tier={1} href={SOURCES.sagemakerUse1.url} accessed={REGISTER_DATE}>
              AWS Price List, AmazonSageMaker us-east-1, version 20261029165009
            </Cite>
            . A training plan is a Capacity Block bought through SageMaker at the training-job premium,
            our reading.
          </Box>
          <Box variant="p">
            Trainium2 needs both tables. trn2.48xlarge has no EC2 On-Demand rate in any US Region: in
            Ohio EC2 sells it only through Capacity Blocks, at {rate(trn2Cb)}, and the only EC2
            On-Demand rate in the Price List is Asia Pacific (Hyderabad) at $103.157{' '}
            <Cite tier={1} href={SOURCES.ec2PriceAllRegions.url}>
              AWS Price List, AmazonEC2 all Regions, version 20261029175634
            </Cite>
            . SageMaker sells ml.trn2.48xlarge on demand in Ohio, {rate(trn2Job)} for training jobs and
            $101.76 for HyperPod{' '}
            <Cite tier={1} href={SOURCES.sagemakerUse2.url} accessed={REGISTER_DATE}>
              AWS Price List, AmazonSageMaker us-east-2, version 20261029165009
            </Cite>
            , so the block is {trn2CbBelow}% below the training-job rate and a training plan, at{' '}
            {rate(trn2Plan)}, {trn2PlanBelow}% below it, our arithmetic.
          </Box>
          <Box variant="p">
            SageMaker managed Spot training publishes no Spot rate: the Price List lists Spot training at
            the On-Demand training rate, and the saving shows per job as 1 minus{' '}
            <code>BillableTimeInSeconds</code> over <code>TrainingTimeInSeconds</code>, a figure the
            documentation calls not comparable to EC2 Spot price history. AWS states savings of up to
            90%. A managed Spot job runs only on Spot capacity and waits for it rather than falling back
            to On-Demand{' '}
            <Cite tier={1} href={MANAGED_SPOT} kind="vendor-claim">
              SageMaker managed Spot training
            </Cite>
            . The cost panel takes the discount you enter.
          </Box>
          <Box variant="p">
            Orchestration around the instances adds fees, the cost row of section 20&apos;s ownership
            matrix. AWS PCS (AWS Parallel Computing Service, which runs the Slurm scheduler&apos;s
            controller for you) charges {rate(PCS_FEES.controllerUsdPerHour.small.value)},{' '}
            {rate(PCS_FEES.controllerUsdPerHour.medium.value)} or{' '}
            {rate(PCS_FEES.controllerUsdPerHour.large.value)} per controller-hour for a Small (up to 32
            instances), Medium (512) or Large (2,048) cluster, plus {rate(pcsAdvanced)} per P or Trn
            instance-hour of node management{' '}
            <SourceCite source={SOURCES.pcsPrice} /> <SourceCite source={SOURCES.pcsSizes} />. Amazon EKS
            (Elastic Kubernetes Service) charges {rate(EKS_FEES.clusterUsdPerHour.value)} per
            cluster-hour on standard support and {rate(EKS_FEES.extendedSupportExtraUsdPerHour.value)}{' '}
            more on extended support; EKS Auto Mode adds {rate(autoModeP5)} per p5.48xlarge-hour{' '}
            <SourceCite source={SOURCES.eksPrice} />, {autoModeShare}% of the On-Demand rate, our
            arithmetic, while the EKS guide names node groups as best for training workloads with
            predictable sizing{' '}
            <Cite tier={1} href={EKS_COMPUTE}>
              Amazon EKS, accelerated compute management
            </Cite>
            . HyperPod has no separate service fee in the pricing material read: a cluster bills its
            instances for as long as it exists, and its pricing excludes the Amazon EKS, Amazon FSx for
            Lustre and Amazon S3 (Simple Storage Service) charges of services attached to it{' '}
            <Cite tier={1} href={SAGEMAKER_PRICING} accessed={REGISTER_DATE}>
              SageMaker AI pricing, HyperPod
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See where the money goes on peak arithmetic and on one real model, then check the estimate against the hours Meta published"
          >
            Two worked bills
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Peak arithmetic per dollar.</strong> Dividing each rate by the billed unit&apos;s
            dense BF16 (bfloat16) peak gives the price of a peak PFLOP-hour, a quadrillion
            floating-point operations every second for an hour, our arithmetic on the rates above and
            the vendors&apos; peak specifications listed under the table.
          </Box>
          <SpaceBetween size="xxs">
            <PeakPriceTable />
            <Box variant="small" color="text-body-secondary">
              Peaks: <SourceCite source={SOURCES.trainium} />, <SourceCite source={SOURCES.trainium2} />,{' '}
              <SourceCite source={SOURCES.gb200} />, <SourceCite source={SOURCES.a100} />,{' '}
              <SourceCite source={SOURCES.h100} />, <SourceCite source={SOURCES.hgx} />. Rates: the two
              tables above.
            </Box>
          </SpaceBetween>
          <Box variant="p">
            Trainium and the GB200 UltraServer block are lowest on peak: Trn1 $3.14 in N. Virginia, Trn2
            $3.35 in Ohio and P6e-GB200 $4.23 in the Dallas Local Zone at NVIDIA&apos;s NVL72 per-GPU
            peak, against $6.03 for a p5.48xlarge block. Peak is what you rent, and achieved MFU decides
            what each useful FLOP costs. No first-party MFU for dense Llama-class training on H200 or
            Trainium2 was located in this research, so compare platforms after a measured step (section
            31, Bring-Up: From One Node to the Full Run).
          </Box>
          <Box variant="p">
            <strong>Llama 3.1 70B on 15T tokens.</strong> Section 4&apos;s identity,{' '}
            <code>time = 6ND / (accelerators x dense peak x MFU)</code>, gives {hours} H100-hours at 40%
            MFU, counting 6N on the full parameter count with no attention term and no overhead. On
            p5.48xlarge in N. Virginia that is {od} On-Demand or {cb} on Capacity Blocks, and a training
            plan&apos;s 15% premium on the block rate brings the reserved SageMaker path to {plan},
            about the On-Demand price with a start date attached. At the 2,048-GPU ceiling the run takes{' '}
            {REF_DAYS} days: four blocks of 64 instances, each {REF_BLOCK_DAYS} days long (13 seven-day
            steps), paid up front, {blockWindow} for the reserved windows, our arithmetic. Blocks of 64
            instances are not offered for every type in every Region{' '}
            <Cite tier={1} href={CB_GUIDE}>
              EC2 Capacity Blocks for ML
            </Cite>
            , so search for that size before planning around it.
          </Box>
          <Box variant="p">
            Meta&apos;s model card lists 7.0M H100-hours for Llama 3.1 70B, {metaRatio} times this
            estimate, and Meta does not split the GPU-hours by stage{' '}
            <Cite tier={1} href={LLAMA_CARD}>
              Llama 3.1 model card, Training Energy Use
            </Cite>
            , so the gap cannot be assigned to restarts, long-context training or post-training. Priced
            the same way, 7.0M H100-hours come to {metaOd} On-Demand and {metaDays} days at 2,048 GPUs,
            inside one 182-day reservation, our arithmetic. The one anchored check is Llama 3 405B,
            whose published hours are 1.1 to 1.3 times the 6ND estimate at the run&apos;s measured
            throughput (section 4), so read the estimate as a floor, our reading.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Price your own run on every path, with the fee of the orchestration around it, its Region and the reservation limit it hits"
          >
            Calculator A: the cost panel
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The panel prices accelerator-hours with the same functions as section 4&apos;s run-time
            half, so the two agree for the same inputs. From a run, it counts 6N on the full parameter
            count with no attention term, section 4&apos;s default; for another FLOP count, compute the
            hours there and enter them here. A Capacity Block or a training plan is charged at the price
            its offering quotes at purchase. The default reproduces the worked bill: {od} On-Demand and{' '}
            {cb} on Capacity Blocks over {REF_DAYS} days.
          </Box>
          <CostPanel />
          <Box variant="p">
            Take the first step before choosing a layout, because capacity sets the start date. For
            On-Demand, request the Running On-Demand P or Trn instances quota in the Service Quotas
            console for your Region, 192 vCPUs per p5.48xlarge{' '}
            <Cite tier={1} href={OD_QUOTAS}>
              EC2 On-Demand Instance quotas
            </Cite>
            . For a reserved start, search offerings for the instance count and window the panel gives,
            for example 64 p5.48xlarge for {REF_BLOCK_DAYS} days ({REF_BLOCK_DAYS * 24} hours):
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
            {`aws ec2 \\
  describe-capacity-block-offerings \\
  --instance-type p5.48xlarge \\
  --instance-count 64 \\
  --capacity-duration-hours ${REF_BLOCK_DAYS * 24} \\
  --start-date-range 2026-12-01T00:00:00Z`}
          </pre>
          <Box variant="p">
            Each offering returned carries its start date, its Availability Zone and its{' '}
            <code>UpfrontFee</code>, the price you will pay{' '}
            <Cite tier={1} href={CB_CLI}>
              AWS CLI reference, describe-capacity-block-offerings
            </Cite>
            . Put that fee into the budget in place of the table rate, and schedule the run&apos;s last
            checkpoint before the window&apos;s edge.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
