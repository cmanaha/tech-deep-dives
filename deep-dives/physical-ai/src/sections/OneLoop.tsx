import type { CSSProperties, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import { Cite } from '../components/Cite';
import { AnimatedFigure } from '../components/Figure';
import { sections } from '../lib/sections';
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
/* The eight stages: what each hands on and which part fills first          */
/* ------------------------------------------------------------------------ */

function StageTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 520 }}>
        <thead>
          <tr>
            <th style={{ ...TH, width: '46%' }}>Stage, and what it hands on</th>
            <th style={TH}>The part that fills first, and why</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={TD}>
              <strong>1. Collect.</strong> A person steers the arm through the task. Each attempt is recorded as an
              episode: a table of joint readings and motor commands over time, plus one video per camera.{' '}
              <Cite id="F01-26">LeRobot feature_utils.py</Cite>
            </td>
            <td style={TD}>
              CPU cores beside the robot. LeRobot, the open-source robot-learning library whose defaults the arm
              follows, compresses the video with a software encoder for AV1 (AOMedia Video 1, a video compression
              format), so the encoding is CPU work. <Cite id="F08-76">the workload table, row 1</Cite>
            </td>
          </tr>
          <tr>
            <td style={TD}>
              <strong>2. Process and curate.</strong> The video is decoded back into frames, bad episodes are
              dropped and near-duplicates are removed. What leaves is a dataset: the episodes worth training on.
            </td>
            <td style={TD}>
              CPU cores, or the GPU&apos;s video engines where the card decodes that format. Decoding is integer
              code full of branches; on a GPU it runs in fixed circuits that are separate from the units that do the
              training arithmetic. <Cite id="F08-76">the workload table, row 2</Cite>
            </td>
          </tr>
          <tr>
            <td style={TD}>
              <strong>3. Augment.</strong> More training samples are made from the recorded ones, from simple image
              changes applied as each sample is loaded to whole generated video clips.
            </td>
            <td style={TD}>
              CPU cores per GPU for the image changes, which run in the worker processes that feed the trainer, on a
              budget the instance fixes: 24 vCPUs per GPU on most eight-GPU sizes. GPU memory for generated video.{' '}
              <Cite id="F08-76">the workload table, rows 4 and 13</Cite>{' '}
              <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>
            </td>
          </tr>
          <tr>
            <td style={TD}>
              <strong>4. Simulate.</strong> A simulator is a program that steps a virtual copy of the arm, the block
              and the cup through physics and draws what virtual cameras would see. It supplies attempts no person
              had to perform.
            </td>
            <td style={TD}>
              One CPU core per scene for the physics, which is small sequential arithmetic with branches that depend
              on the data. The cameras are a second workload: GPU memory first, then the GPU&apos;s ray-tracing
              cores when the renderer traces rays. <Cite id="F08-76">the workload table, rows 5 and 7</Cite>
            </td>
          </tr>
          <tr>
            <td style={TD}>
              <strong>5. Train a policy.</strong> The policy learns from the episodes to produce the motor commands
              the person produced.
            </td>
            <td style={TD}>
              GPU tensor cores, with GPU memory deciding which models fit on the card at all, unless stage 3 starves
              the trainer of samples. <Cite id="F08-76">the workload table, row 8</Cite>
            </td>
          </tr>
          <tr>
            <td style={TD}>
              <strong>6. Train a world model.</strong> A world model predicts what happens next, given what the
              robot sees and an action it might take.
            </td>
            <td style={TD}>
              GPU tensor cores, lightly for the small model one arm trains.{' '}
              <Cite id="F08-76">the workload table, row 9</Cite>
            </td>
          </tr>
          <tr>
            <td style={TD}>
              <strong>7. Evaluate.</strong> Each saved version of the policy runs many simulated attempts and the
              successes are counted. The count decides which version goes to the arm.
            </td>
            <td style={TD}>
              A mix inside every attempt: physics, simulated cameras and policy inference. The attempts are
              independent, so the job is many small copies.{' '}
              <Cite id="F08-76">the workload table, row 10</Cite>
            </td>
          </tr>
          <tr>
            <td style={TD}>
              <strong>8. Export and deploy.</strong> The chosen policy is compiled for the computer beside the arm
              and runs there, and what the arm then does is recorded as the next episodes.
            </td>
            <td style={TD}>
              GPU tensor cores on a machine whose CPU and GPU share one memory, which makes memory bandwidth the part
              they share. <Cite id="F08-76">the workload table, rows 11 and 12</Cite>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Nine questions, each with its short answer                               */
/* ------------------------------------------------------------------------ */

function QuestionRow({ q, read, children }: { q: string; read: number[]; children: ReactNode }) {
  return (
    <tr>
      <td style={TD}>
        <strong>{q}</strong>
        <div style={{ marginTop: 4 }}>{children}</div>
      </td>
      <td style={TD}>
        {read.map((n) => (
          <div key={n} data-num="nav">
            {sections[n - 1].title}
          </div>
        ))}
      </td>
    </tr>
  );
}

function QuestionTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 520 }}>
        <thead>
          <tr>
            <th style={TH}>The question, and the short answer</th>
            <th style={{ ...TH, width: '36%' }}>Where it is argued</th>
          </tr>
        </thead>
        <tbody>
          <QuestionRow q="What is the arm to the software that runs it?" read={[3]}>
            Six joint angles in, six target angles out, and one image per camera, 30 times a second. An answer that
            arrives late is executed late, so a delay is a distance the arm travels on old orders.{' '}
            <Cite id="F01-26">LeRobot feature_utils.py</Cite>{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>
          </QuestionRow>
          <QuestionRow q="How does a policy learn from recorded demonstrations, and what does a written instruction add?" read={[4, 5]}>
            By copying, with a correction for drift: one mistake moves a copied policy to states the demonstrations
            never covered, and predicting a chunk of the next k actions from one observation divides the number of
            decisions by k. A VLA (vision-language-action model) is a vision-language model given the robot&apos;s
            state as a further input and an action chunk as its output, so the task can be named in words.{' '}
            <Cite id="F02-2">Ross, Gordon and Bagnell, section 1</Cite>{' '}
            <Cite id="F02-5">ACT paper, section IV-A</Cite> <Cite id="F02-32">pi0 paper, section IV, model size</Cite>
          </QuestionRow>
          <QuestionRow q="What is a world model for, and why are there two kinds?" read={[6, 7]}>
            It lets a robot try actions in prediction before the motors move. One kind predicts the next video
            frames; the other predicts a latent, a compact learned summary of the scene, and the summary is far
            cheaper per imagined future: the V-JEPA 2 authors report 16 seconds to plan one action with their latent
            model against 4 minutes with a video model given one tenth as many samples, on one RTX 4090. JEPA
            (Joint-Embedding Predictive Architecture) is the design that trains such a model by predicting one
            encoding from another. <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>{' '}
            <Cite id="F03-47">LeCun position paper, section 4.4</Cite>
          </QuestionRow>
          <QuestionRow q="Where does reinforcement learning fit, and what changes when an agent runs the experiments?" read={[8, 19]}>
            RL (reinforcement learning) trains by trial and reward, and for a robot the question is where the trials
            come from. A simulator supplies them in bulk: the default recipe for a simulated SO-101 task steps 4,096
            arms side by side and collects about 197 million control steps. The real arm supplies them at the pace of
            a robot, a reset and a person. A coding agent can run the same experiments unattended once people have
            built and frozen the reset, the success check and the safety limits; in the ENPIRE system those
            are written rules, and the repository files read show no mechanism that prevents the edit.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>{' '}
            <Cite id="F04-2">ENPIRE paper, sections 1, 2.1 and 2.2</Cite>{' '}
            <Cite id="F04-8">ENPIRE repository, autoresearch_instruction.md and AGENTS.md</Cite>
          </QuestionRow>
          <QuestionRow q="What happens to the data between the robot and the trainer, and why can a GPU sit idle during training?" read={[9, 10, 11]}>
            An episode is table rows plus video, and the video is nearly all of the bytes. LeRobot&apos;s default
            video is AV1 written and read by CPU code, and the H100 cannot hardware-decode it, so the cores beside
            the GPU do the decoding: 24 vCPUs per GPU on most eight-GPU EC2 sizes. When they fall behind, the GPU
            waits. <Cite id="F08-77">the CPU beside the GPU</Cite>{' '}
            <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>
          </QuestionRow>
          <QuestionRow q="What does simulation cost, which GPU does it need, and how far can it be trusted?" read={[12, 13, 14, 16]}>
            One scene&apos;s physics belongs on one CPU core, and a GPU pays when thousands of scenes step together.
            Cameras drawn by RTX ray tracing need a GPU with RT (ray-tracing) cores, which the training-class cards
            lack: the Isaac Sim 6.2.0 requirements page says &quot;GPUs without RT Cores (A100, H100) are not
            supported.&quot; A policy trained there survives the move to the bench when training varied the
            simulator&apos;s parameters widely or someone measured the arm and corrected them (sim-to-real).{' '}
            <Cite id="F08-76">the workload table, rows 5 to 7</Cite>{' '}
            <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>{' '}
            <Cite id="F06-66">Tobin et al., domain randomization paper, abstract</Cite>{' '}
            <Cite id="F06-30">MuJoCo Playground, SO-101 sysid README</Cite>
          </QuestionRow>
          <QuestionRow q="Can the model drive the arm in time, and how does it reach many robots?" read={[17, 18]}>
            A large policy misses the control period several times over: NVIDIA reports 149.0 ms per call of GR00T
            N1.7 on a Jetson Orin, 4.5 periods at 30 Hz. It drives the arm anyway because each call returns a chunk
            of actions that the arm plays while the next call computes. Many robots managed together are a fleet,
            and on AWS IoT Greengrass one component may carry at most 2 GB of artifacts, so a large policy travels
            as a container image or an object in Amazon S3.{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>{' '}
            <Cite id="F07-87">AWS IoT Greengrass quotas</Cite>
          </QuestionRow>
          <QuestionRow q="How would I check which part of a machine is full?" read={[20, 21, 22, 23]}>
            Compare demand with supply, then read the counters. A core&apos;s PMU (performance monitoring unit) is
            its built-in set of event counters, and it says where the cycles went: 62.3% of the stand-in
            policy&apos;s cycles stalled on memory. Every measurement of ours is a single run of a stand-in program on
            one core of an edge machine, which shows the method and is too little to size an EC2 instance.{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </QuestionRow>
          <QuestionRow q="Which AWS scheduler and which way of buying capacity fit each workload?" read={[24, 25, 26, 27, 28, 29]}>
            The shape picks among four schedulers: AWS Batch (a managed queue), AWS Parallel Computing Service
            (managed Slurm, the scheduler of high-performance computing clusters), Amazon SageMaker HyperPod (a
            cluster that stays up) and Amazon EKS (Elastic Kubernetes Service). Independent units such as the 500
            episodes are one Batch array job on Spot. A job whose nodes exchange data while they run belongs on
            another market: the EC2 guide lists workloads &quot;tightly coupled between instance nodes&quot; among
            those Spot is not suitable for. <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>{' '}
            <Cite id="F09-95">EC2 User Guide, Spot best practices</Cite>
          </QuestionRow>
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
            description="Place any job in a robot's learning loop on an instance, a scheduler and a way of buying capacity before you benchmark it, by asking which part of the machine it fills first and what shape it has (sources read 2026-11-20)."
          >
            1. One Arm, Fifteen Workloads: What Each One Runs On
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Teaching one small robot arm one task takes about fifteen computing jobs, and they share the arm and
            almost nothing else. One compresses video on CPU cores, one traces rays on a GPU, one multiplies matrices
            for hours, and one has to answer inside a tick of the arm&apos;s clock. Size the loop as &quot;GPU
            training&quot; and the part that fills first is often a CPU core, on a machine bought for its GPU. Each job can be placed before it is benchmarked by asking
            two things of it. Which part of the machine does it fill first? That picks the instance. What is its
            shape: how long one unit of work runs, whether its pieces must exchange data while they run, whether it
            survives losing its machine? That picks the scheduler and the way the capacity is bought. (The split
            into fifteen is ours; section 20, Fifteen Workloads, Five Shapes, shows it.){' '}
            <Cite id="F08-77">the CPU beside the GPU</Cite>
          </Box>
          <Box variant="p">
            <strong>The first question, worked.</strong> The arm is an {ARM}, a six-motor desktop arm, and its task
            is to {TASK_STORY} with no person steering. What steers it is a policy, the trained model that reads the
            cameras and the joint angles and decides what the motors do next, and one decision reads every weight of
            the model once. Our stand-in for a policy is six 1024x1024 <code>float32</code> matrices, 25.2 MB of
            weights, more than the processor&apos;s caches hold. On one Cortex-A78AE core of an NVIDIA Jetson Orin
            Nano Super, a small computer of the kind that sits beside a robot, it ran 390 inferences per second
            (NumPy, single run), so it asked memory for 390 x 25.2 MB = 9.8 GB/s. A loop that streams through arrays
            larger than the caches reached 11.71 GB/s on the same core (single run), and the core&apos;s counters
            put 62.3% of the stand-in&apos;s cycles in stalls on memory. That core is out of memory bandwidth, the
            rate at which memory delivers data to the processor. Faster arithmetic on the same memory would spend
            most of its gain waiting; the figure to read on a machine for this job is GB/s.{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-63">our arithmetic on the stand-in&apos;s weights</Cite>{' '}
            <Cite id="F08-66">our profiling report, memory streaming row</Cite>
          </Box>
          <Box variant="p">
            The stand-in is a stack of dense layers on a CPU core. The arm&apos;s real policy runs convolutions and
            attention on the GPU of such a machine, where CPU and GPU share one memory. The method carries over to
            it: count the bytes one unit of work reads, multiply by units per second, and compare with what the part
            delivers. The figures stay with the stand-in.{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Tell from three properties of a job whether it can run on capacity that may be taken back, and what a lost machine costs it"
          >
            The second question: a deadline for one job, 500 independent episodes for another
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Running the policy has a shape as well as a full part. The arm takes a new target 30 times a second, one
            every 33.3 ms, and it does not wait for a slow answer. NVIDIA reports 149.0 ms for one call of its GR00T
            N1.7 policy on a Jetson Orin, which is 4.5 of those periods.{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite> A job with a deadline on every
            unit of work cannot be stopped and resumed, so no capacity that can be taken back will do: it runs on
            the computer beside the arm, and its measure is the time per call where every other job&apos;s is
            throughput. <Cite id="F08-79">how each property maps to a part</Cite>
          </Box>
          <Box variant="p">
            Now a second job for the same arm: scoring a new policy before it is trusted with the motors. The policy
            drives a simulated arm through the task 500 times, each attempt (an episode) from its own random seed,
            and the successes are counted. No episode needs data from another and none has a deadline, so the job is
            500 short units that can run anywhere, in any order. On AWS that is one array job in AWS Batch, a single
            submission that spawns 500 children, each reading its index to pick its seed.{' '}
            <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite> It can run on Spot, EC2 capacity that AWS
            takes back after a notice issued two minutes before, on a best-effort basis.{' '}
            <Cite id="F10-520">EC2 User Guide, Spot Instance interruption notices</Cite> A machine taken back costs
            the episodes it was running, and a retry rule on the job sends those back to the front of the queue.{' '}
            <Cite id="F09-10">AWS Batch User Guide, automated job retries</Cite>
          </Box>
          <Box variant="p">
            One arm, two jobs: the first wants memory bandwidth on a machine it never loses, the second wants many
            small machines it can afford to lose. The three properties that separated them are the whole of a
            job&apos;s shape. <strong>Duration</strong> is how long one unit of work runs.{' '}
            <strong>Coupling</strong> is whether the pieces must exchange data while they run.{' '}
            <strong>Interruptibility</strong> is whether the job can lose its machine and resume having lost no more
            than one unit. <Cite id="F08-78">the five shapes, defined by three properties</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Picture the hardware every later figure refers to: six motors, two cameras and a clock of 30 ticks a second">
            The bench: two arms, two cameras and a laptop
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Everything the fifteen workloads compute starts or ends in a few signals on one bench. The {ARM} that
            does the work is called the follower. To teach it, a person holds a second, matching arm called the
            leader and moves it by hand, and the follower copies the motion.{' '}
            <Cite id="F01-2">SO-ARM100 README, Sourcing Parts</Cite> The follower has six motors: five position the
            arm and the sixth opens and closes the gripper.{' '}
            <Cite id="F01-8">LeRobot so_follower.py, lines 68-80</Cite> So the arm&apos;s whole state is six joint
            angles, and an order to it is six target angles.
          </Box>
          <Box variant="p">
            Two cameras watch, one on the wrist and one looking down from above, each at 640x480 and 30 frames per
            second in the SO-101 examples. <Cite id="F01-30">LeRobot cameras.mdx and the record examples</Cite> A
            laptop reads the joints and the cameras and sends the motors their targets on the same 30-per-second
            clock. The joints come to 1,440 bytes per second and the two cameras to 55.3 MB/s of raw pixels, 38,400
            times as much, which is why video keeps turning up as the work that fills a machine.{' '}
            <Cite id="F01-86">our arithmetic on the camera settings</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See which part of the machine each of the eight stages fills first, and why no single instance type suits the loop"
          >
            One episode round the loop: the full part changes at each hand-off
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A recorded attempt passes through eight stages before the arm can repeat it unaided, and the full part
            changes at nearly every hand-off. &quot;Full&quot; has one meaning throughout: the part that sets the
            job&apos;s speed while the others sit partly idle. A GPU counts as several parts. Its tensor cores are
            the units for matrix arithmetic, its ray-tracing cores are separate units that follow light rays to draw
            an image, and its video engines are fixed circuits that only compress and decompress video; a card can
            have one and lack another. <Cite id="F08-50">the machine parts and the counter that shows each</Cite>
          </Box>
          <StageTable />
          <AnimatedFigure
            name="one episode through the loop"
            steps={LOOP_STEPS}
            intervalMs={2600}
            cites="F08-50 F08-75 F08-76 F01-26"
            caption={
              <>
                Read clockwise from stage 1. The blue dot is one episode and the blue line is how far it has
                travelled. Each tag is the machine part that fills first in that stage&apos;s commonest workloads,
                in our reading of the sources behind the table in section 20, Fifteen Workloads, Five Shapes. The
                drawing of the arm is illustrative, not measured.
              </>
            }
          >
            {(step, reduced) => <LoopRing step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            Four of the eight boxes carry a CPU tag, and a GPU instance sells its CPU cores in a fixed ratio to its
            GPUs: 24 vCPUs per GPU, which is 12 physical cores, on most eight-GPU sizes. Those cores are the part
            bought by accident, and the first thing to check on a training run whose GPU sits idle.{' '}
            <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Count the jobs the way a buyer has to: split a stage wherever the full part changes, then sort the result by what a lost machine costs"
          >
            Eight stages make fifteen workloads, and three properties sort them into five shapes
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            A stage is a step in the arm&apos;s story; a workload is a job with one part that fills first. Split
            each stage wherever two of its steps fill different parts and the eight stages give twelve workloads that
            one arm&apos;s owner can run on a desk machine or a single EC2 instance. Simulation alone is three: one
            scene&apos;s physics on a CPU core, thousands of scenes stepped together on a GPU, and the simulated
            cameras. Three more reach the owner as finished models and are run only at the scale of the vendors that
            publish them: generating video with a world model, and pretraining the two large models that the small
            ones start from. <Cite id="F08-75">how the fifteen are chosen</Cite>
          </Box>
          <Box variant="p">
            Sorted by duration, coupling and interruptibility, the fifteen fall into five shapes, and the shape says
            what a lost machine costs. <Cite id="F08-78">the five shapes, defined by three properties</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Fan-out.</strong> Short independent units, such as decoding, physics, simulated cameras and
              the 500 evaluation episodes. A lost machine costs one unit.
            </li>
            <li>
              <strong>One node for hours.</strong> Training the arm&apos;s policy or its world model. A lost machine
              costs the work since the last checkpoint, the copy of the model saved to storage during the run.
            </li>
            <li>
              <strong>Many nodes as one.</strong> The two pretraining workloads, whose nodes exchange gradients at
              every step for days. Losing one node loses the step on all of them.
            </li>
            <li>
              <strong>Always on.</strong> A steady stream handled item by item, such as decoding video that arrives
              all day. A lost machine costs one item.
            </li>
            <li>
              <strong>On the robot&apos;s clock.</strong> Recording an episode and running the policy. Nothing may
              be lost, because the arm is moving.
            </li>
          </ul>
          <Box variant="p">
            What a job loses when it stops is
            what it has not yet written to storage, so the checkpoint interval is a setting that decides the market:
            for jobs on Spot, the AWS Batch guide advises splitting or checkpointing the work into parts of 30
            minutes or less. <Cite id="F08-79">how each property maps to a part</Cite>{' '}
            <Cite id="F09-11">AWS Batch User Guide, Spot best practices</Cite>
          </Box>
          <Box variant="p">
            Part and shape are separate axes. Decoding one arm&apos;s 50 episodes is a few minutes on a laptop;
            the same code at a company that ingests video all day is a standing tier of CPU machines. The full part
            is CPU cores in both, and only the way the capacity is bought has changed.{' '}
            <Cite id="F08-80">one workload, two shapes</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Start from the question you came with: each has a short answer, and the sections that argue it">
            What each job computes: nine questions, with short answers
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Placing a workload means knowing what it computes, so the questions people bring are about the models,
            the data and the simulator before they are about instances. Each has a short answer.
          </Box>
          <QuestionTable />
          <Box variant="p">
            To place a job of your own, do what the first screen did. Write down what one unit of work reads or
            computes, multiply by units per second, and compare with what the part supplies, as 9.8 GB/s asked
            against 11.71 GB/s supplied did for the stand-in policy on one Jetson core (our single runs). Then ask
            its duration, its coupling and what a lost machine would cost it. Section 20, Fifteen Workloads, Five
            Shapes, does both for all fifteen; section 2, Getting Started, has the four ideas and three routes that
            get you there.{' '}
            <Cite id="F08-63">our arithmetic on the stand-in&apos;s weights</Cite>{' '}
            <Cite id="F08-66">our profiling report, memory streaming row</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
