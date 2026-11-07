import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import { Cite, arxiv, gh, TRL_TAG } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Date the sources added for the fine-tuning rebuild were read. */
const READ = '2026-11-07';

/** DeepSeek-R1 (v2, the Nature version). */
const R1 = arxiv('2501.12948v2');
/** Yue et al., Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? */
const YUE = arxiv('2504.13837v5');
/** Qwen3 Technical Report. */
const QWEN3 = arxiv('2505.09388v1');
/** Agarwal et al., On-Policy Distillation of Language Models: Learning from Self-Generated Mistakes (GKD). */
const GKD = arxiv('2306.13649v3');
/** Gu et al., MiniLLM: On-Policy Distillation of Large Language Models. */
const MINILLM = arxiv('2306.08543v6');
/** Thinking Machines, On-Policy Distillation (lab blog). */
const TM_OPD = 'https://thinkingmachines.ai/blog/on-policy-distillation/';
/** Thinking Machines, LoRA Without Regret (lab blog). */
const LORA_BLOG = 'https://thinkingmachines.ai/blog/lora/';
/** DeepSeek-V4 report. */
const DSV4 = arxiv('2606.19348v1');
/** Kimi K3 report. */
const KIMIK3 = arxiv('2607.24653v2');
/** Nemotron-Cascade 2 report. */
const NEMOTRON = arxiv('2603.19220v2');
/** Liu et al., ProRL: Prolonged Reinforcement Learning. */
const PRORL = arxiv('2505.24864v1');
/** DAPO: zero advantage when every sample in a group gets the same reward. */
const DAPO = arxiv('2503.14476v2');
/** Shenfeld et al., RL's Razor. */
const RAZOR = arxiv('2509.04259v1');

const TRL = 'huggingface/trl';
const trl = (file: string, lines: string) => gh(TRL, TRL_TAG, `trl/trainer/${file}`, lines);

const BEDROCK_RFT = 'https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html';
const SAGEMAKER_DISTILL = 'https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models-distillation.html';

/* ------------------------------------------------------------------------ */
/* Diagram: three loops                                                      */
/* ------------------------------------------------------------------------ */

type Panel = {
  title: string;
  boxes: string[][];
  arrows: string[];
  back: boolean;
  needs: string[];
  cls: string[];
};

const PANELS: Panel[] = [
  {
    title: "Distillation from a teacher's answers",
    boxes: [['Teacher'], ["Teacher's answers"], ['Student,', 'trained by SFT']],
    arrows: ['writes answers', 'a target at every token'],
    back: false,
    needs: ['Needs: a teacher you may train on,', 'and its inference for every example.'],
    cls: ['teacher', 'fixed', 'student'],
  },
  {
    title: 'RL',
    boxes: [['Student'], ['Own attempts'], ['Grader:', 'one score per attempt']],
    arrows: ['writes attempts', 'graded'],
    back: true,
    needs: ['Needs: a grader, and a student', 'that passes some of the time.'],
    cls: ['student', 'own', 'grader'],
  },
  {
    title: 'On-policy distillation',
    boxes: [['Student'], ['Own attempts'], ['Teacher:', 'a probability per token']],
    arrows: ['writes attempts', 'read by the teacher'],
    back: true,
    needs: ["Needs: the teacher's token probabilities,", 'its tokenizer, through all of training.'],
    cls: ['student', 'own', 'teacher'],
  },
];

function ThreeLoopsDiagram() {
  const boxY = [56, 136, 216];
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 960 340"
        role="img"
        aria-labelledby="distill-loops-title"
        aria-describedby="distill-loops-desc"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="distill-loops-title">
          Three loops: distillation trains the student on a teacher&apos;s answers; RL trains it on
          a grader&apos;s score for its own attempts; on-policy distillation trains it on a
          teacher&apos;s probability for every token of its own attempts.
        </title>
        <desc id="distill-loops-desc">
          {PANELS.map(
            (p) =>
              `${p.title}: ${p.boxes.map((b) => b.join(' ')).join(', then ')}${p.back ? ', which trains the student' : ''}. ${p.needs.join(' ')}`,
          ).join(' ')}
        </desc>
        <style>{`
          .distill-loops-bg { fill: #ffffff; }
          .distill-loops-panel { fill: #fafafa; stroke: #e9ebed; stroke-width: 1; }
          .distill-loops-title { fill: #16191f; font: 600 13px sans-serif; }
          .distill-loops-box { font: 600 13px sans-serif; fill: #16191f; text-anchor: middle; }
          .distill-loops-sub { font: 12px sans-serif; fill: #16191f; text-anchor: middle; }
          .distill-loops-lbl { fill: #414d5c; font: 12px sans-serif; }
          .distill-loops-need { fill: #414d5c; font: 12px sans-serif; }
          .distill-loops-teacher { fill: #f1ebfa; stroke: #7d4fc4; stroke-width: 1.5; }
          .distill-loops-student { fill: #e8f2fc; stroke: #0972d3; stroke-width: 1.5; }
          .distill-loops-fixed { fill: #f4f4f4; stroke: #879596; stroke-width: 1.5; }
          .distill-loops-own { fill: #ebf6ee; stroke: #037f0c; stroke-width: 1.5; }
          .distill-loops-grader { fill: #fdf3e7; stroke: #b36200; stroke-width: 1.5; }
          .distill-loops-ln { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
          .distill-loops-head { fill: #5f6b7a; }
        `}</style>
        <rect x={0} y={0} width={960} height={340} rx={8} className="distill-loops-bg" />
        {PANELS.map((p, i) => {
          const px = 12 + i * 314;
          const bx = px + 16;
          const bw = 176;
          const cx = bx + bw / 2;
          return (
            <g key={p.title}>
              <rect x={px} y={10} width={302} height={320} rx={6} className="distill-loops-panel" />
              <text x={px + 12} y={36} className="distill-loops-title">
                {p.title}
              </text>
              {p.boxes.map((b, k) => (
                <g key={`${p.title}-${k}`}>
                  <rect x={bx} y={boxY[k]} width={bw} height={44} rx={6} className={`distill-loops-${p.cls[k]}`} />
                  {b.length === 1 ? (
                    <text x={cx} y={boxY[k] + 27} className="distill-loops-box">
                      {b[0]}
                    </text>
                  ) : (
                    <>
                      <text x={cx} y={boxY[k] + 19} className="distill-loops-box">
                        {b[0]}
                      </text>
                      <text x={cx} y={boxY[k] + 36} className="distill-loops-sub">
                        {b[1]}
                      </text>
                    </>
                  )}
                </g>
              ))}
              {p.arrows.map((a, k) => (
                <g key={`${p.title}-a${k}`}>
                  <line x1={cx} y1={boxY[k] + 46} x2={cx} y2={boxY[k + 1] - 6} className="distill-loops-ln" />
                  <path
                    d={`M ${cx - 5} ${boxY[k + 1] - 7} L ${cx} ${boxY[k + 1] - 1} L ${cx + 5} ${boxY[k + 1] - 7} Z`}
                    className="distill-loops-head"
                  />
                  <text x={cx + 10} y={boxY[k] + 68} className="distill-loops-lbl">
                    {a}
                  </text>
                </g>
              ))}
              {p.back && (
                <g>
                  <path
                    d={`M ${bx + bw} ${boxY[2] + 22} H ${bx + bw + 40} V ${boxY[0] + 22} H ${bx + bw + 8}`}
                    className="distill-loops-ln"
                  />
                  <path
                    d={`M ${bx + bw + 8} ${boxY[0] + 17} L ${bx + bw + 2} ${boxY[0] + 22} L ${bx + bw + 8} ${boxY[0] + 27} Z`}
                    className="distill-loops-head"
                  />
                  <text x={bx + bw + 46} y={boxY[1] + 26} className="distill-loops-lbl">
                    trains
                  </text>
                </g>
              )}
              {p.needs.map((n, k) => (
                <text key={n} x={px + 12} y={296 + k * 16} className="distill-loops-need">
                  {n}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: DeepSeek-R1 Table 16 as grouped bars                             */
/* ------------------------------------------------------------------------ */

const T16_MODELS = [
  { name: 'QwQ-32B-Preview', cls: 'distill-t16-qwq' },
  { name: 'Qwen2.5-32B-Zero (RL, over 10,000 steps)', cls: 'distill-t16-rl' },
  { name: 'DeepSeek-R1-Distill-Qwen-32B (SFT only)', cls: 'distill-t16-dist' },
];
const T16_BENCH = [
  { name: 'AIME 2024', v: [50.0, 47.0, 72.6] },
  { name: 'MATH', v: [90.6, 91.6, 94.3] },
  { name: 'GPQA Diamond', v: [54.5, 55.0, 62.1] },
  { name: 'LiveCodeBench', v: [41.9, 40.2, 57.2] },
];

function Table16Diagram() {
  const x0 = 70;
  const yBase = 300;
  const scale = 2.2; // px per point
  const groupW = 215;
  const barW = 52;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 960 376"
        role="img"
        aria-labelledby="distill-t16-title"
        aria-describedby="distill-t16-desc"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="distill-t16-title">
          DeepSeek-R1 Table 16 as grouped bars: pass@1 on four benchmarks for QwQ-32B-Preview,
          Qwen2.5-32B trained with RL, and DeepSeek-R1-Distill-Qwen-32B.
        </title>
        <desc id="distill-t16-desc">
          {T16_BENCH.map(
            (b) => `${b.name}: ${T16_MODELS.map((m, k) => `${m.name} ${b.v[k].toFixed(1)}`).join(', ')}.`,
          ).join(' ')}
        </desc>
        <style>{`
          .distill-t16-bg { fill: #ffffff; }
          .distill-t16-qwq { fill: #b4bcc6; }
          .distill-t16-rl { fill: #037f0c; }
          .distill-t16-dist { fill: #7d4fc4; }
          .distill-t16-val { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .distill-t16-bench { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .distill-t16-axis { stroke: #879596; stroke-width: 1.2; }
          .distill-t16-grid { stroke: #e9ebed; stroke-width: 1; }
          .distill-t16-tick { fill: #414d5c; font: 11px sans-serif; text-anchor: end; }
          .distill-t16-leg { fill: #16191f; font: 12px sans-serif; }
        `}</style>
        <rect x={0} y={0} width={960} height={376} rx={8} className="distill-t16-bg" />
        {T16_MODELS.map((m, k) => (
          <g key={m.name}>
            <rect x={20 + k * 310} y={16} width={16} height={12} rx={2} className={m.cls} />
            <text x={42 + k * 310} y={27} className="distill-t16-leg">
              {m.name}
            </text>
          </g>
        ))}
        {[0, 25, 50, 75, 100].map((t) => (
          <g key={t}>
            <line x1={x0} y1={yBase - t * scale} x2={940} y2={yBase - t * scale} className="distill-t16-grid" />
            <text x={x0 - 8} y={yBase - t * scale + 4} className="distill-t16-tick">
              {t}
            </text>
          </g>
        ))}
        <line x1={x0} y1={yBase} x2={940} y2={yBase} className="distill-t16-axis" />
        {T16_BENCH.map((b, i) => {
          const gx = x0 + 20 + i * groupW;
          return (
            <g key={b.name}>
              {b.v.map((v, k) => {
                const h = v * scale;
                const x = gx + k * (barW + 8);
                return (
                  <g key={`${b.name}-${k}`}>
                    <rect x={x} y={yBase - h} width={barW} height={h} className={T16_MODELS[k].cls} />
                    <text x={x + barW / 2} y={yBase - h - 6} className="distill-t16-val">
                      {v.toFixed(1)}
                    </text>
                  </g>
                );
              })}
              <text x={gx + (3 * barW + 16) / 2} y={yBase + 22} className="distill-t16-bench">
                {b.name}
              </text>
            </g>
          );
        })}
        <text x={x0 + 4} y={yBase + 44} className="distill-t16-leg">
          pass@1, percent; all three are 32B models. Qwen2.5-32B-Zero is the base after RL;
        </text>
        <text x={x0 + 4} y={yBase + 60} className="distill-t16-leg">
          the Distill model is the same base after SFT, no RL; QwQ-32B-Preview is a reference.
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: pass@k sketch, base, RL and distilled (schematic)                */
/* ------------------------------------------------------------------------ */

const PK = { x0: 90, x1: 640, y0: 300, y1: 50 };
const pkX = (u: number) => PK.x0 + u * (PK.x1 - PK.x0);
const pkY = (v: number) => PK.y0 - v * (PK.y0 - PK.y1);
const sat = (u: number, a: number) => (1 - Math.exp(-a * u)) / (1 - Math.exp(-a));
const PK_CURVES = [
  { name: 'distilled', cls: 'distill-pk-dist', f: (u: number) => 0.52 + 0.38 * sat(u, 3) },
  { name: 'base', cls: 'distill-pk-base', f: (u: number) => 0.3 + 0.5 * sat(u, 3) },
  { name: 'after RL', cls: 'distill-pk-rl', f: (u: number) => 0.48 + 0.26 * sat(u, 2.5) },
];
const pkPath = (f: (u: number) => number) =>
  Array.from({ length: 41 }, (_, i) => i / 40)
    .map((u, i) => `${i === 0 ? 'M' : 'L'} ${pkX(u).toFixed(1)} ${pkY(f(u)).toFixed(1)}`)
    .join(' ');

function PassKSketch() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 960 360"
        role="img"
        aria-labelledby="distill-pk-title"
        aria-describedby="distill-pk-desc"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="distill-pk-title">
          Schematic pass@k curves: a base model, the same model after RL, and the same model after
          distillation from a stronger teacher.
        </title>
        <desc id="distill-pk-desc">
          Schematic, not data. The horizontal axis is k, the number of samples, on a log scale from
          1 to 256; the vertical axis is pass@k. After RL the curve starts above the base at k = 1
          and ends below it at large k. After distillation the curve sits above the base across
          every k.
        </desc>
        <style>{`
          .distill-pk-bg { fill: #ffffff; }
          .distill-pk-axis { stroke: #879596; stroke-width: 1.2; fill: none; }
          .distill-pk-base { stroke: #5f6b7a; stroke-width: 2.5; fill: none; stroke-dasharray: 6 4; }
          .distill-pk-rl { stroke: #037f0c; stroke-width: 2.5; fill: none; }
          .distill-pk-dist { stroke: #7d4fc4; stroke-width: 2.5; fill: none; }
          .distill-pk-tick { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .distill-pk-lbl { fill: #16191f; font: 600 12px sans-serif; }
          .distill-pk-note { fill: #414d5c; font: 12px sans-serif; }
        `}</style>
        <rect x={0} y={0} width={960} height={360} rx={8} className="distill-pk-bg" />
        <path d={`M ${PK.x0} ${PK.y1 - 10} V ${PK.y0} H ${PK.x1 + 10}`} className="distill-pk-axis" />
        {[1, 4, 16, 64, 256].map((k, i) => (
          <text key={k} x={pkX(i / 4)} y={PK.y0 + 18} className="distill-pk-tick">
            {k}
          </text>
        ))}
        <text x={(PK.x0 + PK.x1) / 2} y={PK.y0 + 40} className="distill-pk-tick">
          k, samples per problem (log scale)
        </text>
        <text x={PK.x0 - 10} y={PK.y1 - 18} className="distill-pk-note">
          pass@k: share of problems solved by at least one of k samples
        </text>
        {PK_CURVES.map((c) => (
          <path key={c.name} d={pkPath(c.f)} className={c.cls} />
        ))}
        <line x1={680} y1={90} x2={712} y2={90} className="distill-pk-dist" />
        <text x={720} y={94} className="distill-pk-lbl">
          after distillation
        </text>
        <line x1={680} y1={120} x2={712} y2={120} className="distill-pk-base" />
        <text x={720} y={124} className="distill-pk-lbl">
          base
        </text>
        <line x1={680} y1={150} x2={712} y2={150} className="distill-pk-rl" />
        <text x={720} y={154} className="distill-pk-lbl">
          after RL
        </text>
        <text x={680} y={196} className="distill-pk-note">
          RL: above the base at small k,
        </text>
        <text x={680} y={212} className="distill-pk-note">
          below it at large k.
        </text>
        <text x={680} y={240} className="distill-pk-note">
          Distillation: above the base
        </text>
        <text x={680} y={256} className="distill-pk-note">
          across k, because the teacher
        </text>
        <text x={680} y={272} className="distill-pk-note">
          adds paths the base lacked.
        </text>
        <text x={680} y={312} className="distill-pk-note">
          Schematic, drawn from the
        </text>
        <text x={680} y={328} className="distill-pk-note">
          findings described in the text.
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: the decision                                                     */
/* ------------------------------------------------------------------------ */

function DecisionDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 960 330"
        role="img"
        aria-labelledby="distill-decide-title"
        aria-describedby="distill-decide-desc"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="distill-decide-title">
          Choosing between distillation and RL from two questions: what your model scores on your
          grader today, and whether a stronger teacher you may train on exists.
        </title>
        <desc id="distill-decide-desc">
          First question: what does the model score on your grader today? A consistent 0 percent
          leads to SFT or distillation first, then measure again. Above 95 percent, RL may be
          unnecessary. In between leads to the second question: is there a stronger teacher you may
          train on? Yes leads to distil first, on-policy if the teacher shares your tokenizer, then
          RL on what is left. No leads to RL.
        </desc>
        <style>{`
          .distill-decide-bg { fill: #ffffff; }
          .distill-decide-q { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .distill-decide-sft { fill: #f1ebfa; stroke: #7d4fc4; stroke-width: 1.5; }
          .distill-decide-rl { fill: #ebf6ee; stroke: #037f0c; stroke-width: 1.5; }
          .distill-decide-stop { fill: #f4f4f4; stroke: #879596; stroke-width: 1.5; }
          .distill-decide-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .distill-decide-s { fill: #16191f; font: 12px sans-serif; text-anchor: middle; }
          .distill-decide-lbl { fill: #414d5c; font: 600 12px sans-serif; }
          .distill-decide-ln { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
          .distill-decide-head { fill: #5f6b7a; }
        `}</style>
        <rect x={0} y={0} width={960} height={330} rx={8} className="distill-decide-bg" />

        <rect x={20} y={130} width={220} height={66} rx={6} className="distill-decide-q" />
        <text x={130} y={156} className="distill-decide-t">
          What does your model
        </text>
        <text x={130} y={176} className="distill-decide-t">
          score on your grader?
        </text>

        <rect x={330} y={24} width={250} height={66} rx={6} className="distill-decide-sft" />
        <text x={455} y={50} className="distill-decide-t">
          SFT or distillation first
        </text>
        <text x={455} y={70} className="distill-decide-s">
          then measure again
        </text>

        <rect x={330} y={130} width={250} height={66} rx={6} className="distill-decide-q" />
        <text x={455} y={156} className="distill-decide-t">
          A stronger teacher you
        </text>
        <text x={455} y={176} className="distill-decide-t">
          may train on?
        </text>

        <rect x={330} y={236} width={250} height={66} rx={6} className="distill-decide-stop" />
        <text x={455} y={262} className="distill-decide-t">
          RL may be unnecessary
        </text>
        <text x={455} y={282} className="distill-decide-s">
          the grader has little left to teach
        </text>

        <rect x={670} y={78} width={270} height={66} rx={6} className="distill-decide-sft" />
        <text x={805} y={104} className="distill-decide-t">
          Distil first, then RL
        </text>
        <text x={805} y={124} className="distill-decide-s">
          on-policy if the teacher shares your tokenizer
        </text>

        <rect x={670} y={184} width={270} height={66} rx={6} className="distill-decide-rl" />
        <text x={805} y={210} className="distill-decide-t">
          RL
        </text>
        <text x={805} y={230} className="distill-decide-s">
          sections 5 to 13
        </text>

        {/* Q1 to the three outcomes */}
        <path d="M 240 150 H 280 V 57 H 322" className="distill-decide-ln" />
        <path d="M 322 52 L 330 57 L 322 62 Z" className="distill-decide-head" />
        <text x={250} y={48} className="distill-decide-lbl">
          0%
        </text>
        <path d="M 240 163 H 322" className="distill-decide-ln" />
        <path d="M 322 158 L 330 163 L 322 168 Z" className="distill-decide-head" />
        <text x={250} y={124} className="distill-decide-lbl">
          between
        </text>
        <path d="M 240 176 H 280 V 269 H 322" className="distill-decide-ln" />
        <path d="M 322 264 L 330 269 L 322 274 Z" className="distill-decide-head" />
        <text x={250} y={300} className="distill-decide-lbl">
          above 95%
        </text>

        {/* Q2 to the two outcomes */}
        <path d="M 580 156 H 620 V 111 H 662" className="distill-decide-ln" />
        <path d="M 662 106 L 670 111 L 662 116 Z" className="distill-decide-head" />
        <text x={630} y={100} className="distill-decide-lbl">
          yes
        </text>
        <path d="M 580 170 H 620 V 217 H 662" className="distill-decide-ln" />
        <path d="M 662 212 L 670 217 L 662 222 Z" className="distill-decide-head" />
        <text x={630} y={240} className="distill-decide-lbl">
          no
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Qwen3's comparison, as a table                                            */
/* ------------------------------------------------------------------------ */

type QwenRow = { id: string; stage: string; aime24: string; aime25: string; lcb: string; gpqa: string; hours: string };

const QWEN_ROWS: QwenRow[] = [
  { id: 'start', stage: 'Start: off-policy distillation', aime24: '55.0 (90.0)', aime25: '42.8 (83.3)', lcb: '42.0', gpqa: '55.6', hours: '-' },
  { id: 'rl', stage: '+ RL', aime24: '67.6 (90.0)', aime25: '55.5 (83.3)', lcb: '52.9', gpqa: '61.3', hours: '17,920' },
  { id: 'opd', stage: '+ On-policy distillation', aime24: '74.4 (93.3)', aime25: '65.5 (86.7)', lcb: '60.3', gpqa: '63.3', hours: '1,800' },
];

function QwenTable() {
  return (
    <Table<QwenRow>
      variant="embedded"
      wrapLines
      trackBy="id"
      items={QWEN_ROWS}
      columnDefinitions={[
        { id: 'stage', header: 'Qwen3-8B, from the same checkpoint', cell: (r) => r.stage, minWidth: 190 },
        { id: 'aime24', header: "AIME'24 (pass@64)", cell: (r) => r.aime24, minWidth: 110 },
        { id: 'aime25', header: "AIME'25 (pass@64)", cell: (r) => r.aime25, minWidth: 110 },
        { id: 'lcb', header: 'LiveCodeBench v5', cell: (r) => r.lcb, minWidth: 90 },
        { id: 'gpqa', header: 'GPQA-Diamond', cell: (r) => r.gpqa, minWidth: 90 },
        { id: 'hours', header: 'GPU hours', cell: (r) => r.hours, minWidth: 80 },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function DistillationOrRl() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={`Choose between copying a stronger model and scoring your own attempts, from what each can teach and what each needs (papers, reports and TRL ${TRL_TAG} read ${READ})`}
          >
            11. Distillation or RL: A Teacher&apos;s Answers or a Score on Your Own
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Distillation and RL are the two ways to make a model better at a task when someone
            else cannot simply write the answers. In distillation a stronger model, the teacher,
            shows the student what to write, token by token. In RL the student writes its own
            attempts and a grader scores each one. Section 4 built distillation and sections 5 to
            10 built RL; this section sets them against each other.
          </Box>
          <Box variant="p">
            The intuition is short. A teacher gives a target at every token, and can show the
            student behaviour it never produced. A grader gives one score per attempt, and RL
            mostly makes the student do more often what it already sometimes does; section 10 read
            that in the pass@k curves. In exchange RL needs no teacher, only a way to check an
            answer. Between the two sits on-policy distillation: the student writes its own
            attempts, and a teacher grades every token of them. The section gives each one&apos;s
            evidence, then the costs measured on the same starting model, then a decision.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Tell the three loops apart by who writes the text and who judges it, and check what each needs before you start"
          >
            Three loops, two questions
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Two questions separate the three loops: who writes the text the student trains on, and
            who judges it. In distillation the teacher writes and nothing judges; every token of
            the teacher&apos;s answer is a target. In RL the student writes and a grader judges the
            whole attempt. In on-policy distillation the student writes and the teacher judges each
            token.
          </Box>
          <ThreeLoopsDiagram />
          <Box variant="p">
            What each needs follows from the drawing. Distillation needs a teacher whose terms let
            you train on its output (section 4 lists the main providers&apos; terms) and one
            teacher answer per training example. RL needs a grader and a student that passes some
            of the time: when every attempt at a prompt gets the same score, the advantage is zero
            and the prompt contributes no gradient{' '}
            <Cite tier={3} href={DAPO} venue="NeurIPS 2025">
              DAPO, Section 3.2
            </Cite>
            . On-policy distillation needs more from the teacher than either: its probabilities
            for every token, the same tokenizer as the student, and its availability for the whole
            run{' '}
            <Cite tier={1} href={SAGEMAKER_DISTILL} accessed={READ}>
              SageMaker AI developer guide: distillation
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See the clearest same-base comparison: at 32B, SFT on a teacher's samples beat more than 10,000 steps of working RL on every benchmark"
          >
            At 32B, distillation beat RL from the same base
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            DeepSeek ran both on Qwen2.5-32B-Base. More than 10,000 steps of RL took it to 47.0
            pass@1 on AIME 2024, on par with QwQ-32B-Preview at 50.0. DeepSeek-R1-Distill-Qwen-32B,
            the same base fine-tuned on DeepSeek&apos;s 800,000 curated samples with no RL stage,
            reached 72.6, and led on every benchmark in the comparison{' '}
            <Cite tier={3} href={R1} venue="Nature 2025" accessed={READ}>
              DeepSeek-R1, Supplementary F.1, Table 16
            </Cite>
            .
          </Box>
          <Table16Diagram />
          <Box variant="p">
            Read the scope before using the number. The RL run worked: the base moved from where it
            started to QwQ-32B-Preview&apos;s level, so this is distillation beating working RL, at
            32B, with a teacher of 671B. DeepSeek&apos;s own conclusion is that distilling more
            powerful models into smaller ones &quot;yields excellent results, whereas smaller
            models relying on the large-scale RL mentioned in this paper require enormous
            computational power and may not even achieve the performance of distillation&quot;{' '}
            <Cite tier={3} href={R1} venue="Nature 2025" accessed={READ}>
              DeepSeek-R1, Supplementary F.1
            </Cite>
            . Below 32B the case is starker: RL from a 7B dense and a 16B MoE base failed to give
            meaningful AIME gains in DeepSeek&apos;s experiments{' '}
            <Cite tier={3} href={R1} venue="Nature 2025" accessed={READ}>
              DeepSeek-R1, Supplementary G.1
            </Cite>
            .
          </Box>
          <Box variant="p">
            DeepSeek did not run RL on the distilled models, and its latest version says that
            doing so &quot;could substantially boost model performance&quot;, leaving it to others{' '}
            <Cite tier={3} href={R1} venue="Nature 2025" accessed={READ}>
              DeepSeek-R1, Appendix F (v2)
            </Cite>
            . ProRL did it: it trained DeepSeek-R1-Distill-Qwen-1.5B with RL for more than 2,000
            steps on 136,000 problems, so its starting point was already a distilled model{' '}
            <Cite tier={3} href={PRORL} venue="NeurIPS 2025" accessed={READ}>
              ProRL, Sections 1 and 2.3.1
            </Cite>
            . Section 10 read what that run did to the pass@k curve.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict whether a technique can add a skill or only sharpen one, from where its training text comes from"
          >
            What each can teach: the pass@k view
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 10 read RL&apos;s pass@k curve: above the base at small k, below it at large
            k, which says RL mostly reweights paths the base could already sample. The same study
            draws the contrast with distillation, which &quot;can transfer new reasoning patterns
            from a stronger teacher to the student&quot;, so distilled models show &quot;an
            expanded reasoning scope beyond that of the base model&quot;{' '}
            <Cite tier={3} href={YUE} venue="NeurIPS 2025" accessed={READ}>
              Yue et al., abstract
            </Cite>
            . The authors scope their finding to current RLVR and note that many of the strongest
            models and pipelines are proprietary.
          </Box>
          <PassKSketch />
          <Box variant="p">
            The mechanism is the one section 3 drew as dense against sparse. The teacher&apos;s
            target says what to write at every token, including tokens the student would not have
            sampled; the grader&apos;s score only ranks attempts the student already made. One lab
            puts the gap as information: supervised learning provides on the order of the number
            of tokens in bits per episode, policy-gradient RL on the order of one{' '}
            <Cite tier={2} href={LORA_BLOG} accessed={READ}>
              Thinking Machines, LoRA Without Regret (lab blog), Reinforcement learning
            </Cite>
            .
          </Box>
          <Box variant="p">
            The price runs the other way. RL&apos;s Razor found that RL forgets less of what the
            model could already do than SFT at the same gain on the new task, and that forgetting
            tracks how far the model moved from its base on that task{' '}
            <Cite tier={3} href={RAZOR} venue="ICLR 2026">
              RL&apos;s Razor, abstract
            </Cite>
            . Distillation from a teacher&apos;s answers is SFT, so our reading is that it pays
            the SFT side of that trade; section 4 has the numbers.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Train a student on its own attempts with a teacher's probability at every token, and read the per-token advantage it turns into"
          >
            On-policy distillation: the teacher grades the student&apos;s own tokens
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On-policy distillation meets a challenge of distilling on the teacher&apos;s text. At
            inference the student continues from its own partial answer, so an early mistake
            shapes everything after it, while training on fixed sequences never shows the student
            its own mistakes. GKD (Generalized Knowledge Distillation) calls this a train-inference
            mismatch, and trains the student on sequences it generates itself, with the
            teacher&apos;s token-level distribution as the target at every position{' '}
            <Cite tier={3} href={GKD} venue="ICLR 2024" accessed={READ}>
              GKD, abstract and Section 3
            </Cite>
            . The student gets feedback on the very tokens it got wrong.
          </Box>
          <Box variant="p">
            The loss is the KL divergence of section 4, taken at each position of the
            student&apos;s own answer, with the student first:
          </Box>
          <Box variant="p">
            <code>
              loss = average over answers y sampled from pi_student, of sum over t of KL(pi_student
              || pi_teacher) at position t
            </code>
          </Box>
          <Box variant="p">
            Here <code>pi_student</code> and <code>pi_teacher</code> are the two models&apos;
            next-token distributions given the prompt and the student&apos;s answer so far. The
            sampling from <code>pi_student</code> carries the on-policy part: the positions are
            the ones the student actually reaches. The sum over t carries the dense part: a term at
            every token. The direction, student first, is the reverse KL of section 4, and it makes
            the student concentrate on what the teacher rates likely. MiniLLM argues for it on
            those grounds: the usual forward direction forces a small student to cover every answer
            the teacher might give, and so to put probability where the teacher puts almost none{' '}
            <Cite tier={3} href={MINILLM} venue="ICLR 2024" accessed={READ}>
              MiniLLM, Sections 1 and 2.1
            </Cite>
            .
          </Box>
          <Box variant="p">
            The same loss runs inside an RL trainer. Thinking Machines sets each token&apos;s
            advantage, the per-token weight of section 6, to minus the reverse KL estimated on the
            token the student sampled{' '}
            <Cite tier={2} href={TM_OPD} accessed={READ}>
              Thinking Machines, On-Policy Distillation (lab blog), Loss function: reverse KL
            </Cite>
            :
          </Box>
          <Box variant="p">
            <code>advantage_t = log pi_teacher(y_t | x, y_&lt;t) - log pi_student(y_t | x, y_&lt;t)</code>
          </Box>
          <Box variant="p">
            The advantage is zero where the two models agree, negative where the student chose a
            token the teacher finds less likely, and positive where the teacher likes it more than
            the student does. As an illustration, in section 3&apos;s wrong answer the student
            gives &quot;42&quot; probability 0.6 and the teacher 0.1: the advantage is ln 0.1 - ln
            0.6 = -2.30 + 0.51 = -1.79, and the step pushes &quot;42&quot; down hard. For
            &quot;is&quot;, at 0.9 under both, it is 0 and nothing moves. Each token&apos;s
            advantage counts that token only, with no credit passed to later ones.
          </Box>
          <Box variant="p">
            Labs running this at scale change the estimate. Kimi K3 clips the per-token value to a
            fixed range{' '}
            <Cite tier={3} href={KIMIK3} venue="preprint" accessed={READ}>
              Kimi K3, Section 4.1.3, Eq. 15
            </Cite>
            . DeepSeek-V4 computes the KL over the full vocabulary at each position, because the
            sampled-token estimate &quot;leads to high variance in gradient estimation and often
            causes training instability&quot;{' '}
            <Cite tier={3} href={DSV4} venue="preprint" accessed={READ}>
              DeepSeek-V4, Section 5.1.2
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Weigh the measured costs from the same starting checkpoint, and keep their scope: compute reported, never matched"
          >
            Measured: on-policy distillation against RL
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Qwen3 compared the two from one checkpoint, an 8B model already distilled from the
            teacher&apos;s answers, on math and code queries. On-policy distillation from a larger
            Qwen3 teacher beat RL on every benchmark listed, at 1,800 GPU hours against 17,920, and
            only distillation raised pass@64{' '}
            <Cite tier={3} href={QWEN3} venue="preprint" accessed={READ}>
              Qwen3, Section 4.7, Table 21
            </Cite>
            .
          </Box>
          <QwenTable />
          <Box variant="small" color="text-body-secondary">
            Pass@1, with pass@64 in brackets. Selected columns of Table 21; MATH500 and MMLU-Redux
            follow the same order.
          </Box>
          <Box variant="p">
            Keep the scope: one 8B student, a teacher that was itself trained with RL, and compute
            reported rather than held equal. A lab blog adds two results of the same kind, labelled
            as the lab&apos;s own. On Qwen3-8B-Base after SFT on 400,000 prompts, on-policy
            distillation raised AIME&apos;24 from 60% to 70% in about 150 steps. Distilling an
            RL-trained model back into its own base recovered the RL policy in 7 to 10 times fewer
            gradient steps than RL took, which the lab puts at 50 to 100 times less compute{' '}
            <Cite tier={2} href={TM_OPD} accessed={READ}>
              Thinking Machines, On-Policy Distillation (lab blog)
            </Cite>
            . NVIDIA counts steps rather than compute: from one checkpoint, its multi-teacher
            on-policy distillation reached 92.0 on AIME25 within 30 steps, where math-only GRPO
            went from 89.9 to 91.0 in 25{' '}
            <Cite tier={3} href={NEMOTRON} venue="preprint" accessed={READ}>
              Nemotron-Cascade 2, Section 4.4
            </Cite>
            .
          </Box>
          <Box variant="p">
            No study comparing distillation and RL from the same base at a matched compute budget
            was located in this research. The lab&apos;s reading of why the gap is so large is
            the useful mental model: RL &quot;spending most of its compute on search, rolling out
            a policy and assigning credit, rather than on making updates&quot;{' '}
            <Cite tier={2} href={TM_OPD} accessed={READ}>
              Thinking Machines, On-Policy Distillation (lab blog), Discussion
            </Cite>
            . RL finds behaviour; once a teacher has it, distillation copies it cheaply. That is
            the order the 2026 recipes of section 3 follow: RL trains specialists, and on-policy
            distillation merges them into one model.
          </Box>
          <ExpandableSection headerText="Running on-policy distillation in TRL, and on AWS">
            <SpaceBetween size="s">
              <Box variant="p">
                TRL {TRL_TAG} ships a stable <code>DistillationTrainer</code>. The student
                generates its own completions from a <code>prompt</code> column and is trained to
                match the teacher&apos;s next-token distribution{' '}
                <Cite tier={1} href={trl('distillation_trainer.py', 'L216-L221')} kind="code" accessed={READ}>
                  TRL distillation_trainer.py L216-L221
                </Cite>
                ; the teacher &quot;must share the student&apos;s vocabulary&quot;{' '}
                <Cite tier={1} href={trl('distillation_trainer.py', 'L253-L261')} kind="code" accessed={READ}>
                  TRL distillation_trainer.py L253-L261
                </Cite>
                .
              </Box>
              <Box variant="p">
                Watch one name. In <code>DistillationConfig</code>, <code>beta</code> picks the
                divergence and defaults to 1.0, the reverse KL{' '}
                <Cite tier={1} href={trl('distillation_config.py', 'L132-L138')} kind="code" accessed={READ}>
                  TRL distillation_config.py L132-L138
                </Cite>
                . In TRL&apos;s GRPO and DPO trainers, <code>beta</code> is the weight of the KL
                penalty of sections 7 and 8. A setting copied from one trainer to the other changes
                its meaning.
              </Box>
              <Box variant="p">
                On AWS the managed services run sequence-level distillation only: SageMaker AI
                lists logit-based and on-policy distillation as not currently supported{' '}
                <Cite tier={1} href={SAGEMAKER_DISTILL} accessed={READ}>
                  SageMaker AI developer guide: distillation
                </Cite>
                , and Bedrock fine-tunes the student on the teacher&apos;s generated answers.
                On-policy distillation runs as your own training job, on SageMaker AI training or
                your own GPUs [our reading]. Section 26 has the services.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick distillation, RL or both from two facts you can check today: your model's score on your grader, and whether a teacher exists"
          >
            Choosing: distil, RL, or both
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Two facts settle most of the choice. The first is what your model scores on your grader
            today. AWS&apos;s guidance for reinforcement fine-tuning is to use SFT first if rewards
            are consistently 0%, and that above 95% RL &quot;might be unnecessary&quot;{' '}
            <Cite tier={1} href={BEDROCK_RFT} accessed={READ}>
              Bedrock user guide: reinforcement fine-tuning best practices
            </Cite>
            ; at 0% every group of attempts scores alike and RL has no gradient to follow. The
            second is whether a stronger teacher exists that you may train on.
          </Box>
          <DecisionDiagram />
          <Box variant="small" color="text-body-secondary">
            Our reading of the evidence in this section; the 0% and 95% thresholds are AWS&apos;s.
          </Box>
          <Box variant="p">
            With a teacher, distil first: at 32B it beat RL from the same base, and from a
            distilled 8B checkpoint on-policy distillation beat RL again at a tenth of the GPU
            hours. Use the teacher&apos;s answers when that is all you can get, and its token
            probabilities when it shares your tokenizer and you can run it through training. Then
            run RL on what the teacher could not show, as ProRL did from a distilled model. Without
            a teacher, RL is the method that needs only a grader. Your next step is to measure your
            base model on your grader before choosing either; section 12 takes RL to agents that
            act over many turns, where a teacher is often missing and the grader is the
            environment.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
