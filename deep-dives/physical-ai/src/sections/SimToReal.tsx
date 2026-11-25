import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Toy, Derived } from '../components/Cite';
import { AnimatedFigure } from '../components/Figure';
import { Formula, M } from '../components/Math';
import { ARM, TASK_STORY, SIM_TASK, SIM_TASK_PLAIN, SIM_TASK_GAP } from '../lib/task';
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

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
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
            description="Know why a policy that works in simulation fails on the bench, and the two ways to close the gap (MuJoCo Playground v1.0.1 and MuJoCo 4.0, sources read 2026-11-20)"
          >
            14. Sim-to-Real and Real-to-Sim: Widen the Simulator or Measure the Arm
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A simulator is a guess about the world. The physics step of section 12 and the camera image of section 13
            both run on parameters someone typed in: how hard a servo pushes, how slippery a fingertip is, where the
            light stands. Sim-to-real is the work of making a policy trained on that guess hold up on the real arm.
            There are two ways to do it, and they are used together. Vary the guess until the real arm falls inside
            it, or measure the real arm and correct the guess. For the {ARM} the second way is a shipped script that
            fits 24 servo parameters from one teleoperated episode.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="What the gap looks like at the bench, before it has a name">
            It worked in simulation
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The story of this dive is an {ARM} that has to {TASK_STORY}. Section 8 trained a policy for the first
            half of it on thousands of simulated arms, and on the screen it lifts the cube almost every time. You
            copy the weights to the laptop that drives the real arm, put a block on the table and start it. The arm
            reaches out, lowers, and the gripper closes a finger&apos;s width beside the block. It lifts nothing,
            goes back, and does the same thing again.
          </Box>
          <Box variant="p">
            Nothing is broken. The weights are the ones that worked. What changed is the world the policy acts in:
            this arm, this table and this lamp differ a little from the simulated ones.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Name the three places a simulator differs from the bench, so a failed transfer becomes a short list of suspects">
            The gap
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The difference between what the simulator produces and what the bench produces is called the sim-to-real
            gap. It has three parts.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Physics.</strong> A simulated servo is a formula with a few parameters, the gains of section 3
              among them. A simulated fingertip has a friction number. Where those numbers are off, the same command
              produces a different motion.
            </li>
            <li>
              <strong>Appearance.</strong> The simulated camera image is rendered, which means computed from the
              shapes, colours and lights of the scene (section 13). The real camera sees real light, real shadows and
              its own sensor noise.
            </li>
            <li>
              <strong>Timing.</strong> In the simulator a command takes effect at the instant the program says. On
              the bench it travels down a serial cable to the servos and arrives a few milliseconds later.
            </li>
          </ul>
          <Box variant="p">
            One source inside the physics part has its own name: calibration, the step in section 3 that teaches
            the software what each joint&apos;s encoder reading means as an angle. The simulated arm knows exactly
            where its gripper is. The real arm knows it as well as the calibration was done, by hand. The deploy guide for the task below says manual calibration &quot;can easily be off
            by 1-2+ cm in end-effector height&quot;. The end effector is the tool at the end of the arm, here the
            gripper. <Cite id="F06-29">MuJoCo Playground, SO-101 deploy README</Cite>
          </Box>
          <Box variant="p">
            The gap runs both ways. Sim-to-real carries a policy trained in simulation to the real arm. Real-to-sim
            carries something real into the simulator: a policy trained on real demonstrations, or the scene itself,
            usually so that policies can be tested there cheaply (section 16, Evaluation). The same differences bite
            on that trip. AWS reports from one engagement that a model fine-tuned on real demonstrations scored 0%
            success in simulation, where models trained on clean simulation data reached 35% to 45%. The post gives
            no trial counts.{' '}
            <Cite id="F06-72">AWS Physical AI blog, Telexistence and DreamZero, post of 2026-09-09</Cite>
          </Box>
          <Box variant="p">
            There are two ways to close it. Make the real world one more sample from training, or make training a
            copy of the real world. The first is domain randomisation: vary the simulator. The second is real-to-sim:
            measure the bench and rebuild the simulator from the measurements, by fitting the servo parameters
            (system identification) and by scanning the scene. Step through both below.
          </Box>
          <AnimatedFigure
            name="closing the gap"
            steps={GAP_CAPTIONS}
            intervalMs={3000}
            caption={
              <>
                Read along the axis: each shape is the spread of values one property takes, green for the simulator
                and yellow for the bench. The dashed outline marks where the simulator started. Illustrative, not
                measured.
              </>
            }
          >
            {(step, reduced) => <GapDiagram step={step} reduced={reduced} />}
          </AnimatedFigure>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Vary the simulator so the real arm looks like one more variation, and know which unknowns this is the right tool for">
            Domain randomisation
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Domain randomisation changes what an episode starts from. Before each one, the simulator draws every
            uncertain parameter from a range, where a plain simulator would use one fixed value. The policy never
            meets the same world twice, so it cannot lean on one exact friction or one exact shade of red. If the
            bench falls inside the range, the bench is nothing new. The 2017 paper that introduced the idea for robot vision put it this way: with enough variability in the
            simulator, &quot;the real world may appear to the model as just another variation&quot;. Its authors
            report an object detector accurate to 1.5 cm in the real world, trained on simulated images alone.{' '}
            <Cite id="F06-66">Tobin et al., domain randomization paper, abstract</Cite>
          </Box>
          <Box variant="p">
            Use it for what you cannot measure well or what will not hold still: the lighting, the wear on a
            fingertip, the last millimetres of how the arm is mounted. In the Isaac Lab authors&apos; words, such
            parameters &quot;may be difficult to estimate accurately or may vary over time in the real world&quot;.{' '}
            <Cite id="F06-67">Isaac Lab paper, section 5.3</Cite> Its limit: the range has to contain the bench. A
            policy outside the range it trained on is back in the opening scene.
          </Box>
          <Box variant="p">
            Randomisation also changes what training maximises. In one fixed simulator, reinforcement learning
            looks for the policy that collects the most reward in that one world (section 8). With randomisation the
            score is that reward averaged over every world the simulator can draw. Write{' '}
            <M>{String.raw`\mu`}</M> for the list of randomised parameters drawn for one episode and{' '}
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
            friction value and poorly elsewhere now loses to one that scores well across the range, and the range
            is the designer&apos;s choice. In practice the outer average is taken by sampling: one draw of{' '}
            <M>{String.raw`\mu`}</M> at the start of each episode, held fixed until it ends.{' '}
            <Cite id="F11-202">Peng et al., dynamics randomization paper v3, sections IV and IV-C</Cite>
          </Box>
          <Box variant="p">
            The simulated task this dive follows is <code>{SIM_TASK}</code>, the reinforcement-learning recipe of
            section 8. Its code randomises three groups of things at the start of every episode, one group for each
            part of the gap.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560 }}>
              <thead>
                <tr>
                  <th style={TH}>Part of the gap</th>
                  <th style={TH}>What the task draws afresh each episode</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Physics</td>
                  <td style={TD}>Fingertip friction, the servo gains, joint damping (how strongly a joint resists motion), the size of the cube.</td>
                  <td style={TD}>
                    <Cite id="F06-28">MuJoCo Playground, SO-101 task.py, resetters</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Appearance</td>
                  <td style={TD}>
                    Colours of the cube and the floor (kept in high contrast), colours of the arm&apos;s links, the
                    lighting, the camera&apos;s parameters, and noise added to every pixel.
                  </td>
                  <td style={TD}>
                    <Cite id="F06-28">MuJoCo Playground, SO-101 task.py, resetters</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Calibration and timing</td>
                  <td style={TD}>
                    A bias on the joint readings that imitates a badly calibrated arm, the height of the arm&apos;s
                    base by plus or minus 2.5 mm, and a delay of 0 to 4 ms on every command.
                  </td>
                  <td style={TD}>
                    <Cite id="F06-28">SO-101 task.py, resetters</Cite>{' '}
                    <Cite id="F06-27">SO-101 task.py, control delay</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Capture
            file="so101-domain-randomisation.jpg"
            kind="still"
            width={1200}
            height={600}
            alt="Six overhead views of the same arm, block and cup scene, each with a different floor colour, lighting, object colours and positions, and a slightly moved camera."
            caption={
              <>
                Six draws of one scene. Floor colour, light position and strength, object colours and positions, the
                camera offset and the arm&apos;s tint change between them; the task does not. A policy trained across
                such draws has to find the block in all of them.
              </>
            }
            provenance={MUJOCO_SO101}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description={`Check the shipped ${ARM} task's ranges against the bench by hand, and see what its authors do and do not publish`}>
            Worked case: the shipped {ARM} task
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            MuJoCo Playground 1.0.0, released by Google DeepMind on 2026-11-06, ships paired packages for the
            simulated and the real {ARM}. <Cite id="F06-25">MuJoCo Playground changelog, version 1.0.0</Cite> In{' '}
            <code>{SIM_TASK}</code> the same task code runs in both: a policy is trained in simulation and then
            deployed &quot;zero-shot onto the real robot&quot;, zero-shot meaning with no further training on real
            data. The shipped task covers the first half of the story: the policy learns to {SIM_TASK_PLAIN};{' '}
            {SIM_TASK_GAP} is this dive&apos;s extension.{' '}
            <Cite id="F06-26">MuJoCo Playground, SO-101 deploy README</Cite>
          </Box>
          <Box variant="p">
            <strong>Timing.</strong> The policy decides 10 times a second, once every 100 ms, and the physics
            advances every 5 ms, so 20 physics steps pass per decision. The random command delay of 0 to 4 ms is
            under one physics step. At section 3&apos;s illustrative gripper speed of <Toy>0.25</Toy> m/s, the
            longest delay is worth:
          </Box>
          <Box variant="p">
            <code>
              <Toy>0.25</Toy> m/s x 4 ms = 1 mm
            </code>
          </Box>
          <Box variant="p">
            A millimetre is small, and the task still trains for it.{' '}
            <Cite id="F06-27">SO-101 task.py, control timestep and delay</Cite>{' '}
            <Cite id="F06-105">MuJoCo Playground, simulation config and SO-101 task.py</Cite>
          </Box>
          <Box variant="p">
            <strong>Calibration.</strong> The base height varies by plus or minus 2.5 mm, a range 2 x 2.5 = 5 mm
            wide. A hand calibration can leave the gripper 1 to 2 cm from where the software believes it is, which is
            10 to <Derived>20</Derived> mm: two to four times the whole width of that range. Mounting height alone
            cannot absorb it. That is the job of the separate bias on the joint readings, and the guide states its
            limit: the policy tolerates moderate calibration error, &quot;but larger offsets will eventually degrade
            grasp success or cause the robot to slam the table&quot;. The width of the bias range was not recorded
            in this research.{' '}
            <Cite id="F06-28">SO-101 task.py, resetters</Cite>{' '}
            <Cite id="F06-29">SO-101 deploy README, hardware behaviour</Cite>
          </Box>
          <Box variant="p">
            <strong>Appearance.</strong> The policy sees one image from the wrist camera per decision, at 64 x 64
            pixels: 64 x 64 = <Derived>4,096</Derived> pixels. An image that small shows the cube as a patch of
            colour against the floor, so the task keeps those two colours in high contrast while it randomises
            them.{' '}
            <Cite id="F06-27">SO-101 task.py, camera settings</Cite>
          </Box>
          <Box variant="p">
            What the authors publish about the result is short. The guide says the task was &quot;tested on 3
            different robot setups under various lighting conditions&quot; and warns that a visual gap may remain
            under darker shadows. No success rate is published for it.{' '}
            <Cite id="F06-26">SO-101 deploy README, hardware behaviour</Cite> The success rate is a number you
            would measure yourself; section 16 covers how many trials that takes.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Measure the bench and rebuild the simulator from it: 24 servo parameters from one episode, and a scene from a few minutes of video">
            Real-to-sim: system identification and scanned scenes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Randomisation covers what is unknown. The other way is to make less of it unknown. System identification
            does that for the motors: move the real arm, replay the same commands in the simulator, and adjust the
            simulated servo&apos;s parameters until the two motions agree.
          </Box>
          <Box variant="p">
            First, what is being adjusted. The simulator models each of the {ARM}&apos;s servos as a spring and a
            brake pulling the joint toward its commanded angle. Write <M>{String.raw`q_{\text{target}}`}</M> for the commanded
            angle, <M>q</M> for the joint&apos;s current angle and <M>{String.raw`\dot{q}`}</M> for how fast it is
            turning. <M>k_p</M> is the position gain, which the model file calls stiffness, and{' '}
            <M>k_d</M> is the damping. They play the roles of the P and D gains of section 3: PD (proportional-derivative) control pushes in
            proportion to the error and brakes in proportion to the speed. Their values are in the model&apos;s
            units and are not the 16 and 32 written into the real servo.{' '}
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
            The first term is the spring: the further the joint is from its goal, the harder the motor turns it. The
            second is the brake: the faster the joint moves, the more torque is taken away. The result is capped at what the motor can deliver.{' '}
            <Cite id="F11-212">MuJoCo Playground, SO-101 scene.py, actuator setup</Cite> Two more numbers per joint complete the
            model, and the fit finds all four.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={TH}>Fitted parameter</th>
                  <th style={TH}>In plain words</th>
                  <th style={TH}>Values in the repository, across the 6 joints</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Gain (stiffness, kp)</td>
                  <td style={TD}>How hard the servo pushes per unit of error. Set too high, the simulated arm snaps to its goal faster than the real one.</td>
                  <td style={TD}>218 to 265</td>
                  <td style={TD}>
                    <Cite id="F06-31">SO-101 constant.py</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Damping (kd)</td>
                  <td style={TD}>How hard it brakes per unit of speed. Set too low, the simulated joint overshoots where the real one settles.</td>
                  <td style={TD}>17.5 to 34.2</td>
                  <td style={TD}>
                    <Cite id="F06-31">SO-101 constant.py</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Armature</td>
                  <td style={TD}>
                    Extra inertia at the joint from the spinning motor and its gears, which makes the joint slower
                    to start and to stop than the links alone would.
                  </td>
                  <td style={TD}>0.109 to 0.199</td>
                  <td style={TD}>
                    <Cite id="F06-31">SO-101 constant.py</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Friction loss</td>
                  <td style={TD}>A constant resistance inside the joint that the motor has to overcome before anything moves.</td>
                  <td style={TD}>Near zero on five joints, 0.25 on the gripper</td>
                  <td style={TD}>
                    <Cite id="F06-31">SO-101 constant.py</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Four parameters for each of 6 joints is 24. The values are in the model&apos;s own units, which this
            research did not check. The torque cap is not fitted: the file computes it from the stall torque on the
            servo&apos;s datasheet, 30 kg-cm at 12 V, which is 2.94 N m.{' '}
            <Cite id="F06-31">SO-101 constant.py, FORCERANGE</Cite>{' '}
            <Cite id="F06-30">SO-101 sysid README</Cite>
          </Box>
          <Box variant="p">
            Now the fit. A person drives the real arm through its range with the leader arm for one episode, a
            teleoperated excitation episode: motion chosen so that every parameter leaves a mark in the data. The
            script logs the commands and the measured joint angles. It then replays the commands in the simulator
            and scores the mismatch. Write <M>{String.raw`\theta`}</M> for the list of 24 parameters,{' '}
            <M>{String.raw`q^{\text{real}}_{t,j}`}</M> for the measured angle of joint <M>j</M> at time <M>t</M>,
            and <M>{String.raw`q^{\text{sim}}_{t,j}(\theta)`}</M> for the angle the simulator produces at the same
            moment when it runs with <M>{String.raw`\theta`}</M>.
          </Box>
          <Formula
            name="System identification: squared tracking mismatch (this page's rendering of the least-squares fit)"
            tex={String.raw`L(\theta) = \sum_{t,\,j} \bigl( q^{\text{real}}_{t,j} - q^{\text{sim}}_{t,j}(\theta) \bigr)^2`}
            source={
              <>
                our rendering of what the code minimises; the README describes the fit in words, and the script
                compares joint-position readings. <Cite id="F06-30">MuJoCo Playground, SO-101 sysid README</Cite>
              </>
            }
          />
          <Box variant="p">
            The bracket is how far apart the real and the simulated joint are at one moment. Squaring makes large
            misses count most. The sum runs over the whole episode and all 6 joints, so <M>L</M> is one number
            for how badly the simulated arm tracks the real one. The library may scale each term before summing;
            this research did not read that part. The script finds the <M>{String.raw`\theta`}</M> that makes
            it smallest with Gauss-Newton least squares, a method that repeats one move: nudge each parameter,
            simulate again, see how the mismatch changes, and step all 24 toward a smaller <M>L</M>. From the
            same log it also estimates the transport delay of the serial link, the timing part of the gap.{' '}
            <Cite id="F06-30">MuJoCo Playground, SO-101 sysid README</Cite>
          </Box>
          <Box variant="p">
            That is the practical news here: 24 parameters from one teleoperated episode, with a script that ships
            beside the task. This dive read the script and the checked-in values and did not run the fit.{' '}
            <Cite id="F06-30">SO-101 sysid README</Cite> The tool
            underneath, <code>mujoco.sysid</code>, is part of MuJoCo 4.0, which also adds a <code>pid</code>{' '}
            actuator, a <code>dcmotor</code> actuator built from datasheet values, and actuator delays, so the
            simulated servo can be shaped like a real one.{' '}
            <Cite id="F06-6">MuJoCo 4.0 announcement, sim-to-real row</Cite>{' '}
            <Cite id="F06-7">MuJoCo 4.0 announcement, actuators row</Cite>
          </Box>
          <ExpandableSection headerText="Evidence that wrong gains alone can lose a grasp (history, 2024)">
            <Box variant="p">
              The authors of SIMPLER, a simulated evaluation suite, copied a real controller&apos;s PD gains
              straight into their simulator and replayed a recorded demonstration. The simulated arm tracked the
              motion poorly, which ended in &quot;a missed grasp on the coke can&quot;. After system identification
              the same recorded actions grasped the can.{' '}
              <Cite id="F06-71">SIMPLER paper, section IV.A</Cite>
            </Box>
          </ExpandableSection>
          <Box variant="p">
            The scene can be measured too. Gaussian splatting turns a video of a real place into something a
            renderer can show from any viewpoint. It represents the place as a cloud of small, soft, coloured blobs
            (the Gaussians) and adjusts their positions, sizes and colours until pictures drawn from the cloud match
            the frames of the video. PolaRiS, a research pipeline for testing policies in scanned scenes, starts
            from a 2 to 5 minute video of the table. The splats give the look of the scene and a mesh of its
            surfaces, and the mesh goes into the simulator so that objects have something to collide with. Its
            authors report that reconstruction
            &quot;typically completes within 30 minutes on an NVIDIA RTX 4090&quot;, with less than 20 minutes of a
            person&apos;s effort. <Cite id="F06-73">PolaRiS paper, section 4.1</Cite>
          </Box>
          <Box variant="p">
            A scan narrows the appearance gap; it did not close it. Before scoring a policy in a scanned scene,
            PolaRiS first fine-tunes it briefly (1k steps) on about 350 simulated demonstrations from 15 other
            scanned scenes, so that the policy is used to how the simulator looks.{' '}
            <Cite id="F06-74">PolaRiS paper, sections 4.2 and 5.1</Cite> Inside the MuJoCo family, MuJoCo
            Warp&apos;s batch renderer can draw a splat scene behind simulated objects.{' '}
            <Cite id="F06-78">MuJoCo docs, MuJoCo Warp chapter, 3D Gaussian Splatting</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Three small jobs beside the training run, which part of the machine each loads, and the order to do them in at the bench">
            What it costs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Next to the training run of section 8 these are small jobs. Each loads a different part of the machine.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Randomisation</strong> is a function that runs when an episode resets: draw the values, write
              them into that copy of the scene. Under PhysX, the physics
              engine of Isaac Sim, parameters such as mass and friction &quot;must be modified through the CPU
              API&quot;, so randomisation is CPU work inside a GPU pipeline.{' '}
              <Cite id="F06-69">Isaac Lab paper, section 5.3</Cite>
            </li>
            <li>
              <strong>System identification</strong> replays one logged episode in the simulator many times over.
              It is a job for CPU cores, and the README publishes no timing for it.{' '}
              <Cite id="F06-30">MuJoCo Playground, SO-101 sysid README</Cite>
            </li>
            <li>
              <strong>A scan</strong> is minutes on one GPU. Beside the PolaRiS figure above, NVIDIA&apos;s 3DGRUT
              reconstruction code (v1.1.0) reports average training times on one RTX 5090 across two public sets of
              scenes: 479 s and 2,869 s for its ray-traced method, 215 s and 686 s for its rasterised one. The
              ray-traced method wants a GPU with RT (ray tracing) cores, the hardware section 13 is about.{' '}
              <Cite id="F06-75">3DGRUT README at v1.1.0, benchmark tables</Cite>
            </li>
          </ul>
          <Box variant="p">
            At the bench the order follows from the costs. Calibrate with care, because a hand calibration can be off
            by 1 to 2 cm and large offsets lose the grasp. Record one teleoperated episode and fit the 24 parameters, so the
            simulated servos are yours. Train with the shipped randomisation for what is left. Light the table so it
            casts no dark shadows. Then count successes on the real arm, the slow part, which section 16, Evaluation,
            covers.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
