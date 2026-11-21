import type { CSSProperties, ReactNode } from 'react';
import { Derived } from '../Cite';
import { EMPHASIS, GPU_INK, INK, LINE, MUTED, ORANGE, PAPER, ROBOT_INK, T, box, fade, useNarrow } from './DemoKit';

/**
 * Section 5, two clocks on one time axis: the slow system delivers 10 plans a second and the fast
 * system emits 120 actions a second (GR00T N1's two rates), so twelve action ticks sit under every
 * plan. A plan is drawn over the interval in which it is computed; the actions that use it sit
 * under the next interval, which is the delay the two-rate design carries.
 *
 * A wide screen shows one second, a phone half a second. The millisecond labels are our arithmetic
 * from the two rates.
 */

export const VLA_CLOCK_STEPS: ReactNode[] = [
  'Camera frames and the instruction enter the slow system, the vision-language model. It starts computing plan A. The fast system has no plan yet, so its first slots stay empty.',
  <>
    One slow tick later, <Derived>100</Derived> ms at 10 plans a second, plan A is delivered: a set of output tokens that
    tells the action head what to do. The slow system is already reading newer frames for plan B.
  </>,
  'The fast system emits actions on plan A, one per tick of its own clock, while plan B is still being computed.',
  <>
    Twelve actions have gone out on one plan. That is the ratio of the two rates: 120 actions a second against 10 plans
    a second. The twelfth leaves when plan A is almost <Derived>100</Derived> ms old (the orange bracket).
  </>,
  'Plan B arrives. The fast system picks it up on its next action and never stops; the actions change colour at that tick.',
  'The whole window. Every plan feeds twelve actions, and every action runs on a plan that was computed from frames already in the past.',
];

const PLAN_MS = 100;
const ACTIONS_PER_PLAN = 12;
const LETTERS = 'ABCDEFGHIJ';

export function VlaTwoClocks({ step, reduced }: { step: number; reduced: boolean }) {
  const narrow = useNarrow();
  const plans = narrow ? 5 : 10;
  const windowMs = plans * PLAN_MS;
  const W = narrow ? 320 : 1200;
  const H = narrow ? 308 : 314;
  const x0 = narrow ? 14 : 190;
  const x1 = narrow ? 306 : 1180;
  const size = narrow ? 12 : 13;
  const xt = (ms: number) => x0 + (ms / windowMs) * (x1 - x0);
  const y = narrow
    ? { frames: 32, slow: 56, slowH: 40, bracket: 158, count: 0, fast: 116, fastH: 34, axis: 168 }
    : { frames: 28, slow: 64, slowH: 50, bracket: 130, count: 168, fast: 184, fastH: 40, axis: 224 };
  const playhead = [0, 100, 150, 199, 250, windowMs][step] ?? windowMs;
  const f = (on: boolean, level = 1) => fade(on, reduced, level);
  const ink = (i: number) => (i % 2 === 0 ? GPU_INK : EMPHASIS);
  const tint = (i: number) => (i % 2 === 0 ? '#e6f6ea' : '#e8f1fb');
  const pitch = (x1 - x0) / (plans * ACTIONS_PER_PLAN);
  const barW = pitch * 0.66;
  const aged = step >= 3;
  const move: CSSProperties = { transform: `translate(${xt(playhead).toFixed(1)}px, 0px)`, transition: reduced ? 'none' : 'transform 380ms ease' };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="vla-clocks-title" style={{ width: '100%', height: 'auto' }}>
      <title id="vla-clocks-title">Two clocks on one time axis: 10 plans a second from the slow system, 120 actions a second from the fast one</title>
      <desc>
        One shared time axis. The top lane is the slow system, a vision-language model: a row of blocks, one per plan,
        each as wide as the time it takes to compute. The bottom lane is the fast system, the action head: a row of
        thin bars, one per action, twelve under every plan. A line drops from the end of each plan block to the first
        action that uses it, so the actions on a plan sit under the block of the next plan. A playhead moves along the
        axis as the steps advance.
      </desc>
      <rect x="0" y="0" width={W} height={H} fill={PAPER} />

      {/* lane labels */}
      {narrow ? (
        <g>
          <T x={x0} y={14} size={12} bold>
            Slow system (System 2): 10 plans a second
          </T>
          <T x={x0} y={212} size={12} bold>
            Fast system (System 1): 120 actions a second
          </T>
        </g>
      ) : (
        <g>
          <T x={14} y={42} size={12}>
            frames + the instruction
          </T>
          <T x={14} y={82} bold>
            Slow system (System 2)
          </T>
          <T x={14} y={100} size={12}>
            vision-language model
          </T>
          <T x={14} y={116} size={12}>
            10 plans a second
          </T>
          <T x={14} y={200} bold>
            Fast system (System 1)
          </T>
          <T x={14} y={218} size={12}>
            action head
          </T>
          <T x={14} y={234} size={12}>
            120 actions a second
          </T>
        </g>
      )}

      {/* frames read at the start of every slow tick */}
      {Array.from({ length: plans }, (_, i) => {
        const read = playhead >= i * PLAN_MS;
        const fx = xt(i * PLAN_MS);
        return (
          <g key={`frame${i}`} style={f(true, read ? 1 : 0.3)}>
            <path d={box(fx, y.frames, 20, 15)} fill="#fffbe8" stroke={ROBOT_INK} strokeWidth="1.4" />
            <path d={`M${fx + 10} ${y.frames + 17}V${y.slow - 3}`} stroke={ROBOT_INK} strokeWidth="1.2" />
            <path d={`M${fx + 6.5} ${y.slow - 7}h7l-3.5 6Z`} fill={ROBOT_INK} />
          </g>
        );
      })}

      {/* slow lane: one block per plan, over the interval in which it is computed */}
      {Array.from({ length: plans }, (_, i) => {
        const delivered = playhead >= (i + 1) * PLAN_MS;
        const started = playhead >= i * PLAN_MS;
        const bx = xt(i * PLAN_MS) + 1.5;
        const bw = xt((i + 1) * PLAN_MS) - xt(i * PLAN_MS) - 3;
        return (
          <g key={`plan${i}`}>
            <path d={box(bx, y.slow, bw, y.slowH)} fill="#ffffff" stroke={LINE} strokeWidth="1" strokeDasharray="3 3" />
            <path d={box(bx, y.slow, bw, y.slowH)} fill={tint(i)} stroke={ink(i)} strokeWidth="1.6" strokeDasharray="5 3" style={f(started && !delivered)} />
            <path d={box(bx, y.slow, bw, y.slowH)} fill={ink(i)} style={f(delivered)} />
            <T x={bx + bw / 2} y={y.slow + y.slowH / 2 + 5} size={size} anchor="middle" bold fill={ink(i)} style={f(started && !delivered)}>
              plan {LETTERS[i]}
            </T>
            <T x={bx + bw / 2} y={y.slow + y.slowH / 2 + 5} size={size} anchor="middle" bold fill="#ffffff" style={f(delivered)}>
              plan {LETTERS[i]}
            </T>
            {/* the plan is handed down at the end of its block */}
            {i < plans - 1 && (
              <g style={f(delivered)}>
                <path d={`M${xt((i + 1) * PLAN_MS)} ${y.slow + y.slowH}V${y.fast - 4}`} stroke={ink(i)} strokeWidth="1.6" />
                <path d={`M${xt((i + 1) * PLAN_MS) - 4} ${y.fast - 9}h8l-4 7Z`} fill={ink(i)} />
              </g>
            )}
          </g>
        );
      })}

      {/* fast lane: one bar per action tick */}
      {Array.from({ length: plans * ACTIONS_PER_PLAN }, (_, k) => {
        const ms = (k * windowMs) / (plans * ACTIONS_PER_PLAN);
        const plan = Math.floor(k / ACTIONS_PER_PLAN) - 1;
        const emitted = plan >= 0 && ms < playhead;
        const bx = x0 + k * pitch + (pitch - barW) / 2;
        return (
          <g key={`act${k}`}>
            <path d={box(bx, y.fast, barW, y.fastH)} fill={plan < 0 ? '#eef0f2' : '#ffffff'} stroke={plan < 0 ? '#c6ccd2' : LINE} strokeWidth="0.8" />
            {plan >= 0 && <path d={box(bx, y.fast, barW, y.fastH)} fill={ink(plan)} style={fade(emitted, reduced, 1, 200)} />}
          </g>
        );
      })}

      {/* twelve actions on plan A, and how old the plan is when the last one leaves */}
      <g style={f(aged)}>
        <path
          d={`M${xt(100) + 4} ${y.bracket - 5}v10M${xt(100) + 4} ${y.bracket}H${xt(200) - pitch / 2}M${xt(200) - pitch / 2} ${y.bracket - 5}v10`}
          fill="none"
          stroke={ORANGE}
          strokeWidth="2"
        />
        <path d={box(xt(200) - pitch + (pitch - barW) / 2 - 1.5, y.fast - 1.5, barW + 3, y.fastH + 3)} fill="none" stroke={ORANGE} strokeWidth="2" />
        {!narrow && (
          <T x={(xt(100) + xt(200)) / 2} y={y.count} size={size} anchor="middle" bold>
            12 actions
          </T>
        )}
      </g>

      {/* time axis */}
      <path d={`M${x0} ${y.axis}H${x1}`} stroke={MUTED} strokeWidth="1.4" />
      {Array.from({ length: plans + 1 }, (_, i) => (
        <g key={`tick${i}`}>
          <path d={`M${xt(i * PLAN_MS)} ${y.axis}v6`} stroke={MUTED} strokeWidth="1.2" />
          <T x={xt(i * PLAN_MS)} y={y.axis + 22} size={12} anchor={i === 0 ? 'start' : i === plans ? 'end' : 'middle'} num="derived" fill={MUTED}>
            {i === 0 ? '0 ms' : i === plans ? `${(i * PLAN_MS).toLocaleString('en-US')} ms` : String(i * PLAN_MS)}
          </T>
        </g>
      ))}

      {/* playhead */}
      <g style={move}>
        <path d={`M0 ${y.frames - 6}V${y.axis + 6}`} stroke={INK} strokeWidth="1.4" />
        <path d={`M-5 ${y.frames - 8}h10l-5 7Z`} fill={INK} />
      </g>

      {/* legend */}
      {narrow ? (
        <g>
          <path d="M14 230v10M14 235h22M36 230v10" fill="none" stroke={ORANGE} strokeWidth="2" style={f(aged)} />
          <T x={44} y={239} size={12} num="derived" style={f(aged)}>
            the age of plan A when its 12th action
          </T>
          <T x={44} y={255} size={12} num="derived" style={f(aged)}>
            leaves: almost 100 ms
          </T>
          <T x={14} y={278} size={12} fill={MUTED}>
            Small frames: the cameras and the instruction,
          </T>
          <T x={14} y={294} size={12} fill={MUTED}>
            read every slow tick. Dashed plan: in progress.
          </T>
        </g>
      ) : (
        <g>
          <path d="M190 268v10M190 273h26M216 268v10" fill="none" stroke={ORANGE} strokeWidth="2" style={f(aged)} />
          <T x={226} y={278} num="derived" style={f(aged)}>
            the age of plan A when its 12th action leaves: almost 100 ms, on top of the tick it took to compute
          </T>
          <T x={190} y={300} size={12} fill={MUTED}>
            Dashed plan: being computed. Filled: delivered. Grey slots: no plan has arrived yet. The line under each plan drops to the first action that uses it.
          </T>
        </g>
      )}
    </svg>
  );
}
