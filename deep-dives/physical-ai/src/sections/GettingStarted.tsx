import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import SegmentedControl from '@cloudscape-design/components/segmented-control';
import { Cite } from '../components/Cite';
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
  1: 'One Loop',
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
            letters on a cell say which routes pass through it, so you can see where two routes share a section.
            Cells with no letter are side trips.
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
            description="Four ideas to hold, and the shortest route for the reason you are reading (LeRobot v0.7.0 and the Isaac-GR00T repository, read 2026-11-20)"
          >
            2. Getting Started
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 1 showed the whole loop on one arm. This section is the map for everything after it. It gives
            you the four ideas every later section assumes, says where each one is built properly, and offers three
            routes through the <Nav>30</Nav> sections, so you read what your question needs and skip the rest
            without getting lost.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Check that the dive starts where you are, and know which neighbouring dive owns what this one skips">
            Who this is for
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            You work in IT or software. You know what a model, training, weights, fine-tuning, a GPU, a container,
            Kubernetes and S3 are, and you have heard of vision-language models. The dive assumes no robotics: no
            control theory, no kinematics, and no reinforcement learning beyond the name. Every robotics term is
            built on the page before it is used, and always on the same example: an {ARM}, a small desktop robot
            arm, learning to {TASK_STORY}.
          </Box>
          <Box variant="p">
            What the dive skips, its sibling dives own. Distributed training, data loading and checkpointing are in
            the <Link href="../llm-training-systems/">Training at Scale dive</Link>. The basics and the algorithms
            of reinforcement learning, where a model improves by trial and reward, are in the{' '}
            <Link href="../rl-agentic-loops/">Learning From Feedback dive</Link>. How a GPU and the memory
            hierarchy execute a model is in the{' '}
            <Link href="../silicon-memory-inference/">Silicon, Memory &amp; Inference dive</Link>. The network
            fabric that joins the nodes of a multi-node training job is in the{' '}
            <Link href="../efa/">EFA (Elastic Fabric Adapter) dive</Link>. Sections here link to them at the point
            of need.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="The foundation every later section stands on, each idea on its smallest real example">
            Four ideas to hold
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>1. A policy is a function from what the robot senses to what it does next.</strong> It is the
            trained model in the driving seat. On the {ARM} the input is six joint angles and one image per camera,
            and the output is six target joint angles.{' '}
            <Cite id="F01-26">LeRobot feature_utils.py, dataset features</Cite> The robot runs on a clock, 30 times
            a second at the defaults of LeRobot, the open-source robot-learning library this dive follows, and the
            policy must keep that clock supplied with outputs.{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite> Robotics calls the input an observation
            and the output an action. Section 3 builds both.
          </Box>
          <Box variant="p">
            <strong>2. An episode is one recorded attempt at the task.</strong> On disk it is a table with one row
            per tick of that clock, plus video. Each row holds what the arm sensed and what it was told at that
            instant: <code>observation.state</code>, six <code>float32</code> joint angles, and{' '}
            <code>action</code>, six <code>float32</code> targets. Each camera adds one image per row, and those
            images are the video.{' '}
            <Cite id="F01-26">LeRobot feature_utils.py, dataset features</Cite> At LeRobot&apos;s defaults an
            episode runs for 60 s at 30 frames per second, so a full-length attempt is 1,800 rows.{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite> A dataset is a collection of episodes, and
            training a policy means fitting it to those rows.
          </Box>
          <Box variant="p">
            <strong>3. Training happens in one place and acting in another.</strong> A policy is trained where the
            GPUs are, on a workstation or in the cloud, with no deadline on any single step. It acts on the robot,
            on the computer beside the arm, against the clock of 30 ticks a second. The model must cross that gap:
            the same weights have to answer in time on a much smaller machine. NVIDIA&apos;s benchmark of one call
            to its GR00T N1.7 policy reports a median of 22.9 ms on an H100 data-centre GPU and 149.0 ms on a
            Jetson Orin, one of its onboard computers for robots.{' '}
            <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite>
          </Box>
          <Box variant="p">
            <strong>4. The machine has parts that saturate separately.</strong> A workload fills one part first
            and leaves the others idle, so &quot;how big a machine&quot; is the wrong unit. The parts this dive
            tracks are the CPU cores, memory, three engines inside the GPU, and storage and network outside the
            chip. The three GPU engines are the tensor cores, which do the matrix arithmetic of training and
            inference; the ray-tracing cores, which draw the images a simulated camera sees; and the video engines,
            which compress and decompress video. Training, rendering and video encoding can share one GPU and each
            load a different part of it. The grouping is this dive&apos;s own, and section 20 refines it into nine
            parts.{' '}
            <Cite id="F08-50">the parts of the machine and the counter that shows each</Cite> The question to
            carry into every section: which part does this workload fill first?
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Go straight to the section that owns the idea you are missing">
            Where each idea is built
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The four paragraphs above are enough to start any route. Each idea has a section that builds it in
            full, with the mechanism and the numbers.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 520 }} data-num="nav">
              <thead>
                <tr>
                  <th style={TH}>Idea</th>
                  <th style={TH}>Built in</th>
                  <th style={TH}>What that section adds</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Policy, observation, action</td>
                  <td style={TD}>3, The Robot as a Computer; then 4, Learning From Demonstrations</td>
                  <td style={TD}>
                    Section 3: what the arm senses, what it can be told, and the clock. Section 4: how a policy is
                    trained from recorded attempts.
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Episode</td>
                  <td style={TD}>9, Collecting Data</td>
                  <td style={TD}>What an episode is on disk and what it costs to make one.</td>
                </tr>
                <tr>
                  <td style={TD}>Training there, acting here</td>
                  <td style={TD}>15, Training at Three Scales; 17, Running on the Robot</td>
                  <td style={TD}>
                    Section 15: what a training job asks of a cluster. Section 17: fitting a policy inside a
                    latency budget on a named device.
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The machine&apos;s parts</td>
                  <td style={TD}>
                    20, Fifteen Workloads, Five Shapes; 21, Reading a Machine: PMU Cards. The PMU (performance
                    monitoring unit) is the set of counters built into a processor.
                  </td>
                  <td style={TD}>
                    Section 20: which part each workload loads. Section 21: how to read that from the counters.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Pick the route for your reason and read eight or thirteen sections in place of all of them">
            Three routes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The dive has eight parts and a reference section. Read front to back, it follows the loop. Most readers
            arrive with one of three reasons, and each has a shorter route. All three start with sections 1 and 2.
          </Box>
          <ul style={{ margin: 0, paddingLeft: 22 }}>
            <li>
              <strong>World models.</strong> A world model predicts what happens next if the robot takes a given
              action. JEPA (Joint-Embedding Predictive Architecture) is the family that makes that prediction in a
              compact internal representation of the scene. Read 3, 4, 6, 7, then <Nav>16</Nav> and <Nav>22</Nav>.
              Sections 3 and 4 are on the route because section 7 plans actions, and it uses action, chunk and
              control rate as known terms.
            </li>
            <li>
              <strong>The pipeline.</strong> You want every phase from a recorded attempt to a model running on a
              fleet. Read 3, then 9 to <Nav>18</Nav> in order: data, simulation, training, evaluation, the robot
              and the fleet.
            </li>
            <li>
              <strong>The compute answer.</strong> You have to choose machines and a scheduler. Read{' '}
              <Nav>20 to 25</Nav>: the workloads, how to read a machine, the measurements, how to compare, and the
              choices on AWS.
            </li>
          </ul>
          <RouteMap />
          <Box variant="p">
            Three sections sit on no route. Section 5 covers vision-language-action models, policies built on a
            network that also takes a text instruction; read it when you meet one in an announcement. Section 8
            covers reinforcement learning for robots, and section <Nav>19</Nav> covers software agents that launch
            the experiments.
          </Box>
          <Box variant="p">
            The parts feed each other in one direction, which is why a route can skip ahead. The table gives each
            section its full title and says what its part hands on.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560 }} data-num="nav">
              <thead>
                <tr>
                  <th style={TH}>Part</th>
                  <th style={TH}>Sections</th>
                  <th style={TH}>What it hands on</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Framing</td>
                  <td style={TD}>1 One Robot, One Loop. 2 Getting Started. 3 The Robot as a Computer.</td>
                  <td style={TD}>The vocabulary: observation, action, tick. Every later section uses it.</td>
                </tr>
                <tr>
                  <td style={TD}>The models</td>
                  <td style={TD}>
                    4 Learning From Demonstrations. 5 Vision-Language-Action Models. 6 World Models: Predicting
                    What Happens Next. 7 JEPA: Predicting in Latent Space. 8 Reinforcement Learning for Robots.
                  </td>
                  <td style={TD}>What gets trained. Sections 4 to 7 are what section 15 sizes training jobs for.</td>
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
                  <td style={TD}>A trained policy, and a measure of whether it works on the task.</td>
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
                    20 Fifteen Workloads, Five Shapes. 21 Reading a Machine: PMU Cards. 22 Our Measurements. 23
                    Price-Performance and Latency.
                  </td>
                  <td style={TD}>
                    Which part of the machine each workload from the earlier parts loads, and how to measure and
                    compare machines.
                  </td>
                </tr>
                <tr>
                  <td style={TD}>AWS</td>
                  <td style={TD}>
                    24 Orchestrating Physical AI on AWS. 25 AWS Batch. 26 AWS Parallel Computing Service. 27 Amazon
                    SageMaker HyperPod. 28 Amazon EKS. 29 Choosing.
                  </td>
                  <td style={TD}>
                    The workloads placed on AWS, each of the four schedulers taken apart with its cluster drawn, and
                    a way to get capacity for each workload.
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Reference</td>
                  <td style={TD}>30 Glossary and Sources.</td>
                  <td style={TD}>Every term and every source the page cites.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Whichever route you picked, the next stop is the same idea in more depth. For world models and the
            pipeline, go to section 3 and learn what the arm takes in and puts out 30 times a second. For the
            compute answer, go to section <Nav>20</Nav> and start asking which part fills first.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
