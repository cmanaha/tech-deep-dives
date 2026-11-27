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
        <title id="demonstrations-modes-title">Two valid paths around an obstacle, and their average</title>
        <desc>
          The drawing shows the table from above. Three demonstrated paths curve from the start around the far side of
          an obstacle to the cup, and three curve around the near side. A dashed straight line, the average of the two
          groups, runs from the start into the obstacle and stops there.
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
          demonstrations: half go around each side
        </text>
        <line x1="20" y1="276" x2="44" y2="276" stroke={EMPHASIS} strokeWidth="2.5" strokeDasharray="7 5" />
        <text x="52" y="280" {...LABEL}>
          their average runs into the obstacle
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
            description="A policy trained to copy a person's demonstrations one action at a time drifts away from the task, because each small error leads it into situations that the demonstrations never showed. Current policies limit this drift with two changes: they predict chunks of actions, and they sample one way of doing the task. From two settings of a policy, you will be able to work out how often it runs and how many network passes each run costs."
          >
            4. Learning From Demonstrations: Why Simple Copying Fails and How Current Policies Fix It
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The most direct way to teach the arm a task is to train a network to copy what a person did in the
            demonstrations. A network trained this way fails for a reason that its training loss never shows. When
            the policy makes a small error, the arm moves to a position where the camera view matches none of the
            demonstrations. The policy&apos;s next action is worse in that unfamiliar situation, so the error grows
            with each step. In the worst case, the extra cost of these errors grows with the square of the number of
            decisions that the policy takes. Current policies limit this effect with two changes. Every policy
            described in this section uses the first change, and most of them also use the second.
          </Box>
          <Box variant="p">
            The first change is to make fewer decisions. The arm&apos;s control loop runs 30 cycles per second, and
            each cycle is called a tick. <Cite id="F02-17">LeRobot configuration_diffusion.py</Cite> Instead of choosing one action per tick, the policy predicts a chunk of many
            future actions, and the arm plays them before the policy decides again. Take an episode of{' '}
            <Toy>20</Toy> seconds as an illustration. If the policy decides on every tick, the episode takes{' '}
            <Derived>600</Derived> decisions. A policy that predicts a chunk of 100 actions each time takes only 6
            decisions.
            ACT (Action Chunking with Transformers) is the 2023 policy that made action chunks the standard approach
            in robot imitation learning. <Cite id="F02-5">ACT paper, section IV-A</Cite> In its authors&apos; test of
            the idea, the success rate, averaged over four settings, went from 1% without chunks to 44% with chunks of
            100 actions. <Cite id="F02-6">ACT paper, chunking ablation</Cite>
          </Box>
          <Box variant="p">
            The second change is to sample one of several valid motions instead of averaging them. When people
            demonstrate a task in two different ways, plain regression learns the average of the two, and that
            average is a motion that nobody demonstrated. To sample instead, the policy needs an output stage that
            generates an answer. The cost of that stage is the number of network passes needed to build one chunk.
            ACT needs one pass. The designs that build a chunk out of random noise need more. pi0, a robot model from
            Physical Intelligence, needs 10 passes. <Cite id="F02-20">pi0 paper, section IV</Cite> The diffusion policy
            in LeRobot needs 100 passes by default.{' '}
            <Cite id="F02-16">Diffusion Policy paper, section 3.4</Cite>{' '}
            <Cite id="F02-17">LeRobot configuration_diffusion.py</Cite>
          </Box>
          <Box variant="p">
            The same two choices also determine what it costs to run the policy. The chunk length sets how many times
            per second the policy is called, and the output stage sets how many network passes each call takes. When
            you multiply the two numbers, you get the load that one arm puts on its GPU. The time that one call
            takes also turns into distance: while the call runs, the gripper keeps moving on actions that were chosen
            from an older observation (section 3, The Robot as a Computer).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Learn what one demonstration contains as data, and how few demonstrations a policy trained from scratch needs."
          >
            What a demonstration records, and how many you need
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            To record a demonstration, you sit at the bench and move the leader arm by hand, and the {ARM} copies its
            movements. In this way you make the {ARM} {TASK_STORY}: it reaches over the block, closes the gripper,
            carries the block to the cup and lets go. Then you put the block back in a slightly different place and
            do the task again. Each attempt, from start to finish, is called an episode. An episode recorded while a
            person drives the arm is called a demonstration. A person driving a robot in this way, here through the
            leader arm, is called teleoperation.
          </Box>
          <Box variant="p">
            While you work, the host computer records two things 30 times per second, and these are the two things
            that a policy learns to connect. The observation is two camera images and six joint angles. The action
            is the six target angles that your hand set through the leader arm. LeRobot&apos;s recorder stops after
            50 episodes by default.{' '}
            <Cite id="F02-67">LeRobot so_follower.py and the imitation learning tutorial</Cite>
          </Box>
          <Box variant="p">
            Fifty demonstrations were enough for ACT&apos;s authors. They trained ACT on 50 demonstrations per task,
            which is about 10 minutes of teleoperation. With a two-armed robot of their own, the authors report 80 to
            90% success on six real tasks. <Cite id="F02-10">ACT paper, abstract and section I</Cite> If each episode lasts <Toy>20</Toy>{' '}
            seconds and is recorded at 30 ticks per second, fifty episodes give 50 x <Toy>20</Toy> x 30 ={' '}
            <Derived>30,000</Derived> rows of data, and each row holds one observation and one action.{' '}
            <Cite id="F02-67">LeRobot so_follower.py and the imitation learning tutorial</Cite> So a first policy
            needs little data. What goes wrong is how training uses those rows: it learns only from the situations
            that the person visited.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Behaviour cloning trains a policy only on the situations that the person visited during the demonstrations. You will read its training objective term by term and see why a running arm, after its first mistake, reaches situations that training never covered."
          >
            Behaviour cloning and the situations it never trains on
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Training a network to copy the recorded rows directly is called behaviour cloning. It is supervised
            learning on those rows. Every tick of every episode gives one training pair: the observation that the person
            saw, and the action that the person took next. The network is trained to output that action when it is
            given that observation, in the same way as any regression model is fitted to a table of inputs and
            outputs. Nothing in this method is specific to robots. The person who gave the demonstrations is called
            the expert, and the trained network is the policy.{' '}
            <Cite id="F02-1">Ross, Gordon and Bagnell, section 1</Cite>
          </Box>
          <Box variant="p">
            Training searches for the weights that bring the policy&apos;s actions closest to the expert&apos;s actions,
            on average. How
            you measure the gap between two actions is a routine choice. The important question is which situations
            the average covers, and the formula shows this in a subscript. The formula uses these symbols:
          </Box>
          <ul style={LIST}>
            <li>
              <M>{String.raw`\pi`}</M> is a candidate policy, and <M>{String.raw`\Pi`}</M> is the set of all the
              policies that the network can represent, one for each setting of its weights.
            </li>
            <li>
              <M>s</M> is a situation that the robot is in. The paper calls it a state, and the observation is the
              part of the state that the policy sees.
            </li>
            <li>
              <M>{String.raw`\pi^*`}</M> is the expert, and <M>{String.raw`d_{\pi^*}`}</M> is the distribution of
              situations that the expert visits.
            </li>
            <li>
              <M>{String.raw`\ell(s, \pi)`}</M> is the loss in one situation: how far the policy&apos;s action there is
              from the expert&apos;s action.
            </li>
            <li>
              <M>{String.raw`\mathbb{E}`}</M> is an average, taken over the situations named in its subscript.
            </li>
          </ul>
          <Formula
            name="Behaviour cloning objective"
            tex={String.raw`\hat{\pi}_{\mathrm{sup}} = \arg\min_{\pi \in \Pi} \; \mathbb{E}_{s \sim d_{\pi^*}} \big[ \ell(s, \pi) \big]`}
            source={<Cite id="F11-1">Ross, Gordon and Bagnell, section 2.1, equation 2</Cite>}
          />
          <Box variant="p">
            In the formula, <M>{String.raw`\arg\min`}</M> stands for the training run. It finds the policy in{' '}
            <M>{String.raw`\Pi`}</M> with the lowest average loss, and <M>{String.raw`\hat{\pi}_{\mathrm{sup}}`}</M> is
            the policy that it returns. On this arm, the loss <M>{String.raw`\ell`}</M> compares six predicted target
            angles with the six recorded ones. The limitation is in the subscript{' '}
            <M>{String.raw`s \sim d_{\pi^*}`}</M>. The average covers the situations that the expert reached and no
            others. If the policy reaches a new situation through its own slightly wrong action, that situation adds
            no term to the average. So the objective neither penalises a bad action there nor rewards a good one.{' '}
            <Cite id="F11-1">Ross, Gordon and Bagnell, section 2.1, equation 2</Cite>
          </Box>
          <Box variant="p">
            The demonstrations have a second gap. They show how to do the task but never how to recover after a slip,
            because the expert did not slip. So <M>{String.raw`d_{\pi^*}`}</M> contains no recovery for the policy to
            copy.
          </Box>
          <Box variant="p">
            In ordinary supervised learning, where the inputs form a fixed table, neither gap would matter. That kind
            of learning assumes that the inputs met in use come from the same distribution as the training inputs.
            A robot breaks this assumption, because the policy&apos;s outputs determine its next inputs. Each action
            moves the arm, and the cameras then see the arm in its new position. So behaviour cloning is a
            regression problem whose test inputs come from the policy&apos;s own actions, mistakes included. A low
            training loss tells you that the policy agrees with the expert along the expert&apos;s path. It tells you nothing about the path that the policy will take on its own. This is why
            section 16, Evaluation, compares policies by counting successful episodes.{' '}
            <Cite id="F02-1">Ross, Gordon and Bagnell, section 1</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A policy that is almost always right can still close its gripper next to the block instead of on it. You will see why, work through a worst-case bound on what these mistakes cost, and find which of the bound's two factors you can change."
          >
            Compounding error: how small mistakes add up over a task
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            To see compounding error, run the cloned policy and watch the gripper approach the block. Its first
            actions are close to what the expert would do. Then one action is slightly off, and the gripper ends up
            a little to one side. The wrist camera now shows a view that appears in none of the fifty episodes,
            because the expert never went there. The policy was never trained on this input, so its next action is
            worse, and that action moves the arm even further from anything it was trained on. This feedback loop is
            called compounding error. <Cite id="F02-2">Ross, Gordon and Bagnell, section 1</Cite>
          </Box>
          <Box variant="p">
            At the bench, compounding error would look like a smooth, confident reach that closes the gripper next
            to the block. We worked out this description from the failure&apos;s mechanism, and the same holds for
            the descriptions in the table at the end of this section.
          </Box>
          <Box variant="p">
            The worst-case extra cost is the product of two counts. First, the policy has one chance at every decision to make
            its first mistake. Second, a mistake can spoil every decision that remains, because from then on the
            policy is off the demonstrated path. Both counts grow with the number of decisions, and this is where the
            square comes from. The bound uses four symbols:
          </Box>
          <ul style={LIST}>
            <li>
              <M>T</M> is the number of decisions in one task, called the horizon.
            </li>
            <li>
              <M>{String.raw`\epsilon`}</M> is the probability that the policy disagrees with the expert on one
              decision, measured on situations that the expert visited. It equals the average loss of the training
              objective when a disagreement counts as a loss of 1 and an agreement as 0.
            </li>
            <li>
              <M>{String.raw`J(\pi)`}</M> is the total cost that the policy is expected to run up over the whole task.
              Each step costs between 0 and 1, and a step that goes wrong counts as 1.
            </li>
            <li>
              <M>{String.raw`J(\pi^*)`}</M> is the same total for the expert.
            </li>
          </ul>
          <Box variant="p">With these symbols, the bound is:</Box>
          <Formula
            name="Compounding-error bound for behaviour cloning"
            tex={String.raw`J(\pi) \le J(\pi^*) + T^2 \epsilon`}
            source={<Cite id="F02-3">Ross, Gordon and Bagnell, theorem 2.1</Cite>}
          />
          <Box variant="p">
            The term <M>{String.raw`T^2 \epsilon`}</M> is the extra cost that copying can add on top of the
            expert&apos;s cost. One factor of <M>T</M>, multiplied by <M>{String.raw`\epsilon`}</M>, counts the first
            mistakes: <M>T</M> chances at a rate of <M>{String.raw`\epsilon`}</M> give{' '}
            <M>{String.raw`T \epsilon`}</M> mistakes if errors do not feed back. The second factor of <M>T</M> is the
            cost of one mistake, because up to <M>T</M> steps remain in which the policy can be wrong. The bound is a
            worst case, a ceiling on what can happen. The paper notes, citing earlier work, that there are problems
            where this ceiling is actually reached. The bound does not predict what a particular arm will do.{' '}
            <Cite id="F02-2">Ross, Gordon and Bagnell, section 1</Cite>{' '}
            <Cite id="F02-3">Ross, Gordon and Bagnell, theorem 2.1</Cite>
          </Box>
          <Box variant="p">
            Here is the bound with illustrative numbers. The <Toy>20</Toy>-second episode has <M>T</M> ={' '}
            <Derived>600</Derived> decisions. Suppose the policy makes a mistake that matters once in every{' '}
            <Toy>1,000</Toy> decisions in familiar situations, so <M>{String.raw`\epsilon`}</M> ={' '}
            <Toy>0.001</Toy>.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Without feedback.</strong> If mistakes did not feed each other, the episode would have{' '}
              <M>{String.raw`T \epsilon`}</M> = <Derived>600</Derived> x <Toy>0.001</Toy> = <Derived>0.6</Derived>{' '}
              mistakes.
            </li>
            <li>
              <strong>Worst case.</strong> The bound allows <M>{String.raw`T^2 \epsilon`}</M> ={' '}
              <Derived>360,000</Derived> x <Toy>0.001</Toy> = <Derived>360</Derived> wrong decisions.
            </li>
          </ul>
          <Box variant="p">
            So the ceiling allows <Derived>360</Derived> of the <Derived>600</Derived> decisions to be wrong, which is
            more than half the episode. Being right <Toy>999</Toy> times in <Toy>1,000</Toy> on the expert&apos;s path
            therefore guarantees very little about whether the arm reaches the block. The two factors also affect the
            ceiling differently. If you halve <M>{String.raw`\epsilon`}</M>, the ceiling halves. If you halve{' '}
            <M>T</M>, the ceiling drops to a quarter. So <M>T</M> is the factor to reduce.
          </Box>
          <Box variant="p">
            The 2011 paper that states the bound addresses the other weakness, the missing recovery data. Its method
            is called DAgger (Dataset Aggregation). DAgger runs the learned policy, asks the expert to label the
            situations that the policy actually reaches, adds those situations to the dataset and retrains the
            policy. With DAgger, the bound grows only linearly in <M>T</M> again. The method needs an expert who can be
            asked for the right action in situations that the policy got itself into. A recording session with a
            leader arm does not provide such an expert without extra work.{' '}
            <Cite id="F02-4">Ross, Gordon and Bagnell, abstract and section 3</Cite> ACT took the other approach and
            reduced <M>T</M>. <Cite id="F02-5">ACT paper, section IV-A</Cite> Section 8, Reinforcement Learning for
            Robots, returns to correcting a policy while it runs, in the form of human interventions.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="In the ACT paper, deciding once per chunk of actions raised the success rate from 1% to 44%. You will see how chunking divides the number of decisions, and at what point a longer chunk stops helping."
          >
            Action chunking: fewer decisions per task
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The worst-case error grows with the square of the number of decisions, so the way to reduce it is to make
            fewer decisions. An action chunk is the next <M>k</M> actions, all predicted from one observation. The
            host computer plays them in order, one per tick, and only then does the policy read a new observation.
            So a task of <M>T</M> ticks takes <M>T / k</M> decisions instead of <M>T</M>.{' '}
            <Cite id="F02-5">ACT paper, section IV-A</Cite>
          </Box>
          <Box variant="p">
            ACT is a transformer, the same network design that language models use. It reads the camera images and
            the joint angles and outputs a whole chunk in one forward pass. In the paper, the chunk is <M>k</M> = 100
            actions on a robot controlled at 50 Hz (50 actions per second), so one pass plans 2 seconds of motion.{' '}
            <Cite id="F02-5">ACT paper, section IV-A</Cite>{' '}
            <Cite id="F02-6">ACT paper, table III and the chunking ablation</Cite>
          </Box>
          <Box variant="p">
            The authors tested the effect of chunking with an ablation. An ablation is an experiment that changes one
            setting and keeps the others fixed. Averaged over four settings, the success rate went from 1% without
            chunking (<M>k</M> = 1) to 44% at <M>k</M> = 100. Above that, in the authors&apos; words, success
            &quot;slightly tapers down with higher k&quot;.{' '}
            <Cite id="F02-6">ACT paper, table III and the chunking ablation</Cite> The ablation passage gives no
            reason for this decline. The Diffusion Policy authors, who measured the same trade-off, name slow reaction
            time as the cause. <Cite id="F02-15">Diffusion Policy paper, key findings</Cite>
          </Box>
          <Box variant="p">
            LeRobot&apos;s version of ACT also uses chunks of 100 actions by default. At the {ARM}&apos;s 30 Hz, that
            is 3.33 s of motion per decision. The illustrative episode of <Derived>600</Derived> ticks then takes{' '}
            <Derived>600</Derived> / 100 = 6 decisions. With the same <M>{String.raw`\epsilon`}</M>, the ceiling
            becomes 6 x 6 x <Toy>0.001</Toy> = <Derived>0.036</Derived> wrong decisions. A wrong decision now spoils
            up to 100 ticks, so in ticks the ceiling is <Derived>3.6</Derived>, which is <Derived>100</Derived> times
            lower than <Derived>360</Derived>. Keeping <M>{String.raw`\epsilon`}</M> the same is a generous
            assumption, because choosing a whole chunk is harder than choosing one action, and the bound is still
            only a ceiling. So the arithmetic shows that chunking goes in the right direction, and the measured
            evidence for it is the ablation result of 1% to 44%.{' '}
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
                The two panels share the horizontal axis, which counts the ticks of the illustrative episode, so each
                dot on the table top sits directly above its ceiling in the chart. Steps 1 to 5 show the drift of a
                policy that decides on every tick, and steps 6 and 7 show the same episode with chunks. The figure is
                an illustration, not a measurement: the band, both paths and the cones are drawn by hand, and the
                curves follow the illustrative arithmetic in the text.
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
            description="Choose how many of the predicted actions the arm plays before the policy looks again. Then check whether your GPU is fast enough to average overlapping chunks, a technique called temporal ensembling."
          >
            Inside a chunk: reaction time, actions played and temporal ensembling
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On the arm, a chunk looks like commitment: the gripper carries out a whole reach without deciding again on
            every tick. The cost is reaction time. While a chunk plays, the policy does not read new observations, so
            if someone moves the cup, the arm finishes the old plan first. With LeRobot&apos;s ACT defaults on the{' '}
            {ARM}, the old plan lasts 3.33 s. <Cite id="F02-11">LeRobot configuration_act.py</Cite>
          </Box>
          <Box variant="p">
            So every chunked policy has two numbers: how many actions it predicts in one call, and how many of those
            actions the arm plays before the policy looks again. If the arm plays only the first part of each
            predicted chunk, the policy reacts sooner, but it has to be called more often. The Diffusion Policy
            authors measured this trade-off. Playing more than one action per call helps the policy keep its motion
            consistent. Playing too many &quot;reduces performance due to slow reaction time&quot;, and 8 actions
            worked best for most of the tasks they tested.{' '}
            <Cite id="F02-15">Diffusion Policy paper, section 3.2 and key findings</Cite> pi0 predicts 50 actions per
            call, and its authors report that on 50 Hz robots it plays 25 of them before it calls again.{' '}
            <Cite id="F02-18">pi0 paper, section IV</Cite> <Cite id="F02-22">pi0 paper, appendix D</Cite>
          </Box>
          <Box variant="p">
            Each codebase gives these two numbers its own names. A port of a policy to another library can also ship
            defaults four times longer than the original paper&apos;s. So read both numbers from the configuration
            that you actually run.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={TH}>Policy</th>
                  <th style={TH}>Actions predicted per call</th>
                  <th style={TH}>Actions played before the next call</th>
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
                    <code>n_action_steps</code>, 100 by default, which means one call every 3.33 s at 30 Hz
                  </td>
                  <td style={TD}>
                    <Cite id="F02-11">LeRobot configuration_act.py</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Diffusion Policy, original paper</td>
                  <td style={TD}>
                    The action prediction horizon <M>{String.raw`T_p`}</M>, which is 16
                  </td>
                  <td style={TD}>
                    The action execution horizon <M>{String.raw`T_a`}</M>, which is 8
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
                    <code>n_action_steps</code>, 32 by default, which means one call every 1.07 s at 30 Hz
                  </td>
                  <td style={TD}>
                    <Cite id="F02-17">LeRobot configuration_diffusion.py</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>pi0</td>
                  <td style={TD}>
                    50. The openpi code calls this number <code>action_horizon</code>, and LeRobot calls it{' '}
                    <code>chunk_size</code>.
                  </td>
                  <td style={TD}>
                    The authors report 25 on 50 Hz robots (one call every 0.5 s) and 16 on 20 Hz robots (one call
                    every 0.8 s).
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
            ACT&apos;s own answer to the period without new observations is called temporal ensembling. The policy is
            called on every tick, so the chunks overlap, and each tick has many predictions that were made at
            different moments. The arm receives their weighted average. The oldest prediction has the largest weight.
            This keeps the arm on the motion it is already making, while newer predictions change its course
            gradually. The weights are <M>{String.raw`w_i = \exp(-m \, i)`}</M>, where <M>i</M> = 0 is the oldest
            prediction and <M>m</M> sets how fast the weights fall. The smaller <M>m</M> is, the more even the
            weights are, and the sooner a new observation affects the motion. The authors introduced temporal
            ensembling &quot;to improve smoothness and avoid discrete switching between executing and
            observing&quot;. The cost is that temporal ensembling cancels all the savings in calls that chunking
            brought. At <M>k</M> = 100 and 50 Hz, plain chunking needs 0.5 forward passes per second, and temporal
            ensembling needs 50.{' '}
            <Cite id="F02-7">ACT paper, section IV-A</Cite>
          </Box>
          <Box variant="p">
            To find out whether a policy can afford temporal ensembling, divide one second by the time of one call.
            ACT&apos;s authors report about 0.01 s per inference on their GPU, which is about 100 forward passes per
            second, so the 50 calls per second fit. <Cite id="F02-9">ACT paper, section IV-C</Cite> For pi0, its
            authors report 73 ms per call on an RTX 4090 with 3 cameras.{' '}
            <Cite id="F02-21">pi0 paper, appendix D, table I</Cite> That is 1 / <Derived>0.073</Derived> ={' '}
            <Derived>13.7</Derived> calls per second, which is less than half of this arm&apos;s 30 ticks per second.{' '}
            <Cite id="F02-67">LeRobot so_follower.py and the imitation learning tutorial</Cite> The pi0 authors also
            report that temporal ensembling &quot;hurt policy performance&quot; when they tried it, and pi0 plays its
            chunks without it. <Cite id="F02-22">pi0 paper, appendix D</Cite> So chunking carried over from ACT into
            the pi0 models, and temporal ensembling did not.
          </Box>
          <Box variant="p">
            LeRobot leaves temporal ensembling off by default. To turn it on, you set{' '}
            <code>temporal_ensemble_coeff</code> (the paper uses 0.01), and you must also set{' '}
            <code>n_action_steps</code> to 1.{' '}
            <Cite id="F02-13">LeRobot configuration_act.py, temporal_ensemble_coeff</Cite> Besides plain chunks
            and temporal ensembling, there is a third option: start the next call while the current chunk is still
            playing. Section 17, Running on the Robot, covers this option.
          </Box>
          <ExpandableSection headerText="ACT in LeRobot v0.7.0: network sizes, default settings and where the code differs from the paper">
            <SpaceBetween size="s">
              <Box variant="p">
                The tensors are small. Each camera image first goes through ResNet-18, a standard image network that
                turns the image into feature vectors. A transformer with a width of 512 then reads those features
                together with the joint angles, and it outputs <code>chunk_size</code> rows of target angles.{' '}
                <Cite id="F02-11">LeRobot configuration_act.py</Cite>
              </Box>
              <Box variant="p">
                With <code>chunk_size = 100</code> and <code>n_action_steps = 100</code>, the policy predicts 100
                actions, and the arm plays all of them before the policy looks again. A note in the configuration
                file says that the defaults are set for a two-armed ALOHA robot. So on an {ARM}, you set your own
                inputs and outputs, and you may want a shorter chunk.{' '}
                <Cite id="F02-11">LeRobot configuration_act.py</Cite>
              </Box>
              <Box variant="p">
                The code sets <code>n_decoder_layers = 1</code>, while the paper&apos;s table lists 7. A comment in
                the code explains that the original implementation only ever used the first layer. When a paper and
                its code disagree, remember that the code is what you run.{' '}
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
            description="When people demonstrate a task in two valid ways, a policy trained by plain regression steers between them, for example into an obstacle that both ways go around. You will see why, and how ACT commits to one way in a single network pass."
          >
            Two valid ways to do a task, and why averaging them fails
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Suppose there is a second object on the table, an obstacle between the block and the cup. In some of your
            fifty episodes you carried the block around its far side, and in others around its near side. Both ways are
            correct. A network trained to make its average error small over all the episodes is pulled toward the
            middle. The middle is a straight line into the obstacle, which is a motion that nobody demonstrated.
          </Box>
          <Figure
            cites="F02-14"
            caption={
              <>
                The table top seen from above. Both groups of solid paths are good demonstrations, and the dashed line
                is what averaging them produces. The figure is an illustration, not a measurement, and the obstacle is
                our own example.
              </>
            }
          >
            <TwoWaysDiagram />
          </Figure>
          <Box variant="p">
            Each separate group of valid answers is called a mode. A set of demonstrations with several modes is
            called multimodal. The word multimodal also has a second meaning, for models that take both images and
            text, but in this section it means only that the good answers form separate groups. Multimodal
            demonstrations are common, because people grasp objects from different angles, at different speeds and
            by different routes. The Diffusion Policy authors call multimodal action distributions &quot;a well-known
            challenge for policy learning&quot;. <Cite id="F02-14">Diffusion Policy paper, section 1</Cite>
          </Box>
          <Box variant="p">
            The solution is to stop asking the network for a single best answer and to let it draw one answer from the set
            of good answers. The last part of a network, the part that produces its output, is called its head. On a
            policy, it is called the action head. A head that draws a sample, as an image generator does, is called a
            generative head. Four designs of generative head are in use, and the main difference between them is how
            much computation one sample costs:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>ACT&apos;s style variable.</strong> ACT adds one extra input, explained below, and one sample
              still takes one network pass.
            </li>
            <li>
              <strong>Diffusion.</strong> The head removes noise from a random chunk step by step, and one sample takes
              up to a hundred network passes.
            </li>
            <li>
              <strong>Flow matching.</strong> The head moves a random chunk toward a valid one along a straight path,
              and one sample takes ten short network passes.
            </li>
            <li>
              <strong>Tokens.</strong> A language model writes the chunk as tokens, and one sample takes a few dozen
              steps, one token at a time.
            </li>
          </ul>
          <Box variant="p">
            ACT keeps its single pass and adds one input, called a style variable. ACT is trained as a CVAE
            (conditional variational autoencoder). A CVAE is a model that is trained to rebuild its input through a
            small random vector. During training, a second network looks at the demonstrated chunk and compresses
            &quot;which way the person did it&quot; into a vector <M>z</M>. The policy receives <M>z</M> as one more
            input, so it is never asked to average two ways of doing the task. On the robot, the second network is
            removed and <M>z</M> is set to zero, which gives one consistent way of doing the task.{' '}
            <Cite id="F02-8">ACT paper, section IV and figure 4</Cite>
          </Box>
          <Box variant="p">
            ACT&apos;s training loss has two terms, one for each of the two things that training has to achieve. One
            term trains the policy to copy the demonstrated chunk. The other keeps the information in <M>z</M> small
            enough that <M>z</M> can be replaced by zero on the robot. The loss uses these symbols:
          </Box>
          <ul style={LIST}>
            <li>
              <M>{String.raw`a_{t:t+k}`}</M> is the demonstrated chunk: the <M>k</M> actions from tick <M>t</M>{' '}
              onward.
            </li>
            <li>
              <M>{String.raw`\hat{a}_{t:t+k}`}</M> is the chunk that the policy predicts from the observation and{' '}
              <M>z</M>.
            </li>
            <li>
              <M>{String.raw`q_\phi(z \mid a_{t:t+k}, \bar{o}_t)`}</M> is the output of the second network. It is a bell
              curve of likely values of <M>z</M>, described by a mean and a spread, and <M>z</M> is drawn from it. Here <M>{String.raw`\bar{o}_t`}</M> is the observation without its images, and{' '}
              <M>{String.raw`\phi`}</M> stands for the second network&apos;s weights.
            </li>
            <li>
              <M>{String.raw`\mathcal{N}(0, I)`}</M> is the standard bell curve, centred on zero.
            </li>
            <li>
              <M>{String.raw`D_{\mathrm{KL}}`}</M> is the KL (Kullback-Leibler) divergence. It is a number for how far
              one probability distribution is from another, and it is zero when they match.
            </li>
            <li>
              <M>{String.raw`\lVert \cdot \rVert_1`}</M> is the L1 distance: the absolute differences between two
              chunks, added up. LeRobot&apos;s code takes the mean of the absolute differences instead of their sum.
            </li>
            <li>
              <M>{String.raw`\beta`}</M> is a weight that you set. LeRobot&apos;s default for{' '}
              <M>{String.raw`\beta`}</M> is set relative to that mean.
            </li>
          </ul>
          <Formula
            name="ACT training loss"
            tex={String.raw`\begin{aligned} \mathcal{L} &= \mathcal{L}_{\mathrm{reconst}} + \beta \, \mathcal{L}_{\mathrm{reg}} \\ \mathcal{L}_{\mathrm{reconst}} &= \lVert \hat{a}_{t:t+k} - a_{t:t+k} \rVert_1 \\ \mathcal{L}_{\mathrm{reg}} &= D_{\mathrm{KL}}\big( q_\phi(z \mid a_{t:t+k}, \bar{o}_t) \\ &\qquad\quad \Vert\, \mathcal{N}(0, I) \big) \end{aligned}`}
            source={<Cite id="F11-2">ACT paper, algorithm 1 and section IV-C</Cite>}
          />
          <Box variant="p">
            The term <M>{String.raw`\mathcal{L}_{\mathrm{reconst}}`}</M> does the copying, because it pulls the
            predicted chunk toward the demonstrated one. The term <M>{String.raw`\mathcal{L}_{\mathrm{reg}}`}</M>{' '}
            pulls the second network&apos;s bell curve toward the standard one, and this has two effects. First,{' '}
            <M>z</M> can carry only a little information, enough to say which way the task was done and no more.
            Second, zero, the centre of the standard curve, is a value of <M>z</M> that the policy has met in
            training. <M>{String.raw`\beta`}</M> sets the balance between the two terms: the higher{' '}
            <M>{String.raw`\beta`}</M> is, the less information passes through <M>z</M>. LeRobot&apos;s default{' '}
            <M>{String.raw`\beta`}</M> is 10, and its <M>z</M> has 32 numbers. The paper&apos;s algorithm box labels
            the first term MSE (mean squared error), but the paper&apos;s text and LeRobot&apos;s code use L1.{' '}
            <Cite id="F11-2">ACT paper, algorithm 1 and section IV-C</Cite>{' '}
            <Cite id="F02-11">LeRobot configuration_act.py</Cite>{' '}
            <Cite id="F02-13">LeRobot modeling_act.py</Cite>
          </Box>
          <Box variant="p">
            This head adds no cost when the policy runs. The second network exists only during training, and a call
            on the arm is still one forward pass with <M>z</M> = 0. The ACT authors report that they found the CVAE
            objective &quot;essential in learning precise tasks from human demonstrations&quot;.{' '}
            <Cite id="F02-8">ACT paper, CVAE ablation</Cite> In LeRobot, the CVAE is on unless you set{' '}
            <code>use_vae</code> to false. <Cite id="F02-11">LeRobot configuration_act.py</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Learn what one denoising step does, and why a flow-matching head needs 10 steps where a diffusion policy trains with 100. The steps cost time when the policy runs on the arm, not during training."
          >
            Diffusion and flow matching: building the chunk from noise
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A diffusion policy starts from a chunk of random numbers: noise with one value for every number in an
            action chunk. A network looks at the observation and at the noisy chunk, and it predicts the noise in the
            chunk. Subtracting part of that predicted noise leaves a slightly cleaner chunk. Each round of prediction
            and subtraction is called a denoising iteration, and after many iterations a smooth trajectory appears.
            Training works the same way, but with the answer known. You take a demonstrated chunk, add a known amount
            of noise, and train the network to predict what was added. Every run on the robot starts from different
            noise, so different runs end on different modes, and each result is one complete way of doing the task.{' '}
            <Cite id="F02-14">Diffusion Policy paper, sections 2.1 to 2.3</Cite>
          </Box>
          <Box variant="p">The training loss expresses the same idea in symbols:</Box>
          <ul style={LIST}>
            <li>
              <M>{String.raw`O_t`}</M> is the observation at tick <M>t</M>.
            </li>
            <li>
              <M>{String.raw`A_t^0`}</M> is the demonstrated chunk that starts at tick <M>t</M>. The superscript
              counts the denoising iterations still to run, so 0 means a clean chunk.
            </li>
            <li>
              <M>k</M> is an iteration number picked at random. In this paper, <M>k</M> counts iterations, while in
              the ACT paper it was the chunk length.
            </li>
            <li>
              <M>{String.raw`\epsilon^k`}</M> is random noise with the strength that iteration <M>k</M> calls for.
              This <M>{String.raw`\epsilon`}</M> means noise, which is a different quantity from the error rate in
              the compounding-error bound.
            </li>
            <li>
              <M>{String.raw`\epsilon_\theta`}</M> is the network, with weights <M>{String.raw`\theta`}</M>.
            </li>
            <li>MSE is the mean squared error, the average of the squared differences.</li>
          </ul>
          <Formula
            name="Diffusion policy training loss (noise prediction)"
            tex={String.raw`\mathcal{L} = \mathrm{MSE}\big( \epsilon^k, \; \epsilon_\theta(O_t, \, A_t^0 + \epsilon^k, \, k) \big)`}
            source={<Cite id="F11-3">Diffusion Policy paper, section 2.3, equation 5</Cite>}
          />
          <Box variant="p">
            In the formula, <M>{String.raw`A_t^0 + \epsilon^k`}</M> is the demonstrated chunk with the noise added,
            and the network sees it together with the observation. The first argument of MSE,{' '}
            <M>{String.raw`\epsilon^k`}</M> alone, is the answer that the network should give. The network is also
            given <M>k</M>, because heavy noise and light noise need different answers and one set of weights has to
            serve every iteration. Each training example uses a single <M>k</M>, so a training step is one pass of
            the network, as in plain regression. The cost of the many iterations is paid when the policy runs on the
            arm. <Cite id="F11-3">Diffusion Policy paper, sections 2.2 and 2.3</Cite>
          </Box>
          <Box variant="p">
            The number of iterations at run time is a setting that you choose. The Diffusion Policy paper trains with
            100 iterations. DDIM (Denoising Diffusion Implicit Models) is a sampling method that skips iterations, so
            fewer network passes are needed. On real robots, the paper uses DDIM and runs 16 or 10 iterations. The
            authors report 0.1 s per inference at 10 iterations on an NVIDIA 3080 GPU.{' '}
            <Cite id="F02-16">Diffusion Policy paper, section 3.4</Cite> LeRobot&apos;s version runs 100 passes per
            call unless you set <code>num_inference_steps</code> to a lower value.{' '}
            <Cite id="F02-17">LeRobot configuration_diffusion.py</Cite> That default is ten times the 10 iterations
            behind the paper&apos;s real-robot timing of 0.1 s.
          </Box>
          <Box variant="p">
            Flow matching keeps the same plan, with noise going in and a chunk coming out. It makes the route from
            noise to chunk straight, so far fewer steps are needed. Picture every number in the noisy chunk as a
            point that has to travel to its place in a good chunk. The network&apos;s job is to say, for each point,
            which way to move and how fast. That answer is a velocity, and a velocity for every possible position is
            called a velocity field. Sampling starts at the noise, asks the network for the velocity, takes a step,
            and asks again. A straight route saves steps because each step is a straight move. On a straight route, a
            step stays on the route however long it is. On a curved route, a step leaves the route unless the step is
            short.
          </Box>
          <Box variant="p">One sampling step uses these symbols:</Box>
          <ul style={LIST}>
            <li>
              <M>x</M> is the chunk being built.
            </li>
            <li>
              <M>{String.raw`\tau`}</M> is flow time. It measures progress through the sampling, from 0 (pure noise)
              to 1 (finished chunk). All of flow time passes inside one policy call, so it is a different clock from
              the robot&apos;s tick <M>t</M>.
            </li>
            <li>
              <M>{String.raw`\delta`}</M> is the size of one step in flow time.
            </li>
            <li>
              <M>{String.raw`v(x, \tau)`}</M> is the network&apos;s output: one velocity for each number in <M>x</M>.
              The network also takes the observation as an input.
            </li>
          </ul>
          <Formula
            name="One sampling step of flow matching (an Euler step)"
            tex={String.raw`x \leftarrow x + \delta \, v(x, \tau)`}
            source={<Cite id="F02-20">pi0 paper, section IV, in this page&apos;s symbols</Cite>}
          />
          <Box variant="p">
            The <M>x</M> on the right side is where the chunk is now. <M>{String.raw`v(x, \tau)`}</M> is the direction
            from there toward a valid chunk, and it carries everything that the network learned from the
            demonstrations. <M>{String.raw`\delta`}</M> says how far to follow that direction before asking the
            network again. Taking a short straight step along the current velocity and then asking again is called
            an Euler step. pi0 builds a chunk of 50 actions in 10 Euler steps of size 0.1.{' '}
            <Cite id="F02-18">pi0 paper, section IV</Cite>{' '}
            <Cite id="F02-20">pi0 paper, section IV and appendix D</Cite> Section 5, Vision-Language-Action Models,
            explains the rest of the model.
          </Box>
          <Box variant="p">
            The network learns these directions in training. You take a demonstrated chunk <M>A</M> and noise{' '}
            <M>{String.raw`\epsilon`}</M> with the same dimensions, pick a random <M>{String.raw`\tau`}</M>, and blend
            the two into a point <M>x</M> partway between them. The network is trained to output{' '}
            <M>{String.raw`A - \epsilon`}</M>, which is the straight direction from that noise to that demonstration.
          </Box>
          <Formula
            name="Flow-matching training loss (velocity regression on the straight path)"
            tex={String.raw`\begin{aligned} x &= \tau A + (1 - \tau) \, \epsilon \\ \mathcal{L} &= \mathbb{E} \, \big\lVert v(x, \tau) - (A - \epsilon) \big\rVert^2 \end{aligned}`}
            source={<Cite id="F02-19">pi0 paper, section IV, in this page&apos;s symbols</Cite>}
          />
          <Box variant="p">
            The first line is the blend. At <M>{String.raw`\tau = 0`}</M>, <M>x</M> is all noise. At{' '}
            <M>{String.raw`\tau = 1`}</M>, it is all demonstration. In between, it slides along the straight line that
            joins them. <M>{String.raw`A - \epsilon`}</M> is the velocity along that line. It is the same at every{' '}
            <M>{String.raw`\tau`}</M>, which is why the path is straight. The second line is plain regression. It
            takes the squared distance between the network&apos;s velocity and <M>{String.raw`A - \epsilon`}</M>, and
            averages it (<M>{String.raw`\mathbb{E}`}</M>) over demonstrations, noise draws and flow times. In this way,
            the network learns a direction for every point that a sample can pass through. As with diffusion, a
            training step is one network pass.
          </Box>
          <Box variant="p">
            Here is how one number of one chunk moves, with illustrative values. The noise is <Toy>0.8</Toy> and the
            demonstrated value is <Toy>0.2</Toy>, so the direction is <Toy>0.2</Toy> - <Toy>0.8</Toy> ={' '}
            <Derived>-0.6</Derived>. Each of the ten steps moves the number by <Toy>0.1</Toy> x{' '}
            <Derived>-0.6</Derived> = <Derived>-0.06</Derived>: from <Toy>0.8</Toy> to <Derived>0.74</Derived>, then
            to <Derived>0.68</Derived>, and on the tenth step to <Derived>0.2</Derived>. On the robot, there is no
            demonstrated value to aim at. The network supplies the direction from what it learned, and where a point
            ends depends on where its noise started. This is how one run ends on the far-side way around the obstacle
            and another run ends on the near-side way.
          </Box>
          <AnimatedFigure
            name="flow matching, from noise to an action chunk"
            steps={DEMO_FLOW_STEPS}
            intervalMs={2400}
            cites="F02-18 F02-20 F02-16"
            caption={
              <>
                The figure shows the same 10 steps in three views, with every second step drawn. The first view shows
                one joint of one chunk: each dot is one of the 50 actions, and its arrow is the velocity that the
                network gives it. The second view shows two noise draws that end on the two ways around the obstacle.
                The third view shows the whole chunk as numbers. The figure is an illustration, not a measurement: the
                noise and the curves are drawn by hand, and the readout under the clock repeats the illustrative
                values from the text.
              </>
            }
          >
            {(step, reduced) => <DemoFlow step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            So flow matching works like diffusion with a straight path and few steps. pi0 uses 10 steps, while
            LeRobot&apos;s Diffusion Policy runs 100 when <code>num_inference_steps</code> is not set. Each pi0 step is
            also cheaper than a full network pass. pi0 encodes the observation once and caches the result, so each
            step re-runs only the action part of the network. <Cite id="F02-20">pi0 paper, section IV</Cite>{' '}
            <Cite id="F02-17">LeRobot configuration_diffusion.py</Cite>
          </Box>
          <Box variant="p">
            Configuration files also call flow-matching steps denoising steps. In LeRobot, the pi0 setting is{' '}
            <code>num_inference_steps</code>, with a default of 10.{' '}
            <Cite id="F02-29">LeRobot pi0 and pi0_fast configuration files</Cite> The openpi code, as its own comment
            says, runs flow time in the opposite direction to the paper, with noise at 1 and the finished chunk at 0.
            So before you compare a formula with the source code, check which direction of flow time it uses.{' '}
            <Cite id="F02-24">openpi pi0.py</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Learn what it costs when a language model writes the action chunk one token at a time. You will also see why one family of models trains with tokens and runs with flow matching."
          >
            Tokenised actions: cheaper to train, slower to run
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A language model produces tokens, so the fourth design writes the action chunk as tokens. The language
            model inside a robot model then predicts these tokens one at a time. The plain scheme rounds every joint
            value at every tick into one of 256 bins and uses one token for each value. For this arm&apos;s 6 numbers
            and a chunk of 50 actions, that is 6 x 50 = 300 tokens. When the motion is smooth, neighbouring tokens
            barely differ, so each one carries almost no new information. The authors of FAST (Frequency-space Action
            Sequence Tokenization) report that this makes training hard at high control rates, and they built the
            FAST tokeniser to fix it. <Cite id="F02-25">FAST paper, sections III and IV</Cite>
          </Box>
          <Box variant="p">
            FAST compresses the chunk before it turns it into tokens. First, it applies the DCT (discrete cosine
            transform). The DCT rewrites a signal as a sum of cosine waves, so a smooth motion needs only a few
            numbers. FAST then rounds those numbers and packs them with BPE (byte-pair encoding). BPE is the
            compression method that text tokenisers use, and it merges pairs of symbols that occur often. The
            authors report about 30 tokens per chunk per arm.{' '}
            <Cite id="F02-26">FAST paper, sections V and VI</Cite> Compared with the 300 tokens of the plain scheme
            for this arm, that is 300 / 30 = <Derived>10</Derived> times fewer.{' '}
            <Cite id="F02-25">FAST paper, sections III and IV</Cite>
          </Box>
          <Box variant="p">
            The trade-off is between training time and run time. The FAST authors report about 5x fewer GPU-hours of
            training than flow-matching pi0. At run time, they report about 750 ms per chunk, against under 100 ms for
            flow-matching pi0. <Cite id="F02-27">FAST paper, sections VI-E and VII</Cite> The gap at run time has two
            causes:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Number of steps.</strong> The token model decodes 30 to 60 tokens one at a time, while the flow
              head takes 10 steps.
            </li>
            <li>
              <strong>Size of each step.</strong> Every token passes through the full language model of 2B
              parameters, while a flow step runs an action network of 300M parameters.{' '}
              <Cite id="F02-27">FAST paper, sections VI-E and VII</Cite>
            </li>
          </ul>
          <Box variant="p">
            pi0.5, a later model in the same family, uses both sides of this trade-off. It is pretrained with FAST
            tokens, and it is then given a flow-matching action head for inference.{' '}
            <Cite id="F02-49">pi0.5 paper, figure 3 and section IV-D</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Size the GPU that runs the policy of one arm, using three numbers that describe the policy. You will also be able to tell, from what the arm does at the bench, which setting is wrong."
          >
            Sizing the GPU: calls per second and passes per call
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The inference load of one arm is the product of two numbers. The first is calls per second, which is the
            control rate divided by the number of actions played per call. The second is the number of network
            passes in each call, and that depends on the head:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>ACT</strong> runs one forward pass.
            </li>
            <li>
              <strong>A diffusion policy</strong> runs 10 to 100 passes.
            </li>
            <li>
              <strong>pi0</strong> reads the images once and then runs ten small action passes.
            </li>
            <li>
              <strong>FAST</strong> runs 30 to 60 token steps.
            </li>
          </ul>
          <Box variant="p">
            The times in the next table are the figures that each paper&apos;s authors report. Each row was timed on
            a different GPU, so the times are not directly comparable across rows.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={TH}>Policy</th>
                  <th style={TH}>What one call computes</th>
                  <th style={TH}>Time per call reported by the authors</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>ACT</td>
                  <td style={TD}>One forward pass of a network of about 80M parameters</td>
                  <td style={TD}>
                    About 0.01 s on one 11 GB RTX 2080 Ti. The same GPU trained ACT from scratch in about 5 hours.
                  </td>
                  <td style={TD}>
                    <Cite id="F02-9">ACT paper, section IV-C</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Diffusion Policy</td>
                  <td style={TD}>10 denoising passes with DDIM in the paper, and 100 by default in LeRobot</td>
                  <td style={TD}>0.1 s on an NVIDIA 3080 at 10 passes</td>
                  <td style={TD}>
                    <Cite id="F02-16">Diffusion Policy paper, section 3.4</Cite>{' '}
                    <Cite id="F02-17">LeRobot configuration_diffusion.py</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>pi0 (flow matching)</td>
                  <td style={TD}>The image encoders, one pass over the observation, and then ten action passes</td>
                  <td style={TD}>14 ms + 32 ms + 27 ms = 73 ms on an RTX 4090 with 3 cameras</td>
                  <td style={TD}>
                    <Cite id="F02-21">pi0 paper, appendix D, table I</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>pi0 with FAST tokens</td>
                  <td style={TD}>30 to 60 tokens, each one a step of the full language model</td>
                  <td style={TD}>
                    About 750 ms per chunk. The same authors give under 100 ms for flow-matching pi0 on an NVIDIA
                    4090.
                  </td>
                  <td style={TD}>
                    <Cite id="F02-27">FAST paper, sections VI-E and VII</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            The pi0 row shows where the time of one call goes. Of the 73 ms, 46 ms (63%) is spent on processing the
            observation: the image encoders and the pass over the observation. The ten flow steps take 27 ms, which
            is 2.7 ms each. Halving the number of steps would save only <Derived>13.5</Derived> ms of the 73 ms (27 /
            2), because the larger share of the time is spent before the first step. When the GPU is not on the
            robot, the authors add 13 ms of network latency, for 86 ms in total.{' '}
            <Cite id="F02-21">pi0 paper, appendix D, table I</Cite>
          </Box>
          <Box variant="p">
            On 50 Hz robots, pi0 calls the model every 0.5 s, after 25 actions.{' '}
            <Cite id="F02-22">pi0 paper, appendix D</Cite> That is 2 calls per second of 73 ms each, so the model is
            busy for <Derived>146</Derived> ms of every second (2 x 73), about <Derived>15</Derived>% of the time.{' '}
            <Cite id="F02-21">pi0 paper, appendix D, table I</Cite> As section 3, The Robot as a Computer, showed, a
            delay also turns into distance. At the illustrative arm speed of <Toy>0.25</Toy> m/s used there, a call
            of 73 ms means that the gripper travels <Toy>0.25</Toy> x <Derived>0.073</Derived> ={' '}
            <Derived>0.018</Derived> m on old information, which is about <Derived>18</Derived> mm. For the token
            model&apos;s 750 ms, the distance is <Derived>188</Derived> mm (<Toy>0.25</Toy> x{' '}
            <Derived>0.75</Derived>). <Cite id="F02-27">FAST paper, sections VI-E and VII</Cite> Chunks let the arm
            keep moving during a slow call, but the gripper still covers that distance on old information.
          </Box>
          <Box variant="p">
            Every policy in this section uses chunking. Whether a generative head is always needed is less settled.
            The authors of OpenVLA-OFT started from a 7B model that wrote actions as tokens. They changed its head so
            that it predicts the whole chunk in one parallel pass, trained with a plain L1 regression loss. They
            report that average success across the four task suites of LIBERO, a benchmark of simulated manipulation
            tasks, rose from 76.5% to 97.1%. <Cite id="F02-68">OpenVLA-OFT paper, abstract</Cite> A head that
            samples one mode is the usual choice for human demonstrations, and this result suggests that it is not
            always needed.
          </Box>
          <Box variant="p">
            Each of these mechanisms fails in its own way at the bench, and the fix is usually one configuration
            value.
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
                  <td style={TD}>A smooth reach that closes the gripper next to the block</td>
                  <td style={TD}>Compounding error, from too many decisions per task</td>
                  <td style={TD}>
                    Play more actions per decision. In ACT&apos;s ablation, success improved from <M>k</M> = 1 up to{' '}
                    <M>k</M> = 100.
                  </td>
                  <td style={TD}>
                    <Cite id="F02-2">Ross, Gordon and Bagnell, section 1</Cite>{' '}
                    <Cite id="F02-6">ACT paper, chunking ablation</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The arm completes its motion to where the cup used to be</td>
                  <td style={TD}>A long chunk played to the end without a new observation</td>
                  <td style={TD}>
                    Lower the number of actions played, and keep the number predicted. The Diffusion Policy authors
                    found 8 best for most of their tasks.
                  </td>
                  <td style={TD}>
                    <Cite id="F02-15">Diffusion Policy paper, key findings</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>A jerk each time one chunk ends and the next one begins</td>
                  <td style={TD}>The switch between executing and observing</td>
                  <td style={TD}>
                    Use temporal ensembling if one call fits inside a tick. Otherwise, start the next call early
                    (section 17, Running on the Robot).
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
                    In ACT, leave <code>use_vae</code> on. In other policies, use a head that samples.
                  </td>
                  <td style={TD}>
                    <Cite id="F02-8">ACT paper, section IV</Cite>{' '}
                    <Cite id="F02-11">LeRobot configuration_act.py</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>A call of a LeRobot diffusion policy takes many times longer than you budgeted</td>
                  <td style={TD}>
                    <code>num_inference_steps</code> is not set, so it defaults to 100 passes, while the paper&apos;s
                    robots ran 16 or 10
                  </td>
                  <td style={TD}>
                    Set <code>num_inference_steps</code>.
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
            Each policy creates two jobs with different workload types (section 20, The Fifteen Workloads): training
            the policy, and calling it on the arm. Both jobs are matrix arithmetic. A GPU runs this arithmetic on its
            tensor cores, the units built for matrix multiply-and-accumulate. Training ACT from scratch is a small
            job. ACT&apos;s authors report about 5 hours on one 11 GB RTX 2080 Ti for about 80M parameters.{' '}
            <Cite id="F02-9">ACT paper, section IV-C</Cite> So its workload type is Long single-machine runs. In
            this job, the CPU cores that decode the episode video can become the bottleneck before the GPU does
            (section 10, Processing and Curating). When the same heads sit inside a large pretrained model, training
            is far larger. The FAST authors report about 4 days on 8 H100 GPUs for one run of a 3B-parameter token
            model. <Cite id="F02-28">FAST paper, appendix, DROID training details</Cite> Section 15, Training at
            Three Scales, compares the sizes. The call on the arm is the same arithmetic, but its workload type is
            Real-time on the robot. Each call has to return before the chunk in play runs out, every time, for as
            long as the arm runs.
          </Box>
          <Box variant="p">
            To choose a policy for your arm, first write down three numbers for it: the actions it predicts per call,
            the actions it plays before it looks again, and the network passes in one call. The first two numbers
            exist because of chunking, the change that moved success from 1% to 44% in ACT&apos;s ablation.{' '}
            <Cite id="F02-6">ACT paper, chunking ablation</Cite> The third number is the cost of the head: 1, 10 or
            100 passes. <Cite id="F02-17">LeRobot configuration_diffusion.py</Cite> Your control rate divided by the
            actions played gives the calls per second. Then measure the time of one call on your GPU. Working from
            the tuning rule in LeRobot&apos;s remote inference guide, we estimate that this time has to stay under
            about half the duration of the chunk that the policy predicts.{' '}
            <Cite id="F07-22">LeRobot remote inference guide, tuning</Cite> Section 17, Running on the Robot, works
            through this estimate. Finally, multiply the same time by the speed of your gripper to get the distance
            that the gripper travels on an old observation.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
