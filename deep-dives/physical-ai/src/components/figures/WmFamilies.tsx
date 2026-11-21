import type { CSSProperties } from 'react';
import { Arrow, Crop, EMPHASIS, GPU_FILL, GPU_INK, LINE, Latent, MUTED, ORANGE, PANEL, PAPER, PURPLE, Sym, T, VIEW_43, box, gridPath, useNarrow } from './WmJepaKit';

/**
 * Section 6: what each family of world model has to get right, on one real frame.
 *
 * Top: the camera frame and the action. Left: the pixel family cuts the frame into its compressed
 * grid, cleans noise into the next frame over many passes and has to paint every region. Right:
 * the latent family encodes, predicts once and compares two latents. Bottom: the time to plan one
 * action with each, from the V-JEPA 2 paper.
 */

/** The stills: the gripper over the block (now) and the block lifted (what came next). */
const NOW = 2;
const NEXT = 3;
const FRAME_STROKE = '#b7791f';

/** Three regions of the next frame, as fractions of the square still. */
const REGIONS = [
  { key: 'block', color: GPU_INK, u0: 0.515, u1: 0.675, v0: 0.355, v1: 0.485, pixel: 'block position: needed', latent: 'block position: kept', kept: true },
  { key: 'glint', color: ORANGE, u0: 0.665, u1: 0.865, v0: 0.47, v1: 0.575, pixel: 'glint on the cup: predicted anyway', latent: 'glint on the cup: dropped', kept: false },
  { key: 'texture', color: PURPLE, u0: 0.04, u1: 0.33, v0: 0.74, v1: 0.9, pixel: 'table texture: predicted anyway', latent: 'table texture: dropped', kept: false },
];

const Z_NOW = [0.2, 0.7, 0.45, 0.9, 0.3, 0.6, 0.15, 0.8];
const Z_HAT = [0.35, 0.6, 0.7, 0.5, 0.85, 0.25, 0.55, 0.4];
const Z_GAP = [0.05, -0.12, 0.02, 0.2, -0.08, 0.03, -0.15, 0.06];
const Z_TRUE = Z_HAT.map((v, i) => v + Z_GAP[i]);

/** Denoising passes in the Cosmos 3 model card examples. */
const PASSES = 35;

export const WM_FAMILY_STEPS: string[] = [
  'One camera frame and one action enter both models. The question is the same for each: what does the scene look like after this action?',
  'The pixel family first compresses. The frame becomes a grid of positions, far fewer than its pixels, built so that a decoder can redraw every pixel from it.',
  'A large transformer starts the next grid as random noise and cleans it over many passes, steered by the current grid and the action. Each tick is one pass over every position.',
  'The decoder turns the finished grid into the next frame. The block had to be right. The glint on the cup and the texture of the table had to be painted too, right or wrong.',
  'The latent family encodes the frame into a latent, predicts the next latent in one pass, and is trained on the difference from the latent of the frame that really came next. No image comes out, and the encoder may drop the glint and the texture.',
  'The same job, timed by the V-JEPA 2 authors on one RTX 4090: planning one action took 16 seconds in latent space and 4 minutes with a video model.',
];

function Frame({ id, frame, x, y, w, h, filter }: { id: string; frame: number; x: number; y: number; w: number; h: number; filter?: string }) {
  return (
    <g>
      <Crop id={id} frame={frame} x={x} y={y} w={w} h={h} fy={VIEW_43.fy} fh={VIEW_43.fh} filter={filter} />
      <path d={box(x, y, w, h)} fill="none" stroke={FRAME_STROKE} strokeWidth="1.5" />
    </g>
  );
}

/** The action glyph: one bar per joint target. */
function ActionBars({ x, y }: { x: number; y: number }) {
  const heights = [22, 34, 14, 28, 18, 30];
  return (
    <g>
      {heights.map((hgt, i) => (
        <path key={i} d={box(x + i * 13, y + 36 - hgt, 9, hgt)} fill="#fff4e0" stroke={FRAME_STROKE} strokeWidth="1.2" />
      ))}
      <line x1={x - 3} y1={y + 36} x2={x + 77} y2={y + 36} stroke={FRAME_STROKE} strokeWidth="1.2" />
    </g>
  );
}

/** Outlines of the three regions on a 4:3 frame painted at (x, y). */
function Outlines({ x, y, w, h, latent }: { x: number; y: number; w: number; h: number; latent?: boolean }) {
  return (
    <g>
      {REGIONS.map((r) => {
        const rx = x + r.u0 * w;
        const ry = y + ((r.v0 - VIEW_43.fy) / VIEW_43.fh) * h;
        const rw = (r.u1 - r.u0) * w;
        const rh = ((r.v1 - r.v0) / VIEW_43.fh) * h;
        const dash = latent && !r.kept ? '4 3' : undefined;
        return (
          <g key={r.key}>
            <path d={box(rx, ry, rw, rh)} fill="none" stroke="#ffffff" strokeWidth="4.5" />
            <path d={box(rx, ry, rw, rh)} fill="none" stroke={r.color} strokeWidth="2.4" strokeDasharray={dash} />
          </g>
        );
      })}
    </g>
  );
}

/** The legend for the outlines, one row per region. */
function Legend({ x, y, gap, latent }: { x: number; y: number; gap: number; latent?: boolean }) {
  return (
    <g>
      {REGIONS.map((r, i) => (
        <g key={r.key}>
          <path d={box(x, y + i * gap - 10, 16, 11)} fill="none" stroke={r.color} strokeWidth="2.4" strokeDasharray={latent && !r.kept ? '4 3' : undefined} />
          <T x={x + 24} y={y + i * gap}>
            {latent ? r.latent : r.pixel}
          </T>
        </g>
      ))}
    </g>
  );
}

/** The next frame at falling noise levels, left to right. */
function Film({ x, y, w, h, gap, levels }: { x: number; y: number; w: number; h: number; gap: number; levels: number[] }) {
  return (
    <g>
      {levels.map((lv, i) => (
        <Frame key={lv} id={`wmf-film-${i}`} frame={NEXT} x={x + i * (w + gap)} y={y} w={w} h={h} filter={lv > 0 ? `url(#wmf-noise-${i})` : undefined} />
      ))}
    </g>
  );
}

/** One tick per denoising pass. */
function PassTicks({ x, y, w, on }: { x: number; y: number; w: number; on: boolean }) {
  const pitch = w / PASSES;
  return (
    <g>
      {Array.from({ length: PASSES }, (_, i) => (
        <path key={i} d={box(x + i * pitch, y, Math.max(3, pitch - 3.4), 14)} fill={on ? MUTED : '#ffffff'} stroke={MUTED} strokeWidth="1" />
      ))}
    </g>
  );
}

/** The difference between two latents, one bar per cell. */
function GapBars({ x, y, cell }: { x: number; y: number; cell: number }) {
  return (
    <g>
      {Z_GAP.map((d, i) => (
        <path key={i} d={box(x + i * cell + 3, y, cell - 6, Math.max(2, Math.abs(d) * 130))} fill={ORANGE} />
      ))}
    </g>
  );
}

/** The frame with only its strongly coloured bodies left: arm, block and cup. */
function Ghost({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <path d={box(x, y, w, h)} fill="#f4f6f9" />
      <Crop id="wmf-ghost" frame={NEXT} x={x} y={y} w={w} h={h} fy={VIEW_43.fy} fh={VIEW_43.fh} filter="url(#wmf-keep)" opacity={0.7} />
      <path d={box(x, y, w, h)} fill="none" stroke={LINE} strokeWidth="1.5" strokeDasharray="6 4" />
      <Outlines x={x} y={y} w={w} h={h} latent />
    </g>
  );
}

function Encoder({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={GPU_FILL} stroke={GPU_INK} strokeWidth="1.5" />
      <T x={x + w / 2} y={y + h / 2 + 5} anchor="middle" bold size={15}>
        E
      </T>
    </g>
  );
}

interface LayoutProps {
  s: number;
  dim: (from: number) => CSSProperties;
  grow: (from: number, ms: number, origin: number) => CSSProperties;
}

function TimeAxis({ x0, perMin, y }: { x0: number; perMin: number; y: number }) {
  return (
    <g>
      <line x1={x0} y1={y} x2={x0 + 4 * perMin} y2={y} stroke={MUTED} strokeWidth="1.5" />
      <g aria-hidden="true">
        {[0, 1, 2, 3, 4].map((m) => (
          <g key={m}>
            <line x1={x0 + m * perMin} y1={y} x2={x0 + m * perMin} y2={y + 5} stroke={MUTED} strokeWidth="1.5" />
            <T x={x0 + m * perMin} y={y + 20} anchor="middle">
              {m}
            </T>
          </g>
        ))}
      </g>
      <T x={x0 + 2 * perMin} y={y + 40} anchor="middle">
        minutes per planned action
      </T>
    </g>
  );
}

function Wide({ s, dim, grow }: LayoutProps) {
  const perMin = 212.5;
  const bx = 250;
  return (
    <g>
      {/* the shared input */}
      <T x={466} y={76} anchor="end" bold size={14}>
        the camera frame now
      </T>
      <T x={466} y={96} anchor="end" size={14}>
        frame <Sym b="x" s="k" />
      </T>
      <Frame id="wmf-now" frame={NOW} x={478} y={30} w={140} h={105} />
      <ActionBars x={640} y={62} />
      <T x={732} y={76} bold size={14}>
        the action
      </T>
      <T x={732} y={96} size={14}>
        six joint targets, <Sym b="a" s="k" />
      </T>
      <path d="M548 139V154M315 154H925" fill="none" stroke={MUTED} strokeWidth="1.6" />
      <Arrow x1={315} y1={154} x2={315} y2={174} />
      <Arrow x1={925} y1={154} x2={925} y2={174} />

      {/* pixel family */}
      <rect x="20" y="176" width="590" height="364" rx="10" fill={PANEL} stroke={LINE} strokeWidth="1.2" />
      <T x={36} y={204} bold size={15}>
        Pixel family: generate the next frame
      </T>
      <g style={dim(2)}>
        <T x={36} y={228} bold>
          compress
        </T>
        <Frame id="wmf-grid" frame={NOW} x={36} y={236} w={160} h={120} />
        <path d={gridPath(36, 236, 160, 120, 20, 15)} fill="none" stroke="#ffffff" strokeWidth="0.9" opacity={s >= 2 ? 0.95 : 0} />
        <T x={36} y={376} num="derived">
          a grid of positions, 20 by 15 (our arithmetic)
        </T>
      </g>
      <g style={dim(3)}>
        <Arrow x1={199} y1={269} x2={220} y2={269} />
        <T x={222} y={228} bold>
          denoise: noise becomes the next frame
        </T>
        <Film x={222} y={236} w={88} h={66} gap={6} levels={[1, 0.7, 0.38, 0]} />
        <PassTicks x={222} y={314} w={370} on={s >= 3} />
        <T x={222} y={348}>
          35 denoising passes (Cosmos 3 model card examples)
        </T>
      </g>
      <g style={dim(4)}>
        <T x={36} y={400} bold>
          decode: the next frame, every pixel
        </T>
        <Frame id="wmf-out" frame={NEXT} x={36} y={408} w={160} h={120} />
        <Outlines x={36} y={408} w={160} h={120} />
        <T x={214} y={430}>
          what the model has to paint:
        </T>
        <Legend x={214} y={458} gap={24} />
      </g>

      {/* latent family */}
      <rect x="630" y="176" width="590" height="364" rx="10" fill={PANEL} stroke={LINE} strokeWidth="1.2" />
      <T x={646} y={204} bold size={15}>
        Latent family: predict the next latent
      </T>
      <g style={dim(5)}>
        <T x={686} y={230} anchor="middle">
          <Sym b="x" s="k" />
        </T>
        <Frame id="wmf-lnow" frame={NOW} x={646} y={236} w={80} h={60} />
        <Arrow x1={728} y1={266} x2={741} y2={266} />
        <Encoder x={742} y={236} w={46} h={60} />
        <Arrow x1={789} y1={266} x2={805} y2={266} />
        <T x={862} y={251} anchor="middle">
          <Sym b="z" s="k" />
        </T>
        <Latent x={806} y={259} values={Z_NOW} cell={14} />
        <Arrow x1={919} y1={266} x2={939} y2={266} />
        <T x={995} y={226} anchor="middle">
          action <Sym b="a" s="k" />
        </T>
        <Arrow x1={995} y1={231} x2={995} y2={243} />
        <rect x="940" y="244" width="110" height="46" rx="6" fill={GPU_FILL} stroke={GPU_INK} strokeWidth="1.5" />
        <T x={995} y={263} anchor="middle" bold>
          predictor
        </T>
        <T x={995} y={281} anchor="middle">
          one pass
        </T>
        <Arrow x1={1051} y1={266} x2={1069} y2={266} />
        <T x={1126} y={251} anchor="middle">
          predicted <Sym b={'ẑ'} s="k+1" />
        </T>
        <Latent x={1070} y={259} values={Z_HAT} cell={14} />
        <GapBars x={1070} y={280} cell={14} />
        <T x={1060} y={312} anchor="end">
          difference per cell: what training makes small
        </T>
        <T x={686} y={330} anchor="middle">
          <Sym b="x" s="k+1" />
        </T>
        <Frame id="wmf-lnext" frame={NEXT} x={646} y={336} w={80} h={60} />
        <Arrow x1={728} y1={366} x2={741} y2={366} />
        <Encoder x={742} y={336} w={46} h={60} />
        <Arrow x1={789} y1={366} x2={1069} y2={366} />
        <T x={929} y={358} anchor="middle">
          same encoder, the real next frame
        </T>
        <Latent x={1070} y={359} values={Z_TRUE} cell={14} />
        <T x={1126} y={392} anchor="middle">
          target <Sym b="z" s="k+1" />
        </T>
        <T x={824} y={432} bold>
          no image comes out
        </T>
        <Ghost x={646} y={408} w={160} h={120} />
        <Legend x={824} y={456} gap={22} latent />
        <T x={824} y={520} fill={MUTED} size={12.5}>
          An illustration of what a latent may keep, not a decoded latent.
        </T>
      </g>

      {/* the number */}
      <g style={dim(6)}>
        <T x={20} y={574} bold size={15}>
          Time to plan one action on one RTX 4090, as the V-JEPA 2 authors report it
        </T>
        <T x={240} y={606} anchor="end">
          pixel family, a video model
        </T>
        <path d={box(bx, 592, 4 * perMin, 20)} fill={MUTED} style={grow(6, 1500, bx)} />
        <T x={bx + 4 * perMin + 8} y={607} bold>
          4 minutes
        </T>
        <T x={240} y={638} anchor="end">
          latent family, V-JEPA 2
        </T>
        <path d={box(bx, 624, (16 / 60) * perMin, 20)} fill={EMPHASIS} style={grow(6, 100, bx)} />
        <T x={bx + (16 / 60) * perMin + 8} y={639}>
          <tspan fontWeight="bold">16 seconds</tspan>, with ten times the candidates per round
        </T>
        <TimeAxis x0={bx} perMin={perMin} y={654} />
      </g>
    </g>
  );
}

function Narrow({ s, dim, grow }: LayoutProps) {
  const perMin = 76;
  const bx = 20;
  return (
    <g>
      {/* the shared input */}
      <Frame id="wmf-now" frame={NOW} x={16} y={16} w={148} h={111} />
      <T x={176} y={36} bold>
        the camera frame
      </T>
      <T x={176} y={54}>
        now, frame <Sym b="x" s="k" />
      </T>
      <ActionBars x={179} y={64} />
      <T x={268} y={86} bold>
        the action
      </T>
      <T x={176} y={122}>
        six joint targets, <Sym b="a" s="k" />
      </T>
      <Arrow x1={90} y1={129} x2={90} y2={146} />

      {/* pixel family */}
      <rect x="6" y="148" width="348" height="552" rx="10" fill={PANEL} stroke={LINE} strokeWidth="1.2" />
      <T x={18} y={174} bold size={14}>
        Pixel family: generate the next frame
      </T>
      <g style={dim(2)}>
        <Frame id="wmf-grid" frame={NOW} x={18} y={186} w={160} h={120} />
        <path d={gridPath(18, 186, 160, 120, 20, 15)} fill="none" stroke="#ffffff" strokeWidth="0.9" opacity={s >= 2 ? 0.95 : 0} />
        <T x={190} y={206} bold>
          compress
        </T>
        <T x={190} y={226}>
          a grid of positions,
        </T>
        <T x={190} y={244} num="derived">
          20 by 15
        </T>
        <T x={190} y={262}>
          (our arithmetic)
        </T>
      </g>
      <g style={dim(3)}>
        <T x={18} y={332} bold>
          denoise: noise becomes the next frame
        </T>
        <Film x={18} y={342} w={104} h={78} gap={6} levels={[1, 0.55, 0]} />
        <PassTicks x={18} y={430} w={324} on={s >= 3} />
        <T x={18} y={464}>
          35 denoising passes
        </T>
        <T x={18} y={482}>
          (Cosmos 3 model card examples)
        </T>
      </g>
      <g style={dim(4)}>
        <Frame id="wmf-out" frame={NEXT} x={18} y={498} w={160} h={120} />
        <Outlines x={18} y={498} w={160} h={120} />
        <T x={190} y={518} bold>
          decode
        </T>
        <T x={190} y={538}>
          the next frame,
        </T>
        <T x={190} y={556}>
          every pixel
        </T>
        <Legend x={18} y={642} gap={21} />
      </g>

      {/* latent family */}
      <rect x="6" y="736" width="348" height="606" rx="10" fill={PANEL} stroke={LINE} strokeWidth="1.2" />
      <T x={18} y={762} bold size={14}>
        Latent family: predict the next latent
      </T>
      <g style={dim(5)}>
        <T x={58} y={786} anchor="middle">
          <Sym b="x" s="k" />
        </T>
        <Frame id="wmf-lnow" frame={NOW} x={18} y={792} w={80} h={60} />
        <Arrow x1={100} y1={822} x2={113} y2={822} />
        <Encoder x={114} y={792} w={40} h={60} />
        <Arrow x1={155} y1={822} x2={175} y2={822} />
        <T x={232} y={806} anchor="middle">
          <Sym b="z" s="k" />
        </T>
        <Latent x={176} y={815} values={Z_NOW} cell={14} />
        <Arrow x1={232} y1={831} x2={232} y2={865} />
        <T x={166} y={890} anchor="end">
          action <Sym b="a" s="k" />
        </T>
        <Arrow x1={170} y1={886} x2={185} y2={886} />
        <rect x="186" y="866" width="150" height="40" rx="6" fill={GPU_FILL} stroke={GPU_INK} strokeWidth="1.5" />
        <T x={261} y={891} anchor="middle">
          <tspan fontWeight="bold">predictor</tspan>, one pass
        </T>
        <Arrow x1={232} y1={907} x2={232} y2={941} />
        <T x={166} y={954} anchor="end">
          predicted <Sym b={'ẑ'} s="k+1" />
        </T>
        <Latent x={176} y={943} values={Z_HAT} cell={14} />
        <GapBars x={176} y={964} cell={14} />
        <T x={166} y={980} anchor="end">
          difference per cell:
        </T>
        <T x={166} y={998} anchor="end">
          training makes it small
        </T>
        <T x={58} y={1022} anchor="middle">
          <Sym b="x" s="k+1" />
        </T>
        <Frame id="wmf-lnext" frame={NEXT} x={18} y={1028} w={80} h={60} />
        <Arrow x1={100} y1={1058} x2={113} y2={1058} />
        <Encoder x={114} y={1028} w={40} h={60} />
        <Arrow x1={155} y1={1058} x2={175} y2={1058} />
        <Latent x={176} y={1051} values={Z_TRUE} cell={14} />
        <T x={176} y={1042}>
          the real next frame
        </T>
        <T x={176} y={1084}>
          target <Sym b="z" s="k+1" />
        </T>
        <Ghost x={18} y={1104} w={160} h={120} />
        <T x={190} y={1126} bold>
          no image
        </T>
        <T x={190} y={1144} bold>
          comes out
        </T>
        <Legend x={18} y={1246} gap={21} latent />
        <T x={18} y={1312} fill={MUTED} size={12.5}>
          An illustration of what a latent may keep,
        </T>
        <T x={18} y={1329} fill={MUTED} size={12.5}>
          not a decoded latent.
        </T>
      </g>

      {/* the number */}
      <g style={dim(6)}>
        <T x={bx} y={1372} bold size={14}>
          Time to plan one action, one RTX 4090
        </T>
        <T x={bx} y={1390}>
          as the V-JEPA 2 authors report it
        </T>
        <T x={bx} y={1418}>
          pixel family, a video model: <tspan fontWeight="bold">4 minutes</tspan>
        </T>
        <path d={box(bx, 1426, 4 * perMin, 18)} fill={MUTED} style={grow(6, 1500, bx)} />
        <T x={bx} y={1468}>
          latent family, V-JEPA 2: <tspan fontWeight="bold">16 seconds</tspan>
        </T>
        <path d={box(bx, 1476, (16 / 60) * perMin, 18)} fill={EMPHASIS} style={grow(6, 100, bx)} />
        <T x={bx + 30} y={1490}>
          with ten times the candidates per round
        </T>
        <TimeAxis x0={bx} perMin={perMin} y={1506} />
      </g>
    </g>
  );
}

export function WmFamilies({ step, reduced }: { step: number; reduced: boolean }) {
  const narrow = useNarrow();
  const s = step + 1;
  const fade = reduced ? 'none' : 'opacity 400ms ease';
  const dim = (from: number): CSSProperties => ({ opacity: s >= from ? 1 : 0.14, transition: fade });
  const grow = (from: number, ms: number, origin: number): CSSProperties => ({
    transform: s >= from ? 'scaleX(1)' : 'scaleX(0)',
    transformOrigin: `${origin}px 0px`,
    transition: reduced ? 'none' : `transform ${ms}ms linear`,
  });
  const W = narrow ? 360 : 1240;
  const H = narrow ? 1556 : 706;
  const levels = narrow ? [1, 0.55, 0] : [1, 0.7, 0.38, 0];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="world-models-families-title" style={{ width: '100%', height: 'auto' }}>
      <title id="world-models-families-title">What each family of world model has to get right, drawn on one camera frame of the arm</title>
      <desc>
        One camera frame of the arm over the block and one action enter two models. The pixel family cuts the frame
        into a grid of positions, cleans noise into the next frame over 35 passes and has to paint the block, the
        glint on the cup and the table texture. The latent family encodes the frame, predicts the next latent in one
        pass and compares it with the latent of the real next frame; no image comes out, and the glint and the
        texture may be dropped. Two bars give the time to plan one action on one RTX 4090: 4 minutes with a video
        model, 16 seconds in latent space.
      </desc>
      <defs>
        {levels.map((lv, i) => (
          <filter key={lv} id={`wmf-noise-${i}`} x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed={i + 3} result="t" />
            <feColorMatrix in="t" type="matrix" values={`1.7 0 0 0 -0.35  0 1.7 0 0 -0.35  0 0 1.7 0 -0.35  0 0 0 0 ${lv}`} result="n" />
            <feComposite in="n" in2="SourceGraphic" operator="over" />
          </filter>
        ))}
        <filter id="wmf-keep" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  7 0 -7 0 -1.4" result="warm" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -7 0 7 0 -1.4" result="cool" />
          <feMerge>
            <feMergeNode in="warm" />
            <feMergeNode in="cool" />
          </feMerge>
        </filter>
      </defs>
      <rect x="0" y="0" width={W} height={H} fill={PAPER} />
      {narrow ? <Narrow s={s} dim={dim} grow={grow} /> : <Wide s={s} dim={dim} grow={grow} />}
    </svg>
  );
}
