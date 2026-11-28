import { useEffect, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Section 29's placement map: the fifteen workloads of section 20 plotted on the six questions
 * that pick a machine family (panel A), an orchestrator (panel B) and a capacity market (panel C).
 *
 * Every placement restates a row of the closing table in Choosing.tsx (`ROWS`), which is the source
 * of truth. Panel A is a grid of categorical answers. Panels B and C are region maps: a dot's
 * region is its answer and its position inside the region carries no value, because the registers
 * hold a count or a duration for few of the fifteen. A dot is hollow in B or C when neither
 * section 20 nor the closing table prints a count or a duration that puts it in its region.
 *
 * The only numbers drawn are the 10,000-child array limit (F09-5), the 30-minute Spot unit (F09-11)
 * and the date the reservation lists were read. The section passes the entries in `cites`.
 *
 * The svg-a11y gate reads literal strings on the svg tag, so the title id is fixed: mount one
 * instance per section.
 */

const INK = '#16191f';
const MUTED = '#5f6b7a';
const LINE = '#8d99a8';
const EMPHASIS = '#0972d3';
const FONT = 'sans-serif';
const ZONE = '#f7f8fa';

type Tone = 'cpu' | 'rt' | 'tensor' | 'general';

/* The same colours section 20 gives the machine parts. */
const TONES: Record<Tone, { fill: string; ink: string; label: string }> = {
  cpu: { fill: '#e8f1fb', ink: '#1f5fa8', label: 'CPU cores' },
  rt: { fill: '#fdeedd', ink: '#a85a0a', label: 'Ray-tracing cores' },
  tensor: { fill: '#e6f6ea', ink: '#1e7b3a', label: 'Tensor cores' },
  general: { fill: '#f4f5f7', ink: '#5f6b7a', label: 'General GPU compute, or a mix' },
};
const ROBOT = { fill: '#fff6d6', ink: '#7a5c00' };

type Stage = 'collect' | 'curate' | 'simulate' | 'train' | 'evaluate' | 'deploy' | 'vendor';

const STAGES: { id: Stage; label: string; d: string }[] = [
  { id: 'collect', label: 'Collect', d: 'M-5.5,-3 h7 v6 h-7 z M1.5,0 l4,-3 v6 z' },
  { id: 'curate', label: 'Curate', d: 'M-5,0.5 l3.2,3.5 l6.5,-7.5' },
  { id: 'simulate', label: 'Simulate', d: 'M-5,-5 h4 v4 h-4 z M1,-5 h4 v4 h-4 z M-5,1 h4 v4 h-4 z M1,1 h4 v4 h-4 z' },
  { id: 'train', label: 'Train', d: 'M-5.5,-5 C-4,2 -1,4 5.5,4.5' },
  { id: 'evaluate', label: 'Evaluate', d: 'M-6,0 l1.8,2.2 l3,-4.6 M1.6,-2.4 l4,4.8 M5.6,-2.4 l-4,4.8' },
  { id: 'deploy', label: 'Deploy', d: 'M0,-5.5 v9 M-3.6,0.4 l3.6,4 l3.6,-4' },
  { id: 'vendor', label: 'Vendor scale', d: 'M0,-5.5 l5,5.5 l-5,5.5 l-5,-5.5 z' },
];

type ACell = 'robot' | 'cpu' | 'rt' | 'one' | 'many' | 'device';
type BRegion = 'one' | 'array' | 'together' | 'none';
type CRegion = 'spot' | 'hours' | 'gtype' | 'ptype' | 'none';
type Panel = 'a' | 'b' | 'c';

interface Placement {
  /** The row name in the closing table. */
  name: string;
  /** The label beside the dot on a wide screen. */
  short: string;
  stage: Stage;
  tone: Tone;
  a: ACell;
  /** Column of panel A (the part that fills first), for the cells that span every column. */
  col: 0 | 1 | 2 | 3;
  b: BRegion;
  c: CRegion;
  /** No count of units or nodes is printed for it: its region in panel B follows from its shape. */
  hollowB?: boolean;
  /** No duration is printed for it: its region in panel C follows from its shape. */
  hollowC?: boolean;
  /** The three answers, as the closing table gives them. */
  family: string;
  orchestrator: string;
  market: string;
}

const PLACEMENTS: Placement[] = [
  {
    name: 'Record and encode',
    short: 'Record',
    stage: 'collect',
    tone: 'cpu',
    a: 'robot',
    col: 0,
    b: 'none',
    c: 'none',
    family: "the robot's own computer",
    orchestrator: 'no job for recording, the uploads land in S3',
    market: 'none, it runs on the device',
  },
  {
    name: 'Decode and filter',
    short: 'Decode',
    stage: 'curate',
    tone: 'cpu',
    a: 'cpu',
    col: 0,
    b: 'array',
    c: 'spot',
    hollowB: true,
    hollowC: true,
    family: 'Graviton C8g or M8g',
    orchestrator: 'a Batch array job, one child per shard of episodes',
    market: 'Spot, in children of 30 minutes or less',
  },
  {
    name: 'Embed and deduplicate',
    short: 'Embed',
    stage: 'curate',
    tone: 'tensor',
    a: 'one',
    col: 2,
    b: 'array',
    c: 'spot',
    hollowB: true,
    hollowC: true,
    family: 'G6e, with a second G type listed',
    orchestrator: 'a Batch array job',
    market: 'Spot first',
  },
  {
    name: 'Dataloader decode and augment',
    short: 'Dataloader',
    stage: 'curate',
    tone: 'cpu',
    a: 'cpu',
    col: 0,
    b: 'none',
    c: 'none',
    family: "the training instance's own CPU cores",
    orchestrator: 'no job of its own, it runs inside the training job',
    market: 'the same purchase option as the training job',
  },
  {
    name: 'CPU physics step',
    short: 'CPU physics',
    stage: 'simulate',
    tone: 'cpu',
    a: 'cpu',
    col: 0,
    b: 'array',
    c: 'spot',
    hollowB: true,
    hollowC: true,
    family: 'Graviton C8g or M8g',
    orchestrator: 'a Batch array job, one child per seed, or a Slurm job array on PCS',
    market: 'Spot',
  },
  {
    name: 'GPU-parallel physics',
    short: 'GPU physics',
    stage: 'simulate',
    tone: 'general',
    a: 'one',
    col: 2,
    b: 'one',
    c: 'hours',
    hollowC: true,
    family: 'a one-GPU G size with enough memory',
    orchestrator: 'a SageMaker Training Job, or Batch when runs come back to back',
    market: 'On-Demand with a list of types, Spot when the run checkpoints',
  },
  {
    name: 'Simulated cameras',
    short: 'Cameras',
    stage: 'simulate',
    tone: 'rt',
    a: 'rt',
    col: 1,
    b: 'array',
    c: 'gtype',
    hollowB: true,
    hollowC: true,
    family: 'the G family only (G6e, G7e or G7)',
    orchestrator: 'a Batch array job, or Kubernetes jobs on EKS',
    market: 'several G types or a second Region, with no window to reserve',
  },
  {
    name: 'Policy fine-tune',
    short: 'Fine-tune',
    stage: 'train',
    tone: 'tensor',
    a: 'one',
    col: 2,
    b: 'one',
    c: 'hours',
    family: 'one G-family GPU (G6e or G7e)',
    orchestrator: 'a SageMaker Training Job or a Batch job',
    market: 'On-Demand with a priority list of types',
  },
  {
    name: 'World-model training',
    short: 'World model',
    stage: 'train',
    tone: 'tensor',
    a: 'one',
    col: 2,
    b: 'one',
    c: 'hours',
    hollowC: true,
    family: 'one G-family GPU',
    orchestrator: 'a SageMaker Training Job or a Batch job',
    market: 'On-Demand with a list of types',
  },
  {
    name: 'Closed-loop evaluation',
    short: 'Evaluation',
    stage: 'evaluate',
    tone: 'general',
    a: 'rt',
    col: 1,
    b: 'array',
    c: 'spot',
    hollowB: true,
    hollowC: true,
    family: 'G6e or G7e when cameras are rendered',
    orchestrator: 'a Batch array job, one child per checkpoint and seed',
    market: 'Spot with a retry, On-Demand G types behind it',
  },
  {
    name: 'Engine build',
    short: 'Engine build',
    stage: 'deploy',
    tone: 'general',
    a: 'device',
    col: 2,
    b: 'none',
    c: 'none',
    family: 'the target device itself',
    orchestrator: 'no cloud job, the cloud only delivers the build',
    market: 'none, it runs on the device',
  },
  {
    name: 'On-robot inference',
    short: 'Inference',
    stage: 'deploy',
    tone: 'tensor',
    a: 'robot',
    col: 2,
    b: 'none',
    c: 'none',
    family: "the robot's computer",
    orchestrator: 'no cloud job, the cloud only delivers the policy',
    market: 'none, it runs on the device',
  },
  {
    name: 'Generative augmentation',
    short: 'Augmentation',
    stage: 'vendor',
    tone: 'tensor',
    a: 'one',
    col: 2,
    b: 'array',
    c: 'spot',
    hollowB: true,
    family: 'g7e.2xlarge or p5.4xlarge, one GPU each',
    orchestrator: 'a Batch array job, one child per clip',
    market: 'Spot on the G size, a Capacity Block on the P size',
  },
  {
    name: 'Robot foundation-model pretraining',
    short: 'Robot-model pretraining',
    stage: 'vendor',
    tone: 'tensor',
    a: 'many',
    col: 3,
    b: 'together',
    c: 'ptype',
    family: 'P5en or P6-B200 nodes that train over EFA',
    orchestrator: 'HyperPod, or PCS for a team that runs Slurm',
    market: 'a Capacity Block or a SageMaker training plan, and no Spot',
  },
  {
    name: 'World-model pretraining',
    short: 'World-model pretraining',
    stage: 'vendor',
    tone: 'tensor',
    a: 'many',
    col: 3,
    b: 'together',
    c: 'ptype',
    family: 'the same P family at larger scale',
    orchestrator: 'HyperPod or PCS',
    market: 'a Capacity Block',
  },
];

const BY_NAME = new Map(PLACEMENTS.map((p) => [p.name, p]));

function useNarrow(): boolean {
  const query = '(max-width: 760px)';
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia(query);
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return narrow;
}

/* ------------------------------------------------------------------------ */
/* Drawing primitives                                                        */
/* ------------------------------------------------------------------------ */

interface TxtProps {
  x: number;
  y: number;
  bold?: boolean;
  fill?: string;
  size?: number;
  children: ReactNode;
}

function Txt({ x, y, bold, fill, size, children }: TxtProps) {
  return (
    <text x={x} y={y} fontFamily={FONT} fontSize={size ?? 13} fontWeight={bold ? 'bold' : 'normal'} fill={fill ?? INK}>
      {children}
    </text>
  );
}

function Lines({ x, y, lines, bold, fill, size }: { x: number; y: number; lines: string[]; bold?: boolean; fill?: string; size?: number }) {
  return (
    <>
      {lines.map((line, i) => (
        <Txt key={line} x={x} y={y + i * 16} bold={bold} fill={fill} size={size}>
          {line}
        </Txt>
      ))}
    </>
  );
}

function Zone({ x, y, w, h, fill, stroke }: { x: number; y: number; w: number; h: number; fill?: string; stroke?: string }) {
  return <rect x={x} y={y} width={w} height={h} rx="6" fill={fill ?? ZONE} stroke={stroke ?? LINE} strokeWidth="1" />;
}

function Glyph({ stage, x, y, stroke }: { stage: Stage; x: number; y: number; stroke: string }) {
  const d = STAGES.find((s) => s.id === stage)?.d ?? '';
  return <path d={d} transform={`translate(${x} ${y})`} fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />;
}

/** The marker alone: filled when a published figure places it, hollow and dashed when its shape does. */
function Marker({ stage, tone, x, y, r, hollow }: { stage: Stage; tone: Tone; x: number; y: number; r: number; hollow?: boolean }) {
  const ink = TONES[tone].ink;
  return (
    <>
      <circle cx={x} cy={y} r={r} fill={hollow ? '#ffffff' : ink} stroke={ink} strokeWidth={hollow ? 1.8 : 1} strokeDasharray={hollow ? '3 2.4' : undefined} />
      <Glyph stage={stage} x={x} y={y} stroke={hollow ? ink : '#ffffff'} />
    </>
  );
}

interface Ctx {
  selected: string;
  pick: (name: string) => void;
  r: number;
}

interface DotProps {
  ctx: Ctx;
  p: Placement;
  panel: Panel;
  x: number;
  y: number;
  /** Text printed to the right of the marker. */
  label?: string;
}

function Dot({ ctx, p, panel, x, y, label }: DotProps) {
  const on = ctx.selected === p.name;
  const hollow = panel === 'b' ? p.hollowB : panel === 'c' ? p.hollowC : false;
  const onKey = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    ctx.pick(p.name);
  };
  return (
    <g
      role="button"
      // Panel A carries the tab order: one stop per workload instead of three.
      tabIndex={panel === 'a' ? 0 : -1}
      aria-label={`${p.name}: show where it lands in the three panels`}
      aria-pressed={on}
      onClick={() => ctx.pick(p.name)}
      onMouseEnter={() => ctx.pick(p.name)}
      onFocus={() => ctx.pick(p.name)}
      onKeyDown={onKey}
      style={{ cursor: 'pointer' }}
    >
      <circle cx={x} cy={y} r={ctx.r + 6} fill="#ffffff" fillOpacity="0" />
      {on ? <circle cx={x} cy={y} r={ctx.r + 4.5} fill="none" stroke={EMPHASIS} strokeWidth="3" /> : null}
      <Marker stage={p.stage} tone={p.tone} x={x} y={y} r={ctx.r} hollow={hollow} />
      {label ? (
        <Txt x={x + ctx.r + 9} y={y + 4.5} fill={on ? EMPHASIS : INK} bold={on}>
          {label}
        </Txt>
      ) : null}
    </g>
  );
}

function inA(cell: ACell) {
  return PLACEMENTS.filter((p) => p.a === cell);
}
function inB(region: BRegion) {
  return PLACEMENTS.filter((p) => p.b === region);
}
function inC(region: CRegion) {
  return PLACEMENTS.filter((p) => p.c === region);
}

interface GridOpts {
  ctx: Ctx;
  panel: Panel;
  x: number;
  y: number;
  dx: number;
  dy: number;
  perRow: number;
  label?: (p: Placement) => string;
}

/** Lays markers out in reading order: `perRow` across, then down. */
function dots(list: Placement[], o: GridOpts) {
  return list.map((p, k) => (
    <Dot
      key={`${o.panel}-${p.name}`}
      ctx={o.ctx}
      p={p}
      panel={o.panel}
      x={o.x + (k % o.perRow) * o.dx}
      y={o.y + Math.floor(k / o.perRow) * o.dy}
      label={o.label?.(p)}
    />
  ));
}

const short = (p: Placement) => p.short;
const full = (p: Placement) => p.name;

/* The six questions arrive from the section, so the axis titles and its checklist cannot drift. */
type Questions = [string, string, string, string, string, string];

const A_CELLS: { cell: ACell; tone: Tone; head: string; sub?: string; title: string[] }[] = [
  { cell: 'cpu', tone: 'cpu', head: 'CPU cores', title: ['Graviton CPU instances, or the', "training instance's own cores"] },
  { cell: 'rt', tone: 'rt', head: 'Ray-tracing cores', title: ['G family only: P-family GPUs', 'have no RT cores'] },
  { cell: 'one', tone: 'tensor', head: 'One GPU', sub: 'tensor cores or general compute', title: ['A one-GPU size, picked by', 'its GPU memory'] },
  { cell: 'many', tone: 'tensor', head: 'Many GPUs', sub: 'tensor cores across nodes', title: ['P family: nodes that train', 'together over EFA'] },
];

/* ------------------------------------------------------------------------ */
/* Wide layout: panel A across the top, panels B and C side by side          */
/* ------------------------------------------------------------------------ */

const WIDE = { w: 1240, h: 996 };

function Wide({ ctx, q }: { ctx: Ctx; q: Questions }) {
  const ax = 230;
  const colW = 244;
  const colX = (i: number) => ax + i * 250;
  // Panel B
  const bx = 10;
  const bg = 112;
  const b2 = 308;
  // Panel C
  const cx = 592;
  const cg = 714;
  const cCol = [714, 880, 1030];
  const cColW = [160, 144, 200];
  return (
    <>
      {/* Legend */}
      <Marker stage="train" tone="tensor" x={22} y={20} r={10} />
      <Txt x={40} y={24.5}>Filled: a published count or duration puts it there</Txt>
      <Marker stage="curate" tone="cpu" x={442} y={20} r={10} hollow />
      <Txt x={460} y={24.5}>Hollow: placed by workload type, no published count</Txt>
      <circle cx={822} cy={20} r={14.5} fill="none" stroke={EMPHASIS} strokeWidth="3" />
      <Marker stage="train" tone="tensor" x={822} y={20} r={10} />
      <Txt x={846} y={24.5}>Ring: the selected workload, in all three panels</Txt>
      <Txt x={10} y={54.5} fill={MUTED}>Glyph, the stage of the loop:</Txt>
      {STAGES.map((s, i) => (
        <g key={s.id}>
          <Marker stage={s.id} tone="general" x={232 + i * 140} y={50} r={10} hollow />
          <Txt x={250 + i * 140} y={54.5}>{s.label}</Txt>
        </g>
      ))}
      <Txt x={10} y={84.5} fill={MUTED}>Colour, the bottleneck:</Txt>
      {(Object.keys(TONES) as Tone[]).map((t, i) => (
        <g key={t}>
          <circle cx={232 + i * 210} cy={80} r="10" fill={TONES[t].ink} />
          <Txt x={250 + i * 210} y={84.5}>{TONES[t].label}</Txt>
        </g>
      ))}

      {/* Panel A */}
      <Txt x={10} y={124} bold size={16}>A. Machine family</Txt>
      <Txt x={ax} y={124} bold fill={EMPHASIS}>{q[0]}</Txt>
      <Lines x={10} y={146} lines={['2. Does each unit of', 'work have a deadline?']} bold fill={EMPHASIS} />
      {A_CELLS.map((c, i) => (
        <g key={c.cell}>
          <Txt x={colX(i) + 10} y={146} bold fill={TONES[c.tone].ink}>{c.head}</Txt>
          {c.sub ? <Txt x={colX(i) + 10} y={162} fill={MUTED}>{c.sub}</Txt> : null}
        </g>
      ))}
      <Txt x={10} y={206}>Yes: real-time on the robot</Txt>
      <Zone x={ax} y={172} w={994} h={64} fill={ROBOT.fill} stroke={ROBOT.ink} />
      <Txt x={ax + 10} y={192} bold fill={ROBOT.ink}>Runs on the robot. The cloud delivers it and stops here.</Txt>
      {inA('robot').map((p) => (
        <Dot key={`a-${p.name}`} ctx={ctx} p={p} panel="a" x={colX(p.col) + 22} y={218} label={p.short} />
      ))}
      <Txt x={10} y={334}>No</Txt>
      {A_CELLS.map((c, i) => (
        <g key={c.cell}>
          <Zone x={colX(i)} y={242} w={colW} h={176} fill={TONES[c.tone].fill} stroke={TONES[c.tone].ink} />
          <Lines x={colX(i) + 10} y={262} lines={c.title} bold fill={TONES[c.tone].ink} />
          {dots(inA(c.cell), { ctx, panel: 'a', x: colX(i) + 22, y: 304, dx: 0, dy: 24, perRow: 1, label: short })}
        </g>
      ))}
      <Txt x={10} y={452}>No, but tied to one device</Txt>
      <Zone x={ax} y={424} w={994} h={48} fill={TONES.general.fill} stroke={TONES.general.ink} />
      <Txt x={ax + 10} y={452} bold fill={TONES.general.ink}>Built on the device it will run on.</Txt>
      {inA('device').map((p) => (
        <Dot key={`a-${p.name}`} ctx={ctx} p={p} panel="a" x={colX(p.col) + 22} y={448} label={p.short} />
      ))}

      {/* Panel B */}
      <Txt x={bx} y={516} bold size={16}>B. Orchestrator</Txt>
      <Txt x={bx} y={540} bold fill={EMPHASIS}>{q[2]}</Txt>
      <Txt x={bg + 10} y={562}>One unit per submission</Txt>
      <Txt x={b2 + 10} y={562}>Many units per submission</Txt>
      <Lines x={bx} y={614} lines={['Many nodes', 'start together']} />
      <Zone x={bg} y={570} w={190} h={100} />
      <Lines x={bg + 10} y={590} lines={['All nodes start together', 'on EFA: HyperPod or PCS']} bold />
      {dots(inB('together'), { ctx, panel: 'b', x: bg + 22, y: 628, dx: 0, dy: 24, perRow: 1, label: short })}
      <Zone x={b2} y={570} w={264} h={100} fill="#ffffff" />
      <Lines x={b2 + 10} y={590} lines={['No workload of the fifteen', 'lands here']} fill={MUTED} />
      <Lines x={bx} y={742} lines={['One node', 'per unit']} />
      <Zone x={bg} y={676} w={190} h={142} />
      <Lines x={bg + 10} y={696} lines={['One job on one node:', 'Training Jobs or Batch']} bold />
      {dots(inB('one'), { ctx, panel: 'b', x: bg + 22, y: 738, dx: 0, dy: 24, perRow: 1, label: short })}
      <Zone x={b2} y={676} w={264} h={142} />
      <Lines x={b2 + 10} y={696} lines={['Array job, up to 10,000', 'children: Batch, EKS jobs, or', 'a Slurm job array on PCS']} bold />
      {dots(inB('array'), { ctx, panel: 'b', x: b2 + 22, y: 752, dx: 128, dy: 24, perRow: 2, label: short })}
      <Zone x={bx} y={826} w={562} h={58} fill="#ffffff" />
      <Txt x={bx + 10} y={846} bold fill={MUTED}>No job of its own: it runs on the robot, or inside the training job</Txt>
      {dots(inB('none'), { ctx, panel: 'b', x: bx + 22, y: 866, dx: 136, dy: 0, perRow: 4, label: short })}
      <Txt x={bx} y={910} bold fill={EMPHASIS}>{q[3]}</Txt>
      <Lines
        x={bx}
        y={930}
        lines={[
          'This answer moves no dot. It picks a name inside a region.',
          'Now and then: Training Jobs or Batch. Now and then, in Slurm: PCS.',
          'All day, for several teams: a persistent cluster with quotas, HyperPod or EKS.',
        ]}
      />

      {/* Panel C */}
      <Txt x={cx} y={516} bold size={16}>C. Purchase option</Txt>
      <Txt x={cg} y={540} bold fill={EMPHASIS}>{q[4]}</Txt>
      <Lines x={cx} y={556} lines={['6. Must it run', 'on fixed dates?']} bold fill={EMPHASIS} />
      <Lines x={cCol[0] + 10} y={562} lines={['One unit, under', '30 minutes']} />
      <Lines x={cCol[1] + 10} y={562} lines={['Hours of', 'one run']} />
      <Lines x={cCol[2] + 10} y={562} lines={['A step on', 'every node']} />
      <Txt x={cx} y={634}>Yes, on a P type</Txt>
      <Zone x={cg} y={588} w={516} h={84} />
      <Txt x={cg + 10} y={608} bold>A Capacity Block or a SageMaker training plan</Txt>
      {dots(inC('ptype'), { ctx, panel: 'c', x: cCol[2] + 22, y: 630, dx: 0, dy: 24, perRow: 1, label: short })}
      <Txt x={cx} y={724}>Yes, on a G type</Txt>
      <Zone x={cg} y={678} w={516} h={84} />
      <Lines x={cg + 10} y={698} lines={['No G type is on the reservation lists read 2026-11-20:', 'On-Demand or Spot, on several G types']} bold />
      {dots(inC('gtype'), { ctx, panel: 'c', x: cCol[0] + 22, y: 742, dx: 0, dy: 24, perRow: 1, label: short })}
      <Txt x={cx} y={848}>No</Txt>
      <Zone x={cCol[0]} y={768} w={cColW[0]} h={150} />
      <Txt x={cCol[0] + 10} y={788} bold>Spot, with a retry</Txt>
      {dots(inC('spot'), { ctx, panel: 'c', x: cCol[0] + 22, y: 812, dx: 0, dy: 23, perRow: 1, label: short })}
      <Zone x={cCol[1]} y={768} w={cColW[1]} h={150} />
      <Lines x={cCol[1] + 10} y={788} lines={['On-Demand with a', 'list of types; Spot', 'with checkpoints']} bold />
      {dots(inC('hours'), { ctx, panel: 'c', x: cCol[1] + 22, y: 850, dx: 0, dy: 24, perRow: 1, label: short })}
      <Zone x={cCol[2]} y={768} w={cColW[2]} h={150} fill="#ffffff" />
      <Lines x={cCol[2] + 10} y={788} lines={['No Spot: reserve, or', 'On-Demand']} bold />
      <Lines x={cCol[2] + 10} y={836} lines={['No workload of the', 'fifteen lands here']} fill={MUTED} />
      <Zone x={cx} y={926} w={638} h={58} fill="#ffffff" />
      <Txt x={cx + 10} y={946} bold fill={MUTED}>No purchase option of its own: it runs on the device or in the training job</Txt>
      {dots(inC('none'), { ctx, panel: 'c', x: cx + 22, y: 966, dx: 150, dy: 0, perRow: 4, label: short })}
    </>
  );
}

/* ------------------------------------------------------------------------ */
/* Phone layout: one column, panel A as a list of cells with the names       */
/* ------------------------------------------------------------------------ */

const NARROW_W = 350;

function narrowLayout(ctx: Ctx, q: Questions): { nodes: ReactNode[]; h: number } {
  const nodes: ReactNode[] = [];
  let key = 0;
  const add = (n: ReactNode) => nodes.push(<g key={(key += 1)}>{n}</g>);
  const X = 10;
  const W = NARROW_W - 20;
  let y = 0;

  // Legend
  add(
    <>
      <Marker stage="train" tone="tensor" x={X + 12} y={22} r={11} />
      <Lines x={X + 32} y={20} lines={['Filled: a published count or duration', 'puts it there']} />
      <Marker stage="curate" tone="cpu" x={X + 12} y={66} r={11} hollow />
      <Lines x={X + 32} y={64} lines={['Hollow: placed by workload type, no', 'published count']} />
      <circle cx={X + 12} cy={112} r={15.5} fill="none" stroke={EMPHASIS} strokeWidth="3" />
      <Marker stage="train" tone="tensor" x={X + 12} y={112} r={11} />
      <Lines x={X + 36} y={110} lines={['Ring: the selected workload, in all', 'three panels']} />
      <Txt x={X} y={156} fill={MUTED}>Glyph, the stage of the loop:</Txt>
      {STAGES.map((s, i) => (
        <g key={s.id}>
          <Marker stage={s.id} tone="general" x={X + 12 + (i % 3) * 108} y={178 + Math.floor(i / 3) * 28} r={11} hollow />
          <Txt x={X + 30 + (i % 3) * 108} y={182.5 + Math.floor(i / 3) * 28}>{s.label}</Txt>
        </g>
      ))}
      <Txt x={X} y={272} fill={MUTED}>Colour, the bottleneck:</Txt>
      {(Object.keys(TONES) as Tone[]).map((t, i) => (
        <g key={t}>
          <circle cx={X + 12 + (i === 1 ? 130 : 0)} cy={294 + Math.max(0, i - 1) * 28} r="11" fill={TONES[t].ink} />
          <Txt x={X + 30 + (i === 1 ? 130 : 0)} y={298.5 + Math.max(0, i - 1) * 28}>{TONES[t].label}</Txt>
        </g>
      ))}
    </>,
  );
  y = 394;

  // Panel A: a list of cells, each with its workloads by name
  add(
    <>
      <Txt x={X} y={y} bold size={16}>A. Machine family</Txt>
      <Txt x={X} y={y + 22} bold fill={EMPHASIS}>{q[0]}</Txt>
      <Txt x={X} y={y + 40} bold fill={EMPHASIS}>{q[1]}</Txt>
    </>,
  );
  y += 56;
  const cell = (o: { group?: string; head?: string; sub?: string; title: string[]; list: Placement[]; fill: string; ink: string }) => {
    if (o.group) {
      add(<Txt x={X} y={y + 14}>{o.group}</Txt>);
      y += 22;
    }
    const headH = o.head ? 18 : 0;
    const h = 12 + headH + o.title.length * 16 + 10 + o.list.length * 27 + 4;
    add(
      <>
        <Zone x={X} y={y} w={W} h={h} fill={o.fill} stroke={o.ink} />
        {o.head ? (
          <Txt x={X + 10} y={y + 20} fill={INK}>
            {o.head}
            {o.sub ? `: ${o.sub}` : ''}
          </Txt>
        ) : null}
        <Lines x={X + 10} y={y + 20 + headH} lines={o.title} bold fill={o.ink} />
        {dots(o.list, { ctx, panel: 'a', x: X + 24, y: y + 12 + headH + o.title.length * 16 + 20, dx: 0, dy: 27, perRow: 1, label: full })}
      </>,
    );
    y += h + 8;
  };
  cell({
    group: 'Yes: real-time on the robot',
    title: ['Runs on the robot. The cloud delivers it', 'and stops here.'],
    list: inA('robot'),
    fill: ROBOT.fill,
    ink: ROBOT.ink,
  });
  A_CELLS.forEach((c, i) =>
    cell({
      group: i === 0 ? 'No real-time deadline' : undefined,
      head: c.head,
      sub: c.sub,
      title: c.title,
      list: inA(c.cell),
      fill: TONES[c.tone].fill,
      ink: TONES[c.tone].ink,
    }),
  );
  cell({
    group: 'No, but tied to one device',
    title: ['Built on the device it will run on.'],
    list: inA('device'),
    fill: TONES.general.fill,
    ink: TONES.general.ink,
  });
  y += 20;

  // Panel B: the same four regions, markers only
  const b1 = X;
  const b1w = 140;
  const b2 = X + 146;
  const b2w = W - 146;
  add(
    <>
      <Txt x={X} y={y} bold size={16}>B. Orchestrator</Txt>
      <Txt x={X} y={y + 22} bold fill={EMPHASIS}>{q[2]}</Txt>
      <Lines x={b1 + 10} y={y + 44} lines={['One unit per', 'submission']} />
      <Lines x={b2 + 10} y={y + 44} lines={['Many units per', 'submission']} />
      <Txt x={X} y={y + 86}>Many nodes that start together</Txt>
      <Zone x={b1} y={y + 94} w={b1w} h={104} />
      <Lines x={b1 + 10} y={y + 114} lines={['All nodes start', 'together on EFA:', 'HyperPod or PCS']} bold />
      {dots(inB('together'), { ctx, panel: 'b', x: b1 + 24, y: y + 176, dx: 32, dy: 0, perRow: 4 })}
      <Zone x={b2} y={y + 94} w={b2w} h={104} fill="#ffffff" />
      <Lines x={b2 + 10} y={y + 114} lines={['No workload of the', 'fifteen lands here']} fill={MUTED} />
      <Txt x={X} y={y + 220}>One node per unit</Txt>
      <Zone x={b1} y={y + 228} w={b1w} h={120} />
      <Lines x={b1 + 10} y={y + 248} lines={['One job on one', 'node: Training', 'Jobs or Batch']} bold />
      {dots(inB('one'), { ctx, panel: 'b', x: b1 + 24, y: y + 318, dx: 32, dy: 0, perRow: 4 })}
      <Zone x={b2} y={y + 228} w={b2w} h={120} />
      <Lines x={b2 + 10} y={y + 248} lines={['Array job, up to 10,000', 'children: Batch, EKS', 'jobs, or a Slurm job', 'array on PCS']} bold />
      {dots(inB('array'), { ctx, panel: 'b', x: b2 + 20, y: y + 326, dx: 29, dy: 0, perRow: 6 })}
      <Zone x={X} y={y + 356} w={W} h={86} fill="#ffffff" />
      <Lines x={X + 10} y={y + 376} lines={['No job of its own: it runs on the robot,', 'or inside the training job']} bold fill={MUTED} />
      {dots(inB('none'), { ctx, panel: 'b', x: X + 24, y: y + 420, dx: 32, dy: 0, perRow: 4 })}
      <Txt x={X} y={y + 466} bold fill={EMPHASIS}>{q[3]}</Txt>
      <Lines
        x={X}
        y={y + 486}
        lines={[
          'This answer moves no dot. It picks a name inside',
          'a region. Now and then: Training Jobs or Batch.',
          'Now and then, in Slurm: PCS. All day, for several',
          'teams: a persistent cluster with quotas, HyperPod',
          'or EKS.',
        ]}
      />
    </>,
  );
  y += 590;

  // Panel C
  const cw = 106;
  const c = [X, X + 112, X + 224];
  add(
    <>
      <Txt x={X} y={y} bold size={16}>C. Purchase option</Txt>
      <Txt x={X} y={y + 22} bold fill={EMPHASIS}>{q[4]}</Txt>
      <Lines x={c[0] + 8} y={y + 44} lines={['One unit,', 'under 30', 'minutes']} />
      <Lines x={c[1] + 8} y={y + 44} lines={['Hours of', 'one run']} />
      <Lines x={c[2] + 8} y={y + 44} lines={['A step on', 'every node']} />
      <Txt x={X} y={y + 104} bold fill={EMPHASIS}>{q[5]}</Txt>
      <Txt x={X} y={y + 126}>Yes, on a P type</Txt>
      <Zone x={X} y={y + 134} w={W} h={86} />
      <Lines x={X + 10} y={y + 154} lines={['A Capacity Block or a SageMaker', 'training plan']} bold />
      {dots(inC('ptype'), { ctx, panel: 'c', x: c[2] + 22, y: y + 198, dx: 32, dy: 0, perRow: 3 })}
      <Txt x={X} y={y + 242}>Yes, on a G type</Txt>
      <Zone x={X} y={y + 250} w={W} h={102} />
      <Lines x={X + 10} y={y + 270} lines={['No G type is on the reservation lists', 'read 2026-11-20: On-Demand or Spot,', 'on several G types']} bold />
      {dots(inC('gtype'), { ctx, panel: 'c', x: c[0] + 22, y: y + 330, dx: 32, dy: 0, perRow: 3 })}
      <Txt x={X} y={y + 374}>No</Txt>
      <Zone x={c[0]} y={y + 382} w={cw} h={154} />
      <Lines x={c[0] + 8} y={y + 402} lines={['Spot, with a', 'retry']} bold />
      {dots(inC('spot'), { ctx, panel: 'c', x: c[0] + 22, y: y + 482, dx: 32, dy: 32, perRow: 3 })}
      <Zone x={c[1]} y={y + 382} w={cw} h={154} />
      <Lines x={c[1] + 8} y={y + 402} lines={['On-Demand', 'with a list', 'of types;', 'Spot with', 'checkpoints']} bold />
      {dots(inC('hours'), { ctx, panel: 'c', x: c[1] + 22, y: y + 514, dx: 32, dy: 0, perRow: 3 })}
      <Zone x={c[2]} y={y + 382} w={cw} h={154} fill="#ffffff" />
      <Lines x={c[2] + 8} y={y + 402} lines={['No Spot:', 'reserve, or', 'On-Demand']} bold />
      <Lines x={c[2] + 8} y={y + 470} lines={['No workload', 'of the fifteen', 'lands here']} fill={MUTED} />
      <Zone x={X} y={y + 544} w={W} h={86} fill="#ffffff" />
      <Lines x={X + 10} y={y + 564} lines={['No purchase option of its own: it runs', 'on the device or in the training job']} bold fill={MUTED} />
      {dots(inC('none'), { ctx, panel: 'c', x: X + 24, y: y + 608, dx: 32, dy: 0, perRow: 4 })}
    </>,
  );
  y += 640;
  return { nodes, h: y };
}

/* ------------------------------------------------------------------------ */
/* The figure body                                                           */
/* ------------------------------------------------------------------------ */

interface PlacementMapProps {
  /** The workload names of the closing table, in its order. Each must have a placement. */
  workloads: string[];
  /** The six questions, in order. They are the axis titles. */
  questions: string[];
  /** The workload selected on load, so the figure is never empty. */
  initial: string;
}

export function PlacementMap({ workloads, questions, initial }: PlacementMapProps) {
  // Crash early: a row added to the closing table without a placement is a programming error.
  const missing = [...workloads, initial].filter((name) => !BY_NAME.has(name));
  if (missing.length || workloads.length !== PLACEMENTS.length) {
    throw new Error(`PlacementMap: the closing table and the placements disagree (${missing.join(', ') || 'row count'})`);
  }
  if (questions.length !== 6) throw new Error(`PlacementMap: expected six questions, got ${questions.length}`);
  const q = questions as Questions;

  const narrow = useNarrow();
  const [selected, setSelected] = useState(initial);
  const ctx: Ctx = { selected, pick: setSelected, r: narrow ? 11 : 10 };
  const phone = narrow ? narrowLayout(ctx, q) : null;
  const W = phone ? NARROW_W : WIDE.w;
  const H = phone ? phone.h : WIDE.h;
  const p = BY_NAME.get(selected) ?? PLACEMENTS[0];

  return (
    <div>
      <label style={{ display: 'block', marginBottom: 8 }}>
        <span style={{ marginRight: 8, fontWeight: 700 }}>Workload</span>
        <select value={selected} onChange={(e) => setSelected(e.target.value)} style={{ font: 'inherit', padding: '4px 6px', maxWidth: '100%' }}>
          {workloads.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="choosing-map-title" style={{ width: '100%', height: 'auto' }}>
        <title id="choosing-map-title">Where the fifteen workloads land: machine family, orchestrator and purchase option</title>
        <desc>
          Three linked panels with the same fifteen workloads in each. Panel A places each workload by its bottleneck
          and by whether each unit of work has a deadline, which gives its machine family. Panel B places it by
          units per submission and by nodes that must start together, which gives its orchestrator. Panel C places it
          by what is lost if the machine goes and by fixed dates, which gives its purchase option. The workload list
          above the drawing selects a workload, and the sentence under the drawing gives its three answers.
        </desc>
        <rect x="0" y="0" width={W} height={H} fill="#fbfbfd" />
        {phone ? phone.nodes : <Wide ctx={ctx} q={q} />}
      </svg>
      <p aria-live="polite" style={{ margin: '8px 0 4px', minHeight: '3em' }}>
        <strong>{p.name}:</strong> {p.family}; {p.orchestrator}; {p.market}.
      </p>
    </div>
  );
}
