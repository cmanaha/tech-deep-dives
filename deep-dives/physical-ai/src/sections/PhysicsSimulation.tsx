import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Toy, Derived } from '../components/Cite';
import { Figure, AnimatedFigure } from '../components/Figure';
import { Formula, M } from '../components/Math';
import { PhysStep, PHYS_STEP_STEPS } from '../components/figures/PhysStep';
import { log10Scale } from '../lib/scale';
import { ARM, SIM_TASK, SIM_TASK_PLAIN, TASK_STORY } from '../lib/task';
import { Capture, MUJOCO_SO101 } from '../components/Capture';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const CPU_FILL = '#e8f1fb';
const CPU_INK = '#1f5fa8';
const GPU_FILL = '#e6f6ea';
const GPU_INK = '#1e7b3a';
const NEUTRAL_INK = '#5f6b7a';

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/** The shipped state-only sibling of the vision task. */
const SIM_TASK_STATE = 'SO101PickCube';

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
            description="Count the physics steps in a simulated second, and choose between CPU cores and a GPU batch from the number of scenes a job runs at once (MuJoCo 4.0.1, MuJoCo Playground 1.0 and our own single-run measurements, read 2026-11-20)"
          >
            12. Physics Simulation: When to Use CPU Cores and When to Use a GPU
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One step of a physics simulator is a small computation that has to run in order. The scene&apos;s state,
            a short list of numbers, passes through a fixed sequence of stages, each needing the result of the one
            before, and how much work the stages do depends on which shapes happen to be touching. A single CPU
            core runs that kind of work well. A GPU given one scene has little to run side by side, and it pays
            only when thousands of independent copies of the scene advance together.
          </Box>
          <Box variant="p">
            So the number of scenes a job steps at once picks its hardware. MuJoCo 4.0.1 (Google DeepMind&apos;s
            open-source physics simulator) advanced a humanoid scene at 57,240 steps per second on one Cortex-X925
            core of an NVIDIA DGX Spark: our measurement, a single run, with the humanoid standing in for the{' '}
            {ARM} arm, whose own scene was not measured. Each step of that scene covers 0.005 s of simulated time,
            so the core ran 57,240 x 0.005 = 286 times faster than real time. Viewing the simulated arm and trying
            one policy on it (the policy is the trained model that decides what the motors do next) are one-scene
            jobs, and a core is the place for them. <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>{' '}
            <Cite id="F06-16">MuJoCo docs, when to use MuJoCo Warp</Cite>
          </Box>
          <Box variant="p">
            Reinforcement learning (RL), which improves a policy from its own scored attempts, is the other kind of
            job, because it consumes attempts in bulk. The recipe that MuJoCo Playground, DeepMind&apos;s suite of
            ready-made robot tasks, ships for this arm runs 4,096 simulated arms side by side and collects
            196,608,000 decisions by the policy (section 8, Reinforcement Learning for Robots). The physics steps 20
            times between one decision and the next, so the recipe costs 196,608,000 x 20 = about{' '}
            <Derived>3.9 billion</Derived> physics steps. No attempt needs data from another, and none has to
            finish quickly. <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>{' '}
            <Cite id="F06-105">MuJoCo Playground simulation config and SO-101 task.py</Cite>
          </Box>
          <Box variant="p">
            A GPU serves that demand by stepping many copies in one batch. The MuJoCo Warp project, which maintains
            the version of MuJoCo written for NVIDIA GPUs, reports 5.77 million steps per second for a humanoid on
            one RTX 6000 Ada stepping 8192 copies together (benchmark row of 2026-09-03). Each copy gets{' '}
            <Derived>5,770,000 / 8192 = 704</Derived> steps per second, about <Derived>80</Derived> times slower
            than the copy on the core, and the batch as a whole does the work of about a hundred such cores. The two
            figures come from different machines, software versions and sources, so these ratios hold to an order
            of magnitude and no finer. <Cite id="F06-20">MuJoCo Warp nightly benchmarks, humanoid</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Turn a timestep into calls per simulated second, and read a steps-per-second figure for what it counts"
          >
            A simulator is one function, and the arm&apos;s task calls it 200 times per simulated second
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Behind any picture of the simulated {ARM} is the <strong>state</strong>: every number needed to
            continue the scene from this instant. For the arm that is six joint angles and six joint speeds, one
            pair per servo. For the cube it is a position, an orientation and how fast each is changing. Speeds
            belong in it because an arm at rest and an arm swinging through the same pose are in different places
            a moment later.
          </Box>
          <Box variant="p">
            The simulator is a function from that state and the motor commands to the state a short moment later.
            The moment is the <strong>timestep</strong>, and one call is a physics step. Nothing in a list of
            numbers stops a cube from sinking through a floor or a finger from passing through the cube, so each
            step has to compute the forces that make the numbers behave like solid objects.
          </Box>
          <Box variant="p">
            The scene is loaded from a model, which in a simulator means a text file of typed-in values: every
            link, joint and servo, and the shape of every part (section 14, Sim-to-Real and Real-to-Sim, measures
            them against the real arm). MuJoCo Menagerie, DeepMind&apos;s model library, carries one for this arm,
            derived from the hardware maker&apos;s file. It describes the gripper and the arm twice, as detailed
            meshes for the picture and as simple added shapes for the physics, so the contacts a step finds come
            from the simple shapes, whatever the render shows.{' '}
            <Cite id="F06-37">MuJoCo Menagerie, robotstudio_so101 README</Cite>
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
                A grasp as the simulator holds it, with the bodies drawn transparent. Each disc is a point where two
                shapes touch, and each arrow is the force the step computed there to keep them from passing through
                each other.
              </>
            }
            provenance={MUJOCO_SO101}
          />
          <Box variant="p">
            MuJoCo&apos;s default timestep is 0.002 s, so a simulated second costs{' '}
            <Derived>1 / 0.002 = 500</Derived> calls. The task MuJoCo Playground 1.0 ships for this arm,{' '}
            <code>{SIM_TASK}</code>, teaches the arm to {SIM_TASK_PLAIN}, the first half of the bench task (
            {TASK_STORY}), and it steps every 0.005 s, 2.5 times coarser: 1 / 0.005 = 200 calls, the same simulated
            second for <Derived>40%</Derived> of the work.{' '}
            <Cite id="F06-10">MuJoCo XML reference, option/timestep</Cite>{' '}
            <Cite id="F06-25">MuJoCo Playground changelog, version 1.0.0</Cite>{' '}
            <Cite id="F06-105">MuJoCo Playground, reaf_sim config.py and SO-101 task.py</Cite>
          </Box>
          <Box variant="p">
            The timestep is the single most important setting in the trade between speed and accuracy. Halve it
            and every simulated second costs twice the calls; set it too large and the simulation becomes
            unstable, its errors growing from one step to the next, while too small a value spends CPU time for no
            meaningful gain in accuracy. Real time sets a bar of its own: one step&apos;s CPU time has to be shorter
            than the timestep. <Cite id="F06-10">MuJoCo XML reference, option/timestep</Cite>{' '}
            <Cite id="F06-13">MuJoCo docs, choosing timestep and integrator</Cite>
          </Box>
          <Box variant="p">
            The policy decides less often than the physics steps. In that task it sees a camera image and acts
            every 100 ms, 10 times a second, so the physics runs 0.1 / 0.005 = 20 steps, called{' '}
            <strong>substeps</strong>, between two decisions. The sibling task whose policy reads joint angles in
            place of an image, <code>{SIM_TASK_STATE}</code>, acts every 20 ms: 0.02 / 0.005 = 4 substeps and{' '}
            <Derived>1 / 0.02 = 50</Derived> decisions a second, over the same 200 physics steps. A
            steps-per-second figure has to be read for its unit: a physics benchmark counts the 200, and the RL
            recipe&apos;s 196,608,000 are decisions of 20 physics steps each.{' '}
            <Cite id="F06-105">MuJoCo Playground, reaf_sim config.py and SO-101 task.py</Cite>{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>
          </Box>
          <Box variant="p">
            Keep the control period a whole number of timesteps. Playground&apos;s environment code divides the
            period by the timestep and keeps <code>round(timestep_ratio)</code> substeps, so a period that does not
            divide becomes a different period. The real arm&apos;s clock ticks 30 times a second, a 33.3
            ms period (section 3, The Robot as a Computer), and <Derived>0.0333 / 0.005 = 6.67</Derived> rounds to
            7 substeps, so a policy asked for 30 decisions a second would act every{' '}
            <Derived>7 x 5 = 35</Derived> ms, <Derived>1 / 0.035 = 28.6</Derived> times a second. Both shipped
            tasks pick periods that divide exactly, 100 ms and 20 ms.{' '}
            <Cite id="F06-105">MuJoCo Playground, reaf_sim device_layer.py</Cite>{' '}
            <Cite id="F07-23">LeRobot inference docs, cadence at 30 Hz</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Follow one call from the old state to the new one, and see why contact turns a direct calculation into a search"
          >
            Each stage of a step waits for the one before, and contacts turn the force stage into a search
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            MuJoCo&apos;s step function is <code>mj_step</code>, 26 stages in four groups: position, velocity, force and acceleration, and the integrator. In the position group,{' '}
            <strong>collision detection</strong> searches for every place where two shapes touch, and each such
            place is a <strong>contact</strong>: a finger on the cube, the cube on the floor. Each contact becomes
            a <strong>constraint</strong>, a rule the next state has to obey: these two shapes do not pass through
            each other, and they slide only when friction is overcome. In the force group, the{' '}
            <strong>constraint solve</strong> finds the forces that keep every rule true, and with them the
            acceleration of every joint. The <strong>integrator</strong> then advances every speed and every
            position by one timestep. <Cite id="F06-9">MuJoCo docs, Computation chapter, simulation pipeline</Cite>
          </Box>
          <Box variant="p">
            The order is forced: the solve cannot start until collision detection has listed the contacts, the
            integrator cannot start until the solve has produced the accelerations, and the next step starts from
            the state this one returns. One scene hands a processor a chain of small tasks, with little to run side
            by side.
          </Box>
          <AnimatedFigure
            name="one physics step"
            steps={PHYS_STEP_STEPS}
            intervalMs={3600}
            cites="F06-9 F06-105"
            caption={
              <>
                Each frame lights the group that is running and draws what it adds to a grasp flattened to two
                dimensions: contacts, speeds, known forces, then the forces the solve finds. The joint values, the
                three contacts and the size of the overlap are illustrative, not measured; the 5 ms timestep and the
                200 steps per second are the pick-cube task&apos;s.
              </>
            }
          >
            {(step, reduced) => <PhysStep step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            The solve is where a grasp gets its forces. The floor pushes up on the cube exactly as hard as it
            takes to stop it sinking, and each finger pushes exactly as hard as it takes to stop passing into it.
            Those forces depend on one another (squeeze harder with one finger and the force at the other
            changes), so the simulator finds them together, by an iterative search inside every step.
            Playground&apos;s simulation config exposes the solver and its iteration limits as{' '}
            <code>solver</code>, <code>iterations</code> and <code>ls_iterations</code> (the line-search steps
            inside each iteration); the pick-cube task sets
            none of them, so MuJoCo&apos;s defaults apply.{' '}
            <Cite id="F06-106">MuJoCo Playground, reaf_sim config.py, Sim class</Cite>
          </Box>
          <Box variant="p">
            Underneath is force equals mass times acceleration, written for a machine made of joints, with the
            constraint forces as a second unknown. The symbols follow MuJoCo&apos;s own names:
          </Box>
          <ul style={LIST}>
            <li>
              <M>{String.raw`\dot{v}`}</M>: the acceleration of every joint, the unknown the step is after. The dot
              means &quot;rate of change of&quot;, and <M>v</M> is the joint velocities. MuJoCo stores the result as{' '}
              <code>qacc</code>.
            </li>
            <li>
              <M>M</M>: the inertia matrix, the &quot;mass&quot; of a jointed body. A single rigid body has one mass.
              A jointed body needs a table, because the links carry each other: accelerating the shoulder also has
              to move the forearm.
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
              <M>f</M> and <M>J</M>: <M>f</M> is the constraint forces, also unknown. On this task they come from
              the contacts and from the dry friction the scene sets inside each joint, and joint limits are
              constraints too. <Cite id="F11-211">MuJoCo docs, Computation chapter, constraint model</Cite>{' '}
              <M>J</M>, the constraint Jacobian, is a table with one row per constraint that says how far each
              joint&apos;s motion moves it, for example how far it moves a contact point; transposed (
              <M>{String.raw`J^T`}</M>), it converts a constraint force into forces at the joints.
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
            motors and damping contribute; with no active constraint that settles the equation, and{' '}
            <M>{String.raw`\dot{v}`}</M> follows in one direct calculation. <M>{String.raw`J^T f`}</M> is where
            the constraints enter. The forces <M>f</M> are unknown until the solve has searched for the <M>f</M>{' '}
            whose resulting <M>{String.raw`\dot{v}`}</M> breaks no rule, so every active constraint turns the
            calculation into a search. On this arm there is always something to search for, because the scene
            writes a friction loss, the dry-friction limit, onto every joint; a grasp adds its contacts.{' '}
            <Cite id="F11-211">MuJoCo docs, Computation chapter, friction loss</Cite>{' '}
            <Cite id="F11-212">MuJoCo Playground, SO-101 scene.py</Cite>
          </Box>
          <Box variant="p">
            The integrator turns that acceleration into the next state. Write <M>q_t</M> for the joint positions
            and <M>v_t</M> for the joint velocities at time <M>t</M>, <M>{String.raw`a_t = \dot{v}`}</M> for the
            acceleration just found, and <M>h</M> for the timestep. The form that is standard in physics
            simulation is semi-implicit Euler:
          </Box>
          <Formula
            name="Semi-implicit Euler integration"
            tex={String.raw`\begin{aligned} v_{t+h} &= v_t + h\,a_t \\ q_{t+h} &= q_t + h\,v_{t+h} \end{aligned}`}
            source={<Cite id="F11-201">MuJoCo docs, Computation chapter, numerical integration</Cite>}
          />
          <Box variant="p">
            The first line moves the speed by the acceleration times the timestep. The second moves the position by
            the new speed <M>{String.raw`v_{t+h}`}</M>, where the plain version would use the old one; that single
            change is the &quot;semi-implicit&quot; part. With illustrative numbers, an elbow turning at{' '}
            <Toy>1.000</Toy> rad/s under an acceleration of <Toy>2.0</Toy> rad/s² goes to{' '}
            <Toy>1.000 + 0.005 x 2.0 = 1.010</Toy> rad/s, and its angle from <Toy>0.50000</Toy> to{' '}
            <Toy>0.50000 + 0.005 x 1.010 = 0.50505</Toy> rad.
          </Box>
          <Box variant="p">
            Both lines hold the acceleration fixed for the whole of <M>h</M>. A stiff force, one that changes
            quickly with position or speed, is therefore applied at its start-of-step value for the full timestep,
            and the larger <M>h</M> is, the further the new state lands from where that force would have taken it.
            The next step starts from that error. When each step&apos;s error is larger than the last, the
            simulation is unstable, and a larger <M>h</M> makes every error larger.{' '}
            <Cite id="F06-13">MuJoCo docs, choosing timestep and integrator</Cite>
          </Box>
          <Box variant="p">
            The pick-cube task changes the velocity line. Its base scene selects <code>implicitfast</code> on its{' '}
            <code>option</code> element, beside the timestep (
            <code>timestep=&quot;0.005&quot; integrator=&quot;implicitfast&quot;</code>), the integrator MuJoCo
            recommends as usually the best trade-off of stability and performance.{' '}
            <Cite id="F06-13">MuJoCo docs, choosing timestep and integrator</Cite>{' '}
            <Cite id="F06-106">MuJoCo Playground, plane.xml option element</Cite> <code>implicitfast</code> keeps
            the position line. In the velocity line it rescales the acceleration by a matrix built from how the
            speed-dependent forces, such as damping, change with speed, which approximates an update that uses the
            acceleration at the new speed in place of the old one.{' '}
            <Cite id="F11-210">MuJoCo docs, Computation chapter, implicit velocity update</Cite>
          </Box>
          <ExpandableSection headerText="What each of the four stage groups computes">
            <ul style={LIST}>
              <li>
                <strong>Position.</strong> Where every body is, computed from the joint angles; the inertia matrix;
                collision detection, which builds the list of active contacts; the constraint Jacobian.
              </li>
              <li>
                <strong>Velocity.</strong> Passive forces, and the terms that come from gravity and from the
                bodies&apos; own motion.
              </li>
              <li>
                <strong>Force and acceleration.</strong> Actuator forces, then the constraint forces from the selected
                solver, which update the joint acceleration. The result is the vector{' '}
                <code>mjData.qacc</code>.
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
          <Header
            variant="h2"
            description="See why loose objects set a scene's cost, and know the two settings to change when a grasp goes unstable"
          >
            Contacts set the cost of a step and the limit on its timestep
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Loose objects set a scene&apos;s cost. MuJoCo can simulate most robotic systems a lot faster than real
            time, and the models it names as demanding are those with many floating objects, &quot;resulting in
            many contacts&quot;. On the pick-cube task the cube is the floating object. <Cite id="F06-11">MuJoCo XML reference, option/timestep</Cite>
          </Box>
          <Box variant="p">
            Finding the contacts is a search that prunes. Testing every pair of shapes in detail &quot;is
            prohibitively expensive for large systems&quot;, so MuJoCo works in three phases: a broad phase picks
            out the pairs of bodies that could be touching, a mid phase narrows the search inside each of those
            pairs, and a near phase tests the surviving shapes in detail and returns the contacts.{' '}
            <Cite id="F06-12">MuJoCo docs, Computation chapter, collision detection</Cite> Every cut is a branch,
            a decision taken on this step&apos;s positions about which code runs next, so the work in a step
            differs from the step before it, and from the same step in another copy of the scene.
          </Box>
          <Box variant="p">
            The MuJoCo Warp project&apos;s benchmark rows for one RTX 6000 Ada show the range: 25.2 million steps
            per second for an idle Franka Panda arm at 32768 copies of the scene, 2.51 million for a two-arm robot
            handling a pot at 8192, and 342 thousand for the same two-arm robot at a table cluttered with objects,
            at 2048. Per copy that is <Derived>25,200,000 / 32768 = 769</Derived>,{' '}
            <Derived>2,510,000 / 8192 = 306</Derived> and <Derived>342,000 / 2048 = 167</Derived> steps per
            second. Robot, contacts and batch size all change between the rows, so they give a range and no single
            price per contact: from the idle arm to the cluttered table, each copy runs{' '}
            <Derived>769 / 167 = 4.6</Derived> times slower.{' '}
            <Cite id="F06-20">MuJoCo Warp nightly benchmarks, Franka, Aloha pot and Aloha clutter</Cite>
          </Box>
          <Box variant="p">
            Contacts also limit the timestep, through how stiff the constraints are: stability depends on the
            constraint solver&apos;s settings as well as on the timestep, and softer constraints can be simulated
            with larger timesteps.{' '}
            <Cite id="F06-11">MuJoCo XML reference, option/timestep</Cite> The Menagerie model of this arm ships
            contact solver defaults for the gripper &quot;that work well for manipulation&quot;, which is a reason
            to start from that file. <Cite id="F06-37">MuJoCo Menagerie, robotstudio_so101 README</Cite>
          </Box>
          <Box variant="p">
            Besides the timestep, the integrator is the setting to change. <code>implicitfast</code> is the general
            recommendation, and
            MuJoCo ships a further integrator, <code>discrete</code>, for the case &quot;when stiff springs, position
            servos or strong damping interact with contacts&quot;. <Cite id="F06-13">MuJoCo docs, choosing timestep and integrator</Cite> Each {ARM} joint
            is a position servo in the model, with a gain between 218 and 265 identified from the real arm, and the
            task is a grasp: that case exactly. Both the Menagerie model and the pick-cube scene
            select <code>implicitfast</code>, the general choice, so <code>discrete</code> is the integrator the
            documentation names for this case, and the one to try when a grasp goes unstable. <Cite id="F06-31">MuJoCo Playground, SO-101 servo constants</Cite>{' '}
            <Cite id="F06-37">MuJoCo Menagerie, robotstudio_so101 README</Cite>{' '}
            <Cite id="F06-106">MuJoCo Playground, plane.xml option element</Cite>
          </Box>
          <Box variant="p">
            A simulation of this arm that goes unstable at 0.005 s has two documented changes to make, and both
            go through Playground&apos;s <code>Sim</code> config, which writes its own timestep over the one in
            that <code>option</code> element: a smaller <code>simulation_timestep</code>, paid for in calls per
            simulated second, or the <code>discrete</code> integrator, set in its <code>integrator</code> field. Rule out the simulator itself first: MuJoCo
            4.0.0 shipped a fault in a matrix factorisation that one of its constraint solvers relies on when the
            constraint Jacobian <M>J</M> is sparse, &quot;causing slow convergence, wrong accelerations and divergence&quot;, and 4.0.1 fixed it. Pin 4.0.1. <Cite id="F06-105">MuJoCo Playground, reaf_sim config.py</Cite>{' '}
            <Cite id="F06-106">MuJoCo Playground, Sim config</Cite>{' '}
            <Cite id="F06-1">MuJoCo 4.0.1 release</Cite> <Cite id="F06-2">4.0.1 release notes, bug fixes</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read a GPU figure as a batch total, and see how many cores a batch of 8192 worlds replaces"
          >
            A GPU steps thousands of worlds at once, and each of them slowly
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The unit of a batch is the <strong>world</strong>: one independent copy of the scene, with its own
            arm, its own cube and its own state; nothing in one world touches another. An{' '}
            <strong>environment</strong> is a world plus the task around it, the reward and the reset. MuJoCo Warp
            counts worlds, and Isaac Lab, NVIDIA&apos;s robot-learning framework, counts environments. On a CPU the
            recipe is one world per thread, with as many threads as the machine has logical cores.{' '}
            <Cite id="F06-14">MuJoCo docs, testspeed</Cite>
          </Box>
          <Box variant="p">
            A GPU holds the states of all the worlds as arrays with one row per world and runs each stage of the
            step once over the whole array. That layout buys throughput with latency: MuJoCo is tuned for latency,
            the time of one step, and MuJoCo Warp for throughput, the total steps per unit of time, and a single
            step is expected to be slower on MuJoCo Warp than on MuJoCo. <Cite id="F06-16">MuJoCo docs, when to use MuJoCo Warp</Cite>
          </Box>
          <Box variant="p">
            Contacts cost a batch in two ways, and the first is memory reserved in advance. Every world has its own
            contacts on every step,
            and a GPU cannot grow an array in the middle of a step, so each world reserves room up front for its
            worst case: the pick-cube task allows 64 contacts and 256 constraints, the rows of <M>J</M>, per world
            (<code>nconmax=64</code> and <code>njmax=256</code>).{' '}
            <Cite id="F06-105">MuJoCo Playground, pick-cube task.py</Cite> Memory and computation both scale with
            those two limits, so every world pays for the capacity of the busiest one, and MuJoCo&apos;s
            documentation advises setting them as small as possible without the simulation exceeding them.{' '}
            <Cite id="F06-23">MuJoCo docs, MuJoCo Warp chapter, performance tuning</Cite>
          </Box>
          <Box variant="p">
            The second is the search. Accelerators run branching code poorly, and the broad phase branches on each
            world&apos;s positions, so the copies in a batch stop doing the same work. MJX-JAX, MuJoCo re-implemented in JAX (Google&apos;s array library for Python), answers with a
            broad phase without branches, less powerful than MuJoCo&apos;s, and its throughput falls faster than
            CPU MuJoCo&apos;s as contacts are added. <Cite id="F06-17">MuJoCo docs, MJX chapter, scenes with many contacts</Cite>{' '}
            In MuJoCo&apos;s own figures for one humanoid, MJX-JAX reached 950 thousand steps per second on
            one NVIDIA A100 at a batch of 8192, and CPU MuJoCo 1.8 million on a 64-core AMD 3995WX at two threads
            per core. <Cite id="F06-15">MuJoCo docs, MJX chapter, humanoid throughput</Cite> MuJoCo Warp, the
            rewrite for NVIDIA GPUs, is described as &quot;resolving several performance bottlenecks exhibited in
            MJX-JAX&quot;. <Cite id="F06-18">MuJoCo docs, MJX chapter</Cite>
          </Box>
          <Figure
            cites="F08-61 F08-73 F06-15 F06-20"
            caption={
              <>
                One core steps a humanoid tens of thousands of times a second; a whole CPU or a GPU batch steps it
                650 thousand to 5.77 million times, and the JAX engine on an A100 falls below the 64-core CPU. The
                top three bars are our single runs, the rest vendor figures from other machines and MuJoCo versions,
                and the humanoid model files were not checked to be identical, so compare lengths by order of
                magnitude only.
              </>
            }
          >
            <ThroughputChart />
          </Figure>
          <Box variant="p">
            Set against whole machines, the batch is worth a few large CPUs. At the rate of our single run on one
            X925 core (DGX Spark, MuJoCo 4.0.1, humanoid stand-in), the 5.77 million of the batch is about a
            hundred such cores (<Derived>5,770,000 / 57,240 = 101</Derived>), and the 64-core workstation of the MuJoCo
            documentation, at 1.8 million, comes within <Derived>5.77 / 1.8 = 3.2</Derived> times of it. Divided by
            those three humanoid rates, the RL recipe&apos;s <Derived>3,932,160,000</Derived> physics steps would
            take about <Derived>11</Derived> minutes on the GPU batch, about <Derived>36</Derived> minutes on the workstation and
            about <Derived>19</Derived> hours on the one core. <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>{' '}
            <Cite id="F06-20">MuJoCo Warp nightly benchmarks, humanoid</Cite>{' '}
            <Cite id="F06-15">MuJoCo docs, MJX chapter, humanoid throughput</Cite>
          </Box>
          <Box variant="p">
            Physics without cameras is cheap in memory: the same benchmark data give 466 MB for the 8192 humanoid
            worlds, about 57 KB per world, on a card with 48 GB. The two-arm robot needs about 84 KB per world with
            the pot and 468 KB at the cluttered table, <Derived>468 / 84 = 5.6</Derived> times more, and even at
            468 KB a 48 GB card holds about <Derived>48,000,000 / 468 = 100,000</Derived> worlds if memory grows in
            proportion, far past the recipe&apos;s 4,096. Physics memory does not bind at these counts; the vision
            recipe&apos;s camera memory is section 13&apos;s to price. MuJoCo
            Warp&apos;s documentation warns that &quot;simulation throughput is often limited by memory requirements
            for large numbers of worlds&quot;, and computation scales with the per-world limits too, so tight limits
            pay in steps per second.{' '}
            <Cite id="F06-22">MuJoCo Warp nightly benchmarks, total_memory</Cite>{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>{' '}
            <Cite id="F06-20">MuJoCo Warp nightly benchmarks, system</Cite>{' '}
            <Cite id="F06-23">MuJoCo docs, MuJoCo Warp chapter, memory</Cite>
          </Box>
          <Box variant="p">
            A steps-per-second figure counts raw physics only, and a training run shares the GPU with the policy and
            its update. The first MuJoCo Playground paper, which ran MJX physics on an RTX 4090, reports physics
            at 24% of training time, rendering at 18% and the policy update at 57% for a Franka pick task with a
            camera. Halving the physics time would shorten that run by <Derived>12%</Derived>, and removing it
            altogether by 24%, so the hundred-core comparison prices the physics and not the run.{' '}
            <Cite id="F06-33">MuJoCo Playground paper, appendix D.3</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Install MuJoCo to view the arm and score one policy, and MuJoCo Warp to train; know which engine MJX or Isaac Lab runs for you"
          >
            Two programs cover this arm: MuJoCo on a core, MuJoCo Warp on a GPU
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            MuJoCo 4.0.1 on a CPU steps one world with the least delay: use it to view the model and to run one
            policy.
            MuJoCo Warp on an NVIDIA GPU is the engine for RL, and MuJoCo Playground 1.0 is the ready-made route to
            it, with tasks, training code and paired packages for the simulated and the real {ARM}.{' '}
            <Cite id="F06-16">MuJoCo docs, when to use MuJoCo Warp</Cite>{' '}
            <Cite id="F06-25">MuJoCo Playground changelog, version 1.0.0</Cite>
          </Box>
          <Box variant="p">
            Two other names turn up in robot-learning code, and each hides a choice of engine. MJX is an interface
            in JAX over two engines, so the name no longer means only the JAX rewrite: MJX-JAX runs on NVIDIA and
            AMD GPUs, Apple Silicon and Google TPUs, and MJX-Warp, which calls MuJoCo Warp, on NVIDIA GPUs.{' '}
            <Cite id="F06-18">MuJoCo docs, MJX chapter</Cite> Isaac Lab 3.0 runs one task definition on Newton, a
            GPU engine that offers MuJoCo Warp as one of several solvers, or on PhysX, NVIDIA&apos;s own engine,
            and no longer needs Isaac Sim, the full application around PhysX and the RTX renderer.{' '}
            <Cite id="F06-46">Isaac Lab docs, physics back ends</Cite>{' '}
            <Cite id="F06-45">Isaac Lab v3.0.0 release</Cite>
          </Box>
          <Box variant="p">
            On a Franka arm lifting a cube in Isaac Lab, that choice is worth a factor of about two in speed and
            nearly three in memory. Isaac Lab&apos;s release benchmark reports 318,651 training frames per second
            on Newton&apos;s MuJoCo Warp solver against 164,777 on PhysX, and 5.41 GB of GPU memory for the whole
            training process against 14.74 GB, for that task in 8,192 environments on one RTX PRO 6000 Blackwell
            Server Edition. The
            unit is the benchmark&apos;s own training frame, counted with the policy&apos;s updates included: it
            compares the two engines with each other and cannot be set beside a physics benchmark&apos;s steps per
            second. <Cite id="F06-47">Isaac Lab v3.0.0 benchmark file</Cite>
          </Box>
          <ExpandableSection headerText="Newest releases read on 2026-11-20, ranked by how directly this arm uses them">
            <SpaceBetween size="s">
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
                        One world with the least delay: viewing a model, evaluating one policy. Use 4.0.1; it fixes
                        a 4.0.0 fault that gave wrong accelerations.
                      </td>
                      <td style={TD}>
                        <Cite id="F06-1">MuJoCo 4.0.1 release</Cite>{' '}
                        <Cite id="F06-2">4.0.1 release notes, bug fixes</Cite>
                      </td>
                    </tr>
                    <tr>
                      <td style={TD}>MuJoCo Warp</td>
                      <td style={TD}>v4.0.1, 2026-11-11</td>
                      <td style={TD}>NVIDIA GPU; CPU for debugging</td>
                      <td style={TD}>
                        MuJoCo rewritten for many worlds in one batch, in Warp, NVIDIA&apos;s Python framework for
                        GPU code. The engine for reinforcement learning.
                      </td>
                      <td style={TD}>
                        <Cite id="F06-19">mujoco_warp README at v4.0.1</Cite>
                      </td>
                    </tr>
                    <tr>
                      <td style={TD}>MuJoCo Playground</td>
                      <td style={TD}>1.0.0, 2026-11-06</td>
                      <td style={TD}>NVIDIA GPU, through MuJoCo Warp</td>
                      <td style={TD}>
                        Ready-made tasks and training code, including the {ARM} pick-cube task with paired packages
                        for the simulated and the real arm.
                      </td>
                      <td style={TD}>
                        <Cite id="F06-25">MuJoCo Playground changelog, version 1.0.0</Cite>
                      </td>
                    </tr>
                    <tr>
                      <td style={TD}>MJX</td>
                      <td style={TD}>Documented with MuJoCo 4.0.1</td>
                      <td style={TD}>
                        NVIDIA and AMD GPUs, Apple Silicon and Google TPUs (MJX-JAX); NVIDIA GPUs (MJX-Warp)
                      </td>
                      <td style={TD}>
                        MuJoCo behind JAX, Google&apos;s array library for Python. Two engines sit under it:
                        MJX-JAX, a rewrite in JAX, and MJX-Warp, which calls MuJoCo Warp.
                      </td>
                      <td style={TD}>
                        <Cite id="F06-18">MuJoCo docs, MJX chapter</Cite>
                      </td>
                    </tr>
                    <tr>
                      <td style={TD}>Isaac Lab</td>
                      <td style={TD}>3.0.0, 2026-10-20</td>
                      <td style={TD}>NVIDIA GPU</td>
                      <td style={TD}>
                        NVIDIA&apos;s robot-learning framework: one way to write a task, run on Newton or on PhysX.
                        Since 3.0 it runs without Isaac Sim.
                      </td>
                      <td style={TD}>
                        <Cite id="F06-45">Isaac Lab v3.0.0 release</Cite>
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
                  </tbody>
                </table>
              </div>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Decide between cores and a GPU from the world count, after timing your own scene on one core"
          >
            Buy fast cores first and a GPU for thousands of worlds; physics alone needs no ray-tracing hardware
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            CPU physics is bound by the core. In our single runs on the DGX Spark with MuJoCo 4.0.1, 0.4% of the
            X925 core&apos;s cycles stepping the humanoid were stalls on memory, against 22.4% on the same core for
            a stand-in for policy inference (a stack of matrix-vector products), and the Spark&apos;s slower
            Cortex-A725 core stepped the humanoid at 28,662 steps per second, half the rate. The core is the part this job exhausts first, so buy CPU
            physics by the speed of one core, then by the number of cores, since worlds that share nothing go one
            to a thread. That is also what lets an evaluation run as hundreds of independent episodes, each one
            attempt at the task (section 16, Evaluation). <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-62">our profiling report, policy step table</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Box variant="p">
            Physics alone needs ordinary GPU compute and memory, and none of the ray-tracing hardware a simulated
            camera can call for. For Newton the Isaac Lab install guide says so in one line, &quot;Headless Newton simulation
            does not require RTX hardware&quot;, headless meaning no window and no camera images, and its default
            CUDA 13 stack needs an NVIDIA GPU of the Turing generation (compute capability 7.5) or newer. The vision task&apos;s camera is a
            separate cost, and section 13, Rendering and Ray Tracing, prices it. <Cite id="F06-100">GPU physics, what it loads</Cite>{' '}
            <Cite id="F06-51">Isaac Lab v3.0.0 installation guide</Cite> The CPU beside the GPU still counts: the
            Isaac Lab paper&apos;s authors write that throughput can also depend on single-core CPU performance,
            through parts of PhysX and the main training loop.{' '}
            <Cite id="F06-65">Isaac Lab paper, section 4.1</Cite>
          </Box>
          <Box variant="p">
            Time your own scene on one core before you choose an instance. MuJoCo&apos;s <code>testspeed</code>{' '}
            rolls a model out for 10,000 steps by default and prints the CPU time with the contact and constraint
            counts; with <code>--nthread</code> set to your logical cores it times the one-world-per-thread recipe.{' '}
            <Cite id="F06-14">MuJoCo docs, testspeed</Cite> Steps per second times your timestep is how far ahead
            of real time one core runs, and for a job of one world that settles it. No figure read on 2026-11-20
            times one scene at several world counts, so the crossover for your scene is a measurement too: run the
            threaded recipe on the cores you would buy and set its rate beside the batch, about a hundred X925
            cores&apos; worth on the humanoid. The batch is the buy when it delivers more steps per unit of price
            than those cores.{' '}
            <Cite id="F06-20">MuJoCo Warp nightly benchmarks, humanoid</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
