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
            description="Tell what a robot RL run will wait on by asking where its attempts come from: one GPU's simulator throughput, a large model's forward passes, or an arm and a person (MuJoCo Playground 1.0.1, Isaac Lab 3.0 and LeRobot v0.7.0, sources read 2026-11-20)."
          >
            8. Reinforcement Learning for Robots: Where the Attempts Come From
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            What a robot RL (reinforcement learning) run waits on, and so the machine it needs, is decided by where
            its attempts come from. RL improves a policy, the network that turns camera images and joint angles
            into motor targets, from its own scored attempts at a task, and it consumes them in bulk. They come
            from one of three places. A simulator supplies hundreds of millions of control steps, the single
            decisions an attempt is made of, and the run waits on the throughput of one GPU. A large pretrained
            model that already does the task some of the time needs only hundreds of attempts per round of
            retraining, and every control step of each one is a pass through that model. A real arm supplies
            attempts at the pace of its own motion, a reset and a person.
          </Box>
          <Box variant="p">
            The recipe that ships for the {ARM}, the six-motor desktop arm on the bench, sits at one end. MuJoCo
            Playground&apos;s default runs 4,096 simulated arms for 16 control steps each and repeats that 3,000
            times: 4,096 x 16 x 3,000 = 196,608,000, about 197 million control steps, each one decision by the policy
            and the motion that follows it. At the recipe&apos;s 10 decisions a second that
            is about 228 days of one arm moving without a pause, and it runs on one GPU. The policy sees through a
            camera, and in NVIDIA&apos;s benchmark of another robot a camera takes about half of a simulator&apos;s
            throughput.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>{' '}
            <Cite id="F04-55">Isaac Lab 3.0 benchmark file, Kuka-Allegro rows</Cite>
          </Box>
          <Box variant="p">
            The real arm sits at the other end. LeRobot&apos;s example for RL on a real arm lets an episode run at
            most 20 s and then waits 5 s while the scene is reset. That is 20 + 5 = <Derived>25</Derived> s per
            attempt, so at most <Derived>3,600</Derived> / <Derived>25</Derived> = <Derived>144</Derived> attempts
            an hour, with a person standing by.{' '}
            <Cite id="F04-77">LeRobot v0.7.0 hilserl.mdx</Cite> So the first thing to ask of any robot RL recipe
            is which supply it draws on. The answer names the part of the machine that runs out first, and it says
            what a faster GPU leaves unchanged: the 20 s of arm motion, the 5 s reset and the person.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Read any robot RL recipe as a supply of scored attempts, and name what it waits on">
            Scored attempts are what RL consumes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The policy of section 4, Learning From Demonstrations, copies what a person showed it. Suppose that, asked
            to {TASK_STORY}, it closes on the block most of the time, and now and then the gripper closes a little
            early and the block skids away (an illustration). More demonstrations give it more of what it has already seen. What it
            lacks is its own attempts, the failed ones included, and a signal that says which was which.
          </Box>
          <Box variant="p">
            That signal is the reward: a number that scores an attempt, as simple as 1 when the block ends in the
            cup and 0 otherwise. Every attempt needs one, so every recipe needs something that produces it. In
            LeRobot&apos;s real-arm recipe a small image classifier can supply it, or a person marks each success
            by hand on a gamepad or keyboard.{' '}
            <Cite id="F04-77">LeRobot v0.7.0 hilserl.mdx</Cite>
          </Box>
          <Box variant="p">
            One attempt by the current policy is what RL writing calls a trial or a rollout, and it is the episode
            of section 4 with the policy driving in place of a person. PPO (Proximal Policy Optimization), the
            algorithm of the simulator recipes here, alternates between collecting a batch of attempts and
            updating the policy from it. A batch can move the policy only a limited distance before it stops
            describing the policy it came from, so PPO makes a few passes over it, discards it and collects
            another.{' '}
            <Cite id="F11-4">PPO paper, sections 2.1 and 3</Cite> The{' '}
            <Link href="../rl-agentic-loops/">Learning From Feedback dive</Link> derives the algorithm.
          </Box>
          <Box variant="p">
            The supply then fixes what the run waits on. Call each supply a lane. In the simulator lane, where a program computes how the
            arm and the block move and an attempt needs no hardware (section 12, Physics Simulation), the wait is
            the simulator&apos;s steps per second. In the pretrained-policy lane the starting point is a VLA
            (vision-language-action model, the large network of section 5 that reads camera images and a text
            instruction and outputs action chunks), and every control step is a forward pass of it. In the
            real-arm lane every attempt takes the arm&apos;s own time, then a reset, then a person&apos;s
            attention.
          </Box>
          <Figure
            cites="F04-58 F04-69 F04-77 F04-76"
            caption={
              <>
                The simulator lane fills its square with 4,096 arms and the real-arm lane holds one, drawn at the
                same dot size. In each strip the widest part is what that lane waits on, and only the real-arm
                strip is to scale in time.
              </>
            }
          >
            <RlLanes />
          </Figure>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Size a simulator run from three numbers in one file, and see what a camera cost in NVIDIA's benchmark: about half of the throughput on a manipulation task">
            A simulator turns one GPU into 4,096 arms
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A simulator on a GPU advances many independent copies of the scene in one batch. Each copy (an arm, a
            table, a cube) is called an environment, and a copy that finishes its attempt is put back at its start
            by the program. No reset waits on a person, so the supply of attempts is whatever the GPU can step.
          </Box>
          <Box variant="p">
            MuJoCo Playground 1.0.1, a suite of simulated robot tasks from Google DeepMind, ships such a recipe for
            the {ARM}. In <code>{SIM_TASK}</code>, PPO trains a policy from a 64 x 64 image of a simulated wrist
            camera, acting 10 times a second, and the result runs on the real arm with no further training, which
            is called zero-shot deployment. The shipped task is the pick half: the policy learns to {SIM_TASK_PLAIN}, and the release has no task for{' '}
            {SIM_TASK_GAP}.{' '}
            <Cite id="F04-57">MuJoCo Playground v1.0.1, SO-101 deploy README and task.py</Cite>
          </Box>
          <Box variant="p">
            The default recipe is three numbers in one file: 4,096 environments, 16 control steps collected from
            each before an update, and 3,000 updates. Their product is 196,608,000 control steps, which is
            19,660,800 simulated seconds at 10 a second. The environment count is the one a smaller
            machine changes. The deploy README&apos;s override for a machine with no GPU is 64 environments, which
            at the same 3,000 updates is 64 x 16 x 3,000 = <Derived>3,072,000</Derived> control steps, one
            sixty-fourth of the experience.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py and deploy README</Cite>
          </Box>
          <Box variant="p">
            In each of those 16 steps the simulator first renders the wrist camera of every
            environment, which means computing the image that camera would see (section 13, Rendering and Ray
            Tracing): 4,096 images of 64 x 64. The policy reads them as one batch and returns 4,096 actions. It is
            a small network, a two-layer convolutional encoder feeding an MLP (multilayer perceptron, a plain
            stack of fully connected layers) with layers of 256, 256 and 128 units.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>
          </Box>
          <Box variant="p">
            The physics then advances every environment 20 times, 5 ms at a time, to cover the 100 ms until the
            next decision, and the task&apos;s code scores the result.{' '}
            <Cite id="F06-105">MuJoCo Playground simulation config and SO-101 task.py</Cite> After 16 such steps
            PPO updates the weights from all 4,096 x 16 = <Derived>65,536</Derived> of them, and the collecting
            starts again. Rendering, a small network, physics and the update all run on the one GPU, so the supply
            of attempts is that GPU&apos;s steps per second through the whole cycle.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>
          </Box>
          <ExpandableSection headerText="The PPO objective, and why a batch is spent after a few passes">
            <SpaceBetween size="m">
              <Box variant="p">
                The update is a policy gradient step with a brake on it. A policy gradient method raises the
                probability of actions that turned out better than expected and lowers it for the rest. PPO goes
                over the same batch several times, and every pass moves the policy further from the one that
                collected the batch, so the batch describes it less and less well. The brake stops rewarding a
                change once it has gone a set distance.
              </Box>
              <Box variant="p">
                <M>{String.raw`s_t`}</M> is the state at step <M>t</M>, here what the policy saw, and{' '}
                <M>{String.raw`a_t`}</M> the action it took. <M>{String.raw`\pi_\theta(a_t \mid s_t)`}</M> is the
                probability the policy with weights <M>{String.raw`\theta`}</M> gives that action, and{' '}
                <M>{String.raw`\theta_{\mathrm{old}}`}</M> are the weights that collected the batch.{' '}
                <M>{String.raw`r_t(\theta)`}</M> is the ratio of the two probabilities: 1 before the first pass,
                above 1 once the action has become more likely.
              </Box>
              <Box variant="p">
                <M>{String.raw`\hat{A}_t`}</M> is the estimated advantage: how much better things went after{' '}
                <M>{String.raw`a_t`}</M> than a second network, trained beside the policy to predict outcomes,
                expected at <M>{String.raw`s_t`}</M>. Positive means better than expected.{' '}
                <M>{String.raw`\epsilon`}</M> is the clip range, <M>{String.raw`\operatorname{clip}`}</M> holds
                its first argument between the two bounds that follow it, and{' '}
                <M>{String.raw`\hat{\mathbb{E}}_t`}</M> is the average over the batch. Training maximises:
              </Box>
              <Formula
                name="PPO clipped surrogate objective"
                tex={String.raw`\begin{aligned} & r_t(\theta) = \frac{\pi_\theta(a_t \mid s_t)}{\pi_{\theta_{\mathrm{old}}}(a_t \mid s_t)} \\ & L^{\mathrm{CLIP}}(\theta) = \hat{\mathbb{E}}_t \Big[ \min \big( r_t(\theta) \hat{A}_t, \\ & \quad \operatorname{clip}(r_t(\theta), 1 - \epsilon, 1 + \epsilon) \, \hat{A}_t \big) \Big] \end{aligned}`}
                source={<Cite id="F11-4">PPO paper, section 3, equation 7</Cite>}
              />
              <Box variant="p">
                <M>{String.raw`r_t(\theta) \hat{A}_t`}</M> is the plain push: making a good action more likely
                raises the objective. The second argument is the same product with the ratio held inside{' '}
                <M>{String.raw`[1 - \epsilon, 1 + \epsilon]`}</M>. Taking the smaller of the two is the brake: a
                change in the helpful direction stops earning anything past the bound, and a change in the harmful
                direction still counts in full. This recipe sets <M>{String.raw`\epsilon`}</M> to 0.2, the value
                the paper suggests.{' '}
                <Cite id="F11-4">PPO paper, section 3</Cite>{' '}
                <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>
              </Box>
              <Box variant="p">
                An illustration with invented numbers: an action with an advantage of <Toy>+2</Toy> whose
                probability the passes have raised to <Toy>1.5</Toy> times its old value scores <Toy>1.5</Toy> x{' '}
                <Toy>2</Toy> = <Derived>3</Derived> unclipped and <Derived>1.2</Derived> x <Toy>2</Toy> ={' '}
                <Derived>2.4</Derived> clipped. The objective takes <Derived>2.4</Derived>, which no longer
                depends on the ratio, so nothing pushes that action further until fresh attempts are collected.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            The recipe&apos;s configuration and README at 1.0.1 give no wall-clock time, so how long its 197 million
            steps take on a given GPU has to be measured.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite> The nearest published figure from the same
            project is for another arm and older code. In their 2025 paper the Playground authors report a
            camera-based pick task for a Franka arm training in ten minutes on a single RTX 4090 and succeeding in
            12 of 12 real trials; the software has been rewritten since.{' '}
            <Cite id="F04-56">MuJoCo Playground paper, section IV-C</Cite>
          </Box>
          <Box variant="p">
            NVIDIA publishes rates, and they show what a camera costs. For Isaac Lab 3.0, its robot-learning
            framework, on one RTX PRO 6000 Blackwell Server Edition with 8,192 environments, NVIDIA&apos;s file
            reports a Franka arm lifting a cube from state observations (joint angles and object positions as
            numbers, with no image) at about 165,000 steps per second on the PhysX physics engine and about
            319,000 on the Newton MuJoCo-Warp engine.{' '}
            <Cite id="F04-54">Isaac Lab 3.0 benchmark file, Franka lift rows</Cite>
          </Box>
          <Box variant="p">
            A camera takes about half of that supply. In the same file a Kuka arm with an Allegro hand lifts an
            object at about 61,000 steps per second from state and at about 28,000 with one 64 x 64 camera per
            environment, on PhysX with RTX rendering: 46% of the rate. On the Newton physics and renderer pair
            NVIDIA reports about 221,000 against 116,000, which is 52%.{' '}
            <Cite id="F04-55">Isaac Lab 3.0 benchmark file, Kuka-Allegro rows</Cite>
          </Box>
          <Box variant="p">
            At about 28,000 steps a second the {ARM} recipe&apos;s 196,608,000 steps would take about{' '}
            <Derived>7,000</Derived> s, close to two hours; at about 116,000 a second, about{' '}
            <Derived>1,700</Derived> s, under half an hour. The robot, the task, the simulator, the environment
            count and the GPU all differ from the recipe&apos;s, so the pair illustrates the arithmetic and is no
            estimate for this recipe.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>{' '}
            <Cite id="F04-55">Isaac Lab 3.0 benchmark file, Kuka-Allegro rows</Cite>
          </Box>
          <Box variant="p">
            NVIDIA&apos;s two camera figures are about four times apart, and they differ in more than the renderer.
            They come from different physics engines, and from the same fixed 64 x 64 camera the Newton row renders plain
            colour where the RTX row renders a shaded image. Compare renderers on figures that share an engine and an
            output before you choose one on speed.{' '}
            <Cite id="F06-103">Isaac Lab camera_cfg.py and benchmark README</Cite>
          </Box>
          <Box variant="p">
            NVIDIA&apos;s figures are training throughput for other robots, from a benchmark its own notes flag as
            &quot;dirty working tree reported&quot;, and its file holds no time to a working policy. Use them for
            what a camera cost on a manipulation task, about half, knowing that the same file&apos;s Cartpole rows
            lose a factor of 6.7 to the camera, and measure the rate of your own task.{' '}
            <Cite id="F04-54">Isaac Lab 3.0 benchmark file and README</Cite>{' '}
            <Cite id="F06-48">Isaac Lab 3.0 benchmark file, Cartpole rows</Cite>
          </Box>
          <Box variant="p">
            On the machine, this lane is one GPU. Stepping thousands of environments together is, on our
            reading of what those kernels compute and with no measurement behind it yet, general GPU compute: the
            card&apos;s ordinary arithmetic as opposed to the tensor cores that matrix-heavy training uses, with one
            CPU core feeding it. Cameras add GPU memory first: NVIDIA&apos;s camera figures used
            24.22 GB with RTX rendering and 13.61 GB with the Newton renderer. Then they add a rendering path, and
            AWS states, in a post of June 2026, that the Omniverse RTX Renderer &quot;requires GPUs with hardware RT
            Cores&quot;, ray-tracing units its P-family training instances lack (section 13, Rendering and Ray
            Tracing). A simulator run
            with a camera is sized by GPU memory and by the renderer the card can run, before its speed.{' '}
            <Cite id="F08-76">the workload table, rows 6 and 7</Cite>{' '}
            <Cite id="F04-55">Isaac Lab 3.0 benchmark file, Kuka-Allegro rows</Cite>{' '}
            <Cite id="F06-60">AWS post on Isaac Lab, RTX renderer requirements</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Budget eight GPUs and a measured training-step time for a VLA practising in simulation; on real robots the same lane also waits on people">
            On a pretrained policy, every control step runs a large model
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The second supply starts from a model that already does the task some of the time. A VLA has a
            backbone of billions of parameters that reads the images and the instruction, and an action head that
            turns what it read into motion (section 5, Vision-Language-Action Models). In this lane every control
            step of every environment is a forward pass of all of it, where the first lane ran a two-layer encoder and three
            small layers.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>
          </Box>
          <Box variant="p">
            The environment counts show the price. NVIDIA&apos;s benchmark ran 8,192 environments on one GPU for a
            small policy. The authors of piRL, who fine-tune the pi0 and pi0.5 VLAs with PPO, run 64 to 320
            environments on 8 H100 80 GB GPUs: 64 / 8 = 8 to 320 / 8 = <Derived>40</Derived> environments per GPU,
            between about <Derived>200</Derived> and <Derived>1,000</Derived> times fewer than 8,192. The GPUs,
            simulators and tasks differ, so the ratio is rough, and its size is the point. They report
            pi0.5, trained from one demonstration per task, rising from 77.1% to 98.3% average success on LIBERO,
            a suite of simulated manipulation tasks used as a benchmark.{' '}
            <Cite id="F04-69">piRL paper, section 5 and appendix J</Cite>{' '}
            <Cite id="F04-54">Isaac Lab 3.0 benchmark file</Cite>
          </Box>
          <Box variant="p">
            One run on AWS puts a duration on such a job. An AWS sample repository runs a recipe of RLinf v0.4,
            the project of the piRL authors, on OpenVLA-OFT, a 7B-parameter VLA, in LIBERO&apos;s Goal suite. Its
            algorithm is GRPO (Group Relative Policy Optimization), which scores each attempt against the others
            collected with it, and its results file counts progress in GRPO steps, each about 25 minutes long in
            this run and so a far larger thing than a control step. On one p5en.48xlarge Spot instance with 8 H200 GPUs the
            sample&apos;s authors report a single run: 75 GRPO steps in 31.6 hours of training, about 25 minutes
            per training step, with success rising from 48.6% (243/500) to 85.0% (425/500).{' '}
            <Cite id="F04-70">AWS sample, docs/results.md</Cite>
          </Box>
          <Box variant="p">
            The time of one training step is the number to measure before the job is given a time limit. The same
            file records an earlier run on 8 H100 GPUs that had 38 hours left under its 40-hour wall-clock cap
            when GRPO training began, and took about 27 minutes per training step. 38 hours are{' '}
            <Derived>2,280</Derived> minutes, room for about <Derived>84</Derived> of the 100 training steps it
            was asked for, and the cap stopped it at step 83. The
            timeout fired before the latest checkpoint was uploaded, and the instance terminated with its
            checkpoints on its own disk. Set the cap from a measured training-step time, and copy checkpoints off the
            instance while the job runs.{' '}
            <Cite id="F04-71">AWS sample, docs/results.md, earlier run</Cite>
          </Box>
          <Box variant="p">
            Run on real robots, this lane pays twice: the large model&apos;s forward pass at every control step, and
            the people of the real-arm lane. Recap, a method from Physical Intelligence, improves a VLA from a few
            hundred of its own attempts per round by repeating three stages: collect autonomous attempts, with a
            person free to take over and correct; train a value function on all the data; retrain the policy.{' '}
            <Cite id="F04-60">Recap paper, section IV-C</Cite> A value function is a second model that looks at
            the current moment and predicts how well the attempt will end. Recap&apos;s is a VLM (vision-language
            model, the image-and-text network a VLA is built on) with a 670M-parameter backbone. It predicts the
            steps left until success, as a negative number scaled to between -1 and 0.{' '}
            <Cite id="F04-61">Recap paper, sections IV-A and V-C</Cite>
          </Box>
          <Box variant="p">
            The policy update is supervised learning with one extra input. Recap labels every recorded action as
            better or worse than expected, trains the VLA to imitate all of them with that label beside the
            instruction, and at run time asks for &quot;better&quot;. The failed attempts stay in the training
            set, labelled as what they were.{' '}
            <Cite id="F04-62">Recap paper, section IV-B</Cite>
          </Box>
          <Box variant="p">
            The label comes from a subtraction. <M>{String.raw`R_t`}</M> is the outcome reached from step <M>t</M>{' '}
            to the end of the episode: the steps that were in fact left, on the same scale as the value. <M>{String.raw`V(o_t, \ell)`}</M> is the value
            model&apos;s prediction from the observation <M>{String.raw`o_t`}</M> (images and joint angles) and
            the instruction <M>{String.raw`\ell`}</M>. <M>{String.raw`\epsilon_\ell`}</M> is a threshold set per
            task, a different quantity from PPO&apos;s clip range. <M>{String.raw`I_t`}</M> is the label, true or
            false.
          </Box>
          <Formula
            name="Recap advantage and its better-than-expected label"
            tex={String.raw`\begin{aligned} A_t &= R_t - V(o_t, \ell) \\ I_t &= \big( A_t > \epsilon_\ell \big) \end{aligned}`}
            source={<><Cite id="F04-62">Recap paper, section IV-B, in this page&apos;s symbols</Cite> <Cite id="F11-6">Recap paper, appendix A-F</Cite></>}
          />
          <Box variant="p">
            <M>V</M> carries &quot;how well is this going&quot;. <M>{String.raw`A_t`}</M>, the advantage, carries
            the surprise: outcome minus prediction. <M>{String.raw`I_t`}</M> carries that surprise into the policy
            as an input. The formula is the form the paper uses for its pre-training data, where the outcome is
            the whole rest of the episode. For attempts collected on the robot the paper shortens the outcome to
            the rewards over a fixed number of steps ahead plus the value predicted at that later step; the
            subtraction and the label work the same way.{' '}
            <Cite id="F11-6">Recap paper, appendix A-F</Cite>
          </Box>
          <Box variant="p">
            An illustration with invented numbers: the value model says <Toy>-0.40</Toy> in the middle of a grasp,
            and the episode ends sooner than that implied, at <Toy>-0.30</Toy>, so <M>{String.raw`A_t`}</M> ={' '}
            <Toy>-0.30</Toy> - (<Toy>-0.40</Toy>) = <Derived>+0.10</Derived>. With a threshold of{' '}
            <Toy>+0.05</Toy> the grasp is filed as better than expected. Had the block slipped, the label would be
            false and the data would still be used. Actions a person supplied while correcting are labelled true
            by rule, so one training rule covers demonstrations, autonomous attempts and corrections.{' '}
            <Cite id="F04-62">Recap paper, section IV-B</Cite>{' '}
            <Cite id="F04-63">Recap paper, section IV-B, human corrections</Cite>
          </Box>
          <Box variant="p">
            A round is hundreds of attempts. The authors report 300 autonomous trajectories on four robots per
            iteration for T-shirt folding, and 600 autonomous trials plus 360 with interventions per iteration on
            3 robots for box assembly.{' '}
            <Cite id="F04-65">Recap paper, section VI-B and appendix</Cite> Each round ends by retraining pi*0.6,
            the VLA being improved, which has a Gemma 3 4B VLM as its backbone and an 860M-parameter action head
            (the paper&apos;s &quot;action expert&quot;).{' '}
            <Cite id="F04-64">Recap paper, sections V-A and V-B</Cite> With that on-robot data added the authors
            report throughput, counted as successful tasks per hour, more than doubling on their laundry-folding
            and espresso tasks.{' '}
            <Cite id="F04-66">Recap paper, section VI-B and figure 7</Cite> NVIDIA reports a gain for GR00T 2 on
            three contact-rich insertion tasks: from 40 to 76% success after supervised training to 88 to 96% with
            RL on the real robot. Its page gives no robot count, episode count or training time for that stage.{' '}
            <Cite id="F04-68">NVIDIA GR00T 2 page</Cite>
          </Box>
          <Box variant="p">
            People bound that supply. In the authors&apos; words the system &quot;relies on human labeling and
            effort for reward feedback, interventions, and episode resets&quot;, and it learns in rounds: it
            &quot;collects a batch of data, retrains the model, and repeats&quot;.{' '}
            <Cite id="F04-67">Recap paper, section VII</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description={`Get a policy from a few hundred real attempts on the ${ARM}: reuse every step, and take over when an attempt goes wrong`}>
            On the real arm, the person is part of the algorithm
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The third supply has no simulator and no large model. The arm tries the task. You sit beside it with
            the leader arm, the hand-held copy that drives it in teleoperation (section 3, The Robot as a
            Computer), and when an attempt is going wrong you take over briefly, then let go. After each attempt
            the block goes back to its start. The recipe is HIL-SERL (human-in-the-loop sample-efficient RL).
            LeRobot v0.7.0 ships it for the SO-100 and {ARM} and recommends the {ARM} leader for takeovers,
            because its geared joints let it track the follower while the policy drives.{' '}
            <Cite id="F04-80">LeRobot v0.7.0 hilserl.mdx, SO-101 sections</Cite>
          </Box>
          <Box variant="p">
            The authors of the 2024 paper that introduced HIL-SERL report near-perfect success on contact-rich tasks, where parts press against
            each other, within 1 to 2.5 hours of real-robot training, starting from 20 to 30 human demonstrations,
            with one RTX 4090 doing the learning.{' '}
            <Cite id="F04-72">HIL-SERL paper, abstract and section 4</Cite> At LeRobot&apos;s example timing, 2.5
            hours holds at most 2.5 x <Derived>144</Derived> = <Derived>360</Derived> attempts of at most 20 s at
            10 steps a second, <Derived>72,000</Derived> control steps. The simulator recipe used 196,608,000,
            about <Derived>2,700</Derived> times as many.{' '}
            <Cite id="F04-77">LeRobot v0.7.0 hilserl.mdx</Cite>{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>
          </Box>
          <Box variant="p">
            So few steps go that far because each one is reused. At <Derived>144</Derived> attempts an hour nothing
            can be thrown away, and every real step is trained on many times. LeRobot&apos;s implementation uses SAC (Soft Actor-Critic), an RL method that trains from a replay buffer, a
            store of past steps that training samples from again and again, where PPO discards a batch after a
            few passes.{' '}
            <Cite id="F04-76">LeRobot v0.7.0 hilserl.mdx, actor and learner</Cite> A person also steers what is collected. In the HIL-SERL paper the learner keeps two buffers, one of human demonstrations and one of the
            robot&apos;s own experience, and draws every training batch equally from both.{' '}
            <Cite id="F04-73">HIL-SERL paper, section 3.2</Cite> When you take over, your action replaces the
            policy&apos;s and is stored with the rest.{' '}
            <Cite id="F04-74">HIL-SERL paper, sections 3.2 and 3.3</Cite>
          </Box>
          <Box variant="p">
            Two programs share the work, because the arm has a clock and a gradient update takes as long as it
            takes. The actor runs the current policy on the arm, 10 times a second in the example configuration,
            and sends each transition (the observation, the action, the reward and the next observation) to the
            learner over gRPC, a remote procedure call protocol. The learner holds the replay buffers, does the
            gradient updates on a GPU and sends new weights back.{' '}
            <Cite id="F04-76">LeRobot v0.7.0 hilserl.mdx, actor and learner</Cite>{' '}
            <Cite id="F04-77">LeRobot v0.7.0 hilserl.mdx</Cite>
          </Box>
          <Box variant="p">
            The defaults say how loosely the two are coupled. The learner pushes weights to the actor every 4
            seconds, so the arm acts on weights up to 4 seconds old; LeRobot&apos;s note on that setting is to
            lower it to 1 or 2 s for fresher weights at the cost of more network traffic. Each buffer holds
            100,000 transitions, more than the <Derived>72,000</Derived> steps a 2.5-hour run can produce, so
            nothing collected in a run of that length is dropped. The learner&apos;s default address is the local
            machine, so one computer with a GPU beside the arm runs both programs unless you point the actor
            elsewhere.{' '}
            <Cite id="F04-72">HIL-SERL paper, abstract and section 4</Cite>{' '}
            <Cite id="F04-78">LeRobot v0.7.0 gaussian_actor and SAC configuration</Cite>{' '}
            <Cite id="F04-76">LeRobot v0.7.0 hilserl.mdx, actor and learner</Cite>
          </Box>
          <Box variant="p">
            The guide&apos;s advice on tasks follows from the attempt arithmetic: &quot;Focus on tasks that can be
            completed in 5-10 seconds.&quot; An episode that ends in 10 s, with the same 5 s reset, is <Derived>15</Derived> s per
            attempt and <Derived>3,600</Derived> / <Derived>15</Derived> = <Derived>240</Derived> attempts an
            hour.{' '}
            <Cite id="F04-77">LeRobot v0.7.0 hilserl.mdx</Cite>
          </Box>
          <Box variant="p">
            What limits this lane is your own skill at interrupting, and it is learned over runs. LeRobot&apos;s
            guide warns that &quot;The learning process is very sensitive to the intervention strategy&quot; and
            that it takes a few runs to understand how to intervene effectively, so plan for several runs
            before a good one. Its test of a healthy run: &quot;A successful experiment is one where the
            human has to intervene at the start but then reduces the amount of interventions as the policy
            improves.&quot;{' '}
            <Cite id="F04-79">LeRobot v0.7.0 hilserl.mdx, human interventions</Cite> The guide opens with
            the promise that you will train a policy on a real robot &quot;in just a few hours&quot;, and at v0.7.0
            it has no table of results, so the hours and the success rate on this arm are yours to measure.{' '}
            <Cite id="F04-80">LeRobot v0.7.0 hilserl.mdx, SO-101 sections</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Check the grader and the transfer before you spend attempts on them: both are learned exactly as given">
            Attempts are only as good as the reward and the simulator behind them
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            RL moves the policy toward whatever was scored well, so an error in the reward is trained in. In
            LeRobot&apos;s recipe and in Recap the grader is a person or a small classifier.{' '}
            <Cite id="F04-77">LeRobot v0.7.0 hilserl.mdx</Cite>{' '}
            <Cite id="F04-67">Recap paper, section VII</Cite> The HIL-SERL authors report that their trained
            classifier generally exceeds 95% accuracy on its evaluation set.{' '}
            <Cite id="F04-74">HIL-SERL paper, sections 3.2 and 3.3</Cite>
          </Box>
          <Box variant="p">
            A large general model is a weaker judge today. The authors of FailBench tested 13 detectors built on
            vision-language models on 2,197 real and simulated manipulation attempts. They report 0.77 for the
            best in mean balanced accuracy (the average of the detection rate on successes and the detection rate
            on failures, where 0.5 is chance), none above 0.60 on contact-intensive assembly, and a bias toward
            declaring success. A judge with that bias pays the policy for failures (section 19, Agents Running the
            Loop, takes up who may write the grader).{' '}
            <Cite id="F04-45">FailBench paper, abstract</Cite>
          </Box>
          <Box variant="p">
            Whether a run helped is itself a count with an error bar. The AWS run scored its policy on 500 simulated
            episodes before and after, and its file gives 95% intervals of 44.2-53.0% and 81.6-87.9%, which
            do not overlap. The repository&apos;s short test profile, 5 training steps on one L40S GPU in 56
            minutes, moved success from 45.0% to 50.0% with overlapping intervals, a change the count cannot tell
            from chance (section 16, Evaluation).{' '}
            <Cite id="F04-70">AWS sample, docs/results.md</Cite>
          </Box>
          <Box variant="p">
            The simulator is the other input. A policy trained in simulation has met only
            the simulated arm, so the {ARM} task changes that arm at the start of every episode, which is called
            domain randomisation: fingertip friction, motor gains, joint damping, cube size, colours, lighting and
            camera parameters, the height of the base by plus or minus 2.5 mm, and a bias on the joint readings
            that imitates a badly calibrated arm.{' '}
            <Cite id="F06-28">MuJoCo Playground SO-101 task.py, randomisation</Cite> The bias is there because
            hand calibration of this arm &quot;can easily be off by 1-2+ cm in end-effector height&quot;, by the
            task&apos;s own deploy README.{' '}
            <Cite id="F06-29">MuJoCo Playground SO-101 deploy README</Cite>
          </Box>
          <Box variant="p">
            What the randomisation leaves is stated in the same README: the policy was &quot;tested on 3 different
            robot setups under various lighting conditions&quot;, and &quot;there may still be visual domain gap
            with darker shadows&quot;. The README and task files at 1.0.1 give no success rate for it, so the first
            figure for this policy on a real arm will be your own count at your own bench. Section 14, Sim-to-Real and Real-to-Sim, covers
            the two remedies: widen what the simulator varies, or measure the arm and correct the simulator.{' '}
            <Cite id="F06-26">MuJoCo Playground SO-101 deploy README</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Choose the lane by what you have plenty of, then size the part of the machine it runs out of first">
            Each supply exhausts a different part of the machine
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The three lanes buy three different machines, because each exhausts a different part first (the
            parts and shapes in the table are our reading of the cited sources). Section 20, Fifteen Workloads,
            Five Shapes, sets them beside the other jobs around the arm.{' '}
            <Cite id="F08-76">the workload table, rows 6 and 7</Cite>{' '}
            <Cite id="F04-81">synthesis of the Playground and LeRobot entries</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 860 }}>
              <thead>
                <tr>
                  <th style={TH}>Lane</th>
                  <th style={TH}>Supply of attempts</th>
                  <th style={TH}>What the run waits on</th>
                  <th style={TH}>Part it exhausts first</th>
                  <th style={TH}>Shape of the job</th>
                  <th style={TH}>For the {ARM}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>In a simulator</td>
                  <td style={TD}>About 197 million control steps in one recipe, with no person involved</td>
                  <td style={TD}>Simulator and renderer throughput; in NVIDIA&apos;s manipulation rows a camera takes about half of it</td>
                  <td style={TD}>
                    General GPU compute for the physics, with one CPU core feeding it. With cameras, GPU memory
                    first and then the rendering path
                  </td>
                  <td style={TD}>One GPU on one node, exchanging nothing with another machine</td>
                  <td style={TD}>
                    <code>{SIM_TASK}</code> in MuJoCo Playground, the pick half.{' '}
                    <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>{' '}
                    <Cite id="F04-55">Isaac Lab 3.0 benchmark file</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>On a pretrained policy</td>
                  <td style={TD}>64 to 320 environments in simulation; hundreds of attempts per round on real robots</td>
                  <td style={TD}>Forward passes of a large model; on real robots, people for rewards, corrections and resets</td>
                  <td style={TD}>The GPUs that run the model&apos;s forward passes: eight of them for 31.6 hours in the one reported run</td>
                  <td style={TD}>One node for more than a day; an interruption costs everything since the last checkpoint copied off the machine</td>
                  <td style={TD}>
                    No recipe specific to this arm was located in this research.{' '}
                    <Cite id="F04-69">piRL paper, section 5 and appendix J</Cite>{' '}
                    <Cite id="F04-70">AWS sample, docs/results.md</Cite>{' '}
                    <Cite id="F04-67">Recap paper, section VII</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>On the real arm</td>
                  <td style={TD}>
                    At most <Derived>144</Derived> an hour
                  </td>
                  <td style={TD}>The arm, the reset and a person&apos;s attention</td>
                  <td style={TD}>The arm and the person. The computer is one GPU for the learner, and a CPU with the cameras for the actor</td>
                  <td style={TD}>Bound to the arm and the person beside it, 1 to 2.5 hours in the HIL-SERL authors&apos; report</td>
                  <td style={TD}>
                    HIL-SERL actor and learner in LeRobot.{' '}
                    <Cite id="F04-76">LeRobot v0.7.0 hilserl.mdx</Cite>{' '}
                    <Cite id="F04-72">HIL-SERL paper, abstract and section 4</Cite>{' '}
                    <Cite id="F04-77">LeRobot v0.7.0 hilserl.mdx</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Choose by what you have plenty of. With one GPU and no free afternoons, run the Playground recipe and
            keep time for the transfer to the real arm. With a few hours of your own attention, run LeRobot&apos;s
            actor and learner at the bench. Start the middle lane only once a fine-tuned VLA already works some of
            the time, and treat it as a multi-GPU job with a time limit and a checkpoint path.
          </Box>
          <Box variant="p">
            Then count the attempts before you choose an algorithm. In a simulator the count is environments x
            steps per update x updates, and a measured steps per second turns it into a run time: for the {ARM}{' '}
            recipe, 196,608,000 divided by what your GPU delivers with the camera on. At the bench it is <Derived>3,600</Derived>{' '}
            divided by the seconds of one episode plus one reset, 25 s at LeRobot&apos;s example values, each
            attempt with you beside the arm. For a VLA, time one training step first: at about 25 minutes each,
            75 of them took more than a day on eight GPUs.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>{' '}
            <Cite id="F04-77">LeRobot v0.7.0 hilserl.mdx</Cite>{' '}
            <Cite id="F04-70">AWS sample, docs/results.md</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
