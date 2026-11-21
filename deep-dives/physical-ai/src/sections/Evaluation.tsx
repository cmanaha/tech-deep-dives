import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Toy, Derived } from '../components/Cite';
import { Figure } from '../components/Figure';
import { Formula, M } from '../components/Math';
import { linear, ticks } from '../lib/scale';
import { ARM, TASK_STORY } from '../lib/task';
import { Capture, MUJOCO_SO101, Seen } from '../components/Capture';
import { EvalLadder } from '../components/figures/EvalLadder';
import { EvalLoops } from '../components/figures/EvalLoops';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const CPU_INK = '#1f5fa8';
const NEUTRAL_INK = '#5f6b7a';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 560, margin: '0 auto' };
const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const LABEL = { fontFamily: 'sans-serif', fontSize: 13, fill: INK } as const;

/* ------------------------------------------------------------------------ */
/* Diagram 16.3: two Wilson intervals from 50 trials each                   */
/* ------------------------------------------------------------------------ */

const CI_X = linear(50, 100, 40, 396);
const CI_ROWS = [
  { name: 'Checkpoint A: 40 of 50', lo: 67.0, mid: 80, hi: 88.8, y: 72 },
  { name: 'Checkpoint B: 45 of 50', lo: 78.6, mid: 90, hi: 95.7, y: 138 },
];

function IntervalChart() {
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 420 262" role="img" aria-labelledby="evaluation-intervals-title" style={{ width: '100%', height: 'auto' }}>
        <title id="evaluation-intervals-title">95% Wilson intervals for 40 of 50 and 45 of 50 successes, overlapping</title>
        <desc>
          Two horizontal intervals on an axis of true success rate in percent. Checkpoint A, 40 of 50,
          spans 67.0 to 88.8 percent. Checkpoint B, 45 of 50, spans 78.6 to 95.7 percent. They overlap from 78.6 to
          88.8 percent.
        </desc>
        <rect x="0" y="0" width="420" height="262" fill="#fbfbfd" />
        {/* the overlap */}
        <path d={`M${CI_X(78.6)},34 H${CI_X(88.8)} V208 H${CI_X(78.6)} Z`} fill="#efe9fb" />
        {ticks(50, 100, 10).map((v) => (
          <g key={v} aria-hidden="true">
            <line x1={CI_X(v)} y1="208" x2={CI_X(v)} y2="214" stroke={NEUTRAL_INK} strokeWidth="1.5" />
            <text x={CI_X(v)} y="230" textAnchor="middle" {...LABEL}>
              {v}
            </text>
          </g>
        ))}
        <line x1={CI_X(50)} y1="208" x2={CI_X(100)} y2="208" stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <text x="218" y="252" textAnchor="middle" {...LABEL}>
          true success rate (%)
        </text>
        {CI_ROWS.map((r) => (
          <g key={r.name}>
            <text x="40" y={r.y - 18} {...LABEL} fontWeight="bold">
              {r.name}
            </text>
            <line x1={CI_X(r.lo)} y1={r.y} x2={CI_X(r.hi)} y2={r.y} stroke={CPU_INK} strokeWidth="3" />
            <line x1={CI_X(r.lo)} y1={r.y - 7} x2={CI_X(r.lo)} y2={r.y + 7} stroke={CPU_INK} strokeWidth="3" />
            <line x1={CI_X(r.hi)} y1={r.y - 7} x2={CI_X(r.hi)} y2={r.y + 7} stroke={CPU_INK} strokeWidth="3" />
            <circle cx={CI_X(r.mid)} cy={r.y} r="6" fill="#ffffff" stroke={CPU_INK} strokeWidth="3" />
            <text x={CI_X(r.lo)} y={r.y + 24} textAnchor="middle" {...LABEL}>
              {r.lo.toFixed(1)}%
            </text>
            <text x={CI_X(r.mid)} y={r.y + 24} textAnchor="middle" {...LABEL}>
              {r.mid}%
            </text>
            <text x={CI_X(r.hi)} y={r.y + 24} textAnchor="middle" {...LABEL}>
              {r.hi.toFixed(1)}%
            </text>
          </g>
        ))}
        <text x={(CI_X(78.6) + CI_X(88.8)) / 2} y="196" textAnchor="middle" {...LABEL} fill="#5b3fa8">
          overlap
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function Evaluation() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Know why a falling loss does not mean a working robot, and the three ways to measure what does (LeRobot v0.7.0, sources read 2026-11-20)"
          >
            16. Evaluation
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Evaluation answers one question: does this policy do the task? Training reports a loss. The task is
            judged by the share of attempts in which the block ends up in the cup. This section
            explains why the two can disagree and builds a ladder of three ways to measure the second, from the
            cheapest check to the most trusted: run the policy in a simulator, run it inside a world model, run it
            on the real arm.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="What the challenge looks like at the bench, before any term is introduced">
            Two checkpoints, one drops the block
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The {ARM} of this dive has to {TASK_STORY}. A training run saved two checkpoints an hour apart, and their
            validation losses agree to the third decimal place. You load the first. The arm reaches the block, closes
            on it, carries it across and lowers it into the cup. You load the second. The arm reaches the block,
            closes on it, lifts, and halfway to the cup the block slides out of the gripper. The arm finishes the
            motion and opens its fingers over the cup with nothing in them.
          </Box>
          <Box variant="p">
            Nothing in the training log tells these two apart. The log measures the policy one way, and the bench
            measures it another.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="See what a validation loss leaves out, and the published evidence that leaving it out changes which policy looks best">
            Open loop against closed loop
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The validation loss is an open-loop score. Take a recorded demonstration the policy was not trained on.
            For each frame, show the policy the recorded camera image and joint angles, and compare the action it
            predicts with the action the person took at that moment. The usual summary is the MSE (mean squared
            error), the average squared distance between the two. Write <M>T</M> for the number of frames,{' '}
            <M>{String.raw`a^{\text{pred}}_t`}</M> for the policy&apos;s action at frame <M>t</M> and{' '}
            <M>{String.raw`a^{\text{demo}}_t`}</M> for the recorded one; on this arm each is a list of six joint
            targets. The double bars measure the distance between two such lists.
          </Box>
          <Formula
            name="Open-loop score: mean squared error against the recording (this page's definition)"
            tex={String.raw`\mathrm{MSE} = \frac{1}{T} \sum_{t=1}^{T} \bigl\lVert a^{\text{pred}}_t - a^{\text{demo}}_t \bigr\rVert^2`}
          />
          <Box variant="p">
            The difference inside the bars is how far the policy&apos;s answer is from the person&apos;s at one frame.
            Squaring makes large misses count most, and dividing the sum by <M>T</M> averages over the
            recording. Many codebases also divide by the number of action dimensions, six here, which rescales the
            value and changes no ranking. The formula has no term for what happens next: frame <M>t + 1</M> comes from the recording
            whatever the policy answered at frame <M>t</M>. The policy is never asked what it would do after a mistake of its own, which is the compounding error
            of section 4, Learning From Demonstrations.
          </Box>
          <Box variant="p">
            A closed-loop score lets the policy drive. Its action moves the arm, the moved arm changes the next
            camera image, and that image is what the policy sees next. One complete run, from the starting pose until
            the task succeeds, fails or runs out of time, is a rollout; trial and episode mean the same thing here. Each rollout ends in a yes or a no. The success rate is the number of
            yeses divided by the number of rollouts.
          </Box>
          <Figure
            caption={
              <>
                The same policy and the same list of small errors in both plots. In open loop each blue stub
                starts on the recorded line, so no error meets the next one. In closed loop each step starts where
                the last one ended, the errors add up, and the joint ends away from the cup. An illustration: the
                curve and the errors are invented, not measured.
              </>
            }
          >
            <EvalLoops />
          </Figure>
          <Box variant="p">
            To judge a cheap score, measure several policies on real robots and with the cheap score, and ask
            whether the two lists agree. The usual yardstick is the Pearson correlation{' '}
            <M>r</M>, a number between -1 and 1 that says how closely two lists rise and fall together. At 1
            the cheap score predicts the real one exactly and at 0 it says nothing.
          </Box>
          <Box variant="p">
            The paper that established the point is SIMPLER, from 2024, cited here as history. Its authors scored a
            set of policies on real robots, by validation action MSE, and in closed loop in a simulator built to
            match the real camera view. They report that ranking the policies by MSE gave a
            Pearson <M>r</M> of 0.308 with real-world success on average, against 0.924 for the closed-loop
            simulated score. In their words, &quot;validation MSE is not a good proxy for a policy&apos;s real-world
            performance&quot;. <Cite id="F06-81">SIMPLER paper, section VI and Table I</Cite>
          </Box>
          <Box variant="p">
            The report of a challenge at ICRA 2026 (the International Conference on Robotics and Automation) names
            what the open-loop score misses: it
            &quot;does not fully capture closed-loop effects such as compounding errors, contact dynamics, or recovery
            ability&quot;. <Cite id="F06-85">REAL-I challenge report, discussion of evaluation</Cite> A block sliding
            out of a gripper is contact dynamics.
          </Box>
          <ExpandableSection headerText="Where open-loop error is still useful, and a later report of the same finding">
            <SpaceBetween size="s">
              <Box variant="p">
                The authors of ABC, a 2026 study of behaviour cloning (the imitation learning of section 4), report
                that across their own policy variants lower validation action error went with better real-world
                performance, a statistically significant correlation, while validation loss &quot;is not
                significantly correlated&quot;. They add that offline metrics &quot;cannot reliably predict task
                success rates or reveal failure modes&quot;. <Cite id="F06-84">ABC paper, section 4</Cite> Our
                reading of the two results together: action error helps choose among variants of one policy, and
                ranking different policies or predicting a success rate takes a closed loop.
              </Box>
              
              <Box variant="p">
                AWS reports the same from a customer engagement: &quot;offline MSE does not monotonically predict
                closed-loop success&quot;.{' '}
                <Cite id="F06-86">AWS Physical AI blog, Telexistence and DreamZero, post of 2026-09-09</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Score every checkpoint overnight with no arm in the room, and know the two ways a simulated score flatters a policy">
            Rung one: closed loop in simulation
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On the first rung the physics simulator of section 12 stands in for the bench. The policy drives a
            simulated arm, the simulator checks whether the block ended in the cup, and many copies run at once. In
            LeRobot v0.7.0 the tool is <code>lerobot-eval</code>: it runs a checkpoint in closed loop in a
            batch of simulated environments and reports the success rate with a 95% Wilson confidence interval, a
            range explained on rung three. <Cite id="F06-94">LeRobot v0.7.0, simulation docs and eval_stats.py</Cite>{' '}
            LeRobot ships no {ARM} simulator of its own, so the environment comes from outside, for example the
            MuJoCo Playground task of section 14.{' '}
            <Cite id="F06-38">LeRobot v0.7.0, simulation integrations</Cite>
          </Box>
          <Box variant="p">
            <strong>What it can tell you.</strong> Which of several policies is better, when the simulator is close
            to the bench. That is the SIMPLER authors&apos; 0.924. <Cite id="F06-81">SIMPLER paper, Table I</Cite> The PolaRiS authors, who rebuild a real scene
            from a scan, report an average Pearson correlation of <M>r</M> = 0.9 with real results across six
            paired environments, and <M>r</M> = 0.81 in the worst one. The figure rests on four policies, each first fine-tuned briefly on simulated demonstrations.{' '}
            <Cite id="F06-83">PolaRiS paper, introduction and sections 5.1 and 5.2</Cite>
          </Box>
          <Box variant="p">
            <strong>What it cannot tell you.</strong> The success rate on your bench, for one: the sim-to-real gap
            of section 14 sits between the simulated number and the real one. The other limit comes from
            benchmarks, fixed sets of simulated tasks that everyone scores on. A benchmark is saturated when nearly every policy scores near the top, so the score no
            longer separates them. LIBERO, a suite of simulated manipulation tasks, is the current example: the
            PolaRiS authors found &quot;nearly all tested policies scoring between 90 and 95% success in Libero, but
            spanning the full spectrum from high-performing to low-performing policies in the real world&quot;.{' '}
            <Cite id="F06-82">PolaRiS paper, section 5.2</Cite>
          </Box>
          <Box variant="p">
            The answer to saturation is to vary the scene. LIBERO-Plus changes seven things about each
            task, among them the camera viewpoint, the lighting and the arm&apos;s starting pose, and its authors
            report performance &quot;dropping from 95% to below 30% under modest perturbations&quot;.{' '}
            <Cite id="F06-87">LIBERO-Plus paper, abstract</Cite> Isaac Lab-Arena, NVIDIA&apos;s evaluation tool for its Isaac Lab simulator, added sweeps over lighting, backgrounds,
            camera parameters and object mass in its v0.3 alpha.{' '}
            <Cite id="F06-92">Isaac Lab-Arena, v0.3 announcement</Cite>
          </Box>
          <Capture
            file="so101-eval-grid.jpg"
            kind="still"
            width={1280}
            height={720}
            alt="A grid of twelve final frames from twelve simulated trials, eight with a green border where the block is in the cup and four with a red border where it is not."
            caption={
              <>
                Closed-loop trials as a picture: <Seen>12</Seen> runs, each starting with the block moved by up to{' '}
                <Seen>12</Seen> mm on each axis, each scored by where the block ends. Green means in the cup:{' '}
                <Seen>8</Seen> of <Seen>12</Seen>. The motion is a fixed script that does not look at the block, which
                is why a small shift is enough to make it miss. A policy is scored the same way.
              </>
            }
            provenance={MUJOCO_SO101}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Score a policy with no scene to build, and weigh correlations that so far come from each tool's own authors">
            Rung two: scoring with a world model
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 6 listed scoring a policy as one of the five uses of a world model. Start
            from the first camera frame of a real episode. The policy outputs its actions. A video world model
            generates what the cameras would show next, and those generated frames go back to the policy. When the
            rollout ends, a vision-language model, a model that takes images and text, watches the generated video
            and judges whether the task was done. Nobody builds a scene or types in a friction value.
          </Box>
          <Box variant="p">
            The authors of RoboWorld, one such evaluator, ran 8 policies through 4,186 generated rollouts of 30 seconds each and compared
            the result with RoboArena, a real-robot ranking. They report a Pearson correlation of 0.989 and a
            Spearman correlation of 0.970. <Cite id="F06-89">RoboWorld paper, abstract and section 5</Cite> Spearman
            is the same calculation applied to rank positions, so it measures rank agreement: whether both lists put
            the policies in the same order.
          </Box>
          <Box variant="p">
            In RoboArena, evaluators at seven academic
            institutions run pairs of policies on the same model of robot without knowing which is which. The paper
            reports &quot;more than 600 pairwise real-robot
            evaluation episodes across seven generalist policies&quot;.{' '}
            <Cite id="F06-88">RoboArena paper, abstract</Cite>
          </Box>
          <Box variant="p">
            <strong>What it can and cannot tell you.</strong> Reported agreement with real results runs from{' '}
            <M>r</M> = 0.78 for WorldGym to 0.983 for HF-WM (two more evaluators of this kind) and 0.989 for RoboWorld, and each figure comes from
            the authors of the tool it describes. When the PolaRiS authors tried someone else&apos;s open-source
            video model, they found it &quot;often produces heavy hallucinations during object interaction&quot; and
            mis-ranked the policies.{' '}
            <Cite id="F06-90">WorldGym, HF-WM and PolaRiS papers</Cite>{' '}
            <Cite id="F06-89">RoboWorld paper, abstract</Cite> The block leaving the gripper is an object
            interaction, the kind of moment a video model can get wrong. Treat this rung as promising and
            unsettled.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Decide, before the first trial, how many trials your question needs">
            Rung three: the real arm, and how many trials
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The real arm is the reference every lower rung is measured against. It gives a count from a small number
            of trials, and a small count is noisy. Take the two checkpoints.
          </Box>
          <Box variant="p">
            Checkpoint A succeeds in 40 of 50 trials: 40 / 50 = 80%. Checkpoint B succeeds in 45 of 50: 45 / 50 =
            90%. Is B better? Each trial is a toss of a weighted coin. The policy has a true success rate that nobody can see, and 50
            tosses give a count near it, seldom on it. A confidence interval turns the count back into a statement
            about the true rate: it is the range of true success rates that
            would plausibly give this count. The Wilson interval is one recipe for that range, and at the 95% level
            the recipe catches the true rate about nineteen times in twenty.
          </Box>
          <ul style={LIST}>
            <li>Checkpoint A, 40 of 50: 67.0% to 88.8%.</li>
            <li>Checkpoint B, 45 of 50: 78.6% to 95.7%.</li>
          </ul>
          <Figure
            cites="F06-97"
            caption={
              <>
                Each bar is the range of true success rates that would plausibly give that count; the circle is the
                observed rate. The shaded band, 78.6% to 88.8%, lies inside both ranges. Our arithmetic.
              </>
            }
          >
            <IntervalChart />
          </Figure>
          <Box variant="p">
            The two ranges share everything from 78.6% to 88.8%. If both checkpoints had a true rate of{' '}
            <Toy>85</Toy>% (an illustration), either count would be an ordinary result. Fisher&apos;s exact test asks
            the question directly: if the two were equally good, how often would 50 trials each produce a gap at
            least this large? The answer is p = 0.26, about one time in four. These trials cannot tell A from B.
            A gap of 20 points is another matter: 45 of 50 against 35 of 50 gives p = 0.023. To tell a true 80% from
            a true 90%, with a test that catches the difference four times in five (80% power) and raises a false
            alarm at most one time in twenty (the 5% level), takes about 199 trials per policy.{' '}
            <Cite id="F06-97">our arithmetic, with the formulas of LeRobot eval_stats.py</Cite>
          </Box>
          <ExpandableSection headerText="Redo the interval for 40 of 50 by hand">
            <SpaceBetween size="s">
              <Box variant="p">
                Write <M>k</M> for the number of successes, here 40, <M>n</M> for the number of trials, here 50,
                and <M>p</M> for the observed rate, here <Derived>0.80</Derived>. <M>z</M> is the width of the net:{' '}
                <Derived>1.96</Derived> for a 95% interval. The Wilson score interval is a centre plus or minus a
                half-width.
              </Box>
              <Formula
                name="Success rate and its Wilson score interval"
                tex={String.raw`\begin{aligned} p &= \frac{k}{n} \\[4pt] \text{centre} &= \frac{p + \dfrac{z^2}{2n}}{1 + \dfrac{z^2}{n}} \\[4pt] \text{half-width} &= \frac{z \sqrt{\dfrac{p(1-p)}{n} + \dfrac{z^2}{4n^2}}}{1 + \dfrac{z^2}{n}} \end{aligned}`}
                source={<Cite id="F11-203">LeRobot v0.7.0, eval_stats.py, wilson_interval()</Cite>}
              />
              <Box variant="p">
                <code>
                  <Derived>centre = (0.80 + 0.0384) / 1.0768 = 0.7786</Derived>
                </code>
                <br />
                <code>
                  <Derived>half-width = 1.96 x sqrt(0.0032 + 0.000384) / 1.0768 = 0.1090</Derived>
                </code>
                <br />
                <code>
                  <Derived>0.7786 - 0.1090 = 0.6696 and 0.7786 + 0.1090 = 0.8876</Derived>
                </code>
              </Box>
              <Box variant="p">
                That is 67.0% to 88.8%. <Cite id="F06-97">our arithmetic</Cite> The centre is the observed rate pulled slightly toward one half. The{' '}
                <M>{String.raw`p(1-p)/n`}</M> term is the spread of a coin-toss count, and it carries the lesson:
                the half-width shrinks with the square root of <M>n</M>, so halving it takes four times the
                trials. LeRobot&apos;s code prefers this interval
                because it &quot;keeps its nominal coverage at small <code>n_trials</code> and at rates near 0% or
                100%, which is where robot evaluations live&quot;.{' '}
                <Cite id="F06-95">LeRobot v0.7.0, eval_stats.py docstrings</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            Published work uses far fewer trials than that. The MuJoCo Playground paper reports 12 trials for one task, PolaRiS
            20 real rollouts per policy per environment, and ABC 50 trials per task. A 2025 statistics paper puts the
            practical limit at &quot;a small feasible sample size (e.g., 10 or 50) due to significant human effort
            and limited inference throughput of policies&quot;.{' '}
            <Cite id="F06-96">STEP, Playground, PolaRiS and ABC papers</Cite>
          </Box>
          <Box variant="p">
            Two cautions. The interval covers only the luck of which trials were drawn; in the words of
            LeRobot&apos;s code it does not cover &quot;variation between training runs (seeds)&quot;.{' '}
            <Cite id="F06-95">LeRobot v0.7.0, eval_stats.py docstrings</Cite> And the bench itself moves. The robot
            maker 1X wrote in 2024 that &quot;even the same model weights can experience a rapid degradation in
            performance in a matter of days&quot; as the surroundings change.{' '}
            <Cite id="F06-91">1X, world model post of 2024-09-17</Cite> Compare two checkpoints in the same session,
            on the same table, under the same light.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Pick the rung that fits the decision in front of you, and know which part of the machine each one loads">
            The ladder
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Figure
            cites="F06-81 F06-83 F06-89 F06-90"
            caption={
              <>
                Each row is one way of scoring a policy, placed by the correlation with real-robot results that
                its authors report. The dashed line at 1 is the real arm. The figures come from different papers,
                policies and tasks, so compare where the rows sit and not their decimals. The picture of twelve
                trials is a set of MuJoCo 4.0.1 captures made for this dive with scripted motion and no learned
                policy; the same capture appears at full size under rung one.
              </>
            }
          >
            <EvalLadder />
          </Figure>
          <Box variant="p">
            The ground is where the section began: by the SIMPLER authors&apos; 2024 figures, ranking policies by
            open-loop error gave <M>r</M> = 0.308 with real success, against 0.924 once the loop was closed in
            a matched simulator. <Cite id="F06-81">SIMPLER paper, Table I</Cite> Each rung above the ground loads a
            different part of the machine.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Rung one</strong> is physics on CPU cores or a GPU, rendering for the policy&apos;s camera, and
              the policy itself on a GPU. NVIDIA publishes scaling figures for Isaac Lab-Arena measured
              with no cameras and no policy in the loop: on one RTX 5880 Ada, 5.41 environment-steps per second with
              1 environment and 2,390 with 1,024, so batching is what makes it usable. Eight independent runs took
              1,255.2 s on one L40 GPU and 157.8 s on eight, &quot;a 7.95x speedup&quot;: evaluation is many
              separate runs, so it spreads across GPUs.{' '}
              <Cite id="F06-93">Isaac Lab-Arena docs, performance and scaling</Cite>
            </li>
            <li>
              <strong>Rung two</strong> is video generation on a GPU, with no physics engine. The RoboWorld authors
              report &quot;only 100 H100 GPU hours&quot; for their whole benchmark of 8 policies. Our arithmetic from
              their figures: 100 / 8 = 12.5 GPU-hours per policy, and 100 x 3,600 / 4,186 = 86 GPU-seconds for each
              30-second rollout. <Cite id="F06-89">RoboWorld paper, section 5</Cite>
            </li>
            <li>
              <strong>Rung three</strong> loads people. Someone resets the scene and records the outcome, which is
              why 10 to 50 trials is the stated feasible range.{' '}
              <Cite id="F06-96">STEP paper, abstract</Cite>
            </li>
          </ul>
          
          <ul style={LIST}>
            <li>
              <strong>While training, use rung one.</strong> Score every saved checkpoint in closed loop in
              simulation, over a sweep of variations, and use the result to discard. Keep the validation loss as a
              check that training is healthy.
            </li>
            <li>
              <strong>With no simulated scene for the task, try rung two.</strong> It fits when a video world model exists that was trained on robots and scenes like yours. Hold its
              ranking as provisional and confirm the top of it on the arm.
            </li>
            <li>
              <strong>Before a policy goes into use, climb to rung three.</strong> Take the two or three survivors to
              the bench and fix the number of trials before the first one. With 50 trials each you can see a gap of
              20 points. A gap of 10 points needs about 199 trials per policy, so either budget for that or report
              the two as tied. <Cite id="F06-97">our arithmetic, with the formulas of LeRobot eval_stats.py</Cite>
            </li>
          </ul>
          
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
