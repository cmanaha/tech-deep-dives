import type { CSSProperties, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite } from '../components/Cite';
import { Figure } from '../components/Figure';
import { PlacementMap } from '../components/PlacementMap';
import { ARM, TASK_STORY } from '../lib/task';

/* The thread task, stated once for this section. */
const TASK = `one ${ARM} arm that must ${TASK_STORY}`;

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const MUTED = '#5f6b7a';

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };

/* ------------------------------------------------------------------------ */
/* Diagram 29.1: the six questions behind the placement map                  */
/* ------------------------------------------------------------------------ */

interface Answer {
  /** One possible answer to the question, as a full sentence. */
  a: string;
  /** What that answer means for the choice, as one or two full sentences. */
  r: string;
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
    title: 'Instance family',
    sub: 'You choose it from the bottleneck of the job and from whether the job has a deadline.',
    questions: [
      {
        q: '1. Which resource is the bottleneck?',
        answers: [
          {
            a: 'The bottleneck is CPU cores.',
            r: "Use Graviton CPU instances, or the robot's onboard computer.",
          },
          {
            a: 'The bottleneck is the ray-tracing cores.',
            r: 'Use the G family only, because P-family GPUs have no RT cores.',
          },
          {
            a: 'The bottleneck is the tensor cores of one GPU.',
            r: 'Use a one-GPU G-family size, and choose the size by its GPU memory.',
          },
          {
            a: 'The bottleneck is the tensor cores of many GPUs.',
            r: 'Use the P family, with eight GPUs per node and EFA between the nodes.',
          },
        ],
      },
      {
        q: '2. Does each unit of work have a deadline?',
        answers: [
          {
            a: "Yes, the robot's control loop sets a deadline.",
            r: 'The job runs on the robot. The cloud only delivers the software to it, so you skip the remaining questions.',
          },
          { a: 'No, there is no deadline.', r: 'Go on to the next questions to choose an orchestrator.' },
        ],
      },
    ],
  },
  {
    title: 'Orchestrator',
    sub: 'You choose it from whether the pieces of the job exchange data, how often the job runs, and which scheduler your team already uses.',
    questions: [
      {
        q: "3. Do the job's pieces exchange data?",
        answers: [
          {
            a: 'No, the pieces are independent of each other.',
            r: 'Use an array job, with one child job per episode, clip or seed.',
          },
          {
            a: 'Yes, the nodes exchange gradients.',
            r: 'All the nodes must start together, connected by EFA, in one Availability Zone.',
          },
        ],
      },
      {
        q: '4. How often does it run? Is Slurm used?',
        answers: [
          {
            a: 'The job runs now and then.',
            r: 'Use a job service that leaves nothing running between jobs: SageMaker Training Jobs or AWS Batch.',
          },
          {
            a: 'The job runs now and then, and the team already uses Slurm.',
            r: 'Use AWS PCS, which runs Slurm for you and can scale its node groups to zero between jobs.',
          },
          {
            a: 'Jobs run all day, for several teams.',
            r: 'Use a persistent cluster with quotas, on SageMaker HyperPod or Amazon EKS.',
          },
        ],
      },
    ],
  },
  {
    title: 'Purchase option',
    sub: 'You choose it from how much work is lost when an instance goes away and from whether the job must run on fixed dates.',
    questions: [
      {
        q: '5. What is lost if the instance goes away?',
        answers: [
          { a: 'One unit of work is lost, and a unit takes under 30 minutes.', r: 'Use Spot Instances, with a retry rule.' },
          {
            a: 'Hours of one run are lost.',
            r: 'Use On-Demand with a list of instance types. Use Spot Instances only if the job saves checkpoints often.',
          },
          {
            a: 'A training step is lost on every node.',
            r: 'Spot is not an option. Reserve capacity, or use On-Demand.',
          },
        ],
      },
      {
        q: '6. Must it run on fixed dates?',
        answers: [
          { a: 'Yes, and it runs on a P-family type.', r: 'Book a Capacity Block or a SageMaker training plan.' },
          {
            a: 'Yes, and it runs on a G-family type.',
            r: 'As of November 2026, the reservation lists name no G-family type, so use On-Demand or Spot Instances.',
          },
          { a: 'No, the dates are not fixed.', r: 'Keep the answer to question 5.' },
        ],
      },
    ],
  },
];

const QUESTIONS = PATH.flatMap((band) => band.questions.map((question) => question.q));

/* The six questions as a list, for a reader who wants the path without the map. */
function Checklist() {
  return (
    <SpaceBetween size="s">
      {PATH.map((band) => (
        <div key={band.title}>
          <Box variant="p">
            <strong>{band.title}.</strong> {band.sub}
          </Box>
          <ul style={LIST}>
            {band.questions.map((question) => (
              <li key={question.q}>
                <strong>{question.q}</strong>
                <ul style={LIST}>
                  {question.answers.map((answer) => (
                    <li key={answer.a}>
                      <em>{answer.a}</em> {answer.r}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* The closing table                                                         */
/* ------------------------------------------------------------------------ */

type Market = 'window' | 'open' | 'cpu' | 'device' | 'inherit';

const MARKET_LABEL: Record<Market, string> = {
  window: 'Can be reserved for fixed dates',
  open: 'On-Demand, Spot Instances and Savings Plans only',
  cpu: 'CPU instances, On-Demand or Spot',
  device: 'No cloud purchase: it runs on the device',
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
  /** The section that covers this row's orchestrator. */
  see: string;
  market: ReactNode;
  why: ReactNode;
}

const ROWS: Row[] = [
  {
    name: 'Record and encode',
    part: 'CPU cores of the onboard computer',
    family: 'None in the cloud. It runs on the onboard computer.',
    orchestrator:
      'None for the recording itself. The recordings are uploaded to S3, and a Step Functions task can submit an AWS Batch job for each upload.',
    see: 'See section 25, AWS Batch, for the upload jobs.',
    market: <MarketCell kind="device">The upload jobs run on Graviton instances, On-Demand or Spot.</MarketCell>,
    why: (
      <>
        Each frame has a deadline, so the recording has to run next to the arm. Its workload type is Real-time on
        the robot.{' '}
        <Cite id="F09-100">Step Functions developer guide, AWS Batch integration</Cite>{' '}
        <Cite id="F09-97">Spot Instance Advisor data file, C8g and M8g</Cite>
      </>
    ),
  },
  {
    name: 'Decode and filter',
    part: "CPU cores, or the GPU's decode engines",
    family: 'Graviton C8g or M8g',
    orchestrator:
      'An AWS Batch array job, with one child job per shard of episodes. A child job is retried when AWS reclaims its instance.',
    see: 'See section 25, AWS Batch.',
    market: <MarketCell kind="cpu">Use Spot Instances, with child jobs of 30 minutes or less.</MarketCell>,
    why: (
      <>
        Its workload type is Independent tasks. The shards do not depend on each other and can restart, so an
        interruption loses only one shard.{' '}
        <Cite id="F09-10">AWS Batch user guide, Spot retry strategy</Cite>{' '}
        <Cite id="F09-11">AWS Batch user guide, job length on Spot</Cite>
      </>
    ),
  },
  {
    name: 'Embed and deduplicate',
    part: 'GPU tensor cores',
    family: 'G6e, with a second G-family type in the list of allowed instance types',
    orchestrator: "An AWS Batch array job. AWS's reference architecture for Cosmos 3 runs its data curator on Batch.",
    see: 'See section 25, AWS Batch.',
    market: <MarketCell kind="open">Use Spot Instances first.</MarketCell>,
    why: (
      <>
        Like decode and filter, its workload type is Independent tasks, but it runs on a GPU.{' '}
        <Cite id="F09-84">AWS and NVIDIA post on Cosmos 3</Cite>
      </>
    ),
  },
  {
    name: 'Dataloader decode and augment',
    part: 'The CPU cores that serve each GPU',
    family: 'The training instance itself. Choose one with enough CPU cores per GPU.',
    orchestrator: 'None of its own. It runs inside the training job.',
    see: 'See the section on the training job it runs in.',
    market: <MarketCell kind="inherit" />,
    why: (
      <>
        The only decision is how many CPU cores each GPU gets. Most eight-GPU sizes give 24 vCPUs per GPU, which is
        12 physical cores.{' '}
        <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>
      </>
    ),
  },
  {
    name: 'CPU physics step',
    part: 'The CPU back end, with one simulated world per core',
    family: 'Graviton C8g or M8g',
    orchestrator:
      'An AWS Batch array job, with one child job per seed. A team that submits its work with Slurm can use a Slurm job array on AWS PCS instead.',
    see: 'See section 25, AWS Batch, and section 26, AWS Parallel Computing Service.',
    market: <MarketCell kind="cpu">Use Spot Instances.</MarketCell>,
    why: (
      <>
        The bottleneck is the CPU cores, so you pay for cores and not for a GPU.{' '}
        <Cite id="F08-85">price-performance computed per part</Cite>{' '}
        <Cite id="F10-228">AWS PCS User Guide, submitting jobs</Cite>
      </>
    ),
  },
  {
    name: 'GPU-parallel physics',
    part: 'General GPU compute, fed by one CPU core',
    family: 'A one-GPU G-family size with enough GPU memory. Physics without rendering needs no RT cores.',
    orchestrator:
      'A SageMaker training job for an occasional run, and AWS Batch when the runs follow each other back to back.',
    see: 'See section 25, AWS Batch.',
    market: (
      <MarketCell kind="open">
        Use On-Demand with a list of instance types, or Spot Instances if the run saves checkpoints.
      </MarketCell>
    ),
    why: (
      <>
        Inside a reinforcement-learning run, this is one job on one GPU for hours, so its workload type is Long
        single-machine runs (section 20, The Fifteen Workloads). If the instance stops, you lose the work done since
        the last checkpoint.{' '}
        <Cite id="F06-51">Isaac Lab 3.0 installation guide</Cite>{' '}
        <Cite id="F09-73">AWS Physical AI Toolchain sample, training options</Cite>
      </>
    ),
  },
  {
    name: 'Simulated cameras',
    part: 'GPU memory first, then the RT cores when an RTX renderer is used',
    family: 'Only the G family: G6e, G7e or G7',
    orchestrator:
      'An AWS Batch array job, or Kubernetes jobs on Amazon EKS. As of November 2026, EKS Auto Mode does not support G7.',
    see: 'See section 25, AWS Batch, and section 28, Amazon EKS.',
    market: (
      <MarketCell kind="open">
        Spread the fleet across several G-family types or a second Region, or hold capacity with an ODCR.
      </MarketCell>
    ),
    why: (
      <>
        RTX rendering needs RT cores, so the P family is ruled out.{' '}
        <Cite id="F06-60">AWS post on Isaac Lab and SageMaker, instance compatibility</Cite> Reserving capacity for
        fixed dates is ruled out too, because as of November 2026 the reservation lists name no G-family type.{' '}
        <Cite id="F09-91">EC2 user guide, Capacity Blocks supported instance types</Cite> An ODCR can still hold
        capacity for one G-family type in one Availability Zone, at the On-Demand rate.{' '}
        <Cite id="F09-94">EC2 user guide, Capacity Reservation pricing and billing</Cite>{' '}
        <Cite id="F09-49">EKS user guide, Auto Mode GPU limits</Cite>
      </>
    ),
  },
  {
    name: 'Policy fine-tune',
    part: 'GPU tensor cores. The GPU must also have enough memory for the model.',
    family: "One G-family GPU. AWS's runs used G6e and G7e sizes.",
    orchestrator:
      'A SageMaker training job, or an AWS Batch job. AWS documents both and does not recommend one over the other.',
    see: 'See section 25, AWS Batch.',
    market: <MarketCell kind="open">Use On-Demand, with a priority list of instance types.</MarketCell>,
    why: (
      <>
        AWS reports run times of 3.4 to 10.9 hours on one GPU for its standard recipe on an {ARM} dataset.
        Its workload type is Long single-machine runs, because one run keeps one GPU busy for hours. So you pay per
        job and keep no cluster running.{' '}
        <Cite id="F09-82">AWS post on training VLA models with LeRobot, run times</Cite>{' '}
        <Cite id="F09-114">AWS embodied AI series, fine-tuning on Batch</Cite>
      </>
    ),
  },
  {
    name: 'World-model training',
    part: 'GPU tensor cores, at a light load',
    family: 'The same as policy fine-tune: one G-family GPU.',
    orchestrator: 'The same as policy fine-tune.',
    see: 'See section 25, AWS Batch.',
    market: <MarketCell kind="open">Use On-Demand, with a list of instance types.</MarketCell>,
    why: (
      <>
        For a small world model, the authors of LeWorldModel report training on a single GPU in a few hours. They do
        not name the GPU model. <Cite id="F03-31">LeWorldModel paper, abstract</Cite>
      </>
    ),
  },
  {
    name: 'Closed-loop evaluation',
    part: 'A mix of physics, camera rendering and policy calls',
    family: 'G6e or G7e when the cameras are rendered',
    orchestrator: 'An AWS Batch array job, with one child job per checkpoint and seed.',
    see: 'See section 25, AWS Batch.',
    market: (
      <MarketCell kind="open">Use Spot Instances with retries, and On-Demand G-family instances as the fallback.</MarketCell>
    ),
    why: (
      <>
        Every episode is independent, so its workload type is Independent tasks. Of all the GPU jobs in the loop, it
        handles interruptions best. RLWRLD, an AWS customer, runs its evaluation on g6e instances.{' '}
        <Cite id="F09-5">AWS Batch user guide, array jobs</Cite>{' '}
        <Cite id="F09-87">AWS post on RLWRLD</Cite>
      </>
    ),
  },
  {
    name: 'Engine build',
    part: "The target device's own GPU and CPU, for a few minutes",
    family: 'None. The build runs on the target device.',
    orchestrator:
      'AWS IoT Greengrass is the AWS service that sends software components to devices. It can deliver the build to the device as a component.',
    see: 'See section 18, The Fleet.',
    market: <MarketCell kind="device" />,
    why: (
      <>
        An engine is the compiled form of the model for one GPU, and it works only on the type of GPU it was built
        on. So the build runs on the device, and the cloud only delivers it.{' '}
        <Cite id="F07-8">Isaac-GR00T deployment README, build notes</Cite>{' '}
        <Cite id="F07-84">AWS IoT Greengrass v2 developer guide</Cite>
      </>
    ),
  },
  {
    name: 'On-robot inference',
    part: 'GPU tensor cores, on memory that the GPU shares with the CPU',
    family: 'None. It runs on the onboard computer.',
    orchestrator: 'AWS IoT Greengrass delivers the policy to the device.',
    see: 'See section 18, The Fleet.',
    market: <MarketCell kind="device" />,
    why: (
      <>
        Each chunk of actions has a deadline, so its workload type is Real-time on the robot. We recommend treating a
        Jetson on the robot as a Greengrass device rather than as an EKS hybrid node.{' '}
        <Cite id="F09-127">EKS Hybrid Nodes overview, read for a Jetson and a DGX Spark</Cite>
      </>
    ),
  },
  {
    name: 'Generative augmentation',
    part: 'Tens of GB of GPU memory, and tensor cores',
    family: "AWS's Cosmos 3 sizing table gives g7e.2xlarge or p5.4xlarge for one-GPU inference with the Nano model.",
    orchestrator: 'An AWS Batch array job, with one child job per clip.',
    see: 'See section 25, AWS Batch.',
    market: (
      <>
        <MarketCell kind="open">On the G-family size, use Spot Instances for the per-clip jobs.</MarketCell>{' '}
        <MarketCell kind="window">
          On the P-family size, you can book a Capacity Block. The method for using a Capacity Block from AWS Batch
          comes from an AWS post of April 2025, and the current AWS Batch user guide does not confirm it.
        </MarketCell>
      </>
    ),
    why: (
      <>
        Each clip can restart on its own, so its workload type is Independent tasks. AWS&apos;s guidance for a
        physical AI simulation platform puts offline simulation work on AWS Batch.{' '}
        <Cite id="F09-84">AWS and NVIDIA post on Cosmos 3</Cite>{' '}
        <Cite id="F09-113">AWS Guidance for Physical AI Simulation Platform</Cite>{' '}
        <Cite id="F09-17">AWS HPC Blog, Capacity Blocks for ML with AWS Batch</Cite>{' '}
        <Cite id="F10-65">AWS Batch User Guide, launch templates</Cite>
      </>
    ),
  },
  {
    name: 'Robot foundation-model pretraining',
    part: 'Tensor cores across many nodes, the network between the nodes, and storage',
    family:
      "P5en or P6-B200. AWS's Cosmos 3 sizing table gives P5en for multi-node post-training and also lists P6-B200. We recommend the same sizes for pretraining.",
    orchestrator:
      'SageMaker HyperPod, which replaces faulty nodes. AWS PCS fits a team that already runs Slurm and wants no machines held between jobs. In both cases, the nodes train over EFA.',
    see: 'See section 27, Amazon SageMaker HyperPod, and section 26, AWS Parallel Computing Service.',
    market: (
      <MarketCell kind="window">Book a Capacity Block or a SageMaker training plan. Spot is not an option.</MarketCell>
    ),
    why: (
      <>
        Its workload type is Multi-node training. The run is long, the nodes exchange data while they run, and node
        failures become frequent as the number of nodes grows. An AWS post names this case as a reason to use a
        persistent cluster. The EC2 guide rules out Spot for tightly coupled work.{' '}
        <Cite id="F09-112">AWS post on a Cosmos 3 pipeline on HyperPod</Cite>{' '}
        <Cite id="F09-84">AWS and NVIDIA post on Cosmos 3</Cite>{' '}
        <Cite id="F09-95">EC2 user guide, Spot best practices</Cite>{' '}
        <Cite id="F10-234">AWS PCS User Guide, Capacity Blocks</Cite>{' '}
        <Cite id="F10-233">AWS PCS User Guide, EFA and placement groups</Cite>
      </>
    ),
  },
  {
    name: 'World-model pretraining',
    part: 'The same resources as the row above, at a larger scale',
    family: 'The same as the row above, with P6e UltraServers at the top of the range.',
    orchestrator:
      'The same as the row above. AWS PCS attaches an UltraServer as a node group that runs on a Capacity Block.',
    see: 'See section 27, Amazon SageMaker HyperPod, and section 26, AWS Parallel Computing Service.',
    market: (
      <MarketCell kind="window">
        Book UltraServer Capacity Blocks for P6e-GB200. For P6e-GB300, contact an AWS sales representative.
      </MarketCell>
    ),
    why: (
      <>
        This training runs at a scale that only model vendors reach, so you use the vendor&apos;s trained checkpoint
        instead of training the model yourself.{' '}
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
        ariaLabels={{
          tableLabel:
            'The fifteen workloads with the bottleneck, instance family, orchestrator and purchase option of each, and the reason',
        }}
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
          { id: 'part', header: 'Bottleneck', minWidth: 140, width: 150, cell: (row) => row.part },
          { id: 'family', header: 'Instance family', minWidth: 150, width: 170, cell: (row) => row.family },
          {
            id: 'orchestrator',
            header: 'Orchestrator, and the section that covers it',
            minWidth: 190,
            width: 210,
            cell: (row) => (
              <>
                {row.orchestrator}
                <div style={{ color: MUTED, marginTop: 4 }}>{row.see}</div>
              </>
            ),
          },
          { id: 'market', header: 'Purchase option', minWidth: 180, width: 200, cell: (row) => row.market },
          { id: 'why', header: 'Reason and sources', minWidth: 300, cell: (row) => row.why },
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
            description="To choose the instance family, the scheduler or orchestrator, and the purchase option for a workload, you answer six questions about it. The table at the end gives the answers for each of the fifteen workloads, with the reason and the source for each choice. The choices are our recommendations, built on AWS documentation, blog posts and data files."
          >
            29. Choosing: From a Workload to an Instance, a Scheduler and a Purchase Option
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each of the fifteen workloads needs three decisions: an instance family, an orchestrator and a purchase
            option. Section 20, The Fifteen Workloads, identified the bottleneck and the workload type of each
            workload. Section 24, Orchestrating Physical AI on AWS, introduced the orchestrators and the purchase
            options, and sections 25 to 28 covered the orchestrators one at a time. The map and the table below combine
            those results and give the three decisions for each workload.
          </Box>
          <Box variant="p">
            To get from a workload to those three decisions, answer the four questions below in order. Each answer
            narrows the options for the next question. The map further down splits the third and the fourth question
            in two, so it shows six questions in all. In these questions, a unit of work is one piece of work that can
            run on its own, such as an episode, a clip, a seed or a whole training run.
          </Box>
          <ol style={LIST}>
            <li>
              <strong>Which resource is the bottleneck of the job?</strong> The answer tells you which instance family
              to use.
            </li>
            <li>
              <strong>Does each unit of work have a deadline?</strong> For example, the policy on the arm must produce
              each chunk of actions in time for the arm&apos;s control loop. If a job has a deadline like that, it runs
              on the robot, and the cloud only delivers the software to it.
            </li>
            <li>
              <strong>Do the pieces of the job exchange data while they run, and how often does the job run?</strong>{' '}
              The answers tell you which scheduler or orchestrator to use. An orchestrator is a service that queues
              jobs and starts instances for them.
            </li>
            <li>
              <strong>How much work is lost if the instance fails or goes away, and must the job run on fixed
              dates?</strong>{' '}
              The answers tell you which purchase option fits. A purchase option is the way you pay for an instance,
              together with what AWS promises in return.
            </li>
          </ol>
          <Box variant="p">
            The example used throughout the dive is {TASK}. Training the policy for that arm is a small job. In a post of
            19 November 2026, AWS trains three policies on an {ARM} dataset and gives run times for two of them,
            GR00T N1.7 and pi0.5. With the post&apos;s standard recipe, the runs took between 3.4 and 10.9 hours on
            one GPU.{' '}
            <Cite id="F09-81">AWS post on training VLA models with LeRobot</Cite>{' '}
            <Cite id="F09-82">the same post, run times</Cite> So a job that needs one GPU for 3 to 11 hours fits a
            service that runs the job and then releases the instance. It does not need a cluster.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Use the map to see the answers to the six questions for each of the fifteen workloads. The text around the map says which steps come from AWS guidance and which are our recommendations."
          >
            The six questions, with a map of the fifteen workloads
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AWS publishes rules for parts of this decision. However, we found no AWS page that compares AWS Batch,
            SageMaker HyperPod and Amazon EKS side by side for these workloads.{' '}
            <Cite id="F09-110">AWS decision guide, Choosing a generative AI service</Cite> So the six questions are
            our own recommendation, built on the partial rules that AWS does publish. They also cover AWS Parallel
            Computing Service (PCS), a fourth orchestrator next to those three. The questions use the following names
            from section 24, Orchestrating Physical AI on AWS.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Instance families.</strong> Graviton instances have AWS&apos;s own Arm CPUs and no GPU. G-family
              instances have GPUs with ray-tracing (RT) cores, which are the hardware units that an RTX renderer
              requires. P-family instances have the data-centre GPUs used for training, and these GPUs have no RT
              cores. P-family nodes can train together over EFA (Elastic Fabric Adapter). EFA is the EC2 network
              device that lets many nodes train together as one job.{' '}
              <Cite id="F06-60">AWS post on Isaac Lab and SageMaker, instance compatibility</Cite>
            </li>
            <li>
              <strong>Orchestrators.</strong> SageMaker Training Jobs runs one training container and keeps nothing
              running after it finishes. AWS Batch is a job queue that holds no instances while the queue is empty.
              Its array job is a single submission that fans out into as many as 10,000 child jobs. Slurm is the job
              scheduler of classic supercomputing. AWS PCS is a managed Slurm service: AWS runs the Slurm controller,
              and the compute node groups start instances for waiting jobs and can scale back to zero. SageMaker
              HyperPod is a persistent cluster in which AWS replaces faulty hardware, and you schedule jobs on it with
              Slurm or Kubernetes. Amazon EKS (Elastic Kubernetes Service) is Kubernetes with the control plane run by
              AWS.{' '}
              <Cite id="F10-200">AWS PCS User Guide, what PCS is</Cite>{' '}
              <Cite id="F10-208">AWS PCS User Guide, scaling configuration</Cite>{' '}
              <Cite id="F09-13">AWS Batch user guide, scaling to zero</Cite>{' '}
              <Cite id="F09-5">AWS Batch user guide, array jobs</Cite>{' '}
              <Cite id="F09-22">SageMaker HyperPod documentation, orchestrators</Cite>
            </li>
            <li>
              <strong>Purchase options.</strong> With On-Demand, you pay for an instance while you use it, with no
              commitment. Spot Instances use spare capacity that AWS can reclaim. Before it reclaims a Spot Instance,
              AWS sends a two-minute warning on a best-effort basis, and the warning can be missing altogether. A
              Capacity Block for ML is a prepaid reservation of GPU instances with a fixed start and end date. A
              SageMaker training plan is the same kind of reservation, made through SageMaker. An On-Demand Capacity
              Reservation (ODCR) holds capacity for one named instance type in one Availability Zone, and you pay the
              On-Demand rate for it whether or not an instance runs in it. Savings Plans are a discount on the bill for
              the instances you run, and the discount also applies to an ODCR.{' '}
              <Cite id="F09-134">Savings Plans User Guide, What are Savings Plans?</Cite>{' '}
              <Cite id="F09-95">EC2 user guide, Spot best practices</Cite>{' '}
              <Cite id="F10-522">EC2 user guide, Prepare for Spot Instance interruptions</Cite>{' '}
              <Cite id="F09-90">EC2 user guide, Capacity Blocks for ML</Cite>{' '}
              <Cite id="F09-94">EC2 user guide, Capacity Reservation pricing and billing</Cite>
            </li>
          </ul>
          <Box variant="p">
            The map below places the fifteen workloads from section 20, The Fifteen Workloads, on the six questions,
            with two questions in each panel. The map uses three terms that need a definition. A
            submission is one request to an orchestrator. A Slurm job array is the Slurm version of the AWS Batch array
            job. The reservation lists are the two AWS pages that name the instance types you can book with a Capacity
            Block or with a training plan. Each dot on the map is one workload. Its colour shows the workload&apos;s
            bottleneck, and its symbol shows the workload&apos;s stage in the learning loop.
          </Box>
          <Figure
            cites="F09-5 F09-11 F09-91 F09-35 F09-81 F06-60 F08-78 F10-200 F10-208"
            caption={
              <>
                The same fifteen dots appear in all three panels. To select a workload, hover over its dot, tap it,
                move to it with the Tab key or pick it from the list. The selected dot is ringed in every panel, and
                the sentence under the map gives its three answers. Panel A is a grid of answers to the first two
                questions. In panels B and C, each region is one answer, so the region that holds a dot gives that
                workload&apos;s answer. The position of a dot inside its region has no meaning, because the sources
                give a count or a duration for only a few of these workloads. A hollow dot is placed by its workload
                type alone. The placements are our own recommendations.
              </>
            }
          >
            <PlacementMap workloads={ROWS.map((row) => row.name)} questions={QUESTIONS} initial="Policy fine-tune" />
          </Figure>
          <ExpandableSection headerText="The six questions as a checklist, without the map">
            <Checklist />
          </ExpandableSection>
          <Box variant="p">
            For question 4 on the map, how often the job runs, AWS gives two pieces of guidance. The AWS post that
            trains policies for the {ARM}{' '}
            recommends SageMaker Training Jobs if you want a fully managed service, and SageMaker HyperPod if your team
            already runs Kubernetes or Slurm and wants a persistent cluster.{' '}
            <Cite id="F09-81">AWS post on training VLA models with LeRobot</Cite> A second AWS post lists the cases in
            which a persistent HyperPod cluster is worth its cost: &quot;many concurrent jobs, continuous synthetic
            generation, reserved capacity, and the tens-of-nodes tail where failures are statistically
            frequent&quot;. <Cite id="F09-112">AWS post on a Cosmos 3 pipeline on HyperPod</Cite>
          </Box>
          <Box variant="p">
            The Slurm answer to question 4 on the map is our own recommendation. If your team already submits jobs
            with <code>sbatch</code>, it can keep its scripts on PCS and hold no machines between jobs. PCS also fits
            multi-node training, where the answer to question 3 is that the nodes exchange data. A PCS job starts only
            after all of its nodes are available, and the launch template of a node group sets up EFA and a placement
            group, which multi-node training needs.{' '}
            <Cite id="F10-217">AWS PCS User Guide, job-level scaling</Cite>{' '}
            <Cite id="F10-233">AWS PCS User Guide, EFA and placement groups</Cite>
          </Box>
          <Box variant="p">
            A team can also work without an orchestrator. Telexistence, an AWS customer, fine-tuned a
            14-billion-parameter model on a single reserved eight-GPU node, and the AWS post about that work names no
            job scheduler.{' '}
            <Cite id="F09-88">AWS post on Telexistence</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You can apply these nine rules to any job without working through the map. Each rule cites its source, so you can check it before you buy capacity."
          >
            Rules of thumb for capacity and purchase options
          </Header>
        }
      >
        <ul style={LIST}>
          <li>
            <strong>Use Spot Instances for work that loses at most one unit of work when AWS reclaims an
            instance.</strong>{' '}
            The EC2 guide says Spot is not suitable for work that is &quot;tightly coupled between instance
            nodes&quot;. It also advises that each workload be flexible across at least 10 instance types.{' '}
            <Cite id="F09-95">EC2 user guide, Spot best practices</Cite> Two AWS guides give a size for the unit of
            work, and they differ. The AWS Batch guide advises splitting or checkpointing Spot jobs into parts of 30
            minutes or less. <Cite id="F09-11">AWS Batch user guide, job length on Spot</Cite> The EKS best-practices
            guide advises checkpointing a job on a small model that runs longer than 1 to 2 hours.{' '}
            <Cite id="F10-535">EKS Best Practices Guide, checkpointing</Cite>
          </li>
          <li>
            <strong>Let Spot retries finish the work before you fall back to On-Demand.</strong> The EC2 guide
            discourages failing over to On-Demand to handle interruptions. The AWS Batch guide, on the other hand,
            documents a Spot queue first and a resubmission to an On-Demand queue. Where a row of the table below uses
            On-Demand as the fallback for Spot, size each unit of work so that a retry on Spot can finish it.{' '}
            <Cite id="F10-530">EC2 user guide, Spot best practices, introduction</Cite>{' '}
            <Cite id="F10-537">AWS Batch user guide, Spot best practices</Cite>
          </li>
          <li>
            <strong>Expect Spot interruption rates to differ by instance family and by Region.</strong> The Spot
            Instance Advisor data file from AWS places each instance type in a range of interruption frequency. We
            counted the sizes in each range in the version of the file last modified on 20 March 2026. In US East (N.
            Virginia), 5 of the 8 G6e sizes are in the highest interruption range, above 20%. In US East (Ohio), 4 of
            the 6 G7e sizes are in the lowest range, under 5%.{' '}
            <Cite id="F09-96">Spot Instance Advisor data file</Cite>
          </li>
          <li>
            <strong>Plan for the fixed end time of a Capacity Block.</strong> EC2 starts terminating the instances of
            a Capacity Block 30 minutes before the block ends. EKS Auto Mode is a mode of EKS in which AWS also runs
            the nodes. On a Capacity Block, EKS Auto Mode starts draining the nodes 10 minutes before EC2 starts
            terminating them. To keep your work, write the last checkpoint before the draining starts.{' '}
            <Cite id="F09-50">EKS user guide, Capacity Blocks in Auto Mode</Cite>
          </li>
          <li>
            <strong>List two GPU instance types in one node pool.</strong> RobCo, an AWS customer, lists
            ml.g6.12xlarge and ml.g6e.12xlarge in one GPU node pool. The AWS post about RobCo reports that its jobs
            no longer wait hours for GPU capacity. <Cite id="F09-86">AWS post on RobCo</Cite>
          </li>
          <li>
            <strong>On AWS PCS, choose the purchase option per compute node group.</strong> Each group has exactly one
            purchase option: On-Demand, Spot, a Capacity Block or an interruptible capacity reservation. To mix
            purchase options in one cluster, you create several node groups.{' '}
            <Cite id="F10-207">AWS PCS API Reference, purchase options</Cite> As of November 2026, the PCS User Guide
            has no page that describes, step by step, what happens to a job when AWS reclaims its Spot Instance. So we
            recommend Spot node groups on PCS only for array jobs whose pieces can restart from the beginning.{' '}
            <Cite id="F10-222">AWS PCS User Guide, losing a node</Cite>
          </li>
          <li>
            <strong>A lab machine can join an EKS cluster as a hybrid node.</strong> A hybrid node is a machine outside
            AWS that joins an EKS cluster as one of its nodes. Since 18 November 2026, AWS bills a hybrid node for at
            most 32 vCPUs (virtual CPUs). <Cite id="F09-116">AWS announcement, EKS Hybrid Nodes pricing change</Cite>{' '}
            NVIDIA&apos;s Jetson Linux is not on the list of validated operating systems for hybrid nodes, so this
            route suits desk machines rather than Jetson devices.{' '}
            <Cite id="F09-52">EKS user guide, Hybrid Nodes operating systems</Cite>
          </li>
          <li>
            <strong>For rendering, AWS Deadline Cloud offers managed G7 capacity.</strong> AWS Deadline Cloud is the
            AWS managed render farm. Since 18 November 2026, its service-managed fleets support G7 instances, as
            On-Demand or as Spot Instances.{' '}
            <Cite id="F09-117">AWS announcement, Deadline Cloud supports EC2 G7</Cite>
          </li>
          <li>
            <strong>Contact AWS sales for the largest systems.</strong> UltraServers are rack-scale EC2 systems at the
            top of the P range. To get P6e-GB300 UltraServers, you contact an AWS sales representative.{' '}
            <Cite id="F09-99">AWS announcement of P6e-GB300 UltraServers</Cite> As of 20 November 2026, we found no
            EC2 instance family based on NVIDIA&apos;s Rubin GPUs on AWS&apos;s own pages.{' '}
            <Cite id="F08-55">AWS press release of 26 August 2026</Cite>
          </li>
        </ul>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find the row for your workload to read its instance family, its orchestrator and its purchase option, with the reason for each choice and its source."
          >
            The decision for each of the fifteen workloads
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The table lists the fifteen workloads from section 20, The Fifteen Workloads, in the same order, with the
            bottleneck of each one. <Cite id="F08-76">the workload map</Cite> The instance family, orchestrator and
            purchase option columns are our recommendations. Each row cites the sources that its facts come from.
          </Box>
          <ClosingTable />
          <Box variant="p">
            <strong>Can be reserved for fixed dates.</strong> You can book a Capacity Block up to eight weeks ahead,
            and it can last up to six months. <Cite id="F09-90">EC2 user guide, Capacity Blocks for ML</Cite>{' '}
            Trainium is AWS&apos;s own training chip. As of November 2026, the EC2 guide lists only P-family and
            Trainium types for Capacity Blocks: the P4d, P4de, P5, P5e, P5en, P6-B200 and P6-B300 families, plus
            P6e-GB200 UltraServers in a separate table.{' '}
            <Cite id="F09-91">EC2 user guide, Capacity Blocks supported instance types</Cite> In the same month, the
            SageMaker training plans list names P4d, P5, P5e, P5en, P6-B200 and P6-B300 types and two Trainium
            types.{' '}
            <Cite id="F09-34">SageMaker documentation, training plans</Cite>
          </Box>
          <Box variant="p">
            <strong>On-Demand, Spot Instances and Savings Plans only.</strong> As of November 2026, neither the Capacity
            Blocks list nor the training plans list names any G-family type.{' '}
            <Cite id="F09-91">EC2 user guide, Capacity Blocks supported instance types</Cite>{' '}
            <Cite id="F09-35">SageMaker documentation, training plans list</Cite> The launch announcements for G7e and
            G7 name three ways to buy them: On-Demand, Spot Instances and Savings Plans.{' '}
            <Cite id="F09-98">AWS announcements of G7e and G7</Cite> We assume the same three options for the older
            G-family types, such as G6e. A G-family fleet can still hold capacity with an ODCR, which you pay for at
            the On-Demand rate whether or not an instance runs in it.{' '}
            <Cite id="F09-94">EC2 user guide, Capacity Reservation pricing and billing</Cite>{' '}
            <Cite id="F09-40">EKS best practices guide, reservations</Cite>
          </Box>
          <Box variant="p">
            As a result, you buy capacity for training and for simulation in different ways, even inside one cluster.
            For the training rows that run on P-family instances, you can reserve capacity for fixed dates. For the
            simulation and rendering rows, you spread the fleet across G-family types and Regions, or hold capacity
            with an ODCR.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Before you buy capacity, measure one unit of your own work and re-read the AWS lists, because they change. Three kinds of change to a job can also change the answer in its row."
          >
            Checking a row against your own job
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Measure your own unit of work first.</strong> Section 23, Price-Performance and Latency, describes
            the method for comparing machines on one unit of work. Choose the unit of work that the next stage of the
            pipeline uses, such as frames decoded, training samples or episodes evaluated. Run it on the instance
            family from the table, and divide the units per hour by the price of the whole instance. <Cite id="F08-82">the units-per-price method</Cite> None of
            the rows rests on a measurement of ours, because we did not measure any EC2 instance. Our own measurements
            are single runs of small test programs on two edge computers. <Cite id="F08-73">limits of our measurements</Cite>
          </Box>
          <Box variant="p">
            <strong>Re-read the AWS lists before you buy, because they change.</strong> The two reservation lists
            quoted in this section are from November 2026. The EKS guide also words its G7 limit for Auto Mode
            &quot;as of November 2026&quot;. <Cite id="F09-49">EKS user guide, Auto Mode GPU limits</Cite> The Spot
            Instance Advisor file was last modified on 20 March 2026, and it has no rows for G7, a family launched after that
            date. <Cite id="F09-96">Spot Instance Advisor data file</Cite>
          </Box>
          <Box variant="p">
            <strong>Know what can change the answer in a row.</strong> Three kinds of change to a job can do it: a
            change of scale, rendered cameras, and a change in how the team works.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Scale.</strong> When decode runs all day, its workload type becomes Always-on streams. The
              bottleneck stays the same, but you buy the capacity in a different way.{' '}
              <Cite id="F08-80">one workload, two workload types</Cite>
            </li>
            <li>
              <strong>Cameras.</strong> If GPU-parallel physics starts rendering camera images with an RTX renderer,
              it can run only on the G family.{' '}
              <Cite id="F06-60">AWS post on Isaac Lab and SageMaker, instance compatibility</Cite> It then loses the
              option to reserve capacity for fixed dates, because as of November 2026 the reservation lists name no
              G-family type. <Cite id="F09-91">EC2 user guide, Capacity Blocks supported instance types</Cite>
            </li>
            <li>
              <strong>How the team works.</strong> When runs follow each other back to back, an AWS Batch fleet that
              keeps its instances running between runs suits them better than SageMaker Training Jobs. When many jobs
              run at the same time, a persistent cluster suits them better.{' '}
              <Cite id="F09-73">AWS Physical AI Toolchain sample, training options</Cite>{' '}
              <Cite id="F09-112">AWS post on a Cosmos 3 pipeline on HyperPod</Cite>
            </li>
          </ul>
          <Box variant="p">
            Your next step is to find the row for the job you need to run and run one unit of its work on the
            instance family in that row. Then check the two reservation lists and the Spot Instance Advisor file for
            your Region, and submit the job to its queue or book its capacity.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
