import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Toy } from '../components/Cite';
import { Figure } from '../components/Figure';
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
const FORMULA: CSSProperties = { display: 'block', padding: '8px 12px', background: '#f4f4f6', borderRadius: 4, overflowX: 'auto' };

/* ------------------------------------------------------------------------ */
/* Block 1: one unit of work per workload (register entry F08-81)            */
/* ------------------------------------------------------------------------ */

interface UnitRow {
  workload: string;
  unit: string;
  deadline: string;
}

const UNITS: UnitRow[] = [
  {
    workload: 'Record and encode',
    unit: 'Camera-seconds encoded per second. Real time is 1.0 per camera.',
    deadline: "On the robot's clock: below real time the encoder falls behind the cameras while the arm is still moving.",
  },
  { workload: 'Decode and filter', unit: 'Frames decoded per second.', deadline: 'None. A batch: a faster machine finishes sooner.' },
  {
    workload: 'Embed and deduplicate',
    unit: 'Clips embedded per second. A clip is a short cut of video; embedding it means running it through a vision model to get its vector.',
    deadline: 'None. A batch.',
  },
  {
    workload: 'Dataloader decode and augment',
    unit: 'Frames decoded per second, delivered to the training job.',
    deadline: 'No deadline, but a rate to match: slower than the GPU consumes samples and the GPU waits.',
  },
  { workload: 'CPU physics step', unit: 'Environment steps per second.', deadline: 'None. A batch.' },
  { workload: 'GPU-parallel physics', unit: 'Environment steps per second, summed over all the copies of the arm.', deadline: 'None. A batch.' },
  { workload: 'Simulated cameras', unit: 'Frames rendered per second, at a stated resolution.', deadline: 'None. A batch.' },
  {
    workload: 'Policy fine-tune',
    unit: 'Training samples per second, and wall time to a fixed step count.',
    deadline: 'None. The wall time is the figure people wait on.',
  },
  { workload: 'World-model training', unit: 'Training samples per second, and wall time to a fixed step count.', deadline: 'None.' },
  {
    workload: 'Closed-loop evaluation',
    unit: 'Episodes evaluated per hour. An episode is one attempt at the task.',
    deadline: 'None. A batch of independent episodes.',
  },
  {
    workload: 'Engine build',
    unit: 'Minutes per engine. An engine is the model compiled for one device (section 17).',
    deadline: 'None. It runs once per device and model.',
  },
  {
    workload: 'On-robot inference',
    unit: 'Actions, or chunks of actions, per second, with the p50 and p99 latency of one call (block 4 defines both).',
    deadline: 'A deadline on every call: each one is compared with the control period.',
  },
  {
    workload: 'Generative augmentation',
    unit: 'Clips per GPU-hour, from published figures. One GPU running for one hour is one GPU-hour.',
    deadline: 'None.',
  },
  { workload: 'Robot foundation-model pretraining', unit: 'GPU-hours per run, from published figures.', deadline: 'None.' },
  { workload: 'World-model pretraining', unit: 'GPU-hours per run, from published figures.', deadline: 'None.' },
];

function UnitTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560 }}>
        <caption style={{ textAlign: 'left', paddingBottom: 6, color: MUTED }}>
          The fifteen workloads of section 20, each with the unit to count and what a deadline means for it
        </caption>
        <thead>
          <tr>
            <th scope="col" style={TH}>
              Workload
            </th>
            <th scope="col" style={TH}>
              Unit of work
            </th>
            <th scope="col" style={TH}>
              Deadline
            </th>
          </tr>
        </thead>
        <tbody>
          {UNITS.map((r) => (
            <tr key={r.workload}>
              <th scope="row" style={{ ...TD, textAlign: 'left' }}>
                {r.workload}
              </th>
              <td style={TD}>{r.unit}</td>
              <td style={TD}>{r.deadline}</td>
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
            description="Compare machines on one unit of work per workload, and know which of the figures exist today (our own measurements are single runs on two edge machines; vendor documentation read 2026-11-20)"
          >
            23. Price-Performance and Latency
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Two machines can only be compared on work that both of them did. This section picks one unit of work for
            each of the fifteen workloads, then shows how to turn a measured rate of that unit into a comparison: per
            unit of price for a cloud instance, per watt for an edge machine (a computer that sits beside the robot),
            and per call against a deadline for anything on the robot&apos;s clock. It depends on section 20, Fifteen
            Workloads, Five Shapes, for the workloads and the parts of the machine, on section 22, Our Measurements,
            for the figures, and on section 17, Running on the Robot, for the latency budget.
          </Box>
          <Box variant="p">
            The method is complete and its inputs are partly in hand. What exists today is a rate for three stand-in
            programs on two edge machines. The one to carry is 390 inferences per second on one core of an {JETSON},
            from a single run. <Cite id="F08-62">our profiling report, policy inference table</Cite> This build prints
            no price of any kind. The last block says which figures are still to land, and from where.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Pick the thing to count before you measure, so two machines are judged on the same work">
            One unit of work per workload
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A unit of work is the thing one stage hands to the next: a decoded frame, a simulation step, a training
            sample, an action sent to the arm. Count those per second and the rate means the same thing on any
            machine. A figure the next stage cannot consume is not a unit. GPU utilisation, as the{' '}
            <code>nvidia-smi</code> tool reports it, is the share of time during which at least one program was
            running on the GPU. It says nothing about how many frames or samples came out.{' '}
            <Cite id="F08-30">nvidia-smi documentation, &quot;Utilization&quot;</Cite>
          </Box>
          <Box variant="p">
            The table gives one unit for each workload. The choice of units is our reading: no source prescribes
            them. <Cite id="F08-81">the units, chosen for this dive</Cite> The third column says what a deadline means
            for the workload. For most there is none. The job is a batch, a faster machine finishes it sooner, and
            the rate is the whole story. Two workloads run on the robot&apos;s clock, and for those a rate is half the
            answer.
          </Box>
          <UnitTable />
          <Box variant="p">
            The control period in the on-robot row is the time between two commands to the motors: 33.3 ms when the
            arm is driven at 30 Hz. <Cite id="F08-84">the latency method, with the control period</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Turn a measured rate into a figure you can rank machines by, and know when two such figures may be set side by side">
            The method
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every comparison starts from the same measurement: run the workload on the machine and count units per
            second. Then divide by what the machine consumes while it does the work. In the cloud that is money, billed
            by the hour. Beside the robot nobody bills by the hour and the scarce thing is power, so the divisor is
            watts.
          </Box>
          <Box variant="p">
            <strong>Cloud.</strong> Work done in an hour, divided by the price of that hour:
          </Box>
          <code style={FORMULA}>units per currency unit = units per second x 3,600 / price per hour</code>
          <Box variant="p">
            The 3,600 turns seconds into an hour, so the top of the fraction is units per hour. Dividing by the price
            of the hour leaves units of work per unit of currency.{' '}
            <Cite id="F08-82">the cloud formula</Cite> The price has to be a first-party figure with a date, for a
            named Region (the AWS location the instance runs in) and a named purchase option (how the hour is bought:
            on demand, as spare capacity that AWS can take back, or as a reservation; section 24, Orchestrating It on
            AWS, covers them). The same instance type has a different price under each.
          </Box>
          <Box variant="p">
            <strong>Edge.</strong> Work done in a second, divided by the power drawn during that second:
          </Box>
          <code style={FORMULA}>units per joule = units per second / watts</code>
          <Box variant="p">
            A watt is one joule of energy per second. Dividing a rate by watts therefore leaves units per joule: how
            much work the machine does with a fixed amount of energy, which is the question for anything that runs
            from a battery. <Cite id="F08-83">the edge formula</Cite>
          </Box>
          <Box variant="p">
            <strong>A worked example, with invented numbers.</strong> These figures are an illustration and describe
            no real machine. Machine A decodes <Toy>1,000</Toy> frames per second. Machine B decodes{' '}
            <Toy>2,500</Toy>, and its hour costs <Toy>3</Toy> times as much. Call the price of A&apos;s hour P. Then A
            delivers <Toy>1,000 x 3,600 / P = 3,600,000 / P</Toy> frames per unit of currency, and B delivers{' '}
            <Toy>2,500 x 3,600 / 3P = 3,000,000 / P</Toy>. B is <Toy>2.5</Toy> times faster and does{' '}
            <Toy>3,000,000 / 3,600,000 = 0.83</Toy> of A&apos;s work for the same money. Speed alone would have picked
            the wrong machine. The edge arithmetic is one division: a device that runs <Toy>1,000</Toy> inferences per
            second while drawing <Toy>20</Toy> watts does <Toy>1,000 / 20 = 50</Toy> inferences per joule.
          </Box>
          <Box variant="p">
            <strong>When two figures may be compared.</strong> Only when three things match:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>The same unit.</strong> Steps per second of one simulated arm and steps per second summed over
              thousands of copies are different units.
            </li>
            <li>
              <strong>The same model.</strong> A rate for a small policy says nothing about a large one, and a
              physics rate for one robot model says little about another.
            </li>
            <li>
              <strong>The same software version.</strong> Our own figures below miss this one: the Spark ran MuJoCo
              4.0.1 and the Jetson ran MuJoCo 3.17.0, so the physics rates of the two machines differ by a simulator
              version as well as by a processor. <Cite id="F08-73">limits of our measurements</Cite>
            </li>
          </ul>
          <ExpandableSection headerText="Two corrections that keep the cloud figure honest">
            <SpaceBetween size="s">
              <Box variant="p">
                Both are our reading of the method. First, divide by the price of the whole instance even when the
                job uses one part of it: a decode job on a GPU instance pays for an idle GPU. Second, for a batch
                bought as spare capacity that can be taken back, count the units lost each time that happens.{' '}
                <Cite id="F08-82">the cloud formula, corrections</Cite>
              </Box>
              <Box variant="p">
                Both point the same way. Choose the machine by the part the workload fills first (section 20), then
                compute the figure on that machine, then check the slowest calls if the workload sits on the
                robot&apos;s clock. <Cite id="F08-85">price-performance per part</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Read the only rates we have measured, and see which half of each comparison is still missing">
            What exists today: two edge machines
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 22 measured three stand-in programs on two machines: an {JETSON}, whose cores are Cortex-A78AE,
            and an {SPARK}, whose processor has two kinds of core, the larger Cortex-X925 and the smaller Cortex-A725.
            A stand-in is a small program that loads a machine the way a real workload does without being that
            workload. Each ran once, on one core. The chart gives units per second, the top of both fractions.
          </Box>
          <Figure
            cites="F08-61 F08-62 F08-64 F08-73"
            caption={
              <>
                Each panel is one stand-in with its own unit and its own axis, so read along a panel and never across
                panels. Every bar is our measurement, a single run on one core; the label under each value names the
                machine, the core and, where the program is MuJoCo, its version. The NumPy version of the policy
                stand-in is not recorded in our report.
              </>
            }
          >
            <div style={{ maxWidth: 600 }}>
              <UnitsChart />
            </div>
          </Figure>
          <Box variant="p">
            The figure to carry is the policy stand-in on the Jetson: 390 inferences per second from one Cortex-A78AE
            core, a single run. The same program reached 1,968 per second on one Cortex-X925 core of the Spark, also
            a single run. <Cite id="F08-62">our profiling report, policy inference table</Cite>
          </Box>
          <Box variant="p">
            Each stand-in belongs to one row of the unit table: the physics step to &quot;CPU physics step&quot;, the
            policy stand-in to &quot;On-robot inference&quot;, the render to &quot;Simulated cameras&quot;. None is
            the arm&apos;s own workload. The physics model is a humanoid where the story uses the {ARM}. The policy
            is six dense layers on a CPU, where a real policy runs on a GPU. The render run did not establish how
            much of each frame the GPU drew, so its panel cannot rank rendering hardware.{' '}
            <Cite id="F08-73">limits of our measurements</Cite>{' '}
            <Cite id="F08-64">our profiling report, camera render table</Cite>
          </Box>
          <Box variant="p">
            <strong>The power inputs.</strong> The bottom of the edge fraction is watts under load. Two kinds of
            figure exist: the range NVIDIA states for each machine, and one idle reading of ours per machine.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560 }}>
              <caption style={{ textAlign: 'left', paddingBottom: 6, color: MUTED }}>
                Power figures on hand for the two machines
              </caption>
              <thead>
                <tr>
                  <th scope="col" style={TH}>
                    Machine
                  </th>
                  <th scope="col" style={TH}>
                    NVIDIA&apos;s stated power
                  </th>
                  <th scope="col" style={TH}>
                    Our idle reading (single reading)
                  </th>
                  <th scope="col" style={TH}>
                    Our reading under load
                  </th>
                  <th scope="col" style={TH}>
                    Sources
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" style={{ ...TD, textAlign: 'left' }}>
                    {JETSON}
                  </th>
                  <td style={TD}>7 W to 25 W</td>
                  <td style={TD}>
                    About 4.8 W for the whole board, read from <code>tegrastats</code>, the Jetson&apos;s own
                    power and load monitor
                  </td>
                  <td style={TD}>Not recorded</td>
                  <td style={TD}>
                    <Cite id="F07-36">Jetson Orin Nano Super Developer Kit page</Cite>{' '}
                    <Cite id="F08-83">our machine card, Jetson</Cite>
                  </td>
                </tr>
                <tr>
                  <th scope="row" style={{ ...TD, textAlign: 'left' }}>
                    {SPARK}
                  </th>
                  <td style={TD}>A 240 W power supply, with a 140 W power budget for the chip</td>
                  <td style={TD}>
                    10 W for the GPU alone, read from <code>nvidia-smi</code>
                  </td>
                  <td style={TD}>Not recorded</td>
                  <td style={TD}>
                    <Cite id="F07-47">DGX Spark User Guide, &quot;Hardware Overview&quot;</Cite>{' '}
                    <Cite id="F08-83">our machine card, Spark</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            No run of ours recorded power while a workload was running, so this section prints no units-per-joule
            figure. The idle reading describes a machine that was not doing the work. NVIDIA&apos;s 25 W ceiling for
            the Jetson would give only a floor, because the run kept one core of six busy and left the GPU idle. The
            two idle readings do not compare with each other either: one is a whole board, the other one component.{' '}
            <Cite id="F08-83">the edge formula and our idle readings</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Know why a rate cannot tell you whether a robot meets its control period, and which measurement can">
            Latency where there is a deadline
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On-robot inference has a deadline on every call. Section 17 showed how a policy that returns a chunk
            (several future actions per call) lets one call take longer than a control period, as long as the next
            chunk arrives before the current one is used up. So the question is how long each single call takes, and
            the slowest calls matter most.
          </Box>
          <Box variant="p">
            A rate gives only the mean. At 390 inferences per second, one inference takes 1 / 390 of a second, which
            is 2.56 ms on the Jetson core; the same arithmetic gives 0.51 ms on the Cortex-X925. That is our
            arithmetic from a single run of a stand-in.{' '}
            <Cite id="F08-84">our profiling report, throughputs inverted</Cite> A mean hides the slow calls: if
            ninety-nine calls in a hundred are quick and one takes ten times as long, the mean barely moves. Two
            other figures show what the mean hides:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>p50</strong> (the fiftieth percentile, also called the median) is the time within which half of all
              calls finish. It describes the typical call.
            </li>
            <li>
              <strong>p99</strong> (the ninety-ninth percentile) is the time within which ninety-nine calls in every hundred
              finish. One call in a hundred is slower than it.
            </li>
          </ul>
          <Box variant="p">
            A robot&apos;s deadline needs p99. As an illustration with invented numbers: an arm that calls its policy{' '}
            <Toy>5</Toy> times per second makes a hundred calls every <Toy>20</Toy> seconds, so it meets a call slower
            than p99 about that often. If that call outlasts the actions left in the chunk, the arm has nothing to
            play. The rule from LeRobot&apos;s documentation is that the playback left after a call must still cover
            the next call, and no setting repairs a call that is too long.{' '}
            <Cite id="F07-22">LeRobot remote inference guide, &quot;Tuning&quot;</Cite>
          </Box>
          <Box variant="p">
            The published device tables stop at the median. NVIDIA reports each figure in its table for the GR00T N1.7
            policy as the median of 60 timed calls. <Cite id="F07-3">Isaac-GR00T deployment README, &quot;Measurement details&quot;</Cite>{' '}
            Its Jetson Orin figure, 149.0 ms, is 4.5 control periods at 30 Hz, and it is a p50.{' '}
            <Cite id="F08-84">the latency method, with the control period</Cite> Our reading is that sixty calls are
            also too few to show what one call in a hundred looks like. Neither our stand-in nor the vendor&apos;s
            table holds a p99.
          </Box>
          <Box variant="p">A percentile measurement needs four things the existing figures lack (our reading):</Box>
          <ul style={LIST}>
            <li>a time for every call, taken separately, in place of a count divided by elapsed time;</li>
            <li>enough calls that one in a hundred is many calls;</li>
            <li>the real policy on the real device, with the cameras and everything else on the device running;</li>
            <li>p50, p99 and the worst call, each printed next to the control period.</li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="See which figures are missing and where each will come from, then apply the method to your own machine now">
            What lands next, and what you can do today
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Three sets of figures would complete the comparison. Each is named here with its source, and none is
            estimated in the meantime.
          </Box>
          <Placeholder
            what={
              <>
                A dated first-party price for each instance type, Region and purchase option, and next to every rate
                in this section a units-per-price column computed with the cloud formula. No price was collected for
                this build. <Cite id="F08-59">prices not collected</Cite>
              </>
            }
            source={<>A dated price pass in a second round of this dive. This build ships without prices.</>}
          />
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
          <Box variant="p">
            <strong>What you can do today.</strong> The method needs none of those figures to be useful on your own
            machines:
          </Box>
          <ol style={LIST}>
            <li>
              <strong>Measure your own unit first.</strong> Take the row of the unit table that matches your job and
              write the unit down with the model and the software version.
            </li>
            <li>
              <strong>Count units per second</strong> on the machine you have, and record how many runs stand behind
              the figure. Ours stand on one.
            </li>
            <li>
              <strong>In the cloud</strong>, read the price yourself on the day, for your Region and your purchase
              option, divide, and keep the date beside the result.
            </li>
            <li>
              <strong>Beside the robot</strong>, record watts during the run with the device&apos;s own monitor, and
              divide by them.
            </li>
            <li>
              <strong>On the robot&apos;s clock</strong>, time every call and print p50 and p99 next to the control
              period.
            </li>
          </ol>
          <Box variant="p">
            None of those steps names an instance type. When a new one appears the unit stays the same, and one
            measurement and one dated price put the new machine in the same table as the old ones.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
