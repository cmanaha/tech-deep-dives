import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import { Cite, Derived } from '../components/Cite';
import { AnimatedFigure } from '../components/Figure';
import { ARM, TASK_STORY } from '../lib/task';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const NEUTRAL_INK = '#5f6b7a';
const EMPHASIS = '#0972d3';
const ROBOT_FILL = '#fff6d6';
const ROBOT_INK = '#7a5c00';

type Part = 'cpu' | 'memory' | 'tensor' | 'rays' | 'video' | 'neutral';

const PART: Record<Part, { fill: string; ink: string }> = {
  cpu: { fill: '#e8f1fb', ink: '#1f5fa8' },
  memory: { fill: '#efe9fb', ink: '#5b3fa8' },
  tensor: { fill: '#e6f6ea', ink: '#1e7b3a' },
  rays: { fill: '#fdeedd', ink: '#a85a0a' },
  video: { fill: '#fde8ef', ink: '#a8274f' },
  neutral: { fill: '#ffffff', ink: NEUTRAL_INK },
};

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 560, margin: '0 auto' };

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/* ------------------------------------------------------------------------ */
/* Diagram 1.1: the loop as a ring of eight stages around the arm           */
/* ------------------------------------------------------------------------ */

/* Two columns of four boxes; the ring runs clockwise through the box centres. */
const LEFT_X = 6;
const RIGHT_X = 272;
const BOX_W = 162;
const BOX_H = 82;
const ROW_Y = [16, 126, 236, 346];
const LEFT_C = LEFT_X + BOX_W / 2;
const RIGHT_C = RIGHT_X + BOX_W / 2;
const TOP_Y = ROW_Y[0] + BOX_H / 2;
const BOTTOM_Y = ROW_Y[3] + BOX_H / 2;
const TRACK_W = RIGHT_C - LEFT_C;
const TRACK_H = BOTTOM_Y - TOP_Y;
const PERIMETER = 2 * (TRACK_W + TRACK_H);
const TRACK = `M${LEFT_C} ${TOP_Y} H${RIGHT_C} V${BOTTOM_Y} H${LEFT_C} Z`;
const MID_X = (LEFT_C + RIGHT_C) / 2;

/* Distance along the ring, measured clockwise from the centre of stage 1. */
const onTop = (x: number) => x - LEFT_C;
const onRight = (y: number) => TRACK_W + (y - TOP_Y);
const onBottom = (x: number) => TRACK_W + TRACK_H + (RIGHT_C - x);
const onLeft = (y: number) => 2 * TRACK_W + TRACK_H + (BOTTOM_Y - y);

interface Stage {
  n: number;
  name: string;
  side: 'left' | 'right';
  row: number;
  chips: { label: string; part: Part }[];
}

/* The tags name the resource that is the bottleneck in the workloads of each stage (register 08, the workload table). */
const STAGES: Stage[] = [
  { n: 1, name: 'Collect', side: 'left', row: 0, chips: [{ label: 'CPU cores', part: 'cpu' }] },
  {
    n: 2,
    name: 'Process and curate',
    side: 'right',
    row: 0,
    chips: [
      { label: 'CPU cores', part: 'cpu' },
      { label: 'GPU video engines', part: 'video' },
    ],
  },
  {
    n: 3,
    name: 'Augment',
    side: 'right',
    row: 1,
    chips: [
      { label: 'CPU cores', part: 'cpu' },
      { label: 'GPU memory', part: 'memory' },
    ],
  },
  {
    n: 4,
    name: 'Simulate',
    side: 'right',
    row: 2,
    chips: [
      { label: 'CPU cores', part: 'cpu' },
      { label: 'GPU ray-tracing cores', part: 'rays' },
    ],
  },
  {
    n: 5,
    name: 'Train a policy',
    side: 'right',
    row: 3,
    chips: [
      { label: 'GPU tensor cores', part: 'tensor' },
      { label: 'GPU memory', part: 'memory' },
    ],
  },
  { n: 6, name: 'Train a world model', side: 'left', row: 3, chips: [{ label: 'GPU tensor cores', part: 'tensor' }] },
  {
    n: 7,
    name: 'Evaluate',
    side: 'left',
    row: 2,
    chips: [
      { label: 'same as stage 4', part: 'neutral' },
      { label: 'GPU tensor cores', part: 'tensor' },
    ],
  },
  {
    n: 8,
    name: 'Export and deploy',
    side: 'left',
    row: 1,
    chips: [
      { label: 'GPU tensor cores', part: 'tensor' },
      { label: 'memory bandwidth', part: 'memory' },
    ],
  },
];

/* Per animation step: the stages in focus and where the travelling dot sits on the ring. */
const FRAMES: { active: number[]; at: number }[] = [
  { active: [1], at: onTop(188) },
  { active: [1], at: onTop(MID_X) },
  { active: [2], at: onTop(252) },
  { active: [3, 4], at: onRight(217) },
  { active: [5, 6], at: onBottom(MID_X) },
  { active: [7], at: onLeft(337) },
  { active: [8], at: onLeft(227) },
  { active: [1], at: onLeft(117) },
];

const LOOP_STEPS = [
  'Collect: a person guides the arm through the task once. One recorded attempt at the task is called an episode, and the blue dot stands for that episode.',
  'The episode is saved to disk as a table of joint readings and motor commands, plus one video file per camera.',
  'Process and curate: the video is decoded back into frames, and bad episodes are removed. CPU cores do the decoding, or the GPU video engines do it when the GPU supports that video format.',
  'Augment and simulate: augmentation turns each recording into more training samples. A simulated arm adds more attempts, and a ray-tracing renderer draws its camera images.',
  'Train: the policy is trained on the episodes, and a world model is trained to predict what happens next. Both jobs run matrix arithmetic on the GPU tensor cores.',
  'Evaluate: each saved version of the policy attempts the task many times in simulation and then on the real arm, and the successes are counted.',
  'Export and deploy: the chosen policy is converted into the format that the computer next to the arm runs fastest, and it is sent to that computer.',
  'The arm now runs the policy without a person. Its attempts are recorded as new episodes, and the loop starts again.',
];

function hidden(show: boolean, reduced: boolean): CSSProperties {
  return { opacity: show ? 1 : 0, transition: reduced ? 'none' : 'opacity 400ms ease' };
}

function StageBox({ stage, active }: { stage: Stage; active: boolean }) {
  const x = stage.side === 'left' ? LEFT_X : RIGHT_X;
  const y = ROW_Y[stage.row];
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={BOX_W}
        height={BOX_H}
        rx={8}
        fill={active ? '#f2f8fd' : '#ffffff'}
        stroke={active ? EMPHASIS : NEUTRAL_INK}
        strokeWidth={active ? 2.5 : 1}
      />
      <text x={x + 10} y={y + 21} fontSize={12.5} fontWeight={700} fill={INK}>
        {stage.n}. {stage.name}
      </text>
      {stage.chips.map((chip, i) => (
        <g key={chip.label}>
          <rect
            x={x + 8}
            y={y + 30 + i * 24}
            width={BOX_W - 16}
            height={20}
            rx={10}
            fill={PART[chip.part].fill}
            stroke={PART[chip.part].ink}
            strokeWidth={1}
          />
          <text x={x + BOX_W / 2} y={y + 44 + i * 24} fontSize={12} textAnchor="middle" fill={PART[chip.part].ink}>
            {chip.label}
          </text>
        </g>
      ))}
    </g>
  );
}

/* Arrowheads in the gaps between boxes: tip position and heading in degrees (0 points right). */
const ARROWS: { x: number; y: number; turn: number }[] = [
  { x: RIGHT_X - 2, y: TOP_Y, turn: 0 },
  { x: RIGHT_C, y: ROW_Y[1] - 2, turn: 90 },
  { x: RIGHT_C, y: ROW_Y[2] - 2, turn: 90 },
  { x: RIGHT_C, y: ROW_Y[3] - 2, turn: 90 },
  { x: LEFT_X + BOX_W + 2, y: BOTTOM_Y, turn: 180 },
  { x: LEFT_C, y: ROW_Y[2] + BOX_H + 2, turn: 270 },
  { x: LEFT_C, y: ROW_Y[1] + BOX_H + 2, turn: 270 },
  { x: LEFT_C, y: ROW_Y[0] + BOX_H + 2, turn: 270 },
];

function LoopRing({ step, reduced }: { step: number; reduced: boolean }) {
  const frame = FRAMES[step] ?? FRAMES[FRAMES.length - 1];
  const last = step >= FRAMES.length - 1;
  const travelled = last ? PERIMETER : frame.at;
  const personDrives = step <= 1;
  const policyDrives = last;
  const move = (property: string) => (reduced ? 'none' : `${property} 700ms ease`);
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 440 444" role="img" aria-labelledby="one-loop-ring-title" style={{ width: '100%', height: 'auto' }}>
        <title id="one-loop-ring-title">The eight stages of the robot learning loop, in a ring around one arm</title>
        <desc>
          Eight boxes form a ring around a small robot arm with a block and a cup. Clockwise from the top left, the
          stages are collect, process and curate, augment, simulate, train a policy, train a world model, evaluate,
          and export and deploy. Each box has one or two tags that name the resources that are the bottleneck in
          that stage. A dot that stands for one episode travels round the ring and returns to the arm.
        </desc>
        <rect x={0} y={0} width={440} height={444} fill="#fbfbfd" />

        {/* The ring: grey track, the part already travelled in blue. */}
        <path d={TRACK} fill="none" stroke="#c6cdd5" strokeWidth={3} />
        <path
          d={TRACK}
          fill="none"
          stroke={EMPHASIS}
          strokeWidth={3}
          strokeDasharray={`${travelled} ${PERIMETER}`}
          style={{ transition: move('stroke-dasharray') }}
        />
        {ARROWS.map((a) => (
          <path key={`${a.x}-${a.y}`} d="M0 0 L-9 -5 L-9 5 Z" fill={NEUTRAL_INK} transform={`translate(${a.x} ${a.y}) rotate(${a.turn})`} />
        ))}

        {STAGES.map((stage) => (
          <StageBox key={stage.n} stage={stage} active={frame.active.includes(stage.n)} />
        ))}

        {/* The travelling episode: a zero-length dash with a round cap, moved along the ring. */}
        <path
          d={TRACK}
          fill="none"
          stroke="#ffffff"
          strokeWidth={17}
          strokeLinecap="round"
          strokeDasharray={`0.01 ${PERIMETER}`}
          strokeDashoffset={-frame.at}
          style={{ transition: move('stroke-dashoffset') }}
        />
        <path
          d={TRACK}
          fill="none"
          stroke={EMPHASIS}
          strokeWidth={13}
          strokeLinecap="round"
          strokeDasharray={`0.01 ${PERIMETER}`}
          strokeDashoffset={-frame.at}
          style={{ transition: move('stroke-dashoffset') }}
        />

        {/* Centre: the arm, the block and the cup. */}
        <g transform="translate(5 0)">
          <text x={215} y={96} fontSize={12.5} fontWeight={700} textAnchor="middle" fill={ROBOT_INK}>
            {ARM} arm
          </text>
          <path
            d="M167 106 H263 V254 H167 Z"
            fill="none"
            stroke={EMPHASIS}
            strokeWidth={2}
            strokeDasharray="5 4"
            style={hidden(personDrives || policyDrives, reduced)}
          />
          <line x1={176} y1={232} x2={254} y2={232} stroke={NEUTRAL_INK} strokeWidth={2} />
          <path d="M178 232 V221 H196 V232 Z" fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth={1.5} />
          <path d="M187 216 L201 142 L233 162 L230 196" fill="none" stroke={ROBOT_INK} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M230 196 L224 209 M230 196 L236 209" fill="none" stroke={ROBOT_INK} strokeWidth={3} strokeLinecap="round" />
          <circle cx={187} cy={216} r={5} fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth={1.5} />
          <circle cx={201} cy={142} r={5} fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth={1.5} />
          <circle cx={233} cy={162} r={5} fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth={1.5} />
          <path d="M224 221 H236 V232 H224 Z" fill="#d6e4f5" stroke="#1f5fa8" strokeWidth={1.5} />
          <path d="M240 212 L256 212 L253 232 L243 232 Z" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth={1.5} />
          <text x={213} y={248} fontSize={12} textAnchor="middle" fill={INK}>
            block
          </text>
          <text x={245} y={248} fontSize={12} textAnchor="middle" fill={INK}>
            cup
          </text>

          {/* Who is moving the arm at this step. */}
          <text x={215} y={276} fontSize={12} textAnchor="middle" fill={INK} style={hidden(personDrives, reduced)}>
            steered by
          </text>
          <text x={215} y={291} fontSize={12} fontWeight={700} textAnchor="middle" fill={INK} style={hidden(personDrives, reduced)}>
            a person
          </text>
          <text x={215} y={276} fontSize={12} textAnchor="middle" fill={INK} style={hidden(!personDrives && !policyDrives, reduced)}>
            waiting for
          </text>
          <text x={215} y={291} fontSize={12} fontWeight={700} textAnchor="middle" fill={INK} style={hidden(!personDrives && !policyDrives, reduced)}>
            its policy
          </text>
          <text x={215} y={276} fontSize={12} textAnchor="middle" fill={INK} style={hidden(policyDrives, reduced)}>
            driven by
          </text>
          <text x={215} y={291} fontSize={12} fontWeight={700} textAnchor="middle" fill={INK} style={hidden(policyDrives, reduced)}>
            the policy
          </text>

          {/* What the dot carries. */}
          <path d="M167 306 H263 V352 H167 Z" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth={1} style={hidden(step >= 1, reduced)} />
          <text x={215} y={325} fontSize={12} fontWeight={700} textAnchor="middle" fill={EMPHASIS} style={hidden(step >= 1 && !last, reduced)}>
            one episode:
          </text>
          <text x={215} y={325} fontSize={12} fontWeight={700} textAnchor="middle" fill={EMPHASIS} style={hidden(last, reduced)}>
            next episodes:
          </text>
          <text x={215} y={342} fontSize={12} textAnchor="middle" fill={INK} style={hidden(step >= 1, reduced)}>
            table + video
          </text>
        </g>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* The fifteen workloads, grouped by workload type                          */
/* ------------------------------------------------------------------------ */

interface Workload {
  n: string;
  stage: string;
  name: string;
  does: string;
  part: string;
  /* True on the rows whose bottleneck is easiest to miss when choosing an instance. */
  decides?: boolean;
}

const GROUPS: { workloadType: string; forces: string; rows: Workload[] }[] = [
  {
    workloadType: 'Independent tasks',
    forces:
      'If a machine is lost, only the piece of work it was running is lost. In the cloud, these jobs run in a queue that retries failed pieces, and they can run on Spot Instances.',
    rows: [
      {
        n: '2',
        stage: 'Process and curate',
        name: 'Decode and filter',
        does: 'Decodes the video back into frames and removes the bad episodes.',
        part: 'CPU cores, or the GPU video engines when the GPU can decode that video format in hardware.',
        decides: true,
      },
      {
        n: '3',
        stage: 'Process and curate',
        name: 'Embed and deduplicate',
        does: 'A vision model turns each clip into a vector, so that near-duplicate clips can be found and removed.',
        part: 'GPU tensor cores. The models are small enough that several of them can share one GPU.',
      },
      {
        n: '5',
        stage: 'Simulate',
        name: 'CPU physics step',
        does: 'Advances one simulated copy of the arm, the block and the cup by one time step.',
        part: 'One CPU core per scene, because the arithmetic for one scene is small, runs in sequence and branches on the data.',
      },
      {
        n: '6',
        stage: 'Simulate',
        name: 'GPU-parallel physics',
        does: 'Advances thousands of simulated copies of the arm at the same time.',
        part: 'GPU general compute, with one CPU core feeding it work.',
      },
      {
        n: '7',
        stage: 'Simulate',
        name: 'Simulated cameras',
        does: 'Renders what each simulated camera sees, at every step.',
        part: "GPU memory runs out first. When NVIDIA's RTX renderer draws the images, the GPU's ray-tracing cores are the next bottleneck, and some training GPUs do not have them. Another renderer, the Warp ray tracer, runs on general GPU compute instead.",
        decides: true,
      },
      {
        n: '10',
        stage: 'Evaluate',
        name: 'Evaluation in simulation',
        does: 'Each saved version of the policy attempts the task many times on a simulated arm, and the successes are counted.',
        part: 'The job has the bottleneck of whichever of its three parts limits it: the physics, the simulated cameras or running the policy.',
      },
      {
        n: '11',
        stage: 'Export and deploy',
        name: 'Compile for the robot',
        does: 'Converts the chosen policy into the format that the computer next to the arm runs fastest. Each kind of device needs its own build.',
        part: 'The build uses the GPU and CPU of the computer next to the arm for minutes. It runs on the device it is for, outside any job queue.',
      },
      {
        n: '13',
        stage: 'Only at model vendors',
        name: 'Generative augmentation',
        does: 'A large video model redraws recorded clips or generates new ones.',
        part: 'GPU memory and tensor cores. The model needs tens of GB of GPU memory and takes minutes per clip.',
      },
    ],
  },
  {
    workloadType: 'Long single-machine runs',
    forces:
      'One job runs on one machine for hours. It can run on Spot Instances only if it saves checkpoints often enough.',
    rows: [
      {
        n: '4',
        stage: 'Augment (inside training)',
        name: 'Dataloader decode and augment',
        does: 'The dataloader is the component of the training job that prepares samples. For every training sample, it extracts a few frames from the video and varies them, for example with a crop or a colour shift.',
        part: 'CPU cores. The work runs in worker processes inside the training job, on the CPU cores that come with the instance. An instance has a fixed number of them for each GPU: 24 vCPUs (virtual CPUs), or 12 physical cores, per GPU on most eight-GPU sizes. If you run this work on a separate group of machines that stays up all the time, it becomes an always-on stream.',
        decides: true,
      },
      {
        n: '8',
        stage: 'Train a policy',
        name: 'Policy fine-tune',
        does: "Trains the arm's policy on its episodes, either from scratch or starting from a pretrained model.",
        part: 'GPU tensor cores. The amount of GPU memory limits which models fit on the GPU. If the dataloader cannot supply samples fast enough, its CPU cores become the bottleneck instead.',
      },
      {
        n: '9',
        stage: 'Train a world model',
        name: 'World-model training',
        does: 'Trains a small model to predict what the scene looks like after an action.',
        part: 'GPU tensor cores, on a single GPU.',
      },
    ],
  },
  {
    workloadType: 'Multi-node training',
    forces:
      'Each job runs on many machines that exchange data at every training step. These jobs need a dedicated cluster on reserved capacity, and Spot is not an option.',
    rows: [
      {
        n: '14',
        stage: 'Only at model vendors',
        name: 'Robot-model pretraining',
        does: 'Trains the large robot model that a policy fine-tune starts from.',
        part: 'Tensor cores across many machines, plus the network between the machines and the storage that supplies their data.',
      },
      {
        n: '15',
        stage: 'Only at model vendors',
        name: 'World-model pretraining',
        does: 'Trains the large world model that world-model training and generative augmentation start from.',
        part: 'The same three resources as robot-model pretraining, at a larger scale.',
      },
    ],
  },
  {
    workloadType: 'Real-time on the robot',
    forces:
      'These jobs run on the computer next to the arm and must never be interrupted. No cloud scheduler is involved.',
    rows: [
      {
        n: '1',
        stage: 'Collect',
        name: 'Record and encode',
        does: 'While a person guides the arm, records its joint angles and compresses the two camera streams into video.',
        part: "CPU cores on the computer next to the arm, because LeRobot's default video encoder runs in software.",
        decides: true,
      },
      {
        n: '12',
        stage: 'Export and deploy',
        name: 'On-robot inference',
        does: 'Runs the policy on the computer next to the arm, so that the arm has a new action for every 33.3 ms control period.',
        part: 'GPU tensor cores and memory bandwidth. Memory bandwidth matters because the CPU and the GPU of that computer share one memory.',
        decides: true,
      },
    ],
  },
];

const GROUP_ROW: CSSProperties = {
  padding: '10px 10px 6px',
  borderBottom: '1px solid #5f6b7a',
  background: '#f2f3f3',
  verticalAlign: 'top',
};

function WorkloadTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 720 }}>
        <thead>
          <tr>
            <th style={TH}>Workload</th>
            <th style={TH}>Stage</th>
            <th style={TH}>What it does for the arm</th>
            <th style={TH}>Bottleneck (in bold where it is easy to miss when you choose an instance)</th>
          </tr>
        </thead>
        {GROUPS.map((g) => (
          <tbody key={g.workloadType}>
            <tr>
              <th colSpan={4} scope="colgroup" style={{ ...GROUP_ROW, textAlign: 'left' }}>
                {g.workloadType}. <span style={{ fontWeight: 'normal' }}>{g.forces}</span>
              </th>
            </tr>
            {g.rows.map((w) => (
              <tr key={w.n}>
                <td style={TD}>
                  <strong>
                    <span data-num="nav">{w.n}</span>. {w.name}
                  </strong>
                </td>
                <td style={TD}>{w.stage}</td>
                <td style={TD}>{w.does}</td>
                <td style={TD}>{w.decides ? <strong>{w.part}</strong> : w.part}</td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function OneLoop() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Teaching a robot arm a single task involves up to fifteen different computing jobs. To find which instance and compute each job needs, you first need to understand which resource becomes its bottleneck. Based on that, you can select the instance type, the scheduler or orchestrator, and the purchase option: On-Demand, Savings Plans, Capacity Blocks or Spot."
          >
            1. Fifteen Computing Jobs Behind One Robot Arm: Where Each One Should Run
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Teaching a robot arm to do one task takes much more than training a model. The example used throughout
            is an {ARM}, a small desktop arm with six motors and two cameras, one on the wrist and one overhead.{' '}
            <Cite id="F01-8">LeRobot so_follower.py, lines 68-80</Cite>{' '}
            <Cite id="F01-30">LeRobot cameras.mdx and the record examples</Cite> The task is to {TASK_STORY}{' '}
            without a person controlling the arm.
          </Box>
          <Box variant="p">
            To get there, a person first shows the arm how to do the task. They move a second arm by hand, the
            leader arm (or teacher arm), and the {ARM} copies its movements. The positions of both arms&apos; joints
            and the video from both cameras are recorded during each demonstration with LeRobot, an open-source
            library for recording robot data and training robot models. These recordings are the data for
            supervised training: real-world examples of what the arm should do in each situation. After that, you
            process the video, simulate the arm, train a model, test it and deploy it to the arm. When broken down,
            those steps add up to fifteen separate computing jobs, listed in the table further down.
          </Box>
          <Box variant="p">
            To run these jobs efficiently, you have to consider which hardware makes sense for each one. With
            LeRobot&apos;s default settings, video compression runs on CPU cores.{' '}
            <Cite id="F08-77">the CPU cores next to the GPU</Cite> Rendering simulated camera images with a
            ray-tracing renderer, such as the one in NVIDIA Isaac Sim, needs GPUs that have ray-tracing (RT) cores,
            and the A100 and H100 training GPUs do not have them.{' '}
            <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite> Model training uses GPUs and keeps them busy for
            hours. Deploying the model is different, because there latency matters. The model that controls the arm
            runs under a strict time limit and often under a power budget too. So a small computer next to the
            robot, such as an NVIDIA Jetson Orin Nano or Jetson Thor, is usually the better choice. For each of these
            fifteen jobs, you want to know what it has to achieve and which resource lets it do that efficiently.
          </Box>
          <Box variant="p">
            Two questions help you set up your pipeline with the right type of instance, the right orchestrator and
            the right purchase option:
          </Box>
          <ol style={LIST}>
            <li>
              For each step in the pipeline, which resource saturates first and becomes the bottleneck when the step
              runs at full load, and what price-performance does each instance give you for that resource? The
              answer tells you which instance to use.
            </li>
            <li>
              How much work is lost if the instance fails or disappears, and is the instance used steadily or in
              bursts? The answer tells you which scheduler or orchestrator to use and which purchase option fits:
              Spot Instances, On-Demand, Capacity Blocks or Savings Plans. Each option is explained further down.
            </li>
          </ol>
          <Box variant="p">
            A bottleneck is the resource that is fully used while the rest of the machine is partly idle. A machine
            has several resources that can run out independently of each other, such as its CPU cores, its memory
            and each kind of unit inside a GPU.{' '}
            <Cite id="F08-50">the machine&apos;s resources and the counter that shows each</Cite> You can often
            estimate the bottleneck with simple arithmetic before running anything. Take what one unit of work needs
            from a resource, multiply it by the number of units per second, and compare the result with what the
            resource can deliver.
          </Box>
          <Box variant="p">
            Here is how that works on a simple example. The model that controls the arm is called a policy. It reads
            the camera images and the joint angles and decides how the motors move next. A real policy is too large
            to work through by hand, so the example uses a small test program in its place. The numbers below
            describe the test program, not the real policy.
          </Box>
          <Box variant="p">
            The test program holds six weight matrices of 1024 x 1024 <code>float32</code> values and multiplies a
            vector by each matrix in turn. A matrix-vector multiplication reads every value in the matrix once, so
            one pass through the program reads all 25.2 MB of weights. The processor&apos;s caches cannot hold 25.2
            MB, so every pass has to read the weights from main memory.{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-63">the test program&apos;s weights against the core&apos;s memory limits</Cite>
          </Box>
          <Box variant="p">
            The next number you need is how fast memory can deliver data. We measured it in a single run on one
            Cortex-A78AE CPU core of an NVIDIA Jetson Orin Nano Super, using a memory test that streams through
            arrays larger than the caches. It reached 11.71 GB/s. At that rate, memory can deliver the 25.2 MB of
            weights <Derived>465</Derived> times per second (11.71 GB/s / 25.2 MB). So before running the program,
            you can predict that it will not go above about <Derived>465</Derived> passes per second on this core,
            however fast the core does arithmetic. That prediction assumes 11.71 GB/s is the most memory bandwidth
            this core can get. <Cite id="F08-66">our profiling report, memory streaming row</Cite>{' '}
            <Cite id="F08-63">the test program&apos;s weights against the core&apos;s memory limits</Cite>
          </Box>
          <Box variant="p">
            We then ran the program once, in NumPy, on the same core. It reached 390 passes per second,{' '}
            <Derived>84</Derived>% of the predicted limit, which means it read 390 x 25.2 MB = 9.8 GB/s from memory.
            The calculation alone cannot tell you whether memory or computation held it at 390. The core&apos;s
            hardware performance counters can. These counters are built into the processor and record events such
            as clock cycles spent waiting. They showed that 62.3% of the core&apos;s clock cycles were stalled,
            waiting for memory. So the bottleneck is memory bandwidth. Faster arithmetic does not shorten those
            waits, so when you compare machines for this kind of job, compare their memory bandwidth in GB/s.{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-63">the test program&apos;s weights against the core&apos;s memory limits</Cite>{' '}
            <Cite id="F08-66">our profiling report, memory streaming row</Cite>
          </Box>
          <Box variant="p">
            The same method applies to the real policy on the robot&apos;s own computer. You need three numbers: how
            much data one call of the model reads and how much it computes, how many calls it makes per second, and
            how much memory bandwidth and compute that computer provides.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Some jobs can run on Spot Instances that AWS can take back at short notice; others need a machine that stays up until they finish. Three properties of each job, and how steadily it uses its machines, tell you which scheduler and purchase option fit."
          >
            Choosing the scheduler and the purchase option
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">When a job loses its machine, what happens next depends on three properties of the job:</Box>
          <ul style={LIST}>
            <li>
              <strong>Duration:</strong> how long one unit of its work runs.
            </li>
            <li>
              <strong>Coupling:</strong> whether its parts exchange data with each other while they run.
            </li>
            <li>
              <strong>Interruptibility:</strong> whether it can stop and restart without losing more than one unit of
              work.
            </li>
          </ul>
          <Box variant="p">
            Together, these three properties define the job&apos;s workload type. The workload type tells you which
            kind of scheduler or orchestrator fits the job and whether it can run on Spot Instances.{' '}
            <Cite id="F08-78">the five workload types, defined by three properties</Cite> To see the difference,
            compare two jobs for the same arm that sit at opposite extremes.
          </Box>
          <Box variant="p">
            The first job is the policy that controls the arm. It runs on the computer next to the arm, and it has to
            keep up with a fixed clock. By default, the arm accepts a new target for its motors 30 times per second,
            which is one every 33.3 ms, and it does not wait for a late answer. NVIDIA reports that one call of its
            GR00T N1.7 robot model takes a median of 149.0 ms on a Jetson Orin when compiled with TensorRT, the
            fastest option in NVIDIA&apos;s table for that device. That is 4.5 times longer than the 33.3 ms period.{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
          </Box>
          <Box variant="p">
            The arm can still work with calls that slow, because each call returns a chunk of future actions instead
            of a single action. In NVIDIA&apos;s benchmark, one chunk holds 40 actions. The arm plays one action from
            the chunk every 33.3 ms while the next call runs. This works as long as the remaining actions last longer
            than the next call takes. <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite>{' '}
            <Cite id="F01-87">LeRobot inference guides, synchronous and asynchronous rollout</Cite>
          </Box>
          <Box variant="p">
            The delay still has a cost, because every action the arm plays was chosen from camera images that are at
            least one call old. At an illustrative arm speed of 0.25 m/s, a delay of 149.0 ms means the arm moves{' '}
            <Derived>37</Derived> mm based on old information.{' '}
            <Cite id="F01-83" kind="derived">
              speed times delay
            </Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite> Section 3, The Robot as a
            Computer, covers this delay in detail. This is why the computer next to the arm is sized by latency, the
            time one call takes. The other jobs have no such deadline, so they are sized by throughput, the amount of
            work they finish in a given time. <Cite id="F08-79">how each property maps to a resource</Cite>
          </Box>
          <Box variant="p">
            The second job tests a new policy before it is allowed to drive the real motors. The policy controls a
            simulated arm that attempts the task 500 times, each time from a different random seed, and the job
            counts how many attempts succeed. One attempt at the task, real or simulated, is called an episode. The
            episodes do not exchange data and none of them has a deadline. So the job is 500 short, independent
            pieces of work that can run on any machine, in any order.
          </Box>
          <Box variant="p">
            On AWS, this fits an array job in AWS Batch, the AWS service for queuing and running batch jobs. You
            submit one array job, Batch creates 500 child jobs from it, and each child uses its index number as its
            random seed. <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite> Because each piece is short and
            independent, the job is a good fit for Spot Instances. AWS sends a warning two minutes before it takes a
            Spot Instance back, on a best-effort basis.{' '}
            <Cite id="F10-520">EC2 User Guide, Spot Instance interruption notices</Cite> If an instance is taken back,
            only the episodes running on it are lost, and a retry rule on the job puts them back at the front of the
            queue. <Cite id="F09-10">AWS Batch User Guide, automated job retries</Cite>
          </Box>
          <Box variant="p">
            So the two jobs need opposite things. The policy needs one dedicated machine next to the arm that is
            never interrupted. The evaluation can spread across many small machines and can afford to lose some of
            them.
          </Box>
          <Box variant="p">
            The purchase option depends on the same properties, and also on whether the job uses its machines
            steadily or in bursts. AWS sells EC2 capacity in four ways that matter here:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>On-Demand:</strong> you pay for the instance while it runs, with no commitment, and AWS does
              not take it back.
            </li>
            <li>
              <strong>Spot Instances:</strong> spare capacity that AWS can take back after a two-minute warning.{' '}
              <Cite id="F09-95">EC2 User Guide, Spot best practices</Cite>
            </li>
            <li>
              <strong>Capacity Blocks for ML:</strong> GPU instances reserved in advance for a fixed period, so a
              large run can start on a known date.{' '}
              <Cite id="F09-90">EC2 User Guide, Capacity Blocks for ML</Cite>
            </li>
            <li>
              <strong>Savings Plans:</strong> a lower price in exchange for committing to a steady amount of use.
              They lower the cost of capacity you run anyway, but they do not reserve it.{' '}
              <Cite id="F09-134">Savings Plans User Guide, What are Savings Plans?</Cite>
            </li>
          </ul>
          <Box variant="p">Each of the fifteen jobs falls into one of five workload types:</Box>
          <ul style={LIST}>
            <li>
              <strong>Independent tasks.</strong> The work splits into many short pieces that do not depend on each
              other, such as the 500 evaluation episodes or the decoding of each recorded episode. If a machine is
              lost, you lose only the piece it was running. Run these jobs in a queue that starts machines when work
              arrives and retries failed pieces, such as an AWS Batch array job, on Spot Instances.{' '}
              <Cite id="F08-78">the five workload types, defined by three properties</Cite>{' '}
              <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>
            </li>
            <li>
              <strong>Long single-machine runs.</strong> Fine-tuning the arm&apos;s policy keeps one machine busy for
              hours, and if the machine is lost, you lose the work done since the last checkpoint. A checkpoint is a
              copy of the model that the job saves to storage while it runs. Spot is an option only if the job saves
              checkpoints often: the AWS Batch guide advises splitting or checkpointing Spot work into parts of 30
              minutes or less. <Cite id="F08-79">how each property maps to a resource</Cite>{' '}
              <Cite id="F09-11">AWS Batch User Guide, Spot best practices</Cite>
            </li>
            <li>
              <strong>Multi-node training.</strong> Training the large pretrained models that the arm&apos;s policy
              starts from runs across many machines for days, and the machines exchange data at every training step.
              If one machine is lost, the current step is lost on all of them. These runs need a dedicated cluster on
              reserved capacity, such as Capacity Blocks. Spot is not an option: AWS Batch does not run multi-node
              jobs on Spot, and the EC2 guide lists work that is &quot;tightly coupled between instance nodes&quot; as
              not suitable for Spot. <Cite id="F08-78">the five workload types, defined by three properties</Cite>{' '}
              <Cite id="F09-112">AWS Machine Learning Blog, 4 September 2026</Cite>{' '}
              <Cite id="F09-90">EC2 User Guide, Capacity Blocks for ML</Cite>{' '}
              <Cite id="F09-8">AWS Batch User Guide, multi-node parallel jobs</Cite>{' '}
              <Cite id="F09-95">EC2 User Guide, Spot best practices</Cite>
            </li>
            <li>
              <strong>Always-on streams.</strong> Some work never ends, such as decoding video that arrives all day.
              This work does not go through a job queue; it runs on a group of CPU machines that stays up all the
              time, and a lost machine costs only the item it was processing. Because the use is steady, Savings
              Plans fit it.{' '}
              <Cite id="F09-134">Savings Plans User Guide, What are Savings Plans?</Cite> Decoding one arm&apos;s 50
              episodes takes a few minutes on a laptop, but a company that ingests video all day needs a permanent
              group of machines, with CPU cores as the bottleneck in both cases.{' '}
              <Cite id="F08-78">the five workload types, defined by three properties</Cite>{' '}
              <Cite id="F08-80">one workload, two workload types</Cite>
            </li>
            <li>
              <strong>Real-time on the robot.</strong> Recording the arm and running its policy happen on the
              computer next to the arm and cannot be interrupted, so no cloud scheduler is involved. On AWS, new
              versions of the model reach that computer through AWS IoT Greengrass, software that runs on the device
              and receives deployments from the cloud.{' '}
              <Cite id="F08-78">the five workload types, defined by three properties</Cite>{' '}
              <Cite id="F07-84">AWS IoT Greengrass documentation</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Follow one recorded episode through the eight stages, from recording to deployment, and see which resource is the bottleneck at each stage. You will also learn which five of the fifteen jobs have a bottleneck that is easy to miss when you choose an instance, such as the CPU cores that decode video for a training GPU."
          >
            How the bottleneck changes as an episode goes round the loop
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A recorded episode is a table of joint readings and motor commands over time, plus one video per camera.{' '}
            <Cite id="F01-26">LeRobot feature_utils.py</Cite> Each episode passes through eight stages: collect,
            process and curate, augment, simulate, train a policy, train a world model, evaluate, and export and
            deploy. After the last stage, the arm runs the new policy without a person, and its attempts are recorded
            as new episodes. So the stages form a loop that turns recorded episodes into a policy that does the task
            without help. Each stage contains one or more of the fifteen computing jobs, and each of these jobs is
            called a workload.
          </Box>
          <Box variant="p">
            Augmentation turns one recorded episode into many varied copies, so that training has more samples to
            learn from. A world model is a model that predicts what the scene will look like after the robot takes an
            action.
          </Box>
          <Box variant="p">
            The bottleneck changes at almost every stage. It moves from the CPU to the GPU and back, and between
            different units inside the GPU. A GPU contains several kinds of units, and each kind can become the
            bottleneck on its own. Most of a GPU is general compute, which is made of units that can run any
            arithmetic in parallel. Tensor cores are units that only do matrix arithmetic. Ray-tracing cores are
            separate units that trace light rays to draw an image. Video engines are fixed circuits that only compress
            and decompress video. A GPU can have one kind of unit and lack another. For example, a GPU bought for
            training may have no ray-tracing cores, and then it cannot render simulated camera images with a
            ray-tracing renderer. <Cite id="F08-50">the machine&apos;s resources and the counter that shows each</Cite>
          </Box>
          <AnimatedFigure
            name="one episode through the loop"
            steps={LOOP_STEPS}
            intervalMs={2600}
            cites="F08-50 F08-75 F08-76 F01-26"
            caption={
              <>
                As an episode goes round the loop, the bottleneck moves from CPU cores to four different GPU
                resources and back. The tags on each stage name the resources that its most common workloads run
                out of first or second.
              </>
            }
          >
            {(step, reduced) => <LoopRing step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            A single stage can contain several workloads, each with its own bottleneck. The simulate stage, for
            example, contains three workloads: the physics of one scene, the physics of thousands of scenes stepped
            together, and the simulated cameras. Each of the three runs out of a different resource first. When every
            stage is split this way, the eight stages contain twelve workloads. Three more workloads run only at the
            vendors that publish large models, which brings the total to the fifteen in the table below.{' '}
            <Cite id="F08-75">how the fifteen are chosen</Cite> <Cite id="F08-76">our workload table</Cite>{' '}
            <Cite id="F08-78">the five workload types, defined by three properties</Cite>
          </Box>
          <WorkloadTable />
          <Box variant="p">
            Five of the fifteen workloads have a bottleneck that is easy to miss when you choose an instance:
            recording, decoding, the dataloader, the simulated cameras and on-robot inference. The first three are
            all limited by CPU cores for the same reason: all three handle video. LeRobot writes that video in AV1
            (AOMedia Video 1) by default. AV1 is a video compression format, and LeRobot both writes and reads it
            with CPU code. The H100 is the GPU in EC2&apos;s P5 training instances, and it cannot decode AV1 in
            hardware.{' '}
            <Cite id="F08-77">the CPU cores next to the GPU</Cite>{' '}
            <Cite id="F05-47">NVIDIA video encode and decode support matrix, H100 rows</Cite>
          </Box>
          <Box variant="p">
            Because the H100 cannot decode AV1, the CPU cores of the training instance do the decoding. An instance
            comes with a fixed number of CPU cores for each GPU: on most eight-GPU sizes, that is 24 vCPUs per GPU,
            which is 12 physical cores. These cores are easy to overlook when you choose an instance for its GPUs,
            and they are the first thing to check when a training GPU sits idle.{' '}
            <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>
          </Box>
          <Box variant="p">
            Simulation may need a different type of GPU from training, because of the simulated cameras. Isaac Sim is
            NVIDIA&apos;s robot simulator. Its RTX renderer is a ray-tracing renderer, and it needs a GPU with RT
            cores. The A100 and the H100 do not have them. The requirements page of Isaac Sim 6.2.0 states:
            &quot;GPUs without RT Cores (A100, H100) are not supported.&quot; So a training cluster built on H100s
            cannot render those cameras with the RTX renderer. <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>
          </Box>
          <Box variant="p">
            On-robot inference can be limited by memory bandwidth, the same limit that the six-matrix test program
            ran into. The computer next to the arm has one memory that its CPU and its GPU share. So a policy that the
            GPU can compute fast enough can still be held back by how many GB/s that memory delivers.{' '}
            <Cite id="F08-76">our workload table</Cite>
          </Box>
          <Box variant="p">
            The owner of one arm never runs the two pretraining workloads or generative augmentation. These three
            arrive as finished models or as services from the vendors that publish large models, who run them at
            their own scale.{' '}
            <Cite id="F08-76">our workload table</Cite> <Cite id="F08-75">how the fifteen are chosen</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Check whether your model is fast enough for the arm, find out why a training GPU sits idle, and estimate the bottleneck of a job that is not one of the fifteen."
          >
            Applying the method to your own jobs
          </Header>
        }
      >
        <SpaceBetween size="s">
          <ul style={LIST}>
            <li>
              <strong>Will your trained model control the arm in time?</strong> To find out, time one call of the
              model on the robot&apos;s own computer, because a time measured on the training GPU tells you little.
              NVIDIA reports a median of 22.9 ms for one GR00T N1.7 call on an H100 and 149.0 ms on a Jetson Orin,
              both with TensorRT. Then compare the time of one call with how long the actions from one call last. In
              NVIDIA&apos;s benchmark, one call returns 40 actions. The arm plays one action every 33.3 ms, so the 40
              actions last 40 x 33.3 ms = <Derived>1.33</Derived> s. That is about <Derived>nine</Derived> times as
              long as one 149.0 ms call on the Jetson Orin. Section <span data-num="nav">17</span>, Running on the
              Robot, covers this timing in detail.{' '}
              <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite>{' '}
              <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>
            </li>
            <li>
              <strong>Why is your GPU idle during training?</strong> First check whether the CPU cores that decode
              the video are fully busy while the GPU waits. On most eight-GPU instances, each GPU has 12 physical
              cores to decode video for it. Section 10, Processing and Curating, works out how many CPU cores keep a
              training GPU busy.{' '}
              <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>
            </li>
            <li>
              <strong>Which GPU does simulation need?</strong> The physics of one scene needs no GPU, because it runs
              on one CPU core. If NVIDIA&apos;s RTX renderer draws the simulated cameras, you need a GPU with
              ray-tracing cores, so you cannot use the A100 or the H100. The Warp ray tracer is an alternative that
              runs on general GPU compute. Section 12, Physics Simulation, and section{' '}
              <span data-num="nav">13</span>, Rendering and Ray Tracing, cover both choices in detail.{' '}
              <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>
            </li>
            <li>
              <strong>How many evaluation episodes are enough?</strong> You need more than a few dozen for each
              policy. With 50 episodes for each policy, you cannot tell a policy with 40 successes from one with 45
              successes. To tell a true success rate of 80% from a true 90%, you need about 199 episodes per policy,
              according to the standard sample-size formula for comparing two proportions. That figure assumes 80%
              power and a 5% significance level. A power of 80% means four chances in five of detecting the
              difference. A 5% significance level means one chance in twenty of a false alarm. Section{' '}
              <span data-num="nav">16</span>, Evaluation, covers how many trials you need.{' '}
              <Cite id="F06-97">sample-size arithmetic with the formulas of LeRobot eval_stats.py</Cite>
            </li>
          </ul>
          <Box variant="p">
            For a job that is not one of the fifteen, estimate the bottleneck the same way. Write down how much data
            one unit of work reads or how much it computes, multiply that by the number of units per second, and
            compare the result with what the resource can deliver. For the six-matrix test program, two numbers were
            enough to predict its limit before it ran: 25.2 MB per pass and 11.71 GB/s from the core. The run then
            reached <Derived>84</Derived>% of that limit. Section <span data-num="nav">20</span>, The Fifteen
            Workloads, gives the bottleneck of each of the fifteen workloads and the figure that supports it. Section{' '}
            <span data-num="nav">21</span>,
            Reading a Machine, shows how to confirm a bottleneck with the processor&apos;s hardware counters.{' '}
            <Cite id="F08-63">the test program&apos;s weights against the core&apos;s memory limits</Cite>{' '}
            <Cite id="F08-66">our profiling report, memory streaming row</Cite>
          </Box>
          <Box variant="p">
            Once you know the bottleneck, choose the instance type with the best price-performance for that
            resource. After that, ask how much work is lost if the instance is lost, and whether the job uses its
            machines steadily or in bursts. The answers tell you which scheduler to use and which purchase option
            fits, for example whether the job can run on Spot Instances or needs an instance that stays up until it
            finishes. Sections{' '}
            <span data-num="nav">24 to 29</span>, starting with Orchestrating Physical AI on AWS, cover each
            scheduler in turn.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
