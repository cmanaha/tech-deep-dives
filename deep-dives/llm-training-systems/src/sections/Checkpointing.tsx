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
import Toggle from '@cloudscape-design/components/toggle';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Link from '@cloudscape-design/components/link';
import {
  Cite,
  arxiv,
  gh,
  E4_URL,
  GUIDE_URL,
  MEGATRON_TAG,
  METASEQ_SHA,
  PYTORCH_TAG,
  S3_CONNECTOR_TAG,
  TORCHTITAN_TAG,
} from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import {
  DENSE_MODELS,
  FAILURE_RATES,
  GB,
  GiB,
  INSTANCES,
  OPTIMIZER_ROWS,
  PRICES,
  shapeOf,
  type DenseModelId,
  type FsxTier,
  type OptimizerRowId,
} from '../lib/presets';
import {
  checkpointBytesPerParameter,
  checkpointPlan,
  checkpointSize,
  type CheckpointInput,
  type CheckpointResult,
  type SaveMode,
} from '../lib/checkpoint';
import { denseRuntimeInputs, estimateRun } from '../lib/runtime';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Register rows cited without re-opening the source keep the register's date. */
const REGISTER_DATE = '2026-10-30';

/** Meta, Revisiting Reliability in Large-Scale ML Research Clusters: Sec III, Eq. 3, Appendix A. */
const META_RELIABILITY = arxiv('2410.21680v2');
/** The Llama 3 Herd of Models: Sec 3.3.1 (checkpoint size per GPU), Table 4 (MFU). */
const LLAMA3 = arxiv('2407.21783v3');
/** MegaScale (NSDI 2024), Sec 4.4: two-stage checkpointing and broadcast on recovery. */
const MEGASCALE = arxiv('2402.15627v1');
/** ByteCheckpoint (NSDI 2025), Sec 2.1: what a checkpoint must hold. */
const BYTECHECKPOINT = arxiv('2407.20143v4');
/** ZeRO, Sec 3.1: 16 bytes per parameter for mixed-precision Adam. */
const ZERO = arxiv('1910.02054v3');
/** Amazon Science post by Gemini's authors (SOSP 2023): in-memory checkpoints on peers. */
const GEMINI_BLOG = 'https://www.amazon.science/blog/more-efficient-recovery-from-failures-during-large-ml-model-training';
/** OPT-175B team notes at metaseq HEAD of 2026-10-30: 1.6 TB checkpoint in 992 files. */
const OPT_NOTES = gh('facebookresearch/metaseq', METASEQ_SHA, 'projects/OPT/chronicles/27_percent_update.md', 'L19');
/** Meta's Hugging Face model metadata for Llama 3.1 70B (exact parameter count). */
const HF_LLAMA_70B = 'https://huggingface.co/api/models/meta-llama/Llama-3.1-70B/revision/349b2ddb53ce8f2849a6c168a81980ab25258dac';
const EC2_ACCEL = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';
const H100_SPEC = 'https://www.nvidia.com/en-us/data-center/h100/';

/* PyTorch v2.15.0, Distributed Checkpoint */
const DCP_DOC = gh('pytorch/pytorch', PYTORCH_TAG, 'docs/source/distributed.checkpoint.md', 'L8-L14');
const SAVER_CPU_CHECK = gh('pytorch/pytorch', PYTORCH_TAG, 'torch/distributed/checkpoint/state_dict_saver.py', 'L299-L304');
const SAVER_DEFAULT_STAGER = gh('pytorch/pytorch', PYTORCH_TAG, 'torch/distributed/checkpoint/state_dict_saver.py', 'L306-L321');
const STAGING_OPTIONS = gh('pytorch/pytorch', PYTORCH_TAG, 'torch/distributed/checkpoint/staging.py', 'L104-L130');
const FS_WRITER_STAGER = gh('pytorch/pytorch', PYTORCH_TAG, 'torch/distributed/checkpoint/filesystem.py', 'L973');
const BACKEND_DEFAULT = gh('pytorch/pytorch', PYTORCH_TAG, 'torch/distributed/distributed_c10d.py', 'L1056-L1066');

/* TorchTitan v0.4.0 checkpointer */
const TT_STATE_KEYS = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/components/checkpointer/base.py', 'L36-L41');
const TT_INTERVAL = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/components/checkpointer/base.py', 'L556');
const TT_KEEP = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/components/checkpointer/base.py', 'L580');
const TT_MODE_DEFAULT = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/components/checkpointer/dcp.py', 'L138');
const TT_DISPATCH = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/components/checkpointer/dcp.py', 'L317-L338');
const TT_STAGER = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/components/checkpointer/dcp.py', 'L453-L474');
const TT_FENCE = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/training_engine.py', 'L872-L876');

/* Megatron Core core_v0.20.0 */
const MG_ASYNC_OFF = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/training/arguments.py', 'L1808-L1814');
const MG_ASYNC_DOC = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/training/config/training_config.py', 'L551-L552');
const MG_ASYNC_NVRX = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/training/config/training_config.py', 'L692-L699');

/* Amazon S3 and the S3 Connector for PyTorch v1.5.0 */
const S3_PART_SIZE = gh(
  'awslabs/s3-connector-for-pytorch',
  S3_CONNECTOR_TAG,
  's3torchconnector/src/s3torchconnector/_s3client/s3client_config.py',
  'L14-L26',
);
const S3_WRITER = gh(
  'awslabs/s3-connector-for-pytorch',
  S3_CONNECTOR_TAG,
  's3torchconnector/src/s3torchconnector/dcp/s3_file_system.py',
  'L271-L303',
);
const S3_PREFIX_DEFAULT = gh(
  'awslabs/s3-connector-for-pytorch',
  S3_CONNECTOR_TAG,
  's3torchconnector/src/s3torchconnector/dcp/s3_prefix_strategy.py',
  'L25-L31',
);
const S3_PREFIX_README = gh('awslabs/s3-connector-for-pytorch', S3_CONNECTOR_TAG, 'README.md', 'L197-L205');
const S3_PERF = 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html';
const S3_EXPRESS = 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-performance.html';

/* Amazon FSx for Lustre */
const FSX_SSD = 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/ssd-storage.html';
const FSX_PERF = 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html';
const FSX_SIZES = 'https://docs.aws.amazon.com/fsx/latest/APIReference/API_CreateFileSystem.html';
const FSX_PRICE = 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonFSx/20260911124432/us-east-1/index.json';

/* SageMaker HyperPod managed tiered checkpointing */
const HP_TIERED_GA = 'https://aws.amazon.com/about-aws/whats-new/2025/09/managed-tiered-checkpointing-amazon-sagemaker-hyperpod/';
const HP_TIERED = 'https://docs.aws.amazon.com/sagemaker/latest/dg/managed-tier-checkpointing.html';
const HP_TIERED_SETUP = 'https://docs.aws.amazon.com/sagemaker/latest/dg/managed-tier-checkpointing-setup.html';
const HP_LIBRARY = 'https://pypi.org/project/amzn-sagemaker-checkpointing/1.1.3/';

/* Prices for the A3 protocol */
const EC2_PRICE_LIST =
  'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv';
const CB_PRICING = 'https://aws.amazon.com/ec2/capacityblocks/pricing/';
const OD_QUOTAS = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html';

/** Conditions every E4 figure carries. */
const E4_TITLE = 'E4: checkpoint staging on one GB10, PyTorch 2.15.0, three saves in one run';

/* ------------------------------------------------------------------------ */
/* Worked numbers, all from Calculators A and D                             */
/* ------------------------------------------------------------------------ */

const P5 = INSTANCES['p5.48xlarge'];
const GPUS_PER_NODE = P5.acceleratorsPerInstance.value;
const N70 = DENSE_MODELS['llama-3.1-70b'].totalParameters.value;

/** Reference job: Llama 3.1 70B, 512 sequences of 8,192 tokens per step, 256 H100 at 40% MFU (Calculator A). */
const REF_STEP_SECONDS = estimateRun({
  ...denseRuntimeInputs(shapeOf(DENSE_MODELS['llama-3.1-70b']), 'full'),
  tokens: 512 * 8_192,
  sequenceLength: 8_192,
  attention: 'none',
  peakTflopsPerAccelerator: P5.denseBf16TflopsPerAccelerator.value,
  accelerators: 256,
}).wallClockSeconds;

const BYTES_PER_PARAM_14 = checkpointBytesPerParameter('adamMixed', { saveWorkingWeights: true });
const BYTES_PER_PARAM_12 = checkpointBytesPerParameter('adamMixed', { saveWorkingWeights: false });
const SIZE_70B = checkpointSize({ parameters: N70, bytesPerParameter: BYTES_PER_PARAM_14, ranks: 256 });
const SIZE_70B_12 = checkpointSize({ parameters: N70, bytesPerParameter: BYTES_PER_PARAM_12, ranks: 256 });

function refPlan(overrides: Partial<CheckpointInput> = {}): CheckpointResult {
  return checkpointPlan({
    checkpointBytes: SIZE_70B.totalBytes,
    nodes: 32,
    failuresPerThousandNodeDays: FAILURE_RATES.rsc1.value,
    stepSeconds: REF_STEP_SECONDS,
    saveMode: 'synchronous',
    blockingSeconds: 60,
    restartSeconds: 600,
    ...overrides,
  });
}

const W_SYNC = refPlan();
const W_ASYNC = refPlan({ saveMode: 'asynchronous', blockingSeconds: 2 });
const W_WORST = refPlan({ failuresPerThousandNodeDays: FAILURE_RATES.rsc1WorstMonth.value });
const W_RSC2 = refPlan({ failuresPerThousandNodeDays: FAILURE_RATES.rsc2.value });
const W16_60 = refPlan({ nodes: 2_048 });
const W16_2 = refPlan({ nodes: 2_048, blockingSeconds: 2 });
const W16_2_FAST = refPlan({ nodes: 2_048, blockingSeconds: 2, restartSeconds: 300 });

const fmt = (x: number, digits = 0) =>
  x.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
const gbText = (bytes: number, digits = 2) => `${fmt(bytes / GB, digits)} GB`;
const hours = (s: number) => fmt(s / 3_600, 1);
const minutes = (s: number) => fmt(s / 60, 1);

/* ------------------------------------------------------------------------ */
/* Diagram: two save designs against one failure                            */
/* ------------------------------------------------------------------------ */

type SegKind = 'train' | 'save' | 'lost' | 'restart';
interface Seg {
  from: number;
  to: number;
  kind: SegKind;
}

/** Schematic time units, 0 to 100. */
const FAIL_T = 72;
const RESTART_END = 86;
const SYNC_SEGS: Seg[] = [
  { from: 0, to: 25, kind: 'train' },
  { from: 25, to: 30, kind: 'save' },
  { from: 30, to: 55, kind: 'train' },
  { from: 55, to: 60, kind: 'save' },
  { from: 60, to: FAIL_T, kind: 'lost' },
  { from: FAIL_T, to: RESTART_END, kind: 'restart' },
  { from: RESTART_END, to: 100, kind: 'train' },
];
const ASYNC_SAVES = [11, 22, 33, 44, 55, 66];
const ASYNC_PAUSE = 0.8;
const ASYNC_DRAIN = 5;

function asyncSegs(): Seg[] {
  const segs: Seg[] = [];
  let t = 0;
  for (const s of ASYNC_SAVES) {
    segs.push({ from: t, to: s, kind: 'train' });
    segs.push({ from: s, to: s + ASYNC_PAUSE, kind: 'save' });
    t = s + ASYNC_PAUSE;
  }
  segs.push({ from: t, to: FAIL_T, kind: 'lost' });
  segs.push({ from: FAIL_T, to: RESTART_END, kind: 'restart' });
  segs.push({ from: RESTART_END, to: 100, kind: 'train' });
  return segs;
}
const ASYNC_SEGS = asyncSegs();

const SEG_STYLE: Record<SegKind, { fill: string; stroke: string; label: string }> = {
  train: { fill: '#f2f8fd', stroke: '#0972d3', label: 'training' },
  save: { fill: '#fbf3d5', stroke: '#8b6c00', label: 'save pauses training' },
  lost: { fill: '#fde7e7', stroke: '#d91515', label: 'lost work' },
  restart: { fill: '#e9ebed', stroke: '#414d5c', label: 'restart and load' },
};
const DRAIN_STYLE = { fill: '#e6f4f2', stroke: '#1f7a70', label: 'background write' };

function SaveTimelineDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref);

  const ink = '#16191f';
  const muted = '#414d5c';
  const red = '#d91515';
  const font = 'sans-serif';

  const W = narrow ? 400 : 900;
  const x0 = narrow ? 16 : 200;
  const x1 = narrow ? 384 : 880;
  const u = (x1 - x0) / 100;
  const x = (t: number) => x0 + t * u;

  const laneH = narrow ? 30 : 36;
  const lane1 = narrow ? 68 : 68;
  const lane2 = narrow ? 128 : 146;
  const drainY = lane2 + laneH + 6;
  const drainH = narrow ? 6 : 8;
  const failTop = narrow ? 64 : 62;
  const failBottom = drainY + drainH + 4;
  const H = narrow ? 252 : 230;

  const lane = (segs: Seg[], top: number, inside: boolean) => (
    <g>
      {segs.map((sg) => (
        <rect
          key={`${top}-${sg.from}`}
          x={x(sg.from)}
          y={top}
          width={Math.max(x(sg.to) - x(sg.from), 2.5)}
          height={laneH}
          fill={SEG_STYLE[sg.kind].fill}
          stroke={SEG_STYLE[sg.kind].stroke}
          strokeWidth={1.2}
        />
      ))}
      {inside && (
        <text
          x={(x(segs[0].from) + x(segs[0].to)) / 2}
          y={top + laneH / 2 + 4}
          fontFamily={font}
          fontSize={11}
          fill={ink}
          textAnchor="middle"
        >
          training
        </text>
      )}
    </g>
  );

  const legendItems = [SEG_STYLE.train, SEG_STYLE.save, SEG_STYLE.lost, SEG_STYLE.restart, DRAIN_STYLE];

  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="checkpointing-timeline-title"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <title id="checkpointing-timeline-title">
          Two runs hit by the same failure. In the synchronous run every save pauses training for
          the whole write, so saves are spaced far apart, and the failure throws away all the work
          done since the last save; the restart then reads the checkpoint back before training
          resumes. In the asynchronous run each save pauses training only for a brief copy off the
          GPU while the write to storage continues in the background, so saves come more often and
          the failure throws away less work. The restart and its load take as long in both runs.
        </title>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />

        <text x={narrow ? 16 : 20} y={20} fontFamily={font} fontSize={13} fontWeight={600} fill={ink}>
          Two save designs, one failure
        </text>
        <text x={narrow ? 16 : 20} y={36} fontFamily={font} fontSize={11} fill={muted}>
          {narrow ? 'same failure, same restart' : 'same failure, same restart: only the pause and the interval change'}
        </text>

        {/* Lane labels */}
        {narrow ? (
          <>
            <text x={16} y={lane1 - 8} fontFamily={font} fontSize={12} fontWeight={600} fill={ink}>
              Synchronous save
            </text>
            <text x={16} y={lane2 - 8} fontFamily={font} fontSize={12} fontWeight={600} fill={ink}>
              Asynchronous save
            </text>
          </>
        ) : (
          <>
            <text x={20} y={lane1 + 15} fontFamily={font} fontSize={12} fontWeight={600} fill={ink}>
              Synchronous save
            </text>
            <text x={20} y={lane1 + 31} fontFamily={font} fontSize={11} fill={muted}>
              long pause, long interval
            </text>
            <text x={20} y={lane2 + 15} fontFamily={font} fontSize={12} fontWeight={600} fill={ink}>
              Asynchronous save
            </text>
            <text x={20} y={lane2 + 31} fontFamily={font} fontSize={11} fill={muted}>
              short pause, short interval
            </text>
          </>
        )}

        {lane(SYNC_SEGS, lane1, true)}
        {lane(ASYNC_SEGS, lane2, !narrow)}

        {/* Background writes after each asynchronous save */}
        {ASYNC_SAVES.map((s) => (
          <rect
            key={`drain-${s}`}
            x={x(s + ASYNC_PAUSE)}
            y={drainY}
            width={x(s + ASYNC_PAUSE + ASYNC_DRAIN) - x(s + ASYNC_PAUSE)}
            height={drainH}
            fill={DRAIN_STYLE.fill}
            stroke={DRAIN_STYLE.stroke}
            strokeWidth={1}
          />
        ))}

        {/* The failure */}
        <line x1={x(FAIL_T)} y1={failTop} x2={x(FAIL_T)} y2={failBottom} stroke={red} strokeWidth={1.5} strokeDasharray="5 3" />
        <text x={x(FAIL_T)} y={narrow ? lane1 - 8 : 56} fontFamily={font} fontSize={11} fontWeight={600} fill={red} textAnchor="middle">
          failure
        </text>

        {narrow ? (
          legendItems.map((item, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const lx = col === 0 ? 16 : 206;
            const ly = 200 + row * 20;
            return (
              <g key={item.label}>
                <rect x={lx} y={ly - 9} width={14} height={10} fill={item.fill} stroke={item.stroke} strokeWidth={1} />
                <text x={lx + 20} y={ly} fontFamily={font} fontSize={11} fill={ink}>
                  {item.label}
                </text>
              </g>
            );
          })
        ) : (
          <>
            {/* Synchronous lane annotations */}
            <text x={x(27.5)} y={lane1 + laneH + 18} fontFamily={font} fontSize={11} fill={ink} textAnchor="middle">
              save pauses training
            </text>
            <text x={x(FAIL_T) - 6} y={lane1 + laneH + 18} fontFamily={font} fontSize={11} fill={red} textAnchor="end">
              lost work
            </text>
            <text x={x(FAIL_T) + 6} y={lane1 + laneH + 18} fontFamily={font} fontSize={11} fill={muted}>
              restart and load
            </text>

            {/* Asynchronous lane annotations */}
            <line
              x1={x(ASYNC_SAVES[0] + ASYNC_PAUSE / 2)}
              y1={lane2 + laneH}
              x2={x(ASYNC_SAVES[0] + ASYNC_PAUSE / 2)}
              y2={drainY + drainH + 8}
              stroke={muted}
              strokeWidth={1}
            />
            <text
              x={x(ASYNC_SAVES[0] + ASYNC_PAUSE / 2)}
              y={drainY + drainH + 20}
              fontFamily={font}
              fontSize={11}
              fill={ink}
              textAnchor="middle"
            >
              copy pauses briefly
            </text>
            <line
              x1={x(ASYNC_SAVES[2] + ASYNC_PAUSE + ASYNC_DRAIN / 2)}
              y1={drainY + drainH}
              x2={x(ASYNC_SAVES[2] + ASYNC_PAUSE + ASYNC_DRAIN / 2)}
              y2={drainY + drainH + 8}
              stroke={muted}
              strokeWidth={1}
            />
            <text
              x={x(ASYNC_SAVES[2] + ASYNC_PAUSE + ASYNC_DRAIN / 2)}
              y={drainY + drainH + 20}
              fontFamily={font}
              fontSize={11}
              fill="#1f7a70"
              textAnchor="middle"
            >
              background write
            </text>
            <text x={x(FAIL_T) - 6} y={drainY + drainH + 20} fontFamily={font} fontSize={11} fill={red} textAnchor="end">
              less lost work
            </text>
            <text x={x(FAIL_T) + 6} y={drainY + drainH + 20} fontFamily={font} fontSize={11} fill={muted}>
              same restart and load
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Tables                                                                   */
/* ------------------------------------------------------------------------ */

const cell: CSSProperties = {
  padding: '6px 8px',
  borderBottom: '1px solid #e9ebed',
  textAlign: 'left',
  verticalAlign: 'top',
};
const headCell: CSSProperties = { ...cell, fontWeight: 700, borderBottom: '2px solid #d1d5db' };

function IntervalTable() {
  const rows: Array<{ job: ReactNode; interval: string; ettr: string }> = [
    {
      job: '256 GPUs (32 nodes), 60 s synchronous save',
      interval: `${hours(W_SYNC.intervalSeconds)} hours, ${fmt(W_SYNC.intervalSteps)} steps of ${fmt(REF_STEP_SECONDS, 1)} s`,
      ettr: W_SYNC.ettr.toFixed(3),
    },
    {
      job: '256 GPUs, asynchronous save assumed to block 2 s',
      interval: `${minutes(W_ASYNC.intervalSeconds)} minutes, ${fmt(W_ASYNC.intervalSteps)} steps`,
      ettr: W_ASYNC.ettr.toFixed(3),
    },
    {
      job: '16,384 GPUs (2,048 nodes), 60 s save',
      interval: `${minutes(W16_60.intervalSeconds)} minutes`,
      ettr: W16_60.ettr.toFixed(2),
    },
    {
      job: '16,384 GPUs, 2 s save',
      interval: `${minutes(W16_2.intervalSeconds)} minutes`,
      ettr: W16_2.ettr.toFixed(2),
    },
    {
      job: '16,384 GPUs, 2 s save, restart cut to 5 minutes',
      interval: `${minutes(W16_2_FAST.intervalSeconds)} minutes`,
      ettr: W16_2_FAST.ettr.toFixed(2),
    },
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>Job and save</th>
            <th style={headCell}>Interval dt*</th>
            <th style={headCell}>Expected ETTR</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={String(r.job)}>
              <td style={cell}>{r.job}</td>
              <td style={cell}>{r.interval}</td>
              <td style={cell}>{r.ettr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function E4Table() {
  const rows: Array<{ call: ReactNode; blocked: string; after: string }> = [
    { call: <code>dcp.save</code>, blocked: '4.35, 2.54, 2.60', after: 'Nothing: the save is complete when the call returns' },
    {
      call: (
        <>
          <code>async_save</code>, no stager
        </>
      ),
      blocked: '35.86, 36.20, 8.81',
      after: 'The write to disk; finished at 38.43, 41.75 and 12.16 s',
    },
    {
      call: (
        <>
          <code>async_save</code>, pinned stager, thread
        </>
      ),
      blocked: '0.0009, 0.0007, 0.0008',
      after: 'Staging, done at 2.52, 2.86 and 0.14 s, then the write; finished at 7.07, 5.39 and 2.59 s',
    },
    {
      call: (
        <>
          <code>async_save</code>, pinned and shared-memory stager, separate process (TorchTitan&apos;s
          pinned mode)
        </>
      ),
      blocked: '0.039, 0.0006, 0.0010',
      after: 'Staging, done at 1.07, 0.07 and 0.07 s, then the write; finished at 8.44, 2.60 and 2.49 s',
    },
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>Save call</th>
            <th style={headCell}>Training blocked, s (saves 1, 2, 3)</th>
            <th style={headCell}>What runs after the call returns</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.blocked}>
              <td style={cell}>{r.call}</td>
              <td style={cell}>{r.blocked}</td>
              <td style={cell}>{r.after}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Calculator D                                                             */
/* ------------------------------------------------------------------------ */

type RateId = 'rsc2' | 'rsc1' | 'rsc1WorstMonth' | 'custom';

interface CalcForm {
  model: DenseModelId;
  row: OptimizerRowId;
  saveWorking: boolean;
  nodes: string;
  rate: RateId;
  customRate: string;
  step: string;
  mode: SaveMode;
  blocking: string;
  restartMin: string;
  drain: string;
  tier: FsxTier;
}

const BASE_FORM: CalcForm = {
  model: 'llama-3.1-70b',
  row: 'adamMixed',
  saveWorking: true,
  nodes: '32',
  rate: 'rsc1',
  customRate: '5',
  step: fmt(REF_STEP_SECONDS, 1),
  mode: 'synchronous',
  blocking: '60',
  restartMin: '10',
  drain: '',
  tier: 1000,
};

const CALC_PRESETS: Array<{ id: string; label: string; form: CalcForm }> = [
  { id: 'sync60', label: 'Llama 3.1 70B on 256 H100, synchronous 60 s save', form: BASE_FORM },
  {
    id: 'async2',
    label: 'Llama 3.1 70B on 256 H100, asynchronous save assumed to block 2 s',
    form: { ...BASE_FORM, mode: 'asynchronous', blocking: '2' },
  },
];

const MODEL_OPTIONS: Array<{ id: DenseModelId; label: string }> = (
  ['llama-3.1-8b', 'llama-3.1-70b', 'llama-3.1-405b'] as DenseModelId[]
).map((id) => ({ id, label: DENSE_MODELS[id].name }));

const ROW_SHORT: Record<OptimizerRowId, string> = {
  adamMixed: 'AdamW, mixed precision',
  adamBf16MomentsFp32Grads: 'AdamW with BF16 moments',
  adam8bit: '8-bit Adam',
  muon: 'Muon',
  adafactorNoMomentum: 'Adafactor without momentum',
};

const RATE_OPTIONS: Array<{ id: RateId; label: string }> = [
  { id: 'rsc2', label: `${FAILURE_RATES.rsc2.name}: ${FAILURE_RATES.rsc2.value} per thousand node-days` },
  { id: 'rsc1', label: `${FAILURE_RATES.rsc1.name}: ${FAILURE_RATES.rsc1.value.toFixed(2)} per thousand node-days` },
  {
    id: 'rsc1WorstMonth',
    label: `${FAILURE_RATES.rsc1WorstMonth.name}: ${FAILURE_RATES.rsc1WorstMonth.value} per thousand node-days`,
  },
  { id: 'custom', label: 'Your own rate' },
];

const MODE_OPTIONS: Array<{ id: SaveMode; label: string }> = [
  { id: 'synchronous', label: 'Synchronous: the save blocks until written' },
  { id: 'asynchronous', label: 'Asynchronous: copy off the GPU, write in the background' },
];

const TIER_OPTIONS: Array<{ id: FsxTier; label: string }> = [
  { id: 125, label: 'PERSISTENT-125' },
  { id: 250, label: 'PERSISTENT-250' },
  { id: 500, label: 'PERSISTENT-500' },
  { id: 1000, label: 'PERSISTENT-1000' },
];

function selectOf<T extends string | number>(
  options: Array<{ id: T; label: string }>,
  value: T,
): { options: SelectProps.Option[]; selected: SelectProps.Option } {
  const opts = options.map((o) => ({ value: String(o.id), label: o.label }));
  return { options: opts, selected: opts.find((o) => o.value === String(value)) ?? opts[0] };
}

type FieldKey = 'nodes' | 'customRate' | 'step' | 'blocking' | 'restartMin' | 'drain';
type ParseOutcome =
  | { ok: true; input: CheckpointInput; bytesPerParameter: number; nodes: number }
  | { ok: false; errors: Partial<Record<FieldKey, string>> };
type PlanOutcome = { ok: true; result: CheckpointResult } | { ok: false; message: string };

function parsePositive(text: string): number | undefined {
  if (!/^\s*\d*\.?\d+\s*$/.test(text)) return undefined;
  const n = Number(text);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function parseForm(f: CalcForm): ParseOutcome {
  const errors: Partial<Record<FieldKey, string>> = {};
  const nodes = /^\s*\d+\s*$/.test(f.nodes) && Number(f.nodes) >= 1 ? Number(f.nodes) : undefined;
  if (nodes === undefined) errors.nodes = 'Nodes must be a whole number of 1 or more';
  const rate = f.rate === 'custom' ? parsePositive(f.customRate) : FAILURE_RATES[f.rate].value;
  if (rate === undefined) errors.customRate = 'Enter a failure rate above 0';
  const step = parsePositive(f.step);
  if (step === undefined) errors.step = 'Step time must be above 0 seconds';
  const blocking = parsePositive(f.blocking);
  if (blocking === undefined) errors.blocking = 'Blocking time must be above 0 seconds';
  const restartMin = /^\s*\d*\.?\d+\s*$/.test(f.restartMin) ? Number(f.restartMin) : undefined;
  if (restartMin === undefined || !Number.isFinite(restartMin)) errors.restartMin = 'Restart time must be 0 minutes or more';
  let drain: number | undefined;
  if (f.mode === 'asynchronous' && f.drain.trim() !== '') {
    drain = parsePositive(f.drain);
    if (drain === undefined) errors.drain = 'Leave empty for the interval, or enter seconds above 0';
  }
  if (Object.keys(errors).length > 0 || nodes === undefined || rate === undefined || step === undefined || blocking === undefined || restartMin === undefined) {
    return { ok: false, errors };
  }
  const bytesPerParameter = checkpointBytesPerParameter(f.row, { saveWorkingWeights: f.saveWorking });
  const size = checkpointSize({
    parameters: DENSE_MODELS[f.model].totalParameters.value,
    bytesPerParameter,
    ranks: nodes * GPUS_PER_NODE,
  });
  return {
    ok: true,
    bytesPerParameter,
    nodes,
    input: {
      checkpointBytes: size.totalBytes,
      nodes,
      failuresPerThousandNodeDays: rate,
      stepSeconds: step,
      saveMode: f.mode,
      blockingSeconds: blocking,
      restartSeconds: restartMin * 60,
      drainBudgetSeconds: drain,
      fsxTier: f.tier,
    },
  };
}

function runPlan(input: CheckpointInput): PlanOutcome {
  try {
    return { ok: true, result: checkpointPlan(input) };
  } catch (e) {
    if (e instanceof RangeError) return { ok: false, message: e.message };
    throw e;
  }
}

function durationText(seconds: number): string {
  if (seconds < 120) return `${fmt(seconds, 0)} s`;
  if (seconds < 3_600) return `${minutes(seconds)} minutes`;
  if (seconds < 2 * 86_400) return `${hours(seconds)} hours`;
  return `${fmt(seconds / 86_400, 1)} days`;
}

function CheckpointCalculator() {
  const [presetId, setPresetId] = useState(CALC_PRESETS[0].id);
  const [form, setForm] = useState<CalcForm>(CALC_PRESETS[0].form);
  const set = <K extends keyof CalcForm>(key: K, value: CalcForm[K]) => setForm((f) => ({ ...f, [key]: value }));

  const parsed = useMemo(() => parseForm(form), [form]);
  const outcome = useMemo<PlanOutcome | undefined>(() => (parsed.ok ? runPlan(parsed.input) : undefined), [parsed]);
  const err = (key: FieldKey) => (parsed.ok ? undefined : parsed.errors[key]);

  const presetSel = selectOf(
    CALC_PRESETS.map((p) => ({ id: p.id, label: p.label })),
    presetId,
  );
  const modelSel = selectOf(MODEL_OPTIONS, form.model);
  const rowOptions = (Object.keys(OPTIMIZER_ROWS) as OptimizerRowId[]).map((id) => ({
    id,
    label: `${ROW_SHORT[id]}: ${checkpointBytesPerParameter(id, { saveWorkingWeights: form.saveWorking })} bytes per parameter`,
  }));
  const rowSel = selectOf(rowOptions, form.row);
  const rateSel = selectOf(RATE_OPTIONS, form.rate);
  const modeSel = selectOf(MODE_OPTIONS, form.mode);
  const tierSel = selectOf(TIER_OPTIONS, form.tier);

  const numberField = (key: FieldKey, formKey: keyof CalcForm, label: string, description?: ReactNode, disabled?: boolean) => (
    <FormField label={label} description={description} errorText={err(key)}>
      <Input
        type="number"
        inputMode="decimal"
        value={form[formKey] as string}
        disabled={disabled}
        onChange={({ detail }) => set(formKey, detail.value as never)}
      />
    </FormField>
  );

  return (
    <SpaceBetween size="m">
      <FormField label="Start from a worked case" description="Sets every input below; change any of them afterwards.">
        <Select
          selectedOption={presetSel.selected}
          options={presetSel.options}
          onChange={({ detail }) => {
            const p = CALC_PRESETS.find((c) => c.id === detail.selectedOption.value);
            if (!p) return;
            setPresetId(p.id);
            setForm(p.form);
          }}
        />
      </FormField>

      <ColumnLayout columns={3}>
        <FormField label="Model">
          <Select
            selectedOption={modelSel.selected}
            options={modelSel.options}
            onChange={({ detail }) => set('model', detail.selectedOption.value as DenseModelId)}
          />
        </FormField>
        <FormField label="Optimizer" description="Bytes saved per parameter; gradients are not saved">
          <Select
            selectedOption={rowSel.selected}
            options={rowSel.options}
            onChange={({ detail }) => set('row', detail.selectedOption.value as OptimizerRowId)}
          />
        </FormField>
        <FormField label="BF16 working weights" description="Saved beside the FP32 master copy">
          <Toggle checked={form.saveWorking} onChange={({ detail }) => set('saveWorking', detail.checked)}>
            {form.saveWorking ? 'Saved' : 'Not saved'}
          </Toggle>
        </FormField>
        {numberField('nodes', 'nodes', 'Nodes', `${GPUS_PER_NODE} GPUs each, as on a p5.48xlarge`)}
        <FormField label="Failure rate" description="Section 17's presets, measured on Meta's research clusters">
          <Select
            selectedOption={rateSel.selected}
            options={rateSel.options}
            onChange={({ detail }) => set('rate', detail.selectedOption.value as RateId)}
          />
        </FormField>
        {numberField(
          'customRate',
          'customRate',
          'Your failure rate, per thousand node-days',
          'Used when the failure rate is set to your own',
          form.rate !== 'custom',
        )}
        {numberField('step', 'step', 'Step time, s', 'An assumption: estimate; confirm with a measured step')}
        <FormField label="Save mode">
          <Select
            selectedOption={modeSel.selected}
            options={modeSel.options}
            onChange={({ detail }) => set('mode', detail.selectedOption.value as SaveMode)}
          />
        </FormField>
        {numberField(
          'blocking',
          'blocking',
          'Blocking time w_cp, s',
          'Seconds a save stops training. An assumption: estimate; confirm with a measured step',
        )}
        {numberField(
          'restartMin',
          'restartMin',
          'Restart time u_0, minutes',
          'Failure to training again, load included. An assumption: estimate; confirm with a measured step',
        )}
        {numberField(
          'drain',
          'drain',
          'Drain budget, s (asynchronous)',
          'Seconds the storage has to absorb one save; leave empty for the interval',
          form.mode !== 'asynchronous',
        )}
        <FormField label="FSx for Lustre tier" description="Disk throughput per TiB provisioned">
          <Select
            selectedOption={tierSel.selected}
            options={tierSel.options}
            onChange={({ detail }) => set('tier', Number(detail.selectedOption.value) as FsxTier)}
          />
        </FormField>
      </ColumnLayout>

      <CalculatorResult parsed={parsed} outcome={outcome} />
    </SpaceBetween>
  );
}

function CalculatorResult({ parsed, outcome }: { parsed: ParseOutcome; outcome: PlanOutcome | undefined }) {
  if (!parsed.ok || !outcome) {
    return <Box color="text-status-error">Correct the highlighted fields to see the plan.</Box>;
  }
  if (!outcome.ok) {
    return <Box color="text-status-error">This combination is not valid: {outcome.message}.</Box>;
  }
  const r = outcome.result;
  const bytes = parsed.input.checkpointBytes;
  const fsx = r.storage.fsx;
  return (
    <SpaceBetween size="s">
      <Box variant="h3">The plan for this run</Box>
      {r.warnings.length === 0 ? (
        <StatusIndicator type="success">Inside the regime in which Meta checked the formula</StatusIndicator>
      ) : (
        r.warnings.map((w) => (
          <StatusIndicator key={w.code} type="warning">
            {w.message}
          </StatusIndicator>
        ))
      )}
      <KeyValuePairs
        columns={3}
        items={[
          {
            label: 'Checkpoint',
            value: `${gbText(bytes, 1)} at ${parsed.bytesPerParameter} bytes per parameter; ${gbText(
              bytes / (parsed.nodes * GPUS_PER_NODE),
            )} per GPU, ${gbText(bytes / parsed.nodes, 1)} per node`,
          },
          { label: 'Job MTTF', value: durationText(r.mttfSeconds) },
          {
            label: 'Interval dt*',
            value: `${durationText(r.intervalSeconds)}, every ${fmt(r.intervalSteps)} steps`,
          },
          { label: 'Expected ETTR', value: r.ettr.toFixed(3) },
          {
            label: 'Storage write target',
            value: `${fmt(r.storage.writeGBps, 2)} GB/s: bytes over the ${r.storage.basis}, ${durationText(r.storage.windowSeconds)}`,
          },
          {
            label: `FSx for Lustre at PERSISTENT-${fsx.tier}`,
            value: `About ${fsx.requiredTiBTwoSignificant} TiB needed; provision ${fmt(fsx.provisionedGiB)} GiB, about $${fmt(
              fsx.usdPerMonth,
            )} a month ($${fmt(fsx.usdPerMonthIfDecimalGB)} if the offer's GB is decimal)`,
          },
          {
            label: 'Amazon S3 at 8 MiB parts',
            value: `${fmt(r.storage.s3.partUploads)} part uploads, ${fmt(r.storage.s3.secondsAtOnePrefix, 1)} s at one prefix's 3,500 PUT per second`,
          },
        ]}
      />
      <Box variant="small" color="text-body-secondary">
        Every output is an {r.label}. GB is 10^9 bytes, GiB 2^30 and TiB
        2^40; FSx figures read AWS&apos;s MBps as 10^6 bytes per second, which AWS does not define, so
        trust two significant digits. Prices are us-east-1 on-demand storage only, read 2026-10-30.
        The storage line sizes for writing; size the file system also for the restart read and for the
        checkpoints you keep.
      </Box>
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function Checkpointing() {
  const odRate = PRICES.find((p) => p.instance === 'p5.48xlarge' && p.path === 'ec2OnDemand')?.usdPerUnitHour.value ?? 0;
  const cbRate = PRICES.find((p) => p.instance === 'p5.48xlarge' && p.path === 'capacityBlock')?.usdPerUnitHour.value ?? 0;
  const hostGiB = 2_048;
  const perNodeBytes = SIZE_70B.totalBytes / 32;
  const tenCopiesTiB = (10 * SIZE_70B.totalBytes) / 2 ** 40;
  const minFsxGBps = (W_ASYNC.storage.fsx.provisionedGiB * GiB) / 2 ** 40;
  const minFsxReadMinutes = SIZE_70B.totalBytes / (minFsxGBps * 1e9) / 60;
  const syncFsxReadSeconds = SIZE_70B.totalBytes / (((W_SYNC.storage.fsx.provisionedGiB * GiB) / 2 ** 40) * 1e9);

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Pick a checkpoint interval and a storage size from your node count and your save time: for Llama 3.1 70B on 256 H100 GPUs, about 2 hours between 60 s saves or 21.5 minutes between asynchronous saves that block 2 s (PyTorch v2.15.0, TorchTitan v0.4.0 and Megatron Core core_v0.20.0, read 2026-10-31, and our DGX Spark run)"
          >
            18. Checkpointing
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A checkpoint is a copy of everything a run needs to continue, written to storage while the
            run goes on. A synchronous training job stops whenever any one of its nodes fails (section
            17, Failure Is the Steady State), and every stop rolls the run back to its newest complete
            checkpoint, so the checkpoint decides how much each failure costs.
          </Box>
          <Box variant="p">
            The challenge is three costs that pull against each other. Saving more often loses less
            work per failure, but each save that pauses training costs time. A faster save needs more
            storage bandwidth. And a restart must read the checkpoint back before anything runs. This
            section sizes all three for one reference job, Llama 3.1 70B on 32 Amazon EC2 (Elastic
            Compute Cloud) p5.48xlarge instances with 256 H100 GPUs, then hands you a calculator for
            your own.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Count your checkpoint before you size anything: about 14 bytes per parameter, 988 GB for Llama 3.1 70B, plus small states that decide whether a resumed run is the same run"
          >
            What a checkpoint holds
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Mixed-precision training with the Adam optimizer keeps 16 bytes of model state per
            parameter: 2 for the BF16 (bfloat16) weights, 2 for their gradients and 12 of optimizer
            state, an FP32 (32-bit floating point) master copy of the weights plus Adam&apos;s two moments, running
            averages of each gradient and of its square{' '}
            <Cite tier={3} href={ZERO} venue="preprint">
              ZeRO (Zero Redundancy Optimizer), Section 3.1
            </Cite>
            . A step recomputes the gradients from scratch, so a checkpoint leaves them out:
            TorchTitan&apos;s checkpoint manager names five states, plus an optional moving average of
            the weights, and none is a gradient{' '}
            <Cite tier={1} href={TT_STATE_KEYS} kind="code">
              TorchTitan v0.4.0 checkpointer/base.py L36-L41
            </Cite>
            . That leaves 12 to 14 bytes per parameter in our reading of those components: 14 when the
            BF16 weights are saved beside the FP32 master, 12 when the master is the only weight copy.
          </Box>
          <Box variant="p">
            Llama 3.1 70B has 70,553,706,496 parameters{' '}
            <Cite tier={1} href={HF_LLAMA_70B}>
              Meta&apos;s Llama 3.1 70B model metadata
            </Cite>
            , so its checkpoint is <strong>{gbText(SIZE_70B.totalBytes)} at 14 bytes</strong> (
            {gbText(SIZE_70B_12.totalBytes, 1)} at 12): {gbText(SIZE_70B.perRankBytes)} per GPU on 256
            GPUs, {gbText(perNodeBytes, 1)} per instance (our arithmetic). Published runs sit on the same
            scale. OPT-175B&apos;s team downloaded 1.6 TB in 992 files of about 1.7 GB on each restart{' '}
            <Cite tier={2} href={OPT_NOTES}>
              OPT-175B logbook notes, 27% update
            </Cite>
            , and Llama 3&apos;s checkpoint ran from 1 MB to 4 GB per GPU{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.1
            </Cite>
            .
          </Box>
          <Box variant="p">
            The rest of the checkpoint is a small fraction of the bytes and decides whether the resumed
            run is the same run: the data loader&apos;s position, including its buffer of tokens not
            yet packed into a sequence, the learning-rate scheduler, the step counter and the random
            number generator (RNG) states{' '}
            <Cite tier={3} href={BYTECHECKPOINT} venue="NSDI 2025" accessed={REGISTER_DATE}>
              ByteCheckpoint, Section 2.1
            </Cite>
            . Frameworks differ on the last item. TorchTitan v0.4.0 saves the model, the optimizer, the
            data loader, the scheduler and a train state of step count and tokens seen; no RNG state
            appears in its checkpoint manager{' '}
            <Cite tier={1} href={TT_STATE_KEYS} kind="code">
              TorchTitan v0.4.0 checkpointer/base.py L36-L41
            </Cite>
            . Section 19, Resuming Correctly, turns these states into a run that resumes where it
            stopped.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Set the interval from two numbers you can measure, the time a save blocks training and the job's failure rate: 2.0 hours between 60 s saves and 21.5 minutes between 2 s saves for the 70B job"
          >
            How often to save
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each save costs its blocking time, <code>w_cp</code>, the seconds training waits for it. Each
            failure costs a restart, <code>u_0</code>, which includes reading the checkpoint back, plus
            the work done since the last save, on average half an interval. The timeline draws both
            costs for one failure.
          </Box>
          <SaveTimelineDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured: pauses, intervals and the restart are drawn to show the trade,
            not to scale.
          </Box>
          <Box variant="p">
            The interval that balances the two is the classic Young and Daly result,{' '}
            <code>dt* = sqrt(2 w_cp / (N_nodes x r_f))</code>, with <code>r_f</code> the failures per
            node-day, so that <code>N_nodes x r_f</code> is the job&apos;s failure rate and its inverse
            the job&apos;s MTTF (mean time to failure){' '}
            <Cite tier={3} href={META_RELIABILITY} venue="preprint">
              Revisiting Reliability in Large-Scale ML Research Clusters, Eq. 3
            </Cite>
            . The same study estimates ETTR (effective training time ratio, productive time over
            wallclock) as{' '}
            <code>E[ETTR] ~ (1 - N_nodes r_f (u_0 + dt/2)) / (1 + w_cp / dt)</code> for long,
            high-priority runs{' '}
            <Cite tier={3} href={META_RELIABILITY} venue="preprint">
              Revisiting Reliability, Appendix A, Eq. 10
            </Cite>
            . The interval grows with the square root of the save&apos;s cost, so a save 30 times cheaper
            wants an interval about 5.5 times shorter.
          </Box>
          <Box variant="p">
            For the 70B job on 32 nodes, at the 6.50 failures per thousand node-days Meta measured on its
            RSC-1 cluster{' '}
            <Cite tier={3} href={META_RELIABILITY} venue="preprint">
              Revisiting Reliability, Section III
            </Cite>
            , the job&apos;s MTTF is {fmt(W_SYNC.mttfDays, 1)} days. With a 10-minute restart, inside the 5
            to 20 minutes Meta gives for its clusters{' '}
            <Cite tier={3} href={META_RELIABILITY} venue="preprint">
              Revisiting Reliability, Section III
            </Cite>
            , and a step time of {fmt(REF_STEP_SECONDS, 1)} s (Calculator A in section 4, Counting the
            Arithmetic, for 512 sequences of 8,192 tokens per step at an assumed 40% MFU, model FLOPs
            utilization), the interval is:
          </Box>
          <IntervalTable />
          <Box variant="p">
            <strong>
              At 256 GPUs the save design moves the interval by a factor of 5.5, from{' '}
              {hours(W_SYNC.intervalSeconds)} hours to {minutes(W_ASYNC.intervalSeconds)} minutes, and
              ETTR by about {fmt(100 * (W_ASYNC.ettr - W_SYNC.ettr), 1)} points
            </strong>
            , {W_SYNC.ettr.toFixed(3)} against {W_ASYNC.ettr.toFixed(3)}. An asynchronous save, one that
            copies state off the GPU and writes it in the background, buys mainly a shorter interval and
            less work lost per failure. The interval also moves with the failure rate:{' '}
            {hours(W_WORST.intervalSeconds)} hours in RSC-1&apos;s worst month, at{' '}
            {FAILURE_RATES.rsc1WorstMonth.value} failures per thousand node-days, and{' '}
            {hours(W_RSC2.intervalSeconds)} hours at RSC-2&apos;s {FAILURE_RATES.rsc2.value}, so plan for
            the bad month. At 16,384 GPUs the MTTF falls to {fmt(W16_60.mttfHours, 1)} hours and restart
            time decides the outcome: with saves free, a 10-minute restart alone caps ETTR near 0.91 (our
            arithmetic: 600 s against the {fmt(W16_60.mttfHours, 1)}-hour MTTF), which is why{' '}
            {W16_2_FAST.ettr.toFixed(2)} needs the restart cut to 5 minutes as well.
          </Box>
          <Box variant="p">
            Read the 16,384-GPU rows as indicative. Their {fmt(W16_60.mttfHours, 1)}-hour MTTF is below
            the regime in which Meta checked the approximation against a Monte Carlo estimate (a job MTTF
            of about 0.1 day or more, where it held to about 5%), and their intervals of{' '}
            {minutes(W16_2.intervalSeconds)} to {minutes(W16_60.intervalSeconds)} minutes are under three
            times the 10-minute restart, while the derivation assumes an interval much longer than the
            restart{' '}
            <Cite tier={3} href={META_RELIABILITY} venue="preprint">
              Revisiting Reliability, Section III and Appendix A
            </Cite>
            . The 256-GPU asynchronous interval is also under three restart times, and the calculator
            below flags it.
          </Box>
          <ExpandableSection headerText="Where the formula comes from, and how far to trust it">
            <SpaceBetween size="s">
              <Box variant="p">
                Young (1974) and Daly (2006) are the primary sources for the interval. Both sit behind
                publisher access, so this section cites the formula through Meta&apos;s statement and
                derivation, whose reference list names both papers{' '}
                <Cite tier={3} href={META_RELIABILITY} venue="preprint">
                  Revisiting Reliability, Eq. 3 and its references
                </Cite>
                . Appendix A lists the assumptions behind it: the interval much longer than the
                restart, the save and the queue time, and the run much longer than all of them.
              </Box>
              <Box variant="p">
                Dropping the square-root shortcut moves the arithmetic little. Maximising the ETTR
                expression directly for the 16,384-GPU, 60 s row gives an interval of 783 s in place of
                883 s, and an ETTR of 0.787 in place of 0.786 (our arithmetic). The warning is about the
                model&apos;s regime: the analytic estimate was checked against simulation only down to
                about a 0.1-day MTTF.
              </Box>
              <Box variant="p">
                The failure rates count jobs above 128 GPUs that ended with a node failure, or failed
                with a critical health check in the 10 minutes before the end{' '}
                <Cite tier={3} href={META_RELIABILITY} venue="preprint">
                  Revisiting Reliability, Section III
                </Cite>
                ; section 17 explains why they are an order-of-magnitude planning aid rather than a
                prediction for your cluster.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Turn the save into a write rate, then into FSx for Lustre capacity or an S3 layout, and check that the same storage reads the checkpoint back within the restart you assumed"
          >
            The storage a save needs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A synchronous save has to land inside its blocking time, so the storage must absorb the
            checkpoint bytes over <code>w_cp</code>: {fmt(W_SYNC.storage.writeGBps, 1)} GB/s for a 60 s
            save of the 988 GB checkpoint, about {fmt(W_SYNC.storage.writeGBps / 32, 2)} GB/s or{' '}
            {fmt((W_SYNC.storage.writeGBps / 32) * 8, 1)} Gbps per instance (our arithmetic). An
            asynchronous save gives the storage until the next save to drain host memory, so the target
            becomes bytes over a drain budget no longer than the interval:{' '}
            {fmt(W_ASYNC.storage.writeGBps, 2)} GB/s for the {minutes(W_ASYNC.intervalSeconds)}-minute
            interval. Until that background write finishes, the newest complete checkpoint is the
            previous one, which is why the budget stays inside one interval (our reading of both
            designs).
          </Box>
          <Box variant="p">
            On Amazon FSx for Lustre (AWS&apos;s managed Lustre parallel file system; section 23, Storage
            for Training) bandwidth is bought with capacity. Each TiB provisioned on SSD gives 125, 250,
            500 or 1,000 MBps of disk throughput, by tier{' '}
            <Cite tier={1} href={FSX_SSD}>
              FSx for Lustre user guide, SSD performance
            </Cite>
            , and writes run at the lower of network and disk throughput{' '}
            <Cite tier={1} href={FSX_PERF}>
              FSx for Lustre user guide, performance
            </Cite>
            . At PERSISTENT-1000, the 1,000 MBps-per-TiB tier, the 60 s save needs about{' '}
            {W_SYNC.storage.fsx.requiredTiBTwoSignificant} TiB. SSD capacity comes as 1,200 GiB, 2,400
            GiB, then steps of 2,400 GiB{' '}
            <Cite tier={1} href={FSX_SIZES}>
              FSx API reference, CreateFileSystem
            </Cite>
            , so the file system is {fmt(W_SYNC.storage.fsx.provisionedGiB)} GiB (16,800 GiB if
            AWS&apos;s MB were binary): on the order of $10,000 to $12,000 a month at $0.600 per GB-month
            in us-east-1{' '}
            <Cite tier={1} href={FSX_PRICE} accessed={REGISTER_DATE}>
              AWS Price List, AmazonFSx us-east-1, offer 20260911124432
            </Cite>
            . AWS does not define the MB in bytes on the pages read, so these figures carry two
            significant digits. Size writes on baseline disk throughput: the documented burst is for
            reads, and PERSISTENT-1000 lists none{' '}
            <Cite tier={1} href={FSX_SSD}>
              FSx for Lustre user guide, SSD performance
            </Cite>
            .
          </Box>
          <Box variant="p">
            The per-instance need sits far under the per-client ceilings, 100 Gbps from a file system
            without EFA (Elastic Fabric Adapter) and 700 Gbps over EFA{' '}
            <Cite tier={1} href={FSX_PERF}>
              FSx for Lustre user guide, throughput to individual clients
            </Cite>
            : the file system&apos;s aggregate throughput is what binds. At{' '}
            {fmt(W_SYNC.storage.writeGBps, 1)} GB/s the file system is also above the 10 GBps at which
            AWS recommends enabling EFA on it{' '}
            <Cite tier={1} href={FSX_PERF}>
              FSx for Lustre user guide, performance
            </Cite>
            ; the <Link href="../efa/">EFA dive, section 13: Storage Data Paths: FSx, S3 and the Common Runtime</Link>{' '}
            covers that path.
          </Box>
          <Box variant="p">
            <strong>Save is asynchronous; load is not.</strong> A restart reads the whole checkpoint
            back before the first step, and an uncached read also runs at the lower of network and disk
            throughput{' '}
            <Cite tier={1} href={FSX_PERF}>
              FSx for Lustre user guide, performance
            </Cite>
            . The asynchronous design&apos;s 0.77 GB/s fits the smallest file system,{' '}
            {fmt(W_ASYNC.storage.fsx.provisionedGiB)} GiB, but at about {fmt(minFsxGBps, 1)} GB/s that file
            system reads 988 GB in about {fmt(minFsxReadMinutes, 0)} minutes, longer than the whole
            10-minute restart the interval assumed; the {fmt(W_SYNC.storage.fsx.provisionedGiB)} GiB one
            reads it in about {fmt(syncFsxReadSeconds, 0)} s (our arithmetic, two significant digits).
            Retention sets a third floor: TorchTitan keeps the latest 10 checkpoints by default{' '}
            <Cite tier={1} href={TT_KEEP} kind="code">
              TorchTitan v0.4.0 checkpointer/base.py L580
            </Cite>
            , about {fmt(tenCopiesTiB, 0)} TiB for this model. Size the file system for the largest of the
            three: the write rate, the read rate your restart allows, and the checkpoints you keep.
          </Box>
          <Box variant="p">
            On Amazon S3 (Simple Storage Service) the request rate sets the floor. S3 sustains at least
            3,500 PUT requests per second per partitioned prefix and scales past that gradually,
            answering 503 Slow Down while it scales{' '}
            <Cite tier={1} href={S3_PERF}>
              Amazon S3 user guide, optimizing performance
            </Cite>
            . The S3 Connector for PyTorch v1.5.0 uploads in 8 MiB parts by default{' '}
            <Cite tier={1} href={S3_PART_SIZE} kind="code">
              s3torchconnector v1.5.0 s3client_config.py L14-L26
            </Cite>
            , so one 70B checkpoint is {fmt(W_SYNC.storage.s3.partUploads)} part uploads, each a PUT in
            our reading, about {fmt(W_SYNC.storage.s3.secondsAtOnePrefix, 0)} s of one prefix&apos;s
            documented rate. Its checkpoint writer defaults to one I/O thread per rank{' '}
            <Cite tier={1} href={S3_WRITER} kind="code">
              s3torchconnector v1.5.0 dcp/s3_file_system.py L271-L303
            </Cite>{' '}
            and by default names each rank&apos;s objects <code>__{'{rank}'}_</code>{' '}
            <Cite tier={1} href={S3_PREFIX_DEFAULT} kind="code">
              s3_prefix_strategy.py L25-L31
            </Cite>
            , a name that sits under the checkpoint&apos;s shared path and so does not by itself spread
            the writes over partitions (our reading of the code). Its round-robin, binary and
            hexadecimal prefix strategies do, to avoid the 503 throttling{' '}
            <Cite tier={1} href={S3_PREFIX_README}>
              s3torchconnector v1.5.0 README L197-L205
            </Cite>
            . S3 Express One Zone&apos;s directory buckets take up to 100,000 writes per second by default{' '}
            <Cite tier={1} href={S3_EXPRESS}>
              Amazon S3 user guide, S3 Express One Zone performance
            </Cite>
            , about {fmt(W_SYNC.storage.s3.partUploads / 100_000, 1)} s for the same parts (our
            arithmetic).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Get the copy off the critical path with one explicit setting per framework: called bare, PyTorch's async_save blocked our GB10 for 35.86 s, and with a pinned stager for about a millisecond"
          >
            Asynchronous and tiered saves in code
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            PyTorch DCP (PyTorch Distributed Checkpoint) is the format most of these tools build on.
            Every rank saves its own shard in parallel, at least one file per rank, and the loader
            reshards, so a checkpoint saved under one parallel layout loads into another{' '}
            <Cite tier={1} href={DCP_DOC}>
              PyTorch v2.15.0 distributed.checkpoint docs L8-L14
            </Cite>
            . Its <code>async_save</code> splits a save in two: a staging copy from GPU memory to host
            memory, then the ordinary save in a background thread or process. Only the staging copy
            needs to block training, and that is the asynchronous save the interval arithmetic above
            assumed.
          </Box>
          <Box variant="p">
            Called bare, <code>async_save</code> does all of its staging before it returns. Without a
            stager argument it builds <code>DefaultStager(StagingOptions(False, False, False, False))</code>
            : no pinned memory, no shared memory, synchronous staging and blocking copies{' '}
            <Cite tier={1} href={SAVER_DEFAULT_STAGER} kind="code">
              PyTorch v2.15.0 state_dict_saver.py L306-L321
            </Cite>
            , while <code>StagingOptions</code> itself defaults all four to True{' '}
            <Cite tier={1} href={STAGING_OPTIONS} kind="doc-code-conflict">
              PyTorch v2.15.0 staging.py L104-L130
            </Cite>
            . DCP&apos;s own <code>FileSystemWriter</code>, which the S3 connector&apos;s writer extends,
            is a blocking stager, so every bare path blocks for the copy{' '}
            <Cite tier={1} href={FS_WRITER_STAGER} kind="code">
              PyTorch v2.15.0 filesystem.py L973
            </Cite>
            . On one GB10, saving a 4.03 GB state dict, the bare call blocked training for 35.86, 36.20
            and 8.81 s in three saves, longer than a synchronous <code>dcp.save</code> of the same bytes
            (4.35, 2.54 and 2.60 s); with a pinned stager it returned in about a millisecond while
            staging finished in the background{' '}
            <Cite tier={0} href={E4_URL}>
              {E4_TITLE}
            </Cite>
            . The GB10 shares one memory between CPU and GPU, so these timings do not transfer to an H100
            in a p5.48xlarge; the API behaviour does.
          </Box>
          <Box variant="p">
            TorchTitan v0.4.0 defaults to <code>disabled</code>, a synchronous <code>dcp.save</code>{' '}
            <Cite tier={1} href={TT_MODE_DEFAULT} kind="code">
              TorchTitan v0.4.0 checkpointer/dcp.py L138
            </Cite>
            . Its <code>async</code> mode calls <code>async_save</code> with no stager, and its{' '}
            <code>async_with_pinned_mem</code> mode runs the save in a separate process{' '}
            <Cite tier={1} href={TT_DISPATCH} kind="code">
              dcp.py L317-L338
            </Cite>{' '}
            with a <code>DefaultStager</code> that turns pinned memory, shared memory, asynchronous staging
            and non-blocking copies on{' '}
            <Cite tier={1} href={TT_STAGER} kind="code">
              dcp.py L453-L474
            </Cite>
            . It waits for the staging copy at the start of the next optimizer step{' '}
            <Cite tier={1} href={TT_FENCE} kind="code">
              TorchTitan v0.4.0 training_engine.py L872-L876
            </Cite>
            , the first moment the weights being copied would change, which is what lets the copy hide
            behind a forward and backward pass.
          </Box>
          <Box variant="p">
            Megatron Core&apos;s <code>--async-save</code> is off by default, and at core_v0.20.0 it is
            switched off again, with only a rank-0 warning, for distributed checkpoints unless{' '}
            <code>--use-persistent-ckpt-worker</code> is also set{' '}
            <Cite tier={1} href={MG_ASYNC_OFF} kind="code">
              Megatron Core core_v0.20.0 arguments.py L1808-L1814
            </Cite>
            . The flag&apos;s docstring says async save works only with the <code>torch_dist</code> format{' '}
            <Cite tier={1} href={MG_ASYNC_DOC} kind="doc-code-conflict">
              training_config.py L551-L552
            </Cite>
            , while the validation beside it also accepts <code>torch_dcp</code> and{' '}
            <code>fsdp_dtensor</code> when NVIDIA Resiliency Extension is installed{' '}
            <Cite tier={1} href={MG_ASYNC_NVRX} kind="code">
              training_config.py L692-L699
            </Cite>
            ; the code governs. After an upgrade, check the rank-0 log for &quot;Disabling
            --async-save&quot;.
          </Box>
          <Box variant="p">
            Production systems add a tier in memory. MegaScale copies each GPU&apos;s state to pinned host
            memory in several seconds, the only part on the training critical path, and a background
            process writes it to HDFS (Hadoop Distributed File System); on recovery one worker per
            data-parallel group reads the shared state and broadcasts it to the rest, cutting storage
            reads by the group size{' '}
            <Cite tier={3} href={MEGASCALE} venue="NSDI 2024">
              MegaScale, Section 4.4
            </Cite>
            . Gemini, an in-memory checkpointing system from Rice University and AWS presented at SOSP
            2023 (the Symposium on Operating Systems Principles), also copies each machine&apos;s
            checkpoint into the memory of its peers, in groups of typically two or three machines, so most
            failures recover from RAM and remote storage is the backstop; it schedules that traffic into
            the idle gaps between training collectives{' '}
            <Cite tier={2} href={GEMINI_BLOG}>
              Amazon Science, Gemini authors&apos; post
            </Cite>
            . Its authors report checkpointing every iteration and cutting the training time lost to
            failures by more than 92% against the best baseline{' '}
            <Cite tier={2} href={GEMINI_BLOG} kind="vendor-claim">
              Amazon Science, Gemini authors&apos; post
            </Cite>
            .
          </Box>
          <Box variant="p">
            On AWS that design is SageMaker HyperPod managed tiered checkpointing, generally available
            since 2025-09-08 for HyperPod clusters on the Amazon EKS (Elastic Kubernetes Service)
            orchestrator{' '}
            <Cite tier={1} href={HP_TIERED_GA}>
              AWS What&apos;s New, 2025-09-08
            </Cite>
            . It keeps checkpoints in CPU memory across the cluster&apos;s nodes, replicates them to
            adjacent nodes and persists them to S3{' '}
            <Cite tier={1} href={HP_TIERED}>
              SageMaker HyperPod managed tiered checkpointing
            </Cite>
            ; the cluster opts in and gives it 20 to 100 percent of instance memory{' '}
            <Cite tier={1} href={HP_TIERED_SETUP}>
              SageMaker HyperPod tiered checkpointing setup
            </Cite>
            . A node&apos;s {gbText(perNodeBytes, 1)} share of the 70B checkpoint is{' '}
            {fmt((100 * perNodeBytes) / (hostGiB * GiB), 1)}% of a p5.48xlarge&apos;s 2,048 GiB of host
            memory{' '}
            <Cite tier={1} href={EC2_ACCEL}>
              EC2 accelerated computing instance specifications
            </Cite>
            , so even the 20% minimum holds about {fmt((0.2 * hostGiB * GiB) / perNodeBytes, 0)} copies (our
            arithmetic).
          </Box>
          <Box variant="p">
            AWS&apos;s library for it, <code>amzn-sagemaker-checkpointing</code> 1.1.3, is a DCP storage
            plugin with no process-group code{' '}
            <Cite tier={1} href={HP_LIBRARY} kind="code">
              amzn-sagemaker-checkpointing 1.1.3 source
            </Cite>
            , and AWS&apos;s published example creates a process group with only NCCL (NVIDIA Collective
            Communications Library), the GPU backend, and calls <code>async_save</code> with no stager{' '}
            <Cite tier={1} href={HP_TIERED_SETUP} kind="doc-code-conflict">
              SageMaker HyperPod tiered checkpointing setup, Step 3
            </Cite>
            . PyTorch v2.15.0 rejects that group before the plugin is used{' '}
            <Cite tier={1} href={SAVER_CPU_CHECK} kind="code">
              PyTorch v2.15.0 state_dict_saver.py L299-L304
            </Cite>
            , and our run reproduced the rejection:{' '}
            <code>
              AssertionError: A CPU backend must be enabled for async save; try initializing process group
              with &apos;cpu:gloo,cuda:nccl&apos;
            </code>{' '}
            <Cite tier={0} href={E4_URL}>
              E4: NCCL-only process group on one GB10
            </Cite>
            . With a CPU backend added, the bare call then blocks for the whole device-to-host copy.
            Initialise with <code>&quot;cpu:gloo,cuda:nccl&quot;</code> written out, because at v2.15.0 a
            call with no backend registers only the detected accelerator&apos;s backend in our reading of
            the code{' '}
            <Cite tier={1} href={BACKEND_DEFAULT} kind="code">
              PyTorch v2.15.0 distributed_c10d.py L1056-L1066
            </Cite>
            , and pass a pinned <code>DefaultStager</code>. The example&apos;s state dict holds only the
            model, the optimizer, the step and the epoch{' '}
            <Cite tier={1} href={HP_TIERED_SETUP}>
              SageMaker HyperPod tiered checkpointing setup, Step 3
            </Cite>
            ; add the data loader and the scheduler before relying on it to resume.
          </Box>
          <ExpandableSection headerText="E4: four save calls on one GB10, with the conditions">
            <SpaceBetween size="s">
              <Box variant="p">
                One rank on one GB10 (DGX Spark), PyTorch 2.15.0, process group{' '}
                <code>cpu:gloo,cuda:nccl</code>, a state dict of 30 FP32 tensors totalling 4.03 GB on the
                GPU, saved to local NVMe with DCP&apos;s <code>FileSystemWriter</code>; three saves per
                call in one process, one run{' '}
                <Cite tier={0} href={E4_URL}>
                  {E4_TITLE}
                </Cite>
                .
              </Box>
              <E4Table />
              <Box variant="p">
                The GB10&apos;s CPU and GPU share one memory, so the copy off the GPU is a copy within
                the same memory, and pinned and pageable host memory behave differently than on a
                discrete H100. Other services held about 68 GB of the host&apos;s 121 GB during the run,
                which made the first touch of new pageable memory slow: a reference copy of the same
                bytes into fresh pageable memory took 28.09 s the first time and 0.068 s the second, and
                into pinned memory 0.068 s both times. The default stager allocates fresh pageable memory
                on every save, which is why the bare call was slower than <code>dcp.save</code> here.
                The API behaviour and the error transfer to AWS; the timings do not.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <ExpandableSection headerText="A3 protocol (not yet run)">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>What it would measure.</strong> Blocking time and write throughput of{' '}
                <code>dcp.save</code>, bare <code>async_save</code> and pinned <code>async_save</code>{' '}
                for the Llama 3.1 8B checkpoint, 112 GB at 14 bytes per parameter, to an EFA-enabled FSx
                for Lustre PERSISTENT-1000 file system of 4.8 TiB and to an S3 bucket through the S3
                Connector for PyTorch v1.5.0 (
                <Link external href={GUIDE_URL}>
                  research guide, section 5
                </Link>
                ). It would put an H100 figure on the staging copy that the 2 s assumption above stands
                in for.
              </Box>
              <Box variant="p">
                <strong>On what.</strong> Two p5.48xlarge.
              </Box>
              <Box variant="p">
                <strong>Prediction, our reading and not a result.</strong> The bare call blocks for the
                whole copy and the pinned stager for milliseconds, as on the GB10. A{' '}
                <code>dcp.save</code> to the file system takes at least about 23 s, because 4.8 TiB at
                1,000 MBps per TiB gives about 4.8 GB/s of disk throughput (our arithmetic, two
                significant digits). No staging time is predicted for the H100.
              </Box>
              <Box variant="p">
                <strong>Cost.</strong> About two hours on two instances: 2 x 2 x ${fmt(odRate, 2)} = $
                {fmt(2 * 2 * odRate, 0)} at the On-Demand rate in us-east-1 on 2026-10-30{' '}
                <Cite tier={1} href={EC2_PRICE_LIST} accessed={REGISTER_DATE}>
                  AWS Price List, AmazonEC2 us-east-1, version 20261029175634
                </Cite>
                , once the account&apos;s On-Demand quota for P instances, which starts at 0 vCPUs
                (virtual CPUs), has been raised{' '}
                <Cite tier={1} href={OD_QUOTAS} accessed={REGISTER_DATE}>
                  EC2 On-Demand Instance quotas
                </Cite>
                , plus about $32 to $35 for the file system over 8 hours at $0.600 per GB-month{' '}
                <Cite tier={1} href={FSX_PRICE} accessed={REGISTER_DATE}>
                  AWS Price List, AmazonFSx us-east-1, offer 20260911124432
                </Cite>
                . The research guide shares a 7-hour window with two other experiments: $771 On-Demand,
                or $2,292 for a one-day Capacity Block for two instances at ${fmt(cbRate, 3)} per
                instance-hour in US East (N. Virginia) on 2026-10-30, charged at the price quoted at
                purchase{' '}
                <Cite tier={1} href={CB_PRICING} accessed={REGISTER_DATE}>
                  EC2 Capacity Blocks pricing
                </Cite>
                . Teardown: one stack, deleted at the end; the file system and the bucket do not end
                themselves, so the check lists file systems and confirms the bucket is empty.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Make five settings before the first long run, then enter your node count, failure rate and save time to read off the interval in steps, the expected ETTR and the storage to buy"
          >
            Calculator D: interval and storage for your run
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol>
            <li>
              <strong>Count the checkpoint.</strong> About 14 bytes per parameter for mixed-precision
              Adam, and check that the state dict also carries the data loader, the scheduler and the
              step.
            </li>
            <li>
              <strong>Make the save asynchronous on purpose.</strong> In PyTorch, initialise the process
              group with <code>&quot;cpu:gloo,cuda:nccl&quot;</code> and pass a pinned{' '}
              <code>DefaultStager</code> to <code>async_save</code>; in TorchTitan, set{' '}
              <code>async_with_pinned_mem</code>; in Megatron Core, set <code>--async-save</code> with{' '}
              <code>--use-persistent-ckpt-worker</code> and read the rank-0 log.
            </li>
            <li>
              <strong>Measure the blocking time and the restart time</strong> on one node, the load
              included, and enter both below in place of the assumptions.
            </li>
            <li>
              <strong>Set the interval in steps, from dt* over the step time.</strong> TorchTitan&apos;s
              default of 500 steps{' '}
              <Cite tier={1} href={TT_INTERVAL} kind="code">
                TorchTitan v0.4.0 checkpointer/base.py L556
              </Cite>{' '}
              is {hours(500 * REF_STEP_SECONDS)} hours at {fmt(REF_STEP_SECONDS, 1)} s per step: close to
              the {fmt(W_SYNC.intervalSteps)} steps, {hours(W_SYNC.intervalSeconds)} hours, that a 60 s
              save calls for on the 70B job, and almost {fmt(500 / W_ASYNC.intervalSteps, 0)} times the{' '}
              {fmt(W_ASYNC.intervalSteps)} steps, {minutes(W_ASYNC.intervalSeconds)} minutes, that a 2 s
              save calls for.
            </li>
            <li>
              <strong>Size the storage for the largest floor:</strong> the write rate, the read rate the
              restart allows and the checkpoints you keep. Enable EFA on an FSx for Lustre file system
              above 10 GBps; on S3, spread ranks over prefixes or use S3 Express One Zone.
            </li>
          </ol>
          <Box variant="p">
            Start from a worked case, then replace the assumptions with your measured step time,
            blocking time and restart time. The calculator applies, in order:
          </Box>
          <Box variant="p">
            <code>MTTF = 1 / (N_nodes x r_f)</code>
            <br />
            <code>dt* = sqrt(2 w_cp / (N_nodes x r_f))</code>, and <code>dt* / step time</code> in steps
            <br />
            <code>E[ETTR] ~ (1 - N_nodes r_f (u_0 + dt*/2)) / (1 + w_cp / dt*)</code>
            <br />
            <code>write rate = bytes / w_cp</code> (synchronous) or <code>bytes / drain budget</code>{' '}
            (asynchronous)
            <br />
            <code>FSx TiB = write rate / MBps per TiB</code>, rounded up to a valid size
          </Box>
          <CheckpointCalculator />
          <Box variant="small" color="text-body-secondary">
            Where the inputs come from. Failure rates:{' '}
            <Cite tier={3} href={META_RELIABILITY} venue="preprint">
              Revisiting Reliability, Section III
            </Cite>
            . Bytes per parameter: the optimizer rows of section 5, The Memory Budget, without the
            gradients. Step time: Calculator A at 40% MFU, inside Llama 3&apos;s measured 38% to 43%{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Table 4
            </Cite>{' '}
            against the H100&apos;s dense BF16 peak of 989.5 TFLOPS (trillion FLOPs per second), half
            the figure NVIDIA lists &quot;with sparsity&quot;{' '}
            <Cite tier={1} href={H100_SPEC} kind="vendor-claim">
              NVIDIA H100 specification
            </Cite>
            . Blocking time: an assumption; MegaScale&apos;s pinned copy takes several seconds{' '}
            <Cite tier={3} href={MEGASCALE} venue="NSDI 2024">
              MegaScale, Section 4.4
            </Cite>{' '}
            and E4 shows the shape of the difference, not an H100 figure. Restart time: an assumption
            inside Meta&apos;s 5 to 20 minutes. FSx tiers, sizes and price:{' '}
            <Cite tier={1} href={FSX_SSD}>
              SSD performance
            </Cite>
            ,{' '}
            <Cite tier={1} href={FSX_SIZES}>
              CreateFileSystem
            </Cite>
            ,{' '}
            <Cite tier={1} href={FSX_PRICE} accessed={REGISTER_DATE}>
              AmazonFSx price list
            </Cite>
            . S3 parts and rate:{' '}
            <Cite tier={1} href={S3_PART_SIZE} kind="code">
              s3client_config.py L14-L26
            </Cite>
            ,{' '}
            <Cite tier={1} href={S3_PERF}>
              S3 optimizing performance
            </Cite>
            .
          </Box>
          <Box variant="p">
            Then make the restart continue the same run, with the same data order and random streams:
            section 19, Resuming Correctly.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
