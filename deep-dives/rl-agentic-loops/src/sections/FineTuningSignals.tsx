import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, arxiv } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Date the sources added for the fine-tuning rebuild were read. */
const READ = '2026-11-07';

const BEDROCK_GUIDE = 'https://docs.aws.amazon.com/bedrock/latest/userguide';
/** Bedrock's customisation overview: SFT, reinforcement fine-tuning, distillation. */
const BR_CUSTOM = `${BEDROCK_GUIDE}/custom-models.html`;
/** SageMaker AI distillation page: the three kinds and what each needs from the teacher. */
const SAGEMAKER_DISTILL = 'https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models-distillation.html';

/** Ovadia et al., Fine-Tuning or Retrieval? Comparing Knowledge Injection in LLMs. */
const OVADIA = arxiv('2312.05934v3');
/** Zhou et al., LIMA: Less Is More for Alignment. */
const LIMA = arxiv('2305.11206v1');
/** DeepSeekMath: the unified gradient form. */
const DSM = arxiv('2402.03300v3');
/** Adaptation of Agentic AI (survey): execution-grounded against output-evaluated signals. */
const SURVEY = arxiv('2512.16301v3');
/** Thinking Machines, LoRA Without Regret (lab blog). */
const LORA_BLOG = 'https://thinkingmachines.ai/blog/lora/';
/** Opsahl-Ong et al., MIPRO. */
const MIPRO = arxiv('2406.11695v2');
/** Yuksekgonul et al., TextGrad. */
const TEXTGRAD = arxiv('2406.07496v1');
/** Hu et al., LoRA: Low-Rank Adaptation of Large Language Models. */
const LORA = arxiv('2106.09685v2');
/** Dettmers et al., QLoRA: Efficient Finetuning of Quantized LLMs. */
const QLORA = arxiv('2305.14314v1');

/** Post-training reports, newest first-party report per lab located on 2026-11-07. */
const DSV4 = arxiv('2606.19348v1');
const DSV41F = arxiv('2609.19969v1');
const KIMIK3 = arxiv('2607.24653v2');
const OLMO3 = arxiv('2512.13961v2');
const MINISTRAL3 = arxiv('2601.08584v1');
const MIMO = arxiv('2601.02780v2');
const GLM5 = arxiv('2602.15763v2');
const NEMOTRON = arxiv('2603.19220v2');
const QWEN3 = arxiv('2505.09388v1');
const R1 = arxiv('2501.12948v2');
const GEMMA4 = arxiv('2607.02770v2');
const GPTOSS = arxiv('2508.10925v1');
const LLAMA4_BLOG = 'https://ai.meta.com/blog/llama-4-multimodal-intelligence/';

/* ------------------------------------------------------------------------ */
/* Diagram: the signal-source map                                           */
/* ------------------------------------------------------------------------ */

type MapRow = {
  source: string[];
  family: string;
  trains: string[];
  density: string[];
  dense: boolean;
  whose: string[];
  own: boolean;
  where: string;
};

const MAP_ROWS: MapRow[] = [
  {
    source: ['Raw text from your domain'],
    family: 'continued pretraining',
    trains: ['the next token of each document,', 'with no instructions or answers'],
    density: ['every token'],
    dense: true,
    whose: ['fixed data'],
    own: false,
    where: '3 (here)',
  },
  {
    source: ['Example answers someone wrote'],
    family: 'SFT',
    trains: ['the next token of each answer;', 'the prompt is not trained on'],
    density: ['every answer token'],
    dense: true,
    whose: ['fixed data'],
    own: false,
    where: '4',
  },
  {
    source: ["A stronger model's answers"],
    family: 'distillation',
    trains: ["the teacher's answers, or its", 'probabilities at every token'],
    density: ['every answer token'],
    dense: true,
    whose: ["the teacher's samples"],
    own: false,
    where: '4, 11',
  },
  {
    source: ['Own attempts a grader passed'],
    family: 'rejection-sampling fine-tuning',
    trains: ['SFT on the attempts that passed;', 'the others are dropped'],
    density: ['every token of a', 'kept attempt'],
    dense: true,
    whose: ['own samples'],
    own: true,
    where: '4, 6',
  },
  {
    source: ['Pairs, one judged better'],
    family: 'RLHF, DPO',
    trains: ['which of two answers is better'],
    density: ['one comparison', 'per pair'],
    dense: false,
    whose: ['fixed pairs (DPO) or', 'own samples (RLHF)'],
    own: false,
    where: '8',
  },
  {
    source: ['A score on each own attempt'],
    family: 'RL',
    trains: ['own answers, each weighted', 'by its score'],
    density: ['one score per answer'],
    dense: false,
    whose: ['own samples'],
    own: true,
    where: '5 to 13',
  },
  {
    source: ["A teacher's judgement of", 'each token the model wrote'],
    family: 'on-policy distillation',
    trains: ["own answers, with the teacher's", 'probability as the target'],
    density: ['every token'],
    dense: true,
    whose: ['own samples'],
    own: true,
    where: '11',
  },
];

const MAP_COLS = [
  { x: 16, w: 228, head: 'Signal source and technique' },
  { x: 252, w: 254, head: 'What the model trains on' },
  { x: 514, w: 162, head: 'How dense' },
  { x: 684, w: 166, head: 'Whose samples' },
  { x: 858, w: 86, head: 'Sections' },
];
const MAP_TOP = 58;
const MAP_ROW_H = 62;
const MAP_H = MAP_TOP + MAP_ROWS.length * MAP_ROW_H + 52;

function SignalMapDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 960 ${MAP_H}`}
        role="img"
        aria-labelledby="signals-map-title"
        aria-describedby="signals-map-desc"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="signals-map-title">
          The signal-source map: seven sources of a learning signal, the fine-tuning technique that
          learns from each, what the model trains on, how dense the signal is, whose samples it
          uses, and the section that covers it.
        </title>
        <desc id="signals-map-desc">
          {MAP_ROWS.map(
            (r) =>
              `${r.source.join(' ')}: ${r.family}; trains on ${r.trains.join(' ')}; density ${r.density.join(' ')}; samples: ${r.whose.join(' ')}; sections ${r.where}.`,
          ).join(' ')}
        </desc>
        <style>{`
          .signals-map-bg { fill: #ffffff; }
          .signals-map-head { fill: #414d5c; font: 600 12px sans-serif; }
          .signals-map-src { fill: #16191f; font: 600 13px sans-serif; }
          .signals-map-fam { fill: #0972d3; font: 600 12px sans-serif; }
          .signals-map-txt { fill: #16191f; font: 12px sans-serif; }
          .signals-map-row { fill: #fafafa; stroke: #e9ebed; stroke-width: 1; }
          .signals-map-dense { fill: #e8f2fc; stroke: #0972d3; stroke-width: 1.2; }
          .signals-map-sparse { fill: #fdf3e7; stroke: #b36200; stroke-width: 1.2; }
          .signals-map-own { fill: #ebf6ee; stroke: #037f0c; stroke-width: 1.2; }
          .signals-map-fixed { fill: #f4f4f4; stroke: #879596; stroke-width: 1.2; }
          .signals-map-note { fill: #414d5c; font: 12px sans-serif; }
          .signals-map-rule { stroke: #879596; stroke-width: 1.2; }
        `}</style>
        <rect x={0} y={0} width={960} height={MAP_H} rx={8} className="signals-map-bg" />
        {MAP_COLS.map((c) => (
          <text key={c.head} x={c.x + 4} y={38} className="signals-map-head">
            {c.head}
          </text>
        ))}
        <line x1={16} y1={48} x2={944} y2={48} className="signals-map-rule" />
        {MAP_ROWS.map((r, i) => {
          const y = MAP_TOP + i * MAP_ROW_H;
          const lines = (arr: string[], x: number, cls: string, first: number) =>
            arr.map((l, k) => (
              <text key={l} x={x} y={y + first + k * 16} className={cls}>
                {l}
              </text>
            ));
          return (
            <g key={r.family}>
              <rect x={16} y={y} width={928} height={MAP_ROW_H - 6} rx={5} className="signals-map-row" />
              {lines(r.source, MAP_COLS[0].x + 8, 'signals-map-src', r.source.length > 1 ? 18 : 22)}
              <text x={MAP_COLS[0].x + 8} y={y + (r.source.length > 1 ? 50 : 42)} className="signals-map-fam">
                {r.family}
              </text>
              {lines(r.trains, MAP_COLS[1].x + 4, 'signals-map-txt', r.trains.length > 1 ? 22 : 30)}
              <rect
                x={MAP_COLS[2].x}
                y={y + 8}
                width={MAP_COLS[2].w - 8}
                height={MAP_ROW_H - 22}
                rx={5}
                className={r.dense ? 'signals-map-dense' : 'signals-map-sparse'}
              />
              {lines(r.density, MAP_COLS[2].x + 8, 'signals-map-txt', r.density.length > 1 ? 24 : 32)}
              <rect
                x={MAP_COLS[3].x}
                y={y + 8}
                width={MAP_COLS[3].w - 8}
                height={MAP_ROW_H - 22}
                rx={5}
                className={r.own ? 'signals-map-own' : 'signals-map-fixed'}
              />
              {lines(r.whose, MAP_COLS[3].x + 8, 'signals-map-txt', r.whose.length > 1 ? 24 : 32)}
              <text x={MAP_COLS[4].x + 4} y={y + 32} className="signals-map-txt">
                {r.where}
              </text>
            </g>
          );
        })}
        <rect x={16} y={MAP_H - 36} width={16} height={12} rx={2} className="signals-map-dense" />
        <text x={38} y={MAP_H - 26} className="signals-map-note">
          dense: a target at every token
        </text>
        <rect x={238} y={MAP_H - 36} width={16} height={12} rx={2} className="signals-map-sparse" />
        <text x={260} y={MAP_H - 26} className="signals-map-note">
          sparse: one number per answer or pair
        </text>
        <rect x={500} y={MAP_H - 36} width={16} height={12} rx={2} className="signals-map-own" />
        <text x={522} y={MAP_H - 26} className="signals-map-note">
          the model&apos;s own samples
        </text>
        <rect x={700} y={MAP_H - 36} width={16} height={12} rx={2} className="signals-map-fixed" />
        <text x={722} y={MAP_H - 26} className="signals-map-note">
          text someone else wrote
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: dense against sparse, on the same six-token answer               */
/* ------------------------------------------------------------------------ */

const DS_WRITTEN = ['The', 'answer', 'is', '41', '.', '<end>'];
const DS_OWN = ['The', 'answer', 'is', '42', '.', '<end>'];
const DS_TEACHER = ['0.9', '0.8', '0.9', '0.1', '0.9', '0.9'];

function DenseSparseDiagram() {
  const tx = (i: number) => 20 + i * 106;
  const strip = (y0: number, label: string, toks: string[], own: boolean) => (
    <g>
      <text x={20} y={y0 + 14} className="signals-ds-lbl">
        {label}
      </text>
      {toks.map((t, i) => (
        <g key={`${y0}-${i}`}>
          <rect x={tx(i)} y={y0 + 26} width={96} height={36} rx={5} className={own ? 'signals-ds-own' : 'signals-ds-fixed'} />
          <text x={tx(i) + 48} y={y0 + 49} className="signals-ds-tok">
            {t}
          </text>
        </g>
      ))}
    </g>
  );
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 960 430"
        role="img"
        aria-labelledby="signals-ds-title"
        aria-describedby="signals-ds-desc"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="signals-ds-title">
          Dense against sparse: the same six-token answer under three signals. A written answer
          gives a target at every token; a score gives one number after the last token; on-policy
          distillation gives a teacher&apos;s probability at every token the model wrote.
        </title>
        <desc id="signals-ds-desc">
          Illustrative. Top strip, SFT and distillation: someone else&apos;s answer, The answer is
          41, full stop, end, with a target under each of the six tokens. Middle strip, RL: the
          model&apos;s own answer, The answer is 42, which is wrong, gets one score of 0 after the
          last token, and the score does not say which token was wrong. Bottom strip, on-policy
          distillation: the same own answer, with the teacher&apos;s probability for each token the
          model wrote: 0.9, 0.8, 0.9, then 0.1 for 42, then 0.9 and 0.9. The low value points at
          the token to change.
        </desc>
        <style>{`
          .signals-ds-bg { fill: #ffffff; }
          .signals-ds-lbl { fill: #16191f; font: 600 13px sans-serif; }
          .signals-ds-tok { fill: #16191f; font: 600 14px sans-serif; text-anchor: middle; }
          .signals-ds-sm { fill: #414d5c; font: 12px sans-serif; text-anchor: middle; }
          .signals-ds-note { fill: #414d5c; font: 12px sans-serif; }
          .signals-ds-tgt { fill: #0972d3; font: 600 12px sans-serif; text-anchor: middle; }
          .signals-ds-low { fill: #b0281a; font: 600 12px sans-serif; text-anchor: middle; }
          .signals-ds-fixed { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .signals-ds-own { fill: #ebf6ee; stroke: #037f0c; stroke-width: 1.5; }
          .signals-ds-score { fill: #fdf3e7; stroke: #b36200; stroke-width: 1.5; }
          .signals-ds-ln { stroke: #879596; stroke-width: 1.2; fill: none; }
        `}</style>
        <rect x={0} y={0} width={960} height={430} rx={8} className="signals-ds-bg" />

        {strip(10, "SFT and distillation: someone else's answer, a target at every token", DS_WRITTEN, false)}
        {DS_WRITTEN.map((_, i) => (
          <text key={`t-${i}`} x={tx(i) + 48} y={96} className="signals-ds-tgt">
            target
          </text>
        ))}
        <text x={672} y={52} className="signals-ds-note">
          Six targets: the answer says what
        </text>
        <text x={672} y={68} className="signals-ds-note">
          to write at every position.
        </text>

        {strip(136, "RL: the model's own answer, one score after the last token", DS_OWN, true)}
        <rect x={672} y={162} width={150} height={36} rx={5} className="signals-ds-score" />
        <text x={747} y={185} className="signals-ds-tok">
          score 0 (wrong)
        </text>
        <path d="M 26 208 V 216 H 646 V 208" className="signals-ds-ln" />
        <line x1={336} y1={216} x2={336} y2={226} className="signals-ds-ln" />
        <text x={336} y={244} className="signals-ds-sm">
          One number for six tokens: it does not say which token was wrong.
        </text>

        <g transform="translate(0, 136)">
          {strip(136, "On-policy distillation: the model's own answer, a teacher's probability at every token", DS_OWN, true)}
        </g>
        {DS_TEACHER.map((p, i) => (
          <text key={`p-${i}`} x={tx(i) + 48} y={358} className={p === '0.1' ? 'signals-ds-low' : 'signals-ds-tgt'}>
            teacher {p}
          </text>
        ))}
        <text x={672} y={318} className="signals-ds-note">
          The teacher would rarely write 42:
        </text>
        <text x={672} y={334} className="signals-ds-note">
          the low value points at the token.
        </text>
        <text x={480} y={410} className="signals-ds-sm">
          Illustrative tokens and probabilities. Blue: text someone else wrote. Green: the
          model&apos;s own sample.
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: four published post-training recipes as signal strips          */
/* ------------------------------------------------------------------------ */

type Signal = 'answers' | 'teacher' | 'pairs' | 'scores' | 'opd';

const SIGNAL_CLASS: Record<Signal, string> = {
  answers: 'signals-pp-answers',
  teacher: 'signals-pp-teacher',
  pairs: 'signals-pp-pairs',
  scores: 'signals-pp-scores',
  opd: 'signals-pp-opd',
};

type Stage = { signal: Signal; name: string; lines: string[] };
type Recipe = { model: string; date: string; base: string[]; stages: Stage[] };

const RECIPES: Recipe[] = [
  {
    model: 'DeepSeek-V4',
    date: 'April 2026',
    base: ['pretrained', 'base'],
    stages: [
      { signal: 'answers', name: 'SFT', lines: ['one specialist model', 'per domain'] },
      { signal: 'scores', name: 'RL (GRPO)', lines: ['each specialist', 'trained on its domain'] },
      { signal: 'opd', name: 'On-policy distillation', lines: ['more than ten specialists', 'into one model'] },
    ],
  },
  {
    model: 'Kimi K3',
    date: 'July 2026',
    base: ['pretrained', 'base'],
    stages: [
      { signal: 'teacher', name: 'SFT', lines: ['on trajectories from', 'earlier Kimi specialists'] },
      { signal: 'scores', name: 'RL', lines: ['nine experts: 3 domains', 'x 3 reasoning-effort levels'] },
      { signal: 'opd', name: 'On-policy distillation', lines: ['nine experts', 'into one model'] },
    ],
  },
  {
    model: 'Olmo 3 Think',
    date: 'December 2025',
    base: ['pretrained', 'base'],
    stages: [
      { signal: 'teacher', name: 'SFT', lines: ['on reasoning traces from', 'QwQ-32B and DeepSeek R1'] },
      { signal: 'pairs', name: 'DPO', lines: ['chosen: Qwen3 32B', 'rejected: Qwen3 0.6B'] },
      { signal: 'scores', name: 'RLVR', lines: ['RL on rewards a', 'program checks'] },
    ],
  },
  {
    model: 'Ministral 3',
    date: 'reasoning models, Jan 2026',
    base: ['base pruned and', 'distilled from a', 'larger Mistral'],
    stages: [
      { signal: 'answers', name: 'SFT', lines: ['on chain-of-thought data;', '3B also distils a teacher'] },
      { signal: 'scores', name: 'RL (GRPO)', lines: ['STEM tasks, then', 'rubric-judged chat'] },
      { signal: 'pairs', name: 'Online DPO', lines: ['pairs of its own answers', 'ranked by a reward model'] },
    ],
  },
];

const PP_LEGEND: { signal: Signal; label: string }[] = [
  { signal: 'answers', label: 'example answers (SFT)' },
  { signal: 'teacher', label: "a teacher's answers or probabilities" },
  { signal: 'pairs', label: 'preference pairs (DPO)' },
  { signal: 'scores', label: 'scores on own attempts (RL)' },
  { signal: 'opd', label: "a teacher's judgement of own tokens" },
];

function PipelinesDiagram() {
  const top = 92;
  const step = 92;
  const H = top + RECIPES.length * step + 14;
  const baseX = 196;
  const baseW = 120;
  const stageX = (k: number) => 340 + k * 204;
  const stageW = 184;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 960 ${H}`}
        role="img"
        aria-labelledby="signals-pp-title"
        aria-describedby="signals-pp-desc"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="signals-pp-title">
          Four published post-training recipes drawn as sequences of signals, each stage coloured by
          the signal it learns from.
        </title>
        <desc id="signals-pp-desc">
          {RECIPES.map(
            (r) =>
              `${r.model} (${r.date}): ${r.base.join(' ')}, then ${r.stages
                .map((s) => `${s.name}, ${s.lines.join(' ')}`)
                .join('; then ')}.`,
          ).join(' ')}
        </desc>
        <style>{`
          .signals-pp-bg { fill: #ffffff; }
          .signals-pp-model { fill: #16191f; font: 600 14px sans-serif; }
          .signals-pp-date { fill: #414d5c; font: 12px sans-serif; }
          .signals-pp-name { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .signals-pp-txt { fill: #16191f; font: 12px sans-serif; text-anchor: middle; }
          .signals-pp-leg { fill: #16191f; font: 12px sans-serif; }
          .signals-pp-base { fill: #f4f4f4; stroke: #879596; stroke-width: 1.2; }
          .signals-pp-answers { fill: #e8f2fc; stroke: #0972d3; stroke-width: 1.5; }
          .signals-pp-teacher { fill: #f1ebfa; stroke: #7d4fc4; stroke-width: 1.5; }
          .signals-pp-pairs { fill: #fdf3e7; stroke: #b36200; stroke-width: 1.5; }
          .signals-pp-scores { fill: #ebf6ee; stroke: #037f0c; stroke-width: 1.5; }
          .signals-pp-opd { fill: #e6f6f6; stroke: #00777a; stroke-width: 1.5; }
          .signals-pp-arrow { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
          .signals-pp-head { fill: #5f6b7a; }
        `}</style>
        <rect x={0} y={0} width={960} height={H} rx={8} className="signals-pp-bg" />
        {PP_LEGEND.map((l, i) => {
          const x = i < 3 ? 20 + i * 300 : 20 + (i - 3) * 300;
          const y = i < 3 ? 22 : 48;
          return (
            <g key={l.signal}>
              <rect x={x} y={y} width={18} height={14} rx={3} className={SIGNAL_CLASS[l.signal]} />
              <text x={x + 26} y={y + 12} className="signals-pp-leg">
                {l.label}
              </text>
            </g>
          );
        })}
        {RECIPES.map((r, i) => {
          const y = top + i * step;
          return (
            <g key={r.model}>
              <text x={20} y={y + 28} className="signals-pp-model">
                {r.model}
              </text>
              <text x={20} y={y + 46} className="signals-pp-date">
                {r.date}
              </text>
              <rect x={baseX} y={y} width={baseW} height={72} rx={6} className="signals-pp-base" />
              {r.base.map((l, k) => (
                <text
                  key={l}
                  x={baseX + baseW / 2}
                  y={y + (r.base.length > 2 ? 22 : 32) + k * 16}
                  className="signals-pp-txt"
                >
                  {l}
                </text>
              ))}
              {r.stages.map((s, k) => {
                const x = stageX(k);
                const prevEnd = k === 0 ? baseX + baseW : stageX(k - 1) + stageW;
                return (
                  <g key={`${r.model}-${s.name}-${k}`}>
                    <line x1={prevEnd + 2} y1={y + 36} x2={x - 6} y2={y + 36} className="signals-pp-arrow" />
                    <path d={`M ${x - 6} ${y + 31} L ${x} ${y + 36} L ${x - 6} ${y + 41} Z`} className="signals-pp-head" />
                    <rect x={x} y={y} width={stageW} height={72} rx={6} className={SIGNAL_CLASS[s.signal]} />
                    <text x={x + stageW / 2} y={y + 22} className="signals-pp-name">
                      {s.name}
                    </text>
                    {s.lines.map((l, j) => (
                      <text key={l} x={x + stageW / 2} y={y + 42 + j * 16} className="signals-pp-txt">
                        {l}
                      </text>
                    ))}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: how much of the model changes (schematic)                        */
/* ------------------------------------------------------------------------ */

function HowMuchChangesDiagram() {
  const rows = [
    {
      name: 'Full fine-tuning',
      note: 'every weight is trained',
      frozenW: 0,
      trainedW: 580,
    },
    {
      name: 'LoRA',
      note: 'weights frozen; small added matrices trained',
      frozenW: 534,
      trainedW: 40,
    },
    {
      name: 'QLoRA',
      note: 'LoRA over frozen weights stored at 4 bits',
      frozenW: 134,
      trainedW: 40,
    },
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 960 250"
        role="img"
        aria-labelledby="signals-share-title"
        aria-describedby="signals-share-desc"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="signals-share-title">
          How much of the model changes, schematic: full fine-tuning trains every weight; LoRA
          freezes the weights and trains small added matrices; QLoRA does the same over weights
          stored at 4 bits.
        </title>
        <desc id="signals-share-desc">
          Schematic, not to scale. Three bars. Full fine-tuning: one bar, all trained. LoRA: a long
          frozen bar and a short trained adapter. QLoRA: a frozen bar about a quarter as long,
          because 4-bit weights take a quarter of the memory of 16-bit weights, plus the same short
          trained adapter.
        </desc>
        <style>{`
          .signals-share-bg { fill: #ffffff; }
          .signals-share-name { fill: #16191f; font: 600 13px sans-serif; }
          .signals-share-note { fill: #414d5c; font: 12px sans-serif; }
          .signals-share-frozen { fill: #e9ebed; stroke: #879596; stroke-width: 1.2; }
          .signals-share-trained { fill: #0972d3; }
          .signals-share-leg { fill: #16191f; font: 12px sans-serif; }
        `}</style>
        <rect x={0} y={0} width={960} height={250} rx={8} className="signals-share-bg" />
        {rows.map((r, i) => {
          const y = 20 + i * 62;
          return (
            <g key={r.name}>
              <text x={20} y={y + 20} className="signals-share-name">
                {r.name}
              </text>
              <text x={20} y={y + 38} className="signals-share-note">
                {r.note}
              </text>
              {r.frozenW > 0 && (
                <rect x={340} y={y + 8} width={r.frozenW} height={28} rx={4} className="signals-share-frozen" />
              )}
              <rect
                x={340 + r.frozenW + (r.frozenW > 0 ? 6 : 0)}
                y={y + 8}
                width={r.trainedW}
                height={28}
                rx={4}
                className="signals-share-trained"
              />
            </g>
          );
        })}
        <rect x={20} y={212} width={18} height={14} rx={3} className="signals-share-trained" />
        <text x={46} y={224} className="signals-share-leg">
          trained
        </text>
        <rect x={130} y={212} width={18} height={14} rx={3} className="signals-share-frozen" />
        <text x={156} y={224} className="signals-share-leg">
          frozen
        </text>
        <text x={240} y={224} className="signals-share-leg">
          Schematic: bar lengths show memory for the weights, not measured sizes.
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: signal by store                                                  */
/* ------------------------------------------------------------------------ */

const GRID_COLS = ['The weights', 'The context of a frozen model', 'A small trained model'];
const GRID_ROWS: { signal: string; cells: (string[] | null)[] }[] = [
  {
    signal: 'Raw domain text',
    cells: [['continued pretraining', '(this section)'], ['retrieval puts the documents', 'in the prompt (21)'], null],
  },
  {
    signal: 'Example answers',
    cells: [['SFT (4)'], ['few-shot demonstrations an', 'optimiser picks, MIPROv2 (17)'], null],
  },
  {
    signal: "A stronger model's answers",
    cells: [['distillation (4, 11)'], ['a strong model writes the prompt', 'a cheap one runs, TextGrad (17)'], null],
  },
  {
    signal: 'Preference pairs',
    cells: [['RLHF, DPO (8)'], null, null],
  },
  {
    signal: 'Scores on own attempts',
    cells: [['RL (5 to 13)'], ['Reflexion, playbooks,', 'GEPA (14 to 17)'], ['an advisor trained with RL', 'in front of a frozen model (19)']],
  },
  {
    signal: "A teacher's judgement of own tokens",
    cells: [['on-policy distillation (11)'], null, null],
  },
];

function SignalStoreGridDiagram() {
  const colX = [270, 498, 726];
  const colW = 218;
  const top = 56;
  const rowH = 58;
  const H = top + GRID_ROWS.length * rowH + 36;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 960 ${H}`}
        role="img"
        aria-labelledby="signals-grid-title"
        aria-describedby="signals-grid-desc"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="signals-grid-title">
          Signal by store: each signal source against the three places a lesson can be kept. Filled
          cells name a method and its section; empty cells mean none was found in the research read
          for this dive.
        </title>
        <desc id="signals-grid-desc">
          {GRID_ROWS.map(
            (r) =>
              `${r.signal}: ${r.cells
                .map((c, k) => `${GRID_COLS[k]}, ${c ? c.join(' ') : 'none in the research read'}`)
                .join('; ')}.`,
          ).join(' ')}
        </desc>
        <style>{`
          .signals-grid-bg { fill: #ffffff; }
          .signals-grid-head { fill: #414d5c; font: 600 12px sans-serif; text-anchor: middle; }
          .signals-grid-sig { fill: #16191f; font: 600 12px sans-serif; }
          .signals-grid-txt { fill: #16191f; font: 12px sans-serif; text-anchor: middle; }
          .signals-grid-none { fill: #5f6b7a; font: italic 11px sans-serif; text-anchor: middle; }
          .signals-grid-w { fill: #e8f2fc; stroke: #0972d3; stroke-width: 1.2; }
          .signals-grid-c { fill: #ebf6ee; stroke: #037f0c; stroke-width: 1.2; }
          .signals-grid-s { fill: #f1ebfa; stroke: #7d4fc4; stroke-width: 1.2; }
          .signals-grid-empty { fill: #fafafa; stroke: #d1d5db; stroke-width: 1; stroke-dasharray: 4 3; }
        `}</style>
        <rect x={0} y={0} width={960} height={H} rx={8} className="signals-grid-bg" />
        {GRID_COLS.map((c, k) => (
          <text key={c} x={colX[k] + colW / 2} y={38} className="signals-grid-head">
            {c}
          </text>
        ))}
        {GRID_ROWS.map((r, i) => {
          const y = top + i * rowH;
          const sigLines = r.signal.length > 26 ? ["A teacher's judgement", 'of own tokens'] : [r.signal];
          return (
            <g key={r.signal}>
              {sigLines.map((l, k) => (
                <text key={l} x={20} y={y + (sigLines.length > 1 ? 22 : 30) + k * 16} className="signals-grid-sig">
                  {l}
                </text>
              ))}
              {r.cells.map((c, k) => (
                <g key={`${r.signal}-${k}`}>
                  <rect
                    x={colX[k]}
                    y={y + 4}
                    width={colW}
                    height={rowH - 10}
                    rx={5}
                    className={c ? ['signals-grid-w', 'signals-grid-c', 'signals-grid-s'][k] : 'signals-grid-empty'}
                  />
                  {c ? (
                    c.map((l, j) => (
                      <text
                        key={l}
                        x={colX[k] + colW / 2}
                        y={y + (c.length > 1 ? 24 : 32) + j * 16}
                        className="signals-grid-txt"
                      >
                        {l}
                      </text>
                    ))
                  ) : (
                    <text x={colX[k] + colW / 2} y={y + 32} className="signals-grid-none">
                      none in the research read
                    </text>
                  )}
                </g>
              ))}
            </g>
          );
        })}
        <text x={480} y={H - 12} className="signals-grid-txt">
          Numbers in brackets are this dive&apos;s sections. Placements are our reading of each
          method&apos;s signal.
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function FineTuningSignals() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={`Name the signal you have, and the family of techniques that learns from it follows (reports and docs read ${READ})`}
          >
            3. Fine-Tuning Techniques: Where the Learning Signal Comes From
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 1 sorted learning by where it is kept. This section sorts fine-tuning by where
            its signal comes from, because the signal settles most of what follows: what the model
            trains on, how much each example tells it, whose text it learns from, and so what a
            technique can teach and what it needs before you start.
          </Box>
          <Box variant="p">
            Fine-tuning here is any further training of a pretrained model&apos;s weights, with RL
            as one family of it. Amazon Bedrock draws the same boundary: its customization methods
            are supervised fine-tuning, reinforcement fine-tuning and distillation{' '}
            <Cite tier={1} href={BR_CUSTOM} accessed={READ}>
              Bedrock user guide: customize your model
            </Cite>
            . Seven signal sources cover every family this dive&apos;s research names. The section
            maps them, shows the one update they share, reads four published training recipes as
            sequences of signals, and ends by setting each signal against the three stores of
            section 1.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find your signal in one table, and read off what the model trains on and which section covers it"
          >
            Seven signal sources
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each row is a source of signal and the technique that learns from it. Two columns carry
            most of the difference. How dense the signal is: a target at every token, or one number
            for a whole answer. Whose samples the model trains on: text someone else wrote, or
            answers the model wrote itself.
          </Box>
          <SignalMapDiagram />
          <Box variant="p">What each row can teach, and what it needs before you start:</Box>
          <ul>
            <li>
              <Box variant="strong" display="inline">Raw domain text, continued pretraining.</Box>{' '}
              It teaches the language of a domain; facts are harder to add this way. On
              multiple-choice questions about news from after the models&apos; training cutoff,
              Mistral 7B scored 0.504 after fine-tuning on the documents and 0.875 with retrieval
              placing the matching document in the prompt, from a base of 0.481; in that test every
              question had its own document in the retrieval corpus{' '}
              <Cite tier={3} href={OVADIA} venue="EMNLP 2024">
                Ovadia et al., Table 2
              </Cite>
              . It needs a corpus and nothing else. No later section covers it; section 21 takes
              up facts in the weights against facts in the context.
            </li>
            <li>
              <Box variant="strong" display="inline">Example answers, SFT.</Box> It teaches a format,
              a behaviour and any reasoning the answers show. It needs answers someone trusted
              wrote; LIMA fine-tuned a 65B model on 1,000 of them{' '}
              <Cite tier={3} href={LIMA} venue="NeurIPS 2023" accessed={READ}>
                LIMA, abstract
              </Cite>
              . Section 4.
            </li>
            <li>
              <Box variant="strong" display="inline">A stronger model&apos;s answers, distillation.</Box>{' '}
              It teaches what the teacher does, including reasoning the student never produced on
              its own. It needs a teacher whose terms allow training on its output, and the
              inference to run it. Sections 4 and 11.
            </li>
            <li>
              <Box variant="strong" display="inline">
                Own attempts a grader passed, rejection-sampling fine-tuning.
              </Box>{' '}
              It teaches the model more of its own best behaviour. It needs a grader and a model
              that passes some of the time. Sections 4 and 6.
            </li>
            <li>
              <Box variant="strong" display="inline">Preference pairs, RLHF and DPO.</Box> It
              teaches which of two answers people, or a judge model, prefer, for qualities no
              program can check. It needs ranked pairs. Section 8.
            </li>
            <li>
              <Box variant="strong" display="inline">A score on each own attempt, RL.</Box> It
              teaches the model to do more often what scored well among the things it already
              sometimes does. It needs only a grader, and a model that scores above zero on some
              prompts. Sections 5 to 13; section 10 shows what it changes in a model.
            </li>
            <li>
              <Box variant="strong" display="inline">
                A teacher&apos;s judgement of each token the model wrote, on-policy distillation.
              </Box>{' '}
              It teaches what the teacher would have written, at the places where the student
              actually goes wrong. In its standard form it needs a teacher that exposes its token
              probabilities, shares the student&apos;s tokenizer and stays available through
              training{' '}
              <Cite tier={1} href={SAGEMAKER_DISTILL} accessed={READ}>
                SageMaker AI developer guide: distillation
              </Cite>
              . Section 11.
            </li>
          </ul>
          <Box variant="p">
            The score row splits once more, by how the score is checked. A score can come from
            running something, such as tests, a compiler or an environment; a survey of agent
            adaptation calls that execution-grounded. Or it can come from evaluating the output,
            with an exact-match check against a gold answer, a rubric or a judge, which the survey
            calls output-evaluated{' '}
            <Cite tier={3} href={SURVEY} venue="preprint">
              Adaptation of Agentic AI, Sections 1 and 3.3
            </Cite>
            . These are two ways to check a score, inside the score row, and section 14 uses them to
            place the loops that keep their lesson in the context.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict how much a technique learns per example from how much each example tells the model"
          >
            Dense or sparse: how much one answer says
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A written answer is a dense signal. At every position it says which token the model
            should have written, so one example corrects the model token by token. A score is a
            sparse signal: one number for the whole answer. It says the answer as a whole was good
            or bad and leaves the model to work out, over many attempts, which tokens earned the
            score. Section 6 shows how RL turns that one score into a push on every token of the
            answer.
          </Box>
          <Box variant="p">
            The second difference is whose text the model trains on. A target someone else wrote
            can be text the model would never have produced. A score lands on the model&apos;s own
            attempts, so it trains on what the model actually does; section 5 names the two cases
            off-policy and on-policy. On-policy distillation takes the dense target and the own
            samples together: the student writes an answer, and a teacher grades every token of
            it.
          </Box>
          <DenseSparseDiagram />
          <Box variant="p">
            One lab puts the gap as information per attempt: supervised learning provides a number
            of bits that grows with the answer&apos;s length, O(number of tokens), and
            policy-gradient RL a fixed amount per attempt, O(1), whatever its length{' '}
            <Cite tier={2} href={LORA_BLOG}>
              Thinking Machines, LoRA Without Regret (lab blog), Reinforcement learning
            </Cite>
            . The practical reading [our reading]: a dense signal teaches more per example and
            needs someone to have written the targets; a sparse signal needs only a grader and pays
            for it in attempts. Section 11 sets the two against each other with measured costs.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read any new technique as three choices: whose text it trains on, what judges that text, and how the judgement sets each token's push"
          >
            One update behind every row
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every technique on the map changes the weights the same way. It makes some tokens more
            likely and others less likely, and it sets a multiplier for each token, how hard that
            token is pushed. SFT gives every token of a written answer the same multiplier and
            pushes each one up. RL gives all the tokens of one of the model&apos;s own attempts a
            shared multiplier set by the attempt&apos;s score: positive, a push up, when it scored
            well, and negative, a push down, when it scored badly. Distillation pushes the student toward the teacher&apos;s answer or its
            probabilities. Section 4 shows the other half of the push: with the same multiplier, a
            token the model found unlikely moves further.
          </Box>
          <Box variant="p">
            So a technique comes down to three choices: where the training text comes from (a
            dataset, a teacher, the model itself), what judges it (nothing, a grader, a comparison
            between two answers, a teacher), and how that judgement becomes the amount each token is
            pushed. DeepSeekMath writes the update of SFT, rejection-sampling fine-tuning, DPO, PPO
            and GRPO in this one form, with the three choices as its three parts{' '}
            <Cite tier={3} href={DSM} venue="preprint">
              DeepSeekMath, Section 5.2.1 and Eq. 5
            </Cite>
            . Section 4 writes the form as a formula and opens a table of the choices, one row per
            technique, which grows through sections 6 to 8.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read a lab's post-training report as a sequence of signals, and see the order the newest recipes share"
          >
            Four published recipes, read as signals
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A released model is fine-tuned several times in a row, each stage with its own signal;
            labs call the sequence post-training. Four recent first-party reports, each drawn as its
            stages and coloured by signal. Five words recur in them. A specialist, or expert, is a
            copy of the model fine-tuned for one domain such as math or code, to be merged back
            later. A trajectory is a whole multi-step attempt, every turn and tool call of it.
            Online means trained on answers the model being trained has just written, rather than
            on a fixed dataset. Pruning makes a model smaller by removing weights. Logit
            distillation trains the student toward the teacher&apos;s full list of next-token
            probabilities rather than only the text the teacher chose; logits are the raw scores
            a model turns into those probabilities.
          </Box>
          <PipelinesDiagram />
          <Box variant="small" color="text-body-secondary">
            Sources:{' '}
            <Cite tier={3} href={DSV4} venue="preprint" accessed={READ}>
              DeepSeek-V4, Section 5.1
            </Cite>
            ,{' '}
            <Cite tier={3} href={KIMIK3} venue="preprint" accessed={READ}>
              Kimi K3, Section 4.1
            </Cite>
            ,{' '}
            <Cite tier={3} href={OLMO3} venue="preprint" accessed={READ}>
              Olmo 3, Section 4
            </Cite>
            ,{' '}
            <Cite tier={3} href={MINISTRAL3} venue="preprint" accessed={READ}>
              Ministral 3, Sections 3.2 and 3.3
            </Cite>
            . Dates are each report&apos;s first arXiv version. Colours are our mapping of each
            stage to the map&apos;s rows. The Ministral 3 strip is the reasoning models&apos;
            recipe; its instruct models run SFT, then online DPO, with no RL stage.
          </Box>
          <Box variant="p">
            Three patterns run through the four, as we read them. Every recipe starts from written
            answers, and in three of the four other models wrote them: Olmo 3&apos;s SFT targets are
            reasoning traces generated with QwQ-32B and DeepSeek R1, Ministral 3 trains its instruct
            SFT with logit distillation from Mistral Medium 3 and its 3B reasoning SFT with logit
            distillation from Magistral Small 1.2, and Kimi K3 synthesises
            its SFT trajectories with specialist models from its earlier releases. Scores on the
            model&apos;s own attempts come after the written answers in all four: last in Olmo 3,
            and followed by a distillation or preference stage in the other three. Preference pairs, where used,
            come either before RL or after it: Olmo 3 found that RL starting from its DPO
            checkpoint did better than RL starting from its SFT checkpoint, in one 7B run of 1,000
            RL steps{' '}
            <Cite tier={3} href={OLMO3} venue="preprint" accessed={READ}>
              Olmo 3, Table 22
            </Cite>
            .
          </Box>
          <Box variant="p">
            The newest recipes end with on-policy distillation that merges several RL-trained
            specialists into one model. DeepSeek-V4 replaced its earlier mixed RL stage with it and
            distils from more than ten teachers{' '}
            <Cite tier={3} href={DSV4} venue="preprint" accessed={READ}>
              DeepSeek-V4, Sections 1 and 5.1.2
            </Cite>
            ; DeepSeek-V4.1-Flash ends on over 40{' '}
            <Cite tier={3} href={DSV41F} venue="preprint" accessed={READ}>
              DeepSeek-V4.1-Flash, Section 5.2.4
            </Cite>
            ; Kimi K3 merges its nine experts this way. The same stage appears in Xiaomi&apos;s
            MiMo-V2-Flash, which names the reason, the &quot;see-saw&quot; effect where improving
            one skill causes regressions in others{' '}
            <Cite tier={3} href={MIMO} venue="preprint" accessed={READ}>
              MiMo-V2-Flash, Section 4.1
            </Cite>
            . Two more use it to recover what earlier RL stages cost: Zhipu&apos;s GLM-5 runs it
            last, with the earlier stages&apos; checkpoints as teachers{' '}
            <Cite tier={3} href={GLM5} venue="preprint" accessed={READ}>
              GLM-5, Section 3.5
            </Cite>
            , and NVIDIA&apos;s Nemotron-Cascade 2 inserts it between RL stages{' '}
            <Cite tier={3} href={NEMOTRON} venue="preprint" accessed={READ}>
              Nemotron-Cascade 2, Sections 1 and 4.4
            </Cite>
            . That makes six reports from 2026 that train specialists or stages with RL and then
            distil them on-policy into one model [our aggregation]. Section 11
            builds on-policy distillation and sets it against RL.
          </Box>
          <ExpandableSection headerText="Other recent reports: DeepSeek-R1, Qwen3, Llama 4, and two that give no stages">
            <SpaceBetween size="s">
              <Box variant="p">
                DeepSeek-R1, the dive&apos;s running example, runs four stages on DeepSeek-V3-Base:
                SFT on a small set of human-styled reasoning samples, RL, rejection sampling plus
                SFT on about 800,000 samples, and a second RL stage{' '}
                <Cite tier={3} href={R1} venue="Nature 2025" accessed={READ}>
                  DeepSeek-R1, Section 3 and Supplementary B.3.3
                </Cite>
                . The same 800,000 samples, used for SFT alone, made the R1-Distill models of
                section 4.
              </Box>
              <Box variant="p">
                Qwen3 trains its largest models in four stages (SFT on long reasoning, reasoning
                RL, SFT that merges thinking and non-thinking modes, general RL) and distils its
                smaller models from them, first from the teacher&apos;s answers and then on-policy{' '}
                <Cite tier={3} href={QWEN3} venue="preprint" accessed={READ}>
                  Qwen3, Sections 4 and 4.5
                </Cite>
                . Section 11 uses its comparison of the two.
              </Box>
              <Box variant="p">
                Meta&apos;s newest first-party description is the Llama 4 launch post of 5 April
                2025, a blog post with no technical report behind it. It orders lightweight SFT,
                online RL and lightweight DPO, and gives the reason for keeping the first and last
                light: &quot;SFT and DPO can over-constrain the model, restricting exploration
                during the online RL stage&quot;{' '}
                <Cite tier={2} href={LLAMA4_BLOG} accessed={READ}>
                  Meta, The Llama 4 herd (lab blog)
                </Cite>
                .
              </Box>
              <Box variant="p">
                Two reports give no stages. Gemma 4&apos;s says its post-training is
                &quot;similar&quot; to Gemma 3&apos;s, with a thinking mode added{' '}
                <Cite tier={3} href={GEMMA4} venue="preprint" accessed={READ}>
                  Gemma 4, Section 3
                </Cite>
                ; the gpt-oss model card names &quot;large-scale distillation and reinforcement
                learning&quot; without an order{' '}
                <Cite tier={3} href={GPTOSS} venue="preprint" accessed={READ}>
                  gpt-oss model card, abstract and Section 2.5
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
            description="Pick full fine-tuning, LoRA or QLoRA by memory, knowing the choice is separate from the signal"
          >
            How much of the model changes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The second axis of fine-tuning is independent of the first: any row of the map can
            train every weight or a small part. Full fine-tuning trains every weight. LoRA
            (low-rank adaptation) freezes the pretrained weights and trains small matrices added
            beside them{' '}
            <Cite tier={3} href={LORA} venue="preprint" accessed={READ}>
              LoRA, abstract
            </Cite>
            . QLoRA runs LoRA over frozen weights stored at 4 bits, which cuts the memory the frozen
            part takes{' '}
            <Cite tier={3} href={QLORA} venue="preprint" accessed={READ}>
              QLoRA, abstract
            </Cite>
            .
          </Box>
          <HowMuchChangesDiagram />
          <Box variant="p">
            For RL the choice costs little in one lab&apos;s runs: on Llama-3.1-8B, a rank-1 LoRA,
            whose added matrices are a single column and a single row, the smallest LoRA there is,
            matched full fine-tuning for policy-gradient RL, which fits the information argument
            above: an RL run has few bits to store{' '}
            <Cite tier={2} href={LORA_BLOG}>
              Thinking Machines, LoRA Without Regret (lab blog), Reinforcement learning
            </Cite>
            . The{' '}
            <Link href="../llm-training-systems/">
              training dive, section 16: Fine-Tuning &amp; Post-Training Runs
            </Link>{' '}
            sizes the memory of each option and picks a framework, and the{' '}
            <Link href="../vllm/">vLLM dive, section 13: LoRA &amp; Multi-Adapter Serving</Link>{' '}
            serves many adapters on one base model.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Place a fine-tuning run and a context loop on one grid: the same signal, kept in a different store"
          >
            Signal by store
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 1 named three places to keep a lesson: the weights, the context a frozen model
            reads, and a small trained model that writes context for a large one. Crossing them with
            the signal sources gives one grid for the whole dive. Fine-tuning is its first column.
            The loops of sections 14 to 19 fill the other two from the same signals: a score on an
            attempt can update the weights through RL, or a playbook the next attempt reads.
          </Box>
          <Box variant="p">
            Two names in the grid are new here, both prompt optimisers of section 17. MIPROv2
            proposes instructions and few-shot examples for a prompt and keeps the combinations
            that score best{' '}
            <Cite tier={3} href={MIPRO} venue="EMNLP 2024">
              MIPRO, abstract and Section 3
            </Cite>
            . In TextGrad a strong model writes feedback that rewrites the prompt a cheaper model
            runs, so the strong model&apos;s judgement ends up in the cheap model&apos;s context{' '}
            <Cite tier={3} href={TEXTGRAD} venue="Nature 2025">
              TextGrad (arXiv v1), Section 3.3
            </Cite>
            .
          </Box>
          <SignalStoreGridDiagram />
          <Box variant="p">
            An empty cell says that the research read for this dive found no method there; it says
            nothing about whether one exists. The grid is also where a choice starts. Find the row
            for the signal you hold, then pick the column: the weights when you can train the model
            and serve the result, the context when the model is frozen or the lesson changes often.
            Section 25 walks that choice in full; for a written answer or a teacher, read on to
            section 4, and for a grader alone, section 4 and then section 5.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
