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

const OUR_RUN_4 = 'Our single run, MuJoCo 4.0.1, humanoid';

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
        source: 'Our single run, MuJoCo 3.17.0, humanoid',
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
        source: 'Vendor figure, MuJoCo documentation, humanoid',
      },
      {
        value: 1800000,
        shown: '1.8 million',
        machine: 'AMD 3995WX, 64 cores, 128 threads',
        source: 'Vendor figure, MuJoCo documentation, humanoid',
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
        source: 'Vendor figure, MuJoCo documentation, humanoid',
      },
      {
        value: 5770000,
        shown: '5.77 million',
        machine: 'RTX 6000 Ada, MuJoCo Warp, 8192 worlds',
        source: 'Vendor figure, MuJoCo Warp nightly benchmark, humanoid',
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
            description="A physics simulator advances a scene in small time steps, and training the model that controls a robot by reinforcement learning can take billions of these steps. A simulation job can run on CPU cores, one scene per core, or on a GPU that steps thousands of copies of the scene at once. To choose between them, you need to know what one step computes and how many steps the job needs."
          >
            12. Physics Simulation: When to Use CPU Cores and When to Use a GPU
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A physics simulator is a program that holds a scene as numbers and computes how the scene moves, one
            small time step after another. The numbers that describe the scene at one instant are called its state.
            The state is a short list of numbers. One step passes the state through a fixed sequence of stages, and
            each stage needs the result of the stage before it. How much work each stage does depends on which
            shapes in the scene are touching at that moment. A chain of small stages that each wait for the one
            before is work that a single CPU core runs well. A GPU that is given one scene has little work that it
            can run in parallel. A GPU pays off only when it advances thousands of independent copies of the scene
            together.
          </Box>
          <Box variant="p">
            So the number of scenes that a job steps at once tells you which hardware to use. MuJoCo is Google
            DeepMind&apos;s open-source physics simulator. We measured MuJoCo 4.0.1 in a single run on one
            Cortex-X925 core of an NVIDIA DGX Spark, and it advanced a humanoid scene at 57,240 steps per second.
            We did not measure the {ARM} arm&apos;s own scene, so the humanoid stands in for it. Each step of the
            humanoid scene covers 0.005 s of simulated time, so the core ran 57,240 x 0.005 = 286 times faster
            than real time. A policy is the trained model that decides what the motors do next. Viewing the
            simulated arm and trying one policy on it are jobs that need only one scene, so a CPU core is the right
            place for them. <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>{' '}
            <Cite id="F06-16">MuJoCo docs, when to use MuJoCo Warp</Cite>
          </Box>
          <Box variant="p">
            Reinforcement learning (RL) trains a policy from the scores that the policy earns on its own attempts at
            a task. It is a different kind of job, because it needs a very large number of attempts. MuJoCo Playground is Google
            DeepMind&apos;s suite of ready-made robot tasks. Its training recipe for this arm runs 4,096 simulated
            arms in parallel and collects 196,608,000 decisions by the policy (section 8, Reinforcement Learning
            for Robots). The physics advances 20 steps between one decision and the next, so the recipe needs
            196,608,000 x 20 = about <Derived>3.9 billion</Derived> physics steps. No attempt needs data from
            another attempt, and none of them has to finish quickly.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>{' '}
            <Cite id="F06-105">MuJoCo Playground simulation config and SO-101 task.py</Cite>
          </Box>
          <Box variant="p">
            A GPU meets that demand by stepping many copies of the scene in one batch. MuJoCo Warp is the version
            of MuJoCo written for NVIDIA GPUs. The MuJoCo Warp project&apos;s benchmark data from September 2026
            report 5.77 million steps per second for a humanoid on one RTX 6000 Ada GPU that steps 8192 copies
            together. Each copy therefore gets <Derived>5,770,000 / 8192 = 704</Derived> steps per second. That is
            about <Derived>80</Derived> times slower than the one scene on the X925 core, but the batch as a whole
            does the work of about a hundred such cores. The two figures come from different machines, software
            versions and sources, so these ratios are accurate only to an order of magnitude.{' '}
            <Cite id="F06-20">MuJoCo Warp nightly benchmarks, humanoid</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Each call of a simulator advances the scene by a fixed amount of simulated time, called the timestep. From the timestep, you can work out how many calls one simulated second needs. You can then check whether a published steps-per-second figure counts physics steps or the policy's decisions."
          >
            The state, the timestep and the number of steps per simulated second
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The simulator represents the {ARM} and its cube by the scene&apos;s <strong>state</strong>. The state
            holds every number that the simulator needs to continue the scene from a given instant. For the
            arm, the state is six joint angles and six joint speeds, one pair for each servo. For the cube, it is a
            position, an orientation and how fast each of them is changing. The speeds have to be part of the
            state, because an arm at rest and an arm swinging through the same pose are in different places a
            moment later.
          </Box>
          <Box variant="p">
            The simulator is a function. It takes the state and the motor commands and returns the state a short
            moment later. That moment is called the <strong>timestep</strong>, and one call of the function is
            called a physics step. A list of numbers does not stop a cube from sinking through the floor or a
            finger from passing through the cube. So each step has to compute the forces that make the numbers
            behave like solid objects.
          </Box>
          <Box variant="p">
            The simulator loads the scene from a model. In a simulator, a model is a text file of typed-in values
            that describes every link, joint and servo, and the shape of every part. Section 14, Sim-to-Real and
            Real-to-Sim, measures these values against the real arm. MuJoCo Menagerie is Google DeepMind&apos;s
            library of robot models, and it includes a model of this arm that is derived from the hardware
            maker&apos;s file. That model describes the gripper and the arm twice: once as detailed meshes for the
            rendered picture, and once as simple added shapes for the physics. So the contacts that a step finds
            come from the simple shapes, whatever the rendered picture shows.{' '}
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
                A grasp as the simulator represents it, with the bodies drawn transparent. Each disc marks a point
                where two shapes touch. Each arrow shows the force that the step computed at that point to keep the
                two shapes from passing through each other.
              </>
            }
            provenance={MUJOCO_SO101}
          />
          <Box variant="p">
            MuJoCo&apos;s default timestep is 0.002 s, so one simulated second takes{' '}
            <Derived>1 / 0.002 = 500</Derived> calls. MuJoCo Playground 1.0 ships a task for this arm called{' '}
            <code>{SIM_TASK}</code>. It teaches the arm to {SIM_TASK_PLAIN}, which is the first half of the task
            used throughout this dive: {TASK_STORY}. This task uses a timestep of 0.005 s, which is 2.5 times
            longer than the default. One simulated second then takes 1 / 0.005 = 200 calls, so the task simulates
            the same second with <Derived>40%</Derived> of the work.{' '}
            <Cite id="F06-10">MuJoCo XML reference, option/timestep</Cite>{' '}
            <Cite id="F06-25">MuJoCo Playground changelog, version 1.0.0</Cite>{' '}
            <Cite id="F06-105">MuJoCo Playground, reaf_sim config.py and SO-101 task.py</Cite>
          </Box>
          <Box variant="p">
            The timestep is the single most important setting for the trade-off between speed and accuracy. If
            you halve the timestep, every simulated second needs twice as many calls. If you set it too large, the
            simulation becomes unstable, which means that its errors grow from one step to the next. If you set it
            too small, you spend CPU time without a meaningful gain in accuracy. To run in real time, the simulator
            also has to compute each step in less CPU time than the timestep that the step simulates.{' '}
            <Cite id="F06-10">MuJoCo XML reference, option/timestep</Cite>{' '}
            <Cite id="F06-13">MuJoCo docs, choosing timestep and integrator</Cite>
          </Box>
          <Box variant="p">
            The policy makes decisions less often than the simulator takes physics steps. <code>{SIM_TASK}</code>{' '}
            is a vision task: its policy sees a camera image and acts every 100 ms, which is 10 times a second.
            Between two decisions, the physics runs 0.1 / 0.005 = 20 steps, and these steps are called{' '}
            <strong>substeps</strong>. A second task,{' '}
            <code>{SIM_TASK_STATE}</code>, gives the policy the joint angles in place of an image, and its policy
            acts every 20 ms. That is 0.02 / 0.005 = 4 substeps per decision and <Derived>1 / 0.02 = 50</Derived>{' '}
            decisions a second, while the physics still runs 200 steps per simulated second. So when you read a steps-per-second figure, check
            which kind of step it counts. A physics benchmark counts physics steps, which is 200 per simulated
            second here. The RL recipe&apos;s 196,608,000 steps are policy decisions, and each of them runs 20
            physics steps.{' '}
            <Cite id="F06-105">MuJoCo Playground, reaf_sim config.py and SO-101 task.py</Cite>{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>
          </Box>
          <Box variant="p">
            The time between two decisions of the policy is called the control period. To make the policy act at
            the rate you set, choose a control period that is a whole number of timesteps. Playground&apos;s
            environment code divides the period by the timestep and rounds the result to a whole number of
            substeps, with <code>round(timestep_ratio)</code>. So if the period is not a whole number of timesteps, the policy ends up running at a
            different period. For example, the real arm&apos;s control loop runs 30 times a second, which is a
            period of 33.3 ms (section 3, The Robot as a Computer). Divided by the timestep, that gives{' '}
            <Derived>0.0333 / 0.005 = 6.67</Derived>, which rounds to 7 substeps. A policy that you set to 30
            decisions a second would then act every <Derived>7 x 5 = 35</Derived> ms, which is{' '}
            <Derived>1 / 0.035 = 28.6</Derived> times a second. Both tasks that Playground ships use periods that
            are exact multiples of the 5 ms timestep, 100 ms and 20 ms.{' '}
            <Cite id="F06-105">MuJoCo Playground, reaf_sim device_layer.py</Cite>{' '}
            <Cite id="F07-23">LeRobot inference docs, cadence at 30 Hz</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="One physics step runs a fixed sequence of stages: it finds where shapes touch, computes the forces and advances the state. You will see why touching shapes stop the simulator from computing the forces directly, so that it has to search for them inside every step."
          >
            Inside one physics step: contacts, constraints and the integrator
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            MuJoCo&apos;s step function is called <code>mj_step</code>. It runs 26 stages, organized in four
            groups: position, velocity, force and acceleration, and the integrator. In the position group,{' '}
            <strong>collision detection</strong> searches for every place where two shapes touch. Each such place
            is called a <strong>contact</strong>, for example a finger on the cube or the cube on the floor. Each
            contact becomes a <strong>constraint</strong>, which is a rule that the next state has to obey. For a
            contact, the rule is that the two shapes do not pass through each other and slide only when friction
            is overcome. In the force group, the <strong>constraint solve</strong> finds the forces that keep every
            constraint true, and from those forces it gets the acceleration of every joint. The{' '}
            <strong>integrator</strong> then advances every speed and every position by one timestep.{' '}
            <Cite id="F06-9">MuJoCo docs, Computation chapter, simulation pipeline</Cite>
          </Box>
          <Box variant="p">
            These stages have to run in order. The solve cannot start until collision detection has listed the
            contacts. The integrator cannot start until the solve has produced the accelerations. The next step
            starts from the state that this step returns. So one scene gives a processor a chain of small tasks,
            and few of them can run in parallel.
          </Box>
          <AnimatedFigure
            name="one physics step"
            steps={PHYS_STEP_STEPS}
            intervalMs={3600}
            cites="F06-9 F06-105"
            caption={
              <>
                Each frame highlights the stage group that is running and draws what it adds to a grasp, shown in
                two dimensions: first the contacts, then the speeds, then the known forces, and finally the forces
                that the solve finds. The joint values, the three contacts and the size of the overlap are
                illustrations, not measurements. The 5 ms timestep and the 200 steps per simulated second come from
                the pick-cube task.
              </>
            }
          >
            {(step, reduced) => <PhysStep step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            The constraint solve computes the forces in a grasp. The floor pushes up on the cube exactly as hard
            as is needed to stop the cube from sinking. Each finger pushes exactly as hard as is needed to stop the
            finger from passing into the cube. These forces depend on one another: if one finger squeezes harder,
            the force at the other finger changes. So the simulator has to find all of them together, with an
            iterative search inside every step. In Playground&apos;s simulation config, you set the solver and its
            iteration limits with <code>solver</code>, <code>iterations</code> and <code>ls_iterations</code>. In
            iterative optimisation, a line search takes a search direction and chooses how far to move along it,
            so that the quantity being minimised goes down. <code>ls_iterations</code> limits how many steps the
            line search takes inside each iteration. The pick-cube task sets none of these values, so
            MuJoCo&apos;s defaults apply. <Cite id="F06-106">MuJoCo Playground, reaf_sim config.py, Sim class</Cite>
          </Box>
          <Box variant="p">
            Each step solves the equation force equals mass times acceleration, written for a machine made of
            joints. Besides the accelerations, the equation has a second unknown: the constraint forces. The
            symbols below use MuJoCo&apos;s own names:
          </Box>
          <ul style={LIST}>
            <li>
              <M>{String.raw`\dot{v}`}</M> is the acceleration of every joint, which is the unknown that the step
              solves for. The dot means &quot;rate of change of&quot;, and <M>v</M> is the vector of joint
              velocities. MuJoCo stores the result as <code>qacc</code>.
            </li>
            <li>
              <M>M</M> is the inertia matrix, which plays the role of mass for a jointed body. A single rigid body
              has one mass. A jointed body needs a table of values, because the links carry each other:
              accelerating the shoulder also has to move the forearm.
            </li>
            <li>
              <M>{String.raw`\tau`}</M> is the force applied at each joint, by the motors and by passive effects
              such as damping.
            </li>
            <li>
              <M>c</M> is the bias force. It is the pull of gravity and of the arm&apos;s own motion, such as a
              swinging forearm tugging on the shoulder.
            </li>
            <li>
              <M>f</M> is the vector of constraint forces, which is also unknown. On this task, the constraint
              forces come from the contacts and from the dry friction that the scene sets inside each joint. Joint
              limits are constraints too. <Cite id="F11-211">MuJoCo docs, Computation chapter, constraint model</Cite>
            </li>
            <li>
              <M>J</M> is the constraint Jacobian. It is a table with one row per constraint, and each row says how
              much the motion of each joint changes that constraint, for example how far it moves a contact point.
              Its transpose, <M>{String.raw`J^T`}</M>, converts a constraint force into forces at the joints.
            </li>
          </ul>
          <Formula
            name="Equations of motion in continuous time"
            tex={String.raw`M \dot{v} + c = \tau + J^T f`}
            source={<Cite id="F11-200">MuJoCo docs, Computation chapter, equation of motion</Cite>}
          />
          <Box variant="p">
            On the left side, <M>{String.raw`M \dot{v}`}</M> is mass times acceleration, and <M>c</M> adds the bias
            force from gravity and the arm&apos;s own motion. On the right side, <M>{String.raw`\tau`}</M> is what
            the motors and damping contribute, and <M>{String.raw`J^T f`}</M> is the contribution of the
            constraints, converted to forces at the joints. With no active constraint, <M>{String.raw`J^T f`}</M>{' '}
            is zero, so <M>{String.raw`\dot{v}`}</M> follows from one direct calculation. With active constraints,
            the forces <M>f</M> stay unknown until the solve has found the <M>f</M> whose resulting{' '}
            <M>{String.raw`\dot{v}`}</M> breaks no constraint. So every active constraint turns the direct
            calculation into a search. In MuJoCo, a friction loss is the limit on dry friction inside a joint, and
            the simulator treats it as a constraint. The scene for this arm sets a friction loss on every joint, so
            the solve always has something to search for, and a grasp adds its contacts on top of that.{' '}
            <Cite id="F11-211">MuJoCo docs, Computation chapter, friction loss</Cite>{' '}
            <Cite id="F11-212">MuJoCo Playground, SO-101 scene.py</Cite>
          </Box>
          <Box variant="p">
            The integrator turns that acceleration into the next state. The standard method for this in physics
            simulation is called semi-implicit Euler. In the formula below, <M>q_t</M> is the joint positions and{' '}
            <M>v_t</M> is the joint velocities at time <M>t</M>. The acceleration that the solve just found is{' '}
            <M>{String.raw`a_t = \dot{v}`}</M>, and <M>h</M> is the timestep.
          </Box>
          <Formula
            name="Semi-implicit Euler integration"
            tex={String.raw`\begin{aligned} v_{t+h} &= v_t + h\,a_t \\ q_{t+h} &= q_t + h\,v_{t+h} \end{aligned}`}
            source={<Cite id="F11-201">MuJoCo docs, Computation chapter, numerical integration</Cite>}
          />
          <Box variant="p">
            The first line changes the speed by the acceleration times the timestep. The second line moves the
            position using the new speed, <M>{String.raw`v_{t+h}`}</M>. The plain version of Euler integration
            would use the old speed here, and this one change is what makes the method &quot;semi-implicit&quot;.
            Here is an example with illustrative numbers. An elbow turns at <Toy>1.000</Toy> rad/s under an
            acceleration of <Toy>2.0</Toy> rad/s². After one timestep of 5 ms, its speed is{' '}
            <Toy>1.000 + 0.005 x 2.0 = 1.010</Toy> rad/s. Its angle moves from <Toy>0.50000</Toy> rad to{' '}
            <Toy>0.50000 + 0.005 x 1.010 = 0.50505</Toy> rad.
          </Box>
          <Box variant="p">
            Both lines hold the acceleration fixed for the whole timestep <M>h</M>. A stiff force is a force that
            changes quickly with position or speed, and for such a force, holding the acceleration fixed causes
            errors. The integrator applies a stiff force at its value from the start of the step for the full
            timestep. The larger <M>h</M> is, the further the
            new state lands from where that force would really have taken it. The next step then starts from that
            error. When each step&apos;s error is larger than the one before, the simulation is unstable, and a
            larger <M>h</M> makes every error larger.{' '}
            <Cite id="F06-13">MuJoCo docs, choosing timestep and integrator</Cite>
          </Box>
          <Box variant="p">
            The pick-cube task uses a different velocity update. Its base scene selects the <code>implicitfast</code>{' '}
            integrator in its <code>option</code> element, next to the timestep:{' '}
            <code>timestep=&quot;0.005&quot; integrator=&quot;implicitfast&quot;</code>. MuJoCo recommends{' '}
            <code>implicitfast</code> as usually the best trade-off between stability and performance.{' '}
            <Cite id="F06-13">MuJoCo docs, choosing timestep and integrator</Cite>{' '}
            <Cite id="F06-106">MuJoCo Playground, plane.xml option element</Cite> <code>implicitfast</code> keeps
            the position line unchanged. In the velocity line, it rescales the acceleration with a matrix built
            from how speed-dependent forces, such as damping, change with speed. This approximates an update that
            uses the acceleration at the new speed in place of the old one.{' '}
            <Cite id="F11-210">MuJoCo docs, Computation chapter, implicit velocity update</Cite>
          </Box>
          <ExpandableSection headerText="What each of the four stage groups computes">
            <ul style={LIST}>
              <li>
                <strong>Position.</strong> This group computes where every body is from the joint angles. It also
                computes the inertia matrix, runs collision detection to build the list of active contacts, and
                builds the constraint Jacobian.
              </li>
              <li>
                <strong>Velocity.</strong> This group computes the passive forces and the terms that come from
                gravity and from the bodies&apos; own motion.
              </li>
              <li>
                <strong>Force and acceleration.</strong> This group computes the actuator forces, then the
                constraint forces from the selected solver, which update the joint acceleration. The result is the
                vector <code>mjData.qacc</code>.
              </li>
              <li>
                <strong>Integrator.</strong> This group advances the state by one timestep.
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
            description="Loose objects in a scene create contacts, and contacts make each step more expensive and limit how large the timestep can be. When a simulated grasp becomes unstable, there are two documented settings you can change."
          >
            How contacts affect the cost of a step and its stability
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Loose objects are what make a scene expensive to simulate. MuJoCo can simulate most robotic systems a
            lot faster than real time. The models that its documentation names as demanding are those with many
            floating objects, &quot;resulting in many contacts&quot;. A floating object is a loose object that is
            not attached to the robot or to the world. In the pick-cube task, the cube is the floating object.{' '}
            <Cite id="F06-11">MuJoCo XML reference, option/timestep</Cite>
          </Box>
          <Box variant="p">
            To find the contacts, MuJoCo first rules out pairs of shapes that cannot be touching, and only then
            tests the remaining pairs in detail. Testing every pair in detail &quot;is prohibitively expensive for
            large systems&quot;. So MuJoCo runs collision detection in three phases.{' '}
            <Cite id="F06-12">MuJoCo docs, Computation chapter, collision detection</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Broad phase.</strong> It picks out the pairs of bodies that could be touching.
            </li>
            <li>
              <strong>Mid phase.</strong> It narrows the search inside each of those pairs.
            </li>
            <li>
              <strong>Near phase.</strong> It tests the remaining shapes in detail and returns the contacts.
            </li>
          </ul>
          <Box variant="p">
            Each time the search rules out a pair, the code takes a branch: it decides, from this step&apos;s
            positions, which code runs next. So the work in one step differs from the work in the step before it,
            and from the same step in another copy of the scene.
          </Box>
          <Box variant="p">
            The MuJoCo Warp project&apos;s benchmarks on one RTX 6000 Ada GPU show how much contacts can cost. The
            project reports 25.2 million steps per second for an idle Franka Panda arm with 32768 copies of the
            scene. It reports 2.51 million for a two-arm robot handling a pot, with 8192 copies, and 342 thousand
            for the same two-arm robot at a table cluttered with objects, with 2048 copies. Per copy, that is{' '}
            <Derived>25,200,000 / 32768 = 769</Derived>, <Derived>2,510,000 / 8192 = 306</Derived> and{' '}
            <Derived>342,000 / 2048 = 167</Derived> steps per second. From the idle arm to the cluttered table,
            each copy runs <Derived>769 / 167 = 4.6</Derived> times slower. The robot, the contacts and the batch
            size all change between these three results. So the results show a range, and you cannot read a single
            cost per contact from them.{' '}
            <Cite id="F06-20">MuJoCo Warp nightly benchmarks, Franka, Aloha pot and Aloha clutter</Cite>
          </Box>
          <Box variant="p">
            Contacts also limit how large the timestep can be, because of how stiff their constraints are.
            Stability depends on the constraint solver&apos;s settings as well as on the timestep, and softer
            constraints can be simulated with larger timesteps.{' '}
            <Cite id="F06-11">MuJoCo XML reference, option/timestep</Cite> The Menagerie model of this arm ships
            contact solver defaults for the gripper &quot;that work well for manipulation&quot;. That is a good
            reason to start from that model file. <Cite id="F06-37">MuJoCo Menagerie, robotstudio_so101 README</Cite>
          </Box>
          <Box variant="p">
            Besides the timestep, the other setting you can change is the integrator. <code>implicitfast</code> is
            MuJoCo&apos;s general recommendation. MuJoCo also ships a <code>discrete</code> integrator for the case
            &quot;when stiff springs, position servos or strong damping interact with contacts&quot;.{' '}
            <Cite id="F06-13">MuJoCo docs, choosing timestep and integrator</Cite> The {ARM} fits that
            description. In the model, each {ARM} joint is a position servo, with a gain between 218 and 265 that
            was identified from the real arm. The task is a grasp, so those servos interact with contacts. Both the
            Menagerie model and the pick-cube scene select <code>implicitfast</code>, the general choice. When a
            grasp becomes unstable, <code>discrete</code> is the integrator to try, because it is the one that the
            documentation names for this case. <Cite id="F06-31">MuJoCo Playground, SO-101 servo constants</Cite>{' '}
            <Cite id="F06-37">MuJoCo Menagerie, robotstudio_so101 README</Cite>{' '}
            <Cite id="F06-106">MuJoCo Playground, plane.xml option element</Cite>
          </Box>
          <Box variant="p">
            If a simulation of this arm becomes unstable at a timestep of 0.005 s, first rule out a fault in the
            simulator itself. MuJoCo 4.0.0 shipped a fault in a matrix factorisation that one of its constraint solvers
            relies on when the constraint Jacobian <M>J</M> is sparse. The fault was &quot;causing slow
            convergence, wrong accelerations and divergence&quot;, and 4.0.1 fixed it, so pin MuJoCo to 4.0.1.{' '}
            <Cite id="F06-1">MuJoCo 4.0.1 release</Cite> <Cite id="F06-2">4.0.1 release notes, bug fixes</Cite>{' '}
            After that, there are two documented changes you can make. You make both in Playground&apos;s{' '}
            <code>Sim</code> config, which overrides the timestep in the <code>option</code> element with its own
            value. <Cite id="F06-105">MuJoCo Playground, reaf_sim config.py</Cite>{' '}
            <Cite id="F06-106">MuJoCo Playground, Sim config</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>A smaller timestep.</strong> You set it in <code>simulation_timestep</code>, and you pay for
              it with more calls per simulated second.
            </li>
            <li>
              <strong>The discrete integrator.</strong> You set <code>discrete</code> in the{' '}
              <code>integrator</code> field.
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A GPU's steps-per-second figure is the total for a whole batch of copies of the scene, and each copy in the batch advances slowly. Read that way, the figure lets you compare a GPU with CPU cores: on the humanoid scene, one GPU batch of 8192 copies does the work of about a hundred fast CPU cores."
          >
            Stepping thousands of worlds at once on a GPU
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            In a GPU simulator, each independent copy of the scene is called a <strong>world</strong>. A world has
            its own arm, its own cube and its own state, and nothing in one world affects another. An{' '}
            <strong>environment</strong> is a world plus the task around it, which includes the reward that scores
            each attempt and the reset that starts a new one. Isaac Lab is NVIDIA&apos;s robot-learning framework.
            MuJoCo Warp counts the copies in a batch as worlds, and Isaac Lab counts them as environments. On a CPU, the usual approach is one world per thread, with as many threads as the
            machine has logical cores. <Cite id="F06-14">MuJoCo docs, testspeed</Cite>
          </Box>
          <Box variant="p">
            A GPU holds the states of all the worlds in arrays, with one row per world. It runs each stage of the
            step once over the whole array. Latency is the time that one step takes, and throughput is the total
            number of steps per unit of time. This layout gains throughput at the cost of latency. MuJoCo is tuned
            for latency and MuJoCo Warp for throughput, so a single step is expected to be slower on MuJoCo Warp
            than on MuJoCo. <Cite id="F06-16">MuJoCo docs, when to use MuJoCo Warp</Cite>
          </Box>
          <Box variant="p">
            Contacts cost a GPU batch in two ways. The first is memory that has to be reserved in advance. Every
            world has its own contacts on every step, and a GPU cannot grow an array in the middle of a step. So
            each world reserves room up front for its worst case. The pick-cube task allows 64 contacts and 256
            constraints per world, set as <code>nconmax=64</code> and <code>njmax=256</code>, where each constraint
            is one row of <M>J</M>. <Cite id="F06-105">MuJoCo Playground, pick-cube task.py</Cite> Memory and
            computation both scale with these two limits. The limits are the same for every world, so every world
            carries the cost of the room that the busiest world needs. MuJoCo&apos;s documentation therefore advises setting the limits as small as possible without
            the simulation exceeding them.{' '}
            <Cite id="F06-23">MuJoCo docs, MuJoCo Warp chapter, performance tuning</Cite>
          </Box>
          <Box variant="p">
            The second cost is the contact search itself. Accelerators such as GPUs run branching code poorly. The
            broad phase branches on each world&apos;s positions, so the worlds in a batch stop doing the same work
            at the same time. JAX is Google&apos;s array library for Python, and MJX-JAX is MuJoCo re-implemented in
            JAX. MJX-JAX avoids the branches with a broad phase that has none, and that broad phase is less
            powerful than MuJoCo&apos;s. As contacts are added, MJX-JAX&apos;s throughput falls faster than CPU
            MuJoCo&apos;s.{' '}
            <Cite id="F06-17">MuJoCo docs, MJX chapter, scenes with many contacts</Cite> MuJoCo&apos;s
            documentation gives figures for one humanoid scene. MJX-JAX reached 950 thousand steps per second on
            one NVIDIA A100 with a batch of 8192 worlds. CPU MuJoCo reached 1.8 million on a 64-core AMD 3995WX,
            with two threads per core. <Cite id="F06-15">MuJoCo docs, MJX chapter, humanoid throughput</Cite> The
            same documentation describes MuJoCo Warp as &quot;resolving several performance bottlenecks exhibited
            in MJX-JAX&quot;. <Cite id="F06-18">MuJoCo docs, MJX chapter</Cite>
          </Box>
          <Figure
            cites="F08-61 F08-73 F06-15 F06-20"
            caption={
              <>
                One CPU core steps a humanoid scene tens of thousands of times a second. A whole CPU or a GPU batch
                steps it 650 thousand to 5.77 million times a second, and MJX-JAX on an A100 comes in below the
                64-core CPU. The top three bars are our own single-run measurements. The other bars are vendor
                figures from other machines and other MuJoCo versions, and we did not check that the humanoid
                model files are identical. So compare the bars only by order of magnitude.
              </>
            }
          >
            <ThroughputChart />
          </Figure>
          <Box variant="p">
            Measured against whole CPUs, one GPU batch does the work of a few large CPUs. Take the rate of our
            single run on one X925 core of the DGX Spark, with MuJoCo 4.0.1 and the humanoid as a stand-in. At that
            rate, the batch&apos;s 5.77 million steps per second equal about a hundred such cores (
            <Derived>5,770,000 / 57,240 = 101</Derived>). The 64-core workstation in the MuJoCo documentation
            reaches 1.8 million, so the batch is <Derived>5.77 / 1.8 = 3.2</Derived> times faster than that whole
            workstation. The RL recipe needs <Derived>3,932,160,000</Derived> physics steps. If you divide that
            number by these three humanoid rates, the recipe would take about <Derived>11</Derived> minutes on the GPU batch, about <Derived>36</Derived>{' '}
            minutes on the workstation and about <Derived>19</Derived> hours on the one core.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>{' '}
            <Cite id="F06-20">MuJoCo Warp nightly benchmarks, humanoid</Cite>{' '}
            <Cite id="F06-15">MuJoCo docs, MJX chapter, humanoid throughput</Cite>
          </Box>
          <Box variant="p">
            Physics without cameras needs little GPU memory. In the same benchmark data, the 8192 humanoid worlds
            use 466 MB, about 57 KB per world, on a card with 48 GB. The two-arm robot needs about 84 KB per world
            with the pot and 468 KB at the cluttered table, which is <Derived>468 / 84 = 5.6</Derived> times more.
            Even at 468 KB per world, a 48 GB card would hold about{' '}
            <Derived>48,000,000 / 468 = 100,000</Derived> worlds if memory grows in proportion to the number of
            worlds. That is far more
            than the 4,096 worlds that the RL recipe runs, so physics memory is not the limit at these world
            counts. The camera images in the vision recipe need memory of their own, and section 13, Rendering and
            Ray Tracing, covers that cost. Even so, MuJoCo Warp&apos;s documentation warns that &quot;simulation
            throughput is often limited by memory requirements for large numbers of worlds&quot;. Computation also
            scales with the per-world limits on contacts and constraints, so tight limits also give you more steps
            per second.{' '}
            <Cite id="F06-22">MuJoCo Warp nightly benchmarks, total_memory</Cite>{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>{' '}
            <Cite id="F06-20">MuJoCo Warp nightly benchmarks, system</Cite>{' '}
            <Cite id="F06-23">MuJoCo docs, MuJoCo Warp chapter, memory</Cite>
          </Box>
          <Box variant="p">
            A steps-per-second figure counts only the physics. In a training run, the GPU also runs the policy and
            updates it. The first MuJoCo Playground paper ran MJX physics on an RTX 4090 for a Franka pick task
            with a camera. Its authors report that physics took 24% of training time, rendering 18% and the policy
            update 57%. On that run, halving the physics time would shorten training by <Derived>12%</Derived>, and
            removing the physics entirely would shorten it by 24%. So the comparison with a hundred CPU cores
            describes the cost of the physics, not the cost of the whole training run.{' '}
            <Cite id="F06-33">MuJoCo Playground paper, appendix D.3</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="For this arm, you install MuJoCo to view the model and evaluate one policy, and MuJoCo Warp to train with reinforcement learning. MJX and Isaac Lab each let you choose the physics engine underneath, and that choice changes speed and memory use."
          >
            Choosing a simulator: MuJoCo, MuJoCo Warp, MJX and Isaac Lab
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            MuJoCo 4.0.1 on a CPU steps one world with the lowest latency. Use it to view the model and to run one
            policy. For RL, use MuJoCo Warp on an NVIDIA GPU. MuJoCo Playground 1.0 is the ready-made way to use
            it, with tasks, training code and paired packages for the simulated and the real {ARM}.{' '}
            <Cite id="F06-16">MuJoCo docs, when to use MuJoCo Warp</Cite>{' '}
            <Cite id="F06-25">MuJoCo Playground changelog, version 1.0.0</Cite>
          </Box>
          <Box variant="p">
            Two other names often appear in robot-learning code: MJX and Isaac Lab. Each name covers more than one
            physics engine, so you need to know which engine it runs. MJX is a JAX interface that can run on two
            engines, MJX-JAX and MJX-Warp. So the name MJX no longer means only the rewrite of MuJoCo in JAX.
            MJX-JAX runs on NVIDIA and AMD GPUs, Apple Silicon and Google TPUs. MJX-Warp calls MuJoCo Warp and runs
            on NVIDIA GPUs. <Cite id="F06-18">MuJoCo docs, MJX chapter</Cite> Isaac Lab 3.0 can run the same task
            definition on either of two engines, Newton or PhysX. Newton is a GPU physics engine that offers MuJoCo Warp as one of several solvers. PhysX is
            NVIDIA&apos;s own physics engine. Isaac Lab 3.0 no longer needs Isaac Sim, which is NVIDIA&apos;s full
            simulator application built around PhysX and the RTX renderer.{' '}
            <Cite id="F06-46">Isaac Lab docs, physics back ends</Cite>{' '}
            <Cite id="F06-45">Isaac Lab v3.0.0 release</Cite>
          </Box>
          <Box variant="p">
            For a Franka arm lifting a cube in Isaac Lab, the choice of engine changes speed by a factor of about
            two and memory use by a factor of nearly three. Isaac Lab&apos;s release benchmark ran
            that task with 8,192 environments on one RTX PRO 6000 Blackwell Server Edition GPU. It reports 318,651
            training frames per second with Newton&apos;s MuJoCo Warp solver and 164,777 with PhysX. The whole
            training process used 5.41 GB of GPU memory with Newton and 14.74 GB with PhysX. A training frame is
            the benchmark&apos;s own unit, and it includes the policy&apos;s updates. So these figures compare the
            two engines with each other, and you cannot compare them with a physics benchmark&apos;s steps per
            second. <Cite id="F06-47">Isaac Lab v3.0.0 benchmark file</Cite>
          </Box>
          <ExpandableSection headerText="Latest releases as of November 2026, in order of how directly this arm uses them">
            <SpaceBetween size="s">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 720 }}>
                  <thead>
                    <tr>
                      <th style={TH}>Simulator</th>
                      <th style={TH}>Version and release date</th>
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
                        It steps one world with the lowest latency. Use it to view a model or evaluate one policy.
                        Use 4.0.1, which fixes a fault in 4.0.0 that gave wrong accelerations.
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
                        It is a version of MuJoCo that steps many worlds in one batch. It is written in Warp, which is
                        NVIDIA&apos;s Python framework for GPU code. Use it for reinforcement learning.
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
                        It provides ready-made tasks and training code, including the {ARM} pick-cube task, with
                        paired packages for the simulated and the real arm.
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
                        It is a JAX interface to MuJoCo, with two engines underneath: MJX-JAX, a rewrite of MuJoCo in
                        JAX, and MJX-Warp, which calls MuJoCo Warp.
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
                        It is NVIDIA&apos;s robot-learning framework. You write a task once and run it on Newton or on
                        PhysX. Since version 3.0, it runs without Isaac Sim.
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
                        It is a GPU physics engine built on Warp, with several solvers, including MuJoCo Warp. Some of its
                        solvers are still labelled experimental.
                      </td>
                      <td style={TD}>
                        <Cite id="F06-40">Newton v1.8.0 release</Cite>{' '}
                        <Cite id="F06-46">Isaac Lab docs, physics back ends</Cite>
                      </td>
                    </tr>
                    <tr>
                      <td style={TD}>Isaac Sim</td>
                      <td style={TD}>6.2.0, 2026-10-14</td>
                      <td style={TD}>NVIDIA GPU; section 13, Rendering and Ray Tracing, covers which ones</td>
                      <td style={TD}>
                        It is NVIDIA&apos;s full simulator application. It includes the PhysX physics engine, the RTX
                        renderer and the tools around them.
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
            description="Whether you buy CPU cores or a GPU depends on how many worlds the job steps at once. Before you choose, time your own scene on one core, and compare the rate of the cores you would buy with the rate of a GPU batch."
          >
            Choosing the hardware: CPU cores or a GPU
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            For CPU physics, the bottleneck is the CPU core itself. We measured this in single runs on the DGX
            Spark with MuJoCo 4.0.1. While the X925 core stepped the humanoid, only 0.4% of its cycles were stalled
            waiting for memory. For comparison, we also ran a stand-in for policy inference, a program that computes
            a stack of matrix-vector products. On the same core, it stalled on memory in 22.4% of its cycles. The
            Spark&apos;s slower Cortex-A725 core stepped the humanoid at 28,662 steps per second, half the rate of
            the X925. So when you buy CPUs for physics, choose first by the speed of one core and then by the number
            of cores. The number of cores matters because worlds that share nothing run one to a thread. The same
            independence lets an evaluation run as hundreds of independent episodes, where an episode is one attempt
            at the task (section 16, Evaluation).{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-62">our profiling report, policy step table</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Box variant="p">
            Physics on its own uses the GPU&apos;s general compute cores and its memory. It does not need the
            ray-tracing hardware that a simulated camera can require. For Newton, the Isaac Lab installation guide
            states it directly: &quot;Headless Newton simulation does not require RTX hardware&quot;. Headless means
            running with no window and no camera images. The guide&apos;s default CUDA 13 stack needs an NVIDIA
            GPU of the Turing generation (compute capability 7.5) or newer. The vision task&apos;s camera is a
            separate cost, and section 13, Rendering and Ray Tracing, covers it.{' '}
            <Cite id="F06-100">GPU physics, what it loads</Cite>{' '}
            <Cite id="F06-51">Isaac Lab v3.0.0 installation guide</Cite> The host CPU that drives the GPU still
            matters. The Isaac Lab
            paper&apos;s authors write that throughput can also depend on single-core CPU performance, in parts of
            PhysX and in the main training loop. <Cite id="F06-65">Isaac Lab paper, section 4.1</Cite>
          </Box>
          <Box variant="p">
            To choose an instance, first time your own scene on one core. MuJoCo&apos;s timing tool,{' '}
            <code>testspeed</code>, runs a model for 10,000 steps by default. It prints the CPU time and the number
            of contacts and constraints. If you set <code>--nthread</code> to the number of logical cores, it
            times one world per thread. <Cite id="F06-14">MuJoCo docs, testspeed</Cite> To find how many times
            faster than real time one core runs, multiply its steps per second by your timestep. For a job with one
            world, that number tells you whether one core is enough. As of November 2026, we found no published
            benchmark that times one scene at several world counts. So you have to measure, for your own scene,
            the point at which a GPU batch becomes the better buy. Run <code>testspeed</code> with one world per
            thread on the cores you would buy, and compare its rate with the rate of a GPU batch. On the humanoid,
            one batch is worth about a hundred X925 cores. A GPU batch is the better buy when it delivers more
            steps per unit of price than those cores.{' '}
            <Cite id="F06-20">MuJoCo Warp nightly benchmarks, humanoid</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
