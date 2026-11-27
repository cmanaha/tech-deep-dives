import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import FormField from '@cloudscape-design/components/form-field';
import Select from '@cloudscape-design/components/select';
import { Cite } from '../components/Cite';
import { Figure } from '../components/Figure';
import { GpuEngines, ENGINES_BY_WORKLOAD, GPU_WORKLOADS } from '../components/GpuEngines';
import { LoopOnAws } from '../components/LoopOnAws';
import type { GpuWorkload } from '../components/GpuEngines';
import { ARM, TASK_STORY } from '../lib/task';

/* The thread task, stated once for this section. */
const TASK = `one ${ARM} arm that must ${TASK_STORY}`;

/* The two machines of our own measurements, named once so every mention reads the same. */
const JETSON = 'NVIDIA Jetson Orin Nano Super';
const SPARK = 'NVIDIA DGX Spark';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const EMPHASIS = '#0972d3';

type Tone = 'cpu' | 'memory' | 'tensor' | 'general' | 'rt' | 'video' | 'outside';

const TONES: Record<Tone, { fill: string; ink: string }> = {
  cpu: { fill: '#e8f1fb', ink: '#1f5fa8' },
  memory: { fill: '#efe9fb', ink: '#5b3fa8' },
  tensor: { fill: '#e6f6ea', ink: '#1e7b3a' },
  general: { fill: '#ffffff', ink: '#5f6b7a' },
  rt: { fill: '#fdeedd', ink: '#a85a0a' },
  video: { fill: '#fde8ef', ink: '#a8274f' },
  outside: { fill: '#eef0f2', ink: '#44505c' },
};

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/** A machine part as a coloured label. The text names the part; the colour only repeats it. */
function Part({ tone, children }: { tone: Tone; children: ReactNode }) {
  const t = TONES[tone];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '1px 8px',
        borderRadius: 4,
        background: t.fill,
        border: `1px solid ${t.ink}`,
        color: t.ink,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 20.1: the workload by machine-part matrix (an HTML grid)          */
/* ------------------------------------------------------------------------ */

interface Column {
  label: string;
  tone: Tone;
}

/* The nine parts on the chip, then storage and network outside it. */
const COLUMNS: Column[] = [
  { label: 'CPU front end', tone: 'cpu' },
  { label: 'CPU back end', tone: 'cpu' },
  { label: 'Memory bandwidth', tone: 'memory' },
  { label: 'Memory latency', tone: 'memory' },
  { label: 'GPU tensor cores', tone: 'tensor' },
  { label: 'General GPU compute', tone: 'general' },
  { label: 'GPU ray-tracing cores', tone: 'rt' },
  { label: 'GPU video engines', tone: 'video' },
  { label: 'GPU memory', tone: 'memory' },
  { label: 'Storage', tone: 'outside' },
  { label: 'Network', tone: 'outside' },
];

interface Fill {
  /** First column the cell covers (index into COLUMNS). */
  at: number;
  /** How many columns it covers. */
  span?: number;
  /** The role word: first, also, then, or, limit, mix. It is printed in the cell. */
  role: string;
  /** What the workload does to that part. */
  text: string;
  /** Colour of a cell that covers parts of unlike colours. */
  tone?: Tone;
}

interface MatrixRow {
  name: string;
  where: string;
  fills: Fill[];
}

interface Phase {
  phase: string;
  rows: MatrixRow[];
}

const MATRIX: Phase[] = [
  {
    phase: '1. Collect',
    rows: [{ name: 'Record and encode', where: 'section 9', fills: [{ at: 1, role: 'first', text: 'software video encode' }] }],
  },
  {
    phase: '2. Curate',
    rows: [
      {
        name: 'Decode and filter',
        where: 'section 10',
        fills: [
          { at: 0, span: 2, role: 'first', text: 'decode on CPU cores' },
          { at: 7, role: 'or', text: 'the GPU decode engine, if the card supports the codec' },
        ],
      },
      {
        name: 'Embed and deduplicate',
        where: 'section 10',
        fills: [
          { at: 4, role: 'first', text: 'a vision encoder runs over the clips' },
          { at: 9, span: 2, role: 'also', text: 'fetching the clips' },
        ],
      },
      {
        name: 'Dataloader decode and augment',
        where: 'sections 10 and 11',
        fills: [{ at: 0, span: 2, role: 'first', text: 'decode and image transforms for each sample' }],
      },
    ],
  },
  {
    phase: '3. Simulate',
    rows: [
      {
        name: 'CPU physics step',
        where: 'section 12',
        fills: [
          { at: 0, role: 'also', text: 'branches in collision detection' },
          { at: 1, role: 'first', text: 'arithmetic, one simulated world per core' },
        ],
      },
      {
        name: 'GPU-parallel physics',
        where: 'sections 8 and 12',
        fills: [
          { at: 0, span: 2, role: 'also', text: 'one CPU core feeds the GPU' },
          { at: 5, role: 'first', text: 'thousands of worlds in each step' },
        ],
      },
      {
        name: 'Simulated cameras',
        where: 'section 13',
        fills: [
          { at: 5, role: 'then', text: 'a ray tracer written as GPU code' },
          { at: 6, role: 'then', text: 'RTX renderers' },
          { at: 8, role: 'first', text: 'megabytes per camera' },
        ],
      },
    ],
  },
  {
    phase: '4. Train',
    rows: [
      {
        name: 'Policy fine-tune',
        where: 'section 15',
        fills: [
          { at: 4, role: 'first', text: 'forward and backward passes' },
          { at: 8, role: 'limit', text: 'the model must fit' },
        ],
      },
      { name: 'World-model training', where: 'section 7', fills: [{ at: 4, role: 'first', text: 'a light load from a small model' }] },
    ],
  },
  {
    phase: '5. Evaluate',
    rows: [
      {
        name: 'Closed-loop evaluation',
        where: 'section 16',
        fills: [
          { at: 0, span: 2, role: 'mix', text: 'CPU physics' },
          { at: 4, role: 'mix', text: 'policy calls' },
          { at: 5, role: 'mix', text: 'GPU physics' },
          { at: 8, role: 'mix', text: 'cameras' },
        ],
      },
    ],
  },
  {
    phase: '6. Deploy',
    rows: [
      {
        name: 'Engine build',
        where: 'section 17',
        fills: [
          { at: 0, span: 2, role: 'also', text: "the device's own CPU" },
          { at: 4, span: 5, role: 'first', text: "the device's own GPU, for minutes", tone: 'general' },
        ],
      },
      {
        name: 'On-robot inference',
        where: 'section 17',
        fills: [
          { at: 2, role: 'also', text: 'one memory shared by the CPU and GPU' },
          { at: 4, role: 'first', text: 'one policy call per chunk' },
        ],
      },
    ],
  },
  {
    phase: 'Vendor scale: you receive these as checkpoints, and only published numbers describe them',
    rows: [
      {
        name: 'Generative augmentation',
        where: 'section 11',
        fills: [
          { at: 4, role: 'first', text: 'minutes per clip' },
          { at: 8, role: 'first', text: 'tens of GB' },
        ],
      },
      {
        name: 'Robot foundation-model pretraining',
        where: 'sections 5 and 15',
        fills: [
          { at: 4, role: 'first', text: 'across many nodes' },
          { at: 9, role: 'also', text: 'feeding data to the nodes' },
          { at: 10, role: 'also', text: 'the network between the nodes' },
        ],
      },
      {
        name: 'World-model pretraining',
        where: 'sections 6, 7 and 15',
        fills: [
          { at: 4, role: 'first', text: 'across many nodes' },
          { at: 9, role: 'also', text: 'feeding data to the nodes' },
          { at: 10, role: 'also', text: 'the network between the nodes' },
        ],
      },
    ],
  },
];

const GRID_TH: CSSProperties = {
  padding: '6px 6px',
  fontSize: 13,
  lineHeight: 1.25,
  textAlign: 'left',
  verticalAlign: 'bottom',
  borderRadius: 4,
};
const GRID_NAME: CSSProperties = {
  padding: '6px 8px',
  fontSize: 13,
  lineHeight: 1.3,
  textAlign: 'left',
  verticalAlign: 'top',
  fontWeight: 400,
  color: INK,
  /* The workload names stay in view while the resource columns scroll sideways on a phone. */
  position: 'sticky',
  left: 0,
  zIndex: 1,
  background: '#fbfbfd',
};
const GRID_EMPTY: CSSProperties = { background: '#f6f7f9', borderRadius: 4 };

function matrixCells(row: MatrixRow) {
  const cells: ReactNode[] = [];
  let c = 0;
  while (c < COLUMNS.length) {
    const fill = row.fills.find((f) => f.at === c);
    if (!fill) {
      cells.push(<td key={c} style={GRID_EMPTY} />);
      c += 1;
      continue;
    }
    const tone = TONES[fill.tone ?? COLUMNS[c].tone];
    const first = fill.role === 'first';
    cells.push(
      <td
        key={c}
        colSpan={fill.span ?? 1}
        style={{
          padding: '5px 6px',
          fontSize: 13,
          lineHeight: 1.25,
          verticalAlign: 'top',
          borderRadius: 4,
          background: tone.fill,
          color: INK,
          border: first ? `2.5px solid ${EMPHASIS}` : `1px solid ${tone.ink}`,
        }}
      >
        <span style={{ fontWeight: 700, color: first ? EMPHASIS : tone.ink }}>{fill.role}:</span>{' '}
        {fill.text}
      </td>,
    );
    c += fill.span ?? 1;
  }
  return cells;
}

function WorkloadMatrix() {
  return (
    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 3, tableLayout: 'fixed', background: '#fbfbfd' }}>
      <caption style={{ captionSide: 'top', textAlign: 'left', padding: '4px 6px', fontWeight: 700, color: INK }}>
        The fifteen workloads and the resources they load
      </caption>
      <colgroup>
        <col style={{ width: 150 }} />
        {COLUMNS.map((col) => (
          <col key={col.label} />
        ))}
      </colgroup>
      <thead>
        <tr>
          <th scope="col" style={{ ...GRID_TH, color: INK, position: 'sticky', left: 0, zIndex: 1, background: '#fbfbfd' }}>
            Workload
          </th>
          {COLUMNS.map((col) => (
            <th
              key={col.label}
              scope="col"
              style={{ ...GRID_TH, background: TONES[col.tone].fill, color: TONES[col.tone].ink, border: `1px solid ${TONES[col.tone].ink}` }}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      {MATRIX.map((group) => (
        <tbody key={group.phase}>
          <tr>
            <th scope="colgroup" colSpan={COLUMNS.length + 1} style={{ ...GRID_TH, paddingTop: 10, color: INK }}>
              {group.phase}
            </th>
          </tr>
          {group.rows.map((row) => (
            <tr key={row.name}>
              <th scope="row" style={GRID_NAME}>
                <span style={{ fontWeight: 700 }}>{row.name}</span>
                <br />
                {row.where}
              </th>
              {matrixCells(row)}
            </tr>
          ))}
        </tbody>
      ))}
    </table>
  );
}

/* ------------------------------------------------------------------------ */
/* The shared GPU engines figure (diagram 13.2), with its selector           */
/* ------------------------------------------------------------------------ */

function EnginePicker() {
  const [workload, setWorkload] = useState<GpuWorkload>('video-decode');
  const picked = ENGINES_BY_WORKLOAD[workload];
  const options = GPU_WORKLOADS.map((w) => ({ value: w, label: ENGINES_BY_WORKLOAD[w].label }));
  return (
    <SpaceBetween size="s">
      <FormField label="Choose a workload to see which engines of the card it uses">
        <Select
          selectedOption={options.find((o) => o.value === workload) ?? options[0]}
          onChange={({ detail }) => setWorkload(detail.selectedOption.value as GpuWorkload)}
          options={options}
          ariaLabel="Choose a workload to see which engines of the card it uses"
        />
      </FormField>
      <Figure
        cites={`F08-36 F08-42 F08-43 ${picked.cites}`}
        caption={
          <>
            The figure draws one GPU card as the separate engines it carries, above the GPU memory that they all
            share. The engines outlined in blue are the ones the selected workload uses, and the others sit idle
            while it runs. The drawing is a schematic and shows no sizes.
          </>
        }
      >
        <GpuEngines workload={workload} idPrefix="workloads" />
      </Figure>
      <Box variant="p">
        <span aria-live="polite">
          <Box variant="strong" display="inline">
            How the card runs {picked.label}:
          </Box>{' '}
          {picked.reason}
        </span>
      </Box>
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function Workloads() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Each of the fifteen computing jobs in the robot's loop runs out of one resource first. That resource is the job's bottleneck, and it tells you which instance type to choose. You can also sort the fifteen jobs into five workload types by three properties of each job, and the workload type tells you which scheduler and purchase option fit."
          >
            20. The Fifteen Workloads: Bottlenecks and Workload Types
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Sections 3 to 8 explain the concepts, and sections 9 to 17 follow the robot&apos;s loop for {TASK}, one stage at a time. Across the whole loop,
            fifteen different kinds of job run on computers. Each kind of job is called a workload.
          </Box>
          <Box variant="p">
            For each workload, you work out two things. The first is its bottleneck: the resource of the machine
            that the workload runs out of first, such as CPU cores, memory bandwidth or GPU memory. You find it by
            comparing what the workload asks of each resource per second with what that resource can deliver. The
            bottleneck tells you which instance type to choose.
          </Box>
          <Box variant="p">
            The second is its workload type. You find it from three properties of the job: its duration, its
            coupling and its interruptibility. Duration is how long one unit of its work runs. Coupling is whether
            its pieces exchange data while they run. Interruptibility is whether it can lose its machine and resume
            without losing more than one unit of work. With these three properties, you can sort the fifteen
            workloads into five workload types: Independent tasks, Long single-machine runs, Multi-node training,
            Always-on streams and Real-time on the robot.
          </Box>
          <Box variant="p">
            The workload type tells you which scheduler or orchestrator to use and which purchase option fits. An
            orchestrator is a service that queues jobs and starts machines for them, such as AWS Batch. The purchase
            option is the way you pay for the instances, for example On-Demand or Spot Instances.
          </Box>
          <LoopOnAws
            emphasis="part"
            cites="F08-76 F08-78 F09-5 F09-10 F09-80 F09-81 F09-84 F09-109 F07-84"
            caption={
              <>
                Step through one trip around the loop. Each card shows three things: what the stage does for the
                arm, the resource of the machine that the stage loads, and the AWS service it runs on. The colour of
                each card also marks the resource, and the table of resources further down explains each name. Section
                24, Orchestrating Physical AI on AWS, covers the services.
              </>
            }
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Learn what each of the fifteen workloads does for the arm, in the order in which the loop runs them."
          >
            What the fifteen workloads do for the arm
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            We counted fifteen workloads by splitting each of the loop&apos;s eight phases wherever two of its steps
            load different resources of the machine. Twelve of the workloads can run for one arm on a desk machine or
            on one EC2 instance. The other three are done by vendors at large scale. You receive their results as
            finished checkpoints or services, and only the vendors&apos; published numbers describe them.{' '}
            <Cite id="F08-75">where the count of fifteen comes from</Cite> The list below groups the twelve more
            coarsely, by the six stages of the loop from collecting data to deploying the policy, and puts the three
            vendor-scale workloads last.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Collect.</strong> <em>Record and encode</em> saves the arm&apos;s joint angles and compresses
              the two camera streams into video while a person guides the arm.
            </li>
            <li>
              <strong>Curate.</strong> <em>Decode and filter</em> turns the video back into frames and drops bad
              episodes. <em>Embed and deduplicate</em> uses a vision model to turn each clip into a vector, so that
              near-copies can be found and dropped. <em>Dataloader decode and augment</em> pulls a few frames from
              the video for every training sample and varies them, for example with a crop or a colour shift.
            </li>
            <li>
              <strong>Simulate.</strong> <em>CPU physics step</em> advances one simulated copy of the arm and its
              scene by one timestep. <em>GPU-parallel physics</em> steps thousands of copies together.{' '}
              <em>Simulated cameras</em> draws what each simulated camera sees.
            </li>
            <li>
              <strong>Train.</strong> <em>Policy fine-tune</em> trains the arm&apos;s policy. It either trains ACT
              (Action Chunking with Transformers) from scratch, or adapts a VLA (vision-language-action model) from
              its existing checkpoint. ACT is the small policy of section 4, Learning From Demonstrations, and VLAs
              are the subject of section 5, Vision-Language-Action Models.{' '}
              <em>World-model training</em> teaches a small model to predict what the scene looks like after an
              action.
            </li>
            <li>
              <strong>Evaluate.</strong> <em>Closed-loop evaluation</em> lets each checkpoint attempt the task many
              times in simulation and counts the successes.
            </li>
            <li>
              <strong>Deploy.</strong> <em>Engine build</em> compiles the chosen policy for the robot&apos;s chip.{' '}
              <em>On-robot inference</em> runs the compiled policy on the robot. Each call of the policy returns a
              chunk of actions, and the arm&apos;s control loop runs at 30 Hz.
            </li>
            <li>
              <strong>Done at vendor scale.</strong> <em>Generative augmentation</em> uses a large video model to
              re-render existing clips or create new ones. <em>Robot foundation-model pretraining</em> and{' '}
              <em>world-model pretraining</em> train the base models that the two training workloads start from.
            </li>
          </ul>
          <Box variant="p">
            <Cite id="F08-76">the fifteen workloads, one row each</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You can estimate a workload's bottleneck with simple arithmetic before you run anything, and then confirm it with the processor's hardware counters."
          >
            How to find a workload&apos;s bottleneck
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A bottleneck is the resource that is fully used while the rest of the machine is partly idle. Once one
            resource is fully used, the workload cannot go faster on that machine, however much of the other
            resources is still free. To find the bottleneck, take what one unit of work needs from a resource and
            multiply it by the number of units per second. The result is the demand on that resource. Then compare
            the demand with the supply, which is what the resource can deliver per second. The resource whose demand
            comes closest to its supply is the bottleneck.
          </Box>
          <Box variant="p">
            Here is the method applied to a small test program that runs on one CPU core. The program stands in for
            the arm&apos;s real policy, which runs on a GPU. It holds six 1024 x 1024 <code>float32</code> matrices
            and multiplies a vector by each matrix in turn. One pass through the six matrices counts as one
            inference. The six matrices hold 6 x 1024 x 1024 x 4 bytes = 25.2 MB of weights. That is more than the
            caches hold, so every inference reads all 25.2 MB from main memory.
          </Box>
          <Box variant="p">
            Because every inference reads its weights from main memory, the resource to check first is memory
            bandwidth. Memory bandwidth is the rate at which memory can deliver data to a core, measured in GB/s. We
            measured the figures below ourselves, each in a single run on one Cortex-A78AE core of an {JETSON}. The
            Jetson Orin Nano Super is the small robot computer of section 17, Running on the Robot.
          </Box>
          <Box variant="p">
            First, work out the demand. The test program ran 390 inferences per second, and each inference reads
            25.2 MB of weights. So the program asked memory for 390 x 25.2 MB = 9.8 GB/s.
          </Box>
          <Box variant="p">
            Next, find the supply, which is what the memory can deliver to this core. We measured it with a second
            program on the same core that streams through arrays larger than the caches. It reached 11.71 GB/s.{' '}
            <Cite id="F08-66">our profiling report, memory streaming row</Cite>
          </Box>
          <Box variant="p">
            The program asked for 9.8 GB/s, and the streaming test shows that the memory delivers 11.71 GB/s to this
            core. So the program used most of the memory bandwidth available to the core, and memory bandwidth is
            the likely bottleneck. <Cite id="F08-63">arithmetic on the stand-in&apos;s weights</Cite>
          </Box>
          <Box variant="p">
            The calculation alone cannot prove that memory, and not the core&apos;s computation, held the program at
            390 inferences per second. The core&apos;s hardware counters can. These counters are built into the
            processor and record events such as clock cycles spent waiting. On this core, 62.3% of the clock cycles
            were stalled, waiting for memory.{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite> So the bottleneck of this program
            is memory bandwidth. When you compare machines for this kind of program, compare their memory bandwidth
            in GB/s.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Learn what each of the eleven resources of a machine does, and which measurement shows that it is fully used."
          >
            The resources that can become a bottleneck
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The table below divides a machine into eleven resources that can each become the bottleneck. Four
            belong to the CPU and its memory, five belong to the GPU, and the last two are storage and the
            network. <Cite id="F08-50">the dive&apos;s grouping of the machine into resources</Cite> The last column
            says how you can tell that a resource is fully used. Section 21, Reading a Machine, shows how to read
            the hardware counters that confirm each of these signs.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={TH}>Resource</th>
                  <th style={TH}>What it is</th>
                  <th style={TH}>How you can tell it is fully used</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>
                    <Part tone="cpu">CPU front end</Part>
                  </td>
                  <td style={TD}>The part of a CPU core that fetches instructions and decodes them.</td>
                  <td style={TD}>
                    The part of the core that executes instructions is ready, but no decoded instructions arrive.
                    Large code, or code with many branches, causes this. <Cite id="F08-4">Intel perfmon metrics file, Frontend_Bound</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="cpu">CPU back end</Part>
                  </td>
                  <td style={TD}>
                    The part of a CPU core that executes the decoded instructions on its arithmetic units.
                  </td>
                  <td style={TD}>
                    Instructions queue up inside the core while little time is spent waiting for memory. Either the
                    arithmetic units are all busy, or each operation waits for the result of the one before it.{' '}
                    <Cite id="F08-6">Intel perfmon metrics file, Memory_Bound and Core_Bound</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="memory">Memory bandwidth</Part>
                  </td>
                  <td style={TD}>The rate at which memory can deliver data to a core, in GB/s.</td>
                  <td style={TD}>
                    The core stalls while it waits for data, and the bytes per second it reads are at the
                    machine&apos;s limit. Reading through data larger than the caches causes this.{' '}
                    <Cite id="F08-41">Intel perfmon metrics file, MEM_Bandwidth and MEM_Latency</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="memory">Memory latency</Part>
                  </td>
                  <td style={TD}>
                    The time one fetch from memory takes, in nanoseconds. It becomes the limit when each address
                    depends on the value fetched before it.
                  </td>
                  <td style={TD}>
                    The core shows the same stalls while it waits for data, but the bytes per second it reads stay
                    low. <Cite id="F08-41">Intel perfmon metrics file, MEM_Bandwidth and MEM_Latency</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="tensor">GPU tensor cores</Part>
                  </td>
                  <td style={TD}>
                    Units that execute matrix multiply-and-accumulate instructions. This is the arithmetic that
                    neural networks run on.
                  </td>
                  <td style={TD}>
                    DCGM (Data Center GPU Manager) is NVIDIA&apos;s tool for monitoring a fleet of GPUs. Its tensor
                    activity field gives the fraction of cycles in which the tensor pipeline was active. When the
                    tensor cores are fully used, that field is high. <Cite id="F08-42">NVIDIA Tensor Cores page and Nsight Compute profiling guide</Cite>{' '}
                    <Cite id="F08-32">DCGM user guide, profiling metrics</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="general">General GPU compute</Part>
                  </td>
                  <td style={TD}>
                    The integer and floating-point units that run ordinary GPU code. They sit inside each SM
                    (streaming multiprocessor), the GPU&apos;s core processing unit.
                  </td>
                  <td style={TD}>
                    DCGM&apos;s SM activity field is high while its tensor activity field stays low.{' '}
                    <Cite id="F08-36">Nsight Compute profiling guide, streaming multiprocessor</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="rt">GPU ray-tracing cores</Part>
                  </td>
                  <td style={TD}>
                    RT cores are hardware that speeds up the search for which triangle a ray hits (section 13,
                    Rendering and Ray Tracing). <Cite id="F06-57">NVIDIA Developer, ray tracing page</Cite>
                  </td>
                  <td style={TD}>
                    We did not find a utilisation counter for RT cores. The one sign we know of is indirect: a
                    renderer that needs RT cores will not run on a card that lacks them.{' '}
                    <Cite id="F08-36">Nsight Compute profiling guide, streaming multiprocessor</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="video">GPU video engines</Part>
                  </td>
                  <td style={TD}>
                    Fixed-function circuits that do only one job. NVENC (NVIDIA encoder) compresses video, and NVDEC
                    (NVIDIA decoder) decompresses it.
                  </td>
                  <td style={TD}>
                    In <code>nvidia-smi</code>, the encoder or decoder utilisation field is high.{' '}
                    <code>nvidia-smi</code> reports these two fields separately from its compute figure. <Cite id="F08-31">nvidia-smi documentation, utilization fields</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="memory">GPU memory</Part>
                  </td>
                  <td style={TD}>
                    The card&apos;s own memory. Its capacity sets whether a job fits on the card at all, and its
                    bandwidth sets how fast the engines receive data.
                  </td>
                  <td style={TD}>
                    Compare the memory in use with the card&apos;s size. Also check DRAM activity, the fraction of
                    cycles in which data moved to or from that memory.{' '}
                    <Cite id="F08-32">DCGM user guide, profiling metrics</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="outside">Storage</Part>
                  </td>
                  <td style={TD}>Disks and file systems. The instance type sets their maximum throughput.</td>
                  <td style={TD}>
                    The operating system&apos;s I/O counters stay at the instance&apos;s limit.{' '}
                    <Cite id="F08-46">EC2 accelerated computing specifications, EBS and instance store</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="outside">Network</Part>
                  </td>
                  <td style={TD}>
                    EC2 has two network devices. ENA (Elastic Network Adapter) moves data over ordinary IP
                    networking. EFA (Elastic Fabric Adapter) bypasses the operating system so that many machines can
                    train one model together.
                  </td>
                  <td style={TD}>
                    Network throughput stays at the instance&apos;s limit, or a multi-node job runs on an instance
                    size that has no EFA. <Cite id="F08-48">EC2 User Guide, Elastic Fabric Adapter</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Memory bandwidth and memory latency count as two separate resources, because a machine that is much
            faster on one can be only somewhat faster on the other. The second machine we measured shows this. It is
            an {SPARK}, a desk-side computer whose CPU and GPU share one memory, as the Jetson&apos;s do. In a single
            run of the same streaming test, one Cortex-X925 core of the DGX Spark read 44.38 GB/s, 3.8 times as much
            as the Jetson core. <Cite id="F08-66">our profiling report, memory streaming row</Cite> In a test where
            the address of each fetch depends on the previous fetch, one fetch took 291.58 ns on the Jetson core and
            123.96 ns on the X925 core. So on latency, the X925 core was only 2.4 times faster.{' '}
            <Cite id="F08-67">our profiling report, latency rows</Cite> All of our
            measurements in this section share the same limits: each is one run on one core, with a test program in
            place of the real workload, and none was made on an EC2 instance.{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Box variant="p">
            A GPU carries several of these resources on one card, and the figure below draws each of them as a
            separate engine. Choose a workload to see which engines it uses.
          </Box>
          <EnginePicker />
          <Box variant="p">
            Some cards lack an engine altogether. By default, LeRobot writes its video in the AV1 (AOMedia Video 1)
            codec. The H100, the training GPU of EC2&apos;s P5 family, has no video encoder and cannot decode AV1 in
            hardware. <Cite id="F05-47">NVIDIA video encode and decode support matrix, H100 rows</Cite> The GPU of
            the G7 family carries tensor cores, RT cores and both kinds of video engine on one card.{' '}
            <Cite id="F08-43">Amazon EC2 G7 instances page</Cite> The{' '}
            <Link href="../silicon-memory-inference/">Silicon, Memory and Inference dive</Link> explains how a GPU
            and the memory hierarchy execute a model.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find which resource each of the fifteen workloads runs out of first. On machines bought for their GPUs, the first bottleneck is often the CPU cores."
          >
            The bottleneck of each workload
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">Grouped by the stage of the loop, the fifteen workloads have these bottlenecks:</Box>
          <ul style={LIST}>
            <li>
              <strong>Collect and curate.</strong> Recording and encoding, decoding and filtering, and the dataloader
              all run out of CPU cores first. Embedding and deduplication runs its vision model on the tensor cores,
              but fetching the clips can become the bottleneck before the tensor cores do.
            </li>
            <li>
              <strong>Simulate.</strong> The three simulation workloads each have a different bottleneck. CPU
              physics keeps the back end of one CPU core busy for each simulated world. GPU-parallel physics loads
              the GPU&apos;s general compute units. Simulated cameras run out of GPU memory first.
            </li>
            <li>
              <strong>Train.</strong> Policy fine-tuning and world-model training run out of tensor cores first.
              GPU memory also has to be large enough for the model to fit on the card.
            </li>
            <li>
              <strong>Evaluate.</strong> Closed-loop evaluation combines the physics, camera and inference
              workloads, so it loads several resources at once: the CPU cores or the GPU for physics, the tensor
              cores for the policy calls, and GPU memory for the cameras.
            </li>
            <li>
              <strong>Deploy.</strong> Both workloads run on the robot&apos;s own computer. Building the engine
              keeps that computer&apos;s GPU busy for minutes. Running the policy loads the tensor cores of that
              GPU, and its memory bandwidth matters as well.
            </li>
            <li>
              <strong>Vendor-scale work.</strong> Generative augmentation needs the tensor cores and tens of GB of
              GPU memory. The two pretraining workloads run on tensor cores across many nodes, so the network
              between the nodes and the storage that feeds them matter too.
            </li>
          </ul>
          <Box variant="p">
            Recording, decoding and the dataloader run out of CPU cores for the same reason: LeRobot&apos;s default
            AV1 video is written and read by CPU code. The GPUs most used for training either cannot decode AV1 or
            have no row in NVIDIA&apos;s table of which GPUs support which codecs. So on a machine bought for its
            GPUs, the first bottleneck is often a CPU core.{' '}
            <Cite id="F08-77">the CPU next to the GPU, in three rows</Cite>
          </Box>
          <Box variant="p">
            Each EC2 instance size also comes with a fixed number of CPU cores for each GPU. A vCPU (virtual CPU) is
            the unit in which EC2 counts processor capacity. On most eight-GPU instance sizes, each GPU comes with 24
            vCPUs. That is 12 physical cores, because each core presents itself as two vCPUs.{' '}
            <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>
          </Box>

          <ExpandableSection headerText="Look up a workload: all fifteen workloads against the eleven resources">
            <Figure
              cites="F08-50 F08-76"
              minWidth={1100}
              caption={
                <>
                  Each row is a workload and each column is a resource of the machine. The cell marked
                  &quot;first&quot; and outlined in blue is the workload&apos;s bottleneck, based on the evidence
                  listed below the grid. The other cells mark resources that also matter. &quot;Also&quot; marks a
                  resource the workload loads as well. &quot;Then&quot; marks the resource it runs out of next.
                  &quot;Or&quot; marks another resource that can do the same work. &quot;Limit&quot; marks GPU memory
                  that must be large enough for the model to fit. &quot;Mix&quot; marks evaluation, which combines
                  several other rows. A cell that spans both CPU columns means the evidence names CPU cores without
                  saying which half of the core is the bottleneck. None of the evidence cited here shows a workload
                  whose bottleneck is memory latency.
                </>
              }
            >
              <WorkloadMatrix />
            </Figure>
          </ExpandableSection>

          <ExpandableSection headerText="Evidence for collect and curate: four workloads, mostly limited by CPU cores">
            <ul style={LIST}>
              <li>
                <strong>Record and encode</strong> (section 9, Collecting Data). The computer next to the arm
                compresses the video of two cameras running at 30 Hz into AV1. LeRobot&apos;s default encoder runs in
                software. <Cite id="F05-35">LeRobot configs/video.py</Cite> The Jetson Orin Nano has no hardware
                video encoder. <Cite id="F05-57">Jetson Linux guide, software encode in Orin Nano</Cite> So on that
                computer, the CPU cores must keep up with 55.3 MB/s of raw pixels.{' '}
                <Cite id="F01-86">arithmetic on the camera settings</Cite>
              </li>
              <li>
                <strong>Decode and filter</strong> (section 10, Processing and Curating). On a CPU, video decoding is
                integer code with many branches. A GPU&apos;s decode engines can do the work instead, if the card
                supports the codec. On EC2, the G6, G6e, G7 and G7e families can decode AV1 in hardware, and the P5
                family cannot. <Cite id="F05-67">join of the NVIDIA matrix and the EC2 specifications</Cite>
              </li>
              <li>
                <strong>Embed and deduplicate</strong> (section 10). A vision encoder is matrix arithmetic, so it runs
                on the tensor cores. Fetching the clips can still become the bottleneck before the tensor cores do.
                Cosmos Curator is NVIDIA&apos;s toolkit for curating training data. Its design notes describe one
                captioning run, cancelled before it finished, in which 32 H100 GPUs ran at about 17% utilisation
                because fetching the clips was the slow step.{' '}
                <Cite id="F05-76">Cosmos Curator curator-next-robot-action-caption.md</Cite>
              </li>
              <li>
                <strong>Dataloader decode and augment</strong> (sections 10 and 11). The dataloader is the code that
                prepares each training sample for the GPU. By default, the decoding and the augmentation both run in
                worker processes on the CPU. LeRobot&apos;s documentation describes the result: &quot;the GPU ends up
                waiting for data&quot;. <Cite id="F05-58">LeRobot dataset docs, running transforms on the GPU</Cite>
              </li>
            </ul>
          </ExpandableSection>

          <ExpandableSection headerText="Evidence for simulate: three workloads with three different bottlenecks">
            <ul style={LIST}>
              <li>
                <strong>CPU physics step</strong> (section 12, Physics Simulation). MuJoCo is a physics simulator.
                In MuJoCo, one simulation step runs through 26 stages.{' '}
                <Cite id="F06-9">MuJoCo docs, simulation pipeline</Cite> The work is scalar arithmetic with branches
                that depend on the data, and it has little memory traffic. So each simulated world keeps the back end
                of one CPU core busy. We measured this in single runs on one core at a time, with a MuJoCo humanoid
                model in place of the arm. One Cortex-A78AE core
                of an {JETSON} ran 14,507 steps per second with MuJoCo 3.17.0. On an {SPARK} with MuJoCo 4.0.1, one
                Cortex-A725 core ran 28,662 steps per second and one Cortex-X925 core ran 57,240. On the X925, the
                hardware counters attributed 36.5% of the core&apos;s capacity to stalls in the back end, and only
                0.4% of cycles to stalls on memory. So the core was waiting for its own arithmetic.{' '}
                <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
                <Cite id="F08-73">limits of our measurements</Cite>
              </li>
              <li>
                <strong>GPU-parallel physics</strong> (sections 8 and 12). It is the same scalar arithmetic, run for
                many simulated worlds at once. We expect it to load the GPU&apos;s general compute units and leave the
                tensor cores idle, but we have not measured that. <Cite id="F08-42">NVIDIA Tensor Cores page and Nsight Compute profiling guide</Cite>{' '}
                The MuJoCo Warp project reports 5.77 million steps per second for a humanoid model across 8192
                simulated worlds on one RTX 6000 Ada GPU.{' '}
                <Cite id="F06-20">MuJoCo Warp nightly benchmarks, humanoid</Cite>
              </li>
              <li>
                <strong>Simulated cameras</strong> (section 13, Rendering and Ray Tracing). GPU memory becomes the
                bottleneck first. In each simulated world, a camera needs megabytes of GPU memory, while the physics
                needs only kilobytes. The rendering work is the next bottleneck after GPU memory. Cartpole
                is a small benchmark task in which a controller balances a pole on a cart. In Isaac Lab&apos;s
                benchmark file, one small camera in each simulated world took a Cartpole run to 57.3 GB of GPU
                memory. Comparing NVIDIA&apos;s rows with and
                without the camera shows that the camera cut the run&apos;s throughput by a factor of 6.7.{' '}
                <Cite id="F06-48">Isaac Lab v3.0.0 benchmark file, Cartpole-Camera rows</Cite>
              </li>
            </ul>
          </ExpandableSection>

          <ExpandableSection headerText="Evidence for train and evaluate: three workloads, mostly limited by tensor cores">
            <ul style={LIST}>
              <li>
                <strong>Policy fine-tune</strong> (section 15, Training at Three Scales). The tensor cores do the
                work, and the model must fit in the card&apos;s GPU memory. As an indicative figure,
                LeRobot&apos;s hardware guide says that ACT trains in 30 to 60 minutes on one RTX 4090 or RTX 3090.{' '}
                <Cite id="F01-90">LeRobot hardware guide, memory by policy group and common scenarios</Cite>
              </li>
              <li>
                <strong>World-model training</strong> (section 7, JEPA). A small world model puts only a light load on
                the GPU. LeWorldModel is a world model with about 15M parameters, and its authors state that it trains on
                &quot;a single GPU in a few hours&quot;. They do not name the GPU.{' '}
                <Cite id="F03-31">LeWorldModel paper, abstract</Cite>
              </li>
              <li>
                <strong>Closed-loop evaluation</strong> (section 16, Evaluation). Evaluation combines the physics,
                camera and inference workloads, and it runs many independent copies of them. For physics alone,
                NVIDIA reports that eight independent runs took 1,255.2 s on one L40 GPU and 157.8 s on eight,
                &quot;a 7.95x speedup&quot;. <Cite id="F06-93">Isaac Lab-Arena docs, performance and scaling</Cite>
              </li>
            </ul>
          </ExpandableSection>

          <ExpandableSection headerText="Evidence for deploy: two workloads on the robot&apos;s own computer">
            <ul style={LIST}>
              <li>
                <strong>Engine build</strong> (section 17, Running on the Robot). An engine is a compiled version of
                the model, tuned for one GPU type. To build one, you first export the model to ONNX (Open Neural
                Network Exchange), a portable file format for trained networks. Then TensorRT, NVIDIA&apos;s inference
                compiler, turns the ONNX file into the engine. NVIDIA&apos;s deployment README says the build occupies the target device&apos;s GPU and
                CPU for about 2 to 5 minutes. <Cite id="F07-8">Isaac-GR00T deployment README, build notes</Cite>
              </li>
              <li>
                <strong>On-robot inference</strong> (section 17). On the robot&apos;s computer, the CPU and GPU share
                one memory. NVIDIA reports that one call of its GR00T N1.7 policy takes 149.0 ms on a Jetson Orin.
                That is as long as 4.5 control periods of the arm, which runs at 30 Hz.{' '}
                <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
              </li>
            </ul>
          </ExpandableSection>

          <ExpandableSection headerText="Evidence for vendor-scale work: three workloads you receive as checkpoints">
            <ul style={LIST}>
              <li>
                <strong>Generative augmentation</strong> (section 11, Augmentation and Synthetic Data). The video
                model needs the tensor cores and tens of GB of GPU memory. NVIDIA lists 207.78 s to generate one 720p
                clip with its Cosmos3-Nano model on an H100 80GB.{' '}
                <Cite id="F05-98">NVIDIA Cosmos inference benchmarks and methodology</Cite>
              </li>
              <li>
                <strong>Robot foundation-model pretraining</strong> (sections 5 and 15). Gradients are the corrections
                to the model&apos;s weights that each training step computes. In this pretraining, every node
                exchanges gradients with the others at every step. So the tensor cores, the network between the
                nodes and the storage that feeds them all matter at the same time. NVIDIA&apos;s paper puts the
                pretraining of GR00T N1 at roughly 50,000 H100 GPU-hours on up to 1,024 GPUs.{' '}
                <Cite id="F02-34">GR00T N1 paper, sections 2 and 3</Cite>
              </li>
              <li>
                <strong>World-model pretraining</strong> (sections 6, 7 and 15). It loads the same resources at a
                larger scale. For Cosmos3-Nano, NVIDIA names 1,024 GPUs in its GB200 rack-scale systems and gives no
                duration. <Cite id="F03-97">Cosmos 3 paper, section 4.1</Cite>
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See how far apart EC2 instance types are on four resources, and why the GPU utilisation figure from nvidia-smi cannot tell you which resource is fully used."
          >
            Comparing EC2 instance types on each resource
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            When you choose an EC2 instance type, you choose several resources at once. The table shows the lowest
            and the highest value of four resources across the accelerated computing families. Section 23,
            Price-Performance and Latency, compares the families in between.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={TH}>Resource</th>
                  <th style={TH}>Low end</th>
                  <th style={TH}>High end</th>
                  <th style={TH}>Why it matters</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>
                    <Part tone="memory">GPU memory</Part> per GPU
                  </td>
                  <td style={TD}>2.79 GiB, one eighth of an L4 GPU, on g6f.large</td>
                  <td style={TD}>268 GiB, one B300 training GPU, on p6-b300.48xlarge</td>
                  <td style={TD}>
                    It sets whether the job fits at all, however fast the card is. The high end is almost 100 times
                    the low end. <Cite id="F08-45">EC2 accelerated computing specifications, accelerator memory</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="outside">Network</Part>
                  </td>
                  <td style={TD}>2.5 Gbps baseline and no EFA, on g6.xlarge</td>
                  <td style={TD}>6,400 Gbps with EFA, on p6-b300.48xlarge</td>
                  <td style={TD}>
                    It sets whether many nodes can train one model together. The high end is 6,400 / 2.5 = 2,560
                    times the low end, more than a factor of 1,000.{' '}
                    <Cite id="F08-49">EC2 accelerated computing specifications, network</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="outside">Storage</Part>
                  </td>
                  <td style={TD}>125 MB/s baseline, on g6.xlarge</td>
                  <td style={TD}>12,500 MB/s, on g7e.48xlarge and p5en.48xlarge</td>
                  <td style={TD}>
                    It sets how fast data reaches the job from EBS (Elastic Block Store), the network disk of an EC2
                    instance. One arm&apos;s 55.3 MB/s of raw pixels is less than half of the low end.{' '}
                    <Cite id="F08-46">EC2 accelerated computing specifications, EBS and instance store</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="cpu">CPU</Part> per GPU
                  </td>
                  <td style={TD}>4 vCPUs for one GPU, on g6.xlarge and g6e.xlarge</td>
                  <td style={TD}>64 vCPUs for one GPU, on g6.16xlarge and g6e.16xlarge</td>
                  <td style={TD}>
                    It sets how much decoding, augmentation and physics work the CPU can do to keep one GPU supplied
                    with data. Most eight-GPU sizes give 24 vCPUs per GPU, which is 12 physical cores. On the
                    eight-GPU g7.48xlarge, each core runs one thread, so its 24 vCPUs per GPU are 24 physical cores.{' '}
                    <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            The GPU utilisation figure that <code>nvidia-smi</code> prints cannot tell you which resource is fully
            used. A kernel is a program that runs on the GPU. The figure is the percentage of time during which one or
            more kernels were executing. It says nothing about how much of the card a kernel used, so one small
            kernel running back to back reads 100%.{' '}
            <Cite id="F08-30">nvidia-smi documentation, utilization fields</Cite> DCGM has a finer field, SM
            activity, and NVIDIA&apos;s own documentation warns that a value of 0.8 or more is &quot;necessary, but
            not sufficient&quot; for effective use. <Cite id="F08-32">DCGM user guide, profiling metrics</Cite> To
            find the bottleneck, check each resource separately: tensor activity, DRAM activity, encoder and decoder
            utilisation, and the CPU&apos;s hardware counters.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Sort any job into one of five workload types by three of its properties. The workload type tells you which scheduler and purchase option fit the job."
          >
            The five workload types
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The bottleneck tells you which instance type a workload needs. How you schedule the workload on AWS, and
            which purchase option you use for its instances, is a separate decision. For that decision, you describe
            the job by three properties:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Duration</strong> is how long one unit of the job&apos;s work runs, such as one clip, one
              episode or one training run.
            </li>
            <li>
              <strong>Coupling</strong> is whether the job&apos;s pieces exchange data while they run, so that each
              piece needs the others to be running at the same moment.
            </li>
            <li>
              <strong>Interruptibility</strong> is whether the job can lose its machine and resume, losing no more
              than one unit of work.
            </li>
          </ul>
          <Box variant="p">
            Together, the three properties define a job&apos;s workload type. When we sort the fifteen workloads by
            these properties, they fall into five workload types:{' '}
            <Cite id="F08-78">the five workload types, defined by three properties</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Independent tasks.</strong> Each unit of work is short and does not depend on any other unit.
              If a machine is lost, only the unit it was running is lost. This type covers decode and filter, embed
              and deduplicate, CPU physics, GPU-parallel physics when it is stepped for evaluation or data
              generation, simulated cameras, closed-loop evaluation, engine build and generative augmentation.
            </li>
            <li>
              <strong>Long single-machine runs.</strong> One run keeps one machine busy for hours and does not
              depend on any other machine. If the machine is lost, the job resumes from its last checkpoint. This
              type covers policy fine-tuning, world-model training, and GPU-parallel physics when it runs inside a
              reinforcement-learning run.
            </li>
            <li>
              <strong>Multi-node training.</strong> One run takes days across many nodes. At every training step,
              the nodes exchange gradients. Gradients are the corrections to the model&apos;s weights that the step
              computes. So the job cannot stop without losing the current step on every node. This type covers the
              two pretraining workloads.
            </li>
            <li>
              <strong>Always-on streams.</strong> The work runs all the time at a steady rate, and the items it
              processes do not depend on each other. If a machine is lost, only the item it was processing is lost.
              This type covers dataloader decoding when it runs on a permanent group of preprocessing machines, and
              the continuous decoding of incoming video.
            </li>
            <li>
              <strong>Real-time on the robot.</strong> The work runs as long as the robot runs, and each unit of work
              has a deadline. Its only coupling is to the robot&apos;s control clock, and it cannot be interrupted.
              This type covers recording and encoding, and on-robot inference.
            </li>
          </ul>
          <Box variant="p">
            Each of the three properties also connects back to a resource of the machine:{' '}
            <Cite id="F08-79">how each property maps to a resource</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Coupling connects to the network.</strong> A Multi-node training job needs EFA. Independent
              tasks lose nothing by running on the small instance sizes that have no EFA.
            </li>
            <li>
              <strong>Interruptibility connects to storage.</strong> When a job stops, it loses the work that it has
              not yet written to storage. So how much a Long single-machine run loses depends on how often it writes
              a checkpoint.
            </li>
            <li>
              <strong>Duration, measured against the robot&apos;s control clock, connects to latency.</strong> A
              Real-time workload on the robot has a deadline for each unit of work: 33.3 ms when the arm runs at
              30 Hz. For every other workload type, only throughput matters.
            </li>
          </ul>
          <Box variant="p">
            Scale can change a workload&apos;s type while its bottleneck stays the same. Decoding one arm&apos;s 50
            episodes takes a few minutes on a laptop, so it runs as Independent tasks. At a company that ingests
            video all day, the same code runs on a permanent group of CPU machines, so it becomes an Always-on
            stream. In both cases, the bottleneck is the CPU cores.{' '}
            <Cite id="F08-80">one workload, two workload types</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Take any of the fifteen workloads to a running job on AWS, and see which section covers each step."
          >
            From a workload to a running job on AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol style={LIST}>
            <li>
              <strong>Confirm the bottleneck.</strong> Find the workload&apos;s row in the lookup grid above and read
              its bottleneck. The hardware counters of a CPU sit in its PMU (performance monitoring unit).
              Section 21, Reading a Machine, shows how to confirm the bottleneck with the PMU&apos;s
              counters and the GPU&apos;s counters. Section 22, Our Measurements, and section 23, Price-Performance
              and Latency, then measure and compare machines on that resource.
            </li>
            <li>
              <strong>Place the workload by its type.</strong> Section 24, Orchestrating Physical AI on AWS, places
              all fifteen workloads. For each workload type, it names an orchestrator and a purchase option.
            </li>
            <li>
              <strong>Configure the orchestrator.</strong> Each orchestrator has its own section: section 25, AWS
              Batch; section 26, AWS Parallel Computing Service; section 27, Amazon SageMaker HyperPod; and section
              28, Amazon EKS. Section 29, Choosing, brings the bottleneck and the workload type together in one
              table.
            </li>
          </ol>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
