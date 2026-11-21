/**
 * A very small renderer for the figure of section 13 (Rendering and Ray Tracing).
 *
 * The figure draws a block, a cup, a table, a light and a camera, and forms the camera's image
 * twice: once by rasterising the triangles, once by tracing a ray per pixel with a shadow ray to
 * the light. Both images are computed here from the same triangles, so the scene view, the rays
 * drawn in it and the pixels painted in the image always agree. The geometry and the image size
 * are invented for the picture; nothing here is a measurement.
 */

export type V3 = [number, number, number];
export type Body = 'table' | 'block' | 'cup';

export interface Tri {
  a: V3;
  b: V3;
  c: V3;
  /** Unit normal, pointing out of the body. */
  n: V3;
  body: Body;
  /** Base colour of the surface, red, green and blue from 0 to 255. */
  tone: V3;
  /** Index of the flat face the triangle belongs to, so a face can be outlined as one polygon. */
  face: number;
}

const sub = (p: V3, q: V3): V3 => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
const add = (p: V3, q: V3): V3 => [p[0] + q[0], p[1] + q[1], p[2] + q[2]];
const mul = (p: V3, k: number): V3 => [p[0] * k, p[1] * k, p[2] * k];
const dot = (p: V3, q: V3): number => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
const cross = (p: V3, q: V3): V3 => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
const unit = (p: V3): V3 => mul(p, 1 / Math.hypot(p[0], p[1], p[2]));

/* ------------------------------------------------------------------------ */
/* The scene                                                                 */
/* ------------------------------------------------------------------------ */

/** Pixels across and down. Drawn small so every pixel can be seen. */
export const NX = 16;
export const NY = 12;

export const LIGHT: V3 = [-0.45, 3.7, 2.7];
export const EYE: V3 = [-5.6, 4.6, 3.2];
const TARGET: V3 = [0.0, 0.75, 0.65];
const FOV_Y = (22 * Math.PI) / 180;
/** Distance from the eye to the image plane as it is drawn in the scene view. */
const PLANE_D = 2.6;

const BLOCK_TONE: V3 = [240, 200, 84];
const CUP_TONE: V3 = [150, 176, 214];
const CUP_INSIDE: V3 = [104, 128, 168];
const TABLE_TONE: V3 = [226, 229, 233];
export const BACKDROP = '#f7f8fa';

let faceCount = 0;
const tris: Tri[] = [];

/** Adds a flat convex polygon as a fan of triangles. Corners run anticlockwise seen from outside. */
function polygon(points: V3[], body: Body, tone: V3) {
  const n = unit(cross(sub(points[1], points[0]), sub(points[2], points[0])));
  const face = faceCount;
  faceCount += 1;
  for (let i = 1; i < points.length - 1; i += 1) tris.push({ a: points[0], b: points[i], c: points[i + 1], n, body, tone, face });
}

function prism(cx: number, cz: number, r: number, h: number, sides: number, turn: number, body: Body, tone: V3, topTone: V3) {
  const ring = Array.from({ length: sides }, (_, i) => {
    const t = turn + (i * 2 * Math.PI) / sides;
    return [cx + r * Math.cos(t), cz - r * Math.sin(t)] as const;
  });
  for (let i = 0; i < sides; i += 1) {
    const [x0, z0] = ring[i];
    const [x1, z1] = ring[(i + 1) % sides];
    polygon([[x0, 0, z0], [x1, 0, z1], [x1, h, z1], [x0, h, z0]], body, tone);
  }
  polygon(ring.map(([x, z]) => [x, h, z] as V3), body, topTone);
}

export const TABLE = { x0: -1.7, x1: 1.7, z0: -1.5, z1: 2.4 };
polygon(
  [[TABLE.x0, 0, TABLE.z1], [TABLE.x1, 0, TABLE.z1], [TABLE.x1, 0, TABLE.z0], [TABLE.x0, 0, TABLE.z0]],
  'table',
  TABLE_TONE,
);
/* The block: a cube of 12 triangles. A square prism turned by 45 degrees has its sides on the axes. */
prism(0, 0, Math.SQRT1_2, 1, 4, Math.PI / 4, 'block', BLOCK_TONE, BLOCK_TONE);
/* The cup: an eight-sided prism, taller than the block, between the block and the light. */
prism(0.1, 1.3, 0.5, 1.9, 8, Math.PI / 8, 'cup', CUP_TONE, CUP_INSIDE);

export const TRIS: readonly Tri[] = tris;

/* ------------------------------------------------------------------------ */
/* The camera                                                                */
/* ------------------------------------------------------------------------ */

const FWD = unit(sub(TARGET, EYE));
const RIGHT = unit(cross(FWD, [0, 1, 0]));
const UP = cross(RIGHT, FWD);
const HALF_H = Math.tan(FOV_Y / 2);
const HALF_W = (HALF_H * NX) / NY;

/** The point of the drawn image plane at pixel coordinates (u, v); (0, 0) is the top left corner. */
export function planePoint(u: number, v: number): V3 {
  const sx = ((u / NX) * 2 - 1) * HALF_W * PLANE_D;
  const sy = (1 - (v / NY) * 2) * HALF_H * PLANE_D;
  return add(EYE, add(mul(FWD, PLANE_D), add(mul(RIGHT, sx), mul(UP, sy))));
}

/** Projects a point of the scene onto the image, in pixel coordinates. */
export function project(p: V3): [number, number] {
  const d = sub(p, EYE);
  const z = dot(d, FWD);
  return [((dot(d, RIGHT) / z / HALF_W + 1) / 2) * NX, ((1 - dot(d, UP) / z / HALF_H) / 2) * NY];
}

/* ------------------------------------------------------------------------ */
/* Rays                                                                      */
/* ------------------------------------------------------------------------ */

export interface Hit {
  t: number;
  tri: Tri;
  p: V3;
}

/** The first triangle a ray lands on, or undefined when it leaves the scene. */
export function trace(o: V3, d: V3, tMax = Infinity): Hit | undefined {
  let best: Hit | undefined;
  for (const tri of TRIS) {
    const e1 = sub(tri.b, tri.a);
    const e2 = sub(tri.c, tri.a);
    const h = cross(d, e2);
    const det = dot(e1, h);
    if (Math.abs(det) < 1e-9) continue;
    const s = sub(o, tri.a);
    const u = dot(s, h) / det;
    if (u < 0 || u > 1) continue;
    const q = cross(s, e1);
    const v = dot(d, q) / det;
    if (v < 0 || u + v > 1) continue;
    const t = dot(e2, q) / det;
    if (t > 1e-4 && t < tMax && (!best || t < best.t)) best = { t, tri, p: add(o, mul(d, t)) };
  }
  return best;
}

export interface Pixel {
  /** What the camera ray through the pixel centre lands on. */
  hit?: Hit;
  /** True when nothing stands between that point and the light. */
  lit: boolean;
  /** The body that blocks the shadow ray, when one does. */
  blocker?: Body;
  /** Where the shadow ray stops: on the blocking surface, or at the light. */
  shadowEnd: V3;
  /** Colour with every surface shaded by its own angle to the light and no shadow test. */
  raster: string;
  /** Colour after the shadow ray. */
  traced: string;
}

/*
 * Shading, the same in both images: a base level, a little light from the direction of the viewer
 * (which casts no shadow) and the light of the scene. Only the last part is switched off where a
 * shadow ray is blocked, so the two images differ in the shadows and nowhere else.
 */
const BASE = 0.42;
const FILL = 0.25;
const DIRECT = 0.5;
const rgb = (tone: V3, k: number) => `rgb(${tone.map((c) => Math.round(Math.min(255, c * k))).join(',')})`;
const shade = (tri: Tri, p: V3, viewer: V3, direct: boolean) =>
  rgb(tri.tone, BASE + FILL * Math.max(0, dot(tri.n, viewer)) + (direct ? DIRECT * Math.max(0, dot(tri.n, unit(sub(LIGHT, p)))) : 0));

function pixel(i: number, j: number): Pixel {
  const dir = unit(sub(planePoint(i + 0.5, j + 0.5), EYE));
  const hit = trace(EYE, dir);
  if (!hit) return { lit: true, shadowEnd: LIGHT, raster: BACKDROP, traced: BACKDROP };
  const facing = dot(hit.tri.n, sub(LIGHT, hit.p)) > 0;
  const start = add(hit.p, mul(hit.tri.n, 1e-3));
  const blocker = facing ? trace(start, sub(LIGHT, start), 1) : undefined;
  const lit = facing && !blocker;
  const viewer = mul(dir, -1);
  return {
    hit,
    lit,
    blocker: blocker?.tri.body,
    shadowEnd: blocker ? blocker.p : LIGHT,
    raster: shade(hit.tri, hit.p, viewer, true),
    traced: shade(hit.tri, hit.p, viewer, lit),
  };
}

/** The image, row by row from the top. */
export const IMAGE: readonly (readonly Pixel[])[] = Array.from({ length: NY }, (_, j) => Array.from({ length: NX }, (_, i) => pixel(i, j)));

/* ------------------------------------------------------------------------ */
/* The scene view: an observer standing in front of the table, to the left   */
/* ------------------------------------------------------------------------ */

const YAW = (38 * Math.PI) / 180;
const PITCH = (24 * Math.PI) / 180;
const TOWARD: V3 = [-Math.sin(YAW) * Math.cos(PITCH), Math.sin(PITCH), Math.cos(YAW) * Math.cos(PITCH)];
const VIEW_R = unit(cross([0, 1, 0], TOWARD));
const VIEW_U = cross(TOWARD, VIEW_R);

/** Scene view coordinates of a point: x to the right, y down, and depth (larger is nearer). */
export function view(p: V3): V3 {
  return [dot(p, VIEW_R), -dot(p, VIEW_U), dot(p, TOWARD)];
}

/** True when a face is turned toward the observer of the scene view. */
export function facesObserver(tri: Tri): boolean {
  return dot(tri.n, TOWARD) > 0;
}

/** Shade of a surface in the scene view: the same shading, seen by the observer, with no shadows. */
export function sceneShade(tri: Tri): string {
  return shade(tri, mul(add(tri.a, add(tri.b, tri.c)), 1 / 3), TOWARD, true);
}
