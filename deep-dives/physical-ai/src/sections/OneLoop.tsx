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
/* The fifteen workloads: what each does, the part it fills, its shape      */
/* ------------------------------------------------------------------------ */

const FAN_OUT = 'Fan-out';
const ONE_NODE = 'One node for hours';
const ON_CLOCK = "On the arm's clock";

const WORKLOADS: { n: string; name: string; does: string; part: string; shape: string }[] = [
  {
    n: '1',
    name: 'Record and encode',
    does: 'While a person steers the arm, save its joint angles and compress the two camera streams into video.',
    part: 'CPU cores on the computer beside the robot: the default video encoder is software.',
    shape: ON_CLOCK,
  },
  {
    n: '2',
    name: 'Decode and filter',
    does: 'Turn the video back into frames and drop the bad episodes.',
    part: 'CPU cores, or the GPU video engines where the card decodes that format.',
    shape: FAN_OUT,
  },
  {
    n: '3',
    name: 'Embed and deduplicate',
    does: 'A vision model turns each clip into a vector so that near-copies can be dropped.',
    part: 'GPU tensor cores. The models are small enough to share a card.',
    shape: FAN_OUT,
  },
  {
    n: '4',
    name: 'Dataloader decode and augment',
    does: 'For every training sample, pull a few frames out of the video and vary them (a crop, a colour shift).',
    part: 'CPU cores per GPU: the work runs in the worker processes that feed the trainer.',
    shape: 'Inside the training job it feeds; always on when run as a tier of its own',
  },
  {
    n: '5',
    name: 'CPU physics step',
    does: 'Advance one simulated copy of the arm, the block and the cup by one timestep.',
    part: 'One CPU core per scene: small sequential arithmetic with branches that depend on the data.',
    shape: FAN_OUT,
  },
  {
    n: '6',
    name: 'GPU-parallel physics',
    does: 'Step thousands of simulated copies of the arm together.',
    part: 'The general arithmetic units of a GPU, with one CPU core feeding it.',
    shape: FAN_OUT,
  },
  {
    n: '7',
    name: 'Simulated cameras',
    does: 'Draw what each simulated camera sees, at every step.',
    part: 'GPU memory first, then the ray-tracing cores when an RTX renderer draws them.',
    shape: FAN_OUT,
  },
  {
    n: '8',
    name: 'Policy fine-tune',
    does: "Train the arm's policy on its episodes, from scratch or from a pretrained model.",
    part: 'GPU tensor cores, with GPU memory deciding which models fit on the card, unless workload 4 starves the trainer of samples.',
    shape: ONE_NODE,
  },
  {
    n: '9',
    name: 'World-model training',
    does: 'Teach a small model to predict what the scene becomes after an action.',
    part: 'GPU tensor cores, lightly: one GPU for a few hours.',
    shape: ONE_NODE,
  },
  {
    n: '10',
    name: 'Closed-loop evaluation',
    does: 'Each saved version of the policy attempts the task many times in simulation, and the successes are counted.',
    part: 'A mix inside every episode: physics, simulated cameras and policy inference.',
    shape: FAN_OUT,
  },
  {
    n: '11',
    name: 'Engine build',
    does: 'Compile the chosen policy for the chip of the computer beside the arm.',
    part: "That computer's own GPU and CPU, for minutes.",
    shape: FAN_OUT,
  },
  {
    n: '12',
    name: 'On-robot inference',
    does: 'Run the policy beside the arm, inside the 33.3 ms period.',
    part: 'GPU tensor cores on a machine whose CPU and GPU share one memory, which makes memory bandwidth the part they share.',
    shape: ON_CLOCK,
  },
  {
    n: '13',
    name: 'Generative augmentation',
    does: 'A large video model redraws recorded clips or invents new ones.',
    part: 'GPU memory, tens of GB of it, and tensor cores, for minutes per clip.',
    shape: FAN_OUT,
  },
  {
    n: '14, 15',
    name: 'Pretraining a robot model; pretraining a world model',
    does: 'Train the large models that the two training workloads and generative augmentation start from.',
    part: 'Tensor cores across many machines, the network between them and the storage that feeds them.',
    shape: 'Many nodes as one',
  },
];

function WorkloadTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640 }}>
        <thead>
          <tr>
            <th style={TH}>Workload</th>
            <th style={TH}>What it does for the arm</th>
            <th style={TH}>The part it fills first</th>
            <th style={TH}>Its shape</th>
          </tr>
        </thead>
        <tbody>
          {WORKLOADS.map((w) => (
            <tr key={w.n}>
              <td style={TD}>
                <strong>
                  <span data-num="nav">{w.n}</span>. {w.name}
                </strong>
              </td>
              <td style={TD}>{w.does}</td>
              <td style={TD}>{w.part}</td>
              <td style={TD}>{w.shape}</td>
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

export function OneLoop() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Ask two questions of any job in a robot's learning loop, which part of the machine it fills first and what it loses when its machine is taken away, and read off the kind of instance, the scheduler and the way to buy the capacity (sources read 2026-11-20)."
          >
            1. One Arm, Fifteen Workloads: What Each One Runs On
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Teaching one small robot arm one task takes about fifteen computing jobs, and they share the arm and
            almost nothing else. The arm is an {ARM}, a desktop arm with six motors, a camera on its wrist and
            another overhead, and the task is to {TASK_STORY} with no person steering. Around it, one job compresses
            video on CPU cores, one traces rays on a GPU, one multiplies matrices for hours, and one has to answer
            inside a tick of the arm&apos;s clock. A computer is several parts that run out separately (its CPU
            cores, its memory, the different units inside a GPU), and a job runs as fast as the first part to run
            out. That part is full, and the rest of the machine sits partly idle behind it. Size the loop as
            &quot;GPU training&quot; and the part that fills first is often a CPU core, on a machine bought for its
            GPU. Two questions place each job before it is benchmarked. Which part does it fill first? That picks
            the instance. What is its shape: how long one unit of work runs, whether its pieces must exchange data
            while they run, and what it loses when its machine is taken away? That picks the scheduler and the way
            the capacity is bought.{' '}
            <Cite id="F01-8">LeRobot so_follower.py, lines 68-80</Cite>{' '}
            <Cite id="F01-30">LeRobot cameras.mdx and the record examples</Cite>{' '}
            <Cite id="F08-50">the machine parts and the counter that shows each</Cite>{' '}
            <Cite id="F08-77">the CPU beside the GPU</Cite>
          </Box>
          <Box variant="p">
            The first question is answered by counting: what one unit of work needs from a part, times units per
            second, against what the part delivers. The arm is steered by a policy, the trained model that reads the
            cameras and the joint angles and decides what the motors do next, and one decision reads every weight of
            the model once. A program small enough to count by hand shows the method. It is six 1024x1024{' '}
            <code>float32</code> matrices multiplied in turn, 25.2 MB of weights, more than the processor&apos;s
            caches hold; it stands in for a policy, and the arm&apos;s own runs on a GPU. We ran it once, in NumPy,
            on one Cortex-A78AE core of an NVIDIA Jetson Orin Nano Super, a small computer of the kind that sits
            beside a robot. It made 390 passes per second, so it asked memory for 390 x 25.2 MB = 9.8 GB/s. On the
            same core, loops that do nothing but move arrays larger than the caches reached 9.25 GB/s reading and
            11.71 GB/s in a STREAM-style streaming test, and those two figures are that core&apos;s measured memory
            limits. The program&apos;s demand sits between them, at 9.8 / 11.71 = <Derived>84</Derived>% of the higher one
            while also doing its arithmetic, and the core&apos;s counters put 62.3% of its cycles in stalls on
            memory. That is what a full part looks like: demand at the measured limit, and the processor waiting on
            the part for most of its cycles. The part is memory bandwidth, the rate at which memory delivers data.
            Faster arithmetic would leave the 62.3% of cycles that wait on memory where they are (our reading), so
            the figure to read on a machine for this job is GB/s.{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-63">the stand-in&apos;s weights against the core&apos;s memory limits</Cite>{' '}
            <Cite id="F08-66">our profiling report, memory streaming row</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Tell from three properties of a job whether it can run on capacity that may be taken back, and what a lost machine costs it"
          >
            A deadline on one job, 500 independent episodes in another
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            The policy on the arm also has a deadline. The arm takes a new target 30 times a second, one every 33.3
            ms, and it does not wait for a slow answer. NVIDIA reports a median of 149.0 ms for one call of its
            GR00T N1.7 policy on a Jetson Orin with TensorRT, the fastest runtime in its table for that device, which
            is 4.5 of those periods.{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite> So this job is measured in
            milliseconds per call where every other job in the loop is measured in throughput, and the computer
            beside the arm is sized for the deadline. <Cite id="F08-79">how each property maps to a part</Cite>
          </Box>
          <Box variant="p">
            A second job for the same arm scores a new policy before it is trusted with the motors. The policy
            drives a simulated arm through the task 500 times, each attempt from its own random seed, and the
            successes are counted. One attempt at the task, recorded or simulated, is an episode. No episode needs
            data from another and none has a deadline, so the job is 500 short units that can run anywhere, in any
            order. On AWS that is one array job in AWS Batch, a single submission that spawns 500 children, each
            reading its index to pick its seed. <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite> Such a job
            can run on Spot, which is EC2 capacity that AWS may take back. AWS issues a notice two minutes before it
            does, and sends that notice on a best-effort basis.{' '}
            <Cite id="F10-520">EC2 User Guide, Spot Instance interruption notices</Cite> A machine taken back costs
            the episodes it was running, and a retry rule on the job sends those back to the front of the queue.{' '}
            <Cite id="F09-10">AWS Batch User Guide, automated job retries</Cite>
          </Box>
          <Box variant="p">
            One arm, two jobs: the first wants memory bandwidth on a machine it never loses, the second wants many
            small machines it can afford to lose. Three properties separated them, and together they are a
            job&apos;s shape. Duration is how long one unit of work runs. Coupling is whether the pieces must
            exchange data while they run. Interruptibility is whether the job can lose its machine and resume
            having lost no more than one unit.{' '}
            <Cite id="F08-78">the five shapes, defined by three properties</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find the part each job fills first and what a lost machine costs it, and see where an instance bought for training is the wrong purchase"
          >
            The loop, workload by workload
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A recorded episode is a table of joint readings and motor commands over time, plus one video per
            camera. <Cite id="F01-26">LeRobot feature_utils.py</Cite> Before the arm can repeat the task unaided,
            the episode is recorded, cleaned, multiplied into more samples, joined by simulated attempts and used
            to train a policy; the policy is scored and sent to the arm, and what the arm does next is recorded as
            new episodes. The full part changes at nearly every hand-off, and a GPU supplies several of the parts.
            Its tensor cores are the units for matrix arithmetic, its ray-tracing cores are separate units that
            follow light rays to draw an image, and its video engines are fixed circuits that only compress and
            decompress video. A card can have one and lack another.{' '}
            <Cite id="F08-50">the machine parts and the counter that shows each</Cite>
          </Box>
          <AnimatedFigure
            name="one episode through the loop"
            steps={LOOP_STEPS}
            intervalMs={2600}
            cites="F08-50 F08-75 F08-76 F01-26"
            caption={
              <>
                Read clockwise from stage 1; the blue dot is one episode. Each tag is the part that fills first in
                that stage&apos;s commonest workloads. Illustrative, not measured.
              </>
            }
          >
            {(step, reduced) => <LoopRing step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            A stage of the loop is a step in the arm&apos;s story. A workload is narrower: a job with one part that
            fills first. Simulation is one stage and three workloads, because one scene&apos;s physics, thousands of
            scenes stepped together and the simulated cameras fill three different parts. Split every stage that
            way and the loop is the fifteen rows of the table.
          </Box>
          <WorkloadTable />
          <Box variant="p">
            The shape column says what a lost machine costs. A fan-out job is short independent units and loses the
            unit that was running. One node for hours loses the work since the last checkpoint, the copy of the
            model saved to storage during the run. Many nodes as one exchange gradients at every step for days, and
            losing one node loses the step on all of them. An always-on tier handles a steady stream and loses one
            item. A job on the arm&apos;s clock has a deadline on every unit and cannot be interrupted at all.
            Workloads 1 to 12 are the ones the owner of one arm can run, on a desk machine or a single EC2 instance;
            the last three reach that owner as finished models and are run at the scale of the vendors that publish
            them. The split into fifteen and the sorting by shape are ours, and section{' '}
            <span data-num="nav">20</span>, Fifteen Workloads, Five Shapes, argues both row by row. <Cite id="F08-75">how the fifteen are chosen</Cite>{' '}
            <Cite id="F08-76">our workload table</Cite>{' '}
            <Cite id="F08-78">the five shapes, defined by three properties</Cite>
          </Box>
          <Box variant="p">
            Three rows have one cause. Workloads 1, 2 and 4 all handle video, and the video is in AV1 (AOMedia Video
            1, the compression format that LeRobot, the open-source library this arm is recorded and trained with,
            writes by default). CPU code writes it and CPU code reads it back, and the H100, the GPU of EC2&apos;s
            P5 training instances, cannot hardware-decode it. So the cores beside the GPU do the decoding, and an
            instance sells those cores in a fixed ratio to its GPUs: 24 vCPUs per GPU, which is 12 physical cores,
            on most eight-GPU sizes. Those cores are the part bought by accident, and the first thing to check on a
            training run whose GPU sits idle. <Cite id="F08-77">the CPU beside the GPU</Cite>{' '}
            <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>{' '}
            <Cite id="F05-47">NVIDIA video encode and decode support matrix, H100 rows</Cite>
          </Box>
          <Box variant="p">
            Workload 7 can send the simulator to a different GPU from the trainer. Cameras drawn by an RTX renderer,
            NVIDIA&apos;s ray-tracing renderer, need a GPU that has RT (ray-tracing) cores, and the A100 and the
            H100 lack them: the requirements page of Isaac Sim 6.2.0, NVIDIA&apos;s robot simulator, says
            &quot;GPUs without RT Cores (A100, H100) are not supported.&quot; A trainer built on H100s cannot draw
            those cameras. <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>
          </Box>
          <Box variant="p">
            Shape decides the market as much as the scheduler. What a job loses when it stops is what
            it has not yet written to storage, so the checkpoint interval of a training run is the setting that
            says whether it can run on Spot: the AWS Batch guide advises splitting or checkpointing Spot work into
            parts of 30 minutes or less. <Cite id="F08-79">how each property maps to a part</Cite>{' '}
            <Cite id="F09-11">AWS Batch User Guide, Spot best practices</Cite> And part and shape are separate
            axes. Decoding one arm&apos;s 50 episodes is a few minutes on a laptop; the same code at a company that
            ingests video all day is a standing tier of CPU machines. The full part is CPU cores in both, and only
            the way the capacity is bought has changed. <Cite id="F08-80">one workload, two shapes</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Start from demand against supply and from what a lost machine costs, then check the answer on the machine">
            Placing a job of your own
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">The questions that come first when this work is sized each turn on a row of the table.</Box>
          <ul style={LIST}>
            <li>
              <strong>Can the model I trained drive the arm in time?</strong> A call several periods long can,
              because each call returns many actions and the arm plays them while the next call computes:
              NVIDIA&apos;s benchmarked call returns 40 (section <span data-num="nav">17</span>, Running on the
              Robot). <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite>
            </li>
            <li>
              <strong>Why is my GPU idle during training?</strong> The cores that decode the video are full before
              the GPU is (section 10, Processing and Curating).
            </li>
            <li>
              <strong>Which GPU does simulation need?</strong> None for one scene&apos;s physics, which belongs on a
              CPU core, and one with ray-tracing cores once an RTX renderer draws the cameras (section 12, Physics
              Simulation, and section <span data-num="nav">13</span>, Rendering and Ray Tracing).
            </li>
            <li>
              <strong>How many evaluation episodes are enough?</strong> More than a few dozen: 40 successes in 50
              and 45 in 50 cannot be told apart, and telling a true 80% from 90% takes about 199 trials per policy
              (section <span data-num="nav">16</span>, Evaluation).{' '}
              <Cite id="F06-97">our arithmetic, with the formulas of LeRobot eval_stats.py</Cite>
            </li>
            <li>
              <strong>Which AWS scheduler, and which way of buying capacity?</strong> The shape decides.
              Independent units go to a queue on Spot, as the evaluation episodes did, and work whose machines exchange
              data while they run does not: the EC2 guide lists workloads &quot;tightly coupled between instance
              nodes&quot; among those Spot is not suitable for (sections{' '}
              <span data-num="nav">24 to 29</span>, starting at Orchestrating Physical AI on AWS).{' '}
              <Cite id="F09-95">EC2 User Guide, Spot best practices</Cite>
            </li>
          </ul>
          <Box variant="p">
            For a job that is not in the table, count as the stand-in was counted. Write down what one unit of work
            reads or computes, multiply by units per second, and compare with what the part supplies: 9.8 GB/s asked
            of a core that streamed 11.71 GB/s, in our run on the Jetson core, is a full part. Then ask how long one unit runs, whether its pieces
            exchange data, and what a lost machine would cost. Section <span data-num="nav">20</span>, Fifteen
            Workloads, Five Shapes, does the count for every row, and section <span data-num="nav">21</span>,
            Reading a Machine, confirms it on the processor&apos;s counters.{' '}
            <Cite id="F08-63">the stand-in&apos;s weights against the core&apos;s memory limits</Cite>{' '}
            <Cite id="F08-66">our profiling report, memory streaming row</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
