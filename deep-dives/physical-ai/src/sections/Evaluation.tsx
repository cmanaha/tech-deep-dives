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
import { ARM, SIM_TASK, TASK_STORY } from '../lib/task';
import { EvalLadder } from '../components/figures/EvalLadder';
import { EvalLoops } from '../components/figures/EvalLoops';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const CPU_INK = '#1f5fa8';
const NEUTRAL_INK = '#5f6b7a';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 560, margin: '0 auto' };
const LABEL = { fontFamily: 'sans-serif', fontSize: 13, fill: INK } as const;
const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };

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
        <title id="evaluation-intervals-title">The 95% Wilson intervals for 40 of 50 and for 45 of 50 successes overlap</title>
        <desc>
          The chart shows two horizontal intervals on an axis of true success rate in percent. The interval for
          checkpoint A, with 40 successes in 50 trials, runs from 67.0 to 88.8 percent. The interval for checkpoint B,
          with 45 successes in 50 trials, runs from 78.6 to 95.7 percent. The two intervals overlap from 78.6 to 88.8
          percent.
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
            description="To decide which checkpoint of a policy to keep, you let each one control the arm and count how many attempts succeed. You then put a confidence interval on each count, test whether two counts really differ, and work out how many trials you need before you run the first one."
          >
            16. Evaluation: Measuring Success Rates and How Many Trials You Need
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The model that controls the arm is called a policy. A training run saves many copies of the policy&apos;s
            weights along the way, and each copy is called a checkpoint. The first decision in evaluation is which
            checkpoint to keep. The validation loss is the training objective computed on demonstrations that were
            held out of training, and it cannot make that decision for you. The authors of ABC, a 2026 study of
            behaviour cloning, report that their validation loss went down and then up again while their
            policy&apos;s performance kept improving. <Cite id="F06-84">ABC paper, section 4</Cite> To rank
            checkpoints, you need a success rate instead. To measure it, you let each checkpoint control the arm and
            count the attempts that end with the task done.
          </Box>
          <Box variant="p">
            A success count from a few dozen attempts is usually too noisy to separate two good policies. Suppose
            one checkpoint succeeds 40 times in 50 attempts and another 45 times in 50. That reads as 80% against
            90%, but each count is only an estimate of the policy&apos;s true success rate. The 95% confidence
            interval of a count is the range of true rates that could plausibly have produced it. For these two
            counts, the intervals run from 67.0% to 88.8% and from 78.6% to 95.7%, so they overlap. The overlap is a
            sign that the gap could be due to chance, but it is not a test. To decide whether the gap is real, you
            use a statistical test built for comparing two counts. For these two counts, the test finds that two
            equally good policies would look at least this different about one time in four. <Cite id="F06-97">computed with the formulas of LeRobot eval_stats.py</Cite>
          </Box>
          <Box variant="p">
            To tell a true 80% from a true 90% reliably, you need about 199 trials per policy. Reliably means here
            that the comparison sees a real gap four times in five and raises a false alarm only one time in twenty.{' '}
            <Cite id="F06-97">computed with the formulas of LeRobot eval_stats.py</Cite> Robot evaluations
            typically run only 10 to 50 trials per task. <Cite id="F06-94">LeRobot v0.7.0, eval_stats.py</Cite>
          </Box>
          <Box variant="p">
            Because 199 trials per policy is far more than a person usually runs on a real arm, you move evaluation
            to a simulated arm. <Cite id="F06-97">computed with the formulas of LeRobot eval_stats.py</Cite> In
            simulation, you can run hundreds of episodes for each checkpoint. An episode is
            one attempt at the task, and no episode needs data from another. So evaluation in simulation belongs to
            the workload type Independent tasks (section 1, Fifteen Computing Jobs Behind One Robot Arm). You can
            spread the episodes over as many GPUs as your budget allows. The number of episodes that fit on each GPU
            depends mainly on the simulated camera and the policy, and less on the physics.{' '}
            <Cite id="F06-48">Isaac Lab release benchmark, camera rows</Cite>{' '}
            <Cite id="F04-69">piRL paper, appendix J</Cite> Simulation has one limit: more simulated episodes narrow
            the interval around the simulator&apos;s success rate, but they do not reduce the gap between the
            simulator and the real arm.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A checkpoint choice can go wrong in two ways. The validation loss is computed without the policy ever moving the arm, and a single trial on the arm cannot measure a success rate."
          >
            Two checkpoints with the same validation loss and different results on the arm
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The {ARM} has to {TASK_STORY}. A training run saved two checkpoints an hour apart, and their validation
            losses agree to the third decimal place. You load the first checkpoint. The arm reaches the block,
            closes its gripper on it, carries it across and lowers it into the cup. Then you load the second
            checkpoint. The arm reaches the block, closes on it and lifts it, but halfway to the cup the block slides
            out of the gripper. The arm finishes the motion and opens its fingers over the cup with nothing in them.
          </Box>
          <Box variant="p">
            The two losses can agree because neither checkpoint moved the arm while its loss was computed. The test
            on the real arm does not tell you much either. The second checkpoint might drop the block once in twenty
            attempts or once in two, and one attempt cannot tell you which. So there are two separate faults: the
            first is in what the loss measures, and the second is in how many attempts you need to measure a rate.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Offline scores compare the policy's actions with a recording, one frame at a time, so they never show what happens when the policy controls the arm. You can still use them to shortlist checkpoints from one training recipe, but not to rank different policies or to predict a success rate."
          >
            Open-loop and closed-loop evaluation
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Two offline numbers score a policy against demonstrations it was not trained on. In both, the policy
            answers each frame of a recording, but its answer does not change what it sees next. This kind of
            scoring is called open-loop.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Validation loss.</strong> For a diffusion policy, the validation loss is the error in
              predicting the added noise (section 4, Learning From Demonstrations).
            </li>
            <li>
              <strong>Validation action error.</strong> To compute it, you run the policy on each held-out frame
              exactly as it runs on the arm. For a diffusion policy, that includes the sampler and its diffusion
              steps (section 4). Then you compare the action that comes out with the action the person took.
            </li>
          </ul>
          <Box variant="p">
            The action error is usually an MSE (mean squared error). It is the average, over the frames of the
            recording, of the squared distance between the two actions. In the formula, <M>T</M> is the number of
            frames, <M>{String.raw`a^{\text{pred}}_t`}</M> is the policy&apos;s action at frame <M>t</M>, and{' '}
            <M>{String.raw`a^{\text{demo}}_t`}</M> is the recorded action. On this arm, each action is a list of
            six joint targets, and the double bars measure the distance between two such lists.
          </Box>
          <Formula
            name="Validation action error: mean squared error against the recording"
            tex={String.raw`\mathrm{MSE} = \frac{1}{T} \sum_{t=1}^{T} \bigl\lVert a^{\text{pred}}_t - a^{\text{demo}}_t \bigr\rVert^2`}
          />
          <Box variant="p">
            The difference inside the bars is how far the policy&apos;s answer is from the person&apos;s at one
            frame. Squaring makes large misses count the most. Dividing by <M>T</M> averages over the recording and
            gives every frame the same weight. So the frame where the fingers close on the block counts no more than
            a frame where the arm moves through empty air. Many codebases also divide by the number of action
            dimensions, six here. That rescales the value but does not change any ranking.
          </Box>
          <Box variant="p">
            No term in the formula looks ahead. Frame <M>t + 1</M> comes from the recording, whatever the policy
            answered at frame <M>t</M>. So the policy never sees the scene that its own mistake would have produced.
            That scene is where the compounding error of section 4 happens: one slightly wrong action puts the arm
            where no demonstration went, and the next action is then worse.
          </Box>
          <Box variant="p">
            A closed-loop score lets the policy drive. The policy&apos;s action moves the arm, the moved arm changes
            the next camera image, and that image is what the policy sees next. A rollout is one complete run from
            the starting pose until the task succeeds, fails or runs out of time. In this section, a trial and an
            episode mean the same thing as a rollout. Each rollout ends in a success or a failure. The success rate
            is the number of successful rollouts divided by the total number of rollouts.
          </Box>
          <Figure
            caption={
              <>
                One policy makes the same list of small errors, one per step, and the figure scores it in two ways. In
                open loop, each step starts on the recorded path, so no error adds to the one before it. In closed
                loop, each step starts where the previous step ended, so the same errors carry the joint away from the
                recorded path. The errors are illustrative, not measured.
              </>
            }
          >
            <EvalLoops />
          </Figure>
          <Box variant="p">
            To measure how well an offline score predicts real success, researchers use the Pearson correlation{' '}
            <M>r</M>. It is a number between -1 and 1 that says how closely two lists of numbers rise and fall
            together. You score several policies in two ways, on real robots and with the offline score, and then
            correlate the two lists. At 1, the offline score predicts the real result exactly. At 0, it tells you
            nothing.
          </Box>
          <Box variant="p">
            SIMPLER, a 2024 study, did this for a set of policies on three tasks. When the policies were scored by
            validation action MSE, their scores correlated with real-world success at r = 0.308, averaged over the
            tasks. When the same policies were scored in closed loop, in a simulator built to match the real camera
            view, the correlation was 0.924. The authors conclude that &quot;validation MSE is not a good proxy for
            a policy&apos;s real-world performance&quot;. <Cite id="F06-81">SIMPLER paper, section VI and Table I</Cite>
          </Box>
          <Box variant="p">
            Open-loop error does not fully capture three closed-loop effects: compounding errors, contact dynamics
            and recovery ability. <Cite id="F06-85">REAL-I challenge report, discussion of evaluation</Cite> The
            block that slides out of the gripper is a contact effect. To test recovery, a score needs a moment where
            something has gone wrong, such as a slip. The recordings contain no such moment, because the person who
            made them did not slip (section 4).
          </Box>
          <Box variant="p">
            When you compare checkpoints trained with the same recipe, the action error is still useful. The ABC
            authors compared variants of their own policy. They found that a lower validation action error went with
            better real-world performance, and that this correlation was statistically significant. The validation
            loss, in their words, &quot;is not significantly correlated&quot;. They also name two limits. The action
            error &quot;is only meaningful when the number of diffusion steps is held fixed&quot;, because the
            sampler is part of what it scores. And offline metrics &quot;cannot reliably predict task success rates
            or reveal failure modes&quot;. <Cite id="F06-84">ABC paper, section 4</Cite>
          </Box>
          <Box variant="p">
            So you can use the action error, at a fixed number of diffusion steps, to shortlist checkpoints from one
            recipe and to detect overfitting. REAL-I is a robot challenge held at ICRA 2026 (the International
            Conference on Robotics and Automation), and one of its teams used the action error this way.{' '}
            <Cite id="F06-85">REAL-I challenge report, discussion of evaluation</Cite> To rank different policies,
            or to predict a success rate, you need a closed-loop score.
          </Box>
          <ExpandableSection headerText="An AWS customer example: why offline scores look better than closed-loop results">
            <Box variant="p">
              Telexistence ran an experiment on AWS with DreamZero, a model described in section 6, World Models.
              In that experiment, the offline setup &quot;feeds the model ground-truth video frames&quot;. As a
              result, the model&apos;s &quot;generated actions deviate only slightly from ground truth by
              design&quot;, and &quot;offline rollouts understate the model&apos;s true closed-loop influence&quot;.
              So the offline score can mislead in either direction: a model with a low average prediction error
              &quot;can still fail in the loop, while a model with higher MSE can succeed&quot;.{' '}
              <Cite id="F06-86">AWS Physical AI blog, Telexistence and DreamZero, post of 2026-09-09</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You can put a 95% confidence interval on a success count by hand and test the gap between two counts. The same arithmetic shows why 50 trials per policy cannot tell a policy at 80% from one at 90%."
          >
            Confidence intervals and testing the gap between two success counts
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Checkpoint A succeeds in 40 of 50 trials and checkpoint B in 45 of 50, which is 80% against 90%. You
            can think of each trial as the toss of a weighted coin. The policy has a true success rate that nobody
            can see directly. The rate you observe over 50 tosses lands near that true rate, but seldom exactly on
            it. Suppose, as an illustration, that both checkpoints truly succeed <Toy>85</Toy>% of the time. Then
            counts of 40 and 45 would both be ordinary results. We computed the intervals and p-values below with
            the formulas in LeRobot&apos;s evaluation code.{' '}
            <Cite id="F06-97">computed with the formulas of LeRobot eval_stats.py</Cite>
          </Box>
          <Box variant="p">
            A confidence interval works backwards, from the observed count to the range of true rates that could
            plausibly have produced it. The Wilson interval is one method for computing that range. At the 95% level, the range it gives contains the true rate about nineteen times in twenty. For
            checkpoint A, the 95% Wilson interval runs from 67.0% to 88.8%. For checkpoint B, it runs from 78.6% to
            95.7%. <Cite id="F06-97">computed with the formulas of LeRobot eval_stats.py</Cite>
          </Box>
          <Figure
            cites="F06-97"
            caption={
              <>
                Each bar is the range of true success rates that could plausibly produce that count, and the circle
                marks the observed rate. The shaded band, from 78.6% to 88.8%, lies inside both ranges.
              </>
            }
          >
            <IntervalChart />
          </Figure>
          <Box variant="p">
            The two ranges overlap from 78.6% to 88.8%. To put a probability on the gap, you can use Fisher&apos;s
            exact test, which LeRobot&apos;s code recommends for comparing two policies.{' '}
            <Cite id="F06-95">LeRobot v0.7.0, eval_stats.py docstrings</Cite> The test first pools the{' '}
            <Derived>50 + 50 = 100</Derived> trials, which gives <Derived>40 + 45 = 85</Derived> successes and{' '}
            <Derived>15</Derived> failures. If A and B were equally good, chance alone would decide which policy each
            failure fell on. The test counts how often luck alone would split the failures at least as unevenly as the
            observed split, which is 10 failures for A and 5 for B.{' '}
            <Cite id="F06-97">computed with the formulas of LeRobot eval_stats.py</Cite>
          </Box>
          <Box variant="p">
            The result of that count is called the p-value, and here it is 0.26. In other words, two equally good
            policies would look at least this different about one time in four. So these 50 trials per policy cannot
            tell A from B. A 20-point gap near the top of the scale is large enough to detect with 50 trials each:
            45 of 50 against 35 of 50 gives p = 0.023. Yet the interval for <Derived>35 of 50 runs from 56.2% to 80.9%</Derived>, and it still overlaps
            the interval for B. So two intervals can overlap even when the gap between the policies is real.{' '}
            <Cite id="F06-97">computed with the formulas of LeRobot eval_stats.py</Cite>
          </Box>
          <Box variant="p">
            The Wilson interval is a centre plus or minus a half-width. Each of the two parts includes a correction
            that matters most when the count is small. In the formula, <M>k</M> is the number of successes, <M>n</M> is the number of trials and{' '}
            <M>p</M> is the observed rate. The value <M>z</M> sets the confidence level. It is the number of
            standard deviations of a bell curve that cover the central 95%, which is <Derived>1.96</Derived>.
          </Box>
          <Formula
            name="Success rate and its Wilson score interval"
            tex={String.raw`\begin{aligned} p &= \frac{k}{n} \\[4pt] \text{centre} &= \frac{p + \dfrac{z^2}{2n}}{1 + \dfrac{z^2}{n}} \\[4pt] \text{half-width} &= \frac{z \sqrt{\dfrac{p(1-p)}{n} + \dfrac{z^2}{4n^2}}}{1 + \dfrac{z^2}{n}} \end{aligned}`}
            source={<Cite id="F11-203">LeRobot v0.7.0, eval_stats.py, wilson_interval()</Cite>}
          />
          <Box variant="p">
            The centre is the observed rate pulled toward one half, and the pull is stronger when <M>n</M> is
            small. For 40 of 50, the centre is <Derived>0.7786</Derived>, which is below the observed{' '}
            <Derived>0.80</Derived>. Under the square root, <M>{String.raw`p(1-p)/n`}</M> is the variance of the
            observed rate. Its square root is the standard error, which is how far the observed rate typically
            lands from the true one. This term also explains why a narrow interval is expensive: because <M>n</M>{' '}
            sits under a square root, halving the width of the interval takes four times the trials. The <M>{String.raw`z^2/4n^2`}</M> term
            keeps the width above zero when every trial succeeds or every trial fails.{' '}
            <Cite id="F06-97">computed with the formulas of LeRobot eval_stats.py</Cite>
          </Box>
          <Box variant="p">
            The textbook interval for a success rate is <M>{String.raw`p \pm z\sqrt{p(1-p)/n}`}</M>, and it is
            called the Wald interval. LeRobot&apos;s code uses the Wilson interval instead, because of the two
            corrections above: the pull toward one half and the term that keeps the width above zero. In the words of its
            docstring, the Wilson interval &quot;stays inside [0, 1] and keeps its nominal coverage at small
            n_trials and at rates near 0% or 100%, which is where robot evaluations live&quot;. The documented
            example, <code>wilson_interval(9, 10)</code>, returns 0.596 to 0.982.{' '}
            <Cite id="F06-95">LeRobot v0.7.0, eval_stats.py docstrings</Cite> The Wald formula on the same count
            gives <Derived>0.9 plus or minus 1.96 x sqrt(0.9 x 0.1 / 10) = 0.714 to 1.086</Derived>. Its upper end
            is above 100%, and its lower end is well above the Wilson value of 0.596.
          </Box>
          <Box variant="p">
            At a perfect score, the Wald interval shrinks to zero width. The MuJoCo Playground paper reports 12
            successes in 12 real trials. <Cite id="F06-96">STEP, Playground, PolaRiS and ABC papers</Cite> For that
            count, Wald gives <Derived>1 plus or minus 1.96 x sqrt(1 x 0 / 12) = 1 plus or minus 0</Derived>, as if
            12 trials had proved that the policy never fails. With <M>p = 1</M>, the lower end of the Wilson
            interval reduces to <M>{String.raw`1 / (1 + z^2/n)`}</M>, which is{' '}
            <Derived>1 / (1 + 3.84 / 12) = 1 / 1.32 = 0.76</Derived>. So a policy that truly succeeds about three
            times in four is still inside the interval after twelve successes in a row.
          </Box>
          <ExpandableSection headerText="Working out the Wilson interval for 40 of 50 by hand">
            <SpaceBetween size="s">
              <Box variant="p">
                Here <M>k</M> = 40, <M>n</M> = 50, <M>p</M> = <Derived>0.80</Derived> and <M>z</M> ={' '}
                <Derived>1.96</Derived>. So <M>{String.raw`z^2/2n`}</M> = <Derived>0.0384</Derived>,{' '}
                <M>{String.raw`1 + z^2/n`}</M> = <Derived>1.0768</Derived>, <M>{String.raw`p(1-p)/n`}</M> ={' '}
                <Derived>0.0032</Derived> and <M>{String.raw`z^2/4n^2`}</M> = <Derived>0.000384</Derived>.
              </Box>
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
                That gives an interval from 67.0% to 88.8%. The Wald formula on the same count gives{' '}
                <Derived>0.80 plus or minus 1.96 x sqrt(0.8 x 0.2 / 50) = 68.9% to 91.1%</Derived>. The Wald
                interval is centred on the observed rate, while the Wilson interval pulls its centre toward one
                half. <Cite id="F06-97">computed with the formulas of LeRobot eval_stats.py</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You can work out how many trials a comparison needs before you run the first one. The answer is usually far more than a person can run on a real arm, which is why you move evaluation into simulation."
          >
            How many trials a comparison needs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Because <M>n</M> sits under a square root, a narrower interval costs many more trials. With the same
            formula,{' '}
            <Derived>80 successes in 100 give 71.1% to 86.7%</Derived>, and{' '}
            <Derived>160 in 200 give 73.9% to 85.0%</Derived>. Compared with the 50-trial case, four times the
            trials cut the width from <Derived>88.8 - 67.0 = 21.8</Derived> points to{' '}
            <Derived>85.0 - 73.9 = 11.1</Derived> points, which is half.{' '}
            <Cite id="F06-97">computed with the formulas of LeRobot eval_stats.py</Cite>
          </Box>
          <Box variant="p">
            To plan a comparison between two policies, you first choose two settings:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Power.</strong> This is the chance that the comparison detects a gap that is really there. At
              80% power, the comparison finds the gap four times in five.
            </li>
            <li>
              <strong>Significance level.</strong> This is the false-alarm rate when there is no gap. At the 5%
              level, the comparison reports a gap that does not exist one time in twenty.
            </li>
          </ul>
          <Box variant="p">
            At 80% power and the 5% level, telling a true 80% from a true 90% takes about 199 trials per policy. This
            number comes from the standard normal approximation for comparing two proportions.{' '}
            <Cite id="F06-97">computed with the formulas of LeRobot eval_stats.py</Cite>
          </Box>
          <Box variant="p">
            In the formula, <M>{String.raw`p_1`}</M> and <M>{String.raw`p_2`}</M> are the two true rates you want
            to tell apart, and <M>{String.raw`\bar{p}`}</M> is their mean. The value{' '}
            <M>{String.raw`z_{\text{level}}`}</M> = <Derived>1.96</Derived> corresponds to the 5% level, and{' '}
            <M>{String.raw`z_{\text{power}}`}</M> = <Derived>0.84</Derived> corresponds to 80% power. <M>n</M> is
            the number of trials each policy needs. For 80% against 90%, the mean rate is <Derived>0.85</Derived>,
            and the calculation runs as follows.
          </Box>
          <Formula
            name="Trials per policy to tell two success rates apart (normal approximation)"
            tex={String.raw`n = \frac{\Bigl( z_{\text{level}} \sqrt{2\,\bar{p}(1-\bar{p})} + z_{\text{power}} \sqrt{p_1(1-p_1) + p_2(1-p_2)} \Bigr)^2}{(p_1 - p_2)^2}`}
            source={<Cite id="F06-97">the standard two-proportion approximation</Cite>}
          />
          <Box variant="p">
            <code>
              <Derived>z_level x sqrt(2 x 0.85 x 0.15) = 1.96 x 0.505 = 0.990</Derived>
            </code>
            <br />
            <code>
              <Derived>z_power x sqrt(0.80 x 0.20 + 0.90 x 0.10) = 0.84 x 0.5 = 0.420</Derived>
            </code>
            <br />
            <code>
              <Derived>n = (0.990 + 0.420)^2 / 0.10^2 = 1.988 / 0.01 = 198.8, rounded up to 199</Derived>
            </code>
          </Box>
          <Box variant="p">
            The denominator has the largest effect. The gap enters the formula squared, so at similar rates, half
            the gap takes about four times the trials. The <M>{String.raw`p(1-p)`}</M> terms are largest at one
            half, so the same 10-point gap costs more near 50% than near 90%. For example,{' '}
            <Derived>45% against 55% needs about 391 trials per policy</Derived>, nearly twice the 199. The two
            settings sit in the numerator. If you ask for more power or a lower false-alarm rate, both z values grow,
            and <M>n</M> grows with them.{' '}
            <Cite id="F06-97">the standard two-proportion approximation</Cite>
          </Box>
          <Box variant="p">
            Published robot studies run far fewer trials than that. The MuJoCo Playground paper reports 12 trials for
            one task. PolaRiS, a method that scores policies in simulated copies of real scenes, reports 20 real
            rollouts per policy in each environment. ABC reports 50 trials per task. The authors of STEP, a 2025
            paper on comparing robot policies, write that comparison is &quot;fundamentally constrained by a small
            feasible sample size (e.g., 10 or 50) due to significant human effort and limited inference throughput
            of policies&quot;. <Cite id="F06-96">STEP, Playground, PolaRiS and ABC papers</Cite>
          </Box>
          <Box variant="p">
            To see what this means for a real decision, suppose, as an illustration, that you choose among{' '}
            <Toy>5</Toy> checkpoints of one training run. At 199 trials each, that is at least{' '}
            <Derived>5 x 199 = 995</Derived> attempts at the task. The total is at least that high because picking
            the best of five checkpoints takes several comparisons, while the 199 trials cover only one. STEP
            considers 10 or 50 trials per comparison feasible. The difference between those numbers is why you run
            evaluation as hundreds of independent episodes in simulation.{' '}
            <Cite id="F06-97">computed with the formulas of LeRobot eval_stats.py</Cite>{' '}
            <Cite id="F06-96">STEP paper, abstract</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="In simulation, you can score every checkpoint without a real arm. Before you trust a simulated score, check for the two ways it can mislead: a gap between the simulator and the real arm, and a benchmark on which almost every policy scores high."
          >
            Evaluating in simulation, and two ways a simulated score can mislead
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            In simulation, the physics simulator of section 12, Physics Simulation, takes the place of the real arm.
            In LeRobot v0.7.0, the evaluation tool is <code>lerobot-eval</code>. It runs a checkpoint in closed
            loop in a batch of simulated environments. The environments run either locally or on a separate
            environment server that is packaged in its own Docker image. The tool reports the success rate with its 95% Wilson interval in the{' '}
            <code>pc_success_ci95</code> field.{' '}
            <Cite id="F06-94">LeRobot v0.7.0, simulation docs and eval_stats.py</Cite>
          </Box>
          <Box variant="p">
            An AWS sample shows what a larger simulated budget gives you. LIBERO is a fixed set of simulated
            manipulation tasks, and LIBERO-Goal is one part of it. The sample scores a policy on 500 simulated
            episodes of LIBERO-Goal, before and after a round of reinforcement learning. Section 8, Reinforcement
            Learning for Robots, follows that training run. Before the training, the policy succeeded in 243 of 500
            episodes, which is 48.6%, with a 95% interval of 44.2-53.0%. After the training, it succeeded in 425
            of 500, which is 85.0%, with a 95% interval of 81.6-87.9%. Both intervals are less than 9 points wide,
            compared with <Derived>21.8</Derived> points at 50 trials. And 500 episodes per policy is more than
            the <Derived>391</Derived> trials that a 10-point gap needs at its most expensive, around 50%.{' '}
            <Cite id="F04-70">AWS sample, docs/results.md</Cite>{' '}
            <Cite id="F06-97">computed with the formulas of LeRobot eval_stats.py</Cite>
          </Box>
          <Box variant="p">
            LeRobot does not ship a simulator of the {ARM}. Its simulation layer wraps benchmarks from other
            projects, including LIBERO and LIBERO-Plus. A <code>sim</code> robot type lets a simulated environment
            take the place of the real arm. <Cite id="F06-38">LeRobot v0.7.0, simulation integrations</Cite> For
            this arm, the <code>{SIM_TASK}</code> task in MuJoCo Playground (section 14, Sim-to-Real and
            Real-to-Sim) runs the same task code in simulation and on the real arm. The task covers picking up the
            cube but leaves out the cup. It has no published success rate, so the count you measure is the only one
            there is. <Cite id="F06-26">MuJoCo Playground, SO-101 deploy README</Cite>
          </Box>
          <Box variant="p">
            A simulated score ranks policies well when the simulated scene looks and behaves like the real one.
            SIMPLER&apos;s correlation of 0.924 came from a simulator matched to the real camera view.{' '}
            <Cite id="F06-81">SIMPLER paper, Table I</Cite> PolaRiS rebuilds a real scene in simulation from a few
            minutes of video (section 14). Before scoring, it fine-tunes each policy for 1k steps on about 350
            simulated demonstrations from 15 other scanned scenes. Its authors then report an average r = 0.9
            against real trials across six paired environments, and 0.81 in the worst one. Because of that
            fine-tuning step, PolaRiS scores each policy after it has been adapted to the look of the simulator,
            and not the checkpoint as it left training.{' '}
            <Cite id="F06-83">PolaRiS paper, introduction and sections 5.1 and 5.2</Cite>{' '}
            <Cite id="F06-73">PolaRiS paper, section 4.1</Cite>{' '}
            <Cite id="F06-74">PolaRiS paper, sections 4.2 and 5.1</Cite>
          </Box>
          <Box variant="p">
            No simulated count tells you the success rate on your real arm. The interval that{' '}
            <code>lerobot-eval</code> prints covers, in the words of LeRobot&apos;s code, &quot;evaluation sampling
            noise only, i.e. which episodes happened to be drawn&quot;.{' '}
            <Cite id="F06-95">LeRobot v0.7.0, eval_stats.py docstrings</Cite> More episodes narrow that interval
            around the simulator&apos;s success rate. They leave the sim-to-real gap of section 14 exactly as wide
            as it was.
          </Box>
          <Box variant="p">
            The second way a simulated score can mislead is a saturated benchmark. A benchmark is a fixed set of
            simulated tasks that everyone scores on, such as LIBERO. A benchmark is saturated when nearly every
            policy scores near the top. The PolaRiS authors found &quot;nearly all tested policies scoring between
            90 and 95% success in Libero, but spanning the full spectrum from high-performing to low-performing
            policies in the real world&quot;. <Cite id="F06-82">PolaRiS paper, section 5.2</Cite> When every policy
            gets the same high score, the score cannot rank them.
          </Box>
          <Box variant="p">
            To fix this, you vary the scene until the scores spread out again. LIBERO-Plus perturbs seven aspects
            of each task, including the camera viewpoint, the robot&apos;s starting pose and the lighting. Its
            authors report performance &quot;dropping from 95% to below 30% under modest perturbations&quot;.
            LIBERO-PRO reports models that score above 90% on standard LIBERO but whose &quot;performance collapses
            to 0.0%&quot; in its generalised setting.{' '}
            <Cite id="F06-87">LIBERO-Plus and LIBERO-PRO papers, abstracts</Cite>
          </Box>
          <Box variant="p">
            Two evaluation tools let you choose the perturbed version of a benchmark as a setting. LeRobot v0.7.0
            ships a <code>libero_plus</code> integration next to <code>libero</code>.{' '}
            <Cite id="F06-38">LeRobot v0.7.0, simulation integrations</Cite> Isaac Lab-Arena is NVIDIA&apos;s
            evaluation tool for its Isaac Lab simulator. Its v0.3 alpha added a way to &quot;turn one environment
            into a controlled perturbation sweep&quot; over lighting, backgrounds, camera parameters and object
            mass. To use the sweep, you score each checkpoint across all of its variations and keep only the
            checkpoints whose success rate holds. <Cite id="F06-92">Isaac Lab-Arena, v0.3 announcement</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="When no simulated scene exists for your task, you can use a world model to put candidate policies in order, at about 86 GPU-seconds per imagined rollout. A high correlation measured over only a few policies tells you that the order is roughly right, but not that the tool can separate two close checkpoints."
          >
            Evaluating with a world model instead of a simulator
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A world model predicts what the cameras will show after an action (section 6, World Models). That is
            enough to score a policy without building a simulated scene. You start from the first camera frame of a
            real episode. The policy chooses its actions, and the world model generates the frames that those
            actions would produce. The generated frames go back to the policy as its next input, once per step. A
            vision-language model is a model that takes both images and text as input. When the rollout ends, a
            vision-language model watches the generated video and judges whether the task was done. Unlike a physics
            simulator, this method does not need anyone to set physical values such as friction.
          </Box>
          <Box variant="p">
            To check a world-model evaluator, you need a ranking from real robots to compare it with. RoboArena is
            one such ranking. Human evaluators at seven academic institutions run pairs of policies on the DROID
            robot platform, on tasks and scenes they choose themselves, without knowing which policy is which. Their
            preferences are combined into a ranking. The paper reports &quot;more than 600 pairwise real-robot
            evaluation episodes across seven generalist policies&quot;, which means hundreds of real trials spread
            over seven labs. Every cheaper evaluator is checked against a real-robot ranking like this one, so
            someone has to build that expensive reference first.{' '}
            <Cite id="F06-88">RoboArena paper, abstract</Cite>
          </Box>
          <Box variant="p">
            RoboWorld applies this method, starting from the first frame of each RoboArena episode. A video model
            imagines 30 seconds of each rollout, and GPT-4o acts as the judge. Across 8 policies and 4,186 generated
            rollouts, the RoboWorld authors report a Pearson r of 0.989 against RoboArena&apos;s real-robot
            leaderboard. They also report a Spearman correlation of 0.970. The Spearman correlation is the same
            calculation applied to rank positions, so it measures whether two lists put the policies in the same
            order. The authors add that &quot;the correlation improves as the number of trials increases&quot;.{' '}
            <Cite id="F06-89">RoboWorld paper, abstract and section 5</Cite>
          </Box>
          <Box variant="p">
            Two more evaluators of this kind report their own correlations. WorldGym reports r = 0.78, and its
            world-model and real success rates differ &quot;by an average of only 3.3%&quot;. HF-WM reports r =
            0.983 over six RoboArena policies, with GPT-5 as the judge. Each of these figures comes from the authors
            of the tool it describes. The PolaRiS authors also tried Ctrl-World, an open-source video model from
            another team. They found that it &quot;often produces heavy hallucinations during object
            interaction&quot;, and it ranked the policies wrongly.{' '}
            <Cite id="F06-90">WorldGym, HF-WM and PolaRiS papers</Cite> A block that slides out of a gripper is an
            object interaction, and that is exactly the moment when the second checkpoint failed.
          </Box>
          <Box variant="p">
            RoboWorld&apos;s correlation is computed over 8 policies, and HF-WM&apos;s over six. A high correlation
            over so few policies shows that the tool puts those policies in roughly the same order as real robots
            do. It does not show that the tool can separate two good checkpoints that are a few points apart.{' '}
            <Cite id="F06-89">RoboWorld paper, section 5</Cite>{' '}
            <Cite id="F06-90">WorldGym, HF-WM and PolaRiS papers</Cite>
          </Box>
          <Box variant="p">
            The main cost of this method is video generation. It runs on a GPU&apos;s tensor cores, with no physics
            engine and no ray tracing. RoboWorld&apos;s authors report &quot;only 100 H100 GPU hours&quot; for their
            whole benchmark of 8 policies. That works out to <Derived>100 / 8 = 12.5</Derived> GPU-hours per
            policy, and <Derived>100 x 3,600 / 4,186 = 86</Derived> GPU-seconds to imagine each 30-second rollout.{' '}
            <Cite id="F06-89">RoboWorld paper, section 5</Cite>
          </Box>
          <Figure
            cites="F06-81 F06-83 F06-89 F06-90"
            caption={
              <>
                Each way of scoring a policy is placed at the Pearson correlation with real-robot success that its own
                paper reports. Open-loop action error is at the bottom, a simulator is on rung one, a world model is
                on rung two, and the real arm, which is the reference, is on rung three at 1. The two ends are clear:
                open-loop scoring is far below the others, and the real arm is at the top. The two middle rungs
                overlap on the axis, from 0.81 to 0.924 for simulation and from 0.78 to 0.989 for world models. The
                ladder puts them in this vertical order, but the correlations alone do not place one of these two
                rungs above the other.
              </>
            }
          >
            <EvalLadder />
          </Figure>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Trials on the real arm are the reference for every other score, and each one takes a person's time. Plan them with that cost in mind, account for variation between training runs and between sessions, and fix the stopping rule before the first trial."
          >
            Trials on the real arm: cost, drift and stopping rules
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every cheaper score is checked against trials on a real robot, and each real trial takes a
            person&apos;s effort. Someone has to put the block back in place, start the run and watch where the
            block ends up. That effort is the first reason the STEP authors give for feasible sample sizes of only
            10 or 50. <Cite id="F06-96">STEP paper, abstract</Cite> Trials on the real arm also bring two sources of
            variation that no number of trials removes.
          </Box>
          <Box variant="p">
            The first source is the training run itself. LeRobot&apos;s code warns that its intervals &quot;do not
            cover variation between training runs (seeds) of the same recipe, which has to be measured by training
            more than once&quot;. <Cite id="F06-95">LeRobot v0.7.0, eval_stats.py docstrings</Cite> If you train each
            of two recipes only once, you have compared the recipes only once, however many trials each checkpoint
            got.
          </Box>
          <Box variant="p">
            The second source is the robot&apos;s surroundings, which change over time. The robot maker 1X wrote in
            2024 that &quot;even the same model weights
            can experience a rapid degradation in performance in a matter of days&quot;. In 1X&apos;s example, a
            shirt-folding model &quot;degrades in performance over the course of 50 days&quot; as its surroundings
            change. <Cite id="F06-91">1X, world model post of 2024-09-17</Cite> So last month&apos;s count is not a
            valid baseline. Compare two checkpoints in the same session, on the same table and under the same light.
          </Box>
          <Box variant="p">
            Fix the rules of the evaluation before the first trial. If you keep adding trials until a gap looks
            convincing and then stop, you raise the false-alarm rate. Every extra look gives luck another chance to
            push the result past the threshold. STEP replaces the fixed number of trials with a sequential test.
            The test is checked after each pair of trials, and it stops as soon as the evidence is sufficient. An
            easy comparison ends early and a hard one runs longer, &quot;without sacrificing probabilistic
            correctness&quot;. Earlier guidance from Toyota Research Institute (2024) points to papers that report a
            success rate &quot;with little to no information regarding the number of runs, the initial conditions,
            and the success criteria&quot;. To make your own success rate checkable, write down all three.{' '}
            <Cite id="F06-98">STEP and Robot Learning as an Empirical Science, abstracts</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You size a simulated evaluation job by its simulated camera and its policy more than by its physics. On AWS, you run it as an AWS Batch array job, and you use a different score for each decision, from discarding checkpoints during training to the final trials before release."
          >
            Sizing the simulated evaluation job and choosing a score for each decision
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every simulated episode has three loads: the physics step, a simulated camera if the policy reads
            images, and a call to the policy. Physics alone is light. In a state-only environment, the policy gets
            the joint and object states directly and no camera images. In Isaac Lab&apos;s own benchmark on one RTX
            PRO 6000 Blackwell, the GPU that AWS offers in G7e instances, 8,192 state-only environments of the
            Cartpole task process about a million environment steps per second. That run uses the Newton physics
            engine, includes the policy updates, and needs 0.93 GB of GPU memory.{' '}
            <Cite id="F06-47">Isaac Lab release benchmark, state-only rows</Cite> Adding one small camera to each
            environment cuts that throughput by a factor of 6.7 and multiplies the memory by 62 (section 13,
            Rendering and Ray Tracing). <Cite id="F06-48">Isaac Lab release benchmark, camera rows</Cite>
          </Box>
          <Box variant="p">
            The policy is the third load, and every simulated step waits for the policy&apos;s forward pass. With a
            small policy, the camera is the bottleneck that limits how many environments fit on one GPU. A
            vision-language-action model is a policy of several billion parameters that reads camera images
            (section 5, Vision-Language-Action Models), and it adds a heavy load of its own. A
            reinforcement-learning run (section 8) that fine-tuned such models stepped 64 to 320 simulated
            environments in parallel on eight H100 GPUs. That is <Derived>64 / 8 = 8 to 320 / 8 = 40</Derived>{' '}
            environments per GPU, against 8,192 in Isaac Lab&apos;s state-only benchmark. That run had the camera and
            the large policy together, on different hardware. So it shows the drop from thousands of environments
            per GPU to tens, but not how much of the cost comes from each of the two.{' '}
            <Cite id="F04-69">piRL paper, appendix J</Cite>{' '}
            <Cite id="F06-47">Isaac Lab release benchmark, state-only rows</Cite>
          </Box>
          <Box variant="p">
            To use one GPU fully, you step many environments as one batch. To use many GPUs, you run independent
            evaluation runs on them. NVIDIA&apos;s published scaling figures for Isaac Lab-Arena, measured with no
            cameras and no policy, show both effects. On one RTX 5880 Ada, one environment stepped 5.41 times per
            second, and 1,024 environments together made 2,390 environment steps per second. This is because one
            step of the whole batch of 1,024 took 428 ms, against 185 ms for a single environment on its own. Eight independent
            runs took 1,255.2 s on one L40 GPU and 157.8 s on eight, which NVIDIA calls &quot;a 7.95x
            speedup&quot;. <Cite id="F06-93">Isaac Lab-Arena docs, performance and scaling</Cite>
          </Box>
          <Box variant="p">
            No episode needs data from another, so on AWS the job fits an AWS Batch array job. You submit one array
            job, and each child job reads its own index to pick a checkpoint and a seed. Section 24, Orchestrating
            Physical AI on AWS, walks through one policy&apos;s evaluation set up this way.{' '}
            <Cite id="F09-5">AWS Batch User Guide, array jobs</Cite> The job also suits Spot Instances, which AWS can
            reclaim after a two-minute warning. The AWS Batch guidance is to split Spot work into parts of 30
            minutes or less. A child job that runs one episode, or a few, stays well inside that limit.{' '}
            <Cite id="F09-11">AWS Batch User Guide, Spot best practices</Cite>{' '}
            <Cite id="F09-12">AWS Batch User Guide, Spot best practices</Cite>
          </Box>
          <Box variant="p">
            Simulated cameras also affect which instance family you need. A simulated camera drawn by an RTX renderer
            needs RT cores, which are the GPU&apos;s ray-tracing units. The GPUs in the P-family training instances
            do not have RT cores (section 13).{' '}
            <Cite id="F06-60">AWS ML blog, Isaac Lab on SageMaker AI, GPU compatibility</Cite> Two AWS customer
            posts show the resulting split between training and simulation:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>RLWRLD</strong> trains on p5e and p5en instances and runs its evaluation in simulation on g6e
              instances. <Cite id="F09-87">AWS Physical AI blog, RLWRLD</Cite>
            </li>
            <li>
              <strong>Telexistence</strong> fine-tuned on a p6-b200 instance and ran simulation on g7e instances.{' '}
              <Cite id="F09-88">AWS Physical AI blog, Telexistence</Cite>
            </li>
          </ul>
          <Box variant="p">Each kind of score fits a different decision:</Box>
          <ul style={LIST}>
            <li>
              <strong>While a policy trains.</strong> Score every saved checkpoint in closed loop in simulation,
              across a sweep of variations, and use the result to discard weak checkpoints. To choose which
              checkpoints to score, you can shortlist them with the validation action error, at a fixed number of
              diffusion steps.
            </li>
            <li>
              <strong>When no simulated scene exists for the task.</strong> A world model trained on robots and
              scenes like yours can put the candidates in order. Based on RoboWorld&apos;s figures, this costs
              about 86 GPU-seconds per imagined rollout. Treat the order as provisional, and do not use it to
              separate two close checkpoints. <Cite id="F06-89">RoboWorld paper, section 5</Cite>
            </li>
            <li>
              <strong>Before a policy goes into use.</strong> Take the two or three checkpoints that are left to the
              real arm in one session. Fix the number of trials, or the stopping rule, before the first trial.
            </li>
          </ul>
          <Box variant="p">
            To set the number of trials, start from the gap you need to see. At 50 trials each, 40 of 50 against 45
            of 50 is a difference that these trials cannot resolve, with p = 0.26. A 20-point gap near the top of
            the scale does show up at 50 trials, and a 10-point gap needs about 199 trials per policy. So fifty
            trials on the real arm are enough to catch a policy that fails there. To tell apart two policies that differ by 10 points,
            you need hundreds of episodes. A simulator can supply that many and a session on the real arm cannot,
            but the result from the simulator still carries the gap between the simulator and the real arm.{' '}
            <Cite id="F06-97">computed with the formulas of LeRobot eval_stats.py</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
