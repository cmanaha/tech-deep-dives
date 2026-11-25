import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, Derived } from '../components/Cite';
import { Figure } from '../components/Figure';
import { Formula } from '../components/Math';
import { Placeholder } from '../components/Blocks';
import { ARM, TASK_STORY } from '../lib/task';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const CPU_FILL = '#e8f1fb';
const CPU_INK = '#1f5fa8';
const MEM_INK = '#5b3fa8';
const NEUTRAL_INK = '#5f6b7a';

/* The four top-down categories, in the colours and order section 21 uses for its sample card. */
const RET = { fill: '#dcebfa', ink: '#1f5fa8' };
const BAD = { fill: '#fdeedd', ink: '#a85a0a' };
const FRONT = { fill: '#eef0f2', ink: '#44505c' };
const BACK = { fill: '#fde8ef', ink: '#a8274f' };

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };
const TABLE: CSSProperties = { borderCollapse: 'collapse', width: '100%', minWidth: 620, fontSize: 14 };

/** Where the profiling results will come from, stated once. */
const PROJECT = 'Our profiling project';

/* ------------------------------------------------------------------------ */
/* Diagram 22.1: one card per stand-in workload per core type               */
/* ------------------------------------------------------------------------ */

interface Card {
  machine: string;
  core: string;
  software: string;
  throughput: string;
  /** Retiring, bad speculation, front-end bound, back-end bound: percent of slots. */
  ret: string;
  bad: string;
  front: string;
  back: string;
  /** Share of cycles the back end waited on memory (a separate counter, second execution). */
  mem: string;
}

const JETSON = 'Jetson Orin Nano Super';
const SPARK = 'DGX Spark';
const A78 = 'one Cortex-A78AE core, 6 slots per cycle';
const A725 = 'one Cortex-A725 core, 5 slots per cycle';
const X925 = 'one Cortex-X925 core, 10 slots per cycle';

/* Register entry F08-61, physics step table of the profiling report. */
const PHYSICS: Card[] = [
  { machine: JETSON, core: A78, software: 'MuJoCo 3.17.0, humanoid model', throughput: '14,507 steps per second', ret: '43.2', bad: '4.3', front: '31.0', back: '21.5', mem: '2.2' },
  { machine: SPARK, core: A725, software: 'MuJoCo 4.0.1, humanoid model', throughput: '28,662 steps per second', ret: '61.0', bad: '6.9', front: '10.1', back: '22.0', mem: '0.7' },
  { machine: SPARK, core: X925, software: 'MuJoCo 4.0.1, humanoid model', throughput: '57,240 steps per second', ret: '45.7', bad: '5.6', front: '12.2', back: '36.5', mem: '0.4' },
];

/* Register entry F08-62, policy inference table. */
const POLICY: Card[] = [
  { machine: JETSON, core: A78, software: 'NumPy, six 1024x1024 float32 layers', throughput: '390 inferences per second', ret: '26.8', bad: '0.3', front: '9.0', back: '63.9', mem: '62.3' },
  { machine: SPARK, core: A725, software: 'NumPy, six 1024x1024 float32 layers', throughput: '1,404 inferences per second', ret: '54.8', bad: '0.8', front: '22.8', back: '21.6', mem: '22.8' },
  { machine: SPARK, core: X925, software: 'NumPy, six 1024x1024 float32 layers', throughput: '1,968 inferences per second', ret: '28.0', bad: '0.5', front: '4.5', back: '67.0', mem: '22.4' },
];

/* Register entry F08-64, camera render table. */
const RENDER: Card[] = [
  { machine: JETSON, core: A78, software: 'MuJoCo 3.17.0, 640x480 through EGL', throughput: '209 frames per second', ret: '25.9', bad: '1.6', front: '34.0', back: '38.5', mem: '6.2' },
  { machine: SPARK, core: A725, software: 'MuJoCo 4.0.1, 640x480 through EGL', throughput: '937 frames per second', ret: '35.0', bad: '3.8', front: '19.1', back: '42.1', mem: '6.3' },
  { machine: SPARK, core: X925, software: 'MuJoCo 4.0.1, 640x480 through EGL', throughput: '1,191 frames per second', ret: '21.6', bad: '0.9', front: '8.2', back: '69.2', mem: '3.4' },
];

const CARD_H = 250;
const CARD_GAP = 12;
const BAR_X = 18;
const BAR_W = 304;

function CardStack({ cards }: { cards: Card[] }) {
  return (
    <>
      {cards.map((c, i) => {
        const y0 = 8 + i * (CARD_H + CARD_GAP);
        const rows = [
          { name: 'Retiring', pct: c.ret, c: RET },
          { name: 'Bad speculation', pct: c.bad, c: BAD },
          { name: 'Front-end bound', pct: c.front, c: FRONT },
          { name: 'Back-end bound', pct: c.back, c: BACK },
        ];
        let acc = 0;
        const segs = rows.map((r) => {
          const x = BAR_X + (acc / 100) * BAR_W;
          acc += Number(r.pct);
          return { ...r, x, w: (Number(r.pct) / 100) * BAR_W };
        });
        return (
          <g key={c.core}>
            <rect x="6" y={y0} width="328" height={CARD_H} rx="8" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1.5" />
            <path d={`M6 ${y0 + 8} a8 8 0 0 1 8 -8 h312 a8 8 0 0 1 8 8 v70 h-328 z`} fill={CPU_FILL} stroke={CPU_INK} strokeWidth="1.5" />
            <text x="18" y={y0 + 20} fontSize="13" fontWeight="bold" fill={INK}>
              {c.machine}
            </text>
            <text x="18" y={y0 + 37} fontSize="12" fill={INK}>
              {c.core}
            </text>
            <text x="18" y={y0 + 54} fontSize="12" fill={INK}>
              {c.software}
            </text>
            <text x="18" y={y0 + 71} fontSize="12" fontWeight="bold" fill={CPU_INK}>
              Our measurement, single run
            </text>
            <text x="18" y={y0 + 103} fontSize="16" fontWeight="bold" fill={INK}>
              {c.throughput}
            </text>
            {segs.map((s) => (
              <rect key={s.name} x={s.x} y={y0 + 113} width={s.w} height="20" fill={s.c.fill} stroke={s.c.ink} strokeWidth="1.5" />
            ))}
            {segs.map((s, k) => (
              <g key={s.name}>
                <rect x="18" y={y0 + 143 + k * 19} width="13" height="13" fill={s.c.fill} stroke={s.c.ink} strokeWidth="1.5" />
                <text x="39" y={y0 + 154 + k * 19} fontSize="12" fill={INK}>
                  {s.name}
                </text>
                <text x="322" y={y0 + 154 + k * 19} fontSize="12" fontWeight="bold" textAnchor="end" fill={INK}>
                  {s.pct}% of slots
                </text>
              </g>
            ))}
            <line x1="6" y1={y0 + 221} x2="334" y2={y0 + 221} stroke="#d5dbdb" strokeWidth="1.5" />
            <text x="18" y={y0 + 240} fontSize="12" fill={INK}>
              Memory stall
            </text>
            <text x="322" y={y0 + 240} fontSize="12" fontWeight="bold" textAnchor="end" fill={MEM_INK}>
              {c.mem}% of cycles
            </text>
          </g>
        );
      })}
    </>
  );
}

function PhysicsCards() {
  return (
    <svg viewBox="0 0 340 790" role="img" aria-labelledby="measurements-physics-title" style={{ width: '100%', height: 'auto' }} fontFamily="sans-serif">
      <title id="measurements-physics-title">Three cards for the physics step stand-in, one per core type</title>
      <desc>
        Each card names the machine, the core, the software and the run count, then gives steps per second, a stacked
        bar of the four top-down categories with each value written out, and the memory stall share of cycles.
      </desc>
      <rect x="0" y="0" width="340" height="790" fill="#fbfbfd" />
      <CardStack cards={PHYSICS} />
    </svg>
  );
}

function PolicyCards() {
  return (
    <svg viewBox="0 0 340 790" role="img" aria-labelledby="measurements-policy-title" style={{ width: '100%', height: 'auto' }} fontFamily="sans-serif">
      <title id="measurements-policy-title">Three cards for the policy inference stand-in, one per core type</title>
      <desc>
        Each card names the machine, the core, the software and the run count, then gives inferences per second, a
        stacked bar of the four top-down categories with each value written out, and the memory stall share of cycles.
      </desc>
      <rect x="0" y="0" width="340" height="790" fill="#fbfbfd" />
      <CardStack cards={POLICY} />
    </svg>
  );
}

function RenderCards() {
  return (
    <svg viewBox="0 0 340 790" role="img" aria-labelledby="measurements-render-title" style={{ width: '100%', height: 'auto' }} fontFamily="sans-serif">
      <title id="measurements-render-title">Three cards for the camera render stand-in, one per core type</title>
      <desc>
        Each card names the machine, the core, the software and the run count, then gives frames per second, a stacked
        bar of the four top-down categories with each value written out, and the memory stall share of cycles.
      </desc>
      <rect x="0" y="0" width="340" height="790" fill="#fbfbfd" />
      <CardStack cards={RENDER} />
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function Measurements() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="See measured cards for three stand-in workloads on the two edge machines we ran, and know what each card can and cannot tell you (our own measurements on an NVIDIA DGX Spark and an NVIDIA Jetson Orin Nano Super, one run per pass, two passes; results read 2026-11-20)"
          >
            22. Our Measurements: Three Stand-Ins on Two Edge Machines
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This section fills in the cards that section 21, Reading a Machine: PMU Cards, taught you to read. A PMU
            (performance monitoring unit) is the set of counters inside a processor that count events such as cycles
            and stalled slots, and a card is those counters turned into a few percentages for one workload on one
            machine. Every figure in this section is our measurement, and every one is a single run.
          </Box>
          <Box variant="p">
            The section is built open. It shows what exists today: two edge machines (computers that sit beside a
            robot, outside a data centre) running stand-ins for the {ARM} arm&apos;s workloads on one CPU core. It
            then marks what a separate profiling project will add: the real workloads, Amazon EC2 instances and GPU
            counters.
          </Box>
          <Box variant="p">
            One pair of figures frames the rest. Stepping the same kind of physics model, one Cortex-A78AE core of
            the Jetson reached 14,507 steps per second and one Cortex-X925 core of the Spark reached 57,240, with
            MuJoCo 3.17.0 on the first and MuJoCo 4.0.1 on the second. Our measurement, single run.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Know exactly which machines, programs and versions stand behind every figure below, and which ones do not">
            What was run, and what was not
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Two machines were measured. The NVIDIA Jetson Orin Nano Super is a small robot computer with Cortex-A78AE
            cores. The NVIDIA DGX Spark is a desktop machine with two core types, the larger Cortex-X925 and the
            smaller Cortex-A725, and a GB10 GPU. On each core type we ran 14 single-thread microbenchmarks (small
            loops, each built to load one part of the core) and 3 CPU stand-in workloads, pinned to one core. Each
            program ran under <code>perf stat</code>, the Linux tool that reads the PMU around one run of a program,
            twice: once for the six events behind the top-down split and once for eight detail events such as memory
            stalls. Each machine also ran one GPU matrix-multiply kernel under Nsight Compute, NVIDIA&apos;s profiler
            for a single GPU function. <Cite id="F08-60">our run script and experiment notes</Cite>
          </Box>
          <Box variant="p">
            The software differed between the machines: MuJoCo 4.0.1 on the Spark and MuJoCo 3.17.0 on the Jetson;
            Nsight Compute 2025.3.1 on the Spark and 2024.3.1 on the Jetson.{' '}
            <Cite id="F08-73">limits of our measurements</Cite> <Cite id="F08-71">our DGX Spark card, GPU kernel</Cite>{' '}
            <Cite id="F08-72">our Jetson card, GPU kernel</Cite>
          </Box>
          <Box variant="p">
            A stand-in is a program we could run today that loads the machine the way we expect the arm&apos;s
            workload to, without being that workload. The arm of this dive must {TASK_STORY}; none of the three
            programs below does that.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={TABLE}>
              <thead>
                <tr>
                  <th style={TH}>The arm&apos;s workload</th>
                  <th style={TH}>The stand-in we ran</th>
                  <th style={TH}>What it leaves out</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Physics simulation of the arm (section 12)</td>
                  <td style={TD}>One MuJoCo step of a humanoid model with random controls, in a loop</td>
                  <td style={TD}>
                    The {ARM} model, its cube and its contacts.{' '}
                    <Cite id="F08-61">our profiling report, physics step table</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Running the policy, the model that picks the arm&apos;s actions (sections 4, 5 and 17)</td>
                  <td style={TD}>
                    Six 1024x1024 float32 matrix-vector products, each followed by ReLU (the function that sets
                    negative values to zero), in NumPy on one core
                  </td>
                  <td style={TD}>
                    Convolutions, attention and the GPU: a real policy is not a stack of six dense layers.{' '}
                    <Cite id="F08-62">our profiling report, policy inference table</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>A simulator camera (section 13)</td>
                  <td style={TD}>
                    A MuJoCo offscreen render at 640x480 through EGL, the interface MuJoCo uses for hardware
                    accelerated rendering with no display, with one physics step per frame
                  </td>
                  <td style={TD}>
                    Any record of how much of each frame the GPU did.{' '}
                    <Cite id="F08-64">our profiling report, camera render table</Cite>{' '}
                    <Cite id="F06-61">MuJoCo docs, rendering</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            No EC2 instance was measured, and no real policy. Nothing ran on more than one core, so the cards say
            nothing about scaling or about cores competing for the same memory. Each figure is one run: two passes
            exist, built from different versions of the benchmark, so they are two single runs and no repeat of one
            program. The figures printed here are from the second pass; read every one as &quot;one run per pass,
            two passes&quot;.{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Read nine filled-in cards aloud, then tie one of them to a machine part with arithmetic you can redo">
            The cards
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each card follows the sample card of section 21. A slot is one chance per cycle for the core to start a
            piece of work, and the bar splits all slots four ways: retiring (work that finished), bad speculation
            (work thrown away after a wrong guess), front-end bound (empty because no instruction was ready) and
            back-end bound (empty because the executing half of the core could not take more). Memory stall is a
            separate counter: the share of cycles the back end waited for data from memory. Columns are workloads;
            rows are core types.
          </Box>
          <ColumnLayout columns={3}>
            <Figure
              cites="F08-61 F08-68 F08-73"
              caption={
                <>
                  <strong>Physics step.</strong> Our measurement, single run per card (one run per pass, two passes).
                  Stand-in: a MuJoCo humanoid, not the arm.
                </>
              }
            >
              <PhysicsCards />
            </Figure>
            <Figure
              cites="F08-62 F08-68 F08-73"
              caption={
                <>
                  <strong>Policy inference.</strong> Our measurement, single run per card (one run per pass, two
                  passes). Stand-in: six dense layers on the CPU, not a real policy.
                </>
              }
            >
              <PolicyCards />
            </Figure>
            <Figure
              cites="F08-64 F08-68 F08-73"
              caption={
                <>
                  <strong>Camera render.</strong> Our measurement, single run per card (one run per pass, two
                  passes). Stand-in: a MuJoCo offscreen render; the counters cover the CPU thread only.
                </>
              }
            >
              <RenderCards />
            </Figure>
          </ColumnLayout>
          <Box variant="p">
            <strong>Physics step, read aloud.</strong> Retiring is the largest category on all three cores (43.2%,
            61.0% and 45.7%), and memory stall stays at or under 2.2% of cycles: this workload lives inside the core.
            What is lost differs by core. The Jetson core loses 31.0% of its slots to the front end, the half
            that fetches and decodes instructions. The X925 loses 36.5% to the back end with 0.4% of cycles stalled on memory, so
            our reading is that it waits on the arithmetic itself. The part this card points at is the CPU core, at 14,507 steps per second on the Jetson core and 57,240 on
            the X925. Our measurement, single run. <Cite id="F08-61">our profiling report, physics step table</Cite>
          </Box>
          <Box variant="p">
            <strong>Policy stand-in, read aloud.</strong> The Jetson core spends 63.9% of its slots back-end bound
            and 62.3% of its cycles stalled on memory: it is waiting for the weights to arrive. On the Spark the
            memory stall is 22.8% of cycles on the A725 and 22.4% on the X925, and the throughput is 1,404 and 1,968
            inferences per second against the Jetson core&apos;s 390. Our measurement, single run.{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>
          </Box>
          <Box variant="p">
            <strong>Camera render, read aloud, with care.</strong> On the X925, 69.2% of slots are back-end bound
            with only 3.4% of cycles in memory stall. The run did not establish how much of each frame the GPU drew,
            a CPU thread that waits for the GPU can show up as back-end bound, and the top-down split names the
            bottleneck only when the workload is bound by the CPU. This card gives frame rates for this program
            (209, 937 and 1,191 frames per second) and cannot compare rendering hardware. Our
            measurement, single run. <Cite id="F08-64">our profiling report, camera render table</Cite>{' '}
            <Cite id="F08-9">Linux v7.3, perf stat documentation</Cite>
          </Box>

          <Box variant="h3">What each core can do at best</Box>
          <Box variant="p">
            A workload card means more beside the core&apos;s own ceilings: arithmetic, memory bandwidth (bytes per
            second that can stream in), memory latency (the time one isolated read takes) and the slot count.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={TABLE}>
              <thead>
                <tr>
                  <th style={TH}>Capability</th>
                  <th style={TH}>How it was measured</th>
                  <th style={TH}>Jetson, Cortex-A78AE</th>
                  <th style={TH}>Spark, Cortex-A725</th>
                  <th style={TH}>Spark, Cortex-X925</th>
                  <th style={TH}>Source (our measurement, single run)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Floating-point rate, in billions of fused multiply-adds per second</td>
                  <td style={TD}>24 independent chains of a x b + c held in registers, so nothing waits on memory</td>
                  <td style={TD}>3.411</td>
                  <td style={TD}>5.595</td>
                  <td style={TD}>22.242</td>
                  <td style={TD}>
                    <Cite id="F08-65">our profiling report, FMA row</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Memory bandwidth from one core, in GB/s</td>
                  <td style={TD}>A triad loop that streams through arrays larger than the caches</td>
                  <td style={TD}>11.71</td>
                  <td style={TD}>43.95</td>
                  <td style={TD}>44.38</td>
                  <td style={TD}>
                    <Cite id="F08-66">our profiling report, triad row</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Memory latency, in ns per load</td>
                  <td style={TD}>A pointer chase: each read gives the address of the next, so one read is in flight at a time</td>
                  <td style={TD}>291.58</td>
                  <td style={TD}>144.92</td>
                  <td style={TD}>123.96</td>
                  <td style={TD}>
                    <Cite id="F08-67">our profiling report, latency row</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Slots per cycle</td>
                  <td style={TD}>Read from the operating system on the Spark; derived from the counters on the Jetson</td>
                  <td style={TD}>6</td>
                  <td style={TD}>5</td>
                  <td style={TD}>10</td>
                  <td style={TD}>
                    <Cite id="F08-68">our profiling report, slots self check</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            In the bandwidth row the Spark&apos;s two core types reach the same figure, 43.95 and 44.38 GB/s, although
            one has twice the slots of the other: the memory sets that number. Our measurement, single run.{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>
          </Box>

          <Box variant="h3">The worked reading: why the policy stand-in is memory-bound on the Jetson</Box>
          <Box variant="p">
            A card names a saturated part most convincingly when two readings agree. The counters are one. The other
            is demand against supply: the bytes one unit of work must pull from memory, times the units per second
            achieved, compared with what the memory can deliver to that core.
          </Box>
          <Formula
            name="Memory demand, in bytes per second"
            tex={String.raw`\small \begin{aligned} &\text{demand} = \\ &\quad \text{bytes read per unit of work} \\ &\quad \times\ \text{units of work per second} \end{aligned}`}
            source={<Cite id="F08-63">our arithmetic on the policy stand-in</Cite>}
          />
          <ul style={LIST}>
            <li>
              Bytes per unit. The stand-in holds six weight matrices of 1024 by 1024 float32 values at 4 bytes each:
              6 x 1024 x 1024 x 4 bytes = 25.2 MB. That is larger than any cache on either machine, and every
              inference reads all of it. <Cite id="F08-63">our arithmetic on the policy stand-in</Cite>
            </li>
            <li>
              Units per second. The Jetson core achieved 390 inferences per second, so the demand is 390 x 25.2 MB =
              9.8 GB/s. <Cite id="F08-63">our arithmetic on the policy stand-in</Cite>
            </li>
            <li>
              Supply. The same core&apos;s measured memory limits are 9.25 GB/s on a plain read loop and 11.71 GB/s
              on the triad. <Cite id="F08-63">our arithmetic on the policy stand-in</Cite>
            </li>
          </ul>
          <Box variant="p">
            Demand sits at supply: 9.8 GB/s wanted, 9.25 to 11.71 GB/s available. The counters say the same thing
            from the other side, with 63.9% of slots back-end bound and 62.3% of cycles stalled on memory. On this core, for this program, memory bandwidth is the saturated part. Our measurement, single run.{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-63">our arithmetic on the policy stand-in</Cite>
          </Box>
          <Box variant="p">
            The same arithmetic on the Spark gives 35.3 GB/s on the A725 and 49.5 GB/s on the X925, beside a triad
            figure of 43.95 and 44.38 GB/s. The X925 result is above its own triad figure: one single-run microbenchmark is a guide to the ceiling more than the ceiling itself. The caches and
            memory behind these numbers are covered in the{' '}
            <Link href="../silicon-memory-inference/">Silicon, Memory &amp; Inference dive</Link>.{' '}
            <Cite id="F08-63">our arithmetic on the policy stand-in</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="See what a per-kernel GPU profile reports, and why two durations from two machines cannot go in one chart">
            The GPU kernels
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The GPU side of today&apos;s cards is one kernel per machine; a kernel, in GPU work, is one function
            launched on the GPU. We multiplied two square float32 matrices and let Nsight Compute profile the kernel
            that ran. It reports two throughput figures, each a share of the GPU&apos;s maximum: one for
            compute in the SM (streaming multiprocessor, the GPU&apos;s unit of compute cores) and one for memory.{' '}
            <Cite id="F08-34">Nsight Compute profiling guide, sections</Cite>
          </Box>
          <Figure
            cites="F08-71 F08-72"
            caption={
              <>
                Our measurement: one kernel, one pass per machine, not tuned. The two columns differ in matrix size,
                GPU clock and profiler version, so read each column by itself.{' '}
                <Cite id="F08-71">our DGX Spark card, GPU kernel</Cite>{' '}
                <Cite id="F08-72">our Jetson card, GPU kernel</Cite>
              </>
            }
          >
            <table style={{ ...TABLE, minWidth: 560 }}>
              <thead>
                <tr>
                  <th style={TH}>One matrix multiply</th>
                  <th style={TH}>DGX Spark (GB10 GPU)</th>
                  <th style={TH}>Jetson Orin Nano Super</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Matrix size, float32</td>
                  <td style={TD}>4096x4096</td>
                  <td style={TD}>2048x2048</td>
                </tr>
                <tr>
                  <td style={TD}>Kernel that ran</td>
                  <td style={TD}>
                    <code>cutlass_80_simt_sgemm_128x128_8x4_nn_align1</code>
                  </td>
                  <td style={TD}>
                    <code>ampere_sgemm_128x128_nn</code>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Compute (SM) throughput</td>
                  <td style={TD}>70.49%</td>
                  <td style={TD}>74.49%</td>
                </tr>
                <tr>
                  <td style={TD}>Memory throughput</td>
                  <td style={TD}>50.47%</td>
                  <td style={TD}>48.27%</td>
                </tr>
                <tr>
                  <td style={TD}>SM clock during the profiled run</td>
                  <td style={TD}>2.13 GHz</td>
                  <td style={TD}>306 MHz</td>
                </tr>
                <tr>
                  <td style={TD}>Duration</td>
                  <td style={TD}>8.35 ms</td>
                  <td style={TD}>42.31 ms</td>
                </tr>
                <tr>
                  <td style={TD}>Profiler</td>
                  <td style={TD}>Nsight Compute 2025.3.1</td>
                  <td style={TD}>Nsight Compute 2024.3.1</td>
                </tr>
              </tbody>
            </table>
          </Figure>
          <Box variant="p">
            Read down a column and both machines show the same picture: compute throughput near three quarters of the
            maximum, memory throughput near half. Our reading
            of the Spark&apos;s kernel name is that &quot;simt&quot; marks the general floating-point path, so this
            run says nothing about tensor cores, the GPU units built for the matrix arithmetic of neural networks.
            Our measurement, single run. <Cite id="F08-71">our DGX Spark card, GPU kernel</Cite>
          </Box>
          <Box variant="p">
            The Duration row does not compare the machines. The Spark multiplied 4096x4096 matrices in 8.35 ms and the
            Jetson 2048x2048 matrices in 42.31 ms, so the work differs. The Jetson&apos;s SM clock was 306 MHz
            during the profiled run against the Spark&apos;s 2.13 GHz: on a Jetson the GPU clock scales with load.
            Record the clock with every GPU profile on a Jetson, or pin it. Our measurement, single run. <Cite id="F08-72">our Jetson card, GPU kernel</Cite>{' '}
            <Cite id="F08-71">our DGX Spark card, GPU kernel</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Know which figures above you can lean on, which carry a known bias, and which were left off the page">
            Limits of these cards
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The cards are sound enough to teach the reading and too thin to rank machines. Five limits say why.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>The front-end and bad-speculation figures carry a known bias.</strong> After a wrong branch guess a core spends cycles recovering, with slots empty. The formula behind these
              cards, the generic Arm one that Linux perf ships, counts those slots as front-end bound. <Cite id="F08-20">Linux v7.3, generic Arm top-down metrics</Cite> Arm&apos;s own formulas for
              the Cortex-X925 and Cortex-A725 subtract the recovery cycles from front-end bound and add them to bad
              speculation. <Cite id="F08-19">Arm telemetry file for the Cortex-X925</Cite> Our runs did not record
              that event, so front-end bound reads too high and bad speculation too low by the same unknown amount;
              back-end bound and retiring are the same under both formulas.{' '}
              <Cite id="F08-22">our comparison of the run script with Arm&apos;s formulas</Cite>
            </li>
            <li>
              <strong>The size of that bias, as an illustration.</strong> Borrowing the fixed cost of 4 cycles per
              mispredicted branch that Arm uses for two other cores, the physics step on the X925 would move 1.6
              points from front end (12.2% to about 10.6%) to bad speculation (5.6% to about 7.2%). The branch
              microbenchmark would move 13.2 points, and the policy and memory programs under 0.5 points. The constant is borrowed, and the count used is retired mispredicted branches where Arm&apos;s formula counts all
              mispredicted branches, so this shows which cards are sensitive (code full of branches) and does not
              replace the missing event.{' '}
              <Cite id="F08-23">our arithmetic on the missing flush correction</Cite>
            </li>
            <li>
              <strong>The percentages match the raw counters, and adding to 100% proves nothing.</strong>{' '}
              Recomputing from the raw counter files gives 36.54% where the report prints 36.5% and 26.81% where it
              prints 26.8%. <Cite id="F08-70">our recomputation from the raw counters</Cite> The four categories
              add to exactly 100% on every card because the formula makes them do so.{' '}
              <Cite id="F08-69">our check of the counter identity</Cite>
            </li>
            <li>
              <strong>The two machines ran different software.</strong> MuJoCo 4.0.1 against 3.17.0, two Nsight
              Compute versions, and a slot count that the Spark&apos;s operating system reports (10 and 5, equal to
              Arm&apos;s published values) while the Jetson&apos;s reports 0. The Jetson&apos;s 6 was derived from
              the same counters, and no Arm file for the Cortex-A78AE was located in this research to check it
              against. A gap between a Jetson card and a Spark card is a statement about these programs, these versions and
              one run. <Cite id="F08-73">limits of our measurements</Cite>{' '}
              <Cite id="F08-68">our profiling report, slots self check</Cite>{' '}
              <Cite id="F08-16">Arm telemetry files, slots per core</Cite>
            </li>
            <li>
              <strong>Only what reproduced is printed.</strong> Across the two passes the three workload cards
              reproduce: throughput within 2.5% and every category within <Derived>0.7</Derived> points. The front-end against
              back-end split of two memory microbenchmarks, the triad and a memory-write loop, does not reproduce
              at the same throughput. Their throughput is printed above; their stall split is not.{' '}
              <Cite id="F08-73">limits of our measurements</Cite>
            </li>
          </ul>
          <Box variant="p">
            One more: the slot split and the memory stall share come from two separate executions of the same
            program, so a ratio that mixes them compares two runs.{' '}
            <Cite id="F08-60">our run script and experiment notes</Cite>
          </Box>
          <ExpandableSection headerText="Evidence: the split that did not reproduce, and the report checked against the counters">
            <SpaceBetween size="s">
              <Box variant="p">
                The triad on the Jetson core shows the disagreement. In pass 1 it ran at 11.66 GB/s with 5.9% front
                end and 76.9% back end. In pass 2 it ran at 11.71 GB/s with 78.1% front end and 7.9% back end. The throughput agrees and the split flips. Our measurement, one run per pass.{' '}
                <Cite id="F08-73">limits of our measurements</Cite>
              </Box>
              <Box variant="p">
                The two recomputed figures: on the X925 physics step, back-end bound is 72,922,813,391 stalled
                back-end slots over 19,958,256,358 cycles x 10 slots, which is 36.54%. On the Jetson policy
                stand-in, retiring is the share of slots not stalled, 0.27131, times the share of started work that
                finished, 0.98809, which is 26.81%. A script repeated this for all 51 rows of the second pass.{' '}
                <Cite id="F08-70">our recomputation from the raw counters</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="See which blocks of results are still to come, so you know what this page can answer today and what it will answer later">
            What the profiling project will add
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A separate profiling project owns the measurements this dive still needs: one card per phase of the
            arm&apos;s loop, each with a unit of work, a machine list and the counters to capture.{' '}
            <Cite id="F08-74">our list of measurements still owed</Cite> Until the four blocks below are filled,
            nothing on this page describes an EC2 instance or a real policy.
          </Box>
          <Placeholder
            what={
              <>
                cards for the arm&apos;s real workloads on the Jetson Orin Nano and the DGX Spark, in place of the
                stand-ins: recording and encoding two camera streams, decoding the episodes, the {ARM} MuJoCo step,
                fine-tuning ACT (Action Chunking with Transformers, the imitation policy of section 4) and SmolVLA
                (the small vision-language-action model of section 5), training LeWorldModel (the latent world model
                of section 7), and ACT or SmolVLA inference at the arm&apos;s control rate. Each card carries its unit of work, such as environment steps per second or actions per second with p50
                and p99 latency per call.
              </>
            }
            source={<>{PROJECT}, on the same two edge machines; not yet run.</>}
          />
          <Placeholder
            what={
              <>
                the same workloads on Amazon EC2: Graviton sizes (c9g, c8g) for decode and CPU physics; G-family
                sizes (g6, g6e, g7, g7e) for decode with embedding, augmentation, simulation, training and
                evaluation; and one P5 or P6 size for training. First, a capability check: the PMU events that <code>perf list</code> shows on c9g.2xlarge, c9g.12xlarge,
                g6e.xlarge, g6e.48xlarge, g7.48xlarge and p5.48xlarge, which decides where a top-down card can be
                made at all.
              </>
            }
            source={<>{PROJECT}, run on EC2; not yet run.</>}
          />
          <Placeholder
            what={
              <>
                GPU counters for each workload, which today&apos;s cards lack: activity of the compute cores, the
                tensor cores, the memory, the video decoder and the video encoder, with power, sampled once per
                second by DCGM (Data Center GPU Manager, NVIDIA&apos;s GPU telemetry tool) or by tegrastats on the
                Jetson; Nsight Compute per-kernel profiles of the two or three hottest kernels; and an Nsight Systems
                timeline that shows the share of time the GPU waits for data between batches.
              </>
            }
            source={<>{PROJECT}, run on EC2 and on the two edge machines; not yet run.</>}
          />
          <Placeholder
            what={
              <>
                repeats and corrections of today&apos;s cards, so each figure carries a run count above one: the
                triad and memory-write microbenchmarks repeated with one unchanged program over several runs, with
                throughput and all four categories per run and their spread; the workload cards captured again with
                the flush-recovery event, so front-end bound and bad speculation follow Arm&apos;s formula; and the
                render stand-in run with software rendering against EGL, with GPU activity sampled, to establish the
                GPU&apos;s share of a frame.
              </>
            }
            source={<>{PROJECT}, on the same two edge machines; not yet run.</>}
          />
          <Box variant="p">
            Today, take the method and leave the ranking. Run your real workload on one pinned core under{' '}
            <code>perf stat</code> with the slot events of section 21, note the throughput and the four shares, then
            do the demand-against-supply arithmetic for the part the card points at. If the two readings agree, as
            9.8 GB/s of demand against 9.25 to 11.71 GB/s of supply did for the Jetson core, you have found the
            saturated part.{' '}
            <Cite id="F08-63">our arithmetic on the policy stand-in</Cite> Section 23, Price-Performance and Latency,
            turns the throughputs on these cards into units of work that can be compared across machines.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
