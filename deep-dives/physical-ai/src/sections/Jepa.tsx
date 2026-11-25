import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Toy, Derived } from '../components/Cite';
import { Figure, AnimatedFigure } from '../components/Figure';
import { Formula, M } from '../components/Math';
import { JepaClip } from '../components/figures/JepaClip';
import { JepaTrain, JEPA_TRAIN_STEPS } from '../components/figures/JepaTrain';
import { JepaCem, JEPA_CEM_STEPS } from '../components/figures/JepaCem';
import { JepaPasses } from '../components/figures/JepaPasses';
import { ARM, TASK_STORY } from '../lib/task';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const GPU_INK = '#1e7b3a';
const NEUTRAL_INK = '#5f6b7a';
const EMPHASIS = '#0972d3';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 560, margin: '0 auto' };
const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

const LABEL = { fontFamily: 'sans-serif', fontSize: 12, fill: INK } as const;
const BOLD = { fontFamily: 'sans-serif', fontSize: 12, fill: INK, fontWeight: 'bold' } as const;

/** The goal the planner is given on the thread task. */
const GOAL_PHOTO = 'a photo of the block sitting in the cup';

/** Deterministic stand-in for a random number in [0, 1), so every render draws the same dots. */
function rnd(i: number, salt: number): number {
  const r = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return r - Math.floor(r);
}

/* ------------------------------------------------------------------------ */
/* Diagram 7.3: collapse                                                    */
/* ------------------------------------------------------------------------ */

const SPREAD_DOTS = Array.from({ length: 28 }, (_, i) => {
  const a = 2 * Math.PI * rnd(i, 1);
  const r = 44 * Math.sqrt(rnd(i, 2));
  return { x: 75 + r * Math.cos(a), y: 71 + r * Math.sin(a) };
});
const LINE_DOTS = Array.from({ length: 28 }, (_, i) => {
  const u = rnd(i, 3) * 2 - 1;
  const j = (rnd(i, 4) * 2 - 1) * 2.5;
  return { x: 75 + 42 * u + j, y: 323 - 30 * u + j };
});

function CollapseDiagram() {
  const rows = [
    { y: 16, title: 'Spread out', lines: ['Different inputs land apart, in', 'every direction. The latents can', 'tell one scene from another.'] },
    { y: 142, title: 'Complete collapse', lines: ['Every input lands on one point.', 'Guess and answer always match,', 'so the loss is zero.'] },
    { y: 268, title: 'Dimensional collapse', lines: ['Inputs differ, but only along', 'one line. The other dimensions', 'carry nothing.'] },
  ];
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 396" role="img" aria-labelledby="jepa-collapse-title" style={{ width: '100%', height: 'auto' }}>
        <title id="jepa-collapse-title">A spread latent space against complete collapse and dimensional collapse</title>
        <desc>
          Three panels, each plotting the latents of many inputs in two dimensions. In the first the dots fill a round
          cloud. In the second every dot sits on one point. In the third the dots lie along a single line.
        </desc>
        <rect x="0" y="0" width="400" height="396" fill="#fbfbfd" />
        {rows.map((r) => (
          <g key={r.title}>
            <rect x="20" y={r.y} width="110" height="110" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1" />
            <line x1="75" y1={r.y + 6} x2="75" y2={r.y + 104} stroke="#e3e6ea" strokeWidth="1" />
            <line x1="26" y1={r.y + 55} x2="124" y2={r.y + 55} stroke="#e3e6ea" strokeWidth="1" />
            <text x="146" y={r.y + 30} {...BOLD}>
              {r.title}
            </text>
            {r.lines.map((line, i) => (
              <text key={line} x="146" y={r.y + 50 + i * 17} {...LABEL}>
                {line}
              </text>
            ))}
          </g>
        ))}
        {SPREAD_DOTS.map((p) => (
          <circle key={`${p.x}-${p.y}`} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="3" fill={GPU_INK} />
        ))}
        <circle cx="75" cy="197" r="9" fill="none" stroke={EMPHASIS} strokeWidth="2.5" />
        <circle cx="75" cy="197" r="3.5" fill={INK} />
        {LINE_DOTS.map((p) => (
          <circle key={`${p.x}-${p.y}`} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="3" fill={NEUTRAL_INK} />
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function Jepa() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Name the measure that keeps a JEPA's encoder from returning one vector for every frame, and price its planner in predictor passes before you read a benchmark (the V-JEPA 2, V-JEPA 2.1, RoboJEPA and LeWorldModel papers with the vjepa2 and le-wm code, read 2026-11-20)"
          >
            7. JEPA: Predicting in Latent Space
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A JEPA (Joint-Embedding Predictive Architecture) is trained against answers it writes itself. Its
            encoder turns what the camera saw into a latent, a learned set of numbers that stands for it (JEPAs
            are the latent family of section 6, World Models). A second network, the predictor, guesses the
            latent of something the encoder was not shown, and the loss is the distance between that guess and
            the latent an encoder gives the real thing. No camera frame appears in it. An encoder that returns
            the same numbers for every input therefore scores a perfect zero on every clip, and to the {ARM}, the
            table-top arm followed here, a block in the cup and a block on the table then look alike. That is
            collapse, and a JEPA is defined by what it does to block it.{' '}
            <Cite id="F03-63">V-JEPA paper, section 3.1, and LeWorldModel paper, section 1</Cite>
          </Box>
          <Box variant="p">
            V-JEPA 2, Meta&apos;s video model, takes its answers from a copy of the encoder that the loss cannot
            change and that trails the trained encoder slowly. LeWorldModel keeps one encoder and adds one loss term that penalises a batch of
            latents for bunching together. V-JEPA 2-AC and RoboJEPA, which plan for real arms, train only a predictor
            on an encoder that is frozen. Which of the three a model uses sets how many networks sit in memory
            during training, how many loss weights you tune, and whether the latent can adapt to your task at all.{' '}
            <Cite id="F03-8">vjepa2 app/vjepa/train.py, lines 471 to 480</Cite>{' '}
            <Cite id="F03-35">le-wm train.py, lines 27 to 41</Cite>{' '}
            <Cite id="F03-71">LeWorldModel paper, section 2, and V-JEPA 2 paper, section 5</Cite>
          </Box>
          <Box variant="p">
            The cost of planning with the result is a count you can work out before you run anything. An action-conditioned
            predictor answers one question, what the latent will be after this action, so a planner picks an
            action by trying many.
            V-JEPA 2&apos;s planner samples 800 candidate actions, refines the sample 10 times and looks 1 step
            ahead: 800 x 10 x 1 = 8,000 forward passes of the predictor for one action, which the V-JEPA 2 authors
            report takes 16 seconds on one NVIDIA RTX 4090. The {ARM}&apos;s control clock ticks 30 times a second
            (section 3, The Robot as a Computer), so each move costs 16 x 30 = <Derived>480</Derived> ticks of
            waiting. A JEPA planner is sized in seconds of GPU per action.{' '}
            <Cite id="F03-24">V-JEPA 2 paper, appendix B.2</Cite>{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Why predicting the latent of a hidden grasp teaches how grippers and blocks move, and what the encoder is free to leave out">
            The answer is a description, so the loss never draws a pixel
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Record four seconds of the {ARM} as it starts to {TASK_STORY}, and cover the region where the gripper
            meets the block with a grey rectangle in every frame. Asked what is under the rectangle, you would
            answer with a description: the gripper comes down, closes on the block and lifts it. To give it you
            must know where the block was, how a gripper moves, and that a held block travels with the hand. The
            grain of the table is no part of the answer, and you could not have predicted it anyway.
          </Box>
          <Box variant="p">
            A JEPA is trained on that exercise, with the description replaced by numbers the model learns for
            itself. The encoder turns the visible part of the clip into latents (papers also say representations
            or embeddings). An encoder pass over the hidden part gives the target latents. The predictor, a second
            network, takes the first set and outputs a guess at the second. The loss is the distance between
            guess and target, which the paper that defined the architecture calls the energy: low when the target
            is a plausible match for what was seen, high when it is not.{' '}
            <Cite id="F03-47">LeCun position paper, section 4.4</Cite>{' '}
            <Cite id="F03-48">LeCun position paper, sections 4.1 and 4.4</Cite>
          </Box>
          <Box variant="p">
            Measuring the miss between latents is what the design buys. A loss on pixels charges the model for
            every reflection it gets wrong. A loss on latents lets the encoder drop what cannot be predicted and
            spend its capacity on what can: the V-JEPA 2 authors set the trajectory of a moving object, which is
            predictable, against the place of each leaf on a tree, which is not.{' '}
            <Cite id="F03-51">LeCun position paper, section 4.4</Cite>{' '}
            <Cite id="F03-107">V-JEPA 2 paper, section 1</Cite>
          </Box>
          <Box variant="p">
            The price comes from the same freedom. Nobody can look at a predicted latent, and whatever the encoder
            dropped is gone for every later use. The LeWorldModel authors trained a decoder only to inspect what
            their latent kept, and found the structure of the scene there and finer details such as the angle of
            the gripper &quot;not fully preserved&quot;. A grasp can depend on that angle.{' '}
            <Cite id="F03-109">V-JEPA 2 paper, appendix B.3, and LeWorldModel paper, section 5.1</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Count the vectors one clip of the arm becomes, and see how little of the clip the encoder is shown">
            What the encoder reads: a clip cut into tubelets, most of them hidden
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            V-JEPA 2&apos;s encoder is a ViT (Vision Transformer), a transformer that reads a picture as a
            sequence of small squares. Each square is a patch, and each element of the sequence is a token. For
            video the patch is extended through time into a tubelet: the same 16 by 16 pixel square in 2
            consecutive frames. Each tubelet becomes one token and the encoder returns one vector per token. In
            V-JEPA 2 the latent of a clip is therefore a grid of vectors, one per tubelet, and each vector is
            called a latent too.{' '}
            <Cite id="F03-3">V-JEPA 2 paper, section 2.1</Cite>
          </Box>
          <Box variant="p">
            A pretraining clip is 16 frames at 256 by 256 pixels, sampled at 4 frames per second: four seconds of
            the arm. In time that is 16 / 2 = 8 tubelets, in space 256 / 16 = 16 per side, and in total 8 x 16 x
            16 = <Derived>2,048</Derived> tokens.{' '}
            <Cite id="F03-11">V-JEPA 2 paper, section 2.2 and Table 9</Cite> The largest encoder, ViT-g, has 1B
            parameters and 40 layers and returns each token as a vector of 1408 numbers. The predictor used in
            pretraining is far smaller: 22M parameters, 12 layers, vectors of 384 numbers.{' '}
            <Cite id="F03-4">V-JEPA 2 paper, appendix A.3, Table 12</Cite>
          </Box>
          <Box variant="p">
            Masking removes tokens before the encoder sees them. V-JEPA 2 hides blocks: rectangles of the frame
            that run through the whole clip in time, like the grey rectangle over the grasp. The released
            configuration draws two kinds of mask per clip, 8 blocks that each cover 15% of the frame area and 2
            blocks that each cover 70%.{' '}
            <Cite id="F03-9">vjepa2 pretrain-256px-16f.yaml, mask block</Cite> The V-JEPA paper, where these
            settings come from, reports that they hide about 90% of the tokens on average.{' '}
            <Cite id="F03-60">V-JEPA paper, section 3.2</Cite> At that ratio about <Derived>205</Derived> of the{' '}
            <Derived>2,048</Derived> tokens stay visible (the V-JEPA 2 paper prints no ratio of its own). With the gripper and the block hidden in every frame, the only way to predict
            that region&apos;s latents is to know how grippers and blocks move.
          </Box>
          <Figure
            cites="F03-3 F03-4 F03-11"
            caption={
              <>
                Follow the blue outline: one tubelet from the stack of frames, to its place in the lattice, to one
                token, to one latent. The bars at the bottom count numbers: the encoder returns about as many as
                the clip held in pixels, so it re-describes the clip more than it shrinks it. Illustrative: the
                frames repeat six stills of a simulated episode of the {ARM}, and the latent shades are invented.
              </>
            }
          >
            <JepaClip />
          </Figure>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Read V-JEPA 2's objective for which weights the gradient may change, and work out how slowly the answers move">
            One training step: the loss moves two networks, and the third follows
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Pretraining uses video alone, with no actions and no labels. Each step takes one clip, hides most of
            it and asks for the latents of the hidden part. The context encoder, with weights{' '}
            <M>{String.raw`\theta`}</M>, sees only the visible tokens. The target encoder, with weights{' '}
            <M>{String.raw`\overline{\theta}`}</M>, is a copy of the encoder that sees the whole clip and supplies
            the answers. The predictor, with weights <M>{String.raw`\phi`}</M>, receives the context
            encoder&apos;s outputs plus one mask token for every hidden position and returns one vector for each.
            A mask token is a learned placeholder vector, tagged with its position in the clip, that means
            &quot;predict what belongs here&quot;.{' '}
            <Cite id="F03-6">vjepa2 predictor.py, lines 189 to 252</Cite>
          </Box>

          <Box variant="h3">The loss: an L1 distance at the hidden positions</Box>
          <Box variant="p">
            The loss asks how far the predictor&apos;s guess is from what the target encoder says is there, at
            the hidden positions and nowhere else. In the paper&apos;s symbols, <M>{String.raw`x`}</M> is the
            masked clip and <M>{String.raw`y`}</M> the full clip. <M>{String.raw`E_\theta`}</M> is the context
            encoder, <M>{String.raw`E_{\overline{\theta}}`}</M> the target encoder and{' '}
            <M>{String.raw`P_\phi`}</M> the predictor. <M>{String.raw`\Delta_y`}</M> is the mask tokens.{' '}
            <M>{String.raw`\text{sg}(\cdot)`}</M> is the stop-gradient: it leaves the value as it is and changes
            only what training may adjust. The double bars with a subscript 1 are the L1
            distance, the measure section 4, Learning From Demonstrations, used on action chunks: subtract the two
            lists of numbers entry by entry, drop the signs and add up.
          </Box>
          <Formula
            name="V-JEPA 2 pretraining objective"
            tex={String.raw`\begin{aligned} & \underset{\theta,\,\phi,\,\Delta_y}{\text{minimize}} \\ & \quad \lVert P_\phi(\Delta_y, E_\theta(x)) - \text{sg}(E_{\overline{\theta}}(y)) \rVert_1 \end{aligned}`}
            source={<Cite id="F03-2">V-JEPA 2 paper, section 2.1, equation 1</Cite>}
          />
          <Box variant="p">
            <M>{String.raw`E_\theta(x)`}</M> is what was seen: the context encoder&apos;s latents for the visible
            tokens. <M>{String.raw`P_\phi(\Delta_y, \cdot)`}</M> is the guess for the hidden positions.{' '}
            <M>{String.raw`\text{sg}(E_{\overline{\theta}}(y))`}</M> is the answer, and the bars are the energy
            between the two. The subscript under &quot;minimize&quot; lists what the optimiser may change: the encoder, the predictor and the mask token.{' '}
            <M>{String.raw`\overline{\theta}`}</M> is absent from it, so the loss never moves the network that
            supplies the answers.
          </Box>
          <Box variant="p">
            With toy latents of four numbers (an illustration), a guess of (1, 3, 0, 2) against an answer of (2,
            3, 1, 0) differs by 1, 0, 1 and 2, which add up to 4. The released code takes the mean, 4 / 4 = 1, and
            it rescales the target latents with a layer normalisation before comparing, a step equation 1 does not
            show. Where paper and code differ, the code is what trains.{' '}
            <Cite id="F03-7">vjepa2 app/vjepa/train.py, lines 429 to 450</Cite>
          </Box>

          <Box variant="h3">The stop-gradient: the answer may not move to meet the guess</Box>
          <Box variant="p">
            Training computes, for every weight, how the loss would change if that weight were nudged, and nudges
            it the way that lowers the loss. That signal is the gradient. This loss depends on two encoders, so
            left alone both would be nudged, and the target would move to meet the guess. The stop-gradient says:
            treat this value as a constant. The gradient reaches <M>{String.raw`\phi`}</M> and{' '}
            <M>{String.raw`\theta`}</M> through the guess and never reaches{' '}
            <M>{String.raw`\overline{\theta}`}</M>. In the released code the target encoder runs under{' '}
            <code>torch.no_grad()</code> and its weights are marked <code>requires_grad = False</code>.{' '}
            <Cite id="F03-7">vjepa2 app/vjepa/train.py, lines 429 to 450</Cite>{' '}
            <Cite id="F03-8">vjepa2 app/vjepa/train.py, lines 222 to 480</Cite>
          </Box>

          <Box variant="h3">The EMA: each step moves the answers 0.075% of the way</Box>
          <Box variant="p">
            A target encoder that never changed would keep giving the answers of an untrained network. It follows
            the context encoder as an EMA (exponential moving average), a running average in which recent values
            count most and old ones fade. Let <M>{String.raw`m`}</M>, the momentum, be a number just under 1;
            V-JEPA 2 holds it at 0.99925 for the whole run. After every optimiser step, each target weight
            becomes:
          </Box>
          <Formula
            name="EMA update of the target encoder"
            tex={String.raw`\overline{\theta} \leftarrow m\,\overline{\theta} + (1 - m)\,\theta`}
            source={<Cite id="F03-8">vjepa2 app/vjepa/train.py, lines 471 to 480</Cite>}
          />
          <Box variant="p">
            <M>{String.raw`m\,\overline{\theta}`}</M> keeps almost all of the old target weight, and{' '}
            <M>{String.raw`(1 - m)\,\theta`}</M> mixes in a sliver of the encoder&apos;s current one: 1 - 0.99925
            = 0.00075, which is 0.075%. Take one weight with toy values (an illustration). The target holds{' '}
            <Toy>0.5000</Toy> and the encoder has moved to <Toy>0.9000</Toy>. One update gives 0.99925 x{' '}
            <Toy>0.5000</Toy> + 0.00075 x <Toy>0.9000</Toy> = <Toy>0.5003</Toy>, which closes <Toy>0.0003</Toy>{' '}
            of a gap of <Toy>0.4</Toy>. At that pace the target is an average over roughly 1 / 0.00075 = 1,333
            recent steps, and it needs about <Derived>924</Derived> steps to close half of any gap (
            <Derived>ln 0.5 / ln 0.99925</Derived>).{' '}
            <Cite id="F03-8">vjepa2 app/vjepa/train.py, lines 471 to 480, and the config&apos;s ema setting</Cite>
          </Box>
          <AnimatedFigure
            name="one JEPA training step"
            steps={JEPA_TRAIN_STEPS}
            intervalMs={3400}
            cites="F03-2 F03-8"
            caption={
              <>
                Green boxes are trained by the loss; the grey box is the target encoder, which only follows.
                Illustrative layout: the lattice is drawn 8 by 8, coarser than the real one, a real clip hides a
                larger share of its tokens, the latent shades are invented, and the EMA step is drawn far larger
                than 0.075% of the gap.
              </>
            }
          >
            {(step, reduced) => <JepaTrain step={step} reduced={reduced} />}
          </AnimatedFigure>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Recognise the failure that the loss cannot report, in both its degrees, and judge what a slow target and a frozen encoder each cost">
            Collapse: a loss of zero and latents that say nothing
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Suppose the encoder outputs the same vector for every input, all zeros say. The target latents are
            then all zeros, the predictor learns to output zeros, and the loss is 0 on every clip. A model that predicts
            pixels has no such exit, because the camera fixes its targets. A JEPA writes its own. The V-JEPA
            authors write that the plain regression &quot;would admit a trivial
            solution, where the encoder outputs a constant representation, regardless of its input&quot;, and the
            LeWorldModel authors call preventing it &quot;one of the central challenges in training JEPA
            models&quot;.{' '}
            <Cite id="F03-63">V-JEPA paper, section 3.1, and LeWorldModel paper, section 1</Cite>
          </Box>
          <Box variant="p">
            It comes in two degrees. In complete collapse every input lands on nearly one point. In dimensional
            collapse the latents differ and all lie in a thin slice of the space: of the 1408 numbers in each
            vector, most carry nothing.{' '}
            <Cite id="F03-64">LeJEPA paper, section 2</Cite> The training loss reports neither. It measures
            agreement between guess and target, and collapsed latents agree perfectly, so a falling loss is what
            both a working run and a collapsing one show. What tells them apart is the spread of the latents
            across a batch, and every measure against collapse is a way of protecting that spread.
          </Box>
          <Figure
            cites="F03-63 F03-64"
            caption={
              <>
                Each dot is the latent of one input, drawn in two of its dimensions. Illustrative, not measured.
              </>
            }
          >
            <CollapseDiagram />
          </Figure>

          <Box variant="h3">A slow target: it works in practice, and the explanation is a hypothesis</Box>
          <Box variant="p">
            V-JEPA 2&apos;s training step is the first measure. For the shortcut to pay, guess and answer have to
            drift to the same constant together. The stop-gradient takes away the answer&apos;s reason to move:
            no gradient pulls <M>{String.raw`\overline{\theta}`}</M> toward the guess. The EMA takes away its
            speed: 0.075% of the way per step. From one step to the next the answers hold almost still, as a
            camera&apos;s pixels do.
          </Box>
          <Box variant="p">
            Why that is enough is a hypothesis, and the V-JEPA authors state it as one: the slow target ensures
            that the predictor evolves faster than the encoder and stays close to optimal, and that prevents
            collapse.{' '}
            <Cite id="F03-65">V-JEPA paper, section 3.1</Cite> The LeWorldModel authors object that the pair does
            not &quot;in general correspond to the minimization of a well-defined objective&quot;.{' '}
            <Cite id="F03-66">LeWorldModel paper, section 2</Cite> You pay for the measure with a second encoder
            in memory, and you rely on its record more than on a proof.
          </Box>

          <Box variant="h3">A frozen encoder leaves nothing to collapse</Box>
          <Box variant="p">
            The bluntest measure is to stop training the encoder. If its weights do not change while the
            predictor trains, the targets are fixed, as pixels are. V-JEPA 2-AC and RoboJEPA work this way, on
            encoders pretrained beforehand. The price is that the latent is whatever pretraining kept, and no
            amount of robot data changes it: the V-JEPA 2 authors write that such a world model is
            &quot;inherently limited by the state information encoded in the learned representation
            space&quot;.{' '}
            <Cite id="F03-71">LeWorldModel paper, section 2, and V-JEPA 2 paper, section 5</Cite>{' '}
            <Cite id="F03-75">RoboJEPA paper, abstract and section 2</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Follow the measure that trains encoder and predictor together with no second copy, and find the two settings that matter when you run it">
            Spread as a loss term: from six tunable weights to one
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The other measures leave the encoder trainable and put the spread of the latents into the loss. The
            oldest, contrastive learning, adds a term that pushes apart the latents of different inputs, called
            negatives. The position paper that defined JEPA argues against it, because the number of negatives
            needed grows with the dimension of the latent.{' '}
            <Cite id="F03-70">I-JEPA paper, section 2, and the position paper, section 4.3</Cite> The two that
            followed measure the batch directly.
          </Box>

          <Box variant="h3">Variance and covariance terms: one statistic for each degree of collapse</Box>
          <Box variant="p">
            Picture a batch of latents as a table, one row per input and one column per dimension. A column that
            holds the same value in every row has collapsed. Two columns that always move together are one column
            stored twice. Two statistics put numbers on those pictures. The variance of a column measures how far
            its values spread around their average across the batch (the standard deviation is its square root),
            and it is 0 when every row holds the same value. The covariance of two columns measures whether they
            rise and fall together: far from 0 when one follows the other, and 0 when high values of one come
            equally with high and low values of the other.
          </Box>
          <Box variant="p">
            VICReg (2022, named after its three terms: variance, invariance, covariance), a method for training
            image encoders, turns the two statistics into loss terms beside the pull that makes matching latents
            agree. A variance term grows when the standard deviation of any column falls under a threshold, which
            blocks complete collapse. A covariance term grows with the covariance between any two different
            columns, which blocks dimensional collapse.{' '}
            <Cite id="F03-67">VICReg paper, abstract and equation 6</Cite>
          </Box>
          <Box variant="p">
            The price is tuning. The LeWorldModel authors count a seven-term loss with six tunable coefficients
            in PLDM, a JEPA world model that trains its encoder this way, and say it makes training unstable and
            tuning harder.{' '}
            <Cite id="F03-68">LeWorldModel paper, abstract and section 4.1</Cite>
          </Box>
          <ExpandableSection headerText="VICReg's loss, term by term, with three batches to try it on">
            <SpaceBetween size="s">
          <Box variant="p">
            <M>{String.raw`Z`}</M> and <M>{String.raw`Z'`}</M> are two batches of latents that should match row
            by row, as a JEPA&apos;s guesses and targets should. <M>{String.raw`s`}</M> is the invariance term, the
            mean squared distance between matching rows. <M>{String.raw`v`}</M> is the variance term: zero while
            the standard deviation of every column stays over a threshold, and growing when one falls under it.{' '}
            <M>{String.raw`c`}</M> is the covariance term, which grows with the covariance between any two
            different columns. <M>{String.raw`\lambda`}</M>, <M>{String.raw`\mu`}</M> and{' '}
            <M>{String.raw`\nu`}</M> are three weights, and <M>{String.raw`\ell`}</M> is the loss for the pair of
            batches.
          </Box>
          <Formula
            name="VICReg loss"
            tex={String.raw`\begin{aligned} \ell(Z, Z') = {} & \lambda\, s(Z, Z') \\ & + \mu\,[v(Z) + v(Z')] \\ & + \nu\,[c(Z) + c(Z')] \end{aligned}`}
            source={<Cite id="F03-67">VICReg paper, abstract and equation 6</Cite>}
          />
          <Box variant="p">
            <M>{String.raw`s`}</M> is the pull that makes matching latents agree, and alone it is the shortcut.{' '}
            <M>{String.raw`v`}</M> blocks complete collapse, because a constant column has a standard deviation
            of 0. <M>{String.raw`c`}</M> blocks dimensional collapse, because columns that move together have a
            high covariance.
          </Box>
          <Box variant="p">
            Three toy batches of four latents with two numbers each (an illustration). In (3, 3), (3, 3), (3, 3),
            (3, 3) neither column varies, so <M>{String.raw`v`}</M> is large. In (1, 1), (2, 2), (3, 3), (4, 4)
            both columns vary and the second copies the first, so <M>{String.raw`c`}</M> is large. In (1, 2), (2,
            4), (3, 1), (4, 3) both vary and their covariance is 0, so both terms are satisfied. To redo it,
            subtract each column&apos;s average (<Toy>2.5</Toy>) from its values, multiply the two leftovers row
            by row and add: <Toy>0.75 - 0.75 - 0.75 + 0.75</Toy> = 0.
          </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Box variant="h3">SIGReg: one term for the shape of the whole cloud</Box>
          <Box variant="p">
            SIGReg (Sketched Isotropic Gaussian Regularization) replaces the separate spread terms with one target
            shape. It pushes the batch&apos;s cloud of latents toward an isotropic Gaussian: a round bell-shaped
            cloud with the same spread in every direction and no correlation between dimensions.{' '}
            <Cite id="F03-69">LeJEPA paper, abstract</Cite> In the table picture, that is every column with
            variance 1 and every pair of columns with covariance 0. A single point has variance 0 and a flat
            slice has columns that move together, so by those two definitions one term answers both degrees of
            collapse.
          </Box>
          <Box variant="p">
            LeWorldModel (LeWM) is the world model built on it, at about 15M parameters. Its one encoder is
            trained together with the predictor and turns each frame into a single vector of 192 numbers, where
            V-JEPA 2 keeps a grid of vectors per frame. It has no target copy and no stop-gradient, so one
            network fewer sits in memory.{' '}
            <Cite id="F03-31">LeWorldModel paper, abstract</Cite>{' '}
            <Cite id="F03-32">LeWorldModel paper, section 3.1</Cite>{' '}
            <Cite id="F03-35">le-wm train.py, lines 27 to 41</Cite>
          </Box>
          <Box variant="p">
            Checking the shape of a cloud in that many dimensions directly is expensive, so SIGReg checks its
            shadows. It projects every latent in the batch onto random directions, which leaves a plain list of
            numbers per direction, and tests whether each list looks like draws from a standard bell curve. If
            every shadow is Gaussian, so is the cloud (the Cramer-Wold theorem).{' '}
            <Cite id="F03-39">LeWorldModel paper, section 3.1</Cite>
          </Box>
          <Box variant="p">
            The loss adds that test to a prediction error. <M>{String.raw`z_t`}</M> is the latent of frame{' '}
            <M>{String.raw`t`}</M>, <M>{String.raw`a_t`}</M> the action taken at that frame,{' '}
            <M>{String.raw`\mathrm{pred}_\phi`}</M> the predictor and <M>{String.raw`\hat{z}_{t+1}`}</M> its
            guess for the next frame&apos;s latent. <M>{String.raw`Z`}</M> is all the latents in the batch and{' '}
            <M>{String.raw`\lambda`}</M> a single weight. The double bars with two 2s are the squared L2
            distance: subtract entry by entry, square, add up.
          </Box>
          <Formula
            name="LeWorldModel training objective"
            tex={String.raw`\begin{aligned} \hat{z}_{t+1} &= \mathrm{pred}_\phi(z_t, a_t) \\ \mathcal{L}_{\mathrm{pred}} &\triangleq \lVert \hat{z}_{t+1} - z_{t+1} \rVert_2^2 \\ \mathcal{L}_{\mathrm{LeWM}} &\triangleq \mathcal{L}_{\mathrm{pred}} + \lambda\,\mathrm{SIGReg}(Z) \end{aligned}`}
            source={<Cite id="F03-36">LeWorldModel paper, section 3.1, equations 1 and 3</Cite>}
          />
          <Box variant="p">
            <M>{String.raw`\mathcal{L}_{\mathrm{pred}}`}</M> is the JEPA pull: the predicted and the actual next
            latent should agree. Alone, it collapses. <M>{String.raw`\mathrm{SIGReg}(Z)`}</M> is large when the
            batch&apos;s latents fail the bell-curve test along the sampled directions, and a collapsed batch
            fails it badly. <M>{String.raw`\lambda`}</M> sets the exchange rate between the two, and it is the
            only loss weight.
          </Box>
          <Box variant="p">
            The evidence says that weight is forgiving. The paper gives <M>{String.raw`\lambda`}</M> = 0.1 with
            1,024 random directions; the released training config sets 0.09, with 1,024 projections each tested
            at 17 points. On Push-T, a simulated 2D pushing task, the authors report success above 80% for any{' '}
            <M>{String.raw`\lambda`}</M> between 0.01 and 0.2.{' '}
            <Cite id="F03-36">LeWorldModel paper, section 3.1</Cite>{' '}
            <Cite id="F03-37">le-wm config/train/lewm.yaml, lines 17 to 43</Cite>{' '}
            <Cite id="F03-46">LeWorldModel paper, appendix G</Cite> The width of the latent is the less forgiving
            setting: they report that performance drops when it falls under about 184, and the released width of
            192 sits just over that mark.{' '}
            <Cite id="F03-32">LeWorldModel paper, section 3.1</Cite>
          </Box>
          <Box variant="p">
            On Push-T, over three seeds, the LeWorldModel authors report 96.0% success for their model, 92.0% for
            DINO-WM, a latent world model built on a frozen pretrained encoder, and 78.0% for PLDM. The evidence
            stops at simulation. All four of the paper&apos;s tasks are
            simulated, DINO-WM is slightly ahead on the one closest to this arm&apos;s job (a simulated arm picks
            up a cube and places it at a target), and the paper reports no result on a real robot.{' '}
            <Cite id="F03-42">LeWorldModel paper, section 4.1 and appendix Table 5</Cite> The authors also state
            where the regulariser weakens: in very simple environments whose data has little variety.{' '}
            <Cite id="F03-45">LeWorldModel paper, section 6</Cite>
          </Box>
          <ExpandableSection headerText="How SIGReg tests one direction, from the released code">
            <SpaceBetween size="s">
              <Box variant="p">
                Take one random direction, and let <M>{String.raw`p_n`}</M> be the shadow of the{' '}
                <M>{String.raw`n`}</M>-th latent of the batch on it. The test wraps each shadow around a circle:
                the value <M>{String.raw`p_n`}</M> becomes the point at angle <M>{String.raw`t\,p_n`}</M>, with
                coordinates <M>{String.raw`\cos(t\,p_n)`}</M> and <M>{String.raw`\sin(t\,p_n)`}</M>, where{' '}
                <M>{String.raw`t`}</M> is a chosen test value (no longer a frame index). The average of those
                points over the batch depends on how the shadows are spread, and as a function of{' '}
                <M>{String.raw`t`}</M> it is a fingerprint of their distribution, the characteristic function.
                For a standard Gaussian the fingerprint is known in advance: <M>{String.raw`e^{-t^2/2}`}</M> on
                the cosine axis and 0 on the sine axis. The error at one <M>{String.raw`t`}</M> is the squared
                distance between the batch&apos;s average point and that one:
              </Box>
              <Formula
                name="SIGReg error for one direction at one test value"
                tex={String.raw`\begin{aligned} & \big(\operatorname{mean}_n \cos(t\,p_n) - e^{-t^2/2}\big)^2 \\ & + \big(\operatorname{mean}_n \sin(t\,p_n)\big)^2 \end{aligned}`}
                source={<Cite id="F03-38">le-wm module.py, lines 10 to 36</Cite>}
              />
              <Box variant="p">
                The first bracket is the miss on the cosine axis and the second the miss on the sine axis. A
                small <M>{String.raw`t`}</M> wraps the shadows loosely and tests their broad spread; a larger one
                wraps them tightly and tests finer shape. The code evaluates this at 17 values of{' '}
                <M>{String.raw`t`}</M> from 0 to 3, weights and sums them, scales by the batch size, and averages
                over the 1,024 directions.{' '}
                <Cite id="F03-38">le-wm module.py, lines 10 to 36</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="See what turns a video encoder into a world model for an arm, and why its predictor is trained on its own outputs as well as on real frames">
            Adding actions: a frozen encoder and a predictor that reads 258 tokens per step
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A world model takes an action as an input, and masked pretraining has none. V-JEPA 2 adds it in a
            second stage. Stage one is the masked pretraining, on over 1 million hours of internet video. Stage two
            freezes that encoder and trains a new predictor, V-JEPA 2-AC (the AC stands for action-conditioned),
            on under 62 hours of robot video. Video teaches how the world moves, and a little robot data teaches
            what actions do.{' '}
            <Cite id="F03-1">V-JEPA 2 paper, abstract</Cite>
          </Box>
          <Box variant="p">
            The new predictor is a transformer of about 300M parameters, with 24 layers and vectors of 1024
            numbers.{' '}
            <Cite id="F03-14">V-JEPA 2 paper, section 3.1</Cite> For each time step, which is one frame, it
            reads an action token, a state token and the frame&apos;s latent. The action is 7 numbers: the change
            in the gripper&apos;s pose between this frame and the next. The {ARM} records six joint targets, a
            different action space (section 3, The Robot as a Computer), so its episodes do not fit this
            predictor as recorded. The state is 7 numbers for the gripper&apos;s pose
            now (3 for position, 3 for orientation, 1 for the opening). The latent is a 16 x 16 grid of vectors
            from the frozen encoder, 1408 numbers each.{' '}
            <Cite id="F03-15">V-JEPA 2 paper, section 3.1</Cite>
          </Box>
          <Box variant="p">
            That is 1 + 1 + 256 = 258 tokens per time step, and the output is the predicted 16 x 16 grid for the
            next frame. The 258 is the size of one predictor pass, and the planner will multiply it by
            thousands.{' '}
            <Cite id="F03-16">vjepa2 ac_predictor.py, lines 141 to 153</Cite>
          </Box>
          <Box variant="p">
            Training compares the predicted grid with the frozen encoder&apos;s grid for the real next frame, by
            L1 distance again. Every guess starts from the true latents of the frames before it, which is called
            teacher forcing.{' '}
            <Cite id="F11-100">V-JEPA 2 paper, section 3.1, equation 2</Cite> A planner has true latents for the
            current frame only. Past it the predictor must build on its own output, and its errors accumulate
            from step to step.{' '}
            <Cite id="F03-28">V-JEPA 2 paper, section 4.3</Cite> A second loss term trains that case.
          </Box>
          <Box variant="p">
            <M>{String.raw`z_1`}</M> is the latent of a clip&apos;s first frame and <M>{String.raw`s_1`}</M> the
            gripper&apos;s pose there. <M>{String.raw`a_{1:T}`}</M> is the <M>{String.raw`T`}</M> recorded
            actions that followed, with <M>{String.raw`T = 2`}</M> in practice; this <M>T</M> is the length of
            the rollout. <M>{String.raw`P_\phi(a_{1:T}, s_1, z_1)`}</M> is the predictor run{' '}
            <M>{String.raw`T`}</M> times from that start, each run after the first taking its own previous
            output as input. <M>{String.raw`z_{T+1}`}</M> is the encoder&apos;s latent of the frame the robot
            really reached. <M>{String.raw`\mathcal{L}_{\text{teacher-forcing}}`}</M> is the teacher-forcing
            loss, and <M>{String.raw`\phi`}</M> the predictor&apos;s weights.
          </Box>
          <Formula
            name="V-JEPA 2-AC training loss: rollout term and total"
            tex={String.raw`\begin{aligned} & \mathcal{L}_{\text{rollout}}(\phi) \coloneqq \\ & \quad \lVert P_\phi(a_{1:T}, s_1, z_1) - z_{T+1} \rVert_1 \\[6pt] & L(\phi) \coloneqq \mathcal{L}_{\text{teacher-forcing}}(\phi) \\ & \quad + \mathcal{L}_{\text{rollout}}(\phi) \end{aligned}`}
            source={<Cite id="F03-18">V-JEPA 2 paper, section 3.1, equations 3 and 4</Cite>}
          />
          <Box variant="p">
            The first line is the miss after an imagined rollout: only the first latent is real, and the
            prediction is compared with where the robot really ended up. The second line adds the two misses with
            equal weight. One term teaches single steps from true inputs, the other teaches the predictor to stay
            accurate on its own outputs. <M>{String.raw`(\phi)`}</M> says what is trained: the predictor alone.
            With <M>{String.raw`T = 2`}</M> the gradient passes through one repeated step of the predictor.{' '}
            <Cite id="F11-102">V-JEPA 2 paper, section 3.1, text around equations 3 and 4</Cite>
          </Box>
          <Box variant="p">
            One limit comes with any predictor trained on a distance. It gives one output per input, so where two
            futures are plausible it learns their average, the fault section 4 found in regression on actions. A
            peer-reviewed study of the family names it: the loss &quot;learns the conditional mean of potentially
            genuinely multi-modal futures&quot;. Its authors add that replanning from the real frame softens the
            effect in their benchmarks.{' '}
            <Cite id="F03-110">JEPA-WMs paper, section 7</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Turn a goal photo into a motor command by search, and price the search as samples x iterations x horizon before you read the seconds">
            Planning: 8,000 predictor passes to choose one action
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A predictor answers &quot;if I do this, what will the latent be?&quot;. To act, something has to ask
            the questions, and it needs a goal. Here the goal is a picture: {GOAL_PHOTO}. The encoder turns it
            into a goal latent, and planning becomes a search for the actions whose predicted latent lands
            closest to it.
          </Box>
          <Box variant="p">
            <M>{String.raw`z_k`}</M> is the latent of the current frame <M>{String.raw`k`}</M>, and{' '}
            <M>{String.raw`s_k`}</M> the gripper&apos;s current pose. <M>{String.raw`z_g`}</M> is the goal
            latent. <M>{String.raw`\hat{a}_{1:T}`}</M> is a candidate sequence of <M>{String.raw`T`}</M> actions,
            where <M>{String.raw`T`}</M> is now the planning horizon: how many steps the planner looks ahead.{' '}
            <M>{String.raw`P(\hat{a}_{1:T}; s_k, z_k)`}</M> is the predictor run <M>{String.raw`T`}</M> times
            from the present, each time on its own previous output. The cost of a candidate is its energy{' '}
            <M>{String.raw`\mathcal{E}`}</M>, and the plan <M>{String.raw`(a^\star_i)_{i \in [T]}`}</M>, the
            actions <M>{String.raw`a^\star_1`}</M> to <M>{String.raw`a^\star_T`}</M>, is the candidate with the
            lowest energy:
          </Box>
          <Formula
            name="V-JEPA 2-AC planning objective"
            tex={String.raw`\begin{aligned} & \mathcal{E}(\hat{a}_{1:T};\ z_k, s_k, z_g) \coloneqq \\ & \quad \lVert P(\hat{a}_{1:T}; s_k, z_k) - z_g \rVert_1 \\[6pt] & (a^\star_i)_{i \in [T]} \coloneqq \\ & \quad \underset{\hat{a}_{1:T}}{\text{argmin}}\ \mathcal{E}(\hat{a}_{1:T};\ z_k, s_k, z_g) \end{aligned}`}
            source={<Cite id="F03-23">V-JEPA 2 paper, section 3.2, equation 5</Cite>}
          />
          <Box variant="p">
            In the first line, the left term inside the bars is the imagined future for this candidate and the
            right term is where you want to be. The L1 distance between them is the training measure reused as a
            score: a low energy means the candidate is predicted to make the scene look like the goal picture.
            The second line is the search: argmin means &quot;the candidate that makes this smallest&quot;. No
            formula solves it, so the authors approximate it with one loop inside another.{' '}
            <Cite id="F11-101">V-JEPA 2 paper, section 3.2 and Figure 7</Cite>
          </Box>
          <Box variant="p">
            The outer loop is MPC (model-predictive control), the standard way to act with a model whose
            predictions hold only a short way ahead: plan a sequence of actions through the model, execute the
            first part, read the camera again, and plan afresh from the real frame. How much to execute is a
            setting. V-JEPA 2-AC executes 1 action of a 1-step plan, RoboJEPA 2 actions of a 5-step plan, and
            LeWorldModel all 5 action blocks of a 5-step plan. Replanning sooner corrects the model&apos;s errors
            sooner and pays for the search again.{' '}
            <Cite id="F03-112">V-JEPA 2 paper, section 3.2, RoboJEPA paper, Table 13, and LeWorldModel paper, appendix D</Cite>
          </Box>
          <Box variant="p">
            The inner loop is CEM (the cross-entropy method), a search that needs only forward passes of the
            predictor and no gradient, which suits a cost you can evaluate and cannot solve. It keeps a sampling
            distribution over action sequences, a Gaussian with a mean and a spread, and repeats four moves:
            sample a pool of candidates from it; roll each one through the predictor and score it; keep the few
            with the lowest cost, called the elites; set the mean and the spread to those of the elites. After
            the last round, the mean is the plan.{' '}
            <Cite id="F03-113">LeWorldModel paper, appendix A, Algorithm 2</Cite>
          </Box>
          <Box variant="p">
            One iteration with toy numbers (an illustration; a real action has more than one number). The block
            sits <Toy>10</Toy> cm to the left of the gripper, and the planner searches over a single number, the
            sideways move in cm, negative for left. The distribution starts at mean <Toy>0</Toy> with spread{' '}
            <Toy>5</Toy>.
          </Box>
          <ol style={LIST}>
            <li>
              Sample eight candidates: <Toy>+4, -6, +1, -8, -3, +7, -7, +2</Toy>.
            </li>
            <li>
              Imagine each and score it. In this toy the energy is the distance left to the block:{' '}
              <Toy>14, 4, 11, 2, 7, 17, 3, 12</Toy>.
            </li>
            <li>
              Keep the three lowest: <Toy>-8, -7 and -6</Toy>, with energies <Toy>2, 3 and 4</Toy>.
            </li>
            <li>
              Refit: their mean is <Toy>(-8 - 7 - 6) / 3 = -7</Toy>, and their sample standard deviation is{' '}
              <Toy>1</Toy>.
            </li>
          </ol>
          <Box variant="p">
            The next iteration samples around <Toy>-7</Toy> with spread <Toy>1</Toy>, where this one sampled
            around <Toy>0</Toy> with spread <Toy>5</Toy>. Each iteration moves the mean toward the block and
            shrinks the spread, at the price of one predictor pass per candidate per step of the horizon.
          </Box>
          <Box variant="p">
            The V-JEPA 2 robot experiments run that loop with 800 samples per iteration, 10 iterations, the top
            10 kept each time and a horizon of 1. The bill is the product: samples x iterations x horizon = 800 x
            10 x 1 = 8,000 predictor passes for every action the arm takes, run as 10 batches of 800. The authors
            report 16 seconds for it on one NVIDIA RTX 4090, which is 16 s / 8,000 = 2 ms per pass.{' '}
            <Cite id="F03-24">V-JEPA 2 paper, appendix B.2</Cite>{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>{' '}
            <Cite id="F03-118">our arithmetic, time per candidate</Cite>
          </Box>
          <AnimatedFigure
            name="planning with the cross-entropy method"
            steps={JEPA_CEM_STEPS}
            intervalMs={3200}
            cites="F03-23 F03-113 F03-24"
            caption={
              <>
                Two views of the same search. In latent space each dot is the predicted end of one candidate, and
                nothing moves on the table until step 8. The action panel draws the toy iteration of the text.
                Illustrative, not measured: the positions are drawn by hand, a real latent has far more than two
                dimensions, and the real planner samples 800 candidates where this one draws a few dozen.
              </>
            }
          >
            {(step, reduced) => <JepaCem step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            On a pick-and-place the bill multiplies again. One goal image is not enough, so the authors hand the
            model three in turn (object grasped, object near the target, object placed) on a fixed schedule of 4,
            10 and 4 time steps. That is 4 + 10 + 4 = 18 planned actions: 18 x 8,000 = 144,000 predictor passes
            and 18 x 16 s = 288 s, 4.8 minutes of GPU time spent deciding at the authors&apos; RTX 4090 rate.{' '}
            <Cite id="F03-27">V-JEPA 2 paper, section 4.2, and our arithmetic</Cite>{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>
          </Box>
          <Box variant="p">
            What the wait buys is a task set by a picture at run time: the predictor was trained with no reward,
            no task label and no success flag.{' '}
            <Cite id="F03-20">V-JEPA 2 paper, section 3.1</Cite> On two Franka research arms in labs absent from
            the training data, with 10 trials per task, the authors report pick-and-place succeeding 80% of the
            time with a cup and 65% with a box, and grasping 65% and 25%.{' '}
            <Cite id="F03-26">V-JEPA 2 paper, section 4.2, Table 2</Cite>
          </Box>

          <Box variant="h3">A better encoder and a longer horizon each bought one trial in ten</Box>
          <Box variant="p">
            A frozen encoder decides what the planner can see. V-JEPA 2.1 (released 2026-03-16) changes the
            pretraining recipe so that visible tokens also contribute to the loss and the loss is applied at
            several depths of the encoder, and it adds a larger encoder, ViT-G, of 2B parameters against
            ViT-g&apos;s 1B.{' '}
            <Cite id="F03-72">vjepa2 README, V-JEPA 2.1 release notes</Cite> With the same 300M predictor recipe
            and the same 800 x 10 x 1 plan, its authors report cup grasping at 70% against 60%, over 10 trials,
            and credit features that &quot;better encode depth information&quot;. The difference is one trial, and
            the 60% is the newer paper&apos;s own figure for V-JEPA 2, where the V-JEPA 2 paper printed 65%.{' '}
            <Cite id="F03-73">V-JEPA 2.1 paper, Table 6</Cite>{' '}
            <Cite id="F03-111">V-JEPA 2.1 paper, Figure 8 caption</Cite>
          </Box>
          <Box variant="p">
            The same table lengthens the horizon. At horizon 8, with 300 samples and 15 iterations, grasp success
            is 80% where the 1-step plan gave 70%, one more trial in ten, for 300 x 15 x 8 = 36,000 passes.{' '}
            <Cite id="F03-73">V-JEPA 2.1 paper, Table 6</Cite> The horizon cannot grow freely, for two reasons
            the V-JEPA 2 authors give: prediction errors accumulate along the rollout, and the number of possible
            action sequences grows exponentially with the horizon.{' '}
            <Cite id="F03-28">V-JEPA 2 paper, section 4.3</Cite>
          </Box>
          <Box variant="p">
            RoboJEPA (7 Oct 2026) keeps the V-JEPA 2.1 encoder frozen and scales the other half: predictors from
            22M to 8B parameters, trained on 15,022 hours of robot video, of which 6,692 hours carry synchronised
            actions.{' '}
            <Cite id="F03-75">RoboJEPA paper, abstract and section 2</Cite>{' '}
            <Cite id="F03-76">RoboJEPA paper, section 2.1</Cite> Its authors state where scaling one half stops:
            their fits &quot;already sit close to data saturation&quot;, so going further will likely take more
            varied robot data, more than parameters.{' '}
            <Cite id="F03-79">RoboJEPA paper, section 6</Cite>
          </Box>
          <Box variant="p">
            RoboJEPA also plans toward one goal image where V-JEPA 2 needed three, and that is where latent
            planning still trails a trained policy. On a Franka arm the authors report success for the 8B model
            of 67% on grasp, 50% on object lift and 27% on pick-and-place. The text-conditioned policy pi0.5,
            which they give as a reference, scores 5%, 0% and 53%: under the planner on the two short skills and
            about twice its rate on the full task. The authors call such figures &quot;contextual references
            rather than directly comparable baselines&quot;.{' '}
            <Cite id="F03-78">RoboJEPA paper, section 4.3 and Table 3</Cite>{' '}
            <Cite id="F03-77">RoboJEPA paper, section 2.2</Cite>
          </Box>

          <Box variant="h3">Weigh one pass before you compare pass counts</Box>
          <Box variant="p">
            The same product prices every planner in the line, and the seconds do not follow it. LeWorldModel
            plans Push-T with 300 x 30 x 5 = 45,000 passes, more than five times V-JEPA 2-AC&apos;s 8,000, yet
            its authors report a full plan in 0.98 s, without saying which of their two settings was timed. The
            difference is the size of one pass: V-JEPA 2-AC runs a
            300M transformer over 258 tokens per frame, LeWorldModel a 10M transformer over 1 to 3 tokens. Read a
            count with the predictor&apos;s size and its tokens beside it.{' '}
            <Cite id="F03-115">our arithmetic, predictor passes per decision</Cite>{' '}
            <Cite id="F03-40">LeWorldModel paper, appendix D</Cite>{' '}
            <Cite id="F03-41">LeWorldModel paper, Figure 3</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={TH}>Planner</th>
                  <th style={TH}>Samples x iterations x horizon</th>
                  <th style={TH}>Authors&apos; reported time, and the GPU</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>V-JEPA 2-AC</td>
                  <td style={TD}>800 x 10 x 1 = 8,000 passes</td>
                  <td style={TD}>
                    16 seconds per action on one NVIDIA RTX 4090 in the V-JEPA 2 paper; 3 seconds per action on a
                    single NVIDIA A100 for the same settings in the V-JEPA 2.1 paper
                  </td>
                  <td style={TD}>
                    <Cite id="F03-24">V-JEPA 2 paper, appendix B.2</Cite>{' '}
                    <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>{' '}
                    <Cite id="F03-74">V-JEPA 2.1 paper, Table 6</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>V-JEPA 2.1 at horizon 8</td>
                  <td style={TD}>300 x 15 x 8 = 36,000 passes</td>
                  <td style={TD}>14 seconds per action on a single A100</td>
                  <td style={TD}>
                    <Cite id="F03-73">V-JEPA 2.1 paper, Table 6</Cite>{' '}
                    <Cite id="F03-74">V-JEPA 2.1 paper, Table 6 caption</Cite>{' '}
                    <Cite id="F03-115">our arithmetic, predictor passes per decision</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>LeWorldModel</td>
                  <td style={TD}>
                    300 x 30 x 5 = 45,000 passes on Push-T; 15,000 on its other tasks, which run 10 iterations
                  </td>
                  <td style={TD}>
                    0.98 s for a full plan against 47 s for DINO-WM. The GPU is not named, and the paper does not
                    say which of the two settings was timed
                  </td>
                  <td style={TD}>
                    <Cite id="F03-40">LeWorldModel paper, appendix D</Cite>{' '}
                    <Cite id="F03-41">LeWorldModel paper, Figure 3</Cite>{' '}
                    <Cite id="F03-115">our arithmetic, predictor passes per decision</Cite>{' '}
                    <Cite id="F03-118">our arithmetic, time per candidate</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>RoboJEPA on a real arm</td>
                  <td style={TD}>
                    4,096 x 10 x 5 = 204,800 passes; 15 iterations and 307,200 passes on the first plan
                  </td>
                  <td style={TD}>
                    No seconds figure is printed. The authors run the planner on several GPUs at once and describe
                    it as &quot;not real-time&quot; and &quot;several seconds&quot;
                  </td>
                  <td style={TD}>
                    <Cite id="F03-77">RoboJEPA paper, section 2.2 and Table 13</Cite>{' '}
                    <Cite id="F03-115">our arithmetic, predictor passes per decision</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Figure
            cites="F03-115 F03-25 F03-74 F03-73 F03-41"
            caption={
              <>
                Each bar is samples x iterations x horizon for one published planner. The axis is logarithmic, so
                the length of a segment is the size of its factor and the three end at the total. The counts are
                our arithmetic from each paper&apos;s settings; the times are the authors&apos; own, each on its
                own GPU, so compare them within a row.
              </>
            }
          >
            <JepaPasses />
          </Figure>
          <Box variant="p">
            Quote a planning time with its model, its GPU and its paper. The same 800 x 10 x 1 plan is 16 seconds
            on the RTX 4090 in the 2025 paper and 3 seconds on a single A100 in the 2026 one, 2 ms and 3 s / 8,000
            = 0.375 ms per pass, and neither paper explains the gap.{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>{' '}
            <Cite id="F03-74">V-JEPA 2.1 paper, Table 6</Cite>{' '}
            <Cite id="F03-118">our arithmetic, time per candidate</Cite>
          </Box>
          <Box variant="p">
            CEM has two stated limits. The LeWorldModel authors note that it has no guarantee of a global
            optimum and &quot;becomes increasingly difficult to apply when the action space is large&quot;.{' '}
            <Cite id="F03-114">LeWorldModel paper, appendix A</Cite> The published planners keep that space
            small. V-JEPA 2-AC limits each sampled action to about 13 cm of gripper travel, and its authors
            report trying camera positions by hand before settling on one that worked.{' '}
            <Cite id="F03-28">V-JEPA 2 paper, section 4.2</Cite>
          </Box>
          <ExpandableSection headerText="If you run the released notebook: its planner defaults differ from the paper">
            <Box variant="p">
              The notebook wrapper in the vjepa2 repository defaults to 400 samples, 10 CEM steps, the top 10 and
              a rollout of 2, and it samples only the x, y, z move and the gripper, leaving rotation at zero. The
              count of predictor passes is the same as the paper&apos;s: 400 x 10 x 2 = 8,000.{' '}
              <Cite id="F03-29">vjepa2 notebooks/utils/world_model_wrapper.py, lines 20 to 29</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Place JEPA training and JEPA planning on a machine from their published figures, and cost the next planner you read about the same way">
            What a JEPA asks of a machine: a cluster to pretrain, seconds of one GPU per action
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every job here runs a transformer on a GPU&apos;s tensor cores, the part of the chip that multiplies
            matrices, and the jobs differ widely in size (section 15, Training at Three Scales).
            Pretraining the video encoder is
            the large one: the V-JEPA 2 authors project roughly 60 GPU-years on A100s for ViT-g without their
            progressive-resolution schedule, which they report cuts GPU time 8.4x. The paper states neither the
            GPU count nor the duration of the run that produced the release.{' '}
            <Cite id="F03-12">V-JEPA 2 paper, section 2.2 and Figure 5</Cite>
          </Box>
          <Box variant="p">
            Training a predictor on a frozen encoder is a job that spans nodes: the released V-JEPA 2-AC
            configuration asks for 4 nodes of 8 GPUs, and RoboJEPA&apos;s 1B predictor ran on 32 nodes of 8 H100
            GPUs.{' '}
            <Cite id="F03-21">vjepa2 droid-256px-8f.yaml</Cite>{' '}
            <Cite id="F03-80">RoboJEPA paper, appendix C.2</Cite> LeWorldModel is the one sized for a single
            machine: its authors state that it trains on a single GPU in a few hours, and name no GPU.{' '}
            <Cite id="F03-31">LeWorldModel paper, abstract</Cite>
          </Box>
          <Box variant="p">
            One planned action is 10 batches of 800 passes. Each batch waits for the one before it, because CEM
            refits its distribution between rounds, and the candidates inside a batch never exchange data. That is why RoboJEPA&apos;s authors can spread a
            round over several GPUs, and why the V-JEPA 2 authors&apos; list of ways to cut the time starts with
            more compute. The rest of their list: fewer samples and refinement steps, a fast policy trained in the
            world model&apos;s imagination to start the search, or a planner that follows gradients through the
            predictor.{' '}
            <Cite id="F03-24">V-JEPA 2 paper, appendix B.2</Cite>{' '}
            <Cite id="F03-77">RoboJEPA paper, section 2.2</Cite>{' '}
            <Cite id="F03-116">V-JEPA 2 paper, section 4.2</Cite>
          </Box>
          <Box variant="p">
            Gradient planning has a published weakness. A peer-reviewed comparison of planners for this family
            reports that gradient planners do well where the cost is smooth and fail on contact-rich
            manipulation because of local minima, and that CEM plans best overall. Picking up a block is
            contact.{' '}
            <Cite id="F03-81">JEPA-WMs paper, section 7</Cite>
          </Box>
          <Box variant="p">
            The GPU&apos;s arithmetic may not be what a pass waits on. RoboJEPA&apos;s authors, profiling their 1B
            predictor on a single H200, report that plain inference is &quot;bound by host-side dispatch, not by
            matrix multiplication&quot;, the CPU&apos;s work of handing operations to the GPU: matrix multiplies
            took about 26% of GPU time at a batch of 16. Time one pass and see what
            it waits on before you buy a larger GPU (section 21, Reading a Machine).{' '}
            <Cite id="F03-80">RoboJEPA paper, appendix I</Cite>
          </Box>
          <Box variant="p">
            Before you set a JEPA paper&apos;s planner beside your arm, ask it two things. Which measure keeps the
            encoder from collapsing, and does it live in the update rule, in the loss or in a frozen encoder? The
            answer says what you would train and what you must take as given. Then multiply samples by
            iterations by horizon, weigh one pass by the predictor&apos;s size and its tokens per step, and find
            the seconds and the GPU printed beside them. For V-JEPA 2-AC the answers are a frozen 1B encoder, 800
            x 10 x 1 = 8,000 passes of a 300M predictor over 258 tokens, and 16 seconds per action on one RTX 4090,
            as its authors report.{' '}
            <Cite id="F03-24">V-JEPA 2 paper, appendix B.2</Cite>{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>{' '}
            <Cite id="F03-115">our arithmetic, predictor passes per decision</Cite>{' '}
            <Cite id="F03-4">V-JEPA 2 paper, appendix A.3, Table 12</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
