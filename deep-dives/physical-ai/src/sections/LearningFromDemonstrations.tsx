import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Toy, Derived } from '../components/Cite';
import { Figure, AnimatedFigure } from '../components/Figure';
import { Formula, M } from '../components/Math';
import { ARM, TASK_STORY } from '../lib/task';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const ROBOT_FILL = '#fff6d6';
const ROBOT_INK = '#7a5c00';
const NEUTRAL_FILL = '#eef0f2';
const NEUTRAL_INK = '#5f6b7a';
const EMPHASIS = '#0972d3';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 560, margin: '0 auto' };

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

const LABEL = { fontFamily: 'sans-serif', fontSize: 12, fill: INK } as const;

/* ------------------------------------------------------------------------ */
/* Diagram 4.1 (animated): compounding error, then chunks                   */
/* ------------------------------------------------------------------------ */

const BAND_X0 = 40;
const BAND_X1 = 350;
const BAND_HALF = 22;

/** Centre of the demonstrated band at horizontal position x (an invented, smooth reach). */
function bandCentre(x: number): number {
  const u = Math.min(1, Math.max(0, (x - BAND_X0) / (BAND_X1 - BAND_X0)));
  return 200 - 110 * u * u * (3 - 2 * u);
}

function bandOutline(): string {
  const xs: number[] = [];
  for (let x = BAND_X0 - 14; x <= BAND_X1 + 14; x += 8) xs.push(x);
  const upper = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x} ${(bandCentre(x) - BAND_HALF).toFixed(1)}`);
  const lower = [...xs].reverse().map((x) => `L${x} ${(bandCentre(x) + BAND_HALF).toFixed(1)}`);
  return `${upper.join(' ')} ${lower.join(' ')} Z`;
}

/** How far each single-step decision lands from the band centre: small at first, then growing. */
const DRIFT = [0, 0, 0, 0, 6, 14, 26, 40, 54, 68, 84, 100];
const DRIFT_POINTS = DRIFT.map((d, i) => {
  const x = BAND_X0 + i * 26;
  return { x, y: bandCentre(x) + d, from: i === 0 ? 1 : i <= 4 ? 2 : i <= 7 ? 3 : 4 };
});

/** Chunked policy: four decisions, each slightly off, each followed by a committed run. */
const CHUNK_X = [40, 118, 196, 274, 350];
const CHUNK_OFF = [0, 6, -5, 4, 0];
const CHUNK_FROM = [5, 6, 6, 7];
const CHUNKS = CHUNK_FROM.map((from, j) => {
  const pts = Array.from({ length: 7 }, (_, n) => {
    const f = n / 6;
    const x = CHUNK_X[j] + f * (CHUNK_X[j + 1] - CHUNK_X[j]);
    return { x, y: bandCentre(x) + CHUNK_OFF[j] + f * (CHUNK_OFF[j + 1] - CHUNK_OFF[j]) };
  });
  return { from, pts, d: pts.map((p, n) => `${n === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') };
});

const DRIFT_STEPS = [
  'The shaded band is where the gripper went in the fifty demonstrations. The policy starts inside it, on the left.',
  'The policy decides once per tick. Four decisions land near the centre of the band and the fifth is slightly off: a small error, still inside the band.',
  'From the off-centre position the camera view is less familiar, so the next actions are worse. Three decisions later the gripper is outside the band, in a place the data never showed.',
  'Outside the band nothing the policy learned applies, and the drift grows. After 12 decisions the gripper closes well short of the block.',
  'Start again with a chunked policy. It looks once, decides once, and commits to a whole run of actions (the small dots).',
  'Each large dot is a decision. Each is still slightly off, but far fewer of them cover the same motion, so there are far fewer chances to drift.',
  'Four decisions in place of 12. The path stays inside the band and reaches the block. The faded path is the single-step policy from step 4.',
];

function DriftAndChunks({ step, reduced }: { step: number; reduced: boolean }) {
  const s = step + 1;
  const fade = (on: boolean, level = 1): CSSProperties => ({
    opacity: on ? level : 0,
    transition: reduced ? 'none' : 'opacity 350ms ease',
  });
  const driftLevel = s >= 5 ? 0.3 : 1;
  const blockY = bandCentre(BAND_X1);
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 300" role="img" aria-labelledby="demonstrations-drift-title" style={{ width: '100%', height: 'auto' }}>
        <title id="demonstrations-drift-title">A single-step policy drifts out of the demonstrated band; a chunked policy stays inside it</title>
        <desc>
          A shaded band runs from a start point on the left up to a block on the right. A path of twelve single
          decisions follows the band, slips off centre, leaves the band and ends well below the block. A second path
          made of four decisions, each followed by a run of actions, stays inside the band and reaches the block.
        </desc>
        <rect x="0" y="0" width="400" height="300" fill="#fbfbfd" />

        {/* the demonstrated band */}
        <path d={bandOutline()} fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1" />
        <rect x="16" y="14" width="18" height="12" fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1" />
        <text x="42" y="24" {...LABEL}>
          demonstrated band: where the 50 episodes went
        </text>

        {/* start and block */}
        <text x={BAND_X0} y="240" textAnchor="middle" {...LABEL}>
          start
        </text>
        <rect x={BAND_X1 - 8} y={blockY - 8} width="16" height="16" fill="#ffffff" stroke={ROBOT_INK} strokeWidth="1.5" />
        <text x={BAND_X1} y="58" textAnchor="middle" {...LABEL}>
          block
        </text>

        {/* single-step policy: one dot per decision */}
        {DRIFT_POINTS.map((p, i) => (
          <g key={p.x} style={fade(s >= p.from, driftLevel)}>
            {i > 0 && (
              <line x1={DRIFT_POINTS[i - 1].x} y1={DRIFT_POINTS[i - 1].y} x2={p.x} y2={p.y} stroke={NEUTRAL_INK} strokeWidth="1.5" />
            )}
            <circle cx={p.x} cy={p.y} r="4" fill={NEUTRAL_INK} />
          </g>
        ))}
        <circle cx={DRIFT_POINTS[4].x} cy={DRIFT_POINTS[4].y} r="8" fill="none" stroke={EMPHASIS} strokeWidth="2.5" style={fade(s === 2)} />
        <text x={DRIFT_POINTS[4].x} y="218" textAnchor="middle" {...LABEL} style={fade(s === 2)}>
          a small error
        </text>
        <text x="215" y="214" textAnchor="middle" {...LABEL} style={fade(s === 3)}>
          outside what the data showed
        </text>
        <text x="372" y="222" textAnchor="end" {...LABEL} style={fade(s === 4)}>
          misses the block
        </text>

        {/* chunked policy: a decision, then a committed run of actions */}
        {CHUNKS.map((c) => (
          <g key={c.d} style={fade(s >= c.from)}>
            <path d={c.d} fill="none" stroke={EMPHASIS} strokeWidth="3" strokeLinecap="round" />
            {c.pts.slice(1, 6).map((p) => (
              <circle key={p.x} cx={p.x} cy={p.y} r="2.2" fill="#ffffff" stroke={EMPHASIS} strokeWidth="1" />
            ))}
            <circle cx={c.pts[0].x} cy={c.pts[0].y} r="5.5" fill={EMPHASIS} stroke="#ffffff" strokeWidth="1.5" />
          </g>
        ))}

        {/* legend */}
        <g style={fade(s >= 2)}>
          <circle cx="24" cy="262" r="4" fill={NEUTRAL_INK} />
          <text x="36" y="266" {...LABEL} style={fade(s >= 2 && s < 4)}>
            one action per decision
          </text>
          <text x="36" y="266" {...LABEL} style={fade(s >= 4)}>
            one action per decision: 12 decisions
          </text>
        </g>
        <g style={fade(s >= 5)}>
          <circle cx="24" cy="282" r="5.5" fill={EMPHASIS} />
          <text x="36" y="286" {...LABEL} style={fade(s >= 5 && s < 7)}>
            one chunk of actions per decision
          </text>
          <text x="36" y="286" {...LABEL} style={fade(s >= 7)}>
            one chunk of actions per decision: 4 decisions
          </text>
        </g>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 4.2: two valid ways and their average                            */
/* ------------------------------------------------------------------------ */

const FAR_SIDE = [-10, -30, -50];
const NEAR_SIDE = [270, 290, 310];

function TwoWaysDiagram() {
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 300" role="img" aria-labelledby="demonstrations-modes-title" style={{ width: '100%', height: 'auto' }}>
        <title id="demonstrations-modes-title">Two valid ways round an obstacle, and their average</title>
        <desc>
          The table seen from above. Three demonstrated paths curve from the start round the far side of an obstacle
          to the cup, and three curve round the near side. A dashed straight line, the average of the two groups, runs
          from the start into the obstacle and stops there.
        </desc>
        <rect x="0" y="0" width="400" height="300" fill="#fbfbfd" />

        {/* demonstrated paths */}
        {[...FAR_SIDE, ...NEAR_SIDE].map((c) => (
          <path key={c} d={`M60 130 Q200 ${c} 340 130`} fill="none" stroke={ROBOT_INK} strokeWidth="1.5" />
        ))}

        {/* obstacle and cup, seen from above */}
        <circle cx="200" cy="130" r="28" fill={NEUTRAL_FILL} stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <text x="200" y="94" textAnchor="middle" {...LABEL}>
          obstacle
        </text>
        <circle cx="340" cy="130" r="14" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <text x="360" y="134" {...LABEL}>
          cup
        </text>

        {/* the average path */}
        <line x1="60" y1="130" x2="166" y2="130" stroke={EMPHASIS} strokeWidth="2.5" strokeDasharray="7 5" />
        <path d="M159 123 L173 137 M173 123 L159 137" stroke={EMPHASIS} strokeWidth="2.5" fill="none" />

        {/* start */}
        <circle cx="60" cy="130" r="5" fill={ROBOT_INK} />
        <text x="50" y="134" textAnchor="end" {...LABEL}>
          start
        </text>

        {/* legend */}
        <line x1="20" y1="252" x2="44" y2="252" stroke={ROBOT_INK} strokeWidth="1.5" />
        <text x="52" y="256" {...LABEL}>
          demonstrations: half pass on each side
        </text>
        <line x1="20" y1="276" x2="44" y2="276" stroke={EMPHASIS} strokeWidth="2.5" strokeDasharray="7 5" />
        <text x="52" y="280" {...LABEL}>
          their average: straight into the obstacle
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 4.3 (animated): flow matching, noise to an action chunk          */
/* ------------------------------------------------------------------------ */

const FLOW_N = 50;
const FLOW_DOTS = Array.from({ length: FLOW_N }, (_, i) => {
  const u = i / (FLOW_N - 1);
  const r = Math.sin((i + 1) * 12.9898) * 43758.5453;
  const rand = (r - Math.floor(r)) * 2 - 1;
  return { x: 54 + i * 6.6, noise: 140 + 82 * rand, target: 205 - 120 * Math.sin(Math.PI * u * 0.85) };
});
const FLOW_CURVE = FLOW_DOTS.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.target.toFixed(1)}`).join(' ');

const FLOW_STATUS = [
  'pure noise',
  'after 2 of 10 steps',
  'after 4 of 10 steps',
  'after 6 of 10 steps',
  'after 8 of 10 steps',
  'after 10 of 10 steps: one smooth chunk',
];

const FLOW_STEPS = [
  'One chunk of pure noise: 50 random values where the 50 target angles for one joint should be.',
  'After 2 of 10 steps. Each step moves every dot a short way along the velocity the network predicts for it.',
  'After 4 of 10 steps. The dots are still scattered, and a shape is starting to show.',
  'After 6 of 10 steps. The camera images were read once, before the first step; each step re-runs only the action part of the network.',
  'After 8 of 10 steps. Neighbouring actions now nearly agree.',
  'After 10 of 10 steps: a smooth run of 50 target angles, ready for the host to play one per tick.',
];

function FlowToChunk({ step, reduced }: { step: number; reduced: boolean }) {
  const f = step / (FLOW_STEPS.length - 1);
  const last = step === FLOW_STEPS.length - 1;
  const fade = (on: boolean, level = 1): CSSProperties => ({
    opacity: on ? level : 0,
    transition: reduced ? 'none' : 'opacity 350ms ease',
  });
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 280" role="img" aria-labelledby="demonstrations-flow-title" style={{ width: '100%', height: 'auto' }}>
        <title id="demonstrations-flow-title">Flow matching turns a chunk of noise into a smooth action chunk</title>
        <desc>
          Fifty dots, one per action of a chunk, plotted as the target angle of one joint against robot time. They
          start scattered at random heights. At each sampling step every dot moves toward its place, and after the
          last step the dots lie on one smooth curve.
        </desc>
        <rect x="0" y="0" width="400" height="280" fill="#fbfbfd" />

        {/* axes */}
        <line x1="44" y1="244" x2="388" y2="244" stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <line x1="44" y1="44" x2="44" y2="244" stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <text x="216" y="266" textAnchor="middle" {...LABEL}>
          robot time: the 50 actions of one chunk
        </text>
        <text x="20" y="144" textAnchor="middle" transform="rotate(-90 20 144)" {...LABEL}>
          target angle of one joint
        </text>

        {/* status, one line per step */}
        {FLOW_STATUS.map((t, i) => (
          <text key={t} x="54" y="26" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill={INK} style={fade(step === i)}>
            {t}
          </text>
        ))}

        {/* the finished chunk as a line, shown at the last step */}
        <path d={FLOW_CURVE} fill="none" stroke={EMPHASIS} strokeWidth="1.5" style={fade(last, 0.45)} />

        {/* one dot per action */}
        {FLOW_DOTS.map((p) => (
          <circle
            key={p.x}
            cx={p.x}
            cy={p.noise}
            r="2.8"
            fill={EMPHASIS}
            style={{
              transform: `translate(0px, ${(f * (p.target - p.noise)).toFixed(1)}px)`,
              transition: reduced ? 'none' : 'transform 600ms ease',
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function LearningFromDemonstrations() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Understand why copying a demonstrator fails in a specific way, and the two ideas that fixed it: decide less often, and pick one way of doing the task (the ACT, Diffusion Policy, pi0 and FAST papers, LeRobot v0.7.0 and the openpi code, read 2026-11-20)"
          >
            4. Learning From Demonstrations
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The simplest way to give a robot a skill is to show it. A person drives the arm through the task a few
            dozen times, and a network is trained to do what the person did in the same situation. This section
            follows that idea on the {ARM} as it learns to {TASK_STORY}: why plain copying drifts off course, and the
            two ideas that made it work.
          </Box>
          <Box variant="p">
            The first idea is to predict a short run of actions at once. The second is to let the policy pick one of
            several valid ways to do the task. The models in section 5, Vision-Language-Action Models, are built
            from both.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="What a demonstration dataset is at the bench, and how small a useful one can be">
            The scene: fifty episodes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            You sit at the bench from section 3 with the leader arm in your hand. You reach over the block, close the
            gripper, carry the block to the cup and let go. Then you put the block back in a slightly different
            place and do it again. Each recorded attempt, from start to finish, is an episode. While you work, the
            host stores the two things section 3 defined, 30 times a second: the observation (two camera images and
            six joint angles) and the action (the six target angles your hand asked for). LeRobot&apos;s recorder
            stops at 50 episodes by default.{' '}
            <Cite id="F02-67">LeRobot so_follower.py and the imitation learning tutorial</Cite>
          </Box>
          <Box variant="p">
            Fifty is enough to learn from. The paper behind ACT (Action Chunking with Transformers), the method
            this section builds up to, used 50 demonstrations per task, about 10 minutes of teleoperation. Its
            authors report 80 to 90% success on six real tasks with a two-armed robot of their own.{' '}
            <Cite id="F02-10">ACT paper, abstract and section I</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="The whole training recipe in one sentence, and the assumption a robot breaks">
            Behaviour cloning: supervised learning on (observation, action) pairs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Behaviour cloning is supervised learning on those recordings. Every tick of every episode gives one
            training pair: the observation the person saw, and the action the person took next. The network is
            trained to output the action when given the observation, the way any regressor is fitted to a table of
            inputs and outputs. The person who gave the demonstrations is called the expert, and the trained network
            is the policy from section 3.{' '}
            <Cite id="F02-1">Ross, Gordon and Bagnell, section 1</Cite>
          </Box>
          <Box variant="p">
            As a formula, training is a search for the policy with the smallest average loss over the situations
            the expert was in. Write <M>{String.raw`\pi`}</M> for a candidate policy and <M>{String.raw`\Pi`}</M>{' '}
            for all the policies the network can represent, one per setting of its weights. <M>s</M> is a
            situation the robot is in (the paper calls it a state; the observation is the policy&apos;s view of
            it). <M>{String.raw`\pi^*`}</M> is the expert, and <M>{String.raw`d_{\pi^*}`}</M> is the pool of
            situations the expert visits. <M>{String.raw`\ell(s, \pi)`}</M> is the loss in one situation: how far
            the policy&apos;s action there is from the expert&apos;s. <M>{String.raw`\mathbb{E}`}</M> is an
            average, taken over the pool named under it.
          </Box>
          <Formula
            name="Behaviour cloning objective"
            tex={String.raw`\hat{\pi}_{\mathrm{sup}} = \arg\min_{\pi \in \Pi} \; \mathbb{E}_{s \sim d_{\pi^*}} \big[ \ell(s, \pi) \big]`}
            source={<Cite id="F11-1">Ross, Gordon and Bagnell, section 2.1, equation 2</Cite>}
          />
          <Box variant="p">
            The <M>{String.raw`\arg\min`}</M> is the training run, and{' '}
            <M>{String.raw`\hat{\pi}_{\mathrm{sup}}`}</M> is the policy it returns. The loss{' '}
            <M>{String.raw`\ell`}</M> is the per-pair comparison. The subscript{' '}
            <M>{String.raw`s \sim d_{\pi^*}`}</M> is the part to watch: the average runs only over situations
            the expert reached, so the formula is silent about every situation the policy reaches by its own
            actions.
          </Box>
          <Box variant="p">
            On the arm, take episodes of <Toy>20</Toy> seconds each (an illustration; yours will vary). Fifty
            episodes at 30 ticks a second are 50 x <Toy>20</Toy> x 30 = <Derived>30,000</Derived> pairs. For each
            pair the loss compares six predicted target angles with the six recorded ones. Nothing in the recipe
            knows it is training a robot.{' '}
            <Cite id="F02-67">LeRobot so_follower.py and the imitation learning tutorial</Cite>
          </Box>
          <Box variant="p">
            The recipe carries an assumption from ordinary supervised learning: the inputs met in use come from the
            same pool as the training inputs. A robot breaks it, because the policy&apos;s own outputs decide its
            next inputs. Each action moves the arm, and the moved arm is what the cameras see next. Behaviour
            cloning is regression whose test set is written by its own mistakes.{' '}
            <Cite id="F02-1">Ross, Gordon and Bagnell, section 1</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Why a policy that is almost always right can still close its gripper beside the block">
            Why copying drifts: compounding error
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Run the cloned policy and watch the gripper approach the block. Its first actions are close to what the
            expert would do. Then one is slightly off, and the gripper ends up a little to one side. The wrist
            camera now shows a view that appears in none of the fifty episodes, because the expert never went
            there. On an unfamiliar input the next action is worse, which moves the arm further from anything it
            was trained on. This is compounding error: a small mistake moves the robot to a situation the data
            never showed, and the error feeds itself. At the bench it looks like a smooth, confident reach that
            closes the gripper beside the block.{' '}
            <Cite id="F02-2">Ross, Gordon and Bagnell, section 1</Cite>
          </Box>
          <Box variant="p">
            The demonstrations make this worse in a quiet way. They show how to do the task and never show how to
            get back after a mistake, because the expert made none.
          </Box>
          <Box variant="p">
            A bound from the paper that framed the challenge says how bad it can get. Count the decisions the policy
            takes in one task and call that <M>T</M>, the horizon. Let <M>{String.raw`\epsilon`}</M> be the
            probability that the policy disagrees with the expert on one decision, measured on situations the
            expert visited: the average loss of the formula above, with a loss of 1 for a disagreement and 0
            otherwise. Write <M>{String.raw`J(\pi)`}</M> for the total cost the policy is expected to run up over
            the whole task, where each step costs between 0 and 1 (count 1 for a step that goes wrong), and{' '}
            <M>{String.raw`J(\pi^*)`}</M> for the expert&apos;s total. Then:
          </Box>
          <Formula
            name="Compounding-error bound for behaviour cloning"
            tex={String.raw`J(\pi) \le J(\pi^*) + T^2 \epsilon`}
            source={<Cite id="F02-3">Ross, Gordon and Bagnell, theorem 2.1</Cite>}
          />
          <Box variant="p">
            The term <M>{String.raw`T^2 \epsilon`}</M> is the extra mistakes copying can add. One factor of{' '}
            <M>T</M> counts the chances to make a first mistake: with <M>T</M> decisions and no feedback between
            them, <M>{String.raw`T \epsilon`}</M> mistakes are expected. The second factor of <M>T</M> is what
            one mistake can cost: once off the demonstrated path the policy may be wrong at every step that
            remains, and up to <M>T</M> remain. The bound is a worst case. The paper notes
            that problems exist where it is reached, citing earlier work, and it is a ceiling, with no claim about what a given arm will
            do.{' '}
            <Cite id="F02-2">Ross, Gordon and Bagnell, section 1</Cite>{' '}
            <Cite id="F02-3">Ross, Gordon and Bagnell, theorem 2.1</Cite>
          </Box>
          <Box variant="p">
            Put toy numbers in. A <Toy>20</Toy>-second episode at 30 ticks a second is <M>T</M> ={' '}
            <Derived>600</Derived> decisions. Suppose the policy makes a mistake that matters once in{' '}
            <Toy>1,000</Toy> decisions on familiar situations, so <M>{String.raw`\epsilon`}</M> = <Toy>0.001</Toy>. That
            rate is an illustration; nobody measured it.
          </Box>
          <ul style={LIST}>
            <li>
              If mistakes did not feed each other: <M>{String.raw`T \epsilon`}</M> = <Derived>600</Derived> x{' '}
              <Toy>0.001</Toy> = <Derived>0.6</Derived> mistakes per episode.
            </li>
            <li>
              The worst case: <M>{String.raw`T^2 \epsilon`}</M> = <Derived>360,000</Derived> x <Toy>0.001</Toy> ={' '}
              <Derived>360</Derived>.
            </li>
          </ul>
          <Box variant="p">
            The ceiling allows <Derived>360</Derived> of the <Derived>600</Derived> decisions to be wrong, more
            than half the episode. Being right <Toy>999</Toy> times in <Toy>1,000</Toy> guarantees very little
            about reaching the block. The square is the part to act on: halve <M>T</M> and the ceiling drops
            to a quarter.
          </Box>
          <AnimatedFigure
            name="compounding error, then chunks"
            steps={DRIFT_STEPS}
            intervalMs={3200}
            cites="F02-67"
            caption={
              <>
                Steps 1 to 4 show the drift this block describes. Steps 5 to 7 show the fix the next block
                explains: the same motion covered by fewer decisions. Illustrative, not measured: the band, both
                paths and the counts of decisions are drawn by hand.
              </>
            }
          >
            {(step, reduced) => <DriftAndChunks step={step} reduced={reduced} />}
          </AnimatedFigure>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Decide less often: the change that moved one paper's success rate from 1% to 44%">
            Action chunking: predict a short run of actions at once
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Errors grow with the square of the number of decisions, so take fewer decisions. An action chunk is the
            run of actions section 3 introduced: from one observation the policy predicts the next <M>k</M>{' '}
            actions, the host plays them in order, and only then does the policy look again. A task of{' '}
            <M>T</M> ticks becomes <M>T / k</M> decisions.{' '}
            <Cite id="F02-5">ACT paper, section IV-A</Cite>
          </Box>
          <Box variant="p">
            ACT (Action Chunking with Transformers) is the 2023 method that made chunks standard in robot
            imitation. It is a transformer, the network design behind language models, that reads the camera images
            and the joint angles and writes a whole chunk in one forward pass. Its chunk is <M>k</M> = 100
            actions on a robot controlled at 50 Hz (50 actions a second), so one pass plans 2 seconds of motion. In the authors&apos;
            ablation, an experiment that changes one setting and holds the rest, success averaged over four
            settings went from 1% with no chunking (<M>k</M> = 1) to 44% at <M>k</M> = 100.{' '}
            <Cite id="F02-5">ACT paper, section IV-A</Cite>{' '}
            <Cite id="F02-6">ACT paper, table III and the chunking ablation</Cite>
          </Box>
          <Box variant="p">
            Back to the toy episode. LeRobot&apos;s ACT also defaults to chunks of 100 actions, which at the{' '}
            {ARM}&apos;s 30 Hz is 3.33 s of motion per decision. The <Derived>600</Derived>-tick episode becomes{' '}
            <Derived>600</Derived> / 100 = 6 decisions. With the same <M>{String.raw`\epsilon`}</M> the ceiling is 6 x 6 x{' '}
            <Toy>0.001</Toy> = <Derived>0.036</Derived> wrong decisions. A wrong decision now spoils up to 100 ticks,
            so in ticks the ceiling is <Derived>3.6</Derived>, which is <Derived>100</Derived> times lower than{' '}
            <Derived>360</Derived>. Keeping <M>{String.raw`\epsilon`}</M> the same is generous, since choosing a whole chunk is harder than
            choosing one action, and the bound is still only a ceiling. The measured evidence is the ablation: 1%
            to 44%.{' '}
            <Cite id="F02-11">LeRobot configuration_act.py</Cite>{' '}
            <Cite id="F02-6">ACT paper, chunking ablation</Cite>
          </Box>
          <Box variant="p">
            On the arm a chunk looks like commitment. The gripper carries out a whole reach without re-deciding on
            every tick. The price is reaction time: during a chunk the arm is not looking, so if someone nudges the
            cup, the arm finishes the old plan first. Every chunked policy therefore has two numbers, how many
            actions it predicts and how many it plays before it looks again. LeRobot&apos;s ACT calls them{' '}
            <code>chunk_size</code> and <code>n_action_steps</code>.{' '}
            <Cite id="F02-11">LeRobot configuration_act.py</Cite>
          </Box>
          <Box variant="p">
            Inside ACT the tensors are small. Each camera image goes through ResNet-18, a standard image network,
            and comes out as a grid of feature vectors. The six joint angles go through one linear layer. The
            transformer reads both and emits <code>chunk_size</code> rows of six target angles. Training compares
            that predicted chunk with the recorded one using the L1 loss, the mean absolute difference between the
            two.{' '}
            <Cite id="F02-11">LeRobot configuration_act.py</Cite>{' '}
            <Cite id="F02-13">LeRobot modeling_act.py</Cite>
          </Box>
          <ExpandableSection headerText="The LeRobot v0.7.0 defaults you will type, and where the code overrides the paper">
            <SpaceBetween size="s">
              <Box variant="p">
                <code>chunk_size = 100</code> and <code>n_action_steps = 100</code>: predict 100 actions and play
                all of them before looking again. The file&apos;s own note says the defaults are set for a
                two-armed ALOHA robot, so on an {ARM} you set your own inputs and outputs and may shorten the
                chunk.{' '}
                <Cite id="F02-11">LeRobot configuration_act.py</Cite>
              </Box>
              <Box variant="p">
                <code>n_decoder_layers = 1</code>, where the paper&apos;s table lists 7. A comment in the code
                explains that the original implementation only ever used the first layer. When a paper and its
                code disagree, the code is what you run.{' '}
                <Cite id="F02-12">LeRobot configuration_act.py, n_decoder_layers</Cite>
              </Box>
              <Box variant="p">
                The paper also describes temporal ensembling: ask the policy on every tick, so chunks overlap, and
                average the overlapping predictions for smoother motion. It costs one forward pass per tick in
                place of one per chunk. LeRobot leaves it off by default.{' '}
                <Cite id="F02-7">ACT paper, section IV-A</Cite>{' '}
                <Cite id="F02-13">LeRobot configuration_act.py, temporal_ensemble_coeff</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Why the average of two good demonstrations is a bad action, and how a policy picks one way">
            Several right answers
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Put a second object on the table, between the block and the cup. In some of your fifty episodes you
            carried the block round its far side, in others round the near side. Both are right. A network trained
            to make its average error small against all of them is pulled to the middle, and the middle is a
            straight line into the obstacle, an action nobody demonstrated.
          </Box>
          <Figure
            cites="F02-14"
            caption={
              <>
                The table from above. Both groups of solid paths are good demonstrations; the dashed line is what
                averaging them produces. Illustrative, not measured: the obstacle is our example.
              </>
            }
          >
            <TwoWaysDiagram />
          </Figure>
          <Box variant="p">
            Each cluster of valid answers is called a mode, and a set of demonstrations with several of them is
            multimodal. The word has a second use, for models that take both images and text; here it means only
            that the good answers form separate groups. The obstacle is our illustration. The property is general:
            people grasp from different angles, at different speeds, by different routes.{' '}
            <Cite id="F02-14">Diffusion Policy paper, section 1</Cite>
          </Box>
          <Box variant="p">
            The way through is to stop asking the network for the single best answer and let it draw one answer
            from the set of good ones. The last part of a network, the part that produces its output, is called a
            head, and a head that draws a sample is a generative head, as in an image generator. Three designs are
            in use.
          </Box>
          <Box variant="p">
            <strong>A style variable (ACT).</strong> ACT uses a CVAE (conditional variational autoencoder), a
            model trained to rebuild its input through a small random vector. During training a second network
            looks at the demonstrated chunk and squeezes &quot;which way the person did it&quot; into a vector{' '}
            <M>z</M>, which the policy receives as one more input, so it is never asked to average two ways.
            On the robot that second network is thrown away and <M>z</M> is set to zero, which gives one
            consistent way.{' '}
            <Cite id="F02-8">ACT paper, section IV and figure 4</Cite>
          </Box>
          <Box variant="p">
            ACT&apos;s loss has one term for each of those two jobs: copy the chunk, and keep <M>z</M> small
            enough to drop. <M>{String.raw`a_{t:t+k}`}</M> is the demonstrated chunk, the <M>k</M> actions from
            tick <M>t</M> on, and <M>{String.raw`\hat{a}_{t:t+k}`}</M> is the chunk the policy predicts from the
            observation and <M>z</M>. The second network does not output one <M>z</M>. It outputs a bell curve
            of likely values, a mean and a spread, written{' '}
            <M>{String.raw`q_\phi(z \mid a_{t:t+k}, \bar{o}_t)`}</M>, where <M>{String.raw`\bar{o}_t`}</M> is the
            observation without its images and <M>{String.raw`\phi`}</M> stands for that network&apos;s weights;{' '}
            <M>z</M> is drawn from it. <M>{String.raw`\mathcal{N}(0, I)`}</M> is the standard bell curve
            centred on zero. <M>{String.raw`D_{\mathrm{KL}}`}</M> is the KL (Kullback-Leibler) divergence, a
            number for how far one probability distribution is from another, zero when they match.{' '}
            <M>{String.raw`\lVert \cdot \rVert_1`}</M> is the L1 distance from the previous block, and{' '}
            <M>{String.raw`\beta`}</M> is a weight you set. The bars add the absolute differences up; LeRobot&apos;s
            code takes their mean, and its default <M>{String.raw`\beta`}</M> is set against that mean.
          </Box>
          <Formula
            name="ACT training loss"
            tex={String.raw`\begin{aligned} \mathcal{L} &= \mathcal{L}_{\mathrm{reconst}} + \beta \, \mathcal{L}_{\mathrm{reg}} \\ \mathcal{L}_{\mathrm{reconst}} &= \lVert \hat{a}_{t:t+k} - a_{t:t+k} \rVert_1 \\ \mathcal{L}_{\mathrm{reg}} &= D_{\mathrm{KL}}\big( q_\phi(z \mid a_{t:t+k}, \bar{o}_t) \\ &\qquad\quad \Vert\, \mathcal{N}(0, I) \big) \end{aligned}`}
            source={<Cite id="F11-2">ACT paper, algorithm 1 and section IV-C</Cite>}
          />
          <Box variant="p">
            <M>{String.raw`\mathcal{L}_{\mathrm{reconst}}`}</M> is the copying: it pulls the predicted chunk onto
            the demonstrated one. <M>{String.raw`\mathcal{L}_{\mathrm{reg}}`}</M> pulls the second
            network&apos;s bell curve toward the standard one, so <M>z</M> can carry only a little information
            (which way, and no more) and zero, the centre of that curve, is a value the policy has met in
            training. <M>{String.raw`\beta`}</M> sets the balance: the higher it is, the less passes through{' '}
            <M>z</M>. LeRobot&apos;s default is 10. The paper&apos;s algorithm box labels the first term MSE
            (mean squared error); its text and LeRobot&apos;s code use L1.{' '}
            <Cite id="F11-2">ACT paper, algorithm 1 and section IV-C</Cite>{' '}
            <Cite id="F02-11">LeRobot configuration_act.py</Cite>{' '}
            <Cite id="F02-13">LeRobot modeling_act.py</Cite>
          </Box>
          <Box variant="p">
            <strong>Denoising (diffusion policy).</strong> A diffusion policy starts from a chunk of random
            numbers: noise in the shape of an action chunk. A network looks at the observation and at the noisy
            chunk and predicts the noise in it. Subtracting part of that prediction leaves a slightly cleaner
            chunk. Repeat, each round being one denoising iteration, and a smooth trajectory appears. Training is
            the same game with the answer known: take a demonstrated chunk, add a known amount of noise, and ask
            the network what was added. Every run starts from different noise, so different runs settle on
            different modes, and each result is one whole way of doing the task.{' '}
            <Cite id="F02-14">Diffusion Policy paper, sections 2.1 to 2.3</Cite>
          </Box>
          <Box variant="p">
            The training loss says the same in symbols. <M>{String.raw`O_t`}</M> is the observation at tick{' '}
            <M>t</M> and <M>{String.raw`A_t^0`}</M> the demonstrated chunk that starts there; the superscript
            counts denoising iterations still to run, so 0 means clean. <M>k</M> is an iteration picked at
            random (in this paper <M>k</M> counts iterations, where ACT used it for the chunk length).{' '}
            <M>{String.raw`\epsilon^k`}</M> is random noise as strong as iteration <M>k</M> calls for; this{' '}
            <M>{String.raw`\epsilon`}</M> is noise, a different quantity from the error rate in the bound
            above. <M>{String.raw`\epsilon_\theta`}</M> is the network with weights{' '}
            <M>{String.raw`\theta`}</M>, and MSE is the mean squared error, the average of the squared
            differences.
          </Box>
          <Formula
            name="Diffusion policy training loss (noise prediction)"
            tex={String.raw`\mathcal{L} = \mathrm{MSE}\big( \epsilon^k, \; \epsilon_\theta(O_t, \, A_t^0 + \epsilon^k, \, k) \big)`}
            source={<Cite id="F11-3">Diffusion Policy paper, section 2.3, equation 5</Cite>}
          />
          <Box variant="p">
            <M>{String.raw`A_t^0 + \epsilon^k`}</M> is the demonstrated chunk with the noise added: what the
            network is shown, beside the observation. The first argument,{' '}
            <M>{String.raw`\epsilon^k`}</M> alone, is the answer it should give. The network is told{' '}
            <M>k</M> because heavy noise and light noise call for different answers, and one set of weights
            serves every iteration.
          </Box>
          <Box variant="p">
            The price is repetition. The Diffusion Policy paper trains with 100 iterations. On real robots it uses
            DDIM (Denoising Diffusion Implicit Models), a sampling method that skips iterations, and runs 16 or
            10; the authors report 0.1 s per inference at 10 iterations on an NVIDIA 3080 GPU.{' '}
            <Cite id="F02-16">Diffusion Policy paper, section 3.4</Cite> LeRobot&apos;s version runs 100 passes
            per call unless you set <code>num_inference_steps</code> lower.{' '}
            <Cite id="F02-17">LeRobot configuration_diffusion.py</Cite>
          </Box>
          <Box variant="p">
            <strong>A velocity field (flow matching).</strong> Flow matching keeps the plan, noise in and a chunk
            out, and straightens the route so that far fewer steps are needed. Picture every number in the noisy
            chunk as a point that has to travel to its place in a good chunk. The network&apos;s job is to say,
            for each point, which way to move and how fast: a velocity. A velocity for every possible position is
            a velocity field. Sampling is then simple: start at the noise, ask for the velocity, take a short
            step, and ask again.
          </Box>
          <Box variant="p">
            Four symbols. <M>x</M> is the chunk being built. <M>{String.raw`\tau`}</M> is flow time, which runs
            from 0 (pure noise) to 1 (finished chunk); it measures progress through the sampling, and all of it
            passes inside one policy call, so it is a different clock from the robot&apos;s tick <M>t</M>.{' '}
            <M>{String.raw`\delta`}</M> is the size of one step in flow time.{' '}
            <M>{String.raw`v(x, \tau)`}</M> is the network&apos;s output, one velocity for each number in{' '}
            <M>x</M>, computed with the observation as a further input. One step is:
          </Box>
          <Formula
            name="One sampling step of flow matching (an Euler step)"
            tex={String.raw`x \leftarrow x + \delta \, v(x, \tau)`}
            source={<Cite id="F02-20">pi0 paper, section IV, in this page&apos;s symbols</Cite>}
          />
          <Box variant="p">
            The <M>x</M> on the right is where the chunk is now. <M>{String.raw`v(x, \tau)`}</M> is the
            direction from here toward a valid chunk, and it carries everything the network learned from the
            demonstrations. <M>{String.raw`\delta`}</M> is how far to trust that direction before asking again. Taking a short straight step
            along a velocity and re-asking is called an Euler step. pi0, a robot model from Physical Intelligence
            that section 5 covers, builds a chunk of 50 actions this way in 10 Euler steps of size 0.1.{' '}
            <Cite id="F02-18">pi0 paper, section IV</Cite>{' '}
            <Cite id="F02-20">pi0 paper, section IV and appendix D</Cite>
          </Box>
          <Box variant="p">
            Training supplies the directions. Take a demonstrated chunk <M>A</M> and noise{' '}
            <M>{String.raw`\epsilon`}</M> of the same shape, pick a random <M>{String.raw`\tau`}</M>, and blend
            them into a point <M>x</M> partway between the two. The network is trained to output{' '}
            <M>{String.raw`A - \epsilon`}</M>, the straight direction from that noise to that demonstration.
          </Box>
          <Formula
            name="Flow-matching training loss (velocity regression on the straight path)"
            tex={String.raw`\begin{aligned} x &= \tau A + (1 - \tau) \, \epsilon \\ \mathcal{L} &= \mathbb{E} \, \big\lVert v(x, \tau) - (A - \epsilon) \big\rVert^2 \end{aligned}`}
            source={<Cite id="F02-19">pi0 paper, section IV, in this page&apos;s symbols</Cite>}
          />
          <Box variant="p">
            The first line is the blend: at <M>{String.raw`\tau = 0`}</M> it is all noise, at{' '}
            <M>{String.raw`\tau = 1`}</M> all demonstration, and in between it slides along the straight line
            that joins them. <M>{String.raw`A - \epsilon`}</M> is the velocity along that line, the same at
            every <M>{String.raw`\tau`}</M>, which is why the path is straight. The second line is plain
            regression: the squared distance between the network&apos;s velocity and that one, averaged (
            <M>{String.raw`\mathbb{E}`}</M>) over demonstrations, noise draws and flow times, so the network
            learns a direction for every point a sample can pass through.
          </Box>
          <Box variant="p">
            Follow one number of one chunk, with toy values. The noise is <Toy>0.8</Toy> and the demonstrated
            value is <Toy>0.2</Toy>, so the direction is <Toy>0.2</Toy> - <Toy>0.8</Toy> ={' '}
            <Derived>-0.6</Derived>. Each of ten steps moves it by <Toy>0.1</Toy> x <Derived>-0.6</Derived> ={' '}
            <Derived>-0.06</Derived>: from <Toy>0.8</Toy> to <Derived>0.74</Derived>, then{' '}
            <Derived>0.68</Derived>, and on the tenth step to <Derived>0.2</Derived>. On the robot there is no
            demonstrated value to aim at. The network supplies the direction from what it learned, and where a
            point ends depends on where its noise began, which is how one run settles on the far-side way and
            another on the near-side way.
          </Box>
          <AnimatedFigure
            name="flow matching, from noise to an action chunk"
            steps={FLOW_STEPS}
            intervalMs={2200}
            cites="F02-18 F02-20"
            caption={
              <>
                Each dot is one of the 50 actions in a chunk, for a single joint. The figure shows every second
                one of pi0&apos;s 10 steps. Illustrative, not measured: the noise and the final curve are drawn by
                hand. A different draw of noise can end on a different, equally valid chunk.
              </>
            }
          >
            {(step, reduced) => <FlowToChunk step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            Flow matching is diffusion with a straight path and few steps. In our reading, 10 steps where
            Diffusion Policy trains with 100 iterations is the practical case for it.{' '}
            <Cite id="F02-20">pi0 paper, section IV</Cite>{' '}
            <Cite id="F02-16">Diffusion Policy paper, section 3.4</Cite>
          </Box>
          <ExpandableSection headerText="A fourth design: write the chunk as tokens">
            <SpaceBetween size="s">
              <Box variant="p">
                A language model produces tokens, so one more option is to write the chunk as tokens and let the
                language model inside the robot model predict them one at a time. The plain scheme rounds every
                joint value at every tick into one of 256 bins and spends one token on each. At high control
                rates that is hundreds of tokens per chunk, and neighbouring tokens barely differ, which makes
                the chunk hard to learn.{' '}
                <Cite id="F02-25">FAST paper, sections III and IV</Cite>
              </Box>
              <Box variant="p">
                FAST (Frequency-space Action Sequence Tokenization) compresses the chunk first. It applies the
                DCT (discrete cosine transform), which rewrites a signal as a sum of cosine waves so that a
                smooth motion needs only a few numbers. It rounds those numbers and packs them with BPE
                (byte-pair encoding), the compressor text tokenisers use, which merges pairs that occur often.
                The authors report about 30 tokens per chunk per arm.{' '}
                <Cite id="F02-26">FAST paper, sections V and VI</Cite>
              </Box>
              <Box variant="p">
                Tokens are cheaper to train and slower to run. The authors report about 5x fewer training
                GPU-hours than flow-matching pi0, and about 750 ms per chunk against under 100 ms, because 30 to
                60 tokens are decoded one at a time through the full language model.{' '}
                <Cite id="F02-27">FAST paper, sections VI-E and VII</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Train on one GPU, run inside a control period: what one policy call costs for each design">
            What each costs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The designs differ in how many times the network runs for one chunk. ACT runs once. A diffusion policy
            runs its denoising network 10 to 100 times. A flow model such as pi0 reads the images once and then
            runs a small action network ten times. The table gives each paper&apos;s own figures, on its own
            GPU, so read across a row and compare rows with care.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={TH}>Policy</th>
                  <th style={TH}>One call computes</th>
                  <th style={TH}>Time per call, as the authors report it</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>ACT</td>
                  <td style={TD}>One forward pass of a network of about 80M parameters</td>
                  <td style={TD}>
                    About 0.01 s on one 11 GB RTX 2080 Ti, the card that also trained it from scratch in about 5
                    hours
                  </td>
                  <td style={TD}>
                    <Cite id="F02-9">ACT paper, section IV-C</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Diffusion Policy</td>
                  <td style={TD}>10 denoising passes with DDIM in the paper; 100 by default in LeRobot</td>
                  <td style={TD}>0.1 s on an NVIDIA 3080 at 10 passes</td>
                  <td style={TD}>
                    <Cite id="F02-16">Diffusion Policy paper, section 3.4</Cite>{' '}
                    <Cite id="F02-17">LeRobot configuration_diffusion.py</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>pi0 (flow matching)</td>
                  <td style={TD}>Image encoders, one pass over the observation, then ten action passes</td>
                  <td style={TD}>14 ms + 32 ms + 27 ms = 73 ms on an RTX 4090 with 3 cameras</td>
                  <td style={TD}>
                    <Cite id="F02-21">pi0 paper, appendix D, table I</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            All of this is tensor arithmetic on a GPU. ACT is the small end: one graphics card trains it in an
            afternoon and answers well inside a control tick. In pi0&apos;s 73 ms, the ten flow steps are the
            minor part at 27 ms; seeing takes the rest.{' '}
            <Cite id="F02-9">ACT paper, section IV-C</Cite>{' '}
            <Cite id="F02-21">pi0 paper, appendix D, table I</Cite>
          </Box>
          <Box variant="p">
            Chunks are what make a slow call affordable. pi0 plays its chunks without looking in between and, as
            its authors report, runs a new inference every 0.5 s on 50 Hz robots, after 25 actions.{' '}
            <Cite id="F02-22">pi0 paper, appendix D</Cite> The delay still counts as distance, as section 3
            showed: at the illustrative <Toy>0.25</Toy> m/s used there, 73 ms is <Toy>0.25</Toy> x{' '}
            <Derived>0.073</Derived> = <Derived>0.018</Derived> m, about <Derived>18</Derived> mm of travel on old
            information.{' '}
            <Cite id="F02-21">pi0 paper, appendix D, table I</Cite>
          </Box>
          <Box variant="p">
            For each policy you meet from here on, ask three things: how many actions it predicts per call, how
            many it plays before it looks again, and how many network passes one call takes. The first two exist
            because of chunking, the change behind the move from 1% to 44% in ACT&apos;s ablation.{' '}
            <Cite id="F02-6">ACT paper, chunking ablation</Cite> Section 15, Training at Three Scales, sizes the
            training runs, and section 17, Running on the Robot, fits the calls inside the control period.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
