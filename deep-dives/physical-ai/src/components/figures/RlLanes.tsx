import { Chip, EMPHASIS, LINE, MUTED, PAPER, T, box, rbox, useNarrow } from './DemoKit';

/**
 * Section 8, the three places robot RL gets its attempts, drawn as the attempts themselves.
 *
 * Left of each lane: one dot per arm attempting at the same moment, at one dot size for all three
 * lanes (4,096 in the simulator recipe, 64 to 320 for RL on a VLA, one on the bench). Right: one
 * turn of the loop (try, then update), where the part that takes the width is the part the lane
 * waits on. Only the real-arm strip has a time scale (20 s of attempt, 5 s of reset); the files
 * read publish no wall-clock time for the other two, so their cells are counts and the figure
 * says so.
 */

interface Tone {
  fill: string;
  ink: string;
}

const SIM: Tone = { fill: '#fdeedd', ink: '#a85a0a' };
const VLA: Tone = { fill: '#e6f6ea', ink: '#1e7b3a' };
const REAL: Tone = { fill: '#fff6d6', ink: '#7a5c00' };

/** A field of dots as one path: cols by rows, round-capped zero-length strokes. */
function dotField(x: number, y: number, cols: number, rows: number, pitch: number, from = 0, to = cols * rows): string {
  let d = '';
  for (let k = from; k < to; k += 1) {
    const c = k % cols;
    const r = Math.floor(k / cols);
    d += `M${(x + c * pitch + pitch / 2).toFixed(2)} ${(y + r * pitch + pitch / 2).toFixed(2)}h0.01`;
  }
  return d;
}

function Person({ x, y, ink }: { x: number; y: number; ink: string }) {
  return (
    <g>
      <circle cx={x} cy={y - 11} r="4" fill={ink} />
      <path d={`M${x - 6.5} ${y + 5}v-6a6.5 6.5 0 0 1 13 0v6Z`} fill={ink} />
    </g>
  );
}

function Card({ x, y, w, h, tone }: { x: number; y: number; w: number; h: number; tone: Tone }) {
  return (
    <g>
      <path d={rbox(x, y, w, h, 6)} fill="#ffffff" stroke={tone.ink} strokeWidth="1.4" />
      <path d={`M${x + 6} ${y}a6 6 0 0 0 -6 6v${h - 12}a6 6 0 0 0 6 6Z`} fill={tone.ink} />
    </g>
  );
}

/** A row of cells for the steps of one turn, then the update block. Returns nothing but draws both. */
function Turn({ x, y, h, cells, cellW, tone, updateW, dots }: { x: number; y: number; h: number; cells: number; cellW: number; tone: Tone; updateW: number; dots?: boolean }) {
  const end = x + cells * cellW;
  return (
    <g>
      {Array.from({ length: cells }, (_, k) => (
        <path key={k} d={box(x + k * cellW, y, cellW - 2, h)} fill={tone.fill} stroke={tone.ink} strokeWidth="1.1" />
      ))}
      {dots && <path d={`M${end + 6} ${y + h / 2}h0.01M${end + 14} ${y + h / 2}h0.01M${end + 22} ${y + h / 2}h0.01`} stroke={tone.ink} strokeWidth="3.4" strokeLinecap="round" />}
      <path d={box(end + (dots ? 32 : 6), y, updateW, h)} fill={tone.ink} />
    </g>
  );
}

export function RlLanes() {
  const narrow = useNarrow();
  const W = narrow ? 320 : 1200;
  const H = narrow ? 812 : 648;
  const pitch = narrow ? 2.6 : 3.2;
  const dotW = narrow ? 1.8 : 2.2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="robot-rl-lanes-title" style={{ width: '100%', height: 'auto' }}>
      <title id="robot-rl-lanes-title">Three places reinforcement learning gets its attempts for a robot, and what each one waits on</title>
      <desc>
        Three lanes. Each shows a field of dots, one per arm attempting the task at the same moment, and a strip for
        one turn of the loop. In a simulator the field is a square of 4,096 dots, and a turn is 16 thin steps and an
        update, repeated 3,000 times. On a pretrained policy the field is 64 to 320 dots above 8 GPU chips, and each
        step is wide because it runs a large model. On the real arm the field is a single dot beside a person, and the
        strip is a time line of 20 second attempts separated by 5 second resets.
      </desc>
      <defs>
        <pattern id="robot-rl-lanes-hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <path d="M0 0v6" stroke={REAL.ink} strokeWidth="1.8" />
        </pattern>
      </defs>
      <rect x="0" y="0" width={W} height={H} fill={PAPER} />

      {narrow ? (
        <g>
          {/* lane 1 */}
          <Card x={6} y={8} w={308} h={338} tone={SIM} />
          <T x={22} y={30} size={13} bold fill={SIM.ink}>
            1. In a simulator
          </T>
          <T x={22} y={48} size={12}>
            4,096 simulated arms in parallel
          </T>
          <path d={dotField(22, 58, 64, 64, pitch)} stroke={SIM.ink} strokeWidth={dotW} strokeLinecap="round" />
          <T x={200} y={84} size={12}>
            one dot is one
          </T>
          <T x={200} y={100} size={12}>
            arm attempting
          </T>
          <T x={200} y={116} size={12}>
            the task
          </T>
          <Turn x={22} y={236} h={26} cells={16} cellW={14.5} tone={SIM} updateW={40} />
          <T x={22} y={280} size={12}>
            16 steps by every arm, then one update.
          </T>
          <T x={22} y={296} size={12}>
            Repeated 3,000 times: about 197 million steps.
          </T>
          <T x={22} y={318} size={12} bold fill={EMPHASIS}>
            Waits on: simulator steps per second
          </T>
          <T x={22} y={336} size={12} fill={MUTED}>
            (no wall-clock time is published for it)
          </T>

          {/* lane 2 */}
          <Card x={6} y={356} w={308} h={210} tone={VLA} />
          <T x={22} y={378} size={13} bold fill={VLA.ink}>
            2. On a pretrained policy
          </T>
          <T x={22} y={396} size={12}>
            a VLA practises in simulation
          </T>
          <path d={dotField(22, 406, 40, 8, pitch, 0, 64)} stroke={VLA.ink} strokeWidth={dotW} strokeLinecap="round" />
          <path d={dotField(22, 406, 40, 8, pitch, 64, 320)} stroke={VLA.ink} strokeWidth={dotW} strokeLinecap="round" opacity="0.4" />
          {Array.from({ length: 8 }, (_, k) => (
            <Chip key={k} x={142 + k * 20} y={410} s={11} />
          ))}
          <T x={22} y={446} size={12}>
            64 to 320 copies of the scene on 8 GPUs
          </T>
          <Turn x={22} y={458} h={26} cells={3} cellW={70} tone={VLA} updateW={40} dots />
          <T x={22} y={502} size={12}>
            Every step of every copy is a forward pass
          </T>
          <T x={22} y={518} size={12}>
            of a model with billions of parameters.
          </T>
          <T x={22} y={542} size={12} bold fill={EMPHASIS}>
            Waits on: rollouts of the large model
          </T>

          {/* lane 3 */}
          <Card x={6} y={576} w={308} h={228} tone={REAL} />
          <T x={22} y={598} size={13} bold fill={REAL.ink}>
            3. On the real arm
          </T>
          <T x={22} y={616} size={12}>
            one arm on the bench, a person nearby
          </T>
          <path d={dotField(26, 630, 1, 1, pitch)} stroke={REAL.ink} strokeWidth={dotW} strokeLinecap="round" />
          <circle cx={26 + pitch / 2} cy={630 + pitch / 2} r="7" fill="none" stroke={REAL.ink} strokeWidth="1.2" />
          <Person x={52} y={634} ink={REAL.ink} />
          <T x={70} y={636} size={12}>
            1 arm (same dot size), 1 person
          </T>
          {Array.from({ length: 4 }, (_, k) => (
            <g key={k}>
              <path d={box(22 + k * 71, 652, 56.8, 26)} fill={REAL.fill} stroke={REAL.ink} strokeWidth="1.1" />
              <path d={box(22 + k * 71 + 56.8, 652, 14.2, 26)} fill="#ffffff" stroke={REAL.ink} strokeWidth="1.1" />
              <path d={box(22 + k * 71 + 56.8, 652, 14.2, 26)} fill="url(#robot-rl-lanes-hatch)" />
              <T x={22 + k * 71 + 28.4} y={669} size={12} anchor="middle" fill={REAL.ink}>
                20 s
              </T>
            </g>
          ))}
          <T x={22} y={696} size={12}>
            A 20 s attempt, then a 5 s reset (hatched).
          </T>
          <T x={22} y={712} size={12} num="derived">
            At most 144 attempts an hour.
          </T>
          <path d={box(22, 722, 284, 7)} fill={LINE} />
          <T x={22} y={746} size={12}>
            Grey bar: the training program updates
          </T>
          <T x={22} y={762} size={12}>
            the policy the whole time.
          </T>
          <T x={22} y={788} size={12} bold fill={EMPHASIS}>
            Waits on: the arm, the reset and a person
          </T>
        </g>
      ) : (
        <g>
          <T x={278} y={28} size={12} fill={MUTED}>
            arms attempting at the same moment, one dot each
          </T>
          <T x={600} y={28} size={12} fill={MUTED}>
            one turn of the loop: the attempts (light cells), then the update (dark block)
          </T>

          {/* lane 1 */}
          <Card x={10} y={40} w={1180} h={238} tone={SIM} />
          <T x={30} y={70} size={15} bold fill={SIM.ink}>
            1. In a simulator
          </T>
          <T x={30} y={94}>
            4,096 simulated arms in parallel
          </T>
          <T x={30} y={114}>
            attempts by the thousand,
          </T>
          <T x={30} y={132}>
            no hardware needed
          </T>
          <path d={dotField(278, 56, 64, 64, pitch)} stroke={SIM.ink} strokeWidth={dotW} strokeLinecap="round" />
          <Turn x={600} y={66} h={36} cells={16} cellW={26} tone={SIM} updateW={64} />
          <path d="M1054 62V52H612V62" fill="none" stroke={SIM.ink} strokeWidth="1.4" />
          <path d="M607 58h10l-5 8Z" fill={SIM.ink} />
          <T x={1100} y={80} fill={SIM.ink} bold>
            repeated
          </T>
          <T x={1100} y={98} fill={SIM.ink} bold>
            3,000 times
          </T>
          <T x={600} y={128}>
            16 steps by every arm, then one update of the policy
          </T>
          <T x={600} y={150}>
            each step: 4,096 camera images rendered, one batch through the policy, the physics advanced
          </T>
          <T x={600} y={172}>
            4,096 arms x 16 steps x 3,000 turns = about 197 million steps
          </T>
          <T x={600} y={236} size={14} bold fill={EMPHASIS}>
            Waits on: simulator steps per second
          </T>
          <T x={600} y={258} size={12} fill={MUTED}>
            The strip counts steps. The files read publish no wall-clock time for this recipe.
          </T>

          {/* lane 2 */}
          <Card x={10} y={290} w={1180} h={156} tone={VLA} />
          <T x={30} y={320} size={15} bold fill={VLA.ink}>
            2. On a pretrained policy
          </T>
          <T x={30} y={344}>
            a VLA that already works
          </T>
          <T x={30} y={362}>
            some of the time practises
          </T>
          <T x={30} y={380}>
            in simulation
          </T>
          <path d={dotField(278, 308, 40, 8, pitch, 0, 64)} stroke={VLA.ink} strokeWidth={dotW} strokeLinecap="round" />
          <path d={dotField(278, 308, 40, 8, pitch, 64, 320)} stroke={VLA.ink} strokeWidth={dotW} strokeLinecap="round" opacity="0.4" />
          <T x={278} y={356} size={12}>
            64 to 320 copies of the scene
          </T>
          {Array.from({ length: 8 }, (_, k) => (
            <Chip key={k} x={280 + k * 26} y={372} s={14} />
          ))}
          <T x={278} y={412} size={12}>
            on 8 GPUs
          </T>
          <Turn x={600} y={312} h={36} cells={4} cellW={104} tone={VLA} updateW={64} dots />
          <T x={600} y={374}>
            every step of every copy is a forward pass of a model with billions of parameters
          </T>
          <T x={600} y={410} size={14} bold fill={EMPHASIS}>
            Waits on: rollouts of the large model
          </T>
          <T x={600} y={432} size={12} fill={MUTED}>
            Cell widths are schematic: a step here costs far more than a step in lane 1.
          </T>

          {/* lane 3 */}
          <Card x={10} y={458} w={1180} h={180} tone={REAL} />
          <T x={30} y={488} size={15} bold fill={REAL.ink}>
            3. On the real arm
          </T>
          <T x={30} y={512}>
            one arm on the bench,
          </T>
          <T x={30} y={530}>
            a person nearby
          </T>
          <path d={dotField(284, 486, 1, 1, pitch)} stroke={REAL.ink} strokeWidth={dotW} strokeLinecap="round" />
          <circle cx={284 + pitch / 2} cy={486 + pitch / 2} r="8" fill="none" stroke={REAL.ink} strokeWidth="1.2" />
          <T x={302} y={492} size={12}>
            1 arm, at the same dot size
          </T>
          <Person x={286} y={526} ink={REAL.ink} />
          <T x={302} y={530} size={12}>
            1 person for the resets
          </T>
          {Array.from({ length: 4 }, (_, k) => (
            <g key={k}>
              <path d={box(600 + k * 115, 488, 92, 36)} fill={REAL.fill} stroke={REAL.ink} strokeWidth="1.1" />
              <path d={box(600 + k * 115 + 92, 488, 23, 36)} fill="#ffffff" stroke={REAL.ink} strokeWidth="1.1" />
              <path d={box(600 + k * 115 + 92, 488, 23, 36)} fill="url(#robot-rl-lanes-hatch)" />
              <T x={600 + k * 115 + 46} y={511} anchor="middle" fill={REAL.ink}>
                attempt, 20 s
              </T>
              <Person x={600 + k * 115 + 103.5} y={480} ink={REAL.ink} />
            </g>
          ))}
          <T x={1072} y={502} bold fill={REAL.ink} num="derived">
            at most 144
          </T>
          <T x={1072} y={520} bold fill={REAL.ink}>
            attempts an hour
          </T>
          <path d={box(600, 532, 460, 8)} fill={LINE} />
          <T x={600} y={560}>
            hatched: the 5 s reset, done by a person
          </T>
          <T x={600} y={578}>
            grey bar: the training program updates the policy the whole time
          </T>
          <T x={600} y={604} size={14} bold fill={EMPHASIS}>
            Waits on: the arm, the reset and a person
          </T>
          <T x={600} y={625} size={12} fill={MUTED} num="derived">
            This strip is to scale in time: four attempts in 100 s.
          </T>
        </g>
      )}
    </svg>
  );
}
