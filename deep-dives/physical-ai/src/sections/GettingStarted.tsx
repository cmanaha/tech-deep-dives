import { useState } from 'react';
import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import SegmentedControl from '@cloudscape-design/components/segmented-control';
import { Cite, Derived } from '../components/Cite';
import { Figure } from '../components/Figure';
import { ARM, TASK_STORY } from '../lib/task';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const NEUTRAL_INK = '#5f6b7a';
const EMPHASIS = '#0972d3';
const ON_ROUTE_FILL = '#f2f8fd';

const LIST = { margin: 0, paddingLeft: 22 };

/**
 * A section number of this dive, or a count of its sections. It is navigation, with no source
 * behind it, so the citation check skips it (the same marker section 30 uses for its lists).
 */
function Nav({ children }: { children: ReactNode }) {
  return <span data-num="nav">{children}</span>;
}

/* ------------------------------------------------------------------------ */
/* Diagram 2.1: the sections in eight parts, with the three reading routes  */
/* ------------------------------------------------------------------------ */

type RouteId = 'world' | 'pipeline' | 'compute';

const ROUTES: { id: RouteId; tag: string; text: string; sections: number[] }[] = [
  { id: 'world', tag: 'W', text: 'World models', sections: [1, 2, 3, 4, 6, 7, 16, 22] },
  { id: 'pipeline', tag: 'P', text: 'Pipeline', sections: [1, 2, 3, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] },
  { id: 'compute', tag: 'C', text: 'Compute', sections: [1, 2, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] },
];

/** Short labels for the grid; the full titles are in the table under the figure. */
const SHORT: Record<number, string> = {
  1: 'Fifteen Jobs',
  2: 'Getting Started',
  3: 'Robot as a Computer',
  4: 'Demonstrations',
  5: 'Vision-Language-Action',
  6: 'World Models',
  7: 'JEPA',
  8: 'Reinforcement Learning',
  9: 'Collecting Data',
  10: 'Processing, Curating',
  11: 'Augmentation',
  12: 'Physics Simulation',
  13: 'Rendering',
  14: 'Sim-to-Real',
  15: 'Training Scales',
  16: 'Evaluation',
  17: 'On the Robot',
  18: 'The Fleet',
  19: 'Agents',
  20: 'Workloads',
  21: 'Reading a Machine',
  22: 'Our Measurements',
  23: 'Price-Performance',
  24: 'Orchestrating on AWS',
  25: 'AWS Batch',
  26: 'Parallel Computing',
  27: 'SageMaker HyperPod',
  28: 'Amazon EKS',
  29: 'Choosing',
  30: 'Glossary and Sources',
};

const PARTS: { name: string; sections: number[] }[] = [
  { name: 'Introduction', sections: [1, 2, 3] },
  { name: 'The models', sections: [4, 5, 6, 7, 8] },
  { name: 'The data', sections: [9, 10, 11] },
  { name: 'Simulation', sections: [12, 13, 14] },
  { name: 'Training and evaluation', sections: [15, 16] },
  { name: 'The edge', sections: [17, 18, 19] },
  { name: 'The compute', sections: [20, 21, 22, 23] },
  { name: 'AWS', sections: [24, 25, 26, 27, 28, 29] },
  { name: 'Reference', sections: [30] },
];

const CELL_W = 184;
const CELL_H = 26;
const ROW_H = 30;
const PART_HEAD = 18;
const PART_GAP = 8;
const COL_X = [12, 204];
const TAG_W = 15;

interface Placed {
  n: number;
  x: number;
  y: number;
}

/** Two cells per row, parts stacked top to bottom. Ends at y = 814 for the nine parts above. */
function layout(): { heads: { name: string; y: number }[]; cells: Placed[] } {
  const heads: { name: string; y: number }[] = [];
  const cells: Placed[] = [];
  let y = 40;
  for (const part of PARTS) {
    heads.push({ name: part.name, y: y + 13 });
    y += PART_HEAD;
    part.sections.forEach((n, i) => {
      cells.push({ n, x: COL_X[i % 2], y: y + Math.floor(i / 2) * ROW_H });
    });
    y += Math.ceil(part.sections.length / 2) * ROW_H + PART_GAP;
  }
  return { heads, cells };
}

function RouteGrid({ selected }: { selected: RouteId }) {
  const { heads, cells } = layout();
  const route = ROUTES.find((r) => r.id === selected) ?? ROUTES[0];
  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <svg
        viewBox="0 0 400 816"
        role="img"
        aria-labelledby="getting-started-routes-title"
        style={{ width: '100%', height: 'auto' }}
        data-num="nav"
      >
        <title id="getting-started-routes-title">The sections of the dive in nine parts, with three reading routes</title>
        <desc>
          Each section of the dive is shown as a cell, grouped under its part and numbered in reading order. A cell
          shows the letter W when the section is on the world models route, P when it is on the pipeline route and C
          when it is on the compute route. The cells of the selected route, {route.text}, are outlined: sections{' '}
          {route.sections.join(', ')}.
        </desc>
        <rect x="0" y="0" width="400" height="816" fill="#fbfbfd" />

        {/* legend */}
        {ROUTES.map((r, i) => {
          const x = [12, 160, 274][i];
          const on = r.id === selected;
          return (
            <g key={r.id}>
              <rect x={x} y="10" width={TAG_W} height="16" rx="3" fill={on ? EMPHASIS : '#ffffff'} stroke={on ? EMPHASIS : NEUTRAL_INK} strokeWidth="1" />
              <text x={x + TAG_W / 2} y="22.5" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill={on ? '#ffffff' : NEUTRAL_INK}>
                {r.tag}
              </text>
              <text x={x + TAG_W + 6} y="22.5" fontFamily="sans-serif" fontSize="12" fontWeight={on ? 'bold' : 'normal'} fill={INK}>
                {r.text} route
              </text>
            </g>
          );
        })}

        {heads.map((h) => (
          <text key={h.name} x="12" y={h.y} fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill={INK}>
            {h.name}
          </text>
        ))}

        {cells.map((c) => {
          const onRoute = route.sections.includes(c.n);
          const tags = ROUTES.filter((r) => r.sections.includes(c.n));
          return (
            <g key={c.n}>
              <rect
                x={c.x}
                y={c.y}
                width={CELL_W}
                height={CELL_H}
                rx="4"
                fill={onRoute ? ON_ROUTE_FILL : '#ffffff'}
                stroke={onRoute ? EMPHASIS : NEUTRAL_INK}
                strokeWidth={onRoute ? 2.5 : 1}
              />
              <text
                x={c.x + 8}
                y={c.y + 17.5}
                fontFamily="sans-serif"
                fontSize="12"
                fontWeight={onRoute ? 'bold' : 'normal'}
                fill={onRoute ? INK : NEUTRAL_INK}
              >
                {c.n} {SHORT[c.n]}
              </text>
              {tags.map((r, i) => {
                const tx = c.x + CELL_W - 6 - (tags.length - i) * (TAG_W + 2) + 2;
                const on = r.id === selected;
                return (
                  <g key={r.id}>
                    <rect x={tx} y={c.y + 5} width={TAG_W} height="16" rx="3" fill={on ? EMPHASIS : '#ffffff'} stroke={on ? EMPHASIS : NEUTRAL_INK} strokeWidth="1" />
                    <text x={tx + TAG_W / 2} y={c.y + 17.5} textAnchor="middle" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill={on ? '#ffffff' : NEUTRAL_INK}>
                      {r.tag}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function RouteMap() {
  const [selected, setSelected] = useState<RouteId>('world');
  return (
    <SpaceBetween size="s">
      <SegmentedControl
        selectedId={selected}
        onChange={({ detail }) => setSelected(detail.selectedId as RouteId)}
        label="Reading route to highlight"
        options={ROUTES.map((r) => ({ id: r.id, text: r.text }))}
      />
      <Figure caption={<>Each cell is one section of the dive. Choose a route above the map to outline the sections it passes through.</>}>
        <RouteGrid selected={selected} />
      </Figure>
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function GettingStarted() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Choosing hardware for a robot differs from choosing it for a language model in four ways. This section explains each one, so that you can size the computer on the robot and the GPU that trains its model, budget the recording and processing of a robot dataset, and tell whether a training job is held back by its GPU or by its CPU cores. If you have a single question, three shorter reading routes at the end take you to the sections you need."
          >
            2. Getting Started: The Key Ideas and Where to Begin
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Experience with language models is a useful start, but on four points it suggests the wrong hardware for
            a robot. The example arm is an {ARM}, a small desktop arm with six motors and two cameras, and its task is
            to {TASK_STORY}. The model that controls the arm is called a policy. LeRobot, an open-source library for
            robot learning, is used to record the arm&apos;s data and to train and run its policy.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>The policy has a deadline.</strong> The arm expects a new motor target every 33.3 ms, and the
              policy has to keep up with that deadline. So you size the computer that runs the policy in milliseconds
              per call. A model that serves requests in a data centre is usually sized by its throughput instead.{' '}
              <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>
            </li>
            <li>
              <strong>Robot training data is almost all video.</strong> Before compression, the camera video takes
              38,400 times as many bytes as the joint angles and motor targets. So the data pipeline is a video
              pipeline. LeRobot stores the video in a compressed format called AV1 (AOMedia Video 1) and, by default,
              decodes it on CPU cores, so the pipeline&apos;s compute cost is CPU time.{' '}
              <Cite id="F01-86">the raw data rate, from the camera settings</Cite>
            </li>
            <li>
              <strong>The model is sized twice.</strong> You size it once for the GPU that trains it and once for the
              small onboard computer that runs it next to the arm. NVIDIA&apos;s large robot model is called GR00T
              N1.7. One call of it takes a median of 22.9 ms on an H100 data-centre GPU and 149.0 ms on a Jetson Orin,
              which is an NVIDIA onboard computer for robots. Both figures are for the model compiled with TensorRT,
              which is NVIDIA&apos;s inference compiler. The Jetson Orin figure is longer than the arm&apos;s deadline,
              and the arm can still keep up because of action chunking, which is explained below.{' '}
              <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite>
            </li>
            <li>
              <strong>A training GPU can be waiting for its CPU cores.</strong> Before the GPU can use a training
              image, CPU cores decode the video and vary the image with crops and colour shifts, and the GPU waits
              when they fall behind. Hugging Face reports that a small policy trains 2.8 times faster on an H100 GPU
              when one LeRobot setting, <code>backend=gpu</code>, moves the crops and colour shifts from the CPU cores
              to the GPU. The video is still decoded on the CPU cores.{' '}
              <Cite id="F05-59">LeRobot v0.7.0 release post, Augment on the GPU</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The arm expects new motor targets on a fixed schedule, and the policy has to keep up. You size the onboard computer by how long one policy call takes, and you check the slowest calls as well as the median."
          >
            The policy&apos;s deadline and the onboard computer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The policy runs on the onboard computer next to the arm. The arm works on a fixed clock. One period of
            that clock is called a tick, and its length is the control period. On every tick, the onboard computer reads
            the images from the cameras and the six joint angles. Together, these inputs are called the observation.
            The policy turns the observation into six target joint angles, called the action, and the onboard
            computer sends those targets to the motors.{' '}
            <Cite id="F01-26">LeRobot feature_utils.py, dataset features</Cite> By default, LeRobot runs this clock at
            30 ticks per second. So the whole chain, from reading the cameras to sending the targets, has to finish
            within 33.3 ms. <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>
          </Box>
          <Box variant="p">
            A policy can also return several actions from one call, and this technique is called action chunking.
            One call returns a chunk, which is a sequence of the next several actions predicted from a single
            observation. The arm then plays one action from the chunk on each tick. With chunking, the deadline
            applies to the chunk instead of each tick: the next chunk has to be ready before the arm runs out of
            actions from the current one. <Cite id="F02-5">the ACT paper, action chunking</Cite>{' '}
            <Cite id="F01-87">LeRobot remote inference guide and inference guide</Cite>
          </Box>
          <Box variant="p">
            A model that serves requests in a data centre is judged by its throughput, or by a latency target that
            someone chose. A policy is judged against the control period that the arm sets, and every single call counts. An
            average hides the slow calls, and those are the calls that matter.
          </Box>
          <Box variant="p">
            LeRobot&apos;s inference guide shows a sample timing report, recorded at 30 ticks per second on hardware
            that the guide does not name. In that report, the work done in one tick took 18.7 ms on average, out of the
            33.3 ms budget, and one policy call took 5.18 ms on average. The report calls the work of one tick a
            cycle, and it prints &quot;cycles over the 33.3 ms work budget: 12/1197 (1.0%)&quot;. The slowest cycle took 48.1 ms, and the slowest policy call took 40.00 ms.{' '}
            <Cite id="F07-23">LeRobot inference guide, rollout timing example</Cite>
          </Box>
          <Box variant="p">
            So when you choose the onboard computer, what matters is how long your model&apos;s slowest calls take on
            it. Published figures rarely report the slowest calls. For example, each figure in NVIDIA&apos;s benchmark
            of its robot model is the median of 60 timed calls.{' '}
            <Cite id="F07-3">Isaac-GR00T deployment README, measurement details</Cite>
          </Box>
          <Box variant="p">
            The timing report splits the work of each tick into steps, such as reading the cameras, running the
            policy and writing the recording to the dataset. Before you buy a larger computer, use the report to find
            which step is slow. In the guide&apos;s words, a high share of the tick for the policy step &quot;points
            at the policy or the device&quot;, and a high share for reading the observation &quot;points at the
            cameras&quot;. In the sample report, the slowest step is neither of these. Writing the recording took 620.00 ms at its worst, which is more than <Derived>18</Derived> ticks. A
            faster policy or a faster camera does not remove a stall like that. So read the worst time of every step
            in the report, not only the policy&apos;s.{' '}
            <Cite id="F07-24">LeRobot inference guide, reading the timing report</Cite>{' '}
            <Cite id="F07-23">LeRobot inference guide, rollout timing example</Cite>
          </Box>
          <Box variant="p">
            A LeRobot setting lets you choose whether a slow call pauses the arm or makes it act on an older
            observation. LeRobot&apos;s default mode is synchronous. In synchronous mode, the arm stands still each time
            the policy computes its next chunk, so every call causes a pause and a slow call causes a long pause. The
            asynchronous modes start the next call while the arm is still playing the current chunk. This removes the
            pause, but the arm then moves on actions planned from an older observation. The arm keeps moving only if
            the actions it has left last longer than the call, including the slowest calls.{' '}
            <Cite id="F01-87">LeRobot remote inference guide and inference guide</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A robot dataset is mostly video. You budget the recording in a person's time at the bench, and the processing in CPU cores to decode the video."
          >
            What robot data contains and what it costs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One attempt at the task is called an episode, and robot data is counted in episodes. A recorded episode is
            stored as a table with one row per tick, plus one video per camera. Each row holds what the arm sensed and
            what it was told to do at that instant. It has two fields: <code>observation.state</code>, the six joint
            angles as <code>float32</code> values, and <code>action</code>, the six target angles as{' '}
            <code>float32</code> values. <Cite id="F01-26">LeRobot feature_utils.py, dataset features</Cite>
          </Box>
          <Box variant="p">
            The rows take up very little space. At 30 ticks per second, the joint angles and targets add up to 1,440
            bytes per second. The two cameras at 640x480 produce 55.3 MB/s of raw pixels, which is 38,400 times as
            much. <Cite id="F01-86">the raw data rate, from the camera settings</Cite>
          </Box>
          <Box variant="p">
            After compression, the video is still much larger than the rows. A public dataset of 50 pick-and-place
            episodes, named for the SO-101, is 86.1 MB in total. It holds 11,939 frames from two cameras, stored in
            two video files of 45.5 MB and 40.1 MB, and one file of 0.37 MB that holds every row. So even compressed,
            the video is about <Derived>230</Derived> times the size of the rows.{' '}
            <Cite id="F05-29">Hugging Face hub file listing of the example dataset</Cite>
          </Box>
          <Box variant="p">
            So a robot dataset is small, and its main cost is a person&apos;s time. By default, LeRobot&apos;s
            recording tool records 50 episodes of up to 60 s each, and it allows 60 s after each episode to reset the
            scene. That adds up to as much as 50 x (60 + 60) s = <Derived>100</Derived> minutes at the bench.{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>
          </Box>
          <Box variant="p">
            The compute cost comes later, when programs read the data. Text needs almost no preparation before
            training, but video has to be decoded first. Every program that reads a robot dataset, from the filter
            that removes bad episodes to the trainer, decodes the video before it does anything else. So when you
            choose the video format at recording time, you also choose which hardware can decode it.
          </Box>
          <Box variant="p">
            The example dataset stores its video as AV1, the video compression format that LeRobot writes by
            default. LeRobot&apos;s default data loader decodes AV1 on CPU cores, whichever GPU the
            machine has. Moving the decoding to the GPU would not help on an H100, a GPU widely used for training,
            because the H100 cannot decode AV1 in hardware. So for video, the resource you buy is CPU cores per GPU.{' '}
            <Cite id="F05-47">NVIDIA video encode and decode support matrix, H100 rows</Cite>{' '}
            <Cite id="F08-77">why AV1 video is decoded on CPU cores</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The same model weights need a GPU with enough memory to train them and an onboard computer fast enough to run them. Before you spend GPU hours on training, time one call of the model on the robot's computer, in the runtime you will ship."
          >
            Sizing a policy twice: for training and for the robot
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A policy is trained on data-centre GPUs, where no single training step has a deadline. It then runs on the
            onboard computer, where it has to keep up with the 33.3 ms tick. A model that is served from a data centre
            is trained and run on data-centre GPUs. A policy is trained on one kind of machine and run on another, so
            you size the same weights twice: in hours and gigabytes for training, and in milliseconds for running.{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>
          </Box>
          <Box variant="p">
            NVIDIA&apos;s GR00T N1.7 is the example here. Fine-tuning means training a
            pretrained model further on new data. On the training side, an AWS post fine-tunes GR00T N1.7 on 75 SO-101
            episodes over 20,000 steps. The post&apos;s timing table gives 3.4 hours at batch size 32 on
            ml.g7e.2xlarge. That is a SageMaker instance type with one GPU that has 96 GB of memory.{' '}
            <Cite id="F09-82">AWS post, timing table</Cite>{' '}
            <Cite id="F06-58">NVIDIA product pages, GPUs of the EC2 G families</Cite>
          </Box>
          <Box variant="p">
            To choose a GPU for that fine-tuning job, start with its memory use. The post&apos;s memory table gives a
            peak of 41.5 GB of GPU memory at batch size 32, with the backbone frozen. The backbone is the large
            pretrained body of the model. When it is frozen, its weights stay unchanged and only the smaller parts
            built on top of it are trained. At that batch size, a GPU with 24 GB of memory, such as those in
            EC2&apos;s G5 and G6 instances, is too small. The 48 GB L40S GPU in a G6e instance is large enough, but the
            run uses most of its memory. <Cite id="F09-82">AWS post, memory table</Cite>{' '}
            <Cite id="F06-58">NVIDIA product pages, GPUs of the EC2 G families</Cite>
          </Box>
          <Box variant="p">
            On the running side, NVIDIA benchmarks one call of the model compiled with TensorRT. NVIDIA reports a median of 22.9 ms per call on an H100 and
            149.0 ms on a Jetson Orin. The first figure fits inside one tick, and the second spans several ticks.
            Nothing in the training run tells you the second figure.{' '}
            <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite>
          </Box>
          <Box variant="p">
            A call of 149.0 ms can still keep up with a 33.3 ms clock, because each call in the benchmark returns a
            chunk of 40 actions. Played one per tick, those actions last 40 x 33.3 ms = <Derived>1.33</Derived> s.
            A new chunk is planned from the observation taken when the call starts. By the time the chunk arrives,
            the ticks that its first actions were planned for have already passed. Two of LeRobot&apos;s asynchronous
            modes drop those actions: the asynchronous mode as it is configured by default, and RTC (real-time
            chunking). In these modes, if a call takes a time T, the actions planned for that time T are dropped.
            What remains of the chunk has to keep the arm moving until the next call finishes, which takes another
            T. So the chunk has to last at least 2T, and a call can take at most half of the{' '}
            <Derived>1.33</Derived> s chunk, which is <Derived>667</Derived> ms. That is about{' '}
            <Derived>667 / 149.0 = 4.5</Derived> times the 149.0 ms median, so the arm keeps moving as long as no
            call takes more than 4.5 times the median. In synchronous mode, which LeRobot uses unless you change the
            setting, the arm would stand still during every one of those calls. <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite>{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>{' '}
            <Cite id="F01-87">LeRobot remote inference guide and inference guide</Cite>{' '}
            <Cite id="F07-22">LeRobot remote inference guide, &quot;Tuning&quot;</Cite>
          </Box>
          <Box variant="p">
            Besides the chip, the software that runs the model has a large effect on the call time. On the same
            Jetson Orin, NVIDIA&apos;s table gives 357.9 ms per call when the model runs directly in PyTorch, against
            149.0 ms when it is compiled with TensorRT.{' '}
            <Cite id="F01-74">Isaac-GR00T deployment README, benchmark results</Cite>
          </Box>
          <Box variant="p">
            Quantising the model can cut the call time further. Quantising means storing the model&apos;s numbers in
            fewer bits. NVIDIA reports this on Jetson AGX Thor, another of its computers for robots. There,
            quantising the model to a format NVIDIA calls mixed NVFP4, with the execution profile NVIDIA calls
            &quot;optimized&quot;, cuts one call from 76.8 ms to 35.6 ms.{' '}
            <Cite id="F07-4">Isaac-GR00T deployment README, Thor quantisation</Cite>
          </Box>
          <Box variant="p">
            Compiling or quantising the model produces a different artifact from the one that was trained. The
            compiled model is built on the robot&apos;s own computer, which takes about 2 to 5 minutes, and it has to
            be rebuilt for a different GPU. To check it against the original, you give both models the same input and
            compare their outputs as vectors, using cosine similarity. Cosine similarity is 1 when two vectors point
            in the same direction, and the expected value here is 0.999 or higher.{' '}
            <Cite id="F07-8">Isaac-GR00T deployment README, build notes</Cite>
          </Box>
          <Box variant="p">
            That check covers a single call. It does not show whether the faster model still does the task. NVIDIA
            says that its figures time calls on fixed inputs and do not measure task success with the model driving a
            robot. <Cite id="F07-3">Isaac-GR00T deployment README, measurement details</Cite>
          </Box>
          <Box variant="p">
            So before you train a model, time one call of it on the robot&apos;s computer, in the runtime you will
            ship. Then check that the chunk it returns lasts at least twice as long as your slowest call. Section{' '}
            <Nav>17</Nav>, Running on the Robot, covers this in detail.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="To find what limits a training job, look at how the time of each step divides between loading data and updating the model. A high GPU utilisation figure does not prove that the GPU is the bottleneck."
          >
            Finding the bottleneck in a training job
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A job does not use all the resources of a machine evenly. One resource is fully used while the others are
            partly idle, and that resource is the job&apos;s bottleneck. A larger instance helps only if it has more
            of that resource. When you train a robot policy, the two candidates are the GPU and the CPU cores that
            feed it data. <Cite id="F08-50">a machine&apos;s resources and the counter that shows each</Cite>
          </Box>
          <Box variant="p">
            In robot training, the input side can hold back the GPU. For a language model, preparing text costs
            almost nothing. For a robot policy, preparing images costs CPU time on every sample. LeRobot varies each
            training image with crops and colour shifts, which are called image transforms. By default, it applies
            them on CPU cores, one sample at a time, in the worker processes that load the data. LeRobot&apos;s
            documentation says that with several cameras, this is often the most expensive work the workers do, and
            that &quot;the GPU ends up waiting for data&quot;. With the setting <code>backend=gpu</code>, the workers
            only decode the video, and the same transforms are applied to each batch on the device that runs the
            policy. <Cite id="F05-58">LeRobot v0.7.0 lerobot-dataset-v3.mdx</Cite>
          </Box>
          <Box variant="p">
            ACT (Action Chunking with Transformers) is a small policy. Hugging Face, which publishes LeRobot, reports
            that with this setting, ACT trains 2.8 times faster on an H100. The report gives no dataset, number of
            cameras or batch size. If the figure holds, each training step now takes 1/2.8 of its former time. The
            GPU&apos;s own work in a step cannot take longer than the new step, even though it now includes the
            transforms. So before the change, the H100 spent at least 1 - 1/2.8 = <Derived>64</Derived>% of each step waiting for
            the workers. <Cite id="F05-59">LeRobot v0.7.0 release post, Augment on the GPU</Cite>
          </Box>
          <Box variant="p">
            To find out which case your run is in, look at how the time of one training step divides between loading
            data and updating the model. LeRobot&apos;s hardware guide times training on 4 H100 GPUs at batch size 32.
            Diffusion Policy is one of the policies in LeRobot. For Diffusion Policy, one update takes 0.167 s and
            loading the data takes 0.015 s, about a tenth as long. So in that run, the GPUs are the bottleneck and the
            data loading has time to spare. <Cite id="F01-91">LeRobot hardware guide, benchmark table</Cite>
          </Box>
          <Box variant="p">
            Be careful with the GPU utilisation figure that <code>nvidia-smi</code> prints. It measures time: it is the
            share of the sample period during which at least one program was running on the GPU. It does not show how
            much of the GPU&apos;s capacity was in use. <Cite id="F08-30">nvidia-smi documentation, Utilization</Cite>{' '}
            Because the figure counts time and not capacity, a high value does not prove that the GPU is the
            bottleneck. A team that reads it that way may buy a larger GPU when the data loading is what holds the job
            back. The split of each training step between loading data and updating the model shows where the time
            goes, so check the data-loading share of each step before you look at the utilisation figure.
          </Box>
          <Box variant="p">
            When the data-loading workers are the bottleneck, buy more CPU cores per GPU. Most instances with eight
            GPUs give each GPU 24 vCPUs (virtual CPUs), which is 12 physical cores. EC2&apos;s G7 family includes
            g7.48xlarge, an instance with eight GPUs. It gives each GPU 24 physical cores, the most among the
            eight-GPU x86 instance sizes. If you decode video as a separate job, run that job on CPU instances. If the
            trainer decodes the video itself, choose the GPU instance with the most CPU cores per GPU.{' '}
            <Cite id="F08-57">vCPUs and physical cores per GPU, from the EC2 specifications</Cite>{' '}
            <Cite id="F08-85">price-performance per resource</Cite>
          </Box>
          <Box variant="p">Before you size anything for a robot, find out four things:</Box>
          <ul style={LIST}>
            <li>
              <strong>The control period.</strong> This is the length of one tick, 33.3 ms on this arm. <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>
            </li>
            <li>
              <strong>The time of one policy call on the robot&apos;s computer.</strong> Measure it in the runtime you
              will ship, and include the slowest calls.
            </li>
            <li>
              <strong>The format of your recorded video.</strong> You need it to know which hardware can decode the
              video.
            </li>
            <li>
              <strong>The CPU cores per GPU of the instance you plan to train on.</strong> This number tells you how
              much CPU time is available to feed each GPU with data.
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <ExpandableSection variant="container" headerText="Three shorter reading routes through the dive">
        <SpaceBetween size="m">
          <Box variant="p">
            If you have one specific question, you do not need to read all <Nav>30</Nav> sections in order. Three
            shorter routes each cover part of the dive:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>World models.</strong> This route covers models that predict what happens next when the robot
              takes an action. Some of these models predict video frames. Others predict a compact summary of the
              scene instead of its pixels, and JEPA (Joint-Embedding Predictive Architecture) is a design of this
              second kind. The route passes through sections <Nav>1, 2, 3, 4, 6, 7, 16 and 22</Nav>.
            </li>
            <li>
              <strong>Pipeline.</strong> This route follows the data from one recorded attempt at the task to a policy
              that runs on many robots. It passes through sections <Nav>1, 2, 3 and 9 to 18</Nav>.
            </li>
            <li>
              <strong>Compute.</strong> This route is for choosing the machines, the scheduler and the purchase option
              for each workload. It passes through sections <Nav>1, 2 and 20 to 29</Nav>.
            </li>
          </ul>
          <RouteMap />
        </SpaceBetween>
      </ExpandableSection>
    </SpaceBetween>
  );
}
