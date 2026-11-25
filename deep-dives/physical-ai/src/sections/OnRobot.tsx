import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Derived } from '../components/Cite';
import { Figure, AnimatedFigure } from '../components/Figure';
import { Formula, M } from '../components/Math';
import { Placeholder, Snippet } from '../components/Blocks';
import { linear } from '../lib/scale';
import { ARM, TASK_STORY } from '../lib/task';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const CPU_FILL = '#e8f1fb';
const CPU_INK = '#1f5fa8';
const GPU_FILL = '#e6f6ea';
const GPU_INK = '#1e7b3a';
const NET_FILL = '#eef0f2';
const NET_INK = '#44505c';
const ROBOT_FILL = '#fff6d6';
const ROBOT_INK = '#7a5c00';
const NEUTRAL_INK = '#5f6b7a';
const EMPHASIS = '#0972d3';
const STOP_INK = '#b0281a';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 600, margin: '0 auto' };

const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

const LABEL = { fontFamily: 'sans-serif', fontSize: 12, fill: INK } as const;
const TITLE = { fontFamily: 'sans-serif', fontSize: 12.5, fontWeight: 'bold', fill: INK } as const;

/* ------------------------------------------------------------------------ */
/* Diagram 17.1 (chart): the latency budget, in control periods             */
/* ------------------------------------------------------------------------ */

const PERIOD_MS = 1000 / 30;

const CHAIN_LINKS = [
  { a: 'camera', b: 'frame', fill: ROBOT_FILL, ink: ROBOT_INK, dashed: true },
  { a: 'prepare', b: 'images', fill: CPU_FILL, ink: CPU_INK, dashed: false },
  { a: 'policy', b: 'call', fill: GPU_FILL, ink: GPU_INK, dashed: false },
  { a: 'decode', b: 'actions', fill: CPU_FILL, ink: CPU_INK, dashed: false },
  { a: 'servo', b: 'bus write', fill: ROBOT_FILL, ink: ROBOT_INK, dashed: true },
];

const CALL_BARS = [
  { name: 'Jetson Orin, 4.5 periods', ms: 149.0, text: '149.0 ms' },
  { name: 'DGX Spark', ms: 116.6, text: '116.6 ms' },
  { name: 'AGX Thor', ms: 76.8, text: '76.8 ms' },
];

const SEGMENT_STYLE = [
  { key: 'model', fill: GPU_FILL, ink: GPU_INK },
  { key: 'network', fill: NET_FILL, ink: NET_INK },
  { key: 'image resize', fill: CPU_FILL, ink: CPU_INK },
  { key: 'other', fill: '#ffffff', ink: NEUTRAL_INK },
];

const CHAIN_BARS = [
  { name: 'Desktop robot computer', parts: [97.43, 6.89, 1.44, 3.0], text: '108.76 ms', y: 288 },
  { name: 'Small on-robot computer (Intel NUC)', parts: [96.89, 21.2, 11.22, 9.67], text: '138.98 ms', y: 332 },
];

function BudgetChart() {
  const x = linear(0, 200, 20, 380);
  const periods = [0, 1, 2, 3, 4, 5, 6];
  const grid = (y1: number, y2: number) =>
    periods.map((k) => <line key={k} x1={x(k * PERIOD_MS)} y1={y1} x2={x(k * PERIOD_MS)} y2={y2} stroke="#c6ccd3" strokeWidth="1" />);
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 436" role="img" aria-labelledby="on-robot-budget-title" style={{ width: '100%', height: 'auto' }}>
        <title id="on-robot-budget-title">The latency budget from frame capture to motor command, counted in control periods</title>
        <desc>
          A strip of five links: camera frame, prepare images, policy call, decode actions, servo bus write. The middle
          three sit inside the policy call NVIDIA times. Below, bars on an axis of control periods at 30 Hz: one GR00T
          N1.7 policy call takes 149.0 ms on Jetson Orin, 116.6 ms on DGX Spark and 76.8 ms on AGX Thor. Two stacked
          bars show a measured chain with the model on a separate workstation: 108.76 ms and 138.98 ms in total.
        </desc>
        <rect x="0" y="0" width="400" height="436" fill="#fbfbfd" />

        {/* the chain of links */}
        <text x="20" y="20" {...TITLE}>
          From frame capture to motor command
        </text>
        {CHAIN_LINKS.map((l, i) => (
          <g key={l.a}>
            <rect
              x={10 + i * 77.5}
              y="30"
              width="70"
              height="40"
              rx="4"
              fill={l.fill}
              stroke={l.ink}
              strokeWidth="1.5"
              strokeDasharray={l.dashed ? '5 4' : undefined}
            />
            <text x={45 + i * 77.5} y="47" textAnchor="middle" {...LABEL}>
              {l.a}
            </text>
            <text x={45 + i * 77.5} y="62" textAnchor="middle" {...LABEL}>
              {l.b}
            </text>
          </g>
        ))}
        <path d="M88 78 V84 H312 V78" fill="none" stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <text x="200" y="100" textAnchor="middle" {...LABEL}>
          inside the policy call NVIDIA times
        </text>
        <text x="200" y="118" textAnchor="middle" {...LABEL}>
          dashed links: no published figure for this arm
        </text>

        {/* one policy call per device */}
        <text x="20" y="146" {...TITLE}>
          One compiled GR00T N1.7 call, NVIDIA&apos;s medians
        </text>
        {grid(154, 226)}
        {CALL_BARS.map((b, i) => (
          <g key={b.name}>
            <rect x={x(0)} y={158 + i * 23} width={x(b.ms) - x(0)} height="18" fill={GPU_FILL} stroke={GPU_INK} strokeWidth="1.5" />
            <text x={x(0) + 7} y={171 + i * 23} {...LABEL}>
              {b.name}
            </text>
            <text x={x(b.ms) + 6} y={171 + i * 23} {...LABEL} fontWeight="bold">
              {b.text}
            </text>
          </g>
        ))}

        {/* a measured off-board chain */}
        <text x="20" y="252" {...TITLE}>
          A measured chain, model on a separate workstation
        </text>
        <text x="20" y="268" {...LABEL}>
          over wired Ethernet, 50 calls
        </text>
        {CHAIN_BARS.map((b) => {
          let at = 0;
          return (
            <g key={b.name}>
              <text x="20" y={b.y - 5} {...LABEL}>
                {b.name}
              </text>
              {grid(b.y - 1, b.y + 19)}
              {b.parts.map((p, j) => {
                const x0 = x(at);
                at += p;
                return (
                  <rect
                    key={SEGMENT_STYLE[j].key}
                    x={x0}
                    y={b.y}
                    width={x(at) - x0}
                    height="18"
                    fill={SEGMENT_STYLE[j].fill}
                    stroke={SEGMENT_STYLE[j].ink}
                    strokeWidth="1"
                  />
                );
              })}
              <text x={x(at) + 6} y={b.y + 13} {...LABEL} fontWeight="bold">
                {b.text}
              </text>
            </g>
          );
        })}

        {/* axis */}
        <line x1={x(0)} y1="362" x2={x(200)} y2="362" stroke={NEUTRAL_INK} strokeWidth="1.5" />
        {periods.map((k) => (
          <g key={k}>
            <line x1={x(k * PERIOD_MS)} y1="362" x2={x(k * PERIOD_MS)} y2="367" stroke={NEUTRAL_INK} strokeWidth="1" />
            <text x={x(k * PERIOD_MS)} y="381" textAnchor="middle" {...LABEL}>
              {k}
            </text>
          </g>
        ))}
        <text x="200" y="399" textAnchor="middle" {...LABEL}>
          control periods at 30 Hz (one period is 33.3 ms)
        </text>

        {/* legend for the stacked bars */}
        {SEGMENT_STYLE.map((s, j) => {
          const lx = [20, 92, 178, 296][j];
          return (
            <g key={s.key}>
              <rect x={lx} y="412" width="12" height="12" fill={s.fill} stroke={s.ink} strokeWidth="1" />
              <text x={lx + 17} y="422.5" {...LABEL}>
                {s.key}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 17.2 (animated): chunks against the control clock                */
/* ------------------------------------------------------------------------ */

/* Every position follows from the chunk length: the benchmark's 40 actions, asked for with 0.5 s (15 ticks)
   of playback left, and two illustrative calls of 5 and 30 ticks. */
const CHUNK_LEN = 40;
const REFILL_TICKS = 15;
const FAST_CALL = 5;
const SLOW_CALL = 30;
const ASK_AT = CHUNK_LEN - REFILL_TICKS;
const FAST_LAND = ASK_AT + FAST_CALL;
const SLOW_LAND = ASK_AT + SLOW_CALL;
const WINDOW = SLOW_LAND + 5;
const TICK_W = 336 / WINDOW;
const tx = (t: number) => 30 + TICK_W * t;

interface ChunkFrame {
  now: number;
  slow: boolean;
  asked: boolean;
  computing: boolean;
  landed: boolean;
  dry: boolean;
}

const CHUNK_FRAMES: ChunkFrame[] = [
  { now: ASK_AT - 12, slow: false, asked: false, computing: false, landed: false, dry: false },
  { now: ASK_AT, slow: false, asked: true, computing: false, landed: false, dry: false },
  { now: ASK_AT + 3, slow: false, asked: true, computing: true, landed: false, dry: false },
  { now: FAST_LAND + 6, slow: false, asked: true, computing: true, landed: true, dry: false },
  { now: ASK_AT + 9, slow: true, asked: true, computing: true, landed: false, dry: false },
  { now: SLOW_LAND - 7, slow: true, asked: true, computing: true, landed: false, dry: true },
];

const CHUNK_STEPS = [
  'The control clock ticks 30 times a second. On every tick the robot computer plays one action from the chunk it holds. The model is idle.',
  'With 0.5 s of playback left, the robot computer sends its latest observation and asks for the next chunk.',
  'The arm keeps moving on the old chunk while the model computes. Here the call takes 5 ticks: the 149.0 ms of the worked example, rounded up.',
  'The new chunk lands. Its first 5 actions cover ticks already played, so they are skipped; real-time chunking made them agree with what the arm did. Playback switches at the join.',
  'The slow case: the same request, but this model needs 1 s, which is 30 ticks. Only 0.5 s of playback remained when it was asked.',
  'The old chunk runs out before the new one lands. The queue is empty, so the arm stops and waits.',
];

function ChunkClock({ step, reduced }: { step: number; reduced: boolean }) {
  const f = CHUNK_FRAMES[Math.min(Math.max(step, 0), CHUNK_FRAMES.length - 1)];
  const fade = (on: boolean): CSSProperties => ({ opacity: on ? 1 : 0, transition: reduced ? 'none' : 'opacity 400ms ease' });
  const oldEnd = f.landed ? FAST_LAND : CHUNK_LEN;
  const oldCells = Array.from({ length: CHUNK_LEN }, (_, i) => i);
  const newCells = Array.from({ length: WINDOW - ASK_AT }, (_, i) => ASK_AT + i);
  const allTicks = Array.from({ length: WINDOW + 1 }, (_, i) => i);
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 276" role="img" aria-labelledby="on-robot-chunks-title" style={{ width: '100%', height: 'auto' }}>
        <title id="on-robot-chunks-title">Action chunks played against the control clock while the model computes the next chunk</title>
        <desc>
          Three lanes share one time axis. The bottom lane is the control clock, one mark per tick. The middle lane is
          the action queue: a row of cells for the chunk in play and, later, a second row for the new chunk. The top
          lane shows when the model is computing. In the fast case the new chunk lands before the old one runs out. In
          the slow case the old chunk runs out first and the arm waits.
        </desc>
        <rect x="0" y="0" width="400" height="276" fill="#fbfbfd" />

        {/* model lane */}
        <rect x="10" y="8" width="380" height="68" rx="4" fill={GPU_FILL} stroke={GPU_INK} strokeWidth="1" />
        <text x="24" y="27" {...TITLE}>
          Policy model
        </text>
        <text x={tx(ASK_AT) - 6} y="46" textAnchor="end" {...LABEL} style={fade(f.asked)}>
          asks for the next chunk
        </text>
        <line x1={tx(ASK_AT)} y1="36" x2={tx(ASK_AT)} y2="116" stroke={NEUTRAL_INK} strokeWidth="1.5" strokeDasharray="4 3" style={fade(f.asked)} />
        <g style={fade(f.computing && !f.slow)}>
          <rect x={tx(ASK_AT)} y="52" width={tx(FAST_LAND) - tx(ASK_AT)} height="16" fill="#ffffff" stroke={GPU_INK} strokeWidth="1.5" />
          <text x={tx(FAST_LAND) + 6} y="64" {...LABEL}>
            computing: 5 ticks
          </text>
        </g>
        <g style={fade(f.computing && f.slow)}>
          <rect x={tx(ASK_AT)} y="52" width={tx(SLOW_LAND) - tx(ASK_AT)} height="16" fill="#ffffff" stroke={GPU_INK} strokeWidth="1.5" />
          <text x={tx((ASK_AT + SLOW_LAND) / 2)} y="64" textAnchor="middle" {...LABEL}>
            computing: 30 ticks
          </text>
        </g>

        {/* queue lane */}
        <rect x="10" y="84" width="380" height="104" rx="4" fill={CPU_FILL} stroke={CPU_INK} strokeWidth="1" />
        <text x="24" y="103" {...TITLE}>
          Action queue
        </text>
        <text x="376" y="103" textAnchor="end" {...LABEL}>
          one cell is one action
        </text>
        {oldCells.map((i) => {
          const played = i < Math.min(f.now, oldEnd);
          const dropped = f.landed && i >= FAST_LAND;
          return (
            <rect
              key={i}
              x={tx(i)}
              y="116"
              width="3.8"
              height="14"
              fill={played ? CPU_INK : '#ffffff'}
              stroke={dropped ? '#aab3bd' : CPU_INK}
              strokeWidth="1"
              strokeDasharray={dropped ? '2 2' : undefined}
            />
          );
        })}
        <g style={fade(f.landed)}>
          {newCells.map((i) => {
            const skipped = i < FAST_LAND;
            const played = !skipped && i < f.now;
            return (
              <rect
                key={i}
                x={tx(i)}
                y="140"
                width="3.8"
                height="14"
                fill={played ? GPU_INK : '#ffffff'}
                stroke={skipped ? '#aab3bd' : GPU_INK}
                strokeWidth="1"
                strokeDasharray={skipped ? '2 2' : undefined}
                opacity={i >= WINDOW - 4 ? 0.4 : 1}
              />
            );
          })}
          <text x={tx(ASK_AT) - 6} y="151.5" textAnchor="end" {...LABEL}>
            new chunk
          </text>
          <line x1={tx(FAST_LAND) - 0.5} y1="110" x2={tx(FAST_LAND) - 0.5} y2="160" stroke={EMPHASIS} strokeWidth="2.5" />
          <text x={tx(FAST_LAND) + 5} y="174" {...LABEL} fill={EMPHASIS} fontWeight="bold">
            join
          </text>
          <text x={tx(FAST_LAND) - 6} y="174" textAnchor="end" {...LABEL}>
            5 skipped: already played
          </text>
        </g>
        <g style={fade(f.dry)}>
          <rect x={tx(CHUNK_LEN)} y="116" width={tx(SLOW_LAND) - tx(CHUNK_LEN)} height="14" fill="none" stroke={STOP_INK} strokeWidth="1.5" strokeDasharray="4 3" />
          <text x={tx((CHUNK_LEN + SLOW_LAND) / 2)} y="174" textAnchor="middle" {...LABEL} fill={STOP_INK} fontWeight="bold">
            queue empty: arm waits
          </text>
        </g>

        {/* clock lane */}
        <rect x="10" y="196" width="380" height="72" rx="4" fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1" />
        <text x="24" y="215" {...TITLE}>
          Control clock
        </text>
        <text x="376" y="215" textAnchor="end" {...LABEL}>
          one mark is one tick
        </text>
        {allTicks.map((i) => (
          <line key={i} x1={tx(i)} y1="226" x2={tx(i)} y2={i % 10 === 0 ? 240 : 235} stroke={ROBOT_INK} strokeWidth="1" />
        ))}
        <text x="24" y="259" {...LABEL} style={fade(!f.dry)}>
          arm moving
        </text>
        <text x="24" y="259" {...LABEL} fill={STOP_INK} fontWeight="bold" style={fade(f.dry)}>
          arm stopped
        </text>

        {/* the playhead: where the clock is now */}
        <g style={{ transform: `translateX(${tx(f.now)}px)`, transition: reduced ? 'none' : 'transform 700ms ease' }}>
          <line x1="0" y1="111" x2="0" y2="159" stroke={INK} strokeWidth="1.5" />
          <line x1="0" y1="222" x2="0" y2="244" stroke={INK} strokeWidth="1.5" />
          <path d="M-5 252 L0 244 L5 252 Z" fill={INK} />
        </g>
        <text x="376" y="259" textAnchor="end" {...LABEL}>
          the marker is now
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 17.3 (static): what runs on the Jetson                           */
/* ------------------------------------------------------------------------ */

const COMPONENT_BOXES = [
  { y: 196, a: 'Token exchange service', b: 'hands out temporary AWS credentials' },
  { y: 242, a: 'Docker application manager', b: 'pulls the container image' },
  { y: 288, a: 'Policy component', b: 'a recipe whose script calls docker run' },
];

const CONTAINER_PARTS = [
  { x: 40, y: 376, t: 'control loop' },
  { x: 204, y: 376, t: 'policy engine' },
  { x: 40, y: 408, t: 'camera reader' },
  { x: 204, y: 408, t: 'servo bus driver' },
];

const HARDWARE = [
  { x: 30, t: 'GPU', fill: GPU_FILL, ink: GPU_INK },
  { x: 146, t: 'USB camera', fill: ROBOT_FILL, ink: ROBOT_INK },
  { x: 262, t: 'servo bus', fill: ROBOT_FILL, ink: ROBOT_INK },
];

function DeviceStack() {
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 524" role="img" aria-labelledby="on-robot-stack-title" style={{ width: '100%', height: 'auto' }}>
        <title id="on-robot-stack-title">What runs on the Jetson: the Greengrass nucleus, its components, the policy container and the hardware it uses</title>
        <desc>
          At the top, outside the device, the AWS IoT Greengrass cloud service. Inside the Jetson, from top to bottom:
          the Greengrass nucleus; three components (the token exchange service, the Docker application manager and
          the policy component); the policy container holding the control loop, the policy engine, the camera reader
          and the servo bus driver; and the hardware the container reaches: the GPU, the USB camera and the servo bus.
        </desc>
        <defs>
          <marker id="on-robot-stack-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 Z" fill={NEUTRAL_INK} />
          </marker>
        </defs>
        <rect x="0" y="0" width="400" height="524" fill="#fbfbfd" />

        {/* the cloud half */}
        <rect x="30" y="10" width="340" height="44" rx="4" fill={NET_FILL} stroke={NET_INK} strokeWidth="1.5" />
        <text x="200" y="28" textAnchor="middle" {...TITLE}>
          AWS IoT Greengrass cloud service
        </text>
        <text x="200" y="45" textAnchor="middle" {...LABEL}>
          holds the list of components this device runs
        </text>
        <line x1="120" y1="124" x2="120" y2="58" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#on-robot-stack-arrow)" />
        <text x="130" y="76" {...LABEL}>
          one outbound connection,
        </text>
        <text x="130" y="91" {...LABEL}>
          opened by the device
        </text>

        {/* the device */}
        <rect x="14" y="100" width="372" height="414" rx="6" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <rect x="30" y="126" width="340" height="44" rx="4" fill={CPU_FILL} stroke={EMPHASIS} strokeWidth="2.5" />
        <text x="200" y="144" textAnchor="middle" {...TITLE}>
          Greengrass nucleus
        </text>
        <text x="200" y="161" textAnchor="middle" {...LABEL}>
          installs, starts and watches components
        </text>

        <text x="30" y="188" {...LABEL}>
          Components
        </text>
        {COMPONENT_BOXES.map((c) => (
          <g key={c.a}>
            <rect x="30" y={c.y} width="340" height="40" rx="4" fill={CPU_FILL} stroke={CPU_INK} strokeWidth="1.5" />
            <text x="42" y={c.y + 16} {...TITLE}>
              {c.a}
            </text>
            <text x="42" y={c.y + 32} {...LABEL}>
              {c.b}
            </text>
          </g>
        ))}
        <line x1="200" y1="328" x2="200" y2="342" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#on-robot-stack-arrow)" />

        {/* the policy container */}
        <rect x="30" y="344" width="340" height="96" rx="4" fill="#ffffff" stroke={GPU_INK} strokeWidth="1.5" />
        <text x="42" y="364" {...TITLE}>
          Policy container (Docker)
        </text>
        {CONTAINER_PARTS.map((p) => (
          <g key={p.t}>
            <rect x={p.x} y={p.y} width="156" height="24" rx="3" fill={p.t === 'policy engine' ? GPU_FILL : CPU_FILL} stroke={p.t === 'policy engine' ? GPU_INK : CPU_INK} strokeWidth="1" />
            <text x={p.x + 78} y={p.y + 16} textAnchor="middle" {...LABEL}>
              {p.t}
            </text>
          </g>
        ))}

        {/* hardware the container reaches */}
        {HARDWARE.map((h) => (
          <g key={h.t}>
            <line x1={h.x + 54} y1="440" x2={h.x + 54} y2="462" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#on-robot-stack-arrow)" />
            <rect x={h.x} y="464" width="108" height="28" rx="4" fill={h.fill} stroke={h.ink} strokeWidth="1.5" />
            <text x={h.x + 54} y="482" textAnchor="middle" {...LABEL}>
              {h.t}
            </text>
          </g>
        ))}
        <text x="200" y="506" textAnchor="middle" {...LABEL}>
          reached through flags the recipe author writes
        </text>
        <text x="372" y="118" textAnchor="end" {...TITLE}>
          The Jetson (JetPack, Ubuntu 24.04)
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 17.4 (static): the three zones of a chunk under real-time chunking */
/* ------------------------------------------------------------------------ */

/* The paper's own example: d = 4 frozen actions, seven guided ones, s = 5 free ones. The decay is drawn
   as an illustration of an exponential schedule, not read off the paper. */
const RTC_WEIGHTS = [1, 1, 1, 1, 0.71, 0.49, 0.32, 0.19, 0.1, 0.04, 0.01, 0, 0, 0, 0, 0];
const RTC_D = 4;
const RTC_FREE_FROM = 11;
const RTC_CELL = 22;
const rx = (i: number) => 30 + RTC_CELL * i;
const RTC_BASE = 118;
const RTC_BAR = 64;

const RTC_ZONES = [
  { name: 'frozen', from: 0, to: RTC_D, fill: EMPHASIS, cell: EMPHASIS, sub: 'd = 4' },
  { name: 'guided', from: RTC_D, to: RTC_FREE_FROM, fill: '#7fb2e5', cell: '#d6e7f8', sub: '' },
  { name: 'free', from: RTC_FREE_FROM, to: RTC_WEIGHTS.length, fill: '#ffffff', cell: '#ffffff', sub: '' },
];

function RtcZones() {
  const zoneOf = (i: number) => RTC_ZONES.find((z) => i >= z.from && i < z.to) ?? RTC_ZONES[2];
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 272" role="img" aria-labelledby="on-robot-rtc-title" style={{ width: '100%', height: 'auto' }}>
        <title id="on-robot-rtc-title">The three zones of a new chunk under real-time chunking: frozen, guided and free</title>
        <desc>
          A row of action slots in playing order. The first four are frozen at a guidance weight of 1, because the arm
          plays them from the old chunk before the new one lands. The next seven are guided, with a weight that falls
          toward 0. The last five lie beyond the end of the old chunk and are generated freely, at weight 0.
        </desc>
        <rect x="0" y="0" width="400" height="272" fill="#fbfbfd" />
        <text x="20" y="22" {...TITLE}>
          Guidance weight on each action of the new chunk
        </text>

        {/* weight axis */}
        <line x1="28" y1={RTC_BASE - RTC_BAR} x2="28" y2={RTC_BASE} stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <line x1="28" y1={RTC_BASE} x2={rx(RTC_WEIGHTS.length)} y2={RTC_BASE} stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <text x="22" y={RTC_BASE - RTC_BAR + 5} textAnchor="end" {...LABEL}>
          1
        </text>
        <text x="22" y={RTC_BASE + 4} textAnchor="end" {...LABEL}>
          0
        </text>

        {/* bars: the weight of each slot */}
        {RTC_WEIGHTS.map((w, i) => {
          const z = zoneOf(i);
          const h = RTC_BAR * w;
          return h > 0 ? (
            <rect key={`b${i}`} x={rx(i) + 3} y={RTC_BASE - h} width={RTC_CELL - 6} height={h} fill={z.fill} stroke={CPU_INK} strokeWidth="1" />
          ) : null;
        })}

        {/* the slots themselves */}
        {RTC_WEIGHTS.map((_, i) => {
          const z = zoneOf(i);
          return <rect key={`c${i}`} x={rx(i) + 1} y="124" width={RTC_CELL - 2} height="20" fill={z.cell} stroke={CPU_INK} strokeWidth="1" />;
        })}

        {/* zone brackets and names */}
        {RTC_ZONES.map((z) => {
          const x0 = rx(z.from) + 2;
          const x1 = rx(z.to) - 2;
          const mid = (x0 + x1) / 2;
          return (
            <g key={z.name}>
              <path d={`M${x0} 150 V156 H${x1} V150`} fill="none" stroke={NEUTRAL_INK} strokeWidth="1.5" />
              <text x={mid} y="172" textAnchor="middle" {...TITLE}>
                {z.name}
              </text>
              {z.sub && (
                <text x={mid} y="188" textAnchor="middle" {...LABEL}>
                  {z.sub}
                </text>
              )}
            </g>
          );
        })}
        <text x="200" y="208" textAnchor="middle" {...LABEL}>
          actions of the new chunk, in the order they play
        </text>

        {/* legend */}
        <text x="20" y="230" {...LABEL}>
          frozen: already played from the old chunk
        </text>
        <text x="20" y="248" {...LABEL}>
          guided: pulled toward the old chunk, less and less
        </text>
        <text x="20" y="266" {...LABEL}>
          free: past the end of the old chunk, new
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

const RECIPE = `RecipeFormatVersion: '2020-01-25'
ComponentName: com.example.MyPrivateDockerComponent
ComponentVersion: '1.0.0'
ComponentDescription: 'A component that runs a Docker container from a private Amazon ECR image.'
ComponentPublisher: Amazon
ComponentDependencies:
  aws.greengrass.DockerApplicationManager:
    VersionRequirement: ~2.0.0
  aws.greengrass.TokenExchangeService:
    VersionRequirement: ~2.0.0
Manifests:
  - Platform:
      os: all
    Lifecycle:
        Run: docker run account-id.dkr.ecr.region.amazonaws.com/repository[:tag|@digest]
    Artifacts:
      - URI: "docker:account-id.dkr.ecr.region.amazonaws.com/repository[:tag|@digest]"`;


const RUN_LINE = `docker run --rm --runtime nvidia --network host \\
  --device /dev/video0 --device /dev/ttyACM0 \\
  account-id.dkr.ecr.region.amazonaws.com/repository[:tag|@digest]`;

export function OnRobot() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Tell from one measured call whether a policy can drive your arm, and what chunked actions, asynchronous calls and a compiled, quantised engine each buy back (NVIDIA's Isaac-GR00T and TensorRT documentation, LeRobot v0.7.0 and the AWS IoT Greengrass guide, read 2026-11-20)"
          >
            17. Running on the Robot: Driving the Arm With a Policy Slower Than Its Clock
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A large robot policy can answer four or five control periods late and still keep the {ARM} supplied
            with an action on every tick as it works to {TASK_STORY}. Take GR00T N1.7, NVIDIA&apos;s robot policy, on a Jetson Orin, a small computer
            built to ride on a robot. Compiled with TensorRT, NVIDIA&apos;s inference compiler, one call takes a
            median of 149.0 ms in NVIDIA&apos;s benchmark, which does not name the Orin module. The arm&apos;s loop plays one
            action every 33.3 ms, its control period (section 3, The Robot as a Computer), so one call spans 149.0 /
            33.3 = 4.5 periods.{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
          </Box>
          <Box variant="p">
            Two things make a call that long usable. Chunked actions spread one call over many ticks: the call
            returns a chunk of future actions, 40 in that benchmark, which the arm plays one per tick
            (section 4, Learning From Demonstrations). Asynchronous inference computes the next chunk while the
            current one plays, so the arm need not stop to wait. Together the two let a call take up to about half of
            what its chunk lasts. A third thing shortens the call itself: compiling the model, and on newer boards
            quantising it. Plain PyTorch takes 357.9 ms for the same call on the same Orin.{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
          </Box>
          <Box variant="p">
            At the median both calls fit. A chunk of 40 actions at 30 Hz lasts 40 / 30 ={' '}
            <Derived>1.33</Derived> s; the compiled call takes 4.5 of its 40 ticks and the PyTorch call 357.9 / 33.3
            = <Derived>10.7</Derived>. The compiler pays off in freshness. Every action of a new chunk was planned
            from a camera frame at least one call old, and each later action in the chunk is a tick older again, so
            a shorter call takes its saving off the age of every action. While the arm carries the block toward the
            cup at the illustrative 0.25 m/s of section 3, it travels <Derived>37</Derived> mm in 149.0 ms and{' '}
            <Derived>89</Derived> mm in 357.9 ms. If the cup is nudged in that time, the arm keeps steering for where
            the cup was, and the cup&apos;s mouth is a few centimetres across. Chunking hides a slow call from the clock and
            leaves its age in every action.{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>{' '}
            <Cite id="F01-83" kind="derived">
              speed times delay
            </Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Count the delay from camera to motor in control periods, budget against the slowest call, and time on your own arm the links no source publishes"
          >
            The policy call is the longest link from camera to motor
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The delay from camera to servo is four waits (section 3): the age of the camera frame, the policy call,
            the network when the policy runs on another computer, and the wait for the next tick&apos;s write.
            The frame alone can be up to one camera frame period old, 33.3 ms, before any processing starts. The benchmark&apos;s figure for the call
            already includes preparing the images and decoding the actions, and leaves out any network hop.{' '}
            <Cite id="F07-118">LeRobot inference guide, sample cadence report</Cite>{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>
          </Box>
          <Box variant="p">
            A latency belongs to its device, runtime, camera count and step count together. The model has two parts
            (section 5, Vision-Language-Action Models): a backbone reads the camera images and the instruction, and
            an action head builds the chunk of actions from that reading over a few passes, its denoising steps,
            whose number is the step count. NVIDIA&apos;s figure holds for its stated conditions: the{' '}
            <code>nvidia/GR00T-N1.7-LIBERO</code> checkpoint (LIBERO is a suite of simulated manipulation tasks),
            batch size 1, four denoising steps and two 256x256 camera images. Each figure is the median of 60 timed
            calls on fixed inputs, with the Jetsons in their maximum power mode, and the table does &quot;not measure
            closed-loop task success&quot;. Change a condition and the figure moves. NVIDIA&apos;s model card times
            the same model on a Jetson Orin with one camera instead of two and prints 216.5 ms: fewer images, and
            still slower, because more than the camera count changed. There TensorRT compiles only the action head,
            on an older TensorRT release, and the backbone runs uncompiled.{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>{' '}
            <Cite id="F07-3">Isaac-GR00T deployment README, measurement details</Cite>{' '}
            <Cite id="F02-40">GR00T N1.7 model card, inference timing table</Cite>
          </Box>
          <Box variant="p">
            A median or a mean is the typical call, and the arm feels the slowest one, because the chunk in play has
            to cover it. The table gives medians only. An illustrative sample report in LeRobot&apos;s documentation,
            from a 30 Hz rollout on hardware it does not name, shows how far apart the two can sit: inference
            averaged 5.18 ms and its worst call took 40.00 ms, a stall of about <Derived>35</Derived> ms on top of
            the typical call.{' '}
            <Cite id="F07-3">Isaac-GR00T deployment README, measurement details</Cite>{' '}
            <Cite id="F07-23">LeRobot inference guide, cadence reporting</Cite>
          </Box>
          <Box variant="p">
            When the policy runs on another computer, the network and the CPU beside the arm join the chain. The
            authors of real-time chunking (RTC), a method of asynchronous inference that makes each new chunk
            continue the motion already under way, timed 50 calls of a policy served from a workstation over wired
            Ethernet, once with a desktop robot computer and once with a small on-robot one, an Intel NUC. The
            model&apos;s time barely moved between the two, yet the NUC&apos;s chain took 138.98 ms against 108.76 ms,
            about <Derived>30</Derived> ms more, most of it in its network link and in resizing the images on its
            CPU.{' '}
            <Cite id="F07-12">LeRobot real-time chunking guide</Cite>{' '}
            <Cite id="F07-68">Real-time chunking paper, appendix A.3, table 2</Cite>
          </Box>
          <Box variant="p">
            The computer beside the arm is part of the budget even when the GPU is elsewhere. How far the slowest
            call sits from the typical one depends on the setup, so measure it on yours: across these 50 calls the
            model&apos;s time varied by only about 0.2 ms, and the network brought the jitter, 2 to 3 ms.{' '}
            <Cite id="F07-68">Real-time chunking paper, appendix A.3, table 2</Cite>
          </Box>
          <Figure
            cites="F07-1 F07-5 F07-68 F07-118"
            caption={
              <>
                Each gridline is one tick of the 30 Hz loop. Top: NVIDIA&apos;s medians for one compiled GR00T N1.7
                call on the Jetson Orin, the larger Jetson AGX Thor and the DGX Spark, a desk-side machine. Bottom:
                the chain the RTC authors measured for a policy served from a workstation, split into model,
                network, image resize and other: 97.43, 6.89, 1.44 and 3.00 ms with the desktop robot computer,
                96.89, 21.20, 11.22 and 9.67 ms with the NUC.
              </>
            }
          >
            <BudgetChart />
          </Figure>
          <Box variant="p">
            LeRobot&apos;s guides give no timing for camera exposure, the USB transfer or the servo bus write on an{' '}
            {ARM}. Its cadence report, the per-stage timing a LeRobot rollout prints, covers both ends on your own
            arm: the observe line times the camera reads and
            the send line the motor write.{' '}
            <Cite id="F07-118">LeRobot inference guide, sample cadence report</Cite>{' '}
            <Cite id="F07-23">LeRobot inference guide, cadence reporting</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Work out from the chunk length and one measured call whether the arm ever waits, and set when the robot computer asks for the next chunk"
          >
            Asynchronous calls stretch the deadline to half a chunk
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            How the next call is scheduled decides what the arm does while the model works. Synchronous inference,
            LeRobot&apos;s default, blocks the loop until the call returns, so &quot;the robot stops moving every time
            the policy computes its next chunk of actions&quot;. The pauses also change the arm&apos;s dynamics, so
            the policy meets motion its training data never showed. Asynchronous inference starts the next
            call early, while the current chunk is still playing.{' '}
            <Cite id="F01-87">LeRobot remote inference guide and inference guide</Cite>{' '}
            <Cite id="F07-62">Real-time chunking paper, section 2</Cite>
          </Box>
          <Box variant="p">
            On the benchmark&apos;s medians an Orin running synchronously stops for
            149.0 ms after every 40 actions, so it is idle 149.0 / (<Derived>1,333</Derived> + 149.0) ={' '}
            <Derived>10</Derived>% of the time, in a visible stop every <Derived>1.5</Derived> s. With the PyTorch
            call it is idle <Derived>21</Derived>% of the time.{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
          </Box>
          <Box variant="p">
            Asynchronous inference has one condition, and no setting relaxes it. The arm keeps playing while a call
            runs, so when the new chunk lands its first actions are already in the past and are dropped.
            LeRobot&apos;s tuning rule is that what remains must cover the next call. Write <M>H</M> for the chunk length in actions,{' '}
            <M>{String.raw`\Delta t`}</M> for the control period and <M>L</M> for the time one call takes, from
            sending the observation to receiving the chunk.
          </Box>
          <Formula
            name="The half-chunk rule: LeRobot's tuning rule in symbols"
            tex={String.raw`H\,\Delta t \;-\; L \;\ge\; L \quad\Longrightarrow\quad L \;\le\; \tfrac{1}{2}\,H\,\Delta t`}
            source={<Cite id="F07-22">LeRobot remote inference guide, tuning</Cite>}
          />
          <Box variant="p">
            <M>{String.raw`H\,\Delta t`}</M> is what the chunk lasts. Subtracting <M>L</M> leaves the part still to
            play when the chunk lands, and the <M>L</M> on the right is the next call it has to cover. LeRobot&apos;s
            remote inference guide gives the failing case: &quot;If inference takes 1 second out of a 1.67-second
            prediction, only about 0.67 seconds remain. Another 1-second request cannot fit; no refill value fixes
            that.&quot; Its remedies are a shorter call, a longer chunk or a different action rate. For a chunk of 40
            the call may take about <Derived>20</Derived> ticks, a little less once a tick of margin is kept.
            NVIDIA&apos;s compiled Orin median takes 4.5, so a worst call up to about four times the median still
            fits.{' '}
            <Cite id="F07-22">LeRobot remote inference guide, tuning</Cite>{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
          </Box>
          <Box variant="p">
            Do this arithmetic again with your own call, timed on the software you will run, because the Orin
            figure and LeRobot&apos;s settings come from different stacks. NVIDIA timed GR00T N1.7 on its own
            TensorRT path, which on an Orin needs JetPack 7.2 (JetPack is NVIDIA&apos;s bundle of Linux, GPU drivers
            and libraries for Jetsons), while LeRobot&apos;s Jetson container targets JetPack 6.2; and LeRobot
            v0.7.0, though it wraps GR00T N1.7, attaches its RTC configuration to pi0, pi0.5, pi0-FAST and SmolVLA,
            so the RTC values worked below are the arithmetic for any policy with GR00T&apos;s call time, not a GR00T
            setup LeRobot documents.{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>{' '}
            <Cite id="F07-9">Isaac-GR00T deployment README, platform setup</Cite>{' '}
            <Cite id="F07-34">LeRobot installation guide, Jetson note</Cite>{' '}
            <Cite id="F02-47">LeRobot configuration_groot.py</Cite>{' '}
            <Cite id="F07-15">LeRobot real-time chunking guide, key parameters</Cite>
          </Box>
          <Box variant="p">
            LeRobot v0.7.0 ships the asynchronous pattern in two forms. Local RTC runs the method on the robot
            computer itself, the policy in a background thread with no network in the path. Remote
            inference moves the checkpoint to a policy server, for example a DGX Spark on the desk, while cameras,
            motors and recording stay on the robot computer and &quot;the remote client does not load weights&quot;.
            The two sides talk over Zenoh, a publish/subscribe network protocol that carries observations one way and
            chunks back.{' '}
            <Cite id="F01-40">LeRobot inference guide, inference backends</Cite>{' '}
            <Cite id="F07-25">LeRobot remote inference guide, installation</Cite>
          </Box>
          <Box variant="p">
            The robot computer decides when to ask for the next chunk. Ask too late and the queue empties; ask too
            early and most of each chunk is thrown away unplayed. LeRobot&apos;s rule takes three quantities:{' '}
            <code>refill_seconds</code>, your setting for how much playback may remain when it asks (default 0.5 s);
            the turnaround, the measured round trip from encoding through network, queueing and inference to
            decoding; and <code>fps</code>, the action rate.
          </Box>
          <Formula
            name="When the client asks for the next chunk"
            tex={String.raw`\small \begin{aligned} &\text{effective refill} = \max(\text{set},\ \text{floor}) \\ &\text{set} = \texttt{refill\_seconds} \\ &\text{floor} = \text{recent maximum turnaround} \\ &\qquad\quad + 1 / \texttt{fps} \end{aligned}`}
            source={<Cite id="F07-26">LeRobot remote inference guide, parameters</Cite>}
          />
          <Box variant="p">
            The first term is your preference and the second a floor from measurement: the slowest recent round trip
            plus one tick of margin. At 30 Hz the 0.5 s default has the client ask with <Derived>15</Derived> actions
            left (0.5 s x 30 actions a second), and it holds until the slowest round trip passes 0.5 - 0.033 ={' '}
            <Derived>0.467</Derived> s, more than three times the 138.98 ms chain the real-time chunking authors
            measured with a small on-robot computer. Past that the floor rises and the client asks earlier; no
            refill value rescues a call that breaks the half-chunk rule.{' '}
            <Cite id="F07-26">LeRobot remote inference guide, parameters</Cite>{' '}
            <Cite id="F07-68">Real-time chunking paper, appendix A.3, table 2</Cite>
          </Box>
          <AnimatedFigure
            name="chunks against the control clock"
            steps={CHUNK_STEPS}
            intervalMs={2800}
            cites="F07-2 F07-5 F07-22 F07-26 F07-65"
            caption={
              <>
                A call of 5 ticks, asked with 0.5 s of playback left, lands with actions to spare (steps 1 to 4); a
                call of 30 ticks, longer than the <Derived>15</Derived> ticks of playback left when it was asked,
                lands after the queue has run dry (steps 5 and 6). The chunk is the benchmark&apos;s 40 actions, so
                the slow call also breaks the half-chunk rule of <Derived>20</Derived> ticks, and no refill value
                would save it. The call times are illustrative.
              </>
            }
          >
            {(step, reduced) => <ChunkClock step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            A remote client then joins the new chunk to its queue. The default join, <code>aligned</code>, drops
            the incoming actions whose time has passed and replaces only the future, which reduces backward bumps
            between chunks: the arm does not replay steps it has already moved past. The <code>append</code> join,
            which LeRobot offers as a baseline, plays out the rest of the old chunk and then starts the new one at
            its first action, so every action of the new chunk plays late by the actions that were left when
            the request went out: <Derived>15</Derived> ticks, half a second, in the animation&apos;s fast case. A checkpoint that supports RTC can join chunks by
            RTC instead, where inference itself conditions on the actions still to play.{' '}
            <Cite id="F07-27">LeRobot remote inference guide, modes</Cite>
          </Box>
          <Box variant="p">
            The refill setting also decides how stale the actions get. With the aligned join, each action plays as
            many ticks after its camera frame as its place in the chunk. In the animation&apos;s fast case the next
            request goes out with <Derived>15</Derived> actions left, at action 40 - <Derived>15</Derived> ={' '}
            <Derived>25</Derived>, and the arm plays on through the 5-tick call, so the last action it plays from a
            chunk is about action <Derived>25</Derived> + 5 = <Derived>30</Derived>, a second after the frame it was
            planned from:{' '}
            <Derived>250</Derived> mm of travel at the illustrative 0.25 m/s. Compiling takes the call&apos;s part
            off every action, the <Derived>52</Derived> mm between the compiled and the PyTorch call; the refill
            setting governs the larger part. LeRobot&apos;s note on <code>refill_seconds</code> gives the trade:
            &quot;Higher usually requests earlier; lower allows more of the plan to execute.&quot;{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>{' '}
            <Cite id="F07-26">LeRobot remote inference guide, parameters</Cite>{' '}
            <Cite id="F01-83" kind="derived">
              speed times delay
            </Cite>
          </Box>
          <Box variant="p">
            The network adds its own share of the turnaround. Camera frames travel as raw RGB by default, about 1.8
            MB for two 640x480 frames, which is about <Derived>15</Derived> ms of every turnaround on a gigabit link;
            try JPEG at quality 90, then compare turnaround and task quality. A congested link drops observations
            rather than blocking motor commands. The remote path has run five policy types on real robots, ACT (section 4) and SmolVLA
            among them, but a router, a private hosted GPU or a Hugging Face Space &quot;has not been validated
            yet&quot;, so time the full turnaround on any new network: &quot;a working transport alone does not
            establish a usable motion budget&quot;.{' '}
            <Cite id="F07-28">LeRobot remote inference guide, bandwidth</Cite>{' '}
            <Cite id="F07-29">LeRobot remote inference guide, supported policies and robots</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Set inference_delay, execution_horizon and the guidance mode from your measured call, and choose whether to pay for a smooth hand-over at run time or at training time"
          >
            Real-time chunking freezes what the arm will already have played
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Starting early leaves a seam between chunks. The new chunk was planned from a frame several ticks old,
            and nothing ties it to the motion in progress. In the real-time chunking paper&apos;s figure the chunk
            being played goes over an obstacle and the new one goes under it, so the hand-over &quot;may be
            arbitrarily discontinuous and out-of-distribution&quot;, a jerk that gets worse as the delay grows.{' '}
            <Cite id="F07-64">Real-time chunking paper, section 2 and figure 2</Cite>
          </Box>
          <Box variant="p">
            RTC treats the start of the new chunk as inpainting, the image-editing task of filling a missing region so
            that it matches its surroundings. The paper counts the call in whole ticks, rounded down, as the inference
            delay <M>{String.raw`d = \lfloor L / \Delta t \rfloor`}</M>: the 149.0 ms Orin median is{' '}
            <Derived>4.47</Derived> ticks, so <M>d</M> = 4. The first <M>d</M> actions of the new
            chunk will have been played from the old chunk by the time it lands, so they are frozen to the old
            values.{' '}
            <Cite id="F07-13">LeRobot real-time chunking guide, how RTC works</Cite>{' '}
            <Cite id="F07-63">Real-time chunking paper, section 2</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>{' '}
            <Cite id="F07-65">Real-time chunking paper, section 3 and figure 3</Cite>
          </Box>
          <Box variant="p">
            Freezing only those is not enough: when <M>d</M> is small, the new chunk can still switch strategy. The
            actions that overlap the old chunk are therefore pulled toward it too, with a weight that decays from 1
            to 0, because &quot;actions further in the future should be treated with more uncertainty&quot;. The
            actions past the old chunk&apos;s end have no counterpart and are generated freely.{' '}
            <Cite id="F07-65">Real-time chunking paper, section 3 and figure 3</Cite>{' '}
            <Cite id="F07-66">Real-time chunking paper, section 3.2</Cite>
          </Box>
          <Figure
            cites="F07-65 F07-66"
            caption={
              <>
                Each column is one action of the new chunk, in the order the arm will play it; bar height is the
                weight pulling it toward the old chunk. The layout is the paper&apos;s example, a delay of 4 ticks
                with 7 guided actions and 5 free ones; the shape of the decay is illustrative.
              </>
            }
          >
            <RtcZones />
          </Figure>
          <Box variant="p">
            The pull acts inside the denoising. A flow-matching head (section 4) builds a chunk from noise in a few
            steps, and at each step RTC adds a term that drags the weighted positions toward the old chunk. To know
            which way to move the half-built chunk so that the finished one matches, it needs the gradient of the
            model&apos;s output with respect to its input: a backward pass through the model, the computation
            training uses, at every step. The authors measured that cost on pi0.5, Physical Intelligence&apos;s
            vision-language-action model (VLA, section 5): on an RTX 4090 each denoising step got 2.5 times slower
            and the whole call went from 76 ms to 97 ms, <Derived>28</Derived>% slower. The backbone&apos;s reading of the images and the instruction,{' '}
            <Derived>62</Derived> ms of the 76, does not change.{' '}
            <Cite id="F07-13">LeRobot real-time chunking guide, how RTC works</Cite>{' '}
            <Cite id="F07-67">Real-time chunking paper, appendix A.3, tables 1 and 3</Cite>
          </Box>
          <Box variant="p">
            The same authors paid that cost on real robots and measured what it bought. They ran pi0.5 with
            50-action chunks on 50 Hz two-armed robots, the 97 ms call served over a LAN that added 10 to 20 ms, for
            a starting delay of about 6 ticks; injecting 100 ms and 200 ms more raised it to about 11 and 16 ticks,
            and 16 ticks at 50 Hz is <Derived>320</Derived> ms. Over 480 episodes and 28 hours of robot time, RTC showed &quot;no
            degradation&quot; as the delay was added, while synchronous inference &quot;degrades linearly&quot;
            with it. Temporal ensembling
            (section 4&apos;s weighted average of overlapping chunks) could not run at either added delay: it
            oscillated hard enough to trigger the robot&apos;s protective stop.{' '}
            <Cite id="F07-69">Real-time chunking paper, section 4.2</Cite>
          </Box>
          <Box variant="p">
            LeRobot v0.7.0 exposes the zones as settings. <code>inference_delay</code> is <M>d</M>, passed with
            every call because it varies at run time: 4 for the Orin median, or 5 if you round its <Derived>4.47</Derived> ticks up,
            which freezes one action more, the safer side when calls run longer than the median.{' '}
            <Cite id="F07-15">LeRobot real-time chunking guide, key parameters</Cite>{' '}
            <Cite id="F07-63">Real-time chunking paper, section 2</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
          </Box>
          <Box variant="p">
            <code>execution_horizon</code> is how many actions of the old chunk the new one must stay consistent
            with: the frozen and guided zones together, 11 in the figure. It is 10 by default, typically 8 to 12,
            smoother when higher and slower to react. LeRobot&apos;s decaying schedules run from{' '}
            <code>inference_delay</code> to <code>execution_horizon</code>, so the guided zone is the gap between
            the two settings.{' '}
            <Cite id="F07-14">LeRobot configuration_rtc.py</Cite>{' '}
            <Cite id="F07-15">LeRobot real-time chunking guide, key parameters</Cite>{' '}
            <Cite id="F07-16">LeRobot real-time chunking guide, prefix schedules</Cite>{' '}
            <Cite id="F07-65">Real-time chunking paper, section 3 and figure 3</Cite>
          </Box>
          <Box variant="p">
            The measured call therefore sets the floor for <code>execution_horizon</code>. Written in
            LeRobot&apos;s names, the paper&apos;s constraint is that <code>execution_horizon</code> lies between{' '}
            <code>inference_delay</code> and the chunk length minus <code>inference_delay</code> (our mapping of its
            symbols). For a chunk of 40 at the compiled Orin median that is 4 to <Derived>36</Derived>: the default
            10 fits with 6 actions guided, and at this chunk length only the lower bound binds. The PyTorch call,{' '}
            <Derived>10.7</Derived> ticks, puts <code>inference_delay</code> at 10 or, rounded up, 11, where the
            default leaves no guided zone or breaks the constraint, so raise <code>execution_horizon</code> with
            the call.{' '}
            <Cite id="F07-63">Real-time chunking paper, section 2</Cite>{' '}
            <Cite id="F07-65">Real-time chunking paper, section 3 and figure 3</Cite>{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>{' '}
            <Cite id="F07-14">LeRobot configuration_rtc.py</Cite>
          </Box>
          <Box variant="p">
            Two more settings shape the pull. <code>max_guidance_weight</code> caps how hard it holds the new chunk
            to the old one, 10.0 by default, the value LeRobot gives for the 10-step flow matching of SmolVLA, pi0
            and pi0.5. The GR00T call in NVIDIA&apos;s benchmark takes four denoising steps, and LeRobot&apos;s guide
            gives no value for a four-step head, so on such a policy treat 10.0 as a starting point and sweep it. The
            shape of the decay is{' '}
            <code>prefix_attention_schedule</code>, and the code and the documentation disagree on it. The code
            defaults to <code>LINEAR</code>, with a to-do comment to change it; the documentation recommends{' '}
            <code>EXP</code>, the paper&apos;s exponential, for getting started. The code is what runs, so pass the
            schedule explicitly.{' '}
            <Cite id="F07-14">LeRobot configuration_rtc.py</Cite>{' '}
            <Cite id="F07-15">LeRobot real-time chunking guide, key parameters</Cite>{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>{' '}
            <Cite id="F07-16">LeRobot real-time chunking guide, prefix schedules</Cite>
          </Box>
          <Box variant="p">
            The guidance cost can move into training instead. Training-time RTC, a later paper, gives each training
            example a random delay <M>d</M>, hands the model the first <M>d</M> actions clean and trains it to
            generate the rest. At run time the prefix is fed in, with no guidance and no backward pass. Its authors
            trained with delays of 0 to 10 ticks, &quot;which supports a maximum latency of 200ms on a 50Hz
            robot&quot;, and in simulation it beat the guided version at delays of 2 ticks or more.{' '}
            <Cite id="F07-70">Training-time RTC paper, section III</Cite>{' '}
            <Cite id="F07-71">Training-time RTC paper, section IV.B</Cite>{' '}
            <Cite id="F07-72">Training-time RTC paper, section IV.A</Cite>
          </Box>
          <Box variant="p">
            In LeRobot that is the <code>trained</code> mode, and it turns the latency budget into a training
            setting. It needs a pi0.5 checkpoint trained with <code>rtc_training_max_delay</code> above 0, and refuses
            to start unless{' '}
            <code>rtc_training_max_delay &lt;= execution_horizon &lt;= prediction_steps - rtc_training_max_delay</code>
            , the same constraint with the trained delay in place of <code>inference_delay</code> and{' '}
            <code>prediction_steps</code> as the chunk length. A checkpoint trained for up to 10 ticks of delay covers 200 ms on a 50 Hz robot and{' '}
            <Derived>333</Derived> ms on this 30 Hz arm. The default <code>guided</code> mode works with ordinary
            flow-matching checkpoints, with no retraining.{' '}
            <Cite id="F07-17">LeRobot real-time chunking guide, modes</Cite>{' '}
            <Cite id="F07-18">LeRobot configuration_rtc.py, trained-mode admission</Cite>{' '}
            <Cite id="F07-71">Training-time RTC paper, section IV.B</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Compile first and quantise second: on Thor a rewrite of the model's graph saved twice what four-bit numbers did, and on a Jetson every engine must be built on the type of board that runs it"
          >
            Compiling and rewriting the graph buy more than fewer bits do
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Chunking makes a slow call tolerable; compiling and quantising make it shorter. TensorRT takes a model
            graph, usually an ONNX (Open Neural Network Exchange) file, the portable format a trained checkpoint is
            exported to, and picks a GPU implementation for every layer by timing candidates on the machine doing
            the build. The result is a file called an engine. For GR00T N1.7 there are seven engines, one per
            sub-network from the vision encoder to the action decoder, and NVIDIA recommends compiling the full
            pipeline because the backbone &quot;dominates inference time&quot;.{' '}
            <Cite id="F07-76">TensorRT 11.5 release notes</Cite>{' '}
            <Cite id="F07-7">Isaac-GR00T deployment README, TensorRT acceleration</Cite>
          </Box>
          <Box variant="p">
            In NVIDIA&apos;s table, compiling cut one call from 357.9 ms to 149.0 ms on the Jetson Orin, from 200.8
            ms to 116.6 ms on the DGX Spark and from 106.8 ms to 76.8 ms on the Jetson AGX Thor: factors of{' '}
            <Derived>2.4</Derived>, <Derived>1.7</Derived> and <Derived>1.4</Derived>. In this table compiling paid
            most where the call was longest: on the Orin it saves <Derived>208.9</Derived> ms, the largest saving in the table.{' '}
            <Cite id="F07-1">Isaac-GR00T deployment README, benchmark table</Cite>
          </Box>
          <Box variant="p">
            Quantisation stores a model&apos;s numbers in fewer bits, so each layer moves less memory and does cheaper
            arithmetic. A floating-point number splits its bits between an exponent, which sets how large or small it
            can get, and a mantissa, which sets how finely it is stored. These policies default to BF16, a
            sixteen-bit format that keeps the eight-bit exponent of FP32 (single-precision floating point) and gives up mantissa
            bits. FP16, the other sixteen-bit format, has a five-bit exponent, and NVIDIA&apos;s pi0.5 tutorial rules
            it out because it overflows in the attention layers, an error that &quot;compounds over the denoising
            loop&quot;.{' '}
            <Cite id="F07-4">Isaac-GR00T deployment README, Thor quantisation</Cite>{' '}
            <Cite id="F07-53">Jetson AI Lab, OpenPi on Thor tutorial, precision note</Cite>
          </Box>
          <Box variant="p">
            Below sixteen bits, FP8 is a sign bit, four exponent bits and three mantissa bits, and FP4 is a sign bit,
            two exponent bits and one mantissa bit. Four bits make only 2 x 2 x 2 x 2 = <Derived>16</Derived>{' '}
            patterns, so an FP4 number can take a handful of values, and a layer quantised to it needs those few
            values placed where its numbers lie. NVFP4 is that FP4 with a scale factor per block of numbers, which
            fits the handful to each block&apos;s own range, and the Blackwell-generation GPU in Thor runs it natively.
            NVIDIA credits NVFP4, floating point with a scale per block, with 4-bit quantisation &quot;without the accuracy collapse you would
            get from 4-bit integer formats&quot;.{' '}
            <Cite id="F07-81">TensorRT documentation, quantized types</Cite>{' '}
            <Cite id="F07-58">Jetson AI Lab, GR00T N1.7 on Thor tutorial</Cite>
          </Box>
          <Box variant="p">
            No engine is one precision throughout: GR00T N1.7&apos;s vision encoder stays at FP32 &quot;for
            accuracy&quot;, and under NVFP4 the accuracy-sensitive layers stay at FP8. Choosing the scales takes data.
            NVIDIA&apos;s recipe runs 10 samples of real robot data through the model, so the build needs recordings
            from your robot.{' '}
            <Cite id="F07-7">Isaac-GR00T deployment README, TensorRT acceleration</Cite>{' '}
            <Cite id="F07-57">Jetson AI Lab, GR00T N1.7 on Thor tutorial, how the optimisation works</Cite>{' '}
            <Cite id="F07-58">Jetson AI Lab, GR00T N1.7 on Thor tutorial</Cite>
          </Box>
          <Box variant="p">
            On the Thor, NVIDIA reports 35.6 ms for the call with mixed NVFP4 and its optimised execution profile,
            against 76.8 ms for the plain engine: a factor of 2.16, and just over one control period. The profile
            caches what the action head reads from the backbone, fuses projections (runs several matrix
            multiplications as one GPU kernel) and replays the GPU work as CUDA graphs (a sequence of kernel
            launches recorded once and started with one call). NVIDIA&apos;s Thor tutorial splits the same kind of
            saving by part, timed with one camera where the README uses two: quantisation shrank the backbone from
            27 to 13.6 ms, and a precision-independent rewrite of the graph shrank the action head from 45 to 17.2
            ms. The rewrite computes once what the head reads from the backbone, which does not change between
            denoising steps, so it saved <Derived>27.8</Derived> ms to the bits&apos; <Derived>13.4</Derived>: fewer
            bits are the smaller part of the saving.{' '}
            <Cite id="F07-4">Isaac-GR00T deployment README, Thor quantisation</Cite>{' '}
            <Cite id="F07-57">Jetson AI Lab, GR00T N1.7 on Thor tutorial, how the optimisation works</Cite>
          </Box>
          <Box variant="p">
            NVIDIA&apos;s pi0.5 tutorial on the same Thor, with chunks of 10 actions (its action horizon), shows how
            far the bits go:
            about 132 ms in PyTorch BF16, about 54 ms as an FP8 TensorRT engine and about 49 ms with FP8 plus NVFP4.
            Compiling and dropping to FP8 together bought <Derived>2.4</Derived> times, and four-bit layers on top
            took off about 5 ms more.{' '}
            <Cite id="F07-51">Jetson AI Lab, OpenPi on Thor tutorial</Cite>{' '}
            <Cite id="F07-4">Isaac-GR00T deployment README, Thor quantisation</Cite>
          </Box>
          <Box variant="p">
            Whether the robot still succeeds on a quantised engine rests on thin evidence. NVIDIA&apos;s README runs
            one LIBERO task for 20 episodes on an H100: PyTorch 20 of 20,
            the TensorRT engine 19 of 20, and that engine was unquantised BF16. It has no success figure for the NVFP4
            engine or for any Jetson.{' '}
            <Cite id="F07-10">Isaac-GR00T deployment README, LIBERO closed-loop evaluation</Cite>
          </Box>
          <Box variant="p">
            NVIDIA&apos;s Thor tutorial states that task success is unchanged and prints no rate or episode count. The
            pi0.5 tutorial checks only that the quantised outputs point the same way as PyTorch&apos;s, by cosine
            similarity (1.0 is the same direction): about 0.9995 for FP8 alone and 0.9946 once the four-bit layers
            are added, a score that would fail the 0.999 NVIDIA&apos;s GR00T verify step expects. Twenty episodes
            cannot tell 19 of 20 (<Derived>95</Derived>%) from 20 of 20, so treat a quantised engine as a new policy and evaluate it as
            section 16, Evaluation, describes.{' '}
            <Cite id="F07-59">Jetson AI Lab, GR00T N1.7 on Thor tutorial</Cite>{' '}
            <Cite id="F07-52">Jetson AI Lab, OpenPi on Thor tutorial, accuracy check</Cite>{' '}
            <Cite id="F07-8">Isaac-GR00T deployment README, build notes</Cite>{' '}
            <Cite id="F07-10">Isaac-GR00T deployment README, LIBERO closed-loop evaluation</Cite>
          </Box>
          <Box variant="p">
            TensorRT ties an engine to the GPU type that built it. The engine records the TensorRT version and the
            GPU&apos;s compute capability, a number naming the GPU generation (8.7 for Jetson AGX Orin, 11.0 for Jetson AGX
            Thor, 12.1 for DGX Spark), and on a mismatch it &quot;will fail to deserialize&quot;. An engine copied
            from a Thor robot to an Orin robot is refused when it loads, before it can drive anything.{' '}
            <Cite id="F07-77">TensorRT documentation, Engine Compatibility</Cite>{' '}
            <Cite id="F07-79">TensorRT documentation, compatibility checks and support matrix</Cite>
          </Box>
          <Box variant="p">
            A lab with both Jetson types therefore keeps one set of ONNX files and builds two sets of engines on the
            devices themselves, about 2 to 5 minutes a build, each checked against PyTorch (NVIDIA&apos;s verify step
            expects a cosine similarity of 0.999 or more). A JetPack update that changes the TensorRT version means
            building again. On JetPack there is no way around the rule. Elsewhere the way around it is a hardware
            compatibility mode, which TensorRT 11.5.0 adds only on Arm server-class Linux, the category the DGX Spark
            belongs to. NVIDIA&apos;s GR00T guide pins the Spark to an older TensorRT, 10.16.1.11, so check the
            installed version before counting on the mode.{' '}
            <Cite id="F07-8">Isaac-GR00T deployment README, build notes</Cite>{' '}
            <Cite id="F07-76">TensorRT 11.5 release notes</Cite>{' '}
            <Cite id="F07-77">TensorRT documentation, Engine Compatibility</Cite>{' '}
            <Cite id="F07-9">Isaac-GR00T deployment README, DGX Spark setup</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Rule boards out by shared memory and bandwidth, then buy on a timed call of your policy, since no spec sheet predicts it"
          >
            Choosing the computer beside the arm: memory filters, a timed call decides
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On a Jetson the CPU and the GPU share one pool of memory, and that pool holds everything: the operating
            system, the control loop, the camera frames and the policy&apos;s weights. The smallest board, the Jetson
            Orin Nano Super Developer Kit, has 8 GB in that pool, at 102 GB/s. pi0.5, the policy of NVIDIA&apos;s
            Thor tutorial, lists about 6 GB or more of weights among its storage prerequisites, at a precision the
            tutorial does not state, and GR00T N1.7 is about 3 billion parameters in BF16, about{' '}
            <Derived>6</Derived> GB at two bytes each. Loaded at that size, a policy leaves little of the board for
            anything else. Bandwidth sets a lower bound too: a call reads every weight at least once, so at 6 GB and
            102 GB/s it takes at least 6 / 102 = <Derived>59</Derived> ms, almost two control periods, before any
            arithmetic; an engine quantised to fewer bits reads fewer bytes and lowers the bound.{' '}
            <Cite id="F07-36">NVIDIA Jetson Orin Nano Super Developer Kit page</Cite>{' '}
            <Cite id="F07-54">Jetson AI Lab, OpenPi on Thor tutorial, prerequisites</Cite>{' '}
            <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite>
          </Box>
          <Box variant="p">
            That bound is a minimum, and the figure to plan with is a timed call. For the smallest board there is
            none to borrow: NVIDIA&apos;s table says &quot;Jetson Orin&quot; without naming the module, and the
            SmolVLA paper and LeRobot&apos;s guides give no latency on a Jetson Orin Nano for SmolVLA or ACT, two
            policies LeRobot ships.{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>{' '}
            <Cite id="F07-117">SmolVLA paper and LeRobot v0.7.0 guides, searched for a latency figure</Cite>
          </Box>
          <Box variant="p">
            No single spec predicts that call, so buy on measured calls. NVIDIA&apos;s Thor page claims 7.5 times
            the performance of the AGX Orin, and the Thor&apos;s memory bandwidth is 273 / 204.8 ={' '}
            <Derived>1.33</Derived> times the AGX Orin 64GB&apos;s. A third-party paper measured GR00T N1.7 at 209.9
            ms on an AGX Orin and 101.1 ms on an AGX Thor, <Derived>2.08</Derived> times, with an older software
            stack and only the action head compiled, and NVIDIA&apos;s own table gives 1.94 times for its unnamed Orin: if that is an AGX Orin, as is likely but not stated, far below the peak claim and above the bandwidth ratio.{' '}
            <Cite id="F07-39">NVIDIA Jetson Thor page, specifications</Cite>{' '}
            <Cite id="F07-35">NVIDIA Jetson Orin page, specifications</Cite>{' '}
            <Cite id="F07-73">Perturbation Informed Execution paper, table 6</Cite>{' '}
            <Cite id="F07-74">Perturbation Informed Execution paper, inference configurations</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
          </Box>
          <Box variant="p">
            The DGX Spark has the Thor&apos;s 128 GB at 273 GB/s and is still slower on this policy, 116.6 ms against
            76.8 ms compiled in the same table, so budget on a board&apos;s timed call, not on its memory. NVIDIA&apos;s
            README gives no reason for the gap. One difference the guide does state is software: the Spark runs a
            separate dependency stack, on the older TensorRT pinned for it. Served from the desk, it also pays the
            network, 6.89 ms to 21.20 ms in the measured chain.{' '}
            <Cite id="F07-47">DGX Spark User Guide, hardware overview</Cite>{' '}
            <Cite id="F07-6">Isaac-GR00T deployment README, benchmark table</Cite>{' '}
            <Cite id="F07-9">Isaac-GR00T deployment README, DGX Spark setup</Cite>{' '}
            <Cite id="F07-68">Real-time chunking paper, appendix A.3, table 2</Cite>
          </Box>
          <Box variant="p">
            Which savings a board can take depends on its GPU. The Thor&apos;s Blackwell GPU runs NVFP4 natively,
            and the Thor is the only device in the table with a quantised figure, 35.6 ms; the table has none for
            the DGX Spark, and an Orin has only the compiled 149.0 ms. Under
            JetPack 7.2 the Thor can also give the policy a GPU partition of its own (MIG, Multi-Instance GPU, two
            isolated instances with their own compute, cache and memory bandwidth), so a best-effort model, one whose
            timing does not matter, can share the board without slowing it.{' '}
            <Cite id="F07-4">Isaac-GR00T deployment README, Thor quantisation</Cite>{' '}
            <Cite id="F07-58">Jetson AI Lab, GR00T N1.7 on Thor tutorial</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>{' '}
            <Cite id="F07-46">NVIDIA JetPack 7.2 blog, MIG</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={TH}>Device</th>
                  <th style={TH}>Memory shared by CPU and GPU</th>
                  <th style={TH}>Power</th>
                  <th style={TH}>One compiled GR00T N1.7 call, NVIDIA&apos;s median</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Jetson Orin Nano Super Developer Kit</td>
                  <td style={TD}>8 GB at 102 GB/s</td>
                  <td style={TD}>7 W to 25 W</td>
                  <td style={TD}>Not published</td>
                  <td style={TD}>
                    <Cite id="F07-36">NVIDIA Jetson Orin Nano Super Developer Kit page</Cite>{' '}
                    <Cite id="F07-117">SmolVLA paper and LeRobot v0.7.0 guides, searched for a latency figure</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Jetson AGX Orin 64GB</td>
                  <td style={TD}>64 GB at 204.8 GB/s</td>
                  <td style={TD}>15 W to 60 W</td>
                  <td style={TD}>149.0 ms is labelled only &quot;Jetson Orin&quot;</td>
                  <td style={TD}>
                    <Cite id="F07-35">NVIDIA Jetson Orin page, specifications</Cite>{' '}
                    <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Jetson AGX Thor Developer Kit (T5000 module)</td>
                  <td style={TD}>128 GB at 273 GB/s</td>
                  <td style={TD}>40 W to 130 W</td>
                  <td style={TD}>76.8 ms; 35.6 ms with mixed NVFP4</td>
                  <td style={TD}>
                    <Cite id="F07-39">NVIDIA Jetson Thor page, specifications</Cite>{' '}
                    <Cite id="F07-4">Isaac-GR00T deployment README, Thor quantisation</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>DGX Spark (desk-side)</td>
                  <td style={TD}>128 GB at 273 GB/s</td>
                  <td style={TD}>240 W power supply; the chip&apos;s budget is 140 W</td>
                  <td style={TD}>116.6 ms</td>
                  <td style={TD}>
                    <Cite id="F07-47">DGX Spark User Guide, hardware overview</Cite>{' '}
                    <Cite id="F07-6">Isaac-GR00T deployment README, benchmark table</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Pick the JetPack release before you flash anything, by the software you will run. JetPack 7.2.2 is built
            on Ubuntu 24.04 and covers both Jetson families, and NVIDIA&apos;s GR00T guide no longer supports JetPack
            6; LeRobot&apos;s Jetson Dockerfile targets JetPack 6.2 and is community-maintained.{' '}
            <Cite id="F07-44">NVIDIA JetPack downloads page</Cite>{' '}
            <Cite id="F07-9">Isaac-GR00T deployment README, platform setup</Cite>{' '}
            <Cite id="F07-34">LeRobot installation guide, Jetson note</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Give the policy container the GPU, the camera and the servo bus with the flags the recipes in AWS's Greengrass guide leave out, and size what the device software takes from the board's shared memory"
          >
            The device software that installs the policy must hand it the GPU
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The compiled engine needs the GPU, and on the robot the line that starts the policy&apos;s container
            decides whether it gets one. On AWS that line sits in AWS IoT Greengrass, an open source edge runtime.
            Its software on the device, the nucleus, installs, restarts and replaces each piece of software, called a
            component, as a cloud service tells it, on one robot or across a fleet (section 18, The Fleet). A
            component is described by a recipe, a JSON or YAML file that defines its &quot;details, dependencies,
            artifacts, and lifecycles&quot;, and a policy shipped as a container image is started by a{' '}
            <code>docker run</code> line in the <code>Run</code> step of that recipe&apos;s lifecycle.{' '}
            <Cite id="F07-120">AWS IoT Greengrass developer guide, What is AWS IoT Greengrass?</Cite>{' '}
            <Cite id="F07-133">Greengrass developer guide, How AWS IoT Greengrass works</Cite>{' '}
            <Cite id="F07-122">Greengrass developer guide, Greengrass component</Cite>{' '}
            <Cite id="F07-151">Greengrass developer guide, component recipe reference</Cite>{' '}
            <Cite id="F07-153">Greengrass developer guide, Run a Docker container</Cite>
          </Box>
          <Box variant="p">
            Copied as AWS documents it, that line gives the container no GPU, no camera and no servo bus: none of
            the four recipes on AWS&apos;s &quot;Run a Docker container&quot; page passes a GPU or device flag. Two AWS
            sample repositories pass <code>--runtime nvidia</code> for the GPU on a Jetson, and NVIDIA&apos;s command
            for its GR00T container on Jetson and DGX Spark passes <code>--runtime nvidia --gpus all</code>; the
            samples give no flags for a DGX Spark. Each camera and the servo bus can be passed with its own Docker{' '}
            <code>--device</code> flag, which no AWS page read shows.{' '}
            <Cite id="F07-156">Greengrass developer guide, Run a Docker container, all recipes</Cite>{' '}
            <Cite id="F07-157">AWS samples: genai-at-edge recipe and the Physical AI Toolchain edge stack</Cite>{' '}
            <Cite id="F07-11">Isaac-GR00T deployment README, shared Docker workflow</Cite>
          </Box>
          <Snippet
            title="The policy's docker run line: the AWS samples' Jetson flags, plus one camera and the servo bus"
            mode="adapted"
            source={<Cite id="F07-157">AWS samples: genai-at-edge recipe and the Physical AI Toolchain edge stack</Cite>}
            ours={<>the two <code>--device</code> paths, for one camera and the servo bus; a second camera, as on the two-camera arm of LeRobot&apos;s RTC example, takes another <code>--device</code> flag; the line has not been run on a device</>}
          >
            {RUN_LINE}
          </Snippet>
          <Figure
            cites="F07-44 F07-120 F07-122 F07-148 F07-153 F07-156"
            caption={
              <>
                A plan assembled from AWS&apos;s and NVIDIA&apos;s documents, read from the top: the cloud
                service names the components, the nucleus installs and starts them, and the policy component starts
                the container that holds the control loop. The GPU, camera and servo bus reach the container only
                through flags in its <code>docker run</code> line.
              </>
            }
          >
            <DeviceStack />
          </Figure>
          <ExpandableSection headerText="How AWS's container recipe pulls the image and hands the container credentials">
            <SpaceBetween size="m">
              <Box variant="p">
                AWS&apos;s recipe for a container depends on the Docker application manager, which pulls the image
                from Amazon ECR (Elastic Container Registry, AWS&apos;s image store), and on the token exchange
                service, which hands out temporary AWS credentials. It lists the image as an artifact, a file the
                component needs, and starts it with a plain <code>docker run</code>. Pin the image by tag or
                digest: without one, each device pulls whatever is latest on the day it deploys.{' '}
                <Cite id="F07-153">Greengrass developer guide, Run a Docker container</Cite>{' '}
                <Cite id="F07-154">Greengrass developer guide, Docker application manager requirements</Cite>
              </Box>
              <Snippet
                title="A container component recipe, as AWS documents it"
                mode="copied"
                source={<Cite id="F07-153">Greengrass developer guide, Run a Docker container (private Amazon ECR image)</Cite>}
              >
                {RECIPE}
              </Snippet>
              <Box variant="p">
                A container that calls AWS, to read weights from Amazon S3 for instance, needs a third kind of
                flag, for credentials, and a robot should not carry a long-lived access key. The token exchange
                service (TES) is a local server on the device that meets this need: the device proves its identity
                with its X.509 certificate, the identity file issued when it was registered, and receives temporary
                credentials for one IAM (Identity and Access Management) role, held in memory and expiring after an
                hour by default. A container does not inherit them. Its <code>docker run</code> line needs{' '}
                <code>--network=host</code> and the variables <code>AWS_CONTAINER_CREDENTIALS_FULL_URI</code> and{' '}
                <code>AWS_CONTAINER_AUTHORIZATION_TOKEN</code> passed with <code>-e</code>, and AWS notes that host
                networking is less secure.{' '}
                <Cite id="F07-148">Greengrass developer guide, Interact with AWS services; Token exchange service</Cite>{' '}
                <Cite id="F07-150">Greengrass developer guide, AWS credentials in Docker container components</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            On paper the device software is small beside a policy whose weights take about 6 GB or more, as
            pi0.5&apos;s do. AWS documents a floor of 96 MB of RAM for the Java nucleus, about{' '}
            <Derived>1</Derived>% of the smallest Jetson&apos;s 8 GB, and measured nucleus lite&apos;s v2.5.0 packages
            at 15.8 MB with six small components on a Raspberry Pi 4 (14.6 MB idle), about <Derived>0.2</Derived>%.
            One is a documented floor and the other a measurement on another board, neither beside a policy on a
            Jetson.{' '}
            <Cite id="F07-84">Greengrass developer guide, Greengrass nucleus requirements</Cite>{' '}
            <Cite id="F07-138">aws-greengrass-lite v2.7.0, RESOURCE_LIMITS.md</Cite>{' '}
            <Cite id="F07-36">NVIDIA Jetson Orin Nano Super Developer Kit page</Cite>{' '}
            <Cite id="F07-54">Jetson AI Lab, OpenPi on Thor tutorial, prerequisites</Cite>
          </Box>
          <ExpandableSection headerText="Check that a nucleus installs on your Jetson before you choose one">
            <Box variant="p">
              On paper memory does not separate the two nuclei, so the choice turns on features and on whether each
              installs. The Java nucleus (v2.18.4) has every feature and needs a Java runtime and 256 MB of disk;
              nucleus lite (v2.7.0) is a set of small C programs that drops some, the Greengrass command-line tool on
              the device among them, and keeps the one a container policy needs: it runs Docker containers.
              Check the install before anything else, because neither nucleus names JetPack among its platforms: AWS
              lists 64-bit Arm Linux for the Java nucleus with no distribution named, and the nucleus lite packages
              target Ubuntu 24.04, the release JetPack 7.2.2 is built on, and name no Jetson.{' '}
              <Cite id="F07-84">Greengrass developer guide, Greengrass nucleus requirements</Cite>{' '}
              <Cite id="F07-135">Greengrass developer guide, feature compatibility</Cite>{' '}
              <Cite id="F07-86">Greengrass developer guide, feature compatibility, Docker containers</Cite>{' '}
              <Cite id="F07-140">Greengrass developer guide, nucleus supported platforms</Cite>{' '}
              <Cite id="F07-142">aws-greengrass-lite v2.7.0, package readme</Cite>{' '}
              <Cite id="F07-44">NVIDIA JetPack downloads page</Cite>
            </Box>
          </ExpandableSection>
          <Placeholder
            what={
              <>
                the measured footprint and behaviour of this setup on our own Jetson Orin Nano Super and DGX Spark
                once both are hooked to AWS IoT: whether each nucleus installs, the memory the nucleus holds beside
                the policy, the <code>docker run</code> flags a recipe needs for the GPU on each machine, the time
                to start the policy container, and policy latency with the nucleus running.
              </>
            }
            source={<>our own hook-up of the two machines to AWS IoT, which has not been done yet. Nothing in this block was run on a device.</>}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Match what the arm does to its cause and the setting that moves it, then measure your worst call before you buy a faster board"
          >
            How a late policy shows at the bench
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The software will not stop a policy that is merely slow. Local RTC&apos;s default budgets let an
            observation be 5 s old by the time its actions run, <Derived>1.25</Derived> m of travel at the
            illustrative 0.25 m/s, and a request stay outstanding for 10 s, which the documentation calls &quot;starting values, not measured hardware guarantees&quot;. When the queue does run
            dry, a robot that supports it holds its last target for <code>action_starvation_grace_s</code>, 1 second
            by default, and then the run faults; on a robot that does not, the run faults at once.{' '}
            <Cite id="F07-21">LeRobot inference guide, local RTC budgets</Cite>{' '}
            <Cite id="F07-20">LeRobot inference guide, real-time chunking</Cite>{' '}
            <Cite id="F01-83" kind="derived">
              speed times delay
            </Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={TH}>What you would see</th>
                  <th style={TH}>What causes it</th>
                  <th style={TH}>What to change</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>The arm stops each time a chunk runs out, then moves on</td>
                  <td style={TD}>Synchronous rollout, LeRobot&apos;s default: the loop waits for every call</td>
                  <td style={TD}>Switch to local RTC or remote inference</td>
                  <td style={TD}>
                    <Cite id="F01-87">LeRobot remote inference guide and inference guide</Cite>{' '}
                    <Cite id="F07-62">Real-time chunking paper, section 2</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>A jerk or a sudden change of route each time a new chunk takes over</td>
                  <td style={TD}>Asynchronous chunks joined with no guidance; the new one was planned from an older frame</td>
                  <td style={TD}>Turn RTC on; its guided mode needs no retraining</td>
                  <td style={TD}>
                    <Cite id="F07-12">LeRobot real-time chunking guide</Cite>{' '}
                    <Cite id="F07-64">Real-time chunking paper, section 2 and figure 2</Cite>{' '}
                    <Cite id="F07-17">LeRobot real-time chunking guide, modes</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The arm holds its last target for up to 1 s, then the run faults</td>
                  <td style={TD}>The queue ran dry: the call takes more than about half the chunk</td>
                  <td style={TD}>A shorter call, a longer chunk or another action rate; no refill value fixes it</td>
                  <td style={TD}>
                    <Cite id="F07-20">LeRobot inference guide, real-time chunking</Cite>{' '}
                    <Cite id="F07-22">LeRobot remote inference guide, tuning</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Oscillation that triggers the robot&apos;s protective stop</td>
                  <td style={TD}>Temporal ensembling with 100 ms or 200 ms of added delay</td>
                  <td style={TD}>Use RTC instead</td>
                  <td style={TD}>
                    <Cite id="F07-69">Real-time chunking paper, section 4.2</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The engine refuses to load: it &quot;will fail to deserialize&quot;</td>
                  <td style={TD}>Built on another GPU type or with another TensorRT version</td>
                  <td style={TD}>Build on the device that runs it, and again after a JetPack update</td>
                  <td style={TD}>
                    <Cite id="F07-79">TensorRT documentation, compatibility checks and support matrix</Cite>{' '}
                    <Cite id="F07-8">Isaac-GR00T deployment README, build notes</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Before you change a board or a setting, run your policy on the computer you have with LeRobot&apos;s
            cadence report. Each line gives a stage&apos;s mean, its worst call and its share of the loop&apos;s
            work. A large share for the infer line points at the policy or the device, and a large share for the
            observe line at the cameras. A long worst call on the record line, 620.00 ms against a 0.67 ms mean in
            LeRobot&apos;s own sample, is the blocking save of an episode, timed apart from inference. The
            report&apos;s pacing headroom near zero &quot;means there is nothing left to absorb a slow tick&quot;.{' '}
            <Cite id="F07-23">LeRobot inference guide, cadence reporting</Cite>{' '}
            <Cite id="F07-24">LeRobot inference guide, reading the cadence report</Cite>
          </Box>
          <Box variant="p">
            Then count the worst inference time in ticks and hold it against half your chunk. NVIDIA&apos;s compiled
            Orin median, 4.5 ticks against the <Derived>20</Derived> that half a 40-tick chunk allows, leaves room
            for a worst call about four times longer. Your own worst call says whether asynchronous chunks carry the
            arm or the call itself has to shrink.{' '}
            <Cite id="F07-23">LeRobot inference guide, cadence reporting</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
