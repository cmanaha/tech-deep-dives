import type { CSSProperties, ReactNode } from 'react';
import { Derived } from '../Cite';
import { log10Scale } from '../../lib/scale';
import { EMPHASIS, INK, MUTED, LINE, PAPER, ROBOT_FILL, ROBOT_INK, T, box, fade, rbox, rnd, useNarrow } from './DemoKit';

/**
 * Section 4, compounding error and chunks: two linked panels on one horizontal axis, the ticks of
 * the section's toy episode (600 ticks, an error rate of 0.001, chunks of 100 actions).
 *
 * Top: the table from above. Fifty demonstrated paths make a band; a policy that decides on every
 * tick slips out of it and the spread of its next step widens; a policy that decides once per
 * chunk lays down six runs and stays inside. Bottom: the ceilings of the bound for the same
 * episode, drawn under the same ticks.
 *
 * Every shape is hand-drawn and the caption says so. The numbers are the toy and derived values of
 * the prose; 50 and 100 come from the register entries the section passes in `cites`.
 */

export const DEMO_DRIFT_STEPS: ReactNode[] = [
  'The table top, seen from overhead. Fifty demonstrations run from the start to the block. Together they cover a band, and the hatched area is everywhere they never went.',
  'A policy that decides on every tick starts down the band. The faint cone ahead of each dot is the spread of where its next step may land. Inside the band the view is familiar and the cone is narrow.',
  'One decision is slightly off (ringed). Two more carry the gripper to the edge of the band. Below, the marker moves along the ceiling of the bound for the ticks played so far.',
  'The gripper is outside the band. The camera view matches no demonstration, so each next step is less certain than the last: the cone widens at every dot, and the ceiling climbs with the square of the ticks.',
  <>
    After <Derived>600</Derived> decisions the gripper closes well away from the block. The ceiling for the episode is{' '}
    <Derived>360</Derived> wrong ticks out of <Derived>600</Derived>.
  </>,
  'Start again with chunks. Each large blue dot is one decision and the ribbon behind it is the 100 actions it commits to, notched every 10. Every decision is still slightly off, and six of them cover the episode.',
  <>
    Six decisions in place of <Derived>600</Derived>. The ceiling ends at <Derived>3.6</Derived> wrong ticks against{' '}
    <Derived>360</Derived>, which is <Derived>100</Derived> times lower, and the chunked path reaches the block.
  </>,
];

interface Geo {
  narrow: boolean;
  W: number;
  H: number;
  x0: number;
  x1: number;
  top: number;
  bottom: number;
  yStart: number;
  yBlock: number;
  half: number;
  dot: number;
  ribbon: number;
  chartTop: number;
  chartBottom: number;
  font: number;
}

const WIDE: Geo = { narrow: false, W: 1040, H: 606, x0: 70, x1: 960, top: 12, bottom: 324, yStart: 215, yBlock: 85, half: 32, dot: 4.5, ribbon: 9, chartTop: 374, chartBottom: 554, font: 13 };
const PHONE: Geo = { narrow: true, W: 320, H: 580, x0: 34, x1: 288, top: 62, bottom: 232, yStart: 194, yBlock: 104, half: 17, dot: 3, ribbon: 6, chartTop: 304, chartBottom: 454, font: 12 };

const TICKS = 600;
const EPS = 0.001;
const DOTS = 25;
const DECISIONS = 6;

const smooth = (u: number) => u * u * (3 - 2 * u);
const env = (u: number) => 0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, Math.max(0, u))) ** 0.7;

/** Fifty hand-made paths: one smooth reach plus smooth noise, as offsets in band half-widths. */
const SAMPLES = 40;
const DEMOS = Array.from({ length: 50 }, (_, i) => {
  const a = (rnd(i, 1) + rnd(i, 2) - 1) * 0.85;
  const f = 1 + rnd(i, 3) * 1.5;
  const ph = rnd(i, 4) * Math.PI * 2;
  return Array.from({ length: SAMPLES + 1 }, (_, k) => Math.max(-1, Math.min(1, a + 0.15 * Math.sin(2 * Math.PI * f * (k / SAMPLES) + ph))));
});

/** How far each drawn single-step decision sits from the band centre, in band half-widths. */
const GREY = [0.05, -0.08, 0.06, -0.05, 0.08, -0.04, 0.07, 0.1, 0.38, 0.62, 0.95, 1.4, 1.85, 2.3, 2.75, 3.15, 3.5, 3.85, 4.15, 4.45, 4.7, 4.95, 5.2, 5.4, 5.6];
/** Half-angle of the cone ahead of each dot, in degrees: narrow inside the band, doubling outside. */
const CONE = GREY.map((_, i) => (i <= 9 ? 7 : i === 10 ? 10 : Math.min(70, 14 * 2 ** (i - 11))));
/** Last dot drawn at each step. */
const SHOWN = [-1, 7, 10, 15, 24, 24, 24];
/** Where each chunked decision starts, in band half-widths. */
const CHUNK_OFF = [0, 0.42, -0.38, 0.34, -0.3, 0.26, 0];

const HALO: CSSProperties = { paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: 4, strokeLinejoin: 'round' };

export function DemoDrift({ step, reduced }: { step: number; reduced: boolean }) {
  const narrow = useNarrow();
  const g = narrow ? PHONE : WIDE;
  const s = step + 1;
  const xAt = (u: number) => g.x0 + u * (g.x1 - g.x0);
  const centre = (u: number) => g.yStart + (g.yBlock - g.yStart) * smooth(u);
  const f = (on: boolean, level = 1) => fade(on, reduced, level);

  /* the band and the fifty paths */
  const us = Array.from({ length: SAMPLES + 1 }, (_, k) => k / SAMPLES);
  const bandTop = us.map((u, k) => `${k === 0 ? 'M' : 'L'}${xAt(u).toFixed(1)} ${(centre(u) - env(u) * g.half - 2).toFixed(1)}`).join('');
  const bandBottom = [...us].reverse().map((u) => `L${xAt(u).toFixed(1)} ${(centre(u) + env(u) * g.half + 2).toFixed(1)}`).join('');
  const demoPaths = DEMOS.map((offs) => offs.map((o, k) => `${k === 0 ? 'M' : 'L'}${xAt(us[k]).toFixed(1)} ${(centre(us[k]) + o * env(us[k]) * g.half).toFixed(1)}`).join(''));

  /* the single-step run */
  const dots = GREY.map((o, i) => ({ x: xAt(i / (DOTS - 1)), y: centre(i / (DOTS - 1)) + o * g.half }));
  const cones = dots.slice(0, DOTS - 1).map((p, i) => {
    const q = dots[i + 1];
    const len = Math.hypot(q.x - p.x, q.y - p.y) * 0.94;
    const th = Math.atan2(q.y - p.y, q.x - p.x);
    const al = (CONE[i] * Math.PI) / 180;
    const ax = p.x + len * Math.cos(th - al);
    const ay = p.y + len * Math.sin(th - al);
    const bx = p.x + len * Math.cos(th + al);
    const by = p.y + len * Math.sin(th + al);
    return `M${p.x.toFixed(1)} ${p.y.toFixed(1)}L${ax.toFixed(1)} ${ay.toFixed(1)}A${len.toFixed(1)} ${len.toFixed(1)} 0 0 1 ${bx.toFixed(1)} ${by.toFixed(1)}Z`;
  });
  const shown = SHOWN[step] ?? 24;
  const greyLevel = s >= 6 ? 0.28 : 1;

  /* the chunked run */
  const chunks = Array.from({ length: DECISIONS }, (_, j) => {
    const ua = j / DECISIONS + 0.004;
    const ub = (j + 1) / DECISIONS - 0.014;
    const at = (u: number) => {
      const w = (u - j / DECISIONS) * DECISIONS;
      return { x: xAt(u), y: centre(u) + (CHUNK_OFF[j] + w * (CHUNK_OFF[j + 1] - CHUNK_OFF[j])) * g.half * 0.9 };
    };
    const pts = Array.from({ length: 11 }, (_, n) => at(ua + ((ub - ua) * n) / 10));
    return {
      d: pts.map((p, n) => `${n === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(''),
      notches: pts.slice(1, 10).map((p) => `M${p.x.toFixed(1)} ${(p.y - g.ribbon / 2).toFixed(1)}v${g.ribbon}`).join(''),
      head: pts[0],
    };
  });

  /* the chart under the same ticks */
  const xT = (t: number) => g.x0 + (t / TICKS) * (g.x1 - g.x0);
  const logY = log10Scale(0.01, 1000, g.chartBottom, g.chartTop);
  const yV = (v: number) => (narrow ? logY(Math.max(v, 0.004)) : g.chartBottom - (v / 360) * (g.chartBottom - g.chartTop - 12));
  const ts = Array.from({ length: 150 }, (_, k) => 4 + (k * (TICKS - 4)) / 149);
  const parabola = ts.map((t, k) => `${k === 0 ? 'M' : 'L'}${xT(t).toFixed(1)} ${yV(t * t * EPS).toFixed(1)}`).join('');
  const straight = `M${xT(narrow ? 10 : 0).toFixed(1)} ${yV(narrow ? 0.01 : 0).toFixed(1)}L${xT(TICKS)} ${yV(TICKS * EPS).toFixed(1)}`;
  let stairs = `M${xT(0)} ${yV(0.1).toFixed(1)}`;
  for (let d = 1; d <= DECISIONS; d += 1) stairs += `V${yV(d * d * 0.1).toFixed(1)}H${xT(d * 100).toFixed(1)}`;
  const markT = [0, 175, 250, 375, 600, 600, 600][step] ?? 600;
  const move = (x: number, y: number): CSSProperties => ({ transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`, transition: reduced ? 'none' : 'transform 350ms ease' });
  const yTicks = narrow ? [0.01, 0.1, 1, 10, 100] : [0, 120, 240, 360];
  const xTicks = narrow ? [0, 200, 400, 600] : [0, 100, 200, 300, 400, 500, 600];

  const blockSize = narrow ? 12 : 16;
  const end = dots[DOTS - 1];
  const tagLine = [
    '',
    '600 decisions, one per tick; every 25th is a dot',
    'ringed: a small error, still inside the band',
    'outside the band the spread widens at every step',
    'the gripper closes well away from the block',
    'blue: one decision commits to 100 actions',
    'six decisions, and the path reaches the block',
  ];

  return (
    <svg viewBox={`0 0 ${g.W} ${g.H}`} role="img" aria-labelledby="demonstrations-drift-title" style={{ width: '100%', height: 'auto' }}>
      <title id="demonstrations-drift-title">A policy that decides on every tick drifts out of the demonstrated band; one that decides once per chunk stays inside, and the ceiling on its errors is 100 times lower</title>
      <desc data-num="derived">
        Two panels share one horizontal axis, the 600 ticks of a toy episode. The top panel is a table seen from above:
        fifty demonstrated paths run from a start point to a block and form a band, and the area outside the band is
        hatched. A grey run of single decisions follows the band, slips to its edge, leaves it and ends far from the
        block, with a cone ahead of each dot that widens once the run is outside. A blue run of six chunks stays inside
        the band and reaches the block. The bottom panel plots the ceiling on wrong ticks: a parabola reaching 360 for
        one action per decision, a straight line reaching 0.6 if mistakes did not feed each other, and a staircase
        reaching 3.6 for chunks of 100 actions.
      </desc>
      <defs>
        <pattern id="demonstrations-drift-hatch" patternUnits="userSpaceOnUse" width="9" height="9" patternTransform="rotate(45)">
          <path d="M0 0v9" stroke="#d6dbe1" strokeWidth="2.4" />
        </pattern>
        <clipPath id="demonstrations-drift-plot">
          <path d={box(g.x0, g.chartTop, g.x1 - g.x0, g.chartBottom - g.chartTop)} />
        </clipPath>
      </defs>
      <rect x="0" y="0" width={g.W} height={g.H} fill={PAPER} />

      {/* ---- the table from above ---- */}
      <path d={rbox(8, g.top, g.W - 16, g.bottom - g.top, 6)} fill="#f7f8fa" stroke="#d5dbdb" strokeWidth="1" />
      <path d={rbox(8, g.top, g.W - 16, g.bottom - g.top, 6)} fill="url(#demonstrations-drift-hatch)" />
      <g style={f(true)}>
        <path d={`${bandTop}${bandBottom}Z`} fill={ROBOT_FILL} stroke="#e3cf8a" strokeWidth="1" />
        {demoPaths.map((d) => (
          <path key={d.slice(0, 60)} d={d} fill="none" stroke={ROBOT_INK} strokeWidth={narrow ? 0.7 : 0.9} opacity="0.3" />
        ))}
      </g>

      {/* legend of the band */}
      {narrow ? (
        <g>
          <path d="M14 14h22M14 18h22M14 10h22" stroke={ROBOT_INK} strokeWidth="1" opacity="0.6" />
          <T x={42} y={18} size={12}>
            50 demonstrated paths (hand-drawn)
          </T>
          <path d={box(14, 28, 22, 12)} fill="#f7f8fa" stroke={LINE} strokeWidth="1" />
          <path d={box(14, 28, 22, 12)} fill="url(#demonstrations-drift-hatch)" />
          <T x={42} y={38} size={12}>
            hatched: no demonstration went here,
          </T>
          <T x={42} y={54} size={12}>
            so the policy has no data for this view
          </T>
        </g>
      ) : (
        <g>
          <path d={rbox(84, 20, 560, 50, 4)} fill="#ffffff" opacity="0.88" />
          <path d="M96 36h26M96 40h26M96 32h26" stroke={ROBOT_INK} strokeWidth="1" opacity="0.6" />
          <T x={132} y={41}>
            50 demonstrated paths from the start to the block (hand-drawn)
          </T>
          <path d={box(96, 50, 26, 13)} fill="#f7f8fa" stroke={LINE} strokeWidth="1" />
          <path d={box(96, 50, 26, 13)} fill="url(#demonstrations-drift-hatch)" />
          <T x={132} y={61}>
            hatched: no demonstration went here, so the policy has no data for what it sees
          </T>
        </g>
      )}

      {/* start and block */}
      <circle cx={g.x0} cy={g.yStart} r={narrow ? 4 : 5.5} fill={ROBOT_INK} />
      {narrow ? (
        <T x={g.x0} y={g.yStart + 26} size={12} anchor="middle" style={HALO}>
          start
        </T>
      ) : (
        <T x={g.x0 - 12} y={g.yStart + 5} anchor="end" style={HALO}>
          start
        </T>
      )}
      <path d={box(g.x1 - blockSize / 2, g.yBlock - blockSize / 2, blockSize, blockSize)} fill="#ffffff" stroke={ROBOT_INK} strokeWidth="1.8" />
      {narrow ? (
        <T x={g.x1} y={g.yBlock - 16} size={12} anchor="middle" style={HALO}>
          block
        </T>
      ) : (
        <T x={g.x1 + 16} y={g.yBlock + 5} style={HALO}>
          block
        </T>
      )}

      {/* the single-step run: cone, segment, dot */}
      {cones.map((d, i) => (
        <path key={d} d={d} fill={MUTED} style={f(i <= shown, 0.24 * (s >= 6 ? 0.35 : 1))} />
      ))}
      {dots.map((p, i) => (
        <g key={`${p.x.toFixed(1)}`} style={f(i <= shown, greyLevel)}>
          {i > 0 && <line x1={dots[i - 1].x} y1={dots[i - 1].y} x2={p.x} y2={p.y} stroke={MUTED} strokeWidth={narrow ? 1.2 : 1.6} />}
          <circle cx={p.x} cy={p.y} r={g.dot} fill={MUTED} stroke="#ffffff" strokeWidth="0.8" />
        </g>
      ))}
      <circle cx={dots[8].x} cy={dots[8].y} r={g.dot + 5} fill="none" stroke={EMPHASIS} strokeWidth="2.4" style={f(s === 3)} />
      <path
        d={`M${end.x - 7} ${end.y - 7}l14 14M${end.x + 7} ${end.y - 7}l-14 14`}
        stroke="#b42318"
        strokeWidth="2.4"
        fill="none"
        style={f(s >= 5, s >= 6 ? 0.4 : 1)}
      />

      {/* the chunked run: ribbon of 100 actions behind each decision */}
      {chunks.map((c, j) => (
        <g key={c.d} style={{ ...f(s >= 6), transitionDelay: reduced ? '0ms' : `${j * 40}ms` }}>
          <path d={c.d} fill="none" stroke={EMPHASIS} strokeWidth={g.ribbon} strokeLinecap="butt" strokeLinejoin="round" />
          <path d={c.notches} stroke="#ffffff" strokeWidth={narrow ? 0.8 : 1.2} fill="none" />
          <circle cx={c.head.x} cy={c.head.y} r={g.dot + 2.5} fill={EMPHASIS} stroke="#ffffff" strokeWidth="1.6" />
        </g>
      ))}

      {/* tags */}
      {narrow ? (
        tagLine.map((t, i) =>
          t === '' ? null : (
            <T key={t} x={g.x0 - 20} y={g.bottom + 20} size={12} num={i === 1 || i === 5 ? 'toy' : undefined} style={f(step === i)}>
              {t}
            </T>
          ),
        )
      ) : (
        <g>
          <g style={f(s >= 2)}>
            <circle cx={96} cy={264} r={g.dot} fill={MUTED} />
            <T x={110} y={269} num="derived" style={HALO}>
              one decision per tick: 600 in the episode, every 25th drawn as a dot
            </T>
          </g>
          <T x={dots[8].x} y={centre(8 / 24) + env(8 / 24) * g.half + 22} anchor="middle" style={{ ...HALO, ...f(s === 3) }}>
            a small error
          </T>
          <T x={640} y={293} anchor="end" style={{ ...HALO, ...f(s === 4) }}>
            outside the band the cone widens at every step
          </T>
          <T x={end.x - 16} y={end.y + 38} anchor="end" style={{ ...HALO, ...f(s === 5) }}>
            the gripper closes here, well away from the block
          </T>
          <g style={f(s >= 6)}>
            <path d="M88 288h30" stroke={EMPHASIS} strokeWidth={g.ribbon} />
            <circle cx={90} cy={288} r={g.dot + 2.5} fill={EMPHASIS} stroke="#ffffff" strokeWidth="1.6" />
            <T x={126} y={293} style={HALO}>
              one decision commits to a chunk of 100 actions: six decisions cover the episode
            </T>
          </g>
        </g>
      )}

      {/* ---- the ceiling of the bound, under the same ticks ---- */}
      {narrow ? (
        <g>
          <T x={14} y={274} size={12} bold>
            Ceiling on wrong ticks, toy episode
          </T>
          <T x={14} y={290} size={12} num="toy" fill={MUTED}>
            log scale; error rate ε = 0.001 (an illustration)
          </T>
        </g>
      ) : (
        <T x={g.x0} y={g.chartTop - 16} bold num="toy">
          Ceiling on wrong ticks for the toy episode, from the bound above (ε = 0.001, an illustration)
        </T>
      )}
      <path d={box(g.x0, g.chartTop, g.x1 - g.x0, g.chartBottom - g.chartTop)} fill="#ffffff" stroke="none" />
      {yTicks.map((v) => (
        <g key={v}>
          <path d={`M${g.x0} ${yV(v).toFixed(1)}H${g.x1}`} stroke="#e4e8ec" strokeWidth="1" />
          <T x={g.x0 - 6} y={yV(v) + 4} size={12} anchor="end" num="derived" fill={MUTED}>
            {String(v)}
          </T>
        </g>
      ))}
      {xTicks.map((t) => (
        <g key={t}>
          <path d={`M${xT(t)} ${g.chartBottom}v5`} stroke={MUTED} strokeWidth="1.2" />
          <T x={xT(t)} y={g.chartBottom + 19} size={12} anchor="middle" num="toy" fill={MUTED}>
            {String(t)}
          </T>
        </g>
      ))}
      <path d={`M${g.x0} ${g.chartTop}V${g.chartBottom}H${g.x1}`} fill="none" stroke={MUTED} strokeWidth="1.4" />
      <T x={(g.x0 + g.x1) / 2} y={g.chartBottom + 38} size={g.font} anchor="middle">
        ticks into the toy episode
      </T>
      {!narrow && (
        <T x={22} y={(g.chartTop + g.chartBottom) / 2} anchor="middle" transform={`rotate(-90 22 ${(g.chartTop + g.chartBottom) / 2})`}>
          wrong ticks allowed
        </T>
      )}

      <g clipPath="url(#demonstrations-drift-plot)">
        <path d={straight} fill="none" stroke={MUTED} strokeWidth="1.6" strokeDasharray="6 4" style={f(s >= 2)} />
        <path d={parabola} fill="none" stroke={MUTED} strokeWidth="2.4" style={f(s >= 2)} />
        <path d={stairs} fill="none" stroke={EMPHASIS} strokeWidth="2.6" style={f(s >= 6)} />
      </g>

      {/* playhead through both panels, and the marker on the parabola */}
      <g style={f(s >= 2 && s <= 5)}>
        <path d={`M0 ${g.top + 4}V${g.chartBottom}`} stroke={LINE} strokeWidth="1" strokeDasharray="3 4" style={move(xT(markT), 0)} />
      </g>
      <circle cx={0} cy={0} r={narrow ? 4.5 : 5.5} fill={MUTED} stroke="#ffffff" strokeWidth="1.6" style={{ ...move(xT(markT), yV(markT * markT * EPS)), opacity: s >= 2 ? 1 : 0 }} />
      <circle cx={xT(TICKS)} cy={yV(3.6)} r={narrow ? 4.5 : 5.5} fill={EMPHASIS} stroke="#ffffff" strokeWidth="1.6" style={f(s >= 6)} />

      {/* end values */}
      <T x={g.x1 + 8} y={yV(360) + 4} size={g.font} bold num="derived" fill={INK} style={f(s >= 5)}>
        360
      </T>
      {narrow ? (
        <g>
          <T x={g.x1 + 8} y={yV(3.6) + 4} size={12} bold num="derived" fill={EMPHASIS} style={f(s >= 6)}>
            3.6
          </T>
          <T x={g.x1 + 8} y={yV(0.6) + 4} size={12} num="derived" fill={MUTED} style={f(s >= 2)}>
            0.6
          </T>
        </g>
      ) : (
        <g>
          <g style={f(s >= 6)}>
            <path d={`M${g.x1 + 4} ${yV(3.6) - 3}l10 -14`} stroke={EMPHASIS} strokeWidth="1.2" />
            <T x={g.x1 + 18} y={g.chartBottom - 18} bold num="derived" fill={EMPHASIS}>
              3.6
            </T>
          </g>
          <T x={g.x1 + 18} y={g.chartBottom + 2} num="derived" fill={MUTED} style={f(s >= 2)}>
            0.6
          </T>
        </g>
      )}

      {/* legend of the curves */}
      {narrow ? (
        <g>
          <g style={f(s >= 2)}>
            <path d="M14 504h22" stroke={MUTED} strokeWidth="2.4" />
            <T x={42} y={508} size={12} num="derived">
              one action per decision, T = 600: T²ε
            </T>
            <path d="M14 522h22" stroke={MUTED} strokeWidth="1.6" strokeDasharray="6 4" />
            <T x={42} y={526} size={12}>
              if mistakes did not feed each other: Tε
            </T>
          </g>
          <g style={f(s >= 6)}>
            <path d="M14 540h22" stroke={EMPHASIS} strokeWidth="2.6" />
            <T x={42} y={544} size={12}>
              one chunk of 100 per decision, T = 6
            </T>
          </g>
          <T x={42} y={562} size={12} bold fill={EMPHASIS} style={f(s >= 7)}>
            100 times lower with chunks
          </T>
        </g>
      ) : (
        <g>
          <g style={f(s >= 2)}>
            <path d={`M${g.x0 + 16} ${g.chartTop + 18}h26`} stroke={MUTED} strokeWidth="2.4" />
            <T x={g.x0 + 50} y={g.chartTop + 23} num="derived">
              one action per decision, T = 600 decisions: ceiling T²ε
            </T>
            <path d={`M${g.x0 + 16} ${g.chartTop + 40}h26`} stroke={MUTED} strokeWidth="1.6" strokeDasharray="6 4" />
            <T x={g.x0 + 50} y={g.chartTop + 45}>
              if mistakes did not feed each other: Tε
            </T>
          </g>
          <g style={f(s >= 6)}>
            <path d={`M${g.x0 + 16} ${g.chartTop + 62}h26`} stroke={EMPHASIS} strokeWidth="2.6" />
            <T x={g.x0 + 50} y={g.chartTop + 67}>
              one chunk of 100 actions per decision, T = 6 decisions: ceiling in ticks
            </T>
          </g>
          <T x={g.x0 + 50} y={g.chartTop + 89} bold fill={EMPHASIS} style={f(s >= 7)}>
            with chunks the ceiling is 100 times lower
          </T>
        </g>
      )}
    </svg>
  );
}
