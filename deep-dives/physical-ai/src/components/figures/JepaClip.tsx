import { Arrow, Crop, EMPHASIS, GPU_FILL, GPU_INK, Latent, MUTED, PAPER, T, box, gridPath, rnd, useNarrow } from './WmJepaKit';

/**
 * Section 7: one clip of the arm, taken apart. The clip as a stack of sixteen frames, one tubelet
 * pulled out and enlarged, the whole clip as a lattice of tubelets with the count on its edges,
 * and the tokens going through the encoder to come out as latents. One tubelet keeps its blue
 * outline from pixels to vector.
 */

const ROBOT_FILL = '#fff6d6';
const ROBOT_INK = '#7a5c00';
const FRAMES = 16;
const GRID = 16;
const DEEP = 8;
/** The highlighted tubelet: the patch that holds the block in the first still. */
const HI = { col: 7, row: 12 };
/** Which token of the drawn ribbon stands for the highlighted tubelet. */
const HI_TOKEN = 4;
const RIBBON = 12;

/** The six stills are repeated to fill sixteen frames. */
function still(i: number): number {
  return Math.floor((i * 6) / FRAMES);
}

function Heading({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <T x={x} y={y} bold size={15}>
      {children}
    </T>
  );
}

/** A dimension line with end ticks. */
function Dim({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = (-(y2 - y1) / len) * 4;
  const ny = ((x2 - x1) / len) * 4;
  return <path d={`M${x1} ${y1}L${x2} ${y2}M${x1 - nx} ${y1 - ny}L${x1 + nx} ${y1 + ny}M${x2 - nx} ${y2 - ny}L${x2 + nx} ${y2 + ny}`} fill="none" stroke={MUTED} strokeWidth="1.3" />;
}

/** Sixteen frames stacked back and up, the first in front. */
function ClipStack({ x, y, S, dx, dy }: { x: number; y: number; S: number; dx: number; dy: number }) {
  const cell = S / GRID;
  const hx = x + HI.col * cell;
  const hy = y + HI.row * cell;
  return (
    <g>
      {Array.from({ length: FRAMES }, (_, k) => {
        const i = FRAMES - 1 - k;
        const fx = x + i * dx;
        const fy = y - i * dy;
        return (
          <g key={i}>
            <Crop id={`jepa-clip-f${i}`} frame={still(i)} x={fx} y={fy} w={S} h={S} />
            <path d={box(fx, fy, S, S)} fill="none" stroke={ROBOT_INK} strokeWidth="0.9" />
          </g>
        );
      })}
      <path d={box(hx, hy, cell, cell)} fill="none" stroke="#ffffff" strokeWidth="4" />
      <path d={box(hx, hy, cell, cell)} fill="none" stroke={EMPHASIS} strokeWidth="2.4" />
      <Dim x1={x} y1={y + S + 12} x2={x + S} y2={y + S + 12} />
      <T x={x + S / 2} y={y + S + 31} anchor="middle">
        256 pixels
      </T>
      <Dim x1={x - 10} y1={y} x2={x - 10} y2={y + S} />
      <T x={x - 18} y={y + S / 2 - 2} anchor="end">
        256
      </T>
      <T x={x - 18} y={y + S / 2 + 15} anchor="end">
        pixels
      </T>
      <Dim x1={x - 7} y1={y - 8} x2={x - 7 + (FRAMES - 1) * dx} y2={y - 8 - (FRAMES - 1) * dy} />
    </g>
  );
}

/** One tubelet, enlarged: the same 16 by 16 patch in two consecutive frames. */
function TubeletSlab({ x, y, S }: { x: number; y: number; S: number }) {
  const off = Math.round(S * 0.14);
  const crop = { fx: HI.col / GRID, fy: HI.row / GRID, fw: 1 / GRID, fh: 1 / GRID };
  return (
    <g>
      <Crop id="jepa-clip-t1" frame={still(1)} x={x + off} y={y - off} w={S} h={S} {...crop} />
      <path d={box(x + off, y - off, S, S)} fill="none" stroke={EMPHASIS} strokeWidth="2" />
      <Crop id="jepa-clip-t0" frame={still(0)} x={x} y={y} w={S} h={S} {...crop} />
      <path d={gridPath(x, y, S, S, 16, 16)} fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.6" />
      <path d={box(x, y, S, S)} fill="none" stroke={EMPHASIS} strokeWidth="2.6" />
    </g>
  );
}

/** The clip as a lattice of tubelets: 16 by 16 on the face, 8 deep. */
function Lattice({ x, y, S, dx, dy }: { x: number; y: number; S: number; dx: number; dy: number }) {
  const cell = S / GRID;
  const ox = DEEP * dx;
  const oy = DEEP * dy;
  let top = '';
  let side = '';
  for (let i = 1; i < GRID; i += 1) {
    top += `M${x + i * cell} ${y}l${ox} ${-oy}`;
    side += `M${x + S} ${y + i * cell}l${ox} ${-oy}`;
  }
  for (let j = 1; j < DEEP; j += 1) {
    top += `M${x + j * dx} ${y - j * dy}h${S}`;
    side += `M${x + S + j * dx} ${y - j * dy}v${S}`;
  }
  const hx = x + HI.col * cell;
  const hy = y + HI.row * cell;
  return (
    <g>
      <path d={`M${x} ${y}h${S}l${ox} ${-oy}h${-S}Z`} fill="#fffbe9" stroke={ROBOT_INK} strokeWidth="1.2" />
      <path d={`M${x + S} ${y}v${S}l${ox} ${-oy}v${-S}Z`} fill="#f5ebc2" stroke={ROBOT_INK} strokeWidth="1.2" />
      <path d={top} fill="none" stroke={ROBOT_INK} strokeWidth="0.6" opacity="0.75" />
      <path d={side} fill="none" stroke={ROBOT_INK} strokeWidth="0.6" opacity="0.75" />
      <path d={box(x, y, S, S)} fill={ROBOT_FILL} />
      <Crop id="jepa-clip-lat" frame={0} x={x} y={y} w={S} h={S} opacity={0.6} />
      <path d={gridPath(x, y, S, S, GRID, GRID)} fill="none" stroke={ROBOT_INK} strokeWidth="0.6" opacity="0.8" />
      <path d={box(x, y, S, S)} fill="none" stroke={ROBOT_INK} strokeWidth="1.2" />
      <path d={box(hx, hy, cell, cell)} fill={EMPHASIS} fillOpacity="0.35" stroke={EMPHASIS} strokeWidth="2.4" />
    </g>
  );
}

/** Tokens, the encoder, latents: the same ribbon before and after. */
function TokensToLatents({ x, y, w }: { x: number; y: number; w: number }) {
  const cell = 16;
  const ribbonW = RIBBON * cell;
  const hx = x + HI_TOKEN * cell;
  return (
    <g>
      <T x={x} y={y}>
        one token per tubelet:
      </T>
      {Array.from({ length: RIBBON }, (_, i) => (
        <path key={i} d={box(x + i * cell, y + 10, cell, cell)} fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="0.9" />
      ))}
      <path d={box(hx, y + 10, cell, cell)} fill={EMPHASIS} fillOpacity="0.35" stroke={EMPHASIS} strokeWidth="2.4" />
      <T x={x + ribbonW + 8} y={y + 23} num="derived">
        ... 2,048
      </T>
      <Arrow x1={x + ribbonW / 2} y1={y + 30} x2={x + ribbonW / 2} y2={y + 50} />
      <rect x={x} y={y + 52} width={w} height={52} rx="6" fill={GPU_FILL} stroke={GPU_INK} strokeWidth="1.5" />
      <T x={x + w / 2} y={y + 74} anchor="middle" bold>
        encoder: ViT-g
      </T>
      <T x={x + w / 2} y={y + 92} anchor="middle">
        1B parameters, 40 layers
      </T>
      <Arrow x1={x + ribbonW / 2} y1={y + 106} x2={x + ribbonW / 2} y2={y + 126} />
      {Array.from({ length: RIBBON }, (_, i) => (
        <Latent key={i} x={x + i * cell} y={y + 130} values={[0, 1, 2, 3, 4].map((j) => rnd(i * 5 + j, 21))} cell={cell} cellH={14} vertical stroke={i === HI_TOKEN ? EMPHASIS : '#1f5fa8'} strokeWidth={i === HI_TOKEN ? 0 : 0.8} />
      ))}
      <path d={box(hx, y + 130, cell, 70)} fill="none" stroke={EMPHASIS} strokeWidth="2.6" />
      <T x={x + ribbonW + 8} y={y + 170} num="derived">
        ... 2,048
      </T>
      <path d={`M${hx + cell / 2} ${y + 201}V${y + 222}`} fill="none" stroke={EMPHASIS} strokeWidth="1.4" />
      <Latent x={x} y={y + 222} values={Array.from({ length: 10 }, (_, j) => rnd(j, 33))} cell={18} stroke={EMPHASIS} strokeWidth={2.4} />
      <T x={x + 188} y={y + 236}>
        ...
      </T>
      <T x={x} y={y + 262}>
        one latent: a vector of 1408 numbers
      </T>
      <T x={x} y={y + 280} num="derived">
        2,048 latents, one per tubelet
      </T>
    </g>
  );
}

/** Numbers in against numbers out, to one scale. */
const IN_NUMBERS = 16 * 256 * 256 * 3;
const OUT_NUMBERS = 2048 * 1408;

function Wide() {
  const barX = 290;
  const barW = 700;
  return (
    <g>
      <Heading x={24} y={32}>
        The clip
      </Heading>
      <T x={24} y={56}>
        16 frames: 4 seconds of video
      </T>
      <T x={24} y={74}>
        at 4 frames per second
      </T>
      <ClipStack x={70} y={168} S={176} dx={5} dy={4.2} />

      <Heading x={372} y={32}>
        One tubelet
      </Heading>
      <path d="M152.5 305.5L372 232" fill="none" stroke={EMPHASIS} strokeWidth="1.4" />
      <TubeletSlab x={372} y={180} S={104} />
      <T x={372} y={312} bold fill={EMPHASIS}>
        one tubelet
      </T>
      <T x={372} y={331}>
        2 frames x 16 x 16 pixels
      </T>
      <T x={372} y={349} num="derived">
        = 512 pixels, 3 colours each
      </T>

      <Heading x={590} y={32}>
        Every tubelet, counted
      </Heading>
      <Lattice x={606} y={168} S={176} dx={8} dy={6.7} />
      <Dim x1={606} y1={356} x2={782} y2={356} />
      <T x={694} y={375} anchor="middle">
        256 / 16 = 16 across
      </T>
      <Dim x1={596} y1={168} x2={596} y2={344} />
      <T x={588} y={252} anchor="end">
        256 / 16
      </T>
      <T x={588} y={269} anchor="end">
        = 16 down
      </T>
      <Dim x1={792} y1={348} x2={856} y2={294.4} />
      <T x={842} y={336}>
        16 / 2
      </T>
      <T x={842} y={353}>
        = 8 deep
      </T>
      <T x={694} y={402} anchor="middle" bold num="derived">
        8 x 16 x 16 = 2,048 tubelets
      </T>

      <Heading x={930} y={32}>
        Tokens in, latents out
      </Heading>
      <TokensToLatents x={930} y={64} w={286} />

      <line x1="24" y1="428" x2="1216" y2="428" stroke="#d5dbdb" strokeWidth="1" />
      <Heading x={24} y={456}>
        Numbers in, numbers out (calculated)
      </Heading>
      <T x={24} y={488} num="derived">
        in: 16 x 256 x 256 pixels x 3 colours
      </T>
      <path d={box(barX, 474, barW, 20)} fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1.2" />
      <T x={barX + barW + 10} y={489} bold num="derived">
        3.1 million numbers
      </T>
      <T x={24} y={522} num="derived">
        out: 2,048 latents x 1408 numbers
      </T>
      <path d={box(barX, 508, (barW * OUT_NUMBERS) / IN_NUMBERS, 20)} fill="#cfe1f7" stroke="#1f5fa8" strokeWidth="1.2" />
      <T x={barX + (barW * OUT_NUMBERS) / IN_NUMBERS + 10} y={523} bold num="derived">
        2.9 million numbers
      </T>
    </g>
  );
}

function Narrow() {
  const barW = 328;
  return (
    <g>
      <Heading x={16} y={28}>
        The clip
      </Heading>
      <T x={16} y={50}>
        16 frames: 4 seconds of video
      </T>
      <T x={16} y={67}>
        at 4 frames per second
      </T>
      <ClipStack x={58} y={150} S={144} dx={3.6} dy={3.2} />
      <T x={268} y={150} bold fill={EMPHASIS}>
        one tubelet
      </T>
      <path d="M125.5 262.5L268 204" fill="none" stroke={EMPHASIS} strokeWidth="1.4" />
      <TubeletSlab x={268} y={172} S={70} />
      <T x={16} y={350}>
        One tubelet: 2 frames x 16 x 16 pixels
      </T>
      <T x={16} y={368} num="derived">
        = 512 pixels, 3 colours each
      </T>

      <Heading x={16} y={410}>
        Every tubelet, counted
      </Heading>
      <Lattice x={80} y={480} S={160} dx={7} dy={6} />
      <Dim x1={70} y1={480} x2={70} y2={640} />
      <T x={62} y={556} anchor="end">
        256 / 16
      </T>
      <T x={62} y={573} anchor="end">
        = 16 down
      </T>
      <Dim x1={80} y1={652} x2={240} y2={652} />
      <T x={160} y={671} anchor="middle">
        256 / 16 = 16 across
      </T>
      <Dim x1={250} y1={644} x2={306} y2={596} />
      <T x={292} y={634}>
        16 / 2
      </T>
      <T x={292} y={651}>
        = 8 deep
      </T>
      <T x={180} y={698} anchor="middle" bold num="derived">
        8 x 16 x 16 = 2,048 tubelets
      </T>

      <Heading x={16} y={740}>
        Tokens in, latents out
      </Heading>
      <TokensToLatents x={16} y={766} w={328} />

      <Heading x={16} y={1088}>
        Numbers in, numbers out
      </Heading>
      <T x={16} y={1108}>
        (calculated)
      </T>
      <T x={16} y={1134} num="derived">
        in: 16 x 256 x 256 pixels x 3 colours
      </T>
      <path d={box(16, 1142, barW, 18)} fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1.2" />
      <T x={16} y={1178} bold num="derived">
        3.1 million numbers
      </T>
      <T x={16} y={1208} num="derived">
        out: 2,048 latents x 1408 numbers
      </T>
      <path d={box(16, 1216, (barW * OUT_NUMBERS) / IN_NUMBERS, 18)} fill="#cfe1f7" stroke="#1f5fa8" strokeWidth="1.2" />
      <T x={16} y={1252} bold num="derived">
        2.9 million numbers
      </T>
    </g>
  );
}

export function JepaClip() {
  const narrow = useNarrow();
  const W = narrow ? 360 : 1240;
  const H = narrow ? 1270 : 544;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="jepa-shapes-title" style={{ width: '100%', height: 'auto' }}>
      <title id="jepa-shapes-title">A 16-frame clip of the arm taken apart: frames, one tubelet, the lattice of tubelets, tokens and latents</title>
      <desc>
        A clip of 16 frames at 256 by 256 pixels is drawn as a stack of frames. One tubelet, a 16 by 16 pixel square
        two frames deep, is outlined in blue and drawn again enlarged. The clip is then drawn as a lattice of
        tubelets, 16 across, 16 down and 8 deep. Each tubelet becomes one token, the ViT-g encoder turns each token
        into a latent vector of 1408 numbers, and the blue outline follows one tubelet from pixels to vector. Two
        bars compare the count of numbers going in with the count coming out: the second is slightly shorter.
      </desc>
      <rect x="0" y="0" width={W} height={H} fill={PAPER} />
      {narrow ? <Narrow /> : <Wide />}
    </svg>
  );
}
