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
const TASK_SENTENCE = `the ${ARM} desktop arm has been driven through the task (${TASK_STORY}) a few dozen times`;

export function Augmentation() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Pick the method by the failure the policy shows and the GPU by RT cores and memory: one G7e runs both simulated replay and video generation, at three to four times an H100's generation time (LeRobot v0.7.0, Isaac Lab v3.0.0 and NVIDIA's Cosmos 3 pages, read 2026-11-20)"
          >
            11. Augmentation and Synthetic Data: What Each Method Adds and the Machine It Needs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Extra training data helps a policy only when it carries the variety the policy lacks. Suppose{' '}
            {TASK_SENTENCE}. Every
            episode (one recorded attempt at the task) shows the same table, the same lamp and a handful of block
            positions, so a policy (the network that turns observations into actions) learns the table and the
            lamp along with the task. Image transforms vary the picture of an episode you have; simulated replay
            makes new block positions; video generation gives an episode a new look.{' '}
            <Cite id="F05-108">the three kinds by machine part</Cite>
          </Box>
          <Box variant="p">
            Each method runs out of a different part of the machine first, and for the two that need a GPU of
            their own, that part rules cards out before speed counts.
            Replay draws camera images in Isaac Sim, NVIDIA&apos;s simulator, which does not support GPUs without RT
            cores, the ray-tracing units it renders with; the H100 has none. Generation runs Cosmos3-Nano,
            NVIDIA&apos;s video model, which needs 58 GiB at full precision, more than a 48 GB card holds.
            Of the cards AWS lists for Isaac Sim, only G7e&apos;s RTX PRO 6000 Blackwell passes both tests. It runs
            both jobs, but in NVIDIA&apos;s table it writes a 480p clip in 180.81 s where an H100 takes 59.83 s,{' '}
            <Derived>3.0</Derived> times as long.{' '}
            <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>{' '}
            <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>{' '}
            <Cite id="F06-58">NVIDIA product pages, RT cores and memory</Cite>{' '}
            <Cite id="F06-60">AWS Machine Learning Blog, Isaac Lab on SageMaker AI</Cite>{' '}
            <Cite id="F05-98">NVIDIA Cosmos inference benchmarks and methodology</Cite>
          </Box>
          <Box variant="p">
            Two answers need no new machine. Recording more needs only a person: LeRobot suggests 10 episodes per block
            location, and at the recorder&apos;s defaults of 60 s per episode and 60 s to reset, 10 more are 10 x (60
            + 60) s = <Derived>20</Derived> minutes of a person at the bench (section 9, Collecting Data). Image
            transforms run on the CPU cores already feeding the training GPU.{' '}
            <Cite id="F05-5">LeRobot imitation-learning guide, tips for gathering data</Cite>{' '}
            <Cite id="F05-2">LeRobot dataset.py, record defaults</Cite>{' '}
            <Cite id="F05-87">LeRobot transforms.py, backend</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Read off which failure each method can fix from what it changes, and how far apart their times per new sample sit on a log axis">
            Only replay checks what it makes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Figure
            cites="F05-87 F05-90 F03-98 F05-108"
            caption={
              <>
                Row 1 applies three image transforms, at illustrative strengths, to a still from MuJoCo, an
                open-source physics simulator. Row 2&apos;s randomised MuJoCo scenes, from a different capture,
                stand in for simulated replays, which start from demonstrations recorded in the simulator; these
                scenes also vary colour and light. Row 3, generation, runs on tensor cores, the part of a GPU that
                does the matrix arithmetic of neural networks, and shows no clip. Times per new sample share one
                log scale; the transform time is our estimate.
              </>
            }
          >
            <AugThreeWays />
          </Figure>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Switch on the cheapest variety, and move it to the GPU when the GPU is waiting on the CPU cores">
            Image transforms load the CPU cores that feed the GPU
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each time a camera frame is loaded for a training step, it is changed a little at random: somewhat
            brighter, slightly rotated, shifted by a few pixels. The joint angles and the actions stored with the
            frame are left alone, so the policy sees one motion under many versions of the picture and learns to
            ignore the differences. Brightness, for one, multiplies every pixel value by a factor LeRobot draws
            between 0.8 and 1.2 for each sample. The transforms are off by default, and{' '}
            <code>--dataset.image_transforms.enable=true</code> switches them on.{' '}
            <Cite id="F05-84">LeRobot transforms.py, ImageTransformsConfig</Cite>
          </Box>
          <Box variant="p">
            Enabled, each frame gets up to 3 transforms drawn from six, all mild by default: brightness and contrast (factors of 0.8 to
            1.2), saturation and sharpness (0.5 to 1.5), hue (a shift within 0.05 either way) and a small move
            (rotation within 5 degrees, translation up to 5% of the frame).{' '}
            <Cite id="F05-84">LeRobot transforms.py, ImageTransformsConfig</Cite> Version 0.7.0 adds eight more
            that imitate the faults of real robot cameras, among them motion blur, JPEG compression, a random
            shadow and a shift in colour temperature. None of the eight is in the default set, so a recipe aimed at
            camera faults has to add them by name.{' '}
            <Cite id="F05-86">LeRobot dataset docs, available transform types</Cite>
          </Box>
          <Box variant="p">
            Nothing is written to disk: the dataset keeps the raw frames, so the recipe can change between two
            training runs without recording again. <Cite id="F05-85">LeRobot dataset docs, image transforms</Cite>{' '}
            A transform is a function of the picture only, and that is its limit. The block is still where you put
            it and the arm still moves as you moved it, so a policy that fails when the block starts somewhere new
            gains nothing here. Nothing adjusts the actions either, so a rotation range raised far past its 5
            degrees would show the policy a motion that the stored actions no longer describe.{' '}
            <Cite id="F05-84">LeRobot transforms.py, ImageTransformsConfig</Cite>
          </Box>
          <Box variant="p">
            By default the transforms run per sample in the same dataloader workers that decode the video (the
            dataloader is the part of a training program that assembles batches). Those workers share a fixed budget, 24 vCPUs (virtual CPUs) per GPU on most eight-GPU EC2
            sizes. LeRobot&apos;s docs warn that with several cameras the transforms are often the most expensive
            thing the workers do, &quot;and the GPU ends up waiting for data&quot;.{' '}
            <Cite id="F05-58">LeRobot dataset docs, transforms on the GPU</Cite>{' '}
            <Cite id="F05-107">vCPUs per GPU on EC2, and what the workers do with them</Cite>
          </Box>
          <Box variant="p">
            Setting the backend to <code>gpu</code> leaves the workers to decode only and applies the transforms
            per batch on the training GPU, 32 samples at a time by default, after a one-off compile of 15 to 30 s
            per image shape. The transforms then share that GPU with the training they feed: for two frames per
            sample at 480x640 and a batch of 160, LeRobot&apos;s code puts the peak at 2.4 GB with the default chunk
            of 32 against 6.3 GB with no chunking.{' '}
            <Cite id="F05-87">LeRobot transforms.py, backend and gpu_chunk_size</Cite>
          </Box>
          <Box variant="p">
            Hugging Face&apos;s v0.7.0 release post puts the gain of the move at 2.8 times for ACT (Action Chunking
            with Transformers, the small imitation policy of section 4, Learning From Demonstrations) on an H100 and
            3.3 times on an A100, and names no dataset, camera count, batch size or CPU. The gain comes from freeing
            the workers, so expect it when GPU utilisation in <code>nvidia-smi</code>, the share of time any kernel
            is running, sits well below full during training.{' '}
            <Cite id="F05-59">LeRobot v0.7.0 release post, Augment on the GPU</Cite>{' '}
            <Cite id="F08-30">nvidia-smi documentation, GPU utilisation</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Turn a few demonstrations into a thousand with the block in new places, price a kept one from the yield and the cameras, and pick a card with RT cores">
            Simulated replay needs a GPU that renders, and the yield sets the bill
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Simulated replay starts from a new recording: a few demonstrations made by driving the arm inside the
            simulator, so the episodes recorded at the bench do not feed it. A physics simulator computes, from the
            forces on every body, where the arm and the block are a moment later, and one GPU can step hundreds of
            independent copies of a scene at once, called parallel environments (section 12, Physics Simulation).
            Each copy tries one new version of a demonstration.
          </Box>
          <Box variant="p">
            A tool cuts each demonstration into subtasks: reach the block, grasp it, carry it, release it over the
            cup. For a new episode the simulator places the block and the cup somewhere else, and the tool moves
            each recorded segment so the gripper keeps the same path relative to the object it acts on, joins the
            segments into one candidate, and plays it. Physics decides where the block ends up: in the cup, the
            episode is kept; missed, it is thrown away. That is Isaac Lab Mimic, a tool in Isaac Lab, NVIDIA&apos;s
            robot-learning framework built on its simulator.{' '}
            <Cite id="F05-89">Isaac Lab v3.0.0 docs, teleoperation and imitation learning</Cite>
          </Box>
          <Box variant="p">
            The idea comes from MimicGen in 2023, whose authors report over 50,000 demonstrations across 18 tasks
            from about 200 human ones. That is 50,000 / 200 = <Derived>250</Derived> generated for each one a person
            gave, from about <Derived>200 / 18 = 11</Derived> human demonstrations per task. <Cite id="F05-88">MimicGen paper, abstract</Cite>
          </Box>
          <Box variant="p">
            The share of candidates that pass the check is the yield. A rejected candidate was simulated before it
            was rejected, so the GPU time per kept demonstration is the time per candidate divided by the yield.
            Isaac Lab&apos;s docs put the yield between about 70% in simple cases and under 1%: one divided by the
            yield gives <Derived>2.5</Derived> candidates per kept demonstration at the 40% NVIDIA reports for cube
            stacking, and <Derived>100</Derived> at 1%.{' '}
            <Cite id="F05-89">Isaac Lab v3.0.0 docs, teleoperation and imitation learning</Cite>{' '}
            <Cite id="F05-90">Isaac Lab v3.0.0 docs, data generation figures</Cite>
          </Box>
          <Box variant="p">
            Cameras set the time per candidate. NVIDIA&apos;s figures for a cube-stacking task with a research arm
            from Franka, on one RTX PRO 6000 Blackwell: 1,000 demonstrations take about 15 minutes when only joint
            and object numbers are saved and about 1 hour with camera images, both at about 40% success. Drawing
            what each simulated camera sees is called rendering: with cameras on, NVIDIA runs 300 parallel
            environments where it ran 1,000, and the run takes 4 times as long. A policy that reads cameras needs
            the images, so the hour is the figure for this arm.{' '}
            <Cite id="F05-90">Isaac Lab v3.0.0 docs, data generation figures</Cite>
          </Box>
          <Box variant="p">
            NVIDIA&apos;s figures do not say whether the 1,000 in its command,{' '}
            <code>--generation_num_trials 1000</code>, counts kept demonstrations or tries, so read the hour both
            ways. Kept, the reading the figure uses: 1 hour /
            1,000 = <Derived>3.6</Derived> GPU-seconds each. Tries at 40% yield:{' '}
            <Derived>3.6 / 0.4 = 9</Derived> GPU-seconds per kept one. Run a small batch of your own task, then
            divide its time per candidate by its yield.{' '}
            <Cite id="F05-90">Isaac Lab v3.0.0 docs, data generation figures</Cite>
          </Box>
          <Box variant="p">
            Other tasks land far from that hour. For a humanoid pick-and-place NVIDIA gives 65 to
            80% success and 18 to 40 minutes per 1,000 demonstrations, with 19 minutes on one RTX 6000 Ada (a
            different card from the Blackwell one) at 80%; for a nut-pouring task with cameras, about 10 hours per
            1,000 on the same card. Per demonstration that is <Derived>1.1</Derived> GPU-seconds against{' '}
            <Derived>36</Derived>, a 30-fold spread between two tasks, so a figure from another task cannot size
            yours.{' '}
            <Cite id="F05-91">Isaac Lab v3.0.0 docs, humanoid imitation figures</Cite>{' '}
            <Cite id="F05-108">the cost ladder per added episode</Cite>
          </Box>
          <Box variant="p">
            Rendering also rules cards out. Isaac Sim draws its cameras with a ray tracer, which follows a ray from
            each pixel into the scene; the RT cores do the costliest step, finding which triangle the ray hits. Its 6.2.0 requirements say &quot;GPUs without RT Cores (A100, H100) are not
            supported&quot; and name the RTX PRO 6000 Blackwell as the ideal card.{' '}
            <Cite id="F06-57">NVIDIA Developer, ray tracing explainer</Cite>{' '}
            <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>
          </Box>
          <Box variant="p">
            AWS&apos;s list of June 2026,
            written against Isaac Sim 5.1, marks G5 (A10G, AWS&apos;s variant of the 24 GB A10), G6 (L4, 24 GB), G6e (L40S, 48 GB) and G7e (RTX PRO 6000
            Blackwell, 96 GB) compatible and every P family it names incompatible. Replay in Isaac Sim goes on a G-family card even when the policy
            trains on a P-family one.{' '}
            <Cite id="F06-60">AWS Machine Learning Blog, Isaac Lab on SageMaker AI</Cite>{' '}
            <Cite id="F06-58">NVIDIA product pages, RT cores and memory</Cite>
          </Box>
          <Box variant="p">
            Isaac Lab v3.0.0 ships no block-in-cup scene. It ships an {ARM} robot model and a cube-stacking task set
            up for it, so the cup scene, and the success rule that decides the yield, are yours to build. Check that
            Mimic is registered for that task before planning around it.{' '}
            <Cite id="F05-93">Isaac Lab v3.0.0 repository tree, SO-101 stack task</Cite>
          </Box>
          <Box variant="p">
            Physics checks each candidate with the simulator&apos;s numbers, and those numbers are estimates: the
            Isaac Lab authors list friction, mass and lighting among the parameters that are hard to estimate
            accurately and can drift over time on a real robot. <Cite id="F06-67">Isaac Lab paper, section 5.3</Cite> The
            authors of SIMPLER, a 2024 paper, copied a real arm&apos;s controller settings into a simulator and
            replayed a recorded demonstration&apos;s actions: the grasp on the can missed, and the same replay
            grasped it once the settings were fitted to the real arm&apos;s motion. A thousand replays inherit
            whatever the simulator gets wrong; section 14, Sim-to-Real and Real-to-Sim, covers fitting it.{' '}
            <Cite id="F06-71">SIMPLER paper, section IV.A</Cite>
          </Box>
          <Box variant="p">
            Replay can vary the look as well as the positions: Isaac Lab 3.0.0 can randomise visual colours and
            texture materials. That narrows the difference between how simulated and real images look without a
            guarantee of closing it. The MuJoCo Playground authors, who trained a vision policy for the {ARM} in
            simulation and tested it on 3 robot setups under various lighting conditions, warn that &quot;there may
            still be visual domain gap with darker shadows&quot;.{' '}
            <Cite id="F06-68">Isaac Lab v3.0.0 events.py</Cite>{' '}
            <Cite id="F06-26">MuJoCo Playground SO-101 deploy README</Cite>
          </Box>
          <ExpandableSection headerText="SkillGen: planned joins between segments, sized by GPU memory per environment" variant="footer">
            <Box variant="p">
              SkillGen is the Isaac Lab variant that plans a collision-free motion between the skill segments with
              a GPU motion planner, where Mimic joins them directly; it is for scenes where a direct join would hit
              something. Here memory per environment picks the card. NVIDIA gives about 9.5 GB of GPU memory for one
              environment and about 22 GB for five, recommends at least 24 GB for one or two environments and 48 GB
              for up to about five, and states that the gain from more than one environment is not very
              significant, so a 24 GB card running one environment is the buy its figures point to.{' '}
              <Cite id="F05-92">Isaac Lab v3.0.0 docs, SkillGen</Cite>
            </Box>
            <Box variant="p">
              NVIDIA gives 90 to 120 minutes for 1,000 demonstrations with one environment on an RTX 6000 Ada, or{' '}
              <Derived>5.4</Derived> to <Derived>7.2</Derived> GPU-seconds each, within the <Derived>3.6</Derived> to{' '}
              <Derived>9</Derived> of Mimic&apos;s cube stacking, on a different card.{' '}
              <Cite id="F05-92">Isaac Lab v3.0.0 docs, SkillGen</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Budget a repainted or invented episode in GPU-minutes, pick the card by its memory floor, and check the clips, because nothing else does">
            Generation loads GPU memory and tensor cores for minutes per 720p clip
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A world model that generates video starts from noise on a compressed grid, cleans it over a number of
            passes steered by a prompt, and decodes the grid to pixels (section 6, World Models).{' '}
            <Cite id="F03-95">Cosmos 3 models reference, architecture</Cite> As a source of training data it is
            used in two ways. Transfer repaints an episode you have. The model takes a text prompt and a
            control video, a version of the episode reduced to its shapes (edges, depth or a segmentation map), and
            writes a new video that keeps the geometry and changes the appearance: the same reach, grasp and
            release, on a dark wooden table in evening light.{' '}
            <Cite id="F05-96">NVIDIA Cosmos models reference, workflows</Cite>
          </Box>
          <Box variant="p">
            Because the motion is kept, the recorded actions still label the new clip.{' '}
            <Cite id="F05-100">Isaac Lab v3.0.0 docs, augmented imitation</Cite> The second way invents the
            episode. In the DreamGen recipe a video model is fine-tuned on the robot and prompted with a first frame
            and an instruction, and the actions are recovered afterwards by a second model: an inverse-dynamics
            model (a network that looks at two frames and outputs the action that happened between them) or a
            latent-action model. The paper calls the result pseudo-actions: labels inferred
            from a video that was itself generated. <Cite id="F05-101">DreamGen paper, section 1</Cite>
          </Box>
          <Box variant="p">
            DreamGen was tested on the SO-100, the predecessor of the {ARM}. With 10 and 13 real demonstrations
            per task plus 40 and 50 generated ones, its authors report average success on two SO-100 tasks rising
            from 21% to 45.5%. <Cite id="F05-102">DreamGen paper, sections 1 and 4</Cite> They also report the
            bill for a larger set: 240,000 generated trajectories took 54 hours on 1,500 L40 GPUs. That is 54 x
            1,500 = 81,000 GPU-hours, and 81,000 / 240,000 = 0.34 GPU-hours, about 20 GPU-minutes per trajectory.{' '}
            <Cite id="F05-103">DreamGen paper, conclusion</Cite>
          </Box>
          <Box variant="p">
            Neither way has the simulator&apos;s test. A simulator rejects an episode where the block misses the
            cup; a generator writes that clip to disk like any other. Check a sample of the clips the way the
            simulator would: the block ends in the cup, and in a repaint the arm follows the path its recorded
            actions describe, because those actions are the labels.
          </Box>
          <Box variant="p">
            One 720p clip of under 8 seconds occupies a data-centre GPU for minutes. Cosmos 3 is NVIDIA&apos;s
            current family of these models, and Cosmos3-Nano, its 16-billion-parameter middle size, is the one
            listed for the RTX Pro 6000, H100 and B200.{' '}
            <Cite id="F05-95">NVIDIA Cosmos README and models reference</Cite>{' '}
            <Cite id="F03-98">NVIDIA Cosmos inference benchmarks, Cosmos3-Nano text-to-video</Cite>
          </Box>
          <Box variant="p">
            NVIDIA&apos;s benchmark, run through its PyTorch scripts, has Nano writing one 189-frame clip at 24 fps
            (frames per second) from text on one GPU: at 720p, 207.78 s on an
            H100 80GB, 114.85 s on a B200 and 786.37 s on an RTX PRO 6000 Blackwell, the card of NVIDIA&apos;s
            cube-stacking replays. The clip is 7.875 s of video, so the H100 spends 207.78 / 7.875 = 26.4
            GPU-seconds on each second of 720p video.{' '}
            <Cite id="F03-98">NVIDIA Cosmos inference benchmarks, Cosmos3-Nano text-to-video</Cite>
          </Box>
          <Box variant="p">
            Time grows with the grid the model fills in and with the number of passes over it, 35 in the model
            card&apos;s examples (section 6, World Models). The model works on a compressed grid, 4 times smaller in time and 32 by 32 times smaller in space than the video,
            so that 720p clip is (189 / 4) x (720 / 32) x (1280 / 32), on the order of 42,000 cells, and each
            denoising pass covers all of them. <Cite id="F03-96">Cosmos 3 paper, section 3.1</Cite>{' '}
            <Cite id="F03-95">Cosmos 3 models reference, architecture</Cite>
          </Box>
          <Box variant="p">
            NVIDIA&apos;s 480p is 832x480, on the order of <Derived>18,000</Derived> cells for the same clip, and
            NVIDIA lists that clip at 59.83 s on the H100: 59.83 / 7.875 = 7.6 GPU-seconds per second of video, or
            7.6 GPU-hours for an hour of it. At 720p, <Derived>2.3</Derived> times the cells take{' '}
            <Derived>207.78 / 59.83 = 3.5</Derived> times as long.{' '}
            <Cite id="F05-96">NVIDIA Cosmos models reference, resolutions</Cite>{' '}
            <Cite id="F05-98">NVIDIA Cosmos inference benchmarks and methodology</Cite>
          </Box>
          <Box variant="p">
            Part of each pass grows faster than the cell count. The generator uses full attention, which compares
            every cell with every other, so <Derived>2.3</Derived> times the cells make{' '}
            <Derived>2.3 x 2.3 = 5.3</Derived> times the comparisons, and the measured <Derived>3.5</Derived> falls
            between the two. A step down in resolution saves more time than its share of cells.{' '}
            <Cite id="F03-95">Cosmos 3 models reference, architecture</Cite>
          </Box>
          <Box variant="p">
            A public 50-episode pick-and-place dataset named for the {ARM} has 11,939 frames from two 640x480
            cameras at 30 fps: <Derived>11,939 / 50 / 30 = 8.0</Derived> s per episode, about one generated clip,
            at a resolution below 720p. Start at 480p.{' '}
            <Cite id="F05-29">Hugging Face hub, svla_so101_pickplace</Cite>{' '}
            <Cite id="F05-96">NVIDIA Cosmos models reference, resolutions</Cite>
          </Box>
          <Box variant="p">
            For transfer with an edge control NVIDIA lists 148.65 s per clip at 480p and 527.89 s at 720p on the
            H100, clip length not stated. Repainting an illustrative <Toy>50</Toy> clips at 480p is then 50 x
            148.65 s = <Derived>2.1</Derived> GPU-hours. A longer episode is several clips, so time one clip of
            your own episode length before budgeting a dataset.{' '}
            <Cite id="F05-97">NVIDIA Cosmos inference benchmarks, transfer generation</Cite>
          </Box>
          <Box variant="p">
            Memory picks the card before speed does. NVIDIA also packages the model as a NIM (NVIDIA Inference
            Microservice, a container that serves a model), and the NIM&apos;s support matrix prints a minimum GPU
            memory per device, which the container checks before it starts.
          </Box>
          <Box variant="p">
            For Cosmos3-Nano at full 16-bit precision with the model
            held on the GPU it is 58 GiB for generation and 64 GiB for transfer; with the weights stored in 8 bits
            each instead of 16 it is 44 GiB for generation and 50 GiB for transfer. Nano at full precision is
            therefore a job for a card with 80 GB or more, and a 48 GB card needs the 8-bit weights for
            generation, and offload to host memory as well for transfer.{' '}
            <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>
          </Box>
          <Box variant="p">
            Leave room above those floors. NVIDIA&apos;s matrix says to treat them as minimums, attaches no
            resolution or frame count to them, and none is a measured peak of the PyTorch path the timings come
            from. <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite> A 48 GB card holds 44.7 GiB,
            which leaves <Derived>0.7</Derived> GiB above the 8-bit floor for generation.{' '}
            <Cite id="F08-45">EC2 accelerated computing specifications</Cite>
          </Box>
          <ExpandableSection headerText="Cosmos 3 memory figures and what each one measures, for reference" variant="footer">
            <ul style={LIST}>
              <li>
                <strong>NIM floors.</strong> Nano needs 31 GiB when the weights are offloaded layer by layer to host
                memory, and Cosmos3-Super, the 64-billion-parameter model, needs 150 GiB per device at 16-bit
                precision. These are startup minimums for the NIM runtime, per device.{' '}
                <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>
              </li>
              <li>
                <strong>The framework FAQ.</strong> It gives 32 GB for Nano and 128 GB for Super, with no
                resolution, precision or workload, and labels the models 8B and 32B where the model cards say 16B
                and 64B. At the model cards&apos; 16 billion parameters, 2 bytes each is 32 GB, which suggests the
                FAQ figure covers the weights alone: plan with the NIM floors.{' '}
                <Cite id="F03-123">NVIDIA cosmos-framework FAQ, inference</Cite>
              </li>
              <li>
                <strong>Measured peaks.</strong> An H100 80 GB holds Nano with room to spare: 33.8 GiB at peak for a
                single 1280 x 720 image, and 50,623 to 52,147 MiB when served through TensorRT-LLM, NVIDIA&apos;s
                serving runtime, after a 189-frame warm-up. Both come from notes in NVIDIA&apos;s
                cosmos-framework repository, and no peak for a full 189-frame video through PyTorch is among
                them. <Cite id="F03-124">NVIDIA cosmos-framework, agent skill notes</Cite>
              </li>
              <li>
                <strong>The benchmark tables.</strong> They encode memory fit in a GPU count: every Nano row uses
                one GPU at 720p, and Super&apos;s main PyTorch rows use eight. NVIDIA calls these measured setups,
                not memory requirements.{' '}
                <Cite id="F03-126">NVIDIA Cosmos inference benchmarks, opening notes</Cite>
              </li>
              <li>
                <strong>Below the NIM floors.</strong> A separate path, not the NIM: an adapter from NVIDIA keeps
                Nano&apos;s weights in host memory and streams them to the GPU. With the FP8 (8-bit floating point)
                checkpoint it completed all 21 of its test cases on an RTX 5070, a 12 GB card, in a host with 128 GB
                of memory, for inference only and at a speed cost the README does not quantify.{' '}
                <Cite id="F03-125">NVIDIA cosmos-framework, CPU offloading README</Cite>
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Pick each method's card from what rules cards out, and choose between one card for both and a separate generator from how much you generate">
            Replay and generation can share a G7e until generation outgrows it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Transforms need no new card, replay needs RT cores and generation needs memory, and one card has
            both.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 860 }}>
              <thead>
                <tr>
                  <th style={TH}>Method</th>
                  <th style={TH}>What decides the card</th>
                  <th style={TH}>Cards that qualify</th>
                  <th style={TH}>What rules a card out</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Image transforms</td>
                  <td style={TD}>CPU cores in the dataloader workers; on the gpu backend, a peak of 2.4 GB of the training GPU&apos;s memory at 480x640 with a batch of 160</td>
                  <td style={TD}>The training instance itself, with nothing new bought</td>
                  <td style={TD}>Its vCPUs per GPU, 24 on most eight-GPU EC2 sizes and shared with video decode, cap the frames per second each GPU receives</td>
                  <td style={TD}>
                    <Cite id="F05-87">LeRobot transforms.py</Cite>{' '}
                    <Cite id="F05-107">vCPUs per GPU on EC2</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Simulated replay in Isaac Sim</td>
                  <td style={TD}>RT cores for rendering, then GPU memory per parallel environment (SkillGen: 24 GB for one or two, 48 GB for up to about five)</td>
                  <td style={TD}>G5 (A10G, a variant of the 24 GB A10), G6 (L4, 24 GB), G6e (L40S, 48 GB) and G7e (RTX PRO 6000 Blackwell, 96 GB) on AWS&apos;s list of June 2026</td>
                  <td style={TD}>No RT cores: the A100, the H100 and every P family AWS names</td>
                  <td style={TD}>
                    <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>{' '}
                    <Cite id="F06-60">AWS Machine Learning Blog</Cite>{' '}
                    <Cite id="F06-58">NVIDIA product pages</Cite>{' '}
                    <Cite id="F05-92">SkillGen</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Generation with Cosmos3-Nano</td>
                  <td style={TD}>GPU memory first (58 GiB to generate, 64 GiB to transfer, at full precision), then tensor cores</td>
                  <td style={TD}>H100 80 GB (P5), RTX PRO 6000 Blackwell 96 GB (G7e), B200</td>
                  <td style={TD}>Under 58 GiB a 48 GB card needs 8-bit weights; a 24 GB card is below the NIM&apos;s 31 GiB offload floor, and only NVIDIA&apos;s separate weight-streaming adapter runs under it</td>
                  <td style={TD}>
                    <Cite id="F03-121">NIM support matrix</Cite>{' '}
                    <Cite id="F05-95">Cosmos README</Cite>{' '}
                    <Cite id="F06-58">NVIDIA product pages</Cite>{' '}
                    <Cite id="F03-125">CPU offloading README</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            The RTX PRO 6000 Blackwell sits in two rows: it has RT cores and 96 GB, NVIDIA ran its cube-stacking
            replays on it, and NVIDIA lists Nano for it. Of the families on AWS&apos;s June 2026 list it is the only
            one above Nano&apos;s 58 GiB floor, so G7e is where replay in Isaac Sim and full-precision
            generation can share a machine.{' '}
            <Cite id="F06-58">NVIDIA product pages, RT cores and memory</Cite>{' '}
            <Cite id="F05-90">Isaac Lab v3.0.0 docs, data generation figures</Cite>{' '}
            <Cite id="F05-95">NVIDIA Cosmos README, models</Cite>{' '}
            <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>{' '}
            <Cite id="F06-60">AWS Machine Learning Blog, Isaac Lab on SageMaker AI</Cite>
          </Box>
          <Box variant="p">
            Sharing is paid in generation time. NVIDIA&apos;s table has that card writing the 189-frame clip in
            180.81 s at 480p against 59.83 s on the H100, <Derived>3.0</Derived> times as long, and in 786.37 s
            against 207.78 s at 720p, <Derived>3.8</Derived> times.{' '}
            <Cite id="F05-98">NVIDIA Cosmos inference benchmarks and methodology</Cite> For transfer it lists
            489.90 s per 480p clip against the H100&apos;s 148.65 s, so repainting the illustrative <Toy>50</Toy>{' '}
            clips is 50 x 489.90 s = <Derived>6.8</Derived> GPU-hours on it against <Derived>2.1</Derived> on the
            H100, in NVIDIA&apos;s PyTorch rows: <Derived>4.7</Derived> GPU-hours more on every 50 clips.{' '}
            <Cite id="F05-97">NVIDIA Cosmos inference benchmarks, transfer generation</Cite>
          </Box>
          <Box variant="p">
            The engine moves that gap. In the same table&apos;s rows for Diffusers, a second inference library
            NVIDIA benchmarks, the RTX PRO 6000 repaints a 480p clip in 217.90 s against the H100&apos;s 132.06 s,
            though NVIDIA&apos;s methodology warns that equal model, GPU and resolution labels do not establish an
            identical workload. Time one clip with the engine you will run, on the card you would buy.{' '}
            <Cite id="F05-97">NVIDIA Cosmos inference benchmarks, transfer generation</Cite>
          </Box>
          <Box variant="p">
            Keep both jobs on one G7e while the extra generation hours fit in the time the card would otherwise
            sit idle between replay runs. Past that, give generation its own H100, which EC2 sells singly as
            p5.4xlarge: the split NVIDIA&apos;s 2025 blueprint for chaining the two asked for, an RTX card with 48 GB
            for simulation and a separate node with an H100 or better and 80 GB for Cosmos, &quot;due to differing
            hardware requirements&quot;. To put money on either side, multiply its hours by a dated hourly price
            for your Region and purchase option, charging the whole instance even when a job uses part of it.{' '}
            <Cite id="F05-66">EC2 instance types, single-GPU sizes</Cite>{' '}
            <Cite id="F05-94">GR00T-Mimic blueprint README</Cite>{' '}
            <Cite id="F08-82">price-performance method</Cite>
          </Box>
          <Box variant="p">
            Replay and generation also chain. Cosmos3-Nano-Sim-Transfer takes control video rendered by a simulator
            and writes photoreal video aligned to its geometry, up to 600 frames at 30 fps and 480p: simulate for
            the positions, then repaint for the look. Isaac Lab v3.0.0&apos;s own tutorial for the chain still pins
            Cosmos Transfer1, a 2025 model two generations behind Cosmos 3, so wiring Cosmos 3 into it is your
            own work.{' '}
            <Cite id="F05-96">NVIDIA Cosmos models reference, simulation checkpoints</Cite>{' '}
            <Cite id="F05-100">Isaac Lab v3.0.0 docs, augmented imitation</Cite>
          </Box>
          <Box variant="p">
            Spend in the order of the bills, and stop where the policy stops failing. Switch on image transforms
            for the next training run, and add <code>--dataset.image_transforms.backend=gpu</code> if GPU
            utilisation sits well below full. If the policy fails where the block starts somewhere new, record 10 more episodes at
            each new location. When there are more locations than sessions you can record, build the scene on a
            G-family card, run a small batch, and divide the time per candidate by the yield; NVIDIA&apos;s tasks
            span <Derived>1.1</Derived> to <Derived>36</Derived> GPU-seconds per demonstration.{' '}
            <Cite id="F05-59">LeRobot v0.7.0 release post</Cite>{' '}
            <Cite id="F05-5">LeRobot imitation-learning guide</Cite>{' '}
            <Cite id="F05-89">Isaac Lab v3.0.0 docs, teleoperation and imitation learning</Cite>{' '}
            <Cite id="F05-91">Isaac Lab v3.0.0 docs, humanoid imitation figures</Cite>
          </Box>
          <Box variant="p">
            If it fails when the room looks different, repaint recorded episodes on a card with 80 GB or more: start
            at 480p, time one clip of your own episode length on the card you would buy, and check the clips before
            you train on them. For episodes made in a simulator, randomise its look first.{' '}
            <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>{' '}
            <Cite id="F05-98">NVIDIA Cosmos inference benchmarks and methodology</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
