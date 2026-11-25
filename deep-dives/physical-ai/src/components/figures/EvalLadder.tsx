import { INK, LINE, MUTED, PAPER, T, box, useNarrow } from './WmJepaKit';

/**
 * Section 16: the evaluation ladder, drawn on the axis its rungs are measured on.
 *
 * x is the Pearson correlation with success on real robots that each paper reports. One row per
 * rung. Beside the chart, twelve closed-loop trials of the scripted MuJoCo episode show what the
 * simulation rung looks like. Every value is printed in a register entry the figure cites.
 */

const GRID = './media/so101-eval-grid.jpg';
const REAL_INK = '#7a5c00';
const WM_INK = '#1e7b3a';
const SIM_INK = '#1f5fa8';
const OPEN_INK = '#44505c';
const BAND = '#ffffff';
const BAND_LINE = '#dfe4ea';

/** The published correlations, as the cited entries print them. */
const R = { open: 0.308, simWorst: 0.81, simTwin: 0.9, simMatched: 0.924, wmLow: 0.78, wmMid: 0.983, wmHigh: 0.989 };

const ROWS = [
  { key: 'real', name: 'Rung three: trials on the real arm', limit: 'limit: wide intervals, a room that drifts' },
  { key: 'wm', name: 'Rung two: scoring with a world model', limit: 'limit: contact can be imagined wrongly' },
  { key: 'sim', name: 'Rung one: closed loop in simulation', limit: 'limit: saturated benchmarks, sim-to-real gap' },
  { key: 'open', name: 'On the ground: open-loop action error', limit: 'limit: never meets its own mistakes' },
] as const;

function Dot({ x, y, color }: { x: number; y: number; color: string }) {
  return <circle cx={x} cy={y} r="5.5" fill={color} stroke="#ffffff" strokeWidth="1.5" />;
}

function Diamond({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y - 9}L${x + 8} ${y}L${x} ${y + 9}L${x - 8} ${y}Z`} fill={REAL_INK} stroke="#ffffff" strokeWidth="1.5" />;
}

/** The marks of all four rows on a shared scale. `ys` are the row centre lines, top to bottom. */
function Marks({ X, ys }: { X: (r: number) => number; ys: number[] }) {
  const [real, wm, sim, open] = ys;
  return (
    <g>
      <Diamond x={X(1)} y={real} />
      <line x1={X(R.wmLow)} y1={wm} x2={X(R.wmHigh)} y2={wm} stroke="#bfe3c8" strokeWidth="8" strokeLinecap="round" />
      <Dot x={X(R.wmLow)} y={wm} color={WM_INK} />
      <Dot x={X(R.wmMid)} y={wm - 7} color={WM_INK} />
      <Dot x={X(R.wmHigh)} y={wm + 7} color={WM_INK} />
      <line x1={X(R.simWorst)} y1={sim - 7} x2={X(R.simTwin)} y2={sim - 7} stroke={SIM_INK} strokeWidth="2" />
      <line x1={X(R.simWorst)} y1={sim - 13} x2={X(R.simWorst)} y2={sim - 1} stroke={SIM_INK} strokeWidth="2" />
      <Dot x={X(R.simTwin)} y={sim - 7} color={SIM_INK} />
      <Dot x={X(R.simMatched)} y={sim + 7} color={SIM_INK} />
      <Dot x={X(R.open)} y={open} color={OPEN_INK} />
    </g>
  );
}

function Axis({ X, y }: { X: (r: number) => number; y: number }) {
  return (
    <g>
      <line x1={X(0)} y1={y} x2={X(1)} y2={y} stroke={MUTED} strokeWidth="1.5" />
      <g aria-hidden="true">
        {[0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => (
          <g key={v}>
            <line x1={X(v)} y1={y} x2={X(v)} y2={y + 6} stroke={MUTED} strokeWidth="1.5" />
            <T x={X(v)} y={y + 22} anchor="middle">
              {v}
            </T>
          </g>
        ))}
      </g>
    </g>
  );
}

/** The capture of twelve trials, painted whole into a box. */
function Trials({ x, y, w }: { x: number; y: number; w: number }) {
  const h = (w * 720) / 1280;
  return (
    <g>
      <image href={GRID} x={x} y={y} width={w} height={h} preserveAspectRatio="none" />
      <path d={box(x, y, w, h)} fill="none" stroke={LINE} strokeWidth="1" />
    </g>
  );
}

function Wide() {
  const X = (r: number) => 320 + 440 * r;
  const ys = [100, 190, 280, 370];
  return (
    <g>
      <T x={20} y={40} fill={MUTED}>
        the reference on top
      </T>
      {ROWS.map((row, i) => (
        <g key={row.key}>
          <path d={box(310, ys[i] - 40, 470, 80)} fill={BAND} stroke={BAND_LINE} strokeWidth="1" />
          <T x={20} y={ys[i] - 2} bold size={14}>
            {row.name}
          </T>
          <T x={20} y={ys[i] + 18} fill={MUTED}>
            {row.limit}
          </T>
        </g>
      ))}
      <T x={20} y={440} fill={MUTED}>
        cheapest, fastest to run
      </T>
      <line x1={X(1)} y1={60} x2={X(1)} y2={420} stroke={REAL_INK} strokeWidth="1.5" strokeDasharray="5 4" />
      <Marks X={X} ys={ys} />

      <T x={746} y={105} anchor="end">
        the reference: every row below is compared with this
      </T>

      <T x={X(R.wmLow) - 12} y={195} anchor="end">
        0.78 WorldGym
      </T>
      <T x={746} y={171} anchor="end">
        0.983 HF-WM
      </T>
      <T x={746} y={221} anchor="end">
        0.989 RoboWorld, each as its own authors report
      </T>

      <T x={X(R.simWorst) - 10} y={278} anchor="end">
        0.81 in its worst scene
      </T>
      <T x={746} y={258} anchor="end">
        0.9 scanned twin, PolaRiS
      </T>
      <T x={746} y={311} anchor="end">
        0.924 matched camera view, SIMPLER (2024)
      </T>

      <T x={X(R.open) + 12} y={375}>
        0.308 ranking by action error, SIMPLER (2024)
      </T>

      <Axis X={X} y={420} />
      <T x={540} y={466} anchor="middle">
        Pearson r with success on real robots, as each paper reports it
      </T>

      {/* what the simulation rung looks like */}
      <path d="M780 280H800" stroke={SIM_INK} strokeWidth="1.5" fill="none" />
      <circle cx="780" cy="280" r="3.5" fill={SIM_INK} />
      <T x={800} y={86} bold size={14}>
        Rung one as a picture: twelve closed-loop trials
      </T>
      <T x={800} y={106}>
        Each starts with the block somewhere new and is scored by where it ends.
      </T>
      <Trials x={800} y={120} w={420} />
      <T x={800} y={378}>
        Green border: the block ended in the cup, 8 of 12.
      </T>
      <T x={800} y={397} fill={MUTED}>
        MuJoCo stills made for this dive: scripted motion, no learned policy.
      </T>
    </g>
  );
}

function Narrow() {
  const X = (r: number) => 30 + 296 * r;
  const y0 = [50, 152, 254, 373];
  const ys = y0.map((y) => y + 42);
  return (
    <g>
      <T x={16} y={24} fill={MUTED}>
        the reference on top
      </T>
      {ROWS.map((row, i) => (
        <g key={row.key}>
          <T x={16} y={y0[i]} bold>
            {row.name}
          </T>
          <T x={16} y={y0[i] + 17} fill={MUTED}>
            {row.limit}
          </T>
          <path d={box(16, ys[i] - 15, 328, 30)} fill={BAND} stroke={BAND_LINE} strokeWidth="1" />
        </g>
      ))}
      <line x1={X(1)} y1={ys[0] - 15} x2={X(1)} y2={478} stroke={REAL_INK} strokeWidth="1.5" strokeDasharray="5 4" />
      <Marks X={X} ys={ys} />
      <T x={16} y={y0[0] + 74}>
        the reference: every row below is compared with it
      </T>
      <T x={16} y={y0[1] + 74}>
        0.78 WorldGym, 0.983 HF-WM, 0.989 RoboWorld
      </T>
      <T x={16} y={y0[2] + 74}>
        0.9 PolaRiS scanned twin (0.81 in its worst scene)
      </T>
      <T x={16} y={y0[2] + 91}>
        0.924 matched camera view, SIMPLER (2024)
      </T>
      <T x={16} y={y0[3] + 74}>
        0.308 ranking by action error, SIMPLER (2024)
      </T>
      <T x={16} y={y0[3] + 94} fill={MUTED}>
        cheapest, fastest to run
      </T>
      <Axis X={X} y={478} />
      <T x={180} y={522} anchor="middle">
        Pearson r with success on real robots,
      </T>
      <T x={180} y={539} anchor="middle">
        as each paper reports it
      </T>

      <T x={16} y={574} bold>
        Rung one as a picture: twelve closed-loop trials
      </T>
      <T x={16} y={591}>
        Each starts with the block somewhere new
      </T>
      <T x={16} y={608}>
        and is scored by where it ends.
      </T>
      <Trials x={16} y={618} w={328} />
      <T x={16} y={822}>
        Green border: the block ended in the cup, 8 of 12.
      </T>
      <T x={16} y={840} fill={MUTED}>
        MuJoCo stills made for this dive:
      </T>
      <T x={16} y={857} fill={MUTED}>
        scripted motion, no learned policy.
      </T>
    </g>
  );
}

export function EvalLadder() {
  const narrow = useNarrow();
  const W = narrow ? 360 : 1240;
  const H = narrow ? 872 : 484;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="evaluation-ladder-title" style={{ width: '100%', height: 'auto' }}>
      <title id="evaluation-ladder-title">The evaluation ladder on one axis: how closely each way of scoring a policy agrees with real robots</title>
      <desc>
        A chart with four rows on an axis of Pearson correlation with success on real robots, from 0 to 1. Open-loop
        action error sits at 0.308. Closed loop in simulation sits at 0.9 for a scanned twin, 0.81 in its worst scene,
        and at 0.924 for a matched camera view. Scoring with a world model runs from 0.78 to 0.983 and 0.989, each as
        reported by the authors of the tool. Trials on the real arm are the reference at 1. Beside the chart, a grid
        of twelve simulated trials of the arm, eight with a green border where the block ended in the cup.
      </desc>
      <rect x="0" y="0" width={W} height={H} fill={PAPER} />
      <g fill={INK}>{narrow ? <Narrow /> : <Wide />}</g>
    </svg>
  );
}
