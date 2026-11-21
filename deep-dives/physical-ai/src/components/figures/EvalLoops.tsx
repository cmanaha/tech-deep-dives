import { EMPHASIS, GPU_INK, INK, LINE, MUTED, ORANGE, PANEL, PAPER, T, box, rnd, useNarrow } from './WmJepaKit';

/**
 * Section 16: open loop against closed loop, as two plots of the same policy on the same episode.
 *
 * Both plots use one list of small per-step errors. In open loop every step starts on the recorded
 * line, so the errors stay small and separate. In closed loop every step starts where the last one
 * ended, so the same errors add up and the joint ends away from the cup. An illustration: the
 * curve and the errors are invented.
 */

const RECORDED = '#a8650f';
const SHADE = '#f7d3b8';
const CUP_FILL = '#d5efdc';

/** Steps in the illustrated episode. */
const N = 16;

/** The recorded joint angle, in degrees, as key poses joined smoothly: reach, grasp, carry, lower. */
const KEYS: [number, number][] = [
  [0, 10],
  [4, -30],
  [6, -30],
  [11, 35],
  [14, 15],
  [16, 15],
];

function demo(t: number): number {
  for (let k = 0; k < KEYS.length - 1; k += 1) {
    const [t0, v0] = KEYS[k];
    const [t1, v1] = KEYS[k + 1];
    if (t <= t1) {
      const u = (t - t0) / (t1 - t0);
      return v0 + (v1 - v0) * u * u * (3 - 2 * u);
    }
  }
  return KEYS[KEYS.length - 1][1];
}

/** The policy's error at each step, in degrees: small, and the same list in both plots. */
const ERR = Array.from({ length: N }, (_, t) => 3.4 + 2 * rnd(t, 3));
const DEMO = Array.from({ length: N + 1 }, (_, t) => demo(t));
/** Closed loop: each step starts where the last one ended, so the errors accumulate. */
const ROLLOUT = DEMO.map((v, t) => v + ERR.slice(0, t).reduce((a, b) => a + b, 0));

const V_MIN = -60;
const V_MAX = 110;
const PLOT_H = 230;

interface Geo {
  /** Left edge of the panel and its width. */
  px: number;
  pw: number;
  /** Top of the panel. */
  oy: number;
  /** Left edge and width of the plot area. */
  x0: number;
  w: number;
  narrow: boolean;
}

function Swatch({ x, y, kind }: { x: number; y: number; kind: 'recorded' | 'policy' | 'error' | 'cup' }) {
  if (kind === 'recorded') return <line x1={x} y1={y - 4} x2={x + 20} y2={y - 4} stroke={RECORDED} strokeWidth="3" />;
  if (kind === 'policy') return <line x1={x} y1={y - 4} x2={x + 20} y2={y - 4} stroke={EMPHASIS} strokeWidth="2.5" />;
  return <path d={box(x, y - 10, 20, 11)} fill={kind === 'error' ? SHADE : CUP_FILL} stroke={kind === 'error' ? ORANGE : GPU_INK} strokeWidth="1" />;
}

function Panel({ g, mode }: { g: Geo; mode: 'open' | 'closed' }) {
  const open = mode === 'open';
  const yTop = g.oy + (g.narrow ? 84 : 70);
  const yBase = yTop + PLOT_H;
  const X = (t: number) => g.x0 + (t * g.w) / N;
  const Y = (v: number) => yBase - ((v - V_MIN) * PLOT_H) / (V_MAX - V_MIN);
  const recorded = DEMO.map((v, t) => `${t === 0 ? 'M' : 'L'}${X(t).toFixed(1)} ${Y(v).toFixed(1)}`).join('');
  const rollout = ROLLOUT.map((v, t) => `${t === 0 ? 'M' : 'L'}${X(t).toFixed(1)} ${Y(v).toFixed(1)}`).join('');
  const gap = `${rollout}${DEMO.map((v, t) => `L${X(N - t).toFixed(1)} ${Y(DEMO[N - t]).toFixed(1)}`).join('')}Z`;
  const stripBase = yBase + 46;
  const legend = open
    ? ([
        ['recorded', 'the recorded episode'],
        ['policy', "the policy's action, per step"],
        ['error', 'its error at that step'],
        ['cup', 'ends here: block in the cup'],
      ] as const)
    : ([
        ['recorded', 'the recorded episode'],
        ['policy', 'the rollout: the policy drives'],
        ['error', 'gap to the recording'],
        ['cup', 'ends here: block in the cup'],
      ] as const);
  const lx = g.narrow ? g.x0 : X(9.6);
  const ly = g.narrow ? stripBase + 92 : yBase - 60;
  const tx = g.px + 14;
  const below = g.narrow ? ly + 4 * 19 + 14 : stripBase + 68;
  return (
    <g>
      <rect x={g.px} y={g.oy} width={g.pw} height={g.narrow ? 566 : 432} rx="10" fill={PANEL} stroke={LINE} strokeWidth="1.2" />
      <T x={tx} y={g.oy + 28} bold size={g.narrow ? 13.5 : 15}>
        {open ? 'Open loop: every step starts on the recording' : 'Closed loop: every step starts where the last ended'}
      </T>
      {g.narrow ? (
        <>
          <T x={tx} y={g.oy + 48}>
            {open ? 'The next frame comes from the recording,' : "The policy's action moves the arm, and the"}
          </T>
          <T x={tx} y={g.oy + 65}>
            {open ? 'whatever the policy answered.' : "arm's new pose is its next input."}
          </T>
        </>
      ) : (
        <T x={tx} y={g.oy + 49}>
          {open ? 'The next frame comes from the recording, whatever the policy answered.' : "The policy's action moves the arm, and the arm's new pose is its next input."}
        </T>
      )}

      {/* plot frame */}
      <path d={`M${g.x0} ${yTop}V${yBase}H${X(N)}`} fill="none" stroke={MUTED} strokeWidth="1.5" />
      <text x={g.x0 - 12} y={yTop + PLOT_H / 2} fontFamily="sans-serif" fontSize="13" fill={INK} textAnchor="middle" transform={`rotate(-90 ${g.x0 - 12} ${yTop + PLOT_H / 2})`}>
        one joint&apos;s angle
      </text>
      <path d={box(X(13.6), Y(21), X(N) - X(13.6), Y(9) - Y(21))} fill={CUP_FILL} stroke={GPU_INK} strokeWidth="1" strokeDasharray="4 3" />

      {open ? (
        <g>
          {ERR.map((e, t) => (
            <path key={t} d={`M${X(t)} ${Y(DEMO[t])}L${X(t + 1)} ${Y(DEMO[t + 1])}L${X(t + 1)} ${Y(DEMO[t + 1] + e)}Z`} fill={SHADE} stroke={ORANGE} strokeWidth="0.6" />
          ))}
          <path d={recorded} fill="none" stroke={RECORDED} strokeWidth="3" strokeLinejoin="round" />
          {ERR.map((e, t) => (
            <g key={t}>
              <line x1={X(t)} y1={Y(DEMO[t])} x2={X(t + 1)} y2={Y(DEMO[t + 1] + e)} stroke={EMPHASIS} strokeWidth="2" />
              <circle cx={X(t + 1)} cy={Y(DEMO[t + 1] + e)} r="2.4" fill={EMPHASIS} />
              <circle cx={X(t)} cy={Y(DEMO[t])} r="2.6" fill="#ffffff" stroke={RECORDED} strokeWidth="1.4" />
            </g>
          ))}
        </g>
      ) : (
        <g>
          <path d={gap} fill={SHADE} opacity="0.75" />
          <path d={recorded} fill="none" stroke={RECORDED} strokeWidth="3" strokeLinejoin="round" />
          <path d={rollout} fill="none" stroke={EMPHASIS} strokeWidth="2.5" strokeLinejoin="round" />
          {ROLLOUT.map((v, t) => (
            <circle key={t} cx={X(t)} cy={Y(v)} r="2.4" fill={EMPHASIS} />
          ))}
          <path d={`M${X(N) - 7} ${Y(ROLLOUT[N]) - 7}l14 14m0 -14l-14 14`} fill="none" stroke="#a8274f" strokeWidth="3" />
          <T x={X(N) + 8} y={Y(ROLLOUT[N]) - 16} anchor="end" bold fill="#a8274f">
            block in the cup: no
          </T>
        </g>
      )}

      {/* the per-step errors, enlarged: one list, drawn under both plots */}
      <line x1={g.x0} y1={stripBase} x2={X(N)} y2={stripBase} stroke={MUTED} strokeWidth="1" />
      {ERR.map((e, t) => (
        <path key={t} d={box(X(t) + g.w / N / 2 - 4, stripBase - e * 5, 8, e * 5)} fill={ORANGE} />
      ))}
      {g.narrow ? (
        <>
          <T x={g.x0} y={stripBase + 18}>
            error added at each step (enlarged):
          </T>
          <T x={g.x0} y={stripBase + 35}>
            the same list in both plots
          </T>
          <T x={g.x0 + g.w / 2} y={stripBase + 62} anchor="middle" fill={MUTED}>
            time: the control steps of one episode
          </T>
        </>
      ) : (
        <>
          <T x={g.x0} y={stripBase + 18}>
            error added at each step (enlarged): the same list in both plots
          </T>
          <T x={X(N)} y={stripBase + 40} anchor="end" fill={MUTED}>
            time: the control steps of one episode
          </T>
        </>
      )}

      {legend.map(([kind, label], i) => (
        <g key={label}>
          <Swatch x={lx} y={ly + i * 19} kind={kind} />
          <T x={lx + 28} y={ly + i * 19}>
            {label}
          </T>
        </g>
      ))}

      {g.narrow ? (
        <>
          <T x={tx} y={below} bold>
            {open ? 'Action error: small.' : 'The same errors, added up.'}
          </T>
          <T x={tx} y={below + 18} bold>
            {open ? 'Block in the cup: never tested.' : 'Block in the cup: no.'}
          </T>
        </>
      ) : (
        <T x={tx} y={below} bold size={14}>
          {open ? 'Action error: small. Block in the cup: never tested.' : 'The same errors, added up. Block in the cup: no.'}
        </T>
      )}
    </g>
  );
}

export function EvalLoops() {
  const narrow = useNarrow();
  const W = narrow ? 360 : 1240;
  const H = narrow ? 1164 : 472;
  const left: Geo = narrow ? { px: 6, pw: 348, oy: 8, x0: 42, w: 296, narrow } : { px: 20, pw: 590, oy: 20, x0: 70, w: 510, narrow };
  const right: Geo = narrow ? { ...left, oy: 590 } : { ...left, px: 630, x0: 680 };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="evaluation-loops-title" style={{ width: '100%', height: 'auto' }}>
      <title id="evaluation-loops-title">The same policy on the same episode, scored in open loop and in closed loop</title>
      <desc>
        Two plots of one joint angle against time. In the open-loop plot the recorded episode is a brown line, and at
        every step a short blue line starts on the recording and ends a little off it; the small errors stay separate
        and the recording ends in the band that puts the block in the cup. In the closed-loop plot the blue line
        starts on the recording and continues from its own last point, so the same errors add up, the line peels away
        and ends outside the band: the block is not in the cup. A strip under each plot shows the same list of
        per-step errors.
      </desc>
      <rect x="0" y="0" width={W} height={H} fill={PAPER} />
      <Panel g={left} mode="open" />
      <Panel g={right} mode="closed" />
    </svg>
  );
}
