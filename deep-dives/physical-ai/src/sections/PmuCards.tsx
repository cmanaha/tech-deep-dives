import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Formula, M } from '../components/Math';
import { Cite, Toy, Derived } from '../components/Cite';
import { Figure, AnimatedFigure } from '../components/Figure';
import { Snippet } from '../components/Blocks';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const CPU_FILL = '#e8f1fb';
const CPU_INK = '#1f5fa8';
const NEUTRAL_INK = '#5f6b7a';
const EMPHASIS = '#0972d3';

/* The four top-down buckets keep one colour each in both figures; every use also carries a text label. */
const RET = { fill: '#dcebfa', ink: '#1f5fa8' };
const BAD = { fill: '#fdeedd', ink: '#a85a0a' };
const FRONT = { fill: '#eef0f2', ink: '#44505c' };
const BACK = { fill: '#fde8ef', ink: '#a8274f' };

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 560, margin: '0 auto' };

/* Adapted from the run script (E-seed run.sh, F08-60); the PMU name is the Spark card's (F08-68). */
const PERF_SNIPPET = `PMU=armv8_pmuv3_1   # the Cortex-X925's event source on a DGX Spark
sudo taskset -c "$CPU" perf stat -x, \\
  -e $PMU/stall_slot/,$PMU/stall_slot_frontend/,$PMU/stall_slot_backend/,$PMU/op_retired/,$PMU/op_spec/,$PMU/cpu_cycles/ \\
  -- ./your_program`;

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/* ------------------------------------------------------------------------ */
/* Diagram 21.1: where slots go (animated)                                  */
/* ------------------------------------------------------------------------ */

const SLOT_CAPTIONS = [
  <>
    A core&apos;s pipeline has three stages. The front end fetches and decodes instructions, the back end executes
    them, and retirement makes their results final. Between the front end and the back end, the core has a fixed
    number of slots in each cycle, and this illustrative core has 4.
  </>,
  <>
    Retiring: the front end hands a micro-operation to the slot, the back end executes it, and the micro-operation
    retires. The slot did work that the program kept.
  </>,
  <>
    Bad speculation: the slot receives a micro-operation, but the micro-operation follows a branch that the core
    guessed wrong. It is thrown away and never retires.
  </>,
  <>
    Front-end bound: the back end could accept a micro-operation, but the front end has none ready, so the slot stays
    empty.
  </>,
  <>
    Back-end bound: the front end has a micro-operation ready, but the back end cannot accept it, so the slot stays
    empty.
  </>,
  <>
    Every slot of the run ends up in exactly one bucket. In the example, the <Toy>400</Toy> slots split into{' '}
    <Toy>54%</Toy> retiring, <Toy>6%</Toy> bad speculation, <Toy>15%</Toy> front-end bound and <Toy>25%</Toy>{' '}
    back-end bound.
  </>,
];

const SLOT_STATUS = [
  'Each cycle offers 4 slots to the back end',
  'The slot is filled, and the work retires',
  'The slot is filled, but the work is thrown away',
  'Slot empty: the front end had nothing ready',
  'Slot empty: the back end could not accept',
  'Every slot of the run ends up in one bucket',
];

const BUCKETS = [
  { x: 15, cx: 60, lines: ['Retiring'], c: RET, at: 1, share: '54%' },
  { x: 110, cx: 155, lines: ['Bad', 'speculation'], c: BAD, at: 2, share: '6%' },
  { x: 220, cx: 265, lines: ['Front-end', 'bound'], c: FRONT, at: 3, share: '15%' },
  { x: 315, cx: 360, lines: ['Back-end', 'bound'], c: BACK, at: 4, share: '25%' },
];

function SlotsDiagram({ step, reduced }: { step: number; reduced: boolean }) {
  const move = reduced ? 'none' : 'transform 900ms ease, opacity 400ms ease';
  const fade = reduced ? 'none' : 'opacity 400ms ease';
  const delivered = step === 1 || step === 2;
  const empty = step === 3 || step === 4;
  const onQ1 = step >= 1 && step <= 4;
  const onQ2 = step === 1 || step === 2;
  const onSide = step === 3 || step === 4;
  const stroke = (on: boolean) => (on ? EMPHASIS : NEUTRAL_INK);
  const width = (on: boolean) => (on ? 2.5 : 1.5);
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 420 440" role="img" aria-labelledby="pmu-cards-slots-title" style={{ width: '100%', height: 'auto' }} fontFamily="sans-serif">
        <title id="pmu-cards-slots-title">How two questions sort each pipeline slot into one of four buckets</title>
        <desc>
          A core is drawn as front end, slots, back end and retirement. A decision tree below it asks whether a
          micro-operation was delivered to the slot and whether it retired. The tree ends in four buckets: retiring,
          bad speculation, front-end bound and back-end bound.
        </desc>
        <rect x="0" y="0" width="420" height="440" fill="#fbfbfd" />
        <text x="10" y="26" fontSize="13" fontWeight="bold" fill={INK}>
          One core, drawn with 4 slots per cycle (illustration)
        </text>

        {/* Pipeline */}
        <rect x="10" y="40" width="112" height="90" rx="6" fill={CPU_FILL} stroke={stroke(step === 3)} strokeWidth={width(step === 3)} />
        <text x="66" y="62" fontSize="13" fontWeight="bold" textAnchor="middle" fill={INK}>
          Front end
        </text>
        <text x="66" y="80" fontSize="12" textAnchor="middle" fill={INK}>
          fetch, decode
        </text>
        <rect x="164" y="40" width="128" height="90" rx="6" fill={CPU_FILL} stroke={stroke(step === 4)} strokeWidth={width(step === 4)} />
        <text x="228" y="62" fontSize="13" fontWeight="bold" textAnchor="middle" fill={INK}>
          Back end
        </text>
        <text x="228" y="80" fontSize="12" textAnchor="middle" fill={INK}>
          execute
        </text>
        <rect x="302" y="40" width="108" height="90" rx="6" fill={CPU_FILL} stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <text x="356" y="62" fontSize="13" fontWeight="bold" textAnchor="middle" fill={INK}>
          Retirement
        </text>
        <text x="356" y="80" fontSize="12" textAnchor="middle" fill={INK}>
          finish, in order
        </text>
        <line x1="122" y1="113" x2="132" y2="113" stroke={NEUTRAL_INK} strokeWidth="2" />
        <line x1="154" y1="113" x2="164" y2="113" stroke={NEUTRAL_INK} strokeWidth="2" />
        <line x1="292" y1="113" x2="302" y2="113" stroke={NEUTRAL_INK} strokeWidth="2" />

        {/* The slots of one cycle; the lowest one is followed through the steps */}
        {[44, 64, 84].map((y) => (
          <rect key={y} x="132" y={y} width="22" height="18" rx="3" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1.5" />
        ))}
        <rect
          x="132"
          y="104"
          width="22"
          height="18"
          rx="3"
          fill={delivered ? (step === 1 ? RET.fill : BAD.fill) : '#ffffff'}
          stroke={delivered || empty ? EMPHASIS : NEUTRAL_INK}
          strokeWidth={delivered || empty ? 2.5 : 1.5}
          strokeDasharray={empty ? '4 3' : undefined}
        />
        <text x="143" y="148" fontSize="12" textAnchor="middle" fill={NEUTRAL_INK}>
          4 slots per cycle
        </text>

        {/* Step 2: a micro-operation that retires */}
        <g style={{ transform: step >= 1 ? 'translate(322px, 113px)' : 'translate(30px, 113px)', opacity: step === 1 ? 1 : 0, transition: move }}>
          <circle r="7" fill={RET.ink} />
        </g>
        {step === 1 && (
          <text x="336" y="117" fontSize="12" fontWeight="bold" fill={RET.ink}>
            retired
          </text>
        )}

        {/* Step 3: a micro-operation that is thrown away */}
        <g style={{ transform: step >= 2 ? 'translate(184px, 113px)' : 'translate(30px, 113px)', opacity: step === 2 ? 1 : 0, transition: move }}>
          <circle r="7" fill={BAD.fill} stroke={BAD.ink} strokeWidth="2" />
          <line x1="-5" y1="-5" x2="5" y2="5" stroke={BAD.ink} strokeWidth="2" />
          <line x1="-5" y1="5" x2="5" y2="-5" stroke={BAD.ink} strokeWidth="2" />
        </g>
        {step === 2 && (
          <text x="198" y="117" fontSize="12" fontWeight="bold" fill={BAD.ink}>
            thrown away
          </text>
        )}

        {/* Step 4: nothing ready in the front end */}
        {step === 3 && (
          <text x="66" y="117" fontSize="12" fontWeight="bold" textAnchor="middle" fill={FRONT.ink}>
            nothing ready
          </text>
        )}

        {/* Step 5: a micro-operation waits, the back end is full */}
        <g style={{ transform: 'translate(30px, 113px)', opacity: step === 4 ? 1 : 0, transition: fade }}>
          <circle r="7" fill={NEUTRAL_INK} />
        </g>
        {step === 4 && (
          <>
            <text x="44" y="117" fontSize="12" fontWeight="bold" fill={INK}>
              ready
            </text>
            <text x="228" y="117" fontSize="12" fontWeight="bold" textAnchor="middle" fill={BACK.ink}>
              cannot accept
            </text>
          </>
        )}

        <text x="210" y="174" fontSize="13" fontWeight="bold" textAnchor="middle" fill={INK}>
          {SLOT_STATUS[step]}
        </text>

        {/* Two questions */}
        <rect x="20" y="188" width="380" height="34" rx="6" fill="#ffffff" stroke={stroke(onQ1)} strokeWidth={width(onQ1)} />
        <text x="210" y="210" fontSize="12.5" textAnchor="middle" fill={INK}>
          1. Was a micro-operation delivered to the slot?
        </text>
        <line x1="110" y1="222" x2="110" y2="262" stroke={stroke(onQ2)} strokeWidth={width(onQ2)} />
        <line x1="310" y1="222" x2="310" y2="262" stroke={stroke(onSide)} strokeWidth={width(onSide)} />
        <text x="118" y="246" fontSize="12" fontWeight={onQ2 ? 'bold' : 'normal'} fill={INK}>
          yes
        </text>
        <text x="318" y="246" fontSize="12" fontWeight={onSide ? 'bold' : 'normal'} fill={INK}>
          no
        </text>
        <rect x="20" y="262" width="180" height="34" rx="6" fill="#ffffff" stroke={stroke(onQ2)} strokeWidth={width(onQ2)} />
        <text x="110" y="284" fontSize="12.5" textAnchor="middle" fill={INK}>
          2. Did it retire?
        </text>
        <rect x="220" y="262" width="180" height="34" rx="6" fill="#ffffff" stroke={stroke(onSide)} strokeWidth={width(onSide)} />
        <text x="310" y="284" fontSize="12.5" textAnchor="middle" fill={INK}>
          Which side was not ready?
        </text>
        <text x="66" y="320" fontSize="12" fontWeight={step === 1 ? 'bold' : 'normal'} fill={INK}>
          yes
        </text>
        <text x="161" y="320" fontSize="12" fontWeight={step === 2 ? 'bold' : 'normal'} fill={INK}>
          no
        </text>
        <text x="259" y="320" fontSize="12" fontWeight={step === 3 ? 'bold' : 'normal'} textAnchor="end" fill={INK}>
          front end
        </text>
        <text x="354" y="320" fontSize="12" fontWeight={step === 4 ? 'bold' : 'normal'} textAnchor="end" fill={INK}>
          back end
        </text>

        {/* Four buckets */}
        {BUCKETS.map((b) => {
          const active = step === b.at;
          const lit = step >= b.at;
          return (
            <g key={b.x}>
              <line x1={b.cx} y1="296" x2={b.cx} y2="336" stroke={stroke(active)} strokeWidth={width(active)} />
              <rect
                x={b.x}
                y="336"
                width="90"
                height="66"
                rx="6"
                fill={lit ? b.c.fill : '#ffffff'}
                stroke={active ? EMPHASIS : lit ? b.c.ink : NEUTRAL_INK}
                strokeWidth={active ? 2.5 : 1.5}
                style={{ transition: reduced ? 'none' : 'fill 400ms ease' }}
              />
              {b.lines.map((l, i) => (
                <text key={l} x={b.cx} y={356 + i * 15} fontSize="12" fontWeight="bold" textAnchor="middle" fill={lit ? b.c.ink : INK}>
                  {l}
                </text>
              ))}
              {step === 5 && (
                <text x={b.cx} y="394" fontSize="13" fontWeight="bold" textAnchor="middle" fill={INK} data-num="toy">
                  {b.share}
                </text>
              )}
            </g>
          );
        })}
        {step === 5 && (
          <text x="210" y="426" fontSize="12" textAnchor="middle" fill={NEUTRAL_INK} data-num="toy">
            Illustration: 100 cycles x 4 slots = 400 slots
          </text>
        )}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 21.2: a sample card with its parts labelled                      */
/* ------------------------------------------------------------------------ */

/* The physics step on the DGX Spark's Cortex-X925, register entry F08-61 (one run). */
const CARD = {
  throughput: '57,240 steps per second',
  rows: [
    { name: 'Retiring', pct: 45.7, c: RET },
    { name: 'Bad speculation', pct: 5.6, c: BAD },
    { name: 'Front-end bound', pct: 12.2, c: FRONT },
    { name: 'Back-end bound', pct: 36.5, c: BACK },
  ],
};

function Badge({ y, n }: { y: number; n: number }) {
  return (
    <g>
      <circle cx="22" cy={y} r="13" fill={EMPHASIS} />
      <text x="22" y={y + 5} fontSize="14" fontWeight="bold" textAnchor="middle" fill="#ffffff">
        {n}
      </text>
    </g>
  );
}

function SampleCard() {
  const barX = 58;
  const barW = 340;
  let acc = 0;
  const segs = CARD.rows.map((r) => {
    const x = barX + (acc / 100) * barW;
    acc += r.pct;
    return { ...r, x, w: (r.pct / 100) * barW };
  });
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 420 534" role="img" aria-labelledby="pmu-cards-card-title" style={{ width: '100%', height: 'auto' }} fontFamily="sans-serif">
        <title id="pmu-cards-card-title">A sample PMU card: the physics step on one Cortex-X925 core of a DGX Spark</title>
        <desc>
          A card in four numbered bands. Band 1 says what ran, on which machine and how the counters were read. Band
          2 gives the throughput. Band 3 shows the four top-down shares as a stacked bar with a legend. Band 4 gives
          the memory stall share and instructions per cycle. Markers 1 to 4 tie each band to one of the four
          questions for reading a card.
        </desc>
        <rect x="0" y="0" width="420" height="534" fill="#fbfbfd" />
        <rect x="46" y="10" width="364" height="514" rx="8" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1.5" />

        {/* 1: what ran, and how it was counted */}
        <Badge y={96} n={1} />
        <path d="M46 18 a8 8 0 0 1 8 -8 h348 a8 8 0 0 1 8 8 v80 h-364 z" fill={CPU_FILL} stroke={CPU_INK} strokeWidth="1.5" />
        <text x="58" y="34" fontSize="14" fontWeight="bold" fill={INK}>
          Physics step, MuJoCo humanoid
        </text>
        <text x="58" y="54" fontSize="12.5" fill={INK}>
          DGX Spark, one Cortex-X925 core
        </text>
        <text x="58" y="72" fontSize="12.5" fill={INK}>
          MuJoCo 4.0.1
        </text>
        <text x="58" y="90" fontSize="12.5" fontWeight="bold" fill={CPU_INK}>
          Our measurement, single run
        </text>
        <rect x="46" y="98" width="364" height="84" fill="#f4f6f8" stroke="#d5dbdb" strokeWidth="1.5" />
        <text x="58" y="120" fontSize="12" fontWeight="bold" fill={INK}>
          How it was counted
        </text>
        <text x="58" y="138" fontSize="12" fill={INK}>
          perf stat on one core, six slot events
        </text>
        <text x="58" y="155" fontSize="12" fill={INK}>
          Generic Arm formula from Linux perf,
        </text>
        <text x="58" y="172" fontSize="12" fill={INK}>
          without the flush correction
        </text>

        {/* 2: throughput */}
        <Badge y={214} n={2} />
        <text x="58" y="204" fontSize="12" fill={NEUTRAL_INK}>
          Throughput
        </text>
        <text x="58" y="228" fontSize="19" fontWeight="bold" fill={INK}>
          {CARD.throughput}
        </text>
        <line x1="46" y1="242" x2="410" y2="242" stroke="#d5dbdb" strokeWidth="1.5" />

        {/* 3: where the slots went */}
        <Badge y={318} n={3} />
        <text x="58" y="264" fontSize="12" fill={NEUTRAL_INK}>
          Where the 10 slots per cycle went
        </text>
        {segs.map((s) => (
          <rect key={s.name} x={s.x} y="274" width={s.w} height="24" fill={s.c.fill} stroke={s.c.ink} strokeWidth="1.5" />
        ))}
        {segs.map((s, i) => (
          <g key={s.name}>
            <rect x="58" y={311 + i * 20} width="14" height="14" fill={s.c.fill} stroke={s.c.ink} strokeWidth="1.5" />
            <text x="80" y={323 + i * 20} fontSize="12.5" fill={INK}>
              {s.name}
            </text>
            <text x="398" y={323 + i * 20} fontSize="12.5" fontWeight="bold" textAnchor="end" fill={INK}>
              {s.pct.toFixed(1)}%
            </text>
          </g>
        ))}
        <line x1="46" y1="398" x2="410" y2="398" stroke="#d5dbdb" strokeWidth="1.5" />

        {/* 4: behind the largest loss */}
        <Badge y={438} n={4} />
        <text x="58" y="420" fontSize="12" fill={NEUTRAL_INK}>
          What lies behind the largest loss
        </text>
        <text x="58" y="442" fontSize="12.5" fill={INK}>
          Memory stall
        </text>
        <text x="398" y="442" fontSize="12.5" fontWeight="bold" textAnchor="end" fill={INK}>
          0.4% of cycles
        </text>
        <text x="58" y="462" fontSize="12.5" fill={INK}>
          Instructions per cycle
        </text>
        <text x="398" y="462" fontSize="12.5" fontWeight="bold" textAnchor="end" fill={INK}>
          4.37
        </text>

        {/* GPU rows */}
        <rect x="58" y="484" width="340" height="32" rx="4" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1.5" strokeDasharray="5 4" />
        <text x="228" y="505" fontSize="12" textAnchor="middle" fill={NEUTRAL_INK}>
          No GPU rows: this workload ran on the CPU
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function PmuCards() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The hardware counters in a CPU core and in a GPU record what the hardware did while a job ran, and reading them shows the job's bottleneck. Before you pay for more hardware, they tell you whether a faster core or faster memory would speed the job up, and which units of the GPU the job actually uses."
          >
            21. Reading a Machine: Using Hardware Counters to Find the Bottleneck
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Before you pay for a faster core or for faster memory, you want to know which of the two would speed the
            job up. You can find out while the job runs, from counters built into the hardware. Each CPU core has a
            performance monitoring unit (PMU), a set of hardware counters that count events such as clock cycles. A
            GPU has counters of its own. Read together, these counters show the job&apos;s bottleneck: the resource
            that is fully used while the rest of the machine is partly idle.
          </Box>
          <Box variant="p">
            On a CPU core, the counters show how the core used its capacity. A core splits each program instruction
            into smaller internal steps called micro-operations. In every clock cycle, the core has a fixed number of
            chances to start a micro-operation, and the counters record what happened to each chance. Sorted into
            four groups, these records show how much of the core&apos;s capacity went into work that finished and how
            much went into work that was thrown away. They also show how much capacity was left unused, either
            because the front of the core had nothing ready or because the back of the core could not accept more.
            These four percentages, together with a second level of detail that splits the losses at the back of the
            core into two kinds, tell you whether to pay for a faster core or for faster memory.{' '}
            <Cite id="F08-50">which counter shows each resource</Cite>
          </Box>
          <Box variant="p">
            Each of these chances is called a slot. The front end of a core fetches instructions and decodes them
            into micro-operations, and the back end executes them. A slot is one opportunity, in one clock cycle, to
            pass one micro-operation from the front end to the back end.
          </Box>
          <Box variant="p">
            Here is a small example. Take an illustrative core with <Toy>4</Toy> slots per cycle, watched for{' '}
            <Toy>100</Toy> cycles, which gives <Toy>400</Toy> slots. Suppose <Toy>60</Toy> slots stayed empty because
            the front end had nothing ready, and <Toy>100</Toy> stayed empty because the back end could not accept
            more. The other <Toy>240</Toy> slots each carried a micro-operation. Of those, <Toy>216</Toy> finished and
            were kept, which is called retiring. The other <Toy>24</Toy> were thrown away, because the core had
            guessed wrong which way a branch in the code would go. Dividing each count by <Toy>400</Toy> gives four
            shares: retiring <Toy>54%</Toy>, bad speculation <Toy>6%</Toy>, front-end bound <Toy>15%</Toy> and
            back-end bound <Toy>25%</Toy>.{' '}
            <Cite id="F08-3">Intel VTune cookbook, the classification paragraphs</Cite>{' '}
            <Cite id="F08-14">Arm Neoverse V1 performance analysis white paper, section 3.2</Cite>
          </Box>
          <Box variant="p">
            Read as a diagnosis, the example says that <Toy>54%</Toy> of the core&apos;s capacity did work the program
            kept, and that the back end caused the largest loss. Sorting every slot into one of these four buckets is
            called top-down analysis. Intel introduced it, and AMD and Arm use it as well. The four buckets make up its
            first level, called level 1. Level 2 splits the back-end share in two. Memory bound is the share in which the core waits for loads
            and stores, and core bound is the share in which it waits on its own execution units. The split matters for
            what you buy. A job whose loads wait on main memory runs faster with faster memory, not with a faster
            core. It needs more memory bandwidth if its loads stream through memory, and lower memory latency if each
            load waits for the one before it. A core-bound job is the reverse: it runs faster on a faster core, and
            faster memory does not help it.{' '}
            <Cite id="F08-1">Intel perfmon README, its reference to the 2014 ISPASS paper</Cite>{' '}
            <Cite id="F08-11">Linux v7.3, amdzen4 pipeline.json</Cite>{' '}
            <Cite id="F08-14">Arm Neoverse V1 performance analysis white paper, section 3.2</Cite>{' '}
            <Cite id="F08-6">Intel TMA metrics file, rows Memory_Bound and Core_Bound</Cite>{' '}
            <Cite id="F08-41">Intel TMA metrics file, rows MEM_Bandwidth and MEM_Latency</Cite>
          </Box>
          <Box variant="p">
            We measured two NVIDIA machines, a DGX Spark desktop and a Jetson Orin Nano Super, a small onboard
            computer for robots. Each of our measurements is a single run. In one of them, a Cortex-X925 core of the
            Spark stepped a humanoid model in MuJoCo, a physics simulator. The back end left 36.5% of the slots empty,
            the largest of the three losses. The same step ran twice as fast on that core as on the Spark&apos;s
            smaller Cortex-A725 core. Main memory delivers data to either core at about the same rate, so main memory
            does not explain the difference. We call the set of readings for one workload on one machine, together
            with how they were counted, a PMU card. The readings on this card point to the core rather than to main
            memory, so a faster core is what you would pay for.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad DRAM rows</Cite>
          </Box>
          <Box variant="p">
            A GPU has no equivalent of the four-bucket sort, and its best-known figure is easy to misread. NVIDIA&apos;s
            nvidia-smi tool prints a GPU utilisation figure. That figure is the share of time during which any kernel
            was running on the GPU, where a kernel is a function launched on the GPU. So one small kernel run back to
            back reads 100%, however little of the chip it uses. For this reason, the GPU half of a PMU card uses
            counters that show which units inside the chip were busy.{' '}
            <Cite id="F08-30">nvidia-smi documentation, Utilization</Cite>{' '}
            <Cite id="F08-32">DCGM User Guide, profiling metrics</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A core's counters sort every slot into one of four buckets by asking two questions about it. For each kind of lost slot, a further count tells you where to look next."
          >
            How the counters sort every slot into four buckets
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each counter in the PMU is set to count one kind of event, such as a clock cycle, a retired
            micro-operation or a mispredicted branch. The counter adds one every time that event happens, and the
            program runs unchanged while it is counted. On Linux, the <code>perf stat</code> command runs a program
            and prints the totals of the counters. The most common one-number summary of those totals is instructions
            per cycle: the number of finished instructions divided by the number of clock cycles. Instructions per
            cycle tells you how much work the core got done, but not why it did not do more.
          </Box>
          <Box variant="p">
            Slot counts show why the core did not do more. Arm counts slots at the rename unit, the stage that passes
            micro-operations from the front end to the back end. A core has a fixed number of slots per cycle, and Arm
            treats that number as the core&apos;s execution bandwidth. So a run of known length has a known number of
            slots, and every slot that did not carry retired work is a loss with a recorded cause. Counting stalled
            cycles instead of slots gives less detail. On the <Toy>4</Toy>-slot core of the example, a cycle that used <Toy>1</Toy> of its{' '}
            <Toy>4</Toy> slots counts as not stalled, so its <Toy>3</Toy> empty slots are not recorded anywhere.{' '}
            <Cite id="F08-8">Intel TMA metrics file, row SLOTS</Cite>{' '}
            <Cite id="F08-2">Intel VTune cookbook, Top-down Microarchitecture Analysis Method</Cite>{' '}
            <Cite id="F08-14">Arm Neoverse V1 performance analysis white paper, section 3.2</Cite>{' '}
            <Cite id="F08-29">AWS Graviton guide, Top-down method to debug hardware performance</Cite>
          </Box>
          <Box variant="p">
            To see where a slot can end up, you need to know how the pipeline works. The front end predicts which
            instructions come next, fetches them and decodes them into micro-operations. The back end executes the
            micro-operations, out of program order when that is faster. Retirement then makes their results final, in
            program order. When the front end reaches a branch, such as an <code>if</code> or the end of a loop, it
            does not wait to learn which way the branch goes. It guesses and keeps fetching, which is called
            speculation. If the guess was wrong, the core throws away every micro-operation it started after the
            branch and restarts from the right place. This is called a flush. The thrown-away micro-operations used
            slots but never retire.{' '}
            <Cite id="F08-4">Intel TMA metrics file, row Frontend_Bound</Cite>{' '}
            <Cite id="F08-5">Intel TMA metrics file, row Backend_Bound</Cite>
          </Box>
          <Box variant="p">
            The bucket a slot goes into depends on the answers to two questions. First, was a micro-operation
            delivered to the slot?
            Second, if one was delivered, did it retire?{' '}
            <Cite id="F08-3">Intel VTune cookbook, the classification paragraphs</Cite>
          </Box>
          <AnimatedFigure
            name="where slots go"
            steps={SLOT_CAPTIONS}
            intervalMs={3200}
            cites="F08-2 F08-3"
            caption={
              <>
                The top row shows the core, and the tree below it shows the two questions that sort a slot. Each step
                follows one slot into its bucket. The figure is an illustration, not a measurement: the core is drawn
                with 4 slots per cycle, and the last step uses the made-up counts of the <Toy>400</Toy>-slot example.
              </>
            }
          >
            {(step, reduced) => <SlotsDiagram step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            Each bucket points to a cause. For the three buckets that are losses, a further count narrows down the
            cause:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Retiring</strong> is the share of slots that did work the program kept. A value of 100% would
              mean that the core ran at its full width, with every slot used. A high value can still leave room for a
              speed-up, because the program may do more work than it needs to. A slot counts as retiring whenever its
              micro-operation retires, whether or not the work was needed.{' '}
              <Cite id="F08-7">Intel TMA metrics file, rows Retiring and Bad_Speculation</Cite>
            </li>
            <li>
              <strong>Bad speculation</strong> points to branches that the core cannot predict, such as decisions that
              depend on the data. To find which branches, start with the number of mispredicted branches per thousand
              instructions. That count is the next step in the top-down method that AWS publishes for Graviton, its
              own Arm processors.{' '}
              <Cite id="F08-29">AWS Graviton guide, Top-down method to debug hardware performance</Cite>
            </li>
            <li>
              <strong>Front-end bound</strong> points to the code itself. It means that the program&apos;s code is too
              large, or jumps too often, for the core to fetch and decode it fast enough. Misses in the instruction
              cache count here. The next question is whether the front end was waiting to fetch instructions, from the instruction
              cache and its address translations, or waiting on the branch predictor and on recovery from flushes.
              Arm&apos;s level-2 metrics for the Cortex-X925, Cortex-A725 and Neoverse V3 split front-end stalls in
              exactly that way.{' '}
              <Cite id="F08-4">Intel TMA metrics file, row Frontend_Bound</Cite>{' '}
              <Cite id="F08-24">Arm Telemetry Solution, cortex_x925 level-2 metrics</Cite>
            </li>
            <li>
              <strong>Back-end bound</strong> splits at level 2 into memory bound and core bound. Core bound covers two
              cases: the execution units are all busy, or each operation waits for the result of the one before it, as
              in a chain of floating-point operations that each take many cycles. For a core-bound job, the next
              question is which of these two cases applies. For a memory-bound job, the next question is whether its
              loads wait on the core&apos;s data caches or on main memory.{' '}
              <Cite id="F08-6">Intel TMA metrics file, rows Memory_Bound and Core_Bound</Cite>{' '}
              <Cite id="F08-24">Arm Telemetry Solution, cortex_x925 level-2 metrics</Cite>{' '}
              <Cite id="F08-41">Intel TMA metrics file, rows MEM_Bandwidth and MEM_Latency</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You can compute the four shares of any card from the raw values of six Arm events. The shares always add up to 100% because of how the formula is built, so to test the formula, you run a program whose answer you already know."
          >
            Computing the four shares from six counters, and testing the formula
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The calculation uses six events that Arm cores provide. Under Arm&apos;s own names, they are:{' '}
            <Cite id="F08-15">Arm Cortex-X925 specification file, events</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <code>CPU_CYCLES</code> counts the clock cycles of the run.
            </li>
            <li>
              <code>STALL_SLOT_FRONTEND</code> counts the slots left empty because the front end had nothing ready.
            </li>
            <li>
              <code>STALL_SLOT_BACKEND</code> counts the slots left empty because the back end could not accept a
              micro-operation.
            </li>
            <li>
              <code>STALL_SLOT</code> counts all empty slots. It is the sum of the two previous events.
            </li>
            <li>
              <code>OP_SPEC</code> counts the micro-operations dispatched through a slot, including those that are
              later thrown away.
            </li>
            <li>
              <code>OP_RETIRED</code> counts the micro-operations that retired.
            </li>
          </ul>
          <Box variant="p">
            The formulas also need <M>S</M>, the core&apos;s number of slots per cycle, which is a fixed property of
            its design. From these, you compute three values. <M>{String.raw`\mathrm{slots}`}</M> is the total number
            of slots in the run. <M>{String.raw`\mathrm{filled}`}</M> is the share of slots that received a
            micro-operation. <M>{String.raw`\mathrm{kept}`}</M> is the share of dispatched micro-operations that
            retired.
          </Box>
          <Formula
            name="Total slots, and the two shares the buckets are built from"
            tex={String.raw`\begin{aligned} \mathrm{slots} &= S \times \texttt{CPU\_CYCLES} \\ \mathrm{filled} &= 1 - \frac{\texttt{STALL\_SLOT}}{\mathrm{slots}} \\ \mathrm{kept} &= \frac{\texttt{OP\_RETIRED}}{\texttt{OP\_SPEC}} \end{aligned}`}
            source={<Cite id="F08-20">Linux v7.3, perf metric file sbsa.json</Cite>}
          />
          <Box variant="p">
            Linux perf ships a generic form of level 1 for Arm cores. It computes the four shares as fractions of the
            total slots:
          </Box>
          <Formula
            name="Top-down level 1, generic Arm form"
            tex={String.raw`\begin{aligned} &\text{front-end bound} = \\ &\qquad \frac{\texttt{STALL\_SLOT\_FRONTEND}}{\mathrm{slots}} \\[6pt] &\text{back-end bound} = \\ &\qquad \frac{\texttt{STALL\_SLOT\_BACKEND}}{\mathrm{slots}} \\[6pt] &\text{retiring} = \mathrm{filled} \times \mathrm{kept} \\[6pt] &\text{bad speculation} = \\ &\qquad \mathrm{filled} \times (1 - \mathrm{kept}) \end{aligned}`}
            source={<Cite id="F08-20">Linux v7.3, perf metric file sbsa.json</Cite>}
          />
          <Box variant="p">
            Each line of the formula follows one branch of the two questions. Front-end bound and back-end bound are
            the &quot;no&quot; answers to the first question: the empty slots, sorted by the side that was not ready,
            divided by all slots. <M>{String.raw`\mathrm{filled}`}</M> is the share of &quot;yes&quot; answers to
            the first question. In the <Toy>400</Toy>-slot example, <M>{String.raw`\mathrm{filled}`}</M> is{' '}
            <Toy>1 - 160 / 400 = 0.6</Toy>. <M>{String.raw`\mathrm{kept}`}</M> answers the second question:{' '}
            <Toy>216 / 240 = 0.9</Toy>. Retiring is the share of filled slots whose work was kept,{' '}
            <Toy>0.6 x 0.9 = 0.54</Toy>. Bad speculation is the share of filled slots whose work was thrown away,{' '}
            <Toy>0.6 x 0.1 = 0.06</Toy>. These are the <Toy>54%</Toy> and <Toy>6%</Toy> of the example.
          </Box>
          <Box variant="p">
            The four shares always add up to 100%, because the formula forces them to. The two stall counts add up to{' '}
            <code>STALL_SLOT</code>, and retiring plus bad speculation equals <M>{String.raw`\mathrm{filled}`}</M>,
            which covers all the other slots. So a card whose shares add up to 100% has not passed any test.{' '}
            <Cite id="F08-69">our check of the raw counter rows</Cite>
          </Box>
          <Box variant="p">
            To test the formula, run a program whose answer you already know. One such program is a chain of loads in
            which each load waits for the one before it, over more memory than the caches can hold. Almost all of its
            slots should be back-end bound. We ran it on the Spark&apos;s Cortex-X925, on the Spark&apos;s smaller
            Cortex-A725 and on the Cortex-A78AE of the Jetson. It measured 97.6% to 99.0% back-end bound on the three
            cores. So on this test, the formula puts a known memory wait in the right bucket.{' '}
            <Cite id="F08-67">our profiling report, latency rows</Cite>{' '}
            <Cite id="F08-69">our check of the raw counter rows</Cite>
          </Box>
          <ExpandableSection headerText="Recomputing the physics-step card from its raw counter values">
            <SpaceBetween size="s">
              <Box variant="p">
                Here is the calculation for the MuJoCo humanoid step on one Cortex-X925 core of a DGX Spark, which
                has 10 slots per cycle, starting from the raw counter values:{' '}
                <Cite id="F08-70">our recomputation from the raw counter file</Cite>{' '}
                <Cite id="F08-69">raw row for the physics step</Cite>{' '}
                <Cite id="F08-68">our profiling report, slots per cycle</Cite>
              </Box>
              <ul style={LIST}>
                <li>
                  Slots: <Derived>19,958,256,358 cycles x 10 slots per cycle = 199,582,563,580</Derived>.
                </li>
                <li>
                  Front-end bound: <Derived>24,352,200,609 / 199,582,563,580 = 12.20%</Derived>.
                </li>
                <li>
                  Back-end bound: <Derived>72,922,813,391 / 199,582,563,580 = 36.54%</Derived>.
                </li>
                <li>
                  Filled: <Derived>1 - 97,275,014,000 / 199,582,563,580 = 0.5126</Derived>.
                </li>
                <li>
                  Kept: <Derived>91,123,888,968 / 102,307,494,220 = 0.8907</Derived>.
                </li>
                <li>
                  Retiring: <Derived>0.5126 x 0.8907 = 45.66%</Derived>. Bad speculation:{' '}
                  <Derived>0.5126 x (1 - 0.8907) = 5.60%</Derived>.
                </li>
                <li>
                  Check of the slots per cycle: every slot either stalls or carries a dispatched micro-operation, so
                  the two counts added together and divided by the cycles must give the slots per cycle:{' '}
                  <Derived>(97,275,014,000 + 102,307,494,220) / 19,958,256,358 = 10.000</Derived>.
                </li>
              </ul>
            </SpaceBetween>
          </ExpandableSection>
          <ExpandableSection headerText="The same four buckets on Intel and AMD cores">
            <Box variant="p">
              Intel and AMD cores sort slots into the same four buckets, with different event names. From Ice Lake
              onward, Intel cores count slots in a fixed counter and keep the four ratios in a dedicated register. So
              the four-bucket split uses none of the general-purpose counters, and those stay free for other events.
              AMD cores count dispatch slots. Zen 4 adds a fifth bucket for SMT (simultaneous multithreading), in
              which two hardware threads share one core. This fifth bucket holds the slots left unused because the
              core gave the turn to the other thread.{' '}
              <Cite id="F08-10">Linux v7.3, perf topdown documentation, Ice Lake</Cite>{' '}
              <Cite id="F08-11">Linux v7.3, amdzen4 pipeline.json, smt_contention</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Every share on a card is a share of that core's slots per cycle, and that number differs from core to core. Look up the width of the core you rent, and compare cores of different width by their throughput, not by their shares."
          >
            Core width: why the same percentage means different things on different cores
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The number of slots per cycle is called the core&apos;s width. It is the <M>S</M> in the formulas, so
            every share on a card is a share of that particular core&apos;s width. Width differs between vendors and
            between generations. Each vendor publishes it in machine-readable metric files, the same files that
            define the formulas. Intel publishes a metrics file, Arm publishes one file per core in its Telemetry
            Solution repository, and AMD&apos;s pipeline files are part of Linux perf. To get the width of your core,
            look it up in that core&apos;s file.{' '}
            <Cite id="F08-8">Intel TMA metrics file</Cite>{' '}
            <Cite id="F08-13">Arm Telemetry Solution release notes, 2026.09</Cite>{' '}
            <Cite id="F08-11">Linux v7.3, amdzen4 pipeline.json</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 620 }}>
              <thead>
                <tr>
                  <th style={TH}>Vendor</th>
                  <th style={TH}>Slots per cycle, by core</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Intel</td>
                  <td style={TD}>
                    4 from Sandy Bridge, 5 from Ice Lake, 6 from Alder Lake and Sapphire Rapids, 8 from Lunar Lake
                    and Arrow Lake
                  </td>
                  <td style={TD}>
                    <Cite id="F08-8">Intel TMA metrics file, row Pipeline_Width</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>AMD</td>
                  <td style={TD}>6 on Zen 4 and 8 on Zen 5. The Zen 6 file also gives 8.</td>
                  <td style={TD}>
                    <Cite id="F08-11">Linux v7.3, amdzen4 pipeline.json</Cite>{' '}
                    <Cite id="F08-12">Linux v7.3, amdzen5 and amdzen6 pipeline.json</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Arm</td>
                  <td style={TD}>
                    5 on Neoverse N1, 8 on Neoverse V1, 8 on Neoverse V2, 10 on Neoverse V3, 10 on Cortex-X925, 5 on
                    Cortex-A725
                  </td>
                  <td style={TD}>
                    <Cite id="F08-16">Arm Telemetry Solution, num_slots in each core file</Cite>{' '}
                    <Cite id="F08-13">Arm Telemetry Solution release notes, 2026.09</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            <strong>Width changes what a percentage means.</strong> On the MuJoCo humanoid step, the Spark&apos;s
            Cortex-A725 retired 61.0% of its 5 slots, and the Cortex-X925 retired 45.7% of its 10 slots. Even so, the
            X925 ran 57,240 steps per second and the A725 ran 28,662. Measured in retired slots per cycle, the X925
            does <Derived>0.457 x 10 = 4.57</Derived> and the A725 does <Derived>0.610 x 5 = 3.05</Derived>. So the
            wider core does more work per cycle, even though its share is lower. Compare shares only between cores of
            the same width, and compare throughput between any two cores.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>
          </Box>
          <Box variant="p">
            Retired slots per cycle still do not explain the whole difference. They differ by a factor of{' '}
            <Derived>4.57 / 3.05 = 1.5</Derived>, but steps per second differ by a factor of{' '}
            <Derived>57,240 / 28,662 = 2.0</Derived>. The remaining factor, about{' '}
            <Derived>2.0 / 1.5 = 1.33</Derived>, comes from two things that a per-cycle share leaves out. One is each
            core&apos;s clock frequency, which the cards do not record. The other is the number of micro-operations
            each core needs per step. To separate the two, record the run&apos;s duration and step count together
            with its cycle and micro-operation counts.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>
          </Box>
          <Box variant="p">
            On EC2, the Neoverse cores in the table are found in the Graviton processors: Graviton3 uses the Neoverse
            V1, Graviton4 the Neoverse V2 and Graviton5 the Neoverse V3. A Graviton5 core and the Spark&apos;s X925
            have the largest width in the table, 10 slots per cycle, and Arm gives both cores the same formula. So you can read a card
            from either chip with the same arithmetic.{' '}
            <Cite id="F08-56">AWS Graviton guide, README processor table</Cite>{' '}
            <Cite id="F08-19">Arm Telemetry Solution, neoverse_v3 and cortex_x925 metrics</Cite>
          </Box>
          <Box variant="p">
            Take the width of an Intel core from Intel&apos;s metrics file, not from Intel&apos;s VTune cookbook. The
            cookbook still gives four slots per cycle, which is the width of the oldest cores in the metrics file, so
            a width taken from the cookbook is wrong for every Intel core from Ice Lake onward.{' '}
            <Cite id="F08-2">Intel VTune cookbook 2025.4, the current edition, Top-down Microarchitecture Analysis Method</Cite>{' '}
            <Cite id="F08-8">Intel TMA metrics file, row Pipeline_Width</Cite>
          </Box>
          <ExpandableSection headerText="Two cores where the slot formula does not work as shipped: the Neoverse N1 and the Jetson's Cortex-A78AE">
            <Box variant="p">
              The Neoverse N1 is the core of Graviton2. Arm&apos;s file gives it a width of 5, but the core has no
              slot-stall events, so the slot formula cannot run on it. For that core, Arm&apos;s method counts stalled
              cycles instead. The Cortex-A78AE in the Jetson Orin Nano Super has no Arm file, and its Linux kernel
              reports a width of 0. You can recover the width from the events, because in every cycle each slot
              either stalls or carries one dispatched micro-operation. The width is therefore{' '}
              <code>(STALL_SLOT + OP_SPEC) / CPU_CYCLES</code>. On the Spark&apos;s two cores, this came out at 10.000
              and 5.000, the same values as in Arm&apos;s files. On the A78AE it came out at 6.000, and there is no Arm
              file to check that value against.{' '}
              <Cite id="F08-56">AWS Graviton guide, README processor table</Cite>{' '}
              <Cite id="F08-16">Arm Telemetry Solution, cortex folder listing</Cite>{' '}
              <Cite id="F08-15">Arm Cortex-X925 specification file, STALL_SLOT and OP_SPEC</Cite>{' '}
              <Cite id="F08-68">our profiling report, slots per cycle</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The generic Arm formula counts the cycles lost after a wrong branch guess as front-end bound. Before you compare the front-end share of two cards, check whether each one was corrected for this, because an uncorrected card shows front-end bound too high and bad speculation too low."
          >
            The flush correction: how the generic Arm formula counts recovery time
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            After a flush, the front end has nothing to pass to the back end for a few cycles while it fetches
            instructions again from the right place. A mispredicted branch is the usual cause of a flush, but
            exceptions and other machine flushes count as well. During those cycles the slots are empty because the
            front end is not ready, so the generic formula counts them as front-end bound, even though the wrong
            guess caused them. Intel&apos;s definition of bad speculation includes these slots. Arm&apos;s per-core
            method moves them into bad speculation: it subtracts the recovery time from front-end bound and adds it
            to bad speculation.{' '}
            <Cite id="F08-7">Intel TMA metrics file, row Bad_Speculation</Cite>{' '}
            <Cite id="F08-19">Arm Telemetry Solution, STALL_FRONTEND_FLUSH</Cite>
          </Box>
          <Box variant="p">
            To make this correction, Arm&apos;s formula uses a value <M>c</M>, the recovery time as a share of all
            cycles. The formula subtracts <M>c</M> directly from a share of slots. In doing so, it treats every slot
            of a recovery cycle as an empty front-end slot. Because every cycle has the same <M>S</M> slots, a share
            of cycles is then also a share of slots. The Neoverse V3, Cortex-X925 and Cortex-A725 measure the
            recovery time with an event of their own, <code>STALL_FRONTEND_FLUSH</code>, which counts the cycles the
            front end spent recovering from a flush. With <M>{String.raw`\mathrm{slots}`}</M>,{' '}
            <M>{String.raw`\mathrm{filled}`}</M> and <M>{String.raw`\mathrm{kept}`}</M> defined as before, the
            corrected formula is:{' '}
            <Cite id="F08-19">Arm Telemetry Solution, cortex_x925 metrics</Cite>
          </Box>
          <Formula
            name="Arm's flush correction, measured form"
            tex={String.raw`\begin{aligned} &c = \frac{\texttt{STALL\_FRONTEND\_FLUSH}}{\texttt{CPU\_CYCLES}} \\[6pt] &\text{front-end bound} = \\ &\qquad \frac{\texttt{STALL\_SLOT\_FRONTEND}}{\mathrm{slots}} - c \\[6pt] &\text{bad speculation} = \\ &\qquad \mathrm{filled} \times (1 - \mathrm{kept}) + c \end{aligned}`}
            source={<Cite id="F08-19">Arm Telemetry Solution, cortex_x925 metrics</Cite>}
          />
          <Box variant="p">
            The term <M>c</M> is taken out of front-end bound and added to bad speculation, so the four shares still
            add up to 100%. Back-end bound and retiring keep the formulas of the generic form. On these three cores
            and on the Neoverse V1, a card computed without <M>c</M> shows front-end bound too high and bad
            speculation too low, each by <M>c</M>. The Neoverse V2 takes the correction partly from the front end and
            partly from the back end, as the panel below explains.{' '}
            <Cite id="F08-22">our comparison of the run script with Arm&apos;s formulas</Cite>
          </Box>
          <Box variant="p">
            On code with many branches, the error can be large enough to change which of the two losses looks larger.
            Our branch microbenchmark is a small program that mispredicts branches far more often per cycle than the
            physics step does. Under the generic formula, it shows <Derived>37.65%</Derived> front-end bound and{' '}
            <Derived>11.91%</Derived> bad speculation. Our run did not count <code>STALL_FRONTEND_FLUSH</code>, so{' '}
            <M>c</M> has to be estimated. For the estimate, we borrowed the constant that Arm uses for the Neoverse
            V1, 4 recovery cycles per mispredicted branch, and took the number of mispredicted branches from a second
            execution of the program. That gives{' '}
            <Derived>256,608,053 x 4 / 7,794,987,434 = 13.17</Derived> percentage points. Moving those points across
            leaves front-end bound at about 24.5% and raises bad speculation to about 25.1%, which makes bad
            speculation the larger of the two.{' '}
            <Cite id="F08-23">our estimate of the missing correction</Cite>{' '}
            <Cite id="F08-60">our run script, two executions per program</Cite>
          </Box>
          <Box variant="p">
            The borrowed constant only estimates the size of the error, and it does not correct the card. To correct
            the card, count{' '}
            <code>STALL_FRONTEND_FLUSH</code> so that Arm&apos;s own formula can apply the correction. Which formula
            a tool applies depends on whether the tool knows the core. Linux v7.3 (October 2026) includes Arm&apos;s
            corrected files for the Neoverse cores but none for the Cortex-X925 or Cortex-A725. So we expect{' '}
            <code>perf stat --topdown</code> at that version to print the generic split on a DGX Spark, although we
            did not test this. As a result, on Arm alone the label &quot;front-end bound&quot; can mean at least
            three different formulas. Write the formula and the tool version on every card, and compare two cards on
            front-end bound only when both match.{' '}
            <Cite id="F08-19">Arm Telemetry Solution, cortex_x925 metrics</Cite>{' '}
            <Cite id="F08-9">Linux v7.3, perf-stat documentation, --topdown</Cite>{' '}
            <Cite id="F08-21">Linux v7.3 perf directories</Cite>
          </Box>
          <ExpandableSection headerText="How Arm obtains the recovery time on each core, and the estimate for the physics step">
            <SpaceBetween size="s">
              <Box variant="p">
                Arm obtains <M>c</M> in a different way on each core:{' '}
                <Cite id="F08-19">Arm Telemetry Solution, STALL_FRONTEND_FLUSH</Cite>
              </Box>
              <ul style={LIST}>
                <li>
                  <strong>Neoverse V1 (Graviton3).</strong> Arm uses a fixed 4 cycles per mispredicted branch, so{' '}
                  <M>c</M> is 4 cycles times the number of mispredicted branches, divided by the cycle count. A card
                  computed without the correction is off by <M>c</M>, in the same direction as on the cores that
                  measure the recovery time.{' '}
                  <Cite id="F08-17">Arm Telemetry Solution, neoverse_v1 metrics</Cite>{' '}
                  <Cite id="F08-22">our comparison of the run script with Arm&apos;s formulas</Cite>
                </li>
                <li>
                  <strong>Neoverse V2 (Graviton4).</strong> Arm uses the same 4 cycles per mispredicted branch, but
                  takes 1 cycle from front-end bound and 3 cycles from back-end bound, so on Graviton4 the back end is
                  corrected as well. It follows from Arm&apos;s formula that a V2 card computed without the correction
                  overstates front-end bound by the number of mispredicted branches times 1 cycle, and back-end bound
                  by the number of mispredicted branches times 3 cycles, each divided by the cycle count.{' '}
                  <Cite id="F08-18">Arm Telemetry Solution, neoverse_v2 metrics</Cite>
                </li>
                <li>
                  <strong>Neoverse V3 (Graviton5), Cortex-X925 and Cortex-A725.</strong> These cores measure the
                  recovery time with the event <code>STALL_FRONTEND_FLUSH</code>, and Arm uses the measured form of
                  the correction shown above.{' '}
                  <Cite id="F08-19">Arm Telemetry Solution, cortex_x925 metrics</Cite>
                </li>
              </ul>
              <Box variant="p">
                For the physics step, the correction is much smaller than for the branch microbenchmark. Its card also
                lacks <code>STALL_FRONTEND_FLUSH</code>. The same borrowed constant, again with the mispredicted
                branches counted in the second execution, gives{' '}
                <Derived>79,584,976 x 4 / 19,922,115,591 = 1.6</Derived> percentage points. Front-end bound drops from
                12.2% to about 10.6%, and bad speculation rises from 5.6% to about 7.2%. The back end remains the
                largest loss either way.{' '}
                <Cite id="F08-23">our estimate of the missing correction</Cite>{' '}
                <Cite id="F08-60">our run script, two executions per program</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You read a card by answering four questions in order, and each question protects you from one common misreading. On the sample card for the physics step, the answers point to a faster core rather than faster memory, and a level-2 count is the measurement that would confirm it."
          >
            Reading a PMU card: the physics step on a Cortex-X925 core
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The sample card records the CPU physics workload from section 12, Physics Simulation, on one Cortex-X925
            core of a DGX Spark. The model is a MuJoCo humanoid, used as a stand-in for the SO-101 robot arm; we did
            not measure the arm&apos;s own scene.{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Figure
            cites="F08-61 F08-68 F08-73 F08-20 F08-22"
            caption={
              <>
                Read the card from the top. Band 1 says what ran, on which machine and how it was counted. Band 2
                gives the throughput, band 3 shows where the slots went, and band 4 shows what lies behind the largest
                loss. This is our measurement from a single run: one Cortex-X925 core of a DGX Spark running a
                humanoid model in MuJoCo 4.0.1.
              </>
            }
          >
            <SampleCard />
          </Figure>
          <ol style={LIST}>
            <li>
              <SpaceBetween size="xs">
                <Box variant="p">
                  <strong>What ran, on which machine, and how was it counted?</strong> You can compare two cards only
                  when the unit of work, the core, the software version, the number of runs and the formula all match,
                  so check these first. This card is one run of MuJoCo 4.0.1 on one X925 core, computed with the
                  generic Arm formula. Because the run did not count the flush recovery, the card&apos;s front-end
                  share is too high and its bad-speculation share too low by that amount.{' '}
                  <Cite id="F08-22">our comparison of the run script with Arm&apos;s formulas</Cite>
                </Box>
                <Box variant="p">
                  The card&apos;s six slot events and its eight detail events were counted in two separate executions
                  of the program. The detail events are retired instructions, cycles, back-end memory stalls,
                  mispredicted branches, and refills and misses in the caches. The likely reason for the split is to
                  avoid multiplexing. Multiplexing happens when perf cannot count every requested event at the same
                  time: perf lets the events take turns and scales each count up to the whole run. A ratio of two
                  events that were not counted at the same time, such as instructions per cycle, can then lose
                  accuracy. The split has a cost: the card&apos;s memory-stall and instructions-per-cycle figures
                  come from the second execution, so a ratio that mixes them with the slot shares compares two
                  different runs.{' '}
                  <Cite id="F08-60">our run script, two executions per program</Cite>{' '}
                  <Cite id="F08-87">Linux v7.3, perf-stat documentation, multiplexing and scaling</Cite>
                </Box>
              </SpaceBetween>
            </li>
            <li>
              <strong>How much work does it do per second?</strong> Throughput in the workload&apos;s own unit is the
              figure to compare across machines. Here it is 57,240 physics steps per second. A share is a fraction of
              one core&apos;s slots, so it is never a speed. Section 23, Price-Performance and Latency, turns a rate
              like this into work per unit of price and work per watt, and holds the time per unit of work against a
              deadline.{' '}
              <Cite id="F08-61">our profiling report, physics step table</Cite>
            </li>
            <li>
              <strong>Where did the slots go?</strong> Read retiring first, then the largest of the other three
              buckets. Here <Derived>0.457 x 10 = 4.57</Derived> of the 10 slots per cycle carry micro-operations
              that retire, and the back end causes the largest loss. The card&apos;s 4.37 instructions per cycle is a
              different count: it counts instructions rather than micro-operations, and it comes from the second
              execution.{' '}
              <Cite id="F08-61">our profiling report, physics step table</Cite>
            </li>
            <li>
              <SpaceBetween size="xs">
                <Box variant="p">
                  <strong>What is behind the largest loss?</strong> For a back-end loss, the question is whether the
                  core waits on memory or on its execution units. The answer decides what you buy: faster memory if it
                  waits on main memory, a faster core if it waits on the execution units. This question keeps you from
                  putting a core-bound job on a machine you chose for its memory bandwidth.{' '}
                  <Cite id="F08-6">Intel TMA metrics file, rows Memory_Bound and Core_Bound</Cite>{' '}
                  <Cite id="F08-41">Intel TMA metrics file, rows MEM_Bandwidth and MEM_Latency</Cite>
                </Box>
                <Box variant="p">
                  This card&apos;s own counters place the loss in the back end and go no further, because the run
                  counted level 1 only. Its one memory figure comes from the event <code>stall_backend_mem</code>,
                  which counted back-end memory stalls in 0.4% of cycles. The two executions ran almost the same
                  number of cycles (<Derived>19,922,115,591 and 19,958,256,358</Derived>). So even if every cycle
                  with a memory stall lost all 10 of its slots, those cycles would account for only{' '}
                  <Derived>0.4</Derived> of the 36.5 percentage points of back-end bound. Whole-cycle memory stalls
                  are therefore too few to explain the loss. This event does not count memory waits in cycles that still used some of their slots, so
                  those waits remain an open question.{' '}
                  <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
                  <Cite id="F08-60">our run script, the eight detail events</Cite>{' '}
                  <Cite id="F08-23">our estimate of the missing correction, cycles of the detail run</Cite>{' '}
                  <Cite id="F08-70">our recomputation, cycles of the slot run</Cite>{' '}
                  <Cite id="F08-29">AWS Graviton guide, Top-down method to debug hardware performance</Cite>
                </Box>
                <Box variant="p">
                  To decide between the core and main memory, compare two cores of the same chip. The X925 stepped
                  the model twice as fast as the Spark&apos;s Cortex-A725, while main memory serves either core at
                  about the same rate. A memory test that streams through more memory than the caches can hold moved
                  44.38 GB/s through one X925 core and 43.95 GB/s through one A725 core. The chain of dependent loads
                  from the known-answer test waited 123.96 ns per load on the X925 and 144.92 ns on the A725, only{' '}
                  <Derived>144.92 / 123.96 = 1.17</Derived> times longer. Main memory therefore cannot explain a
                  factor of two between the two cores.{' '}
                  <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
                  <Cite id="F08-66">our profiling report, triad DRAM rows</Cite>{' '}
                  <Cite id="F08-67">our profiling report, latency rows</Cite>
                </Box>
                <Box variant="p">
                  So the comparison points to the core. The level-1 counters agree with that conclusion, but they
                  cannot prove it on their own. The card therefore supports buying a faster core. It is still open
                  whether a wider core, one with more slots per cycle, would also help. Core bound covers both busy
                  execution units and operations that wait on each other&apos;s results, and a level-1 count cannot
                  see either.{' '}
                  <Cite id="F08-6">Intel TMA metrics file, rows Memory_Bound and Core_Bound</Cite>
                </Box>
                <Box variant="p">
                  A second open question is whether the loss comes from the execution units or from the
                  core&apos;s caches. A refill is a cache miss that fetches a line from a cache or memory further from
                  the core. On this step, the A725
                  refilled its L2 data cache 0.38 times per thousand instructions and the X925 0.12 times, so part of
                  the difference may come from the X925&apos;s caches. A level-2 count would narrow this down.
                  Arm&apos;s level-2 metrics for the X925, A725 and Neoverse V3 split back-end stalls into core bound
                  and memory bound, with data-cache stalls on the memory side, but this run counted level 1 only.{' '}
                  <Cite id="F08-61">our profiling report, physics step table, refill columns</Cite>{' '}
                  <Cite id="F08-24">Arm Telemetry Solution, cortex_x925 level-2 metrics</Cite>{' '}
                  <Cite id="F08-73">limits of our measurements, level 1 only</Cite>
                </Box>
              </SpaceBetween>
            </li>
          </ol>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="On EC2, the instance size determines which PMU events you can read. Plan a profiling run on a size that exposes every event, and count a card's six slot events with one perf command."
          >
            Reading the counters on EC2: which instance sizes expose them
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A counter is useful only if the instance lets you read it, and on EC2 that depends on the instance size.
            Sizes that occupy a whole dedicated processor socket get every PMU event. Smaller sizes of newer
            generations get a reduced set of events, and smaller sizes of older generations may get none. The AWS page
            does not list which events the reduced set contains. So plan a top-down run on a size with full support,
            on Graviton and on x86 alike. In the table, a pattern such as <code>*9g</code> stands for every instance
            family of that generation, here C9g, M9g and R9g.{' '}
            <Cite id="F08-25">AWS Graviton guide, How to Collect PMU counters</Cite>{' '}
            <Cite id="F08-26">AWS Graviton guide, PMU support table</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 520 }}>
              <thead>
                <tr>
                  <th style={TH}>Instance families</th>
                  <th style={TH}>Sizes with full PMU support</th>
                  <th style={TH}>Basic support at smaller sizes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>
                    <code>*9g</code> (Graviton5)
                  </td>
                  <td style={TD}>12xlarge, 24xlarge, 48xlarge</td>
                  <td style={TD}>yes</td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>*8g</code> (Graviton4)
                  </td>
                  <td style={TD}>24xlarge, 48xlarge</td>
                  <td style={TD}>yes</td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>*7g</code>, <code>*6g</code>
                  </td>
                  <td style={TD}>16xlarge</td>
                  <td style={TD}>yes</td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>*8i</code>
                  </td>
                  <td style={TD}>48xlarge</td>
                  <td style={TD}>yes</td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>*7i</code>, <code>*8a</code>, <code>*7a</code>, <code>*6a</code>
                  </td>
                  <td style={TD}>24xlarge, 48xlarge</td>
                  <td style={TD}>
                    yes, except <code>*6a</code>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>*6i</code>
                  </td>
                  <td style={TD}>16xlarge, 32xlarge</td>
                  <td style={TD}>no</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="small" color="text-body-secondary">
            <Cite id="F08-26">AWS Graviton guide, PMU support table</Cite>
          </Box>
          <Box variant="p">
            Where the slot events are missing, the top-down method in the same AWS guide falls back to instructions
            per cycle and to stalled cycles per thousand cycles. Stalled cycles are a whole-cycle count, so their
            figures do not line up with the shares on a slot-based card.{' '}
            <Cite id="F08-29">AWS Graviton guide, Top-down method to debug hardware performance</Cite>
          </Box>
          <Box variant="p">
            A metal instance has no virtual machine layer between your operating system and the hardware. It exposes
            every hardware PMU that its operating system has drivers for. On Graviton, that adds two PMUs that
            virtualised sizes do not get. The first is Arm&apos;s Statistical Profiling Extension, which samples
            individual instructions. The second is the set of counters in the mesh interconnect, which measure the
            memory bandwidth of the whole machine. So on Graviton, measuring whole-machine memory bandwidth with these
            counters needs a metal size. AWS&apos;s guide also limits the mesh counters to &quot;certain OSes and
            kernels&quot;, so confirm that they appear in the instance&apos;s event list before you plan a bandwidth
            measurement on them.{' '}
            <Cite id="F08-27">AWS Graviton guide, Additional PMUs and PMU events</Cite>
          </Box>
          <Box variant="p">
            Few GPU instance families offer a metal size. In the EC2 accelerated computing table, the column &quot;Metal
            instances available&quot; says yes only for G4dn and G5g. On any other GPU instance, a CPU card therefore
            comes from a virtual machine, with the event set that its size allows and without the metal-only
            counters. The Graviton guide&apos;s PMU table does not name any G or P family either. So before you plan a
            CPU card on a GPU instance, read the event list on that instance size itself.{' '}
            <Cite id="F08-28">EC2 accelerated computing specifications, instance family summary</Cite>{' '}
            <Cite id="F08-26">AWS Graviton guide, PMU support table</Cite>
          </Box>
          <Box variant="p">
            To profile your own workload, run it under <code>perf stat</code>, pinned to one core, on a machine that
            exposes the slot events. On EC2, that means a size with full PMU support. Count the six slot events in one
            execution, as in this command:{' '}
            <Cite id="F08-60">our run script, the six top-down events</Cite>
          </Box>
          <Snippet
            title="Count the six slot events of one program on one core"
            mode="adapted"
            source={
              <>
                <Cite id="F08-60">our run script, run.sh</Cite>{' '}
                <Cite id="F08-68">our DGX Spark card, the PMU name of each core type</Cite>
              </>
            }
            ours={<>the variable names and the program path.</>}
          >
            {PERF_SNIPPET}
          </Snippet>
          <Box variant="p">
            The <code>-x,</code> option selects CSV output. One of its fields is the percentage of the measurement
            time during which each counter was running. A counter below 100% was multiplexed, and perf scaled its
            count. If you see one, move some events into a separate execution until every counter runs for the whole
            time.{' '}
            <Cite id="F08-87">Linux v7.3, perf-stat documentation, output fields and --no-scale</Cite>
          </Box>
          <Box variant="p">
            To make the card&apos;s front-end share include Arm&apos;s own correction, also count{' '}
            <code>STALL_FRONTEND_FLUSH</code> if the core&apos;s file defines it. To decide between memory and core
            from Arm&apos;s level-2 split of back-end stalls, rather than from a single memory event, count the
            level-2 events in the same way. Finally, run the program more than once and record the spread of the
            results. A single run has no spread, so it cannot show whether a small difference between two cards is
            larger than the noise.{' '}
            <Cite id="F08-19">Arm Telemetry Solution, cortex_x925 metrics</Cite>{' '}
            <Cite id="F08-24">Arm Telemetry Solution, cortex_x925 level-2 metrics</Cite>{' '}
            <Cite id="F08-73">limits of our measurements, single run, no variance</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Each NVIDIA tool answers a different question about a GPU job, so you choose the tool by the question you need answered. The utilisation figure of nvidia-smi measures time rather than work, and a kernel we measured shows that a busy GPU does not tell you whether the job used its tensor cores."
          >
            Reading GPU counters: nvidia-smi, DCGM and Nsight
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The four shares show a job&apos;s bottleneck only when the job is limited by the CPU thread that was
            measured. For a training job that waits on its GPU, the CPU split says nothing about the GPU. So start
            with a timeline when you profile a GPU job. Nsight Systems, NVIDIA&apos;s whole-application profiler, puts
            CPU samples, GPU calls and GPU work on one time axis, so you can see which side waits for the other.
            Using the timeline to see which side waits is our own inference from what the tool records, as is the
            point in the table below that Nsight Compute cannot show whether the GPU waits on the CPU.{' '}
            <Cite id="F08-9">Linux v7.3, perf-stat documentation, --topdown</Cite>{' '}
            <Cite id="F08-39">Nsight Systems 2026.6 release notes</Cite>
          </Box>
          <Box variant="p">
            A GPU kernel, such as a matrix multiply, runs on the GPU&apos;s SMs (streaming multiprocessors). An SM is
            the GPU&apos;s basic processing unit, and the chip contains many of them. Tensor cores are units inside
            each SM, with a pipeline of their own for matrix multiply-accumulate instructions. This is the arithmetic
            that training and inference are built on.{' '}
            <Cite id="F08-36">Nsight Compute Profiling Guide, Streaming Multiprocessor</Cite>{' '}
            <Cite id="F08-42">NVIDIA Tensor Cores page; Nsight Compute pipeline glossary</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={TH}>Tool</th>
                  <th style={TH}>What it looks at</th>
                  <th style={TH}>The question it answers</th>
                  <th style={TH}>What it cannot tell you</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>
                    <code>nvidia-smi</code>
                  </td>
                  <td style={TD}>The whole GPU, over a sample period of 1/6 s to 1 s</td>
                  <td style={TD}>Was any kernel running? Were the video encoder and decoder in use?</td>
                  <td style={TD}>How much of the GPU the kernel used</td>
                  <td style={TD}>
                    <Cite id="F08-30">nvidia-smi documentation, Utilization</Cite>{' '}
                    <Cite id="F08-31">nvidia-smi documentation, Encoder and Decoder</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    DCGM (Data Center GPU Manager), NVIDIA&apos;s fleet monitoring service
                  </td>
                  <td style={TD}>The whole GPU, unit by unit, sampled across a fleet once a second by default</td>
                  <td style={TD}>
                    Were the SMs active? Was the tensor pipeline busy? Was data moving to and from memory?
                  </td>
                  <td style={TD}>Whether the active SMs were computing, because threads waiting on memory count as active</td>
                  <td style={TD}>
                    <Cite id="F08-32">DCGM User Guide, profiling metrics; newest tag v4.7.0</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Nsight Compute</td>
                  <td style={TD}>One kernel, replayed to collect more metrics</td>
                  <td style={TD}>
                    Which limit holds this kernel back, compute or memory bandwidth, and which pipeline inside the SM
                    is busy?
                  </td>
                  <td style={TD}>Whether the GPU is waiting on the CPU</td>
                  <td style={TD}>
                    <Cite id="F08-33">Nsight Compute 2026.4.0 Profiling Guide and release notes</Cite>{' '}
                    <Cite id="F08-34">Nsight Compute Profiling Guide, table of sections</Cite>{' '}
                    <Cite id="F08-39">Nsight Systems release notes</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            DCGM reports activity separately for each kind of unit. Three of its metrics matter here:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>SM activity</strong> is the fraction of time during which at least one group of threads was
              active on an SM, averaged over all SMs. Threads waiting on memory count as active. That is why NVIDIA
              calls a value of 0.8 or more &quot;necessary, but not sufficient&quot; for effective use, and says that a
              value under 0.5 &quot;likely indicates ineffective GPU usage&quot;.{' '}
              <Cite id="F08-32">DCGM User Guide, Device Level GPU Metrics</Cite>
            </li>
            <li>
              <strong>Tensor activity</strong> is the fraction of cycles during which the tensor pipeline was busy. It
              is the direct sign that a job uses its tensor cores.{' '}
              <Cite id="F08-32">DCGM User Guide, Device Level GPU Metrics</Cite>
            </li>
            <li>
              <strong>Memory activity</strong> is the fraction of cycles during which data moved to or from the
              GPU&apos;s memory.{' '}
              <Cite id="F08-32">DCGM User Guide, Device Level GPU Metrics</Cite>
            </li>
          </ul>
          <Box variant="p">
            To see the difference between the two tools, take an illustrative GPU with <Toy>100</Toy> SMs that runs
            one small kernel back to back, and suppose the kernel keeps <Toy>5</Toy> of the SMs busy. nvidia-smi
            reports the &quot;percent of time over the past sample period during which one or more kernels was
            executing on the GPU&quot;. A kernel is always running, so nvidia-smi reads <Toy>100%</Toy>. In DCGM, five
            SMs active all the time and the other <Toy>95</Toy> never active, averaged over all <Toy>100</Toy>, give
            an SM activity of <Toy>5 / 100 = 0.05</Toy>. That is a tenth of the 0.5 below which NVIDIA says usage is
            likely ineffective. Both readings are correct. One counts time and the other counts the share of the chip
            that was working, so only the second shows that most of the GPU sat idle.{' '}
            <Cite id="F08-30">nvidia-smi documentation, Utilization</Cite>{' '}
            <Cite id="F08-32">DCGM User Guide, Device Level GPU Metrics</Cite>
          </Box>
          <ExpandableSection headerText="The Jetson's tegrastats monitor, shared engines and RT cores">
            <SpaceBetween size="s">
              <Box variant="p">
                On a Jetson, the tegrastats monitor prints a time-based figure of the same kind as nvidia-smi:
                &quot;Proportion of GPU activation time in a period&quot;. It also prints the memory bandwidth in use
                at the memory controller. That reading shows when the CPU and the GPU compete for the single memory
                they share.{' '}
                <Cite id="F08-40">Jetson Linux r39.2.2, Tegrastats Utility</Cite>
              </Box>
              <Box variant="p">
                Other engines can distort the memory figures. The video decoder and the GPU&apos;s other engines share
                the GPU&apos;s L2 cache and memory with the SMs, so a small kernel under the profiler can show memory
                traffic that is not its own.{' '}
                <Cite id="F08-38">Nsight Compute Profiling Guide, shared resources</Cite>
              </Box>
              <Box variant="p">
                RT (ray-tracing) cores are the units that find what each camera ray hits when a simulator renders an
                image. We found no counter for them in the documentation of these tools. Nsight Compute&apos;s guide
                lists &quot;RT Cores, if available&quot; among the units of an SM, but gives them no metric. So a card
                for a rendering workload records its frame rate and leaves the ray-tracing row empty.{' '}
                <Cite id="F08-36">Nsight Compute Profiling Guide, Streaming Multiprocessor unit list</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            Nsight Compute profiles one kernel at a time. It replays the kernel to collect more metrics than one pass
            can hold, so a full profile takes extra run time. On a Jetson, Nsight Compute must run as root, and our run
            on the DGX Spark needed root as well.{' '}
            <Cite id="F08-33">Nsight Compute Profiling Guide, Sets and Sections</Cite>{' '}
            <Cite id="F08-37">Nsight Compute Profiling Guide, ERR_NVGPUCTRPERM</Cite>{' '}
            <Cite id="F08-71">our Nsight Compute pass on the Spark, run as root</Cite>
          </Box>
          <Box variant="p">
            Nsight Compute&apos;s roofline chart plots the kernel&apos;s achieved speed against its arithmetic per
            byte of memory moved. The sloped part of the roof is the memory bandwidth limit, and the flat part is the
            peak compute limit. Where the kernel sits under the roof tells you which of the two limits holds it back.
            This is the GPU&apos;s version of memory bound against core bound. The{' '}
            <Link href="../silicon-memory-inference/">Silicon, Memory &amp; Inference dive</Link> builds the roofline
            in full.{' '}
            <Cite id="F08-35">Nsight Compute Profiling Guide, Roofline Charts</Cite>
          </Box>
          <Box variant="p">
            We profiled one kernel on the DGX Spark&apos;s GPU to show what a per-kernel profile adds. A 4096 x 4096
            float32 matrix multiply in PyTorch ran as one kernel in 8.35 ms. Nsight Compute&apos;s SpeedOfLight
            section put its compute (SM) throughput at 70.49% and its memory throughput at 50.47%. Each of these
            figures is the highest of the percentages reported by the counters behind it. So each figure says how
            close the busiest of those counters came to its limit, and it need not be a share of the chip&apos;s peak
            arithmetic rate or of its memory bandwidth. Here the compute side came closer to its limit than the memory
            side, so the next question is which compute path did the work.{' '}
            <Cite id="F08-71">our Nsight Compute pass on the Spark</Cite>{' '}
            <Cite id="F08-34">Nsight Compute Profiling Guide, SpeedOfLight</Cite>
          </Box>
          <Box variant="p">
            The kernel&apos;s name is <code>cutlass_80_simt_sgemm_128x128_8x4_nn_align1</code>. In CUTLASS kernel
            names, we read <code>simt</code> (single instruction, multiple threads) as the mark of the general
            floating-point path on the ordinary CUDA cores, rather than the tensor cores. On that reading, the float32
            multiply did not go through the tensor pipeline, so this busy kernel tells you nothing about the tensor
            cores. To see the tensor pipeline, read DCGM&apos;s tensor activity across a fleet, or Nsight
            Compute&apos;s per-pipeline figures for one kernel.{' '}
            <Cite id="F08-71">our Nsight Compute pass on the Spark</Cite>{' '}
            <Cite id="F08-32">DCGM User Guide, Tensor Activity</Cite>{' '}
            <Cite id="F08-34">Nsight Compute Profiling Guide, ComputeWorkloadAnalysis</Cite>
          </Box>
          <Box variant="p">
            One PyTorch setting, <code>torch.set_float32_matmul_precision</code>, decides whether PyTorch may compute
            a float32 matrix multiply in a narrower format. The default value, <code>&quot;highest&quot;</code>,
            computes in float32. The value <code>&quot;high&quot;</code> allows TensorFloat32 when a fast kernel for
            it is available. TensorFloat32 is a format that stores 10 mantissa bits, the bits that hold a
            number&apos;s significant digits, where float32 stores 23. The output is float32 with either setting, so
            the type of the result does not show which path ran. We did not record the PyTorch version or this
            setting in our run. Record the setting on the card next to the kernel name. After you change it, read the
            kernel name again: a name that still contains <code>simt</code> still ran on the general path.{' '}
            <Cite id="F08-88">PyTorch v2.15.0, set_float32_matmul_precision docstring</Cite>{' '}
            <Cite id="F08-71">our Nsight Compute pass on the Spark</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
