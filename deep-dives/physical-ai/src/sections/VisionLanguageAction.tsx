import type { CSSProperties, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Derived } from '../components/Cite';
import { Figure, AnimatedFigure } from '../components/Figure';
import { Formula, M } from '../components/Math';
import { VlaTokenFlow } from '../components/figures/VlaTokenFlow';
import { VlaTwoClocks, VLA_CLOCK_STEPS } from '../components/figures/VlaTwoClocks';
import { ARM, TASK_STORY } from '../lib/task';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const NEUTRAL_INK = '#5f6b7a';
const EMPHASIS = '#0972d3';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 560, margin: '0 auto' };

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/** The instruction the thread task is given in words. One place, so a change of task is one edit. */
const INSTRUCTION = 'put the block in the cup';

/** The label GR00T 2 carries every time it brings a figure (owner decision of 2026-11-20). */
const GROOT2_LABEL =
  "These are NVIDIA's own figures, from a research page and whitepaper dated November 2026. The code is announced for December and nothing can be downloaded yet.";

const LABEL = { fontFamily: 'sans-serif', fontSize: 12, fill: INK } as const;
const TITLE = { fontFamily: 'sans-serif', fontSize: 13, fontWeight: 'bold', fill: INK } as const;

/* ------------------------------------------------------------------------ */
/* Diagram 5.3: release timeline, 2025 to November 2026                     */
/* ------------------------------------------------------------------------ */

interface Release {
  /** Months since 2025-01-01. */
  m: number;
  label: string;
  /** True when the sources read state code or weights a reader can download. */
  open: boolean;
}

const TIMELINE: { lane: string; releases: Release[] }[] = [
  {
    lane: 'pi line, Physical Intelligence',
    releases: [
      { m: 3.5, label: 'pi0.5', open: true },
      { m: 10.5, label: 'pi*0.6', open: false },
      { m: 15.5, label: 'pi0.7', open: false },
    ],
  },
  {
    lane: 'GR00T, NVIDIA',
    releases: [
      { m: 2.5, label: 'N1', open: true },
      { m: 15.5, label: 'N1.7', open: true },
      { m: 22.3, label: 'GR00T 2', open: false },
    ],
  },
  { lane: 'SmolVLA, Hugging Face', releases: [{ m: 5.1, label: 'SmolVLA', open: true }] },
  { lane: 'OpenVLA line', releases: [{ m: 1.9, label: 'OFT', open: true }] },
  {
    lane: 'Gemini Robotics, Google DeepMind',
    releases: [
      { m: 2.5, label: 'first', open: false },
      { m: 5.8, label: 'On-Device', open: false },
      { m: 8.8, label: '1.5', open: false },
      { m: 19, label: '2', open: false },
      { m: 22.3, label: '2.5', open: false },
    ],
  },
];

const TL_X0 = 24;
const TL_MONTH = 15;
const tlx = (m: number) => TL_X0 + m * TL_MONTH;

function ReleaseTimeline() {
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 468" role="img" aria-labelledby="vla-timeline-title" style={{ width: '100%', height: 'auto' }}>
        <title id="vla-timeline-title">Releases of five robot-model lines, January 2025 to November 2026</title>
        <desc>
          Five rows on a shared time axis from 2025 to 2026. A filled marker is a release with code or weights to
          download: pi0.5, GR00T N1, GR00T N1.7, SmolVLA and OpenVLA-OFT. A hollow marker is a release that exists
          only as a paper or a post: pi*0.6, pi0.7, GR00T 2 and every Gemini Robotics release.
        </desc>
        <rect x="0" y="0" width="400" height="468" fill="#fbfbfd" />

        {/* time axis */}
        <text x={tlx(6)} y="22" textAnchor="middle" {...TITLE}>
          2025
        </text>
        <text x={tlx(18)} y="22" textAnchor="middle" {...TITLE}>
          2026
        </text>
        <line x1={tlx(0)} y1="38" x2={tlx(24)} y2="38" stroke={NEUTRAL_INK} strokeWidth="1.5" />
        {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((m) => (
          <line key={m} x1={tlx(m)} y1={m % 12 === 0 ? 28 : 33} x2={tlx(m)} y2="38" stroke={NEUTRAL_INK} strokeWidth="1.5" />
        ))}

        {TIMELINE.map((row, i) => {
          const y0 = 54 + i * 72;
          return (
            <g key={row.lane}>
              <text x={TL_X0} y={y0 + 14} {...TITLE}>
                {row.lane}
              </text>
              <line x1={tlx(0)} y1={y0 + 34} x2={tlx(24)} y2={y0 + 34} stroke="#c6ccd3" strokeWidth="2" />
              <line x1={tlx(12)} y1={y0 + 28} x2={tlx(12)} y2={y0 + 40} stroke="#c6ccd3" strokeWidth="2" />
              {row.releases.map((r) => (
                <g key={r.label}>
                  <circle
                    cx={tlx(r.m)}
                    cy={y0 + 34}
                    r="6.5"
                    fill={r.open ? EMPHASIS : '#ffffff'}
                    stroke={r.open ? EMPHASIS : NEUTRAL_INK}
                    strokeWidth="2"
                  />
                  <text
                    x={tlx(r.m)}
                    y={y0 + 58}
                    textAnchor="middle"
                    fontFamily="sans-serif"
                    fontSize="12"
                    fontWeight={r.open ? 'bold' : 'normal'}
                    fill={INK}
                  >
                    {r.label}
                  </text>
                </g>
              ))}
            </g>
          );
        })}

        {/* legend */}
        <circle cx="31" cy="428" r="6.5" fill={EMPHASIS} stroke={EMPHASIS} strokeWidth="2" />
        <text x="46" y="432" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill={INK}>
          code or weights you can download
        </text>
        <circle cx="31" cy="450" r="6.5" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="2" />
        <text x="46" y="454" {...LABEL}>
          paper or post, no download as of November 2026
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* The 28 policy packages of LeRobot v0.7.0 (register entry F02-102)        */
/* ------------------------------------------------------------------------ */

interface PolicyRow {
  pkg: string;
  what: string;
  chunk: string;
  fit: string;
  id: string;
  src: string;
}

const POLICIES: PolicyRow[] = [
  { pkg: 'act', what: 'Action Chunking with Transformers: a small transformer trained from scratch on your demonstrations', chunk: '100 / 100', fit: "Yes. It is LeRobot's recommended first policy.", id: 'F02-66', src: 'LeRobot ACT guide' },
  { pkg: 'diffusion', what: 'Diffusion Policy: refines noise into an action sequence, conditioned on recent images', chunk: '64 / 32', fit: 'Likely, by input and output sizes. Its features come from the dataset.', id: 'F02-17', src: 'LeRobot diffusion config' },
  { pkg: 'vqbet', what: 'VQ-BeT: a transformer that predicts discrete action codes', chunk: '3 prediction tokens of 5 actions each', fit: 'Likely, by input and output sizes. No recipe for the arm was found.', id: 'F02-102', src: 'LeRobot vqbet config' },
  { pkg: 'tdmpc', what: 'TD-MPC: a reinforcement-learning method that learns a model of the task and uses it to plan a few steps ahead', chunk: 'planning horizon 5 / 1', fit: 'No documented path. It is not fine-tuned from demonstrations, and no SO-101 recipe was found.', id: 'F02-102', src: 'LeRobot tdmpc config' },
  { pkg: 'gaussian_actor', what: "The actor network of LeRobot's reinforcement-learning path, trained by trial and error on the real robot (section 8, Reinforcement Learning for Robots)", chunk: 'no chunk: one action per step', fit: "Yes, through LeRobot's reinforcement-learning workflow.", id: 'F02-92', src: 'LeRobot gaussian_actor config' },
  { pkg: 'multi_task_dit', what: 'Multitask DiT: Diffusion Policy scaled to a language-conditioned transformer of about 450M parameters', chunk: '32 / 24', fit: 'Likely, by input and output sizes. It is trained on your own data.', id: 'F02-98', src: 'LeRobot multi_task_dit guide' },
  { pkg: 'smolvla', what: 'SmolVLA: a 450M-parameter VLA with a flow-matching action expert', chunk: '50 / 50', fit: "Yes. LeRobot's own fine-tune guide puts the run at about 4 h on one A100.", id: 'F02-63', src: 'LeRobot SmolVLA guide' },
  { pkg: 'pi0', what: 'pi0: a 3.3B-class VLA with a flow-matching action expert, ported from openpi', chunk: '50 / 50', fit: 'Yes, by padding to 32 numbers.', id: 'F02-80', src: 'LeRobot pi0 guide' },
  { pkg: 'pi0_fast', what: 'pi0-FAST: the same backbone, which writes compressed action tokens one at a time', chunk: '50 / 50', fit: 'Yes, by padding to 32 numbers.', id: 'F02-29', src: 'LeRobot pi0_fast config' },
  { pkg: 'pi05', what: "pi0.5: pi0's successor, with optional memory in LeRobot", chunk: '50 / 50', fit: 'Yes, by padding to 32 numbers. The example is sized for one 80 GB GPU.', id: 'F02-57', src: 'LeRobot pi05 guide' },
  { pkg: 'fineart_vla', what: 'FineART-VLA: pi0.5 plus a language head that names the next subtask before acting', chunk: '50 / 50 (inherited from pi0.5)', fit: 'Likely, by input and output sizes, as for pi0.5. It was mid-trained on two-arm data.', id: 'F02-89', src: 'LeRobot fineart_vla README' },
  { pkg: 'groot', what: 'GR00T N1.7 (NVIDIA): a VLA with a diffusion-transformer action head', chunk: '16 / 16 in the recipe for a new embodiment', fit: 'Yes, through the recipe for a new embodiment (a new robot body).', id: 'F02-81', src: 'LeRobot groot guide' },
  { pkg: 'xvla', what: 'X-VLA: a 0.9B VLA with a small set of learned prompt vectors per robot body', chunk: '32', fit: 'Likely, by input and output sizes, with a new set of soft prompts for the arm.', id: 'F02-82', src: 'LeRobot xvla config' },
  { pkg: 'eo1', what: 'EO-1: a Qwen2.5-VL 3B backbone with a flow-matching action head', chunk: '16 / 16', fit: "Yes. The guide's own example runs on an SO-101 follower arm.", id: 'F02-86', src: 'LeRobot eo1 guide' },
  { pkg: 'evo1', what: 'EVO1: an InternVL3 1B backbone with a flow-matching head, trained in two stages', chunk: '50 / 50', fit: 'Likely, by input and output sizes, after padding to 24 numbers.', id: 'F02-87', src: 'LeRobot evo1 config' },
  { pkg: 'dm05', what: 'DM0.5 (Dexmal): a VLA for open-world control', chunk: '50 / 50', fit: 'Likely, by input and output sizes. It accepts state and action vectors of up to 32 numbers.', id: 'F02-85', src: 'LeRobot dm05 config' },
  { pkg: 'g05', what: 'G0.5 (Galaxea): a Qwen3.5 2B VLA that writes reasoning text and then actions, under a non-commercial licence', chunk: '16 / 16 (SO-101 checkpoint: 32 / 16)', fit: 'Yes. It ships a first-party SO-101 checkpoint and a fine-tune command.', id: 'F02-91', src: 'LeRobot g05 guide' },
  { pkg: 'molmoact2', what: 'MolmoAct2 (Allen Institute for AI), ported to LeRobot', chunk: '30 / 30', fit: 'Yes. It ships a first-party SO-100/SO-101 checkpoint. Check the calibration correction before you run it.', id: 'F02-97', src: 'LeRobot molmoact2 guide' },
  { pkg: 'lingbot_vla_v2', what: 'LingBot-VLA 2.0 (Robbyant): a Qwen3-VL 4B backbone and an action expert over 55 shared state and action slots', chunk: '50 / 50', fit: "Yes, by mapping the arm's numbers to slots. The guide's example arm has the SO-101's layout. A full fine-tune needs about 96 GB.", id: 'F02-95', src: 'LeRobot lingbot_vla_v2 guide' },
  { pkg: 'wall_oss_05', what: 'Wall-OSS-0.5 (X Square Robot): a 4B Qwen2.5-VL VLA with a flow-matching expert', chunk: '32 / 32', fit: 'Likely, by input and output sizes, after zero-padding to 26 numbers.', id: 'F02-100', src: 'LeRobot wall_oss_05 guide' },
  { pkg: 'wall_x', what: 'WALL-OSS, the earlier release from the same company', chunk: '32 / 32', fit: 'Likely, by input and output sizes, after padding to 20 numbers.', id: 'F02-101', src: 'LeRobot wall_x config' },
  { pkg: 'vla_jepa', what: 'VLA-JEPA: a Qwen3-VL 2B VLA trained with an extra video-prediction loss from V-JEPA 2 (section 7, JEPA). The predictor is dropped at inference.', chunk: '7 / 7', fit: 'Yes, by re-initialising the action layers for a 6-number action.', id: 'F02-99', src: 'LeRobot vla_jepa guide' },
  { pkg: 'cosmos3', what: 'Cosmos 3 as a world action model: predicts future video and actions together', chunk: '16 / 16', fit: 'Likely, by input and output sizes. LeRobot measured 21 GB for a LoRA fine-tune of the smaller variant, and the larger variant needs 80 GB GPUs.', id: 'F02-84', src: 'LeRobot cosmos3 guide' },
  { pkg: 'flux3', what: 'FLUX 3 Action (Black Forest Labs): a 7B world action model that refines actions together with future frames', chunk: '32 / 32 (SO-101 checkpoint predicts 42)', fit: 'Yes. It ships a first-party SO-101 checkpoint and a LoRA recipe for one GPU.', id: 'F02-90', src: 'LeRobot flux3 guide' },
  { pkg: 'fastwam', what: 'Fast-WAM: a Wan 2.2 5B world action model that skips generating future frames at inference', chunk: '32 / 32', fit: 'Likely, by input and output sizes, with the action and state widths set to 6.', id: 'F02-88', src: 'LeRobot fastwam guide' },
  { pkg: 'lawam', what: 'LaWAM: a world action model built on Qwen3-VL 2B that predicts in a compressed space', chunk: '8 / 8', fit: 'Likely, by input and output sizes, after padding to 32 numbers.', id: 'F02-93', src: 'LeRobot lawam guide' },
  { pkg: 'longwam', what: 'Long-WAM: a world action model that reads 48 steps of visual history', chunk: '32 / 10', fit: 'No documented path. Its checkpoints use a 7-number action from a simulated benchmark.', id: 'F02-96', src: 'LeRobot longwam guide' },
  { pkg: 'lingbot_va', what: 'LingBot-VA: a video-and-action model of about 5B, built on Wan 2.2', chunk: '16 per chunk (a derived figure)', fit: 'Not directly. It predicts gripper poses, and an SO-101 recording holds joint angles.', id: 'F02-94', src: 'LeRobot lingbot_va guide' },
];

/** Lookup order: documented paths to the arm first, then likely fits by input and output sizes, then no path. */
const fitRank = (fit: string) => (fit.startsWith('Yes') ? 0 : fit.startsWith('Likely') ? 1 : 2);
const POLICIES_BY_FIT = [...POLICIES].sort((a, b) => fitRank(a.fit) - fitRank(b.fit));

function Row({ cells, cite }: { cells: ReactNode[]; cite: ReactNode }) {
  return (
    <tr>
      {cells.map((c, i) => (
        <td key={i} style={TD}>
          {c}
        </td>
      ))}
      <td style={TD}>{cite}</td>
    </tr>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function VisionLanguageAction() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={`A vision-language-action model usually combines two networks: a large backbone that reads the camera images and an instruction in words, and a smaller action head that turns the result into motor commands. Once you know how one call runs through the two networks, you can read the rates and latencies that announcements quote and work out how much GPU memory a fine-tune needs. You can then choose which model to download and fine-tune for the ${ARM} today.`}
          >
            5. Vision-Language-Action Models: How They Are Built and What Their Specs Mean
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A policy is the trained model that decides what a robot&apos;s motors do next. A vision-language-action
            model (VLA) is a policy that also takes an instruction in words as one of its inputs.{' '}
            <Cite id="F02-18">pi0 paper, section IV, inputs and outputs</Cite> Most of the VLAs in this section are
            built from two networks. The larger one, called the backbone, is a model that was already trained to read
            images and text. The smaller one, called the action head, turns what the backbone read into motor
            commands. In most of these models, the parameter count in an announcement is the sum, or nearly the sum,
            of the two networks. In pi0, the model that Physical Intelligence published in October 2024, the backbone
            has 3B parameters and the action head has 300M, for 3.3B in total.{' '}
            <Cite id="F02-32">pi0 paper, section IV, model size</Cite>
          </Box>
          <Box variant="p">
            Announcements also quote rates in hertz (Hz, times per second), and a quoted rate may not be the speed
            of either network. GR00T N1 is a robot model that NVIDIA published in March 2025. NVIDIA&apos;s paper
            reports that its backbone runs at 10 Hz on an L40 GPU and that motor actions leave its action head at 120
            Hz. Neither figure tells you how often the action head produces an answer. Each answer from the action head
            is a chunk. A chunk is the run of future actions that a policy returns in one call. Section 4, Learning
            From Demonstrations, covers chunks in detail. In GR00T N1, a chunk holds 16 actions, and the paper reports
            63.9 ms on the L40 to sample one chunk. At that speed, the action head can produce at most 1000 / 63.9 ={' '}
            <Derived>15.6</Derived> chunks a second, which leaves room for <Derived>15.6</Derived> x 16 ={' '}
            <Derived>250</Derived> actions a second. So the 120 Hz figure counts actions. A longer chunk raises it
            without any extra call to the model.{' '}
            <Cite id="F02-33">GR00T N1 paper, section 1</Cite>{' '}
            <Cite id="F02-34">GR00T N1 paper, sections 2 and 3</Cite>
          </Box>
          <Box variant="p">The split into a backbone and an action head matters in three practical places:</Box>
          <ul style={LIST}>
            <li>
              <strong>Latency.</strong> In one call, the backbone runs once and the action head runs several times,
              once for each step that builds the chunk. So you can split a published latency into parts and reduce
              each part separately.{' '}
              <Cite id="F02-20">pi0 paper, section IV and appendix D</Cite>
            </li>
            <li>
              <strong>Control rate.</strong> The {ARM}, the small six-motor arm used as the example throughout,
              receives a new target for its motors 30 times a second. Each of these moments is called a tick. The
              computer that drives the arm plays the chunk one action per tick, so a model that needs several ticks
              to answer can still drive the arm.{' '}
              <Cite id="F02-67">LeRobot so_follower.py and imitation learning tutorial</Cite>
            </li>
            <li>
              <strong>Fine-tune memory.</strong> The GPU memory that a fine-tune needs depends on how much of the
              model is trained. A frozen part of the model keeps its weights fixed during the fine-tune. NVIDIA&apos;s
              default recipe for GR00T N1.7, a later model in the same line, freezes the backbone and stays under
              about 35 GB. NVIDIA recommends 80 GB or more per GPU when the backbone is trained too.{' '}
              <Cite id="F02-37">NVIDIA GR00T N1.7 blog post</Cite>{' '}
              <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Follow one call of pi0 on the ${ARM}, from two camera images and a sentence to an output of 50 actions with 32 numbers each. You will see what the backbone computes, what the action head reads from it, and why the output has 32 numbers when the arm has six motors.`}
          >
            How one call of a VLA works
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The first difference you notice when you use a VLA is a text box. A policy trained from scratch on fifty
            recordings of one task, as in section 4, Learning From Demonstrations, can do only that task:{' '}
            {TASK_STORY}. A VLA takes the task as an input instead. You type &quot;{INSTRUCTION}&quot;, and the model
            receives that sentence on every call, together with the camera images and the joint angles.{' '}
            <Cite id="F02-18">pi0 paper, section IV</Cite>
          </Box>
          <Box variant="p">
            The difference that matters for cost is where the weights come from. The section 4 policy learns
            everything it knows from your fifty episodes. A VLA arrives already trained on images and text from the
            web and on recordings from other robots, and your episodes only adapt it to this arm and this task.
            Someone else pays for that pretraining. You pay for the adaptation, which is a fine-tune, and for running
            the model on every call.{' '}
            <Cite id="F02-32">pi0 paper, section IV, model size</Cite>{' '}
            <Cite id="F02-59">SmolVLA paper, section 4 and table 1</Cite>
          </Box>
          <Box variant="p">
            The backbone is a vision-language model (VLM). A VLM is a network pretrained on images and text from the
            web. It takes pictures and a prompt as input and writes text. It works on tokens. A token is one vector
            that the network processes. Each camera image is cut into small squares called patches, and each
            patch becomes one token. Section 7, JEPA, shows the grid of patches. The words of the instruction become
            tokens too. The sequence of image and text tokens that enters the backbone on one call is called the
            prefix.
          </Box>
          <Box variant="p">
            A VLM on its own writes words, but the arm&apos;s servos need numbers. The action head fills that gap.
            It is a second network, which Physical Intelligence calls the action expert. It reads the
            backbone&apos;s results for the prefix and the robot&apos;s state, which on the {ARM} is the six joint
            angles, and it outputs an action chunk. In pi0 and in GR00T N1, the backbone passes its results to the
            action head as vectors, through attention. Attention is the transformer operation in which one token
            reads information from other tokens. A token that reads from others in this way is said to attend to
            them. In each attention layer, every token has a key, which sets how much other tokens read from it, and
            a value, which is the information they read. In pi0, the action head&apos;s tokens attend to the keys and values that the
            backbone&apos;s attention layers computed for the prefix. In GR00T N1, the action head attends to the
            output vectors of the VLM.{' '}
            <Cite id="F02-20">pi0 paper, section IV and appendix D</Cite>{' '}
            <Cite id="F02-33">GR00T N1 paper, section 1</Cite>
          </Box>
          <Box variant="p">
            pi0&apos;s action head uses flow matching, the method described in section 4, Learning From
            Demonstrations. Flow matching starts from random noise with the same shape as the answer and refines it
            into an action chunk in a few steps. In announcements, these refinement steps are called denoising steps. Progress
            through the refinement is measured in flow time <M>{String.raw`\tau`}</M>, which runs from 0 for pure
            noise to 1 for the finished chunk. In LeRobot v0.7.0, the library used to train and run policies on this
            arm, pi0&apos;s noise is a tensor of 50 rows by 32 columns, and the action head takes 10 steps. The camera
            images and the sentence do not change during those steps. So the backbone reads the prefix once, its
            results are cached, and each step runs only the action head again. One call is therefore one backbone
            pass followed by ten action-head passes.{' '}
            <Cite id="F02-20">pi0 paper, section IV and appendix D</Cite>{' '}
            <Cite id="F02-29">LeRobot pi0 and pi0_fast configs</Cite>
          </Box>
          <Box variant="p">
            The output has 32 columns because one set of pi0 weights serves many different robots. The state and
            action vectors have one fixed width, which is 32 in the released code. The models in the paper used 18.
            The {ARM}&apos;s six numbers fill six of the slots, and the rest are set to zero, which is called
            zero-padding. The host is the computer that the arm and its cameras plug into. It keeps the first six
            columns of the output and plays one row per tick.{' '}
            <Cite id="F02-23">pi0 paper, section V-A, and openpi pi0_config.py</Cite>{' '}
            <Cite id="F02-29">LeRobot pi0 and pi0_fast configs</Cite>
          </Box>
          <Figure
            cites="F02-18 F02-20 F02-23 F02-29 F02-32 F02-67"
            caption={
              <>
                One call of pi0 on the {ARM}, from the inputs to the motors. The model is drawn in green, with the
                areas of its two networks to scale by parameter count, and the robot is drawn in yellow. The grid is
                the action chunk of 50 rows by 32 columns, shown at three points in flow time{' '}
                <M>{String.raw`\tau`}</M>: 0 (pure noise), halfway, and 1 (the finished chunk). The figure is a
                schematic: the camera views, the number of token cells and the values in the grid are drawn by hand.
              </>
            }
          >
            <VlaTokenFlow instruction={INSTRUCTION} />
          </Figure>
          <Box variant="p">
            A robot body, with its joints, sensors and action space, is called an embodiment. Models that serve many
            embodiments handle a new one in different ways, so what you set up for a new arm depends on the model:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>pi0.</strong> pi0 uses zero-padding, so a new arm needs nothing extra. The arm&apos;s numbers
              go into the first slots.
            </li>
            <li>
              <strong>GR00T.</strong> GR00T gives each embodiment its own small encoder and decoder around a shared
              action head.{' '}
              <Cite id="F02-33">GR00T N1 paper, section 1</Cite> So its fine-tune for this arm declares a new
              embodiment with <code>--embodiment-tag NEW_EMBODIMENT</code>.{' '}
              <Cite id="F02-43">Isaac-GR00T SO100 and SO101 fine-tuning guide</Cite>
            </li>
            <li>
              <strong>X-VLA.</strong> X-VLA is a 0.9B model available in LeRobot. For each robot type, X-VLA
              feeds the model 32 learned vectors, called soft prompts, and LeRobot&apos;s fine-tuning example keeps
              these vectors trainable.{' '}
              <Cite id="F02-82">LeRobot xvla config</Cite> X-VLA&apos;s authors report 93% success on LIBERO, a
              suite of simulated manipulation tasks, after tuning only 9M parameters, which is 1% of the model.{' '}
              <Cite id="F02-70">X-VLA paper, abstract</Cite>
            </li>
          </ul>
          <Box variant="p">
            Across Physical Intelligence&apos;s pi models, the action head has grown while the number of refinement
            steps has fallen. From pi0 to pi0.7, the head went from 300M to 860M parameters and the steps went from
            10 to 5. In every model where both sizes are published, the backbone is still the larger network. That is
            why freezing the backbone saves the most GPU memory in a fine-tune.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 760 }}>
              <thead>
                <tr>
                  <th style={TH}>Model</th>
                  <th style={TH}>Backbone</th>
                  <th style={TH}>Action head</th>
                  <th style={TH}>Actions per chunk</th>
                  <th style={TH}>Refinement steps</th>
                  <th style={TH}>Sources</th>
                </tr>
              </thead>
              <tbody>
                <Row
                  cells={['pi0 (October 2024)', 'PaliGemma, 3B', '300M, flow matching', '50', '10']}
                  cite={
                    <>
                      <Cite id="F02-32">pi0 paper, section IV, model size</Cite>{' '}
                      <Cite id="F02-18">pi0 paper, section IV</Cite>{' '}
                      <Cite id="F02-20">pi0 paper, section IV and appendix D</Cite>
                    </>
                  }
                />
                <Row
                  cells={[
                    'GR00T N1 (March 2025)',
                    'A 1.34B VLM (2.2B for the whole model)',
                    'A DiT (diffusion transformer) trained with flow matching. A DiT is a transformer used to refine noise into actions.',
                    '16',
                    '4',
                  ]}
                  cite={
                    <>
                      <Cite id="F02-33">GR00T N1 paper, section 1</Cite>{' '}
                      <Cite id="F02-34">GR00T N1 paper, sections 2 and 3</Cite>
                    </>
                  }
                />
                <Row
                  cells={[
                    'SmolVLA (June 2025)',
                    'SmolVLM-2, using only its first 16 language-model layers (450M for the whole model)',
                    'About 100M, flow matching',
                    '50',
                    '10',
                  ]}
                  cite={<Cite id="F02-58">SmolVLA paper, section 4</Cite>}
                />
                <Row
                  cells={[
                    'GR00T N1.7 (April 2026)',
                    'Cosmos-Reason2-2B, which feeds the action head from its layer 16 (3B for the whole model)',
                    'A DiT trained with flow matching, with 32 layers in the released checkpoint (the code default is 16)',
                    '40',
                    '4',
                  ]}
                  cite={
                    <>
                      <Cite id="F02-37">NVIDIA GR00T N1.7 blog post</Cite>{' '}
                      <Cite id="F02-38">Isaac-GR00T gr00t_n1d7.py and the released checkpoint config</Cite>
                    </>
                  }
                />
                <Row
                  cells={[
                    'pi0.7 (April 2026)',
                    'A 4B VLM (about 5B for the whole model, including an encoder for recent video)',
                    '860M, flow matching',
                    '50, of which 15 or 25 are played',
                    '5',
                  ]}
                  cite={<Cite id="F02-51">pi0.7 paper, section IV</Cite>}
                />
              </tbody>
            </table>
          </div>
          <ExpandableSection headerText="The pi0 training loss and sampling step, in the paper's notation">
            <SpaceBetween size="s">
              <Box variant="p">
                Section 4, Learning From Demonstrations, wrote the two rules of flow matching with a plain{' '}
                <M>x</M> for the chunk being built. The pi0 paper writes the same rules with the robot&apos;s tick
                and observation in them. A subscript is the robot&apos;s tick <M>t</M>, and a superscript is the flow
                time <M>{String.raw`\tau`}</M>, which runs from 0 (pure noise) to 1 (the finished chunk).{' '}
                <M>{String.raw`\mathbf{o}_t`}</M> is the observation: the camera images, the sentence and the joint
                angles. <M>{String.raw`\mathbf{A}_t`}</M> is a demonstrated chunk that starts at tick <M>t</M>.{' '}
                <M>{String.raw`\epsilon`}</M> is random noise with the same shape.{' '}
                <M>{String.raw`\mathbf{A}_t^\tau = \tau \mathbf{A}_t + (1 - \tau) \epsilon`}</M> is a blend of the
                two at flow time <M>{String.raw`\tau`}</M>.
              </Box>
              <Box variant="p">
                <M>{String.raw`\mathbf{v}_\theta`}</M> is the action head with weights{' '}
                <M>{String.raw`\theta`}</M>. It reads the blend and the observation and outputs one velocity for each
                number in the chunk.{' '}
                <M>{String.raw`\mathbf{u}(\mathbf{A}_t^\tau \mid \mathbf{A}_t) = \mathbf{A}_t - \epsilon`}</M> is
                the velocity the head should output: the straight direction from the noise to the demonstration.{' '}
                <M>{String.raw`\mathbb{E}`}</M> is the expected value, an average over the two distributions written
                under it. The first, <M>{String.raw`p(\mathbf{A}_t \mid \mathbf{o}_t)`}</M>, is the distribution of
                demonstrated chunks that go with an observation. The second,{' '}
                <M>{String.raw`q(\mathbf{A}_t^\tau \mid \mathbf{A}_t)`}</M>, is the distribution of noisy blends of
                one chunk. The superscript on <M>L</M> means that this is the loss at one flow time. Training draws a
                new <M>{String.raw`\tau`}</M> for every example, and it draws values near the noisy end more often.{' '}
                <Cite id="F11-5">pi0 paper, section IV</Cite> Training minimises this loss:
              </Box>
              <Formula
                name="pi0 training loss (conditional flow matching)"
                tex={String.raw`\begin{aligned} & L^\tau(\theta) = \mathbb{E}_{p(\mathbf{A}_t \mid \mathbf{o}_t), \, q(\mathbf{A}_t^\tau \mid \mathbf{A}_t)} \\ & \quad \big\lVert \mathbf{v}_\theta(\mathbf{A}_t^\tau, \mathbf{o}_t) - \mathbf{u}(\mathbf{A}_t^\tau \mid \mathbf{A}_t) \big\rVert^2 \end{aligned}`}
                source={<Cite id="F02-19">pi0 paper, section IV</Cite>}
              />
              <Box variant="p">
                <M>{String.raw`\mathbf{v}_\theta(\mathbf{A}_t^\tau, \mathbf{o}_t)`}</M> is one pass of the action
                head, which attends to the prefix. <M>{String.raw`\mathbf{u}`}</M> is the correct answer, which is
                known during training because the demonstration is known. The loss for the action tokens is the
                squared distance between the two. On the robot, there is no demonstration. So the model starts from
                pure noise <M>{String.raw`\mathbf{A}_t^0`}</M> and follows its own velocities, moving forward in flow
                time by a step of size <M>{String.raw`\delta`}</M> each time:
              </Box>
              <Formula
                name="pi0 inference step (forward Euler)"
                tex={String.raw`\mathbf{A}_t^{\tau + \delta} = \mathbf{A}_t^\tau + \delta \, \mathbf{v}_\theta(\mathbf{A}_t^\tau, \mathbf{o}_t)`}
                source={<Cite id="F02-20">pi0 paper, section IV</Cite>}
              />
              <Box variant="p">
                The left side is the chunk a little further along in flow time. pi0 sets{' '}
                <M>{String.raw`\delta`}</M> to 0.1, so 10 steps take <M>{String.raw`\tau`}</M> from 0 to 1. These are
                the 10 refinement steps in the figure, and each one works on a tensor of 50 rows by 32 columns. The
                observation <M>{String.raw`\mathbf{o}_t`}</M> is the same in every step. That is why the backbone
                reads the prefix once and caches the result, and only <M>{String.raw`\mathbf{v}_\theta`}</M> is
                computed again at each step.{' '}
                <Cite id="F02-20">pi0 paper, section IV and appendix D</Cite>{' '}
                <Cite id="F02-29">LeRobot pi0 and pi0_fast configs</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A rate in hertz in a robot-model announcement can count backbone passes, chunks or actions. Learn to tell which one it counts, and to work out the action head's real speed from the time it takes to sample one chunk."
          >
            What the slow and fast rates in an announcement measure
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Understanding a scene and a sentence needs a large network, but the motors need a new target many times
            a second. The models in this section solve this by running their two networks at two different rates.
            NVIDIA&apos;s GR00T N1 paper
            named the two sides, and announcements still use those names. System 2 is the VLM, the slow system that
            reads the scene and the instruction. System 1 is the action head, the fast system that produces the
            actions.{' '}
            <Cite id="F02-33">GR00T N1 paper, section 1</Cite>
          </Box>
          <Box variant="p">
            The slow rate tells you how old the arm&apos;s information is. In the figure below, one backbone pass
            over the scene is called a plan. At the paper&apos;s two rates, each plan is used for 120 / 10 = 12
            actions, and a new plan arrives every 1000 / 10 = <Derived>100</Derived> ms. When the twelfth action
            leaves, its plan is almost <Derived>100</Derived> ms old, and that comes on top of the time it took to
            compute the plan. So every action is chosen from camera images that are already in the past, and the
            slow rate sets how far in the past they are.{' '}
            <Cite id="F02-33">GR00T N1 paper, section 1</Cite>
          </Box>
          <AnimatedFigure
            name="two clocks"
            steps={VLA_CLOCK_STEPS}
            intervalMs={2600}
            cites="F02-33"
            caption={
              <>
                The paper&apos;s two rates on one time axis: 10 plans a second and 120 actions a second. Each plan
                block spans the time it takes to compute, which is one slow tick, and the actions that use that plan
                are drawn under the next block. The figure is a schematic drawn from the two rates, not a
                measurement. It does not show the chunks of 16 in which the action head samples those actions.
              </>
            }
          >
            {(step, reduced) => <VlaTwoClocks step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            The fast rate tells you less about the action head than it seems to. It counts actions, and each action
            is one row of a chunk. So the fast rate is the product of the chunk length and of how often the head
            produces a chunk:
          </Box>
          <Formula
            name="Action rate"
            tex={String.raw`\frac{\text{actions}}{\text{second}} = \frac{\text{actions}}{\text{chunk}} \times \frac{\text{chunks}}{\text{second}}`}
          />
          <Box variant="p">
            The first factor is cheap to raise: a longer chunk gives more actions per second without any extra call
            to the model. The second factor is the real speed of the network. The paper&apos;s 63.9 ms per chunk on
            an L40 sets an upper limit on it, although the paper does not say whether that time includes a backbone
            pass. For GR00T N1, 120 actions a second in chunks of 16 need 120 / 16 = <Derived>7.5</Derived> chunks a
            second if every action of every chunk is played. The paper&apos;s timing allows up to{' '}
            <Derived>15.6</Derived> chunks a second. So the two rates in the announcement depend on a third number
            that the announcement does not state. The scene is read 10 times a second, and 120 actions leave every
            second. In between, the action head has to sample <Derived>7.5</Derived> chunks a second, and it can
            sample up to <Derived>15.6</Derived>.{' '}
            <Cite id="F02-33">GR00T N1 paper, section 1</Cite>{' '}
            <Cite id="F02-34">GR00T N1 paper, sections 2 and 3</Cite>
          </Box>
          <Box variant="p">
            When an announcement quotes a fast rate, check whether it counts actions or chunks. Also check which
            network passes are included in the timing behind it.
          </Box>
          <Box variant="p">
            On the {ARM}, the host sets the fast rate by playing 30 actions a second. The slow rate depends on a
            configuration value: the number of actions the host plays before it calls the model again. SmolVLA
            returns 50 actions per call, and LeRobot&apos;s default plays all 50, so the model is called once every
            50 / 30 = <Derived>1.67</Derived> s. GR00T N1.7&apos;s code default is a chunk of 40 actions.
            LeRobot&apos;s example for a new arm overrides that default to predict and play 16 actions (
            <code>--policy.chunk_size=16 --policy.n_action_steps=16</code>), which means one call every 16 / 30 ={' '}
            <Derived>0.53</Derived> s. Between calls, the arm acts on what the cameras showed at the last call.
            Section 4, Learning From Demonstrations, works out what that delay costs.{' '}
            <Cite id="F02-62">LeRobot configuration_smolvla.py</Cite>{' '}
            <Cite id="F02-67">LeRobot so_follower.py and imitation learning tutorial</Cite>{' '}
            <Cite id="F02-38">Isaac-GR00T gr00t_n1d7.py and the released checkpoint config</Cite>{' '}
            <Cite id="F02-81">LeRobot groot guide</Cite>
          </Box>
          <Box variant="p">
            Model designers split the work between the slow side and the fast side in different places, and the
            split determines which machine runs each side. Four designs are in use. Each one in the list below
            puts the slow side further from the motors than the one before, and the last two run the slow side on a
            different machine from the fast side.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Inside one network.</strong> pi0.5, published in April 2025, first writes a short text
              subtask, such as &quot;pick up the cutting board&quot;, and then produces an action chunk based on
              that subtask. One set of weights does both.{' '}
              <Cite id="F02-48">pi0.5 paper, section I</Cite>
            </li>
            <li>
              <strong>Two modules on one GPU.</strong> The GR00T N1 line, up to N1.7, runs a VLM and a DiT action
              head side by side. The GR00T N1.7 model card reports a separate time for each of the two.{' '}
              <Cite id="F02-37">NVIDIA GR00T N1.7 blog post</Cite>{' '}
              <Cite id="F02-40">GR00T N1.7 model card, inference timing table</Cite>
            </li>
            <li>
              <strong>A network link between the two sides.</strong> The first Gemini Robotics model, from March
              2025, ran its backbone in the cloud and a small action decoder on the robot. Google DeepMind&apos;s
              report gives under 160 ms for the backbone&apos;s answer and about 250 ms from observation to action
              chunk. It also gives an effective control rate of 50 Hz, because each chunk holds many actions. These
              figures suggest that the chunk is what covers the delay that the network link adds, but that is an
              inference from the figures, not a published finding.{' '}
              <Cite id="F02-78">Gemini Robotics tech report, section 3.1</Cite>
            </li>
            <li>
              <strong>An agent on top.</strong> In GR00T 2, a general reasoning model acts as System 2 and calls the
              action model as a tool. The reasoning model is the only part that runs off the robot.{' '}
              <Cite id="F02-45">NVIDIA GR00T 2 research page, Agentic Control</Cite>
            </li>
          </ul>
          <Box variant="p">
            GR00T 2 is the current form of this two-rate design. Besides adding the agent, it changes the action
            model that the agent calls. That action model is a world action model. A world action model uses one diffusion transformer to
            refine future video and the action chunk together. So it predicts what the camera will see as well as
            what the robot should do. Section 6, World Models, covers this kind of model.{' '}
            <Cite id="F02-44">NVIDIA GR00T 2 research page, Model Architecture</Cite>
          </Box>
          <Box variant="p">
            GR00T 2 Turbo is the variant that runs on the robot, and it splits the fast side into two parts. NVIDIA
            reports the following figures for the Unitree G1 robot, after NVIDIA&apos;s inference optimisations. One
            prediction takes 38 ms on an RTX 5090 desktop GPU and 124 ms on the robot&apos;s Jetson Thor, an NVIDIA
            onboard computer for robots. On the Jetson Thor, the model plans chunks of 1.6 s about once per second,
            and a separate controller executes them at 50 Hz. {GROOT2_LABEL}{' '}
            <Cite id="F02-45">NVIDIA GR00T 2 research page, GR00T 2 Turbo</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Learn to split a published latency into the time for encoding the images, for the backbone pass and for the action-head steps. Before you compare two published latencies, check that they use the same build, the same checkpoint and the same number of cameras."
          >
            Breaking down the latency of one call
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One call has a part that runs once and a part that repeats. The images are encoded and the backbone
            reads the prefix once. After that, the action head runs once for each refinement step. The image encoder
            is the network that turns each camera image into tokens. To write the time of one call, use these
            symbols. <M>{String.raw`t_{\mathrm{see}}`}</M> is the time spent in the image encoders.{' '}
            <M>{String.raw`t_{\mathrm{read}}`}</M> is the time of the backbone&apos;s pass over the prefix.{' '}
            <M>K</M> is the number of refinement steps, and <M>{String.raw`t_{\mathrm{step}}`}</M> is the time of
            one action-head pass. <M>{String.raw`t_{\mathrm{call}}`}</M> is the time of the whole call:
          </Box>
          <Formula
            name="Time of one VLA call"
            tex={String.raw`t_{\mathrm{call}} = t_{\mathrm{see}} + t_{\mathrm{read}} + K \, t_{\mathrm{step}}`}
          />
          <Box variant="p">
            The first two terms grow with the number of cameras and the size of the backbone. The last term grows
            with the number of steps and the size of the action head. For pi0 on an RTX 4090 with 3 cameras, its
            authors report 14 ms in the image encoders, 32 ms in the backbone pass and 27 ms for the ten action-head
            passes. That is 73 ms in total, and 46 ms of it is spent encoding the images and running the backbone.
            So reducing pi0&apos;s number of steps would only shrink the smaller part of the call.{' '}
            <Cite id="F02-21">pi0 paper, appendix D, table I</Cite>
          </Box>
          <Box variant="p">
            In GR00T N1.7, the split goes the other way. NVIDIA&apos;s model card times it with 4 refinement steps
            and 1 camera on an H100 data-centre GPU. In plain PyTorch, the card lists 31.3 ms for the backbone and
            48.2 ms for the action head. So the side called fast is the more expensive one here. It is called fast
            because of the rate at which actions leave, and that rate is high because each call returns a whole
            chunk. The term worth reducing therefore depends on the model: the backbone pass in pi0, and the action
            head in N1.7.{' '}
            <Cite id="F02-40">GR00T N1.7 model card, inference timing table</Cite>
          </Box>
          <Box variant="p">
            The same card shows how much the build changes a published latency. The build is the software that runs
            the model, such as plain PyTorch or an engine made with TensorRT. TensorRT is NVIDIA&apos;s compiler
            that turns a trained network into an optimised inference engine. With TensorRT on the H100, the card
            lists 6.2 ms of data processing, 8.8 ms in the backbone and 12.3 ms in the action head. Next to these
            stages, it prints an end-to-end figure of 27.9 ms (35.9 Hz).{' '}
            <Cite id="F02-40">GR00T N1.7 model card, inference timing table</Cite>
          </Box>
          <Box variant="p">
            So you can compare two published latencies only when you know the build, the checkpoint and the number
            of cameras behind each one. NVIDIA&apos;s own pages give several latencies for GR00T N1.7 on the same
            Jetson AGX Thor. Among the three TensorRT figures below, the slowest is 93.8 / 35.6 ={' '}
            <Derived>2.6</Derived> times the fastest.{' '}
            <Cite id="F02-40">GR00T N1.7 model card, inference timing table</Cite>{' '}
            <Cite id="F02-41">Isaac-GR00T deployment README, benchmark results</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>93.8 ms (10.7 Hz).</strong> This is the model card&apos;s figure, with TensorRT and 1 camera.{' '}
              <Cite id="F02-40">GR00T N1.7 model card, inference timing table</Cite>
            </li>
            <li>
              <strong>76.8 ms.</strong> This is the figure in the repository&apos;s deployment guide, with TensorRT,
              a different checkpoint and two cameras. Section 17, Running on the Robot, uses this figure.{' '}
              <Cite id="F02-41">Isaac-GR00T deployment README, benchmark results</Cite>
            </li>
            <li>
              <strong>35.6 ms, the &quot;~28 Hz&quot; on the repository&apos;s front page.</strong> This figure is
              from the same guide, with the model also quantised to a format that NVIDIA calls NVFP4. A quantised
              model stores its numbers at lower precision, which makes it smaller and faster.{' '}
              <Cite id="F02-41">Isaac-GR00T deployment README, benchmark results</Cite>
            </li>
          </ul>
          <Box variant="p">
            pi0.7 is served from a data centre. Its authors report 38 ms per call on one H100 in the minimal
            configuration, with 3 cameras and 5 refinement steps. In the worst case the call takes 127 ms, with two
            options switched on: an encoder for recent video, and generated images of the next subgoal added to the
            prompt.{' '}
            <Cite id="F02-51">pi0.7 paper, section IV</Cite>{' '}
            <Cite id="F02-52">pi0.7 paper, appendix D</Cite> Section 17, Running on the Robot, compares latencies
            like these with the arm&apos;s tick.
          </Box>
          <Box variant="p">
            Every term of the call is tensor arithmetic on a GPU, and the GPU also has to hold the model&apos;s
            weights. openpi&apos;s table asks for more than 8 GB of GPU memory to run pi0, and NVIDIA&apos;s guide
            asks for 16 GB to run GR00T N1.7.{' '}
            <Cite id="F02-54">openpi README, requirements</Cite>{' '}
            <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite> Capturing and decoding the camera frames is
            separate work, done by the CPU or by the GPU&apos;s video engine. A published latency probably includes
            this work only where its table lists it, as NVIDIA&apos;s card does with its data-processing stage.
            Both points are an inference from the published tables, not a published statement.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The GPU memory a fine-tune needs depends on which parts of the model are trained and which are frozen. Learn to estimate it from published recipes, and to check that the run you started trains the weights you intended."
          >
            Sizing the GPU for a fine-tune
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Pretraining a VLA is usually out of reach, so the job you need to size is the fine-tune. NVIDIA&apos;s
            paper reports roughly 50,000 H100 GPU-hours on up to 1,024 GPUs for GR00T N1.{' '}
            <Cite id="F02-34">GR00T N1 paper, sections 2 and 3</Cite> SmolVLA is much smaller, at 450M parameters,
            and was pretrained on 4 GPUs. Even so, its authors report about 30k GPU-hours across their whole project.
            That total covers every experiment in the project, not a single pretraining run.{' '}
            <Cite id="F02-58">SmolVLA paper, section 4</Cite>{' '}
            <Cite id="F02-59">SmolVLA paper, section 4 and table 1</Cite>
          </Box>
          <Box variant="p">
            The GPU memory of a fine-tune depends on which parts of the model train. Every weight that trains needs
            a gradient and optimiser state in GPU memory, and a frozen weight needs neither. Section 15, Training at
            Three Scales, explains this in detail. SmolVLA trains only its action expert, which is about 100M of its
            450M parameters. GR00T N1.7&apos;s default recipe trains the action head and the small layer that feeds
            it, and it keeps the VLM frozen. That recipe stays under about 35 GB, and NVIDIA sets a minimum of one 40
            GB GPU for it, so a 24 GB card is below the minimum. When the VLM is trained too, NVIDIA recommends 80 GB
            or more per GPU.{' '}
            <Cite id="F02-58">SmolVLA paper, section 4</Cite>{' '}
            <Cite id="F02-62">LeRobot configuration_smolvla.py</Cite>{' '}
            <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite>
          </Box>
          <Box variant="p">
            On a GPU of fixed size, the same choice changes the batch size you can use. NVIDIA&apos;s GR00T N1 paper
            tested fine-tuning on a single A6000 GPU. When only the action head and the small per-robot layers
            around it were trained, the batch could be up to 200. When the vision encoder was trained too, the batch
            could be at most 16.{' '}
            <Cite id="F02-34">GR00T N1 paper, sections 2 and 3</Cite>
          </Box>
          <Box variant="p">
            There is a middle option between training only the action head and training everything. LoRA (low-rank
            adaptation) adds small matrices to the model, trains only those, and leaves the original weights frozen.
            For the pi0 family, openpi&apos;s table asks for more than 22.5 GB of GPU memory for a LoRA fine-tune
            and more than 70 GB for a full fine-tune.{' '}
            <Cite id="F02-54">openpi README, requirements</Cite> LeRobot&apos;s pi0.5 example is sized for a single
            80 GB GPU.{' '}
            <Cite id="F02-57">LeRobot pi05 guide</Cite> With a 7B backbone, the fine-tune grows beyond one GPU: the
            OpenVLA-OFT authors fine-tuned their model across 8 A100 or H100 GPUs.{' '}
            <Cite id="F02-69">OpenVLA-OFT paper, section V</Cite>
          </Box>
          <Box variant="p">
            Before you rely on any of these memory figures, check which kind of fine-tune you actually started.
            LeRobot v0.7.0 has one LoRA switch for every policy, <code>--peft.method_type=LORA</code>. Its release
            notes record a fix for an earlier problem: before the fix, <code>--policy.use_peft=true</code> on its
            own ran a full fine-tune without any warning. To confirm that the run trains the weights you intended,
            read the number of trainable parameters that the trainer prints.{' '}
            <Cite id="F02-83">LeRobot v0.7.0 release notes and PEFT guide</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Choose which model to fine-tune for an ${ARM} today, and find out which of the models in the news exist only as a paper or a post.`}
          >
            Which models you can download and fine-tune today
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A model line is a series of related models, such as Physical Intelligence&apos;s pi models or
            NVIDIA&apos;s GR00T models. For the model lines below, the model in the news and the model you can
            fine-tune are usually different models. The newest pi model with a paper is pi0.7, but the newest pi
            model with downloadable weights is pi0.5. GR00T 2 exists as a research page and a whitepaper, and the
            newest GR00T with weights is N1.7. So GR00T 2 is the current GR00T to learn from, and N1.7 is the current
            GR00T to run. The Gemini Robotics VLA models of July 2026 were released to early-access partners.{' '}
            <Cite id="F02-53">openpi README, updates and checkpoints</Cite>{' '}
            <Cite id="F02-37">NVIDIA GR00T N1.7 blog post</Cite>{' '}
            <Cite id="F02-44">NVIDIA GR00T 2 research page</Cite>{' '}
            <Cite id="F02-75">Google DeepMind, Gemini Robotics 2 post</Cite>
          </Box>
          <Figure
            cites="F02-34 F02-37 F02-44 F02-48 F02-50 F02-51 F02-53 F02-58 F02-68 F02-74 F02-75 F02-77 F02-78 F02-79"
            caption={
              <>
                Each row is one model line, with its releases from left to right. A filled marker is a release with
                code or weights you can download. A hollow marker is a release with no published download as of
                November 2026. GR00T N1.5 and N1.6, which came between N1 and N1.7, are not drawn.
              </>
            }
          >
            <ReleaseTimeline />
          </Figure>
          <Box variant="p">
            In practice, the models you can fine-tune on an {ARM} are the ones that LeRobot supports. LeRobot v0.7.0, released on 5
            November 2026, ships 28 policy packages. A policy package is one model family, and you select it with
            one command, <code>lerobot-train --policy.type=...</code>. Four of these packages are the ones to try
            first on this arm.{' '}
            <Cite id="F02-65">LeRobot v0.7.0 policies directory</Cite>{' '}
            <Cite id="F02-102">LeRobot v0.7.0 policies directory, all 28 packages</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>
                <code>smolvla</code>, the first VLA to fine-tune.
              </strong>{' '}
              LeRobot&apos;s guide starts from the 450M checkpoint and fine-tunes it on about 50 recorded episodes.
              According to the guide, 20,000 training steps take roughly 4 hours on a single A100 GPU.{' '}
              <Cite id="F02-63">LeRobot SmolVLA guide</Cite> SmolVLA is also the model behind the one published
              result that is close to this task. The SmolVLA authors tested an {ARM} pick-and-place task with 50
              demonstrations and compared SmolVLA with ACT (Action Chunking with Transformers), the small policy
              trained from scratch in section 4, Learning From Demonstrations. When the object started where the
              demonstrations started, which is called in distribution, they report 90% success for SmolVLA against
              70% for ACT. When the object started somewhere new, which is called out of distribution, they report
              50% against 40%. The second pair of numbers is the one that matters when the block is not where you
              practised. SmolVLA had seen no {ARM} data before those 50 demonstrations.{' '}
              <Cite id="F02-60">SmolVLA paper, table 4</Cite>
            </li>
            <li>
              <strong>
                <code>act</code>, the baseline to beat.
              </strong>{' '}
              LeRobot recommends ACT as the first policy to train. It is small, and it trains on your recordings
              alone, with no pretrained robot model to download. Its ResNet-18 image backbone does start from weights
              trained on ImageNet, a public set of labelled photos.{' '}
              <Cite id="F02-11">LeRobot configuration_act.py</Cite> To have a baseline for the VLA&apos;s success
              rate, train ACT on the same episodes.{' '}
              <Cite id="F02-66">LeRobot ACT guide</Cite>
            </li>
            <li>
              <strong>
                <code>groot</code>, if you have a 40 GB GPU.
              </strong>{' '}
              This package is GR00T N1.7, the newest GR00T you can run. NVIDIA&apos;s repository has its own guide
              for fine-tuning it on the SO-100 and the {ARM}.{' '}
              <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite>{' '}
              <Cite id="F02-43">Isaac-GR00T SO100 and SO101 fine-tuning guide</Cite> LeRobot v0.7.0 supports only
              N1.7. Its <code>groot</code> policy rejects N1.5 checkpoints and tells you to pin{' '}
              <code>lerobot==0.5.1</code> if you want to keep using them. So a 2025 tutorial for N1.5 on this arm
              fails on the current release.{' '}
              <Cite id="F02-47">LeRobot configuration_groot.py</Cite>
            </li>
            <li>
              <strong>
                <code>pi05</code>, with an example sized for an 80 GB GPU.
              </strong>{' '}
              LeRobot&apos;s example for this package is a LIBERO fine-tune at batch size 64, sized for an 80 GB GPU.
              pi0.5 through LeRobot is the practical pi model for this arm. LeRobot has also added an optional memory
              of recent camera frames and joint readings to it.{' '}
              <Cite id="F02-57">LeRobot pi05 guide</Cite>{' '}
              <Cite id="F02-56">LeRobot pi05 guide and config</Cite>
            </li>
          </ul>
          <Box variant="p">
            Three more packages come with a first-party checkpoint for this arm, and each one has a condition:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>
                <code>molmoact2</code>.
              </strong>{' '}
              It was trained under an older calibration convention, and without a correction the arm may move in
              the wrong direction. The converted LeRobot checkpoint already applies the correction.{' '}
              <Cite id="F02-97">LeRobot molmoact2 guide</Cite>
            </li>
            <li>
              <strong>
                <code>g05</code>.
              </strong>{' '}
              It comes with a fine-tune command and a non-commercial licence.{' '}
              <Cite id="F02-91">LeRobot g05 guide</Cite>
            </li>
            <li>
              <strong>
                <code>flux3</code>.
              </strong>{' '}
              It is a 7B world action model with a LoRA recipe for one GPU on an {ARM} dataset. For a full
              fine-tune, you use the vendor&apos;s own repository.{' '}
              <Cite id="F02-90">LeRobot flux3 guide</Cite>
            </li>
          </ul>

          <ExpandableSection headerText="Release history of each model line">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>The pi line.</strong> pi*0.6, from November 2025, moved to a Gemma 3 backbone of 4B
                parameters with an 860M action expert. It also added learning from the robot&apos;s own attempts,
                which is a form of the reinforcement learning covered in section 8, Reinforcement Learning for
                Robots.{' '}
                <Cite id="F02-50">pi*0.6 paper, abstract and section V</Cite> pi0.7, first posted on 16 April 2026,
                is the newest Physical Intelligence model with a paper as of November 2026. Its prompt carries more
                than a sentence: it also holds notes about the episode and generated images of the next subgoal.{' '}
                <Cite id="F02-51">pi0.7 paper, section IV</Cite> openpi is the company&apos;s open repository. It
                holds only pi0, pi0-FAST and pi0.5, and it offers no pi*0.6 or pi0.7 weights. A company post from October
                2026 offers hosted training and inference through an API beta with a waitlist.{' '}
                <Cite id="F02-53">openpi README, updates and checkpoints</Cite>
              </Box>
              <Box variant="p">
                <strong>The GR00T line.</strong> N1.5, from 2025, kept the VLM frozen during training.{' '}
                <Cite id="F02-35">NVIDIA GR00T N1.5 page</Cite> N1.6, from December 2025, doubled the action head to
                32 layers.{' '}
                <Cite id="F02-36">NVIDIA GR00T N1.6 page</Cite> N1.7 was announced in a blog post on 17 April 2026
                and tagged for release on 18 April 2026. As of November 2026, it is the newest GR00T with released
                weights and code. NVIDIA states that it was pretrained with 20,854 hours of egocentric human video.
                Egocentric video is shot from the point of view of the person doing the task.{' '}
                <Cite id="F02-37">NVIDIA GR00T N1.7 blog post</Cite> The released checkpoint has a 32-layer action
                head, while the repository&apos;s code default is 16. So read the layer count from the configuration
                of the checkpoint you load. In the code, the chunk length is <code>action_horizon = 40</code> and the
                padded width is <code>max_action_dim = 132</code>.{' '}
                <Cite id="F02-38">Isaac-GR00T gr00t_n1d7.py and the released checkpoint config</Cite>
              </Box>
              <Box variant="p">
                <strong>GR00T 2.</strong> The project page describes GR00T 2 Turbo, the variant that runs on the
                robot, as a smaller transformer and gives it 2B parameters. The whitepaper gives the same 2B figure
                for the full model (section 6, World Models), and the two NVIDIA documents do not explain how the
                smaller variant can have the same size.{' '}
                <Cite id="F02-45">NVIDIA GR00T 2 research page, GR00T 2 Turbo</Cite> NVIDIA also reports how fast
                the model adapts to a new task. NVIDIA selected 50 tasks as ones that the model learns from five
                episodes. On those tasks, the model succeeds in 40% of trials with no demonstration of the task, and
                in 95% after five demonstrations and one LoRA fine-tune of about 30 minutes on an RTX 5090.
                NVIDIA&apos;s whitepaper notes that the five-episode rate is high partly by construction, since the
                tasks were chosen as ones the model learns from five episodes. {GROOT2_LABEL}{' '}
                <Cite id="F02-46">NVIDIA GR00T 2 research page, Fast Adaptation</Cite>
              </Box>
              <Box variant="p">
                <strong>SmolVLA.</strong> SmolVLA is at the small end of the range. It has 450M parameters, of which
                about 100M are in the action expert, and its VLM stays frozen during training. It produces chunks of
                50 actions in 10 refinement steps.{' '}
                <Cite id="F02-58">SmolVLA paper, section 4</Cite> LeRobot v0.7.0&apos;s defaults match the paper.{' '}
                <Cite id="F02-62">LeRobot configuration_smolvla.py</Cite>
              </Box>
              <Box variant="p">
                <strong>OpenVLA-OFT.</strong> OpenVLA is a 7B VLA that writes its actions as tokens, one at a time.
                OpenVLA-OFT, from February 2025, changes its head so that it predicts the whole chunk in one parallel
                pass, as plain numbers. On LIBERO, its authors report that success rises from 76.5% to 97.1%, with 26
                times the action throughput. LeRobot v0.7.0 has no package of that name.{' '}
                <Cite id="F02-68">OpenVLA-OFT paper, abstract</Cite>{' '}
                <Cite id="F02-102">LeRobot v0.7.0 policies directory, all 28 packages</Cite>
              </Box>
              <Box variant="p">
                <strong>Gemini Robotics.</strong> As of November 2026, Gemini Robotics 2.5, released on 10 November
                2026, is the newest Gemini Robotics VLA. Google DeepMind states that it was tested on over 200 tasks.
                The post gives no parameter count, training compute or latency.{' '}
                <Cite id="F02-74">Google DeepMind, Gemini Robotics 2.5 post</Cite> Gemini Robotics 2, from 30 July
                2026, came as three models that match the slow and fast sides: a VLA, a reasoning VLM that acts as
                the agent, and an on-device VLA built to run on the robot. Only the reasoning model is generally
                available, as a hosted API.{' '}
                <Cite id="F02-75">Google DeepMind, Gemini Robotics 2 post</Cite> The same post shows the on-device
                model adapted to the {ARM} in a two-arm setup, and that model is available only through early
                access.{' '}
                <Cite id="F02-76">Google DeepMind, Gemini Robotics 2 post, on-device adaptation</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection
            headerText={`All 28 policy packages in LeRobot v0.7.0, sorted by how certain their fit to the ${ARM} is`}
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The table sorts the packages into three groups. Packages marked Yes come first. Each of them has a
                recipe or checkpoint for the {ARM}, or has documentation that explains the padding, slot mapping or
                re-initialisation that lets it accept the arm. Packages marked &quot;Likely, by input and output
                sizes&quot; come next. For these, the package&apos;s padding or dataset code accepts the arm&apos;s
                input and output sizes: six state numbers, six action numbers and one or two cameras. No recipe for
                the arm was found for them. The last three packages have no documented path to the
                arm. The fit column is based on the code and the documentation, and none of the 28 packages was run
                on the arm to check it. The chunk column gives the number of actions predicted and played per call,
                at the package&apos;s default settings.{' '}
                <Cite id="F02-102">LeRobot v0.7.0 policies directory, all 28 packages</Cite>
              </Box>
              <div style={{ overflowX: 'auto' }} data-cites="F02-102">
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 860 }}>
                  <thead>
                    <tr>
                      <th style={TH}>Package</th>
                      <th style={TH}>What it is</th>
                      <th style={TH}>Chunk: predicted / played</th>
                      <th style={TH}>Fits the {ARM}</th>
                      <th style={TH}>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {POLICIES_BY_FIT.map((p) => (
                      <Row
                        key={p.pkg}
                        cells={[<code key="pkg">{p.pkg}</code>, p.what, p.chunk, p.fit]}
                        cite={<Cite id={p.id}>{p.src}</Cite>}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`A VLA gives a GPU two jobs: the fine-tune and the call on the arm. Learn which requirement to check for each job, which model to start with on the ${ARM}, and how to check any announced rate with one division.`}
          >
            Planning the two GPU jobs: the fine-tune and the call
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A VLA gives a GPU two jobs. The fine-tune is a single-GPU run that lasts hours. For the fine-tune, the
            published requirement to check is GPU memory, and the amount depends on how much of the backbone
            trains. Section 15, Training at Three Scales, compares this job with training on several GPUs and on
            several nodes. The call on the arm uses the same arithmetic, but it has a deadline that the chunk sets.
            Each call has to return before the arm runs out of the actions it already has. Section 17, Running on
            the Robot, covers this deadline.
          </Box>
          <Box variant="p">
            On an {ARM}, start by fine-tuning <code>smolvla</code> from <code>lerobot/smolvla_base</code>, on the
            same 50 episodes you recorded for ACT. On this arm, the SmolVLA authors report 90% success against
            ACT&apos;s 70% when the object starts where the demonstrations started, and 50% against 40% when it
            starts somewhere new. Move to <code>groot</code> when you have a 40 GB GPU.{' '}
            <Cite id="F02-60">SmolVLA paper, table 4</Cite>{' '}
            <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite>
          </Box>
          <Box variant="p">
            To size the hardware for any other announced model, first find four numbers: the parameters in the
            backbone, the parameters in the action head, the actions per chunk, and the time to sample one chunk on
            a named device and build. From the time, you get chunks per second. Chunks per second multiplied by the
            chunk length gives the most actions per second that the action head can supply. For example, GR00T
            N1&apos;s 120 Hz needs 120 / 16 = <Derived>7.5</Derived> chunks a second. NVIDIA&apos;s 63.9 ms per
            chunk on an L40 works out to at most <Derived>15.6</Derived> chunks a second, each of 16 actions.{' '}
            <Cite id="F02-33">GR00T N1 paper, section 1</Cite>{' '}
            <Cite id="F02-34">GR00T N1 paper, sections 2 and 3</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
