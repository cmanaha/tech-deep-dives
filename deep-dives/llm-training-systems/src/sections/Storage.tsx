import { useRef } from 'react';
import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, arxiv, gh, MEGATRON_TAG, MOUNTPOINT_TAG, PYTORCH_TAG, S3_CONNECTOR_TAG, METASEQ_SHA } from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import { DENSE_MODELS, FAILURE_RATES, FSX_TIERS, GB, GiB, INSTANCES, SOURCES, TiB, shapeOf } from '../lib/presets';
import type { DenseModelPreset } from '../lib/presets';
import { checkpointBytesPerParameter, checkpointPlan, checkpointSize } from '../lib/checkpoint';
import type { CheckpointInput, CheckpointResult } from '../lib/checkpoint';
import { denseRuntimeInputs, estimateRun } from '../lib/runtime';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Register rows cited without re-opening the source keep the register's date. */
const REGISTER_DATE = '2026-10-30';

/** The Llama 3 Herd of Models: Sec 3.3.1 (storage fabric), Table 4 (TFLOPs per GPU, MFU). */
const LLAMA3 = arxiv('2407.21783v3');
/** PaLM, Appendix B: 6N FLOPs per token. */
const PALM = arxiv('2204.02311v5');
/** MegaScale (NSDI 2024), Sec 4.4: the restart read is on the critical path. */
const MEGASCALE = arxiv('2402.15627v1');
/** OPT-175B team notes at metaseq HEAD of 2026-10-30. */
const OPT_NOTES = gh('facebookresearch/metaseq', METASEQ_SHA, 'projects/OPT/chronicles/27_percent_update.md', 'L19');
const HF_70B = 'https://huggingface.co/api/models/meta-llama/Llama-3.1-70B';
const HF_8B = 'https://huggingface.co/api/models/meta-llama/Llama-3.1-8B';
const HF_405B = 'https://huggingface.co/api/models/meta-llama/Llama-3.1-405B';
const H100_SPEC = 'https://www.nvidia.com/en-us/data-center/h100/';
const EC2_ACCEL = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';
const EC2_INSTANCE_STORE = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-store-lifetime.html';

/* Megatron Core core_v0.20.0: token storage and the index cache */
const MG_DTYPE = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/datasets/indexed_dataset.py', 'L114-L126');
const MG_MMAP = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/datasets/indexed_dataset.py', 'L392-L402');
const MG_S3_READ = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/datasets/indexed_dataset.py', 'L612-L618');
const MG_S3_SELECT = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/datasets/indexed_dataset.py', 'L716-L724');
const MG_PREPROCESS = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'tools/preprocess_data.py', 'L170-L177');
const MG_INDEX_CACHE = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/datasets/gpt_dataset.py', 'L505-L545');

/* PyTorch v2.15.0 Distributed Checkpoint */
const PT_FS_WRITER = gh('pytorch/pytorch', PYTORCH_TAG, 'torch/distributed/checkpoint/filesystem.py', 'L973');
const PT_FINISH_RENAME = gh('pytorch/pytorch', PYTORCH_TAG, 'torch/distributed/checkpoint/filesystem.py', 'L762-L798');

/* S3 Connector for PyTorch v1.5.0 */
const S3C_README_INTRO = gh('awslabs/s3-connector-for-pytorch', S3_CONNECTOR_TAG, 'README.md', 'L7-L15');
const S3C_README_LIST = gh('awslabs/s3-connector-for-pytorch', S3_CONNECTOR_TAG, 'README.md', 'L74-L79');
const S3C_README_DIST = gh('awslabs/s3-connector-for-pytorch', S3_CONNECTOR_TAG, 'README.md', 'L327-L350');
const S3C_WRITER = gh(
  'awslabs/s3-connector-for-pytorch',
  S3_CONNECTOR_TAG,
  's3torchconnector/src/s3torchconnector/dcp/s3_file_system.py',
  'L271-L303',
);
const S3C_PART_SIZE = gh(
  'awslabs/s3-connector-for-pytorch',
  S3_CONNECTOR_TAG,
  's3torchconnector/src/s3torchconnector/_s3client/s3client_config.py',
  'L13-L25',
);
const S3C_RENAME = gh(
  'awslabs/s3-connector-for-pytorch',
  S3_CONNECTOR_TAG,
  's3torchconnector/src/s3torchconnector/dcp/s3_file_system.py',
  'L150-L160',
);

/* Mountpoint for Amazon S3 1.24.0 */
const MP_OPTIMIZED = gh('awslabs/mountpoint-s3', MOUNTPOINT_TAG, 'doc/SEMANTICS.md', 'L3');
const MP_NO_RENAME = gh('awslabs/mountpoint-s3', MOUNTPOINT_TAG, 'doc/SEMANTICS.md', 'L8');
const MP_RENAME_EXPRESS = gh('awslabs/mountpoint-s3', MOUNTPOINT_TAG, 'doc/SEMANTICS.md', 'L20-L21');
const MP_ONE_WRITER = gh('awslabs/mountpoint-s3', MOUNTPOINT_TAG, 'doc/SEMANTICS.md', 'L84-L85');
const MP_GUIDE = 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/mountpoint.html';

/* Amazon S3 */
const S3_PERF = 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html';
const S3_EXPRESS = 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-performance.html';
const S3_EXPRESS_AVAIL = 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-bucket-high-performance.html';

/* Amazon FSx for Lustre */
const FSX_SSD = 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/ssd-storage.html';
const FSX_PERF = 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html';
const FSX_DEPLOY = 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/using-fsx-lustre.html';
const FSX_EFA = 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/efa-file-systems.html';
const FSX_IMPORT = 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/importing-files.html';
const FSX_DRA = 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/fsx-data-repositories.html';
const FSX_PRICE = 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonFSx/current/us-east-1/index.json';

/* SageMaker HyperPod managed tiered checkpointing */
const HP_TIERED = 'https://docs.aws.amazon.com/sagemaker/latest/dg/managed-tier-checkpointing.html';

/* ------------------------------------------------------------------------ */
/* Worked numbers, from Calculators A and D                                 */
/* ------------------------------------------------------------------------ */

const P5 = INSTANCES['p5.48xlarge'];
const GPUS_PER_NODE = P5.acceleratorsPerInstance.value;
const H100_PEAK_TFLOPS = P5.denseBf16TflopsPerAccelerator.value;
const M70 = DENSE_MODELS['llama-3.1-70b'];
const M8 = DENSE_MODELS['llama-3.1-8b'];
const M405 = DENSE_MODELS['llama-3.1-405b'];

/** The dive's reference job: 512 sequences of 8,192 tokens per step on 256 H100 (section 4). */
const REF_GPUS = 256;
const REF_NODES = REF_GPUS / GPUS_PER_NODE;
const SEQUENCE = 8_192;
const SEQUENCES_PER_STEP = 512;

/** Meta's Llama 3 405B row: 400 TFLOPs per GPU on 16,384 GPUs (Table 4, T01-6). */
const META_405B_TFLOPS = 400;
const META_405B_GPUS = 16_384;

/** Host memory of one p5.48xlarge, GiB (EC2 accelerated computing specifications, T05-2). */
const P5_HOST_GIB = 2_048;
/** Instance store of one p5.48xlarge: 8 drives of 3,800 GB (T05-42). */
const P5_NVME_DRIVES = 8;
const P5_NVME_GB_PER_DRIVE = 3_800;

/**
 * Megatron's preprocessing picks the token dtype from the vocabulary: uint16 below 65,500
 * entries, int32 otherwise (indexed_dataset.py L114-L126 at core_v0.20.0, T04-50).
 */
function megatronBytesPerToken(vocab: number): number {
  return vocab < 65_500 ? 2 : 4;
}

function runOf(model: DenseModelPreset, accelerators: number, peakTflops: number, mfu?: number) {
  return estimateRun({
    ...denseRuntimeInputs(shapeOf(model), 'full'),
    tokens: SEQUENCES_PER_STEP * SEQUENCE,
    sequenceLength: SEQUENCE,
    attention: 'none',
    peakTflopsPerAccelerator: peakTflops,
    accelerators,
    mfu,
  });
}

const RUN_70B = runOf(M70, REF_GPUS, H100_PEAK_TFLOPS);
const RUN_8B = runOf(M8, REF_GPUS, H100_PEAK_TFLOPS);
/** Meta's achieved 400 TFLOPs per GPU stands in for peak x MFU, so MFU is 1 against it. */
const RUN_405B = runOf(M405, META_405B_GPUS, META_405B_TFLOPS, 1);

const BYTES_PER_TOKEN = megatronBytesPerToken(M70.vocab.value);
const TOKENS_PER_GPU_70B = RUN_70B.tokensPerSecondPerAccelerator;
const JOB_TOKENS_70B = TOKENS_PER_GPU_70B * REF_GPUS;
const JOB_BYTES_70B = JOB_TOKENS_70B * BYTES_PER_TOKEN;
const NODE_BYTES_70B = TOKENS_PER_GPU_70B * GPUS_PER_NODE * BYTES_PER_TOKEN;
const GPU_BYTES_70B = TOKENS_PER_GPU_70B * BYTES_PER_TOKEN;
const JOB_BYTES_8B = RUN_8B.tokensPerSecondPerAccelerator * REF_GPUS * megatronBytesPerToken(M8.vocab.value);
const JOB_BYTES_405B =
  RUN_405B.tokensPerSecondPerAccelerator * META_405B_GPUS * megatronBytesPerToken(M405.vocab.value);
const REF_STEP_SECONDS = RUN_70B.wallClockSeconds;

/* Calculator D, with the same inputs as section 18's worked cases */
const CKPT_70B = checkpointSize({
  parameters: M70.totalParameters.value,
  bytesPerParameter: checkpointBytesPerParameter('adamMixed', { saveWorkingWeights: true }),
  ranks: REF_GPUS,
});

function refPlan(overrides: Partial<CheckpointInput> = {}): CheckpointResult {
  return checkpointPlan({
    checkpointBytes: CKPT_70B.totalBytes,
    nodes: REF_NODES,
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

/** Seconds to read the checkpoint back from a PERSISTENT-1000 file system of this size (uncached reads run at disk throughput). */
function fsxReadSeconds(provisionedGiB: number): number {
  const tib = (provisionedGiB * GiB) / TiB;
  return CKPT_70B.totalBytes / (tib * FSX_TIERS[1000].mbpsPerTib.value * 1e6);
}

const READ_SMALL_SECONDS = fsxReadSeconds(W_ASYNC.storage.fsx.provisionedGiB);
const READ_SYNC_SECONDS = fsxReadSeconds(W_SYNC.storage.fsx.provisionedGiB);
const NODE_CKPT_BYTES = CKPT_70B.totalBytes / REF_NODES;
const SYNC_TO_TOKENS = Number((W_SYNC.storage.writeBytesPerSecond / JOB_BYTES_70B).toPrecision(2));
const ASYNC_TO_TOKENS = Number((W_ASYNC.storage.writeBytesPerSecond / JOB_BYTES_70B).toPrecision(1));

const fmt = (x: number, digits = 0) =>
  x.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
const roundTo = (x: number, step: number) => Math.round(x / step) * step;

/** Display strings shared by the prose and the diagram, so both always agree. */
const T = {
  jobMBps: fmt(JOB_BYTES_70B / 1e6, 2),
  nodeKBps: fmt(NODE_BYTES_70B / 1e3, 0),
  gpuKBps: fmt(GPU_BYTES_70B / 1e3, 1),
  tokensPerGpu: fmt(TOKENS_PER_GPU_70B, 0),
  jobTokens: fmt(roundTo(JOB_TOKENS_70B, 1_000), 0),
  stepSeconds: fmt(REF_STEP_SECONDS, 1),
  ckptGB: fmt(CKPT_70B.totalBytes / GB, 0),
  ckptPerGpuGB: fmt(CKPT_70B.perRankBytes / GB, 2),
  ckptPerNodeGB: fmt(NODE_CKPT_BYTES / GB, 1),
  syncGBps: fmt(W_SYNC.storage.writeGBps, 1),
  syncNodeGBps: fmt(W_SYNC.storage.writeGBps / REF_NODES, 2),
  syncNodeGbps: fmt((W_SYNC.storage.writeGBps / REF_NODES) * 8, 1),
  asyncGBps: fmt(W_ASYNC.storage.writeGBps, 2),
  asyncMinutes: fmt(W_ASYNC.intervalMinutes, 1),
  smallGiB: fmt(W_ASYNC.storage.fsx.provisionedGiB, 0),
  syncGiB: fmt(W_SYNC.storage.fsx.provisionedGiB, 0),
  readSmallMinutes: fmt(READ_SMALL_SECONDS / 60, 0),
  readSyncSeconds: fmt(READ_SYNC_SECONDS, 0),
  hostShare: fmt((100 * NODE_CKPT_BYTES) / (P5_HOST_GIB * GiB), 1),
  nvmeTB: fmt((P5_NVME_DRIVES * P5_NVME_GB_PER_DRIVE) / 1_000, 1),
  job8MBps: fmt(JOB_BYTES_8B / 1e6, 1),
  job405MBps: fmt(JOB_BYTES_405B / 1e6, 1),
  tokens8: fmt(RUN_8B.tokensPerSecondPerAccelerator, 0),
  tokens405: fmt(RUN_405B.tokensPerSecondPerAccelerator, 0),
  syncRatio: fmt(SYNC_TO_TOKENS, 0),
  asyncRatio: fmt(ASYNC_TO_TOKENS, 0),
};

/* ------------------------------------------------------------------------ */
/* Diagram: the data path and the checkpoint path of the 70B job            */
/* ------------------------------------------------------------------------ */

interface PathBox {
  title: string;
  lines: [string, string];
}

const DATA_BOXES: PathBox[] = [
  { title: 'Amazon S3', lines: ['pre-tokenised shards', 'the durable corpus'] },
  { title: 'FSx for Lustre', lines: ['linked to the bucket,', 'or local NVMe'] },
  { title: 'Data loader', lines: ['memory-mapped reads', `${T.nodeKBps} KB/s per instance`] },
  { title: `${REF_GPUS} H100 GPUs`, lines: [`${T.tokensPerGpu} tokens/s per GPU`, `${BYTES_PER_TOKEN} bytes per token`] },
];

const CKPT_BOXES: PathBox[] = [
  { title: 'GPU memory', lines: [`${T.ckptPerGpuGB} GB per GPU`, 'copied at each save'] },
  { title: 'Host memory', lines: [`${T.ckptPerNodeGB} GB per instance`, "and a peer's copy"] },
  { title: 'FSx for Lustre or S3', lines: [`${T.ckptGB} GB per checkpoint`, 'sized by Calculator D'] },
  { title: 'S3, durable copy', lines: ['regional bucket', 'outlives the cluster'] },
];

const DATA_STYLE = { fill: '#f4f4f4', stroke: '#879596' };
const CKPT_STYLE = { fill: '#f2f8fd', stroke: '#0972d3' };

function StoragePathsDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, 680);

  const ink = '#16191f';
  const muted = '#414d5c';
  const blue = '#065299';
  const amber = '#8b6c00';
  const font = 'sans-serif';

  const W = narrow ? 360 : 900;
  const H = narrow ? 470 : 322;

  /* Wide: two horizontal lanes of four boxes. Narrow: two columns of four stacked boxes. */
  const boxW = narrow ? 160 : 190;
  const boxH = narrow ? 58 : 64;
  const wideGap = 36;
  const wideX = (i: number) => 20 + i * (boxW + wideGap);
  const dataTop = 84;
  const ckptTop = 196;
  const colX = [8, 176];
  /* Narrow restart-read arrow runs outside the checkpoint column, right of its boxes. */
  const readX = colX[1] + boxW + 10;
  const narrowTop = 100;
  const narrowGap = 22;
  const narrowY = (i: number) => narrowTop + i * (boxH + narrowGap);

  const box = (b: PathBox, x: number, y: number, style: { fill: string; stroke: string }, key: string) => (
    <g key={key}>
      <rect x={x} y={y} width={boxW} height={boxH} rx={6} fill={style.fill} stroke={style.stroke} strokeWidth={1.4} />
      <text x={x + boxW / 2} y={y + (narrow ? 19 : 22)} fontFamily={font} fontSize={12} fontWeight={600} fill={ink} textAnchor="middle">
        {b.title}
      </text>
      <text x={x + boxW / 2} y={y + (narrow ? 35 : 40)} fontFamily={font} fontSize={11} fill={muted} textAnchor="middle">
        {b.lines[0]}
      </text>
      <text x={x + boxW / 2} y={y + (narrow ? 50 : 56)} fontFamily={font} fontSize={11} fill={muted} textAnchor="middle">
        {b.lines[1]}
      </text>
    </g>
  );

  const hArrow = (x1: number, x2: number, y: number, color: string, key: string) => (
    <line key={key} x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={1.5} markerEnd="url(#storage-paths-ah)" />
  );
  const vArrow = (x: number, y1: number, y2: number, color: string, key: string) => (
    <line key={key} x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth={1.5} markerEnd="url(#storage-paths-ah)" />
  );

  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="storage-paths-title"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <title id="storage-paths-title">
          The two storage paths of a Llama 3.1 70B run on 256 H100 GPUs. The data path carries
          pre-tokenised shards from Amazon S3, through FSx for Lustre or local NVMe, to a
          memory-mapped data loader, and the whole job reads about {T.jobMBps} MB/s of tokens. The
          checkpoint path copies {T.ckptPerGpuGB} GB per GPU into host memory and a peer&apos;s
          memory, writes the {T.ckptGB} GB checkpoint to FSx for Lustre or S3 at {T.syncGBps} GB/s
          for a 60 second save, and keeps the durable copy in S3. Every restart reads the checkpoint
          back before training resumes: about {T.readSmallMinutes} minutes from the smallest file
          system, about {T.readSyncSeconds} seconds from the one a 60 second save needs.
        </title>
        <defs>
          <marker id="storage-paths-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={muted} />
          </marker>
          <marker id="storage-paths-ah-read" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={amber} />
          </marker>
        </defs>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />

        <text x={narrow ? 8 : 20} y={22} fontFamily={font} fontSize={13} fontWeight={600} fill={ink}>
          {narrow ? 'Two paths, Llama 3.1 70B, 256 H100' : 'Two paths through storage: Llama 3.1 70B on 256 H100 GPUs'}
        </text>
        <text x={narrow ? 8 : 20} y={39} fontFamily={font} fontSize={11} fill={muted}>
          {narrow ? '40% MFU, 4-byte tokens, 60 s save' : '40% MFU, 4-byte tokens, 14-byte checkpoint, 60 s synchronous save'}
        </text>

        {narrow ? (
          <>
            {/* Column headers */}
            <text x={colX[0]} y={62} fontFamily={font} fontSize={12} fontWeight={600} fill={muted}>
              Data path
            </text>
            <text x={colX[0]} y={77} fontFamily={font} fontSize={11} fill={muted}>
              about {T.jobMBps} MB/s,
            </text>
            <text x={colX[0]} y={91} fontFamily={font} fontSize={11} fill={muted}>
              whole job
            </text>
            <text x={colX[1]} y={62} fontFamily={font} fontSize={12} fontWeight={600} fill={blue}>
              Checkpoint path
            </text>
            <text x={colX[1]} y={77} fontFamily={font} fontSize={11} fill={blue}>
              {T.syncGBps} GB/s, 60 s save
            </text>
            <text x={colX[1]} y={91} fontFamily={font} fontSize={11} fill={blue}>
              {T.asyncGBps} GB/s, async drain
            </text>

            {DATA_BOXES.map((b, i) => box(b, colX[0], narrowY(i), DATA_STYLE, `d${i}`))}
            {CKPT_BOXES.map((b, i) => box(b, colX[1], narrowY(i), CKPT_STYLE, `c${i}`))}
            {[0, 1, 2].map((i) =>
              vArrow(colX[0] + boxW / 2, narrowY(i) + boxH + 2, narrowY(i + 1) - 3, muted, `dv${i}`),
            )}
            {[0, 1, 2].map((i) =>
              vArrow(colX[1] + boxW / 2, narrowY(i) + boxH + 2, narrowY(i + 1) - 3, muted, `cv${i}`),
            )}

            {/* Restart read: from the checkpoint store back up to GPU memory, outside the column */}
            <path
              d={`M ${colX[1] + boxW + 2} ${narrowY(2) + boxH / 2} L ${readX} ${narrowY(2) + boxH / 2} L ${readX} ${
                narrowY(0) + boxH / 2
              } L ${colX[1] + boxW + 4} ${narrowY(0) + boxH / 2}`}
              fill="none"
              stroke={amber}
              strokeWidth={1.6}
              strokeDasharray="5 3"
              markerEnd="url(#storage-paths-ah-read)"
            />

            <text x={8} y={narrowY(3) + boxH + 26} fontFamily={font} fontSize={11} fontWeight={600} fill={amber}>
              Dashed: every restart reads {T.ckptGB} GB back
            </text>
            <text x={8} y={narrowY(3) + boxH + 42} fontFamily={font} fontSize={11} fill={amber}>
              about {T.readSmallMinutes} min from {T.smallGiB} GiB of PERSISTENT-1000,
            </text>
            <text x={8} y={narrowY(3) + boxH + 58} fontFamily={font} fontSize={11} fill={amber}>
              about {T.readSyncSeconds} s from {T.syncGiB} GiB
            </text>
          </>
        ) : (
          <>
            <text x={20} y={dataTop - 12} fontFamily={font} fontSize={12} fontWeight={600} fill={muted}>
              Data path, training tokens: about {T.jobMBps} MB/s for the whole job
            </text>
            {DATA_BOXES.map((b, i) => box(b, wideX(i), dataTop, DATA_STYLE, `d${i}`))}
            {[0, 1, 2].map((i) => hArrow(wideX(i) + boxW + 3, wideX(i + 1) - 4, dataTop + boxH / 2, muted, `dh${i}`))}

            <text x={20} y={ckptTop - 12} fontFamily={font} fontSize={12} fontWeight={600} fill={blue}>
              Checkpoint path, model state: {T.syncGBps} GB/s for a 60 s save, {T.asyncGBps} GB/s drained
              asynchronously over {T.asyncMinutes} min
            </text>
            {CKPT_BOXES.map((b, i) => box(b, wideX(i), ckptTop, CKPT_STYLE, `c${i}`))}
            {[0, 1, 2].map((i) => hArrow(wideX(i) + boxW + 3, wideX(i + 1) - 4, ckptTop + boxH / 2, muted, `ch${i}`))}

            {/* Restart read: from the checkpoint store back to GPU memory, under the lane */}
            <path
              d={`M ${wideX(2) + boxW / 2} ${ckptTop + boxH + 2} L ${wideX(2) + boxW / 2} ${ckptTop + boxH + 22} L ${
                wideX(0) + boxW / 2
              } ${ckptTop + boxH + 22} L ${wideX(0) + boxW / 2} ${ckptTop + boxH + 5}`}
              fill="none"
              stroke={amber}
              strokeWidth={1.6}
              strokeDasharray="5 3"
              markerEnd="url(#storage-paths-ah-read)"
            />
            <text x={wideX(1) + boxW / 2} y={ckptTop + boxH + 44} fontFamily={font} fontSize={11} fontWeight={600} fill={amber} textAnchor="middle">
              Every restart reads the {T.ckptGB} GB back before the first step:
            </text>
            <text x={wideX(1) + boxW / 2} y={ckptTop + boxH + 60} fontFamily={font} fontSize={11} fill={amber} textAnchor="middle">
              about {T.readSmallMinutes} min from {T.smallGiB} GiB of PERSISTENT-1000, about {T.readSyncSeconds} s
              from {T.syncGiB} GiB
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Table                                                                    */
/* ------------------------------------------------------------------------ */

const cell: CSSProperties = {
  padding: '6px 8px',
  borderBottom: '1px solid #e9ebed',
  textAlign: 'left',
  verticalAlign: 'top',
};
const headCell: CSSProperties = { ...cell, fontWeight: 700, borderBottom: '2px solid #d1d5db' };

function TokenRateTable() {
  const rows = [
    {
      job: `Llama 3.1 70B, ${REF_GPUS} H100 at 40% MFU`,
      perGpu: T.tokensPerGpu,
      job_: `${T.jobMBps} MB/s (${T.nodeKBps} KB/s per instance)`,
    },
    { job: `Llama 3.1 8B, ${REF_GPUS} H100 at 40% MFU`, perGpu: T.tokens8, job_: `${T.job8MBps} MB/s` },
    {
      job: `Llama 3.1 405B, ${fmt(META_405B_GPUS)} H100 at Meta's ${META_405B_TFLOPS} TFLOPs per GPU`,
      perGpu: T.tokens405,
      job_: `${T.job405MBps} MB/s`,
    },
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>Job</th>
            <th style={headCell}>Tokens/s per GPU</th>
            <th style={headCell}>Whole job reads</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.job}>
              <td style={cell}>{r.job}</td>
              <td style={cell}>{r.perGpu}</td>
              <td style={cell}>{r.job_}</td>
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

export function Storage() {
  const fsx = W_SYNC.storage.fsx;
  const fsxSmall = W_ASYNC.storage.fsx;
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={`Size training storage for the checkpoint burst and the restart read, because the tokens barely register: Llama 3.1 70B on 256 H100 GPUs reads about ${T.jobMBps} MB/s of tokens and needs ${T.syncGBps} GB/s to write its checkpoint in 60 s (Megatron Core core_v0.20.0, PyTorch v2.15.0, the S3 Connector for PyTorch v1.5.0 and Mountpoint for Amazon S3 1.24.0, read 2026-10-31)`}
          >
            23. Storage for Training
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A training run moves bytes along two paths. The data path carries training tokens to each
            GPU&apos;s data loader for as long as the run lasts. The checkpoint path carries the
            model&apos;s state out to storage every few hundred steps and back in after every failure.
            Both run through the same AWS tiers, Amazon S3 (Simple Storage Service), Amazon FSx for
            Lustre (AWS&apos;s managed Lustre parallel file system), instance-store NVMe (Non-Volatile
            Memory Express) drives and host memory, so the decision is which tier serves which path, at
            what size.
          </Box>
          <Box variant="p">
            The challenge is to size for the right path. For text pre-training the two differ by about
            four orders of magnitude, and the larger one arrives in bursts. This section works out the
            data path, places each AWS tier on the path it serves, and takes the checkpoint figures
            from Calculator D in section 18, Checkpointing, which sizes the checkpoint target in full.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Work out the data path before you buy throughput for it: the 70B job reads about ${T.jobMBps} MB/s of tokens across all 256 GPUs`}
          >
            What the data loader reads
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A GPU takes in tokens only as fast as it can do the arithmetic on them. Training costs about
            6 FLOPs (floating-point operations) per parameter per token, forward and backward{' '}
            <Cite tier={3} href={PALM} venue="preprint" accessed={REGISTER_DATE}>
              PaLM, Appendix B
            </Cite>
            , so a GPU&apos;s tokens per second are its achieved FLOPs over 6N, for N parameters. For
            Llama 3.1 70B, with 70,553,706,496 parameters{' '}
            <Cite tier={1} href={HF_70B} accessed={REGISTER_DATE}>
              Meta&apos;s Llama 3.1 70B model metadata
            </Cite>
            , on {REF_NODES} Amazon EC2 (Elastic Compute Cloud) p5.48xlarge instances with {REF_GPUS}{' '}
            H100 GPUs, at 40% MFU (model FLOPs utilization, the share of peak arithmetic a run
            achieves), an assumption inside Llama 3&apos;s measured 38% to 43%{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Table 4
            </Cite>
            , of the H100&apos;s dense BF16 (bfloat16) peak of 989.5 TFLOPS (trillion FLOPs per second),
            half the figure NVIDIA lists &quot;with sparsity&quot;{' '}
            <Cite tier={1} href={H100_SPEC} kind="vendor-claim" accessed={REGISTER_DATE}>
              NVIDIA H100 specification
            </Cite>
            , each GPU trains on about {T.tokensPerGpu} tokens per second. The whole job takes in about{' '}
            {T.jobTokens}: one training step (a single optimizer update) of {SEQUENCES_PER_STEP}{' '}
            sequences of {fmt(SEQUENCE)} tokens every {T.stepSeconds} s, as Calculator A gives it in
            section 4, Counting the Arithmetic.
          </Box>
          <Box variant="p">
            On disk a token is an integer. Megatron Core&apos;s preprocessing tool writes a tokenised
            corpus as a <code>.bin</code> file of token IDs with an <code>.idx</code> index of offsets{' '}
            <Cite tier={1} href={MG_PREPROCESS} kind="code">
              Megatron Core core_v0.20.0 preprocess_data.py L170-L177
            </Cite>
            , and the training reader memory-maps the <code>.bin</code> file{' '}
            <Cite tier={1} href={MG_MMAP} kind="code">
              indexed_dataset.py L392-L402
            </Cite>
            . The integer width follows the vocabulary: <code>uint16</code> below 65,500 entries,{' '}
            <code>int32</code> otherwise{' '}
            <Cite tier={1} href={MG_DTYPE} kind="code">
              indexed_dataset.py L114-L126
            </Cite>
            . Llama 3&apos;s tokenizer has 128,256 entries{' '}
            <Cite tier={1} href={SOURCES.llamaTokenizer.url} accessed={REGISTER_DATE}>
              llama-models v0.2.0 tokenizer.py
            </Cite>
            , so each token costs {BYTES_PER_TOKEN} bytes, and the 70B job reads{' '}
            <strong>about {T.jobMBps} MB/s of tokens in total</strong>: {T.nodeKBps} KB/s per
            instance, {T.gpuKBps} KB/s per GPU (our arithmetic).
          </Box>
          <Box variant="p">
            Scale leaves the picture where it is. Meta&apos;s Llama 3 405B ran at 400 TFLOPs per GPU
            on 16,384 GPUs{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Table 4
            </Cite>
            ; in the same 4-byte format that run would read about {T.job405MBps} MB/s, a figure from our
            model of the run, since Meta does not publish its loader&apos;s bytes per token. Its storage
            fabric is rated for &quot;a sustainable throughput of 2 TB/s and a peak throughput of 7
            TB/s&quot;{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.1
            </Cite>
            .
          </Box>
          <Box variant="p">
            Now set the checkpoint beside it: about {T.ckptGB} GB at 14 bytes per parameter. A 60 s
            synchronous save, which pauses training until the write ends, needs {T.syncGBps} GB/s,
            about {T.syncRatio} times the token rate. An asynchronous save, which copies the state to
            host memory and drains it to storage in the background, still needs {T.asyncGBps} GB/s over
            its {T.asyncMinutes}-minute interval, about {T.asyncRatio} times the tokens (Calculator D,
            section 18, Checkpointing). Text tokens are cheap;
            checkpoints are not.
          </Box>
          <ExpandableSection headerText="The data-path arithmetic, with its assumptions">
            <SpaceBetween size="s">
              <Box variant="p">
                <code>bytes per second = GPUs x MFU x dense peak / (6N) x bytes per token</code>
              </Box>
              <TokenRateTable />
              <Box variant="p">
                Parameter counts: 8,030,261,248 for 8B{' '}
                <Cite tier={1} href={HF_8B} accessed={REGISTER_DATE}>
                  Llama 3.1 8B model metadata
                </Cite>{' '}
                and 405,853,388,800 for 405B{' '}
                <Cite tier={1} href={HF_405B} accessed={REGISTER_DATE}>
                  Llama 3.1 405B model metadata
                </Cite>
                . The 405B row uses Meta&apos;s achieved 400 TFLOPs per GPU in place of MFU times peak.
                Every row counts 6N FLOPs per token and no attention FLOPs; a count that adds attention
                gives fewer tokens per second at the same MFU, so these are upper bounds for their
                stated utilisation (our reading). Bytes per token are Megatron&apos;s on-disk width for
                the 128,256-entry vocabulary all three models share; a GPT-2-sized vocabulary below
                65,500 entries halves them. Step overheads, packing and page-cache misses are not
                counted.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`See the 70B job on one picture: about ${T.jobMBps} MB/s down the data path, ${T.syncGBps} GB/s out along the checkpoint path, and ${T.ckptGB} GB read back at every restart`}
          >
            Two paths, two budgets
          </Header>
        }
      >
        <SpaceBetween size="m">
          <StoragePathsDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured: the layout is schematic, and every rate is our arithmetic for
            the 70B example from Calculators A and D. FSx sizes are PERSISTENT-1000 at two significant
            digits.
          </Box>
          <Box variant="p">
            The data path reads steadily and writes almost nothing; once the corpus sits near the GPUs,
            page cache or local NVMe serves it after the first read. The checkpoint path writes in bursts
            and reads in one block before the first step after a restart. The storage budget belongs to
            the second path (our reading of the arithmetic).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Plan for the four moments that do stress training storage: the save burst, the restart read, the start-up storm and non-text data"
          >
            Where storage binds
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The save burst.</strong> Meta names &quot;the highly bursty checkpoint writes that
            saturate the storage fabric for short durations&quot; as a major challenge of Llama 3&apos;s
            storage{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.1
            </Cite>
            . Every rank (one training process per GPU) writes its shard, its slice of the model state, in
            the same seconds: for the 70B job, {T.ckptPerGpuGB} GB per
            GPU and {T.ckptPerNodeGB} GB per instance, {T.syncGBps} GB/s together for a 60 s save.
            Section 18 turns that rate into FSx capacity or an S3 layout.
          </Box>
          <Box variant="p">
            <strong>The restart read.</strong> Nothing trains until every rank has its shard back, so
            the read sits on the critical path. MegaScale names the bandwidth of its distributed file
            system as the bottleneck there, and has one worker per data-parallel group (the ranks that
            hold identical copies of the same state) read that state and broadcast it to the rest{' '}
            <Cite tier={3} href={MEGASCALE} venue="NSDI 2024" accessed={REGISTER_DATE}>
              MegaScale, Section 4.4
            </Cite>
            . OPT-175B&apos;s restarts stalled when downloads of its 1.6 TB checkpoint, 992 files of
            about 1.7 GB, started hanging{' '}
            <Cite tier={2} href={OPT_NOTES} accessed={REGISTER_DATE}>
              OPT-175B team notes, 27% update
            </Cite>
            . Because FSx for Lustre sells throughput with capacity, a file system sized only for an
            asynchronous drain is small and slow to read: the smallest SSD size,{' '}
            {T.smallGiB} GiB of PERSISTENT-1000 (FSx for Lustre&apos;s 1,000 MBps-per-TiB tier), reads the
            70B checkpoint back in about{' '}
            {T.readSmallMinutes} minutes, against about {T.readSyncSeconds} s for the {T.syncGiB} GiB a
            60 s save needs (our arithmetic from Calculator D). The data path has a restart cost too:
            Megatron Core caches its sample and shuffle indices as <code>.npy</code> files in a{' '}
            <code>cache</code> directory beside the data by default, and rank 0 rebuilds them when they
            are missing{' '}
            <Cite tier={1} href={MG_INDEX_CACHE} kind="code">
              Megatron Core core_v0.20.0 gpt_dataset.py L505-L545
            </Cite>
            , so keep the corpus and that cache where a replacement node can read them.
          </Box>
          <Box variant="p">
            <strong>The start-up storm.</strong> At launch and after every restart, every rank opens its
            files within the same second. On S3 that is a request-rate event: S3 sustains at least
            3,500 PUT/COPY/POST/DELETE or 5,500 GET/HEAD requests per second per partitioned prefix,
            scales past that gradually, and answers 503 Slow Down while it scales{' '}
            <Cite tier={1} href={S3_PERF}>
              Amazon S3 user guide, optimizing performance
            </Cite>
            . Listing is the other half. The S3 Connector for PyTorch&apos;s <code>S3MapDataset</code>{' '}
            lists every object under its prefix at first access, which &quot;might take some time and
            may give the impression of being unresponsive&quot;{' '}
            <Cite tier={1} href={S3C_README_LIST}>
              s3torchconnector v1.5.0 README L74-L79
            </Cite>
            , and an FSx data repository association created with its import option imports the metadata
            of every object in the bucket{' '}
            <Cite tier={1} href={FSX_IMPORT}>
              FSx for Lustre user guide, importing changes
            </Cite>
            . A corpus of a few hundred large shards keeps both small (our reading).
          </Box>
          <Box variant="p">
            <strong>Non-text data.</strong> Image, audio and video samples carry far more bytes per
            training example than text tokens, so the token arithmetic above does not carry over to
            them; this dive sizes text runs only (our reading).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Match each AWS tier to the path it serves, using the documented limit that binds in training"
          >
            Pick the tier for each path
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Amazon FSx for Lustre</strong> is the one tier here that serves both paths at speed. Its SSD throughput is bought with
            capacity: each TiB provisioned gives 125, 250, 500 or 1,000 MBps of disk throughput, by tier,
            from PERSISTENT-125 to PERSISTENT-1000{' '}
            <Cite tier={1} href={FSX_SSD}>
              FSx for Lustre user guide, SSD performance
            </Cite>
            , and writes and uncached reads run at the lower of network and disk throughput{' '}
            <Cite tier={1} href={FSX_PERF}>
              FSx for Lustre user guide, performance
            </Cite>
. Size on baseline throughput: the documented burst credits are for reads, and PERSISTENT-1000
            lists no disk burst{' '}
            <Cite tier={1} href={FSX_SSD}>
              FSx for Lustre user guide, SSD performance
            </Cite>
            . AWS does not define the MB in bytes on these pages, so FSx figures here carry two
            significant digits.
          </Box>
          <Box variant="p">
            Choose a persistent file system for a run that lasts weeks. A persistent file system
            replaces a failed file server within minutes while client requests retry; a scratch file
            system does not replace it, and clients reading data on it get an immediate I/O error{' '}
            <Cite tier={1} href={FSX_DEPLOY}>
              FSx for Lustre user guide, deployment options
            </Cite>
            . EFA (Elastic Fabric Adapter) is supported on Persistent 2 file systems with a metadata
            configuration; it is chosen at creation and cannot be switched on or off later, and its
            clients sit in the same Availability Zone on Nitro v4 or later instances, excluding the
            trn2 family{' '}
            <Cite tier={1} href={FSX_EFA}>
              FSx for Lustre user guide, EFA-enabled file systems
            </Cite>
            . A single client reads at up to 100 Gbps without EFA, 700 Gbps over EFA and 1,200 Gbps with
            GPUDirect Storage{' '}
            <Cite tier={1} href={FSX_PERF}>
              FSx for Lustre user guide, throughput to individual clients
            </Cite>
            , far above the {T.syncNodeGBps} GB/s, about {T.syncNodeGbps} Gbps, that each instance
            writes during a 60 s save (our arithmetic), so the file system&apos;s aggregate throughput
            is what binds; the{' '}
            <Link href="../efa/">EFA dive, section 13: Storage Data Paths: FSx, S3 and the Common Runtime</Link>{' '}
            covers that path.
          </Box>
          <Box variant="p">
            Linked to a bucket through a data repository association, the file system copies a
            file&apos;s content in from S3 the first time an application reads it and serves later
            reads itself, and it can preload a whole file system or directory in parallel{' '}
            <Cite tier={1} href={FSX_IMPORT}>
              FSx for Lustre user guide, importing changes
            </Cite>
            . A file system linked to S3 cannot be backed up{' '}
            <Cite tier={1} href={FSX_DRA}>
              FSx for Lustre user guide, data repositories
            </Cite>
            , one more reason the durable copy of a checkpoint belongs in S3.
          </Box>
          <Box variant="p">
            <strong>Amazon S3</strong> holds the corpus and the checkpoints you keep, and its limit is
            requests per prefix, as above. At the S3 Connector for PyTorch&apos;s default 8 MiB part
            size{' '}
            <Cite tier={1} href={S3C_PART_SIZE} kind="code">
              s3torchconnector v1.5.0 s3client_config.py L13-L25
            </Cite>
            , one 70B checkpoint is {fmt(W_SYNC.storage.s3.partUploads)} part uploads, about{' '}
            {fmt(W_SYNC.storage.s3.secondsAtOnePrefix, 0)} s of one prefix&apos;s documented rate
            (Calculator D, section 18), so spread the ranks over prefixes. S3 Express One Zone keeps
            objects in directory buckets inside one Availability Zone; each supports up to 200,000 reads
            and 100,000 writes per second by default, more on request through AWS Support{' '}
            <Cite tier={1} href={S3_EXPRESS}>
              Amazon S3 user guide, S3 Express One Zone performance
            </Cite>
            , and the class is designed for 99.95% availability within that zone{' '}
            <Cite tier={1} href={S3_EXPRESS_AVAIL}>
              Amazon S3 user guide, directory buckets
            </Cite>
            . That makes it a burst target next to the cluster, with a regional bucket for the copy you
            keep (our reading).
          </Box>
          <Box variant="p">
            <strong>The S3 Connector for PyTorch</strong> v1.5.0 serves both paths straight from S3:
            datasets for training data, and checkpoints saved &quot;without first saving to local
            storage&quot;{' '}
            <Cite tier={1} href={S3C_README_INTRO}>
              s3torchconnector v1.5.0 README L7-L15
            </Cite>
            . <code>S3IterableDataset</code> streams objects and, with <code>enable_sharding=True</code>,
            gives each worker on every host a distinct subset; <code>S3MapDataset</code> serves random
            access with a <code>DistributedSampler</code>{' '}
            <Cite tier={1} href={S3C_README_DIST}>
              README L327-L350
            </Cite>
            . Its checkpoint writer uses one I/O thread per rank unless <code>thread_count</code> is
            raised, and it extends DCP&apos;s (PyTorch Distributed Checkpoint&apos;s){' '}
            <code>FileSystemWriter</code>{' '}
            <Cite tier={1} href={S3C_WRITER} kind="code">
              s3torchconnector v1.5.0 dcp/s3_file_system.py L271-L303
            </Cite>
            , which at PyTorch v2.15.0 is a blocking stager{' '}
            <Cite tier={1} href={PT_FS_WRITER} kind="code">
              PyTorch v2.15.0 filesystem.py L973
            </Cite>
            , so a bare <code>async_save</code> through it blocks training for the whole copy; section 18
            gives the pinned-stager fix.
          </Box>
          <Box variant="p">
            <strong>Mountpoint for Amazon S3</strong> 1.24.0 mounts a bucket as a file system built for
            high read throughput to large objects, and for writing new objects sequentially{' '}
            <Cite tier={1} href={MP_OPTIMIZED}>
              Mountpoint SEMANTICS.md L3
            </Cite>
            , one writer at a time{' '}
            <Cite tier={1} href={MP_ONE_WRITER}>
              SEMANTICS.md L84-L85
            </Cite>
            , which suits reading token shards. It does not emulate <code>rename</code> on general
            purpose buckets{' '}
            <Cite tier={1} href={MP_NO_RENAME}>
              SEMANTICS.md L8
            </Cite>{' '}
            and supports atomic rename only on S3 Express One Zone, rejecting it elsewhere{' '}
            <Cite tier={1} href={MP_RENAME_EXPRESS}>
              SEMANTICS.md L20-L21
            </Cite>
            , while DCP&apos;s <code>FileSystemWriter</code> ends every save by writing{' '}
            <code>.metadata.tmp</code> and renaming it to <code>.metadata</code>{' '}
            <Cite tier={1} href={PT_FINISH_RENAME} kind="code">
              PyTorch v2.15.0 filesystem.py L762-L798
            </Cite>
            . In our reading of both, a <code>dcp.save</code> into a Mountpoint directory on a general
            purpose bucket fails at its last step (not run). The S3 connector&apos;s writer emulates
            rename with a copy and a delete{' '}
            <Cite tier={1} href={S3C_RENAME} kind="code">
              s3_file_system.py L150-L160
            </Cite>
            , and for full POSIX (Portable Operating System Interface) semantics AWS recommends FSx for
            Lustre{' '}
            <Cite tier={1} href={MP_GUIDE}>
              Amazon S3 user guide, Mountpoint
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Instance store</strong> is the NVMe inside the instance: 8 x 3,800 GB on p5, p5e,
            p5en, p6-b200 and p6-b300 instances, 3 x 7,500 GB on p6e-gb200 and 4 x 1,900 GB on trn1 and
            trn2{' '}
            <Cite tier={1} href={EC2_ACCEL}>
              EC2 accelerated computing instance specifications
            </Cite>
            . A p5.48xlarge&apos;s {T.nvmeTB} TB holds its checkpoint share many times over, but the
            volume lives only as long as the instance: stopping, hibernating or terminating it erases the
            data{' '}
            <Cite tier={1} href={EC2_INSTANCE_STORE}>
              EC2 user guide, instance store data persistence
            </Cite>
            . A replacement node starts with an empty drive, so use instance store as a cache in front of
            FSx or S3 (our reading).
          </Box>
          <Box variant="p">
            <strong>Host memory</strong> is the tier closest to the GPU. A p5.48xlarge has 2,048 GiB{' '}
            <Cite tier={1} href={EC2_ACCEL}>
              EC2 accelerated computing instance specifications
            </Cite>
            , and its {T.ckptPerNodeGB} GB share of the 70B checkpoint is {T.hostShare}% of that per copy
            (our arithmetic). SageMaker HyperPod managed tiered checkpointing keeps checkpoints in CPU
            memory across the cluster&apos;s nodes, replicates them to adjacent nodes and saves them
            periodically to persistent storage such as S3{' '}
            <Cite tier={1} href={HP_TIERED}>
              SageMaker HyperPod managed tiered checkpointing
            </Cite>
            ; section 18 covers that design and the settings it needs.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Set the data path up once, size the checkpoint path from Calculator D, keep the durable copy in S3, then time one save and one restart read before the long run"
          >
            Your storage plan
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">For a text pre-training run on AWS, in this order:</Box>
          <ol>
            <li>
              <strong>Pre-tokenise the corpus into a few hundred large, memory-mapped shards.</strong>{' '}
              Megatron&apos;s <code>.bin</code> and <code>.idx</code> pair is one, at {BYTES_PER_TOKEN}{' '}
              bytes per token for a 128K vocabulary; at about {T.jobMBps} MB/s for the 70B job, any tier
              keeps up once the shards sit near the GPUs.
            </li>
            <li>
              <strong>Keep the corpus in S3 and bring it near the GPUs.</strong> Either link the bucket
              to the FSx for Lustre file system the checkpoints use and preload the corpus before the
              run, or stream it: <code>S3IterableDataset</code> with <code>enable_sharding=True</code>,
              or Megatron Core&apos;s own S3 reader, which needs memory mapping turned off and streams
              the <code>.bin</code> file in blocks{' '}
              <Cite tier={1} href={MG_S3_READ} kind="code">
                indexed_dataset.py L612-L618
              </Cite>{' '}
              <Cite tier={1} href={MG_S3_SELECT} kind="code">
                L716-L724
              </Cite>
              . Keep Megatron&apos;s index cache on the shared file system.
            </li>
            <li>
              <strong>Size the file system for the checkpoint path with Calculator D</strong> (section
              18), for the largest of three floors: the write rate, the read rate your restart allows and
              the checkpoints you keep. For the 70B job at PERSISTENT-1000, in us-east-1 at $
              {FSX_TIERS[1000].usdPerGbMonth.value.toFixed(3)} per GB-month on 2026-10-30{' '}
              <Cite tier={1} href={FSX_PRICE} accessed={REGISTER_DATE}>
                AWS Price List, AmazonFSx us-east-1, offer 20260911124432
              </Cite>
              , storage only:
              <ul>
                <li>
                  A 60 s synchronous save: {T.syncGBps} GB/s, {T.syncGiB} GiB, about $
                  {fmt(fsx.usdPerMonth)} a month (${fmt(fsx.usdPerMonthIfDecimalGB)} if the price
                  list&apos;s GB is decimal), and the checkpoint reads back in about{' '}
                  {T.readSyncSeconds} s.
                </li>
                <li>
                  An asynchronous save drained over {T.asyncMinutes} minutes: {T.asyncGBps} GB/s, which
                  the smallest size, {T.smallGiB} GiB at about ${fmt(fsxSmall.usdPerMonth)} a month,
                  absorbs; that size reads the checkpoint back in about {T.readSmallMinutes} minutes, so
                  grow it until the read fits your restart budget.
                </li>
              </ul>
            </li>
            <li>
              <strong>For checkpoints straight to S3,</strong> use the S3 Connector&apos;s writer with a
              partitioned prefix strategy and more than one I/O thread, or an S3 Express One Zone
              directory bucket, with a pinned stager (section 18). Keep Mountpoint for reading data.
            </li>
            <li>
              <strong>Keep the durable copy in a regional S3 bucket.</strong> Instance store and host
              memory leave with the instance, and a file system linked to S3 cannot be backed up.
            </li>
            <li>
              <strong>Time one save and one restart read on the real file system</strong> before the
              long run, and enter both in Calculator D in place of its assumptions. The A3 protocol (not
              yet run) in section 18 describes that measurement on two p5.48xlarge instances with an
              EFA-enabled PERSISTENT-1000 file system and an S3 bucket.
            </li>
          </ol>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
