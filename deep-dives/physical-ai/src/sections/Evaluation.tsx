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
            description="Rank checkpoints by counting successes, put an interval on every count, and work out how many trials a gap needs before the first one runs (LeRobot v0.7.0, sources read 2026-11-20)"
          >
            16. Evaluation: Measuring Success Rates and How Many Trials You Need
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Choosing which checkpoint to keep is the first decision evaluation settles. A checkpoint is a copy of
            the weights of the policy, the model that drives the arm, saved during training, and one run saves
            many. The validation loss, the training objective computed on demonstrations held out of training,
            cannot make the choice: the authors of ABC, a 2026 study of behaviour cloning, report a validation loss
            that went down and then up while their policy&apos;s performance kept improving.{' '}
            <Cite id="F06-84">ABC paper, section 4</Cite> What ranks checkpoints is a success rate: let each one
            drive the arm, and count the attempts that end with the task done.
          </Box>
          <Box variant="p">
            A count from a few dozen attempts cannot separate two good policies. Forty successes in 50 and 45 in
            50 read as 80% against 90%, but their 95% intervals, the ranges of true rates that could plausibly have
            produced each count, run from 67.0% to 88.8% and from 78.6% to 95.7%, and they overlap. Overlap is a
            warning; the verdict comes from a test built for the comparison, and it finds that two equal policies
            would look at least this different about one time in four. Telling a true 80% from a true 90%, with four
            chances in five of seeing the gap and one in twenty of a false alarm, takes about 199 trials per
            policy. <Cite id="F06-97">our arithmetic, with the formulas of LeRobot eval_stats.py</Cite> Robot
            evaluations typically run 10 to 50 episodes per task.{' '}
            <Cite id="F06-94">LeRobot v0.7.0, eval_stats.py</Cite>
          </Box>
          <Box variant="p">
            So evaluation moves to a simulated arm and becomes hundreds of episodes per checkpoint, each one
            attempt at the task, none needing data from another. That shape, short units that never exchange data
            (section 1), sizes the job: the episodes spread over as many GPUs as the budget buys, and the simulated
            camera and the policy, more than the physics, decide how many fit on each.{' '}
            <Cite id="F06-48">Isaac Lab release benchmark, camera rows</Cite>{' '}
            <Cite id="F04-69">piRL paper, appendix J</Cite> The price is the simulator&apos;s
            blind spot: more simulated episodes narrow the interval around the simulator&apos;s success rate and
            leave the gap between the simulator and the bench where it was.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Name the two ways this choice goes wrong: a loss computed while no arm moved, and a single trial that cannot measure a rate"
          >
            Two checkpoints with the same loss, and one drops the block
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The {ARM} has to {TASK_STORY}. A training run saved two checkpoints an hour apart, and their
            validation losses agree to the third decimal place. You load the first. The arm reaches the block,
            closes on it, carries it across and lowers it into the cup. You load the second. The arm reaches the
            block, closes on it, lifts, and halfway to the cup the block slides out of the gripper. The arm
            finishes the motion and opens its fingers over the cup with nothing in them.
          </Box>
          <Box variant="p">
            The losses could agree because neither checkpoint moved the arm while its loss was computed. The bench
            result settles little either. The second checkpoint may drop the block once in twenty attempts or once
            in two, and one attempt cannot tell which. The first fault is in what the loss measures, the second in
            how many attempts a rate needs.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See why an error scored one frame at a time says little about a whole attempt, and where it still helps shortlist checkpoints"
          >
            A validation score never lets the policy drive
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Two offline numbers score a policy against demonstrations it was not trained on, and both are
            open-loop: the policy answers, and its answer changes nothing it sees next. The validation loss is
            one; for a diffusion policy it is the error in predicting the added noise (section 4,
            Learning From Demonstrations). The other, the validation action error, runs the policy as it runs on the
            arm, sampler included, on each held-out frame and compares the action that comes out with the action
            the person took.
          </Box>
          <Box variant="p">
            The action error is usually an MSE (mean squared error), the average over the recording of the squared
            distance between the two actions. Write <M>T</M> for the number of frames,{' '}
            <M>{String.raw`a^{\text{pred}}_t`}</M> for the policy&apos;s action at frame <M>t</M> and{' '}
            <M>{String.raw`a^{\text{demo}}_t`}</M> for the recorded one. On this arm each is a list of six joint
            targets, and the double bars measure the distance between two such lists.
          </Box>
          <Formula
            name="Validation action error: mean squared error against the recording"
            tex={String.raw`\mathrm{MSE} = \frac{1}{T} \sum_{t=1}^{T} \bigl\lVert a^{\text{pred}}_t - a^{\text{demo}}_t \bigr\rVert^2`}
          />
          <Box variant="p">
            The difference inside the bars is how far the policy&apos;s answer is from the person&apos;s at one
            frame. Squaring makes large misses count most. Dividing by <M>T</M> averages over the recording and
            gives every frame the same weight, so the frame where the fingers close on the block counts no more than
            one where the arm crosses empty air. Many codebases also divide by the number of action dimensions, six
            here, which rescales the value and changes no ranking.
          </Box>
          <Box variant="p">
            No term looks forward. Frame <M>t + 1</M> comes from the recording whatever the policy answered at
            frame <M>t</M>, so the policy is never shown the scene its own mistake would have produced. That scene
            is where the compounding error of section 4 lives: one slightly wrong action puts the arm where no
            demonstration went, and the next action is worse.
          </Box>
          <Box variant="p">
            A closed-loop score lets the policy drive. Its action moves the arm, the moved arm changes the next
            camera image, and that image is what the policy sees next. One complete run from the starting pose
            until the task succeeds, fails or runs out of time is a rollout; trial and episode mean the same thing
            here. Each rollout ends in a yes or a no, and the success rate is the number of yeses divided by the
            number of rollouts.
          </Box>
          <Figure
            caption={
              <>
                One policy, one list of small per-step errors, scored both ways. In open loop each short error step
                starts on the recorded line, so no error inherits the last one; in closed loop each step starts where
                the last ended, and the same errors carry the joint away from the recorded path. Illustrative, not measured.
              </>
            }
          >
            <EvalLoops />
          </Figure>
          <Box variant="p">
            How well an offline score predicts real success has been measured with the Pearson correlation{' '}
            <M>r</M>, a number between -1 and 1 that says how closely two lists rise and fall together: score
            several policies both ways, on real robots and with the cheap score, and correlate the two lists. At 1
            the cheap score predicts the real one exactly; at 0 it says nothing.
          </Box>
          <Box variant="p">
            SIMPLER, a 2024 study, did this for a set of policies on three tasks. Scored by validation action MSE,
            the policies correlated with their real-world success at r = 0.308, averaged over the tasks, against
            0.924 when they were scored in closed loop in a simulator built to match the real camera view. In the
            authors&apos; words, &quot;validation MSE is not a good proxy for a policy&apos;s real-world
            performance&quot;. <Cite id="F06-81">SIMPLER paper, section VI and Table I</Cite>
          </Box>
          <Box variant="p">
            The open-loop error does not fully capture three closed-loop effects: compounding errors, contact
            dynamics and recovery ability.{' '}
            <Cite id="F06-85">REAL-I challenge report, discussion of evaluation</Cite> The block sliding
            out of the gripper is a contact effect. Recovery needs a slip to recover from, and the recordings hold none,
            because the person who made them did not slip (section 4).
          </Box>
          <Box variant="p">
            Inside one training recipe the action error still earns a place. Across their own policy variants, the
            ABC authors found lower validation action error going with better real-world performance, a
            statistically significant correlation, where validation loss &quot;is not significantly
            correlated&quot;. The action error &quot;is only meaningful when the number of diffusion steps is held
            fixed&quot;, since the sampler is part of what it scores, and offline metrics &quot;cannot reliably predict task success rates or reveal failure
            modes&quot;. <Cite id="F06-84">ABC paper, section 4</Cite>
          </Box>
          <Box variant="p">
            So the action error, at a fixed number of denoising steps, can shortlist checkpoints of one recipe and
            flag overfitting, which is how one team in REAL-I, a robot challenge held at ICRA 2026 (the International
            Conference on Robotics and Automation), used it.{' '}
            <Cite id="F06-85">REAL-I challenge report, discussion of evaluation</Cite> Ranking different policies,
            or predicting a success rate, takes a closed loop.
          </Box>
          <ExpandableSection headerText="Why the offline number flatters a model: an AWS customer engagement">
            <Box variant="p">
              The offline setup &quot;feeds the model ground-truth video frames&quot;, so its &quot;generated
              actions deviate only slightly from ground truth by design&quot; and &quot;offline rollouts understate
              the model&apos;s true closed-loop influence&quot;. The conclusion runs both ways: a model with low
              average prediction error &quot;can still fail in the loop, while a model with higher MSE can
              succeed&quot;.{' '}
              <Cite id="F06-86">AWS Physical AI blog, Telexistence and DreamZero, post of 2026-09-09</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Put a 95% interval on a success count by hand, test the gap between two counts, and see why 50 trials each cannot separate 80% from 90%"
          >
            40 of 50 against 45 of 50: the intervals overlap, and the test cannot split them
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Checkpoint A succeeds in 40 of 50 trials and checkpoint B in 45 of 50: 80% against 90%. Each trial is
            the toss of a weighted coin. The policy has a true success rate that nobody can see, and 50 tosses land
            near it, seldom on it. If both checkpoints truly succeeded <Toy>85</Toy>% of the time (an
            illustration), 40 and 45 would both be ordinary results.{' '}
            <Cite id="F06-97">our arithmetic, with the formulas of LeRobot eval_stats.py</Cite>
          </Box>
          <Box variant="p">
            A confidence interval runs the reasoning backwards, from the count to the true rate: it is the range of
            true rates that could plausibly have produced the count. The Wilson interval is one recipe for that
            range, and at the 95% level its range contains the true rate about nineteen times in twenty. For A it is
            67.0% to 88.8%; for B, 78.6% to 95.7%.{' '}
            <Cite id="F06-97">our arithmetic, with the formulas of LeRobot eval_stats.py</Cite>
          </Box>
          <Figure
            cites="F06-97"
            caption={
              <>
                Each bar is the range of true success rates that could plausibly give that count, and the circle is
                the observed rate. The shaded band, 78.6% to 88.8%, lies inside both ranges.
              </>
            }
          >
            <IntervalChart />
          </Figure>
          <Box variant="p">
            The ranges share everything from 78.6% to 88.8%. Fisher&apos;s exact test, which LeRobot&apos;s code
            recommends for comparing two policies, puts a probability on the gap.{' '}
            <Cite id="F06-95">LeRobot v0.7.0, eval_stats.py docstrings</Cite> Pool the{' '}
            <Derived>50 + 50 = 100</Derived> trials: <Derived>40 + 45 = 85</Derived> successes and{' '}
            <Derived>15</Derived> failures. If A and B were equally good, which trials the failures fell on would be
            luck, and the test counts how often luck alone splits them at least as unevenly as A&apos;s 10 against
            B&apos;s 5. <Cite id="F06-97">our arithmetic, with the formulas of LeRobot eval_stats.py</Cite>
          </Box>
          <Box variant="p">
            That share is the p-value, and here it is 0.26: about one time in four, equal policies would look at
            least this different. These trials cannot tell A from B. A 20-point gap near the top of the scale clears the noise: 45 of 50
            against 35 of 50 gives p = 0.023, although <Derived>35 of 50 has an interval of 56.2% to 80.9%</Derived>
            , which still overlaps B&apos;s. Two intervals can overlap while the gap is real.{' '}
            <Cite id="F06-97">our arithmetic, with the formulas of LeRobot eval_stats.py</Cite>
          </Box>
          <Box variant="p">
            The Wilson interval is a centre plus or minus a half-width, and both parts say something about small
            counts. Write <M>k</M> for the number of successes, <M>n</M> for the
            number of trials and <M>p</M> for the observed rate. <M>z</M> sets the confidence: it is the number of
            standard deviations of a bell curve that cover the central 95%, <Derived>1.96</Derived>.
          </Box>
          <Formula
            name="Success rate and its Wilson score interval"
            tex={String.raw`\begin{aligned} p &= \frac{k}{n} \\[4pt] \text{centre} &= \frac{p + \dfrac{z^2}{2n}}{1 + \dfrac{z^2}{n}} \\[4pt] \text{half-width} &= \frac{z \sqrt{\dfrac{p(1-p)}{n} + \dfrac{z^2}{4n^2}}}{1 + \dfrac{z^2}{n}} \end{aligned}`}
            source={<Cite id="F11-203">LeRobot v0.7.0, eval_stats.py, wilson_interval()</Cite>}
          />
          <Box variant="p">
            The centre is the observed rate pulled toward one half, harder when <M>n</M> is small: for 40 of 50 it
            is <Derived>0.7786</Derived>, below the observed <Derived>0.80</Derived>. Under the square root,{' '}
            <M>{String.raw`p(1-p)/n`}</M> is the variance of the observed rate, and its square root, the standard
            error, is how far the observed rate typically lands from the true one. It carries the lesson: <M>n</M> sits
            under a square root, so halving the width takes four times the trials. The{' '}
            <M>{String.raw`z^2/4n^2`}</M> term keeps the width above zero when every trial succeeds or every trial
            fails. <Cite id="F06-97">our arithmetic, with the formulas of LeRobot eval_stats.py</Cite>
          </Box>
          <Box variant="p">
            Those two corrections, the pull toward one half and the term that holds the width open, are why
            LeRobot&apos;s code prefers this interval to the textbook one,{' '}
            <M>{String.raw`p \pm z\sqrt{p(1-p)/n}`}</M>, called the Wald interval. In its docstring&apos;s words,
            the Wilson interval &quot;stays inside [0, 1] and keeps its nominal coverage at small n_trials and at
            rates near 0% or 100%, which is where robot evaluations live&quot;. Its documented example,{' '}
            <code>wilson_interval(9, 10)</code>, returns 0.596 to 0.982.{' '}
            <Cite id="F06-95">LeRobot v0.7.0, eval_stats.py docstrings</Cite> The Wald formula on the same count
            gives <Derived>0.9 plus or minus 1.96 x sqrt(0.9 x 0.1 / 10) = 0.714 to 1.086</Derived>: an upper end
            above 100%, and a lower end well above Wilson&apos;s 0.596.
          </Box>
          <Box variant="p">
            At a perfect score the Wald interval collapses. The MuJoCo Playground paper reports 12 successes in 12
            real trials. <Cite id="F06-96">STEP, Playground, PolaRiS and ABC papers</Cite> Wald gives{' '}
            <Derived>1 plus or minus 1.96 x sqrt(1 x 0 / 12) = 1 plus or minus 0</Derived>, as if 12 trials had
            proved the policy never fails. With <M>p = 1</M> the Wilson formula&apos;s lower end reduces to{' '}
            <M>{String.raw`1 / (1 + z^2/n)`}</M>, which is <Derived>1 / (1 + 3.84 / 12) = 1 / 1.32 = 0.76</Derived>
            , so a policy that truly succeeds about three times in four is still inside the interval after twelve
            straight successes.
          </Box>
          <ExpandableSection headerText="Redo the interval for 40 of 50 by hand">
            <SpaceBetween size="s">
              <Box variant="p">
                Here <M>k</M> = 40, <M>n</M> = 50, <M>p</M> = <Derived>0.80</Derived> and <M>z</M> ={' '}
                <Derived>1.96</Derived>, so <M>{String.raw`z^2/2n`}</M> = <Derived>0.0384</Derived>,{' '}
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
                That is 67.0% to 88.8%. The Wald formula on the same count gives{' '}
                <Derived>0.80 plus or minus 1.96 x sqrt(0.8 x 0.2 / 50) = 68.9% to 91.1%</Derived>, centred on the
                observed rate where Wilson pulls the centre toward one half. <Cite id="F06-97">our arithmetic</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Work out how many trials a given gap needs before the first one runs, and see why that number moves evaluation into simulation"
          >
            Half the gap takes about four times the trials
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The square root makes precision expensive. With the same formula,{' '}
            <Derived>80 successes in 100 give 71.1% to 86.7%</Derived> and{' '}
            <Derived>160 in 200 give 73.9% to 85.0%</Derived>. Four times the trials of the 50-trial case cut the
            width from <Derived>88.8 - 67.0 = 21.8</Derived> points to <Derived>85.0 - 73.9 = 11.1</Derived>, half
            of it. <Cite id="F06-97">our arithmetic, with the formulas of LeRobot eval_stats.py</Cite>
          </Box>
          <Box variant="p">
            Detecting a gap between two policies asks for two settings. The power is the chance that the comparison
            detects a gap that is really there: at 80% it finds the gap four times in five. The level is the
            false-alarm rate when there is no gap: at 5% it cries wolf one time in twenty. At those settings,
            telling a true 80% from a true 90% takes about 199 trials per policy, by the standard normal
            approximation for two proportions.{' '}
            <Cite id="F06-97">our arithmetic, with the formulas of LeRobot eval_stats.py</Cite>
          </Box>
          <Box variant="p">
            Write <M>{String.raw`p_1`}</M> and <M>{String.raw`p_2`}</M> for the two true rates to be told apart,{' '}
            <M>{String.raw`\bar{p}`}</M> for their mean, <M>{String.raw`z_{\text{level}}`}</M> ={' '}
            <Derived>1.96</Derived> for the 5% level and <M>{String.raw`z_{\text{power}}`}</M> ={' '}
            <Derived>0.84</Derived> for 80% power. <M>n</M> is the number of trials each policy needs.
          </Box>
          <Formula
            name="Trials per policy to tell two success rates apart (normal approximation)"
            tex={String.raw`n = \frac{\Bigl( z_{\text{level}} \sqrt{2\,\bar{p}(1-\bar{p})} + z_{\text{power}} \sqrt{p_1(1-p_1) + p_2(1-p_2)} \Bigr)^2}{(p_1 - p_2)^2}`}
            source={<Cite id="F06-97">our arithmetic: the standard two-proportion approximation</Cite>}
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
            The denominator carries the lesson. The gap enters squared, so at similar rates half the gap takes about
            four times the trials. The <M>{String.raw`p(1-p)`}</M> terms are largest at one half, so the same
            10-point gap costs more near 50% than near 90%:{' '}
            <Derived>45% against 55% needs about 391 trials per policy</Derived>, nearly twice the 199. The
            numerator holds the two settings: ask for more power or a lower false-alarm rate and both z values, and
            with them <M>n</M>, grow. <Cite id="F06-97">our arithmetic: the standard two-proportion approximation</Cite>
          </Box>
          <Box variant="p">
            Published robot work runs far fewer trials than that. The MuJoCo Playground paper reports 12 trials for
            one task, PolaRiS 20 real rollouts per policy in each environment, and ABC 50 trials per task. The
            authors of STEP, a 2025 paper on comparing robot policies, write that comparison is &quot;fundamentally
            constrained by a small feasible sample size (e.g., 10 or 50) due to significant human effort and
            limited inference throughput of policies&quot;.{' '}
            <Cite id="F06-96">STEP, Playground, PolaRiS and ABC papers</Cite>
          </Box>
          <Box variant="p">
            Multiply out a real decision. Choosing among <Toy>5</Toy> checkpoints of one run (an illustration), at
            199 trials each, is at least <Derived>5 x 199 = 995</Derived> attempts at the task, since picking the best of
            five makes several comparisons rather than one, against the 10 or 50 that
            STEP calls feasible per comparison. That gap is what turns evaluation into hundreds of independent
            simulated episodes. <Cite id="F06-97">our arithmetic, with the formulas of LeRobot eval_stats.py</Cite>{' '}
            <Cite id="F06-96">STEP paper, abstract</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Score every checkpoint with no arm in the room, and check the two ways a simulated count misleads: a gap to the bench, and a benchmark every policy passes"
          >
            A simulated count ranks policies only as well as the simulator matches the bench
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The physics simulator of section 12, Physics Simulation, stands in for the bench. In LeRobot v0.7.0 the
            tool is <code>lerobot-eval</code>: it runs a checkpoint in closed loop in a batch of simulated
            environments, locally or against an environment server in its own Docker image, and reports the
            success rate with its 95% Wilson interval in the <code>pc_success_ci95</code> field.{' '}
            <Cite id="F06-94">LeRobot v0.7.0, simulation docs and eval_stats.py</Cite>
          </Box>
          <Box variant="p">
            An AWS sample shows what a simulated budget buys. It scores a policy on 500 simulated episodes of
            LIBERO-Goal, part of LIBERO, a fixed set of simulated manipulation tasks, before and after a round of
            reinforcement learning (section 8, Reinforcement Learning for Robots, follows that run): 243 of 500,
            48.6% with a 95% interval of 44.2-53.0%, then 425 of 500, 85.0% with 81.6-87.9%. Both intervals are
            under 9 points wide, against <Derived>21.8</Derived> at 50 trials, and 500 episodes per policy is more
            than the <Derived>391</Derived> that a 10-point gap needs at its most expensive, around 50%.{' '}
            <Cite id="F04-70">AWS sample, docs/results.md</Cite> <Cite id="F06-97">our arithmetic</Cite>
          </Box>
          <Box variant="p">
            LeRobot ships no {ARM} simulator of its own. Its simulation layer wraps outside benchmarks, LIBERO and
            LIBERO-plus among them, and a <code>sim</code> robot type lets a simulated environment stand in for the
            real arm. <Cite id="F06-38">LeRobot v0.7.0, simulation integrations</Cite> For this arm, MuJoCo
            Playground&apos;s <code>{SIM_TASK}</code> (section 14, Sim-to-Real and Real-to-Sim) runs the same task
            code in simulation and on the physical follower, covers picking the cube up and leaves out the cup, and
            has no published success rate: your count is the only one.{' '}
            <Cite id="F06-26">MuJoCo Playground, SO-101 deploy README</Cite>
          </Box>
          <Box variant="p">
            A simulated score ranks policies well when the simulated scene looks and behaves like the bench.
            SIMPLER&apos;s 0.924 came from a simulator matched to the real camera view.{' '}
            <Cite id="F06-81">SIMPLER paper, Table I</Cite> PolaRiS rebuilds a real scene from a few minutes of
            video (section 14), fine-tunes each policy for 1k steps on about 350 simulated demonstrations from 15
            other scanned scenes, and then reports an average r = 0.9 against real trials across six paired
            environments, 0.81 in the worst. What it scores is each policy after that
            fine-tuning, adapted to the simulator&apos;s look, rather than the checkpoint as it left training.{' '}
            <Cite id="F06-83">PolaRiS paper, introduction and sections 5.1 and 5.2</Cite>{' '}
            <Cite id="F06-73">PolaRiS paper, section 4.1</Cite>{' '}
            <Cite id="F06-74">PolaRiS paper, sections 4.2 and 5.1</Cite>
          </Box>
          <Box variant="p">
            What no simulated count reports is the rate on your bench. The interval <code>lerobot-eval</code> prints
            covers, in the words of LeRobot&apos;s code, &quot;evaluation sampling noise only, i.e. which episodes
            happened to be drawn&quot;. <Cite id="F06-95">LeRobot v0.7.0, eval_stats.py docstrings</Cite> More
            episodes narrow it around the simulator&apos;s rate and leave the sim-to-real gap of section 14 exactly
            as wide as it was.
          </Box>
          <Box variant="p">
            The second way a simulated count misleads is a saturated benchmark. A benchmark is a fixed set of
            simulated tasks that everyone scores on, such as LIBERO, and it is saturated when nearly every policy
            scores near the top. The PolaRiS authors found &quot;nearly all tested policies scoring between 90 and
            95% success in Libero, but spanning the full spectrum from high-performing to low-performing policies
            in the real world&quot;. <Cite id="F06-82">PolaRiS paper, section 5.2</Cite> A score that every policy
            earns ranks none of them.
          </Box>
          <Box variant="p">
            The cure is to vary the scene until the score spreads again. LIBERO-Plus perturbs seven things about
            each task, among them the camera viewpoint, the robot&apos;s starting pose and the lighting, and its
            authors report performance &quot;dropping from 95% to below 30% under modest perturbations&quot;.
            LIBERO-PRO reports models above 90% on standard LIBERO whose &quot;performance collapses to 0.0%&quot;
            in its generalised setting. <Cite id="F06-87">LIBERO-Plus and LIBERO-PRO papers, abstracts</Cite>
          </Box>
          <Box variant="p">
            LeRobot and Isaac Lab-Arena both make the perturbed score a setting. LeRobot v0.7.0 ships a <code>libero_plus</code>{' '}
            integration beside <code>libero</code>. <Cite id="F06-38">LeRobot v0.7.0, simulation integrations</Cite>{' '}
            Isaac Lab-Arena, NVIDIA&apos;s evaluation tool for its Isaac Lab simulator, added in its v0.3 alpha a
            way to &quot;turn one environment into a controlled perturbation sweep&quot; over lighting,
            backgrounds, camera parameters and object mass. Score each checkpoint across the sweep, and pass only
            those that hold their rate. <Cite id="F06-92">Isaac Lab-Arena, v0.3 announcement</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Order candidate policies when no simulated scene exists, at about 86 GPU-seconds per imagined rollout, and know what a correlation over a few policies can show"
          >
            A world model scores a policy with no scene to build
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A world model predicts what the cameras will show after an action (section 6, World Models), and that
            is enough to score a policy with no scene built at all. Start from the first camera frame of a real
            episode. The policy chooses its actions, the world model generates the frames those actions would
            produce, and the generated frames go back to the policy as its next input, once per step. When the
            rollout ends, a vision-language model, one that takes images and text, watches the generated video and
            judges whether the task was done. Nobody types in a friction value.
          </Box>
          <Box variant="p">
            RoboWorld runs this from the first frame of each RoboArena episode, with a video model imagining 30
            seconds per rollout and GPT-4o as the judge. Across 8 policies and 4,186 generated rollouts its authors
            report a Pearson r of 0.989 against RoboArena&apos;s real-robot leaderboard, and a Spearman correlation
            of 0.970: the same calculation applied to rank positions, which measures whether two lists put the
            policies in the same order. They add that &quot;the correlation improves as the number of trials
            increases&quot;. <Cite id="F06-89">RoboWorld paper, abstract and section 5</Cite>
          </Box>
          <Box variant="p">
            RoboArena is the real reference behind that figure. Evaluators at seven academic institutions run pairs
            of policies on the DROID robot platform, on tasks and scenes of their own choosing, without knowing
            which policy is which, and the preferences are aggregated into a ranking. The paper reports &quot;more
            than 600 pairwise real-robot evaluation episodes across seven generalist policies&quot;: hundreds of
            real trials, spread over seven labs. RoboWorld&apos;s replication of the leaderboard covers 8 policies. Every cheap evaluator is graded against a ranking like this, so the
            expensive reference has to exist first. <Cite id="F06-88">RoboArena paper, abstract</Cite>{' '}
            <Cite id="F06-89">RoboWorld paper, section 5</Cite>
          </Box>
          <Box variant="p">
            Two more evaluators of this kind report r = 0.78 (WorldGym, whose world-model and real success rates
            differ &quot;by an average of only 3.3%&quot;) and r = 0.983 (HF-WM, over six RoboArena policies with
            GPT-5 as judge). Each figure comes from the authors of the tool it describes. When the PolaRiS authors
            tried someone else&apos;s open-source video model, Ctrl-World, it &quot;often produces heavy
            hallucinations during object interaction&quot; and ranked the policies wrongly.{' '}
            <Cite id="F06-90">WorldGym, HF-WM and PolaRiS papers</Cite> A block leaving a gripper is an object
            interaction, the moment the second checkpoint failed.
          </Box>
          <Box variant="p">
            RoboWorld&apos;s correlation is computed over 8 policies and HF-WM&apos;s over six. A high figure over so few shows that the
            tool orders those policies roughly as real robots do; it does not show that the tool can split two good
            checkpoints a few points apart.{' '}
            <Cite id="F06-89">RoboWorld paper, section 5</Cite>{' '}
            <Cite id="F06-90">WorldGym, HF-WM and PolaRiS papers</Cite>
          </Box>
          <Box variant="p">
            The cost is video generation on a GPU&apos;s tensor cores, with no physics engine and no ray tracing.
            RoboWorld&apos;s authors report &quot;only 100 H100 GPU hours&quot; for their whole benchmark of 8
            policies. By our arithmetic that is <Derived>100 / 8 = 12.5</Derived> GPU-hours per policy, and{' '}
            <Derived>100 x 3,600 / 4,186 = 86</Derived> GPU-seconds to imagine each 30-second rollout. <Cite id="F06-89">RoboWorld paper, section 5</Cite>
          </Box>
          <Figure
            cites="F06-81 F06-83 F06-89 F06-90"
            caption={
              <>
                Each way of scoring a policy sits at the Pearson correlation with real-robot success that its own
                paper reports: open-loop action error on the ground, a simulator on rung one, a world model on rung
                two, and the real arm, the reference, on rung three at 1. The ends are clear: open loop far below,
                the real arm on top. The two middle rungs overlap on the axis, 0.81 to 0.924 for simulation and
                0.78 to 0.989 for world models: the vertical order is the ladder&apos;s, and the correlations
                alone do not put one rung above the other.
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
            description="Plan bench trials around a person's time, drift between sessions and seeds, and fix the stopping rule before the first trial"
          >
            The real arm is the reference, and a person pays for every trial
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every cheaper score is graded against trials on a real robot, and a real trial costs a person&apos;s
            effort: someone sets the block back, starts the run and watches where the block ends. That effort is
            the first reason STEP&apos;s authors give for feasible sample sizes of 10 or 50.{' '}
            <Cite id="F06-96">STEP paper, abstract</Cite> The bench also adds two sources of variation that no
            trial count removes.
          </Box>
          <Box variant="p">
            The first is the training run itself. LeRobot&apos;s code warns that its intervals &quot;do not cover
            variation between training runs (seeds) of the same recipe, which has to be measured by training more
            than once&quot;. <Cite id="F06-95">LeRobot v0.7.0, eval_stats.py docstrings</Cite> Two recipes
            compared on one training run each have been compared once on that axis, however many trials each
            checkpoint got.
          </Box>
          <Box variant="p">
            The second is the room. The robot maker 1X wrote in 2024 that &quot;even the same model weights can
            experience a rapid degradation in performance in a matter of days&quot;, and that a shirt-folding model
            &quot;degrades in performance over the course of 50 days&quot; as its surroundings drift.{' '}
            <Cite id="F06-91">1X, world model post of 2024-09-17</Cite> Last month&apos;s count is no baseline.
            Compare two checkpoints in the same session, on the same table, under the same light.
          </Box>
          <Box variant="p">
            Fix the rules before the first trial. Adding trials until a gap looks convincing, then stopping, raises
            the false-alarm rate, because every extra look is another chance for luck to cross the line. STEP
            replaces the fixed count with a sequential test, checked after each pair of trials, that stops as soon
            as the evidence suffices: an easy comparison ends early, a hard one runs on, &quot;without sacrificing
            probabilistic correctness&quot;. Toyota Research Institute&apos;s earlier guidance (2024) notes papers
            reporting a success rate &quot;with little to no information regarding the number of runs, the initial
            conditions, and the success criteria&quot;: write all three down.{' '}
            <Cite id="F06-98">STEP and Robot Learning as an Empirical Science, abstracts</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Match each decision to the cheapest score that can settle it, and size the simulated job by its camera and its policy rather than its physics"
          >
            Score in simulation while training, on the arm before release
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A simulated evaluation puts three loads into every episode: the physics step, a simulated camera when
            the policy reads images, and a call to the policy. Physics alone is light. In Isaac Lab&apos;s own
            benchmark on one RTX PRO 6000 Blackwell, the GPU AWS sells in G7e instances, 8,192
            environments of its Cartpole task, state only and with no camera, process about a million environment
            steps a second with the Newton physics engine, policy updates included, in 0.93 GB of GPU memory. <Cite id="F06-47">Isaac Lab release benchmark, state-only rows</Cite> One small camera per
            environment cuts that throughput by a factor of 6.7 and multiplies the memory by 62 (section 13,
            Rendering and Ray Tracing). <Cite id="F06-48">Isaac Lab release benchmark, camera rows</Cite>
          </Box>
          <Box variant="p">
            The policy is the third load, and every simulated step waits on its forward pass. With a small policy,
            the camera decides how many environments fit on a GPU. A vision-language-action model (section 5), a
            policy of several billion parameters that reads camera images, adds its own weight: a
            reinforcement-learning run (section 8) that fine-tuned such models stepped 64 to 320 simulated
            environments in parallel on eight H100 GPUs, <Derived>64 / 8 = 8 to 320 / 8 = 40</Derived> per GPU
            against the 8,192 of Isaac Lab&apos;s state-only benchmark. That run carries the camera and the large
            policy together, on different hardware, so it shows the drop from thousands of environments per GPU to
            tens, not how the cost splits between the two.{' '}
            <Cite id="F04-69">piRL paper, appendix J</Cite>{' '}
            <Cite id="F06-47">Isaac Lab release benchmark, state-only rows</Cite>
          </Box>
          <Box variant="p">
            Batches fill one GPU and independent runs fill many. NVIDIA&apos;s published scaling for Isaac
            Lab-Arena, measured with no cameras and no policy, shows both. On one RTX 5880 Ada, one environment
            stepped 5.41 times a second and 1,024 environments 2,390, because one step of the whole batch took 428
            ms against 185 ms for one environment alone. Eight independent runs took 1,255.2 s on one L40 GPU and
            157.8 s on eight, &quot;a 7.95x speedup&quot;.{' '}
            <Cite id="F06-93">Isaac Lab-Arena docs, performance and scaling</Cite>
          </Box>
          <Box variant="p">
            No episode needs another, so on AWS the job is an AWS Batch array job, one submission whose children
            each read their own index to pick a checkpoint and a seed (section 24, Orchestrating Physical AI on
            AWS, runs one policy&apos;s evaluation that way). <Cite id="F09-5">AWS Batch User Guide, array jobs</Cite>{' '}
            The job suits Spot capacity, which AWS can reclaim on a two-minute notice: Batch&apos;s guidance is to
            split Spot work into parts of 30 minutes or less, and a child that runs one episode, or a few, stays well
            inside that. <Cite id="F09-11">AWS Batch User Guide, Spot best practices</Cite>{' '}
            <Cite id="F09-12">AWS Batch User Guide, Spot best practices</Cite>
          </Box>
          <Box variant="p">
            Cameras change the instance family. A simulated camera drawn by an RTX renderer needs RT cores, the
            ray-tracing units, and the GPUs of the P-family training instances have none (section 13).{' '}
            <Cite id="F06-60">AWS ML blog, Isaac Lab on SageMaker AI, GPU compatibility</Cite> Two AWS customer
            posts show the split: RLWRLD trains on p5e and p5en and evaluates in simulation on g6e; Telexistence
            fine-tuned on a p6-b200 and ran simulation on g7e.{' '}
            <Cite id="F09-87">AWS Physical AI blog, RLWRLD</Cite>{' '}
            <Cite id="F09-88">AWS Physical AI blog, Telexistence</Cite>
          </Box>
          <Box variant="p">
            Each kind of score settles a different decision. While a policy trains, score every saved checkpoint in
            closed loop in simulation, across a sweep of variations, and use the result to discard; the validation
            action error, at a fixed number of denoising steps, can shortlist which checkpoints to score. With no
            simulated scene for the task, a world model trained on robots and scenes like yours can order the
            candidates, at about 86 GPU-seconds per imagined rollout by our arithmetic from RoboWorld&apos;s figures; treat its order
            as provisional, and do not ask it to split two close checkpoints.{' '}
            <Cite id="F06-89">RoboWorld paper, section 5</Cite>
          </Box>
          <Box variant="p">
            Before a policy goes into use, take the two or three survivors to the bench in one session, and fix
            the number of trials, or the stopping rule, before the first one. Start from the gap you need to see.
            At 50 trials each, 40 of 50 against 45 of 50 is a difference these trials cannot resolve, p = 0.26; a
            20-point gap near the top of the scale shows, and a 10-point gap needs about 199 trials per policy. Fifty bench trials can catch
            a policy that fails on the real arm. Telling apart two that differ by 10 points takes hundreds of
            episodes, which a simulator supplies and a bench session does not, and the answer carries the
            simulator&apos;s gap to the bench with it.{' '}
            <Cite id="F06-97">our arithmetic, with the formulas of LeRobot eval_stats.py</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
