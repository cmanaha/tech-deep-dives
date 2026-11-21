import { log10Scale } from '../../lib/scale';
import { EMPHASIS, GPU_INK, MUTED, PAPER, PURPLE, T, box, useNarrow } from './WmJepaKit';

/**
 * Section 7: predictor passes per decision, drawn as the product it is. On a log axis the length
 * of a segment is the log of its factor, so samples, iterations and horizon laid end to end stop
 * exactly at the total. Beside each planner: the time its authors publish, with the GPU.
 */

interface Planner {
  name: string;
  where: string;
  samples: number;
  samplesLabel: string;
  iterations: number;
  horizon: number;
  total: string;
  time: string[];
}

const PLANNERS: Planner[] = [
  { name: 'V-JEPA 2-AC', where: '', samples: 800, samplesLabel: '800', iterations: 10, horizon: 1, total: '8,000', time: ['16 s on one RTX 4090', '3 s on one A100'] },
  { name: 'V-JEPA 2.1', where: 'long horizon', samples: 300, samplesLabel: '300', iterations: 15, horizon: 8, total: '36,000', time: ['14 s on one A100'] },
  { name: 'LeWorldModel', where: 'on Push-T', samples: 300, samplesLabel: '300', iterations: 30, horizon: 5, total: '45,000', time: ['0.98 s for a full plan', 'GPU not named'] },
  { name: 'RoboJEPA', where: 'on a real arm', samples: 4096, samplesLabel: '4,096', iterations: 10, horizon: 5, total: '204,800', time: ['no published time', 'first plan: 307,200 passes'] },
];

const SAMPLES = EMPHASIS;
const ITERATIONS = GPU_INK;
const HORIZON = PURPLE;
const DECADES = ['1', '10', '100', '1,000', '10,000', '100,000', '1,000,000'];

function Segments({ p, x, y, h, labels }: { p: Planner; x: (v: number) => number; y: number; h: number; labels: boolean }) {
  const a = x(1);
  const b = x(p.samples);
  const c = x(p.samples * p.iterations);
  const d = x(p.samples * p.iterations * p.horizon);
  const mid = y + h / 2 + 4.5;
  return (
    <g>
      <path d={box(a, y, b - a, h)} fill={SAMPLES} />
      <path d={box(b, y, c - b, h)} fill={ITERATIONS} />
      {d > c ? <path d={box(c, y, d - c, h)} fill={HORIZON} /> : <path d={box(c - 1.5, y - 4, 3, h + 8)} fill={HORIZON} />}
      <path d={`M${b} ${y}v${h}M${c} ${y}v${h}`} stroke="#ffffff" strokeWidth="1.5" />
      {labels && (
        <g>
          <T x={(a + b) / 2} y={mid} anchor="middle" bold size={12.5} fill="#ffffff">
            {p.samplesLabel} samples
          </T>
          <T x={(b + c) / 2} y={mid} anchor="middle" bold size={12.5} fill="#ffffff">
            {p.iterations} iterations
          </T>
          {d > c && (
            <T x={(c + d) / 2} y={mid} anchor="middle" bold size={12.5} fill="#ffffff">
              horizon {p.horizon}
            </T>
          )}
        </g>
      )}
    </g>
  );
}

function Wide() {
  const x = log10Scale(1, 1000000, 260, 920);
  const top = 48;
  const rowH = 62;
  const axisY = top + PLANNERS.length * rowH + 4;
  return (
    <g>
      <T x={24} y={28} bold>
        planner
      </T>
      <T x={260} y={28} bold>
        predictor passes per decision = samples x iterations x horizon
      </T>
      <T x={956} y={28} bold>
        published time per decision
      </T>
      {DECADES.map((label, e) => (
        <line key={label} x1={x(10 ** e)} y1={top - 6} x2={x(10 ** e)} y2={axisY} stroke="#e3e6ea" strokeWidth="1" />
      ))}
      <line x1="940" y1="14" x2="940" y2={axisY} stroke="#d5dbdb" strokeWidth="1" />
      {PLANNERS.map((p, i) => {
        const y0 = top + i * rowH;
        const end = x(p.samples * p.iterations * p.horizon);
        return (
          <g key={p.name}>
            <T x={24} y={y0 + 22} bold size={14}>
              {p.name}
            </T>
            <T x={24} y={y0 + 40} fill={MUTED}>
              {p.where}
            </T>
            <Segments p={p} x={x} y={y0 + 8} h={28} labels />
            <T x={end + 9} y={y0 + 27} bold size={14}>
              = {p.total}
            </T>
            {p.horizon === 1 && (
              <T x={end + 9} y={y0 + 46} fill={HORIZON}>
                horizon 1 adds no length
              </T>
            )}
            {p.time.map((line, k) => (
              <T key={line} x={956} y={y0 + 22 + k * 18} bold={k === 0 && i < 3} fill={i === 3 && k === 0 ? MUTED : undefined}>
                {line}
              </T>
            ))}
          </g>
        );
      })}
      <line x1={x(1)} y1={axisY} x2={x(1000000)} y2={axisY} stroke={MUTED} strokeWidth="1.5" />
      <g aria-hidden="true">
        {DECADES.map((label, e) => (
          <g key={label}>
            <line x1={x(10 ** e)} y1={axisY} x2={x(10 ** e)} y2={axisY + 5} stroke={MUTED} strokeWidth="1.5" />
            <T x={x(10 ** e)} y={axisY + 21} anchor="middle">
              {label}
            </T>
          </g>
        ))}
      </g>
      <T x={590} y={axisY + 44} anchor="middle">
        predictor passes per decision (log scale: one gridline to the right is ten times the passes)
      </T>
    </g>
  );
}

function Narrow() {
  const x = log10Scale(1, 1000000, 16, 344);
  const top = 12;
  const rowH = 104;
  const axisY = top + PLANNERS.length * rowH;
  return (
    <g>
      {DECADES.map((label, e) => (
        <line key={label} x1={x(10 ** e)} y1={top} x2={x(10 ** e)} y2={axisY} stroke="#e3e6ea" strokeWidth="1" />
      ))}
      {PLANNERS.map((p, i) => {
        const y0 = top + i * rowH;
        return (
          <g key={p.name}>
            <path d={box(12, y0 + 2, 336, 22)} fill={PAPER} />
            <T x={16} y={y0 + 18}>
              <tspan fontWeight="bold">{p.name}</tspan>
              {p.where ? `, ${p.where}` : ''}
            </T>
            <Segments p={p} x={x} y={y0 + 28} h={22} labels={false} />
            <path d={box(12, y0 + 54, 336, 44)} fill={PAPER} />
            <T x={16} y={y0 + 70} size={12.5}>
              <tspan fill={SAMPLES} fontWeight="bold">
                {p.samplesLabel} samples
              </tspan>
              {' x '}
              <tspan fill={ITERATIONS} fontWeight="bold">
                {p.iterations} iterations
              </tspan>
              {' x '}
              <tspan fill={HORIZON} fontWeight="bold">
                horizon {p.horizon}
              </tspan>
              <tspan fontWeight="bold"> = {p.total}</tspan>
            </T>
            <T x={16} y={y0 + 88} fill={MUTED} size={12.5}>
              {p.time.join('; ')}
            </T>
          </g>
        );
      })}
      <line x1={x(1)} y1={axisY} x2={x(1000000)} y2={axisY} stroke={MUTED} strokeWidth="1.5" />
      <g aria-hidden="true">
        {DECADES.map((label, e) => (
          <g key={label}>
            <line x1={x(10 ** e)} y1={axisY} x2={x(10 ** e)} y2={axisY + 5} stroke={MUTED} strokeWidth="1.5" />
            {e % 2 === 0 && (
              <T x={x(10 ** e)} y={axisY + 21} anchor={e === 0 ? 'start' : e === 6 ? 'end' : 'middle'}>
                {label}
              </T>
            )}
          </g>
        ))}
      </g>
      <T x={16} y={axisY + 44}>
        predictor passes per decision (log scale)
      </T>
    </g>
  );
}

export function JepaPasses() {
  const narrow = useNarrow();
  const W = narrow ? 360 : 1240;
  const H = narrow ? 484 : 356;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="jepa-passes-title" style={{ width: '100%', height: 'auto' }}>
      <title id="jepa-passes-title">Predictor passes per decision for four planners, drawn as samples times iterations times horizon on a log axis</title>
      <desc>
        Four bars on a logarithmic axis of predictor passes per decision. Each bar is three segments, samples,
        iterations and horizon, whose lengths add up to the total. V-JEPA 2-AC: 800 samples, 10 iterations, horizon
        1, 8,000 passes, published at 16 seconds on one RTX 4090 and 3 seconds on one A100. V-JEPA 2.1 with a long
        horizon: 300, 15 and 8, 36,000 passes, 14 seconds on one A100. LeWorldModel on Push-T: 300, 30 and 5, 45,000
        passes, 0.98 seconds for a full plan on a GPU that is not named. RoboJEPA on a real arm: 4,096, 10 and 5,
        204,800 passes, no published time.
      </desc>
      <rect x="0" y="0" width={W} height={H} fill={PAPER} />
      {narrow ? <Narrow /> : <Wide />}
    </svg>
  );
}
