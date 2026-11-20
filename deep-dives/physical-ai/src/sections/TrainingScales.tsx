import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, Derived } from '../components/Cite';
import { Figure } from '../components/Figure';
import { log10Scale } from '../lib/scale';
import { ARM, TASK_STORY } from '../lib/task';

/* Section 15. Training at Three Scales. Practical section: depends on sections 4 to 7. */

const INK = '#16191f';
const NEUTRAL_INK = '#5f6b7a';
const GPU_INK = '#1e7b3a';
const GPU_FILL = '#e6f6ea';
const EMPHASIS = '#0972d3';

const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/* ------------------------------------------------------------------------ */
/* Diagram 15.1: named published runs on one log axis of GPU-hours          */
/* ------------------------------------------------------------------------ */

interface Run {
  /** GPU-hours, the position on the axis. */
  value: number;
  /** Upper end when the source prints a range. */
  hi?: number;
  /** The value as text. */
  shown: string;
  /** True when the value is our product of two printed figures (or a unit conversion). */
  derived: boolean;
  /** Model and machine. */
  name: string;
  /** The arithmetic and whose figure it is. */
  how: string;
  /** The section's strongest number. */
  emph?: boolean;
}

const RUN_GROUPS: { head: string; runs: Run[] }[] = [
  {
    head: 'Per-task adaptation: one GPU',
    runs: [
      { value: 0.5, shown: '0.5', derived: true, name: 'GR00T 2 LoRA, one RTX 5090', how: "1 GPU x 30 minutes. NVIDIA's figure" },
      { value: 0.5, hi: 1, shown: '0.5 to 1', derived: true, name: 'ACT, one RTX 4090 or 3090', how: '1 GPU x 30 to 60 minutes. LeRobot guide, indicative' },
      { value: 3.4, shown: '3.4', derived: false, name: 'GR00T N1.7, one ml.g7e.2xlarge', how: "1 GPU x 3.4 h for 20,000 steps. AWS's measurement", emph: true },
      { value: 4, shown: '4', derived: false, name: 'SmolVLA, one A100', how: "1 GPU x 4 h for 20,000 steps. LeRobot's figure" },
      { value: 10.9, shown: '10.9', derived: false, name: 'pi0.5, all weights, one ml.g6e.xlarge', how: "1 GPU x 10.9 h for 20,000 steps. AWS's measurement" },
    ],
  },
  {
    head: 'One-node post-training: eight GPUs',
    runs: [
      { value: 252.8, shown: '252.8', derived: true, name: 'OpenVLA-OFT, RL post-training', how: '8 H200 x 31.6 h. AWS sample, measured single run' },
      { value: 768, shown: '768', derived: true, name: 'pi0-FAST, a 3B-parameter VLA', how: "8 H100 x 96 h (about 4 days). Authors' figure" },
    ],
  },
  {
    head: 'Multi-node pretraining: the labs',
    runs: [
      { value: 6144, shown: '6,144', derived: true, name: 'X-VLA pretraining', how: "64 A100 x 96 h (about 4 days). Authors' figure" },
      { value: 30720, shown: '30,720', derived: true, name: 'GR00T N1.7 pretraining', how: '256 GB200 x 120 h. NVIDIA model card' },
      { value: 50000, shown: 'roughly 50,000', derived: false, name: 'GR00T N1 pretraining', how: "Printed total, up to 1,024 H100 GPUs. NVIDIA's figure" },
    ],
  },
];

const ROW_H = 58;
const HEAD_H = 26;

function GpuHoursChart() {
  const x = log10Scale(0.1, 1e5, 24, 376);
  const label = { fontFamily: 'sans-serif', fontSize: 12, fill: INK } as const;
  let cursor = 12;
  const rows: { y: number; head?: string; run?: Run }[] = [];
  for (const g of RUN_GROUPS) {
    rows.push({ y: cursor, head: g.head });
    cursor += HEAD_H;
    for (const r of g.runs) {
      rows.push({ y: cursor, run: r });
      cursor += ROW_H;
    }
  }
  const axisY = cursor + 4;
  const height = axisY + 50;
  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <svg viewBox="0 0 400 724" role="img" aria-labelledby="training-scales-gpuhours-title" style={{ width: '100%', height: 'auto' }}>
        <title id="training-scales-gpuhours-title">Published robot-model training runs on one logarithmic axis of GPU-hours, in three bands</title>
        <desc>
          Ten runs placed by GPU-hours on a logarithmic axis from a tenth of a GPU-hour to one hundred thousand. Five
          one-GPU adaptation runs sit between half a GPU-hour and 10.9, among them 3.4 hours for 20,000 steps of GR00T
          N1.7 as AWS measured it. Two eight-GPU runs sit in the hundreds. Three multi-node pretraining runs sit
          between a few thousand and roughly 50,000.
        </desc>
        <rect x="0" y="0" width="400" height={height} fill="#fbfbfd" />
        {[-1, 0, 1, 2, 3, 4, 5].map((e) => (
          <g key={e}>
            <line x1={x(10 ** e)} y1="8" x2={x(10 ** e)} y2={axisY} stroke="#d5dbdb" strokeWidth="1" />
            <line x1={x(10 ** e)} y1={axisY} x2={x(10 ** e)} y2={axisY + 5} stroke={NEUTRAL_INK} strokeWidth="1" />
            <text x={x(10 ** e)} y={axisY + 22} textAnchor={e === -1 ? 'start' : e === 5 ? 'end' : 'middle'} {...label}>
              10
              <tspan dy="-5" fontSize="10">
                {e}
              </tspan>
            </text>
          </g>
        ))}
        <line x1={x(0.1)} y1={axisY} x2={x(1e5)} y2={axisY} stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <text x="200" y={axisY + 42} textAnchor="middle" {...label}>
          GPU-hours = GPUs x hours (log scale)
        </text>
        {rows.map((r) =>
          r.run ? (
            <g key={r.run.name}>
              <rect x="20" y={r.y} width="360" height="34" fill="#fbfbfd" opacity="0.9" />
              <text x="20" y={r.y + 13} {...label}>
                {r.run.derived ? (
                  <tspan fontWeight="bold" data-num="derived">
                    {r.run.shown}
                  </tspan>
                ) : (
                  <tspan fontWeight="bold">{r.run.shown}</tspan>
                )}
                {`  ${r.run.name}`}
              </text>
              <text x="20" y={r.y + 29} {...label} fill={NEUTRAL_INK}>
                {r.run.how}
              </text>
              <line x1={x(0.1)} y1={r.y + 44} x2={x(1e5)} y2={r.y + 44} stroke="#b6bec9" strokeWidth="1" />
              {r.run.hi !== undefined && (
                <line x1={x(r.run.value)} y1={r.y + 44} x2={x(r.run.hi)} y2={r.y + 44} stroke={GPU_INK} strokeWidth="5" strokeLinecap="round" />
              )}
              <circle
                cx={x(r.run.hi !== undefined ? Math.sqrt(r.run.value * r.run.hi) : r.run.value)}
                cy={r.y + 44}
                r="5.5"
                fill={r.run.emph ? EMPHASIS : GPU_FILL}
                stroke={r.run.emph ? EMPHASIS : GPU_INK}
                strokeWidth={r.run.emph ? 2.5 : 1.5}
              />
            </g>
          ) : (
            <g key={r.head}>
              <rect x="20" y={r.y} width="360" height="20" fill="#fbfbfd" opacity="0.9" />
              <text x="20" y={r.y + 15} fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill={GPU_INK}>
                {r.head}
              </text>
            </g>
          ),
        )}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function TrainingScales() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Place any robot-model training job in one of three sizes and know what each asks of the cluster (papers, model cards, LeRobot v0.7.0 and AWS posts, read 2026-11-20)"
          >
            15. Training at Three Scales
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Sections 4 to 7 described four kinds of model: a small policy trained on your own demonstrations, a VLA
            (vision-language-action model, a vision-language backbone with an action head attached), a world model
            that predicts video, and a JEPA (joint-embedding predictive architecture) that predicts in latent space.
            This section depends on all four and re-teaches none of them. It answers a different question: which
            size is my training job, and what does each size ask of the cluster?
          </Box>
          <Box variant="p">
            There are three sizes. Per-task adaptation runs on one GPU, one-node post-training runs on one server
            with eight GPUs, and multi-node pretraining runs across many servers and is done by the labs that
            publish the models. A reader with an {ARM} and a recorded dataset is in the first size.
          </Box>
          <Box variant="p">
            AWS measured that first size on this dive&apos;s arm. Training GR00T N1.7, NVIDIA&apos;s VLA, for 20,000
            steps on a 75-episode {ARM} dataset took 3.4 hours on one ml.g7e.2xlarge, an instance with a single GPU.
            It is one run, reported by AWS, in a post that says it is not a speed benchmark.{' '}
            <Cite id="F09-82">AWS post on training VLA models with LeRobot on SageMaker, timing table</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Find your job in one of three bands before you ask for any hardware">
            Three sizes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Two things separate the sizes: how much of the model changes, and how much data it sees.
          </Box>
          <ul>
            <li>
              <strong>Per-task adaptation, one GPU.</strong> A pretrained checkpoint, or a small policy starting from
              random weights, learns one task on one arm from tens of episodes (an episode is one recorded attempt
              at the task). This is yours when you have recorded demonstrations of the arm trying to {TASK_STORY}{' '}
              and want a policy for it. It takes minutes to hours.
            </li>
            <li>
              <strong>One-node post-training, eight GPUs.</strong> A pretrained model of billions of parameters keeps
              training on a much larger robot dataset, or with more of its weights changing, on a single server. This
              is yours when a team brings a new robot family, a new large dataset or a new training signal to an
              existing model. The published runs take from about a day to about four.
            </li>
            <li>
              <strong>Multi-node pretraining, the labs.</strong> The first training of the model itself, on hundreds
              of thousands of episodes or on internet video, across many servers at once. The published figures are
              days on tens to hundreds of GPUs. You download the result of this size; you do not rerun it.
            </li>
          </ul>
          <Box variant="p">
            How much of the model changes has three common settings, and they set how much GPU memory the job needs.
            Full fine-tuning updates every weight, so the GPU holds a gradient and optimiser state for all of them.
            LoRA (low-rank adaptation) trains small matrices added beside the existing weights and leaves the base
            weights frozen, for when the full update does not fit in memory. A frozen backbone means the
            vision-language model that reads the images and the instruction is not updated at all, and only the
            action head and a small layer that feeds it are trained.
          </Box>
          <Box variant="p">
            Post-training is the labs&apos; word for any training that starts from a pretrained checkpoint. Meta
            uses it for the stage that teaches V-JEPA 2 what actions do, from under 62 hours of robot video with the
            encoder frozen. <Cite id="F03-1">V-JEPA 2 paper, abstract</Cite> AWS uses it for a 20,000-step run on
            one arm&apos;s dataset. <Cite id="F09-82">AWS post, timing table</Cite> This section splits that span
            by size: adaptation when one GPU carries it, one-node post-training when it needs eight.
          </Box>
          <Box variant="p">
            To place jobs this different on one axis, count the GPU time each one occupies:
          </Box>
          <Box variant="p">
            <code>GPU-hours = number of GPUs x hours of wall-clock time</code>
          </Box>
          <Box variant="p">
            The first factor is the width of the job, how many GPUs it holds at once. The second is how long it holds
            them. A run on 8 H100 GPUs for about 4 days is 8 x 96 hours, which is <Derived>768</Derived> GPU-hours.{' '}
            <Cite id="F02-28">pi0-FAST paper, appendix on DROID training</Cite> The chart computes the product only
            where a source prints both factors, and shows the arithmetic under each point.
          </Box>
          <Figure
            cites="F02-46 F01-90 F09-82 F02-63 F04-70 F02-28 F02-71 F02-39 F02-34"
            caption={
              <>
                How to read it: each row is one published run, placed by GPU-hours on a log scale, with the
                multiplication under its name. The blue point is the run closest to the reader&apos;s own job. A
                GPU-hour on an RTX 4090 and one on a GB200 are different amounts of work, so read positions to the
                nearest power of ten. The three bands do not overlap on this axis.
                Vendor and author figures are theirs; none is our measurement.
              </>
            }
          >
            <GpuHoursChart />
          </Figure>
          <Box variant="p">
            Duration not published, so these runs are named here and left off the axis:
          </Box>
          <ul>
            <li>
              pi0, a VLA of 3 billion parameters, fine-tuned on one ml.p5.48xlarge (eight H100 GPUs) in an AWS post.{' '}
              <Cite id="F09-83">AWS post on fine-tuning pi0 on SageMaker HyperPod, solution architecture</Cite>
            </li>
            <li>
              DreamZero, a model of 14 billion parameters that predicts video and actions together, fine-tuned by
              Telexistence on one p6-b200.48xlarge (eight B200 GPUs).{' '}
              <Cite id="F09-88">AWS post on Telexistence&apos;s DreamZero experiment, pipeline overview</Cite>
            </li>
            <li>
              Cosmos 3, NVIDIA&apos;s video world model: 1,024 GB200 GPUs for the Nano variant and 2,048 for Super.{' '}
              <Cite id="F03-97">Cosmos 3 paper, section 4.1</Cite>
            </li>
            <li>
              Three JEPA world models: LeWorldModel on &quot;a single GPU in a few hours&quot; with the GPU not
              named, the V-JEPA 2-AC predictor as a 32-GPU job for 94,500 iterations, and RoboJEPA-1B on 256 H100
              GPUs. <Cite id="F03-119">our collection of the JEPA training figures</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The job you run after recording your own episodes: how long it takes and how much GPU memory to ask for"
          >
            Per-task adaptation: one GPU
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Per-task adaptation is the last step between a downloaded model and your arm doing your task. The input
            is small, tens of episodes, and so is the job: one GPU, one process, no coordination. What varies is the
            model, from a small policy trained from random weights to a VLA with only its action head training.
          </Box>
          <Box variant="p">
            AWS&apos;s post of 19 November 2026 runs this size end to end. It trains three policies on an {ARM}{' '}
            pick-and-place dataset with LeRobot 0.6.1, using the same container on SageMaker Training Jobs (instances
            that start for one job and shut down when it ends) and on SageMaker HyperPod (a cluster that stays up).
            The three are ACT (Action Chunking with Transformers, the small policy from section 4), GR00T N1.7 and
            pi0.5, Physical Intelligence&apos;s VLA.{' '}
            <Cite id="F09-81">AWS post on training VLA models with LeRobot on SageMaker, introduction</Cite>
          </Box>
          <Box variant="p">
            Its timing table, AWS&apos;s own measurement, is for 20,000 steps on 75 episodes from two cameras. GR00T
            N1.7 took 3.4 hours on ml.g7e.2xlarge at batch 32 and 4.0 hours on ml.g6e.2xlarge at batch 16. pi0.5
            with all of its weights training took 10.9 hours on ml.g6e.xlarge at batch 8. The gap between 3.4 and
            10.9 hours follows from how much of the model trains and from the batch that fits: the N1.7 runs train
            the action head with the backbone frozen.{' '}
            <Cite id="F09-82">AWS post, GPU memory table and timing table</Cite>
          </Box>
          <Box variant="p">
            LeRobot&apos;s hardware guide gives the same order of magnitude for other GPUs and calls its figures
            indicative: ACT in 30 to 60 minutes on one RTX 4090 or 3090, SmolVLA (a small VLA) in 3 to 6
            hours on one L4 or A10G, pi0 or pi0.5 in 4 to 8 hours on one A100 with 40 GB. Those times assume 5 epochs
            over about 50 episodes of 30 s each, 45,000 frames, and the guide adds that real runs deviate by +/-50%.
            Episode length matters: at the recorder&apos;s default of 60 s the same 50 episodes are 90,000 frames,
            and by our arithmetic each time doubles.{' '}
            <Cite id="F01-90">LeRobot hardware guide, memory by policy group and common scenarios</Cite>
          </Box>
          <Box variant="p">
            Memory decides which GPU you ask for, and the setting from the previous block decides memory. The openpi
            repository, Physical Intelligence&apos;s code for the pi0 family, asks for more than 22.5 GB of GPU memory
            for a LoRA fine-tune and more than 70 GB for a full one.{' '}
            <Cite id="F02-54">openpi README, requirements</Cite> NVIDIA sets a minimum of one GPU with 40 GB for
            fine-tuning GR00T N1.7 with the vision-language model frozen, and recommends 80 GB or more per GPU once
            the backbone trains too.{' '}
            <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite> In AWS&apos;s runs the frozen-backbone
            N1.7 job peaked at 41.5 GB at batch 32, and ACT at 15 GB at the same batch.{' '}
            <Cite id="F09-82">AWS post, GPU memory table</Cite>
          </Box>
          <ExpandableSection headerText="Four more published one-GPU runs">
            <ul>
              <li>
                SmolVLA from its 450M checkpoint on about 50 episodes: 20,000 steps at batch size 64 take roughly 4
                hours on a single A100, in LeRobot&apos;s figure.{' '}
                <Cite id="F02-63">LeRobot SmolVLA guide</Cite>
              </li>
              <li>
                ACT trained from random weights for one task: about 5 hours on one RTX 2080 Ti with 11 GB, as its
                authors report. <Cite id="F02-9">ACT paper, section IV-C</Cite>
              </li>
              <li>
                GR00T fine-tuned on AWS Batch: 6000 steps &quot;usually takes up to 2 hours on a g6e.4xlarge
                instance&quot;. <Cite id="F09-114">AWS embodied AI series, part 1</Cite>
              </li>
              <li>
                GR00T 2, by NVIDIA&apos;s report: one LoRA fine-tune of about 30 minutes on an RTX 5090 per task, on
                50 tasks NVIDIA selected as ones the model learns from five episodes.{' '}
                <Cite id="F02-46">NVIDIA GR00T 2 project page, fast adaptation</Cite>
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="When the model or the dataset outgrows one GPU: what the published eight-GPU runs look like, and why they stay on one server"
          >
            One-node post-training: eight GPUs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One-node post-training keeps a pretrained model learning on one server that holds eight datacenter GPUs.
            Each GPU runs a copy of the model on its own share of the batch, and the copies agree on one update per
            step. Because all eight sit in one machine, that exchange never leaves the server. This is the largest
            job that needs no network between servers and no cluster-wide scheduler.
          </Box>
          <Box variant="p">
            The size is yours when adaptation stops fitting: the dataset grows from tens of episodes to a
            robot-family corpus, the backbone has to train as well as the action head, or the model is a world model
            of many billions of parameters. Three published runs show the shape.
          </Box>
          <ul>
            <li>
              <strong>A larger dataset.</strong> Physical Intelligence&apos;s authors report training pi0-FAST, a
              3B-parameter VLA, for 240k iterations at batch size 256 in about 4 days on 8 H100 GPUs: the{' '}
              <Derived>768</Derived> GPU-hours on the chart (8 x 96 hours).{' '}
              <Cite id="F02-28">pi0-FAST paper, appendix on DROID training</Cite>
            </li>
            <li>
              <strong>A new training signal.</strong> An AWS sample post-trains OpenVLA-OFT, a 7B-parameter VLA, with
              RL (reinforcement learning: the policy improves from scored attempts in a simulator, section 8) on one
              p5en.48xlarge with 8 H200 GPUs. Training took 31.6 hours in its measured single run, which is 8 x 31.6
              = <Derived>252.8</Derived> GPU-hours.{' '}
              <Cite id="F04-70">AWS sample for robot foundation model simulation, results</Cite>
            </li>
            <li>
              <strong>A larger model.</strong> Telexistence fine-tuned DreamZero, at 14 billion parameters, on one
              p6-b200.48xlarge with eight B200 GPUs, reserved ahead with EC2 Capacity Blocks for ML (a booking of GPU
              instances for a set window). The post names no job scheduler and prints no training duration.{' '}
              <Cite id="F09-88">AWS post on Telexistence&apos;s DreamZero experiment</Cite>
            </li>
          </ul>
          <Box variant="p">
            AWS&apos;s own eight-GPU example fine-tunes pi0 under SageMaker HyperPod with data and checkpoints on FSx
            for Lustre (AWS&apos;s managed Lustre, a file system many processes read in parallel). Its reason for the
            persistent cluster is iteration: the data stays mounted between jobs, where a Training Job has a
            &quot;~5 min cold start&quot;.{' '}
            <Cite id="F09-83">AWS post on fine-tuning pi0 on SageMaker HyperPod</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What the published pretraining runs took, so you know what you are downloading and why you start from it"
          >
            Multi-node pretraining: the labs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Pretraining is the first training of the model, before it has seen your robot. It reads data from many
            robots, or video with no robot in it, and it runs on many servers at once, so the update each step has to
            cross a network between them. The published runs that print both a GPU count and a duration lasted
            days, on tens to hundreds of GPUs.
          </Box>
          <ul>
            <li>
              X-VLA&apos;s authors report 64 NVIDIA A100 GPUs for about 4 days on 290K episodes: 64 x 96 hours ={' '}
              <Derived>6,144</Derived> GPU-hours. <Cite id="F02-71">X-VLA paper, appendix G</Cite>
            </li>
            <li>
              NVIDIA&apos;s model card for GR00T N1.7 gives 64 GB200 nodes with 4 GPUs each for 120 hours: 256 GPUs
              x 120 hours = <Derived>30,720</Derived> GPU-hours. The line is an energy estimate, and it does not
              say whether the 120 hours are one run or a total over several.{' '}
              <Cite id="F02-39">GR00T N1.7 model card, computational load</Cite>
            </li>
            <li>
              For the earlier GR00T N1, NVIDIA prints the total directly: roughly 50,000 H100 GPU-hours, on up to
              1,024 GPUs for a single model. <Cite id="F02-34">GR00T N1 paper, training infrastructure</Cite>
            </li>
          </ul>
          <Box variant="p">
            The smallest of the three is about <Derived>1,800</Derived> times the 3.4 GPU-hours of the adaptation run in the first
            block (<Derived>6,144</Derived> / 3.4, our arithmetic). That ratio is the reason to start from a
            checkpoint: the lab pays the right-hand end of the chart once, and every reader after it pays the
            left-hand end.
          </Box>
          <ExpandableSection headerText="V-JEPA 2: a projection in place of a run">
            <Box variant="p">
              The V-JEPA 2 paper prints one pretraining figure, and it is a projection: training its largest encoder
              at full resolution throughout would take roughly 60 GPU-years on A100s, and raising the resolution
              progressively cuts GPU time by 8.4x. The GPU count and duration of the run that produced the released
              model are not stated in the paper. <Cite id="F03-12">V-JEPA 2 paper, section 2.2 and Figure 5</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Turn your size into four requests: GPU memory, storage, network and a reservation"
          >
            What each size asks of the cluster
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The size of the job fixes four things you ask the platform for. Read your row.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 760 }}>
              <thead>
                <tr>
                  <th style={TH}>Size</th>
                  <th style={TH}>GPU memory</th>
                  <th style={TH}>Storage</th>
                  <th style={TH}>Network</th>
                  <th style={TH}>Reservation</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>
                    <strong>Per-task adaptation</strong>, one GPU
                  </td>
                  <td style={TD}>
                    Set by the model and by how much of it trains: 15 GB for ACT and 41.5 GB for GR00T N1.7 with the
                    backbone frozen, both at batch 32 in AWS&apos;s runs
                  </td>
                  <td style={TD}>The dataset and the checkpoints: 75 episodes from two cameras in AWS&apos;s run</td>
                  <td style={TD}>None between GPUs. One GPU holds the whole job</td>
                  <td style={TD}>
                    None. Pass a list of instance types in priority order and the job starts on the first with
                    capacity
                  </td>
                  <td style={TD}>
                    <Cite id="F09-82">AWS post, GPU memory table</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <strong>One-node post-training</strong>, eight GPUs
                  </td>
                  <td style={TD}>
                    The 80 GB class once every weight trains: openpi asks for more than 70 GB for a full fine-tune
                  </td>
                  <td style={TD}>
                    A shared file system that outlives the job: 1.2 TiB of FSx for Lustre in AWS&apos;s pi0 example
                  </td>
                  <td style={TD}>Inside the server. Nothing crosses between servers</td>
                  <td style={TD}>
                    Usually. Telexistence booked its eight B200 GPUs with Capacity Blocks; a SageMaker training plan
                    runs 1 to 182 days and is bookable up to 8 weeks ahead
                  </td>
                  <td style={TD}>
                    <Cite id="F02-54">openpi README</Cite> <Cite id="F09-83">AWS pi0 post</Cite>{' '}
                    <Cite id="F09-88">AWS Telexistence post</Cite>{' '}
                    <Cite id="F09-34">SageMaker training plans guide</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <strong>Multi-node pretraining</strong>, the labs
                  </td>
                  <td style={TD}>Datacenter GPUs in every published run here: A100, H100 or GB200</td>
                  <td style={TD}>
                    A corpus every node reads at once: 290K episodes for X-VLA
                  </td>
                  <td style={TD}>
                    A low-latency fabric between servers, because each step&apos;s update crosses it. On AWS that is
                    EFA
                  </td>
                  <td style={TD}>
                    Always. Training plans come in quantities of 1, 2, 4, 8, 16, 32 or 64 instances; GB200
                    UltraServers go through an account manager
                  </td>
                  <td style={TD}>
                    <Cite id="F02-71">X-VLA paper, appendix G</Cite>{' '}
                    <Cite id="F09-34">SageMaker training plans guide</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Two notes on the rows. Storage has a second half the table leaves out: frames must be decoded as fast as
            the GPU consumes them, which section 10, Processing and Curating, covers as decoding beside the GPU. And
            EFA (Elastic Fabric Adapter) is the AWS network interface that lets training processes on different
            servers exchange data without passing through the operating system&apos;s network stack; the{' '}
            <Link href="../efa/">EFA dive</Link> covers the fabric.
          </Box>
          <Box variant="p">
            A wider job also loses more when a server fails. SageMaker HyperPod&apos;s checkpointless training
            rebuilds a failed node&apos;s training state from its healthy peers, and AWS reports over 80% less
            downtime in internal studies on 16 to over 2,000 GPUs. The documented recipes are language models, and
            this research located no first-party example on a robot policy or a world model.{' '}
            <Cite id="F09-30">AWS News Blog, checkpointless and elastic training on SageMaker HyperPod</Cite> How
            many GPUs share one update, how data is loaded and how checkpoints are written are the subject of the{' '}
            <Link href="../llm-training-systems/">Training at Scale dive</Link>.
          </Box>
          <Box variant="p">
            What to do next depends on your row. With an {ARM} and a recorded dataset you are in the first: ask for
            one GPU with more memory than your model&apos;s fine-tuning line, expect hours (3.4 of them for 20,000
            steps of GR00T N1.7 in AWS&apos;s run), and reserve nothing.{' '}
            <Cite id="F09-82">AWS post, timing table</Cite> Move to the second row only when a measured limit sends
            you there: the weights you need to train do not fit one GPU, or the run on one GPU takes days. Section
            24, Orchestrating It on AWS, takes each row to a scheduler and a way of buying capacity, and section 25,
            Choosing, turns the whole path into one decision.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
