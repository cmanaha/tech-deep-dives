import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Toy, Derived } from '../components/Cite';
import { Figure } from '../components/Figure';
import { ARM, TASK_STORY, SIM_TASK, SIM_TASK_PLAIN, SIM_TASK_GAP } from '../lib/task';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const NEUTRAL_FILL = '#eef0f2';
const NEUTRAL_INK = '#5f6b7a';
const EMPHASIS = '#0972d3';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 560, margin: '0 auto' };

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/* ------------------------------------------------------------------------ */
/* Diagram 8.1 (static): three lanes, what is plentiful and scarce in each  */
/* ------------------------------------------------------------------------ */

interface Lane {
  title: string;
  sub: string;
  fill: string;
  ink: string;
  plentiful: string;
  scarce: string;
  waits: string;
}

const LANES: Lane[] = [
  {
    title: '1. In a simulator',
    sub: '4,096 simulated copies of the arm on one GPU',
    fill: '#fdeedd',
    ink: '#a85a0a',
    plentiful: 'attempts: 197 million control steps',
    scarce: 'realism: the result must transfer',
    waits: 'simulator steps per second',
  },
  {
    title: '2. On a pretrained policy',
    sub: 'a VLA practises, in simulation or on real robots',
    fill: '#e6f6ea',
    ink: '#1e7b3a',
    plentiful: 'skill the model already has',
    scarce: 'attempts: each step runs a big model',
    waits: 'rollouts: 64 to 320 copies on 8 GPUs',
  },
  {
    title: '3. On the real arm',
    sub: 'one arm, one person nearby, one GPU for the learner',
    fill: '#fff6d6',
    ink: '#7a5c00',
    plentiful: 'realism: it is the real arm',
    scarce: 'attempts: 20 s each, then a 5 s reset',
    waits: 'the arm, the reset and a person',
  },
];

const LOOP_PILLS = ['try the task', 'score it', 'update policy'];

function ThreeLanesDiagram() {
  const laneTop = (i: number) => 82 + i * 158;
  const rows: { label: string; key: 'plentiful' | 'scarce' | 'waits' }[] = [
    { label: 'Plentiful', key: 'plentiful' },
    { label: 'Scarce', key: 'scarce' },
    { label: 'Waits on', key: 'waits' },
  ];
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 556" role="img" aria-labelledby="robot-rl-lanes-title" style={{ width: '100%', height: 'auto' }}>
        <title id="robot-rl-lanes-title">Three places reinforcement learning runs for a robot, and what each one waits on</title>
        <desc>
          One loop, try the task, score it, update the policy, sits above three lanes. In a simulator attempts are
          plentiful and realism is scarce, and training waits on the simulator. On a pretrained policy the existing
          skill is plentiful and attempts are scarce, and training waits on rollouts of a large model. On the real
          arm realism is plentiful and attempts are scarce, and training waits on the arm, the reset and a person.
        </desc>
        <defs>
          <marker id="robot-rl-lanes-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill={NEUTRAL_INK} />
          </marker>
        </defs>
        <rect x="0" y="0" width="400" height="556" fill="#fbfbfd" />

        {/* the shared loop */}
        <text x="200" y="26" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill={INK}>
          The same loop in every lane
        </text>
        {LOOP_PILLS.map((p, i) => (
          <g key={p}>
            <rect x={30 + i * 120} y="38" width="100" height="26" rx="13" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1.2" />
            <text x={80 + i * 120} y="55" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill={INK}>
              {p}
            </text>
          </g>
        ))}
        <line x1="131" y1="51" x2="147" y2="51" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#robot-rl-lanes-arrow)" />
        <line x1="251" y1="51" x2="267" y2="51" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#robot-rl-lanes-arrow)" />

        {LANES.map((lane, i) => {
          const y0 = laneTop(i);
          return (
            <g key={lane.title}>
              <rect x="12" y={y0} width="376" height="148" rx="6" fill="#ffffff" stroke={lane.ink} strokeWidth="1.5" />
              <path d={`M12 ${y0 + 44} V${y0 + 6} a6 6 0 0 1 6 -6 H382 a6 6 0 0 1 6 6 V${y0 + 44} Z`} fill={lane.fill} stroke={lane.ink} strokeWidth="1.5" />
              <text x="24" y={y0 + 19} fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill={lane.ink}>
                {lane.title}
              </text>
              <text x="24" y={y0 + 36} fontFamily="sans-serif" fontSize="12" fill={INK}>
                {lane.sub}
              </text>
              {rows.map((r, k) => {
                const y = y0 + 52 + k * 31;
                const waits = r.key === 'waits';
                return (
                  <g key={r.key}>
                    <rect x="20" y={y} width="84" height="25" rx="4" fill={NEUTRAL_FILL} stroke="none" />
                    <text x="28" y={y + 17} fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill={INK}>
                      {r.label}
                    </text>
                    <rect
                      x="110"
                      y={y}
                      width="270"
                      height="25"
                      rx="4"
                      fill="#ffffff"
                      stroke={waits ? EMPHASIS : '#c6ccd2'}
                      strokeWidth={waits ? 2.5 : 1}
                    />
                    <text x="120" y={y + 17} fontFamily="sans-serif" fontSize="12" fill={INK}>
                      {lane[r.key]}
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
            description="Know the three places RL is used for robots and what each one waits on (MuJoCo Playground 1.0.1, Isaac Lab 3.0 and LeRobot v0.7.0, sources read 2026-11-20)."
          >
            8. Reinforcement Learning for Robots
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Imitation gives the {ARM} a policy that copies what you showed it. RL (reinforcement learning) is how a
            policy gets better than its demonstrations: it attempts the task, each attempt is scored, and training
            shifts the policy toward what scored well. For a robot the practical question is where the attempts
            come from. It has three answers, and each one waits on a different thing.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="What RL adds once more demonstrations stop helping, and the one number every method here has to live with">
            Practice at the bench
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The policy from section 4 is running on the arm. Asked to {TASK_STORY}, it closes on the block most of
            the time. Now and then the gripper closes a little early and the block skids away. More demonstrations
            give the policy more of what you already showed it. What it lacks is practice: its own attempts, the
            bad ones included, and a signal that says which was which.
          </Box>
          <Box variant="p">
            RL supplies that in three parts. A reward is a number that scores an attempt, as simple as 1 when the
            block ends in the cup and 0 otherwise. A trial is one attempt by the current policy, also called an
            episode or a rollout. Improvement is a training step that makes the actions from high-scoring trials
            more likely and the rest less likely.
          </Box>
          <Box variant="p">
            Two algorithms recur below. PPO (Proximal Policy Optimization) takes small, bounded update steps from
            batches of fresh attempts. GRPO (Group Relative Policy Optimization) scores each attempt against the
            others in its group, so it needs no second model to judge them. The{' '}
            <Link href="../rl-agentic-loops/">Learning From Feedback dive</Link> builds both; this section takes
            them as given.
          </Box>
          <Box variant="p">
            Both need attempts in bulk, and a real arm produces them slowly. LeRobot&apos;s example configuration
            for RL on a real arm lets an episode run at most 20 s and then waits 5 s for the scene to be reset.
            That is 20 + 5 = <Derived>25</Derived> s per attempt, so at most <Derived>3,600</Derived> /{' '}
            <Derived>25</Derived> = <Derived>144</Derived> attempts an hour, with a person standing by.{' '}
            <Cite id="F04-77">LeRobot v0.7.0 hilserl.mdx</Cite> Every method in this section either lives with a
            number like that or gets away from it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="One picture that places any robot RL recipe you meet: where its attempts come from and what it waits on">
            Three lanes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The attempts can come from three places. The first is a simulator, a program that computes how the arm
            and the block move, so an attempt needs no hardware (section 12 builds it). The second starts from a
            pretrained policy, here a VLA (vision-language-action model): the large model of section 5 that reads
            camera images and a text instruction and outputs action chunks, and that already does the task some of
            the time. The third is the real arm on the bench, with a person next to it.
          </Box>
          <Figure
            cites="F04-58 F04-69 F04-77 F04-76"
            caption={
              <>
                Read each lane top to bottom: what it has plenty of, what it is short of, and the thing its training
                loop spends its time waiting for (outlined in blue). The figures are from the recipes worked through
                below: the simulated {ARM} recipe, the authors&apos; setup for RL on a VLA in simulation, and
                LeRobot&apos;s real-arm example.
              </>
            }
          >
            <ThreeLanesDiagram />
          </Figure>
          <Box variant="p">
            The algorithms are close relatives. The bottleneck is what changes: the simulator&apos;s throughput,
            then rollouts of a large model, then the robot&apos;s time, the reset and a person. Knowing the lane
            tells you what to provision and what a faster GPU will not fix.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Thousands of arms at once, waiting on the simulator: what one published recipe for this arm consumes">
            RL in simulation
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A simulator on a GPU can advance many independent copies of the scene in one batch. Each copy (an arm,
            a table, a cube) is called an environment, and running them side by side is what &quot;parallel
            environments&quot; means. One GPU then produces attempts thousands at a time, and a copy that finishes
            is put back at its start by the program.
          </Box>
          <Box variant="p">
            Such a recipe ships for this arm. MuJoCo Playground 1.0, a suite of simulated robot tasks from
            Google DeepMind, includes <code>{SIM_TASK}</code>: PPO trains a policy from a 64 x 64 image of a
            simulated wrist camera, acting 10 times a second, and the result is deployed on the real {ARM} with no
            further training, which is called zero-shot. The shipped task covers the pick half of the story: the
            policy learns to {SIM_TASK_PLAIN}; {SIM_TASK_GAP} is this dive&apos;s extension.{' '}
            <Cite id="F04-57">MuJoCo Playground v1.0.1, SO-101 deploy README and task.py</Cite>
          </Box>
          <Box variant="p">
            The default recipe is three numbers. It runs 4,096 simulated arms in parallel, collects 16 control
            steps from each, updates the policy, and repeats that 3,000 times. A control step is one decision by
            the policy and the motion that follows it. Our arithmetic from the file:
          </Box>
          <Box variant="p">
            <code>4,096 arms x 16 control steps x 3,000 iterations = 196,608,000 control steps</code>
          </Box>
          <Box variant="p">
            That is about 197 million control steps. At 10 a second it is 19,660,800 simulated seconds, about 228
            days of one arm moving without a pause. The files read publish no wall-clock time for this recipe.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>
          </Box>
          <Box variant="p">
            Follow one of the 16 steps through the GPU. The simulator renders a camera for every copy, which means
            computing the image a wrist camera would see (section 13 covers how): 4,096 images of 64 x 64. The
            policy reads them as one batch and returns 4,096 actions. It is a small network, a two-layer
            convolutional encoder feeding an MLP (multilayer perceptron, a plain stack of fully connected layers)
            with layers of 256, 256 and 128 units. The physics advances every copy and the task&apos;s reward
            function scores the result. After 16 such steps PPO updates the weights from all of them.{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>
          </Box>
          <Box variant="p">
            Under each control step sit 20 physics steps: the simulator advances every 5 ms and the policy acts
            every 100 ms. Section 12 reads the rest of the solver settings.{' '}
            <Cite id="F06-105">MuJoCo Playground simulation config and SO-101 task.py</Cite>{' '}
            <Cite id="F06-106">MuJoCo Playground plane.xml</Cite>
          </Box>
          <Box variant="p">
            The cost is one GPU, and the run waits on how many steps a second the simulator and the renderer
            deliver. NVIDIA publishes such rates for Isaac Lab 3.0, its robot-learning framework, on one
            RTX PRO 6000 Blackwell Server Edition with 8,192 environments. For a Franka arm lifting a cube from
            state observations (joint angles and object positions as numbers, with no image), NVIDIA&apos;s file
            reports about 165,000 steps per second on the PhysX physics engine and about 319,000 on the Newton
            MuJoCo-Warp engine.{' '}
            <Cite id="F04-54">Isaac Lab 3.0 benchmark file, Franka lift rows</Cite>
          </Box>
          <Box variant="p">
            A camera takes about half of that away. In the same file, a lift task for a Kuka arm with an Allegro hand, with one 64 x 64 camera per environment, is reported at about 28,000 steps per second against about 61,000 without the
            camera on PhysX with RTX rendering, and about 116,000 against 221,000 on the Newton physics and
            renderer pair.{' '}
            <Cite id="F04-55">Isaac Lab 3.0 benchmark file, Kuka-Allegro rows</Cite> The camera adds rendering work
            and memory to a card that was running physics and a small network, which makes vision-based RL the
            expensive case in this lane.
          </Box>
          <ExpandableSection headerText="How to read those benchmark rows">
            <ul style={LIST}>
              <li>
                They are throughput for other robots, not time to a working policy. The {ARM} recipe has no
                published rate, and the file&apos;s own quality notes read &quot;dirty working tree
                reported&quot;.{' '}
                <Cite id="F04-54">Isaac Lab 3.0 benchmark file and README</Cite>
              </li>
              <li>
                The camera is one fixed base camera at 64 x 64, read from the task&apos;s preset code. The Newton
                row renders plain colour and the RTX row a shaded data type, so the two renderers do not produce
                the same output.{' '}
                <Cite id="F06-103">Isaac Lab camera_cfg.py and benchmark README</Cite>
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Improving a VLA from its own attempts, waiting on rollouts: how the method works and what one run on AWS took">
            RL on top of a pretrained policy
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The second lane starts from a VLA that already works some of the time and uses RL to raise its success
            rate. The model attempts the task again and again, and someone or something marks each attempt. Every
            step is now a forward pass of a model with billions of parameters, so attempts are expensive wherever
            they run.
          </Box>
          <Box variant="p">
            <strong>On real robots.</strong> Recap, a method from Physical Intelligence, repeats three steps:
            collect autonomous rollouts, with a person free to take over and correct; train a value function on
            all the data; retrain the policy.{' '}
            <Cite id="F04-60">Recap paper, section IV-C</Cite> A value function is a second model that looks at
            the current moment and predicts how well the attempt will end. Recap&apos;s is a VLM (vision-language
            model, the image-and-text network a VLA is built on) with a 670M-parameter backbone. It predicts the
            steps left until success as a negative number scaled to between -1 and 0, spread over 201 bins.{' '}
            <Cite id="F04-61">Recap paper, sections IV-A and V-C</Cite>
          </Box>
          <Box variant="p">
            Then the policy update. Recap labels every recorded action as better or worse than
            expected, trains the VLA to imitate all of them with that label as one more input, and at run time
            asks for &quot;better&quot;. Four symbols. <code>R_t</code> is what happened from step <code>t</code>{' '}
            to the end of the episode, on the same scale as the value. <code>V(o_t, l)</code> is the value
            model&apos;s prediction from the observation <code>o_t</code> (images and joint angles) and the
            instruction <code>l</code>. <code>eps_l</code> is a threshold set per task. <code>I_t</code> is the
            label, true or false.
          </Box>
          <Box variant="p">
            <code>A_t = R_t - V(o_t, l)</code>
            <br />
            <code>{'I_t = (A_t > eps_l)'}</code>
          </Box>
          <Box variant="p">
            <code>V</code> carries &quot;how well is this going&quot;. <code>A_t</code>, the advantage, carries
            the surprise: outcome minus prediction. <code>I_t</code> carries that surprise into the policy as an
            input next to the instruction. An illustration with invented numbers: the value model says{' '}
            <Toy>-0.40</Toy> in the middle of a grasp, the episode ends sooner than that implied, at{' '}
            <Toy>-0.30</Toy>, so <code>A_t</code> = <Toy>-0.30</Toy> - (<Toy>-0.40</Toy>) ={' '}
            <Derived>+0.10</Derived>. With a threshold of <Toy>+0.05</Toy> the grasp is filed as better than
            expected. Had the block slipped, the label would be false and the data would still be used. Training
            stays the supervised loss the VLA already had, and actions a person supplied while correcting are
            labelled true by rule.{' '}
            <Cite id="F04-62">Recap paper, section IV-B</Cite>{' '}
            <Cite id="F04-63">Recap paper, section IV-B, human corrections</Cite>
          </Box>
          <Box variant="p">
            The model being retrained, pi*0.6, has a Gemma 3 4B VLM and an 860M-parameter action expert, the part that produces the actions.{' '}
            <Cite id="F04-64">Recap paper, sections V-A and V-B</Cite> One round uses little data by simulation
            standards. The authors report 300 autonomous trajectories on four robots per iteration for
            T-shirt folding, and 600 autonomous trials plus 360 with interventions per iteration on 3 robots for
            box assembly.{' '}
            <Cite id="F04-65">Recap paper, section VI-B and appendix</Cite> They name what the loop waits on:
            &quot;it relies on human labeling and effort for reward feedback, interventions, and episode
            resets.&quot;{' '}
            <Cite id="F04-67">Recap paper, section VII</Cite>
          </Box>
          <Box variant="p">
            <strong>In simulation.</strong> With simulated rollouts the large model sets the scale. The authors of piRL fine-tune the pi0 and pi0.5 VLAs with PPO on 8 H100 80 GB GPUs with 64
            to 320 parallel environments. They report pi0.5, trained from one demonstration per task, rising from
            77.1% to 98.3% average success on LIBERO, a suite of simulated manipulation tasks used as a
            benchmark.{' '}
            <Cite id="F04-69">piRL paper, section 5 and appendix J</Cite> The first lane ran 8,192 environments
            on one GPU for a small policy; this one runs 64 to 320 on eight.{' '}
            <Cite id="F04-54">Isaac Lab 3.0 benchmark file</Cite>
          </Box>
          <Box variant="p">
            One run on AWS puts a duration on it. An AWS sample repository runs a GRPO recipe from the RLinf
            project on OpenVLA-OFT, a 7B-parameter VLA, in LIBERO-Goal, on one p5en.48xlarge Spot instance with 8
            H200 GPUs. Its authors report a single run: 75 GRPO steps in 31.6 hours of training, about 25 minutes
            per step, with success rising from 48.6% (243/500) to 85.0% (425/500).{' '}
            <Cite id="F04-70">AWS sample, docs/results.md</Cite> The same file records an earlier run that hit its
            40-hour wall-clock cap at step 83 of 100 and lost its last checkpoints, because the timeout fired
            before the upload. Size the cap from a measured step time and copy checkpoints off the instance
            while the job runs.{' '}
            <Cite id="F04-71">AWS sample, docs/results.md, earlier run</Cite>
          </Box>
          <ExpandableSection headerText="A vendor result for RL on real robots: GR00T 2">
            <Box variant="p">
              NVIDIA&apos;s GR00T 2 page reports three contact-rich insertion tasks (a part pushed into a socket) going from 40 to 76% success
              after supervised training to 88 to 96% with RL on the real robot, driven only by task-level success
              signals. The page gives no robot count, episode count or training time for that stage.{' '}
              <Cite id="F04-68">NVIDIA GR00T 2 page</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description={`Waiting on the robot, the reset and a person: what runs where when the ${ARM} learns at the bench`}>
            RL on the real arm
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The third lane has no simulator and no large model. The arm tries the task. You sit beside it with the
            leader arm of section 3, and when an attempt is going wrong you take over briefly, then let go. After
            each attempt the block goes back to its start. The recipe is HIL-SERL (human-in-the-loop
            sample-efficient RL), and LeRobot v0.7.0 ships it for the SO-100 and {ARM}, recommending the {ARM}{' '}
            leader as the takeover device.{' '}
            <Cite id="F04-80">LeRobot v0.7.0 hilserl.mdx, SO-101 sections</Cite>
          </Box>
          <Box variant="p">
            Two programs share the work, because the arm has a clock and gradient updates take as long as they
            take. The actor runs the current policy on the arm and sends each transition (the
            observation, the action, the reward and the next observation) to the learner over gRPC, a remote
            procedure call protocol. The learner keeps those transitions in replay buffers, does the gradient
            updates on a GPU, and sends new weights back. The algorithm is SAC (Soft Actor-Critic), an RL method
            that trains from a stored buffer of past steps, so each scarce real step is reused in many updates.{' '}
            <Cite id="F04-76">LeRobot v0.7.0 hilserl.mdx, actor and learner</Cite>
          </Box>
          <Box variant="p">
            In the example configuration images are cropped to the workspace and resized to 128 x 128, the control
            rate is 10 frames per second, an episode lasts at most 20 s and the reset wait is 5 s. A small image
            classifier can supply the reward, or you mark success by hand on a gamepad or keyboard.{' '}
            <Cite id="F04-77">LeRobot v0.7.0 hilserl.mdx</Cite>
          </Box>
          <Box variant="p">
            That is the <Derived>144</Derived> attempts an hour from the top of this section. The authors of the
            2024 paper that introduced HIL-SERL report near-perfect success on contact-rich tasks, where parts press against each other, within 1 to 2.5
            hours of real-robot training, starting from 20 to 30 human demonstrations, with one RTX 4090 doing the
            learning.{' '}
            <Cite id="F04-72">HIL-SERL paper, abstract and section 4</Cite> At <Derived>144</Derived> an hour,
            2.5 hours is at most <Derived>360</Derived> attempts (2.5 x <Derived>144</Derived>), against the 197
            million control steps of the simulated recipe. The demonstrations and the person close that distance.
            LeRobot&apos;s guide describes a healthy run: &quot;A successful experiment is one where the
            human has to intervene at the start but then reduces the amount of interventions as the policy
            improves.&quot;{' '}
            <Cite id="F04-79">LeRobot v0.7.0 hilserl.mdx, human interventions</Cite>{' '}
            <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Choose a lane by what you have plenty of, then check which part of the machine it loads">
            What each lane costs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The three lanes side by side. The last column is our reading of the code and documents at their
            November 2026 release tags.{' '}
            <Cite id="F04-81">synthesis of the Playground and LeRobot entries</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={TH}>Lane</th>
                  <th style={TH}>Plentiful</th>
                  <th style={TH}>Scarce, and what it waits on</th>
                  <th style={TH}>What it loads</th>
                  <th style={TH}>For the {ARM}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>In a simulator</td>
                  <td style={TD}>Attempts: about 197 million control steps in one recipe</td>
                  <td style={TD}>Realism. The run waits on simulator and renderer throughput, and a camera takes about half of it</td>
                  <td style={TD}>One GPU: physics, a small policy, and rendering when the policy sees images</td>
                  <td style={TD}>
                    <code>{SIM_TASK}</code> in MuJoCo Playground, the pick half.{' '}
                    <Cite id="F04-58">MuJoCo Playground env_rl_config.py</Cite>{' '}
                    <Cite id="F04-55">Isaac Lab 3.0 benchmark file</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>On a pretrained policy</td>
                  <td style={TD}>Skill the model already has, and data already recorded</td>
                  <td style={TD}>Attempts. The run waits on rollouts of a large model; on real robots it also waits on people for rewards and resets</td>
                  <td style={TD}>Eight datacenter GPUs for more than a day in the one reported run (31.6 hours), plus storage for checkpoints</td>
                  <td style={TD}>
                    No recipe specific to this arm was located in this research.{' '}
                    <Cite id="F04-70">AWS sample, docs/results.md</Cite>{' '}
                    <Cite id="F04-67">Recap paper, section VII</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>On the real arm</td>
                  <td style={TD}>Realism: nothing has to transfer</td>
                  <td style={TD}>Attempts. The run waits on the arm, the reset and a person&apos;s attention</td>
                  <td style={TD}>One GPU for the learner; a CPU and the cameras for the actor</td>
                  <td style={TD}>
                    HIL-SERL actor and learner in LeRobot.{' '}
                    <Cite id="F04-76">LeRobot v0.7.0 hilserl.mdx</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            A policy trained on about 197 million simulated steps is only as good as the match between the
            simulated arm and the real one, the subject of section 14, Sim-to-Real and Real-to-Sim. Reward labels
            and resets, the scarce inputs of the other two lanes, are what section 19, Agents Running the Loop,
            hands to coding agents. Section 20, Fifteen Workloads, Five Shapes, places all three lanes on the
            parts of the machine they load.
          </Box>
          <Box variant="p">
            With an {ARM} on the desk the choice is short. With one GPU, run the Playground recipe and expect to
            do the transfer work. With a few hours of your own attention to give, run LeRobot&apos;s actor and
            learner on the arm. Treat the middle lane as a multi-GPU job with a wall-clock cap and a checkpoint
            path, and start it only once a fine-tuned VLA already works some of the time.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
