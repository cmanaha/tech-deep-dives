import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import { Cite, Derived } from '../components/Cite';
import { Figure } from '../components/Figure';
import { Formula } from '../components/Math';
import { log10Scale } from '../lib/scale';
import { ARM } from '../lib/task';

/* Section 15. Training at Three Scales. Leans on sections 4 to 7 and 10; feeds sections 20 and 24 to 29. */

const INK = '#16191f';
const NEUTRAL_INK = '#5f6b7a';
const GPU_INK = '#1e7b3a';
const GPU_FILL = '#e6f6ea';
const EMPHASIS = '#0972d3';

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
    head: 'One GPU',
    runs: [
      { value: 0.5, shown: '0.5', derived: true, name: 'GR00T 2 LoRA, one RTX 5090', how: "1 GPU x 30 minutes. NVIDIA's figure" },
      { value: 0.5, hi: 1, shown: '0.5 to 1', derived: true, name: 'ACT, one RTX 4090 or 3090', how: '1 GPU x 30 to 60 minutes. LeRobot guide, indicative' },
      { value: 3.4, shown: '3.4', derived: false, name: 'GR00T N1.7, one ml.g7e.2xlarge', how: "1 GPU x 3.4 h for 20,000 steps. AWS's measurement", emph: true },
      { value: 4, shown: '4', derived: false, name: 'SmolVLA, one A100', how: "1 GPU x 4 h for 20,000 steps. LeRobot's figure" },
      { value: 10.9, shown: '10.9', derived: false, name: 'pi0.5, all weights, one ml.g6e.xlarge', how: "1 GPU x 10.9 h for 20,000 steps. AWS's measurement" },
    ],
  },
  {
    head: 'One node: eight GPUs',
    runs: [
      { value: 252.8, shown: '252.8', derived: true, name: 'OpenVLA-OFT, reinforcement learning', how: '8 H200 x 31.6 h. AWS sample, measured single run' },
      { value: 768, shown: '768', derived: true, name: 'pi0-FAST, a 3B-parameter VLA', how: "8 H100 x 96 h (about 4 days). Authors' figure" },
    ],
  },
  {
    head: 'Many nodes: pretraining',
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
          one-GPU runs sit between half a GPU-hour and 10.9, among them 3.4 hours for 20,000 steps of GR00T
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
            description="Tell before launch whether a robot-model training job needs one GPU, one eight-GPU server or many servers: memory sets the floor, your deadline sets the width, and the width decides network, checkpoints and capacity (papers, model cards, LeRobot v0.7.0 and AWS posts, read 2026-11-20)"
          >
            15. Training at Three Scales: One GPU, One Node, Many Nodes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The size of a robot-model training job, more than the model it trains, sets what the job asks of a
            cluster: the GPU memory, whether the servers need a fast network between them, and what a lost machine
            costs. That last cost decides whether Spot is open to the job. Spot is the EC2 market where AWS can take
            an instance back after a two-minute warning, sent on a best-effort basis.{' '}
            <Cite id="F09-95">EC2 User Guide, Spot interruptions and best practices</Cite> Jobs come in three sizes:
            one GPU for hours, one server of eight GPUs for a day or more, or many servers for days. Someone with one
            arm and a few dozen recorded episodes is in the smallest.
          </Box>
          <Box variant="p">
            GR00T N1.7 shows the spread inside one model. It is NVIDIA&apos;s VLA, a vision-language-action model:
            a vision-language model reads the camera images and the instruction, and an action head attached to it
            outputs the arm&apos;s motions (section 5, Vision-Language-Action Models). AWS fine-tuned it, training it
            further on new data, for 20,000 steps (a step is one update of the weights) on 75 recorded episodes of
            the {ARM} arm. The run took 3.4 hours on one ml.g7e.2xlarge, an instance with a single 96 GB GPU (a
            single run, not a speed benchmark).{' '}
            <Cite id="F09-82">AWS post on training VLA models with LeRobot on SageMaker, timing table</Cite>
          </Box>
          <Box variant="p">
            Pretraining, the first training that produced the model, took 64 nodes (servers) of 4 GB200 GPUs for 120
            hours: 256 x 120 = <Derived>30,720</Derived> GPU-hours, about <Derived>9,000</Derived> times the
            fine-tune&apos;s 3.4 (from the model card&apos;s energy estimate, which may sum several runs). <Cite id="F02-39">GR00T N1.7 model card, computational load</Cite> The architecture is the same in
            both jobs; the work is not. The fine-tune updated only the action head and the small layer that feeds it,
            with the vision-language part frozen.{' '}
            <Cite id="F09-82">AWS post, GPU memory table and timing table</Cite>
          </Box>
          <Box variant="p">
            Three numbers place any job. What trains sets the memory floor: whether one GPU can hold the job at all.
            How many samples it processes sets the GPU-hours. The wall-clock you can wait divides the GPU-hours into
            a width, and the width decides the network, the checkpoints and the market.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Estimate from which weights a job trains whether one GPU holds it, and from its samples how many GPU-hours it needs"
          >
            Memory sets the floor, and the hours you accept set the width
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Training repeats one step. The GPU takes a batch of samples (a sample is one moment of an episode: camera
            images and joint angles, paired with the actions the person took next), runs the model forward, measures
            how far its actions are from the recorded ones, and works backward to adjust the weights that train. A
            weight that trains costs memory beyond its own value: a gradient, the direction in which to move it, and
            running state kept from step to step by the optimiser, the algorithm that turns gradients into updates.
            The backward pass also needs the activations, the intermediate results of the forward pass, for every
            sample in the batch. A frozen weight is only read.
          </Box>
          <Box variant="p">
            What trains therefore sets how large a batch fits. In NVIDIA&apos;s test on one A6000 GPU, its first GR00T
            release, N1, fit batches of up to 200 when only its action layers trained, and 16 once the vision encoder,
            the part that turns images into vectors, trained as well: a batch <Derived>12.5</Derived> times smaller
            (200 / 16). <Cite id="F02-34">GR00T N1 paper, training infrastructure</Cite> Holding the weights is the
            cheap part: N1.7&apos;s 3,144,016,000 parameters at 2 bytes each in bf16 (a 16-bit number format) are{' '}
            <Derived>6.3</Derived> GB. <Cite id="F02-37">GR00T N1.7 model record</Cite>{' '}
            <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite>
          </Box>
          <Box variant="p">
            A training recipe is the published configuration of a run: the model, the batch, the number of steps
            and which weights train. For the weights it picks one of three settings. Full fine-tuning trains every weight. LoRA (low-rank adaptation)
            freezes the base weights and trains small matrices added beside them. A frozen backbone leaves the
            vision-language model untouched and trains the action head and its feeding layer. openpi, Physical
            Intelligence&apos;s code for its pi0 models, asks for more than 22.5 GB of GPU memory for a LoRA
            fine-tune and more than 70 GB for a full one. <Cite id="F02-54">openpi README, requirements</Cite>
          </Box>
          <Box variant="p">
            Read as the price of making weights trainable, the gap between those two figures is about{' '}
            <Derived>(70 - 22.5) / 3 = 16</Derived> bytes for each of pi0&apos;s 3 billion parameters, on top of the
            2 that store it. <Cite id="F09-83">AWS post on fine-tuning pi0 on SageMaker HyperPod</Cite> At that rate,
            training every weight of N1.7 needs about <Derived>3.14 x 18 = 57</Derived> GB before the batch&apos;s
            activations, in line with NVIDIA&apos;s advice of 80 GB or more per GPU once its language model or vision
            encoder trains. <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite>
          </Box>
          <Box variant="p">
            A memory figure belongs to a code base and a batch as much as to a model. NVIDIA keeps its default N1.7
            recipe, backbone frozen, under about 35 GB per GPU and sets a minimum of one 40 GB GPU.{' '}
            <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite> AWS&apos;s LeRobot run of the same setting
            peaked at 41.5 GB at batch 32, so that batch does not fit a 40 GB card.{' '}
            <Cite id="F09-82">AWS post, GPU memory table</Cite> Gradient checkpointing, which recomputes activations in
            the backward pass in place of storing them and so trades compute for memory, is the switch LeRobot&apos;s pi0 example turns on to fit a
            full fine-tune on one GPU, because it &quot;reduces memory usage significantly&quot;.{' '}
            <Cite id="F02-80">LeRobot pi0 documentation</Cite>
          </Box>
          <Box variant="p">
            Which of the three settings a run uses is a command-line flag, and that flag has failed without warning. Before LeRobot v0.7.0,{' '}
            <code>--policy.use_peft=true</code> on its own ran a full fine-tune; v0.7.0 has one LoRA switch for every
            policy, <code>--peft.method_type=LORA</code>.{' '}
            <Cite id="F02-83">LeRobot v0.7.0 PEFT documentation and release</Cite> Confirm which weights a run trains
            before trusting a memory figure for it.
          </Box>
          <Box variant="p">
            Hours follow from samples: steps x batch, divided by the samples per second one GPU sustains, gives the
            GPU-hours. Compare runs in samples, not steps. AWS&apos;s two N1.7 runs both took 20,000 steps: batch 32
            on ml.g7e.2xlarge was 640,000 samples in 3.4 hours, about <Derived>52</Derived> a second, and batch 16 on
            ml.g6e.2xlarge was 320,000 samples in 4.0 hours, about <Derived>22</Derived> a second.{' '}
            <Cite id="F09-82">AWS post, timing table</Cite> By steps the g6e run looks{' '}
            <Derived>4.0 / 3.4 = 1.2</Derived> times slower; by samples it is <Derived>52 / 22 = 2.4</Derived> times
            slower.
          </Box>
          <Box variant="p">
            Take the rate from your own code. NVIDIA lists 131.33 samples a second for N1.7 on an RTX Pro 6000
            Blackwell, <Derived>2.5</Derived> times the 52 of AWS&apos;s LeRobot run on the g7e&apos;s RTX PRO 6000
            Blackwell Server Edition, and the two come from different code.{' '}
            <Cite id="F02-42">Isaac-GR00T README, training throughput</Cite>{' '}
            <Cite id="F08-53">AWS announcement of G7e instances</Cite>{' '}
            <Cite id="F09-82">AWS post, timing table</Cite> A plan built on the vendor&apos;s rate would
            have been off by that factor.
          </Box>
          <Box variant="p">
            The width is the GPU-hours divided by the wall-clock you accept. Data-parallel training spreads the work:
            each GPU keeps a copy of the model, works through its own share of every batch, and the copies combine
            their gradients into one update per step. Each update therefore sees the per-GPU batch times the number of
            GPUs, and widening a run changes that batch unless the per-GPU batch shrinks to match. SmolVLA&apos;s
            authors pretrained their small VLA on 4 GPUs to fit a batch of 256 and say the model trains easily on
            one: the width was a choice about the run, not a property of the model.{' '}
            <Cite id="F02-59">SmolVLA paper, section 4</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Place your job among published runs from half a GPU-hour to roughly 50,000, and read its width from its hours and memory rather than from the name of its stage"
          >
            Published runs span five powers of ten in GPU-hours
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">One axis holds every run, from a 30-minute LoRA to a lab&apos;s pretraining:</Box>
          <Formula
            name="GPU-hours"
            tex={String.raw`\begin{aligned} &\text{GPU-hours} = \text{number of GPUs} \\ &\quad \times\ \text{hours of wall-clock time} \end{aligned}`}
          />
          <Box variant="p">
            The first factor decides whether the job needs a network between servers; the second, how many saves it
            needs to survive a lost machine.
          </Box>
          <Figure
            cites="F02-46 F01-90 F09-82 F02-63 F04-70 F02-28 F02-71 F02-39 F02-34"
            caption={
              <>
                Each row is one published run, placed by GPU-hours on a log scale, with GPUs x hours and the
                figure&apos;s owner under its name; the blue point is AWS&apos;s GR00T N1.7 fine-tune. A GPU-hour on an
                RTX 4090 and one on a GB200 are different amounts of work, so read positions to the nearest power of
                ten.
              </>
            }
          >
            <GpuHoursChart />
          </Figure>
          <Box variant="p">
            The name of the stage does not predict the width. Post-training, any training that starts from a
            pretrained checkpoint (a saved copy of a model&apos;s weights), ran on one GPU in AWS&apos;s N1.7 run.{' '}
            <Cite id="F09-82">AWS post, timing table</Cite> Meta&apos;s post-training of V-JEPA 2-AC, a model that
            predicts how a scene changes when the arm acts, built on Meta&apos;s V-JEPA 2 video encoder (section 7,
            JEPA), used under 62 hours of robot video with the encoder frozen.{' '}
            <Cite id="F03-1">V-JEPA 2 paper, abstract</Cite> Its released config still asks for 4 nodes of 8 GPUs at
            8 clips each, a batch of 4 x 8 x 8 = 256.{' '}
            <Cite id="F03-21">V-JEPA 2 paper and released config, action-conditioned training</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Ask for one GPU whose memory clears the trainable part at your batch, expect hours, and save often enough that a lost Spot instance costs minutes"
          >
            One GPU: hours of work, minutes at risk
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The fine-tune after a recording session is this size: a pretrained checkpoint, or a small policy from
            random weights, learns one task from tens of episodes. ACT, the chunking policy of section 4, Learning
            From Demonstrations, trains all of its roughly 80M parameters from scratch; its authors trained it in
            about 5 hours on one 11 GB RTX 2080 Ti. <Cite id="F02-9">ACT paper, section IV-C</Cite>
          </Box>
          <Box variant="p">
            LeRobot&apos;s hardware guide, for about 50 episodes of 30 s trained for 5 epochs (an epoch is one pass
            over every frame) at batch 8 for ACT and 4 for pi0, puts ACT at 30 to 60 minutes on one RTX 4090 or 3090
            and pi0 or pi0.5 at 4 to 8 hours on one A100 with 40 GB. These are indicative figures that real runs miss
            by up to 50% either way, and at the recorder&apos;s default of 60 s per episode the same 50 episodes are
            90,000 frames, and by our arithmetic each training time doubles.{' '}
            <Cite id="F01-90">LeRobot hardware guide, memory by policy group and common scenarios</Cite>
          </Box>
          <Box variant="p">
            The GPU reaches those times only if the CPU keeps it fed. LeRobot decodes the episodes&apos; video and
            augments the images on CPU cores, in dataloader workers (the processes that prepare each batch), so the
            cores beside the GPU cap the frames per second it trains on.{' '}
            <Cite id="F05-107">LeRobot decode path and the EC2 CPU table</Cite> One-GPU instance sizes carry from 4
            vCPUs (EC2&apos;s virtual CPUs) on g6e.xlarge to 64 on g6e.16xlarge, so at this size the core count is
            chosen with the instance (section 10, Processing and Curating, works out how many workers a batch needs).{' '}
            <Cite id="F08-57">EC2 accelerated instance table, vCPUs per GPU</Cite>
          </Box>
          <Box variant="p">
            During a run, a checkpoint also means the saved state the run resumes from: for the whole of N1.7, its{' '}
            <Derived>6.3</Derived> GB of weights plus the optimiser state of what trains. The interval between saves
            is what a lost machine costs. AWS&apos;s walkthrough of GR00T on AWS Batch saves every 2000 of its 6000
            steps, on a run that &quot;usually takes up to 2 hours on a g6e.4xlarge instance&quot;, so a machine lost
            just before a save costs up to a third of the run, at most <Derived>40</Derived> minutes.{' '}
            <Cite id="F09-114">AWS embodied AI series, part 1</Cite>
          </Box>
          <Box variant="p">
            Minutes at risk make Spot usable. AWS Batch&apos;s guidance for Spot is to split or checkpoint work into
            parts of 30 minutes or less, <Cite id="F09-11">AWS Batch User Guide, Spot best practices</Cite> and at the
            walkthrough&apos;s 2-hour ceiling a save every <Derived>6000 x 30 / 120 = 1,500</Derived> steps meets it.
          </Box>
          <Box variant="p">
            AWS&apos;s LeRobot post puts its Training Jobs (SageMaker instances started for one job and shut down when
            it ends) on Spot with <code>--spot</code>, and passes a priority list of instance types so that the job
            starts on the first with capacity.{' '}
            <Cite id="F09-81">AWS post on training VLA models with LeRobot on SageMaker</Cite>{' '}
            <Cite id="F09-82">AWS post, instance selection</Cite> Underneath, managed Spot training needs{' '}
            <code>EnableManagedSpotTraining</code> and a <code>MaxWaitTimeInSeconds</code> larger than{' '}
            <code>MaxRuntimeInSeconds</code>. SageMaker copies checkpoints from a local path to S3 and back after an
            interruption, and the job resumes from the last one. It does not fall back to On-Demand, the regular
            market, so with no Spot capacity it waits out the maximum, then stops.{' '}
            <Cite id="F10-536">SageMaker Developer Guide, managed Spot training</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Move to eight GPUs when one would take weeks or cannot hold the trainable state, save off the machine, and plan for capacity that may not be there"
          >
            One node: every lost hour costs eight GPU-hours
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A node is one server, such as an EC2 instance with eight GPUs, and eight in one server is the widest job
            whose exchange of gradients never leaves the machine. Time sends a job here: pi0-FAST, a 3-billion-parameter
            VLA, trained for about 4 days on 8 H100 GPUs by its authors&apos; account, 8 x 96 = <Derived>768</Derived> GPU-hours, which on one GPU
            would be <Derived>768 / 24 = 32</Derived> days.{' '}
            <Cite id="F02-28">pi0-FAST paper, appendix on DROID training</Cite> The CPU budget is fixed at this size:
            most eight-GPU sizes carry 24 vCPUs per GPU, 12 physical cores, and the dataloader workers have to keep up
            within them. <Cite id="F08-57">EC2 accelerated instance table, vCPUs per GPU</Cite>
          </Box>
          <Box variant="p">
            Memory sends a job here too: a trainable state too large for one GPU, as when a VLA&apos;s backbone
            trains. FSDP (fully sharded data parallel) then splits the weights, gradients and optimiser state across
            the GPUs in place of a full copy on each; AWS&apos;s example fine-tunes pi0 that way across the eight
            H100 GPUs of one ml.p5.48xlarge.{' '}
            <Cite id="F09-83">AWS post on fine-tuning pi0 on SageMaker HyperPod</Cite> openpi&apos;s PyTorch port
            lacks FSDP and LoRA, which need its JAX code. <Cite id="F02-55">openpi README, PyTorch support</Cite>
          </Box>
          <Box variant="p">
            A lost node costs the work of all eight GPUs since the last save that survives it. An AWS sample
            post-trains OpenVLA-OFT, a 7B-parameter VLA, with RL (reinforcement learning: the policy improves from
            scored attempts in a simulator; section 8, Reinforcement Learning for Robots) on one p5en.48xlarge with 8
            H200 GPUs, and its measured run trained for 31.6 hours.{' '}
            <Cite id="F04-70">AWS sample for robot foundation model simulation, results</Cite>
          </Box>
          <Box variant="p">
            An earlier run of that sample, on 8 H100 GPUs at about 27 minutes a step, saved at steps 25, 50 and 75,
            about <Derived>11</Derived> hours apart (<Derived>25 x 27 = 675</Derived> minutes). It hit its 40-hour
            wall-clock cap at step 83 of 100, and the timeout ended the script before the latest checkpoint was
            uploaded: the instance terminated with the checkpoints of steps 25, 50 and 75 still on its own disk.{' '}
            <Cite id="F04-71">AWS sample, earlier run</Cite> None of the three saves had left the machine, so the
            run kept nothing: about 38 hours of training on eight GPUs, <Derived>8 x 38 = 304</Derived> GPU-hours
            (<Derived>8 x 40 = 320</Derived> over the 40 hours the instance ran). A save on the machine&apos;s own
            disk dies with the machine.
          </Box>
          <Box variant="p">
            For large models the best-practices guide for Amazon EKS (Elastic Kubernetes Service, AWS&apos;s managed
            Kubernetes) suggests two tiers: fast local saves every 5 to 30 minutes for transient faults, and durable
            saves hourly for major failures.{' '}
            <Cite id="F10-535">EKS Best Practices Guide, checkpointing long training jobs</Cite> On SageMaker
            HyperPod, AWS&apos;s persistent training cluster, the pi0 example keeps data and checkpoints on FSx for
            Lustre (AWS&apos;s managed Lustre, read by many processes in parallel) with the container image cached,
            so the next job starts at once, where a SageMaker Training Job has a &quot;~5 min cold start&quot;.{' '}
            <Cite id="F09-83">AWS post on fine-tuning pi0 on SageMaker HyperPod</Cite>
          </Box>
          <Box variant="p">
            Capacity for this size can run out. On one evening, 31 October 2026, no On-Demand 8 x 80 GB instance on
            the sample&apos;s list was free in three Regions, and the run fell back to Spot, where an interruption
            costs what a lost node costs. <Cite id="F04-71">AWS sample, capacity and the Spot fallback</Cite>{' '}
            Capacity Blocks for ML reserve EC2&apos;s P instances (data-centre GPUs such as the H100, H200 and B200)
            and Trainium for a set window, but none of the G family (GPUs such as the L40S).{' '}
            <Cite id="F09-91">EC2 User Guide, Capacity Blocks</Cite>
          </Box>
          <Box variant="p">
            Training plans leave out the G family too, so neither a Capacity Block nor a training plan reserves the
            G instances of the one-GPU size, while both reserve an eight-GPU P node.{' '}
            <Cite id="F09-35">SageMaker training plans, eligible instance types</Cite> Telexistence booked one
            p6-b200.48xlarge with Capacity Blocks and fine-tuned DreamZero, a 14-billion-parameter model that
            predicts video and actions, on that single node.{' '}
            <Cite id="F09-88">AWS post on Telexistence&apos;s DreamZero experiment</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Spread pretraining over hundreds of GPUs to finish in days, and accept what that asks for: a fabric between servers, one zone, recovery that spans nodes, and reserved capacity"
          >
            Many nodes: buying back months with a network
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Pretraining leaves the server for time. GR00T N1.7&apos;s 30,720 GPU-hours on one node of eight would be{' '}
            <Derived>3,840</Derived> hours, about <Derived>160</Derived> days, against the model card&apos;s 120 hours on 256 GB200 GPUs. <Cite id="F02-39">GR00T N1.7 model card, computational load</Cite> The configs show the width
            multiplying into the batch: Meta&apos;s released pretraining config for one V-JEPA 2 video encoder runs 16
            nodes of 8 GPUs at 24 clips each, the paper&apos;s batch of 3,072.{' '}
            <Cite id="F03-13">V-JEPA 2 released pretraining config</Cite>
          </Box>
          <Box variant="p">
            From here every step&apos;s exchange of gradients crosses the network between servers, and its size
            follows what trains. A step that trains all of N1.7&apos;s weights makes a bf16 gradient the size of the
            weights, <Derived>6.3</Derived> GB. At the 50 Gbps of a g7e.2xlarge, <Derived>6.25</Derived> GB a second,
            moving it once takes about a second; at the 3,200 Gbps of a p5.48xlarge, about <Derived>16</Derived>{' '}
            milliseconds. Both are floors: an exchange moves at least one copy, and the eight GPUs of a p5.48xlarge
            share its 3,200 Gbps. <Cite id="F08-49">EC2 accelerated instance table, network</Cite> The faster link
            moves the same gradient <Derived>3,200 / 50 = 64</Derived> times sooner; set against the compute time of
            one step, timed on your own run, that gap says whether a second server pays.
          </Box>
          <Box variant="p">
            That traffic runs over EFA (Elastic Fabric Adapter), the EC2 network device for traffic between
            instances, which bypasses the operating system kernel and uses AWS&apos;s own reliable transport so that
            many machines can train as one. <Cite id="F08-48">EC2 docs on ENA and EFA</Cite> The small one-GPU sizes
            do not have it: g6e.4xlarge (20 Gbps) and g7e.2xlarge go without EFA, and p5.48xlarge carries it.{' '}
            <Cite id="F08-49">EC2 accelerated instance table, network</Cite> The fabric has its own dive (
            <Link href="../efa/">EFA</Link>), and so does the way a step is split across nodes and what each trained
            weight costs in bytes (<Link href="../llm-training-systems/">Training at Scale</Link>).
          </Box>
          <Box variant="p">
            The nodes have to sit close together. EFA traffic cannot cross Availability Zones (separate data-centre
            groups within an AWS Region), and HyperPod deploys a cluster in one zone by default.{' '}
            <Cite id="F09-36">SageMaker HyperPod prerequisites</Cite> AWS Batch, which runs such a job as one
            multi-node parallel job, wants every node of an EFA job in one cluster placement group, which packs
            instances close together on the network. <Cite id="F09-9">AWS Batch User Guide, EFA</Cite>
          </Box>
          <Box variant="p">
            Every step waits on every node, so one lost node stops the step everywhere, and a restart from a
            checkpoint repeats every node&apos;s work since it. <Cite id="F08-78">workload shape definitions</Cite>{' '}
            HyperPod&apos;s checkpointless training rebuilds a failed node&apos;s state from its healthy peers instead;
            AWS reports over 80% less downtime in internal studies on 16 to over 2,000 GPUs, on documented recipes
            that are language models built on NVIDIA NeMo, NVIDIA&apos;s training framework.{' '}
            <Cite id="F09-30">AWS News Blog, checkpointless and elastic training on SageMaker HyperPod</Cite>
          </Box>
          <Box variant="p">
            For PyTorch on HyperPod clusters run by EKS, managed tiered checkpointing keeps checkpoints in the
            nodes&apos; CPU memory, copies them to adjacent nodes and periodically persists them to durable storage
            such as S3. <Cite id="F09-31">SageMaker Developer Guide, managed tiered checkpointing</Cite>
          </Box>
          <Box variant="p">
            The market narrows. EC2&apos;s guide calls Spot unsuitable for workloads &quot;tightly coupled between
            instance nodes&quot;, <Cite id="F09-95">EC2 User Guide, Spot best practices</Cite> and Batch multi-node
            jobs do not run on Spot at all. <Cite id="F09-8">AWS Batch User Guide, multi-node parallel jobs</Cite>{' '}
            AWS&apos;s high-performance computing (HPC) team did run a tightly coupled simulation on Spot, under the
            Slurm job scheduler: with checkpoints and three
            injected interruptions, a job of 3 hours 25 minutes took 14% longer and cost 55% less than On-Demand.{' '}
            <Cite id="F10-58">AWS HPC blog, tightly coupled workloads on Spot</Cite>
          </Box>
          <Box variant="p">
            Reservations fit the shape: SageMaker training plans reserve P and Trainium instances for 1 to 182 days, up to 64 instances at a time,
            bookable up to 8 weeks ahead. <Cite id="F09-34">SageMaker training plans guide</Cite>
          </Box>
          <Box variant="p">
            At the top of the scale, NVIDIA reports roughly 50,000 H100 GPU-hours for GR00T N1, on up to 1,024
            GPUs.{' '}
            <Cite id="F02-34">GR00T N1 paper, training infrastructure</Cite> A fine-tune on one GPU starts from a
            checkpoint that carries that compute.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Measure peak memory and samples per second in a short run, set them against the GPU and your deadline, and the size and its market follow"
          >
            Size a job before it starts
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A short run on the GPU you would rent gives the two numbers a recipe cannot: peak memory at your batch,
            and samples per second on your code and data. If the peak fits the card, one GPU holds the job. If it
            does not, the cheaper levers come first: a smaller batch, gradient checkpointing, LoRA or a frozen
            backbone. Only when no setting fits is the job a node of eight with FSDP.
          </Box>
          <Box variant="p">
            The rate turns a recipe into GPU-hours. LeRobot&apos;s N1.7 example, 20,000 steps at batch 64, is{' '}
            <Derived>1,280,000</Derived> samples: about <Derived>1.8</Derived> GPU-hours at NVIDIA&apos;s H100 rate of
            192.57 a second, and about <Derived>6.8</Derived> at the 52 a second AWS measured on the g7e.{' '}
            <Cite id="F02-81">LeRobot GR00T N1.7 example</Cite>{' '}
            <Cite id="F02-42">Isaac-GR00T README, training throughput</Cite>{' '}
            <Cite id="F09-82">AWS post, timing table</Cite> Divide by the hours you can wait. A quotient of one is
            one GPU, up to eight is one node, and anything wider is the size of the labs&apos; pretraining.
          </Box>
          <Box variant="p">
            The width then sets the save interval and the market, which together make the job&apos;s shape (section
            20, Fifteen Workloads, Five Shapes): saves every 30 minutes or less and Spot for one GPU, durable saves and
            a reservation or accepted hours of loss for a node, and as a rule a reservation for many nodes. Section 24,
            Orchestrating Physical AI on AWS, picks the scheduler for each. Run the short job first: its samples per
            second turn a recipe into hours, and the hours into a size.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
