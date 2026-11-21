import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Toy } from '../components/Cite';
import { Figure } from '../components/Figure';
import { AugThreeWays } from '../components/figures/AugThreeWays';
import { ARM, TASK_STORY } from '../lib/task';

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/** The thread task, stated once for this section. */
const TASK_SENTENCE = `the ${ARM} has been driven through the task (${TASK_STORY}) a few dozen times`;

export function Augmentation() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Three ways to get more training data than you recorded, the part of the machine each one loads, and what each one costs (LeRobot v0.7.0, Isaac Lab v3.0.0 and NVIDIA's Cosmos 3 pages, read 2026-11-20)"
          >
            11. Augmentation and Synthetic Data
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This section depends on two others. Section 6, World Models, built the video generator that compresses a
            clip, denoises it and decodes it back to pixels. Section 12, Physics Simulation, comes next and builds
            the simulator. Two facts from it are enough here: a simulator computes, from the forces on every body,
            where the arm and the block are a moment later, and one GPU can run hundreds of independent copies of a
            scene at once, called parallel environments.
          </Box>
          <Box variant="p">
            The starting point: {TASK_SENTENCE}. Every episode shows the same table, the same lamp and a handful of
            block positions, and a policy trained on them learns the table and the lamp along with the task.
            Augmentation makes more training examples out of the ones you recorded, in three ways that run on three
            different machines. Changing the images a little takes the CPU or the
            training GPU a few milliseconds. Replaying the motions in a simulator takes physics plus rendering
            (drawing what each simulated camera sees) for minutes to hours. Generating video with a world model
            takes a GPU&apos;s tensor cores, the part that does the matrix arithmetic of neural networks, for
            minutes per clip: NVIDIA lists 207.78 s for one 720p clip of under 8 seconds on an H100.{' '}
            <Cite id="F03-98">NVIDIA Cosmos inference benchmarks, Cosmos3-Nano</Cite>{' '}
            <Cite id="F05-108">the three kinds by machine part</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="See at a glance what each kind changes, what checks the result, and which part of the machine does the work">
            One episode, three ways
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Figure
            cites="F05-87 F05-90 F03-98 F05-108"
            caption={
              <>
                One recorded frame, three kinds of extra data. The top row is that frame under three image
                transforms. The middle row is three scenes with the block in a new place each time. The bottom row
                is empty on purpose: this dive has no generated clip of its own. On the right, the time each kind
                takes per new sample, on one log axis; the costs are the publishers&apos; own figures for their own
                tasks, so compare their size, not their decimals. The frames are MuJoCo 4.0.1 captures made for
                this dive with scripted motion and no learned policy. The middle row uses this dive&apos;s
                randomised scenes, which also change colours and light, to stand in for simulator replays; the
                transforms are filters applied in the page, with illustrative strengths.
              </>
            }
          >
            <AugThreeWays />
          </Figure>
          <Box variant="p">
            Each kind changes something the one above it cannot reach: pixels, then positions and motion, then the
            whole look of the scene. Only the middle one has physics checking its output. That is our reading of
            the three tools below, and it is why the cheapest kind cannot replace the other two.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="The one to switch on first: no new data, no new machine, and off by default in LeRobot">
            Image-space augmentation in the dataloader
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What it is.</strong> Each time a camera frame is loaded for a training step, it is changed a
            little at random: somewhat brighter, slightly rotated, shifted by a few pixels. The joint angles and
            the actions recorded with the frame are left alone. The policy sees the same motion under many small
            variations of the picture and learns to ignore them. The work happens in the dataloader, the part of
            the training program that assembles batches (section 10, Processing and Curating).
          </Box>
          <Box variant="p">
            <strong>What it looks like on the arm.</strong> One overhead frame, block left of the cup, arrives on
            one pass with its brightness multiplied by <Toy>1.1</Toy> and rotated by 3 degrees, and on the next
            pass darker and shifted (illustrative values). Brightness is one multiplication: every pixel value, a
            number from 0 to 1, is multiplied by a factor drawn between 0.8 and 1.2 and cut back into range. In
            LeRobot the transforms are off by default. Enabled, each frame gets up to 3 transforms drawn
            from six: brightness, contrast, saturation, hue, sharpness and a small move (rotation within 5 degrees,
            translation up to 5% of the frame).{' '}
            <Cite id="F05-84">LeRobot transforms.py, ImageTransformsConfig</Cite> Version 0.7.0 adds eight that
            imitate real robot cameras, among them motion blur, a random shadow, JPEG compression and a shift in
            colour temperature. <Cite id="F05-86">LeRobot dataset docs, available transform types</Cite> Nothing is
            written to disk: the dataset keeps the raw frames, so you can change the recipe without recording
            again. <Cite id="F05-85">LeRobot dataset docs, image transforms</Cite>
          </Box>
          <Box variant="p">
            <strong>When to use it, and its limit.</strong> Use it whenever the robot will meet lighting or a
            camera placement slightly different from recording day. Its limit is what it leaves alone: the block
            is still where you put it and the arm still moves as you moved it. By our reading the ranges are small
            for the same reason: the actions are not adjusted, so a frame rotated far would no longer match the
            motion stored with it.
          </Box>
          <Box variant="p">
            <strong>What it costs.</strong> By default the transforms run per sample on CPU cores, in the same
            dataloader workers that decode the video.
            Setting the backend to <code>gpu</code> leaves the workers to decode only and applies the transforms
            per batch on the training GPU, 32 samples at a time by default, after a one-off compile of 15 to 30 s
            per image shape. The code comment gives a peak of 2.4 GB of GPU memory at 480x640 with a batch of 160.{' '}
            <Cite id="F05-87">LeRobot transforms.py, backend and gpu_chunk_size</Cite> Hugging Face reports that the
            move made training of ACT (Action Chunking with Transformers, the small imitation policy of section 4)
            2.8 times faster on an H100; the post names no dataset, batch size or CPU.{' '}
            <Cite id="F05-59">LeRobot v0.7.0 release post, Augment on the GPU</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Turn a handful of demonstrations into a thousand with the block in new places, and see why yield and cameras set the bill">
            Demonstration multiplication in simulation
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What it is.</strong> You record a few demonstrations by driving the arm inside a simulator. A
            tool cuts each one into subtasks: reach the block, grasp it, carry it, release it over the cup. For a
            new episode the simulator places the block and the cup somewhere else. The tool moves each recorded
            segment so the gripper keeps the same path relative to the object it acts on, joins the segments into
            one candidate, and plays the candidate in the simulator. Physics decides where the block ends up. If it
            is in the cup, the episode is kept; if the gripper missed, it is thrown away.{' '}
            <Cite id="F05-89">Isaac Lab v3.0.0 docs, teleoperation and imitation learning</Cite>
          </Box>
          <Box variant="p">
            That is Isaac Lab Mimic, a tool in Isaac Lab, NVIDIA&apos;s robot-learning framework built on its
            simulator. The idea comes from MimicGen in 2023, whose authors report over 50,000 demonstrations across
            18 tasks from about 200 human ones. <Cite id="F05-88">MimicGen paper, abstract</Cite> The share of
            candidates that pass the success check is the yield, and it ranges from about 70% in simple cases to
            under 1%. <Cite id="F05-89">Isaac Lab v3.0.0 docs, teleoperation and imitation learning</Cite>
          </Box>
          <Box variant="p">
            <strong>What it looks like on the arm.</strong> Ten demonstrations in (an illustrative count), a
            thousand out, each with the block and the cup in a different spot. Isaac Lab v3.0.0 ships an {ARM} robot model and a cube-stacking task set up for
            it. The shipped task stacks a cube; the cup scene would be yours to build. No published generation time
            for the {ARM} task was located in this research, and whether Mimic is registered for it was not
            checked. <Cite id="F05-93">Isaac Lab v3.0.0 repository tree, SO-101 stack task</Cite>
          </Box>
          <Box variant="p">
            <strong>When to use it, and when not.</strong> Use it when the policy must cope with objects in places
            you never recorded, and the task can be built in a simulator with a rule that says &quot;success&quot;.
            What it produces is simulated images and simulated contact; section 14, Sim-to-Real and Real-to-Sim,
            deals with that difference.
          </Box>
          <Box variant="p">
            <strong>What it costs.</strong> This kind loads a simulator, and the bill depends on whether cameras are
            on. NVIDIA&apos;s figures for a cube-stacking task with a Franka research arm, on one RTX PRO 6000
            Blackwell: 1,000 demonstrations take about 15 minutes when only joint and object numbers are saved,
            with 1,000 parallel environments, and about 1 hour when camera images are rendered, with 300 parallel
            environments, both at a success rate of about 40%.{' '}
            <Cite id="F05-90">Isaac Lab v3.0.0 docs, data generation figures</Cite> Rendering is the slow part; section 13, Rendering and Ray Tracing, explains which cards do it.
            Harder tasks stretch the range: for a humanoid pick-and-place NVIDIA gives 65 to 80% success and 18 to
            40 minutes per 1,000 demonstrations, and for a nut-pouring task with cameras about 10 hours per 1,000 on
            one RTX 6000 Ada. <Cite id="F05-91">Isaac Lab v3.0.0 docs, humanoid imitation figures</Cite>
          </Box>
          <ExpandableSection headerText="When the joins between segments need planning: SkillGen and GPU memory" variant="footer">
            <Box variant="p">
              SkillGen is the Isaac Lab variant that plans a collision-free motion between the skill segments with a
              GPU motion planner. It is slower and bound by memory. NVIDIA gives 90 to 120 minutes for 1,000
              demonstrations with one environment on an RTX 6000 Ada, about 9.5 GB of GPU memory for one
              environment and about 22 GB for five. Here GPU memory per environment picks the card.{' '}
              <Cite id="F05-92">Isaac Lab v3.0.0 docs, SkillGen</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Repaint an episode under a new table and new light, or have a model invent one, knowing each clip costs minutes of a large GPU">
            Generative augmentation with a world model
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What it is.</strong> The video generator of section 6, used as a source of training data. The
            common use is called transfer. The model takes a text prompt and a control video, a version of the
            episode reduced to its shapes (edges, depth or a segmentation map), and writes a new video that keeps
            the geometry and changes the appearance.{' '}
            <Cite id="F05-96">NVIDIA Cosmos models reference, workflows</Cite> The second use invents episodes. In
            the DreamGen recipe a video model is fine-tuned on the robot, prompted with a first frame and an
            instruction, and the actions are recovered afterwards by an inverse-dynamics model, a network that looks
            at two frames and outputs the action that happened between them.{' '}
            <Cite id="F05-101">DreamGen paper, section 1</Cite>
          </Box>
          <Box variant="p">
            <strong>What it looks like on the arm.</strong> The same reach, grasp and release, on a dark wooden
            table in evening light with clutter behind the cup. By our reading the recorded joint actions still
            describe the new video, because the geometry is kept. The current model family from NVIDIA is Cosmos 3:
            Cosmos3-Nano (16 billion parameters) and Cosmos3-Super (64 billion) were released in May 2026 and
            Cosmos3-Edge (4 billion) in July 2026. The Cosmos-Transfer2.5 and Cosmos-Predict2.5 models are
            superseded and in limited maintenance.{' '}
            <Cite id="F05-95">NVIDIA Cosmos README and models reference</Cite> A checkpoint tuned for simulators,
            Cosmos3-Nano-Sim-Transfer, takes control video rendered by a simulator and writes up to 600 frames at 30
            fps (frames per second) and 480p, which chains the previous kind into this one: simulate, then repaint.{' '}
            <Cite id="F05-96">NVIDIA Cosmos models reference, simulation checkpoints</Cite> Check the versions
            before following a recipe: Isaac Lab v3.0.0&apos;s own tutorial for that chain pins Cosmos Transfer1,
            the 2025 model. <Cite id="F05-100">Isaac Lab v3.0.0 docs, augmented imitation</Cite>
          </Box>
          <Box variant="p">
            <strong>When to use it, and when not.</strong> Use it for variety in appearance that small image
            transforms cannot reach and that you cannot record: other rooms, other surfaces, other light. A simulator rejects an episode where the block misses the cup. A generator has no such test, so watch
            a sample of the clips before training on them.
          </Box>
          <Box variant="p">
            <strong>What it costs.</strong> Tensor cores, for minutes per clip. NVIDIA&apos;s benchmark page lists
            Cosmos3-Nano writing one 189-frame clip at 24 fps from text, on one GPU: at 720p, 207.78 s on an H100
            80GB, 114.85 s on a B200 and 786.37 s on an RTX PRO 6000 Blackwell.{' '}
            <Cite id="F03-98">NVIDIA Cosmos inference benchmarks, Cosmos3-Nano text-to-video</Cite> Transfer is
            slower: 527.89 s per 720p clip on the H100 with an edge control. The page gives no frame count for the transfer rows, so they cannot be turned into a rate.{' '}
            <Cite id="F05-97">NVIDIA Cosmos inference benchmarks, transfer generation</Cite> Resolution is the
            lever: the generator works on a grid 32 by 32 times smaller in space than the frame, a smaller frame
            means fewer cells, and the same text-to-video clip at 480p takes 59.83 s on the H100.{' '}
            <Cite id="F03-96">Cosmos 3 paper, section 3.1</Cite> That clip is 7.875 s of video, so by our arithmetic
            from NVIDIA&apos;s figure (59.83 / 7.875) the H100 spends 7.6 GPU-seconds per second of 480p video, and
            an hour of generated video costs 7.6 GPU-hours.{' '}
            <Cite id="F05-98">NVIDIA Cosmos inference benchmarks and methodology</Cite>
          </Box>
          <Box variant="p">
            <strong>Memory.</strong> NVIDIA&apos;s support matrix for its NIM (NVIDIA Inference Microservice, the
            packaged container that serves a model) prints a minimum GPU memory per device. For Cosmos3-Nano at full
            16-bit precision with the model held on the GPU it is 58 GiB for generation and 64 GiB for transfer
            (GiB is the binary unit, slightly larger than a GB); with 8-bit weights it is 44 GiB. These are floors the NIM container checks before it starts, and the page says to treat them as minimums.
            They are not measured peaks of the PyTorch path the timings above come from, and the page gives no
            resolution or frame count for them.{' '}
            <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite> Read as a sizing rule, Nano at full
            precision is a job for a card of the 80 GB class.
          </Box>
          <ExpandableSection headerText="Every Cosmos 3 memory figure NVIDIA prints, and what each one measures" variant="footer">
            <ul style={LIST}>
              <li>
                <strong>NIM floors.</strong> Besides the 58 GiB and 64 GiB above: 31 GiB for Nano when the weights
                are offloaded layer by layer to host memory, and 150 GiB per device for Cosmos3-Super at 16-bit
                precision. Startup minimums for the NIM runtime, per device.{' '}
                <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>
              </li>
              <li>
                <strong>The framework FAQ.</strong> 32 GB for Nano and 128 GB for Super, with no resolution,
                precision or workload given. The FAQ labels the models 8B and 32B, where the model cards say 16B and 64B. Taking the
                model cards&apos; counts, 16B parameters at 2 bytes each is 32 GB, so by our reading this is the size of
                the weights alone. <Cite id="F03-123">NVIDIA cosmos-framework FAQ, inference</Cite>
              </li>
              <li>
                <strong>Measured peaks.</strong> The only ones located are in a notes file in NVIDIA&apos;s
                cosmos-framework repository, written for coding agents and not a product document. On one H100 80
                GB, Nano peaks at 33.8 GiB for a single 1280 x 720 image, which is one frame and not a video, and
                sits at about 50.6 to 52.1 GiB when served through TensorRT-LLM, NVIDIA&apos;s serving runtime,
                after a 189-frame warm-up. The notes hold no measured peak for a full 189-frame video through
                PyTorch. <Cite id="F03-124">NVIDIA cosmos-framework, agent skill notes</Cite>
              </li>
              <li>
                <strong>The benchmark tables.</strong> They encode memory fit in a GPU count: every Nano row uses
                one GPU at 720p, and Super&apos;s main PyTorch rows use eight. NVIDIA calls these measured setups,
                not memory requirements. <Cite id="F03-126">NVIDIA Cosmos inference benchmarks, opening notes</Cite>
              </li>
              <li>
                <strong>The model card.</strong> No memory figure; it says only that a layer-wise offload flag
                &quot;can help reduce memory usage&quot;. <Cite id="F03-105">Cosmos3-Nano model card</Cite> At
                the low end, NVIDIA ships an adapter that keeps Nano&apos;s weights in host memory and reports
                all 21 of its test cases completing on an RTX 5070, a 12 GB card, in a host with 128 GB of memory,
                for inference only and at a speed cost the page does not quantify.{' '}
                <Cite id="F03-125">NVIDIA cosmos-framework, CPU offloading README</Cite>
              </li>
              <li>
                <strong>A dated figure for a superseded model.</strong> The docs of Cosmos-Transfer2.5-2B, last
                changed in June 2026, list 65.4 GB of GPU memory and 92.25 s on a B200 for a 93-frame chunk of 720p
                video at 16 fps. It describes the previous generation and is here only for scale.{' '}
                <Cite id="F05-99">Cosmos-Transfer2.5 inference docs</Cite>
              </li>
            </ul>
          </ExpandableSection>
          <ExpandableSection headerText="Inventing episodes: DreamGen on the SO-100, a driven rollout, and the GPU bill" variant="footer">
            <SpaceBetween size="s">
              <Box variant="p">
                DreamGen was tested on the SO-100, the predecessor of the {ARM}. With 10 and 13 real demonstrations
                per task plus 40 and 50 generated ones, its authors report average success on two SO-100 tasks
                rising from 21% to 45.5%. <Cite id="F05-102">DreamGen paper, sections 1 and 4</Cite>
              </Box>
              <Box variant="p">
                The same authors report the bill for a large benchmark set: 240,000 generated trajectories took 54
                hours on 1,500 L40 GPUs. By our arithmetic from those figures that is 81,000 GPU-hours, about 20
                GPU-minutes per trajectory. <Cite id="F05-103">DreamGen paper, conclusion</Cite>
              </Box>
              <Box variant="p">
                Cosmos3-Nano can also be driven by actions: a first frame and an action sequence go in and a video
                of the predicted outcome comes out. NVIDIA lists about 2.0 s per rollout on an H100 80GB and does
                not publish the rollout length, so the figure cannot be set beside the clip times above.{' '}
                <Cite id="F03-99">NVIDIA Cosmos inference benchmarks, forward dynamics</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Match each kind to a machine you have or would rent, and take them in the order that costs least">
            Which kind fits which hardware
          </Header>
        }
      >
        <SpaceBetween size="m">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 760 }}>
              <thead>
                <tr>
                  <th style={TH}>Kind</th>
                  <th style={TH}>Changes</th>
                  <th style={TH}>Machine part</th>
                  <th style={TH}>Published cost</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Image transforms</td>
                  <td style={TD}>The pixels, slightly</td>
                  <td style={TD}>CPU cores in the dataloader workers, or the training GPU</td>
                  <td style={TD}>Milliseconds per image; on the GPU a peak of 2.4 GB at 480x640 with a batch of 160 (LeRobot code comment)</td>
                  <td style={TD}>
                    <Cite id="F05-87">LeRobot transforms.py</Cite> <Cite id="F05-108">the three kinds by machine part</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Replay in a simulator</td>
                  <td style={TD}>Where objects are, how the arm moves</td>
                  <td style={TD}>GPU physics, plus GPU rendering when cameras are on</td>
                  <td style={TD}>NVIDIA: 1,000 demonstrations in about 15 minutes without cameras, about 1 hour with them, about 10 hours for a hard task</td>
                  <td style={TD}>
                    <Cite id="F05-90">Isaac Lab v3.0.0 docs</Cite> <Cite id="F05-91">humanoid figures</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Generation with a world model</td>
                  <td style={TD}>The look of the scene, or the whole episode</td>
                  <td style={TD}>GPU tensor cores and large GPU memory</td>
                  <td style={TD}>NVIDIA: 207.78 s per 720p clip on an H100 80GB; NIM startup floor of 58 GiB</td>
                  <td style={TD}>
                    <Cite id="F03-98">Cosmos3-Nano benchmarks</Cite> <Cite id="F03-121">NIM support matrix</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Per added episode the ladder runs from milliseconds of CPU, to about 1 to 36 GPU-seconds for a simulated
            replay, to about 20 GPU-minutes for a generated one. That is our arithmetic across different tasks and cards, so read it for the size of the steps. The
            hardware follows:{' '}
            <Cite id="F05-108">the three kinds by machine part</Cite>
          </Box>
          
          <ul style={LIST}>
            <li>
              <strong>Image transforms need no new machine.</strong> They run inside the training job. If that
              job&apos;s GPU is waiting for data (the two readings at the end of section 10 show it), move them to
              the GPU with <code>--dataset.image_transforms.backend=gpu</code>.{' '}
              <Cite id="F05-59">LeRobot v0.7.0 release post</Cite>
            </li>
            <li>
              <strong>Simulated replay needs a simulator GPU.</strong> With cameras on, that means a card that
              renders, and GPU memory per parallel environment sets how many run at once.
            </li>
            <li>
              <strong>Generation needs a large-memory tensor GPU.</strong> NVIDIA lists Cosmos3-Nano for the RTX Pro
              6000, H100 and B200, and Cosmos3-Super for the H200, B200 and GB200.{' '}
              <Cite id="F05-95">NVIDIA Cosmos README, models</Cite>
            </li>
            <li>
              <strong>Chaining replay into generation takes two machines.</strong> NVIDIA&apos;s 2025 blueprint for
              that chain, which pins older tools, asked for an RTX card with 48 GB for simulation and a separate
              node with an H100 or better and 80 GB for Cosmos, &quot;due to differing hardware requirements&quot;.{' '}
              <Cite id="F05-94">GR00T-Mimic blueprint README</Cite>
            </li>
          </ul>
          <Box variant="p">
            Take them in that order. Switch on image transforms for the next training run. If the policy fails when
            the block starts in a new place, build the scene in a simulator and multiply your demonstrations. If it
            fails when the room looks different, budget for generation at 207.78 s per 720p clip on an H100, by
            NVIDIA&apos;s figure, and start at a lower resolution. Section 12, Physics Simulation, opens up the
            machine the second lane runs on.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
