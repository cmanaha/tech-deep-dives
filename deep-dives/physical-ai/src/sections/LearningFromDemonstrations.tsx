import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Toy, Derived } from '../components/Cite';
import { Figure, AnimatedFigure } from '../components/Figure';
import { Formula, M } from '../components/Math';
import { DemoDrift, DEMO_DRIFT_STEPS } from '../components/figures/DemoDrift';
import { DemoFlow, DEMO_FLOW_STEPS } from '../components/figures/DemoFlow';
import { ARM, TASK_STORY } from '../lib/task';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
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
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function LearningFromDemonstrations() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Work out how often a policy runs and what each run costs from two of its settings, and see why copying one action at a time drifts off the task (the ACT, Diffusion Policy, pi0 and FAST papers, LeRobot v0.7.0 and the openpi code, read 2026-11-20)"
          >
            4. Learning From Demonstrations: Why Copying Drifts and What Fixed It
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A network trained to copy a person&apos;s demonstrations fails for a reason its training loss never
            sees. Each small error moves the arm to a camera view that none of the demonstrations contains, the next
            action is worse there, and the error feeds itself. The worst case grows with the square of the number
            of decisions the policy takes. Two changes contained it. Every policy described here is built on the first, and most of them on the second.
          </Box>
          <Box variant="p">
            The first is to decide less often. An illustrative <Toy>20</Toy>-second episode at 30 ticks a second is{' '}
            <Derived>600</Derived> decisions, and a policy that predicts a
            chunk of 100 actions per look makes it 6. ACT (Action Chunking with Transformers) is the 2023 policy
            that made chunks standard in robot imitation, and in its authors&apos; own test of the idea success
            went from 1% with no chunks to 44% with chunks of 100, averaged over four settings. The second change
            is to sample one of several valid motions, where plain regression averages them into a motion nobody
            demonstrated. That takes an output stage that generates, and it is paid for in network passes per
            chunk. ACT needs 1. The designs that build a chunk out of random noise need more: 10 in pi0, a robot
            model from Physical Intelligence, and 100 by default in the diffusion policy of LeRobot, the library
            that drives this arm.{' '}
            <Cite id="F02-5">ACT paper, section IV-A</Cite>{' '}
            <Cite id="F02-6">ACT paper, chunking ablation</Cite>{' '}
            <Cite id="F02-16">Diffusion Policy paper, section 3.4</Cite>{' '}
            <Cite id="F02-20">pi0 paper, section IV</Cite>{' '}
            <Cite id="F02-17">LeRobot configuration_diffusion.py</Cite>
          </Box>
          <Box variant="p">
            Those two choices are also the bill. The chunk length sets how many times a second the policy is
            called, and the output stage sets how many network passes each call takes. Their product is the load
            one arm puts on a GPU, and the time one call takes is distance the gripper travels on an old
            observation (section 3, The Robot as a Computer).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="What a demonstration is as data, and how few of them a policy trained from scratch needs">
            Fifty episodes are a whole training set
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Sit at the bench with the leader arm of the {ARM} in your hand and {TASK_STORY}: reach over the block,
            close the gripper, carry the block to the cup, let go. Put the block back in a slightly different place
            and do it again. Each attempt, from start to finish, is an episode, and an episode recorded with a
            person driving is a demonstration. While you work, the host stores 30 times a second the two things a
            policy connects: the observation (two camera images and six joint angles) and the action (the six
            target angles your hand asked for). LeRobot&apos;s recorder stops at 50 episodes by default.{' '}
            <Cite id="F02-67">LeRobot so_follower.py and the imitation learning tutorial</Cite>
          </Box>
          <Box variant="p">
            Fifty was enough for ACT&apos;s authors. ACT was trained on 50 demonstrations per task, about 10 minutes of
            teleoperation (a person driving the robot), and its authors report 80 to 90% success on six real tasks
            with a two-armed robot of their own. At <Toy>20</Toy> seconds an episode, fifty episodes at 30 ticks a
            second are 50 x <Toy>20</Toy> x 30 = <Derived>30,000</Derived> rows, each one observation and one
            action. A first policy is therefore cheap in data. Where it goes wrong is in what training does with
            those rows.{' '}
            <Cite id="F02-10">ACT paper, abstract and section I</Cite>{' '}
            <Cite id="F02-67">LeRobot so_follower.py and the imitation learning tutorial</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read the training objective for the situations it never scores, which are the ones a running arm ends up in"
          >
            Behaviour cloning grades the policy only where the expert went
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Behaviour cloning is supervised learning on those rows. Every tick of every episode gives one training
            pair: the observation the person saw, and the action the person took next. The network is fitted to
            output the action when given the observation, the way any regressor is fitted to a table of inputs and
            outputs, and nothing in the recipe knows it is training a robot. The person who gave the demonstrations
            is called the expert, and the fitted network is the policy.{' '}
            <Cite id="F02-1">Ross, Gordon and Bagnell, section 1</Cite>
          </Box>
          <Box variant="p">
            Training searches for the weights whose answers sit closest to the expert&apos;s, on average. How the gap between two actions is measured is routine. What decides everything after it is which situations the average runs over, and
            the formula states that in a subscript. Write <M>{String.raw`\pi`}</M> for a candidate policy and{' '}
            <M>{String.raw`\Pi`}</M> for all the policies the network can represent, one per setting of its
            weights. <M>s</M> is a situation the robot is in (the paper calls it a state; the observation is the
            policy&apos;s view of it). <M>{String.raw`\pi^*`}</M> is the expert, and{' '}
            <M>{String.raw`d_{\pi^*}`}</M> is the pool of situations the expert visits.{' '}
            <M>{String.raw`\ell(s, \pi)`}</M> is the loss in one situation: how far the policy&apos;s action there
            is from the expert&apos;s. <M>{String.raw`\mathbb{E}`}</M> is an average, taken over the pool named
            under it.
          </Box>
          <Formula
            name="Behaviour cloning objective"
            tex={String.raw`\hat{\pi}_{\mathrm{sup}} = \arg\min_{\pi \in \Pi} \; \mathbb{E}_{s \sim d_{\pi^*}} \big[ \ell(s, \pi) \big]`}
            source={<Cite id="F11-1">Ross, Gordon and Bagnell, section 2.1, equation 2</Cite>}
          />
          <Box variant="p">
            The <M>{String.raw`\arg\min`}</M> is the training run, and{' '}
            <M>{String.raw`\hat{\pi}_{\mathrm{sup}}`}</M> is the policy it returns. The loss{' '}
            <M>{String.raw`\ell`}</M> is the comparison for one pair: on this arm, six predicted target angles
            against the six recorded ones. The subscript <M>{String.raw`s \sim d_{\pi^*}`}</M> carries the
            limit. The average runs over the situations the expert reached and over no others, so a situation the
            policy reaches through its own slightly wrong action contributes no term. The objective neither
            penalises a bad action there nor rewards a good one.{' '}
            <Cite id="F11-1">Ross, Gordon and Bagnell, section 2.1, equation 2</Cite>
          </Box>
          <Box variant="p">
            The pool has a second gap. The demonstrations show how to do the task and never how to get back after
            a slip, because the expert did not slip, so <M>{String.raw`d_{\pi^*}`}</M> holds no recovery to copy.
          </Box>
          <Box variant="p">
            On a table of fixed inputs neither gap would matter. Ordinary supervised learning assumes the inputs
            met in use come from the same pool as the training inputs, and a robot breaks that assumption because
            the policy&apos;s outputs decide its next inputs: each action moves the arm, and the moved arm is what
            the cameras see next. Behaviour cloning is regression whose test set is written by its own mistakes. A
            low training loss therefore says the policy agrees with the expert on the expert&apos;s path, and
            says nothing about the path the policy will take itself, which is why section 16, Evaluation, ranks
            policies by counting successes.{' '}
            <Cite id="F02-1">Ross, Gordon and Bagnell, section 1</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why a policy that is almost always right can still close its gripper beside the block, and which factor of the bound you can change"
          >
            Compounding error grows with the square of the number of decisions
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Run the cloned policy and watch the gripper approach the block. Its first actions are close to what the
            expert would do. Then one is slightly off, and the gripper ends up a little to one side. The wrist
            camera now shows a view that appears in none of the fifty episodes, because the expert never went
            there. On an unfamiliar input the next action is worse, which moves the arm further from anything it
            was trained on. This is compounding error.{' '}
            <Cite id="F02-2">Ross, Gordon and Bagnell, section 1</Cite> How each failure looks at the bench is
            our reading of its mechanism, here and in the closing table: this one is a smooth, confident reach
            that closes the gripper beside the block.
          </Box>
          <Box variant="p">
            How bad it can get is two counts multiplied. The policy has one chance per decision to make a first
            mistake. A mistake, once made, can cost every decision that remains, because from there on the policy
            is off the demonstrated path. Both counts scale with the number of decisions, and that is where the
            square comes from. Call the number of decisions in one task <M>T</M>, the horizon. Let{' '}
            <M>{String.raw`\epsilon`}</M> be the probability that the policy disagrees with the expert on one
            decision, measured on situations the expert visited: the average loss of the objective, with a loss of
            1 for a disagreement and 0 otherwise. Write <M>{String.raw`J(\pi)`}</M> for the total cost the policy
            is expected to run up over the whole task, where each step costs between 0 and 1 (count 1 for a step
            that goes wrong), and <M>{String.raw`J(\pi^*)`}</M> for the expert&apos;s total. Then:
          </Box>
          <Formula
            name="Compounding-error bound for behaviour cloning"
            tex={String.raw`J(\pi) \le J(\pi^*) + T^2 \epsilon`}
            source={<Cite id="F02-3">Ross, Gordon and Bagnell, theorem 2.1</Cite>}
          />
          <Box variant="p">
            The term <M>{String.raw`T^2 \epsilon`}</M> is the extra cost copying can add. One factor of{' '}
            <M>T</M>, with <M>{String.raw`\epsilon`}</M>, counts first mistakes: <M>T</M> chances at rate{' '}
            <M>{String.raw`\epsilon`}</M> give <M>{String.raw`T \epsilon`}</M> of them when nothing feeds back.
            The second factor of <M>T</M> is the price of one: up to <M>T</M> steps remain in which to be wrong.
            The bound is a worst case, and the paper notes, citing earlier work, that problems exist where it is
            reached. It is a ceiling on what can happen and makes no claim about what a given arm will do.{' '}
            <Cite id="F02-2">Ross, Gordon and Bagnell, section 1</Cite>{' '}
            <Cite id="F02-3">Ross, Gordon and Bagnell, theorem 2.1</Cite>
          </Box>
          <Box variant="p">
            With toy numbers, the <Toy>20</Toy>-second episode is <M>T</M> = <Derived>600</Derived> decisions.
            Suppose the policy makes a mistake that matters once in <Toy>1,000</Toy> decisions on familiar
            situations, so <M>{String.raw`\epsilon`}</M> = <Toy>0.001</Toy>, an illustrative rate.
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
            than half the episode. Being right <Toy>999</Toy> times in <Toy>1,000</Toy> on the expert&apos;s path
            guarantees very little about reaching the block. The two factors do not respond alike: halve{' '}
            <M>{String.raw`\epsilon`}</M> and the ceiling halves, halve <M>T</M> and it drops to a quarter.{' '}
            <M>T</M> is the factor to go after.
          </Box>
          <Box variant="p">
            The 2011 paper that states the bound goes after the other weakness, the missing recovery data. Its
            method, DAgger (Dataset Aggregation), runs the learned policy, has the expert label the situations the
            policy really reaches, adds them to the dataset and retrains, and it brings the guarantee back to
            linear in <M>T</M>. It needs an expert who can be asked for the right action in situations the learner
            got itself into, and a recording session with a leader arm does not supply one for free. ACT took the other road and shortened <M>T</M>; correcting a policy while it runs comes
            back as human interventions in section 8, Reinforcement Learning for Robots.{' '}
            <Cite id="F02-4">Ross, Gordon and Bagnell, abstract and section 3</Cite>{' '}
            <Cite id="F02-5">ACT paper, section IV-A</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Decide once per chunk: the change that moved one paper's success from 1% to 44%, and where a longer chunk stops helping"
          >
            Action chunking divides the horizon by the chunk length
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Errors grow with the square of the number of decisions, so take fewer decisions. An action chunk is the
            next <M>k</M> actions predicted from one observation: the host plays them in order, one per tick, and
            only then does the policy look again. A task of <M>T</M> ticks becomes <M>T / k</M> decisions.{' '}
            <Cite id="F02-5">ACT paper, section IV-A</Cite>
          </Box>
          <Box variant="p">
            ACT is a transformer, the network design behind language models, that reads the camera images and the
            joint angles and writes a whole chunk in one forward pass. Its chunk is <M>k</M> = 100 actions on a
            robot controlled at 50 Hz (50 actions a second), so one pass plans 2 seconds of motion. In the
            authors&apos; ablation, an experiment that changes one setting and holds the rest, success averaged
            over four settings went from 1% with no chunking (<M>k</M> = 1) to 44% at <M>k</M> = 100, and then,
            in their words, &quot;slightly tapers down with higher k&quot;. The ablation passage gives no reason for the taper; the Diffusion Policy authors, who measured the same trade, name slow reaction time.{' '}
            <Cite id="F02-5">ACT paper, section IV-A</Cite>{' '}
            <Cite id="F02-6">ACT paper, table III and the chunking ablation</Cite>{' '}
            <Cite id="F02-15">Diffusion Policy paper, key findings</Cite>
          </Box>
          <Box variant="p">
            LeRobot&apos;s ACT also defaults to chunks of 100 actions, which at the{' '}
            {ARM}&apos;s 30 Hz is 3.33 s of motion per decision. The toy episode of <Derived>600</Derived> ticks becomes{' '}
            <Derived>600</Derived> / 100 = 6 decisions. With the same <M>{String.raw`\epsilon`}</M> the ceiling is
            6 x 6 x <Toy>0.001</Toy> = <Derived>0.036</Derived> wrong decisions. A wrong decision now spoils up to
            100 ticks, so in ticks the ceiling is <Derived>3.6</Derived>, which is <Derived>100</Derived> times
            lower than <Derived>360</Derived>. Keeping <M>{String.raw`\epsilon`}</M> the same is generous, since
            choosing a whole chunk is harder than choosing one action, and the bound is still only a ceiling. The
            arithmetic shows why the direction is right. The measured evidence is the ablation: 1% to 44%.{' '}
            <Cite id="F02-11">LeRobot configuration_act.py</Cite>{' '}
            <Cite id="F02-6">ACT paper, chunking ablation</Cite>
          </Box>
          <AnimatedFigure
            name="compounding error, then chunks"
            steps={DEMO_DRIFT_STEPS}
            intervalMs={3200}
            cites="F02-67 F02-11"
            caption={
              <>
                Both panels share the horizontal axis, the ticks of the toy episode, so a dot on the table top sits over its ceiling in the chart. Steps 1 to 5 are the drift, steps 6 and 7 the chunks. Illustrative,
                not measured: the band, both paths and the cones are drawn by hand, and the curves are the toy
                arithmetic of the text.
              </>
            }
          >
            {(step, reduced) => <DemoDrift step={step} reduced={reduced} />}
          </AnimatedFigure>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Choose how many predicted actions to play before the next look, and tell when averaging overlapping chunks is affordable"
          >
            Inside a chunk the arm is not looking
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On the arm a chunk looks like commitment: the gripper carries out a whole reach without re-deciding on
            every tick. The price is reaction time. While a chunk plays the policy sees nothing, so if someone
            nudges the cup, the arm finishes the old plan first. At LeRobot&apos;s ACT defaults on the {ARM}, the
            old plan is 3.33 s long.{' '}
            <Cite id="F02-11">LeRobot configuration_act.py</Cite>
          </Box>
          <Box variant="p">
            Every chunked policy therefore carries two numbers: how many actions it predicts, and how many of
            those it plays before it looks again. Playing only the first part of what was predicted gives reaction time back and costs more calls. The Diffusion Policy authors measured the
            trade: playing more than one action per look helps the policy stay consistent, too many
            &quot;reduces performance due to slow reaction time&quot;, and 8 was best for most of the tasks they
            tested. pi0 predicts 50 actions and, as its authors report, plays 25 of them on 50 Hz robots before
            it calls again.{' '}
            <Cite id="F02-15">Diffusion Policy paper, section 3.2 and key findings</Cite>{' '}
            <Cite id="F02-18">pi0 paper, section IV</Cite>{' '}
            <Cite id="F02-22">pi0 paper, appendix D</Cite>
          </Box>
          <Box variant="p">
            Each codebase names the pair in its own way, and a port can ship defaults four times longer than its
            paper&apos;s, so read both numbers from the configuration you run.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={TH}>Policy</th>
                  <th style={TH}>Actions predicted per call</th>
                  <th style={TH}>Actions played before the next look</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>ACT in LeRobot v0.7.0</td>
                  <td style={TD}>
                    <code>chunk_size</code>, 100 by default
                  </td>
                  <td style={TD}>
                    <code>n_action_steps</code>, 100 by default: a look every 3.33 s at 30 Hz
                  </td>
                  <td style={TD}>
                    <Cite id="F02-11">LeRobot configuration_act.py</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Diffusion Policy, the paper</td>
                  <td style={TD}>
                    The action prediction horizon <M>{String.raw`T_p`}</M>, 16
                  </td>
                  <td style={TD}>
                    The action execution horizon <M>{String.raw`T_a`}</M>, 8
                  </td>
                  <td style={TD}>
                    <Cite id="F02-15">Diffusion Policy paper, section 3.2</Cite>{' '}
                    <Cite id="F02-17">LeRobot configuration_diffusion.py, against the paper</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Diffusion Policy in LeRobot v0.7.0</td>
                  <td style={TD}>
                    <code>horizon</code>, 64 by default
                  </td>
                  <td style={TD}>
                    <code>n_action_steps</code>, 32 by default: a call every 1.07 s at 30 Hz
                  </td>
                  <td style={TD}>
                    <Cite id="F02-17">LeRobot configuration_diffusion.py</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>pi0</td>
                  <td style={TD}>
                    <code>action_horizon</code> in the openpi code, 50; LeRobot calls the same number{' '}
                    <code>chunk_size</code>
                  </td>
                  <td style={TD}>
                    25 on 50 Hz robots (a call every 0.5 s) and 16 on 20 Hz robots (every 0.8 s), as the authors
                    report
                  </td>
                  <td style={TD}>
                    <Cite id="F02-18">pi0 paper, section IV</Cite>{' '}
                    <Cite id="F02-23">pi0 paper, section V-A, and openpi pi0_config.py</Cite>{' '}
                    <Cite id="F02-29">LeRobot configuration_pi0_fast.py</Cite>{' '}
                    <Cite id="F02-22">pi0 paper, appendix D</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            ACT&apos;s own answer to the blind interval is temporal ensembling. The policy is called on every
            tick, so chunks overlap and each tick has many predictions made at different moments. The arm is sent
            their weighted average. The oldest prediction weighs most, which keeps the arm on the motion it is
            already making while newer looks bend it gradually: <M>{String.raw`w_i = \exp(-m \, i)`}</M>, with{' '}
            <M>i</M> = 0 for the oldest. The smaller <M>m</M> is, the flatter the weights and the sooner a new
            observation counts. The authors introduced it &quot;to improve smoothness and
            avoid discrete switching between executing and observing&quot;. It spends the whole saving in calls:
            at <M>k</M> = 100 and 50 Hz, plain chunking needs 0.5 forward passes per second and ensembling needs
            50.{' '}
            <Cite id="F02-7">ACT paper, section IV-A</Cite>
          </Box>
          <Box variant="p">
            Whether a policy can afford that is one division. ACT&apos;s authors report about 0.01 s per
            inference, about 100 forward passes per second on their card, so 50 fit. For pi0 its authors report 73 ms per call on an RTX 4090 with 3 cameras, which is 1 / <Derived>0.073</Derived> = <Derived>13.7</Derived> calls
            per second, under half of this arm&apos;s 30 ticks. They also report that ensembling &quot;hurt
            policy performance&quot; when they tried it, and pi0 plays its chunks without it. Chunking survived
            from ACT into the pi0 line and ensembling did not. LeRobot leaves it off by default; turning it on
            (<code>temporal_ensemble_coeff</code>, 0.01 in the paper) requires <code>n_action_steps</code> = 1.
            The third option, starting the next call while the current chunk still plays, is in section 17,
            Running on the Robot.{' '}
            <Cite id="F02-9">ACT paper, section IV-C</Cite>{' '}
            <Cite id="F02-21">pi0 paper, appendix D, table I</Cite>{' '}
            <Cite id="F02-22">pi0 paper, appendix D</Cite>{' '}
            <Cite id="F02-13">LeRobot configuration_act.py, temporal_ensemble_coeff</Cite>{' '}
            <Cite id="F02-67">LeRobot so_follower.py and the imitation learning tutorial</Cite>
          </Box>
          <ExpandableSection headerText="ACT in LeRobot v0.7.0: the tensors, the defaults you will type, and where the code overrides the paper">
            <SpaceBetween size="s">
              <Box variant="p">
                The tensors are small. Each camera image goes through ResNet-18, a standard image network.
                A transformer of width 512 reads its output with the joint angles and emits{' '}
                <code>chunk_size</code> rows of target angles.{' '}
                <Cite id="F02-11">LeRobot configuration_act.py</Cite>
              </Box>
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
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why a regression output steers into the obstacle that both groups of demonstrations avoided, and how ACT commits to one way in a single pass"
          >
            Two valid motions average to an invalid one
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
                The table top seen from overhead. Both groups of solid paths are good demonstrations; the dashed line is what
                averaging them produces. Illustrative, not measured: the obstacle is our example.
              </>
            }
          >
            <TwoWaysDiagram />
          </Figure>
          <Box variant="p">
            Each cluster of valid answers is called a mode, and a set of demonstrations with several of them is
            multimodal. The word has a second use, for models that take both images and text; here it means only
            that the good answers form separate groups. The property is general: people grasp from different angles, at different speeds, by different routes. The Diffusion
            Policy authors call multimodal action distributions &quot;a well-known challenge for policy
            learning&quot;.{' '}
            <Cite id="F02-14">Diffusion Policy paper, section 1</Cite>
          </Box>
          <Box variant="p">
            The repair is to stop asking the network for the single best answer and let it draw one answer from
            the set of good ones. The last part of a network, the part that produces its output, is called a head;
            on a policy it is the action head, and a head that draws a sample is a generative head, as in an image
            generator. Four designs are in use, and what separates them is the price of one sample: ACT&apos;s style variable (one
            pass), diffusion (up to a hundred passes), flow matching (ten short passes) and tokens (a few dozen,
            one at a time).
          </Box>
          <Box variant="p">
            ACT keeps its single pass and adds one input, a style variable. It is trained as a CVAE (conditional
            variational autoencoder): during training a second network looks at the demonstrated chunk and squeezes
            &quot;which way the person did it&quot; into a vector <M>z</M>, which the policy receives as one more
            input, so it is never asked to average two ways. On the robot that second network is thrown away and{' '}
            <M>z</M> is set to zero, which gives one consistent way.{' '}
            <Cite id="F02-8">ACT paper, section IV and figure 4</Cite>
          </Box>
          <Box variant="p">
            ACT&apos;s loss has one term for each of those two jobs: copy the chunk, and keep <M>z</M> carrying so little that it can be dropped. <M>{String.raw`a_{t:t+k}`}</M> is the demonstrated chunk, the <M>k</M> actions from
            tick <M>t</M> on, and <M>{String.raw`\hat{a}_{t:t+k}`}</M> is the chunk the policy predicts from the
            observation and <M>z</M>. The second network does not output one <M>z</M>. It outputs a bell curve
            of likely values, a mean and a spread, written{' '}
            <M>{String.raw`q_\phi(z \mid a_{t:t+k}, \bar{o}_t)`}</M>, where <M>{String.raw`\bar{o}_t`}</M> is the
            observation without its images and <M>{String.raw`\phi`}</M> stands for that network&apos;s weights;{' '}
            <M>z</M> is drawn from it. <M>{String.raw`\mathcal{N}(0, I)`}</M> is the standard bell curve
            centred on zero. <M>{String.raw`D_{\mathrm{KL}}`}</M> is the KL (Kullback-Leibler) divergence, a
            number for how far one probability distribution is from another, zero when they match.{' '}
            <M>{String.raw`\lVert \cdot \rVert_1`}</M> is the L1 distance, the absolute differences between two
            chunks added up, and <M>{String.raw`\beta`}</M> is a weight you set. LeRobot&apos;s code takes the
            mean of the absolute differences where the bars add them up, and its default{' '}
            <M>{String.raw`\beta`}</M> is set against that mean.
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
            <M>z</M>. LeRobot&apos;s default is 10, with a <M>z</M> of 32 numbers. The paper&apos;s algorithm
            box labels the first term MSE (mean squared error); its text and LeRobot&apos;s code use L1.{' '}
            <Cite id="F11-2">ACT paper, algorithm 1 and section IV-C</Cite>{' '}
            <Cite id="F02-11">LeRobot configuration_act.py</Cite>{' '}
            <Cite id="F02-13">LeRobot modeling_act.py</Cite>
          </Box>
          <Box variant="p">
            This head is free at run time. The second network exists only in training, and a call on the arm is
            still one forward pass with <M>z</M> = 0. The ACT authors report that they found the CVAE objective
            &quot;essential in learning precise tasks from human demonstrations&quot;, and in LeRobot it is on
            unless you set <code>use_vae</code> to false.{' '}
            <Cite id="F02-8">ACT paper, CVAE ablation</Cite>{' '}
            <Cite id="F02-11">LeRobot configuration_act.py</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What one denoising step is, why a flow head takes 10 where a diffusion policy trains with 100, and where the steps are paid"
          >
            Diffusion and flow heads build the chunk from noise, one step per network pass
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A diffusion policy starts from a chunk of random
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
            <M>{String.raw`\epsilon`}</M> is noise, a different quantity from the error rate in the
            compounding-error bound. <M>{String.raw`\epsilon_\theta`}</M> is the network with weights{' '}
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
            serves every iteration. Each training example draws a single <M>k</M>, so a training step is one
            pass of the network, as in plain regression. The repetition is paid on the arm.{' '}
            <Cite id="F11-3">Diffusion Policy paper, sections 2.2 and 2.3</Cite>
          </Box>
          <Box variant="p">
            How much repetition is a setting, and the default can be ten times what the paper ran for its 0.1 s
            real-robot figure. The Diffusion
            Policy paper trains with 100 iterations. On real robots it uses DDIM (Denoising Diffusion Implicit
            Models), a sampling method that skips iterations, and runs 16 or 10; the authors report 0.1 s per
            inference at 10 iterations on an NVIDIA 3080 GPU.{' '}
            <Cite id="F02-16">Diffusion Policy paper, section 3.4</Cite> LeRobot&apos;s version runs 100 passes
            per call unless you set <code>num_inference_steps</code> lower.{' '}
            <Cite id="F02-17">LeRobot configuration_diffusion.py</Cite>
          </Box>
          <Box variant="p">
            Flow matching keeps the plan, noise in and a chunk
            out, and straightens the route so that far fewer steps are needed. Picture every number in the noisy
            chunk as a point that has to travel to its place in a good chunk. The network&apos;s job is to say,
            for each point, which way to move and how fast: a velocity. A velocity for every possible position is
            a velocity field. Sampling starts at the noise, asks for the velocity, takes a step, and asks again. The straightness is
            what saves steps: a step is a straight move, so it follows a straight route exactly however long it
            is, and leaves a curved one unless the steps are short.
          </Box>
          <Box variant="p">
            <M>x</M> is the chunk being built. <M>{String.raw`\tau`}</M> is flow time, which runs
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
            demonstrations. <M>{String.raw`\delta`}</M> is how far to trust that direction before asking again.
            Taking a short straight step along a velocity and re-asking is called an Euler step. pi0 builds a chunk of 50 actions this way in 10 Euler steps of size 0.1 (section 5,
            Vision-Language-Action Models, takes the model apart).{' '}
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
            learns a direction for every point a sample can pass through. As with diffusion, a training step is
            one pass.
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
            steps={DEMO_FLOW_STEPS}
            intervalMs={2400}
            cites="F02-18 F02-20 F02-16"
            caption={
              <>
                Three views of the same 10 steps, every second one shown. First, one joint of one chunk: each dot
                is one of the 50 actions and its arrow is the velocity the network gives it. Second, two noise draws
                that settle on the two ways round the obstacle. Third, the whole chunk as numbers. Illustrative, not
                measured: the noise and the curves are drawn by hand, and the readout under the clock repeats the toy
                values of the text.
              </>
            }
          >
            {(step, reduced) => <DemoFlow step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            Flow matching is diffusion with a straight path and few steps: 10 in pi0, against the 100 that LeRobot&apos;s
            Diffusion Policy runs when <code>num_inference_steps</code> is unset. Each step is also cheaper
            than a full pass: pi0 encodes the observation once and caches the result, so a step re-runs only the
            action part of the network.{' '}
            <Cite id="F02-20">pi0 paper, section IV</Cite>{' '}
            <Cite id="F02-17">LeRobot configuration_diffusion.py</Cite>
          </Box>
          <Box variant="p">
            Configuration files call flow steps denoising steps too: LeRobot&apos;s pi0 setting is <code>num_inference_steps</code>, 10 by default.
            And the openpi code runs the time axis the opposite way to the paper, with noise at 1 and the
            finished chunk at 0, by its own comment, so say which convention a formula uses before you compare it
            with the source.{' '}
            <Cite id="F02-29">LeRobot pi0 and pi0_fast configuration files</Cite>{' '}
            <Cite id="F02-24">openpi pi0.py</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What it costs to let a language model write the chunk one token at a time, and why one model line trains with tokens and runs with flow"
          >
            Tokenised actions: cheaper to train, slower to run
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A language model produces tokens, so the fourth design writes the chunk as tokens and lets the
            language model inside a robot model predict them one at a time. The plain scheme rounds every joint value at every
            tick into one of 256 bins and spends one token on each: for this arm&apos;s 6 numbers over a chunk of
            50 actions, 6 x 50 = 300 tokens by our count. Neighbouring tokens barely differ when the motion is smooth, each one carries
            almost no new information, and the authors of FAST (Frequency-space Action Sequence Tokenization, the
            tokeniser built to fix this) report that it makes training hard at high control rates.{' '}
            <Cite id="F02-25">FAST paper, sections III and IV</Cite>
          </Box>
          <Box variant="p">
            FAST compresses the chunk before it tokenises. It applies the DCT
            (discrete cosine transform), which rewrites a signal as a sum of cosine waves so that a smooth motion
            needs only a few numbers. It rounds those numbers and packs them with BPE (byte-pair encoding), the
            compressor text tokenisers use, which merges pairs that occur often. The authors report about 30
            tokens per chunk per arm. Against our count of 300 for this arm that is 300 / 30 ={' '}
            <Derived>10</Derived> times fewer.{' '}
            <Cite id="F02-26">FAST paper, sections V and VI</Cite>{' '}
            <Cite id="F02-25">FAST paper, sections III and IV</Cite>
          </Box>
          <Box variant="p">
            The trade is training time against run time. The authors report about 5x fewer training GPU-hours than
            flow-matching pi0, and about 750 ms per chunk against under 100 ms. The gap has two causes: 30 to 60
            tokens are decoded one at a time where the flow head takes 10 steps, and every token passes through
            the full 2B-parameter language model where a flow step runs a 300M-parameter action network.{' '}
            <Cite id="F02-27">FAST paper, sections VI-E and VII</Cite>
          </Box>
          <Box variant="p">
            pi0.5, a later model in the same line, takes both sides of the trade: it is pretrained with FAST tokens and then
            given a flow-matching action head for inference.{' '}
            <Cite id="F02-49">pi0.5 paper, figure 3 and section IV-D</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Size the GPU beside the arm from three numbers per policy, and recognise at the bench which of them is set wrong"
          >
            The load on the GPU is calls per second times passes per call
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One arm&apos;s inference load is a product. The control rate divided by the actions played per call
            gives calls per second, and the head gives the network passes inside each call: one for ACT, 10 to 100
            for a diffusion policy, one reading of the images and ten small action passes for pi0, 30 to 60 token
            steps for FAST. The table gives each paper&apos;s own figures. Each row was timed on a different GPU, so compare within a row.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={TH}>Policy</th>
                  <th style={TH}>One call computes</th>
                  <th style={TH}>Authors&apos; reported time per call</th>
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
                <tr>
                  <td style={TD}>pi0 with FAST tokens</td>
                  <td style={TD}>30 to 60 tokens, each a step of the full language model</td>
                  <td style={TD}>
                    About 750 ms per chunk, where the same authors give under 100 ms for flow-matching pi0 on an
                    NVIDIA 4090
                  </td>
                  <td style={TD}>
                    <Cite id="F02-27">FAST paper, sections VI-E and VII</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            The pi0 row shows where a call&apos;s time goes. Of the 73 ms, 46 ms (63%) is seeing and reading:
            the image encoders and the pass over the observation. The ten flow steps are 27 ms, 2.7 ms each.
            Halving the step count would save <Derived>13.5</Derived> ms of 73 (27 / 2); the larger share is spent
            before the first step. With the GPU off the robot the authors add 13 ms of network latency, 86 ms in
            total.{' '}
            <Cite id="F02-21">pi0 paper, appendix D, table I</Cite>
          </Box>
          <Box variant="p">
            On 50 Hz robots pi0 calls every 0.5 s, after 25 actions: 2 calls per second, each 73
            ms, so the model is busy <Derived>146</Derived> ms of every second (2 x 73), about{' '}
            <Derived>15</Derived>% of the time. Delay also counts as distance, as section 3, The
            Robot as a Computer, showed. At the illustrative <Toy>0.25</Toy> m/s used there, 73 ms is{' '}
            <Toy>0.25</Toy> x <Derived>0.073</Derived> = <Derived>0.018</Derived> m, about <Derived>18</Derived>{' '}
            mm of travel on old information, and the token model&apos;s 750 ms is <Derived>188</Derived> mm (<Toy>0.25</Toy> x{' '}
            <Derived>0.75</Derived>). Chunks make a slow call possible, and the call still costs distance.{' '}
            <Cite id="F02-22">pi0 paper, appendix D</Cite>{' '}
            <Cite id="F02-21">pi0 paper, appendix D, table I</Cite>{' '}
            <Cite id="F02-27">FAST paper, sections VI-E and VII</Cite>
          </Box>
          <Box variant="p">
            Chunking is the fix none of these policies goes without. How far the generative head is needed is
            less settled. The authors of OpenVLA-OFT took a 7B model that wrote actions as tokens, changed its
            head to predict the whole chunk in one parallel pass with a plain L1 regression loss, and report
            average success across the four task suites of LIBERO, a simulated manipulation benchmark, rising
            from 76.5% to 97.1%. In our reading, sampling one mode is a strong tendency on human demonstrations
            and falls short of a law.{' '}
            <Cite id="F02-68">OpenVLA-OFT paper, abstract</Cite>
          </Box>
          <Box variant="p">
            Each mechanism fails in its own way at the bench, and the remedy is usually one configuration value.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={TH}>What you would see</th>
                  <th style={TH}>What causes it</th>
                  <th style={TH}>What to change</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>A smooth reach that closes beside the block</td>
                  <td style={TD}>Compounding error: too many decisions per task</td>
                  <td style={TD}>
                    Play more actions per decision. In ACT&apos;s ablation the gain ran from <M>k</M> = 1 up to{' '}
                    <M>k</M> = 100
                  </td>
                  <td style={TD}>
                    <Cite id="F02-2">Ross, Gordon and Bagnell, section 1</Cite>{' '}
                    <Cite id="F02-6">ACT paper, chunking ablation</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The arm completes its motion to where the cup was</td>
                  <td style={TD}>A long chunk played to its end without a look</td>
                  <td style={TD}>
                    Lower the number of actions played and keep the number predicted. The Diffusion Policy
                    authors found 8 best for most of their tasks
                  </td>
                  <td style={TD}>
                    <Cite id="F02-15">Diffusion Policy paper, key findings</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>A hitch each time one chunk ends and the next begins</td>
                  <td style={TD}>The switch between executing and observing</td>
                  <td style={TD}>
                    Temporal ensembling, if one call fits inside a tick; otherwise start the next call early
                    (section 17, Running on the Robot)
                  </td>
                  <td style={TD}>
                    <Cite id="F02-7">ACT paper, section IV-A</Cite>{' '}
                    <Cite id="F02-13">LeRobot configuration_act.py</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The gripper heads between two demonstrated routes</td>
                  <td style={TD}>A head that averages the modes</td>
                  <td style={TD}>
                    In ACT, leave <code>use_vae</code> on; otherwise use a head that samples
                  </td>
                  <td style={TD}>
                    <Cite id="F02-8">ACT paper, section IV</Cite>{' '}
                    <Cite id="F02-11">LeRobot configuration_act.py</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>A LeRobot diffusion policy whose call takes many times what you budgeted</td>
                  <td style={TD}>
                    <code>num_inference_steps</code> left unset resolves to 100 passes, where the paper&apos;s
                    robots ran 16 or 10
                  </td>
                  <td style={TD}>
                    Set <code>num_inference_steps</code>
                  </td>
                  <td style={TD}>
                    <Cite id="F02-16">Diffusion Policy paper, section 3.4</Cite>{' '}
                    <Cite id="F02-17">LeRobot configuration_diffusion.py</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            A policy gives the machine two jobs of different shape, training and the call on the arm (section 20,
            Fifteen Workloads, Five Shapes), and both are matrix arithmetic on a GPU&apos;s tensor cores. Training
            from scratch is small: ACT&apos;s authors report about 5 hours on one 11 GB RTX 2080 Ti for about 80M
            parameters. That is a single-node job, and the cores that decode the episode video can fill before
            the GPU does (section 10, Processing and Curating). With the same heads inside a large pretrained
            model, training is far larger: the FAST authors report about 4 days on 8
            H100 GPUs for one run of a 3B-parameter token model, and section 15, Training at Three Scales, sorts
            the sizes. The call on the arm is the same arithmetic against a deadline. It has to return before the
            chunk in play runs out, every time, for as long as the arm runs.{' '}
            <Cite id="F02-9">ACT paper, section IV-C</Cite>{' '}
            <Cite id="F02-28">FAST paper, appendix, DROID training details</Cite>
          </Box>
          <Box variant="p">
            Before you choose a policy for your arm, write down three numbers for it: the actions it predicts per
            call, the actions it plays before it looks again, and the network passes in one call. Your control
            rate divided by the actions played is calls per second. By our arithmetic from LeRobot&apos;s tuning rule, the time of one call, measured on your GPU, has to
            stay under about half the duration of the chunk it predicts (section 17, Running on the Robot, works
            it). Multiply that same time by the speed of your gripper and you have the distance it
            travels on an old observation. The first two numbers exist because of chunking, the change behind the
            move from 1% to 44% in ACT&apos;s ablation. The third is the price of the head: 1, 10 or 100.{' '}
            <Cite id="F07-22">LeRobot remote inference guide, tuning</Cite>{' '}
            <Cite id="F02-6">ACT paper, chunking ablation</Cite>{' '}
            <Cite id="F02-17">LeRobot configuration_diffusion.py</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
