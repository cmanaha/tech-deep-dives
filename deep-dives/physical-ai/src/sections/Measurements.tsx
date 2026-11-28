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
      <title id="measurements-physics-title">Three cards for the physics step test program, one per core type</title>
      <desc>
        Each card names the machine, the core and the software, and states that the figures come from a single run. It
        then gives the steps per second, a stacked bar of the four top-down shares with each value written out, and the
        memory stall as a share of cycles.
      </desc>
      <rect x="0" y="0" width="340" height="790" fill="#fbfbfd" />
      <CardStack cards={PHYSICS} />
    </svg>
  );
}

function PolicyCards() {
  return (
    <svg viewBox="0 0 340 790" role="img" aria-labelledby="measurements-policy-title" style={{ width: '100%', height: 'auto' }} fontFamily="sans-serif">
      <title id="measurements-policy-title">Three cards for the policy inference test program, one per core type</title>
      <desc>
        Each card names the machine, the core and the software, and states that the figures come from a single run. It
        then gives the inferences per second, a stacked bar of the four top-down shares with each value written out, and
        the memory stall as a share of cycles.
      </desc>
      <rect x="0" y="0" width="340" height="790" fill="#fbfbfd" />
      <CardStack cards={POLICY} />
    </svg>
  );
}

function RenderCards() {
  return (
    <svg viewBox="0 0 340 790" role="img" aria-labelledby="measurements-render-title" style={{ width: '100%', height: 'auto' }} fontFamily="sans-serif">
      <title id="measurements-render-title">Three cards for the camera render test program, one per core type</title>
      <desc>
        Each card names the machine, the core and the software, and states that the figures come from a single run. It
        then gives the frames per second, a stacked bar of the four top-down shares with each value written out, and the
        memory stall as a share of cycles.
      </desc>
      <rect x="0" y="0" width="340" height="790" fill="#fbfbfd" />
      <CardStack cards={RENDER} />
    </svg>
  );
}



/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

/** The six slot events, counted in one execution per core type (adapted from our run script). */
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
            description="We ran small benchmark loops and three test programs on single CPU cores of two NVIDIA edge computers, a DGX Spark and a Jetson Orin Nano Super. The Spark's large Cortex-X925 core was 6.5 times as fast as the Jetson's Cortex-A78AE core on scalar arithmetic, 3.8 times as fast at streaming memory, and returned a single memory read 2.4 times sooner. This section shows how to find a program's bottleneck from the core's hardware counters, so that you can tell which of these ratios, if any, predicts the speed-up of your own program."
          >
            22. Our Measurements: Three Test Programs on Two Edge Computers
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This section compares two NVIDIA edge computers, one CPU core at a time. The DGX Spark is a desktop
            machine. The Jetson Orin Nano Super is a small computer for robots. All the measurements in this section
            are ours, and each one comes from a single run on one of these two machines. A single run is enough to
            show the method and the size of each gap, but not enough to choose an EC2 instance.{' '}
            <Cite id="F08-60">our run script and experiment notes</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Box variant="p">
            How much faster the Spark runs a program depends on the program&apos;s bottleneck, the resource it runs out
            of first. We measured three basic ratios between one Cortex-X925 core of the Spark and one Cortex-A78AE
            core of the Jetson:
          </Box>
          <ul style={{ margin: 0 }}>
            <li>
              <strong>Arithmetic.</strong> The X925 core computes scalar multiply-adds (a x b + c) 6.5 times as fast as
              the A78AE core. Scalar means one number per instruction, so this figure does not use the vector instructions, which
              work on several numbers at once. <Cite id="F08-65">our profiling report, FMA row</Cite>
            </li>
            <li>
              <strong>Memory bandwidth.</strong> The X925 core streams data from memory 3.8 times as fast as the A78AE
              core.{' '}
              <Cite id="F08-66">our profiling report, triad row</Cite>
            </li>
            <li>
              <strong>Memory latency.</strong> A single read from memory comes back 2.4 times sooner on the X925 core than
              on the A78AE core. <Cite id="F08-67">our profiling report, latency row</Cite>
            </li>
          </ul>
          <Box variant="p">
            Each ratio predicts the speed-up only for a program that has the same bottleneck on both machines. For
            example, the memory bandwidth ratio applies to a program that waits on streaming memory on both. Some
            programs are limited not by one unit of the core but by many of its units working together. For such a
            program, you have to measure the program itself. The arithmetic ratio can overstate its speed-up, because
            the loop behind that ratio exercises only one unit of the core.
          </Box>
          <Box variant="p">
            A physics simulation shows how far the arithmetic ratio can be from a program&apos;s real speed-up. The
            Spark also has smaller Cortex-A725 cores, which use the same software and the same memory as its X925
            cores. MuJoCo is the physics engine covered in section 12, Physics Simulation. We ran it on a simulated
            humanoid. One X925 core ran <Derived>2.0</Derived> times as many
            physics steps per second as one A725 core, although it computes multiply-adds <Derived>4.0</Derived> times
            as fast as the A725. The physics step is limited by the core in general, so the multiply-add ratio overstates its
            speed-up by a factor of two. Against the Jetson, one X925 core ran 57,240 steps per second and one Jetson
            core ran 14,507, which is <Derived>3.9</Derived> times as fast. That ratio mixes hardware and software,
            because the Jetson ran MuJoCo 3.17.0 and the Spark ran MuJoCo 4.0.1.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-65">our profiling report, FMA row</Cite>{' '}
            <Cite id="F07-47">DGX Spark user guide, hardware</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Box variant="p">
            Each CPU run pinned one program to one core, which means that the operating system ran the program only
            on that core. Each program is either a microbenchmark or one of three test programs. A microbenchmark is a
            small loop built to exercise one resource of the core. A test program stands in for one of the jobs around
            the {ARM}. The {ARM} is a six-motor desktop arm, and its task is to {TASK_STORY}. To apply the same method
            to your own job, first find the bottleneck from the event counters built into the core. Next, calculate how much of that resource one unit of work needs. Then
            compare machines on that resource.{' '}
            <Cite id="F08-73">limits of our measurements</Cite>{' '}
            <Cite id="F08-60">our run script and experiment notes</Cite>{' '}
            <Cite id="F01-8">LeRobot so_follower.py, motor list</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Top-down analysis is a method that uses a core's hardware counters to show whether a program waits on the core, on memory, or on work the CPU cannot see, such as the GPU's. Here you learn to read its results. Applied to our three test programs, they show that the core limits the physics step on all three cores, that memory limits the policy test program on the Jetson, and that the CPU counters cannot find the camera render's bottleneck."
          >
            Finding each test program&apos;s bottleneck from the CPU counters
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            To find each program&apos;s bottleneck, we used top-down analysis. Top-down analysis finds what limits a
            program on a core from the core&apos;s event counters. These counters are part of the
            core&apos;s PMU (performance monitoring unit). The Linux tool <code>perf stat</code> reads the counters
            over one run of a program. <Cite id="F08-9">Linux v7.3, perf stat documentation</Cite>{' '}
            <Cite id="F08-60">our run script and experiment notes</Cite>
          </Box>
          <Box variant="p">
            Top-down analysis counts slots. A core splits each instruction into small steps called micro-operations.
            A slot is one chance, in one clock cycle, for the core to start one micro-operation. The number of slots
            per cycle is the core&apos;s width. On the Spark, the wide Cortex-X925 core has 10 slots per cycle and the
            narrow Cortex-A725 core has 5. The Jetson&apos;s Cortex-A78AE core has 6 slots per cycle. Neither the Jetson&apos;s Linux
            kernel nor Arm&apos;s published files give that figure, so we derived it from the core&apos;s own
            counters, as described further down.{' '}
            <Cite id="F08-14">Arm Neoverse V1 performance analysis white paper, section 3.2</Cite>{' '}
            <Cite id="F08-68">our profiling report, slots self check</Cite>{' '}
            <Cite id="F07-47">DGX Spark user guide, hardware</Cite>
          </Box>
          <Box variant="p">
            Top-down analysis sorts every slot into one of four categories and reports each category as a share of
            all slots.{' '}
            <Cite id="F08-3">Intel VTune cookbook, the classification paragraphs</Cite>
          </Box>
          <ul style={{ margin: 0 }}>
            <li>
              <strong>Retiring.</strong> A slot counts as retiring when it started a micro-operation and the program
              kept the result.
            </li>
            <li>
              <strong>Front-end bound.</strong> The front end of the core fetches and decodes instructions. A slot is
              front-end bound when it stays empty because the front end had no micro-operation ready.{' '}
              <Cite id="F08-4">Intel TMA metrics file, row Frontend_Bound</Cite>
            </li>
            <li>
              <strong>Back-end bound.</strong> The back end of the core executes micro-operations. A slot is back-end
              bound when it stays empty because the back end could not accept another one.
            </li>
            <li>
              <strong>Bad speculation.</strong> A core does not wait to learn which way a branch goes. It predicts the
              direction and starts the instructions beyond the branch, and this is called speculation. When a
              prediction is wrong, the core throws that work away and restarts on the right path. Throwing the work
              away is called a flush. Bad speculation is the share of slots lost to the discarded work and to the
              restart. <Cite id="F08-7">Intel TMA metrics file, row Bad_Speculation</Cite>
            </li>
          </ul>
          <Box variant="p">
            We also recorded one figure outside the four shares, the memory stall. The memory stall is the share of
            clock cycles in which the back end waited for data from memory. It comes from a separate counter, which we
            counted in a second execution of the same program. We call the record of one program on one core a card.
            A card holds the program&apos;s rate, its four shares and its memory stall.{' '}
            <Cite id="F08-15">Arm Cortex-X925 specification file, events</Cite>{' '}
            <Cite id="F08-60">our run script and experiment notes</Cite>
          </Box>
          <Box variant="p">
            The three ratios at the top of this section, 6.5, 3.8 and 2.4, come from three of the 14 microbenchmarks
            we ran on each core type. Each of the three drives one resource of the core as hard as it can:{' '}
            <Cite id="F08-60">our run script and experiment notes</Cite>{' '}
            <Cite id="F08-65">our profiling report, FMA row</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>{' '}
            <Cite id="F08-67">our profiling report, latency row</Cite>
          </Box>
          <ul style={{ margin: 0 }}>
            <li>
              <strong>Arithmetic.</strong> A fused multiply-add is a single instruction that computes a x b + c. The
              arithmetic loop runs 24 independent chains of fused multiply-adds held in registers, so no instruction
              waits on memory or on another chain. The chains are scalar, so the figure leaves out the vector units
              and Arm&apos;s vector instructions, NEON and SVE.{' '}
              <Cite id="F08-60">our run script and experiment notes</Cite>{' '}
              <Cite id="F08-65">our profiling report, FMA row</Cite>
            </li>
            <li>
              <strong>Memory bandwidth.</strong> The triad is a loop that streams through arrays larger than the
              caches. Its rate is the memory bandwidth one core can get.{' '}
              <Cite id="F08-66">our profiling report, triad row</Cite>
            </li>
            <li>
              <strong>Memory latency.</strong> A pointer chase is a loop in which each read gives the address of the
              next read. So only one read is in flight at a time, and each read pays the full trip to memory. The
              reads land at random over a large area, so the figure also includes misses in the TLB (translation
              lookaside buffer). The TLB is the core&apos;s cache of address translations. The figure can depend on
              the memory page size, and we did not record which page size the system used.{' '}
              <Cite id="F08-67">our profiling report, latency row</Cite>
            </li>
          </ul>
          <Box variant="p">
            The memory hierarchy behind the bandwidth and latency figures is explained in the{' '}
            <Link href="../silicon-memory-inference/">Silicon, Memory &amp; Inference dive</Link>.
          </Box>
          <Box variant="p">
            Each test program stands in for one job around the {ARM}. Its result carries over to that job only if the
            job has the same bottleneck. The table lists the three test programs, the bottleneck we found for each,
            and what each one leaves out of the real job.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={TABLE}>
              <thead>
                <tr>
                  <th style={TH}>Job around the arm</th>
                  <th style={TH}>Test program we ran</th>
                  <th style={TH}>Bottleneck we found</th>
                  <th style={TH}>What the test program leaves out</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>
                    Physics simulation of the arm, one scene on one core (section 12, Physics Simulation)
                  </td>
                  <td style={TD}>A loop of MuJoCo physics steps on a humanoid model with random controls</td>
                  <td style={TD}>The core, on all three core types</td>
                  <td style={TD}>
                    The {ARM} model, the block and their contacts.{' '}
                    <Cite id="F08-61">our profiling report, physics step table</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    Running the policy, the trained model that chooses the arm&apos;s actions (section 17, Running on
                    the Robot)
                  </td>
                  <td style={TD}>
                    Six matrix-vector products with 1024x1024 float32 matrices, in NumPy on one core. Each product is
                    followed by a ReLU (rectified linear unit) step, which sets negative values to zero. Each pass reads
                    all 25.2 MB of weights, which is more than any cache on either machine holds.
                  </td>
                  <td style={TD}>
                    Memory bandwidth on the Jetson. On the Spark, the counters do not point to a single bottleneck.
                  </td>
                  <td style={TD}>
                    Convolutions, attention and the GPU. The test program represents a small dense model that
                    processes one input at a time on a CPU core, while the arm&apos;s real policy runs on a GPU.{' '}
                    <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
                    <Cite id="F08-63">calculation for the policy test program</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>A simulated camera (section 13, Rendering and Ray Tracing)</td>
                  <td style={TD}>
                    MuJoCo renders a 640x480 image offscreen through EGL, with one physics step per frame. EGL is the
                    interface MuJoCo uses for hardware-accelerated rendering without a display.
                  </td>
                  <td style={TD}>
                    Unknown. The CPU counters see only the CPU thread that drives MuJoCo&apos;s renderer, and we did
                    not establish how much of the work the GPU did.
                  </td>
                  <td style={TD}>
                    Ray tracing, and any measurement of how much of each frame the GPU did.{' '}
                    <Cite id="F08-64">our profiling report, camera render table</Cite>{' '}
                    <Cite id="F06-61">MuJoCo docs, rendering</Cite>{' '}
                    <Cite id="F08-73">limits of our measurements</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Placeholder
            what={
              <>
                cards for the arm&apos;s real workloads, measured on the Jetson Orin Nano Super and the DGX Spark in
                place of the test programs. The workloads are: recording and encoding two camera streams; decoding
                the recorded episodes; the MuJoCo physics step of the {ARM} model; fine-tuning ACT and SmolVLA;
                training LeWorldModel; and running ACT or SmolVLA inference at the arm&apos;s control rate. ACT
                (Action Chunking with Transformers) is the imitation-learning policy of section 4, Learning From
                Demonstrations. SmolVLA is the small vision-language-action model of section 5, Vision-Language-Action
                Models. LeWorldModel is the latent world model of section 7, JEPA. Each card will state its unit of
                work, such as environment steps per second, or actions per second with the p50 and p99 latency per
                call. The p50 is the median time per call, and the p99 is the time that only one call in a hundred
                exceeds.
              </>
            }
            source={<>{PROJECT}, on the same two machines. These runs have not been done yet.</>}
          />
          <ColumnLayout columns={3}>
            <Figure
              cites="F08-61 F08-68 F08-73"
              caption={
                <>
                  <strong>Physics step.</strong> Retiring is the largest share on every core, and the memory stall is
                  at most 2.2% of cycles. The X925 loses most of its other slots in the back end, and the A78AE loses
                  most of them in the front end.
                </>
              }
            >
              <PhysicsCards />
            </Figure>
            <Figure
              cites="F08-62 F08-68 F08-73"
              caption={
                <>
                  <strong>Policy test program.</strong> The Jetson core stalls on memory for 62.3% of its cycles, and
                  the Spark&apos;s two cores for 22.8% and 22.4%. So memory limits the Jetson far more than either
                  Spark core.
                </>
              }
            >
              <PolicyCards />
            </Figure>
            <Figure
              cites="F08-64 F08-68 F08-73"
              caption={
                <>
                  <strong>Camera render.</strong> The counters cover only the CPU thread. A large back-end share here
                  can be time the thread spent waiting for the GPU.
                </>
              }
            >
              <RenderCards />
            </Figure>
          </ColumnLayout>

          <Box variant="h3">The physics step is limited by the core</Box>
          <Box variant="p">
            Retiring is the largest share on all three cores: 43.2% on the A78AE, 61.0% on the A725 and 45.7% on the
            X925. On all three cores, at most 2.2% of cycles wait on memory. On the A78AE, though, a low memory stall
            does not prove on its own that memory is not the bottleneck, because the counter can read low even for a
            program that waits on memory. The triad streams memory by design, yet in one of our two passes over the
            benchmark set it showed a memory stall of only 2.6% on this core. Its split of slots also did not repeat
            in the other pass.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Box variant="p">
            Cache refill counts show that memory is not the bottleneck of the physics step on the Jetson. A cache
            refill is a fetch of data into one of the core&apos;s caches from further out in the memory system. Per
            thousand instructions on the Jetson, the physics step refills the first-level data cache 5.22 times and
            the second-level cache 4.57 times. The policy test program, which does wait on memory, refills them 34.23
            and 41.82 times per thousand instructions.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>
          </Box>
          <Box variant="p">
            The two Spark cores share one memory and reach nearly the same triad bandwidth, a ratio of{' '}
            <Derived>1.0</Derived>. Yet the X925 runs the physics step twice as fast as the A725. So the speed of the
            step depends on the core, and more memory bandwidth would not make it faster.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>
          </Box>
          <Box variant="p">
            The cores lose their remaining slots in different places. The X925 loses 36.5% of its slots in the back
            end, while only 0.4% of its cycles wait on memory. That pattern points to the X925&apos;s execution
            units rather than to memory. The A78AE loses
            31.0% of its slots in the front end. Those slots stay empty because instruction fetch and decode had
            nothing ready, so more execution units would not recover them. On this core, we cannot check whether part
            of that share is really recovery after wrong predictions, for a reason explained further down.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-4">Intel TMA metrics file, row Frontend_Bound</Cite>
          </Box>

          <Box variant="h3">The policy test program is limited by memory on the Jetson</Box>
          <Box variant="p">
            On the Jetson, the core spends 63.9% of its slots back-end bound and 62.3% of its cycles stalled on
            memory, which means it is waiting for the weights to arrive. A simple calculation confirms this from the
            other side. Each pass reads all six matrices, which is 6 x 1024 x 1024 x 4 bytes = 25.2 MB. At 390 passes
            per second, the program asks memory for 390 x 25.2 MB = 9.8 GB/s. That is <Derived>84%</Derived> of the
            11.71 GB/s the same core reached on the triad. Demand is close to the triad figure and most cycles wait on
            memory, so faster arithmetic would not help. You can compare two machines by the memory bandwidth of one
            core only when both of these signs hold on both machines: demand close to the triad figure, and most
            cycles stalled on memory. For this test program, both signs hold only on the Jetson.{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-63">calculation for the policy test program</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>
          </Box>
          <Box variant="p">
            On the Spark, the counters do not point to a single bottleneck, because the signs disagree:
          </Box>
          <ul style={{ margin: 0 }}>
            <li>
              <strong>Memory demand points to memory.</strong> The A725 asks for 35.3 GB/s, which is{' '}
              <Derived>80%</Derived> of its triad figure of 43.95 GB/s. The X925 asks for more than its own triad
              figure. <Cite id="F08-63">calculation for the policy test program</Cite>{' '}
              <Cite id="F08-66">our profiling report, triad row</Cite>
            </li>
            <li>
              <strong>The memory stalls point away from memory.</strong> Both cores wait on memory for about a fifth
              of their cycles, 22.8% on the A725 and 22.4% on the X925, against 62.3% on the Jetson.{' '}
              <Cite id="F08-62">our profiling report, policy inference table</Cite>
            </li>
            <li>
              <strong>The speed-up points away from memory.</strong> Instructions per cycle is the number of
              instructions a core finishes, divided by the clock cycles it takes. The X925 ran the test program 1,968
              / 1,404 = <Derived>1.4</Derived> times as fast as the A725, at nearly equal instructions per cycle: 3.07
              on the X925 and 2.96 on the A725. If memory bandwidth limited the program, the two cores would run it
              at about the same speed, because they reach nearly the same triad bandwidth.{' '}
              <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
              <Cite id="F08-63">calculation for the policy test program</Cite>{' '}
              <Cite id="F08-66">our profiling report, triad row</Cite>
            </li>
          </ul>
          <Box variant="p">
            To find the bottleneck on the Spark, you need a finer split of the back-end stalls. For the X925 and
            the A725, Arm defines second-level events that split back-end stalls into stalls caused in the core and
            stalls caused by memory. Counting <code>STALL_BACKEND_MEMBOUND</code> together with{' '}
            <code>STALL_BACKEND</code> would show how much of the back-end stall comes from memory. Our runs did not
            count these events.{' '}
            <Cite id="F08-24">Arm Cortex-X925 specification file, second-level metrics</Cite>
          </Box>
          <Box variant="p">
            It is also an open question whether the triad&apos;s 44.38 GB/s is the most memory bandwidth the X925 can
            get. The test program asked for 49.5 GB/s, which is its passes per second times 25.2 MB. If every pass
            read its weights from main memory (DRAM) and none from a cache, the program drew more bandwidth than the
            triad reached. Our benchmark set gives no higher figure for that core. The set&apos;s loop that only reads
            memory was limited by its own instructions: on the X925, it reached 28.94 GB/s and was 82.9% front-end
            bound.{' '}
            <Cite id="F08-63">calculation for the policy test program</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>
          </Box>

          <Box variant="h3">The camera render cannot be diagnosed from CPU counters alone</Box>
          <Box variant="p">
            The CPU counters cannot identify this program&apos;s bottleneck. On the X925, 69.2% of slots are back-end
            bound, while only 3.4% of cycles stall on memory. In the physics step, the same pattern pointed to the
            execution units. But a CPU thread that waits for the GPU can also appear as back-end bound or as idle.
            The four shares describe the bottleneck only when the workload is bound by the CPU. The frame rates, 209 frames per second
            on the A78AE, 937 on the A725 and 1,191 on the X925, describe this program on these machines and do not
            rank their rendering hardware. To compare rendering hardware, sample the GPU&apos;s activity at the same
            time as the CPU counters.{' '}
            <Cite id="F08-64">our profiling report, camera render table</Cite>{' '}
            <Cite id="F08-9">Linux v7.3, perf stat documentation</Cite>
          </Box>

          <ExpandableSection headerText="How we counted the slot shares, and how to compute them yourself">
            <SpaceBetween size="s">
              <Box variant="p">
                We ran each program pinned to one core under <code>perf stat</code>, twice, with a different set of
                events each time. The first execution counted the six events of the slot split:{' '}
                <code>stall_slot</code>, <code>stall_slot_frontend</code>, <code>stall_slot_backend</code>,{' '}
                <code>op_retired</code>, <code>op_spec</code> and <code>cpu_cycles</code>. The second execution
                counted eight detail events, including instructions finished, the memory stall and the cache
                refills. So a comparison that uses both sets, such as the memory stall against a slot share, compares
                two different executions. We ran the 14 single-thread microbenchmarks and the three test programs
                this way on each core type. <Cite id="F08-60">our run script and experiment notes</Cite>
              </Box>
              <Box variant="p">
                To trust a ratio of two counters, first check that perf did not scale any count. When perf cannot
                count every requested event at the same time, it multiplexes them. Each event is then counted for
                part of the run, and perf scales its total up. A ratio of two events that were not counted at the
                same time, such as instructions per cycle, can lose accuracy. The perf tool prints the share of the
                run during which each counter was running, and a share below 100% means the count was scaled.{' '}
                <Cite id="F08-87">Linux v7.3, perf stat documentation, multiplexing</Cite>
              </Box>
              <Box variant="p">
                If no document gives a core&apos;s width, you can compute it. In every cycle, each slot either stalls
                or starts a micro-operation. So <code>stall_slot</code> plus <code>op_spec</code>, divided by{' '}
                <code>cpu_cycles</code>, gives the width. Arm&apos;s telemetry files are the event and formula
                definitions that Arm publishes for each core. For the X925 and the A725, this calculation returns the
                10 and 5 slots that those files give. For the A78AE, it returns 6.000 on three programs. Neither the
                Jetson&apos;s Linux kernel nor Arm&apos;s files give a width for that core.{' '}
                <Cite id="F08-68">our profiling report, slots self check</Cite>{' '}
                <Cite id="F08-16">Arm telemetry files, slots per core</Cite>{' '}
                <Cite id="F08-15">Arm Cortex-X925 specification file, events</Cite>
              </Box>
              <Box variant="p">
                Each share is a count divided by the total number of slots, where <i>slots</i> ={' '}
                <code>cpu_cycles</code> x width. The two stall shares divide a stall count by the slots. The other two
                shares take the slots that started a micro-operation and split them by the fraction of
                micro-operations kept, <code>op_retired</code> / <code>op_spec</code>:{' '}
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
                As a worked example, the X925&apos;s physics step had 72,922,813,391 back-end stalled slots over
                19,958,256,358 cycles x 10 slots, so back-end bound is 36.54%. On the Jetson&apos;s policy card,{' '}
                <Derived>27.1%</Derived> of slots started a micro-operation and <Derived>98.8%</Derived> of those were
                kept, so retiring is <Derived>27.1%</Derived> x <Derived>98.8%</Derived> = 26.8%.{' '}
                <Cite id="F08-70">our recomputation from the raw counters</Cite>{' '}
                <Cite id="F08-62">our profiling report, policy inference table</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A measured ratio between two machines applies to your program only if the program has the same bottleneck as the loop that produced the ratio. Here you can see which ratio applies to each test program, and what to measure when none of them does."
          >
            When a ratio between two machines predicts a program&apos;s speed-up
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A program&apos;s speed ratio between two machines measures the hardware only when three conditions hold.
            The program is the same, it runs at the same software version, and it has the same bottleneck on both
            machines.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ ...TABLE, minWidth: 760 }}>
              <thead>
                <tr>
                  <th style={TH}>Resource or program, measured on one core</th>
                  <th style={TH}>Jetson, Cortex-A78AE</th>
                  <th style={TH}>Spark, Cortex-A725</th>
                  <th style={TH}>Spark, Cortex-X925</th>
                  <th style={TH}>X925 speed-up over A78AE (times)</th>
                  <th style={TH}>X925 speed-up over A725 (times)</th>
                  <th style={TH}>Source</th>
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
                  <td style={TD}>Policy test program, inferences per second</td>
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
            Between the Jetson and the Spark, none of the three test programs meets those conditions. The camera
            render&apos;s ratio of <Derived>5.7</Derived> includes the GPU&apos;s share of each frame, which we did not
            measure. The policy test program&apos;s bottleneck changes between the machines. Memory limits the
            Jetson&apos;s rate far more than the X925&apos;s: 62.3% of cycles stall on memory on the Jetson, against
            22.4% on the X925. Because the bottleneck moves, the program&apos;s ratio of 1,968 / 390 ={' '}
            <Derived>5.0</Derived> is higher than the streaming ratio of 3.8.{' '}
            <Cite id="F08-64">our profiling report, camera render table</Cite>{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-63">calculation for the policy test program</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>
          </Box>
          <Box variant="p">
            The physics step is limited by the core on all three cores. But its ratio of <Derived>3.9</Derived>{' '}
            between the machines spans two MuJoCo versions, and a new version can change the number of instructions a
            step takes. The counters explain part of that ratio. A core&apos;s steps per second equal its instructions
            per cycle, times its clock rate, divided by the number of instructions one step takes. The counters give
            instructions per cycle over the whole program, including start-up. If we take those figures as the
            loop&apos;s, they are 4.37 on the X925 and 2.48 on the A78AE, a factor of <Derived>1.76</Derived>. The
            remaining <Derived>3.9</Derived> / <Derived>1.76</Derived> = <Derived>2.2</Derived> comes from the clock
            rate and the instructions per step together.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-60">our run script and experiment notes</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Box variant="p">
            Between the two cores inside the Spark, the physics step meets all three conditions, yet the arithmetic
            ratio still does not predict it. The physics step ran 57,240 / 28,662 = <Derived>2.0</Derived> times as
            fast on the X925, while the arithmetic ratio is 22.242 / 5.595 = <Derived>4.0</Derived>. The reason is
            that the multiply-add loop exercises only one unit of the core: its floating-point multiply-add
            pipelines, fed by chains that never wait on each other. On that loop, the X925 finished 6.18 instructions
            per cycle. A physics step runs MuJoCo&apos;s whole pipeline of kinematics, collision detection,
            constraint solving and integration. On the physics step, the X925 finished 4.37 instructions per cycle.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-65">our profiling report, FMA row</Cite>{' '}
            <Cite id="F06-9">MuJoCo docs, Computation chapter, simulation pipeline</Cite>
          </Box>
          <Box variant="p">
            So a microbenchmark&apos;s ratio predicts a program only when the program is limited by the same unit that
            the loop measures. For a program that is limited by the core in general, no single microbenchmark gives
            the right ratio, so measure the program itself on both machines. Then use its instructions per cycle and
            the clock rate to break the ratio down.
          </Box>
          <Box variant="p">
            Here is that breakdown for the physics step on the Spark. The X925 finished 4.37 instructions per cycle
            and the A725 finished 3.01, so the X925 finished <Derived>1.45</Derived> times as many. The X925 has twice
            as many slots, but it kept a smaller share of them working: 45.7% of 10 slots, against 61.0% of 5 slots on
            the A725. Assume that a step takes the same number of instructions on both cores, and that the
            whole-program figures again represent the loop. Then the remaining <Derived>2.0</Derived> /{' '}
            <Derived>1.45</Derived> = <Derived>1.4</Derived> is the ratio of the two clock rates. The cards record
            cycle counts but no clock rate, so this clock ratio is inferred, not measured.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-68">our profiling report, slots self check</Cite>
          </Box>
          <Box variant="p">
            The policy test program ran <Derived>1.4</Derived> times as fast on the X925 as on the A725, at nearly
            equal instructions per cycle (3.07 on the X925 and 2.96 on the A725). That speed-up matches the inferred
            clock ratio of <Derived>1.4</Derived>. So the program sped up with the clock rate and not with the memory
            bandwidth, which was nearly the same on both cores. For the open question of this program&apos;s bottleneck on the Spark, the evidence therefore
            points more toward the core than toward memory.{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>
          </Box>
          <Box variant="p">
            Every ratio in the table compares one core with one core, and a ratio between single cores does not
            predict the ratio between whole machines. NVIDIA specifies 102 GB/s of memory bandwidth for the Jetson and
            273 GB/s for the Spark, a ratio of <Derived>2.7</Derived>, while one core of each showed a ratio of 3.8.
            Each machine&apos;s total bandwidth is shared by all its CPU cores and its GPU, and one core streamed 11.71
            GB/s of it on the Jetson and 44.38 GB/s on the Spark. To size a whole machine, you need cards from several
            cores running at the same time. You also need a measurement of the GPU&apos;s share of memory bandwidth,
            which a counter inside a CPU core cannot see.{' '}
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
            description="We profiled one matrix multiply on each machine's GPU with Nsight Compute. The results show how to read the two throughput figures that Nsight Compute reports, and why you should record the GPU clock with every profile on a Jetson before you trust a duration."
          >
            Profiling one GPU kernel on each machine
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A kernel is one function launched on the GPU. On each machine, we profiled one kernel, a multiply of two
            square float32 matrices, with Nsight Compute. Nsight Compute is NVIDIA&apos;s profiler for single GPU
            kernels. It reports two throughput figures, each as a share of the GPU&apos;s maximum. The first is for
            compute in the SMs (streaming multiprocessors), which are the GPU&apos;s processing units. The second is
            for memory. Each figure is the highest reading among the counters it summarises. For example, the
            Spark&apos;s compute figure of 70.49% means that its busiest SM counter ran at 70.49% of that
            counter&apos;s maximum. That is a different quantity from the share of the GPU&apos;s peak floating-point
            rate that the kernel reached. <Cite id="F08-34">Nsight Compute profiling guide, sections</Cite>{' '}
            <Cite id="F08-71">our DGX Spark card, GPU kernel</Cite>
          </Box>
          <Figure
            cites="F08-71 F08-72"
            caption={
              <>
                Neither kernel was tuned. The matrix size, the GPU clock and the profiler version differ between the
                two columns, so the two durations cannot be compared.{' '}
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
            On both GPUs, the busiest compute counter ran closer to its maximum than the busiest memory counter:
            70.49% and 74.49% for compute, against 50.47% and 48.27% for memory. So this multiply loaded the SMs more
            heavily than memory, and no counter reached its maximum.{' '}
            <Cite id="F08-71">our DGX Spark card, GPU kernel</Cite>{' '}
            <Cite id="F08-72">our Jetson card, GPU kernel</Cite>{' '}
            <Cite id="F08-34">Nsight Compute profiling guide, sections</Cite>
          </Box>
          <Box variant="p">
            Tensor cores are the GPU units built for the matrix arithmetic of neural networks. Neither card records a
            tensor-core figure, so we have no measurement of tensor-core use on either machine. The{' '}
            <code>simt</code> in the Spark kernel&apos;s name stands for SIMT (single instruction, multiple threads).
            SIMT is the GPU&apos;s general execution path. Judging by that name, the Spark&apos;s kernel did not use
            the tensor cores at all. So read the two profiles as one large float32 multiply per GPU, and not as the
            load that a policy puts on the GPU.{' '}
            <Cite id="F08-71">our DGX Spark card, GPU kernel</Cite>{' '}
            <Cite id="F08-72">our Jetson card, GPU kernel</Cite>{' '}
            <Cite id="F08-42">NVIDIA Tensor Cores page; Nsight Compute pipeline glossary</Cite>
          </Box>
          <Box variant="p">
            The Spark&apos;s multiply ran in PyTorch, but our run did not record the PyTorch version or the precision
            setting. In PyTorch v2.15.0, a float32 matrix multiply computes in float32 by default. TensorFloat32 is a
            lower internal precision for float32 matrix multiplies that still gives a float32 result. Calling{' '}
            <code>torch.set_float32_matmul_precision(&quot;high&quot;)</code> lets PyTorch use it where a fast kernel
            exists. Because this setting can change which kernel runs, profile a policy at the precision it will run
            at.{' '}
            <Cite id="F08-71">our DGX Spark card, GPU kernel</Cite>{' '}
            <Cite id="F08-88">PyTorch v2.15.0, set_float32_matmul_precision</Cite>
          </Box>
          <Box variant="p">
            During its profile, the Jetson&apos;s SM clock was 306 MHz, against 2.13 GHz on the Spark. On a Jetson,
            the GPU clock changes with load. To make a Jetson GPU profile comparable, record the clock with every
            profile, or pin the clock. The Jetson&apos;s built-in monitor, tegrastats, prints the clock. Compare two
            GPUs only on the same matrix size and under the same profiler version.{' '}
            <Cite id="F08-72">our Jetson card, GPU kernel</Cite>{' '}
            <Cite id="F08-71">our DGX Spark card, GPU kernel</Cite>
          </Box>
          <ExpandableSection headerText="The two durations as rates, and why they cannot be compared">
            <Box variant="p">
              The Spark multiplied 4096x4096 matrices in 8.35 ms. The Jetson multiplied 2048x2048 matrices in 42.31
              ms, which is an eighth of the work. As rates, 2 x 4096^3 operations in 8.35 ms is about 16,460 billion
              floating-point operations per second, and 2 x 2048^3 operations in 42.31 ms is 406 billion. Each rate
              depends on its own clock and matrix size, so the gap between them does not tell you which GPU is
              faster.{' '}
              <Cite id="F08-71">our DGX Spark card, GPU kernel</Cite>{' '}
              <Cite id="F08-72">our Jetson card, GPU kernel</Cite>
            </Box>
          </ExpandableSection>
          <Placeholder
            what={
              <>
                GPU counters for each workload, which the current cards do not have. There will be three kinds of
                measurement. The first is the activity of the compute cores, the tensor cores, the memory, the video
                decoder and the video encoder, together with power, sampled once per second. DCGM (Data Center GPU
                Manager) will take these samples, and tegrastats will take them on the Jetson. DCGM is NVIDIA&apos;s
                GPU telemetry tool. The second is Nsight Compute profiles of the two or three kernels that take the most time.
                The third is an Nsight Systems timeline that shows the share of time the GPU waits for data between
                batches. Nsight Systems is NVIDIA&apos;s timeline profiler.
              </>
            }
            source={<>{PROJECT}, on EC2 and on the same two machines. These runs have not been done yet.</>}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Before you act on a card's four shares, check them in two ways: run the program a second time, and run a program whose bottleneck you already know. A known bias in the generic Arm formula that ships with Linux perf also makes the front-end share too high and the bad speculation share too low on the Spark's cores."
          >
            Checking that the slot split can be trusted
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The four shares always add up to 100%, because the formula is built that way, so the sum tells you
            nothing about whether the split is right. To test the split, run a program whose bottleneck you already
            know. The pointer chase waits on memory by design, and it shows 97.6% to 99.0% back-end bound on all
            three cores. The multiply-add loop keeps its data in registers, and it shows 0.0% front-end bound on the
            X925. <Cite id="F08-69">our check of the counter identity</Cite>{' '}
            <Cite id="F08-67">our profiling report, latency row</Cite>{' '}
            <Cite id="F08-65">our profiling report, FMA row</Cite>
          </Box>
          <Box variant="p">
            We ran the whole set twice, from two different builds of the benchmark. For the three test programs, the
            two passes agree: throughput is within 2.5%, and every share is within <Derived>0.7</Derived> percentage
            points. On the triad and on a loop that writes memory, the two passes agree on throughput but not on the
            split. <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Box variant="p">
            On the Jetson, the triad ran at 11.66 GB/s in pass 1, with 5.9% of slots front-end bound and 76.9%
            back-end bound. In pass 2, it ran at 11.71 GB/s, with 78.1% front-end bound, 7.9% back-end bound and 2.6%
            of cycles stalled on memory. The speed stayed nearly the same while the split moved from the back end to
            the front end, so this split cannot tell you where the time went. The two passes came from different builds,
            so they do not show whether an unchanged program would flip in the same way. Until a repeated run answers
            that, run a new program at least twice before you act on its shares.{' '}
            <Cite id="F08-73">limits of our measurements</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>
          </Box>
          <Box variant="p">
            The triad&apos;s rate is still a good measure of memory bandwidth, because the rate came out nearly the
            same from both builds. On the Spark, two cores of different width reached nearly the same triad figure, 43.95
            and 44.38 GB/s, so the core&apos;s width does not set the rate. The conclusion that memory limits the policy test
            program on the Jetson does not depend on the triad&apos;s split. It rests on the program&apos;s own memory
            stall of 62.3% and on its demand of <Derived>84%</Derived> of the triad figure. The conclusion that the
            core limits the physics step rests on the cache refill counts.{' '}
            <Cite id="F08-73">limits of our measurements</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-63">calculation for the policy test program</Cite>
          </Box>
          <Box variant="p">
            The cards also carry one known bias. Every card uses the generic Arm formula that ships with Linux
            perf, and that formula has no term for the cycles a core spends recovering from a flush.{' '}
            <Cite id="F08-20">Linux v7.3, generic Arm top-down metrics</Cite> Arm&apos;s own formulas for the X925 and
            the A725 count those cycles with the event <code>STALL_FRONTEND_FLUSH</code>. They subtract the cycles
            from front-end bound and add them to bad speculation.{' '}
            <Cite id="F08-19">Arm telemetry file for the Cortex-X925</Cite> So on those two cores, the cards show
            front-end bound too high and bad speculation too low, by the same unknown amount. Back-end bound and
            retiring are the same under both formulas.{' '}
            <Cite id="F08-22">our comparison of the run script with Arm&apos;s formulas</Cite>
          </Box>
          <Box variant="p">
            Arm&apos;s telemetry files do not include a file for the A78AE. So we cannot check whether the
            Jetson&apos;s front-end shares, including the physics step&apos;s 31.0%, carry the same bias. On the
            Spark, treat the cores&apos; front-end shares as upper bounds, or count{' '}
            <code>STALL_FRONTEND_FLUSH</code> together with the six slot events.{' '}
            <Cite id="F08-16">Arm telemetry files, slots per core</Cite>{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-22">our comparison of the run script with Arm&apos;s formulas</Cite>
          </Box>
          <ExpandableSection headerText="How far the flush bias can move a card's front-end share">
            <Box variant="p">
              Arm&apos;s formulas for its Neoverse V1 and V2 server cores charge a fixed 4 cycles for each
              mispredicted branch. If we borrow that constant for the X925, the physics card would move 1.6 points
              from front-end bound (12.2% to about 10.6%) to bad speculation (5.6% to about 7.2%). The microbenchmark
              built to exercise branches would move 13.2 points, and the policy test program and the memory
              microbenchmarks would move less than 0.5 points. The constant comes from other cores, so these figures are not measurements of the
              X925. They only show which cards are most sensitive to the bias, and code with many branches is the
              most sensitive. <Cite id="F08-23">calculation of the missing flush correction</Cite>
            </Box>
          </ExpandableSection>
          <Placeholder
            what={
              <>
                repeated and corrected versions of the current cards, so that each figure comes from more than one
                run. There will be three kinds of measurement. The first is the triad and memory-write
                microbenchmarks, repeated over several runs of one unchanged program, with the throughput and all four
                shares for each run and their spread. The second is the test program cards captured again with the
                flush-recovery event, so that front-end bound and bad speculation follow Arm&apos;s formula. The third
                is the camera render test program, run once with software rendering and once through EGL, with GPU
                activity sampled, to establish the GPU&apos;s share of each frame.
              </>
            }
            source={<>{PROJECT}, on the same two machines. These runs have not been done yet.</>}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="These steps show how to count the slot shares of your own program on one core, and how to check, before you compare two machines, whether the comparison will hold."
          >
            Making a card for your own workload
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            To get the slot shares for one program, pin it to one core and count the six slot events in one
            execution, as our runs did. Linux exposes the PMU of each core type under its own event source name. On a
            DGX Spark, the event source is <code>armv8_pmuv3_1</code> for the X925 and <code>armv8_pmuv3_0</code> for
            the A725. Set <code>CPU</code> to the number of one core of the type you want to measure. Look up which
            core numbers belong to that type on your own system.{' '}
            <Cite id="F08-60">our run script and experiment notes</Cite>{' '}
            <Cite id="F08-68">our profiling report, slots self check</Cite>
          </Box>
          <Snippet
            title="Count the slot split of one program on one core"
            mode="adapted"
            source={<Cite id="F08-60">our run script, run.sh</Cite>}
          >
            {PERF_SNIPPET}
          </Snippet>
          <Box variant="p">
            On EC2, the instance size determines whether you can make such a card at all. Graviton is AWS&apos;s own
            family of Arm processors. Its cores are Arm Neoverse designs. AWS&apos;s Graviton performance runbook
            lists full PMU event support on c9g at 12xlarge, 24xlarge and 48xlarge, and on c8g at 24xlarge and
            48xlarge. Smaller sizes of both get a reduced set of events. As of November 2026, the runbook does not
            list which events those are, so we do not know whether the six slot events are among them.{' '}
            <Cite id="F08-56">AWS Graviton guide, processor table</Cite>{' '}
            <Cite id="F08-25">AWS Graviton guide, PMU counters</Cite>{' '}
            <Cite id="F08-26">AWS Graviton guide, PMU support table</Cite>
          </Box>
          <Placeholder
            what={
              <>
                the same workloads on Amazon EC2. Graviton sizes (c9g, c8g) will run decoding and CPU physics.
                G-family sizes (g6, g6e, g7, g7e) will run decoding with embedding, augmentation, simulation, training
                and evaluation. One P5 or P6 size will run training. Before that, a capability check will record the
                PMU events that <code>perf list</code> shows on c9g.2xlarge, c9g.12xlarge, g6e.xlarge, g6e.48xlarge,
                g7.48xlarge and p5.48xlarge. That check will show on which instances you can make a top-down card at
                all.
              </>
            }
            source={<>{PROJECT}, on EC2. These runs have not been done yet.</>}
          />
          <Box variant="p">
            To get the memory stall, run the program a second time with <code>stall_backend_mem</code> and{' '}
            <code>cpu_cycles</code> in the event list, as our runs did. Write down the rate, the four shares and the
            memory stall. Then run the program again, and keep the split only if it repeats. Next, calculate how much
            one unit of work needs from the resource that the shares point to. For the policy test program on the
            Jetson, that was 390 x 25.2 MB = 9.8 GB/s, compared with the 11.71 GB/s that the core reached on the
            triad. <Cite id="F08-63">calculation for the policy test program</Cite>
          </Box>
          <Box variant="p">
            Compare two machines on that program only when the same version runs on both and the bottleneck is the
            same on both. If the program waits on memory and its demand is near the triad figure, use the memory
            bandwidth ratio. If the core limits the program, a microbenchmark ratio can mislead you. Inside the
            Spark, the multiply-add ratio between the two cores was <Derived>4.0</Derived>, but the physics step ran
            only <Derived>2.0</Derived> times as fast. In that case, measure the program itself on both machines.{' '}
            <Cite id="F08-65">our profiling report, FMA row</Cite>{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
