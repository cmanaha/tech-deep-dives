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

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/* ------------------------------------------------------------------------ */
/* Diagram 21.1: where slots go (animated)                                  */
/* ------------------------------------------------------------------------ */

const SLOT_CAPTIONS = [
  <>
    The pipeline: the front end fetches and decodes, the back end executes, retirement makes results final. Between
    the front end and the back end sit a fixed number of slots per cycle, 4 on this illustrative core.
  </>,
  <>
    Retiring. The front end hands a micro-operation to the slot, the back end executes it, and it retires: the slot
    did work the program kept.
  </>,
  <>
    Bad speculation. The slot receives a micro-operation, but it follows a branch the core guessed wrong, so it is
    thrown away and never retires.
  </>,
  <>
    Front-end bound. The back end could take a micro-operation, but the front end has none ready, and the slot stays
    empty.
  </>,
  <>
    Back-end bound. The front end has a micro-operation ready, but the back end cannot accept it, and the slot stays
    empty.
  </>,
  <>
    Every slot of the run lands in one bucket. The <Toy>400</Toy> slots of the example split{' '}
    <Toy>54%</Toy> retiring, <Toy>6%</Toy> bad speculation, <Toy>15%</Toy> front-end bound and <Toy>25%</Toy>{' '}
    back-end bound.
  </>,
];

const SLOT_STATUS = [
  'Each cycle offers 4 slots to the back end',
  'Slot filled, and the micro-operation retires',
  'Slot filled, but the work is thrown away',
  'Slot empty: the front end had nothing ready',
  'Slot empty: the back end could not accept',
  'Every slot of the run lands in one bucket',
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
        <title id="pmu-cards-slots-title">Where a pipeline slot goes: two questions, four buckets</title>
        <desc>
          A core drawn as front end, slots, back end and retirement. A decision tree below asks whether a
          micro-operation was delivered to the slot and whether it retired, and ends in four buckets: retiring, bad
          speculation, front-end bound and back-end bound.
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
          A card in four numbered bands. What ran, on which machine, and how the counters were read; throughput; the
          four top-down shares as a stacked bar with a legend; the memory stall share and instructions per cycle.
          Markers 1 to 4 tie each band to one of the four reading questions.
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
          Where the slots went, of 10 per cycle
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
          Behind the largest loss
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
          GPU rows: none, this workload ran on the CPU
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
            description="Find which part of a machine a job is waiting on, from four percentages a CPU core's counters give and from GPU counters that see past the utilisation figure, before you pay for more of the wrong part (Arm and Intel metric files, Linux perf v7.3, AWS and NVIDIA documentation, read 2026-11-20)"
          >
            21. Reading a Machine: The Counters That Say Which Part Is Full
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Whether a faster core, faster memory or different code would speed a job up can be read before you pay
            for any of them, from counters the hardware keeps while the job runs: a CPU core&apos;s performance
            monitoring unit (PMU), and the GPU&apos;s own counters. They show the job&apos;s bottleneck, the part of
            the machine it exhausts first. A core splits each instruction into micro-operations, smaller internal
            steps, and in every clock cycle it has a fixed number of chances to start one. Its counters record what
            became of every chance. Sorted four ways, they show where the core&apos;s capacity went: into work that
            finished, into work thrown away, or into chances left empty because the front of the core had nothing
            ready or the back could not take more. Those four percentages, and the second level beneath them, carry
            the decision.{' '}
            <Cite id="F08-50">of which counter shows each machine part</Cite>
          </Box>
          <Box variant="p">
            Each chance is a slot: one place, in one cycle, to pass one micro-operation from the front end, which
            fetches and decodes instructions, to the back end, which executes them. Take an illustrative core with{' '}
            <Toy>4</Toy> slots per cycle, watched for <Toy>100</Toy> cycles: <Toy>400</Toy> slots. Say{' '}
            <Toy>60</Toy> stayed empty because the front end had nothing ready and <Toy>100</Toy> because the back end
            could take no more. The other <Toy>240</Toy> each carried a micro-operation: <Toy>216</Toy> finished and
            were kept, which is called retiring, and <Toy>24</Toy> were thrown away because the core had guessed
            wrong which way a branch in the code would go. Each count over <Toy>400</Toy> is one share: retiring{' '}
            <Toy>54%</Toy>, bad speculation <Toy>6%</Toy>, front-end bound <Toy>15%</Toy> and back-end bound{' '}
            <Toy>25%</Toy>.{' '}
            <Cite id="F08-3">Intel VTune cookbook, the classification paragraphs</Cite>{' '}
            <Cite id="F08-14">Arm Neoverse V1 performance analysis white paper, section 3.2</Cite>
          </Box>
          <Box variant="p">
            As a diagnosis, <Toy>54%</Toy> of that core&apos;s capacity did work the program kept, and the back end
            cost the most. The method is called top-down analysis; it began in a 2014 Intel paper, and Intel, AMD and
            Arm now all sort slots this way. Its second level splits a back-end loss in two: waiting on memory, where faster memory helps (more bandwidth if the loads
            stream, lower latency if each waits for the one before) and a faster core does not, or waiting on the
            core&apos;s own execution units, where the reverse holds.{' '}
            <Cite id="F08-1">Intel perfmon README, its reference to the 2014 ISPASS paper</Cite>{' '}
            <Cite id="F08-11">Linux v7.3, amdzen4 pipeline.json</Cite>{' '}
            <Cite id="F08-14">Arm Neoverse V1 performance analysis white paper, section 3.2</Cite>{' '}
            <Cite id="F08-6">Intel TMA metrics file, rows Memory_Bound and Core_Bound</Cite>{' '}
            <Cite id="F08-41">Intel TMA metrics file, rows MEM_Bandwidth and MEM_Latency</Cite>
          </Box>
          <Box variant="p">
            In one run of ours, MuJoCo, a physics simulator, stepped a humanoid model on one Cortex-X925 core of an
            NVIDIA DGX Spark desktop machine. The back end left 36.5% of the slots empty, the largest of the three
            losses, while a memory-stall counter found only 0.4% of cycles stalled on memory. Set on one page with how they were counted, such readings are a PMU card: the
            record of one workload on one machine. This card points at the execution units rather than memory,
            though one counter cannot settle it.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>
          </Box>
          <Box variant="p">
            A GPU has no four-way sort, and its best-known figure misleads. The GPU utilisation that NVIDIA&apos;s
            nvidia-smi tool prints is the share of time any kernel, a function launched on the GPU, was running, so
            one small kernel run back to back reads 100% however little of the chip it uses. The GPU half of a card
            therefore comes from counters that say which units inside the chip were busy. Which half to read first
            is a question for a timeline of the whole job, because the CPU shares name a job&apos;s bottleneck only
            when the job is bound by that CPU.{' '}
            <Cite id="F08-30">nvidia-smi documentation, Utilization</Cite>{' '}
            <Cite id="F08-32">DCGM User Guide, profiling metrics</Cite>{' '}
            <Cite id="F08-9">Linux v7.3, perf-stat documentation, --topdown</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Sort every slot by two questions into one of four buckets, and know what a high share of each points at"
          >
            A slot gives every lost chance a cause
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each counter in the PMU is set to one kind of event, such as a clock cycle passing, a micro-operation
            retiring or a branch guessed wrong, and adds one every time the event happens, while the program runs
            unchanged. On Linux, <code>perf stat</code> runs a program and prints the totals. A one-number summary
            of those totals is instructions per cycle: finished instructions divided by clock cycles. It says how
            much got done and nothing about why the rest did not.
          </Box>
          <Box variant="p">
            Slots say why. A core&apos;s slots per cycle are fixed by its design, so a run holds a known number of
            them, the slots per cycle times the cycles, and every slot that did not carry kept work is a loss with a
            cause. Arm counts slots at the rename unit, the stage that passes micro-operations from the front end to
            the back end, and treats the slots per cycle as the core&apos;s execution bandwidth. Counting whole
            stalled cycles instead loses detail: on the <Toy>4</Toy>-slot core of the example, a cycle that moved{' '}
            <Toy>1</Toy> of its <Toy>4</Toy> slots counts as not stalled, and its <Toy>3</Toy> empty slots go
            unrecorded.{' '}
            <Cite id="F08-8">Intel TMA metrics file, row SLOTS</Cite>{' '}
            <Cite id="F08-2">Intel VTune cookbook, Top-down Microarchitecture Analysis Method</Cite>{' '}
            <Cite id="F08-14">Arm Neoverse V1 performance analysis white paper, section 3.2</Cite>{' '}
            <Cite id="F08-29">AWS Graviton guide, Top-down method to debug hardware performance</Cite>
          </Box>
          <Box variant="p">
            Where a slot can go follows from how the pipeline works. The front end predicts which instructions come
            next, fetches them and decodes them into micro-operations. The back end executes those out of program
            order where that is faster, and retirement makes their results final in program order. The front end
            also does not wait to learn which way a branch (an <code>if</code>, the end of a loop) will go: it guesses
            and keeps fetching. A wrong guess throws away every micro-operation started after it, which is called a
            flush, and the core restarts from the right place. Thrown-away work used slots and never retires.{' '}
            <Cite id="F08-4">Intel TMA metrics file, row Frontend_Bound</Cite>{' '}
            <Cite id="F08-5">Intel TMA metrics file, row Backend_Bound</Cite>
          </Box>
          <Box variant="p">
            Two questions therefore sort every slot of every cycle into exactly one bucket. Was a micro-operation
            delivered to the slot? If it was, did it retire?{' '}
            <Cite id="F08-3">Intel VTune cookbook, the classification paragraphs</Cite>
          </Box>
          <AnimatedFigure
            name="where slots go"
            steps={SLOT_CAPTIONS}
            intervalMs={3200}
            cites="F08-2 F08-3"
            caption={
              <>
                The top row is the core and the tree beneath it is the sorting rule; each step follows one slot to its
                bucket. Illustrative, not measured: the core is drawn with 4 slots per cycle, and the last step uses
                the toy counts of the <Toy>400</Toy>-slot example.
              </>
            }
          >
            {(step, reduced) => <SlotsDiagram step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">Read each bucket as a pointer to a cause:</Box>
          <ul style={LIST}>
            <li>
              <strong>Retiring</strong> is kept work. A value of 100% would mean the core ran at its full width, and a
              high value still leaves room, because the program may be doing more work than it needs.{' '}
              <Cite id="F08-7">Intel TMA metrics file, rows Retiring and Bad_Speculation</Cite>
            </li>
            <li>
              <strong>Bad speculation</strong> points at branches the core cannot predict, such as decisions that
              depend on the data.
            </li>
            <li>
              <strong>Front-end bound</strong> points at the code itself: a body of instructions too large, or
              jumping too often, for the core to fetch and decode fast enough. Misses in the instruction cache land
              here.{' '}
              <Cite id="F08-4">Intel TMA metrics file, row Frontend_Bound</Cite>
            </li>
            <li>
              <strong>Back-end bound</strong> splits at the second level. Memory bound means the back end is waiting
              for data to be loaded or stored. Core bound means its execution units are busy, or each operation
              waits for the result of the one before, as in a chain of long floating-point operations.{' '}
              <Cite id="F08-6">Intel TMA metrics file, rows Memory_Bound and Core_Bound</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Recompute any card's four shares from its raw counts, and know which check of the result proves something"
          >
            Four shares from six counters, and the test that checks them
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            In Arm&apos;s event names, <code>CPU_CYCLES</code> counts the clock cycles of the run, and <M>S</M> is
            the core&apos;s slots per cycle, a constant of its design. <code>STALL_SLOT_FRONTEND</code> and{' '}
            <code>STALL_SLOT_BACKEND</code> count empty slots by the side that was not ready, and{' '}
            <code>STALL_SLOT</code> is their sum. <code>OP_SPEC</code> counts micro-operations dispatched through a
            slot, including those later thrown away, and <code>OP_RETIRED</code> the ones that retired. The shares
            are built from <M>{String.raw`\mathrm{slots}`}</M>, the total in the run;{' '}
            <M>{String.raw`\mathrm{filled}`}</M>, the share of slots that received a micro-operation; and{' '}
            <M>{String.raw`\mathrm{kept}`}</M>, the share of dispatched micro-operations that retired.{' '}
            <Cite id="F08-15">Arm Cortex-X925 specification file, events</Cite>
          </Box>
          <Formula
            name="Slots, and the two shares the buckets are built from"
            tex={String.raw`\begin{aligned} \mathrm{slots} &= S \times \texttt{CPU\_CYCLES} \\ \mathrm{filled} &= 1 - \frac{\texttt{STALL\_SLOT}}{\mathrm{slots}} \\ \mathrm{kept} &= \frac{\texttt{OP\_RETIRED}}{\texttt{OP\_SPEC}} \end{aligned}`}
            source={<Cite id="F08-20">Linux v7.3, perf metric file sbsa.json</Cite>}
          />
          <Box variant="p">
            The first level of the method, in the generic form Linux perf ships for Arm cores, is four fractions of
            those slots:
          </Box>
          <Formula
            name="Top-down level 1, generic Arm form"
            tex={String.raw`\begin{aligned} &\text{front-end bound} = \\ &\qquad \frac{\texttt{STALL\_SLOT\_FRONTEND}}{\mathrm{slots}} \\[6pt] &\text{back-end bound} = \\ &\qquad \frac{\texttt{STALL\_SLOT\_BACKEND}}{\mathrm{slots}} \\[6pt] &\text{retiring} = \mathrm{filled} \times \mathrm{kept} \\[6pt] &\text{bad speculation} = \\ &\qquad \mathrm{filled} \times (1 - \mathrm{kept}) \end{aligned}`}
            source={<Cite id="F08-20">Linux v7.3, perf metric file sbsa.json</Cite>}
          />
          <Box variant="p">
            Each line is one branch of the two questions. Front-end and back-end bound are the &quot;no&quot; branch
            of the first: empty slots, by the side that was not ready, over all slots.{' '}
            <M>{String.raw`\mathrm{filled}`}</M> is the &quot;yes&quot; branch, and in the <Toy>400</Toy>-slot
            example it is <Toy>1 - 160 / 400 = 0.6</Toy>. <M>{String.raw`\mathrm{kept}`}</M> answers the second
            question: <Toy>216 / 240 = 0.9</Toy>. Retiring is the filled slots whose work was kept,{' '}
            <Toy>0.6 x 0.9 = 0.54</Toy>, and bad speculation the filled slots whose work was thrown away,{' '}
            <Toy>0.6 x 0.1 = 0.06</Toy>: the <Toy>54%</Toy> and <Toy>6%</Toy> of the example.
          </Box>
          <Box variant="p">
            The four shares sum to 100% because the formula makes them: the two stall counts add to{' '}
            <code>STALL_SLOT</code>, and retiring plus bad speculation is <M>{String.raw`\mathrm{filled}`}</M>, which
            is everything else. A card whose shares sum to 100% has passed no test.{' '}
            <Cite id="F08-69">our check of the raw counter rows</Cite>
          </Box>
          <Box variant="p">
            A program with a known answer is a test. A chain of loads, each waiting for the one before, over more
            memory than the caches hold, should land almost entirely in back-end bound. We ran it once on each of
            three core types: the Spark&apos;s X925, the Spark&apos;s smaller Cortex-A725, and the Cortex-A78AE of
            NVIDIA&apos;s Jetson robot computer. It measured 97.6% to 99.0% back-end bound on each, so on this test
            the formula puts a known memory wait where it belongs.{' '}
            <Cite id="F08-67">our profiling report, latency rows</Cite>{' '}
            <Cite id="F08-69">our check of the raw counter rows</Cite>
          </Box>
          <ExpandableSection headerText="The physics-step card, recomputed from its raw counts">
            <SpaceBetween size="s">
              <Box variant="p">
                One Cortex-X925 core of a DGX Spark stepping a MuJoCo humanoid model, at the core&apos;s 10 slots
                per cycle.{' '}
                <Cite id="F08-70">our recomputation from the raw counter file</Cite>{' '}
                <Cite id="F08-69">raw row for the physics step</Cite>
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
                  Width check, since every slot either stalls or carries a dispatched micro-operation:{' '}
                  <Derived>(97,275,014,000 + 102,307,494,220) / 19,958,256,358 = 10.000</Derived> slots per cycle.
                </li>
              </ul>
              <Box variant="p">
                The card prints these to one decimal: 12.2%, 36.5%, 45.7% and 5.6%.{' '}
                <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
                <Cite id="F08-68">our profiling report, slots per cycle</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <ExpandableSection headerText="The same four buckets on Intel and AMD, for reference">
            <Box variant="p">
              Intel and AMD sort slots the same four ways under other event names. From Ice Lake on, Intel cores
              count slots in a fixed counter and hold the four ratios in a register of their own, so the split takes
              none of the general-purpose counters and leaves them for other events. AMD counts dispatch slots and,
              on Zen 4, adds a fifth bucket for SMT (simultaneous multithreading, two hardware threads sharing one
              core): slots left unused because the other thread was given the turn.{' '}
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
            description="Look up the slots per cycle of the core you rent, and compare cores of different width by throughput"
          >
            A wider core does more work at a lower share
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A core&apos;s slots per cycle are its width, the <M>S</M> of the formula, so every share on a card is a
            share of that core&apos;s own width. Width differs by vendor and by generation, and each vendor publishes
            it in machine-readable metric files, the same files that define the formulas: Intel&apos;s metrics file,
            Arm&apos;s per-core files in its Telemetry Solution repository, and AMD&apos;s pipeline files in Linux
            perf. Take the width for your core from its file.{' '}
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
                  <td style={TD}>6 on Zen 4, 8 on Zen 5; the Zen 6 file also says 8</td>
                  <td style={TD}>
                    <Cite id="F08-11">Linux v7.3, amdzen4 pipeline.json</Cite>{' '}
                    <Cite id="F08-12">Linux v7.3, amdzen5 and amdzen6 pipeline.json</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Arm</td>
                  <td style={TD}>
                    Neoverse N1 5, Neoverse V1 8, Neoverse V2 8, Neoverse V3 10, Cortex-X925 10, Cortex-A725 5
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
            Cortex-A725 retired 61.0% of its 5 slots and the Cortex-X925 45.7% of its 10, yet the X925 ran 57,240
            steps per second against the A725&apos;s 28,662. In kept slots per cycle the X925 does{' '}
            <Derived>0.457 x 10 = 4.57</Derived> against <Derived>0.610 x 5 = 3.05</Derived>: the lower share is
            more kept work per cycle. Compare shares only between cores of the same width; compare throughput
            between any two.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>
          </Box>
          <Box variant="p">
            Kept slots per cycle still do not close the gap. They differ by <Derived>4.57 / 3.05 = 1.5</Derived>{' '}
            times and steps per second by <Derived>57,240 / 28,662 = 2.0</Derived>. The remaining factor, about{' '}
            <Derived>2.0 / 1.5 = 1.33</Derived>, is what a per-cycle share leaves out: each core&apos;s clock, and
            the micro-operations each needs per step. To split the two, record the run&apos;s duration and step count
            beside its cycle and micro-operation counts.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>
          </Box>
          <Box variant="p">
            On EC2 the Arm rows are Graviton, the Arm processors AWS designs: Graviton3 is the Neoverse V1, Graviton4
            the Neoverse V2 and Graviton5 the Neoverse V3. A Graviton5 core and the Spark&apos;s X925 share the
            widest figure in the table, 10 slots per cycle, and Arm gives both the same formula, so the same
            arithmetic reads a card from either chip. Intel&apos;s VTune cookbook still says four slots per cycle,
            the width of the oldest cores in Intel&apos;s own metrics file, so a width taken from the cookbook is
            wrong for every Intel core from Ice Lake on.{' '}
            <Cite id="F08-56">AWS Graviton guide, README processor table</Cite>{' '}
            <Cite id="F08-19">Arm Telemetry Solution, neoverse_v3 and cortex_x925 metrics</Cite>{' '}
            <Cite id="F08-2">Intel VTune cookbook 2025.4, the current edition, Top-down Microarchitecture Analysis Method</Cite>
          </Box>
          <Box variant="p">
            The Neoverse N1, the core of Graviton2, has a width of 5 in Arm&apos;s file but
            no slot-stall events, so the slot formula cannot run on it, and Arm&apos;s method for that core counts
            stalled cycles instead. The Cortex-A78AE in the Jetson Orin Nano Super has no Arm file, and its Linux
            kernel reports a width of 0. The events recover the width, because every slot in every cycle either
            stalls or carries one dispatched micro-operation: <code>(STALL_SLOT + OP_SPEC) / CPU_CYCLES</code>. That
            came out at 10.000 and 5.000 on the Spark&apos;s two cores, as Arm&apos;s files give them, and at 6.000
            on the A78AE, a value with no Arm file to check it against.{' '}
            <Cite id="F08-56">AWS Graviton guide, README processor table</Cite>{' '}
            <Cite id="F08-16">Arm Telemetry Solution, cortex folder listing</Cite>{' '}
            <Cite id="F08-15">Arm Cortex-X925 specification file, STALL_SLOT and OP_SPEC</Cite>{' '}
            <Cite id="F08-68">our profiling report, slots per cycle</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know which way an uncorrected card leans, and by how much, before you compare its front-end share with another card's"
          >
            The generic Arm formula books flush recovery as front-end bound
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            After a flush the front end has nothing to hand over for a few cycles while it fetches again from the
            right place. A mispredicted branch is the usual cause; exceptions and other machine flushes count too.
            Those slots are empty with the front end not ready, so the generic formula books them as front-end
            bound, although the wrong guess caused them. Intel&apos;s definition of bad speculation includes them,
            and Arm&apos;s per-core method moves them there: it subtracts the recovery time from front-end bound and
            adds it to bad speculation. Arm obtains the recovery time differently on each core:{' '}
            <Cite id="F08-7">Intel TMA metrics file, row Bad_Speculation</Cite>{' '}
            <Cite id="F08-19">Arm Telemetry Solution, STALL_FRONTEND_FLUSH</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              Neoverse V1 (Graviton3): a fixed 4 cycles per mispredicted branch.{' '}
              <Cite id="F08-17">Arm Telemetry Solution, neoverse_v1 metrics</Cite>
            </li>
            <li>
              Neoverse V2 (Graviton4): the same 4 cycles, taken 1 from the front end and 3 from the back end, so on
              Graviton4 the back end is corrected as well.{' '}
              <Cite id="F08-18">Arm Telemetry Solution, neoverse_v2 metrics</Cite>
            </li>
            <li>
              Neoverse V3 (Graviton5), Cortex-X925 and Cortex-A725: a measured event,{' '}
              <code>STALL_FRONTEND_FLUSH</code>, the cycles the front end spent recovering from a flush.{' '}
              <Cite id="F08-19">Arm Telemetry Solution, cortex_x925 metrics</Cite>
            </li>
          </ul>
          <Box variant="p">
            Write <M>c</M> for the recovery time as a share of all cycles. Every cycle has the same <M>S</M> slots,
            so a share of cycles is also a share of slots and can move between buckets directly. On the Neoverse V3,
            Cortex-X925 and Cortex-A725, with <M>{String.raw`\mathrm{slots}`}</M>,{' '}
            <M>{String.raw`\mathrm{filled}`}</M> and <M>{String.raw`\mathrm{kept}`}</M> as before:
          </Box>
          <Formula
            name="Arm's flush correction, measured form"
            tex={String.raw`\begin{aligned} &c = \frac{\texttt{STALL\_FRONTEND\_FLUSH}}{\texttt{CPU\_CYCLES}} \\[6pt] &\text{front-end bound} = \\ &\qquad \frac{\texttt{STALL\_SLOT\_FRONTEND}}{\mathrm{slots}} - c \\[6pt] &\text{bad speculation} = \\ &\qquad \mathrm{filled} \times (1 - \mathrm{kept}) + c \end{aligned}`}
            source={<Cite id="F08-19">Arm Telemetry Solution, cortex_x925 metrics</Cite>}
          />
          <Box variant="p">
            The term <M>c</M> leaves front-end bound and enters bad speculation, so the four shares still sum to
            100%, and back-end bound and retiring keep their generic lines. The Neoverse V1 has the same shape, with{' '}
            <M>c</M> taken as 4 cycles times the mispredicted branches, over the cycle count. A card computed without{' '}
            <M>c</M> therefore reads front-end bound too high and bad speculation too low by <M>c</M> on the V1, V3,
            X925 and A725, while its back-end and retiring shares match Arm&apos;s. On the V2, where Arm takes 1 of
            the 4 cycles from the front end and 3 from the back end, an uncorrected card overstates front-end bound by
            the mispredicted branches times 1 cycle and back-end bound by the mispredicted branches times 3 cycles,
            each over the cycle count.{' '}
            <Cite id="F08-17">Arm Telemetry Solution, neoverse_v1 metrics</Cite>{' '}
            <Cite id="F08-22">our comparison of the run script with Arm&apos;s formulas</Cite>{' '}
            <Cite id="F08-18">Arm Telemetry Solution, neoverse_v2 metrics; the uncorrected V2 error is our arithmetic</Cite>
          </Box>
          <Box variant="p">
            On branchy code the error can be large enough to change which of two losses looks larger. Our branch
            microbenchmark, a small program that mispredicts far more often per cycle than the physics step, reads
            37.6% front-end bound and 11.9% bad speculation under the generic formula. Taking <M>c</M> from the
            V1&apos;s 4 cycles per mispredicted branch moves 13.2 points between them, to about 24.5% and about
            25.1%, and bad speculation becomes the larger of the two.{' '}
            <Cite id="F08-23">our estimate of the missing correction</Cite>
          </Box>
          <Box variant="p">
            The physics step moves far less. Its card lacks <code>STALL_FRONTEND_FLUSH</code>, so the estimate uses
            the mispredicted branches counted in a second execution of the same program:{' '}
            <Derived>79,584,976 x 4 / 19,922,115,591 = 1.6</Derived> points, which takes front-end bound from 12.2%
            to about 10.6% and bad speculation from 5.6% to about 7.2%. The back end stays the largest loss either
            way. Both estimates borrow another core&apos;s constant, so they size the error without correcting it;
            counting <code>STALL_FRONTEND_FLUSH</code> lets Arm&apos;s own formula make the correction.{' '}
            <Cite id="F08-22">our comparison of the run script with Arm&apos;s formulas</Cite>{' '}
            <Cite id="F08-23">our estimate of the missing correction</Cite>{' '}
            <Cite id="F08-60">our run script, two executions per program</Cite>
          </Box>
          <Box variant="p">
            Which formula a tool applies depends on whether it knows the core. Linux v7.3 (October 2026) carries
            Arm&apos;s corrected files for the Neoverse cores and none for the Cortex-X925 or Cortex-A725, so{' '}
            <code>perf stat --topdown</code> on a DGX Spark at that version would print the generic split. The one
            label, front-end bound, covers at least three formulas on Arm alone. A card names its formula and its
            tool version, and two cards are compared on front-end bound only when both match.{' '}
            <Cite id="F08-9">Linux v7.3, perf-stat documentation, --topdown</Cite>{' '}
            <Cite id="F08-21">Linux v7.3 perf directories; the fallback is our reading</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Ask each NVIDIA tool the question it can answer, and see on one measured kernel why a busy GPU says nothing yet about its tensor cores"
          >
            GPU utilisation counts time, not work
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The four shares describe the CPU thread that was measured. A training job that waits on its GPU shows a
            CPU split that says nothing about the GPU, so the first reading of a GPU job is a timeline: Nsight
            Systems, NVIDIA&apos;s whole-application profiler, puts CPU samples, GPU calls and GPU work on one time
            axis, which shows which side waits for the other.{' '}
            <Cite id="F08-9">Linux v7.3, perf-stat documentation, --topdown</Cite>{' '}
            <Cite id="F08-39">Nsight Systems 2026.6 release notes; its use for this question is our reading</Cite>
          </Box>
          <Box variant="p">
            A kernel such as a matrix multiply runs on SMs (streaming multiprocessors), the GPU&apos;s processing
            units, repeated many times across the chip. Tensor cores are units inside each SM with a pipeline of
            their own for matrix multiply-accumulate instructions, the arithmetic of training and inference.{' '}
            <Cite id="F08-36">Nsight Compute Profiling Guide, Streaming Multiprocessor</Cite>{' '}
            <Cite id="F08-42">NVIDIA Tensor Cores page; Nsight Compute pipeline glossary</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={TH}>Tool</th>
                  <th style={TH}>Grain</th>
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
                  <td style={TD}>Were the SMs active, the tensor pipeline busy, data moving to and from memory?</td>
                  <td style={TD}>Whether active SMs were computing: threads waiting on memory count as active</td>
                  <td style={TD}>
                    <Cite id="F08-32">DCGM User Guide, profiling metrics; newest tag v4.7.0</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Nsight Compute</td>
                  <td style={TD}>One kernel, replayed to collect more metrics</td>
                  <td style={TD}>
                    Which limit holds this kernel, compute or memory bandwidth, and which pipeline inside the SM is
                    busy?
                  </td>
                  <td style={TD}>Whether the GPU is waiting on the CPU</td>
                  <td style={TD}>
                    <Cite id="F08-33">Nsight Compute 2026.4.0 Profiling Guide and release notes</Cite>{' '}
                    <Cite id="F08-34">Nsight Compute Profiling Guide, table of sections</Cite>{' '}
                    <Cite id="F08-39">Nsight Systems release notes; the waiting-on-CPU limit is our reading</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            DCGM splits the GPU by unit. SM activity is the fraction of time at least one group of threads was
            active on an SM, averaged over all SMs. Threads waiting on memory count as active, which is why NVIDIA
            calls a value of 0.8 or more &quot;necessary, but not sufficient&quot; for effective use, and says a value
            under 0.5 &quot;likely indicates ineffective GPU usage&quot;. Tensor activity is the fraction of cycles
            the tensor pipeline was busy, the direct sign that a job uses its tensor cores. Memory activity is the
            fraction of cycles in which data moved to or from the GPU&apos;s memory.{' '}
            <Cite id="F08-32">DCGM User Guide, Device Level GPU Metrics</Cite>
          </Box>
          <Box variant="p">
            Set the two tools side by side on an illustrative GPU with <Toy>100</Toy> SMs, running one small kernel
            back to back that keeps <Toy>5</Toy> of them busy. nvidia-smi counts the &quot;percent of time over the
            past sample period during which one or more kernels was executing on the GPU&quot;, and a kernel is always
            running, so it reads <Toy>100%</Toy>. Five SMs active all the time and the other <Toy>95</Toy> never,
            averaged over all <Toy>100</Toy>, give an SM activity of <Toy>5 / 100 = 0.05</Toy>, a tenth of the 0.5
            below which NVIDIA says usage is likely ineffective. Both readings are correct: one counts time, the
            other the share of the chip at work, and only the second shows that most of the GPU sat idle.{' '}
            <Cite id="F08-30">nvidia-smi documentation, Utilization</Cite>{' '}
            <Cite id="F08-32">DCGM User Guide, Device Level GPU Metrics</Cite>
          </Box>
          <Box variant="p">
            On a Jetson, tegrastats prints the time-based kind of figure, &quot;Proportion of GPU activation time in a
            period&quot;, and adds the memory controller&apos;s bandwidth in use, the reading that shows the CPU and
            the GPU competing for the one memory they share.{' '}
            <Cite id="F08-40">Jetson Linux r39.2.2, Tegrastats Utility</Cite>
          </Box>
          <ExpandableSection headerText="Agentless GPU metrics on EC2, for reference">
            <Box variant="p">
              Since 19 November 2026, EC2 Detailed Monitoring can publish one-minute GPU metrics with no agent inside
              the instance. Until you have confirmed that they include SM activity, take that figure from DCGM.{' '}
              <Cite id="F08-86">AWS What&apos;s New, EC2 performance status checks</Cite>
            </Box>
          </ExpandableSection>
          <Box variant="p">
            Nsight Compute profiles one kernel at a time and replays it to collect more metrics than one pass can
            hold, so a full profile costs run time, and on a Jetson, as in our pass on a DGX Spark, it must run as
            root. Its roofline chart plots the
            kernel&apos;s achieved speed against its arithmetic per byte of memory moved. The sloped part of the roof
            is the memory bandwidth limit and the flat part the peak compute limit, so where the kernel sits under
            the roof says which one holds it back: the GPU&apos;s version of memory bound against core bound (the{' '}
            <Link href="../silicon-memory-inference/">Silicon, Memory &amp; Inference dive</Link> builds the roofline
            in full).{' '}
            <Cite id="F08-33">Nsight Compute Profiling Guide, Sets and Sections</Cite>{' '}
            <Cite id="F08-37">Nsight Compute Profiling Guide, ERR_NVGPUCTRPERM</Cite>{' '}
            <Cite id="F08-71">our Nsight Compute pass on the Spark, run as root</Cite>{' '}
            <Cite id="F08-35">Nsight Compute Profiling Guide, Roofline Charts</Cite>
          </Box>
          <Box variant="p">
            Our one profiled pass on the DGX Spark&apos;s GPU shows what the kernel grain adds. A 4096 x 4096 float32
            matrix multiply in PyTorch ran as one kernel in 8.35 ms, which is{' '}
            <Derived>2 x 4096 x 4096 x 4096 / 8.35 ms = about 16,460 GFLOP/s</Derived> (billion floating-point
            operations per second). Nsight Compute&apos;s SpeedOfLight
            section put the kernel&apos;s compute (SM) throughput at 70.49% and its memory throughput at 50.47%. Each
            is the highest percentage among the units behind it, every unit measured against its own peak, so it
            says how close the busiest unit came to its limit and need not be a share of the chip&apos;s peak FLOP/s
            or of its memory bandwidth.{' '}
            <Cite id="F08-71">our Nsight Compute pass on the Spark</Cite>{' '}
            <Cite id="F08-34">Nsight Compute Profiling Guide, SpeedOfLight</Cite>
          </Box>
          <Box variant="p">
            The kernel&apos;s name, <code>cutlass_80_simt_sgemm_128x128_8x4_nn_align1</code>, carries{' '}
            <code>simt</code>, the general floating-point path: the float32 multiply did not go through the tensor
            pipeline, so this busy kernel says nothing about the tensor cores, and which precision or PyTorch setting
            would have sent it there is outside what the run recorded. Read the tensor pipeline itself instead:
            DCGM&apos;s tensor activity across a fleet, and Nsight Compute&apos;s per-pipeline figures for one
            kernel.{' '}
            <Cite id="F08-71">our Nsight Compute pass on the Spark; the simt reading is ours</Cite>{' '}
            <Cite id="F08-32">DCGM User Guide, Tensor Activity</Cite>{' '}
            <Cite id="F08-34">Nsight Compute Profiling Guide, ComputeWorkloadAnalysis</Cite>
          </Box>
          <Box variant="p">
            Other engines blur the memory side: the video decoder and the GPU&apos;s other engines share its L2
            cache and memory with the SMs, so a small profiled kernel can show memory traffic that is not its own.
            RT (ray-tracing) cores, the units that find what each camera ray
            hits when a simulator renders an image, have no counter we located in these tools&apos; documentation;
            Nsight Compute&apos;s guide lists &quot;RT Cores, if available&quot; among the SM&apos;s units and gives
            them no metric. A card for a rendering workload therefore carries its frame rate and leaves the
            ray-tracing row empty.{' '}
            <Cite id="F08-38">Nsight Compute Profiling Guide, shared resources</Cite>{' '}
            <Cite id="F08-36">Nsight Compute Profiling Guide, Streaming Multiprocessor unit list</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Rent a size that exposes every event before you plan a profiling run, and know that on most GPU instances a CPU card comes from inside a virtual machine"
          >
            On EC2 the instance size decides which counters you get
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A counter helps only if the instance lets you read it, and on EC2 that depends on the size. Sizes that
            hold an entire dedicated processor socket get every PMU event; smaller sizes of newer generations get a
            reduced set; smaller sizes of older generations may get none. The AWS page does not list which events
            the reduced set contains, so plan a top-down run on a size with full support, Graviton and x86 alike. A
            pattern such as <code>*9g</code> stands for every family of that generation: C9g, M9g and R9g.{' '}
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
          <Box variant="p">
            <Cite id="F08-26">AWS Graviton guide, PMU support table</Cite> Where the slot events are missing, the same
            guide&apos;s method falls back to instructions per cycle and to stalled cycles per thousand cycles, a
            whole-cycle count whose figures do not line up with a slot-based card.{' '}
            <Cite id="F08-29">AWS Graviton guide, Top-down method to debug hardware performance</Cite>
          </Box>
          <Box variant="p">
            A metal instance, one with no virtual machine layer between your operating system and the hardware,
            exposes every hardware PMU its operating system has drivers for. On Graviton that adds two PMUs that
            virtualised sizes do not get: Arm&apos;s Statistical Profiling Extension, which samples individual
            instructions, and the counters of the mesh interconnect, which measure the whole machine&apos;s memory
            bandwidth. On Graviton that bandwidth measurement therefore needs a metal size, and AWS&apos;s guide
            narrows the mesh counters further, to &quot;certain OSes and kernels&quot;: confirm they appear in the
            instance&apos;s event list before you plan a bandwidth measurement on them.{' '}
            <Cite id="F08-27">AWS Graviton guide, Additional PMUs and PMU events</Cite>
          </Box>
          <Box variant="p">
            GPU instances have almost no metal option. In the EC2 accelerated-computing table, &quot;Metal instances
            available&quot; is yes only for G4dn and G5g, so a CPU card from any other GPU instance comes from a
            virtual machine, with the event set its size allows and without the metal-only counters. The guide&apos;s PMU table names no G or P
            family either: read the event list on the GPU size itself before you plan a CPU card there.{' '}
            <Cite id="F08-28">EC2 accelerated computing specifications, instance family summary</Cite>{' '}
            <Cite id="F08-26">AWS Graviton guide, PMU support table</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Ask four questions in order, each of which stops one way of misreading a card, and finish on the part the card points at and the count that would confirm it"
          >
            The physics-step card points at the execution units
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The sample card is the CPU physics workload of section 12, Physics Simulation, on one Cortex-X925 core
            of a DGX Spark, with a MuJoCo humanoid model standing in for the SO-101 arm.{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Figure
            cites="F08-61 F08-68 F08-73 F08-20 F08-22"
            caption={
              <>
                Read the card from the top: what ran, where and how it was counted (1), how fast (2), where the slots
                went (3) and what lies behind the largest loss (4). Our measurement, single run: one Cortex-X925 core
                of a DGX Spark, MuJoCo 4.0.1, a humanoid model.
              </>
            }
          >
            <SampleCard />
          </Figure>
          <ol style={LIST}>
            <li>
              <strong>What ran, on which machine, and how was it counted?</strong> Two cards compare only when the
              unit of work, the core, the software version, the number of runs and the formula match, so these come
              first. This card is one run of MuJoCo 4.0.1 on one X925 core under the generic Arm formula, so its
              front-end share leans high and its bad-speculation share low, by about 1.6 points if the Neoverse
              V1&apos;s constant is borrowed. Its memory-stall and instructions-per-cycle figures come from the second
              execution of the program, and a ratio that mixes them with the slot shares compares two executions.{' '}
              <Cite id="F08-22">our comparison of the run script with Arm&apos;s formulas</Cite>{' '}
              <Cite id="F08-23">our estimate of the missing correction</Cite>{' '}
              <Cite id="F08-60">our run script, two executions per program</Cite>
            </li>
            <li>
              <strong>How much work per second?</strong> Throughput in the workload&apos;s own unit is the figure
              that compares across machines: 57,240 physics steps per second here. A share is per slot of one
              core&apos;s width and is never a speed. Section 23, Price-Performance and Latency, turns such a rate into work per price, per watt and
              per deadline.{' '}
              <Cite id="F08-61">our profiling report, physics step table</Cite>
            </li>
            <li>
              <strong>Where did the slots go?</strong> Read retiring first, then the largest of the other three. Here
              45.7% of 10 slots retire, <Derived>4.57</Derived> slots of kept work per cycle, and the back end is the
              largest loss at 36.5%.{' '}
              <Cite id="F08-61">our profiling report, physics step table</Cite>
            </li>
            <li>
              <SpaceBetween size="xs">
                <Box variant="p">
                  <strong>What is behind the largest loss?</strong> For the back end, memory or the execution units,
                  and the answer decides the purchase: faster memory for the first, a faster core for the second.
                  This is the question that keeps a core-bound job off a machine bought for its bandwidth.{' '}
                  <Cite id="F08-6">Intel TMA metrics file, rows Memory_Bound and Core_Bound</Cite>{' '}
                  <Cite id="F08-41">Intel TMA metrics file, rows MEM_Bandwidth and MEM_Latency</Cite>
                </Box>
                <Box variant="p">
                  This card has one figure for it: the event <code>stall_backend_mem</code> counted back-end memory
                  stalls in 0.4% of cycles. The two executions ran almost the same number of cycles (
                  <Derived>19,922,115,591 and 19,958,256,358</Derived>), so even if every cycle it counted lost all 10
                  of its slots, those cycles would hold <Derived>0.4</Derived> of the 36.5 points. The event counts
                  whole cycles, so memory waits in cycles that still moved some slots escape it, and the bound covers
                  only the cycles it counted.{' '}
                  <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
                  <Cite id="F08-60">our run script, the eight detail events</Cite>{' '}
                  <Cite id="F08-23">our estimate of the missing correction, cycles of the detail run</Cite>{' '}
                  <Cite id="F08-70">our recomputation, cycles of the slot run</Cite>{' '}
                  <Cite id="F08-29">AWS Graviton guide, Top-down method to debug hardware performance</Cite>
                </Box>
                <Box variant="p">
                  The evidence points at the execution units: in our reading a faster core is the likelier help, and
                  a level-2 count is what would rule out faster memory. Arm&apos;s level-2 metrics for the X925, A725 and Neoverse V3 split back-end stalls into core-bound
                  and memory-bound directly, and this run counted level 1 only. Whether a wider core, one with more
                  slots per cycle, would help as well is a further question, because core bound covers both execution
                  units that are busy and operations that wait on each other&apos;s results, and a level-1 count
                  cannot tell them apart.{' '}
                  <Cite id="F08-6">Intel TMA metrics file, rows Memory_Bound and Core_Bound</Cite>{' '}
                  <Cite id="F08-73">limits of our measurements, level 1 only</Cite>{' '}
                  <Cite id="F08-24">Arm Telemetry Solution, cortex_x925 level-2 metrics</Cite>
                </Box>
                <Box variant="p">
                  When a GPU does the work, the question moves to the GPU readings: tensor activity, memory
                  activity, or the kernel&apos;s place on the roofline.{' '}
                  <Cite id="F08-32">DCGM User Guide, Device Level GPU Metrics</Cite>{' '}
                  <Cite id="F08-35">Nsight Compute Profiling Guide, Roofline Charts</Cite>
                </Box>
              </SpaceBetween>
            </li>
          </ol>
          <Box variant="p">
            To read your own workload, run it under <code>perf stat</code> on a machine that exposes the slot events (on EC2, a
            size with full PMU support) and count the six: <code>cpu_cycles</code>, <code>stall_slot</code>,{' '}
            <code>stall_slot_frontend</code>, <code>stall_slot_backend</code>, <code>op_spec</code> and{' '}
            <code>op_retired</code>. Where the core&apos;s file defines them, add <code>STALL_FRONTEND_FLUSH</code>{' '}
            and the level-2 events, so that the fourth question ends on a measurement rather than a count of whole cycles.
            Run it more than once and record the spread: one run cannot show whether a difference of 1.6 points is
            above the noise.{' '}
            <Cite id="F08-60">our run script, the six top-down events</Cite>{' '}
            <Cite id="F08-19">Arm Telemetry Solution, cortex_x925 metrics</Cite>{' '}
            <Cite id="F08-24">Arm Telemetry Solution, cortex_x925 level-2 metrics</Cite>{' '}
            <Cite id="F08-23">our estimate of the missing correction</Cite>{' '}
            <Cite id="F08-73">limits of our measurements, single run, no variance</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
