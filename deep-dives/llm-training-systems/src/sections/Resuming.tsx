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
  GUIDE_URL,
  PYTORCH_TAG,
  TORCHTITAN_TAG,
  MEGATRON_TAG,
} from '../components/Cite';
import { useNarrow } from '../components/useNarrow';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** The Llama 3 Herd of Models, Sec 3.3.4 (interruptions, stragglers). */
const LLAMA3 = arxiv('2407.21783v3');
/** MegaScale (NSDI 2024), Sec 6.3: computational stragglers and late reduce-scatter launches. */
const MEGASCALE = arxiv('2402.15627v1');
/** Understanding Stragglers in Large Model Training Using What-if Analysis (OSDI 2025). */
const STRAGGLERS = arxiv('2505.05713v2');
/** FALCON: Pinpointing and Mitigating Stragglers for Large-Scale Hybrid-Parallel Training. */
const FALCON = arxiv('2410.12588v1');

/** PyTorch v2.15.0 torchrun: docstring (failure modes, notices) and the --max-restarts argument. */
function torchrun(lines: string): string {
  return gh('pytorch/pytorch', PYTORCH_TAG, 'torch/distributed/run.py', lines);
}
/** PyTorch v2.15.0 reproducibility notes. */
function randomness(lines?: string): string {
  return gh('pytorch/pytorch', PYTORCH_TAG, 'docs/source/notes/randomness.md', lines);
}
/** TorchTitan v0.4.0: set_determinism, the garbage collector and the training engine. */
function ttUtils(lines: string): string {
  return gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/distributed/utils.py', lines);
}
function ttGc(lines: string): string {
  return gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/tools/garbage_collector.py', lines);
}
function ttEngine(lines: string): string {
  return gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/training_engine.py', lines);
}
/** Megatron Core core_v0.20.0: GPT dataset indices, the pretraining sampler, training config. */
function mgDataset(lines: string): string {
  return gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/datasets/gpt_dataset.py', lines);
}
function mgSampler(lines: string): string {
  return gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/training/datasets/data_samplers.py', lines);
}
function mgConfig(lines: string): string {
  return gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/training/config/training_config.py', lines);
}
/** TorchFT v0.2.0 (the only release tag; peeled commit b8a096f9f23589ec93e988e2368a934cab01b890). */
const TORCHFT_TAG = 'v0.2.0';
function torchftReadme(lines: string): string {
  return gh('meta-pytorch/torchft', TORCHFT_TAG, 'README.md', lines);
}
function torchftManager(lines: string): string {
  return gh('meta-pytorch/torchft', TORCHFT_TAG, 'torchft/manager.py', lines);
}
/** torchdata v0.11.0 StatefulDataLoader README. */
const SDL_README = gh('pytorch/data', 'v0.11.0', 'torchdata/stateful_dataloader/README.md', 'L8-L15');
/** MosaicML Streaming v0.13.0 README (vendor claims). */
const STREAMING_README = gh('mosaicml/streaming', 'v0.13.0', 'README.md', 'L215-L226');

/** Slurm sbatch manual (current online page). */
const SBATCH = 'https://slurm.schedmd.com/sbatch.html';
/** SageMaker HyperPod documentation. */
const HP_AUTO_RESUME =
  'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html';
const HP_OPERATOR = 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator.html';
const HP_ELASTIC = 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-elastic-training.html';
/** NCCL user guide 2.32.3 (the newest archived guide on 2026-10-31). */
const NCCL_GUIDE = 'https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/index.html';
const NCCL_ENV = 'https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/env.html';

/** A1 protocol inputs, cited from the registers without re-opening them. */
const EC2_PRICE_LIST =
  'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv';
const OD_QUOTAS = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html';
const DLAMI_20261027 =
  'https://docs.aws.amazon.com/dlami/latest/devguide/aws-deep-learning-ami-gpubaseoss-ul2404-2026-10-28.html';
const REGISTER_DATE = '2026-10-30';

/* ------------------------------------------------------------------------ */
/* Diagram: one step across eight ranks, one of them slow                   */
/* ------------------------------------------------------------------------ */

const FONT = 'sans-serif';
const INK = '#16191f';
const MUTED = '#414d5c';
const BLUE = '#0972d3';
const AMBER = '#ec7211';
const AMBER_BAND = '#fdf3ec';
const SLATE = '#414d5c';
const DIVIDER = '#d1d5db';

const RANKS = [0, 1, 2, 3, 4, 5, 6, 7];
const SLOW_RANK = 5;

interface StragglerLayout {
  W: number;
  H: number;
  titleY: number;
  subY: number;
  title: string;
  sub: string;
  legend: { x: number; y: number; text: string; kind: 'compute' | 'extra' | 'wait' | 'transfer' }[];
  annoY: number;
  waitLabel: string;
  rowTop: number;
  rowH: number;
  barH: number;
  labelX: number;
  t0: number;
  compute: number;
  slow: number;
  transfer: number;
  axisEnd: number;
  timeLabel: { x: number; y: number; anchor: 'start' | 'end' };
  /** Timer panel: beside the timeline when wide, below it when narrow. */
  panelTitle?: { x: number; y: number; text: string };
  colHeadY: number;
  col1: number;
  col2: number;
  colW: number;
  timerTop: number;
  timerRowH: number;
  timerBarH: number;
  timerLabels: boolean;
  separatorX?: number;
  notes: { y: number; text: string }[];
}

const WIDE: StragglerLayout = {
  W: 900,
  H: 416,
  titleY: 24,
  subY: 42,
  title: 'One slow rank stretches the step for all eight',
  sub: 'Eight data-parallel ranks in one step: forward and backward compute, then the gradient all-reduce',
  legend: [
    { x: 24, y: 68, text: 'forward and backward compute', kind: 'compute' },
    { x: 236, y: 68, text: 'extra compute on rank 5', kind: 'extra' },
    { x: 428, y: 68, text: 'waiting inside the all-reduce', kind: 'wait' },
    { x: 656, y: 68, text: 'all-reduce data transfer', kind: 'transfer' },
  ],
  annoY: 116,
  waitLabel: '7 ranks wait here',
  rowTop: 126,
  rowH: 28,
  barH: 18,
  labelX: 24,
  t0: 84,
  compute: 280,
  slow: 350,
  transfer: 80,
  axisEnd: 560,
  timeLabel: { x: 568, y: 360, anchor: 'start' },
  panelTitle: { x: 612, y: 96, text: "What each rank's timers show" },
  colHeadY: 116,
  col1: 612,
  col2: 764,
  colW: 110,
  timerTop: 126,
  timerRowH: 28,
  timerBarH: 18,
  timerLabels: false,
  separatorX: 590,
  notes: [
    { y: 384, text: 'The seven healthy ranks book the wait as time inside the all-reduce.' },
    {
      y: 402,
      text: 'Rank 5 shows the longest compute and the shortest all-reduce: rank by compute time to find it.',
    },
  ],
};

const NARROW: StragglerLayout = {
  W: 400,
  H: 604,
  titleY: 22,
  subY: 38,
  title: 'One slow rank stretches every step',
  sub: 'Eight ranks: compute, then the all-reduce',
  legend: [
    { x: 12, y: 60, text: 'compute', kind: 'compute' },
    { x: 206, y: 60, text: 'extra compute, rank 5', kind: 'extra' },
    { x: 12, y: 78, text: 'waiting in all-reduce', kind: 'wait' },
    { x: 206, y: 78, text: 'all-reduce transfer', kind: 'transfer' },
  ],
  annoY: 104,
  waitLabel: '7 ranks wait',
  rowTop: 114,
  rowH: 26,
  barH: 16,
  labelX: 12,
  t0: 58,
  compute: 200,
  slow: 250,
  transfer: 60,
  axisEnd: 384,
  timeLabel: { x: 384, y: 346, anchor: 'end' },
  panelTitle: { x: 12, y: 372, text: "What each rank's timers show" },
  colHeadY: 392,
  col1: 58,
  col2: 224,
  colW: 130,
  timerTop: 400,
  timerRowH: 18,
  timerBarH: 12,
  timerLabels: true,
  notes: [
    { y: 562, text: 'Healthy ranks book the wait as all-reduce time.' },
    { y: 578, text: 'Rank 5 shows the longest compute and the' },
    { y: 594, text: 'shortest all-reduce: rank by compute time.' },
  ],
};

const HATCH_ID = 'resuming-straggler-hatch';
const ARROW_ID = 'resuming-straggler-ah';

function fillFor(kind: 'compute' | 'extra' | 'wait' | 'transfer'): string {
  if (kind === 'compute') return BLUE;
  if (kind === 'extra') return AMBER;
  if (kind === 'wait') return `url(#${HATCH_ID})`;
  return SLATE;
}

function StragglerDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref);
  const L = narrow ? NARROW : WIDE;

  const computeEnd = L.t0 + L.compute;
  const slowEnd = L.t0 + L.slow;
  const stepEnd = slowEnd + L.transfer;
  const rowsBottom = L.rowTop + RANKS.length * L.rowH;
  const axisY = rowsBottom + 6;
  const scale = L.colW / L.slow;
  const timerRowsBottom = L.timerTop + RANKS.length * L.timerRowH;

  const rowY = (i: number) => L.rowTop + i * L.rowH;
  const barY = (i: number) => rowY(i) + (L.rowH - L.barH) / 2;
  const timerRowY = (i: number) => L.timerTop + i * L.timerRowH;
  const timerBarY = (i: number) => timerRowY(i) + (L.timerRowH - L.timerBarH) / 2;

  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${L.W} ${L.H}`}
        role="img"
        aria-labelledby="resuming-straggler-title"
        aria-describedby="resuming-straggler-desc"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <title id="resuming-straggler-title">
          One synchronous training step across eight data-parallel ranks in which rank 5 computes
          more slowly than the others. The seven healthy ranks finish their forward and backward
          compute first and wait inside the gradient all-reduce until rank 5 arrives, so every
          rank&apos;s step ends when the slowest one does.
        </title>
        <desc id="resuming-straggler-desc">
          A timer on each rank books the wait as all-reduce time on the seven healthy ranks, while
          rank 5 reports the longest compute time and the shortest all-reduce. Ranking ranks by
          compute time finds the straggler; ranking them by time in the collective points at the
          healthy ranks. Schematic, not measured.
        </desc>
        <defs>
          <pattern
            id={HATCH_ID}
            width={6}
            height={6}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width={6} height={6} fill="#fbf3d5" />
            <line x1={0} y1={0} x2={0} y2={6} stroke="#8b6c00" strokeWidth={1.5} />
          </pattern>
          <marker
            id={ARROW_ID}
            viewBox="0 0 10 10"
            refX={9}
            refY={5}
            markerWidth={8}
            markerHeight={8}
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill={MUTED} />
          </marker>
        </defs>
        <rect x={0} y={0} width={L.W} height={L.H} rx={8} fill="#ffffff" />

        <text x={L.labelX} y={L.titleY} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
          {L.title}
        </text>
        <text x={L.labelX} y={L.subY} fontFamily={FONT} fontSize={11} fill={MUTED}>
          {L.sub}
        </text>

        {/* Legend */}
        {L.legend.map((item) => (
          <g key={item.text}>
            <rect
              x={item.x}
              y={item.y - 9}
              width={16}
              height={10}
              fill={fillFor(item.kind)}
              stroke={item.kind === 'wait' ? '#8b6c00' : 'none'}
              strokeWidth={1}
            />
            <text x={item.x + 22} y={item.y} fontFamily={FONT} fontSize={11} fill={INK}>
              {item.text}
            </text>
          </g>
        ))}

        {/* Rank 5 band, across the timeline (and the timer columns when they sit beside it) */}
        <rect
          x={L.labelX - 8}
          y={rowY(SLOW_RANK)}
          width={L.W - 2 * (L.labelX - 8)}
          height={L.rowH}
          fill={AMBER_BAND}
        />

        {/* Annotations above the rows */}
        <text
          x={(computeEnd + slowEnd) / 2}
          y={L.annoY}
          fontFamily={FONT}
          fontSize={11}
          fontWeight={600}
          fill="#8b6c00"
          textAnchor="middle"
        >
          {L.waitLabel}
        </text>
        <text x={stepEnd} y={L.annoY} fontFamily={FONT} fontSize={11} fontWeight={600} fill={MUTED} textAnchor="middle">
          step ends
        </text>
        <line
          x1={stepEnd}
          y1={L.annoY + 4}
          x2={stepEnd}
          y2={axisY}
          stroke={MUTED}
          strokeWidth={1.2}
          strokeDasharray="4 3"
        />

        {/* Timeline rows */}
        {RANKS.map((r) => {
          const slow = r === SLOW_RANK;
          return (
            <g key={`row-${r}`}>
              <text
                x={L.labelX}
                y={barY(r) + L.barH / 2 + 4}
                fontFamily={FONT}
                fontSize={11}
                fontWeight={slow ? 600 : 400}
                fill={INK}
              >
                {`rank ${r}`}
              </text>
              <rect x={L.t0} y={barY(r)} width={L.compute} height={L.barH} fill={BLUE} />
              {slow ? (
                <rect x={computeEnd} y={barY(r)} width={L.slow - L.compute} height={L.barH} fill={AMBER} />
              ) : (
                <rect
                  x={computeEnd}
                  y={barY(r)}
                  width={L.slow - L.compute}
                  height={L.barH}
                  fill={`url(#${HATCH_ID})`}
                  stroke="#8b6c00"
                  strokeWidth={1}
                />
              )}
              <rect x={slowEnd} y={barY(r)} width={L.transfer} height={L.barH} fill={SLATE} />
            </g>
          );
        })}

        {/* Time axis */}
        <line
          x1={L.t0}
          y1={axisY}
          x2={L.axisEnd}
          y2={axisY}
          stroke={MUTED}
          strokeWidth={1.2}
          markerEnd={`url(#${ARROW_ID})`}
        />
        <text
          x={L.timeLabel.x}
          y={L.timeLabel.y}
          fontFamily={FONT}
          fontSize={11}
          fill={MUTED}
          textAnchor={L.timeLabel.anchor}
        >
          time
        </text>

        {/* Timer panel */}
        {L.separatorX !== undefined && (
          <line
            x1={L.separatorX}
            y1={L.annoY - 34}
            x2={L.separatorX}
            y2={rowsBottom}
            stroke={DIVIDER}
            strokeWidth={1}
            strokeDasharray="5 4"
          />
        )}
        {L.panelTitle && (
          <text
            x={L.panelTitle.x}
            y={L.panelTitle.y}
            fontFamily={FONT}
            fontSize={13}
            fontWeight={600}
            fill={INK}
          >
            {L.panelTitle.text}
          </text>
        )}
        {narrow && (
          <rect
            x={L.labelX - 8}
            y={timerRowY(SLOW_RANK)}
            width={L.W - 2 * (L.labelX - 8)}
            height={L.timerRowH}
            fill={AMBER_BAND}
          />
        )}
        <text
          x={L.col1 + L.colW / 2}
          y={L.colHeadY}
          fontFamily={FONT}
          fontSize={11}
          fontWeight={600}
          fill={MUTED}
          textAnchor="middle"
        >
          compute time
        </text>
        <text
          x={L.col2 + L.colW / 2}
          y={L.colHeadY}
          fontFamily={FONT}
          fontSize={11}
          fontWeight={600}
          fill={MUTED}
          textAnchor="middle"
        >
          time in all-reduce
        </text>
        {RANKS.map((r) => {
          const slow = r === SLOW_RANK;
          const y = timerBarY(r);
          const computeW = L.compute * scale;
          const extraW = (L.slow - L.compute) * scale;
          const waitW = (L.slow - L.compute) * scale;
          const transferW = L.transfer * scale;
          return (
            <g key={`timer-${r}`}>
              {L.timerLabels && (
                <text
                  x={L.labelX}
                  y={y + L.timerBarH / 2 + 4}
                  fontFamily={FONT}
                  fontSize={11}
                  fontWeight={slow ? 600 : 400}
                  fill={INK}
                >
                  {`rank ${r}`}
                </text>
              )}
              <rect x={L.col1} y={y} width={computeW} height={L.timerBarH} fill={BLUE} />
              {slow && <rect x={L.col1 + computeW} y={y} width={extraW} height={L.timerBarH} fill={AMBER} />}
              {slow ? (
                <rect x={L.col2} y={y} width={transferW} height={L.timerBarH} fill={SLATE} />
              ) : (
                <>
                  <rect
                    x={L.col2}
                    y={y}
                    width={waitW}
                    height={L.timerBarH}
                    fill={`url(#${HATCH_ID})`}
                    stroke="#8b6c00"
                    strokeWidth={1}
                  />
                  <rect x={L.col2 + waitW} y={y} width={transferW} height={L.timerBarH} fill={SLATE} />
                </>
              )}
            </g>
          );
        })}
        {narrow && (
          <line
            x1={L.labelX}
            y1={timerRowsBottom + 6}
            x2={L.W - L.labelX}
            y2={timerRowsBottom + 6}
            stroke={DIVIDER}
            strokeWidth={1}
          />
        )}

        {/* Reading notes */}
        {L.notes.map((n) => (
          <text key={n.text} x={L.labelX} y={n.y} fontFamily={FONT} fontSize={11} fill={INK}>
            {n.text}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function Resuming() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Make a restart continue the same run, and find the slow rank before it costs you a tenth of the cluster: stragglers wasted 10.4% of GPU-hours in ByteDance's trace of 3,079 large jobs (PyTorch v2.15.0, TorchTitan v0.4.0, Megatron Core core_v0.20.0 and TorchFT v0.2.0, with AWS, Slurm and NCCL documentation and papers, read 2026-10-31)"
          >
            19. Resuming Correctly
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Resuming correctly means the restarted job continues the same run: the same weights and
            optimizer state, the same position in the data, the same random streams. Four things decide
            whether it does: the layer that restarts the job, the way the job changes size, the
            determinism of its data order and arithmetic, and stragglers, the slow ranks that never
            fail but hold every step back. A rank is one training process, one per GPU.
          </Box>
          <Box variant="p">
            Restarts are routine at scale. Llama 3 405B, trained on up to 16K GPUs, had 419 unexpected
            interruptions in a 54-day window of pre-training{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.4
            </Cite>
            , one every 3.1 hours by our arithmetic (section 17, Failure Is the Steady State, turns a
            node count into that interval). Stragglers cost about as much and never stop the job: in
            ByteDance&apos;s trace of 3,079 pre-training jobs on 128 GPUs or more, they wasted 10.4% of
            the allocated GPU-hours{' '}
            <Cite tier={3} href={STRAGGLERS} venue="OSDI 2025">
              Understanding Stragglers in Large Model Training, Sections 3.1 and 4.1
            </Cite>
            . The challenge is to make each restart lose only the work since the last checkpoint, and
            to find the slow rank from per-rank timing.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know which layer brings the job back after a failure and what it expects from your script; plain torchrun with its default settings does not retry at all"
          >
            Who restarts the job
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every restart mechanism stops the processes, starts them again, and expects the training
            script to load the latest checkpoint before its first step. PyTorch&apos;s launcher writes
            that contract into the structure it recommends for a script: load the checkpoint,
            initialise, train{' '}
            <Cite tier={1} href={torchrun('L393-L404')} kind="code">
              PyTorch run.py L393-L404
            </Cite>
            . The layers differ in what triggers the restart; what the checkpoint must hold, and how
            often to write it, is section 18, Checkpointing.
          </Box>
          <Box variant="p">
            <strong>torchrun, PyTorch&apos;s launcher.</strong> When any worker fails, torchrun stops
            all workers and restarts them, up to <code>--max-restarts</code> times{' '}
            <Cite tier={1} href={torchrun('L308-L309')}>
              PyTorch run.py L308-L309
            </Cite>
            , and that flag defaults to 0{' '}
            <Cite tier={1} href={torchrun('L563-L570')} kind="code">
              PyTorch run.py L563-L570
            </Cite>
            , so with default settings one failure ends the job. On a failure or a membership change
            every surviving worker is killed at once, and a worker can come back with a different{' '}
            <code>RANK</code>, so the script must never tie saved state to a rank number{' '}
            <Cite tier={1} href={torchrun('L379-L388')}>
              PyTorch run.py L379-L388
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Slurm.</strong> <code>--requeue</code> makes a batch job eligible to be requeued
            after a node failure or a preemption; a requeued job starts its batch script from the
            beginning under the same job ID, and the cluster&apos;s <code>JobRequeue</code> setting
            gives the default{' '}
            <Cite tier={1} href={SBATCH}>
              Slurm sbatch manual, --requeue
            </Cite>
            . <code>--signal=&lt;sig&gt;@&lt;seconds&gt;</code> sends a signal that many seconds before
            the job&apos;s end time, possibly up to 60 seconds earlier, to every job step but not the
            batch shell; without it, nothing is sent before the end{' '}
            <Cite tier={1} href={SBATCH}>
              Slurm sbatch manual, --signal
            </Cite>
            . The script has to catch it: Megatron&apos;s <code>exit_signal_handler</code> saves a
            checkpoint and shuts down when SIGTERM arrives, and it is off by default{' '}
            <Cite tier={1} href={mgConfig('L79-L83')} kind="code">
              Megatron training_config.py L79-L83
            </Cite>
            . On a reservation with a fixed end, set the job&apos;s time limit so the signal lands
            before the reservation starts terminating instances, our reading; section 22, Capacity
            &amp; Cost, gives that edge.
          </Box>
          <Box variant="p">
            <strong>SageMaker HyperPod.</strong> Replacing a broken node and restarting the job are two
            separate steps, and HyperPod Slurm offers both. Node recovery is set to Automatic by
            default, which reboots or replaces faulty nodes. A job step launched with{' '}
            <code>srun --auto-resume=1</code> is retried after a hardware failure: its faulty nodes are
            always replaced rather than rebooted, and the job restarts from the last checkpoint it
            saved, while a job without auto-resume simply exits. Keep every setup step inside the one{' '}
            <code>srun</code> command that auto-resume retries, and read the node list from Slurm at
            start-up, since <code>$SLURM_JOB_NODELIST</code> can be out of date after a resume{' '}
            <Cite tier={1} href={HP_AUTO_RESUME}>
              HyperPod Slurm auto-resume guide
            </Cite>
            . On HyperPod EKS (Amazon Elastic Kubernetes Service), the HyperPod training operator
            restarts failed training processes in place instead of the whole job and detects hung jobs;
            its documented support lists PyTorch 2.4.0 to 2.7.1, so check it against your stack{' '}
            <Cite tier={1} href={HP_OPERATOR}>
              HyperPod training operator guide
            </Cite>{' '}
            (sections 24 and 25, The Slurm Family and The Kubernetes Family).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Shrink or grow a job by changing only its data-parallel width, and decide what the global batch does when the width changes"
          >
            Changing the job&apos;s size without changing the run
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Elastic training lets a job continue on fewer or more nodes than it started with, by
            changing the number of data-parallel replicas: the copies of the model, each possibly
            sharded over several GPUs, that train on different slices of the batch. The tensor- and
            pipeline-parallel layout fixes which slice of every weight each rank holds, while a
            replica can come or go without touching the others&apos; shards; that is our reading of why
            both tools below scale this one dimension. The quantity to watch is the global batch, the
            sequences per optimizer step across all replicas, which follows the replica count unless
            something holds it.
          </Box>
          <Box variant="p">
            <strong>HyperPod elastic training</strong> (EKS, training operator v1.2 or later) changes
            the number of data-parallel replicas through automatic checkpointing and resumption at the
            new size, so each resize is a restart from a PyTorch Distributed Checkpoint (DCP). It
            supports DDP (Distributed Data Parallel) and FSDP (Fully Sharded Data Parallel), replaces{' '}
            <code>torchrun</code> with <code>hyperpodrun</code>, and does not currently work with
            checkpointless training (recovery from peers&apos; in-memory state; section 25), managed
            tiered checkpointing or Spot instances{' '}
            <Cite tier={1} href={HP_ELASTIC}>
              HyperPod elastic training guide
            </Cite>
            . A per-scale configuration holds the batch: AWS&apos;s example keeps a global batch of 128
            and a learning rate of 4e-4 at two and three nodes, and at three nodes, where 128 does not
            divide evenly, it gives 16 data-parallel groups a local batch of 5 and the rest 6{' '}
            <Cite tier={1} href={HP_ELASTIC}>
              HyperPod elastic training guide, scale_config
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>TorchFT</strong>, PyTorch&apos;s fault-tolerance library (v0.2.0), keeps training
            through a failure without restarting the job. A lighthouse server tracks the healthy
            replica groups by heartbeats on every step, so membership changes one step at a time, and a
            recovering or new replica copies live state from a healthy peer instead of reading a
            checkpoint from storage. Its fault-tolerant HSDP (hybrid sharded data parallel) does this
            across the replicated dimension, with any mix of FSDP and TP (tensor parallelism) inside
            each replica{' '}
            <Cite tier={1} href={torchftReadme('L24-L52')}>
              TorchFT README L24-L52
            </Cite>
            .
          </Box>
          <Box variant="p">
            TorchFT&apos;s batch behaviour needs a decision. The default world-size mode,{' '}
            <code>DYNAMIC</code>, uses every available replica and normalises the gradient by their
            number{' '}
            <Cite tier={1} href={torchftManager('L123-L138')} kind="code">
              TorchFT manager.py L123-L138
            </Cite>{' '}
            <Cite tier={1} href={torchftManager('L174')} kind="code">
              L174
            </Cite>
            ; each replica keeps its local batch, so the global batch shrinks while a replica is
            missing. <code>FIXED_WITH_SPARES</code> keeps the active replicas at{' '}
            <code>min_replica_size</code>, and spares contribute zero gradients{' '}
            <Cite tier={1} href={torchftManager('L132-L135')} kind="code">
              TorchFT manager.py L132-L135
            </Cite>
            ; in either mode a step
            commits only when at least <code>min_replica_size</code> replicas took part{' '}
            <Cite tier={1} href={torchftManager('L901-L902')} kind="code">
              TorchFT manager.py L901-L902
            </Cite>
            . Under the default, a learning-rate schedule tuned for a fixed batch sees a smaller batch
            for every step a replica is missing, our reading; the manager&apos;s{' '}
            <code>batches_committed</code> counter adds up the replicas that took part in each step and
            so records the work actually done{' '}
            <Cite tier={1} href={torchftManager('L990-L1001')} kind="code">
              TorchFT manager.py L990-L1001
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Make data order a function of a seed and a counter so a restart reads exactly the next sample, and keep bitwise-identical runs for debugging, where their cost is paid on purpose"
          >
            The same data, in the same order
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A restart that reloads the weights but replays or skips data is a different run. The
            dependable design makes data order a function rather than a history: compute the whole
            order from a seed, and checkpoint only how far the run has read.
          </Box>
          <Box variant="p">
            Megatron works this way. Its GPT dataset builds a document index, a sample index (the
            document and offset where each sample starts) and a shuffle index (a random permutation of
            the samples) from <code>numpy.random.RandomState(random_seed)</code>, caches them as files
            and memory-maps them{' '}
            <Cite tier={1} href={mgDataset('L475-L494')} kind="code">
              Megatron gpt_dataset.py L475-L494
            </Cite>{' '}
            <Cite tier={1} href={mgDataset('L590')} kind="code">
              L590
            </Cite>{' '}
            <Cite tier={1} href={mgDataset('L400-L413')} kind="code">
              L400-L413
            </Cite>
            . Its pretraining sampler starts at <code>consumed_samples</code> and walks forward, each
            data-parallel rank taking its slice of every block of samples{' '}
            <Cite tier={1} href={mgSampler('L186-L198')} kind="code">
              Megatron data_samplers.py L186-L198
            </Cite>
            . Resuming needs one integer from the checkpoint, and the global order does not depend on
            how many ranks read it, our reading of the sampler; keep the index cache on storage the
            restarted job can reach, or it is rebuilt.
          </Box>
          <Box variant="p">
            <code>torchdata</code>&apos;s <code>StatefulDataLoader</code> (v0.11.0) is a drop-in
            replacement for PyTorch&apos;s <code>DataLoader</code> that can save and load its state. By
            default the state is the number of batches yielded, and loading it naively fast-forwards
            the sampler or dataset, unless those implement their own state methods; it gathers state
            across one rank&apos;s worker processes but not across ranks{' '}
            <Cite tier={1} href={SDL_README}>
              torchdata StatefulDataLoader README L8-L15
            </Cite>
            . So every data-parallel rank&apos;s loader state goes into the checkpoint, and the default
            fast-forward replays the pipeline up to the saved position, which takes longer the further
            the run had read, our reading. MosaicML Streaming states that its sample order is the same
            for any number of GPUs, nodes or CPU workers, so a run resumes mid-epoch &quot;in seconds,
            not hours&quot;{' '}
            <Cite tier={1} href={STREAMING_README} kind="vendor-claim">
              MosaicML Streaming README L215-L226
            </Cite>
            ; both are the project&apos;s own claims.
          </Box>
          <Box variant="p">
            Random streams follow the same rule. TorchTitan has every rank agree on one seed, broadcast
            from rank 0 when none is configured, and adds each rank&apos;s position on named mesh axes
            such as the pipeline stage, so stages draw distinct streams while the ranks inside one
            group share one{' '}
            <Cite tier={1} href={ttUtils('L114-L124')} kind="code">
              TorchTitan utils.py L114-L124
            </Cite>{' '}
            <Cite tier={1} href={ttUtils('L196-L232')} kind="code">
              L196-L232
            </Cite>
            . A seed reproduces the streams of step 0; the streams a run had reached by its checkpoint
            come back only if the generator state was saved with it, our reading.
          </Box>
          <Box variant="p">
            Bitwise-identical results are a narrower promise. Completely reproducible results are not
            guaranteed across PyTorch releases, individual commits or platforms, and deterministic
            operations are often slower than nondeterministic ones{' '}
            <Cite tier={1} href={randomness('L5-L20')}>
              PyTorch reproducibility notes L5-L20
            </Cite>
            . TorchTitan&apos;s determinism switch sets the knobs: deterministic algorithms, cuDNN
            deterministic mode with benchmarking off, a fixed cuBLAS workspace (
            <code>CUBLAS_WORKSPACE_CONFIG=:4096:8</code>) and compiled flex attention without
            autotuning. It logs &quot;Deterministic algorithm enabled (expect perf degradation)&quot;{' '}
            <Cite tier={1} href={ttUtils('L137-L171')} kind="code">
              TorchTitan utils.py L137-L171
            </Cite>
            , a warning that reports no measured figure.
          </Box>
          <Box variant="p">
            Collectives leave a gap. Neither PyTorch&apos;s reproducibility notes{' '}
            <Cite tier={1} href={randomness()}>
              PyTorch reproducibility notes
            </Cite>{' '}
            nor NCCL&apos;s user guide (2.32.3){' '}
            <Cite tier={1} href={NCCL_GUIDE}>
              NCCL user guide 2.32.3
            </Cite>{' '}
            says whether a collective returns bitwise-identical results run to run. NCCL (NVIDIA
            Collective Communications Library) chooses its algorithm from the node topology and
            architecture unless <code>NCCL_ALGO</code> pins it{' '}
            <Cite tier={1} href={NCCL_ENV}>
              NCCL 2.32.3 environment variables, NCCL_ALGO
            </Cite>
            , so a restart on a different set of nodes, as after a node replacement, can change the
            order of a floating-point reduction and with it the low bits of the result, our reading.
            For a resume, the same run therefore means the same weights, optimizer and scheduler state,
            the same data in the same order and the same random streams, with a loss curve that may
            differ in its low bits, our reading of these sources.
          </Box>
          <ExpandableSection headerText="A1 protocol (not yet run)">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>What it would measure.</strong> One all-reduce size repeated ten times on a
                fixed pair of instances, outputs compared bitwise, inside A1&apos;s nccl-tests
                collective baselines (
                <Link external href={GUIDE_URL}>
                  research guide, section 5
                </Link>
                ).
              </Box>
              <Box variant="p">
                <strong>On what.</strong> Two p5.48xlarge in a cluster placement group on the Deep
                Learning Base GPU AMI (Amazon Machine Image) release 20261027{' '}
                <Cite tier={1} href={DLAMI_20261027} accessed={REGISTER_DATE}>
                  DLAMI release notes, 20261027
                </Cite>
                , connected by EFA (Elastic Fabric Adapter).
              </Box>
              <Box variant="p">
                <strong>Prediction, our reading and not a result.</strong> Identical outputs across the
                ten repeats, since nothing the documented algorithm choice depends on changes between
                them. A difference would place run-to-run variation inside NCCL itself; a match would
                still say nothing about a restart on other nodes.
              </Box>
              <Box variant="p">
                <strong>Cost.</strong> About two hours on two instances for all of A1: 2 x 2 x $55.04 =
                $220 at the On-Demand rate in us-east-1 on 2026-10-30{' '}
                <Cite tier={1} href={EC2_PRICE_LIST} accessed={REGISTER_DATE}>
                  AWS Price List, AmazonEC2 us-east-1, version 20261029175634
                </Cite>
                , once the account&apos;s On-Demand quota for P instances has been raised{' '}
                <Cite tier={1} href={OD_QUOTAS} accessed={REGISTER_DATE}>
                  EC2 On-Demand Instance quotas
                </Cite>
                . Teardown: one stack, deleted at the end and verified by listing instances by its tag.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find the rank that holds every step back: stragglers wasted 10.4% of GPU-hours in ByteDance's trace, and the waiting shows up in the healthy ranks' collectives"
          >
            Stragglers: the slow rank that never fails
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A straggler is a rank that runs slower than the others without failing. In a synchronous
            step every rank waits for the slowest at the next collective, so one slow rank sets the
            pace for all of them. Meta&apos;s Llama 3 team found that &quot;even a single straggler can
            slow down thousands of other GPUs, often appearing as functioning but slow
            communications&quot;{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.4
            </Cite>
            .
          </Box>
          <Box variant="p">
            The largest public measurement is ByteDance&apos;s: a trace from January to May 2024 of
            3,079 pre-training jobs on at least 128 GPUs, about half the cluster&apos;s GPU-hours for
            LLM training. 42.5% of the jobs straggled, running at least 10% slower than a simulated
            straggler-free run, and stragglers wasted 10.4% of the allocated GPU-hours{' '}
            <Cite tier={3} href={STRAGGLERS} venue="OSDI 2025">
              Understanding Stragglers, Sections 3.1 and 4.1
            </Cite>
            . Most of the waste came from slower computation rather than communication, and the
            slowdown did not grow with job size{' '}
            <Cite tier={3} href={STRAGGLERS} venue="OSDI 2025">
              Understanding Stragglers, Sections 4.3 and 4.4
            </Cite>
            . A tenth of the GPU-hours is the same order as the time Llama 3 and MegaScale lost to all
            their interruptions together, since each kept more than 90% effective training time
            (section 17), our reading across the reports; a straggler costs that much without ever
            appearing in a failure count.
          </Box>
          <StragglerDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured: bar lengths are schematic, and communication is drawn after
            compute without the overlap that section 8, Data Parallelism &amp; Sharding, describes.
          </Box>
          <Box variant="p">
            The waiting shows up in collectives, so a straggler is found by per-rank timing of compute,
            not by the rank that is waiting. The healthy ranks book their wait for rank 5 as collective
            time, while rank 5 arrives last and finds the others ready, so its own all-reduce is the
            shortest. Ranking ranks by time in collectives points at the healthy ones; ranking them by
            compute time points at the straggler, our reading of these reports.
          </Box>
          <Box variant="p">
            The causes ByteDance found were mostly inside the job. Problems on individual workers,
            hardware or software on one machine, explained more than half of the slowdown in only 1.7%
            of straggling jobs{' '}
            <Cite tier={3} href={STRAGGLERS} venue="OSDI 2025">
              Understanding Stragglers, Section 5.1
            </Cite>
            , and the authors conclude that &quot;traditional health metrics are unlikely to aid in
            detecting or preventing most stragglers&quot;. The most common causes they found were uneven
            partitioning of layers across pipeline stages, unbalanced sequence lengths across
            micro-batches (the slices of a batch that pass through the model one at a time), and pauses
            from Python&apos;s garbage collector{' '}
            <Cite tier={3} href={STRAGGLERS} venue="OSDI 2025">
              Understanding Stragglers, Section 5.6
            </Cite>
            , in a list they state is not exhaustive{' '}
            <Cite tier={3} href={STRAGGLERS} venue="OSDI 2025">
              Understanding Stragglers, Section 5.5
            </Cite>
            . Most steps of a straggling job slowed by a similar amount, so a few sampled steps are
            enough to profile one{' '}
            <Cite tier={3} href={STRAGGLERS} venue="OSDI 2025">
              Understanding Stragglers, Section 4.2
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Garbage collection</strong> has a fix in the training code. A collection can pause a
            Python process for hundreds of milliseconds, at different steps on different ranks.
            ByteDance turned automatic collection off and ran it on every rank at the same step
            interval: every 500 steps gave 12.6% on a job with 128 data-parallel ranks, and the interval
            needs tuning per job, because too long runs out of memory and too short costs speed{' '}
            <Cite tier={3} href={STRAGGLERS} venue="OSDI 2025">
              Understanding Stragglers, Section 5.4
            </Cite>
            . TorchTitan v0.4.0 does this by default: it disables Python&apos;s automatic collection
            and collects every 50 steps (<code>gc_freq</code>){' '}
            <Cite tier={1} href={ttGc('L21-L47')} kind="code">
              TorchTitan garbage_collector.py L21-L47
            </Cite>{' '}
            <Cite tier={1} href={ttGc('L65-L66')} kind="code">
              L65-L66
            </Cite>{' '}
            <Cite tier={1} href={ttEngine('L118-L119')} kind="code">
              training_engine.py L118-L119
            </Cite>{' '}
            <Cite tier={1} href={ttEngine('L622')} kind="code">
              L622
            </Cite>
            . Megatron Core core_v0.20.0 leaves it off: <code>manual_gc</code> defaults to False and{' '}
            <code>manual_gc_interval</code> to 0{' '}
            <Cite tier={1} href={mgConfig('L91-L100')} kind="code">
              Megatron training_config.py L91-L100
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Sequence lengths</strong> need balancing across ranks: a prototype that
            redistributes sequences so every data-parallel rank and micro-batch carries an even load
            gave 23.9% more throughput on one representative job with 32K-token sequences, with
            deployment at scale left to future work{' '}
            <Cite tier={3} href={STRAGGLERS} venue="OSDI 2025">
              Understanding Stragglers, Section 5.3
            </Cite>
            . <strong>Pipeline stages</strong> need even work per stage, which section 10, Pipeline
            Parallelism &amp; the Bubble, covers.
          </Box>
          <ExpandableSection headerText="Other straggler reports, one figure each">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>MegaScale.</strong> Specific hosts took about 10% longer than other ranks for
                the same forward computation in every experiment; removing them raised MFU (model FLOPs
                utilization) by about 0.7%. On the software side, some ranks launched the
                data-parallel reduce-scatter late, &quot;forcing a wait for the slowest rank to catch
                up&quot;{' '}
                <Cite tier={3} href={MEGASCALE} venue="NSDI 2024">
                  MegaScale, Section 6.3
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>Llama 3.</strong> Meta built tools to rank potentially problematic
                communications from selected process groups, and investigating a few top suspects was
                usually enough to find the straggler{' '}
                <Cite tier={3} href={LLAMA3} venue="preprint">
                  Llama 3 Herd of Models, Section 3.3.4
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>ByteDance&apos;s worst cases.</strong> Every job more than three times slower
                than its straggler-free run was a large job in which fewer than 3% of the workers caused
                the slowdown, which the authors attribute, as a hypothesis, to server problems{' '}
                <Cite tier={3} href={STRAGGLERS} venue="OSDI 2025">
                  Understanding Stragglers, Section 4.1
                </Cite>
                . Machines matter at the tail even where the code dominates the total.
              </Box>
              <Box variant="p">
                <strong>Alibaba (FALCON).</strong> On a shared production cluster of more than 10,000
                GPUs, fail-slow episodes from compute and cross-node networking lasted from tens of
                seconds to nearly ten hours, and the practice was to treat them as failures and
                checkpoint and restart{' '}
                <Cite tier={3} href={FALCON} venue="preprint">
                  FALCON, Abstract
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
            description="Set the six things that make every restart continue the same run and give the straggler check its input"
          >
            Before the next restart
          </Header>
        }
      >
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>Give the job a restart path.</strong> Set <code>--max-restarts</code> above 0 on
            torchrun, or launch under the orchestrator&apos;s resume: <code>srun --auto-resume=1</code>{' '}
            on HyperPod Slurm, the training operator on HyperPod EKS, <code>--requeue</code> on your own
            Slurm. Start the script by loading the checkpoint.
          </li>
          <li>
            <strong>Catch the end of the allocation.</strong> Pair <code>--signal</code> with a handler
            that saves and exits, such as Megatron&apos;s <code>exit_signal_handler</code>.
          </li>
          <li>
            <strong>Checkpoint the data position on every rank.</strong> Derive data order from a seed
            and a sample counter, or save each rank&apos;s <code>StatefulDataLoader</code> state, and
            save the generator states (section 18).
          </li>
          <li>
            <strong>Decide what the global batch does when the job changes size.</strong> Hold it with
            HyperPod&apos;s per-scale configuration or TorchFT&apos;s <code>FIXED_WITH_SPARES</code>.
          </li>
          <li>
            <strong>Schedule garbage collection</strong> on every rank at the same step interval:
            TorchTitan&apos;s default, Megatron&apos;s <code>manual_gc</code>.
          </li>
          <li>
            <strong>Log each rank&apos;s compute time on every step</strong>, the forward and backward
            pass timed apart from its collectives, so section 29, What to Measure in a Run, has the
            input for its straggler check. The suspect is the rank with the longest compute, and most
            of the 10.4% of GPU-hours ByteDance lost to stragglers came from causes inside the job that
            a node health check does not see.
          </li>
        </ol>
      </Container>
    </SpaceBetween>
  );
}
