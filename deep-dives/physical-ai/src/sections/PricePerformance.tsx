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

/* The three workloads held against a clock; the twelve batches sit in an expandable panel. */
const CLOCK_UNITS: UnitRow[] = [
  {
    workload: 'On-robot inference',
    unit: 'Actions, or chunks of actions, per second, plus the time of one call at the median (p50) and at the ninety-ninth percentile (p99).',
  },
  { workload: 'Record and encode', unit: 'Camera-seconds encoded per second. Real time is 1.0 per camera.' },
  { workload: 'Dataloader decode and augment', unit: 'Frames decoded per second, delivered to the training job.' },
];

const BATCH_UNITS: UnitRow[] = [
  { workload: 'Decode and filter', unit: 'Frames decoded per second.' },
  {
    workload: 'Embed and deduplicate',
    unit: 'Clips embedded per second. A clip is a short cut of video; embedding it means running it through a vision model to get its vector.',
  },
  { workload: 'CPU physics step', unit: 'Environment steps per second.' },
  { workload: 'GPU-parallel physics', unit: 'Environment steps per second, summed over all the copies of the arm.' },
  { workload: 'Simulated cameras', unit: 'Frames rendered per second, at a stated resolution.' },
  { workload: 'Policy fine-tune; world-model training', unit: 'Training samples per second, and wall time to a fixed step count.' },
  { workload: 'Closed-loop evaluation', unit: 'Episodes evaluated per hour. An episode is one attempt at the task.' },
  { workload: 'Engine build', unit: 'Minutes per engine. An engine is the model compiled for one device (section 17).' },
  { workload: 'Generative augmentation', unit: 'Clips per GPU-hour, from published figures. One GPU running for one hour is one GPU-hour.' },
  {
    workload: 'Robot foundation-model pretraining; world-model pretraining',
    unit: 'One finished run. Published figures give the GPU-hours it took, a cost per unit rather than a rate.',
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
    title: 'Physics step stand-in',
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
    title: 'Policy inference stand-in',
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
    title: 'Camera render stand-in',
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
      <title id="price-performance-units-title">Units of work per second for three stand-in workloads on one core of each of three core types</title>
      <desc>
        Three bar charts stacked. Physics step stand-in: 14,507 steps per second on the Jetson Cortex-A78AE, 28,662 on the DGX
        Spark Cortex-A725, 57,240 on the DGX Spark Cortex-X925. Policy inference stand-in: 390, 1,404 and 1,968 inferences per
        second. Camera render stand-in: 209, 937 and 1,191 frames per second. Every bar is a single run on one core.
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
            description="Rank two machines for one workload on a unit of work both produce: divide its rate by price or by watts, and hold the slowest calls against the robot's deadline (our measurements are single runs on two edge machines; vendor documentation read 2026-11-20)"
          >
            23. Price-Performance and Latency: One Unit of Work per Workload
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A faster machine is the better buy only when its speed ratio beats its price ratio in the cloud, or its
            power ratio beside the robot, and both ratios have to be taken on a unit of work the two machines both
            produced, such as a decoded frame or a policy call. The policy that drives the arm adds a deadline: its
            slowest calls, not its average one, must finish before the arm runs out of actions.
          </Box>
          <Box variant="p">
            Our policy stand-in, six dense layers measured in place of a real policy, ran 390 inferences per second
            on one core of an {JETSON} and 1,968 on one Cortex-X925 core of an {SPARK}, each a single run. The Spark
            core does 1,968 / 390 = <Derived>5.0</Derived> times the work per second, so it wins per joule only if it
            draws less than <Derived>5.0</Derived> times the Jetson&apos;s watts, and per unit of price only if it
            costs less than <Derived>5.0</Derived> times as much.{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>
          </Box>
          <Box variant="p">
            The <Derived>5.0</Derived> is a ratio of memory traffic. Each inference reads all 25.2 MB of weights,
            more than any cache on either machine holds, so 390 inferences per second ask memory for 390 x 25.2 MB =
            9.8 GB/s, close to the 11.71 GB/s that one Jetson core reached in a memory test, and 62.3% of that
            core&apos;s cycles stalled on memory. The X925 core pulls 49.5 GB/s through the same weights. Memory
            bandwidth is the part to weigh price and watts against for this program: arithmetic beyond what memory
            can feed adds nothing to its rate.{' '}
            <Cite id="F08-63">the stand-in&apos;s weights against the core&apos;s memory limits</Cite>{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick for each workload the count two machines can be ranked on; a GPU that reads 100% busy may be running one small kernel"
          >
            Count what the next stage consumes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The arm&apos;s learning loop is a chain of jobs, from recording episodes to training and running the
            policy, and each hands the next one thing: a decoded frame to the trainer, a simulation step to the
            evaluator, an action to the arm. That thing is the unit of work. The next job waits for exactly it, so
            the machine that delivers more of it per second is faster at the job, whatever its other counters say.
          </Box>
          <Box variant="p">
            GPU utilisation fails that test. The figure <code>nvidia-smi</code> prints is the share of its sample
            period during which at least one kernel (a program launched on the GPU) was running, and it says nothing
            about how much of the GPU that kernel used. One small kernel launched back to back reads 100%. The figure
            cannot rank two machines; frames per second can.{' '}
            <Cite id="F08-30">nvidia-smi documentation, &quot;Utilization&quot;</Cite>
          </Box>
          <Box variant="p">
            Every workload of section 20, Fifteen Workloads, Five Shapes, has such a unit. Twelve are batches: the
            faster machine finishes sooner, and the rate is the whole comparison. Three answer to a clock, and for
            them a rate is half the answer. The encoder must keep real time, 1.0 camera-second per second per
            camera, or it falls behind the cameras while the arm moves. The dataloader must keep pace with the GPU,
            or the GPU waits for samples. Every policy call is held against a deadline counted in control periods,
            the 33.3 ms between two commands to the motors at 30 Hz (section 3, The Robot as a Computer).{' '}
            <Cite id="F08-81">the units, chosen for this dive</Cite>{' '}
            <Cite id="F08-84">the latency method, with the control period</Cite>
          </Box>
          <UnitTable caption="The three workloads held against a clock, and the unit of work to count for each" rows={CLOCK_UNITS} />
          <ExpandableSection headerText="The twelve batch workloads and their units">
            <UnitTable caption="The batch workloads of section 20, and the unit of work to count for each" rows={BATCH_UNITS} />
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Set two rates side by side, a vendor's beside your own included, only when unit, model and software release all match; one of our ratios passes and one fails"
          >
            Same unit, same model, same software: when two rates compare
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A ratio of two rates belongs to the two machines only if everything else was held equal. The unit must
            match: steps of one simulated arm and steps summed over thousands of copies on a GPU print alike and
            are different units. So must the model, since a rate for a small policy says nothing about a large one.
            So must the software release, or the ratio mixes a processor with a release. A vendor&apos;s figure
            meets the same checks: NVIDIA measured its GR00T N1.7 device medians with TensorRT, its inference
            compiler, so a call time of yours compares with them only for the same model compiled the same way.{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
          </Box>
          <Box variant="p">
            Our three stand-ins (section 22, Our Measurements) are the policy, a physics step of a humanoid (a robot
            with two legs and two arms) in MuJoCo, a robot physics simulator, and a camera image that MuJoCo renders.
            Each figure is a single run on one core of each core type: the Jetson&apos;s Cortex-A78AE, and the
            Spark&apos;s larger Cortex-X925 and smaller Cortex-A725. They load a core the way the arm&apos;s
            workloads do without being them: the physics model is a humanoid where the arm is an {ARM}, and the
            policy runs on a CPU where real policies run convolutions and attention on a GPU.{' '}
            <Cite id="F08-73">limits of our measurements</Cite>{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>
          </Box>
          <Figure
            cites="F08-61 F08-62 F08-64 F08-73"
            caption={
              <>
                Units of work per second for the three stand-ins, one panel each, with its own unit and axis, so bars
                compare within a panel only. Every bar is a single run of ours, labelled with the machine, the core
                and, for the MuJoCo programs, the MuJoCo version; the NumPy version of the policy stand-in is not
                recorded in our report. The render ran through EGL, a route to hardware-accelerated drawing without
                a display, and how much of each frame the GPU drew was not established.
              </>
            }
          >
            <div style={{ maxWidth: 600 }}>
              <UnitsChart />
            </div>
          </Figure>
          <Box variant="p">
            Inside the Spark the physics pair passes all three checks: both cores stepped the same model under the
            same MuJoCo 4.0.1, so the Cortex-X925 is 57,240 / 28,662 = <Derived>2.0</Derived> times as fast as the
            Cortex-A725 at this job. Across machines the same panel fails the third. The Jetson ran MuJoCo 3.17.0,
            so 57,240 / 14,507 = <Derived>3.9</Derived> mixes a processor with a simulator release, and only a run
            of both machines on one release would split the <Derived>3.9</Derived> between them.{' '}
            <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Placeholder
            what={
              <>
                Units per second for the arm&apos;s real workloads (the {ARM} simulation, video decode and embedding,
                policy and world-model training) on three kinds of EC2 instance: P (GPUs for training), G (GPUs that
                also carry graphics and video hardware) and Graviton (AWS&apos;s own Arm processors). No EC2 instance
                has been measured for this dive. <Cite id="F08-73">limits of our measurements</Cite>
              </>
            }
            source={<>Our profiling project, run on EC2. It has not yet run.</>}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find when a machine 2.5 times faster delivers less work for the money, and price each workload on the instance built around the part it exhausts first"
          >
            Per unit of price: divide by the whole instance, and choose the instance by the part the job exhausts
            first
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A cloud instance is rented by the hour, so its rate is divided by the price of an hour. That price is a
            dated first-party figure for one Region, the AWS location the instance runs in, and one purchase option:
            on demand, Spot capacity that AWS may take back, or capacity reserved ahead (section 24, Orchestrating
            Physical AI on AWS). One instance type has a different price under each.
          </Box>
          <Formula
            name="Cloud: work per unit of currency"
            tex={String.raw`\begin{aligned} &\text{units per currency unit} \\ &= \frac{\text{units per second} \times 3{,}600}{\text{price per hour}} \end{aligned}`}
            source={<Cite id="F08-82">the cloud formula</Cite>}
          />
          <Box variant="p">
            The 3,600 turns the per-second rate into the hour the price covers. Faster wins only when its speed
            ratio beats its price ratio. As an illustration with invented numbers, machine A decodes{' '}
            <Toy>1,000</Toy> frames per second and machine B <Toy>2,500</Toy>, at <Toy>3</Toy> times A&apos;s hourly
            price P. A delivers <Toy>1,000 x 3,600 / P = 3,600,000 / P</Toy> frames per unit of currency and B{' '}
            <Toy>2,500 x 3,600 / 3P = 3,000,000 / P</Toy>: B is <Toy>2.5</Toy> times faster and does{' '}
            <Toy>3,000,000 / 3,600,000 = 0.83</Toy> of A&apos;s work for the same money.{' '}
            <Cite id="F08-82">the cloud formula</Cite>
          </Box>
          <Box variant="p">
            Two corrections keep the figure tied to the work. Divide by the price of the whole instance even when
            the job fills one part of it: a decode job on a GPU instance pays for a GPU that sits idle. And for a
            batch run on Spot capacity, count only the units that finished, since a unit lost when its machine is
            taken back delivers nothing.{' '}
            <Cite id="F08-82">the cloud formula, corrections</Cite>
          </Box>
          <Box variant="p">
            The first correction also picks the instance: price a workload on the instance built around the part it
            exhausts first (section 20 names that part for each workload), since every other part is paid for and
            left idle. For the policy stand-in that part is memory bandwidth, 9.8 of the 11.71 GB/s one Jetson core
            can stream.{' '}
            <Cite id="F08-85">price-performance per part</Cite>{' '}
            <Cite id="F08-63">the stand-in&apos;s weights against the core&apos;s memory limits</Cite>
          </Box>
          <Box variant="p">
            The arm&apos;s recordings show the rule deciding a real choice. LeRobot records video in AV1 (AOMedia
            Video 1), a compression format, by default (section 9, Collecting Data), and the video decoders of the
            H100 GPUs in a P5, an EC2 training instance, do not handle AV1. A P5 training run on those recordings
            therefore decodes them on CPU cores, 12 per GPU on the eight-GPU size, or re-encodes them first, and the
            price per training sample includes that CPU work.{' '}
            <Cite id="F05-43">LeRobot streaming video encoding docs, Choosing a Codec</Cite>{' '}
            <Cite id="F08-85">price-performance per part</Cite>{' '}
            <Cite id="F08-58">the instance table, video engines</Cite>
          </Box>
          <Box variant="p">
            Video decoded in software and CPU physics exhaust CPU cores first, so they belong on CPU instances or on
            a GPU instance with many cores per GPU. G7, one of EC2&apos;s G families (GPUs that also carry graphics
            and video hardware), has 24 physical cores per GPU, twice the 12 of every other eight-GPU x86 size.
            Camera simulation with ray tracing can be priced only on G families, because the GPUs of the P families
            (built for training) lack RT cores, the units that trace rays, which the renderer needs (section 13,
            Rendering and Ray Tracing).{' '}
            <Cite id="F08-85">price-performance per part</Cite>{' '}
            <Cite id="F08-58">the instance table, cores per GPU and RT cores</Cite>
          </Box>
          <Placeholder
            what={
              <>
                A dated first-party price for each instance type, Region and purchase option, and next to every
                measured rate a units-per-price column computed with the cloud formula. No price was collected for
                this build. <Cite id="F08-59">prices not collected</Cite>
              </>
            }
            source={<>A dated price pass in a second round of this dive. This build ships without prices.</>}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Turn a rate into work per joule from the whole board's watts under load, and take a floor from the vendor's power range until that reading exists"
          >
            Per joule: the whole board&apos;s watts, read while the work runs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Beside the robot nothing is billed by the hour: the machine is bought once and spends energy as it
            works, from a battery or a fixed supply. Its rate is divided by watts, the average power the whole board
            draws while the workload runs.
          </Box>
          <Formula
            name="Edge: work per joule"
            tex={String.raw`\begin{aligned} &\text{units per joule} \\ &= \frac{\text{units per second}}{\text{watts}} \end{aligned}`}
            source={<Cite id="F08-83">the edge formula</Cite>}
          />
          <Box variant="p">
            Multiplied by what a battery holds, units per joule is the work one charge buys. As an illustration, a
            device that runs <Toy>1,000</Toy> inferences per second at <Toy>20</Toy> W does{' '}
            <Toy>1,000 / 20 = 50</Toy> inferences per joule. The watts are the whole board&apos;s for the reason a
            cloud job pays for the whole instance: the battery feeds every component, not only the one the job keeps
            busy. The purchase price is the machine&apos;s other cost and divides the same way: price over units per
            second is what each unit per second of capacity cost to buy.{' '}
            <Cite id="F08-83">the edge formula, with purchase price</Cite>
          </Box>
          <Box variant="p">
            Until a reading under load exists, the vendor&apos;s range gives a floor. NVIDIA states 7 W to 25 W for
            the Jetson developer kit. If the board drew no more than 25 W, the stand-in did at least{' '}
            <Derived>390 / 25 = 15.6</Derived> inferences per joule, and more by an amount nobody measured, since one
            core of six was busy and the GPU idle. Our idle readings, about 4.8 W for the whole Jetson board from{' '}
            <code>tegrastats</code> and 10 W for the Spark&apos;s GPU alone from <code>nvidia-smi</code>, describe
            machines doing none of the work, and the second leaves out the CPU core the stand-ins ran on.{' '}
            <Cite id="F07-36">Jetson Orin Nano Super Developer Kit page</Cite>{' '}
            <Cite id="F08-83">the edge formula and our idle readings</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Work out how much room a chunk leaves a call, and pick the latency percentile from the misses the arm can afford; a 60-call median more often than not holds no call from that tail"
          >
            Per deadline: the percentile you report is the miss rate you accept
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A policy call returns a chunk, several future actions that the arm plays one per control period. With
            asynchronous calls the arm keeps playing while the next call runs, so it never stops to wait. A chunk is
            computed from what the cameras saw when its call began, so when it lands, the actions for the time the
            call took are already past and are dropped. The rest, what the chunk lasts minus one call, must keep the
            arm busy for the whole of the next call, so a call may take up to half of what its chunk lasts (section
            17, Running on the Robot, sets the rule out in symbols).{' '}
            <Cite id="F07-22">LeRobot remote inference guide, &quot;Tuning&quot;</Cite>
          </Box>
          <Box variant="p">
            NVIDIA&apos;s benchmark call for GR00T N1.7, its robot policy, returns 40 actions: 40 control periods,
            which at 30 Hz last 40 / 30 = <Derived>1.33</Derived> s, so a call has half of them,{' '}
            <Derived>20</Derived> periods. NVIDIA&apos;s median for a Jetson Orin (a module it does not name) with
            TensorRT is 149.0 ms, or 4.5 periods. A worst call up to about <Derived>20 / 4.5 = 4.4</Derived> times
            that median still fits.{' '}
            <Cite id="F07-2">Isaac-GR00T deployment README, benchmark conditions</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
          </Box>
          <Box variant="p">
            A rate cannot say whether the worst call stays inside that room, because a rate is a mean: the
            stand-in&apos;s 390 per second is an average of <Derived>1 / 390 s = 2.56 ms</Derived> per call. Neither
            the mean nor the median sees a rare slow call. As an illustration, if ninety-nine calls in a hundred take
            the typical time and one takes ten times as long, the mean rises by 9% and the median does not move,
            though that one call may outlast what is left of the chunk.{' '}
            <Cite id="F08-84">our profiling report, throughputs inverted</Cite>
          </Box>
          <Box variant="p">
            A percentile is a miss rate. The p50, the median, is the time half of all calls finish within. The p99
            is the time ninety-nine calls in a hundred finish within, so one in a hundred is slower. An arm that
            starts a call every <Toy>20</Toy> control periods, <Toy>30 / 20 = 1.5</Toy> calls a second (an
            illustration), meets such a call about once every <Toy>100 / 1.5 = 67</Toy> seconds. If it outlasts what
            is left of the chunk, the arm runs out of actions, and no setting repairs a call that is too long. Hold
            the p99 against the room the chunk leaves when one late call in a hundred is tolerable; when none is,
            hold the worst call.{' '}
            <Cite id="F08-84">the latency method, p50 and p99 against the control period</Cite>{' '}
            <Cite id="F07-22">LeRobot remote inference guide, &quot;Tuning&quot;</Cite>
          </Box>
          <Box variant="p">
            The published device tables stop at the median: NVIDIA reports each figure in its GR00T N1.7 table as
            the median of 60 timed calls. Sixty calls hold on average <Derived>60 x 0.01 = 0.6</Derived> calls
            beyond the p99, and the chance that they hold none at all is{' '}
            <Derived>0.99 to the power 60 = 0.55</Derived>, so more often than not such a sample contains no call
            from the tail the arm feels. Our stand-in gives a mean and NVIDIA&apos;s table a median; the p99 has to
            come from your own timed calls.{' '}
            <Cite id="F07-3">Isaac-GR00T deployment README, &quot;Measurement details&quot;</Cite>{' '}
            <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>{' '}
            <Cite id="F08-84">the latency method, no p99 in either</Cite>
          </Box>
          <Placeholder
            what={
              <>
                Power under load, in watts, for each workload on the Jetson and the Spark, which turns the rates in
                the chart into units per joule; and p50 and p99 latency per policy call on the device, next to the
                control period.
              </>
            }
            source={<>The same profiling project, in its runs on the two devices.</>}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Rank the machines you are choosing between on your own workload, from your own measurements and a price read on the day"
          >
            Measure your own machines in this order
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol style={LIST}>
            <li>
              <strong>Write down the unit</strong> from the table for your job, with the model and the software
              release beside it, so that any later figure can be checked for a like-for-like match.
            </li>
            <li>
              <strong>Count units per second</strong> on each machine, and record how many runs stand behind each
              figure.
            </li>
            <li>
              <strong>In the cloud</strong>, read the price on the day for your Region and purchase option, divide
              by the whole instance&apos;s price, count only finished units on Spot, and keep the date beside the
              result.
            </li>
            <li>
              <strong>Beside the robot</strong>, record the whole board&apos;s watts while the work runs, and its
              purchase price: on a Jetson the <code>VDD_IN</code> rail in <code>tegrastats</code> covers the whole
              board, while <code>nvidia-smi</code> on the Spark reports the GPU alone, and dividing by one
              part&apos;s watts flatters the machine.{' '}
              <Cite id="F08-83">our machine cards</Cite>
            </li>
            <li>
              <strong>On the robot&apos;s clock</strong>, time every call on its own, with the real policy on the
              real device and the cameras running, for long enough that one call in a hundred is many calls: as an
              illustration, an hour at <Toy>1.5</Toy> calls a second is <Toy>5,400</Toy> calls, <Toy>54</Toy> of
              them beyond the p99. Print the p50, the p99 and the worst call beside the room your chunk leaves.
            </li>
          </ol>
          <Box variant="p">
            When a new instance type or board appears, repeat steps 2 to 5 on it with the unit from step 1
            unchanged, and one measurement and one dated price put it in the same table as the machines you have
            already ranked.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
