import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Derived } from '../components/Cite';
import { Figure, AnimatedFigure } from '../components/Figure';
import { Formula } from '../components/Math';
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

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
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
          One GR00T N1.7 policy call (NVIDIA&apos;s figures)
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
          (the authors&apos; figures)
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

const TICK_W = 4.8;
const tx = (t: number) => 30 + TICK_W * t;
const CHUNK_LEN = 50;
const ASK_AT = 35;
const FAST_LAND = 40;
const SLOW_LAND = 65;
const WINDOW = 70;

interface ChunkFrame {
  now: number;
  slow: boolean;
  asked: boolean;
  computing: boolean;
  landed: boolean;
  dry: boolean;
}

const CHUNK_FRAMES: ChunkFrame[] = [
  { now: 18, slow: false, asked: false, computing: false, landed: false, dry: false },
  { now: 35, slow: false, asked: true, computing: false, landed: false, dry: false },
  { now: 38, slow: false, asked: true, computing: true, landed: false, dry: false },
  { now: 46, slow: false, asked: true, computing: true, landed: true, dry: false },
  { now: 44, slow: true, asked: true, computing: true, landed: false, dry: false },
  { now: 58, slow: true, asked: true, computing: true, landed: false, dry: true },
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

export function OnRobot() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Fit a policy inside a latency budget on a named device, and know what else runs beside it (NVIDIA's Isaac-GR00T and TensorRT documentation, LeRobot v0.7.0 and the AWS IoT Greengrass guide, read 2026-11-20)"
          >
            17. Running on the Robot
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A trained policy has to run on a computer bolted beside the arm, and that computer has a clock to keep.
            Section 3, The Robot as a Computer, set the clock for the {ARM}: 30 ticks a second, 33.3 ms each. Section 5, Vision-Language-Action Models, showed that the large models answer far more slowly than that. This
            section puts the two together on named devices as the arm learns to {TASK_STORY}.
          </Box>
          <Box variant="p">
            The number to carry through it: NVIDIA reports 149.0 ms for one call of its GR00T N1.7 policy on a Jetson
            Orin, which is 4.5 control periods at 30 Hz.{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite> The blocks below are the ways to
            live with a gap of that size, and the last one covers managing the device from an AWS account.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Which computer sits beside the arm, and what software it runs today">
            The devices
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Three NVIDIA machines cover the range. A Jetson is a small computer built to ride on a robot: an Arm CPU
            and a GPU on one board, sharing one pool of memory, so an 8 GB board does not give a policy 8 GB of GPU
            memory. A DGX Spark is a desk-side box with the same shared-memory design. The table gives each as
            NVIDIA specifies it.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560 }}>
              <thead>
                <tr>
                  <th style={TH}>Device</th>
                  <th style={TH}>Where it sits</th>
                  <th style={TH}>Memory, shared by CPU and GPU</th>
                  <th style={TH}>Power</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Jetson Orin Nano Super Developer Kit</td>
                  <td style={TD}>On or beside a small arm such as the {ARM}</td>
                  <td style={TD}>8 GB</td>
                  <td style={TD}>7 W to 25 W</td>
                  <td style={TD}>
                    <Cite id="F07-36">NVIDIA Jetson Orin Nano Super Developer Kit page</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Jetson AGX Thor Developer Kit (T5000 module)</td>
                  <td style={TD}>On a larger robot, with room for a large policy</td>
                  <td style={TD}>128 GB</td>
                  <td style={TD}>40 W to 130 W</td>
                  <td style={TD}>
                    <Cite id="F07-39">NVIDIA Jetson Thor page, specifications</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>DGX Spark</td>
                  <td style={TD}>On the desk, wired to the robot computer</td>
                  <td style={TD}>128 GB</td>
                  <td style={TD}>240 W power supply; the chip&apos;s budget is 140 W</td>
                  <td style={TD}>
                    <Cite id="F07-47">DGX Spark User Guide, hardware overview</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Both Jetson families run JetPack, NVIDIA&apos;s bundle of Linux, GPU drivers and libraries. The current
            release is JetPack 7.2.2, built on Ubuntu 24.04 with Linux kernel 6.8.{' '}
            <Cite id="F07-44">NVIDIA JetPack downloads page</Cite> DGX Spark needs its own dependency stack.{' '}
            <Cite id="F07-9">Isaac-GR00T deployment README, platform setup</Cite>
          </Box>
          <Box variant="p">
            NVIDIA&apos;s latency table says &quot;Jetson Orin&quot; without naming the module, and no first-party
            latency for a policy on a Jetson Orin Nano was located in this research.{' '}
            <Cite id="F07-117">SmolVLA paper and LeRobot v0.7.0 guides, searched for a latency figure</Cite> On the
            smallest board, the figure that counts is the one you measure.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Count a policy call in control periods, and see which links of the chain nobody has published">
            The budget, from camera to motor
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 3 turned delay into distance: the gripper keeps moving on old orders from the moment a frame is
            captured until the action computed from it reaches the servos. That span is the budget, and it is a
            chain: the camera frame, image preparation, the policy call, decoding the actions, and the write to the
            servo bus. The policy call is the longest link. Count it in control periods, the unit the loop works in.
          </Box>
          <Box variant="p">
            The worked example: 149.0 ms divided by a 33.3 ms period is 4.47, so NVIDIA&apos;s Jetson Orin figure is
            4.5 control periods at 30 Hz. The arm has played four actions and started a fifth before the answer to
            one camera frame exists.{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
          </Box>
          <Figure
            cites="F07-1 F07-5 F07-68 F07-118"
            caption={
              <>
                Read each bar against the gridlines: one gridline is one tick of a 30 Hz loop. The top group is
                NVIDIA&apos;s table for one compiled call of GR00T N1.7. The bottom group is the one measured
                end-to-end chain found, reported by its authors for a different policy served from a workstation.
              </>
            }
          >
            <BudgetChart />
          </Figure>
          <Box variant="p">
            NVIDIA&apos;s conditions, stated once: the <code>nvidia/GR00T-N1.7-LIBERO</code> checkpoint, batch size 1,
            a chunk of 40 actions, four refinement steps and two 256x256 camera images, with image preparation and
            action decoding inside the timing.{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite> Each figure is the median of 60
            timed calls on fixed inputs, with the Jetsons in their maximum power mode, and the table does &quot;not
            measure closed-loop task success&quot;.{' '}
            <Cite id="F07-3">Isaac-GR00T deployment README, measurement details</Cite> A median hides the slowest
            call, which is the one a control loop feels. Section 5 quoted NVIDIA&apos;s model card, which times one
            camera on another software stack and prints other figures: a latency belongs to its device, runtime,
            camera count and step count together.
          </Box>
          <Box variant="p">
            The two ends of the chain are open. No first-party figure was located for camera exposure, the USB
            transfer, or the servo bus write on an {ARM}. The first link has a known bound: a frame from a 30 fps
            camera can be up to 33.3 ms old before any processing starts.{' '}
            <Cite id="F07-118">LeRobot inference guide, sample cadence report</Cite>
          </Box>
          <ExpandableSection headerText="The measured chain, link by link">
            <SpaceBetween size="s">
              <Box variant="p">
                The authors of the real-time chunking paper measured 50 inference calls during a real episode, over
                wired Ethernet. With a desktop robot computer the chain was model 97.43 ms, network 6.89 ms, image
                resize 1.44 ms and other 3.00 ms: 108.76 ms in total. With a small on-robot computer (an Intel NUC)
                it was model 96.89 ms, network 21.20 ms, image resize 11.22 ms and other 9.67 ms: 138.98 ms.{' '}
                <Cite id="F07-68">Real-time chunking paper, appendix A.3, table 2</Cite>
              </Box>
              <Box variant="p">
                The model&apos;s time barely moves between the rows. The weaker robot computer spent 11.22 ms
                resizing images against 1.44 ms: the CPU beside the arm is part of the budget even when the GPU is
                elsewhere.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="How a model that needs 4.5 control periods keeps a 30 Hz loop fed, and the one case no setting rescues">
            Chunking buys time
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 4 introduced the action chunk: one policy call returns the next several dozen actions, and the
            host loop plays one per tick. A slow model can then drive a fast loop, as long as it refills the queue
            before the queue empties.
          </Box>
          <Box variant="p">
            The simplest schedule is synchronous: play the chunk, then call the model and wait. When the call is
            longer than one period, this &quot;introduces visible pauses between chunks&quot;. The alternative is
            asynchronous: start the next call early, while the current chunk is still playing.{' '}
            <Cite id="F07-62">Real-time chunking paper, section 2</Cite>
          </Box>
          <Box variant="p">
            Starting early leaves a seam. The new chunk was computed from a camera frame that is several ticks old
            when it lands, and it may disagree with the motion the arm is in the middle of. Real-time chunking (RTC)
            handles the seam in two moves: generate the next chunk while the current one plays, and make the new
            chunk agree with the actions already committed.{' '}
            <Cite id="F07-12">LeRobot real-time chunking guide</Cite> The actions that will have been played before
            the new chunk arrives are treated as fixed, and the model fills in the rest so that it continues from
            them.{' '}
            <Cite id="F07-65">Real-time chunking paper, section 3 and figure 3</Cite>
          </Box>
          <AnimatedFigure
            name="chunks against the control clock"
            steps={CHUNK_STEPS}
            intervalMs={2800}
            cites="F07-5 F07-12 F07-22 F07-26 F07-65"
            caption={
              <>
                Follow the marker along the clock. Steps 1 to 4 are the fast case, steps 5 and 6 the slow one. The
                timing is illustrative: a 50-action chunk at 30 Hz, a request with 0.5 s of playback left, and a call
                of 5 ticks or of 30.
              </>
            }
          >
            {(step, reduced) => <ChunkClock step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            LeRobot v0.7.0 ships the asynchronous pattern as remote inference. The checkpoint moves to a policy
            server, for example a DGX Spark on the desk. Cameras, motors and recording stay on the robot computer,
            and &quot;the remote client does not load weights&quot;. The two sides talk over Zenoh, a
            publish/subscribe network protocol that carries observations one way and chunks back.{' '}
            <Cite id="F07-25">LeRobot remote inference guide, installation</Cite>
          </Box>
          <Box variant="p">
            The client decides when to ask for the next chunk. Ask too late and the queue empties; ask too early and
            most of each chunk is discarded unplayed. Its rule uses three quantities: <code>refill_seconds</code>,
            your setting for how much playback may remain when it asks (default 0.5 s); the turnaround, the measured
            round trip from encoding through network and inference to decoding; and <code>fps</code>, the action
            rate.
          </Box>
          <Formula
            name="When the client asks for the next chunk"
            tex={String.raw`\small \begin{aligned} &\text{effective refill} = \max(\text{set},\ \text{floor}) \\ &\text{set} = \texttt{refill\_seconds} \\ &\text{floor} = \text{recent maximum turnaround} \\ &\qquad\quad + 1 / \texttt{fps} \end{aligned}`}
            source={<Cite id="F07-26">LeRobot remote inference guide, parameters</Cite>}
          />
          <Box variant="p">
            The first term is your preference. The second is a floor taken from measurement: the slowest recent round
            trip plus one tick of margin. At 30 Hz with a 149 ms turnaround the floor is 0.149 + 0.033 = 0.182 s,
            below 0.5 s, so the default applies and the client asks with <Derived>15</Derived> actions left (0.5 s x
            30 actions a second).{' '}
            <Cite id="F07-26">LeRobot remote inference guide, parameters</Cite>
          </Box>
          <Box variant="p">
            The limit is arithmetic, and the guide states it: &quot;If inference takes 1 second out of a 1.67-second
            prediction, only about 0.67 seconds remain. Another 1-second request cannot fit; no refill value fixes
            that.&quot;{' '}
            <Cite id="F07-22">LeRobot remote inference guide, tuning</Cite> In our arithmetic from that rule, the
            turnaround has to stay under about half the chunk&apos;s duration, less the one-tick margin of the
            floor. A 1.67 s chunk allows about <Derived>0.8</Derived> s, and the 149.0 ms of the worked example is well inside.{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite> When the check fails, the
            guide&apos;s remedies are a shorter turnaround, a longer chunk, or a different action rate.
          </Box>
          <Box variant="p">
            RTC&apos;s authors tested how much delay it absorbs. They ran pi0.5, a vision-language-action (VLA) model
            from Physical Intelligence, with 50-action chunks on 50 Hz robots, and injected up to 200 ms of extra
            latency, a delay of about 16 steps or 320 ms. Across 480 episodes and 28 hours they report &quot;no
            degradation&quot; for RTC, while synchronous execution got worse in step with the delay.{' '}
            <Cite id="F07-69">Real-time chunking paper, section 4.2</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Two ways to make the call itself shorter, and how thin the evidence is that the robot still succeeds">
            Making the model fit
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Chunking tolerates a slow call. Two build steps make the call shorter: compile the model for the
            device&apos;s GPU, and store its numbers in fewer bits. On NVIDIA&apos;s Jetson Orin row, the same policy
            takes 357.9 ms in plain PyTorch and 149.0 ms compiled.{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
          </Box>
          <Box variant="p">
            <strong>Engines.</strong> TensorRT is NVIDIA&apos;s inference compiler and runtime. It takes a model
            graph, usually an ONNX (Open Neural Network Exchange) file, the portable format a trained checkpoint is
            exported to, and picks a GPU implementation for every layer by timing candidates on the machine doing
            the build. The result is a file called an engine.{' '}
            <Cite id="F07-76">TensorRT 11.5 release notes</Cite> The choices were timed on one GPU, so the engine
            belongs to that kind of GPU: &quot;By default, TensorRT engines are only compatible with the type of
            device where they were built.&quot;{' '}
            <Cite id="F07-77">TensorRT documentation, Engine Compatibility</Cite>
          </Box>
          <Box variant="p">
            The engine records the TensorRT version and the GPU&apos;s compute capability, a number naming the GPU
            generation: 8.7 for Jetson AGX Orin, 11.0 for Jetson AGX Thor, 12.1 for DGX Spark. On a mismatch it
            &quot;will fail to deserialize&quot;.{' '}
            <Cite id="F07-79">TensorRT documentation, compatibility checks and support matrix</Cite> A lab with both
            Jetson types keeps one set of ONNX files and builds two sets of engines, on the devices themselves, at
            about 2 to 5 minutes a build.{' '}
            <Cite id="F07-8">Isaac-GR00T deployment README, build notes</Cite> A JetPack update that changes the
            TensorRT version means building again.
          </Box>
          <Box variant="p">
            TensorRT 11.5.0 adds one exception, a hardware compatibility mode on Arm server-class Linux, the
            category DGX Spark belongs to: an engine built with it runs on other supported GPUs there. The mode is
            not supported on JetPack, so on a Jetson every device type gets its own engine.{' '}
            <Cite id="F07-77">TensorRT documentation, Engine Compatibility</Cite> Check the installed version before
            counting on the mode: NVIDIA&apos;s GR00T guide pins an older TensorRT on DGX Spark.{' '}
            <Cite id="F07-9">Isaac-GR00T deployment README, DGX Spark setup</Cite>
          </Box>
          <Box variant="p">
            <strong>Quantisation.</strong> Quantisation stores a model&apos;s numbers in fewer bits, so each layer
            moves less memory and does cheaper arithmetic. The unquantised default for these policies is BF16, a
            sixteen-bit floating-point format. NVFP4 is, in NVIDIA&apos;s words, &quot;a 4-bit floating-point format
            with per-block scaling&quot;, supported natively by the GPU in Thor.{' '}
            <Cite id="F07-58">Jetson AI Lab, GR00T N1.7 on Thor tutorial</Cite> On AGX Thor, NVIDIA reports that mixed
            NVFP4 with its optimised execution profile cuts the call from 76.8 ms to 35.6 ms, a factor of 2.16. The
            profile also caches work between refinement steps, so fewer bits are only part of that saving. No other
            device in the table has a quantised figure.{' '}
            <Cite id="F07-4">Isaac-GR00T deployment README, Thor quantisation</Cite>
          </Box>
          <Box variant="p">
            Task success under quantisation has one small check behind it. NVIDIA&apos;s README reports one task from
            LIBERO, a suite of simulated manipulation tasks, run for 20 episodes on an H100: PyTorch 20 of 20, the
            TensorRT pipeline 19 of 20. That engine was unquantised BF16. There is no success figure for the NVFP4
            engine or for any Jetson.{' '}
            <Cite id="F07-10">Isaac-GR00T deployment README, LIBERO closed-loop evaluation</Cite> NVIDIA&apos;s
            tutorial states that task success is unchanged and prints no rate or episode count.{' '}
            <Cite id="F07-59">Jetson AI Lab, GR00T N1.7 on Thor tutorial</Cite> Treat a quantised engine as a new
            policy and evaluate it as section 16, Evaluation, describes.
          </Box>
          <Box variant="p">
            One newer figure exists. NVIDIA&apos;s GR00T 2 whitepaper of November 2026 reports 124 ms per action
            chunk on a Jetson Thor at 120 W for its Turbo variant. It is a vendor claim from a whitepaper with no
            released code or weights; the GR00T N1.7 table remains the newest for a model you can download.{' '}
            <Cite id="F07-119">NVIDIA GR00T 2 whitepaper, table 27</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="What to install on the Jetson so an AWS account can start, update and trust the policy, and what the documents leave for you to write">
            What else runs on the device: the managed side
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A robot computer is still a computer someone has to manage: install the policy, restart it when it dies,
            give it credentials, replace it next month. On AWS the service for this is AWS IoT Greengrass, which AWS
            defines as &quot;an open source Internet of Things (IoT) edge runtime and cloud service that helps you
            build, deploy and manage IoT applications on your devices&quot;. It has two halves: software on the
            device, and a cloud service that tells that software what to run.{' '}
            <Cite id="F07-120">AWS IoT Greengrass developer guide, What is AWS IoT Greengrass?</Cite>
          </Box>
          <Box variant="p">
            <strong>What gets installed.</strong> The device half is one program, the nucleus. It comes in two
            implementations.{' '}
            <Cite id="F07-133">Greengrass developer guide, How AWS IoT Greengrass works</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>The Java nucleus</strong> (v2.18.4) has every feature and needs a Java runtime. Its documented
              minimums are 256 MB of disk and 96 MB of RAM.{' '}
              <Cite id="F07-84">Greengrass developer guide, Greengrass nucleus requirements</Cite>
            </li>
            <li>
              <strong>Nucleus lite</strong> (v2.7.0) is a set of small C programs with a shorter feature list; it
              cannot, for example, be driven by the Greengrass command-line tool on the device.{' '}
              <Cite id="F07-135">Greengrass developer guide, feature compatibility</Cite> AWS measured its v2.5.0 packages at 14.6 MB
              of memory idle and 15.8 MB with six small components running, on a Raspberry Pi 4.{' '}
              <Cite id="F07-138">aws-greengrass-lite v2.7.0, RESOURCE_LIMITS.md</Cite>
            </li>
          </ul>
          <Box variant="p">
            Both figures are AWS&apos;s, and neither was taken on a Jetson. For the Java nucleus AWS lists 64-bit Arm
            Linux as a supported architecture and names no Linux distribution, so JetPack is neither listed nor
            excluded.{' '}
            <Cite id="F07-140">Greengrass developer guide, nucleus supported platforms</Cite> The nucleus lite
            packages name Ubuntu 24.04, the release JetPack 7.2.2 is built on, and no Jetson.{' '}
            <Cite id="F07-142">aws-greengrass-lite v2.7.0, package readme</Cite>
          </Box>
          <Box variant="p">
            <strong>What a component is.</strong> Everything the nucleus runs is a component: a recipe, which is a
            JSON or YAML file that defines its &quot;details, dependencies, artifacts, and lifecycles&quot;, plus
            its artifacts, the files it needs.{' '}
            <Cite id="F07-122">Greengrass developer guide, Greengrass component</Cite>{' '}
            <Cite id="F07-151">Greengrass developer guide, component recipe reference</Cite> The lifecycle holds the
            commands: what to run to install, to start and to stop.
          </Box>
          <Box variant="p">
            <strong>The policy as a container component.</strong> A policy with its engines and libraries ships most
            easily as a container image, and AWS documents a recipe for that. It depends on two AWS components: the
            Docker application manager, which pulls the image (here from Amazon Elastic Container Registry, ECR),
            and the token exchange service. The image is listed as an artifact, and the lifecycle is a plain{' '}
            <code>docker run</code>.{' '}
            <Cite id="F07-153">Greengrass developer guide, Run a Docker container</Cite>
          </Box>
          <Snippet
            title="A container component recipe, as AWS documents it"
            mode="copied"
            source={<Cite id="F07-153">Greengrass developer guide, Run a Docker container (private Amazon ECR image)</Cite>}
          >
            {RECIPE}
          </Snippet>
          <Box variant="p">
            Pin the image by tag or digest. Without one, each device pulls whatever is latest on the day it deploys.
            Docker has to be installed and running first.{' '}
            <Cite id="F07-154">Greengrass developer guide, Docker application manager requirements</Cite>
          </Box>
          <Box variant="p">
            <strong>GPU access.</strong> AWS&apos;s documentation shows no GPU flag. None of the four recipes on its
            &quot;Run a Docker container&quot; page passes a GPU or device flag.{' '}
            <Cite id="F07-156">Greengrass developer guide, Run a Docker container, all recipes</Cite> The lifecycle
            script is a shell line, so GPU access is whatever <code>docker run</code> arguments you write into the
            recipe. Two AWS sample repositories, which are samples and were not run in this research, start a Jetson
            container with <code>docker run --runtime nvidia</code>.{' '}
            <Cite id="F07-157">AWS samples: genai-at-edge recipe and the Physical AI Toolchain edge stack</Cite>{' '}
            NVIDIA&apos;s own command for its GR00T container on Jetson and DGX Spark passes{' '}
            <code>--runtime nvidia --gpus all</code>.{' '}
            <Cite id="F07-11">Isaac-GR00T deployment README, shared Docker workflow</Cite> Neither source says which
            flags a Greengrass recipe needs on a DGX Spark. In our reading, the camera and the servo bus reach the
            container the same way, through standard Docker device flags that no AWS page read for this dive shows.
          </Box>
          <Figure
            cites="F07-44 F07-120 F07-122 F07-148 F07-153 F07-156"
            caption={
              <>
                Read from the top: the cloud service names the components, the nucleus installs and starts them, and
                the policy component starts the container that holds the control loop. The layout is our reading of
                the documents; it has not been run on a device.
              </>
            }
          >
            <DeviceStack />
          </Figure>
          <Box variant="p">
            <strong>Credentials.</strong> A component that calls AWS, to read weights from Amazon S3 for instance,
            needs credentials, and a robot should not carry a long-lived access key. The token exchange service
            (TES) is a local server on the device that meets this need. The device proves its identity with its
            X.509 certificate, the identity file issued when it was registered, and receives temporary credentials
            for one IAM (Identity and Access Management) role. They are held in memory and expire after an hour by
            default, and AWS SDKs find TES through an environment variable.{' '}
            <Cite id="F07-148">Greengrass developer guide, Interact with AWS services; Token exchange service</Cite>{' '}
            A container does not inherit this. It needs <code>--network=host</code> and two environment variables
            passed in, and AWS notes that host networking is less secure.{' '}
            <Cite id="F07-150">Greengrass developer guide, AWS credentials in Docker container components</Cite>
          </Box>
          <Box variant="p">
            No first-party sample from 2025 or 2026 that runs a GPU policy container on a Jetson under Greengrass
            was located in this research, so the first run is yours to do.{' '}
            <Cite id="F07-199">Search of AWS posts and sample repositories</Cite> In order:
          </Box>
          <ol style={LIST}>
            <li>
              Time one policy call on your device with your cameras and step count, and divide by the control period.
              NVIDIA&apos;s 149.0 ms on Jetson Orin is 4.5 periods; yours will differ.
            </li>
            <li>Check the turnaround against half the chunk&apos;s duration before tuning anything else.</li>
            <li>Build the engines on the device that will run them, and rebuild after a JetPack update.</li>
            <li>
              Install a nucleus, wrap the policy container in a recipe, and write its GPU and device flags yourself.
            </li>
          </ol>
          <Box variant="p">Section 18, The Fleet, takes the same component from one device to many.</Box>
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
    </SpaceBetween>
  );
}
