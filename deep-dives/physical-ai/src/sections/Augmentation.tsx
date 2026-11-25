import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Derived, Toy } from '../components/Cite';
import { Figure } from '../components/Figure';
import { AugThreeWays } from '../components/figures/AugThreeWays';
import { ARM, TASK_STORY } from '../lib/task';

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/** The thread task, stated once. */
const TASK_SENTENCE = `the ${ARM} has been driven through the task (${TASK_STORY}) a few dozen times`;

export function Augmentation() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Match the variety a failing policy lacks to image transforms, simulated replay or video generation, and know which hardware each one needs (LeRobot v0.7.0, Isaac Lab v3.0.0 and NVIDIA's Cosmos 3 pages, read 2026-11-20)"
          >
            11. Augmentation and Synthetic Data: Three Ways to More Episodes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Extra training data helps a policy only when it carries the variety the policy lacks, and each kind of
            variety is made on a different part of the machine. Suppose {TASK_SENTENCE}. Every episode shows the
            same table, the same lamp and a handful of block positions, and a policy (the network that turns
            observations into actions) trained on them learns the table and the lamp along with the task.
          </Box>
          <Box variant="p">
            Random changes to the camera images, made on the CPU cores that feed the training GPU, teach it to
            ignore small differences in the picture. Replaying demonstrations in a simulator, on that
            simulator&apos;s GPU, shows it the block in places you never put it, and physics checks every new
            episode. A world model that generates video (section 6, World Models) shows it other tables and other
            light; that takes the tensor cores (the part that does the matrix arithmetic of neural networks) and
            tens of gigabytes of memory on a large GPU, and nothing tests the result. How the policy fails
            therefore picks the method, and the method picks the hardware you must have.{' '}
            <Cite id="F05-108">the three kinds by machine part</Cite>
          </Box>
          <Box variant="p">
            The cost of one added item climbs with each method: milliseconds of CPU for a transformed image (an
            estimate; no figure is published), about 1 to 36 GPU-seconds for a simulated episode, and about 20
            GPU-minutes for an episode invented by a video model. The last two are our arithmetic from totals
            published by NVIDIA and by the authors of the DreamGen recipe.{' '}
            <Cite id="F05-108">the cost ladder per added episode</Cite>{' '}
            <Cite id="F05-103">DreamGen paper, conclusion</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Tell which kind of variety a failing policy is missing: the pixels, the positions or the look of the room">
            Only the simulator checks what it makes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Figure
            cites="F05-87 F05-90 F03-98 F05-108"
            caption={
              <>
                Each row applies one method to the same frame: three image transforms at illustrative strengths,
                then three simulated scenes with the block ringed in a new place (these scenes also vary colour
                and light). The axis on the right places each method&apos;s time per new item on a log scale:
                milliseconds, then seconds, then minutes.
              </>
            }
          >
            <AugThreeWays />
          </Figure>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Switch on the cheapest variety, and move it to the GPU when the CPU cores are what training waits on">
            Image transforms load the CPU cores that feed the GPU
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each time a camera frame is loaded for a training step, it is changed a little at random: somewhat
            brighter, slightly rotated, shifted by a few pixels. The joint angles and the actions stored with the
            frame are left alone, so the policy sees one motion under many versions of the picture and learns to
            ignore the differences. Brightness shows how little work one transform is: every pixel value, a number from 0 to 1, is
            multiplied by one factor and cut back into range. With a factor of <Toy>1.1</Toy> (an illustrative
            draw) the overhead frame of the block and the cup arrives a tenth brighter on one pass, and on the
            next pass it arrives darker and shifted. LeRobot draws the factor between 0.8 and 1.2 for each sample,
            and ships with the transforms switched off.{' '}
            <Cite id="F05-84">LeRobot transforms.py, ImageTransformsConfig</Cite>
          </Box>
          <Box variant="p">
            Enabled, each frame gets up to 3 transforms drawn from six: brightness and contrast (factors of 0.8 to
            1.2), saturation and sharpness (0.5 to 1.5), hue (a shift within 0.05 either way) and a small move
            (rotation within 5 degrees, translation up to 5% of the frame).{' '}
            <Cite id="F05-84">LeRobot transforms.py, ImageTransformsConfig</Cite> Version 0.7.0 adds eight that
            imitate what real robot cameras do: Gaussian noise, motion blur, JPEG compression, a bright patch, a
            random shadow, dropped rectangles, a gamma change and a shift in colour temperature. None of the eight
            is in the default set, so enabling the transforms without naming them gives only the six.{' '}
            <Cite id="F05-86">LeRobot dataset docs, available transform types</Cite>
          </Box>
          <Box variant="p">
            Nothing is written to disk. The dataset keeps the raw frames, and the recipe can change between two training runs without
            recording again. <Cite id="F05-85">LeRobot dataset docs, image transforms</Cite>
          </Box>
          <Box variant="p">
            A transform is a function of the picture only, and that is its limit. The block is still where you put
            it and the arm still moves as you moved it, so a policy that fails when the block starts somewhere new
            gains nothing here. The same fact limits how far a transform may move the picture. Nothing adjusts the
            actions to match, so a rotation range raised far past its 5 degrees would show the policy a motion
            that the stored actions no longer describe.{' '}
            <Cite id="F05-84">LeRobot transforms.py, ImageTransformsConfig</Cite>
          </Box>
          <Box variant="p">
            By default the transforms run per sample on CPU cores, in the same dataloader workers that decode the
            video (the dataloader is the part of a training program that assembles batches; section 10,
            Processing and Curating). Those cores are a fixed budget, 24 vCPUs per GPU on most eight-GPU EC2
            sizes, and decode already draws on it. Setting the backend to <code>gpu</code> leaves the workers to
            decode only and applies the transforms per batch on the training GPU, 32 samples at a time by default,
            after a one-off compile of 15 to 30 s per image shape.{' '}
            <Cite id="F05-87">LeRobot transforms.py, backend and gpu_chunk_size</Cite>{' '}
            <Cite id="F05-107">vCPUs per GPU on EC2, and what the workers do with them</Cite>
          </Box>
          <Box variant="p">
            The move costs GPU memory, and the chunk of 32 is what bounds it. For two frames per sample at 480x640
            and a batch of 160, the code comment gives a peak of 2.4 GB with the default chunk against 6.3 GB with
            no chunking.{' '}
            <Cite id="F05-87">LeRobot transforms.py, backend and gpu_chunk_size</Cite> Hugging Face reports that
            the move made training of ACT (Action Chunking with Transformers, the small imitation policy of
            section 4, Learning From Demonstrations) 2.8 times faster on an H100 and 3.3 times faster on an A100;
            the post names no dataset, camera count, batch size or CPU. The gain comes from freeing the workers, so it is there to be had when the CPU cores are the part your
            training run exhausts first, the case section 10 shows how to detect. <Cite id="F05-59">LeRobot v0.7.0 release post, Augment on the GPU</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Turn a few demonstrations into a thousand with the block in new places, and price the run from the yield and from whether cameras are on">
            Simulated replay loads a simulator&apos;s GPU, and cameras set the bill
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A physics simulator computes, from the forces on every body, where the arm and the block are a moment
            later, and one GPU can step hundreds of independent copies of a scene at once, called parallel
            environments (section 12, Physics Simulation). The second method, demonstration multiplication, needs
            both. You record a few demonstrations by driving the arm inside the simulator, and a tool cuts each one into
            subtasks: reach the block, grasp it, carry it, release it over the cup. For a new episode the
            simulator places the block and the cup somewhere else.
          </Box>
          <Box variant="p">
            The tool then moves each recorded segment so the gripper keeps the same path relative to the object it
            acts on, joins the segments into one candidate, and plays the candidate in the simulator. Physics
            decides where the block ends up. If it is in the cup the episode is kept, and if the gripper missed it
            is thrown away. That is Isaac Lab Mimic, a tool in Isaac Lab, NVIDIA&apos;s robot-learning framework
            built on its simulator.{' '}
            <Cite id="F05-89">Isaac Lab v3.0.0 docs, teleoperation and imitation learning</Cite> The idea comes
            from MimicGen in 2023, whose authors report over 50,000 demonstrations across 18 tasks from about 200
            human ones, or 250 for each one a person gave. <Cite id="F05-88">MimicGen paper, abstract</Cite>
          </Box>
          <Box variant="p">
            The share of candidates that pass the success check is the yield, and it multiplies the bill, because
            a rejected candidate was simulated in full. Isaac Lab&apos;s docs put it between about 70% in simple
            cases and under 1%. The candidates simulated per episode kept are one divided by the yield:{' '}
            <Derived>2.5</Derived> at the 40% NVIDIA reports for cube stacking, <Derived>100</Derived> at 1%.
            Measure the yield of your own task on a small batch before sizing the run.{' '}
            <Cite id="F05-89">Isaac Lab v3.0.0 docs, teleoperation and imitation learning</Cite>{' '}
            <Cite id="F05-90">Isaac Lab v3.0.0 docs, data generation figures</Cite>
          </Box>
          <Box variant="p">
            Cameras are the second multiplier. NVIDIA&apos;s figures for a cube-stacking task with a research arm
            from Franka, on one RTX PRO 6000 Blackwell: 1,000 demonstrations take about 15 minutes when only
            joint and object numbers are saved, and about 1 hour when camera images are saved too, both at a
            success rate of about 40%. Drawing what each simulated camera sees is called rendering, and it is the
            expensive part: with cameras on, NVIDIA runs 300 parallel environments where it ran 1,000, and the run
            takes 4 times as long. Data saved without images cannot train a policy that reads cameras, so the hour
            is the figure for a policy like this arm&apos;s. Section 13, Rendering and
            Ray Tracing, says which cards render.{' '}
            <Cite id="F05-90">Isaac Lab v3.0.0 docs, data generation figures</Cite>
          </Box>
          <Box variant="p">
            For a humanoid pick-and-place NVIDIA gives 65 to 80% success and 18 to 40 minutes per 1,000
            demonstrations, with 19 minutes on one RTX 6000 Ada at 80%. For a nut-pouring task with cameras it
            gives about 10 hours per 1,000 on the same card. Per demonstration that is <Derived>1.1</Derived>{' '}
            GPU-seconds (19 minutes over 1,000) against 36 (10 hours over 1,000). The 30-fold spread mixes the
            task with the cameras, so a figure from another task cannot size yours.{' '}
            <Cite id="F05-91">Isaac Lab v3.0.0 docs, humanoid imitation figures</Cite>{' '}
            <Cite id="F05-108">the cost ladder per added episode</Cite>
          </Box>
          <Box variant="p">
            For the block-in-cup task the scene does not exist yet. Isaac Lab v3.0.0 ships an {ARM} robot model
            and a cube-stacking task set up for it; the cup scene is yours to build, together with the success
            rule that decides the yield. Check that Mimic is registered for that
            task before planning around it. No published generation time for the {ARM} task was located in this
            research.{' '}
            <Cite id="F05-93">Isaac Lab v3.0.0 repository tree, SO-101 stack task</Cite> What comes out is
            simulated images and simulated contact, and a policy trained on them still has to cross to the real
            arm (section 14, Sim-to-Real and Real-to-Sim).
          </Box>
          <ExpandableSection headerText="SkillGen: planned joins between segments, sized by GPU memory per environment" variant="footer">
            <Box variant="p">
              SkillGen is the Isaac Lab variant that plans a collision-free motion between the skill segments with
              a GPU motion planner, where Mimic joins them directly; it is for scenes where a direct join would hit
              something. Here memory per environment picks the card
              and parallel environments stop paying. NVIDIA gives about 9.5 GB of GPU memory for one environment
              and about 22 GB for five, recommends at least 24 GB for one or two environments and 48 GB for up to
              about five, and states that the gain from more than one environment is not very significant. Its
              time for 1,000 demonstrations with one environment on an RTX 6000 Ada is 90 to 120 minutes.{' '}
              <Cite id="F05-92">Isaac Lab v3.0.0 docs, SkillGen</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Budget a repainted or invented episode in GPU-minutes and tens of GiB, and inspect the clips, because nothing else does">
            Generation loads tensor cores and memory for minutes per clip
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A world model that generates video compresses a clip, removes noise from the compressed version step
            by step, and decodes the result back to pixels (section 6). As a source of training data it is used in
            two ways. Transfer repaints an episode you have. The model takes a text prompt and a control video, a
            version of the episode reduced to its shapes (edges, depth or a segmentation map), and writes a new
            video that keeps the geometry and changes the appearance: the same reach, grasp and release, on a dark
            wooden table in evening light. <Cite id="F05-96">NVIDIA Cosmos models reference, workflows</Cite>
          </Box>
          <Box variant="p">
            Because the motion is kept, the recorded actions still label the new clip. Isaac Lab&apos;s docs
            describe the step as changing lighting, textures and backgrounds &quot;while preserving the original
            motion and actions&quot;. <Cite id="F05-100">Isaac Lab v3.0.0 docs, augmented imitation</Cite> The
            second way invents the episode. In the DreamGen recipe a video model is fine-tuned on the robot and
            prompted with a first frame and an instruction, and the actions are recovered afterwards by an
            inverse-dynamics model, a network that looks at two frames and outputs the action that happened
            between them. The paper calls the result pseudo-actions: labels inferred from a video that was itself
            generated. <Cite id="F05-101">DreamGen paper, section 1</Cite>
          </Box>
          <Box variant="p">
            DreamGen was tested on the SO-100, the predecessor of the {ARM}. With 10 and 13 real demonstrations
            per task plus 40 and 50 generated ones, its authors report average success on two SO-100 tasks rising
            from 21% to 45.5%. <Cite id="F05-102">DreamGen paper, sections 1 and 4</Cite> They also report the
            bill for a larger set: 240,000 generated trajectories took 54 hours on 1,500 L40 GPUs. That is 54 x
            1,500 = 81,000 GPU-hours, and 81,000 / 240,000 of an hour is about 20 GPU-minutes per trajectory.{' '}
            <Cite id="F05-103">DreamGen paper, conclusion</Cite>
          </Box>
          <Box variant="p">
            Neither way has the simulator&apos;s test. A simulator rejects an episode where the block misses the
            cup; a generator writes that clip to disk like any other. Watch a sample of the clips before training
            on them.
          </Box>
          <Box variant="p">
            One generated clip of under 8 seconds occupies a data-centre GPU for minutes. Cosmos 3 is
            NVIDIA&apos;s current family of these models, and Cosmos3-Nano, its 16-billion-parameter middle size,
            is the one listed for the RTX Pro 6000, H100 and B200.{' '}
            <Cite id="F05-95">NVIDIA Cosmos README and models reference</Cite> NVIDIA&apos;s benchmark has Nano
            writing one 189-frame clip at 24 fps (frames per second) from text on one GPU: at 720p, 207.78 s on an
            H100 80GB, 114.85 s on a B200 and 786.37 s on an RTX PRO 6000 Blackwell, the card that ran the
            simulated replays. The clip is 7.875 s of video, so the H100 spends 207.78 / 7.875 = 26.4 GPU-seconds
            on each second of 720p video.{' '}
            <Cite id="F03-98">NVIDIA Cosmos inference benchmarks, Cosmos3-Nano text-to-video</Cite>
          </Box>
          <Box variant="p">
            The time follows the size of what the model fills in. It works on a compressed grid, 4 times smaller
            in time and 32 by 32 times smaller in space than the video, so that 720p clip is (189 / 4) x (720 /
            32) x (1280 / 32), on the order of 42,000 cells, and each pass of the model covers all of them.{' '}
            <Cite id="F03-96">Cosmos 3 paper, section 3.1</Cite> A smaller frame is fewer cells. The same clip at
            480p takes 59.83 s on the H100, which is 59.83 / 7.875 = 7.6 GPU-seconds per second of video, or 7.6
            GPU-hours for an hour of it. Start at 480p and pay for 720p only if the policy needs it.{' '}
            <Cite id="F05-98">NVIDIA Cosmos inference benchmarks and methodology</Cite>
          </Box>
          <Box variant="p">
            Repainting is slower than writing from text: for transfer with an edge control NVIDIA lists 148.65 s
            per clip at 480p and 527.89 s at 720p on the H100. Repainting an illustrative <Toy>50</Toy> clips at
            480p is then 50 x 148.65 s = <Derived>2.1</Derived> GPU-hours. NVIDIA gives no frame count for the
            transfer rows, so time one clip of your own episode length before budgeting a dataset.{' '}
            <Cite id="F05-97">NVIDIA Cosmos inference benchmarks, transfer generation</Cite>
          </Box>
          <Box variant="p">
            Memory picks the card before speed does. NVIDIA&apos;s support matrix for its NIM (NVIDIA Inference
            Microservice, the packaged container that serves a model) prints a minimum GPU memory per device,
            which the container checks before it starts. For Cosmos3-Nano at full 16-bit precision with the model
            held on the GPU it is 58 GiB for generation and 64 GiB for transfer; with the weights stored in 8 bits
            each instead of 16 it is 44 GiB.
            Nano at full precision is therefore a job for a card of the 80 GB class, and a 48 GB card needs the
            8-bit weights or weights offloaded to host memory.{' '}
            <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>
          </Box>
          <Box variant="p">
            Leave room above those floors: the page says to treat them as minimums, attaches no resolution or
            frame count to them, and none is a measured peak of the PyTorch path the timings come from.{' '}
            <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>
          </Box>
          <Box variant="p">
            Simulated replay can feed generation. A version of Nano tuned for simulators,
            Cosmos3-Nano-Sim-Transfer, takes control video rendered by a simulator and writes up to 600 frames at
            30 fps and 480p: simulate for the positions, then repaint for the look.{' '}
            <Cite id="F05-96">NVIDIA Cosmos models reference, simulation checkpoints</Cite> Check which model a
            recipe pins before following it: Isaac Lab v3.0.0&apos;s own tutorial for the chain still pins Cosmos
            Transfer1, a 2025 model two generations behind Cosmos 3.{' '}
            <Cite id="F05-100">Isaac Lab v3.0.0 docs, augmented imitation</Cite>
          </Box>
          <ExpandableSection headerText="Cosmos 3 memory figures and what each one measures, for reference" variant="footer">
            <ul style={LIST}>
              <li>
                <strong>NIM floors.</strong> Besides the 58 GiB and 64 GiB quoted for Nano: 31 GiB for Nano when
                the weights are offloaded layer by layer to host memory, and 150 GiB per device for Cosmos3-Super,
                the 64-billion-parameter model, at 16-bit precision. Startup minimums for the NIM runtime, per device.{' '}
                <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>
              </li>
              <li>
                <strong>The framework FAQ.</strong> 32 GB for Nano and 128 GB for Super, with no resolution,
precision or workload given. 16 billion parameters at 2 bytes each is 32 GB, so the figure is the
                weights alone: plan with the NIM floors.{' '}
                <Cite id="F03-123">NVIDIA cosmos-framework FAQ, inference</Cite>
              </li>
              <li>
                <strong>Measured peaks.</strong> On one H100 80 GB, Nano peaks at 33.8 GiB for a single 1280 x 720
                image, one frame, and sits at about 50.6 to 52.1 GiB when served through TensorRT-LLM,
                NVIDIA&apos;s serving runtime, after a 189-frame warm-up. The figures are from a notes file in
                NVIDIA&apos;s cosmos-framework repository, written for coding agents and not a product document,
                and it holds no measured peak for a full 189-frame video through PyTorch. <Cite id="F03-124">NVIDIA cosmos-framework, agent skill notes</Cite>
              </li>
              <li>
                <strong>The benchmark tables.</strong> They encode memory fit in a GPU count: every Nano row uses
                one GPU at 720p, and Super&apos;s main PyTorch rows use eight. NVIDIA calls these measured setups,
                not memory requirements. <Cite id="F03-126">NVIDIA Cosmos inference benchmarks, opening notes</Cite>
              </li>
              <li>
                <strong>The low end.</strong> NVIDIA ships an adapter that keeps Nano&apos;s weights in host memory and reports
                all 21 of its test cases completing on an RTX 5070, a 12 GB card, in a host with 128 GB of memory,
                for inference only and at an unquantified cost in speed.{' '}
                <Cite id="F03-125">NVIDIA cosmos-framework, CPU offloading README</Cite>
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Go from the way a policy fails to the method that cures it and the machine that method asks for, cheapest first">
            The failure picks the method, and the method picks the machine
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            No part of the machine appears twice in the third column, so capacity left over from one method buys
            nothing for the next.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 860 }}>
              <thead>
                <tr>
                  <th style={TH}>Method</th>
                  <th style={TH}>Variety it adds</th>
                  <th style={TH}>Part it fills first</th>
                  <th style={TH}>Cost per added item</th>
                  <th style={TH}>What checks the output</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Image transforms</td>
                  <td style={TD}>The pixels, slightly</td>
                  <td style={TD}>CPU cores in the dataloader workers, or the training GPU</td>
                  <td style={TD}>Milliseconds per image (estimate); on the GPU a peak of 2.4 GB at 480x640 with a batch of 160 (LeRobot code comment)</td>
                  <td style={TD}>Nothing needed: the motion is the recorded one</td>
                  <td style={TD}>
                    <Cite id="F05-87">LeRobot transforms.py</Cite> <Cite id="F05-108">the three kinds by machine part</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Simulated replay</td>
                  <td style={TD}>Where objects are, how the arm moves</td>
                  <td style={TD}>A simulator&apos;s GPU: memory per parallel environment, plus rendering when cameras are on</td>
                  <td style={TD}>NVIDIA: 1,000 demonstrations in about 15 minutes without cameras, about 1 hour with them, about 10 hours for a hard task</td>
                  <td style={TD}>Physics and a success rule</td>
                  <td style={TD}>
                    <Cite id="F05-90">Isaac Lab v3.0.0 docs</Cite> <Cite id="F05-91">humanoid figures</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Generation with a world model</td>
                  <td style={TD}>The look of the scene, or the whole episode</td>
                  <td style={TD}>GPU tensor cores and large GPU memory</td>
                  <td style={TD}>NVIDIA: 207.78 s per 720p clip on an H100 80GB; NIM startup floor of 58 GiB</td>
                  <td style={TD}>Nothing: watch the clips</td>
                  <td style={TD}>
                    <Cite id="F03-98">Cosmos3-Nano benchmarks</Cite> <Cite id="F03-121">NIM support matrix</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Image transforms need no new machine, because they run inside the training job. Simulated replay needs
            a GPU that simulates, and with cameras on one that renders, where memory per parallel environment
            sets how many run at once. Generation needs a large-memory GPU bought for its tensor cores: NVIDIA
            lists Cosmos3-Nano for the RTX Pro 6000, H100 and B200, and Cosmos3-Super for the H200, B200 and
            GB200. <Cite id="F05-95">NVIDIA Cosmos README, models</Cite>
          </Box>
          <Box variant="p">
            The last two do not share a machine well. NVIDIA&apos;s 2025 blueprint for chaining replay into
            generation, which pins older tools, asked for an RTX card with 48 GB for simulation and a separate
            node with an H100 or better and 80 GB for Cosmos, &quot;due to differing hardware requirements&quot;.{' '}
            <Cite id="F05-94">GR00T-Mimic blueprint README</Cite>
          </Box>
          <Box variant="p">
            Take the methods in order of cost, and let the policy&apos;s failures decide how far to go. Switch on
            image transforms for the next training run, on the GPU backend (
            <code>--dataset.image_transforms.backend=gpu</code>) if the CPU cores are what that run waits on. If
            the policy fails when the block starts in a new place, build the scene in a simulator and measure the
            yield before sizing the GPU, at about 1 to 36 GPU-seconds per demonstration. If it fails when the
            room looks different, budget minutes of an 80 GB class GPU per clip, start at 480p, and watch the
            clips before you train on them.{' '}
            <Cite id="F05-59">LeRobot v0.7.0 release post</Cite>{' '}
            <Cite id="F05-108">the cost ladder per added episode</Cite>{' '}
            <Cite id="F05-94">GR00T-Mimic blueprint README</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
