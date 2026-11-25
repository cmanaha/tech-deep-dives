import type { CSSProperties, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Derived, Toy } from '../components/Cite';
import { Figure, AnimatedFigure } from '../components/Figure';
import { CurFunnel } from '../components/figures/CurFunnel';
import { ARM, TASK_STORY } from '../lib/task';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const NEUTRAL_INK = '#5f6b7a';
const EMPHASIS = '#0972d3';
const CPU_FILL = '#e8f1fb';
const CPU_INK = '#1f5fa8';
const TENSOR_FILL = '#e6f6ea';
const TENSOR_INK = '#1e7b3a';
const VIDEO_FILL = '#fde8ef';
const VIDEO_INK = '#a8274f';
const STORE_FILL = '#eef0f2';
const STORE_INK = '#44505c';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 520, margin: '0 auto' };

const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/** The thread task, stated once for this section. */
const TASK_CLAUSE = `the ${ARM} asked to ${TASK_STORY}, with two cameras recording`;

/* ------------------------------------------------------------------------ */
/* Diagram 10.2 (animated): decode bounds the trainer                        */
/* ------------------------------------------------------------------------ */

const DECODE_STEPS: ReactNode[] = [
  'Compressed video sits on disk. Nothing in an MP4 file is a picture yet: every frame the trainer wants has to be decoded first.',
  'The dataloader workers, running on CPU cores, are asked for a batch. Each one seeks into the video files and decodes the frames it needs.',
  'Decoded frames are stacked into batches that queue for the GPU. While the queue holds a batch, the GPU runs one training step after another.',
  'With few cores beside the GPU the queue runs empty. The workers are flat out and the GPU waits for data between steps. On most eight-GPU EC2 sizes the budget is 24 vCPUs per GPU.',
  'Two ways to keep the queue full: more cores per GPU, or decode on the GPU video engine where the card supports the codec and the loader can use it.',
];

const CPU_SUB = [
  'waiting to be asked for a batch',
  'each worker decodes the frames it was asked for',
  'each worker decodes the frames it was asked for',
  'all busy, and still too slow for the GPU',
  'more cores per GPU: more frames per second',
];
const QUEUE_STATE = ['empty', 'empty', 'full', 'empty again', 'stays full'];
const GPU_STATE = [
  'nothing to train on yet',
  'nothing to train on yet',
  'running: a batch is always ready',
  'waiting for data',
  'running every step',
];
/** How many of the 12 cells of the GPU activity strip are filled at each step (illustrative). */
const GPU_BUSY = [0, 0, 12, 4, 12];

function DecodeBoundsDiagram({ step, reduced }: { step: number; reduced: boolean }) {
  const move = reduced ? 'none' : 'transform 700ms ease, opacity 500ms ease';
  const fade = reduced ? 'none' : 'opacity 500ms ease';
  const em = (on: boolean, ink: string) => ({ stroke: on ? EMPHASIS : ink, strokeWidth: on ? 2.5 : 1.5 });
  const swap = (lines: string[], x: number, y: number) =>
    lines.map((line, i) =>
      lines.indexOf(line) === i ? (
        <text key={line} x={x} y={y} fontFamily="sans-serif" fontSize="12" fill={INK} style={{ opacity: lines[step] === line ? 1 : 0, transition: fade }}>
          {line}
        </text>
      ) : null,
    );
  const tokenPos = (i: number): [number, number] => {
    if (step === 0) return [34 + i * 24, 60];
    if (step === 1) return [40 + i * 34, 160];
    if (step === 2) return [44 + i * 44, 303];
    return [44 + i * 44, 396];
  };
  const coresBusy = step === 1 || step >= 3;
  const engineOn = step === 4;
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 440" role="img" aria-labelledby="curating-decode-title" style={{ width: '100%', height: 'auto' }}>
        <title id="curating-decode-title">How video decode on CPU cores can leave a training GPU waiting for data</title>
        <desc>
          Top to bottom: compressed video on disk, dataloader workers on CPU cores, the GPU video engine, a queue of
          batches, and the GPU tensor cores. In the last step more cores and the video engine keep the queue full and
          the GPU runs every step.
        </desc>
        <rect x="0" y="0" width="400" height="440" fill="#fbfbfd" />

        {/* disk */}
        <rect x="20" y="12" width="360" height="76" rx="4" fill={STORE_FILL} {...em(step === 0, STORE_INK)} />
        <text x="34" y="32" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill={INK}>
          Disk
        </text>
        <text x="34" y="50" fontFamily="sans-serif" fontSize="12" fill={INK}>
          AV1 video in MP4 files, still compressed
        </text>
        {/* the stored frames stay on disk; the grey squares that travel are copies being read */}
        {Array.from({ length: 4 }, (_, i) => (
          <rect key={i} x={34 + i * 24} y={60} width="16" height="16" rx="2" fill="#ffffff" stroke={STORE_INK} strokeWidth="1" />
        ))}
        <path d="M200 90 V100 M195 99 L200 105 L205 99 Z" stroke={NEUTRAL_INK} strokeWidth="1.5" fill={NEUTRAL_INK} />

        {/* CPU cores */}
        <rect x="20" y="108" width="360" height="84" rx="4" fill={CPU_FILL} {...em(step === 1 || step === 4, CPU_INK)} />
        <text x="34" y="128" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill={INK}>
          CPU cores: the dataloader workers
        </text>
        {swap(CPU_SUB, 34, 146)}
        {Array.from({ length: 8 }, (_, i) => (
          <rect
            key={i}
            x={34 + i * 34}
            y={154}
            width="28"
            height="28"
            rx="3"
            fill={coresBusy ? '#bcd6f2' : '#ffffff'}
            stroke={CPU_INK}
            strokeWidth="1.5"
            style={{ opacity: i < 4 || step === 4 ? 1 : 0, transition: fade }}
          />
        ))}

        {/* GPU video engine */}
        <rect
          x="20"
          y="200"
          width="360"
          height="50"
          rx="4"
          fill={engineOn ? VIDEO_FILL : '#ffffff'}
          strokeDasharray={engineOn ? undefined : '5 3'}
          {...em(engineOn, VIDEO_INK)}
        />
        <text x="34" y="220" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill={INK}>
          GPU video engine (NVDEC)
        </text>
        {swap(
          [
            'idle: the stock loader decodes on the CPU',
            'idle: the stock loader decodes on the CPU',
            'idle: the stock loader decodes on the CPU',
            'idle: the stock loader decodes on the CPU',
            'or decode here, where the card supports the codec',
          ],
          34,
          238,
        )}
        <path d="M200 252 V262 M195 261 L200 267 L205 261 Z" stroke={NEUTRAL_INK} strokeWidth="1.5" fill={NEUTRAL_INK} />

        {/* queue */}
        <rect x="20" y="270" width="360" height="62" rx="4" fill="#ffffff" {...em(step === 2, NEUTRAL_INK)} />
        <text x="34" y="290" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill={INK}>
          Batches ready for the GPU
        </text>
        {Array.from({ length: 4 }, (_, i) => (
          <rect key={i} x={34 + i * 44} y={300} width="36" height="22" rx="3" fill="#fbfbfd" stroke={NEUTRAL_INK} strokeWidth="1" strokeDasharray="3 3" />
        ))}
        {swap(QUEUE_STATE, 224, 316)}
        <path d="M200 334 V344 M195 343 L200 349 L205 343 Z" stroke={NEUTRAL_INK} strokeWidth="1.5" fill={NEUTRAL_INK} />

        {/* GPU tensor cores */}
        <rect x="20" y="352" width="360" height="76" rx="4" fill={TENSOR_FILL} {...em(step === 3, TENSOR_INK)} />
        <text x="34" y="372" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill={INK}>
          GPU tensor cores: the training step
        </text>
        {swap(GPU_STATE, 34, 390)}
        {Array.from({ length: 12 }, (_, i) => {
          const busy = GPU_BUSY[step] === 12 || (GPU_BUSY[step] === 4 && i % 3 === 0);
          return <rect key={i} x={34 + i * 27} y={400} width="22" height="14" rx="2" fill={busy ? TENSOR_INK : '#ffffff'} stroke={TENSOR_INK} strokeWidth="1" />;
        })}

        {/* frames travelling: disk, cores, queue, then consumed by the GPU */}
        {Array.from({ length: 4 }, (_, i) => {
          const [x, y] = tokenPos(i);
          return (
            <rect
              key={`a${i}`}
              x="0"
              y="0"
              width="16"
              height="16"
              rx="2"
              fill={NEUTRAL_INK}
              style={{ transform: `translate(${x}px, ${y}px)`, opacity: step <= 2 ? 1 : 0, transition: move }}
            />
          );
        })}
        {/* the refilled queue of the last step */}
        {Array.from({ length: 4 }, (_, i) => (
          <rect key={`b${i}`} x={44 + i * 44} y={303} width="16" height="16" rx="2" fill={NEUTRAL_INK} style={{ opacity: step === 4 ? 1 : 0, transition: fade }} />
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Table 10.3: codec by GPU                                                  */
/* ------------------------------------------------------------------------ */

interface CardRow {
  card: ReactNode;
  family: string;
  nvenc: string;
  nvdec: string;
  av1: ReactNode;
  source: ReactNode;
}

const CARD_ROWS: CardRow[] = [
  {
    card: 'H100',
    family: 'P5',
    nvenc: '0',
    nvdec: '7',
    av1: 'No',
    source: <Cite id="F05-47">NVIDIA support matrix, rows NVIDIA H100</Cite>,
  },
  {
    card: 'A100',
    family: 'P4d',
    nvenc: '0',
    nvdec: '5',
    av1: 'No',
    source: <Cite id="F05-46">NVIDIA support matrix, row NVIDIA A100</Cite>,
  },
  {
    card: 'H200',
    family: 'P5e, P5en',
    nvenc: 'No row',
    nvdec: 'No row',
    av1: <>No row in NVIDIA&apos;s matrix, so not established</>,
    source: <Cite id="F05-49">NVIDIA support matrix, searched for H200</Cite>,
  },
  {
    card: 'B200, B300 and GB200 (Blackwell data-centre parts)',
    family: 'P6-B200, P6-B300, P6e-GB200',
    nvenc: '0',
    nvdec: '7',
    av1: 'Yes',
    source: <Cite id="F05-48">NVIDIA support matrix, rows HGX B200, HGX B300, GB200</Cite>,
  },
  {
    card: 'T4',
    family: 'G4dn',
    nvenc: '1',
    nvdec: '2',
    av1: 'No',
    source: <Cite id="F05-53">NVIDIA support matrix, row Tesla T4</Cite>,
  },
  {
    card: (
      <>
        A10 (the matrix lists &quot;NVIDIA A10&quot;; the G5 card is sold as the A10G, which has no row of its own)
      </>
    ),
    family: 'G5',
    nvenc: '1',
    nvdec: '2',
    av1: 'Yes, decode only: it cannot encode AV1',
    source: <Cite id="F05-54">NVIDIA support matrix, row NVIDIA A10</Cite>,
  },
  {
    card: 'L4',
    family: 'G6',
    nvenc: '2',
    nvdec: '4',
    av1: 'Yes',
    source: <Cite id="F05-50">NVIDIA support matrix, row NVIDIA L4</Cite>,
  },
  {
    card: 'L40S',
    family: 'G6e',
    nvenc: '3',
    nvdec: '3',
    av1: 'Yes',
    source: <Cite id="F05-51">NVIDIA support matrix, row NVIDIA L40S</Cite>,
  },
  {
    card: 'RTX PRO 4500 Blackwell Server Edition',
    family: 'G7',
    nvenc: '3',
    nvdec: '3',
    av1: 'Yes',
    source: <Cite id="F08-44">NVIDIA support matrix, row RTX PRO 4500 Blackwell Server Edition</Cite>,
  },
  {
    card: 'RTX PRO 6000 Blackwell Server Edition',
    family: 'G7e',
    nvenc: '4',
    nvdec: '4',
    av1: 'Yes',
    source: <Cite id="F05-52">NVIDIA support matrix, row RTX PRO 6000 Blackwell Server Edition</Cite>,
  },
];

export function ProcessingCurating() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Tell before you rent, and confirm from one short run, whether the CPU cores decoding your video or the GPU will set your training speed (LeRobot v0.7.0, Cosmos Curator v2.10.0, NVIDIA's support matrix and the EC2 instance tables, read 2026-11-20)"
          >
            10. Processing and Curating: When the Cores That Decode the Video Starve the GPU
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A training GPU fed robot video can sit idle while the CPU cores beside it decode the frames. The frames
            are stored compressed, and each one has to be decoded into pixels before the model sees it. LeRobot, the
            library that drives the {ARM} robot arm, does that decoding on CPU cores inside the training job, in its
            dataloader: the part of a trainer that fetches samples and stacks them into batches, using several worker
            processes in parallel. EC2 fixes how many cores the job gets: most eight-GPU sizes carry 24 vCPUs (virtual CPUs,
            the unit EC2 counts processor capacity in) per GPU. When the workers turn out batches more slowly than
            the GPU trains on them, the GPU waits, and a faster GPU only waits longer.{' '}
            <Cite id="F05-39">LeRobot v0.7.0 video_utils.py</Cite>{' '}
            <Cite id="F05-65">EC2 accelerated computing specifications</Cite>
          </Box>
          <Box variant="p">
            Hugging Face reports a run where the cores did set the pace. ACT (Action Chunking with Transformers, the
            small imitation policy of section 4) trained 2.8x faster on an H100 once its image augmentation, random
            changes applied to each training image, moved from the CPU workers to the GPU; the report gives no dataset, camera count, batch
            size or CPU. A step that shrinks 2.8x when work leaves the CPU was mostly waiting on the CPU: the GPU was busy
            for at most 1 / 2.8 = <Derived>36</Derived>% of it.{' '}
            <Cite id="F05-59">LeRobot v0.7.0 release blog, Augment on the GPU</Cite>
          </Box>
          <Box variant="p">
            LeRobot&apos;s hardware guide reports the opposite case on the same card. Diffusion Policy, the denoising
            policy of section 4, trained on four H100s at a batch of 32 in 0.167 s per update and spent 0.015 s per
            step loading data, so there the GPUs set the pace. Which case a run is in follows from two rates, what
            the workers can supply and what the GPU can train, and one short run shows it.{' '}
            <Cite id="F01-91">LeRobot hardware guide, benchmark table</Cite>
          </Box>
          <Box variant="p">
            Augmentation moves with one flag, <code>--dataset.image_transforms.backend=gpu</code>. Decode does not
            move. Taking it off the cores needs the GPU&apos;s video decode engine, NVDEC (NVIDIA Decoder): a fixed
            circuit on the card that only decompresses video, separate from the tensor cores, the part of the GPU
            that multiplies matrices for a neural network. LeRobot&apos;s loader never calls NVDEC, so a LeRobot run
            decodes on the cores beside its GPU whatever the card.{' '}
            <Cite id="F05-39">LeRobot v0.7.0 video_utils.py</Cite>{' '}
            <Cite id="F05-59">LeRobot v0.7.0 release blog, Augment on the GPU</Cite>{' '}
            <Cite id="F05-67">join of the NVIDIA matrix and the EC2 specifications</Cite>
          </Box>
          <Box variant="p">
            The engine matters to software that does call it: a curation pipeline, the step that chooses which
            recordings a model learns from, or a loader of your own. An engine handles only the codecs (compression
            formats) it was built for. LeRobot records AV1 (AOMedia Video 1), an open codec, by default, and the H100
            has no engine that decodes AV1, so the codec chosen at the bench decides which instances that software
            can use. <Cite id="F05-35">LeRobot v0.7.0 configs/video.py</Cite>{' '}
            <Cite id="F05-47">NVIDIA support matrix, rows NVIDIA H100</Cite>
          </Box>
          <AnimatedFigure
            name="decode bounds the trainer"
            steps={DECODE_STEPS}
            intervalMs={2600}
            cites="F05-39 F05-58 F05-65 F05-67"
            caption={
              <>
                Grey squares are frames on their way from the files to the GPU, and the strip in the GPU box shows
                the share of time the GPU is working. The picture is illustrative, not measured.
              </>
            }
          >
            {(step, reduced) => <DecodeBoundsDiagram step={step} reduced={reduced} />}
          </AnimatedFigure>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Count the decodes behind one training step, and see why the recording's keyframe interval is a training-speed setting"
          >
            One random frame costs every frame back to its keyframe
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A video codec stores a few frames whole and the rest as differences from the frames before them. A frame
            stored whole is a keyframe, and the spacing of the keyframes is the GOP (group of pictures) size. To
            return one frame, a decoder loads the keyframe before it and decodes every frame from there to the one
            requested. Playback hides the cost, because it decodes each frame once on the way through. Training asks
            for a few frames at random places, so every request can cost a whole group.{' '}
            <Cite id="F05-37">LeRobot v0.7.0 video_utils.py, decoder docstrings</Cite>{' '}
            <Cite id="F05-64">LeRobot v0.4.0 video benchmark, Requested timestamps</Cite>
          </Box>
          <Box variant="p">
            Count one training step for {TASK_CLAUSE}. LeRobot trains with a batch of 8 rows by default, each row
            the arm&apos;s joints and camera frames at one control tick of one recorded episode, so a step needs 8 x
            2 = <Derived>16</Derived> frames. LeRobot&apos;s recorder makes this the cheap case: its default GOP is
            2, a keyframe every second frame, so a frame costs at most 2 decodes and the step at most{' '}
            <Derived>16</Derived> x 2 = <Derived>32</Derived>. The GOP is a setting, though. At 250, a common value
            for streaming video used here as an illustration, the worst case for the same step is{' '}
            <Derived>16</Derived> x 250 = <Derived>4,000</Derived> decodes, <Derived>125</Derived> times the
            default&apos;s, all on the workers&apos; cores. The GOP is set when a video is encoded, which trades
            decode time against file size, so a dataset re-encoded at a long GOP for a smaller file pays for it on
            every training step. Re-encoding is also how a GOP changes, and <code>lerobot-edit-dataset</code> can
            re-encode a downloaded dataset&apos;s videos. <Cite id="F05-61">LeRobot v0.7.0 configs/train.py</Cite>{' '}
            <Cite id="F05-37">LeRobot v0.7.0 video_utils.py, decoder docstrings</Cite>{' '}
            <Cite id="F05-81">LeRobot v0.7.0 using_dataset_tools.mdx</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Turn worker count, batch size and one measured rate into the time the workers need per batch, and set it against the GPU's update time"
          >
            The workers set a step rate that no GPU can raise
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The dataloader&apos;s workers run in parallel on CPU cores, and in LeRobot each one also decodes: the
            default decoder is torchcodec, the PyTorch project&apos;s video decoder, run on the CPU. LeRobot&apos;s
            code warns that pointing it at the GPU from inside a worker leads to initialisation errors in CUDA,
            NVIDIA&apos;s GPU programming layer, which is why decode stays on the cores even on cards with an AV1
            engine. <Cite id="F05-39">LeRobot v0.7.0 video_utils.py</Cite>{' '}
            <Cite id="F05-41">LeRobot v0.7.0 video_utils.py, decoder note</Cite>{' '}
            <Cite id="F08-77">the CPU beside the GPU</Cite>
          </Box>
          <Box variant="p">
            The GPU waits whenever the workers take longer to build a batch than the GPU takes to train on one.
            Write <code>B</code> for the batch size (the rows one step consumes), <code>r</code> for the rows one
            worker returns per second, <code>u</code> for the GPU&apos;s update time per step and <code>W</code> for
            the number of workers. One worker needs <code>B / r</code> seconds to build a batch, and the GPU asks
            for one every <code>u</code> seconds, so the workers keep the GPU fed when:
          </Box>
          <Box variant="p">
            <code>W &gt;= B / (r x u)</code>
          </Box>
          <Box variant="p">
            <code>W</code> and <code>B</code> are settings, and <code>u</code> belongs to the policy and the GPU.{' '}
            <code>r</code> is where the recording and the loader&apos;s code show up: every decode a row needs lowers
            it. An open pull request in LeRobot&apos;s repository times dataset access, fetching one row with its
            frames, on a two-camera, 50-episode dataset with torchcodec: 5.37 ms per random single row on
            LeRobot&apos;s main branch and 5.16 ms with the pull request&apos;s change (medians, one process, warm
            file cache, hardware not stated). That is about{' '}
            <Derived>186</Derived> rows per second, so one worker builds a default batch of 8 in 8 /{' '}
            <Derived>186</Derived> = <Derived>43</Derived> ms, and the default 4 workers keep up with any update of
            about <Derived>11</Derived> ms or longer, if four of them deliver four times the rows of one. <Cite id="F05-62">LeRobot pull request 4549</Cite>{' '}
            <Cite id="F05-61">LeRobot v0.7.0 configs/train.py</Cite>
          </Box>
          <Box variant="p">
            Heavier rows and larger batches raise the number of workers needed. The same pull request times batches of 32 rows read at
            random, each reading a five-frame history window, several recent frames instead of one: 16.98 ms per
            row on main, <Derived>59</Derived> rows per second from one worker, so one worker needs 32 /{' '}
            <Derived>59</Derived> = <Derived>0.54</Derived> s per batch. That is one worker building one batch of
            heavier rows; the guide&apos;s 0.015 s is the loading time its own training loop recorded per step, on
            its own dataset, so the two figures measure different things. Pair those rows, for illustration, with an
            update as long as the guide&apos;s Diffusion Policy step, 0.167 s, and the GPU needs 32 / (
            <Derived>59</Derived> x 0.167) = <Derived>3.2</Derived> workers&apos; worth of rows. The default four
            cover that only if together they return at least <Derived>3.2</Derived> times the rows of one. The pull request&apos;s own change, still open on
            2026-11-20, cuts the row to 4.95 ms (3.43x faster), which divides the workers needed by the same factor,
            to about one. <Cite id="F05-62">LeRobot pull request 4549</Cite>{' '}
            <Cite id="F01-91">LeRobot hardware guide, benchmark table</Cite>
          </Box>
          <Box variant="p">
            Workers do not always scale that well. For LeRobot&apos;s streaming reader, the mode that trains without
            downloading the dataset first, Hugging Face&apos;s release post reports 2.1 to 2.5 times more samples per
            second from four workers. Neither the pull request nor the release post names the machine behind its figure, so time one worker and
            four on the instance you will rent, and check that four return at least <code>B / (r x u)</code> times
            what one does. <Cite id="F05-60">LeRobot v0.7.0 training_dataset_streaming.mdx</Cite>{' '}
            <Cite id="F05-59">LeRobot v0.7.0 release blog, Disk-less streaming</Cite>{' '}
            <Cite id="F05-62">LeRobot pull request 4549</Cite>
          </Box>
          <Box variant="p">
            Augmentation, once switched on, lowers <code>r</code> further, because by default it runs per sample in
            the same workers. LeRobot&apos;s docs call it, with several cameras, often the most expensive thing the
            workers do, and state the result: &quot;the GPU ends up waiting for data&quot;. The{' '}
            <code>backend=gpu</code> flag leaves the workers decoding only and applies the transforms to each batch
            on the GPU. It is the change behind Hugging Face&apos;s 2.8x for ACT on an H100, and 3.3x on an A100.{' '}
            <Cite id="F05-84">LeRobot v0.7.0 transforms.py, ImageTransformsConfig</Cite>{' '}
            <Cite id="F05-58">LeRobot v0.7.0 lerobot-dataset-v3.mdx</Cite>{' '}
            <Cite id="F05-59">LeRobot v0.7.0 release blog, Augment on the GPU</Cite>
          </Box>
          <Box variant="p">
            <code>W</code> can grow only to the cores beside the GPU, and the instance type fixes those. The
            eight-GPU sizes of G5, G6, G6e, G7e, P5, P5e, P5en, P6-B200 and P6-B300 all have 192 vCPUs, 24 per GPU.
            On these x86 sizes a vCPU is one hardware thread and two threads share a physical core (SMT,
            simultaneous multithreading: one core presenting itself as two so that it can interleave two programs on the same execution units),
            so the 24 vCPUs are 12 physical cores. p4d.24xlarge has 96 vCPUs for 8 A100s, 12 vCPUs and 6 physical
            cores per GPU. g7.48xlarge runs 1 thread per core, so its 24 vCPUs per GPU are 24 physical cores, twice
            the 12 of the other eight-GPU x86 sizes and four times p4d&apos;s 6.{' '}
            <Cite id="F05-65">EC2 accelerated computing specifications</Cite>{' '}
            <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>
          </Box>
          <Box variant="p">
            A one-GPU size lets you pick the ratio: from 4 vCPUs (g6.xlarge) to 64 (g6.16xlarge) beside one L4.
            p5.4xlarge puts 16 vCPUs beside its one H100, fewer per GPU than the eight-GPU P5.{' '}
            <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>{' '}
            <Cite id="F05-66">EC2 accelerated computing specifications, single-GPU sizes</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="For a loader or pipeline that decodes on the GPU, rule an instance family in or out by one row of NVIDIA's matrix, and know what to do when the row says no"
          >
            The H100 has no engine that decodes AV1
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            NVDEC has an encoding partner, NVENC (NVIDIA Encoder). Both sit apart from the tensor cores, so a card
            can train at full load while its decoder sits unused. A card carries a
            set number of engines, each engine handles a fixed list of codecs, and NVIDIA publishes both in one
            support matrix. <Cite id="F05-67">join of the NVIDIA matrix and the EC2 specifications</Cite>
          </Box>
          <Box variant="p">
            For AV1 the matrix says no on the H100 of P5, the A100 of P4d and the T4 of G4dn. The H100 has 7 NVDEC
            engines and none of them decodes AV1. The matrix had
            no row for the H200 of P5e and P5en when read on 2026-11-20, so run a decode test before you commit a
            GPU-decoding pipeline to either family.{' '}
            <Cite id="F05-47">NVIDIA support matrix, rows NVIDIA H100</Cite>{' '}
            <Cite id="F05-46">NVIDIA support matrix, row NVIDIA A100</Cite>{' '}
            <Cite id="F05-53">NVIDIA support matrix, row Tesla T4</Cite>{' '}
            <Cite id="F05-49">NVIDIA support matrix, searched for H200</Cite>
          </Box>
          <Box variant="p">
            AV1 does decode on the Blackwell parts of P6-B200, P6-B300 and P6e-GB200, and in the G families from the L4 of G6 upward. G5&apos;s answer rests on the matrix&apos;s A10 row, which
            decodes AV1: AWS sells the G5 card as the A10G, which has no row of its own, so a decode test settles G5 as it
            does the H200.{' '}
            <Cite id="F05-48">NVIDIA support matrix, rows HGX B200, HGX B300, GB200</Cite>{' '}
            <Cite id="F05-54">NVIDIA support matrix, row NVIDIA A10</Cite>{' '}
            <Cite id="F05-67">join of the NVIDIA matrix and the EC2 specifications</Cite>
          </Box>
          <Box variant="p">
            When the row says no, rent a card whose row says yes, or go back to the bench and record a codec the
            card does decode. LeRobot can also record H.264 or HEVC (High Efficiency Video Coding), at a price its
            docs state: H.264 encoded on the CPU comes out about 30-50% larger than AV1, and AV1 stays the default
            because it gives the best training performance, with other codecs that &quot;may affect training
            time&quot;. Read your card&apos;s decode columns for the new codec in NVIDIA&apos;s matrix before you
            record in it.{' '}
            <Cite id="F05-42">LeRobot v0.7.0 configs/video.py, codec list</Cite>{' '}
            <Cite id="F05-43">LeRobot streaming video encoding docs, Choosing a Codec</Cite>
          </Box>
          <Box variant="p">
            When the row says yes, test the software path as well as the card. Cosmos Curator removed its FFmpeg
            GPU decode mode because its benchmarks showed it performing the same as FFmpeg on the CPU, and it now
            decodes on the GPU through NVIDIA&apos;s PyNvVideoCodec library instead.{' '}
            <Cite id="F05-77">Cosmos Curator slim-image.md</Cite>
          </Box>
          <ExpandableSection headerText="Engine counts and AV1 decode by card and EC2 family, for lookup" variant="footer">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 760 }}>
                <thead>
                  <tr>
                    <th style={TH}>Card</th>
                    <th style={TH}>EC2 family</th>
                    <th style={TH}>NVENC engines</th>
                    <th style={TH}>NVDEC engines</th>
                    <th style={TH}>AV1 hardware decode</th>
                    <th style={TH}>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {CARD_ROWS.map((r) => (
                    <tr key={r.family}>
                      <td style={TD}>{r.card}</td>
                      <td style={TD}>{r.family}</td>
                      <td style={TD}>{r.nvenc}</td>
                      <td style={TD}>{r.nvdec}</td>
                      <td style={TD}>{r.av1}</td>
                      <td style={TD}>{r.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Size a curation instance from each stage's CPU and GPU budget, and find the slow link in the feed before you add GPUs"
          >
            In curation, a GPU stage runs at the speed of what feeds it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            At the bench, curation is a person and one command. You watch the 50 episodes LeRobot&apos;s recorder
            makes by default and delete the failed ones by index with <code>lerobot-edit-dataset</code>, which also
            recomputes the dataset statistics. <Cite id="F05-2">LeRobot v0.7.0 configs/dataset.py</Cite>{' '}
            <Cite id="F05-81">LeRobot v0.7.0 using_dataset_tools.mdx</Cite>
          </Box>
          <Box variant="p">
            At thousands of hours nobody watches. Small models drop the clips where nothing moves, score how a clip
            looks, caption it and compare it with the others for near copies, and the job becomes a pipeline of CPU
            stages feeding GPU stages. NVIDIA&apos;s Cosmos Curator (v2.10.0, released 2026-11-10) runs that
            pipeline on Ray, a framework that spreads Python jobs across a cluster, and gives each stage a budget in
            CPUs or in fractions of a GPU: 3 CPUs per worker to decode frames, 5 to transcode (re-encode each clip,
            here to H.264), and for most of its models 0.25 of a GPU per worker, with defaults tuned for a 48 GB
            card. <Cite id="F05-68">Cosmos Curator v2.10.0 README</Cite>{' '}
            <Cite id="F05-69">Cosmos Curator video-pipelines.md, stage list</Cite>{' '}
            <Cite id="F05-71">Cosmos Curator video-pipelines.md, Options for Performance</Cite>
          </Box>
          <Box variant="p">
            Put those budgets on an eight-GPU G6e, whose L40S is a 48 GB card. Each GPU holds four of the
            quarter-GPU model workers, and the CPU stages share the 24 vCPUs beside it: 24 / 3 = 8 decode workers
            would take all 24, and 4 transcode workers at 5 each take 20, so a pipeline running both has to split
            the cores. The budgets cannot say how: that comes from each stage&apos;s measured throughput on your own
            clips, the measurement a short run gives. On P instances transcoding stays on the cores: the
            pipeline&apos;s default encoder is a CPU one for cards without an encoder engine, the A100 and H100 by
            name, and no P-family card in the matrix has one.{' '}
            <Cite id="F05-71">Cosmos Curator video-pipelines.md, Options for Performance</Cite>{' '}
            <Cite id="F05-65">EC2 accelerated computing specifications</Cite>{' '}
            <Cite id="F08-45">EC2 accelerated computing specifications, accelerator memory</Cite>{' '}
            <Cite id="F05-77">Cosmos Curator slim-image.md</Cite>{' '}
            <Cite id="F05-67">join of the NVIDIA matrix and the EC2 specifications</Cite>
          </Box>
          <Box variant="p">
            For the GPU side, the nearest published rate we located is NVIDIA&apos;s, from March 2025, for a
            predecessor it called NeMo Video Curator, version unnamed, on its DGX Cloud service: about 195 seconds per hour of
            video per GPU in streaming mode, or 3,600 / 195 = 18.5 hours of video per GPU-hour. At that rate an
            illustrative <Toy>1,000</Toy> hours of video take about <Derived>54</Derived> GPU-hours, a dated order of
            magnitude to check against a short run of your own.{' '}
            <Cite id="F05-78">NVIDIA Technical Blog, NeMo Video Curator on DGX Cloud (2025-03-18)</Cite>
          </Box>
          <Figure
            cites="F05-69 F05-70 F05-71 F05-73 F05-77"
            caption={
              <>
                Read down the panels: the decode, transcode and caption-preparation stages are counted in CPUs per
                worker and the model stages in fractions of a GPU, so one instance&apos;s vCPUs and its GPUs both
                bound the pipeline. Clip counts and which clips drop are illustrative, and the frames are simulated.
              </>
            }
          >
            <CurFunnel />
          </Figure>
          <Box variant="p">
            One CPU stage exists only to keep a GPU stage busy. Preparing the captioning model&apos;s inputs is CPU
            work that would otherwise hold a GPU idle, so the pipeline makes it a stage of its own, 3 CPUs per
            worker, which can spawn many CPU workers to keep the captioning stage&apos;s GPU workers busy.{' '}
            <Cite id="F05-70">Cosmos Curator video-pipelines.md, note under the stage list</Cite>{' '}
            <Cite id="F05-71">Cosmos Curator video-pipelines.md, Options for Performance</Cite>
          </Box>
          <Box variant="p">
            Two runs on 32 GPUs show how far apart a fed and a starved pipeline sit. The same March 2025 post
            describes a controller that measures each stage&apos;s throughput and
            resizes its pool of workers every three minutes, over-provisioning the CPU-only stages, and NVIDIA reports
            the GPU-stage workers busy over 99.5% of the time after a warm-up, on 32 GPUs across four nodes.{' '}
            <Cite id="F05-79">NVIDIA Technical Blog, NeMo Video Curator on DGX Cloud, architecture</Cite>{' '}
            <Cite id="F05-78">NVIDIA Technical Blog, NeMo Video Curator on DGX Cloud (2025-03-18)</Cite>
          </Box>
          <Box variant="p">
            A design note for the current toolkit&apos;s incubating robot captioning recipe records the other end:
            on 32 H100s (4 nodes of 8), 32 captioning replicas delivered 7.1 rows of its input table per second against a capacity near 43, at about 17% aggregate GPU utilisation, and 10 replicas
            never received a request. The slow link was fetching the clips. It is one run, cancelled before it completed, and the authors list the slow fetch as a known weakness.{' '}
            <Cite id="F05-76">Cosmos Curator curator-next-robot-action-caption.md</Cite>
          </Box>
          <Box variant="p">
            Deduplication never decodes the video again. The first pass&apos;s embedding model turns each clip into
            an embedding, a list of numbers placed so that similar clips get lists that sit close together. A second
            pipeline clusters those lists with K-Means, which groups vectors around a chosen number of centres,
            orders each cluster by cosine similarity to its centre (1 when two vectors point the same way) and, by
            our reading of its options, drops the clips that sit too close to another. For robot episodes the newer
            recipes need no video model: a clip is embedded by its instruction text, its first frame and its wrist
            motion, and the three are fused and clustered.{' '}
            <Cite id="F05-73">Cosmos Curator video-pipelines.md, Dedup Pipeline</Cite>{' '}
            <Cite id="F05-75">Cosmos Curator curator-next-embeddings.md and curator-next-curation.md</Cite>
          </Box>
          <Box variant="p">
            A curation pass splits into short independent units of work, so a machine lost in the middle costs only
            the clips it held, which makes it a job for Spot, the capacity AWS may take back (section 24,
            Orchestrating Physical AI on AWS, places it there). <Cite id="F08-78">the five shapes</Cite> Size it
            from a short run on your own clips, and find the slow link, the fetch included, before you add GPUs.{' '}
            <Cite id="F05-76">Cosmos Curator curator-next-robot-action-caption.md</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Confirm from one short run whether the GPU waits for frames, then change the loader's settings first, the instance second and the codec last"
          >
            Measure one short run, then fix the loader, the instance or the codec
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Set your run&apos;s data-loading time per step beside its update time. LeRobot&apos;s hardware guide
            reports the pair as <code>dataloading_s</code> and <code>update_s</code>, counting preprocessing in the
            first, and across its three policies data loading is 0.011 to 0.015 s against updates of 0.167 to 2.548
            s, under a tenth of the update in every run, and in all three the GPUs set the pace. The firmer test is to change <code>W</code>. If
            steps per second rise when you add workers, the workers were setting the pace; if they stay flat, the GPU
            was. <Cite id="F01-91">LeRobot hardware guide, benchmark table</Cite>
          </Box>
          <Box variant="p">
            GPU utilisation in <code>nvidia-smi</code> shows the same wait from the other side. It is the
            percentage of the sample period during which at least one kernel was executing on the GPU, so a GPU
            that waits for batches reads low: the guide reports about 80 to 95% for its runs, and the curation note
            about 17%. A high reading proves less, since the figure says nothing about how much of the GPU each
            kernel used. <Cite id="F08-30">nvidia-smi documentation, Utilization</Cite>{' '}
            <Cite id="F01-91">LeRobot hardware guide, benchmark table</Cite>{' '}
            <Cite id="F05-76">Cosmos Curator curator-next-robot-action-caption.md</Cite>
          </Box>
          <Box variant="p">
            <code>nvidia-smi</code> also says who is decoding, because it reports decoder utilisation as its own
            figure, separate from the compute part of the card. If that figure reads zero while the job trains on
            video, the decode engine is unused and the decoding is on the CPU. On a GPU split with MIG
            (Multi-Instance GPU, which divides one card into isolated slices), none of these figures can be
            queried. <Cite id="F08-31">nvidia-smi documentation, Utilization</Cite>
          </Box>
          <Box variant="p">
            When the workers bind, change settings before you change machines. Raise the worker count from its
            default of 4 toward <code>B / (r x u)</code>, within the physical cores beside the GPU, and measure what
            each added worker returns. Move
            augmentation to the GPU, which leaves the workers decoding only. Keep the recording at a short GOP. If
            the GPU still waits, move to more physical cores per GPU: g7.48xlarge among the eight-GPU sizes, or a
            one-GPU size with more vCPUs. <Cite id="F05-61">LeRobot v0.7.0 configs/train.py</Cite>{' '}
            <Cite id="F05-58">LeRobot v0.7.0 lerobot-dataset-v3.mdx</Cite>{' '}
            <Cite id="F05-37">LeRobot v0.7.0 video_utils.py, decoder docstrings</Cite>{' '}
            <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>
          </Box>
          <Box variant="p">
            For software that decodes on the GPU, the codec and the instance are one decision: the card&apos;s row
            for your codec decides, and a default AV1 recording rules out P5 and P4d. With LeRobot&apos;s stock
            loader the cores beside each GPU do all the decoding whatever the card, so compare instances by physical
            cores per GPU instead: 12 (24 vCPUs) on most eight-GPU sizes, 6 on p4d.24xlarge, 24 on g7.48xlarge. If
            the instance is already fixed, fit the codec to it while you can still record, and where no engine
            decodes it, budget the cores.{' '}
            <Cite id="F05-39">LeRobot v0.7.0 video_utils.py</Cite>{' '}
            <Cite id="F05-65">EC2 accelerated computing specifications</Cite>{' '}
            <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>{' '}
            <Cite id="F05-67">join of the NVIDIA matrix and the EC2 specifications</Cite>
          </Box>
          <Box variant="p">
            Then, before you rent eight GPUs for the long run, run one short job on the instance you mean to use and
            set its data-loading time beside its update time.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
