import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
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
const PRE: CSSProperties = { margin: 0, whiteSpace: 'pre', overflowX: 'auto' };

/* ------------------------------------------------------------------------ */
/* Diagram 21.1: where slots go (animated)                                  */
/* ------------------------------------------------------------------------ */

const SLOT_CAPTIONS = [
  <>
    A core&apos;s pipeline: the front end fetches and decodes, the back end executes, retirement makes results final.
    Between front end and back end there is a fixed number of slots per cycle, 4 on this illustrative core.
  </>,
  <>
    Retiring. The front end hands a micro-operation to the slot, the back end executes it, and it retires. The slot
    did useful work.
  </>,
  <>
    Bad speculation. The slot receives a micro-operation, but it sits after a branch the core guessed wrong, so it is
    thrown away and never retires.
  </>,
  <>
    Front-end bound. The back end could take a micro-operation, but the front end has none ready. The slot stays
    empty.
  </>,
  <>
    Back-end bound. The front end has a micro-operation ready, but the back end cannot accept it. The slot stays
    empty.
  </>,
  <>
    The top-down breakdown: every slot of a run, sorted. In this illustration <Toy>400</Toy> slots split into{' '}
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
          A card in five bands. What ran and on which machine; throughput; the four top-down shares as a stacked bar
          with a legend; the memory stall share and instructions per cycle; and how the counters were read. Numbered
          markers 1 to 4 tie each band to one of the four reading questions.
        </desc>
        <rect x="0" y="0" width="420" height="534" fill="#fbfbfd" />
        <rect x="46" y="10" width="364" height="514" rx="8" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1.5" />

        {/* 1: what ran */}
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
        <Badge y={54} n={1} />

        {/* 2: throughput */}
        <text x="58" y="120" fontSize="12" fill={NEUTRAL_INK}>
          Throughput
        </text>
        <text x="58" y="144" fontSize="19" fontWeight="bold" fill={INK}>
          {CARD.throughput}
        </text>
        <Badge y={130} n={2} />
        <line x1="46" y1="158" x2="410" y2="158" stroke="#d5dbdb" strokeWidth="1.5" />

        {/* 3: where the slots went */}
        <text x="58" y="180" fontSize="12" fill={NEUTRAL_INK}>
          Where the slots went, of 10 per cycle
        </text>
        {segs.map((s) => (
          <rect key={s.name} x={s.x} y="190" width={s.w} height="24" fill={s.c.fill} stroke={s.c.ink} strokeWidth="1.5" />
        ))}
        {segs.map((s, i) => (
          <g key={s.name}>
            <rect x="58" y={227 + i * 20} width="14" height="14" fill={s.c.fill} stroke={s.c.ink} strokeWidth="1.5" />
            <text x="80" y={239 + i * 20} fontSize="12.5" fill={INK}>
              {s.name}
            </text>
            <text x="398" y={239 + i * 20} fontSize="12.5" fontWeight="bold" textAnchor="end" fill={INK}>
              {s.pct.toFixed(1)}%
            </text>
          </g>
        ))}
        <Badge y={234} n={3} />
        <line x1="46" y1="314" x2="410" y2="314" stroke="#d5dbdb" strokeWidth="1.5" />

        {/* 4: behind the largest loss */}
        <text x="58" y="336" fontSize="12" fill={NEUTRAL_INK}>
          Behind the largest loss
        </text>
        <text x="58" y="358" fontSize="12.5" fill={INK}>
          Memory stall
        </text>
        <text x="398" y="358" fontSize="12.5" fontWeight="bold" textAnchor="end" fill={INK}>
          0.4% of cycles
        </text>
        <text x="58" y="378" fontSize="12.5" fill={INK}>
          Instructions per cycle
        </text>
        <text x="398" y="378" fontSize="12.5" fontWeight="bold" textAnchor="end" fill={INK}>
          4.37
        </text>
        <Badge y={354} n={4} />

        {/* 1 again: how it was counted */}
        <rect x="46" y="392" width="364" height="84" fill="#f4f6f8" stroke="#d5dbdb" strokeWidth="1.5" />
        <text x="58" y="414" fontSize="12" fontWeight="bold" fill={INK}>
          How it was counted
        </text>
        <text x="58" y="432" fontSize="12" fill={INK}>
          perf stat on one core, six slot events
        </text>
        <text x="58" y="449" fontSize="12" fill={INK}>
          Generic Arm formula from Linux perf,
        </text>
        <text x="58" y="466" fontSize="12" fill={INK}>
          without the flush correction
        </text>
        <Badge y={434} n={1} />

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
            description="Read a top-down breakdown and a GPU profile and say which part of the machine is saturated: four percentages for a CPU core, three tools for a GPU, four questions for a card (vendor method files and docs read 2026-11-20; the sample card is our single run on a DGX Spark)"
          >
            21. Reading a Machine: PMU Cards
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 20, Fifteen Workloads, Five Shapes, says which part of the machine each workload loads. This
            section teaches the instrument that shows it. A processor counts what happens inside it, and a method
            called top-down analysis turns those counts into four percentages that say where a core&apos;s capacity
            went. The GPU has tools of its own, and each answers a different question.
          </Box>
          <Box variant="p">
            A PMU card is one page that holds those readings for one workload on one machine: how much work it did
            per second, where the CPU&apos;s capacity went, what the GPU tools showed, and how all of it was counted.
            Section 22, Our Measurements, is a set of such cards. This section gets you to the point where you can
            read one.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Know what is being counted before any percentage appears: cycles, micro-operations, and the three stages they pass through">
            Counters in the processor
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The PMU (performance monitoring unit) is a set of hardware counters inside every processor core. Each
            counter is pointed at one kind of event, such as a clock cycle passing, an instruction finishing or a
            branch guessed wrong, and adds one each time the event happens. The hardware does the counting while the
            program runs unchanged. On Linux the tool that reads the counters is <code>perf</code>:{' '}
            <code>perf stat</code> runs a program and prints the totals.
          </Box>
          <Box variant="p">Four ideas are enough to read those totals.</Box>
          <ul style={LIST}>
            <li>
              <strong>Clock cycle.</strong> A core works in beats, billions per second. Everything below is counted
              per cycle.
            </li>
            <li>
              <strong>Micro-operation.</strong> A core does not execute a program&apos;s instructions as written. It
              first breaks each one into one or more smaller internal steps, the micro-operations. Intel&apos;s
              documents shorten the word to uOp.
            </li>
            <li>
              <strong>Pipeline.</strong> A micro-operation passes through three stages. The front end predicts which
              instructions come next, fetches them from memory and decodes them into micro-operations. The back end
              executes them in its arithmetic and memory units, out of program order where that is faster.
              Retirement makes the results final, in program order.{' '}
              <Cite id="F08-4">Intel TMA metrics file, row Frontend_Bound</Cite>{' '}
              <Cite id="F08-5">Intel TMA metrics file, row Backend_Bound</Cite>
            </li>
            <li>
              <strong>Speculation.</strong> The front end does not wait to learn which way a branch (an{' '}
              <code>if</code>, the end of a loop) will go. It guesses and keeps fetching. When the guess is wrong,
              every micro-operation started after it is thrown away, which is called a flush, and the core restarts
              from the right place. Work that is thrown away never retires.
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Every slot of every cycle ends in exactly one of four places, and two questions decide which">
            Top-down in one picture
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Between the front end and the back end is a hand-over point with a fixed number of places per clock
            cycle. Each place is a slot: one chance, in one cycle, to pass one micro-operation to the back end.
            Intel&apos;s definition reads: &quot;A pipeline slot represents the hardware resources needed to process
            one uOp.&quot; <Cite id="F08-2">Intel VTune cookbook, Top-down Microarchitecture Analysis Method</Cite>{' '}
            Arm counts slots at the same point and treats the number per cycle as a fixed property of each core.{' '}
            <Cite id="F08-14">Arm Neoverse V1 performance analysis white paper, section 3.2</Cite> The Cortex-X925,
            the fast core of the DGX Spark desktop machine measured in section 22, has 10 slots per cycle.{' '}
            <Cite id="F08-16">Arm Telemetry Solution, per-core specification files</Cite>
          </Box>
          <Box variant="p">
            The slots are the core&apos;s whole capacity. Top-down analysis, a method Intel published in 2014, asks
            one thing of every slot in every cycle: where did it go?{' '}
            <Cite id="F08-1">Intel perfmon README, TMA reference</Cite> Two questions sort every slot into one of
            four buckets. Was a micro-operation delivered to the slot? If it was, did it retire?{' '}
            <Cite id="F08-3">Intel VTune cookbook, the classification paragraphs</Cite> Step through the four
            outcomes.
          </Box>
          <AnimatedFigure
            name="where slots go"
            steps={SLOT_CAPTIONS}
            intervalMs={3200}
            cites="F08-2 F08-3"
            caption={
              <>
                Read the top row as the core and the tree below it as the sorting rule. Each step follows one slot to
                its bucket. Illustrative, not measured: the core is drawn with 4 slots per cycle and the shares in
                the last step are invented.
              </>
            }
          >
            {(step, reduced) => <SlotsDiagram step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">Each bucket says something different about a workload.</Box>
          <ul style={LIST}>
            <li>
              <strong>Retiring.</strong> The slot carried work that finished. This is the useful share. A value of
              100% would mean the core ran at its full width. A high value still leaves room to gain: the program
              may be doing more work than it needs.{' '}
              <Cite id="F08-7">Intel TMA metrics file, rows Retiring and Bad_Speculation</Cite>
            </li>
            <li>
              <strong>Bad speculation.</strong> The slot carried work that was thrown away. A high share points at
              branches the core cannot predict, such as decisions that depend on the data.
            </li>
            <li>
              <strong>Front-end bound.</strong> The slot stayed empty because the front end had nothing ready. A
              high share points at the code itself: a large or jumpy body of instructions that the core cannot fetch
              and decode fast enough.
            </li>
            <li>
              <strong>Back-end bound.</strong> The slot stayed empty because the back end could not take more. There
              are two causes, and a second level of the method splits them. Memory bound: the back end is waiting
              for data to be loaded or stored. Core bound: its execution units are busy, or each operation is
              waiting for the result of the one before it.{' '}
              <Cite id="F08-6">Intel TMA metrics file, rows Memory_Bound and Core_Bound</Cite>
            </li>
          </ul>
          <Box variant="p">
            The split matters because the remedies differ. Back-end bound with a high memory share means the core
            is waiting on memory, and a faster core will not help. With a low memory share the arithmetic is the
            limit, and a wider or faster core helps directly.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Sort a small run by hand, then see the same arithmetic as the formula a profiler applies to the counters">
            Worked example: sorting a small run by hand
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An invented core, as an illustration: <Toy>4</Toy> slots per cycle, watched for <Toy>100</Toy> cycles.
            That is <Toy>4 x 100 = 400</Toy> slots. Suppose the counters report this:
          </Box>
          <ul style={LIST}>
            <li>
              <Toy>60</Toy> slots stayed empty because the front end had nothing ready.
            </li>
            <li>
              <Toy>100</Toy> slots stayed empty because the back end could not accept.
            </li>
            <li>
              The other <Toy>400 - 160 = 240</Toy> slots each received a micro-operation. Of those{' '}
              <Toy>240</Toy> micro-operations, <Toy>216</Toy> retired and <Toy>24</Toy> were thrown away.
            </li>
          </ul>
          <Box variant="p">
            Each bucket is its count over all slots. Retiring: <Toy>216 / 400 = 54%</Toy>. Bad speculation:{' '}
            <Toy>24 / 400 = 6%</Toy>. Front-end bound: <Toy>60 / 400 = 15%</Toy>. Back-end bound:{' '}
            <Toy>100 / 400 = 25%</Toy>. These are the shares in the last step of the figure above.
          </Box>
          <Box variant="p">
            A real core reports events, and a formula turns them into the four shares. The symbols, using the event
            names of Arm cores:
          </Box>
          <ul style={LIST}>
            <li>
              <code>CPU_CYCLES</code>: clock cycles counted during the run.
            </li>
            <li>
              <code>S</code>: slots per cycle, a constant of the core.
            </li>
            <li>
              <code>STALL_SLOT_FRONTEND</code>: slots that stayed empty because the front end had nothing to send.
            </li>
            <li>
              <code>STALL_SLOT_BACKEND</code>: slots that stayed empty because the back end could not accept.
            </li>
            <li>
              <code>STALL_SLOT</code>: all empty slots, the sum of the two above.
            </li>
            <li>
              <code>OP_SPEC</code>: micro-operations started. <code>OP_RETIRED</code>: micro-operations that retired.
            </li>
          </ul>
          <Box variant="p">
            <Cite id="F08-15">Arm Cortex-X925 specification file, events</Cite> The first level of the method, in the
            generic form Linux perf ships for Arm cores:
          </Box>
          <pre style={PRE}>
            <code>{`slots           = S x CPU_CYCLES
front-end bound = STALL_SLOT_FRONTEND / slots
back-end bound  = STALL_SLOT_BACKEND / slots
retiring        = (1 - STALL_SLOT / slots) x (OP_RETIRED / OP_SPEC)
bad speculation = (1 - STALL_SLOT / slots) x (1 - OP_RETIRED / OP_SPEC)`}</code>
          </pre>
          <Box variant="p">
            <Cite id="F08-20">Linux v7.3, perf metric file sbsa.json</Cite> Read it against the two questions. The
            front-end and back-end lines are the &quot;no&quot; branch of question 1: empty slots, by which side was
            not ready, over all slots. <code>1 - STALL_SLOT / slots</code> is the &quot;yes&quot; branch, the share
            of slots that received a micro-operation: <Toy>1 - 160 / 400 = 0.6</Toy> in the example.{' '}
            <code>OP_RETIRED / OP_SPEC</code> is question 2, the share of started micro-operations that finished:{' '}
            <Toy>216 / 240 = 0.9</Toy>. Retiring is one times the other, <Toy>0.6 x 0.9 = 0.54</Toy>, and bad
            speculation takes what is left of the filled slots, <Toy>0.6 x 0.1 = 0.06</Toy>.
          </Box>
          <Box variant="p">
            The four shares add to 100% because the formula makes them. The sum is arithmetic and says nothing about
            whether the counters were read correctly.{' '}
            <Cite id="F08-69">our check of the raw counter rows</Cite> Intel and AMD count the same four buckets
            under other event names; on Intel cores from Ice Lake on, the processor holds the four ratios in a
            register of their own. <Cite id="F08-8">Intel TMA metrics file, level-1 rows</Cite>
          </Box>
          <ExpandableSection headerText="The same arithmetic on real counters: the sample card's physics step">
            <SpaceBetween size="s">
              <Box variant="p">
                These are the raw counts behind the sample card at the end of this section: one Cortex-X925 core of a
                DGX Spark stepping a MuJoCo humanoid model, our measurement, single run.{' '}
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
                  Share of slots that received a micro-operation:{' '}
                  <Derived>1 - 97,275,014,000 / 199,582,563,580 = 0.5126</Derived>.
                </li>
                <li>
                  Share of started micro-operations that retired:{' '}
                  <Derived>91,123,888,968 / 102,307,494,220 = 0.8907</Derived>.
                </li>
                <li>
                  Retiring: <Derived>0.5126 x 0.8907 = 45.66%</Derived>. Bad speculation:{' '}
                  <Derived>0.5126 x (1 - 0.8907) = 5.60%</Derived>.
                </li>
              </ul>
              <Box variant="p">
                The card prints these to one decimal: 12.2%, 36.5%, 45.7% and 5.6%.{' '}
                <Cite id="F08-61">our profiling report, physics step table</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Look up the width of the core you rent before comparing two cards, and know which version of the formula its numbers carry">
            Slots per cycle by core
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The number of slots per cycle, also called the width of the core, differs by vendor and by generation.
            It is the <code>S</code> of the formula, so every percentage on a card is a share of that core&apos;s
            own width.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 620 }}>
              <thead>
                <tr>
                  <th style={TH}>Vendor</th>
                  <th style={TH}>Slots per cycle, by core</th>
                  <th style={TH}>Where the number lives</th>
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
            One Arm row needs a caution. The file for the Neoverse N1, the core of Graviton2, lists a width but no
            slot-stall events, so the slot formula of this section does not run on it; Arm&apos;s method for that core
            counts stalled cycles instead.
          </Box>
          <Box variant="p">
            Intel&apos;s cookbook page says a core has four slots per cycle; that is the width of the oldest cores
            in Intel&apos;s own metrics file, so take the width from the file. <Cite id="F08-2">Intel VTune cookbook, Top-down Microarchitecture Analysis Method</Cite> AMD
            cores report a fifth bucket for SMT (simultaneous multithreading, two hardware threads sharing one
            core): slots left unused because the other thread was given the turn. <Cite id="F08-11">Linux v7.3, amdzen4 pipeline.json, smt_contention</Cite> Arm publishes no file for
            the Cortex-A78AE, the core of the Jetson Orin Nano Super, so section 22 derives that core&apos;s width
            from its counters. <Cite id="F08-16">Arm Telemetry Solution, cortex folder listing</Cite>
          </Box>
          <Box variant="p">
            On EC2 the Arm rows map to Graviton, the Arm processors AWS designs: Graviton3 is the Neoverse V1,
            Graviton4 the Neoverse V2 and Graviton5 the Neoverse V3.{' '}
            <Cite id="F08-56">AWS Graviton guide, README processor table</Cite> A Graviton5 core and the DGX
            Spark&apos;s Cortex-X925 share the widest figure in the table, 10 slots per cycle.
          </Box>
          <Box variant="p">
            <strong>Width changes what a percentage means.</strong> In our single run of a MuJoCo humanoid physics
            step on a DGX Spark, the Cortex-A725 core retired 61.0% of its 5 slots and the Cortex-X925 retired 45.7%
            of its 10. The X925 has the lower percentage and does more: <Derived>0.457 x 10 = 4.57</Derived> useful
            slots per cycle against <Derived>0.610 x 5 = 3.05</Derived>, and 57,240 steps per second against 28,662.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite> Compare percentages only between cores
            of the same width, and compare throughput everywhere.
          </Box>
          <Box variant="h3">Arm&apos;s correction for flushed work</Box>
          <Box variant="p">
            After a wrong branch guess the core flushes, and for a few cycles the front end has nothing to hand over
            while it fetches again from the right place. Those slots are empty with the front end not ready, so the
            generic formula counts them as front-end bound. Their cause is the wrong guess. Arm&apos;s method moves
            them: it subtracts the recovery time from front-end bound and adds it to bad speculation. How the
            recovery time is obtained depends on the core.
          </Box>
          <ul style={LIST}>
            <li>
              Neoverse V1 (Graviton3): a fixed 4 cycles per mispredicted branch.{' '}
              <Cite id="F08-17">Arm Telemetry Solution, neoverse_v1 metrics</Cite>
            </li>
            <li>
              Neoverse V2 (Graviton4): the same 4-cycle term, taken 1 cycle from the front end and 3 cycles from the
              back end. <Cite id="F08-18">Arm Telemetry Solution, neoverse_v2 metrics</Cite>
            </li>
            <li>
              Neoverse V3 (Graviton5), Cortex-X925 and Cortex-A725: a measured event,{' '}
              <code>STALL_FRONTEND_FLUSH</code>, the cycles the front end spent recovering.{' '}
              <Cite id="F08-19">Arm Telemetry Solution, cortex_x925 metrics</Cite>
            </li>
          </ul>
          <Box variant="p">
            For a card this means the label &quot;front-end bound&quot; covers several formulas, and a tool that
            does not know the core applies the generic one. Linux v7.3 carries per-core files for the Neoverse
            cores and none for the Cortex-X925 or Cortex-A725, so our reading is that{' '}
            <code>perf stat --topdown</code> on a DGX Spark prints the uncorrected split.{' '}
            <Cite id="F08-21">Linux v7.3, perf arm64 per-core directories</Cite> Uncorrected, front-end bound reads
            too high and bad speculation too low by the same amount, while back-end bound and retiring are the same
            under both formulas on the V1, V3, X925 and A725.{' '}
            <Cite id="F08-22">our comparison of the run script with Arm&apos;s formulas</Cite> A card therefore names its formula and
            its tool version, and two cards are compared on front-end bound only when those match.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Pick an instance size that exposes the events before you plan a profiling run">
            Where you can read counters on EC2
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A counter helps only if the instance lets you read it, and on EC2 that depends on the size. Sizes that
            hold an entire dedicated processor socket get every PMU event. Smaller sizes of newer generations get a
            reduced set. Smaller sizes of older generations may get none.{' '}
            <Cite id="F08-25">AWS Graviton guide, How to Collect PMU counters</Cite> The table gives the sizes with
            full support. A pattern such as <code>*9g</code> stands for every family of that generation: C9g, M9g
            and R9g.
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
            <Cite id="F08-26">AWS Graviton guide, PMU support table</Cite> The page does not list which events the
            reduced set contains, so plan a top-down run on a size from the middle column. Where the slot events are
            missing, the same guide falls back to instructions per cycle and to stalled cycles per thousand cycles.
            That recipe counts whole cycles, so a cycle that moved 2 of 8 slots counts as not stalled, and its
            figures do not line up with a slot-based card.{' '}
            <Cite id="F08-29">AWS Graviton guide, Top-down method to debug hardware performance</Cite>
          </Box>
          <Box variant="p">
            GPU instances add a limit. A metal instance is one with no virtual machine layer between your operating
            system and the hardware. In the EC2 accelerated-computing table, &quot;Metal instances available&quot;
            is yes only for G4dn and G5g, so a PMU card for any other GPU instance is the card of a virtual machine.{' '}
            <Cite id="F08-28">EC2 accelerated computing specifications, instance family summary</Cite> The PMU
            support table above names no G or P family. Which GPU instance sizes expose which CPU events was not
            established in this research.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Three tools at three grains: know which one answers 'is the GPU full' and why the utilisation figure does not">
            The GPU side
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The four buckets describe one CPU thread. The perf documentation states the limit: &quot;The bottleneck
            is only the real bottleneck if the workload is actually bound by the CPU and not by something
            else.&quot; <Cite id="F08-9">Linux v7.3, perf-stat documentation, --topdown</Cite> A training job that
            waits on its GPU shows a CPU split that says nothing about the GPU. The GPU has no four-bucket method.
            It has tools at three grains.
          </Box>
          <Box variant="p">
            Three terms first. A kernel, in GPU work, is one function launched on the GPU, such as a matrix
            multiply; it has nothing to do with the operating system&apos;s kernel. The SM (streaming
            multiprocessor) is the GPU&apos;s processing unit, repeated many times across the chip.{' '}
            <Cite id="F08-36">Nsight Compute Profiling Guide, Streaming Multiprocessor</Cite> Tensor cores are the
            units inside each SM that do the matrix arithmetic of training and inference.{' '}
            <Cite id="F08-42">NVIDIA Tensor Cores page; Nsight Compute pipeline glossary</Cite> How a GPU and its
            memory execute a model is covered in the{' '}
            <Link href="../silicon-memory-inference/">Silicon, Memory &amp; Inference dive</Link>.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 680 }}>
              <thead>
                <tr>
                  <th style={TH}>Tool</th>
                  <th style={TH}>Grain</th>
                  <th style={TH}>What it shows</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>
                    <code>nvidia-smi</code>
                  </td>
                  <td style={TD}>The whole GPU, always on</td>
                  <td style={TD}>
                    Share of time any kernel was running; separate figures for the video encoder and decoder
                  </td>
                  <td style={TD}>
                    <Cite id="F08-30">nvidia-smi documentation, Utilization</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>DCGM (Data Center GPU Manager), NVIDIA&apos;s fleet monitoring service; newest tag v4.7.0</td>
                  <td style={TD}>The whole GPU, sampled across a fleet</td>
                  <td style={TD}>SM activity, tensor activity, memory activity</td>
                  <td style={TD}>
                    <Cite id="F08-32">DCGM User Guide, profiling metrics</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Nsight Systems 2026.6</td>
                  <td style={TD}>One application on a timeline</td>
                  <td style={TD}>
                    CPU samples, GPU calls and kernels on one time axis; our reading is that this is the tool that
                    shows a GPU waiting for the CPU
                  </td>
                  <td style={TD}>
                    <Cite id="F08-39">Nsight Systems release notes</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Nsight Compute 2026.4.0</td>
                  <td style={TD}>One kernel</td>
                  <td style={TD}>
                    Compute and memory throughput as a share of the GPU&apos;s maximum; which pipeline inside the SM
                    is busy
                  </td>
                  <td style={TD}>
                    <Cite id="F08-33">Nsight Compute Profiling Guide and release notes</Cite>{' '}
                    <Cite id="F08-34">Nsight Compute Profiling Guide, table of sections</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            <strong>What nvidia-smi utilisation means.</strong> The GPU figure is the &quot;percent of time over the
            past sample period during which one or more kernels was executing on the GPU&quot;. It measures time
            occupied, and one small kernel running back to back reads 100%.{' '}
            <Cite id="F08-30">nvidia-smi documentation, Utilization</Cite> The same tool reports the video encoder
            and the video decoder as separate figures.{' '}
            <Cite id="F08-31">nvidia-smi documentation, Encoder and Decoder</Cite>
          </Box>
          <Box variant="p">
            <strong>What DCGM adds.</strong> SM activity is the fraction of time at least one group of threads was
            active on an SM. Threads waiting on memory count as active, which is why NVIDIA calls a value of 0.8 or
            greater &quot;necessary, but not sufficient&quot; for effective use. Tensor activity is the fraction of
            cycles the tensor pipeline was active, the direct sign that tensor cores are in use. Memory activity is
            the fraction of cycles in which data moved to or from the GPU&apos;s memory.{' '}
            <Cite id="F08-32">DCGM User Guide, Device Level GPU Metrics</Cite> On EC2 there is a cheaper first
            signal: since 19 November 2026 Detailed Monitoring can publish one-minute GPU metrics with no agent
            inside the instance. Which fields it publishes was not read in this research.{' '}
            <Cite id="F08-86">AWS What&apos;s New, EC2 performance status checks</Cite>
          </Box>
          <Box variant="p">
            <strong>What Nsight Compute adds.</strong> It profiles one kernel and replays it to collect more
            metrics, so a deep profile costs run time.{' '}
            <Cite id="F08-33">Nsight Compute Profiling Guide, Sets and Sections</Cite> Its roofline chart plots a kernel&apos;s
            achieved speed against how much arithmetic it does per byte of memory moved. It is the GPU counterpart
            of core bound against memory bound: the flat part of the roof is the peak compute limit,
            the sloped part is the memory bandwidth limit, and where a kernel sits under the roof says which one
            holds it back. <Cite id="F08-35">Nsight Compute Profiling Guide, Roofline Charts</Cite>
          </Box>
          <Box variant="p">
            <strong>What has no counter here.</strong> RT (ray-tracing) cores are the GPU units that find what each
            camera ray hits when a simulator renders an image. NVIDIA&apos;s profiling guide lists &quot;RT Cores,
            if available&quot; among the units of the GPU, and that list is the only mention: no counter for
            ray-tracing-core use was located in this research.{' '}
            <Cite id="F08-36">Nsight Compute Profiling Guide, Streaming Multiprocessor unit list</Cite> A card for
            a rendering workload carries its frame rate and leaves the ray-tracing row empty.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Four questions that turn a card into a statement about which part is saturated, tried on a real one">
            How to read a card
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Here is one real card, drawn the way section 22 draws its cards. It is our measurement, a single run: one
            Cortex-X925 core of an NVIDIA DGX Spark stepping a MuJoCo humanoid model, the CPU physics workload of
            section 12, Physics Simulation, with a humanoid standing in for the arm. The numbered markers match the
            four questions below.
          </Box>
          <Figure
            cites="F08-61 F08-68 F08-73 F08-20 F08-22"
            caption={
              <>
                Read from the top: what ran and where (1), how fast (2), where the slots went (3), what is behind
                the largest loss (4), and how the counters were turned into percentages (1 again). Our measurement,
                single run, on a DGX Spark with MuJoCo 4.0.1; the model was a MuJoCo humanoid.
              </>
            }
          >
            <SampleCard />
          </Figure>
          <ol style={LIST}>
            <li>
              <strong>What ran, on which machine, counted how?</strong> The unit of work, the core, the software
              version, the number of runs, and the formula. This card: one core, one run, and the generic Arm
              formula, so its front-end figure is on the high side and its bad-speculation figure on the low side.{' '}
              <Cite id="F08-22">our comparison of the run script with Arm&apos;s formulas</Cite>
            </li>
            <li>
              <strong>How much work per second?</strong> Throughput in the workload&apos;s own unit is the only
              figure that compares across machines. This card: 57,240 physics steps per second.{' '}
              <Cite id="F08-61">our profiling report, physics step table</Cite>
            </li>
            <li>
              <strong>Where did the slots go?</strong> Read retiring first, then the largest of the other three.
              This card: 45.7% of the 10 slots per cycle retire, and the largest loss is the back end at 36.5%.
              Instructions per cycle, 4.37 here, is the older one-number summary: finished instructions divided by
              clock cycles.{' '}
              <Cite id="F08-61">our profiling report, physics step table</Cite>
            </li>
            <li>
              <strong>What is behind the largest loss?</strong> For the back end, memory or computation. Memory
              stall is the share of clock cycles in which a separate counter saw the back end waiting on memory.
              This card: 0.4% of cycles, so our reading is that the back end is waiting on arithmetic. A faster
              or wider core would help this workload; more memory bandwidth would not.{' '}
              <Cite id="F08-61">our profiling report, physics step table</Cite> When a GPU does the work, this
              question moves to the GPU rows: tensor activity, memory activity, or the roofline.
            </li>
          </ol>
          <Box variant="p">
            Put together: on this core, physics stepping is limited by computation in the back end. That is one run
            of one stand-in model. <Cite id="F08-73">limits of our measurements</Cite> Take the four questions to
            section 22, Our Measurements, next: its cards cover three workloads on three core types, and each one
            reads the same way.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
