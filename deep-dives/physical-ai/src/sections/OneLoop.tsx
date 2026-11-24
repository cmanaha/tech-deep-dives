import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import { Cite } from '../components/Cite';
import { AnimatedFigure } from '../components/Figure';
import { sections } from '../lib/sections';
import { ARM, TASK_STORY } from '../lib/task';

/** The thread task, stated once for this section. */
const TASK_SENTENCE = `The ${ARM} must ${TASK_STORY}, without a person steering it.`;

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
  'Process and curate: the video is decoded back into frames and the bad episodes are dropped. CPU cores do the decoding, or the GPU video engines where the card handles the format.',
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
/* The nine questions                                                       */
/* ------------------------------------------------------------------------ */

const QUESTIONS: { q: string; read: number[] }[] = [
  {
    q: 'What is a robot, seen as a computer: what goes in, what comes out, how fast, and why a delay turns into a distance?',
    read: [3],
  },
  {
    q: 'How does a policy learn from recorded demonstrations, and what changes when the model also reads a written instruction (a vision-language-action model)?',
    read: [4, 5],
  },
  {
    q: 'What is a world model for, what separates generating pixels from predicting a compact learned summary of the scene (a latent), and how does JEPA (Joint-Embedding Predictive Architecture), the design built on that second idea, work?',
    read: [6, 7],
  },
  {
    q: 'Where does reinforcement learning, which is training by trial and reward, fit for robots, and what happens when a software agent runs the loop?',
    read: [8, 19],
  },
  {
    q: 'What happens to the data between the robot and the trainer, and why can decoding video set the speed of training?',
    read: [9, 10, 11],
  },
  {
    q: 'What does simulation cost, why do ray-tracing cores decide the GPU, and how far can a simulator be trusted once the policy moves to the real arm (sim-to-real)?',
    read: [12, 13, 14, 16],
  },
  {
    q: 'What runs on the robot, how long it has to answer, and how do many robots (a fleet) send their episodes back?',
    read: [17, 18],
  },
  {
    q: 'Which part of the machine does each workload fill first, and how do we know? The evidence is the event counters built into the processor, its PMU (performance monitoring unit).',
    read: [20, 21, 22, 23],
  },
  {
    q: 'Which AWS scheduler and which way of buying capacity fit each workload?',
    read: [24, 25],
  },
];

function QuestionTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={TH}>Your question</th>
            <th style={{ ...TH, width: '42%' }}>Sections that answer it</th>
          </tr>
        </thead>
        <tbody>
          {QUESTIONS.map((row) => (
            <tr key={row.read.join('-')}>
              <td style={TD}>{row.q}</td>
              <td style={TD}>
                {row.read.map((n) => (
                  <div key={n}>{sections[n - 1].title}</div>
                ))}
              </td>
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
            description="See the whole loop on one arm before any part is explained, and find the section that answers your question (sources read 2026-11-20)."
          >
            1. One Arm, Fifteen Workloads: What Each One Runs On
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Physical AI is the work of getting a model to act in the world: it reads cameras and joint sensors, and it
            decides what the motors do next. This dive follows one small case of it all the way round, on one arm and
            one task. The task is the same on every page, so each new idea lands on something you have already seen.
          </Box>
          <Box variant="p">
            The work is a loop, and the loop is about fifteen workloads that share a robot and little else. This page
            shows the loop once, end to end. Every later section opens one stage of it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2" description="What is on the table, so every later example has a place to happen">The bench</Header>}>
        <SpaceBetween size="s">
          <Box variant="p">
            On the bench sit an {ARM} follower arm, a block, a cup, two cameras and a laptop. The follower is the arm
            that does the work. To teach it, a person holds a second, matching arm called the leader and moves it by
            hand, and the follower copies the motion. <Cite id="F01-2">SO-ARM100 README, Sourcing Parts</Cite>
          </Box>
          <Box variant="p">
            The follower has six motors: five position the arm and the sixth opens and closes the gripper.{' '}
            <Cite id="F01-8">LeRobot so_follower.py, lines 68-80</Cite> One camera rides on the wrist and one looks
            down from above. <Cite id="F01-30">LeRobot cameras.mdx and the record examples</Cite> The laptop reads
            the joints and the cameras and sends the motors their targets.
          </Box>
          <Box variant="p">
            <strong>The task.</strong> {TASK_SENTENCE} A person does it without thinking. Getting the arm to do it
            takes every stage of the loop below.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2" description="Follow one episode around the ring and see what each stage does to it">The loop in one pass</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The loop has eight stages. Each takes what the stage before it produced, and the last one hands a working
            model back to the arm, which then produces new data for the first.
          </Box>
          <ol style={LIST}>
            <li>
              <strong>Collect.</strong> A person steers the arm through the task, and each attempt is recorded as an
              episode: a table of joint readings and motor commands over time, plus video from each camera.{' '}
              <Cite id="F01-26">LeRobot feature_utils.py</Cite>
            </li>
            <li>
              <strong>Process and curate.</strong> The video is decoded back into frames, bad episodes are dropped
              and near-duplicates are removed.
            </li>
            <li>
              <strong>Augment.</strong> More training samples are made from the ones recorded, from simple image
              changes to whole generated video clips.
            </li>
            <li>
              <strong>Simulate.</strong> A simulation is a program that steps a virtual copy of the arm, the block
              and the cup through physics and draws what virtual cameras would see. It supplies attempts no person
              had to perform.
            </li>
            <li>
              <strong>Train a policy.</strong> The policy is the model that maps what the robot senses to what it
              does next. It learns from the episodes.
            </li>
            <li>
              <strong>Train a world model.</strong> A world model predicts what happens next, given what the robot
              sees and an action it might take.
            </li>
            <li>
              <strong>Evaluate.</strong> Each saved version of the policy runs many attempts, and the successes are
              counted.
            </li>
            <li>
              <strong>Export and deploy.</strong> The chosen policy is converted into a form the computer beside the
              arm can run, and sent there.
            </li>
          </ol>
          <Box variant="p">
            In the figure, each stage carries one or two coloured tags. A tag names the part of the machine that
            stage fills first, the part that sets its speed while the rest sit partly idle. A GPU counts as several
            parts here: tensor cores are its units for matrix arithmetic, ray-tracing cores are separate units that
            follow light rays to draw an image, and video engines are fixed circuits that only compress and
            decompress video. Memory bandwidth is the rate at which memory can stream data to the processor.{' '}
            <Cite id="F08-50">the machine parts this dive uses</Cite>
          </Box>
          <AnimatedFigure
            name="one episode through the loop"
            steps={LOOP_STEPS}
            intervalMs={2600}
            cites="F08-50 F08-75 F08-76 F01-26"
            caption={
              <>
                Read clockwise from stage 1. The blue dot is one episode and the blue line is how far it has
                travelled. Each tag is the machine part that fills first in that stage&apos;s commonest workloads;
                section 20, Fifteen Workloads, Five Shapes, holds the full map. The tags are this dive&apos;s reading
                of its sources. The drawing of the arm is illustrative, not measured.
              </>
            }
          >
            {(step, reduced) => <LoopRing step={step} reduced={reduced} />}
          </AnimatedFigure>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="The thesis of the dive: the stages share a robot and almost nothing else, and that decides what you buy">
            Why it is fifteen workloads
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Look at the tags again. One stage decodes video on CPU cores. One traces rays. One multiplies tensors on
            many machines for days. One waits on a robot that moves at the speed of a robot. These jobs serve the
            same arm, and they have almost nothing else in common.
          </Box>
          <Box variant="p">
            That is why the dive counts workloads and not stages. Split each of the eight stages wherever two of its
            steps fill different parts of the machine, and you get twelve workloads you can run for one arm on a desk
            machine or a single cloud instance. Add three that the arm&apos;s owner uses as finished models and that
            only large labs run (generating video with a world model, and pretraining the big models the small ones
            start from), and the count is fifteen. <Cite id="F08-75">how the fifteen are chosen</Cite>
          </Box>
          <Box variant="p">
            Two properties of a workload then decide what it runs on. The part it fills first picks the machine: an
            instance sold for its GPU is the wrong buy for a job waiting on CPU cores. Its shape picks how the
            machine is bought and scheduled. Shape means how long one unit of work runs, whether its pieces must
            exchange data while running, and whether it can be stopped and resumed. A job of short independent units
            can run on capacity that may be taken back; a job tied to the robot&apos;s clock cannot.{' '}
            <Cite id="F08-78">the five shapes</Cite>
          </Box>
          <Box variant="p">
            The rest of the dive teaches the model behind each stage first and sizes it second. It ends with one
            table: all fifteen workloads, each with its machine part, instance family, scheduler and way of buying
            capacity.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2" description="Find the section that answers the question you came with">Nine questions</Header>}>
        <SpaceBetween size="s">
          <Box variant="p">
            The dive answers nine questions. Terms in brackets are names you will meet in the section titles; each
            is built from the ground up in the section that owns it.
          </Box>
          <QuestionTable />
          <Box variant="p">
            If none of these is your question yet, go to section 2, Getting Started. It lays down the four ideas
            every later section stands on and offers three reading routes.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
