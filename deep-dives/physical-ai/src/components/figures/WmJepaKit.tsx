import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Shared drawing parts for the concept figures of sections 6 (World Models) and 7 (JEPA).
 *
 * The palette and the narrow-screen switch follow Cluster.tsx and LoopOnAws.tsx, so the dive reads
 * as one system. Three glyphs live here: a frame (a crop of a real MuJoCo capture), a latent (a
 * strip of cells, value mapped to a shade of blue) and a tubelet lattice.
 *
 * Small shapes are drawn as paths, not rects: the diagram check treats every rect as a box that
 * must contain any text centred on it.
 */

export const INK = '#16191f';
export const MUTED = '#5f6b7a';
export const LINE = '#8d99a8';
export const PANEL = '#ffffff';
export const PAPER = '#fbfbfd';
export const ZONE = '#f2f5f9';
export const EMPHASIS = '#0972d3';
export const GPU_FILL = '#e6f6ea';
export const GPU_INK = '#1e7b3a';
export const ORANGE = '#c2410c';
export const PURPLE = '#5b3fa8';
export const FONT = 'sans-serif';

/** The six stills of the scripted MuJoCo episode, side by side, 300 by 300 pixels each. */
const STRIP = './media/so101-episode-strip.jpg';
const STRIP_FRAMES = 6;

/** True on a phone-width screen: the figures draw a separate stacked layout there. */
export function useNarrow(): boolean {
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

/** Path data for an axis-aligned box. */
export function box(x: number, y: number, w: number, h: number): string {
  return `M${x} ${y}h${w}v${h}h${-w}Z`;
}

interface TProps {
  x: number;
  y: number;
  size?: number;
  bold?: boolean;
  anchor?: 'start' | 'middle' | 'end';
  fill?: string;
  /** Marks the digits as a labelled illustration or as our arithmetic, for the citation check. */
  num?: 'toy' | 'derived';
  style?: CSSProperties;
  children: ReactNode;
}

/** One line of figure text. */
export function T({ x, y, size = 13, bold, anchor = 'start', fill = INK, num, style, children }: TProps) {
  return (
    <text x={x} y={y} fontFamily={FONT} fontSize={size} fontWeight={bold ? 'bold' : 'normal'} textAnchor={anchor} fill={fill} data-num={num} style={style}>
      {children}
    </text>
  );
}

/** A symbol with a subscript, then any text that follows on the same line: x with k, z with k+1. */
export function Sym({ b, s, rest = '' }: { b: string; s: string; rest?: string }) {
  return (
    <>
      {b}
      <tspan dy="3.5" fontSize="0.74em">
        {s}
      </tspan>
      <tspan dy="-3.5">{rest === '' ? '​' : rest}</tspan>
    </>
  );
}

interface CropProps {
  /** Unique id for the clip path. */
  id: string;
  /** Which of the six stills, 0 to 5. */
  frame: number;
  x: number;
  y: number;
  w: number;
  h: number;
  /** The part of the still to show, as fractions of its side. Default: all of it. */
  fx?: number;
  fy?: number;
  fw?: number;
  fh?: number;
  filter?: string;
  opacity?: number;
  /** Skew transform for a face seen at an angle. */
  transform?: string;
}

/** A crop of one still of the episode, painted into a box. */
export function Crop({ id, frame, x, y, w, h, fx = 0, fy = 0, fw = 1, fh = 1, filter, opacity, transform }: CropProps) {
  const frameW = w / fw;
  const frameH = h / fh;
  return (
    <g transform={transform} opacity={opacity}>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <image
          href={STRIP}
          x={x - (frame + fx) * frameW}
          y={y - fy * frameH}
          width={STRIP_FRAMES * frameW}
          height={frameH}
          preserveAspectRatio="none"
          filter={filter}
        />
      </g>
    </g>
  );
}

/** The 4:3 window of a square still that keeps the gripper, the block and the cup in view. */
export const VIEW_43 = { fy: 0.17, fh: 0.75 } as const;

/** A shade of blue for a latent value in [0, 1]. */
export function blue(v: number): string {
  const c = Math.max(0, Math.min(1, v));
  const mix = (a: number, b: number) => Math.round(a + (b - a) * c);
  return `rgb(${mix(226, 11)},${mix(238, 79)},${mix(252, 158)})`;
}

interface LatentProps {
  x: number;
  y: number;
  values: number[];
  cell: number;
  /** Cell height when the cells are taller than wide. */
  cellH?: number;
  vertical?: boolean;
  stroke?: string;
  strokeWidth?: number;
}

/** The latent glyph: a strip of cells, each shaded by its value. */
export function Latent({ x, y, values, cell, cellH, vertical, stroke = '#1f5fa8', strokeWidth = 1.2 }: LatentProps) {
  const ch = cellH ?? cell;
  const w = vertical ? cell : cell * values.length;
  const h = vertical ? ch * values.length : ch;
  return (
    <g>
      {values.map((v, i) => (
        <path key={i} d={vertical ? box(x, y + i * ch, cell, ch) : box(x + i * cell, y, cell, ch)} fill={blue(v)} stroke="#ffffff" strokeWidth="0.6" />
      ))}
      <path d={box(x, y, w, h)} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
    </g>
  );
}

/** A straight arrow with a filled head. */
export function Arrow({ x1, y1, x2, y2, color = MUTED, width = 1.6, style }: { x1: number; y1: number; x2: number; y2: number; color?: string; width?: number; style?: CSSProperties }) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const head = 7;
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  return (
    <g style={style}>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={width} />
      <path d={`M${x2} ${y2}L${bx - uy * 4.2} ${by + ux * 4.2}L${bx + uy * 4.2} ${by - ux * 4.2}Z`} fill={color} />
    </g>
  );
}

/** Grid lines over a box: cols by rows cells. */
export function gridPath(x: number, y: number, w: number, h: number, cols: number, rows: number): string {
  let d = '';
  for (let i = 1; i < cols; i += 1) d += `M${(x + (i * w) / cols).toFixed(2)} ${y}v${h}`;
  for (let j = 1; j < rows; j += 1) d += `M${x} ${(y + (j * h) / rows).toFixed(2)}h${w}`;
  return d;
}

/** Deterministic stand-in for a random number in [0, 1), so every render draws the same picture. */
export function rnd(i: number, salt: number): number {
  const r = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return r - Math.floor(r);
}
