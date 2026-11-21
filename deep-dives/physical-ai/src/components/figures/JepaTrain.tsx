import type { CSSProperties } from 'react';
import { Arrow, Crop, EMPHASIS, GPU_FILL, GPU_INK, INK, LINE, MUTED, ORANGE, PANEL, PAPER, Sym, T, blue, box, gridPath, rnd, useNarrow } from './WmJepaKit';

/**
 * Section 7: one JEPA training step. A clip of the arm is cut into tubelets and a block of them
 * is hidden. The context encoder sees the clip with the hole, the target encoder sees all of it,
 * the predictor fills the hole in latent space, and the loss compares guess and answer at the
 * hidden positions. The gradient changes the predictor and the context encoder; the target
 * encoder only follows, by a moving average.
 */

const THETA = 'θ';
const THETA_BAR = 'θ̄';
const PHI = 'φ';
const DELTA = 'Δ';

const ROBOT_INK = '#7a5c00';
const NEUTRAL_FILL = '#eef0f2';
/** The face is drawn 8 by 8 so the cells stay legible; the real grid is 16 by 16 per frame. */
const N = 8;
const HOLE = { c0: 2, c1: 7, r0: 1, r1: 6 };
const hidden = (c: number, r: number) => c >= HOLE.c0 && c <= HOLE.c1 && r >= HOLE.r0 && r <= HOLE.r1;

/** Toy latents of the worked example in the text above the figure. */
const GUESS = [1, 3, 0, 2];
const ANSWER = [2, 3, 1, 0];

export const JEPA_TRAIN_STEPS: string[] = [
  'A clip is cut into tubelets and a block of them is masked. The hatched block is hidden, and it runs through every frame of the clip.',
  'The context encoder (weights theta) receives the clip with the hole in it and outputs one latent for each visible tubelet.',
  'The target encoder (weights theta-bar), a slowly moving copy of the context encoder, receives the whole clip and outputs a latent for every tubelet, hidden ones included.',
  'The predictor (weights phi) takes the context latents plus one mask token per hidden position, and outputs a guess for each hidden position. It fills the hole in latent space.',
  'The loss compares guess and answer at the hidden positions only: subtract number by number, drop the signs, average. The toy values are the ones worked in the text. No pixel is drawn anywhere.',
  'Gradients flow back from the loss through the predictor and the context encoder, and the optimiser changes phi and theta. The stop-gradient blocks the path into the target encoder.',
  'After the optimiser step, every target weight moves 0.075% of the way toward the matching context-encoder weight. That is the EMA update, and it is the only way theta-bar changes.',
];

function holeBox(x: number, y: number, cell: number): string {
  return box(x + HOLE.c0 * cell, y + HOLE.r0 * cell, (HOLE.c1 - HOLE.c0 + 1) * cell, (HOLE.r1 - HOLE.r0 + 1) * cell);
}

/** The clip as a small lattice of tubelets, with the hidden block hatched. */
function ClipLattice({ x, y, cell }: { x: number; y: number; cell: number }) {
  const S = N * cell;
  const dx = 6;
  const dy = 5;
  const layers = 3;
  return (
    <g>
      {[3, 2, 1].map((k) => (
        <path key={k} d={box(x + k * dx, y - k * dy, S, S)} fill="#f5ebc2" stroke={ROBOT_INK} strokeWidth="0.9" />
      ))}
      <Crop id="jepa-train-clip" frame={0} x={x} y={y} w={S} h={S} />
      <path d={gridPath(x, y, S, S, N, N)} fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.85" />
      <path d={holeBox(x, y, cell)} fill="#5f6b7a" fillOpacity="0.55" />
      <path d={holeBox(x, y, cell)} fill="url(#jepa-train-hatch)" stroke={INK} strokeWidth="1.4" />
      <path d={box(x, y, S, S)} fill="none" stroke={ROBOT_INK} strokeWidth="1.2" />
      <path d={`M${x + S} ${y + S}l${layers * dx} ${-layers * dy}`} fill="none" stroke={ROBOT_INK} strokeWidth="0.9" />
    </g>
  );
}

type PanelMode = 'context-in' | 'full-in' | 'context-latents' | 'predicted' | 'target';

/** One latent drawn in a cell: three bands, each shaded by a value. */
function latentCell(x: number, y: number, cell: number, seed: number, salt: number, wobble: number) {
  const band = cell / 3;
  return [0, 1, 2].map((j) => {
    const v = rnd(seed * 3 + j, 41) + wobble * (rnd(seed * 3 + j, salt) - 0.5);
    return <path key={`${seed}-${j}`} d={box(x, y + j * band, cell, band)} fill={blue(v)} />;
  });
}

/** A face of the lattice, as tubelets going in or as latents coming out. */
function TokenPanel({ x, y, cell, mode, id }: { x: number; y: number; cell: number; mode: PanelMode; id: string }) {
  const S = N * cell;
  const cells = [];
  for (let r = 0; r < N; r += 1) {
    for (let c = 0; c < N; c += 1) {
      const hid = hidden(c, r);
      const draw = mode === 'target' || (mode === 'context-latents' && !hid) || (mode === 'predicted' && hid);
      if (draw) cells.push(<g key={`${c}-${r}`}>{latentCell(x + c * cell, y + r * cell, cell, r * N + c, mode === 'predicted' ? 57 : 41, mode === 'predicted' ? 0.5 : 0)}</g>);
    }
  }
  const image = mode === 'context-in' || mode === 'full-in';
  return (
    <g>
      <path d={box(x, y, S, S)} fill="#ffffff" />
      {image && <Crop id={id} frame={0} x={x} y={y} w={S} h={S} />}
      {cells}
      {mode === 'context-in' && <path d={holeBox(x, y, cell)} fill="#ffffff" />}
      <path d={gridPath(x, y, S, S, N, N)} fill="none" stroke={image ? '#ffffff' : '#c3ccd8'} strokeWidth="0.7" opacity={image ? 0.85 : 1} />
      {mode === 'context-in' && <path d={holeBox(x, y, cell)} fill="#ffffff" stroke={MUTED} strokeWidth="1.2" strokeDasharray="4 3" />}
      {mode === 'context-latents' && <path d={holeBox(x, y, cell)} fill="#ffffff" stroke={MUTED} strokeWidth="1.2" strokeDasharray="4 3" />}
      {mode === 'predicted' && <path d={holeBox(x, y, cell)} fill="none" stroke={EMPHASIS} strokeWidth="2.4" />}
      {mode === 'target' && <path d={holeBox(x, y, cell)} fill="none" stroke={INK} strokeWidth="2" />}
      <path d={box(x, y, S, S)} fill="none" stroke={image ? ROBOT_INK : '#1f5fa8'} strokeWidth="1.2" />
    </g>
  );
}

function NetBox({ x, y, w, h, title, sym, weights, target, active }: { x: number; y: number; w: number; h: number; title: string; sym: [string, string]; weights: string; target?: boolean; active: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={target ? NEUTRAL_FILL : GPU_FILL} stroke={active ? EMPHASIS : target ? MUTED : GPU_INK} strokeWidth={active ? 2.6 : 1.5} />
      <T x={x + w / 2} y={y + h / 2 - 4} anchor="middle" bold size={12.5}>
        {title} <Sym b={sym[0]} s={sym[1]} />
      </T>
      <T x={x + w / 2} y={y + h / 2 + 14} anchor="middle" size={12.5}>
        {weights}
      </T>
    </g>
  );
}

/** The L1 distance as it is computed, on the toy latents of the text. */
function LossPanel({ x, y, w, h, labelW, cell, active }: { x: number; y: number; w: number; h: number; labelW: number; cell: number; active: boolean }) {
  const cx = x + 12 + labelW;
  const rowH = 26;
  const diffs = GUESS.map((g, i) => Math.abs(g - ANSWER[i]));
  const base = y + 152;
  const strip = (values: number[], ry: number, stroke: string) => (
    <g>
      {values.map((v, i) => (
        <g key={i}>
          <path d={box(cx + i * cell, ry, cell, rowH)} fill={blue(v / 4)} stroke="#ffffff" strokeWidth="0.8" />
          <T x={cx + i * cell + cell / 2} y={ry + 18} anchor="middle" num="toy" fill={v >= 3 ? '#ffffff' : INK}>
            {v}
          </T>
        </g>
      ))}
      <path d={box(cx, ry, cell * values.length, rowH)} fill="none" stroke={stroke} strokeWidth="1.8" />
    </g>
  );
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={PANEL} stroke={active ? EMPHASIS : LINE} strokeWidth={active ? 2.6 : 1.2} />
      <T x={x + 12} y={y + 24} bold>
        loss at a hidden position
      </T>
      <T x={x + 12} y={y + 41} fill={MUTED}>
        toy values, an illustration
      </T>
      <T x={x + 12} y={y + 72}>
        guess
      </T>
      {strip(GUESS, y + 54, EMPHASIS)}
      <T x={x + 12} y={y + 106}>
        answer
      </T>
      {strip(ANSWER, y + 88, INK)}
      <T x={x + 12} y={base}>
        difference
      </T>
      {diffs.map((d, i) => (
        <g key={i}>
          <path d={box(cx + i * cell + 5, base - Math.max(1.5, d * 11), cell - 10, Math.max(1.5, d * 11))} fill={ORANGE} />
          <T x={cx + i * cell + cell / 2} y={base + 17} anchor="middle" num="toy">
            {d}
          </T>
        </g>
      ))}
      <line x1={cx} y1={base} x2={cx + cell * 4} y2={base} stroke={MUTED} strokeWidth="1" />
      <T x={x + 12} y={base + 42} bold num="toy">
        sum 4, mean 4 / 4 = 1
      </T>
    </g>
  );
}

/** Theta-bar chasing theta: one step of the moving average, drawn far larger than it is. */
function EmaInset({ x, y, w, lines }: { x: number; y: number; w: number; lines: string[] }) {
  const x0 = x + 10;
  const x1 = x + w - 10;
  const hop = 34;
  return (
    <g>
      <T x={x} y={y} bold fill={EMPHASIS}>
        EMA, after every step
      </T>
      <line x1={x0} y1={y + 26} x2={x1} y2={y + 26} stroke={LINE} strokeWidth="1.5" />
      <circle cx={x0} cy={y + 26} r="6" fill="#ffffff" stroke={MUTED} strokeWidth="1.5" strokeDasharray="3 2" />
      <Arrow x1={x0 + 7} y1={y + 26} x2={x0 + hop - 7} y2={y + 26} color={EMPHASIS} width={2.4} />
      <circle cx={x0 + hop} cy={y + 26} r="6" fill={MUTED} stroke={EMPHASIS} strokeWidth="2" />
      <circle cx={x1} cy={y + 26} r="6" fill={GPU_INK} />
      <T x={x0 + hop / 2} y={y + 50} anchor="middle">
        {THETA_BAR}
      </T>
      <T x={x1} y={y + 50} anchor="middle">
        {THETA}
      </T>
      {lines.map((line, i) => (
        <T key={line} x={x} y={y + 72 + i * 17}>
          {line}
        </T>
      ))}
    </g>
  );
}

interface LayoutProps {
  s: number;
  seen: (from: number) => CSSProperties;
  show: (on: boolean) => CSSProperties;
}

function Wide({ s, seen, show }: LayoutProps) {
  return (
    <g>
      {/* the clip */}
      <T x={24} y={206} bold>
        the clip as tubelets
      </T>
      <ClipLattice x={30} y={236} cell={14} />
      <T x={24} y={372}>
        hatched: hidden,
      </T>
      <T x={24} y={389}>
        in every frame
      </T>
      <path d="M166 276H198V130H222" fill="none" stroke={MUTED} strokeWidth="1.6" style={seen(2)} />
      <Arrow x1={212} y1={130} x2={229} y2={130} style={seen(2)} />
      <path d="M166 300H198V468H222" fill="none" stroke={MUTED} strokeWidth="1.6" style={seen(3)} />
      <Arrow x1={212} y1={468} x2={229} y2={468} style={seen(3)} />

      {/* context branch */}
      <g style={seen(2)}>
        <T x={278} y={70} anchor="middle">
          x: visible tubelets
        </T>
        <TokenPanel id="jepa-train-cin" x={230} y={82} cell={12} mode="context-in" />
        <Arrow x1={328} y1={130} x2={369} y2={130} />
        <NetBox x={370} y={100} w={160} h={60} title="context encoder" sym={['E', THETA]} weights={`weights ${THETA} (theta)`} active={s === 2} />
        <Arrow x1={531} y1={130} x2={569} y2={130} />
        <T x={618} y={70} anchor="middle">
          context latents
        </T>
        <TokenPanel id="jepa-train-clat" x={570} y={82} cell={12} mode="context-latents" />
      </g>

      {/* predictor */}
      <g style={seen(4)}>
        <Arrow x1={668} y1={130} x2={709} y2={130} />
        <T x={790} y={70} anchor="middle">
          + mask tokens <Sym b={DELTA} s="y" />
        </T>
        <Arrow x1={790} y1={78} x2={790} y2={99} />
        <NetBox x={710} y={100} w={160} h={60} title="predictor" sym={['P', PHI]} weights={`weights ${PHI} (phi)`} active={s === 4} />
        <Arrow x1={871} y1={130} x2={909} y2={130} />
        <T x={958} y={70} anchor="middle">
          predicted latents
        </T>
        <TokenPanel id="jepa-train-pred" x={910} y={82} cell={12} mode="predicted" />
      </g>

      {/* target branch */}
      <g style={seen(3)}>
        <T x={278} y={408} anchor="middle">
          y: the whole clip
        </T>
        <TokenPanel id="jepa-train-tin" x={230} y={420} cell={12} mode="full-in" />
        <Arrow x1={328} y1={468} x2={369} y2={468} />
        <NetBox x={370} y={438} w={160} h={60} title="target encoder" sym={['E', THETA_BAR]} weights={`weights ${THETA_BAR} (theta-bar)`} target active={s === 3} />
        <Arrow x1={531} y1={468} x2={909} y2={468} />
        <T x={958} y={408} anchor="middle">
          target latents
        </T>
        <TokenPanel id="jepa-train-tgt" x={910} y={420} cell={12} mode="target" />
      </g>

      {/* loss */}
      <g style={seen(5)}>
        <path d="M1008 130H1120V176" fill="none" stroke={MUTED} strokeWidth="1.6" />
        <Arrow x1={1120} y1={170} x2={1120} y2={189} />
        <path d="M1008 468H1120V420" fill="none" stroke={MUTED} strokeWidth="1.6" />
        <Arrow x1={1120} y1={424} x2={1120} y2={407} />
        <LossPanel x={1020} y={190} w={204} h={216} labelW={72} cell={27} active={s === 5} />
      </g>

      {/* gradient path and stop-gradient */}
      <g style={show(s >= 6)}>
        <path d="M1020 232H450" fill="none" stroke={EMPHASIS} strokeWidth="3" />
        <Arrow x1={790} y1={232} x2={790} y2={161} color={EMPHASIS} width={3} />
        <Arrow x1={450} y1={233.5} x2={450} y2={161} color={EMPHASIS} width={3} />
        <T x={620} y={252} anchor="middle" fill={EMPHASIS}>
          gradient: the loss changes {PHI} and {THETA}
        </T>
        <path d={box(1052, 451, 8, 34)} fill={INK} />
        <T x={1056} y={512} anchor="middle" bold>
          stop-gradient
        </T>
        <T x={1056} y={530} anchor="middle">
          no gradient reaches {THETA_BAR}
        </T>
      </g>

      {/* EMA update */}
      <g style={show(s >= 7)}>
        <Arrow x1={410} y1={161} x2={410} y2={437} color={EMPHASIS} width={3} />
        <EmaInset x={436} y={290} w={250} lines={[`${THETA_BAR} moves 0.075% of the gap to ${THETA}`, '(the step is drawn far larger)']} />
      </g>
    </g>
  );
}

function Narrow({ s, seen, show }: LayoutProps) {
  return (
    <g>
      <T x={16} y={24} bold size={14}>
        One clip, cut into tubelets
      </T>
      <ClipLattice x={112} y={56} cell={15} />
      <T x={262} y={96}>
        hatched:
      </T>
      <T x={262} y={113}>
        hidden,
      </T>
      <T x={262} y={130}>
        in every
      </T>
      <T x={262} y={147}>
        frame
      </T>
      <path d="M172 178V190M95 190H265" fill="none" stroke={MUTED} strokeWidth="1.6" />
      <Arrow x1={95} y1={190} x2={95} y2={204} style={seen(2)} />
      <Arrow x1={265} y1={190} x2={265} y2={204} style={seen(3)} />

      {/* context branch */}
      <g style={seen(2)}>
        <T x={95} y={220} anchor="middle">
          x: visible tubelets
        </T>
        <TokenPanel id="jepa-train-cin" x={55} y={228} cell={10} mode="context-in" />
        <Arrow x1={95} y1={310} x2={95} y2={325} />
        <NetBox x={15} y={326} w={150} h={54} title="context encoder" sym={['E', THETA]} weights={`weights ${THETA} (theta)`} active={s === 2} />
        <Arrow x1={95} y1={381} x2={95} y2={397} />
        <TokenPanel id="jepa-train-clat" x={55} y={398} cell={10} mode="context-latents" />
        <T x={95} y={496} anchor="middle">
          context latents
        </T>
      </g>

      {/* predictor */}
      <g style={seen(4)}>
        <T x={95} y={514} anchor="middle">
          + mask tokens <Sym b={DELTA} s="y" />
        </T>
        <Arrow x1={95} y1={521} x2={95} y2={537} />
        <NetBox x={15} y={538} w={150} h={54} title="predictor" sym={['P', PHI]} weights={`weights ${PHI} (phi)`} active={s === 4} />
        <Arrow x1={95} y1={593} x2={95} y2={609} />
        <TokenPanel id="jepa-train-pred" x={55} y={610} cell={10} mode="predicted" />
        <T x={95} y={708} anchor="middle">
          predicted latents
        </T>
      </g>

      {/* target branch */}
      <g style={seen(3)}>
        <T x={265} y={220} anchor="middle">
          y: the whole clip
        </T>
        <TokenPanel id="jepa-train-tin" x={225} y={228} cell={10} mode="full-in" />
        <Arrow x1={265} y1={310} x2={265} y2={325} />
        <NetBox x={195} y={326} w={150} h={54} title="target encoder" sym={['E', THETA_BAR]} weights={`weights ${THETA_BAR} (theta-bar)`} target active={s === 3} />
        <path d="M335 381V650H316" fill="none" stroke={MUTED} strokeWidth="1.6" />
        <Arrow x1={320} y1={650} x2={306} y2={650} />
        <TokenPanel id="jepa-train-tgt" x={225} y={610} cell={10} mode="target" />
        <T x={265} y={708} anchor="middle">
          target latents
        </T>
      </g>

      {/* loss */}
      <g style={seen(5)}>
        <Arrow x1={95} y1={716} x2={95} y2={755} />
        <Arrow x1={265} y1={716} x2={265} y2={755} />
        <LossPanel x={16} y={756} w={328} h={210} labelW={92} cell={36} active={s === 5} />
      </g>

      {/* gradient path and stop-gradient */}
      <g style={show(s >= 6)}>
        <path d="M16 830H6V353" fill="none" stroke={EMPHASIS} strokeWidth="3" />
        <Arrow x1={4.5} y1={565} x2={15} y2={565} color={EMPHASIS} width={3} />
        <Arrow x1={4.5} y1={353} x2={15} y2={353} color={EMPHASIS} width={3} />
        <path d={box(247, 728, 36, 8)} fill={INK} />
        <T x={240} y={737} anchor="end" bold>
          stop-gradient
        </T>
        <T x={16} y={990} fill={EMPHASIS}>
          blue: the gradient changes {PHI} and {THETA}
        </T>
        <T x={16} y={1008}>
          no gradient reaches {THETA_BAR}
        </T>
      </g>

      {/* EMA update */}
      <g style={show(s >= 7)}>
        <Arrow x1={166} y1={353} x2={194} y2={353} color={EMPHASIS} width={3} />
        <EmaInset x={190} y={412} w={132} lines={[`${THETA_BAR} moves 0.075%`, `of the gap to ${THETA}`, '(drawn far larger)']} />
      </g>
    </g>
  );
}

export function JepaTrain({ step, reduced }: { step: number; reduced: boolean }) {
  const narrow = useNarrow();
  const s = step + 1;
  const fade = reduced ? 'none' : 'opacity 350ms ease';
  const seen = (from: number): CSSProperties => ({ opacity: s >= from ? 1 : 0.18, transition: fade });
  const show = (on: boolean): CSSProperties => ({ opacity: on ? 1 : 0, transition: fade });
  const W = narrow ? 360 : 1240;
  const top = narrow ? 0 : 44;
  const H = narrow ? 1024 : 548;
  return (
    <svg viewBox={`0 ${top} ${W} ${H - top}`} role="img" aria-labelledby="jepa-train-title" style={{ width: '100%', height: 'auto' }}>
      <title id="jepa-train-title">One JEPA training step: two encoders, a predictor, a loss between latents, and which weights change</title>
      <desc>
        A clip of the arm cut into tubelets, with a block of them hatched as hidden, feeds two branches. The context
        encoder sees the clip with the hole and outputs latents for the visible tubelets; the predictor adds mask
        tokens and fills the hole with predicted latents. The target encoder sees the whole clip and gives the target
        latents. A loss panel compares guess and answer at one hidden position with toy values. A blue gradient path
        runs from the loss back into the predictor and the context encoder; a stop-gradient bar blocks the path into
        the target encoder. A blue arrow from the context encoder to the target encoder marks the EMA update, drawn
        as one dot moving a small part of the way toward another.
      </desc>
      <defs>
        <pattern id="jepa-train-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="#ffffff" strokeWidth="2.2" />
        </pattern>
      </defs>
      <rect x="0" y="0" width={W} height={H} fill={PAPER} />
      {narrow ? <Narrow s={s} seen={seen} show={show} /> : <Wide s={s} seen={seen} show={show} />}
    </svg>
  );
}
