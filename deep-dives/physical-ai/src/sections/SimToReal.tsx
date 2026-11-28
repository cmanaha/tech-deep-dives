import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Toy, Derived } from '../components/Cite';
import { AnimatedFigure } from '../components/Figure';
import { Formula, M } from '../components/Math';
import { ARM, SIM_TASK, SIM_TASK_PLAIN, SIM_TASK_GAP } from '../lib/task';
import { Capture, MUJOCO_SO101 } from '../components/Capture';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const ROBOT_FILL = '#fff6d6';
const ROBOT_INK = '#7a5c00';
const GPU_FILL = '#e6f6ea';
const GPU_INK = '#1e7b3a';
const NEUTRAL_INK = '#5f6b7a';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 560, margin: '0 auto' };

const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };
const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };

/* ------------------------------------------------------------------------ */
/* Diagram 14.1: closing the gap                                            */
/* ------------------------------------------------------------------------ */

const BASE_Y = 220;
const SIM_CX = 200;
const REAL_CX = 318;
const SIM_HALF = 34;

/** A bell curve closed along the baseline. */
function bellPath(cx: number, sigma: number, height: number): string {
  const pts: string[] = [];
  for (let i = -30; i <= 30; i += 1) {
    const u = i / 10;
    const x = cx + u * sigma;
    const y = BASE_Y - height * Math.exp(-(u * u) / 2);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M${(cx - 3 * sigma).toFixed(1)},${BASE_Y} L${pts.join(' L')} L${(cx + 3 * sigma).toFixed(1)},${BASE_Y} Z`;
}

/** A flat-topped band (a range that values are drawn from) closed along the baseline. */
function bandPath(cx: number, half: number, height: number): string {
  const pts: string[] = [];
  for (let i = -22; i <= 22; i += 1) {
    const u = i / 20;
    const x = cx + (u / 1.1) * half;
    const y = BASE_Y - height * Math.exp(-((Math.abs(u) / 0.9) ** 8));
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M${(cx - half).toFixed(1)},${BASE_Y} L${pts.join(' L')} L${(cx + half).toFixed(1)},${BASE_Y} Z`;
}

const REAL_PATH = bellPath(REAL_CX, 9, 100);
const SIM_PATH = bandPath(SIM_CX, SIM_HALF, 120);

/** Where the simulated band sits at each step: shift along the axis, then stretch about its base. */
const SIM_POSE = [
  { dx: 0, sx: 1, sy: 1 },
  { dx: 0, sx: 2.6, sy: 0.6 },
  { dx: 0, sx: 5.6, sy: 0.4 },
  { dx: REAL_CX - SIM_CX, sx: 1, sy: 1 },
  { dx: REAL_CX - SIM_CX, sx: 1.9, sy: 0.7 },
];

const GAP_TITLES = [
  'The sim-to-real gap',
  'Domain randomisation widens the range',
  'The real values are inside the range',
  'Real-to-sim: measure the real values',
  'In practice: measure, then widen a little',
];

const GAP_CAPTIONS = [
  <>
    Take one property of the scene, such as fingertip friction. The simulator produces values in one narrow band,
    and the real setup produces values in another band. A policy trained only on the left band has never seen a
    value from the right band.
  </>,
  <>
    Domain randomisation draws the value from a wider range at the start of every episode. So the band of values
    that the policy trains on becomes wider.
  </>,
  <>
    The range is now wide enough to contain the real values. For the policy, the real arm is one more variation of
    the kind it practised on during training.
  </>,
  <>
    The other approach starts again from the narrow simulator and measures the real setup instead. System
    identification fits the servo parameters, and a scan rebuilds the scene. After that, the simulator&apos;s band
    sits on the real values.
  </>,
  <>
    In practice, you use both approaches. You measure what can be measured, and then you randomise over a small
    range around the measured value to cover the error that remains.
  </>,
];

function GapDiagram({ step, reduced }: { step: number; reduced: boolean }) {
  const pose = SIM_POSE[step] ?? SIM_POSE[0];
  const moved = step >= 3;
  const label = { fontFamily: 'sans-serif', fontSize: 13, fill: INK } as const;
  const fade = (on: boolean): CSSProperties => ({ opacity: on ? 1 : 0, transition: reduced ? 'none' : 'opacity 500ms ease' });
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 420 276" role="img" aria-labelledby="sim-to-real-gap-title" style={{ width: '100%', height: 'auto' }}>
        <title id="sim-to-real-gap-title">Closing the gap between what the simulator produces and what the real setup produces</title>
        <desc>
          The chart shows two distributions of values for one property of the scene. The simulated distribution
          starts narrow and away from the real one. Domain randomisation widens it until it contains the real one.
          Real-to-sim measures the real setup and moves the narrow simulated distribution onto the real one. The
          curves are illustrative, not measured.
        </desc>
        <rect x="0" y="0" width="420" height="276" fill="#fbfbfd" />
        <text x="16" y="28" {...label} fontSize={14} fontWeight="bold">
          {GAP_TITLES[step] ?? GAP_TITLES[0]}
        </text>

        {/* the axis */}
        <line x1="10" y1={BASE_Y} x2="410" y2={BASE_Y} stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <text x="210" y="244" textAnchor="middle" {...label}>
          one property of the scene, for example fingertip friction
        </text>
        <text x="210" y="263" textAnchor="middle" {...label} fill={NEUTRAL_INK}>
          height: how often that value comes up
        </text>

        <text x="404" y="70" textAnchor="end" {...label} fill={ROBOT_INK}>
          what the real setup produces
        </text>

        {/* where the simulator started */}
        <path d={SIM_PATH} fill="none" stroke={GPU_INK} strokeWidth="1.5" strokeDasharray="5 4" style={fade(step >= 1)} />

        {/* what the simulator produces, at this step */}
        <path
          d={SIM_PATH}
          fill={GPU_FILL}
          fillOpacity="0.8"
          stroke={GPU_INK}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          style={{
            transformBox: 'fill-box',
            transformOrigin: '50% 100%',
            transform: `translateX(${pose.dx}px) scale(${pose.sx}, ${pose.sy})`,
            transition: reduced ? 'none' : 'transform 900ms ease',
          }}
        />
        {/* what the real setup produces, drawn last so it stays readable on top */}
        <path d={REAL_PATH} fill={ROBOT_FILL} fillOpacity="0.85" stroke={ROBOT_INK} strokeWidth="2" />
        <text x="16" y="70" {...label} fill={GPU_INK} style={fade(!moved)}>
          what the simulator produces
        </text>
        <text x="16" y="70" {...label} fill={GPU_INK} style={fade(moved)}>
          where the simulator started
        </text>
        <text x="404" y="50" textAnchor="end" {...label} fill={GPU_INK} style={fade(moved)}>
          the simulator, after measuring
        </text>

        {/* the gap, named on the first frame */}
        <g style={fade(step === 0)}>
          <line x1="238" y1="170" x2="288" y2="170" stroke={INK} strokeWidth="1.5" />
          <line x1="238" y1="164" x2="238" y2="176" stroke={INK} strokeWidth="1.5" />
          <line x1="288" y1="164" x2="288" y2="176" stroke={INK} strokeWidth="1.5" />
          <text x="263" y="158" textAnchor="middle" {...label}>
            the gap
          </text>
        </g>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function SimToReal() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={`A policy trained in simulation learns the simulator's settings along with the task, and the real arm never matches those settings exactly. To make the policy work on the real arm, you decide which settings to randomise during training and which ones to measure on the arm. For the ${ARM}'s motors, you can fit 24 servo parameters from one teleoperated episode with MuJoCo Playground v1.0.1 and MuJoCo 4.0.`}
          >
            14. Sim-to-Real and Real-to-Sim: Making a Policy Trained in Simulation Work on the Real Arm
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A simulator works from numbers that someone has typed into its files. The stiffness of each servo, the
            friction of each fingertip, the delay on each command and the colour of the light are all set in the
            scene&apos;s model file or in the task&apos;s code (section 12, Physics Simulation). A policy trained in
            the simulator learns these numbers along with the task. On the real {ARM}, every one of these values is
            a little different. This difference between the simulator and the real setup is
            called the sim-to-real gap. Moving a policy from the simulator to the real arm is called sim-to-real.
          </Box>
          <Box variant="p">There are two ways to make a policy work on the real arm despite the gap:</Box>
          <ul style={LIST}>
            <li>
              <strong>Domain randomisation.</strong> During training, the simulator draws each uncertain value from a
              range at the start of every episode. If the ranges are wide enough, the real arm falls inside them, and
              the policy has already practised on values like the real ones.
            </li>
            <li>
              <strong>Measuring the real setup.</strong> You measure the real arm and its scene, and you correct the
              simulator&apos;s values to match. Carrying real values into the simulator in this way is called
              real-to-sim. For the motors, this measurement is called system identification.
            </li>
          </ul>
          <Box variant="p">
            Each approach has a different cost. Domain randomisation adds training effort, because the policy has
            to do well in every variation of the simulator that the ranges allow. Measuring takes a person&apos;s
            time with the real arm and a small fitting job on a computer. For the {ARM}, the fitting code already
            exists. MuJoCo Playground is Google DeepMind&apos;s suite of robot tasks. It ships a script
            that fits 24 servo parameters, four for each of the six joints, from one teleoperated episode.{' '}
            <Cite id="F06-30">MuJoCo Playground, SO-101 sysid README</Cite>{' '}
            <Cite id="F06-25">MuJoCo Playground changelog, version 1.0.0</Cite> A teleoperated episode is a single
            recording in which a person moves the leader arm and the real arm follows (section 3, The Robot as a
            Computer).
          </Box>
          <AnimatedFigure
            name="closing the gap"
            steps={GAP_CAPTIONS}
            intervalMs={3000}
            caption={
              <>
                Each curve shows the spread of values that one property of the scene takes. Green is the simulator
                and yellow is the real setup. The dashed outline shows where the simulator&apos;s band started.
                Domain randomisation widens the green band, and measuring moves it. The curves are illustrative, not
                measured.
              </>
            }
          >
            {(step, reduced) => <GapDiagram step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            The task that Playground ships for this arm, <code>{SIM_TASK}</code>, uses both approaches. Its policy
            is trained on images from a simulated wrist camera. It is then deployed &quot;zero-shot onto the real
            robot&quot;, which means that it gets no further training on real data. The shipped task uses a cube
            where this dive&apos;s example uses a block. The policy learns to {SIM_TASK_PLAIN}. The rest of this
            dive&apos;s task, {SIM_TASK_GAP}, is an extension that this dive adds.{' '}
            <Cite id="F06-26">MuJoCo Playground, SO-101 deploy README</Cite>
          </Box>
          <Box variant="p">
            Each servo in the task has a gain. The gain sets how hard the servo pushes toward its target angle. The
            task&apos;s gains were identified from real teleoperation data. Even so, at the start of each episode
            the task multiplies the gains by a random factor, and it does the same for the damping that brakes each
            joint. In each episode it also draws new values for friction, command delay, colours and lighting, and
            for the calibration error described next. For the gains, the result is a measured centre with a
            randomised spread around it.{' '}
            <Cite id="F06-31">SO-101 constant.py</Cite>{' '}
            <Cite id="F06-28">SO-101 task.py, resetters</Cite>{' '}
            <Cite id="F06-27">SO-101 task.py, control delay</Cite>
          </Box>
          <Box variant="p">
            Calibration tells the software which angle each joint&apos;s encoder reading stands for. Calibration
            error also shows where a randomised range stops being enough. On this arm you calibrate by hand. First
            you hold each joint at the middle of its range. Then you move each joint except the wrist roll through its full
            range while the software records the extremes (section 3, The Robot as a Computer).{' '}
            <Cite id="F01-20">LeRobot motors_bus.py, record_calibration()</Cite> The task&apos;s deploy guide warns
            that the result &quot;can easily be off by 1-2+ cm in end-effector height&quot;. The end effector is the
            tool at the end of the arm, which here is the gripper. So the gripper can end up 10 to{' '}
            <Derived>20</Derived> mm or more higher or lower than the software thinks it is.{' '}
            <Cite id="F06-29">SO-101 deploy README, hardware behaviour</Cite> To cover mounting offsets, the task
            moves the arm&apos;s base up or down by up to 2.5 mm in each simulated episode, and the gripper moves
            with it. The rest of the calibration error has to be covered by a second range.{' '}
            <Cite id="F06-28">SO-101 task.py, resetters</Cite>
          </Box>
          <Box variant="p">
            The second range is a bias that the task adds to the simulated joint readings in each episode, plus
            noise that it adds at every step. The deploy guide describes the size of this range only in words. It
            says that the bias is there &quot;to tolerate moderate calibration error, but larger offsets will
            eventually degrade grasp success or cause the robot to slam the table&quot;. The policy has never
            trained on values outside its ranges. So when the real error is larger than the range covers, you have
            to measure the error and correct it.{' '}
            <Cite id="F06-29">SO-101 deploy README, hardware behaviour</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="For each source of the sim-to-real gap, the shipped task uses a measured value, a randomised range or both. The command delay is the one range that you can check against your own arm."
          >
            What the shipped task measures and what it randomises in each episode
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The table below lists each source of the gap and what the shipped task does about it. Where a row gives
            no number, the ranges are set in the task&apos;s <code>task.py</code>. Read that file before you widen
            any of them.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={TH}>Source of the gap</th>
                  <th style={TH}>What the simulator models</th>
                  <th style={TH}>What the task does about it</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>The servos</td>
                  <td style={TD}>
                    Each joint has a servo model with four constants. Two of them belong to a spring-and-brake
                    formula that pulls the joint toward its target and brakes its speed. The other two are the
                    armature, which is the motor&apos;s inertia felt at the joint, and the friction loss, which is the
                    joint&apos;s dry friction. The torque is capped at 2.94 N m.
                  </td>
                  <td style={TD}>
                    Measured and randomised. The gains were identified from real teleoperation data, and in each
                    episode the task multiplies them by a random factor.
                  </td>
                  <td style={TD}>
                    <Cite id="F06-31">SO-101 constant.py</Cite> <Cite id="F06-28">SO-101 task.py, resetters</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The joints</td>
                  <td style={TD}>Every joint has passive damping, which brakes it in proportion to its speed.</td>
                  <td style={TD}>Randomised. In each episode, the task multiplies the damping by a random factor.</td>
                  <td style={TD}>
                    <Cite id="F06-28">SO-101 task.py, resetters</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The fingertips</td>
                  <td style={TD}>The fingertips have sliding, torsional and rolling friction coefficients.</td>
                  <td style={TD}>Randomised. The task draws new coefficients in each episode.</td>
                  <td style={TD}>
                    <Cite id="F06-28">SO-101 task.py, resetters</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Calibration</td>
                  <td style={TD}>The simulated arm always knows exactly where its gripper is.</td>
                  <td style={TD}>
                    Randomised. In each episode, the task adds a bias to the joint readings and moves the base up or
                    down by up to 2.5 mm. It also adds new noise to the joint readings at every step.
                  </td>
                  <td style={TD}>
                    <Cite id="F06-28">SO-101 task.py, resetters</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Command timing</td>
                  <td style={TD}>
                    The physics advances in steps of 5 ms, and the policy chooses a new action every 100 ms.
                  </td>
                  <td style={TD}>
                    Randomised. In each episode, the task draws a new delay of 0 to 4 ms and applies it to every
                    command.
                  </td>
                  <td style={TD}>
                    <Cite id="F06-27">SO-101 task.py, control delay</Cite>{' '}
                    <Cite id="F06-105">simulation config and SO-101 task.py</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The camera image</td>
                  <td style={TD}>
                    The simulator renders one 64 x 64 image from the wrist camera for each decision of the policy.
                  </td>
                  <td style={TD}>
                    Randomised. The task varies the colours of the cube, the floor and the arm&apos;s links, the
                    lighting and the camera&apos;s parameters. It keeps the cube and floor colours in high contrast.
                    It also adds noise to every pixel (<code>pixel_noise_std=0.02</code>).
                  </td>
                  <td style={TD}>
                    <Cite id="F06-27">SO-101 task.py, camera settings</Cite>{' '}
                    <Cite id="F06-28">SO-101 task.py, resetters</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The cube</td>
                  <td style={TD}>The simulator gives the cube one size.</td>
                  <td style={TD}>
                    Randomised. The task draws new half-extents for the cube. A half-extent is half the cube&apos;s
                    size along one axis.
                  </td>
                  <td style={TD}>
                    <Cite id="F06-28">SO-101 task.py, resetters</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            The model file that the arm&apos;s maker publishes takes its servo constants from another robot: they
            &quot;are adapted from the Open Duck Mini project&quot;. The real servo&apos;s own settings do not carry
            over to the simulator either. When LeRobot connects to the arm, it writes P = 16, I = 0 and D = 32 to
            each servo (section 3, The Robot as a Computer). These are the gains of the control loop that runs
            inside each servo. They are in the servo firmware&apos;s units, while the simulated gain, 218 to 265, is
            in the model&apos;s units. So neither set of numbers can be copied into the other.{' '}
            <Cite id="F06-36">SO-ARM100 simulation README, motor parameters</Cite>{' '}
            <Cite id="F01-16">LeRobot so_follower.py, configure()</Cite>{' '}
            <Cite id="F06-31">SO-101 constant.py</Cite>
          </Box>
          <Box variant="p">
            SIMPLER is a 2024 suite for scoring real-robot policies in simulation. Its authors tested what happens
            when a real controller&apos;s gains are copied into a simulator. They replayed a recorded demonstration
            in the simulator with those gains. The simulated arm followed the recorded motion poorly and ended in
            &quot;a missed grasp on the coke can&quot;. After system identification, the same recorded actions
            grasped the can.{' '}
            <Cite id="F06-71">SIMPLER paper, section IV.A</Cite>
          </Box>
          <Box variant="p">
            The command delay is the one range that you can check against your own arm. A real command has to travel
            over the serial bus to the servos before it takes effect (section 3, The Robot as a Computer). To model
            this, the task delays the simulated commands by a random 0 to 4 ms, drawn again in each episode. Section
            3 uses an illustrative gripper speed of <Toy>0.25</Toy> m/s. At that speed, the gripper travels{' '}
            <Toy>0.25</Toy> m/s x 4 ms = 1 mm during the longest of these delays. The system-identification script estimates the real transport delay from its
            log, so you can compare the two values. If your arm&apos;s real delay is longer than 4 ms, the policy is
            running in conditions that it never trained on.{' '}
            <Cite id="F06-27">SO-101 task.py, control delay</Cite>{' '}
            <Cite id="F06-105">simulation config and SO-101 task.py</Cite>{' '}
            <Cite id="F06-30">SO-101 sysid README</Cite>
          </Box>
          <Box variant="p">
            The shipped task does not measure anything about the camera image; it only randomises it. It draws the
            cube and floor colours &quot;with high visual contrast&quot;, so the policy never sees a cube that it
            cannot tell apart from the floor. <Cite id="F06-28">SO-101 task.py, resetters</Cite> The deploy guide
            also says what the ranges do not cover. The task was &quot;tested on 3 different robot setups under
            various lighting conditions&quot;, and &quot;there may still be visual domain gap with darker
            shadows&quot;. The guide suggests two fixes. One changes the real setup, and the other changes the
            training:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Change the real setup.</strong> Bring the lighting inside the range the policy trained on:
              &quot;make sure the lighting conditions prevent darker shadows&quot;.
            </li>
            <li>
              <strong>Widen the range.</strong> Train with a new &quot;domain randomization recipe for the pixels
              inputs&quot;.{' '}
              <Cite id="F06-26">SO-101 deploy README, hardware behaviour</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="With domain randomisation, training looks for the policy with the best average score across all the versions of the simulator that the ranges allow. This makes the policy tolerant of the differences on the real arm. The cost is that part of the training goes to versions of the simulator that the real arm never produces."
          >
            Domain randomisation: training across a range of simulated worlds
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Domain randomisation was introduced for robot vision in 2017. The idea is that if the simulator varies
            enough, &quot;the real world may appear to the model as just another variation&quot;. The authors report
            an object detector that was accurate to 1.5 cm in the real world, although it was trained only on
            simulated images with unrealistic random textures. The textures did not have to look real. They only had
            to vary enough that the real scene looked like one more random draw.{' '}
            <Cite id="F06-66">Tobin et al., domain randomization paper, abstract</Cite>
          </Box>
          <Box variant="p">
            Randomisation changes what training tries to maximise. Reinforcement learning improves a policy from its
            own scored attempts (section 8, Reinforcement Learning for Robots). The score that an attempt earns is
            called the reward. In one fixed simulator, reinforcement learning looks for the policy that collects the
            most reward in that one simulated world. With randomisation, each episode runs in a different version of
            the simulated world. Training then looks for the policy that collects the most reward on average across
            all the versions that the ranges allow. The formula below writes this down with these symbols:
          </Box>
          <ul style={LIST}>
            <li>
              <M>{String.raw`\mu`}</M> is the set of randomised values drawn for one episode. Each draw of{' '}
              <M>{String.raw`\mu`}</M> describes one version of the simulated world, called a world for short.
            </li>
            <li>
              <M>{String.raw`\rho_\mu`}</M> is the distribution that <M>{String.raw`\mu`}</M> is drawn from. Here,
              it is the set of ranges.
            </li>
            <li>
              <M>{String.raw`\pi`}</M> is the policy.
            </li>
            <li>
              <M>{String.raw`\tau`}</M> is the trajectory of one episode: the states <M>s_t</M> and the actions{' '}
              <M>a_t</M> over <M>T</M> steps. How likely a trajectory is, written{' '}
              <M>{String.raw`p(\tau \mid \pi, \mu)`}</M>, depends on both the policy and the drawn world.
            </li>
            <li>
              <M>{String.raw`r(s_t, a_t)`}</M> is the reward at step <M>t</M>.
            </li>
            <li>
              <M>{String.raw`\mathbb{E}`}</M> is the average over whatever is written beneath it.
            </li>
          </ul>
          <Box variant="p">Training looks for the policy that makes this value as large as possible:</Box>
          <Formula
            name="Domain randomisation objective: expected return over sampled simulator parameters"
            tex={String.raw`\small \mathop{\mathbb{E}}_{\mu \sim \rho_\mu} \left[ \mathop{\mathbb{E}}_{\tau \sim p(\tau \mid \pi, \mu)} \left[ \sum_{t=0}^{T-1} r(s_t, a_t) \right] \right]`}
            source={<Cite id="F11-202">Peng et al., dynamics randomization paper v3, section IV</Cite>}
          />
          <Box variant="p">
            Read from the inside out, the formula has three parts. The sum is the reward that one episode collects.
            The inner average is the expected reward in one world <M>{String.raw`\mu`}</M>, and plain reinforcement
            learning maximises only this. The outer average runs over all the worlds, weighted by{' '}
            <M>{String.raw`\rho_\mu`}</M>. Because of the outer average, a policy that scores highly at one friction
            value and poorly at others now loses to a policy that scores well across the whole range. Training
            computes the outer average by sampling. It draws <M>{String.raw`\mu`}</M> once at the start of each
            episode and keeps it fixed until the episode ends. The shipped task works this way for most of its
            values, but it draws new joint-reading noise at every step.{' '}
            <Cite id="F11-202">Peng et al., dynamics randomization paper v3, sections IV and IV-C</Cite>{' '}
            <Cite id="F06-28">SO-101 task.py, resetters</Cite>
          </Box>
          <Box variant="p">
            The same average also explains the cost of a wide range. The real arm corresponds to one narrow band of
            values of <M>{String.raw`\mu`}</M>, and the outer average gives that band only its share of the weight.
            Every world that the range adds and the real arm never produces also takes a share of the training. So a
            policy can win on the wider average while it gives up some reward at the real arm&apos;s own values.
            This loss follows from the objective, but no figure for its size on this arm was found. A wider
            range also has to be learned within the same training budget, or the budget has to grow. In section 8,
            that budget is a training run of about 197 million control steps across 4,096 simulated arms.{' '}
            <Cite id="F11-202">Peng et al., dynamics randomization paper v3, section IV</Cite>{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>
          </Box>
          <Box variant="p">
            A range is the right tool for values that are hard to measure or that change over time. Isaac Lab is
            NVIDIA&apos;s robot-learning framework. The paper that describes it lists the parameters that are
            randomised in practice. On the physics side, they are friction, armature, gravity and mass. On the
            rendering side, they are texture, material and lighting. They are randomised because such parameters
            &quot;may be difficult to estimate accurately or may vary over time in the real world&quot;.{' '}
            <Cite id="F06-67">Isaac Lab paper, section 5.3</Cite> So you measure the values that you can measure, and
            you randomise over a range around the result, as the shipped task does for its servo gains. For a value that
            you cannot measure, the range has to cover every real setup that the policy will meet. Only trials on the
            real arm show whether it does.
          </Box>
          <Capture
            file="so101-domain-randomisation.jpg"
            kind="still"
            width={1200}
            height={600}
            alt="Six overhead views of the same arm, block and cup scene, each with a different floor colour, lighting, object colours and positions, and a slightly moved camera."
            caption={
              <>
                The image shows six random draws of one scene. Between the draws, the floor colour, the position
                and strength of the light, the colours and positions of the objects, the camera offset and the
                arm&apos;s tint all change, while the task stays the same. A policy trained across such draws has
                to find the object in all of them.
              </>
            }
            provenance={MUJOCO_SO101}
          />
          <ExpandableSection headerText={`What Isaac Lab 3.0.0 can randomise beyond the ${ARM} task`}>
            <Box variant="p">
              In Isaac Lab, randomisation is done by event functions. In version 3.0.0 they can randomise the scale,
              material (friction and restitution), mass, inertia, centre of mass and collider offsets of rigid
              bodies. They can also randomise the scene&apos;s gravity, actuator gains, joint parameters,
              fixed-tendon parameters, visual texture materials and colours, external pushes, and the states that
              episodes reset to. Compared with the {ARM} task&apos;s list, Isaac Lab adds mass, inertia, centre of
              mass, gravity and pushes, among others. Each task sets its own ranges.{' '}
              <Cite id="F06-68">Isaac Lab v3.0.0, envs/mdp/events.py</Cite>
            </Box>
            <Box variant="p">
              Isaac Sim&apos;s physics engine is PhysX. According to the November 2025 Isaac Lab paper, physics
              parameters such as mass, friction and armature on PhysX &quot;must be modified through the CPU
              API&quot;. So randomising them is CPU work inside a training run that otherwise runs on the GPU. The
              MuJoCo task shipped for this arm does not use PhysX, so this step does not apply to it.{' '}
              <Cite id="F06-69">Isaac Lab paper, section 5.3</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The fitting script adjusts four constants for each joint until the simulated arm follows a recording of the real arm. The fit replaces servo constants borrowed from another robot with constants fitted to your own arm."
          >
            System identification: fitting 24 servo constants to one teleoperated episode
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The goal of system identification is to make the simulated servo move like the real one. A person drives
            the real arm for one episode while the script logs the commands sent to the servos and the joint angles
            measured. The script then plays the same commands into the simulator. It adjusts the servo constants
            until the simulated joint angles follow the real ones. The script is built on <code>mujoco.sysid</code>,
            the system-identification toolbox in MuJoCo 4.0. You install the toolbox with{' '}
            <code>{'pip install -U "mujoco[sysid]"'}</code>. The {ARM} script is in Playground&apos;s{' '}
            <code>tasks/sysid/so101</code> directory.{' '}
            <Cite id="F06-30">MuJoCo Playground, SO-101 sysid README</Cite>{' '}
            <Cite id="F06-6">MuJoCo 4.0 announcement, sim-to-real row</Cite>
          </Box>
          <Box variant="p">
            The constants belong to a simple servo model. In this model, a spring pulls each joint toward its
            commanded angle, and a brake acts against the joint&apos;s speed. The real servo&apos;s control loop has
            the same structure. With I = 0, each real joint runs as a PD (proportional-derivative) controller
            (section 3, The Robot as a Computer). A PD controller pushes in proportion to the position error and
            brakes in proportion to the speed. In the formula, <M>{String.raw`q_{\text{target}}`}</M> is the
            commanded angle, <M>q</M> is the joint&apos;s current angle and <M>{String.raw`\dot{q}`}</M> is how fast
            the joint is turning. <M>k_p</M> is the position gain, which the model file calls stiffness, and{' '}
            <M>k_d</M> is the damping.{' '}
            <Cite id="F11-212">MuJoCo Playground, SO-101 scene.py, actuator setup</Cite>{' '}
            <Cite id="F01-16">LeRobot so_follower.py, configure()</Cite>
          </Box>
          <Formula
            name="PD servo model"
            tex={String.raw`\mathrm{torque} = k_p\,(q_{\text{target}} - q) - k_d\,\dot{q}`}
            source={
              <>
                <Cite id="F11-212">MuJoCo Playground, SO-101 scene.py (actuator setup)</Cite>{' '}
                <Cite id="F06-31">constant.py (values)</Cite>
              </>
            }
          />
          <Box variant="p">
            The first term is the spring: the further the joint is from its target, the harder the motor turns it.
            The second term is the brake: the faster the joint moves, the more torque the brake takes away. The
            torque is capped at plus or minus 2.94 N m. The code computes this cap from the stall torque on the
            servo&apos;s datasheet, 30 kg-cm at 12 V. Stall torque is the torque that a motor produces when it is
            held still at full power. Because the cap comes from the datasheet, the fit does not change it.{' '}
            <Cite id="F11-212">MuJoCo Playground, SO-101 scene.py, actuator setup</Cite>{' '}
            <Cite id="F06-31">SO-101 constant.py, FORCERANGE</Cite>
          </Box>
          <Box variant="p">
            You can work out the position error at which the spring term alone reaches the cap. The files do not
            state the unit of the gain. If you read it as newton-metres per radian, then at the lowest gain the
            spring term reaches the cap at an error of 2.94 / 218 = <Derived>0.0135</Derived> rad, which is under
            one degree. Any larger error asks for more torque than the cap allows. So the cap sets how hard every
            larger move starts.{' '}
            <Cite id="F11-212">MuJoCo Playground, SO-101 scene.py, actuator setup</Cite>{' '}
            <Cite id="F06-31">SO-101 constant.py, FORCERANGE</Cite>
          </Box>
          <Box variant="p">
            The 2.94 N m cap comes from the 12 V version of the servo. The follower arm is the {ARM} that copies the
            leader arm. The arm&apos;s bill of materials lists the 7.4 V version of the servo for the follower arm.
            That version is rated at 16.5 kg-cm (<Derived>1.62</Derived> N m) at 6 V. On that
            build, the simulated servo can push about 2.94 / 1.62 = <Derived>1.8</Derived> times harder than the
            real one at 6 V. On a 5 V supply the difference is larger, because the maker expects slightly less
            torque there. The fit does not change the cap. So check which servo your follower arm has, and set{' '}
            <code>FORCERANGE</code> in <code>constant.py</code> to match it.{' '}
            <Cite id="F06-31">SO-101 constant.py, FORCERANGE</Cite>{' '}
            <Cite id="F01-4">SO-ARM100 README, parts for two arms</Cite>{' '}
            <Cite id="F01-5">SO-ARM100 README, servo variants</Cite>
          </Box>
          <Box variant="p">
            Besides the two gains, two more constants act on the joint itself: the armature and the friction loss.
            The fit finds all four. The table below shows what each one does to the motion.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={TH}>Fitted constant</th>
                  <th style={TH}>What it does to the motion</th>
                  <th style={TH}>Values in Playground&apos;s constant.py across the 6 joints, in the model&apos;s units</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Gain (stiffness, kp)</td>
                  <td style={TD}>
                    The gain is how hard the servo pushes per unit of position error. It acts whenever the joint is
                    away from its target. If it is set too high, the simulated joint closes small errors faster than
                    the real one does.
                  </td>
                  <td style={TD}>218 to 265</td>
                  <td style={TD}>
                    <Cite id="F06-31">SO-101 constant.py</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Damping (kd)</td>
                  <td style={TD}>
                    The damping is how hard the servo brakes per unit of speed. It acts most when the joint moves
                    fast. If it is set too low, the simulated joint overshoots where the real one settles.
                  </td>
                  <td style={TD}>17.5 to 34.2</td>
                  <td style={TD}>
                    <Cite id="F06-31">SO-101 constant.py</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Armature</td>
                  <td style={TD}>
                    The armature is extra inertia at the joint from the spinning motor and its gears. It acts when
                    the joint speeds up or slows down. It makes the joint slower to start and to stop than the links
                    alone would be.
                  </td>
                  <td style={TD}>0.109 to 0.199</td>
                  <td style={TD}>
                    <Cite id="F06-31">SO-101 constant.py</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Friction loss</td>
                  <td style={TD}>
                    The friction loss is a constant resistance inside the joint that the motor has to overcome before
                    the joint moves. It resists every motion of the joint by the same amount, and its effect shows
                    most when the joint starts from rest.
                  </td>
                  <td style={TD}>Near zero on five joints, and 0.25 on the gripper</td>
                  <td style={TD}>
                    <Cite id="F06-31">SO-101 constant.py</Cite> <Cite id="F11-211">MuJoCo docs, friction loss</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            A constant that never acts in the recorded data cannot be fitted from it. So each of the 24 constants
            has to act somewhere in the one recording. A recording made for this purpose is called an excitation
            episode. The README does not set a length or a pattern for it.{' '}
            <Cite id="F06-30">SO-101 sysid README</Cite> So you plan the episode from what each constant does, and
            you include these motions on every joint:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>For the gain.</strong> Include small corrections near the target.
            </li>
            <li>
              <strong>For the damping.</strong> Include fast motion.
            </li>
            <li>
              <strong>For the armature.</strong> Include starts and stops.
            </li>
            <li>
              <strong>For the friction loss.</strong> Include starts from rest, where friction loss shows most.
            </li>
          </ul>
          <Box variant="p">
            The values in <code>constant.py</code> were identified from teleoperation data on someone else&apos;s
            arm. No figure for how much these constants vary from one arm to another was found. If you fit the
            constants to a log from your own arm and compare the result with the table, you can see how far your
            arm is from those values.{' '}
            <Cite id="F06-31">SO-101 constant.py</Cite>
          </Box>
          <Box variant="p">
            To compare candidate sets of constants, the script scores each set by how badly the simulated arm tracks
            the real one. In the formula below, <M>{String.raw`\theta`}</M> is the list of 24 constants.{' '}
            <M>{String.raw`q^{\text{real}}_{t,j}`}</M> is the measured angle of joint <M>j</M> at time <M>t</M>.{' '}
            <M>{String.raw`q^{\text{sim}}_{t,j}(\theta)`}</M> is the angle that the simulator produces at the same
            moment when it plays the logged commands with the constants <M>{String.raw`\theta`}</M>.
          </Box>
          <Formula
            name="System identification: squared tracking error over the episode"
            tex={String.raw`L(\theta) = \sum_{t,\,j} \bigl( q^{\text{real}}_{t,j} - q^{\text{sim}}_{t,j}(\theta) \bigr)^2`}
            source={
              <>
                the README describes the fit as &quot;minimizing rollout tracking error&quot;, and the formula writes
                this as a sum over moments and joints.{' '}
                <Cite id="F06-30">MuJoCo Playground, SO-101 sysid README</Cite>
              </>
            }
          />
          <Box variant="p">
            The bracket is the miss on one joint at one moment. Squaring the miss counts it the same in either
            direction and makes large misses count the most. The sum runs over every moment of the episode and all
            6 joints, so <M>{String.raw`L(\theta)`}</M> is one number for the whole recording. The fit looks for the{' '}
            <M>{String.raw`\theta`}</M> that makes this number as small as possible. The library may also give each
            term a weight, and its code for that was not checked.
          </Box>
          <Box variant="p">
            The script minimises <M>{String.raw`L(\theta)`}</M> with Gauss-Newton least squares. This is a fitting
            method for sums of squared misses, and it repeats one step. First, it works out how each miss changes
            when each constant changes. Then it moves all 24 constants at once to the values where the squared
            misses would be smallest if those changes held exactly. One way to find the changes is to re-run the
            simulation with each constant nudged in turn. In that case, one step costs 24 + 1 ={' '}
            <Derived>25</Derived> replays of the episode, and the replays do not depend on each other.{' '}
            <Cite id="F06-30">SO-101 sysid README</Cite>
          </Box>
          <Box variant="p">
            Before the fit, the script estimates the transport delay of the serial link and writes it to its log.
            The transport delay is the time that a command spends on its way to the servo. The script then lines up
            the command times with the measured motion, so that each measurement is compared with the command that
            caused it.{' '}
            <Cite id="F06-30">MuJoCo Playground, SO-101 sysid README</Cite>
          </Box>
          <Box variant="p">
            A fit can only choose constants for the formula it is given. It cannot add behaviour that the formula
            does not have. MuJoCo 4.0 offers more formulas to choose from: a <code>pid</code> actuator, a{' '}
            <code>dcmotor</code> actuator built from datasheet values, and actuator delays.{' '}
            <Cite id="F06-7">MuJoCo 4.0 announcement, actuators row</Cite> Isaac Lab goes further. It offers actuators
            that are neural networks trained on hardware data. They replace the PD loop of Isaac Lab&apos;s ideal
            actuator &quot;to better emulate the dynamic response of the actuator in the real world&quot;.{' '}
            <Cite id="F06-70">Isaac Lab paper, section 3.2</Cite>
          </Box>
          <Box variant="p">
            Calibration can also be measured instead of randomised. NVIDIA has an {ARM} typing project on Isaac Lab
            3.0, in which a policy presses keys on a fixed keyboard. The project ships tools that fit two things to
            recorded real key presses: the position and orientation of the simulated keyboard, and the joint-angle
            calibration. With these tools, the simulator&apos;s joint-angle calibration comes from a fit to recorded
            data.{' '}
            <Cite id="F06-55">Isaac Lab v3.0.0 docs, SO-101 typing policy</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="From a few minutes of video, you can build a simulated copy of the real scene, usually in under an hour on one GPU. The copy has the scene's appearance and the geometry of its surfaces. The physical properties of the objects, such as friction and mass, stay at the simulator's defaults."
          >
            Scanned scenes: building a simulated copy of the real table from video
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Real-to-sim can bring a whole scene into the simulator, as well as servo parameters. Usually the purpose
            is to test policies in simulation, which costs less than time on the real arm (section 16, Evaluation).
            In this direction the gap works in reverse: a policy trained on real data now has to work in the
            simulator. In a blog post of 2026-09-09 about one engagement, AWS reports that a model fine-tuned on real
            demonstrations scored 0% success in simulation. In the same simulator, models trained on clean
            simulation data reached 35% to 45%. The post gives no trial counts.{' '}
            <Cite id="F06-72">AWS Physical AI blog, Telexistence and DreamZero, post of 2026-09-09</Cite>
          </Box>
          <Box variant="p">
            To bring a real scene into the simulator, you film it with a camera. Gaussian splatting is a method that
            represents a filmed place as a cloud of small, soft, coloured blobs, called Gaussians or splats. It
            adjusts the positions, sizes and colours of the blobs until pictures drawn from the cloud match the
            frames of the video. After that, the cloud can be drawn from any viewpoint.
          </Box>
          <Box variant="p">
            PolaRiS is a research pipeline for testing policies in scanned scenes. It starts from a 2 to 5 minute
            video of the table, and from that video it does four things:
          </Box>
          <ul style={LIST}>
            <li>It recovers where the camera stood for each frame.</li>
            <li>It fits splats that give both the look of the scene and a mesh of its surfaces.</li>
            <li>It imports the meshes into Isaac Sim, so that objects have something to collide with.</li>
            <li>It attaches splats to the robot&apos;s links, so that the splats move with the robot.</li>
          </ul>
          <Box variant="p">
            The PolaRiS authors report that reconstruction &quot;typically completes within 30 minutes on an NVIDIA
            RTX 4090&quot;. They also report that it takes &quot;typically less than 20 minutes&quot; of a
            person&apos;s effort, and typically under one hour of wall time in all.{' '}
            <Cite id="F06-73">PolaRiS paper, section 4.1</Cite>
          </Box>
          <Box variant="p">
            VAMS is the open-source AWS solution for robot and 3D data that section 25, AWS Batch, describes. One of
            its pipelines runs the first of these steps and the splat fitting of the second on AWS, in one AWS Batch
            job on one GPU. It takes a set of photos or a video, recovers where the camera stood for each frame, fits
            the splats and exports them as splat files. Its documentation names no mesh export, so the surface meshes
            that PolaRiS imports into Isaac Sim come from another tool.{' '}
            <Cite id="F09-140">VAMS v2.6.7, Gaussian splatting pipeline docs</Cite>
          </Box>
          <Box variant="p">
            A scan measures how a scene looks and the geometry of its surfaces. It measures nothing about how the
            surfaces push back when the arm touches them. In PolaRiS, the physical parameters of the objects are
            Isaac Sim&apos;s defaults, and those of the arm come from its manufacturer. So the motors still need
            system identification. The scan also does not fully close the gap in appearance. Before PolaRiS scores a
            policy in a scanned scene, it fine-tunes the policy for 1k steps on about 350 simulated demonstrations
            from 15 other scanned scenes. This gets the policy used to how the simulator renders images. It is the
            same reverse gap that the AWS result showed, and PolaRiS handles it with a small amount of simulated
            data.{' '}
            <Cite id="F06-74">PolaRiS paper, sections 4.2 and 5.1</Cite>
          </Box>
          <Box variant="p">
            The Pearson correlation r is a measure from -1 to 1 of how closely two sets of scores rise and fall
            together. With the fine-tuning step, the PolaRiS authors report that scores in scanned scenes followed
            scores in real trials with an average Pearson correlation of r = 0.9 across six paired environments, and
            0.81 in the worst one. The real side of each comparison is 20 episodes per policy in each environment.
            The correlation is computed over a handful of policies, which is a small sample. So a scanned scene can
            rank candidate policies before you run real trials, but the best candidate still needs its own success
            count on the real arm. Section 16, Evaluation, covers the statistics.{' '}
            <Cite id="F06-83">PolaRiS paper, introduction and sections 5.1 and 5.2</Cite>
          </Box>
          <Box variant="p">
            Which GPU can draw a scanned scene depends on the renderer, as section 13, Rendering and Ray Tracing,
            explains. MuJoCo Warp and Isaac Sim both render splats, in different ways:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>MuJoCo Warp.</strong> MuJoCo Warp is the GPU version of MuJoCo (section 12, Physics
              Simulation). Its batch renderer ray traces standard splat files and combines them with the simulated
              objects, so an object in front hides the splats behind it. It does this without RTX hardware.{' '}
              <Cite id="F06-78">MuJoCo docs, MuJoCo Warp chapter, 3D Gaussian Splatting</Cite>
            </li>
            <li>
              <strong>Isaac Sim 6.2.0.</strong> Isaac Sim renders splats natively through its RTX renderer, and its
              scene files store them as OpenUSD ParticleField geometry.{' '}
              <Cite id="F06-77">Isaac Sim 6.2.0 docs, neural volume rendering</Cite> Isaac Sim does not support GPUs
              that have no ray-tracing (RT) cores, and the A100 and H100 are among those GPUs.{' '}
              <Cite id="F06-52">Isaac Sim 6.2.0 docs, requirements</Cite>
            </li>
          </ul>
          <Box variant="p">
            So on an A100 or H100, the documented option for a scanned scene is MuJoCo Warp&apos;s renderer, which
            does not need RT cores. However, no vendor documentation that names the A100 or H100 as supported for
            MuJoCo Warp&apos;s renderer was found (section 13, Rendering and Ray Tracing).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Domain randomisation, system identification and a scanned scene each need a different amount of a person's time and compute, and each has a different bottleneck. Once you know these costs, you can spend your time on the real arm in order, starting with the largest known error."
          >
            What each approach costs, and where to start on the real arm
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Compared with the training run of section 8, which takes about 197 million control steps across 4,096
            simulated arms, the two measurement approaches are small jobs. Domain randomisation has no job of its own
            unless you search for the best ranges.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={TH}>Approach</th>
                  <th style={TH}>A person&apos;s time</th>
                  <th style={TH}>Compute</th>
                  <th style={TH}>Bottleneck and how the job runs</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Domain randomisation</td>
                  <td style={TD}>No time with the real arm is needed. Choosing the ranges is design work.</td>
                  <td style={TD}>
                    There is no separate job, because the values are drawn at every reset inside the training run.
                    If you search for good ranges, the cost of training multiplies. DrEureka is a 2024 method in which a
                    language model proposes the ranges. Its authors report training 16 configurations for a
                    quadruped in parallel in 3 hours of wall-clock time. Two methods that try one configuration after
                    another took 10 and 20 hours.
                  </td>
                  <td style={TD}>
                    The bottleneck is the GPU of the training job. A wider range, or a search over ranges, adds to
                    the cost of that job.{' '}
                    <Cite id="F04-40">DrEureka paper, abstract and section V</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>System identification</td>
                  <td style={TD}>One teleoperated excitation episode, recorded after a careful hand calibration.</td>
                  <td style={TD}>
                    At every step of the fit, the script replays that one episode in MuJoCo. The README gives no
                    timing.
                  </td>
                  <td style={TD}>
                    The bottleneck is CPU cores. Each replay simulates one arm, which is the kind of job that section
                    12, Physics Simulation, runs on a CPU core. The job runs on one machine, and if the run is lost, it restarts from the
                    same log. <Cite id="F06-30">SO-101 sysid README</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>A scanned scene</td>
                  <td style={TD}>
                    PolaRiS typically needs under 20 minutes of a person&apos;s effort, and typically under an hour
                    of wall time in all.
                  </td>
                  <td style={TD}>
                    PolaRiS reconstruction typically takes under 30 minutes on one RTX 4090. 3DGRUT (v1.1.0) is
                    NVIDIA&apos;s reconstruction code for splats, and Isaac Sim&apos;s documentation points to it. Its
                    README reports average times on one RTX 5090 for the NeRF Synthetic and MipNeRF360 scene sets:
                    479 s and 2,869 s for its ray-traced method, and 215 s and 686 s for its rasterised method. So ray
                    tracing took <Derived>2.2</Derived> to <Derived>4.2</Derived> times as long (479 / 215 and 2,869 /
                    686).
                  </td>
                  <td style={TD}>
                    The bottleneck is the GPU, and the job needs one GPU for under an hour. The ray-traced method
                    needs a GPU with RT cores (section 13, Rendering and Ray Tracing).{' '}
                    <Cite id="F06-73">PolaRiS paper, section 4.1</Cite>{' '}
                    <Cite id="F06-75">3DGRUT README at v1.1.0, benchmark tables</Cite>{' '}
                    <Cite id="F06-77">Isaac Sim 6.2.0 docs, neural volume rendering</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            When the policy fails on the real arm, the kind of failure tells you which source of the gap to check
            first:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Fewer successful grasps, or an arm that hits the table.</strong> These point to a calibration
              offset that is larger than the bias the task trained on.{' '}
              <Cite id="F06-29">SO-101 deploy README, hardware behaviour</Cite>
            </li>
            <li>
              <strong>Failures in darker shadows.</strong> These point to the gap in appearance that the deploy guide
              warns about. <Cite id="F06-26">SO-101 deploy README, hardware behaviour</Cite>
            </li>
            <li>
              <strong>A simulated arm that tracks a replayed real recording poorly.</strong> This points to wrong
              servo constants, which is what the fit corrects.{' '}
              <Cite id="F06-71">SIMPLER paper, section IV.A</Cite>
            </li>
          </ul>
          <Box variant="p">
            To get the policy working on the real arm, start with the largest known error and work down the list:
          </Box>
          <ol style={LIST}>
            <li>
              Run the hand calibration (<code>lerobot-calibrate</code>) carefully, because it can leave the gripper
              10 to <Derived>20</Derived> mm or more off. <Cite id="F01-21">LeRobot SO-101 docs, calibrate</Cite>
            </li>
            <li>
              Check which servo your follower arm has, and compare its rated torque with the simulated cap of 2.94 N m.{' '}
              <Cite id="F06-31">SO-101 constant.py, FORCERANGE</Cite>
            </li>
            <li>
              Record one excitation episode and let the script fit the 24 servo parameters. Then compare the
              transport delay that the script logs with the task&apos;s 4 ms.{' '}
              <Cite id="F06-30">SO-101 sysid README</Cite>
            </li>
            <li>Train with the shipped randomisation around the fitted values.</li>
            <li>Light the table so that there are no dark shadows on it.</li>
            <li>
              Count successes on the real arm. The deploy guide does not publish a success rate, so you need your
              own count. Section 16, Evaluation, says how many trials you need before you can trust it.
            </li>
          </ol>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
