import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import { Cite, arxiv, gh, researchUrl, E0_URL, TRL_TAG } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

const PPO = arxiv('1707.06347v2');
const TRPO = arxiv('1502.05477v5');
const INSTRUCTGPT = arxiv('2203.02155v1');
const GAO = arxiv('2210.10760v1');
const BACK_TO_BASICS = arxiv('2402.14740v2');
const DEEPSEEKMATH = arxiv('2402.03300v3');
const BEDROCK_RFT = 'https://docs.aws.amazon.com/bedrock/latest/userguide/rft-submit-job.html';
const E0_RUN1 = researchUrl('2026-10/E0-spark-smoke/run1/logs.jsonl');
const E0_RUN2 = researchUrl('2026-10/E0-spark-smoke/run2/logs.jsonl');

function trl(path: string, lines: string): string {
  return gh('huggingface/trl', TRL_TAG, `trl/trainer/${path}`, lines);
}

/* ------------------------------------------------------------------------ */
/* Diagram: the two leashes                                                 */
/* ------------------------------------------------------------------------ */

function TwoLeashesDiagram() {
  const trail: Array<[number, number]> = [
    [244, 150],
    [306, 145],
    [368, 139],
    [430, 133],
    [492, 127],
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 372"
        role="img"
        aria-labelledby="leashes-two-title"
        aria-describedby="leashes-two-desc"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="leashes-two-title">
          The two leashes of an RL trainer measure from different places. PPO&apos;s clip is a
          short leash around the policy that sampled the current batch: an update stops being
          rewarded once a token&apos;s probability ratio leaves 1 plus or minus epsilon, and the
          leash moves on to the new policy with every batch. The KL penalty is a long leash from
          the frozen starting model, the reference, to the current policy: it measures how far the
          whole run has travelled and never resets.
        </title>
        <desc id="leashes-two-desc">
          Clip: measured from the policy that sampled the batch, lasts one batch, acts on each
          token&apos;s weight in the gradient, set by epsilon (0.2 in the PPO paper and in TRL),
          and does work only when one batch feeds two or more updates. KL penalty: measured from
          the frozen starting model, lasts the whole run, acts on the reward in PPO or on the loss
          in GRPO, set by beta (0.02 in InstructGPT, 0 by default in TRL&apos;s GRPO trainer, which
          then loads no reference model).
        </desc>
        <style>{`
          .leashes-two-ref { fill: #f4f4f4; stroke: #414d5c; stroke-width: 1.5; }
          .leashes-two-zone { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; stroke-dasharray: 5 4; }
          .leashes-two-pa { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .leashes-two-pb { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .leashes-two-trail { stroke: #879596; stroke-width: 1.5; fill: none; }
          .leashes-two-kl { stroke: #8b6c00; stroke-width: 2; fill: none; stroke-dasharray: 7 5; }
          .leashes-two-step { stroke: #0972d3; stroke-width: 2; fill: none; }
          .leashes-two-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .leashes-two-tl { fill: #16191f; font: 600 13px sans-serif; }
          .leashes-two-s { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .leashes-two-sl { fill: #16191f; font: 11px sans-serif; }
          .leashes-two-lbl { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .leashes-two-clip { fill: #065299; font: 600 12px sans-serif; }
          .leashes-two-clips { fill: #065299; font: 11px sans-serif; }
          .leashes-two-klt { fill: #6b5300; font: 600 12px sans-serif; text-anchor: middle; }
          .leashes-two-kls { fill: #6b5300; font: 11px sans-serif; text-anchor: middle; }
          .leashes-two-pi { fill: #0f1b2a; font: 600 11px sans-serif; text-anchor: middle; }
        `}</style>
        <defs>
          <marker
            id="leashes-two-ah"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#0972d3" />
          </marker>
        </defs>

        <rect x={0} y={0} width={860} height={372} rx={8} fill="#ffffff" />

        <text x={373} y={62} className="leashes-two-klt">
          KL leash: distance of the whole run
        </text>
        <text x={373} y={78} className="leashes-two-kls">
          from the starting model, priced by β
        </text>

        {/* Reference model */}
        <rect x={20} y={92} width={180} height={84} rx={6} className="leashes-two-ref" />
        <text x={110} y={122} className="leashes-two-t">
          Reference model
        </text>
        <text x={110} y={142} className="leashes-two-s">
          frozen copy of the
        </text>
        <text x={110} y={158} className="leashes-two-s">
          starting model, π_ref
        </text>

        {/* Earlier policies, one per batch */}
        <path
          d={`M200,152 ${trail.map(([x, y]) => `L${x},${y}`).join(' ')} L538,122`}
          className="leashes-two-trail"
        />
        {trail.map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r={6} fill="#879596" />
        ))}
        <text x={368} y={112} className="leashes-two-lbl">
          the policy after each earlier batch
        </text>

        {/* The clip zone around the sampling policy */}
        <circle cx={590} cy={120} r={52} className="leashes-two-zone" />
        <path d="M596,115 L616,99" className="leashes-two-step" markerEnd="url(#leashes-two-ah)" />

        {/* The KL leash: from the reference model to the current policy, drawn over the zone */}
        <path d="M110,92 Q380,-40 624,87" className="leashes-two-kl" />
        <circle cx={110} cy={92} r={4} fill="#8b6c00" />
        <circle cx={590} cy={120} r={7} fill="#0972d3" />
        <circle cx={624} cy={94} r={7} fill="#ffffff" stroke="#0972d3" strokeWidth={2} />
        <text x={590} y={148} className="leashes-two-pi">
          π_old
        </text>
        <text x={642} y={98} className="leashes-two-pi" style={{ textAnchor: 'start' }}>
          π_new
        </text>
        <text x={666} y={128} className="leashes-two-clip">
          Clip zone around π_old
        </text>
        <text x={666} y={146} className="leashes-two-clips">
          updates stop paying once a
        </text>
        <text x={666} y={162} className="leashes-two-clips">
          token&apos;s ratio leaves 1 ± ε;
        </text>
        <text x={666} y={178} className="leashes-two-clips">
          π_new is the next batch&apos;s π_old
        </text>

        {/* Panel A: the clip */}
        <rect x={20} y={212} width={400} height={146} rx={6} className="leashes-two-pa" />
        <text x={36} y={238} className="leashes-two-tl">
          Clip (PPO): a speed limit
        </text>
        <text x={36} y={262} className="leashes-two-sl">
          From: the policy that sampled this batch
        </text>
        <text x={36} y={280} className="leashes-two-sl">
          Lasts: one batch, then the reference point moves
        </text>
        <text x={36} y={298} className="leashes-two-sl">
          Acts on: each token&apos;s weight in the gradient
        </text>
        <text x={36} y={316} className="leashes-two-sl">
          Knob: epsilon, 0.2 in the PPO paper and in TRL
        </text>
        <text x={36} y={334} className="leashes-two-sl">
          Works only when one batch feeds 2+ updates
        </text>

        {/* Panel B: the KL penalty */}
        <rect x={440} y={212} width={400} height={146} rx={6} className="leashes-two-pb" />
        <text x={456} y={238} className="leashes-two-tl">
          KL penalty: a tether
        </text>
        <text x={456} y={262} className="leashes-two-sl">
          From: the frozen starting model (reference)
        </text>
        <text x={456} y={280} className="leashes-two-sl">
          Lasts: the whole run; it never resets
        </text>
        <text x={456} y={298} className="leashes-two-sl">
          Acts on: the reward (PPO) or the loss (GRPO)
        </text>
        <text x={456} y={316} className="leashes-two-sl">
          Knob: beta, 0.02 in InstructGPT, 0 in TRL GRPO
        </text>
        <text x={456} y={334} className="leashes-two-sl">
          beta 0: TRL loads no reference model
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Chart: policy entropy on our E0 run                                      */
/* ------------------------------------------------------------------------ */

// TRL `entropy` per step, read from research/2026-10/E0-spark-smoke/run{1,2}/logs.jsonl.
const E0_ENTROPY_RUN1 = [
  0.2361, 0.2609, 0.1925, 0.2827, 0.2609, 0.2295, 0.234, 0.2092, 0.234, 0.2161, 0.2275, 0.2397,
  0.2435, 0.2511, 0.2574, 0.2795, 0.2087, 0.2201, 0.2074, 0.2203,
];
const E0_ENTROPY_RUN2 = [
  0.2361, 0.2609, 0.1925, 0.2827, 0.2609, 0.2295, 0.234, 0.2092, 0.2549, 0.2069, 0.2352, 0.2279,
  0.3174, 0.2789, 0.2156, 0.2553, 0.2127, 0.218, 0.2101, 0.2192,
];

function EntropyChart() {
  const x0 = 80;
  const x1 = 820;
  const yTop = 50;
  const yBase = 250;
  const yMax = 0.4;
  const sx = (step: number) => x0 + ((step - 1) * (x1 - x0)) / 19;
  const sy = (v: number) => yBase - (v / yMax) * (yBase - yTop);
  const line = (vals: number[]) =>
    vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${sx(i + 1).toFixed(1)},${sy(v).toFixed(1)}`).join(' ');
  const yTicks = [0, 0.1, 0.2, 0.3, 0.4];
  const xTicks = [1, 5, 10, 15, 20];
  const blue = '#0972d3';
  const orange = '#c9590b';
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 300"
        role="img"
        aria-labelledby="leashes-entropy-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="leashes-entropy-title">
          Policy entropy on our 20-step GRPO smoke test on a DGX Spark, two runs with the same
          seed. TRL&apos;s mean per-token entropy stays between 0.19 and 0.32 at every step and
          wanders with no trend. The two runs match for steps 1 to 8 and separate after that.
        </title>
        <rect x={0} y={0} width={860} height={300} rx={8} fill="#ffffff" />

        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={x0}
              x2={x1}
              y1={sy(t)}
              y2={sy(t)}
              stroke={t === 0 ? '#879596' : '#e9ebed'}
              strokeWidth={1}
            />
            <text
              x={x0 - 10}
              y={sy(t) + 4}
              fill="#5f6b7a"
              fontSize={11}
              fontFamily="sans-serif"
              textAnchor="end"
            >
              {t.toFixed(1)}
            </text>
          </g>
        ))}
        {xTicks.map((s) => (
          <text
            key={s}
            x={sx(s)}
            y={yBase + 18}
            fill="#5f6b7a"
            fontSize={11}
            fontFamily="sans-serif"
            textAnchor="middle"
          >
            {s}
          </text>
        ))}
        <text
          x={(x0 + x1) / 2}
          y={292}
          fill="#414d5c"
          fontSize={11}
          fontFamily="sans-serif"
          textAnchor="middle"
        >
          Training step
        </text>
        <text x={x0} y={28} fill="#16191f" fontSize={12} fontWeight={600} fontFamily="sans-serif">
          Mean per-token entropy (TRL entropy metric)
        </text>

        {/* Legend */}
        <line x1={600} x2={630} y1={24} y2={24} stroke={blue} strokeWidth={2} />
        <circle cx={615} cy={24} r={4} fill={blue} />
        <text x={638} y={28} fill="#16191f" fontSize={11} fontFamily="sans-serif">
          Run 1
        </text>
        <line
          x1={700}
          x2={730}
          y1={24}
          y2={24}
          stroke={orange}
          strokeWidth={2}
          strokeDasharray="6 4"
        />
        <rect x={711} y={20} width={8} height={8} fill={orange} />
        <text x={738} y={28} fill="#16191f" fontSize={11} fontFamily="sans-serif">
          Run 2
        </text>

        {/* Run 1 first, run 2 dashed on top so the shared steps show both */}
        <path d={line(E0_ENTROPY_RUN1)} stroke={blue} strokeWidth={2} fill="none" />
        {E0_ENTROPY_RUN1.map((v, i) => (
          <circle key={`r1-${i}`} cx={sx(i + 1)} cy={sy(v)} r={4} fill={blue} />
        ))}
        <path
          d={line(E0_ENTROPY_RUN2)}
          stroke={orange}
          strokeWidth={2}
          strokeDasharray="6 4"
          fill="none"
        />
        {E0_ENTROPY_RUN2.map((v, i) => (
          <rect
            key={`r2-${i}`}
            x={sx(i + 1) - 3}
            y={sy(v) - 3}
            width={6}
            height={6}
            fill={orange}
          />
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* The gradient table with its PPO row                                      */
/* ------------------------------------------------------------------------ */

interface GradientRow {
  id: string;
  method: string;
  isNew: boolean;
  source: string;
  scorer: string;
  weight: string;
}

const GRADIENT_ROWS: GradientRow[] = [
  {
    id: 'sft',
    method: 'SFT',
    isNew: false,
    source: 'Fixed targets from a dataset',
    scorer: 'None',
    weight: '1 for every target token',
  },
  {
    id: 'reinforce',
    method: 'REINFORCE',
    isNew: false,
    source: "The current policy's own samples",
    scorer: 'Any reward',
    weight: 'The reward that followed',
  },
  {
    id: 'rsft',
    method: 'Rejection-sampling fine-tuning',
    isNew: false,
    source: "The model's own samples",
    scorer: 'A grader that passes or fails each one',
    weight: '1 if it passed, 0 if not',
  },
  {
    id: 'grpo',
    method: 'RLOO or GRPO',
    isNew: false,
    source: 'Several samples per prompt from the current policy',
    scorer: 'A reward model or a program',
    weight: 'The reward relative to the other samples of the same prompt',
  },
  {
    id: 'ppo',
    method: 'PPO',
    isNew: true,
    source: "The current policy's own samples, one batch at a time",
    scorer: 'A reward model, minus a per-token KL penalty to the reference model',
    weight:
      'The advantage from a learned critic (GAE), times the probability ratio clipped to 1 ± epsilon',
  },
];

function GradientTable() {
  return (
    <Table
      variant="embedded"
      wrapLines
      trackBy="id"
      items={GRADIENT_ROWS}
      columnDefinitions={[
        {
          id: 'method',
          header: 'Method',
          cell: (r) =>
            r.isNew ? (
              <>
                <Box variant="strong" display="inline">
                  {r.method}
                </Box>{' '}
                <Badge color="blue">added here</Badge>
              </>
            ) : (
              r.method
            ),
        },
        { id: 'source', header: 'Sample source', cell: (r) => r.source },
        { id: 'scorer', header: 'Scorer', cell: (r) => r.scorer },
        { id: 'weight', header: 'Weight on the log-probability gradient', cell: (r) => r.weight },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function TwoLeashes() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="What each of the two limits on a training update holds back, which config knob sets it, and the curves that show it on a run or a managed job (TRL v1.16.0 and papers read 2026-10-30)"
          >
            5. Two Leashes: PPO&apos;s Clip &amp; the KL
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Policy gradient (section 4, Policy Gradient) tells an RL (reinforcement learning)
            trainer which way to move the policy, the model read as a probability distribution
            over next tokens: toward attempts with a positive advantage (they scored better than
            expected) and away from attempts with a negative one. It says nothing about how far.
            Two leashes supply the limit, and this section shows what each holds back, which knob
            sets it and where to watch it.
          </Box>
          <Box variant="p">
            The two leashes measure from different places. The clip of PPO
            (Proximal Policy Optimization) limits how far one update is rewarded for moving each
            token&apos;s probability away from the policy that sampled the current batch, and that
            reference point moves on with every batch. The KL (Kullback-Leibler divergence, a measure of how
            far one probability distribution has moved from another) penalty charges for distance
            from the reference model, a frozen copy of the model the run started from, and that
            reference point never moves{' '}
            <Cite tier={3} href={GAO} venue="ICML 2023">
              Gao et al., Section 3.6
            </Cite>
            . The clip is a speed limit; the KL penalty is a tether. In TRL (Transformers
            Reinforcement Learning, Hugging Face&apos;s post-training library) the two sit side by
            side as two small numbers: its GRPO (Group Relative Policy Optimization) trainer ships
            with <code>epsilon</code> 0.2 for the clip and <code>beta</code> 0.0 for the KL{' '}
            <Cite tier={1} href={trl('grpo_config.py', 'L681-L696')}>
              TRL grpo_config.py L681-L696
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See why reusing one batch of samples for several updates is where a policy gets wrecked"
          >
            Samples go stale as soon as the policy moves
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A batch of rollouts (attempts from prompt to reward) is evidence about the policy that
            sampled it. The first gradient step on that batch uses fresh evidence. Every further
            step on the same batch uses evidence about a policy that no longer exists. Reusing the
            batch is tempting because sampling is the expensive part of a step: on our own 0.5B
            run on a DGX Spark, generation took about 62% of step time{' '}
            <Cite tier={0} href={E0_URL}>
              E0 log: GRPO smoke test on a DGX Spark
            </Cite>
            . The PPO authors found that several optimisation steps on the plain policy-gradient
            loss with one batch &quot;often leads to destructively large policy updates&quot;{' '}
            <Cite tier={3} href={PPO} venue="preprint">
              PPO paper, Section 2.1
            </Cite>
            .
          </Box>
          <Box variant="p">
            TRPO (Trust Region Policy Optimization) met this with a trust region: maximise the
            improvement subject to a cap on the KL divergence between the new policy and the old
            one{' '}
            <Cite tier={3} href={TRPO} venue="ICML 2015">
              TRPO paper, Section 4
            </Cite>
            . PPO keeps the idea and replaces the hard cap with a clipped probability ratio inside
            the loss{' '}
            <Cite tier={3} href={PPO} venue="preprint">
              PPO paper, Section 3
            </Cite>
            . RLHF (RL from human feedback) adds the second leash, to the starting model, for a
            different reason, covered after the clip.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Tell the clip and the KL apart at a glance: where each is measured from, how long it lasts, and which knob sets it"
          >
            Two leashes, two reference points
          </Header>
        }
      >
        <SpaceBetween size="m">
          <TwoLeashesDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic, not to scale. The values in the panels are the defaults cited in this
            section; π_ref is the reference model, π_old the policy that sampled the batch, π_new
            the policy after the update.
          </Box>
          <Box variant="p">
            The two leashes interact. The clip controls how fast the policy changes, and in a
            well-tuned implementation that also makes the KL to the starting model grow much more
            slowly{' '}
            <Cite tier={3} href={GAO} venue="ICML 2023">
              Gao et al., Section 3.6
            </Cite>
            . A run with a clip and no KL penalty still drifts from its start, only more slowly.
            Each knob answers its own question: <code>epsilon</code>, how hard one batch may push;{' '}
            <code>beta</code>, how much the whole journey costs.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read epsilon as the point where an update stops being rewarded, and know when it does any work at all"
          >
            The clip: PPO stops paying for moves past 20%
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            PPO compares each token&apos;s probability under the policy being trained with its
            probability under the policy that sampled it,{' '}
            <code>ratio = pi_new(token) / pi_old(token)</code>, and takes the smaller of two terms:{' '}
            <code>min(ratio * A, clip(ratio, 1 - eps, 1 + eps) * A)</code>, where <code>A</code> is
            the token&apos;s advantage and <code>eps</code> is 0.2 in the paper{' '}
            <Cite tier={3} href={PPO} venue="preprint">
              PPO paper, Section 3, Eq. 7
            </Cite>
            .
          </Box>
          <Box variant="p">
            For a token with a positive advantage, the objective stops rising once the ratio passes
            1.2, a 20% move, so the gradient no longer pushes its probability further up. For a
            token with a negative advantage, the same happens below 0.8. The ratio can still move
            past those bounds; the gradient just stops pushing it there. The cut is one-sided: PPO
            ignores a change only when it would make the objective look better, and always counts
            a change that makes it worse{' '}
            <Cite tier={3} href={PPO} venue="preprint">
              PPO paper, Section 3
            </Cite>
            .
          </Box>
          <Box variant="p">
            The 0.2 comes from robot control. PPO&apos;s ablation ran seven simulated robotics
            tasks (MuJoCo physics engine, one million timesteps, three seeds each): epsilon 0.2
            scored 0.82 on the normalised average, against 0.76 at 0.1 and 0.70 at 0.3, and running
            with no clipping or penalty scored -0.39{' '}
            <Cite tier={3} href={PPO} venue="preprint">
              PPO paper, Section 6.1, Table 1
            </Cite>
            . Language-model trainers kept the value: TRL&apos;s GRPO default is 0.2{' '}
            <Cite tier={1} href={trl('grpo_config.py', 'L693-L696')}>
              TRL grpo_config.py L693-L696
            </Cite>
            .
          </Box>
          <Box variant="p">
            On language models the clip rarely binds. In one RLHF study on 6.9B and 7B models, the
            loss was clipped on average under 5% of the time per batch, and removing the clip gave,
            if anything, a slight boost{' '}
            <Cite tier={3} href={BACK_TO_BASICS} venue="ACL 2024">
              Ahmadian et al., Section 3.2
            </Cite>
            .
          </Box>
          <Box variant="p">
            It does no work at all when each batch feeds a single update. With one update after
            each round of sampling, the old and new policies are the same at the moment the
            gradient is taken, the ratio is 1, and the min and the clip drop out of PPO&apos;s
            objective{' '}
            <Cite tier={3} href={DEEPSEEKMATH} venue="preprint">
              DeepSeekMath, Appendix A.1.5
            </Cite>
            . That is TRL&apos;s default: <code>num_iterations</code>, the number of updates per
            batch, is 1{' '}
            <Cite tier={1} href={trl('grpo_config.py', 'L689-L692')}>
              TRL grpo_config.py L689-L692
            </Cite>
            , and the &quot;old&quot; log-probabilities in the ratio then come from the same
            weights that are being updated (our reading of the code){' '}
            <Cite tier={1} href={trl('grpo_trainer.py', 'L2634-L2655')} kind="code">
              TRL grpo_trainer.py L2634-L2655
            </Cite>{' '}
            <Cite tier={1} href={trl('grpo_trainer.py', 'L3060-L3066')} kind="code">
              TRL grpo_trainer.py L3060-L3066
            </Cite>
            . On our own 20-step GRPO run with those defaults, TRL&apos;s clip metric{' '}
            <code>clip_ratio/region_mean</code> read 0.0 at every step of both runs{' '}
            <Cite tier={0} href={E0_RUN1}>
              E0 run 1 metrics log
            </Cite>{' '}
            <Cite tier={0} href={E0_RUN2}>
              E0 run 2 metrics log
            </Cite>
            . Epsilon starts to matter when you reuse a batch: <code>num_iterations</code> above 1,
            or <code>steps_per_generation</code> above <code>gradient_accumulation_steps</code>,
            which spreads one batch over several optimizer steps (our reading of the code){' '}
            <Cite tier={1} href={trl('grpo_config.py', 'L528-L531')}>
              TRL grpo_config.py L528-L531
            </Cite>{' '}
            <Cite tier={1} href={trl('grpo_trainer.py', 'L2634-L2644')} kind="code">
              TRL grpo_trainer.py L2634-L2644
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="What TRL counts as clipped, and the other ratio in its logs">
            <SpaceBetween size="s">
              <Box variant="p">
                TRL counts a token as clipped when its ratio is below <code>1 - epsilon</code> with
                a negative advantage, or above <code>1 + epsilon</code> with a positive one: the two
                cases where the clip removes the gradient. It logs the low side, the high side and
                their union, <code>clip_ratio/region_mean</code>{' '}
                <Cite tier={1} href={trl('grpo_trainer.py', 'L3272-L3279')} kind="code">
                  TRL grpo_trainer.py L3272-L3279
                </Cite>
                .
              </Box>
              <Box variant="p">
                The same logs carry a second ratio, <code>sampling/importance_sampling_ratio</code>
                , which reached 2.80 and 2.86 on our two runs while the clip metric stayed at 0.0.
                It corrects a different gap: vLLM and the trainer assign slightly different
                probabilities to the same tokens under the same weights{' '}
                <Cite tier={0} href={E0_URL}>
                  E0 log: GRPO smoke test on a DGX Spark
                </Cite>
                . Section 19, An RL Step Is an Inference Job Inside a Training Job, covers that
                correction.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Set beta knowing what the tether has been shown to protect, what it has not, and what it costs in memory"
          >
            The KL penalty: a tether to the starting model
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            InstructGPT&apos;s RL objective is the reward minus <code>beta</code> times the
            per-token log-ratio between the policy and the SFT (supervised fine-tuning) model the
            run started from, plus an optional term on pretraining data, with beta 0.02{' '}
            <Cite tier={3} href={INSTRUCTGPT} venue="NeurIPS 2022">
              InstructGPT, Section 3.5 and Appendix C.4
            </Cite>
            . The penalty sits in the reward at every token, to keep the policy from
            over-optimising the reward model, an imperfect stand-in for human judgement. GRPO moves it out of the reward and adds the KL to
            the loss directly{' '}
            <Cite tier={3} href={DEEPSEEKMATH} venue="preprint">
              DeepSeekMath, Section 4.1.1
            </Cite>
            .
          </Box>
          <Box variant="p">
            Three results show what the tether does and does not protect, and they are what sets
            the knob.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              General skills.
            </Box>{' '}
            In a 1.3B ablation, a KL coefficient 100x larger did not fix the regressions on SQuADv2
            and DROP (two reading-comprehension benchmarks) and cost validation reward; mixing
            pretraining data into the RL updates did fix them. In the main InstructGPT models the
            mix reduced those regressions without removing them{' '}
            <Cite tier={3} href={INSTRUCTGPT} venue="NeurIPS 2022">
              InstructGPT, Appendix E.6 and Sections 4.2 and 5.4
            </Cite>
            .
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              Over-optimisation.
            </Box>{' '}
            In a synthetic study, where a fixed 6B &quot;gold&quot; reward model stood in for human
            raters, the KL penalty acted like early stopping: the gold score converged earlier, and
            the best gold score reachable at a given KL from the start did not improve. The authors
            flag the result as possibly sensitive to hyperparameters{' '}
            <Cite tier={3} href={GAO} venue="ICML 2023">
              Gao et al., Sections 1 and 3.6
            </Cite>
            .
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              Memory.
            </Box>{' '}
            TRL&apos;s GRPO trainer (v1.16.0) defaults to beta 0 and then does not load a reference
            model{' '}
            <Cite tier={1} href={trl('grpo_config.py', 'L681-L688')}>
              TRL grpo_config.py L681-L688
            </Cite>{' '}
            <Cite tier={1} href={trl('grpo_trainer.py', 'L983-L986')}>
              TRL grpo_trainer.py L983-L986
            </Cite>
            ; its RLOO (REINFORCE Leave-One-Out) trainer in the same release defaults to 0.05{' '}
            <Cite tier={1} href={trl('rloo_config.py', 'L502-L508')}>
              TRL rloo_config.py L502-L508
            </Cite>
            . When the policy is an adapter such as LoRA (Low-Rank Adaptation), TRL recovers the
            starting model by switching the adapter off, so a beta above 0 costs no second copy
            of the model (our reading of the code){' '}
            <Cite tier={1} href={trl('grpo_trainer.py', 'L987-L990')} kind="code">
              TRL grpo_trainer.py L987-L990
            </Cite>{' '}
            <Cite tier={1} href={trl('grpo_trainer.py', 'L2722-L2737')} kind="code">
              TRL grpo_trainer.py L2722-L2737
            </Cite>
            .
          </Box>
          <Box variant="p">
            Our reading of these results: beta sets how far a run may travel from where it started
            and charges reward for the distance. In InstructGPT&apos;s 1.3B ablation, keeping
            general skills took pretraining data in the mix, which a tighter tether did not
            provide.
          </Box>
          <ExpandableSection headerText="The settings behind each result">
            <SpaceBetween size="s">
              <Box variant="p">
                InstructGPT&apos;s ablation raised the KL reward coefficient to 2.0, &quot;100 times
                of the default value&quot;, and the regressions &quot;still cannot be fixed&quot;;
                a pretraining loss coefficient of 20 or more recovered them on the 1.3B model. In
                the main results the PPO-ptx model (PPO with the pretraining mix) still lagged GPT-3 on
                DROP, SQuADv2 and translation{' '}
                <Cite tier={3} href={INSTRUCTGPT} venue="NeurIPS 2022">
                  InstructGPT, Section 4.2 and Appendix E.6, Figures 33 and 34
                </Cite>
                .
              </Box>
              <Box variant="p">
                Gao et al. used a fixed &quot;gold-standard&quot; reward model in place of humans,
                whose labels trained a proxy reward model, and optimised policies against the
                proxy. With a KL penalty, the gold score converged earlier, and the curve of best
                gold score against KL distance stayed where it was without the penalty{' '}
                <Cite tier={3} href={GAO} venue="ICML 2023">
                  Gao et al., abstract and Section 3.6
                </Cite>
                .
              </Box>
              <Box variant="p">
                TRL&apos;s GRPO help text for <code>beta</code> reads: &quot;If `0.0` (default),
                the reference model is not loaded, reducing memory usage and improving training
                speed.&quot;{' '}
                <Cite tier={1} href={trl('grpo_config.py', 'L681-L688')}>
                  TRL grpo_config.py L681-L688
                </Cite>
                . Section 19 sizes the models an RL step holds in memory.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Place PPO beside the four methods of section 4 and see each leash land in its own column"
          >
            PPO&apos;s row in the gradient table
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 4 read the post-training methods in this dive as one gradient shape, a weight times the
            gradient of a token&apos;s log-probability, differing in where the samples come from,
            what scores them and how the score becomes the weight{' '}
            <Cite tier={3} href={DEEPSEEKMATH} venue="preprint">
              DeepSeekMath, Section 5.2.1, Table 10
            </Cite>
            . PPO adds a row.
          </Box>
          <GradientTable />
          <Box variant="small" color="text-body-secondary">
            Rows 1 to 4 summarise section 4, where their sources are cited. Section 6, From
            Preferences to Rewards, adds the DPO (Direct Preference Optimization) row and completes
            the table.
          </Box>
          <Box variant="p">
            Each leash lands in its own column. The KL penalty changes the scorer: the reward
            model&apos;s score minus a per-token penalty for distance from the reference model{' '}
            <Cite tier={3} href={DEEPSEEKMATH} venue="preprint">
              DeepSeekMath, Section 4.1.1, Eq. 2
            </Cite>
            . The clip changes the weight: the advantage, estimated with GAE (Generalized Advantage
            Estimation) from a learned critic (a value model trained alongside the policy),
            multiplied by the clipped ratio{' '}
            <Cite tier={3} href={DEEPSEEKMATH} venue="preprint">
              DeepSeekMath, Section 4.1.1, Eq. 1
            </Cite>
            . With one update per batch the ratio is 1 and the weight is the advantage alone, which
            is how DeepSeekMath writes PPO&apos;s coefficient{' '}
            <Cite tier={3} href={DEEPSEEKMATH} venue="preprint">
              DeepSeekMath, Appendix A.1.5, Eq. 18
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Put the right curves on the dashboard before the run starts, and know which of them a managed Bedrock job shows you"
          >
            What to watch on a run
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Two curves belong on every RL dashboard, and a third matters when a batch is reused.
            The KL to the reference model shows how far the run has travelled from where it
            started. Policy
            entropy shows how much variety is left: it measures how spread out the next-token
            distribution is, and when it collapses the model samples nearly the same answer every
            time, so a group of samples has nothing left to compare (section 8, What RL Does to a
            Model, returns to it). The clip fraction, the share of tokens where the clip is active,
            shows how often the speed limit binds.
          </Box>
          <Box variant="p">
            Each curve comes with a condition. TRL logs <code>kl</code> only when beta is above 0
            and logs <code>entropy</code> at every step{' '}
            <Cite tier={1} href={trl('grpo_trainer.py', 'L3267-L3270')} kind="code">
              TRL grpo_trainer.py L3267-L3270
            </Cite>
            , so a run on GRPO&apos;s defaults has no KL curve; our own run&apos;s logs carry none{' '}
            <Cite tier={0} href={E0_RUN1}>
              E0 run 1 metrics log
            </Cite>
            .
          </Box>
          <EntropyChart />
          <Box variant="small" color="text-body-secondary">
            Measured on our DGX Spark: two 20-step runs with seed 0, Qwen2.5-0.5B-Instruct with
            full fine-tuning, TRL 1.16.0 with vLLM 0.28.0 colocated, TRL defaults beta 0.0 and
            epsilon 0.2, learning rate 1e-6, 16 completions per step (2 prompts x 8) at temperature
            1.0 on synthetic arithmetic. A mechanism test: the reward did not move and was not
            expected to.
          </Box>
          <Box variant="p">
            This is what the entropy curve looks like on a real run where nothing is being learned
            yet. TRL&apos;s mean per-token entropy stayed between 0.19 and 0.32 over the 20 steps
            and wandered with no trend{' '}
            <Cite tier={0} href={E0_URL}>
              E0 log: GRPO smoke test on a DGX Spark
            </Cite>
            ; the two runs match for steps 1 to 8 and separate after that, because sampling was
            not bit-identical between them{' '}
            <Cite tier={0} href={E0_RUN2}>
              E0 run 2 metrics log
            </Cite>
            . A step-to-step swing of that size on 16 completions says to read the trend over many
            steps, not a single point (our reading).
          </Box>
          <Box variant="p">
            On a managed job, Bedrock reinforcement fine-tuning (RFT) reports{' '}
            <code>actor/entropy</code>{' '}
            and <code>actor/pg_clipfrac</code>, the share of clipped updates, next to its reward
            statistics; no KL metric was among those listed on the monitoring page read{' '}
            <Cite tier={1} href={BEDROCK_RFT}>
              Bedrock user guide: Monitor your RFT training job
            </Cite>
            . For the clip fraction, the reference points in this section are under 5% per batch
            in one RLHF study and 0.0 on a run that takes one update per batch.
          </Box>
          <Box variant="p">
            Before a run, decide two things: whether you want the tether (in TRL, a beta above 0
            loads a reference model in full fine-tuning and turns on the KL curve), and whether
            each batch will feed more than one update (only then does epsilon act). During the run,
            watch entropy everywhere, the KL wherever beta is on, and the clip fraction whenever a
            batch is reused.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
