import { Arrow, INK, LINE, MUTED, PANEL, PAPER, T, box, useNarrow } from './WmJepaKit';

/**
 * Section 11: one recorded episode, three kinds of extra data, shown on real frames.
 *
 * Row 1 applies image transforms (SVG filters, a small rotation, a small shift) to the recorded
 * overhead frame. Row 2 shows three randomised MuJoCo scenes with the block in a new place each
 * time. Row 3 leaves its slots empty: no clip was generated for it. Beside each row,
 * the time to make one new sample on one shared log axis.
 */

const GRID = { href: './media/so101-eval-grid.jpg', iw: 1280, ih: 720 };
const SCENES = { href: './media/so101-domain-randomisation.jpg', iw: 1200, ih: 600 };
const FRAME_STROKE = '#b7791f';
const ROW_INK = ['#1f5fa8', '#a85a0a', '#5b3fa8'];
const ROW_FILL = ['#e8f1fb', '#fdeedd', '#efe9fb'];

/** The recorded frame: the inside of the first cell of the trial grid, 4:3. */
const REC = { sx: 24, sy: 22, sw: 264, sh: 198 };

/** Three randomised scenes (column, row of the 400 by 300 panes) and where the block sits in each. */
const REPLAYS = [
  { col: 0, row: 0, bx: 232, by: 193 },
  { col: 1, row: 0, bx: 198, by: 205 },
  { col: 1, row: 1, bx: 240, by: 215 },
];

/** Seconds per new sample. The two replay values are our division of NVIDIA's totals by 1,000. */
const T_REPLAY_STATE = 0.9;
const T_REPLAY_CAMERAS = 3.6;
const T_GENERATE = 207.78;
const DECADES = ['1 ms', '10 ms', '100 ms', '1 s', '10 s', '100 s', '1,000 s'];

interface PicProps {
  id: string;
  src: { href: string; iw: number; ih: number };
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  x: number;
  y: number;
  w: number;
  h: number;
  filter?: string;
  rotate?: number;
  stroke?: string;
}

/** A crop of a capture, painted into a box. */
function Pic({ id, src, sx, sy, sw, sh, x, y, w, h, filter, rotate, stroke = FRAME_STROKE }: PicProps) {
  const kx = w / sw;
  const ky = h / sh;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <image
          href={src.href}
          x={x - sx * kx}
          y={y - sy * ky}
          width={src.iw * kx}
          height={src.ih * ky}
          preserveAspectRatio="none"
          filter={filter}
          transform={rotate ? `rotate(${rotate} ${x + w / 2} ${y + h / 2})` : undefined}
        />
      </g>
      <path d={box(x, y, w, h)} fill="none" stroke={stroke} strokeWidth="1.5" />
    </g>
  );
}

/** Row 1: the recorded frame under three image transforms. */
function Transformed({ x, y, w, h, gap }: { x: number; y: number; w: number; h: number; gap: number }) {
  return (
    <g>
      <Pic id="aug-t0" src={GRID} {...REC} x={x} y={y} w={w} h={h} filter="url(#aug-bright)" rotate={3} />
      <Pic id="aug-t1" src={GRID} {...REC} sx={REC.sx + 12} sy={REC.sy + 8} x={x + w + gap} y={y} w={w} h={h} filter="url(#aug-dark)" />
      <Pic id="aug-t2" src={GRID} {...REC} x={x + 2 * (w + gap)} y={y} w={w} h={h} filter="url(#aug-hue)" />
    </g>
  );
}

/** Row 2: three randomised scenes, the block ringed. */
function Replayed({ x, y, w, h, gap }: { x: number; y: number; w: number; h: number; gap: number }) {
  return (
    <g>
      {REPLAYS.map((r, i) => {
        const fx = x + i * (w + gap);
        return (
          <g key={i}>
            <Pic id={`aug-r${i}`} src={SCENES} sx={r.col * 400} sy={r.row * 300} sw={400} sh={300} x={fx} y={y} w={w} h={h} />
            <circle cx={fx + (r.bx * w) / 400} cy={y + (r.by * h) / 300} r={w * 0.075} fill="none" stroke={INK} strokeWidth="3.4" />
            <circle cx={fx + (r.bx * w) / 400} cy={y + (r.by * h) / 300} r={w * 0.075} fill="none" stroke="#ffffff" strokeWidth="1.8" />
          </g>
        );
      })}
    </g>
  );
}

/** Row 3: empty slots. No clip was generated. */
function Slots({ x, y, w, h, gap }: { x: number; y: number; w: number; h: number; gap: number }) {
  return (
    <g>
      {[0, 1, 2].map((i) => {
        const fx = x + i * (w + gap);
        return (
          <g key={i}>
            <path d={box(fx, y, w, h)} fill="#f6f3fc" stroke={ROW_INK[2]} strokeWidth="1.5" strokeDasharray="6 4" />
            <path d={`M${fx + w / 2 - 9} ${y + h / 2 - 11}v22l18 -11Z`} fill="none" stroke={ROW_INK[2]} strokeWidth="1.5" strokeLinejoin="round" />
          </g>
        );
      })}
    </g>
  );
}

/** The marks of one row on the log time axis. `X` maps seconds to x. */
function TimeMarks({ row, X, y }: { row: number; X: (s: number) => number; y: number }) {
  const ink = ROW_INK[row];
  return (
    <g>
      <line x1={X(0.001)} y1={y} x2={X(1000)} y2={y} stroke={LINE} strokeWidth="1.2" />
      {DECADES.map((d, i) => (
        <line key={d} x1={X(10 ** (i - 3))} y1={y - 4} x2={X(10 ** (i - 3))} y2={y + 4} stroke={LINE} strokeWidth="1.2" />
      ))}
      {row === 0 && <path d={box(X(0.001), y - 8, X(0.01) - X(0.001), 16)} fill="url(#aug-hatch)" stroke={ink} strokeWidth="1.5" />}
      {row === 1 && (
        <g>
          <line x1={X(T_REPLAY_STATE)} y1={y} x2={X(T_REPLAY_CAMERAS)} y2={y} stroke={ink} strokeWidth="3" />
          <circle cx={X(T_REPLAY_STATE)} cy={y} r="6" fill={ink} stroke="#ffffff" strokeWidth="1.5" />
          <circle cx={X(T_REPLAY_CAMERAS)} cy={y} r="6" fill={ink} stroke="#ffffff" strokeWidth="1.5" />
        </g>
      )}
      {row === 2 && <circle cx={X(T_GENERATE)} cy={y} r="6" fill={ink} stroke="#ffffff" strokeWidth="1.5" />}
    </g>
  );
}

function DecadeLabels({ X, y, every }: { X: (s: number) => number; y: number; every: number }) {
  return (
    <g aria-hidden="true">
      {DECADES.map((d, i) =>
        i % every === 0 ? (
          <T key={d} x={X(10 ** (i - 3))} y={y} anchor={every === 1 ? 'middle' : i === 0 ? 'start' : i === DECADES.length - 1 ? 'end' : 'middle'} fill={MUTED} size={12.5}>
            {d}
          </T>
        ) : null,
      )}
    </g>
  );
}

const RUNS_ON = ['runs on: CPU cores, or the training GPU', 'runs on: GPU physics plus GPU rendering', 'runs on: GPU tensor cores and large GPU memory'];
const TITLES = ['1. Image transforms', '2. Replay in a simulator', '3. Generate with a world model'];

function Wide() {
  const X = (s: number) => 830 + 60 * (Math.log10(s) + 3);
  const fw = 152;
  const fh = 114;
  const tops = [20, 232, 444];
  const subs = [
    'Changes the pixels, slightly. The motion is untouched, so nothing needs checking.',
    'Changes where the block starts and how the arm moves. Physics checks each replay; successes are kept.',
    'Changes the whole look, or invents the episode. Nothing checks the result, so inspect the clips.',
  ];
  return (
    <g>
      {/* the recorded episode */}
      <T x={20} y={228} bold size={14}>
        One demonstration
      </T>
      <T x={20} y={247}>
        one overhead frame of it
      </T>
      <Pic id="aug-rec" src={GRID} {...REC} x={20} y={258} w={232} h={174} />
      <T x={20} y={452} fill={MUTED}>
        a MuJoCo still, scripted motion
      </T>
      <path d={`M252 345H274M274 ${tops[0] + 100}V${tops[2] + 100}`} fill="none" stroke={MUTED} strokeWidth="1.6" />
      {tops.map((y) => (
        <Arrow key={y} x1={274} y1={y + 100} x2={295} y2={y + 100} />
      ))}

      {tops.map((y, i) => (
        <g key={y}>
          <rect x="296" y={y} width="924" height="200" rx="10" fill={PANEL} stroke={LINE} strokeWidth="1.2" />
          <path d={box(296, y + 12, 5, 176)} fill={ROW_INK[i]} />
          <T x={314} y={y + 27} bold size={14}>
            {TITLES[i]}
          </T>
          <T x={314} y={y + 46}>
            {subs[i]}
          </T>
          {DECADES.map((d, k) => (
            <line key={d} x1={X(10 ** (k - 3))} y1={y + 60} x2={X(10 ** (k - 3))} y2={y + 190} stroke="#e6eaef" strokeWidth="1" />
          ))}
          <TimeMarks row={i} X={X} y={y + 118} />
          <T x={i === 2 ? 1190 : 830} y={y + 186} anchor={i === 2 ? 'end' : 'start'} bold fill={ROW_INK[i]}>
            {RUNS_ON[i]}
          </T>
        </g>
      ))}

      <Transformed x={314} y={tops[0] + 58} w={fw} h={fh} gap={8} />
      <T x={314 + fw / 2} y={tops[0] + 189} anchor="middle">
        brighter, rotated
      </T>
      <T x={314 + fw + 8 + fw / 2} y={tops[0] + 189} anchor="middle">
        darker, shifted
      </T>
      <T x={314 + 2 * (fw + 8) + fw / 2} y={tops[0] + 189} anchor="middle">
        hue and saturation shifted
      </T>
      <T x={830} y={tops[0] + 96}>
        an estimate, not a published figure: milliseconds per image
      </T>
      <T x={830} y={tops[0] + 148}>
        on the training GPU: a peak of 2.4 GB at a batch of 160
      </T>

      <Replayed x={314} y={tops[1] + 58} w={fw} h={fh} gap={8} />
      <T x={314} y={tops[1] + 189}>
        Ringed: the block, in a new place in each scene.
      </T>
      <T x={830} y={tops[1] + 96} num="derived">
        0.9 s each, or 3.6 s with cameras: NVIDIA&apos;s totals / 1,000
      </T>
      <T x={830} y={tops[1] + 148}>
        NVIDIA: 1,000 demonstrations take about 15 minutes,
      </T>
      <T x={830} y={tops[1] + 166}>
        or about 1 hour when cameras are rendered
      </T>

      <Slots x={314} y={tops[2] + 58} w={fw} h={fh} gap={8} />
      <T x={314} y={tops[2] + 189}>
        Outlines only: no clip was generated.
      </T>
      <T x={1190} y={tops[2] + 96} anchor="end">
        207.78 s for one generated clip
      </T>
      <T x={1190} y={tops[2] + 148} anchor="end">
        NVIDIA: one 720p clip of under 8 seconds, on one H100
      </T>

      <DecadeLabels X={X} y={664} every={1} />
      <T x={1010} y={686} anchor="middle">
        time to make one new sample (log scale)
      </T>
    </g>
  );
}

function Narrow() {
  const X = (s: number) => 24 + 52 * (Math.log10(s) + 3);
  const fw = 104;
  const fh = 78;
  const tops = [232, 580, 945];
  const subs = [
    ['Changes the pixels, slightly. The motion is', 'untouched, so nothing needs checking.'],
    ['Changes where the block starts and how the arm', 'moves. Physics checks each replay; successes', 'are kept.'],
    ['Changes the whole look, or invents the episode.', 'Nothing checks the result, so inspect the clips.'],
  ];
  /** Offsets inside a row: frames, then the time axis. */
  const fy = [70, 87, 70];
  return (
    <g>
      <T x={180} y={24} anchor="middle" bold>
        One demonstration
      </T>
      <Pic id="aug-rec" src={GRID} {...REC} x={80} y={34} w={200} h={150} />
      <T x={180} y={203} anchor="middle" fill={MUTED}>
        one overhead frame, a MuJoCo still
      </T>
      <Arrow x1={180} y1={210} x2={180} y2={230} />

      {tops.map((y, i) => {
        const ay = y + fy[i] + fh + 92;
        return (
          <g key={y}>
            <rect x="6" y={y} width="348" height={i === 1 ? 353 : 336} rx="10" fill={PANEL} stroke={LINE} strokeWidth="1.2" />
            <path d={box(6, y + 12, 5, i === 1 ? 329 : 312)} fill={ROW_INK[i]} />
            <T x={18} y={y + 26} bold>
              {TITLES[i]}
            </T>
            {subs[i].map((line, k) => (
              <T key={line} x={18} y={y + 45 + k * 17}>
                {line}
              </T>
            ))}
            <TimeMarks row={i} X={X} y={ay} />
            <DecadeLabels X={X} y={ay + 22} every={3} />
            <T x={18} y={ay + 82} bold fill={ROW_INK[i]}>
              {RUNS_ON[i]}
            </T>
          </g>
        );
      })}

      <Transformed x={18} y={tops[0] + fy[0]} w={fw} h={fh} gap={8} />
      <T x={18} y={tops[0] + fy[0] + fh + 18}>
        brighter and rotated; darker and shifted;
      </T>
      <T x={18} y={tops[0] + fy[0] + fh + 35}>
        hue and saturation shifted
      </T>
      <T x={18} y={tops[0] + fy[0] + fh + 66}>
        time per new sample: milliseconds per image
      </T>
      <T x={18} y={tops[0] + fy[0] + fh + 138}>
        An estimate, not a published figure. On the
      </T>
      <T x={18} y={tops[0] + fy[0] + fh + 155}>
        training GPU: a peak of 2.4 GB at batch 160.
      </T>

      <Replayed x={18} y={tops[1] + fy[1]} w={fw} h={fh} gap={8} />
      <T x={18} y={tops[1] + fy[1] + fh + 18}>
        Ringed: the block, in a new place in each scene.
      </T>
      <T x={18} y={tops[1] + fy[1] + fh + 49} num="derived">
        time per new sample: 0.9 s without cameras,
      </T>
      <T x={18} y={tops[1] + fy[1] + fh + 66} num="derived">
        3.6 s with them (NVIDIA&apos;s totals / 1,000)
      </T>
      <T x={18} y={tops[1] + fy[1] + fh + 138}>
        NVIDIA: 1,000 demonstrations take about 15
      </T>
      <T x={18} y={tops[1] + fy[1] + fh + 155}>
        minutes, or about 1 hour with cameras.
      </T>

      <Slots x={18} y={tops[2] + fy[2]} w={fw} h={fh} gap={8} />
      <T x={18} y={tops[2] + fy[2] + fh + 18}>
        Outlines only: no clip was generated.
      </T>
      <T x={18} y={tops[2] + fy[2] + fh + 66}>
        time per new sample: 207.78 s for one clip
      </T>
      <T x={18} y={tops[2] + fy[2] + fh + 138}>
        NVIDIA: one 720p clip of under 8 seconds,
      </T>
      <T x={18} y={tops[2] + fy[2] + fh + 155}>
        on one H100.
      </T>
    </g>
  );
}

export function AugThreeWays() {
  const narrow = useNarrow();
  const W = narrow ? 360 : 1240;
  const H = narrow ? 1292 : 700;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="augmentation-fanout-title" style={{ width: '100%', height: 'auto' }}>
      <title id="augmentation-fanout-title">One demonstration turned into three kinds of extra training data, with the time each takes per new sample</title>
      <desc>
        One overhead frame of a demonstration feeds three rows. Image transforms show the same frame brighter and
        rotated, darker and shifted, and with its hue shifted; an estimate puts them at milliseconds per image. Replay
        in a simulator shows three scenes with the block in a new place each time; 1,000 demonstrations take about 15
        minutes, or about 1 hour with cameras, which comes to under a second each, or a few seconds with cameras. Generation with a world model
        shows three empty slots, because no clip was generated; one 720p clip takes 207.78 seconds on one H100. The three
        times sit on one log axis from 1 millisecond to 1,000 seconds.
      </desc>
      <defs>
        <filter id="aug-bright" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.16" />
            <feFuncG type="linear" slope="1.16" />
            <feFuncB type="linear" slope="1.16" />
          </feComponentTransfer>
        </filter>
        <filter id="aug-dark" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="linear" slope="0.68" />
            <feFuncG type="linear" slope="0.68" />
            <feFuncB type="linear" slope="0.68" />
          </feComponentTransfer>
        </filter>
        <filter id="aug-hue" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
          <feColorMatrix type="hueRotate" values="-28" result="h" />
          <feColorMatrix in="h" type="saturate" values="1.6" />
        </filter>
        <pattern id="aug-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0h6v6h-6Z" fill={ROW_FILL[0]} />
          <path d="M0 0v6" stroke={ROW_INK[0]} strokeWidth="2" />
        </pattern>
      </defs>
      <rect x="0" y="0" width={W} height={H} fill={PAPER} />
      {narrow ? <Narrow /> : <Wide />}
    </svg>
  );
}
