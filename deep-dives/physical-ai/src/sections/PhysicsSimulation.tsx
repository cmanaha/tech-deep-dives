import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Toy, Derived } from '../components/Cite';
import { Figure, AnimatedFigure } from '../components/Figure';
import { Formula, M } from '../components/Math';
import { log10Scale } from '../lib/scale';
import { ARM, SIM_TASK, SIM_TASK_PLAIN, SIM_TASK_GAP } from '../lib/task';
import { Capture, MUJOCO_SO101 } from '../components/Capture';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const ROBOT_FILL = '#fff6d6';
const ROBOT_INK = '#7a5c00';
const CPU_FILL = '#e8f1fb';
const CPU_INK = '#1f5fa8';
const GPU_FILL = '#e6f6ea';
const GPU_INK = '#1e7b3a';
const NEUTRAL_INK = '#5f6b7a';
const EMPHASIS = '#0972d3';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 560, margin: '0 auto' };

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/** The shipped state-only sibling of the vision task. */
const SIM_TASK_STATE = 'SO101PickCube';

/* ------------------------------------------------------------------------ */
/* Diagram 12.1: one physics step                                           */
/* ------------------------------------------------------------------------ */

const STEP_CAPTIONS = [
  <>
    The state before the step: every joint angle and every joint speed, plus where the cube is and how it is moving.
    The card shows one joint, the elbow, with illustrative values.
  </>,
  <>
    Position group. From the angles, the simulator works out where every link and the cube are in space, then checks
    which shapes touch. In this picture it finds two contacts, one per finger.
  </>,
  <>Velocity group. It computes the forces that depend on speed, such as the damping in each joint.</>,
  <>
    Force and acceleration group. The servo model turns each goal angle into a motor torque. The constraint solve then
    finds the finger forces that hold the cube without the fingers sinking into it, and the acceleration of every
    joint that results: for the elbow, <Toy>2.0</Toy> rad/s² in this illustration.
  </>,
  <>
    Integrate. The timestep is 5 ms, or 0.005 s. New speed: <Toy>1.000 + 2.0 x 0.005 = 1.010</Toy> rad/s. New angle:{' '}
    <Toy>0.50000 + 1.010 x 0.005 = 0.50505</Toy> rad. The drawing exaggerates the movement.
  </>,
  <>
    The new state, 5 ms later. The next step starts from it. The pick-cube task runs 200 of these steps for each
    simulated second.
  </>,
];

const STAGE_BOXES = [
  {
    at: 2,
    y: 226,
    title: '1  Position',
    lines: ['From the joint angles: where every body is,', 'and which pairs of shapes touch (the contacts).'],
  },
  {
    at: 3,
    y: 312,
    title: '2  Velocity',
    lines: ['Forces that depend on speed, such as', 'the damping in each joint.'],
  },
  {
    at: 4,
    y: 398,
    title: '3  Force and acceleration',
    lines: ['Motor torques, then the constraint solve:', 'contact forces and every joint acceleration.'],
  },
  {
    at: 5,
    y: 484,
    title: '4  Integrate',
    lines: ['new speed = speed + acceleration x timestep', 'new angle = angle + new speed x timestep'],
  },
];

function StepDiagram({ step, reduced }: { step: number; reduced: boolean }) {
  const s = step + 1;
  const label = { fontFamily: 'sans-serif', fontSize: 12, fill: INK } as const;
  const title = { fontFamily: 'sans-serif', fontSize: 13, fontWeight: 'bold', fill: INK } as const;
  const fade = (on: boolean): CSSProperties => ({ opacity: on ? 1 : 0, transition: reduced ? 'none' : 'opacity 400ms ease' });
  const moved = s >= 5;
  const stateOn = s === 1 || s === 6;
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 590" role="img" aria-labelledby="physics-step-title" style={{ width: '100%', height: 'auto' }}>
        <title id="physics-step-title">One physics step, from the old state to the new state</title>
        <desc>
          At the top, a side view of the arm holding a cube between two fingers, beside a card with the angle and speed
          of the elbow joint and the simulated time. Below, four boxes in order: position, velocity, force and
          acceleration, integrate. Each lights up in turn. After the last one the arm has moved slightly and the card
          shows a new angle, a new speed and a time 5 ms later.
        </desc>
        <defs>
          <marker id="physics-step-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={NEUTRAL_INK} />
          </marker>
          <marker id="physics-step-force" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={EMPHASIS} />
          </marker>
        </defs>
        <rect x="0" y="0" width="400" height="590" fill="#fbfbfd" />

        {/* the scene */}
        <rect x="10" y="10" width="240" height="196" rx="4" fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1.5" />
        <text x="22" y="30" {...title}>
          The scene
        </text>
        <line x1="22" y1="186" x2="238" y2="186" stroke={ROBOT_INK} strokeWidth="2" />
        <rect x="40" y="164" width="36" height="22" fill="#ffffff" stroke={ROBOT_INK} strokeWidth="2" />
        <line x1="58" y1="164" x2="58" y2="150" stroke={ROBOT_INK} strokeWidth="6" strokeLinecap="round" />
        <line x1="58" y1="150" x2="120" y2="74" stroke={ROBOT_INK} strokeWidth="6" strokeLinecap="round" />
        <circle cx="58" cy="150" r="6" fill="#ffffff" stroke={ROBOT_INK} strokeWidth="2" />
        <g
          style={{
            transform: moved ? 'rotate(-7deg)' : 'rotate(0deg)',
            transformOrigin: '120px 74px',
            transition: reduced ? 'none' : 'transform 700ms ease',
          }}
        >
          <line x1="120" y1="74" x2="206" y2="96" stroke={ROBOT_INK} strokeWidth="6" strokeLinecap="round" />
          <line x1="190" y1="102" x2="222" y2="102" stroke={ROBOT_INK} strokeWidth="5" strokeLinecap="round" />
          <line x1="192" y1="102" x2="192" y2="142" stroke={ROBOT_INK} strokeWidth="4" strokeLinecap="round" />
          <line x1="220" y1="102" x2="220" y2="142" stroke={ROBOT_INK} strokeWidth="4" strokeLinecap="round" />
          <rect x="194" y="114" width="24" height="24" fill="#ffffff" stroke={INK} strokeWidth="1.5" />
          <g style={fade(s >= 2)}>
            <circle cx="194" cy="126" r="4" fill={EMPHASIS} />
            <circle cx="218" cy="126" r="4" fill={EMPHASIS} />
          </g>
        </g>
        <circle cx="120" cy="74" r="6" fill="#ffffff" stroke={stateOn ? EMPHASIS : ROBOT_INK} strokeWidth={stateOn ? 3 : 2} />
        <text x="112" y="56" textAnchor="middle" {...label}>
          elbow
        </text>
        <text x="130" y="201" textAnchor="middle" {...label} style={fade(s === 2 || s === 3)}>
          blue dots: contacts
        </text>
        <g style={fade(s === 4)}>
          <line x1="168" y1="126" x2="187" y2="126" stroke={EMPHASIS} strokeWidth="2" markerEnd="url(#physics-step-force)" />
          <line x1="244" y1="126" x2="225" y2="126" stroke={EMPHASIS} strokeWidth="2" markerEnd="url(#physics-step-force)" />
          <line x1="206" y1="142" x2="206" y2="160" stroke={NEUTRAL_INK} strokeWidth="2" markerEnd="url(#physics-step-arrow)" />
          <text x="130" y="201" textAnchor="middle" {...label}>
            finger forces hold the cube
          </text>
          <text x="197" y="160" textAnchor="end" {...label}>
            gravity
          </text>
        </g>
        <text x="130" y="201" textAnchor="middle" {...label} style={fade(s >= 5)}>
          movement exaggerated
        </text>

        {/* the state card */}
        <rect x="260" y="10" width="130" height="196" rx="4" fill="#ffffff" stroke={stateOn ? EMPHASIS : NEUTRAL_INK} strokeWidth={stateOn ? 2.5 : 1.5} />
        <text x="272" y="30" {...title}>
          State
        </text>
        <text x="272" y="54" {...label}>
          elbow angle
        </text>
        <text x="272" y="96" {...label}>
          elbow speed
        </text>
        <text x="272" y="138" {...label}>
          simulated time
        </text>
        <g data-num="toy" style={fade(!moved)}>
          <text x="272" y="72" {...title}>
            0.50000 rad
          </text>
          <text x="272" y="114" {...title}>
            1.000 rad/s
          </text>
          <text x="272" y="156" {...title}>
            0 ms
          </text>
        </g>
        <g data-num="toy" style={fade(moved)}>
          <text x="272" y="72" {...title} fill={EMPHASIS}>
            0.50505 rad
          </text>
          <text x="272" y="114" {...title} fill={EMPHASIS}>
            1.010 rad/s
          </text>
          <text x="272" y="156" {...title} fill={EMPHASIS}>
            5 ms
          </text>
        </g>
        <text x="272" y="182" {...label} fill={NEUTRAL_INK}>
          illustrative values,
        </text>
        <text x="272" y="197" {...label} fill={NEUTRAL_INK}>
          one joint of many
        </text>

        {/* the four stage groups */}
        <line x1="200" y1="208" x2="200" y2="223" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#physics-step-arrow)" />
        {STAGE_BOXES.map((b, i) => {
          const on = s === b.at;
          return (
            <g key={b.title}>
              <rect
                x="10"
                y={b.y}
                width="380"
                height="70"
                rx="4"
                fill={on ? CPU_FILL : '#ffffff'}
                stroke={on ? EMPHASIS : NEUTRAL_INK}
                strokeWidth={on ? 2.5 : 1.5}
              />
              <text x="24" y={b.y + 22} {...title}>
                {b.title}
              </text>
              <text x="24" y={b.y + 42} {...label}>
                {b.lines[0]}
              </text>
              <text x="24" y={b.y + 59} {...label}>
                {b.lines[1]}
              </text>
              {i < STAGE_BOXES.length - 1 && (
                <line x1="200" y1={b.y + 72} x2="200" y2={b.y + 83} stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#physics-step-arrow)" />
              )}
            </g>
          );
        })}
        <text x="200" y="576" textAnchor="middle" {...title} style={fade(s === 6)}>
          one step done: 5 ms of simulated time
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 12.2: steps per second, one CPU core against a GPU batch         */
/* ------------------------------------------------------------------------ */

interface Bar {
  value: number;
  shown: string;
  machine: string;
  source: string;
}

const OUR_RUN_4 = 'Our measurement, single run. MuJoCo 4.0.1. Humanoid';

const BAR_GROUPS: { head: string; fill: string; ink: string; bars: Bar[] }[] = [
  {
    head: 'One CPU core, one world',
    fill: CPU_FILL,
    ink: CPU_INK,
    bars: [
      {
        value: 14507,
        shown: '14,507',
        machine: 'Jetson Orin Nano Super, one Cortex-A78AE core',
        source: 'Our measurement, single run. MuJoCo 3.17.0. Humanoid',
      },
      { value: 28662, shown: '28,662', machine: 'DGX Spark, one Cortex-A725 core', source: OUR_RUN_4 },
      { value: 57240, shown: '57,240', machine: 'DGX Spark, one Cortex-X925 core', source: OUR_RUN_4 },
    ],
  },
  {
    head: 'One CPU, every core, one world per thread',
    fill: CPU_FILL,
    ink: CPU_INK,
    bars: [
      {
        value: 650000,
        shown: '650 thousand',
        machine: 'Apple M3 Max, 2 threads per core',
        source: 'MuJoCo documentation, vendor figure. Humanoid',
      },
      {
        value: 1800000,
        shown: '1.8 million',
        machine: 'AMD 3995WX, 64 cores, 128 threads',
        source: 'MuJoCo documentation, vendor figure. Humanoid',
      },
    ],
  },
  {
    head: 'One GPU, a batch of worlds',
    fill: GPU_FILL,
    ink: GPU_INK,
    bars: [
      {
        value: 950000,
        shown: '950 thousand',
        machine: 'NVIDIA A100, MJX-JAX, batch of 8192',
        source: 'MuJoCo documentation, vendor figure. Humanoid',
      },
      {
        value: 5770000,
        shown: '5.77 million',
        machine: 'RTX 6000 Ada, MuJoCo Warp, 8192 worlds',
        source: 'MuJoCo Warp nightly benchmark, vendor figure. Humanoid',
      },
    ],
  },
];

const ROW_H = 60;
const HEAD_H = 26;

function ThroughputChart() {
  const x = log10Scale(1e3, 1e7, 20, 380);
  const label = { fontFamily: 'sans-serif', fontSize: 12, fill: INK } as const;
  let cursor = 12;
  const rows: { y: number; head?: string; ink: string; fill: string; bar?: Bar }[] = [];
  for (const g of BAR_GROUPS) {
    rows.push({ y: cursor, head: g.head, ink: g.ink, fill: g.fill });
    cursor += HEAD_H;
    for (const b of g.bars) {
      rows.push({ y: cursor, ink: g.ink, fill: g.fill, bar: b });
      cursor += ROW_H;
    }
  }
  const axisY = cursor + 4;
  const height = axisY + 50;
  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <svg viewBox="0 0 400 564" role="img" aria-labelledby="physics-throughput-title" style={{ width: '100%', height: 'auto' }}>
        <title id="physics-throughput-title">Physics steps per second on one CPU core, on a whole CPU and on one GPU with a batch of worlds</title>
        <desc>
          Seven horizontal bars on a logarithmic axis from one thousand to ten million steps per second, all for a
          humanoid model. Three bars are our own single-run measurements on one CPU core: 14,507, 28,662 and 57,240.
          Two are vendor figures for whole CPUs: 650 thousand and 1.8 million. Two are vendor figures for one GPU
          stepping 8192 worlds: 950 thousand and 5.77 million.
        </desc>
        <rect x="0" y="0" width="400" height={height} fill="#fbfbfd" />
        {[3, 4, 5, 6, 7].map((e) => (
          <g key={e}>
            <line x1={x(10 ** e)} y1="8" x2={x(10 ** e)} y2={axisY} stroke="#d5dbdb" strokeWidth="1" />
            <line x1={x(10 ** e)} y1={axisY} x2={x(10 ** e)} y2={axisY + 5} stroke={NEUTRAL_INK} strokeWidth="1" />
            <text x={x(10 ** e)} y={axisY + 22} textAnchor={e === 3 ? 'start' : e === 7 ? 'end' : 'middle'} {...label}>
              10
              <tspan dy="-5" fontSize="10">
                {e}
              </tspan>
            </text>
          </g>
        ))}
        <line x1={x(1e3)} y1={axisY} x2={x(1e7)} y2={axisY} stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <text x="200" y={axisY + 42} textAnchor="middle" {...label}>
          physics steps per second (log scale)
        </text>
        {rows.map((r) =>
          r.bar ? (
            <g key={r.bar.machine}>
              <rect x="20" y={r.y} width="360" height="34" fill="#fbfbfd" opacity="0.9" />
              <text x="20" y={r.y + 13} {...label}>
                <tspan fontWeight="bold">{r.bar.shown}</tspan>
                {`  ${r.bar.machine}`}
              </text>
              <text x="20" y={r.y + 29} {...label} fill={NEUTRAL_INK}>
                {r.bar.source}
              </text>
              <rect x={x(1e3)} y={r.y + 37} width={x(r.bar.value) - x(1e3)} height="13" fill={r.fill} stroke={r.ink} strokeWidth="1.5" />
            </g>
          ) : (
            <g key={r.head}>
              <rect x="20" y={r.y} width="360" height="20" fill="#fbfbfd" opacity="0.9" />
              <text x="20" y={r.y + 15} fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill={r.ink}>
                {r.head}
              </text>
            </g>
          ),
        )}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function PhysicsSimulation() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Know what a physics step is, what it costs, and when it moves from one CPU core to a GPU batch (MuJoCo 4.0.1, MuJoCo Playground 1.0 and our own single-run measurements, read 2026-11-20)"
          >
            12. Physics Simulation
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A physics simulator is a program that computes how a scene moves. It holds the arm, the table and the cube
            as numbers and advances them through time in small steps, so a policy (the model that picks the arm&apos;s
            actions) can attempt a task with no real arm on the bench. Section 8 used one to give reinforcement
            learning thousands of attempts at once. This section opens it up: what one step computes, how many steps a
            simulated second takes, and why one copy of the scene suits a CPU core while thousands suit a GPU.
          </Box>
          <Box variant="p">
            Two figures frame the answer. In our measurement, a single run on one Cortex-X925 core of an NVIDIA DGX
            Spark with MuJoCo 4.0.1, a MuJoCo humanoid model (a stand-in, not the arm) advanced 57,240 steps per
            second. <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite> The MuJoCo Warp project reports 5.77 million steps per
            second for a humanoid on one NVIDIA RTX 6000 Ada GPU that advances 8192 copies of the scene together.{' '}
            <Cite id="F06-20">MuJoCo Warp nightly benchmarks, humanoid</Cite> The two come from different machines,
            software versions and sources, so read the gap as about two orders of magnitude and no finer.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="What is on the screen when the arm is simulated, and what sits behind the picture">
            The scene: the arm in MuJoCo
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            MuJoCo is the open-source physics simulator from Google DeepMind that this dive uses for the {ARM}. Load
            the arm&apos;s model and a window shows it standing on a floor with a cube beside it. The model is a text
            file that lists every link, every joint, every servo and the shape of every part. DeepMind&apos;s model
            library, MuJoCo Menagerie, carries one for this arm, derived from the hardware maker&apos;s own file. It
            describes the gripper and the arm twice: detailed meshes for the picture, and simple added shapes for the
            physics to test for touching. <Cite id="F06-37">MuJoCo Menagerie, robotstudio_so101 README</Cite>
          </Box>
          <Box variant="p">
            Start the clock and the cube rests on the floor; close the gripper and the fingers stop at its sides.
            None of that comes for free. The scene is a list of numbers, and nothing in a list of numbers stops a cube
            from sinking through a floor. The simulator computes the forces that make the numbers behave like solid
            objects, many times per simulated second.
          </Box>
          <Box variant="p">
            MuJoCo Playground 1.0, DeepMind&apos;s suite of ready-made robot tasks built on MuJoCo, ships a task for
            this arm called <code>{SIM_TASK}</code>. <Cite id="F06-25">MuJoCo Playground changelog, version 1.0.0</Cite>{' '}
            The shipped task makes the arm {SIM_TASK_PLAIN}; {SIM_TASK_GAP} is this dive&apos;s extension. The worked
            example below takes its numbers from that task&apos;s code.
          </Box>
          <Capture
            file="so101-contact.jpg"
            kind="still"
            width={1200}
            height={800}
            maxWidth={760}
            alt="Close view of the gripper holding the block, bodies drawn transparent, with small discs at the contact points and arrows for the contact forces."
            caption={
              <>
                The grasp as the simulator sees it. The bodies are drawn transparent so the contacts show: each disc is
                a point where two shapes touch, and each arrow is the force the solver computed there to keep them from
                passing through each other. The sections below build up to how that force is found.
              </>
            }
            provenance={MUJOCO_SO101}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="The six words the rest of the section runs on: state, timestep, contact, constraint, solve and integrator">
            The idea: given forces, where is everything one timestep later
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The <strong>state</strong> is the full description of the scene at one instant. For the arm it is six
            joint angles and six joint speeds, one pair per servo. For the cube it is a position, an orientation and
            how fast each is changing. Speeds belong in it because an arm at rest and an arm swinging through the same
            pose end up in different places a moment later.
          </Box>
          <Box variant="p">
            The simulator is one function, called over and over. It takes the state and the commands to the motors and
            returns the state a short moment later. That moment is the <strong>timestep</strong>, and one call is a
            physics step. MuJoCo&apos;s default timestep is 0.002 s, which is 2 ms, and its documentation calls it the
            single most important setting for the trade between speed and accuracy.{' '}
            <Cite id="F06-10">MuJoCo XML reference, option/timestep</Cite> A smaller timestep is more accurate and
            needs more calls per simulated second. One that is too large makes the simulation unstable.{' '}
            <Cite id="F06-13">MuJoCo docs, choosing timestep and integrator</Cite>
          </Box>
          <Box variant="p">
            A <strong>contact</strong> is a place where two shapes touch: a finger on the cube, the cube on the floor.
            Every step, the simulator has to find them again, a search called collision detection. A{' '}
            <strong>constraint</strong> is a rule the next state has to obey. Each contact creates one: these two
            shapes do not pass through each other, and they slide against each other only when friction is overcome.
          </Box>
          <Box variant="p">
            The <strong>constraint solve</strong> computes the forces that keep every rule true. The floor pushes up
            on the cube exactly as hard as it takes to stop it sinking, and each finger pushes exactly as hard as it
            takes to stop passing into it. Those forces depend on one another (squeeze harder with one finger and the
            force at the other changes), so the simulator finds them together, by a numerical search inside every
            step. Once the forces are known, so is the acceleration of every joint. The{' '}
            <strong>integrator</strong> is the last part of the step: it uses the accelerations to advance every
            speed, and the speeds to advance every position, by one timestep.
          </Box>
          <Box variant="p">
            Contacts are what make a step expensive. In the words of MuJoCo&apos;s documentation, &quot;models with
            many floating objects (resulting in many contacts) are more demanding computationally&quot;.{' '}
            <Cite id="F06-11">MuJoCo XML reference, option/timestep</Cite> On this task the arm alone is cheap. The
            loose cube is where the contacts are.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Count, by hand, the physics steps and the policy decisions inside one second of the shipped pick-cube task">
            Worked example: one simulated second of the arm
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The pick-cube task for the {ARM} sets its own timestep: it steps physics every 5 ms, which is 2.5 times
            coarser than MuJoCo&apos;s 2 ms default. One simulated second is then:
          </Box>
          <Box variant="p">
            <code>1 s / 0.005 s per physics step = 200 physics steps</code>
          </Box>
          <Box variant="p">
            The policy does not decide on every one of them. In <code>{SIM_TASK}</code>, where the policy sees a
            camera image, it acts every 100 ms, 10 times a second. Between two decisions the simulator runs several
            physics steps, called substeps. The count of substeps per policy step is the control decimation:
          </Box>
          <Box variant="p">
            <code>0.1 s per policy step / 0.005 s per physics step = 20 substeps</code>
            <br />
            <code>10 policy steps x 20 substeps = 200 physics steps per simulated second</code>
          </Box>
          <Box variant="p">
            So one second of the simulated arm is 200 calls of the step function and 10 calls of the policy: the
            physics runs 20 times for each time the policy and its camera run once. The state-only sibling task, <code>{SIM_TASK_STATE}</code>, whose policy reads joint angles in place of an
            image, keeps the 20 ms default between decisions: 0.02 / 0.005 = 4 substeps, and{' '}
            <Derived>1 / 0.02 = 50</Derived> policy steps a second, over the same 200 physics steps.{' '}
            <Cite id="F06-105">MuJoCo Playground, reaf_sim config.py and SO-101 task.py</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Follow one call of the step function from the old state to the new one, and see where the contact forces enter">
            The mechanism: one step
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            MuJoCo&apos;s step function is <code>mj_step</code>. Its documentation lists what one call does as 26
            stages in four groups: position, velocity, force and acceleration, and the integrator.{' '}
            <Cite id="F06-9">MuJoCo docs, Computation chapter, simulation pipeline</Cite> Step through one call
            below.
          </Box>
          <AnimatedFigure
            name="one physics step"
            steps={STEP_CAPTIONS}
            intervalMs={3200}
            cites="F06-9 F06-105"
            caption={
              <>
                Read from the top down: the state enters, the four groups run in order, and the new state replaces the
                old one. The angle, speed and acceleration values and the two contacts are illustrative, not measured;
                the 5 ms timestep and the 200 steps per second are the pick-cube task&apos;s.
              </>
            }
          >
            {(step, reduced) => <StepDiagram step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            The third group carries the weight. It finds the joint accelerations that agree with every force on the
            arm and every contact rule at once. Underneath is the school formula, force equals mass times
            acceleration, written for a machine made of joints. Its symbols, in the notation of MuJoCo&apos;s
            documentation:
          </Box>
          <ul style={LIST}>
            <li>
              <M>{String.raw`\dot{v}`}</M>: the acceleration of every joint, the unknown the step is after. The dot
              means &quot;rate of change of&quot;, and <M>v</M> is the joint velocities. MuJoCo stores the result as{' '}
              <code>qacc</code>.
            </li>
            <li>
              <M>M</M>: the inertia matrix, the &quot;mass&quot; of a jointed body. It is a table and not a single
              number because the links carry each other: accelerating the shoulder also has to move the forearm.
            </li>
            <li>
              <M>{String.raw`\tau`}</M>: the forces applied at the joints, from the motors and from passive effects
              such as damping.
            </li>
            <li>
              <M>c</M>: the bias force, the pull of gravity and of the arm&apos;s own motion, such as a swinging
              forearm tugging on the shoulder.
            </li>
            <li>
              <M>f</M> and <M>J</M>: <M>f</M> is the contact forces, also unknown. <M>J</M>, the constraint
              Jacobian, is a table that says how far each joint&apos;s motion moves each contact point; transposed
              (<M>{String.raw`J^T`}</M>), it converts a force at a contact point into forces at the joints.
            </li>
          </ul>
          <Formula
            name="Equations of motion in continuous time"
            tex={String.raw`M \dot{v} + c = \tau + J^T f`}
            source={<Cite id="F11-200">MuJoCo docs, Computation chapter, equation of motion</Cite>}
          />
          <Box variant="p">
            On the left, <M>{String.raw`M \dot{v}`}</M> is mass times acceleration and <M>c</M> is what gravity and
            motion demand before anything else is applied. On the right, <M>{String.raw`\tau`}</M> is what the
            motors and damping contribute; with nothing touching, that settles the equation and{' '}
            <M>{String.raw`\dot{v}`}</M> follows directly. <M>{String.raw`J^T f`}</M> is where the contacts enter.
            The forces <M>f</M> are not known in advance, so the constraint solve searches for the <M>f</M> whose
            resulting <M>{String.raw`\dot{v}`}</M> breaks no rule. That search is the small solve at the centre of
            every step, and it grows with the number of contacts.
          </Box>
          <Box variant="p">
            The integrator then turns that acceleration into the next state, the two lines in the figure&apos;s
            last box. Write <M>q_t</M> for the joint positions and <M>v_t</M> for the joint velocities at time{' '}
            <M>t</M>, <M>{String.raw`a_t = \dot{v}`}</M> for the acceleration just found, and <M>h</M> for the
            timestep. The form MuJoCo&apos;s documentation calls standard in physics simulation is semi-implicit
            Euler:
          </Box>
          <Formula
            name="Semi-implicit Euler integration"
            tex={String.raw`\begin{aligned} v_{t+h} &= v_t + h\,a_t \\ q_{t+h} &= q_t + h\,v_{t+h} \end{aligned}`}
            source={<Cite id="F11-201">MuJoCo docs, Computation chapter, numerical integration</Cite>}
          />
          <Box variant="p">
            The first line moves the speed by the acceleration times the timestep. The second moves the position by
            the new speed <M>{String.raw`v_{t+h}`}</M>, where the plain version would use the old one; that single
            change is the &quot;semi-implicit&quot; part. In the figure&apos;s illustration the elbow goes from{' '}
            <Toy>1.000</Toy> to <Toy>1.000 + 0.005 x 2.0 = 1.010</Toy> rad/s, then from <Toy>0.50000</Toy> to{' '}
            <Toy>0.50000 + 0.005 x 1.010 = 0.50505</Toy> rad. Variants of that arithmetic differ in how large a
            timestep they tolerate. MuJoCo recommends its <code>implicitfast</code> integrator for the best
            trade-off of stability and performance.{' '}
            <Cite id="F06-13">MuJoCo docs, choosing timestep and integrator</Cite> The base scene the pick-cube task
            builds on selects it. <Cite id="F06-106">MuJoCo Playground, plane.xml option element</Cite>
          </Box>
          <ExpandableSection headerText="The 26 stages, by group">
            <ul style={LIST}>
              <li>
                <strong>Position.</strong> Where every body is, computed from the joint angles; the inertia matrix;
                collision detection, which builds the list of active contacts (stage 8); the constraint Jacobian
                (stage 9).
              </li>
              <li>
                <strong>Velocity.</strong> Passive forces, and the terms that come from gravity and from the
                bodies&apos; own motion.
              </li>
              <li>
                <strong>Force and acceleration.</strong> Actuator forces, then the constraint forces from the selected
                solver, which update the joint acceleration (stage 22). The result is the vector{' '}
                <code>mjData.qacc</code>, which the documentation calls the main output of the computation.
              </li>
              <li>
                <strong>Integrator.</strong> Advances the state by one timestep.
              </li>
            </ul>
            <Box variant="p">
              <Cite id="F06-9">MuJoCo docs, Computation chapter, stages 1 to 26</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Pick the simulator that fits the job, at the version that is current on 2026-11-20">
            The simulators, November 2026
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Seven names come up. An engine computes the physics step; a framework wraps an engine with tasks, rewards
            and training code. Versions are the newest releases read on 2026-11-20.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={TH}>Simulator</th>
                  <th style={TH}>Version, release date</th>
                  <th style={TH}>Where it runs</th>
                  <th style={TH}>What it is for</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>MuJoCo</td>
                  <td style={TD}>4.0.1, 2026-11-11</td>
                  <td style={TD}>CPU</td>
                  <td style={TD}>
                    One world with the least delay: viewing a model, evaluating one policy. Use 4.0.1; it fixes a
                    4.0.0 fault that gave wrong accelerations.
                  </td>
                  <td style={TD}>
                    <Cite id="F06-1">MuJoCo 4.0.1 release</Cite> <Cite id="F06-2">4.0.1 release notes, bug fixes</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>MJX</td>
                  <td style={TD}>Documented with MuJoCo 4.0.1</td>
                  <td style={TD}>NVIDIA and AMD GPUs, Apple Silicon and Google TPUs (MJX-JAX); NVIDIA GPUs (MJX-Warp)</td>
                  <td style={TD}>
                    MuJoCo behind JAX, Google&apos;s array library for Python. Two engines sit under it: MJX-JAX, a
                    rewrite in JAX, and MJX-Warp, which calls MuJoCo Warp.
                  </td>
                  <td style={TD}>
                    <Cite id="F06-18">MuJoCo docs, MJX chapter</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>MuJoCo Warp</td>
                  <td style={TD}>v4.0.1, 2026-11-11</td>
                  <td style={TD}>NVIDIA GPU; CPU for debugging</td>
                  <td style={TD}>
                    MuJoCo rewritten for many worlds in one batch, in Warp, NVIDIA&apos;s Python framework for GPU
                    code. The engine for reinforcement learning.
                  </td>
                  <td style={TD}>
                    <Cite id="F06-19">mujoco_warp README at v4.0.1</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Newton</td>
                  <td style={TD}>v1.8.0, 2026-11-11</td>
                  <td style={TD}>NVIDIA GPU</td>
                  <td style={TD}>
                    A GPU physics engine on Warp with several solvers, MuJoCo Warp among them; some are still
                    labelled experimental.
                  </td>
                  <td style={TD}>
                    <Cite id="F06-40">Newton v1.8.0 release</Cite>{' '}
                    <Cite id="F06-46">Isaac Lab docs, physics back ends</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Isaac Sim</td>
                  <td style={TD}>6.2.0, 2026-10-14</td>
                  <td style={TD}>NVIDIA GPU (section 13 covers which)</td>
                  <td style={TD}>
                    NVIDIA&apos;s full simulator application: its PhysX physics engine, its RTX renderer and the
                    tooling around them.
                  </td>
                  <td style={TD}>
                    <Cite id="F06-44">Isaac Sim v6.2.0 release</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Isaac Lab</td>
                  <td style={TD}>3.0.0, 2026-10-20</td>
                  <td style={TD}>NVIDIA GPU</td>
                  <td style={TD}>
                    NVIDIA&apos;s robot-learning framework: one way to write a task, run on Newton or on PhysX. Since
                    3.0 it runs without Isaac Sim.
                  </td>
                  <td style={TD}>
                    <Cite id="F06-45">Isaac Lab v3.0.0 release</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>MuJoCo Playground</td>
                  <td style={TD}>1.0.0, 2026-11-06</td>
                  <td style={TD}>NVIDIA GPU, through MuJoCo Warp</td>
                  <td style={TD}>
                    Ready-made tasks and training code, including the {ARM} pick-cube task with paired packages for
                    the simulated and the real arm.
                  </td>
                  <td style={TD}>
                    <Cite id="F06-25">MuJoCo Playground changelog, version 1.0.0</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Why one copy of the scene belongs on a CPU core and thousands belong on a GPU, with the figures behind each">
            What it costs: from one core to a GPU batch
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A physics step is a short piece of code over a small state, full of decisions about which shapes touch.
            A CPU core runs that well. In our measurement, a single run (one run per pass, two passes), a MuJoCo
            humanoid model advanced 57,240 steps per second on one Cortex-X925 core of an NVIDIA DGX Spark and 28,662
            on one Cortex-A725 core of the same machine, both with MuJoCo 4.0.1, and 14,507 on one Cortex-A78AE core
            of an NVIDIA Jetson Orin Nano Super with MuJoCo 3.17.0. The model was a humanoid, not the arm; the
            arm&apos;s own model was not measured. That humanoid also uses a 0.005 s timestep, so the X925 core ran it
            at 57,240 x 0.005 = 286 times real time. <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Box variant="p">
            Reinforcement learning asks for attempts by the thousand, where no single one has to be fast. A <strong>world</strong> is one independent copy of the scene, with its own arm, its own cube and
            its own state; nothing in one world touches another. An <strong>environment</strong> is a world plus the
            task around it, the reward and the reset. MuJoCo Warp counts worlds and Isaac Lab counts environments. On
            a CPU the recipe is one world per thread, with as many threads as the machine has logical cores.{' '}
            <Cite id="F06-14">MuJoCo docs, testspeed</Cite>
          </Box>
          <Box variant="p">
            On a GPU the states of all the worlds are stacked into arrays with one row per world, and each stage of
            the step runs once over the whole array: the same small solve, repeated in every row at the same moment,
            the way a neural network is fed a batch. The price is paid in latency.
            MuJoCo is tuned for the time of one step and MuJoCo Warp for total steps per unit of time, and the
            documentation expects a single step to be slower on MuJoCo Warp than on MuJoCo.{' '}
            <Cite id="F06-16">MuJoCo docs, when to use MuJoCo Warp</Cite>
          </Box>
          <Figure
            cites="F08-61 F08-73 F06-15 F06-20"
            caption={
              <>
                Each bar names its machine, its source and its model. The three top bars are our measurements, one
                run each; the other four are vendor figures. Bars come from different machines, MuJoCo versions and
                dates, and the humanoid model files were not checked to be identical, so compare lengths by order of
                magnitude only.
              </>
            }
          >
            <ThroughputChart />
          </Figure>
          <Box variant="p">
            The bottom bar is the MuJoCo Warp project&apos;s own figure: 5.77 million steps per second for a humanoid
            across 8192 worlds on one RTX 6000 Ada GPU, in a benchmark row dated 2026-09-03.{' '}
            <Cite id="F06-20">MuJoCo Warp nightly benchmarks, humanoid</Cite> Divide it out and each world advances at
            about <Derived>5,770,000 / 8192 = 704</Derived> steps per second. Every world is slow and the batch is
            fast. Against the 57,240 of our single run on one X925 core, a different machine, software version and
            source, the batch is about two orders of magnitude ahead.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>
          </Box>
          <Box variant="p">
            Two things bound the batch. A GPU cannot grow an array in the middle of a step, so every world reserves
            room up front for its worst case: the pick-cube task allows 64 contacts and 256 constraints per world.{' '}
            <Cite id="F06-105">MuJoCo Playground, pick-cube task.py</Cite> And collision detection is branching code,
            which GPUs run poorly, so contacts set the price there too.{' '}
            <Cite id="F06-17">MuJoCo docs, MJX chapter, scenes with many contacts</Cite> On the same GPU the project
            reports 25.2 million steps per second for an idle Franka Panda arm, a common research arm, at 32768
            worlds, and 342 thousand for a cluttered two-arm table scene at 2048 worlds.{' '}
            <Cite id="F06-20">MuJoCo Warp nightly benchmarks, Franka and Aloha clutter</Cite> Memory is the mild
            part: 466 MB for the 8192 humanoid worlds, about 57 KB per world, by our arithmetic from the same data.{' '}
            <Cite id="F06-22">MuJoCo Warp nightly benchmarks, total_memory</Cite>
          </Box>
          <ExpandableSection headerText="Raw physics against a whole training run">
            <Box variant="p">
              A training run is slower than raw physics, because the policy and its update share the GPU. Isaac
              Lab&apos;s release benchmark reports 318,651 training frames per second for a Franka arm lifting a cube
              with 8,192 environments on Newton&apos;s MuJoCo Warp solver, and 164,777 on PhysX, on one RTX PRO 6000
              Blackwell Server Edition. <Cite id="F06-47">Isaac Lab v3.0.0 benchmark file</Cite>
            </Box>
          </ExpandableSection>
          <Box variant="p">
            The two routes load different parts of the machine. CPU physics loads cores and no GPU. GPU physics loads
            the GPU&apos;s general compute and its memory, and with no camera it needs none of the ray-tracing
            hardware of section 13: the Isaac Lab install guide says &quot;Headless Newton simulation does not require
            RTX hardware&quot;, headless meaning no window and no camera images.{' '}
            <Cite id="F06-51">Isaac Lab v3.0.0 installation guide</Cite>
          </Box>
          <Box variant="p">
            So the choice follows the job. To look at the arm, debug its model or evaluate one policy, run MuJoCo on a
            CPU core. To train with reinforcement learning, run thousands of worlds on one GPU through MuJoCo Warp,
            which is what the Playground pick-cube task does. Once the policy has to see, the next cost is the camera:
            section 13, Rendering and Ray Tracing.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
