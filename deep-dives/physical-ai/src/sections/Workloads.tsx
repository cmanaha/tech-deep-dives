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
  /** The role word: first, also, then, or, gate, mix. It is printed in the cell. */
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
          { at: 7, role: 'or', text: 'the decode engine, where the card has the codec' },
        ],
      },
      {
        name: 'Embed and deduplicate',
        where: 'section 10',
        fills: [
          { at: 4, role: 'first', text: 'a vision encoder over clips' },
          { at: 9, span: 2, role: 'also', text: 'fetching the clips' },
        ],
      },
      {
        name: 'Dataloader decode and augment',
        where: 'sections 10 and 11',
        fills: [{ at: 0, span: 2, role: 'first', text: 'decode and image transforms per sample' }],
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
          { at: 0, role: 'also', text: 'branches in collision' },
          { at: 1, role: 'first', text: 'arithmetic, one world per core' },
        ],
      },
      {
        name: 'GPU-parallel physics',
        where: 'sections 8 and 12',
        fills: [
          { at: 0, span: 2, role: 'also', text: 'one CPU core feeds the GPU' },
          { at: 5, role: 'first', text: 'thousands of worlds per step' },
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
          { at: 8, role: 'gate', text: 'the model must fit' },
        ],
      },
      { name: 'World-model training', where: 'section 7', fills: [{ at: 4, role: 'first', text: 'lightly: a small model' }] },
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
          { at: 2, role: 'also', text: 'one memory shared by CPU and GPU' },
          { at: 4, role: 'first', text: 'one policy call per chunk' },
        ],
      },
    ],
  },
  {
    phase: 'Vendor scale: reaches you as a checkpoint, known from published numbers only',
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
          { at: 9, role: 'also', text: 'feeds the nodes' },
          { at: 10, role: 'also', text: 'the fabric between nodes' },
        ],
      },
      {
        name: 'World-model pretraining',
        where: 'sections 6, 7 and 15',
        fills: [
          { at: 4, role: 'first', text: 'across many nodes' },
          { at: 9, role: 'also', text: 'feeds the nodes' },
          { at: 10, role: 'also', text: 'the fabric between nodes' },
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
  /* The workload names stay in view while the part columns scroll sideways on a phone. */
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
        Fifteen workloads against the parts of the machine
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
      <FormField label="Workload to light on the card">
        <Select
          selectedOption={options.find((o) => o.value === workload) ?? options[0]}
          onChange={({ detail }) => setWorkload(detail.selectedOption.value as GpuWorkload)}
          options={options}
          ariaLabel="Workload to light on the card"
        />
      </FormField>
      <Figure
        cites={`F08-36 F08-42 F08-43 ${picked.cites}`}
        caption={
          <>
            One card, drawn as the separate engines it carries above the memory they share. The rows outlined in blue
            are the ones the selected workload uses; the others sit idle while it runs. Schematic, with no sizes
            drawn.
          </>
        }
      >
        <GpuEngines workload={workload} idPrefix="workloads" />
      </Figure>
      <Box variant="p">
        <span aria-live="polite">
          <Box variant="strong" display="inline">
            Why, for {picked.label}:
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
            description="See what each of the loop's fifteen workloads does for the arm, which part of the machine it fills first, and the three properties that decide how it is scheduled (EC2 specifications and vendor documentation read 2026-11-20; our own measurements are single runs)"
          >
            20. Fifteen Workloads, Five Shapes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Sections 3 to 17 each taught one stage of the robot&apos;s loop and ended on what it costs to run. Those
            threads meet here, for {TASK}: what each piece of work does for the arm, then which part of a computer
            it fills first, then the shape that decides how it is scheduled on AWS.
          </Box>
          <LoopOnAws
            emphasis="part"
            cites="F08-76 F08-78 F09-5 F09-10 F09-80 F09-81 F09-84 F09-109 F07-84"
            caption={
              <>
                Step through one trip around the loop. Each card says what the stage does for the arm, the part of
                the machine it loads (in colour; the parts table below explains each name) and the AWS service it
                runs on (section 24&apos;s subject). The placements are our reading of the cited entries.
              </>
            }
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Know every job the loop asks a computer to do, in the loop's order, before any hardware is named">
            What the fifteen workloads do for the arm
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A workload is one kind of job the loop hands to a computer. Fifteen is our reading: split the
            loop&apos;s eight phases wherever two steps load different parts of the machine. That gives twelve
            workloads you can run for one arm on a desk machine or one EC2 instance. Three more reach you as
            finished checkpoints or services, and are known only from published vendor numbers.{' '}
            <Cite id="F08-75">where the count of fifteen comes from</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Collect.</strong> <em>Record and encode</em>: while a person guides the arm, save its joint
              angles and compress two camera streams into video.
            </li>
            <li>
              <strong>Curate.</strong> <em>Decode and filter</em>: turn video back into frames and drop bad
              episodes. <em>Embed and deduplicate</em>: a vision model turns each clip into a vector so
              near-copies can be dropped. <em>Dataloader decode and augment</em>: for every training sample, pull
              a few frames from the video and vary them (a crop, a colour shift).
            </li>
            <li>
              <strong>Simulate.</strong> <em>CPU physics step</em>: advance one simulated copy of the arm and its
              scene by one timestep. <em>GPU-parallel physics</em>: step thousands of copies together.{' '}
              <em>Simulated cameras</em>: draw what each simulated camera sees.
            </li>
            <li>
              <strong>Train.</strong> <em>Policy fine-tune</em>: train ACT (Action Chunking with Transformers, the
              small policy of section 4) from scratch, or adapt a VLA (vision-language-action model, section 5)
              from its checkpoint. <em>World-model training</em>: teach a small model to predict what the scene
              becomes after an action.
            </li>
            <li>
              <strong>Evaluate.</strong> <em>Closed-loop evaluation</em>: each checkpoint attempts the task many
              times in simulation, and successes are counted.
            </li>
            <li>
              <strong>Deploy.</strong> <em>Engine build</em>: compile the chosen policy for the robot&apos;s chip.{' '}
              <em>On-robot inference</em>: run it there, one call per chunk of actions, on the arm&apos;s 30 Hz
              control clock.
            </li>
            <li>
              <strong>Arriving finished.</strong> <em>Generative augmentation</em>: a large video model re-renders
              or invents clips. <em>Robot foundation-model pretraining</em> and <em>world-model pretraining</em>:
              train the base models that the two training workloads start from.
            </li>
          </ul>
          <Box variant="p">
            <Cite id="F08-76">the fifteen workloads, one row each</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Know each part by what it does and by the sign that it is full, before any instance name appears">
            The parts of the machine
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A computer is several machines sharing a box. A workload fills one of them first, and once that part is
            full the others sit partly idle while the job goes no faster. Naming that part tells you which machine
            to choose. The dive groups the machine into nine parts on the chip, with storage and network outside
            it: four belong to the processor and its memory, five to the GPU.{' '}
            <Cite id="F08-50">the dive&apos;s grouping of the machine into parts</Cite> Section 21 teaches the
            counters that confirm each sign in the last column.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={TH}>Part</th>
                  <th style={TH}>What it is</th>
                  <th style={TH}>How you see it full</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>
                    <Part tone="cpu">CPU front end</Part>
                  </td>
                  <td style={TD}>
                    The part of a core that fetches instructions and decodes them.
                  </td>
                  <td style={TD}>
                    The executing part sits ready and no decoded instruction arrives. Large or branchy code does
                    this. <Cite id="F08-4">Intel perfmon metrics file, Frontend_Bound</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="cpu">CPU back end</Part>
                  </td>
                  <td style={TD}>
                    The part of a core that executes the decoded instructions on its arithmetic units.
                  </td>
                  <td style={TD}>
                    Work queues inside the core with little waiting on memory: the arithmetic units are busy, or
                    each operation waits for the result of the one before.{' '}
                    <Cite id="F08-6">Intel perfmon metrics file, Memory_Bound and Core_Bound</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="memory">Memory bandwidth</Part>
                  </td>
                  <td style={TD}>The rate at which memory streams bytes to a core, in GB/s.</td>
                  <td style={TD}>
                    The executing part stalls waiting for data, with bytes per second at the machine&apos;s limit. Sweeping
                    through data larger than the caches does this.{' '}
                    <Cite id="F08-41">Intel perfmon metrics file, MEM_Bandwidth and MEM_Latency</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="memory">Memory latency</Part>
                  </td>
                  <td style={TD}>
                    The time one fetch from memory takes, in nanoseconds. It rules when each address depends on the
                    value fetched before.
                  </td>
                  <td style={TD}>
                    The same stalls at a low byte rate. <Cite id="F08-41">Intel perfmon metrics file, MEM_Bandwidth and MEM_Latency</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="tensor">GPU tensor cores</Part>
                  </td>
                  <td style={TD}>
                    Units that execute matrix multiply-and-accumulate instructions: the arithmetic of neural networks.
                  </td>
                  <td style={TD}>
                    Tensor activity in DCGM (Data Center GPU Manager, NVIDIA&apos;s fleet monitoring tool): the
                    fraction of cycles the tensor pipeline was active.{' '}
                    <Cite id="F08-42">NVIDIA Tensor Cores page and Nsight Compute profiling guide</Cite>{' '}
                    <Cite id="F08-32">DCGM user guide, profiling metrics</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="general">General GPU compute</Part>
                  </td>
                  <td style={TD}>
                    The integer and floating-point units that run ordinary GPU code, inside each SM (streaming
                    multiprocessor, the GPU&apos;s core processing unit).
                  </td>
                  <td style={TD}>
                    SM activity high while tensor activity stays low.{' '}
                    <Cite id="F08-36">Nsight Compute profiling guide, streaming multiprocessor</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="rt">GPU ray-tracing cores</Part>
                  </td>
                  <td style={TD}>
                    RT cores: hardware that speeds up the search for which triangle a ray hits (section 13). <Cite id="F06-57">NVIDIA Developer, ray tracing page</Cite>
                  </td>
                  <td style={TD}>
                    No utilisation counter was located in this research. The sign is cruder: a renderer that needs
                    them will not run on a card without them.{' '}
                    <Cite id="F08-36">Nsight Compute profiling guide, streaming multiprocessor</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="video">GPU video engines</Part>
                  </td>
                  <td style={TD}>
                    Fixed-function circuits that only compress video (NVENC, the NVIDIA encoder) or decompress it
                    (NVDEC, the NVIDIA decoder).
                  </td>
                  <td style={TD}>
                    Encoder and decoder utilisation, which <code>nvidia-smi</code> reports apart from the compute
                    figure. <Cite id="F08-31">nvidia-smi documentation, utilization fields</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="memory">GPU memory</Part>
                  </td>
                  <td style={TD}>
                    The card&apos;s own memory. Its capacity decides whether a job fits at all; its bandwidth decides
                    how fast the engines are fed.
                  </td>
                  <td style={TD}>
                    Memory used against the card&apos;s size, and DRAM activity, the fraction of cycles data moved to
                    or from that memory. <Cite id="F08-32">DCGM user guide, profiling metrics</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="outside">Storage</Part>
                  </td>
                  <td style={TD}>Disks and file systems, with a throughput ceiling the instance type sets.</td>
                  <td style={TD}>
                    The operating system&apos;s I/O counters sitting at the instance&apos;s limit.{' '}
                    <Cite id="F08-46">EC2 accelerated computing specifications, EBS and instance store</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="outside">Network</Part>
                  </td>
                  <td style={TD}>
                    Two devices on EC2. ENA (Elastic Network Adapter) moves data over ordinary IP. EFA (Elastic
                    Fabric Adapter) bypasses the operating system so that many machines can train as one.
                  </td>
                  <td style={TD}>
                    Throughput at the instance&apos;s limit, or a multi-node job on a size with no EFA. <Cite id="F08-48">EC2 User Guide, Elastic Fabric Adapter</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            <strong>A part is full when demand equals supply.</strong> Count what one unit of work touches, multiply
            by units per second, and compare with what the part delivers. The cleanest case we own is a stand-in for
            a policy: six 1024x1024 <code>float32</code> matrices multiplied by a vector in turn, on one CPU core. It
            stands in for the arm&apos;s real policy, which runs on a GPU. Its weights are 6 x 1024 x 1024 x 4 bytes = 25.2 MB, more than the caches hold, and
            every inference reads all of them. In our measurement, a single run on one Cortex-A78AE core of an{' '}
            {JETSON} (the small robot computer of section 17), it ran 390 inferences per second, so it asked for
            390 x 25.2 MB = 9.8 GB/s. The supply side is a second single run on the same core: a loop that sweeps
            through arrays larger than the caches streamed 11.71 GB/s. The counters agree from the other side:
            62.3% of cycles stalled on memory. That is memory bandwidth, full.{' '}
            <Cite id="F08-66">our profiling report, memory streaming row</Cite>{' '}
            <Cite id="F08-62">our profiling report, policy inference table</Cite>{' '}
            <Cite id="F08-63">our arithmetic on the stand-in&apos;s weights</Cite>
          </Box>
          <Box variant="p">
            The two memory parts differ by machine, which is why they are two parts. In the same set of single runs,
            one Cortex-X925 core of an {SPARK}, a desk-side box whose CPU and GPU share one memory as a
            Jetson&apos;s do, streamed 44.38 GB/s, 3.8 times the Jetson core.{' '}
            <Cite id="F08-66">our profiling report, memory streaming row</Cite> A fetch whose address depends on the previous
            fetch took 291.58 ns on the Jetson core and 123.96 ns on the X925, a gap of 2.4 times.{' '}
            <Cite id="F08-67">our profiling report, latency rows</Cite> Every figure of ours here has the same
            limits: one run, one core, stand-in programs, no EC2 instance.{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Box variant="p">A GPU is several of these parts on one card. Pick a workload and see which it uses.</Box>
          <EnginePicker />
          <Box variant="p">
            A card can lack an engine altogether. The H100, the training GPU of EC2&apos;s P5 family, has no video
            encoder and cannot hardware-decode AV1 (AOMedia Video
            1, the codec LeRobot writes by default).{' '}
            <Cite id="F05-47">NVIDIA video encode and decode support matrix, H100 rows</Cite> The GPU of the G7
            family carries tensor cores, RT cores and both kinds of video engine on one card.{' '}
            <Cite id="F08-43">Amazon EC2 G7 instances page</Cite> How a GPU and the memory hierarchy execute a model
            is the subject of the{' '}
            <Link href="../silicon-memory-inference/">Silicon, Memory and Inference dive</Link>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Look up a workload and read off the part that fills first, with the figure an earlier section printed for it">
            Which part each workload fills first
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Figure
            cites="F08-50 F08-76"
            minWidth={1100}
            caption={
              <>
                One row per workload, one column per part. A cell marked &quot;first&quot; and outlined in blue is the
                part that fills first by the evidence cited below; &quot;also&quot;, &quot;then&quot;,
                &quot;or&quot;, &quot;gate&quot; and &quot;mix&quot; mark the parts that matter next. A cell that
                spans both CPU columns means the evidence says CPU cores without separating the two. No row fills
                memory latency first by the evidence we hold. The grid is our reading of the cited entries.
              </>
            }
          >
            <WorkloadMatrix />
          </Figure>
          <Box variant="p">
            Read down the two CPU columns. Recording, decoding and the dataloader are one cause seen from three
            sides: LeRobot&apos;s default video is AV1 written and read by CPU code, and the GPUs most used for
            training either cannot decode it or have no row in NVIDIA&apos;s support matrix.{' '}
            <Cite id="F08-77">the CPU beside the GPU, in three rows</Cite> The first part to fill is often a CPU
            core, on machines bought for their GPU. And EC2 fixes how many cores sit
            beside each GPU: on most eight-GPU sizes, 24 vCPUs (virtual CPUs, the unit EC2 counts processor capacity
            in), which is 12 physical cores because each core presents itself as two.{' '}
            <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>
          </Box>

          <ExpandableSection headerText="Collect and curate: four workloads, mostly CPU cores">
            <ul style={LIST}>
              <li>
                <strong>Record and encode</strong> (section 9). The host compresses two cameras at 30 Hz to AV1
                video. LeRobot&apos;s default encoder is software, and the Jetson Orin Nano has no hardware
                encoder. So the CPU cores beside the robot must keep up with 55.3 MB/s of raw pixels, by our
                arithmetic. <Cite id="F05-35">LeRobot configs/video.py</Cite>{' '}
                <Cite id="F05-57">Jetson Linux guide, software encode in Orin Nano</Cite>{' '}
                <Cite id="F01-86">our arithmetic on the camera settings</Cite>
              </li>
              <li>
                <strong>Decode and filter</strong> (section 10). Decoding is branchy integer code on a CPU, or a job for the decode engines where the card supports
                the codec. On EC2, hardware AV1 decode is possible on G6, G6e, G7 and G7e and not on P5.{' '}
                <Cite id="F05-67">join of the NVIDIA matrix and the EC2 specifications</Cite>
              </li>
              <li>
                <strong>Embed and deduplicate</strong> (section 10). A vision encoder is matrix arithmetic on tensor
                cores, and the input path can fill first. One captioning run in the design notes of Cosmos Curator
                (NVIDIA&apos;s curation toolkit), cancelled before it completed, left 32 H100s
                at about 17% utilisation because fetching the clips was the slow side.{' '}
                <Cite id="F05-76">Cosmos Curator curator-next-robot-action-caption.md</Cite>
              </li>
              <li>
                <strong>Dataloader decode and augment</strong> (sections 10 and 11). Both steps run by default in worker
                processes on the CPU. LeRobot
                names the result: &quot;the GPU ends up waiting for data&quot;.{' '}
                <Cite id="F05-58">LeRobot dataset docs, running transforms on the GPU</Cite>
              </li>
            </ul>
          </ExpandableSection>

          <ExpandableSection headerText="Simulate: three workloads on three different parts">
            <ul style={LIST}>
              <li>
                <strong>CPU physics step</strong> (section 12). One step is 26 stages. <Cite id="F06-9">MuJoCo docs, simulation pipeline</Cite> It is scalar
                arithmetic with data-dependent branches and little memory traffic, so it fills the back end of one core per simulated world. Our measurement, a single run on one core each, with a MuJoCo humanoid standing in
                for the arm: 14,507 steps per second on the Cortex-A78AE of an {JETSON} (MuJoCo 3.17.0), 28,662 on
                the Cortex-A725 and 57,240 on the Cortex-X925 of an {SPARK} (MuJoCo 4.0.1). On the X925, the
                counters charge 36.5% of the core&apos;s capacity to waiting in the back end, with 0.4% of cycles
                stalled on memory: the core waits on arithmetic.{' '}
                <Cite id="F08-61">our profiling report, physics step table</Cite>{' '}
                <Cite id="F08-73">limits of our measurements</Cite>
              </li>
              <li>
                <strong>GPU-parallel physics</strong> (sections 8 and 12). It is the same arithmetic batched over
                worlds, so by our reading it loads
                general GPU compute and leaves the tensor cores idle.{' '}
                <Cite id="F08-42">NVIDIA Tensor Cores page and Nsight Compute profiling guide</Cite> The MuJoCo Warp
                project reports 5.77 million steps per second for a humanoid across 8192 worlds on one RTX 6000 Ada.{' '}
                <Cite id="F06-20">MuJoCo Warp nightly benchmarks, humanoid</Cite>
              </li>
              <li>
                <strong>Simulated cameras</strong> (section 13). GPU memory fills first, because a camera costs megabytes per environment where physics costs
                kilobytes; the rendering path comes next. In Isaac Lab&apos;s benchmark file, one small camera per
                environment took a run of Cartpole (a small benchmark task: balance a pole on a cart) to 57.3 GB of
                GPU memory and cut its throughput by a factor of 6.7, by our arithmetic from NVIDIA&apos;s rows.{' '}
                <Cite id="F06-48">Isaac Lab v3.0.0 benchmark file, Cartpole-Camera rows</Cite>
              </li>
            </ul>
          </ExpandableSection>

          <ExpandableSection headerText="Train and evaluate: tensor cores, with GPU memory as the gate">
            <ul style={LIST}>
              <li>
                <strong>Policy fine-tune</strong> (section 15). Tensor cores do the work and GPU memory decides which model fits. LeRobot&apos;s
                guide gives, as an indicative figure, ACT in 30 to 60 minutes on one RTX 4090 or 3090.{' '}
                <Cite id="F01-90">LeRobot hardware guide, memory by policy group and common scenarios</Cite>
              </li>
              <li>
                <strong>World-model training</strong> (section 7). At the small end the load is light:
                the authors of LeWorldModel, about 15M parameters, state that it trains on &quot;a single GPU in a few
                hours&quot; and name no GPU. <Cite id="F03-31">LeWorldModel paper, abstract</Cite>
              </li>
              <li>
                <strong>Closed-loop evaluation</strong> (section 16). A mix of the physics, camera and inference rows, in many independent
                copies. NVIDIA reports eight independent runs taking 1,255.2 s on one L40 GPU and 157.8 s on eight,
                &quot;a 7.95x speedup&quot;, for physics alone.{' '}
                <Cite id="F06-93">Isaac Lab-Arena docs, performance and scaling</Cite>
              </li>
            </ul>
          </ExpandableSection>

          <ExpandableSection headerText="Deploy: two workloads on the robot&apos;s own computer">
            <ul style={LIST}>
              <li>
                <strong>Engine build</strong> (section 17). The model is exported to ONNX (Open Neural Network
                Exchange, a portable file format for networks), and TensorRT (NVIDIA&apos;s inference compiler)
                turns it into an engine tuned for one GPU type. The build occupies the target device&apos;s GPU and
                CPU for about 2 to 5 minutes, in NVIDIA&apos;s README.{' '}
                <Cite id="F07-8">Isaac-GR00T deployment README, build notes</Cite>
              </li>
              <li>
                <strong>On-robot inference</strong> (section 17). The machine&apos;s CPU and GPU share one memory. NVIDIA reports 149.0 ms per
                call for its GR00T N1.7 policy on a Jetson Orin, which is 4.5 control periods at 30 Hz.{' '}
                <Cite id="F07-5">Isaac-GR00T deployment README, benchmark table</Cite>
              </li>
            </ul>
          </ExpandableSection>

          <ExpandableSection headerText="Vendor scale: three workloads you consume as checkpoints">
            <ul style={LIST}>
              <li>
                <strong>Generative augmentation</strong> (section 11). Tensor cores with tens of GB of GPU
                memory. NVIDIA lists 207.78 s for one
                720p clip from Cosmos3-Nano on an H100 80GB.{' '}
                <Cite id="F05-98">NVIDIA Cosmos inference benchmarks and methodology</Cite>
              </li>
              <li>
                <strong>Robot foundation-model pretraining</strong> (sections 5 and 15). Every node exchanges gradients (the corrections a training step computes) at
                every step, so tensor cores, the fabric between nodes and the storage feeding them matter at once.
                NVIDIA&apos;s paper puts GR00T N1 at roughly 50,000 H100 GPU-hours on up to 1,024 GPUs.{' '}
                <Cite id="F02-34">GR00T N1 paper, sections 2 and 3</Cite>
              </li>
              <li>
                <strong>World-model pretraining</strong> (sections 6, 7 and 15). The same parts at larger scale:
                NVIDIA names 1,024 GPUs of its GB200 rack-scale systems for Cosmos3-Nano and no duration. <Cite id="F03-97">Cosmos 3 paper, section 4.1</Cite>
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Describe any job by three properties, because they are what a scheduler and a way of buying capacity act on">
            Five shapes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The part chooses the machine. The shape chooses how the machine is bought and scheduled on AWS, a
            second axis kept separate from the first. A shape is three properties of a job:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Duration.</strong> How long one unit of work runs: a clip, an episode, a training run.
            </li>
            <li>
              <strong>Coupling.</strong> Whether the job&apos;s pieces exchange data while they run, so that one
              needs its neighbours at the same moment.
            </li>
            <li>
              <strong>Interruptibility.</strong> Whether the job can lose its machine and resume, losing no more than
              one unit.
            </li>
          </ul>
          <Box variant="p">
            Sorting the fifteen by those three gives five shapes, which are our reading too.{' '}
            <Cite id="F08-78">the five shapes, defined by three properties</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 760 }}>
              <thead>
                <tr>
                  <th style={TH}>Shape</th>
                  <th style={TH}>Duration</th>
                  <th style={TH}>Coupling</th>
                  <th style={TH}>Interruptibility</th>
                  <th style={TH}>Workloads from the map</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>
                    <strong>A.</strong> Fan-out
                  </td>
                  <td style={TD}>Short units</td>
                  <td style={TD}>None: every unit is independent</td>
                  <td style={TD}>Yes, at the cost of one unit</td>
                  <td style={TD}>
                    Decode and filter, embed and deduplicate, CPU physics, GPU-parallel physics stepped for evaluation
                    or data generation, simulated cameras, evaluation, engine build, generative augmentation
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <strong>B.</strong> One node for hours
                  </td>
                  <td style={TD}>Hours</td>
                  <td style={TD}>None beyond the one machine</td>
                  <td style={TD}>Yes, back to the last checkpoint</td>
                  <td style={TD}>Policy fine-tune, world-model training, GPU-parallel physics inside a reinforcement-learning run</td>
                </tr>
                <tr>
                  <td style={TD}>
                    <strong>C.</strong> Many nodes as one
                  </td>
                  <td style={TD}>Days</td>
                  <td style={TD}>Tight: nodes exchange gradients at every step</td>
                  <td style={TD}>Not without losing the whole step, on every node</td>
                  <td style={TD}>The two pretraining workloads</td>
                </tr>
                <tr>
                  <td style={TD}>
                    <strong>D.</strong> Always on
                  </td>
                  <td style={TD}>Continuous and steady</td>
                  <td style={TD}>None between items</td>
                  <td style={TD}>Yes, per item</td>
                  <td style={TD}>
                    Dataloader decode run as a standing preprocessing tier; continuous decode of incoming video
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <strong>E.</strong> On the robot&apos;s clock
                  </td>
                  <td style={TD}>As long as the robot runs, with a deadline per unit</td>
                  <td style={TD}>Only to the robot&apos;s clock</td>
                  <td style={TD}>No</td>
                  <td style={TD}>Record and encode, on-robot inference</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Each property points back at a part. Coupling is the training fabric: a shape C job needs EFA, and the
            small sizes that lack it suit shape A at no penalty. Interruptibility is storage: what a job loses on a
            stop is what it has not yet written, so shape B is defined by its checkpoint interval. Duration against
            the robot&apos;s clock is latency: shape E has a deadline per unit, 33.3 ms at 30 Hz, where every other
            shape has only a throughput. <Cite id="F08-79">how each property maps to a part</Cite>
          </Box>
          <Box variant="p">
            Scale can change a job&apos;s shape while its part stays put. Decoding one arm&apos;s 50 episodes is a
            few minutes on a laptop, shape A. The same code at a company that ingests video all day is a standing CPU
            tier, shape D.{' '}
            <Cite id="F08-80">one workload, two shapes</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="See how far apart EC2 instance types sit on each part, and why one popular GPU number cannot tell you which part is full">
            The spans across instance types
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An EC2 instance type fixes several parts at once. The table gives the two ends of four of them across
            the accelerated families; the families in between are section 23&apos;s subject.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={TH}>Part</th>
                  <th style={TH}>Low end</th>
                  <th style={TH}>High end</th>
                  <th style={TH}>What it decides</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>
                    <Part tone="memory">GPU memory</Part> per GPU
                  </td>
                  <td style={TD}>2.79 GiB: one eighth of an L4, on g6f.large</td>
                  <td style={TD}>268 GiB: one B300 training GPU, on p6-b300.48xlarge</td>
                  <td style={TD}>
                    Whether the job fits at all, whatever the speed of the card. The span is a factor of almost 100.{' '}
                    <Cite id="F08-45">EC2 accelerated computing specifications, accelerator memory</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="outside">Network</Part>
                  </td>
                  <td style={TD}>2.5 Gbps baseline and no EFA, on g6.xlarge</td>
                  <td style={TD}>6,400 Gbps with EFA, on p6-b300.48xlarge</td>
                  <td style={TD}>
                    Whether many nodes can train as one. 6,400 / 2.5 = 2,560, a factor of more than 1,000.{' '}
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
                    How fast data reaches the job from EBS (Elastic Block Store, the network disk of an instance).
                    One arm&apos;s 55.3 MB/s of raw pixels is under half of the low end.{' '}
                    <Cite id="F08-46">EC2 accelerated computing specifications, EBS and instance store</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <Part tone="cpu">CPU</Part> beside each GPU
                  </td>
                  <td style={TD}>4 vCPUs beside one GPU, on g6.xlarge and g6e.xlarge</td>
                  <td style={TD}>64 vCPUs beside one GPU, on g6.16xlarge and g6e.16xlarge</td>
                  <td style={TD}>
                    How much decode, augmentation and physics one GPU can be fed. Most eight-GPU sizes give 24
                    vCPUs per GPU, which is 12 physical cores; g7.48xlarge, at 1 thread per core, gives 24.{' '}
                    <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            <strong>What &quot;GPU utilisation&quot; says.</strong> The figure <code>nvidia-smi</code> prints is the
            percentage of time during which one or more kernels (GPU programs) was executing. It says nothing about
            how much of the card that kernel used: one small kernel running back to back reads 100%.{' '}
            <Cite id="F08-30">nvidia-smi documentation, utilization fields</Cite> DCGM&apos;s finer field, SM activity, comes with NVIDIA&apos;s own warning that 0.8 or more is
            &quot;necessary, but not sufficient&quot; for effective use.{' '}
            <Cite id="F08-32">DCGM user guide, profiling metrics</Cite> So ask the question per part: tensor
            activity, memory activity, encoder and decoder utilisation, and the CPU counters beside them.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Take a workload from this map to a running job on AWS, and know which section answers each step">
            From a workload to AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol style={LIST}>
            <li>
              <strong>Find the row, read the part, then check it.</strong> Section 21, Reading a Machine: PMU
              Cards, confirms it with the counters of the PMU (performance monitoring unit, the event counters
              built into a processor) and of the GPU. Sections 22 and 23 then measure and compare machines on
              that part.
            </li>
            <li>
              <strong>Read the shape, then place it.</strong> Section 24, Orchestrating Physical AI on AWS, places
              the fifteen workloads: an orchestrator (the service that queues jobs and starts machines for them)
              and a way of buying capacity for each shape.
            </li>
            <li>
              <strong>Configure the orchestrator.</strong> Each has its own: section 25, AWS Batch; section 26,
              AWS Parallel Computing Service; section 27, Amazon SageMaker HyperPod; section 28, Amazon EKS.
              Section 29, Choosing, joins part and shape in one table.
            </li>
          </ol>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
