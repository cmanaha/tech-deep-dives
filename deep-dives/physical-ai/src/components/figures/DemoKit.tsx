import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Shared drawing parts for the concept figures of sections 4 (Learning From Demonstrations),
 * 5 (Vision-Language-Action Models) and 8 (Reinforcement Learning for Robots).
 *
 * The palette and the narrow-screen switch follow Cluster.tsx and LoopOnAws.tsx. Shapes are drawn
 * as paths, never as rect elements: the diagram check treats every rect as a box that must contain
 * any text centred on it.
 */

export const INK = '#16191f';
export const MUTED = '#5f6b7a';
export const LINE = '#8d99a8';
export const PAPER = '#fbfbfd';
export const PANEL = '#ffffff';
export const ZONE = '#f2f5f9';
export const EMPHASIS = '#0972d3';
export const ROBOT_FILL = '#fff6d6';
export const ROBOT_INK = '#7a5c00';
export const GPU_FILL = '#e6f6ea';
export const GPU_INK = '#1e7b3a';
export const ORANGE = '#c2410c';
export const PURPLE = '#5b3fa8';
export const FONT = 'sans-serif';

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

/** Path data for a box with rounded corners. */
export function rbox(x: number, y: number, w: number, h: number, r: number): string {
  return `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}Z`;
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
  transform?: string;
  children: ReactNode;
}

/** One line of figure text. */
export function T({ x, y, size = 13, bold, anchor = 'start', fill = INK, num, style, transform, children }: TProps) {
  return (
    <text
      x={x}
      y={y}
      fontFamily={FONT}
      fontSize={size}
      fontWeight={bold ? 'bold' : 'normal'}
      textAnchor={anchor}
      fill={fill}
      data-num={num}
      style={style}
      transform={transform}
    >
      {children}
    </text>
  );
}

/** Opacity switch for a part that appears at some step. */
export function fade(on: boolean, reduced: boolean, level = 1, ms = 300): CSSProperties {
  return { opacity: on ? level : 0, transition: reduced ? 'none' : `opacity ${ms}ms ease` };
}

/** Deterministic stand-in for a random number in [0, 1), so every render draws the same picture. */
export function rnd(i: number, salt: number): number {
  const r = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return r - Math.floor(r);
}

/** A straight arrow with a filled head. */
export function Arrow({ x1, y1, x2, y2, color = MUTED, width = 1.6, head = 7, style }: { x1: number; y1: number; x2: number; y2: number; color?: string; width?: number; head?: number; style?: CSSProperties }) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  const half = head * 0.6;
  return (
    <g style={style}>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={width} />
      <path d={`M${x2} ${y2}L${bx - uy * half} ${by + ux * half}L${bx + uy * half} ${by - ux * half}Z`} fill={color} />
    </g>
  );
}

/** A small GPU chip: a square with pins on two sides. */
export function Chip({ x, y, s, fill = GPU_FILL, ink = GPU_INK }: { x: number; y: number; s: number; fill?: string; ink?: string }) {
  const pins = [0.25, 0.5, 0.75];
  return (
    <g>
      {pins.map((p) => (
        <path key={p} d={`M${x - 3} ${y + s * p}h${s + 6}M${x + s * p} ${y - 3}v${s + 6}`} stroke={ink} strokeWidth="1.2" />
      ))}
      <path d={rbox(x, y, s, s, 2)} fill={fill} stroke={ink} strokeWidth="1.4" />
      <path d={box(x + s * 0.28, y + s * 0.28, s * 0.44, s * 0.44)} fill={ink} opacity="0.55" />
    </g>
  );
}

/**
 * Six hand-drawn joint curves over one chunk, in [-1, 1], as functions of progress u in [0, 1].
 * Sections 4 and 5 draw the same invented chunk, so the two figures agree.
 */
export const JOINT_CURVES: ((u: number) => number)[] = [
  (u) => 0.78 * Math.sin(Math.PI * u * 0.85) - 0.2,
  (u) => 0.7 * Math.cos(Math.PI * u * 1.1),
  (u) => -0.75 * Math.sin(Math.PI * u * 1.3),
  (u) => 0.5 * Math.sin(Math.PI * (u * 1.6 + 0.2)),
  (u) => 0.25 - 0.6 * u,
  (u) => (u < 0.45 ? 0.7 : u < 0.6 ? 0.7 - ((u - 0.45) / 0.15) * 1.4 : -0.7),
];

/** Blue for a low value, white in the middle, brown for a high one. */
export function heat(v: number): string {
  const c = Math.max(-1, Math.min(1, v));
  const to = c < 0 ? [31, 95, 168] : [168, 90, 10];
  const k = Math.abs(c) ** 0.8;
  const mix = (b: number) => Math.round(255 + (b - 255) * k);
  return `rgb(${mix(to[0])},${mix(to[1])},${mix(to[2])})`;
}
