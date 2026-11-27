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
const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };

/** The thread task, stated once for this section. */
const TASK_CLAUSE = `the example task, in which the ${ARM} learns to ${TASK_STORY} and two cameras record each episode`;

/* ------------------------------------------------------------------------ */
/* Diagram 10.2 (animated): decode bounds the trainer                        */
/* ------------------------------------------------------------------------ */

const DECODE_STEPS: ReactNode[] = [
  'The recorded video is stored on disk as compressed MP4 files. Before the trainer can use a frame, a decoder has to turn it back into pixels.',
  'The trainer asks the dataloader workers for a batch. The workers run on CPU cores, and each one seeks into the video files and decodes the frames it needs.',
  'The workers stack the decoded frames into batches, and the batches wait in a queue for the GPU. As long as the queue holds a batch, the GPU runs one training step after another.',
  'When the GPU has too few CPU cores to supply it, the queue runs empty. The workers are fully busy, and the GPU waits for data between steps. Most eight-GPU EC2 instance sizes provide 24 vCPUs per GPU.',
  "There are two ways to keep the queue full. You can give each GPU more CPU cores, or you can decode on the GPU's video engine, if the GPU supports the codec and the loader can use the engine.",
];

const CPU_SUB = [
  'idle until the trainer asks for a batch',
  'each worker decodes the frames it was asked for',
  'each worker decodes the frames it was asked for',
  'all busy, but still too slow for the GPU',
  'more cores per GPU decode more frames per second',
];
const QUEUE_STATE = ['empty', 'empty', 'full', 'empty again', 'stays full'];
const GPU_STATE = [
  'nothing to train on yet',
  'nothing to train on yet',
  'running, because a batch is always ready',
  'waiting for data',
  'running at every step',
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
            "idle, because LeRobot's loader decodes on the CPU",
            "idle, because LeRobot's loader decodes on the CPU",
            "idle, because LeRobot's loader decodes on the CPU",
            "idle, because LeRobot's loader decodes on the CPU",
            'or decode here, if the GPU supports the codec',
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
    av1: <>Not known, because NVIDIA&apos;s matrix has no row for the H200</>,
    source: <Cite id="F05-49">NVIDIA support matrix, searched for H200</Cite>,
  },
  {
    card: 'B200, B300 and GB200 (Blackwell data-centre GPUs)',
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
        A10, listed in the matrix as &quot;NVIDIA A10&quot;. AWS sells the G5 GPU as the A10G, which has no row of its
        own.
      </>
    ),
    family: 'G5',
    nvenc: '1',
    nvdec: '2',
    av1: 'Yes. It decodes AV1 but cannot encode it.',
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
            description="Robot video is stored compressed, and in LeRobot the CPU cores of the training instance decode each frame before the GPU can train on it. You can estimate, before you rent an instance, whether those CPU cores or the GPU will limit your training speed, and then confirm it with one short run."
          >
            10. Processing and Curating: How Many CPU Cores Keep a Training GPU Fed
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            When a GPU trains a policy on robot video, it can sit idle while CPU cores decode the video frames. The
            recordings are stored as compressed video, and each frame has to be decoded back into pixels before the
            model can use it. LeRobot, the open-source library for recording robot data and training robot models,
            does this decoding on CPU cores inside the training job.{' '}
            <Cite id="F05-39">LeRobot v0.7.0 video_utils.py</Cite>
          </Box>
          <Box variant="p">
            The decoding happens in the dataloader. The dataloader is the part of a training program that fetches
            samples from storage and stacks them into batches for the GPU. It runs several worker processes in
            parallel, and each worker runs on CPU cores. <Cite id="F05-39">LeRobot v0.7.0 video_utils.py</Cite>
          </Box>
          <Box variant="p">
            When you choose the instance type, you also choose how many CPU cores the training job gets. EC2 counts processor capacity in vCPUs
            (virtual CPUs), and most eight-GPU instance sizes have 24 vCPUs per GPU. If the workers produce batches
            more slowly than the GPU trains on them, the GPU waits for data. In that case a faster GPU does not
            speed up training, because it only spends more of its time waiting.{' '}
            <Cite id="F05-65">EC2 accelerated computing specifications</Cite>
          </Box>
          <Box variant="p">
            Hugging Face reports a speedup that came from moving work off the CPU workers. The policy in that report was ACT
            (Action Chunking with Transformers), a small policy that learns by imitating demonstrations and predicts
            a chunk of future actions at a time. Section 4, Learning From Demonstrations, describes it. Its training
            used augmentation, which applies random changes to each image, such as shifts in brightness or framing.
            When this augmentation moved from the CPU workers to the GPU, ACT trained 2.8x faster on an H100. The report does not give the dataset, the number of cameras, the batch size or the CPU.{' '}
            <Cite id="F05-59">LeRobot v0.7.0 release blog, Augment on the GPU</Cite>
          </Box>
          <Box variant="p">
            Even without those details, the speedup tells you where the time went. If a training step becomes 2.8x
            shorter when work leaves the CPU, the step was mostly spent waiting for the CPU. The GPU was busy for at
            most 1 / 2.8 = <Derived>36</Derived>% of the original step.{' '}
            <Cite id="F05-59">LeRobot v0.7.0 release blog, Augment on the GPU</Cite>
          </Box>
          <Box variant="p">
            LeRobot&apos;s hardware guide reports the opposite case on the same GPU model. It trained Diffusion
            Policy, a policy that generates actions by removing noise step by step (section 4, Learning From
            Demonstrations), on four H100s with a batch size of 32. Each update took 0.167 s, and loading the data
            for a step took 0.015 s, so in this run the GPUs set the pace. Whether your run looks like the first
            case or the second depends on two rates: how fast the workers can supply batches, and how fast the GPU
            can train on them. One short run is enough to measure both.{' '}
            <Cite id="F01-91">LeRobot hardware guide, benchmark table</Cite>
          </Box>
          <Box variant="p">
            You can move augmentation to the GPU with one flag, <code>--dataset.image_transforms.backend=gpu</code>.
            There is no such flag for decoding. To take decoding off the CPU cores, the software has to use the
            GPU&apos;s video decode engine, which NVIDIA calls NVDEC (NVIDIA Decoder). NVDEC is a fixed-function
            circuit on the GPU that only decompresses video. It is separate from the tensor cores, which are the part
            of the GPU that multiplies matrices for a neural network. LeRobot&apos;s loader never calls NVDEC, so a
            LeRobot training run decodes on the instance&apos;s CPU cores, whatever GPU the instance has.{' '}
            <Cite id="F05-39">LeRobot v0.7.0 video_utils.py</Cite>{' '}
            <Cite id="F05-59">LeRobot v0.7.0 release blog, Augment on the GPU</Cite>{' '}
            <Cite id="F05-67">join of the NVIDIA matrix and the EC2 specifications</Cite>
          </Box>
          <Box variant="p">
            The decode engine matters for software that does call it, such as a curation pipeline or a dataloader
            you write yourself. Curation is the step that chooses which recordings a model learns from. A codec is a
            format for compressing video and decoding it again, and each decode engine handles only the codecs it
            was built for. By default, LeRobot records in AV1 (AOMedia Video 1), an open codec, and the H100 has no
            engine that decodes AV1. So for software that decodes on the GPU, the codec you choose when you record
            the data limits which instances you can use. <Cite id="F05-35">LeRobot v0.7.0 configs/video.py</Cite>{' '}
            <Cite id="F05-47">NVIDIA support matrix, rows NVIDIA H100</Cite>
          </Box>
          <AnimatedFigure
            name="how CPU decoding can leave the GPU waiting"
            steps={DECODE_STEPS}
            intervalMs={2600}
            cites="F05-39 F05-58 F05-65 F05-67"
            caption={
              <>
                The grey squares are frames moving from the video files to the GPU. The strip in the GPU box shows
                the share of time the GPU is working. The diagram is an illustration, not a measurement.
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
            description="Training reads video frames at random positions, and each read can cost many decoded frames. You can count the decodes behind one training step and see why the keyframe interval of the recording affects training speed."
          >
            Counting the video decodes in one training step
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A video codec stores a few frames whole and stores the others as differences from the frames before
            them. A frame that is stored whole is called a keyframe. The spacing between keyframes is the GOP (group
            of pictures) size. To return one frame, a decoder starts at the keyframe before it and decodes every
            frame from there up to the requested one. During normal playback this adds no extra work, because the
            player decodes every frame once, in order. Training reads a few frames at random positions, so each read
            can cost the decoding of a whole group of pictures.{' '}
            <Cite id="F05-37">LeRobot v0.7.0 video_utils.py, decoder docstrings</Cite>{' '}
            <Cite id="F05-64">LeRobot v0.4.0 video benchmark, Requested timestamps</Cite>
          </Box>
          <Box variant="p">
            To see what this costs, count the decodes in one training step for {TASK_CLAUSE}. By default, LeRobot trains with
            a batch of 8 rows. A row holds the arm&apos;s joint positions and the camera frames at one control tick
            of one recorded episode. With two cameras, one step needs 8 x 2 = <Derived>16</Derived> frames.{' '}
            <Cite id="F05-61">LeRobot v0.7.0 configs/train.py</Cite>
          </Box>
          <Box variant="p">
            With LeRobot&apos;s recorder, this is a cheap case. Its default GOP size is 2, which means a keyframe every
            second frame. So one frame costs at most 2 decodes, and one step costs at most <Derived>16</Derived> x 2
            = <Derived>32</Derived> decodes. <Cite id="F05-37">LeRobot v0.7.0 video_utils.py, decoder docstrings</Cite>
          </Box>
          <Box variant="p">
            The GOP size is a setting, though. For illustration, take a GOP size of 250, a common value for streaming
            video. The worst case for the same step is then <Derived>16</Derived> x 250 = <Derived>4,000</Derived>{' '}
            decodes, <Derived>125</Derived> times as many as with the default, and the workers&apos; CPU cores do
            all of them. When you encode a video, you choose its GOP size, and with it the balance between decode
            time and file size. If you re-encode a dataset with a long GOP to make the files smaller, every training
            step needs more decodes. Re-encoding is also the way to change the GOP size, and <code>lerobot-edit-dataset</code> can
            re-encode the videos of a dataset you have downloaded.{' '}
            <Cite id="F05-37">LeRobot v0.7.0 video_utils.py, decoder docstrings</Cite>{' '}
            <Cite id="F05-81">LeRobot v0.7.0 using_dataset_tools.mdx</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A short formula tells you whether the dataloader workers can build batches as fast as the GPU trains on them. You can apply it to published LeRobot timings, and then compare how many CPU cores each EC2 GPU instance provides for the workers."
          >
            How many dataloader workers keep a GPU busy
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The dataloader&apos;s workers run in parallel on CPU cores, and in LeRobot each worker also decodes the
            video. LeRobot&apos;s default decoder is torchcodec, the PyTorch project&apos;s video decoder, and
            LeRobot runs it on the CPU. LeRobot&apos;s code warns that pointing torchcodec at the GPU from inside a
            worker causes initialisation errors in CUDA, NVIDIA&apos;s programming layer for its GPUs.
            Because of these errors, LeRobot keeps decoding on the CPU cores, even on GPUs that have an AV1 decode
            engine. <Cite id="F05-39">LeRobot v0.7.0 video_utils.py</Cite>{' '}
            <Cite id="F05-41">LeRobot v0.7.0 video_utils.py, decoder note</Cite>{' '}
            <Cite id="F08-77">the CPU cores that supply the GPU</Cite>
          </Box>
          <Box variant="div">
            The GPU waits whenever the workers need longer to build a batch than the GPU needs to train on one. To
            check this before a long run, you need four numbers:
            <ul style={LIST}>
              <li>
                <code>B</code>, the batch size, which is the number of rows one training step uses.
              </li>
              <li>
                <code>r</code>, the number of rows one worker returns per second.
              </li>
              <li>
                <code>u</code>, the update time, which is how long the GPU takes for one training step.
              </li>
              <li>
                <code>W</code>, the number of workers.
              </li>
            </ul>
          </Box>
          <Box variant="p">
            One worker needs <code>B / r</code> seconds to build a batch. If <code>W</code> workers each deliver at
            that rate, a new batch is ready about every <code>B / (r x W)</code> seconds. The GPU asks for a new
            batch every <code>u</code> seconds. So the workers keep the GPU supplied when:
          </Box>
          <Box variant="p">
            <code>W &gt;= B / (r x u)</code>
          </Box>
          <Box variant="p">
            You choose <code>W</code> and <code>B</code> as settings. The update time <code>u</code> depends on the
            policy and the GPU. The recording and the loader&apos;s code affect <code>r</code>, because every extra
            decode that a row needs makes a worker return fewer rows per second.
          </Box>
          <Box variant="p">
            An open pull request in LeRobot&apos;s repository proposes a change and reports timings for dataset
            access, which means fetching one row together with its video frames. The test used a dataset with two cameras and 50 episodes, decoded with
            torchcodec. Fetching a random single row took a median of 5.37 ms on LeRobot&apos;s main branch and 5.16
            ms with the pull request&apos;s change. The test ran in one process with a warm file cache, and the pull
            request does not state the hardware. <Cite id="F05-62">LeRobot pull request 4549</Cite>
          </Box>
          <Box variant="p">
            At 5.37 ms per row, one worker returns about <Derived>186</Derived> rows per second. So one worker builds
            a default batch of 8 rows in 8 / <Derived>186</Derived> = <Derived>43</Derived> ms. If four workers
            deliver four times the rows of one, LeRobot&apos;s default of 4 workers keeps up with any update time of
            about <Derived>11</Derived> ms or longer. <Cite id="F05-62">LeRobot pull request 4549</Cite>{' '}
            <Cite id="F05-61">LeRobot v0.7.0 configs/train.py</Cite>
          </Box>
          <Box variant="p">
            Heavier rows and larger batches raise the number of workers you need. The same pull request also times
            batches of 32 rows read at random positions, where each row reads a five-frame history window, which
            means several recent frames instead of one. On the main branch, each of these rows took 16.98 ms. That is{' '}
            <Derived>59</Derived> rows per second from one worker, so one worker needs 32 / <Derived>59</Derived> ={' '}
            <Derived>0.54</Derived> s to build one batch. This figure is for one worker building one batch of heavier
            rows. It is a different measurement from the 0.015 s of data loading per training step that the hardware
            guide reports for its own dataset. <Cite id="F05-62">LeRobot pull request 4549</Cite>{' '}
            <Cite id="F01-91">LeRobot hardware guide, benchmark table</Cite>
          </Box>
          <Box variant="p">
            For illustration, pair these rows with an update time as long as the guide&apos;s Diffusion Policy step,
            0.167 s. The GPU then needs 32 / (<Derived>59</Derived> x 0.167) = <Derived>3.2</Derived> workers&apos;
            worth of rows. LeRobot&apos;s default of four workers covers that only if, together, they return at least{' '}
            <Derived>3.2</Derived> times the rows of one worker. As of November 2026, the pull request is still open.
            Its change cuts the time per row to 4.95 ms, 3.43x faster, which divides the number of workers needed by
            the same factor, to about one. <Cite id="F05-62">LeRobot pull request 4549</Cite>{' '}
            <Cite id="F01-91">LeRobot hardware guide, benchmark table</Cite>
          </Box>
          <Box variant="p">
            Adding workers does not always multiply the rate by the number of workers. LeRobot has a streaming
            reader, a mode that trains from a dataset without downloading it first. For this reader, Hugging
            Face&apos;s release post reports 2.1 to 2.5 times more samples per second from four workers. Neither the
            pull request nor the release post names the machine behind its figures. So time one worker and four
            workers on the instance you plan to rent, and check that four return at least <code>B / (r x u)</code>{' '}
            times what one returns. <Cite id="F05-109">LeRobot v0.7.0 release blog, Disk-less streaming</Cite>{' '}
            <Cite id="F05-62">LeRobot pull request 4549</Cite>
          </Box>
          <Box variant="p">
            When augmentation is switched on, it lowers <code>r</code> further, because by default it runs on each
            sample inside the same workers. LeRobot&apos;s documentation says that with several cameras, augmentation
            is often the most expensive work the workers do, and that &quot;the GPU ends up waiting for data&quot;.
            The <code>backend=gpu</code> flag leaves the workers with only the decoding and applies the augmentation
            to each whole batch on the GPU. This is the change behind the speedups that Hugging Face reports for ACT:
            2.8x on an H100 and 3.3x on an A100.{' '}
            <Cite id="F05-84">LeRobot v0.7.0 transforms.py, ImageTransformsConfig</Cite>{' '}
            <Cite id="F05-58">LeRobot v0.7.0 lerobot-dataset-v3.mdx</Cite>{' '}
            <Cite id="F05-59">LeRobot v0.7.0 release blog, Augment on the GPU</Cite>
          </Box>
          <Box variant="p">
            The number of workers you can run is limited by the CPU cores that the instance provides for each GPU,
            and that number depends on the instance type. The eight-GPU sizes of G5, G6, G6e, G7e, P5, P5e, P5en, P6-B200 and
            P6-B300 all have 192 vCPUs, which is 24 per GPU. On these x86 sizes, a vCPU is one hardware thread, and
            two threads share one physical core. This is called SMT (simultaneous multithreading): one physical core
            presents itself as two, so that it can interleave two programs on the same execution units. So the 24
            vCPUs per GPU are 12 physical cores. <Cite id="F05-65">EC2 accelerated computing specifications</Cite>{' '}
            <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>
          </Box>
          <Box variant="p">
            Two eight-GPU sizes differ from that. p4d.24xlarge has 96 vCPUs for 8 A100s, which is 12 vCPUs and 6
            physical cores per GPU. g7.48xlarge runs one thread per core, so its 24 vCPUs per GPU are 24 physical
            cores. That is twice the 12 of the other eight-GPU x86 sizes and four times the 6 of p4d.24xlarge.{' '}
            <Cite id="F05-65">EC2 accelerated computing specifications</Cite>{' '}
            <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>
          </Box>
          <Box variant="p">
            With a one-GPU size, you can choose how many vCPUs come with the GPU. For one L4, you can choose from 4
            vCPUs (g6.xlarge) up to 64 vCPUs (g6.16xlarge). p5.4xlarge has 16 vCPUs for its one H100, which is fewer
            per GPU than the eight-GPU P5 size.{' '}
            <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>{' '}
            <Cite id="F05-66">EC2 accelerated computing specifications, single-GPU sizes</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="If your loader or curation pipeline decodes on the GPU, one row of NVIDIA's support matrix tells you whether an instance family can decode your codec. You can look up that row for each EC2 GPU family and decide what to do when the answer is no."
          >
            Which GPUs can decode AV1 video
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            NVIDIA publishes a support matrix that lists, for each GPU, how many video engines it has and which
            codecs each engine handles. The matrix is organised by GPU, so the EC2 family given here for each GPU
            comes from the EC2 instance specifications.{' '}
            <Cite id="F05-67">join of the NVIDIA matrix and the EC2 specifications</Cite>
          </Box>
          <Box variant="p">
            The H100 in P5 instances has 7 NVDEC engines, and none of them decodes AV1. The matrix gives the same
            answer for the A100 in P4d and the T4 in G4dn. As of November 2026, the matrix has no row for the H200 in
            P5e and P5en. So before you commit a pipeline that decodes on the GPU to either of these two families,
            run a decode test. <Cite id="F05-47">NVIDIA support matrix, rows NVIDIA H100</Cite>{' '}
            <Cite id="F05-46">NVIDIA support matrix, row NVIDIA A100</Cite>{' '}
            <Cite id="F05-53">NVIDIA support matrix, row Tesla T4</Cite>{' '}
            <Cite id="F05-49">NVIDIA support matrix, searched for H200</Cite>
          </Box>
          <Box variant="p">
            NVDEC has an encoding counterpart, NVENC (NVIDIA Encoder), which compresses video. Both engines are
            separate from the tensor cores, so a GPU can train at full load while its video engines stay unused. The
            H100 and the A100 have no NVENC engine at all.{' '}
            <Cite id="F05-47">NVIDIA support matrix, rows NVIDIA H100</Cite>{' '}
            <Cite id="F05-46">NVIDIA support matrix, row NVIDIA A100</Cite>
          </Box>
          <Box variant="p">
            AV1 decoding in hardware is available on the Blackwell GPUs of P6-B200, P6-B300 and P6e-GB200. It is
            also available on the G-family GPUs from the L4 in G6 upward. For G5, the answer is less certain. AWS
            sells the G5 GPU as the A10G, and the matrix has no row for the A10G. The matrix row for the A10 says it
            decodes AV1, so a decode test is the way to confirm G5, as it is for the H200.{' '}
            <Cite id="F05-48">NVIDIA support matrix, rows HGX B200, HGX B300, GB200</Cite>{' '}
            <Cite id="F05-54">NVIDIA support matrix, row NVIDIA A10</Cite>{' '}
            <Cite id="F05-67">join of the NVIDIA matrix and the EC2 specifications</Cite>
          </Box>
          <Box variant="p">
            If the matrix says that your GPU cannot decode your codec, you have two options. You can rent a GPU
            whose row says it can, or you can record new data in a codec that your GPU does decode. LeRobot can also
            record in H.264 or in HEVC (High Efficiency Video Coding, also called H.265). Its documentation states
            the cost: H.264 encoded on the CPU produces files about 30-50% larger than AV1. The documentation also
            says that AV1 stays the default because it gives the best training performance, and that other codecs
            &quot;may affect training time&quot;. Before you record in a new codec, check your GPU&apos;s decode
            columns for that codec in NVIDIA&apos;s matrix.{' '}
            <Cite id="F05-42">LeRobot v0.7.0 configs/video.py, codec list</Cite>{' '}
            <Cite id="F05-43">LeRobot streaming video encoding docs, Choosing a Codec</Cite>
          </Box>
          <Box variant="p">
            If the matrix says that your GPU can decode your codec, you still need to test the software that calls
            the engine. For example, Cosmos Curator, NVIDIA&apos;s video curation pipeline, removed its FFmpeg GPU
            decode mode, because its benchmarks showed that mode performing the same as FFmpeg on the CPU. Cosmos
            Curator now decodes on the GPU through NVIDIA&apos;s PyNvVideoCodec library instead.{' '}
            <Cite id="F05-77">Cosmos Curator slim-image.md</Cite>
          </Box>
          <ExpandableSection headerText="Video engines and AV1 decode support by GPU and EC2 instance family" variant="footer">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 760 }}>
                <thead>
                  <tr>
                    <th style={TH}>GPU</th>
                    <th style={TH}>EC2 instance family</th>
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
            description="A curation pipeline mixes CPU stages and GPU stages, and a GPU stage can only run as fast as the stages that feed it. You can size an instance from each stage's CPU and GPU budget, and find the slowest link before you add GPUs."
          >
            Sizing the CPU and GPU stages of a curation pipeline
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            For one arm&apos;s dataset, a person can do the curation by hand. LeRobot&apos;s recorder makes 50
            episodes by default. You watch them and delete the failed ones by their index with one command,{' '}
            <code>lerobot-edit-dataset</code>, which also recomputes the dataset statistics.{' '}
            <Cite id="F05-2">LeRobot v0.7.0 configs/dataset.py</Cite>{' '}
            <Cite id="F05-81">LeRobot v0.7.0 using_dataset_tools.mdx</Cite>
          </Box>
          <Box variant="p">
            With thousands of hours of video, nobody can watch every clip, so small models do the work. They drop
            the clips where nothing moves, score how each clip looks, write a caption for it, and compare it with the
            other clips to find near copies. The job becomes a pipeline in which CPU stages feed GPU stages.{' '}
            <Cite id="F05-69">Cosmos Curator video-pipelines.md, stage list</Cite>
          </Box>
          <Box variant="div">
            NVIDIA&apos;s Cosmos Curator (v2.10.0, released 2026-11-10) runs this kind of pipeline on Ray, a
            framework that spreads Python jobs across the machines of a cluster. Cosmos Curator gives each stage a
            budget in CPUs or in fractions of a GPU. The defaults include these budgets:
            <ul style={LIST}>
              <li>
                <strong>Decoding frames</strong> gets 3 CPUs per worker.
              </li>
              <li>
                <strong>Transcoding</strong>, which re-encodes each clip (here to H.264), gets 5 CPUs per worker.
              </li>
              <li>
                <strong>Most of the model stages</strong> get 0.25 of a GPU per worker. These defaults are tuned for a GPU
                with 48 GB of memory.
              </li>
            </ul>
            <Cite id="F05-68">Cosmos Curator v2.10.0 README</Cite>{' '}
            <Cite id="F05-69">Cosmos Curator video-pipelines.md, stage list</Cite>{' '}
            <Cite id="F05-71">Cosmos Curator video-pipelines.md, Options for Performance</Cite>
          </Box>
          <Box variant="p">
            As an example, apply these budgets to an eight-GPU G6e instance, whose L40S GPUs have 48 GB of memory
            each. Each GPU can hold four model workers at a quarter of a GPU each. The CPU stages share the 24 vCPUs
            that come with each GPU. Eight decode workers at 3 CPUs each (24 / 3 = 8) would take all 24 vCPUs, and 4
            transcode workers at 5 CPUs each take 20. So a pipeline that runs both stages has to split the vCPUs
            between them. The budgets do not tell you how to split them. You get that from each stage&apos;s measured
            throughput on your own clips, which is what a short run measures.{' '}
            <Cite id="F05-71">Cosmos Curator video-pipelines.md, Options for Performance</Cite>{' '}
            <Cite id="F05-65">EC2 accelerated computing specifications</Cite>{' '}
            <Cite id="F08-45">EC2 accelerated computing specifications, accelerator memory</Cite>
          </Box>
          <Box variant="p">
            For GPUs without an encoder engine, the pipeline&apos;s default encoder runs on the CPU, and the
            pipeline&apos;s documentation names the A100 and the H100 as such GPUs. None of the P-family GPUs in
            NVIDIA&apos;s matrix has an encoder engine, so on P instances, transcoding stays on the CPU cores.{' '}
            <Cite id="F05-77">Cosmos Curator slim-image.md</Cite>{' '}
            <Cite id="F05-67">join of the NVIDIA matrix and the EC2 specifications</Cite>
          </Box>
          <Box variant="p">
            To size the number of GPUs, you need a processing rate. In March 2025, NVIDIA published an end-to-end
            rate for the whole pipeline on 720p video: in streaming mode, one GPU processed one hour of video in
            about 195 seconds. That is 3,600 / 195 = 18.5 hours of video per GPU-hour. NVIDIA measured it on NeMo
            Video Curator, the predecessor of Cosmos Curator, on its DGX Cloud service, and did not name the
            version. It is the closest published rate we found. At that rate, an illustrative <Toy>1,000</Toy> hours
            of video take about <Derived>54</Derived> GPU-hours. Treat this as a rough order of magnitude from an
            older version, and check it against a short run of your own.{' '}
            <Cite id="F05-78">NVIDIA Technical Blog, NeMo Video Curator on DGX Cloud (2025-03-18)</Cite>
          </Box>
          <Figure
            cites="F05-69 F05-70 F05-71 F05-73 F05-77"
            caption={
              <>
                The decode, transcode and caption-preparation stages have budgets in CPUs per worker, and the model
                stages have budgets in fractions of a GPU. So both the vCPUs and the GPUs of one instance limit how
                fast the pipeline runs. The clip counts and the choice of which clips are dropped are illustrations,
                and the frames are simulated.
              </>
            }
          >
            <CurFunnel />
          </Figure>
          <Box variant="p">
            One CPU stage exists only to keep a GPU stage busy. Preparing the inputs for the captioning model is CPU
            work, and if the captioning stage did this work itself, its GPU would sit idle. So the pipeline makes
            input preparation a stage of its own, with 3 CPUs per worker. This stage can start many CPU workers to
            keep the captioning stage&apos;s GPU workers busy.{' '}
            <Cite id="F05-70">Cosmos Curator video-pipelines.md, note under the stage list</Cite>{' '}
            <Cite id="F05-71">Cosmos Curator video-pipelines.md, Options for Performance</Cite>
          </Box>
          <Box variant="p">
            Two published runs on 32 GPUs show the difference between a pipeline that keeps its GPUs busy and one
            whose GPUs wait. The two runs were measured in different ways. The first run is in the same March 2025
            NVIDIA post. The post describes a controller that measures the throughput of each stage and resizes that
            stage&apos;s pool of workers every three minutes. The controller over-provisions the CPU-only stages,
            which means it gives them more workers than their measured load requires. NVIDIA reports that, after a
            warm-up, the workers of the GPU stages were busy more than 99.5% of the time, on 32 GPUs across four
            nodes. <Cite id="F05-79">NVIDIA Technical Blog, NeMo Video Curator on DGX Cloud, architecture</Cite>{' '}
            <Cite id="F05-78">NVIDIA Technical Blog, NeMo Video Curator on DGX Cloud (2025-03-18)</Cite>
          </Box>
          <Box variant="p">
            The second run shows the opposite case. It comes from a design note for a robot captioning recipe that
            is still incubating in the current Cosmos Curator toolkit. A replica here is one running copy of the
            captioning model. On 32 H100s (4 nodes of 8 GPUs), 32 captioning replicas processed 7.1 rows of the
            recipe&apos;s input table per second, while their combined capacity was about 43 rows per second.
            Aggregate GPU utilisation was about 17%, which means the GPUs had work running for less than a fifth of
            the time. Ten of the 32 replicas never received a request. The slowest link was fetching the clips. This
            is a single run that was cancelled before it completed, and the authors list the slow fetch as a known
            weakness.{' '}
            <Cite id="F05-76">Cosmos Curator curator-next-robot-action-caption.md</Cite>
          </Box>
          <Box variant="p">
            Deduplication, the step that removes near copies, does not decode the video again. During the main
            curation pipeline, an embedding model has already turned each clip into an embedding. An embedding is a
            vector, a list of numbers computed so that similar clips get vectors that are close together. A second
            pipeline then groups these vectors into clusters with K-Means, an algorithm that groups vectors around a
            chosen number of centres. The pipeline orders each cluster by cosine similarity to the cluster&apos;s
            centre. Cosine similarity is a score for two vectors that is 1 when they point in the same direction.
            The pipeline&apos;s options indicate that it then drops the clips that are too close to another clip.{' '}
            <Cite id="F05-73">Cosmos Curator video-pipelines.md, Dedup Pipeline</Cite>
          </Box>
          <Box variant="p">
            A curation pass splits into short, independent pieces of work. If a machine is lost in the middle of the
            pass, you lose only the clips that machine was processing. So curation has the workload type called
            independent tasks, and it can run on Spot Instances, the spare EC2 capacity that AWS can reclaim.
            Section 24, Orchestrating Physical AI on AWS, places curation in this workload type.{' '}
            <Cite id="F08-78">the five workload types</Cite>
          </Box>
          <Box variant="p">
            To size a curation pass, run it briefly on your own clips. Find the slowest link in the pipeline,
            including the fetching of clips, before you add GPUs.{' '}
            <Cite id="F05-76">Cosmos Curator curator-next-robot-action-caption.md</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="One short run tells you whether the GPU waits for frames. If it does, change the loader's settings first, then the instance, and the codec last."
          >
            Checking a short run and fixing a slow data feed
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            To find out whether the GPU waits for data, compare your run&apos;s data-loading time per step with its
            update time. LeRobot&apos;s hardware guide reports these two times as <code>dataloading_s</code> and{' '}
            <code>update_s</code>, and the data-loading time includes preprocessing. For the guide&apos;s three
            policies, data loading takes 0.011 to 0.015 s per step, and the update takes 0.167 to 2.548 s. Data
            loading is under a tenth of the update time in every run, so in all three runs the GPUs set the pace.{' '}
            <Cite id="F01-91">LeRobot hardware guide, benchmark table</Cite>
          </Box>
          <Box variant="p">
            A firmer test is to change the number of workers, <code>W</code>. If the number of steps per second rises
            when you add workers, the workers were setting the pace. If it stays flat, the limit is somewhere else.
            In that case, compare the loading time with the update time to tell whether the GPU or a slow read is
            the limit. <Cite id="F01-91">LeRobot hardware guide, benchmark table</Cite>
          </Box>
          <Box variant="p">
            GPU utilisation in <code>nvidia-smi</code> shows the same wait from the GPU&apos;s side. A kernel
            is a function that runs on the GPU. GPU utilisation is the percentage of the sample period during
            which at least one kernel was executing on the GPU. So a GPU that waits for batches shows a low
            reading. The hardware guide reports about 80 to 95% for its runs, and the curation design note
            reports about 17%. A high reading proves less than a low one, because the figure does not say how
            much of the GPU each kernel used.{' '}
            <Cite id="F08-30">nvidia-smi documentation, Utilization</Cite>{' '}
            <Cite id="F01-91">LeRobot hardware guide, benchmark table</Cite>{' '}
            <Cite id="F05-76">Cosmos Curator curator-next-robot-action-caption.md</Cite>
          </Box>
          <Box variant="p">
            <code>nvidia-smi</code> also shows where the decoding happens. It reports decoder utilisation as a
            separate figure from the utilisation of the GPU&apos;s compute part. If decoder utilisation reads zero
            while the job trains on video, the decode engine is unused, and the decoding runs on the CPU. A GPU
            can be divided into isolated slices with NVIDIA&apos;s MIG (Multi-Instance GPU) feature. On a GPU split
            this way, none of these figures can be queried.{' '}
            <Cite id="F08-31">nvidia-smi documentation, Utilization</Cite>
          </Box>
          <Box variant="div">
            If the workers set the pace, change the settings before you change the machine. Work through these steps
            in order:
            <ul style={LIST}>
              <li>
                <strong>Add workers.</strong> Raise the worker count from its default of 4 toward{' '}
                <code>B / (r x u)</code>, and stay within the physical cores available to each GPU. Measure how much
                each added worker returns.
              </li>
              <li>
                <strong>Move augmentation to the GPU.</strong> This leaves the workers with only the decoding.
              </li>
              <li>
                <strong>Keep a short GOP.</strong> Record at a short GOP size, such as LeRobot&apos;s default of 2,
                so that each random frame costs only a few decodes.
              </li>
              <li>
                <strong>Change the instance.</strong> If the GPU still waits, move to an instance with more physical
                cores per GPU. Among the eight-GPU sizes, that means g7.48xlarge. Otherwise, choose a one-GPU size
                with more vCPUs.
              </li>
            </ul>
            <Cite id="F05-61">LeRobot v0.7.0 configs/train.py</Cite>{' '}
            <Cite id="F05-58">LeRobot v0.7.0 lerobot-dataset-v3.mdx</Cite>{' '}
            <Cite id="F05-37">LeRobot v0.7.0 video_utils.py, decoder docstrings</Cite>{' '}
            <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>
          </Box>
          <Box variant="p">
            For software that decodes on the GPU, you choose the codec and the instance together. The GPU&apos;s row
            in NVIDIA&apos;s matrix tells you whether it can decode your codec, and a recording in LeRobot&apos;s
            default AV1 rules out P5 and P4d. With LeRobot&apos;s own loader, the CPU cores do all the decoding
            whatever the GPU, so compare instances by the number of physical cores per GPU instead. Most eight-GPU
            sizes have 12 physical cores (24 vCPUs) per GPU, p4d.24xlarge has 6, and g7.48xlarge has 24. If the
            instance is already fixed, choose a codec that its GPU can decode while you can still record. If no
            engine on that instance decodes your codec, plan enough CPU cores for the decoding.{' '}
            <Cite id="F05-39">LeRobot v0.7.0 video_utils.py</Cite>{' '}
            <Cite id="F05-65">EC2 accelerated computing specifications</Cite>{' '}
            <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>{' '}
            <Cite id="F05-67">join of the NVIDIA matrix and the EC2 specifications</Cite>
          </Box>
          <Box variant="p">
            Before you rent eight GPUs for the long training run, run one short job on the instance you plan to use,
            and compare its data-loading time with its update time.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
