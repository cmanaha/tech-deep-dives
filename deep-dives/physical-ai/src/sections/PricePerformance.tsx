import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Toy, Derived } from '../components/Cite';
import { Figure } from '../components/Figure';
import { Formula } from '../components/Math';
import { Placeholder } from '../components/Blocks';
import { linear, ticks, fmt } from '../lib/scale';
import { ARM } from '../lib/task';

/* The two machines of our own measurements, named once so every mention reads the same. */
const JETSON = 'NVIDIA Jetson Orin Nano Super';
const SPARK = 'NVIDIA DGX Spark';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const MUTED = '#5f6b7a';
const CPU_FILL = '#e8f1fb';
const CPU_INK = '#1f5fa8';

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/* ------------------------------------------------------------------------ */
/* Block 1: one unit of work per workload (register entry F08-81)            */
/* ------------------------------------------------------------------------ */

interface UnitRow {
  workload: string;
  unit: string;
}

/* The three workloads held against a clock; the batch workloads sit in an expandable panel. */
const CLOCK_UNITS: UnitRow[] = [
  {
    workload: 'On-robot inference',
    unit: 'Actions, or chunks of actions, per second, and the time of one call at the median (p50) and at the ninety-ninth percentile (p99). Only one call in a hundred takes longer than the p99.',
  },
  { workload: 'Record and encode', unit: 'Camera-seconds encoded per second. Real time is 1.0 for each camera.' },
  { workload: 'Dataloader decode and augment', unit: 'Frames decoded per second and delivered to the training job.' },
];

const BATCH_UNITS: UnitRow[] = [
  { workload: 'Decode and filter', unit: 'Frames decoded per second.' },
  {
    workload: 'Embed and deduplicate',
    unit: 'Clips embedded per second. A clip is a short cut of video. Embedding a clip means running it through a vision model to get a vector that represents it.',
  },
  { workload: 'CPU physics step', unit: 'Environment steps per second.' },
  { workload: 'GPU-parallel physics', unit: 'Environment steps per second, summed over all the copies of the arm that the GPU simulates.' },
  { workload: 'Simulated cameras', unit: 'Frames rendered per second, at a stated resolution.' },
  { workload: 'Policy fine-tune; world-model training', unit: 'Training samples per second, and the wall-clock time to reach a fixed number of training steps.' },
  { workload: 'Closed-loop evaluation', unit: 'Episodes evaluated per hour. An episode is one attempt at the task.' },
  { workload: 'Engine build', unit: 'Minutes per engine. An engine is the model compiled for one device (section 17, Running on the Robot).' },
  { workload: 'Generative augmentation', unit: 'Clips per GPU-hour, taken from published figures. A GPU-hour is one GPU running for one hour.' },
  {
    workload: 'Robot foundation-model pretraining; world-model pretraining',
    unit: 'One finished run. Published figures give the GPU-hours that a run took, which is a cost per unit rather than a rate.',
  },
];

function UnitTable({ caption, rows }: { caption: string; rows: UnitRow[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <caption style={{ textAlign: 'left', paddingBottom: 6, color: MUTED }}>{caption}</caption>
        <thead>
          <tr>
            <th scope="col" style={TH}>
              Workload
            </th>
            <th scope="col" style={TH}>
              Unit of work
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.workload}>
              <th scope="row" style={{ ...TD, textAlign: 'left' }}>
                {r.workload}
              </th>
              <td style={TD}>{r.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 23.1 (chart): units of work per second on the two edge machines   */
/* Register entries F08-61, F08-62, F08-64; MuJoCo versions from F08-73.     */
/* ------------------------------------------------------------------------ */

interface Bar {
  value: number;
  where: string;
}

interface Panel {
  title: string;
  what: string;
  unit: string;
  axis: string;
  max: number;
  step: number;
  bars: Bar[];
}

const PANELS: Panel[] = [
  {
    title: 'Physics test program',
    what: 'MuJoCo humanoid model, one core',
    unit: 'steps/s',
    axis: 'simulation steps per second (linear scale)',
    max: 60000,
    step: 20000,
    bars: [
      { value: 14507, where: 'Jetson Orin Nano Super, Cortex-A78AE, MuJoCo 3.17.0' },
      { value: 28662, where: 'DGX Spark, Cortex-A725, MuJoCo 4.0.1' },
      { value: 57240, where: 'DGX Spark, Cortex-X925, MuJoCo 4.0.1' },
    ],
  },
  {
    title: 'Policy test program',
    what: 'Six dense layers in NumPy, one core',
    unit: 'inferences/s',
    axis: 'inferences per second (linear scale)',
    max: 2000,
    step: 500,
    bars: [
      { value: 390, where: 'Jetson Orin Nano Super, Cortex-A78AE' },
      { value: 1404, where: 'DGX Spark, Cortex-A725' },
      { value: 1968, where: 'DGX Spark, Cortex-X925' },
    ],
  },
  {
    title: 'Camera render test program',
    what: 'MuJoCo offscreen 640x480, one core',
    unit: 'frames/s',
    axis: 'frames rendered per second (linear scale)',
    max: 1200,
    step: 400,
    bars: [
      { value: 209, where: 'Jetson Orin Nano Super, Cortex-A78AE, MuJoCo 3.17.0' },
      { value: 937, where: 'DGX Spark, Cortex-A725, MuJoCo 4.0.1' },
      { value: 1191, where: 'DGX Spark, Cortex-X925, MuJoCo 4.0.1' },
    ],
  },
];

const CHART_X0 = 16;
const CHART_X1 = 396;
const PANEL_H = 284;
const ROW_H = 60;

function UnitsChart() {
  return (
    <svg
      viewBox="0 0 420 868"
      role="img"
      aria-labelledby="price-performance-units-title"
      style={{ width: '100%', height: 'auto' }}
      fontFamily="sans-serif"
    >
      <title id="price-performance-units-title">Units of work per second for three test programs, on one core of each of three core types</title>
      <desc>
        Three stacked bar charts. Physics test program: 14,507 steps per second on the Jetson Cortex-A78AE, 28,662 on the DGX
        Spark Cortex-A725 and 57,240 on the DGX Spark Cortex-X925. Policy test program: 390, 1,404 and 1,968 inferences per
        second. Camera render test program: 209, 937 and 1,191 frames per second. Every bar is a single run on one core.
      </desc>
      <rect x="0" y="0" width="420" height="868" fill="#fbfbfd" />
      {PANELS.map((p, pi) => {
        const top = 10 + pi * PANEL_H;
        const x = linear(0, p.max, CHART_X0, CHART_X1);
        const axisY = top + 46 + p.bars.length * ROW_H - 4;
        return (
          <g key={p.title}>
            <text x={CHART_X0} y={top + 16} fontSize="14" fontWeight="bold" fill={CPU_INK}>
              {p.title}
            </text>
            <text x={CHART_X0} y={top + 33} fontSize="12" fill={MUTED}>
              {p.what}
            </text>
            {p.bars.map((b, bi) => {
              const y = top + 46 + bi * ROW_H;
              return (
                <g key={b.where}>
                  <text x={CHART_X0} y={y + 13} fontSize="13" fill={INK}>
                    <tspan fontWeight="bold">
                      {fmt(b.value)} {p.unit}
                    </tspan>
                    <tspan>, single run</tspan>
                  </text>
                  <text x={CHART_X0} y={y + 29} fontSize="12" fill={MUTED}>
                    {b.where}
                  </text>
                  <rect x={CHART_X0} y={y + 35} width={x(b.value) - CHART_X0} height="12" fill={CPU_FILL} stroke={CPU_INK} strokeWidth="1.5" />
                </g>
              );
            })}
            <line x1={CHART_X0} y1={axisY} x2={CHART_X1} y2={axisY} stroke={MUTED} strokeWidth="1" />
            {/* Axis ticks repeat nothing a reader needs read aloud: every bar carries its value as text. */}
            <g aria-hidden="true">
              {ticks(0, p.max, p.step).map((t) => (
                <g key={t}>
                  <line x1={x(t)} y1={axisY} x2={x(t)} y2={axisY + 5} stroke={MUTED} strokeWidth="1" />
                  <text x={x(t)} y={axisY + 19} fontSize="12" fill={MUTED} textAnchor={t === 0 ? 'start' : t === p.max ? 'end' : 'middle'}>
                    {fmt(t)}
                  </text>
                </g>
              ))}
            </g>
            <text x={(CHART_X0 + CHART_X1) / 2} y={axisY + 37} fontSize="12" fill={INK} textAnchor="middle">
              {p.axis}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* The section                                                               */
/* ------------------------------------------------------------------------ */

export function PricePerformance() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="A machine that does five times the work is the better buy only if it costs less than five times as much. To compare two machines fairly, you count the same unit of work on both, then divide each rate by the hourly price of a cloud instance or by the power that a computer next to the robot draws. For the policy that controls the arm, you also check that its slowest calls finish before the arm runs out of actions."
          >
            23. Price-Performance and Latency: Comparing Machines on the Same Unit of Work
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Suppose one machine does five times as much work per second as another. In the cloud, it is the better
            buy only if its price is less than five times as high. For a computer next to the robot, you also
            compare power: the faster machine does more work per unit of energy only if it draws less than five
            times the power.{' '}
            <Cite id="F08-82">the cloud formula</Cite> <Cite id="F08-83">the edge formula</Cite>
          </Box>
          <Box variant="p">
            The factor of five is meaningful only if both machines are measured on the same unit of work, such as a
            decoded frame or a policy call, with the same model and the same software release. If the model or the
            software differs, the ratio measures those differences as well as the machines.
          </Box>
          <Box variant="p">
            For the policy that controls the arm, each call also has a deadline. Its slowest calls, not its
            average call, must finish before the arm runs out of actions to play. We have not yet collected any
            prices or any power readings under load, so we cannot yet say which machine is the better buy on price
            or on energy. <Cite id="F08-59">prices not collected</Cite>{' '}
            <Cite id="F08-83">no power reading under load</Cite>
          </Box>
          <Box variant="p">
            Our own measurements give an example of such a ratio. In place of a real policy, we ran a small test
            program made of six dense layers. A dense layer multiplies its input by a weight matrix, and one
            inference is one pass through all six layers. In single runs, the program did 390 inferences per second
            on one core of an {JETSON}, and 1,968 inferences per second on one of the larger Cortex-X925 cores of
            an {SPARK}. Per core, the Spark is 1,968 / 390 = <Derived>5.0</Derived> times as fast.{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>
          </Box>
          <Box variant="p">
            This program keeps only one core busy, so each machine&apos;s rate for it is the rate of that one core.
            For this job, the Spark is the better buy only if the whole Spark costs less than{' '}
            <Derived>5.0</Derived> times as much as the Jetson. Per unit of energy, the Spark is better only if it
            draws less than <Derived>5.0</Derived> times the power of the whole Jetson board. A job that loads every
            core, or the GPU, needs its own ratio, measured with those parts loaded. A ratio measured on one core
            does not predict the ratio for the whole machine (section 22, Our Measurements).{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Box variant="p">
            On the Jetson, memory bandwidth limits this rate. Each inference reads all of the weights, which are 6 x
            1024 x 1024 x 4 bytes = 25.2 MB. That is more than any cache on either machine can hold, so the weights
            come from main memory on every inference. At 390 inferences per second, the core reads 390 x 25.2 MB =
            9.8 GB/s from memory. In a memory test that streams through large arrays, one Jetson core reached 11.71
            GB/s, so the program runs close to that limit. The core&apos;s hardware performance counters also showed
            that 62.3% of its clock cycles were stalled, waiting for memory.{' '}
            <Cite id="F08-63">the test program&apos;s weights against the core&apos;s memory limits</Cite>{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>
          </Box>
          <Box variant="p">
            So memory bandwidth is the bottleneck for this job on the Jetson. When you weigh the Jetson&apos;s price
            or power for this job, weigh it against the memory bandwidth that the Jetson provides. Faster arithmetic
            does not raise the rate, because the core is already waiting for memory.
          </Box>
          <Box variant="p">
            The Spark core behaves differently. At 1,968 inferences per second, the X925 core reads 49.5
            GB/s from memory. That is more than the 44.38 GB/s the same core reached in its memory test, so a single
            run of that test does not show the most bandwidth the core can get. Only 22.4% of the X925&apos;s clock
            cycles were stalled waiting for memory.{' '}
            <Cite id="F08-63">the test program&apos;s weights against the core&apos;s memory limits</Cite>{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>
          </Box>
          <Box variant="p">
            The memory test figures of the two cores differ by a factor of 3.8, while the per-core speed ratio is{' '}
            <Derived>5.0</Derived>. Neither core&apos;s single run of the memory test is shown to be the most
            bandwidth that core can get, and on the X925 the program already reads more than the X925&apos;s own
            test figure. So the factor of 3.8 neither sets an upper limit on the <Derived>5.0</Derived> nor explains it.
            Several things may each contribute to the <Derived>5.0</Derived>: memory bandwidth that the test did not
            reach, the core itself and the software. We did not record the NumPy release on either machine, so our
            data cannot separate these causes. Before you compare prices on this ratio, measure the Spark with the
            software you plan to run.{' '}
            <Cite id="F08-66">our profiling report, triad row</Cite>{' '}
            <Cite id="F08-63">the test program&apos;s weights against the core&apos;s memory limits</Cite>{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="To rank two machines on a workload, you count how many units of work each one delivers per second, and each workload has its own unit. GPU utilisation is not a unit of work, because a GPU that reads 100% busy may be running only one small program."
          >
            Choosing the unit of work for each workload
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The arm&apos;s learning loop is a chain of jobs, from recording episodes to training the policy and
            running it on the arm. Each job produces something that the next job consumes. The decoder delivers
            decoded frames to the training job, the simulator delivers simulation steps to the evaluation, and the
            policy delivers actions to the arm. What one job hands to the next is called its unit of work. The next
            job waits for exactly that unit, so the machine that delivers more units per second is faster at the
            job, whatever its other counters show.
          </Box>
          <Box variant="p">
            GPU utilisation cannot rank two machines. A kernel is a program launched on the GPU. The utilisation
            figure that <code>nvidia-smi</code> prints is the share of its sample period during which at least one
            kernel was running. It says nothing about how much of the GPU that kernel used, so one small kernel
            launched back to back reads 100%. A count of frames per second, on the other hand, can rank two
            machines.{' '}
            <Cite id="F08-30">nvidia-smi documentation, &quot;Utilization&quot;</Cite>
          </Box>
          <Box variant="p">
            Each of the fifteen workloads in section 20, The Fifteen Workloads, has a unit of work. For a batch job,
            the faster machine simply finishes sooner, so the rate is all you need to compare. Three workloads must
            also keep up with a clock, and for them the rate is only half of the answer.{' '}
            <Cite id="F08-81">the unit of work per workload</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Record and encode.</strong> The encoder must keep up with real time, which is 1.0
              camera-second encoded per second for each camera. If it is slower, it falls behind the cameras while
              the arm moves.
            </li>
            <li>
              <strong>Dataloader decode and augment.</strong> The dataloader must keep pace with the training GPU.
              If it is slower, the GPU waits for samples.
            </li>
            <li>
              <strong>On-robot inference.</strong> Every policy call has a deadline, counted in control periods. A
              control period is the time between two commands to the motors, which is 33.3 ms when the arm is
              driven at 30 Hz (section 3, The Robot as a Computer).{' '}
              <Cite id="F08-84">the latency method, with the control period</Cite>
            </li>
          </ul>
          <UnitTable caption="The three workloads that must keep up with a clock, and the unit of work to count for each" rows={CLOCK_UNITS} />
          <ExpandableSection headerText="The unit of work for each batch workload">
            <UnitTable
              caption="The batch workloads of section 20, The Fifteen Workloads, and the unit of work to count for each"
              rows={BATCH_UNITS}
            />
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Before you divide one machine's rate by another's, check that both rates use the same unit, the same model and the same software. This applies to a vendor's figures too: in NVIDIA's own table, changing the runtime moves one policy's call time more than changing the machine does."
          >
            Checking that two rates are comparable
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            NVIDIA publishes a latency table for its GR00T N1.7 robot model. TensorRT is NVIDIA&apos;s inference
            compiler. On a Jetson Orin, NVIDIA reports a median of 357.9 ms per call in plain PyTorch and 149.0 ms
            with TensorRT, so changing only the runtime makes the call <Derived>2.4</Derived> times faster. The
            table does not say which Jetson Orin module it used. AGX Thor is a larger NVIDIA computer for robots.
            With TensorRT on an AGX Thor, NVIDIA reports 76.8 ms, so changing only the machine makes the call 1.94
            times faster than on the Orin. In this table, changing the runtime speeds up the call more than changing
            the machine does.{' '}
            <Cite id="F07-1">Isaac-GR00T deployment README, benchmark table</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, Jetson Orin and AGX Thor rows</Cite>
          </Box>
          <Box variant="p">
            A ratio of two rates therefore describes the two machines only when three things match:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>The unit.</strong> Steps of one simulated arm and steps summed over thousands of copies of the
              arm on a GPU are printed the same way, but they are different units.
            </li>
            <li>
              <strong>The model.</strong> A rate measured with a small policy says nothing about a large one.
            </li>
            <li>
              <strong>The software.</strong> The software release, the runtime and, on a Jetson, the power mode
              must all match.
            </li>
          </ul>
          <Box variant="p">
            NVIDIA&apos;s table gives one median for each of three runtimes: plain PyTorch,{' '}
            <code>torch.compile</code> and TensorRT. <code>torch.compile</code> is PyTorch&apos;s own compiler.
            NVIDIA ran its Orin in the MAXN power mode. So you can compare a call time that you measure with
            NVIDIA&apos;s figure only when the model, the runtime and the power mode are the same.{' '}
            <Cite id="F07-1">Isaac-GR00T deployment README, benchmark table</Cite>{' '}
            <Cite id="F07-3">Isaac-GR00T deployment README, &quot;Measurement details&quot;</Cite>
          </Box>
          <Box variant="p">
            We measured three test programs (section 22, Our Measurements). Each program ran on one core of each
            core type: the Jetson&apos;s Cortex-A78AE, and the Spark&apos;s larger Cortex-X925 and smaller
            Cortex-A725. The three programs are:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Policy test program.</strong> It runs the six dense layers described above, in NumPy.
            </li>
            <li>
              <strong>Physics test program.</strong> MuJoCo is a robot physics simulator. This program uses it to
              step a model of a humanoid, a robot with two legs and two arms.
            </li>
            <li>
              <strong>Camera render test program.</strong> This program uses MuJoCo to render a camera image.
            </li>
          </ul>
          <Box variant="p">
            None of the three programs is the arm&apos;s real work. The physics model is a humanoid, while the arm
            is an {ARM}. The policy test program runs dense layers on a CPU core, while real policies run
            convolutions and attention on a GPU.{' '}
            <Cite id="F08-73">limits of our measurements</Cite>{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>
          </Box>
          <Figure
            cites="F08-61 F08-62 F08-64 F08-73"
            caption={
              <>
                Our measurements of the three test programs, each a single run on one core. Each panel uses its own
                unit. In the physics and policy panels, the two Spark bars pass all three checks, because they come
                from one machine with one software installation. Across the two machines, the physics and render
                bars carry different MuJoCo versions in their labels, so those comparisons fail the software check.
                EGL is an interface for hardware-accelerated drawing without a display, and the render program drew
                its frames through it. The render panel cannot rank processors, because the run did not establish
                how much of each frame the GPU drew.
              </>
            }
          >
            <div style={{ maxWidth: 600 }}>
              <UnitsChart />
            </div>
          </Figure>
          <Box variant="p">
            Within the Spark, the two physics bars pass all three checks, because both cores stepped the same model
            with the same MuJoCo release, 4.0.1. So for this job, the Cortex-X925 core is 57,240 / 28,662 ={' '}
            <Derived>2.0</Derived> times as fast as the Cortex-A725 core. The Spark has ten cores of each type, so
            place this physics job on its ten X925 cores first, and use its ten A725 cores only when the X925 cores
            are all busy.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>{' '}
            <Cite id="F07-47">DGX Spark user guide, hardware</Cite>
          </Box>
          <Box variant="p">
            Across the two machines, the physics panel fails the software check, because the Jetson ran MuJoCo 3.17.0.
            The ratio 57,240 / 14,507 = <Derived>3.9</Derived> therefore mixes the difference between the
            processors with the difference between the simulator releases. Only a run of both machines on the same
            release would separate the two.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Box variant="p">
            Across the two machines, the policy bars pass the unit check and the model check. We cannot tell whether
            they pass the software check, because we did not record the NumPy release on either machine. The render
            panel cannot rank either CPU cores or GPUs, because the run did not establish how much of each frame
            the GPU drew.{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-64">our profiling report, camera render table</Cite>
          </Box>
          <Placeholder
            what={
              <>
                Units of work per second for the arm&apos;s real workloads on three kinds of EC2 instance. The
                workloads are the {ARM} simulation, video decoding and embedding, and policy and world-model
                training. The instance kinds are the P families, whose GPUs are built for training; the G families,
                whose GPUs also have graphics and video hardware; and Graviton instances, which use AWS&apos;s own
                Arm processors. We have not measured any EC2 instance yet.{' '}
                <Cite id="F08-73">limits of our measurements</Cite>
              </>
            }
            source={<>Our profiling project, run on EC2 instances. It has not been run yet.</>}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="To compare cloud instances, divide each rate by the price of the whole instance and count only the units of work that finish. Price each workload on an instance type built around its bottleneck. For example, if you train on a P5 instance from LeRobot's recordings, which are AV1 video by default, the price of each training sample includes the CPU work of decoding that video."
          >
            Comparing cloud instances per unit of price
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A cloud instance is rented by the hour, so you divide its rate by the price of one hour. Use AWS&apos;s
            published price on a known date, for one Region and one purchase option. The purchase options include
            On-Demand, Spot Instances that AWS can reclaim, and capacity reserved in advance (section 24,
            Orchestrating Physical AI on AWS). The same instance type has a different price under each purchase
            option.
          </Box>
          <Formula
            name="Cloud instances: units of work per unit of currency"
            tex={String.raw`\begin{aligned} &\text{units per currency unit} \\ &= \frac{\text{units per second} \times 3{,}600}{\text{price per hour}} \end{aligned}`}
            source={<Cite id="F08-82">the cloud formula</Cite>}
          />
          <Box variant="p">
            The factor 3,600 converts a rate per second into a rate per hour, which is the period the price covers.
            Two corrections keep the result tied to the work that is actually done.{' '}
            <Cite id="F08-82">the cloud formula</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Divide by the price of the whole instance.</strong> Do this even when the job uses only one
              part of the instance. A decode job on a GPU instance still pays for the GPU, although the GPU sits
              idle.
            </li>
            <li>
              <strong>Count only the units that finished.</strong> For a batch job on Spot Instances, a unit that is
              lost when AWS reclaims the instance delivers nothing.{' '}
              <Cite id="F08-82">the cloud formula, corrections</Cite>
            </li>
          </ul>
          <Box variant="p">
            The first correction also tells you which instance type to choose. Price each workload on an instance
            type built around its bottleneck. On any other instance type, you pay for parts of the machine that the
            workload leaves idle. Section 20, The Fifteen Workloads, names the bottleneck of each workload, and for
            closed-loop evaluation it names the mix of resources that the workload uses. For video decoded in
            software and for CPU physics, the bottleneck is the CPU cores. So run these workloads on CPU instances,
            or on a GPU instance with many CPU cores per GPU. Count physical cores, not vCPUs (virtual CPUs). EC2 lists vCPUs,
            and two vCPUs can be two threads of one physical core.{' '}
            <Cite id="F08-85">price-performance per part</Cite>{' '}
            <Cite id="F08-57">the instance specifications, CPU per GPU</Cite>
          </Box>
          <Box variant="p">
            EC2&apos;s GPU instances differ in how many physical CPU cores they provide for each GPU. G7 is one of
            the G families, the EC2 GPU instances whose GPUs also have graphics and video hardware. G7 lists 24
            vCPUs per GPU with one thread per core, which gives 24 physical cores per GPU. The other eight-GPU sizes
            that list 24 vCPUs per GPU are G5, G6, G6e, G7e, P5, P5e, P5en, P6-B200 and P6-B300. They run two
            threads per core, so they have 12 physical cores per GPU. G7 therefore gives twice as many cores per GPU
            to the work that stays on the CPU.{' '}
            <Cite id="F08-57">the instance specifications, CPU per GPU</Cite>{' '}
            <Cite id="F08-85">price-performance per part</Cite>
          </Box>
          <Box variant="p">
            The arm&apos;s recordings show how this rule applies to a real choice. By default, LeRobot records video
            in AV1 (AOMedia Video 1), a video compression format (section 9, Collecting Data). P5 is an EC2 instance
            family for training, and the video decoders of its H100 GPUs cannot decode AV1. So for a training run on
            a P5 instance, you have two options: decode the recordings on the 12 physical cores per GPU of its
            eight-GPU size, or re-encode them first. In both cases, the price per training sample includes that CPU work.{' '}
            <Cite id="F05-43">LeRobot streaming video encoding docs, Choosing a Codec</Cite>{' '}
            <Cite id="F08-58">the instance table, video engines</Cite>{' '}
            <Cite id="F08-85">price-performance per part</Cite>
          </Box>
          <Box variant="p">
            A third option is to train on a GPU that decodes AV1 itself. The RTX PRO 4500 GPU in G7 has three hardware video
            decoders that handle AV1, and the B200 GPUs in P6-B200 decode it too. Section 10, Processing and
            Curating, lists the other GPUs.{' '}
            <Cite id="F08-58">the instance table, video engines</Cite>{' '}
            <Cite id="F08-44">NVIDIA video support matrix, RTX PRO 4500</Cite>{' '}
            <Cite id="F05-48">NVIDIA video support matrix, Blackwell data-centre parts</Cite>
          </Box>
          <Box variant="p">
            To choose between CPU decoding on a P5, a one-time re-encode and a GPU that decodes AV1, measure three
            things: how many frames one CPU core decodes per second, how many training samples per second each
            instance processes, and what the one-time re-encode costs. With those measurements and prices read on
            a known date, the cloud formula tells you which option costs least per training sample.
          </Box>
          <Box variant="p">
            RT cores (ray-tracing cores) are the GPU units that trace rays, and a ray-tracing camera renderer needs
            them. The GPUs of the P families, which are built for training, do not have RT cores. So camera
            simulation with ray tracing can be priced only on the G families (section 13, Rendering and Ray
            Tracing).{' '}
            <Cite id="F08-85">price-performance per part</Cite>{' '}
            <Cite id="F08-58">the instance table, RT cores</Cite>
          </Box>
          <Placeholder
            what={
              <>
                AWS&apos;s published price for each instance type, Region and purchase option, read on a stated
                date. Next to every measured rate, a column will show the units of work per unit of price, computed
                with the cloud formula. <Cite id="F08-59">prices not collected</Cite>
              </>
            }
            source={<>AWS&apos;s published prices, read on a stated date and kept next to each result. They have not been collected yet.</>}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="For a computer next to the robot, you divide the rate by the power that the whole board draws while the work runs, which gives units of work per joule. NVIDIA's power range for the Jetson gives a lower bound on its work per joule, if the board stays within that range. To compare the Jetson with the Spark, you need power readings under load on both machines."
          >
            Comparing edge computers per unit of energy
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            You buy a computer next to the robot once, instead of renting it by the hour. It uses energy as it
            works, from a battery or a fixed power supply. So you divide its rate by its power draw in watts, which
            is the average power that the whole board draws while the workload runs.
          </Box>
          <Formula
            name="Edge computers: units of work per joule"
            tex={String.raw`\begin{aligned} &\text{units per joule} \\ &= \frac{\text{units per second}}{\text{watts}} \end{aligned}`}
            source={<Cite id="F08-83">the edge formula</Cite>}
          />
          <Box variant="p">
            If you multiply units per joule by the energy that a battery holds, you get the work that one charge can
            do. Use the power of the whole board, for the same reason that you divide a cloud job&apos;s rate by the
            price of the whole instance: the battery feeds every component, not only the one the job keeps busy. To
            include the purchase price, turn it into a cost per unit of capacity, which is the price divided by the
            units per second. For this cost, lower is better. For units per joule, higher is better.{' '}
            <Cite id="F08-83">the edge formula, with purchase price</Cite>
          </Box>
          <Box variant="p">
            Whether you get the power of the whole board depends on the tool you read it from. On a Jetson, the
            built-in monitor is called <code>tegrastats</code>. It prints the power drawn on each supply line of the
            board, which is called a rail. Its <code>VDD_IN</code> rail feeds the whole board, and our single idle
            reading on that rail was about 4.8 W. On the Spark, <code>nvidia-smi</code> reports the power of the GPU
            alone. It read 10 W at idle in our single reading, and that figure leaves out the CPU cores that our
            test programs ran on. We have no reading of the whole Spark system. If you divide a rate by the power of
            one part of a machine, the machine looks more efficient than it is.{' '}
            <Cite id="F08-40">Jetson Linux Developer Guide, Tegrastats Utility</Cite>{' '}
            <Cite id="F08-83">our idle readings</Cite>
          </Box>
          <Box variant="p">
            Until we have a reading under load, NVIDIA&apos;s power range for the Jetson developer kit, 7 W to 25 W,
            gives a lower bound on the Jetson&apos;s work per joule. The bound holds only if the board stayed within
            the 25 W at the top of that range. Our Jetson ran in its MAXN_SUPER power mode, and no reading shows that
            the board stayed within 25 W. If it did, the policy test program did at least{' '}
            <Derived>390 / 25 = 15.6</Derived> inferences per joule. In that case, the real figure is higher still,
            because only one of the six CPU cores was busy and the GPU was idle.{' '}
            <Cite id="F07-36">Jetson Orin Nano Super Developer Kit page</Cite>{' '}
            <Cite id="F08-83">the edge formula and our Jetson card</Cite>
          </Box>
          <Box variant="p">
            The same figures put bounds on the comparison with the Spark. On this one-core job, the Spark does more
            work per joule only if it draws less than <Derived>5.0</Derived> times the power of the whole Jetson
            board. That power level is the break-even point. A board under load draws at least as much as it draws
            at idle, which is about 4.8 W for this
            Jetson. So the break-even point is at least <Derived>5.0 x 4.8 = 24</Derived> W. It is at or below{' '}
            <Derived>5.0 x 25 = 125</Derived> W only if the Jetson board stays within its 25 W under load, and no
            reading shows that it does.{' '}
            <Cite id="F07-36">Jetson Orin Nano Super Developer Kit page</Cite>{' '}
            <Cite id="F08-83">the edge formula</Cite>
          </Box>
          <Box variant="p">
            The Spark&apos;s GPU alone draws 10 W at idle, before its CPU cores are counted. NVIDIA gives the
            Spark&apos;s chip a 140 W power budget and the machine a 240 W power supply. These specifications allow
            the Spark&apos;s power draw to fall on either side of the break-even point. Only readings under load on
            both machines can show which side it falls on.{' '}
            <Cite id="F07-47">DGX Spark user guide, hardware</Cite> <Cite id="F08-83">the edge formula</Cite>
          </Box>
          <Placeholder
            what={
              <>
                The power under load, in watts, for each workload on the Jetson and the Spark. With these readings,
                the rates in the chart become units of work per joule.{' '}
                <Cite id="F08-83">no power reading under load</Cite>
              </>
            }
            source={<>Our profiling project, in its runs on the Jetson and the Spark. These runs have not been done yet.</>}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="To check a policy against the arm's deadline, you work out how much time each chunk of actions leaves for the next call. Then you choose which latency percentile to compare, based on how many late calls you can accept. NVIDIA's published median comes from 60 timed calls, and a sample that small more often than not contains none of the slowest one percent of calls."
          >
            Checking the slowest policy calls against the deadline
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each policy call returns a chunk. A chunk is a set of future actions that the arm plays one per control
            period. With asynchronous inference, the next call starts while the arm is still playing the current
            chunk, so the arm does not have to stop and wait for it.
          </Box>
          <Box variant="p">
            A chunk is computed from what the cameras saw when its call began. So when the chunk arrives, the
            actions meant for the time the call took are already in the past, and they are dropped. The remaining
            actions last for the chunk&apos;s duration minus the time of one call, and they must keep the arm busy
            for the whole of the next call. So a call can take at most half of the chunk&apos;s duration. Section 17,
            Running on the Robot, sets out this rule as a formula.{' '}
            <Cite id="F07-22">LeRobot remote inference guide, &quot;Tuning&quot;</Cite>
          </Box>
          <Box variant="p">
            In NVIDIA&apos;s benchmark, one call of GR00T N1.7 returns 40 actions. Played on this arm at 30 Hz, they
            last 40 / 30 = <Derived>1.33</Derived> s. So a call can take up to half of that time, which is{' '}
            <Derived>20</Derived> control periods or <Derived>667</Derived> ms. NVIDIA&apos;s TensorRT median on its
            Jetson Orin is 149.0 ms, and <Derived>667 / 149.0 = 4.5</Derived>. So in NVIDIA&apos;s setup, even a
            call that takes up to <Derived>4.5</Derived> times the median still fits. That setup uses two 256x256
            camera inputs, on an Orin module that NVIDIA does not name, in the MAXN power mode. If your module or
            your cameras differ, time the calls on your own setup.{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>{' '}
            <Cite id="F07-3">Isaac-GR00T deployment README, &quot;Measurement details&quot;</Cite>
          </Box>
          <Box variant="p">
            A rate cannot tell you whether the slowest call stays within the time that the chunk leaves, because a
            rate is an average. The policy test program&apos;s 390 inferences per second correspond to an average of{' '}
            <Derived>1 / 390 s = 2.56 ms</Derived> per call. Neither the mean nor the median shows a rare slow call.
            As an illustration, suppose ninety-nine calls in a hundred take the typical time and one call takes ten
            times as long. The mean rises by 9% and the median does not change, yet that one call may last longer
            than the actions left in the chunk.{' '}
            <Cite id="F08-84">our profiling report, throughputs inverted</Cite>
          </Box>
          <Box variant="p">
            When you compare a latency percentile with the deadline, the percentile tells you how often a call can
            miss it. The p50, also called the median, is
            the time within which half of all calls finish. The p99, the ninety-ninth percentile, is the time within
            which ninety-nine calls in a hundred finish, so one call in a hundred is slower. As an
            illustration, take an arm that starts a call every <Toy>20</Toy> control periods, which is{' '}
            <Toy>30 / 20 = 1.5</Toy> calls per second. Such an arm meets a call slower than the p99 about once every{' '}
            <Toy>100 / 1.5 = 67</Toy> seconds.{' '}
            <Cite id="F08-84">the latency method, p50 and p99 against the control period</Cite>
          </Box>
          <Box variant="p">
            If that slow call lasts longer than the actions left in the chunk, the arm runs out of actions. LeRobot
            has a local real-time chunking mode, which runs the policy in a background thread of the process that
            drives the arm. In that mode, when the arm runs out of actions, a supported robot holds its last
            commanded position for up to one second by default. After that, the run stops with a fault.{' '}
            <Cite id="F07-20">LeRobot inference guide, Real-Time Chunking</Cite>
          </Box>
          <Box variant="p">
            You can make more time for a call in only three ways: a faster call, a longer chunk that the policy
            supports, or a different action rate.{' '}
            <Cite id="F07-22">LeRobot remote inference guide, &quot;Tuning&quot;</Cite> If one late call in a hundred
            is acceptable, compare the p99 with the time that the chunk leaves for a call. If no late call is
            acceptable, compare the slowest call instead.
          </Box>
          <Box variant="p">
            The published device tables give only the median. NVIDIA reports each figure in its GR00T N1.7 table as
            the median of 60 timed calls. On average, 60 calls contain <Derived>60 x 0.01 = 0.6</Derived> calls
            that are slower than the p99. The chance that they contain none at all is{' '}
            <Derived>0.99 to the power 60 = 0.55</Derived>. So more often than not, a sample of 60 calls contains
            none of the slow calls that can make the arm run out of actions. Our test program gives a mean and
            NVIDIA&apos;s table gives a median, so you have to get the p99 from your own timed calls.{' '}
            <Cite id="F07-3">Isaac-GR00T deployment README, &quot;Measurement details&quot;</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>{' '}
            <Cite id="F08-84">the latency method, no p99 in either</Cite>
          </Box>
          <Placeholder
            what={
              <>
                The p50 and p99 latency of each policy call on the device, next to the control period.{' '}
                <Cite id="F08-84">no p99 in our runs</Cite>
              </>
            }
            source={<>Our profiling project, in its runs on the Jetson and the Spark. These runs have not been done yet.</>}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="These five steps let you rank the machines you are choosing between on your own workload. The ranking uses your own measurements and a price read on the day you compare."
          >
            Measuring your own machines, step by step
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol style={LIST}>
            <li>
              <strong>Write down the unit of work.</strong> So that you can check any later figure for a
              like-for-like match, take the unit from the table for your job. Next to it, record the model, the
              software release and, on a Jetson, the power mode.{' '}
              <Cite id="F07-3">Isaac-GR00T deployment README, &quot;Measurement details&quot;</Cite>
            </li>
            <li>
              <strong>Count units per second.</strong> Measure each machine while every part that the job uses is
              loaded as it will be in real use. Record how many runs stand behind each figure. A rate measured on
              one core stands for the whole machine only when the job keeps one core busy.
            </li>
            <li>
              <strong>For cloud instances, divide by the price.</strong> Read the price on the day for your Region
              and purchase option. Divide the rate by the price of the whole instance, count only the finished units
              on Spot Instances, and keep the date next to the result.
            </li>
            <li>
              <strong>For edge computers, divide by the power.</strong> Record the power of the whole board while
              the work runs. On a Jetson, read it from the <code>VDD_IN</code> rail in <code>tegrastats</code>, and
              never use a reading of the GPU alone. Also record the board&apos;s purchase price.{' '}
              <Cite id="F08-83">our machine cards</Cite>
            </li>
            <li>
              <strong>For real-time work on the robot, time the policy calls.</strong> Time every call on its own,
              with the real policy on the real device and the cameras running. Run long enough that one call in a
              hundred adds up to many calls. As an illustration, one hour at <Toy>1.5</Toy> calls per second is{' '}
              <Toy>5,400</Toy> calls, and on average <Toy>54</Toy> of them are slower than the p99. Report the p50, the p99
              and the slowest call next to the time that your chunk leaves for a call.
            </li>
          </ol>
          <Box variant="p">
            When a new instance type or board appears, repeat steps 2 to 5 on it and keep the unit from step 1
            unchanged. With one measurement and one price read on a known date, you can add the new machine to the
            same table as the machines you have already ranked.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
