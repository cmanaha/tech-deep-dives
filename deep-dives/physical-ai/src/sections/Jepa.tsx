import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Toy, Derived } from '../components/Cite';
import { Figure, AnimatedFigure } from '../components/Figure';
import { log10Scale } from '../lib/scale';
import { ARM, TASK_STORY } from '../lib/task';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const ROBOT_FILL = '#fff6d6';
const ROBOT_INK = '#7a5c00';
const GPU_FILL = '#e6f6ea';
const GPU_INK = '#1e7b3a';
const NEUTRAL_FILL = '#eef0f2';
const NEUTRAL_INK = '#5f6b7a';
const EMPHASIS = '#0972d3';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 560, margin: '0 auto' };
const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };

const LABEL = { fontFamily: 'sans-serif', fontSize: 12, fill: INK } as const;
const BOLD = { fontFamily: 'sans-serif', fontSize: 12, fill: INK, fontWeight: 'bold' } as const;

/** The goal the planner is given on the thread task. */
const GOAL_PHOTO = 'a photo of the block sitting in the cup';

/** Deterministic stand-in for a random number in [0, 1), so every render draws the same dots. */
function rnd(i: number, salt: number): number {
  const r = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return r - Math.floor(r);
}

function DownArrow({ x, y0, y1, color = NEUTRAL_INK }: { x: number; y0: number; y1: number; color?: string }) {
  return (
    <g>
      <line x1={x} y1={y0} x2={x} y2={y1 - 6} stroke={color} strokeWidth="1.5" />
      <path d={`M${x - 5} ${y1 - 7} L${x} ${y1} L${x + 5} ${y1 - 7} Z`} fill={color} />
    </g>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 7.1: frames to tubelets to tokens to latents                     */
/* ------------------------------------------------------------------------ */

function ClipToLatents() {
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 480" role="img" aria-labelledby="jepa-shapes-title" style={{ width: '100%', height: 'auto' }}>
        <title id="jepa-shapes-title">A 16-frame clip becomes tubelets, then tokens, then one latent vector per token</title>
        <desc>
          Five stages from top to bottom. A clip of 16 frames at 256 by 256 pixels. The clip cut into tubelets of 2
          frames by 16 by 16 pixels. One token per tubelet. The ViT-g encoder. One latent vector of 1408 numbers per
          token.
        </desc>
        <rect x="0" y="0" width="400" height="480" fill="#fbfbfd" />

        {/* the clip */}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={36 + i * 8} y={14 + i * 5} width="52" height="52" fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1" />
        ))}
        <text x="150" y="36" {...BOLD}>
          the clip
        </text>
        <text x="150" y="54" {...LABEL}>
          16 frames, 256 x 256 pixels,
        </text>
        <text x="150" y="72" {...LABEL}>
          4 frames per second
        </text>
        <DownArrow x={78} y0={92} y1={116} />

        {/* tubelets */}
        <rect x="46" y="122" width="60" height="60" fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1" />
        <rect x="36" y="130" width="60" height="60" fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1" />
        {[1, 2, 3].map((i) => (
          <g key={i}>
            <line x1={36 + i * 15} y1="130" x2={36 + i * 15} y2="190" stroke={ROBOT_INK} strokeWidth="0.6" />
            <line x1="36" y1={130 + i * 15} x2="96" y2={130 + i * 15} stroke={ROBOT_INK} strokeWidth="0.6" />
          </g>
        ))}
        <rect x="66" y="145" width="15" height="15" fill="none" stroke={EMPHASIS} strokeWidth="2.5" />
        <path d="M81 145 L91 137 M81 160 L91 152 M66 145 L76 137" stroke={EMPHASIS} strokeWidth="1.5" fill="none" />
        <text x="150" y="144" {...BOLD}>
          cut into tubelets
        </text>
        <text x="150" y="162" {...LABEL}>
          each: 2 frames x 16 x 16 pixels
        </text>
        <text x="150" y="180" {...LABEL}>
          8 deep, 16 by 16 per frame
        </text>
        <DownArrow x={78} y0={198} y1={222} />

        {/* tokens */}
        {Array.from({ length: 14 }, (_, i) => (
          <rect key={i} x={36 + (i % 7) * 13} y={230 + Math.floor(i / 7) * 13} width="10" height="10" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1" />
        ))}
        <text x="150" y="238" {...BOLD}>
          one token per tubelet
        </text>
        <text x="150" y="256" {...LABEL} data-num="derived">
          8 x 16 x 16 = 2,048 tokens
        </text>
        <DownArrow x={78} y0={264} y1={288} />

        {/* encoder */}
        <rect x="30" y="292" width="340" height="52" rx="4" fill={GPU_FILL} stroke={GPU_INK} strokeWidth="1.5" />
        <text x="200" y="314" textAnchor="middle" {...BOLD}>
          encoder: ViT-g
        </text>
        <text x="200" y="332" textAnchor="middle" {...LABEL}>
          1B parameters, 40 layers
        </text>
        <DownArrow x={78} y0={348} y1={372} />

        {/* latents */}
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={36 + i * 13} y="380" width="9" height="56" fill={GPU_FILL} stroke={GPU_INK} strokeWidth="1" />
        ))}
        <text x="150" y="398" {...BOLD} data-num="derived">
          2,048 latents
        </text>
        <text x="150" y="416" {...LABEL}>
          one vector per token,
        </text>
        <text x="150" y="434" {...LABEL}>
          1408 numbers each
        </text>
        <text x="36" y="464" {...LABEL}>
          Yellow: camera pixels. Green: computed on the GPU.
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 7.2 (animated): one JEPA training step                           */
/* ------------------------------------------------------------------------ */

const TRAIN_STATUS = [
  '1. Cut the clip into tokens, hide most',
  '2. Context encoder: visible tokens only',
  '3. Target encoder: the whole clip',
  '4. Predictor guesses the hidden latents',
  '5. Loss: distance between latents',
  '6. Gradient: predictor, context encoder',
  '7. EMA: the target follows slowly',
];

const TRAIN_STEPS = [
  'A clip is cut into tokens and most of them are masked. The grey cells are hidden; the hidden block runs through the whole clip in time.',
  'The context encoder (weights theta) receives only the visible tokens and outputs one latent for each.',
  'The target encoder (weights theta-bar), a slowly moving copy of the context encoder, receives the whole clip, hidden tokens included.',
  'The predictor (weights phi) takes the context latents plus one mask token per hidden position, and outputs a guess at the latent for each hidden position.',
  'The loss is the L1 distance between the predicted latents and the target latents at the hidden positions. No pixel is drawn anywhere.',
  'Gradients flow back from the loss through the predictor and the context encoder, and the optimiser changes phi and theta. The stop-gradient blocks the path into the target encoder.',
  'After the optimiser step, every target weight moves 0.075% of the way toward the matching context-encoder weight. That is the EMA update, and it is the only way theta-bar changes.',
];

const TOKEN_COLS = 10;

function TrainStep({ step, reduced }: { step: number; reduced: boolean }) {
  const s = step + 1;
  const t = reduced ? 'none' : 'opacity 350ms ease';
  const seen = (from: number): CSSProperties => ({ opacity: s >= from ? 1 : 0.22, transition: t });
  const show = (on: boolean): CSSProperties => ({ opacity: on ? 1 : 0, transition: t });
  const edge = (at: number, base: string) => (s === at ? { stroke: EMPHASIS, strokeWidth: 2.5 } : { stroke: base, strokeWidth: 1.5 });
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 480" role="img" aria-labelledby="jepa-train-title" style={{ width: '100%', height: 'auto' }}>
        <title id="jepa-train-title">One JEPA training step: two encoders, a predictor, a loss between latents, and which weights change</title>
        <desc>
          A grid of clip tokens with most hidden feeds two branches. On the left the context encoder sees the visible
          tokens and the predictor guesses latents for the hidden positions. On the right the target encoder sees
          the whole clip and gives the target latents. A loss box compares the two sets of latents. A gradient path
          runs from the loss back into the predictor and the context encoder; a stop-gradient bar blocks the path
          into the target encoder. An arrow from the context encoder to the target encoder marks the EMA update.
        </desc>
        <rect x="0" y="0" width="400" height="480" fill="#fbfbfd" />

        {TRAIN_STATUS.map((label, i) => (
          <text key={label} x="14" y="22" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill={INK} style={show(step === i)}>
            {label}
          </text>
        ))}

        {/* clip tokens */}
        {Array.from({ length: TOKEN_COLS * 3 }, (_, i) => {
          const col = i % TOKEN_COLS;
          const hidden = col >= 1 && col <= 8;
          return (
            <rect
              key={i}
              x={136 + col * 13}
              y={38 + Math.floor(i / TOKEN_COLS) * 13}
              width="11"
              height="11"
              fill={hidden ? NEUTRAL_INK : ROBOT_FILL}
              stroke={hidden ? NEUTRAL_INK : ROBOT_INK}
              strokeWidth="1"
            />
          );
        })}
        <text x="128" y="60" textAnchor="end" {...LABEL}>
          clip tokens
        </text>
        <text x="274" y="60" {...LABEL}>
          grey: hidden
        </text>

        {/* context branch */}
        <g style={seen(2)}>
          <path d="M150 78 V98 H115 V122" fill="none" stroke={NEUTRAL_INK} strokeWidth="1.5" />
          <path d="M110 121 L115 129 L120 121 Z" fill={NEUTRAL_INK} />
          <text x="107" y="116" textAnchor="end" {...LABEL}>
            visible only
          </text>
          <rect x="40" y="130" width="150" height="50" rx="4" fill={GPU_FILL} {...edge(2, GPU_INK)} />
          <text x="115" y="151" textAnchor="middle" {...BOLD}>
            context encoder
          </text>
          <text x="115" y="169" textAnchor="middle" {...LABEL}>
            weights theta
          </text>
        </g>

        {/* target branch */}
        <g style={seen(3)}>
          <path d="M250 78 V98 H300 V122" fill="none" stroke={NEUTRAL_INK} strokeWidth="1.5" />
          <path d="M295 121 L300 129 L305 121 Z" fill={NEUTRAL_INK} />
          <text x="308" y="116" {...LABEL}>
            whole clip
          </text>
          <rect x="225" y="130" width="150" height="50" rx="4" fill={NEUTRAL_FILL} {...edge(3, NEUTRAL_INK)} />
          <text x="300" y="151" textAnchor="middle" {...BOLD}>
            target encoder
          </text>
          <text x="300" y="169" textAnchor="middle" {...LABEL}>
            weights theta-bar
          </text>
        </g>

        {/* predictor and its guess */}
        <g style={seen(4)}>
          <DownArrow x={115} y0={180} y1={235} />
          <rect x="40" y="236" width="150" height="50" rx="4" fill={GPU_FILL} {...edge(4, GPU_INK)} />
          <text x="115" y="257" textAnchor="middle" {...BOLD}>
            predictor
          </text>
          <text x="115" y="275" textAnchor="middle" {...LABEL}>
            weights phi
          </text>
          <DownArrow x={115} y0={286} y1={318} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={88 + i * 15} y="320" width="10" height="22" fill={GPU_FILL} stroke={GPU_INK} strokeWidth="1" />
          ))}
          <text x="115" y="360" textAnchor="middle" {...LABEL}>
            predicted latents
          </text>
        </g>

        {/* target latents and the loss */}
        <g style={seen(5)}>
          <DownArrow x={300} y0={180} y1={318} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={273 + i * 15} y="320" width="10" height="22" fill={NEUTRAL_FILL} stroke={NEUTRAL_INK} strokeWidth="1" />
          ))}
          <text x="300" y="360" textAnchor="middle" {...LABEL}>
            target latents
          </text>
          <line x1="130" y1="366" x2="166" y2="384" stroke={NEUTRAL_INK} strokeWidth="1.5" />
          <line x1="285" y1="366" x2="249" y2="384" stroke={NEUTRAL_INK} strokeWidth="1.5" />
          <rect x="130" y="384" width="155" height="44" rx="4" fill="#ffffff" {...edge(5, NEUTRAL_INK)} />
          <text x="207" y="403" textAnchor="middle" {...BOLD}>
            loss: L1 distance
          </text>
          <text x="207" y="420" textAnchor="middle" {...LABEL}>
            between the two
          </text>
        </g>

        {/* gradient path and stop-gradient */}
        <g style={show(s >= 6)}>
          <path d="M130 406 H22 V155 H32" fill="none" stroke={EMPHASIS} strokeWidth="3" />
          <path d="M31 149 L40 155 L31 161 Z" fill={EMPHASIS} />
          <path d="M22 261 H32" fill="none" stroke={EMPHASIS} strokeWidth="3" />
          <path d="M31 255 L40 261 L31 267 Z" fill={EMPHASIS} />
          <rect x="284" y="258" width="32" height="7" fill={INK} />
          <text x="278" y="266" textAnchor="end" {...BOLD}>
            stop-gradient
          </text>
          <text x="14" y="450" fontFamily="sans-serif" fontSize="12" fill={EMPHASIS}>
            blue: the gradient changes phi and theta
          </text>
          <text x="14" y="468" {...LABEL}>
            no gradient reaches theta-bar
          </text>
        </g>

        {/* EMA update */}
        <g style={show(s >= 7)}>
          <line x1="190" y1="155" x2="216" y2="155" stroke={EMPHASIS} strokeWidth="3" />
          <path d="M215 149 L224 155 L215 161 Z" fill={EMPHASIS} />
          <text x="207" y="200" textAnchor="middle" {...BOLD}>
            EMA update each step:
          </text>
          <text x="207" y="216" textAnchor="middle" {...LABEL}>
            0.075% of the way to theta
          </text>
        </g>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 7.3: collapse                                                    */
/* ------------------------------------------------------------------------ */

const SPREAD_DOTS = Array.from({ length: 28 }, (_, i) => {
  const a = 2 * Math.PI * rnd(i, 1);
  const r = 44 * Math.sqrt(rnd(i, 2));
  return { x: 75 + r * Math.cos(a), y: 71 + r * Math.sin(a) };
});
const LINE_DOTS = Array.from({ length: 28 }, (_, i) => {
  const u = rnd(i, 3) * 2 - 1;
  const j = (rnd(i, 4) * 2 - 1) * 2.5;
  return { x: 75 + 42 * u + j, y: 323 - 30 * u + j };
});

function CollapseDiagram() {
  const rows = [
    { y: 16, title: 'Spread out', lines: ['Different inputs land apart, in', 'every direction. The latents can', 'tell one scene from another.'] },
    { y: 142, title: 'Complete collapse', lines: ['Every input lands on one point.', 'Guess and answer always match,', 'so the loss is zero.'] },
    { y: 268, title: 'Dimensional collapse', lines: ['Inputs differ, but only along', 'one line. The other dimensions', 'carry nothing.'] },
  ];
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 396" role="img" aria-labelledby="jepa-collapse-title" style={{ width: '100%', height: 'auto' }}>
        <title id="jepa-collapse-title">A spread latent space against complete collapse and dimensional collapse</title>
        <desc>
          Three panels, each plotting the latents of many inputs in two dimensions. In the first the dots fill a round
          cloud. In the second every dot sits on one point. In the third the dots lie along a single line.
        </desc>
        <rect x="0" y="0" width="400" height="396" fill="#fbfbfd" />
        {rows.map((r) => (
          <g key={r.title}>
            <rect x="20" y={r.y} width="110" height="110" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1" />
            <line x1="75" y1={r.y + 6} x2="75" y2={r.y + 104} stroke="#e3e6ea" strokeWidth="1" />
            <line x1="26" y1={r.y + 55} x2="124" y2={r.y + 55} stroke="#e3e6ea" strokeWidth="1" />
            <text x="146" y={r.y + 30} {...BOLD}>
              {r.title}
            </text>
            {r.lines.map((line, i) => (
              <text key={line} x="146" y={r.y + 50 + i * 17} {...LABEL}>
                {line}
              </text>
            ))}
          </g>
        ))}
        {SPREAD_DOTS.map((p) => (
          <circle key={`${p.x}-${p.y}`} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="3" fill={GPU_INK} />
        ))}
        <circle cx="75" cy="197" r="9" fill="none" stroke={EMPHASIS} strokeWidth="2.5" />
        <circle cx="75" cy="197" r="3.5" fill={INK} />
        {LINE_DOTS.map((p) => (
          <circle key={`${p.x}-${p.y}`} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="3" fill={NEUTRAL_INK} />
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 7.4 (animated): planning with the cross-entropy method           */
/* ------------------------------------------------------------------------ */

const NOW = { x: 130, y: 236 };
const GOAL = { x: 304, y: 104 };
const CEM_N = 24;
const CEM_DOTS = Array.from({ length: CEM_N }, (_, i) => {
  const a = 2 * Math.PI * rnd(i, 5);
  const r = 92 * Math.sqrt(rnd(i, 6));
  const a2 = 2 * Math.PI * rnd(i, 7);
  const r2 = 15 * Math.sqrt(rnd(i, 8));
  const x = NOW.x + r * Math.cos(a);
  const y = NOW.y + r * Math.sin(a);
  return { x, y, fx: GOAL.x + r2 * Math.cos(a2), fy: GOAL.y + r2 * Math.sin(a2), d: Math.hypot(x - GOAL.x, y - GOAL.y) };
});
const ELITE_CUT = [...CEM_DOTS].sort((p, q) => p.d - q.d)[3].d;
const ELITES = CEM_DOTS.filter((p) => p.d <= ELITE_CUT);
const ELITE_MEAN = {
  x: ELITES.reduce((acc, p) => acc + p.x, 0) / ELITES.length,
  y: ELITES.reduce((acc, p) => acc + p.y, 0) / ELITES.length,
};
/** The candidate whose distance to the goal is drawn in step 4: one near the top of the cloud. */
const SCORED = [...CEM_DOTS].sort((p, q) => p.y - q.y)[1];

const CEM_STATUS = [
  '1. Encode the present and the goal',
  '2. Sample candidate actions, widely',
  '3. Imagine where each one ends',
  '4. Score each: distance to the goal',
  '5. Keep the best few',
  '6. Refit the distribution: it narrows',
  '7. Repeat: the cloud closes on the goal',
  '8. Execute one action, then plan again',
];

const CEM_STEPS = [
  'The current camera frame and the goal photo go through the encoder. Each becomes a point in latent space: now, and goal.',
  'Sample many candidate actions from a wide distribution. Each short line is one candidate leaving the present.',
  'The predictor imagines where each candidate ends, in latent space. Each dot is one imagined future. No image is produced and the arm has not moved.',
  'Score each dot by its distance to the goal latent. That distance is the energy; one is drawn as a dashed line.',
  'Keep the few candidates with the lowest energy, the elites, ringed in blue. The rest are discarded.',
  'Refit the sampling distribution to the elites: the dashed circle moves toward the goal and narrows.',
  'Repeat sampling, imagining, scoring and refitting. With each iteration the cloud of imagined futures tightens on the goal.',
  'Execute only the first action of the best plan on the arm. Then take a new camera frame and plan again from it.',
];

function CemPlanning({ step, reduced }: { step: number; reduced: boolean }) {
  const s = step + 1;
  const t = reduced ? 'none' : 'opacity 350ms ease';
  const show = (on: boolean, level = 1): CSSProperties => ({ opacity: on ? level : 0, transition: t });
  const moved = s >= 7;
  const halo = { stroke: '#ffffff', strokeWidth: 4, paintOrder: 'stroke' as const };
  const ux = (GOAL.x - NOW.x) / Math.hypot(GOAL.x - NOW.x, GOAL.y - NOW.y);
  const uy = (GOAL.y - NOW.y) / Math.hypot(GOAL.x - NOW.x, GOAL.y - NOW.y);
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 424" role="img" aria-labelledby="jepa-cem-title" style={{ width: '100%', height: 'auto' }}>
        <title id="jepa-cem-title">Planning with the cross-entropy method: sampled futures narrow onto the goal latent</title>
        <desc>
          A panel stands for latent space. A point marked now and a point marked goal are fixed. Candidate actions
          leave the present as short lines, the predictor places a dot where each one ends, the dots nearest the goal
          are kept, the sampling circle shrinks and moves toward the goal, and after repeated rounds all dots sit
          around the goal. A final arrow shows the one action that is executed.
        </desc>
        <rect x="0" y="0" width="400" height="424" fill="#fbfbfd" />
        {CEM_STATUS.map((label, i) => (
          <text key={label} x="14" y="22" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill={INK} style={show(step === i)}>
            {label}
          </text>
        ))}
        <rect x="14" y="34" width="372" height="310" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1" />
        <text x="24" y="54" {...LABEL}>
          latent space, drawn in two dimensions
        </text>

        {/* sampling distributions */}
        <circle cx={NOW.x} cy={NOW.y} r="100" fill="none" stroke={NEUTRAL_INK} strokeWidth="1.5" strokeDasharray="6 5" style={show(s >= 2 && s <= 6, s === 6 ? 0.3 : 1)} />
        <circle cx={ELITE_MEAN.x.toFixed(1)} cy={ELITE_MEAN.y.toFixed(1)} r="46" fill="none" stroke={EMPHASIS} strokeWidth="2" strokeDasharray="6 5" style={show(s === 6)} />
        <circle cx={GOAL.x} cy={GOAL.y} r="24" fill="none" stroke={EMPHASIS} strokeWidth="2" strokeDasharray="6 5" style={show(moved)} />

        {/* candidates leaving the present */}
        {CEM_DOTS.map((p) => (
          <g key={`${p.x}`}>
            <line
              x1={NOW.x}
              y1={NOW.y}
              x2={(NOW.x + 0.35 * (p.x - NOW.x)).toFixed(1)}
              y2={(NOW.y + 0.35 * (p.y - NOW.y)).toFixed(1)}
              stroke={NEUTRAL_INK}
              strokeWidth="1.5"
              style={show(s === 2)}
            />
            <line x1={NOW.x} y1={NOW.y} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke={NEUTRAL_INK} strokeWidth="1" style={show(s >= 3 && s <= 6, 0.35)} />
          </g>
        ))}

        {/* the energy of one candidate */}
        <line x1={SCORED.x.toFixed(1)} y1={SCORED.y.toFixed(1)} x2={GOAL.x} y2={GOAL.y} stroke={EMPHASIS} strokeWidth="2" strokeDasharray="4 4" style={show(s === 4)} />
        <text x="376" y="330" textAnchor="end" fontFamily="sans-serif" fontSize="12" fill={EMPHASIS} style={show(s === 4)}>
          dashed: one energy
        </text>

        {/* imagined futures */}
        {CEM_DOTS.map((p) => {
          const elite = p.d <= ELITE_CUT;
          const level = s >= 5 && s <= 6 && !elite ? 0.25 : 1;
          return (
            <g
              key={`${p.x}`}
              style={{
                transform: moved ? `translate(${(p.fx - p.x).toFixed(1)}px, ${(p.fy - p.y).toFixed(1)}px)` : 'translate(0px, 0px)',
                transition: reduced ? 'none' : 'transform 900ms ease',
              }}
            >
              <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="4" fill={NEUTRAL_INK} style={show(s >= 3, level)} />
              {elite && <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="7.5" fill="none" stroke={EMPHASIS} strokeWidth="2.5" style={show(s === 5 || s === 6)} />}
            </g>
          );
        })}

        {/* the action that is executed */}
        <g style={show(s === 8)}>
          <line x1={NOW.x} y1={NOW.y} x2={(NOW.x + 58 * ux).toFixed(1)} y2={(NOW.y + 58 * uy).toFixed(1)} stroke={EMPHASIS} strokeWidth="4" />
          <circle cx={(NOW.x + 64 * ux).toFixed(1)} cy={(NOW.y + 64 * uy).toFixed(1)} r="6" fill={EMPHASIS} />
          <text x="24" y="330" fontFamily="sans-serif" fontSize="12" fill={EMPHASIS}>
            blue: the one action executed
          </text>
        </g>

        {/* now and goal */}
        <circle cx={NOW.x} cy={NOW.y} r="6" fill={ROBOT_INK} stroke="#ffffff" strokeWidth="1.5" />
        <text x={NOW.x} y={NOW.y + 24} textAnchor="middle" {...BOLD} {...halo}>
          now
        </text>
        <path d={`M${GOAL.x - 8} ${GOAL.y} H${GOAL.x + 8} M${GOAL.x} ${GOAL.y - 8} V${GOAL.y + 8}`} stroke={INK} strokeWidth="2.5" />
        <text x={GOAL.x} y={GOAL.y - 34} textAnchor="middle" {...BOLD} {...halo}>
          goal
        </text>

        {/* legend */}
        <circle cx="24" cy="362" r="4" fill={NEUTRAL_INK} />
        <text x="36" y="366" {...LABEL}>
          imagined end of one candidate
        </text>
        <circle cx="24" cy="382" r="4" fill={NEUTRAL_INK} />
        <circle cx="24" cy="382" r="7.5" fill="none" stroke={EMPHASIS} strokeWidth="2.5" />
        <text x="36" y="386" {...LABEL}>
          kept: lowest energy (an elite)
        </text>
        <line x1="14" y1="404" x2="32" y2="404" stroke={NEUTRAL_INK} strokeWidth="1.5" strokeDasharray="6 5" />
        <text x="36" y="408" {...LABEL}>
          dashed circle: where the planner samples
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 7.5: predictor passes per decision                               */
/* ------------------------------------------------------------------------ */

const PLANNERS = [
  { name: 'V-JEPA 2-AC', detail: '800 samples x 10 iterations x horizon 1', passes: 8000, label: '8,000' },
  { name: 'V-JEPA 2.1, long horizon', detail: '300 x 15 x horizon 8', passes: 36000, label: '36,000' },
  { name: 'LeWorldModel on Push-T', detail: '300 x 30 x horizon 5', passes: 45000, label: '45,000' },
  { name: 'RoboJEPA on a real arm', detail: '4,096 x 10 x horizon 5; first plan 307,200', passes: 204800, label: '204,800' },
];
const PASS_TICKS = [
  { v: 1000, label: '1,000' },
  { v: 10000, label: '10,000' },
  { v: 100000, label: '100,000' },
  { v: 1000000, label: '1,000,000' },
];

function PassesChart() {
  const x = log10Scale(1000, 1000000, 28, 330);
  const rowH = 62;
  const top = 14;
  const axisY = top + PLANNERS.length * rowH + 2;
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 320" role="img" aria-labelledby="jepa-passes-title" style={{ width: '100%', height: 'auto' }}>
        <title id="jepa-passes-title">Predictor passes per decision for four planners, on a log axis</title>
        <desc>
          Four points on a logarithmic axis of predictor passes per decision, three decades wide: V-JEPA 2-AC at
          8,000, V-JEPA 2.1 with a long horizon at 36,000, LeWorldModel on Push-T at 45,000 and RoboJEPA on a real
          arm at 204,800.
        </desc>
        <rect x="0" y="0" width="400" height="320" fill="#fbfbfd" />
        {PASS_TICKS.map((k) => (
          <line key={k.v} x1={x(k.v)} y1={top} x2={x(k.v)} y2={axisY} stroke="#e3e6ea" strokeWidth="1" />
        ))}
        {PLANNERS.map((p, i) => {
          const y0 = top + i * rowH;
          return (
            <g key={p.name}>
              <text x="28" y={y0 + 12} {...BOLD}>
                {p.name}
              </text>
              <line x1={x(1000)} y1={y0 + 27} x2={x(p.passes)} y2={y0 + 27} stroke={GPU_INK} strokeWidth="3" />
              <circle cx={x(p.passes)} cy={y0 + 27} r="6" fill={GPU_INK} />
              <text x={x(p.passes) + 12} y={y0 + 31} {...BOLD}>
                {p.label}
              </text>
              <text x="28" y={y0 + 50} {...LABEL}>
                {p.detail}
              </text>
            </g>
          );
        })}
        <line x1="28" y1={axisY} x2="330" y2={axisY} stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <g aria-hidden="true">
          {PASS_TICKS.map((k) => (
            <g key={k.v}>
              <line x1={x(k.v)} y1={axisY} x2={x(k.v)} y2={axisY + 5} stroke={NEUTRAL_INK} strokeWidth="1.5" />
              <text x={x(k.v)} y={axisY + 20} textAnchor="middle" {...LABEL}>
                {k.label}
              </text>
            </g>
          ))}
        </g>
        <text x="180" y={axisY + 42} textAnchor="middle" {...LABEL}>
          predictor passes per decision (log scale)
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

function Formula({ children }: { children: string }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <code style={{ whiteSpace: 'nowrap' }}>{children}</code>
    </div>
  );
}

export function Jepa() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Follow a JEPA from pixels to a planned action, and explain why it does not collapse (the V-JEPA 2, V-JEPA 2.1, RoboJEPA and LeWorldModel papers with the vjepa2 and le-wm code, read 2026-11-20)"
          >
            7. JEPA: Predicting in Latent Space
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 6 ended on a design choice. A world model, the function that predicts the next state from the
            current state and an action, can predict a latent (a learned summary vector of a frame) in place of
            the frame itself. That design is the JEPA (Joint-Embedding Predictive Architecture). This section
            opens it up for an {ARM} that must {TASK_STORY}: the encoder, the predictor, the loss, the shortcut
            that would make the loss worthless, and how a robot plans with the result.
          </Box>
          <Box variant="p">
            The number to carry out is a count. To choose one action, the planner in the V-JEPA 2 paper calls its
            predictor 800 x 10 x 1 = 8,000 times, and the authors report 16 seconds for that on one NVIDIA RTX
            4090.{' '}
            <Cite id="F03-24">V-JEPA 2 paper, appendix B.2</Cite>{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="What you would need to know to fill in a hidden part of a video, and why that knowledge is the thing worth learning">
            The scene: a clip with one region hidden
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Record four seconds of the arm reaching for the block. Cover one region of the picture with a grey
            rectangle, in every frame: the region where the gripper meets the block. What is under the rectangle?
          </Box>
          <Box variant="p">
            Your answer would be a description: the gripper comes down, closes on the block and lifts it. To give
            it you need to know where the block was, how a gripper moves, and that a held block travels with the
            hand. The grain of the table is no part of the answer, and you could not have predicted it anyway.
          </Box>
          <Box variant="p">
            A JEPA is trained on this exercise, with one change: the description is a list of numbers the model
            learns for itself. The V-JEPA 2 authors draw the same line between what can be predicted (the
            trajectory of a moving object) and what cannot (the place of each leaf on a tree).{' '}
            <Cite id="F03-107">V-JEPA 2 paper, section 1</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="The three parts of a JEPA, and why its loss never draws a pixel">
            The idea: encode, predict the hidden latent, compare latents
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">A JEPA has three parts.</Box>
          <ul style={LIST}>
            <li>
              An <strong>encoder</strong>: a network that turns what the camera saw into vectors. Its output is the
              latent from section 6. Papers also call it a representation or an embedding; this section says
              latent.
            </li>
            <li>
              A <strong>target</strong>: the thing to be predicted (the hidden region, or the next frame) also goes
              through an encoder, which gives the target latent.
            </li>
            <li>
              A <strong>predictor</strong>: a second network that takes the latent of what was seen and outputs a
              guess at the target latent.
            </li>
          </ul>
          <Box variant="p">
            The name says the same thing. Joint-embedding: both sides are embedded by an encoder. Predictive: one
            latent is predicted from the other.{' '}
            <Cite id="F03-47">LeCun position paper, section 4.4</Cite>
          </Box>
          <Box variant="p">
            Training needs a loss, a single number that says how wrong the guess was. In a JEPA the loss is the
            distance between the predicted latent and the target latent. Nothing turns either one back into an
            image. The paper that defined the architecture calls this distance the energy: low when the target is
            a plausible match for what was seen, high when it is not.{' '}
            <Cite id="F03-48">LeCun position paper, sections 4.1 and 4.4</Cite>
          </Box>
          <Box variant="p">
            Comparing latents is the point of the design. A loss on pixels charges the model for every leaf and
            reflection it gets wrong. A loss on latents lets the encoder leave those out, so the model&apos;s
            capacity goes to what can be predicted.{' '}
            <Cite id="F03-51">LeCun position paper, section 4.4</Cite> Section 6
            listed what this gives up: there is no picture to inspect, and whatever the encoder dropped is gone.
          </Box>
          <Box variant="p">
            It also opens a loophole: the model produces both the guess and the answer, so it is marking its own
            homework. The block on collapse below is about closing it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="The real shapes: how many vectors one clip of the arm becomes, and how wide each one is">
            Worked example: from a clip to latents
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            V-JEPA 2 is Meta&apos;s video JEPA and the model this section follows. Its encoder is a ViT (Vision
            Transformer), a transformer that reads a picture as a sequence of pieces. Four terms carry the shapes.
          </Box>
          <ul style={LIST}>
            <li>
              A <strong>patch</strong> is a small square of the picture, 16 by 16 pixels here.
            </li>
            <li>
              A <strong>tubelet</strong> is a patch extended through time: the same square in 2 consecutive
              frames, so 2 x 16 x 16 pixels.{' '}
              <Cite id="F03-3">V-JEPA 2 paper, section 2.1</Cite>
            </li>
            <li>
              A <strong>token</strong> is one element of the sequence a transformer processes. Each tubelet becomes
              one token.
            </li>
            <li>
              The encoder outputs one vector per token. At this scale the <strong>latent</strong> of a clip is a
              grid of vectors, one per tubelet.
            </li>
          </ul>
          <Box variant="p">
            Now count, for one pretraining clip of the arm: 16 frames at 256 by 256 pixels, sampled at 4 frames per
            second. In time, 16 frames / 2 = 8 tubelets deep. In space, 256 / 16 = 16 tubelets per side. In total 8
            x 16 x 16 = <Derived>2,048</Derived> tokens (our arithmetic from the paper&apos;s clip and tubelet
            sizes).{' '}
            <Cite id="F03-11">V-JEPA 2 paper, section 2.2 and Table 9</Cite> The earlier V-JEPA paper prints the
            same sum for its 224-pixel clips: 8 x 14 x 14 = 1,568.{' '}
            <Cite id="F03-59">V-JEPA paper, section 3.2</Cite>
          </Box>
          <Box variant="p">
            The largest encoder, ViT-g, has 1B parameters and 40 layers, and emits each token as a vector of 1408
            numbers. Two smaller ones exist, ViT-L at 300M parameters and ViT-H at 600M. The predictor used in
            pretraining is the same for all three and far smaller: 22M parameters, 12 layers, vectors of 384
            numbers.{' '}
            <Cite id="F03-4">V-JEPA 2 paper, appendix A.3, Table 12</Cite>
          </Box>
          <Figure
            cites="F03-3 F03-4 F03-11"
            caption={
              <>
                Read top to bottom: the same four seconds of video at each stage. The patch grid is drawn 4 by 4
                so it stays legible; the real grid is 16 by 16 per frame. The token count is our arithmetic from
                the clip and tubelet sizes.
              </>
            }
          >
            <ClipToLatents />
          </Figure>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Follow one clip through three networks and see which weights the loss is allowed to change">
            One training step: which branch learns
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Pretraining uses video alone: no actions, no labels. Each step takes a clip, hides most of it and asks
            for the latents of the hidden part. Three networks take part, and the loss changes two of them.
          </Box>

          <Box variant="h3">Masking, and what the predictor is asked</Box>
          <Box variant="p">
            Masking means removing tokens before the encoder sees them. V-JEPA 2 hides blocks: rectangles of the
            frame that run through the whole clip in time, like the grey rectangle in the scene. The released
            configuration draws two kinds of mask per clip: 8 blocks that each cover 15% of the frame area, and 2
            blocks that each cover 70%.{' '}
            <Cite id="F03-9">vjepa2 pretrain-256px-16f.yaml, mask block</Cite> The V-JEPA paper, where these
            settings come from, reports that they hide about 90% of the tokens on average.{' '}
            <Cite id="F03-60">V-JEPA paper, section 3.2</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              The <strong>context encoder</strong> sees only the visible tokens. Its weights are written{' '}
              <code>theta</code>.
            </li>
            <li>
              The <strong>target encoder</strong> is a copy of the encoder that sees the whole clip, hidden parts
              included. Its weights are written <code>theta-bar</code>. It supplies the answers.
            </li>
            <li>
              The <strong>predictor</strong>, with weights <code>phi</code>, receives the context encoder&apos;s
              outputs plus one mask token for every hidden position. A mask token is a learned placeholder vector
              that means &quot;predict what belongs here&quot;, tagged with its position in the clip. The
              predictor returns one vector for each hidden position.{' '}
              <Cite id="F03-6">vjepa2 predictor.py, lines 189 to 252</Cite>
            </li>
          </ul>

          <Box variant="h3">The loss</Box>
          <Box variant="p">
            The loss asks one question: at the hidden positions, how far is the predictor&apos;s guess from what
            the target encoder says is there? The symbols first. <code>x</code> is the masked clip (the visible
            tokens) and <code>y</code> the full clip. <code>E_theta</code> is the encoder with its weights{' '}
            <code>theta</code>, and <code>E_theta-bar</code> the target encoder. <code>P_phi</code> is the
            predictor. <code>Delta_y</code> is the mask tokens, which mark the hidden positions.{' '}
            <code>sg(...)</code> is the stop-gradient, explained below; for now read it as &quot;the value
            of&quot;. The double bars with a subscript 1 are the L1 distance, the loss section 4 used on actions:
            subtract the two lists of numbers entry by entry, drop the signs and add up. The paper prints the
            objective as:
          </Box>
          <Formula>{'minimize over theta, phi, Delta_y:  || P_phi(Delta_y, E_theta(x)) - sg(E_theta-bar(y)) ||_1'}</Formula>
          <Box variant="p">
            <Cite id="F03-2">V-JEPA 2 paper, section 2.1, equation 1</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <code>E_theta(x)</code> is what was seen: the context encoder&apos;s latents for the visible tokens.
            </li>
            <li>
              <code>P_phi(Delta_y, ...)</code> is the guess: the predictor&apos;s latents for the hidden positions.
            </li>
            <li>
              <code>sg(E_theta-bar(y))</code> is the answer: the target encoder&apos;s latents for the full clip.
              The loss is applied at the hidden positions only.
            </li>
            <li>
              <code>|| ... ||_1</code> is the energy from the idea block: the distance between guess and answer,
              measured in latent space.
            </li>
            <li>
              <code>minimize over theta, phi, Delta_y</code> lists what the optimiser may change: the encoder, the
              predictor and the mask token. <code>theta-bar</code> is absent from the list.
            </li>
          </ul>
          <Box variant="p">
            With toy latents of four numbers (an illustration): guess (1, 3, 0, 2), answer (2, 3, 1, 0). The
            differences without their signs are 1, 0, 1 and 2, which add up to 4. The released code takes their
            mean, 4 / 4 = 1.{' '}
            <Cite id="F03-7">vjepa2 app/vjepa/train.py, lines 429 to 450</Cite>
          </Box>

          <Box variant="h3">The stop-gradient: which weights change</Box>
          <Box variant="p">
            Training works by gradient: for every weight, the trainer computes how the loss would change if that
            weight were nudged, then nudges it the way that lowers the loss. The loss above depends on two
            encoders, so left alone both would be nudged. The stop-gradient says: treat this value as a constant.
            Inside <code>sg(...)</code> no nudge is computed, so the gradient reaches <code>phi</code> and{' '}
            <code>theta</code> through the left-hand term and never reaches <code>theta-bar</code>. That is what
            &quot;the gradient does not flow through the target&quot; means: the optimiser changes the predictor
            and the context encoder, and leaves the target encoder alone. In the released code the target encoder runs under <code>torch.no_grad()</code> and its
            weights are marked <code>requires_grad = False</code>.{' '}
            <Cite id="F03-7">vjepa2 app/vjepa/train.py, lines 429 to 450</Cite>{' '}
            <Cite id="F03-8">vjepa2 app/vjepa/train.py, lines 222 to 480</Cite>
          </Box>

          <Box variant="h3">The EMA: how the target encoder moves</Box>
          <Box variant="p">
            The target encoder still has to improve, or its answers would stay those of an untrained network. It
            follows the context encoder at a distance, as an EMA (exponential moving average): a running average
            in which recent values count most and old ones fade. Let <code>m</code>, the momentum, be a number
            just under 1; V-JEPA 2 holds it at 0.99925 for the whole run. After every optimiser step, each target
            weight becomes:
          </Box>
          <Formula>{'theta-bar <- m * theta-bar + (1 - m) * theta'}</Formula>
          <ul style={LIST}>
            <li>
              <code>m * theta-bar</code> keeps almost all of the old target weight.
            </li>
            <li>
              <code>(1 - m) * theta</code> mixes in a sliver of the encoder&apos;s current weight: 1 - 0.99925 =
              0.00075, which is 0.075%.
            </li>
          </ul>
          <Box variant="p">
            One weight with toy values (an illustration): the target holds <Toy>0.5000</Toy> and the encoder has
            moved to <Toy>0.9000</Toy>. After one update the target is 0.99925 x <Toy>0.5000</Toy> + 0.00075 x{' '}
            <Toy>0.9000</Toy> = <Toy>0.499625</Toy> + <Toy>0.000675</Toy> = <Toy>0.5003</Toy>. The gap was{' '}
            <Toy>0.4</Toy> and the target closed <Toy>0.0003</Toy> of it, which is 0.075%. At that pace the target
            is an average over roughly 1 / 0.00075 = 1,333 recent steps, and it needs about <Derived>924</Derived>{' '}
            steps to close half of any gap (our arithmetic: <Derived>ln 0.5 / ln 0.99925</Derived>).{' '}
            <Cite id="F03-8">vjepa2 app/vjepa/train.py, lines 471 to 480, and the config&apos;s ema setting</Cite>
          </Box>
          <Box variant="p">
            One clip, two kinds of update: the loss changes <code>theta</code> and <code>phi</code> by gradient,
            and <code>theta-bar</code> trails <code>theta</code> by averaging. The figure plays the step.
          </Box>
          <AnimatedFigure
            name="one JEPA training step"
            steps={TRAIN_STEPS}
            intervalMs={3400}
            cites="F03-2 F03-8"
            caption={
              <>
                Green boxes are trained by the loss; the grey box is the target encoder, which only follows.
                Illustrative layout: the token grid is drawn small, and a real clip hides a larger share of its
                tokens.
              </>
            }
          >
            {(step, reduced) => <TrainStep step={step} reduced={reduced} />}
          </AnimatedFigure>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="The shortcut that zeroes the loss, and the five ways a JEPA is kept off it">
            Collapse, and how to block it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Collapse is the loophole from the idea block. Suppose the encoder outputs the same vector for every
            input, all zeros say. The target latents are then all zeros, the predictor learns to output zeros, and
            the loss is 0 on every clip. Training has succeeded by its own measure, and the block in the cup has
            the same latent as the block on the table. A model that predicts pixels has no such exit, because its
            targets are fixed by the camera. A JEPA writes its own.{' '}
            <Cite id="F03-63">V-JEPA paper, section 3.1, and LeWorldModel paper, section 1</Cite>
          </Box>
          <Box variant="p">
            It comes in two degrees. In complete collapse every input lands on nearly one point. In dimensional
            collapse the latents differ and all lie in a thin slice of the space: of the 1408 numbers in each
            vector, most carry nothing. The second is harder to notice, because the latents do vary.{' '}
            <Cite id="F03-64">LeJEPA paper, section 2</Cite>
          </Box>
          <Figure
            cites="F03-63 F03-64"
            caption={
              <>
                Each dot is the latent of one input, drawn in two of its dimensions. Illustrative, not measured.
              </>
            }
          >
            <CollapseDiagram />
          </Figure>
          <Box variant="p">Five ways to block it are on record. Three shape the models in this section.</Box>

          <Box variant="h3">1. A slow target behind a stop-gradient</Box>
          <Box variant="p">
            This is the training step you just followed. For the shortcut to work, guess and answer have to
            drift to the same constant together. The stop-gradient
            takes away the answer&apos;s reason to move: no gradient pulls <code>theta-bar</code> toward the
            guess. The EMA takes away its speed: 0.075% of the way per step.
          </Box>
          <Box variant="p">
            Why that is enough is a hypothesis, and the V-JEPA authors state it as one: the slow target ensures
            that the predictor evolves faster than the encoder and stays close to optimal, and that prevents
            collapse.{' '}
            <Cite id="F03-65">V-JEPA paper, section 3.1</Cite> The price is a second encoder in memory and an
            argument that rests on practice: the LeWorldModel authors object that the pair does not &quot;in
            general correspond to the minimization of a well-defined objective&quot;.{' '}
            <Cite id="F03-66">LeWorldModel paper, section 2</Cite>
          </Box>

          <Box variant="h3">2. Variance and covariance terms</Box>
          <Box variant="p">
            The second way adds loss terms that measure the spread of a batch of latents directly. It comes from
            VICReg (2022, named after its three terms: variance, invariance, covariance), a method for training
            image encoders that is history here.
          </Box>
          <Box variant="p">
            Picture a batch of latents as a table, one row per input and one column per dimension. A column that
            holds the same value in every row has collapsed. Two columns that always move together are one column
            stored twice. The symbols: <code>Z</code> and <code>Z&apos;</code> are two batches of latents that
            should match row by row. <code>s</code> is the invariance term, the mean squared distance between
            matching rows. <code>v</code> is the variance term: zero while the standard deviation of every column
            stays above a threshold, and growing when one falls below. <code>c</code> is the covariance term,
            which grows with the covariance between any two different columns. <code>lambda</code>,{' '}
            <code>mu</code> and <code>nu</code> are three weights.
          </Box>
          <Formula>{"l(Z, Z') = lambda s(Z, Z') + mu [v(Z) + v(Z')] + nu [c(Z) + c(Z')]"}</Formula>
          <Box variant="p">
            <Cite id="F03-67">VICReg paper, abstract and equation 6</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <code>s</code> is the pull that makes matching latents agree. Alone, it is the shortcut.
            </li>
            <li>
              <code>v</code> blocks complete collapse: a constant column has a standard deviation of 0.
            </li>
            <li>
              <code>c</code> blocks dimensional collapse: columns that move together have a high covariance.
            </li>
          </ul>
          <Box variant="p">
            Three toy batches of four latents with two numbers each (an illustration). In (3, 3), (3, 3), (3, 3),
            (3, 3) neither column varies, so <code>v</code> is large. In (1, 1), (2, 2), (3, 3), (4, 4) both
            columns vary and the second copies the first, so <code>c</code> is large. In (1, 2), (2, 4), (3, 1),
            (4, 3) both vary and their covariance works out to 0, so both terms are satisfied.
          </Box>
          <Box variant="p">
            The price is tuning: the LeWorldModel authors count a seven-term loss with six tunable coefficients in
            PLDM, a JEPA world model that trains its encoder this way.{' '}
            <Cite id="F03-68">LeWorldModel paper, abstract and section 4.1</Cite>
          </Box>

          <Box variant="h3">3. Shape the whole distribution: SIGReg</Box>
          <Box variant="p">
            The third way replaces the separate spread terms with one target shape. SIGReg (Sketched Isotropic
            Gaussian Regularization) pushes the batch&apos;s cloud of latents toward an isotropic Gaussian: a round
            bell-shaped cloud with the same spread in every direction and no correlation between dimensions.{' '}
            <Cite id="F03-69">LeJEPA paper, abstract</Cite> Neither a single point nor a flat slice is that cloud,
            so one term answers both degrees of collapse (our reading).
          </Box>
          <Box variant="p">
            The model that uses it here is LeWorldModel (LeWM), a JEPA world model of about 15M parameters. Its
            one encoder is trained together with the predictor and turns each frame into a single vector of 192
            numbers. It has no target copy and no stop-gradient.{' '}
            <Cite id="F03-31">LeWorldModel paper, abstract</Cite>{' '}
            <Cite id="F03-32">LeWorldModel paper, section 3.1</Cite>{' '}
            <Cite id="F03-35">le-wm train.py, lines 27 to 41</Cite>
          </Box>
          <Box variant="p">
            Checking the shape of a cloud in that many dimensions directly is expensive, so SIGReg checks its
            shadows. It projects every latent in the batch onto random directions, which leaves a plain list of
            numbers per direction, and tests whether each list looks like draws from a standard bell curve. If
            every shadow is Gaussian, so is the cloud (the Cramer-Wold theorem).{' '}
            <Cite id="F03-39">LeWorldModel paper, section 3.1</Cite>
          </Box>
          <Box variant="p">
            The symbols of the loss: <code>z_t</code> is the latent of frame <code>t</code>, <code>a_t</code> the
            action taken at that frame, <code>pred_phi</code> the predictor and <code>z-hat_t+1</code> its guess
            for the next frame&apos;s latent. <code>Z</code> is all the latents in the batch and{' '}
            <code>lambda</code> a single weight. The double bars with two 2s are the squared L2 distance:
            subtract entry by entry, square, add up.
          </Box>
          <Formula>{'z-hat_t+1 = pred_phi(z_t, a_t)'}</Formula>
          <Formula>{'L_pred = || z-hat_t+1 - z_t+1 ||_2^2'}</Formula>
          <Formula>{'L_LeWM = L_pred + lambda SIGReg(Z)'}</Formula>
          <Box variant="p">
            <Cite id="F03-36">LeWorldModel paper, section 3.1, equations 1 to 3</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <code>L_pred</code> is the JEPA pull: the predicted and the actual next latent should agree. Alone,
              it collapses.
            </li>
            <li>
              <code>SIGReg(Z)</code> is large when the batch&apos;s latents fail the bell-curve test along the
              sampled directions. A collapsed batch fails it badly.
            </li>
            <li>
              <code>lambda</code> sets the exchange rate between the two, and it is the only loss weight.
            </li>
          </ul>
          <Box variant="p">
            The paper gives lambda = 0.1 with 1,024 random directions. The released training config sets the
            weight to 0.09, with 1,024 projections each tested at 17 points (the config calls them knots). The
            gap matters little by the authors&apos; own test of other values: on Push-T, a simulated 2D pushing task, they
            report success above 80% for any lambda between 0.01 and 0.2.{' '}
            <Cite id="F03-36">LeWorldModel paper, section 3.1</Cite>{' '}
            <Cite id="F03-37">le-wm config/train/lewm.yaml, lines 17 to 43</Cite>{' '}
            <Cite id="F03-46">LeWorldModel paper, appendix G</Cite> The limit the authors state: the regulariser
            weakens in very simple environments whose data has little variety.{' '}
            <Cite id="F03-45">LeWorldModel paper, section 6</Cite>
          </Box>
          <ExpandableSection headerText="How SIGReg tests one direction, from the released code">
            <SpaceBetween size="s">
              <Box variant="p">
                Take one random direction, and let <code>p_n</code> be the shadow of the <code>n</code>-th latent
                of the batch on it. A distribution has a fingerprint, its characteristic function. For a batch it
                is estimated by two averages, <code>mean_n cos(t p_n)</code> and <code>mean_n sin(t p_n)</code>,
                at a chosen value <code>t</code>. For a standard Gaussian the fingerprint is{' '}
                <code>exp(-t^2 / 2)</code> for the cosine part and 0 for the sine part. The error at one{' '}
                <code>t</code> is:
              </Box>
              <Formula>{'(mean_n cos(t p_n) - exp(-t^2 / 2))^2 + (mean_n sin(t p_n))^2'}</Formula>
              <Box variant="p">
                The first bracket is how far the batch&apos;s cosine average is from the Gaussian&apos;s; the second
                is how far its sine average is from zero. The code evaluates this at 17 values of <code>t</code>{' '}
                from 0 to 3, weights and sums them, scales by the batch size, and averages over the 1,024
                directions.{' '}
                <Cite id="F03-38">le-wm module.py, lines 10 to 36</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Box variant="h3">4 and 5. Two more on record</Box>
          <Box variant="p">
            <strong>Contrastive negatives (history).</strong> Older joint-embedding methods add a term that pushes
            apart the latents of different inputs, called negatives. The position paper that defined JEPA argues
            against it, because the number of negatives needed grows with the dimension of the latent.{' '}
            <Cite id="F03-70">I-JEPA paper, section 2, and the position paper, section 4.3</Cite>
          </Box>
          <Box variant="p">
            <strong>A frozen pretrained encoder.</strong> If the encoder&apos;s weights do not change while the
            predictor trains, there is nothing to collapse: the targets are fixed, as a camera&apos;s pixels are.
            This is how V-JEPA 2-AC, the action-conditioned model in the next block, avoids the issue. The price
            is that the latent is whatever pretraining kept.{' '}
            <Cite id="F03-71">LeWorldModel paper, section 2, and V-JEPA 2 paper, section 5</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="What the predictor takes in once actions are added, and which four models to know in November 2026">
            The line of models
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            So far no action has appeared, and a world model needs one. V-JEPA 2 adds it in a second stage. Stage
            one is the pretraining above, on over 1 million hours of internet video. Stage two freezes that
            encoder and trains a new predictor, V-JEPA 2-AC (the AC stands for action-conditioned), on under 62
            hours of robot video. Video teaches how the world moves, and a little robot data teaches what actions
            do.{' '}
            <Cite id="F03-1">V-JEPA 2 paper, abstract</Cite>
          </Box>
          <Box variant="p">
            The new predictor is a transformer of about 300M parameters, with 24 layers and vectors of 1024
            numbers.{' '}
            <Cite id="F03-14">V-JEPA 2 paper, section 3.1</Cite> For each time step, which is one frame, it takes
            in three things:
          </Box>
          <ul style={LIST}>
            <li>
              one <strong>action token</strong>: 7 numbers, the change in the gripper&apos;s pose between this
              frame and the next. This is the end-effector action from section 3; the {ARM} records joint targets
              instead;
            </li>
            <li>
              one <strong>state token</strong>: 7 numbers for the gripper&apos;s pose now (3 for position, 3 for
              orientation, 1 for the gripper opening);
            </li>
            <li>
              the <strong>frame&apos;s latent</strong>: a 16 x 16 grid of vectors from the frozen encoder, 1408
              numbers each.
            </li>
          </ul>
          <Box variant="p">
            That is 1 + 1 + 256 = 258 tokens per time step, and the output is the predicted 16 x 16 grid for the
            next frame.{' '}
            <Cite id="F03-15">V-JEPA 2 paper, section 3.1</Cite>{' '}
            <Cite id="F03-16">vjepa2 ac_predictor.py, lines 141 to 153</Cite> Training compares that grid with the
            frozen encoder&apos;s grid for the real next frame, by L1 distance again, and a second loss term
            feeds the predictor its own output for one more step, as planning will.{' '}
            <Cite id="F03-18">V-JEPA 2 paper, section 3.1, equations 2 to 4</Cite>
          </Box>
          <Box variant="p">
            Before V-JEPA 2 came the position paper that defined the JEPA, then I-JEPA (2023) on images and V-JEPA
            (2024) on video; all three are history here.{' '}
            <Cite id="F03-54">I-JEPA paper, section 3</Cite> <Cite id="F03-59">V-JEPA paper, section 3.2</Cite>{' '}
            After it, three models complete the line:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>V-JEPA 2.1</strong> (released 2026-03-16). A new training recipe and a larger ViT-G encoder of
              2B parameters. With the same 300M predictor recipe and unchanged planning settings, the authors
              report cup grasping rising from 60% to 70% over 10 trials: a better encoder made a better robot.{' '}
              <Cite id="F03-72">vjepa2 README, V-JEPA 2.1 release notes</Cite>{' '}
              <Cite id="F03-73">V-JEPA 2.1 paper, Table 6</Cite>
            </li>
            <li>
              <strong>RoboJEPA</strong> (7 Oct 2026). The V-JEPA 2-AC recipe scaled up: predictors from 22M to 8B
              parameters on a frozen V-JEPA 2.1 encoder, trained on 15,022 hours of robot video, of which 6,692
              hours carry synchronised actions.{' '}
              <Cite id="F03-75">RoboJEPA paper, abstract and section 2</Cite>{' '}
              <Cite id="F03-76">RoboJEPA paper, section 2.1</Cite>
            </li>
            <li>
              <strong>LeWorldModel.</strong> The small end: about 15M parameters, encoder and predictor trained
              together with the two-term loss above. The authors state that it trains on a single GPU in a few hours, and name no
              GPU.{' '}
              <Cite id="F03-31">LeWorldModel paper, abstract</Cite> Its four tasks are all simulated; the paper
              reports no result on a real robot.{' '}
              <Cite id="F03-42">LeWorldModel paper, section 4.1</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="How a model that only predicts latents ends up choosing a motor command">
            Planning in latent space
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A predictor answers &quot;if I do this, what will the latent be?&quot;. A planner has to ask the
            questions, and it needs a goal. Here the goal is a picture: {GOAL_PHOTO}. The encoder turns it into a
            goal latent, and planning becomes a search for the actions whose predicted latent lands closest to
            it.
          </Box>
          <Box variant="p">
            The symbols: <code>z_k</code> is the latent of the current frame <code>k</code>, and <code>s_k</code>{' '}
            the gripper&apos;s current pose. <code>z_g</code> is the goal latent. <code>a-hat_1:T</code> is a
            candidate sequence of <code>T</code> actions, where <code>T</code> is the planning horizon: how many
            steps the planner looks ahead. <code>P(...)</code> is the predictor run <code>T</code> times, each
            time on its own previous output. The cost of a candidate is its energy:
          </Box>
          <Formula>{'E(a-hat_1:T; z_k, s_k, z_g) := || P(a-hat_1:T; s_k, z_k) - z_g ||_1'}</Formula>
          <Box variant="p">
            <Cite id="F03-23">V-JEPA 2 paper, section 3.2, equation 5</Cite>
          </Box>
          <Box variant="p">
            The left term is the imagined future for this candidate and the right term is where you want to be.
            The L1 distance between them is the training measure reused as a score: a low energy means the
            candidate is predicted to make the scene look like the goal picture. Two ideas turn the score into
            motion.
          </Box>
          <Box variant="p">
            <strong>MPC (model-predictive control)</strong> is the outer loop. It is the standard way to act with
            a model whose predictions hold only a short way ahead: plan a sequence of actions through the model,
            execute just the first part, look at the camera again, and plan afresh from the real frame.{' '}
            <Cite id="F03-112">V-JEPA 2 paper, section 3.2</Cite>
          </Box>
          <Box variant="p">
            <strong>CEM (the cross-entropy method)</strong> is the search inside each plan. It fits when a cost
            can be evaluated and no formula gives the best action, because it needs only forward passes of the
            predictor and no gradient. It keeps a sampling distribution over action sequences, a Gaussian with a
            mean and a spread, and repeats four moves: sample a pool of candidates from it; roll each one through
            the predictor and score it; keep the few with the lowest cost, called the elites; set the mean and the
            spread to those of the elites. After the last round, the mean is the plan.{' '}
            <Cite id="F03-113">LeWorldModel paper, appendix A, Algorithm 2</Cite>
          </Box>
          <Box variant="p">
            One iteration with toy numbers (an illustration; a real action has more than one number). The block
            sits <Toy>10</Toy> cm to the left of the gripper, and the planner searches over a single number, the
            sideways move in cm, negative for left. The distribution starts at mean <Toy>0</Toy> with spread{' '}
            <Toy>5</Toy>.
          </Box>
          <ol style={LIST}>
            <li>
              Sample eight candidates: <Toy>+4, -6, +1, -8, -3, +7, -7, +2</Toy>.
            </li>
            <li>
              Imagine each and score it. In this toy the energy is the distance left to the block:{' '}
              <Toy>14, 4, 11, 2, 7, 17, 3, 12</Toy>.
            </li>
            <li>
              Keep the three lowest: <Toy>-8, -7 and -6</Toy>, with energies <Toy>2, 3 and 4</Toy>.
            </li>
            <li>
              Refit: their mean is <Toy>(-8 - 7 - 6) / 3 = -7</Toy>, and their sample standard deviation is{' '}
              <Toy>1</Toy>.
            </li>
          </ol>
          <Box variant="p">
            The next iteration samples around <Toy>-7</Toy> with spread <Toy>1</Toy>, where this one sampled around{' '}
            <Toy>0</Toy> with spread <Toy>5</Toy>. Each iteration moves the mean toward the block and shrinks the
            spread.
          </Box>
          <Box variant="p">
            The real settings in the V-JEPA 2 robot experiments: 800 samples per iteration, 10 iterations, the top
            10 kept each time, horizon 1.{' '}
            <Cite id="F03-24">V-JEPA 2 paper, appendix B.2</Cite> Each sampled action is limited to about 13 cm of
            gripper travel.{' '}
            <Cite id="F03-28">V-JEPA 2 paper, section 4.2</Cite> The goal has to be an image, and for pick-and-place
            one image is not enough: the authors hand the model three in turn (object grasped, object near the
            target, object placed) on a fixed schedule of 4, 10 and 4 time steps.{' '}
            <Cite id="F03-27">V-JEPA 2 paper, section 4.2</Cite>
          </Box>
          <AnimatedFigure
            name="planning with the cross-entropy method"
            steps={CEM_STEPS}
            intervalMs={3200}
            cites="F03-23 F03-113 F03-24"
            caption={
              <>
                Follow the dots: each is the predicted end of one candidate, and nothing moves on the table until
                step 8. Illustrative, not measured: the positions are drawn by hand, a real latent has far more
                than two dimensions, and the real planner samples 800 candidates where this one draws a few
                dozen.
              </>
            }
          >
            {(step, reduced) => <CemPlanning step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            What this achieves, as the authors report it: on two Franka research arms in labs absent from the training
            data, with 10 trials per task, pick-and-place succeeded 80% of the time with a cup and 65% with a box,
            and grasping 65% and 25%.{' '}
            <Cite id="F03-26">V-JEPA 2 paper, section 4.2, Table 2</Cite>
          </Box>
          <ExpandableSection headerText="RoboJEPA: results on a real arm">
            <Box variant="p">
              On a Franka arm, planning toward one goal image where V-JEPA 2 needed three, the authors report success
              for the 8B model of 67% on grasp, 50% on object lift and 27% on pick-and-place. They give the
              text-conditioned policy pi0.5 as a reference at 5%, 0% and 53%, and call such figures
              &quot;contextual references rather than directly comparable baselines&quot;.{' '}
              <Cite id="F03-78">RoboJEPA paper, section 4.3 and Table 3</Cite>{' '}
              <Cite id="F03-77">RoboJEPA paper, section 2.2</Cite>
            </Box>
          </ExpandableSection>
          <ExpandableSection headerText="If you run the released notebook: its planner defaults differ from the paper">
            <Box variant="p">
              The notebook wrapper in the vjepa2 repository defaults to 400 samples, 10 CEM steps, the top 10 and
              a rollout of 2, and it samples only the x, y, z move and the gripper, leaving rotation at zero. The
              count of predictor passes is the same as the paper&apos;s: 400 x 10 x 2 = 8,000.{' '}
              <Cite id="F03-29">vjepa2 notebooks/utils/world_model_wrapper.py, lines 20 to 29</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Count the predictor passes, then ask which GPU the seconds were measured on">
            What a planned action costs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            CEM pays in forward passes of the predictor, so its bill is a product: samples x iterations x horizon.
            For the V-JEPA 2 settings that is 800 x 10 x 1 = 8,000 predictor passes for every action the arm
            takes, run as 10 batches of 800.{' '}
            <Cite id="F03-24">V-JEPA 2 paper, appendix B.2</Cite> The chart gives the same product for the other
            planners in the line.
          </Box>
          <Figure
            cites="F03-115"
            caption={
              <>
                Each point is samples x iterations x horizon for one published planner, on a log axis: one gridline
                to the right is ten times the passes. The counts are our arithmetic from each paper&apos;s
                settings.
              </>
            }
          >
            <PassesChart />
          </Figure>
          <Box variant="p">
            Passes differ in size. In V-JEPA 2-AC one pass runs a 300M transformer over 258 tokens per frame; in
            LeWorldModel it runs a 10M transformer over 1 to 3 tokens.{' '}
            <Cite id="F03-115">our arithmetic, predictor passes per decision</Cite> So read the count with the
            seconds, and the seconds with the GPU:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>V-JEPA 2-AC, 8,000 passes.</strong> The V-JEPA 2 authors report 16 seconds per action on one
              NVIDIA RTX 4090. The V-JEPA 2.1 paper lists the same settings at 3 seconds per action on a single
              NVIDIA A100. Neither paper explains the gap. Per pass that is 16 s / 8,000 = 2 ms on the RTX 4090
              and 3 s / 8,000 = 0.375 ms on the A100.{' '}
              <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>{' '}
              <Cite id="F03-74">V-JEPA 2.1 paper, Table 6</Cite>{' '}
              <Cite id="F03-118">our arithmetic, time per candidate</Cite>
            </li>
            <li>
              <strong>V-JEPA 2.1 at horizon 8, 36,000 passes</strong> (300 samples, 15 iterations). The authors
              report 14 seconds per action on a single A100.{' '}
              <Cite id="F03-73">V-JEPA 2.1 paper, Table 6</Cite> <Cite id="F03-74">V-JEPA 2.1 paper, Table 6 caption</Cite>
            </li>
            <li>
              <strong>RoboJEPA, 204,800 passes</strong> (4,096 samples, 10 iterations, horizon 5; 15 iterations on
              the first plan). No seconds figure is printed. The authors run the planner on several GPUs at once
              and describe it as &quot;not real-time&quot; and &quot;several seconds&quot;.{' '}
              <Cite id="F03-77">RoboJEPA paper, section 2.2 and Table 13</Cite>
            </li>
            <li>
              <strong>LeWorldModel, 45,000 passes on Push-T</strong> (300 samples, 30 iterations, horizon 5). The
              authors report 0.98 s for a full plan against 47 s for DINO-WM, a latent world model built on a frozen
              pretrained encoder. The GPU is not named.{' '}
              <Cite id="F03-40">LeWorldModel paper, appendix D</Cite>{' '}
              <Cite id="F03-41">LeWorldModel paper, Figure 3</Cite>
            </li>
          </ul>
          <Box variant="p">
            Put the first row on the thread task. The published pick-and-place took 4 + 10 + 4 = 18 planned
            actions. That is 18 x 8,000 = 144,000 predictor passes and 18 x 16 s = 288 s, 4.8 minutes of GPU time
            spent deciding, at the rate reported for the RTX card.{' '}
            <Cite id="F03-27">V-JEPA 2 paper, section 4.2, and our arithmetic</Cite> On section 3&apos;s rate
            ladder this is the planner rung. What the wait buys is a task set by a picture at run time: the
            predictor was trained with no reward, no task label and no success flag.{' '}
            <Cite id="F03-20">V-JEPA 2 paper, section 3.1</Cite>
          </Box>
          <Box variant="p">
            Every pass is transformer arithmetic on the GPU&apos;s tensor cores. The authors list the ways to
            shrink the bill: fewer samples and iterations, more GPUs, a planner that follows gradients through the
            predictor, or a fast policy trained on the planner&apos;s output.{' '}
            <Cite id="F03-116">V-JEPA 2 paper, section 4.2</Cite> Training is a separate bill, taken up in section 15, Training at Three Scales. Pretraining the video encoder is the large item: the authors project
            roughly 60 GPU-years on A100s for ViT-g without their progressive-resolution schedule, which they
            report cuts GPU time 8.4x.{' '}
            <Cite id="F03-12">V-JEPA 2 paper, section 2.2 and Figure 5</Cite>
          </Box>

          <Box variant="h3">Reading the next JEPA paper</Box>
          <Box variant="p">
            You can now take a JEPA paper&apos;s method section in five questions. What is encoded, and into how
            many tokens of what width? What does the predictor take in besides latents: mask tokens, actions,
            state? Which distance is the loss? Which of the five mechanisms keeps it from collapsing, and does it
            live in the loss, in the update rule or in a frozen encoder? And for the planner: multiply samples by
            iterations by horizon, then look for the seconds and the GPU printed beside them. For V-JEPA 2-AC the
            answers end at 8,000 predictor passes and 16 seconds on one RTX 4090. Cost the next planner the same
            way.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
