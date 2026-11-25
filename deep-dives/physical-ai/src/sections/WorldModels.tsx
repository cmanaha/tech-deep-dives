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
        <title id="world-models-candidate-title">Published time to imagine one candidate future, by model and GPU, on a log axis</title>
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
          time per imagined candidate (log scale)
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
            description="Tell which kind of world model a job needs from what the job must get back, frames or a decision, and price one imagined future in each kind (sources read 2026-11-20)."
          >
            6. World Models: Predict Pixels or Predict a Summary
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A world model predicts what a robot&apos;s cameras will show after it acts, and what it is asked to
            predict sets the price of every prediction. Both kinds first compress the frame into a smaller set of
            numbers, called a latent. The pixel family predicts a latent that must still be able to redraw every
            pixel, and produces it by running a transformer of billions of parameters tens of times. The latent
            family predicts a latent that is never redrawn, a summary of the frame, in one pass of a predictor.
          </Box>
          <Box variant="p">
            That price sorts the work. In 2026 pixel models generate training video and drive robots directly,
            and latent models plan by search, in our reading of the models cited here. The sorting is firm at
            those ends, because generation needs few predicted futures and search needs thousands for one
            decision. It is loose in between, where both families are used to train and to score policies.
          </Box>
          <Box variant="p">
            One published comparison prices the difference on equal hardware. The authors of V-JEPA 2-AC, a latent
            model from Meta, planned single actions for a robot arm by search: try candidate actions inside a
            model, keep the best. Their own model took 16 seconds per action on one RTX 4090. On the same card a
            video model took 4 minutes, with one tenth as many candidates in each round. It was Cosmos 1, a 2025
            model with 7B parameters, which they fine-tuned for the test, so the comparison was run by the authors
            of the faster model.{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>{' '}
            <Cite id="F03-118">our arithmetic, time per candidate</Cite>
          </Box>
          <Box variant="p">
            Divide each time by the futures it bought. The latent search imagined 800 candidates in each of 10
            rounds: 8,000 futures in 16 s, 2 ms each. The video search imagined 80 x 10 = 800 in 240 s, 300 ms each,
            which is 150 times the price per imagined future.{' '}
            <Cite id="F03-24">V-JEPA 2 paper, section 4.2</Cite>{' '}
            <Cite id="F03-118">our arithmetic, time per candidate</Cite>
          </Box>
          <Box variant="p">
            So ask two things of any job you would give a world model: how many futures it needs, and whether
            anything reads their pixels. Generating training video needs the pixels and few futures. Planning needs
            thousands of futures and one score from each. Driving the arm on its 30 Hz clock (a new action every{' '}
            <Derived>33.3</Derived> ms, section 3, The Robot as a Computer) leaves time for neither search, and
            that is where a third design comes from: a model that outputs the action along with its prediction.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="What you can predict about the next frame, what you cannot, and why a frame generator has to produce both">
            One tick before the push: bet on the block, decline to bet on the glint
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The {ARM}, a small desktop arm, has to {TASK_STORY}. Freeze it one tick before contact: the gripper is closed and sits just to
            the left of the block, and the next action swings it a little to the right. Before the servos move, you
            know roughly what the top camera will show a moment later: the block will have slid toward the cup, the
            cup will be where it was, and the table will look the same.
          </Box>
          <Box variant="p">
            You also know what you cannot predict: the exact glint on the rim of the cup, the grain of the camera
            noise, whether the block ends up turned by a few degrees. You would bet on where the block goes and
            decline to bet on the glint. A pixel model has to paint the glint anyway, because the glint is in the frame. A latent model may leave
            it out. The price per imagined future follows from that one difference.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Why the bill for any use of a world model is the number of calls times the price of one">
            State and action in, next state out
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The policy that drives the arm (the trained model that maps an observation to an action, section 3) says
            what to do and holds no answer to what happens afterwards. A world model is the network trained to
            answer that: from what has been observed so far and the actions taken, it predicts the future state of
            the world. For the arm, given what the camera shows now and the action &quot;swing the gripper
            right&quot;, it predicts what the camera will show next.{' '}
            <Cite id="F03-87">JEPA-WMs paper, section 1</Cite>
          </Box>
          <Box variant="p">
            An action is six joint targets for one tick. A state is the model&apos;s description of the scene at one
            instant: whatever it has to keep in order to predict the next instant, block and cup included. (Section 3
            uses the word more narrowly, for <code>observation.state</code>, the six measured joint angles.) With
            those two words the prediction is one function:
          </Box>
          <Formula name="A world model as a function" tex={String.raw`\text{next state} = f(\text{state},\ \text{action})`} />
          <Box variant="p">
            <M>f</M> is the trained network, and its output has the same form as its state input.
          </Box>
          <Box variant="p">
            That sameness is what makes the function reusable: the model can be fed its own prediction with a
            second action, then a third. The chain is a rollout, an imagined future for one particular sequence of actions,
            and an action sequence being tried this way is a candidate. Nothing moves on the table during a rollout.
            Each step builds on the output of the step before, so prediction errors compound, and the V-JEPA 2
            authors name long rollouts as a limit of their model for that reason.{' '}
            <Cite id="F03-28">V-JEPA 2 paper, limitations</Cite>
          </Box>
          <Box variant="p">
            Every use of a world model is this function called many times, so every use has the same bill: the
            number of rollout steps it needs, times the price of one step. The use sets the first factor. What the
            model is asked to predict sets the second.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Planning wants a score, data generation wants frames, a policy under test wants its next input, and a robot wants an action">
            What has to leave the model: a score, frames, a policy&apos;s input or an action
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Planning needs a single number per candidate: how far the imagined future lands from the goal.
            V-JEPA 2-AC measures that distance between two latents, the predicted one and the latent of a picture
            of the goal. No frame is drawn at any point, which is what lets one decision score thousands of
            candidates.{' '}
            <Cite id="F03-23">V-JEPA 2 paper, section 3.2, equation 5</Cite>
          </Box>
          <Box variant="p">
            Generating training data needs the frames themselves (section 11, Augmentation and Synthetic Data). The
            product is video for a camera-based policy to train on, and each clip is generated once. A latent model
            has no frames to hand over unless a decoder is trained separately for it.{' '}
            <Cite id="F03-109">V-JEPA 2 paper, appendix B.3</Cite>
          </Box>
          <Box variant="p">
            Improving a policy inside the model, and scoring one without a robot (section 16, Evaluation), feed the
            prediction back to a policy in closed loop: each action changes what the policy sees next, so the model
            has to produce whatever that policy reads, once per step of practice or test. Neither family owns
            these two. Dreamer 4, from Google DeepMind, trains its policy inside a model that generates frames, and
            its main result is in a video game.{' '}
            <Cite id="F03-90">Dreamer 4 paper, abstract and section 4</Cite> NVIDIA lists a checkpoint of Cosmos 3,
            its video model, for closed-loop robot policy simulation.{' '}
            <Cite id="F03-92">NVIDIA Cosmos README, example checkpoints</Cite> The authors of RoboJEPA, a latent
            world model for robot arms, write that the same world model can be used to &quot;evaluate or improve any
            policy&quot;.{' '}
            <Cite id="F03-88">RoboJEPA paper, related work</Cite>
          </Box>
          <Box variant="p">
            The last thing that can come back is the action itself. A world-action model outputs the action
            together with its prediction, so the world model is the policy and nothing is searched. The DreamZero
            paper, from NVIDIA, gave the design its name in February 2026. The two examples so far are video
            models, and the DreamZero authors list &quot;learned latent representations&quot; among the things such
            a model could predict.{' '}
            <Cite id="F03-93">DreamZero paper, sections 1 and 2</Cite> The latent models named here do not act
            this way: V-JEPA 2-AC, RoboJEPA and LeWorldModel, a small latent model of about 15M parameters, all
            choose their actions by search.{' '}
            <Cite id="F03-112">V-JEPA 2 paper, section 3.2</Cite> <Cite id="F03-31">LeWorldModel paper, abstract</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Count the tokens in one second of the arm&apos;s video and the passes a generator makes over them, and see why resolution is the setting that moves the bill">
            Predicting frames costs passes times tokens
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The pixel family takes the question literally. The state is what the camera shows, so the next state is
            the next camera frames, and the world model is a video generator steered by actions. What comes back is
            a clip that a person can watch and a camera-based policy can train on.
          </Box>
          <Box variant="p">
            One 640x480 colour frame from the arm&apos;s camera is 640 x 480 x 3 = 921,600 numbers, and the camera
            delivers 30 of them every second.{' '}
            <Cite id="F01-86">our arithmetic on the camera settings</Cite> No generator predicts those numbers one
            by one. It works in three stages, and the second is the one that repeats.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Compress.</strong> A VAE (variational autoencoder) is an encoder and a decoder trained as a
              pair. The encoder squeezes a clip into a much smaller grid of numbers, the decoder redraws the pixels
              from that grid, and training compares the redrawn clip with the original. The grid therefore has to
              keep whatever the decoder needs to redraw every pixel. This grid is the pixel family&apos;s latent, built to be decoded. Cosmos 3, NVIDIA&apos;s video world model, uses a VAE that shrinks video 4 times in time and 32
              by 32 in space and keeps it frozen: its weights do not change while the rest of the model trains.{' '}
              <Cite id="F03-96">Cosmos 3 paper, section 3.1</Cite>
            </li>
            <li>
              <strong>Denoise.</strong> A large transformer produces the grid for the future frames. Each position
              in the grid is one token, one vector the transformer processes. The future tokens start as random
              noise, and the transformer cleans them over a number of passes, steered by the tokens of the frames
              seen so far, by the action sequence and by any text instruction. It is the denoising that section 4,
              Learning From Demonstrations, applies to a run of actions, applied here to video. The Cosmos 3 model
              card&apos;s examples use 35 passes.{' '}
              <Cite id="F03-95">NVIDIA Cosmos models reference, architecture</Cite>
            </li>
            <li>
              <strong>Decode.</strong> The VAE decoder turns the finished grid back into frames.
            </li>
          </ul>
          <Box variant="p">
            Put one second of the arm&apos;s camera through those stages on paper, with Cosmos 3&apos;s published
            ratios. 640 / 32 by 480 / 32 is a grid of{' '}
            <Derived>20</Derived> by <Derived>15</Derived>, <Derived>300</Derived> tokens per compressed frame, and
            30 frames / 4 is about 8 compressed frames: roughly <Derived>300 x 8</Derived> ={' '}
            <Derived>2,400</Derived> tokens where the raw second was 30 x 921,600 = <Derived>27.6</Derived> million
            numbers. At the model card&apos;s 35 passes the transformer makes <Derived>35 x 2,400</Derived> ={' '}
            <Derived>84,000</Derived> token updates for that one imagined second, each one a trip through every
            layer of the generator. The bill is that product, passes times tokens.{' '}
            <Cite id="F03-96">Cosmos 3 paper, section 3.1</Cite>{' '}
            <Cite id="F03-95">NVIDIA Cosmos models reference, architecture</Cite>{' '}
            <Cite id="F01-86">our arithmetic on the camera settings</Cite>
          </Box>
          <Box variant="p">
            Tokens follow pixels, so resolution is the setting that moves the bill. NVIDIA lists Cosmos3-Nano, the
            16B-parameter middle size of Cosmos 3, at 207.78 s on one H100 80GB to generate a 189-frame clip at 720p
            (1280 x 720 pixels) and 24 frames per second. That is 7.875 s of video, or 26.4 seconds of compute for
            each second of it. The same clip at 320 x 192 pixels takes 7.61 s.{' '}
            <Cite id="F03-98">NVIDIA Cosmos inference benchmarks, Cosmos3-Nano</Cite>{' '}
            <Cite id="F03-94">NVIDIA Cosmos README, models</Cite>
          </Box>
          <Box variant="p">
            A pixel model in 2026 also predicts in a compressed space. What makes it a pixel model is the
            kind of code: a reconstruction code, one that has to hold enough to rebuild every pixel. At the bench,
            the glint on the cup, the camera noise and the table texture are all in that code, so the generator
            must produce them, right or wrong, and its passes and its parameters are spent on them along with the
            block. The authors of the first V-JEPA model state the cost: approaches that predict in pixel
            space &quot;must dedicate significant model capacity and compute to capture all the low-level detail in
            the visual input&quot;.{' '}
            <Cite id="F03-106">V-JEPA paper, section 2</Cite>
          </Box>
          <ExpandableSection headerText="Cosmos 3 in its three sizes, and three other pixel-family models">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Cosmos 3 (NVIDIA).</strong> Released at the end of May 2026 in three sizes: Super with 64B
                parameters, Nano with 16B and Edge with 4B, the last released in July 2026 for on-device use.{' '}
                <Cite id="F03-94">NVIDIA Cosmos README, models</Cite> NVIDIA&apos;s documentation describes two
                modes that share transformer weights. One is autoregressive: it produces text one token at a time,
                each conditioned on the ones before, and does the reasoning. The other is the diffusion transformer
                of the three stages, which refines all the tokens of a clip together.{' '}
                <Cite id="F03-95">NVIDIA Cosmos models reference, architecture</Cite>
              </Box>
              <Box variant="p">
                On NVIDIA&apos;s benchmark page the 189-frame clip that takes Cosmos3-Nano 207.78 s at 720p on the
                H100 takes 114.85 s on a B200.{' '}
                <Cite id="F03-98">NVIDIA Cosmos inference benchmarks, Cosmos3-Nano</Cite> Used as an
                action-conditioned world model (first frame and an action sequence in, rollout video out), NVIDIA
                lists it at about 2.0 s per rollout on an H100 80GB. The length of that rollout is not published.{' '}
                <Cite id="F03-99">NVIDIA Cosmos inference benchmarks, forward dynamics</Cite>
              </Box>
              <Box variant="p">
                <strong>Genie (Google DeepMind).</strong> An interactive world generated from a text prompt, which a
                person or an agent steers as it is drawn. DeepMind describes Genie 3, of August 2025, as navigable in
                real time at 24 frames per second at 720p.{' '}
                <Cite id="F03-100">Google DeepMind blog, Genie 3</Cite> Its successor, Genie 4, is limited to
                around a minute of continuous interaction.{' '}
                <Cite id="F03-101">Google DeepMind, Genie model page</Cite>
              </Box>
              <Box variant="p">
                <strong>Dreamer 4 (Google DeepMind).</strong> The model that trains its policy inside the world
                model. Its authors report a 2B-parameter world model that runs interactively in real time
                on a single H100, with an agent trained inside it by reinforcement learning, which is learning by trial
                and error from a score. Its headline result is an agent that reaches diamonds in Minecraft from offline
                data only.{' '}
                <Cite id="F03-90">Dreamer 4 paper, abstract and section 4</Cite>
              </Box>
              <Box variant="p">
                <strong>The 1X World Model.</strong> A humanoid maker&apos;s variant of acting through video. 1X
                reports that a 14B video model generates 5 seconds of video of the robot doing the task, and a second
                network, an inverse dynamics model, works out which actions would produce that video. One inference
                takes 11 seconds on multiple GPUs plus 1 second for the action extraction.{' '}
                <Cite id="F03-102">1X post, World Model: self-learning</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="What one predictor pass replaces, what its loss never charges for, and three ways the missing detail can cost you the task">
            Predicting a latent: one pass, and a loss that never sees a pixel
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The latent family changes the target. An encoder turns each frame into a latent, as before. A second
            network, the predictor, takes the current latent and the action and outputs the next latent. Nothing
            in training asks for the pixels back: the predictor is scored against the encoder&apos;s latent of the
            frame that really came next. With nothing to redraw, the encoder is free to drop detail that is
            irrelevant or cannot be predicted.{' '}
            <Cite id="F03-106">V-JEPA paper, section 2</Cite> The design is called a JEPA (Joint-Embedding
            Predictive Architecture): a model that predicts the encoder&apos;s summary of the future and never the
            picture.
          </Box>
          <Box variant="p">
            The V-JEPA 2 authors draw the line where you drew it at the bench: the trajectory of a moving object is
            predictable, and the precise position of each blade of grass in a field is not.{' '}
            <Cite id="F03-107">V-JEPA 2 paper, section 1</Cite>
          </Box>
          <AnimatedFigure
            name="two families of world model"
            steps={WM_FAMILY_STEPS}
            intervalMs={3200}
            cites="F03-96 F03-95 F03-106 F03-109 F03-25"
            caption={
              <>
                The same frame and action go into both families. The pixel side has to paint the glint and the
                table texture along with the block, and the latent side may drop them. Illustrative, not measured:
                the noise and the latent values are drawn by hand, and no generated or decoded image is shown.
              </>
            }
          >
            {(step, reduced) => <WmFamilies step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            The latent has about as many positions as the pixel family&apos;s grid. In V-JEPA 2-AC the predictor reads
            each frame as a 16 x 16 grid of vectors, each 1408 numbers wide: 256 positions, against the 300 worked
            out for the arm&apos;s frame.{' '}
            <Cite id="F03-15">V-JEPA 2 paper, section 3.1</Cite> The saving is in how often they are visited, and
            by what. A predictor of about 300M parameters visits them once per imagined step. The Cosmos 3 examples
            visit their tokens 35 times with a transformer of billions.{' '}
            <Cite id="F03-14">V-JEPA 2 paper, section 3.1</Cite>{' '}
            <Cite id="F03-95">NVIDIA Cosmos models reference, architecture</Cite> A small model can shrink the
            latent too: LeWorldModel keeps one vector of width 192 per frame.{' '}
            <Cite id="F03-32">LeWorldModel paper, encoder</Cite>
          </Box>
          <Box variant="p">
            The predictor&apos;s loss shows what is charged for and what is free. V-JEPA 2-AC trains by walking
            through a recorded clip of a robot arm. At each frame the predictor is given what really happened up to
            that frame and guesses the latent of the next one. Starting every guess from the true history, never
            from the model&apos;s own earlier guesses, is called teacher forcing.
          </Box>
          <Box variant="p">
            Write <M>x_k</M> for frame <M>k</M> of the clip, <M>E</M> for the encoder, whose weights are frozen
            here, and{' '}
            <M>{String.raw`z_k = E(x_k)`}</M> for the latent of that frame. <M>a_k</M> is the action taken between
            frames <M>k</M> and <M>k+1</M>. The latent <M>z_k</M> is the scene as the model holds it, the state that{' '}
            <M>f</M> takes. The paper&apos;s <M>s_k</M> is a measurement fed in beside it, the pose of the gripper
            at frame <M>k</M>.
          </Box>
          <Box variant="p">
            <M>{String.raw`P_\phi`}</M> is the predictor with its weights{' '}
            <M>{String.raw`\phi`}</M>, and{' '}
            <M>{String.raw`\hat{z}_{k+1} = P_\phi\big((a_t, s_t, z_t)_{t \le k}\big)`}</M> is its guess for the
            next latent from the actions, poses and latents up to frame <M>k</M>. <M>T</M> is the number of guesses
            per clip, 15 for a clip of 16 frames. The double bars with a subscript 1 are the L1 distance:
            subtract the two latents number by number, drop the signs and add up.
          </Box>
          <Formula
            name="Next-latent prediction loss of V-JEPA 2-AC (teacher forcing)"
            tex={String.raw`\begin{aligned} & \mathcal{L}_{\text{teacher-forcing}}(\phi) \coloneqq \\ & \qquad \frac{1}{T}\sum_{k=1}^{T} \lVert \hat{z}_{k+1} - z_{k+1} \rVert_1 \end{aligned}`}
            source={<Cite id="F11-100">V-JEPA 2 paper, section 3.1, equation 2</Cite>}
          />
          <ul style={LIST}>
            <li>
              <M>{String.raw`\hat{z}_{k+1}`}</M> is the &quot;what if&quot; answer and{' '}
              <M>{String.raw`z_{k+1}`}</M> is what happened.
            </li>
            <li>
              The bars measure the miss between two latents. No pixel is redrawn, so a wrong glint on the cup costs
              nothing unless the encoder chose to keep the glint.
            </li>
            <li>
              The sum and the <M>{String.raw`1/T`}</M> average the miss over the 15 guesses, one for each frame after the first.
            </li>
            <li>
              <M>{String.raw`(\phi)`}</M> says which weights this loss trains: the predictor&apos;s alone. The
              encoder stays frozen.
            </li>
          </ul>
          <Box variant="p">
            A rollout starts from the model&apos;s own guesses, which this loss never practises, so V-JEPA 2-AC adds
            a second term that scores a short rollout.{' '}
            <Cite id="F11-102">V-JEPA 2 paper, section 3.1, equations 3 and 4</Cite>
          </Box>
          <Box variant="p">
            What the latent keeps was settled before this loss ran. V-JEPA 2 is trained in two stages: an encoder
            pretrained on over 1 million hours of internet video with no actions, then the predictor, trained on
            under 62 hours of robot video with that encoder frozen.{' '}
            <Cite id="F03-1">V-JEPA 2 paper, abstract</Cite> The first stage masks part of a video and has the
            network predict the latent of the masked part from the visible part, with the loss measured between
            latents. That is where the trajectory is kept and the blade of grass is let go.{' '}
            <Cite id="F03-2">V-JEPA 2 paper, section 2.1, equation 1</Cite>
          </Box>
          <Box variant="p">
            That first stage has a trap in it. Encoder and predictor are trained together and the target is itself
            an encoding, so the loss can be driven to zero by giving every input the same vector: prediction and
            target then always agree. The paper calls this representation collapse and guards against it by
            computing the target with a slowly updated copy of the encoder that the loss is not allowed to change
            (section 7, JEPA, compares the guards).{' '}
            <Cite id="F03-2">V-JEPA 2 paper, section 2.1, equation 1</Cite>
          </Box>
          <Box variant="p">
            Leaving detail out is the saving, and it is also how this family goes wrong.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Nothing to watch.</strong> The prediction is a set of vectors. To see what the model
              imagines, the V-JEPA 2 and LeWorldModel authors each train a separate decoder afterwards and use it
              only for inspection.{' '}
              <Cite id="F03-109">V-JEPA 2 paper, appendix B.3</Cite>
            </li>
            <li>
              <strong>What the encoder dropped is gone.</strong> The predictor can only predict what the latent
              holds. The LeWorldModel authors show a decoded rollout that keeps the overall scene and does not
              fully preserve the angle of the gripper, and a grasp depends on that angle.{' '}
              <Cite id="F03-109">LeWorldModel paper, section 5.1</Cite> The V-JEPA 2 authors say their planner
              &quot;fundamentally depend[s]&quot; on what its latent space captured.{' '}
              <Cite id="F03-111">V-JEPA 2 paper, section 1</Cite>
            </li>
            <li>
              <strong>One future.</strong> A predictor trained to minimise its average error outputs a single
              future, the mean of the plausible ones. Where the world can really go two ways, the mean may be
              neither. The authors of JEPA-WMs, a study of latent world models, name this as a limit of the family.{' '}
              <Cite id="F03-110">JEPA-WMs paper, section 7</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Which way each planner setting pushes the bill, why one step ahead was enough, and what would shorten the search">
            Candidates, rounds and horizon set the planning bill
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The 8,000 futures behind the 16 seconds are a product of three settings. On their own robot arms the
            V-JEPA 2 authors sampled 800 candidates, kept the best, sampled again around those, and repeated for 10
            rounds, with a horizon of 1: each candidate looks one action ahead. That is 800 x 10 x 1 = 8,000 calls
            to the predictor for every action the arm takes.{' '}
            <Cite id="F03-24">V-JEPA 2 paper, section 4.2</Cite>{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>{' '}
            <Cite id="F03-115">our arithmetic on the published planner settings</Cite>
          </Box>
          <Box variant="p">
            More candidates or more rounds search more thoroughly and multiply the bill. A longer horizon multiplies
            it again and meets two limits the authors name: prediction error accumulates along the rollout, and the
            number of possible action sequences grows exponentially with the horizon.{' '}
            <Cite id="F03-28">V-JEPA 2 paper, limitations</Cite> They found one step enough because their tasks
            were, in their words, &quot;relatively greedy&quot;: the move that looks best now is also the right
            one.{' '}
            <Cite id="F03-24">V-JEPA 2 paper, appendix B.2</Cite>
          </Box>
          <Box variant="p">
            Against the arm&apos;s clock even this search is long: 16 s is <Derived>16 x 30</Derived> ={' '}
            <Derived>480</Derived> control periods spent choosing one action.{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite> Search is for decisions the arm can
            wait for. Beyond smaller settings and more hardware, the authors name two changes of method that would
            shorten it: gradient-based planning, which
            computes through the predictor which way to change the actions where the search only samples them, and
            a policy that answers in a single pass, trained inside the world model to start the search near a good
            answer.{' '}
            <Cite id="F03-116">V-JEPA 2 paper, section 4.2</Cite>
          </Box>
          <Box variant="p">
            The other published times come from different hardware, resolution, horizon and batch size, so the
            chart is for orders of magnitude and no finer. On that scale the families do not overlap: every
            pixel-family time is 300 ms or more per candidate, and every latent-family time is 2 ms or less.
          </Box>
          <Figure
            cites="F03-118 F03-99 F03-25 F03-74 F03-41"
            caption={
              <>
                Each bar is one published time to imagine one candidate, with its GPU; the faint end of the last bar
                is a range. The axis is logarithmic, so each gridline is ten times the one to its left (µs is a
                microsecond, a millionth of a second). Only the bracketed pair shares a GPU and a planner.
              </>
            }
          >
            <CandidateChart />
          </Figure>
          <ul style={LIST}>
            <li>
              A current pixel model: NVIDIA lists Cosmos3-Nano at about 2.0 s per action-conditioned rollout on one
              H100 80GB, rollout length not published. Run one at a time, 8,000 of them would take about 16,000
              GPU-seconds, 4.4 GPU-hours, for a single action. How it behaves with rollouts batched is not
              published.{' '}
              <Cite id="F03-99">NVIDIA Cosmos inference benchmarks, forward dynamics</Cite>
            </li>
            <li>
              The same latent planner at the same settings: a later paper from the same lab reports 3 seconds per
              action on a single A100, which is 0.375 ms per candidate. Neither paper explains the gap, so quote a
              per-candidate time with its GPU and its paper.{' '}
              <Cite id="F03-74">V-JEPA 2.1 paper, Table 6</Cite> <Cite id="F03-118">our arithmetic, time per candidate</Cite>
            </li>
            <li>
              A small latent model: the LeWorldModel authors report a full plan in 0.98 s without saying which of
              two planner settings was timed. One setting is 45,000 candidate steps and the other 15,000, so one
              step of one candidate comes out between 22 and 65 microseconds.{' '}
              <Cite id="F03-41">LeWorldModel paper, Figure 3</Cite> <Cite id="F03-118">our arithmetic, time per candidate</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="How a video model reaches the arm: output the action with the prediction, then cut the parameters and the passes">
            A world-action model answers in one call, and the call still denoises video
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Search calls the world model thousands of times per decision. A world-action model is called once: it
            is trained to denoise the future video and the actions that go with it together, and the actions are
            taken from its output. They come out as a chunk, the run of future actions that lets a call longer
            than one control period still drive an arm (section 4, Learning From Demonstrations).
          </Box>
          <Box variant="p">
            From outside, that is the job of a VLA (vision-language-action model), the policy type of section 5
            that maps camera images and an instruction to actions. Inside, each call still denoises video, so its
            price is the pixel family&apos;s product again, with the parameter count behind every pass. Two
            published models show that product being cut.
          </Box>
          <Box variant="p">
            <strong>DreamZero</strong> is a 14B model. Its authors report about 5.7 seconds per action chunk on one
            GPU before optimisation and, with their optimisations, 7 Hz (seven chunks per second) on 2 GB200 GPUs.
            They give two reasons it remains expensive beside a VLA: the parameter count and &quot;the iterative
            denoising nature of video&quot;.{' '}
            <Cite id="F03-103">DreamZero paper, abstract and sections 3.2 and 6</Cite>
          </Box>
          <Box variant="p">
            <strong>GR00T 2</strong> cuts the parameters and the passes. Its figures come from an NVIDIA whitepaper
            dated November 2026, with the code announced for December and none released on 2026-11-20.
          </Box>
          <Box variant="p">
            The whitepaper describes a single 2B-parameter transformer built on Cosmos-Predict2.5-2B, a video generator
            from the generation before Cosmos 3. A frozen VAE compresses each camera stream 4 times in time and 8
            times in each spatial direction, and the result is split into patches, small blocks of neighbouring
            grid positions that become one token each: 280 tokens per compressed frame and camera at 224 x 320
            pixels, so <Derived>3 x 280</Derived> = <Derived>840</Derived> per compressed frame for the three camera
            views of the robot it was timed on.{' '}
            <Cite id="F03-104">NVIDIA GR00T 2 whitepaper, section 2</Cite>
          </Box>
          <Box variant="p">
            The passes fall furthest. NVIDIA writes that at inference &quot;a few denoising steps suffice: one or
            two for video and two to four for actions&quot;, where the Cosmos 3 examples use 35. It reports a median
            of 153 ms to predict an action chunk for one robot, Dexter, from three camera views on an RTX 5090 after
            its inference optimisations (449 ms before them), and 180 ms on the YAM arms.{' '}
            <Cite id="F03-104">NVIDIA GR00T 2 whitepaper, section 2</Cite>{' '}
            <Cite id="F03-95">NVIDIA Cosmos models reference, architecture</Cite>
          </Box>
          <Box variant="p">
            Both models are NVIDIA&apos;s, nine months apart: a 14B model on two data-centre GPUs in February, a 2B
            model on one workstation card in November, each timed on its own robots. Neither answers inside one
            control period. GR00T 2&apos;s 153 ms is 153 / <Derived>33.3</Derived> = <Derived>4.6</Derived>{' '}
            periods, which its chunk has to cover, as for any policy slower than the clock (section 17, Running on
            the Robot).{' '}
            <Cite id="F03-103">DreamZero paper, abstract and section 3.2</Cite>{' '}
            <Cite id="F03-104">NVIDIA GR00T 2 whitepaper, section 2</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Size the GPU for a video generator from its memory floor, and the seconds per decision of a planner from one timed round">
            On a machine: a memory floor for the generator, a round time for the planner
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A pixel generator and a latent planner ask different first questions of a GPU. A pixel generator runs a transformer of billions of parameters
            tens of times per clip, so its question is whether the model fits in GPU memory. A latent planner runs
            its predictor in rounds, ten batches of 800 per action at the V-JEPA 2 settings, so its question is
            how long one round takes.{' '}
            <Cite id="F03-24">V-JEPA 2 paper, section 4.2</Cite>
          </Box>
          <Box variant="p">
            Memory is published for one of these models. NVIDIA&apos;s support matrix for its NIM (NVIDIA Inference
            Microservice, the packaged container NVIDIA ships for serving a model) prints a minimum GPU memory per
            device for each Cosmos 3 configuration. For Cosmos3-Nano at full precision, with the whole model resident
            on the GPU, the floor is 58 GiB for generation.
            With the weights offloaded layer by layer to host memory the floor drops to 31 GiB, and the host then
            needs at least 64 GiB of its own. These are the floors the container checks before it starts. They are
            not measured peaks, and the page gives no resolution or frame count for them.{' '}
            <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite> For the latent planners and for GR00T 2
            we found no first-party memory figure, so measure it along with the round.
          </Box>
          <ExpandableSection headerText="Cosmos 3 memory: the other floors, the weights and one measured peak">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>NIM floors, other configurations.</strong> Full precision here is BF16, a 16-bit number
                format that takes 2 bytes per weight; FP8 is an 8-bit format that takes 1. Cosmos3-Nano in FP8 has a
                floor of 44 GiB with the model resident. Cosmos3-Super has floors of 150 GiB per device in BF16 and
                93 GiB in FP8. The page says to treat the floors as minimums, since concurrency and other workloads
                on the host can need more.{' '}
                <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>
              </Box>
              <Box variant="p">
                <strong>The open-source framework&apos;s FAQ.</strong> It answers &quot;How much GPU memory do the
                models need?&quot; with 32 GB for Cosmos3-Nano and 128 GB for Cosmos3-Super, with no resolution,
                precision or workload given. Both match the size of the weights alone, 16B parameters x 2 bytes = 32
                GB and 64B x 2 bytes = 128 GB, so we read them as memory for the weights, with working memory on
                top.{' '}
                <Cite id="F03-123">NVIDIA cosmos-framework FAQ, inference</Cite>
              </Box>
              <Box variant="p">
                <strong>One measured peak.</strong> Notes written for coding agents in the same NVIDIA repository
                record Cosmos3-Nano peaking at 33.8 GiB allocated on one H100 80 GB while generating a single 1280 x
                720 image. That is one frame; the notes give no peak for a full 189-frame video or for an
                action-conditioned rollout.{' '}
                <Cite id="F03-124">NVIDIA cosmos-framework, agent skill notes</Cite>
              </Box>
              <Box variant="p">
                <strong>The low end.</strong> NVIDIA ships an adapter that keeps Cosmos3-Nano&apos;s weights in host
                memory and streams them to the GPU as needed. With the FP8 checkpoint it completed all 21 of its test
                cases on an RTX 5070, a 12 GB card, on a host with 128 GB of system memory. It is for inference only
                and trades GPU memory for transfer time.{' '}
                <Cite id="F03-125">NVIDIA cosmos-framework, CPU offloading README</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            Training is where the two ask for the most different machines. NVIDIA reports pretraining Cosmos3-Nano
            on 1,024 GB200 GPUs, a job whose nodes work as one.{' '}
            <Cite id="F03-97">Cosmos 3 paper, section 4.1</Cite> The LeWorldModel authors state that their model of
            about 15M parameters trains on a single GPU in a few hours, without naming the GPU: one machine, for
            an afternoon.{' '}
            <Cite id="F03-31">LeWorldModel paper, abstract</Cite>
          </Box>
          <ExpandableSection headerText="Parameter counts, model by model">
            <SpaceBetween size="s">
              <Box variant="p">
                Parameter count does not separate the families: RoboJEPA&apos;s largest predictor has 8B parameters
                on a 2B encoder, and two of the pixel models have 2B.{' '}
                <Cite id="F03-117">our reading of the parameter counts</Cite>
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
                      <td style={TD}>GR00T 2 (whitepaper)</td>
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
          <Box variant="p">Choose by what has to come back.</Box>
          <ul style={LIST}>
            <li>
              <strong>Frames, to watch or to train on.</strong> Use the pixel family. On NVIDIA&apos;s figures for
              Cosmos3-Nano, budget 26.4 seconds of H100 compute per second of 720p video and a GPU that clears the 58
              GiB floor, or the 31 GiB floor with a large host. Lower the resolution before anything else: the same
              clip at 320 x 192 took 7.61 s.{' '}
              <Cite id="F03-98">NVIDIA Cosmos inference benchmarks, Cosmos3-Nano</Cite>{' '}
              <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>
            </li>
            <li>
              <strong>A decision, found by search.</strong> Use the latent family. Time one round of candidates on
              your GPU and multiply by the rounds and the horizon: the 16 seconds on an RTX 4090 are 10 rounds of
              about <Derived>1.6</Derived> s. Then copy the LeWorldModel authors&apos; check on the latent: train a
              small decoder, decode a rollout, and look for the detail your task turns on, such as the gripper
              angle.{' '}
              <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>{' '}
              <Cite id="F03-109">LeWorldModel paper, section 5.1</Cite>
            </li>
            <li>
              <strong>An action several times a second.</strong> Neither search fits inside a control period. Use
              a model that outputs actions directly. Today that is a VLA such as GR00T N1.7, the newest GR00T with
              released weights and code (section 5, Vision-Language-Action Models): DreamZero&apos;s 7 Hz took two
              GB200 GPUs, and GR00T 2 has no code yet.{' '}
              <Cite id="F02-37">Isaac-GR00T N1.7 release</Cite>{' '}
              <Cite id="F03-103">DreamZero paper, abstract and section 3.2</Cite>{' '}
              <Cite id="F03-104">NVIDIA GR00T 2 whitepaper, section 2</Cite>
            </li>
          </ul>
          <Box variant="p">
            For the {ARM} on your bench, the family you can train and take apart on one GPU is the latent one
            (section 7, JEPA). The first thing to measure there is your own time per imagined future, 2 ms on the
            V-JEPA 2 authors&apos; RTX 4090, because the candidates, rounds and horizon you can afford all follow
            from it.{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>{' '}
            <Cite id="F03-115">our arithmetic on the published planner settings</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
