import { Arrow, GPU_FILL, GPU_INK, INK, JOINT_CURVES, LINE, MUTED, PAPER, ROBOT_INK, T, box, heat, rbox, rnd, useNarrow } from './DemoKit';

/**
 * Section 5, one call of pi0 on the SO-101, with every tensor drawn to its shape.
 *
 * Two camera frames and the words of the instruction become one row of tokens, the prefix. The
 * backbone reads it once and the result is cached. The action head, drawn at one tenth of the
 * backbone's area (300M against 3B parameters), turns a grid of noise, 50 rows by 32 columns, into
 * the action chunk in 10 steps; three pictures of that grid are shown. Columns 1 to 6 of the result
 * are the arm's joint targets and the rest is padding.
 *
 * The frames, the token counts and the values are schematic and the caption says so. Every number
 * drawn comes from the register entries the section passes in `cites`.
 */

const ROWS = 50;
const COLS = 32;
const LIVE = 6;
const YELLOW = '#ffe9a8';
const CACHED = '#bfe3c9';
const CACHED_TEXT = '#e3f3e8';

/** One picture of the 50 by 32 grid at flow time fr: noise at 0, the chunk at 1. Cells grouped by shade. */
function gridPaths(x: number, y: number, cell: number, fr: number): { fill: string; d: string }[] {
  const buckets = new Map<string, string>();
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const noise = rnd(r * COLS + c, 13) * 2 - 1;
      const target = c < LIVE ? JOINT_CURVES[c](r / (ROWS - 1)) : 0;
      const v = Math.round((noise * (1 - fr) + target * fr) * 6) / 6;
      const fill = heat(v);
      buckets.set(fill, `${buckets.get(fill) ?? ''}M${(x + c * cell).toFixed(2)} ${(y + r * cell).toFixed(2)}h${cell}v${cell}h${-cell}Z`);
    }
  }
  return Array.from(buckets, ([fill, d]) => ({ fill, d }));
}

function Grid({ x, y, cell, fr, final }: { x: number; y: number; cell: number; fr: number; final?: boolean }) {
  const w = COLS * cell;
  const h = ROWS * cell;
  return (
    <g>
      {gridPaths(x, y, cell, fr).map((b) => (
        <path key={b.fill} d={b.d} fill={b.fill} />
      ))}
      {final && <path d={box(x + LIVE * cell, y, w - LIVE * cell, h)} fill="url(#vla-blocks-hatch)" />}
      {final && <path d={box(x, y, LIVE * cell, h)} fill="none" stroke={ROBOT_INK} strokeWidth="2" />}
      <path d={box(x, y, w, h)} fill="none" stroke={final ? LINE : MUTED} strokeWidth="1" />
    </g>
  );
}

/** A camera frame: a 4:3 box with a patch grid over a schematic view of the block and the cup. */
function Frame({ x, y, w, wrist }: { x: number; y: number; w: number; wrist?: boolean }) {
  const h = (w * 3) / 4;
  let grid = '';
  for (let i = 1; i < 8; i += 1) grid += `M${(x + (i * w) / 8).toFixed(1)} ${y}v${h}`;
  for (let j = 1; j < 6; j += 1) grid += `M${x} ${(y + (j * h) / 6).toFixed(1)}h${w}`;
  return (
    <g>
      <path d={box(x, y, w, h)} fill="#fffbe8" />
      {wrist ? (
        <g>
          <path d={box(x + w * 0.34, y + h * 0.42, w * 0.32, w * 0.32)} fill="#d9b25c" stroke={ROBOT_INK} strokeWidth="1.2" />
          <path d={`${box(x + w * 0.18, y, w * 0.1, h * 0.5)}${box(x + w * 0.72, y, w * 0.1, h * 0.5)}`} fill="#8d99a8" />
        </g>
      ) : (
        <g>
          <path d={box(x + w * 0.26, y + h * 0.52, w * 0.13, w * 0.13)} fill="#d9b25c" stroke={ROBOT_INK} strokeWidth="1.2" />
          <circle cx={x + w * 0.72} cy={y + h * 0.4} r={w * 0.1} fill="#ffffff" stroke={MUTED} strokeWidth="1.6" />
          <path d={`M${x + w * 0.02} ${y + h * 0.95}L${x + w * 0.2} ${y + h * 0.7}`} stroke="#8d99a8" strokeWidth={w * 0.04} strokeLinecap="round" />
        </g>
      )}
      <path d={grid} stroke={ROBOT_INK} strokeWidth="0.7" opacity="0.35" fill="none" />
      <path d={box(x, y, w, h)} fill="none" stroke={ROBOT_INK} strokeWidth="1.8" />
    </g>
  );
}

/** The prefix: a row of token cells. Two runs of image tokens (more than are drawn), then the text tokens. */
function Ribbon({ x, y, cell, h, words, cached }: { x: number; y: number; cell: number; h: number; words: number; cached?: boolean }) {
  const run = 16;
  const gap = cell * 1.4;
  const cells: { x: number; text: boolean }[] = [];
  let cx = x;
  for (let g = 0; g < 2; g += 1) {
    for (let i = 0; i < run; i += 1) {
      cells.push({ x: cx, text: false });
      cx += cell;
    }
    cx += gap;
  }
  for (let i = 0; i < words; i += 1) {
    cells.push({ x: cx, text: true });
    cx += cell;
  }
  return (
    <g>
      {cells.map((c) => (
        <path
          key={c.x}
          d={box(c.x, y, cell - 1, h)}
          fill={cached ? (c.text ? CACHED_TEXT : CACHED) : c.text ? '#ffffff' : YELLOW}
          stroke={cached ? GPU_INK : c.text ? MUTED : ROBOT_INK}
          strokeWidth="0.9"
        />
      ))}
    </g>
  );
}

function Lock({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 3} ${y + 7}v-3a4 4 0 0 1 8 0v3`} fill="none" stroke={GPU_INK} strokeWidth="1.8" />
      <path d={rbox(x, y + 7, 14, 10, 2)} fill={GPU_INK} />
    </g>
  );
}

/** Six joint curves over the 50 rows of the chunk. */
function Curves({ x, y, w, rowH, gap }: { x: number; y: number; w: number; rowH: number; gap: number }) {
  return (
    <g>
      {JOINT_CURVES.map((fn, k) => {
        const y0 = y + k * (rowH + gap);
        const d = Array.from({ length: ROWS }, (_, r) => `${r === 0 ? 'M' : 'L'}${(x + (r * w) / (ROWS - 1)).toFixed(1)} ${(y0 + rowH / 2 - fn(r / (ROWS - 1)) * (rowH / 2 - 2)).toFixed(1)}`).join('');
        return (
          <g key={y0}>
            <path d={box(x, y0, w, rowH)} fill="#fffbe8" stroke="#e3cf8a" strokeWidth="0.8" />
            <path d={d} fill="none" stroke={ROBOT_INK} strokeWidth="1.8" />
          </g>
        );
      })}
    </g>
  );
}

function Chips({ x, y, words, size }: { x: number; y: number; words: string[]; size: number }) {
  let cx = x;
  return (
    <g>
      {words.map((w, i) => {
        const cw = w.length * size * 0.58 + 14;
        const x0 = cx;
        cx += cw + 4;
        return (
          <g key={`${w}${i}`}>
            <path d={rbox(x0, y, cw, size + 11, 4)} fill="#ffffff" stroke={MUTED} strokeWidth="1.2" />
            <text x={x0 + cw / 2} y={y + size + 2} fontFamily="sans-serif" fontSize={size} textAnchor="middle" fill={INK}>
              {w}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function CostStrip({ x, y, unit, labelX, stacked, size }: { x: number; y: number; unit: number; labelX: number; stacked: boolean; size: number }) {
  const small = unit / 10;
  const rowB = stacked ? y + 40 : y + 26;
  return (
    <g>
      <path d={box(x, y, unit, 14)} fill={GPU_INK} />
      {Array.from({ length: 10 }, (_, k) => (
        <path key={k} d={box(x + k * small, rowB, small - 3, 14)} fill={GPU_INK} opacity="0.75" />
      ))}
      <T x={labelX} y={stacked ? y - 6 : y + 12} size={size}>
        backbone: 1 pass over 3B parameters
      </T>
      <T x={labelX} y={stacked ? rowB - 6 : rowB + 12} size={size}>
        action head: 10 passes over 300M parameters
      </T>
    </g>
  );
}

export function VlaTokenFlow({ instruction }: { instruction: string }) {
  const narrow = useNarrow();
  const words = instruction.split(' ');
  const W = narrow ? 320 : 1200;
  const H = narrow ? 1082 : 626;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="vla-blocks-title" style={{ width: '100%', height: 'auto' }}>
      <title id="vla-blocks-title">One call of pi0 on the SO-101, with every tensor drawn to its shape</title>
      <desc>
        Two camera frames with a patch grid and the words of one instruction become a single row of tokens, the prefix.
        A wide green slab, the backbone, reads the prefix once and the result is cached. Six joint angles are padded
        with zeros to 32 slots and go to the action head, a green square one tenth the area of the backbone. Beside it
        a grid of 50 rows by 32 columns is drawn three times: pure noise, half resolved after 5 steps, and the finished
        action chunk after 10 steps, each step reading the cached prefix. The first six columns of the finished grid
        become six joint curves played at 30 rows per second; the other columns are padding.
      </desc>
      <defs>
        <pattern id="vla-blocks-hatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
          <path d="M0 0v5" stroke="#aeb7c2" strokeWidth="1.4" />
        </pattern>
      </defs>
      <rect x="0" y="0" width={W} height={H} fill={PAPER} />

      {narrow ? (
        <g>
          {/* inputs */}
          <T x={10} y={18} size={12} bold>
            2 camera images, 640 x 480 pixels each
          </T>
          <Frame x={10} y={26} w={145} />
          <Frame x={165} y={26} w={145} wrist />
          <T x={10} y={156} size={12} bold>
            The instruction
          </T>
          <Chips x={10} y={164} words={words} size={12} />
          <Arrow x1={160} y1={192} x2={160} y2={212} />

          {/* prefix and backbone */}
          <T x={10} y={228} size={12}>
            the prefix: image tokens, then text tokens
          </T>
          <Ribbon x={10} y={236} cell={7.3} h={14} words={words.length} />
          <Arrow x1={160} y1={252} x2={160} y2={266} color={GPU_INK} />
          <path d={rbox(10, 268, 300, 110, 5)} fill={GPU_FILL} stroke={GPU_INK} strokeWidth="1.6" />
          <T x={22} y={292} size={13} bold>
            Backbone
          </T>
          <T x={22} y={312} size={12}>
            PaliGemma, a vision-language model
          </T>
          <T x={22} y={330} size={12}>
            3B parameters, pretrained on the web
          </T>
          <T x={22} y={348} size={12}>
            reads the prefix once per call
          </T>
          <Arrow x1={160} y1={378} x2={160} y2={392} color={GPU_INK} />
          <Ribbon x={10} y={394} cell={6.9} h={14} words={words.length} cached />
          <Lock x={296} y={386} />
          <T x={10} y={426} size={12}>
            the result is cached and read at every step
          </T>

          {/* state */}
          <T x={10} y={456} size={12} bold>
            The state: 6 joint angles
          </T>
          {Array.from({ length: COLS }, (_, c) => (
            <path key={c} d={box(10 + c * 9.3, 464, 8.3, 14)} fill={c < LIVE ? heat(JOINT_CURVES[c](0) * 0.8 + 0.1) : '#ffffff'} stroke={c < LIVE ? ROBOT_INK : LINE} strokeWidth="0.9" />
          ))}
          <T x={10} y={494} size={12}>
            zero-padded from 6 to 32 slots
          </T>

          {/* action head */}
          <path d={rbox(10, 512, 57.5, 57.5, 4)} fill={GPU_FILL} stroke={GPU_INK} strokeWidth="1.6" />
          <T x={38.7} y={546} size={13} anchor="middle" bold>
            300M
          </T>
          <T x={78} y={526} size={13} bold>
            Action head (the action expert)
          </T>
          <T x={78} y={544} size={12}>
            300M parameters; its square is one
          </T>
          <T x={78} y={560} size={12}>
            tenth of the backbone&apos;s area
          </T>
          <T x={10} y={592} size={12}>
            It refines a grid of 50 rows x 32 columns:
          </T>
          <T x={53} y={612} size={12} anchor="middle" fill={MUTED}>
            τ = 0: noise
          </T>
          <T x={160} y={612} size={12} anchor="middle" num="derived" fill={MUTED}>
            τ = 0.5
          </T>
          <T x={267} y={612} size={12} anchor="middle" fill={MUTED}>
            τ = 1: chunk
          </T>
          <Grid x={10} y={620} cell={2.7} fr={0} />
          <Grid x={117} y={620} cell={2.7} fr={0.5} />
          <Grid x={224} y={620} cell={2.7} fr={1} final />
          <Arrow x1={98} y1={687} x2={115} y2={687} head={6} />
          <Arrow x1={205} y1={687} x2={222} y2={687} head={6} />
          <T x={10} y={774} size={12}>
            5 steps between pictures, 10 in all
          </T>
          <T x={10} y={792} size={12}>
            hatched: columns 7 to 32, padding, dropped
          </T>

          {/* output */}
          <T x={10} y={822} size={12} bold>
            Columns 1 to 6: the six joint targets
          </T>
          <Curves x={10} y={830} w={300} rowH={16} gap={3} />
          <T x={10} y={960} size={12}>
            50 rows, played one per tick at 30 per second
          </T>

          {/* cost */}
          <T x={10} y={990} size={12} bold>
            One call to the policy, to the same scale:
          </T>
          <CostStrip x={10} y={1014} unit={290} labelX={10} stacked size={12} />
        </g>
      ) : (
        <g>
          {/* inputs */}
          <T x={20} y={30} bold>
            2 camera images, 640 x 480 pixels each
          </T>
          <Frame x={20} y={42} w={130} />
          <Frame x={160} y={42} w={130} wrist />
          <T x={20} y={166} bold>
            The instruction
          </T>
          <Chips x={20} y={176} words={words} size={13} />
          <path d="M298 42q10 0 10 10v58q0 10 8 10q-8 0 -8 10v60q0 10 -10 10" fill="none" stroke={MUTED} strokeWidth="1.4" />
          <path d="M316 120H326V60H330" fill="none" stroke={MUTED} strokeWidth="1.6" />
          <Arrow x1={326} y1={60} x2={338} y2={60} />

          {/* prefix, backbone, cached prefix */}
          <T x={340} y={40}>
            the prefix: image tokens (yellow, more than are drawn), then the text tokens of the instruction (white)
          </T>
          <Ribbon x={340} y={50} cell={16.2} h={18} words={words.length} />
          <Arrow x1={670} y1={70} x2={670} y2={84} color={GPU_INK} />
          <path d={rbox(340, 86, 660, 92, 6)} fill={GPU_FILL} stroke={GPU_INK} strokeWidth="1.8" />
          <T x={358} y={112} size={14} bold>
            Backbone: PaliGemma, a vision-language model
          </T>
          <T x={358} y={134}>
            3B parameters, pretrained on images and text from the web
          </T>
          <T x={358} y={156}>
            reads the prefix once per call
          </T>
          <Arrow x1={670} y1={178} x2={670} y2={192} color={GPU_INK} />
          <Ribbon x={340} y={194} cell={16.2} h={18} words={words.length} cached />
          <Lock x={1010} y={190} />
          <T x={1032} y={204}>
            cached: computed
          </T>
          <T x={1032} y={222}>
            once per call
          </T>
          <T x={1032} y={118} fill={GPU_INK}>
            green areas are
          </T>
          <T x={1032} y={136} fill={GPU_INK}>
            drawn to scale:
          </T>
          <T x={1032} y={154} fill={GPU_INK}>
            3B against 300M
          </T>

          {/* state */}
          <T x={20} y={262} bold>
            The state: 6 joint angles
          </T>
          {Array.from({ length: COLS }, (_, c) => (
            <path key={c} d={box(20 + c * 8.6, 274, 7.6, 16)} fill={c < LIVE ? heat(JOINT_CURVES[c](0) * 0.8 + 0.1) : '#ffffff'} stroke={c < LIVE ? ROBOT_INK : LINE} strokeWidth="0.9" />
          ))}
          <T x={20} y={310}>
            zero-padded from 6 to 32 slots
          </T>
          <path d="M300 282H320V399H326" fill="none" stroke={MUTED} strokeWidth="1.6" />
          <Arrow x1={322} y1={399} x2={338} y2={399} />

          {/* action head */}
          <T x={340} y={332} size={14} bold>
            Action head
          </T>
          <T x={340} y={350}>
            (the action expert)
          </T>
          <path d={rbox(340, 360, 78, 78, 5)} fill={GPU_FILL} stroke={GPU_INK} strokeWidth="1.8" />
          <T x={379} y={396} size={14} anchor="middle" bold>
            300M
          </T>
          <T x={379} y={414} size={12} anchor="middle">
            parameters
          </T>
          <T x={340} y={460}>
            10 passes per call
          </T>
          <Arrow x1={418} y1={399} x2={466} y2={399} color={GPU_INK} />

          {/* the grid, three times */}
          <T x={340} y={236} fill={GPU_INK}>
            read at every step
          </T>
          {[527.6, 707.6, 887.6].map((cx) => (
            <g key={cx}>
              <path d={`M${cx} 214V262`} stroke={GPU_INK} strokeWidth="1.3" strokeDasharray="4 3" />
              <path d={`M${cx - 4} 262h8l-4 8Z`} fill={GPU_INK} />
            </g>
          ))}
          <T x={527.6} y={290} anchor="middle">
            τ = 0: pure noise
          </T>
          <T x={707.6} y={290} anchor="middle" num="derived">
            τ = 0.5: after 5 steps
          </T>
          <T x={887.6} y={290} anchor="middle">
            τ = 1: the action chunk
          </T>
          <Grid x={470} y={300} cell={3.6} fr={0} />
          <Grid x={650} y={300} cell={3.6} fr={0.5} />
          <Grid x={830} y={300} cell={3.6} fr={1} final />
          <T x={617.6} y={380} size={12} anchor="middle">
            5 steps
          </T>
          <Arrow x1={590} y1={390} x2={646} y2={390} />
          <T x={797.6} y={380} size={12} anchor="middle">
            5 steps
          </T>
          <Arrow x1={770} y1={390} x2={826} y2={390} />
          <T x={527.6} y={500} anchor="middle">
            50 rows x 32 columns
          </T>
          <T x={945} y={500} anchor="end">
            hatched: columns 7 to 32, padding, dropped
          </T>

          {/* output */}
          <Arrow x1={949} y1={390} x2={984} y2={390} color={ROBOT_INK} />
          <T x={990} y={290} bold>
            Columns 1 to 6: joint targets
          </T>
          <Curves x={990} y={300} w={190} rowH={24} gap={7.2} />
          <T x={990} y={500}>
            50 rows, one per tick,
          </T>
          <T x={990} y={518}>
            played at 30 per second
          </T>

          {/* cost */}
          <path d="M20 544H1180" stroke="#d5dbdb" strokeWidth="1" />
          <T x={20} y={574} bold>
            One call to the policy, to the same scale:
          </T>
          <CostStrip x={340} y={562} unit={300} labelX={656} stacked={false} size={13} />
        </g>
      )}
    </svg>
  );
}
