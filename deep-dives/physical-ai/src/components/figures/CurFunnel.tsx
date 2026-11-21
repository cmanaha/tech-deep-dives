import { Arrow, Crop, EMPHASIS, LINE, Latent, MUTED, ORANGE, PANEL, PAPER, T, VIEW_43, box, rnd, useNarrow } from './WmJepaKit';

/**
 * Section 10: the curation pipeline as a funnel of clips.
 *
 * Eight panels, one per stage of Cosmos Curator's reference pipeline plus deduplication. The same
 * clips are drawn in every panel and change as the stage changes them: cut, re-encoded, dropped,
 * given an embedding and a caption, stored, merged. Each clip is its first and last frame, taken
 * from the six stills of the scripted MuJoCo episode. The clip counts are an illustration; the
 * per-worker CPU and GPU shares are the pipeline's documented defaults.
 */

const CPU_FILL = '#e8f1fb';
const CPU_INK = '#1f5fa8';
const GPU_FILL = '#e6f6ea';
const GPU_INK = '#1e7b3a';
const VIDEO_FILL = '#fde8ef';
const VIDEO_INK = '#a8274f';
const STORE_FILL = '#eef0f2';
const STORE_INK = '#44505c';
const DROP_INK = '#a8274f';

interface Clip {
  /** First and last frame, as indexes into the six stills. */
  a: number;
  b: number;
  still?: boolean;
  dark?: boolean;
  /** Index of the clip this one nearly copies. */
  copyOf?: number;
}

/** Twelve clips, three per recording. Two show no motion, one is too dark, one nearly copies another. */
const CLIPS: Clip[] = [
  { a: 0, b: 1 },
  { a: 1, b: 2 },
  { a: 0, b: 0, still: true },
  { a: 2, b: 3 },
  { a: 3, b: 4 },
  { a: 4, b: 5 },
  { a: 0, b: 2 },
  { a: 2, b: 4, dark: true },
  { a: 5, b: 5, still: true },
  { a: 1, b: 3 },
  { a: 3, b: 4, copyOf: 4 },
  { a: 3, b: 5 },
];

const latentOf = (i: number): number[] => {
  const src = CLIPS[i].copyOf ?? i;
  return Array.from({ length: 8 }, (_, k) => rnd(k, src + 1));
};

type Res = { kind: 'cpu'; n: number; label: string } | { kind: 'gpu'; share: number | null; label: string } | { kind: 'video' | 'store' | 'none'; label: string };

interface StageSpec {
  title: string;
  sub: string;
  count: string;
  res: Res[];
}

const STAGES: StageSpec[] = [
  { title: '1. Download', sub: 'recordings arrive as MP4 files', count: '4 recordings', res: [{ kind: 'store', label: 'storage and network' }] },
  {
    title: '2. Decode and split',
    sub: 'each is cut at its shot changes',
    count: '12 clips',
    res: [
      { kind: 'cpu', n: 3, label: 'decode frames: 3 CPUs' },
      { kind: 'gpu', share: 0.25, label: 'find shot changes: 0.25 GPU' },
    ],
  },
  {
    title: '3. Transcode',
    sub: 'every clip re-encoded to H.264',
    count: '12 clips',
    res: [
      { kind: 'cpu', n: 5, label: 'transcode: 5 CPUs' },
      { kind: 'video', label: "or the GPU's video engines" },
    ],
  },
  {
    title: '4. Filter',
    sub: 'still clips and dark clips drop out',
    count: '9 clips kept',
    res: [
      { kind: 'gpu', share: 0.5, label: 'motion filter: 0.5 GPU' },
      { kind: 'gpu', share: 0.25, label: 'aesthetic filter: 0.25 GPU' },
    ],
  },
  { title: '5. Embed', sub: 'each clip gets an embedding', count: '9 clips', res: [{ kind: 'gpu', share: 0.25, label: 'embedding model: 0.25 GPU' }] },
  {
    title: '6. Caption',
    sub: 'a model writes a caption for each',
    count: '9 clips',
    res: [
      { kind: 'cpu', n: 3, label: 'prepare inputs: 3 CPUs' },
      { kind: 'gpu', share: null, label: 'captioning model: a GPU' },
    ],
  },
  { title: '7. Write', sub: 'clips and metadata go to storage', count: '9 clips', res: [{ kind: 'store', label: 'storage and network' }] },
  {
    title: 'Then: deduplicate',
    sub: 'matching embeddings: one copy goes',
    count: '8 clips kept',
    res: [{ kind: 'none', label: 'a second pass over the stored embeddings' }],
  },
];

interface Dim {
  narrow: boolean;
  /** Panel width and height. */
  pw: number;
  ph: number;
  /** Thumbnail size; a clip is two thumbnails side by side. */
  tw: number;
  th: number;
  cols: number;
  gap: number;
  rowPitch: number;
  /** Top of the clip grid and of the resource lines, inside a panel. */
  gridY: number;
  resY: number;
}

const WIDE: Dim = { narrow: false, pw: 290, ph: 386, tw: 40, th: 30, cols: 3, gap: 8, rowPitch: 64, gridY: 58, resY: 332 };
const NARROW: Dim = { narrow: true, pw: 348, ph: 204, tw: 26, th: 20, cols: 6, gap: 3, rowPitch: 49, gridY: 54, resY: 160 };

/** Where clip `i` sits in stage `s`, relative to the panel. */
function slot(d: Dim, s: number, i: number): { x: number; y: number } {
  const tile = 2 * d.tw;
  const gridW = d.cols * tile + (d.cols - 1) * d.gap;
  const gx = (d.pw - gridW) / 2;
  if (s === 0) {
    // Uncut recordings: the three clips of a recording touch.
    const v = Math.floor(i / 3);
    const perRow = d.cols / 3;
    const vx = gx + (v % perRow) * (3 * tile + (perRow > 1 ? gridW - 6 * tile : 0));
    return { x: vx + (i % 3) * tile, y: d.gridY + Math.floor(v / perRow) * d.rowPitch };
  }
  return { x: gx + (i % d.cols) * (tile + d.gap), y: d.gridY + Math.floor(i / d.cols) * d.rowPitch };
}

function CaptionChip({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <path d={box(x, y, w, h)} fill="#ffffff" stroke={MUTED} strokeWidth="0.9" />
      <path d={`M${x + 4} ${y + h * 0.36}H${x + w - 5}M${x + 4} ${y + h * 0.7}H${x + w * 0.62}`} stroke={MUTED} strokeWidth="1.1" fill="none" />
    </g>
  );
}

function ClipTile({ d, s, i, ox, oy }: { d: Dim; s: number; i: number; ox: number; oy: number }) {
  const c = CLIPS[i];
  const p = slot(d, s, i);
  const x = ox + p.x;
  const y = oy + p.y;
  const w = 2 * d.tw;
  const filtered = c.still === true || c.dark === true;
  const droppedHere = (s === 3 && filtered) || (s === 7 && c.copyOf !== undefined);
  if (s > 3 && filtered) return <path d={box(x, y, w, d.th)} fill="none" stroke={LINE} strokeWidth="1" strokeDasharray="2 3" />;
  const filter = droppedHere ? 'url(#cur-grey)' : c.dark ? 'url(#cur-dark)' : undefined;
  const border = s === 0 ? 'none' : droppedHere ? DROP_INK : s === 1 ? MUTED : EMPHASIS;
  const twin = s === 7 && (c.copyOf !== undefined || CLIPS.some((o) => o.copyOf === i));
  const latentH = d.narrow ? 6 : 8;
  const reason = c.still ? (d.narrow ? 'still' : 'nothing moves') : c.dark ? (d.narrow ? 'dark' : 'too dark') : d.narrow ? 'copy' : 'near copy';
  return (
    <g>
      <Crop id={`cur-${s}-${i}-a`} frame={c.a} x={x} y={y} w={d.tw} h={d.th} fy={VIEW_43.fy} fh={VIEW_43.fh} filter={filter} opacity={droppedHere ? 0.55 : 1} />
      <Crop id={`cur-${s}-${i}-b`} frame={c.b} x={x + d.tw} y={y} w={d.tw} h={d.th} fy={VIEW_43.fy} fh={VIEW_43.fh} filter={filter} opacity={droppedHere ? 0.55 : 1} />
      <line x1={x + d.tw} y1={y} x2={x + d.tw} y2={y + d.th} stroke="#ffffff" strokeWidth="1" />
      {s > 0 && <path d={box(x, y, w, d.th)} fill="none" stroke={border} strokeWidth={s >= 2 ? 2 : 1.2} />}
      {droppedHere && <path d={`M${x} ${y}L${x + w} ${y + d.th}M${x + w} ${y}L${x} ${y + d.th}`} stroke={DROP_INK} strokeWidth="1.8" fill="none" />}
      {droppedHere && s === 3 && (
        <T x={x + w / 2} y={y + d.th + 15} anchor="middle" fill={DROP_INK} size={12.5}>
          {reason}
        </T>
      )}
      {s >= 4 && <Latent x={x} y={y + d.th + 3} values={latentOf(i)} cell={w / 8} cellH={latentH} stroke={twin ? ORANGE : '#1f5fa8'} strokeWidth={twin ? 2.2 : 1} />}
      {droppedHere && s === 7 && (
        <T x={x + w / 2} y={y + d.th + latentH + 17} anchor="middle" fill={DROP_INK} size={12.5}>
          {reason}
        </T>
      )}
      {s >= 5 && !droppedHere && <CaptionChip x={x} y={y + d.th + latentH + 6} w={w} h={d.narrow ? 8 : 10} />}
    </g>
  );
}

function ResLine({ r, x, y }: { r: Res; x: number; y: number }) {
  const tx = r.kind === 'none' ? x : x + 72;
  return (
    <g>
      {r.kind === 'cpu' && Array.from({ length: r.n }, (_, k) => <path key={k} d={box(x + k * 13, y - 10, 10, 10)} fill={CPU_FILL} stroke={CPU_INK} strokeWidth="1.3" />)}
      {r.kind === 'gpu' && (
        <g>
          <path d={box(x, y - 11, 62, 12)} fill={r.share === null ? GPU_FILL : '#ffffff'} stroke={GPU_INK} strokeWidth="1.3" strokeDasharray={r.share === null ? '3 2' : undefined} />
          {r.share !== null && <path d={box(x, y - 11, 62 * r.share, 12)} fill={GPU_INK} />}
        </g>
      )}
      {r.kind === 'video' && <path d={box(x, y - 11, 62, 12)} fill={VIDEO_FILL} stroke={VIDEO_INK} strokeWidth="1.3" strokeDasharray="4 3" />}
      {r.kind === 'store' && (
        <g>
          <path d={`M${x} ${y - 9}v8a31 4 0 0 0 62 0v-8`} fill={STORE_FILL} stroke={STORE_INK} strokeWidth="1.3" />
          <ellipse cx={x + 31} cy={y - 9} rx="31" ry="4" fill="#ffffff" stroke={STORE_INK} strokeWidth="1.3" />
        </g>
      )}
      <T x={tx} y={y}>
        {r.label}
      </T>
    </g>
  );
}

function StagePanel({ d, s, ox, oy }: { d: Dim; s: number; ox: number; oy: number }) {
  const st = STAGES[s];
  const tile = 2 * d.tw;
  return (
    <g>
      <rect x={ox} y={oy} width={d.pw} height={d.ph} rx="10" fill={PANEL} stroke={LINE} strokeWidth="1.2" />
      <T x={ox + 12} y={oy + 24} bold size={14}>
        {st.title}
      </T>
      <T x={ox + d.pw - 12} y={oy + 24} anchor="end" fill={MUTED} num="toy">
        {st.count}
      </T>
      <T x={ox + 12} y={oy + 43}>
        {st.sub}
      </T>
      {s === 6 && <path d={box(ox + 8, oy + d.gridY - 6, d.pw - 16, d.resY - d.gridY - 10)} fill={STORE_FILL} stroke={STORE_INK} strokeWidth="1" strokeDasharray="5 4" />}
      {CLIPS.map((_, i) => (
        <ClipTile key={i} d={d} s={s} i={i} ox={ox} oy={oy} />
      ))}
      {s === 0 &&
        [0, 1, 2, 3].map((v) => {
          const p = slot(d, 0, v * 3);
          return <path key={v} d={box(ox + p.x, oy + p.y, 3 * tile, d.th)} fill="none" stroke="#16191f" strokeWidth="1.6" />;
        })}
      {st.res.map((r, k) => (
        <ResLine key={r.label} r={r} x={ox + 12} y={oy + d.resY + 12 + k * 22} />
      ))}
    </g>
  );
}

export function CurFunnel() {
  const narrow = useNarrow();
  const d = narrow ? NARROW : WIDE;
  const W = narrow ? 360 : 1240;
  const H = narrow ? 1772 : 880;
  const at = (s: number) => (narrow ? { x: 6, y: 8 + s * 212 } : { x: 20 + (s % 4) * 303, y: 16 + Math.floor(s / 4) * 410 });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="curating-graph-title" style={{ width: '100%', height: 'auto' }}>
      <title id="curating-graph-title">A video curation pipeline as a funnel: the same clips drawn after each stage, with the machine part each stage loads</title>
      <desc>
        Eight panels in reading order. Download: four recordings. Decode and split: each is cut at its shot changes
        into clips, drawn as a first and a last frame. Transcode: every clip is re-encoded to H.264. Filter: two clips
        in which nothing moves and one dark clip drop out. Embed: each surviving clip gets an embedding, drawn as a
        strip of cells. Caption: each gets a caption. Write: clips and metadata go to storage. Deduplicate: two clips
        with matching embeddings are found and one is dropped. Under each panel, the default share of one worker:
        decode 3 CPUs, shot detection 0.25 of a GPU, transcode 5 CPUs, motion filter 0.5 of a GPU, aesthetic filter
        and embedding model 0.25 of a GPU each, caption input preparation 3 CPUs.
      </desc>
      <defs>
        <filter id="cur-grey" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <filter id="cur-dark" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="linear" slope="0.3" />
            <feFuncG type="linear" slope="0.3" />
            <feFuncB type="linear" slope="0.3" />
          </feComponentTransfer>
        </filter>
      </defs>
      <rect x="0" y="0" width={W} height={H} fill={PAPER} />
      {STAGES.map((st, s) => (
        <StagePanel key={st.title} d={d} s={s} ox={at(s).x} oy={at(s).y} />
      ))}
      {narrow
        ? STAGES.slice(1).map((st, k) => <Arrow key={st.title} x1={180} y1={at(k).y + d.ph} x2={180} y2={at(k + 1).y} />)
        : STAGES.slice(1).map((st, k) =>
            k === 3 ? (
              <g key={st.title}>
                <path d={`M${at(3).x + d.pw / 2} ${at(3).y + d.ph}v12H${at(4).x + d.pw / 2}`} fill="none" stroke={MUTED} strokeWidth="1.6" />
                <Arrow x1={at(4).x + d.pw / 2} y1={at(3).y + d.ph + 12} x2={at(4).x + d.pw / 2} y2={at(4).y} />
              </g>
            ) : (
              <Arrow key={st.title} x1={at(k).x + d.pw} y1={at(k).y + d.ph / 2} x2={at(k + 1).x} y2={at(k + 1).y + d.ph / 2} />
            ),
          )}
      {narrow ? (
        <g>
          <T x={12} y={1722}>
            Each clip: its first and last frame.
          </T>
          <T x={12} y={1740}>
            Bars: the default share of one worker of a stage,
          </T>
          <T x={12} y={1758}>
            with defaults tuned for a 48 GB GPU.
          </T>
        </g>
      ) : (
        <T x={20} y={858}>
          Each clip is drawn as its first and last frame. Bars: the default share of one worker of that stage, with defaults tuned for a 48 GB GPU.
        </T>
      )}
    </svg>
  );
}
