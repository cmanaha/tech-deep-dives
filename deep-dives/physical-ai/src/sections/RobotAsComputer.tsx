import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Toy, Derived } from '../components/Cite';
import { Figure, AnimatedFigure } from '../components/Figure';
import { Formula, M } from '../components/Math';
import { linear } from '../lib/scale';
import { ARM, TASK_STORY } from '../lib/task';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const ROBOT_FILL = '#fff6d6';
const ROBOT_INK = '#7a5c00';
const CPU_FILL = '#e8f1fb';
const CPU_INK = '#1f5fa8';
const GPU_FILL = '#e6f6ea';
const GPU_INK = '#1e7b3a';
const NEUTRAL_INK = '#5f6b7a';
const EMPHASIS = '#0972d3';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 560, margin: '0 auto' };

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/* ------------------------------------------------------------------------ */
/* Diagram 3.1: the arm as inputs and outputs                               */
/* ------------------------------------------------------------------------ */

const JOINTS = [
  { n: 1, x: 90, y: 248 },
  { n: 2, x: 90, y: 214 },
  { n: 3, x: 160, y: 120 },
  { n: 4, x: 255, y: 130 },
  { n: 5, x: 290, y: 160 },
  { n: 6, x: 310, y: 192 },
];

const JOINT_NAMES = [
  ['1  shoulder_pan', '4  wrist_flex'],
  ['2  shoulder_lift', '5  wrist_roll'],
  ['3  elbow_flex', '6  gripper'],
];

function ArmIoDiagram() {
  const linkPath = JOINTS.map((j, i) => `${i === 0 ? 'M' : 'L'}${j.x} ${j.y}`).join(' ');
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 492" role="img" aria-labelledby="robot-computer-io-title" style={{ width: '100%', height: 'auto' }}>
        <title id="robot-computer-io-title">The SO-101 follower arm as inputs and outputs</title>
        <desc>
          A side view of the arm with its six servos numbered, a camera on the wrist and a camera above the scene, a
          block and a cup on the table. Below, six joint angles and two camera images flow into the host computer and
          six joint targets flow back out.
        </desc>
        <defs>
          <marker id="robot-computer-io-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill={NEUTRAL_INK} />
          </marker>
        </defs>
        <rect x="0" y="0" width="400" height="492" fill="#fbfbfd" />

        {/* table, block, cup */}
        <line x1="20" y1="270" x2="380" y2="270" stroke={NEUTRAL_INK} strokeWidth="2" />
        <rect x="300" y="250" width="20" height="20" fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1.5" />
        <path d="M345 236 L375 236 L370 270 L350 270 Z" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <text x="310" y="288" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill={INK}>
          block
        </text>
        <text x="360" y="288" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill={INK}>
          cup
        </text>

        {/* top camera */}
        <path d="M203 38 L170 80 M203 38 L236 80" stroke={NEUTRAL_INK} strokeWidth="1" strokeDasharray="4 3" fill="none" />
        <rect x="188" y="14" width="30" height="16" rx="2" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <path d="M197 30 L209 30 L213 38 L193 38 Z" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <text x="226" y="27" fontFamily="sans-serif" fontSize="12" fill={INK}>
          top camera
        </text>

        {/* arm: base, links, gripper fingers */}
        <rect x="66" y="252" width="48" height="18" rx="2" fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1.5" />
        <path d={linkPath} stroke={ROBOT_INK} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M310 192 L302 236 M310 192 L324 232" stroke={ROBOT_INK} strokeWidth="5" strokeLinecap="round" fill="none" />

        {/* wrist camera */}
        <line x1="306" y1="148" x2="298" y2="156" stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <rect x="298" y="134" width="24" height="14" rx="2" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <text x="312" y="126" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill={INK}>
          wrist camera
        </text>

        {/* joints */}
        {JOINTS.map((j) => (
          <g key={j.n}>
            <circle cx={j.x} cy={j.y} r="11" fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1.5" />
            <text x={j.x} y={j.y + 4} textAnchor="middle" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill={ROBOT_INK}>
              {j.n}
            </text>
          </g>
        ))}

        {/* legend */}
        <text x="24" y="308" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill={INK}>
          Six servos on one serial bus, each with an encoder
        </text>
        {JOINT_NAMES.map((row, i) => (
          <g key={row[0]}>
            <text x="24" y={328 + i * 18} fontFamily="sans-serif" fontSize="12" fill={INK}>
              {row[0]}
            </text>
            <text x="210" y={328 + i * 18} fontFamily="sans-serif" fontSize="12" fill={INK}>
              {row[1]}
            </text>
          </g>
        ))}

        {/* in and out */}
        <line x1="185" y1="378" x2="185" y2="414" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#robot-computer-io-arrow)" />
        <line x1="215" y1="416" x2="215" y2="380" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#robot-computer-io-arrow)" />
        <text x="175" y="392" textAnchor="end" fontFamily="sans-serif" fontSize="12" fill={INK}>
          in: 6 joint angles
        </text>
        <text x="175" y="408" textAnchor="end" fontFamily="sans-serif" fontSize="12" fill={INK}>
          + 2 camera images
        </text>
        <text x="225" y="400" fontFamily="sans-serif" fontSize="12" fill={INK}>
          out: 6 joint targets
        </text>

        {/* host */}
        <rect x="80" y="420" width="240" height="60" rx="4" fill={CPU_FILL} stroke={CPU_INK} strokeWidth="1.5" />
        <text x="200" y="445" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill={INK}>
          Host computer
        </text>
        <text x="200" y="465" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill={INK}>
          runs the loop 30 times a second
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 3.2 (animated): the rate ladder                                  */
/* ------------------------------------------------------------------------ */

const CELLS = Array.from({ length: 50 }, (_, i) => i);
const CELL_W = 6.8;
const STRIP_X = 30;

const LADDER_STEPS = [
  'The servo loop. Inside each servo a position controller drives the motor until the measured angle matches the one goal it holds. The host is not involved.',
  'The host loop. Every 33.3 ms the host reads six angles and writes six new goals, so each servo is now chasing a goal that moves a little on every tick.',
  'The policy is called. It takes the observation and returns a chunk: the next 50 actions in one answer.',
  'The host plays the chunk, one action per tick. The policy is idle while the arm moves.',
  'After 50 ticks, 1.67 s, the chunk is used up. The policy is called again with a fresh observation and the cycle repeats.',
];

function staircase(): string {
  let d = 'M40 440';
  for (let i = 0; i < 8; i += 1) {
    const x = 40 + (i + 1) * 41.25;
    const y = 440 - (i + 1) * 9;
    d += ` V${y} H${x}`;
  }
  return d;
}

function RateLadder({ step, reduced }: { step: number; reduced: boolean }) {
  const s = step + 1;
  const fade = (on: boolean): CSSProperties => ({ opacity: on ? 1 : 0, transition: reduced ? 'none' : 'opacity 300ms ease' });
  const move = (dy: number): CSSProperties => ({
    transform: `translate(0px, ${dy}px)`,
    transition: reduced ? 'none' : 'transform 350ms ease, opacity 300ms ease',
  });
  const played = s >= 5 ? 50 : s === 4 ? 30 : 0;
  const active = { policy: s === 3 || s === 5, host: s === 2 || s === 4, servo: s === 1 };
  const lane = (on: boolean, ink: string) => ({ stroke: on ? EMPHASIS : ink, strokeWidth: on ? 2.5 : 1 });
  const label = { fontFamily: 'sans-serif', fontSize: 12, fill: INK } as const;
  const title = { fontFamily: 'sans-serif', fontSize: 13, fontWeight: 'bold', fill: INK } as const;

  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 470" role="img" aria-labelledby="robot-computer-ladder-title" style={{ width: '100%', height: 'auto' }}>
        <title id="robot-computer-ladder-title">Three loops at three rates: policy, host loop and servo loop</title>
        <desc>
          Three stacked lanes. The policy at the top is called once per chunk and returns 50 actions. The host loop in
          the middle writes six goals every 33.3 ms and plays the chunk one action per tick. The servo loop at the
          bottom drives the motor until the measured angle matches the goal.
        </desc>
        <defs>
          <marker id="robot-computer-ladder-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill={NEUTRAL_INK} />
          </marker>
        </defs>
        <rect x="0" y="0" width="400" height="470" fill="#fbfbfd" />

        {/* policy lane */}
        <rect x="10" y="10" width="380" height="96" rx="4" fill={GPU_FILL} {...lane(active.policy, GPU_INK)} />
        <text x="24" y="32" {...title}>
          Policy
        </text>
        <text x="24" y="50" {...label}>
          called once per chunk
        </text>
        <text x="376" y="32" textAnchor="end" {...label} style={fade(s === 3)}>
          called: returns 50 actions
        </text>
        <text x="376" y="32" textAnchor="end" {...label} style={fade(s === 4)}>
          idle
        </text>
        <text x="376" y="32" textAnchor="end" {...label} style={fade(s === 5)}>
          called again
        </text>
        <text x="30" y="98" {...label} style={fade(s === 3 || s === 5)}>
          a chunk of 50 actions
        </text>

        {/* host lane */}
        <rect x="10" y="130" width="380" height="130" rx="4" fill={CPU_FILL} {...lane(active.host, CPU_INK)} />
        <text x="24" y="152" {...title}>
          Host loop
        </text>
        <text x="24" y="170" {...label}>
          writes 6 goals every 33.3 ms (30 Hz)
        </text>
        <path d="M28 186 H372 V206 H28 Z" fill="none" stroke={CPU_INK} strokeWidth="1" strokeDasharray="3 3" />
        <g style={fade(s >= 2)}>
          {CELLS.map((i) => (
            <line key={i} x1={STRIP_X + i * CELL_W + 2.9} y1="211" x2={STRIP_X + i * CELL_W + 2.9} y2="219" stroke={CPU_INK} strokeWidth="1" />
          ))}
        </g>
        <text x="30" y="240" {...label} style={fade(s >= 4)}>
          0 s
        </text>
        <text x="370" y="240" textAnchor="end" {...label} style={fade(s >= 4)}>
          1.67 s
        </text>
        <text x="200" y="240" textAnchor="middle" {...label} style={fade(s === 2 || s === 3)}>
          one mark is one tick
        </text>
        <text x="200" y="240" textAnchor="middle" {...label} style={fade(s === 4)}>
          playing, one action per tick
        </text>
        <text x="200" y="240" textAnchor="middle" {...label} style={fade(s === 5)}>
          chunk used up
        </text>

        {/* servo lane */}
        <rect x="10" y="284" width="380" height="176" rx="4" fill={ROBOT_FILL} {...lane(active.servo, ROBOT_INK)} />
        <text x="24" y="306" {...title}>
          Servo loop
        </text>
        <text x="24" y="324" {...label}>
          inside each servo: chases the last goal it was given
        </text>
        <g style={fade(s === 1)}>
          <path d="M40 368 H370" fill="none" stroke={ROBOT_INK} strokeWidth="1.5" strokeDasharray="5 4" />
          <path d="M40 440 C100 440 110 373 190 371 L370 371" fill="none" stroke={EMPHASIS} strokeWidth="2" />
          <text x="372" y="360" textAnchor="end" {...label}>
            one goal
          </text>
        </g>
        <g style={fade(s >= 2)}>
          <path d={staircase()} fill="none" stroke={ROBOT_INK} strokeWidth="1.5" strokeDasharray="5 4" />
          <path d="M40 440 H58 L370 376" fill="none" stroke={EMPHASIS} strokeWidth="2" />
          <text x="44" y="360" {...label}>
            a new goal every tick
          </text>
        </g>
        <text x="372" y="446" textAnchor="end" {...label}>
          measured angle
        </text>

        {/* arrows between lanes */}
        <g style={fade(s === 3 || s === 5)}>
          <line x1="215" y1="108" x2="215" y2="126" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#robot-computer-ladder-arrow)" />
          <line x1="185" y1="128" x2="185" y2="110" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#robot-computer-ladder-arrow)" />
          <text x="224" y="123" {...label}>
            50 actions
          </text>
          <text x="176" y="123" textAnchor="end" {...label}>
            observation
          </text>
        </g>
        <g style={fade(s >= 2)}>
          <line x1="215" y1="262" x2="215" y2="280" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#robot-computer-ladder-arrow)" />
          <line x1="185" y1="282" x2="185" y2="264" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#robot-computer-ladder-arrow)" />
          <text x="224" y="277" {...label}>
            6 goals
          </text>
          <text x="176" y="277" textAnchor="end" {...label}>
            6 angles
          </text>
        </g>

        {/* the next chunk, waiting in the policy lane at the last step */}
        <g style={fade(s === 5)}>
          {CELLS.map((i) => (
            <rect key={i} x={STRIP_X + i * CELL_W} y="64" width="5.8" height="16" fill="#ffffff" stroke={GPU_INK} strokeWidth="1" />
          ))}
        </g>

        {/* the chunk: appears in the policy lane, drops into the host lane, is played cell by cell */}
        <g style={{ ...move(s >= 4 ? 124 : 0), opacity: s >= 3 ? 1 : 0 }}>
          {CELLS.map((i) => (
            <rect
              key={i}
              x={STRIP_X + i * CELL_W}
              y="64"
              width="5.8"
              height="16"
              fill={i < played ? CPU_INK : '#ffffff'}
              stroke={i < played ? CPU_INK : GPU_INK}
              strokeWidth="1"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 3.3: delay to distance                                           */
/* ------------------------------------------------------------------------ */

const SPEED_M_S = 0.25;
const DELAY_POINTS = [
  { ms: 33.3, mm: '8.3', lx: 10, ly: -12 },
  { ms: 100, mm: '25', lx: -8, ly: -10 },
  { ms: 250, mm: '62.5', lx: -10, ly: -3 },
];
const BACKLASH_MM = 3.6;

function DelayDistanceChart() {
  const x = linear(0, 250, 62, 372);
  const y = linear(0, 65, 250, 24);
  const mm = (ms: number) => SPEED_M_S * ms;
  const label = { fontFamily: 'sans-serif', fontSize: 12, fill: INK } as const;
  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <svg viewBox="0 0 400 304" role="img" aria-labelledby="robot-computer-delay-title" style={{ width: '100%', height: 'auto' }}>
        <title id="robot-computer-delay-title">Gripper travel against delay at 0.25 metres per second</title>
        <desc>
          A straight line through the origin. At 33.3 ms of delay the gripper has travelled 8.3 mm, at 100 ms 25 mm and
          at 250 ms 62.5 mm. A dashed line near the bottom marks the 3.6 mm of gear backlash.
        </desc>
        <rect x="0" y="0" width="400" height="304" fill="#fbfbfd" />

        {/* axes */}
        <line x1={x(0)} y1={y(0)} x2={x(250)} y2={y(0)} stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <line x1={x(0)} y1={y(0)} x2={x(0)} y2={y(65)} stroke={NEUTRAL_INK} strokeWidth="1.5" />
        {[0, 33.3, 100, 250].map((v) => (
          <g key={v}>
            <line x1={x(v)} y1={y(0)} x2={x(v)} y2={y(0) + 5} stroke={NEUTRAL_INK} strokeWidth="1" />
            <text x={x(v)} y={y(0) + 19} textAnchor="middle" {...label}>
              {v}
            </text>
          </g>
        ))}
        {DELAY_POINTS.map((p) => (
          <g key={p.ms}>
            <line x1={x(0) - 5} y1={y(mm(p.ms))} x2={x(0)} y2={y(mm(p.ms))} stroke={NEUTRAL_INK} strokeWidth="1" />
            <text x={x(0) - 8} y={y(mm(p.ms)) + 4} textAnchor="end" {...label}>
              {p.mm}
            </text>
          </g>
        ))}
        <text x={x(0) - 8} y={y(0) + 4} textAnchor="end" {...label}>
          0
        </text>
        <text x={x(125)} y="294" textAnchor="middle" {...label}>
          delay (ms)
        </text>
        <text x="16" y={y(32.5)} textAnchor="middle" transform={`rotate(-90 16 ${y(32.5)})`} {...label}>
          gripper travel (mm)
        </text>

        {/* the floor: gear backlash */}
        <line x1={x(0)} y1={y(BACKLASH_MM)} x2={x(250)} y2={y(BACKLASH_MM)} stroke={ROBOT_INK} strokeWidth="1.5" strokeDasharray="5 4" />
        <text x={x(250)} y={y(BACKLASH_MM) - 7} textAnchor="end" {...label} fill={ROBOT_INK}>
          gear backlash, 3.6 mm
        </text>

        {/* distance = speed x delay */}
        <line x1={x(0)} y1={y(0)} x2={x(250)} y2={y(mm(250))} stroke={EMPHASIS} strokeWidth="2.5" />
        {DELAY_POINTS.map((p) => (
          <g key={p.ms}>
            <circle cx={x(p.ms)} cy={y(mm(p.ms))} r="4.5" fill={EMPHASIS} />
            <text x={x(p.ms) + p.lx} y={y(mm(p.ms)) + p.ly} textAnchor="end" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill={INK}>
              {p.mm} mm
            </text>
          </g>
        ))}
        <text x="74" y="40" {...label}>
          at 0.25 m/s (illustrative speed)
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function RobotAsComputer() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Know what the arm senses, what it can be told to do and how often, and why 100 milliseconds is a distance (LeRobot v0.7.0, the SO-ARM100 hardware repository and the Feetech STS3215 datasheet, read 2026-11-20)"
          >
            3. The Robot as a Computer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            To the software that runs it, a robot arm is a device with inputs, outputs and a clock. A few numbers and
            images come in, a few numbers go out, and the exchange repeats many times a second. This section builds
            that picture on the {ARM}, the arm this dive follows as it learns to {TASK_STORY}: what comes in, what
            goes out, how often, and what it costs when the answer arrives late.
          </Box>
          <Box variant="p">
            Every later section reuses these terms. The models in the next sections are trained on the inputs and
            outputs defined here, and the machines sized at the end of the dive are sized against the deadline
            defined here.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="What teleoperation looks like at the bench, and where the computer is">
            A leader arm in the hand
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Two small arms are clamped to a table. You hold one by its handle and move it. The other, a hand&apos;s
            width away, makes the same move a moment later: it reaches over a block, closes its gripper, lifts, and
            lets go above a cup. Driving a robot by hand like this is teleoperation. The arm you hold is the leader
            and the arm that copies it is the follower.{' '}
            <Cite id="F01-2">SO-ARM100 README, Sourcing Parts</Cite>
          </Box>
          <Box variant="p">
            The leader&apos;s motors are switched off. It is only measured: the software reads the angle of each of
            its six joints and hands those six numbers to the follower as targets. In our reading of the code,
            teleoperation on this kit is copying six numbers from one arm to the other, many times a second.{' '}
            <Cite id="F01-24">LeRobot so_leader.py, get_action()</Cite>
          </Box>
          <Box variant="p">
            Neither arm contains a computer. Each plugs into a laptop or a small board through a USB cable, the
            cameras plug into the same machine, and that machine, the host, runs everything.{' '}
            <Cite id="F01-88">LeRobot SO-101 guide, USB ports</Cite> From here on, the robot is the follower plus the
            host. The leader is how a person shows it what to do, and the recordings of those sessions are the
            demonstrations that section 4, Learning From Demonstrations, trains on.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Two kinds of input, and what each one can and cannot tell the robot">
            What goes in: sensors
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Everything the robot knows at one instant is called an observation. On the {ARM} it has two parts: where
            the arm&apos;s own joints are, and what the cameras see.
          </Box>
          <Box variant="p">
            Joint angles come from encoders. An encoder is a sensor on a joint that reports its angle as a whole
            number of steps; the {ARM}&apos;s encoders count 4096 steps per full turn. Reading all six gives the
            arm&apos;s pose. A robot&apos;s sense of its own body is called proprioception, and on this arm
            proprioception is those six angles and nothing else.{' '}
            <Cite id="F01-11">rustypot sts3215.rs, resolution</Cite> The servos hold speed, load and current
            readings too, but in our reading of the driver it reads position only, so the arm knows where it is and
            has no measure of how hard it is pushing.{' '}
            <Cite id="F01-23">LeRobot so_follower.py, observation features</Cite>
          </Box>
          <Box variant="p">
            The encoders say nothing about the block or the cup. That comes from two ordinary colour cameras. The
            tutorial names them <code>wrist</code> and <code>top</code>: the first rides on the arm and sees what is
            between the fingers, the second is fixed and sees the whole scene.{' '}
            <Cite id="F01-31">LeRobot imitation learning tutorial, cameras</Cite> The code sets no default
            resolution; the documentation and every {ARM} example use 640x480 pixels at 30 frames per second.{' '}
            <Cite id="F01-30">LeRobot cameras guide and camera configs</Cite>
          </Box>
          <Box variant="p">
            In a recording, the joint half of one observation is stored as <code>observation.state</code>, a vector
            of six <code>float32</code> values, next to one image per camera.{' '}
            <Cite id="F01-26">LeRobot feature_utils.py, dataset features</Cite>
          </Box>
          <Figure
            cites="F01-8 F01-26 F01-28 F01-30 F01-31"
            caption={
              <>
                Read it top to bottom: the arm and its cameras sense, the host decides, six targets go back. The
                numbered circles are the six servos. Illustrative layout, not to scale.
              </>
            }
          >
            <ArmIoDiagram />
          </Figure>
          <ExpandableSection headerText="From encoder steps to degrees: what the six numbers are measured in">
            <SpaceBetween size="s">
              <Box variant="p">
                A raw step count depends on how each servo was screwed onto the arm, so two arms in the same pose
                report different counts. Calibration removes that: you move each joint through its range once and
                the software records the minimum and maximum, so that a leader and a follower in the same pose
                report the same values.{' '}
                <Cite id="F01-20">LeRobot motors_bus.py, record_calibration()</Cite>
              </Box>
              <Box variant="p">
                After calibration LeRobot reports the five arm joints in degrees from the middle of each
                joint&apos;s range, and the gripper on a scale of 0 to 100 across its range. With{' '}
                <M>{String.raw`\mathrm{raw}`}</M> the encoder reading in steps and <M>{String.raw`\mathrm{mid}`}</M>{' '}
                the midpoint of the calibrated range in steps:
              </Box>
              <Formula
                name="Encoder steps to degrees"
                tex={String.raw`\mathrm{degrees} = (\mathrm{raw} - \mathrm{mid}) \times \frac{360}{4095}`}
                source={<Cite id="F01-18">LeRobot motors_bus.py, _normalize()</Cite>}
              />
              <Box variant="p">
                The difference <M>{String.raw`\mathrm{raw} - \mathrm{mid}`}</M> is how many steps the joint is from
                its centre, and the factor 360 / 4095 turns steps into degrees. As an illustration, a reading of <Toy>3072</Toy> with
                a midpoint of <Toy>2048</Toy> is <Toy>1024</Toy> steps from centre, and <Toy>1024</Toy> x 360 /
                4095 = <Toy>90.02</Toy> degrees.{' '}
                <Cite id="F01-18">LeRobot motors_bus.py, normalisation</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What the arm can be told, and the two choices every robot model makes about how to say it"
          >
            What comes out: actions
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An action is what the robot is told to do at one instant. On the {ARM} it is six target angles, one per
            servo, under the same names and in the same units as the six measured angles. Observation and action
            are the same six numbers, one measured and one asked for.{' '}
            <Cite id="F01-26">LeRobot feature_utils.py, dataset features</Cite> During teleoperation a person picks
            the action: the recorded <code>action</code> is the leader&apos;s pose at that instant, and{' '}
            <code>observation.state</code> is the follower&apos;s measured pose just before, so the follower is
            always chasing.{' '}
            <Cite id="F01-27">LeRobot lerobot_record.py, record_loop()</Cite> Later a trained model picks the
            action instead. That model is called a policy.
          </Box>
          <Box variant="p">
            The part that does the chasing is the servo: a motor, a gearbox, an encoder and a small microcontroller
            in one box, whose job is to hold whatever angle it was last told. The program inside it is a position
            controller. Over and over, it subtracts the measured angle from the goal angle to get an error and
            drives the motor to shrink that error. The host never drives a motor directly: it writes a goal angle
            into the servo and reads the measured angle back.{' '}
            <Cite id="F01-14">rustypot sts3215.rs, register table</Cite>
          </Box>
          <Box variant="p">
            The controller is tuned by numbers called gains. The servo uses the PID (proportional-integral-derivative)
            design, a controller that sets the motor drive from three views of the error: its size now, its sum
            over time, and how fast it is changing. Write <M>e_t</M> for the error on pass{' '}
            <M>t</M> of the controller, the goal angle minus the measured angle, and <M>P</M>, <M>I</M> and{' '}
            <M>D</M> for the three gains. The textbook form is:
          </Box>
          <Formula
            name="PID position controller, textbook form"
            tex={String.raw`\begin{aligned} \mathrm{drive}_t = {} & P\,e_t + I \sum_{k \le t} e_k \\ & + D\,(e_t - e_{t-1}) \end{aligned}`}
            source={<>the standard form; the gains this arm writes are in <Cite id="F01-16">LeRobot so_follower.py, configure()</Cite></>}
          />
          <Box variant="p">
            The first term is the error now: the P gain sets how hard the motor pushes for each step of error, so
            the joint pushes harder the further it is from its goal. The last term is the change in error since the
            previous pass: the D gain brakes the joint when the error is shrinking fast. The middle term is the sum
            of every error so far: the I gain adds a push that builds up while an error persists. LeRobot writes
            P = 16, I = 0 and D = 32 into each follower servo when it connects, which switches the integral term off:
            the joints run as PD (proportional-derivative) controllers, and a joint holding a load can sit
            slightly short of its goal.{' '}
            <Cite id="F01-16">LeRobot so_follower.py, configure()</Cite> The formula is the standard one. Neither
            Feetech document read for this dive states how often the servo runs it.{' '}
            <Cite id="F01-45">Feetech STS3215 specification</Cite>
          </Box>
          <Box variant="p">
            A position controller takes one kind of order: go to this angle. The servo has no mode that holds a
            chosen force, so the {ARM} can be told where to go and cannot be told how hard to push.{' '}
            <Cite id="F01-15">rustypot sts3215.rs, operating modes</Cite>
          </Box>
          <Box variant="p">
            Each joint that moves independently is one degree of freedom (DoF): one number needed to say where the
            mechanism is. The {ARM} has five rotary joints that place and orient the gripper (shoulder pan,
            shoulder lift, elbow flex, wrist flex, wrist roll) and a sixth servo that opens and closes it. That is
            five degrees of freedom plus a gripper, and six numbers per action.{' '}
            <Cite id="F01-8">LeRobot so_follower.py, motor list</Cite> A loose object has six degrees of freedom,
            three of position and three of orientation, so in our reading of general kinematics a five-joint arm
            cannot reach every position at every angle. For a block approached from above, the missing one does not
            get in the way.{' '}
            <Cite id="F01-52">SO-ARM100 changelog</Cite>
          </Box>
          <Box variant="p">
            There are two ways to say where the arm should go. A joint-space action gives one target angle per
            motor, which is what the servos take directly. An end-effector action gives the position and
            orientation of the end effector, the tool at the end of the arm (here the gripper), in x, y, z
            coordinates. Software then converts that pose into joint angles, a step called inverse kinematics, and
            for that it needs a kinematic model: a file that describes the arm&apos;s link lengths and joint axes.
            Joint space is LeRobot&apos;s default and needs no model of the arm. End-effector space says where the
            gripper should go, which the documentation calls more intuitive for pick-and-place.{' '}
            <Cite id="F01-53">LeRobot action representations guide, joint and end-effector space</Cite>
          </Box>
          <Box variant="p">
            The second choice is what each number is measured from. An absolute action is the target itself:
            elbow to <Toy>40</Toy> degrees. A relative action is an offset from where the robot was when the policy
            made its prediction: elbow 5 degrees further than now. (Both angles are illustrations.) A third form,
            delta, measures each action from the previous one, so errors add up along the sequence. Absolute is
            LeRobot&apos;s default.{' '}
            <Cite id="F01-55">LeRobot action representations guide, absolute, relative and delta</Cite>
          </Box>
          <Box variant="p">
            For one arm and one task, stay with the defaults, absolute joint targets: nothing needs converting and
            the recorded numbers are the ones the servos receive. The opposite corner, relative end-effector
            actions, describes a motion without naming any robot&apos;s joints. NVIDIA adopted it for its GR00T
            N1.7 model and credits it for transfer between different robot bodies.{' '}
            <Cite id="F01-60">Isaac-GR00T README, What&apos;s new</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Three loops at three rates on one arm, and how a slow model drives a fast one">
            How often: the rate ladder
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The robot runs on a clock. The host repeats one short cycle: read the six angles and the latest camera
            frames, decide on an action, write six goals to the servos, then sleep until the next cycle is due.{' '}
            <Cite id="F01-33">LeRobot lerobot_record.py, record_loop()</Cite> One cycle is a tick, and the number
            of ticks per second is the control rate, given in hertz (Hz, times per second). LeRobot records at 30
            Hz by default, so one tick is 33.3 ms.{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>
          </Box>
          <Box variant="p">
            The end of each tick is a deadline, and it is a soft one. The loop is ordinary Python on a desktop
            operating system. When a tick overruns, LeRobot logs a warning and the arm acts late.{' '}
            <Cite id="F01-36">LeRobot cycle_timer.py, wait()</Cite>
          </Box>
          <Box variant="p">The host loop is the middle one of three, each feeding the one below it.</Box>
          <ul style={LIST}>
            <li>
              <strong>Servo loop.</strong> Inside each servo, the position controller chases the last goal it was
              given. It runs on the servo&apos;s own microcontroller and costs the host nothing.
            </li>
            <li>
              <strong>Host loop.</strong> At 30 Hz it reads the sensors and writes six new goals.
            </li>
            <li>
              <strong>Policy.</strong> A model too slow to answer inside one tick is called less often and answers
              with an action chunk, the next several actions at once (section 4 explains why this works). In our
              reading of the defaults, a policy with a 50-action chunk at 30 Hz is called once every 1.67 s, and
              the host plays one action per tick in between.{' '}
              <Cite id="F01-81" kind="our-reading">
                LeRobot inference guide
              </Cite>
            </li>
          </ul>
          <AnimatedFigure
            name="the rate ladder"
            steps={LADDER_STEPS}
            intervalMs={2600}
            cites="F01-28 F01-81"
            caption={
              <>
                Step through from the bottom lane up. Each loop only has to keep the one below it supplied: the
                servo with a goal, the host with a chunk. The curves in the bottom lane are illustrative, not
                measured.
              </>
            }
          >
            {(step, reduced) => <RateLadder step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            The pattern is general. A slower loop on top plans and a faster, simpler loop underneath tracks;
            robotics calls the first a planner and the second a controller, and larger robots stack more of them.
            NVIDIA&apos;s research page for its GR00T 2 model describes four layers on a Unitree G1, a humanoid
            (a robot with two legs and two arms). The table sets NVIDIA&apos;s reported figures beside the{' '}
            {ARM}&apos;s.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560 }}>
              <thead>
                <tr>
                  <th style={TH}>Rung</th>
                  <th style={TH}>{ARM} with LeRobot v0.7.0</th>
                  <th style={TH}>Unitree G1 with GR00T 2, as NVIDIA reports it</th>
                  <th style={TH}>Sources</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Joint loop</td>
                  <td style={TD}>Position controller inside each servo; rate not stated in the documents read</td>
                  <td style={TD}>PD control at each joint, labelled 1 kHz</td>
                  <td style={TD}>
                    <Cite id="F01-45">Feetech STS3215 specification</Cite>{' '}
                    <Cite id="F01-73">NVIDIA GR00T 2 research page</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Stream of joint targets</td>
                  <td style={TD}>Host loop at 30 Hz</td>
                  <td style={TD}>Whole-body controller, a small network that turns the plan into joint targets, at 50 Hz</td>
                  <td style={TD}>
                    <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>{' '}
                    <Cite id="F01-73">NVIDIA GR00T 2 research page</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Policy</td>
                  <td style={TD}>One call per chunk: 50 actions, 1.67 s</td>
                  <td style={TD}>Plans 1.6 s chunks about once per second; 124 ms per prediction on the robot&apos;s onboard computer</td>
                  <td style={TD}>
                    <Cite id="F01-81" kind="our-reading">
                      LeRobot inference guide
                    </Cite>{' '}
                    <Cite id="F01-73">NVIDIA GR00T 2 research page</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Planner</td>
                  <td style={TD}>Optional language model that picks the next instruction, off the control path</td>
                  <td style={TD}>A reasoning model that chooses the task, the only layer that runs off the robot</td>
                  <td style={TD}>
                    <Cite id="F01-81" kind="our-reading">
                      LeRobot inference guide
                    </Cite>{' '}
                    <Cite id="F01-73">NVIDIA GR00T 2 research page</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Read down either column and each rung is slower and does more thinking than the one beneath it. The
            bottom rung is the one the {ARM} leaves unstated and the humanoid puts at 1 kHz, a thousand passes a
            second.{' '}
            <Cite id="F01-73">NVIDIA GR00T 2 research page</Cite>
          </Box>
          <ExpandableSection headerText="A second published ladder: Figure's Helix 02">
            <Box variant="p">
              Figure reported three layers for its Helix 02 humanoid model on 2026-01-27: a slow reasoning layer,
              a layer producing full-body joint targets at 200 Hz, and beneath them a 10-million-parameter network
              that outputs joint-level commands at 1 kHz. Helix 2.5, posted 2026-09-17, is Figure&apos;s newest
              model and states no control rate.{' '}
              <Cite id="F01-72">Figure, Helix 02 post</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Turn milliseconds into millimetres, and find how much delay your task can absorb">
            Worked example: delay is distance
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The arm does not pause while the computer works. Between the moment a camera captures the scene and the
            moment the servos receive the action computed from it, the gripper keeps moving on its previous orders.
            How far it moves in that time is the error the delay causes. With <M>v</M> the gripper&apos;s speed in metres
            per second, <M>{String.raw`\tau`}</M> the delay from capture to command in seconds and <M>d</M> the
            distance in metres:
          </Box>
          <Formula
            name="Distance travelled during the delay"
            tex={String.raw`d = v \, \tau`}
            source={
              <Cite id="F01-83" kind="derived">
                speed times delay
              </Cite>
            }
          />
          <Box variant="p">
            The task sets the speed and the computer sets the delay. Their product is a length on the table, which
            is why latency on a robot is a physical quantity: 100 ms is a distance.
          </Box>
          <Box variant="p">
            Take the {ARM} carrying the block toward the cup at 0.25 m/s. That speed is an illustration, a modest
            working pace, and no one measured it.
          </Box>
          <ul style={LIST}>
            <li>One tick of delay, 33.3 ms: 0.25 m/s x 0.0333 s = 8.3 mm.</li>
            <li>A delay of 100 ms: 0.25 m/s x 0.100 s = 25 mm.</li>
            <li>A delay of 250 ms: 0.25 m/s x 0.250 s = 62.5 mm.</li>
          </ul>
          <Box variant="p">
            So 100 ms is 25 mm. A cup&apos;s mouth is a few centimetres across, and a tenth of a second of delay at
            this pace spends most of that margin.{' '}
            <Cite id="F01-83" kind="derived">
              speed times delay, with the 30 Hz tick from LeRobot dataset.py
            </Cite>
          </Box>
          <Figure
            cites="F01-83 F01-84"
            caption={
              <>
                Read along the line: every point is a delay on the horizontal axis and the distance the gripper
                covers in that time on the vertical axis, at an illustrative 0.25 m/s. The dashed line is the slack
                in the gears, below which the arm cannot tell where its gripper is.
              </>
            }
          >
            <DelayDistanceChart />
          </Figure>
          <Box variant="p">
            The line has a ceiling. Feetech&apos;s datasheet lists a no-load speed of 42 RPM at 6 V for the
            follower&apos;s servo.{' '}
            <Cite id="F01-42">Feetech STS3215 specification, section 5</Cite> By our arithmetic, one joint swinging
            the fully stretched arm, 0.413 m long, at that speed moves the gripper at under about 1.8 m/s. The
            arm&apos;s own weight and the kit&apos;s stock 5 V supply both lower that, and it has not been
            measured. At that ceiling 100 ms would be 182 mm.{' '}
            <Cite id="F01-82" kind="derived">
              datasheet speed times arm length
            </Cite>{' '}
            <Cite id="F01-83" kind="derived">
              speed times delay
            </Cite>
          </Box>
          <Box variant="p">
            It has a floor too, set by how well the arm knows its own position. One encoder step is 0.088 degrees,
            which at the gripper of the stretched arm is 0.63 mm. The gears are looser than that. The datasheet
            allows up to 0.5 degrees of backlash, free play that lets the joint move without the motor turning, and
            at the gripper that is 3.6 mm. The arm therefore knows its gripper position to a few millimetres at
            best, which is one reason it needs cameras, and a single tick of delay at the working pace, 8.3 mm, is
            already more than twice that slack.{' '}
            <Cite id="F01-84" kind="derived">
              encoder step and backlash at the gripper
            </Cite>{' '}
            <Cite id="F01-83" kind="derived">
              speed times delay
            </Cite>
          </Box>
          <Box variant="p">
            Run the formula backwards and it gives a budget. Decide how far off the gripper may be, divide by its
            speed, and the result is the delay the whole chain from camera to servo may take. If the block must
            arrive within 10 mm of the centre of the cup (an illustration), then at 0.25 m/s the budget is{' '}
            <Toy>0.010</Toy> m / 0.25 m/s = <Derived>0.040</Derived> s, or <Derived>40</Derived> ms: barely more
            than one tick.
          </Box>
          <Box variant="p">
            The chain that has to fit in that budget is a sum of four waits, and this page&apos;s own accounting of
            them follows. The camera frame is already some age when the host reads it,{' '}
            <M>{String.raw`\tau_{\text{sense}}`}</M>. The policy takes <M>{String.raw`\tau_{\text{infer}}`}</M> to
            answer. If the policy runs on another machine, the request and the answer cross a network,{' '}
            <M>{String.raw`\tau_{\text{comm}}`}</M>, which is zero when the policy runs on the host. The finished
            action then waits for the next tick before it is written to the servos,{' '}
            <M>{String.raw`\tau_{\text{act}}`}</M>. With <M>T</M> the control period (one tick) and{' '}
            <M>{String.raw`d_{\max}`}</M> the error the task can absorb:
          </Box>
          <Formula
            name="Control-latency budget (this page's accounting)"
            tex={String.raw`\begin{aligned} \tau &= \tau_{\text{sense}} + \tau_{\text{infer}} \\ &\quad + \tau_{\text{comm}} + \tau_{\text{act}} \\ v\,\tau &\le d_{\max}, \qquad n = \tau / T \end{aligned}`}
            source={
              <>
                our accounting, built on{' '}
                <Cite id="F01-83" kind="derived">
                  speed times delay
                </Cite>
              </>
            }
          />
          <Box variant="p">
            The sum adds the waits into one delay. The last line turns that delay into a distance and
            holds it against the tolerance, and <M>n</M> counts the same delay in ticks. Each term has a cited size
            on this arm. The frame age is between 0 and 33.3 ms, because the camera and the loop both run at 30 Hz
            and are not synchronised.{' '}
            <Cite id="F01-85">LeRobot cameras guide, frame access modes</Cite> One call to GR00T N1.7 has a median
            of 76.8 ms on Jetson AGX Thor, as NVIDIA reports it.{' '}
            <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite> A local network adds 10 to 20
            ms, as the authors of the real-time chunking paper report.{' '}
            <Cite id="F01-80">Real-time chunking paper, experimental setup</Cite> The wait for the next write is up
            to one tick, 33.3 ms.{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>
          </Box>
          <Box variant="p">
            Take the worst case with the model on a Thor beside the arm, so no network: 33.3 + 76.8 + 0 + 33.3 ={' '}
            <Derived>143.4</Derived> ms, which is <Derived>4.3</Derived> ticks, and at 0.25 m/s the gripper travels{' '}
            <Derived>35.9</Derived> mm on old information. Against the <Derived>40</Derived> ms budget above that is more than three
            times over, and inference is the largest term. The time on the serial bus and the servo&apos;s own
            response were not sourced in this research and are left out, so the real delay is longer.{' '}
            <Cite id="F01-83" kind="derived">
              speed times delay
            </Cite>{' '}
            <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite>{' '}
            <Cite id="F01-85">LeRobot cameras guide, frame access modes</Cite> A chain slower than its budget
            leaves two choices, move the arm more slowly or shorten the chain.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Which part of the machine each half of the robot loads, before any model is chosen">
            What it costs: tiny state, heavy video, and a deadline
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The two kinds of input differ in size by four orders of magnitude. State and action together are
            twelve <code>float32</code> values per tick: (6 + 6) x 4 bytes x 30 ticks = 1,440 bytes per second. One
            640x480 colour frame is 640 x 480 x 3 = 921,600 bytes, so two cameras at 30 frames per second produce 2
            x 30 x 921,600 = 55,296,000 bytes per second, which is 55.3 MB/s before compression. The images are
            38,400 times the joint data.{' '}
            <Cite id="F01-86" kind="derived">
              raw data rate from the LeRobot feature shapes
            </Cite>
          </Box>
          <Box variant="p">
            That ratio decides where the work lands in the rest of the dive. The servo loop runs on the servos. The
            host loop runs on a CPU core and a USB port. The video is the load: it is compressed to be stored,
            decompressed to be trained on, and pushed through a vision network every time the policy is called.
            Storage, video encoding and decoding, and GPU time in the later sections all follow the 55.3 MB/s.
            Almost nothing follows the 1,440 bytes.
          </Box>
          <Box variant="p">
            The other cost is time against the tick, and the policy is the largest term in it. As a preview: GR00T
            N1.7 is a vision-language-action model (VLA), a policy built on a network that takes camera images and
            a text instruction, which section 5 covers. NVIDIA&apos;s benchmark of one complete call to it,
            returning 40 actions, reports a median of 22.9 ms on an H100 data-centre GPU, 76.8 ms on Jetson AGX
            Thor and 149.0 ms on Jetson Orin, the last two being NVIDIA&apos;s onboard computers for robots. At 30
            Hz that is 1 to 5 control ticks per call.{' '}
            <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite>
          </Box>
          <Box variant="p">
            The robot has set these terms before any model is chosen. For each model in the sections that follow,
            ask what it takes in (which cameras, which state), what it puts out (which action space, how long a
            chunk) and how long one call takes. Then multiply that delay by the speed of your gripper: 100 ms is 25
            mm at 0.25 m/s, and whether that is acceptable depends on the width of your cup.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
