import type { CSSProperties } from 'react';
import { EMPHASIS, INK, JOINT_CURVES, MUTED, LINE, ORANGE, PAPER, PURPLE, T, box, fade, heat, rnd, useNarrow } from './DemoKit';

/**
 * Section 4, flow matching: the same ten sampling steps seen three ways, with the sampling clock
 * and the cost in network passes underneath.
 *
 * 1. One joint of one sample: 50 values, each with the direction the network gives it.
 * 2. Two noise draws for the same joint, ending on the two valid ways of the obstacle example.
 * 3. The whole chunk as the tensor it is: 50 actions by 6 joints.
 *
 * The curves and the noise are hand-drawn and the caption says so. The numbers drawn (50, 10, 0.1,
 * 100, 16) come from the register entries the section passes in `cites`; the readout under the
 * clock is the toy arithmetic of the prose.
 */

export const DEMO_FLOW_STEPS = [
  'Flow time 0. One chunk of pure noise: 50 random values where the 50 target angles of each joint should be. The arrows are what the network outputs, a direction for every value.',
  'After 2 of 10 steps. Every value has moved a short way along its arrow, and the network has been asked again.',
  'After 4 of 10 steps. The heat map, which shows the whole chunk, is losing its grain.',
  'After 6 of 10 steps. The camera images were read once, before the first step; each step re-runs only the action part of the network.',
  'After 8 of 10 steps. The two noise draws have separated: one is heading for the far-side way, the other for the near-side way.',
  'After 10 of 10 steps, flow time 1: a smooth run of 50 target angles for each joint. Each noise draw ended on one whole valid chunk, and neither ended on their average.',
];

const N = 50;
const JOINTS = 6;
const LAST = DEMO_FLOW_STEPS.length - 1;
const RINGED = 6;

/** Hand-drawn target curve of the plotted joint, in [-1, 1]. */
const targetA = JOINT_CURVES[0];
const SAMPLE_A = Array.from({ length: N }, (_, i) => {
  const u = i / (N - 1);
  return { noise: i === RINGED ? 0.78 : (rnd(i, 5) * 2 - 1) * 0.92, target: targetA(u) };
});
const SAMPLE_FAR = Array.from({ length: N }, (_, i) => ({ noise: (rnd(i, 7) * 2 - 1) * 0.92, target: 0.72 * Math.sin((Math.PI * i) / (N - 1)) }));
const SAMPLE_NEAR = Array.from({ length: N }, (_, i) => ({ noise: (rnd(i, 9) * 2 - 1) * 0.92, target: -0.72 * Math.sin((Math.PI * i) / (N - 1)) }));

const CELLS = Array.from({ length: JOINTS }, (_, r) =>
  Array.from({ length: N }, (_, i) => ({ noise: r === 0 ? SAMPLE_A[i].noise : rnd(i + r * N, 11) * 2 - 1, target: JOINT_CURVES[r](i / (N - 1)) })),
);

const TOY = ['0.80', '0.74', '0.68', '0.62', '0.56', '0.50', '0.44', '0.38', '0.32', '0.26', '0.20'];

interface PlotBox {
  px: number;
  py: number;
  pw: number;
  ph: number;
}

export function DemoFlow({ step, reduced }: { step: number; reduced: boolean }) {
  const narrow = useNarrow();
  const fr = step / LAST;
  const done = step === LAST;
  const f = (on: boolean, level = 1) => fade(on, reduced, level);
  const glide = (y: number): CSSProperties => ({ transform: `translate(0px, ${y.toFixed(1)}px)`, transition: reduced ? 'none' : 'transform 380ms ease' });

  const W = narrow ? 320 : 1200;
  const H = narrow ? 846 : 516;
  const size = narrow ? 12 : 13;
  const A: PlotBox = narrow ? { px: 28, py: 30, pw: 284, ph: 150 } : { px: 50, py: 48, pw: 340, ph: 200 };
  const B: PlotBox = narrow ? { px: 28, py: 240, pw: 284, ph: 150 } : { px: 440, py: 48, pw: 340, ph: 200 };
  const heatX = narrow ? 10 : 830;
  const heatY = narrow ? 452 : 62;
  const cellW = narrow ? 6 : 7;
  const cellH = narrow ? 13 : 24;

  const xi = (p: PlotBox, i: number) => p.px + 8 + (i * (p.pw - 16)) / (N - 1);
  const vy = (p: PlotBox, v: number) => p.py + p.ph / 2 - v * (p.ph / 2 - 12);
  const at = (d: { noise: number; target: number }) => d.noise + fr * (d.target - d.noise);
  const curve = (p: PlotBox, pts: { target: number }[]) => pts.map((d, i) => `${i === 0 ? 'M' : 'L'}${xi(p, i).toFixed(1)} ${vy(p, d.target).toFixed(1)}`).join('');

  const frame = (p: PlotBox) => (
    <g>
      <path d={box(p.px, p.py, p.pw, p.ph)} fill="#ffffff" stroke="#e4e8ec" strokeWidth="1" />
      <path d={`M${p.px} ${p.py}V${p.py + p.ph}H${p.px + p.pw}`} fill="none" stroke={MUTED} strokeWidth="1.4" />
    </g>
  );

  /* the direction field of panel A: a faint arrow at grid points, pointing at the curve */
  const fieldCols = narrow ? 10 : 13;
  const field: string[] = [];
  for (let c = 0; c < fieldCols; c += 1) {
    const u = (c + 0.5) / fieldCols;
    const x = A.px + 8 + u * (A.pw - 16);
    for (let r = 0; r < 7; r += 1) {
      const v = -0.9 + (r * 1.8) / 6;
      const dv = (targetA(u) - v) * 0.2;
      if (Math.abs(dv) < 0.035) continue;
      const y0 = vy(A, v);
      const y1 = vy(A, v + dv);
      const dir = y1 > y0 ? 1 : -1;
      field.push(`M${x.toFixed(1)} ${y0.toFixed(1)}V${y1.toFixed(1)}M${(x - 2.6).toFixed(1)} ${(y1 - dir * 4).toFixed(1)}L${x.toFixed(1)} ${y1.toFixed(1)}L${(x + 2.6).toFixed(1)} ${(y1 - dir * 4).toFixed(1)}`);
    }
  }

  /* the arrow each value of sample A follows: constant along a straight path, so it rides with the dot */
  const arrowOf = (d: { noise: number; target: number }) => {
    const len = -(d.target - d.noise) * 0.2 * (A.ph / 2 - 12);
    if (Math.abs(len) < 3) return '';
    const dir = len > 0 ? 1 : -1;
    return `M0 0V${len.toFixed(1)}M-2.4 ${(len - dir * 3.6).toFixed(1)}L0 ${len.toFixed(1)}L2.4 ${(len - dir * 3.6).toFixed(1)}`;
  };

  /* the clock and the cost strip */
  const clockY = narrow ? 620 : 322;
  const barX0 = narrow ? 20 : 230;
  const barX1 = narrow ? 300 : 1100;
  const tx = (k: number) => barX0 + (k * (barX1 - barX0)) / 10;
  const now = step * 2;
  const stripY = narrow ? 740 : 430;
  const tickX0 = narrow ? 20 : 230;
  const pitch = narrow ? 2.8 : 8.7;
  const ticks = (n: number, y: number) => Array.from({ length: n }, (_, k) => `M${(tickX0 + k * pitch).toFixed(1)} ${y}v12`).join('');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="demonstrations-flow-title" style={{ width: '100%', height: 'auto' }}>
      <title id="demonstrations-flow-title">Flow matching carries noise to an action chunk: a direction for every value, two noise draws ending on two valid chunks, and the whole chunk as a grid of numbers</title>
      <desc>
        Three views of the same ten sampling steps. In the first, fifty dots, one per action of a chunk for one joint,
        start at random heights and each follows a small arrow until the dots lie on one smooth curve. In the second,
        two sets of fifty dots start mixed together and end on two different smooth curves, one above and one below a
        dashed line that is their average. In the third, a grid of fifty columns and six rows, one row per joint, turns
        from random shades into smooth bands. Below, a bar marks flow time from zero to one in ten steps, and two rows
        of ticks compare ten network passes with one hundred.
      </desc>
      <rect x="0" y="0" width={W} height={H} fill={PAPER} />

      {/* ---- A: one joint of one sample, with its arrows ---- */}
      <T x={narrow ? 10 : 20} y={narrow ? 18 : 30} size={size} bold>
        One joint: every value follows its arrow
      </T>
      {frame(A)}
      <path d={field.join('')} fill="none" stroke="#b4bdc9" strokeWidth="1" style={f(!done)} />
      <path d={curve(A, SAMPLE_A)} fill="none" stroke={EMPHASIS} strokeWidth="1.6" style={f(done, 0.5)} />
      {SAMPLE_A.map((d, i) => (
        <g key={`a${xi(A, i).toFixed(1)}`} style={glide(vy(A, at(d)))}>
          <path d={arrowOf(d)} transform={`translate(${xi(A, i).toFixed(1)} 0)`} fill="none" stroke={EMPHASIS} strokeWidth="1.1" style={f(!done, 0.75)} />
          <circle cx={xi(A, i)} cy={0} r={narrow ? 2.3 : 2.9} fill={EMPHASIS} />
          {i === RINGED && <circle cx={xi(A, i)} cy={0} r={narrow ? 5.5 : 6.5} fill="none" stroke={ORANGE} strokeWidth="2" />}
        </g>
      ))}
      <T x={A.px + A.pw / 2} y={A.py + A.ph + 20} size={size} anchor="middle">
        the 50 actions of one chunk, in playing order
      </T>
      <T x={A.px - 14} y={A.py + A.ph / 2} size={size} anchor="middle" transform={`rotate(-90 ${A.px - 14} ${A.py + A.ph / 2})`}>
        target angle, one joint
      </T>

      {/* ---- B: two noise draws, two valid chunks ---- */}
      <T x={narrow ? 10 : 410} y={narrow ? 228 : 30} size={size} bold>
        Two noise draws: two valid chunks
      </T>
      {frame(B)}
      <path d={`M${B.px + 8} ${vy(B, 0)}H${B.px + B.pw - 8}`} stroke={MUTED} strokeWidth="1.6" strokeDasharray="6 5" style={f(done)} />
      <path d={curve(B, SAMPLE_FAR)} fill="none" stroke={EMPHASIS} strokeWidth="1.6" style={f(done, 0.5)} />
      <path d={curve(B, SAMPLE_NEAR)} fill="none" stroke={PURPLE} strokeWidth="1.6" style={f(done, 0.5)} />
      {SAMPLE_FAR.map((d, i) => (
        <circle key={`f${xi(B, i).toFixed(1)}`} cx={xi(B, i)} cy={0} r={narrow ? 2.2 : 2.7} fill={EMPHASIS} style={glide(vy(B, at(d)))} />
      ))}
      {SAMPLE_NEAR.map((d, i) => (
        <circle key={`n${xi(B, i).toFixed(1)}`} cx={xi(B, i)} cy={0} r={narrow ? 2.2 : 2.7} fill={PURPLE} style={glide(vy(B, at(d)))} />
      ))}
      <g style={f(done)}>
        <T x={B.px + B.pw / 2} y={vy(B, 0.36) + 4} size={size} anchor="middle" fill={EMPHASIS} bold>
          the far-side way
        </T>
        <T x={B.px + B.pw / 2} y={vy(B, 0) + 4} size={size} anchor="middle" fill={MUTED} style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: 5 }}>
          their average: into the obstacle
        </T>
        <T x={B.px + B.pw / 2} y={vy(B, -0.36) + 4} size={size} anchor="middle" fill={PURPLE} bold>
          the near-side way
        </T>
      </g>
      <T x={B.px + B.pw / 2} y={B.py + B.ph + 20} size={size} anchor="middle">
        the same joint, two samples of 50 actions
      </T>

      {/* ---- C: the whole chunk as a grid ---- */}
      <T x={narrow ? 10 : 830} y={narrow ? 440 : 30} size={size} bold>
        The whole chunk: 50 actions x 6 joints
      </T>
      {CELLS.map((row, r) =>
        row.map((d, i) => (
          <path
            key={`c${r}-${i}`}
            d={box(heatX + i * cellW, heatY + r * cellH, cellW, cellH)}
            style={{ fill: heat(at(d)), transition: reduced ? 'none' : 'fill 380ms ease' }}
          />
        )),
      )}
      <path d={box(heatX, heatY, N * cellW, JOINTS * cellH)} fill="none" stroke={LINE} strokeWidth="1" />
      <path d={box(heatX, heatY, N * cellW, cellH)} fill="none" stroke={ORANGE} strokeWidth="2" />
      <T x={heatX} y={heatY + JOINTS * cellH + 20} size={size}>
        One row per joint, one column per action.
      </T>
      <T x={heatX} y={heatY + JOINTS * cellH + 38} size={size}>
        {narrow ? 'Outlined: the joint plotted at the top.' : 'Outlined: the joint plotted on the left.'}
      </T>
      <path d={box(heatX, heatY + JOINTS * cellH + 50, 14, 12)} fill={heat(-0.9)} />
      <path d={box(heatX + 14, heatY + JOINTS * cellH + 50, 14, 12)} fill={heat(0)} stroke="#e4e8ec" strokeWidth="0.6" />
      <path d={box(heatX + 28, heatY + JOINTS * cellH + 50, 14, 12)} fill={heat(0.9)} />
      <T x={heatX + 50} y={heatY + JOINTS * cellH + 61} size={size}>
        low to high target angle
      </T>

      {/* ---- the sampling clock ---- */}
      <T x={narrow ? 10 : 20} y={clockY} size={size} bold>
        {narrow ? 'Flow time τ: 10 steps of size δ = 0.1' : 'Flow time τ runs from 0 (pure noise) to 1 (the finished chunk) in 10 Euler steps of size δ = 0.1'}
      </T>
      <path d={`M${barX0} ${clockY + 22}H${barX1}`} stroke="#d5dbdb" strokeWidth="6" strokeLinecap="round" />
      <path d={`M${barX0} ${clockY + 22}H${tx(now).toFixed(1)}`} stroke={EMPHASIS} strokeWidth="6" strokeLinecap="round" style={f(now > 0)} />
      {TOY.map((v, k) => (
        <g key={v}>
          <path d={`M${tx(k)} ${clockY + 14}v16`} stroke={k <= now ? EMPHASIS : MUTED} strokeWidth="1.4" />
          {(!narrow || k % 5 === 0) && (
            <T x={tx(k)} y={clockY + 46} size={12} anchor={narrow ? (k === 0 ? 'start' : k === 10 ? 'end' : 'middle') : 'middle'} num="derived" fill={MUTED}>
              {narrow ? (k === 0 ? 'τ = 0, noise' : k === 10 ? 'τ = 1, chunk' : '0.5') : k === 0 ? '0' : k === 10 ? '1' : `0.${k}`}
            </T>
          )}
          {(!narrow || k % 2 === 0) && (
            <T x={tx(k)} y={clockY + (narrow ? 86 : 68)} size={12} anchor="middle" num="toy" bold={k === now} fill={k === now ? ORANGE : k < now ? INK : MUTED}>
              {v}
            </T>
          )}
        </g>
      ))}
      <circle cx={0} cy={clockY + 22} r="6.5" fill="#ffffff" stroke={EMPHASIS} strokeWidth="3" style={{ transform: `translate(${tx(now).toFixed(1)}px, 0px)`, transition: reduced ? 'none' : 'transform 380ms ease' }} />
      {narrow ? (
        <T x={10} y={clockY + 68} size={12} fill={ORANGE}>
          the ringed value, in toy numbers:
        </T>
      ) : (
        <g>
          <T x={20} y={clockY + 46} size={12} fill={MUTED}>
            flow time τ
          </T>
          <T x={20} y={clockY + 68} size={12} fill={ORANGE}>
            the ringed value, in toy numbers
          </T>
        </g>
      )}

      {/* ---- network passes per chunk ---- */}
      <T x={narrow ? 10 : 20} y={stripY} size={size} bold>
        Network passes to build one chunk
      </T>
      {narrow ? (
        <g>
          <T x={10} y={stripY + 20} size={12}>
            flow matching in pi0: 10 steps
          </T>
          <path d={ticks(10, stripY + 27)} stroke={EMPHASIS} strokeWidth="1.6" />
          <T x={10} y={stripY + 60} size={12}>
            Diffusion Policy as trained: 100 iterations
          </T>
          <path d={ticks(100, stripY + 67)} stroke={MUTED} strokeWidth="1.6" />
          <T x={10} y={stripY + 98} size={12} fill={MUTED}>
            (its authors run 16 or 10 on real robots)
          </T>
        </g>
      ) : (
        <g>
          <T x={20} y={stripY + 28} size={13}>
            flow matching in pi0
          </T>
          <path d={ticks(10, stripY + 17)} stroke={EMPHASIS} strokeWidth="4" />
          <T x={tickX0 + 10 * pitch + 6} y={stripY + 28} size={13} bold fill={EMPHASIS}>
            10 steps
          </T>
          <T x={20} y={stripY + 56} size={13}>
            Diffusion Policy as trained
          </T>
          <path d={ticks(100, stripY + 45)} stroke={MUTED} strokeWidth="4" />
          <T x={tickX0 + 100 * pitch + 6} y={stripY + 56} size={13} bold fill={MUTED}>
            100
          </T>
          <T x={tickX0} y={stripY + 78} size={12} fill={MUTED}>
            one tick is one pass of the network; the Diffusion Policy authors run 16 or 10 iterations on real robots
          </T>
        </g>
      )}
    </svg>
  );
}
