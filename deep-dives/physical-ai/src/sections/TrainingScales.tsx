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
          Ten training runs placed by their GPU-hours on a logarithmic axis, from a tenth of a GPU-hour to one
          hundred thousand. Five runs on one GPU take between half a GPU-hour and 10.9 GPU-hours. One of them is
          AWS&apos;s measured fine-tune of GR00T N1.7, which took 3.4 hours for 20,000 steps. Two runs on eight GPUs
          take a few hundred GPU-hours each. Three multi-node pretraining runs take between a few thousand and
          roughly 50,000 GPU-hours.
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
            description="A robot-model training job can need one GPU, one server with eight GPUs, or many servers, and you can tell which before you launch it. Start from the GPU memory the job needs and from your deadline. From those you get the number of GPUs, which tells you which network, checkpoint plan and purchase option the job needs."
          >
            15. Training at Three Scales: One GPU, One Node, Many Nodes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            What a robot-model training job needs from its hardware depends more on the size of the job than on the
            model it trains. The size of the job tells you how much GPU memory it needs, whether its servers need a
            fast network between them, and how much work is lost when a machine fails. A checkpoint is a saved copy
            of the model&apos;s weights. A training run saves checkpoints as it goes, so that after a failure it can
            resume from the last one. The work lost is the work done since that checkpoint, and that amount tells
            you whether the job can run on Spot Instances. Spot Instances are spare EC2 capacity that AWS can take
            back after a two-minute warning, and AWS sends that warning on a best-effort basis.{' '}
            <Cite id="F09-95">EC2 User Guide, Spot interruptions and best practices</Cite>
          </Box>
          <Box variant="p">
            Training jobs come in three sizes: one GPU for hours, one server with eight GPUs for a day or more, or
            many servers for days. If you have one arm and a few dozen recorded episodes, your job is a one-GPU
            job.
          </Box>
          <Box variant="p">
            The same model can need very different job sizes, as GR00T N1.7 shows. GR00T N1.7 is a VLA
            (vision-language-action model) from NVIDIA. In a VLA, a vision-language model reads the camera images
            and the instruction, and an action head attached to it outputs the arm&apos;s motions. Section 5, Vision-Language-Action Models, explains how
            these models are built.
          </Box>
          <Box variant="p">
            Fine-tuning a model means training it further on new data. Training runs in steps, and one step is one
            update of the model&apos;s weights. AWS fine-tuned GR00T N1.7 for 20,000 steps on 75 recorded episodes of
            the {ARM} arm. The fine-tune took 3.4 hours on one ml.g7e.2xlarge, an instance with a single 96 GB GPU.
            AWS measured this time in a single run and notes that the run was not a speed benchmark.{' '}
            <Cite id="F09-82">AWS post on training VLA models with LeRobot on SageMaker, timing table</Cite>
          </Box>
          <Box variant="p">
            Pretraining is the first training of a model, the run that produced the model in the first place. A node
            is one server in a training job. The pretraining of GR00T N1.7 ran on 64 nodes, each with 4 GB200 GPUs,
            for 120 hours. That is 256 GPUs x 120 hours = <Derived>30,720</Derived> GPU-hours, about{' '}
            <Derived>9,000</Derived> times the 3.4 GPU-hours of the fine-tune.{' '}
            <Cite id="F09-82">AWS post, GPU memory table and timing table</Cite> These figures come from the energy
            estimate in the model card, which does not say whether they cover one run or several.{' '}
            <Cite id="F02-39">GR00T N1.7 model card, computational load</Cite>
          </Box>
          <Box variant="p">
            Both jobs train the same architecture, but they do very different amounts of work. The fine-tune updated
            only the action head and the small layer that feeds it. The vision-language part stayed frozen, which
            means that training read those weights but did not change them.{' '}
            <Cite id="F09-82">AWS post, GPU memory table and timing table</Cite>
          </Box>
          <Box variant="p">To estimate the size of any training job, you need three pieces of information:</Box>
          <ul style={{ margin: 0, paddingLeft: 22 }}>
            <li>
              <strong>Which weights train.</strong> This tells you the minimum GPU memory the job needs, and so
              whether one GPU can hold the job at all.
            </li>
            <li>
              <strong>How many samples the job processes.</strong> A sample is one moment of a recorded episode:
              the camera images and the joint angles, paired with the actions the person took next. Divide the
              number of samples by the number that one GPU processes per second, and you get the GPU-hours.
            </li>
            <li>
              <strong>How long you can wait.</strong> The GPU-hours divided by the hours you can wait give the
              number of GPUs. That number tells you which network, checkpoint plan and purchase option the job
              needs.
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The weights a job trains tell you whether one GPU can hold it. The number of samples it processes tells you how many GPU-hours it needs, and your deadline then tells you how many GPUs to use."
          >
            Estimating GPU memory, GPU-hours and the number of GPUs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Training repeats the same step many times. In each step, the GPU takes a batch of samples and runs the
            model forward on them. It then measures how far the model&apos;s actions are from the recorded ones, and
            works backward through the model to adjust the weights that train.
          </Box>
          <Box variant="p">
            Training a weight takes more GPU memory than storing it. First, the weight needs a gradient, which is the
            direction in which the step moves the weight. Second, it needs optimiser state. The optimiser is the
            algorithm that turns gradients into weight updates, and it keeps running statistics for each weight
            from step to step. The backward pass also needs the activations of every sample in the batch.
            Activations are the intermediate results that the forward pass computes. A frozen weight needs no
            gradient and no optimiser state, because training only reads it.
          </Box>
          <Box variant="p">
            The memory that frozen weights do not use is left for the activations, which grow with the batch. So
            when you choose which weights train, you also choose how large a batch fits in GPU memory. NVIDIA tested
            this on one A6000 GPU with N1, its first GR00T release. The vision encoder is the part of the model that
            turns camera images into vectors. When only the action layers trained, batches of up to 200 fit. When the
            vision encoder trained as well, the largest batch was 16, which is <Derived>12.5</Derived> times smaller
            (200 / 16). <Cite id="F02-34">GR00T N1 paper, training infrastructure</Cite>
          </Box>
          <Box variant="p">
            Storing the weights themselves takes comparatively little memory. GR00T N1.7 has 3,144,016,000
            parameters. In bf16, a 16-bit number format, each parameter takes 2 bytes, so the weights take{' '}
            <Derived>6.3</Derived> GB. <Cite id="F02-37">GR00T N1.7 model record</Cite>{' '}
            <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite>
          </Box>
          <Box variant="p">
            A training recipe is the published configuration of a training run. It sets the model, the batch size,
            the number of steps and which weights train. The backbone of a VLA is the vision-language model it is
            built on. For the weights, a recipe uses one of three settings:
          </Box>
          <ul style={{ margin: 0, paddingLeft: 22 }}>
            <li>
              <strong>Full fine-tuning</strong> trains every weight of the model.
            </li>
            <li>
              <strong>LoRA (low-rank adaptation)</strong> freezes the original weights and trains small extra
              matrices that are added next to them.
            </li>
            <li>
              <strong>Frozen backbone</strong> leaves the vision-language model unchanged and trains only the action
              head and the layer that feeds it.
            </li>
          </ul>
          <Box variant="p">
            The memory difference between these settings is large. openpi is Physical Intelligence&apos;s code for
            its pi0 models. It asks for more than 22.5 GB of GPU memory for a LoRA fine-tune and more than 70 GB for
            a full fine-tune. <Cite id="F02-54">openpi README, requirements</Cite>
          </Box>
          <Box variant="p">
            You can turn those two figures into a rough memory cost per parameter. Treat the gap between them as the
            extra memory needed to make every weight trainable. pi0 has 3 billion parameters, so the gap comes to
            about <Derived>(70 - 22.5) / 3 = 16</Derived> bytes per parameter, on top of the 2 bytes that store each
            one. <Cite id="F09-83">AWS post on fine-tuning pi0 on SageMaker HyperPod</Cite> At that rate, each
            parameter that trains costs about <Derived>16 + 2 = 18</Derived> bytes in all. GR00T N1.7 has <Derived>3.14</Derived>
            billion parameters, so training every weight needs about <Derived>3.14 x 18 = 57</Derived> GB before the
            activations of the batch are counted. That estimate is in line with NVIDIA&apos;s advice to use 80 GB
            or more per GPU when the language model or the vision encoder of N1.7 trains.{' '}
            <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite>
          </Box>
          <Box variant="p">
            A memory figure depends on the code and the batch size as much as on the model. NVIDIA&apos;s default
            recipe for GR00T N1.7 keeps the backbone frozen and stays under about 35 GB per GPU, and NVIDIA sets a
            minimum of one 40 GB GPU. <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite> AWS ran the same
            setting with LeRobot, and its memory use peaked at 41.5 GB at a batch size of 32. So at that batch size,
            the LeRobot run does not fit on a 40 GB GPU. <Cite id="F09-82">AWS post, GPU memory table</Cite>
          </Box>
          <Box variant="p">
            When a job does not fit, gradient checkpointing is one way to reduce its memory. Gradient checkpointing
            recomputes the activations during the backward pass instead of storing them, so it trades extra compute
            for less memory. LeRobot&apos;s pi0 example turns it on to fit a full fine-tune on one GPU, because it
            &quot;reduces memory usage significantly&quot;. <Cite id="F02-80">LeRobot pi0 documentation</Cite>
          </Box>
          <Box variant="p">
            In LeRobot, you choose between the three settings with command-line flags, and in the past a flag has
            failed without warning. Before LeRobot v0.7.0, setting <code>--policy.use_peft=true</code> on its own still ran a
            full fine-tune. Version 0.7.0 has one LoRA switch that works for every policy,{' '}
            <code>--peft.method_type=LORA</code>.{' '}
            <Cite id="F02-83">LeRobot v0.7.0 PEFT documentation and release</Cite> So before you trust a memory
            figure for a run, confirm which weights the run actually trains.
          </Box>
          <Box variant="p">
            To estimate the GPU-hours, start from the number of samples. Multiply the steps by the batch size to get
            the samples, then divide by the number of samples per second that one GPU sustains. When you compare two
            runs, compare them by samples, not by steps, because their batch sizes can differ. AWS ran GR00T N1.7
            twice, both times for 20,000 steps:
          </Box>
          <ul style={{ margin: 0, paddingLeft: 22 }}>
            <li>
              <strong>ml.g7e.2xlarge, batch size 32.</strong> The run processed 640,000 samples in 3.4 hours, about{' '}
              <Derived>52</Derived> samples per second.
            </li>
            <li>
              <strong>ml.g6e.2xlarge, batch size 16.</strong> The run processed 320,000 samples in 4.0 hours, about{' '}
              <Derived>22</Derived> samples per second.{' '}
              <Cite id="F09-82">AWS post, timing table</Cite>
            </li>
          </ul>
          <Box variant="p">
            Counted by steps, the g6e run looks <Derived>4.0 / 3.4 = 1.2</Derived> times slower. Counted by samples,
            it is <Derived>52 / 22 = 2.4</Derived> times slower.
          </Box>
          <Box variant="p">
            Measure the samples per second with your own code, because a published rate can be far from what your
            run achieves. NVIDIA lists 131.33 samples per second for GR00T N1.7 on an RTX Pro 6000 Blackwell. That
            is <Derived>2.5</Derived> times the 52 samples per second of AWS&apos;s LeRobot run on the g7e, whose GPU
            is the RTX PRO 6000 Blackwell Server Edition. The two figures come from different training code.{' '}
            <Cite id="F02-42">Isaac-GR00T README, training throughput</Cite>{' '}
            <Cite id="F08-53">AWS announcement of G7e instances</Cite>{' '}
            <Cite id="F09-82">AWS post, timing table</Cite> A plan based on NVIDIA&apos;s rate would have been off
            by that factor of <Derived>2.5</Derived>.
          </Box>
          <Box variant="p">
            To find how many GPUs a job needs, divide its GPU-hours by the wall-clock hours you can wait.
            Data-parallel training spreads the work over several GPUs. Each GPU keeps a full copy of the model and
            works through its own share of every batch. At the end of each step, the GPUs combine their gradients
            into one update. So the batch of one update, called the global batch, is the per-GPU batch times the
            number of GPUs. If you add GPUs, the global batch grows, unless you shrink the per-GPU batch to match.
          </Box>
          <Box variant="p">
            The number of GPUs is a choice you make for the run, not a property of the model. SmolVLA&apos;s authors
            pretrained their small VLA on 4 GPUs so that a batch of 256 would fit, and they say that the model trains
            easily on one GPU. <Cite id="F02-59">SmolVLA paper, section 4</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Published robot-model training runs range from half a GPU-hour to roughly 50,000 GPU-hours. You can use them to place your own job, and to judge its number of GPUs from its hours and its memory rather than from the name of its training stage."
          >
            Published training runs compared in GPU-hours
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            To compare a 30-minute LoRA fine-tune with a lab&apos;s pretraining run, you can put both on one
            measure, the GPU-hour:
          </Box>
          <Formula
            name="GPU-hours"
            tex={String.raw`\begin{aligned} &\text{GPU-hours} = \text{number of GPUs} \\ &\quad \times\ \text{hours of wall-clock time} \end{aligned}`}
          />
          <Box variant="p">
            The number of GPUs tells you whether the job needs a network between servers. The number of hours tells
            you how many checkpoints the job needs to save so that it survives the loss of a machine.
          </Box>
          <Figure
            cites="F02-46 F01-90 F09-82 F02-63 F04-70 F02-28 F02-71 F02-39 F02-34"
            caption={
              <>
                Each row is one published training run, placed by its GPU-hours on a logarithmic scale. Under the
                name of each run, the row shows its GPUs x hours and who published the figure. The blue point is
                AWS&apos;s fine-tune of GR00T N1.7. A GPU-hour on an RTX 4090 and a GPU-hour on a GB200 are different
                amounts of work, so compare positions only to the nearest power of ten.
              </>
            }
          >
            <GpuHoursChart />
          </Figure>
          <Box variant="p">
            The name of a training stage does not tell you how many GPUs the stage needs. Post-training is any
            training that starts from a pretrained checkpoint.
            AWS&apos;s fine-tune of GR00T N1.7 is post-training, and it ran on one GPU.{' '}
            <Cite id="F09-82">AWS post, timing table</Cite>
          </Box>
          <Box variant="p">
            Meta&apos;s V-JEPA 2-AC is also post-training, but it is a multi-node job. V-JEPA 2-AC is a model that
            predicts how a scene changes when the arm acts. Meta built it on its V-JEPA 2 video encoder, which
            section 7, JEPA, describes. Its post-training used under 62 hours of robot video, with the encoder
            frozen. <Cite id="F03-1">V-JEPA 2 paper, abstract</Cite> Even so, its released configuration asks for 4
            nodes of 8 GPUs with 8 clips per GPU, a batch of 4 x 8 x 8 = 256.{' '}
            <Cite id="F03-21">V-JEPA 2 paper and released config, action-conditioned training</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Choose one GPU with enough memory to train your chosen weights at your batch size, and expect the run to take hours. If the job saves a checkpoint often enough, losing a Spot Instance costs only minutes of work."
          >
            One GPU: hours of training that can run on Spot Instances
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The fine-tune that follows a recording session is a one-GPU job. In that job, a model learns one task
            from tens of episodes. The model either starts from a pretrained checkpoint, or it is a small policy
            that starts from random weights. ACT (Action Chunking with Transformers) is a policy of the second
            kind. It predicts a chunk of actions at a time, and
            section 4, Learning From Demonstrations, explains how it works. ACT trains all of its roughly 80M
            parameters from scratch. Its authors trained it in about 5 hours on one RTX 2080 Ti with 11 GB of
            memory. <Cite id="F02-9">ACT paper, section IV-C</Cite>
          </Box>
          <Box variant="p">
            LeRobot&apos;s hardware guide gives typical training times for about 50 episodes of 30 seconds each. An
            epoch is one pass of training over every frame of the dataset. For 5 epochs, at a batch size of 8 for
            ACT and 4 for pi0, the guide puts ACT at 30 to 60 minutes on one RTX 4090 or RTX 3090. It puts pi0 or
            pi0.5 at 4 to 8 hours on one A100 with 40 GB. These figures are indicative, and real runs can differ
            from them by up to 50% in either direction. LeRobot&apos;s recorder defaults to 60 seconds per episode,
            and at that length the same 50 episodes are 90,000 frames, so each training time doubles.{' '}
            <Cite id="F01-90">LeRobot hardware guide, memory by policy group and common scenarios</Cite>
          </Box>
          <Box variant="p">
            The GPU reaches those times only if the CPU prepares the data fast enough to keep it busy. LeRobot
            decodes the episodes&apos; video and augments the images on CPU cores. This work runs in dataloader
            workers, which are the CPU processes that prepare each batch for the GPU. So the CPU cores on the
            instance limit how many frames per second the GPU can train on.{' '}
            <Cite id="F05-107">LeRobot decode path and the EC2 CPU table</Cite>
          </Box>
          <Box variant="p">
            EC2 counts processor capacity in vCPUs (virtual CPUs). Instance sizes with one GPU come with between 4
            vCPUs, on a g6e.xlarge, and 64 vCPUs, on a g6e.16xlarge.{' '}
            <Cite id="F08-57">EC2 accelerated instance table, vCPUs per GPU</Cite> So when you choose a one-GPU
            instance size, you also choose its number of CPU cores. Section 10, Processing and Curating, works out
            how many workers a batch needs.
          </Box>
          <Box variant="p">
            The checkpoint that a run resumes from holds more than the weights. For GR00T N1.7, it holds all{' '}
            <Derived>6.3</Derived> GB of the model&apos;s weights, plus the optimiser state of the weights that
            train. If a machine is lost, you lose the work done since the last checkpoint, so the most you can lose
            is the work of one checkpoint interval.
          </Box>
          <Box variant="p">
            AWS&apos;s walkthrough of GR00T on AWS Batch saves a checkpoint every 2,000 of its 6,000 steps. The run
            &quot;usually takes up to 2 hours on a g6e.4xlarge instance&quot;. So a machine lost just before a save
            costs up to a third of the run, which is at most <Derived>40</Derived> minutes.{' '}
            <Cite id="F09-114">AWS embodied AI series, part 1</Cite>
          </Box>
          <Box variant="p">
            When only minutes of work are at risk, the job can run on Spot Instances. The AWS Batch guide advises
            splitting or checkpointing Spot work into parts of 30 minutes or less.{' '}
            <Cite id="F09-11">AWS Batch User Guide, Spot best practices</Cite> With the walkthrough&apos;s run time
            of up to 2 hours, a checkpoint every <Derived>6000 x 30 / 120 = 1,500</Derived> steps meets that
            advice.
          </Box>
          <Box variant="p">
            SageMaker Training Jobs start instances for one training job and shut them down when the job ends.
            AWS&apos;s LeRobot post runs its Training Jobs on Spot Instances with the <code>--spot</code> option. It
            also passes a priority list of instance types, so that the job starts on the first type that has
            capacity. <Cite id="F09-81">AWS post on training VLA models with LeRobot on SageMaker</Cite>{' '}
            <Cite id="F09-82">AWS post, instance selection</Cite>
          </Box>
          <Box variant="p">
            Underneath, this option uses SageMaker&apos;s managed Spot training. Managed Spot training needs{' '}
            <code>EnableManagedSpotTraining</code> and a <code>MaxWaitTimeInSeconds</code> larger than{' '}
            <code>MaxRuntimeInSeconds</code>. SageMaker copies checkpoints from a local path to S3, and after an
            interruption it copies them back, so the job resumes from the last checkpoint. Managed Spot training does
            not fall back to On-Demand, the purchase option in which AWS does not take the instance back. If no Spot
            capacity is available, the job waits until the maximum wait time runs out, and then it stops.{' '}
            <Cite id="F10-536">SageMaker Developer Guide, managed Spot training</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Move to eight GPUs when one GPU would take weeks, or when one GPU cannot hold the weights, gradients and optimiser state. Save checkpoints to storage outside the machine, and plan for times when no eight-GPU instance is available."
          >
            One node: training on eight GPUs in one server
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Here, a node means one EC2 instance with eight GPUs. On one node, the exchange of gradients between the
            eight GPUs never leaves the machine, and eight GPUs is the largest job size for which that is true.
          </Box>
          <Box variant="p">
            One reason to move a job to a node is time. The authors of pi0-FAST, a VLA with 3 billion parameters,
            report that they trained it for about 4 days on 8 H100 GPUs. That is 8 x 96 = <Derived>768</Derived>{' '}
            GPU-hours, which would take <Derived>768 / 24 = 32</Derived> days on one GPU.{' '}
            <Cite id="F02-28">pi0-FAST paper, appendix on DROID training</Cite>
          </Box>
          <Box variant="p">
            At this size, you cannot choose the number of CPU cores separately from the GPUs. Most eight-GPU instance
            sizes come with 24 vCPUs per GPU, which is 12 physical cores per GPU, and the dataloader workers have to
            keep the GPUs busy with those cores.{' '}
            <Cite id="F08-57">EC2 accelerated instance table, vCPUs per GPU</Cite>
          </Box>
          <Box variant="p">
            Another reason is memory. When a VLA&apos;s backbone trains, its weights, gradients and optimiser state
            can be too large for one GPU. In that case you use FSDP (fully sharded data parallel). FSDP is a form of
            data-parallel training that splits the weights, gradients and optimiser state across the GPUs, instead
            of keeping a full copy on each one. AWS&apos;s example fine-tunes pi0 with FSDP across the eight H100
            GPUs of one ml.p5.48xlarge. <Cite id="F09-83">AWS post on fine-tuning pi0 on SageMaker HyperPod</Cite>{' '}
            openpi&apos;s PyTorch port does not support FSDP or LoRA, so for those you need its JAX code.{' '}
            <Cite id="F02-55">openpi README, PyTorch support</Cite>
          </Box>
          <Box variant="p">
            If a node is lost, you lose the work of all eight GPUs since the last checkpoint that survived the loss.
            So every lost hour on a node costs eight GPU-hours. An AWS sample post-trains OpenVLA-OFT, a VLA with 7
            billion parameters, with RL (reinforcement learning). In RL, the policy improves from scored attempts,
            here in a simulator. Section 8, Reinforcement Learning for Robots, covers RL. The sample runs on one
            p5en.48xlarge with 8 H200 GPUs, and its measured run trained for 31.6 hours.{' '}
            <Cite id="F04-70">AWS sample for robot foundation model simulation, results</Cite>
          </Box>
          <Box variant="p">
            An earlier run of the same sample shows why checkpoints have to leave the machine. That run used 8 H100
            GPUs and took about 27 minutes per step. It saved checkpoints at steps 25, 50 and 75, about{' '}
            <Derived>11</Derived> hours apart (<Derived>25 x 27 = 675</Derived> minutes). The run hit its 40-hour
            wall-clock limit at step 83 of 100. The timeout ended the script before the latest checkpoint was
            uploaded, and the instance terminated with the checkpoints of steps 25, 50 and 75 still on its local
            disk. <Cite id="F04-71">AWS sample, earlier run</Cite>
          </Box>
          <Box variant="p">
            None of the three checkpoints had been copied off the machine, so the run kept nothing. It lost about 38
            hours of training on eight GPUs, which is <Derived>8 x 38 = 304</Derived> GPU-hours. Counted over all 40
            hours that the instance ran, the loss was <Derived>8 x 40 = 320</Derived> GPU-hours. A checkpoint on the
            machine&apos;s local disk is lost together with the machine.
          </Box>
          <Box variant="p">
            Amazon EKS (Elastic Kubernetes Service) is AWS&apos;s managed Kubernetes service. For large models, its
            best-practices guide suggests two levels of checkpoints. Fast local checkpoints every 5 to 30 minutes
            recover from transient faults, and durable checkpoints every hour recover from major failures.{' '}
            <Cite id="F10-535">EKS Best Practices Guide, checkpointing long training jobs</Cite>
          </Box>
          <Box variant="p">
            SageMaker HyperPod is AWS&apos;s persistent training cluster. FSx for Lustre is AWS&apos;s managed Lustre
            file system, which many processes can read in parallel. AWS&apos;s pi0 example on HyperPod keeps its data
            and checkpoints on FSx for Lustre and caches the container image, so the next job starts at once. A
            SageMaker Training Job, by comparison, has a &quot;~5 min cold start&quot;.{' '}
            <Cite id="F09-83">AWS post on fine-tuning pi0 on SageMaker HyperPod</Cite>
          </Box>
          <Box variant="p">
            Instances of this size are not always available. On the evening of 31 October 2026, none of the
            On-Demand instances with 8 x 80 GB GPUs on the sample&apos;s list was available in three Regions. The
            run fell back to Spot Instances, where an interruption costs as much as losing the node.{' '}
            <Cite id="F04-71">AWS sample, capacity and the Spot fallback</Cite>
          </Box>
          <Box variant="p">
            To make sure a node is available when you need it, you can reserve it. Capacity Blocks for ML reserve
            EC2 P instances and Trainium instances for a set period. P instances carry data-centre GPUs such as the
            H100, H200 and B200. Capacity Blocks do not offer any instance of the G family, which carries GPUs such
            as the L40S. <Cite id="F09-91">EC2 User Guide, Capacity Blocks</Cite>
          </Box>
          <Box variant="p">
            SageMaker training plans are another way to reserve training capacity, and they leave out the G family
            too. So neither a Capacity Block nor a training plan can reserve the G instances that one-GPU jobs use,
            but both can reserve an eight-GPU P node.{' '}
            <Cite id="F09-35">SageMaker training plans, eligible instance types</Cite> Telexistence booked one
            p6-b200.48xlarge with Capacity Blocks and fine-tuned DreamZero on that single node. DreamZero is a model
            with 14 billion parameters that predicts video and actions.{' '}
            <Cite id="F09-88">AWS post on Telexistence&apos;s DreamZero experiment</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pretraining is spread over hundreds of GPUs so that it finishes in days instead of months. That requires a fast network between the servers, all nodes in one Availability Zone, a way to recover when one node fails, and reserved capacity."
          >
            Many nodes: pretraining across hundreds of GPUs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Pretraining runs on many servers because one server would take far too long. The pretraining of GR00T
            N1.7 took 30,720 GPU-hours. On one node of eight GPUs, that would be <Derived>3,840</Derived> hours, about{' '}
            <Derived>160</Derived> days. The model card reports 120 hours on 256 GB200 GPUs instead.{' '}
            <Cite id="F02-39">GR00T N1.7 model card, computational load</Cite>
          </Box>
          <Box variant="p">
            As with data-parallel training on one node, more GPUs mean a larger global batch. Meta&apos;s released
            pretraining configuration for one V-JEPA 2 video encoder runs on 16 nodes of 8 GPUs with 24 clips per
            GPU. That gives the batch of 3,072 clips reported in the paper.{' '}
            <Cite id="F03-13">V-JEPA 2 released pretraining config</Cite>
          </Box>
          <Box variant="p">
            With more than one server, every step&apos;s exchange of gradients crosses the network between the
            servers. The amount of data depends on which weights train. If a step trains all of GR00T N1.7&apos;s
            weights, the gradient in bf16 is the same size as the weights, <Derived>6.3</Derived> GB. A g7e.2xlarge
            has 50 Gbps of network bandwidth, which is <Derived>6.25</Derived> GB per second, so moving the gradient
            once takes about one second. A p5.48xlarge has 3,200 Gbps, so moving it once takes about{' '}
            <Derived>16</Derived> milliseconds. Both times are minimums, because an exchange moves at least one copy
            of the gradient, and the eight GPUs of a p5.48xlarge share its 3,200 Gbps.{' '}
            <Cite id="F08-49">EC2 accelerated instance table, network</Cite>
          </Box>
          <Box variant="p">
            The faster network moves the same gradient <Derived>3,200 / 50 = 64</Derived> times sooner. To decide
            whether a second server pays off, compare that transfer time with the compute time of one step, measured
            on your own run.
          </Box>
          <Box variant="p">
            On AWS, this traffic runs over EFA (Elastic Fabric Adapter). EFA is the EC2 network device for traffic
            between instances. It bypasses the operating system kernel and uses AWS&apos;s own reliable transport, so
            that many machines can train as one. <Cite id="F08-48">EC2 docs on ENA and EFA</Cite> The small one-GPU
            instance sizes do not have EFA: the g6e.4xlarge (20 Gbps) and the g7e.2xlarge have none. The
            p5.48xlarge has EFA. <Cite id="F08-49">EC2 accelerated instance table, network</Cite> EFA has its own deep dive,{' '}
            <Link href="../efa/">EFA</Link>. Another deep dive,{' '}
            <Link href="../llm-training-systems/">Training at Scale</Link>, covers how a step is split across nodes
            and how many bytes each trained weight costs.
          </Box>
          <Box variant="p">
            The nodes also have to be close together on the network. An Availability Zone is one of the separate
            groups of data centres inside an AWS Region. EFA traffic cannot cross from one Availability Zone to
            another, and HyperPod deploys a cluster in one zone by default.{' '}
            <Cite id="F09-36">SageMaker HyperPod prerequisites</Cite> AWS Batch runs such a job as one multi-node
            parallel job. It requires every node of an EFA job to be in one cluster placement group, which is an EC2
            setting that packs instances close together on the network.{' '}
            <Cite id="F09-9">AWS Batch User Guide, EFA</Cite>
          </Box>
          <Box variant="p">
            In multi-node training, every step waits for every node. So if one node is lost, the step stops on all
            nodes, and a restart from a checkpoint repeats the work of every node since that checkpoint.{' '}
            <Cite id="F08-78">workload type definitions</Cite>
          </Box>
          <Box variant="p">
            HyperPod&apos;s checkpointless training rebuilds the failed node&apos;s training state from its healthy
            peers instead of restarting from a checkpoint. AWS reports over 80% less downtime in internal studies on
            16 to over 2,000 GPUs. The documented recipes for this feature are language models built on NVIDIA NeMo,
            NVIDIA&apos;s training framework.{' '}
            <Cite id="F09-30">AWS News Blog, checkpointless and elastic training on SageMaker HyperPod</Cite>
          </Box>
          <Box variant="p">
            HyperPod also offers managed tiered checkpointing for PyTorch on clusters that EKS orchestrates. It keeps
            checkpoints in the nodes&apos; CPU memory, copies them to adjacent nodes, and periodically saves them to
            durable storage such as S3.{' '}
            <Cite id="F09-31">SageMaker Developer Guide, managed tiered checkpointing</Cite>
          </Box>
          <Box variant="p">
            At this size, fewer purchase options fit the job. The EC2 guide lists workloads that are &quot;tightly
            coupled between instance nodes&quot; as not suitable for Spot.{' '}
            <Cite id="F09-95">EC2 User Guide, Spot best practices</Cite> AWS Batch does not run multi-node jobs on
            Spot at all. <Cite id="F09-8">AWS Batch User Guide, multi-node parallel jobs</Cite>
          </Box>
          <Box variant="p">
            AWS&apos;s high-performance computing (HPC) team did run a tightly coupled simulation on Spot Instances,
            under the Slurm job scheduler. With On-Demand Instances, the simulation took 3 hours 25 minutes. The team
            then ran it on Spot Instances, saving checkpoints and injecting three interruptions. It reports that the
            Spot run took 14% longer and cost 55% less than the On-Demand run.{' '}
            <Cite id="F10-58">AWS HPC blog, tightly coupled workloads on Spot</Cite>
          </Box>
          <Box variant="p">
            Reserved capacity fits multi-node training. SageMaker training plans reserve P and Trainium instances for
            1 to 182 days, up to 64 instances at a time, and you can book them up to 8 weeks ahead.{' '}
            <Cite id="F09-34">SageMaker training plans guide</Cite>
          </Box>
          <Box variant="p">
            At the top of the scale, NVIDIA reports roughly 50,000 H100 GPU-hours for the pretraining of GR00T N1, on
            up to 1,024 GPUs. <Cite id="F02-34">GR00T N1 paper, training infrastructure</Cite> When you fine-tune a
            model like this on one GPU, you start from a checkpoint that already carries the result of all that
            compute.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Run the job briefly to measure its peak memory and its samples per second. Compare them with the memory of the GPU and with your deadline to find the size of the job and the purchase option that fits it."
          >
            Sizing a job before it starts
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A short test run on the GPU you plan to rent gives you two numbers that a recipe cannot: the peak memory
            at your batch size, and the samples per second with your code and data. If the peak memory fits on the
            GPU, one GPU can hold the job. If it does not fit, try the cheaper options first: a smaller batch,
            gradient checkpointing, LoRA or a frozen backbone. Only when none of these settings fits does the job
            need a node of eight GPUs with FSDP.
          </Box>
          <Box variant="p">
            The measured rate turns a recipe into GPU-hours. LeRobot&apos;s example for GR00T N1.7 runs 20,000 steps
            at a batch size of 64, which is <Derived>1,280,000</Derived> samples. At NVIDIA&apos;s H100 rate of
            192.57 samples per second, that takes about <Derived>1.8</Derived> GPU-hours. At the 52 samples per
            second that AWS measured on the g7e, it takes about <Derived>6.8</Derived> GPU-hours.{' '}
            <Cite id="F02-81">LeRobot GR00T N1.7 example</Cite>{' '}
            <Cite id="F02-42">Isaac-GR00T README, training throughput</Cite>{' '}
            <Cite id="F09-82">AWS post, timing table</Cite>
          </Box>
          <Box variant="p">
            Then divide the GPU-hours by the hours you can wait. The result is the number of GPUs the job needs. If
            the result is one or less, one GPU can finish the job in time. If the result is up to eight, the job
            needs one node. If it is more than eight, the job needs many nodes, which is the scale at which labs
            pretrain their models.
          </Box>
          <Box variant="p">
            Once you know the number of GPUs, you know the job&apos;s workload type: how long it runs, whether its
            parts exchange data, and whether it survives an interruption. Section 20, The Fifteen Workloads, defines
            the workload types. The workload type in turn tells you the checkpoint interval and the purchase option:
          </Box>
          <ul style={{ margin: 0, paddingLeft: 22 }}>
            <li>
              <strong>One GPU.</strong> Save a checkpoint every 30 minutes or less, and run the job on Spot
              Instances.
            </li>
            <li>
              <strong>One node.</strong> Save durable checkpoints off the machine. Either reserve the capacity or
              accept that an interruption can cost hours of work.
            </li>
            <li>
              <strong>Many nodes.</strong> As a rule, reserve the capacity.
            </li>
          </ul>
          <Box variant="p">
            Section 24, Orchestrating Physical AI on AWS, explains which scheduler to use for one-GPU jobs and for
            many-node jobs, and quotes AWS&apos;s rule for which service runs a training job. Start with the short
            test run. With its samples per second, you turn a recipe into GPU-hours, and from the GPU-hours and your
            deadline you get the size of the job.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
