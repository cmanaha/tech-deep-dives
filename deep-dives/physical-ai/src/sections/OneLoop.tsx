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

/* The tags name the part that fills first in the workloads of each stage (register 08, the workload table). */
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
      { label: 'same parts as stage 4', part: 'neutral' },
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
  'A person steers the arm through the task once. That one recorded attempt is an episode, and the blue dot is that episode.',
  'The episode lands on disk as rows of joint readings and motor commands, plus one video per camera.',
  'Process and curate: the video is decoded back into frames and the bad episodes are dropped. CPU cores do the decoding, or the GPU video engines where the card decodes the format.',
  'Augment and simulate: the recording is multiplied into more training samples, and a virtual arm adds attempts whose camera views are drawn by tracing rays.',
  'Train: a policy learns from the episodes, and a world model learns to predict what happens next. Both are matrix arithmetic on the GPU tensor cores.',
  'Evaluate: each saved version of the policy runs many attempts in simulation, then on the arm, and the successes are counted.',
  'Export and deploy: the chosen policy is converted for the computer beside the arm and sent to it.',
  'The arm runs the policy. What it does is recorded as the next episodes, and the ring closes.',
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
        <title id="one-loop-ring-title">The physical AI loop: eight stages in a ring around one arm</title>
        <desc>
          Eight boxes form a ring around a small robot arm with a block and a cup. Clockwise from the top left:
          collect, process and curate, augment, simulate, train a policy, train a world model, evaluate, export and
          deploy. Each box carries one or two tags naming the machine part that stage fills first. A dot standing
          for one episode travels round the ring and returns to the arm.
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
            rows + video
          </text>
        </g>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* The fifteen workloads, grouped by shape                                  */
/* ------------------------------------------------------------------------ */

interface Workload {
  n: string;
  stage: string;
  name: string;
  does: string;
  part: string;
  /* True on the rows whose part is easiest to buy wrong. */
  decides?: boolean;
}

const GROUPS: { shape: string; forces: string; rows: Workload[] }[] = [
  {
    shape: 'Independent units',
    forces: 'A lost machine costs one unit. In the cloud: a queue that retries, with Spot open.',
    rows: [
      {
        n: '2',
        stage: 'Process and curate',
        name: 'Decode and filter',
        does: 'Turn the video back into frames and drop the bad episodes.',
        part: 'CPU cores, or the GPU video engines where the card decodes that format.',
        decides: true,
      },
      {
        n: '3',
        stage: 'Process and curate',
        name: 'Embed and deduplicate',
        does: 'A vision model turns each clip into a vector so that near-copies can be dropped.',
        part: 'GPU tensor cores. The models are small enough to share a card.',
      },
      {
        n: '5',
        stage: 'Simulate',
        name: 'CPU physics step',
        does: 'Advance one simulated copy of the arm, the block and the cup by one timestep.',
        part: 'One CPU core per scene: small sequential arithmetic with branches that depend on the data.',
      },
      {
        n: '6',
        stage: 'Simulate',
        name: 'GPU-parallel physics',
        does: 'Step thousands of simulated copies of the arm together.',
        part: 'GPU general compute, with one CPU core feeding it.',
      },
      {
        n: '7',
        stage: 'Simulate',
        name: 'Simulated cameras',
        does: 'Draw what each simulated camera sees, at every step.',
        part: 'GPU memory first, then the GPU ray-tracing cores when the image is drawn by tracing rays. Some training GPUs have none.',
        decides: true,
      },
      {
        n: '10',
        stage: 'Evaluate',
        name: 'Evaluation in simulation',
        does: 'Each saved version of the policy attempts the task many times on a simulated arm, and the successes are counted.',
        part: 'Whichever of its three ingredients fills first: physics, simulated cameras or policy inference.',
      },
      {
        n: '11',
        stage: 'Export and deploy',
        name: 'Compile for the robot',
        does: 'Convert the chosen policy into the form the computer beside the arm runs fastest, one build per kind of device.',
        part: "The GPU and CPU of the computer beside the arm, for minutes: the build runs on the device it is for, outside any queue.",
      },
      {
        n: '13',
        stage: 'Vendor scale',
        name: 'Generative augmentation',
        does: 'A large video model redraws recorded clips or invents new ones.',
        part: 'GPU memory, tens of GB of it, and tensor cores, for minutes per clip.',
      },
    ],
  },
  {
    shape: 'One long run',
    forces: 'One job on one machine. Spot is open as far as the checkpoint interval allows.',
    rows: [
      {
        n: '4',
        stage: 'Augment, and inside training',
        name: 'Dataloader decode and augment',
        does: 'For every training sample, pull a few frames out of the video and vary them (a crop, a colour shift).',
        part: 'CPU cores per GPU: the work runs in worker processes inside the training job, on cores the instance sells in a fixed ratio, 24 vCPUs per GPU on most eight-GPU sizes.',
        decides: true,
      },
      {
        n: '8',
        stage: 'Train a policy',
        name: 'Policy fine-tune',
        does: "Train the arm's policy on its episodes, from scratch or from a pretrained model.",
        part: 'GPU tensor cores, with GPU memory deciding which models fit on the card, unless the dataloader starves the trainer of samples.',
      },
      {
        n: '9',
        stage: 'Train a world model',
        name: 'World-model training',
        does: 'Teach a small model to predict what the scene becomes after an action.',
        part: 'GPU tensor cores, on a single GPU.',
      },
    ],
  },
  {
    shape: 'Nodes that talk',
    forces: 'A cluster on reserved capacity. Spot is closed.',
    rows: [
      {
        n: '14',
        stage: 'Vendor scale',
        name: 'Robot-model pretraining',
        does: 'Train the large robot model that a policy fine-tune starts from.',
        part: 'Tensor cores across many machines, with the network between them and the storage that feeds them.',
      },
      {
        n: '15',
        stage: 'Vendor scale',
        name: 'World-model pretraining',
        does: 'Train the large world model that world-model training and generative augmentation start from.',
        part: 'The same three parts as robot-model pretraining, across more machines.',
      },
    ],
  },
  {
    shape: "On the robot's clock",
    forces: 'The computer beside the arm, never interrupted. No cloud scheduler.',
    rows: [
      {
        n: '1',
        stage: 'Collect',
        name: 'Record and encode',
        does: 'While a person steers the arm, save its joint angles and compress the two camera streams into video.',
        part: 'CPU cores on the computer beside the robot: the default video encoder is software.',
        decides: true,
      },
      {
        n: '12',
        stage: 'Export and deploy',
        name: 'On-robot inference',
        does: 'Run the policy beside the arm, against the 33.3 ms period.',
        part: 'GPU tensor cores on a machine whose CPU and GPU share one memory, which makes memory bandwidth the part they share.',
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
            <th style={TH}>The part it exhausts first (bold: easiest to buy wrong)</th>
          </tr>
        </thead>
        {GROUPS.map((g) => (
          <tbody key={g.shape}>
            <tr>
              <th colSpan={4} scope="colgroup" style={{ ...GROUP_ROW, textAlign: 'left' }}>
                {g.shape}. <span style={{ fontWeight: 'normal' }}>{g.forces}</span>
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
            description="Place any job in a robot's learning loop with two questions: which part of the machine it exhausts first, and what work is lost if its machine is taken away (sources read 2026-11-20)."
          >
            1. One Arm, Fifteen Workloads: What Each One Runs On
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Fifteen computing jobs stand behind one small robot arm learning one task, and they share the arm and
            almost nothing else. The part of the machine a job exhausts first picks its instance. The work lost
            when its machine is taken away picks its scheduler and its market, which is the way the capacity is
            bought: on demand, reserved ahead, or as spare capacity that can be taken back. Both can be estimated
            before the job is run.
          </Box>
          <Box variant="p">
            The arm is an {ARM}, a desktop arm with six motors, a camera on its wrist and another overhead, and the
            task is to {TASK_STORY} with no person steering. Around it, one job compresses video on CPU cores, one
            traces rays on a GPU, one multiplies matrices for hours, and one has to answer inside a tick of the
            arm&apos;s clock. <Cite id="F01-8">LeRobot so_follower.py, lines 68-80</Cite>{' '}
            <Cite id="F01-30">LeRobot cameras.mdx and the record examples</Cite>
          </Box>
          <Box variant="p">
            The part a job exhausts first is its bottleneck: the resource that is full while the rest of the machine
            sits partly idle. A machine has several that run out separately, among them its CPU cores, its memory
            and each kind of unit inside a GPU. Size all fifteen as &quot;GPU training&quot; and the bottleneck is
            often a CPU core, on a machine bought for its GPU.{' '}
            <Cite id="F08-50">the machine parts and the counter that shows each</Cite>{' '}
            <Cite id="F08-77">the CPU beside the GPU</Cite>
          </Box>
          <Box variant="p">
            Finding the bottleneck is a count: what one unit of work needs from a part, times units per second,
            against what the part delivers. The arm is steered by a policy, the trained model that reads the cameras
            and the joint angles and decides what the motors do next. A program small enough to count by hand
            stands in for it: six 1024x1024 <code>float32</code> matrices of weights, each multiplying a vector in
            turn. A matrix times a vector uses every entry of the matrix once, so one pass reads all 25.2 MB of
            weights, and that is more than the processor&apos;s caches hold, so every pass fetches them from memory.{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-63">the stand-in&apos;s weights against the core&apos;s memory limits</Cite>
          </Box>
          <Box variant="p">
            The other number is what memory delivers. On one Cortex-A78AE core of an NVIDIA Jetson Orin Nano Super,
            a small computer of the kind that sits beside a robot, a loop that does nothing but sweep through
            arrays larger than the caches moved 11.71 GB/s. At that rate memory delivers the 25.2 MB of weights
            11.71 GB/s / 25.2 MB = <Derived>465</Derived> times a second. So before the program runs, the count
            puts its ceiling near <Derived>465</Derived> passes per second, however fast the core&apos;s arithmetic.{' '}
            <Cite id="F08-66">our profiling report, memory streaming row</Cite>{' '}
            <Cite id="F08-63">the stand-in&apos;s weights against the core&apos;s memory limits</Cite>
          </Box>
          <Box variant="p">
            We then ran it once, in NumPy, on that core. It made 390 passes per second, <Derived>84</Derived>% of
            that ceiling: 390 x 25.2 MB = 9.8 GB/s asked of memory. The count cannot say whether memory or
            arithmetic held the program there, and the core&apos;s counters can: 62.3% of its cycles were stalls on
            memory. The bottleneck is memory bandwidth, the rate at which memory delivers data. Those stalled
            cycles wait on memory whatever the speed of the arithmetic, so the figure to read on a machine for
            this job is its GB/s. <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-63">the stand-in&apos;s weights against the core&apos;s memory limits</Cite>{' '}
            <Cite id="F08-66">our profiling report, memory streaming row</Cite>
          </Box>
          <Box variant="p">
            The same three terms size the arm&apos;s own policy on its GPU: what one call reads and computes, calls
            per second, and what that machine delivers. The six-matrix program shows the method, and its figures
            are not that policy&apos;s.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Tell a job that needs a machine of its own from one that can run on capacity AWS may take back"
          >
            What a job loses with its machine picks the scheduler and the market
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Whether a job can run on capacity that may be taken back comes down to how long one unit of its work
            runs, whether its pieces exchange data while they run, and what it can resume from. Two jobs for the
            same arm sit at opposite ends.
          </Box>
          <Box variant="p">
            The policy on the arm has a deadline. By default the arm takes a new target 30 times a second, one every
            33.3 ms, and the clock does not slow for a late answer. NVIDIA reports a median of 149.0 ms for one
            call of GR00T N1.7, its robot model, on a Jetson Orin, one of its onboard computers for robots, with
            TensorRT, its inference compiler and the fastest runtime in its table for that device. That is 4.5
            periods.{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
          </Box>
          <Box variant="p">
            A call that long still drives the arm, because it returns a chunk: a run of future actions, 40 of them
            in that benchmark. The arm plays the chunk one action per period while the next call computes, provided
            the actions it holds outlast the call.{' '}
            <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite>{' '}
            <Cite id="F01-87">LeRobot inference guides, synchronous and asynchronous rollout</Cite>
          </Box>
          <Box variant="p">
            Lateness is still paid for, in distance, because every action the arm plays was decided from a view of
            the scene at least one call old. At an illustrative 0.25 m/s, 149.0 ms is <Derived>37</Derived> mm of
            travel (section 3, The Robot as a Computer).{' '}
            <Cite id="F01-83" kind="derived">
              speed times delay
            </Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite> So the computer beside the arm
            is sized by a deadline, in milliseconds per call. Every job off the robot&apos;s clock is measured in
            throughput.{' '}
            <Cite id="F08-79">how each property maps to a part</Cite>
          </Box>
          <Box variant="p">
            A second job for the same arm scores a new policy before it is trusted with the motors. The policy
            drives a simulated arm through the task 500 times, each attempt from its own random seed, and the
            successes are counted. One attempt at the task, recorded or simulated, is an episode. No episode needs
            data from another and none has a deadline, so the job is 500 short units that can run anywhere, in any
            order. On AWS that is one array job in AWS Batch, a single submission that spawns 500 children, each
            reading its index to pick its seed. <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>
          </Box>
          <Box variant="p">
            Such a job can be bought as Spot, the EC2 capacity that AWS may take back. AWS issues a notice two
            minutes before it does, and sends that notice on a best-effort basis.{' '}
            <Cite id="F10-520">EC2 User Guide, Spot Instance interruption notices</Cite> A machine taken back costs
            the episodes it was running, and a retry rule on the job sends those back to the front of the queue.{' '}
            <Cite id="F09-10">AWS Batch User Guide, automated job retries</Cite>
          </Box>
          <Box variant="p">
            One arm, two jobs: the first is sized by a deadline on a machine it never loses, the second wants many
            small machines it can afford to lose. Duration is how long one unit of
            work runs, coupling is whether the pieces must exchange data while they run, and interruptibility is
            whether the job can stop and resume having lost no more than one unit. Together they are a job&apos;s
            shape, and the shape settles the kind of scheduler and whether Spot is open.{' '}
            <Cite id="F08-78">the five shapes, defined by three properties</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Independent units.</strong> The 500 evaluation episodes, or the decoding of each recorded
              episode: short, separate, and a lost machine costs only the unit it was running. They go to a queue
              that fans out and retries, such as a Batch array job, and Spot is open to them.{' '}
              <Cite id="F08-78">the five shapes, defined by three properties</Cite>{' '}
              <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>
            </li>
            <li>
              <strong>One long run.</strong> Fine-tuning the arm&apos;s policy holds one machine for hours, and a
              stop costs the work since the last checkpoint, the copy of the model saved to storage during the
              run. It is a single job, and its checkpoint interval says whether Spot is open: the AWS Batch guide
              advises splitting or checkpointing Spot work into parts of 30 minutes or less.{' '}
              <Cite id="F08-79">how each property maps to a part</Cite>{' '}
              <Cite id="F09-11">AWS Batch User Guide, Spot best practices</Cite>
            </li>
            <li>
              <strong>Nodes that talk.</strong> Training the large models the arm&apos;s policy starts from spreads
              one run over many machines that exchange data at every step, for days, so losing one node loses the
              step on all of them. That calls for a standing cluster on reserved capacity, and Spot is closed:
              multi-node jobs in AWS Batch do not run on Spot, and the EC2 guide lists work &quot;tightly coupled
              between instance nodes&quot; among what Spot is not suitable for.{' '}
              <Cite id="F08-78">the five shapes, defined by three properties</Cite>{' '}
              <Cite id="F09-112">AWS Machine Learning Blog, 4 September 2026</Cite>{' '}
              <Cite id="F09-8">AWS Batch User Guide, multi-node parallel jobs</Cite>{' '}
              <Cite id="F09-95">EC2 User Guide, Spot best practices</Cite>
            </li>
            <li>
              <strong>Always on.</strong> A stream with no end, handled item by item: video that arrives all day
              is decoded as it comes, on a tier of machines that is kept running where the other shapes queue
              jobs, and a taken machine costs one item. Scale alone moves a job here. Decoding one arm&apos;s 50
              episodes is a few minutes on a laptop. The same code at a company that ingests video all day is a
              standing tier, and the bottleneck is CPU cores at both sizes.{' '}
              <Cite id="F08-78">the five shapes, defined by three properties</Cite>{' '}
              <Cite id="F08-80">one workload, two shapes</Cite>
            </li>
            <li>
              <strong>On the robot&apos;s clock.</strong> Recording the arm and running its policy happen on the
              computer beside it and cannot be interrupted at all. No cloud scheduler places them: the cloud&apos;s
              share is delivering the model, the job of AWS IoT Greengrass, software on the device that receives
              deployments from the cloud.{' '}
              <Cite id="F08-78">the five shapes, defined by three properties</Cite>{' '}
              <Cite id="F07-84">AWS IoT Greengrass documentation</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find the five workloads whose bottleneck is easiest to buy wrong, starting with the CPU cores beside a training GPU"
          >
            Where the bottleneck moves as an episode goes round the loop
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A recorded episode is a table of joint readings and motor commands over time, plus one video per
            camera. <Cite id="F01-26">LeRobot feature_utils.py</Cite> On its way to becoming a policy that repeats
            the task unaided, the bottleneck changes at nearly every hand-off: from CPU to GPU and back, and
            between units inside the GPU. Two of the stages need a word. Augmentation multiplies an episode into
            variants, and a world model is a model that predicts what the scene becomes after an action.
          </Box>
          <Box variant="p">
            A GPU supplies several parts. Most of it is general compute, units that run any arithmetic in parallel.
            Its tensor cores are units for matrix arithmetic alone, its ray-tracing cores are separate units that
            follow light rays to draw an image, and its video engines are fixed circuits that only compress and
            decompress video. A card can have one and lack another, which is how a GPU bought for training can be
            unable to draw a simulated camera.{' '}
            <Cite id="F08-50">the machine parts and the counter that shows each</Cite>
          </Box>
          <AnimatedFigure
            name="one episode through the loop"
            steps={LOOP_STEPS}
            intervalMs={2600}
            cites="F08-50 F08-75 F08-76 F01-26"
            caption={
              <>
                Within one loop the bottleneck moves from CPU cores to four different GPU units and back. Each
                stage is tagged with the parts its commonest workloads exhaust first or next (in our reading).
              </>
            }
          >
            {(step, reduced) => <LoopRing step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            A stage can hide more than one bottleneck. Simulation is one stage and three workloads, because one
            scene&apos;s physics, thousands of scenes stepped together and the simulated cameras exhaust three
            different parts. Split every stage that way and the eight stages become the fifteen workloads of the
            table, grouped by shape and labelled with their stage. <Cite id="F08-75">how the fifteen are chosen</Cite>{' '}
            <Cite id="F08-76">our workload table</Cite>{' '}
            <Cite id="F08-78">the five shapes, defined by three properties</Cite>
          </Box>
          <WorkloadTable />
          <Box variant="p">
            Five of the fifteen are the easiest to buy wrong, and they are in bold: recording, decoding, the
            dataloader, the simulated cameras and on-robot inference. The first three all land on CPU cores, for
            one reason. All three handle video, and the video is in AV1 (AOMedia Video 1), the compression format
            that LeRobot, the open-source library this arm is recorded and trained with, writes by default. CPU
            code writes it and CPU code reads it back, and the H100, the GPU of EC2&apos;s P5 training instances,
            cannot hardware-decode it. <Cite id="F08-77">the CPU beside the GPU</Cite>{' '}
            <Cite id="F05-47">NVIDIA video encode and decode support matrix, H100 rows</Cite>
          </Box>
          <Box variant="p">
            So the cores beside the GPU do the decoding, and an instance sells those cores in a fixed ratio to its
            GPUs: 24 vCPUs per GPU, which is 12 physical cores, on most eight-GPU sizes. Those cores are the part
            bought by accident, and the first thing to check on a training run whose GPU sits idle.{' '}
            <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>
          </Box>
          <Box variant="p">
            The simulated cameras can send the simulator to a different GPU from the trainer. Cameras drawn by an RTX renderer,
            NVIDIA&apos;s ray-tracing renderer, need a GPU that has RT (ray-tracing) cores, and the A100 and the
            H100 lack them: the requirements page of Isaac Sim 6.2.0, NVIDIA&apos;s robot simulator, says
            &quot;GPUs without RT Cores (A100, H100) are not supported.&quot; A trainer built on H100s cannot draw
            those cameras. <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>
          </Box>
          <Box variant="p">
            On-robot inference can be limited by the same memory the six-matrix program ran into: the computer
            beside the arm gives its CPU and its GPU one shared memory, so a policy that fits the GPU&apos;s
            arithmetic can still be held to the GB/s that memory delivers. The two pretraining workloads and
            generative augmentation are the ones the owner of one arm never runs:
            they arrive as finished models, trained at the scale of the vendors that publish them.{' '}
            <Cite id="F08-76">our workload table</Cite>{' '}
            <Cite id="F08-75">how the fifteen are chosen</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know whether your model is fast enough for the arm, why your GPU is idle, and what to count for a job that is none of the fifteen"
          >
            Placing a job of your own
          </Header>
        }
      >
        <SpaceBetween size="s">
          <ul style={LIST}>
            <li>
              <strong>Will the model I trained drive the arm in time?</strong> Time one call on the robot&apos;s own
              computer, because the training GPU&apos;s figure says little: NVIDIA&apos;s GR00T N1.7 call is a median
              22.9 ms on an H100 and 149.0 ms on a Jetson Orin, both with TensorRT. Then set that time against the
              motion one call returns: 40 actions played one per 33.3 ms tick last 40 x 33.3 ms ={' '}
              <Derived>1.33</Derived> s, about <Derived>nine</Derived> times the 149.0 ms call (section{' '}
              <span data-num="nav">17</span>, Running on the Robot).{' '}
              <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite>{' '}
              <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>
            </li>
            <li>
              <strong>Why is my GPU idle during training?</strong> Check first whether the cores that decode the
              video are full before the GPU is: on most eight-GPU instances each GPU has 12 physical cores to
              decode for it (section 10, Processing and Curating).{' '}
              <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>
            </li>
            <li>
              <strong>Which GPU does simulation need?</strong> None for one scene&apos;s physics, which runs on a
              CPU core, and one with ray-tracing cores once the cameras are ray traced, which rules out the A100
              and the H100 (section 12, Physics Simulation, and section <span data-num="nav">13</span>, Rendering
              and Ray Tracing). <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>
            </li>
            <li>
              <strong>How many evaluation episodes are enough?</strong> More than a few dozen. 40 successes in 50
              and 45 in 50 cannot be told apart, and the standard sample-size approximation for comparing two
              proportions asks for about 199 trials per policy to tell a true 80% from a true 90%, at 80% power
              (four chances in five of detecting the gap) and the 5% level (one chance in twenty of a false alarm;
              section <span data-num="nav">16</span>, Evaluation).{' '}
              <Cite id="F06-97">our arithmetic, with the formulas of LeRobot eval_stats.py</Cite>
            </li>
          </ul>
          <Box variant="p">
            For a job that is none of the fifteen, make the count. Write down what one unit of work reads or
            computes, multiply by units per second, and set the result against what the part supplies. Two numbers,
            25.2 MB per pass and 11.71 GB/s from the core, gave the six-matrix program its ceiling before it ran,
            and the run reached <Derived>84</Derived>% of it (section <span data-num="nav">20</span>, Fifteen
            Workloads, Five Shapes, names the part for every row with the figure behind it, and section{' '}
            <span data-num="nav">21</span>, Reading a Machine, shows how to confirm a part on the processor&apos;s
            counters). <Cite id="F08-63">the stand-in&apos;s weights against the core&apos;s memory limits</Cite>{' '}
            <Cite id="F08-66">our profiling report, memory streaming row</Cite>
          </Box>
          <Box variant="p">
            Choose the instance for that part. Then ask what work is lost if the machine is taken away (sections{' '}
            <span data-num="nav">24 to 29</span>, starting at Orchestrating Physical AI on AWS, take each scheduler
            in turn). The answer picks the scheduler, and says whether the job can be bought as Spot or needs a
            machine it keeps.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
