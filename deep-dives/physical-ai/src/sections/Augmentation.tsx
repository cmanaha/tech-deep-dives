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
            description="You can get more training data for a policy in three ways: image transforms, simulated replay and video generation. The way your policy fails tells you which method to use, and each method needs different hardware. Of the instances that AWS lists for NVIDIA's simulator, only G7e also has enough GPU memory to run NVIDIA's video model at 16-bit precision."
          >
            11. Augmentation and Synthetic Data: Three Ways to Get More Training Data
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Extra training data helps a policy only when it contains the variety that the policy is missing. Suppose
            you record all your demonstrations at one bench, with a person driving the {ARM} to {TASK_STORY}. The
            recordings show one table, one lamp and a few block positions, so the policy learns the light of that
            lamp as part of the task. The way the policy fails tells you what kind of variety it is missing, and that
            tells you which method to use. Each method has a different bottleneck, so the method you choose also
            tells you which hardware to use.{' '}
            <Cite id="F05-108">the three kinds by machine part</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>The policy misses the block when the block starts in a new place.</strong> The policy needs
              examples with new block positions, and simulated replay can make them. A few demonstrations recorded in
              a simulator are fitted to new block positions and run again there. Each new version is kept only if a
              success check on the simulated result passes. Replay runs on a GPU, which renders the scene: it draws
              the image that each simulated camera sees.{' '}
              <Cite id="F05-89">Isaac Lab v3.0.0 docs, teleoperation and imitation learning</Cite>
            </li>
            <li>
              <strong>The policy fails under a different lamp.</strong> The policy needs examples with a new look.
              Image transforms make small random changes to each camera frame during training, such as a change in
              brightness. They add a little of this variety, and they run on the CPU cores that already prepare the
              data for training.{' '}
              <Cite id="F05-84">LeRobot transforms.py, ImageTransformsConfig</Cite> A video model can repaint whole
              episodes: it keeps the recorded motion and generates a new appearance. It needs a GPU with enough memory, and it keeps the GPU&apos;s tensor cores
              busy. Tensor cores are the units of a GPU that do the matrix arithmetic of neural networks.{' '}
              <Cite id="F05-96">NVIDIA Cosmos models reference, workflows</Cite>
            </li>
          </ul>
          <Box variant="p">
            Before you compare GPUs on speed, check which GPUs can run replay and generation at all, because each
            method rules some of them out. Isaac Sim is NVIDIA&apos;s simulator application. Some NVIDIA GPUs have
            RT cores (ray-tracing cores), which are units that speed up ray tracing. When replay draws its cameras
            in Isaac Sim, the GPU needs RT cores. Isaac Sim does not support GPUs without RT cores, and the H100 has
            none.{' '}
            <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite> Cosmos3-Nano is a video model from NVIDIA&apos;s
            Cosmos 3 family. At 16-bit precision it needs 58 GiB of GPU memory, which is more than a 48 GB card
            holds.{' '}
            <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite> Of the GPUs that AWS lists for Isaac
            Sim, only the RTX PRO 6000 Blackwell in G7e instances meets both requirements.{' '}
            <Cite id="F06-58">NVIDIA product pages, RT cores and memory</Cite>{' '}
            <Cite id="F06-60">AWS Machine Learning Blog, Isaac Lab on SageMaker AI</Cite>
          </Box>
          <Box variant="p">
            A G7e instance can therefore run both replay and generation, but it generates video more slowly than an
            H100. In NVIDIA&apos;s benchmark tables, repainting a recorded clip at 480p takes the RTX PRO 6000{' '}
            <Derived>1.65</Derived> to <Derived>3.3</Derived> times as long as it takes an H100. The ratio depends
            on which inference library NVIDIA used.{' '}
            <Cite id="F05-97">NVIDIA Cosmos inference benchmarks, transfer generation</Cite>
          </Box>
          <Figure
            cites="F05-87 F05-90 F03-98 F05-108"
            caption={
              <>
                The chart shows the time it takes to make one new sample with each method, on a single log scale: one
                transformed image (an estimate), one replayed demonstration and one generated 720p clip. On this scale
                you can see that the three costs are in milliseconds, seconds and minutes. The still images are
                renders from MuJoCo, an open-source physics simulator. In row 1, the transforms are drawn at
                illustrative strengths, and some are stronger than LeRobot&apos;s defaults. Row 2 shows randomised
                scenes that were captured separately. They stand in for simulated replays, and they also vary colour
                and light. Row 3 has no still image because no clip was generated.
              </>
            }
          >
            <AugThreeWays />
          </Figure>
          <Box variant="p">
            Two ways to get more data need no new machine. The first is to record more demonstrations at the new block
            positions. LeRobot suggests 10 episodes per block location. The recorder&apos;s defaults are 60 s per
            episode and 60 s to reset the scene, so 10 more episodes take 10 x (60 + 60) s ={' '}
            <Derived>20</Derived> minutes of a person&apos;s time at the bench (section 9, Collecting Data). The
            second is image transforms, which are a setting in the training program you already run.{' '}
            <Cite id="F05-5">LeRobot imitation-learning guide, tips for gathering data</Cite>{' '}
            <Cite id="F05-2">LeRobot dataset.py, record defaults</Cite>{' '}
            <Cite id="F05-87">LeRobot transforms.py, backend</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Image transforms are the cheapest way to add visual variety, and you switch them on with one setting. By default they run on the CPU cores that feed the training GPU. If the GPU is waiting for data, you can move the transforms onto the GPU."
          >
            Image transforms: running them on the CPU cores or on the training GPU
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An image transform makes a small random change to a camera frame each time the frame is loaded for a
            training step. For example, the frame may become somewhat brighter, be rotated slightly or be shifted by a
            few pixels. The joint angles and the actions stored with the frame stay unchanged. So the policy sees the
            same motion under many versions of the picture, and it learns to ignore the differences. The brightness
            transform, for instance, multiplies every pixel value by a random factor that is drawn again for each
            sample. In LeRobot the transforms are off by default, and the option{' '}
            <code>--dataset.image_transforms.enable=true</code> switches them on.{' '}
            <Cite id="F05-84">LeRobot transforms.py, ImageTransformsConfig</Cite>
          </Box>
          <Box variant="p">
            When the transforms are on, LeRobot applies up to 3 of them to each frame, chosen from a default set of
            six. All six are mild by default:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Brightness and contrast:</strong> each uses a random factor between 0.8 and 1.2.
            </li>
            <li>
              <strong>Saturation and sharpness:</strong> each uses a random factor between 0.5 and 1.5.
            </li>
            <li>
              <strong>Hue:</strong> the hue shifts by up to 0.05 in either direction.
            </li>
            <li>
              <strong>Affine:</strong> a single transform rotates the frame by up to 5 degrees and shifts it by up
              to 5% of its size.{' '}
              <Cite id="F05-84">LeRobot transforms.py, ImageTransformsConfig</Cite>
            </li>
          </ul>
          <Box variant="p">
            LeRobot version 0.7.0 adds eight more transforms that imitate the faults of real robot cameras. Among them are
            motion blur, JPEG compression, a random shadow and a shift in colour temperature. None of the eight is in
            the default set. If you want training to cover camera faults, you have to add these transforms by
            name.{' '}
            <Cite id="F05-86">LeRobot dataset docs, available transform types</Cite>
          </Box>
          <Box variant="p">
            The transforms do not write anything to disk. The stored video stays as it was recorded, and the
            transforms are applied as each frame is loaded. So you can change the transform settings between two
            training runs without recording again.{' '}
            <Cite id="F05-85">LeRobot dataset docs, image transforms</Cite>
          </Box>
          <Box variant="p">
            Transforms have a clear limit: they change only the picture. The block is still where you put it, and the
            arm still moves the way you moved it. So transforms do not help a policy that fails when the block starts
            in a new place. The transforms also do not adjust the actions. If you raised the rotation range far
            beyond its default of 5 degrees, the policy would see a motion that the stored actions no longer
            describe.{' '}
            <Cite id="F05-84">LeRobot transforms.py, ImageTransformsConfig</Cite>
          </Box>
          <Box variant="p">
            The dataloader is the code in a training program that loads samples and assembles them into batches. Its
            workers decode the video, and by default the same workers also apply the transforms, one sample at a
            time. All the workers share a fixed number of vCPUs (virtual CPUs). Most eight-GPU EC2 instance sizes
            have 24 vCPUs per GPU. LeRobot&apos;s documentation warns that with several cameras, the
            transforms are often the most expensive work the workers do, &quot;and the GPU ends up waiting for
            data&quot;.{' '}
            <Cite id="F05-58">LeRobot dataset docs, transforms on the GPU</Cite>{' '}
            <Cite id="F05-107">vCPUs per GPU on EC2, and what the workers do with them</Cite>
          </Box>
          <Box variant="p">
            To take this work off the CPU cores, set the transform backend to <code>gpu</code>. The workers then only
            decode the video, and the transforms run on the training GPU in chunks of 32 samples by default. There
            is a one-off compile step of 15 to 30 s for each image size. After that, the transforms share the GPU and
            its memory with the training they feed. For two frames per sample at 480x640 and a batch of 160, the
            transforms reach a peak of 2.4 GB of GPU memory at the default <code>gpu_chunk_size</code> of 32, and 6.3
            GB when the chunk size has no limit.{' '}
            <Cite id="F05-87">LeRobot transforms.py, backend and gpu_chunk_size</Cite>
          </Box>
          <Box variant="p">
            ACT (Action Chunking with Transformers) is a small imitation policy, described in section 4, Learning
            From Demonstrations. Hugging Face&apos;s release post for LeRobot v0.7.0 reports that with the transforms
            moved to the GPU, ACT trains 2.8 times faster on an H100 and 3.3 times faster on an A100. The post does
            not state the dataset, the number of cameras or the CPU. The speed-up most likely comes from freeing the
            dataloader workers, so that the GPU no longer waits for data. To check whether your own training could
            gain in the same way, look at GPU utilisation in <code>nvidia-smi</code>. GPU utilisation is the share
            of time in which at least one kernel is running on the GPU. When it stays well below full during
            training, you can expect a similar gain.{' '}
            <Cite id="F05-59">LeRobot v0.7.0 release post, Augment on the GPU</Cite>{' '}
            <Cite id="F08-30">nvidia-smi documentation, GPU utilisation</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Simulated replay turns a few demonstrations into a thousand, with the block in new places. You will be able to estimate the GPU time for each demonstration that replay keeps, from the share of attempts that succeed and from whether the simulator renders cameras. You will also see why replay in Isaac Sim needs a GPU with RT cores, which on AWS means a G-family instance."
          >
            Simulated replay: what it costs and which GPUs can run it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Isaac Lab is NVIDIA&apos;s framework for robot learning. It runs on Isaac Sim, and since version 3.0 it
            can also run without it. Isaac Lab Mimic is the replay tool in Isaac Lab. Its documented workflow starts
            from a few demonstrations that a person records by driving the arm inside the simulator.
          </Box>
          <Box variant="p">
            A physics simulator uses the forces on every body to compute where the arm and the block will be a
            moment later. One GPU can simulate hundreds of independent copies of a scene at the same time. These copies are
            called parallel environments (section 12, Physics Simulation). In replay, each copy tries one new version
            of a demonstration.{' '}
            <Cite id="F05-89">Isaac Lab v3.0.0 docs, teleoperation and imitation learning</Cite>
          </Box>
          <Box variant="p">
            Mimic first cuts each demonstration into subtasks: reach the block, grasp it, carry it and release it over
            the cup. To make a new episode, the simulator places the block and the cup in new positions. Mimic then
            shifts each recorded segment so that the gripper follows the same path relative to the object it acts
            on. It joins the segments into one candidate episode and plays it in the simulator. The physics
            simulation shows where the block ends up. If the block lands in the cup, the episode is kept. If the
            block misses, the episode is thrown away.{' '}
            <Cite id="F05-89">Isaac Lab v3.0.0 docs, teleoperation and imitation learning</Cite>
          </Box>
          <Box variant="p">
            The method comes from MimicGen, a system published in 2023. Its authors report that they generated over
            50,000 demonstrations across 18 tasks from about 200 human demonstrations. That is 50,000 / 200 ={' '}
            <Derived>250</Derived> generated demonstrations for each one a person recorded. It is also about{' '}
            <Derived>200 / 18 = 11</Derived> human demonstrations per task. With LeRobot&apos;s recorder defaults of
            60 s per episode and 60 s to reset the scene, a person can record 11 episodes in under half an hour.
            Recording by hand the <Derived>11 x 250 = 2,750</Derived> episodes that replay made from them would take
            at least <Derived>2,750 x 60 / 3,600 = 46</Derived> hours at the bench, for the resets alone.{' '}
            <Cite id="F05-88">MimicGen paper, abstract</Cite>{' '}
            <Cite id="F05-2">LeRobot dataset.py, record defaults</Cite>
          </Box>
          <Box variant="p">
            The share of candidate episodes that pass the success check is called the yield. The yield has a direct
            effect on the cost of replay, because every rejected candidate was simulated before it was rejected. So
            the GPU time per kept demonstration is the time per candidate divided by the yield. Isaac Lab&apos;s
            documentation gives yields from about 70% in simple cases down to under 1%. NVIDIA reports about 40% for
            a cube-stacking task, so each kept demonstration takes <Derived>1 / 0.4 = 2.5</Derived> candidates. At a
            yield of 1%, it takes <Derived>100</Derived> candidates.{' '}
            <Cite id="F05-89">Isaac Lab v3.0.0 docs, teleoperation and imitation learning</Cite>{' '}
            <Cite id="F05-90">Isaac Lab v3.0.0 docs, data generation figures</Cite>
          </Box>
          <Box variant="p">
            The time per candidate depends on whether the simulator renders camera images. NVIDIA gives figures for a
            cube-stacking task with a Franka research arm on one RTX PRO 6000 Blackwell. Generating 1,000
            demonstrations takes about 15 minutes when only the numerical state of the joints and objects is saved,
            and about 1 hour when camera images are saved too. Both runs succeed about 40% of the time. The
            difference comes from rendering: with cameras on, NVIDIA runs 300 parallel environments instead of
            1,000, and the run takes 4 times as long.{' '}
            <Cite id="F05-90">Isaac Lab v3.0.0 docs, data generation figures</Cite>
          </Box>
          <Box variant="p">
            The {ARM}&apos;s policy reads camera images, so its training data has to include them. The run with
            cameras, about 1 hour, is therefore the one that matches this policy. One hour for 1,000 demonstrations
            is 1 hour / 1,000 = <Derived>3.6</Derived> GPU-seconds per demonstration. NVIDIA&apos;s command sets{' '}
            <code>--generation_num_trials 1000</code>, and the command does not make clear whether the 1,000 counts
            attempts or kept demonstrations. If it counts attempts at a 40% yield, each kept demonstration costs{' '}
            <Derived>3.6 / 0.4 = 9</Derived> GPU-seconds.{' '}
            <Cite id="F05-90">Isaac Lab v3.0.0 docs, data generation figures</Cite>
          </Box>
          <Box variant="p">
            Other tasks take much more or much less time than that hour. For a humanoid pick-and-place task, NVIDIA
            gives a success rate of 65 to 80% and 18 to 40 minutes per 1,000 demonstrations. One of those runs took
            19 minutes at 80% success on one RTX 6000 Ada, which is a different card from the RTX PRO 6000
            Blackwell. For a nut-pouring task with cameras, NVIDIA gives about 10 hours per 1,000 demonstrations on
            the same RTX 6000 Ada. Per demonstration, that is <Derived>19 x 60 / 1,000 = 1.14</Derived> GPU-seconds
            for the 19-minute humanoid run and <Derived>10 x 3,600 / 1,000 = 36</Derived> for nut pouring.{' '}
            <Cite id="F05-91">Isaac Lab v3.0.0 docs, humanoid imitation figures</Cite>
          </Box>
          <Box variant="p">
            The two runs may differ in their cameras as well as in their task, so the gap does not measure task
            difficulty alone. The published figures give you a range that is <Derived>36 / 1.14 = 32</Derived> times
            wide, but not the cost of your own task. To find that cost, run a small batch of your own task and divide
            its time per candidate by its yield.{' '}
            <Cite id="F05-108">the cost ladder per added episode</Cite>
          </Box>
          <Box variant="p">
            Rendering also limits which GPUs you can use. Isaac Sim draws its simulated cameras with a ray tracer. A
            ray tracer follows a ray from each pixel into the scene to find what it hits. The costliest step is
            finding which triangle the ray hits, and the RT cores do that step.{' '}
            <Cite id="F06-57">NVIDIA Developer, ray tracing explainer</Cite> Isaac Sim&apos;s 6.2.0 requirements say
            that &quot;GPUs without RT Cores (A100, H100) are not supported&quot;. They name the RTX PRO 6000
            Blackwell as the ideal card.{' '}
            <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>
          </Box>
          <Box variant="p">
            The RT-core requirement applies to Isaac Sim as a whole, including its RTX renderer. Isaac Lab 3.0 makes
            Isaac Sim optional, and its base install includes Newton Warp. Newton Warp is a lightweight ray tracer that
            draws direct lighting only. Its documentation does not say whether it needs RT cores. We have not
            confirmed whether Mimic&apos;s runs with cameras can use Newton Warp. So the RT-core requirement is
            certain only for replay that runs in Isaac Sim. Section 13, Rendering and Ray Tracing, compares the
            renderers.{' '}
            <Cite id="F06-45">Isaac Lab v3.0.0 release notes</Cite>{' '}
            <Cite id="F06-50">Isaac Lab v3.0.0 docs, renderers</Cite>{' '}
            <Cite id="F06-51">Isaac Lab v3.0.0 install guide, rendering</Cite>
          </Box>
          <Box variant="p">
            On AWS, you therefore run replay in Isaac Sim on a G-family instance, even when you train the policy on a
            P-family instance, because the P families have data-centre GPUs without RT cores. AWS&apos;s June 2026
            list of compatible instances was written for the earlier Isaac Sim 5.1. It marks G5, G6, G6e and G7e as
            compatible, with GPUs of 24, 24, 48 and 96 GB respectively, and it marks every P family it names as
            incompatible.{' '}
            <Cite id="F06-60">AWS Machine Learning Blog, Isaac Lab on SageMaker AI</Cite>{' '}
            <Cite id="F06-58">NVIDIA product pages, RT cores and memory</Cite>
          </Box>
          <Box variant="p">
            Isaac Lab v3.0.0 includes a model of the {ARM} and a cube-stacking task set up for it, but no block-in-cup
            scene. To replay this arm&apos;s task, you have to build three things yourself: the cup scene, the
            subtasks at which Mimic cuts the demonstrations, and the success rule that decides which candidates are
            kept.{' '}
            <Cite id="F05-93">Isaac Lab v3.0.0 repository tree, SO-101 stack task</Cite>{' '}
            <Cite id="F05-89">Isaac Lab v3.0.0 docs, teleoperation and imitation learning</Cite>
          </Box>
          <Box variant="p">
            The simulator judges each candidate with physical parameters that someone entered, and those parameters
            are estimates. The Isaac Lab authors list friction, mass and the lighting for camera images among the
            parameters that are hard to estimate accurately or that can drift over time on a real robot.{' '}
            <Cite id="F06-67">Isaac Lab paper, section 5.3</Cite>
          </Box>
          <Box variant="p">
            The authors of SIMPLER, a 2024 paper, copied a real arm&apos;s controller settings into a simulator and
            replayed the actions of a recorded demonstration. In the simulator, the arm missed its grasp on the can.
            After the authors fitted
            the settings to the real arm&apos;s motion, the same replay grasped the can. If the simulator gets
            something wrong, every one of a thousand replays carries the same error. Section 14, Sim-to-Real and
            Real-to-Sim, explains how to fit the simulator to the real arm.{' '}
            <Cite id="F06-71">SIMPLER paper, section IV.A</Cite>
          </Box>
          <Box variant="p">
            Replay can vary how the scene looks as well as where the objects are. Isaac Lab 3.0.0 can randomise
            visual colours and texture materials. The difference between how simulated images and real camera images
            look is called the visual domain gap. Randomising the look narrows this gap, but it does not guarantee
            that the gap closes. The MuJoCo Playground authors trained a vision policy for the {ARM} in simulation
            and tested it on 3 robot setups under various lighting conditions. They warn that &quot;there may still
            be visual domain gap with darker shadows&quot;.{' '}
            <Cite id="F06-68">Isaac Lab v3.0.0 events.py</Cite>{' '}
            <Cite id="F06-26">MuJoCo Playground SO-101 deploy README</Cite>
          </Box>
          <ExpandableSection headerText="SkillGen: planned motion between segments, and the GPU memory it needs" variant="footer">
            <Box variant="p">
              SkillGen is a variant of the replay tool in Isaac Lab. It is meant for scenes where a straight join
              between two segments would make the arm hit something. Mimic joins the segments directly, while
              SkillGen plans a collision-free motion between them with a GPU motion planner. One environment takes
              about 9.5 GB of GPU memory, and five take about 22 GB. NVIDIA recommends at least 24 GB for one or two
              environments and 48 GB for up to about five. NVIDIA also says that the gain from running more than one
              environment is &quot;not very significant&quot;. So NVIDIA&apos;s memory figures point to a 24 GB card
              that runs one environment. With one environment on an RTX 6000 Ada, NVIDIA gives 90 to 120
              minutes for 1,000 demonstrations, which is <Derived>5.4</Derived> to <Derived>7.2</Derived>{' '}
              GPU-seconds per demonstration.{' '}
              <Cite id="F05-92">Isaac Lab v3.0.0 docs, SkillGen</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A video model can repaint a recorded episode with a new look, or invent a new episode. You will be able to budget each generated episode in GPU-minutes and choose a GPU by the minimum memory the model needs. Nothing checks the generated clips automatically, so you also need to check a sample yourself."
          >
            Video generation: GPU memory, time per clip and checking the output
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A world model is a network that predicts the next state of a scene. When a world model is used to make
            training data, it generates video (section 6, World Models). Such a model works on a compressed grid that
            is much smaller than the video. It starts from random noise on that grid and removes the noise over a
            number of passes, steered by a prompt. Each of these passes is called a denoising pass. At the end, the
            model decodes the grid into pixels.{' '}
            <Cite id="F03-95">Cosmos 3 models reference, architecture</Cite>
          </Box>
          <Box variant="p">
            You can use a world model to make training data in two ways. The first way is called transfer, and it
            repaints an episode you already have. The model takes a text prompt and a control video. A control video
            is a version of the episode reduced to its geometry, such as edges, depth or a segmentation map. The
            model writes a new video that keeps the geometry and changes the appearance. For example, the arm makes
            the same reach, grasp and release, but on a dark wooden table in evening light.{' '}
            <Cite id="F05-96">NVIDIA Cosmos models reference, workflows</Cite> Because transfer keeps the motion, the
            recorded actions still describe the new clip, so they can serve as its labels.{' '}
            <Cite id="F05-100">Isaac Lab v3.0.0 docs, augmented imitation</Cite>
          </Box>
          <Box variant="p">
            The second way invents a new episode, and DreamGen is a published recipe for it. In DreamGen, a video
            model is fine-tuned on recordings of the robot and then prompted with a first frame and an instruction. A
            second model then recovers the actions from the generated frames. That second model can be an
            inverse-dynamics model, which looks at two frames and outputs the action that happened between them. The
            paper&apos;s other option for this step is a latent-action model. The paper calls the recovered labels
            pseudo-actions, because they are inferred from a video that was itself generated.{' '}
            <Cite id="F05-101">DreamGen paper, section 1</Cite>
          </Box>
          <Box variant="p">
            The DreamGen authors tested the recipe on the SO-100, the predecessor of the {ARM}. They used two SO-100 tasks.
            One had 10 real demonstrations plus 40 generated ones, and the other had 13 real plus 50 generated. The
            authors report that the average success rate rose from 21% to 45.5%. The other robots in the paper gained
            less from the same 10 to 13 real demonstrations per task. On three Franka tasks, success rose from 23% to 37%, and
            on four humanoid tasks it rose from 37% to 46.4%.{' '}
            <Cite id="F05-102">DreamGen paper, sections 1 and 4</Cite>
          </Box>
          <Box variant="p">
            The authors also report the cost of a larger set. Generating 240,000 trajectories took 54 hours on 1,500
            L40 GPUs. That is 54 x 1,500 = 81,000 GPU-hours, and 81,000 / 240,000 = 0.34 GPU-hours per trajectory,
            which is about 20 GPU-minutes.{' '}
            <Cite id="F05-103">DreamGen paper, conclusion</Cite>
          </Box>
          <Box variant="p">
            Neither way of generating video has the success check that the simulator provides. A simulator rejects an
            episode in which the block misses the cup, but a video generator writes that clip to disk like any other.
            So check a sample of the generated clips yourself, the way the simulator would. Check that the block ends
            up in the cup. In a repainted clip, also check that the arm follows the path that its recorded actions
            describe, because those actions are the clip&apos;s labels.
          </Box>
          <Box variant="p">
            You can also combine replay and generation: simulate to get new positions, then repaint to get a new
            look. NVIDIA&apos;s Cosmos3-Nano-Sim-Transfer model takes control video rendered by a simulator and
            writes photorealistic video that matches the simulator&apos;s geometry. It writes up to 600 frames at 30
            fps (frames per second) and 480p. Isaac Lab v3.0.0 has its own tutorial for this combination, but the
            tutorial still uses Cosmos Transfer1, a 2025 model that is two generations older than Cosmos 3. If you
            want to use Cosmos 3 in that workflow, you have to connect it yourself.{' '}
            <Cite id="F05-96">NVIDIA Cosmos models reference, simulation checkpoints</Cite>{' '}
            <Cite id="F05-100">Isaac Lab v3.0.0 docs, augmented imitation</Cite>
          </Box>
          <Box variant="p">
            Generating one 720p clip of under 8 seconds keeps a data-centre GPU busy for minutes. Cosmos 3 is
            NVIDIA&apos;s current family of these video models. It comes in three sizes: Edge with 4 billion
            parameters, Nano with 16 billion and Super with 64 billion. Nano is the model that NVIDIA lists for the
            RTX PRO 6000, the H100 and the B200.{' '}
            <Cite id="F05-95">NVIDIA Cosmos README and models reference</Cite>{' '}
            <Cite id="F03-98">NVIDIA Cosmos inference benchmarks, Cosmos3-Nano text-to-video</Cite>
          </Box>
          <Box variant="p">
            NVIDIA&apos;s benchmark runs Nano through NVIDIA&apos;s PyTorch scripts on one GPU. In the benchmark, Nano
            generates a 189-frame clip at 24 fps from a text prompt. At 720p, the clip takes 207.78 s on an H100 80GB,
            114.85 s on a B200 and 786.37 s on an RTX PRO 6000 Blackwell. The RTX PRO 6000 Blackwell is the card that
            NVIDIA used for its cube-stacking replays. The clip is 7.875 s of video, so the H100 spends 207.78 / 7.875
            = 26.4 GPU-seconds on each second of 720p video.{' '}
            <Cite id="F03-98">NVIDIA Cosmos inference benchmarks, Cosmos3-Nano text-to-video</Cite>
          </Box>
          <Box variant="p">
            The generation time grows with the size of the compressed grid and with the number of denoising passes
            over it. The examples on Cosmos 3&apos;s model card use 35 passes, but you should
            confirm the count on the model card of the model you use (section 6, World Models). The compressed grid is
            4 times smaller than the video in time and 32 by 32 times smaller in space. So the 720p clip becomes (189
            / 4) x (720 / 32) x (1280 / 32) cells, which is on the order of 42,000 cells. Each denoising pass covers
            all of them.{' '}
            <Cite id="F03-96">Cosmos 3 paper, section 3.1</Cite>{' '}
            <Cite id="F03-95">Cosmos 3 models reference, architecture</Cite>
          </Box>
          <Box variant="p">
            NVIDIA&apos;s 480p resolution is 832x480 pixels. For the same clip, that gives a grid on the order of{' '}
            <Derived>18,000</Derived> cells. NVIDIA lists that clip at 59.83 s on the H100. That is 59.83 / 7.875 =
            7.6 GPU-seconds per second of video, or 7.6 GPU-hours for an hour of video. Going from 480p to 720p gives{' '}
            <Derived>2.3</Derived> times as many cells and takes <Derived>207.78 / 59.83 = 3.5</Derived> times as
            long.{' '}
            <Cite id="F05-96">NVIDIA Cosmos models reference, resolutions</Cite>{' '}
            <Cite id="F05-98">NVIDIA Cosmos inference benchmarks and methodology</Cite>
          </Box>
          <Box variant="p">
            Part of the work in each pass grows faster than the number of cells. The generator uses full attention,
            which compares every cell with every other cell. So <Derived>2.3</Derived> times as many cells means{' '}
            <Derived>2.3 x 2.3 = 5.3</Derived> times as many comparisons. In NVIDIA&apos;s timings, the higher resolution takes{' '}
            <Derived>3.5</Derived> times as long, which falls between <Derived>2.3</Derived> and{' '}
            <Derived>5.3</Derived>. This means that lowering the resolution saves more time than the drop in the
            number of cells alone would suggest.{' '}
            <Cite id="F03-95">Cosmos 3 models reference, architecture</Cite>
          </Box>
          <Box variant="p">
            A public pick-and-place dataset named after the {ARM} has 50 episodes, with 11,939 frames from two
            640x480 cameras at 30 fps. That is <Derived>11,939 / 50 / 30 = 8.0</Derived> s per episode, which is
            about the length of one generated clip. The cameras record below 720p, so start at 480p.{' '}
            <Cite id="F05-29">Hugging Face hub, svla_so101_pickplace</Cite>{' '}
            <Cite id="F05-96">NVIDIA Cosmos models reference, resolutions</Cite>
          </Box>
          <Box variant="p">
            For transfer with a control video made of edges, NVIDIA lists 148.65 s per clip at 480p and 527.89 s at
            720p on the H100. NVIDIA does not state the length of these clips. As an illustration, repainting{' '}
            <Toy>50</Toy> clips at 480p takes 50 x 148.65 s = <Derived>2.1</Derived> GPU-hours. A longer episode may
            need several clips. So before you budget for a dataset, time one clip at your own episode length.{' '}
            <Cite id="F05-97">NVIDIA Cosmos inference benchmarks, transfer generation</Cite>
          </Box>
          <Box variant="p">
            Choose the card by its memory first and by its speed second. At 16-bit precision, Nano needs a card with
            80 GB or more. NVIDIA also packages the model as a NIM (NVIDIA Inference Microservice). A NIM is a
            container that serves a model. Before it starts, the Cosmos NIM checks that each GPU has a minimum amount
            of memory. With the 16-bit model held on the GPU, that minimum is 58 GiB for generation and 64 GiB for
            transfer. With the weights stored in 8 bits each, the minimum is 44 GiB for generation and 50 GiB for
            transfer. So a 48 GB card needs the 8-bit weights for generation. For transfer, it also needs to offload
            weights to host memory.{' '}
            <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>
          </Box>
          <Box variant="p">
            Plan for more memory than these minimums. NVIDIA&apos;s support matrix for the NIM says to treat them as
            minimums. They are not tied to a resolution or a frame count, and none of them is a measured peak for the
            PyTorch scripts that NVIDIA used for its timings.{' '}
            <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite> A 48 GB card holds 44.7 GiB, which leaves
            only <Derived>0.7</Derived> GiB above the 8-bit minimum for generation. EC2 lists the L40S, the 48 GB card
            in G6e instances, at 44 GiB, which is exactly the minimum. So plan generation on a card with 80 GB or
            more.{' '}
            <Cite id="F08-45">EC2 accelerated computing specifications</Cite>
          </Box>
          <ExpandableSection headerText="Cosmos 3 memory: lower minimums, framework estimates and measured peaks" variant="footer">
            <ul style={LIST}>
              <li>
                <strong>Other NIM minimums.</strong> With its weights offloaded to host memory layer by layer, Nano
                needs 31 GiB. Cosmos3-Super needs 150 GiB per GPU at 16-bit precision.{' '}
                <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>
              </li>
              <li>
                <strong>The 32 GB and 128 GB in the cosmos-framework FAQ.</strong> The FAQ gives these figures for Nano and
                Super. They match the size of the weights alone: sixteen billion parameters at 2 bytes each is 32 GB.
                The FAQ gives no resolution, precision or workload for them. It also labels the models 8B and 32B,
                where the model cards say 16B and 64B. So plan with the NIM minimums instead.{' '}
                <Cite id="F03-123">NVIDIA cosmos-framework FAQ, inference</Cite>
              </li>
              <li>
                <strong>Measured peaks on an H100 80 GB.</strong> NVIDIA&apos;s cosmos-framework notes record a peak
                of 33.8 GiB for Nano on a single 1280 x 720 image. TensorRT-LLM is NVIDIA&apos;s runtime for serving
                large models. When Nano is served through TensorRT-LLM after a 189-frame warm-up, the notes record a
                peak of 50,623 to 52,147 MiB. They record no peak for a full 189-frame video generated through
                PyTorch, which is the path that NVIDIA&apos;s timings use.{' '}
                <Cite id="F03-124">NVIDIA cosmos-framework, agent skill notes</Cite>
              </li>
              <li>
                <strong>GPU counts in the benchmark tables.</strong> Every Nano row runs on one GPU at 720p, and
                Super&apos;s main PyTorch rows on eight. These counts describe the setups that NVIDIA measured. They
                are not memory requirements.{' '}
                <Cite id="F03-126">NVIDIA Cosmos inference benchmarks, opening notes</Cite>
              </li>
              <li>
                <strong>Running below the NIM minimums.</strong> NVIDIA has a separate adapter, outside the NIM, that
                keeps Nano&apos;s weights in host memory and streams them to the GPU. With the FP8 (8-bit floating
                point) checkpoint, the adapter completed all 21 of its test cases on an RTX 5070, a 12 GB card, in a
                host with 128 GB of memory. This works for inference only, and it is slower by an amount that the
                adapter&apos;s README does not quantify.{' '}
                <Cite id="F03-125">NVIDIA cosmos-framework, CPU offloading README</Cite>
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="First rule out the cards that each method cannot use. Then decide whether replay and generation can share one G7e instance or whether you need a second card. The decision depends on how many hours your clips take to generate."
          >
            Choosing the GPU: one G7e for both methods, or a second card
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Image transforms need no new card. Replay rendered in Isaac Sim and generation at 16-bit precision can
            share a G7e instance. G7e is the only family on AWS&apos;s June 2026 list that meets both requirements.
            NVIDIA ran its cube-stacking replays on the G7e&apos;s card, the RTX PRO 6000 Blackwell, and it lists
            Nano for that card.{' '}
            <Cite id="F06-60">AWS Machine Learning Blog, Isaac Lab on SageMaker AI</Cite>{' '}
            <Cite id="F05-90">Isaac Lab v3.0.0 docs, data generation figures</Cite>{' '}
            <Cite id="F05-95">NVIDIA Cosmos README, models</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 860 }}>
              <thead>
                <tr>
                  <th style={TH}>Method</th>
                  <th style={TH}>What to check when you choose the card</th>
                  <th style={TH}>Cards that qualify</th>
                  <th style={TH}>What rules a card out or limits it</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Image transforms</td>
                  <td style={TD}>
                    Check the CPU cores that run the dataloader workers. With the gpu backend, the transforms use a
                    peak of 2.4 GB of the training GPU&apos;s memory at 480x640 with a batch of 160.
                  </td>
                  <td style={TD}>The training instance you already have qualifies, so you buy nothing new.</td>
                  <td style={TD}>
                    The instance&apos;s vCPUs per GPU limit how many frames per second each GPU receives. Most
                    eight-GPU EC2 sizes have 24 vCPUs per GPU, and video decoding uses them too.
                  </td>
                  <td style={TD}>
                    <Cite id="F05-87">LeRobot transforms.py</Cite>{' '}
                    <Cite id="F05-107">vCPUs per GPU on EC2</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Simulated replay in Isaac Sim</td>
                  <td style={TD}>
                    Check for RT cores first, because Isaac Sim needs them for rendering. Then check the GPU memory per
                    parallel environment. For SkillGen, NVIDIA recommends 24 GB for one or two environments and 48 GB
                    for up to about five.
                  </td>
                  <td style={TD}>
                    AWS&apos;s June 2026 list names G5 (A10G, a variant of the 24 GB A10), G6 (L4, 24 GB), G6e (L40S,
                    48 GB) and G7e (RTX PRO 6000 Blackwell, 96 GB).
                  </td>
                  <td style={TD}>
                    Cards without RT cores are ruled out. These include the A100, the H100 and the GPUs in every P
                    family that AWS names.
                  </td>
                  <td style={TD}>
                    <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>{' '}
                    <Cite id="F06-60">AWS Machine Learning Blog</Cite>{' '}
                    <Cite id="F06-58">NVIDIA product pages</Cite>{' '}
                    <Cite id="F05-92">SkillGen</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Generation with Cosmos3-Nano</td>
                  <td style={TD}>
                    Check GPU memory first. At 16-bit precision, Nano needs 58 GiB to generate and 64 GiB to transfer.
                    Then compare the cards&apos; tensor cores.
                  </td>
                  <td style={TD}>The H100 80 GB (P5), the RTX PRO 6000 Blackwell 96 GB (G7e) and the B200 qualify.</td>
                  <td style={TD}>
                    A 48 GB card is below the 58 GiB minimum, so it needs 8-bit weights. A 24 GB card is below the
                    NIM&apos;s 31 GiB minimum with offload. Only NVIDIA&apos;s separate weight-streaming adapter runs
                    below that minimum.
                  </td>
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
            The cost of sharing one G7e is slower generation. On the PyTorch rows of NVIDIA&apos;s benchmark tables,
            the RTX PRO 6000 takes{' '}
            <Derived>3.0</Derived> times as long as the H100 for a 480p text-to-video clip (180.81 s against 59.83
            s). At 720p, it takes <Derived>3.8</Derived> times as long (786.37 s against 207.78 s).{' '}
            <Cite id="F05-98">NVIDIA Cosmos inference benchmarks and methodology</Cite>
          </Box>
          <Box variant="p">
            On NVIDIA&apos;s PyTorch rows for transfer, repainting an existing 480p clip takes 489.90 s on the RTX PRO
            6000 and 148.65 s on the H100. So the illustrative <Toy>50</Toy> clips take 50 x 489.90 s ={' '}
            <Derived>6.8</Derived> GPU-hours on the RTX PRO 6000 and <Derived>2.1</Derived> GPU-hours on the H100.
            That is <Derived>4.7</Derived> GPU-hours more for every 50 clips.{' '}
            <Cite id="F05-97">NVIDIA Cosmos inference benchmarks, transfer generation</Cite>
          </Box>
          <Box variant="p">
            The size of that gap depends on the inference library. NVIDIA also benchmarks Diffusers, a second
            inference library. On NVIDIA&apos;s Diffusers rows, the RTX PRO 6000 repaints a 480p clip in 217.90 s,
            which is <Derived>489.90 / 217.90 = 2.2</Derived> times faster than on its PyTorch row. The H100 takes
            132.06 s on its Diffusers row. So with Diffusers, the RTX PRO 6000 takes{' '}
            <Derived>217.90 / 132.06 = 1.65</Derived> times as long as the H100, down from <Derived>3.3</Derived>{' '}
            times with PyTorch. For the illustrative <Toy>50</Toy> clips, the gap falls from <Derived>4.7</Derived>{' '}
            GPU-hours to <Derived>50 x (217.90 - 132.06) s = 1.2</Derived> GPU-hours. NVIDIA cautions that two rows
            with the same model, GPU and resolution labels are not necessarily the same workload. So time one clip
            with the inference library you will run, on the card you are considering.{' '}
            <Cite id="F05-97">NVIDIA Cosmos inference benchmarks, transfer generation</Cite>
          </Box>
          <Box variant="p">
            To decide whether replay and generation can share one G7e, add up the hours that each job needs. On
            NVIDIA&apos;s PyTorch row, one repaint at 480p keeps the RTX PRO 6000 busy for 489.90 s. As an
            illustration, suppose replay keeps a G7e busy for <Toy>12</Toy> hours a day. In the other 12 hours, the
            G7e can repaint <Derived>12 x 3,600 / 489.90 = 88</Derived> clips, or{' '}
            <Derived>12 x 3,600 / 217.90 = 198</Derived> clips on the Diffusers row. Up to that number of clips a
            day, generation needs no new instance.{' '}
            <Cite id="F05-97">NVIDIA Cosmos inference benchmarks, transfer generation</Cite>
          </Box>
          <Box variant="p">
            Beyond that number of clips a day, you need a second card. The time per clip on each card, together with
            its price, tells you which card to choose. EC2 sells a single H100 as p5.4xlarge. It sells a single RTX PRO 6000 in G7e sizes from
            g7e.2xlarge up, including g7e.8xlarge. On NVIDIA&apos;s PyTorch rows, the H100 repaints a clip in 148.65
            s and the RTX PRO 6000 in 489.90 s. So a separate H100 costs less per clip whenever its hourly price is
            less than <Derived>3.3</Derived> times the price of the single-GPU G7e size you would run. On the
            Diffusers rows, that factor is <Derived>1.65</Derived>. When you compare, charge each whole instance for
            the hours it runs, and use the prices for your Region and purchase option as of a stated date.
            If replay also needs more hours, choose a second G7e instead, because Isaac Sim does not support the
            H100.{' '}
            <Cite id="F05-66">EC2 instance types, single-GPU sizes</Cite>{' '}
            <Cite id="F08-45">EC2 accelerated computing specifications, accelerator memory</Cite>{' '}
            <Cite id="F05-97">NVIDIA Cosmos inference benchmarks, transfer generation</Cite>{' '}
            <Cite id="F08-82">price-performance method</Cite>
          </Box>
          <Box variant="p">
            NVIDIA&apos;s 2025 blueprint for combining replay and generation splits the work in the same way. It uses
            an RTX card with 48 GB for simulation and a separate node with an H100 or better and 80 GB for Cosmos,
            &quot;due to differing hardware requirements&quot;.{' '}
            <Cite id="F05-94">GR00T-Mimic blueprint README</Cite>
          </Box>
          <Box variant="p">
            Try the methods in order of cost, cheapest first, and stop when the policy stops failing:
          </Box>
          <ol style={LIST}>
            <li>
              <strong>Image transforms.</strong> Switch on image transforms for the next training run. If GPU
              utilisation stays well below full, also add <code>--dataset.image_transforms.backend=gpu</code>.{' '}
              <Cite id="F05-59">LeRobot v0.7.0 release post</Cite>
            </li>
            <li>
              <strong>More recordings.</strong> If the policy fails when the block starts in a new place, record 10
              more episodes at each new location.{' '}
              <Cite id="F05-5">LeRobot imitation-learning guide</Cite>
            </li>
            <li>
              <strong>Simulated replay.</strong> If there are more new locations than you can record, build the scene
              in a simulator. If Isaac Sim will draw its cameras, run replay on a G-family instance. To estimate the
              cost, run a small batch and divide the time per candidate by the yield. NVIDIA&apos;s runs with cameras take <Derived>3.6</Derived> to{' '}
              <Derived>36</Derived> GPU-seconds per demonstration.{' '}
              <Cite id="F05-89">Isaac Lab v3.0.0 docs, teleoperation and imitation learning</Cite>{' '}
              <Cite id="F05-90">Isaac Lab v3.0.0 docs, data generation figures</Cite>{' '}
              <Cite id="F05-91">Isaac Lab v3.0.0 docs, humanoid imitation figures</Cite>
            </li>
            <li>
              <strong>Video generation.</strong> If the policy fails when the room looks different, repaint recorded
              episodes on a card with 80 GB or more. Start at 480p, time one clip at your own episode length on the
              card you are considering, and check the clips before you train on them. For episodes made in a
              simulator, randomise the simulator&apos;s look first.{' '}
              <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>{' '}
              <Cite id="F05-98">NVIDIA Cosmos inference benchmarks and methodology</Cite>
            </li>
          </ol>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
