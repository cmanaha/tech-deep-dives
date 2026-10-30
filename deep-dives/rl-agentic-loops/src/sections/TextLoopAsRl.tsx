import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import { Cite, arxiv, gh, AUTORESEARCH_SHA } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

const REFLEXION = arxiv('2303.11366v4');
const RETROFORMER = arxiv('2308.02151v3');
/** TextGrad: the quote is read from arXiv v1; the journal version is Nature 639 (2025). */
const TEXTGRAD = arxiv('2406.07496v1');
const VON_OSWALD = arxiv('2212.07677v2');
const SHEN = arxiv('2310.08540v5');
const SURVEY = arxiv('2512.16301v3');
const SELF_REFINE = arxiv('2303.17651v2');
const EXPEL = arxiv('2308.10144v3');
const CLIN = arxiv('2310.10134v1');
const REASONING_BANK = arxiv('2509.25140v2');
const CHEATSHEET = arxiv('2504.07952v1');
const VOYAGER = arxiv('2305.16291v2');
const ACE = arxiv('2510.04618v3');
const TF_GRPO = arxiv('2510.08191v1');
const PROTEGI = arxiv('2305.03495v2');
const OPRO = arxiv('2309.03409v3');
const MIPRO = arxiv('2406.11695v2');
const GEPA = arxiv('2507.19457v2');
const FUNSEARCH = 'https://www.nature.com/articles/s41586-023-06924-6';
const ALPHAEVOLVE = arxiv('2506.13131v1');
const RALPH = 'https://ghuntley.com/ralph/';
const ADVISOR = arxiv('2510.02453v3');
const MEMENTO = arxiv('2508.16153v2');
const BANDITS = arxiv('2403.15371v3');
const AR_PROGRAM = gh('karpathy/autoresearch', AUTORESEARCH_SHA, 'program.md', 'L103-L104');
const AR_BUDGET = gh('karpathy/autoresearch', AUTORESEARCH_SHA, 'prepare.py', 'L31');

/* ------------------------------------------------------------------------ */
/* Diagram: three stores against two signal sources                         */
/* ------------------------------------------------------------------------ */

type ChipKind = 'words' | 'self' | 'rl';

interface Chip {
  label: string;
  kind: ChipKind;
}

interface StoreRow {
  id: string;
  title: string;
  sub: [string, string];
  exec: Chip[];
  out: Chip[];
}

const w = (label: string): Chip => ({ label, kind: 'words' });
const s = (label: string): Chip => ({ label, kind: 'self' });
const r = (label: string): Chip => ({ label, kind: 'rl' });

const STORE_ROWS: StoreRow[] = [
  {
    id: 'weights',
    title: 'Weights',
    sub: ['RL changes the model', 'sections 3 to 10'],
    exec: [r('DeepSeek-R1 (test pass rate)')],
    out: [r('Search-R1 (exact match)'), r('ReTool (answer only)')],
  },
  {
    id: 'context',
    title: 'Context',
    sub: ['a frozen model reads it', 'sections 12 to 15'],
    exec: [
      w('Reflexion (unit tests)'),
      w('ExpeL (task success)'),
      w('CLIN'),
      w('Voyager'),
      w('ACE (execution)'),
      w('TextGrad (unit tests)'),
      w('autoresearch'),
      w('FunSearch'),
      w('AlphaEvolve'),
      w('Ralph'),
    ],
    out: [
      w('Reflexion (gold answer)'),
      w('ExpeL (gold answer)'),
      s('Self-Refine'),
      s('Dynamic Cheatsheet'),
      s('ReasoningBank (judge)'),
      s('TextGrad (judge)'),
      w('ACE (labels)'),
      w('Training-Free GRPO'),
      w('ProTeGi'),
      w('OPRO'),
      w('MIPROv2'),
      w('GEPA'),
    ],
  },
  {
    id: 'small',
    title: 'Small trained model',
    sub: ['writes context for a', 'frozen one, section 16'],
    exec: [w('Retroformer (environment)')],
    out: [w('Retroformer (answer F1)'), w('Advisor Models'), w('Memento')],
  },
];

// Layout constants in viewBox units. Text is 11px sans-serif; 6.4 units per character is a
// generous width budget, so every chip is sized to its label with room to spare.
const SG_W = 920;
const SG_HEAD_X = 12;
const SG_HEAD_W = 172;
const SG_COL_W = 352;
const SG_COL_X: [number, number] = [196, 556];
const SG_TOP = 76;
const SG_PAD = 10;
const SG_CHIP_H = 24;
const SG_LINE_H = 32;
const SG_CHIP_GAP = 8;
const SG_ROW_GAP = 12;
const SG_ROW_MIN_H = 72;
const SG_CHAR_W = 6.4;

const chipWidth = (label: string) => Math.ceil(label.length * SG_CHAR_W + 22);

interface PlacedChip extends Chip {
  x: number;
  y: number;
  w: number;
}

function placeChips(chips: Chip[], x0: number, y0: number): { placed: PlacedChip[]; lines: number } {
  const left = x0 + SG_PAD;
  const right = x0 + SG_COL_W - SG_PAD;
  let x = left;
  let y = y0 + SG_PAD;
  let lines = 1;
  const placed: PlacedChip[] = [];
  for (const c of chips) {
    const cw = chipWidth(c.label);
    if (x + cw > right && x > left) {
      x = left;
      y += SG_LINE_H;
      lines += 1;
    }
    placed.push({ ...c, x, y, w: cw });
    x += cw + SG_CHIP_GAP;
  }
  return { placed, lines };
}

interface PlacedRow {
  row: StoreRow;
  y: number;
  h: number;
  chips: PlacedChip[];
}

function layoutRows(): { rows: PlacedRow[]; bottom: number } {
  const rows: PlacedRow[] = [];
  let y = SG_TOP;
  for (const row of STORE_ROWS) {
    const a = placeChips(row.exec, SG_COL_X[0], y);
    const b = placeChips(row.out, SG_COL_X[1], y);
    const lines = Math.max(a.lines, b.lines);
    const h = Math.max(SG_ROW_MIN_H, lines * SG_LINE_H - (SG_LINE_H - SG_CHIP_H) + 2 * SG_PAD);
    rows.push({ row, y, h, chips: [...a.placed, ...b.placed] });
    y += h + SG_ROW_GAP;
  }
  return { rows, bottom: y - SG_ROW_GAP };
}

const SG_LAYOUT = layoutRows();
const SG_LEGEND_Y = SG_LAYOUT.bottom + 22;
const SG_H = SG_LEGEND_Y + 30;

const SG_LEGEND: Array<{ kind: ChipKind; text: string }> = [
  { kind: 'words', text: 'Words-track method' },
  { kind: 'self', text: 'No ground truth: graded by the model or an LLM judge' },
  { kind: 'rl', text: 'RL on the weights (sections 7 and 9)' },
];

function legendLayout(): Array<{ kind: ChipKind; text: string; x: number }> {
  let x = SG_HEAD_X;
  return SG_LEGEND.map((item) => {
    const at = x;
    x += 28 + 8 + Math.ceil(item.text.length * 6.2) + 28;
    return { ...item, x: at };
  });
}

const SG_LEGEND_ITEMS = legendLayout();

function StoreSignalDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${SG_W} ${SG_H}`}
        role="img"
        aria-labelledby="textloop-grid-title"
        style={{ width: '100%', minWidth: 700, height: 'auto' }}
      >
        <title id="textloop-grid-title">
          A grid with three rows for where a loop keeps what it learns (the weights, the context a
          frozen model reads, and a small trained model that writes context for a frozen one) and
          two columns for where its signal comes from (execution-grounded: tests, a compiler or an
          environment; output-evaluated: a gold answer, a rubric or a judge). The weights row holds
          RL reference points. The context row holds most of the words track and fills both
          columns. Reflexion, ExpeL, ACE, TextGrad and Retroformer appear in both columns because
          their papers ran them with both kinds of signal. Self-Refine, Dynamic Cheatsheet,
          ReasoningBank and TextGrad with a judge are marked as graded without ground truth.
        </title>
        <style>{`
          .textloop-grid-bg { fill: #ffffff; }
          .textloop-grid-cell { fill: #fafafa; stroke: #d1d5db; stroke-width: 1; }
          .textloop-grid-rowh { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.2; }
          .textloop-grid-exec { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.2; }
          .textloop-grid-out { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.2; }
          .textloop-grid-t { fill: #0f1b2a; font: 600 13px sans-serif; }
          .textloop-grid-tc { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .textloop-grid-s { fill: #414d5c; font: 11px sans-serif; }
          .textloop-grid-sc { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .textloop-grid-cw { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.2; }
          .textloop-grid-cs { fill: #ffffff; stroke: #8b6c00; stroke-width: 1.4; stroke-dasharray: 4 3; }
          .textloop-grid-cr { fill: #f2f3f3; stroke: #879596; stroke-width: 1.2; }
          .textloop-grid-ct { fill: #16191f; font: 11px sans-serif; text-anchor: middle; }
          .textloop-grid-ctr { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .textloop-grid-lg { fill: #414d5c; font: 11px sans-serif; }
        `}</style>

        <rect x={0} y={0} width={SG_W} height={SG_H} rx={8} className="textloop-grid-bg" />

        {/* Corner labels */}
        <text x={SG_HEAD_X + 8} y={34} className="textloop-grid-t">
          Store, by row
        </text>
        <text x={SG_HEAD_X + 8} y={52} className="textloop-grid-s">
          Signal source, by column
        </text>

        {/* Column headers */}
        <rect x={SG_COL_X[0]} y={12} width={SG_COL_W} height={52} rx={6} className="textloop-grid-exec" />
        <text x={SG_COL_X[0] + SG_COL_W / 2} y={33} className="textloop-grid-tc">
          Execution-grounded
        </text>
        <text x={SG_COL_X[0] + SG_COL_W / 2} y={52} className="textloop-grid-sc">
          tests, a compiler, an environment
        </text>
        <rect x={SG_COL_X[1]} y={12} width={SG_COL_W} height={52} rx={6} className="textloop-grid-out" />
        <text x={SG_COL_X[1] + SG_COL_W / 2} y={33} className="textloop-grid-tc">
          Output-evaluated
        </text>
        <text x={SG_COL_X[1] + SG_COL_W / 2} y={52} className="textloop-grid-sc">
          a gold answer, a rubric, a judge
        </text>

        {/* Rows */}
        {SG_LAYOUT.rows.map(({ row, y, h, chips }) => (
          <g key={row.id}>
            <rect x={SG_HEAD_X} y={y} width={SG_HEAD_W} height={h} rx={6} className="textloop-grid-rowh" />
            <text x={SG_HEAD_X + 10} y={y + 24} className="textloop-grid-t">
              {row.title}
            </text>
            <text x={SG_HEAD_X + 10} y={y + 42} className="textloop-grid-s">
              {row.sub[0]}
            </text>
            <text x={SG_HEAD_X + 10} y={y + 58} className="textloop-grid-s">
              {row.sub[1]}
            </text>
            <rect x={SG_COL_X[0]} y={y} width={SG_COL_W} height={h} rx={6} className="textloop-grid-cell" />
            <rect x={SG_COL_X[1]} y={y} width={SG_COL_W} height={h} rx={6} className="textloop-grid-cell" />
            {chips.map((c) => (
              <g key={`${row.id}-${c.label}`}>
                <rect
                  x={c.x}
                  y={c.y}
                  width={c.w}
                  height={SG_CHIP_H}
                  rx={12}
                  className={
                    c.kind === 'self'
                      ? 'textloop-grid-cs'
                      : c.kind === 'rl'
                        ? 'textloop-grid-cr'
                        : 'textloop-grid-cw'
                  }
                />
                <text
                  x={c.x + c.w / 2}
                  y={c.y + 16}
                  className={c.kind === 'rl' ? 'textloop-grid-ctr' : 'textloop-grid-ct'}
                >
                  {c.label}
                </text>
              </g>
            ))}
          </g>
        ))}

        {/* Legend */}
        {SG_LEGEND_ITEMS.map((item) => (
          <g key={item.kind}>
            <rect
              x={item.x}
              y={SG_LEGEND_Y - 12}
              width={28}
              height={16}
              rx={8}
              className={
                item.kind === 'self'
                  ? 'textloop-grid-cs'
                  : item.kind === 'rl'
                    ? 'textloop-grid-cr'
                    : 'textloop-grid-cw'
              }
            />
            <text x={item.x + 36} y={SG_LEGEND_Y} className="textloop-grid-lg">
              {item.text}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Table: RL terms in a text loop                                           */
/* ------------------------------------------------------------------------ */

interface TermRow {
  term: string;
  loop: string;
}

const TERMS: TermRow[] = [
  { term: 'Policy', loop: 'The frozen weights together with the context they read' },
  {
    term: 'Parameters being trained',
    loop: 'The context: reflections, a prompt, a playbook, a memory, skill files',
  },
  {
    term: 'Learner',
    loop: 'Whatever writes the context: the model itself, a small trained model, or a person',
  },
  { term: 'Environment', loop: 'The task, plus the frozen model that acts in it' },
  { term: 'Reward', loop: "The signal: a test result, a check against a gold answer, a judge's score" },
  { term: 'Update', loop: 'A rewrite of the context, written by a model reading feedback' },
  {
    term: 'Step size',
    loop: "How much of the context one update rewrites, the learning rate's role",
  },
  {
    term: 'Exploration',
    loop: 'Trying attempts whose value is still unknown, instead of repeating the best so far',
  },
];

function TermsTable() {
  return (
    <Table<TermRow>
      variant="embedded"
      wrapLines
      trackBy="term"
      items={TERMS}
      columnDefinitions={[
        { id: 'term', header: 'RL term', cell: (t) => t.term, minWidth: 150 },
        { id: 'loop', header: 'In a text loop', cell: (t) => t.loop, minWidth: 300 },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------ */
/* Table: five fields for every words-track method                           */
/* ------------------------------------------------------------------------ */

interface MethodRow {
  id: string;
  name: string;
  section: string;
  source: ReactNode;
  state: string;
  update: string;
  signal: string;
  frozen: string;
  cost: ReactNode;
}

const METHODS: MethodRow[] = [
  {
    id: 'reflexion',
    name: 'Reflexion',
    section: 'Section 12',
    source: (
      <Cite tier={3} href={REFLEXION} venue="NeurIPS 2023">
        Reflexion, Sections 3 and 4
      </Cite>
    ),
    state: 'One to three written reflections',
    update: 'Append a lesson after each failed trial',
    signal: 'Exact match against the gold answer, or the unit tests it writes and runs',
    frozen: 'Actor and reflector LLMs; the evaluator too, where it is an LLM',
    cost: 'No cost figures reported',
  },
  {
    id: 'self-refine',
    name: 'Self-Refine',
    section: 'Section 12',
    source: (
      <Cite tier={3} href={SELF_REFINE} venue="NeurIPS 2023">
        Self-Refine, Abstract and Section 2
      </Cite>
    ),
    state: 'Nothing across tasks; one output refined in place',
    update: 'Rewrite the output from its own feedback, and repeat',
    signal: "The model's own feedback",
    frozen: 'One LLM as generator, critic and reviser',
    cost: 'A feedback call and a rewrite call per round',
  },
  {
    id: 'expel',
    name: 'ExpeL',
    section: 'Section 13',
    source: (
      <Cite tier={3} href={EXPEL} venue="AAAI 2024">
        ExpeL, Sections 4.2 and 5
      </Cite>
    ),
    state: 'Insights with importance counts, plus stored successful trajectories',
    update: 'An LLM adds, edits, upvotes or downvotes insights; one at count zero is removed',
    signal: 'Task success, with successes compared against failures',
    frozen: 'gpt-3.5-turbo actor; gpt-4 writes the insights',
    cost: 'No cost figures reported',
  },
  {
    id: 'clin',
    name: 'CLIN',
    section: 'Section 13',
    source: (
      <Cite tier={3} href={CLIN} venue="COLM 2024">
        CLIN, Sections 3.1 and 3.2
      </Cite>
    ),
    state: "Causal lessons such as 'X is necessary to Y'",
    update: 'Regenerate the memory after each trial from the last trial and the three latest memories',
    signal: 'Simulator reward and observations',
    frozen: 'gpt-4 in every role',
    cost: 'No cost figures reported',
  },
  {
    id: 'reasoningbank',
    name: 'ReasoningBank',
    section: 'Section 13',
    source: (
      <Cite tier={3} href={REASONING_BANK} venue="ICLR 2026">
        ReasoningBank, Section 3.2
      </Cite>
    ),
    state: 'Memory items: a title, a description and the content',
    update: 'Append new items from successes and failures; retrieve by embedding',
    signal: "An LLM judge's success label, with no ground truth",
    frozen: 'The backbone model (Gemini 2.5, Claude 3.7 Sonnet)',
    cost: 'Retrieved items ride in each prompt',
  },
  {
    id: 'cheatsheet',
    name: 'Dynamic Cheatsheet',
    section: 'Section 13',
    source: (
      <Cite tier={3} href={CHEATSHEET} venue="EACL 2026">
        Dynamic Cheatsheet, Sections 2 and 5
      </Cite>
    ),
    state: 'A curated cheatsheet of strategies and code',
    update: 'A curator rewrites it after, or before, each query',
    signal: "The model's own check of its answer, with no labels",
    frozen: 'One model answers and curates (GPT-4o, Claude 3.5 Sonnet)',
    cost: 'AIME 2024 (competition math) with Claude Sonnet: an average of 1,035 to 1,831 tokens per problem, against 370 without it',
  },
  {
    id: 'voyager',
    name: 'Voyager',
    section: 'Section 13',
    source: (
      <Cite tier={3} href={VOYAGER} venue="TMLR">
        Voyager, Sections 2 and 4
      </Cite>
    ),
    state: 'A library of executable programs, keyed by an embedding of their description',
    update: 'Add a program once it passes self-verification',
    signal: 'Execution errors, environment state and GPT-4 self-verification',
    frozen: 'GPT-4 writes code; GPT-3.5 writes descriptions',
    cost: "Needs GPT-4, which the authors put at 15 times GPT-3.5's price",
  },
  {
    id: 'ace',
    name: 'ACE',
    section: 'Section 13',
    source: (
      <Cite tier={3} href={ACE} venue="ICLR 2026">
        ACE, Sections 3 and 4.7
      </Cite>
    ),
    state: 'A playbook of itemised bullets with helpful and harmful counters',
    update: 'Merge small delta bullets with non-LLM code; de-duplicate by embedding',
    signal: 'Execution feedback, with or without ground-truth labels',
    frozen: 'DeepSeek-V3.1 as generator, reflector and curator',
    cost: '357 rollouts to adapt on AppWorld (agent tasks run through the APIs of simulated apps), against 1,434 for GEPA',
  },
  {
    id: 'tf-grpo',
    name: 'Training-Free GRPO',
    section: 'Section 13',
    source: (
      <Cite tier={3} href={TF_GRPO} venue="preprint">
        Training-Free GRPO, Sections 2 and 4.2
      </Cite>
    ),
    state: 'A library of written lessons',
    update: "For groups with winners and losers, write why the winners won, in place of GRPO's numeric advantage; add, delete or modify lessons",
    signal: 'A ground-truth reward on the answer',
    frozen: 'The answering model (DeepSeek-V3.1-Terminus, 671B, in the cost figures)',
    cost: 'About $18 to learn; about $0.02 per problem served',
  },
  {
    id: 'textgrad',
    name: 'TextGrad',
    section: 'Section 14',
    source: (
      <Cite tier={3} href={TEXTGRAD} venue="Nature 2025">
        TextGrad (arXiv v1), Section 2
      </Cite>
    ),
    state: 'Any text variable: an answer, code, a prompt',
    update: 'LLM critiques passed back through a graph of steps; an optimiser step rewrites the variable',
    signal: 'An LLM judge, unit tests or a ground-truth metric',
    frozen: 'The model being improved and the model writing critiques',
    cost: 'At most one extra LLM call per graph edge per iteration',
  },
  {
    id: 'protegi',
    name: 'ProTeGi',
    section: 'Section 14',
    source: (
      <Cite tier={3} href={PROTEGI} venue="EMNLP 2023">
        ProTeGi, Sections 2 and 3
      </Cite>
    ),
    state: 'A beam of candidate prompts',
    update: 'Critique the prompt from minibatch errors, edit it the other way, keep the best by bandit selection',
    signal: 'Errors against labelled examples',
    frozen: 'The task LLM (gpt-3.5-turbo by default)',
    cost: '12 to 50 evaluations per prompt candidate',
  },
  {
    id: 'opro',
    name: 'OPRO',
    section: 'Section 14',
    source: (
      <Cite tier={3} href={OPRO} venue="ICLR 2024">
        OPRO, Sections 2 and 5
      </Cite>
    ),
    state: 'A meta-prompt holding the best 20 instructions with their scores',
    update: 'Ask the optimiser LLM for 8 new instructions per step',
    signal: 'Accuracy on a training sample',
    frozen: 'Scorer and optimiser LLMs (PaLM 2, gpt-3.5-turbo, gpt-4)',
    cost: '200 steps by default',
  },
  {
    id: 'mipro',
    name: 'MIPROv2',
    section: 'Section 14',
    source: (
      <Cite tier={3} href={MIPRO} venue="EMNLP 2024">
        MIPRO, Section 3
      </Cite>
    ),
    state: 'Instructions and few-shot examples for each module',
    update: 'Propose candidates; a surrogate model picks which combinations to score on minibatches',
    signal: 'The task metric on a training set',
    frozen: 'The proposer and task models',
    cost: (
      <>
        2,270 to 6,926 rollouts in GEPA&apos;s comparison{' '}
        <Cite tier={3} href={GEPA} venue="ICLR 2026">
          GEPA, Appendix E
        </Cite>
      </>
    ),
  },
  {
    id: 'gepa',
    name: 'GEPA',
    section: 'Section 14',
    source: (
      <Cite tier={3} href={GEPA} venue="ICLR 2026">
        GEPA, Section 3 and Table 1
      </Cite>
    ),
    state: 'A pool of candidate prompt sets with per-example validation scores',
    update: "A reflection model rewrites one module's instruction; keep it if the minibatch score improves",
    signal: "A score plus the evaluator's text, such as compiler errors or failed rubric items",
    frozen: 'The task model (Qwen3 8B or GPT-4.1 Mini)',
    cost: '1,839 to 7,051 rollouts on Qwen3 8B, against 24,000 for GRPO',
  },
  {
    id: 'autoresearch',
    name: 'autoresearch',
    section: 'Section 15',
    source: (
      <Cite tier={1} href={AR_PROGRAM}>
        autoresearch program.md L103-L104
      </Cite>
    ),
    state: 'train.py on a git branch, plus a results log',
    update: 'One edit per experiment; keep the commit if the metric improved, otherwise reset',
    signal: 'Validation bits per byte after a training run',
    frozen: "The coding agent's model",
    cost: (
      <>
        5 minutes of training per experiment{' '}
        <Cite tier={1} href={AR_BUDGET}>
          autoresearch prepare.py L31
        </Cite>
      </>
    ),
  },
  {
    id: 'funsearch',
    name: 'FunSearch and AlphaEvolve',
    section: 'Section 15',
    source: (
      <SpaceBetween size="xxs">
        <Cite tier={3} href={FUNSEARCH} venue="Nature 2023">
          FunSearch, main text
        </Cite>
        <Cite tier={3} href={ALPHAEVOLVE} venue="preprint">
          AlphaEvolve, Section 2 and Table 1
        </Cite>
      </SpaceBetween>
    ),
    state: 'A scored database of programs (split into islands in FunSearch)',
    update: 'An LLM writes variants of high scorers; the evaluator admits the ones that pass',
    signal: "A programmatic evaluator's score",
    frozen: 'A pretrained code LLM (FunSearch); Gemini 2.0 Flash and Pro (AlphaEvolve)',
    cost: 'On the order of 10^6 samples for FunSearch; thousands for AlphaEvolve, per its authors',
  },
  {
    id: 'ralph',
    name: 'Ralph',
    section: 'Section 15',
    source: (
      <Cite tier={2} href={RALPH}>
        Huntley, Ralph (author&apos;s post)
      </Cite>
    ),
    state: 'The prompt file, a plan file, AGENT.md and the repository',
    update: "The agent updates the plan and AGENT.md each iteration; the operator adds 'signs' to the prompt between runs",
    signal: 'Backpressure: tests, the compiler, type checks',
    frozen: "The coding agent's model",
    cost: 'A fresh context each iteration, which re-reads the plan and specifications',
  },
  {
    id: 'retroformer',
    name: 'Retroformer',
    section: 'Section 16',
    source: (
      <Cite tier={3} href={RETROFORMER} venue="ICLR 2024">
        Retroformer, Sections 4.1, 4.2 and 5.2, Appendices C.1 and C.3
      </Cite>
    ),
    state: 'LoRA (Low-Rank Adaptation) weights of a 7B reflection model',
    update: 'PPO on the reflector; its reward is the change in return between two trials',
    signal: 'The environment reward, such as answer F1 (word overlap with the gold answer) on HotPotQA',
    frozen: 'The actor (GPT-3 text-davinci-003 or GPT-4)',
    cost: '3,383 reflection samples collected for HotPotQA',
  },
  {
    id: 'advisor',
    name: 'Advisor Models',
    section: 'Section 16',
    source: (
      <Cite tier={3} href={ADVISOR} venue="ICML 2026">
        Advisor Models, Sections 3 and 4, Appendix A
      </Cite>
    ),
    state: 'Weights of a small advisor model, such as Qwen2.5 7B',
    update: 'GRPO on the advisor',
    signal: "A reward on the frozen student's final output",
    frozen: 'The student (GPT-4o mini, GPT-4.1 mini, Gemini 2.5 Flash)',
    cost: 'One node of 8 H100 GPUs for training',
  },
  {
    id: 'memento',
    name: 'Memento',
    section: 'Section 16',
    source: (
      <Cite tier={3} href={MEMENTO} venue="preprint">
        Memento, Sections 3, 5.3 and 6
      </Cite>
    ),
    state: 'A case bank of past states, plans and rewards, plus a small Q-network',
    update: 'Append each case; soft Q-learning, an RL method that learns a value per choice, learns which case to retrieve',
    signal: 'A binary task reward',
    frozen: 'GPT-4.1 plans; o3 or o4-mini executes',
    cost: 'About 121k input tokens per task on average, over 10 sampled tasks at the hardest level of GAIA (questions for general assistants)',
  },
];

function FiveFieldTable() {
  return (
    <Table<MethodRow>
      variant="embedded"
      wrapLines
      trackBy="id"
      items={METHODS}
      columnDefinitions={[
        {
          id: 'name',
          header: 'Method',
          minWidth: 170,
          cell: (m) => (
            <SpaceBetween size="xxs">
              <Box>
                <Box variant="strong" display="inline">
                  {m.name}
                </Box>{' '}
                <Box variant="small" display="inline">
                  {m.section}
                </Box>
              </Box>
              {m.source}
            </SpaceBetween>
          ),
        },
        { id: 'state', header: 'State that persists', cell: (m) => m.state, minWidth: 160 },
        { id: 'update', header: 'Update rule', cell: (m) => m.update, minWidth: 200 },
        { id: 'signal', header: 'Feedback signal', cell: (m) => m.signal, minWidth: 170 },
        { id: 'frozen', header: 'What stays frozen', cell: (m) => m.frozen, minWidth: 160 },
        { id: 'cost', header: 'Cost', cell: (m) => m.cost, minWidth: 170 },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function TextLoopAsRl() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Read any text loop as RL with the context as its trainable parameter, then predict its behaviour from its signal, its step size and its exploration (sources read 2026-10-30)"
          >
            11. A Text Loop Is RL on the Context
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A text loop improves a frozen model by changing what the model reads. After an attempt
            is scored, something writes a reflection, a revised prompt, a lesson in a playbook (a
            list of itemised lessons the loop maintains) or a new skill file, and the next attempt runs with it in the context. Sections 3 to 10
            built the vocabulary of RL (reinforcement learning) on the weights. This section opens
            the words track by applying the same vocabulary to the context, so that any loop, one
            you run or one in a paper, can be described in RL terms and its behaviour predicted
            from them.
          </Box>
          <Box variant="p">
            The frame in one line: a text loop is an optimiser whose parameters are tokens in the
            context. Its value is in what it predicts. Remove the signal that tells a loop whether
            an attempt worked, and RL says nothing can be learned. Reflexion&apos;s own ablation
            shows a loop doing worse than that: on the 50 hardest HumanEval problems in Rust
            (programming tasks checked by unit tests), GPT-4 reflecting without its self-written
            tests scored 0.52, below the 0.60 of no loop at all, while the full loop with tests
            reached 0.68{' '}
            <Cite tier={3} href={REFLEXION} venue="NeurIPS 2023">
              Reflexion, Table 3
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Name the policy, the parameters, the learner and the environment of any text loop, and the RL vocabulary of sections 3 to 10 applies to it"
          >
            The analogy, made exact
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            In RL, the policy is the probability distribution an agent samples its actions from,
            and training changes the parameters that define it. Reflexion, the base pattern of the
            words track, defines its policy as &quot;an agent&apos;s memory encoding paired with a
            choice of LLM parameters&quot;{' '}
            <Cite tier={3} href={REFLEXION} venue="NeurIPS 2023">
              Reflexion, Section 1
            </Cite>
            . The LLM parameters stay fixed across trials. Only the memory, a short buffer of
            written reflections, changes, so the memory text plays the part that weights play in
            RL.
          </Box>
          <Box variant="p">
            Retroformer adds the environment: the world that turns an action into an outcome and a
            reward. Its acting model is frozen, so &quot;it can be considered as part of the
            environment&quot;, and training whatever writes the prompt becomes &quot;a regular RL
            optimization so all the popular RL algorithms apply&quot;{' '}
            <Cite tier={3} href={RETROFORMER} venue="ICLR 2024">
              Retroformer, Section 3
            </Cite>
            . Retroformer&apos;s writer is a small model fine-tuned with PPO (Proximal Policy
            Optimization), a policy-gradient RL algorithm.
          </Box>
          <Box variant="p">
            Our reading of the two papers together: in a text loop, whatever writes the context is
            the learner, and the frozen model belongs to the world it learns about. The writer can
            be the model reflecting on its own attempt (Reflexion), a small trained model
            (Retroformer), or a person who edits the prompt between runs, as the operator of a Ralph
            loop does{' '}
            <Cite tier={2} href={RALPH}>
              Huntley, Ralph (author&apos;s post)
            </Cite>
            . With those roles fixed, every RL term has a counterpart.
          </Box>
          <TermsTable />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Keep RL's roles and failure modes for text loops, and drop any expectation that a written critique behaves like a gradient"
          >
            Where the analogy stops
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The analogy covers the roles. The update itself works differently: a model reads
            feedback and writes new text, no derivative is computed, and no learning rate scales
            the change. TextGrad, which carries the analogy furthest by passing critiques backward
            through a graph of text variables, says so directly: &quot;we use differentiation and
            gradients as a metaphor for textual feedback from LLMs&quot;{' '}
            <Cite tier={3} href={TEXTGRAD} venue="Nature 2025">
              TextGrad (arXiv v1), Section 1
            </Cite>
            . Reflexion calls its reflections a &quot;semantic&quot; gradient signal and lists among
            its limits &quot;not having a formal guarantee for success&quot;{' '}
            <Cite tier={3} href={REFLEXION} venue="NeurIPS 2023">
              Reflexion, Section 1
            </Cite>
            .
          </Box>
          <Box variant="p">
            One result connects the two formally, in a narrow setting. ICL (in-context learning),
            a model picking up a task from examples in its prompt with no change to its weights,
            matches gradient descent for a single linear self-attention layer: weights can be
            constructed so that the layer applies the same transformation to its data as gradient
            descent on a regression loss{' '}
            <Cite tier={3} href={VON_OSWALD} venue="ICML 2023">
              von Oswald et al., Abstract
            </Cite>
            . For pretrained language models the equivalence is open. A position paper that tests
            LLaMa-7B concludes that the equivalence between ICL and GD (gradient descent)
            &quot;remains an open hypothesis&quot;{' '}
            <Cite tier={3} href={SHEN} venue="ICML 2024, position paper">
              Shen et al., Abstract
            </Cite>
            .
          </Box>
          <Box variant="p">
            Our reading of what carries over: the loop itself (sample, score, change the stored
            thing), the roles in the table above, and RL&apos;s three classic ways to fail, each of
            which the last part of this section shows in a text loop. What does not carry over is
            any guarantee that the score goes up.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Place any method by where it keeps what it learns and where its score comes from, and pick out the loops that grade themselves"
          >
            Three stores, two signal sources
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 1, One Loop, Three Places to Keep What It Learns, named the three stores: the
            weights, the context a frozen model reads, and a small trained model that writes
            context for a large one. The second axis is where the signal comes from, taken from a
            survey of agent adaptation: execution-grounded (the result of a tool call or code run:
            tests, a compiler, an environment) or output-evaluated (a score on the final output: an
            exact-match check against a gold answer, a rubric, or a judge){' '}
            <Cite tier={3} href={SURVEY} venue="preprint">
              Adaptation of Agentic AI, Sections 1 and 3.3
            </Cite>
            . The grid crosses the two and places every method of the words track. Its weights row
            holds reference points: runs of RLVR (RL with verifiable rewards, where a program
            checks each answer) from section 7, RLVR &amp; GRPO, and section 9, Agentic RL.
          </Box>
          <Box variant="p">
            Short names in the grid and the table: GRPO is Group Relative Policy Optimization, the
            RL algorithm of section 7, which scores each answer against the others sampled for the
            same prompt and calls the difference its advantage; ACE is Agentic Context
            Engineering; GEPA is Genetic-Pareto; OPRO is Optimization by PROmpting; ProTeGi is
            Prompt Optimization with Textual Gradients; MIPROv2 is DSPy&apos;s implementation of
            MIPRO (Multi-prompt Instruction PRoposal Optimizer); ExpeL is the Experiential Learning
            agent; CLIN is a continually learning language agent.
          </Box>
          <StoreSignalDiagram />
          <Box variant="small" color="text-body-secondary">
            Placements are our reading of the signal each paper used. A method run with both kinds
            of signal appears in both columns, with the signal in brackets.
          </Box>
          <Box variant="p">
            One method can sit in both columns. Reflexion&apos;s runs on HotPotQA (multi-hop
            questions over Wikipedia) grade each answer by exact match against the gold answer,
            which is output-evaluated; its coding runs grade with unit tests the agent writes and
            then executes, which is execution-grounded{' '}
            <Cite tier={3} href={REFLEXION} venue="NeurIPS 2023">
              Reflexion, Sections 4.2 and 4.3
            </Cite>
            . The 0.52 against 0.68 above is the coding case: the same loop with and without its
            execution-grounded signal.
          </Box>
          <Box variant="p">
            The dashed chips mark the loops that grade their own output with no ground truth:
            Self-Refine critiques its own answer, Dynamic Cheatsheet&apos;s curator &quot;does not
            have access to ground-truth labels&quot;, ReasoningBank labels outcomes with an LLM
            judge &quot;without any ground-truth reference&quot;, and TextGrad can run with a
            judge. Their sources are in the table below; section 12, Verbal Reinforcement &amp;
            Self-Correction, shows what grading without ground truth does to a loop.
          </Box>
          <ExpandableSection headerText="Where the survey draws the split, and how this grid extends it">
            <SpaceBetween size="s">
              <Box variant="p">
                The survey sorts updates to the agent by signal: &quot;tool-execution
                feedback&quot; or &quot;evaluations of the agent&apos;s final output&quot;. Its
                examples are
                the weights row of the grid: DeepSeek-R1 &quot;ties the reward to test-case pass
                rates&quot;, while Search-R1 scores the final answer by &quot;exact matching
                accuracy&quot; and ReTool &quot;rewards only the final answer&quot;{' '}
                <Cite tier={3} href={SURVEY} venue="preprint">
                  Adaptation of Agentic AI, Sections 3.2 and 3.3
                </Cite>
                .
              </Box>
              <Box variant="p">
                For tools and memory the survey uses a different split: whether tools are
                &quot;optimized independently of any agent&quot; or &quot;adapted under the
                supervision of a fixed agent&quot;{' '}
                <Cite tier={3} href={SURVEY} venue="preprint">
                  Adaptation of Agentic AI, Section 3.2 and footnote 1
                </Cite>
                . Applying the execution-or-output split to the context and the small-model rows
                is our extension of its frame. It is the question section 22, Choosing a Text Loop,
                a Hybrid or a Weight Update, asks of any signal you have.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Compare two loops on what persists, how it changes, what scores it, what stays frozen and what it costs, before you read either in depth"
          >
            Five fields describe every loop
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Five fields carry the comparison: the state that persists between attempts, the update
            rule that changes it, the feedback signal that drives the update, what stays frozen,
            and the cost. The table fills them in for each method of the words track. Sections 12
            to 16 develop each one.
          </Box>
          <FiveFieldTable />
          <Box variant="p">
            The update-rule column carries the one term this frame adds: step size, how much of
            the context one update rewrites. It ranges from appending one reflection to a buffer
            of one to three (Reflexion), through merging small delta bullets into a playbook
            (ACE), to rewriting a whole cheatsheet (Dynamic Cheatsheet) or a module&apos;s whole
            instruction (GEPA). Whether the context is a prompt or a playbook sets the scale: a
            prompt optimiser replaces one instruction set, a playbook loop adds and edits items in
            a growing list. Prompt optimisers take few, large steps: on Qwen3 8B, GEPA called its
            reflection model 17 to 90 times in a whole optimisation run on one benchmark, each call
            proposing a new instruction, while
            the GRPO baseline in the same paper ran 500 training steps over 24,000 rollouts{' '}
            <Cite tier={3} href={GEPA} venue="ICLR 2026">
              GEPA, Appendix E.4 and Table 4
            </Cite>
            . Section 13, Memories, Playbooks &amp; Skill Libraries, develops step size as a design
            choice.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict a loop's behaviour from its signal, its step size and its exploration, and check the signal first: the same loop scored 0.52 without its tests and 0.68 with them"
          >
            What the frame predicts
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <Box variant="strong">Signal.</Box> RL learns from the reward and from nothing else.
            The text version: Reflexion reflecting without its tests scored 0.52, below 0.60 with
            no loop at all, and 0.68 with the tests it writes and runs{' '}
            <Cite tier={3} href={REFLEXION} venue="NeurIPS 2023">
              Reflexion, Table 3
            </Cite>
            . Section 12, Verbal Reinforcement &amp; Self-Correction, compares loops with and
            without an outside signal.
          </Box>
          <Box variant="p">
            <Box variant="strong">Step size.</Box> In gradient descent, too large a step overshoots
            and undoes progress. The text version is a rewrite that replaces too much. In a case
            study in the ACE paper on AppWorld, an LLM asked to rewrite the whole accumulated
            context at each step took it from 18,282 tokens to 122 in one step, and accuracy fell
            from 66.7 to 57.1, below the 63.7 of no adaptation at all{' '}
            <Cite tier={3} href={ACE} venue="ICLR 2026">
              ACE, Section 2.2
            </Cite>
            . Section 13, Memories, Playbooks &amp; Skill Libraries, covers update rules that keep
            what they learned.
          </Box>
          <Box variant="p">
            <Box variant="strong">Exploration.</Box> An RL agent that never tries actions of
            unknown value settles on the first thing that scores. A text loop explores only as far
            as its proposer and its acceptance rule allow. Reflexion&apos;s authors stopped their
            WebShop runs (a simulated online shop) after four trials without improvement and
            concluded that Reflexion &quot;is unable to solve tasks that require a significant
            amount of diversity and exploration&quot;{' '}
            <Cite tier={3} href={REFLEXION} venue="NeurIPS 2023">
              Reflexion, Appendix B.1
            </Cite>
            . On multi-armed bandits, repeated choices among options with unknown payoffs, only one
            configuration across GPT-3.5, GPT-4 and Llama2 explored satisfactorily: GPT-4 with
            chain-of-thought and an externally summarised history{' '}
            <Cite tier={3} href={BANDITS} venue="NeurIPS 2024">
              Krishnamurthy et al., Abstract
            </Cite>
            . Section 17, Where Words Fall Short, takes this further.
          </Box>
          <Box variant="p">
            So the frame gives a check to run on any loop, yours or a paper&apos;s, before you
            trust its gains: fill in the five fields, place it in the grid, and read the signal
            first, because Reflexion moved from 0.52 to 0.68 on one change, the tests. Section 12
            starts there.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
