import type { CSSProperties } from 'react';
import { EMPHASIS, INK, MUTED, PAPER, T, rnd, useNarrow } from './WmJepaKit';

/**
 * Section 7: planning with the cross-entropy method, in two synchronised panels. Left (top on a
 * phone): latent space, where the imagined ends of the candidates close on the goal. Right: the
 * distribution over actions the planner is fitting, drawn with the toy numbers of the text: a
 * wide bell, eight samples, the three elites, the refit bell.
 */

const ROBOT_INK = '#7a5c00';
const BLOCK_RED = '#b42318';

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

export const JEPA_CEM_STEPS: string[] = [
  'The current camera frame and the goal photo go through the encoder. Each becomes a point in latent space: now, and goal. The action panel shows the one number the toy planner searches over.',
  'Sample many candidate actions from a wide distribution. Each short line is one candidate leaving the present. In the action panel the bell starts at mean 0 with spread 5, and eight ticks are the samples.',
  'The predictor imagines where each candidate ends, in latent space. Each dot is one imagined future. No image is produced and the arm has not moved.',
  'Score each dot by its distance to the goal latent. That distance is the energy; one is drawn as a dashed line.',
  'Keep the few candidates with the lowest energy, the elites, ringed in blue. In the action panel they are the three samples nearest the block. The rest are discarded.',
  'Refit the sampling distribution to the elites: the dashed circle moves toward the goal and narrows, and the bell moves to mean -7 with spread 1.',
  'Repeat sampling, imagining, scoring and refitting. With each iteration the cloud of imagined futures tightens on the goal.',
  'Execute only the first action of the best plan on the arm. Then take a new camera frame and plan again from it.',
];

/** The toy iteration of the text: the block is 10 cm to the left, eight samples, three elites. */
const TOY_BLOCK = -10;
const TOY_SAMPLES = [4, -6, 1, -8, -3, 7, -7, 2];
const TOY_ELITES = [-8, -7, -6];
const TOY_START = { mean: 0, spread: 5 };
const TOY_REFIT = { mean: -7, spread: 1 };

interface PanelProps {
  s: number;
  fs: number;
  show: (on: boolean, level?: number) => CSSProperties;
  reduced: boolean;
}

function LatentPanel({ s, fs, show, reduced }: PanelProps) {
  const moved = s >= 7;
  const halo = { stroke: '#ffffff', strokeWidth: 4, paintOrder: 'stroke' as const };
  const ux = (GOAL.x - NOW.x) / Math.hypot(GOAL.x - NOW.x, GOAL.y - NOW.y);
  const uy = (GOAL.y - NOW.y) / Math.hypot(GOAL.x - NOW.x, GOAL.y - NOW.y);
  return (
    <g>
      {CEM_STATUS.map((label, i) => (
        <T key={label} x={14} y={22} size={fs + 1} bold style={show(s === i + 1)}>
          {label}
        </T>
      ))}
      <rect x="14" y="34" width="372" height="310" fill="#ffffff" stroke={MUTED} strokeWidth="1" />
      <T x={24} y={54} size={fs}>
        latent space, drawn in two dimensions
      </T>

      {/* sampling distributions */}
      <circle cx={NOW.x} cy={NOW.y} r="100" fill="none" stroke={MUTED} strokeWidth="1.5" strokeDasharray="6 5" style={show(s >= 2 && s <= 6, s === 6 ? 0.3 : 1)} />
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
            stroke={MUTED}
            strokeWidth="1.5"
            style={show(s === 2)}
          />
          <line x1={NOW.x} y1={NOW.y} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke={MUTED} strokeWidth="1" style={show(s >= 3 && s <= 6, 0.35)} />
        </g>
      ))}

      {/* the energy of one candidate */}
      <line x1={SCORED.x.toFixed(1)} y1={SCORED.y.toFixed(1)} x2={GOAL.x} y2={GOAL.y} stroke={EMPHASIS} strokeWidth="2" strokeDasharray="4 4" style={show(s === 4)} />
      <T x={376} y={330} anchor="end" size={fs} fill={EMPHASIS} style={show(s === 4)}>
        dashed: one energy
      </T>

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
            <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="4" fill={MUTED} style={show(s >= 3, level)} />
            {elite && <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="7.5" fill="none" stroke={EMPHASIS} strokeWidth="2.5" style={show(s === 5 || s === 6)} />}
          </g>
        );
      })}

      {/* the action that is executed */}
      <g style={show(s === 8)}>
        <line x1={NOW.x} y1={NOW.y} x2={(NOW.x + 58 * ux).toFixed(1)} y2={(NOW.y + 58 * uy).toFixed(1)} stroke={EMPHASIS} strokeWidth="4" />
        <circle cx={(NOW.x + 64 * ux).toFixed(1)} cy={(NOW.y + 64 * uy).toFixed(1)} r="6" fill={EMPHASIS} />
        <T x={24} y={330} size={fs} fill={EMPHASIS}>
          blue: the one action executed
        </T>
      </g>

      {/* now and goal */}
      <circle cx={NOW.x} cy={NOW.y} r="6" fill={ROBOT_INK} stroke="#ffffff" strokeWidth="1.5" />
      <text x={NOW.x} y={NOW.y + 24} textAnchor="middle" fontFamily="sans-serif" fontSize={fs} fontWeight="bold" fill={INK} {...halo}>
        now
      </text>
      <path d={`M${GOAL.x - 8} ${GOAL.y} H${GOAL.x + 8} M${GOAL.x} ${GOAL.y - 8} V${GOAL.y + 8}`} stroke={INK} strokeWidth="2.5" />
      <text x={GOAL.x} y={GOAL.y - 34} textAnchor="middle" fontFamily="sans-serif" fontSize={fs} fontWeight="bold" fill={INK} {...halo}>
        goal
      </text>

      {/* legend */}
      <circle cx="24" cy="362" r="4" fill={MUTED} />
      <T x={36} y={366} size={fs}>
        imagined end of one candidate
      </T>
      <circle cx="24" cy="382" r="4" fill={MUTED} />
      <circle cx="24" cy="382" r="7.5" fill="none" stroke={EMPHASIS} strokeWidth="2.5" />
      <T x={36} y={386} size={fs}>
        kept: lowest energy (an elite)
      </T>
      <line x1="14" y1="404" x2="32" y2="404" stroke={MUTED} strokeWidth="1.5" strokeDasharray="6 5" />
      <T x={36} y={408} size={fs}>
        dashed circle: where the planner samples
      </T>
    </g>
  );
}

/** A bell curve over the action axis, as path data. */
function bell(mean: number, spread: number, px: (v: number) => number, baseY: number, gain: number): string {
  let d = '';
  for (let v = -14; v <= 14.001; v += 0.2) {
    const pdf = Math.exp(-0.5 * ((v - mean) / spread) ** 2) / (spread * Math.sqrt(2 * Math.PI));
    d += `${d === '' ? 'M' : 'L'}${px(v).toFixed(1)} ${(baseY - gain * pdf).toFixed(1)}`;
  }
  return d;
}

function ActionPanel({ s, fs, show, x0, w }: PanelProps & { x0: number; w: number }) {
  const left = x0 + 22;
  const plotW = w - 44;
  const px = (v: number) => left + ((v + 14) / 28) * plotW;
  const baseY = 278;
  const gain = 440;
  const refit = s >= 6;
  return (
    <g>
      <T x={x0} y={22} size={fs + 1} bold>
        The action distribution being fitted
      </T>
      <rect x={x0} y="34" width={w} height="310" fill="#ffffff" stroke={MUTED} strokeWidth="1" />
      <T x={x0 + 10} y={54} size={fs}>
        sideways move in cm, toy values
      </T>

      {/* the two bells */}
      <path d={bell(TOY_START.mean, TOY_START.spread, px, baseY, gain)} fill="none" stroke={MUTED} strokeWidth="2" strokeDasharray="6 5" style={show(s >= 2, refit ? 0.35 : 1)} />
      <T x={px(1.5)} y={baseY - 48} size={fs} fill={MUTED} style={show(s >= 2 && !refit)}>
        start: mean 0, spread 5
      </T>
      <path d={bell(TOY_REFIT.mean, TOY_REFIT.spread, px, baseY, gain)} fill={EMPHASIS} fillOpacity="0.12" stroke={EMPHASIS} strokeWidth="2.4" style={show(refit)} />
      <g style={show(refit)}>
        <T x={px(-4.6)} y={118} size={fs} fill={EMPHASIS} bold>
          refit:
        </T>
        <T x={px(-4.6)} y={118 + fs + 5} size={fs} fill={EMPHASIS}>
          mean -7, spread 1
        </T>
      </g>
      <T x={px(-4.6)} y={118 + 2 * (fs + 5) + 4} size={fs} fill={EMPHASIS} style={show(s === 8)}>
        the plan is this mean
      </T>

      {/* samples */}
      {TOY_SAMPLES.map((v) => {
        const elite = TOY_ELITES.includes(v);
        const level = s >= 5 && !elite ? 0.25 : 1;
        return (
          <g key={v} style={show(s >= 2 && s <= 6, level)}>
            <line x1={px(v)} y1={baseY} x2={px(v)} y2={baseY - 18} stroke={INK} strokeWidth="1.6" />
            <circle cx={px(v)} cy={baseY - 21} r="3.6" fill={INK} />
            {elite && <circle cx={px(v)} cy={baseY - 21} r="7" fill="none" stroke={EMPHASIS} strokeWidth="2.4" style={show(s === 5 || s === 6)} />}
          </g>
        );
      })}

      {/* axis */}
      <line x1={px(-14)} y1={baseY} x2={px(14)} y2={baseY} stroke={INK} strokeWidth="1.5" />
      <g aria-hidden="true">
        {[-10, -5, 0, 5, 10].map((v) => (
          <g key={v}>
            <line x1={px(v)} y1={baseY} x2={px(v)} y2={baseY + 5} stroke={INK} strokeWidth="1.5" />
            <T x={px(v)} y={baseY + 6 + fs} anchor="middle" size={fs}>
              {v > 0 ? `+${v}` : v}
            </T>
          </g>
        ))}
      </g>
      <path d={`M${px(TOY_BLOCK) - 5} ${baseY + 28}h10v10h-10Z`} fill={BLOCK_RED} />
      <T x={px(TOY_BLOCK) + 10} y={baseY + 38} size={fs} fill={BLOCK_RED}>
        the block
      </T>
      <T x={x0 + w - 10} y={baseY + 38} anchor="end" size={fs} fill={MUTED}>
        left is negative
      </T>

      {/* the real settings */}
      <T x={x0} y={366} size={fs} bold>
        The real planner, V-JEPA 2 robot runs:
      </T>
      <T x={x0} y={386} size={fs}>
        800 samples per iteration, 10 iterations,
      </T>
      <T x={x0} y={408} size={fs}>
        the top 10 kept each time, horizon 1
      </T>
    </g>
  );
}

export function JepaCem({ step, reduced }: { step: number; reduced: boolean }) {
  const narrow = useNarrow();
  const s = step + 1;
  const fade = reduced ? 'none' : 'opacity 350ms ease';
  const show = (on: boolean, level = 1): CSSProperties => ({ opacity: on ? level : 0, transition: fade });
  const fs = narrow ? 14 : 12;
  const W = narrow ? 400 : 780;
  const H = narrow ? 856 : 424;
  return (
    <div style={{ maxWidth: narrow ? 560 : 1000, margin: '0 auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="jepa-cem-title" style={{ width: '100%', height: 'auto' }}>
        <title id="jepa-cem-title">Planning with the cross-entropy method: sampled futures narrow onto the goal latent while the action distribution narrows onto the block</title>
        <desc>
          Two panels that move together. The first stands for latent space. A point marked now and a point marked
          goal are fixed. Candidate actions leave the present as short lines, the predictor places a dot where each
          one ends, the dots nearest the goal are kept, the sampling circle shrinks and moves toward the goal, and
          after repeated rounds all dots sit around the goal. A final arrow shows the one action that is executed.
          The second panel is the toy example of the text: the distribution over a sideways move in centimetres
          starts as a wide bell at mean 0 with spread 5, eight samples are drawn, the three nearest the block are
          kept, and the bell is refitted at mean -7 with spread 1.
        </desc>
        <rect x="0" y="0" width={W} height={H} fill={PAPER} />
        <LatentPanel s={s} fs={fs} show={show} reduced={reduced} />
        <g transform={narrow ? 'translate(0, 432)' : 'translate(0, 0)'}>
          <ActionPanel s={s} fs={fs} show={show} reduced={reduced} x0={narrow ? 14 : 404} w={narrow ? 372 : 362} />
        </g>
      </svg>
    </div>
  );
}
