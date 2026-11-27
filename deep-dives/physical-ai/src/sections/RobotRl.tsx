import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Toy, Derived } from '../components/Cite';
import { Figure } from '../components/Figure';
import { Formula, M } from '../components/Math';
import { RlLanes } from '../components/figures/RlLanes';
import { ARM, TASK_STORY, SIM_TASK, SIM_TASK_PLAIN, SIM_TASK_GAP } from '../lib/task';

const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };
const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function RobotRl() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Reinforcement learning improves the model that controls a robot by letting it practise the task and scoring every attempt. A robot RL run follows one of three approaches: a small policy practises in a simulator, a large pretrained policy practises in a simulator or on real robots, or the policy practises on the real arm with a person next to it. Each approach has a different bottleneck, so once you know which one a run uses, you know which machine it needs and what limits its speed."
          >
            8. Reinforcement Learning for Robots: Training in Simulation and on the Real Arm
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Reinforcement learning (RL) trains the policy from its own attempts at a task. The policy is the model
            that controls the arm: it reads the camera images and the joint angles and sets the targets for the
            motors. An attempt is made of control steps. A control step is one decision by the policy and the motion
            that follows it. Every attempt gets a score, and RL moves the policy toward the attempts that scored
            well, so it needs scored attempts in large numbers. Robot RL follows one of three approaches, and each one
            has a different bottleneck:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>In a simulator.</strong> A small policy practises in a simulator. A simulator is a program that computes how the arm and the objects around
              it move, so an attempt needs no hardware. The {ARM} is the six-motor desktop arm on the bench, and its RL
              recipe comes from MuJoCo Playground, a suite of simulated robot tasks. By default, the recipe runs
              4,096 simulated arms for 16 control steps each and repeats that 3,000 times. That is 4,096 x 16 x 3,000
              = 196,608,000, or about 197 million control steps. At the policy&apos;s rate of 10 decisions a second, that
              is about 228 days of one arm moving without a pause. The whole run uses one GPU. The policy sees
              the scene through a camera, and in NVIDIA&apos;s benchmark of another robot, adding a camera cut the
              simulator&apos;s throughput to about half.{' '}
              <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>{' '}
              <Cite id="F04-55">Isaac Lab 3.0 benchmark file, Kuka-Allegro rows</Cite>
            </li>
            <li>
              <strong>On a pretrained policy.</strong> Here RL starts from a large pretrained model that already does
              the task some of the time, and the model practises in a simulator or on real robots. The run needs only hundreds of attempts per round of retraining, but every control step of
              each attempt is a pass through that large model.
            </li>
            <li>
              <strong>On the real arm.</strong> The policy practises on the real arm, with a person next to it. In
              LeRobot&apos;s example for this approach, an episode (one attempt at
              the task) runs for at most 20 s, and then the program waits 5 s while the scene is reset. That is 20 + 5
              = <Derived>25</Derived> s per attempt, so the arm can make at most <Derived>3,600</Derived> /{' '}
              <Derived>25</Derived> = <Derived>144</Derived> attempts an hour.{' '}
              <Cite id="F04-77">LeRobot v0.7.0 hilserl.mdx</Cite>
            </li>
          </ul>
          <Box variant="p">
            So the first thing to find out about any robot RL recipe is which of the three approaches it uses. The
            answer tells you which resource runs out first. It also tells you what a faster GPU cannot change: the
            20 s of arm motion, the 5 s reset and the person.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="An RL run needs many attempts at the task and a reward that scores each one. Once you know which approach a recipe uses, you can tell what the run will wait on."
          >
            What RL trains on: attempts and a reward for each
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The policy from section 4, Learning From Demonstrations, copies what a person showed it. Suppose that,
            when you ask it to {TASK_STORY}, it closes the gripper on the block most of the time. Now and then,
            though, the gripper closes a little early and the block skids away (this is an illustration, not a
            measured result). More demonstrations give the policy more examples of what it has already seen. What it
            lacks is its own attempts, including the failed ones, and a signal that says which attempts succeeded.
          </Box>
          <Box variant="p">
            That signal is called the reward. The reward is a number that scores an attempt, and it can be as simple
            as 1 when the block ends in the cup and 0 otherwise. Every attempt needs a reward, so every recipe needs
            something that produces one. In LeRobot&apos;s real-arm recipe, a small image classifier can produce it,
            or a person can mark each success by hand on a gamepad or keyboard.{' '}
            <Cite id="F04-77">LeRobot v0.7.0 hilserl.mdx</Cite>
          </Box>
          <Box variant="p">
            In RL writing, an attempt by the current policy is called a trial or a rollout. It is an episode, as in
            section 4, with the policy driving the arm instead of a person. PPO (Proximal Policy Optimization) is the
            RL algorithm that the simulator recipes in this section use. It alternates between two phases: it
            collects a batch of attempts, and then it updates the policy from that batch. The batch records what the
            policy did before the update. After a few updates, the policy has changed enough that the batch no longer
            shows what it would do now. So PPO makes only a few passes over each batch, then discards it and collects
            a new one.{' '}
            <Cite id="F11-4">PPO paper, sections 2.1 and 3</Cite> The{' '}
            <Link href="../rl-agentic-loops/">Learning From Feedback dive</Link> derives the algorithm in full.
          </Box>
          <Box variant="p">
            The figure below shows the three approaches side by side and what each run waits on. A run in a
            simulator needs no hardware for its attempts (section 12, Physics Simulation), so it waits on the number
            of steps per second that the simulator computes. A run on a pretrained policy starts from a VLA. A VLA
            (vision-language-action model) is the kind of large network described in section 5, Vision-Language-Action
            Models: it reads camera images and a text instruction and outputs a chunk of future actions. In that run,
            every control step is a forward pass of the VLA. A run on the real arm waits on the arm&apos;s own motion
            for every attempt, then on a reset, then on a person&apos;s attention.
          </Box>
          <Figure
            cites="F04-58 F04-69 F04-77 F04-76"
            caption={
              <>
                Each of the three panels shows one approach. One dot is one arm attempting the task, and the
                dots have the same size in every panel: the simulator panel holds 4,096 arms and the real-arm panel
                holds one. In each strip, the widest part is what that approach waits on. Only the real-arm strip is
                drawn to scale in time.
              </>
            }
          >
            <RlLanes />
          </Figure>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A simulator recipe is defined by three numbers in its configuration file, and you multiply them to get the number of control steps in the run. NVIDIA's benchmark shows that adding a camera cut the simulator's throughput to about half on a manipulation task."
          >
            RL in a simulator: thousands of simulated arms on one GPU
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A simulator on a GPU advances many independent copies of the scene in one batch. Each copy of the scene
            (an arm, a table and a cube) is called an environment. When an environment finishes its attempt, the
            program puts it back at its starting state. No person has to reset anything, so the number of attempts
            is limited only by how many steps the GPU can compute.
          </Box>
          <Box variant="p">
            MuJoCo Playground 1.0.1, a suite of simulated robot tasks from Google DeepMind, ships such a recipe for
            the {ARM}. In the <code>{SIM_TASK}</code> task, PPO trains a policy that sees a 64 x 64 image from a
            simulated wrist camera and acts 10 times a second. The trained policy then runs on the real arm with no
            further training. This is called zero-shot deployment. The shipped task covers only the pick half of the
            task: the policy learns to {SIM_TASK_PLAIN}, and the release has no task for {SIM_TASK_GAP}.{' '}
            <Cite id="F04-57">MuJoCo Playground v1.0.1, SO-101 deploy README and task.py</Cite>
          </Box>
          <Box variant="p">
            The default recipe is set by three numbers in one configuration file: 4,096 environments, 16 control
            steps collected from each environment before every update, and 3,000 updates. Their product is
            196,608,000 control steps. At 10 steps a second, that is 19,660,800 simulated seconds. To run the recipe
            on a smaller machine, you reduce the number of environments. For a machine with no GPU, the deploy README
            sets it to 64 environments. With the same 3,000 updates, that gives 64 x 16 x 3,000 ={' '}
            <Derived>3,072,000</Derived> control steps, one sixty-fourth of the experience.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py and deploy README</Cite>
          </Box>
          <Box variant="p">
            In each of the 16 control steps, the simulator first renders the wrist camera of every environment.
            Rendering a camera means computing the image that the camera would see (section 13, Rendering and Ray
            Tracing). That makes 4,096 images of 64 x 64 pixels in every step. The policy reads them as one batch and
            returns 4,096 actions. The policy is a small network. A two-layer convolutional encoder processes each
            image, and its output goes into an MLP (multilayer perceptron) with layers of 256, 256 and 128 units. An
            MLP is a plain stack of fully connected layers.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>
          </Box>
          <Box variant="p">
            Next, the physics engine advances every environment 20 times, 5 ms at a time, to cover the 100 ms until
            the next decision. The task&apos;s code then scores the result.{' '}
            <Cite id="F06-105">MuJoCo Playground simulation config and SO-101 task.py</Cite> After 16 of these
            control steps, PPO updates the weights from all 4,096 x 16 = <Derived>65,536</Derived> steps, and the
            collection starts again. The rendering, the small network, the physics and the update all run on the same
            GPU. So the speed of the run is the number of control steps per
            second that this one GPU completes, counting the rendering, the policy, the physics and the update
            together.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>
          </Box>
          <ExpandableSection headerText="The PPO objective, and why PPO discards a batch after a few passes">
            <SpaceBetween size="m">
              <Box variant="p">
                The PPO update is a policy gradient step with a brake on it. A policy gradient method raises the
                probability of the actions that turned out better than expected and lowers the probability of the
                others. PPO goes over the same batch several times. Every pass moves the policy further from the
                version that collected the batch, so the batch describes the current policy less and less well. The
                brake stops rewarding a change once the change has gone a set distance.
              </Box>
              <Box variant="p">
                In the formula, <M>{String.raw`s_t`}</M> is the state at step <M>t</M>, which here is what the policy
                saw, and <M>{String.raw`a_t`}</M> is the action it took. <M>{String.raw`\pi_\theta(a_t \mid s_t)`}</M>{' '}
                is the probability that the policy with weights <M>{String.raw`\theta`}</M> gives to that action, and{' '}
                <M>{String.raw`\theta_{\mathrm{old}}`}</M> are the weights that collected the batch.{' '}
                <M>{String.raw`r_t(\theta)`}</M> is the ratio of the two probabilities. It is 1 before the first pass,
                and above 1 once the action has become more likely.
              </Box>
              <Box variant="p">
                <M>{String.raw`\hat{A}_t`}</M> is the estimated advantage. It measures how much better things went
                after <M>{String.raw`a_t`}</M> than a second network expected at <M>{String.raw`s_t`}</M>. That second
                network is trained alongside the policy to predict outcomes. A positive advantage means that the
                action did better than expected. <M>{String.raw`\epsilon`}</M> is the clip range. The function{' '}
                <M>{String.raw`\operatorname{clip}`}</M> holds its first argument between the two bounds that follow
                it, and <M>{String.raw`\hat{\mathbb{E}}_t`}</M> is the average over the batch. Training maximises
                this objective:
              </Box>
              <Formula
                name="PPO clipped surrogate objective"
                tex={String.raw`\begin{aligned} & r_t(\theta) = \frac{\pi_\theta(a_t \mid s_t)}{\pi_{\theta_{\mathrm{old}}}(a_t \mid s_t)} \\ & L^{\mathrm{CLIP}}(\theta) = \hat{\mathbb{E}}_t \Big[ \min \big( r_t(\theta) \hat{A}_t, \\ & \quad \operatorname{clip}(r_t(\theta), 1 - \epsilon, 1 + \epsilon) \, \hat{A}_t \big) \Big] \end{aligned}`}
                source={<Cite id="F11-4">PPO paper, section 3, equation 7</Cite>}
              />
              <Box variant="p">
                The first argument of the min, <M>{String.raw`r_t(\theta) \hat{A}_t`}</M>, is the plain push: making
                a good action more likely raises the objective. The second argument is the same product with the
                ratio held inside <M>{String.raw`[1 - \epsilon, 1 + \epsilon]`}</M>. Taking the smaller of the two is
                the brake. A change in the helpful direction stops earning anything past the bound, while a change in
                the harmful direction still counts in full. This recipe sets <M>{String.raw`\epsilon`}</M> to 0.2,
                the value that the paper suggests.{' '}
                <Cite id="F11-4">PPO paper, section 3</Cite>{' '}
                <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>
              </Box>
              <Box variant="p">
                Here is an illustration with invented numbers. Take an action with an advantage of <Toy>+2</Toy>,
                whose probability the passes have raised to <Toy>1.5</Toy> times its old value. Unclipped, it scores{' '}
                <Toy>1.5</Toy> x <Toy>2</Toy> = <Derived>3</Derived>. Clipped, the ratio is held at the upper bound
                of <Derived>1.2</Derived>, so it scores <Derived>1.2</Derived> x <Toy>2</Toy> ={' '}
                <Derived>2.4</Derived>. The objective takes the smaller value, <Derived>2.4</Derived>, which no longer
                depends on the ratio. So nothing pushes that action further until PPO collects fresh attempts.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            The recipe&apos;s configuration and README at version 1.0.1 give no wall-clock time. So you have to
            measure how long its 197 million steps take on a given GPU.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite> The nearest published figure from the same
            project is for a different arm and older code. In their 2025 paper, the Playground authors report that a
            camera-based pick task for a Franka arm trained in ten minutes on a single RTX 4090 and succeeded in 12 of
            12 real trials. The software has been rewritten since then.{' '}
            <Cite id="F04-56">MuJoCo Playground paper, section IV-C</Cite>
          </Box>
          <Box variant="p">
            NVIDIA publishes throughput figures, and they show how much a camera costs. They come from the benchmark
            file of Isaac Lab 3.0, NVIDIA&apos;s robot-learning framework. The first rows to look at use state
            observations. State observations give the policy its inputs as numbers, such as joint angles and object
            positions, with no image. On one RTX PRO 6000 Blackwell Server Edition with 8,192 environments, NVIDIA
            reports a Franka arm lifting a cube from state observations at about 165,000 steps per second on the PhysX
            physics engine, and at about 319,000 on the Newton MuJoCo-Warp engine.{' '}
            <Cite id="F04-54">Isaac Lab 3.0 benchmark file, Franka lift rows</Cite>
          </Box>
          <Box variant="p">
            Adding a camera cuts the throughput to about half. In the same file, a Kuka arm with an Allegro hand lifts
            an object at about 61,000 steps per second from state observations, and at about 28,000 with one 64 x 64
            camera per environment. Those two figures use PhysX with RTX rendering, and the camera rate is 46% of the
            state rate. With Newton for both the physics and the rendering, NVIDIA reports about 221,000 steps per
            second against 116,000, which is 52%.{' '}
            <Cite id="F04-55">Isaac Lab 3.0 benchmark file, Kuka-Allegro rows</Cite>
          </Box>
          <Box variant="p">
            To see how a throughput turns into a run time, apply these rates to the {ARM} recipe. At about 28,000
            steps a second, its 196,608,000 steps would take about <Derived>7,000</Derived> s, close to two hours. At
            about 116,000 a second, they would take about <Derived>1,700</Derived> s, under half an hour. However, the
            robot, the task, the simulator and the number of environments all differ from the recipe&apos;s, and the
            recipe names no GPU. So the pair only illustrates the arithmetic, and it is not an estimate for this
            recipe.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>{' '}
            <Cite id="F04-55">Isaac Lab 3.0 benchmark file, Kuka-Allegro rows</Cite>
          </Box>
          <Box variant="p">
            NVIDIA&apos;s two camera figures are about four times apart, and the renderer is only one of the
            differences between them. The two rows also use different physics engines. They also produce different
            images from the same fixed 64 x 64 camera: the Newton row renders plain colour, and the RTX row renders a
            shaded image. Before you choose a renderer on speed, compare figures that use the same physics engine and
            produce the same output.{' '}
            <Cite id="F06-103">Isaac Lab camera_cfg.py and benchmark README</Cite>
          </Box>
          <Box variant="p">
            Use NVIDIA&apos;s figures with care. They measure training throughput for other robots, and the notes of
            the benchmark run flag it as &quot;dirty working tree reported&quot;. The file also gives no time to a
            working policy. Use the figures for what a camera cost on a manipulation task, which is about half the
            throughput. Keep in mind that in the same file, the Newton rows for Cartpole lose a factor of 6.7 to the
            camera. Then measure the rate of your own task.{' '}
            <Cite id="F04-54">Isaac Lab 3.0 benchmark file and README</Cite>{' '}
            <Cite id="F06-48">Isaac Lab 3.0 benchmark file, Cartpole rows</Cite>
          </Box>
          <Box variant="p">
            On the hardware side, a run in a simulator needs one GPU, with one CPU core feeding it. We have not
            measured what limits the GPU yet. Based on what those GPU kernels compute, we expect that stepping
            thousands of environments together uses general GPU compute. General GPU compute means the GPU&apos;s
            ordinary arithmetic units, as opposed to the tensor cores that matrix-heavy training uses.{' '}
            <Cite id="F08-76">the workload table, rows 6 and 7</Cite>
          </Box>
          <Box variant="p">
            With a camera in the simulation, you size the GPU in a different order. The camera images take GPU memory:
            NVIDIA&apos;s camera figures used 24.22 GB with RTX rendering and 13.61 GB with the Newton renderer. The GPU
            must also be able to run the renderer you choose.
            An AWS post from June 2026 says that the Omniverse RTX Renderer &quot;requires GPUs with hardware RT
            Cores&quot;. RT cores are ray-tracing units, and the GPUs in AWS&apos;s P-family training instances do not
            have them (section 13, Rendering and Ray Tracing). So for a simulator run with a camera, you first check
            the GPU memory and which renderer the GPU can run, and only then its speed.{' '}
            <Cite id="F08-76">the workload table, rows 6 and 7</Cite>{' '}
            <Cite id="F04-55">Isaac Lab 3.0 benchmark file, Kuka-Allegro rows</Cite>{' '}
            <Cite id="F06-60">AWS post on Isaac Lab, RTX renderer requirements</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="When a VLA practises in simulation, plan for eight GPUs, and measure how long one training step takes before you set the job's time limit. When it practises on real robots, the run also waits on people."
          >
            RL on a pretrained policy: a large VLA at every control step
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This approach starts from a model that already does the task some of the time. A VLA has a
            backbone of billions of parameters that reads the images and the instruction, and an action head that
            turns the backbone&apos;s output into motion (section 5, Vision-Language-Action Models). Here, every
            control step of every environment is a forward pass through the whole model. In the simulator recipe,
            each control step ran only a two-layer encoder and three small layers.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>
          </Box>
          <Box variant="p">
            The environment counts show how much more each step costs. NVIDIA&apos;s benchmark ran 8,192 environments
            on one GPU for a small policy. The authors of piRL fine-tune the pi0 and pi0.5 VLAs with PPO, and they run
            64 to 320 environments on 8 H100 80 GB GPUs. That is 64 / 8 = 8 to 320 / 8 = <Derived>40</Derived>{' '}
            environments per GPU, between about <Derived>200</Derived> and <Derived>1,000</Derived> times fewer than
            8,192. The GPUs, the simulators and the tasks differ, so the ratio is rough, but it is large enough to
            matter. The authors report that pi0.5, trained from one demonstration per task, rose from 77.1% to 98.3%
            average success on LIBERO. LIBERO is a suite of simulated manipulation tasks used as a benchmark.{' '}
            <Cite id="F04-69">piRL paper, section 5 and appendix J</Cite>{' '}
            <Cite id="F04-54">Isaac Lab 3.0 benchmark file</Cite>
          </Box>
          <Box variant="p">
            One run on AWS shows how long such a job takes. An AWS sample repository runs a recipe from RLinf v0.4,
            the project of the piRL authors. The recipe trains OpenVLA-OFT, a VLA with 7B parameters, on
            LIBERO&apos;s Goal suite. Its algorithm is GRPO (Group Relative Policy Optimization). GRPO is an RL
            algorithm that scores each attempt against the other attempts collected with it. The sample&apos;s results
            file counts progress in training steps, which are GRPO steps here. One training step is a round of
            collecting attempts and updating the model, so it is a much larger unit than a control step. The
            sample&apos;s authors report a single run on one p5en.48xlarge Spot Instance with 8 H200 GPUs: 75
            training steps in 31.6 hours of training, about 25 minutes per training step, with success rising from
            48.6% (243/500) to 85.0% (425/500).{' '}
            <Cite id="F04-70">AWS sample, docs/results.md</Cite>
          </Box>
          <Box variant="p">
            Before you give such a job a time limit, measure how long one training step takes. The same file records
            an earlier run on 8 H100 GPUs. When GRPO training began, that run had 38 hours left under its 40-hour
            wall-clock cap, and each training step took about 27 minutes. 38 hours are <Derived>2,280</Derived>{' '}
            minutes, which is room for about <Derived>84</Derived> of the 100 training steps that the run was asked
            for, and the cap stopped it at step 83. The timeout fired before the latest checkpoint was uploaded, and
            the instance terminated with its checkpoints still on its own disk. So set the cap from a measured
            training-step time, and copy checkpoints off the instance while the job runs.{' '}
            <Cite id="F04-71">AWS sample, docs/results.md, earlier run</Cite>
          </Box>
          <Box variant="p">
            When a pretrained policy practises on real robots instead of in a simulator, the run has two costs. Every
            control step still needs a forward pass of the large model, and the run also needs people, as RL on the
            real arm does. Recap (RL with Experience and Corrections via Advantage-conditioned Policies) is a method
            from Physical Intelligence for this case. It improves a VLA from a few hundred of its own attempts per
            round, and each round repeats three stages. First, the robots make autonomous attempts, and a person is
            free to take over and correct them. Second, a value function is trained on all the data. Third, the
            policy is retrained.{' '}
            <Cite id="F04-60">Recap paper, section IV-C</Cite>
          </Box>
          <Box variant="p">
            A value function is a second model that looks at the current moment and predicts how well the attempt
            will end. Recap&apos;s value function is a VLM (vision-language model) with a 670M-parameter backbone. A
            VLM is the image-and-text network that a VLA is built on. The value function predicts the number of steps
            left until success, as a negative number scaled to between -1 and 0.{' '}
            <Cite id="F04-61">Recap paper, sections IV-A and V-C</Cite>
          </Box>
          <Box variant="p">
            Recap updates the policy with supervised learning and one extra input. It labels every recorded action as
            better or worse than expected. It then trains the VLA to imitate all of the actions, with the label given
            as an input next to the instruction. When the robot runs, Recap always sets that input to
            &quot;better&quot;, so the VLA produces the kind of actions that were labelled better than expected. The
            failed attempts stay in the training set, with each action labelled better or worse by the same rule.{' '}
            <Cite id="F04-62">Recap paper, section IV-B</Cite>
          </Box>
          <Box variant="p">
            The label comes from a subtraction. In the formula below, <M>{String.raw`R_t`}</M> is the outcome reached
            from step <M>t</M> to the end of the episode. It is measured as the number of steps that were actually
            left, on the same scale as the value. <M>{String.raw`V(o_t, \ell)`}</M> is the value function&apos;s
            prediction from the observation <M>{String.raw`o_t`}</M> (the images and joint angles) and the instruction{' '}
            <M>{String.raw`\ell`}</M>. <M>{String.raw`\epsilon_\ell`}</M> is a threshold set for each task, and it is
            a different quantity from PPO&apos;s clip range. <M>{String.raw`I_t`}</M> is the label, which is either
            true or false.
          </Box>
          <Formula
            name="Recap advantage and its better-than-expected label"
            tex={String.raw`\begin{aligned} A_t &= R_t - V(o_t, \ell) \\ I_t &= \big( A_t > \epsilon_\ell \big) \end{aligned}`}
            source={<><Cite id="F04-62">Recap paper, section IV-B, in this page&apos;s symbols</Cite> <Cite id="F11-6">Recap paper, appendix A-F</Cite></>}
          />
          <Box variant="p">
            <M>V</M> carries the estimate of how well the attempt is going. <M>{String.raw`A_t`}</M> is called the
            advantage. It is the outcome minus the prediction, so it measures how much better or worse than expected
            the attempt went. <M>{String.raw`I_t`}</M> passes that result to the policy as an input. Because the label
            comes from the advantage, this method is called advantage conditioning. The formula above is the form
            that the paper uses for its pre-training data, where the outcome is the whole rest of the episode. For
            attempts collected on the robot, the paper shortens the outcome to the rewards over a fixed number of
            steps ahead, plus the value predicted at that later step. The subtraction and the label work the same
            way.{' '}
            <Cite id="F11-6">Recap paper, appendix A-F</Cite>
          </Box>
          <Box variant="p">
            Here is an illustration with invented numbers. In the middle of a grasp, the value function predicts{' '}
            <Toy>-0.40</Toy>. The episode then ends sooner than predicted: the steps that were actually left come to{' '}
            <Toy>-0.30</Toy> on the same scale. So{' '}
            <M>{String.raw`A_t`}</M> = <Toy>-0.30</Toy> - (<Toy>-0.40</Toy>) = <Derived>+0.10</Derived>. With a
            threshold of <Toy>+0.05</Toy>, the grasp is labelled better than expected. If the block had slipped, the
            label would be false, and the data would still be used for training. Actions that a person supplied while
            correcting the robot are labelled true by rule. So one training rule covers demonstrations, autonomous
            attempts and corrections.{' '}
            <Cite id="F04-62">Recap paper, section IV-B</Cite>{' '}
            <Cite id="F04-63">Recap paper, section IV-B, human corrections</Cite>
          </Box>
          <Box variant="p">
            One round is hundreds of attempts. For T-shirt folding, the authors report 300 autonomous trajectories per
            iteration on four robots. For box assembly, they report 600 autonomous trials plus 360 trials in which a
            person intervened, per iteration, on 3 robots.{' '}
            <Cite id="F04-65">Recap paper, section VI-B and appendix</Cite> Each round ends by retraining pi*0.6, the
            VLA that Recap improves. Its backbone is a Gemma 3 4B VLM, and its action head, which the paper calls the
            &quot;action expert&quot;, has 860M parameters.{' '}
            <Cite id="F04-64">Recap paper, sections V-A and V-B</Cite> After adding the on-robot data, the authors
            report that throughput, counted as successful tasks per hour, more than doubled on their laundry-folding
            and espresso tasks.{' '}
            <Cite id="F04-66">Recap paper, section VI-B and figure 7</Cite>
          </Box>
          <Box variant="p">
            People limit how many attempts Recap gets. Its authors write that the system &quot;relies on human
            labeling and effort for reward feedback, interventions, and episode resets&quot;. It also learns in
            rounds: it &quot;collects a batch of data, retrains the model, and repeats&quot;.{' '}
            <Cite id="F04-67">Recap paper, section VII</Cite>
          </Box>
          <Box variant="p">
            NVIDIA reports that RL on the real robot improved its GR00T 2 model on three contact-rich insertion tasks,
            in which parts press against each other. After supervised training, the success rates on the three tasks
            were 40 to 76%. After RL on the real robot, they were 88 to 96%. NVIDIA&apos;s page gives no robot count,
            episode count or training time for that RL stage.{' '}
            <Cite id="F04-68">NVIDIA GR00T 2 page</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`On the real arm, you can train a policy for the ${ARM} from a few hundred attempts. To make that work, the learner reuses every recorded step many times, and you take over the arm when an attempt goes wrong.`}
          >
            RL on the real arm: a person corrects the policy while it learns
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This approach uses no simulator and no large model. The arm tries the task, and you sit next to
            it with the leader arm. The leader arm is the hand-held copy of the arm that drives it in teleoperation
            (section 3, The Robot as a Computer). When an attempt is going wrong, you take over briefly with the
            leader arm and then let go. After each attempt, the block goes back to its starting position. The recipe
            for this kind of training is called HIL-SERL (human-in-the-loop sample-efficient RL). LeRobot v0.7.0 ships
            it for the SO-100 and the {ARM}. It recommends the {ARM} leader arm for takeovers, because the
            leader&apos;s geared joints let it follow the robot arm&apos;s movements while the policy drives.{' '}
            <Cite id="F04-80">LeRobot v0.7.0 hilserl.mdx, SO-101 sections</Cite>
          </Box>
          <Box variant="p">
            In the 2024 paper that introduced HIL-SERL, the authors report near-perfect success on contact-rich tasks
            within 1 to 2.5 hours of training on the real robot. Training started from 20 to 30 human demonstrations,
            and one RTX 4090 did the learning.{' '}
            <Cite id="F04-72">HIL-SERL paper, abstract and section 4</Cite> At LeRobot&apos;s example timing, the arm
            can make at most 2.5 x <Derived>144</Derived> = <Derived>360</Derived> attempts in 2.5 hours. Each attempt
            lasts at most 20 s at 10 steps a second, so that is at most <Derived>72,000</Derived> control steps. The
            simulator recipe used 196,608,000 control steps, about <Derived>2,700</Derived> times as many.{' '}
            <Cite id="F04-77">LeRobot v0.7.0 hilserl.mdx</Cite>{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>
          </Box>
          <Box variant="p">
            Training on so few steps works because the learner reuses each step. At <Derived>144</Derived> attempts an
            hour, you cannot afford to throw any data away, so the learner trains on every real step many times.
            LeRobot&apos;s implementation uses SAC (Soft Actor-Critic) for this. SAC is an RL method that trains from
            a replay buffer. A replay buffer is a store of past steps that training samples from again and again.
            PPO, in contrast, discards each batch after a few passes.{' '}
            <Cite id="F04-76">LeRobot v0.7.0 hilserl.mdx, actor and learner</Cite>
          </Box>
          <Box variant="p">
            A person also influences what the learner trains on. In the HIL-SERL paper, the learner keeps two buffers: one
            of human demonstrations and one of the robot&apos;s own experience. It draws every training batch equally
            from both.{' '}
            <Cite id="F04-73">HIL-SERL paper, section 3.2</Cite> When you take over, your action replaces the
            policy&apos;s action and is stored with the rest of the data. Taking over like this is called an
            intervention.{' '}
            <Cite id="F04-74">HIL-SERL paper, sections 3.2 and 3.3</Cite>
          </Box>
          <Box variant="p">
            The work is split between two programs, because the arm moves on a fixed clock while a gradient update
            takes as long as it takes. The actor is the program that runs the current policy on the arm, 10 times a
            second in the example configuration. It sends each transition to the learner over gRPC, a remote
            procedure call protocol. A transition is the record of one step: the observation, the action, the reward
            and the next observation. The learner is the program that holds the replay buffers, does the gradient
            updates on a GPU and sends new weights back to the actor.{' '}
            <Cite id="F04-76">LeRobot v0.7.0 hilserl.mdx, actor and learner</Cite>{' '}
            <Cite id="F04-77">LeRobot v0.7.0 hilserl.mdx</Cite>
          </Box>
          <Box variant="p">
            You can see from the default settings how loosely the two programs are coupled. The learner pushes new
            weights to the actor every 4 seconds, so the arm acts on weights that are up to 4 seconds old.
            LeRobot&apos;s note on that setting suggests lowering it to 1 or 2 s for fresher weights, at the cost of
            more network traffic. Each buffer holds 100,000 transitions. That is more than the{' '}
            <Derived>72,000</Derived> steps that a 2.5-hour run can produce, so nothing collected in a run of that
            length is dropped. The learner&apos;s default address is the local machine. So one computer with a GPU next
            to the arm runs both programs, unless you point the actor at another machine.{' '}
            <Cite id="F04-72">HIL-SERL paper, abstract and section 4</Cite>{' '}
            <Cite id="F04-78">LeRobot v0.7.0 gaussian_actor and SAC configuration</Cite>{' '}
            <Cite id="F04-76">LeRobot v0.7.0 hilserl.mdx, actor and learner</Cite>
          </Box>
          <Box variant="p">
            LeRobot&apos;s guide gives advice on choosing a task that follows from this attempt arithmetic: &quot;Focus
            on tasks that can be completed in 5-10 seconds.&quot; An episode that ends in 10 s, with the same 5 s
            reset, takes <Derived>15</Derived> s per attempt. The arm can then make <Derived>3,600</Derived> /{' '}
            <Derived>15</Derived> = <Derived>240</Derived> attempts an hour.{' '}
            <Cite id="F04-77">LeRobot v0.7.0 hilserl.mdx</Cite>
          </Box>
          <Box variant="p">
            On the real arm, whether a run succeeds depends heavily on how well you intervene. You get better at it
            over several runs.
            LeRobot&apos;s guide warns that &quot;The learning process is very sensitive to the intervention
            strategy&quot;, and that it takes a few runs to understand how to intervene effectively. So plan for
            several runs before you get a good one. The guide describes a healthy run this way: &quot;A successful
            experiment is one where the human has to intervene at the start but then reduces the amount of
            interventions as the policy improves.&quot;{' '}
            <Cite id="F04-79">LeRobot v0.7.0 hilserl.mdx, human interventions</Cite>
          </Box>
          <Box variant="p">
            The guide opens with the promise that you will train a policy on a real robot &quot;in just a few
            hours&quot;. As of v0.7.0, it has no table of results. So you have to measure the training time and the
            success rate on this arm yourself.{' '}
            <Cite id="F04-80">LeRobot v0.7.0 hilserl.mdx, SO-101 sections</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="RL learns from the reward exactly as it is given, so check that the reward scores attempts correctly before you start a long run. A policy trained in simulation has only met the simulated arm, so check what the simulator varies, and plan to measure the success rate on the real arm yourself."
          >
            Checking the reward and the simulator before you train
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            RL moves the policy toward whatever scored well, so any error in the reward is trained into the policy.
            The grader is the person or the program that produces the reward. In LeRobot&apos;s recipe and in Recap,
            the grader is a person or a small classifier.{' '}
            <Cite id="F04-77">LeRobot v0.7.0 hilserl.mdx</Cite>{' '}
            <Cite id="F04-67">Recap paper, section VII</Cite> The HIL-SERL authors report that their trained
            classifier generally exceeds 95% accuracy on its evaluation set.{' '}
            <Cite id="F04-74">HIL-SERL paper, sections 3.2 and 3.3</Cite>
          </Box>
          <Box variant="p">
            A large general model is a weaker judge today. The authors of FailBench tested 13 detectors built on
            vision-language models on 2,197 real and simulated manipulation attempts. They report that the best
            detector reached a mean balanced accuracy of 0.77. Balanced accuracy is the average of the detection rate
            on successes and the detection rate on failures, so a score of 0.5 means chance. No detector scored above
            0.60 on contact-intensive assembly, and the detectors were biased toward declaring success. A judge with
            that bias rewards the policy for failures. Section 19, Agents Running the Loop, discusses who may write
            the grader.{' '}
            <Cite id="F04-45">FailBench paper, abstract</Cite>
          </Box>
          <Box variant="p">
            To know whether training improved the policy, you measure its success rate before and after, and each of
            those measurements has an error bar. The AWS run scored its policy on 500
            simulated episodes before and after training. Its file gives 95% intervals of 44.2-53.0% before and
            81.6-87.9% after, and the two intervals do not overlap. The repository&apos;s short test profile ran 5
            training steps on one L40S GPU in 56 minutes. It moved success from 45.0% to 50.0%, but the two intervals
            overlap, so the evaluation cannot tell that change apart from chance (section 16, Evaluation).{' '}
            <Cite id="F04-70">AWS sample, docs/results.md</Cite>
          </Box>
          <Box variant="p">
            The simulator needs the same check, because a policy trained in simulation has met only the simulated
            arm. To prepare the policy for a real arm that differs from the
            simulated one, the {ARM} task changes the simulated arm and scene at the start of every episode. This is
            called domain randomisation. The task varies the fingertip friction, the motor gains, the joint damping,
            the cube size, the colours, the lighting and the camera parameters. It also moves the height of the base
            by plus or minus 2.5 mm, and adds a bias to the joint readings that imitates a badly calibrated arm.{' '}
            <Cite id="F06-28">MuJoCo Playground SO-101 task.py, randomisation</Cite> The bias is there because, as the
            task&apos;s deploy README says, hand calibration of this arm &quot;can easily be off by 1-2+ cm in
            end-effector height&quot;.{' '}
            <Cite id="F06-29">MuJoCo Playground SO-101 deploy README</Cite>
          </Box>
          <Box variant="p">
            The same README states what the randomisation leaves unsolved. The policy was &quot;tested on 3 different
            robot setups under various lighting conditions&quot;, and &quot;there may still be visual domain gap with
            darker shadows&quot;. As of version 1.0.1, the README and task files give no success rate for this policy.
            So the first success rate for it on a real arm will be the one you count at your own bench. Section 14,
            Sim-to-Real and Real-to-Sim, covers the two remedies: widen what the simulator varies, or measure the arm
            and correct the simulator.{' '}
            <Cite id="F06-26">MuJoCo Playground SO-101 deploy README</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Choose the approach based on what you have the most of: GPU time, a VLA that already works, or your own hours at the bench. Then size the machine for that approach's bottleneck."
          >
            Choosing an approach and sizing its machine
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The three approaches need three different machines, because each one has a different
            bottleneck. The table compares them, and its workload types are the five from section 1, Fifteen
            Computing Jobs Behind One Robot Arm. Section 20, The Fifteen Workloads, compares these runs with the other
            jobs around the arm.{' '}
            <Cite id="F08-76">the workload table, rows 6 and 7</Cite>{' '}
            <Cite id="F04-81">synthesis of the Playground and LeRobot entries</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 860 }}>
              <thead>
                <tr>
                  <th style={TH}>Approach</th>
                  <th style={TH}>How many attempts</th>
                  <th style={TH}>What the run waits on</th>
                  <th style={TH}>Bottleneck</th>
                  <th style={TH}>Workload type</th>
                  <th style={TH}>Recipe for the {ARM}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>In a simulator</td>
                  <td style={TD}>About 197 million control steps in one recipe, with no person involved.</td>
                  <td style={TD}>
                    The throughput of the simulator and the renderer. In NVIDIA&apos;s manipulation benchmarks, a
                    camera cuts it to about half.
                  </td>
                  <td style={TD}>
                    Probably general GPU compute for the physics, with one CPU core feeding the GPU. We have not
                    measured this. With cameras, first check that the GPU has enough memory and can run the renderer,
                    and only then compare speed.
                  </td>
                  <td style={TD}>Long single-machine run: one GPU on one node, exchanging nothing with another machine.</td>
                  <td style={TD}>
                    <code>{SIM_TASK}</code> in MuJoCo Playground, which covers the pick half of the task.{' '}
                    <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>{' '}
                    <Cite id="F04-55">Isaac Lab 3.0 benchmark file</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>On a pretrained policy</td>
                  <td style={TD}>
                    64 to 320 environments in simulation. On real robots, hundreds of attempts per round.
                  </td>
                  <td style={TD}>
                    The forward passes of a large model. On real robots, also the people who give rewards, make
                    corrections and reset the scene.
                  </td>
                  <td style={TD}>
                    The GPUs that run the model&apos;s forward passes. The AWS sample&apos;s main run used eight of them for
                    31.6 hours.
                  </td>
                  <td style={TD}>
                    Long single-machine run: one node for more than a day. If the instance is interrupted, you lose
                    everything since the last checkpoint that was copied off it.
                  </td>
                  <td style={TD}>
                    We did not find a recipe specific to this arm.{' '}
                    <Cite id="F04-69">piRL paper, section 5 and appendix J</Cite>{' '}
                    <Cite id="F04-70">AWS sample, docs/results.md</Cite>{' '}
                    <Cite id="F04-67">Recap paper, section VII</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>On the real arm</td>
                  <td style={TD}>
                    At most <Derived>144</Derived> attempts an hour.
                  </td>
                  <td style={TD}>The arm, the reset and a person&apos;s attention.</td>
                  <td style={TD}>
                    The arm and the person. The hardware is one GPU for the learner, and a CPU connected to the cameras
                    for the actor.
                  </td>
                  <td style={TD}>
                    Real-time on the robot: the run is tied to the arm and the person next to it, for 1 to 2.5 hours
                    in the HIL-SERL authors&apos; report.
                  </td>
                  <td style={TD}>
                    The HIL-SERL actor and learner in LeRobot.{' '}
                    <Cite id="F04-76">LeRobot v0.7.0 hilserl.mdx</Cite>{' '}
                    <Cite id="F04-72">HIL-SERL paper, abstract and section 4</Cite>{' '}
                    <Cite id="F04-77">LeRobot v0.7.0 hilserl.mdx</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Choose the approach based on what you have the most of. If you have one GPU but little time to
            sit at the bench, run the Playground recipe, and keep some time for the transfer to the real arm. If you
            have a few hours of your own attention, run LeRobot&apos;s actor and learner at the bench. Choose RL on
            a pretrained policy only once a fine-tuned VLA already does the task some of the time. Treat
            that run as a multi-GPU job with a time limit and a way to copy checkpoints off the instance.
          </Box>
          <Box variant="p">
            Then, before you choose an algorithm, count the attempts. In a simulator, the number of control steps is
            environments x steps per update x updates. A measured rate in steps per second turns that count into a
            run time. For the {ARM} recipe, the run time is 196,608,000 divided by the steps per second that your GPU
            delivers with the camera on. At the bench, the number of attempts per hour is <Derived>3,600</Derived>{' '}
            divided by the length of one episode plus one reset, in seconds. At LeRobot&apos;s example values that
            length is 25 s, and you sit next to the arm for every attempt. For a VLA, time one training step first: at
            about 25 minutes each, 75 training steps took more than a day on eight GPUs.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>{' '}
            <Cite id="F04-77">LeRobot v0.7.0 hilserl.mdx</Cite>{' '}
            <Cite id="F04-70">AWS sample, docs/results.md</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
