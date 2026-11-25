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
import { Placeholder, Snippet } from '../components/Blocks';
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

/** The six slot events, counted as one group per core type (adapted from our run script). */
const PERF_SNIPPET = `PMU=armv8_pmuv3_1   # the Cortex-X925's event source on a DGX Spark
sudo taskset -c "$CPU" perf stat -x, \\
  -e $PMU/stall_slot/,$PMU/stall_slot_frontend/,$PMU/stall_slot_backend/,$PMU/op_retired/,$PMU/op_spec/,$PMU/cpu_cycles/ \\
  -- ./your_program`;

export function Measurements() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Find a program's bottleneck before you trust a speed-up: the large core of a desktop machine beats a robot computer's core 6.5 times on scalar arithmetic, 3.8 times on streaming memory and 2.4 times on a single memory read (our single runs, results read 2026-11-20)"
          >
            22. Our Measurements: The Speed-Up Depends on the Part That Runs Out First
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            How much faster a desktop machine runs a program than a robot computer depends on its bottleneck, the
            part of the machine it runs out of first. One Cortex-X925 core of an NVIDIA DGX Spark, a desktop machine, does scalar multiply-adds
            (one number per instruction, vector units unused) 6.5 times as fast as one Cortex-A78AE core of an NVIDIA
            Jetson Orin Nano Super, a small robot computer. It streams data from memory 3.8 times as fast, and a
            single read from memory comes back 2.4 times sooner. A program gains only the ratio of the part that
            limits it: the core&apos;s own execution, the rate memory streams at, or the time one read takes.{' '}
            <Cite id="F08-65">our profiling report, FMA row</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>{' '}
            <Cite id="F08-67">our profiling report, latency row</Cite>
          </Box>
          <Box variant="p">
            A simulated humanoid shows how far one ratio can mislead. In MuJoCo, the physics engine of section 12, one
            Jetson core stepped it 14,507 times a second and one Spark X925 core 57,240 times, under different MuJoCo
            versions. The clean comparison is inside the Spark, which also carries smaller Cortex-A725 cores: one
            version, one memory. There the X925 stepped <Derived>2.0</Derived> times as fast as the A725 while doing
            multiply-adds <Derived>4.0</Derived> times as fast. The physics step is limited by the core&apos;s
            execution, and the core&apos;s arithmetic ratio still overstates its speed-up twofold.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-65">our profiling report, FMA row</Cite>{' '}
            <Cite id="F07-47">DGX Spark user guide, hardware</Cite>
          </Box>
          <Box variant="p">
            Every CPU figure here is a single run of one program pinned to one core: a benchmark loop, or one of
            three stand-ins run in place of the arm&apos;s real workloads. The Jetson ran MuJoCo 3.17.0 and the Spark
            4.0.1, so a physics ratio between the two machines mixes hardware with software. That is enough to show
            the method and the size of each gap, and too little to choose an EC2 instance. The method carries to your own job: find the bottleneck in a core&apos;s counters, count
            what one unit of work asks of it, and compare machines on that part.{' '}
            <Cite id="F08-73">limits of our measurements</Cite>{' '}
            <Cite id="F08-60">our run script and experiment notes</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Tell from a core's counters whether a program waits on the core, on memory, or on work the CPU cannot see"
          >
            Physics runs out of the core, the policy stand-in out of memory on the Jetson
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The verdicts come from top-down analysis, the method that finds a core&apos;s bottleneck in its event
            counters. The counters sit in the core&apos;s PMU (performance monitoring unit), and <code>perf stat</code>,
            the Linux tool, reads them around one run of a program. <Cite id="F08-9">Linux v7.3, perf stat documentation</Cite>{' '}
            <Cite id="F08-60">our run script and experiment notes</Cite>
          </Box>
          <Box variant="p">
            Top-down analysis counts slots. A slot is one chance, in one clock cycle, for the core to start a
            micro-operation, one of the small steps an instruction is split into. A core&apos;s width is its slots
            per cycle: 6 on the Jetson&apos;s Cortex-A78AE, and on the Spark, which carries two kinds of core, 10 on
            the wide Cortex-X925 and 5 on the narrow Cortex-A725.{' '}
            <Cite id="F08-14">Arm Neoverse V1 performance analysis white paper, section 3.2</Cite>{' '}
            <Cite id="F08-68">our profiling report, slots self check</Cite>{' '}
            <Cite id="F07-47">DGX Spark user guide, hardware</Cite>
          </Box>
          <Box variant="p">
            Each slot lands in one of four shares. Retiring is a slot that started work the program kept. Front-end
            bound is a slot left empty because the half of the core that fetches and decodes instructions had nothing
            ready. Back-end bound is a slot left empty because the half that executes them could take no more.{' '}
            <Cite id="F08-3">Intel VTune cookbook, the classification paragraphs</Cite>
          </Box>
          <Box variant="p">
            The fourth share comes from speculation. A core does not wait to learn which way a branch goes: it
            predicts, and starts the instructions beyond it. On a wrong prediction it flushes that work and restarts
            on the right path, and bad speculation is the share of slots lost to the discarded work and the restart.
            One more figure sits outside the four shares, memory stall: the share of cycles the back end spent
            waiting for data from memory. A card is the record of one program on one core: its rate, its four shares
            and its memory stall. <Cite id="F08-4">Intel TMA metrics file, row Frontend_Bound</Cite>{' '}
            <Cite id="F08-15">Arm Cortex-X925 specification file, events</Cite>{' '}
            <Cite id="F08-7">Intel TMA metrics file, row Bad_Speculation</Cite>{' '}
            <Cite id="F08-60">our run script and experiment notes</Cite>
          </Box>
          <Box variant="p">
            The 6.5, 3.8 and 2.4 come from microbenchmarks, small loops that each load one part of a core at its
            best. Arithmetic is the rate of fused multiply-adds, single instructions that compute a x b + c,
            over 24 independent chains held in registers, so nothing waits on memory or on another chain. The chains
            are scalar, so the figure leaves out the vector units (NEON and SVE, Arm&apos;s instructions that work on
            several numbers at once). Memory bandwidth is the rate of the triad, a loop that streams arrays larger
            than the caches.{' '}
            <Cite id="F08-65">our profiling report, FMA row</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>{' '}
            <Cite id="F08-67">our profiling report, latency row</Cite>
          </Box>
          <Box variant="p">
            Memory latency comes from a pointer chase, in which each read supplies the address of the next, so one
            read is in flight at a time and each pays the full trip to memory. The reads land at random over a large
            area, so the figure also carries misses in the TLB (translation lookaside buffer, the core&apos;s cache of
            address translations), at whatever page size the system used. The{' '}
            <Link href="../silicon-memory-inference/">Silicon, Memory &amp; Inference dive</Link> builds the memory
            hierarchy behind both memory figures. <Cite id="F08-67">our profiling report, latency row</Cite>
          </Box>
          <Box variant="p">
            Each stand-in replaces one job around the arm, the {ARM}, a six-motor desktop arm whose task is to{' '}
            {TASK_STORY}. A verdict carries over to that job only as far as the job has the same bottleneck.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={TABLE}>
              <thead>
                <tr>
                  <th style={TH}>The arm&apos;s job</th>
                  <th style={TH}>The stand-in we ran</th>
                  <th style={TH}>Its bottleneck</th>
                  <th style={TH}>What it leaves out</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Physics simulation of the arm, one scene on one core (section 12)</td>
                  <td style={TD}>One MuJoCo step of a humanoid model with random controls, in a loop</td>
                  <td style={TD}>The core, on all three cores</td>
                  <td style={TD}>
                    The {ARM} model, its block and its contacts.{' '}
                    <Cite id="F08-61">our profiling report, physics step table</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Running the policy, the trained model that picks the arm&apos;s actions (section 17)</td>
                  <td style={TD}>
                    Six 1024x1024 float32 matrix-vector products, each followed by ReLU (which sets negative values to
                    zero), in NumPy on one core; each pass reads all 25.2 MB of weights, more than any cache on either
                    machine
                  </td>
                  <td style={TD}>Memory bandwidth on the Jetson; not settled on the Spark</td>
                  <td style={TD}>
                    Convolutions, attention and the GPU: it stands for a small dense model run one input at a time on
                    a CPU core, where the arm&apos;s policy runs on its GPU.{' '}
                    <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
                    <Cite id="F08-63">our arithmetic on the policy stand-in</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>A simulated camera (section 13)</td>
                  <td style={TD}>
                    A MuJoCo offscreen render at 640x480 through EGL, MuJoCo&apos;s interface for hardware-accelerated
                    rendering with no display, with one physics step per frame
                  </td>
                  <td style={TD}>
                    Not known: the counters see only the CPU thread that drives MuJoCo&apos;s GPU rasteriser
                  </td>
                  <td style={TD}>
                    Ray tracing, and any record of how much of each frame the GPU did.{' '}
                    <Cite id="F08-64">our profiling report, camera render table</Cite>{' '}
                    <Cite id="F06-61">MuJoCo docs, rendering</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ColumnLayout columns={3}>
            <Figure
              cites="F08-61 F08-68 F08-73"
              caption={
                <>
                  <strong>Physics step.</strong> Retiring leads on every core and memory stall stays at or under 2.2%
                  of cycles. The X925 loses most of its other slots in the back end, the A78AE in the front end.
                </>
              }
            >
              <PhysicsCards />
            </Figure>
            <Figure
              cites="F08-62 F08-68 F08-73"
              caption={
                <>
                  <strong>Policy stand-in.</strong> The Jetson core stalls on memory for 62.3% of its cycles, the
                  Spark&apos;s cores for 22.8% and 22.4%, so memory limits the Jetson far more than either Spark core.
                </>
              }
            >
              <PolicyCards />
            </Figure>
            <Figure
              cites="F08-64 F08-68 F08-73"
              caption={
                <>
                  <strong>Camera render.</strong> The counters cover the CPU thread only, so a large back-end share here
                  can be time spent waiting on the GPU.
                </>
              }
            >
              <RenderCards />
            </Figure>
          </ColumnLayout>

          <Box variant="h3">The physics step: the core sets the rate</Box>
          <Box variant="p">
            Retiring is the largest share on all three cores (43.2%, 61.0% and 45.7%), and at most 2.2% of cycles
            wait on memory. On the A78AE a low memory stall alone does not clear a program: the triad, which streams
            memory by construction, read only 2.6% in one of two runs of the benchmark set. Two other counts do. On
            the Jetson the step refills its L2 cache, the core&apos;s second-level cache, from further out 4.57 times
            per thousand instructions, against 41.82 for the policy stand-in, which does wait on memory.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Box variant="p">
            Inside the Spark the X925 stepped <Derived>2.0</Derived> times as fast as the A725 from the same memory,
            where the triad gained only <Derived>1.0</Derived> times. More memory bandwidth would not raise this
            rate, so compare machines core against core.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>
          </Box>
          <Box variant="p">
            The cores lose their other slots in different places. The X925 loses 36.5% to the back end with 0.4% of
            cycles on memory, which points at its execution units. The A78AE loses 31.0% to the front end, slots the
            fetch and decode half left empty, so more execution units would not recover them. The formula behind
            these cards also books the restart after a wrong prediction as front-end bound, and how much of the 31.0%
            that is cannot be checked: Arm&apos;s telemetry files, the event and formula definitions Arm publishes for
            each core, hold no corrected formula for the A78AE. <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-4">Intel TMA metrics file, row Frontend_Bound</Cite>{' '}
            <Cite id="F08-16">Arm telemetry files, slots per core</Cite>{' '}
            <Cite id="F08-22">our comparison of the run script with Arm&apos;s formulas</Cite>
          </Box>

          <Box variant="h3">The policy stand-in: memory sets the rate on the Jetson</Box>
          <Box variant="p">
            The Jetson core spends 63.9% of its slots back-end bound and 62.3% of its cycles stalled on memory: it is
            waiting for weights. A count gives the same answer from the other side. Each pass reads all six matrices,
            6 x 1024 x 1024 x 4 bytes = 25.2 MB, so 390 passes a second ask memory for 390 x 25.2 MB = 9.8 GB/s,{' '}
            <Derived>84%</Derived> of the 11.71 GB/s the same core reached on the triad. With demand that close to the
            triad figure and most cycles waiting on memory, more arithmetic would buy nothing. Where both hold, as
            here, compare machines by the GB/s one core streams.{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-63">our arithmetic on the policy stand-in</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>
          </Box>
          <Box variant="p">
            On the Spark the counters do not name one bottleneck. Demand points at memory: the A725 asks for 35.3
            GB/s, <Derived>80%</Derived> of its 43.95 GB/s triad figure, and the X925 for 49.5 GB/s, past the 44.38
            GB/s its triad reached. The stalls point away from it: both cores wait on memory for about a fifth of their
            cycles (22.8% and 22.4%), and the X925 ran the stand-in 1,968 / 1,404 = <Derived>1.4</Derived> times as
            fast as the A725 although the two tie on the triad. Arm&apos;s finer events for these two cores split
            back-end stalls into core and memory causes, and counting <code>STALL_BACKEND_MEMBOUND</code> beside{' '}
            <code>STALL_BACKEND</code> would settle it.{' '}
            <Cite id="F08-63">our arithmetic on the policy stand-in</Cite>{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>{' '}
            <Cite id="F08-24">Arm Cortex-X925 specification file, second-level metrics</Cite>
          </Box>
          <Box variant="p">
            A triad figure is what one loop reached, not the most a core can draw: the X925&apos;s stand-in drew 49.5
            GB/s. The benchmark offers no higher ceiling for that core: its loop that only reads memory was held back by its
            own instructions (28.94 GB/s, 82.9% front-end bound).{' '}
            <Cite id="F08-63">our arithmetic on the policy stand-in</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>
          </Box>

          <Box variant="h3">The camera render: the CPU counters cannot decide it</Box>
          <Box variant="p">
            The CPU counters cannot name this program&apos;s bottleneck. On the X925, 69.2% of slots are back-end
            bound with only 3.4% of cycles stalled on memory, the pattern that pointed at the execution units in the
            physics step, but a thread waiting for the GPU can also read as back-end bound or as idle, and perf&apos;s
            documentation limits the four shares to a workload bound by the CPU. The frame rates, 209, 937 and 1,191 per second, hold for this
            program; to compare rendering hardware, sample the GPU&apos;s activity beside the CPU counters.{' '}
            <Cite id="F08-64">our profiling report, camera render table</Cite>{' '}
            <Cite id="F08-9">Linux v7.3, perf stat documentation</Cite>
          </Box>

          <ExpandableSection headerText="How the slot shares were counted, and how to compute one yourself">
            <SpaceBetween size="s">
              <Box variant="p">
                Each program ran pinned to one core under <code>perf stat</code> in two executions, one per group of
                events. The first counted the six events of the slot split (<code>stall_slot</code>,{' '}
                <code>stall_slot_frontend</code>, <code>stall_slot_backend</code>, <code>op_retired</code>,{' '}
                <code>op_spec</code> and <code>cpu_cycles</code>). The second counted eight detail events, among them
                instructions finished, memory stall and the cache refills. A figure that mixes the two groups, such as
                memory stall set against a slot share, compares two executions. Each core type ran this way for 14
                single-thread microbenchmarks and the three stand-ins.{' '}
                <Cite id="F08-60">our run script and experiment notes</Cite>
              </Box>
              <Box variant="p">
                Check that no count was scaled. When perf cannot schedule every requested event at once it
                multiplexes them: each event runs for part of the measurement and its count is scaled up, and a ratio
                of two events not counted at the same time, such as instructions per cycle, loses accuracy. perf
                prints the share of the measurement each counter was running; below 100% means the count was scaled.{' '}
                <Cite id="F08-87">Linux v7.3, perf stat documentation, multiplexing</Cite>
              </Box>
              <Box variant="p">
                Where no document gives a core&apos;s width, compute it. In every cycle each slot either stalls or
                starts a micro-operation, so <code>stall_slot</code> plus <code>op_spec</code>, divided by{' '}
                <code>cpu_cycles</code>, is the width. The sum returns the 10 and 5 that Arm&apos;s telemetry files give
                for the X925 and the A725, and 6.000 on three programs for the A78AE, a core for which neither the
                Jetson&apos;s Linux kernel nor Arm&apos;s files give a figure.{' '}
                <Cite id="F08-68">our profiling report, slots self check</Cite>{' '}
                <Cite id="F08-16">Arm telemetry files, slots per core</Cite>{' '}
                <Cite id="F08-15">Arm Cortex-X925 specification file, events</Cite>
              </Box>
              <Box variant="p">
                A share is a count over slots, where <i>slots</i> = <code>cpu_cycles</code> x width. The two stall
                shares divide a stall count by the slots; the other two split the slots that started a micro-operation
                by the fraction of those kept, <code>op_retired</code> / <code>op_spec</code>:{' '}
                <Cite id="F08-20">Linux v7.3, generic Arm top-down metrics</Cite>
              </Box>
              <ul style={{ margin: 0 }}>
                <li>
                  back-end bound = <code>stall_slot_backend</code> / <i>slots</i>
                </li>
                <li>
                  front-end bound = <code>stall_slot_frontend</code> / <i>slots</i>
                </li>
                <li>
                  retiring = (1 - <code>stall_slot</code> / <i>slots</i>) x <code>op_retired</code> /{' '}
                  <code>op_spec</code>
                </li>
                <li>
                  bad speculation = (1 - <code>stall_slot</code> / <i>slots</i>) x (1 - <code>op_retired</code> /{' '}
                  <code>op_spec</code>)
                </li>
              </ul>
              <Box variant="p">
                The X925&apos;s physics step had 72,922,813,391 back-end stalled slots over 19,958,256,358 cycles x 10
                slots, which is 36.54%. On the Jetson&apos;s policy card <Derived>27.1%</Derived> of slots started a
                micro-operation and <Derived>98.8%</Derived> of those were kept, so retiring is 26.8%.{' '}
                <Cite id="F08-70">our recomputation from the raw counters</Cite>{' '}
                <Cite id="F08-62">our profiling report, policy inference table</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Placeholder
            what={
              <>
                cards for the arm&apos;s real workloads on the Jetson Orin Nano Super and the DGX Spark, in place of
                the stand-ins: recording and encoding two camera streams, decoding the episodes, the {ARM} MuJoCo
                step, fine-tuning ACT (Action Chunking with Transformers, the imitation policy of section 4) and
                SmolVLA (the small vision-language-action model of section 5), training LeWorldModel (the latent world
                model of section 7), and ACT or SmolVLA inference at the arm&apos;s control rate. Each card carries its
                unit of work, such as environment steps per second, or actions per second with p50 and p99 latency per
                call (the median, and the time only one call in a hundred exceeds).
              </>
            }
            source={<>{PROJECT}, on the same two machines; not yet run.</>}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find which measured ratio carries over to your program, and what to measure when none does"
          >
            A ratio predicts a program only through its bottleneck
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A program&apos;s ratio between two machines means something when the same program, at the same version,
            has the same bottleneck on both.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ ...TABLE, minWidth: 760 }}>
              <thead>
                <tr>
                  <th style={TH}>Part, or program, on one core</th>
                  <th style={TH}>Jetson, Cortex-A78AE</th>
                  <th style={TH}>Spark, Cortex-A725</th>
                  <th style={TH}>Spark, Cortex-X925</th>
                  <th style={TH}>X925 against A78AE, times</th>
                  <th style={TH}>X925 against A725, times</th>
                  <th style={TH}>Source (our measurement, single run)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Arithmetic, billion fused multiply-adds per second</td>
                  <td style={TD}>3.411</td>
                  <td style={TD}>5.595</td>
                  <td style={TD}>22.242</td>
                  <td style={TD}>6.5</td>
                  <td style={TD}>
                    <Derived>4.0</Derived>
                  </td>
                  <td style={TD}>
                    <Cite id="F08-65">our profiling report, FMA row</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Memory bandwidth, GB/s on the triad</td>
                  <td style={TD}>11.71</td>
                  <td style={TD}>43.95</td>
                  <td style={TD}>44.38</td>
                  <td style={TD}>3.8</td>
                  <td style={TD}>
                    <Derived>1.0</Derived>
                  </td>
                  <td style={TD}>
                    <Cite id="F08-66">our profiling report, triad row</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Memory latency, ns per load (lower is faster)</td>
                  <td style={TD}>291.58</td>
                  <td style={TD}>144.92</td>
                  <td style={TD}>123.96</td>
                  <td style={TD}>2.4</td>
                  <td style={TD}>
                    <Derived>1.2</Derived>
                  </td>
                  <td style={TD}>
                    <Cite id="F08-67">our profiling report, latency row</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Physics step, steps per second</td>
                  <td style={TD}>14,507</td>
                  <td style={TD}>28,662</td>
                  <td style={TD}>57,240</td>
                  <td style={TD}>
                    <Derived>3.9</Derived>
                  </td>
                  <td style={TD}>
                    <Derived>2.0</Derived>
                  </td>
                  <td style={TD}>
                    <Cite id="F08-61">our profiling report, physics step table</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Policy stand-in, inferences per second</td>
                  <td style={TD}>390</td>
                  <td style={TD}>1,404</td>
                  <td style={TD}>1,968</td>
                  <td style={TD}>
                    <Derived>5.0</Derived>
                  </td>
                  <td style={TD}>
                    <Derived>1.4</Derived>
                  </td>
                  <td style={TD}>
                    <Cite id="F08-62">our profiling report, policy inference table</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Camera render, frames per second</td>
                  <td style={TD}>209</td>
                  <td style={TD}>937</td>
                  <td style={TD}>1,191</td>
                  <td style={TD}>
                    <Derived>5.7</Derived>
                  </td>
                  <td style={TD}>
                    <Derived>1.3</Derived>
                  </td>
                  <td style={TD}>
                    <Cite id="F08-64">our profiling report, camera render table</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Across the Jetson and the Spark none of the three stand-ins passes. The render&apos;s{' '}
            <Derived>5.7</Derived> includes the GPU&apos;s share of each frame, which is unknown. The policy stand-in&apos;s
            bottleneck shifts: the Jetson core drew <Derived>84%</Derived> of its triad figure and the X925 more than
            all of its own, so its 1,968 / 390 = <Derived>5.0</Derived> runs past the streaming ratio of 3.8, and
            memory limits the Jetson&apos;s rate far more than the X925&apos;s (62.3% of cycles stalled on memory
            against 22.4%). <Cite id="F08-64">our profiling report, camera render table</Cite>{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-63">our arithmetic on the policy stand-in</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>
          </Box>
          <Box variant="p">
            The physics step has a core bottleneck on all three cores, but its 57,240 against 14,507 steps per second,{' '}
            <Derived>3.9</Derived> times, spans two MuJoCo versions, and a new version can change the instructions a
            step takes. The counters explain part of that ratio. A core&apos;s steps per second are its instructions
            finished per clock cycle, times its clock rate, divided by the instructions one step takes. The counters
            give instructions per cycle over the whole program, start-up included; taken as the loop&apos;s, they are
            4.37 on the X925 and 2.48 on the A78AE, a factor of <Derived>1.76</Derived>. The
            remaining <Derived>3.9</Derived> / <Derived>1.76</Derived> = <Derived>2.2</Derived> is clock rate and
            instructions per step together. <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-60">our run script and experiment notes</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Box variant="p">
            Inside the Spark the physics step passes the test, one version on one memory with a core bottleneck on
            both cores, and the arithmetic ratio still misses. The X925 stepped 57,240 / 28,662 ={' '}
            <Derived>2.0</Derived> times as fast as the A725, against a multiply-add ratio of 22.242 / 5.595 ={' '}
            <Derived>4.0</Derived>. That loop measures one unit of the core, its floating-point multiply-add pipes fed
            by chains that never wait on each other, and on it the X925 finished 6.18 instructions per cycle. A physics
            step runs MuJoCo&apos;s whole pipeline of kinematics, collision detection, constraint solving and
            integration, and on it the X925 finished 4.37. <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-65">our profiling report, FMA row</Cite>{' '}
            <Cite id="F06-9">MuJoCo docs, Computation chapter, simulation pipeline</Cite>
          </Box>
          <Box variant="p">
            A microbenchmark&apos;s ratio predicts a program only when the program is limited by the unit the loop
            measures. For a program limited by the core as a whole no loop stands in: measure the program on both
            machines, and its instructions per cycle times the clock take the ratio apart.
          </Box>
          <Box variant="p">
            On the physics step the X925 finished 4.37 instructions per cycle against the A725&apos;s 3.01,{' '}
            <Derived>1.45</Derived> times as many though it has twice the slots, because it kept a smaller share of
            them working (45.7% of 10 against 61.0% of 5). If a step takes the same instructions on
            both cores, and the whole-program figures again stand for the loop&apos;s, the remaining{' '}
            <Derived>2.0</Derived> / <Derived>1.45</Derived> = <Derived>1.4</Derived> is the ratio of their clocks.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-68">our profiling report, slots self check</Cite>
          </Box>
          <Box variant="p">
            The policy stand-in&apos;s <Derived>1.4</Derived> on the Spark matches that clock ratio: it came at nearly
            equal instructions per cycle on the two cores (3.07 on the X925, 2.96 on the A725), so it sped up with
            the clock and not with the triad, which tied. That leans the open question of its bottleneck on the Spark
            toward the core. The clock
            ratio itself is inferred, because the cards carry cycle counts and no clock rate: record each core&apos;s
            clock beside its counters.{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>
          </Box>
          <Box variant="p">
            Every ratio here is one core against one core, and the ratio of single cores does not predict the ratio of
            whole machines. NVIDIA gives the Jetson 102 GB/s of memory bandwidth and the Spark 273 GB/s, a ratio of{' '}
            <Derived>2.7</Derived> where one core of each showed 3.8. Each total is shared by all the CPU cores and the
            GPU, and one core streamed 11.71 and 44.38 GB/s of it. Sizing a machine takes cards from several cores
            running at once, and a measure of the GPU&apos;s share of memory, which a counter inside a core cannot see.{' '}
            <Cite id="F07-36">Jetson Orin Nano Super specifications</Cite>{' '}
            <Cite id="F07-47">DGX Spark user guide, hardware</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>{' '}
            <Cite id="F08-41">Intel TMA metrics file, MEM_Bandwidth</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read the two throughput shares Nsight Compute gives for one matrix multiply, and record the GPU clock before you trust a duration from a Jetson"
          >
            One GPU kernel per machine: record the clock with the profile
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each machine&apos;s GPU was profiled on one kernel, one function launched on the GPU: a multiply of two
            square float32 matrices, under Nsight Compute, NVIDIA&apos;s profiler for a single kernel. It reports two throughput figures, each a share of the GPU&apos;s maximum: one for compute
            in the SMs (streaming multiprocessors, the GPU&apos;s processing units) and one for memory. Each figure is
            the highest reading among the counters it summarises, so the Spark&apos;s 70.49% compute says one SM
            counter reached 70.49% of its maximum, a different figure from the share of the GPU&apos;s peak
            floating-point rate the kernel reached. <Cite id="F08-34">Nsight Compute profiling guide, sections</Cite>{' '}
            <Cite id="F08-71">our DGX Spark card, GPU kernel</Cite>
          </Box>
          <Figure
            cites="F08-71 F08-72"
            caption={
              <>
                Our measurement: one kernel, one pass per machine, not tuned. Matrix size, GPU clock and profiler
                version differ between the columns, so the two durations do not compare.{' '}
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
            Neither card records a figure for the tensor cores, the GPU units built for the matrix
            arithmetic of neural networks, so the tensor cores went unmeasured on both machines, and going by its name
            the Spark&apos;s kernel did not use them at all: simt marks the GPU&apos;s general path (single
            instruction, multiple threads). Read the two profiles as one large float32 multiply per GPU, not as the
            load a policy puts on it. <Cite id="F08-71">our DGX Spark card, GPU kernel</Cite>{' '}
            <Cite id="F08-72">our Jetson card, GPU kernel</Cite>{' '}
            <Cite id="F08-42">NVIDIA Tensor Cores page; Nsight Compute pipeline glossary</Cite>
          </Box>
          <Box variant="p">
            The Spark&apos;s multiply ran in PyTorch, where a float32 matrix multiply computes in float32 by default.
            Calling <code>torch.set_float32_matmul_precision(&quot;high&quot;)</code> lets it use TensorFloat32, a
            lower internal precision with a float32 result, where a fast kernel exists. Profile a policy at the
            precision it will run at, since the setting can change which kernel runs.{' '}
            <Cite id="F08-71">our DGX Spark card, GPU kernel</Cite>{' '}
            <Cite id="F08-88">PyTorch v2.15.0, set_float32_matmul_precision</Cite>
          </Box>
          <Box variant="p">
            The two durations measure different work at different clocks. The Spark multiplied 4096x4096 matrices in
            8.35 ms and the Jetson 2048x2048 matrices in 42.31 ms, an eighth of the work. As rates, 2 x 4096^3
            operations in 8.35 ms is about 16,460 billion floating-point operations a second and 2 x 2048^3 in 42.31 ms
            is 406 billion, but the Jetson&apos;s SM clock was 306 MHz during its profile against the Spark&apos;s 2.13
            GHz, and on a Jetson the GPU clock moves with load.{' '}
            <Cite id="F08-71">our DGX Spark card, GPU kernel</Cite>{' '}
            <Cite id="F08-72">our Jetson card, GPU kernel</Cite>
          </Box>
          <Box variant="p">
            Record the clock with every GPU profile on a Jetson (tegrastats, the Jetson&apos;s built-in monitor,
            prints it) or pin it, and compare two GPUs only on the same matrix size under the same profiler version.{' '}
            <Cite id="F08-72">our Jetson card, GPU kernel</Cite>
          </Box>
          <Placeholder
            what={
              <>
                GPU counters for each workload, which the current cards lack: activity of the compute cores, the
                tensor cores, the memory, the video decoder and the video encoder, with power, sampled once per
                second by DCGM (Data Center GPU Manager, NVIDIA&apos;s GPU telemetry tool) or by tegrastats on the
                Jetson; Nsight Compute per-kernel profiles of the two or three hottest kernels; and an Nsight Systems
                timeline that shows the share of time the GPU waits for data between batches.
              </>
            }
            source={<>{PROJECT}, run on EC2 and on the same two machines; not yet run.</>}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Before you act on a card's four shares, run the program twice and run a program whose answer you know"
          >
            A split you can trust repeats and puts known programs in the right share
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The four shares always add to 100% because the formula makes them, so the sum proves nothing about the
            split. A program with a known answer does. The pointer chase, which waits on memory by construction, reads
            97.6% to 99.0% back-end bound on all three cores, and the multiply-add loop, which keeps its data in
            registers, reads 0.0% front-end bound on the X925.{' '}
            <Cite id="F08-69">our check of the counter identity</Cite>{' '}
            <Cite id="F08-67">our profiling report, latency row</Cite>{' '}
            <Cite id="F08-65">our profiling report, FMA row</Cite>
          </Box>
          <Box variant="p">
            Two passes over the whole set, from two builds of the benchmark, agree on the three workloads: throughput
            within 2.5% and every share within <Derived>0.7</Derived> points. On the triad and a memory-write loop they agree on throughput and
            not on the split. <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Box variant="p">
            The Jetson&apos;s triad ran at 11.66 GB/s with 5.9% of slots front-end bound and 76.9%
            back-end bound in pass 1, and at 11.71 GB/s with 78.1% front-end bound, 7.9% back-end bound and 2.6% of
            cycles stalled on memory in pass 2. A split that changes sides at the same speed cannot say where the
            time went, so run a new program at least twice before acting on its shares.{' '}
            <Cite id="F08-73">limits of our measurements</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>
          </Box>
          <Box variant="p">
            The triad&apos;s rate still serves as the memory ruler: the rate is what reproduced across the two
            builds, and on the Spark two cores of different width reached the same figure (43.95 and 44.38 GB/s), so
            the core&apos;s width does not set it. The policy stand-in&apos;s memory verdict on the Jetson rests on
            its own 62.3% memory stall, and the physics verdict on the refill count.{' '}
            <Cite id="F08-73">limits of our measurements</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>
          </Box>
          <Box variant="p">
            One bias is known in advance. Every card uses the generic Arm formula that Linux perf ships, which books
            the cycles a core spends recovering from a flush as front-end bound.{' '}
            <Cite id="F08-20">Linux v7.3, generic Arm top-down metrics</Cite> Arm&apos;s own formulas for the X925 and
            the A725 count those cycles with the event <code>STALL_FRONTEND_FLUSH</code>, subtract them from
            front-end bound and add them to bad speculation.{' '}
            <Cite id="F08-19">Arm telemetry file for the Cortex-X925</Cite> So on those two cores front-end bound reads
            too high and bad speculation too low by the same unknown amount, while back-end bound and retiring are the
            same under both formulas. Read the Spark cores&apos; front-end shares as upper bounds, or add that event
            to the group.{' '}
            <Cite id="F08-22">our comparison of the run script with Arm&apos;s formulas</Cite>
          </Box>
          <ExpandableSection headerText="How far the flush bias can move a card's front-end share">
            <Box variant="p">
              Arm&apos;s formulas for its Neoverse V1 and V2 server cores charge a fixed 4 cycles per mispredicted branch.
              Borrowing that constant for the X925, the physics card would move 1.6 points from front end (12.2% to
              about 10.6%) to bad speculation (5.6% to about 7.2%). The microbenchmark built to exercise branches would move 13.2
              points, and the policy and memory programs under 0.5 points. The constant comes from other cores, so
              these figures rank which cards are sensitive, code full of branches most, and measure nothing.{' '}
              <Cite id="F08-23">our arithmetic on the missing flush correction</Cite>
            </Box>
          </ExpandableSection>
          <Placeholder
            what={
              <>
                repeats and corrections of the current cards, so each figure carries a run count above one: the
                triad and memory-write microbenchmarks repeated with one unchanged program over several runs, with
                throughput and all four categories per run and their spread; the workload cards captured again with
                the flush-recovery event, so front-end bound and bad speculation follow Arm&apos;s formula; and the
                render stand-in run with software rendering against EGL, with GPU activity sampled, to establish the
                GPU&apos;s share of a frame.
              </>
            }
            source={<>{PROJECT}, on the same two machines; not yet run.</>}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Count one program's slots on one core today, and know before you compare two machines whether the comparison will hold"
          >
            Make the card for your own workload
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Pin the program to one core and count the six slot events as one group, the way these runs did. Each core
            type has its own event source: on a DGX Spark, <code>armv8_pmuv3_1</code> for the X925 and{' '}
            <code>armv8_pmuv3_0</code> for the A725. Set <code>CPU</code> to the number of a core of the type whose
            event source you name. <Cite id="F08-60">our run script and experiment notes</Cite>{' '}
            <Cite id="F08-68">our profiling report, slots self check</Cite>
          </Box>
          <Box variant="p">
            On EC2 the instance size decides whether such a card can be made at all. Graviton cores are Arm Neoverse
            designs, and sizes that hold an entire dedicated processor socket generally get every PMU event: full
            support starts at c9g.12xlarge and c8g.24xlarge, smaller sizes of newer generations get a reduced set, and
            smaller sizes of older generations possibly none.{' '}
            <Cite id="F08-56">AWS Graviton guide, processor table</Cite>{' '}
            <Cite id="F08-25">AWS Graviton guide, PMU counters</Cite>{' '}
            <Cite id="F08-26">AWS Graviton guide, PMU support table</Cite>
          </Box>
          <Placeholder
            what={
              <>
                the same workloads on Amazon EC2: Graviton sizes (c9g, c8g) for decode and CPU physics; G-family
                sizes (g6, g6e, g7, g7e) for decode with embedding, augmentation, simulation, training and
                evaluation; and one P5 or P6 size for training. First, a capability check: the PMU events that{' '}
                <code>perf list</code> shows on c9g.2xlarge, c9g.12xlarge, g6e.xlarge, g6e.48xlarge, g7.48xlarge and
                p5.48xlarge, which decides where a top-down card can be made at all.
              </>
            }
            source={<>{PROJECT}, run on EC2; not yet run.</>}
          />
          <Snippet
            title="Count the slot split of one program on one core"
            mode="adapted"
            source={<Cite id="F08-60">our run script, run.sh</Cite>}
            ours={<>the variable names and the program path.</>}
          >
            {PERF_SNIPPET}
          </Snippet>
          <Box variant="p">
            Write down the rate, the four shares and the core&apos;s clock, run the program again, and keep the split
            only if it holds. Then count what one unit of work asks of the part the shares point at, as 390 x 25.2 MB
            = 9.8 GB/s did against the Jetson core&apos;s 11.71 GB/s. Section 23, Price-Performance and Latency, takes
            up the method of comparing two machines on a unit of work.{' '}
            <Cite id="F08-63">our arithmetic on the policy stand-in</Cite>
          </Box>
          <Box variant="p">
            Compare two machines on that program only when the same version runs on both and the bottleneck is the
            same. If the program waits on memory with demand near the triad figure, the streaming ratio is the one to
            read. If the core limits it, measure the program itself on both machines: inside the Spark the
            multiply-add ratio said <Derived>4.0</Derived>, and the physics step ran <Derived>2.0</Derived> times
            faster. <Cite id="F08-65">our profiling report, FMA row</Cite>{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
