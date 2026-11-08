import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, arxiv, gh, TRL_TAG } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Date the sources added for the fine-tuning rebuild were read. */
const READ = '2026-11-07';

/** Hinton, Vinyals and Dean, Distilling the Knowledge in a Neural Network. */
const HINTON = arxiv('1503.02531v1');
/** Kim and Rush, Sequence-Level Knowledge Distillation. */
const KIM_RUSH = arxiv('1606.07947v4');
/** Zhou et al., LIMA: Less Is More for Alignment. */
const LIMA = arxiv('2305.11206v1');
/** DeepSeek-R1 (v2, the Nature version). */
const R1 = arxiv('2501.12948v2');
/** DeepSeekMath: the unified gradient and online rejection-sampling fine-tuning. */
const DSM = arxiv('2402.03300v3');
/** Shenfeld et al., RL's Razor: Why Online Reinforcement Learning Forgets Less. */
const RAZOR = arxiv('2509.04259v1');
/** Chu et al., SFT Memorizes, RL Generalizes. */
const CHU = arxiv('2501.17161v2');
/** RL Squeezes, SFT Expands. */
const SQUEEZE = arxiv('2509.21128v2');
/** Ouyang et al., InstructGPT. */
const INSTRUCTGPT = arxiv('2203.02155v1');
/** Agarwal et al., On-Policy Distillation of Language Models (GKD). */
const GKD = arxiv('2306.13649v3');
/** Snell et al., Learning by Distilling Context. */
const CONTEXT_DISTILLATION = arxiv('2209.15189v1');

const TRL = 'huggingface/trl';
const trl = (file: string, lines: string) => gh(TRL, TRL_TAG, `trl/trainer/${file}`, lines);

const BEDROCK_GUIDE = 'https://docs.aws.amazon.com/bedrock/latest/userguide';
const BEDROCK_DISTILL = `${BEDROCK_GUIDE}/model-distillation.html`;
const BEDROCK_DISTILL_PAIRS = `${BEDROCK_GUIDE}/prequisites-model-distillation.html`;
const SAGEMAKER_GUIDE = 'https://docs.aws.amazon.com/sagemaker/latest/dg';
const SAGEMAKER_CUSTOMIZE = `${SAGEMAKER_GUIDE}/customizing-models.html`;
const SAGEMAKER_DISTILL = `${SAGEMAKER_GUIDE}/customizing-models-distillation.html`;

/* ------------------------------------------------------------------------ */
/* Diagram: one SFT example, prompt masked, a loss term per answer token     */
/* ------------------------------------------------------------------------ */

const SFT_PROMPT = ['Capital', 'of', 'France', '?'];
const SFT_ANSWER = [
  { tok: 'Paris', p: '0.5', loss: '0.69' },
  { tok: '.', p: '0.9', loss: '0.11' },
  { tok: '<end>', p: '0.2', loss: '1.61' },
];

function SftExampleDiagram() {
  const promptX = (i: number) => 20 + i * 100;
  const answerX = (i: number) => 452 + i * 132;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 290"
        role="img"
        aria-labelledby="answers-sft-title"
        aria-describedby="answers-sft-desc"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="answers-sft-title">
          One SFT example. The prompt tokens are context and carry no loss. Each answer token is a
          target with its own loss term, minus the log of the probability the model gave it.
        </title>
        <desc id="answers-sft-desc">
          Illustrative numbers. Prompt: Capital, of, France, question mark, all marked no loss.
          Answer: Paris with probability 0.5 and loss term 0.69; a full stop with probability 0.9 and
          loss term 0.11; the end-of-turn token with probability 0.2 and loss term 1.61. The loss for
          the example is the average of the three terms, 0.80.
        </desc>
        <style>{`
          .answers-sft-bg { fill: #ffffff; }
          .answers-sft-pbox { fill: #f4f4f4; stroke: #879596; stroke-width: 1.2; stroke-dasharray: 4 3; }
          .answers-sft-abox { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .answers-sft-tok { fill: #16191f; font: 600 14px sans-serif; text-anchor: middle; }
          .answers-sft-ptok { fill: #5f6b7a; font: 14px sans-serif; text-anchor: middle; }
          .answers-sft-lbl { fill: #414d5c; font: 600 12px sans-serif; }
          .answers-sft-sm { fill: #414d5c; font: 12px sans-serif; text-anchor: middle; }
          .answers-sft-loss { fill: #8b3a00; font: 600 13px sans-serif; text-anchor: middle; }
          .answers-sft-eq { fill: #0f1b2a; font: 600 14px sans-serif; text-anchor: middle; }
          .answers-sft-ln { stroke: #879596; stroke-width: 1.2; fill: none; }
        `}</style>
        <rect x={0} y={0} width={860} height={290} rx={8} className="answers-sft-bg" />

        <text x={20} y={28} className="answers-sft-lbl">
          Prompt x: context, no loss
        </text>
        <text x={452} y={28} className="answers-sft-lbl">
          Answer y: a target at every token
        </text>

        {SFT_PROMPT.map((t, i) => (
          <g key={t}>
            <rect x={promptX(i)} y={44} width={88} height={44} rx={6} className="answers-sft-pbox" />
            <text x={promptX(i) + 44} y={71} className="answers-sft-ptok">
              {t}
            </text>
            <text x={promptX(i) + 44} y={112} className="answers-sft-sm">
              no loss
            </text>
          </g>
        ))}

        {SFT_ANSWER.map((a, i) => (
          <g key={a.tok}>
            <rect x={answerX(i)} y={44} width={120} height={44} rx={6} className="answers-sft-abox" />
            <text x={answerX(i) + 60} y={71} className="answers-sft-tok">
              {a.tok}
            </text>
            <text x={answerX(i) + 60} y={112} className="answers-sft-sm">
              model gives p = {a.p}
            </text>
            <text x={answerX(i) + 60} y={136} className="answers-sft-loss">
              -log p = {a.loss}
            </text>
          </g>
        ))}

        {/* Bracket over the three loss terms, down to the average */}
        <path d="M 458 150 V 160 H 838 V 150" className="answers-sft-ln" />
        <line x1={648} y1={160} x2={648} y2={182} className="answers-sft-ln" />
        <text x={648} y={206} className="answers-sft-eq">
          loss = (0.69 + 0.11 + 1.61) / 3 = 0.80
        </text>
        <text x={430} y={246} className="answers-sft-sm">
          A gradient step lowers this loss by raising the probability of each answer token. The
          largest term,
        </text>
        <text x={430} y={264} className="answers-sft-sm">
          1.61 for the end-of-turn token the model found unlikely, pushes hardest.
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: sequence-level against token-level distillation                  */
/* ------------------------------------------------------------------------ */

const KD_BARS = [
  { tok: 'Paris', t: 0.7, s: 0.4 },
  { tok: 'Lyon', t: 0.15, s: 0.3 },
  { tok: 'paris', t: 0.1, s: 0.1 },
  { tok: 'Rome', t: 0.05, s: 0.2 },
];

function DistillFormsDiagram() {
  const barBase = 238;
  const barScale = 150;
  const barX = (i: number) => 470 + i * 92;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 300"
        role="img"
        aria-labelledby="answers-kd-title"
        aria-describedby="answers-kd-desc"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="answers-kd-title">
          The two forms of distillation. Sequence level: the teacher writes whole answers and the
          student trains on them as ordinary SFT targets. Token level: at every position the
          student&apos;s next-token probabilities are pulled toward the teacher&apos;s.
        </title>
        <desc id="answers-kd-desc">
          Left panel: a teacher model samples an answer, Paris, full stop, end of turn; the answer
          joins the student&apos;s SFT data with a target of 1 on each of its tokens. Right panel,
          illustrative numbers at one position: the teacher gives Paris 0.70, Lyon 0.15, lowercase
          paris 0.10 and Rome 0.05; the student gives 0.40, 0.30, 0.10 and 0.20; training moves each
          student bar toward the teacher&apos;s.
        </desc>
        <style>{`
          .answers-kd-bg { fill: #ffffff; }
          .answers-kd-panel { fill: #f9fafb; stroke: #d1d5db; stroke-width: 1.2; }
          .answers-kd-h { fill: #16191f; font: 700 14px sans-serif; }
          .answers-kd-sub { fill: #414d5c; font: 12px sans-serif; }
          .answers-kd-box { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .answers-kd-sbox { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .answers-kd-tok { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.2; }
          .answers-kd-bt { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .answers-kd-sm { fill: #414d5c; font: 12px sans-serif; text-anchor: middle; }
          .answers-kd-tb { fill: #037f0c; }
          .answers-kd-sb { fill: #0972d3; }
          .answers-kd-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#answers-kd-ah); }
          .answers-kd-pull { stroke: #8b3a00; stroke-width: 1.5; fill: none; marker-end: url(#answers-kd-ahp); }
        `}</style>
        <defs>
          <marker id="answers-kd-ah" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#5f6b7a" />
          </marker>
          <marker id="answers-kd-ahp" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b3a00" />
          </marker>
        </defs>
        <rect x={0} y={0} width={860} height={300} rx={8} className="answers-kd-bg" />

        {/* Left: sequence level */}
        <rect x={12} y={12} width={418} height={276} rx={8} className="answers-kd-panel" />
        <text x={28} y={38} className="answers-kd-h">
          Sequence level: copy the teacher&apos;s answers
        </text>
        <rect x={40} y={60} width={150} height={48} rx={8} className="answers-kd-box" />
        <text x={115} y={89} className="answers-kd-bt">
          Teacher model
        </text>
        <line x1={190} y1={84} x2={232} y2={84} className="answers-kd-arr" />
        <text x={330} y={58} className="answers-kd-sm">
          samples one whole answer
        </text>
        {['Paris', '.', '<end>'].map((t, i) => (
          <g key={t}>
            <rect x={238 + i * 62} y={66} width={56} height={36} rx={5} className="answers-kd-tok" />
            <text x={266 + i * 62} y={89} className="answers-kd-bt">
              {t}
            </text>
          </g>
        ))}
        <line x1={330} y1={104} x2={330} y2={150} className="answers-kd-arr" />
        <rect x={230} y={154} width={184} height={56} rx={8} className="answers-kd-sbox" />
        <text x={322} y={177} className="answers-kd-bt">
          Student: SFT on it
        </text>
        <text x={322} y={197} className="answers-kd-sm">
          target 1 on each token
        </text>
        <text x={221} y={246} className="answers-kd-sm">
          Same loss as SFT; the teacher took the place
        </text>
        <text x={221} y={264} className="answers-kd-sm">
          of the person who wrote the answers.
        </text>

        {/* Right: token level */}
        <rect x={442} y={12} width={406} height={276} rx={8} className="answers-kd-panel" />
        <text x={458} y={38} className="answers-kd-h">
          Token level: match the teacher&apos;s probabilities
        </text>
        <text x={458} y={58} className="answers-kd-sub">
          One position, after &quot;Capital of France ?&quot; (illustrative)
        </text>
        <rect x={672} y={68} width={12} height={12} className="answers-kd-tb" />
        <text x={690} y={79} className="answers-kd-sub">
          teacher
        </text>
        <rect x={752} y={68} width={12} height={12} className="answers-kd-sb" />
        <text x={770} y={79} className="answers-kd-sub">
          student
        </text>
        <line x1={462} y1={barBase} x2={836} y2={barBase} stroke="#879596" strokeWidth={1} />
        {KD_BARS.map((b, i) => {
          const th = b.t * barScale;
          const sh = b.s * barScale;
          const x = barX(i);
          return (
            <g key={b.tok}>
              <rect x={x} y={barBase - th} width={30} height={th} className="answers-kd-tb" />
              <rect x={x + 34} y={barBase - sh} width={30} height={sh} className="answers-kd-sb" />
              <text x={x + 15} y={barBase - th - 6} className="answers-kd-sm">
                {b.t.toFixed(2)}
              </text>
              <text x={x + 49} y={barBase - sh - 6} className="answers-kd-sm">
                {b.s.toFixed(2)}
              </text>
              <text x={x + 32} y={barBase + 18} className="answers-kd-bt">
                {b.tok}
              </text>
              {Math.abs(b.t - b.s) > 0.001 && (
                <line
                  x1={x + 70}
                  y1={barBase - sh}
                  x2={x + 70}
                  y2={barBase - th + (b.t > b.s ? 4 : -4)}
                  className="answers-kd-pull"
                />
              )}
            </g>
          );
        })}
        <text x={645} y={278} className="answers-kd-sm">
          Arrows: where training moves each student bar
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: the gradient table, its first rows                              */
/* ------------------------------------------------------------------------ */

interface GradRow {
  method: string[];
  samples: string[];
  scorer: string[];
  weight: string[];
}

const GRAD_ROWS: GradRow[] = [
  {
    method: ['SFT'],
    samples: ['A fixed dataset of answers', 'someone wrote'],
    scorer: ['None at training time:', 'a person chose the data'],
    weight: ['1 on every answer token'],
  },
  {
    method: ['Distillation,', 'sequence level'],
    samples: ["The teacher's sampled", 'answers'],
    scorer: ['None: the teacher wrote', 'them'],
    weight: ['1 on every token of the', "teacher's answer"],
  },
  {
    method: ['Distillation,', 'token level'],
    samples: ['Every token of the', 'vocabulary, at each', 'position of an answer'],
    scorer: ["The teacher's next-token", 'probabilities'],
    weight: ["The teacher's probability", 'for that token'],
  },
];

function GradientTableStartDiagram() {
  const cols = [
    { x: 16, w: 170 },
    { x: 192, w: 220 },
    { x: 418, w: 210 },
    { x: 634, w: 210 },
  ];
  const heads = [
    { text: 'Method', cls: 'answers-gt-hm' },
    { text: 'Which samples', cls: 'answers-gt-hs' },
    { text: 'Which scorer', cls: 'answers-gt-hr' },
    { text: 'Which weight', cls: 'answers-gt-hw' },
  ];
  const lineH = 16;
  const rowGap = 6;
  let y = 150;
  const placed = GRAD_ROWS.map((r) => {
    const lines = Math.max(r.method.length, r.samples.length, r.scorer.length, r.weight.length);
    const h = 20 + lineH * lines;
    const row = { r, y, h };
    y += h + rowGap;
    return row;
  });
  const dashedY = y + 2;
  const height = dashedY + 50;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 860 ${height}`}
        role="img"
        aria-labelledby="answers-gt-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="answers-gt-title">
          The gradient table, first rows. Every method moves the model&apos;s weights by a weight
          times the gradient of the log-probability of some tokens, and differs in which tokens,
          which scorer and which weight. SFT: a fixed dataset of answers someone wrote, no scorer at
          training time, weight 1 on every answer token. Sequence-level distillation: the
          teacher&apos;s sampled answers, no scorer, weight 1 on every token. Token-level
          distillation: every token of the vocabulary at each position, scored by the teacher&apos;s
          next-token probabilities, weighted by the teacher&apos;s probability for that token.
          Section 6 adds REINFORCE, rejection sampling and RLOO or GRPO; sections 7 and 8 add PPO
          and DPO.
        </title>
        <style>{`
          .answers-gt-band { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .answers-gt-eq { fill: #0f1b2a; font: 600 15px sans-serif; text-anchor: middle; }
          .answers-gt-eqs { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .answers-gt-hm { fill: #414d5c; }
          .answers-gt-hs { fill: #0972d3; }
          .answers-gt-hr { fill: #1f7a70; }
          .answers-gt-hw { fill: #8b6c00; }
          .answers-gt-ht { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
          .answers-gt-cell { fill: #ffffff; stroke: #d1d5db; stroke-width: 1; }
          .answers-gt-mcell { fill: #f4f4f4; stroke: #d1d5db; stroke-width: 1; }
          .answers-gt-mt { fill: #16191f; font: 600 13px sans-serif; }
          .answers-gt-t { fill: #16191f; font: 12px sans-serif; }
          .answers-gt-dash { fill: #ffffff; stroke: #879596; stroke-width: 1; stroke-dasharray: 5 4; }
          .answers-gt-dt { fill: #5f6b7a; font: 12px sans-serif; text-anchor: middle; }
        `}</style>
        <rect x={0} y={0} width={860} height={height} rx={8} fill="#ffffff" />
        <rect x={16} y={14} width={828} height={84} rx={8} className="answers-gt-band" />
        <text x={430} y={46} className="answers-gt-eq">
          update = weight x grad log pi(token | prompt, tokens before it)
        </text>
        <text x={430} y={70} className="answers-gt-eqs">
          summed over the tokens a method trains on, then averaged
        </text>
        <text x={430} y={87} className="answers-gt-eqs">
          DeepSeekMath writes SFT, rejection sampling, DPO, PPO and GRPO in this one form
        </text>
        {cols.map((c, i) => (
          <g key={heads[i].text}>
            <rect x={c.x} y={112} width={c.w} height={30} rx={4} className={heads[i].cls} />
            <text x={c.x + c.w / 2} y={132} className="answers-gt-ht">
              {heads[i].text}
            </text>
          </g>
        ))}
        {placed.map(({ r, y: ry, h }) => (
          <g key={r.method.join(' ')}>
            <rect x={cols[0].x} y={ry} width={cols[0].w} height={h} rx={4} className="answers-gt-mcell" />
            {r.method.map((t, j) => (
              <text key={t} x={cols[0].x + 12} y={ry + 22 + j * lineH} className="answers-gt-mt">
                {t}
              </text>
            ))}
            {[r.samples, r.scorer, r.weight].map((cell, ci) => (
              <g key={`${r.method.join(' ')}-${ci}`}>
                <rect x={cols[ci + 1].x} y={ry} width={cols[ci + 1].w} height={h} rx={4} className="answers-gt-cell" />
                {cell.map((t, j) => (
                  <text key={t} x={cols[ci + 1].x + 12} y={ry + 22 + j * lineH} className="answers-gt-t">
                    {t}
                  </text>
                ))}
              </g>
            ))}
          </g>
        ))}
        <rect x={16} y={dashedY} width={828} height={34} rx={4} className="answers-gt-dash" />
        <text x={430} y={dashedY + 22} className="answers-gt-dt">
          Section 6 adds REINFORCE, rejection sampling and RLOO or GRPO; sections 7 and 8 add PPO and DPO
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: rejection-sampling fine-tuning                                   */
/* ------------------------------------------------------------------------ */

const RS_PASS = [true, false, false, true, false, false, true, false];

function RejectionSamplingDiagram() {
  const cardX = (i: number) => 200 + (i % 4) * 92;
  const cardY = (i: number) => 56 + Math.floor(i / 4) * 92;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 280"
        role="img"
        aria-labelledby="answers-rs-title"
        aria-describedby="answers-rs-desc"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="answers-rs-title">
          Rejection-sampling fine-tuning. The model samples eight answers to one prompt, a grader
          passes three of them, and only those three enter an SFT batch with a weight of 1 on every
          token.
        </title>
        <desc id="answers-rs-desc">
          Illustrative: samples 1, 4 and 7 pass the grader and are kept; the other five fail and are
          dropped. The kept answers are the model&apos;s own, so the batch teaches only what the
          model could already write some of the time.
        </desc>
        <style>{`
          .answers-rs-bg { fill: #ffffff; }
          .answers-rs-box { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .answers-rs-pass { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .answers-rs-fail { fill: #fbeaea; stroke: #b4232c; stroke-width: 1.2; }
          .answers-rs-sft { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.5; }
          .answers-rs-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .answers-rs-sm { fill: #414d5c; font: 12px sans-serif; text-anchor: middle; }
          .answers-rs-ok { fill: #037f0c; font: 700 13px sans-serif; text-anchor: middle; }
          .answers-rs-no { fill: #b4232c; font: 700 13px sans-serif; text-anchor: middle; }
          .answers-rs-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#answers-rs-ah); }
        `}</style>
        <defs>
          <marker id="answers-rs-ah" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#5f6b7a" />
          </marker>
        </defs>
        <rect x={0} y={0} width={860} height={280} rx={8} className="answers-rs-bg" />
        <rect x={16} y={98} width={150} height={56} rx={8} className="answers-rs-box" />
        <text x={91} y={121} className="answers-rs-t">
          The model
        </text>
        <text x={91} y={141} className="answers-rs-sm">
          samples 8 answers
        </text>
        <line x1={166} y1={126} x2={194} y2={126} className="answers-rs-arr" />
        <text x={380} y={34} className="answers-rs-sm">
          A grader checks each answer (illustrative: 3 of 8 pass)
        </text>
        {RS_PASS.map((ok, i) => (
          <g key={`rs-${i}`}>
            <rect x={cardX(i)} y={cardY(i)} width={80} height={70} rx={6} className={ok ? 'answers-rs-pass' : 'answers-rs-fail'} />
            <text x={cardX(i) + 40} y={cardY(i) + 28} className="answers-rs-t">
              answer {i + 1}
            </text>
            <text x={cardX(i) + 40} y={cardY(i) + 52} className={ok ? 'answers-rs-ok' : 'answers-rs-no'}>
              {ok ? 'pass: keep' : 'fail: drop'}
            </text>
          </g>
        ))}
        <line x1={572} y1={126} x2={612} y2={126} className="answers-rs-arr" />
        <rect x={618} y={78} width={226} height={96} rx={8} className="answers-rs-sft" />
        <text x={731} y={106} className="answers-rs-t">
          SFT batch: answers 1, 4, 7
        </text>
        <text x={731} y={128} className="answers-rs-sm">
          weight 1 on every token,
        </text>
        <text x={731} y={146} className="answers-rs-sm">
          the same loss as SFT
        </text>
        <text x={430} y={256} className="answers-rs-sm">
          Section 6 keeps the failed answers too, with a negative weight: that step is RL&apos;s
          policy gradient.
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function LearningFromAnswers() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={`Fine-tune on answers someone else wrote, a person or a stronger model, and know what that teaches and what it costs the model you start from (TRL ${TRL_TAG} and papers read ${READ})`}
          >
            4. Learning From Answers: Supervised Fine-Tuning &amp; Distillation
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            SFT (supervised fine-tuning) trains a pretrained model on example answers: for each
            prompt in a dataset someone has written the response you want, and training makes the
            model more likely to write it. Distillation is the same training with a stronger model,
            the teacher, supplying the answers or its probabilities, and the model being trained,
            the student, learning from them. Both learn from written answers, so the signal is a
            target at every token of the response.
          </Box>
          <Box variant="p">
            The challenge is turning a written answer into a change in billions of weights, and
            knowing what that change buys. This section builds three tools the rest of the dive
            uses, the log-probability of a token, the gradient step and the KL divergence, because
            SFT and distillation are where the dive first needs them. It ends on rejection
            sampling, SFT on the model&apos;s own answers that a grader passed, which is one step
            from RL.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read any training loss as a sum, over tokens, of how unlikely the model found each one"
          >
            Log-probabilities: one number per token
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A model writes a response one token at a time. At each position it gives every token in
            its vocabulary a probability, given the prompt and the tokens written so far, and the
            probabilities add up to 1. Write <code>pi(y_t | x, y_&lt;t)</code> for the probability
            the model gives token <code>y_t</code> at position t, where x is the prompt and{' '}
            <code>y_&lt;t</code> the tokens before it. The letter pi stands for the model read as a
            probability distribution; section 5 gives it its RL name, the policy.
          </Box>
          <Box variant="p">
            The probability of a whole response is the product of its token probabilities. Training
            works with the log of it instead, which turns the product into a sum, one term per
            token:
          </Box>
          <Box variant="p">
            <code>log pi(y | x) = sum over t of log pi(y_t | x, y_&lt;t)</code>
          </Box>
          <Box variant="p">
            The log of a probability is never above 0. It is 0 for a token the model was certain of,
            about -0.69 for a probability of 0.5, -2.3 for 0.1, and it falls without limit as the
            probability goes to 0. As an illustration, three tokens with probabilities 0.5, 0.9 and
            0.2 (natural log throughout) give log-probabilities -0.69, -0.11 and -1.61. They sum to
            -2.41, and the product 0.5 x 0.9 x 0.2 = 0.09 has the same log, -2.41. The sum keeps
            each token&apos;s contribution separate, and it stays a workable number where the
            product of hundreds of probabilities below 1 would be vanishingly small.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know exactly which tokens an SFT run trains on, and set the option that keeps the prompt out of the loss"
          >
            The SFT loss: train on the answer, read the prompt
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The intuition: SFT charges the model for every answer token in proportion to how
            surprised it was by that token, and training lowers the charge. A token the model
            already gave probability 1 costs nothing; one it gave 0.1 costs 2.3. The prompt is
            context the model reads, so its tokens carry no charge. For an answer y of T tokens to a
            prompt x:
          </Box>
          <Box variant="p">
            <code>loss = -(1 / T) * sum over t = 1 to T of log pi(y_t | x, y_&lt;t)</code>
          </Box>
          <Box variant="p">
            Read it term by term. <code>log pi(y_t | x, y_&lt;t)</code> is the log-probability of
            the answer&apos;s token t, given the prompt and the answer so far. The minus sign turns
            it into a surprise: positive, 0 for a certain token, large for an unlikely one. The sum
            runs over the answer tokens only, so the prompt contributes context and no term. The{' '}
            <code>1 / T</code> averages over one answer&apos;s tokens. Trainers usually average over
            every answer token in the batch instead, so each token weighs the same and a long
            answer counts for more than a short one. This is
            the cross-entropy loss pretraining already uses for the next token, restricted to the
            answer. With the illustrative numbers above, the loss is (0.69 + 0.11 + 1.61) / 3 =
            0.80.
          </Box>
          <SftExampleDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative tokens and probabilities; real tokenisers split text differently.
          </Box>
          <Box variant="p">
            Keeping the prompt out of the loss is a setting, and getting it right is the most
            practical fact in this section. In TRL (Transformers Reinforcement Learning, Hugging
            Face&apos;s post-training library) {TRL_TAG}, two options do it.{' '}
            <code>completion_only_loss</code> defaults to <code>None</code>, which trains on the
            completion only when the dataset has <code>prompt</code> and <code>completion</code>{' '}
            columns and on the whole text otherwise; <code>assistant_only_loss</code> defaults to{' '}
            <code>False</code> and, when set, trains only on the assistant turns of a conversational
            dataset{' '}
            <Cite tier={1} href={trl('sft_config.py', 'L261-L282')} accessed={READ}>
              TRL sft_config.py L261-L282
            </Cite>
            . Either way TRL marks every token that should carry no loss with the label -100 when it
            prepares the dataset, and the loss divides the summed loss by the number of tokens
            left, across the batch{' '}
            <Cite tier={1} href={trl('sft_trainer.py', 'L1407-L1434')} kind="code" accessed={READ}>
              TRL sft_trainer.py L1407-L1434
            </Cite>
            .
          </Box>
          <Box variant="p">
            Watch for one pitfall with <code>assistant_only_loss</code>: if the chat template leaves
            the assistant&apos;s end-of-turn token outside the mask, the model may never learn to
            stop, and TRL warns that the training loss still looks healthy, so this usually surfaces
            only at inference{' '}
            <Cite tier={1} href={trl('sft_trainer.py', 'L946-L957')} kind="code" accessed={READ}>
              TRL sft_trainer.py L946-L957
            </Cite>
            . The end-of-turn token in the diagram is a target for exactly that reason.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See what one training step does to every weight, so 'make this answer more likely' has a mechanism"
          >
            A gradient step makes the answer more likely
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Training lowers the loss by small moves of every weight at once. For each weight one can
            work out whether a tiny increase would raise or lower the loss, and how strongly. That
            list, one entry per weight, is the gradient of the loss: it points in the direction,
            across all the billions of weights, in which the loss rises fastest. A gradient step
            moves every weight a small distance the opposite way:
          </Box>
          <Box variant="p">
            <code>w_new = w - learning_rate * gradient of the loss</code>
          </Box>
          <Box variant="p">
            Here w is the list of the model&apos;s weights, and the learning rate is a small number
            that sets how far one step goes. A weight whose increase would raise the loss has a
            positive entry and moves down; one whose increase would lower it moves up; one that
            makes no difference barely moves. As an illustration with two weights, a gradient of
            (-2, +1) and a learning rate of 0.01 move the first weight up by 0.02 and the second
            down by 0.01. The optimisers trainers use, such as Adam, rescale each weight&apos;s step,
            but the direction still comes from the gradient. Training is many such steps, each on a
            new batch of examples. The{' '}
            <Link href="../llm-training-systems/">
              training dive, section 3: One Training Step: What It Computes and Keeps
            </Link>{' '}
            follows one step through the hardware.
          </Box>
          <Box variant="p">
            For SFT, the gradient of the loss is minus the sum of the gradients of the answer
            tokens&apos; log-probabilities, each counted once. So a step pushes every answer
            token&apos;s probability up, and pushes hardest where the model was most surprised.
            This gives the dive its one shared shape. Every method in it that trains weights moves
            them along{' '}
            <code>weight x grad log pi(token | prompt, tokens before it)</code>, summed over the
            tokens the method trains on{' '}
            <Cite tier={3} href={DSM} venue="preprint">
              DeepSeekMath, Section 5.2.1 and Eq. 5
            </Cite>
            . Methods differ in which tokens, which scorer and which weight, and SFT is the simplest
            case: the tokens of answers someone wrote, no scorer, and a weight of 1 on each.
          </Box>
          <Box variant="p">
            One word now takes a second meaning. The model&apos;s weights are its parameters. The
            weight on a token, in this shape and in the gradient table below, is a multiplier that
            says how hard the update pushes on that token. Where the dive means the parameters it
            says the model&apos;s weights. Section 6 adds the one rule of calculus the dive needs,
            about the gradient of a logarithm, with numbers, where RL first relies on it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict what SFT will change in your model from what the answers show, and what it costs the abilities you start with"
          >
            What SFT teaches, and what it costs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            SFT teaches whatever the answers demonstrate. Format and behaviour come from few
            examples: LIMA fine-tuned a 65B LLaMa model with the standard supervised loss on 1,000
            curated prompt-response pairs and no RL{' '}
            <Cite tier={3} href={LIMA} venue="NeurIPS 2023" accessed={READ}>
              LIMA, abstract
            </Cite>
            . Its authors read the result as the superficial alignment hypothesis: a model&apos;s
            knowledge and capabilities come almost entirely from pretraining, and this kind of
            fine-tuning teaches which formats to use with users{' '}
            <Cite tier={3} href={LIMA} venue="NeurIPS 2023" accessed={READ}>
              LIMA, Section 1
            </Cite>
            . InstructGPT&apos;s SFT stage used about 13k training prompts{' '}
            <Cite tier={3} href={INSTRUCTGPT} venue="NeurIPS 2022">
              InstructGPT, Section 3.2
            </Cite>
            . Reasoning that the answers spell out step by step can be taught too, with far more
            data: the DeepSeek-R1-Distill models are Qwen and Llama models fine-tuned for 2 to 3
            epochs on about 800,000 samples built during DeepSeek-R1&apos;s training, with no RL{' '}
            <Cite tier={3} href={R1} venue="Nature 2025" accessed={READ}>
              DeepSeek-R1, Supplementary B.4.3 and Appendix F
            </Cite>
            . Section 11 sets that recipe against RL on the same base.
          </Box>
          <Box variant="p">
            The price is distance from the model you started with. Fine-tuning on a new task, RL
            forgot less of the old tasks than SFT did at similar performance on the new one, on a
            3B language model and a 7B robotics model, and the forgetting tracked the KL divergence
            between the fine-tuned and the starting model on the new task, a measure the last block
            of this section builds{' '}
            <Cite tier={3} href={RAZOR} venue="ICLR 2026">
              RL&apos;s Razor, abstract and Section 4
            </Cite>
            . The authors&apos; explanation: RL trains on the model&apos;s own samples, which keeps
            it near solutions it already has, while SFT can move it arbitrarily far toward
            someone else&apos;s answers.
          </Box>
          <ExpandableSection headerText="More evidence on what SFT changes, with its scope">
            <SpaceBetween size="s">
              <Box variant="p">
                <Box variant="strong" display="inline">
                  Memorising the rule set it was trained on.
                </Box>{' '}
                On two reasoning tasks with one 11B vision-language model, SFT lowered performance
                on rule variants it had not seen (GeneralPoints from 11.5% to 3.4%, V-IRL from 80.8%
                to 1.3%) where RL raised it (to 15.0% and 91.8%). The same paper found SFT necessary
                first when the model did not follow the task&apos;s output format: on the
                text-only GeneralPoints task, RL run directly on the base model failed to improve{' '}
                <Cite tier={3} href={CHU} venue="ICML 2025">
                  SFT Memorizes, RL Generalizes, Section 5
                </Cite>
                . So the usual order is SFT for format, then RL.
              </Box>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  Spreading out, against narrowing down.
                </Box>{' '}
                Clustering the reasoning of 1.5B to 14B math models, one study finds that RL
                compresses incorrect reasoning paths while SFT expands correct ones{' '}
                <Cite tier={3} href={SQUEEZE} venue="ICLR 2026">
                  RL Squeezes, SFT Expands, abstract
                </Cite>
                . In our reading this is the same contrast seen from the inside: SFT adds the
                paths its answers show, RL removes the paths that scored badly.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Choose between copying a teacher's answers and matching its probabilities, from what each needs and what each carries"
          >
            Distillation: a stronger model supplies the answers
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Distillation trains the student on what a teacher produces, and it comes in two forms
            that differ in how much of the teacher the student sees.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              Sequence level.
            </Box>{' '}
            Sample the teacher&apos;s whole answers to a set of prompts, then train the student on
            them with the SFT loss. Kim and Rush named it for machine translation, where the
            teacher&apos;s output is its best whole sequence rather than its next-word
            probabilities{' '}
            <Cite tier={3} href={KIM_RUSH} venue="EMNLP 2016" accessed={READ}>
              Kim and Rush, Section 3
            </Cite>
            . This is the form behind the DeepSeek-R1-Distill models above, and the one AWS
            documents for SageMaker AI. It needs only the teacher&apos;s text, so any teacher whose
            terms allow it will do.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              Token level.
            </Box>{' '}
            At every position of an answer, the target is the teacher&apos;s whole next-token
            distribution, its probability for every token in the vocabulary, in place of the one
            token that was written. Hinton, Vinyals and Dean called these soft targets: a teacher
            that gives Paris 0.70 and lowercase paris 0.10 is also saying which wrong answers are
            nearly right, and that carries much more information per example than a single correct
            token{' '}
            <Cite tier={3} href={HINTON} venue="NIPS 2014 Deep Learning Workshop" accessed={READ}>
              Hinton et al., Section 1
            </Cite>
            . It needs the teacher&apos;s probabilities at every position, so in our reading a
            teacher whose weights you run, and TRL&apos;s distillation trainer requires the teacher
            to share the student&apos;s vocabulary{' '}
            <Cite tier={1} href={trl('distillation_trainer.py', 'L253-L261')} accessed={READ}>
              TRL distillation_trainer.py L253-L261
            </Cite>
            .
          </Box>
          <DistillFormsDiagram />
          <Box variant="small" color="text-body-secondary">
            Right panel: illustrative probabilities at one position.
          </Box>
          <ExpandableSection headerText="Temperature: how soft targets were softened in the original method">
            <SpaceBetween size="s">
              <Box variant="p">
                A model computes a raw score, a logit z, for every token, and the softmax turns the
                scores into probabilities. Hinton et al. divide every logit by a temperature T first:{' '}
                <code>q_i = exp(z_i / T) / sum over j of exp(z_j / T)</code>, where{' '}
                <code>q_i</code> is the probability of token i. T = 1 is the usual softmax; a higher
                T flattens the distribution, so the small probabilities on nearly right tokens grow
                large enough to learn from. Teacher and student use the same high T during
                distillation, and the student returns to T = 1 afterwards{' '}
                <Cite tier={3} href={HINTON} venue="NIPS 2014 Deep Learning Workshop" accessed={READ}>
                  Hinton et al., Section 2
                </Cite>
                . The temperature of a sampling call, the setting section 5 describes, is the same
                division.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            The token-level form needs a measure of how far the student&apos;s distribution sits
            from the teacher&apos;s at each position. That measure is the KL divergence.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read a KL value as the distance between two models' next-token probabilities, and know which direction a trainer measures it in"
          >
            The KL divergence: how far apart two distributions are
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The intuition: token-level distillation needs one number for how differently two models
            would pick the next token, the student against the teacher, so that training can make it
            smaller. KL divergence (Kullback-Leibler divergence, named after the two people who
            defined it) is that number. It comes from information theory and compares two
            probability distributions, here the probabilities two models give every possible next
            token at one position.
          </Box>
          <Box variant="p">
            Its values read simply. It is never negative. Zero means the two distributions agree
            exactly, a small value means they differ a little, and a large one means they prefer
            very different tokens. In the formula, P and Q are the two distributions and x runs over
            every token in the vocabulary:
          </Box>
          <Box variant="p">
            <code>KL(P || Q) = sum over x of P(x) * log(P(x) / Q(x))</code>
          </Box>
          <Box variant="p">
            Read it term by term. <code>P(x) / Q(x)</code> is how many times more likely P finds
            token x than Q does. The log turns that ratio into a score: 0 when the two agree,
            positive when P likes x more, negative when it likes x less. Weighting each score by{' '}
            <code>P(x)</code> and summing averages it over what P would actually generate: KL is the
            average log-ratio, which is what measuring a distance in logarithmic terms means. The
            negative scores never outweigh the positive ones, so the average is never below 0, and
            it is 0 only when the two lists match.
          </Box>
          <Box variant="p">
            The measure is asymmetric: swapping P and Q weights the average by the other
            distribution, so the answer changes. As an illustration with two tokens, P = (0.9, 0.1)
            and Q = (0.5, 0.5): KL(P || Q) = 0.9 log 1.8 + 0.1 log 0.2 = 0.37, while KL(Q || P) =
            0.5 log(0.5 / 0.9) + 0.5 log 5 = 0.51. KL(P || Q) grows large when P puts probability
            on a token that Q thought nearly impossible, because a Q(x) near 0 makes log(P(x) /
            Q(x)) very large.
          </Box>
          <Box variant="p">
            That asymmetry is a choice the trainer makes. Classic token-level distillation puts the
            teacher first, KL(teacher || student), called the forward KL; minimising it is the same
            as training on the teacher&apos;s distribution with the cross-entropy loss above,
            because the teacher&apos;s own part of the sum does not change. It makes the student
            spread probability over every token the teacher thinks possible. Putting the student
            first, the reverse KL, makes the student concentrate on the teacher&apos;s likeliest
            tokens instead{' '}
            <Cite tier={3} href={GKD} venue="ICLR 2024" accessed={READ}>
              GKD, Section 3.1
            </Cite>
            ; section 11 shows why most on-policy distillation recipes choose it. Section 7 reuses the same number
            for a different job: there the reference point is a frozen copy of the model the run
            started from, and the KL measures how far training has moved the model away from it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Recognise the variants by who plays the teacher, and check the two things every distillation run needs"
          >
            Variants, and what distillation needs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The same training appears under other names, with something else in the
            teacher&apos;s seat.
          </Box>
          <ul>
            <li>
              <Box variant="strong" display="inline">Context distillation:</Box> the teacher is the
              same model reading a long prompt, and the student learns to behave that way without
              it, so the prompt&apos;s tokens and latency go away{' '}
              <Cite tier={3} href={CONTEXT_DISTILLATION} venue="preprint">
                Learning by Distilling Context, abstract
              </Cite>
              . Sections 19, 21 and 25 use it to move a text loop&apos;s lesson into the weights.
            </li>
            <li>
              <Box variant="strong" display="inline">Algorithm distillation:</Box> the teacher is an
              RL algorithm&apos;s logged learning histories, and the student learns to improve in
              context the way the algorithm improved; section 20 covers it.
            </li>
            <li>
              <Box variant="strong" display="inline">
                BOND (Best-of-N Distillation):
              </Box>{' '}
              the teacher is best-of-n sampling, picking the best of n answers with a reward model,
              and the student learns to produce that choice in one try; section 8 places it in
              Gemma 3&apos;s recipe.
            </li>
          </ul>
          <Box variant="p">
            Every distillation run needs two things. First, a teacher you may train on. Provider
            terms differ and change. OpenAI&apos;s Services Agreement forbids using output to
            develop models that compete with OpenAI&apos;s products, Anthropic&apos;s Commercial
            Terms forbid using its services to train competing AI models, its Usage Policy in the
            version effective November 12, 2026 lists using outputs to train any AI model without
            prior authorization, and Google&apos;s Gemini
            API terms forbid developing models that compete with the Gemini API. The Llama 4
            Community License allows using outputs to train or improve another model, with a
            naming condition; DeepSeek-R1&apos;s MIT licence states that it allows distillation;
            and Qwen3&apos;s Apache 2.0 licence says nothing about outputs. The detail and the
            quotes are in the panel below. Read your provider&apos;s current terms before you
            start. Second, the inference to run the teacher. Sequence level pays for its
            generations once. Token level needs the teacher&apos;s distribution at every position:
            on fixed text it can be computed once and stored, and on-policy the teacher runs beside
            the student at every training step.
          </Box>
          <ExpandableSection headerText="The terms quoted, as read on 2026-11-07">
            <TermsList />
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Use a grader to pick your model's own answers for SFT, and see the one change that turns it into RL"
          >
            Rejection sampling: SFT on the model&apos;s own answers that passed
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            When you have a grader but no written answers, the model can write its own. Sample
            several answers to each prompt, keep the ones a grader passes, and train on the kept
            ones with the SFT loss. This is rejection-sampling fine-tuning, and its training set
            is the model&apos;s own work, so it teaches only what the model could already write
            some of the time. Where the samples come from matters: in DeepSeekMath&apos;s
            comparison, sampling from the model as it trains (online) clearly beat sampling once
            from the starting model (offline), with the gap opening late in training{' '}
            <Cite tier={3} href={DSM} venue="preprint">
              DeepSeekMath, Section 5.2.1 and Figure 5
            </Cite>
            . DeepSeek-R1&apos;s third stage built about 600,000 reasoning samples this way from
            its own RL checkpoint, keeping only correct ones{' '}
            <Cite tier={3} href={R1} venue="Nature 2025" accessed={READ}>
              DeepSeek-R1, Supplementary B.3.3
            </Cite>
            , and that set is the reasoning part of the 800,000 samples the R1-Distill models
            trained on.
          </Box>
          <RejectionSamplingDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative: 3 of 8 answers pass.
          </Box>
          <Box variant="p">
            The gradient table so far has three rows, all with a fixed weight. Rejection sampling
            keeps that weight (1 for a kept answer, 0 for a dropped one) and changes only where the
            answers come from. Section 6 changes the weight: every sampled answer stays, weighted
            by how much better or worse than expected it scored, so a failed answer is pushed down
            as well as a good one pushed up. That is RL&apos;s policy gradient.
          </Box>
          <GradientTableStartDiagram />
          <Box variant="small" color="text-body-secondary">
            The shared form and the SFT row are DeepSeekMath&apos;s; the two distillation rows are
            our reading of the same form.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Start an SFT or distillation run on AWS or on your own GPUs, and know where to go next"
          >
            Running it, and where to go next
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On AWS, Amazon Bedrock runs distillation as a managed job: a Nova Pro or Nova Premier
            teacher for smaller Nova students, or a Llama 3.1 405B, 3.1 70B or 3.3 70B teacher for
            smaller Llama students{' '}
            <Cite tier={1} href={BEDROCK_DISTILL_PAIRS} accessed={READ}>
              Bedrock user guide: distillation prerequisites
            </Cite>
            , with the teacher&apos;s answers generated from prompts you supply or taken from your
            invocation logs{' '}
            <Cite tier={1} href={BEDROCK_DISTILL} accessed={READ}>
              Bedrock user guide: model distillation
            </Cite>
            . SageMaker AI lists distillation beside SFT, DPO and reinforcement fine-tuning{' '}
            <Cite tier={1} href={SAGEMAKER_CUSTOMIZE} accessed={READ}>
              SageMaker AI developer guide: customizing models
            </Cite>
            , and runs it as sequence-level SFT on a teacher&apos;s responses; token-level and
            on-policy distillation are not currently supported there{' '}
            <Cite tier={1} href={SAGEMAKER_DISTILL} accessed={READ}>
              SageMaker AI developer guide: distillation
            </Cite>
            . Section 26 has the limits, the prices and the services side by side. On your own GPUs
            an SFT or distillation run is an ordinary training job, and the{' '}
            <Link href="../llm-training-systems/">
              training dive, section 16: Fine-Tuning &amp; Post-Training Runs
            </Link>{' '}
            sizes its memory and picks its framework.
          </Box>
          <Box variant="p">
            Your next step depends on the signal you hold. Answers you trust: run SFT with the
            prompt masked, and check that the end-of-turn token is a target. A stronger model you
            may train on: section 11 shows when distilling it beats RL, as it did for DeepSeek on a
            32B base with the 800,000 samples built during R1&apos;s training. Only a grader: go on to section 5, where the
            model&apos;s own attempts and one score per attempt replace the written answer.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Terms on training with a model's outputs                                  */
/* ------------------------------------------------------------------------ */

const TERMS_OPENAI = 'https://web.archive.org/web/20261008023004/https://openai.com/policies/business-terms/';
const TERMS_ANTHROPIC = 'https://www.anthropic.com/legal/commercial-terms';
const AUP_ANTHROPIC = 'https://www.anthropic.com/legal/aup';
const TERMS_GEMINI = 'https://ai.google.dev/gemini-api/terms';
const LICENSE_LLAMA4 = gh('meta-llama/llama-models', '0e0b8c519242d5833d8c11bffc1232b77ad7f301', 'models/llama4/LICENSE');
const LICENSE_R1 = gh('deepseek-ai/DeepSeek-R1', '0cf78561f1d51c84a21b2190626b21116d5c68bb', 'README.md', 'L256-L261');
const LICENSE_QWEN3 = 'https://huggingface.co/Qwen/Qwen3-8B/blob/b968826d9c46dd6066d109eabc6255188de91218/LICENSE';

function TermsList() {
  return (
    <SpaceBetween size="s">
      <Box variant="p">
        What each document says, quoted; what it means for your use is a question for your
        provider&apos;s terms and your counsel.
      </Box>
      <ul>
        <li>
          OpenAI Services Agreement (effective January 1, 2026): the customer will not, except for
          a permitted exception, &quot;use Output to develop artificial intelligence models that
          compete with OpenAI&apos;s products and services&quot;{' '}
          <Cite tier={1} href={TERMS_OPENAI} accessed={READ}>
            OpenAI Services Agreement, section 3.3 (archived copy of 2026-10-08)
          </Cite>
          .
        </li>
        <li>
          Anthropic Commercial Terms (effective June 17, 2025): the customer may not &quot;access
          the Services to build a competing product or service, including to train competing AI
          models&quot;{' '}
          <Cite tier={1} href={TERMS_ANTHROPIC} accessed={READ}>
            Anthropic Commercial Terms, D.4
          </Cite>
          . Anthropic&apos;s Usage Policy, in the version shown on 2026-11-07 and marked effective
          November 12, 2026, lists under platform abuse: &quot;Use outputs to train an AI model
          (e.g., &quot;model scraping&quot; or &quot;model distillation&quot;) without prior
          authorization from Anthropic&quot;{' '}
          <Cite tier={1} href={AUP_ANTHROPIC} accessed={READ}>
            Anthropic Usage Policy, Do Not Abuse Our Platform
          </Cite>
          .
        </li>
        <li>
          Gemini API Additional Terms (effective March 23, 2026): &quot;You may not use the
          Services to develop models that compete with the Services (e.g., Gemini API or Google AI
          Studio)&quot;{' '}
          <Cite tier={1} href={TERMS_GEMINI} accessed={READ}>
            Gemini API Additional Terms of Service
          </Cite>
          .
        </li>
        <li>
          Llama 4 Community License: licensees may use Llama Materials &quot;or any outputs or
          results&quot; to &quot;create, train, fine tune, or otherwise improve an AI model&quot;,
          and a model so made that is distributed or made available must have a name that begins
          with &quot;Llama&quot;{' '}
          <Cite tier={1} href={LICENSE_LLAMA4} accessed={READ}>
            Llama 4 Community License Agreement
          </Cite>
          .
        </li>
        <li>
          DeepSeek-R1: code and weights under the MIT License, and the series allows derivative
          works &quot;including, but not limited to, distillation for training other LLMs&quot;{' '}
          <Cite tier={1} href={LICENSE_R1} accessed={READ}>
            DeepSeek-R1 README, License
          </Cite>
          .
        </li>
        <li>
          Qwen3 (Qwen3-8B as the example): Apache License 2.0, which has no clause about model
          outputs or about training other models{' '}
          <Cite tier={1} href={LICENSE_QWEN3} accessed={READ}>
            Qwen3-8B LICENSE
          </Cite>
          .
        </li>
      </ul>
    </SpaceBetween>
  );
}
