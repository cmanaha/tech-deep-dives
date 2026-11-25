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
  'The gap',
  'Domain randomisation widens the range',
  'The bench is inside the range',
  'Real-to-sim moves the simulator',
  'In practice: move it, then widen a little',
];

const GAP_CAPTIONS = [
  <>
    Take one property of the scene. The simulator produces a narrow band of values for it and the bench produces
    another. A policy trained on the left band has never met the right one.
  </>,
  <>
    Domain randomisation draws that property from a wider range at the start of every episode. The band the policy
    trains on grows.
  </>,
  <>
    The range now contains the bench. To the policy, the real arm is one more variation it has already practised
    on.
  </>,
  <>
    The other way. Start again from the narrow simulator and measure the bench: system identification fits the servo
    parameters and a scan rebuilds the scene. The simulator moves onto the real values.
  </>,
  <>
    Used together: measure what can be measured, then randomise a small range around it for what is left.
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
        <title id="sim-to-real-gap-title">Closing the gap between what the simulator produces and what the bench produces</title>
        <desc>
          Two distributions over one property of the scene. The simulated one starts narrow and apart from the real
          one. Domain randomisation widens it until it contains the real one. Real-to-sim moves the narrow simulated
          one onto the real one. Illustrative shapes, not measured.
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
          what the bench produces
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
        {/* what the bench produces, drawn last so it stays readable on top */}
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
            description={`Tell which simulator settings a policy has to be trained across and which ones you can measure on the arm, and fit the ${ARM}'s 24 servo parameters from one teleoperated episode (MuJoCo Playground v1.0.1 and MuJoCo 4.0, sources read 2026-11-20)`}
          >
            14. Sim-to-Real and Real-to-Sim: Widen the Simulator or Measure the Arm
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A simulator is a set of typed-in numbers, and a policy trained in one learns those numbers along with
            the task. The stiffness of each servo, the friction of each fingertip, the delay on each command and the
            colour of the light all sit in the scene&apos;s model file or the task&apos;s code (section 12, Physics
            Simulation), and the real {ARM} differs a little from every one. A policy
            survives the move to the real arm in one of two ways. Training varied the values until the real arm
            fell inside their range, which is domain randomisation. Or someone measured the arm and corrected the
            values, which for the motors is system identification.
          </Box>
          <Box variant="p">
            The two are paid for in different places. Randomisation is paid in training, by a policy that has to
            do well in every world the ranges allow. Measuring is paid in a person&apos;s time at the bench and a
            small fit on a computer, and on this arm the fit is already written. A script that ships with MuJoCo
            Playground, Google DeepMind&apos;s suite of robot tasks, fits 24 servo parameters, four for each of the
            six joints, from one teleoperated episode: a single recording of a person moving the leader arm while
            the real arm follows (section 3, The Robot as a Computer).{' '}
            <Cite id="F06-30">MuJoCo Playground, SO-101 sysid README</Cite>{' '}
            <Cite id="F06-25">MuJoCo Playground changelog, version 1.0.0</Cite>
          </Box>
          <AnimatedFigure
            name="closing the gap"
            steps={GAP_CAPTIONS}
            intervalMs={3000}
            caption={
              <>
                Each shape is the spread of values one property of the scene takes, green for the simulator and
                yellow for the bench; the dashed outline is where the simulator started. Widening moves the green
                edges out, measuring moves the green band. Illustrative, not measured.
              </>
            }
          >
            {(step, reduced) => <GapDiagram step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            The task Playground ships for this arm, <code>{SIM_TASK}</code>, uses both. Its policy is trained on
            images from a simulated wrist camera and deployed &quot;zero-shot onto the real robot&quot;, with no
            further training on real data. Its cube stands in for the bench task&apos;s block. It learns to{' '}
            {SIM_TASK_PLAIN}; {SIM_TASK_GAP} is this dive&apos;s extension. <Cite id="F06-26">MuJoCo Playground, SO-101 deploy README</Cite> Its servo gains were
            identified from real teleoperation data, and each episode still scales those gains and the joints&apos;
            damping by a random factor and redraws friction, calibration, command delay, colours and light: a
            measured centre with a randomised spread.{' '}
            <Cite id="F06-31">SO-101 constant.py</Cite>{' '}
            <Cite id="F06-28">SO-101 task.py, resetters</Cite>{' '}
            <Cite id="F06-27">SO-101 task.py, control delay</Cite>
          </Box>
          <Box variant="p">
            Calibration shows where a range stops working. On this arm it is done by hand: you hold each joint at
            the middle of its range, then sweep it through its full range while the software records the extremes
            (section 3). The task&apos;s deploy guide warns that this &quot;can easily be off by 1-2+ cm in
            end-effector height&quot;, the height of the gripper: 10 to <Derived>20</Derived> mm or more. Each episode moves the simulated
            arm&apos;s base up or down by up to 2.5 mm, for mounting offsets, and the gripper moves with it. The rest
            of a hand calibration&apos;s error has to fall inside a second range.{' '}
            <Cite id="F01-20">LeRobot motors_bus.py, record_calibration()</Cite>{' '}
            <Cite id="F06-29">SO-101 deploy README, hardware behaviour</Cite>{' '}
            <Cite id="F06-28">SO-101 task.py, resetters</Cite>
          </Box>
          <Box variant="p">
            That range, meant for calibration error, is a bias the task adds to the joint readings each episode,
            plus noise at every step. The guide sizes it only in words: it is there &quot;to tolerate moderate
            calibration error, but larger offsets will eventually degrade grasp success or cause the robot to slam
            the table&quot;. Past the edge of its ranges the policy has never trained, and the remedy there is to
            measure.{' '}
            <Cite id="F06-29">SO-101 deploy README, hardware behaviour</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The servos, joints, fingertips, calibration, timing, camera and cube each meet a measured constant, a randomised range or both, and the command delay is the one range you can check against your own arm"
          >
            What the shipped task measures and what it redraws every episode
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Where a row gives no number, the scale factor is set
            in the task&apos;s <code>task.py</code>, the file to read before you widen any of them.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={TH}>Source of the gap</th>
                  <th style={TH}>What the simulator holds</th>
                  <th style={TH}>What the task does about it</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>The servos</td>
                  <td style={TD}>
                    A spring-and-brake formula per joint, plus the joint&apos;s armature (the motor&apos;s inertia
                    felt at the joint) and friction loss (its dry friction): four constants per joint, torque
                    capped at 2.94 N m
                  </td>
                  <td style={TD}>
                    Measured: the gains were identified from real teleoperation data. Randomised: the gains are
                    scaled each episode.
                  </td>
                  <td style={TD}>
                    <Cite id="F06-31">SO-101 constant.py</Cite> <Cite id="F06-28">SO-101 task.py, resetters</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The joints</td>
                  <td style={TD}>Passive damping on every joint</td>
                  <td style={TD}>Randomised: scaled each episode.</td>
                  <td style={TD}>
                    <Cite id="F06-28">SO-101 task.py, resetters</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The fingertips</td>
                  <td style={TD}>Sliding, torsional and rolling friction coefficients</td>
                  <td style={TD}>Randomised each episode.</td>
                  <td style={TD}>
                    <Cite id="F06-28">SO-101 task.py, resetters</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Calibration</td>
                  <td style={TD}>An arm that knows exactly where its gripper is</td>
                  <td style={TD}>
                    Randomised: a bias on the joint readings for each episode plus noise redrawn at every step, and
                    the base height by plus or minus 2.5 mm.
                  </td>
                  <td style={TD}>
                    <Cite id="F06-28">SO-101 task.py, resetters</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Command timing</td>
                  <td style={TD}>Physics steps every 5 ms; the policy acts every 100 ms</td>
                  <td style={TD}>Randomised: a delay of 0 to 4 ms on every command.</td>
                  <td style={TD}>
                    <Cite id="F06-27">SO-101 task.py, control delay</Cite>{' '}
                    <Cite id="F06-105">simulation config and SO-101 task.py</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The camera image</td>
                  <td style={TD}>One rendered 64 x 64 wrist-camera image per decision</td>
                  <td style={TD}>
                    Randomised: cube and floor colours (kept in high contrast), the colours of the arm&apos;s
                    links, the lighting, the camera&apos;s parameters, and noise on every pixel (
                    <code>pixel_noise_std=0.02</code>).
                  </td>
                  <td style={TD}>
                    <Cite id="F06-27">SO-101 task.py, camera settings</Cite>{' '}
                    <Cite id="F06-28">SO-101 task.py, resetters</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The cube</td>
                  <td style={TD}>Its size</td>
                  <td style={TD}>Randomised: the cube&apos;s half-extents.</td>
                  <td style={TD}>
                    <Cite id="F06-28">SO-101 task.py, resetters</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            The model file the arm&apos;s maker publishes borrows its servo constants from another robot: they
            &quot;are adapted from the Open Duck Mini project&quot;. The real servo&apos;s own numbers do not
            carry over either. LeRobot writes P = 16, I = 0 and D = 32, the gains of the control loop inside each
            servo, when it connects (section 3). Those are in the servo firmware&apos;s units and the simulated gain,
            218 to 265, is in the model&apos;s, so neither copies into the other.{' '}
            <Cite id="F06-36">SO-ARM100 simulation README, motor parameters</Cite>{' '}
            <Cite id="F01-16">LeRobot so_follower.py, configure()</Cite>{' '}
            <Cite id="F06-31">SO-101 constant.py</Cite>
          </Box>
          <Box variant="p">
            SIMPLER, a 2024 suite for scoring real-robot policies in simulation, measured what copying a real
            controller&apos;s gains into a simulator does. Its authors replayed a recorded demonstration with those
            gains, and the simulated arm tracked the motion poorly and ended in &quot;a missed grasp on the coke
            can&quot;. After system identification the same recorded actions grasped it.{' '}
            <Cite id="F06-71">SIMPLER paper, section IV.A</Cite>
          </Box>
          <Box variant="p">
            The command delay is the range you can check. A real command crosses the serial bus to the servos
            before it acts (section 3), so the task delays each simulated command by a random 0 to 4 ms. At section 3&apos;s illustrative gripper speed of <Toy>0.25</Toy> m/s, the
            longest of those delays is <Toy>0.25</Toy> m/s x 4 ms = 1 mm of travel. The system-identification
            script estimates the real transport delay from its log, so compare the two: a real delay longer than 4
            ms puts the policy in a world it never trained in.{' '}
            <Cite id="F06-27">SO-101 task.py, control delay</Cite>{' '}
            <Cite id="F06-105">simulation config and SO-101 task.py</Cite>{' '}
            <Cite id="F06-30">SO-101 sysid README</Cite>
          </Box>
          <Box variant="p">
            The camera image is the part the shipped task only randomises. It draws the cube and floor colours &quot;with high visual contrast&quot;, so the policy is
            never shown a cube it cannot tell from the floor. <Cite id="F06-28">SO-101 task.py, resetters</Cite> The
            deploy guide states what the ranges leave uncovered. The task was &quot;tested on 3 different robot
            setups under various lighting conditions&quot;, and &quot;there may still be visual domain gap with
            darker shadows&quot;. Its two remedies work from opposite ends: move
            the bench into the range (&quot;make sure the lighting conditions prevent darker shadows&quot;), or
            widen the range with a new &quot;domain randomization recipe for the pixels inputs&quot;.{' '}
            <Cite id="F06-26">SO-101 deploy README, hardware behaviour</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The policy is trained for the average over every world the ranges allow, so a range buys tolerance of the bench and spends training on every world the bench never produces"
          >
            Domain randomisation trains for the average over a range of worlds
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Domain randomisation was introduced for robot vision in 2017 on one bet: with enough
            variability in the simulator, &quot;the real world may appear to the model as just another
            variation&quot;. Its authors report an object detector accurate to 1.5 cm in the real world, trained
            only on simulated images with non-realistic random textures. The textures never had to look real. They
            had to vary enough that the real scene was one more draw.{' '}
            <Cite id="F06-66">Tobin et al., domain randomization paper, abstract</Cite>
          </Box>
          <Box variant="p">
            Randomising changes what training maximises. Reinforcement learning, which improves a policy from its
            own scored attempts (section 8, Reinforcement Learning for Robots), looks in one fixed simulator for the
            policy that collects the most reward, the score each attempt earns, in that one world. With
            randomisation the target is that reward averaged over every world the ranges can produce. Write{' '}
            <M>{String.raw`\mu`}</M> for the list of randomised values drawn for one episode and{' '}
            <M>{String.raw`\rho_\mu`}</M> for the distribution they are drawn from, which is the set of ranges.{' '}
            <M>{String.raw`\pi`}</M> is the policy. <M>{String.raw`\tau`}</M> is one episode&apos;s trajectory: the
            states <M>s_t</M> and actions <M>a_t</M> over <M>T</M> steps, whose likelihood{' '}
            <M>{String.raw`p(\tau \mid \pi, \mu)`}</M> depends on both the policy and the drawn world.{' '}
            <M>{String.raw`r(s_t, a_t)`}</M> is the reward at step <M>t</M>, and{' '}
            <M>{String.raw`\mathbb{E}`}</M> is an average over whatever is written beneath it. Training looks for
            the policy that makes this largest:
          </Box>
          <Formula
            name="Domain randomisation objective: expected return over sampled simulator parameters"
            tex={String.raw`\small \mathop{\mathbb{E}}_{\mu \sim \rho_\mu} \left[ \mathop{\mathbb{E}}_{\tau \sim p(\tau \mid \pi, \mu)} \left[ \sum_{t=0}^{T-1} r(s_t, a_t) \right] \right]`}
            source={<Cite id="F11-202">Peng et al., dynamics randomization paper v3, section IV</Cite>}
          />
          <Box variant="p">
            The sum is the reward one episode collects. The inner average is the expected reward in one world{' '}
            <M>{String.raw`\mu`}</M>, which is all that plain reinforcement learning maximises. The outer average
            runs over worlds, weighted by <M>{String.raw`\rho_\mu`}</M>. A policy that scores highly at one
            friction value and poorly elsewhere now loses to one that scores well across the range. The outer
            average is taken by sampling: one draw of <M>{String.raw`\mu`}</M> at the start of each episode, held
            fixed until it ends. The shipped task works that way for most of its values; its joint-reading noise is
            redrawn at every step.{' '}
            <Cite id="F11-202">Peng et al., dynamics randomization paper v3, sections IV and IV-C</Cite>{' '}
            <Cite id="F06-28">SO-101 task.py, resetters</Cite>
          </Box>
          <Box variant="p">
            The same average sets the price of a wide range. The bench is one narrow band of <M>{String.raw`\mu`}</M>,
            and the outer average gives it only its share of the weight. Every world the range adds that the bench
            never produces also takes a share of training, so a policy that wins a wider average can give up reward
            at the bench&apos;s own value to do it. That follows from the objective, and no figure for it on this arm was found. A wider range also has to be learned inside the same budget, the training run of
            section 8 at about 197 million control steps across 4,096 simulated arms, or the budget grows.{' '}
            <Cite id="F11-202">Peng et al., dynamics randomization paper v3, section IV</Cite>{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>
          </Box>
          <Box variant="p">
            A range is the right tool for what cannot be measured well or will not stay put. The paper behind Isaac
            Lab, NVIDIA&apos;s robot-learning framework, lists friction, armature, gravity and mass as the physics
            parameters randomised in practice, and texture, material and lighting on the rendering side, because
            such parameters &quot;may be difficult to estimate accurately or may vary over time in the real
            world&quot;. <Cite id="F06-67">Isaac Lab paper, section 5.3</Cite> Measure what can be measured and randomise around the result, as the shipped task does for its gains. For one that
            cannot, the range has to reach every bench the policy will meet, and only trials on the real arm show
            whether it does.
          </Box>
          <Capture
            file="so101-domain-randomisation.jpg"
            kind="still"
            width={1200}
            height={600}
            alt="Six overhead views of the same arm, block and cup scene, each with a different floor colour, lighting, object colours and positions, and a slightly moved camera."
            caption={
              <>
                Six draws of one scene: floor colour, light position and strength, object colours and positions,
                the camera offset and the arm&apos;s tint change between them; the task stays the same. A policy
                trained across such draws has to find the object in all of them.
              </>
            }
            provenance={MUJOCO_SO101}
          />
          <ExpandableSection headerText={`What Isaac Lab 3.0.0 can randomise beyond the ${ARM} task`}>
            <Box variant="p">
              Isaac Lab&apos;s event functions at 3.0.0 cover rigid-body scale, material (friction and restitution),
              mass, inertia, centre of mass and collider offsets; the scene&apos;s gravity; actuator gains; joint
              parameters; fixed-tendon parameters; visual texture materials and colours; external pushes; and
              randomised reset states. Set beside the {ARM} task&apos;s list, it adds mass, inertia, centre of mass,
              gravity and pushes. The ranges are set per task.{' '}
              <Cite id="F06-68">Isaac Lab v3.0.0, envs/mdp/events.py</Cite>
            </Box>
            <Box variant="p">
              On Isaac Sim&apos;s PhysX engine, as the November 2025 Isaac Lab paper describes it, physics
              parameters such as mass, friction and armature &quot;must be modified through the CPU API&quot;, so
              randomising them is CPU work inside an otherwise GPU training run. The MuJoCo task shipped for this
              arm does not take that path.{' '}
              <Cite id="F06-69">Isaac Lab paper, section 5.3</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Four constants per joint, fitted by least squares to one recording, turn a borrowed servo model into this arm's"
          >
            System identification fits 24 servo constants to one teleoperated episode
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            System identification makes the simulated servo move like the real one. A person drives the real arm
            for one episode while the script logs the commands sent and the joint angles measured. The script then
            plays the same commands into the simulator and adjusts the servo constants until the simulated angles
            follow the real ones. The tool underneath is <code>mujoco.sysid</code>, part of MuJoCo 4.0 and installed
            with <code>{'pip install -U "mujoco[sysid]"'}</code>; the {ARM} script built on it ships in
            Playground&apos;s <code>tasks/sysid/so101</code> directory.{' '}
            <Cite id="F06-30">MuJoCo Playground, SO-101 sysid README</Cite>{' '}
            <Cite id="F06-6">MuJoCo 4.0 announcement, sim-to-real row</Cite>
          </Box>
          <Box variant="p">
            The constants belong to a simple servo model, a spring pulling each joint toward its commanded angle
            and a brake on its speed. The real servo&apos;s loop has the same structure: with I = 0, each real joint runs as
            a PD (proportional-derivative) controller, which pushes in proportion to the error and brakes in
            proportion to the speed (section 3). Write <M>{String.raw`q_{\text{target}}`}</M> for the commanded
            angle, <M>q</M> for the joint&apos;s current angle and <M>{String.raw`\dot{q}`}</M> for how fast it is
            turning. <M>k_p</M> is the position gain, which the model file calls stiffness, and <M>k_d</M> is the
            damping.{' '}
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
            The first term is the spring: the further the joint is from its goal, the harder the motor turns it.
            The second is the brake: the faster the joint moves, the more torque it takes away. The result is capped at plus or minus 2.94 N m, which the code computes from the stall torque on the servo&apos;s datasheet, 30 kg-cm at 12 V, so the cap is not fitted.{' '}
            <Cite id="F11-212">MuJoCo Playground, SO-101 scene.py, actuator setup</Cite>{' '}
            <Cite id="F06-31">SO-101 constant.py, FORCERANGE</Cite>
          </Box>
          <Box variant="p">
            Read in newton-metres per radian, a unit the files do not
            state, the spring term alone at the lowest gain reaches the cap at an error of 2.94 / 218 ={' '}
            <Derived>0.0135</Derived> rad, under one degree. Any larger error asks for more torque than the cap
            allows, so the cap sets how hard every larger move starts.{' '}
            <Cite id="F11-212">MuJoCo Playground, SO-101 scene.py, actuator setup</Cite>{' '}
            <Cite id="F06-31">SO-101 constant.py, FORCERANGE</Cite>
          </Box>
          <Box variant="p">
            That cap is the 12 V servo&apos;s. The arm&apos;s bill of materials builds the follower from the 7.4 V
            version, which its maker rates at 16.5 kg-cm (<Derived>1.62</Derived> N m) at 6 V. On that build the simulated
            servo can push about 2.94 / 1.62 = <Derived>1.8</Derived> times harder than the real one, and the fit leaves the cap
            alone, so check which servo your follower has and set <code>FORCERANGE</code> in <code>constant.py</code> to match. Two more constants act on the
            joint itself, armature and friction loss, and the fit finds all four.{' '}
            <Cite id="F06-31">SO-101 constant.py, FORCERANGE</Cite>{' '}
            <Cite id="F01-4">SO-ARM100 README, parts for two arms</Cite>{' '}
            <Cite id="F01-5">SO-ARM100 README, servo variants</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={TH}>Fitted constant</th>
                  <th style={TH}>What it does to the motion</th>
                  <th style={TH}>Checked-in values across the 6 joints, in the model&apos;s units</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Gain (stiffness, kp)</td>
                  <td style={TD}>
                    How hard the servo pushes per unit of error. It acts whenever the joint is away from its goal;
                    set too high, the simulated joint closes small errors faster than the real one.
                  </td>
                  <td style={TD}>218 to 265</td>
                  <td style={TD}>
                    <Cite id="F06-31">SO-101 constant.py</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Damping (kd)</td>
                  <td style={TD}>
                    How hard the servo brakes per unit of speed. It acts most when the joint moves fast; set too
                    low, the simulated joint overshoots where the real one settles.
                  </td>
                  <td style={TD}>17.5 to 34.2</td>
                  <td style={TD}>
                    <Cite id="F06-31">SO-101 constant.py</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Armature</td>
                  <td style={TD}>
                    Extra inertia at the joint from the spinning motor and its gears. It acts when the joint
                    speeds up or slows down, making it slower to start and to stop than the links alone would be.
                  </td>
                  <td style={TD}>0.109 to 0.199</td>
                  <td style={TD}>
                    <Cite id="F06-31">SO-101 constant.py</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Friction loss</td>
                  <td style={TD}>
                    A constant resistance inside the joint that the motor has to overcome before anything moves. It
                    acts when the joint starts from rest.
                  </td>
                  <td style={TD}>Near zero on five joints, 0.25 on the gripper</td>
                  <td style={TD}>
                    <Cite id="F06-31">SO-101 constant.py</Cite> <Cite id="F11-211">MuJoCo docs, friction loss</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Each of the 24 constants has to act somewhere in the one recording, because a constant that never acts
            in the data cannot be fitted from it. A recording driven for that purpose is called an excitation
            episode. The README sets no length or pattern for it, so the constants&apos; roles set what it
            must hold: small corrections near the target for the gain, fast motion for damping, starts and stops for armature, and moves from rest for friction loss, on every joint.{' '}
            <Cite id="F06-30">SO-101 sysid README</Cite>
          </Box>
          <Box variant="p">
            The checked-in values came from teleoperation data on someone else&apos;s arm, and no spread between arms was found. A fit to a log from your own arm, set beside the table, shows how far
            yours sits from them.{' '}
            <Cite id="F06-31">SO-101 constant.py</Cite>
          </Box>
          <Box variant="p">
            The script scores a candidate set of constants by how badly the simulated arm tracks the real one.
            Write <M>{String.raw`\theta`}</M> for the list of 24 constants,{' '}
            <M>{String.raw`q^{\text{real}}_{t,j}`}</M> for the measured angle of joint <M>j</M> at time <M>t</M>,
            and <M>{String.raw`q^{\text{sim}}_{t,j}(\theta)`}</M> for the angle the simulator produces at the same
            moment when it plays the logged commands with <M>{String.raw`\theta`}</M>.
          </Box>
          <Formula
            name="System identification: squared tracking mismatch over the episode"
            tex={String.raw`L(\theta) = \sum_{t,\,j} \bigl( q^{\text{real}}_{t,j} - q^{\text{sim}}_{t,j}(\theta) \bigr)^2`}
            source={
              <>
                the README&apos;s description of the fit, &quot;minimizing rollout tracking error&quot;, written as
                a sum over moments and joints.{' '}
                <Cite id="F06-30">MuJoCo Playground, SO-101 sysid README</Cite>
              </>
            }
          />
          <Box variant="p">
            The bracket is the miss on one joint at one moment. Squaring counts a miss the same in either direction
            and makes large misses count most. The sum runs over every moment of the episode and all 6 joints, so{' '}
            <M>{String.raw`L(\theta)`}</M> is one number for the whole recording, and the fit looks for the{' '}
            <M>{String.raw`\theta`}</M> that makes it smallest.
          </Box>
          <Box variant="p">
            The script minimises it with Gauss-Newton least squares, a method for sums of squared misses that
            repeats one move: work out how each miss changes when each constant changes, then step all 24
            constants at once to where the squared misses would be smallest if those changes held exactly. If the
            changes are found by re-simulating with each constant nudged in turn, one step costs 24 + 1 ={' '}
            <Derived>25</Derived> replays of the episode, and those replays do not depend on each other.{' '}
            <Cite id="F06-30">SO-101 sysid README</Cite>
          </Box>
          <Box variant="p">
            Before the fit, the script estimates and logs the transport delay of the serial link, the time a command spends on
            its way to the servo, and aligns the command times with the measured rollout, so each measurement is compared with the command behind it.{' '}
            <Cite id="F06-30">MuJoCo Playground, SO-101 sysid README</Cite>
          </Box>
          <Box variant="p">
            A fit chooses constants for the formula it is given and cannot add behaviour the formula lacks. MuJoCo
            4.0 widens the choice of formula with a <code>pid</code> actuator, a <code>dcmotor</code> actuator built
            from datasheet values, and actuator delays. <Cite id="F06-7">MuJoCo 4.0 announcement, actuators row</Cite>{' '}
            Isaac Lab goes further, with actuators that are neural networks trained on hardware data in place of the
            PD loop of its ideal actuator, &quot;to better emulate the dynamic response of the actuator in the real
            world&quot;. <Cite id="F06-70">Isaac Lab paper, section 3.2</Cite>
          </Box>
          <Box variant="p">
            Calibration can be measured too. NVIDIA&apos;s {ARM} typing project on Isaac Lab 3.0, a policy that
            presses keys on a fixed keyboard, ships tools that fit the simulated keyboard&apos;s pose and the
            joint-angle calibration from recorded real key presses. Calibration then becomes a fit to recorded data,
            in place of a pose held by hand.{' '}
            <Cite id="F06-55">Isaac Lab v3.0.0 docs, SO-101 typing policy</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A few minutes of video and under an hour of GPU time give the look and the shape of the bench, while friction and mass stay at their defaults"
          >
            A scanned scene measures what the camera sees
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Real-to-sim carries something real into the simulator, usually so that policies can be tested there at
            the price of simulation instead of real-arm time (section 16, Evaluation). On that trip the gap runs in
            reverse. In a post of 2026-09-09 on one engagement, AWS reports that a model fine-tuned on real
            demonstrations scored 0% success in simulation, where models trained on clean simulation data reached
            35% to 45% in the same simulator; the post gives no trial counts.{' '}
            <Cite id="F06-72">AWS Physical AI blog, Telexistence and DreamZero, post of 2026-09-09</Cite>
          </Box>
          <Box variant="p">
            A scene is measured with a camera. Gaussian splatting represents a filmed place as a cloud of small,
            soft, coloured blobs (the Gaussians) and adjusts their positions, sizes and colours until pictures drawn
            from the cloud match the frames of the video, after which the cloud can be drawn from any viewpoint.
          </Box>
          <Box variant="p">
            PolaRiS, a research pipeline for testing policies in scanned scenes, starts from a 2 to 5 minute video
            of the table. It recovers where the camera stood for each frame, fits splats that give both the look of
            the scene and a mesh of its surfaces, imports the meshes into Isaac Sim so objects have something to
            collide with, and attaches splats to the robot&apos;s links so they move with it. The PolaRiS authors
            report that reconstruction &quot;typically completes within 30 minutes on an NVIDIA RTX 4090&quot;, with
            &quot;typically less than 20 minutes&quot; of a person&apos;s effort and under one hour of wall time in
            all. <Cite id="F06-73">PolaRiS paper, section 4.1</Cite>
          </Box>
          <Box variant="p">
            A scan measures the look of a scene and the shape of its surfaces, and nothing of how they push back.
            In PolaRiS the objects&apos; physics are Isaac Sim&apos;s defaults and the arm&apos;s are its
            manufacturer&apos;s, so the motors stay a job for system identification. The gap in the look is not fully closed either. Before scoring a policy in a scanned scene, PolaRiS fine-tunes it for 1k steps on about 350
            simulated demonstrations from 15 other scanned scenes, so that the policy is used to how the simulator renders. That is the reverse gap of the AWS result, met with a little simulated data. <Cite id="F06-74">PolaRiS paper, sections 4.2 and 5.1</Cite>
          </Box>
          <Box variant="p">
            With that adaptation, the same authors report that scores in scanned scenes followed real trials at an
            average Pearson correlation of r = 0.9 across six paired environments, and 0.81 in the worst. Pearson&apos;s
            r runs from -1 to 1 and measures how closely two sets of scores rise and fall together. The real side
            is 20 rollouts per policy in each environment, and the correlation runs over four policies, a small
            sample. A scanned scene can order candidate policies before real trials; the leader still earns its
            count on the arm, and section 16 weighs the statistics.{' '}
            <Cite id="F06-83">PolaRiS paper, introduction and sections 5.1 and 5.2</Cite>
          </Box>
          <Box variant="p">
            Which GPU draws the scanned scene depends on the renderer, as in section 13, Rendering and Ray Tracing.
            MuJoCo Warp, the GPU version of MuJoCo (section 12), ray traces standard splat files in its batch
            renderer and composites them with the simulated objects, so an object in front hides the splats behind
            it, with no RTX hardware involved.{' '}
            <Cite id="F06-78">MuJoCo docs, MuJoCo Warp chapter, 3D Gaussian Splatting</Cite> Isaac Sim 6.2.0 renders
            splats natively through its RTX renderer, stored in its scene files as OpenUSD ParticleField geometry.{' '}
            <Cite id="F06-77">Isaac Sim 6.2.0 docs, neural volume rendering</Cite> It does not support GPUs without
            RT cores, the ray-tracing units, and names the A100 and H100 among them, so on those GPUs a scanned
            scene goes through MuJoCo Warp.{' '}
            <Cite id="F06-52">Isaac Sim 6.2.0 docs, requirements</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Each approach loads a different part of the machine, and a person's bench time goes first to the largest error"
          >
            What each fix costs, and where the bench time goes first
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Beside the training run of section 8, about 197 million control steps across 4,096 simulated arms, the
            two measurements are small jobs, and randomisation has no job of its own until someone searches its
            ranges.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={TH}>Approach</th>
                  <th style={TH}>A person&apos;s time</th>
                  <th style={TH}>Compute</th>
                  <th style={TH}>The part it fills, and the job&apos;s shape</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Domain randomisation</td>
                  <td style={TD}>None at the bench; choosing the ranges is design work.</td>
                  <td style={TD}>
                    No job of its own: values drawn at every reset, inside the training run. Searching the ranges multiplies the run: DrEureka, a 2024 method in which a language model proposes the ranges, trained 16 configurations for a quadruped in parallel, in 3 hours of
                    wall-clock against 10 and 20 hours for two methods that try one configuration after another.
                  </td>
                  <td style={TD}>
                    The training job&apos;s GPU; a wider range, or a search over ranges, is paid in that job.{' '}
                    <Cite id="F04-40">DrEureka paper, abstract and section V</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>System identification</td>
                  <td style={TD}>One teleoperated excitation episode, after a careful hand calibration.</td>
                  <td style={TD}>
                    Replays of that one episode in MuJoCo, repeated at every step of the fit. The README publishes
                    no timing.
                  </td>
                  <td style={TD}>
                    CPU cores: each replay steps one simulated arm, the kind of job section 12 puts on a core. One
                    machine; a lost run restarts from the same log. <Cite id="F06-30">SO-101 sysid README</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>A scanned scene</td>
                  <td style={TD}>Under 20 minutes, and under an hour of wall time in all, for PolaRiS.</td>
                  <td style={TD}>
                    Under 30 minutes on one RTX 4090 for PolaRiS. NVIDIA&apos;s 3DGRUT (v1.1.0), the reconstruction
                    code Isaac Sim&apos;s docs point to for splats, reports averages on one RTX 5090 on the NeRF
                    Synthetic and MipNeRF360 scene sets: 479 s and 2,869 s for its ray-traced method, 215 s and 686
                    s for its rasterised one. Ray tracing took <Derived>2.2</Derived> to <Derived>4.2</Derived> times
                    as long (479 / 215 and 2,869 / 686).
                  </td>
                  <td style={TD}>
                    One GPU for under an hour; the ray-traced method wants RT cores (section 13).{' '}
                    <Cite id="F06-73">PolaRiS paper, section 4.1</Cite>{' '}
                    <Cite id="F06-75">3DGRUT README at v1.1.0, benchmark tables</Cite>{' '}
                    <Cite id="F06-77">Isaac Sim 6.2.0 docs, neural volume rendering</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            At the bench a symptom points first to one source. A grasp that succeeds less often, or an arm that
            hits the table, points to a calibration offset larger than the bias the task trained on. Failures in
            darker shadows point to the appearance gap the deploy guide warns of. A simulated arm that tracks a
            replayed real recording poorly points to wrong servo constants, which is what the fit corrects.{' '}
            <Cite id="F06-29">SO-101 deploy README, hardware behaviour</Cite>{' '}
            <Cite id="F06-26">SO-101 deploy README, hardware behaviour</Cite>{' '}
            <Cite id="F06-71">SIMPLER paper, section IV.A</Cite>
          </Box>
          <Box variant="p">
            So start where the known error is largest. Run the hand calibration (<code>lerobot-calibrate</code>) with care, since it can leave the gripper 10 to <Derived>20</Derived> mm or more out. Check which servo your follower has against the simulated cap of 2.94
            N m. Record one excitation episode, let the script fit the 24 servo parameters, and check the transport delay it logs against the task&apos;s 4 ms. Train with the shipped randomisation around the fitted values, light the table so it
            casts no dark shadows, and count successes on the real arm, a rate the deploy guide does not publish.
            Section 16, Evaluation, says how many trials it takes to trust your count.{' '}
            <Cite id="F01-21">LeRobot SO-101 docs, calibrate</Cite>{' '}
            <Cite id="F06-31">SO-101 constant.py, FORCERANGE</Cite>{' '}
            <Cite id="F06-30">SO-101 sysid README</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
