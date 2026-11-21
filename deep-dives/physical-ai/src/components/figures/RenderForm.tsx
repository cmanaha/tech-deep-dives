import type { CSSProperties, ReactNode } from 'react';
import { Toy } from '../Cite';
import { EMPHASIS, INK, MUTED, LINE, PAPER, PANEL, T, box, fade, rbox, useNarrow } from './DemoKit';
import { BACKDROP, EYE, IMAGE, LIGHT, NX, NY, TABLE, TRIS, facesObserver, planePoint, project, sceneShade, view } from './RenderScene';
import type { Tri, V3 } from './RenderScene';

/**
 * Section 13 (Rendering and Ray Tracing): one scene, its image formed twice.
 *
 * Left (top on a phone): the scene as the renderer holds it, triangles, a light and a camera with
 * its image drawn as a grid of pixels. Right (below on a phone): that image, once filled by
 * rasterising the triangles and once by tracing a ray per pixel with a shadow ray to the light.
 * Every pixel colour comes from RenderScene.ts, which computes both images from the same
 * triangles, so the cup's shadow appears in the traced image because the shadow rays found it.
 */

const RAY = '#c2410c';
/* Keeps a label readable where rays pass behind it. */
const HALO: CSSProperties = { paintOrder: 'stroke', stroke: PANEL, strokeWidth: 3, strokeLinejoin: 'round' };
const GRID = '#aab4c0';

export const RENDER_FORM_STEPS: ReactNode[] = [
  <>
    The scene as the simulator holds it: a block, a cup and a table stored as triangles, one light and a camera. The
    grid in front of the camera is its image, drawn here at <Toy>16 x 12</Toy> pixels. The two copies of the image
    start empty.
  </>,
  <>
    Rasterising starts from a triangle. Take one triangle of the block. Each of its three corners is projected along
    a straight line toward the camera and lands where that line crosses the image.
  </>,
  <>
    The pixels whose centres fall inside the projected triangle are filled with the colour of that triangle. The dots
    are the pixel centres.
  </>,
  <>
    The same is done for every triangle. Where two triangles cover the same pixel, the one nearer the camera wins. The
    image is complete, and each surface carries only its own shade: nothing in these two steps asks whether the cup
    stands between a surface and the light.
  </>,
  <>
    Ray tracing starts from a pixel. One ray leaves the camera through the centre of the outlined pixel and stops at
    the first surface it lands on: the top of the block.
  </>,
  <>
    From that point a shadow ray heads for the light. The cup is in the way, so the pixel is painted dark. The ray
    through a pixel further left also lands on top of the block. Its shadow ray passes the cup and reaches the
    light, so that pixel is painted lit.
  </>,
  <>
    Every pixel gets a ray and a shadow ray. The traced image now holds the shadows of the cup and the block. The
    rasterised image of the same scene has none. The extra rays are the cost: one more per pixel for this one light.
  </>,
];

/* ------------------------------------------------------------------------ */
/* Things worked out once from the scene                                     */
/* ------------------------------------------------------------------------ */

const inside = (p: [number, number], a: [number, number], b: [number, number], c: [number, number]) => {
  const side = (q: [number, number], r: [number, number]) => (r[0] - q[0]) * (p[1] - q[1]) - (r[1] - q[1]) * (p[0] - q[0]);
  const d0 = side(a, b);
  const d1 = side(b, c);
  const d2 = side(c, a);
  return (d0 >= 0 && d1 >= 0 && d2 >= 0) || (d0 <= 0 && d1 <= 0 && d2 <= 0);
};

interface Cell {
  i: number;
  j: number;
}
const CELLS: Cell[] = Array.from({ length: NX * NY }, (_, k) => ({ i: k % NX, j: Math.floor(k / NX) }));

/* The triangle the raster half follows: the one on the block's camera-facing sides that covers most pixel centres. */
const covered = (tri: Tri) => {
  const [a, b, c] = [project(tri.a), project(tri.b), project(tri.c)];
  return CELLS.filter(({ i, j }) => inside([i + 0.5, j + 0.5], a, b, c) && IMAGE[j][i].hit?.tri.face === tri.face);
};
const FIRST_TRI = TRIS.filter((t) => t.body === 'block' && t.n[1] === 0).reduce((best, t) => (covered(t).length > covered(best).length ? t : best));
const FIRST_CORNERS = [FIRST_TRI.a, FIRST_TRI.b, FIRST_TRI.c];
const FIRST_PIXELS = covered(FIRST_TRI);
const FIRST_COLOUR = IMAGE[FIRST_PIXELS[0].j][FIRST_PIXELS[0].i].raster;

/* The two pixels the ray half follows, in one row on top of the block: one in the cup's shadow, one lit. */
const SHADOW_PIXEL: Cell = { i: 7, j: 4 };
const LIT_PIXEL: Cell = { i: 3, j: 4 };

/* Pixels where the shadow ray was blocked: the difference between the two images. */
const isShadow = (i: number, j: number) => i >= 0 && j >= 0 && i < NX && j < NY && IMAGE[j][i].raster !== IMAGE[j][i].traced;
function shadowOutline(x: number, y: number, c: number): string {
  let d = '';
  for (const { i, j } of CELLS) {
    if (!isShadow(i, j)) continue;
    if (!isShadow(i, j - 1)) d += `M${x + i * c} ${y + j * c}h${c}`;
    if (!isShadow(i, j + 1)) d += `M${x + i * c} ${y + (j + 1) * c}h${c}`;
    if (!isShadow(i - 1, j)) d += `M${x + i * c} ${y + j * c}v${c}`;
    if (!isShadow(i + 1, j)) d += `M${x + (i + 1) * c} ${y + j * c}v${c}`;
  }
  return d;
}

/* Extent of the scene view, to fit it into its panel. */
const TABLE_CORNERS: V3[] = [
  [TABLE.x0, 0, TABLE.z1],
  [TABLE.x1, 0, TABLE.z1],
  [TABLE.x1, 0, TABLE.z0],
  [TABLE.x0, 0, TABLE.z0],
];
const PLANE_CORNERS: V3[] = [planePoint(0, 0), planePoint(NX, 0), planePoint(NX, NY), planePoint(0, NY)];
const EXTENT = [...TABLE_CORNERS, ...PLANE_CORNERS, EYE, LIGHT, ...TRIS.flatMap((t) => [t.a, t.b, t.c])].map(view);
const VX0 = Math.min(...EXTENT.map((p) => p[0]));
const VX1 = Math.max(...EXTENT.map((p) => p[0]));
const VY0 = Math.min(...EXTENT.map((p) => p[1]));
const VY1 = Math.max(...EXTENT.map((p) => p[1]));

const depthOf = (body: string) => {
  const pts = TRIS.filter((t) => t.body === body).flatMap((t) => [t.a, t.b, t.c]).map((p) => view(p)[2]);
  return pts.reduce((s, d) => s + d, 0) / pts.length;
};
const SOLIDS = ['block', 'cup'].sort((p, q) => depthOf(p) - depthOf(q));
const DRAWN: Tri[] = [...TRIS.filter((t) => t.body === 'table'), ...SOLIDS.flatMap((b) => TRIS.filter((t) => t.body === b && facesObserver(t)))];

interface Layout {
  W: number;
  H: number;
  /** Scene panel. */
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  /** Padding inside the scene panel: left, top, right, bottom. */
  pad: [number, number, number, number];
  /** Image cell size and the top left corners of the two images. */
  cell: number;
  ix: [number, number];
  iy: number;
  /** Baseline of the first legend line, and its left edge. */
  ly: number;
  lx: number;
  legendCols: number;
}

const WIDE: Layout = { W: 1040, H: 392, sx: 12, sy: 12, sw: 496, sh: 368, pad: [22, 44, 22, 26], cell: 15.5, ix: [524, 780], iy: 62, ly: 300, lx: 524, legendCols: 2 };
const PHONE: Layout = { W: 400, H: 672, sx: 10, sy: 10, sw: 380, sh: 304, pad: [12, 44, 12, 26], cell: 11.5, ix: [10, 206], iy: 366, ly: 562, lx: 10, legendCols: 1 };

export function RenderForm({ step, reduced }: { step: number; reduced: boolean }) {
  const narrow = useNarrow();
  const g = narrow ? PHONE : WIDE;
  const f = (on: boolean, level = 1) => fade(on, reduced, level);

  /* scene view to canvas */
  const k = Math.min((g.sw - g.pad[0] - g.pad[2]) / (VX1 - VX0), (g.sh - g.pad[1] - g.pad[3]) / (VY1 - VY0));
  const ox = g.sx + g.pad[0] + (g.sw - g.pad[0] - g.pad[2] - k * (VX1 - VX0)) / 2 - k * VX0;
  const oy = g.sy + g.pad[1] + (g.sh - g.pad[1] - g.pad[3] - k * (VY1 - VY0)) / 2 - k * VY0;
  const S = (p: V3): [number, number] => {
    const v = view(p);
    return [ox + k * v[0], oy + k * v[1]];
  };
  const pt = (p: V3) => S(p).map((n) => n.toFixed(1)).join(' ');
  const poly = (ps: V3[]) => `M${ps.map(pt).join('L')}Z`;
  const seg = (a: V3, b: V3) => `M${pt(a)}L${pt(b)}`;

  const eye = S(EYE);
  const planeTop = [S(PLANE_CORNERS[0]), S(PLANE_CORNERS[1])];
  const light = S(LIGHT);
  const cellQuad = (c: Cell) => poly([planePoint(c.i, c.j), planePoint(c.i + 1, c.j), planePoint(c.i + 1, c.j + 1), planePoint(c.i, c.j + 1)]);
  let planeGrid = '';
  for (let i = 0; i <= NX; i += 1) planeGrid += seg(planePoint(i, 0), planePoint(i, NY));
  for (let j = 0; j <= NY; j += 1) planeGrid += seg(planePoint(0, j), planePoint(NX, j));

  const shadowPx = IMAGE[SHADOW_PIXEL.j][SHADOW_PIXEL.i];
  const litPx = IMAGE[LIT_PIXEL.j][LIT_PIXEL.i];
  const shadowHit = shadowPx.hit ? shadowPx.hit.p : EYE;
  const litHit = litPx.hit ? litPx.hit.p : EYE;
  const stop = S(shadowPx.shadowEnd);

  const fan = CELLS.filter(({ i, j }) => (i + j) % 2 === 0 && IMAGE[j][i].hit).map(({ i, j }) => seg(EYE, (IMAGE[j][i].hit as { p: V3 }).p)).join('');

  /* the two images */
  const c = g.cell;
  const iw = NX * c;
  const ih = NY * c;
  const [rx, tx] = g.ix;
  const iy = g.iy;
  const gridPath = (x: number) => {
    let d = '';
    for (let i = 0; i <= NX; i += 1) d += `M${x + i * c} ${iy}v${ih}`;
    for (let j = 0; j <= NY; j += 1) d += `M${x} ${iy + j * c}h${iw}`;
    return d;
  };
  const cellBox = (x: number, cl: Cell) => box(x + cl.i * c, iy + cl.j * c, c, c);
  const firstProjected = FIRST_CORNERS.map(project);
  const firstOutline = `M${firstProjected.map(([u, v]) => `${(rx + u * c).toFixed(1)} ${(iy + v * c).toFixed(1)}`).join('L')}Z`;
  const isFirst = (cl: Cell) => FIRST_PIXELS.some((p) => p.i === cl.i && p.j === cl.j);
  const same = (a: Cell, b: Cell) => a.i === b.i && a.j === b.j;

  const rasterNote = ['', 'three corners land on the image', 'centres inside the triangle: filled', 'every triangle drawn: no shadow', 'every triangle drawn: no shadow', 'every triangle drawn: no shadow', 'the same scene, no shadow'][step] ?? '';
  const tracedNote = ['', '', '', '', 'one pixel, one ray', 'blocked: dark. Clear path: lit', 'shadows, from the shadow rays'][step] ?? '';
  const font = narrow ? 12 : 13;
  const legend: { label: string; draw: (x: number, y: number) => ReactNode }[] = [
    { label: 'corner of a triangle, projected', draw: (x, y) => <path d={`M${x} ${y}h30`} stroke={MUTED} strokeWidth="1.4" strokeDasharray="4 3" /> },
    { label: 'ray from the camera through a pixel', draw: (x, y) => <path d={`M${x} ${y}h30`} stroke={RAY} strokeWidth="2.2" /> },
    { label: 'shadow ray, toward the light', draw: (x, y) => <path d={`M${x} ${y}h30`} stroke={EMPHASIS} strokeWidth="2.2" /> },
    { label: 'pixels where a shadow ray was blocked', draw: (x, y) => <path d={box(x + 8, y - 7, 14, 14)} fill="none" stroke={EMPHASIS} strokeWidth="2" /> },
  ];
  const legendW = narrow ? 0 : 256;

  return (
    <svg viewBox={`0 0 ${g.W} ${g.H}`} role="img" aria-labelledby="rendering-form-title" style={{ width: '100%', height: 'auto' }}>
      <title id="rendering-form-title">One scene and its image formed twice: by rasterising triangles, and by tracing a ray per pixel with a shadow ray to the light</title>
      <desc>
        A table with a block and a taller cup, a light and a camera, all drawn as triangles, with the camera&apos;s image
        shown as a grid of pixels in front of it. Beside the scene the image is formed twice. Rasterising projects
        the corners of each triangle onto the image and fills the pixels inside, which gives an image with no
        shadows. Ray tracing sends a ray through each pixel to the first surface, then a shadow ray toward the light;
        where the cup or the block is in the way the pixel is painted dark, so the traced image shows their shadows.
      </desc>
      <path d={box(0, 0, g.W, g.H)} fill={PAPER} />

      {/* ---- the scene ---- */}
      <path d={rbox(g.sx, g.sy, g.sw, g.sh, 8)} fill={PANEL} stroke={LINE} strokeWidth="1.2" />
      <T x={g.sx + 14} y={g.sy + 22} size={font} bold>
        The scene: triangles, a light, a camera
      </T>
      {DRAWN.map((t, n) => (
        <path key={n} d={poly([t.a, t.b, t.c])} fill={sceneShade(t)} stroke="#4a5563" strokeOpacity="0.55" strokeWidth="0.9" strokeLinejoin="round" />
      ))}

      {/* the light */}
      <g>
        {Array.from({ length: 8 }, (_, n) => {
          const a = (n * Math.PI) / 4;
          return <path key={n} d={`M${(light[0] + 11 * Math.cos(a)).toFixed(1)} ${(light[1] + 11 * Math.sin(a)).toFixed(1)}L${(light[0] + 16 * Math.cos(a)).toFixed(1)} ${(light[1] + 16 * Math.sin(a)).toFixed(1)}`} stroke="#b7791f" strokeWidth="1.8" strokeLinecap="round" />;
        })}
        <circle cx={light[0]} cy={light[1]} r="8" fill="#ffd24a" stroke="#b7791f" strokeWidth="1.5" />
      </g>

      {/* raster: one triangle and its three corners projected toward the camera */}
      <g style={f(step === 1 || step === 2)}>
        <path d={poly(FIRST_CORNERS)} fill={FIRST_COLOUR} stroke={EMPHASIS} strokeWidth="2.4" strokeLinejoin="round" />
        {FIRST_CORNERS.map((p, n) => (
          <path key={n} d={seg(p, EYE)} stroke={MUTED} strokeWidth="1.3" strokeDasharray="4 3" />
        ))}
      </g>

      {/* ray tracing: every other ray, faint */}
      <path d={fan} stroke={RAY} strokeWidth="0.8" style={f(step === 6, 0.32)} />

      {/* ray tracing: the two rays that are followed */}
      <g style={f(step === 4 || step === 5)}>
        <path d={seg(EYE, shadowHit)} stroke={RAY} strokeWidth="2.2" />
        <circle cx={S(shadowHit)[0]} cy={S(shadowHit)[1]} r="3.6" fill={RAY} />
      </g>
      <g style={f(step === 5)}>
        <path d={seg(shadowHit, shadowPx.shadowEnd)} stroke={EMPHASIS} strokeWidth="2.2" />
        <path d={seg(shadowPx.shadowEnd, LIGHT)} stroke={MUTED} strokeWidth="1.2" strokeDasharray="3 4" />
        <path d={`M${stop[0] - 5} ${stop[1] - 5}l10 10m0 -10l-10 10`} stroke={EMPHASIS} strokeWidth="2.4" fill="none" />
        <path d={seg(EYE, litHit)} stroke={RAY} strokeWidth="2.2" />
        <circle cx={S(litHit)[0]} cy={S(litHit)[1]} r="3.6" fill={RAY} />
        <path d={seg(litHit, LIGHT)} stroke={EMPHASIS} strokeWidth="2.2" />
      </g>

      {/* the camera and its image */}
      <path d={PLANE_CORNERS.map((p) => seg(EYE, p)).join('')} stroke={MUTED} strokeWidth="1" />
      <path d={poly(PLANE_CORNERS)} fill="#ffffff" fillOpacity="0.55" />
      <path d={planeGrid} stroke={GRID} strokeWidth="0.7" />
      <path d={poly(PLANE_CORNERS)} fill="none" stroke={INK} strokeWidth="1.3" />
      <g style={f(step === 1 || step === 2)}>
        {FIRST_CORNERS.map((p, n) => {
          const [u, v] = project(p);
          const q = S(planePoint(u, v));
          return <circle key={n} cx={q[0]} cy={q[1]} r="2.8" fill={EMPHASIS} />;
        })}
      </g>
      <path d={cellQuad(SHADOW_PIXEL)} fill={RAY} fillOpacity="0.35" stroke={RAY} strokeWidth="1.6" style={f(step === 4 || step === 5)} />
      <path d={cellQuad(LIT_PIXEL)} fill={RAY} fillOpacity="0.35" stroke={RAY} strokeWidth="1.6" style={f(step === 5)} />
      <circle cx={eye[0]} cy={eye[1]} r="5" fill={INK} />

      {/* scene labels */}
      <T x={Math.max(g.sx + 8, eye[0] - 20)} y={eye[1] - 12} size={font} style={HALO}>
        camera
      </T>
      <T x={(planeTop[0][0] + planeTop[1][0]) / 2 + 14} y={Math.min(planeTop[0][1], planeTop[1][1]) - 7} size={font} anchor="middle" style={HALO}>
        its image
      </T>
      <T x={light[0]} y={light[1] - 24} size={font} anchor="middle" style={HALO}>
        light
      </T>
      <T x={S([-0.5, 0, 0.5])[0] - 10} y={S([-0.5, 0, 0.5])[1] + 20} size={font} anchor="end" style={HALO}>
        block
      </T>
      <T x={S([0.1, 0, 1.8])[0] + 6} y={S([0.1, 0, 1.8])[1] + 22} size={font} anchor="middle" style={HALO}>
        cup
      </T>
      <T x={S([TABLE.x1, 0, TABLE.z1])[0] - 6} y={S([TABLE.x1, 0, TABLE.z1])[1] + 20} size={font} anchor="end" style={HALO}>
        table
      </T>

      {/* ---- the two images ---- */}
      {[
        { x: rx, head: 'Rasterised', sub: 'from the triangles', note: rasterNote },
        { x: tx, head: 'Ray traced', sub: 'from the pixels', note: tracedNote },
      ].map((im) => (
        <g key={im.head}>
          <T x={im.x} y={iy - 26} size={font} bold>
            {im.head}
          </T>
          <T x={im.x} y={iy - 9} size={12} fill={MUTED}>
            {im.sub}
          </T>
          <path d={box(im.x, iy, iw, ih)} fill={BACKDROP} />
          <T x={im.x} y={iy + ih + 18} size={12}>
            {im.note}
          </T>
        </g>
      ))}
      {CELLS.map((cl) => {
        const px = IMAGE[cl.j][cl.i];
        const rasterOn = step >= 3 || (step === 2 && isFirst(cl));
        const tracedOn = step >= 6 || (step === 5 && (same(cl, SHADOW_PIXEL) || same(cl, LIT_PIXEL)));
        return (
          <g key={`${cl.i}-${cl.j}`}>
            <path d={cellBox(rx, cl)} fill={step === 2 ? FIRST_COLOUR : px.raster} style={f(rasterOn)} />
            <path d={cellBox(tx, cl)} fill={px.traced} style={f(tracedOn)} />
          </g>
        );
      })}
      <path d={gridPath(rx)} stroke={GRID} strokeWidth="0.6" />
      <path d={gridPath(tx)} stroke={GRID} strokeWidth="0.6" />
      <path d={box(rx, iy, iw, ih)} fill="none" stroke={INK} strokeWidth="1.3" />
      <path d={box(tx, iy, iw, ih)} fill="none" stroke={INK} strokeWidth="1.3" />

      {/* raster: projected corners, then pixel centres */}
      <g style={f(step === 1 || step === 2)}>
        <path d={firstOutline} fill="none" stroke={EMPHASIS} strokeWidth="2" strokeLinejoin="round" />
        {firstProjected.map(([u, v], n) => (
          <circle key={n} cx={rx + u * c} cy={iy + v * c} r="3.2" fill={EMPHASIS} />
        ))}
      </g>
      <g style={f(step === 2)}>
        {CELLS.map((cl) => (
          <circle key={`${cl.i}-${cl.j}`} cx={rx + (cl.i + 0.5) * c} cy={iy + (cl.j + 0.5) * c} r={isFirst(cl) ? 1.9 : 1.1} fill={isFirst(cl) ? INK : MUTED} />
        ))}
      </g>

      {/* ray tracing: the followed pixels, then the shadow outline */}
      <path d={cellBox(tx, SHADOW_PIXEL)} fill="none" stroke={RAY} strokeWidth="2.4" style={f(step === 4 || step === 5)} />
      <path d={cellBox(tx, LIT_PIXEL)} fill="none" stroke={RAY} strokeWidth="2.4" style={f(step === 5)} />
      <path d={shadowOutline(tx, iy, c)} fill="none" stroke={EMPHASIS} strokeWidth="2" strokeLinecap="square" style={f(step === 6)} />
      <path d={shadowOutline(rx, iy, c)} fill="none" stroke={EMPHASIS} strokeWidth="1.4" strokeDasharray="3 3" style={f(step === 6)} />

      {/* ---- legend ---- */}
      {legend.map((l, n) => {
        const col = n % g.legendCols;
        const row = Math.floor(n / g.legendCols);
        const x = g.lx + col * legendW;
        const y = g.ly + row * 20;
        return (
          <g key={l.label}>
            {l.draw(x, y - 4)}
            <T x={x + 38} y={y} size={12}>
              {l.label}
            </T>
          </g>
        );
      })}
      {narrow ? (
        <>
          <T x={g.lx} y={g.ly + 92} size={12} fill={MUTED}>
            Drawn at <tspan data-num="toy">16 x 12</tspan> pixels so each one shows.
          </T>
          <T x={g.lx} y={g.ly + 108} size={12} fill={MUTED}>
            The shipped task renders 64 x 64.
          </T>
        </>
      ) : (
        <T x={g.lx} y={g.ly + 52} size={12} fill={MUTED}>
          Drawn at <tspan data-num="toy">16 x 12</tspan> pixels so each one shows. The shipped task renders 64 x 64.
        </T>
      )}
    </svg>
  );
}
