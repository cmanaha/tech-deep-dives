import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, arxiv, ghTree, E0_URL, HYPERPOD_RECIPES_SHA } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** DAPO: Decoupled Clip and Dynamic sAmpling Policy Optimization. */
const DAPO = arxiv('2503.14476v2');
/** DeepSeek-R1 (the Nature version is v2). */
const R1 = arxiv('2501.12948v2');
/** Snell et al., Learning by Distilling Context. */
const CONTEXT_DISTILLATION = arxiv('2209.15189v1');
/** AlphaEvolve white paper. */
const ALPHAEVOLVE = arxiv('2506.13131v1');
/** Reasoning with Sampling (power sampling). */
const SAMPLING = arxiv('2510.14901v1');
/** GEPA: reflective prompt evolution. */
const GEPA = arxiv('2507.19457v2');
/** Advisor Models (ICML 2026). */
const ADVISOR = arxiv('2510.02453v3');
/** Sclar et al., prompt-format sensitivity (ICLR 2024). */
const FORMAT = arxiv('2310.11324v2');

const BEDROCK_RFT = 'https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html';
const BEDROCK_APO =
  'https://docs.aws.amazon.com/bedrock/latest/userguide/advanced-prompt-optimization-how.html';
const AGENTCORE_OPT = 'https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/optimization.html';
const AGENTCORE_EPISODIC =
  'https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/episodic-memory-strategy.html';
const SM_CUSTOMIZE = 'https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models.html';
const SM_TRAINING_SESSIONS =
  'https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models-training-sessions.html';
const SM_MTRL = 'https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-mtrl-hyperparams.html';
const HYPERPOD_RECIPES = ghTree(
  'aws/sagemaker-hyperpod-recipes',
  HYPERPOD_RECIPES_SHA,
  'hyperpod_recipes/recipes_src/fine-tuning',
);
const OPENAI_RFT = 'https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning';

/* ------------------------------------------------------------------------ */
/* Diagram: the three questions as a decision tree                          */
/* ------------------------------------------------------------------------ */

// Layout in viewBox units. 13px weight-600 text budgets about 7.5 units per character, 12px
// weight-600 about 7, 11px about 6.2. The widest lines: the question 3 title (65 characters,
// about 488 units) inside an 870-unit band; the longest exit chip (66 characters, about 410
// units) inside a 550-unit chip; leaf lines of up to 17 characters (about 105 units) inside a
// 125-unit leaf with 6 units of padding on each side.
const CT_W = 900;
const CT_H = 482;
const CT_LANE_X = [15, 315, 615];
const CT_LANE_W = 270;
const CT_LEAF_W = 125;
const CT_LEAF_GAP = 20;

const CT_Q1 = { x: 270, y: 12, w: 360, h: 42 };
const CT_GAP_Y = 88;
const CT_GAP_H = 44;
const CT_Q2 = { x: 15, y: 156, w: 870, h: 100 };
const CT_Q3 = { x: 15, y: 286, w: 870, h: 54 };
const CT_LEAF_Y = 366;
const CT_LEAF_H = 76;
const CT_LEGEND_Y = 456;

interface GapKind {
  title: string;
  sub: string;
}

const CT_GAPS: GapKind[] = [
  { title: 'Instructions, facts, procedures', sub: 'missing from the context' },
  { title: 'Sharpening', sub: 'right within k tries, not the first' },
  { title: 'Skill or per-input behaviour', sub: 'also latency and calibration' },
];

interface Leaf {
  title: string[];
  sub: string[];
}

// Two leaves per lane, left then right.
const CT_LEAVES: Leaf[][] = [
  [
    { title: ['Text loop'], sub: ['hardened grader;', 'the first move'] },
    { title: ['Distil the', 'playbook'], sub: ['own weights, once', 'the text settles'] },
  ],
  [
    { title: ['Inference-time', 'sampling'], sub: ['per-query cost', 'is acceptable'] },
    { title: ['RFT, managed', 'or self-run'], sub: ['own weights,', 'high volume'] },
  ],
  [
    { title: ['Advisor', '(a hybrid)'], sub: ['API model,', 'per-input gap'] },
    { title: ['Distillation', 'or RFT'], sub: ['own weights;', 'teacher first'] },
  ],
];

const CT_EXITS = [
  'No trustworthy signal: build the grader first (section 10)',
  'Near 0%: groups score alike, no gradient. SFT or distillation first',
  'Above 95%: little left to learn. RFT might be unnecessary',
];

const CT_LEGEND: { cls: string; text: string; x: number }[] = [
  { cls: 'q', text: 'Decision question', x: 15 },
  { cls: 'exit', text: 'Fix this first, then return', x: 175 },
  { cls: 'leaf', text: 'Path to take', x: 395 },
  { cls: 'contested', text: 'Contested: measure it', x: 520 },
];

const CT_STYLE = `
  .choosing-tree-q { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
  .choosing-tree-start { fill: #ffffff; stroke: #879596; stroke-width: 1.2; }
  .choosing-tree-gap { fill: #ffffff; stroke: #414d5c; stroke-width: 1.2; }
  .choosing-tree-exit { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.2; }
  .choosing-tree-contested { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; stroke-dasharray: 6 4; }
  .choosing-tree-leaf { fill: #e9f7ef; stroke: #037f51; stroke-width: 1.8; }
  .choosing-tree-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#choosing-tree-ah); }
  .choosing-tree-line { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
  .choosing-tree-dash { stroke: #8b6c00; stroke-width: 1.2; fill: none; stroke-dasharray: 4 3; }
  .choosing-tree-qt { fill: #0f1b2a; font: 600 13px sans-serif; }
  .choosing-tree-qt-mid { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
  .choosing-tree-sub { fill: #5f6b7a; font: 11px sans-serif; }
  .choosing-tree-sub-mid { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
  .choosing-tree-exit-t { fill: #4d3d00; font: 11px sans-serif; }
  .choosing-tree-tag { fill: #6b5300; font: 600 11px sans-serif; }
  .choosing-tree-leaf-t { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: middle; }
  .choosing-tree-leaf-s { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
  .choosing-tree-edge { fill: #414d5c; font: 11px sans-serif; }
  .choosing-tree-leg { fill: #414d5c; font: 11px sans-serif; }
`;

function laneCenter(lane: number): number {
  return CT_LANE_X[lane] + CT_LANE_W / 2;
}

function leafX(lane: number, side: number): number {
  return CT_LANE_X[lane] + side * (CT_LEAF_W + CT_LEAF_GAP);
}

function DecisionTreeDiagram() {
  const q1Bottom = CT_Q1.y + CT_Q1.h;
  const busY = 68;
  const gapBottom = CT_GAP_Y + CT_GAP_H;
  const q2Bottom = CT_Q2.y + CT_Q2.h;
  const q3Bottom = CT_Q3.y + CT_Q3.h;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${CT_W} ${CT_H}`}
        role="img"
        aria-labelledby="choosing-tree-title"
        aria-describedby="choosing-tree-desc"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="choosing-tree-title">
          A decision tree for choosing where a loop&apos;s change lands. Question 1 sorts the gap
          into three kinds: instructions, facts or procedures; sharpening; or skill, per-input
          behaviour, latency and calibration. Question 2 checks the signal and today&apos;s score,
          and sends a gap with no trustworthy signal, a score near 0% or a score above 95% to fix
          that first. Question 3, weight access and query volume, then picks one of two paths in
          each column: a text loop or a distilled playbook; inference-time sampling or RFT; an
          advisor or distillation and RFT.
        </title>
        <desc id="choosing-tree-desc">
          Blue boxes are the three questions, asked in order. Amber boxes are exits that send you
          to fix the signal or the starting point before any path. Green boxes are the six paths.
          The dashed amber box marks output format, the contested row, which is measured on the
          target model.
        </desc>
        <defs>
          <marker
            id="choosing-tree-ah"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#5f6b7a" />
          </marker>
        </defs>
        <style>{CT_STYLE}</style>
        <rect x={0} y={0} width={CT_W} height={CT_H} rx={8} fill="#ffffff" />

        {/* Start, question 1 and the contested format note */}
        <rect x={15} y={12} width={220} height={42} rx={6} className="choosing-tree-start" />
        <text x={125} y={30} className="choosing-tree-qt-mid">
          Write the gap down
        </text>
        <text x={125} y={46} className="choosing-tree-sub-mid">
          in one sentence
        </text>
        <line x1={235} y1={33} x2={CT_Q1.x} y2={33} className="choosing-tree-arr" />

        <rect x={CT_Q1.x} y={CT_Q1.y} width={CT_Q1.w} height={CT_Q1.h} rx={6} className="choosing-tree-q" />
        <text x={CT_Q1.x + CT_Q1.w / 2} y={30} className="choosing-tree-qt-mid">
          1. What kind of gap is it?
        </text>
        <text x={CT_Q1.x + CT_Q1.w / 2} y={46} className="choosing-tree-sub-mid">
          section 18&apos;s map: mark every row
        </text>

        <line x1={CT_Q1.x + CT_Q1.w} y1={33} x2={650} y2={33} className="choosing-tree-dash" />
        <rect x={650} y={12} width={235} height={42} rx={6} className="choosing-tree-contested" />
        <text x={662} y={29} className="choosing-tree-tag">
          Output format: contested
        </text>
        <text x={662} y={45} className="choosing-tree-sub">
          measure it on the target model
        </text>

        {/* Bus from question 1 to the three kinds of gap */}
        <line x1={450} y1={q1Bottom} x2={450} y2={busY} className="choosing-tree-line" />
        <line x1={laneCenter(0)} y1={busY} x2={laneCenter(2)} y2={busY} className="choosing-tree-line" />
        {[0, 1, 2].map((lane) => (
          <line
            key={`bus-${lane}`}
            x1={laneCenter(lane)}
            y1={busY}
            x2={laneCenter(lane)}
            y2={CT_GAP_Y}
            className="choosing-tree-arr"
          />
        ))}

        {CT_GAPS.map((g, lane) => (
          <g key={g.title}>
            <rect
              x={CT_LANE_X[lane]}
              y={CT_GAP_Y}
              width={CT_LANE_W}
              height={CT_GAP_H}
              rx={6}
              className="choosing-tree-gap"
            />
            <text x={laneCenter(lane)} y={CT_GAP_Y + 18} className="choosing-tree-qt-mid">
              {g.title}
            </text>
            <text x={laneCenter(lane)} y={CT_GAP_Y + 34} className="choosing-tree-sub-mid">
              {g.sub}
            </text>
            <line
              x1={laneCenter(lane)}
              y1={gapBottom}
              x2={laneCenter(lane)}
              y2={CT_Q2.y}
              className="choosing-tree-arr"
            />
          </g>
        ))}

        {/* Question 2 with its three exits */}
        <rect x={CT_Q2.x} y={CT_Q2.y} width={CT_Q2.w} height={CT_Q2.h} rx={8} className="choosing-tree-q" />
        <text x={30} y={182} className="choosing-tree-qt">
          2. What signal do you have, and
        </text>
        <text x={30} y={199} className="choosing-tree-qt">
          what does the model score today?
        </text>
        <text x={30} y={220} className="choosing-tree-sub">
          A verifier, a judge checked against
        </text>
        <text x={30} y={235} className="choosing-tree-sub">
          labels, or nothing trustworthy
        </text>
        {CT_EXITS.map((t, i) => (
          <g key={t}>
            <rect x={320} y={166 + i * 30} width={550} height={24} rx={5} className="choosing-tree-exit" />
            <text x={332} y={182 + i * 30} className="choosing-tree-exit-t">
              {t}
            </text>
          </g>
        ))}

        {[0, 1, 2].map((lane) => (
          <line
            key={`q2-${lane}`}
            x1={laneCenter(lane)}
            y1={q2Bottom}
            x2={laneCenter(lane)}
            y2={CT_Q3.y}
            className="choosing-tree-arr"
          />
        ))}
        <text x={laneCenter(0) + 10} y={275} className="choosing-tree-edge">
          Score in between: go on
        </text>

        {/* Question 3 */}
        <rect x={CT_Q3.x} y={CT_Q3.y} width={CT_Q3.w} height={CT_Q3.h} rx={8} className="choosing-tree-q" />
        <text x={30} y={308} className="choosing-tree-qt">
          3. Can you touch the weights, and how many queries will it serve?
        </text>
        <text x={30} y={327} className="choosing-tree-sub">
          API access only, or weights you own; section 20 prices the volume
        </text>

        {/* Six paths */}
        {CT_LEAVES.map((pair, lane) =>
          pair.map((leaf, side) => {
            const x = leafX(lane, side);
            const cx = x + CT_LEAF_W / 2;
            return (
              <g key={`${lane}-${side}`}>
                <line x1={cx} y1={q3Bottom} x2={cx} y2={CT_LEAF_Y} className="choosing-tree-arr" />
                <rect
                  x={x}
                  y={CT_LEAF_Y}
                  width={CT_LEAF_W}
                  height={CT_LEAF_H}
                  rx={6}
                  className="choosing-tree-leaf"
                />
                {leaf.title.map((line, k) => (
                  <text
                    key={`t${k}`}
                    x={cx}
                    y={CT_LEAF_Y + 18 + k * 15 + (2 - leaf.title.length) * 7.5}
                    className="choosing-tree-leaf-t"
                  >
                    {line}
                  </text>
                ))}
                {leaf.sub.map((line, k) => (
                  <text key={`s${k}`} x={cx} y={CT_LEAF_Y + 51 + k * 14} className="choosing-tree-leaf-s">
                    {line}
                  </text>
                ))}
              </g>
            );
          }),
        )}

        {CT_LEGEND.map((item) => (
          <g key={item.cls}>
            <rect
              x={item.x}
              y={CT_LEGEND_Y}
              width={22}
              height={14}
              rx={3}
              className={`choosing-tree-${item.cls}`}
            />
            <text x={item.x + 30} y={CT_LEGEND_Y + 11} className="choosing-tree-leg">
              {item.text}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function Choosing() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Answer three questions in order (the kind of gap, the signal and today's score on it, weight access and volume), then start with the grader: at a 4% base rate, 9 and 10 of 20 steps of our small RL run carried no gradient (sources read 2026-10-30)"
          >
            22. Choosing a Text Loop, a Hybrid or a Weight Update
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every method in this dive runs one loop: sample attempts, score them, and change
            something so the next attempts score better. The choice is where the change lands. A
            text loop writes it into the context a frozen model reads. A hybrid trains a small
            model whose output is words for a large frozen one. A weight update writes it into
            the model itself, through RL (reinforcement learning) or fine-tuning. This section
            answers the dive&apos;s fourth question, how to choose, with three questions asked in
            order.
          </Box>
          <Box variant="p">
            One measurement sits under every path: today&apos;s score on your grader. On our DGX
            Spark run of GRPO (Group Relative Policy Optimization, the RL algorithm that scores
            each answer against the others sampled for the same prompt), a base rate of about 4%
            left 9 of 20 steps in one run and 10 of 20 in the other with no gradient at all{' '}
            <Cite tier={0} href={E0_URL}>
              E0 log: GRPO smoke test on a DGX Spark
            </Cite>
            . The section ends where the choice starts in practice, with the grader.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Walk one gap through three questions and arrive at the cheapest path that can close it"
          >
            Three questions, in order
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each question narrows the paths. The kind of gap picks the store that can hold the
            fix. The signal, and the model&apos;s score on it today, decide whether any loop can
            learn and whether RL has anything to push on. Weight access and query volume decide
            between paying once in training and paying on every query. Questions 2 and 3 apply to
            every column of the tree, and the amber exits of question 2 send you to fix the signal
            or the starting point before any path.
          </Box>
          <DecisionTreeDiagram />
          <Box variant="small" color="text-body-secondary">
            The tree is our synthesis of the sections it names. The two thresholds in question 2
            and every path are cited in the blocks below.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Put your gap in one of three kinds, using section 18's map, and the store that can hold its fix follows"
          >
            1. What kind of gap is it?
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 18, What Lives in Weights &amp; What Lives in Context, maps each kind of
            improvement to the store that holds it best, and its row-by-row table is the input to
            this question. Three kinds of gap cover the choice.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              Missing instructions, facts or procedures: the context.
            </Box>{' '}
            The model can follow the rule, use the fact or run the method once it reads it, so a
            text loop or retrieval writes it where the model reads, and each later edit stays
            cheap. Sections 13 and 14 cover a playbook that grows and a prompt that is optimised.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              Sharpening: inference-time sampling or RL.
            </Box>{' '}
            The model reaches the right answer within k attempts and misses it on the first: its
            pass@k, the chance that at least one of k attempts is right, sits well above its
            pass@1. Section 8, What RL Does to a Model, shows how to read the base model&apos;s
            pass@k curve and how much of the gap a frozen model can buy back when it answers.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              Reasoning skill, per-input behaviour, latency or calibration: the weights.
            </Box>{' '}
            A model that fails at every k you can afford to sample lacks the skill. Behaviour that
            depends on something hidden in each input needs weights that read each input, and
            those can belong to a small advisor in front of a frozen model (section 16, Hybrids).
            Latency and token cost fall when instructions move into the weights, and the spread
            and confidence of outputs are set by the probabilities training produces (section 18).
          </Box>
          <Box variant="p">
            Output format is the contested row. Formatting alone moved few-shot accuracy by up to
            76 points on LLaMA-2-13B, and the sensitivity remained after instruction tuning{' '}
            <Cite tier={3} href={FORMAT} venue="ICLR 2024">
              Sclar et al., abstract
            </Cite>
            . Measure a format rule on the target model before choosing where it lives, and again
            whenever the model changes. A real gap often touches rows of two kinds; treat each as
            its own decision.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Measure today's score on your grader before you pay for a run: at a 4% base rate, about half the steps of our small GRPO run carried no gradient"
          >
            2. What signal do you have, and what does the model score on it today?
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The signal comes in three grades. A programmatic verifier, such as tests, a compiler
            or an exact-match check against a gold answer, scores each attempt with no model in
            the scoring. An LLM judge counts as a signal once you have checked its verdicts
            against a set of labelled examples. Anything weaker is nothing trustworthy, and then
            the first task is building the grader, against the four checks that end section 10,
            The Reward Is a Proxy.
          </Box>
          <Box variant="p">
            Then score the starting model on that grader. Today&apos;s score decides whether RL has
            a gradient. GRPO learns from differences inside a group of answers to one prompt. The
            advantage, how much better an answer did than its group&apos;s average, is zero for
            every answer when all of them score the same, all passing or all failing, and a zero
            advantage gives a zero gradient{' '}
            <Cite tier={3} href={DAPO} venue="preprint">
              DAPO, Section 3.2
            </Cite>{' '}
            <Cite tier={1} href={SM_MTRL}>
              SageMaker AI multi-turn RL hyperparameters reference
            </Cite>
            . Near 0%, nearly every group fails together and RL has nothing to push on; near 100%,
            nearly every group passes together and nothing is left to learn.
          </Box>
          <Box variant="p">
            AWS&apos;s triage rule for RFT (reinforcement fine-tuning) sets the same two
            thresholds: if rewards are consistently 0 percent, use SFT (supervised fine-tuning,
            training on target answers) first to establish basic capabilities; if they are above
            95 percent, RFT might be unnecessary{' '}
            <Cite tier={1} href={BEDROCK_RFT}>
              Bedrock user guide: reinforcement fine-tuning best practices
            </Cite>
            .
          </Box>
          <Box variant="p">
            Our own run shows the low end on a live trainer. Qwen2.5-0.5B-Instruct on fresh
            synthetic arithmetic, scored 1 for the exact integer, in two runs of 20 steps with two
            prompts and 8 completions per prompt in each step: the mean reward was 0.044, a base
            rate of about 4%. On 9 of 20 steps in the first run and 10 of 20 in the second, every
            group scored zero and the step produced no gradient{' '}
            <Cite tier={0} href={E0_URL}>
              E0 log: GRPO smoke test on a DGX Spark
            </Cite>
            . Section 7, RLVR &amp; GRPO (RLVR: RL with verifiable rewards), turns a base rate into
            the expected share of silent
            groups for your group size.
          </Box>
          <Box variant="p">
            Read the score per prompt as well as on average. A prompt that passes every time or
            never costs a full group of rollouts at every step and teaches nothing, so drop or
            replace those prompts before a run. The same measurement is the baseline any text
            loop has to beat.
          </Box>
          <ExpandableSection headerText="Evidence: the zero-advantage mechanism in the sources' words">
            <SpaceBetween size="s">
              <Box variant="p">
                DAPO (Decoupled Clip and Dynamic sAmpling Policy Optimization), on GRPO: &quot;if
                all outputs ... of a particular prompt are correct and receive the same reward,
                the resulting advantage for this group is zero. A zero advantage results in zero
                policy gradients&quot;. Its fix is to &quot;over-sample and filter out prompts with
                the accuracy equal to 1 and 0&quot;{' '}
                <Cite tier={3} href={DAPO} venue="preprint">
                  DAPO, Section 3.2
                </Cite>
                .
              </Box>
              <Box variant="p">
                SageMaker AI, for its multi-turn RL: &quot;If all rollouts receive the same reward
                (all succeed or all fail), the advantage is zero and the group produces no
                gradient signal.&quot;{' '}
                <Cite tier={1} href={SM_MTRL}>
                  SageMaker AI multi-turn RL hyperparameters reference
                </Cite>
              </Box>
              <Box variant="p">
                The E0 run used TRL v1.16.0 (Transformers Reinforcement Learning, Hugging
                Face&apos;s post-training library) with vLLM 0.28.0 on one DGX Spark, a single seed
                and a learning rate of 1e-6. It tests the mechanism, and the reward did not move
                over 20 steps{' '}
                <Cite tier={0} href={E0_URL}>
                  E0 log: GRPO smoke test on a DGX Spark
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
            description="Decide between paying once in training and paying on every query, starting from the access you have"
          >
            3. Can you touch the weights, and how many queries will the result serve?
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Weight access is the gate. With an API model, three paths remain: a text loop,
            inference-time sampling, and an advisor, a small model you own that writes advice into
            the API model&apos;s context. Fine-tuning run by the model&apos;s vendor counts as
            weight access only while the vendor offers it. OpenAI is winding down its fine-tuning
            platform: it is no longer accessible to new users, and eligible existing customers can
            create training jobs until January 6, 2027{' '}
            <Cite tier={1} href={OPENAI_RFT}>
              OpenAI API docs: reinforcement fine-tuning
            </Cite>
            .
          </Box>
          <Box variant="p">
            Volume sets the price. A weight update is paid once in training and then served at
            the normal price per query. Inference-time sharpening is paid on every query: one
            training-free sampler took about 8.84 times the tokens per answer in its
            authors&apos; MATH-500 setting (500 competition mathematics problems){' '}
            <Cite tier={3} href={SAMPLING} venue="preprint">
              Reasoning with Sampling, Section 5.3
            </Cite>
            . A text loop pays for its instructions on every call; section 17, Where Words Fall
            Short, covers how prompt caching prices a stable prefix. Our reading: low volume
            favours the per-query paths, and high volume over the life of the learned artifact
            favours paying once. Section 20, Cost per Improvement, turns your rates, your volume
            and your measured quality gap into the breakeven.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Match your three answers to a path, and find the AWS service that runs it, detailed in section 23"
          >
            Six paths, and the AWS service for each
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each path names the answers that lead to it and, in one phrase, the AWS service that
            runs it where one exists. Section 23, RL &amp; Learning Loops on AWS, details each
            service and what the customer brings to it.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              Inference-time sampling.
            </Box>{' '}
            When the gap is sharpening and the per-query cost is acceptable: best-of-K with your
            grader at serving time, or a sampler that needs no verifier. Neither reaches past the
            base model&apos;s own pass@K (section 8). On AWS, in our reading, it needs no
            dedicated service: it runs against any model endpoint.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              A text loop with a hardened grader.
            </Box>{' '}
            The default first move for missing instructions and procedures, on an API model or
            your own (sections 13 to 15). On Qwen3 8B, GEPA (Genetic-Pareto, the reflective prompt
            optimiser of section 14) reached 54.85 on a six-task aggregate against 48.91 for GRPO
            trained through LoRA (Low-Rank Adaptation) adapters and 45.23 for the base model,
            spending 1,839 to 7,051 rollouts per task against GRPO&apos;s 24,000. GRPO still won
            on AIME-2025 (a US competition-math exam), 38.00 against 32.00{' '}
            <Cite tier={3} href={GEPA} venue="ICLR 2026">
              GEPA, Table 1
            </Cite>
            . On AWS: Amazon Bedrock Advanced Prompt Optimization rewrites prompts against your
            metric, an LLM-as-a-judge rubric or a Lambda function{' '}
            <Cite tier={1} href={BEDROCK_APO}>
              Bedrock user guide: how Advanced Prompt Optimization works
            </Cite>
            ; AgentCore optimization recommends changes to system prompts and tool descriptions
            against a target evaluator{' '}
            <Cite tier={1} href={AGENTCORE_OPT}>
              AgentCore developer guide: optimization
            </Cite>
            ; and AgentCore Memory&apos;s episodic strategy writes reflections across
            episodes{' '}
            <Cite tier={1} href={AGENTCORE_EPISODIC}>
              AgentCore developer guide: episodic memory strategy
            </Cite>
            .
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              An advisor.
            </Box>{' '}
            When the model is an API model and the right behaviour varies per input (section 16,
            Hybrids). In the one test that ran both arms on the same model, an advisor in front
            of the frozen model recovered about 70% of the gain that direct RL on that model
            achieved (our arithmetic from the paper&apos;s figures){' '}
            <Cite tier={3} href={ADVISOR} venue="ICML 2026">
              Advisor Models, Section 4.4.3
            </Cite>
            . On AWS, in our reading: a small open-weight model trained with SageMaker AI
            reinforcement fine-tuning or its training session APIs, which leave the training loop
            to you on managed GPUs{' '}
            <Cite tier={1} href={SM_TRAINING_SESSIONS}>
              SageMaker AI developer guide: training session APIs
            </Cite>
            , in front of a Bedrock model.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              SFT or distillation from a stronger model.
            </Box>{' '}
            When the base scores near zero on your grader{' '}
            <Cite tier={1} href={BEDROCK_RFT}>
              Bedrock user guide: reinforcement fine-tuning best practices
            </Cite>
            . Distillation also wins where a stronger teacher exists. In DeepSeek&apos;s comparison
            at 32B, DeepSeek-R1-Distill-Qwen-32B, fine-tuned on DeepSeek-R1&apos;s outputs with no
            RL stage, beat Qwen&apos;s Qwen2.5-32B base trained with over 10K steps of RL on every
            benchmark in the comparison, 72.6 against 47.0 pass@1 on AIME 2024{' '}
            <Cite tier={3} href={R1} venue="Nature 2025">
              DeepSeek-R1, Supplementary F.1, Table 16
            </Cite>
            . Our reading: that RL run worked, so the result shows distillation beating RL from a
            base RL could train. On AWS: SageMaker AI model customisation lists SFT and
            distillation, transferring knowledge from a teacher model to a student, among its
            techniques{' '}
            <Cite tier={1} href={SM_CUSTOMIZE}>
              SageMaker AI developer guide: model customization overview
            </Cite>
            .
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              Reinforcement fine-tuning, managed or self-run.
            </Box>{' '}
            When the gap is skill, or sharpening at high volume, you own the weights, and
            today&apos;s score sits between the two thresholds (section 7, RLVR &amp; GRPO, for the
            algorithm; section 19, An RL Step Is an Inference Job Inside a Training Job, for
            sizing a self-run job). Whether RL alone adds new reasoning skill is contested
            (section 8), which is why a stronger teacher comes first where one exists. On AWS: Amazon Bedrock reinforcement fine-tuning trains with
            GRPO on three base models{' '}
            <Cite tier={1} href={BEDROCK_RFT}>
              Bedrock user guide: reinforcement fine-tuning
            </Cite>
            ; SageMaker AI model customisation lists RFT among its techniques{' '}
            <Cite tier={1} href={SM_CUSTOMIZE}>
              SageMaker AI developer guide: model customization overview
            </Cite>
            ; and the self-managed route runs the GRPO recipes for SageMaker HyperPod{' '}
            <Cite tier={1} href={HYPERPOD_RECIPES}>
              sagemaker-hyperpod-recipes at release 2.0.11: fine-tuning recipes
            </Cite>
            .
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              Distilling a playbook into the weights.
            </Box>{' '}
            Once a prompt or playbook a loop found stops changing, which is our reading of when
            to do it. Context distillation fine-tunes a model to give, from the task input alone,
            the answer it gave with the instructions in its context, so the gain no longer
            disappears &quot;when the context tokens are gone&quot;{' '}
            <Cite tier={3} href={CONTEXT_DISTILLATION} venue="preprint">
              Snell et al., abstract
            </Cite>
            . AlphaEvolve&apos;s authors name distilling their loop&apos;s gains into the next
            generation of base models as a natural next step{' '}
            <Cite tier={3} href={ALPHAEVOLVE} venue="preprint">
              AlphaEvolve, Section 6
            </Cite>
            . While the text is still changing, keeping it in context keeps each edit cheap. On
            AWS, in our reading: an SFT job on the model&apos;s own answers, through SageMaker AI
            model customisation.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Weigh whether a person must read, approve and roll back what the loop learned: one production team chose readable code over deep RL for a mission-critical scheduler"
          >
            Auditability, a criterion of its own
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            What a text loop learns is text. A person can read every line of a prompt or a
            playbook, review a change before it ships, and delete it; section 18 counts
            auditability among the properties the context store holds. Our reading of the two
            stores: a weight update leaves no such record for a person to read.
          </Box>
          <Box variant="p">
            For scheduling work across Google&apos;s data centres, AlphaEvolve, a loop that evolves
            code against an automated evaluator, &quot;was chosen over a deep reinforcement
            learning approach because its code solution not only leads to better performance, but
            also offers clear advantages in interpretability, debuggability, predictability, and
            ease of deployment&quot;{' '}
            <Cite tier={3} href={ALPHAEVOLVE} venue="preprint">
              AlphaEvolve, Section 3.3.1
            </Cite>
            . The paper publishes no figures for the RL approach, so the performance half of that
            reason cannot be checked from it. Our reading: where the learned artifact must be read
            by an operator, approved before it ships or rolled back on a bad day, count that in
            favour of the paths that keep it in text or code.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Write the grader, measure its noise floor and the starting score, and run the cheapest loop against it before any training run"
          >
            Start with the grader
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every path above runs against a grader, and AlphaEvolve&apos;s authors name the same
            dependency as their method&apos;s main limit: it &quot;handles problems for which it is
            possible to devise an automated evaluator&quot;{' '}
            <Cite tier={3} href={ALPHAEVOLVE} venue="preprint">
              AlphaEvolve, Section 6
            </Cite>
            . So the grader is the first deliverable, whichever path wins.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              1. Write the grader.
            </Box>{' '}
            Before anything optimises against it, run section 10&apos;s four checks, which apply
            to a training run and a text loop alike: evaluator code the agent cannot edit, hidden
            or read-only tests, a held-out metric, and monitors kept out of the reward. Write down
            the ones it fails.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              2. Measure its noise floor.
            </Box>{' '}
            Score the unchanged model or prompt several times and take the spread of the scores as
            the floor. A later change counts as a win only when its gain clears the floor or
            repeats (section 15, Your Loops Through the RL Lens).
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              3. Measure today&apos;s score, per prompt.
            </Box>{' '}
            Sample a group of answers for each prompt at the group size you would train with, and
            count the prompts that pass every time or never. At a 4% base rate, 9 and 10 of 20
            steps of our run carried no gradient{' '}
            <Cite tier={0} href={E0_URL}>
              E0 log: GRPO smoke test on a DGX Spark
            </Cite>
            . A consistent 0% sends you to SFT or distillation first, and above 95% RFT might be
            unnecessary{' '}
            <Cite tier={1} href={BEDROCK_RFT}>
              Bedrock user guide: reinforcement fine-tuning best practices
            </Cite>
            .
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              4. Run the cheapest loop against it first.
            </Box>{' '}
            For a sharpening gap, that is best-of-K with the grader on the base model; for missing
            instructions or procedures, a text loop. Move to a hybrid or a weight update when the
            cheap loop&apos;s gains stop clearing the noise floor and your answers to questions 1
            and 3 point there, with section 20&apos;s breakeven as the check on the price.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
