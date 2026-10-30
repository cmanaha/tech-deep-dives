import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import { Cite, arxiv } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

const YUE = arxiv('2504.13837v5');
const LEASH = arxiv('2507.14843v5');
const COMPOSE = arxiv('2509.25123v3');
const INTERPLAY = arxiv('2512.07783v1');
const CURRICULUM = arxiv('2606.22317v1');
const PASS_KT = arxiv('2604.14877v1');
const GURU = arxiv('2506.14965v1');
const LORA_BLOG = 'https://thinkingmachines.ai/blog/lora/';
const RAZOR = arxiv('2509.04259v1');
const ENTROPY = arxiv('2505.22617v1');
const SUBNETWORKS = arxiv('2505.11711v2');
const PATH_NOT_TAKEN = arxiv('2511.08567v1');
const SPURIOUS = arxiv('2506.10947v2');
const MEMORIZATION = arxiv('2507.10532v3');
const SAMPLING = arxiv('2510.14901v1');
const LIGHTMAN = arxiv('2305.20050v1');
const R1 = arxiv('2501.12948v2');

/* ------------------------------------------------------------------------ */
/* Diagram: schematic pass@k curves                                         */
/* ------------------------------------------------------------------------ */

// Plot frame in viewBox units. u is log k scaled to 0..1, v is pass@k in 0..1.
const PK_X0 = 80;
const PK_X1 = 680;
const PK_Y0 = 300;
const PK_YSPAN = 240;
const pkX = (u: number) => PK_X0 + u * (PK_X1 - PK_X0);
const pkY = (v: number) => PK_Y0 - v * PK_YSPAN;

// Schematic shapes only: no data behind them.
const pkBase = (u: number) => 0.15 + 0.7874 * (1 - Math.exp(-2.2 * u));
const pkRl = (u: number) => 0.45 + 0.2719 * (1 - Math.exp(-5 * u));

function pkPoints(f: (u: number) => number): string {
  const pts: string[] = [];
  for (let i = 0; i <= 60; i += 1) {
    const u = i / 60;
    pts.push(`${pkX(u).toFixed(1)},${pkY(f(u)).toFixed(1)}`);
  }
  return pts.join(' ');
}

function pkCrossing(): number {
  let lo = 0.3;
  let hi = 0.8;
  for (let i = 0; i < 50; i += 1) {
    const mid = (lo + hi) / 2;
    if (pkRl(mid) > pkBase(mid)) lo = mid;
    else hi = mid;
  }
  return lo;
}

const PK_BASE_PTS = pkPoints(pkBase);
const PK_RL_PTS = pkPoints(pkRl);
const PK_UC = pkCrossing();
const PK_XC = pkX(PK_UC);
const PK_YC = pkY(pkBase(PK_UC));
const PK_UK = 0.72;
const PK_XK = pkX(PK_UK);
const PK_YK = pkY(pkBase(PK_UK));

function PassAtKDiagram() {
  const key: Array<{ n: string; x: number; y: number; title: string; lines: [string, string] }> = [
    {
      n: '1',
      x: 24,
      y: 374,
      title: 'RL ahead at small k',
      lines: [
        'RL moved probability onto answers the base model could',
        'already sample, so one try succeeds more often.',
      ],
    },
    {
      n: '2',
      x: 444,
      y: 374,
      title: 'The curves cross',
      lines: [
        'Past this k, the same number of samples solves more',
        'problems from the base model than from the RL model.',
      ],
    },
    {
      n: '3',
      x: 24,
      y: 434,
      title: 'Base ahead at large k',
      lines: [
        'The base model still reaches problems the RL model',
        'has stopped sampling: RL narrowed its coverage.',
      ],
    },
    {
      n: '4',
      x: 444,
      y: 434,
      title: 'Best-of-K ceiling',
      lines: [
        'A perfect verifier picking from K base samples succeeds',
        "exactly when one is right, so the base's pass@K caps it.",
      ],
    },
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 484"
        role="img"
        aria-labelledby="wrd-passk-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="wrd-passk-title">
          Schematic pass@k curves for a base model and the same model after RL, plotted against the
          number of samples k on a log scale. The RL curve starts higher at k = 1 and flattens; the
          base curve starts lower, keeps rising and crosses above the RL curve at large k. A dashed
          line marks the best-of-K ceiling: the base model&apos;s pass@K, which picking the best of K
          base samples reaches only with a perfect verifier.
        </title>
        <style>{`
          .wrd-passk-axis { stroke: #414d5c; stroke-width: 1.5; fill: none; }
          .wrd-passk-base { stroke: #414d5c; stroke-width: 3; fill: none; }
          .wrd-passk-rl { stroke: #0972d3; stroke-width: 3; fill: none; }
          .wrd-passk-ceil { stroke: #8b6c00; stroke-width: 1.5; stroke-dasharray: 6 4; fill: none; }
          .wrd-passk-div { stroke: #879596; stroke-width: 1.2; stroke-dasharray: 4 4; fill: none; }
          .wrd-passk-gap { stroke: #16191f; stroke-width: 1.2; fill: none; }
          .wrd-passk-num { fill: #ffffff; stroke: #414d5c; stroke-width: 1.2; }
          .wrd-passk-numt { fill: #16191f; font: 600 11px sans-serif; text-anchor: middle; }
          .wrd-passk-lb { fill: #414d5c; font: 600 13px sans-serif; }
          .wrd-passk-lr { fill: #065299; font: 600 13px sans-serif; }
          .wrd-passk-lc { fill: #6b5300; font: 600 11px sans-serif; }
          .wrd-passk-ax { fill: #5f6b7a; font: 11px sans-serif; }
          .wrd-passk-kt { fill: #16191f; font: 600 12px sans-serif; }
          .wrd-passk-ks { fill: #414d5c; font: 11px sans-serif; }
        `}</style>
        <defs>
          <marker
            id="wrd-passk-ah"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#414d5c" />
          </marker>
          <marker
            id="wrd-passk-gh"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill="#16191f" />
          </marker>
        </defs>

        <rect x={0} y={0} width={860} height={484} rx={8} fill="#ffffff" />

        {/* Axes */}
        <path d={`M${PK_X0},${PK_Y0} L${PK_X0},44`} className="wrd-passk-axis" markerEnd="url(#wrd-passk-ah)" />
        <path d={`M${PK_X0},${PK_Y0} L${PK_X1 + 16},${PK_Y0}`} className="wrd-passk-axis" markerEnd="url(#wrd-passk-ah)" />
        <text x={46} y={180} className="wrd-passk-ax" textAnchor="middle" transform="rotate(-90 46 180)">
          pass@k: share of problems solved
        </text>
        <text x={PK_X0} y={318} className="wrd-passk-ax" textAnchor="middle">
          k = 1
        </text>
        <text x={PK_X1} y={318} className="wrd-passk-ax" textAnchor="end">
          larger k
        </text>
        <text x={380} y={338} className="wrd-passk-ax" textAnchor="middle">
          Samples drawn per problem, k (log scale)
        </text>

        {/* Best-of-K ceiling on the base curve */}
        <path d={`M${PK_X0},${PK_YK.toFixed(1)} L${PK_XK.toFixed(1)},${PK_YK.toFixed(1)}`} className="wrd-passk-ceil" />
        <text x={112} y={(PK_YK - 9).toFixed(1)} className="wrd-passk-lc">
          Best-of-K ceiling: the base model&apos;s pass@K
        </text>
        <circle cx={96} cy={(PK_YK - 13).toFixed(1)} r={9} className="wrd-passk-num" />
        <text x={96} y={(PK_YK - 9).toFixed(1)} className="wrd-passk-numt">
          4
        </text>

        {/* Divider at the crossing */}
        <path d={`M${PK_XC.toFixed(1)},${(PK_YC + 10).toFixed(1)} L${PK_XC.toFixed(1)},${PK_Y0}`} className="wrd-passk-div" />

        {/* Curves */}
        <polyline points={PK_BASE_PTS} className="wrd-passk-base" />
        <polyline points={PK_RL_PTS} className="wrd-passk-rl" />
        <text x={PK_X1 + 10} y={101} className="wrd-passk-lb">
          Base model
        </text>
        <text x={PK_X1 + 10} y={132} className="wrd-passk-lr">
          After RL
        </text>

        {/* Crossing point */}
        <circle cx={PK_XC.toFixed(1)} cy={PK_YC.toFixed(1)} r={5} fill="#16191f" />
        <circle cx={(PK_XC + 18).toFixed(1)} cy={168} r={9} className="wrd-passk-num" />
        <text x={(PK_XC + 18).toFixed(1)} y={172} className="wrd-passk-numt">
          2
        </text>

        {/* K point on the base curve */}
        <path
          d={`M${PK_XK.toFixed(1)},${(PK_YK - 7).toFixed(1)} L${(PK_XK + 7).toFixed(1)},${PK_YK.toFixed(1)} L${PK_XK.toFixed(1)},${(PK_YK + 7).toFixed(1)} L${(PK_XK - 7).toFixed(1)},${PK_YK.toFixed(1)} Z`}
          fill="#8b6c00"
        />
        <text x={PK_XK.toFixed(1)} y={(PK_YK - 13).toFixed(1)} className="wrd-passk-lc" textAnchor="middle">
          K
        </text>

        {/* Gap at k = 1 */}
        <path d="M90,193 L90,251" className="wrd-passk-gap" markerStart="url(#wrd-passk-gh)" markerEnd="url(#wrd-passk-gh)" />
        <circle cx={110} cy={214} r={9} className="wrd-passk-num" />
        <text x={110} y={218} className="wrd-passk-numt">
          1
        </text>

        {/* Gap at large k */}
        <path d="M664,102 L664,122" className="wrd-passk-gap" markerStart="url(#wrd-passk-gh)" markerEnd="url(#wrd-passk-gh)" />
        <circle cx={664} cy={150} r={9} className="wrd-passk-num" />
        <text x={664} y={154} className="wrd-passk-numt">
          3
        </text>

        {/* Key */}
        {key.map((k) => (
          <g key={k.n}>
            <circle cx={k.x + 12} cy={k.y} r={9} className="wrd-passk-num" />
            <text x={k.x + 12} y={k.y + 4} className="wrd-passk-numt">
              {k.n}
            </text>
            <text x={k.x + 30} y={k.y + 4} className="wrd-passk-kt">
              {k.title}
            </text>
            <text x={k.x + 30} y={k.y + 21} className="wrd-passk-ks">
              {k.lines[0]}
            </text>
            <text x={k.x + 30} y={k.y + 36} className="wrd-passk-ks">
              {k.lines[1]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Table: buying sharpening back per query                                  */
/* ------------------------------------------------------------------------ */

interface BuyBackRow {
  route: string;
  needs: string;
  perQuery: string;
  scope: string;
}

const BUY_BACK: BuyBackRow[] = [
  {
    route: 'Best-of-K with a verifier',
    needs: 'A checker or a learned reward model, at serving time',
    perQuery: 'K samples and K verifier calls',
    scope: "Capped by the base model's pass@K",
  },
  {
    route: 'Power sampling',
    needs: 'Only the base model',
    perQuery: "About 8.84 times the tokens, in the paper's MATH-500 setting",
    scope: 'Tested on Qwen2.5-Math-7B, Qwen2.5-7B and Phi-3.5-mini-instruct',
  },
  {
    route: 'Trigger prompt',
    needs: 'A fixed opening phrase',
    perQuery: 'A few extra tokens',
    scope: 'Helped Qwen2.5-Math and Qwen2.5-1.5B; hurt Llama, OLMo2 and Qwen2.5-7B',
  },
];

function BuyBackTable() {
  return (
    <Table<BuyBackRow>
      variant="embedded"
      wrapLines
      columnDefinitions={[
        { id: 'route', header: 'Route', cell: (r) => r.route },
        { id: 'needs', header: 'Needs', cell: (r) => r.needs },
        { id: 'perQuery', header: 'Paid on every query', cell: (r) => r.perQuery },
        { id: 'scope', header: 'Where it was shown', cell: (r) => r.scope },
      ]}
      items={BUY_BACK}
      header={<Header variant="h3">Three ways to buy sharpening back per query</Header>}
    />
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function WhatRlDoes() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Read an RL gain as a pass@k curve before you trust it, and know what a frozen model can buy back: one training-free sampler did it at about 8.84 times the tokens per answer (sources read 2026-10-30)"
          >
            8. What RL Does to a Model
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            RL (reinforcement learning) with verifiable rewards, RLVR, trains a model on tasks
            where a program checks each answer and the check is the reward (section 7, RLVR &amp;
            GRPO). It raises single-shot accuracy on math and code. What it adds to the model is a
            separate question, and the answer decides what else could deliver the same gain and at
            what price. This section answers the dive&apos;s first question: what RL does to a
            model.
          </Box>
          <Box variant="p">
            The term it turns on is the capability boundary: the set of problems a model solves in
            at least one of k samples when k is large. RL can move probability inside that set,
            which is sharpening, or it can widen the set. A pass@k curve shows which happened. On
            the models and benchmarks in the studies read here, RLVR mostly sharpens, and a frozen model can
            buy part of the sharpening back when it answers: a training-free sampler nearly matched
            the single-shot score of GRPO (Group Relative Policy Optimization, the RL algorithm
            that scores each answer against the others sampled for the same prompt) on a math
            benchmark, at about 8.84 times the tokens per answer{' '}
            <Cite tier={3} href={SAMPLING} venue="ICLR 2026">
              Reasoning with Sampling, Table 1 and Section 5.3
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Tell sharpening from new capability by where the RL curve and the base curve cross"
          >
            Reading a pass@k curve
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            pass@k is the share of problems where at least one of k sampled answers passes the
            checker, and pass@1 is the single-shot accuracy a user sees{' '}
            <Cite tier={3} href={YUE} venue="NeurIPS 2025">
              Yue et al., Section 2.2
            </Cite>
            . Plot it against k on a log scale for the base model and for the same model after RL,
            and the two curves show what training changed. Section 3, The Language Model Is
            Already a Policy, shows how to estimate pass@k from a fixed number of samples.
          </Box>
          <PassAtKDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured: a schematic of the pattern described in this section. The
            positions of the curves carry no data.
          </Box>
          <Box variant="p">
            The key reads the curves from left to right. A crossing marks sharpening; if RL had
            widened the boundary, the RL model would solve more problems than the base at large
            k{' '}
            <Cite tier={3} href={YUE} venue="NeurIPS 2025">
              Yue et al., Section 2.2
            </Cite>
            .
          </Box>
          <Box variant="p">
            One measured crossing shows the shape. On leg_counting, a task from the Reasoning Gym
            suite, ProRL, a model trained with prolonged RL, solved 28% of questions in one attempt
            against 4% for its base model; at 1,024 attempts the base model reached 40% and ProRL
            30%{' '}
            <Cite tier={3} href={LEASH} venue="preprint">
              The Invisible Leash, Section 3.2
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="Why a success at large k is evidence and not luck">
            <SpaceBetween size="s">
              <Box variant="p">
                At large k a math answer can come out right from a wrong chain of thought. The
                study behind the main result checked chains of thought by hand for a subset of
                outputs, and used unit tests for code, where a lucky pass is close to impossible.
                It also notes that the base model already produces correct outputs at k = 128 or
                1,024, budgets well within practical limits, far from the astronomically large k
                at which uniform sampling over tokens would stumble on a correct path{' '}
                <Cite tier={3} href={YUE} venue="NeurIPS 2025">
                  Yue et al., Section 2.2
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
            description="Know which result applies to your model before you count on RL to teach it something new"
          >
            The debate: sharpening by default, and three settings that move the boundary
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The central result spans several model families, six RL algorithms and math, code and
            visual benchmarks: RLVR-trained models beat their base models at small k, and the base
            models score higher pass@k when k is large. Coverage and perplexity analyses point the
            same way, since the reasoning paths of the RL models already appear in the base
            models&apos; sampling distribution, and the authors scope the finding to current RLVR
            training{' '}
            <Cite tier={3} href={YUE} venue="NeurIPS 2025">
              Yue et al., abstract
            </Cite>
            . The gap at the right edge is large enough to plan around: on one math benchmark
            (Minerva) with a 32B model, the base model solved about 9% more problems than the RL
            model at k = 128{' '}
            <Cite tier={3} href={YUE} venue="NeurIPS 2025">
              Yue et al., Section 3.1
            </Cite>
            .
          </Box>
          <Box variant="p">
            Counting question by question gives the same answer. Across the models compared, more
            questions lost a verified success than gained one, at budgets up to 8,192 samples for
            the math comparisons. ProRL-1.5B-v2, trained with prolonged RL to widen the boundary,
            lost 175 questions while gaining 48. RLVR kept most of what the base could solve, 0.93
            to 0.99 of it, and newly solved questions made up at most 2% of its successes{' '}
            <Cite tier={3} href={LEASH} venue="preprint">
              The Invisible Leash, Sections 3.1 and 3.2
            </Cite>
            .
          </Box>
          <Box variant="p">
            Our reading of these studies: three findings show the boundary moving, each in a
            controlled or small setting, and in each the training supplied something the base model
            could not reach by sampling alone.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              A new combination of parts the model already has.
            </Box>{' '}
            On synthetic string-transformation functions with Llama-3.1-8B-Instruct, RL on
            two-function compositions lifted unseen three-function problems from near zero to 30%
            and four-function problems to 15%. Rejection fine-tuning, training on the model&apos;s
            own correct answers, did not generalise this way on the same problems{' '}
            <Cite tier={3} href={COMPOSE} venue="ICLR 2026">
              From f(x) and g(x) to f(g(x)), Section 1
            </Cite>
            . On the hard levels the pass@k gap over the starting model widened as k grew{' '}
            <Cite tier={3} href={COMPOSE} venue="ICLR 2026">
              From f(x) and g(x) to f(g(x)), Figure 5
            </Cite>
            .
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              Training at the edge of competence, with room left by pretraining.
            </Box>{' '}
            With 100M-parameter models trained from scratch on synthetic reasoning data, RL
            produced real pass@128 gains only when pretraining left headroom on the task and the RL
            data sat at the model&apos;s edge of competence, hard but not yet out of reach{' '}
            <Cite tier={3} href={INTERPLAY} venue="ICML 2026">
              Interplay of pre-training, mid-training and RL, abstract and Section 2.4
            </Cite>
            .
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              New information from a teacher or a tool.
            </Box>{' '}
            Adding teacher-written solutions near the boundary and consolidating them with RL
            raised average pass@256 by 9.8 points over the base models across five model settings{' '}
            <Cite tier={3} href={CURRICULUM} venue="preprint">
              Curriculum RL beyond the base model, abstract and Section 4.1
            </Cite>
            . LoRA (Low-Rank Adaptation) trains a small add-on to frozen weights. In one small
            study (Qwen2.5-7B-Instruct trained with LoRA GRPO on 200 problems, 100 test problems per
            category, k up to 64), tool-use RL on multi-hop search ended above the base at large k,
            0.81 against 0.77 at k = 64, a margin of about four problems, and the gap widened as k
            grew{' '}
            <Cite tier={3} href={PASS_KT} venue="preprint">
              Pass@(k,T), Sections 3 and 4.2
            </Cite>
            . Section 9, Agentic RL, covers that study.
          </Box>
          <Box variant="p">
            Our reading: RL sharpens by default, and it widens the boundary when training gives the
            model something it cannot reach by sampling itself, whether a reward for a combination
            it never built, data at the edge of what it can do, or information from a teacher or a
            tool.
          </Box>
          <ExpandableSection headerText="How far the evidence reaches">
            <SpaceBetween size="s">
              <Box variant="p">
                No frontier lab has published, in the sources located for this research, a
                comparison of a base checkpoint with its RL checkpoint at large k. The authors of
                the central study name the limit themselves: many of the most capable models and
                training pipelines remain proprietary{' '}
                <Cite tier={3} href={YUE} venue="NeurIPS 2025">
                  Yue et al., Section 7
                </Cite>
                .
              </Box>
              <Box variant="p">
                The open comparisons located stop at 32B, and there the answer depends on the benchmark.
                The base model was ahead at k = 128 on Minerva{' '}
                <Cite tier={3} href={YUE} venue="NeurIPS 2025">
                  Yue et al., Section 3.1
                </Cite>
                ; in another study, RL from Qwen2.5-32B-Base stayed above the base at every
                sampled k on AIME (a US competition-math exam whose integer answers a rule can
                check), while at 7B the curves crossed at k = 64{' '}
                <Cite tier={3} href={GURU} venue="NeurIPS 2025 Datasets and Benchmarks">
                  Guru cross-domain RL study, Section 4.3
                </Cite>
                . AIME on a Qwen2.5 base carries the model-family caveat of the trust check below
                (our reading).
              </Box>
              <Box variant="p">
                &quot;Large k&quot; also differs between papers: 128 or 1,024 in the central study{' '}
                <Cite tier={3} href={YUE} venue="NeurIPS 2025">
                  Yue et al., Section 2.2
                </Cite>
                , up to 8,192 in the question-level count{' '}
                <Cite tier={3} href={LEASH} venue="preprint">
                  The Invisible Leash, Section 3.1
                </Cite>
                , and 64 in the tool-use study{' '}
                <Cite tier={3} href={PASS_KT} venue="preprint">
                  Pass@(k,T), Section 3
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
            description="See why an RL update is small: it is why RL forgets little, and why a rank-1 adapter matched full fine-tuning in one lab's runs"
          >
            What changes in the weights
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The size of the update follows from how little a reward says. On Thinking
            Machines&apos; information argument, SFT (supervised fine-tuning, training on target
            answers token by token) arguably supplies information on every token of its target,
            while policy gradient, the RL update driven by the advantage (how much better an
            attempt scored than expected), supplies only O(1) bits per attempt, a constant that
            does not grow with the length of the answer. Assuming one bit per completion, their
            run on MATH, a competition-math benchmark, with about 10,000 problems and 32 samples
            each had about 320,000 bits to absorb,
            against about 3M parameters in a rank-1 LoRA adapter on Llama-3.1-8B. In their runs
            (Llama-3.1-8B base, MATH and grade-school math), rank-1 LoRA matched full fine-tuning
            for policy gradient{' '}
            <Cite tier={2} href={LORA_BLOG}>
              Thinking Machines, LoRA Without Regret (lab blog), Reinforcement learning
            </Cite>
            .
          </Box>
          <Box variant="p">
            A small update keeps more of what the model knew. Fine-tuned on a new task, RL forgot
            less of the model&apos;s earlier abilities than SFT at matched new-task performance, on
            Qwen2.5-3B-Instruct and on OpenVLA 7B, a robotics model, and the amount forgotten
            tracked the KL (Kullback-Leibler divergence, a measure of how far one probability
            distribution has moved from another) between the fine-tuned and base model on the new
            task{' '}
            <Cite tier={3} href={RAZOR} venue="ICLR 2026">
              RL&apos;s Razor, abstract and Section 3
            </Cite>
            .
          </Box>
          <Box variant="p">
            Entropy is the budget RL spends. Entropy measures how spread out the model&apos;s
            next-token distribution is. Across 11 base models from four families, performance
            traded against entropy on a fitted curve, and 76% of the performance gain and 73% of
            the entropy drop came in the first 200 of 2,400 training steps{' '}
            <Cite tier={3} href={ENTROPY} venue="preprint">
              The Entropy Mechanism of RL for Reasoning, Sections 2.3 and 2.4
            </Cite>
            . Our reading: a model that samples nearly the same answer every time has little left
            to cover the right side of the pass@k curve, so the entropy curve is the large-k loss
            seen from inside the run. Section 5, Two Leashes: PPO&apos;s Clip &amp; the KL, shows
            where to read it on a dashboard.
          </Box>
          <ExpandableSection headerText="Does RL change only a few weights? Three positions">
            <SpaceBetween size="s">
              <Box variant="p">
                One study read ten public checkpoints at a bf16 (bfloat16, a 16-bit floating-point
                format with a short mantissa) tolerance of 1e-5 and found 68.5% to 96.0% of
                parameters unchanged after post-training with seven methods, four of them offline
                preference methods such as DPO (Direct Preference Optimization), which learn from a
                fixed set of preferred and rejected answers. SFT updates were dense, at 6% to 15%
                sparsity{' '}
                <Cite tier={3} href={SUBNETWORKS} venue="NeurIPS 2025">
                  RL Finetunes Small Subnetworks, Section 2 and Table 1
                </Cite>
                . The figure shrinks at tighter tolerance: at 1e-8, the checkpoints in the
                paper&apos;s appendix table read 50.4% to 87.6%{' '}
                <Cite tier={3} href={SUBNETWORKS} venue="NeurIPS 2025">
                  RL Finetunes Small Subnetworks, Table 6
                </Cite>
                .
              </Box>
              <Box variant="p">
                A second paper reads that sparsity as the visible trace of an optimisation bias:
                for a given pretrained model, RL&apos;s updates land in the same low-curvature
                regions across runs, datasets and recipes, and bf16 storage hides the smallest of
                them. On its account, precision amplifies the visible sparsity and does not cause
                the bias{' '}
                <Cite tier={3} href={PATH_NOT_TAKEN} venue="preprint">
                  The Path Not Taken, abstract and Section 2.3
                </Cite>
                .
              </Box>
              <Box variant="p">
                A third found no update sparsity when the same training ran in float32, with the
                same task performance: in its bf16 runs, RL&apos;s small updates had failed to
                cross the format&apos;s representational threshold{' '}
                <Cite tier={3} href={RAZOR} venue="ICLR 2026">
                  RL&apos;s Razor, Section 6
                </Cite>
                . Optimiser state was not analysed in any of the papers read.
              </Box>
              <Box variant="p">
                Our reading: the three disagree about sparsity and agree that RL&apos;s
                per-parameter changes are small, small enough for bf16 rounding to hide many of
                them. A sparsity figure measured on your own checkpoints means something only with
                its storage precision and tolerance recorded beside it.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Run three checks on any reported RL gain before you plan around it: the model family, the benchmark's contamination, and the k"
          >
            The trust check
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The Qwen2.5-Math case shows why each of the three checks matters.
          </Box>
          <Box variant="p">
            On Qwen2.5-Math-7B, GRPO with randomly assigned rewards raised accuracy on MATH-500 (a
            500-problem subset of the MATH competition-math benchmark) by 21.4 points, and with
            deliberately incorrect labels by 24.1, against 29.1 with the correct answers. Rewards
            like these often fail to produce gains on other families such as Llama3 and OLMo2{' '}
            <Cite tier={3} href={SPURIOUS} venue="ICML 2026">
              Spurious Rewards, abstract and Section 2.2
            </Cite>
            . The same model shows signs of having seen the benchmark: given the first 60% of each
            MATH-500 problem, it reproduced the remaining 40% with 54.60% exact match, against 3.8%
            for Llama3.1-8B, and on the newly released LiveMathBench (version 202505) its
            completion rate fell to 0.0%{' '}
            <Cite tier={3} href={MEMORIZATION} venue="AAAI 2026">
              Reasoning or Memorization, Section 1
            </Cite>
            . On freshly generated arithmetic problems, only accurate rewards pushed the model past
            its base boundary{' '}
            <Cite tier={3} href={MEMORIZATION} venue="AAAI 2026">
              Reasoning or Memorization, abstract
            </Cite>
            .
          </Box>
          <Box variant="p">
            Why random rewards help Qwen2.5-Math is still argued. One group points to a clipping
            bias in GRPO&apos;s update (the clip caps how far one update may move each token&apos;s
            probability; section 5 covers it) that amplifies behaviour the model already has, here
            reasoning in code it never runs{' '}
            <Cite tier={3} href={SPURIOUS} venue="ICML 2026">
              Spurious Rewards, abstract
            </Cite>
            ; another points to benchmark contamination{' '}
            <Cite tier={3} href={MEMORIZATION} venue="AAAI 2026">
              Reasoning or Memorization, abstract
            </Cite>
            . Both agree the effect does not carry to Llama or OLMo{' '}
            <Cite tier={3} href={SPURIOUS} venue="ICML 2026">
              Spurious Rewards, abstract
            </Cite>{' '}
            <Cite tier={3} href={MEMORIZATION} venue="AAAI 2026">
              Reasoning or Memorization, Sections 1 and 2.1
            </Cite>
            .
          </Box>
          <Box variant="p">Our reading of these studies turns the three checks into questions:</Box>
          <ul>
            <li>
              <Box variant="strong" display="inline">
                Model family.
              </Box>{' '}
              A gain shown on Qwen2.5-Math is a gain on that family until another family
              reproduces it.
            </li>
            <li>
              <Box variant="strong" display="inline">
                Contamination.
              </Box>{' '}
              A benchmark the model cannot have seen, newly released or generated, is the one that
              separates learning from recall.
            </li>
            <li>
              <Box variant="strong" display="inline">
                k.
              </Box>{' '}
              A pass@1 gain on its own fits sharpening and a wider boundary equally well; the curve
              at the largest k the evaluation budget allows tells them apart.
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Price the inference-time route before you train: sharpening bought per query, at about 8.84 times the tokens for one sampler, up to the ceiling the base model's own curve sets"
          >
            What a frozen model can buy back
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            If RL mostly sharpens, part of its gain is available from the base model at inference
            time, with the weights untouched. The studies read tested four routes, and the base
            model&apos;s own pass@k curve sets their ceiling.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              The curve is a menu.
            </Box>{' '}
            Our reading, from the definition of pass@k: the base model&apos;s pass@K is the ceiling
            for best-of-K selection with a perfect verifier, a checker that always recognises a
            correct answer, because the selection succeeds exactly when one of the K samples is
            right. A real verifier or a majority vote can only miss some of those successes{' '}
            <Cite tier={3} href={YUE} venue="NeurIPS 2025">
              Yue et al., Section 2.2
            </Cite>
            . Marker 4 in the diagram above is that ceiling.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              Sharpening without a verifier.
            </Box>{' '}
            A training-free sampler targets the base model&apos;s own distribution raised to a
            power, 4 in the paper, a sharpened version of what the model already samples. It uses
            MCMC (Markov chain Monte Carlo) to resample blocks of tokens according to their
            base-model likelihoods, and needs no training data and no verifier{' '}
            <Cite tier={3} href={SAMPLING} venue="ICLR 2026">
              Reasoning with Sampling, Sections 1 and 4
            </Cite>
            . On Qwen2.5-Math-7B and MATH-500 it scored 0.748, against 0.496 for the base model and
            0.785 for GRPO trained on MATH; the authors tested it on Qwen2.5-Math-7B, Qwen2.5-7B
            and Phi-3.5-mini-instruct{' '}
            <Cite tier={3} href={SAMPLING} venue="ICLR 2026">
              Reasoning with Sampling, Section 5.1 and Table 1
            </Cite>
            . The price is about 8.84 times the tokens of standard inference, which the authors
            compute for MATH-500 from their sampler settings (10 MCMC steps, a 679-token average
            output, 192-token blocks); the multiplier moves with output length and those
            settings{' '}
            <Cite tier={3} href={SAMPLING} venue="ICLR 2026">
              Reasoning with Sampling, Section 5.3
            </Cite>
            .
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              A prompt that turns up a behaviour.
            </Box>{' '}
            Forcing every answer to open with &quot;Let&apos;s solve this using Python.&quot;
            raised Qwen2.5-Math-7B&apos;s MATH-500 accuracy by 15.0 points, from 49.4% to 64.4%,
            and lowered it on Llama, OLMo2 and the general Qwen2.5-7B, which fell from 41.6% to
            22.2%{' '}
            <Cite tier={3} href={SPURIOUS} venue="ICML 2026">
              Spurious Rewards, Section 5.3 and Table 2
            </Cite>
            . Our reading: the contamination result in the trust check concerns the same model and
            benchmark, so it applies to this gain too.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              A learned verifier over a frozen generator.
            </Box>{' '}
            With GPT-4-based models, a PRM (process-supervised reward model, which scores each
            reasoning step) trained on 800,000 human step-level labels solved 78.2% of a
            representative subset of MATH test problems when choosing among 1,860 samples per
            problem, against 72.4% for an ORM (outcome-supervised reward model, which scores only
            the final answer) and 69.6% for majority voting. The generator was never trained with
            RL{' '}
            <Cite tier={3} href={LIGHTMAN} venue="ICLR 2024">
              Let&apos;s Verify Step by Step, Sections 1 to 3 and Figure 3
            </Cite>
            . DeepSeek dropped PRMs as a training reward: steps are hard to define, step
            correctness is hard to label at scale, and a model-based PRM leads to reward hacking
            (the policy learning to exploit the scorer; section 10, The Reward Is a Proxy). Against
            the compute it adds in large-scale RL its benefit was limited, while a PRM still helps
            rerank the top answers{' '}
            <Cite tier={3} href={R1} venue="Nature 2025">
              DeepSeek-R1, Supplementary G.2
            </Cite>
            .
          </Box>
          <BuyBackTable />
          <Box variant="p">
            Our reading, which sets the choice: inference-time sharpening is paid on every query,
            where RL is paid once in training and then served at the normal price. Best-of-K needs
            the verifier at serving time; the sampler needs none and multiplies the tokens, about
            8.84 times in the paper&apos;s setting. Neither reaches past the base model&apos;s own
            pass@K. Where RL went beyond it in the studies read, with a new combination of skills
            (string functions on Llama-3.1-8B-Instruct) and with tool use that widened coverage
            (one small study on Qwen2.5-7B-Instruct), the starting model&apos;s pass@k, the ceiling
            for resampling it, stayed below the RL model&apos;s at the largest k measured{' '}
            <Cite tier={3} href={COMPOSE} venue="ICLR 2026">
              From f(x) and g(x) to f(g(x)), Figure 5
            </Cite>{' '}
            <Cite tier={3} href={PASS_KT} venue="preprint">
              Pass@(k,T), Section 4.2
            </Cite>
            .
          </Box>
          <Box variant="p">
            So measure before you train. Sample the base model several times per task, grade the
            samples, and read its pass@k at the K you could afford to serve. If that sits well
            above its pass@1 and you hold a verifier, selection can buy the gain per query. If the
            base curve stays below the level you need even at that K, the gap lies beyond what
            resampling the base reaches, and closing it takes new information, in the weights or in
            the context. Section 20, Cost per Improvement, prices the per-query route against
            training, and the words track from section 11, A Text Loop Is RL on the Context,
            onward takes up what a loop can learn that RL mostly does not: instructions, procedures
            and facts.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
