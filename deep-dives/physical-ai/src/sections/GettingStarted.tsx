import { useState } from 'react';
import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import SegmentedControl from '@cloudscape-design/components/segmented-control';
import { Cite, Derived } from '../components/Cite';
import { Figure } from '../components/Figure';
import { ARM, TASK_STORY } from '../lib/task';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const NEUTRAL_INK = '#5f6b7a';
const EMPHASIS = '#0972d3';
const ON_ROUTE_FILL = '#f2f8fd';

/**
 * A section number of this dive, or a count of its sections. It is navigation, with no source
 * behind it, so the citation check skips it (the same marker section 30 uses for its lists).
 */
function Nav({ children }: { children: ReactNode }) {
  return <span data-num="nav">{children}</span>;
}

/* ------------------------------------------------------------------------ */
/* Diagram 2.1: the sections in eight parts, with the three reading routes  */
/* ------------------------------------------------------------------------ */

type RouteId = 'world' | 'pipeline' | 'compute';

const ROUTES: { id: RouteId; tag: string; text: string; sections: number[] }[] = [
  { id: 'world', tag: 'W', text: 'World models', sections: [1, 2, 3, 4, 6, 7, 16, 22] },
  { id: 'pipeline', tag: 'P', text: 'Pipeline', sections: [1, 2, 3, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] },
  { id: 'compute', tag: 'C', text: 'Compute', sections: [1, 2, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] },
];

/** Short labels for the grid; the full titles are in the table under the figure. */
const SHORT: Record<number, string> = {
  1: 'One Arm',
  2: 'Getting Started',
  3: 'Robot as a Computer',
  4: 'Demonstrations',
  5: 'Vision-Language-Action',
  6: 'World Models',
  7: 'JEPA',
  8: 'Reinforcement Learning',
  9: 'Collecting Data',
  10: 'Processing, Curating',
  11: 'Augmentation',
  12: 'Physics Simulation',
  13: 'Rendering',
  14: 'Sim-to-Real',
  15: 'Training Scales',
  16: 'Evaluation',
  17: 'On the Robot',
  18: 'The Fleet',
  19: 'Agents',
  20: 'Workloads',
  21: 'Reading a Machine',
  22: 'Our Measurements',
  23: 'Price-Performance',
  24: 'Orchestrating on AWS',
  25: 'AWS Batch',
  26: 'Parallel Computing',
  27: 'SageMaker HyperPod',
  28: 'Amazon EKS',
  29: 'Choosing',
  30: 'Glossary and Sources',
};

const PARTS: { name: string; sections: number[] }[] = [
  { name: 'Framing', sections: [1, 2, 3] },
  { name: 'The models', sections: [4, 5, 6, 7, 8] },
  { name: 'The data', sections: [9, 10, 11] },
  { name: 'Simulation', sections: [12, 13, 14] },
  { name: 'Training and evaluation', sections: [15, 16] },
  { name: 'The edge', sections: [17, 18, 19] },
  { name: 'The compute', sections: [20, 21, 22, 23] },
  { name: 'AWS', sections: [24, 25, 26, 27, 28, 29] },
  { name: 'Reference', sections: [30] },
];

const CELL_W = 184;
const CELL_H = 26;
const ROW_H = 30;
const PART_HEAD = 18;
const PART_GAP = 8;
const COL_X = [12, 204];
const TAG_W = 15;

interface Placed {
  n: number;
  x: number;
  y: number;
}

/** Two cells per row, parts stacked top to bottom. Ends at y = 814 for the nine parts above. */
function layout(): { heads: { name: string; y: number }[]; cells: Placed[] } {
  const heads: { name: string; y: number }[] = [];
  const cells: Placed[] = [];
  let y = 40;
  for (const part of PARTS) {
    heads.push({ name: part.name, y: y + 13 });
    y += PART_HEAD;
    part.sections.forEach((n, i) => {
      cells.push({ n, x: COL_X[i % 2], y: y + Math.floor(i / 2) * ROW_H });
    });
    y += Math.ceil(part.sections.length / 2) * ROW_H + PART_GAP;
  }
  return { heads, cells };
}

function RouteGrid({ selected }: { selected: RouteId }) {
  const { heads, cells } = layout();
  const route = ROUTES.find((r) => r.id === selected) ?? ROUTES[0];
  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <svg
        viewBox="0 0 400 816"
        role="img"
        aria-labelledby="getting-started-routes-title"
        style={{ width: '100%', height: 'auto' }}
        data-num="nav"
      >
        <title id="getting-started-routes-title">The sections of the dive in nine parts, with three reading routes</title>
        <desc>
          Every section is a cell, grouped under its part and numbered in reading order. A cell carries the letter W
          when it is on the world models route, P for the pipeline route and C for the compute route. The cells of
          the selected route, {route.text}, are outlined: sections {route.sections.join(', ')}.
        </desc>
        <rect x="0" y="0" width="400" height="816" fill="#fbfbfd" />

        {/* legend */}
        {ROUTES.map((r, i) => {
          const x = [12, 160, 274][i];
          const on = r.id === selected;
          return (
            <g key={r.id}>
              <rect x={x} y="10" width={TAG_W} height="16" rx="3" fill={on ? EMPHASIS : '#ffffff'} stroke={on ? EMPHASIS : NEUTRAL_INK} strokeWidth="1" />
              <text x={x + TAG_W / 2} y="22.5" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill={on ? '#ffffff' : NEUTRAL_INK}>
                {r.tag}
              </text>
              <text x={x + TAG_W + 6} y="22.5" fontFamily="sans-serif" fontSize="12" fontWeight={on ? 'bold' : 'normal'} fill={INK}>
                {r.text} route
              </text>
            </g>
          );
        })}

        {heads.map((h) => (
          <text key={h.name} x="12" y={h.y} fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill={INK}>
            {h.name}
          </text>
        ))}

        {cells.map((c) => {
          const onRoute = route.sections.includes(c.n);
          const tags = ROUTES.filter((r) => r.sections.includes(c.n));
          return (
            <g key={c.n}>
              <rect
                x={c.x}
                y={c.y}
                width={CELL_W}
                height={CELL_H}
                rx="4"
                fill={onRoute ? ON_ROUTE_FILL : '#ffffff'}
                stroke={onRoute ? EMPHASIS : NEUTRAL_INK}
                strokeWidth={onRoute ? 2.5 : 1}
              />
              <text
                x={c.x + 8}
                y={c.y + 17.5}
                fontFamily="sans-serif"
                fontSize="12"
                fontWeight={onRoute ? 'bold' : 'normal'}
                fill={onRoute ? INK : NEUTRAL_INK}
              >
                {c.n} {SHORT[c.n]}
              </text>
              {tags.map((r, i) => {
                const tx = c.x + CELL_W - 6 - (tags.length - i) * (TAG_W + 2) + 2;
                const on = r.id === selected;
                return (
                  <g key={r.id}>
                    <rect x={tx} y={c.y + 5} width={TAG_W} height="16" rx="3" fill={on ? EMPHASIS : '#ffffff'} stroke={on ? EMPHASIS : NEUTRAL_INK} strokeWidth="1" />
                    <text x={tx + TAG_W / 2} y={c.y + 17.5} textAnchor="middle" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill={on ? '#ffffff' : NEUTRAL_INK}>
                      {r.tag}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function RouteMap() {
  const [selected, setSelected] = useState<RouteId>('world');
  return (
    <SpaceBetween size="s">
      <SegmentedControl
        selectedId={selected}
        onChange={({ detail }) => setSelected(detail.selectedId as RouteId)}
        label="Reading route to highlight"
        options={ROUTES.map((r) => ({ id: r.id, text: r.text }))}
      />
      <Figure caption={<>The outlined cells are the selected route. A letter on a cell marks each route that passes through it.</>}>
        <RouteGrid selected={selected} />
      </Figure>
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function GettingStarted() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Size a robot job, or read a robot-model result, from four facts: the model answers to a 33.3 ms period, its data is video, it is sized once to train and again to run, and a machine fills one part at a time (LeRobot v0.7.0 and the Isaac-GR00T repository, read 2026-11-20)"
          >
            2. Getting Started: What Changes When the Model Drives a Robot
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Four facts about a robot arm change what you buy for it, and experience with language models points the
            wrong way on each. The model that drives the arm has a deadline the arm sets, 33.3 ms on this one, so it
            is sized in milliseconds per call and its throughput settles nothing. Its training data is almost all
            video, so the data pipeline is a video pipeline and its cost lands on CPU cores. The model is sized
            twice, for the GPU that trains it and for the small computer that runs it, and the second check is the
            one that fails late. And a machine fills one part at a time, so the size of an instance says little
            until you know which part the job fills first.{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>
          </Box>
          <Box variant="p">
            The arm is an {ARM}, a small desktop arm with six motors and two cameras, learning to {TASK_STORY}.
            LeRobot is the open-source robot-learning library it is recorded, trained and run with, and several of
            the numbers that follow are its defaults.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Size the computer beside the arm in milliseconds per call, and ask for the slowest call as well as the median">
            A policy is called on a clock, so its speed is a deadline
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The policy is the trained model in control of the arm. On every tick of the arm&apos;s clock the
            computer beside it reads the cameras and the six joint angles, which together are the observation, the
            policy returns six target joint angles, which are the action, and the targets go to the motors.{' '}
            <Cite id="F01-26">LeRobot feature_utils.py, dataset features</Cite> LeRobot runs that clock at 30
            ticks a second by default, so the whole chain has 33.3 ms.{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>
          </Box>
          <Box variant="p">
            A model that serves requests is judged by its throughput, or by a latency someone chose. A policy is
            judged against a period the arm sets, call by call, and an average hides the calls that matter.
            LeRobot&apos;s inference guide prints a sample of its own timing report at 30 Hz, with no hardware
            named. The mean tick took 18.7 ms of the 33.3 ms budget, and the mean policy call 5.18 ms. The same
            report prints &quot;cycles over the 33.3 ms work budget: 12/1197 (1.0%)&quot;, with a worst cycle of 48.1
            ms and a worst policy call of 40.00 ms. A machine that fits the mean with room to spare still missed the period on 1.0% of its
            ticks. <Cite id="F07-23">LeRobot inference guide, rollout timing example</Cite>
          </Box>
          <Box variant="p">
            So the computer beside the arm is chosen by the time of its slowest calls for your model. Published
            figures rarely give that: NVIDIA&apos;s benchmark of its robot model reports medians, and neither it nor our own runs
            hold a figure for the slowest calls.{' '}
            <Cite id="F08-84">the latency method, with the control period</Cite> What a missed period does depends
            on a setting. With LeRobot&apos;s default synchronous rollout, &quot;the robot stops moving every time
            the policy computes its next chunk of actions&quot;; with the asynchronous ones the arm keeps moving on
            actions it already holds, and an action that arrives late is an action for a scene that has already
            changed (section 3, The Robot as a Computer, turns that delay into a distance).{' '}
            <Cite id="F01-87">LeRobot remote inference guide and inference guide</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Budget robot data in a person's minutes at the bench and in CPU cores for video">
            An episode is rows plus video, and the video is nearly all of it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An episode is one attempt at the task, and robot data is counted in episodes. Recorded, an episode is a
            table with one row per tick plus one video per camera. A row holds what the arm sensed and what it was
            told at that instant: <code>observation.state</code>, six <code>float32</code> joint angles, and{' '}
            <code>action</code>, six <code>float32</code> targets.{' '}
            <Cite id="F01-26">LeRobot feature_utils.py, dataset features</Cite> The rows are almost nothing. At 30
            ticks a second the readings and targets come to 1,440 bytes per second, and two cameras at 640x480 come
            to 55.3 MB/s of raw pixels, 38,400 times as much.{' '}
            <Cite id="F01-86">the raw data rate, from the camera settings</Cite>
          </Box>
          <Box variant="p">
            The ratio survives compression. A public 50-episode pick-and-place dataset named for the SO-101 is 86.1
            MB in all: 11,939 frames from two cameras in two video files of 45.5 MB and 40.1 MB, and one 0.37 MB
            file that holds every row. The video is stored as AV1 (AOMedia Video 1), the compression format LeRobot
            writes by default. <Cite id="F05-29">Hugging Face hub file listing of the example dataset</Cite> Two
            decisions follow. The first is that a dataset is small and costs a person&apos;s time: LeRobot&apos;s
            recorder defaults to 50 episodes of up to 60 s with 60 s allowed to reset the scene after each, which
            is up to 50 x (60 + 60) s = <Derived>100</Derived> minutes at the bench.{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite> The second is that every later reader of
            the data, from the filter that drops bad episodes to the trainer, has to decode video before it can do
            anything else. Decoding is CPU work unless the GPU has a circuit for the format, so a team that budgets
            only GPUs for training can find those GPUs waiting on CPU cores (sections 9 and 10, Collecting Data and
            Processing and Curating).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Check a model against the robot's computer, with the runtime you will ship, before you spend GPU hours training it">
            A policy is sized twice: once to train, once to run
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A policy is trained where the GPUs are, with no deadline on any single step, and it runs on the computer
            beside the arm against the 33.3 ms tick. The same weights have to pass both, and the two sizes are in
            different units. Take GR00T N1.7, NVIDIA&apos;s robot model. To train: an AWS post reports 3.4 hours on
            one GPU and a peak of 41.5 GB of GPU memory for one run that adapted it to 75 SO-101 episodes over
            20,000 steps at batch 32, with the model&apos;s backbone frozen.{' '}
            <Cite id="F09-82">AWS post, timing table</Cite> To run: NVIDIA&apos;s benchmark of one policy call
            reports, with TensorRT, its inference compiler, a median of 22.9 ms on an H100, a data-centre GPU, and
            149.0 ms on a Jetson Orin, one of its onboard computers for robots.{' '}
            <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite>{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite> The first figure fits inside a tick and
            the second is several ticks long.
          </Box>
          <Box variant="p">
            Nothing in the training run reports the second size. A model can train without trouble
            and still be unable to drive the arm one action per tick, and the software on the robot moves the
            answer as much as the chip does: on the same Jetson Orin, NVIDIA&apos;s table gives 357.9 ms for the
            model run directly in PyTorch against the 149.0 ms of the compiled one.{' '}
            <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite> The compiled form is built on
            the robot&apos;s own computer, in about 2 to 5 minutes, and has to be rebuilt for a different GPU.{' '}
            <Cite id="F07-8">Isaac-GR00T deployment README, build notes</Cite>
          </Box>
          <Box variant="p">
            What lets a 149.0 ms call serve a 33.3 ms clock is that each benchmarked call returns 40 actions: the
            arm plays them while the next call computes. That works only while, in the words of LeRobot&apos;s
            guide, there is &quot;enough usable action playback to cover inference latency and its variation&quot;.
            So before training a model, time one call of it on the robot&apos;s computer in the runtime you will
            ship, and compare the result with the actions each call returns (section <Nav>17</Nav>, Running on the
            Robot). <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite>{' '}
            <Cite id="F01-87">LeRobot remote inference guide and inference guide</Cite>{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Find the part a job fills first by arithmetic, and stop reading a GPU utilisation figure as proof that the GPU is the limit">
            A machine fills one part at a time
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A computer is several parts with separate rates: CPU cores, memory, the units inside a GPU that do
            arithmetic, the circuits inside it that decode video, storage, the network. A job runs as fast as the
            first of them to run out. That part is full, the others sit partly idle, and a larger instance helps
            only if it has more of that part.{' '}
            <Cite id="F08-50">the parts of the machine and the counter that shows each</Cite>
          </Box>
          <Box variant="p">
            Which part is full can be worked out before a benchmark, by setting what the job asks against what the
            part supplies. Take training on the arm&apos;s episodes. LeRobot&apos;s hardware guide times one of its
            policies, Diffusion Policy, at 0.167 s per update at batch 32 on 4 H100 GPUs, which is 32 / 0.167 ={' '}
            <Derived>192</Derived> samples a second. <Cite id="F01-91">LeRobot hardware guide, benchmark table</Cite>{' '}
            A LeRobot pull request measured about 5 ms to fetch and decode one sample in one process, on hardware it
            does not state. <Cite id="F05-62">LeRobot pull request 4549</Cite> Then the trainer asks for{' '}
            <Derived>192</Derived> x 5 ms = <Derived>0.96</Derived> seconds of decoding every second: about one
            CPU core keeps four GPUs fed, and the GPUs are the full part (our arithmetic from the two sources).
            Change one setting and the answer moves. With image transforms applied per sample, LeRobot&apos;s
            documentation says, &quot;the GPU ends up waiting for data&quot;: the full part is now the CPU cores,
            and a faster GPU would train no faster. <Cite id="F05-58">LeRobot v0.7.0 lerobot-dataset-v3.mdx</Cite>
          </Box>
          <Box variant="p">
            The usual check misleads here. The GPU utilisation that <code>nvidia-smi</code> prints is the share of
            time in which at least one program was running on the GPU, and it says nothing about how much of the GPU
            that program used. <Cite id="F08-30">nvidia-smi documentation, Utilization</Cite> A GPU that
            spends part of every step waiting for data can still read as busy, and the team buys a larger one. The remedy is to pay for the instance
            whose full part is the part being bought: decoding belongs on CPU instances, or on the GPU instance
            with the most cores per GPU. <Cite id="F08-85">price-performance per part</Cite> Section 1 counts one
            case by hand, section <Nav>20</Nav>, Fifteen Workloads, Five Shapes, does it for every job in the loop,
            and the{' '}
            <Link href="../silicon-memory-inference/">Silicon, Memory &amp; Inference dive</Link> covers how a GPU
            and the memory hierarchy execute a model.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Go straight to the sections your question needs, and know what you can leave for later">
            Where to go next, by the question you have
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            None of the three common reasons for reading needs all <Nav>30</Nav> sections.
          </Box>
          <ul style={{ margin: 0, paddingLeft: 22 }}>
            <li>
              <strong>World models.</strong> To learn what a world model is for, and how JEPA (Joint-Embedding
              Predictive Architecture, a design that predicts a compact summary of the scene in place of its
              pixels) trains and plans, read sections 3, 4, 6 and 7, then <Nav>16</Nav> and <Nav>22</Nav>. The
              data, simulation and AWS sections can wait.
            </li>
            <li>
              <strong>The pipeline.</strong> To follow an episode from the bench to a model running on many robots,
              read section 3 and then 9 to <Nav>18</Nav> in order. The model sections, 4 to 8, are background you
              can return to.
            </li>
            <li>
              <strong>The compute answer.</strong> To choose machines, a scheduler and a way of buying capacity,
              read sections <Nav>20 to 29</Nav>. They assume the four ideas and section 1, and nothing else.
            </li>
          </ul>
          <RouteMap />
          <Box variant="p">
            Sections 5, 8 and <Nav>19</Nav> are on no route: models that also read a written instruction,
            reinforcement learning (training by trial and reward) on a robot, and software agents that run the
            experiments. The algorithms of reinforcement learning are in the{' '}
            <Link href="../rl-agentic-loops/">Learning From Feedback dive</Link>.
          </Box>
          <Box variant="p">
            On the first two routes, continue at section 3, The Robot as a Computer, which turns the 33.3 ms tick
            into a distance. On the third, go to section <Nav>20</Nav>, Fifteen Workloads, Five Shapes, and ask of
            the first job you own which part it fills first.{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
