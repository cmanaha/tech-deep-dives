import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
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

const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

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
  const route = ROUTES.find((r) => r.id === selected) ?? ROUTES[0];
  return (
    <SpaceBetween size="s">
      <SegmentedControl
        selectedId={selected}
        onChange={({ detail }) => setSelected(detail.selectedId as RouteId)}
        label="Reading route to highlight"
        options={ROUTES.map((r) => ({ id: r.id, text: r.text }))}
      />
      <Figure
        caption={
          <>
            Read top to bottom: every route runs in section order. The outlined cells are the selected route, and the
            letters on a cell say which routes pass through it, which shows where two routes share a section. A
            cell with no letter is on no route.
          </>
        }
      >
        <RouteGrid selected={selected} />
      </Figure>
      <Box variant="p">
        <span aria-live="polite" data-num="nav">
          <strong>{route.text} route:</strong> sections {route.sections.join(', ')}.
        </span>
      </Box>
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
            description="Hold four ideas and any section opens out of order; then take the route of eight, thirteen or twelve sections that matches why you came (LeRobot v0.7.0 and the Isaac-GR00T repository, read 2026-11-20)"
          >
            2. Getting Started: Four Ideas and Three Routes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Four ideas are enough to open any of the <Nav>30</Nav> sections out of order: a policy is a function
            called on a clock, an episode is the unit the data is counted in, a model is trained on one machine and
            runs on another, and a machine fills one part at a time. Each one changes a decision. The first turns a
            model&apos;s speed into a deadline of 33.3 ms, the second makes robot data a video problem, the third
            means a policy is sized twice, and the fourth replaces &quot;how big a machine&quot; with &quot;which
            part fills first&quot;. <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>
          </Box>
          <Box variant="p">
            Most readers come for one of three reasons: to understand world models, to follow the pipeline from a
            recorded attempt to a fleet of robots, or to choose machines and a scheduler. Each reason has a route,
            and the longest is <Nav>13</Nav> sections.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Check that the starting point is yours, and know which sibling dive holds what is left out">
            What you bring, and what other dives hold
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The starting point is someone who builds or runs software. A model, training, weights, fine-tuning, a
            GPU, a container, Kubernetes and S3 are familiar, and vision-language models are at least a name. No
            robotics is assumed: no control theory, no kinematics, and of reinforcement learning (training by trial
            and reward) only the name. Each robotics term is built in the sentence that first needs it, on one
            example: an {ARM}, a small desktop robot arm, learning to {TASK_STORY}.
          </Box>
          <Box variant="p">
            Four neighbouring subjects are left to their own dives. The algorithms of reinforcement learning are in
            the <Link href="../rl-agentic-loops/">Learning From Feedback dive</Link>, and how a GPU and the memory
            hierarchy execute a model is in the{' '}
            <Link href="../silicon-memory-inference/">Silicon, Memory &amp; Inference dive</Link>. Distributed
            training, data loading and checkpointing are in the Training at Scale dive, and the network fabric that
            joins the nodes of a multi-node training job is in the dive on EFA (Elastic Fabric Adapter, the EC2
            network device that lets many machines train as one).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Know the four facts the later sections use without restating, each with the decision it changes">
            Four ideas, and what each one decides
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>1. A policy is a function called on a clock, so its speed is a deadline.</strong> The policy is
            the trained model in control of the arm. On the {ARM} its input, called the observation, is six joint
            angles and one image per camera, and its output, called the action, is six target joint angles.{' '}
            <Cite id="F01-26">LeRobot feature_utils.py, dataset features</Cite> The arm consumes one action per
            tick of its clock: 30 ticks a second at the defaults of LeRobot, the open-source robot-learning library
            the arm is recorded, trained and run with, which makes one tick 33.3 ms.{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite> A model that serves requests is judged by
            its throughput, or by a latency someone chose. A policy is judged against a period the arm sets, and an
            action that arrives after its tick is an action for a scene that has already changed. Every question
            about the computer beside the arm starts from that period.
          </Box>
          <Box variant="p">
            <strong>2. An episode is the unit the data is counted in, and nearly all of it is video.</strong> An
            episode is one attempt at the task. Recorded, it is a table with one row per tick plus one video per
            camera. A row holds what the arm sensed and what it was told at that instant:{' '}
            <code>observation.state</code>, six <code>float32</code> joint angles, and <code>action</code>, six{' '}
            <code>float32</code> targets, 24 bytes each.{' '}
            <Cite id="F01-26">LeRobot feature_utils.py, dataset features</Cite> At LeRobot&apos;s defaults an
            episode lasts 60 s at 30 frames per second, 1,800 rows, a recording session is 50 episodes, and 60 s
            is allowed for resetting the scene between them.{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite> Two things follow. A dataset for one arm is
            small and expensive in a person&apos;s time: 50 x 1,800 = <Derived>90,000</Derived> rows cost up to 50
            minutes of steering and as many again of resetting (our arithmetic on those defaults). And since the rows are a
            few bytes and the frames are not, storing, decoding and feeding episodes to a trainer is video work,
            which is where the CPU cores go in sections 9 to 11.
          </Box>
          <Box variant="p">
            <strong>3. A policy is trained on one machine and runs on another, so it is sized twice.</strong>{' '}
            Training happens where the GPUs are, with no deadline on any single step. Acting happens on the computer
            beside the arm, against the 33.3 ms tick, and the same weights have to answer there. NVIDIA&apos;s
            benchmark of one call to its GR00T N1.7 policy reports a median of 22.9 ms on an H100, a data-centre
            GPU, and 149.0 ms on a Jetson Orin, one of its onboard computers for robots.{' '}
            <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite>{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite> The first figure fits inside a tick and
            the second is several ticks long. So a model that trains without trouble can still be too slow to
            drive the arm one action at a time, and the choice of model has to be checked against the robot&apos;s
            computer as well as the trainer&apos;s memory. Each benchmarked call returns 40 actions: the
            arm plays them while the next call computes, which is how a slow model keeps a fast clock supplied
            (section <Nav>17</Nav>, Running on the Robot).
          </Box>
          <Box variant="p">
            <strong>
              4. A machine fills one part at a time, so the question is which part, and the answer can be
              checked.
            </strong>{' '}
            A workload fills one part first; once that part is full the job goes no faster and the rest of the
            machine sits partly idle. Section 1 worked one case: a stand-in policy asked one Jetson core for 9.8 GB/s
            of memory traffic where that core streams 11.71 GB/s (our single runs).{' '}
            <Cite id="F08-63">our arithmetic on the stand-in&apos;s weights</Cite>{' '}
            <Cite id="F08-66">our profiling report, memory streaming row</Cite> Nine parts on the chip are tracked from section <Nav>20</Nav> on. Two belong
            to the CPU: the front end, which fetches and decodes instructions, and the back end, which executes
            them. Two belong to memory: its bandwidth, the rate at which it streams data, and its latency, the delay
            to fetch one item. Five belong to the GPU: tensor cores for matrix arithmetic, general compute,
            ray-tracing cores that draw what a simulated camera sees, video engines that compress and decompress
            video, and the GPU&apos;s own memory. Storage and network are parts outside the chip. (The grouping is
            ours.) <Cite id="F08-50">the parts of the machine and the counter that shows each</Cite> Nearly every
            part has a counter that shows when it is the full one, so a choice of instance can be tested on a
            running job. The exception is the ray-tracing cores: the NVIDIA profiling guide read on 2026-11-20
            lists them as a unit, and no metric for them was found in its text.{' '}
            <Cite id="F08-36">Nsight Compute Profiling Guide, Streaming Multiprocessor</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Go straight to the section that builds the idea you are missing, with its mechanism and its numbers">
            The section that builds each idea
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each idea is stated here in a paragraph and built in full elsewhere. A route that skips the building
            section still reads, because the paragraph is all a later section assumes.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 520 }} data-num="nav">
              <thead>
                <tr>
                  <th style={TH}>Idea</th>
                  <th style={TH}>Built in</th>
                  <th style={TH}>What you get there</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>A policy on a clock</td>
                  <td style={TD}>3, The Robot as a Computer; then 4, Learning From Demonstrations</td>
                  <td style={TD}>
                    Section 3 turns a delay into a distance the arm travels. Section 4 shows how a policy is
                    trained from recorded attempts and why plain copying drifts.
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The episode</td>
                  <td style={TD}>9, Collecting Data</td>
                  <td style={TD}>What an episode weighs on disk, and what the compression chosen at the bench costs every later reader of the data.</td>
                </tr>
                <tr>
                  <td style={TD}>Trained on one machine, run on another</td>
                  <td style={TD}>15, Training at Three Scales; 17, Running on the Robot</td>
                  <td style={TD}>
                    Section 15 sizes the training job by its scale. Section 17 fits a policy inside the control
                    period on a named device.
                  </td>
                </tr>
                <tr>
                  <td style={TD}>One part fills first</td>
                  <td style={TD}>
                    20, Fifteen Workloads, Five Shapes; 21, Reading a Machine. The cards of section 21 are read from
                    the PMU (performance monitoring unit), the set of event counters built into a processor.
                  </td>
                  <td style={TD}>
                    Section 20 works out which part each workload fills from demand and supply. Section 21 reads the
                    same answer from the counters.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Pick the route for your reason and read eight, thirteen or twelve sections in place of all thirty">
            Three routes, by the reason you came
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Read front to back, the <Nav>30</Nav> sections follow an episode round the loop and then size what it
            met. A reader with one question needs fewer. All three routes start with sections 1 and 2 and run in
            section order.
          </Box>
          <ul style={{ margin: 0, paddingLeft: 22 }}>
            <li>
              <strong>World models.</strong> You want to know what a world model is for and how the family called
              JEPA (Joint-Embedding Predictive Architecture, a design that predicts a compact internal
              representation of the scene in place of its pixels) trains and plans. Read 3, 4, 6 and 7, then{' '}
              <Nav>16</Nav>, Evaluation, and <Nav>22</Nav>, Our Measurements. Sections 3 and 4 come first because
              section 7 plans actions and uses action, chunk and control rate as known terms.
            </li>
            <li>
              <strong>The pipeline.</strong> You want every step from a recorded attempt to a model running on many
              robots. Read 3, then 9 to <Nav>18</Nav> in order: data, simulation, training, evaluation, the robot
              and the fleet.
            </li>
            <li>
              <strong>The compute answer.</strong> You have to choose machines, a scheduler and a way of buying
              capacity. Read <Nav>20 to 29</Nav>: which part each workload fills, how to read that from a machine,
              what has been measured, how to compare two machines, and the four AWS schedulers with the choice
              among them.
            </li>
          </ul>
          <RouteMap />
          <Box variant="p">
            Three sections are on no route because each answers a question of its own. Section 5,
            Vision-Language-Action Models, covers policies built on a network that also reads a text instruction;
            go there when an announcement names one. Section 8, Reinforcement Learning for Robots, is for a reader
            whose policy must improve by its own attempts, and section <Nav>19</Nav>, Agents Running the Loop,
            builds on it.
          </Box>
          <Box variant="p">
            A route can skip ahead because the parts feed each other in one direction. Where a section needs an
            earlier one, the last column says so.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560 }} data-num="nav">
              <thead>
                <tr>
                  <th style={TH}>Part</th>
                  <th style={TH}>Sections</th>
                  <th style={TH}>What it hands on, and what it needs</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Framing</td>
                  <td style={TD}>1 One Arm, Fifteen Workloads. 2 Getting Started. 3 The Robot as a Computer.</td>
                  <td style={TD}>The two questions asked of every workload, and the vocabulary of observation, action and tick.</td>
                </tr>
                <tr>
                  <td style={TD}>The models</td>
                  <td style={TD}>
                    4 Learning From Demonstrations. 5 Vision-Language-Action Models. 6 World Models. 7 JEPA. 8
                    Reinforcement Learning for Robots.
                  </td>
                  <td style={TD}>What gets trained. Sections 4 to 7 are the models section 15 sizes training jobs for.</td>
                </tr>
                <tr>
                  <td style={TD}>The data</td>
                  <td style={TD}>9 Collecting Data. 10 Processing and Curating. 11 Augmentation and Synthetic Data.</td>
                  <td style={TD}>
                    The episodes the models train on. Section 9 needs 3, section 10 needs 9, and section 11 needs
                    6 and 12.
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Simulation</td>
                  <td style={TD}>12 Physics Simulation. 13 Rendering and Ray Tracing. 14 Sim-to-Real and Real-to-Sim.</td>
                  <td style={TD}>
                    A computed copy of the arm and its cameras, and what it takes for a policy trained there to
                    work on the real bench.
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Training and evaluation</td>
                  <td style={TD}>15 Training at Three Scales. 16 Evaluation.</td>
                  <td style={TD}>A trained policy, and a count of successes that says whether it is better than the last one.</td>
                </tr>
                <tr>
                  <td style={TD}>The edge</td>
                  <td style={TD}>17 Running on the Robot. 18 The Fleet. 19 Agents Running the Loop.</td>
                  <td style={TD}>
                    The policy on the robot&apos;s own computer and on many robots. Section 17 needs 3 and 5, and
                    section 19 needs 8.
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The compute</td>
                  <td style={TD}>
                    20 Fifteen Workloads, Five Shapes. 21 Reading a Machine. 22 Our Measurements. 23
                    Price-Performance and Latency.
                  </td>
                  <td style={TD}>
                    The part each workload fills and the shape it has, how to check both on a machine, and how to
                    compare two machines on one unit of work.
                  </td>
                </tr>
                <tr>
                  <td style={TD}>AWS</td>
                  <td style={TD}>
                    24 Orchestrating Physical AI on AWS. 25 AWS Batch. 26 AWS Parallel Computing Service. 27 Amazon
                    SageMaker HyperPod. 28 Amazon EKS. 29 Choosing.
                  </td>
                  <td style={TD}>
                    Each workload placed on one of four schedulers and one way of buying capacity, ending in a
                    table of all fifteen.
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Reference</td>
                  <td style={TD}>30 Glossary and Sources.</td>
                  <td style={TD}>Every term defined and every source cited, grouped by authority.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            On the world models and pipeline routes, continue at section 3, The Robot as a Computer, which turns the
            33.3 ms tick into a distance. On the compute route, go to section <Nav>20</Nav>, Fifteen Workloads, Five
            Shapes, and ask of the first workload you own which part it fills first.{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
