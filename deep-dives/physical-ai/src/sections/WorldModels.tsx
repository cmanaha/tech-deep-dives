import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Derived } from '../components/Cite';
import { Figure, AnimatedFigure } from '../components/Figure';
import { Formula, M } from '../components/Math';
import { WmFamilies, WM_FAMILY_STEPS } from '../components/figures/WmFamilies';
import { log10Scale } from '../lib/scale';
import { ARM, TASK_STORY } from '../lib/task';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const NEUTRAL_INK = '#5f6b7a';
const PIXEL_BAR = '#5f6b7a';
const LATENT_BAR = '#0972d3';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 560, margin: '0 auto' };

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/* ------------------------------------------------------------------------ */
/* Diagram 6.3 (chart): time per imagined candidate, log axis               */
/* ------------------------------------------------------------------------ */

interface CandidateRow {
  name: string;
  detail: string;
  /** Value in milliseconds. */
  ms: number;
  /** Upper end of a published range, in milliseconds. */
  msHigh?: number;
  family: 'pixel' | 'latent';
}

const CANDIDATES: CandidateRow[] = [
  { name: 'Cosmos3-Nano rollout (pixel family)', detail: 'about 2.0 s on one H100 80GB; length not published', ms: 2000, family: 'pixel' },
  { name: 'Cosmos 1 7B tuned for planning (pixel family)', detail: '300 ms per candidate on one RTX 4090', ms: 300, family: 'pixel' },
  { name: 'V-JEPA 2-AC (latent family)', detail: '2 ms per candidate on one RTX 4090', ms: 2, family: 'latent' },
  { name: 'V-JEPA 2-AC, later paper (latent family)', detail: '0.375 ms per candidate on one A100', ms: 0.375, family: 'latent' },
  { name: 'LeWorldModel (latent family)', detail: '22 to 65 microseconds per step; GPU not named', ms: 0.022, msHigh: 0.065, family: 'latent' },
];

const AXIS_TICKS = [
  { ms: 0.01, label: '10 µs' },
  { ms: 0.1, label: '100 µs' },
  { ms: 1, label: '1 ms' },
  { ms: 10, label: '10 ms' },
  { ms: 100, label: '100 ms' },
  { ms: 1000, label: '1 s' },
  { ms: 10000, label: '10 s' },
];

function CandidateChart() {
  const x = log10Scale(0.01, 10000, 24, 384);
  const rowH = 66;
  const top = 14;
  const axisY = top + CANDIDATES.length * rowH + 4;
  const t = { fontFamily: 'sans-serif', fontSize: 12, fill: INK } as const;
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 436" role="img" aria-labelledby="world-models-candidate-title" style={{ width: '100%', height: 'auto' }}>
        <title id="world-models-candidate-title">Published time to predict one candidate future, by model and GPU, on a log axis</title>
        <desc>
          Five horizontal bars on a logarithmic time axis from 10 microseconds to 10 seconds. Two pixel-family bars
          sit at about 2.0 seconds and 300 milliseconds. Three latent-family bars sit at 2 milliseconds, 0.375
          milliseconds and between 22 and 65 microseconds. Each bar names its GPU.
        </desc>
        <rect x="0" y="0" width="400" height="436" fill="#fbfbfd" />
        {AXIS_TICKS.map((k) => (
          <line key={k.ms} x1={x(k.ms)} y1={top} x2={x(k.ms)} y2={axisY} stroke="#e3e6ea" strokeWidth="1" />
        ))}
        {CANDIDATES.map((c, i) => {
          const y0 = top + i * rowH;
          const fill = c.family === 'pixel' ? PIXEL_BAR : LATENT_BAR;
          return (
            <g key={c.name}>
              <text x="24" y={y0 + 12} {...t} fontWeight="bold">
                {c.name}
              </text>
              <path d={`M24 ${y0 + 20} H${x(c.ms)} v14 H24 Z`} fill={fill} />
              {c.msHigh !== undefined && <path d={`M${x(c.ms)} ${y0 + 20} H${x(c.msHigh)} v14 H${x(c.ms)} Z`} fill={fill} fillOpacity="0.4" />}
              <text x="24" y={y0 + 50} {...t}>
                {c.detail}
              </text>
            </g>
          );
        })}
        {/* the one like-for-like pair: rows 2 and 3 */}
        <path d={`M16 ${top + rowH + 2} H10 V${top + 2 * rowH + 54} H16`} fill="none" stroke={INK} strokeWidth="1.5" />
        <line x1="24" y1={axisY} x2="384" y2={axisY} stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <g aria-hidden="true">
          {AXIS_TICKS.map((k) => (
            <g key={k.ms}>
              <line x1={x(k.ms)} y1={axisY} x2={x(k.ms)} y2={axisY + 5} stroke={NEUTRAL_INK} strokeWidth="1.5" />
              <text x={x(k.ms)} y={axisY + 20} textAnchor="middle" {...t}>
                {k.label}
              </text>
            </g>
          ))}
        </g>
        <text x="204" y={axisY + 42} textAnchor="middle" {...t}>
          time to predict one candidate (log scale)
        </text>
        <text x="10" y={axisY + 66} {...t}>
          Bracket: the one pair with the same GPU and planner.
        </text>
        <text x="10" y={axisY + 84} {...t}>
          Grey: pixel family. Blue: latent family.
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function WorldModels() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="A world model predicts what a robot&apos;s cameras will show after the robot acts. Some world models predict the video frames themselves, and others predict only a compact summary of them. To choose between the two, start from what the job needs back from the model: video frames or a decision. You can then estimate the compute cost of one prediction with each kind."
          >
            6. World Models: Predicting Video Frames or a Compact Summary
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A world model is a network that predicts what a robot&apos;s cameras will show after the robot acts. The
            compute cost of each prediction depends on what you ask the model to predict. World models fall into two
            families, and both start the same way. A network called an encoder turns each camera frame into a set of
            vectors. That set of vectors is called a latent. Models in the pixel family predict a latent that still
            holds enough detail to redraw every pixel of the next frame. Cosmos 3 is NVIDIA&apos;s video world model.
            In NVIDIA&apos;s examples for Cosmos 3, producing that latent means running a transformer with billions of
            parameters tens of times. Models in the latent family predict a latent that is never turned back into
            pixels. This latent is a summary of the frame, and a network called a predictor produces it in a single
            pass.
          </Box>
          <Box variant="p">
            Among the models covered in this section, the two families are used for different jobs in 2026. Pixel models are
            used to generate training video, and some of them also control robots directly. Latent models are used
            for planning by search. In planning by search, a planner tries many candidate action sequences inside
            the model, scores each predicted future against a goal and runs the best one. For these two jobs the
            choice of family is clear, because generating video needs only a few predicted futures, while a search
            needs thousands of them for a single decision. For other jobs the choice is less clear. Pixel models are
            also used to train policies and to evaluate them, and the authors of one latent model write that their
            model can be used in the same way.
          </Box>
          <Box variant="p">
            One published comparison measures the difference in cost on the same GPU. V-JEPA 2-AC is a latent world
            model from Meta. Its authors used planning by search to choose single actions for a robot arm. Their
            search runs in rounds: it tries a batch of candidates, keeps the best ones and then tries new candidates
            around them. With their own model, choosing one action took 16 seconds on one RTX 4090 GPU. On the same
            GPU, a video model from the pixel family took 4 minutes, even though it tried one tenth as many
            candidates in each round. That video model was Cosmos 1, a 2025 model with 7B parameters, which the
            authors fine-tuned for the test. The comparison was run by the authors of the faster model.{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>{' '}
            <Cite id="F03-118">calculation, time per candidate</Cite>
          </Box>
          <Box variant="p">
            To compare the cost of a single prediction, divide each time by the number of futures that the search
            predicted. The latent search tried 800 candidates in each of 10 rounds, which is 8,000 predicted futures
            in 16 s, or 2 ms each. The video search tried 80 candidates in each of 10 rounds, which is 800 futures in
            240 s, or 300 ms each. So one predicted future cost 150 times as much with the video model.{' '}
            <Cite id="F03-24">V-JEPA 2 paper, section 4.2</Cite>{' '}
            <Cite id="F03-118">calculation, time per candidate</Cite>
          </Box>
          <Box variant="p">
            For any job you want to give a world model, ask two questions. How many predicted futures does the
            job need, and does anything read their pixels? Generating training video needs the pixels but only a few
            futures. Planning needs thousands of futures and only one score from each. When a model controls the
            arm directly, there is no time for a search with either family. The arm runs on a 30 Hz clock, so it
            needs a new action every{' '}
            <Derived>33.3</Derived> ms (section 3, The Robot as a Computer). This deadline is the reason for a third
            design: a model that outputs the action together with its prediction.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Just before the arm pushes the block, you can predict some parts of the next camera frame and not others. A model that generates whole frames has to produce both parts."
          >
            One tick before the push: what you can predict and what you cannot
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The {ARM}, a small desktop arm, has to {TASK_STORY}. Freeze the arm one tick before it touches the
            block, where a tick is one step of its control clock. The gripper is closed and sits just to the left of
            the block, and the next action swings it a little to the right. Before the motors move, you already know
            roughly what the top camera will show a moment later. The block will have slid toward the cup, the cup
            will still be where it was, and the table will look the same.
          </Box>
          <Box variant="p">
            You also know what you cannot predict: the exact glint of light on the rim of the cup, the grain of the
            camera noise, and whether the block ends up turned by a few degrees. You would bet on where the block
            goes, and you would not bet on the glint. A pixel model has to draw the glint anyway, because the glint
            is part of the frame. A latent model can leave the glint out. This one difference is why a predicted
            future costs so much more with a pixel model than with a latent model.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A world model is a function that takes a state and an action and returns the next state. The compute cost of any use of the model is the number of calls multiplied by the cost of one call."
          >
            What a world model computes: the next state from a state and an action
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A policy is the trained model that maps an observation to an action (section 3, The Robot as a
            Computer). It tells the arm what to do next, but it does not predict what happens after the arm acts. A
            world model is a network trained to make that prediction. From what has been observed so far and the
            actions taken, it predicts the future state of the world. For the arm, the model takes what the camera
            shows now and the action &quot;swing the gripper right&quot;, and it predicts what the camera will show
            next.{' '}
            <Cite id="F03-87">JEPA-WMs paper, section 1</Cite>
          </Box>
          <Box variant="p">
            Two words need a precise meaning here. An action is the set of six joint targets for one tick. A state
            is the model&apos;s description of the whole scene at one instant. It holds whatever the model needs in
            order to predict the next instant, including the block and the cup. Section 3 uses the word more
            narrowly, for <code>observation.state</code>, the six measured joint angles. With these two definitions,
            the prediction is a single function:
          </Box>
          <Formula name="A world model as a function" tex={String.raw`\text{next state} = f(\text{state},\ \text{action})`} />
          <Box variant="p">
            Here <M>f</M> is the trained network. Its output has the same form as its state input.
          </Box>
          <Box variant="p">
            Because the output has the same form as the input, you can feed the model its own prediction together
            with a second action, then a third, and so on. This chain of predictions is called a rollout. A rollout
            is the predicted future for one particular sequence of actions. An action sequence that is tried in this
            way is called a candidate. Nothing moves on the real table during a rollout. Each step builds on the output of the step
            before, so prediction errors add up along the chain. For that reason, the V-JEPA 2 authors name long
            rollouts as a limit of their model.{' '}
            <Cite id="F03-28">V-JEPA 2 paper, limitations</Cite>
          </Box>
          <Box variant="p">
            All the uses of a world model described below, except the last one, call this function many times. So
            you can estimate the cost of each of them the same way: multiply the number of rollout steps that the use
            needs by the cost of one step. The number of steps depends on the use. The cost of each step depends on what the model is
            asked to predict.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Planning needs a score for each candidate, and generating training data needs frames. Training or testing a policy inside the model needs the policy&apos;s next input, and controlling a robot needs an action."
          >
            Four uses of a world model and what each one needs back
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">A world model can be used in four ways, and each use needs something different back from the model:</Box>
          <ul style={LIST}>
            <li>
              <strong>Planning.</strong> A planner needs one number for each candidate: how far the predicted future
              lands from the goal. V-JEPA 2-AC measures this as the distance between two latents, the predicted
              latent and the latent of a picture of the goal. Because no frame is drawn at any point, a planner can
              afford to score thousands of candidates for one decision.{' '}
              <Cite id="F03-23">V-JEPA 2 paper, section 3.2, equation 5</Cite>
            </li>
            <li>
              <strong>Generating training data.</strong> This use needs the frames themselves (section 11,
              Augmentation and Synthetic Data). The output is video that a camera-based policy can train on, and each
              clip is generated only once. A decoder is a network that redraws the pixels from a latent. A latent
              model has no frames to hand over unless a separate decoder is trained for it.{' '}
              <Cite id="F03-109">V-JEPA 2 paper, appendix B.3</Cite>
            </li>
            <li>
              <strong>Training or testing a policy inside the model.</strong> You can improve a policy inside the
              world model, or score it without a robot (section 16, Evaluation). Both uses feed the model&apos;s
              predictions back to the policy in a closed loop. In a closed loop, each action changes what the policy
              sees next. So the model has to produce whatever the policy reads, once for every step of training or
              testing. Models from both families are used in this way. Dreamer 4, from Google DeepMind, trains its
              policy inside a model that generates frames, and its main result is in a video game.{' '}
              <Cite id="F03-90">Dreamer 4 paper, abstract and section 4</Cite> NVIDIA lists a Cosmos 3 checkpoint
              for closed-loop robot policy simulation.{' '}
              <Cite id="F03-92">NVIDIA Cosmos README, example checkpoints</Cite> The authors of RoboJEPA, a latent
              world model for robot arms, write that the same world model can be used to &quot;evaluate or improve
              any policy&quot;.{' '}
              <Cite id="F03-88">RoboJEPA paper, related work</Cite>
            </li>
            <li>
              <strong>Controlling the robot.</strong> The last thing a model can return is the action itself. A
              world-action model outputs the action together with its prediction. In this design the world model is
              also the policy, and no search is needed. The DreamZero paper, from NVIDIA, gave the design its name in
              February 2026. The two examples described later in this section, DreamZero and GR00T 2, are video
              models. The DreamZero authors also list &quot;learned latent representations&quot; among the things
              such a model could predict.{' '}
              <Cite id="F03-93">DreamZero paper, sections 1 and 2</Cite> The latent models in this section,
              V-JEPA 2-AC, RoboJEPA and LeWorldModel, all choose their actions by search. LeWorldModel is a small
              latent model of about 15M parameters.{' '}
              <Cite id="F03-112">V-JEPA 2 paper, section 3.2</Cite> <Cite id="F03-31">LeWorldModel paper, abstract</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="To estimate the compute cost of generated video, count the tokens that the generator works on and the number of passes it makes over them. Because the number of tokens grows with the number of pixels, resolution is the main setting that controls the cost."
          >
            How a video world model generates frames, and what that costs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The pixel family treats the camera image itself as the state. So the next state is the next few camera
            frames, and the world model is a video generator that is steered by actions. Its output is a video clip
            that a person can watch and a camera-based policy can train on.
          </Box>
          <Box variant="p">
            One 640 x 480 colour frame from the arm&apos;s camera holds 640 x 480 x 3 = 921,600 numbers, and the
            camera delivers 30 frames every second.{' '}
            <Cite id="F01-86">LeRobot source, camera frame settings</Cite> The video generators cited here do not
            predict those numbers one by one. They work in three stages, and the second stage is the one that
            repeats:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Compress.</strong> A VAE (variational autoencoder) is an encoder and a decoder that are trained
              as a pair. The encoder compresses a clip into a much smaller grid of numbers, and the decoder redraws
              the pixels from that grid. Training compares the redrawn clip with the original, so the grid has to
              keep everything that the decoder needs to redraw every pixel. This grid is the pixel family&apos;s
              latent, and it is built to be decoded. Cosmos 3 uses a VAE that compresses video by a factor of 4 in
              time and by a factor of 32 in each spatial direction. The VAE is frozen, which means that its weights do
              not change while the rest of the model trains.{' '}
              <Cite id="F03-96">Cosmos 3 paper, section 3.1</Cite>
            </li>
            <li>
              <strong>Denoise.</strong> A large transformer produces the grid for the future frames. Each position in
              the grid is called a token. A token is one vector that the transformer processes. The future tokens
              start as random noise. The transformer cleans them over a number of passes, steered by the tokens of the
              frames seen so far, by the action sequence and by any text instruction. Section 4, Learning From
              Demonstrations, uses the same denoising to produce a sequence of actions; here it produces video. The
              examples that NVIDIA gives for Cosmos 3 use 35 passes.{' '}
              <Cite id="F03-95">NVIDIA Cosmos models reference, architecture</Cite>
            </li>
            <li>
              <strong>Decode.</strong> The VAE decoder turns the finished grid back into video frames.
            </li>
          </ul>
          <Box variant="p">
            Here is what this means for one second of the arm&apos;s camera video, using the compression ratios that
            Cosmos 3 publishes. Each frame becomes a grid of 640 / 32 by 480 / 32, which is <Derived>20</Derived> by{' '}
            <Derived>15</Derived>, or <Derived>300</Derived> tokens per compressed frame. The 30 frames become 30 / 4,
            or about 8 compressed frames. That gives roughly <Derived>300 x 8</Derived> = <Derived>2,400</Derived>{' '}
            tokens, where the raw second held 30 x 921,600 = <Derived>27.6</Derived> million numbers. With 35 passes,
            the transformer makes <Derived>35 x 2,400</Derived> = <Derived>84,000</Derived> token updates for that one
            predicted second, and each update goes through every layer of the generator. So the cost of generated
            video grows with the number of passes multiplied by the number of tokens.{' '}
            <Cite id="F03-96">Cosmos 3 paper, section 3.1</Cite>{' '}
            <Cite id="F03-95">NVIDIA Cosmos models reference, architecture</Cite>{' '}
            <Cite id="F01-86">LeRobot source, camera frame settings</Cite>
          </Box>
          <Box variant="p">
            The number of tokens grows with the number of pixels, so resolution is the main setting that controls the
            cost. Cosmos3-Nano is the middle size of Cosmos 3, with 16B parameters. NVIDIA lists it at 207.78 s on one
            H100 80GB to generate a 189-frame clip at 720p (1280 x 720 pixels) and 24 frames per second. That clip is 189 /
            24 = <Derived>7.875</Derived> s of video. So generating it takes 207.78 / <Derived>7.875</Derived> ={' '}
            <Derived>26.4</Derived> seconds of compute for each second of video. The same clip at 320 x 192 pixels
            takes 7.61 s.{' '}
            <Cite id="F03-98">NVIDIA Cosmos inference benchmarks, Cosmos3-Nano</Cite>{' '}
            <Cite id="F03-94">NVIDIA Cosmos README, models</Cite>
          </Box>
          <Box variant="p">
            As the three stages show, pixel models in 2026 predict in a compressed space, just as latent models do.
            What puts a model in the pixel family is the kind of latent it predicts. This kind of latent is called a
            reconstruction code. A reconstruction code has to hold enough information to rebuild every pixel. In the
            scene before the push,
            the glint on the cup, the camera noise and the table texture are all part of that code. So the generator
            has to produce them, right or wrong, and it spends its passes and its parameters on them as well as on the
            block. The authors of the first V-JEPA model describe this cost: approaches that predict in pixel space
            &quot;must dedicate significant model capacity and compute to capture all the low-level detail in the
            visual input&quot;.{' '}
            <Cite id="F03-106">V-JEPA paper, section 2</Cite>
          </Box>
          <ExpandableSection headerText="Cosmos 3 in its three sizes, and three other pixel-family models">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Cosmos 3 (NVIDIA).</strong> Cosmos 3 was released at the end of May 2026. It comes in three
                sizes: Super with 64B parameters, Nano with 16B and Edge with 4B. Edge, which is meant for on-device
                use, was released later, in July 2026.{' '}
                <Cite id="F03-94">NVIDIA Cosmos README, models</Cite> NVIDIA&apos;s documentation describes two modes
                that share the same transformer weights. The first mode handles reasoning and produces text. It is
                autoregressive, which means that it produces one token at a time and each token depends on the ones
                before it. The second mode is the
                diffusion transformer from the three stages above, which refines all the tokens of a clip together.{' '}
                <Cite id="F03-95">NVIDIA Cosmos models reference, architecture</Cite>
              </Box>
              <Box variant="p">
                On NVIDIA&apos;s benchmark page, the 189-frame clip that takes Cosmos3-Nano 207.78 s at 720p on the
                H100 takes 114.85 s on a B200.{' '}
                <Cite id="F03-98">NVIDIA Cosmos inference benchmarks, Cosmos3-Nano</Cite> NVIDIA also lists the model
                as an action-conditioned world model, which takes a first frame and an action sequence and returns
                rollout video. In that use, it takes about 2.0 s per rollout on an H100 80GB. The length of that
                rollout is not published.{' '}
                <Cite id="F03-99">NVIDIA Cosmos inference benchmarks, forward dynamics</Cite>
              </Box>
              <Box variant="p">
                <strong>Genie (Google DeepMind).</strong> Genie generates an interactive world from a text prompt, and
                a person or an agent steers that world while it is being drawn. DeepMind describes Genie 3, from August
                2025, as navigable in real time at 24 frames per second at 720p.{' '}
                <Cite id="F03-100">Google DeepMind blog, Genie 3</Cite> Its successor, Genie 4, is limited to around a
                minute of continuous interaction.{' '}
                <Cite id="F03-101">Google DeepMind, Genie model page</Cite>
              </Box>
              <Box variant="p">
                <strong>Dreamer 4 (Google DeepMind).</strong> Dreamer 4 is the model, mentioned above, that trains its policy
                inside its own world model. Its authors report a world model with 2B parameters that runs interactively in real time
                on a single H100, and they train an agent inside it with reinforcement learning. Reinforcement learning
                is learning by trial and error from a score (section 8, Reinforcement Learning for Robots). Their
                headline result is an agent that reaches diamonds in Minecraft from offline data only.{' '}
                <Cite id="F03-90">Dreamer 4 paper, abstract and section 4</Cite>
              </Box>
              <Box variant="p">
                <strong>The 1X World Model.</strong> 1X, a maker of humanoid robots, gets the robot&apos;s actions
                from generated video in two steps. 1X reports that a 14B video model first generates 5 seconds of video
                of the robot doing the task. A second network, called an inverse dynamics model, then works out which
                actions would produce that video. One inference takes 11 seconds on multiple GPUs, and extracting the
                actions takes 1 more second.{' '}
                <Cite id="F03-102">1X post, World Model: self-learning</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A latent world model predicts the next latent with a single pass of a predictor, and its training never compares pixels. This saves a large amount of compute, but the model can lose details that your task depends on."
          >
            How a latent world model predicts, and what it can miss
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The latent family changes what the model predicts. An encoder turns each frame into a latent, as in the
            pixel family. A second network, the predictor, takes the current latent and the action and outputs the
            next latent. Nothing in training asks for the pixels back. Instead, the predictor is scored against the
            encoder&apos;s latent of the frame that really came next. Because nothing has to be redrawn, the encoder
            is free to drop detail that is irrelevant or cannot be predicted.{' '}
            <Cite id="F03-106">V-JEPA paper, section 2</Cite> This design is called a JEPA (Joint-Embedding Predictive
            Architecture). A JEPA predicts the encoder&apos;s summary of the future and never the picture.
          </Box>
          <Box variant="p">
            The V-JEPA 2 authors draw the same line that you drew in the scene before the push. The path of a moving
            object can be predicted, but the exact position of each blade of grass in a field cannot.{' '}
            <Cite id="F03-107">V-JEPA 2 paper, section 1</Cite>
          </Box>
          <AnimatedFigure
            name="two families of world model"
            steps={WM_FAMILY_STEPS}
            intervalMs={3200}
            cites="F03-96 F03-95 F03-106 F03-109 F03-25"
            caption={
              <>
                The same frame and action go into both families. The pixel model has to draw the glint and the table
                texture along with the block, and the latent model can drop them. The figure is an illustration, not a
                measurement. The noise and the latent values are drawn by hand, and no generated or decoded image is
                shown.
              </>
            }
          >
            {(step, reduced) => <WmFamilies step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            In V-JEPA 2-AC, the latent has about as many positions as the pixel family&apos;s grid. Its predictor
            reads each frame as a 16 x 16 grid of vectors, each 1408 numbers wide. That is 256 positions, close to
            the 300 positions worked out above for the arm&apos;s frame in Cosmos 3.{' '}
            <Cite id="F03-15">V-JEPA 2 paper, section 3.1</Cite> Because the number of positions is about the same,
            the saving comes from how often the positions are processed and from how large the network that
            processes them is. In V-JEPA 2-AC, a predictor of about 300M parameters processes them once per predicted
            step. In the Cosmos 3 examples, a transformer with billions of parameters processes its tokens
            35 times.{' '}
            <Cite id="F03-14">V-JEPA 2 paper, section 3.1</Cite>{' '}
            <Cite id="F03-95">NVIDIA Cosmos models reference, architecture</Cite> A small model can also shrink the
            latent itself. LeWorldModel keeps one vector of width 192 per frame.{' '}
            <Cite id="F03-32">LeWorldModel paper, encoder</Cite>
          </Box>
          <Box variant="p">
            To see which errors the predictor is penalised for, and which it is not, look at its training loss. V-JEPA 2-AC is
            trained by stepping through a recorded video clip of a robot arm. At each frame, the predictor is given
            what really happened up to that frame, and it guesses the latent of the next frame. Starting every guess
            from the true history, and never from the model&apos;s own earlier guesses, is called teacher forcing.
          </Box>
          <Box variant="p">
            The loss uses the following symbols. <M>x_k</M> is frame <M>k</M> of the clip. <M>E</M> is the encoder,
            whose weights are frozen here, and <M>{String.raw`z_k = E(x_k)`}</M> is the latent of that frame.{' '}
            <M>a_k</M> is the action taken between frames <M>k</M> and <M>k+1</M>. The latent <M>z_k</M> is the scene
            as the model holds it, which is the state that <M>f</M> takes as input. The paper also feeds in{' '}
            <M>s_k</M> alongside the latent. <M>s_k</M> is a measurement: the pose of the gripper at frame <M>k</M>.
          </Box>
          <Box variant="p">
            <M>{String.raw`P_\phi`}</M> is the predictor, and <M>{String.raw`\phi`}</M> stands for its weights. The
            predictor&apos;s guess for the next latent is{' '}
            <M>{String.raw`\hat{z}_{k+1} = P_\phi\big((a_t, s_t, z_t)_{t \le k}\big)`}</M>. It is computed from the
            actions, poses and latents up to frame <M>k</M>. <M>T</M> is the number of guesses per clip, which is 15
            for a clip of 16 frames. The double bars with a subscript 1 are the L1 distance. To compute it, subtract
            the two latents number by number, drop the signs and add up the results.
          </Box>
          <Formula
            name="Next-latent prediction loss of V-JEPA 2-AC (teacher forcing)"
            tex={String.raw`\begin{aligned} & \mathcal{L}_{\text{teacher-forcing}}(\phi) \coloneqq \\ & \qquad \frac{1}{T}\sum_{k=1}^{T} \lVert \hat{z}_{k+1} - z_{k+1} \rVert_1 \end{aligned}`}
            source={<Cite id="F11-100">V-JEPA 2 paper, section 3.1, equation 2</Cite>}
          />
          <ul style={LIST}>
            <li>
              <M>{String.raw`\hat{z}_{k+1}`}</M> is the model&apos;s prediction of the next latent, and{' '}
              <M>{String.raw`z_{k+1}`}</M> is the latent of the frame that really came next.
            </li>
            <li>
              The bars measure the error between the two latents. No pixel is redrawn, so a wrong glint on the cup
              costs nothing, unless the encoder kept the glint in the latent.
            </li>
            <li>
              The sum and the <M>{String.raw`1/T`}</M> average the error over the 15 guesses, one for each frame after
              the first.
            </li>
            <li>
              The <M>{String.raw`(\phi)`}</M> shows which weights this loss trains: only the predictor&apos;s. The
              encoder stays frozen.
            </li>
          </ul>
          <Box variant="p">
            In a rollout, each step starts from the model&apos;s own earlier guesses, and teacher forcing never trains
            it on that situation. So V-JEPA 2-AC adds a second term to the loss that scores a short rollout.{' '}
            <Cite id="F11-102">V-JEPA 2 paper, section 3.1, equations 3 and 4</Cite>
          </Box>
          <Box variant="p">
            The encoder sets what the latent keeps, and the encoder is trained before this loss is used. V-JEPA 2 is
            trained in two stages. First, an
            encoder is pretrained on over 1 million hours of internet video that has no actions. Then the predictor is
            trained on under 62 hours of robot video, with that encoder frozen.{' '}
            <Cite id="F03-1">V-JEPA 2 paper, abstract</Cite> In the first stage, part of each video is masked. The
            network predicts the latent of the masked part from the visible part, and the loss is measured between
            latents. This stage is where the encoder learns to keep the path of a moving object and to drop the
            blade of grass.{' '}
            <Cite id="F03-2">V-JEPA 2 paper, section 2.1, equation 1</Cite>
          </Box>
          <Box variant="p">
            The first stage can fail in a known way. In this stage the encoder and the predictor are trained
            together, and the target is itself an encoding. So the loss can be driven to zero by giving every input the same vector, because the
            prediction and the target then always agree. The paper calls this failure representation collapse. To
            prevent it, the paper computes the target with a slowly updated copy of the encoder, which the loss is
            not allowed to change. Section 7, JEPA, compares the ways to prevent collapse.{' '}
            <Cite id="F03-2">V-JEPA 2 paper, section 2.1, equation 1</Cite>
          </Box>
          <Box variant="p">Leaving detail out saves compute, but it also creates three limits:</Box>
          <ul style={LIST}>
            <li>
              <strong>There is nothing to watch.</strong> The prediction is a set of vectors, and you cannot look at it
              directly. To see what the model predicts, the V-JEPA 2 and LeWorldModel authors each train a separate
              decoder afterwards and use it only for inspection.{' '}
              <Cite id="F03-109">V-JEPA 2 paper, appendix B.3</Cite>
            </li>
            <li>
              <strong>Detail that the encoder dropped is lost.</strong> The predictor can only predict what the latent
              holds. The LeWorldModel authors show a decoded rollout that keeps the overall scene but does not fully
              preserve the angle of the gripper, and a grasp depends on that angle.{' '}
              <Cite id="F03-109">LeWorldModel paper, section 5.1</Cite> The V-JEPA 2 authors write that their planner
              &quot;fundamentally depend[s]&quot; on what its latent space captured.{' '}
              <Cite id="F03-111">V-JEPA 2 paper, section 1</Cite>
            </li>
            <li>
              <strong>The model predicts a single future.</strong> A predictor that is trained to minimise its average
              error outputs one future: the average of the plausible futures. Where the world can really go two ways,
              that average may match neither of them. The authors of JEPA-WMs, a study of latent world models, name
              this as a limit of the family.{' '}
              <Cite id="F03-110">JEPA-WMs paper, section 7</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The number of predictions behind each decision is the product of three planner settings: the number of candidates, the number of rounds and the horizon. You can estimate the cost of a search from these settings, see why one step ahead was enough in the V-JEPA 2 tests, and see which changes could make the search shorter."
          >
            Planning by search: how candidates, rounds and horizon set the cost
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            You control the size of a search with three settings: the number of candidates, the number of rounds and
            the horizon. The horizon is how many actions ahead each candidate looks. On their own robot arms, the
            V-JEPA 2 authors sampled 800 candidates, kept the best ones, sampled again around those, and repeated this
            for 10 rounds. They used a horizon of 1, so each candidate looks one action ahead. That is 800 x 10 x 1 =
            8,000 calls to the predictor for every action the arm takes. These are the 8,000 predicted futures behind
            the 16 seconds per action in the comparison above.{' '}
            <Cite id="F03-24">V-JEPA 2 paper, section 4.2</Cite>{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>{' '}
            <Cite id="F03-115">V-JEPA 2 paper, planner settings</Cite>
          </Box>
          <Box variant="p">
            More candidates or more rounds make the search more thorough, and they multiply the cost. A longer horizon
            multiplies the cost again, and it runs into two limits that the authors name. Prediction error builds up
            along the rollout, and the number of possible action sequences grows exponentially with the horizon.{' '}
            <Cite id="F03-28">V-JEPA 2 paper, limitations</Cite> The authors found that one step ahead was enough,
            because their tasks were, in their words, &quot;relatively greedy&quot;: the move that looks best now is
            also the right one.{' '}
            <Cite id="F03-24">V-JEPA 2 paper, appendix B.2</Cite>
          </Box>
          <Box variant="p">
            Measured against the arm&apos;s clock, even this search is slow. The 16 s it takes to choose one action
            is <Derived>16 x 30</Derived> = <Derived>480</Derived> control periods of the arm.{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite> So a search only suits decisions that the
            arm can wait for. Apart from smaller settings and more hardware, the authors name two changes of method
            that could shorten the search in future work. The first is gradient-based planning. It computes, through
            the predictor, which way to change the candidate actions, while a search only samples candidates and
            compares them. The second is
            a policy that answers in a single pass and is trained inside the world model, so that the search starts
            near a good answer.{' '}
            <Cite id="F03-116">V-JEPA 2 paper, section 4.2</Cite>
          </Box>
          <Box variant="p">
            Other published times were measured with different hardware, resolution, horizon and batch size, so use
            the chart below for orders of magnitude only. Among the five times in the chart, every pixel-family time
            is 300 ms or more per candidate, and every latent-family time is 2 ms or less.
          </Box>
          <Figure
            cites="F03-118 F03-99 F03-25 F03-74 F03-41"
            caption={
              <>
                Each bar is the time to predict one candidate, with the GPU it ran on. The top bar is the time that
                NVIDIA lists. For the other bars, we divided a planning time that the authors published by the number
                of candidates, or, for the last bar, by the number of candidate steps. The faint end of the last bar
                shows a range. The axis is logarithmic, so each gridline is ten times the one to its left (µs means
                microsecond, a millionth of a second). Only the bracketed pair shares a GPU and a planner.
              </>
            }
          >
            <CandidateChart />
          </Figure>
          <ul style={LIST}>
            <li>
              <strong>A current pixel model.</strong> NVIDIA lists Cosmos3-Nano at about 2.0 s per action-conditioned
              rollout on one H100 80GB, and the rollout length is not published. If 8,000 such rollouts run one at
              a time, they take about 16,000 GPU-seconds, or 4.4 GPU-hours, for a single action. No figure is
              published for batched rollouts.{' '}
              <Cite id="F03-99">NVIDIA Cosmos inference benchmarks, forward dynamics</Cite>
            </li>
            <li>
              <strong>The same latent planner on another GPU.</strong> A later paper from the same lab reports 3
              seconds per action on a single A100 with the same planner settings, which is 0.375 ms per candidate.
              Neither paper explains the difference from the 2 ms on the RTX 4090. So when you quote a time per
              candidate, always give its GPU and its paper with it.{' '}
              <Cite id="F03-74">V-JEPA 2.1 paper, Table 6</Cite> <Cite id="F03-118">calculation, time per candidate</Cite>
            </li>
            <li>
              <strong>A small latent model.</strong> The LeWorldModel authors report a full plan in 0.98 s, without
              saying which of their two planner settings they timed. One setting uses 45,000 candidate steps and the
              other 15,000. So, depending on the setting, one step of one candidate takes between 22 and 65
              microseconds.{' '}
              <Cite id="F03-41">LeWorldModel paper, Figure 3</Cite> <Cite id="F03-118">calculation, time per candidate</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A world-action model outputs the action together with its predicted video, so a robot needs only one call per decision. In DreamZero and GR00T 2 that call still generates video, and GR00T 2 makes it faster by cutting both the parameter count and the number of denoising passes."
          >
            World-action models: one call per decision
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A search calls the world model thousands of times for each decision. A world-action model is called once
            per decision. It is trained to denoise the future video and the matching actions together, and the
            actions are read from its output. The actions come out as an action chunk. An action chunk is a sequence
            of future actions returned by one call. A chunk lets a model whose call takes longer than one control
            period still control an arm (section 4, Learning From Demonstrations).
          </Box>
          <Box variant="p">
            From the outside, a world-action model does the same job as a VLA (vision-language-action model). A VLA is
            the type of policy that section 5, Vision-Language-Action Models, covers: it maps camera images and an
            instruction to actions. Inside the two models described below, each call still denoises video. So the
            cost of one call is again the pixel family&apos;s product of passes and tokens, and every pass runs
            through all of the model&apos;s parameters. DreamZero and the later GR00T 2 show how far that cost has
            been cut.
          </Box>
          <Box variant="p">
            <strong>DreamZero</strong> is a model with 14B parameters. Its authors report about 5.7 seconds per
            action chunk on one GPU before optimisation. With their optimisations, it reaches closed-loop control at 7
            Hz on two GB200 GPUs. The authors give two reasons why it is still expensive compared with a VLA: the
            parameter count and &quot;the iterative denoising nature of video&quot;.{' '}
            <Cite id="F03-103">DreamZero paper, abstract and sections 3.2 and 6</Cite>
          </Box>
          <Box variant="p">
            <strong>GR00T 2</strong> cuts both the parameter count and the number of passes. Its figures come from an
            NVIDIA whitepaper dated November 2026. NVIDIA announced the code for December 2026, and as of November
            2026 it had not been released.
          </Box>
          <Box variant="p">
            The whitepaper describes a single transformer with 2B parameters. It is built on Cosmos-Predict2.5-2B, a
            video generator from the generation before Cosmos 3. A frozen VAE compresses each camera stream by a
            factor of 4 in time and by a factor of 8 in each spatial direction. The result is then split into
            patches. A patch is a small
            block of neighbouring grid positions that becomes one token. At 224 x 320 pixels, this gives 280 tokens
            per compressed frame for each camera. The robot that GR00T 2 was timed on has three camera views. If each
            view is fed at that size, that is <Derived>3 x 280</Derived> = <Derived>840</Derived> tokens per
            compressed frame.{' '}
            <Cite id="F03-104">NVIDIA GR00T 2 whitepaper, section 2</Cite>
          </Box>
          <Box variant="p">
            The biggest cut is in the number of denoising passes. NVIDIA writes that at inference &quot;a few
            denoising steps suffice: one or two for video and two to four for actions&quot;. The Cosmos 3 examples
            use 35 passes. On an RTX 5090, NVIDIA reports a median of 153 ms to predict an action chunk for a robot
            called Dexter, from three camera views. That time includes NVIDIA&apos;s inference optimisations, and
            without them it was 449 ms. On a second robot setup, the YAM arms, the figure is 180 ms.{' '}
            <Cite id="F03-104">NVIDIA GR00T 2 whitepaper, section 2</Cite>{' '}
            <Cite id="F03-95">NVIDIA Cosmos models reference, architecture</Cite>
          </Box>
          <Box variant="p">
            Both models are from NVIDIA and were published nine months apart. DreamZero, from February, is a 14B model
            that ran on two data-centre GPUs. GR00T 2, from November, is a 2B model that runs on one workstation GPU.
            Each was timed on its own robots, so the two times are not a like-for-like comparison. Neither model
            returns an answer within one control period. GR00T 2&apos;s 153
            ms is 153 / <Derived>33.3</Derived> = <Derived>4.6</Derived> control periods, so its action chunk has to
            cover that time, as for any policy that is slower than the clock (section 17, Running on the Robot).{' '}
            <Cite id="F03-103">DreamZero paper, abstract and section 3.2</Cite>{' '}
            <Cite id="F03-104">NVIDIA GR00T 2 whitepaper, section 2</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="For a video generator, size the GPU from the minimum memory the model needs. For a latent planner, estimate the time per decision from one timed round of candidates. Then choose the kind of model from what the job needs back."
          >
            Sizing the GPU and choosing the kind of model
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            You size the GPU differently for the two families. A pixel generator such as Cosmos 3 runs a transformer
            with billions of parameters tens of times per clip, so the first thing to check is whether the model fits
            in GPU memory. A latent planner runs its predictor in rounds, ten batches of 800 candidates per action at
            the V-JEPA 2 settings, so the first thing to measure is how long one round takes.{' '}
            <Cite id="F03-24">V-JEPA 2 paper, section 4.2</Cite>
          </Box>
          <Box variant="p">
            NVIDIA publishes memory figures for Cosmos 3. NIM (NVIDIA Inference Microservice) is the
            packaged container that NVIDIA ships for serving a model. The support matrix of the NIM for Cosmos prints a
            minimum GPU memory per device for each Cosmos 3 configuration. In the NIM figures, full precision means
            BF16 (bfloat16). BF16 is a 16-bit number format that takes 2 bytes per weight. For Cosmos3-Nano at full
            precision, with the whole
            model held on the GPU, the minimum for generation is 58 GiB. If the weights are offloaded layer by
            layer to host memory, the minimum drops to 31 GiB, and the host then needs at least 64 GiB of its own
            memory. The container checks these minimums before it starts. They are not measured peaks, and the page
            gives no resolution or frame count for them.{' '}
            <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite> We found no first-party memory figure for
            the latent planners or for GR00T 2, so measure the memory when you time a round.
          </Box>
          <ExpandableSection headerText="More on Cosmos 3 memory: other configurations, the weights alone and one measured peak">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Minimums for other NIM configurations.</strong> FP8 (8-bit floating point) is a number format
                that takes 1 byte per weight. Cosmos3-Nano in FP8 needs at least 44 GiB with the whole model on the
                GPU. Cosmos3-Super needs
                at least 150 GiB per device in BF16 and 93 GiB in FP8. The page says to treat these figures as
                minimums, because concurrent requests and other workloads on the host can need more.{' '}
                <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>
              </Box>
              <Box variant="p">
                <strong>The open-source framework&apos;s FAQ.</strong> NVIDIA&apos;s open-source cosmos-framework has a
                FAQ that answers &quot;How much GPU memory do the models need?&quot; with 32 GB for Cosmos3-Nano and
                128 GB for Cosmos3-Super. It gives no resolution, precision or workload. Both numbers match the size of
                the weights alone: 16B parameters x 2 bytes = 32 GB, and 64B x 2 bytes = 128 GB. So we take them to be
                the memory for the weights, and the model needs working memory on top of that.{' '}
                <Cite id="F03-123">NVIDIA cosmos-framework FAQ, inference</Cite>
              </Box>
              <Box variant="p">
                <strong>One measured peak.</strong> Notes written for coding agents in the same NVIDIA repository
                record Cosmos3-Nano peaking at 33.8 GiB of allocated memory on one H100 80 GB while it generated a
                single 1280 x 720 image, which is one frame. The notes give no PyTorch peak for a full 189-frame
                video, and none for an action-conditioned rollout. When the model is served through TensorRT-LLM, the
                notes record between 50,623 and 52,147 MiB after a 189-frame warm-up.{' '}
                <Cite id="F03-124">NVIDIA cosmos-framework, agent skill notes</Cite>
              </Box>
              <Box variant="p">
                <strong>Running on a 12 GB GPU.</strong> NVIDIA ships an adapter that keeps Cosmos3-Nano&apos;s weights in host
                memory and streams them to the GPU as they are needed. With the FP8 checkpoint, the adapter completed
                all 21 of its test cases on an RTX 5070, a GPU with 12 GB of memory, on a host with 128 GB of system
                memory. It is for inference only, and it trades GPU memory for transfer time.{' '}
                <Cite id="F03-125">NVIDIA cosmos-framework, CPU offloading README</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            The two families differ most in the machines they need for training. NVIDIA reports pretraining
            Cosmos3-Nano on 1,024 GB200 GPUs, in a single job whose nodes work together.{' '}
            <Cite id="F03-97">Cosmos 3 paper, section 4.1</Cite> Among the workload types of section 1, Fifteen
            Computing Jobs Behind One Robot Arm, that job is Multi-node training. The LeWorldModel authors state that
            their model of about 15M parameters trains on a single GPU in a few hours, without naming the GPU.{' '}
            <Cite id="F03-31">LeWorldModel paper, abstract</Cite> That job is a Long single-machine run.
          </Box>
          <ExpandableSection headerText="Parameter counts of the models in this section">
            <SpaceBetween size="s">
              <Box variant="p">
                Parameter count alone does not separate the two families. RoboJEPA&apos;s largest predictor has 8B
                parameters on a 2B encoder, and two of the pixel models have 2B.{' '}
                <Cite id="F03-117">analysis of the parameter counts</Cite>
              </Box>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560 }}>
                  <thead>
                    <tr>
                      <th style={TH}>Model</th>
                      <th style={TH}>What it predicts</th>
                      <th style={TH}>Parameters, as published</th>
                      <th style={TH}>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={TD}>Cosmos3-Nano</td>
                      <td style={TD}>Video</td>
                      <td style={TD}>16B</td>
                      <td style={TD}>
                        <Cite id="F03-94">NVIDIA Cosmos README, models</Cite>
                      </td>
                    </tr>
                    <tr>
                      <td style={TD}>DreamZero</td>
                      <td style={TD}>Video and actions</td>
                      <td style={TD}>14B</td>
                      <td style={TD}>
                        <Cite id="F03-103">DreamZero paper, abstract</Cite>
                      </td>
                    </tr>
                    <tr>
                      <td style={TD}>1X World Model</td>
                      <td style={TD}>Video, then actions from a second network</td>
                      <td style={TD}>14B backbone</td>
                      <td style={TD}>
                        <Cite id="F03-102">1X post, World Model: self-learning</Cite>
                      </td>
                    </tr>
                    <tr>
                      <td style={TD}>GR00T 2 (whitepaper, code not yet released)</td>
                      <td style={TD}>Video and actions</td>
                      <td style={TD}>2B</td>
                      <td style={TD}>
                        <Cite id="F03-104">NVIDIA GR00T 2 whitepaper, section 2</Cite>
                      </td>
                    </tr>
                    <tr>
                      <td style={TD}>Dreamer 4</td>
                      <td style={TD}>Video frames</td>
                      <td style={TD}>2B</td>
                      <td style={TD}>
                        <Cite id="F03-90">Dreamer 4 paper, section 4</Cite>
                      </td>
                    </tr>
                    <tr>
                      <td style={TD}>V-JEPA 2-AC</td>
                      <td style={TD}>Latents</td>
                      <td style={TD}>About 1B frozen encoder plus about 300M predictor</td>
                      <td style={TD}>
                        <Cite id="F03-4">V-JEPA 2 paper, encoder sizes</Cite>{' '}
                        <Cite id="F03-14">V-JEPA 2 paper, section 3.1</Cite>
                      </td>
                    </tr>
                    <tr>
                      <td style={TD}>RoboJEPA</td>
                      <td style={TD}>Latents</td>
                      <td style={TD}>22M to 8B predictor on a 2B frozen encoder</td>
                      <td style={TD}>
                        <Cite id="F03-75">RoboJEPA paper</Cite> <Cite id="F03-72">V-JEPA 2.1 paper, encoders</Cite>
                      </td>
                    </tr>
                    <tr>
                      <td style={TD}>LeWorldModel</td>
                      <td style={TD}>Latents</td>
                      <td style={TD}>About 15M in total</td>
                      <td style={TD}>
                        <Cite id="F03-31">LeWorldModel paper, abstract</Cite>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">To choose the kind of model, start from what the job needs back from it:</Box>
          <ul style={LIST}>
            <li>
              <strong>Frames to watch or to train on.</strong> Use the pixel family. Based on NVIDIA&apos;s figures
              for Cosmos3-Nano, budget <Derived>26.4</Derived> seconds of H100 compute per second of 720p video. Also
              plan for a GPU with at least 58 GiB of memory, or at least 31 GiB if you offload the weights to a host
              with at least 64 GiB. The time comes from the native PyTorch row of NVIDIA&apos;s benchmark, and the
              memory minimums come from its NIM container. To lower the cost, reduce the resolution first: the same
              clip at 320 x 192 took 7.61 s.{' '}
              <Cite id="F03-98">NVIDIA Cosmos inference benchmarks, Cosmos3-Nano</Cite>{' '}
              <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>
            </li>
            <li>
              <strong>A decision found by search.</strong> Use the latent family. Time one round of candidates on your
              GPU, and multiply by the number of rounds and the horizon. For example, the 16 seconds on an RTX 4090 are
              10 rounds of about <Derived>1.6</Derived> s. To check that the latent keeps what your task needs,
              repeat the LeWorldModel authors&apos; test: train a small decoder, decode a rollout, and look for the
              detail that your task depends on, such as the angle of the gripper.{' '}
              <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>{' '}
              <Cite id="F03-109">LeWorldModel paper, section 5.1</Cite>
            </li>
            <li>
              <strong>An action several times a second.</strong> A search with either family takes longer than a
              control period, so use a model that outputs actions directly. As of November 2026, that means a VLA such as GR00T N1.7, the newest GR00T
              model with released weights and code. It can also be one of the world-action models that LeRobot v0.7.0
              packages, if it is fast enough when you time it on your own computer. Section 5, Vision-Language-Action
              Models, lists both. Of the two world-action models described above, DreamZero needed two GB200 GPUs to
              reach 7 Hz, and GR00T 2 has no released code yet.{' '}
              <Cite id="F02-37">Isaac-GR00T N1.7 release</Cite>{' '}
              <Cite id="F02-102">LeRobot v0.7.0 policies directory</Cite>{' '}
              <Cite id="F03-103">DreamZero paper, abstract and section 3.2</Cite>{' '}
              <Cite id="F03-104">NVIDIA GR00T 2 whitepaper, section 2</Cite>
            </li>
          </ul>
          <Box variant="p">
            For the {ARM} on your bench, the latent family is the one you can train from scratch and inspect on a
            single GPU (section 7, JEPA). The first thing to measure is your own time per predicted future, because
            that time tells you how many candidates, rounds and horizon steps you can afford. On the V-JEPA 2 authors&apos; RTX 4090,
            it was 2 ms.{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>{' '}
            <Cite id="F03-115">V-JEPA 2 paper, planner settings</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
