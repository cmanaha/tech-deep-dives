import { useRef } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import {
  Cite,
  arxiv,
  gh,
  AWSOME_DISTRIBUTED_TRAINING_SHA,
  DCGM_EXPORTER_TAG,
  DCGM_TAG,
  E3_URL,
  GUIDE_URL,
  HTA_TAG,
  NEURON_SDK_SHA,
  PYTORCH_TAG,
  TORCHTITAN_TAG,
} from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import { DENSE_MODELS, E3_FSDP2_PER_UNIT, EKS_FEES, INSTANCES, PRICES } from '../lib/presets';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Register date for rows cited without re-opening their source. */
const R1 = '2026-10-30';

const pt = (path: string, lines?: string) => gh('pytorch/pytorch', PYTORCH_TAG, path, lines);
const PG_HPP = 'torch/csrc/distributed/c10d/ProcessGroupNCCL.hpp';
const PG_CPP = 'torch/csrc/distributed/c10d/ProcessGroupNCCL.cpp';
const FR_HPP = 'torch/csrc/distributed/c10d/FlightRecorder.hpp';
const FR_CPP = 'torch/csrc/distributed/c10d/FlightRecorder.cpp';
const C10D_PY = 'torch/distributed/distributed_c10d.py';
const FR_UTILS = 'torch/distributed/flight_recorder/components/utils.py';
const ENV_DOC = 'docs/source/torch_nccl_environment_variables.md';

/** The PyTorch tutorial whose stated defaults disagree with the v2.15.0 code. */
const FR_TUTORIAL = 'https://docs.pytorch.org/tutorials/unstable/flight_recorder_tutorial.html';
/** TorchTitan v0.4.0 debugging guide: flight-recorder dumps land in its dump_folder. */
const TT_DEBUG = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'docs/debugging.md', 'L156-L159');

const LLAMA3 = arxiv('2407.21783v3');
const MEGASCALE = arxiv('2402.15627v1');

const NCCL_RAS = 'https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/troubleshooting/ras.html';
const NCCL_ENV = 'https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/env.html';
const NSYS = 'https://docs.nvidia.com/nsight-systems/UserGuide/index.html';

const exporter = (file: string, lines: string) => gh('NVIDIA/dcgm-exporter', DCGM_EXPORTER_TAG, `etc/${file}`, lines);
const DCGM_FIELDS = (lines: string) => gh('NVIDIA/DCGM', DCGM_TAG, 'dcgmlib/dcgm_fields.h', lines);
const hta = (lines: string) => gh('facebookresearch/HolisticTraceAnalysis', HTA_TAG, 'hta/trace_analysis.py', lines);
const neuron = (path: string, lines: string) => gh('aws-neuron/aws-neuron-sdk', NEURON_SDK_SHA, path, lines);
const NRT_ENV = 'neuron-runtime/api/nrt-env-var-reference.rst';
const NRT_TROUBLE = 'neuron-runtime/nrt-troubleshoot.rst';

/** HyperPod base lifecycle scripts, in the AWS repository the HyperPod Slurm docs point to. */
const LIFECYCLE = '1.architectures/5.sagemaker-hyperpod/LifecycleScripts/base-config';
const lifecycle = (path: string, lines?: string) =>
  gh('awslabs/awsome-distributed-ai', AWSOME_DISTRIBUTED_TRAINING_SHA, `${LIFECYCLE}/${path}`, lines);

const CW_UG = 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/';
const CI_EKS = `${CW_UG}Container-Insights-metrics-enhanced-EKS.html`;
const EKS_OBS = 'https://docs.aws.amazon.com/eks/latest/best-practices/aiml-observability.html';
const SM_DG = 'https://docs.aws.amazon.com/sagemaker/latest/dg/';
const HP_ADDON = `${SM_DG}sagemaker-hyperpod-observability-addon.html`;
const HP_METRICS = `${SM_DG}hyperpod-observability-cluster-metrics.html`;
const HP_ALERTS = `${SM_DG}hyperpod-observability-addon-alerts.html`;
const HP_SLURM_EXPORTERS = `${SM_DG}sagemaker-hyperpod-cluster-observability-slurm-install-exporters.html`;
const HP_OPERATOR = `${SM_DG}sagemaker-eks-operator.html`;
const HP_OPERATOR_USAGE = `${SM_DG}sagemaker-eks-operator-usage.html`;
const SM_CW = `${SM_DG}monitoring-cloudwatch.html`;
const SM_DEFINE = `${SM_DG}define-train-metrics.html`;
const SM_DEBUGGER = `${SM_DG}debugger-availability-change.html`;
const SM_PROFILER = `${SM_DG}profiler-availability-change.html`;

const EFA_OPS_LINK = <Link href="../efa/">EFA dive, section 17: Operations, Observability and Failure Modes</Link>;
const SILICON_TOOLS_LINK = (
  <Link href="../silicon-memory-inference/">Silicon dive, section 20: AWS Compilers and Kernel Tooling</Link>
);

/* ------------------------------------------------------------------------ */
/* Numbers                                                                  */
/* ------------------------------------------------------------------------ */

/** PyTorch v2.15.0 defaults, read from code (ProcessGroupNCCL.hpp L164-L165, .cpp L1772-L1775, L2427-L2428). */
const TIMEOUT_S = 10 * 60;
const DUMP_WAIT_S = 15;
const DUMP_WAIT_FACTOR = 4;
const HEARTBEAT_S = 8 * 60;
const FR_ENTRIES = 2_000;

/** Our arithmetic: the collective-timeout path, stuck collective to teardown. */
const DUMP_WINDOW_S = DUMP_WAIT_FACTOR * DUMP_WAIT_S;
const TEARDOWN_S = TIMEOUT_S + DUMP_WINDOW_S;
const TEARDOWN_MIN = TEARDOWN_S / 60;

/** Our arithmetic: the stuck-watchdog path. Detection waits for checks 8 minutes apart; two dump tries of 15 s, then up to 8 minutes more. */
const HB_DETECT_EARLY_MIN = HEARTBEAT_S / 60;
const HB_DETECT_LATE_MIN = (2 * HEARTBEAT_S) / 60;
const HB_KILL_EARLY_MIN = HB_DETECT_EARLY_MIN + HEARTBEAT_S / 60;
const HB_KILL_LATE_MIN = HB_DETECT_LATE_MIN + (2 * DUMP_WAIT_S) / 60 + HEARTBEAT_S / 60;

/** Llama 3 405B, Sec 3.3.4: 419 unexpected interruptions in a 54-day snapshot (same counts as section 17). */
const LLAMA3_DAYS = 54;
const LLAMA3_UNEXPECTED = 419;
const LLAMA3_INTERVAL_MIN = (LLAMA3_DAYS * 24 * 60) / LLAMA3_UNEXPECTED;
const LLAMA3_INTERVAL_H = LLAMA3_INTERVAL_MIN / 60;
const HANG_SHARE = TEARDOWN_MIN / LLAMA3_INTERVAL_MIN;

/**
 * Flight-recorder coverage from E3's per-unit counts (our arithmetic): at FSDP2 defaults each wrapped layer is
 * all-gathered twice and reduce-scattered once per micro-batch, and the root unit, which FSDP2 does not reshard
 * after the forward pass, is all-gathered once and reduce-scattered once. Section 8's examples use 8 micro-batches.
 */
const MICRO_BATCHES = 8;
function fsdpCollectivesPerStep(layers: number, k: number) {
  const allGathers = (E3_FSDP2_PER_UNIT.allGathersPerMicroBatch.value * layers + 1) * k;
  const reduceScatters = E3_FSDP2_PER_UNIT.reduceScattersPerMicroBatch.value * (layers + 1) * k;
  return { allGathers, reduceScatters, total: allGathers + reduceScatters };
}
const L8 = DENSE_MODELS['llama-3.1-8b'].layers.value;
const L70 = DENSE_MODELS['llama-3.1-70b'].layers.value;
const C8 = fsdpCollectivesPerStep(L8, MICRO_BATCHES);
const C70 = fsdpCollectivesPerStep(L70, MICRO_BATCHES);
const STEPS8 = FR_ENTRIES / C8.total;
const STEPS70 = FR_ENTRIES / C70.total;

/** Neuron runtime execution timeout default (nrt-env-var-reference.rst L83-L86). */
const NEURON_EXEC_TIMEOUT_S = 30;
const NEURON_RATIO = TIMEOUT_S / NEURON_EXEC_TIMEOUT_S;

/** SageMaker training-job GPU metrics: summed over GPUs, averaged over instances in the default view (07 W3). */
const P5_GPUS = INSTANCES['p5.48xlarge'].acceleratorsPerInstance.value;
const JOB_HOSTS = 64;

/** A4's cost: five hours of one ml.p5.48xlarge HyperPod node (RESEARCH-GUIDE section 5), as section 25 prints it. */
function hyperpodP5() {
  const row = PRICES.find((p) => p.instance === 'p5.48xlarge' && p.path === 'hyperpod' && p.region === 'US East (N. Virginia)');
  if (!row) throw new RangeError('Telemetry: no us-east-1 p5.48xlarge HyperPod price row');
  return row.usdPerUnitHour;
}
const HP_P5 = hyperpodP5();
const A4_HOURS = 5;
const A4_COST = HP_P5.value * A4_HOURS;
const EKS_CLUSTER = EKS_FEES.clusterUsdPerHour.value;

const num = (v: number) => Math.round(v).toLocaleString('en-US');
const min1 = (v: number) => (Number.isInteger(v) ? `${v}` : v.toFixed(1));
const pct0 = (v: number) => `${Math.round(100 * v)}%`;
/** Round down to the half step, so 2.55 reads "about 2.5" and 1.03 "about one". */
const halfSteps = (v: number) => {
  const h = Math.floor(v * 2) / 2;
  return h === 1 ? 'one' : `${h}`;
};
const usd = (v: number) => `$${Math.round(v).toLocaleString('en-US')}`;
const usd2 = (v: number) => `$${v.toFixed(2)}`;

/* ------------------------------------------------------------------------ */
/* Diagram 1: how a hang becomes a crash                                    */
/* ------------------------------------------------------------------------ */

const FONT = 'sans-serif';
const INK = '#16191f';
const MUTED = '#414d5c';
const BLUE = { fill: '#d6e9fb', stroke: '#0972d3' };
const AMBER = { fill: '#fbf3d5', stroke: '#8b6c00' };
const GREY = { fill: '#f2f3f3', stroke: '#879596' };
const RED = { fill: '#fde8e8', stroke: '#d13212' };

const HANG_TITLE =
  `How a hang becomes a crash at PyTorch v2.15.0 defaults, in minutes after the stall begins. When a rank never ` +
  `joins a collective, the others wait ${TIMEOUT_S / 60} minutes, every rank then has ${DUMP_WINDOW_S} seconds to ` +
  `dump its flight recorder, and the process is torn down about ${min1(TEARDOWN_MIN)} minutes after the stall. When ` +
  `the watchdog thread itself hangs, the heartbeat monitor declares it stuck ${HB_DETECT_EARLY_MIN} to ` +
  `${HB_DETECT_LATE_MIN} minutes after the stall, dumps, waits up to ${HEARTBEAT_S / 60} more minutes and kills the ` +
  `process about ${HB_KILL_EARLY_MIN} to ${min1(HB_KILL_LATE_MIN)} minutes after the stall.`;

const AXIS_MAX_MIN = 25;
const AXIS_TICKS = [0, 5, 10, 15, 20, 25];

interface Seg {
  from: number;
  to: number;
  style: { fill: string; stroke: string };
  dashed?: boolean;
  label?: string;
}

function Bar({ x0, scale, y, h, segs }: { x0: number; scale: number; y: number; h: number; segs: Seg[] }) {
  return (
    <g>
      {segs.map((s) => {
        const x = x0 + s.from * scale;
        const w = (s.to - s.from) * scale;
        return (
          <g key={`${s.from}-${s.to}`}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx={3}
              fill={s.style.fill}
              stroke={s.style.stroke}
              strokeWidth={1.2}
              strokeDasharray={s.dashed ? '5 3' : undefined}
            />
            {s.label && (
              <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontFamily={FONT} fontSize={11} fill={INK}>
                {s.label}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

function Axis({ x0, scale, y, narrow }: { x0: number; scale: number; y: number; narrow: boolean }) {
  return (
    <g>
      <line x1={x0} y1={y} x2={x0 + AXIS_MAX_MIN * scale} y2={y} stroke="#5f6b7a" strokeWidth={1} />
      {AXIS_TICKS.map((t, i) => {
        const x = x0 + t * scale;
        const last = i === AXIS_TICKS.length - 1;
        const first = i === 0;
        return (
          <g key={t}>
            <line x1={x} y1={y} x2={x} y2={y + 5} stroke="#5f6b7a" strokeWidth={1} />
            <text
              x={x}
              y={y + 18}
              textAnchor={last ? 'end' : first && narrow ? 'start' : 'middle'}
              fontFamily={FONT}
              fontSize={11}
              fill={MUTED}
            >
              {last ? `${t} min` : `${t}`}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function HangWide() {
  const W = 900;
  const H = 256;
  const x0 = 214;
  const scale = (880 - x0) / AXIS_MAX_MIN;
  const aY = 80;
  const bY = 150;
  const barH = 26;
  const tear = x0 + TEARDOWN_MIN * scale;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby="telemetry-hang-title"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <title id="telemetry-hang-title">{HANG_TITLE}</title>
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
      <text x={16} y={24} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
        Two ways a hang becomes a crash at PyTorch v2.15.0 defaults
      </text>
      <text x={16} y={42} fontFamily={FONT} fontSize={11} fill={MUTED}>
        Minutes after the stall begins, drawn to scale from the defaults in the code
      </text>

      <text x={16} y={aY + 11} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
        A rank never arrives
      </text>
      <text x={16} y={aY + 27} fontFamily={FONT} fontSize={11} fill={MUTED}>
        the collective timeout fires
      </text>
      <Bar
        x0={x0}
        scale={scale}
        y={aY}
        h={barH}
        segs={[
          { from: 0, to: TIMEOUT_S / 60, style: BLUE, label: `Waiting in the collective: ${TIMEOUT_S / 60} min` },
          { from: TIMEOUT_S / 60, to: TEARDOWN_MIN, style: AMBER },
        ]}
      />
      <line x1={tear} y1={aY - 6} x2={tear} y2={aY + barH + 6} stroke={RED.stroke} strokeWidth={2} />
      <text x={tear + 10} y={aY + 10} fontFamily={FONT} fontSize={11} fill={INK}>
        {`Every rank dumps its trace (${DUMP_WINDOW_S} s),`}
      </text>
      <text x={tear + 10} y={aY + 25} fontFamily={FONT} fontSize={11} fontWeight={600} fill={INK}>
        {`then teardown at ${min1(TEARDOWN_MIN)} min`}
      </text>

      <text x={16} y={bY + 11} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
        The watchdog hangs
      </text>
      <text x={16} y={bY + 27} fontFamily={FONT} fontSize={11} fill={MUTED}>
        the heartbeat monitor fires
      </text>
      <Bar
        x0={x0}
        scale={scale}
        y={bY}
        h={barH}
        segs={[
          { from: 0, to: HB_DETECT_EARLY_MIN, style: GREY, label: `Too soon to detect: ${HB_DETECT_EARLY_MIN} min` },
          {
            from: HB_DETECT_EARLY_MIN,
            to: HB_DETECT_LATE_MIN,
            style: AMBER,
            dashed: true,
            label: `Declared stuck: ${HB_DETECT_EARLY_MIN} to ${HB_DETECT_LATE_MIN} min`,
          },
          {
            from: HB_KILL_EARLY_MIN,
            to: HB_KILL_LATE_MIN,
            style: RED,
            dashed: true,
            label: `Killed: ${HB_KILL_EARLY_MIN} to ${min1(HB_KILL_LATE_MIN)} min`,
          },
        ]}
      />
      <text x={x0} y={bY + barH + 20} fontFamily={FONT} fontSize={11} fill={MUTED}>
        {`Checks run ${HEARTBEAT_S / 60} minutes apart, so detection lands in a window; then a dump and a wait of up to ${HEARTBEAT_S / 60} more minutes`}
      </text>

      <Axis x0={x0} scale={scale} y={222} narrow={false} />
    </svg>
  );
}

function HangNarrow() {
  const W = 400;
  const H = 262;
  const x0 = 16;
  const scale = (384 - x0) / AXIS_MAX_MIN;
  const aY = 74;
  const bY = 150;
  const barH = 24;
  const tear = x0 + TEARDOWN_MIN * scale;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby="telemetry-hang-narrow-title"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <title id="telemetry-hang-narrow-title">{HANG_TITLE}</title>
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
      <text x={12} y={22} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
        How a hang becomes a crash
      </text>
      <text x={12} y={39} fontFamily={FONT} fontSize={11} fill={MUTED}>
        PyTorch v2.15.0 defaults, minutes after the stall, to scale
      </text>

      <text x={x0} y={aY - 8} fontFamily={FONT} fontSize={12} fontWeight={600} fill={INK}>
        A rank never arrives: collective timeout
      </text>
      <Bar
        x0={x0}
        scale={scale}
        y={aY}
        h={barH}
        segs={[
          { from: 0, to: TIMEOUT_S / 60, style: BLUE, label: `Waiting: ${TIMEOUT_S / 60} min` },
          { from: TIMEOUT_S / 60, to: TEARDOWN_MIN, style: AMBER },
        ]}
      />
      <line x1={tear} y1={aY - 4} x2={tear} y2={aY + barH + 4} stroke={RED.stroke} strokeWidth={2} />
      <text x={x0} y={aY + barH + 18} fontFamily={FONT} fontSize={11} fill={INK}>
        {`Every rank dumps (${DUMP_WINDOW_S} s); teardown at ${min1(TEARDOWN_MIN)} min`}
      </text>

      <text x={x0} y={bY - 8} fontFamily={FONT} fontSize={12} fontWeight={600} fill={INK}>
        The watchdog hangs: heartbeat monitor
      </text>
      <Bar
        x0={x0}
        scale={scale}
        y={bY}
        h={barH}
        segs={[
          { from: 0, to: HB_DETECT_EARLY_MIN, style: GREY, label: 'Too soon' },
          { from: HB_DETECT_EARLY_MIN, to: HB_DETECT_LATE_MIN, style: AMBER, dashed: true, label: 'Declared' },
          { from: HB_KILL_EARLY_MIN, to: HB_KILL_LATE_MIN, style: RED, dashed: true, label: 'Killed' },
        ]}
      />
      <text x={x0} y={bY + barH + 18} fontFamily={FONT} fontSize={11} fill={INK}>
        {`Declared stuck ${HB_DETECT_EARLY_MIN} to ${HB_DETECT_LATE_MIN} min after the stall;`}
      </text>
      <text x={x0} y={bY + barH + 33} fontFamily={FONT} fontSize={11} fill={INK}>
        {`killed about ${HB_KILL_EARLY_MIN} to ${min1(HB_KILL_LATE_MIN)} min after it`}
      </text>

      <Axis x0={x0} scale={scale} y={234} narrow />
    </svg>
  );
}

function HangTimelineDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, 700);
  return (
    <SpaceBetween size="xs">
      <div ref={ref}>{narrow ? <HangNarrow /> : <HangWide />}</div>
      <Box variant="small" color="text-body-secondary">
        Derived from the PyTorch v2.15.0 defaults cited below, not measured. The heartbeat windows are ranges because
        the monitor compares the watchdog&apos;s counter at checks {HEARTBEAT_S / 60} minutes apart, so when it notices
        depends on when the stall began between two checks.
      </Box>
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 2: the telemetry stack per path                                  */
/* ------------------------------------------------------------------------ */

const MAP_COLUMNS = ['Collected', 'Shipped by', 'Stored in', 'Read in', 'Off by default'];

interface MapRow {
  title: string;
  sub: string;
  /** Four on-path cells and one default-off cell, each at most three lines of at most 20 characters. */
  cells: [string[], string[], string[], string[], string[]];
  /** Narrow layout: a title line, four stage lines of at most 56 characters, and the default-off line or lines. */
  narrowTitle: string;
  narrowLines: [string, string, string, string];
  narrowOff: string[];
}

const MAP_ROWS: MapRow[] = [
  {
    title: 'Training process',
    sub: 'on every path',
    cells: [
      ['10-minute timeout,', 'flight recorder:', 'last 2,000 entries'],
      ['Dump on timeout,', 'one file per rank'],
      ['~/.cache/torch on', 'each node'],
      ['torchfrtrace after;', 'NCCL RAS while hung'],
      ['Dump directory on', 'shared storage'],
    ],
    narrowTitle: 'Training process, on every path',
    narrowLines: [
      'Collected: 10-minute timeout, flight recorder (2,000)',
      'Shipped: dump on timeout, one file per rank',
      'Stored: ~/.cache/torch on each node',
      'Read: torchfrtrace after; NCCL RAS while hung',
    ],
    narrowOff: ['Off: a dump directory on shared storage'],
  },
  {
    title: 'Self-managed EKS',
    sub: 'Container Insights',
    cells: [
      ['NVIDIA, EFA and', 'Neuron metrics'],
      ['CloudWatch agent,', 'Observability EKS', 'add-on'],
      ['CloudWatch, every', '60 s by default'],
      ['CloudWatch', 'dashboards, alarms'],
      ['The add-on and its', 'device plugins'],
    ],
    narrowTitle: 'Self-managed EKS, Container Insights',
    narrowLines: [
      'Collected: NVIDIA, EFA and Neuron metrics',
      'Shipped: CloudWatch agent, Observability EKS add-on',
      'Stored: CloudWatch, every 60 s by default',
      'Read: CloudWatch dashboards and alarms',
    ],
    narrowOff: ['Off: the add-on and its device plugins'],
  },
  {
    title: 'HyperPod EKS',
    sub: 'observability add-on',
    cells: [
      ['DCGM Limited set,', 'pods, nodes, FSx'],
      ['HyperPod', 'observability', 'add-on'],
      ['Amazon Managed', 'Service for', 'Prometheus'],
      ['Amazon Managed', 'Grafana, preset', 'alerts'],
      ['Advanced DCGM, EFA,', 'Neuron, training-', 'operator metrics'],
    ],
    narrowTitle: 'HyperPod EKS, observability add-on',
    narrowLines: [
      'Collected: DCGM Limited set, pods, nodes, FSx',
      'Shipped: HyperPod observability add-on',
      'Stored: Amazon Managed Service for Prometheus',
      'Read: Amazon Managed Grafana, preset alerts',
    ],
    narrowOff: ['Off: advanced DCGM, EFA, Neuron and', 'training-operator metrics'],
  },
  {
    title: 'HyperPod Slurm',
    sub: 'lifecycle scripts',
    cells: [
      ['DCGM basic set,', 'EFA node, Slurm', 'exporters'],
      ['Prometheus on the', 'head node'],
      ['Amazon Managed', 'Service for', 'Prometheus'],
      ['Amazon Managed', 'Grafana'],
      ['enable_observability', 'and advanced_metrics'],
    ],
    narrowTitle: 'HyperPod Slurm, lifecycle scripts',
    narrowLines: [
      'Collected: DCGM basic set, EFA node, Slurm exporters',
      'Shipped: Prometheus on the head node',
      'Stored: Amazon Managed Service for Prometheus',
      'Read: Amazon Managed Grafana',
    ],
    narrowOff: ['Off: enable_observability and advanced_metrics'],
  },
  {
    title: 'SageMaker',
    sub: 'training jobs',
    cells: [
      ['CPU, memory, disk,', 'GPU per instance'],
      ['SageMaker, every', 'minute'],
      ['CloudWatch,', 'TrainingJobs', 'namespace'],
      ['CloudWatch; MLflow,', 'TensorBoard'],
      ['Loss and tokens/s:', 'regex metric', 'definitions'],
    ],
    narrowTitle: 'SageMaker training jobs',
    narrowLines: [
      'Collected: CPU, memory, disk and GPU per instance',
      'Shipped: SageMaker, every minute',
      'Stored: CloudWatch, TrainingJobs namespace',
      'Read: CloudWatch; MLflow or TensorBoard',
    ],
    narrowOff: ['Off: loss and tokens/s, via regex metric definitions'],
  },
];

const MAP_TITLE =
  'Where each signal goes on each AWS path, and what stays off until you turn it on. In every training process, ' +
  'the 10-minute collective timeout and the flight recorder of the last 2,000 collectives are on and dump one ' +
  'file per rank to the node, so the dump directory on shared storage is the thing to set. On self-managed EKS the ' +
  'CloudWatch agent from the Observability EKS add-on ships NVIDIA, EFA and Neuron metrics to CloudWatch once you ' +
  'install it with its device plugins. On HyperPod EKS the observability add-on ships a limited DCGM set and ' +
  'cluster metrics to Amazon Managed Service for Prometheus and Amazon Managed Grafana, with advanced DCGM, EFA, ' +
  'Neuron and training-operator metrics off. On HyperPod Slurm the lifecycle scripts install the exporters only ' +
  'when enable_observability is set, and the full DCGM set only with advanced_metrics. SageMaker training jobs ' +
  'send per-instance system metrics to CloudWatch every minute, and loss or throughput only through regex metric ' +
  'definitions you supply.';

function MapLegend({ x, y, stacked }: { x: number; y: number; stacked: boolean }) {
  const items = [
    { s: BLUE, dashed: false, text: "On by default once the path's agent runs" },
    { s: AMBER, dashed: true, text: 'Off by default: switch it on' },
  ];
  return (
    <g>
      {items.map((item, i) => {
        const lx = stacked ? x : x + i * 300;
        const ly = stacked ? y + i * 18 : y;
        return (
          <g key={item.text}>
            <rect
              x={lx}
              y={ly}
              width={14}
              height={12}
              rx={3}
              fill={item.s.fill}
              stroke={item.s.stroke}
              strokeWidth={1.2}
              strokeDasharray={item.dashed ? '4 2' : undefined}
            />
            <text x={lx + 20} y={ly + 10} fontFamily={FONT} fontSize={11} fill={INK}>
              {item.text}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function MapCell({ x, y, w, h, lines, off }: { x: number; y: number; w: number; h: number; lines: string[]; off: boolean }) {
  const s = off ? AMBER : BLUE;
  const gap = 14;
  const first = y + h / 2 - (gap * (lines.length - 1)) / 2 + 4;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={5}
        fill={off ? s.fill : '#f2f8fd'}
        stroke={s.stroke}
        strokeWidth={1.2}
        strokeDasharray={off ? '5 3' : undefined}
      />
      {lines.map((line, i) => (
        <text key={line} x={x + w / 2} y={first + i * gap} textAnchor="middle" fontFamily={FONT} fontSize={11} fill={INK}>
          {line}
        </text>
      ))}
    </g>
  );
}

function MapWide() {
  const W = 900;
  const colX0 = 148;
  const colW = 142;
  const colGap = 8;
  const cellH = 52;
  const rowH = 64;
  const top = 112;
  const H = top + MAP_ROWS.length * rowH + 6;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby="telemetry-map-title"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <title id="telemetry-map-title">{MAP_TITLE}</title>
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
      <text x={14} y={24} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
        Where each signal goes on each AWS path, and what stays off until you turn it on
      </text>
      <text x={14} y={42} fontFamily={FONT} fontSize={11} fill={MUTED}>
        Each row runs from the node to the screen; the last column is the switch to turn on
      </text>
      <MapLegend x={14} y={54} stacked={false} />
      {MAP_COLUMNS.map((c, i) => (
        <text
          key={c}
          x={colX0 + i * (colW + colGap) + colW / 2}
          y={top - 10}
          textAnchor="middle"
          fontFamily={FONT}
          fontSize={11}
          fontWeight={600}
          fill={MUTED}
        >
          {c}
        </text>
      ))}
      {MAP_ROWS.map((row, r) => {
        const y = top + r * rowH;
        return (
          <g key={row.title}>
            <rect x={8} y={y} width={W - 16} height={rowH - 6} rx={6} fill="#f8f9fa" stroke="#d1d5db" />
            <text x={18} y={y + 25} fontFamily={FONT} fontSize={12} fontWeight={600} fill={INK}>
              {row.title}
            </text>
            <text x={18} y={y + 41} fontFamily={FONT} fontSize={11} fill={MUTED}>
              {row.sub}
            </text>
            {row.cells.map((lines, c) => (
              <MapCell
                key={MAP_COLUMNS[c]}
                x={colX0 + c * (colW + colGap)}
                y={y + 3}
                w={colW}
                h={cellH}
                lines={lines}
                off={c === 4}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function MapNarrow() {
  const W = 400;
  const top = 92;
  const cardX = 8;
  const cardW = W - 16;
  const inX = 18;
  const lineGap = 15;
  const cardGap = 8;
  const cards = MAP_ROWS.map((row) => {
    const offH = 10 + 15 * row.narrowOff.length;
    return { row, offH, h: 24 + 4 * lineGap + 8 + offH + 10 };
  });
  let y = top;
  const placed = cards.map((c) => {
    const at = y;
    y += c.h + cardGap;
    return { ...c, y: at };
  });
  const H = y + 2;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby="telemetry-map-narrow-title"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <title id="telemetry-map-narrow-title">{MAP_TITLE}</title>
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
      <text x={12} y={22} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
        Each signal&apos;s path on AWS
      </text>
      <text x={12} y={39} fontFamily={FONT} fontSize={11} fill={MUTED}>
        From the node to the screen, and what is off
      </text>
      <MapLegend x={12} y={52} stacked />
      {placed.map(({ row, y: cy, h, offH }) => (
        <g key={row.title}>
          <rect x={cardX} y={cy} width={cardW} height={h} rx={6} fill="#f2f8fd" stroke={BLUE.stroke} strokeWidth={1} />
          <text x={inX} y={cy + 18} fontFamily={FONT} fontSize={12} fontWeight={600} fill={INK}>
            {row.narrowTitle}
          </text>
          {row.narrowLines.map((line, i) => (
            <text key={line} x={inX} y={cy + 36 + i * lineGap} fontFamily={FONT} fontSize={11} fill={INK}>
              {line}
            </text>
          ))}
          <rect
            x={inX - 6}
            y={cy + 24 + 4 * lineGap + 8}
            width={cardW - 2 * (inX - cardX - 6)}
            height={offH}
            rx={5}
            fill={AMBER.fill}
            stroke={AMBER.stroke}
            strokeWidth={1.2}
            strokeDasharray="5 3"
          />
          {row.narrowOff.map((line, i) => (
            <text
              key={line}
              x={inX}
              y={cy + 24 + 4 * lineGap + 8 + 17 + i * 15}
              fontFamily={FONT}
              fontSize={11}
              fill={INK}
            >
              {line}
            </text>
          ))}
        </g>
      ))}
    </svg>
  );
}

function TelemetryMapDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, 700);
  return (
    <SpaceBetween size="xs">
      <div ref={ref}>{narrow ? <MapNarrow /> : <MapWide />}</div>
      <Box variant="small" color="text-body-secondary">
        Illustrative, not measured. Blue cells run by default once the path&apos;s agent or add-on is in place; amber
        cells stay off until you set them. Each cell is cited in the text below.
      </Box>
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

const wrapCode = { overflowWrap: 'anywhere' as const };

export function Telemetry() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={`Turn on the signals that are off by default, on whichever path you run, and know that a hung collective becomes a crash with a trace from every rank about ${min1(TEARDOWN_MIN)} minutes after it stalls (PyTorch v2.15.0, dcgm-exporter 4.8.4, Holistic Trace Analysis v0.6.1, Neuron SDK 2.33 and AWS documentation, read 2026-10-31, and our DGX Spark run)`}
          >
            30. The Telemetry Stack on AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The telemetry stack is the set of exporters, stores and dashboards that carries a run&apos;s signals off the
            nodes: an exporter reads counters on each node, a store keeps the time series, and a dashboard or alert reads
            them back. Section 29, What to Measure in a Run, says which signals matter. This section says how each is
            collected on AWS, and which are off until you turn them on, because on every path several are.
          </Box>
          <Box variant="p">
            One failure never reaches a dashboard: a hang, where the job stops making progress without an error. The
            training process itself catches it, so it comes first.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Know what happens when one rank stops: at defaults the job crashes about ${min1(TEARDOWN_MIN)} minutes after a collective stalls, with every rank's last ${num(FR_ENTRIES)} collectives written to disk, and that trace names the rank that never arrived`}
          >
            Hangs: the timeout that turns a stuck job into evidence
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A synchronous training step ends in collectives, operations such as all-reduce in which every rank (one
            training process per accelerator) exchanges data and none leaves until all have joined. A rank that dies or
            deadlocks stops the whole job while the others wait, and failures of a remote GPU or of NVLink often show up
            as operations stalled inside kernels with no clear error code{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint" accessed={R1}>
              Llama 3 Herd of Models, Section 3.3.4
            </Cite>
            . The answer is a timeout, and PyTorch sets one by default.
          </Box>
          <Box variant="p">
            At PyTorch v2.15.0 a collective on the NCCL (NVIDIA Collective Communications Library) process group, the
            communicator a set of ranks shares, times out after {TIMEOUT_S / 60} minutes; other backends wait 30{' '}
            <Cite tier={1} href={pt(PG_HPP, 'L164-L165')} kind="code">
              PyTorch ProcessGroupNCCL.hpp L164-L165
            </Cite>
            . The clock starts when the rank issues the collective{' '}
            <Cite tier={1} href={pt(PG_CPP, 'L561')} kind="code">
              ProcessGroupNCCL.cpp L561
            </Cite>
            . On timeout the watchdog thread, which polls every collective in flight, signals every rank through the
            job&apos;s key-value store to dump its flight-recorder trace and waits {DUMP_WAIT_FACTOR} x {DUMP_WAIT_S} s
            for the dumps{' '}
            <Cite tier={1} href={pt(PG_CPP, 'L2415-L2428')} kind="code">
              ProcessGroupNCCL.cpp L2415-L2428
            </Cite>{' '}
            <Cite tier={1} href={pt(PG_CPP, 'L1774-L1775')} kind="code">
              L1774-L1775
            </Cite>
            . Then it takes the process down rather than continue, because CUDA runs asynchronously and later kernels
            could compute on corrupted data{' '}
            <Cite tier={1} href={pt(C10D_PY, 'L2515-L2519')}>
              PyTorch distributed_c10d.py L2515-L2519
            </Cite>{' '}
            <Cite tier={1} href={pt(PG_CPP, 'L808-L815')} kind="code">
              ProcessGroupNCCL.cpp L808-L815
            </Cite>
            . From stuck collective to teardown is {num(TIMEOUT_S)} s plus {DUMP_WINDOW_S} s, about{' '}
            {min1(TEARDOWN_MIN)} minutes, our arithmetic from the v2.15.0 defaults.
          </Box>
          <HangTimelineDiagram />
          <Box variant="p">
            If the watchdog itself hangs inside a CUDA or NCCL call, a heartbeat monitor kills the process{' '}
            <Cite tier={1} href={pt(PG_HPP, 'L98-L102')} kind="code">
              ProcessGroupNCCL.hpp L98-L102
            </Cite>
            . It compares the watchdog&apos;s heartbeat counter every {HEARTBEAT_S / 60} minutes (
            <code style={wrapCode}>TORCH_NCCL_HEARTBEAT_TIMEOUT_SEC={HEARTBEAT_S}</code>){' '}
            <Cite tier={1} href={pt(PG_CPP, 'L1772-L1773')} kind="code">
              ProcessGroupNCCL.cpp L1772-L1773
            </Cite>{' '}
            <Cite tier={1} href={pt(PG_CPP, 'L1940-L1962')} kind="code">
              L1940-L1962
            </Cite>
            , so it declares a stall {HB_DETECT_EARLY_MIN} to {HB_DETECT_LATE_MIN} minutes after it begins, then dumps
            and waits up to {HEARTBEAT_S / 60} more minutes{' '}
            <Cite tier={1} href={pt(PG_CPP, 'L2077-L2088')} kind="code">
              L2077-L2088
            </Cite>
            : about {HB_KILL_EARLY_MIN} to {min1(HB_KILL_LATE_MIN)} minutes to the kill, our arithmetic.
          </Box>
          <Box variant="p">
            <strong>Leave the {TIMEOUT_S / 60}-minute timeout alone unless a step needs longer.</strong> About{' '}
            {min1(TEARDOWN_MIN)} minutes from stall to teardown is about {pct0(HANG_SHARE)} of the{' '}
            {LLAMA3_INTERVAL_H.toFixed(1)} hours between Llama 3&apos;s unexpected interruptions, our arithmetic from the
            paper&apos;s {LLAMA3_UNEXPECTED} in {LLAMA3_DAYS} days{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint" accessed={R1}>
              Llama 3 Herd of Models, Section 3.3.4
            </Cite>
            , and section 17, Failure Is the Steady State, shows that interval shrinking as the job grows. A step that
            legitimately blocks every rank for longer, such as a synchronous checkpoint to slow storage, is the reason to
            raise <code>timeout=</code> in <code>init_process_group</code>{' '}
            <Cite tier={1} href={pt(C10D_PY, 'L2515-L2519')}>
              distributed_c10d.py L2515-L2519
            </Cite>
            ; ByteDance raised MegaScale&apos;s NCCL timeout after network interfaces that went down for several seconds
            failed jobs{' '}
            <Cite tier={3} href={MEGASCALE} venue="NSDI 2024" accessed={R1}>
              MegaScale, Section 6.3
            </Cite>
            . A log-based rule can fire sooner: the HyperPod training operator&apos;s sample rule calls 5 minutes without
            a new batch line a hang{' '}
            <Cite tier={1} href={HP_OPERATOR_USAGE} accessed={R1}>
              SageMaker Developer Guide, running jobs with the training operator
            </Cite>{' '}
            (section 25, The Kubernetes Family). The PyTorch timeout is the floor that holds on every path.
          </Box>
          <ExpandableSection headerText="The PyTorch v2.15.0 defaults behind these timings, read from code">
            <SpaceBetween size="s">
              <Box variant="p">
                Each value is the code&apos;s default at the pinned tag; none needs setting for the behaviour above.
              </Box>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>
                  <code style={wrapCode}>TORCH_NCCL_ASYNC_ERROR_HANDLING=3</code>: tear the process down without
                  aborting the communicator{' '}
                  <Cite tier={1} href={pt(PG_CPP, 'L972-L973')} kind="code">
                    ProcessGroupNCCL.cpp L972-L973
                  </Cite>{' '}
                  <Cite tier={1} href={pt(ENV_DOC, 'L11-L12')}>
                    torch_nccl_environment_variables.md L11-L12
                  </Cite>
                  .
                </li>
                <li>
                  <code style={wrapCode}>TORCH_NCCL_BLOCKING_WAIT=0</code>: setting it, as older guides do, creates no
                  watchdog thread at all, and with it no automatic dump{' '}
                  <Cite tier={1} href={pt(PG_CPP, 'L971-L998')} kind="code">
                    ProcessGroupNCCL.cpp L971-L998
                  </Cite>
                  .
                </li>
                <li>
                  <code style={wrapCode}>TORCH_NCCL_DUMP_ON_TIMEOUT=1</code> and{' '}
                  <code style={wrapCode}>TORCH_NCCL_ENABLE_MONITORING=1</code>{' '}
                  <Cite tier={1} href={pt(PG_CPP, 'L1780-L1785')} kind="code">
                    ProcessGroupNCCL.cpp L1780-L1785
                  </Cite>
                  .
                </li>
                <li>
                  <code style={wrapCode}>TORCH_FR_BUFFER_SIZE=2000</code> (alias{' '}
                  <code style={wrapCode}>TORCH_NCCL_TRACE_BUFFER_SIZE</code>; 0 turns the recorder off){' '}
                  <Cite tier={1} href={pt(FR_HPP, 'L105-L113')} kind="code">
                    FlightRecorder.hpp L105-L113
                  </Cite>
                  .
                </li>
                <li>
                  <code style={wrapCode}>TORCH_NCCL_HEARTBEAT_TIMEOUT_SEC=480</code>,{' '}
                  <code style={wrapCode}>TORCH_NCCL_WAIT_TIMEOUT_DUMP_MILSEC=15000</code> and{' '}
                  <code style={wrapCode}>TORCH_NCCL_COORD_CHECK_MILSEC=1000</code>, how often a rank looks for
                  another rank&apos;s dump signal{' '}
                  <Cite tier={1} href={pt(PG_CPP, 'L1772-L1776')} kind="code">
                    ProcessGroupNCCL.cpp L1772-L1776
                  </Cite>
                  .
                </li>
                <li>
                  <code style={wrapCode}>TORCH_NCCL_ENABLE_TIMING=0</code>: turning it on records a start event for
                  every collective, and the header warns that this raises the chance of a watchdog hang{' '}
                  <Cite tier={1} href={pt(PG_HPP, 'L89-L93')} kind="code">
                    ProcessGroupNCCL.hpp L89-L93
                  </Cite>
                  .
                </li>
                <li>
                  <code style={wrapCode}>TORCH_NCCL_RETHROW_CUDA_ERRORS=1</code> and{' '}
                  <code style={wrapCode}>TORCH_NCCL_TEARDOWN_ON_TIMEOUT=0</code>. At defaults the crash runs through the
                  first; a comment marks the second as &quot;off by default while this rolls out&quot;{' '}
                  <Cite tier={1} href={pt(PG_CPP, 'L2122')} kind="code">
                    ProcessGroupNCCL.cpp L2122
                  </Cite>{' '}
                  <Cite tier={1} href={pt(PG_CPP, 'L2436-L2442')} kind="code">
                    L2436-L2442
                  </Cite>
                  , so re-read both at the version you pin, our reading.
                </li>
              </ul>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            <strong>The evidence is the flight recorder</strong>, a per-rank ring buffer of the last {num(FR_ENTRIES)}{' '}
            collectives{' '}
            <Cite tier={1} href={pt(FR_HPP, 'L105-L113')} kind="code">
              FlightRecorder.hpp L105-L113
            </Cite>
            , each entry carrying the process group, sequence number, operation, sizes, data types, state (scheduled,
            started or completed), creation time and Python stack frames{' '}
            <Cite tier={1} href={pt(FR_HPP, 'L116-L167')} kind="code">
              L116-L167
            </Cite>
            . It records and dumps with no configuration from v2.11.0; at v2.10.0 it still defaulted to zero entries{' '}
            <Cite tier={1} href={gh('pytorch/pytorch', 'v2.10.0', FR_HPP, 'L106-L107')} kind="code">
              FlightRecorder.hpp v2.10.0 L106-L107
            </Cite>{' '}
            <Cite tier={1} href={gh('pytorch/pytorch', 'v2.11.0', FR_HPP, 'L109-L110')} kind="code">
              v2.11.0 L109-L110
            </Cite>
            . On an older PyTorch, including the 2.4.0 to 2.7.1 range the HyperPod training operator documents{' '}
            <Cite tier={1} href={HP_OPERATOR}>
              SageMaker Developer Guide, HyperPod training operator
            </Cite>
            , set <code style={wrapCode}>TORCH_NCCL_TRACE_BUFFER_SIZE=2000</code> yourself, our reading of the code
            across tags.
          </Box>
          <Box variant="p">
            {num(FR_ENTRIES)} entries is a few steps. FSDP (Fully Sharded Data Parallel) issues two all-gathers and one
            reduce-scatter per wrapped layer per micro-batch (one slice of the step&apos;s batch) at its defaults. We
            counted that on a DGX Spark&apos;s CPU with two processes and the gloo backend; the counts come from
            FSDP2&apos;s scheduling, so they carry to NCCL{' '}
            <Cite tier={0} href={E3_URL}>
              E3: FSDP2 collectives per optimizer step, PyTorch 2.15.0, one host
            </Cite>
            . For Llama 3.1 8B ({L8} layers) at {MICRO_BATCHES} micro-batches per step that is {num(C8.total)} FSDP
            collectives per step, and {num(C70.total)} for 70B ({L70} layers), so the buffer holds about{' '}
            {halfSteps(STEPS8)} steps of the 8B job and about {halfSteps(STEPS70)} step of 70B, counting FSDP&apos;s
            collectives only, our arithmetic. The stuck collective is the newest entry, so it is always there, our
            reading; <code style={wrapCode}>TORCH_FR_BUFFER_SIZE</code> sets how much history comes with it.
          </Box>
          <ExpandableSection headerText={`How ${num(FR_ENTRIES)} entries becomes about ${halfSteps(STEPS8)} steps and about ${halfSteps(STEPS70)}`}>
            <SpaceBetween size="s">
              <Box variant="p">
                With L wrapped layers plus the root unit and k micro-batches per step, FSDP2 at its defaults issues{' '}
                <code>(2L + 1) x k</code> all-gathers and <code>(L + 1) x k</code> reduce-scatters per step: each layer
                is gathered for the forward and again for the backward pass, while the root, which FSDP2 does not
                reshard after the forward pass, is gathered once; every unit reduce-scatters its gradients once{' '}
                <Cite tier={0} href={E3_URL}>
                  E3, results and derived uses
                </Cite>
                .
              </Box>
              <Box variant="p">
                Llama 3.1 8B: L = {L8}, k = {MICRO_BATCHES}: {num(C8.allGathers)} + {num(C8.reduceScatters)} ={' '}
                {num(C8.total)} collectives, and {num(FR_ENTRIES)} / {num(C8.total)} = {STEPS8.toFixed(2)} steps.
                Llama 3.1 70B: L = {L70}: {num(C70.allGathers)} + {num(C70.reduceScatters)} = {num(C70.total)}, and{' '}
                {num(FR_ENTRIES)} / {num(C70.total)} = {STEPS70.toFixed(2)} steps. Deferring gradient sync across
                micro-batches, as section 8, Data Parallelism &amp; Sharding, describes, lowers the counts and so covers
                more steps; the run measured those counts too. Tensor- and pipeline-parallel collectives fill the buffer
                faster.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            <strong>Put the dumps where they survive the node.</strong> Each rank writes one file,{' '}
            <code style={wrapCode}>comm_lib_trace_rank_</code> plus its rank, under{' '}
            <code style={wrapCode}>$XDG_CACHE_HOME/torch</code> or <code style={wrapCode}>~/.cache/torch</code> on its
            own node{' '}
            <Cite tier={1} href={pt(FR_CPP, 'L48-L67')} kind="code">
              FlightRecorder.cpp L48-L67
            </Cite>
            ; TorchTitan v0.4.0 writes into its <code>dump_folder</code>{' '}
            <Cite tier={1} href={TT_DEBUG}>
              TorchTitan debugging.md L156-L159
            </Cite>
            . A replaced node takes a node-local trace with it, so point{' '}
            <code style={wrapCode}>TORCH_FR_DUMP_TEMP_FILE</code> (or <code>dump_folder</code>) at shared storage such
            as Amazon FSx for Lustre, with a per-job prefix, our reading. Writing to the pipe named by{' '}
            <code style={wrapCode}>TORCH_NCCL_DEBUG_INFO_PIPE_FILE</code> dumps on demand, from a job that is slow but
            has not timed out{' '}
            <Cite tier={1} href={pt(ENV_DOC, 'L37-L38')}>
              torch_nccl_environment_variables.md L37-L38
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="The PyTorch tutorial's defaults disagree with the code">
            <Box variant="p">
              The flight-recorder tutorial, built against v2.15.0, says three environment variables are required, that{' '}
              <code style={wrapCode}>TORCH_NCCL_DUMP_ON_TIMEOUT</code> defaults to false, and that dumps go to{' '}
              <code style={wrapCode}>/tmp/nccl_trace_rank_</code>{' '}
              <Cite tier={1} href={FR_TUTORIAL} kind="doc-code-conflict">
                PyTorch tutorial, Flight Recorder for Debugging Stuck Jobs
              </Cite>
              . The v2.15.0 code needs none of the three, dumps on timeout by default, and writes under{' '}
              <code style={wrapCode}>~/.cache/torch</code>{' '}
              <Cite tier={1} href={pt(PG_CPP, 'L1780')} kind="code">
                ProcessGroupNCCL.cpp L1780
              </Cite>{' '}
              <Cite tier={1} href={pt(FR_CPP, 'L48-L67')} kind="code">
                FlightRecorder.cpp L48-L67
              </Cite>
              . The tutorial matches the v2.5.0 code, where both the buffer and dump-on-timeout defaulted off{' '}
              <Cite tier={1} href={gh('pytorch/pytorch', 'v2.5.0', PG_CPP, 'L835-L849')} kind="code" accessed={R1}>
                ProcessGroupNCCL.cpp v2.5.0 L835-L849
              </Cite>
              . The code is what runs; set the dump path explicitly rather than trust either default.
            </Box>
          </ExpandableSection>
          <Box variant="p">
            <strong>Then read the traces together.</strong> <code>torchfrtrace</code>, a console script installed with
            PyTorch{' '}
            <Cite tier={1} href={pt('pyproject.toml', 'L445')} kind="code">
              PyTorch pyproject.toml L445
            </Cite>
            , reads every rank&apos;s dump from one directory, matches collectives across ranks by process group and
            sequence number, and reports the first mismatch, such as &quot;Not all ranks joining collective&quot;{' '}
            <Cite tier={1} href={pt(FR_UTILS, 'L480-L487')} kind="code">
              flight_recorder utils.py L480-L487
            </Cite>
            . Map the missing rank to a host, check its Xids against the rule of section 29, What to Measure in a Run,
            and hand it to node repair in section 24, The Slurm Family, or section 25. If the reference rank is itself
            the culprit, the tool lists many healthy ranks instead{' '}
            <Cite tier={1} href={pt(FR_UTILS, 'L462-L463')} kind="code">
              utils.py L462-L463
            </Cite>
            . Llama 3 was trained on up to 16K GPUs with this recorder dumping on watchdog or heartbeat timeout, over
            Meta&apos;s own NCCL fork{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint" accessed={R1}>
              Llama 3 Herd of Models, Section 3.3.4
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>While the job is still hung, ask NCCL.</strong> Since NCCL 2.24 its RAS (reliability, availability
            and serviceability) subsystem runs in every NCCL process by default and listens on localhost port 28028. The{' '}
            <code>ncclras</code> client reports each communicator&apos;s state, names unreachable ranks as missing and
            lists ranks whose collective counts lag; a count that does not move between queries suggests a stuck
            communicator{' '}
            <Cite tier={1} href={NCCL_RAS}>
              NCCL 2.32.3 User Guide, RAS
            </Cite>
            . RAS answers before the crash, from any node and without a restart; the flight recorder answers after it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Add the counters a training dashboard alerts on to dcgm-exporter's default set: SM activity, throttling, ECC and NVLink errors all ship commented out"
          >
            GPU counters: what dcgm-exporter sends before you change it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On the GPU side the exporter is dcgm-exporter, which reads DCGM (NVIDIA Data Center GPU Manager) and serves
            the fields in a counters file as Prometheus metrics. Its default file at 4.8.4 exports tensor,
            graphics-engine and DRAM activity, PCIe bytes, temperatures, power, framebuffer use, NVLink bandwidth, the
            remapped-row counters and the last Xid (the NVIDIA driver&apos;s numbered GPU error reports){' '}
            <Cite tier={1} href={exporter('default-counters.csv', 'L5-L29')} kind="code">
              dcgm-exporter 4.8.4 default-counters.csv L5-L29
            </Cite>{' '}
            <Cite tier={1} href={exporter('default-counters.csv', 'L80-L113')} kind="code">
              L80-L113
            </Cite>
            .
          </Box>
          <Box variant="p">
            The same file ships commented out the counters a training run alerts on: SM (streaming multiprocessor)
            activity, the power and thermal violation durations that show throttling, the ECC (error-correcting code)
            counters, every NVLink error counter, and <code style={wrapCode}>DCGM_EXP_XID_ERRORS_TOTAL</code>, the
            running Xid count{' '}
            <Cite tier={1} href={exporter('default-counters.csv', 'L28-L42')} kind="code">
              default-counters.csv L28-L42
            </Cite>{' '}
            <Cite tier={1} href={exporter('default-counters.csv', 'L55-L79')} kind="code">
              L55-L79
            </Cite>{' '}
            <Cite tier={1} href={exporter('default-counters.csv', 'L105-L106')} kind="code">
              L105-L106
            </Cite>
            ; the clock-event-reasons field (112) is absent, our reading of the file. The default Xid gauge keeps only
            the last value, so a second Xid overwrites the first, our reading of the help texts. Copy the file,
            uncomment those rows and pass it with <code>-f</code>, as the HyperPod lifecycle script does{' '}
            <Cite tier={1} href={lifecycle('observability/install_dcgm_exporter.sh', 'L64-L74')} kind="code">
              HyperPod lifecycle install_dcgm_exporter.sh L64-L74
            </Cite>
            . Section 29 says what each counter means and which Xids to alert on.
          </Box>
          <Box variant="p">
            The EFA (Elastic Fabric Adapter) device counters and how to read them are in the {EFA_OPS_LINK}; the Neuron
            monitor, top and profiler tools for Trainium are in the {SILICON_TOOLS_LINK}.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Follow each signal from the node to a dashboard on your AWS path, and find the ones that stay dark until you turn them on"
          >
            The AWS layer, path by path
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each AWS path ships the counters through its own agent to its own store; the in-process layer above is the
            same on all of them.
          </Box>
          <TelemetryMapDiagram />
          <Box variant="p">
            <strong>Self-managed EKS.</strong> On EKS (Amazon Elastic Kubernetes Service), CloudWatch Container Insights
            with enhanced observability collects by default once the CloudWatch Observability EKS add-on is installed:
            NVIDIA GPU metrics from add-on v1.3.0-eksbuild.1 with the NVIDIA device plugin, Neuron metrics from
            v1.5.0-eksbuild.1 with the Neuron driver and device plugin, and EFA metrics from v1.5.2-eksbuild.1 with the
            EFA device plugin. Metrics are collected and ingested every 60 seconds; detailed monitoring from
            v4.7.0-eksbuild.1 samples down to 1 second and still ingests once a minute. The EFA set carries traffic and
            drops, such as <code style={wrapCode}>node_efa_rx_dropped</code>{' '}
            <Cite tier={1} href={CI_EKS}>
              CloudWatch User Guide, Container Insights enhanced observability metrics for EKS
            </Cite>
            . The EKS Best Practices Guide recommends Container Insights for minimal setup, or Amazon Managed Service for
            Prometheus with Amazon Managed Grafana{' '}
            <Cite tier={1} href={EKS_OBS}>
              EKS Best Practices Guide, AI/ML observability
            </Cite>
            ; on that second route you get the dcgm-exporter defaults above.
          </Box>
          <Box variant="p">
            <strong>HyperPod EKS.</strong> The SageMaker HyperPod observability add-on publishes to Amazon Managed
            Service for Prometheus and displays in Amazon Managed Grafana{' '}
            <Cite tier={1} href={HP_ADDON}>
              SageMaker Developer Guide, HyperPod observability add-on
            </Cite>
            . On by default: training metrics (Kubeflow and pod), cluster, instance and file-system metrics, and a
            &quot;Limited&quot; DCGM set. Off by default: the training operator&apos;s metrics such as{' '}
            <code style={wrapCode}>training_fault_count</code> and{' '}
            <code style={wrapCode}>training_fault_recovery_time_ms</code>, Trainium&apos;s Neuron metrics, EFA network
            metrics, the advanced DCGM metrics, and task-governance and scaling metrics{' '}
            <Cite tier={1} href={HP_METRICS}>
              SageMaker Developer Guide, HyperPod cluster metrics
            </Cite>
            .
          </Box>
          <Box variant="p">
            The add-on&apos;s preset Grafana alerts include GPU temperature above 80 C for 5 minutes and above 85 C for 1
            minute, and any Xid{' '}
            <Cite tier={1} href={HP_ALERTS}>
              SageMaker Developer Guide, preconfigured alerts
            </Cite>
            , which read fields in the default set; the Xid rule fires on every Xid, wider than section 29&apos;s bucket
            rule, our reading. Four more (ECC double-bit errors, power violation, thermal violation and NVLink errors)
            read DCGM fields that AWS&apos;s metrics reference places in the advanced set, the rows commented out of
            dcgm-exporter&apos;s counter file{' '}
            <Cite tier={1} href={HP_METRICS}>
              HyperPod cluster metrics, accelerated compute
            </Cite>{' '}
            <Cite tier={1} href={exporter('dcp-metrics-included.csv', 'L28-L66')} kind="code">
              dcgm-exporter 4.8.4 dcp-metrics-included.csv L28-L66
            </Cite>
            . Those four rules have no data until advanced DCGM metrics are turned on, our reading of AWS&apos;s metrics
            and alerts pages and the counter file they name; not tested on a cluster.
          </Box>
          <ExpandableSection headerText="A4 protocol (not yet run)">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>What it would measure.</strong> A4 is the smallest real HyperPod EKS run: one cluster with one
                ml.p5.48xlarge (
                <Link external href={GUIDE_URL}>
                  research guide, section 5
                </Link>
                ). For this section it would install the observability add-on and query Amazon Managed Service for
                Prometheus for the ECC, power-violation, thermal-violation and NVLink-error series, first in the default
                mode and then with advanced DCGM metrics on. It would also check the NVLink rule&apos;s field names: the
                alert reads <code style={wrapCode}>DCGM_FI_DEV_NVLINK_RECOVERY_ERROR_COUNT_TOTAL</code>, an old name
                DCGM v4.7.0 keeps as an alias{' '}
                <Cite tier={1} href={DCGM_FIELDS('L4107')} kind="code">
                  DCGM v4.7.0 dcgm_fields.h L4107
                </Cite>
                , while dcgm-exporter 4.8.4&apos;s file lists{' '}
                <code style={wrapCode}>DCGM_FI_DEV_NVLINK_RECOVERY_ERROR_TOTAL</code>{' '}
                <Cite tier={1} href={exporter('dcp-metrics-included.csv', 'L61-L62')} kind="code">
                  dcp-metrics-included.csv L61-L62
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>Prediction, our reading and not a result.</strong> The four series absent in the default mode
                and present with advanced metrics on.
              </Box>
              <Box variant="p">
                <strong>Cost and teardown.</strong> {A4_HOURS} hours at HyperPod&apos;s ${HP_P5.value} per
                ml.p5.48xlarge-hour is {usd(A4_COST)}, plus {usd2(EKS_CLUSTER)} per hour for EKS and EBS storage, our
                arithmetic on us-east-1 rates{' '}
                <Cite tier={1} href={HP_P5.source.url} accessed={R1}>
                  SageMaker Price List, us-east-1
                </Cite>
                . Delete the HyperPod cluster, then the EKS cluster, then confirm with <code>list-clusters</code>.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            <strong>HyperPod Slurm.</strong> There is no add-on. HyperPod&apos;s base lifecycle scripts install a DCGM
            exporter and an EFA node exporter on compute nodes, and a Slurm exporter and Prometheus on the head node,
            feeding Amazon Managed Service for Prometheus and Amazon Managed Grafana, when{' '}
            <code style={wrapCode}>enable_observability=True</code> is set in <code>config.py</code>{' '}
            <Cite tier={1} href={HP_SLURM_EXPORTERS}>
              SageMaker Developer Guide, installing metrics exporter packages
            </Cite>
            . At the pinned commit both switches start off,{' '}
            <code style={wrapCode}>enable_observability = False</code> and{' '}
            <code style={wrapCode}>advanced_metrics = False</code>{' '}
            <Cite tier={1} href={lifecycle('config.py', 'L8-L10')} kind="code">
              lifecycle config.py L8-L10
            </Cite>{' '}
            <Cite tier={1} href={lifecycle('config.py', 'L47-L48')} kind="code">
              L47-L48
            </Cite>
            , and without the second the exporter gets a basic counter file with the violation counters but no SM
            activity and no ECC{' '}
            <Cite tier={1} href={lifecycle('observability/install_observability.py', 'L64-L68')} kind="code">
              install_observability.py L64-L68
            </Cite>{' '}
            <Cite tier={1} href={lifecycle('observability/dcgm_metrics_config/dcgm-metrics-basic.csv')} kind="code">
              dcgm-metrics-basic.csv
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>SageMaker training jobs.</strong> A training job publishes CPU, memory, disk,{' '}
            <code>GPUUtilization</code> and <code>GPUMemoryUtilization</code> per instance to the{' '}
            <code style={wrapCode}>/aws/sagemaker/TrainingJobs</code> namespace every minute. The GPU metrics are summed
            over the instance&apos;s GPUs (0 to 400% on four), with a <code>Normalized</code> variant, and the default
            CloudWatch view averages across instances{' '}
            <Cite tier={1} href={SM_CW}>
              SageMaker Developer Guide, monitoring with CloudWatch
            </Cite>
            . On a p5.48xlarge&apos;s {P5_GPUS} GPUs the range is 0 to {P5_GPUS * 100}%, and on a {JOB_HOSTS}-instance
            job one idle host moves the averaged normalized value by at most 1/{JOB_HOSTS}, about{' '}
            {(100 / JOB_HOSTS).toFixed(1)} percentage points, our arithmetic: plot each host (the{' '}
            <code style={wrapCode}>job-name/algo-n</code> dimension) and alarm on the minimum. Loss, tokens per second
            and every other training metric reach CloudWatch only through metric definitions you supply, a name and a
            regular expression matched against the training log{' '}
            <Cite tier={1} href={SM_DEFINE}>
              SageMaker Developer Guide, define training metrics
            </Cite>
            .
          </Box>
          <Box variant="p">
            SageMaker Debugger is closed to new customers (the page gives no date; read 2026-10-31){' '}
            <Cite tier={1} href={SM_DEBUGGER}>
              SageMaker Developer Guide, Debugger availability change
            </Cite>
            , and SageMaker Profiler reaches end of support on 2027-06-30{' '}
            <Cite tier={1} href={SM_PROFILER}>
              SageMaker Developer Guide, Profiler availability change
            </Cite>
            . Build on the replacements AWS names: MLflow or TensorBoard for training metrics, CloudWatch for system
            profiling, the PyTorch profiler for kernel traces.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Explain a slow step rank by rank from profiler traces, and log NCCL at a level that helps, measuring its cost instead of guessing it"
          >
            Reading a slow run: Holistic Trace Analysis, NCCL logs and Nsight Systems
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            When the step is slower than the estimate and no rank has failed, the question is where each rank&apos;s
            time went. Holistic Trace Analysis (HTA) v0.6.1 reads one PyTorch profiler trace per rank and reports, per
            rank, time split into compute, non-compute and idle{' '}
            <Cite tier={1} href={hta('L231-L236')} kind="code">
              HTA trace_analysis.py L231-L236
            </Cite>
            ; idle time split into host wait (the CPU did not enqueue kernels fast enough), kernel wait (gaps between
            short kernels) and other waits{' '}
            <Cite tier={1} href={hta('L579-L600')} kind="code">
              L579-L600
            </Cite>
            ; the share of communication overlapped with compute{' '}
            <Cite tier={1} href={hta('L40-L42')} kind="code">
              L40-L42
            </Cite>
            ; and, as straggler candidates, ranks whose communication kernels start late{' '}
            <Cite tier={1} href={hta('L66-L76')} kind="code">
              L66-L76
            </Cite>
            . That late starter is the straggler of section 19, Resuming Correctly, a rank slower than the rest that
            never fails, while the healthy ranks book their wait for it as communication time, our reading.
          </Box>
          <Box variant="p">
            In NCCL&apos;s own log, <code>NCCL_DEBUG=WARN</code> prints errors and <code>INFO</code> prints debug output
            filtered by <code>NCCL_DEBUG_SUBSYS</code> (default <code>INIT,BOOTSTRAP,ENV</code>). Give each process its
            own file with <code style={wrapCode}>NCCL_DEBUG_FILE=name.%h.%p</code> (host and process ID), because a
            shared file name can lose or corrupt output. In a fleet mixing NCCL versions NVIDIA recommends{' '}
            <code style={wrapCode}>NCCL_DEBUG=WARN NCCL_DEBUG_LEVELS=ATTN</code> over <code>ATTN</code> alone, which
            versions before 2.32 answer with no logging{' '}
            <Cite tier={1} href={NCCL_ENV}>
              NCCL 2.32.3 User Guide, environment variables
            </Cite>
            . Use <code>WARN</code> for the long run and <code>INFO</code> with a subsystem filter for bring-up, our
            reading.
          </Box>
          <Box variant="p">
            For a kernel-level timeline, Nsight Systems traces NCCL&apos;s built-in annotations whenever it traces
            annotations, and from 2025.6.1 with NCCL 2.28 or later offers a more detailed NCCL trace. Start the capture
            at a chosen step with <code>--capture-range</code> and name one report per rank with a{' '}
            <code>{'%q{ENV_VAR}'}</code> pattern{' '}
            <Cite tier={1} href={NSYS}>
              Nsight Systems User Guide v2026.5
            </Cite>
            . Neither NVIDIA page gives an overhead figure for NCCL logging or NCCL tracing, so measure one step with
            and without before leaving either on.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Set the Neuron runtime's ${NEURON_EXEC_TIMEOUT_S}-second execution timeout on purpose for a multi-node run, and know where its evidence lands`}
          >
            On Trainium the Neuron runtime owns the timeout
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On Trainium the Neuron runtime, rather than PyTorch&apos;s NCCL watchdog, times out a hung step. Each
            execution times out after {NEURON_EXEC_TIMEOUT_S} seconds by default (
            <code style={wrapCode}>NEURON_RT_EXEC_TIMEOUT</code>), and distributed workloads may legitimately need far
            more because of network interruptions{' '}
            <Cite tier={1} href={neuron(NRT_ENV, 'L83-L86')}>
              Neuron 2.33 runtime environment variables L83-L86
            </Cite>
            . That default is {NEURON_RATIO} times shorter than PyTorch&apos;s {TIMEOUT_S / 60} minutes, so set it on
            purpose for a multi-node run, our reading.
          </Box>
          <Box variant="p">
            A hang in collectives exits with <code>NRT_TIMEOUT (5)</code> or{' '}
            <code style={wrapCode}>NRT_EXEC_HW_ERR_COLLECTIVES (1200)</code>, possibly from a hardware error on another
            worker; the runtime troubleshooting guide, written for Inf1, Inf2 and Trn1, says to search the other workers
            for uncorrectable SRAM and HBM (high-bandwidth memory) errors, DMA (direct memory access) aborts and
            hang-on-compute errors{' '}
            <Cite tier={1} href={neuron(NRT_TROUBLE, 'L543-L559')}>
              Neuron runtime troubleshooting L543-L559
            </Cite>
            . Core dumps go to <code style={wrapCode}>/tmp/neuron-core-dump/dt-%d-cid-%c</code> by default, with the
            device and collectives cluster ID substituted so ranks do not collide, and{' '}
            <code style={wrapCode}>NEURON_RT_S3_CORE_DUMP_PREFIX</code> hands an S3 (Amazon Simple Storage Service)
            prefix to <code>neuron-dump</code> for upload{' '}
            <Cite tier={1} href={neuron(NRT_ENV, 'L409-L416')}>
              runtime environment variables L409-L416
            </Cite>
            . No counterpart to <code>torchfrtrace</code>&apos;s cross-rank matching was located in the Neuron 2.33
            runtime documentation read, so the dumps are read rank by rank; put them on shared storage, as with the
            flight recorder, our reading.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Switch these on before the long run, for your path, and keep the ${TIMEOUT_S / 60}-minute collective timeout: it is what turns a hang into a crash with evidence about ${min1(TEARDOWN_MIN)} minutes later`}
          >
            What to switch on before the long run
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>
              <strong>Every path.</strong> Point <code style={wrapCode}>TORCH_FR_DUMP_TEMP_FILE</code> (or
              TorchTitan&apos;s <code>dump_folder</code>) at shared storage with a per-job prefix. On PyTorch before
              v2.11.0 set <code style={wrapCode}>TORCH_NCCL_TRACE_BUFFER_SIZE=2000</code>. Leave{' '}
              <code style={wrapCode}>TORCH_NCCL_BLOCKING_WAIT</code> unset, so the watchdog and its dump stay.
            </li>
            <li>
              <strong>Any cluster running dcgm-exporter.</strong> Add SM activity, the power and thermal violation
              counters, the ECC and NVLink error counters and the running Xid count to the counters file.
            </li>
            <li>
              <strong>Self-managed EKS.</strong> Install the CloudWatch Observability EKS add-on at v1.5.2-eksbuild.1
              or later with the NVIDIA, EFA and, on Trainium, Neuron device plugins, or run dcgm-exporter into your own
              Prometheus.
            </li>
            <li>
              <strong>HyperPod EKS.</strong> Install the observability add-on, then turn on the training-operator
              metrics, EFA metrics, advanced DCGM metrics and, on Trainium, Neuron metrics, or four preset GPU alerts
              stay silent.
            </li>
            <li>
              <strong>HyperPod Slurm.</strong> Set <code style={wrapCode}>enable_observability = True</code> and{' '}
              <code style={wrapCode}>advanced_metrics = True</code> in the lifecycle scripts&apos;{' '}
              <code>config.py</code>.
            </li>
            <li>
              <strong>SageMaker training jobs.</strong> Supply metric definitions for loss and tokens per second, plot
              GPU metrics per host, and send model metrics to MLflow or TensorBoard.
            </li>
            <li>
              <strong>Trainium.</strong> Set <code style={wrapCode}>NEURON_RT_EXEC_TIMEOUT</code> for the run&apos;s
              scale and point the core-dump directory at shared storage.
            </li>
          </ul>
          <Box variant="p">
            Keep the collective timeout on: with it, a hung collective becomes a crash with a trace from every rank
            about {min1(TEARDOWN_MIN)} minutes later, and the restart path of section 24 or 25 takes over. Check each
            switch on a test job during section 31, Bring-Up: From One Node to the Full Run, before the long run starts.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
