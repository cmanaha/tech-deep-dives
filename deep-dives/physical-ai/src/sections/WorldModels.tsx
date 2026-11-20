import type { CSSProperties, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Derived } from '../components/Cite';
import { Figure, AnimatedFigure } from '../components/Figure';
import { log10Scale } from '../lib/scale';
import { ARM, TASK_STORY } from '../lib/task';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const ROBOT_FILL = '#fff6d6';
const ROBOT_INK = '#7a5c00';
const GPU_FILL = '#e6f6ea';
const GPU_INK = '#1e7b3a';
const NEUTRAL_INK = '#5f6b7a';
const EMPHASIS = '#0972d3';
const PIXEL_BAR = '#5f6b7a';
const LATENT_BAR = '#0972d3';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 560, margin: '0 auto' };

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/** The honest label GR00T 2 carries wherever it brings a figure. */
const GROOT2_LABEL =
  'NVIDIA whitepaper and project page dated November 2026; the code is announced for December and nothing could be downloaded on 2026-11-20';

/* ------------------------------------------------------------------------ */
/* Diagram 6.1 (animated): one frame and one action through two families    */
/* ------------------------------------------------------------------------ */

const FAMILY_STEPS: ReactNode[] = [
  'One camera frame and one action enter both models. The question is the same for each: what does the scene look like after this action?',
  'The pixel generator first compresses. A VAE encoder turns the frame into a much smaller grid of numbers, built so that a decoder can redraw every pixel from it.',
  'A large transformer starts the next grid as random noise and cleans it up over many passes, steered by the current grid and the action.',
  'The VAE decoder turns the finished grid back into a full frame: the block, the cup, the shadows and the texture of the table.',
  'The latent predictor starts the same way, with an encoder. Its output is a short vector that is never asked to redraw the frame, so it is free to keep only what helps prediction.',
  'A predictor network outputs the next vector in one pass. No image is made at any point.',
  'Side by side: one family ends in an image a person can inspect, the other in a vector a planner can score against a goal.',
];

/** Deterministic grey level for a noise cell, so every render paints the same picture. */
function noiseFill(i: number, level: number): string {
  const v = (i * 37 + 11) % 17;
  const clean = i === 7 || i === 8 ? '#1e7b3a' : '#cdebd5';
  if (level === 0) return clean;
  const grey = 110 + v * 8;
  if (level === 1 && v % 2 === 0) return clean;
  return `rgb(${grey},${grey},${grey})`;
}

function MiniGrid({ x, y, cols, rows, level }: { x: number; y: number; cols: number; rows: number; level: number }) {
  const cells = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const i = r * cols + c;
      cells.push(<path key={i} d={`M${x + c * 8} ${y + r * 8} h8 v8 h-8 Z`} fill={noiseFill(i, level)} stroke="#ffffff" strokeWidth="1" />);
    }
  }
  return <g>{cells}</g>;
}

function VectorRow({ x, y, shift }: { x: number; y: number; shift: number }) {
  const shades = ['#cfe3f7', '#7fb2e5', '#e8f1fb', '#1f5fa8', '#a9cbee', '#e8f1fb', '#4d8fd1', '#cfe3f7'];
  return (
    <g>
      {shades.map((_, i) => (
        <path key={i} d={`M${x + i * 12} ${y} h12 v12 h-12 Z`} fill={shades[(i + shift) % shades.length]} stroke="#ffffff" strokeWidth="1" />
      ))}
    </g>
  );
}

/** A small picture of the bench: table, block, cup and the gripper beside the block. */
function SceneThumb({ x, y, moved, lit }: { x: number; y: number; moved: boolean; lit?: boolean }) {
  const dx = moved ? 26 : 0;
  return (
    <g>
      <path d={`M${x} ${y} h120 v76 h-120 Z`} fill="#ffffff" stroke={lit ? EMPHASIS : NEUTRAL_INK} strokeWidth={lit ? 2.5 : 1.5} />
      <line x1={x + 6} y1={y + 62} x2={x + 114} y2={y + 62} stroke={NEUTRAL_INK} strokeWidth="1.5" />
      <path d={`M${x + 92} ${y + 40} h18 l-3 22 h-12 Z`} fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1.5" />
      <path d={`M${x + 42 + dx} ${y + 50} h12 v12 h-12 Z`} fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1.5" />
      <path d={`M${x + 20 + dx} ${y + 6} L${x + 34 + dx} ${y + 40} L${x + 38 + dx} ${y + 60}`} stroke={ROBOT_INK} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  );
}

function TwoFamilies({ step, reduced }: { step: number; reduced: boolean }) {
  const fade = (on: boolean): CSSProperties => ({ opacity: on ? 1 : 0, transition: reduced ? 'none' : 'opacity 500ms ease' });
  const stage = (k: number) => ({
    stroke: step === k ? EMPHASIS : NEUTRAL_INK,
    strokeWidth: step === k ? 2.5 : 1.5,
  });
  const t = { fontFamily: 'sans-serif', fontSize: 12, fill: INK } as const;
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 604" role="img" aria-labelledby="world-models-families-title" style={{ width: '100%', height: 'auto' }}>
        <title id="world-models-families-title">The same frame and action through a pixel generator and a latent predictor</title>
        <desc>
          A camera frame and an action feed two models. The pixel generator encodes the frame to a grid, denoises a new
          grid over many passes and decodes it to a full next frame. The latent predictor encodes the frame to a short
          vector and predicts the next vector in one pass, with no image.
        </desc>
        <defs>
          <marker id="world-models-families-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill={NEUTRAL_INK} />
          </marker>
        </defs>
        <rect x="0" y="0" width="400" height="604" fill="#fbfbfd" />

        {/* inputs */}
        <text x="102" y="20" textAnchor="middle" {...t}>
          camera frame now
        </text>
        <SceneThumb x={42} y={28} moved={false} lit={step === 0} />
        <rect x="226" y="42" width="144" height="50" rx="4" fill={ROBOT_FILL} stroke={step === 0 ? EMPHASIS : ROBOT_INK} strokeWidth={step === 0 ? 2.5 : 1.5} />
        <text x="298" y="63" textAnchor="middle" {...t} fontWeight="bold">
          action
        </text>
        <text x="298" y="81" textAnchor="middle" {...t}>
          6 joint targets
        </text>
        <path d="M102 104 V120 M298 92 V120 M102 120 H298" stroke={NEUTRAL_INK} strokeWidth="1.5" fill="none" />
        <line x1="102" y1="120" x2="102" y2="137" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#world-models-families-arrow)" />
        <line x1="298" y1="120" x2="298" y2="137" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#world-models-families-arrow)" />

        {/* lanes */}
        <path d="M8 140 h188 v390 h-188 Z" fill="#ffffff" stroke="#d5dbdb" strokeWidth="1.5" />
        <path d="M204 140 h188 v390 h-188 Z" fill="#ffffff" stroke="#d5dbdb" strokeWidth="1.5" />
        <text x="102" y="160" textAnchor="middle" {...t} fontSize={13} fontWeight="bold">
          Pixel generator
        </text>
        <text x="298" y="160" textAnchor="middle" {...t} fontSize={13} fontWeight="bold">
          Latent predictor
        </text>

        {/* pixel lane, stage 1: encode */}
        <g style={fade(step >= 1)}>
          <rect x="20" y="170" width="164" height="44" rx="4" fill="#ffffff" {...stage(1)} />
          <text x="102" y="188" textAnchor="middle" {...t} fontWeight="bold">
            VAE encoder
          </text>
          <text x="102" y="204" textAnchor="middle" {...t}>
            compress the frame
          </text>
          <MiniGrid x={28} y={222} cols={6} rows={3} level={0} />
          <text x="86" y="238" {...t}>
            grid of numbers
          </text>
        </g>

        {/* pixel lane, stage 2: denoise */}
        <g style={fade(step >= 2)}>
          <rect x="20" y="256" width="164" height="44" rx="4" fill={GPU_FILL} {...stage(2)} stroke={step === 2 ? EMPHASIS : GPU_INK} />
          <text x="102" y="274" textAnchor="middle" {...t} fontWeight="bold">
            Transformer
          </text>
          <text x="102" y="290" textAnchor="middle" {...t}>
            denoise, many passes
          </text>
          <MiniGrid x={26} y={310} cols={5} rows={3} level={2} />
          <MiniGrid x={82} y={310} cols={5} rows={3} level={1} />
          <MiniGrid x={138} y={310} cols={5} rows={3} level={0} />
          <line x1="68" y1="322" x2="79" y2="322" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#world-models-families-arrow)" />
          <line x1="124" y1="322" x2="135" y2="322" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#world-models-families-arrow)" />
          <text x="102" y="352" textAnchor="middle" {...t}>
            noise becomes the next grid
          </text>
        </g>

        {/* pixel lane, stage 3: decode */}
        <g style={fade(step >= 3)}>
          <rect x="20" y="362" width="164" height="44" rx="4" fill="#ffffff" {...stage(3)} />
          <text x="102" y="380" textAnchor="middle" {...t} fontWeight="bold">
            VAE decoder
          </text>
          <text x="102" y="396" textAnchor="middle" {...t}>
            grid back to pixels
          </text>
          <SceneThumb x={42} y={416} moved lit={step === 3} />
          <text x="102" y="512" textAnchor="middle" {...t}>
            next frame: every pixel
          </text>
        </g>

        {/* latent lane, stage 1: encode */}
        <g style={fade(step >= 4)}>
          <rect x="216" y="170" width="164" height="44" rx="4" fill="#ffffff" {...stage(4)} />
          <text x="298" y="188" textAnchor="middle" {...t} fontWeight="bold">
            Encoder
          </text>
          <text x="298" y="204" textAnchor="middle" {...t}>
            summarise the frame
          </text>
          <VectorRow x={250} y={224} shift={0} />
          <text x="298" y="254" textAnchor="middle" {...t}>
            latent: a short vector
          </text>
        </g>

        {/* latent lane, stage 2: predict */}
        <g style={fade(step >= 5)}>
          <rect x="216" y="268" width="164" height="44" rx="4" fill={GPU_FILL} {...stage(5)} stroke={step === 5 ? EMPHASIS : GPU_INK} />
          <text x="298" y="286" textAnchor="middle" {...t} fontWeight="bold">
            Predictor
          </text>
          <text x="298" y="302" textAnchor="middle" {...t}>
            one pass
          </text>
          <VectorRow x={250} y={322} shift={3} />
          <text x="298" y="352" textAnchor="middle" {...t}>
            predicted next latent
          </text>
          <path d="M238 416 h120 v76 h-120 Z" fill="none" stroke={NEUTRAL_INK} strokeWidth="1.5" strokeDasharray="5 4" />
          <text x="298" y="450" textAnchor="middle" {...t}>
            no decoder,
          </text>
          <text x="298" y="466" textAnchor="middle" {...t}>
            no image
          </text>
          <text x="298" y="512" textAnchor="middle" {...t}>
            nothing to watch
          </text>
        </g>

        {/* what each family hands back */}
        <g style={fade(step >= 6)}>
          <rect x="8" y="540" width="188" height="54" rx="4" fill="#ffffff" stroke={EMPHASIS} strokeWidth="2.5" />
          <text x="102" y="562" textAnchor="middle" {...t} fontWeight="bold">
            Out: an image
          </text>
          <text x="102" y="580" textAnchor="middle" {...t}>
            a person can inspect it
          </text>
          <rect x="204" y="540" width="188" height="54" rx="4" fill="#ffffff" stroke={EMPHASIS} strokeWidth="2.5" />
          <text x="298" y="562" textAnchor="middle" {...t} fontWeight="bold">
            Out: a vector
          </text>
          <text x="298" y="580" textAnchor="middle" {...t}>
            a planner can score it
          </text>
        </g>
      </svg>
    </div>
  );
}

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
            description="Know what a world model is for, and the one design choice that separates the two families (sources read 2026-11-20)."
          >
            6. World Models: Predicting What Happens Next
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A world model is a network that predicts what the scene will look like after the robot acts. A robot that
            has one can try an action inside the model before it tries it on the table. One design choice splits the
            field into two families: predict the next camera frames themselves, or predict a compact summary of
            them.
          </Box>
          <Box variant="p">
            The number to carry out of this section comes from one published comparison. Planning one action by
            searching inside a model took 16 seconds when the model predicted summaries and 4 minutes when it
            generated video, on the same single RTX 4090 graphics card, as the authors of the faster model report it.{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="You already predict what the camera will show next; the question is how a machine could">
            The scene: the arm is about to push the block
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The {ARM} has to {TASK_STORY}. Freeze it one tick before contact: the gripper is closed and sits just to
            the left of the block, and the next action swings it a little to the right. Before the servos move, you
            know roughly what the top camera will show a moment later. The block will have slid toward the cup. The
            cup will be where it was. The table will look the same.
          </Box>
          <Box variant="p">
            You also know what you cannot predict: the exact glint on the rim of the cup, the grain of the camera
            noise, whether the block ends up turned by a few degrees. You would bet on where the block goes and
            decline to bet on the glint. That split is the argument between the two families later in this section.
          </Box>
          <Box variant="p">
            A policy, the trained model that picks the action (section 3), maps an observation to an action. Nothing
            in it answers a question about what follows.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="State and action in, next state out: one function that everything else in this section calls many times">
            The idea: a model that answers &quot;if I do this, what happens&quot;
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A world model is a model that predicts the future state of the world from what has been observed so far
            and the actions taken. For the arm: given what the camera shows now and the action &quot;swing the
            gripper right&quot;, predict what the camera will show next.{' '}
            <Cite id="F03-87">JEPA-WMs paper, section 1</Cite>
          </Box>
          <Box variant="p">
            Three words carry the idea. An action is what section 3 defined: six joint targets for one tick. A state
            is the model&apos;s description of the scene at one instant, whatever it needs to keep in order to
            predict the next instant. The word has a narrower sense in section 3, where{' '}
            <code>observation.state</code> is the six measured joint angles. Here it means the whole scene as the
            model holds it, block and cup included. The third word is the prediction itself, written as a function:
          </Box>
          <Box variant="p">
            <code>next state = f(state, action)</code>
          </Box>
          <Box variant="p">
            Here <code>f</code> is the world model, a trained network. <code>state</code> and <code>action</code> are
            its two inputs for one tick, and <code>next state</code> is its output, in the same form as the input
            state. Set it beside a policy, which is <code>action = policy(observation)</code>. The policy answers
            &quot;what should I do&quot;. The world model answers &quot;what happens if I do it&quot;.
          </Box>
          <Box variant="p">
            Because the output has the same form as the input, the model can be fed its own prediction. Predict the
            next state, pair it with a second action, predict again, and repeat. A chain of predictions made this way
            is a rollout: a short imagined future for one particular sequence of actions. The field calls running
            rollouts imagination, and it calls each action sequence being tried a candidate. Nothing moves on the
            table during a rollout. Each step also builds on the last step&apos;s output, so prediction errors
            compound, and the authors of one current model name long rollouts as a limit for that reason.{' '}
            <Cite id="F03-28">V-JEPA 2 paper, limitations</Cite>
          </Box>
          <Box variant="p">
            A world model is a &quot;what if&quot; function, and every use of it is a way of calling that function
            many times.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Five ways to spend the answer, and which family each one leans on">
            Five uses: what people do with the answer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The sources read for this dive name four uses for a model that answers &quot;what if&quot;: plan by
            trying action sequences inside it, improve a policy inside it, generate synthetic experience, and
            evaluate what would have happened under other actions.{' '}
            <Cite id="F03-88">LeWorldModel paper, section 1</Cite> A fifth arrived in 2026: let the model output the
            action together with its prediction, so the world model is the policy.{' '}
            <Cite id="F03-93">DreamZero paper, sections 1 and 2</Cite> Counting them as five is our grouping.
          </Box>
          <Box variant="p">
            The table places each use on the arm. The two families get a block each below; for now, the pixel family
            outputs video and the latent family outputs a vector of numbers that summarises the scene.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={TH}>Use</th>
                  <th style={TH}>On the arm</th>
                  <th style={TH}>Pixel family</th>
                  <th style={TH}>Latent family</th>
                  <th style={TH}>Sources</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>
                    <strong>Planning</strong>
                  </td>
                  <td style={TD}>Imagine many candidates, score each against a picture of the goal, run the best one</td>
                  <td style={TD}>Works, slowly: 4 minutes per action in the published comparison</td>
                  <td style={TD}>Its main use: 16 seconds per action in the same comparison</td>
                  <td style={TD}>
                    <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <strong>Training a policy in imagination</strong>
                  </td>
                  <td style={TD}>A learning algorithm practises on imagined episodes while the real arm stays still</td>
                  <td style={TD}>Dreamer 4, from Google DeepMind, trains its policy inside a model that generates frames; its main result is in a video game</td>
                  <td style={TD}>The authors of RoboJEPA, a latent world model for robot arms, say the same model can be used to improve any policy</td>
                  <td style={TD}>
                    <Cite id="F03-90">Dreamer 4 paper, abstract and section 4</Cite>{' '}
                    <Cite id="F03-88">RoboJEPA paper, related work</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <strong>Generating data</strong>
                  </td>
                  <td style={TD}>Turn the episodes you recorded into many more, with varied scenes (section 11)</td>
                  <td style={TD}>A natural fit: the output is video, which any camera-based policy can train on</td>
                  <td style={TD}>Imagined experience stays in the model&apos;s own vectors; turning it into pictures takes a separately trained decoder</td>
                  <td style={TD}>
                    <Cite id="F03-109">V-JEPA 2 paper, appendix B.3</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <strong>Scoring a policy without a robot</strong>
                  </td>
                  <td style={TD}>Run the policy against the model in closed loop, each action changing what the policy sees next, and count successes</td>
                  <td style={TD}>NVIDIA lists a checkpoint of Cosmos 3, its video model, for closed-loop robot policy simulation</td>
                  <td style={TD}>The RoboJEPA authors say the same model can be used to evaluate any policy</td>
                  <td style={TD}>
                    <Cite id="F03-92">NVIDIA Cosmos README, example checkpoints</Cite>{' '}
                    <Cite id="F03-88">RoboJEPA paper, related work</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <strong>Acting directly</strong>
                  </td>
                  <td style={TD}>The model outputs the next actions next to its prediction; no search</td>
                  <td style={TD}>Where two 2026 models from NVIDIA sit, DreamZero and GR00T 2, both met below</td>
                  <td style={TD}>The authors of the term leave room for it; the latent models read for this dive plan by search</td>
                  <td style={TD}>
                    <Cite id="F03-93">DreamZero paper, sections 1 and 2</Cite>{' '}
                    <Cite id="F03-112">V-JEPA 2 paper, section 3.2</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            In our reading of these sources, the pixel family in 2026 is mostly used to generate data and to act
            directly, and the latent family is mostly used to plan. The next two blocks explain why the split falls
            there.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="How a video generator predicts the next frames, and why you get something a person can watch">
            Family one: generate pixels
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The first family takes the question literally. If the state is what the camera shows, then the next state
            is the next camera frames, and the world model is a video generator steered by actions. What you get back
            is a clip that a person can watch and a camera-based policy can train on.
          </Box>
          <Box variant="p">
            The challenge is size. One 640x480 colour frame from the arm&apos;s camera is 640 x 480 x 3 = 921,600
            numbers, and the camera delivers 30 of them every second.{' '}
            <Cite id="F01-86">our arithmetic on the camera settings</Cite> Predicting every one of those numbers
            directly is too much work, so a video generator runs in three stages: compress, denoise, decode.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Compress.</strong> A VAE (variational autoencoder) is a pair of networks trained together. The
              encoder squeezes a clip into a much smaller grid of numbers. The decoder redraws the pixels from that
              grid. Training compares the redrawn clip with the original, so the grid has to keep everything the
              decoder needs to redraw every pixel. A compressed form like this grid is called a latent, and the space
              of all possible grids is the latent space. NVIDIA&apos;s Cosmos 3 uses a VAE that shrinks video 4 times
              in time and 32 by 32 in space, and keeps it frozen, meaning its weights are not updated while the rest
              of the model trains.{' '}
              <Cite id="F03-96">Cosmos 3 paper, section 3.1</Cite>
            </li>
            <li>
              <strong>Denoise.</strong> A large transformer produces the grid for the future frames. Each position in
              the grid is one token, one vector the transformer processes. The future tokens start as random noise
              and the transformer cleans them over a number of passes, guided by the tokens of the frames seen so
              far, by the action sequence and by any text instruction. This is the diffusion idea, and flow matching
              is the training recipe that current models use for it; section 4 builds both on action chunks. In
              Cosmos 3 the generating transformer is trained with flow matching, and the model card&apos;s examples
              use 35 passes.{' '}
              <Cite id="F03-95">NVIDIA Cosmos models reference, architecture</Cite>
            </li>
            <li>
              <strong>Decode.</strong> The VAE decoder turns the finished grid back into frames.
            </li>
          </ul>
          <Box variant="p">
            Put the arm&apos;s camera through the first stage, as our arithmetic with the published ratios (nobody we
            can cite has run Cosmos 3 on an {ARM}). Dividing 640 and 480 by 32 gives a grid of{' '}
            <Derived>20</Derived> by <Derived>15</Derived>, which is <Derived>300</Derived> positions per compressed
            frame, and 30 frames divided by 4 is about 8 compressed frames. One second of video becomes roughly{' '}
            <Derived>2,400</Derived> tokens (<Derived>300 x 8</Derived>) in place of 30 x 921,600 raw numbers.{' '}
            <Cite id="F03-96">Cosmos 3 paper, section 3.1</Cite> <Cite id="F01-86">our arithmetic on the camera settings</Cite>{' '}
            The model does its predicting on those tokens, many passes over all of them.
          </Box>
          <Box variant="p">
            So a pixel model in 2026 also predicts in a compressed space. What makes it a pixel model is the kind of
            compressed space: a reconstruction code, one that must be able to rebuild every pixel, glint and camera
            noise included.
          </Box>
          <Box variant="p">
            The current model of this kind from NVIDIA is Cosmos 3, released at the end of May 2026 in three sizes;
            the middle one, Cosmos3-Nano, has 16B parameters.{' '}
            <Cite id="F03-94">NVIDIA Cosmos README, models</Cite> Its published speed shows what generating pixels
            costs: NVIDIA lists 207.78 s on one H100 80GB to generate a 189-frame clip at 720p, which is 1280 by 720
            pixels, at 24 frames per second.{' '}
            <Cite id="F03-98">NVIDIA Cosmos inference benchmarks, Cosmos3-Nano</Cite> That is under 8 seconds of
            video for more than 3 minutes of compute.
          </Box>
          <ExpandableSection headerText="The pixel family in November 2026, model by model">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Cosmos 3 (NVIDIA).</strong> Three sizes: Super with 64B parameters, Nano with 16B and Edge
                with 4B, the last released in July 2026 for on-device use.{' '}
                <Cite id="F03-94">NVIDIA Cosmos README, models</Cite> It has two transformers sharing weights. One is
                autoregressive: it produces text one token at a time, each conditioned on the ones before, and does
                the reasoning. The other is the diffusion transformer described above, which refines all the tokens
                of a clip together.{' '}
                <Cite id="F03-95">NVIDIA Cosmos models reference, architecture</Cite>
              </Box>
              <Box variant="p">
                NVIDIA&apos;s benchmark page lists the same 189-frame clip on Cosmos3-Nano at 7.61 s on the H100 when
                the frame is 320 x 192 pixels, against 207.78 s at 720p; a B200 takes 114.85 s at 720p.{' '}
                <Cite id="F03-98">NVIDIA Cosmos inference benchmarks, Cosmos3-Nano</Cite> Used as an
                action-conditioned world model (first frame and an action sequence in, rollout video out), NVIDIA
                lists it at about 2.0 s per rollout on an H100 80GB. The length of that rollout is not published.{' '}
                <Cite id="F03-99">NVIDIA Cosmos inference benchmarks, forward dynamics</Cite>
              </Box>
              <Box variant="p">
                <strong>Genie (Google DeepMind).</strong> An interactive world generated from a text prompt, which a
                person or an agent steers as it is drawn. DeepMind describes Genie 3, of August 2025, as navigable in
                real time at 24 frames per second at 720p.{' '}
                <Cite id="F03-100">Google DeepMind blog, Genie 3</Cite> The model page now presents Genie 4, states a
                limit of around a minute of continuous interaction and describes early robotics experiments. It
                carries no date, frame rate, resolution, model size or hardware.{' '}
                <Cite id="F03-101">Google DeepMind, Genie model page</Cite>
              </Box>
              <Box variant="p">
                <strong>Dreamer 4 (Google DeepMind).</strong> The current end of the line that made training in
                imagination work. Its authors report a 2B-parameter world model that runs interactively in real time
                on a single H100, with an agent trained inside it by reinforcement learning, the trial-and-error
                method of section 8. Its main result is in a video game.{' '}
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
          <Header variant="h2" description="Why predicting every pixel spends effort on detail nobody can predict, and what you give up by stopping">
            Family two: predict in a latent space
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Go back to the bench. You would bet on where the block ends up and decline to bet on the glint on the
            cup. A pixel generator has no such choice. Its compressed grid is a reconstruction code, so its
            prediction must contain a glint, some camera noise and a table texture, right or wrong, and its capacity
            and its compute are spent producing them.
          </Box>
          <Box variant="p">
            The second family changes the target. An encoder turns each frame into a latent, as before, but nothing
            ever asks for the pixels back. A second network, the predictor, takes the current latent and the action
            and outputs the next latent, and training compares that output with the encoder&apos;s latent of the
            frame that really came next. Because no decoder has to redraw the frame, the encoder is free to drop
            whatever is irrelevant or cannot be predicted. This design is called a JEPA (Joint-Embedding Predictive
            Architecture): a model that predicts the summary of the future and never the picture.{' '}
            <Cite id="F03-106">V-JEPA paper, section 2</Cite>
          </Box>
          <Box variant="p">
            The authors of V-JEPA 2, Meta&apos;s model of this kind, give the example that the trajectory of a moving
            object is predictable while the precise position of each blade of grass in a field is not.{' '}
            <Cite id="F03-107">V-JEPA 2 paper, section 1</Cite> They tie the argument to cost: they note that
            video-generating world models are seldom judged on planning, &quot;perhaps due to the computational cost
            of planning by generating video&quot;.{' '}
            <Cite id="F03-108">V-JEPA 2 paper, section 1</Cite> Their measurement is this section&apos;s number: 16
            seconds per planned action in latent space against 4 minutes with a video model, on one RTX 4090.{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>
          </Box>
          <AnimatedFigure
            name="two families of world model"
            steps={FAMILY_STEPS}
            intervalMs={2800}
            cites="F03-96 F03-106 F03-109"
            caption={
              <>
                Step through the left lane, then the right. Both start with an encoder; the difference is what the
                encoder&apos;s output must be good for, and how many passes follow. Illustrative, not measured: the
                grids, the vector and the pictures are schematic.
              </>
            }
          >
            {(step, reduced) => <TwoFamilies step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            The size of the latent is less of a difference than the picture suggests. In V-JEPA 2-AC, the version
            that takes actions, the predictor reads each frame as a 16 x 16 grid of vectors, each 1408 numbers wide,
            which is about as many positions as the compressed grid worked out above.{' '}
            <Cite id="F03-15">V-JEPA 2 paper, section 3.1</Cite> The differences are what the grid was trained to
            hold, and what happens next: one pass of a predictor of about 300M parameters in place of many denoising
            passes of a far larger transformer.{' '}
            <Cite id="F03-14">V-JEPA 2 paper, section 3.1</Cite> A small model can go much further. LeWorldModel keeps
            one vector of width 192 per frame.{' '}
            <Cite id="F03-32">LeWorldModel paper, encoder</Cite>
          </Box>
          <Box variant="p">Three things are given up, and they decide when this family is the wrong choice.</Box>
          <ul style={LIST}>
            <li>
              <strong>Nothing to watch.</strong> The prediction is a vector. To see what the model imagines, both
              V-JEPA 2 and LeWorldModel train a separate decoder afterwards and use it only for inspection.{' '}
              <Cite id="F03-109">V-JEPA 2 paper, appendix B.3</Cite>
            </li>
            <li>
              <strong>What the encoder dropped is gone.</strong> The model can only predict what its latent holds.
              The LeWorldModel authors show a decoded rollout in which the overall scene is kept and the angle of the
              gripper is not fully preserved, and for a grasp that angle matters.{' '}
              <Cite id="F03-109">LeWorldModel paper, section 5.1</Cite> The V-JEPA 2 authors say their planner
              &quot;fundamentally depend[s]&quot; on what its latent space captured.{' '}
              <Cite id="F03-111">V-JEPA 2 paper, section 1</Cite>
            </li>
            <li>
              <strong>One future.</strong> A predictor trained to minimise its average error outputs a single future,
              the mean of the plausible ones. Where the world can really go two ways, the mean may be neither. A
              study of these models names this as a limit of the family.{' '}
              <Cite id="F03-110">JEPA-WMs paper, section 7</Cite>
            </li>
          </ul>
          <Box variant="p">
            One question is left open on purpose. If the target is the encoder&apos;s own output, the easy way to a
            perfect score is an encoder that outputs the same vector for every frame. How a JEPA is kept from doing
            that, what the encoder and predictor look like inside and how a planner searches with them are the
            subject of section 7, JEPA: Predicting in Latent Space.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="The pixel family&apos;s answer to search cost: fold the search into one forward pass">
            World-action models: a world model that also outputs the action
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Planning calls the world model thousands of times per decision. There is a way to call it once. Train the
            model to output two things together: the future video and the actions that go with it. The actions come
            out as an action chunk, the next several actions in one answer (section 3). One model of this kind is
            called a world-action model, WAM for short: a model that predicts future observations and the
            robot&apos;s actions together. The DreamZero paper, from NVIDIA in February 2026, coined the term.{' '}
            <Cite id="F03-93">DreamZero paper, sections 1 and 2</Cite>
          </Box>
          <Box variant="p">
            Seen from outside, a world-action model does the job of a VLA (vision-language-action model), the policy
            type of section 5 that maps camera images and an instruction to actions. Inside, predicting the video is
            part of how it is trained and how it decides. The choice between a planner and a world-action model is
            search or amortise: a planner pays at run time, with seconds of search per decision, and a world-action
            model paid during training and answers in one forward pass.
          </Box>
          <Box variant="p">
            <strong>GR00T 2</strong> is the current example, and it carries a label wherever this dive quotes a
            figure from it: {GROOT2_LABEL}. NVIDIA describes a single 2B-parameter transformer built on
            Cosmos-Predict2.5-2B, a video generator from the generation before Cosmos 3. Camera frames go through a
            frozen VAE that compresses 4 times in time and 8 times in each spatial direction, giving 280 tokens per
            compressed frame and camera at 224 x 320 pixels. Video tokens, joint state and actions sit in one
            sequence, and flow matching trains the model on future video and on actions together. NVIDIA reports a
            median of 153 ms to predict an action chunk for one robot, Dexter, from three camera views on an RTX 5090
            after its inference optimisations (449 ms before them), and 180 ms on the YAM arms.{' '}
            <Cite id="F03-104">NVIDIA GR00T 2 whitepaper, section 2</Cite> None of this can be reproduced until the
            code ships. The newest GR00T model with released weights and code is GR00T N1.7, a VLA covered in section
            5.{' '}
            <Cite id="F02-37">Isaac-GR00T N1.7 release</Cite>
          </Box>
          <Box variant="p">
            <strong>DreamZero</strong> shows how fast this moved. Its authors describe a 14B model that outputs video
            and actions together and needs about 5.7 seconds per action chunk on one GPU before optimisation. With
            their optimisations it runs at 7 Hz, seven chunks per second, on 2 GB200 GPUs.{' '}
            <Cite id="F03-103">DreamZero paper, abstract and section 3.2</Cite> Nine months separate a 14B model on
            two data-centre GPUs from a 2B model on one workstation card, on each vendor&apos;s own figures.
          </Box>
          <Box variant="p">
            The border between the two families is open here. The DreamZero authors chose the name
            world-action model over video-action model because video is one possible thing to predict, and they list
            &quot;learned latent representations&quot; among the others.{' '}
            <Cite id="F03-93">DreamZero paper, sections 1 and 2</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="The planning bill for one move of the arm, worked by hand, per family and per GPU">
            Worked example: what it costs to imagine one candidate
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The arm is frozen before the push and has to choose its next action by planning. None of the models below
            has been run on an {ARM} by anyone we can cite, so this maps published settings onto the task. Take the
            settings the V-JEPA 2 authors used on their robot arms: 800 candidates per round, 10 rounds of narrowing
            toward the best ones, and a horizon of 1, meaning each candidate looks one action ahead.{' '}
            <Cite id="F03-24">V-JEPA 2 paper, section 4.2</Cite> The bill in calls to the world model is:
          </Box>
          <Box variant="p">
            <code>800 candidates x 10 rounds x 1 step = 8,000 imagined candidates per action</code>{' '}
            <Cite id="F03-115">our arithmetic on the published planner settings</Cite>
          </Box>
          <Box variant="p">Now price one candidate in each family, from the same paper and the same RTX 4090.</Box>
          <ul style={LIST}>
            <li>
              <strong>Latent.</strong> The authors report 16 seconds per action. Divide by the bill: 16 s / 8,000 = 2
              ms per candidate.{' '}
              <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>
            </li>
            <li>
              <strong>Pixels.</strong> The authors ran the same search through a video model, with one tenth as many
              candidates per round: 80 x 10 = <Derived>800</Derived> candidates, in 4 minutes. That is 240 s / <Derived>800</Derived> = 300 ms per
              candidate, 150 times the latent figure. The video model was Cosmos 1 with 7B parameters, a 2025 model
              that the V-JEPA 2 authors fine-tuned themselves, so the slower side of this comparison was set up by
              the authors of the faster one.{' '}
              <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>{' '}
              <Cite id="F03-118">our arithmetic, time per candidate</Cite>
            </li>
          </ul>
          <Box variant="p">
            That pair is the only like-for-like comparison in the sources read: same GPU, same search method. The
            chart adds the other published figures, each from different hardware, resolution, horizon and batch size.
          </Box>
          <Figure
            cites="F03-118 F03-99 F03-25 F03-74 F03-41"
            caption={
              <>
                Each bar is one published figure with its GPU; the faint end of the last bar is a range. The axis is
                logarithmic, so each gridline is ten times the one to its left (a microsecond, written µs on the
                axis, is a millionth of a second). The figures are not like for like, except the bracketed pair. All
                are the authors&apos; or the vendor&apos;s own.
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
              The same latent planner on other hardware: a later paper from the same lab reports 3 seconds per action
              on a single A100, which is 0.375 ms per candidate. Neither paper explains the gap.{' '}
              <Cite id="F03-74">V-JEPA 2.1 paper, Table 6</Cite> <Cite id="F03-118">our arithmetic, time per candidate</Cite>
            </li>
            <li>
              A small latent model: LeWorldModel&apos;s authors report a full plan in 0.98 s without saying which of
              two planner settings was timed, so one step of one candidate comes out between 22 and 65 microseconds.{' '}
              <Cite id="F03-41">LeWorldModel paper, Figure 3</Cite> <Cite id="F03-118">our arithmetic, time per candidate</Cite>
            </li>
          </ul>
          <Box variant="p">
            The chart spans about five powers of ten, with the headline pair in the middle: 16 seconds per action
            against 4 minutes on the same RTX 4090.{' '}
            <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite> A world-action model does not appear, because it imagines
            once per decision: 153 ms per action chunk for GR00T 2 on an RTX 5090, as NVIDIA reports it in a
            whitepaper whose code is not yet released.{' '}
            <Cite id="F03-104">NVIDIA GR00T 2 whitepaper, section 2</Cite>
          </Box>
          <ExpandableSection headerText="Parameters, side by side">
            <SpaceBetween size="s">
              <Box variant="p">
                Parameter counts as each publisher gives them. The largest model here has about 1,070 times the
                parameters of the smallest, by our arithmetic.{' '}
                <Cite id="F03-117">our reading of the parameter counts</Cite>
              </Box>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560 }}>
                  <thead>
                    <tr>
                      <th style={TH}>Model</th>
                      <th style={TH}>What it predicts</th>
                      <th style={TH}>Parameters</th>
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
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Which part of the machine each family loads, the memory figures that exist, and how to pick a family for your use">
            What it costs, and which family fits which use
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Both families are matrix arithmetic on a GPU&apos;s tensor cores, like the policies of sections 4 and 5.
            In our reading, neither touches the ray-tracing cores that a rendered simulator needs (section 13). What
            differs is how the arithmetic is spent. A pixel generator runs a multi-billion-parameter transformer many
            times per clip. A latent planner runs a small predictor thousands of times per decision.
          </Box>
          <Box variant="p">
            Memory is published for one of these models. NVIDIA&apos;s support matrix for its NIM (NVIDIA Inference
            Microservice, the packaged container NVIDIA ships for serving a model) prints a minimum GPU memory per
            device for each Cosmos 3 configuration. For Cosmos3-Nano at full precision, with the whole model resident
            on the GPU, the floor is 58 GiB for generation (a GiB is the binary gigabyte, slightly larger than a GB).
            With the weights offloaded layer by layer to host memory the floor drops to 31 GiB, and the host then
            needs at least 64 GiB of its own. These are the floors the container checks before it starts. They are
            not measured peaks, and the page gives no resolution or frame count for them.{' '}
            <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>
          </Box>
          <Box variant="p">
            No first-party memory figure was located in this research for the latent planners or for GR00T 2, so this
            section prints none for them.
          </Box>
          <ExpandableSection headerText="Cosmos 3 memory: every first-party figure located, and what each one is">
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
                precision or workload given. In our reading these are the size of the weights alone: 16B parameters
                x 2 bytes = 32 GB and 64B x 2 bytes = 128 GB, with working memory on top.{' '}
                <Cite id="F03-123">NVIDIA cosmos-framework FAQ, inference</Cite>
              </Box>
              <Box variant="p">
                <strong>Measured peaks.</strong> Notes in the same NVIDIA repository record Cosmos3-Nano peaking at
                33.8 GiB allocated on one H100 80 GB while generating a single 1280 x 720 image. That is one frame,
                not a video. The notes are a file written for coding agents, weaker provenance than a product page,
                and they hold no measured peak for a full 189-frame video or for an action-conditioned rollout.{' '}
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
            Training cost follows the same split. NVIDIA reports pretraining Cosmos3-Nano on 1,024 GB200 GPUs.{' '}
            <Cite id="F03-97">Cosmos 3 paper, section 4.1</Cite> The LeWorldModel authors state that their model of
            about 15M parameters trains on a single GPU in a few hours, without naming the GPU.{' '}
            <Cite id="F03-31">LeWorldModel paper, abstract</Cite> Section 15 sizes training at each scale.
          </Box>
          <Box variant="p">Choose by what you need the answer for.</Box>
          <ul style={LIST}>
            <li>
              <strong>You need something to look at or to train on.</strong> Use the pixel family. Budget minutes of
              GPU time per clip at full resolution, and for Cosmos3-Nano a GPU that clears the 58 GiB floor, or the
              31 GiB floor with a large host.{' '}
              <Cite id="F03-121">NVIDIA NIM for Cosmos, support matrix</Cite>
            </li>
            <li>
              <strong>You need to plan by search.</strong> Use the latent family, and check that the encoder keeps
              what your task depends on. The one same-hardware comparison is 16 seconds per action against 4 minutes.
              Section 7 takes this family apart.{' '}
              <Cite id="F03-25">V-JEPA 2 paper, section 4.2 and Table 3</Cite>
            </li>
            <li>
              <strong>You need an action several times a second.</strong> Neither search fits inside a control tick.
              Use a model that outputs actions directly: a VLA today (section 5), or a world-action model once one
              you can download exists.
            </li>
          </ul>
          <Box variant="p">
            For the {ARM} on your bench, the family you can take apart on one GPU is the latent one, and the next
            section does exactly that.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
