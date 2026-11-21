import type { CSSProperties, ReactNode } from 'react';
import { Toy } from '../Cite';
import { Arrow, EMPHASIS, INK, MUTED, LINE, ORANGE, PAPER, PANEL, PURPLE, ROBOT_FILL, ROBOT_INK, T, ZONE, box, fade, rbox, useNarrow } from './DemoKit';

/**
 * Section 12 (Physics Simulation): one call of the step function, drawn.
 *
 * Left (top on a phone): the grasp the contact capture shows, as a 2-D drawing. Two fingers close
 * on a cube that rests on the floor; each stage group of the step adds what it computes: the
 * contacts and the overlap, the speeds and damping, the known forces, then the constraint forces
 * the solve finds. Right (below on a phone): the state of one joint, the elbow, as a point on an
 * angle and speed plot, moved by the two lines of semi-implicit Euler. Bottom: where this one step
 * sits among the 200 of a simulated second.
 *
 * The joint values are the section's illustration (1.000 rad/s, 2.0 rad/s2, 0.50000 rad, 5 ms).
 */

export const PHYS_STEP_STEPS: ReactNode[] = [
  <>
    The state before the step. Two fingers are closing on a cube that rests on the floor. The panel beside the scene
    follows one joint of the arm, the elbow, as a point: its angle across, its speed up. The values are illustrative.
  </>,
  <>
    Position group. From the joint angles the simulator works out where every shape is, then runs collision
    detection. It finds three contacts in this picture: each finger on the cube, and the cube on the floor. The
    fingers have sunk a little way into the cube. The drawing exaggerates that overlap.
  </>,
  <>
    Velocity group. It computes the forces that depend on speed, such as the damping in each joint, which pushes
    against the motion.
  </>,
  <>
    Force and acceleration group, first half. The servo model turns each goal angle into a motor force, which here
    presses the fingers inward. Gravity pulls on the cube. Both are known before any solving.
  </>,
  <>
    Force and acceleration group, second half: the constraint solve. It searches for the force at each contact that
    stops the shapes passing through each other. The floor pushes up as hard as gravity pulls down, the fingers push
    equally from each side, and the cube stays put. With every force known, so is every joint acceleration:{' '}
    <Toy>2.0</Toy> rad/s² for the elbow in this illustration.
  </>,
  <>
    Integrate. The timestep is 5 ms, or 0.005 s. Speed first: <Toy>1.000 + 0.005 x 2.0 = 1.010</Toy> rad/s. Then
    angle, with the new speed: <Toy>0.50000 + 0.005 x 1.010 = 0.50505</Toy> rad. The point moves up, then across.
    In the scene the fingers move too, and the overlap starts to close.
  </>,
  <>
    The new state, 5 ms later. The next step starts from it. The strip at the bottom is one simulated second of the
    pick-cube task: 200 of these steps, 20 for each of the 10 times the policy acts.
  </>,
];

const STAGES = ['1  Position', '2  Velocity', '3  Force and acceleration', '4  Integrate'];
/* Which stage group is running at each step of the animation; -1 before the call, 4 after it. */
const STAGE_AT = [-1, 0, 1, 2, 2, 3, 4];

/* Scene geometry, in its own units: a 400 by 300 drawing scaled into the scene panel. */
const FLOOR = 250;
const CUBE = { x: 152, y: 154, s: 96 };
const PAD_W = 28;
const PAD_TOP = 96;
const PAD_BOTTOM = 214;
/* How far each finger has sunk into the cube before the step, and after it. Drawn larger than life. */
const SUNK_BEFORE = 8;
const SUNK_AFTER = 3;
const CONTACT_Y = 178;
const ELBOW = { x: 58, y: 60 };

/* The elbow plot, in panel units. */
const PLOT = { left: 70, right: 350, top: 150, bottom: 300, x0: 120, x1: 300, y0: 270, y1: 182 };

interface Layout {
  W: number;
  H: number;
  rail: { x: number; y: number; w: number; h: number }[];
  /** Scene panel, and the scale of the scene drawn in it. */
  scene: { x: number; y: number; w: number; h: number; k: number; ox: number; oy: number };
  /** State panel, and the left edge of its 372-unit content. */
  state: { x: number; y: number; w: number; h: number; ox: number };
  /** The clock strip: top, rows of policy steps, width of one physics step. */
  clock: { y: number; rows: number; dx: number; x: number };
  font: number;
}

const WIDE: Layout = {
  W: 1040,
  H: 600,
  rail: [0, 1, 2, 3].map((i) => ({ x: 12 + i * 255.5, y: 12, w: 249.5, h: 34 })),
  scene: { x: 12, y: 58, w: 584, h: 432, k: 1.38, ox: 16, oy: 8 },
  state: { x: 608, y: 58, w: 420, h: 432, ox: 24 },
  clock: { y: 502, rows: 1, dx: 5, x: 20 },
  font: 13,
};
const PHONE: Layout = {
  W: 400,
  H: 950,
  rail: [0, 1, 2, 3].map((i) => ({ x: 10 + (i % 2) * 193, y: 10 + Math.floor(i / 2) * 36, w: 187, h: 30 })),
  scene: { x: 10, y: 86, w: 380, h: 290, k: 0.93, ox: 4, oy: 4 },
  state: { x: 10, y: 386, w: 380, h: 432, ox: 4 },
  clock: { y: 828, rows: 2, dx: 3.7, x: 15 },
  font: 12,
};

export function PhysStep({ step, reduced }: { step: number; reduced: boolean }) {
  const narrow = useNarrow();
  const g = narrow ? PHONE : WIDE;
  const f = (on: boolean, level = 1) => fade(on, reduced, level);
  const stage = STAGE_AT[step] ?? 4;
  const after = step >= 5;
  const font = g.font;

  /* scene units to canvas */
  const sc = g.scene;
  const X = (u: number) => sc.x + sc.ox + sc.k * u;
  const Y = (v: number) => sc.y + sc.oy + sc.k * v;
  const B = (u: number, v: number, w: number, h: number) => box(X(u), Y(v), sc.k * w, sc.k * h);
  const slide = (dir: 1 | -1): CSSProperties => ({
    transform: `translate(${after ? (dir * -(SUNK_BEFORE - SUNK_AFTER) * sc.k).toFixed(1) : 0}px, 0px)`,
    transition: reduced ? 'none' : 'transform 700ms ease',
  });
  const cubeR = CUBE.x + CUBE.s;
  const mid = CUBE.x + CUBE.s / 2;

  /* legend under the floor: what the marks of this step mean */
  type Mark = 'overlap' | 'contact' | 'speed' | 'damping' | 'motor' | 'gravity' | 'constraint' | 'none';
  const LEGENDS: [Mark, string][][] = [
    [['none', 'Two fingers closing on a cube that rests on the floor.']],
    [
      ['overlap', 'overlap, drawn larger than life'],
      ['contact', 'contact: a place where two shapes touch'],
    ],
    [
      ['speed', 'speed of each finger'],
      ['damping', 'damping, against the motion'],
    ],
    [
      ['motor', 'motor force, known'],
      ['gravity', 'gravity, known'],
    ],
    [
      ['constraint', 'constraint force: the unknown the solve finds'],
      ['none', 'On the cube the forces cancel. It stays put.'],
    ],
    [['none', 'Every joint and finger moves by speed x timestep.']],
    [['none', 'The state after the step: the start of the next one.']],
  ];
  const markColour: Record<Mark, string> = { overlap: ORANGE, contact: EMPHASIS, speed: PURPLE, damping: MUTED, motor: ROBOT_INK, gravity: MUTED, constraint: EMPHASIS, none: INK };
  const legendY = (row: number) => Y(FLOOR) + 30 + row * 18;
  const legendX = sc.x + 14;

  /* state panel */
  const st = g.state;
  const px = (x: number) => st.x + st.ox + x;
  const py = (y: number) => st.y + y;

  /* clock strip */
  const ck = g.clock;
  const perRow = 200 / ck.rows;
  const rowY = (r: number) => ck.y + (narrow ? 44 : 30) + r * 34;
  let ticks = '';
  let starts = '';
  const bands: string[] = [];
  for (let n = 0; n < 200; n += 1) {
    const r = Math.floor(n / perRow);
    const x = ck.x + (n % perRow) * ck.dx;
    if (n % 20 === 0) {
      starts += `M${x.toFixed(1)} ${rowY(r) - 5}v27`;
      if ((n / 20) % 2 === 0) bands.push(box(x, rowY(r), 20 * ck.dx, 18));
    } else ticks += `M${x.toFixed(1)} ${rowY(r) + 3}v12`;
  }

  const stageFill = (i: number) => (i === stage ? '#e8f1fb' : i < stage ? ZONE : PANEL);

  return (
    <svg viewBox={`0 0 ${g.W} ${g.H}`} role="img" aria-labelledby="physics-onestep-title" style={{ width: '100%', height: 'auto' }}>
      <title id="physics-onestep-title">One physics step: contacts found, constraint forces solved, then speed and position advanced by one timestep</title>
      <desc>
        A side view of two gripper fingers closing on a cube that rests on the floor, with part of the arm and its
        elbow joint above. Four stage groups run in order. Position finds three contacts and a small overlap between
        the fingers and the cube. Velocity adds the finger speeds and the damping that opposes them. Force and
        acceleration adds the motor force and gravity, then the constraint solve finds the force at each contact
        that keeps the shapes apart. Integrate moves a point on a plot of the elbow&apos;s angle and speed: up by
        the acceleration times the timestep, then across by the new speed times the timestep. A strip at the bottom
        shows this step as one of 200 in a simulated second, 20 for each of 10 policy steps.
      </desc>
      <path d={box(0, 0, g.W, g.H)} fill={PAPER} />

      {/* ---- the four stage groups ---- */}
      {STAGES.map((name, i) => {
        const r = g.rail[i];
        return (
          <g key={name}>
            <path d={rbox(r.x, r.y, r.w, r.h, 6)} fill={stageFill(i)} stroke={i === stage ? EMPHASIS : LINE} strokeWidth={i === stage ? 2.4 : 1.2} />
            <T x={r.x + r.w / 2} y={r.y + r.h / 2 + 4.5} size={font} bold={i === stage} anchor="middle" fill={i === stage ? INK : MUTED}>
              {name}
            </T>
          </g>
        );
      })}

      {/* ---- the scene ---- */}
      <path d={rbox(sc.x, sc.y, sc.w, sc.h, 8)} fill={PANEL} stroke={LINE} strokeWidth="1.2" />
      <T x={sc.x + 14} y={sc.y + 22} size={font} bold>
        The grasp, from the side
      </T>

      {/* floor */}
      <path d={`M${X(16)} ${Y(FLOOR)}H${X(384)}`} stroke={INK} strokeWidth="2" />
      <path d={Array.from({ length: 24 }, (_, n) => `M${X(24 + n * 15)} ${Y(FLOOR)}l${-7 * sc.k} ${7 * sc.k}`).join('')} stroke={LINE} strokeWidth="1.2" />

      {/* arm: upper arm, elbow, forearm, wrist, palm */}
      <path d={`M${X(22)} ${Y(124)}L${X(ELBOW.x)} ${Y(ELBOW.y)}L${X(192)} ${Y(64)}`} fill="none" stroke={ROBOT_INK} strokeWidth={8 * sc.k} strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      <path d={B(188, 52, 24, 20)} fill={ROBOT_INK} opacity="0.8" />
      <path d={B(104, 70, 192, 24)} fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1.8" />
      <circle cx={X(ELBOW.x)} cy={Y(ELBOW.y)} r={8 * sc.k} fill={PANEL} stroke={step === 0 || after ? EMPHASIS : ROBOT_INK} strokeWidth={step === 0 || after ? 3 : 2} />

      {/* cube */}
      <path d={B(CUBE.x, CUBE.y, CUBE.s, CUBE.s)} fill="#ffffff" stroke={INK} strokeWidth="1.8" />

      {/* fingers, sunk into the cube; they slide out a little at Integrate */}
      <g style={slide(1)}>
        <path d={B(CUBE.x + SUNK_BEFORE - PAD_W, PAD_TOP - 2, PAD_W, PAD_BOTTOM - PAD_TOP + 2)} fill={ROBOT_FILL} fillOpacity="0.85" stroke={ROBOT_INK} strokeWidth="1.8" />
      </g>
      <g style={slide(-1)}>
        <path d={B(cubeR - SUNK_BEFORE, PAD_TOP - 2, PAD_W, PAD_BOTTOM - PAD_TOP + 2)} fill={ROBOT_FILL} fillOpacity="0.85" stroke={ROBOT_INK} strokeWidth="1.8" />
      </g>

      {/* Position: the overlap and the contacts */}
      <g style={f(step >= 1 && step <= 4)}>
        <path d={B(CUBE.x, CUBE.y, SUNK_BEFORE, PAD_BOTTOM - CUBE.y)} fill={ORANGE} fillOpacity="0.7" />
        <path d={B(cubeR - SUNK_BEFORE, CUBE.y, SUNK_BEFORE, PAD_BOTTOM - CUBE.y)} fill={ORANGE} fillOpacity="0.7" />
      </g>
      <g style={f(after)}>
        <path d={B(CUBE.x, CUBE.y, SUNK_AFTER, PAD_BOTTOM - CUBE.y)} fill={ORANGE} fillOpacity="0.7" />
        <path d={B(cubeR - SUNK_AFTER, CUBE.y, SUNK_AFTER, PAD_BOTTOM - CUBE.y)} fill={ORANGE} fillOpacity="0.7" />
      </g>
      <g style={f(step >= 1)}>
        <circle cx={X(CUBE.x + 2)} cy={Y(CONTACT_Y)} r="4.5" fill={EMPHASIS} stroke={PANEL} strokeWidth="1.2" />
        <circle cx={X(cubeR - 2)} cy={Y(CONTACT_Y)} r="4.5" fill={EMPHASIS} stroke={PANEL} strokeWidth="1.2" />
        <circle cx={X(mid)} cy={Y(FLOOR)} r="4.5" fill={EMPHASIS} stroke={PANEL} strokeWidth="1.2" />
      </g>

      {/* Velocity: finger speeds and the damping that opposes them */}
      <g style={f(step === 2)}>
        <Arrow x1={X(84)} y1={Y(120)} x2={X(124)} y2={Y(120)} color={PURPLE} width={2.6} head={9} />
        <Arrow x1={X(316)} y1={Y(120)} x2={X(276)} y2={Y(120)} color={PURPLE} width={2.6} head={9} />
        <Arrow x1={X(124)} y1={Y(138)} x2={X(104)} y2={Y(138)} color={MUTED} width={2} head={7} />
        <Arrow x1={X(276)} y1={Y(138)} x2={X(296)} y2={Y(138)} color={MUTED} width={2} head={7} />
      </g>

      {/* Force: motor and gravity, known before the solve */}
      <g style={f(step === 3 || step === 4, step === 4 ? 0.6 : 1)}>
        <Arrow x1={X(80)} y1={Y(126)} x2={X(124)} y2={Y(126)} color={ROBOT_INK} width={4.5} head={11} />
        <Arrow x1={X(320)} y1={Y(126)} x2={X(276)} y2={Y(126)} color={ROBOT_INK} width={4.5} head={11} />
        <Arrow x1={X(mid - 12)} y1={Y(198)} x2={X(mid - 12)} y2={Y(240)} color={MUTED} width={3} head={9} />
      </g>

      {/* The constraint solve: one force per contact */}
      <g style={f(step === 4)}>
        {[
          { x1: CUBE.x + 6, y1: CONTACT_Y, x2: CUBE.x + 40, y2: CONTACT_Y },
          { x1: cubeR - 6, y1: CONTACT_Y, x2: cubeR - 40, y2: CONTACT_Y },
          { x1: mid + 12, y1: FLOOR - 3, x2: mid + 12, y2: FLOOR - 45 },
        ].map((a, n) => (
          <g key={n}>
            {/* earlier guesses of the search, shorter and fainter */}
            <Arrow x1={X(a.x1)} y1={Y(a.y1)} x2={X(a.x1 + (a.x2 - a.x1) * 0.4)} y2={Y(a.y1 + (a.y2 - a.y1) * 0.4)} color={EMPHASIS} width={0} head={10} style={{ opacity: 0.35 }} />
            <Arrow x1={X(a.x1)} y1={Y(a.y1)} x2={X(a.x1 + (a.x2 - a.x1) * 0.7)} y2={Y(a.y1 + (a.y2 - a.y1) * 0.7)} color={EMPHASIS} width={0} head={10} style={{ opacity: 0.6 }} />
            <Arrow x1={X(a.x1)} y1={Y(a.y1)} x2={X(a.x2)} y2={Y(a.y2)} color={EMPHASIS} width={3.2} head={10} />
          </g>
        ))}
      </g>

      {/* scene labels */}
      <T x={X(ELBOW.x)} y={Y(ELBOW.y) - 8 * sc.k - 7} size={font} anchor="middle">
        elbow
      </T>
      <T x={X(cubeR + PAD_W + 2)} y={Y(170)} size={font}>
        finger
      </T>
      <path d={`M${X(cubeR + 2)} ${Y(232)}H${X(cubeR + PAD_W)}`} stroke={LINE} strokeWidth="1.2" />
      <T x={X(cubeR + PAD_W + 2)} y={Y(232) + 4.5} size={font}>
        cube
      </T>
      <T x={X(22)} y={Y(FLOOR) - 8} size={font}>
        floor
      </T>

      {/* legend of this step's marks */}
      {LEGENDS.map((rows, s) => (
        <g key={s} style={f(step === s)}>
          {rows.map(([mark, text], row) => {
            const y = legendY(row);
            const colour = markColour[mark];
            return (
              <g key={text}>
                {mark === 'overlap' && <path d={box(legendX + 6, y - 11, 12, 13)} fill={ORANGE} fillOpacity="0.7" />}
                {mark === 'contact' && <circle cx={legendX + 12} cy={y - 4} r="4.5" fill={EMPHASIS} />}
                {mark !== 'overlap' && mark !== 'contact' && mark !== 'none' && (
                  <Arrow x1={legendX} y1={y - 4} x2={legendX + 26} y2={y - 4} color={colour} width={mark === 'motor' ? 4 : 2.4} head={8} />
                )}
                <T x={mark === 'none' ? legendX : legendX + 34} y={y} size={12}>
                  {text}
                </T>
              </g>
            );
          })}
        </g>
      ))}

      {/* ---- the state of one joint ---- */}
      <path d={rbox(st.x, st.y, st.w, st.h, 8)} fill={PANEL} stroke={step === 0 || after ? EMPHASIS : LINE} strokeWidth={step === 0 || after ? 2 : 1.2} />
      <T x={px(14)} y={py(24)} size={font} bold>
        State of one joint: the elbow
      </T>
      <T x={px(14)} y={py(41)} size={12} fill={MUTED}>
        illustrative values, one joint of many
      </T>
      <T x={px(14)} y={py(64)} size={12} fill={MUTED}>
        angle
      </T>
      <T x={px(196)} y={py(64)} size={12} fill={MUTED}>
        speed
      </T>
      <T x={px(14)} y={py(106)} size={12} fill={MUTED}>
        acceleration, from the solve
      </T>
      <T x={px(196)} y={py(106)} size={12} fill={MUTED}>
        simulated time
      </T>
      <g style={f(!after)}>
        <T x={px(14)} y={py(82)} size={14} bold num="toy">
          0.50000 rad
        </T>
        <T x={px(196)} y={py(82)} size={14} bold num="toy">
          1.000 rad/s
        </T>
        <T x={px(196)} y={py(124)} size={14} bold>
          0 ms
        </T>
      </g>
      <g style={f(after)}>
        <T x={px(14)} y={py(82)} size={14} bold fill={EMPHASIS} num="toy">
          0.50505 rad
        </T>
        <T x={px(196)} y={py(82)} size={14} bold fill={EMPHASIS} num="toy">
          1.010 rad/s
        </T>
        <T x={px(196)} y={py(124)} size={14} bold fill={EMPHASIS}>
          5 ms
        </T>
      </g>
      <T x={px(14)} y={py(124)} size={14} fill={MUTED} style={f(step < 4)}>
        not known yet
      </T>
      <T x={px(14)} y={py(124)} size={14} bold num="toy" style={f(step >= 4)}>
        2.0 rad/s²
      </T>

      {/* the plot: angle across, speed up */}
      <path d={`M${px(PLOT.left)} ${py(PLOT.top)}V${py(PLOT.bottom)}H${px(PLOT.right)}`} fill="none" stroke={MUTED} strokeWidth="1.5" />
      <T x={px(14)} y={py(PLOT.top - 4)} size={12} fill={MUTED}>
        speed (rad/s)
      </T>
      <T x={px((PLOT.left + PLOT.right) / 2)} y={py(PLOT.bottom + 36)} size={12} anchor="middle" fill={MUTED}>
        angle (rad)
      </T>
      <path d={`M${px(PLOT.left - 5)} ${py(PLOT.y0)}h5M${px(PLOT.x0)} ${py(PLOT.bottom)}v5`} stroke={MUTED} strokeWidth="1.5" />
      <T x={px(PLOT.left - 8)} y={py(PLOT.y0 + 4)} size={12} anchor="end" num="toy">
        1.000
      </T>
      <T x={px(PLOT.x0)} y={py(PLOT.bottom + 19)} size={12} anchor="middle" num="toy">
        0.50000
      </T>
      <g style={f(after)}>
        <path d={`M${px(PLOT.left)} ${py(PLOT.y1)}H${px(PLOT.x1)}V${py(PLOT.bottom)}`} fill="none" stroke={LINE} strokeWidth="1" strokeDasharray="3 4" />
        <path d={`M${px(PLOT.left - 5)} ${py(PLOT.y1)}h5M${px(PLOT.x1)} ${py(PLOT.bottom)}v5`} stroke={MUTED} strokeWidth="1.5" />
        <T x={px(PLOT.left - 8)} y={py(PLOT.y1 + 4)} size={12} anchor="end" num="toy">
          1.010
        </T>
        <T x={px(PLOT.x1)} y={py(PLOT.bottom + 19)} size={12} anchor="middle" num="toy">
          0.50505
        </T>
        <Arrow x1={px(PLOT.x0)} y1={py(PLOT.y0 - 8)} x2={px(PLOT.x0)} y2={py(PLOT.y1 + 3)} color={PURPLE} width={2.6} head={9} />
        <Arrow x1={px(PLOT.x0 + 5)} y1={py(PLOT.y1)} x2={px(PLOT.x1 - 8)} y2={py(PLOT.y1)} color={EMPHASIS} width={2.6} head={9} />
        <T x={px(PLOT.x0 + 10)} y={py(222)} size={12} bold fill={PURPLE}>
          first, speed
        </T>
        <T x={px(PLOT.x0 + 10)} y={py(238)} size={12} fill={PURPLE} num="toy">
          + 0.005 x 2.0
        </T>
        <T x={px((PLOT.x0 + PLOT.x1) / 2 + 4)} y={py(PLOT.y1 - 10)} size={12} anchor="middle" fill={EMPHASIS} num="toy">
          then angle: + 0.005 x 1.010
        </T>
        <circle cx={px(PLOT.x1)} cy={py(PLOT.y1)} r="5.5" fill={EMPHASIS} />
        <T x={px(PLOT.x1 - 9)} y={py(PLOT.y1 + 20)} size={12} anchor="end" fill={EMPHASIS}>
          after
        </T>
      </g>
      <circle cx={px(PLOT.x0)} cy={py(PLOT.y0)} r="5.5" fill={after ? PANEL : INK} stroke={INK} strokeWidth="1.5" />
      <T x={px(PLOT.x0 + 10)} y={py(PLOT.y0 + 18)} size={12}>
        before
      </T>

      {/* the two lines of the integrator */}
      <T x={px(14)} y={py(356)} size={12} bold={stage === 3}>
        new speed = speed + timestep x acceleration
      </T>
      <T x={px(14)} y={py(373)} size={12} fill={PURPLE} num="toy" style={f(after)}>
        = 1.000 + 0.005 x 2.0 = 1.010 rad/s
      </T>
      <T x={px(14)} y={py(396)} size={12} bold={stage === 3}>
        new angle = angle + timestep x new speed
      </T>
      <T x={px(14)} y={py(413)} size={12} fill={EMPHASIS} num="toy" style={f(after)}>
        = 0.50000 + 0.005 x 1.010 = 0.50505 rad
      </T>

      {/* ---- the clock: this step among the 200 of a simulated second ---- */}
      <T x={ck.x - 8} y={ck.y + 14} size={font} bold>
        One simulated second of the pick-cube task
      </T>
      <T x={narrow ? ck.x - 8 : ck.x + 300} y={ck.y + (narrow ? 31 : 14)} size={12} fill={MUTED}>
        200 physics steps: 10 policy steps of 20 each
      </T>
      {bands.map((d, n) => (
        <path key={n} d={d} fill={ZONE} />
      ))}
      <path d={ticks} stroke={LINE} strokeWidth="1" />
      <path d={starts} stroke={INK} strokeWidth="1.8" />
      <g style={f(step === 6)}>
        <path d={`M${ck.x} ${rowY(0) - 5}v27`} stroke={EMPHASIS} strokeWidth="3.4" />
        <T x={ck.x + 8} y={rowY(ck.rows - 1) + 40} size={12} bold fill={EMPHASIS}>
          The step above is the first tick: 5 ms.
        </T>
      </g>
      <T x={g.W - ck.x + 8} y={rowY(ck.rows - 1) + 40} size={12} anchor="end" fill={MUTED} style={f(narrow ? step !== 6 : true)}>
        tall tick: the policy acts
      </T>
    </svg>
  );
}
