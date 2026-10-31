import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import { Cite, arxiv, gh, ghTree, DSPY_TAG, GEPA_TAG } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Agrawal et al., GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning. */
const GEPA = arxiv('2507.19457v2');
/** Pryzant et al., Automatic Prompt Optimization with "Gradient Descent" and Beam Search (ProTeGi). */
const PROTEGI = arxiv('2305.03495v2');
/** Yuksekgonul et al., TextGrad. Read at arXiv v1; the journal version is Nature 639 (2025). */
const TEXTGRAD = arxiv('2406.07496v1');
/** Yang et al., Large Language Models as Optimizers (OPRO). */
const OPRO = arxiv('2309.03409v3');
/** Opsahl-Ong et al., Optimizing Instructions and Demonstrations for Multi-Stage LM Programs (MIPRO). */
const MIPRO = arxiv('2406.11695v2');
/** Zhang et al., Revisiting OPRO: The Limitations of Small-Scale LLMs as Optimizers. */
const REVISITING_OPRO = arxiv('2405.10276v2');
/** Asawa et al., How to Train Your Advisor: Steering Black-Box LLMs with Advisor Models. */
const ADVISOR = arxiv('2510.02453v3');

/** The paper's reproduction artifact, at the repository head read for this dive. */
const GEPA_ARTIFACT_SHA = 'cbefbc1aa0f43dd39874ec4bf42211365dbda42e';

function gepaCode(path: string, lines: string): string {
  return gh('gepa-ai/gepa', GEPA_TAG, path, lines);
}

function dspyCode(path: string, lines: string): string {
  return gh('stanfordnlp/dspy', DSPY_TAG, path, lines);
}

function artifactCode(path: string, lines: string): string {
  return gh('gepa-ai/gepa-artifact', GEPA_ARTIFACT_SHA, path, lines);
}

function Gepa({ children }: { children: ReactNode }) {
  return (
    <Cite tier={3} href={GEPA} venue="ICLR 2026">
      {children}
    </Cite>
  );
}

function Code({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Cite tier={1} href={href} kind="code">
      {children}
    </Cite>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: GEPA's loop, with the Pareto front over the validation set      */
/* ------------------------------------------------------------------------ */

const LOOP_CELLS: { row: number; col: number }[] = [
  { row: 0, col: 0 },
  { row: 0, col: 1 },
  { row: 0, col: 3 },
  { row: 1, col: 2 },
  { row: 2, col: 1 },
];

function GepaLoopDiagram() {
  const colX = (c: number) => 104 + c * 64;
  const rowY = (r: number) => 272 + r * 26;
  const isBest = (r: number, c: number) => LOOP_CELLS.some((x) => x.row === r && x.col === c);
  const rows = ['A', 'B', 'C'];
  const leads = ['3', '1', 'pruned'];
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 430"
        role="img"
        aria-labelledby="popt-loop-title"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="popt-loop-title">
          GEPA&apos;s loop in gepa v0.1.4. A parent prompt is sampled from the Pareto front over
          the validation set, weighted by how many validation examples it leads. It runs on a
          minibatch of three training examples, the evaluator returns a score plus feedback text,
          and a reflection model rewrites one module&apos;s instruction. The child is re-run on
          the same minibatch and kept only if its score sum is strictly higher; otherwise it is
          discarded. A kept child is scored on every validation example and joins the Pareto
          front. Any candidate that is best on at least one validation example stays available as
          a parent, and a candidate that is best only where another candidate is also best is
          pruned. The evaluator&apos;s feedback text is the part the user writes.
        </title>
        <style>{`
          .popt-loop-box { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .popt-loop-sig { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 3; }
          .popt-loop-pool { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .popt-loop-cell { fill: #ffffff; stroke: #d1d5db; stroke-width: 1; }
          .popt-loop-best { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .popt-loop-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .popt-loop-s { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .popt-loop-h { fill: #16191f; font: 600 11px sans-serif; text-anchor: middle; }
          .popt-loop-hs { fill: #16191f; font: 600 11px sans-serif; text-anchor: start; }
          .popt-loop-n { fill: #414d5c; font: 11px sans-serif; text-anchor: start; }
          .popt-loop-bt { fill: #037f0c; font: 600 11px sans-serif; text-anchor: middle; }
          .popt-loop-pr { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .popt-loop-tag { fill: #8b6c00; }
          .popt-loop-tagt { fill: #ffffff; font: 600 12px sans-serif; text-anchor: middle; }
          .popt-loop-edge { fill: #414d5c; font: 600 11px sans-serif; text-anchor: middle; }
          .popt-loop-edge-end { fill: #414d5c; font: 600 11px sans-serif; text-anchor: end; }
          .popt-loop-edge-start { fill: #414d5c; font: 600 11px sans-serif; text-anchor: start; }
          .popt-loop-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
          .popt-loop-stop { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .popt-loop-stopt { fill: #5f6b7a; font: 600 11px sans-serif; text-anchor: middle; }
        `}</style>
        <defs>
          <marker
            id="popt-loop-ah"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#5f6b7a" />
          </marker>
        </defs>

        <rect x={0} y={0} width={900} height={430} rx={8} fill="#ffffff" />

        {/* 1. Pick a parent */}
        <rect x={16} y={52} width={190} height={100} rx={6} className="popt-loop-box" />
        <text x={111} y={76} className="popt-loop-t">
          1. Pick a parent
        </text>
        <text x={111} y={98} className="popt-loop-s">
          from the Pareto front,
        </text>
        <text x={111} y={116} className="popt-loop-s">
          weighted by how many
        </text>
        <text x={111} y={134} className="popt-loop-s">
          examples it leads
        </text>

        {/* 2. Run a minibatch */}
        <rect x={242} y={52} width={190} height={100} rx={6} className="popt-loop-box" />
        <text x={337} y={76} className="popt-loop-t">
          2. Run a minibatch
        </text>
        <text x={337} y={98} className="popt-loop-s">
          3 training examples by
        </text>
        <text x={337} y={116} className="popt-loop-s">
          default, keeping the
        </text>
        <text x={337} y={134} className="popt-loop-s">
          full trace of each run
        </text>

        {/* 3. Evaluate: the part the reader writes */}
        <rect x={483} y={16} width={160} height={24} rx={12} className="popt-loop-tag" />
        <text x={563} y={32} className="popt-loop-tagt">
          The part you write
        </text>
        <rect x={468} y={52} width={190} height={100} rx={6} className="popt-loop-sig" />
        <text x={563} y={76} className="popt-loop-t">
          3. Evaluate
        </text>
        <text x={563} y={98} className="popt-loop-s">
          a score plus feedback
        </text>
        <text x={563} y={116} className="popt-loop-s">
          text: missing documents,
        </text>
        <text x={563} y={134} className="popt-loop-s">
          failed constraints, errors
        </text>

        {/* 4. Reflect and rewrite */}
        <rect x={694} y={52} width={190} height={100} rx={6} className="popt-loop-box" />
        <text x={789} y={76} className="popt-loop-t">
          4. Reflect and rewrite
        </text>
        <text x={789} y={98} className="popt-loop-s">
          a reflection LM rewrites
        </text>
        <text x={789} y={116} className="popt-loop-s">
          one module&apos;s instruction
        </text>
        <text x={789} y={134} className="popt-loop-s">
          from traces and feedback
        </text>

        {/* Top-row arrows */}
        <line x1={206} y1={102} x2={240} y2={102} className="popt-loop-arr" markerEnd="url(#popt-loop-ah)" />
        <line x1={432} y1={102} x2={466} y2={102} className="popt-loop-arr" markerEnd="url(#popt-loop-ah)" />
        <line x1={658} y1={102} x2={692} y2={102} className="popt-loop-arr" markerEnd="url(#popt-loop-ah)" />

        {/* 4 -> 5 */}
        <line x1={789} y1={152} x2={789} y2={234} className="popt-loop-arr" markerEnd="url(#popt-loop-ah)" />
        <text x={779} y={198} className="popt-loop-edge-end">
          child prompt
        </text>

        {/* 5. Accept or discard */}
        <rect x={694} y={236} width={190} height={120} rx={6} className="popt-loop-box" />
        <text x={789} y={260} className="popt-loop-t">
          5. Accept or discard
        </text>
        <text x={789} y={282} className="popt-loop-s">
          re-run the child on the
        </text>
        <text x={789} y={300} className="popt-loop-s">
          same minibatch; keep it
        </text>
        <text x={789} y={318} className="popt-loop-s">
          only if its score sum
        </text>
        <text x={789} y={336} className="popt-loop-s">
          is strictly higher
        </text>

        {/* Discard exit */}
        <line x1={789} y1={356} x2={789} y2={374} className="popt-loop-arr" markerEnd="url(#popt-loop-ah)" />
        <rect x={704} y={376} width={170} height={24} rx={12} className="popt-loop-stop" />
        <text x={789} y={392} className="popt-loop-stopt">
          no: discard the child
        </text>

        {/* 5 -> 6 */}
        <line x1={694} y1={296} x2={658} y2={296} className="popt-loop-arr" markerEnd="url(#popt-loop-ah)" />
        <text x={676} y={288} className="popt-loop-edge">
          yes
        </text>

        {/* 6. Score on validation */}
        <rect x={446} y={236} width={210} height={120} rx={6} className="popt-loop-box" />
        <text x={551} y={260} className="popt-loop-t">
          6. Score on validation
        </text>
        <text x={551} y={282} className="popt-loop-s">
          the kept child runs on
        </text>
        <text x={551} y={300} className="popt-loop-s">
          every validation example;
        </text>
        <text x={551} y={318} className="popt-loop-s">
          the Pareto front updates
        </text>

        {/* 6 -> pool */}
        <line x1={446} y1={296} x2={412} y2={296} className="popt-loop-arr" markerEnd="url(#popt-loop-ah)" />

        {/* Parent pool: the Pareto front over the validation set */}
        <rect x={16} y={200} width={394} height={214} rx={6} className="popt-loop-pool" />
        <text x={213} y={222} className="popt-loop-t">
          Parent pool: the Pareto front
        </text>
        <text x={213} y={240} className="popt-loop-s">
          over the validation set
        </text>
        <text x={28} y={264} className="popt-loop-hs">
          candidate
        </text>
        {[0, 1, 2, 3].map((c) => (
          <text key={`h${c}`} x={colX(c) + 29} y={264} className="popt-loop-h">
            {`val ${c + 1}`}
          </text>
        ))}
        <text x={380} y={264} className="popt-loop-h">
          leads
        </text>
        {rows.map((name, r) => (
          <g key={name}>
            <text x={56} y={rowY(r) + 15} className="popt-loop-h">
              {name}
            </text>
            {[0, 1, 2, 3].map((c) => (
              <g key={`${name}${c}`}>
                <rect
                  x={colX(c)}
                  y={rowY(r)}
                  width={58}
                  height={22}
                  rx={3}
                  className={isBest(r, c) ? 'popt-loop-best' : 'popt-loop-cell'}
                />
                {isBest(r, c) && (
                  <text x={colX(c) + 29} y={rowY(r) + 15} className="popt-loop-bt">
                    best
                  </text>
                )}
              </g>
            ))}
            <text x={380} y={rowY(r) + 15} className={r === 2 ? 'popt-loop-pr' : 'popt-loop-h'}>
              {leads[r]}
            </text>
          </g>
        ))}
        <text x={28} y={368} className="popt-loop-n">
          B stays: it is the best on val 3.
        </text>
        <text x={28} y={386} className="popt-loop-n">
          C is best only where A is too: pruned.
        </text>
        <text x={28} y={404} className="popt-loop-n">
          Next parent: A or B, sampled 3 to 1.
        </text>

        {/* pool -> 1 */}
        <line x1={111} y1={200} x2={111} y2={154} className="popt-loop-arr" markerEnd="url(#popt-loop-ah)" />
        <text x={121} y={182} className="popt-loop-edge-start">
          parent
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Table: GEPA against GRPO on Qwen3 8B (GEPA v2, Table 1)                  */
/* ------------------------------------------------------------------------ */

interface ResultRow {
  id: string;
  task: string;
  base: string;
  grpo: string;
  gepa: string;
  budget: string;
}

const RESULT_ROWS: ResultRow[] = [
  {
    id: 'hotpot',
    task: 'HotpotQA (multi-hop questions over Wikipedia)',
    base: '42.33',
    grpo: '43.33',
    gepa: '62.33',
    budget: '6,871',
  },
  {
    id: 'ifbench',
    task: 'IFBench (following output constraints)',
    base: '36.90',
    grpo: '35.88',
    gepa: '38.61',
    budget: '3,593',
  },
  {
    id: 'hover',
    task: 'HoVer (multi-hop claim verification over Wikipedia)',
    base: '35.33',
    grpo: '38.67',
    gepa: '52.33',
    budget: '7,051',
  },
  {
    id: 'pupa',
    task: 'PUPA (privacy-conscious delegation)',
    base: '80.82',
    grpo: '86.66',
    gepa: '91.85',
    budget: '2,426',
  },
  {
    id: 'aime',
    task: 'AIME-2025 (competition math)',
    base: '27.33',
    grpo: '38.00',
    gepa: '32.00',
    budget: '1,839',
  },
  {
    id: 'livebench',
    task: 'LiveBench-Math (math questions)',
    base: '48.70',
    grpo: '51.26',
    gepa: '51.95',
    budget: '1,839',
  },
  {
    id: 'aggregate',
    task: 'Aggregate',
    base: '45.23',
    grpo: '48.91',
    gepa: '54.85',
    budget: '3,936 on average',
  },
];

function ResultTable() {
  const strong = (r: ResultRow, col: 'grpo' | 'gepa') =>
    (r.id === 'aime' && col === 'grpo') || (r.id === 'aggregate' && col === 'gepa');
  return (
    <Table
      variant="embedded"
      wrapLines
      trackBy="id"
      items={RESULT_ROWS}
      columnDefinitions={[
        { id: 'task', header: 'Task', cell: (r) => r.task, minWidth: 155 },
        { id: 'base', header: 'Base model', cell: (r) => r.base },
        {
          id: 'grpo',
          header: 'LoRA GRPO (24,000 rollouts)',
          cell: (r) => (strong(r, 'grpo') ? <Box variant="strong">{r.grpo}</Box> : r.grpo),
        },
        {
          id: 'gepa',
          header: 'GEPA',
          cell: (r) => (strong(r, 'gepa') ? <Box variant="strong">{r.gepa}</Box> : r.gepa),
        },
        { id: 'budget', header: 'GEPA rollouts', cell: (r) => r.budget },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function PromptOptimization() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Know when a prompt optimiser should be your first move instead of RL, and write the feedback it learns from (gepa v0.1.4 and DSPy 3.4.1, read 2026-10-30)"
          >
            14. Optimising the Prompt
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Prompt optimisation treats the prompt as the trained artifact. The model&apos;s
            weights stay frozen. An optimiser runs the program on labelled examples, scores the
            outputs, and writes a better instruction, so the change lands in the context a model
            reads rather than in its weights. It works on a model you can only reach through an
            API, and it is the text loop with the smallest state: one instruction per module, a
            module being one LLM call in the program.
          </Box>
          <Box variant="p">
            The challenge is knowing when a better prompt is enough, and on one comparison it was
            more than enough. In the strongest same-model comparison with RL (reinforcement
            learning) located in this research, GEPA (Genetic-Pareto), a reflective prompt
            optimiser, lifted Qwen3 8B to an aggregate of 54.85 over six tasks. The same model
            trained with GRPO (Group Relative Policy Optimization, an RL method that samples a
            group of answers per prompt and pushes the weights toward the better-than-average
            ones) through LoRA (Low-Rank Adaptation) adapters reached 48.91, and the base model
            45.23. GEPA spent 1,839 to 7,051 rollouts per task, a rollout being one run of the
            program on one example; GRPO spent 24,000 <Gepa>GEPA, Table 1</Gepa>. RL still won one
            math task, and why it won marks the boundary of what a prompt can hold.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Tell prompt optimisers apart by what they read from each attempt and how they choose the next candidate"
          >
            Four ways to write a better prompt
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every prompt optimiser runs the loop RL runs: sample attempts, score them, change
            something. They differ in two places: what the optimiser reads from an attempt, a
            score or text that explains the score, and how it chooses which candidate to build on
            next. Section 11, A Text Loop Is RL on the Context, places each of them in the
            dive&apos;s shared vocabulary.
          </Box>
          <Box variant="p">
            ProTeGi (Prompt Optimization with Textual Gradients; its arXiv listing calls it
            Automatic Prompt Optimization) introduced the textual gradient. It runs the current
            prompt on a minibatch of labelled data, has an LLM criticise the prompt from the
            errors, and edits the prompt &quot;in the opposite semantic direction&quot; of the
            criticism; a beam search with bandit selection decides which edits are worth
            evaluating{' '}
            <Cite tier={3} href={PROTEGI} venue="EMNLP 2023">
              ProTeGi, abstract and Section 2
            </Cite>
            . TextGrad extends the idea to a multi-step system: it &quot;backpropagates textual
            feedback provided by LLMs&quot; to every text variable in a graph, and its authors
            call the gradient a metaphor{' '}
            <Cite tier={3} href={TEXTGRAD} venue="Nature 2025">
              TextGrad (arXiv v1), abstract and Section 1
            </Cite>
            . In its prompt experiment, gpt-4o wrote the critiques for gpt-3.5-turbo-0125&apos;s
            prompt from 36 training examples, and the cheaper model&apos;s accuracy on GSM8K
            (grade-school math word problems) rose from 72.9 to 81.1: the strong model is paid
            once, the cheap one serves{' '}
            <Cite tier={3} href={TEXTGRAD} venue="Nature 2025">
              TextGrad (arXiv v1), Section 3.3 and Table 3
            </Cite>
            .
          </Box>
          <Box variant="p">
            OPRO (Optimization by PROmpting) keeps score in the prompt. Its meta-prompt holds
            earlier instructions with their scores; at each step the optimiser LLM proposes new
            ones, which are scored and added back{' '}
            <Cite tier={3} href={OPRO} venue="ICLR 2024">
              OPRO, abstract and Section 2
            </Cite>
            . Its best GSM8K instruction for PaLM 2-L, &quot;Take a deep breath and work on this
            problem step-by-step.&quot;, scored 80.2 against 71.8 for &quot;Let&apos;s think step
            by step.&quot;{' '}
            <Cite tier={3} href={OPRO} venue="ICLR 2024">
              OPRO, Table 1
            </Cite>
            . The signal it reads is a number per instruction.
          </Box>
          <Box variant="p">
            MIPROv2 is DSPy&apos;s implementation of MIPRO (Multi-prompt Instruction PRoposal
            Optimizer){' '}
            <Code href={dspyCode('dspy/teleprompt/mipro_optimizer_v2.py', 'L60')}>
              DSPy mipro_optimizer_v2.py L60
            </Code>
            ; DSPy is a framework that treats the prompts of a multi-module LLM program as
            parameters to be compiled against a metric. MIPRO proposes instructions and few-shot
            demonstrations for each module, then learns a surrogate model of the score from
            minibatch evaluations, a cheap model of the score that picks which combinations are
            worth evaluating{' '}
            <Cite tier={3} href={MIPRO} venue="EMNLP 2024">
              MIPRO, abstract and Section 3
            </Cite>
            . It assigns credit across modules by statistics over many trials.
          </Box>
          <Box variant="p">
            GEPA reads text and keeps a population. Its evaluator returns feedback with each
            score, a reflection model reads the program&apos;s traces and that feedback to rewrite
            an instruction, and parents are drawn from a Pareto front of candidates rather than
            from the single best <Gepa>GEPA, Section 3</Gepa>. DSPy 3.4.1 ships GEPA, MIPROv2 and
            a GRPO optimiser side by side, so one program can be optimised in prompt space or in
            weight space by swapping the optimiser{' '}
            <Code href={ghTree('stanfordnlp/dspy', DSPY_TAG, 'dspy/teleprompt')}>
              DSPy dspy/teleprompt at 3.4.1
            </Code>{' '}
            <Code href={dspyCode('dspy/teleprompt/grpo.py', 'L26')}>grpo.py L26</Code>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See what a prompt optimiser bought against RL when both changed the same 8B model, and where RL still won"
          >
            GEPA against GRPO on one model
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The comparison holds the model fixed. Qwen3 8B ran every module of six programs on
            HotpotQA and HoVer (multi-hop question answering and claim verification over
            Wikipedia), IFBench (following output constraints such as &quot;answer only with yes
            or no&quot;), PUPA (answering a query through an untrusted model without leaking
            personal information), AIME-2025 (a US competition-math exam) and LiveBench-Math (the
            math questions of the regularly updated LiveBench benchmark){' '}
            <Gepa>GEPA, Section 4 and Appendix E.1</Gepa>. GRPO, run through DSPy&apos;s own GRPO
            optimiser, trained rank-16 LoRA adapters for 500 steps, a fixed 24,000 rollouts{' '}
            <Code href={artifactCode('scripts/experiment_configs.py', 'L11-L31')}>
              gepa-artifact experiment_configs.py L11-L31
            </Code>{' '}
            <Code href={artifactCode('scripts/experiment_configs.py', 'L152-L171')}>
              L152-L171
            </Code>{' '}
            <Gepa>GEPA, Appendix E.4</Gepa>. The reflection model, the LLM
            that reads traces and writes the new instruction, was Qwen3 8B itself: the
            paper&apos;s reproduction code defaults it to the task model, and no experiment
            configuration overrides it{' '}
            <Code href={artifactCode('gepa_artifact/gepa/gepa.py', 'L540-L546')}>
              gepa-artifact gepa.py L540-L546
            </Code>{' '}
            <Code href={artifactCode('scripts/run_experiments.py', 'L373-L374')}>
              run_experiments.py L373-L374
            </Code>
            . Both arms used one model.
          </Box>
          <ResultTable />
          <Box variant="small" color="text-body-secondary">
            Test-set scores from GEPA, Table 1. GRPO used 24,000 rollouts on every task.
          </Box>
          <Box variant="p">
            GEPA reached 54.85 in aggregate against 48.91 for GRPO and 45.23 for the base model,
            on 1,839 to 7,051 rollouts per task against 24,000. Its largest margins were on the
            two retrieval programs, 19.0 points over GRPO on HotpotQA and 13.66 on HoVer{' '}
            <Gepa>GEPA, Table 1 and Observation 1</Gepa>. GRPO won AIME-2025, 38.00 against
            32.00, and the two were within a point on LiveBench-Math, 51.95 against 51.26. A
            full-parameter GRPO run on one task, a 2-hop HoVer program, showed a similar gap{' '}
            <Gepa>GEPA, Appendix E.1 and Figure 11</Gepa>.
          </Box>
          <Box variant="p">
            The result has a scope. Each task had 45 to 150 training examples, plus a validation
            set (our arithmetic for AIME, whose 90 earlier problems were split equally between
            training and validation) <Gepa>GEPA, Appendix E.1</Gepa>. GRPO&apos;s tuning covered
            three settings: the learning rate, beta (the weight on the KL, Kullback-Leibler
            divergence, penalty that keeps the trained model near the original) and gradient
            clipping <Gepa>GEPA, Appendix E.4</Gepa>. No re-run of these tasks with a GRPO
            configuration tuned for 100 to 300 examples was located during this research, so
            whether one would close the gap is open.
          </Box>
          <ExpandableSection headerText="Which budget to quote: the paper's totals and the README's range">
            <SpaceBetween size="s">
              <Box variant="p">
                The project README advertises &quot;35x faster than RL&quot;, with
                &quot;100-500 evaluations vs. 5,000-25,000+ for GRPO&quot;{' '}
                <Cite
                  tier={2}
                  href={gepaCode('README.md', 'L42')}
                  kind="vendor-claim"
                >
                  gepa README.md L42
                </Cite>
                . The paper&apos;s totals are larger: 1,839 to 7,051 rollouts per task. Most of
                that budget is validation, scores that are &quot;utilized solely for candidate
                selection and not for producing learning signals&quot;. Counting training
                rollouts only, GEPA needed 79 to 737 to reach its best result, close to the
                README&apos;s range <Gepa>GEPA, Observation 1</Gepa>. The 35x matches one task:
                on IFBench GEPA found its best prompt after 678 rollouts, and 24,000 / 678 = 35.4
                (our arithmetic) <Gepa>GEPA, Table 1 caption</Gepa>.
              </Box>
              <Box variant="p">
                For a like-for-like budget, quote total rollouts including validation: 1,839 to
                7,051 against GRPO&apos;s 24,000. GEPA&apos;s caps came from MIPROv2&apos;s own
                spend on each task, so the two prompt optimisers ran at budgets matched within
                10.15%, while GRPO ran at its fixed one <Gepa>GEPA, Appendix E.4</Gepa>{' '}
                <Code
                  href={artifactCode('scripts/experiment_configs.py', 'L188-L196')}
                >
                  gepa-artifact experiment_configs.py L188-L196
                </Code>
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
            description="Predict which gaps an optimised prompt can close, and recognise the ones that need weights"
          >
            What one prompt can hold
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every input reads the same instruction, so what a prompt optimiser learns is what
            every input shares: task facts, rules, and a strategy that works across examples.
            Two results fit that picture. Prompts optimised with and for Qwen3 8B, applied
            unchanged to GPT-4.1 Mini, raised its aggregate by 9.00 points across the six
            tasks <Gepa>GEPA, Table 2 and Observation 6</Gepa>; the instruction carried task
            knowledge another model could read. And GEPA&apos;s prompts were up to 9.2 times
            shorter than MIPROv2&apos;s, which carry optimised few-shot demonstrations, so they
            cost less on every call that reads them <Gepa>GEPA, Observation 4</Gepa>.
          </Box>
          <Box variant="p">
            The same property sets the limit. A static prompt is one policy, the rule that maps an
            input to an output, for every input. When the right behaviour depends on a variable
            hidden in each instance, such as one user&apos;s preferences, one instruction cannot
            carry it: on three personalisation tasks GEPA landed &quot;marginally above the
            un-optimized baselines, if at all&quot;, while a 7B advisor model trained with RL
            learned the preferences{' '}
            <Cite tier={3} href={ADVISOR} venue="ICML 2026">
              Advisor Models, Section 4.3.1 and Figure 5
            </Cite>
            . Section 16, Hybrids, covers putting weights in front of a frozen model for that
            case.
          </Box>
          <Box variant="p">
            Reasoning skill is the other gap. GRPO&apos;s AIME win came although the feedback GEPA
            read there was as rich as text gets: the reproduction code&apos;s AIME feedback says
            whether the answer was right, gives the correct answer, and, where the dataset has
            one, appends the full worked solution{' '}
            <Code href={artifactCode('gepa_artifact/benchmarks/AIME/__init__.py', 'L16-L39')}>
              gepa-artifact AIME __init__.py L16-L39
            </Code>{' '}
            <Code href={artifactCode('gepa_artifact/benchmarks/AIME/AIME_data.py', 'L8-L16')}>
              AIME_data.py L8-L16
            </Code>
            . GEPA moved AIME-2025 from 27.33 to 32.00 and GRPO to 38.00{' '}
            <Gepa>GEPA, Table 1</Gepa>. Our reading: an instruction carries what a model can be
            told, and reading worked solutions during optimisation moved this task less than
            training did; here the weight update won.
          </Box>
          <Box variant="p">
            The optimiser&apos;s own capability bounds the loop as well. OPRO showed limited
            effectiveness with LLaMa-2 and Mistral 7B as optimisers, with &quot;limited inference capabilities
            constraining optimization ability&quot;{' '}
            <Cite tier={3} href={REVISITING_OPRO} venue="ACL Findings 2024">
              Revisiting OPRO, abstract
            </Cite>
            . GEPA&apos;s Qwen3 8B results, though, came from the 8B model reflecting on its own
            traces, so in our reading the optimiser&apos;s capability bounds a text loop without a
            fixed size threshold. DSPy&apos;s GEPA wrapper requires a reflection model (unless you supply
            your own proposer) and its docstring recommends a strong one{' '}
            <Code href={dspyCode('dspy/teleprompt/gepa/gepa.py', 'L262-L264')}>
              DSPy gepa.py L262-L264
            </Code>
            ; the headline result did not use one. How prompt-optimisation gains change with the
            size of the target model, optimiser held fixed, was not measured in any study located
            during this research.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict which rewrites GEPA keeps and which candidates it builds on, from the rules in its code"
          >
            How GEPA decides what to keep
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            GEPA&apos;s loop has the shape of an RL step with words in place of gradients. Each
            iteration runs the six steps drawn below, and four rules in the gepa v0.1.4 code
            decide what survives.
          </Box>
          <GepaLoopDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic of the loop in gepa v0.1.4 with its defaults. The grid of candidates and
            validation examples is illustrative, not measured.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              The evaluator returns text with the score.
            </Box>{' '}
            The paper calls it the evaluation trace, for example &quot;compiler error messages
            before giving reward 0&quot;. Its feedback functions name the documents a retrieval
            hop still missed, the output constraints an answer failed, or the split of a score
            into quality and privacy leakage <Gepa>GEPA, Section 3 and Appendix E.1</Gepa>. GRPO
            sees the 0; the reflection model reads why it was 0. In DSPy the metric returns a
            score and a feedback string; a metric that returns only a number leaves the
            reflection model with &quot;This trajectory got a score of {'{score}'}.&quot;{' '}
            <Code href={dspyCode('dspy/teleprompt/gepa/gepa.py', 'L57-L65')}>
              DSPy gepa.py L57-L65
            </Code>
            .
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              The reflection model writes task knowledge into the instruction.
            </Box>{' '}
            It rewrites one module&apos;s instruction per iteration, taking the modules in turn{' '}
            <Code href={gepaCode('src/gepa/api.py', 'L66')}>gepa api.py L66</Code>. Its default
            prompt tells it to &quot;Identify all niche and domain specific factual information
            about the task and include it in the instruction&quot;{' '}
            <Code href={gepaCode('src/gepa/strategies/instruction_proposal.py', 'L13-L29')}>
              gepa instruction_proposal.py L13-L29
            </Code>
            . Credit assignment, finding which module or decision earned the result, happens by
            reading the trace <Gepa>GEPA, Section 3</Gepa>.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              A rewrite is kept only on a strict gain.
            </Box>{' '}
            The child runs on the same minibatch as its parent, three training examples by
            default, and is kept only if the sum of its scores is strictly greater than the
            parent&apos;s; a tie is a rejection{' '}
            <Code href={gepaCode('src/gepa/strategies/acceptance.py', 'L44-L53')}>
              gepa acceptance.py L44-L53
            </Code>{' '}
            <Code href={gepaCode('src/gepa/api.py', 'L97-L98')}>api.py L97-L98</Code>{' '}
            <Code href={gepaCode('src/gepa/api.py', 'L350-L351')}>api.py L350-L351</Code>. In RL
            terms that is greedy hill-climbing on a three-example estimate, and a three-example
            sum can rise by chance; in our reading of the code, the validation set is the check
            on that.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              Parents come from the Pareto front over the validation set.
            </Box>{' '}
            A kept child is scored on every validation example{' '}
            <Code href={gepaCode('src/gepa/core/engine.py', 'L516-L517')}>
              gepa engine.py L516-L517
            </Code>
            . For each validation example GEPA records the top score and every candidate that
            reaches it{' '}
            <Code href={gepaCode('src/gepa/core/state.py', 'L486-L510')}>state.py L486-L510</Code>.
            To choose a parent it prunes dominated candidates, those that are best only where
            another surviving candidate is also best, and samples among the rest in proportion to
            how many examples each leads{' '}
            <Code href={gepaCode('src/gepa/gepa_utils.py', 'L90-L117')}>
              gepa_utils.py L90-L117
            </Code>
            . The validation set is the <code>valset</code> argument; pass none and GEPA reuses the
            training set for it{' '}
            <Code href={gepaCode('src/gepa/api.py', 'L142')}>api.py L142</Code>{' '}
            <Code href={gepaCode('src/gepa/api.py', 'L220-L221')}>api.py L220-L221</Code>. A
            candidate with a
            lower average survives if it is best on any one example, so a strategy that works for
            one kind of input stays available as a parent.
          </Box>
          <Box variant="p">
            The Pareto front is GEPA&apos;s exploration term, the part of a learner that keeps
            trying options other than the current best, and it carried much of the gain. On four
            Qwen3 8B tasks, Pareto selection improved the aggregate by 12.44 points, against 6.05
            for always building on the best candidate and 5.11 for a beam of four candidates, the
            selection ProTeGi uses. Building on the best stalled after one improvement{' '}
            <Gepa>GEPA, Observation 3, Table 3 and Figure 6</Gepa>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Decide whether a prompt optimiser is your first move, then build the feedback and validation set it learns from"
          >
            When to start here, and what to feed the optimiser
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            In our reading of these studies, prompt optimisation is the first thing to try when
            three conditions hold. The gap is something the model can do once told: missing task
            facts, a retrieval strategy, output rules. Instruction optimisation matters most for
            &quot;tasks with conditional rules that are (i) not immediately obvious to the LM and
            (ii) not expressible via a limited number of few-shot examples&quot;{' '}
            <Cite tier={3} href={MIPRO} venue="EMNLP 2024">
              MIPRO, Section 6, Lesson 3
            </Cite>
            , and GEPA&apos;s widest margins over GRPO were on the two retrieval programs.
            Labelled examples are scarce, or the weights are out of reach: GEPA&apos;s tasks had
            45 to 150 training examples, and on GPT-4.1 Mini, an API model the paper compared only
            against other prompt optimisers, all of GEPA&apos;s runs across the six tasks cost
            $86 <Gepa>GEPA, Table 2 and Appendix E.3</Gepa>. And
            you have an evaluator that can say why an answer failed. When the model cannot do the
            task even after reading worked solutions, or the right output depends on something
            hidden per input, plan for weights instead: section 16, Hybrids, and section 20, Cost
            per Improvement, which prices the two routes over the queries the result will serve.
          </Box>
          <Box variant="p">
            The work that decides the outcome is the feedback function. Build it in this order.
          </Box>
          <ul>
            <li>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  Return text with every score.
                </Box>{' '}
                Say what was wrong and what right looks like: the documents still missing, the
                constraint that failed, the compiler error, the correct answer with a worked
                solution. Without it the reflection model reads only the score{' '}
                <Code href={dspyCode('dspy/teleprompt/gepa/gepa.py', 'L57-L65')}>
                  DSPy gepa.py L57-L65
                </Code>
                .
              </Box>
            </li>
            <li>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  Give feedback per module where the program has several.
                </Box>{' '}
                In a multi-hop system the evaluator can comment after each hop, and GEPA can also
                take human graders&apos; written explanations as feedback{' '}
                <Gepa>GEPA, Section 3</Gepa>.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  Start from a seed prompt that states the rules you know.
                </Box>{' '}
                MIPRO&apos;s authors found their optimisers &quot;not yet able to infer all task
                rules&quot; from a bare seed{' '}
                <Cite tier={3} href={MIPRO} venue="EMNLP 2024">
                  MIPRO, Section 6, Lesson 3
                </Cite>
                .
              </Box>
            </li>
            <li>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  Hold out a validation set and pass it.
                </Box>{' '}
                It decides which candidates stay parents; without one, GEPA scores the Pareto front
                on the same examples it learns from{' '}
                <Code href={gepaCode('src/gepa/api.py', 'L220-L221')}>gepa api.py L220-L221</Code>
                . It is
                also where most of the budget goes, and a smaller validation set is the lever the
                authors name for a cheaper run <Gepa>GEPA, Observation 1</Gepa>.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  Budget on total metric calls, validation included.
                </Box>{' '}
                On Qwen3 8B that was 1,839 to 7,051 rollouts per task for an aggregate of 54.85,
                against 24,000 for GRPO&apos;s 48.91 <Gepa>GEPA, Table 1</Gepa>.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  Check the merge default for your entry point.
                </Box>{' '}
                DSPy&apos;s GEPA wrapper turns merge (crossover between candidates) on, while{' '}
                <code>gepa.optimize</code> leaves it off{' '}
                <Code href={dspyCode('dspy/teleprompt/gepa/gepa.py', 'L417')}>DSPy gepa.py L417</Code>{' '}
                <Code href={gepaCode('src/gepa/api.py', 'L68')}>gepa api.py L68</Code>; on Qwen3 8B
                merge lowered the aggregate from 54.85 to 52.40 <Gepa>GEPA, Table 1</Gepa>.
              </Box>
            </li>
          </ul>
          <Box variant="p">
            Then run the optimiser against the base prompt on the validation set and read the
            per-task results the way Table 1 reads: where a better instruction closes the gap,
            keep the prompt; where the model still fails after its feedback has shown it the
            answer, the next step is a weight update.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
