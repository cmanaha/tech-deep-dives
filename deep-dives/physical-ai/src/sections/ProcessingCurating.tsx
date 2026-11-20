import type { CSSProperties, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Derived } from '../components/Cite';
import { Figure, AnimatedFigure } from '../components/Figure';
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

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/** The thread task, stated once for this section. */
const TASK_SENTENCE = `the ${ARM} has been driven through the task (${TASK_STORY}) a few dozen times`;

/* ------------------------------------------------------------------------ */
/* Diagram 10.1 (static): the curation graph, stages coloured by machine part */
/* ------------------------------------------------------------------------ */

interface Stage {
  title: string;
  sub: string;
  fill: string;
  ink: string;
  dashed?: boolean;
}

const STORE = { fill: STORE_FILL, ink: STORE_INK };
const CPU = { fill: CPU_FILL, ink: CPU_INK };
const TENSOR = { fill: TENSOR_FILL, ink: TENSOR_INK };
const VIDEO = { fill: VIDEO_FILL, ink: VIDEO_INK };

/** Each row is one stage, or two boxes side by side when a stage uses two machine parts. */
const CURATION_ROWS: Stage[][] = [
  [{ title: '1. Download', sub: 'storage and network: fetch the MP4 files', ...STORE }],
  [
    { title: '2. Decode frames', sub: 'CPU: 3 per worker', ...CPU },
    { title: '2. Find shot changes', sub: 'GPU: 0.25 per worker', ...TENSOR },
  ],
  [
    { title: '3. Transcode to H.264', sub: 'CPU: 5 per worker', ...CPU },
    { title: 'or GPU video engines', sub: 'for 2 and 3, where fitted', ...VIDEO, dashed: true },
  ],
  [
    { title: '4. Motion filter', sub: 'GPU: 0.5 per worker', ...TENSOR },
    { title: '4. Aesthetic filter', sub: 'GPU: 0.25 per worker', ...TENSOR },
  ],
  [{ title: '5. Embed each clip', sub: 'GPU: 0.25 per worker, one vector per clip', ...TENSOR }],
  [
    { title: '6. Prepare inputs', sub: 'CPU: 3 per worker', ...CPU },
    { title: '6. Write a caption', sub: 'GPU: captioning model', ...TENSOR },
  ],
  [{ title: '7. Write clips and metadata', sub: 'storage and network', ...STORE }],
  [{ title: 'Then: deduplicate', sub: 'clusters the embeddings, drops near copies', fill: '#ffffff', ink: NEUTRAL_INK }],
];

const LEGEND: { label: string; fill: string; ink: string }[] = [
  { label: 'CPU cores', ...CPU },
  { label: 'GPU tensor cores', ...TENSOR },
  { label: 'GPU video engines', ...VIDEO },
  { label: 'storage and network', ...STORE },
];

function CurationGraph() {
  const rowH = 44;
  const pitch = 58;
  const top = 12;
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 524" role="img" aria-labelledby="curating-graph-title" style={{ width: '100%', height: 'auto' }}>
        <title id="curating-graph-title">The stages of a video curation pipeline, each coloured by the machine part it loads</title>
        <desc>
          Seven stages run top to bottom: download, decode and split, transcode, filter, embed, caption, write. A
          deduplication pass follows. Decode, transcode and input preparation load CPU cores; the models load GPU
          tensor cores; the GPU video engines can take decode and transcode on cards that have them.
        </desc>
        <rect x="0" y="0" width="400" height="524" fill="#fbfbfd" />
        {CURATION_ROWS.map((row, r) => {
          const y = top + r * pitch;
          const w = row.length === 1 ? 360 : 174;
          return (
            <g key={row[0].title}>
              {r > 0 && <path d={`M200 ${y - 13} V${y - 6} M195 ${y - 7} L200 ${y - 1} L205 ${y - 7} Z`} stroke={NEUTRAL_INK} strokeWidth="1.5" fill={NEUTRAL_INK} />}
              {row.map((s, c) => {
                const x = 20 + c * 186;
                return (
                  <g key={s.title}>
                    <rect x={x} y={y} width={w} height={rowH} rx="4" fill={s.fill} stroke={s.ink} strokeWidth="1.5" strokeDasharray={s.dashed ? '5 3' : undefined} />
                    <text x={x + 10} y={y + 18} fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill={INK}>
                      {s.title}
                    </text>
                    <text x={x + 10} y={y + 35} fontFamily="sans-serif" fontSize="12" fill={INK}>
                      {s.sub}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
        {LEGEND.map((l, i) => {
          const x = 20 + (i % 2) * 186;
          const y = 478 + Math.floor(i / 2) * 22;
          return (
            <g key={l.label}>
              <rect x={x} y={y} width="16" height="14" rx="2" fill={l.fill} stroke={l.ink} strokeWidth="1.5" />
              <text x={x + 24} y={y + 11} fontFamily="sans-serif" fontSize="12" fill={INK}>
                {l.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

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
        A10. The matrix lists &quot;NVIDIA A10&quot;; the G5 card is sold as the A10G, which has no row of its own, so
        applying this row to it is our reading.
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
  {
    card: 'A100',
    family: 'P4d',
    nvenc: '0',
    nvdec: '5',
    av1: 'No',
    source: <Cite id="F05-46">NVIDIA support matrix, row NVIDIA A100</Cite>,
  },
  {
    card: 'H100',
    family: 'P5',
    nvenc: '0',
    nvdec: '7',
    av1: 'No',
    source: <Cite id="F05-47">NVIDIA support matrix, rows NVIDIA H100</Cite>,
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
];

export function ProcessingCurating() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="See why the first bottleneck in training is often a CPU decoding video, and how the codec you recorded with decides which instances can read it (LeRobot v0.7.0, Cosmos Curator v2.10.0, NVIDIA's support matrix and the EC2 instance tables, read 2026-11-20)"
          >
            10. Processing and Curating
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This section starts where section 9, Collecting Data, ends: {TASK_SENTENCE}, and each episode is on disk
            as table rows plus video, the video being AV1 written by a software encoder with a keyframe every second
            frame. Before a GPU can train on it, that video has to be turned back into pictures, and the weak
            episodes have to come out.
          </Box>
          <Box variant="p">
            That work runs on its own parts of the machine. Decoding is CPU work by default, and an EC2 instance
            fixes how much CPU sits beside each GPU: on most eight-GPU sizes, 24 vCPUs (virtual CPUs, the unit EC2
            counts processor capacity in) per GPU.{' '}
            <Cite id="F05-65">EC2 accelerated computing specifications</Cite> When those cores cannot decode frames
            as fast as the GPU consumes them, the GPU waits, and the run moves at the speed of its CPUs. The
            sections below build that picture from the jobs, the hardware that can decode and the trainer&apos;s
            input path, and end on the choice it leads to: pick the codec and the instance together.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Four jobs turn recordings into training data, and each one loads a different part of the machine">
            What happens between the robot and the trainer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">Four jobs sit between a recording and a training batch.</Box>
          <ul style={LIST}>
            <li>
              <strong>Decode.</strong> Turn compressed video back into frames, the arrays of pixels a model reads. It
              is repeated every time a frame is read, so it is the one job of the four that also runs inside every
              training step.
            </li>
            <li>
              <strong>Filter.</strong> Drop what the model should not learn from: failed attempts, clips where
              nothing moves, footage too dark or blurred to use.
            </li>
            <li>
              <strong>Embed.</strong> Run each clip through a model that returns an embedding: a list of numbers
              placed so that clips with similar content get lists that sit close together.
            </li>
            <li>
              <strong>Deduplicate.</strong> Compare the embeddings and remove clips that sit almost on top of
              another, so that many near-identical recordings do not outweigh the rest.
            </li>
          </ul>
          <Box variant="p">
            Filtering, embedding and deduplicating together are curation: choosing which recordings the model
            learns from. At the scale of the thread task a person does it. You watch the 50 episodes and delete the
            failed ones by index with <code>lerobot-edit-dataset</code>, which also recomputes the dataset
            statistics. <Cite id="F05-81">LeRobot v0.7.0 using_dataset_tools.mdx</Cite>
          </Box>
          <Box variant="p">
            At thousands of hours nobody watches, and a pipeline of small models scores, describes and compares the
            clips. The reference tool is NVIDIA Cosmos Curator, a toolkit for curating physical AI training data, at
            v2.10.0 (released 2026-11-10). It runs on Ray, a framework that spreads Python jobs across a cluster.{' '}
            <Cite id="F05-68">Cosmos Curator v2.10.0 README</Cite> Its reference pipeline has seven stages: download,
            decode and split at shot changes, transcode (re-encode) each clip to H.264, filter on motion and
            aesthetics, embed, caption with a vision-language model, and write.{' '}
            <Cite id="F05-69">Cosmos Curator video-pipelines.md, stage list</Cite>
          </Box>
          <Box variant="p">
            For sizing, the point is that the stages load different parts. The pipeline counts decode and transcode
            in CPUs and its models in fractions of a GPU. With defaults tuned for a 48 GB GPU, frame decode takes 3
            CPUs per worker and transcode 5, while the shot-detection, aesthetic and embedding models each take
            0.25 of a GPU per worker and the motion filter 0.5.{' '}
            <Cite id="F05-71">Cosmos Curator video-pipelines.md, Options for Performance</Cite> Small models share
            a card while the CPU stages scale out beside them. The split is deliberate: preparing the captioning
            model&apos;s inputs is its own CPU stage, so that many CPU workers keep the GPU workers busy.{' '}
            <Cite id="F05-70">Cosmos Curator video-pipelines.md, note under the stage list</Cite>
          </Box>
          <Box variant="p">
            A third part can take the video work: the GPU&apos;s video engines, the fixed circuits on the card that
            only compress and decompress video, which section 2 listed among the machine&apos;s parts. Cosmos
            Curator has a GPU decode path, and keeps GPU transcoding for cards with an encoder engine. Its default
            encoder runs on the CPU, because the A100 and H100 have no encoder engine.{' '}
            <Cite id="F05-77">Cosmos Curator slim-image.md</Cite>
          </Box>
          <Figure
            cites="F05-69 F05-70 F05-71 F05-73 F05-77"
            caption={
              <>
                Read top to bottom. Each box is a stage of Cosmos Curator&apos;s reference pipeline, coloured by the
                machine part it loads, with its default share per worker. Two boxes side by side are one stage using
                two parts. The dashed box is an alternative path. Deduplication is a second pipeline that reads the
                stored embeddings.
              </>
            }
          >
            <CurationGraph />
          </Figure>
          <Box variant="p">
            Cosmos Curator v2.10.0 publishes no throughput figure that this research located. Size a curation job
            from a short run on your own clips, watching which stage&apos;s workers are saturated.
          </Box>
          <ExpandableSection headerText="The one published curation throughput: March 2025, and a product with a different name" variant="footer">
            <SpaceBetween size="s">
              <Box variant="p">
                In a post of March 2025 about a pipeline it called NeMo Video Curator, running on its DGX Cloud
                service, NVIDIA reports about 195 seconds to process one hour of video per GPU in streaming mode,
                against about 352 seconds in batch mode. The post does not use the name Cosmos Curator and gives no
                software version.{' '}
                <Cite id="F05-78">NVIDIA Technical Blog, NeMo Video Curator on DGX Cloud (2025-03-18)</Cite> It is a
                dated order of magnitude for an earlier pipeline.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="The table that turns a codec choice into an instance choice">
            Which GPUs can decode which codec
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            NVIDIA names a card&apos;s video engines NVENC (NVIDIA Encoder), the circuit that compresses video, and
            NVDEC (NVIDIA Decoder), the circuit that decompresses it. Both are fixed-function hardware, separate
            from the tensor cores that run neural networks, so a card can be busy training while its decoder sits
            idle. A card carries a set number of each engine, and each engine handles a fixed list of codecs. NVIDIA
            publishes both in one support matrix.
          </Box>
          <Box variant="p">
            Section 9 left you with AV1 (AOMedia Video 1), the open video codec LeRobot writes by default. The table
            reads the matrix for that codec and joins each card to the EC2 family that carries it.
          </Box>
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
          <Box variant="p">
            The EC2 family column is our join of NVIDIA&apos;s matrix with the accelerator column of the EC2
            instance tables. <Cite id="F05-67">join of the NVIDIA matrix and the EC2 specifications</Cite>
          </Box>
          <Box variant="p">
            Read it as two groups. The G-family cards from the L4 upward encode and decode AV1 in hardware. The
            cards bought for large training runs have no encoder at all, and the A100 and the H100 cannot
            hardware-decode AV1 either. The H200 has no row in NVIDIA&apos;s matrix, so AV1 hardware decode on P5e
            and P5en is not established. The Blackwell cards of the P6 families decode AV1, still with no encoder.{' '}
            <Cite id="F05-67">join of the NVIDIA matrix and the EC2 specifications</Cite>
          </Box>
          <Box variant="p">
            An engine on the card is a possibility; whether your software uses it is a separate question. Cosmos
            Curator&apos;s design notes record that decoding through FFmpeg on the GPU performed the same as FFmpeg
            on the CPU, and the tool prefers a different NVIDIA library for GPU decode.{' '}
            <Cite id="F05-77">Cosmos Curator slim-image.md</Cite> LeRobot&apos;s stock loader does not use the engine
            at all, which is the next block.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="The CPU beside the GPU: how a run ends up waiting on 24 vCPUs while the card it was rented for sits idle">
            Why decode can bound a training run
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A trainer does not read video itself. Its dataloader does: the part of a training program that fetches
            samples from storage and assembles them into batches, using several worker processes that run in
            parallel on CPU cores. The{' '}
            <Link href="../llm-training-systems/">Training at Scale dive</Link> covers data loading for large runs.
            In LeRobot each worker also decodes. The default decoder is torchcodec, the PyTorch project&apos;s video
            decoder, and LeRobot runs it on the CPU. <Cite id="F05-39">LeRobot v0.7.0 video_utils.py</Cite> Pointing
            it at the GPU from inside a worker leads to CUDA initialisation errors, by the code&apos;s own warning.{' '}
            <Cite id="F05-41">LeRobot v0.7.0 video_utils.py, decoder note</Cite> So with the stock loader, AV1 is
            decoded by CPU cores on every card in the table, including the ones whose AV1 decoder then sits idle.{' '}
            <Cite id="F08-77">the CPU beside the GPU</Cite>
          </Box>
          <Box variant="p">
            Count the work for one training step with the defaults: batch size 8, 4 dataloader workers, a prefetch
            factor of 4 (the number of batches each worker keeps ready ahead of the GPU) and 100,000 steps.{' '}
            <Cite id="F05-61">LeRobot v0.7.0 configs/train.py</Cite> A batch of 8 rows from an arm with two cameras
            is 8 x 2 = <Derived>16</Derived> frames, taken from random places in the video files. With a keyframe
            every second frame each costs at most 2 decodes, so one step asks for at most <Derived>16</Derived> x 2 ={' '}
            <Derived>32</Derived> decoded frames, and the run asks 100,000 times.
          </Box>
          <Box variant="p">
            The sources do not say how long that takes on a named CPU. The only per-item decode latency found in the
            LeRobot repository is in an open pull request, whose authors report about 5 ms per item with torchcodec
            on a two-camera, 50-episode dataset, and for batches of 32, 16.98 ms per item before the change they
            propose and 4.95 ms after. They do not state the hardware.{' '}
            <Cite id="F05-62">LeRobot pull request 4549</Cite> At about 5 ms per row, a batch of 8 is 8 x 5 ={' '}
            <Derived>40</Derived> ms of CPU work. Spread over 4 workers that is about 10 ms per step, a ceiling near{' '}
            <Derived>100</Derived> steps per second. This is our arithmetic on a figure from unstated hardware, good
            for the order of magnitude only. What it shows holds on any hardware: cores and workers set the ceiling,
            and a faster GPU does not raise it.
          </Box>
          <Box variant="p">
            Decode is one of two jobs the workers do. Image augmentation (random changes to each image during
            training, such as shifts in brightness or framing; section 11, Augmentation and Synthetic Data, owns it)
            also runs per sample in the workers by default. LeRobot&apos;s docs state the result: &quot;the GPU ends
            up waiting for data&quot;. <Cite id="F05-58">LeRobot v0.7.0 lerobot-dataset-v3.mdx</Cite> Hugging Face
            reports that moving augmentation onto the GPU made training of ACT (Action Chunking with Transformers,
            the small imitation policy of section 4) 2.8x faster on an H100 and 3.3x faster on an A100. The post
            gives no dataset, camera count, batch size or CPU.{' '}
            <Cite id="F05-59">LeRobot v0.7.0 release blog, Augment on the GPU</Cite> Our reading of that figure: a
            run that speeds up 2.8x when CPU work leaves the input path had a GPU that spent most of each step
            waiting.
          </Box>
          <Box variant="p">
            How many cores do the workers get? On EC2 the instance type fixes it. The eight-GPU sizes of G5, G6,
            G6e, G7e, P5, P5e, P5en, P6-B200 and P6-B300 all have 192 vCPUs: 24 vCPUs per GPU. A vCPU on these x86
            instances is one hardware thread, and two threads share one physical core (simultaneous multithreading,
            or SMT: one core presenting itself as two so that it can interleave two programs). The 24 vCPUs are
            therefore 12 physical cores. Two sizes differ. p4d.24xlarge has 96 vCPUs for 8 A100s, 12 per GPU.
            g7.48xlarge runs 1 thread per core, so its 24 vCPUs per GPU are 24 physical cores, twice the physical
            cores per GPU of every other eight-GPU x86 size.{' '}
            <Cite id="F05-65">EC2 accelerated computing specifications</Cite>{' '}
            <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite> Single-GPU sizes
            give a wider choice, from 4 vCPUs (g6.xlarge) to 64 (g6.16xlarge) beside one L4.
          </Box>
          <AnimatedFigure
            name="decode bounds the trainer"
            steps={DECODE_STEPS}
            intervalMs={2600}
            cites="F05-39 F05-58 F05-65 F05-67"
            caption={
              <>
                Grey squares are frames on their way from the files to the GPU. The strip at the bottom of the GPU
                box shows how much of the time the GPU is working. Illustrative, not measured: the number of cores,
                batches and strip cells is chosen to fit the page.
              </>
            }
          >
            {(step, reduced) => <DecodeBoundsDiagram step={step} reduced={reduced} />}
          </AnimatedFigure>
          <ExpandableSection headerText="The same starvation in a curation run: 32 GPUs at about 17% utilisation" variant="footer">
            <SpaceBetween size="s">
              <Box variant="p">
                A design note for Cosmos Curator&apos;s incubating robot captioning recipe records one run that was
                bound by its input: on 32 H100s (4 nodes of 8), 32 captioning replicas delivered 7.1 rows per second
                against a capacity near 43, aggregate GPU utilisation was about 17%, and 10 replicas never received
                a request. Fetching the clips was the slow side. The run was cancelled before it completed, so this
                is one aborted run, reported by the tool&apos;s authors as a known weakness.{' '}
                <Cite id="F05-76">Cosmos Curator curator-next-robot-action-caption.md</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Three questions to settle before you record or rent, and the two readings that show a GPU starved of frames">
            Pick codec and instance together
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The codec is set at the bench and the instance is set at rental time, often by different people. Settle
            them in one pass.
          </Box>
          <ol style={LIST}>
            <li>
              <strong>Who decodes?</strong> With LeRobot&apos;s stock loader it is CPU cores, whatever the card. Then
              the AV1 column does not help the trainer and the core count does. Compare instances by physical cores
              per GPU (12 on most eight-GPU sizes, 24 on g7.48xlarge), or take a single-GPU size with more vCPUs.{' '}
              <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>
            </li>
            <li>
              <strong>Does a pipeline decode on the GPU?</strong> For a curation pipeline, or a loader built for GPU
              decode, the table decides. AV1 hardware decode is possible on G5 (decode only), G6, G6e, G7, G7e,
              P6-B200, P6-B300 and P6e-GB200, and not possible on G4dn, P4d or P5. On P5e and P5en, run a decode test
              before you commit, because NVIDIA&apos;s matrix has no row for the H200.{' '}
              <Cite id="F05-67">join of the NVIDIA matrix and the EC2 specifications</Cite>
            </li>
            <li>
              <strong>Is the instance already decided?</strong> Then choose the codec to fit it while you can still
              record in it, the decision section 9 ended on. Read the card&apos;s row in NVIDIA&apos;s matrix for the
              codec you plan to write, and where no engine decodes it, budget the cores.
            </li>
          </ol>
          <Box variant="p">
            Two readings show whether a running job is waiting on its input path. First, compare the two sides: in{' '}
            <code>nvidia-smi</code> the GPU utilisation is low or swings between busy and idle, while in{' '}
            <code>top</code> the dataloader worker processes hold their cores at full load. That job is CPU-bound.
            Second, <code>nvidia-smi</code> reports decoder utilisation as its own figure, separate from the compute
            part of the card. If it reads zero while the job trains on video, the decode engine is unused and decode
            is on the CPU. On a GPU split with MIG (Multi-Instance GPU, which divides one card into isolated
            slices), these figures cannot be queried.{' '}
            <Cite id="F08-31">nvidia-smi documentation, Utilization</Cite>
          </Box>
          <Box variant="p">
            When the readings say CPU-bound, the sources document three levers, cheapest first. Raise the number of
            workers toward the cores you have: in LeRobot&apos;s streaming reader one worker uses only about 2 CPU
            cores, and more worker processes are how more cores get used.{' '}
            <Cite id="F05-60">LeRobot v0.7.0 training_dataset_streaming.mdx</Cite> Move augmentation to the GPU
            with <code>--dataset.image_transforms.backend=gpu</code>.{' '}
            <Cite id="F05-59">LeRobot v0.7.0 release blog, Augment on the GPU</Cite> Or move to a size with more
            physical cores per GPU.
          </Box>
          <Box variant="p">
            Before you rent eight GPUs for a robot dataset, count what sits beside each one: 24 vCPUs, usually 12
            physical cores, decoding AV1 for a card that may have no engine for it.{' '}
            <Cite id="F05-65">EC2 accelerated computing specifications</Cite> Run one short job, take the two
            readings, and change the codec, the loader or the instance before the long run starts.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
