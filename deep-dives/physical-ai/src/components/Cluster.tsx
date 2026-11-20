import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatedFigure } from './Figure';

/**
 * One drawing language for the four AWS orchestrators (sections 25 to 28).
 *
 * A cluster is drawn as the objects a user creates and sees: the place work is submitted, the
 * queues with jobs waiting in them, the scheduler, the groups of capacity with their instances,
 * the GPUs inside each instance, the jobs sitting on GPUs, and the storage and network every
 * instance shares. A section describes its cluster as data (ClusterSpec) and a list of steps; the
 * same component draws all four, so the reader can compare them object for object.
 *
 * Jobs and checkpoints are tokens that keep their identity across steps and glide between places.
 * Instances appear, change state and disappear. The figure has two layouts from the same data:
 * left to right on a wide screen, top to bottom on a phone.
 *
 * The svg-a11y gate reads literal strings on the svg tag, so the title id is fixed: mount one
 * cluster figure per section.
 */

const INK = '#16191f';
const MUTED = '#5f6b7a';
const LINE = '#8d99a8';
const PANEL = '#ffffff';
const ZONE = '#f2f5f9';
const FONT = 'sans-serif';

export type Market = 'spot' | 'on-demand' | 'reserved' | 'static';

const MARKET: Record<Market, { label: string; fill: string; ink: string }> = {
  spot: { label: 'Spot', fill: '#fdeedd', ink: '#a85a0a' },
  'on-demand': { label: 'On-Demand', fill: '#e8f1fb', ink: '#1f5fa8' },
  reserved: { label: 'Reserved', fill: '#efe9fb', ink: '#5b3fa8' },
  static: { label: 'Always on', fill: '#eef0f2', ink: '#44505c' },
};

export type InstanceState = 'launching' | 'running' | 'notice' | 'faulty';

const INSTANCE: Record<InstanceState, { text: string; stroke: string; fill: string; dash?: string }> = {
  launching: { text: 'launching', stroke: MUTED, fill: '#ffffff', dash: '5 4' },
  running: { text: 'running', stroke: '#1e7b3a', fill: '#f3faf5' },
  notice: { text: '2-min notice', stroke: '#c2410c', fill: '#fff1e6' },
  faulty: { text: 'failed check', stroke: '#b42318', fill: '#fdecea' },
};

export type JobTone = 'waiting' | 'running' | 'requeued' | 'done';

const JOB: Record<JobTone, { fill: string; stroke: string; ink: string }> = {
  waiting: { fill: '#ffffff', stroke: INK, ink: INK },
  running: { fill: '#0972d3', stroke: '#075aa8', ink: '#ffffff' },
  requeued: { fill: '#fff1e6', stroke: '#c2410c', ink: '#8a2c05' },
  done: { fill: '#e6f6ea', stroke: '#1e7b3a', ink: '#17612d' },
};

/** Where a job token sits in a step. */
export type JobAt =
  | { submit: number }
  | { q: number; pos: number }
  | { g: number; i: number; gpu?: number }
  | { done: number }
  | { hidden: true };

export interface JobToken {
  id: string;
  /** One to three characters painted on the token. */
  label: string;
  at: JobAt;
  tone?: JobTone;
}

/** A checkpoint: on the GPU that wrote it, or in a storage box. */
export type CheckpointAt = { g: number; i: number; gpu?: number } | { store: number; pos: number } | { hidden: true };

export interface CheckpointToken {
  id: string;
  at: CheckpointAt;
}

export interface ClusterGroup {
  /** Bold first line, at most 44 characters. */
  label: string;
  /** Plain lines under it, at most 48 characters each. */
  sub: string[];
  market: Market;
  /** GPUs drawn inside each instance; 0 draws a CPU-only instance. */
  gpus: number;
  /** How many instance places the group shows (its maximum in the picture). */
  places: number;
  /** Instance type painted on an instance unless a step overrides it. */
  type: string;
}

export interface ClusterStep {
  caption: ReactNode;
  /** One or two status lines painted in the scheduler box, at most 36 characters each. */
  scheduler: string[];
  /** Instance states by "group.place", for example { '0.1': 'running' }. Absent means no instance. */
  instances: Record<string, InstanceState | { state: InstanceState; type: string }>;
  jobs: JobToken[];
  checkpoints?: CheckpointToken[];
}

export interface ClusterSpec {
  /** The svg title: what the figure is, in one sentence. */
  title: string;
  /** The svg desc: how the picture is laid out. */
  desc: string;
  submit: { label: string; sub: string };
  queues: { label: string; sub: string }[];
  scheduler: { label: string; sub: string };
  done: { label: string };
  groups: ClusterGroup[];
  stores: { label: string; sub: string }[];
  network: string;
  /** What one job token stands for, for the legend ("one child job", "one pod"). */
  jobNoun: string;
  steps: ClusterStep[];
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const CHIP_W = 30;
const CHIP_H = 24;
const CHIP_GAP = 4;
const TOKEN_W = 24;
const TOKEN_H = 18;
const SLOT = 28;

function instanceSize(gpus: number): { w: number; h: number; cols: number } {
  const cols = Math.max(1, Math.min(gpus, 4));
  const rows = Math.max(1, Math.ceil(gpus / 4));
  const w = Math.max(84, 14 + cols * (CHIP_W + CHIP_GAP) - CHIP_GAP);
  const h = 38 + rows * (CHIP_H + CHIP_GAP) + 4;
  return { w, h, cols };
}

interface Layout {
  W: number;
  H: number;
  submit: Rect;
  queues: Rect[];
  scheduler: Rect;
  done: Rect;
  groups: { rect: Rect; places: Rect[] }[];
  stores: Rect[];
  network: Rect;
  legendY: number;
}

function placeGroups(spec: ClusterSpec, x: number, y0: number, w: number): { groups: Layout['groups']; bottom: number } {
  const groups: Layout['groups'] = [];
  let y = y0;
  for (const g of spec.groups) {
    const size = instanceSize(g.gpus);
    const inner = w - 16;
    const perRow = Math.max(1, Math.floor((inner + 8) / (size.w + 8)));
    const rows = Math.ceil(g.places / perRow);
    const head = 22 + g.sub.length * 15 + 6;
    const h = head + rows * (size.h + 8) + 4;
    const places: Rect[] = [];
    for (let i = 0; i < g.places; i += 1) {
      places.push({ x: x + 8 + (i % perRow) * (size.w + 8), y: y + head + Math.floor(i / perRow) * (size.h + 8), w: size.w, h: size.h });
    }
    groups.push({ rect: { x, y, w, h }, places });
    y += h + 10;
  }
  return { groups, bottom: y - 10 };
}

function layout(spec: ClusterSpec, narrow: boolean): Layout {
  if (narrow) {
    const W = 400;
    const x = 12;
    const w = W - 24;
    let y = 10;
    const submit = { x, y, w, h: 66 };
    y += 76;
    const queues = spec.queues.map(() => {
      const r = { x, y, w, h: 66 };
      y += 74;
      return r;
    });
    const scheduler = { x, y, w, h: 40 + 15 * 2 };
    y += scheduler.h + 12;
    const placed = placeGroups(spec, x, y, w);
    y = placed.bottom + 12;
    const sw = (w - 8) / Math.max(1, spec.stores.length);
    const stores = spec.stores.map((_, i) => ({ x: x + i * (sw + 8), y, w: sw, h: 62 }));
    y += 70;
    const network = { x, y, w, h: 24 };
    y += 34;
    const done = { x, y, w, h: 50 };
    y += 60;
    return { W, H: y + 44, submit, queues, scheduler, done, groups: placed.groups, stores, network, legendY: y };
  }
  const W = 840;
  const lx = 12;
  const lw = 280;
  let y = 10;
  const submit = { x: lx, y, w: lw, h: 66 };
  y += 80;
  const queues = spec.queues.map(() => {
    const r = { x: lx, y, w: lw, h: 66 };
    y += 76;
    return r;
  });
  y += 4;
  const scheduler = { x: lx, y, w: lw, h: 40 + 15 * 2 };
  y += scheduler.h + 14;
  const done = { x: lx, y, w: lw, h: 50 };
  const leftBottom = y + 50;
  const rx = lx + lw + 30;
  const rw = W - rx - 12;
  const placed = placeGroups(spec, rx, 10, rw);
  let ry = placed.bottom + 12;
  const sw = (rw - 8 * (spec.stores.length - 1)) / Math.max(1, spec.stores.length);
  const stores = spec.stores.map((_, i) => ({ x: rx + i * (sw + 8), y: ry, w: sw, h: 62 }));
  ry += 70;
  const network = { x: rx, y: ry, w: rw, h: 24 };
  ry += 24;
  const bottom = Math.max(leftBottom, ry) + 12;
  return { W, H: bottom + 26, submit, queues, scheduler, done, groups: placed.groups, stores, network, legendY: bottom };
}

function chipRect(place: Rect, gpus: number, gpu: number): Rect {
  const { cols } = instanceSize(gpus);
  if (gpus === 0) return { x: place.x + place.w / 2 - CHIP_W / 2, y: place.y + 36, w: CHIP_W, h: CHIP_H };
  const rowW = cols * (CHIP_W + CHIP_GAP) - CHIP_GAP;
  const x0 = place.x + (place.w - rowW) / 2;
  return { x: x0 + (gpu % cols) * (CHIP_W + CHIP_GAP), y: place.y + 36 + Math.floor(gpu / cols) * (CHIP_H + CHIP_GAP), w: CHIP_W, h: CHIP_H };
}

function centre(r: Rect): { x: number; y: number } {
  return { x: r.x + r.w / 2, y: r.y + r.h / 2 };
}

/** True on a phone-width screen; the figure then stacks top to bottom. */
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

function Label({ x, y, bold, fill, anchor, children }: { x: number; y: number; bold?: boolean; fill?: string; anchor?: 'start' | 'middle' | 'end'; children: ReactNode }) {
  return (
    <text x={x} y={y} fontFamily={FONT} fontSize="12" fontWeight={bold ? 'bold' : 'normal'} fill={fill ?? INK} textAnchor={anchor ?? 'start'}>
      {children}
    </text>
  );
}

function Chip({ r, cpu }: { r: Rect; cpu?: boolean }) {
  const pins = [0.25, 0.5, 0.75];
  return (
    <g>
      {!cpu &&
        pins.map((p) => (
          <g key={p}>
            <line x1={r.x + r.w * p} y1={r.y - 2} x2={r.x + r.w * p} y2={r.y} stroke={MUTED} strokeWidth="1.5" />
            <line x1={r.x + r.w * p} y1={r.y + r.h} x2={r.x + r.w * p} y2={r.y + r.h + 2} stroke={MUTED} strokeWidth="1.5" />
          </g>
        ))}
      <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="3" fill={cpu ? '#f4f5f7' : '#dfe7f1'} stroke={MUTED} strokeWidth="1.2" />
      {!cpu && <rect x={r.x + 4} y={r.y + 4} width={r.w - 8} height={r.h - 8} rx="2" fill="#c7d3e3" />}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 7;
  const p = (da: number) => `${x2 - h * Math.cos(a + da)},${y2 - h * Math.sin(a + da)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={LINE} strokeWidth="1.6" />
      <polygon points={`${x2},${y2} ${p(0.45)} ${p(-0.45)}`} fill={LINE} />
    </g>
  );
}

function ClusterSvg({ spec, step, reduced, narrow }: { spec: ClusterSpec; step: number; reduced: boolean; narrow: boolean }) {
  const L = layout(spec, narrow);
  const s = spec.steps[Math.min(step, spec.steps.length - 1)];
  const move = reduced ? 'none' : 'transform 340ms ease, opacity 240ms ease';
  const fade = reduced ? 'none' : 'opacity 240ms ease';

  const jobPoint = (at: JobAt): { x: number; y: number } | null => {
    if ('hidden' in at) return null;
    if ('submit' in at) return { x: L.submit.x + 22 + at.submit * SLOT, y: L.submit.y + 51 };
    if ('q' in at) return { x: L.queues[at.q].x + 22 + at.pos * SLOT, y: L.queues[at.q].y + 51 };
    if ('done' in at) return { x: L.done.x + 22 + at.done * SLOT, y: L.done.y + 35 };
    return centre(chipRect(L.groups[at.g].places[at.i], spec.groups[at.g].gpus, at.gpu ?? 0));
  };
  const ckptPoint = (at: CheckpointAt): { x: number; y: number } | null => {
    if ('hidden' in at) return null;
    if ('store' in at) return { x: L.stores[at.store].x + 18 + at.pos * 22, y: L.stores[at.store].y + 48 };
    const c = centre(chipRect(L.groups[at.g].places[at.i], spec.groups[at.g].gpus, at.gpu ?? 0));
    return { x: c.x + 17, y: c.y + 9 };
  };

  // Tokens keep their identity across steps: the union of ids over all steps, in a stable order.
  const jobIds: string[] = [];
  const ckptIds: string[] = [];
  for (const st of spec.steps) {
    for (const j of st.jobs) if (!jobIds.includes(j.id)) jobIds.push(j.id);
    for (const c of st.checkpoints ?? []) if (!ckptIds.includes(c.id)) ckptIds.push(c.id);
  }
  const last = (id: string): JobToken | undefined => {
    for (let k = Math.min(step, spec.steps.length - 1); k >= 0; k -= 1) {
      const f = spec.steps[k].jobs.find((j) => j.id === id);
      if (f) return f;
    }
    return spec.steps.flatMap((st) => st.jobs).find((j) => j.id === id);
  };

  const firstGroup = L.groups[0].rect;
  return (
    <svg viewBox={`0 0 ${L.W} ${L.H}`} role="img" aria-labelledby="cluster-figure-title" style={{ width: '100%', height: 'auto' }}>
      <title id="cluster-figure-title">{spec.title}</title>
      <desc>{spec.desc}</desc>
      <rect x="0" y="0" width={L.W} height={L.H} fill="#fbfbfd" />

      {/* flow arrows */}
      <Arrow x1={L.submit.x + 40} y1={L.submit.y + L.submit.h} x2={L.submit.x + 40} y2={L.queues[0].y - 1} />
      <Arrow
        x1={L.scheduler.x + 40}
        y1={L.queues[L.queues.length - 1].y + L.queues[L.queues.length - 1].h}
        x2={L.scheduler.x + 40}
        y2={L.scheduler.y - 1}
      />
      {narrow ? (
        <Arrow x1={L.scheduler.x + 40} y1={L.scheduler.y + L.scheduler.h} x2={L.scheduler.x + 40} y2={firstGroup.y - 1} />
      ) : (
        <Arrow x1={L.scheduler.x + L.scheduler.w} y1={L.scheduler.y + 20} x2={firstGroup.x - 1} y2={L.scheduler.y + 20} />
      )}

      {/* submit */}
      <rect x={L.submit.x} y={L.submit.y} width={L.submit.w} height={L.submit.h} rx="6" fill={PANEL} stroke={LINE} strokeWidth="1.2" />
      <Label x={L.submit.x + 10} y={L.submit.y + 17} bold>
        {spec.submit.label}
      </Label>
      <Label x={L.submit.x + 10} y={L.submit.y + 33} fill={MUTED}>
        {spec.submit.sub}
      </Label>
      <rect x={L.submit.x + 8} y={L.submit.y + 39} width={L.submit.w - 16} height="24" rx="4" fill={ZONE} />

      {/* queues */}
      {spec.queues.map((q, i) => {
        const r = L.queues[i];
        return (
          <g key={q.label}>
            <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="6" fill={PANEL} stroke={INK} strokeWidth="1.4" />
            <Label x={r.x + 10} y={r.y + 17} bold>
              {q.label}
            </Label>
            <Label x={r.x + 10} y={r.y + 32} fill={MUTED}>
              {q.sub}
            </Label>
            <rect x={r.x + 8} y={r.y + 39} width={r.w - 16} height="24" rx="4" fill={ZONE} />
          </g>
        );
      })}

      {/* scheduler */}
      <rect x={L.scheduler.x} y={L.scheduler.y} width={L.scheduler.w} height={L.scheduler.h} rx="6" fill="#eaf2fc" stroke="#1f5fa8" strokeWidth="1.4" />
      <Label x={L.scheduler.x + 10} y={L.scheduler.y + 17} bold>
        {spec.scheduler.label}
      </Label>
      <Label x={L.scheduler.x + 10} y={L.scheduler.y + 32} fill={MUTED}>
        {spec.scheduler.sub}
      </Label>
      {s.scheduler.map((line, i) => (
        <Label key={line} x={L.scheduler.x + 10} y={L.scheduler.y + 49 + i * 15} fill="#1f5fa8" bold>
          {line}
        </Label>
      ))}

      {/* done tray */}
      <rect x={L.done.x} y={L.done.y} width={L.done.w} height={L.done.h} rx="6" fill={PANEL} stroke={LINE} strokeWidth="1.2" />
      <Label x={L.done.x + 10} y={L.done.y + 16} bold>
        {spec.done.label}
      </Label>
      <rect x={L.done.x + 8} y={L.done.y + 23} width={L.done.w - 16} height="24" rx="4" fill={ZONE} />

      {/* capacity groups */}
      {spec.groups.map((g, gi) => {
        const r = L.groups[gi].rect;
        const m = MARKET[g.market];
        const tagW = m.label.length * 7 + 14;
        return (
          <g key={g.label}>
            <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="8" fill={ZONE} stroke={LINE} strokeWidth="1.2" />
            <Label x={r.x + 10} y={r.y + 17} bold>
              {g.label}
            </Label>
            <rect x={r.x + r.w - tagW - 8} y={r.y + 5} width={tagW} height="17" rx="8.5" fill={m.fill} stroke={m.ink} strokeWidth="1" />
            <Label x={r.x + r.w - 8 - tagW / 2} y={r.y + 17.5} fill={m.ink} anchor="middle" bold>
              {m.label}
            </Label>
            {g.sub.map((line, k) => (
              <Label key={line} x={r.x + 10} y={r.y + 32 + k * 15} fill={MUTED}>
                {line}
              </Label>
            ))}
            {L.groups[gi].places.map((p, pi) => {
              const raw = s.instances[`${gi}.${pi}`];
              const state = typeof raw === 'string' ? raw : raw?.state;
              // The type stays painted while the instance fades out, so a place never flashes empty text.
              let type = g.type;
              for (let k = Math.min(step, spec.steps.length - 1); k >= 0; k -= 1) {
                const v = spec.steps[k].instances[`${gi}.${pi}`];
                if (v) {
                  if (typeof v !== 'string') type = v.type;
                  break;
                }
              }
              const look = state ? INSTANCE[state] : INSTANCE.launching;
              return (
                <g key={`${g.label}-${pi}`}>
                  <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="5" fill="none" stroke="#c3ccd8" strokeWidth="1" strokeDasharray="2 4" />
                  <g style={{ opacity: state ? 1 : 0, transition: fade }}>
                    <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="5" fill={look.fill} stroke={look.stroke} strokeWidth={state === 'notice' || state === 'faulty' ? 2.4 : 1.6} strokeDasharray={look.dash} />
                    <Label x={p.x + p.w / 2} y={p.y + 15} anchor="middle" bold>
                      {type}
                    </Label>
                    <Label x={p.x + p.w / 2} y={p.y + 29} anchor="middle" fill={look.stroke}>
                      {look.text}
                    </Label>
                    {g.gpus === 0 ? (
                      <Chip r={chipRect(p, 0, 0)} cpu />
                    ) : (
                      Array.from({ length: g.gpus }, (_, k) => <Chip key={k} r={chipRect(p, g.gpus, k)} />)
                    )}
                  </g>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* shared storage and network */}
      {spec.stores.map((st, i) => {
        const r = L.stores[i];
        return (
          <g key={st.label}>
            <path
              d={`M ${r.x} ${r.y + 8} a ${r.w / 2} 8 0 0 1 ${r.w} 0 v ${r.h - 16} a ${r.w / 2} 8 0 0 1 ${-r.w} 0 z`}
              fill={PANEL}
              stroke={MUTED}
              strokeWidth="1.2"
            />
            <path d={`M ${r.x} ${r.y + 8} a ${r.w / 2} 8 0 0 0 ${r.w} 0`} fill="none" stroke={MUTED} strokeWidth="1.2" />
            <Label x={r.x + 10} y={r.y + 30} bold>
              {st.label}
            </Label>
            <Label x={r.x + 62} y={r.y + 52} fill={MUTED}>
              {st.sub}
            </Label>
          </g>
        );
      })}
      <rect x={L.network.x} y={L.network.y} width={L.network.w} height={L.network.h} rx="12" fill="#eef0f2" stroke={LINE} strokeWidth="1" />
      <Label x={L.network.x + L.network.w / 2} y={L.network.y + 16} anchor="middle" fill="#44505c">
        {spec.network}
      </Label>

      {/* legend */}
      <g>
        <rect x={12} y={L.legendY + 2} width={TOKEN_W} height={TOKEN_H} rx="4" fill={JOB.waiting.fill} stroke={JOB.waiting.stroke} strokeWidth="1.4" />
        <Label x={42} y={L.legendY + 15}>
          {spec.jobNoun}
        </Label>
        <polygon points={`${narrow ? 22 : 222},${L.legendY + (narrow ? 24 : 3)} ${narrow ? 30 : 230},${L.legendY + (narrow ? 32 : 11)} ${narrow ? 22 : 222},${L.legendY + (narrow ? 40 : 19)} ${narrow ? 14 : 214},${L.legendY + (narrow ? 32 : 11)}`} fill="#f5c518" stroke="#8a6d00" strokeWidth="1.2" />
        <Label x={narrow ? 42 : 240} y={L.legendY + (narrow ? 36 : 15)}>
          checkpoint
        </Label>
        <Chip r={{ x: narrow ? 150 : 340, y: L.legendY + (narrow ? 22 : 0), w: CHIP_W, h: CHIP_H - 3 }} />
        <Label x={narrow ? 188 : 378} y={L.legendY + (narrow ? 36 : 15)}>
          one GPU
        </Label>
      </g>

      {/* checkpoints */}
      {ckptIds.map((id) => {
        const cur = (s.checkpoints ?? []).find((c) => c.id === id);
        const pt = cur ? ckptPoint(cur.at) : null;
        let rest = pt;
        if (!rest) {
          for (const st of spec.steps) {
            const f = (st.checkpoints ?? []).find((c) => c.id === id);
            const p2 = f ? ckptPoint(f.at) : null;
            if (p2) {
              rest = p2;
              break;
            }
          }
        }
        const at = rest ?? { x: 0, y: 0 };
        return (
          <g key={id} style={{ transform: `translate(${at.x}px, ${at.y}px)`, opacity: pt ? 1 : 0, transition: move }}>
            <polygon points="0,-8 8,0 0,8 -8,0" fill="#f5c518" stroke="#8a6d00" strokeWidth="1.2" />
          </g>
        );
      })}

      {/* jobs */}
      {jobIds.map((id) => {
        const cur = s.jobs.find((j) => j.id === id);
        const ref = cur ?? last(id);
        if (!ref) return null;
        const pt = cur ? jobPoint(cur.at) : null;
        const fallback = jobPoint(ref.at) ?? centre(L.submit);
        const at = pt ?? fallback;
        const tone = JOB[cur?.tone ?? ref.tone ?? 'waiting'];
        return (
          <g key={id} style={{ transform: `translate(${at.x}px, ${at.y}px)`, opacity: pt ? 1 : 0, transition: move }}>
            <rect x={-TOKEN_W / 2} y={-TOKEN_H / 2} width={TOKEN_W} height={TOKEN_H} rx="4" fill={tone.fill} stroke={tone.stroke} strokeWidth="1.4" />
            <text x="0" y="4.5" textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="bold" fill={tone.ink}>
              {ref.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/**
 * The animated cluster figure. `name` is used in the control labels, `cites` lists the register
 * entries behind every number in the captions, `caption` says how to read the picture.
 */
export function ClusterFigure({ spec, name, cites, caption }: { spec: ClusterSpec; name: string; cites: string; caption: ReactNode }) {
  const narrow = useNarrow();
  return (
    <AnimatedFigure name={name} steps={spec.steps.map((st) => st.caption)} intervalMs={2600} cites={cites} caption={caption}>
      {(step, reduced) => <ClusterSvg spec={spec} step={step} reduced={reduced} narrow={narrow} />}
    </AnimatedFigure>
  );
}
