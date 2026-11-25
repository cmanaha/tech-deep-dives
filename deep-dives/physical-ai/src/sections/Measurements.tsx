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
            description="One core of a robot computer and one core of a desktop machine are 6.5 times apart on arithmetic, 3.8 on streaming from memory and 2.4 on a single memory read: learn to read a workload's gap from the part it fills, and carry the method to your own job"
          >
            22. Our Measurements: Three Stand-Ins on Two Edge Machines
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One core of an NVIDIA Jetson Orin Nano Super, a small robot computer, stepped a simulated humanoid 14,507
            times a second; one core of an NVIDIA DGX Spark, a desktop machine, stepped it 57,240 times,{' '}
            <Derived>3.9</Derived> times as many. That is one ratio of several. Between the same two cores the gap is
            6.5 times on arithmetic, 3.8 times on streaming data from memory and 2.4 times on waiting for a single
            memory read, so a workload&apos;s speed-up depends on which of those parts it uses up first. The figures
            are single runs of stand-in programs on two edge machines, computers that sit beside a robot: enough to
            show the method and the size of the gap, too little to size an EC2 instance.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-65">our profiling report, FMA row</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>{' '}
            <Cite id="F08-67">our profiling report, latency row</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Box variant="p">
            The humanoid stands in for the dive&apos;s arm, the {ARM}, a six-motor desktop arm whose task is to{' '}
            {TASK_STORY}, and it ran in MuJoCo, the physics engine of section 12. Its <Derived>3.9</Derived> also shows
            how to take a ratio apart. A core&apos;s steps per second are its instructions finished per clock cycle,
            times its clock rate, divided by the instructions one step takes. The Spark&apos;s Cortex-X925 core
            finished 4.37 instructions per cycle and the Jetson&apos;s Cortex-A78AE 2.48, a factor of{' '}
            <Derived>1.76</Derived>, so the other <Derived>3.9</Derived> / <Derived>1.76</Derived> ={' '}
            <Derived>2.2</Derived> is clock rate and instructions per step together. The cycles were counted over
            the whole program, start-up included, while the rate was timed over the loop alone, so the cycle counts do
            not give the clock. The machines also ran different MuJoCo versions, 4.0.1 on the Spark and 3.17.0 on the Jetson,
            and a new version can change the instructions a step takes.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-60">our run script and experiment notes</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know which part of the machine each program loads and what of the arm's real work it leaves out, before you apply a figure from it to your own job"
          >
            Three stand-ins, three parts of the machine
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A stand-in is a program run in place of a workload. A machine has parts, resources such as a core&apos;s
            arithmetic or the memory, and the part that runs out first sets the speed; a stand-in is useful as far as
            it uses up the same part first as the work it replaces. The physics step loads a core&apos;s arithmetic
            and its branches and hardly touches memory. The policy stand-in, a small dense model, reads every one of
            its weights from memory on every pass. The render stand-in sends its frames through MuJoCo&apos;s
            hardware-accelerated path, and only the CPU thread that drives it is counted.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={TABLE}>
              <thead>
                <tr>
                  <th style={TH}>The arm&apos;s workload</th>
                  <th style={TH}>The stand-in we ran</th>
                  <th style={TH}>What it loads</th>
                  <th style={TH}>What it leaves out</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Physics simulation of the arm, one scene on one core (section 12)</td>
                  <td style={TD}>One MuJoCo step of a humanoid model with random controls, in a loop</td>
                  <td style={TD}>The core&apos;s arithmetic and branches; at most 2.2% of cycles go to waiting on memory</td>
                  <td style={TD}>
                    The {ARM} model, its block and its contacts.{' '}
                    <Cite id="F08-61">our profiling report, physics step table</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Running the policy, the trained model that picks the arm&apos;s actions (section 17)</td>
                  <td style={TD}>
                    Six 1024x1024 float32 matrix-vector products, each followed by ReLU (which sets negative values to
                    zero), in NumPy on one core
                  </td>
                  <td style={TD}>Memory streaming: each pass reads all 25.2 MB of weights, more than any cache on either machine</td>
                  <td style={TD}>
                    Convolutions, attention and the GPU: a dense layer stack run one input at a time on a CPU core stands for a small dense model on a CPU, and not for the arm&apos;s policy on its GPU.{' '}
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
                  <td style={TD}>A rasteriser meant for the GPU, driven by one CPU thread; only the thread is counted</td>
                  <td style={TD}>
                    Ray tracing, and any record of how much of each frame the GPU did.{' '}
                    <Cite id="F08-64">our profiling report, camera render table</Cite>{' '}
                    <Cite id="F06-61">MuJoCo docs, rendering</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Each program ran pinned to one core under <code>perf stat</code>, the Linux tool that reads a core&apos;s
            PMU (performance monitoring unit, its event counters) around a program. The counts rest on slots: a slot is
            one chance in a clock cycle to start a micro-operation, the small step a core splits an instruction into.
            Six events (<code>stall_slot</code>, <code>stall_slot_frontend</code>, <code>stall_slot_backend</code>,{' '}
            <code>op_retired</code>, <code>op_spec</code> and <code>cpu_cycles</code>) sort every slot into four
            shares. Retiring is the share that did work the program kept, and bad speculation the share thrown away
            after a wrong guess. A slot is front-end bound when it stayed empty because the half of the core that
            fetches and decodes instructions had nothing ready, and back-end bound when the half that executes them
            could take no more. <Cite id="F08-60">our run script and experiment notes</Cite>
          </Box>
          <Box variant="p">
            A second execution of each program counted eight detail events, among them instructions finished and
            memory stall, the share of cycles the back end spent waiting for data from memory. Each core type also ran
            14 single-thread microbenchmarks, small loops each built to load one part of the core. The whole set ran in
            two passes from two builds of the benchmark; the figures here are from the second pass, one execution
            each. <Cite id="F08-60">our run script and experiment notes</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read each program's counters on three cores, see which part limits it, and take what that changes in the machine you pick"
          >
            Physics is limited by the core, the dense-layer stand-in by memory on the Jetson
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One program&apos;s counters on one core make a card: its rate, the four shares and memory stall. Retiring is
            the product of two counts, the share of slots that started a micro-operation times the share of started
            micro-operations that were kept. On the Jetson&apos;s policy card <Derived>27.1%</Derived> of slots started
            one and <Derived>98.8%</Derived> of those were kept, so retiring is 26.8%. Memory stall comes from the
            second execution, so a ratio that mixes it with the slot shares compares two executions.{' '}
            <Cite id="F08-70">our recomputation from the raw counters</Cite>{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>
          </Box>
          <Box variant="p">
            The cores differ in width, their slots per cycle: 6 on the Jetson&apos;s Cortex-A78AE, 5 on the
            Spark&apos;s narrow Cortex-A725 and 10 on its wide Cortex-X925, the two core types beside the Spark&apos;s
            GB10 GPU. In every cycle each slot either stalls or starts a micro-operation, so <code>stall_slot</code>{' '}
            plus <code>op_spec</code> over <code>cpu_cycles</code> gives the width. That is how the A78AE&apos;s 6 was
            found, at exactly 6.000 on three programs, since neither its kernel nor Arm&apos;s telemetry files give a
            figure for that core. <Cite id="F08-68">our profiling report, slots self check</Cite>{' '}
            <Cite id="F08-16">Arm telemetry files, slots per core</Cite>
          </Box>
          <ColumnLayout columns={3}>
            <Figure
              cites="F08-61 F08-68 F08-73"
              caption={
                <>
                  <strong>Physics step.</strong> Retiring leads on every core and memory stall stays at or under 2.2%
                  of cycles, so the step&apos;s rate is set inside the core. The humanoid stands in for the arm.
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
                  Spark&apos;s cores for 22.8% and 22.4%. Six dense layers on the CPU stand in for a policy.
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
            wait on memory. That is how a core limit shows: retiring in the lead and memory stall near zero, so more
            memory bandwidth would not raise the rate. The X925 loses 36.5% of its slots to the back end with 0.4% of
            cycles stalled on memory, which points at its execution units; the A78AE loses 31.0% to the front end.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>
          </Box>
          <Box variant="p">
            The front-end shares on the Spark&apos;s two cores are overstated. Every card uses the generic Arm formula
            that Linux perf ships, which books the cycles a core spends recovering from a flush (the restart after a
            wrong branch guess, an exception or a similar event) as front-end bound.{' '}
            <Cite id="F08-20">Linux v7.3, generic Arm top-down metrics</Cite> Arm&apos;s own formulas for the X925 and
            the A725 move those cycles to bad speculation, using an event these runs did not record.{' '}
            <Cite id="F08-19">Arm telemetry file for the Cortex-X925</Cite> So on those two cores front-end bound reads
            too high and bad speculation too low by the same unknown amount, while back-end bound and retiring are the
            same under both formulas. The A78AE has no Arm formula to check its front-end share against.{' '}
            <Cite id="F08-22">our comparison of the run script with Arm&apos;s formulas</Cite>
          </Box>
          <ExpandableSection headerText="How far the front-end figures can move: an illustration with a borrowed constant">
            <Box variant="p">
              Arm&apos;s formulas for its Neoverse V1 and V2 server cores charge a fixed 4 cycles per mispredicted branch.
              Borrowing that constant for the X925, the physics card would move 1.6 points from front end (12.2% to
              about 10.6%) to bad speculation (5.6% to about 7.2%). A branch-heavy microbenchmark would move 13.2
              points, and the policy and memory programs under 0.5 points. The constant comes from other cores and the
              branch count is a related event, retired mispredictions, so the illustration ranks which cards are
              sensitive (code full of branches) and replaces no missing measurement.{' '}
              <Cite id="F08-23">our arithmetic on the missing flush correction</Cite>
            </Box>
          </ExpandableSection>
          <Box variant="p">
            For one scene of CPU physics, then, buy speed per core and not memory bandwidth: on the Spark the X925
            stepped 57,240 / 28,662 = <Derived>2.0</Derived> times as fast as the A725 from the same memory. Read the
            Spark cores&apos; front-end shares as upper bounds until the recovery cycles are measured.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>
          </Box>

          <Box variant="h3">The dense-layer stand-in: memory sets the rate on the Jetson</Box>
          <Box variant="p">
            The Jetson core spends 63.9% of its slots back-end bound and 62.3% of its cycles stalled on memory: it is
            waiting for weights. A count reaches the same answer from the other side. Each pass reads all six matrices,
            6 x 1024 x 1024 x 4 bytes = 25.2 MB, more than any cache on either machine holds, so 390 passes a second
            ask memory for 390 x 25.2 MB = 9.8 GB/s, <Derived>84%</Derived> of the 11.71 GB/s the same core streams on
            the triad, a loop that sweeps arrays larger than the caches. That is how a memory limit shows: a large
            back-end share, a large memory stall, and demand close to what the core can stream. For a dense model run
            on a CPU core, compare machines by the GB/s one core can stream; more arithmetic would buy nothing.{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-63">our arithmetic on the policy stand-in</Cite>
          </Box>
          <Box variant="p">
            On the Spark memory weighs less. The A725 asks for 35.3 GB/s, <Derived>80%</Derived> of its 43.95 GB/s
            triad figure, and the X925 for 49.5 GB/s, past the 44.38 GB/s its triad reached, while both wait on memory
            for about a fifth of their cycles (22.8% and 22.4%) against the Jetson&apos;s 62.3%. The X925&apos;s figure
            also shows that a measured rate is a lower bound on what a core can draw: one triad run understates it,
            and the benchmark&apos;s memory-read loop, at 28.94 GB/s, was held back by its own instructions, 82.9%
            front-end bound. <Cite id="F08-63">our arithmetic on the policy stand-in</Cite>{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>
          </Box>

          <Box variant="h3">The camera render: the GPU&apos;s share decides the reading</Box>
          <Box variant="p">
            On the X925, 69.2% of slots are back-end bound with only 3.4% of cycles stalled on memory, the pattern that
            pointed at the execution units in the physics step. Here it can also mean the thread is waiting for the
            GPU, which the CPU counters see as back-end bound, and perf&apos;s documentation limits the four shares to
            a workload bound by the CPU. The frame rates, 209, 937 and 1,191 per second, hold for this program; to
            compare rendering hardware, sample the GPU&apos;s activity beside the CPU counters.{' '}
            <Cite id="F08-64">our profiling report, camera render table</Cite>{' '}
            <Cite id="F08-9">Linux v7.3, perf stat documentation</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Divide a Spark core's figures by a Jetson core's, part by part, and learn when a workload's ratio compares the two machines cleanly"
          >
            The gap between the machines is a different ratio for each part
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The microbenchmarks measure what one core can do at best, one part at a time. Arithmetic is the rate of
            fused multiply-adds, single instructions that compute a x b + c, over 24 independent chains held in
            registers so that nothing waits on memory; the chains are scalar, so the figure leaves out the vector
            units (NEON and SVE, Arm&apos;s instructions that work on several numbers at once). Memory bandwidth is
            measured by the triad. <Cite id="F08-65">our profiling report, FMA row</Cite>
          </Box>
          <Box variant="p">
            Memory latency is measured by a pointer chase, in which each read gives the address of the next, so one
            read is in flight at a time and each pays the full trip to memory. Its reads land at random over a large
            area, so the figure also carries misses in the TLB (translation lookaside buffer, the core&apos;s cache of
            address translations), at a page size that was not recorded. The{' '}
            <Link href="../silicon-memory-inference/">Silicon, Memory &amp; Inference dive</Link> builds the memory
            hierarchy behind both memory figures. <Cite id="F08-67">our profiling report, latency row</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ ...TABLE, minWidth: 680 }}>
              <thead>
                <tr>
                  <th style={TH}>Part, or program, on one core</th>
                  <th style={TH}>Jetson, Cortex-A78AE</th>
                  <th style={TH}>Spark, Cortex-A725</th>
                  <th style={TH}>Spark, Cortex-X925</th>
                  <th style={TH}>X925 against A78AE, times</th>
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
                    <Cite id="F08-64">our profiling report, camera render table</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            The gap is 6.5 times on arithmetic, 3.8 on streaming from memory and 2.4 on the wait for one load. A
            workload&apos;s ratio compares the machines cleanly when one program, at one version, runs out of the same
            part on both. The physics step shows a core limit on all three cores, so its <Derived>3.9</Derived> would
            compare two cores if both had run one MuJoCo version; they ran two. The render&apos;s{' '}
            <Derived>5.7</Derived> includes a GPU share nobody measured.{' '}
            <Cite id="F08-65">our profiling report, FMA row</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>{' '}
            <Cite id="F08-67">our profiling report, latency row</Cite>{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Box variant="p">
            The dense-layer stand-in shows how a ratio drifts when the limiting part changes between machines. The
            Jetson core drew <Derived>84%</Derived> of its triad figure and the X925 more than all of its own, so the
            ratio, 1,968 / 390 = <Derived>5.0</Derived>, runs past the streaming ratio of 3.8: memory bounds the
            Jetson&apos;s side of the division and not the X925&apos;s.{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-63">our arithmetic on the policy stand-in</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>
          </Box>
          <Box variant="p">
            Inside the Spark the physics step passes the test: one MuJoCo version, one memory, and a core limit on both
            cores. The X925&apos;s <Derived>2.0</Derived> times the A725&apos;s steps comes only in part from its
            twice-as-many slots: it finished 4.37 instructions per cycle against the A725&apos;s 3.01,{' '}
            <Derived>1.45</Derived> times as many, because it kept a smaller share of its slots (45.7% of 10 against
            61.0% of 5). If a step takes the same instructions on both cores, as one program at one version should,
            the remaining <Derived>2.0</Derived> / <Derived>1.45</Derived> = <Derived>1.4</Derived> is the ratio of
            their clocks. On the dense-layer stand-in the X925 gained 1,968 / 1,404 = <Derived>1.4</Derived> times at
            nearly the same instructions per cycle (3.07 and 2.96): the extra width added almost nothing to a program
            that streams its weights. <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-68">our profiling report, slots self check</Cite>
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
            The GPU side of the measurements is one kernel per machine, a kernel being one function launched on the
            GPU. Each machine multiplied two square float32 matrices under Nsight Compute, NVIDIA&apos;s profiler for a
            single kernel. It reports two throughput figures, each a share of the GPU&apos;s maximum: one for compute
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
            Both profiles show compute near three quarters of its maximum (70.49% and 74.49%) and memory near half
            (50.47% and 48.27%). The Spark&apos;s kernel is a simt kernel, which we read as the GPU&apos;s general path
            (single instruction, multiple threads) rather than its tensor cores, the units built for the matrix
            arithmetic of neural networks, so this float32 run leaves the tensor cores unmeasured.{' '}
            <Cite id="F08-71">our DGX Spark card, GPU kernel</Cite>{' '}
            <Cite id="F08-72">our Jetson card, GPU kernel</Cite>
          </Box>
          <Box variant="p">
            The two durations measure different work at different clocks. The Spark multiplied 4096x4096 matrices in
            8.35 ms and the Jetson 2048x2048 matrices in 42.31 ms, an eighth of the work. As rates, 2 x 4096^3
            operations in 8.35 ms is about 16,460 billion floating-point operations a second and 2 x 2048^3 in 42.31 ms
            is 406 billion, but the Jetson&apos;s SM clock was 306 MHz during its profile against the Spark&apos;s 2.13
            GHz, and on a Jetson the GPU clock moves with load. Record the clock with every GPU profile on a Jetson, or
            pin it, and compare two GPUs only on the same matrix size under the same profiler version.{' '}
            <Cite id="F08-71">our DGX Spark card, GPU kernel</Cite>{' '}
            <Cite id="F08-72">our Jetson card, GPU kernel</Cite>
          </Box>
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
            A program with a known answer tests the split. The pointer chase, which waits on memory by construction,
            reads 97.6% to 99.0% back-end bound on all three cores, and the multiply-add loop, which keeps its data in
            registers, reads 0.0% front-end bound on the X925. <Cite id="F08-67">our profiling report, latency row</Cite>{' '}
            <Cite id="F08-65">our profiling report, FMA row</Cite>
          </Box>
          <Box variant="p">
            A repeat tests it too. The two passes agree on the three workloads, throughput within 2.5% and every share
            within <Derived>0.7</Derived> points, and on the triad and a memory-write loop they agree on throughput and
            not on the split. The Jetson&apos;s triad ran at 11.66 GB/s with 5.9% of slots front-end bound and 76.9%
            back-end bound in pass 1, and at 11.71 GB/s with 78.1% front-end bound, 7.9% back-end bound and 2.6% of
            cycles stalled on memory in pass 2, which is not what a loop limited by memory looks like. A split that
            changes sides at the same speed cannot say where the time went: take those loops&apos; throughput and leave
            their split, and run a new program at least twice before acting on its shares.{' '}
            <Cite id="F08-73">limits of our measurements</Cite>{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>
          </Box>
          <ExpandableSection headerText="Two checks that confirm the arithmetic rather than the split">
            <SpaceBetween size="s">
              <Box variant="p">
                The four shares add to exactly 100% on every card because the formula makes them: the two stall
                counters add up to <code>stall_slot</code> exactly in all 51 rows of the second pass, and retiring plus
                bad speculation is the rest by construction. <Cite id="F08-69">our check of the counter identity</Cite>
              </Box>
              <Box variant="p">
                Recomputed from the raw counter files, every share on the cards matches. One, worked: the X925&apos;s
                physics step had 72,922,813,391 back-end stalled slots over 19,958,256,358 cycles x 10 slots, which is
                36.54%, shown as 36.5%. <Cite id="F08-70">our recomputation from the raw counters</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Learn which four measurements turn these cards into a sizing tool and what each one changes, and run the same reading on your own workload today"
          >
            What a card needs before it can size an EC2 instance
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Four additions turn these cards into a sizing tool. The arm&apos;s real workloads replace the stand-ins, so
            a card measures the program the arm runs; each needs its own unit of work, such as actions per second with
            the median time per call and the time only one call in a hundred exceeds (p50 and p99). Repeats give every
            figure a spread, so a gap between two machines can be told apart from the difference between two runs.{' '}
            <Cite id="F08-74">our list of measurements still owed</Cite>
          </Box>
          <Box variant="p">
            EC2 instances replace the edge machines, so the ratio is between machines you can rent: Graviton sizes,
            whose cores are Arm Neoverse designs, and GPU sizes of the G and P families. Each needs a check first of
            which counters it exposes. Sizes that hold an entire dedicated processor socket generally get every event,
            and AWS lists full support from c9g.12xlarge and c8g.24xlarge; smaller sizes of newer generations get a
            reduced set, and smaller sizes of older generations possibly none. GPU counters add the GPU&apos;s share of
            the render and the policy, which a CPU card cannot see.{' '}
            <Cite id="F08-74">our list of measurements still owed</Cite>{' '}
            <Cite id="F08-56">AWS Graviton guide, processor table</Cite>{' '}
            <Cite id="F08-25">AWS Graviton guide, PMU counters</Cite>{' '}
            <Cite id="F08-26">AWS Graviton guide, PMU support table</Cite>
          </Box>
          <Placeholder
            what={
              <>
                cards for the arm&apos;s real workloads on the Jetson Orin Nano and the DGX Spark, in place of the
                stand-ins: recording and encoding two camera streams, decoding the episodes, the {ARM} MuJoCo step,
                fine-tuning ACT (Action Chunking with Transformers, the imitation policy of section 4) and SmolVLA
                (the small vision-language-action model of section 5), training LeWorldModel (the latent world model
                of section 7), and ACT or SmolVLA inference at the arm&apos;s control rate. Each card carries its unit
                of work, such as environment steps per second or actions per second with p50 and p99 latency per call.
              </>
            }
            source={<>{PROJECT}, on the same two edge machines; not yet run.</>}
          />
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
            Until those cards land, take the method and leave the ranking. Pin your own workload to one core, count the
            six slot events under <code>perf stat</code>, and write down its rate and four shares; run it twice and keep
            the split only if it holds. Count what one unit of work asks of the part the shares point at, as 390 x
            25.2 MB = 9.8 GB/s did against the Jetson core&apos;s 11.71 GB/s. Compare two machines on that workload
            only when one program, at one version, runs out of the same part on both: inside the Spark the physics step
            passes and its <Derived>2.0</Derived> compares two cores, while across the machines its 14,507 against
            57,240 steps per second also carries two MuJoCo versions. Where the test passes, section 23,
            Price-Performance and Latency, turns the two rates into work per price, per watt and per deadline.{' '}
            <Cite id="F08-63">our arithmetic on the policy stand-in</Cite>{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
