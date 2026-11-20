import type { CSSProperties, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import { Cite } from '../components/Cite';
import { Figure } from '../components/Figure';
import { ARM, TASK_STORY } from '../lib/task';

/* The thread task, stated once for this section. */
const TASK = `one ${ARM} arm that must ${TASK_STORY}`;

/* The date every list in this section was read. */
const READ_ON = '2026-11-20';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const MUTED = '#5f6b7a';
const EMPHASIS = '#0972d3';

type Tone = 'cpu' | 'tensor' | 'rt' | 'robot' | 'neutral';

const TONES: Record<Tone, { fill: string; ink: string }> = {
  cpu: { fill: '#e8f1fb', ink: '#1f5fa8' },
  tensor: { fill: '#e6f6ea', ink: '#1e7b3a' },
  rt: { fill: '#fdeedd', ink: '#a85a0a' },
  robot: { fill: '#fff6d6', ink: '#7a5c00' },
  neutral: { fill: '#ffffff', ink: '#5f6b7a' },
};

const NARROW: CSSProperties = { maxWidth: 520, margin: '0 auto' };
const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };

/* ------------------------------------------------------------------------ */
/* Diagram 29.1: the decision path                                           */
/* ------------------------------------------------------------------------ */

interface Answer {
  /** The answer to the question, one or two short lines. */
  a: string[];
  /** Where that answer leads, one or two lines. */
  r: string[];
  tone?: Tone;
}

interface Question {
  q: string;
  answers: Answer[];
}

interface Band {
  title: string;
  sub: string;
  questions: Question[];
}

const PATH: Band[] = [
  {
    title: 'Machine family',
    sub: 'decided by the part and the deadline',
    questions: [
      {
        q: '1. Which part fills first?',
        answers: [
          { a: ['CPU cores'], r: ['Graviton CPU instances, or the', "robot's own computer"], tone: 'cpu' },
          { a: ['Ray-tracing cores'], r: ['G family only: P-family GPUs', 'have no RT cores'], tone: 'rt' },
          { a: ['Tensor cores,', 'one GPU'], r: ['A one-GPU G size, picked by', 'its GPU memory'], tone: 'tensor' },
          { a: ['Tensor cores,', 'many GPUs'], r: ['P family: eight GPUs per node,', 'EFA between nodes'], tone: 'tensor' },
        ],
      },
      {
        q: '2. Is there a deadline per unit?',
        answers: [
          { a: ["Yes: the robot's", 'clock'], r: ['It runs on the robot. The cloud', 'delivers it and stops here'], tone: 'robot' },
          { a: ['No'], r: ['Go on: pick an orchestrator'] },
        ],
      },
    ],
  },
  {
    title: 'Orchestrator',
    sub: 'decided by coupling, by how often it runs, and by the team',
    questions: [
      {
        q: '3. Do its pieces exchange data?',
        answers: [
          { a: ['No: independent', 'units'], r: ['An array job: one child per', 'episode, clip or seed'] },
          { a: ['Yes: nodes share', 'gradients'], r: ['All nodes start together, on', 'EFA, in one Zone'] },
        ],
      },
      {
        q: '4. How often, and does the team run Slurm?',
        answers: [
          { a: ['Now and then'], r: ['A job service: Training Jobs or', 'Batch, nothing left running'] },
          { a: ['Now and then,', 'in Slurm'], r: ['AWS PCS: managed Slurm, its', 'node groups scale to zero'] },
          { a: ['All day, for', 'several teams'], r: ['A held cluster with quotas:', 'HyperPod or EKS'] },
        ],
      },
    ],
  },
  {
    title: 'Capacity market',
    sub: 'decided by what a stop costs and by fixed dates',
    questions: [
      {
        q: '5. What is lost if the machine goes?',
        answers: [
          { a: ['One unit, under', '30 minutes'], r: ['Spot, with a retry'] },
          { a: ['Hours of one run'], r: ['On-Demand with a list of types;', 'Spot only with checkpoints'] },
          { a: ['A step on every', 'node'], r: ['No Spot: reserve, or On-Demand'] },
        ],
      },
      {
        q: '6. Must it run on fixed dates?',
        answers: [
          { a: ['Yes, on a P type'], r: ['A Capacity Block or a SageMaker', 'training plan'] },
          { a: ['Yes, on a G type'], r: ['No G type on the lists read', `${READ_ON}: On-Demand or Spot`] },
          { a: ['No'], r: ['Keep the answer to question 5'] },
        ],
      },
    ],
  },
];

const D = { w: 400, pad: 10, top: 46, bandHead: 44, q: 30, a: 40, gap: 6, bandGap: 30 };

function bandHeight(band: Band) {
  return (
    D.bandHead +
    band.questions.reduce((h, question) => h + D.q + D.gap + question.answers.length * D.a + D.gap, 0) +
    4
  );
}

function lines(text: string[], x: number, yMid: number, props: { fill: string; weight?: number; anchor?: 'start' | 'middle' }) {
  const first = text.length === 1 ? yMid + 4 : yMid - 3;
  return text.map((line, i) => (
    <text
      key={line}
      x={x}
      y={first + i * 14}
      fontSize="12"
      fontFamily="sans-serif"
      fontWeight={props.weight ?? 400}
      fill={props.fill}
      textAnchor={props.anchor ?? 'start'}
    >
      {line}
    </text>
  ));
}

function DecisionPath() {
  const total = D.top + PATH.reduce((h, band) => h + bandHeight(band) + D.bandGap, 0) - D.bandGap + D.pad;
  const nodes: ReactNode[] = [];
  let y = D.top;
  PATH.forEach((band, bi) => {
    const h = bandHeight(band);
    nodes.push(
      <g key={band.title}>
        <rect x={D.pad} y={y} width={D.w - 2 * D.pad} height={h} rx="8" fill="#ffffff" stroke={MUTED} strokeWidth="1" />
        <text x={D.pad + 12} y={y + 20} fontSize="14" fontFamily="sans-serif" fontWeight="700" fill={INK}>
          {band.title}
        </text>
        <text x={D.pad + 12} y={y + 36} fontSize="12" fontFamily="sans-serif" fill={MUTED}>
          {band.sub}
        </text>
      </g>,
    );
    let qy = y + D.bandHead;
    band.questions.forEach((question) => {
      nodes.push(
        <g key={question.q}>
          <rect x={D.pad + 8} y={qy} width={D.w - 2 * D.pad - 16} height={D.q} rx="5" fill="#f2f8fd" stroke={EMPHASIS} strokeWidth="1.5" />
          <text x={D.pad + 18} y={qy + 20} fontSize="13" fontFamily="sans-serif" fontWeight="700" fill={INK}>
            {question.q}
          </text>
        </g>,
      );
      let ay = qy + D.q + D.gap;
      question.answers.forEach((answer) => {
        const tone = TONES[answer.tone ?? 'neutral'];
        const mid = ay + (D.a - 6) / 2;
        nodes.push(
          <g key={`${question.q}-${answer.a.join(' ')}`}>
            <rect x={D.pad + 8} y={ay} width="126" height={D.a - 6} rx="5" fill={tone.fill} stroke={tone.ink} strokeWidth="1" />
            {lines(answer.a, D.pad + 71, mid, { fill: tone.ink, weight: 700, anchor: 'middle' })}
            <line x1={D.pad + 137} y1={mid} x2={D.pad + 149} y2={mid} stroke={MUTED} strokeWidth="1.5" />
            <polygon points={`${D.pad + 149},${mid - 4} ${D.pad + 156},${mid} ${D.pad + 149},${mid + 4}`} fill={MUTED} />
            {lines(answer.r, D.pad + 162, mid, { fill: INK })}
          </g>,
        );
        ay += D.a;
      });
      qy = ay + D.gap;
    });
    y += h;
    if (bi < PATH.length - 1) {
      const cx = D.w / 2;
      nodes.push(
        <g key={`${band.title}-arrow`}>
          <line x1={cx} y1={y + 4} x2={cx} y2={y + D.bandGap - 12} stroke={MUTED} strokeWidth="2" />
          <polygon points={`${cx - 6},${y + D.bandGap - 12} ${cx + 6},${y + D.bandGap - 12} ${cx},${y + D.bandGap - 3}`} fill={MUTED} />
        </g>,
      );
      y += D.bandGap;
    }
  });
  return (
    <div style={NARROW}>
      <svg
        viewBox={`0 0 ${D.w} ${total}`}
        role="img"
        aria-labelledby="choosing-path-title"
        style={{ width: '100%', height: 'auto' }}
      >
        <title id="choosing-path-title">The decision path from a workload to a machine family, an orchestrator and a capacity market</title>
        <desc>
          Six questions in three groups, read from top to bottom. The part that fills first and a deadline per unit
          pick the machine family. Coupling, how often the job runs and whether the team runs Slurm pick one of four
          orchestrators: AWS Batch, AWS PCS, SageMaker HyperPod or Amazon EKS. What a stop costs and
          fixed dates pick the capacity market.
        </desc>
        <rect x="0" y="0" width={D.w} height={total} fill="#fbfbfd" />
        <text x={D.pad} y="20" fontSize="14" fontFamily="sans-serif" fontWeight="700" fill={INK}>
          From one workload to three choices
        </text>
        <text x={D.pad} y="37" fontSize="12" fontFamily="sans-serif" fill={MUTED}>
          Answer the six questions in order, top to bottom
        </text>
        {nodes}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* The closing table                                                         */
/* ------------------------------------------------------------------------ */

type Market = 'window' | 'open' | 'cpu' | 'device' | 'inherit';

const MARKET_LABEL: Record<Market, string> = {
  window: 'Can be reserved for a window',
  open: 'On-Demand, Spot and Savings Plans only',
  cpu: 'On-Demand or Spot, CPU instances',
  device: 'None: it runs on the device',
  inherit: 'Same as the training job',
};

const MARKET_TONE: Record<Market, { fill: string; ink: string }> = {
  window: { fill: '#e6f6ea', ink: '#1e7b3a' },
  open: { fill: '#fdeedd', ink: '#a85a0a' },
  cpu: { fill: '#e8f1fb', ink: '#1f5fa8' },
  device: { fill: '#fff6d6', ink: '#7a5c00' },
  inherit: { fill: '#eef0f2', ink: '#44505c' },
};

function MarketCell({ kind, children }: { kind: Market; children?: ReactNode }) {
  const tone = MARKET_TONE[kind];
  return (
    <>
      <span
        style={{
          display: 'inline-block',
          padding: '1px 8px',
          borderRadius: 4,
          background: tone.fill,
          border: `1px solid ${tone.ink}`,
          color: tone.ink,
          fontWeight: 700,
        }}
      >
        {MARKET_LABEL[kind]}
      </span>
      {children ? <> {children}</> : null}
    </>
  );
}

interface Row {
  name: string;
  part: ReactNode;
  family: ReactNode;
  orchestrator: ReactNode;
  /** The section that takes this row's orchestrator apart. */
  see: string;
  market: ReactNode;
  why: ReactNode;
}

const ROWS: Row[] = [
  {
    name: 'Record and encode',
    part: 'CPU cores beside the robot',
    family: "None in the cloud: the robot's own computer",
    orchestrator: 'None for recording. Uploads land in S3, and a Step Functions task can submit a Batch job for each',
    see: 'Section 25, AWS Batch, for the upload jobs',
    market: <MarketCell kind="device">The upload jobs: On-Demand or Spot Graviton.</MarketCell>,
    why: (
      <>
        A deadline per frame keeps the work at the arm.{' '}
        <Cite id="F09-100">Step Functions developer guide, AWS Batch integration</Cite>{' '}
        <Cite id="F09-97">Spot Instance Advisor data file, C8g and M8g</Cite>
      </>
    ),
  },
  {
    name: 'Decode and filter',
    part: "CPU cores, or the GPU's decode engines",
    family: 'Graviton C8g or M8g',
    orchestrator: 'Batch array job, one child per shard of episodes, retried when its host is reclaimed',
    see: 'Section 25, AWS Batch',
    market: <MarketCell kind="cpu">Spot, in children of 30 minutes or less.</MarketCell>,
    why: (
      <>
        Independent and restartable: an interruption costs one shard.{' '}
        <Cite id="F09-10">AWS Batch user guide, Spot retry strategy</Cite>{' '}
        <Cite id="F09-11">AWS Batch user guide, job length on Spot</Cite>
      </>
    ),
  },
  {
    name: 'Embed and deduplicate',
    part: 'GPU tensor cores',
    family: 'G6e, with a second G type listed',
    orchestrator: "Batch array job. AWS's Cosmos 3 architecture puts its curator on Batch",
    see: 'Section 25, AWS Batch',
    market: <MarketCell kind="open">Spot first.</MarketCell>,
    why: (
      <>
        The same shape as decode, on a GPU. <Cite id="F09-84">AWS and NVIDIA post on Cosmos 3</Cite>
      </>
    ),
  },
  {
    name: 'Dataloader decode and augment',
    part: 'CPU cores beside each GPU',
    family: 'The training instance itself, picked for its cores per GPU',
    orchestrator: 'None of its own: it runs inside the training job',
    see: 'The section of the training job it rides in',
    market: <MarketCell kind="inherit" />,
    why: (
      <>
        Its one decision is the CPU budget: most eight-GPU sizes give 24 vCPUs per GPU, which is 12 physical cores. <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>
      </>
    ),
  },
  {
    name: 'CPU physics step',
    part: 'CPU back end, one world per core',
    family: 'Graviton C8g or M8g',
    orchestrator: 'Batch array job, one child per seed; a Slurm job array on AWS PCS for a team that submits with Slurm',
    see: 'Section 25, AWS Batch, and section 26, AWS Parallel Computing Service',
    market: <MarketCell kind="cpu">Spot.</MarketCell>,
    why: (
      <>
        The part that fills is a CPU core, so pay for cores and no GPU.{' '}
        <Cite id="F08-85">price-performance computed per part</Cite>{' '}
        <Cite id="F10-228">AWS PCS User Guide, submitting jobs</Cite>
      </>
    ),
  },
  {
    name: 'GPU-parallel physics',
    part: 'General GPU compute, with one CPU core feeding it',
    family: 'A one-GPU G size with enough memory. Headless physics needs no RT cores',
    orchestrator: 'SageMaker Training Job for an occasional run; Batch when runs come back to back',
    see: 'Section 25, AWS Batch',
    market: <MarketCell kind="open">On-Demand with a list of types; Spot when the run checkpoints.</MarketCell>,
    why: (
      <>
        Inside a reinforcement-learning run this is one GPU, one job, for hours (shape B in section 20): a stop
        costs the stretch since the last checkpoint.{' '}
        <Cite id="F06-51">Isaac Lab 3.0 installation guide</Cite>{' '}
        <Cite id="F09-73">AWS Physical AI Toolchain sample, training options</Cite>
      </>
    ),
  },
  {
    name: 'Simulated cameras',
    part: 'GPU memory, then RT cores for RTX renderers',
    family: 'G family only: G6e, G7e or G7',
    orchestrator: 'Batch array job, or Kubernetes jobs on EKS. G7 is not supported in EKS Auto Mode as of November 2026',
    see: 'Section 25, AWS Batch, and section 28, Amazon EKS',
    market: (
      <MarketCell kind="open">
        Several G types, a second Region, or an ODCR (On-Demand Capacity Reservation), which holds capacity for a
        named instance type in one Availability Zone.
      </MarketCell>
    ),
    why: (
      <>
        The RT-core requirement removes the P family, and with it the window reservation, which the lists read on
        2026-11-20 offer for no G type.{' '}
        <Cite id="F06-60">AWS post on Isaac Lab and SageMaker, instance compatibility</Cite>{' '}
        <Cite id="F09-49">EKS user guide, Auto Mode GPU limits</Cite>{' '}
        <Cite id="F09-94">EC2 user guide, Capacity Reservation pricing and billing</Cite>
      </>
    ),
  },
  {
    name: 'Policy fine-tune',
    part: 'GPU tensor cores, with GPU memory as the gate',
    family: "One G-family GPU: G6e or G7e sizes in AWS's runs",
    orchestrator: 'SageMaker Training Job, or a Batch job. AWS documents both and ranks neither',
    see: 'Section 25, AWS Batch',
    market: <MarketCell kind="open">On-Demand with a priority list of types.</MarketCell>,
    why: (
      <>
        AWS reports 3.4 to 10.9 hours on one GPU for the runs of its standard recipe on this arm: pay per job.{' '}
        <Cite id="F09-82">AWS post on training VLA models with LeRobot, run times</Cite>{' '}
        <Cite id="F09-114">AWS embodied AI series, fine-tuning on Batch</Cite>
      </>
    ),
  },
  {
    name: 'World-model training',
    part: 'GPU tensor cores, lightly',
    family: 'As policy fine-tune: one G-family GPU',
    orchestrator: 'As policy fine-tune',
    see: 'Section 25, AWS Batch',
    market: <MarketCell kind="open">On-Demand with a list of types.</MarketCell>,
    why: (
      <>
        At the small end the authors of LeWorldModel report a single GPU for a few hours, and name no GPU.{' '}
        <Cite id="F03-31">LeWorldModel paper, abstract</Cite>
      </>
    ),
  },
  {
    name: 'Closed-loop evaluation',
    part: 'A mix: physics, cameras and policy calls',
    family: 'G6e or G7e when cameras are rendered',
    orchestrator:
      'Batch array job, one child per checkpoint and seed',
    see: 'Section 25, AWS Batch',
    market: <MarketCell kind="open">Spot with retry, On-Demand G types behind it.</MarketCell>,
    why: (
      <>
        Every episode is independent: the most interruptible GPU job in the loop. One customer, RLWRLD, evaluates on
        g6e. <Cite id="F09-5">AWS Batch user guide, array jobs</Cite>{' '}
        <Cite id="F09-87">AWS post on RLWRLD</Cite>
      </>
    ),
  },
  {
    name: 'Engine build',
    part: "The device's own GPU and CPU, for minutes",
    family: 'None: the build runs on the target device',
    orchestrator: 'AWS IoT Greengrass can deliver the build to the device as a component',
    see: 'Section 18, The Fleet',
    market: <MarketCell kind="device" />,
    why: (
      <>
        An engine is tied to the GPU type it was built on, so the cloud&apos;s share is a hand-off.{' '}
        <Cite id="F07-8">Isaac-GR00T deployment README, build notes</Cite>{' '}
        <Cite id="F07-84">AWS IoT Greengrass v2 developer guide</Cite>
      </>
    ),
  },
  {
    name: 'On-robot inference',
    part: 'GPU tensor cores, on memory shared with the CPU',
    family: "None: the robot's computer",
    orchestrator: 'AWS IoT Greengrass, the service that sends software components to devices, delivers the policy',
    see: 'Section 18, The Fleet',
    market: <MarketCell kind="device" />,
    why: (
      <>
        A deadline per chunk of actions. By our reading a Jetson on the robot is a Greengrass device.{' '}
        <Cite id="F09-127">EKS Hybrid Nodes overview, read for a Jetson and a DGX Spark</Cite>
      </>
    ),
  },
  {
    name: 'Generative augmentation',
    part: 'GPU memory in tens of GB, and tensor cores',
    family: "g7e.2xlarge or p5.4xlarge for one-GPU inference with the Nano model, in AWS's sizing table",
    orchestrator: 'Batch array job, one child per clip',
    see: 'Section 25, AWS Batch',
    market: (
      <>
        <MarketCell kind="open">On the G size: Spot for per-clip jobs.</MarketCell>{' '}
        <MarketCell kind="window">
          On the P size. Batch&apos;s route to a Capacity Block rests on an AWS post of April 2025 that the current
          user guide does not confirm.
        </MarketCell>
      </>
    ),
    why: (
      <>
        Restartable per clip. AWS names Batch for offline simulation work.{' '}
        <Cite id="F09-84">AWS and NVIDIA post on Cosmos 3</Cite>{' '}
        <Cite id="F09-113">AWS Guidance for Physical AI Simulation Platform</Cite>{' '}
        <Cite id="F09-17">AWS HPC Blog, Capacity Blocks for ML with AWS Batch</Cite>{' '}
        <Cite id="F10-65">AWS Batch User Guide, launch templates</Cite>
      </>
    ),
  },
  {
    name: 'Robot foundation-model pretraining',
    part: 'Tensor cores across many nodes, the fabric between them, and storage',
    family: "P5en or P6-B200: the sizes AWS's Cosmos 3 table gives for multi-node post-training, taken here as our reading for pretraining",
    orchestrator:
      'HyperPod, which replaces faulty nodes; AWS PCS where the team already runs Slurm and wants no machines held between jobs. Either way the nodes train over EFA',
    see: 'Section 27, Amazon SageMaker HyperPod, and section 26, AWS Parallel Computing Service',
    market: <MarketCell kind="window">A Capacity Block or a SageMaker training plan. No Spot.</MarketCell>,
    why: (
      <>
        Long, coupled, and failure-prone by node count: the case AWS gives for a persistent cluster. The EC2 guide
        rules Spot out for tightly coupled work. <Cite id="F09-112">AWS post on a Cosmos 3 pipeline on HyperPod</Cite>{' '}
        <Cite id="F09-84">AWS and NVIDIA post on Cosmos 3</Cite>{' '}
        <Cite id="F09-95">EC2 user guide, Spot best practices</Cite>{' '}
        <Cite id="F10-234">AWS PCS User Guide, Capacity Blocks</Cite>{' '}
        <Cite id="F10-233">AWS PCS User Guide, EFA and placement groups</Cite>
      </>
    ),
  },
  {
    name: 'World-model pretraining',
    part: 'The same parts, at larger scale',
    family: 'As the row above, with P6e UltraServers (rack-scale systems) at the top',
    orchestrator: 'As the row above. PCS attaches an UltraServer as a Capacity Block node group',
    see: 'Section 27, Amazon SageMaker HyperPod, and section 26, AWS Parallel Computing Service',
    market: (
      <MarketCell kind="window">
        UltraServer blocks for P6e-GB200. P6e-GB300 is obtained through an AWS sales representative.
      </MarketCell>
    ),
    why: (
      <>
        Vendor scale: you consume its checkpoint.{' '}
        <Cite id="F09-91">EC2 user guide, Capacity Blocks supported instance types</Cite>{' '}
        <Cite id="F09-99">AWS announcement of P6e-GB300 UltraServers</Cite>{' '}
        <Cite id="F10-237">AWS PCS User Guide, UltraServers</Cite>
      </>
    ),
  },
];

function ClosingTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <Table
        variant="embedded"
        wrapLines
        stickyColumns={{ first: 1 }}
        trackBy="name"
        ariaLabels={{ tableLabel: 'Fifteen workloads: machine part, instance family, orchestrator, capacity market and why' }}
        items={ROWS}
        columnDefinitions={[
          {
            id: 'name',
            header: 'Workload',
            isRowHeader: true,
            minWidth: 120,
            width: 130,
            cell: (row) => <strong>{row.name}</strong>,
          },
          { id: 'part', header: 'Machine part it leans on', minWidth: 140, width: 150, cell: (row) => row.part },
          { id: 'family', header: 'Instance family (our reading)', minWidth: 150, width: 170, cell: (row) => row.family },
          {
            id: 'orchestrator',
            header: 'Orchestrator (our reading), and the section that takes it apart',
            minWidth: 190,
            width: 210,
            cell: (row) => (
              <>
                {row.orchestrator}
                <div style={{ color: MUTED, marginTop: 4 }}>{row.see}</div>
              </>
            ),
          },
          { id: 'market', header: 'Capacity market (our reading)', minWidth: 180, width: 200, cell: (row) => row.market },
          { id: 'why', header: 'Why, and the evidence', minWidth: 300, cell: (row) => row.why },
        ]}
      />
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function Choosing() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={`Walk from your workload to a machine, a scheduler and a capacity market, with the source behind each step (AWS documentation, posts and data files read ${READ_ON}; the choices are our reading)`}
          >
            29. Choosing
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            You have a workload in hand and a machine to pick. Section 20, Fifteen Workloads, Five Shapes, named the
            part of the machine each workload fills first and the properties that give a job its shape. Section 24,
            Orchestrating Physical AI on AWS, introduced the four orchestrators and the ways an instance is bought, and
            sections 25 to 28 took the orchestrators apart one at a time. This section joins them into one path and
            one table.
          </Box>
          <Box variant="p">Ask the questions in this order, because each answer narrows the next.</Box>
          <ol style={LIST}>
            <li>
              <strong>Which part of the machine fills first?</strong> It picks the instance family.
            </li>
            <li>
              <strong>Is there a deadline per unit of work?</strong> If there is, the job belongs on the robot and
              the cloud only delivers it.
            </li>
            <li>
              <strong>Do its pieces exchange data while they run, and how often does it run?</strong> These pick the
              orchestrator: the service that queues jobs and starts machines for them.
            </li>
            <li>
              <strong>What is lost if the machine is taken away, and must it run on fixed dates?</strong> These pick
              the capacity market: the way an instance is paid for and what AWS promises in return.
            </li>
          </ol>
          <Box variant="p">
            For {TASK}, the answers are small. AWS&apos;s post of 19 November 2026 trains three policies on an {ARM}{' '}
            dataset and prints run times for two of them, GR00T N1.7 and pi0.5: 3.4 to 10.9 hours on one GPU for the
            runs that use its standard recipe.{' '}
            <Cite id="F09-81">AWS post on training VLA models with LeRobot</Cite>{' '}
            <Cite id="F09-82">the same post, run times</Cite> One GPU for 3 to 11 hours needs a service that runs a
            job and goes away, and no cluster.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Follow six questions from a job's part and shape to a family, an orchestrator and a market, and know which steps AWS has published and which are ours"
          >
            The decision path
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            No AWS page comparing AWS Batch, SageMaker HyperPod and Amazon EKS side by side for these workloads was
            located during this research, so the path, which adds AWS Parallel Computing Service (PCS) as the fourth,
            is our reading of the partial rules AWS does publish.{' '}
            <Cite id="F09-110">AWS decision guide, Choosing a generative AI service</Cite> It uses three sets of
            names from section 24.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Machines.</strong> Graviton instances carry AWS&apos;s Arm CPUs and no GPU. The G family
              carries GPUs with RT cores (ray-tracing cores, the hardware an RTX renderer requires). The P family
              carries the data-centre training GPUs, which have none, on nodes that train together over EFA (Elastic
              Fabric Adapter, the network device that lets many nodes train as one).{' '}
              <Cite id="F06-60">AWS post on Isaac Lab and SageMaker, instance compatibility</Cite>
            </li>
            <li>
              <strong>Orchestrators.</strong> SageMaker Training Jobs runs one training container and keeps nothing
              running afterwards. AWS Batch is a job queue that holds no instances when it is empty; its array job is
              one submission that fans out into as many as 10,000 children. AWS PCS is Slurm, the job scheduler of
              classic supercomputing, with the controller run by AWS: its compute node groups start instances for
              waiting jobs and can scale back to zero. SageMaker HyperPod is a persistent cluster whose faulty
              hardware AWS replaces, scheduled with Slurm or Kubernetes. Amazon EKS (Elastic Kubernetes Service) is
              Kubernetes with the control plane run by AWS.{' '}
              <Cite id="F10-200">AWS PCS User Guide, what PCS is</Cite>{' '}
              <Cite id="F10-208">AWS PCS User Guide, scaling configuration</Cite>{' '}
              <Cite id="F09-13">AWS Batch user guide, scaling to zero</Cite>{' '}
              <Cite id="F09-5">AWS Batch user guide, array jobs</Cite>{' '}
              <Cite id="F09-22">SageMaker HyperPod documentation, orchestrators</Cite>
            </li>
            <li>
              <strong>Markets.</strong> On-Demand is paid as used. Spot is spare capacity that AWS can take back. The
              warning is two minutes on a best-effort basis, and it can be missing altogether. A Capacity Block for ML is a prepaid reservation of GPU instances with a
              fixed start and end; a SageMaker training plan is the same for SageMaker.{' '}
              <Cite id="F09-95">EC2 user guide, Spot best practices</Cite>{' '}
              <Cite id="F10-522">EC2 user guide, Prepare for Spot Instance interruptions</Cite>{' '}
              <Cite id="F09-90">EC2 user guide, Capacity Blocks for ML</Cite>
            </li>
          </ul>
          <Figure
            cites="F09-11 F09-91 F09-35 F09-81 F06-60 F08-78 F10-200 F10-208"
            caption={
              <>
                Read from the top. Each blue box is a question, each box under it an answer, and the arrow points at
                what that answer selects. The path is our reading.
              </>
            }
          >
            <DecisionPath />
          </Figure>
          <Box variant="p">
            Question 4 rests on two sentences AWS has published. The post on this dive&apos;s own arm: Training Jobs
            for a fully managed service, HyperPod for a team that already runs Kubernetes or Slurm and wants a
            persistent cluster.{' '}
            <Cite id="F09-81">AWS post on training VLA models with LeRobot</Cite> The second says when the persistent
            cluster pays: &quot;many concurrent jobs, continuous synthetic generation, reserved capacity, and the
            tens-of-nodes tail where failures are statistically frequent&quot;.{' '}
            <Cite id="F09-112">AWS post on a Cosmos 3 pipeline on HyperPod</Cite>
          </Box>
          <Box variant="p">
            The Slurm answer is our reading. A team that already submits with <code>sbatch</code> keeps its scripts
            on PCS and holds no machines between jobs. PCS also fits the coupled branch of question 3: a PCS job
            starts only after all of its nodes are available, and the launch template of a node group carries EFA
            and a placement group, which is what multi-node training needs.{' '}
            <Cite id="F10-217">AWS PCS User Guide, job-level scaling</Cite>{' '}
            <Cite id="F10-233">AWS PCS User Guide, EFA and placement groups</Cite>
          </Box>
          <Box variant="p">
            The path can also end before any orchestrator. One customer, Telexistence, fine-tuned a 14 billion
            parameter model on a single reserved eight-GPU node, and its post names no job scheduler.{' '}
            <Cite id="F09-88">AWS post on Telexistence</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Nine rules you can apply without the diagram, each with its source and the date it carries">
            Rules of thumb with their evidence
          </Header>
        }
      >
        <ul style={LIST}>
          <li>
            <strong>Spot is for work that loses one unit.</strong> The EC2 guide rules it out for work that is
            &quot;tightly coupled between instance nodes&quot; and advises flexibility across at least 10 instance
            types per workload.{' '}
            <Cite id="F09-95">EC2 user guide, Spot best practices</Cite> Two first-party pages size the unit, and
            they differ. The Batch guide: split or checkpoint into parts of 30 minutes or less.{' '}
            <Cite id="F09-11">AWS Batch user guide, job length on Spot</Cite> The EKS best-practices guide:
            checkpoint a job that runs longer than 1 to 2 hours for a small model.{' '}
            <Cite id="F10-535">EKS Best Practices Guide, checkpointing</Cite>
          </li>
          <li>
            <strong>Finish on Spot retries before leaning on On-Demand.</strong> The EC2 guide discourages failing
            over to On-Demand to handle interruptions, while the Batch guide documents a Spot queue first and a
            resubmission to an On-Demand queue. Where a row below puts On-Demand behind Spot, size the unit so that
            a retry on Spot finishes it.{' '}
            <Cite id="F10-530">EC2 user guide, Spot best practices, introduction</Cite>{' '}
            <Cite id="F10-537">AWS Batch user guide, Spot best practices</Cite>
          </li>
          <li>
            <strong>Spot differs by family and by Region.</strong> By our count from AWS&apos;s Spot Instance Advisor
            file, last modified 20 March 2026, 5 of 8 G6e sizes in US East (N. Virginia) sit in the highest
            interruption bucket, above 20%, while 4 of 6 G7e sizes in US East (Ohio) sit in the lowest, under 5%.{' '}
            <Cite id="F09-96">Spot Instance Advisor data file</Cite>
          </li>
          <li>
            <strong>A Capacity Block fixes the job&apos;s end.</strong> In EKS Auto Mode (EKS with the node layer run
            by AWS), nodes start draining 10 minutes before EC2 begins terminating them, and EC2 terminates 30
            minutes before the block ends. Write the last checkpoint before the drain.{' '}
            <Cite id="F09-50">EKS user guide, Capacity Blocks in Auto Mode</Cite>
          </li>
          <li>
            <strong>List two GPU types in one pool.</strong> RobCo lists ml.g6.12xlarge and ml.g6e.12xlarge in one
            GPU node pool and reports no more multi-hour waits for GPU capacity.{' '}
            <Cite id="F09-86">AWS post on RobCo</Cite>
          </li>
          <li>
            <strong>A Slurm team buys per node group.</strong> On PCS each compute node group takes one purchase
            option (On-Demand, Spot, a Capacity Block or an interruptible reservation), so a cluster mixes markets
            by having several groups. <Cite id="F10-207">AWS PCS API Reference, purchase options</Cite> The PCS
            guide read on {READ_ON} has no page that describes a Spot interruption step by step, so by our reading
            Spot groups on PCS suit array jobs that restart from the beginning.{' '}
            <Cite id="F10-222">AWS PCS User Guide, losing a node</Cite>
          </li>
          <li>
            <strong>The edge as a node, for desk machines.</strong> A lab machine can join an EKS cluster as a hybrid
            node, billed for at most 32 vCPUs (virtual CPUs) since 18 November 2026.{' '}
            <Cite id="F09-116">AWS announcement, EKS Hybrid Nodes pricing change</Cite> NVIDIA&apos;s Jetson Linux is
            not in the validated operating system list.{' '}
            <Cite id="F09-52">EKS user guide, Hybrid Nodes operating systems</Cite>
          </li>
          <li>
            <strong>Rendering capacity has a managed route.</strong> Since 18 November 2026 AWS Deadline Cloud, the
            managed render farm, supports G7 instances in service-managed fleets, On-Demand or Spot.{' '}
            <Cite id="F09-117">AWS announcement, Deadline Cloud supports EC2 G7</Cite>
          </li>
          <li>
            <strong>The top of the range is a conversation.</strong> P6e-GB300 UltraServers are obtained through an
            AWS sales representative. <Cite id="F09-99">AWS announcement of P6e-GB300 UltraServers</Cite> No
            Rubin-based EC2 instance family is named or documented as of 20 November 2026.{' '}
            <Cite id="F08-55">AWS press release of 26 August 2026</Cite>
          </li>
        </ul>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Find your workload's row and read off the family, the orchestrator and the market, with the reason and its source">
            The closing table
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The same fifteen workloads as section 20, in the same order, with the part each one fills first.{' '}
            <Cite id="F08-76">the workload map</Cite> The family, orchestrator and market columns are our reading
            throughout: recommendations built on the sources cited in each row, which carry the facts.
          </Box>
          <ClosingTable />
          <Box variant="p">
            <strong>Can be reserved for a window.</strong> A Capacity Block is booked up to eight weeks ahead and can
            last up to six months. <Cite id="F09-90">EC2 user guide, Capacity Blocks for ML</Cite> The list in the
            EC2 guide, read on {READ_ON}, names P types and types built on Trainium, AWS&apos;s own training chip: the
            P4d, P4de, P5, P5e, P5en, P6-B200 and P6-B300 families, and P6e-GB200 UltraServers in a table of their
            own.{' '}
            <Cite id="F09-91">EC2 user guide, Capacity Blocks supported instance types</Cite> The SageMaker training
            plans list, read the same day, names P4d, P5, P5e, P5en, P6-B200 and P6-B300 types and two Trainium types.{' '}
            <Cite id="F09-34">SageMaker documentation, training plans</Cite>
          </Box>
          <Box variant="p">
            <strong>On-Demand, Spot and Savings Plans only.</strong> The lists read on {READ_ON} name no G-family
            type: neither the Capacity Blocks list nor the training plans list.{' '}
            <Cite id="F09-91">EC2 user guide, Capacity Blocks supported instance types</Cite>{' '}
            <Cite id="F09-35">SageMaker documentation, training plans list</Cite> The launch posts for G7e and G7
            name three ways to buy them: On-Demand, Spot, and Savings Plans (a discount applied to the bill).{' '}
            <Cite id="F09-98">AWS announcements of G7e and G7</Cite> Putting the older G families under the same
            label is our reading. A G fleet can still hold a slot with an ODCR, the reservation from the simulated-cameras row: it
            is charged at the On-Demand rate, used or not. <Cite id="F09-94">EC2 user guide, Capacity Reservation pricing and billing</Cite>{' '}
            <Cite id="F09-40">EKS best practices guide, reservations</Cite>
          </Box>
          <Box variant="p">
            So a training fleet and a simulation fleet are bought differently, even inside one cluster. The training
            rows can book a window; the simulation and rendering rows spread across G types and Regions, or hold an
            ODCR.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Check a row against your own job before you buy, and know what moves it">
            Keeping the choice honest
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Measure your own unit of work first.</strong> Section 23, Price-Performance and Latency, gives
            the method. Pick the unit the next stage consumes (frames decoded, training samples, episodes
            evaluated), run it on the row&apos;s family, and divide units per hour by the price of the whole
            instance. <Cite id="F08-82">the units-per-price method</Cite> No row above rests on an EC2 measurement
            of ours: our cards are single runs of stand-in programs on two edge machines.{' '}
            <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Box variant="p">
            <strong>Re-read the lists, because they change.</strong> The two reservation lists were read on {READ_ON}.
            The G7 limit in EKS Auto Mode is worded &quot;as of November 2026&quot;.{' '}
            <Cite id="F09-49">EKS user guide, Auto Mode GPU limits</Cite> The Spot file was last modified on 20 March
            2026 and has no rows for G7, a family launched after it.{' '}
            <Cite id="F09-96">Spot Instance Advisor data file</Cite>
          </Box>
          <Box variant="p">
            <strong>Know what would change a row.</strong> Three things do.
          </Box>
          <ul style={LIST}>
            <li>
              Scale. Decode that runs all day becomes a standing tier: the same part, bought differently.{' '}
              <Cite id="F08-80">one workload, two shapes</Cite>
            </li>
            <li>
              Cameras. GPU-parallel physics that starts rendering with an RTX renderer moves to the G family only,
              and leaves behind the window reservation, which the lists read on 2026-11-20 offer for no G type.{' '}
              <Cite id="F06-60">AWS post on Isaac Lab and SageMaker, instance compatibility</Cite>
            </li>
            <li>
              Company. Back-to-back runs favour a warm Batch fleet over a Training Job, and many concurrent jobs
              favour a persistent cluster.{' '}
              <Cite id="F09-73">AWS Physical AI Toolchain sample, training options</Cite>{' '}
              <Cite id="F09-112">AWS post on a Cosmos 3 pipeline on HyperPod</Cite>
            </li>
          </ul>
          <Box variant="p">
            Your next step: find the row for the job in front of you and run one unit of work on that row&apos;s
            family. Then open the two reservation lists and the Spot file for your Region, and queue or book the job.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
