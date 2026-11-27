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
    { y: 142, title: 'Complete collapse', lines: ['Every input lands on one point.', 'Guess and target always match,', 'so the loss is zero.'] },
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
            description="A JEPA (Joint-Embedding Predictive Architecture) learns by predicting a compact summary of what the camera sees instead of the pixels themselves. You will see how one is trained, the three methods that keep its encoder from giving every frame the same output, and how to estimate the GPU time its planner needs for each action before you read a benchmark."
          >
            7. JEPA: Predicting in Latent Space
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A JEPA is a model that learns by predicting a compact, learned summary of a scene instead of its
            pixels. JEPAs make up the latent family of world models
            described in section 6, World Models. A JEPA has two networks. The encoder turns what the camera saw
            into a latent: a learned set of numbers that stands for the scene. The predictor takes the latent of
            the visible part of the input and outputs a guess at the latent of a part that the encoder was not
            shown.
          </Box>
          <Box variant="p">
            Training compares that guess with the latent that the encoder produces for the hidden part, so the
            loss is a distance between two latents. No camera frame appears in the loss, which means that the
            model produces its own training targets. Because of that, the model can reach a low loss without
            learning anything useful. If the encoder returns the same numbers for every input, the guess always
            matches the target and the loss is zero on every clip. Such an encoder is useless: for the {ARM} arm
            used throughout this dive, a block in the cup and a block on the table would look the same. This
            failure is called collapse. JEPA designs differ mainly in the method each one uses to prevent it.{' '}
            <Cite id="F03-63">V-JEPA paper, section 3.1, and LeWorldModel paper, section 1</Cite>
          </Box>
          <Box variant="p">The models in this section use three different methods to prevent collapse:</Box>
          <ul style={LIST}>
            <li>
              <strong>A slow copy of the encoder.</strong> V-JEPA 2, Meta&apos;s video model, takes its targets
              from a second copy of the encoder. The loss cannot change this copy, and the copy follows the
              trained encoder slowly. <Cite id="F03-8">vjepa2 app/vjepa/train.py, lines 471 to 480</Cite>
            </li>
            <li>
              <strong>A loss term that keeps the latents spread out.</strong> LeWorldModel, a small JEPA world
              model, keeps a single encoder and adds one loss term that penalises a batch of latents when they bunch together.{' '}
              <Cite id="F03-35">le-wm train.py, lines 27 to 41</Cite>
            </li>
            <li>
              <strong>A frozen encoder.</strong> V-JEPA 2-AC and RoboJEPA, two models that plan actions for real
              robot arms, keep a pretrained encoder fixed and train only the predictor.{' '}
              <Cite id="F03-71">LeWorldModel paper, section 2, and V-JEPA 2 paper, section 5</Cite>
            </li>
          </ul>
          <Box variant="p">
            The method a model uses has three practical consequences: how many networks sit in memory during
            training, how many loss weights you have to tune, and whether the latent can adapt to your task at
            all.
          </Box>
          <Box variant="p">
            To control a robot with a JEPA, you also need a planner. A predictor that takes an action as one of
            its inputs answers one question: what will the latent be after this action? To choose an action, a
            planner asks this question for many candidate actions and keeps the best one. Each question is one
            forward pass of the predictor, so you can estimate the planner&apos;s cost before you run anything.
            V-JEPA 2&apos;s planner samples 800 candidate actions,
            refines the sample 10 times and looks 1 step ahead. That is 800 x 10 x 1 = 8,000 forward passes of
            the predictor for one action. The V-JEPA 2 authors report that this takes 16 seconds on one NVIDIA
            RTX 4090. <Cite id="F03-24">V-JEPA 2 paper, appendix B.2</Cite>{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite> By default, the {ARM} accepts a
            new target for its motors 30 times a second (section 3, The Robot as a Computer).{' '}
            <Cite id="F01-28">LeRobot dataset.py, record defaults</Cite> So one planned move takes as long as 16
            x 30 = <Derived>480</Derived> of those control cycles. This is why you size a JEPA planner in
            seconds of GPU time per action.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="To predict the latent of a hidden grasp, a model has to learn how grippers and blocks move. Because the loss compares latents instead of pixels, the encoder can leave out details it cannot predict, and you cannot get those details back later."
          >
            Why a JEPA predicts latents instead of pixels
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Start with a thought experiment. Record four seconds of video of the {ARM} as it starts to{' '}
            {TASK_STORY}. Then cover the region where the gripper meets the block with a grey rectangle in every
            frame. If someone asks you what happens under the rectangle, you answer with a description: the
            gripper comes down, closes on the block and lifts it. To give that answer, you need to know where the
            block was, how a gripper moves, and that a block the gripper holds moves with it. You do not need to
            describe the texture of the table, and you could not predict it anyway.
          </Box>
          <Box variant="p">
            A JEPA is trained on the same exercise, except that the description is a set of numbers the model
            learns for itself. The encoder turns the visible part of the clip into latents. Papers also call
            latents representations or embeddings. The encoder also processes the hidden part, and the latents it
            produces there are the target latents. The predictor, the second network, takes the latents of the visible
            part and outputs a guess at the target latents. The loss is the distance between the guess and the
            target. The position paper that defined the architecture calls this distance the energy. The energy
            is low when the target is a plausible match for what was seen, and high when it is not.{' '}
            <Cite id="F03-47">LeCun position paper, section 4.4</Cite>{' '}
            <Cite id="F03-48">LeCun position paper, sections 4.1 and 4.4</Cite>
          </Box>
          <Box variant="p">
            Measuring the error between latents, instead of between pixels, is the main benefit of the design. A
            loss on pixels penalises the model for every reflection and every small detail it gets wrong. A loss
            on latents lets the encoder leave out what cannot be predicted and use its capacity for what can. The
            V-JEPA 2 authors give an example: the path of a moving object is predictable, but the exact position
            of each leaf on a tree is not. <Cite id="F03-51">LeCun position paper, section 4.4</Cite>{' '}
            <Cite id="F03-107">V-JEPA 2 paper, section 1</Cite>
          </Box>
          <Box variant="p">
            The same freedom has a cost. You cannot look at a predicted latent the way you look at a predicted
            image, and anything the encoder left out is missing for every later use of the latent. To check what
            their latent kept, the LeWorldModel authors trained a decoder, a network that turns latents back into
            images, and used it only for this inspection. They found that the latent kept the structure of the
            scene, but that finer details such as the angle of the gripper were &quot;not fully preserved&quot;.
            That matters for a robot, because a grasp can depend on the angle of the gripper.{' '}
            <Cite id="F03-109">V-JEPA 2 paper, appendix B.3, and LeWorldModel paper, section 5.1</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="One short video clip of the arm becomes a grid of about two thousand tokens. During training, the encoder sees only a small part of that grid, and the model has to predict the rest."
          >
            How the encoder reads a video clip: tubelets, tokens and masking
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            V-JEPA 2&apos;s encoder is a ViT (Vision Transformer). A ViT is a transformer that reads an image as
            a sequence of small squares. Each square is called a patch, and each element of the sequence is
            called a token. For video, the patch is extended through time into a tubelet, which is the same 16 by
            16 pixel square in 2 consecutive frames. Each tubelet becomes one token, and the encoder returns one
            vector per token. So in V-JEPA 2, the latent of a clip is a grid of vectors, one per tubelet. Each of
            these vectors is also called a latent. <Cite id="F03-3">V-JEPA 2 paper, section 2.1</Cite>
          </Box>
          <Box variant="p">
            A pretraining clip has 16 frames of 256 by 256 pixels, sampled at 4 frames per second, so it covers
            four seconds of video. Cut into tubelets, the clip is 16 / 2 = 8 tubelets deep in time and 256 / 16 =
            16 tubelets along each side of the frame. In total, one clip becomes 8 x 16 x 16 ={' '}
            <Derived>2,048</Derived> tokens. <Cite id="F03-11">V-JEPA 2 paper, section 2.2 and Table 9</Cite>
          </Box>
          <Box variant="p">
            The largest V-JEPA 2 encoder, ViT-g, has 1B parameters and 40 layers, and it returns each token as a
            vector of 1408 numbers. The predictor used in pretraining is much smaller, with 22M parameters, 12
            layers and vectors of 384 numbers. <Cite id="F03-4">V-JEPA 2 paper, appendix A.3, Table 12</Cite>
          </Box>
          <Box variant="p">
            Masking means removing some tokens before the encoder sees them, so that the model has to predict
            the latents of what was hidden. V-JEPA 2 hides rectangular regions called mask blocks. A mask block is
            a rectangle of the frame that stays hidden for the whole clip, like the grey rectangle over the grasp.
            The released configuration draws two kinds of mask for each clip: 8 mask blocks that each cover 15% of
            the frame area, and 2 mask blocks that each cover 70%.{' '}
            <Cite id="F03-9">vjepa2 pretrain-256px-16f.yaml, mask block</Cite> These settings come from the
            earlier V-JEPA paper, which reports that they hide about 90% of the
            tokens on average. <Cite id="F03-60">V-JEPA paper, section 3.2</Cite> The V-JEPA 2 paper prints no
            ratio of its own. At about 90%, only about <Derived>205</Derived> of the <Derived>2,048</Derived>{' '}
            tokens stay visible. When a mask block covers the gripper and the block in every frame, the model can
            predict the latents of that region only if it knows how grippers and blocks move.
          </Box>
          <Figure
            cites="F03-3 F03-4 F03-11"
            caption={
              <>
                The blue outline follows one tubelet from the stack of frames to its place in the lattice of
                tubelets, then to one token and finally to one latent. The bars at the bottom compare how many
                numbers the clip holds as pixels with how many the encoder returns. The two counts are about the
                same, so the encoder describes the clip in a new form more than it compresses it. The figure is an
                illustration: the frames repeat six still images from a simulated episode of the {ARM}, and the
                shades of the latents are invented.
              </>
            }
          >
            <JepaClip />
          </Figure>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="V-JEPA 2 trains with three networks. The loss updates two of them, and the third is a copy of the encoder that slowly follows the trained one. You will read the training objective, see which weights the loss may change, and work out how slowly the targets move."
          >
            How one V-JEPA 2 training step works
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Pretraining uses video and images that have no actions and no labels. Each training step takes one
            clip, hides most of it, and asks the model for the latents of the hidden part. Three networks take
            part in the step:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>The context encoder</strong>, with weights <M>{String.raw`\theta`}</M>, sees only the
              visible tokens.
            </li>
            <li>
              <strong>The target encoder</strong>, with weights <M>{String.raw`\overline{\theta}`}</M>, is a copy
              of the encoder that sees the whole clip and supplies the target latents.
            </li>
            <li>
              <strong>The predictor</strong>, with weights <M>{String.raw`\phi`}</M>, receives the context
              encoder&apos;s outputs plus one mask token for every hidden position. It returns one vector for
              each hidden position.
            </li>
          </ul>
          <Box variant="p">
            A mask token is a learned placeholder vector. It is tagged with the position it stands for in the
            clip, and it tells the predictor &quot;predict what belongs here&quot;.{' '}
            <Cite id="F03-6">vjepa2 predictor.py, lines 189 to 252</Cite>
          </Box>

          <Box variant="h3">The loss: L1 distance at the hidden positions</Box>
          <Box variant="p">
            The loss measures how far the predictor&apos;s guess is from the target encoder&apos;s latents, at
            the hidden positions only. The formula below uses the paper&apos;s symbols:
          </Box>
          <ul style={LIST}>
            <li>
              <M>{String.raw`x`}</M> is the masked clip, and <M>{String.raw`y`}</M> is the full clip.
            </li>
            <li>
              <M>{String.raw`E_\theta`}</M> is the context encoder, <M>{String.raw`E_{\overline{\theta}}`}</M> is
              the target encoder, and <M>{String.raw`P_\phi`}</M> is the predictor.
            </li>
            <li>
              <M>{String.raw`\Delta_y`}</M> stands for the mask tokens.
            </li>
            <li>
              <M>{String.raw`\text{sg}(\cdot)`}</M> is the stop-gradient. It passes a value through unchanged, but
              training cannot adjust anything that produced the value.
            </li>
            <li>
              The double bars with a subscript 1 are the L1 distance, the same measure that section 4, Learning
              From Demonstrations, used on action chunks. To compute it, subtract the two lists of numbers entry
              by entry, drop the signs and add up the results.
            </li>
          </ul>
          <Formula
            name="V-JEPA 2 pretraining objective"
            tex={String.raw`\begin{aligned} & \underset{\theta,\,\phi,\,\Delta_y}{\text{minimize}} \\ & \quad \lVert P_\phi(\Delta_y, E_\theta(x)) - \text{sg}(E_{\overline{\theta}}(y)) \rVert_1 \end{aligned}`}
            source={<Cite id="F03-2">V-JEPA 2 paper, section 2.1, equation 1</Cite>}
          />
          <Box variant="p">
            Read the formula from the inside out. <M>{String.raw`E_\theta(x)`}</M> is what the model saw: the
            context encoder&apos;s latents for the visible tokens. <M>{String.raw`P_\phi(\Delta_y, \cdot)`}</M>{' '}
            is the predictor&apos;s guess for the hidden positions.{' '}
            <M>{String.raw`\text{sg}(E_{\overline{\theta}}(y))`}</M> is the target. The bars measure the energy
            between the guess and the target. The symbols under &quot;minimize&quot; list what the optimiser may
            change: the context encoder&apos;s weights <M>{String.raw`\theta`}</M>, the predictor&apos;s weights{' '}
            <M>{String.raw`\phi`}</M> and the mask tokens <M>{String.raw`\Delta_y`}</M>. The target
            encoder&apos;s weights <M>{String.raw`\overline{\theta}`}</M> are not in that list, so the loss never
            changes the network that supplies the targets.
          </Box>
          <Box variant="p">
            Here is a small example with made-up latents of four numbers each. The guess is (1, 3, 0, 2), and the
            target is (2, 3, 1, 0). The entries differ by 1, 0, 1 and 2, so the L1 distance is 4. The released
            code takes the mean instead of the sum, which gives 4 / 4 = 1. The code also rescales the target
            latents with a layer normalisation before it compares them, which is a step that equation 1 does not
            show. When the paper and the code differ, the code is what actually trains the model.{' '}
            <Cite id="F03-7">vjepa2 app/vjepa/train.py, lines 429 to 450</Cite>
          </Box>

          <Box variant="h3">The stop-gradient: why the target does not move toward the guess</Box>
          <Box variant="p">
            Training computes, for every weight, how the loss would change if that weight changed slightly. That
            signal is called the gradient, and the optimiser moves each weight in the direction that lowers the
            loss. This loss depends on two encoders. Without a stop-gradient, training would update both of them,
            and the target would move toward the guess at the same time as the guess moves toward the target. The
            stop-gradient tells training to treat the target as a constant. The gradient reaches{' '}
            <M>{String.raw`\phi`}</M> and <M>{String.raw`\theta`}</M> through the guess, and it never reaches{' '}
            <M>{String.raw`\overline{\theta}`}</M>. In the released code, the target encoder runs inside{' '}
            <code>torch.no_grad()</code>, and its weights are marked <code>requires_grad = False</code>.{' '}
            <Cite id="F03-7">vjepa2 app/vjepa/train.py, lines 429 to 450</Cite>{' '}
            <Cite id="F03-8">vjepa2 app/vjepa/train.py, lines 222 to 480</Cite>
          </Box>

          <Box variant="h3">The EMA: how slowly the target encoder follows</Box>
          <Box variant="p">
            If the target encoder never changed, it would keep producing the latents of an untrained network.
            Instead, it follows the context encoder as an EMA (exponential moving average). An EMA is a running
            average in which recent values count most and older values fade out. The speed of the EMA is set by
            the momentum <M>{String.raw`m`}</M>, a number just under 1. V-JEPA 2 keeps <M>{String.raw`m`}</M> at
            0.99925 for the whole training run. After every optimiser step, each weight of the target encoder is
            updated like this:
          </Box>
          <Formula
            name="EMA update of the target encoder"
            tex={String.raw`\overline{\theta} \leftarrow m\,\overline{\theta} + (1 - m)\,\theta`}
            source={<Cite id="F03-8">vjepa2 app/vjepa/train.py, lines 471 to 480</Cite>}
          />
          <Box variant="p">
            The first term, <M>{String.raw`m\,\overline{\theta}`}</M>, keeps almost all of the old target weight.
            The second term, <M>{String.raw`(1 - m)\,\theta`}</M>, mixes in a small fraction of the context
            encoder&apos;s current weight. That fraction is 1 - 0.99925 = 0.00075, which is 0.075%.{' '}
            <Cite id="F03-8">vjepa2 app/vjepa/train.py, lines 471 to 480, and the config&apos;s ema setting</Cite>
          </Box>
          <Box variant="p">
            Here is one weight with made-up values. The target weight is <Toy>0.5000</Toy>, and the context
            encoder&apos;s weight has moved to <Toy>0.9000</Toy>. One update gives 0.99925 x <Toy>0.5000</Toy> +
            0.00075 x <Toy>0.9000</Toy> = <Toy>0.5003</Toy>. So one step closes <Toy>0.0003</Toy> of a gap of{' '}
            <Toy>0.4</Toy>. At this pace, the target encoder is roughly an average of the last 1 / 0.00075 =
            1,333 steps. It needs about <Derived>924</Derived> steps to close half of any gap (
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
                The loss trains the green boxes. The grey box is the target encoder, which only follows the
                context encoder through the EMA. The layout is an illustration: the lattice of tokens is drawn 8 by
                8, coarser than the real one, a real clip hides a larger share of its tokens, the shades of the
                latents are invented, and the EMA step is drawn much larger than 0.075% of the gap.
              </>
            }
          >
            {(step, reduced) => <JepaTrain step={step} reduced={reduced} />}
          </AnimatedFigure>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Collapse is a failure that the training loss does not show, and it comes in two forms. A slow target encoder and a frozen encoder both prevent it, and each one has its own cost."
          >
            Collapse: when the encoder gives every input the same latent
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Suppose the encoder outputs the same vector for every input, for example all zeros. The target
            latents are then all zeros too, the predictor learns to output zeros, and the loss is 0 on every clip.
            A model that predicts pixels cannot take this shortcut, because its targets are the camera images and
            it cannot change them. A JEPA produces its own targets, so it can. The V-JEPA authors write that a
            plain regression loss of this kind &quot;would admit a trivial solution, where the encoder outputs a constant
            representation, regardless of its input&quot;. The LeWorldModel authors call preventing this collapse
            &quot;one of the central challenges in training JEPA models&quot;.{' '}
            <Cite id="F03-63">V-JEPA paper, section 3.1, and LeWorldModel paper, section 1</Cite>
          </Box>
          <Box variant="p">
            Collapse comes in two forms, complete and dimensional.{' '}
            <Cite id="F03-64">LeJEPA paper, section 2</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Complete collapse.</strong> Every input lands on nearly the same point, so the latents
              cannot tell one scene from another.
            </li>
            <li>
              <strong>Dimensional collapse.</strong> The latents still differ, but they all lie in a thin slice of
              the space. In a V-JEPA 2 vector of 1408 numbers, most of the numbers would then carry no
              information. <Cite id="F03-64">LeJEPA paper, section 2</Cite>
            </li>
          </ul>
          <Box variant="p">
            The training loss shows neither form. It measures how well the guess agrees with the target, and
            collapsed latents agree perfectly, so a low loss does not prove that the latents are useful. Both
            forms are defined by how the latents of a batch are spread: all on nearly one point, or all inside a
            thin slice. So each method that prevents collapse does one of two things: it keeps the latents of a
            batch spread out, or it fixes the targets so that they cannot collapse.
          </Box>
          <Figure
            cites="F03-63 F03-64"
            caption={
              <>
                Each dot is the latent of one input, drawn in two of its dimensions. The figure is an
                illustration, not a measurement.
              </>
            }
          >
            <CollapseDiagram />
          </Figure>

          <Box variant="h3">Preventing collapse with a slow target encoder</Box>
          <Box variant="p">
            The V-JEPA 2 training step described above is the first method. For the shortcut to work, the guess
            and the target have to drift to the same constant value together. Because of the stop-gradient, no
            gradient pulls <M>{String.raw`\overline{\theta}`}</M> toward the guess. Because of the EMA, each step
            moves the target encoder only 0.075% of the way toward the context encoder. So from one step to the
            next, the targets stay almost still, much as a camera&apos;s pixels do for a model that predicts
            pixels.
          </Box>
          <Box variant="p">
            Why this is enough to prevent collapse is not proven. The V-JEPA authors present their explanation as
            a hypothesis: the slow target lets the predictor change faster than the encoder and stay close to its
            best possible setting, and that prevents collapse.{' '}
            <Cite id="F03-65">V-JEPA paper, section 3.1</Cite> The LeWorldModel authors object that the
            stop-gradient and the EMA together do not &quot;in general correspond to the minimization of a
            well-defined objective&quot;. <Cite id="F03-66">LeWorldModel paper, section 2</Cite> So this method
            costs you a second encoder in memory, and you rely on its track record in practice more than on a
            proof.
          </Box>

          <Box variant="h3">Preventing collapse with a frozen encoder</Box>
          <Box variant="p">
            The simplest method is to stop training the encoder. If the encoder&apos;s weights do not change
            while the predictor trains, the targets are fixed, just as pixels are. V-JEPA 2-AC and RoboJEPA work
            this way, on top of encoders that were pretrained beforehand. The cost is that the latent contains
            only what pretraining kept, and no amount of robot data can change it. The V-JEPA 2 authors write that
            such a world model is &quot;inherently limited by the state information encoded in the learned
            representation space&quot;.{' '}
            <Cite id="F03-71">LeWorldModel paper, section 2, and V-JEPA 2 paper, section 5</Cite>{' '}
            <Cite id="F03-75">RoboJEPA paper, abstract and section 2</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The third method trains the encoder and the predictor together, with no second copy of the encoder, and adds a loss term that keeps the latents spread out. Terms built on variance and covariance need several loss weights, while the single term that LeWorldModel uses needs one. When you train LeWorldModel, two settings matter: that weight and the width of the latent."
          >
            Preventing collapse with a loss term that keeps the latents spread out
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Methods of this kind keep the encoder trainable and add a measure of how spread out the latents are
            to the loss. The oldest of them is contrastive learning. It adds a loss term that pushes apart the latents of different
            inputs, which are called negatives. The position paper that defined JEPA argues against contrastive
            learning, because the number of negatives you need grows with the dimension of the latent.{' '}
            <Cite id="F03-70">I-JEPA paper, section 2, and the position paper, section 4.3</Cite> The two methods
            that came after it measure the spread of the batch directly.
          </Box>

          <Box variant="h3">Variance and covariance terms</Box>
          <Box variant="p">
            Picture a batch of latents as a table, with one row per input and one column per dimension. A column
            that holds the same value in every row has collapsed. Two columns that always move together carry the
            same information, as if one column were stored twice. Two statistics measure these two cases:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Variance.</strong> The variance of a column measures how far its values spread around their
              average across the batch. It is 0 when every row holds the same value. The standard deviation is
              the square root of the variance.
            </li>
            <li>
              <strong>Covariance.</strong> The covariance of two columns measures whether they rise and fall
              together. It is far from 0 when one column follows the other. It is 0 when high values of one
              column come equally often with high and low values of the other.
            </li>
          </ul>
          <Box variant="p">
            VICReg is a method for training image encoders, published in 2022. Its name comes from its three loss
            terms: variance, invariance and covariance. The invariance term pulls together latents that should
            match, as a JEPA&apos;s guess and its target should. The other two terms turn the two statistics into penalties. The variance term grows when the
            standard deviation of any column falls below a threshold, which prevents complete collapse. The
            covariance term grows with the covariance between any two different columns, which prevents
            dimensional collapse. <Cite id="F03-67">VICReg paper, abstract and equation 6</Cite>
          </Box>
          <Box variant="p">
            The cost of this method is the tuning it needs. PLDM is a JEPA world model that trains its encoder with variance
            and covariance terms. The LeWorldModel authors count seven terms in its loss, with six coefficients to
            tune, and they say that this makes training unstable and tuning harder.{' '}
            <Cite id="F03-68">LeWorldModel paper, abstract and section 4.1</Cite>
          </Box>
          <ExpandableSection headerText="VICReg's loss term by term, with three example batches">
            <SpaceBetween size="s">
              <Box variant="p">The VICReg loss uses these symbols:</Box>
              <ul style={LIST}>
                <li>
                  <M>{String.raw`Z`}</M> and <M>{String.raw`Z'`}</M> are two batches of latents that should match
                  row by row, as a JEPA&apos;s guesses and targets should.
                </li>
                <li>
                  <M>{String.raw`s`}</M> is the invariance term: the mean squared distance between matching rows.
                </li>
                <li>
                  <M>{String.raw`v`}</M> is the variance term. It is zero while the standard deviation of every
                  column stays above the threshold, and it grows when one falls below it.
                </li>
                <li>
                  <M>{String.raw`c`}</M> is the covariance term. It grows with the covariance between any two
                  different columns.
                </li>
                <li>
                  <M>{String.raw`\lambda`}</M>, <M>{String.raw`\mu`}</M> and <M>{String.raw`\nu`}</M> are the three
                  weights, and <M>{String.raw`\ell`}</M> is the loss for the pair of batches.
                </li>
              </ul>
              <Formula
                name="VICReg loss"
                tex={String.raw`\begin{aligned} \ell(Z, Z') = {} & \lambda\, s(Z, Z') \\ & + \mu\,[v(Z) + v(Z')] \\ & + \nu\,[c(Z) + c(Z')] \end{aligned}`}
                source={<Cite id="F03-67">VICReg paper, abstract and equation 6</Cite>}
              />
              <Box variant="p">
                The term <M>{String.raw`s`}</M> pulls matching latents together, and on its own it allows the
                collapse shortcut. The term <M>{String.raw`v`}</M> prevents complete collapse, because a constant
                column has a standard deviation of 0. The term <M>{String.raw`c`}</M> prevents dimensional
                collapse, because columns that move together have a high covariance.
              </Box>
              <Box variant="p">Here are three made-up batches, each with four latents of two numbers:</Box>
              <ul style={LIST}>
                <li>
                  In (3, 3), (3, 3), (3, 3), (3, 3), neither column varies, so <M>{String.raw`v`}</M> is large.
                </li>
                <li>
                  In (1, 1), (2, 2), (3, 3), (4, 4), both columns vary, but the second column copies the first, so{' '}
                  <M>{String.raw`c`}</M> is large.
                </li>
                <li>
                  In (1, 2), (2, 4), (3, 1), (4, 3), both columns vary and their covariance is 0, so neither term
                  adds a penalty.
                </li>
              </ul>
              <Box variant="p">
                To check the last case, subtract each column&apos;s average (<Toy>2.5</Toy>) from its values,
                multiply the two results row by row, and add them up: <Toy>0.75 - 0.75 - 0.75 + 0.75</Toy> = 0.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Box variant="h3">SIGReg: one term for the whole distribution of latents</Box>
          <Box variant="p">
            SIGReg (Sketched Isotropic Gaussian Regularization) replaces the separate variance and covariance
            terms with a single target distribution. It pushes the batch&apos;s cloud of latents toward an
            isotropic Gaussian. An isotropic Gaussian is a round, bell-shaped cloud with the same spread in every
            direction and no correlation between dimensions. <Cite id="F03-69">LeJEPA paper, abstract</Cite> In
            the table picture, that means every column has variance 1 and every pair of columns has covariance 0.
            A cloud collapsed to a single point has variance 0, and a cloud flattened into a thin slice has
            columns that move together. So by those two definitions, one term covers both forms of collapse.
          </Box>
          <Box variant="p">
            LeWorldModel (LeWM) is a world model of about 15M parameters that uses SIGReg. It has a single
            encoder, trained together with the predictor. The encoder turns each frame into one vector of 192
            numbers, while V-JEPA 2 produces a grid of vectors for each frame. LeWorldModel has no target copy of
            the encoder and no stop-gradient, so it keeps one network fewer in memory than V-JEPA 2.{' '}
            <Cite id="F03-31">LeWorldModel paper, abstract</Cite>{' '}
            <Cite id="F03-32">LeWorldModel paper, section 3.1</Cite>{' '}
            <Cite id="F03-35">le-wm train.py, lines 27 to 41</Cite>
          </Box>
          <Box variant="p">
            Checking the distribution of a cloud directly in that many dimensions is expensive, so SIGReg checks
            one-dimensional projections of it instead. It projects every latent in the batch onto a set of random
            directions. On each direction, the projection gives one number per latent, like the shadow that the
            cloud casts on a line. SIGReg then tests whether each list of numbers looks like samples from a
            standard Gaussian, a bell curve with mean 0 and variance 1. If every projection is Gaussian, the whole
            cloud is Gaussian too, by a result called the Cramer-Wold theorem.{' '}
            <Cite id="F03-39">LeWorldModel paper, section 3.1</Cite>
          </Box>
          <Box variant="p">LeWorldModel&apos;s loss adds that test to a prediction error. The formula uses these symbols:</Box>
          <ul style={LIST}>
            <li>
              <M>{String.raw`z_t`}</M> is the latent of frame <M>{String.raw`t`}</M>, and <M>{String.raw`a_t`}</M>{' '}
              is the action taken at that frame.
            </li>
            <li>
              <M>{String.raw`\mathrm{pred}_\phi`}</M> is the predictor, and <M>{String.raw`\hat{z}_{t+1}`}</M> is
              its guess for the latent of the next frame.
            </li>
            <li>
              <M>{String.raw`Z`}</M> is all the latents in the batch, and <M>{String.raw`\lambda`}</M> is a single
              weight.
            </li>
            <li>
              The double bars with two 2s are the squared L2 distance: subtract entry by entry, square each
              difference, and add up the results.
            </li>
          </ul>
          <Formula
            name="LeWorldModel training objective"
            tex={String.raw`\begin{aligned} \hat{z}_{t+1} &= \mathrm{pred}_\phi(z_t, a_t) \\ \mathcal{L}_{\mathrm{pred}} &\triangleq \lVert \hat{z}_{t+1} - z_{t+1} \rVert_2^2 \\ \mathcal{L}_{\mathrm{LeWM}} &\triangleq \mathcal{L}_{\mathrm{pred}} + \lambda\,\mathrm{SIGReg}(Z) \end{aligned}`}
            source={<Cite id="F03-36">LeWorldModel paper, section 3.1, equations 1 and 3</Cite>}
          />
          <Box variant="p">
            <M>{String.raw`\mathcal{L}_{\mathrm{pred}}`}</M> is the usual JEPA prediction term: the predicted next
            latent should match the actual next latent. On its own, this term lets the encoder collapse.{' '}
            <M>{String.raw`\mathrm{SIGReg}(Z)`}</M> is large when the batch&apos;s latents fail the Gaussian test
            along the sampled directions, and a collapsed batch fails it badly. <M>{String.raw`\lambda`}</M> sets
            how much the second term counts against the first, and it is the only loss weight you tune.
          </Box>
          <Box variant="p">
            The published results suggest that <M>{String.raw`\lambda`}</M> is easy to set. The paper uses{' '}
            <M>{String.raw`\lambda`}</M> = 0.1 with 1,024 random directions. The released training configuration
            sets 0.09, with 1,024 projections, each tested at 17 points. On Push-T, a simulated 2D pushing task,
            the authors report a success rate above 80% for any <M>{String.raw`\lambda`}</M> between 0.01 and 0.2.{' '}
            <Cite id="F03-36">LeWorldModel paper, section 3.1</Cite>{' '}
            <Cite id="F03-37">le-wm config/train/lewm.yaml, lines 17 to 43</Cite>{' '}
            <Cite id="F03-46">LeWorldModel paper, appendix G</Cite> The width of the latent, the number of values
            in each latent vector, needs more care. The authors report that performance drops when the width falls
            below about 184, and the released width of 192 is just above that point.{' '}
            <Cite id="F03-32">LeWorldModel paper, section 3.1</Cite>
          </Box>
          <Box variant="p">
            On Push-T, over three seeds, the LeWorldModel authors report a success rate of 96.0% for their model.
            They report 92.0% for DINO-WM, a latent world model built on a frozen pretrained image encoder, and
            78.0% for PLDM. All of this evidence comes from simulation: all four of the paper&apos;s tasks are
            simulated, and the paper reports no result on a real robot. On the task closest to the {ARM}&apos;s
            job, in which a simulated arm picks up a cube and places it at a target, DINO-WM is slightly ahead.{' '}
            <Cite id="F03-42">LeWorldModel paper, section 4.1 and appendix Table 5</Cite> The authors also state
            when SIGReg works less well: in very simple environments whose data has little variety.{' '}
            <Cite id="F03-45">LeWorldModel paper, section 6</Cite>
          </Box>
          <ExpandableSection headerText="How SIGReg tests one direction, as written in the released code">
            <SpaceBetween size="s">
              <Box variant="p">
                Take one random direction, and let <M>{String.raw`p_n`}</M> be the projection of the{' '}
                <M>{String.raw`n`}</M>-th latent of the batch onto it. The test wraps each projection around a
                circle. The value <M>{String.raw`p_n`}</M> becomes the point at angle <M>{String.raw`t\,p_n`}</M>,
                with coordinates <M>{String.raw`\cos(t\,p_n)`}</M> and <M>{String.raw`\sin(t\,p_n)`}</M>. Here{' '}
                <M>{String.raw`t`}</M> is a test value that the code chooses; in this formula it is no longer a
                frame index.
              </Box>
              <Box variant="p">
                The average of these points over the batch depends on how the projections are spread. Seen as a
                function of <M>{String.raw`t`}</M>, that average is a fingerprint of their distribution, called the
                characteristic function. For a standard Gaussian, the fingerprint is known in advance:{' '}
                <M>{String.raw`e^{-t^2/2}`}</M> on the cosine axis and 0 on the sine axis. The error at one value
                of <M>{String.raw`t`}</M> is the squared distance between the batch&apos;s average point and that
                known point:
              </Box>
              <Formula
                name="SIGReg error for one direction at one test value"
                tex={String.raw`\begin{aligned} & \big(\operatorname{mean}_n \cos(t\,p_n) - e^{-t^2/2}\big)^2 \\ & + \big(\operatorname{mean}_n \sin(t\,p_n)\big)^2 \end{aligned}`}
                source={<Cite id="F03-38">le-wm module.py, lines 10 to 36</Cite>}
              />
              <Box variant="p">
                The first bracket is the error on the cosine axis, and the second is the error on the sine axis. A
                small <M>{String.raw`t`}</M> wraps the projections loosely around the circle and tests their
                overall spread. A larger <M>{String.raw`t`}</M> wraps them tightly and tests finer details of the
                distribution. The code evaluates this error at 17 values of <M>{String.raw`t`}</M> from 0 to 3,
                weights the results and adds them up, scales the sum by the batch size, and averages over the
                1,024 directions. <Cite id="F03-38">le-wm module.py, lines 10 to 36</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A video encoder becomes a world model for a robot arm when a predictor learns what actions do. V-JEPA 2-AC is such a predictor, trained on top of a frozen V-JEPA 2 encoder. It learns from real frames and also from its own earlier predictions."
          >
            Adding actions to turn a video model into a world model
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A world model takes an action as one of its inputs, and masked pretraining has no actions. V-JEPA 2
            adds them in a second training stage. Stage one is the masked pretraining described above, on more
            than 1 million hours of internet video. Stage two freezes that encoder and trains a new predictor on
            less than 62 hours of robot video. This predictor is called V-JEPA 2-AC, where AC stands for
            action-conditioned. The large amount of video teaches the model how the world moves, and the small
            amount of robot data teaches it what actions do. <Cite id="F03-1">V-JEPA 2 paper, abstract</Cite>
          </Box>
          <Box variant="p">
            The new predictor is a transformer of about 300M parameters, with 24 layers and vectors of 1024
            numbers. <Cite id="F03-14">V-JEPA 2 paper, section 3.1</Cite> For each time step, which is one
            frame, the predictor reads three inputs.{' '}
            <Cite id="F03-15">V-JEPA 2 paper, section 3.1</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>An action token.</strong> The action is 7 numbers: the change in the gripper&apos;s pose,
              meaning its position, orientation and opening, between this frame and the next.
            </li>
            <li>
              <strong>A state token.</strong> The state is 7 numbers for the gripper&apos;s current pose: 3 for its
              position, 3 for its orientation and 1 for how far it is open.
            </li>
            <li>
              <strong>The frame&apos;s latent.</strong> This is a 16 x 16 grid of vectors from the frozen encoder,
              with 1408 numbers in each vector. <Cite id="F03-15">V-JEPA 2 paper, section 3.1</Cite>
            </li>
          </ul>
          <Box variant="p">
            The {ARM} records six joint targets instead, which is a different action space (section 3, The Robot
            as a Computer). So the {ARM}&apos;s episodes do not fit this predictor as they are recorded.
          </Box>
          <Box variant="p">
            In total, the predictor reads 1 + 1 + 256 = 258 tokens per time step, and it outputs the predicted 16
            x 16 grid for the next frame. These 258 tokens are the input to one predictor pass, and a planner runs
            thousands of such passes for each action.{' '}
            <Cite id="F03-16">vjepa2 ac_predictor.py, lines 141 to 153</Cite>
          </Box>
          <Box variant="p">
            Training compares the predicted grid with the frozen encoder&apos;s grid for the real next frame,
            again with the L1 distance. In this first loss term, every guess starts from the true latents of the
            frames before it. This way of training is called teacher forcing.{' '}
            <Cite id="F11-100">V-JEPA 2 paper, section 3.1, equation 2</Cite> A planner, however, has true latents
            only for the current frame. For every step after that, the predictor has to build on its own previous
            output, and its errors accumulate from step to step.{' '}
            <Cite id="F03-28">V-JEPA 2 paper, section 4.3</Cite> A run of the predictor on its own outputs over
            several steps is called a rollout. V-JEPA 2-AC adds a second loss term, the rollout loss, that trains
            the predictor for this case.
          </Box>
          <Box variant="p">The rollout loss uses these symbols:</Box>
          <ul style={LIST}>
            <li>
              <M>{String.raw`z_1`}</M> is the latent of a clip&apos;s first frame, and <M>{String.raw`s_1`}</M> is
              the gripper&apos;s pose in that frame.
            </li>
            <li>
              <M>{String.raw`a_{1:T}`}</M> is the <M>{String.raw`T`}</M> recorded actions that followed. Here{' '}
              <M>T</M> is the length of the rollout, and in practice <M>{String.raw`T = 2`}</M>.
            </li>
            <li>
              <M>{String.raw`P_\phi(a_{1:T}, s_1, z_1)`}</M> is the predictor run <M>{String.raw`T`}</M> times from
              that start. Each run after the first takes its own previous output as input.
            </li>
            <li>
              <M>{String.raw`z_{T+1}`}</M> is the encoder&apos;s latent of the frame that the robot actually
              reached.
            </li>
            <li>
              <M>{String.raw`\mathcal{L}_{\text{teacher-forcing}}`}</M> is the teacher-forcing loss described
              above, and <M>{String.raw`\phi`}</M> is the predictor&apos;s weights.
            </li>
          </ul>
          <Formula
            name="V-JEPA 2-AC training loss: rollout term and total"
            tex={String.raw`\begin{aligned} & \mathcal{L}_{\text{rollout}}(\phi) \coloneqq \\ & \quad \lVert P_\phi(a_{1:T}, s_1, z_1) - z_{T+1} \rVert_1 \\[6pt] & L(\phi) \coloneqq \mathcal{L}_{\text{teacher-forcing}}(\phi) \\ & \quad + \mathcal{L}_{\text{rollout}}(\phi) \end{aligned}`}
            source={<Cite id="F03-18">V-JEPA 2 paper, section 3.1, equations 3 and 4</Cite>}
          />
          <Box variant="p">
            The first line is the error after an imagined rollout. Only the first latent is real, and the final
            prediction is compared with where the robot actually ended up. The second line adds the two errors
            with equal weight. The teacher-forcing term teaches single steps from true inputs, and the rollout
            term teaches the predictor to stay accurate when it runs on its own outputs. The{' '}
            <M>{String.raw`(\phi)`}</M> after each loss says what is trained: the predictor alone. With{' '}
            <M>{String.raw`T = 2`}</M>, the gradient passes through one repeated step of the predictor.{' '}
            <Cite id="F11-102">V-JEPA 2 paper, section 3.1, text around equations 3 and 4</Cite>
          </Box>
          <Box variant="p">
            A predictor trained on a distance has one known limit. It gives one output for each input, so when two
            different futures are both plausible, it predicts something in between them. Section 4, Learning From
            Demonstrations, describes the same fault in regression on actions. A peer-reviewed study of JEPA world
            models describes the limit for the mean squared error (MSE) loss that its models use: &quot;the MSE
            loss learns the conditional mean of potentially genuinely multi-modal futures&quot;. The study&apos;s
            authors add that three things reduce the effect in their benchmarks: the dynamics are deterministic,
            the latent leaves out variation that the task does not need, and replanning from the real camera frame
            lets the plan tolerate prediction errors. <Cite id="F03-110">JEPA-WMs paper, section 7</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A JEPA planner turns a goal photo into a motor command by searching over candidate actions. You can estimate the cost of that search before you look at the reported seconds: it is samples x iterations x horizon passes of the predictor."
          >
            Planning: choosing an action by searching with the predictor
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A predictor answers the question &quot;if I do this, what will the latent be?&quot;. To act, the
            robot also needs a planner that asks the questions, and the planner needs a goal. Here the goal is a
            picture: {GOAL_PHOTO}. The encoder turns this picture into a goal latent. Planning then becomes a
            search for the actions whose predicted latent ends up closest to the goal latent.
          </Box>
          <Box variant="p">The planning objective uses these symbols:</Box>
          <ul style={LIST}>
            <li>
              <M>{String.raw`z_k`}</M> is the latent of the current frame <M>{String.raw`k`}</M>, and{' '}
              <M>{String.raw`s_k`}</M> is the gripper&apos;s current pose.
            </li>
            <li>
              <M>{String.raw`z_g`}</M> is the goal latent.
            </li>
            <li>
              <M>{String.raw`\hat{a}_{1:T}`}</M> is a candidate sequence of <M>{String.raw`T`}</M> actions. Here{' '}
              <M>{String.raw`T`}</M> has a new meaning: it is the planning horizon, the number of steps the
              planner looks ahead.
            </li>
            <li>
              <M>{String.raw`P(\hat{a}_{1:T}; s_k, z_k)`}</M> is the predictor run <M>{String.raw`T`}</M> times
              from the present, each time on its own previous output.
            </li>
            <li>
              The energy <M>{String.raw`\mathcal{E}`}</M> is the cost of a candidate. The plan{' '}
              <M>{String.raw`(a^\star_i)_{i \in [T]}`}</M>, which is the actions <M>{String.raw`a^\star_1`}</M> to{' '}
              <M>{String.raw`a^\star_T`}</M>, is the candidate with the lowest energy.
            </li>
          </ul>
          <Formula
            name="V-JEPA 2-AC planning objective"
            tex={String.raw`\begin{aligned} & \mathcal{E}(\hat{a}_{1:T};\ z_k, s_k, z_g) \coloneqq \\ & \quad \lVert P(\hat{a}_{1:T}; s_k, z_k) - z_g \rVert_1 \\[6pt] & (a^\star_i)_{i \in [T]} \coloneqq \\ & \quad \underset{\hat{a}_{1:T}}{\text{argmin}}\ \mathcal{E}(\hat{a}_{1:T};\ z_k, s_k, z_g) \end{aligned}`}
            source={<Cite id="F03-23">V-JEPA 2 paper, section 3.2, equation 5</Cite>}
          />
          <Box variant="p">
            In the first line, the left term inside the bars is the imagined future for this candidate, and the
            right term is where you want to be. The L1 distance from training is reused here as a score. A low
            energy means that the candidate is predicted to make the scene look like the goal picture. The second
            line is the search itself: argmin means &quot;the candidate that makes this value smallest&quot;. No
            formula gives that candidate directly, so the authors approximate the search with one loop inside
            another. <Cite id="F11-101">V-JEPA 2 paper, section 3.2 and Figure 7</Cite>
          </Box>
          <Box variant="p">
            The outer loop is MPC (model-predictive control). MPC is the standard way to act with a model whose
            predictions are accurate only a short way ahead. You plan a sequence of actions through the model,
            execute the first part of it, read the camera again, and plan again from the real frame. How much of
            the plan you execute before planning again is a setting, and the three planners in this section set
            it differently:
          </Box>
          <ul style={LIST}>
            <li>V-JEPA 2-AC executes 1 action of a 1-step plan.</li>
            <li>RoboJEPA, on a real arm, executes 2 actions of a 5-step plan.</li>
            <li>LeWorldModel executes all 5 action blocks of a 5-step plan.</li>
          </ul>
          <Box variant="p">
            Planning again sooner corrects the model&apos;s errors sooner, but you pay for the search again each
            time.{' '}
            <Cite id="F03-112">V-JEPA 2 paper, section 3.2, RoboJEPA paper, Table 13, and LeWorldModel paper, appendix D</Cite>
          </Box>
          <Box variant="p">
            The inner loop is CEM (the cross-entropy method). CEM is a search that needs only forward passes of the
            predictor and no gradient, so it suits a cost that you can evaluate but cannot solve directly. It
            keeps a sampling distribution over action sequences: a Gaussian with a mean and a spread. Each round,
            called an iteration, repeats four steps:
          </Box>
          <ol style={LIST}>
            <li>Sample a pool of candidates from the Gaussian.</li>
            <li>Run each candidate through the predictor and score it.</li>
            <li>Keep the few candidates with the lowest cost. These candidates are called the elites.</li>
            <li>Set the mean and the spread of the Gaussian to those of the elites.</li>
          </ol>
          <Box variant="p">
            After the last iteration, the mean of the Gaussian is the plan.{' '}
            <Cite id="F03-113">LeWorldModel paper, appendix A, Algorithm 2</Cite>
          </Box>
          <Box variant="p">
            Here is one iteration with made-up numbers. A real action has more than one number, but this example
            uses one. The block sits <Toy>10</Toy> cm to the left of the gripper, and the planner searches over a
            single number: the sideways move in cm, negative for left. The Gaussian starts with mean <Toy>0</Toy>{' '}
            and spread <Toy>5</Toy>.
          </Box>
          <ol style={LIST}>
            <li>
              Sample eight candidates: <Toy>+4, -6, +1, -8, -3, +7, -7, +2</Toy>.
            </li>
            <li>
              Predict the result of each candidate and score it. In this example, the energy is the distance that
              remains between the gripper and the block: <Toy>14, 4, 11, 2, 7, 17, 3, 12</Toy>.
            </li>
            <li>
              Keep the three candidates with the lowest energy: <Toy>-8, -7 and -6</Toy>, with energies{' '}
              <Toy>2, 3 and 4</Toy>.
            </li>
            <li>
              Refit the Gaussian: the mean of the three is <Toy>(-8 - 7 - 6) / 3 = -7</Toy>, and their sample
              standard deviation is <Toy>1</Toy>.
            </li>
          </ol>
          <Box variant="p">
            The next iteration samples around <Toy>-7</Toy> with spread <Toy>1</Toy>, where this one sampled
            around <Toy>0</Toy> with spread <Toy>5</Toy>. Each iteration moves the mean toward the block and
            shrinks the spread. Each iteration needs one predictor pass for each candidate and for each step of
            the horizon.
          </Box>
          <Box variant="p">
            The V-JEPA 2 robot experiments run this loop with 800 samples per iteration and 10 iterations, keep the
            top 10 each time, and use a horizon of 1. The cost is the product samples x iterations x horizon: 800
            x 10 x 1 = 8,000 predictor passes for every action the arm takes, run as 10 batches of 800. The
            authors report 16 seconds for this on one NVIDIA RTX 4090. That works out to 16 s / 8,000 = 2 ms per
            pass. <Cite id="F03-24">V-JEPA 2 paper, appendix B.2</Cite>{' '}
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
                The figure shows the same search in two views. In the latent-space view, each dot is the predicted
                end point of one candidate, and nothing moves on the table until step 8. The action panel draws the
                example iteration from the text. The figure is an illustration, not a measurement: the positions
                are drawn by hand, a real latent has far more than two dimensions, and the real planner samples 800
                candidates where this figure draws a few dozen.
              </>
            }
          >
            {(step, reduced) => <JepaCem step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            For a pick-and-place task, the cost grows again. One goal image is not enough for it, so the authors
            give the model three goal images in turn: the object grasped, the object near the target, and the
            object placed. They switch goals on a fixed schedule of 4, 10 and 4 time steps. That is 4 + 10 + 4 =
            18 planned actions, which take 18 x 8,000 = 144,000 predictor passes. At the authors&apos; RTX 4090
            rate, that is 18 x 16 s = 288 s, or 4.8 minutes of GPU time spent deciding what to do.{' '}
            <Cite id="F03-27">V-JEPA 2 paper, section 4.2, and our arithmetic</Cite>{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>
          </Box>
          <Box variant="p">
            In exchange for that wait, you can set the task with a picture at run time. The predictor was trained
            with no reward, no task label and no success flag.{' '}
            <Cite id="F03-20">V-JEPA 2 paper, section 3.1</Cite> The authors tested it on two Franka research arms
            in labs that do not appear in the training data, with 10 trials per task. They report that
            pick-and-place succeeded 80% of the time with a cup and 65% with a box, and that grasping succeeded
            65% of the time with the cup and 25% with the box.{' '}
            <Cite id="F03-26">V-JEPA 2 paper, section 4.2, Table 2</Cite>
          </Box>

          <Box variant="h3">What a better encoder, a longer horizon and a larger predictor change</Box>
          <Box variant="p">
            When the encoder is frozen, the planner can see only what the encoder kept. V-JEPA 2.1, released on 2026-03-16,
            changes the pretraining recipe in two ways: the visible tokens also contribute to the loss, and the
            loss is applied at several depths of the encoder. It also adds a larger encoder, ViT-G, with 2B
            parameters, compared with 1B for ViT-g. <Cite id="F03-72">vjepa2 README, V-JEPA 2.1 release notes</Cite>{' '}
            With the same 300M predictor recipe and the same 800 x 10 x 1 plan, the V-JEPA 2.1 authors report cup
            grasping at 70% against 60% for V-JEPA 2, over 10 trials. They credit features that &quot;better encode
            depth information&quot;. The difference is one trial out of ten. The 60% is the newer paper&apos;s
            own figure for V-JEPA 2, while the V-JEPA 2 paper itself reported 65%.{' '}
            <Cite id="F03-73">V-JEPA 2.1 paper, Table 6</Cite>{' '}
            <Cite id="F03-111">V-JEPA 2.1 paper, Figure 8 caption</Cite>
          </Box>
          <Box variant="p">
            The same table also tests a longer horizon. At a horizon of 8, with 300 samples and 15 iterations,
            grasp success is 80%, against 70% for the 1-step plan. That is one more success in ten trials, for 300
            x 15 x 8 = 36,000 passes. <Cite id="F03-73">V-JEPA 2.1 paper, Table 6</Cite> The horizon cannot grow
            without limit. The V-JEPA 2 authors give two reasons: prediction errors accumulate along the rollout,
            and the number of possible action sequences grows exponentially with the horizon.{' '}
            <Cite id="F03-28">V-JEPA 2 paper, section 4.3</Cite>
          </Box>
          <Box variant="p">
            RoboJEPA, dated 7 Oct 2026, keeps the V-JEPA 2.1 encoder frozen and scales up the predictor instead.
            Its predictors range from 22M to 8B parameters and are trained on 15,022 hours of robot video, of which
            6,692 hours include synchronised actions. <Cite id="F03-75">RoboJEPA paper, abstract and section 2</Cite>{' '}
            <Cite id="F03-76">RoboJEPA paper, section 2.1</Cite> The authors say that the curves they fitted to
            their scaling results &quot;already sit close to data saturation&quot;. In their view, further gains
            will likely depend more on more varied robot data than on extra parameters.{' '}
            <Cite id="F03-79">RoboJEPA paper, section 6</Cite>
          </Box>
          <Box variant="p">
            RoboJEPA also plans toward a single goal image, where V-JEPA 2 needed three for pick-and-place. On that
            full task, latent planning still falls behind a trained policy. On a Franka arm, the authors report
            success rates for the 8B model of 67% on grasping, 50% on lifting an object and 27% on pick-and-place.
            As a reference, they give pi0.5, a policy that takes its task as a text instruction. It scores 5%, 0%
            and 53% on the same three tasks. So pi0.5 scores below the planner on the two short skills, and about
            twice the planner&apos;s rate on the full task. The authors call such figures &quot;contextual
            references rather than directly comparable baselines&quot;.{' '}
            <Cite id="F03-78">RoboJEPA paper, section 4.3 and Table 3</Cite>{' '}
            <Cite id="F03-77">RoboJEPA paper, section 2.2</Cite>
          </Box>

          <Box variant="h3">Comparing the cost of different planners</Box>
          <Box variant="p">
            You can work out the pass count of every planner in this family with the same product, but the
            reported seconds do not follow the count. LeWorldModel plans Push-T with 300 x 30 x 5 = 45,000 passes,
            more than five times V-JEPA 2-AC&apos;s 8,000. Yet its authors report a full plan in 0.98 s, without
            saying which of their two planner settings they timed (the table below lists both). The difference
            comes from the size of one pass. V-JEPA 2-AC runs a 300M transformer over 258 tokens per frame, while LeWorldModel
            runs a 10M transformer over 1 to 3 tokens. So when you compare pass counts, also look at the
            predictor&apos;s size and the number of tokens it reads per step.{' '}
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
                  <th style={TH}>Time reported by the authors, and the GPU</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>V-JEPA 2-AC</td>
                  <td style={TD}>800 x 10 x 1 = 8,000 passes</td>
                  <td style={TD}>
                    16 seconds per action on one NVIDIA RTX 4090 in the V-JEPA 2 paper. 3 seconds per action on a
                    single NVIDIA A100, for the same settings, in the V-JEPA 2.1 paper.
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
                  <td style={TD}>14 seconds per action on a single A100.</td>
                  <td style={TD}>
                    <Cite id="F03-73">V-JEPA 2.1 paper, Table 6</Cite>{' '}
                    <Cite id="F03-74">V-JEPA 2.1 paper, Table 6 caption</Cite>{' '}
                    <Cite id="F03-115">our arithmetic, predictor passes per decision</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>LeWorldModel</td>
                  <td style={TD}>
                    300 x 30 x 5 = 45,000 passes on Push-T. Its other tasks run 10 iterations, which gives 15,000
                    passes.
                  </td>
                  <td style={TD}>
                    0.98 s for a full plan, against 47 s for DINO-WM. The paper does not name the GPU, and it does
                    not say which of the two settings was timed.
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
                    4,096 x 10 x 5 = 204,800 passes. The first plan uses 15 iterations, which gives 307,200
                    passes.
                  </td>
                  <td style={TD}>
                    The paper prints no time in seconds. The authors run the planner on several GPUs at once and
                    describe it as &quot;not real-time&quot; and as taking &quot;several seconds&quot;.
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
                Each bar shows samples x iterations x horizon for one published planner. The axis is logarithmic,
                so the length of each segment shows the size of its factor, and the three segments together end at
                the total. We computed the counts from each paper&apos;s settings. The times are the authors&apos;
                own, each measured on its own GPU and reported in its own paper, so they cannot be compared
                directly, either across rows or between the two times in the first row.
              </>
            }
          >
            <JepaPasses />
          </Figure>
          <Box variant="p">
            When you quote a planning time, always give the model, the GPU and the paper with it. The same 800 x
            10 x 1 plan takes 16 seconds on the RTX 4090 in the 2025 paper and 3 seconds on a single A100 in the
            2026 paper. That is 2 ms per pass in the first case and 3 s / 8,000 = 0.375 ms in the second, and
            neither paper explains the difference.{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>{' '}
            <Cite id="F03-74">V-JEPA 2.1 paper, Table 6</Cite>{' '}
            <Cite id="F03-118">our arithmetic, time per candidate</Cite>
          </Box>
          <Box variant="p">
            CEM has two limits that the LeWorldModel authors state: it has no guarantee of finding the global
            optimum, and it &quot;becomes increasingly difficult to apply when the action space is large&quot;.{' '}
            <Cite id="F03-114">LeWorldModel paper, appendix A</Cite> The planners covered here keep the action
            space small. V-JEPA 2-AC limits each sampled action to about 13 cm of gripper travel. Its released
            notebook and RoboJEPA&apos;s real-arm planner search only over the x, y, z move and the gripper, and
            they keep the rotation fixed.{' '}
            <Cite id="F03-29">vjepa2 notebooks, world_model_wrapper.py and mpc_utils.py</Cite> The V-JEPA 2 authors
            also report that they tried camera positions by hand before they found one that worked.{' '}
            <Cite id="F03-28">V-JEPA 2 paper, section 4.2</Cite>
          </Box>
          <ExpandableSection headerText="The released notebook's planner defaults differ from the paper">
            <Box variant="p">
              The notebook wrapper in the vjepa2 repository uses these defaults: 400 samples, 10 CEM iterations,
              the top 10 kept and a rollout of 2. It samples only the x, y, z move and the gripper,
              and it leaves the rotation at zero. The number of predictor passes is the same as in the paper: 400 x
              10 x 2 = 8,000. <Cite id="F03-29">vjepa2 notebooks/utils/world_model_wrapper.py, lines 20 to 29</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The published figures show which machines JEPA training and JEPA planning need. With the pass count and the size of one pass, you can also estimate the cost of the next JEPA planner you read about."
          >
            The hardware a JEPA needs for training and planning
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every job in this section runs a transformer on a GPU&apos;s tensor cores, which are the units that
            multiply matrices. The jobs differ widely in size (see section 15, Training at Three Scales).
            Pretraining the video encoder is the largest job. The V-JEPA 2 authors estimate that training ViT-g
            would take roughly 60 GPU-years on A100s without their progressive-resolution training schedule, and
            they report that this schedule cuts GPU time by 8.4x. The paper does not state how many GPUs the
            released model was trained on, or for how long.{' '}
            <Cite id="F03-12">V-JEPA 2 paper, section 2.2 and Figure 5</Cite>
          </Box>
          <Box variant="p">
            Training a predictor on a frozen encoder is still multi-node training. The released V-JEPA 2-AC
            configuration asks for 4 nodes of 8 GPUs each, and RoboJEPA&apos;s 1B predictor was trained on 32 nodes
            of 8 H100 GPUs each. <Cite id="F03-21">vjepa2 droid-256px-8f.yaml</Cite>{' '}
            <Cite id="F03-80">RoboJEPA paper, appendix C.2</Cite> LeWorldModel is the only model here that is sized
            for a single machine. Its authors state that it trains on a single GPU in a few hours, but they do not
            name the GPU. <Cite id="F03-31">LeWorldModel paper, abstract</Cite>
          </Box>
          <Box variant="p">
            For V-JEPA 2-AC, one planned action is 10 batches of 800 passes. Each batch has to wait for the one
            before it, because CEM refits its Gaussian between iterations. The candidates inside a batch, on the
            other hand, never exchange data, so one batch can be split across GPUs. This is why RoboJEPA&apos;s
            authors can spread one iteration over several GPUs. <Cite id="F03-24">V-JEPA 2 paper, appendix B.2</Cite>{' '}
            <Cite id="F03-77">RoboJEPA paper, section 2.2</Cite>
          </Box>
          <Box variant="p">
            The V-JEPA 2 authors also list ways to cut the planning time, and more compute comes first on their
            list. The other items are fewer samples and fewer refinement steps, a fast policy trained inside the
            world model to give the search its starting point, and a planner that follows gradients through the
            predictor. <Cite id="F03-116">V-JEPA 2 paper, section 4.2</Cite>
          </Box>
          <Box variant="p">
            Gradient-based planning has a known weakness. A peer-reviewed comparison of planners for JEPA world
            models reports that gradient-based planners do well when the cost changes smoothly, but fail on
            contact-rich manipulation because they get stuck in local minima. The same study finds that CEM plans
            best overall. <Cite id="F03-81">JEPA-WMs paper, section 7</Cite> Picking up a block involves contact,
            so this weakness matters for the {ARM}&apos;s task.
          </Box>
          <Box variant="p">
            The bottleneck of a predictor pass may not be the GPU&apos;s arithmetic. RoboJEPA&apos;s authors
            profiled their 1B predictor on a single H200 GPU. They report that plain inference is &quot;bound by
            host-side dispatch, not by matrix multiplication&quot;. Host-side dispatch is the CPU&apos;s work of
            handing each operation to the GPU. At a batch size of 16, matrix multiplications took only about 26% of
            the GPU time. <Cite id="F03-80">RoboJEPA paper, appendix I</Cite> So before you buy a larger GPU, time
            one pass and find out what it waits on (section 21, Reading a Machine, shows how).
          </Box>
          <Box variant="p">
            Before you consider a JEPA paper&apos;s planner for your own arm, answer two questions about it:
          </Box>
          <ol style={LIST}>
            <li>
              Which method keeps the encoder from collapsing: a slow target encoder in the update rule, a term in
              the loss, or a frozen encoder? The answer tells you what you would train yourself and what you must
              accept as given.
            </li>
            <li>
              What does one planned action cost? Multiply samples by iterations by horizon, weigh one pass by the
              predictor&apos;s size and its tokens per step, and find the reported seconds and the GPU they were
              measured on.
            </li>
          </ol>
          <Box variant="p">
            For V-JEPA 2-AC, the answers are a frozen 1B encoder, and 800 x 10 x 1 = 8,000 passes of a 300M
            predictor over 258 tokens per step, which take 16 seconds per action on one RTX 4090, as its authors
            report. <Cite id="F03-24">V-JEPA 2 paper, appendix B.2</Cite>{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>{' '}
            <Cite id="F03-115">our arithmetic, predictor passes per decision</Cite>{' '}
            <Cite id="F03-4">V-JEPA 2 paper, appendix A.3, Table 12</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
