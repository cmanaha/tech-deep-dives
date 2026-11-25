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

export function Augmentation() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Match the method to how the policy fails, and the method sets the GPU: of the instances AWS lists for NVIDIA's simulator, only G7e also holds NVIDIA's video model at 16-bit precision (LeRobot v0.7.0, Isaac Lab v3.0.0 and NVIDIA's Cosmos 3 pages, read 2026-11-20)"
          >
            11. Augmentation and Synthetic Data: Match the Method to the Failure and the GPU to the Method
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Extra training data helps a policy only when it carries the variety the policy lacks, so how the policy
            fails picks the method, and the method picks the part of the machine that runs out first. Recordings of
            the {ARM} driven to {TASK_STORY} at one bench show one table, one lamp and a few block positions, and
            the policy learns the lamp with the task. A policy that misses the block in a new place needs new
            positions, and replay makes them: a few demonstrations recorded in a simulator are fitted to new block
            positions and re-run there, each kept only if a success check on the simulated result passes. It runs on a GPU that renders, drawing what each
            simulated camera sees. A policy that fails under a new lamp needs a new look: image transforms give a little of it
            on the CPU cores already feeding training, and a video model repaints whole episodes on GPU memory and
            tensor cores, the units that do a network&apos;s matrix arithmetic.{' '}
            <Cite id="F05-108">the three kinds by machine part</Cite>{' '}
            <Cite id="F05-84">LeRobot transforms.py, ImageTransformsConfig</Cite>{' '}
            <Cite id="F05-89">Isaac Lab v3.0.0 docs, teleoperation and imitation learning</Cite>{' '}
            <Cite id="F05-96">NVIDIA Cosmos models reference, workflows</Cite>
          </Box>
          <Box variant="p">
            Replay and generation each rule out some GPUs before speed matters. Replay whose cameras are
            drawn in Isaac Sim, NVIDIA&apos;s simulator, needs RT cores, units some GPUs carry for ray tracing: Isaac
            Sim does not support GPUs without them, and the H100 has none. Cosmos3-Nano, NVIDIA&apos;s video model,
            needs 58 GiB of GPU memory at 16-bit precision, more than a 48 GB card holds. Of the cards AWS lists for
            Isaac Sim, only the RTX PRO 6000 Blackwell in G7e passes both tests. It runs both jobs and pays in
            speed: repainting a recorded clip, a new look over the same motion, takes it <Derived>1.65</Derived> to{' '}
            <Derived>3.3</Derived> times an H100&apos;s time at 480p on NVIDIA&apos;s benchmark rows, depending on
            the inference library NVIDIA ran.{' '}
            <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>{' '}
            <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>{' '}
            <Cite id="F06-58">NVIDIA product pages, RT cores and memory</Cite>{' '}
            <Cite id="F06-60">AWS Machine Learning Blog, Isaac Lab on SageMaker AI</Cite>{' '}
            <Cite id="F05-97">NVIDIA Cosmos inference benchmarks, transfer generation</Cite>
          </Box>
          <Figure
            cites="F05-87 F05-90 F03-98 F05-108"
            caption={
              <>
                Time per new sample on one log scale: one transformed image (an estimate), one replayed demonstration
                and one generated 720p clip, so each method&apos;s cost reads as milliseconds, seconds or minutes. The
                stills are renders from MuJoCo, an open-source physics simulator. Row 1&apos;s transforms are drawn at
                illustrative strengths, some beyond LeRobot&apos;s defaults; row 2&apos;s randomised scenes, from a
                different capture, stand in for simulated replays and also vary colour and light. Row 3 has no
                still because no clip was generated.
              </>
            }
          >
            <AugThreeWays />
          </Figure>
          <Box variant="p">
            Two answers need no new machine. New block positions can be recorded: LeRobot suggests 10 episodes per block
            location, and at the recorder&apos;s defaults of 60 s per episode and 60 s to reset, 10 more are 10 x (60
            + 60) s = <Derived>20</Derived> minutes of a person at the bench (section 9, Collecting Data). Image
            transforms are a setting in the training program you already run.{' '}
            <Cite id="F05-5">LeRobot imitation-learning guide, tips for gathering data</Cite>{' '}
            <Cite id="F05-2">LeRobot dataset.py, record defaults</Cite>{' '}
            <Cite id="F05-87">LeRobot transforms.py, backend</Cite>
          </Box>
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
            ignore the differences. Brightness, for one, multiplies every pixel value by a random factor drawn for
            each sample. The transforms are off by default, and{' '}
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
            Nothing is written to disk: the stored video stays as recorded and the transforms apply as each frame
            is loaded, so the recipe can change between two training runs without recording again. <Cite id="F05-85">LeRobot dataset docs, image transforms</Cite>{' '}
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
            sample at 480x640 and a batch of 160, the peak is 2.4 GB at the default <code>gpu_chunk_size</code> of
            32 and 6.3 GB with no limit.{' '}
            <Cite id="F05-87">LeRobot transforms.py, backend and gpu_chunk_size</Cite>
          </Box>
          <Box variant="p">
            Hugging Face&apos;s v0.7.0 release post reports that after the move ACT (Action Chunking with
            Transformers, the small imitation policy of section 4, Learning From Demonstrations) trains 2.8 times
            faster on an H100 and 3.3 times faster on an A100, with the dataset, camera count and CPU unstated. By
            our reading the gain comes from freeing the workers, so expect it when GPU utilisation in{' '}
            <code>nvidia-smi</code>, the share of time any kernel is running, sits well below full during training.{' '}
            <Cite id="F05-59">LeRobot v0.7.0 release post, Augment on the GPU</Cite>{' '}
            <Cite id="F08-30">nvidia-smi documentation, GPU utilisation</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Turn a few demonstrations into a thousand with the block in new places, price a kept one from the yield and the cameras, and pick a card with RT cores when Isaac Sim draws the cameras">
            Simulated replay needs a GPU that renders, and the yield sets the bill
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Isaac Lab Mimic is the replay tool in Isaac Lab, NVIDIA&apos;s robot-learning framework, which runs
            on Isaac Sim or, since 3.0, without it, and its documented path starts from a few demonstrations recorded by driving the arm inside
            the simulator. A physics simulator computes, from the
            forces on every body, where the arm and the block are a moment later, and one GPU can step hundreds of
            independent copies of a scene at once, called parallel environments (section 12, Physics Simulation).
            Each copy tries one new version of a demonstration.{' '}
            <Cite id="F05-89">Isaac Lab v3.0.0 docs, teleoperation and imitation learning</Cite>
          </Box>
          <Box variant="p">
            Mimic cuts each demonstration into subtasks: reach the block, grasp it, carry it, release it over the
            cup. For a new episode the simulator places the block and the cup somewhere else, and Mimic moves
            each recorded segment so the gripper keeps the same path relative to the object it acts on, joins the
            segments into one candidate, and plays it. Physics decides where the block ends up: in the cup, the
            episode is kept; missed, it is thrown away.{' '}
            <Cite id="F05-89">Isaac Lab v3.0.0 docs, teleoperation and imitation learning</Cite>
          </Box>
          <Box variant="p">
            The idea comes from MimicGen in 2023, whose authors report over 50,000 demonstrations across 18 tasks
            from about 200 human ones. That is 50,000 / 200 = <Derived>250</Derived> generated for each one a person
            gave, from about <Derived>200 / 18 = 11</Derived> human demonstrations per task. At this arm&apos;s
            recorder defaults of 60 s an episode and 60 s to reset the scene, a person records 11 in under half an
            hour; recording the <Derived>11 x 250 = 2,750</Derived> they became would take at least{' '}
            <Derived>2,750 x 60 / 3,600 = 46</Derived> hours at the bench in resets alone.{' '}
            <Cite id="F05-88">MimicGen paper, abstract</Cite>{' '}
            <Cite id="F05-2">LeRobot dataset.py, record defaults</Cite>
          </Box>
          <Box variant="p">
            The share of candidates that pass the check is the yield, and it sets the bill. A rejected candidate was
            simulated before it was rejected, so the GPU time per kept demonstration is the time per candidate
            divided by the yield. Isaac Lab&apos;s docs give a yield as high as about 70% in simple cases and as low
            as under 1%. NVIDIA reports about 40% for cube stacking, which takes <Derived>1 / 0.4 = 2.5</Derived>{' '}
            candidates per kept demonstration; at 1% it takes <Derived>100</Derived>.{' '}
            <Cite id="F05-89">Isaac Lab v3.0.0 docs, teleoperation and imitation learning</Cite>{' '}
            <Cite id="F05-90">Isaac Lab v3.0.0 docs, data generation figures</Cite>
          </Box>
          <Box variant="p">
            Cameras set the time per candidate. NVIDIA&apos;s figures for a cube-stacking task with a research arm
            from Franka, on one RTX PRO 6000 Blackwell: 1,000 demonstrations take about 15 minutes when only joint
            and object numbers are saved and about 1 hour with camera images, both at about 40% success. Rendering
            is the difference: with cameras on, NVIDIA runs 300 parallel environments where it ran 1,000, and the run
            takes 4 times as long. A policy that reads cameras needs the images, so the camera row, the hour, is
            the one that matches this arm&apos;s policy: 1 hour / 1,000 = <Derived>3.6</Derived> GPU-seconds per
            demonstration, or <Derived>3.6 / 0.4 = 9</Derived> per kept one if the 1,000 count tries at 40% yield,
            which NVIDIA&apos;s command (<code>--generation_num_trials 1000</code>) leaves open.{' '}
            <Cite id="F05-90">Isaac Lab v3.0.0 docs, data generation figures</Cite>
          </Box>
          <Box variant="p">
            Other tasks land far from that hour. For a humanoid pick-and-place NVIDIA gives 65 to 80% success and 18
            to 40 minutes per 1,000 demonstrations, with 19 minutes at 80% on one RTX 6000 Ada, a different card
            from the RTX PRO 6000 Blackwell; for a nut-pouring
            task with cameras, about 10 hours per 1,000 on the same RTX 6000 Ada. Per demonstration that is{' '}
            <Derived>1.14</Derived> GPU-seconds against <Derived>36</Derived>. The two runs may differ in cameras as
            well as in task, so the gap does not measure difficulty alone, but it shows what a published figure
            gives: a range <Derived>36 / 1.14 = 32</Derived> times wide, not your task&apos;s cost. That comes from a
            small batch of your own task: divide its time per candidate by its yield.{' '}
            <Cite id="F05-91">Isaac Lab v3.0.0 docs, humanoid imitation figures</Cite>{' '}
            <Cite id="F05-108">the cost ladder per added episode</Cite>
          </Box>
          <Box variant="p">
            Rendering also limits which GPUs qualify. Isaac Sim draws its cameras with a ray tracer, which follows a ray from
            each pixel into the scene; the RT cores do the costliest step, finding which triangle the ray hits. Its 6.2.0 requirements say &quot;GPUs without RT Cores (A100, H100) are not
            supported&quot; and name the RTX PRO 6000 Blackwell as the ideal card.{' '}
            <Cite id="F06-57">NVIDIA Developer, ray tracing explainer</Cite>{' '}
            <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>
          </Box>
          <Box variant="p">
            The requirement belongs to RTX rendering and to Isaac Sim as a whole. Isaac Lab 3.0 makes Isaac Sim
            optional and ships Newton Warp, a lightweight ray tracer that draws direct lighting only, in its base
            install. Whether Newton Warp needs RT cores is not stated on its pages, and this research did not
            establish whether Mimic&apos;s camera runs can use it, so the card rule here holds for replay run in
            Isaac Sim (section 13, Rendering and Ray
            Tracing, sorts the renderers).{' '}
            <Cite id="F06-45">Isaac Lab v3.0.0 release notes</Cite>{' '}
            <Cite id="F06-50">Isaac Lab v3.0.0 docs, renderers</Cite>{' '}
            <Cite id="F06-51">Isaac Lab v3.0.0 install guide, rendering</Cite>
          </Box>
          <Box variant="p">
            On AWS that puts replay in Isaac Sim on a G-family instance even when the policy trains on a P-family
            one: the P families carry data-centre GPUs without RT cores. AWS&apos;s June 2026 list, written for the
            earlier Isaac Sim 5.1, marks G5, G6, G6e and G7e compatible, with cards of 24, 24, 48 and 96 GB, and
            every P family it names incompatible.{' '}
            <Cite id="F06-60">AWS Machine Learning Blog, Isaac Lab on SageMaker AI</Cite>{' '}
            <Cite id="F06-58">NVIDIA product pages, RT cores and memory</Cite>
          </Box>
          <Box variant="p">
            Isaac Lab v3.0.0 ships an {ARM} robot model and a cube-stacking task set up for it, and no block-in-cup
            scene. The cup scene, the subtasks Mimic cuts its demonstrations at, and the success rule that decides
            the yield are yours to build.{' '}
            <Cite id="F05-93">Isaac Lab v3.0.0 repository tree, SO-101 stack task</Cite>{' '}
            <Cite id="F05-89">Isaac Lab v3.0.0 docs, teleoperation and imitation learning</Cite>
          </Box>
          <Box variant="p">
            The simulator judges each candidate with numbers someone typed in, and those numbers are estimates: the
            Isaac Lab authors list friction and mass, and lighting for the camera images, among the parameters that
            are hard to estimate accurately and can drift over time on a real robot. <Cite id="F06-67">Isaac Lab paper, section 5.3</Cite> The
            authors of SIMPLER, a 2024 paper, copied a real arm&apos;s controller settings into a simulator and
            replayed a recorded demonstration&apos;s actions: the grasp on the can missed, and the same replay
            grasped it once the settings were fitted to the real arm&apos;s motion. A thousand replays inherit
            whatever the simulator gets wrong; section 14, Sim-to-Real and Real-to-Sim, covers fitting it.{' '}
            <Cite id="F06-71">SIMPLER paper, section IV.A</Cite>
          </Box>
          <Box variant="p">
            Replay can vary the look as well as the positions: Isaac Lab 3.0.0 can randomise visual colours and
            texture materials. That narrows the visual domain gap, the difference between how simulated and real
            images look, without a guarantee of closing it. The MuJoCo Playground authors, who trained a vision policy for the {ARM} in
            simulation and tested it on 3 robot setups under various lighting conditions, warn that &quot;there may
            still be visual domain gap with darker shadows&quot;.{' '}
            <Cite id="F06-68">Isaac Lab v3.0.0 events.py</Cite>{' '}
            <Cite id="F06-26">MuJoCo Playground SO-101 deploy README</Cite>
          </Box>
          <ExpandableSection headerText="SkillGen: planned joins between segments, sized by GPU memory per environment" variant="footer">
            <Box variant="p">
              SkillGen is the Isaac Lab variant for scenes where a straight join between two segments would hit
              something: it plans a collision-free motion between them with a GPU motion planner, where Mimic joins
              them directly. NVIDIA&apos;s memory figures point to a 24 GB card running one environment.
              One environment takes about 9.5 GB and five about 22 GB; NVIDIA
              recommends at least 24 GB for one or two environments and 48 GB for up to about five, and calls the gain
              from more than one &quot;not very significant&quot;. NVIDIA gives 90 to 120 minutes for 1,000
              demonstrations with one environment on an RTX 6000 Ada, <Derived>5.4</Derived> to <Derived>7.2</Derived> GPU-seconds
              each.{' '}
              <Cite id="F05-92">Isaac Lab v3.0.0 docs, SkillGen</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Budget a repainted or invented episode in GPU-minutes, pick the card by its memory floor, and check the clips, because nothing else does">
            Generation is sized by GPU memory and paid in GPU-minutes per episode
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
            and an instruction, and a second model recovers the actions from the generated frames: an
            inverse-dynamics model, which looks at two frames and outputs the action that happened between them, or
            a latent-action model, the paper&apos;s other option for the same step. The paper calls the result
            pseudo-actions: labels inferred from a video that was itself generated. <Cite id="F05-101">DreamGen paper, section 1</Cite>
          </Box>
          <Box variant="p">
            DreamGen was tested on the SO-100, the predecessor of the {ARM}. On two SO-100 tasks, one with 10 real
            demonstrations plus 40 generated and one with 13 plus 50, its authors report average success rising
            from 21% to 45.5%. Their other robots gained less from the same 10 to 13 real demonstrations per task:
            23% to 37% on three Franka tasks and 37% to 46.4% on four humanoid tasks.{' '}
            <Cite id="F05-102">DreamGen paper, sections 1 and 4</Cite> They also report the
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
            Replay and generation also chain. Cosmos3-Nano-Sim-Transfer takes control video rendered by a simulator
            and writes photoreal video aligned to its geometry, up to 600 frames at 30 fps (frames per second) and
            480p: simulate for
            the positions, then repaint for the look. Isaac Lab v3.0.0&apos;s own tutorial for the chain still pins
            Cosmos Transfer1, a 2025 model two generations behind Cosmos 3, so wiring Cosmos 3 into it is your
            own work.{' '}
            <Cite id="F05-96">NVIDIA Cosmos models reference, simulation checkpoints</Cite>{' '}
            <Cite id="F05-100">Isaac Lab v3.0.0 docs, augmented imitation</Cite>
          </Box>
          <Box variant="p">
            One 720p clip of under 8 seconds occupies a data-centre GPU for minutes. Cosmos 3, NVIDIA&apos;s
            current family of these models, comes in 4, 16 and 64 billion parameters (Edge, Nano and Super), and
            Nano, the 16-billion model, is the one NVIDIA lists for the RTX PRO 6000, H100 and B200.{' '}
            <Cite id="F05-95">NVIDIA Cosmos README and models reference</Cite>{' '}
            <Cite id="F03-98">NVIDIA Cosmos inference benchmarks, Cosmos3-Nano text-to-video</Cite>
          </Box>
          <Box variant="p">
            In NVIDIA&apos;s benchmark, run through its PyTorch scripts on one GPU, Nano writes a 189-frame clip at
            24 fps from text. At 720p an H100 80GB takes 207.78 s, a B200 114.85 s and an RTX
            PRO 6000 Blackwell, the card of NVIDIA&apos;s cube-stacking replays, 786.37 s. The clip is 7.875 s of
            video, so the H100 spends 207.78 / 7.875 = 26.4 GPU-seconds on each second of 720p video.{' '}
            <Cite id="F03-98">NVIDIA Cosmos inference benchmarks, Cosmos3-Nano text-to-video</Cite>
          </Box>
          <Box variant="p">
            Time grows with the grid the model fills in and with the number of passes over it: 35 in the examples
            on Cosmos 3&apos;s model card, a count to confirm there for your model (section 6, World Models). The model works on a
            compressed grid, 4 times smaller in time and 32 by 32 times smaller in space than the video,
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
            H100, for clips of unstated length. Repainting an illustrative <Toy>50</Toy> clips at 480p is then 50 x
            148.65 s = <Derived>2.1</Derived> GPU-hours. A longer episode may need several clips, so time one
            clip of your own episode length before budgeting a dataset.{' '}
            <Cite id="F05-97">NVIDIA Cosmos inference benchmarks, transfer generation</Cite>
          </Box>
          <Box variant="p">
            Memory picks the card before speed does, and Nano at 16-bit precision is a job for a card with 80 GB or
            more. NVIDIA also packages the model as a NIM (NVIDIA Inference Microservice, a container that serves a
            model), and the container checks a minimum of GPU memory per device before it starts. With the 16-bit
            model held on the GPU that floor is 58 GiB for generation and 64 GiB for transfer. With the weights
            stored in 8 bits each it is 44 GiB and 50 GiB, so a 48 GB card needs the 8-bit weights for generation,
            and offload to host memory as well for transfer.{' '}
            <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>
          </Box>
          <Box variant="p">
            Leave room above the floors. NVIDIA&apos;s support matrix for the NIM says to treat them as minimums, they carry no resolution or
            frame count, and none is a measured peak of the PyTorch path the timings come from.{' '}
            <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite> A 48 GB card holds 44.7 GiB, which
            leaves <Derived>0.7</Derived> GiB of room above the 8-bit floor for generation, and EC2 lists the L40S,
            the 48 GB card of G6e, at 44 GiB, the floor itself: plan generation on 80 GB or more.{' '}
            <Cite id="F08-45">EC2 accelerated computing specifications</Cite>
          </Box>
          <ExpandableSection headerText="Lower floors, framework estimates and measured peaks for Cosmos 3 memory" variant="footer">
            <ul style={LIST}>
              <li>
                <strong>Other NIM floors.</strong> Nano needs 31 GiB with its weights offloaded layer by layer to
                host memory. Cosmos3-Super needs 150 GiB per device at 16-bit precision.{' '}
                <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>
              </li>
              <li>
                <strong>The framework FAQ&apos;s 32 GB and 128 GB.</strong> These figures for Nano and Super match
                the weights alone: sixteen billion parameters at 2 bytes each is 32 GB. They come with no
                resolution, precision or workload, under labels of 8B and 32B where the model cards say 16B and 64B,
                so plan with the NIM floors.{' '}
                <Cite id="F03-123">NVIDIA cosmos-framework FAQ, inference</Cite>
              </li>
              <li>
                <strong>Measured peaks on an H100 80 GB.</strong> NVIDIA&apos;s cosmos-framework notes record Nano
                peaking at 33.8 GiB for a single 1280 x 720 image, and at 50,623 to 52,147 MiB served through
                TensorRT-LLM, NVIDIA&apos;s serving runtime, after a 189-frame warm-up. They record none for a full
                189-frame video through PyTorch, the path the timings use.{' '}
                <Cite id="F03-124">NVIDIA cosmos-framework, agent skill notes</Cite>
              </li>
              <li>
                <strong>GPU counts in the benchmark tables.</strong> Every Nano row runs on one GPU at 720p and
                Super&apos;s main PyTorch rows on eight. These are measured setups, not memory requirements.{' '}
                <Cite id="F03-126">NVIDIA Cosmos inference benchmarks, opening notes</Cite>
              </li>
              <li>
                <strong>Below the NIM floors.</strong> An NVIDIA adapter outside the NIM keeps Nano&apos;s weights in
                host memory and streams them to the GPU. With the FP8 (8-bit floating point) checkpoint it completed
                all 21 of its test cases on an RTX 5070, a 12 GB card, in a host with 128 GB of memory, for
                inference only and at a speed cost the README does not quantify.{' '}
                <Cite id="F03-125">NVIDIA cosmos-framework, CPU offloading README</Cite>
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Rule out the cards each method cannot use, then run replay and generation on one G7e or add a second card, decided by the hours your clips take">
            Replay and generation can share a G7e until generation outgrows it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Transforms need no new card. Replay rendered in Isaac Sim and 16-bit generation can share G7e, the one
            family on AWS&apos;s June 2026 list to pass both tests; NVIDIA ran its cube-stacking replays on its card
            and lists Nano for it.{' '}
            <Cite id="F06-60">AWS Machine Learning Blog, Isaac Lab on SageMaker AI</Cite>{' '}
            <Cite id="F05-90">Isaac Lab v3.0.0 docs, data generation figures</Cite>{' '}
            <Cite id="F05-95">NVIDIA Cosmos README, models</Cite>
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
                  <td style={TD}>GPU memory first (58 GiB to generate, 64 GiB to transfer, at 16-bit precision), then tensor cores</td>
                  <td style={TD}>H100 80 GB (P5), RTX PRO 6000 Blackwell 96 GB (G7e), B200</td>
                  <td style={TD}>A 48 GB card, under the 58 GiB floor, needs 8-bit weights; a 24 GB card is below the NIM&apos;s 31 GiB offload floor, and only NVIDIA&apos;s separate weight-streaming adapter runs under it</td>
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
            Sharing is paid in generation time. On NVIDIA&apos;s PyTorch rows the RTX PRO 6000 takes{' '}
            <Derived>3.0</Derived> times the H100&apos;s time for a 480p text-to-video clip (180.81 s against 59.83
            s) and <Derived>3.8</Derived> times at 720p (786.37 s against 207.78 s).{' '}
            <Cite id="F05-98">NVIDIA Cosmos inference benchmarks and methodology</Cite> On NVIDIA&apos;s PyTorch transfer
            rows, repainting an existing 480p clip takes the RTX PRO 6000 489.90 s against the H100&apos;s 148.65 s, so the illustrative{' '}
            <Toy>50</Toy> clips take 50 x 489.90 s = <Derived>6.8</Derived> GPU-hours on it against{' '}
            <Derived>2.1</Derived> on the H100: <Derived>4.7</Derived> GPU-hours more on every 50 clips.{' '}
            <Cite id="F05-97">NVIDIA Cosmos inference benchmarks, transfer generation</Cite>
          </Box>
          <Box variant="p">
            The inference library moves that gap. On NVIDIA&apos;s rows for Diffusers, a second inference library, the RTX PRO
            6000 repaints a 480p clip in 217.90 s, <Derived>489.90 / 217.90 = 2.2</Derived> times faster than on its
            PyTorch row, against the H100&apos;s 132.06 s, so its time against the H100&apos;s shrinks from{' '}
            <Derived>3.3</Derived> to <Derived>217.90 / 132.06 = 1.65</Derived> times. On the illustrative <Toy>50</Toy> clips the gap falls from{' '}
            <Derived>4.7</Derived> GPU-hours to <Derived>50 x (217.90 - 132.06) s = 1.2</Derived>. NVIDIA cautions
            that rows with equal model, GPU and resolution labels need not be the same workload, so time one clip
            with the engine you will run, on the card you would buy.{' '}
            <Cite id="F05-97">NVIDIA Cosmos inference benchmarks, transfer generation</Cite>
          </Box>
          <Box variant="p">
            Whether to share is a sum of hours. On NVIDIA&apos;s PyTorch row one repaint at 480p holds the RTX PRO 6000 for 489.90 s, so
            if replay keeps a G7e busy an illustrative <Toy>12</Toy> hours a day, the other 12 hold{' '}
            <Derived>12 x 3,600 / 489.90 = 88</Derived> clips, or{' '}
            <Derived>12 x 3,600 / 217.90 = 198</Derived> on the Diffusers row. Up to that, generation needs no new
            instance.{' '}
            <Cite id="F05-97">NVIDIA Cosmos inference benchmarks, transfer generation</Cite>
          </Box>
          <Box variant="p">
            Past it, a second card is needed, and the per-clip times set which. EC2 sells the H100 singly as
            p5.4xlarge and the RTX PRO 6000 singly from g7e.2xlarge up, g7e.8xlarge among them. On NVIDIA&apos;s rows the H100 repaints a clip in 148.65 s
            where the RTX PRO 6000 takes 489.90 s, so a separate H100 costs less per clip whenever its hourly price is under{' '}
            <Derived>3.3</Derived> times the price of the single-GPU G7e size you would run, or <Derived>1.65</Derived> times on the Diffusers
            rows; charge each whole instance for the
            hours it runs, at dated prices for your Region and purchase option. A second G7e is the choice when
            replay needs more hours too, since Isaac Sim does not support the H100.{' '}
            <Cite id="F05-66">EC2 instance types, single-GPU sizes</Cite>{' '}
            <Cite id="F08-45">EC2 accelerated computing specifications, accelerator memory</Cite>{' '}
            <Cite id="F05-97">NVIDIA Cosmos inference benchmarks, transfer generation</Cite>{' '}
            <Cite id="F08-82">price-performance method</Cite>
          </Box>
          <Box variant="p">
            NVIDIA&apos;s 2025 blueprint for chaining the two made the same split: an RTX card with 48 GB for
            simulation and a separate node with an H100 or better and 80 GB for Cosmos, &quot;due to differing
            hardware requirements&quot;.{' '}
            <Cite id="F05-94">GR00T-Mimic blueprint README</Cite>
          </Box>
          <Box variant="p">
            Spend in the order of the bills, and stop where the policy stops failing. Switch on image transforms
            for the next training run, and add <code>--dataset.image_transforms.backend=gpu</code> if GPU
            utilisation sits well below full. If the policy fails where the block starts somewhere new, record 10
            more episodes at each new location. When there are more locations than sessions you can record, build the scene on a
            G-family card if Isaac Sim will draw its cameras, run a small batch, and divide the time per candidate by
            the yield; NVIDIA&apos;s runs with cameras take <Derived>3.6</Derived> to <Derived>36</Derived>{' '}
            GPU-seconds per demonstration.{' '}
            <Cite id="F05-59">LeRobot v0.7.0 release post</Cite>{' '}
            <Cite id="F05-5">LeRobot imitation-learning guide</Cite>{' '}
            <Cite id="F05-89">Isaac Lab v3.0.0 docs, teleoperation and imitation learning</Cite>{' '}
            <Cite id="F05-90">Isaac Lab v3.0.0 docs, data generation figures</Cite>{' '}
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
