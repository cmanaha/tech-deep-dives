import type { CSSProperties } from 'react';
import { Arrow, EMPHASIS, GPU_FILL, GPU_INK, LINE, MUTED, PANEL, PAPER, T, box, useNarrow } from './WmJepaKit';

/**
 * Section 18: episodes travel from the arms to Amazon S3, and a policy comes back.
 *
 * One fleet picture. Episode files rise from three arms into the bucket, join the episodes of the
 * other arms, and feed curation and training. A new policy version comes out and travels down to
 * the canary group, where the staged rollout figure takes over. Two spans on a time ruler, drawn
 * to one scale, carry the medians one published fleet measured. The arm count and the version
 * numbers are an illustration.
 */

const ROBOT_FILL = '#fff6d6';
const ROBOT_INK = '#7a5c00';
const STORE_FILL = '#eef0f2';
const STORE_INK = '#44505c';
const ROWS_FILL = '#e8f1fb';
const ROWS_INK = '#1f5fa8';

/** Published medians, in seconds. */
const TO_LEARNER_S = 41;
const TO_ROBOT_S = 38;

export const FLEET_LOOP_STEPS: string[] = [
  'Three arms finish an episode. Its rows and video sit as files on the disk beside each arm.',
  'At the episode boundary an upload component sends the files to Amazon S3 in parts.',
  'In the bucket they join the episodes from every other arm: the fleet writes one dataset.',
  'Curation and training run on it. In the one published fleet loop cited here, an episode reached the learner in 41 s at the median.',
  'Training publishes a new policy version. In that same loop a new model reached a robot in 38 s at the median.',
  'The new version returns through the staged rollout of the previous figure, canary group first, and the next episodes are recorded under it. The loop has closed.',
];

interface Pt {
  x: number;
  y: number;
}

interface Geo {
  tile: number;
  tileAt: (i: number) => Pt;
  /** Size of an episode glyph. */
  ew: number;
  eh: number;
  /** Where an episode waits above its arm, and its slot in the bucket. */
  startY: number;
  slot: (k: number) => Pt;
  s3: { x: number; y: number; w: number; h: number };
  train: { x: number; y: number; w: number; h: number };
  chip: { x: number; y: number; w: number; h: number; pitch: number; rowPitch: number };
  /** Policy tile: where it appears, and where it lands above the canary group. */
  policy: [Pt, Pt];
  canary: { x: number; y: number; w: number; h: number };
  spanA: Pt;
  spanB: Pt;
  /** Pixels per second on the ruler. */
  perS: number;
  /** Which arms send an episode, and which form the canary group. */
  senders: number[];
  canaryArms: number[];
}

const ARMS = 20;

const WIDE: Geo = {
  tile: 40,
  tileAt: (i) => ({ x: 40 + i * 58, y: 440 }),
  ew: 30,
  eh: 22,
  startY: 412,
  slot: (k) => ({ x: 322 + (k % 3) * 40, y: 200 + Math.floor(k / 3) * 30 }),
  s3: { x: 300, y: 162, w: 160, h: 140 },
  train: { x: 560, y: 150, w: 280, h: 170 },
  chip: { x: 578, y: 198, w: 34, h: 26, pitch: 46, rowPitch: 40 },
  policy: [
    { x: 880, y: 222 },
    { x: 1052, y: 400 },
  ],
  canary: { x: 1020, y: 434, w: 168, h: 52 },
  spanA: { x: 380, y: 74 },
  spanB: { x: 890, y: 74 },
  perS: 4,
  senders: [2, 5, 8],
  canaryArms: [17, 18, 19],
};

const NARROW: Geo = {
  tile: 26,
  tileAt: (i) => ({ x: 17 + (i % 10) * 33, y: 480 + Math.floor(i / 10) * 34 }),
  ew: 24,
  eh: 18,
  startY: 458,
  slot: (k) => ({ x: 34 + (k % 3) * 36, y: 224 + Math.floor(k / 3) * 24 }),
  s3: { x: 20, y: 200, w: 130, h: 102 },
  train: { x: 184, y: 196, w: 164, h: 110 },
  chip: { x: 196, y: 232, w: 28, h: 20, pitch: 37, rowPitch: 30 },
  policy: [
    { x: 214, y: 330 },
    { x: 242, y: 444 },
  ],
  canary: { x: 243, y: 475, w: 102, h: 36 },
  spanA: { x: 20, y: 100 },
  spanB: { x: 20, y: 142 },
  perS: 5,
  senders: [0, 2, 4],
  canaryArms: [7, 8, 9],
};

const POLICY_W = 104;
const POLICY_H = 26;

function ArmTile({ p, size, asked, fade }: { p: Pt; size: number; asked: boolean; fade: string }) {
  const k = size / 40;
  return (
    <g>
      <rect x={p.x} y={p.y} width={size} height={size} rx="4" fill={ROBOT_FILL} stroke={asked ? EMPHASIS : ROBOT_INK} strokeWidth={asked ? 2.8 : 1.4} style={{ transition: fade }} />
      <path
        d={`M${p.x + 8 * k} ${p.y + 32 * k}h${12 * k}M${p.x + 14 * k} ${p.y + 32 * k}L${p.x + 17 * k} ${p.y + 18 * k}L${p.x + 29 * k} ${p.y + 12 * k}L${p.x + 32 * k} ${p.y + 19 * k}`}
        fill="none"
        stroke={ROBOT_INK}
        strokeWidth={2.4 * k + 0.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

/** One episode as files: a table of rows on top, a strip of video frames under it. Drawn at the origin. */
function EpisodeGlyph({ w, h }: { w: number; h: number }) {
  const half = h / 2;
  return (
    <g>
      <path d={box(0, 0, w, half)} fill={ROWS_FILL} stroke={ROWS_INK} strokeWidth="1.2" />
      <path d={`M3 ${half * 0.38}H${w - 3}M3 ${half * 0.7}H${w - 3}`} stroke={ROWS_INK} strokeWidth="1" fill="none" />
      <path d={box(0, half, w, half)} fill="#fff4e0" stroke="#b7791f" strokeWidth="1.2" />
      <path d={`M${w / 3} ${half}v${half}M${(2 * w) / 3} ${half}v${half}`} stroke="#b7791f" strokeWidth="1" fill="none" />
    </g>
  );
}

function Bucket({ r }: { r: Geo['s3'] }) {
  const ry = r.w * 0.085;
  return (
    <g>
      <path d={`M${r.x} ${r.y + ry}V${r.y + r.h - ry}a${r.w / 2} ${ry} 0 0 0 ${r.w} 0V${r.y + ry}`} fill={STORE_FILL} stroke={STORE_INK} strokeWidth="1.5" />
      <ellipse cx={r.x + r.w / 2} cy={r.y + ry} rx={r.w / 2} ry={ry} fill="#ffffff" stroke={STORE_INK} strokeWidth="1.5" />
    </g>
  );
}

function GpuChip({ x, y, w, h, lit, fade }: { x: number; y: number; w: number; h: number; lit: boolean; fade: string }) {
  return (
    <g>
      {[0.25, 0.5, 0.75].map((p) => (
        <path key={p} d={`M${x + w * p} ${y - 3}v3M${x + w * p} ${y + h}v3`} stroke={MUTED} strokeWidth="1.5" fill="none" />
      ))}
      <rect x={x} y={y} width={w} height={h} rx="3" fill={lit ? GPU_FILL : '#dfe7f1'} stroke={lit ? GPU_INK : MUTED} strokeWidth="1.3" style={{ transition: fade }} />
      <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx="2" fill={lit ? '#7cc692' : '#c7d3e3'} style={{ transition: fade }} />
    </g>
  );
}

/** A measured span on the ruler, with a tick every 10 seconds. */
function Span({ at, seconds, perS, style }: { at: Pt; seconds: number; perS: number; style: CSSProperties }) {
  const w = seconds * perS;
  const ticks = [];
  for (let s = 10; s < seconds; s += 10) ticks.push(s);
  return (
    <g style={style}>
      <line x1={at.x} y1={at.y} x2={at.x + w} y2={at.y} stroke={EMPHASIS} strokeWidth="4" />
      <path d={`M${at.x} ${at.y - 8}v16M${at.x + w} ${at.y - 8}v16`} stroke={EMPHASIS} strokeWidth="2.5" fill="none" />
      {ticks.map((s) => (
        <line key={s} x1={at.x + s * perS} y1={at.y + 2} x2={at.x + s * perS} y2={at.y + 9} stroke={EMPHASIS} strokeWidth="1.5" />
      ))}
    </g>
  );
}

export function FleetLoop({ step, reduced }: { step: number; reduced: boolean }) {
  const narrow = useNarrow();
  const g = narrow ? NARROW : WIDE;
  const W = narrow ? 360 : 1240;
  const H = narrow ? 652 : 552;
  const fade = reduced ? 'none' : 'opacity 400ms ease, fill 400ms ease, stroke 400ms ease';
  const shown = (on: boolean): CSSProperties => ({ opacity: on ? 1 : 0, transition: reduced ? 'none' : 'opacity 400ms ease' });
  const moved = (p: Pt): CSSProperties => ({ transform: `translate(${p.x}px, ${p.y}px)`, transition: reduced ? 'none' : 'transform 900ms ease' });
  const centre = (i: number) => g.tileAt(i).x + g.tile / 2;
  const mouth = { x: g.s3.x + g.s3.w / 2, y: g.s3.y + g.s3.h + 4 };
  const pol = g.policy[step >= 5 ? 1 : 0];
  const trainMidY = g.train.y + g.train.h / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="fleet-back-title" style={{ width: '100%', height: 'auto' }}>
      <title id="fleet-back-title">Episodes travelling from the arms of a fleet to Amazon S3 and training, and a new policy coming back</title>
      <desc>
        A row of twenty arms at the bottom, a storage bucket and a training block with GPU chips above them, and a
        time ruler at the top. Episode files rise from three arms into the bucket, where they join the episodes of the
        other arms. The training block lights up and a new policy version comes out of it and travels down to a canary
        group of three arms. Two spans on the ruler, drawn to one scale, give the medians of one published fleet of 16
        robots: 41 seconds from an episode being produced to the learner having it, and 38 seconds from a model being
        published to a robot having it.
      </desc>
      <rect x="0" y="0" width={W} height={H} fill={PAPER} />

      {/* the measured spans */}
      <Span at={g.spanA} seconds={TO_LEARNER_S} perS={g.perS} style={shown(step >= 3)} />
      <Span at={g.spanB} seconds={TO_ROBOT_S} perS={g.perS} style={shown(step >= 4)} />

      {/* the way up: guide lines from the sending arms to the bucket */}
      {g.senders.map((i) => (
        <line key={i} x1={centre(i)} y1={g.startY - 3} x2={mouth.x} y2={mouth.y} stroke={step === 1 ? EMPHASIS : LINE} strokeWidth={step === 1 ? 2 : 1.2} strokeDasharray="5 4" style={{ transition: fade }} />
      ))}

      <Bucket r={g.s3} />
      {[3, 4, 5, 6, 7, 8].map((k) => (
        <g key={k} style={{ ...moved(g.slot(k)), ...shown(step >= 2), transition: reduced ? 'none' : 'opacity 400ms ease' }}>
          <EpisodeGlyph w={g.ew} h={g.eh} />
        </g>
      ))}

      {/* curation and training */}
      <rect x={g.train.x} y={g.train.y} width={g.train.w} height={g.train.h} rx="10" fill={PANEL} stroke={step === 3 ? EMPHASIS : LINE} strokeWidth={step === 3 ? 2.5 : 1.2} style={{ transition: fade }} />
      {Array.from({ length: 8 }, (_, k) => (
        <GpuChip key={k} x={g.chip.x + (k % 4) * g.chip.pitch} y={g.chip.y + Math.floor(k / 4) * g.chip.rowPitch} w={g.chip.w} h={g.chip.h} lit={step >= 3} fade={fade} />
      ))}
      <Arrow x1={g.s3.x + g.s3.w + 3} y1={trainMidY} x2={g.train.x - 2} y2={trainMidY} color={step === 3 ? EMPHASIS : MUTED} />

      {/* the arms */}
      <path d={box(g.canary.x, g.canary.y, g.canary.w, g.canary.h)} fill="none" stroke={EMPHASIS} strokeWidth="1.5" strokeDasharray="5 4" />
      {Array.from({ length: ARMS }, (_, i) => (
        <ArmTile key={i} p={g.tileAt(i)} size={g.tile} asked={step >= 5 && g.canaryArms.includes(i)} fade={fade} />
      ))}

      {/* the travelling episodes */}
      {g.senders.map((i, k) => (
        <g key={i} style={moved(step >= 1 ? g.slot(k) : { x: centre(i) - g.ew / 2, y: g.startY })}>
          <EpisodeGlyph w={g.ew} h={g.eh} />
        </g>
      ))}

      {/* the way back: the new policy version */}
      <path d={box(g.policy[0].x, g.policy[0].y, POLICY_W, POLICY_H)} fill="none" stroke={LINE} strokeWidth="1.2" strokeDasharray="4 3" />
      <line
        x1={g.policy[0].x + POLICY_W / 2}
        y1={g.policy[0].y + POLICY_H + 2}
        x2={g.policy[1].x + POLICY_W / 2}
        y2={g.policy[1].y - 2}
        stroke={step >= 5 ? EMPHASIS : LINE}
        strokeWidth={step >= 5 ? 2 : 1.2}
        strokeDasharray="5 4"
        style={{ transition: fade }}
      />
      <g style={shown(step >= 4)}>
        <g style={moved(pol)}>
          <path d={box(0, 0, POLICY_W, POLICY_H)} fill={GPU_FILL} stroke={GPU_INK} strokeWidth="1.8" />
          <T x={POLICY_W / 2} y={18} anchor="middle" bold num="toy">
            policy 1.5.0
          </T>
        </g>
      </g>

      {narrow ? (
        <g>
          <T x={20} y={24} bold>
            One published fleet loop, timed
          </T>
          <T x={20} y={42}>
            16 robots, 8 hours; medians, as its authors report
          </T>
          <T x={20} y={84} style={shown(step >= 3)}>
            41 s: episode produced to available to the learner
          </T>
          <T x={236} y={104} fill={MUTED} style={shown(step >= 3)}>
            ticks: every 10 s
          </T>
          <T x={20} y={126} style={shown(step >= 4)}>
            38 s: model published to on a robot
          </T>
          <T x={20} y={168} style={shown(step >= 2)}>
            episodes from every arm join here
          </T>
          <T x={20} y={188} bold>
            Amazon S3: one dataset
          </T>
          <T x={194} y={218} bold>
            Curation and training
          </T>
          <Arrow x1={266} y1={308} x2={266} y2={328} color={step === 4 ? EMPHASIS : MUTED} />
          <T x={208} y={348} anchor="end" style={shown(step >= 4)}>
            new version
          </T>
          <T x={17} y={564} num="toy">
            20 arms, each recording under policy 1.4.0
          </T>
          <T x={17} y={582}>
            Episode files go up in parts, at the episode
          </T>
          <T x={17} y={599}>
            boundary. Dashed outline: the canary group.
          </T>
          <T x={17} y={622} bold fill={EMPHASIS} style={shown(step >= 5)}>
            From here it is the staged rollout of the
          </T>
          <T x={17} y={639} bold fill={EMPHASIS} style={shown(step >= 5)}>
            figure above: canary group first.
          </T>
        </g>
      ) : (
        <g>
          <T x={20} y={36} bold size={14}>
            One published fleet loop, timed
          </T>
          <T x={20} y={56}>
            16 robots, 8 hours; medians, as its authors report
          </T>
          <T x={380} y={54} style={shown(step >= 3)}>
            41 s: episode produced to available to the learner
          </T>
          <T x={380} y={102} fill={MUTED} style={shown(step >= 3)}>
            ticks: every 10 s, both spans to one scale
          </T>
          <T x={890} y={54} style={shown(step >= 4)}>
            38 s: model published to on a robot
          </T>
          <T x={380} y={130} anchor="middle" style={shown(step >= 2)}>
            episodes from every arm join here
          </T>
          <T x={380} y={150} anchor="middle" bold size={14}>
            Amazon S3: one dataset
          </T>
          <T x={578} y={178} bold size={14}>
            Curation and training
          </T>
          <T x={578} y={304}>
            reads the dataset, trains the next policy
          </T>
          <Arrow x1={842} y1={235} x2={878} y2={235} color={step === 4 ? EMPHASIS : MUTED} />
          <T x={880} y={210} style={shown(step >= 4)}>
            new version published
          </T>
          <T x={20} y={340}>
            Episode files go up in parts,
          </T>
          <T x={20} y={358}>
            at the episode boundary.
          </T>
          <T x={40} y={508} num="toy">
            20 arms, each recording episodes under policy 1.4.0
          </T>
          <T x={1104} y={508} anchor="middle" fill={EMPHASIS}>
            canary group
          </T>
          <T x={1220} y={536} anchor="end" bold fill={EMPHASIS} style={shown(step >= 5)}>
            From here it is the staged rollout of the figure above: canary group first.
          </T>
        </g>
      )}
    </svg>
  );
}
