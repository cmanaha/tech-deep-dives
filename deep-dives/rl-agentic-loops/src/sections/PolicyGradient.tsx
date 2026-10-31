import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, arxiv } from '../components/Cite';

/** Sutton and Barto, Reinforcement Learning: An Introduction, 2nd ed. (the site serves no valid HTTPS). */
const SB = 'http://incompleteideas.net/book/RLbook2020.pdf';
/** Schulman et al., Generalized Advantage Estimation. */
const GAE = arxiv('1506.02438v6');
/** Ahmadian et al., Back to Basics (REINFORCE and RLOO for RLHF). */
const AHM = arxiv('2402.14740v2');
/** Shao et al., DeepSeekMath (GRPO and the unified paradigm). */
const DSM = arxiv('2402.03300v3');
/** Shenfeld, Pari and Agrawal, RL's Razor. */
const RAZOR = arxiv('2509.04259v1');

/**
 * One line of a multi-line formula block. On a narrow screen a long line wraps; the hanging
 * indent keeps its continuation visibly part of the same equation instead of reading as a new one.
 */
const FORMULA_LINE = { display: 'block', paddingLeft: '2ch', textIndent: '-2ch' } as const;

/* ------------------------------------------------------------------------ */
/* Diagram: what a baseline does to the weights of four samples             */
/* ------------------------------------------------------------------------ */

const BASE_ROWS = [
  { label: 'Sample 1: passes', reward: 1, rloo: '+0.67' },
  { label: 'Sample 2: passes', reward: 1, rloo: '+0.67' },
  { label: 'Sample 3: fails', reward: 0, rloo: '-0.67' },
  { label: 'Sample 4: fails', reward: 0, rloo: '-0.67' },
];

function BaselineWeightsDiagram() {
  const top = 74;
  const rowH = 48;
  const gap = 10;
  const axisA = 380;
  const axisB = 700;
  const unit = 100;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 352"
        role="img"
        aria-labelledby="pg-baseline-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="pg-baseline-title">
          Four samples for one prompt, scored 1 for a pass and 0 for a failure, and the weight each
          gets. Plain REINFORCE uses the reward as the weight: the two passes get weight 1 and are
          made more likely, and the two failures get weight 0 and do not move. RLOO subtracts the mean
          reward of the other three samples: each pass gets plus 0.67 and is made more likely, and
          each failure gets minus 0.67 and is made less likely.
        </title>
        <style>{`
          .pg-baseline-head { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .pg-baseline-sub { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .pg-baseline-pass { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .pg-baseline-fail { fill: #f4f4f4; stroke: #879596; stroke-width: 1.5; }
          .pg-baseline-name { fill: #16191f; font: 600 12px sans-serif; }
          .pg-baseline-note { fill: #5f6b7a; font: 11px sans-serif; }
          .pg-baseline-axis { stroke: #879596; stroke-width: 1; stroke-dasharray: 4 3; }
          .pg-baseline-up { fill: #037f0c; }
          .pg-baseline-down { fill: #ec7211; }
          .pg-baseline-zero { fill: #879596; }
          .pg-baseline-val { fill: #16191f; font: 600 12px sans-serif; }
          .pg-baseline-valz { fill: #5f6b7a; font: 11px sans-serif; }
          .pg-baseline-rule { stroke: #d1d5db; stroke-width: 1; }
          .pg-baseline-leg { fill: #414d5c; font: 11px sans-serif; }
        `}</style>
        <rect x={0} y={0} width={860} height={352} rx={8} fill="#ffffff" />

        {/* Column headers */}
        <text x={126} y={28} className="pg-baseline-head">
          Four samples, one prompt
        </text>
        <text x={126} y={46} className="pg-baseline-sub">
          scored by a pass or fail check
        </text>
        <text x={axisA} y={28} className="pg-baseline-head">
          Plain REINFORCE
        </text>
        <text x={axisA} y={46} className="pg-baseline-sub">
          weight = reward
        </text>
        <text x={axisB} y={28} className="pg-baseline-head">
          RLOO
        </text>
        <text x={axisB} y={46} className="pg-baseline-sub">
          weight = reward - mean of the other three
        </text>
        <line x1={16} y1={60} x2={844} y2={60} className="pg-baseline-rule" />

        {/* Zero axes */}
        <line x1={axisA} y1={66} x2={axisA} y2={top + 4 * rowH + 3 * gap + 6} className="pg-baseline-axis" />
        <line x1={axisB} y1={66} x2={axisB} y2={top + 4 * rowH + 3 * gap + 6} className="pg-baseline-axis" />

        {BASE_ROWS.map((r, i) => {
          const y = top + i * (rowH + gap);
          const pass = r.reward === 1;
          const mid = y + rowH / 2;
          const rlooLen = 0.67 * unit;
          return (
            <g key={r.label}>
              <rect
                x={16}
                y={y}
                width={220}
                height={rowH}
                rx={6}
                className={pass ? 'pg-baseline-pass' : 'pg-baseline-fail'}
              />
              <text x={30} y={y + 20} className="pg-baseline-name">
                {r.label}
              </text>
              <text x={30} y={y + 37} className="pg-baseline-note">
                {`reward ${r.reward}`}
              </text>

              {/* Plain REINFORCE */}
              {pass ? (
                <>
                  <rect x={axisA} y={mid - 9} width={unit} height={18} rx={2} className="pg-baseline-up" />
                  <text x={axisA + unit + 8} y={mid + 4} className="pg-baseline-val">
                    +1
                  </text>
                </>
              ) : (
                <>
                  <circle cx={axisA} cy={mid} r={4} className="pg-baseline-zero" />
                  <text x={axisA + 10} y={mid + 4} className="pg-baseline-valz">
                    0, does not move
                  </text>
                </>
              )}

              {/* RLOO */}
              {pass ? (
                <>
                  <rect x={axisB} y={mid - 9} width={rlooLen} height={18} rx={2} className="pg-baseline-up" />
                  <text x={axisB + rlooLen + 8} y={mid + 4} className="pg-baseline-val">
                    {r.rloo}
                  </text>
                </>
              ) : (
                <>
                  <rect
                    x={axisB - rlooLen}
                    y={mid - 9}
                    width={rlooLen}
                    height={18}
                    rx={2}
                    className="pg-baseline-down"
                  />
                  <text
                    x={axisB - rlooLen - 8}
                    y={mid + 4}
                    className="pg-baseline-val"
                    textAnchor="end"
                  >
                    {r.rloo}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <line x1={16} y1={312} x2={844} y2={312} className="pg-baseline-rule" />
        <rect x={250} y={324} width={14} height={14} rx={2} className="pg-baseline-up" />
        <text x={272} y={335} className="pg-baseline-leg">
          made more likely
        </text>
        <rect x={420} y={324} width={14} height={14} rx={2} className="pg-baseline-down" />
        <text x={442} y={335} className="pg-baseline-leg">
          made less likely
        </text>
        <circle cx={597} cy={331} r={4} className="pg-baseline-zero" />
        <text x={609} y={335} className="pg-baseline-leg">
          weight 0, no change
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: the gradient table, first four rows                             */
/* ------------------------------------------------------------------------ */

interface TableRow {
  method: string[];
  sub?: string;
  samples: string[];
  scorer: string[];
  weight: string[];
}

const TABLE_ROWS: TableRow[] = [
  {
    method: ['SFT'],
    sub: 'supervised fine-tuning',
    samples: ['A fixed dataset of targets', 'someone else wrote'],
    scorer: ['None at training time:', 'a person chose the data'],
    weight: ['1 for every token,', 'always'],
  },
  {
    method: ['REINFORCE'],
    samples: ["The current model's own", 'samples'],
    scorer: ['Anything that returns', 'one number per sample'],
    weight: ['The reward R, or', 'R minus a baseline'],
  },
  {
    method: ['Rejection-sampling', 'fine-tuning'],
    samples: ["The model's own samples:", 'the starting model, or the', 'current one when online'],
    scorer: ['A rule: is the answer', 'correct?'],
    weight: ['1 if it passes,', '0 if it fails'],
  },
  {
    method: ['RLOO or GRPO'],
    samples: ['A group of samples per', 'prompt from the current', 'model'],
    scorer: ['A reward model in both', 'papers; a program in', 'section 7'],
    weight: ['Reward minus a baseline', 'from the group;', 'can be negative'],
  },
];

function GradientTableDiagram() {
  const cols = [
    { x: 16, w: 170 },
    { x: 192, w: 220 },
    { x: 418, w: 210 },
    { x: 634, w: 210 },
  ];
  const heads = [
    { text: 'Method', cls: 'pg-table-hm' },
    { text: 'Which samples', cls: 'pg-table-hs' },
    { text: 'Which scorer', cls: 'pg-table-hr' },
    { text: 'Which weight', cls: 'pg-table-hw' },
  ];
  const lineH = 16;
  const rowGap = 6;
  let y = 150;
  const placed = TABLE_ROWS.map((r) => {
    const methodLines = r.method.length + (r.sub ? 1 : 0);
    const lines = Math.max(methodLines, r.samples.length, r.scorer.length, r.weight.length);
    const h = 20 + lineH * lines;
    const row = { r, y, h };
    y += h + rowGap;
    return row;
  });
  const dashedY = y + 2;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 466"
        role="img"
        aria-labelledby="pg-table-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="pg-table-title">
          The gradient table, first four rows. Every method updates the weights by a weight times the
          gradient of the log-probability of a sample, and differs in which samples it uses, which
          scorer it uses and which weight it gives. SFT uses a fixed dataset of targets, no scorer at
          training time, and a weight of 1 for every token. REINFORCE uses the current model&apos;s
          own samples, any scorer that returns one number per sample, and the reward, or the reward
          minus a baseline, as the weight. Rejection-sampling fine-tuning uses the model&apos;s own
          samples, a rule that checks the answer, and a weight of 1 for a pass and 0 for a failure.
          RLOO or GRPO uses a group of samples per prompt from the current model, a reward model, and
          the reward minus a baseline taken from the group, which can be negative. Sections 5 and 6
          add rows for PPO and DPO.
        </title>
        <style>{`
          .pg-table-band { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .pg-table-eq { fill: #0f1b2a; font: 600 15px sans-serif; text-anchor: middle; }
          .pg-table-eqs { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .pg-table-hm { fill: #414d5c; }
          .pg-table-hs { fill: #0972d3; }
          .pg-table-hr { fill: #1f7a70; }
          .pg-table-hw { fill: #8b6c00; }
          .pg-table-ht { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
          .pg-table-cell { fill: #ffffff; stroke: #d1d5db; stroke-width: 1; }
          .pg-table-mcell { fill: #f4f4f4; stroke: #d1d5db; stroke-width: 1; }
          .pg-table-mt { fill: #16191f; font: 600 13px sans-serif; }
          .pg-table-ms { fill: #5f6b7a; font: 11px sans-serif; }
          .pg-table-t { fill: #16191f; font: 12px sans-serif; }
          .pg-table-dash { fill: #ffffff; stroke: #879596; stroke-width: 1; stroke-dasharray: 5 4; }
          .pg-table-dt { fill: #5f6b7a; font: 12px sans-serif; text-anchor: middle; }
        `}</style>
        <rect x={0} y={0} width={860} height={466} rx={8} fill="#ffffff" />

        {/* The shared gradient shape */}
        <rect x={16} y={14} width={828} height={84} rx={8} className="pg-table-band" />
        <text x={430} y={46} className="pg-table-eq">
          update = weight x grad log pi(sample | prompt)
        </text>
        <text x={430} y={70} className="pg-table-eqs">
          averaged over every token of every sample
        </text>
        <text x={430} y={87} className="pg-table-eqs">
          DeepSeekMath writes SFT, rejection sampling, DPO, PPO and GRPO this way
        </text>

        {/* Column headers */}
        {cols.map((c, i) => (
          <g key={heads[i].text}>
            <rect x={c.x} y={112} width={c.w} height={30} rx={4} className={heads[i].cls} />
            <text x={c.x + c.w / 2} y={132} className="pg-table-ht">
              {heads[i].text}
            </text>
          </g>
        ))}

        {/* Rows */}
        {placed.map(({ r, y: ry, h }) => (
          <g key={r.method[0]}>
            <rect x={cols[0].x} y={ry} width={cols[0].w} height={h} rx={4} className="pg-table-mcell" />
            {r.method.map((t, j) => (
              <text key={t} x={cols[0].x + 12} y={ry + 22 + j * lineH} className="pg-table-mt">
                {t}
              </text>
            ))}
            {r.sub && (
              <text x={cols[0].x + 12} y={ry + 22 + r.method.length * lineH} className="pg-table-ms">
                {r.sub}
              </text>
            )}
            {[r.samples, r.scorer, r.weight].map((cell, ci) => (
              <g key={`${r.method[0]}-${ci}`}>
                <rect
                  x={cols[ci + 1].x}
                  y={ry}
                  width={cols[ci + 1].w}
                  height={h}
                  rx={4}
                  className="pg-table-cell"
                />
                {cell.map((t, j) => (
                  <text key={t} x={cols[ci + 1].x + 12} y={ry + 22 + j * lineH} className="pg-table-t">
                    {t}
                  </text>
                ))}
              </g>
            ))}
          </g>
        ))}

        {/* Rows the next two sections add */}
        <rect x={16} y={dashedY} width={828} height={34} rx={4} className="pg-table-dash" />
        <text x={430} y={dashedY + 22} className="pg-table-dt">
          Section 5 adds the PPO row and section 6 the DPO row
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function PolicyGradient() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Read any post-training method as one gradient: which samples, which scorer, which weight (sources read 2026-10-30)"
          >
            4. Policy Gradient
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Policy gradient is the family of methods that trains a policy (the model, seen as a
            probability distribution over what it writes next) straight from scored attempts: sample
            a response, score it, and make the high-scoring responses more likely. PPO (Proximal
            Policy Optimization) and GRPO (Group Relative Policy Optimization), the two RL
            (reinforcement learning) algorithms this dive keeps returning to, both update a model this
            way, and so does the SFT (supervised fine-tuning) step you already run, with every weight
            set to 1{' '}
            <Cite tier={3} href={DSM} venue="preprint">
              DeepSeekMath, Section 5.2.1 and Appendix A.1
            </Cite>
            .
          </Box>
          <Box variant="p">
            The challenge is to turn one number per attempt into a change in the weights. The number
            comes from outside the model, from a reward model, a unit test or a person, and it arrives
            once, after the whole response. Policy gradient meets it by using the number as a weight
            on the gradient of the sampled response&apos;s log-probability, and the gradient is taken
            only through that log-probability term{' '}
            <Cite tier={3} href={RAZOR} venue="ICLR 2026">
              RL&apos;s Razor, Section 5.1 footnote
            </Cite>
            . Because the score only multiplies, the scorer never has to be differentiable: in our
            reading of the estimator, a unit test or a compiler can be the scorer just as a neural
            reward model can.
          </Box>
          <Box variant="p">
            The section ends on a table that sets SFT, REINFORCE, rejection-sampling fine-tuning
            and RLOO (REINFORCE Leave-One-Out) or GRPO side by side. Every later method in the dive
            then reads as three choices: which samples, which scorer, which weight.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Recognise an RL update as the fine-tuning step you already run, with one weight per sample"
          >
            REINFORCE: fine-tune on your own samples, weighted by their score
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            REINFORCE is the simplest policy gradient method. For a prompt x, sample a response y
            from the current model, score it to get a reward R, and step the weights along the
            gradient of the response&apos;s log-probability, scaled by R:
          </Box>
          <Box variant="p">
            <code>gradient = R(y, x) * grad log pi(y | x),  with y sampled from pi(. | x)</code>{' '}
            <Cite tier={3} href={SB} venue="textbook">
              Sutton and Barto, Section 13.3, Eq. 13.8
            </Cite>{' '}
            <Cite tier={3} href={AHM} venue="ACL 2024">
              Ahmadian et al., Eq. 6
            </Cite>
          </Box>
          <Box variant="p">
            Read it in two parts. <code>grad log pi(y | x)</code> is the direction in weight space
            that most increases the probability of producing y again, and the update moves along it
            in proportion to the reward that followed{' '}
            <Cite tier={3} href={SB} venue="textbook">
              Sutton and Barto, Section 13.3
            </Cite>
            . A response that scored high is made much more likely; a response that scored 0 does not
            move.
          </Box>
          <Box variant="p">
            Fix R at 1 and take y from a dataset instead of from the model, and the update is SFT,
            with a gradient coefficient of 1 on every token{' '}
            <Cite tier={3} href={DSM} venue="preprint">
              DeepSeekMath, Appendix A.1.1
            </Cite>
            . That leaves two differences between RL and SFT. RL trains on the model&apos;s own
            samples where SFT trains on fixed external targets, and RL usually gives some samples a
            negative weight, which pushes probability away from poor outputs, a mechanism SFT lacks{' '}
            <Cite tier={3} href={RAZOR} venue="ICLR 2026">
              RL&apos;s Razor, Section 5.1
            </Cite>
            . The next block shows where the negative weights come from.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See why trainers subtract something from every reward, and how that gives a failed attempt a negative weight"
          >
            A baseline turns the score into better or worse than expected
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            REINFORCE is unbiased: averaged over many samples, its update points the way that raises
            the expected reward. Each single estimate is noisy, though. Variance here means how far
            one batch&apos;s update strays from that average, and REINFORCE can have high variance and
            so learn slowly{' '}
            <Cite tier={3} href={SB} venue="textbook">
              Sutton and Barto, Section 13.3
            </Cite>
            . The noise grows with the length of the episode, because the effect of one action is
            confounded with the effects of the actions before and after it{' '}
            <Cite tier={3} href={GAE} venue="ICLR 2016">
              GAE, Section 1
            </Cite>
            ; in the token-level view of section 3, every token of a response is one action.
          </Box>
          <Box variant="p">
            The fix is to subtract a baseline b from the reward before it scales the step:
          </Box>
          <Box variant="p">
            <code>gradient = (R(y, x) - b) * grad log pi(y | x)</code>{' '}
            <Cite tier={3} href={SB} venue="textbook">
              Sutton and Barto, Section 13.4, Eq. 13.11
            </Cite>{' '}
            <Cite tier={3} href={AHM} venue="ACL 2024">
              Ahmadian et al., Eq. 7
            </Cite>
          </Box>
          <Box variant="p">
            A baseline that does not depend on the sampled response leaves the expected update
            unchanged, because the term it subtracts averages to zero, and it can have a large effect
            on the variance{' '}
            <Cite tier={3} href={SB} venue="textbook">
              Sutton and Barto, Section 13.4
            </Cite>
            . The first property holds for any such baseline. The variance cut depends on the choice:
            it comes from a baseline that tracks the reward the attempt was likely to get, such as an
            estimate of the expected reward from the attempt&apos;s starting point{' '}
            <Cite tier={3} href={SB} venue="textbook">
              Sutton and Barto, Section 13.4
            </Cite>{' '}
            <Cite tier={3} href={AHM} venue="ACL 2024">
              Ahmadian et al., Section 2.2
            </Cite>
            .
          </Box>
          <Box variant="p">
            The difference R - b is the advantage: how much better or worse an attempt did than
            expected. Its sign sets the direction. A step along the policy gradient should make
            better-than-average actions more likely and worse-than-average actions less likely{' '}
            <Cite tier={3} href={GAE} venue="ICLR 2016">
              GAE, Section 2
            </Cite>
            , so a positive advantage pushes a response up and a negative one pushes it down. The
            diagram compares plain REINFORCE with RLOO, which takes each
            sample&apos;s baseline from the other samples for the same prompt.
          </Box>
          <BaselineWeightsDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured: four invented samples for one prompt, scored 1 for a pass and
            0 for a failure. The RLOO column is the leave-one-out arithmetic: a pass gets 1 - 1/3, a
            failure 0 - 2/3.
          </Box>
          <Box variant="p">
            With a pass-or-fail scorer and no baseline, a failure scores 0 and gets weight 0, so the
            update only pushes up the passes. That is the same as sampling from the model and
            fine-tuning on its correct answers only{' '}
            <Cite tier={3} href={RAZOR} venue="ICLR 2026">
              RL&apos;s Razor, Section 5.1
            </Cite>
            . Subtract a baseline taken from the other samples and each failure gets a negative
            weight, so its probability is pushed down. The same arithmetic gives a case to watch for:
            when every sample in the group passes, every advantage is 0 and the prompt contributes no
            gradient. Section 7, RLVR &amp; GRPO, returns to why such prompts waste the step.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Tell a critic-based trainer from a critic-free one, and see which critic setting did best on a pretrained model"
          >
            Two ways to get a baseline: learn it, or sample it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Learn it.</strong> A value function is a second network trained alongside the
            policy to predict the reward a partial response will end up with. Subtracted from the
            reward, it is a learned baseline. Applied also to the state after an action, it can stand
            in for the rewards still to come, replacing them with its own prediction; a value
            function used that way is a critic, and the method an actor-critic method{' '}
            <Cite tier={3} href={SB} venue="textbook">
              Sutton and Barto, Section 13.5
            </Cite>
            . Standing in lowers the variance and introduces bias, a systematic error that more
            samples do not average away, wherever the prediction is wrong{' '}
            <Cite tier={3} href={SB} venue="textbook">
              Sutton and Barto, Section 13.5
            </Cite>{' '}
            <Cite tier={3} href={GAE} venue="ICLR 2016">
              GAE, Section 1
            </Cite>
            . PPO, the subject of section 5, Two Leashes, trains one, and RLHF (RL from human
            feedback) papers call it the critic{' '}
            <Cite tier={3} href={AHM} venue="ACL 2024">
              Ahmadian et al., Section 1
            </Cite>
            .
          </Box>
          <Box variant="p">
            GAE (Generalized Advantage Estimation) is the dial between those two roles. Its parameter
            lambda runs from 0 to 1. At lambda = 0 a token&apos;s advantage is that token&apos;s
            reward plus the critic&apos;s estimate after it, minus the critic&apos;s estimate before
            it: low variance, and biased unless the critic is accurate. At lambda = 1 the advantage
            is the full return actually received minus the critic&apos;s baseline: unbiased however
            inaccurate the critic is, and high in variance{' '}
            <Cite tier={3} href={GAE} venue="ICLR 2016">
              GAE, Section 3, Eqs. 17-18
            </Cite>
            . Values in between set how far the advantage trusts the critic.
          </Box>
          <Box variant="p">
            With a strong pretrained model, the critic&apos;s bias was not worth it in one study (PPO
            on Llama-7B with the Anthropic Helpful and Harmless (HH) dialogue dataset). The authors
            compared lambda at 0, 0.5, 0.95 and 1: reward fell steadily as lambda decreased, and
            lambda = 1 did best{' '}
            <Cite tier={3} href={AHM} venue="ACL 2024">
              Ahmadian et al., Section 3.1, Figure 1
            </Cite>
            . Their explanation is the starting point: a pretrained model conditioned on a prompt
            already concentrates its probability on a few tokens at each step, so there is little
            variance left to buy down with bias{' '}
            <Cite tier={3} href={AHM} venue="ACL 2024">
              Ahmadian et al., Section 3
            </Cite>
            . At lambda = 1 the critic is still subtracted as a baseline; what it no longer does is
            stand in for future reward{' '}
            <Cite tier={3} href={GAE} venue="ICLR 2016">
              GAE, Eq. 18
            </Cite>{' '}
            <Cite tier={3} href={AHM} venue="ACL 2024">
              Ahmadian et al., Eq. 9
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Sample it.</strong> The other route drops the critic and builds the baseline from
            other attempts at the same prompt. RLOO draws k samples per prompt and gives each one the
            mean reward of the other k - 1 as its baseline, an estimate &quot;akin to a
            parameter-free value-function, but estimated at each training step&quot;{' '}
            <Cite tier={3} href={AHM} venue="ACL 2024">
              Ahmadian et al., Section 2.3
            </Cite>
            . GRPO uses the mean reward of the whole group as the baseline and divides by the
            group&apos;s standard deviation{' '}
            <Cite tier={3} href={DSM} venue="preprint">
              DeepSeekMath, Sections 4.1.1 and 4.1.2
            </Cite>
            . Neither trains a second network; the price is extra sampling time during training{' '}
            <Cite tier={3} href={AHM} venue="ACL 2024">
              Ahmadian et al., Section 2.3
            </Cite>
            .
          </Box>
          <Box variant="p">
            <code style={FORMULA_LINE}>RLOO:  A_i = r_i - (sum of the other k - 1 rewards) / (k - 1)</code>
            <code style={FORMULA_LINE}>GRPO:  A_i = (r_i - mean(r_1, ..., r_G)) / std(r_1, ..., r_G)</code>
          </Box>
          <Box variant="p">
            DeepSeekMath&apos;s authors give two reasons for dropping the critic: in PPO it is
            typically a model of comparable size to the policy, a substantial memory and compute
            burden, and since usually only the last token gets a reward, that may complicate
            training a critic that is accurate at every token{' '}
            <Cite tier={3} href={DSM} venue="preprint">
              DeepSeekMath, Section 4.1.1
            </Cite>
            . Section 7, RLVR &amp; GRPO, develops the group baseline and the variants that change its
            terms.
          </Box>
          <ExpandableSection headerText="The two ends of GAE, in symbols">
            <SpaceBetween size="s">
              <Box variant="p">
                GAE sums per-token residuals, each the reward for token t plus the discounted critic
                estimate after it minus the estimate before it, with weights that shrink by gamma
                times lambda per step{' '}
                <Cite tier={3} href={GAE} venue="ICLR 2016">
                  GAE, Section 3, Eq. 16
                </Cite>
                . Gamma discounts later rewards. The two ends:
              </Box>
              <Box variant="p">
                <code style={FORMULA_LINE}>delta_t = r_t + gamma * V(s_t+1) - V(s_t)</code>
                <code style={FORMULA_LINE}>lambda = 0:  A_t = delta_t</code>
                <code style={FORMULA_LINE}>lambda = 1:  A_t = (sum over l of gamma^l * r_t+l) - V(s_t)</code>
              </Box>
              <Box variant="p">
                The lambda = 1 line is the return from token t minus the critic&apos;s value, so the
                critic appears only as a baseline{' '}
                <Cite tier={3} href={GAE} venue="ICLR 2016">
                  GAE, Eq. 18
                </Cite>
                . The same case appears as the return from token t minus a learned baseline
                b(s_t), trained like a value network{' '}
                <Cite tier={3} href={AHM} venue="ACL 2024">
                  Ahmadian et al., Eq. 9
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Place SFT, REINFORCE, rejection sampling and RLOO or GRPO in one table, then read each new method by filling in its row"
          >
            One gradient, three choices
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            DeepSeekMath&apos;s unified paradigm writes SFT, rejection-sampling fine-tuning, DPO
            (Direct Preference Optimization), PPO and GRPO in one form: a gradient coefficient times
            the gradient of each token&apos;s log-probability, averaged over the tokens of each
            sample. Three components decide the rest: the data source, which determines the training
            samples; the reward function, the source of the training signal; and the algorithm,
            which turns the two into the coefficient{' '}
            <Cite tier={3} href={DSM} venue="preprint">
              DeepSeekMath, Section 5.2.1, Eq. 5
            </Cite>
            . In this dive&apos;s words: which samples, which scorer, which weight.
          </Box>
          <Box variant="p">
            <code>
              gradient = mean over (q, o) from data source D of: (1/|o|) * sum over t of GC(q, o, t)
              * grad log pi(o_t | q, o_&lt;t)
            </code>
          </Box>
          <GradientTableDiagram />
          <Box variant="small" color="text-body-secondary">
            The first four rows, from DeepSeekMath&apos;s Table 10 and Appendix A.1 and from the RLOO
            paper. Sections 5 and 6 add the PPO and DPO rows, and the full table closes section 6.
          </Box>
          <Box variant="p">
            Read the rows from the top. SFT takes fixed targets from a dataset and weights every
            token 1{' '}
            <Cite tier={3} href={DSM} venue="preprint">
              DeepSeekMath, Appendix A.1.1
            </Cite>
            . REINFORCE samples from the current model and weights each sample by its reward{' '}
            <Cite tier={3} href={AHM} venue="ACL 2024">
              Ahmadian et al., Eq. 6
            </Cite>
            . Rejection-sampling fine-tuning samples several answers per question, keeps the correct
            ones and fine-tunes on them, so its weight is 1 for a correct answer and 0 otherwise;
            DeepSeekMath&apos;s version samples from the starting SFT model, and its online version
            from the model being trained{' '}
            <Cite tier={3} href={DSM} venue="preprint">
              DeepSeekMath, Appendix A.1.2-A.1.3, Eq. 10
            </Cite>
            . RLOO and GRPO sample a group per prompt from the current model and weight each sample
            by its advantage over the group, which can be negative{' '}
            <Cite tier={3} href={AHM} venue="ACL 2024">
              Ahmadian et al., Section 2.3
            </Cite>{' '}
            <Cite tier={3} href={DSM} venue="preprint">
              DeepSeekMath, Section 4.1.2
            </Cite>
            . In both papers the scorer is a reward model{' '}
            <Cite tier={3} href={DSM} venue="preprint">
              DeepSeekMath, Table 10
            </Cite>{' '}
            <Cite tier={3} href={AHM} venue="ACL 2024">
              Ahmadian et al., Section 1
            </Cite>
            ; section 7 replaces it with a program.
            GRPO&apos;s coefficient also carries a term that pulls the model toward a frozen reference
            copy of the starting model, the KL (Kullback-Leibler divergence) penalty of section 5{' '}
            <Cite tier={3} href={DSM} venue="preprint">
              DeepSeekMath, Appendix A.1.6, Eq. 21
            </Cite>
            .
          </Box>
          <Box variant="p">
            Down the table, the rows change the two features that separate RL from SFT{' '}
            <Cite tier={3} href={RAZOR} venue="ICLR 2026">
              RL&apos;s Razor, Section 5.1
            </Cite>
            . The samples move from someone else&apos;s targets to the model&apos;s own, and then to
            fresh samples from the current model. The weight moves from 1 everywhere, to 1 or 0, to a
            signed advantage that pushes failures down.
          </Box>
          <ExpandableSection headerText="Evidence that two of the columns move results: DeepSeekMath's comparison">
            <Box variant="p">
              The authors trained DeepSeekMath-Instruct 1.3B with several rows of this table and
              evaluated on GSM8K (grade-school math word problems) and MATH (competition-level math
              problems){' '}
              <Cite tier={3} href={DSM} venue="preprint">
                DeepSeekMath, Section 5.2.1, Figure 5
              </Cite>
              . Sample source: online rejection-sampling fine-tuning, which samples from the model
              being trained, was level with the offline version early in training and clearly ahead
              later. Weight: GRPO surpassed online rejection-sampling fine-tuning, which the authors
              credit to its positive and negative coefficients; in that comparison GRPO&apos;s scorer
              also differed, a reward model trained on the rule&apos;s judgments where online
              rejection sampling used the rule itself. One model size and two math benchmarks:
              evidence from one study that the sample-source and weight columns move the result;
              the scorer column was not isolated.
            </Box>
          </ExpandableSection>
          <Box variant="p">
            Use the table as a reading frame for the rest of the dive. When section 5 introduces PPO,
            section 6 DPO and section 7 the GRPO variants, fill in the three columns before reading
            the loss: where the samples come from, what scores them, and how the score becomes the
            weight. Then place your own pipeline on it. If you fine-tune on filtered outputs of your
            own model, you are on the rejection-sampling row, with a weight of 1 or 0; the two moves
            down the table are sampling from the current model each round and giving failures a
            negative weight.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
