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
const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };

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
  { name: 'Intel NUC robot computer, on the robot', parts: [96.89, 21.2, 11.22, 9.67], text: '138.98 ms', y: 332 },
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
          A strip of five links: camera frame, prepare images, policy call, decode actions and servo bus write. NVIDIA&apos;s
          call time includes the middle three. Below, bars on an axis of control periods at 30 Hz show that one GR00T
          N1.7 policy call takes 149.0 ms on Jetson Orin, 116.6 ms on DGX Spark and 76.8 ms on AGX Thor. Two stacked
          bars show a measured chain with the model on a separate workstation, 108.76 ms and 138.98 ms in total.
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
          Dashed links have no published timing for this arm.
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
  'The arm keeps playing the old chunk while the model computes. In this case the call takes 5 ticks, which is the 149.0 ms call from the start of this section rounded up to whole ticks.',
  'The new chunk arrives. Its first 5 actions belong to ticks that have already been played, so the robot computer skips them. From the next tick on, the arm plays the new chunk, and the join marks where playback switches. With real-time chunking, explained in the next part, the skipped actions also agree with what the arm actually did.',
  'Now the slow case. The request is the same, but this model needs 1 s per call, which is 30 ticks. Only 0.5 s of playback was left when the request went out.',
  'The old chunk runs out before the new one arrives. The action queue is empty, so the arm stops and waits.',
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
            description="A large robot policy can take several control periods to compute one answer and still keep the arm moving smoothly. From one timed call, you can tell whether a policy is fast enough for your arm, and how much action chunks, asynchronous inference, compilation and quantisation each help."
          >
            17. Running on the Robot: Controlling the Arm With a Model Slower Than Its Control Loop
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The {ARM} in this dive has to {TASK_STORY}. The computer that runs its control loop and talks to the
            motors is called the robot computer. On a finished robot it is usually a small board mounted on the
            robot, the onboard computer, but on a bench it can also be a desktop connected to the arm. The control
            loop sends one action to the motors on every tick, and the time between two ticks, 33.3 ms, is called the
            control period (section 3, The Robot as a Computer). A large robot policy can take four or five control
            periods to compute one answer and still give the arm a new action on every tick.
          </Box>
          <Box variant="p">
            GR00T N1.7 is a good example. It is NVIDIA&apos;s robot policy, and NVIDIA publishes a benchmark table for
            it in its Isaac-GR00T deployment README. The table includes the Jetson Orin, a small computer designed to
            be mounted on a robot. TensorRT is NVIDIA&apos;s inference compiler, and it is explained further down.
            Compiled with TensorRT, one call of GR00T N1.7 takes a median of 149.0 ms in NVIDIA&apos;s benchmark
            table. The table does not say which Orin module was used. One call therefore lasts 149.0 / 33.3 = 4.5
            control periods.{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
          </Box>
          <Box variant="p">Two techniques let the arm work with a call that slow:</Box>
          <ul style={LIST}>
            <li>
              <strong>Action chunks.</strong> Each call returns a chunk of future actions instead of a single action,
              and the arm plays one action from the chunk on every tick (section 4, Learning From Demonstrations). In
              NVIDIA&apos;s benchmark table, one chunk holds 40 actions.
            </li>
            <li>
              <strong>Asynchronous inference.</strong> The robot computer starts the next call while the current chunk
              is still playing, so the arm does not have to stop and wait for it.
            </li>
          </ul>
          <Box variant="p">
            Together, these two techniques allow one call to take up to about half the time its chunk lasts. A third
            technique makes the call itself shorter. You compile the model, and on newer boards you also quantise it,
            which means storing its numbers in fewer bits. Without compilation, in plain PyTorch, the same call takes
            357.9 ms on the same Orin.{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
          </Box>
          <Box variant="p">
            At the median, both calls are shorter than half a chunk. A chunk of 40 actions at 30 Hz lasts 40 / 30 ={' '}
            <Derived>1.33</Derived> s, which is 40 ticks, so half a chunk is <Derived>20</Derived> ticks. The compiled
            call takes 4.5 ticks, and the PyTorch call takes 357.9 / 33.3 = <Derived>10.7</Derived> ticks. Compiling still matters, because it makes the
            actions fresher. Every action in a new chunk was planned from a camera frame that is at least one call
            old, and each later action in the chunk is one tick older again. A shorter call therefore makes every
            action in the chunk younger by the time it saves.
          </Box>
          <Box variant="p">
            Section 3, The Robot as a Computer, uses an illustrative arm speed of 0.25 m/s while the arm carries the
            block toward the cup. At that speed, the arm travels <Derived>37</Derived> mm during a 149.0 ms call and{' '}
            <Derived>89</Derived> mm during a 357.9 ms call. If someone nudges the cup during that time, the arm keeps
            steering toward where the cup was, and the opening of the cup is only a few centimetres wide. Chunking
            hides a slow call from the control loop, but the delay is still present in every action.{' '}
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
            description="The delay between a camera frame and the motor command computed from it has several parts, and in the setups below the policy call is the longest. You will learn to count each part in control periods, to plan for the slowest call rather than the typical one, and to measure on your own arm the parts that no source publishes."
          >
            The latency budget: from camera frame to motor command
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The delay from a camera frame to the servo command computed from it is made of four waits (section 3,
            The Robot as a Computer). This delay, split into its parts, is called the latency budget.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Frame age.</strong> When processing starts, a camera frame can already be up to one camera frame
              period old, which is 33.3 ms.
            </li>
            <li>
              <strong>The policy call.</strong> The model reads the observation and computes the next chunk of
              actions.
            </li>
            <li>
              <strong>The network.</strong> This wait applies only when the policy runs on another computer.
            </li>
            <li>
              <strong>The wait for the next tick.</strong> The command reaches the servos at the next write of the
              control loop.
            </li>
          </ul>
          <Box variant="p">
            The call time in NVIDIA&apos;s benchmark table already includes preparing the images and decoding the
            actions. It does not include any network transfer.{' '}
            <Cite id="F07-118">LeRobot inference guide, sample cadence report</Cite>{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>
          </Box>
          <Box variant="p">
            A latency figure is valid only for the conditions it was measured under: the device, the runtime, the
            number of cameras and the number of denoising steps. To see why the number of steps matters, recall that
            the model has two parts (section 5, Vision-Language-Action Models). The backbone reads the camera images
            and the text instruction. The action head then builds the chunk of actions from the backbone&apos;s
            output in a few passes, called denoising steps. Each denoising step is one more pass through the action
            head, so the same model takes longer per call when it runs more steps.
          </Box>
          <Box variant="p">
            The deployment README states the conditions behind NVIDIA&apos;s figures. NVIDIA used the <code>nvidia/GR00T-N1.7-LIBERO</code>{' '}
            checkpoint, batch size 1, four denoising steps and two camera images of 256x256 pixels. LIBERO is a suite
            of simulated manipulation tasks. Each figure is the median of 60 timed calls on fixed inputs, with the
            Jetsons in their maximum power mode. The README also notes that the table does &quot;not measure
            closed-loop task success&quot;.{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>{' '}
            <Cite id="F07-3">Isaac-GR00T deployment README, measurement details</Cite>
          </Box>
          <Box variant="p">
            If you change a condition, the figure changes. NVIDIA&apos;s model card times the same model on a Jetson
            Orin with one camera instead of two and reports 216.5 ms. That is slower even though there are fewer
            images, because more than the camera count changed. In the model card&apos;s setup, TensorRT compiles
            only the action head, with an older TensorRT release, and the backbone runs uncompiled.{' '}
            <Cite id="F02-40">GR00T N1.7 model card, inference timing table</Cite>
          </Box>
          <Box variant="p">
            A median or a mean describes the typical call. The arm, however, is affected by the slowest call, because
            the chunk that is playing has to last until that call returns. NVIDIA&apos;s benchmark table gives only
            medians.
            LeRobot&apos;s documentation includes an illustrative sample report from a 30 Hz run on hardware it does
            not name, and the report shows how far apart the two can be. In that report, inference took 5.18 ms on
            average, and the worst call took 40.00 ms. The worst call was therefore about <Derived>35</Derived> ms
            slower than the typical one.{' '}
            <Cite id="F07-3">Isaac-GR00T deployment README, measurement details</Cite>{' '}
            <Cite id="F07-23">LeRobot inference guide, cadence reporting</Cite>
          </Box>
          <Box variant="p">
            When the policy runs on another computer, the network and the CPU of the robot computer add to the delay.
            Real-time chunking (RTC) is a method of asynchronous inference that makes each new chunk continue the
            motion already under way, and it is explained later in this section. The authors of RTC timed 50 calls
            of a policy served from a workstation over wired Ethernet. They ran the test twice: once with a desktop
            computer controlling the robot, and once with a small computer mounted on the robot, an Intel NUC. The
            model&apos;s time barely changed between the two runs. The NUC&apos;s full chain, however, took 138.98 ms
            against 108.76 ms for the desktop, about <Derived>30</Derived> ms more. Most of the difference came from
            the NUC&apos;s network link and from resizing the images on its CPU.{' '}
            <Cite id="F07-12">LeRobot real-time chunking guide</Cite>{' '}
            <Cite id="F07-68">Real-time chunking paper, appendix A.3, table 2</Cite>
          </Box>
          <Box variant="p">
            So the robot computer is part of the latency budget even when the GPU is on another machine. The gap
            between the slowest call and the typical call also depends on the setup. Across these 50 calls, the
            model&apos;s time varied by only about 0.2 ms, while the network added 2 to 3 ms of jitter. Measure this
            gap on your own setup.{' '}
            <Cite id="F07-68">Real-time chunking paper, appendix A.3, table 2</Cite>
          </Box>
          <Figure
            cites="F07-1 F07-5 F07-68 F07-118"
            caption={
              <>
                Each gridline marks one tick of the 30 Hz control loop. The top bars show NVIDIA&apos;s median time
                for one compiled GR00T N1.7 call on three devices: the Jetson Orin, the larger Jetson AGX Thor and
                the DGX Spark, a desk-side computer. The bottom bars show the chain that the RTC authors measured for
                a policy served from a workstation. Each bar is split into model, network, image resize and other.
                With the desktop robot computer, the parts take 97.43, 6.89, 1.44 and 3.00 ms. With the NUC, they
                take 96.89, 21.20, 11.22 and 9.67 ms. In the strip at the top, the camera frame is the frame age, the
                three middle links make up the policy call as NVIDIA times it, and the servo bus write is the wait
                for the next tick. The strip has no network link.
              </>
            }
          >
            <BudgetChart />
          </Figure>
          <Box variant="p">
            LeRobot&apos;s guides give no timing for camera exposure, the USB transfer or the servo bus write on an{' '}
            {ARM}. You can measure both ends of the chain on your own arm with LeRobot&apos;s cadence report. The
            cadence report is the timing summary that LeRobot prints for each stage of the control loop during a
            run. Its observe line times the camera reads, and its send line times the write to the motors.{' '}
            <Cite id="F07-118">LeRobot inference guide, sample cadence report</Cite>{' '}
            <Cite id="F07-23">LeRobot inference guide, cadence reporting</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="With asynchronous inference, one call can take up to about half the time its chunk lasts. From the chunk length and one timed call, you can work out whether the arm ever has to wait, and you can set when the robot computer asks for the next chunk."
          >
            Asynchronous inference: how long one call may take
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            What the arm does while the model computes depends on when the robot computer starts the next call.
            There are two ways to schedule it:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Synchronous inference</strong> is LeRobot&apos;s default. The robot computer plays the chunk to
              its end, then calls the model and waits for the answer. In LeRobot&apos;s words, &quot;the robot stops
              moving every time the policy computes its next chunk of actions&quot;. These pauses also change how the
              arm moves, so the policy sees motion that never appeared in its training data.{' '}
              <Cite id="F01-87">LeRobot remote inference guide and inference guide</Cite>{' '}
              <Cite id="F07-62">Real-time chunking paper, section 2</Cite>
            </li>
            <li>
              <strong>Asynchronous inference</strong> starts the next call early, while the current chunk is still
              playing.
            </li>
          </ul>
          <Box variant="p">
            Here is what synchronous inference costs with the median times from NVIDIA&apos;s benchmark table. An Orin running synchronously
            stops for 149.0 ms after every 40 actions. A chunk of 40 actions lasts <Derived>1,333</Derived> ms, so
            the arm is idle 149.0 / (<Derived>1,333</Derived> + 149.0) = <Derived>10</Derived>% of the time, with a
            visible stop every <Derived>1.5</Derived> s. With the PyTorch call, the arm is idle{' '}
            <Derived>21</Derived>% of the time.{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
          </Box>
          <Box variant="p">
            The arm keeps playing while a call runs, so when the new chunk arrives, its first actions are already in
            the past and the robot computer drops them. Asynchronous inference keeps the arm moving only if the
            actions left in the new chunk last long enough to cover the next call. This is LeRobot&apos;s tuning
            rule, and no setting can relax it. To write the rule as a formula, let <M>H</M> be the chunk length in
            actions, <M>{String.raw`\Delta t`}</M> the control period, and <M>L</M> the time one call takes, from
            sending the observation to receiving the chunk.
          </Box>
          <Formula
            name="The half-chunk rule: LeRobot's tuning rule as a formula"
            tex={String.raw`H\,\Delta t \;-\; L \;\ge\; L \quad\Longrightarrow\quad L \;\le\; \tfrac{1}{2}\,H\,\Delta t`}
            source={<Cite id="F07-22">LeRobot remote inference guide, tuning</Cite>}
          />
          <Box variant="p">
            In the formula, <M>{String.raw`H\,\Delta t`}</M> is how long the chunk lasts. Subtracting <M>L</M> gives
            the part of the chunk that is still left to play when it arrives. The <M>L</M> on the right side is the
            next call, which that remaining part has to cover. LeRobot&apos;s remote inference guide gives an example
            that fails: &quot;If inference takes 1 second out of a 1.67-second prediction, only about 0.67 seconds
            remain. Another 1-second request cannot fit; no refill value fixes that.&quot; The refill value is a
            LeRobot setting, explained below. LeRobot&apos;s remedies are a shorter call, a longer chunk or a
            different action rate. For a chunk of 40 actions, the rule allows a call of about{' '}
            <Derived>20</Derived> ticks, or a little less if you keep one tick of margin. NVIDIA&apos;s compiled call
            on the Orin has a median of 4.5 ticks. So even a worst call of up to about four times the median still
            fits.{' '}
            <Cite id="F07-22">LeRobot remote inference guide, tuning</Cite>{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
          </Box>
          <Box variant="p">
            Repeat this calculation with your own call, timed on the software you will actually run. The Orin figure
            and LeRobot&apos;s settings come from different software stacks, for two reasons.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Different JetPack releases.</strong> JetPack is NVIDIA&apos;s software bundle for Jetsons, with
              Linux, GPU drivers and libraries. NVIDIA timed GR00T N1.7 with its own TensorRT setup, which needs
              JetPack 7.2 on an Orin. LeRobot&apos;s Jetson container targets JetPack 6.2.{' '}
              <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>{' '}
              <Cite id="F07-9">Isaac-GR00T deployment README, platform setup</Cite>{' '}
              <Cite id="F07-34">LeRobot installation guide, Jetson note</Cite>
            </li>
            <li>
              <strong>Different policies.</strong> LeRobot v0.7.0 includes a wrapper for GR00T N1.7, but its RTC
              configuration is attached to pi0, pi0.5, pi0-FAST and SmolVLA, not to GR00T. So the RTC values worked
              out below apply to any policy whose call takes as long as GR00T&apos;s. They are not a GR00T
              configuration that LeRobot documents.{' '}
              <Cite id="F02-47">LeRobot configuration_groot.py</Cite>{' '}
              <Cite id="F07-15">LeRobot real-time chunking guide, key parameters</Cite>
            </li>
          </ul>
          <Box variant="p">
            LeRobot v0.7.0 offers asynchronous inference in two forms.{' '}
            <Cite id="F01-40">LeRobot inference guide, inference backends</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Local RTC</strong> runs real-time chunking on the robot computer itself. The policy runs in a
              background thread, and no network is involved.
            </li>
            <li>
              <strong>Remote inference</strong> moves the checkpoint to a policy server, for example a DGX Spark on
              the desk. The cameras, motors and recording stay on the robot computer, and &quot;the remote client
              does not load weights&quot;. The two sides communicate over Zenoh. Zenoh is a publish/subscribe network
              protocol, and here it carries the observations to the server and the chunks back.{' '}
              <Cite id="F07-25">LeRobot remote inference guide, installation</Cite>
            </li>
          </ul>
          <Box variant="p">
            The robot computer keeps the actions it has not played yet in a queue, called the action queue. It has to
            decide when to ask for the next chunk. If it asks too late, the queue runs empty. If it asks too early,
            most of each chunk is thrown away without being played. In LeRobot&apos;s
            remote inference, the client on the robot computer decides from three quantities:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>
                <code>refill_seconds</code>
              </strong>{' '}
              sets when the client asks for the next chunk: it asks when this much playback time is left in the
              queue. The default is 0.5 s.
            </li>
            <li>
              <strong>The turnaround</strong> is the measured round trip of one request: encoding, network, queueing,
              inference and decoding.
            </li>
            <li>
              <strong>
                <code>fps</code>
              </strong>{' '}
              is the action rate, in actions per second.
            </li>
          </ul>
          <Formula
            name="When the client asks for the next chunk"
            tex={String.raw`\small \begin{aligned} &\text{effective refill} = \max(\text{set},\ \text{floor}) \\ &\text{set} = \texttt{refill\_seconds} \\ &\text{floor} = \text{recent maximum turnaround} \\ &\qquad\quad + 1 / \texttt{fps} \end{aligned}`}
            source={<Cite id="F07-26">LeRobot remote inference guide, parameters</Cite>}
          />
          <Box variant="p">
            The first term is your setting. The second term is a floor that comes from measurement: the slowest
            recent round trip plus one tick of margin. The client uses whichever of the two is larger. At 30 Hz, the
            0.5 s default makes the client ask for the next chunk when <Derived>15</Derived> actions are left (0.5 s x
            30 actions per second). The default stays in force until the slowest round trip exceeds 0.5 - 0.033 ={' '}
            <Derived>0.467</Derived> s. That is more than three times the 138.98 ms chain that the RTC authors
            measured with the small on-robot computer. If the round trip grows beyond that, the floor rises and the
            client asks earlier. Even so, no refill value can rescue a call that breaks the half-chunk rule.{' '}
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
                In steps 1 to 4, the robot computer asks for the next chunk with 0.5 s of playback left, and a call
                of 5 ticks arrives with actions to spare. In steps 5 and 6, a call of 30 ticks takes longer than the{' '}
                <Derived>15</Derived> ticks of playback that were left, so it arrives after the queue has run dry. The
                chunk holds 40 actions, as in NVIDIA&apos;s benchmark table. The slow call therefore also breaks the
                half-chunk rule, which allows <Derived>20</Derived> ticks, and no refill value would save it. The
                5-tick call is NVIDIA&apos;s 149.0 ms median rounded up to whole ticks. The 30-tick call is an
                illustration.
              </>
            }
          >
            {(step, reduced) => <ChunkClock step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            When the new chunk arrives, the remote client merges it into its action queue. LeRobot offers three ways
            to do this.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>
                <code>aligned</code>
              </strong>{' '}
              is the default. It drops the incoming actions whose time has already passed and replaces only the
              future part of the queue. This reduces backward bumps between chunks, because the arm does not replay
              steps it has already moved past.
            </li>
            <li>
              <strong>
                <code>append</code>
              </strong>{' '}
              is offered as a baseline for comparison. It plays out the rest of the old chunk and then starts the new
              chunk at its first action. As a result, every action of the new chunk plays late by the number of
              actions that were left when the request went out. In the animation&apos;s fast case, that is{' '}
              <Derived>15</Derived> ticks, or half a second.
            </li>
            <li>
              <strong>RTC</strong> is available for checkpoints that support it. In this mode, the model takes the
              actions that are still to play into account when it computes the new chunk.{' '}
              <Cite id="F07-27">LeRobot remote inference guide, modes</Cite>
            </li>
          </ul>
          <Box variant="p">
            The refill setting also controls how old the actions are when they play. With the aligned merge, an
            action plays as many ticks after its camera frame as its position in the chunk. In the animation&apos;s
            fast case, the next request goes out with <Derived>15</Derived> actions left, at action 40 -{' '}
            <Derived>15</Derived> = <Derived>25</Derived>. The arm keeps playing through the 5-tick call. So the last
            action it plays from a chunk is about action <Derived>25</Derived> + 5 = <Derived>30</Derived>, which is a
            second after the frame it was planned from. At the illustrative 0.25 m/s, the arm travels{' '}
            <Derived>250</Derived> mm in that second. Compiling makes every action younger by the time it saves on the
            call. Between the compiled call and the PyTorch call, that saving is worth <Derived>52</Derived> mm of
            travel. The refill setting controls the larger part of the age. LeRobot&apos;s note on <code>refill_seconds</code>{' '}
            describes the trade-off: &quot;Higher usually requests earlier; lower allows more of the plan to
            execute.&quot;{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>{' '}
            <Cite id="F07-26">LeRobot remote inference guide, parameters</Cite>{' '}
            <Cite id="F01-83" kind="derived">
              speed times delay
            </Cite>
          </Box>
          <Box variant="p">
            The network adds its own share of the turnaround. By default, camera frames travel as raw RGB images. Two
            640x480 frames take about 1.8 MB, which adds about <Derived>15</Derived> ms to every turnaround on a
            gigabit link. To reduce this, try JPEG compression at quality 90, and then compare both the turnaround
            and the task quality. When the link is congested, LeRobot drops observations rather than blocking the
            motor commands.{' '}
            <Cite id="F07-28">LeRobot remote inference guide, bandwidth</Cite>
          </Box>
          <Box variant="p">
            LeRobot&apos;s remote inference has run five policy types on real robots, including ACT (section 4,
            Learning From Demonstrations) and SmolVLA. However, running through a router, on a private hosted GPU or
            on a Hugging Face Space &quot;has not been validated yet&quot;. So time the full turnaround on any new
            network, because &quot;a working transport alone does not establish a usable motion budget&quot;.{' '}
            <Cite id="F07-29">LeRobot remote inference guide, supported policies and robots</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Real-time chunking makes each new chunk start from the motion that is already under way. You will learn to set inference_delay, execution_horizon and the guidance mode from your measured call, and to decide whether to pay for a smooth hand-over at run time or at training time."
          >
            Real-time chunking: making each new chunk continue the current motion
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Starting the next call early creates a seam between chunks. The new chunk was planned from a camera frame
            that is several ticks old, and nothing ties it to the motion in progress. The RTC paper illustrates this
            with a figure in which the chunk being played goes over an obstacle and the new chunk goes under it. The
            hand-over between them &quot;may be arbitrarily discontinuous and out-of-distribution&quot;. On the arm,
            this shows up as a jerk that gets worse as the delay grows.{' '}
            <Cite id="F07-64">Real-time chunking paper, section 2 and figure 2</Cite>
          </Box>
          <Box variant="p">
            RTC handles this with an idea from image editing. Inpainting is the image-editing task of filling a
            missing region so that it matches its surroundings. RTC treats the new chunk the same way. The first
            actions of the new chunk are already known, because the arm will play them from the old chunk while the
            call runs. The model fills in the rest of the chunk so that it continues from them.{' '}
            <Cite id="F07-13">LeRobot real-time chunking guide, how RTC works</Cite>{' '}
            <Cite id="F07-65">Real-time chunking paper, section 3 and figure 3</Cite>
          </Box>
          <Box variant="p">
            To know how many actions are already known, the paper counts
            the length of the call in whole ticks, rounded down, and calls the result the inference delay,{' '}
            <M>{String.raw`d = \lfloor L / \Delta t \rfloor`}</M>. The 149.0 ms Orin median is{' '}
            <Derived>4.47</Derived> ticks, so <M>d</M> = 4. By the time the new chunk arrives, the arm will already
            have played the first <M>d</M> ticks that the new chunk covers, using actions from the old chunk. So RTC
            freezes the first <M>d</M> actions of the new chunk to the old chunk&apos;s values.{' '}
            <Cite id="F07-63">Real-time chunking paper, section 2</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>{' '}
            <Cite id="F07-65">Real-time chunking paper, section 3 and figure 3</Cite>
          </Box>
          <Box variant="p">
            Freezing only those <M>d</M> actions is not enough, because when <M>d</M> is small the new chunk can still
            switch to a different strategy. RTC therefore also pulls the other actions that overlap the old chunk
            toward it. The pull has a weight that decays from 1 to 0, because &quot;actions further in the future
            should be treated with more uncertainty&quot;. The actions beyond the end of the old chunk have nothing
            to match, so the model generates them freely.{' '}
            <Cite id="F07-65">Real-time chunking paper, section 3 and figure 3</Cite>{' '}
            <Cite id="F07-66">Real-time chunking paper, section 3.2</Cite>
          </Box>
          <Figure
            cites="F07-65 F07-66"
            caption={
              <>
                Each column is one action of the new chunk, in the order the arm will play it. The height of each bar
                is the weight that pulls that action toward the old chunk. The layout follows the paper&apos;s
                example: a delay of 4 ticks, 7 guided actions and 5 free ones. How fast the weight decays is drawn as
                an illustration.
              </>
            }
          >
            <RtcZones />
          </Figure>
          <Box variant="p">
            The pull is applied during denoising. A flow-matching action head (section 4, Learning From
            Demonstrations) builds a chunk from random noise in a few steps. At each step, RTC adds a term that pulls
            the weighted positions toward the old chunk. To know which way to move the half-built chunk so that the
            finished chunk matches, RTC needs the gradient of the model&apos;s output with respect to its input.
            Computing that gradient takes a backward pass through the model at every denoising step, the same kind of
            computation that training uses.
          </Box>
          <Box variant="p">
            The RTC authors measured this cost on pi0.5, a vision-language-action model (VLA) from Physical
            Intelligence (section 5, Vision-Language-Action Models). On an RTX 4090, each denoising step became 2.5
            times slower, and the whole call went from 76 ms to 97 ms, which is <Derived>28</Derived>% slower. The
            backbone&apos;s processing of the images and the instruction takes <Derived>62</Derived> ms of the 76 ms,
            and that part does not change.{' '}
            <Cite id="F07-13">LeRobot real-time chunking guide, how RTC works</Cite>{' '}
            <Cite id="F07-67">Real-time chunking paper, appendix A.3, tables 1 and 3</Cite>
          </Box>
          <Box variant="p">
            The same authors also measured what this cost buys on real robots. They ran pi0.5 with 50-action chunks
            on two-armed robots controlled at 50 Hz. The 97 ms call was served over a local network that added 10 to
            20 ms, so the starting delay was about 6 ticks. They then added 100 ms and 200 ms of artificial delay,
            which raised the delay to about 11 and 16 ticks, and 16 ticks at 50 Hz is <Derived>320</Derived> ms.
            Over 480 episodes and 28 hours of robot time, RTC showed &quot;no degradation&quot; as the delay was
            added, while synchronous inference &quot;degrades linearly&quot; with it. Temporal ensembling averages
            overlapping chunks with weights (section 4, Learning From Demonstrations). On these robots it could not
            run at either added delay, because it oscillated hard enough to trigger the robot&apos;s built-in
            protective stop.{' '}
            <Cite id="F07-69">Real-time chunking paper, section 4.2</Cite>
          </Box>
          <Box variant="p">
            LeRobot v0.7.0 exposes the three zones as settings. The first setting, <code>inference_delay</code>, is{' '}
            <M>d</M>. LeRobot passes it with every call, because the delay varies at run time. For the Orin median,{' '}
            <code>inference_delay</code> is 4. If you round the <Derived>4.47</Derived> ticks up instead, it is 5,
            which freezes one more action. Rounding up is the safer choice when calls run longer than the median.{' '}
            <Cite id="F07-15">LeRobot real-time chunking guide, key parameters</Cite>{' '}
            <Cite id="F07-63">Real-time chunking paper, section 2</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
          </Box>
          <Box variant="p">
            The second setting, <code>execution_horizon</code>, is the number of actions of the old chunk that the
            new chunk must stay consistent with. It covers the frozen and guided zones together, which is 11 actions
            in the figure. The default is 10, and typical values are 8 to 12. A higher value gives smoother motion,
            but the arm is slower to react. LeRobot&apos;s decaying weight runs from <code>inference_delay</code> to{' '}
            <code>execution_horizon</code>, so the guided zone is the gap between the two settings.{' '}
            <Cite id="F07-14">LeRobot configuration_rtc.py</Cite>{' '}
            <Cite id="F07-15">LeRobot real-time chunking guide, key parameters</Cite>{' '}
            <Cite id="F07-16">LeRobot real-time chunking guide, prefix schedules</Cite>{' '}
            <Cite id="F07-65">Real-time chunking paper, section 3 and figure 3</Cite>
          </Box>
          <Box variant="p">
            <code>execution_horizon</code> must lie between <code>inference_delay</code> and the chunk length minus{' '}
            <code>inference_delay</code>. This is the RTC paper&apos;s constraint, with its symbols replaced by
            LeRobot&apos;s setting names; that mapping is ours. Because you take <code>inference_delay</code> from
            your measured call, a longer call raises the lowest value you can give <code>execution_horizon</code>. For
            a chunk of 40 actions at the compiled Orin
            median, that range is 4 to <Derived>36</Derived>. The default of 10 fits, with 6 actions in the guided
            zone, and at this chunk length only the lower limit matters. The PyTorch call takes{' '}
            <Derived>10.7</Derived> ticks, so <code>inference_delay</code> becomes 10, or 11 if you round up. With
            10, the default <code>execution_horizon</code> leaves no guided zone, and with 11 it breaks the
            constraint. So when the call gets longer, raise <code>execution_horizon</code> with it.{' '}
            <Cite id="F07-63">Real-time chunking paper, section 2</Cite>{' '}
            <Cite id="F07-65">Real-time chunking paper, section 3 and figure 3</Cite>{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>{' '}
            <Cite id="F07-14">LeRobot configuration_rtc.py</Cite>
          </Box>
          <Box variant="p">Two more settings control the pull.</Box>
          <ul style={LIST}>
            <li>
              <strong>
                <code>max_guidance_weight</code>
              </strong>{' '}
              limits how strongly the new chunk is pulled toward the old one. The default is 10.0, the value LeRobot
              gives for the 10-step flow matching of SmolVLA, pi0 and pi0.5. The GR00T call in NVIDIA&apos;s
              benchmark uses four denoising steps, and LeRobot&apos;s guide gives no value for a four-step action
              head. On such a policy, treat 10.0 as a starting point and try a range of values around it.{' '}
              <Cite id="F07-14">LeRobot configuration_rtc.py</Cite>{' '}
              <Cite id="F07-15">LeRobot real-time chunking guide, key parameters</Cite>{' '}
              <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>
            </li>
            <li>
              <strong>
                <code>prefix_attention_schedule</code>
              </strong>{' '}
              sets how the weight decays, and here the code and the documentation disagree. The code defaults to{' '}
              <code>LINEAR</code> and carries a to-do comment to change it. The documentation recommends{' '}
              <code>EXP</code>, the paper&apos;s exponential decay, for getting started. Because the code is what
              actually runs, pass the schedule explicitly.{' '}
              <Cite id="F07-14">LeRobot configuration_rtc.py</Cite>{' '}
              <Cite id="F07-16">LeRobot real-time chunking guide, prefix schedules</Cite>
            </li>
          </ul>
          <Box variant="p">
            You can also move the guidance cost from run time into training. A later paper describes this method,
            called training-time RTC. During training, each example gets a random delay <M>d</M>. The model receives
            the first <M>d</M> actions without noise and learns to generate the rest. At run time, these first
            actions are fed to the model directly, so no guidance and no backward pass are needed. The authors
            trained with delays of 0 to 10 ticks, &quot;which supports a maximum latency of 200ms on a 50Hz
            robot&quot;. In simulation, training-time RTC beat the guided version at delays of 2 ticks or more.{' '}
            <Cite id="F07-70">Training-time RTC paper, section III</Cite>{' '}
            <Cite id="F07-71">Training-time RTC paper, section IV.B</Cite>{' '}
            <Cite id="F07-72">Training-time RTC paper, section IV.A</Cite>
          </Box>
          <Box variant="p">
            In LeRobot, training-time RTC is called the <code>trained</code> mode, and it turns your latency budget
            into a training setting. It needs a pi0.5 checkpoint trained with <code>rtc_training_max_delay</code>{' '}
            above 0. LeRobot refuses to start in this mode unless the following condition holds:{' '}
            <code>rtc_training_max_delay &lt;= execution_horizon &lt;= prediction_steps - rtc_training_max_delay</code>
            . This is the same constraint as before, with the trained delay in place of{' '}
            <code>inference_delay</code> and <code>prediction_steps</code> as the chunk length. A checkpoint trained
            for up to 10 ticks of delay covers 200 ms on a 50 Hz robot and <Derived>333</Derived> ms on this 30 Hz
            arm. The default <code>guided</code> mode, on the other hand, works with ordinary flow-matching
            checkpoints and needs no retraining.{' '}
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
            description="Compile the model first and quantise it second. On Jetson Thor, a rewrite of the model's graph saved twice as much time as four-bit numbers did. On a Jetson, you must build every engine on the same type of board that will run it."
          >
            Compiling and quantising the policy with TensorRT
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Chunking lets the arm tolerate a slow call, while compiling and quantising make the call shorter. TensorRT
            takes a model graph as its input, usually as an ONNX (Open Neural Network Exchange) file. ONNX is a
            portable file format that a trained checkpoint can be exported to. TensorRT picks a GPU implementation
            for each layer by timing the candidates on the machine that runs the build. The result is a file called
            an engine. GR00T N1.7 compiles to seven engines, one for each sub-network from the vision encoder to the
            action decoder. NVIDIA recommends compiling the full pipeline, because the backbone &quot;dominates
            inference time&quot;.{' '}
            <Cite id="F07-76">TensorRT 11.5 release notes</Cite>{' '}
            <Cite id="F07-7">Isaac-GR00T deployment README, TensorRT acceleration</Cite>
          </Box>
          <Box variant="p">
            In NVIDIA&apos;s benchmark table, compiling shortens one call from 357.9 ms to 149.0 ms on the Jetson Orin, a factor
            of <Derived>2.4</Derived>. On the DGX Spark, the call goes from 200.8 ms to 116.6 ms, a factor of{' '}
            <Derived>1.7</Derived>. On the Jetson AGX Thor, it goes from 106.8 ms to 76.8 ms, a factor of{' '}
            <Derived>1.4</Derived>. In this table, compiling helped most where the call was longest. On the Orin it
            saves <Derived>208.9</Derived> ms, the largest saving in the table.{' '}
            <Cite id="F07-1">Isaac-GR00T deployment README, benchmark table</Cite>
          </Box>
          <Box variant="p">
            Quantisation means storing a model&apos;s numbers in fewer bits, so that each layer moves less data from
            memory and does cheaper arithmetic. A floating-point number splits its bits between an exponent and a
            mantissa. The exponent sets how large or small the number can get, and the mantissa sets how precisely it
            is stored. These policies use BF16 by default. BF16 is a sixteen-bit format that keeps the eight-bit
            exponent of FP32, the single-precision floating-point format, and has fewer mantissa bits. FP16, the
            other sixteen-bit format, has only a five-bit exponent. NVIDIA&apos;s pi0.5 tutorial rules FP16 out,
            because it overflows in the attention layers, and the error &quot;compounds over the denoising
            loop&quot;.{' '}
            <Cite id="F07-4">Isaac-GR00T deployment README, Thor quantisation</Cite>{' '}
            <Cite id="F07-53">Jetson AI Lab, OpenPi on Thor tutorial, precision note</Cite>
          </Box>
          <Box variant="p">
            Below sixteen bits, FP8 has a sign bit, four exponent bits and three mantissa bits. FP4 has a sign bit, two
            exponent bits and one mantissa bit. Four bits allow only 2 x 2 x 2 x 2 = <Derived>16</Derived> bit
            patterns, so an FP4 number can take only a handful of values. A layer quantised to FP4 therefore needs
            those few values placed where its numbers actually lie. NVFP4 is NVIDIA&apos;s FP4 format with one scale
            factor per block of numbers. The scale factor fits the handful of values to each block&apos;s own range.
            The Blackwell-generation GPU in Jetson Thor runs NVFP4 natively. NVIDIA reports that NVFP4 gives 4-bit
            quantisation &quot;without the accuracy collapse you would get from 4-bit integer formats&quot;.{' '}
            <Cite id="F07-81">TensorRT documentation, quantized types</Cite>{' '}
            <Cite id="F07-58">Jetson AI Lab, GR00T N1.7 on Thor tutorial</Cite>
          </Box>
          <Box variant="p">
            An engine does not use one precision throughout. GR00T N1.7&apos;s vision encoder stays at FP32 &quot;for
            accuracy&quot;, and under NVFP4 the accuracy-sensitive layers stay at FP8. The build needs real data to
            choose the scale factors, and this step is called calibration. NVIDIA&apos;s recipe runs 10 samples of
            real robot data through the model, so you need recordings from your own robot to build the engine.{' '}
            <Cite id="F07-7">Isaac-GR00T deployment README, TensorRT acceleration</Cite>{' '}
            <Cite id="F07-57">Jetson AI Lab, GR00T N1.7 on Thor tutorial, how the optimisation works</Cite>{' '}
            <Cite id="F07-58">Jetson AI Lab, GR00T N1.7 on Thor tutorial</Cite>
          </Box>
          <Box variant="p">
            On the Thor, NVIDIA reports 35.6 ms for one call with mixed NVFP4 and its optimised execution profile,
            against 76.8 ms for the plain engine. That is a factor of 2.16, and the call now takes just over one
            control period. The optimised profile makes three changes.{' '}
            <Cite id="F07-4">Isaac-GR00T deployment README, Thor quantisation</Cite>{' '}
            <Cite id="F07-57">Jetson AI Lab, GR00T N1.7 on Thor tutorial, how the optimisation works</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Caching.</strong> It caches what the action head reads from the backbone.
            </li>
            <li>
              <strong>Projection fusion.</strong> It runs several matrix multiplications as one GPU kernel.
            </li>
            <li>
              <strong>CUDA graphs.</strong> A CUDA graph is a sequence of GPU kernel launches that is recorded once and
              then started again with a single call. The profile replays the GPU work this way.
            </li>
          </ul>
          <Box variant="p">
            NVIDIA&apos;s GR00T N1.7 tutorial for Thor breaks the same kind of saving down by part of the model. The
            tutorial times the model with one camera, while NVIDIA&apos;s deployment README uses two. Quantisation shrank the backbone from 27 ms
            to 13.6 ms. A rewrite of the graph, which does not depend on precision, shrank the action head from 45 ms
            to 17.2 ms. The action head reads the backbone&apos;s output at every denoising step, and that output does
            not change between steps. So the rewrite computes it once and reuses it at every step, much like the
            caching step of the optimised profile above. So the rewrite saved <Derived>27.8</Derived> ms, against{' '}
            <Derived>13.4</Derived> ms for the lower precision. Fewer bits are the smaller part of the saving.{' '}
            <Cite id="F07-4">Isaac-GR00T deployment README, Thor quantisation</Cite>{' '}
            <Cite id="F07-57">Jetson AI Lab, GR00T N1.7 on Thor tutorial, how the optimisation works</Cite>
          </Box>
          <Box variant="p">
            NVIDIA&apos;s pi0.5 tutorial on the same Thor shows how much lower precision helps once the model is compiled.
            The tutorial uses chunks of 10 actions, which it calls the action horizon. One call takes about 132 ms in
            PyTorch with BF16, about 54 ms as an FP8 TensorRT engine, and about 49 ms with FP8 plus NVFP4. Compiling
            and moving to FP8 together made the call <Derived>2.4</Derived> times faster, and the four-bit layers on
            top saved about 5 ms more.{' '}
            <Cite id="F07-51">Jetson AI Lab, OpenPi on Thor tutorial</Cite>{' '}
            <Cite id="F07-4">Isaac-GR00T deployment README, Thor quantisation</Cite>
          </Box>
          <Box variant="p">
            The evidence that the robot still succeeds at its task with a quantised engine is thin. NVIDIA&apos;s
            deployment README runs one LIBERO task for 20 episodes on an H100. PyTorch succeeded in 20 of 20 episodes, and the
            TensorRT engine in 19 of 20. That engine was unquantised BF16. The README gives no success figure for the
            NVFP4 engine or for any Jetson.{' '}
            <Cite id="F07-10">Isaac-GR00T deployment README, LIBERO closed-loop evaluation</Cite>
          </Box>
          <Box variant="p">
            NVIDIA&apos;s GR00T N1.7 tutorial for Thor states that task success is unchanged, but it gives no success
            rate or episode count. The pi0.5 tutorial checks only that the quantised model&apos;s outputs point in
            the same direction as the PyTorch outputs. It measures this with cosine similarity, where 1.0 means the
            same direction. The score is about 0.9995 for FP8 alone and 0.9946 once the four-bit layers are added.
            The second score would fail the GR00T verify step in NVIDIA&apos;s deployment README, which expects at least 0.999. Twenty episodes also
            cannot distinguish 19 of 20 (<Derived>95</Derived>%) from 20 of 20. So treat a quantised engine as a new
            policy, and evaluate it as described in section 16, Evaluation.{' '}
            <Cite id="F07-59">Jetson AI Lab, GR00T N1.7 on Thor tutorial</Cite>{' '}
            <Cite id="F07-52">Jetson AI Lab, OpenPi on Thor tutorial, accuracy check</Cite>{' '}
            <Cite id="F07-8">Isaac-GR00T deployment README, build notes</Cite>{' '}
            <Cite id="F07-10">Isaac-GR00T deployment README, LIBERO closed-loop evaluation</Cite>
          </Box>
          <Box variant="p">
            TensorRT ties an engine to the GPU type that built it. Compute capability is a version number that names
            a GPU generation: 8.7 for Jetson AGX Orin, 11.0 for Jetson AGX Thor and 12.1 for DGX Spark. The engine
            records the TensorRT version and the compute capability of the GPU it was built on. If either one does not
            match when the engine loads, the engine &quot;will fail to deserialize&quot;. So if you copy an engine
            from a Thor robot to an Orin robot, TensorRT refuses to load it, before it can drive anything.{' '}
            <Cite id="F07-77">TensorRT documentation, Engine Compatibility</Cite>{' '}
            <Cite id="F07-79">TensorRT documentation, compatibility checks and support matrix</Cite>
          </Box>
          <Box variant="p">
            A lab with both Jetson types therefore keeps one set of ONNX files and builds two sets of engines, each
            on its own type of device. A build takes about 2 to 5 minutes. Check each engine against PyTorch:
            the verify step in NVIDIA&apos;s deployment README expects a cosine similarity of 0.999 or more. If a JetPack update changes the
            TensorRT version, you have to build the engines again. On JetPack, there is no way around this rule.
            Outside JetPack, the way around it is a hardware compatibility mode, a build option that makes an engine
            loadable on other GPU types. TensorRT 11.5.0 adds this mode only on Arm server-class Linux, the category
            the DGX Spark belongs to. However, NVIDIA&apos;s deployment README pins the Spark to an older TensorRT,
            10.16.1.11, so check the installed version before you count on this mode.{' '}
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
            description="First, use the board's shared memory and its memory bandwidth to rule out boards that cannot run the policy. Then choose among the remaining boards on a timed call of your policy, because no spec sheet predicts it."
          >
            Choosing the onboard computer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On a Jetson, the CPU and the GPU share one pool of memory. That pool holds everything: the operating
            system, the control loop, the camera frames and the policy&apos;s weights. The smallest board, the Jetson
            Orin Nano Super Developer Kit, has 8 GB in that pool, with a bandwidth of 102 GB/s. NVIDIA&apos;s pi0.5
            tutorial for Thor lists about 6 GB or more of weights among its storage prerequisites, without stating
            the precision. GR00T N1.7 has about 3 billion parameters in BF16, which is about <Derived>6</Derived> GB
            at two bytes each. A policy loaded at that size leaves little of the board&apos;s memory for anything
            else.{' '}
            <Cite id="F07-36">NVIDIA Jetson Orin Nano Super Developer Kit page</Cite>{' '}
            <Cite id="F07-54">Jetson AI Lab, OpenPi on Thor tutorial, prerequisites</Cite>{' '}
            <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite>
          </Box>
          <Box variant="p">
            Memory bandwidth also sets a lower limit on the call time. A call reads every weight at least once. At 6
            GB and 102 GB/s, a call therefore takes at least 6 / 102 = <Derived>59</Derived> ms, almost two control
            periods, before any arithmetic. An engine quantised to fewer bits reads fewer bytes, which lowers this
            limit.
          </Box>
          <Box variant="p">
            That limit is only a minimum, and the figure to plan with is a timed call. For the smallest board, none
            of the sources gives a timed call to borrow. NVIDIA&apos;s benchmark table says &quot;Jetson Orin&quot; without
            naming the module. The SmolVLA paper and LeRobot&apos;s guides give no latency on a Jetson Orin Nano for
            SmolVLA or ACT, two policies that LeRobot ships.{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>{' '}
            <Cite id="F07-117">SmolVLA paper and LeRobot v0.7.0 guides, searched for a latency figure</Cite>
          </Box>
          <Box variant="p">
            No single specification predicts the call time, so base the purchase on measured calls. The Thor and the
            AGX Orin show how far the specifications and the measurements can differ.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Peak performance.</strong> NVIDIA&apos;s Thor page claims 7.5 times the performance of the AGX
              Orin.{' '}
              <Cite id="F07-39">NVIDIA Jetson Thor page, specifications</Cite>
            </li>
            <li>
              <strong>Memory bandwidth.</strong> The Thor&apos;s memory bandwidth is 273 / 204.8 ={' '}
              <Derived>1.33</Derived> times that of the AGX Orin 64GB.{' '}
              <Cite id="F07-39">NVIDIA Jetson Thor page, specifications</Cite>{' '}
              <Cite id="F07-35">NVIDIA Jetson Orin page, specifications</Cite>
            </li>
            <li>
              <strong>A third-party measurement.</strong> A third-party paper measured GR00T N1.7 at 209.9 ms on an
              AGX Orin and 101.1 ms on an AGX Thor, a ratio of <Derived>2.08</Derived>. The paper used an older
              software stack and compiled only the action head.{' '}
              <Cite id="F07-73">Perturbation Informed Execution paper, table 6</Cite>{' '}
              <Cite id="F07-74">Perturbation Informed Execution paper, inference configurations</Cite>
            </li>
            <li>
              <strong>NVIDIA&apos;s measurement.</strong> NVIDIA&apos;s own benchmark table gives a ratio of 149.0 / 76.8 ={' '}
              <Derived>1.94</Derived> against its unnamed Orin. If that Orin is an AGX Orin, which is likely but not stated, this ratio is far below the
              peak claim and above the bandwidth ratio.{' '}
              <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
            </li>
          </ul>
          <Box variant="p">
            The DGX Spark has the same 128 GB at 273 GB/s as the Thor, and it is still slower on this policy. In the
            same table, the compiled call takes 116.6 ms on the Spark against 76.8 ms on the Thor. So plan on a
            board&apos;s timed call, not on its memory specification. NVIDIA&apos;s deployment README gives no reason for
            the gap, but it does state one difference in software: the Spark runs a separate dependency stack, with
            the older TensorRT version pinned for it. When the Spark serves the policy from the desk, the network
            also adds its time, 6.89 ms to 21.20 ms in the chain that the RTC authors measured.{' '}
            <Cite id="F07-47">DGX Spark User Guide, hardware overview</Cite>{' '}
            <Cite id="F07-6">Isaac-GR00T deployment README, benchmark table</Cite>{' '}
            <Cite id="F07-9">Isaac-GR00T deployment README, DGX Spark setup</Cite>{' '}
            <Cite id="F07-68">Real-time chunking paper, appendix A.3, table 2</Cite>
          </Box>
          <Box variant="p">
            Which of the savings above a board can use depends on its GPU. The Thor&apos;s Blackwell GPU runs NVFP4
            natively, and the Thor is the only device in the table with a quantised figure, 35.6 ms. The table has no
            quantised figure for the DGX Spark, and for an Orin it has only the compiled 149.0 ms. Under JetPack 7.2,
            the Thor can also give the policy a GPU partition of its own. This feature is called MIG (Multi-Instance
            GPU). On the Thor, it splits the GPU into two isolated instances, each with its own compute, cache and
            memory bandwidth. A best-effort model, one whose timing does not matter, can then share the board without
            slowing the policy down.{' '}
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
                  <td style={TD}>No published figure found</td>
                  <td style={TD}>
                    <Cite id="F07-36">NVIDIA Jetson Orin Nano Super Developer Kit page</Cite>{' '}
                    <Cite id="F07-117">SmolVLA paper and LeRobot v0.7.0 guides, searched for a latency figure</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Jetson AGX Orin 64GB</td>
                  <td style={TD}>64 GB at 204.8 GB/s</td>
                  <td style={TD}>15 W to 60 W</td>
                  <td style={TD}>149.0 ms, but NVIDIA labels it only &quot;Jetson Orin&quot;</td>
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
            Before you flash a board, choose the JetPack release based on the software you will run. JetPack 7.2.2 is
            built on Ubuntu 24.04 and supports both Jetson families, Orin and Thor. NVIDIA&apos;s deployment README no
            longer supports JetPack 6. LeRobot&apos;s Jetson Dockerfile, on the other hand, targets JetPack 6.2 and is
            maintained by the community.{' '}
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
            description="AWS IoT Greengrass installs and starts the policy's container on the robot. You will learn which docker run flags give the container the GPU, the camera and the servo bus, because the recipes in AWS's Greengrass guide leave them out. You will also see how much of the board's shared memory the Greengrass software takes."
          >
            Installing the policy on the robot with AWS IoT Greengrass
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The compiled engine needs the GPU. When the policy ships as a container image, the{' '}
            <code>docker run</code> command that starts the container has to pass the flags that give it the GPU. If
            you manage the robot with AWS, that command goes into a file of AWS IoT Greengrass. Greengrass is an open
            source edge runtime from AWS: software on the device that installs and runs programs as a cloud service
            tells it. Three Greengrass terms matter here.{' '}
            <Cite id="F07-120">AWS IoT Greengrass developer guide, What is AWS IoT Greengrass?</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Nucleus.</strong> The nucleus is the Greengrass software on the device. It installs, restarts
              and replaces software as the Greengrass cloud service tells it, on one robot or across a fleet (section
              18, The Fleet).{' '}
              <Cite id="F07-133">Greengrass developer guide, How AWS IoT Greengrass works</Cite>
            </li>
            <li>
              <strong>Component.</strong> Each piece of software that the nucleus manages is called a component.{' '}
              <Cite id="F07-122">Greengrass developer guide, Greengrass component</Cite>
            </li>
            <li>
              <strong>Recipe.</strong> A recipe is a JSON or YAML file that defines a component&apos;s &quot;details,
              dependencies, artifacts, and lifecycles&quot;.{' '}
              <Cite id="F07-151">Greengrass developer guide, component recipe reference</Cite>
            </li>
          </ul>
          <Box variant="p">
            The lifecycle is the part of the recipe that holds the commands to install, start and stop the component.
            The <code>docker run</code> command that starts the policy&apos;s container goes in the{' '}
            <code>Run</code> step of the recipe&apos;s lifecycle.{' '}
            <Cite id="F07-153">Greengrass developer guide, Run a Docker container</Cite>
          </Box>
          <Box variant="p">
            If you copy that command as AWS documents it, the container gets no GPU, no camera and no servo bus.
            None of the four recipes on AWS&apos;s &quot;Run a Docker container&quot; page passes a GPU flag or a
            device flag. Two AWS sample repositories pass <code>--runtime nvidia</code> to give the container the GPU
            on a Jetson. NVIDIA&apos;s command for its GR00T container on Jetson and DGX Spark passes{' '}
            <code>--runtime nvidia --gpus all</code>. The AWS samples give no flags for a DGX Spark. You can pass each
            camera and the servo bus to the container with its own Docker <code>--device</code> flag, but no AWS page
            that we found shows this.{' '}
            <Cite id="F07-156">Greengrass developer guide, Run a Docker container, all recipes</Cite>{' '}
            <Cite id="F07-157">AWS samples: genai-at-edge recipe and the Physical AI Toolchain edge stack</Cite>{' '}
            <Cite id="F07-11">Isaac-GR00T deployment README, shared Docker workflow</Cite>
          </Box>
          <Snippet
            title="The policy's docker run command, with the AWS samples' Jetson flags plus one camera and the servo bus"
            mode="adapted"
            source={<Cite id="F07-157">AWS samples: genai-at-edge recipe and the Physical AI Toolchain edge stack</Cite>}
            ours={<>the two <code>--device</code> paths, for one camera and the servo bus. A second camera, as on the two-camera arm in LeRobot&apos;s RTC example, needs another <code>--device</code> flag. We have not run this command on a device.</>}
          >
            {RUN_LINE}
          </Snippet>
          <Figure
            cites="F07-44 F07-120 F07-122 F07-148 F07-153 F07-156"
            caption={
              <>
                This plan is put together from AWS and NVIDIA documentation, and it reads from the top down. The
                cloud service lists the components, the nucleus installs and starts them, and the policy component
                starts the container that holds the control loop. The container can use the GPU, the camera and the
                servo bus only if its <code>docker run</code> command passes the right flags.
              </>
            }
          >
            <DeviceStack />
          </Figure>
          <ExpandableSection headerText="How AWS's container recipe pulls the image and gives the container AWS credentials">
            <SpaceBetween size="m">
              <Box variant="p">
                AWS&apos;s recipe for a container depends on two AWS-provided components. The Docker application
                manager pulls the image from Amazon ECR (Elastic Container Registry), AWS&apos;s store for container
                images. The token exchange service hands out temporary AWS credentials. The recipe lists the image as
                an artifact, which is a file the component needs on the device, and starts it with a plain{' '}
                <code>docker run</code> command. Pin the image by tag or digest. Without a pin, each device pulls
                whatever image is latest on the day it deploys.{' '}
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
                A container that calls AWS services, for example to read weights from Amazon S3, needs a third kind
                of flag, for credentials. A robot should not carry a long-lived access key. The token exchange
                service (TES) meets this need. It is a local server on the device. The device proves its identity
                with its X.509 certificate, which is the identity file issued when the device was registered. In
                return, the device receives temporary credentials for one IAM (Identity and Access Management) role.
                The credentials are held in memory and expire after an hour by default. A container does not inherit
                these credentials. To give them to the container, its <code>docker run</code> command needs{' '}
                <code>--network=host</code> and the variables <code>AWS_CONTAINER_CREDENTIALS_FULL_URI</code> and{' '}
                <code>AWS_CONTAINER_AUTHORIZATION_TOKEN</code>, passed with <code>-e</code>. AWS notes that host
                networking is less secure.{' '}
                <Cite id="F07-148">Greengrass developer guide, Interact with AWS services; Token exchange service</Cite>{' '}
                <Cite id="F07-150">Greengrass developer guide, AWS credentials in Docker container components</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            On paper, the Greengrass software is small compared with a policy whose weights take about 6 GB or
            more, as pi0.5&apos;s do. Greengrass has two nuclei: the Java nucleus and nucleus lite, a smaller nucleus
            written in C. AWS documents a minimum of 96 MB of RAM for the Java nucleus, which is about{' '}
            <Derived>1</Derived>% of the smallest Jetson&apos;s 8 GB. AWS also measured nucleus lite&apos;s v2.5.0
            packages at 15.8 MB with six small components on a Raspberry Pi 4 (14.6 MB idle), which is about{' '}
            <Derived>0.2</Derived>% of 8 GB. The first figure is a documented minimum, and the second is a
            measurement on a different board. Neither was measured next to a running policy on a Jetson.{' '}
            <Cite id="F07-84">Greengrass developer guide, Greengrass nucleus requirements</Cite>{' '}
            <Cite id="F07-138">aws-greengrass-lite v2.7.0, RESOURCE_LIMITS.md</Cite>{' '}
            <Cite id="F07-36">NVIDIA Jetson Orin Nano Super Developer Kit page</Cite>{' '}
            <Cite id="F07-54">Jetson AI Lab, OpenPi on Thor tutorial, prerequisites</Cite>
          </Box>
          <ExpandableSection headerText="Check that a nucleus installs on your Jetson before you choose one">
            <SpaceBetween size="m">
              <Box variant="p">
                On paper, memory does not separate the two nuclei. So you choose between them on features and on
                whether each one installs.
              </Box>
              <ul style={LIST}>
                <li>
                  <strong>The Java nucleus (v2.18.4)</strong> has every feature. It needs a Java runtime and 256 MB of
                  disk.{' '}
                  <Cite id="F07-84">Greengrass developer guide, Greengrass nucleus requirements</Cite>{' '}
                  <Cite id="F07-135">Greengrass developer guide, feature compatibility</Cite>
                </li>
                <li>
                  <strong>Nucleus lite (v2.7.0)</strong> is a set of small C programs. It leaves out some features,
                  including the Greengrass command-line tool on the device. It keeps the feature that a container
                  policy needs: it runs Docker containers.{' '}
                  <Cite id="F07-135">Greengrass developer guide, feature compatibility</Cite>{' '}
                  <Cite id="F07-86">Greengrass developer guide, feature compatibility, Docker containers</Cite>
                </li>
              </ul>
              <Box variant="p">
                Check the installation before anything else, because neither nucleus lists JetPack among its
                supported platforms. For the Java nucleus, AWS lists 64-bit Arm Linux without naming a distribution.
                The nucleus lite packages target Ubuntu 24.04, the release that JetPack 7.2.2 is built on, but they
                name no Jetson.{' '}
                <Cite id="F07-140">Greengrass developer guide, nucleus supported platforms</Cite>{' '}
                <Cite id="F07-142">aws-greengrass-lite v2.7.0, package readme</Cite>{' '}
                <Cite id="F07-44">NVIDIA JetPack downloads page</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Placeholder
            what={
              <>
                our measurements of this setup on our own Jetson Orin Nano Super and DGX Spark, once both are
                connected to AWS IoT. We will record whether each nucleus installs, how much memory the nucleus uses
                while the policy runs, which <code>docker run</code> flags a recipe needs for the GPU on each machine,
                how long the policy container takes to start, and the policy&apos;s latency with the nucleus running.
              </>
            }
            source={<>our own connection of the two machines to AWS IoT, which we have not done yet. None of the Greengrass setup described here has been run on a device yet.</>}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Match what you see the arm do to its cause and to the setting that changes it. Then measure your worst call before you buy a faster board."
          >
            Diagnosing a slow policy at the bench
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            LeRobot will not stop a policy that is merely slow. Local RTC&apos;s default time limits allow an
            observation to be 5 s old by the time its actions run, which is <Derived>1.25</Derived> m of travel at
            the illustrative 0.25 m/s. They also allow a request to stay unanswered for 10 s. The documentation calls
            these limits &quot;starting values, not measured hardware guarantees&quot;. When the queue does run dry,
            a robot that supports it holds its last target for <code>action_starvation_grace_s</code>, 1 second by
            default, and then the run faults. On a robot without that support, the run faults at once.{' '}
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
                  <td style={TD}>The arm stops each time a chunk runs out, then moves on.</td>
                  <td style={TD}>Synchronous inference, LeRobot&apos;s default. The loop waits for every call.</td>
                  <td style={TD}>Switch to local RTC or remote inference.</td>
                  <td style={TD}>
                    <Cite id="F01-87">LeRobot remote inference guide and inference guide</Cite>{' '}
                    <Cite id="F07-62">Real-time chunking paper, section 2</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The arm jerks or suddenly changes route each time a new chunk takes over.</td>
                  <td style={TD}>Asynchronous chunks are merged with no guidance, and the new chunk was planned from an older frame.</td>
                  <td style={TD}>Turn RTC on. Its guided mode needs no retraining.</td>
                  <td style={TD}>
                    <Cite id="F07-12">LeRobot real-time chunking guide</Cite>{' '}
                    <Cite id="F07-64">Real-time chunking paper, section 2 and figure 2</Cite>{' '}
                    <Cite id="F07-17">LeRobot real-time chunking guide, modes</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The arm holds its last target for up to 1 s, and then the run faults.</td>
                  <td style={TD}>The queue ran dry, because the call takes more than about half the chunk.</td>
                  <td style={TD}>Shorten the call, lengthen the chunk or change the action rate. No refill value fixes it.</td>
                  <td style={TD}>
                    <Cite id="F07-20">LeRobot inference guide, real-time chunking</Cite>{' '}
                    <Cite id="F07-22">LeRobot remote inference guide, tuning</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The arm oscillates until the robot&apos;s protective stop triggers.</td>
                  <td style={TD}>Temporal ensembling with 100 ms or 200 ms of added delay.</td>
                  <td style={TD}>Use RTC instead.</td>
                  <td style={TD}>
                    <Cite id="F07-69">Real-time chunking paper, section 4.2</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The engine does not load, because it &quot;will fail to deserialize&quot;.</td>
                  <td style={TD}>The engine was built on another GPU type or with another TensorRT version.</td>
                  <td style={TD}>Build the engine on the device that runs it, and build it again after a JetPack update.</td>
                  <td style={TD}>
                    <Cite id="F07-79">TensorRT documentation, compatibility checks and support matrix</Cite>{' '}
                    <Cite id="F07-8">Isaac-GR00T deployment README, build notes</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Before you change a board or a setting, run your policy on the computer you have and read LeRobot&apos;s
            cadence report. Each line of the report gives a stage&apos;s mean time, its worst call and its share of
            the loop&apos;s work. A large share on the infer line points to the policy or the device. A large share
            on the observe line points to the cameras. A long worst call on the record line is the blocking save of
            an episode, which is timed separately from inference. In LeRobot&apos;s own sample, that worst call
            takes 620.00 ms against a mean of 0.67 ms. The report also shows the pacing headroom, which is the time
            left in each tick after the loop&apos;s work. A pacing headroom near zero &quot;means there is nothing
            left to absorb a slow tick&quot;.{' '}
            <Cite id="F07-23">LeRobot inference guide, cadence reporting</Cite>{' '}
            <Cite id="F07-24">LeRobot inference guide, reading the cadence report</Cite>
          </Box>
          <Box variant="p">
            Next, convert the worst inference time to ticks and compare it with half your chunk length. NVIDIA&apos;s
            compiled median on the Orin is 4.5 ticks, against the <Derived>20</Derived> ticks that half of a 40-tick
            chunk allows. That leaves room for a worst call about four times longer than the median. Your own worst
            call tells you whether asynchronous chunks are enough to keep the arm moving, or whether you have to make
            the call itself shorter.{' '}
            <Cite id="F07-23">LeRobot inference guide, cadence reporting</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
