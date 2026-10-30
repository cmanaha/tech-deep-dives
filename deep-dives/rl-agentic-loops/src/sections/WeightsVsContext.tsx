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

/** Ovadia et al., Fine-Tuning or Retrieval? Comparing Knowledge Injection in LLMs (EMNLP 2024). */
const OVADIA = arxiv('2312.05934v3');
/** Sclar et al., Quantifying Language Models' Sensitivity to Spurious Features in Prompt Design. */
const FORMAT = arxiv('2310.11324v2');
/** Zhang et al., Forcing Diffuse Distributions out of Language Models. */
const DIFFUSE = arxiv('2404.10859v2');
/** OpenAI, GPT-4 Technical Report (first-party lab report). */
const GPT4 = arxiv('2303.08774v6');
/** Snell et al., Learning by Distilling Context. */
const CONTEXT_DISTILLATION = arxiv('2209.15189v1');
/** RL's Razor: Why Online Reinforcement Learning Forgets Less. */
const RAZOR = arxiv('2509.04259v1');
/** Yue et al., Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs? */
const YUE = arxiv('2504.13837v5');
/** DeepSeek-R1 (the Nature version is v2). */
const R1 = arxiv('2501.12948v2');

/* ------------------------------------------------------------------------ */
/* Diagram: the boundary map, one row per kind of improvement               */
/* ------------------------------------------------------------------------ */

type Mark = 'holds' | 'partial' | 'weak' | 'unmeasured';

interface MapCell {
  mark: Mark;
  lines: [string, string];
}

interface MapRow {
  id: string;
  label: string;
  /** Second line of the label cell. */
  gloss: string;
  /** Contested rows carry an amber outline, and their second label line is the open question. */
  contested?: boolean;
  weights: MapCell;
  context: MapCell;
}

const MAP_ROWS: MapRow[] = [
  {
    id: 'facts',
    label: 'Task facts after the cutoff',
    gloss: 'facts the model never saw in training',
    weights: { mark: 'partial', lines: ['Fine-tuning: 0.504 on the raw', 'text, 0.588 with paraphrases'] },
    context: { mark: 'holds', lines: ['Retrieval: 0.875, against a', 'base of 0.481, one 7B model'] },
  },
  {
    id: 'procedures',
    label: 'Instructions and procedures',
    gloss: 'rules, strategies, playbooks',
    weights: { mark: 'partial', lines: ['Can move in later, through', 'context distillation'] },
    context: { mark: 'holds', lines: ['When a reliable signal', 'writes them: sections 13, 14'] },
  },
  {
    id: 'sharpening',
    label: 'Sharpening',
    gloss: 'toward answers it can already sample',
    weights: { mark: 'holds', lines: ['RL makes the first try right', 'more often: section 8'] },
    context: { mark: 'partial', lines: ['Bought per query by sampling,', 'at more tokens per answer'] },
  },
  {
    id: 'format',
    label: 'Constraints and output format',
    gloss: 'CONTESTED: holds across models?',
    contested: true,
    weights: { mark: 'unmeasured', lines: ['Training a format in: not', 'measured in sources read'] },
    context: { mark: 'partial', lines: ['Stated here; format moved', 'accuracy by up to 76 points'] },
  },
  {
    id: 'calibration',
    label: 'Calibrated or diffuse outputs',
    gloss: 'honest confidence, spread samples',
    weights: { mark: 'holds', lines: ['Fine-tuning made a 1-to-10', 'pick near-uniform'] },
    context: { mark: 'weak', lines: ['Asked in the prompt, two', 'models put over 60% on five'] },
  },
  {
    id: 'tokens',
    label: 'Token efficiency',
    gloss: 'one long prompt on every call',
    weights: { mark: 'holds', lines: ['Context distillation drops', 'the instruction tokens'] },
    context: { mark: 'partial', lines: ['Instructions are paid for', 'on every call'] },
  },
  {
    id: 'retention',
    label: 'Retention of old abilities',
    gloss: 'what the model can already do',
    weights: { mark: 'partial', lines: ['Forgetting grows with the', 'distance from the base model'] },
    context: { mark: 'holds', lines: ['By construction: the', 'weights do not move'] },
  },
  {
    id: 'exploration',
    label: 'Exploration and credit',
    gloss: 'learning from failure, long horizons',
    weights: { mark: 'partial', lines: ['Where it is trained in:', 'section 17'] },
    context: { mark: 'weak', lines: ['Weak in the general models', 'tested: section 17'] },
  },
  {
    id: 'skill',
    label: 'New reasoning skill',
    gloss: 'CONTESTED: can RL alone add it?',
    contested: true,
    weights: { mark: 'holds', lines: ['Distillation from a stronger', 'model; RL alone contested'] },
    context: { mark: 'weak', lines: ['Fell short of RL on one', 'math benchmark: section 14'] },
  },
];

const MAP_LEGEND: { cls: Mark | 'contested'; text: string; x: number }[] = [
  { cls: 'holds', text: 'Best kept here', x: 12 },
  { cls: 'partial', text: 'Possible, with a cost', x: 140 },
  { cls: 'weak', text: 'Weak in the studies read', x: 312 },
  { cls: 'unmeasured', text: 'Not measured', x: 503 },
  { cls: 'contested', text: 'Contested row', x: 619 },
];

// Layout in viewBox units. 11px text budgets about 6.2 units per character, so a 31-character
// cell line needs about 192 units inside a 222-unit cell with 8 units of padding on each side.
// 12px weight-600 labels budget about 7 units per character; the longest label (29 characters)
// needs about 203 units inside the 282-unit label column.
const WVC_W = 760;
const WVC_LABEL_X = 10;
const WVC_LABEL_W = 282;
const WVC_COL_W = 222;
const WVC_COL_X = [300, 530];
const WVC_HEAD_Y = 10;
const WVC_HEAD_H = 44;
const WVC_ROW_Y0 = 64;
const WVC_ROW_H = 36;
const WVC_ROW_GAP = 6;
const WVC_LEGEND_Y = WVC_ROW_Y0 + MAP_ROWS.length * (WVC_ROW_H + WVC_ROW_GAP) + 8;
const WVC_H = WVC_LEGEND_Y + 26;

const WVC_STYLE = `
  .weights-context-map-head { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
  .weights-context-map-label { fill: #f4f5f6; stroke: #879596; stroke-width: 1; }
  .weights-context-map-label-contested { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1; }
  .weights-context-map-holds { fill: #e9f7ef; stroke: #037f51; stroke-width: 2; }
  .weights-context-map-partial { fill: #ffffff; stroke: #879596; stroke-width: 1; }
  .weights-context-map-weak { fill: #fff5f5; stroke: #d91515; stroke-width: 1.5; }
  .weights-context-map-unmeasured { fill: #f4f5f6; stroke: #5f6b7a; stroke-width: 1.2; stroke-dasharray: 5 4; }
  .weights-context-map-contested { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 2; stroke-dasharray: 7 4; }
  .weights-context-map-outline { fill: none; stroke: #8b6c00; stroke-width: 2; stroke-dasharray: 7 4; }
  .weights-context-map-hdr { fill: #0f1b2a; font: 600 13px sans-serif; }
  .weights-context-map-name { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
  .weights-context-map-sub { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
  .weights-context-map-lbl { fill: #16191f; font: 600 12px sans-serif; }
  .weights-context-map-gloss { fill: #5f6b7a; font: 11px sans-serif; }
  .weights-context-map-tag { fill: #6b5300; font: 700 10px sans-serif; }
  .weights-context-map-t { fill: #16191f; font: 11px sans-serif; }
  .weights-context-map-leg { fill: #414d5c; font: 11px sans-serif; }
`;

function BoundaryMapDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${WVC_W} ${WVC_H}`}
        role="img"
        aria-labelledby="weights-context-map-title"
        aria-describedby="weights-context-map-desc"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="weights-context-map-title">
          Nine kinds of improvement mapped onto two stores, the weights and the context. Task facts
          after the cutoff, instructions and procedures, and retention of old abilities are best
          kept in context. Sharpening, calibrated or diffuse outputs, token efficiency and new
          reasoning skill are best kept in the weights, and sharpening can also be bought per
          query by sampling. Exploration, learning from failure and long-horizon credit are weak in
          context. Two rows are contested: output format, where training a format in was not
          measured, and new reasoning skill, where whether RL alone adds it is disputed.
        </title>
        <desc id="weights-context-map-desc">
          One row per kind of improvement and one column per store. Green cells mark the store
          that holds the improvement best in the evidence read, white cells a store that can hold
          it at a cost, red cells a store that was weak at it in the studies read, and a grey
          dashed cell a case no source read measured. Amber dashed outlines mark the contested
          rows.
        </desc>
        <style>{WVC_STYLE}</style>
        <rect x={0} y={0} width={WVC_W} height={WVC_H} rx={8} fill="#ffffff" />

        <rect
          x={WVC_LABEL_X}
          y={WVC_HEAD_Y}
          width={WVC_LABEL_W}
          height={WVC_HEAD_H}
          rx={6}
          className="weights-context-map-label"
        />
        <text x={WVC_LABEL_X + 10} y={WVC_HEAD_Y + 27} className="weights-context-map-hdr">
          Kind of improvement
        </text>
        {[
          { name: 'Weights', sub: 'changed by a training run' },
          { name: 'Context', sub: 'a frozen model, at each call' },
        ].map((col, i) => (
          <g key={col.name}>
            <rect
              x={WVC_COL_X[i]}
              y={WVC_HEAD_Y}
              width={WVC_COL_W}
              height={WVC_HEAD_H}
              rx={6}
              className="weights-context-map-head"
            />
            <text
              x={WVC_COL_X[i] + WVC_COL_W / 2}
              y={WVC_HEAD_Y + 19}
              className="weights-context-map-name"
            >
              {col.name}
            </text>
            <text
              x={WVC_COL_X[i] + WVC_COL_W / 2}
              y={WVC_HEAD_Y + 35}
              className="weights-context-map-sub"
            >
              {col.sub}
            </text>
          </g>
        ))}

        {MAP_ROWS.map((row, r) => {
          const y = WVC_ROW_Y0 + r * (WVC_ROW_H + WVC_ROW_GAP);
          return (
            <g key={row.id}>
              {row.contested && (
                <rect
                  x={WVC_LABEL_X - 5}
                  y={y - 3}
                  width={WVC_COL_X[1] + WVC_COL_W - WVC_LABEL_X + 10}
                  height={WVC_ROW_H + 6}
                  rx={8}
                  className="weights-context-map-outline"
                />
              )}
              <rect
                x={WVC_LABEL_X}
                y={y}
                width={WVC_LABEL_W}
                height={WVC_ROW_H}
                rx={6}
                className={
                  row.contested ? 'weights-context-map-label-contested' : 'weights-context-map-label'
                }
              />
              <text x={WVC_LABEL_X + 10} y={y + 15} className="weights-context-map-lbl">
                {row.label}
              </text>
              <text
                x={WVC_LABEL_X + 10}
                y={y + 30}
                className={row.contested ? 'weights-context-map-tag' : 'weights-context-map-gloss'}
              >
                {row.gloss}
              </text>
              {[row.weights, row.context].map((cell, c) => (
                <g key={`${row.id}-${c}`}>
                  <rect
                    x={WVC_COL_X[c]}
                    y={y}
                    width={WVC_COL_W}
                    height={WVC_ROW_H}
                    rx={6}
                    className={`weights-context-map-${cell.mark}`}
                  />
                  {cell.lines.map((line, k) => (
                    <text
                      key={k}
                      x={WVC_COL_X[c] + 8}
                      y={y + 15 + k * 14}
                      className="weights-context-map-t"
                    >
                      {line}
                    </text>
                  ))}
                </g>
              ))}
            </g>
          );
        })}

        {MAP_LEGEND.map((item) => (
          <g key={item.cls}>
            <rect
              x={item.x}
              y={WVC_LEGEND_Y}
              width={22}
              height={14}
              rx={3}
              className={`weights-context-map-${item.cls}`}
            />
            <text x={item.x + 30} y={WVC_LEGEND_Y + 11} className="weights-context-map-leg">
              {item.text}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Supporting results: knowledge injection on three 7B models               */
/* ------------------------------------------------------------------------ */

interface InjectionResult {
  model: string;
  base: string;
  rag: string;
  ftReg: string;
  ftPar: string;
  ftRegRag: string;
  ftParRag: string;
}

// Ovadia et al., Table 2 (current-events task): Base, Base + RAG, FT-reg, FT-par, FT-reg + RAG,
// FT-par + RAG. Rendered as one line per model so it reads on a phone.
const INJECTION_RESULTS: InjectionResult[] = [
  { model: 'Mistral 7B', base: '0.481', rag: '0.875', ftReg: '0.504', ftPar: '0.588', ftRegRag: '0.810', ftParRag: '0.830' },
  { model: 'Llama2 7B', base: '0.353', rag: '0.585', ftReg: '0.219', ftPar: '0.392', ftRegRag: '0.326', ftParRag: '0.520' },
  { model: 'Orca2 7B', base: '0.456', rag: '0.876', ftReg: '0.511', ftPar: '0.566', ftRegRag: '0.820', ftParRag: '0.826' },
];

function InjectionResults() {
  return (
    <SpaceBetween size="xs">
      {INJECTION_RESULTS.map((r) => (
        <Box key={r.model} variant="p">
          <strong>{r.model}:</strong> base {r.base}; with retrieval {r.rag}; fine-tuned on the
          text {r.ftReg}; fine-tuned on paraphrases {r.ftPar}; fine-tuned on the text, then
          retrieval {r.ftRegRag}; fine-tuned on paraphrases, then retrieval {r.ftParRag}.
        </Box>
      ))}
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* The classification table the section ends on                            */
/* ------------------------------------------------------------------------ */

interface ClassifyRow {
  id: string;
  row: string;
  ask: string;
  store: string;
  next: string;
}

const CLASSIFY_ROWS: ClassifyRow[] = [
  {
    id: 'facts',
    row: 'Task facts after the cutoff',
    ask: 'Is the model missing facts from after its training cutoff?',
    store: 'Context, through retrieval',
    next: 'Measure how often your retriever returns the passage that answers each question. The 0.875 against 0.504 came with a matching document for every question.',
  },
  {
    id: 'procedures',
    row: 'Instructions and procedures',
    ask: 'Would telling the model a rule or a method it can already follow close the gap?',
    store: 'Context, when a reliable signal writes them',
    next: 'Section 14 for one optimised prompt; section 13 for a playbook that grows.',
  },
  {
    id: 'sharpening',
    row: 'Sharpening',
    ask: 'Does the model reach the right answer within k tries but miss it on the first?',
    store: 'Weights through RL, or per query by sampling',
    next: "Plot the base model's pass@k on your task; section 8 shows how to read it and what sampling costs.",
  },
  {
    id: 'format',
    row: 'Constraints and output format (contested)',
    ask: 'Is the gap a format or a constraint the output breaks?',
    store: 'State it in context; measure it',
    next: 'Re-score the prompt on every new model, as a range across formats.',
  },
  {
    id: 'calibration',
    row: 'Calibrated or diffuse outputs',
    ask: 'Are the confidence scores wrong, or do repeated samples crowd onto a few answers?',
    store: 'Weights',
    next: 'Sample one prompt 1,000 times and count the distinct answers, before and after any change.',
  },
  {
    id: 'tokens',
    row: 'Token efficiency',
    ask: 'Is the same long instruction paid for on every call, and has it stopped changing?',
    store: 'Weights, through context distillation',
    next: 'Distil the settled text; keep the part still changing in context.',
  },
  {
    id: 'retention',
    row: 'Retention of old abilities',
    ask: 'Must everything the model does today keep working?',
    store: 'Context',
    next: 'If you train anyway, track the KL to the base model and re-run the evaluations that guard what it must keep.',
  },
  {
    id: 'exploration',
    row: 'Exploration, learning from failure, long-horizon credit',
    ask: 'Does the task need trying options of unknown value, learning from failed runs, or credit across many steps?',
    store: 'Weak in context',
    next: 'Section 17: keep the statistics in code and hand the model a summary.',
  },
  {
    id: 'skill',
    row: 'New reasoning skill (contested)',
    ask: 'Does the model fail at every k you can afford to sample?',
    store: 'Weights, through distillation from a stronger model',
    next: 'Look for a stronger teacher first; sections 7 and 8 cover distillation and the RL debate.',
  },
];

function ClassifyTable() {
  return (
    <Table<ClassifyRow>
      variant="embedded"
      wrapLines
      columnDefinitions={[
        {
          id: 'ask',
          header: 'Row, and what to ask of your gap',
          cell: (r) => (
            <SpaceBetween size="xxs">
              <Box fontWeight="bold">{r.row}</Box>
              <Box>{r.ask}</Box>
            </SpaceBetween>
          ),
        },
        {
          id: 'next',
          header: 'If yes, keep it in, then check',
          cell: (r) => (
            <SpaceBetween size="xxs">
              <Box fontWeight="bold">{r.store}</Box>
              <Box>{r.next}</Box>
            </SpaceBetween>
          ),
        },
      ]}
      items={CLASSIFY_ROWS}
      trackBy="id"
      header={<Header variant="h3">Mark every row your gap touches</Header>}
    />
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function WeightsVsContext() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Classify your gap before you choose a method: facts from after the cutoff sat best in context (retrieval 0.875 against 0.504 for fine-tuning on one 7B model), calibration and prompt cost sit in the weights, and two rows stay contested (sources read 2026-10-30)"
          >
            18. What Lives in Weights &amp; What Lives in Context
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A loop that improves a model has two places to keep what it learns. The weights are
            changed by a training run, such as RL (reinforcement learning) or fine-tuning, and
            shape every answer the model gives. The context is the
            text a frozen model reads at each call: a retrieved document, an instruction, a
            playbook. Each store holds some kinds of improvement well and others poorly, and the
            evidence for which is which is spread across this dive.
          </Box>
          <Box variant="p">
            This section gathers it into one map, a row for each kind of improvement, so a gap can
            be classified before a method is chosen. Some rows are lopsided. On multiple-choice
            questions about news from after the models&apos; training cutoff, with a matching
            document for every question in the retrieval corpus, retrieval scored 0.875 on Mistral
            7B against 0.504 for fine-tuning on the same documents{' '}
            <Cite tier={3} href={OVADIA} venue="EMNLP 2024">
              Ovadia et al., Table 2
            </Cite>
            . Section 22, Choosing a Text Loop, a Hybrid or a Weight Update, starts from the
            classification this map produces.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find the row your gap falls in, see which store holds it, and spot the two rows the evidence still contests"
          >
            Nine kinds of improvement, two stores
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each row is a kind of improvement a team might want from a model, and each column a
            store.
          </Box>
          <BoundaryMapDiagram />
          <Box variant="small" color="text-body-secondary">
            The cell marks are our reading of the studies cited in this section and in the sections
            each row names. Every number in the map is cited in the blocks below.
          </Box>
          <Box variant="p">
            Three rows are argued in full elsewhere in the dive. Instructions and procedures belong
            in context when a reliable signal writes them: see section 13, Memories, Playbooks
            &amp; Skill Libraries, and section 14, Optimising the Prompt. Sharpening raises pass@1,
            the chance that one attempt is right, toward pass@k, the chance that at least one of k
            attempts is right; section 8, What RL Does to a Model, shows how to read it and what
            buying it per query costs. Exploration (trying options of unknown value), learning from
            failure and long-horizon credit assignment (working out which step earned the result)
            are weak in a general model&apos;s context; section 17, Where Words Fall Short, carries
            that evidence. The blocks below carry the evidence for the other six rows.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict where a gap with no study of its own belongs, by asking whether it must be fast, calibrated or general, or specific, recent and auditable"
          >
            One way to hold the map
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Read down the green cells and a pattern appears. Our reading of the studies behind the
            map: weights hold what must be fast, calibrated or general. Fast, because a distilled
            instruction costs no tokens on any call. Calibrated, because the spread and the
            confidence of outputs are set by the probabilities training produces. General, because
            a weight change applies to every input, including tasks the tuning never saw, as the
            held-out task in the number-picking study below showed.
          </Box>
          <Box variant="p">
            Context holds what is specific, recent and auditable. Specific, because one
            task&apos;s facts and procedures sit in that task&apos;s context and touch nothing
            else. Recent, because a document added today is read on the next call. Auditable,
            because a person can read the instruction or the retrieved passage behind an answer,
            and remove it.
          </Box>
          <Box variant="p">
            One property belongs to neither store yet. Neither delivered stability under changes
            to prompt format in the sources read: format sensitivity survived instruction tuning{' '}
            <Cite tier={3} href={FORMAT} venue="ICLR 2024">
              Sclar et al., abstract
            </Cite>
            . Treat that row as a measurement to repeat on each model rather than a store to
            choose.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Put facts the model has never seen into its context: retrieval scored 0.875 against 0.504 for fine-tuning, on a test where every question had a matching document"
          >
            Facts after the cutoff: context
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The cleanest test of where a fact belongs uses facts no model could have seen. One
            study built 910 multiple-choice questions about US events from August to November
            2023, after the training cutoff of the models tested, from Wikipedia articles split
            into chunks{' '}
            <Cite tier={3} href={OVADIA} venue="EMNLP 2024">
              Ovadia et al., Sections 4.1 and 4.3
            </Cite>
            . It then compared two ways of injecting those facts. RAG (retrieval-augmented
            generation) puts the best-matching chunks into the context at question time.
            Unsupervised fine-tuning continues the model&apos;s next-token training on the raw text,
            with no labels or instruction targets{' '}
            <Cite tier={3} href={OVADIA} venue="EMNLP 2024">
              Ovadia et al., Section 3.2
            </Cite>
            .
          </Box>
          <Box variant="p">
            On Mistral 7B the base model scored 0.481. Retrieval scored 0.875; fine-tuning on the
            text scored 0.504, and fine-tuning on ten paraphrases of each chunk scored 0.588{' '}
            <Cite tier={3} href={OVADIA} venue="EMNLP 2024">
              Ovadia et al., Table 2 and Section 4.4
            </Cite>
            . Fine-tuning did gain with repetition: accuracy rose monotonically with the number of
            paraphrases, for every model tested{' '}
            <Cite tier={3} href={OVADIA} venue="EMNLP 2024">
              Ovadia et al., Section 6 and Figure 4
            </Cite>
            . Fine-tuning before retrieval did not help: the fine-tuned Mistral with retrieval
            scored 0.810, below retrieval on the base model{' '}
            <Cite tier={3} href={OVADIA} venue="EMNLP 2024">
              Ovadia et al., Table 2
            </Cite>
            .
          </Box>
          <Box variant="p">
            The 0.875 comes with its condition, which the authors give as the reason retrieval did
            so well: &quot;RAG proves particularly effective due to the one-to-one correspondence
            between the questions and the auxiliary dataset&quot;{' '}
            <Cite tier={3} href={OVADIA} venue="EMNLP 2024">
              Ovadia et al., Section 5
            </Cite>
            . Our reading: the result measures retrieval when the answer is always in the corpus.
            On your own task, the number that decides how much of the 0.875 against 0.504 you keep
            is how often your retriever returns the passage that answers the question.
          </Box>
          <ExpandableSection headerText="All three models in the study">
            <SpaceBetween size="s">
              <InjectionResults />
              <Box variant="small" color="text-body-secondary">
                Accuracy on the current-events questions{' '}
                <Cite tier={3} href={OVADIA} venue="EMNLP 2024">
                  Ovadia et al., Table 2
                </Cite>
                ; the numbers are identical in arXiv v3 and the proceedings. Fine-tuning on the
                text is unsupervised fine-tuning on the raw chunks; the paraphrase runs used ten
                paraphrases of each chunk. On Llama2 7B, fine-tuning on the text scored below the
                base model.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Re-score any format rule a loop found each time the model changes: formatting alone moved accuracy by up to 76 points, and a format's score on one model was a weak guide to another's"
          >
            Constraints and output format: stated in context, contested
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A constraint or an output format is the easiest improvement to state in context: write
            the rule into the prompt. The layout of the prompt then starts to matter on its own.
            Prompt format here means the meaning-preserving choices in that layout: the separators
            between fields, the spacing and the casing. Changing only the casing is one such change{' '}
            <Cite tier={3} href={FORMAT} venue="ICLR 2024">
              Sclar et al., Sections 3.1 and 4.3
            </Cite>
            .
          </Box>
          <Box variant="p">
            Across such changes, few-shot accuracy on LLaMA-2-13B differed by up to 76 points, and
            the sensitivity remained with larger models, with more few-shot examples, and after
            instruction tuning. Format performance also correlated only weakly between models{' '}
            <Cite tier={3} href={FORMAT} venue="ICLR 2024">
              Sclar et al., abstract
            </Cite>
            .
          </Box>
          <Box variant="p">
            Our reading of this study: part of what a text loop learns about format is a search
            over layouts tuned to one model, so a format rule it finds may not survive a model
            change. Instruction tuning, a weight update, left the sensitivity in place; whether
            training one specific format into the weights makes it reliable was not measured in the
            sources read. That is why the row is marked contested, and why it is a row to measure
            on your own model.
          </Box>
          <Box variant="p">
            Re-score the prompt on any new model before trusting the old result, and report
            accuracy as a range across plausible formats; the same paper&apos;s
            FormatSpread estimates that range from a sample of formats &quot;without accessing
            model weights&quot;, so it applies to a model you reach only through an API{' '}
            <Cite tier={3} href={FORMAT} venue="ICLR 2024">
              Sclar et al., abstract and Section 1
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Recognise the two gaps these studies place in the weights: outputs whose spread a prompt did not fix or whose confidence training moved, and instructions paid for on every call"
          >
            Calibration and token cost: weights
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Some gaps sit in the shape of the model&apos;s output distribution. A diffuse
            distribution spreads its samples over all the valid answers; a calibrated model&apos;s
            confidence in an answer matches its chance of being right. Asked to pick a number
            between one and ten uniformly at random, Llama-2-13B-chat disproportionately favoured
            five{' '}
            <Cite tier={3} href={DIFFUSE} venue="COLM 2024">
              Zhang et al., abstract
            </Cite>
            . Sampled at temperature one, Gemma-7B-instruct and Llama-2-13B-chat each put over 60%
            of their probability on five, and in 1,000 samples none of the three models tested
            produced all ten numbers{' '}
            <Cite tier={3} href={DIFFUSE} venue="COLM 2024">
              Zhang et al., Sections 4 and 4.1
            </Cite>
            . The prompt already asked for a uniform pick, so the context-side lever had been
            pulled.
          </Box>
          <Box variant="p">
            Fine-tuning the model to produce a uniform distribution from one to ten gave
            near-uniform output with every number covered{' '}
            <Cite tier={3} href={DIFFUSE} venue="COLM 2024">
              Zhang et al., Section 4.2
            </Cite>
            . To match the tuned models&apos; entropy, a measure of how spread out the samples
            are, the untuned models would need a sampling temperature above 10, a setting the
            authors note is rarely used because output degenerates{' '}
            <Cite tier={3} href={DIFFUSE} venue="COLM 2024">
              Zhang et al., footnote 6
            </Cite>
            . The gain carried over: tuned on five tasks, the models also produced more diffuse
            output on a sixth task held out from tuning{' '}
            <Cite tier={3} href={DIFFUSE} venue="COLM 2024">
              Zhang et al., Section 5
            </Cite>
            .
          </Box>
          <Box variant="p">
            Calibration moves with training too. In OpenAI&apos;s GPT-4 technical report, the
            pre-trained model was highly calibrated on a subset of MMLU, a multiple-choice exam
            benchmark across academic subjects, and post-training &quot;hurts calibration
            significantly&quot;: the calibration error printed on the report&apos;s two plots rose
            from 0.007 to 0.074{' '}
            <Cite tier={2} href={GPT4} venue="technical report">
              GPT-4 Technical Report (OpenAI), Section 5 and Figure 8
            </Cite>
            . Our reading of both studies: the spread and confidence of outputs are properties of
            the probabilities the weights assign, which training set and training moved, and in
            the number study an instruction asking for the right distribution did not produce it.
            To test whether your gap sits in this row, do what the study did: sample one prompt
            1,000 times and count the distinct answers.
          </Box>
          <Box variant="p">
            Token cost is the other weight row. A model given instructions or a scratchpad does
            better, but it does not internalise the gain, which disappears &quot;when the context
            tokens are gone&quot;. Context distillation moves it into the weights: the model
            answers a task input with the instructions in its context, then is fine-tuned to give
            that answer from the task input alone, without the instructions or the scratchpad. It
            internalised abstract task instructions, and it can be repeated to update the model
            with new instructions and overwrite old ones{' '}
            <Cite tier={3} href={CONTEXT_DISTILLATION} venue="preprint">
              Snell et al., abstract
            </Cite>
            .
          </Box>
          <Box variant="p">
            Our reading: this is the bridge from a text loop to a weight update. A prompt or
            playbook that a loop has found and stopped changing can be distilled, and its tokens
            and their latency leave every call. While the text is still changing, keeping it in
            context costs tokens on every call and keeps each edit cheap; section 17, Where Words
            Fall Short, covers how prompt caching prices a stable prefix and re-prices an edited
            one.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Weigh what a weight update can add against what it costs: forgetting grows with the distance from the base model, and new reasoning skill came from a stronger teacher in the studies read"
          >
            Retention and new reasoning skill: the price and the reach of a weight update
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Context keeps old abilities by construction. A frozen model&apos;s weights do not move,
            so whatever it could do before a loop ran, it can still do with the loop&apos;s text
            removed. A weight update pays for its gain in what it forgets. Across RL and SFT
            (supervised fine-tuning, training on target answers token by token), the degree of
            forgetting was determined by the distributional shift, measured as the KL
            (Kullback-Leibler divergence, how far one probability distribution has moved from
            another) between the fine-tuned and the base model on the new task{' '}
            <Cite tier={3} href={RAZOR} venue="ICLR 2026">
              RL&apos;s Razor, abstract
            </Cite>
            . Section 8, What RL Does to a Model, covers why RL moves the model less than SFT. Our
            reading: that KL is a number to watch while training, next to evaluations of what the
            model must keep. The context store has its own way to lose ground, a store polluted by
            misleading feedback, which section 13 covers.
          </Box>
          <Box variant="p">
            A model that fails a task at any number of tries has a skill gap. In the studies read,
            distillation added it: fine-tuning on a stronger model&apos;s outputs &quot;can
            introduce new reasoning patterns from the teacher&quot;{' '}
            <Cite tier={3} href={YUE} venue="NeurIPS 2025">
              Yue et al., abstract
            </Cite>
            . In DeepSeek&apos;s comparison at 32B, a model distilled from DeepSeek-R1 with no RL
            stage beat RL run on the same base, Qwen&apos;s Qwen2.5-32B, on every benchmark
            reported{' '}
            <Cite tier={3} href={R1} venue="Nature 2025">
              DeepSeek-R1, Supplementary F.1, Table 16
            </Cite>
            ; section 7, RLVR &amp; GRPO (RL with verifiable rewards and Group Relative Policy
            Optimization), gives the figures. Distillation also works from the model&apos;s own
            context: context distillation internalised step-by-step reasoning for
            8-digit addition, and the new capability helped on other downstream tasks{' '}
            <Cite tier={3} href={CONTEXT_DISTILLATION} venue="preprint">
              Snell et al., abstract
            </Cite>
            .
          </Box>
          <Box variant="p">
            Whether RL alone adds new reasoning skill is contested. Models trained with RLVR, where
            a program such as an answer checker scores each attempt, beat their base models at
            small k, and the base models score higher pass@k when k is large{' '}
            <Cite tier={3} href={YUE} venue="NeurIPS 2025">
              Yue et al., abstract
            </Cite>
            . Section 8 lays out the debate and the settings in which the boundary moved. On the
            context side, when a prompt optimiser and RL changed the same 8B model, the optimiser
            fell short on AIME, a competition-math exam, and came within a point of RL on the
            other math benchmark; section 14 reports both.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Classify the gap you have now, one row at a time, and take the marks to section 22, where the choice of method starts"
          >
            Classify your gap, row by row
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Write the gap down in one sentence. Then walk the rows below and mark each one it
            touches. A real gap often touches several rows that point to different stores: facts
            that changed last month and outputs whose confidence is off are two rows, one in
            context and one in the weights, and each needs its own fix.
          </Box>
          <ClassifyTable />
          <Box variant="p">
            The marks answer the first of section 22&apos;s three questions: what kind of gap it
            is. Section 22, Choosing a Text Loop, a Hybrid or a Weight Update, adds the other two,
            what signal you have and what the model scores on it today, and whether you can touch
            the weights and how many queries the result will serve. Take your marked rows there.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
