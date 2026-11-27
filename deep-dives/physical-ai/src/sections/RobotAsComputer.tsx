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
import { Capture, CaptureSlot, MUJOCO_SO101, Seen } from '../components/Capture';

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
  'The servo loop runs inside each servo. Its position controller drives the motor until the measured angle matches the single goal that the servo holds. The host is not involved.',
  'The host loop runs on the host computer. Every 33.3 ms, the host reads six angles and writes six new goals. So each servo is now chasing a goal that moves a little on every tick.',
  'The host calls the policy. The policy takes the observation and returns a chunk of the next 50 actions in one answer.',
  'The host plays the chunk, one action per tick. The policy is idle while the arm moves.',
  'After 50 ticks, which is 1.67 s, the chunk is used up. The host calls the policy again with a new observation, and the cycle repeats.',
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
            description="To the software that controls it, a robot arm is twelve numbers and two video streams, exchanged 30 times a second by default. Learn what those inputs and outputs are and how the arm's control loops use them. You will also learn to turn a delay into the distance the arm moves, which tells you how fast the computer next to the arm has to be."
          >
            3. The Robot as a Computer: Inputs, Outputs and a Deadline
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The {ARM} is a small robot arm that sits on a table. To the software that controls it, the arm is twelve
            numbers and two video streams. Six measured joint angles and one image from each of the two cameras come
            in, and six target angles go out. By default, this exchange repeats 30 times a second, which is once
            every 33.3 ms.{' '}
            <Cite id="F01-26">LeRobot feature_utils.py, dataset features</Cite>{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>
          </Box>
          <Box variant="p">
            The arm keeps moving while the software computes its next answer. So when an answer arrives late, it was
            computed for a position that the gripper has already left. This is why, on a robot, you can express a
            delay as a distance. At an illustrative speed of 0.25 m/s, a delay of 100 ms means that the gripper
            moves 25 mm based on old information, which is most of the width of a cup&apos;s opening.{' '}
            <Cite id="F01-83" kind="derived">
              speed times delay
            </Cite>
          </Box>
          <Box variant="p">
            These numbers let you size the hardware around the arm before you choose a model. The joint data is
            small: the measured and target angles together add up to 1,440 bytes per second. The camera data is
            large: the raw images add up to 55.3 MB/s, which is 38,400 times the joint data. So you size storage, video
            decoding and GPU time from the camera data.{' '}
            <Cite id="F01-86" kind="derived">
              raw data rate from the LeRobot feature shapes
            </Cite>
          </Box>
          <Box variant="p">
            The 33.3 ms schedule also tells you how fast the computer next to the arm has to be. The Jetson AGX Thor is
            one of NVIDIA&apos;s onboard computers for robots. NVIDIA reports that one call of its GR00T N1.7 robot
            model on a Jetson AGX Thor takes a median of 76.8 ms. So one call lasts as long as 76.8 / 33.3 ={' '}
            <Derived>2.3</Derived> of those 33.3 ms intervals, even before you count the age of the camera image that
            the call starts from.{' '}
            <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite>{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Learn how a person records demonstrations by moving a second arm, and where the computer sits in this setup. You will also see why a recording already holds the same kind of numbers that a trained model outputs."
          >
            Teleoperation: recording demonstrations with a leader arm
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The arm learns from recordings that a person makes by hand, using a second arm. The standard {ARM} setup
            is two arms on one table. You move one arm, called the leader arm, by its handle. The other arm, called
            the follower arm, makes the same movement a moment later. So it is the follower arm that has to{' '}
            {TASK_STORY}. Controlling a robot by hand in this way is called teleoperation.{' '}
            <Cite id="F01-2">SO-ARM100 README, Sourcing Parts</Cite>
          </Box>
          <Box variant="p">
            The leader arm&apos;s motors are switched off, so the software only measures it. Many times a second, the
            software reads the angle of each of the leader arm&apos;s six joints and sends those six numbers to the
            follower arm as targets.{' '}
            <Cite id="F01-24">LeRobot so_leader.py, get_action()</Cite>
          </Box>
          <Box variant="p">
            A recording made in this way is called a demonstration. It stores what the person&apos;s hand asked for as
            six target angles. Joint targets are also LeRobot&apos;s default format for what a model outputs. So a
            model that uses this default can train on a demonstration without any conversion (section 4, Learning
            From Demonstrations).{' '}
            <Cite id="F01-53">LeRobot action representations guide, joint and end-effector space</Cite>
          </Box>
          <Box variant="p">
            Neither arm contains a computer. Each arm connects by USB cable to a laptop or a small single-board
            computer, and the cameras connect to the same machine. That machine is called the host computer, or the
            host, and it runs all the software.{' '}
            <Cite id="F01-88">LeRobot SO-101 guide, USB ports</Cite> In other words, the arm is a peripheral device
            of the host. The robot is the follower arm plus the host. To size the robot&apos;s computing, you size
            the host and any other machine that the host calls.
          </Box>
          <Capture
            file="so101-pick-place"
            kind="clip"
            width={720}
            height={480}
            alt="A simulated SO-101 arm lowers its gripper over a small block, closes on it, lifts it and drops it into a cup."
            caption={
              <>
                The follower arm picks up the block and places it in the cup, in simulation. The arm reaches, closes
                the gripper, lifts, carries the block and releases it. The clip runs <Seen>8.2</Seen> s. A script
                moves the arm in this clip, so the motion is cleaner than a person or a trained model would make
                it.{' '}
              </>
            }
            provenance={{ ...MUJOCO_SO101, by: 'scripted motion, no learned policy' }}
          />
          <CaptureSlot what="Camera footage of the real leader arm and follower arm on the bench." />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Learn what a trained model receives as input on this arm, and in which units. You will also see that nothing on this arm measures force."
          >
            The observation: six joint angles and two camera images
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An observation is everything the robot knows at one instant. On the {ARM}, an observation has two parts
            that answer different questions. The joint angles tell the software where the arm is. The camera images
            tell it where the block and the cup are.
          </Box>
          <Box variant="p">
            Each of the six joints is driven by a servo. A servo is a motor, a gearbox, an angle sensor and a small
            microcontroller in one box. The six servos share one serial bus, which is a single data line to the
            host. On this bus, each servo answers to its own ID.{' '}
            <Cite id="F01-8">LeRobot so_follower.py, motor list</Cite>{' '}
            <Cite id="F01-44">Feetech STS3215 specification, command signal</Cite> The angle sensor is an encoder.
            It reports the joint&apos;s angle as a whole number of steps, and on this arm a full turn is 4096
            steps.{' '}
            <Cite id="F01-11">rustypot sts3215.rs, resolution</Cite> When the host reads all six encoders, it knows
            the arm&apos;s pose, which is the position of all its joints.
          </Box>
          <Box variant="p">
            Five of the joints position and orient the gripper, and the sixth servo opens and closes it. Each joint
            that moves independently adds one degree of freedom (DoF). A degree of freedom is one number that you
            need in order to state where the mechanism is. So the {ARM} is a five-DoF arm with a gripper.{' '}
            <Cite id="F01-8">LeRobot so_follower.py, motor list</Cite>{' '}
            <Cite id="F01-52">SO-ARM100 changelog</Cite> An object that moves freely in space has six degrees of
            freedom: three for its position and three for its orientation. So with five joints, the arm cannot reach
            every position at every angle. A block that the arm picks up from above does not need the sixth degree
            of freedom.
          </Box>
          <Box variant="p">
            LeRobot converts the encoder steps into other units before it stores anything. Calibration is a
            one-time step that records the range of each joint. With LeRobot&apos;s default setting, the five arm
            joints are stored in degrees, measured from the middle of each joint&apos;s calibrated range. The gripper
            is stored on a scale of 0 to 100 across its range. If you switch the <code>use_degrees</code> setting
            off, the arm joints are stored on a scale of -100 to 100 instead, under the same key name.{' '}
            <Cite id="F01-18">LeRobot motors_bus.py, normalisation</Cite> So before you mix a downloaded {ARM}{' '}
            dataset or checkpoint with your own recordings, check which scale it uses.{' '}
            <Cite id="F01-19">LeRobot config_so_follower.py, use_degrees</Cite>
          </Box>
          <ExpandableSection headerText="How encoder steps become degrees: calibration and the conversion formula">
            <SpaceBetween size="s">
              <Box variant="p">
                A raw step count depends on how each servo was mounted on the arm. So two arms in the same pose
                report different step counts. Calibration removes this difference. You move each joint through its
                range once, and the software records the minimum and the maximum. After that, a leader arm and a
                follower arm in the same pose report the same values. Calibration is also what lets a model trained
                on one {ARM} control another.{' '}
                <Cite id="F01-20">LeRobot motors_bus.py, record_calibration()</Cite>
              </Box>
              <Box variant="p">
                To convert a reading to degrees, LeRobot measures it from the centre of the calibrated range. In the
                formula below, <M>{String.raw`\mathrm{raw}`}</M> is the encoder reading in steps, and{' '}
                <M>{String.raw`\mathrm{mid}`}</M> is the midpoint of the calibrated range in steps:
              </Box>
              <Formula
                name="Encoder steps to degrees"
                tex={String.raw`\mathrm{degrees} = (\mathrm{raw} - \mathrm{mid}) \times \frac{360}{4095}`}
                source={<Cite id="F01-18">LeRobot motors_bus.py, _normalize()</Cite>}
              />
              <Box variant="p">
                The difference <M>{String.raw`\mathrm{raw} - \mathrm{mid}`}</M> is the number of steps between the
                joint and the centre of its range. The factor 360 / 4095 converts steps into degrees. The code
                divides by 4095, which is the encoder resolution minus one, while the datasheet gives one step as 360
                / 4096 degrees. As an illustration, take a reading of <Toy>3072</Toy> with a midpoint of{' '}
                <Toy>2048</Toy>. The joint is <Toy>1024</Toy> steps from the centre, and <Toy>1024</Toy> x 360 / 4095
                = <Toy>90.02</Toy> degrees.{' '}
                <Cite id="F01-18">LeRobot motors_bus.py, normalisation</Cite>{' '}
                <Cite id="F01-43">Feetech STS3215 specification, electronic resolution</Cite>{' '}
                <Cite id="F01-11">rustypot sts3215.rs, resolution</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            The arm reports only the positions of its joints. Each servo also has registers for speed, load and
            current, but LeRobot&apos;s driver reads only the position register when it builds the observation. So a
            model that controls this arm receives joint positions and camera images, and nothing that measures how
            hard the arm is pushing.{' '}
            <Cite id="F01-23">LeRobot so_follower.py, observation features</Cite> Even the other registers would give
            only a rough estimate of force. The load value is the duty cycle of the motor drive, which is the share
            of time that the drive powers the motor. It is measured on the motor&apos;s side of a 1/345 gearbox, not
            at the joint.{' '}
            <Cite id="F01-46">Feetech STS3215 evaluation document, feedback</Cite>
          </Box>
          <Box variant="p">
            The encoders give no information about the block or the cup. That part of the observation comes from two
            ordinary colour cameras, which the LeRobot tutorial names <code>wrist</code> and <code>top</code>.
            Judging by their names and by the camera mounts in the arm&apos;s hardware repository, the wrist camera
            rides on the arm and sees what is between the gripper&apos;s fingers. The top camera is fixed above the
            scene.{' '}
            <Cite id="F01-31">LeRobot imitation learning tutorial, cameras</Cite>{' '}
            <Cite id="F01-7">SO-ARM100 README, camera mounts</Cite> LeRobot&apos;s code sets no default camera
            resolution. The documentation advises 640x480 pixels at 30 frames per second, and the {ARM} tutorial
            uses the same setting.{' '}
            <Cite id="F01-30">LeRobot cameras guide and camera configs</Cite>
          </Box>
          <Box variant="p">
            A recording stores each observation under fixed names. The joint part goes in{' '}
            <code>observation.state</code>, a vector of six <code>float32</code> values labelled with the six joint
            names. The camera part is stored as one image per camera, under <code>observation.images.wrist</code>{' '}
            and <code>observation.images.top</code>.{' '}
            <Cite id="F01-26">LeRobot feature_utils.py, dataset features</Cite> A model is trained on these tensors,
            and the two parts are very different in size. The state is 24 bytes. One colour image is 640 x 480 x 3 =
            921,600 bytes. So two cameras at 30 frames per second produce 2 x 30 x 921,600 = 55,296,000 bytes per
            second of raw images in memory.{' '}
            <Cite id="F01-86" kind="derived">
              raw data rate from the LeRobot feature shapes
            </Cite>
          </Box>
          <Figure
            cites="F01-8 F01-26 F01-28 F01-30 F01-31"
            caption={
              <>
                The arm and its cameras measure the scene, the host computer decides what to do, and six target
                angles go back to the arm. The numbered circles are the six servos. The layout is illustrative and
                not to scale.
              </>
            }
          >
            <ArmIoDiagram />
          </Figure>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Every robot model makes two choices about what the numbers in its actions mean. Learn to read those two choices, so that you can tell whether your recordings fit a model, and see what each servo does with the target it receives."
          >
            The action: six target angles, one for each servo
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An action is what the robot is told to do at one instant. On the {ARM}, an action is six target angles,
            one for each servo. The action uses the same joint names and the same units as the six measured angles
            in the observation. So the observation and the action describe the same six quantities. The observation
            holds the measured angles, and the action holds the angles that the arm is asked to reach.{' '}
            <Cite id="F01-26">LeRobot feature_utils.py, dataset features</Cite> Together they are twelve{' '}
            <code>float32</code> values per exchange. At 30 exchanges per second, that is (6 + 6) x 4 bytes x 30 =
            1,440 bytes per second.{' '}
            <Cite id="F01-86" kind="derived">
              raw data rate from the LeRobot feature shapes
            </Cite>
          </Box>
          <Box variant="p">
            During teleoperation, a person chooses the action. In each recorded step, <code>action</code> holds the
            leader arm&apos;s pose at that instant, and <code>observation.state</code> holds the follower arm&apos;s
            measured pose from just before. So the action is slightly ahead of the state.{' '}
            <Cite id="F01-27">LeRobot lerobot_record.py, record_loop()</Cite> The difference between the two is the
            error that the follower arm&apos;s servos are working to close. After training, a model called the policy
            chooses the action from the observation, in place of the person.
          </Box>
          <Box variant="p">
            Every robot model makes two choices that fix what the numbers in an action mean. Together, the two
            choices define the model&apos;s action space. The first choice is what the numbers describe, and there
            are two options:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Joint space.</strong> The action gives one target angle per motor, which is the form that the
              servos accept directly. Joint space is LeRobot&apos;s default, and it needs no model of the arm.{' '}
              <Cite id="F01-53">LeRobot action representations guide, joint and end-effector space</Cite>
            </li>
            <li>
              <strong>End-effector space.</strong> The end effector is the tool at the end of the arm, which on the{' '}
              {ARM} is the gripper. An end-effector action gives the gripper&apos;s position in x, y, z coordinates
              and its orientation. Software then converts that pose into joint angles. This conversion is called
              inverse kinematics, and it needs a kinematic model, which is a file that describes the arm&apos;s link
              lengths and joint axes. An end-effector action says directly where the gripper should go, and the
              LeRobot documentation calls this more intuitive for pick-and-place tasks.{' '}
              <Cite id="F01-53">LeRobot action representations guide, joint and end-effector space</Cite>
            </li>
          </ul>
          <Box variant="p">
            The second choice is the reference point that each number is measured from, and there are three options:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Absolute.</strong> The number is the target itself, for example an elbow angle of{' '}
              <Toy>40</Toy> degrees. Absolute actions are LeRobot&apos;s default.{' '}
              <Cite id="F01-55">LeRobot action representations guide, absolute, relative and delta</Cite>
            </li>
            <li>
              <strong>Relative.</strong> The number is an offset from where the robot was when the policy made its
              prediction, for example 5 degrees further than the elbow is now.
            </li>
            <li>
              <strong>Delta.</strong> The number is an offset from the previous action. Because each action builds
              on the one before it, errors add up along the sequence.{' '}
              <Cite id="F01-55">LeRobot action representations guide, absolute, relative and delta</Cite>
            </li>
          </ul>
          <Box variant="p">
            Projects do not use these names consistently. NVIDIA&apos;s README calls its offsets from the current pose
            deltas, but LeRobot calls the same form relative.{' '}
            <Cite id="F01-60">Isaac-GR00T README, What&apos;s new</Cite>
          </Box>
          <Box variant="p">
            Before you fine-tune a model, find both choices in its documentation. From them, you can tell whether
            you can use your joint-angle recordings as they are, or whether you must first convert them with a kinematic model
            of your arm. For one arm and one task, stay with LeRobot&apos;s defaults, which are absolute joint
            targets. With those defaults, the recorded numbers are exactly the numbers that the servos receive.
          </Box>
          <Box variant="p">
            The opposite combination is relative end-effector actions, which describe a motion without naming the
            joints of any particular robot. NVIDIA adopted this combination for its GR00T N1.7 model, and NVIDIA
            credits it with helping the model transfer between robots with different bodies.{' '}
            <Cite id="F01-60">Isaac-GR00T README, What&apos;s new</Cite> The authors of pi0.7, a model from the
            company Physical Intelligence, made the other choice. Their experiments use joint-space control, and they
            found no noticeable gain from end-effector control with their earlier models.{' '}
            <Cite id="F01-59">pi0.5 and pi0.7 papers, control mode</Cite>
          </Box>
          <Box variant="p">
            Whichever action space a model uses, what finally reaches each servo is a goal angle. The servo&apos;s job
            is to hold the angle it was last given. The program inside the servo that does this is called a position
            controller. It repeatedly subtracts the measured angle from the goal angle to get an error, and it drives
            the motor to make that error smaller.
          </Box>
          <Box variant="p">
            The host never drives a motor directly. It writes a goal angle into one register of the servo and reads
            the measured angle from another register. The servo&apos;s register table is the arm&apos;s entire hardware
            interface.{' '}
            <Cite id="F01-14">rustypot sts3215.rs, register table</Cite> A position controller accepts only one kind
            of command, which is a position. The servo has no mode that holds a chosen force. So you can tell the{' '}
            {ARM} where to go, but you cannot tell it how hard to push.{' '}
            <Cite id="F01-15">rustypot sts3215.rs, operating modes</Cite>
          </Box>
          <Box variant="p">
            The servo&apos;s position controller uses the PID (proportional-integral-derivative) design. A PID
            controller sets the motor drive from three views of the error: its size now, its sum over time, and how
            fast it is changing. Three tuning numbers, called gains, set how strongly the controller reacts to each
            view. In the formula below, <M>e_t</M> is the error on pass <M>t</M> of the controller, which is the goal
            angle minus the measured angle. <M>P</M>, <M>I</M> and <M>D</M> are the three gains. The textbook form of
            the controller is:
          </Box>
          <Formula
            name="PID position controller, textbook form"
            tex={String.raw`\begin{aligned} \mathrm{drive}_t = {} & P\,e_t + I \sum_{k \le t} e_k \\ & + D\,(e_t - e_{t-1}) \end{aligned}`}
            source={<>the standard form; the gains this arm writes are in <Cite id="F01-16">LeRobot so_follower.py, configure()</Cite></>}
          />
          <Box variant="p">Each term of the formula uses one of the three views of the error:</Box>
          <ul style={LIST}>
            <li>
              <strong>Proportional term.</strong> The first term uses the error now. The P gain sets how hard the
              motor pushes for each step of error, so the joint pushes harder the further it is from its goal.
            </li>
            <li>
              <strong>Integral term.</strong> The middle term uses the sum of all the errors so far. The I gain adds
              a push that builds up for as long as an error persists.
            </li>
            <li>
              <strong>Derivative term.</strong> The last term uses the change in the error since the previous pass.
              The D gain brakes the joint when the error is shrinking fast.
            </li>
          </ul>
          <Box variant="p">
            LeRobot writes P = 16, I = 0 and D = 32 into each follower servo when it connects, and it never tunes
            that loop again. Setting I = 0 switches the integral term off, so the joints run as PD
            (proportional-derivative) controllers. As a result, a joint that holds a load can stop slightly short of
            its goal, with nothing building up to close the remaining gap.{' '}
            <Cite id="F01-16">LeRobot so_follower.py, configure()</Cite>
          </Box>
          <ExpandableSection headerText="Servo limits: the gripper's software caps and the firmware's protection">
            <SpaceBetween size="s">
              <Box variant="p">
                When LeRobot connects to the arm, it sets three limits on the gripper servo. The torque limit is 50%,
                the protection current is 50%, and the torque drops to 25% once the servo is overloaded. The code
                gives the reason in its own words: &quot;to avoid burnout&quot;.{' '}
                <Cite id="F01-17">LeRobot so_follower.py, gripper limits</Cite>
              </Box>
              <Box variant="p">
                The servo&apos;s firmware also protects the servo on its own. This protection runs inside the servo,
                so it acts without the host and knows nothing about the policy. The datasheet lists four conditions
                that trigger it:{' '}
                <Cite id="F01-47">Feetech STS3215 specification, electronic protection</Cite>
              </Box>
              <ul style={LIST}>
                <li>
                  <strong>Stall.</strong> The servo is blocked for 2 s at more than 80% of its stall torque.
                </li>
                <li>
                  <strong>Current.</strong> The servo draws more than 2 A for 2 s.
                </li>
                <li>
                  <strong>Voltage.</strong> The supply voltage is outside the range of 4 V to 7.4 V.
                </li>
                <li>
                  <strong>Temperature.</strong> The servo is hotter than 70 degrees C.
                </li>
              </ul>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A robot runs several control loops, and each loop runs more slowly than the loop below it. Learn what each loop does and what it has to keep supplying to the loop below, so that you can place any model or controller in this stack by its rate."
          >
            Three control loops at different rates: servo, host and policy
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The host computer repeats one short cycle on a fixed schedule. In each cycle, it does five things in
            order:{' '}
            <Cite id="F01-33">LeRobot lerobot_record.py, record_loop()</Cite>{' '}
            <Cite id="F01-22">LeRobot so_follower.py, get_observation() and send_action()</Cite>
          </Box>
          <ol style={LIST}>
            <li>It reads the six joint angles in one bus read and takes the latest image from each camera.</li>
            <li>It decides on an action.</li>
            <li>It writes the six goal angles in one bus write.</li>
            <li>It appends this cycle&apos;s observation and action to the recording as one frame.</li>
            <li>It sleeps until the cycle&apos;s deadline.</li>
          </ol>
          <Box variant="p">
            One cycle of this loop is called a tick. The number of ticks per second is the control rate, and it is
            given in hertz (Hz, times per second). The length of one tick is the control period. LeRobot records at
            30 Hz by default, so the control period is 33.3 ms.{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite> The rate is a software setting. For example,
            plain teleoperation that records nothing runs at 60 Hz by default.{' '}
            <Cite id="F01-29">LeRobot lerobot_teleoperate.py, defaults</Cite>
          </Box>
          <Box variant="p">
            Most of the work in a tick is reading sensors. LeRobot prints a cadence report, which is a timing summary
            of a session. Its documentation shows a sample report for a 30 Hz recording, but it does not say which
            hardware produced the sample.{' '}
            <Cite id="F01-38">LeRobot imitation learning tutorial, cadence reporting</Cite> In the sample, the mean
            times per tick are as follows:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Reading the joints and the cameras</strong> takes 13.65 ms, which is 74.4% of the loop&apos;s
              work.
            </li>
            <li>
              <strong>Reading the leader arm</strong> takes 1.80 ms.
            </li>
            <li>
              <strong>Sending the action</strong> takes 0.90 ms.
            </li>
            <li>
              <strong>Writing the frame to the recording</strong> takes 1.70 ms.
            </li>
          </ul>
          <Box variant="p">
            In total, the work takes a mean of 18.4 ms per tick, and the loop sleeps for 15.1 ms per tick on average.
            If a model&apos;s decision has to fit inside the tick, that sleep time is all the room it has. In the same
            report, the slowest tick took 45.1 ms of work. That is longer than the control period, even though no
            model was running in the loop.{' '}
            <Cite id="F01-38">LeRobot imitation learning tutorial, cadence reporting</Cite>
          </Box>
          <Box variant="p">
            The host loop is the middle one of three loops. Each loop only has to keep the loop below it
            supplied: each servo needs a goal, and the host needs actions to play. Below the host loop, the position controller inside each servo chases the last goal it was
            given. It runs on the servo&apos;s own microcontroller, so it costs the host nothing. Above the host loop
            is the policy. When a model is too slow to answer within one tick, the host calls it less often. Each
            call then returns an action chunk, which is a list of the next several actions, and the host plays the
            chunk one action per tick. Section 4, Learning From Demonstrations, explains why this works.
          </Box>
          <Box variant="p">
            In LeRobot, the SmolVLA and pi0.5 policies use a default chunk length of 50 actions.{' '}
            <Cite id="F01-57">LeRobot policy configurations, chunk sizes</Cite> Played to its end at 30 Hz, a
            50-action chunk lasts 50 / 30 = 1.67 s. So the policy is called once every 1.67 s, and the host writes 50
            sets of goal angles between two calls.{' '}
            <Cite id="F01-81" kind="our-reading">
              LeRobot inference guide
            </Cite>
          </Box>
          <AnimatedFigure
            name="the three control loops"
            steps={LADDER_STEPS}
            intervalMs={2600}
            cites="F01-28 F01-81"
            caption={
              <>
                Each loop keeps the loop below it supplied: the host gives each servo a goal, and the policy gives
                the host a chunk. The curves in the bottom lane are illustrative, not measured.
              </>
            }
          >
            {(step, reduced) => <RateLadder step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            This is a general pattern in robotics. A slower loop at the top plans, and a faster, simpler loop below it
            follows the plan. The slower loop is called a planner, and the faster loop is called a controller. Larger
            robots stack more of these loops, and the whole stack is called a control hierarchy.
          </Box>
          <Box variant="p">
            A humanoid is a robot with two legs and two arms. NVIDIA&apos;s research page for its GR00T 2 model
            describes four loops on a Unitree G1 humanoid. The table shows each of the four next to its counterpart
            on the {ARM}.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560 }}>
              <thead>
                <tr>
                  <th style={TH}>Loop</th>
                  <th style={TH}>{ARM} with LeRobot v0.7.0</th>
                  <th style={TH}>Unitree G1 with GR00T 2, as NVIDIA reports it</th>
                  <th style={TH}>Sources</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Joint loop</td>
                  <td style={TD}>The position controller inside each servo runs this loop. The servo documentation we found does not state its rate.</td>
                  <td style={TD}>Each joint runs PD control, which NVIDIA&apos;s page labels as 1 kHz.</td>
                  <td style={TD}>
                    <Cite id="F01-45">Feetech STS3215 specification</Cite>{' '}
                    <Cite id="F01-73">NVIDIA GR00T 2 research page</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Joint targets</td>
                  <td style={TD}>The host loop writes them at 30 Hz.</td>
                  <td style={TD}>A whole-body controller sets them at 50 Hz. It is a small network that turns the plan into joint targets.</td>
                  <td style={TD}>
                    <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>{' '}
                    <Cite id="F01-73">NVIDIA GR00T 2 research page</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Policy</td>
                  <td style={TD}>The host calls the policy once per chunk of 50 actions, which lasts 1.67 s.</td>
                  <td style={TD}>The policy plans a 1.6 s chunk about once per second. One optimised prediction takes 124 ms on the robot&apos;s onboard computer.</td>
                  <td style={TD}>
                    <Cite id="F01-81" kind="our-reading">
                      LeRobot inference guide
                    </Cite>{' '}
                    <Cite id="F01-73">NVIDIA GR00T 2 research page</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Planner</td>
                  <td style={TD}>An optional language model picks the next instruction. It sits outside the control loop.</td>
                  <td style={TD}>A reasoning model chooses the task. It is the only loop that runs off the robot.</td>
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
            From the joint loop up to the planner, each loop runs more slowly and makes bigger decisions. The joint
            loop holds an angle, and the next loop issues the next target. The policy plans a second or so of motion,
            and the planner chooses the task. NVIDIA reports that on the humanoid, every loop runs on the robot except
            the slowest one, the reasoning model.{' '}
            <Cite id="F01-73">NVIDIA GR00T 2 research page</Cite>
          </Box>
          <Box variant="p">
            The robotics company Figure describes the same structure for its Helix 02 humanoid model, in rates that
            it published on 2026-01-27. At the bottom, a network with 10 million parameters sends joint-level
            commands at 1 kHz. Above it, full-body joint targets are set at 200 Hz, and above that sits a slow
            reasoning layer. Figure&apos;s post on the newer Helix 2.5, from 2026-09-17, states no rates. So as of
            November 2026, the Helix 02 rates are the latest that Figure has published.{' '}
            <Cite id="F01-72">Figure, Helix 02 post</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Learn to convert a delay in milliseconds into the distance that the gripper moves in millimetres. You can then work out how much delay your task can tolerate."
          >
            How far the arm moves during a delay
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The arm does not pause while the computer works. A camera captures the scene, the computer works out an
            action from that image, and then the servos receive the action. During this whole delay, the gripper
            keeps moving on its previous instructions. The distance <M>d</M> that it covers is its speed <M>v</M>{' '}
            multiplied by the delay <M>{String.raw`\tau`}</M>:
          </Box>
          <Formula name="Distance travelled during the delay" tex={String.raw`d = v \, \tau`} />
          <Box variant="p">
            The speed comes from the task, and the delay comes from the computer. Their product is a distance on the
            table. So a latency figure for a robot means little until you also know how fast the arm moves.
          </Box>
          <Box variant="p">
            As an example, take the {ARM} carrying the block toward the cup at 0.25 m/s. This is an illustrative
            speed for a modest working pace.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>One tick, 33.3 ms:</strong> the gripper moves 0.25 m/s x 0.0333 s = 8.3 mm.
            </li>
            <li>
              <strong>100 ms:</strong> the gripper moves 0.25 m/s x 0.100 s = 25 mm.
            </li>
            <li>
              <strong>250 ms:</strong> the gripper moves 0.25 m/s x 0.250 s = 62.5 mm.
            </li>
          </ul>
          <Box variant="p">
            A cup&apos;s opening is a few centimetres across. So at this speed, a delay of a tenth of a second uses up
            most of the room for error.{' '}
            <Cite id="F01-83" kind="derived">
              speed times delay, with the 30 Hz tick from LeRobot dataset.py
            </Cite>
          </Box>
          <Figure
            cites="F01-83 F01-84"
            caption={
              <>
                Each point on the line shows a delay and the distance that the gripper covers during it, at an
                illustrative speed of 0.25 m/s. The dashed line marks the gear backlash, which is the free play in
                the gears. The arm cannot know where its gripper is more precisely than that.
              </>
            }
          >
            <DelayDistanceChart />
          </Figure>
          <Box variant="p">
            There is an upper limit on how fast the gripper can move. Feetech&apos;s datasheet lists a no-load speed
            of 42 RPM at 6 V for the follower arm&apos;s servo.{' '}
            <Cite id="F01-42">Feetech STS3215 specification, section 5</Cite> Suppose one joint swings the fully
            stretched arm, which is 0.413 m long, at that speed. The gripper then moves at about 1.82 m/s at most. Two
            things lower this limit by an amount that we did not measure: the arm&apos;s own weight and the
            kit&apos;s standard 5 V power supply. At 1.82 m/s, a delay of a tenth of a second would move the gripper
            182 mm.{' '}
            <Cite id="F01-82" kind="derived">
              datasheet speed times arm length
            </Cite>{' '}
            <Cite id="F01-83" kind="derived">
              speed times delay
            </Cite>
          </Box>
          <Box variant="p">
            At the other end, there is a limit on how precisely the arm knows its own position, and the dashed line in the chart marks it. One encoder step is
            0.088 degrees, which is 0.63 mm at the gripper of the stretched arm. The gears add more uncertainty than
            that. Backlash is free play in a gear train that lets the joint move without the motor turning. The
            datasheet allows up to 0.5 degrees of backlash, which is 3.6 mm at the gripper. So the arm knows its
            gripper position to within a few millimetres at best, and this is one reason why it needs cameras. A
            delay of a single tick at the working pace moves the gripper 8.3 mm, which is already more than twice
            that backlash.{' '}
            <Cite id="F01-84" kind="derived">
              encoder step and backlash at the gripper
            </Cite>{' '}
            <Cite id="F01-83" kind="derived">
              speed times delay
            </Cite>
          </Box>
          <Box variant="p">
            To find how much delay a task can tolerate, use the formula in reverse. First, decide how far off target
            the gripper may be. Then divide that distance by the gripper&apos;s speed. The result is the longest delay
            that the whole chain from camera to servo may take. For example, say the block must arrive within 10 mm
            of the centre of the cup. At 0.25 m/s, the budget is <Toy>0.010</Toy> m / 0.25 m/s ={' '}
            <Derived>0.040</Derived> s, or <Derived>40</Derived> ms, which is only slightly more than one tick.
          </Box>
          <Box variant="p">
            The delay that has to fit in this budget is the sum of several waits. We split it into four:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Sensing</strong>, <M>{String.raw`\tau_{\text{sense}}`}</M>. The camera image is already some
              time old when the host reads it.
            </li>
            <li>
              <strong>Inference</strong>, <M>{String.raw`\tau_{\text{infer}}`}</M>. This is the time that the policy
              takes to compute its answer.
            </li>
            <li>
              <strong>Communication</strong>, <M>{String.raw`\tau_{\text{comm}}`}</M>. If the policy runs on another
              machine, the request and the answer cross a network. This wait is zero when the policy runs on the
              host.
            </li>
            <li>
              <strong>Actuation</strong>, <M>{String.raw`\tau_{\text{act}}`}</M>. The finished action waits for the
              next tick before the host writes it to the servos.
            </li>
          </ul>
          <Box variant="p">
            In the formula below, <M>T</M> is the control period and <M>{String.raw`d_{\max}`}</M> is the largest
            error that the task can tolerate:
          </Box>
          <Formula
            name="Control-latency budget"
            tex={String.raw`\begin{aligned} \tau &= \tau_{\text{sense}} + \tau_{\text{infer}} \\ &\quad + \tau_{\text{comm}} + \tau_{\text{act}} \\ v\,\tau &\le d_{\max}, \qquad n = \tau / T \end{aligned}`}
            source={
              <>
                built on{' '}
                <Cite id="F01-83" kind="derived">
                  speed times delay
                </Cite>
              </>
            }
          />
          <Box variant="p">
            The first two lines add the four waits into one delay. The last line turns that delay into a distance and
            compares it with the tolerance, and <M>n</M> is the same delay counted in ticks. On this arm, the four
            waits have these sizes:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Sensing.</strong> The image is between 0 and 33.3 ms old. The camera and the loop both run at
              30 Hz, but they are not synchronised, and the loop takes the most recent image in the buffer without
              waiting for a new one.{' '}
              <Cite id="F01-85">LeRobot cameras guide, frame access modes</Cite>
            </li>
            <li>
              <strong>Inference.</strong> NVIDIA reports a median of 76.8 ms for one call of GR00T N1.7 on a Jetson
              AGX Thor.{' '}
              <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite>
            </li>
            <li>
              <strong>Communication.</strong> Real-time chunking is a method that keeps the arm moving while a slow
              policy computes, and it is explained later in this section. In the setup of the real-time chunking
              paper, a local network added 10 to 20 ms.{' '}
              <Cite id="F01-80">Real-time chunking paper, experimental setup</Cite>
            </li>
            <li>
              <strong>Actuation.</strong> The wait for the next write is up to one tick, which is 33.3 ms.{' '}
              <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>
            </li>
          </ul>
          <Box variant="p">
            Now put the model on a Jetson AGX Thor next to the arm, and take each wait at its longest. The image is
            33.3 ms old, the call takes NVIDIA&apos;s median of 76.8 ms, there is no network, and the action waits a
            full tick of 33.3 ms before the host writes it. The total is 33.3 + 76.8 + 0 + 33.3 ={' '}
            <Derived>143.4</Derived> ms, which is <Derived>4.3</Derived> ticks. At 0.25 m/s, the gripper travels{' '}
            <Derived>35.9</Derived> mm based on old information. This delay is more than three times the{' '}
            <Derived>40</Derived> ms budget, and inference is the largest of the four waits.{' '}
            <Cite id="F01-83" kind="derived">
              speed times delay
            </Cite>{' '}
            <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite>{' '}
            <Cite id="F01-85">LeRobot cameras guide, frame access modes</Cite>
          </Box>
          <Box variant="p">
            Inference is also the wait that changes with your choice of runtime. TensorRT is NVIDIA&apos;s inference runtime,
            which compiles a model for a given GPU. NVIDIA&apos;s 76.8 ms median is for the model compiled with
            TensorRT, and the same table gives 106.8 ms for the same call in plain PyTorch (section 17, Running on
            the Robot).{' '}
            <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite>
          </Box>
          <Box variant="p">
            This sum is only an estimate of the chain. It takes the image age and the wait for the write at their
            longest, which overstates a typical tick. It also uses NVIDIA&apos;s median call time, which understates a
            slow call. And it leaves out several steps: camera exposure, image transfer and decoding, the time on the
            serial bus, and the servo&apos;s own response. Each of those steps adds delay, but as of November 2026 we
            have found no published figure for any of them. When
            the chain is slower than its budget, you have two options: slow the arm down, or shorten the chain.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Learn to recognise each kind of missed deadline from the log and from what the arm does, and which setting changes it."
          >
            What happens when the loop misses its deadline
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Nothing forces the loop to keep its schedule. The loop is ordinary Python code on a desktop operating
            system, and it keeps its rate by sleeping until an absolute deadline. To find the deadline for each tick,
            LeRobot multiplies the number of completed ticks by the tick interval and adds the result to the start
            time. So a tick that runs late takes time
            from the ticks after it, and the schedule itself does not shift.{' '}
            <Cite id="F01-34">LeRobot cycle_timer.py, pacing</Cite> When the work no longer fits into the ticks at
            all, LeRobot logs a warning, and the arm acts late. The warning names the usual causes: a camera that
            cannot keep up, policy inference that takes too long, and CPU starvation. CPU starvation means that the
            loop does not get enough CPU time.{' '}
            <Cite id="F01-36">LeRobot cycle_timer.py, wait()</Cite>
          </Box>
          <Box variant="p">
            During recording, a missed deadline damages the data. LeRobot computes each frame&apos;s timestamp from
            its index and the nominal rate. So in the documentation&apos;s example, a session that really ran at 25
            Hz still produces a dataset that claims 30 Hz. The recorded motion therefore looks faster than it really
            was.{' '}
            <Cite id="F01-37">LeRobot imitation learning tutorial, cadence reporting</Cite> A policy trained on
            those episodes learns a speed at which the arm never moved. LeRobot&apos;s cadence report shows the rate
            that a session actually held, so read that report before you train on the session.
          </Box>
          <Box variant="p">
            A run in which a trained policy controls the arm is called a rollout. LeRobot can run the policy in
            several ways, which it calls inference backends. The default backend is synchronous inference, which
            means that the loop blocks until the action is computed.{' '}
            <Cite id="F01-40">LeRobot inference guide, inference backends</Cite> The documentation describes what
            you see at the bench: &quot;with a synchronous rollout the robot stops moving every time the policy
            computes its next chunk of actions&quot;.{' '}
            <Cite id="F01-87">LeRobot remote inference guide and inference guide</Cite> So the arm moves, stops for
            the length of one call, and then moves again.
          </Box>
          <Box variant="p">LeRobot&apos;s two other backends keep the arm moving during the call:</Box>
          <ul style={LIST}>
            <li>
              <strong>RTC (real-time chunking).</strong> This backend is meant for a model that is too slow to answer
              within one tick. It computes the next chunk in a background thread on the host while the loop plays
              the current chunk.{' '}
              <Cite id="F01-40">LeRobot inference guide, inference backends</Cite>
            </li>
            <li>
              <strong>Remote inference.</strong> The host sends observations to a policy server on another machine.
              The host keeps the cameras and the motors, and it needs no GPU of its own.{' '}
              <Cite id="F01-40">LeRobot inference guide, inference backends</Cite>{' '}
              <Cite id="F01-41">LeRobot remote inference guide</Cite>
            </li>
          </ul>
          <Box variant="p">
            Both backends depend on one condition. In the documentation&apos;s words, there must be &quot;enough
            usable action playback to cover inference latency and its variation&quot;.{' '}
            <Cite id="F01-87">LeRobot inference guide, real-time chunking</Cite>
          </Box>
          <Box variant="p">
            To check that condition, put numbers on it. A 50-action chunk at 30 Hz lasts 1,667 ms. NVIDIA reports
            149 ms for one call of GR00T N1.7 on a Jetson Orin, and that call uses 4.5 ticks of the chunk.{' '}
            <Cite id="F01-87" kind="derived">
              chunk duration against call latency
            </Cite>{' '}
            So in this example, the arm does not run out of actions to play. The cost that remains is the distance
            the arm covers during the delay. By the time the first action of a new chunk is played, the arm has been
            moving for the whole length of the delay. Section 17, Running on the Robot, explains how a new chunk is
            joined to the one being played.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Learn how to size the host and the computer that runs the policy from the load that each one carries. Then check the timing of your own loop."
          >
            Sizing the host computer and the policy&apos;s computer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The joints need very little computing. The servo loop runs on the servos themselves, and the host loop
            needs one CPU core and some USB ports. The host loop has one hidden cost, which comes from the way it
            keeps time. On Linux, the loop sleeps between ticks. On macOS and Windows, it busy-waits for the last 10
            ms of each sleep, so that it wakes on the deadline. Busy-waiting means that the core keeps
            checking the time instead of sleeping. So on those systems, one core stays busy for up to 10 ms of every
            33.3 ms tick.{' '}
            <Cite id="F01-35">LeRobot robot_utils.py, precise_sleep()</Cite>
          </Box>
          <Box variant="p">
            The video is the main load. One episode of the default length, 60 s, is 3.32 GB of raw images before
            video encoding.{' '}
            <Cite id="F01-86" kind="derived">
              raw data rate from the LeRobot feature shapes
            </Cite>{' '}
            The video is compressed for storage (section 9, Collecting Data) and decompressed for training (section
            10, Processing and Curating). It also passes through a vision network every time the policy is called.
          </Box>
          <Box variant="p">
            The host is the first machine to carry this load. LeRobot supports a Jetson board as the host, with one
            caveat. On a Jetson, video decoding runs on the CPU by default, and the build with GPU support is
            maintained by the community.{' '}
            <Cite id="F01-89">LeRobot installation guide, platform note</Cite>
          </Box>
          <Box variant="p">
            You size the computer that runs the policy from the deadline. GR00T N1.7 is a vision-language-action
            model (VLA). A VLA is a policy built on a network that takes camera images and a text instruction as
            input (section 5, Vision-Language-Action Models). NVIDIA benchmarked one complete call to GR00T N1.7,
            which returns 40 actions. The median time ranges from 22.9 ms on an H100 data-centre GPU to 149.0 ms on
            a Jetson Orin. At 30 Hz, that is 1 to 5 control ticks per call.{' '}
            <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite> Every network hop between the
            arm and that GPU adds to the delay. So you size the policy&apos;s computer by its latency, while you size
            the jobs that train the policy by their throughput.
          </Box>
          <Box variant="p">
            Before you compare models, check your own loop. LeRobot&apos;s cadence report has a line for pacing
            headroom, which is the time that the loop slept per tick. The sample in the documentation explains this
            line with the note &quot;near zero means the loop is saturated&quot;.{' '}
            <Cite id="F01-38">LeRobot imitation learning tutorial, cadence reporting</Cite> Then, for each model that
            you consider, find three things:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Inputs.</strong> Find which cameras and which joint state the model takes in.
            </li>
            <li>
              <strong>Outputs.</strong> Find which action space the model uses and how long its chunks are.
            </li>
            <li>
              <strong>Latency.</strong> Find how long one call takes on the computer that you can put next to the
              arm.
            </li>
          </ul>
          <Box variant="p">
            Multiply that latency by the speed of your gripper, and compare the resulting distance in millimetres with
            the width of your cup.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
