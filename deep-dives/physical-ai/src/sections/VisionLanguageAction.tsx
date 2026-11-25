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
          download: pi0.5, GR00T N1, GR00T N1.7, SmolVLA and OpenVLA-OFT. A hollow marker is a paper or post only:
          pi*0.6, pi0.7, GR00T 2 and every Gemini Robotics release.
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
          paper or post, no download in the sources read
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
  { pkg: 'act', what: 'Action Chunking with Transformers: a small transformer trained from scratch on your demonstrations', chunk: '100 / 100', fit: "Yes. LeRobot's recommended first policy", id: 'F02-66', src: 'LeRobot ACT guide' },
  { pkg: 'diffusion', what: 'Diffusion Policy: refines noise into an action sequence, conditioned on recent images', chunk: '64 / 32', fit: 'By shape: features come from the dataset', id: 'F02-17', src: 'LeRobot diffusion config' },
  { pkg: 'vqbet', what: 'VQ-BeT: a transformer that predicts discrete action codes', chunk: '3 prediction tokens of 5 actions each', fit: 'By shape; no arm recipe read', id: 'F02-102', src: 'LeRobot vqbet config' },
  { pkg: 'tdmpc', what: 'TD-MPC: a learned model of the task used to plan a few steps ahead; a reinforcement-learning method', chunk: 'planning horizon 5 / 1', fit: 'Not a fine-tune from demonstrations; no SO-101 recipe read', id: 'F02-102', src: 'LeRobot tdmpc config' },
  { pkg: 'gaussian_actor', what: "The actor network of LeRobot's reinforcement-learning path, trained by trial and error on the real robot (section 8)", chunk: 'no chunk: one action per step', fit: 'Yes, through that reinforcement-learning workflow', id: 'F02-92', src: 'LeRobot gaussian_actor config' },
  { pkg: 'multi_task_dit', what: 'Multitask DiT: Diffusion Policy scaled to a language-conditioned transformer of about 450M parameters', chunk: '32 / 24', fit: 'By shape; trained on your own data', id: 'F02-98', src: 'LeRobot multi_task_dit guide' },
  { pkg: 'smolvla', what: 'SmolVLA: a 450M-parameter VLA with a flow-matching action expert', chunk: '50 / 50', fit: 'Yes. A first-party fine-tune guide, which puts the run at about 4 h on one A100', id: 'F02-63', src: 'LeRobot SmolVLA guide' },
  { pkg: 'pi0', what: 'pi0: a 3.3B-class VLA with a flow-matching action expert, ported from openpi', chunk: '50 / 50', fit: 'Yes, by padding to 32', id: 'F02-80', src: 'LeRobot pi0 guide' },
  { pkg: 'pi0_fast', what: 'pi0-FAST: the same backbone writing compressed action tokens one at a time', chunk: '50 / 50', fit: 'Yes, by padding to 32', id: 'F02-29', src: 'LeRobot pi0_fast config' },
  { pkg: 'pi05', what: "pi0.5: pi0's successor, with optional memory in LeRobot", chunk: '50 / 50', fit: 'Yes, by padding to 32; example sized for one 80 GB GPU', id: 'F02-57', src: 'LeRobot pi05 guide' },
  { pkg: 'fineart_vla', what: 'FineART-VLA: pi0.5 plus a language head that names the next subtask before acting', chunk: '50 / 50 (inherited)', fit: 'By shape, inherited from pi0.5; mid-trained on two-arm data', id: 'F02-89', src: 'LeRobot fineart_vla README' },
  { pkg: 'groot', what: 'GR00T N1.7 (NVIDIA): a VLA with a diffusion-transformer action head', chunk: '16 / 16 in that recipe', fit: 'Yes, via the recipe for a new robot body (a new embodiment)', id: 'F02-81', src: 'LeRobot groot guide' },
  { pkg: 'xvla', what: 'X-VLA: a 0.9B VLA with a small set of learned prompt vectors per robot body', chunk: '32', fit: 'By shape, via a new prompt set for the arm', id: 'F02-82', src: 'LeRobot xvla config' },
  { pkg: 'eo1', what: 'EO-1: a Qwen2.5-VL 3B backbone with a flow-matching action head', chunk: '16 / 16', fit: "Yes. The guide's own example runs on an SO-101 follower", id: 'F02-86', src: 'LeRobot eo1 guide' },
  { pkg: 'evo1', what: 'EVO1: an InternVL3 1B backbone with a flow-matching head, trained in two stages', chunk: '50 / 50', fit: 'By shape: padding to 24', id: 'F02-87', src: 'LeRobot evo1 config' },
  { pkg: 'dm05', what: 'DM0.5 (Dexmal): a VLA for open-world control', chunk: '50 / 50', fit: 'By shape: state and action up to 32 numbers', id: 'F02-85', src: 'LeRobot dm05 config' },
  { pkg: 'g05', what: 'G0.5 (Galaxea): a Qwen3.5 2B VLA that writes reasoning text, then actions; non-commercial licence', chunk: '16 / 16 (SO-101 checkpoint: 32 / 16)', fit: 'Yes. First-party SO-101 checkpoint and fine-tune command', id: 'F02-91', src: 'LeRobot g05 guide' },
  { pkg: 'molmoact2', what: 'MolmoAct2 (Allen Institute for AI), LeRobot port', chunk: '30 / 30', fit: 'Yes. First-party SO-100/SO-101 checkpoint; mind the calibration correction', id: 'F02-97', src: 'LeRobot molmoact2 guide' },
  { pkg: 'lingbot_vla_v2', what: 'LingBot-VLA 2.0 (Robbyant): a Qwen3-VL 4B backbone and an action expert over 55 shared state and action slots', chunk: '50 / 50', fit: "Yes, by slot mapping; the guide's example arm has the SO-101's shape; about 96 GB for a full fine-tune", id: 'F02-95', src: 'LeRobot lingbot_vla_v2 guide' },
  { pkg: 'wall_oss_05', what: 'Wall-OSS-0.5 (X Square Robot): a 4B Qwen2.5-VL VLA with a flow-matching expert', chunk: '32 / 32', fit: 'By shape: zero-padding to 26', id: 'F02-100', src: 'LeRobot wall_oss_05 guide' },
  { pkg: 'wall_x', what: 'WALL-OSS, the earlier release from the same company', chunk: '32 / 32', fit: 'By shape: padding to 20', id: 'F02-101', src: 'LeRobot wall_x config' },
  { pkg: 'vla_jepa', what: 'VLA-JEPA: a Qwen3-VL 2B VLA trained with an extra video-prediction loss from V-JEPA 2 (section 7); the predictor is dropped at inference', chunk: '7 / 7', fit: 'Yes, by re-initialising the action layers for a 6-number action', id: 'F02-99', src: 'LeRobot vla_jepa guide' },
  { pkg: 'cosmos3', what: 'Cosmos 3 as a world action model: predicts future video and actions together', chunk: '16 / 16', fit: 'By shape; LeRobot measured 21 GB for a LoRA fine-tune of the smaller variant; the larger needs 80 GB GPUs', id: 'F02-84', src: 'LeRobot cosmos3 guide' },
  { pkg: 'flux3', what: 'FLUX 3 Action (Black Forest Labs): a 7B world action model, actions refined together with future frames', chunk: '32 / 32 (SO-101 checkpoint predicts 42)', fit: 'Yes. First-party SO-101 checkpoint and a one-GPU LoRA recipe', id: 'F02-90', src: 'LeRobot flux3 guide' },
  { pkg: 'fastwam', what: 'Fast-WAM: a Wan 2.2 5B world action model that skips generating future frames at inference', chunk: '32 / 32', fit: 'By shape, with the action and state widths set to 6', id: 'F02-88', src: 'LeRobot fastwam guide' },
  { pkg: 'lawam', what: 'LaWAM: a world action model that predicts in a compressed space, on Qwen3-VL 2B', chunk: '8 / 8', fit: 'By shape: padding to 32', id: 'F02-93', src: 'LeRobot lawam guide' },
  { pkg: 'longwam', what: 'Long-WAM: a world action model that reads 48 steps of visual history', chunk: '32 / 10', fit: 'No path documented: its checkpoints use a 7-number action from a simulated benchmark', id: 'F02-96', src: 'LeRobot longwam guide' },
  { pkg: 'lingbot_va', what: 'LingBot-VA: a video-and-action model on Wan 2.2, about 5B', chunk: '16 per chunk (our arithmetic)', fit: 'Not directly: it predicts gripper poses, and an SO-101 recording holds joint angles', id: 'F02-94', src: 'LeRobot lingbot_va guide' },
];

/** Lookup order: documented paths to the arm first, then fits by shape, then no path. */
const fitRank = (fit: string) => (fit.startsWith('Yes') ? 0 : fit.startsWith('By shape') ? 1 : 2);
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
            description="Split a robot-model announcement into a backbone, an action head and two rates, and work out from them how fast the model can act and what GPU a fine-tune needs (papers, model cards and LeRobot v0.7.0, read 2026-11-20)"
          >
            5. Vision-Language-Action Models: Reading the Parameter Count and the Hertz Figure
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The parameter count on a robot-model announcement is the sum of two networks, and the rate in hertz
            printed beside it can be the speed of neither. The larger network, the backbone, is a model that
            already reads images and text. The smaller, the action head, turns what the backbone read into motion.
            Together they are a vision-language-action model (VLA). It is a policy, the trained model that decides
            what the motors do next, and one of its inputs is an instruction in words. In pi0, the October 2024
            model from Physical Intelligence, the backbone has 3B parameters and the head 300M, 3.3B in total.{' '}
            <Cite id="F02-32">pi0 paper, section IV, model size</Cite>{' '}
            <Cite id="F02-18">pi0 paper, section IV, inputs and outputs</Cite>
          </Box>
          <Box variant="p">
            NVIDIA&apos;s paper on GR00T N1, its March 2025 robot model, reports the backbone running at 10 Hz
            (hertz, times per second) on an L40 GPU and motor actions leaving the head at 120 Hz. Neither
            figure is how often the head produces an answer. The same paper reports 63.9 ms to sample one chunk,
            the run of future actions a policy returns in one answer (section 4, Learning From Demonstrations),
            and a chunk holds 16 actions. That is 1000 / 63.9 = 15.6 chunks a second at most, with room for 15.6 x
            16 = 250 actions a second. The fast rate counts actions, and a longer chunk raises it with no extra compute.{' '}
            <Cite id="F02-33">GR00T N1 paper, section 1</Cite>{' '}
            <Cite id="F02-34">GR00T N1 paper, sections 2 and 3</Cite>
          </Box>
          <Box variant="p">
            The backbone runs once per call and the head several times, once per step of building the chunk, so a
            published latency divides into terms that can be cut separately. The clock of the {ARM}, the small six-motor arm
            followed here, ticks 30 times a second, and it is kept by playing the chunk, one action per tick, so a
            model that needs several ticks to answer can still drive the arm. And the GPU memory of a fine-tune follows how much of the model trains: NVIDIA&apos;s default recipe
            for GR00T N1.7, a later model of the same line, freezes the backbone and stays under about 35
            GB, and NVIDIA recommends 80 GB or more per GPU once the backbone trains too.{' '}
            <Cite id="F02-20">pi0 paper, section IV and appendix D</Cite>{' '}
            <Cite id="F02-67">LeRobot so_follower.py and imitation learning tutorial</Cite>{' '}
            <Cite id="F02-37">NVIDIA GR00T N1.7 blog post</Cite>{' '}
            <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Follow pi0 on the ${ARM} from two camera frames and a sentence to a tensor of 50 actions by 32 numbers, and see what the head reads from the backbone`}
          >
            One call: the backbone reads once, the head refines a chunk
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            At the bench the visible change is a text box. A policy trained from scratch on fifty recordings of one
            task (section 4) does that one task: {TASK_STORY}. A VLA takes the task as an input. You type &quot;
            {INSTRUCTION}&quot; and the sentence goes into the model on every call, with the camera frames and the
            joint angles.{' '}
            <Cite id="F02-18">pi0 paper, section IV</Cite>
          </Box>
          <Box variant="p">
            The change that sets the cost is where the weights come from. The section 4 policy learned everything
            it knows from your fifty episodes. A VLA arrives already trained, on images and text from the web and
            on recordings from other robots, and your episodes only adapt it to this arm and this task. The
            pretraining is someone else&apos;s bill. Yours is the adaptation and the call.{' '}
            <Cite id="F02-32">pi0 paper, section IV, model size</Cite>{' '}
            <Cite id="F02-59">SmolVLA paper, section 4 and table 1</Cite>
          </Box>
          <Box variant="p">
            The backbone is a vision-language model (VLM): a network pretrained on images and text from the web
            that takes pictures and a prompt and writes text. It works on tokens, and a token is one vector the
            network processes. Each camera image is cut into small squares called patches (section 7, JEPA, draws
            the grid) and each patch becomes one token; the words of the instruction become tokens too. The row of
            image and text tokens that enters the backbone on one call is the prefix.
          </Box>
          <Box variant="p">
            A VLM alone writes words, and a servo needs numbers. The action head, which Physical Intelligence calls
            the action expert, is a second network that reads the backbone&apos;s work on the prefix and the
            robot&apos;s state (the six joint angles) and outputs an action chunk. What crosses from backbone to
            head is vectors, never text, and it crosses by attention, the transformer operation in which one token
            reads from others. pi0&apos;s action tokens attend to the keys and values the backbone&apos;s attention
            computed for the prefix. GR00T&apos;s head attends to the output vectors of its VLM.{' '}
            <Cite id="F02-20">pi0 paper, section IV and appendix D</Cite>{' '}
            <Cite id="F02-33">GR00T N1 paper, section 1</Cite>
          </Box>
          <Box variant="p">
            pi0&apos;s head uses flow matching, the method of section 4 that starts from random noise in the shape
            of the answer and refines it into an action chunk in a few steps. Announcements call these denoising
            steps. In LeRobot v0.7.0, the library that drives this arm, pi0&apos;s noise is a tensor of 50 rows by
            32 columns and the head takes 10 steps. The camera frames and the sentence do not change during those
            steps, so the backbone reads the prefix once, its results are cached, and each step re-runs only the
            head. One call is one backbone pass and ten head passes.{' '}
            <Cite id="F02-20">pi0 paper, section IV and appendix D</Cite>{' '}
            <Cite id="F02-29">LeRobot pi0 and pi0_fast configs</Cite>
          </Box>
          <Box variant="p">
            The 32 columns are there because one set of pi0 weights serves many robot bodies. State and action
            vectors have one fixed width, 32 in the released code (the paper&apos;s own models used 18), and the{' '}
            {ARM}&apos;s six numbers fill six slots with zeros in the rest. The host, the computer the arm plugs into, keeps the
            first six columns of the output and plays one row per tick.{' '}
            <Cite id="F02-23">pi0 paper, section V-A, and openpi pi0_config.py</Cite>{' '}
            <Cite id="F02-29">LeRobot pi0 and pi0_fast configs</Cite>
          </Box>
          <Figure
            cites="F02-18 F02-20 F02-23 F02-29 F02-32 F02-67"
            caption={
              <>
                One call of pi0 on the {ARM}, from the inputs to the motors. Green is the model, its two areas
                drawn to scale by parameter count; yellow is the robot. The grid is the action chunk, 50 rows by 32
                columns, at flow time <M>{String.raw`\tau`}</M> = 0 (pure noise), halfway and 1 (the finished
                chunk). Schematic: the camera views, the number of token cells and the values in the grid are drawn
                by hand.
              </>
            }
          >
            <VlaTokenFlow instruction={INSTRUCTION} />
          </Figure>
          <Box variant="p">
            What a new arm has to supply depends on how the model serves many robot bodies. A robot body, with its
            joints, sensors and action space, is called an embodiment. pi0 pads, so a new arm supplies nothing:
            its numbers go into the first slots. GR00T gives each embodiment its own
            small encoder and decoder around a shared head, so its fine-tune for this arm declares a new
            embodiment (<code>--embodiment-tag NEW_EMBODIMENT</code>). X-VLA, a 0.9B model in LeRobot, feeds the
            model 32 learned vectors per robot type, called soft prompts, and a fine-tune trains them: its authors
            report 93% success on LIBERO, a suite of simulated manipulation tasks, from tuning 9M parameters, 1% of
            the model.{' '}
            <Cite id="F02-33">GR00T N1 paper, section 1</Cite>{' '}
            <Cite id="F02-43">Isaac-GR00T SO100 and SO101 fine-tuning guide</Cite>{' '}
            <Cite id="F02-70">X-VLA paper, abstract</Cite>{' '}
            <Cite id="F02-82">LeRobot xvla config</Cite>
          </Box>
          <Box variant="p">
            In the pi line the head has grown and its step count has fallen: from pi0 to pi0.7 the head went from
            300M to 860M parameters and the steps from 10 to 5. Wherever both sizes are published the backbone is
            still the larger part, which is why freezing it decides the memory of a fine-tune.
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
                    'A 1.34B VLM; 2.2B in total',
                    'A DiT (diffusion transformer), a transformer used as the network that refines noise into actions, trained with flow matching',
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
                    'SmolVLM-2, of which only the first 16 language-model layers are used; 450M in total',
                    'About 100M, flow matching',
                    '50',
                    '10',
                  ]}
                  cite={<Cite id="F02-58">SmolVLA paper, section 4</Cite>}
                />
                <Row
                  cells={[
                    'GR00T N1.7 (April 2026)',
                    'Cosmos-Reason2-2B, feeding the head from its layer 16; 3B in total',
                    'A flow-matching DiT, 32 layers in the released checkpoint (the code default is 16)',
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
                    'A 4B VLM; about 5B in total with an encoder for recent video',
                    '860M, flow matching',
                    '50, of which 15 or 25 are played',
                    '5',
                  ]}
                  cite={<Cite id="F02-51">pi0.7 paper, section IV</Cite>}
                />
              </tbody>
            </table>
          </div>
          <ExpandableSection headerText="pi0's training loss and sampling step, in the paper's symbols">
            <SpaceBetween size="s">
              <Box variant="p">
                The pi0 paper writes the two rules of flow matching with the robot in them, where section 4 used a
                bare <M>x</M> for the chunk being built. A subscript is the robot&apos;s tick <M>t</M> and a
                superscript is flow time <M>{String.raw`\tau`}</M>, from 0 (pure noise) to 1 (finished chunk).{' '}
                <M>{String.raw`\mathbf{o}_t`}</M> is the observation: the camera frames, the sentence and the joint
                angles. <M>{String.raw`\mathbf{A}_t`}</M> is a demonstrated chunk that starts at tick <M>t</M>,{' '}
                <M>{String.raw`\epsilon`}</M> is noise of the same shape, and{' '}
                <M>{String.raw`\mathbf{A}_t^\tau = \tau \mathbf{A}_t + (1 - \tau) \epsilon`}</M> is their blend.
              </Box>
              <Box variant="p">
                <M>{String.raw`\mathbf{v}_\theta`}</M> is the action head with weights{' '}
                <M>{String.raw`\theta`}</M>: it reads the blend and the observation and outputs one velocity per
                number in the chunk.{' '}
                <M>{String.raw`\mathbf{u}(\mathbf{A}_t^\tau \mid \mathbf{A}_t) = \mathbf{A}_t - \epsilon`}</M> is
                the velocity it should output, the straight direction from the noise to the demonstration.{' '}
                <M>{String.raw`\mathbb{E}`}</M> is an average over the two pools named under it:{' '}
                <M>{String.raw`p(\mathbf{A}_t \mid \mathbf{o}_t)`}</M>, the demonstrated chunks that go with an
                observation, and <M>{String.raw`q(\mathbf{A}_t^\tau \mid \mathbf{A}_t)`}</M>, the noisy blends of
                one chunk. The superscript on <M>L</M> says this is the loss at one flow time; training draws a new{' '}
                <M>{String.raw`\tau`}</M> for every example, more often near the noisy end.{' '}
                <Cite id="F11-5">pi0 paper, section IV</Cite> Training minimises:
              </Box>
              <Formula
                name="pi0 training loss (conditional flow matching)"
                tex={String.raw`\begin{aligned} & L^\tau(\theta) = \mathbb{E}_{p(\mathbf{A}_t \mid \mathbf{o}_t), \, q(\mathbf{A}_t^\tau \mid \mathbf{A}_t)} \\ & \quad \big\lVert \mathbf{v}_\theta(\mathbf{A}_t^\tau, \mathbf{o}_t) - \mathbf{u}(\mathbf{A}_t^\tau \mid \mathbf{A}_t) \big\rVert^2 \end{aligned}`}
                source={<Cite id="F02-19">pi0 paper, section IV</Cite>}
              />
              <Box variant="p">
                <M>{String.raw`\mathbf{v}_\theta(\mathbf{A}_t^\tau, \mathbf{o}_t)`}</M> is one pass of the action
                head against the prefix. <M>{String.raw`\mathbf{u}`}</M> is the answer, known in training because
                the demonstration is known. The squared distance between the two is the whole loss for the action
                tokens. On the robot there is no demonstration, so the model starts from pure noise{' '}
                <M>{String.raw`\mathbf{A}_t^0`}</M> and follows its own velocities, a step of size{' '}
                <M>{String.raw`\delta`}</M> in flow time at a time:
              </Box>
              <Formula
                name="pi0 inference step (forward Euler)"
                tex={String.raw`\mathbf{A}_t^{\tau + \delta} = \mathbf{A}_t^\tau + \delta \, \mathbf{v}_\theta(\mathbf{A}_t^\tau, \mathbf{o}_t)`}
                source={<Cite id="F02-20">pi0 paper, section IV</Cite>}
              />
              <Box variant="p">
                The left side is the chunk a little further along in flow time. pi0 sets{' '}
                <M>{String.raw`\delta`}</M> to 0.1, so 10 steps carry <M>{String.raw`\tau`}</M> from 0 to 1: the 10
                refinement steps of the figure, each on a tensor of 50 rows by 32 columns.{' '}
                <M>{String.raw`\mathbf{o}_t`}</M> is the same in every step, which is why the prefix is read once
                and cached and only <M>{String.raw`\mathbf{v}_\theta`}</M> is computed again.{' '}
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
            description="Tell which of three things a quoted hertz figure counts, and get the head's real speed from the time to sample one chunk"
          >
            The slow rate counts backbone passes, the fast rate counts actions
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Reading a scene and a sentence takes a large network, and motors need a new target many times a second.
            The designs covered here meet that with two rates, and NVIDIA&apos;s GR00T N1 paper gave the two sides
            the names announcements still use. System 2 is the VLM, the slow side that reads. System 1 is the
            action head, the fast side that moves.{' '}
            <Cite id="F02-33">GR00T N1 paper, section 1</Cite>
          </Box>
          <Box variant="p">
            The slow rate sets how old the arm&apos;s information is. Call one backbone pass over the scene a plan.
            At the paper&apos;s two rates, 120 / 10 = 12 actions leave on each plan, and plans arrive 1000 / 10 ={' '}
            <Derived>100</Derived> ms apart. The twelfth action leaves when its plan is almost{' '}
            <Derived>100</Derived> ms old, on top of the time the plan took to compute. Every action is decided
            from camera frames already in the past, and the slow rate sets how far.{' '}
            <Cite id="F02-33">GR00T N1 paper, section 1</Cite>
          </Box>
          <AnimatedFigure
            name="two clocks"
            steps={VLA_CLOCK_STEPS}
            intervalMs={2600}
            cites="F02-33"
            caption={
              <>
                The paper&apos;s two rates on one time axis: 10 plans a second and 120 actions a second. A plan block
                spans the time it takes to compute (one slow tick), and the actions that use it sit under the next
                block. A schematic from the two rates, not a measurement; the chunks of 16 in which the head
                samples those actions are not drawn.
              </>
            }
          >
            {(step, reduced) => <VlaTwoClocks step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            The fast rate says less about the head than it appears to, because it counts actions, and an action is
            one row of a chunk. It is a product of the chunk length and of how often the head produces a chunk:
          </Box>
          <Formula
            name="Action rate"
            tex={String.raw`\frac{\text{actions}}{\text{second}} = \frac{\text{actions}}{\text{chunk}} \times \frac{\text{chunks}}{\text{second}}`}
          />
          <Box variant="p">
            The first factor is free: a longer chunk raises the action rate with no extra compute. The second is
            the real speed of the network, and the paper&apos;s 63.9 ms bounds it (the paper does not say whether
            that time includes a backbone pass). For GR00T N1, 120 actions a second in chunks of 16 need 120 / 16 ={' '}
            <Derived>7.5</Derived> chunks a second, and the timing allows 15.6. So the two
            clocks of the announcement rest on a number it leaves out. The scene is read 10 times a second, 120
            actions a second leave, and in between the head has to sample <Derived>7.5</Derived> chunks a second
            and can sample 15.6.{' '}
            <Cite id="F02-33">GR00T N1 paper, section 1</Cite>{' '}
            <Cite id="F02-34">GR00T N1 paper, sections 2 and 3</Cite>
          </Box>
          <Box variant="p">
            When an announcement quotes a fast rate, ask whether it counts actions or chunks, and which passes the
            timing behind it includes.
          </Box>
          <Box variant="p">
            On the {ARM} the fast clock is the host, which plays 30 actions a second, and the slow clock is a
            configuration value: the number of actions played before the model is called again. SmolVLA returns 50
            actions per call and LeRobot&apos;s default plays all 50, so the model is called once every 50 / 30 ={' '}
            <Derived>1.67</Derived> s. GR00T N1.7&apos;s code default is a chunk of 40, and LeRobot&apos;s example
            for a new arm overrides it to predict and play 16 (<code>--policy.chunk_size=16
            --policy.n_action_steps=16</code>), a call every 16 / 30 = <Derived>0.53</Derived> s. Between calls the arm acts on what the cameras showed
            at the last one (section 4 prices that blind interval).{' '}
            <Cite id="F02-62">LeRobot configuration_smolvla.py</Cite>{' '}
            <Cite id="F02-67">LeRobot so_follower.py and imitation learning tutorial</Cite>{' '}
            <Cite id="F02-38">Isaac-GR00T gr00t_n1d7.py and the released checkpoint config</Cite>{' '}
            <Cite id="F02-81">LeRobot groot guide</Cite>
          </Box>
          <Box variant="p">
            Where a design cuts between slow and fast decides which machine each side runs on. Four cuts are in
            use, each further from the motors. The last two put the slow side on another machine, and the chunk
            is what covers the delay the distance adds.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Inside one network.</strong> pi0.5 (April 2025) first writes a short text subtask such as
              &quot;pick up the cutting board&quot;, then produces the action chunk conditioned on it. One set of
              weights on one GPU does both.{' '}
              <Cite id="F02-48">pi0.5 paper, section I</Cite>
            </li>
            <li>
              <strong>Two modules on one GPU.</strong> The GR00T N1 line, up to N1.7, puts a VLM and a DiT action
              head side by side, and its model card times the two separately.{' '}
              <Cite id="F02-37">NVIDIA GR00T N1.7 blog post</Cite>{' '}
              <Cite id="F02-40">GR00T N1.7 model card, inference timing table</Cite>
            </li>
            <li>
              <strong>A network link between them.</strong> The first Gemini Robotics (March 2025) hosted its
              backbone in the cloud and ran a small action decoder on the robot. Google DeepMind&apos;s report gives
              under 160 ms for the backbone&apos;s answer, about 250 ms from observation to action chunk, and an
              effective 50 Hz of control because each chunk holds many actions.{' '}
              <Cite id="F02-78">Gemini Robotics tech report, section 3.1</Cite>
            </li>
            <li>
              <strong>An agent on top.</strong> In GR00T 2 a general reasoning model plays System 2 and calls the
              action model as a tool. The reasoning model is the only part that runs off the robot.{' '}
              <Cite id="F02-45">NVIDIA GR00T 2 research page, Agentic Control</Cite>
            </li>
          </ul>
          <Box variant="p">
            GR00T 2 is NVIDIA&apos;s current design, and under the agent it changes the action model too. It is a
            world action model: one diffusion transformer refines future video and the action chunk together, so
            the model predicts what the camera will see as well as what the robot should do (section 6, World
            Models).{' '}
            <Cite id="F02-44">NVIDIA GR00T 2 research page, Model Architecture</Cite>
          </Box>
          <Box variant="p">
            Its on-robot variant, GR00T 2 Turbo, splits the fast side again. NVIDIA reports one prediction in 38
            ms on an RTX 5090 desktop GPU and 124 ms on a Jetson Thor, an NVIDIA onboard computer for robots,
            where the model plans 1.6 s chunks about once per second and a separate controller executes them at
            50 Hz. {GROOT2_LABEL}{' '}
            <Cite id="F02-45">NVIDIA GR00T 2 research page, GR00T 2 Turbo</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Split a published latency into seeing, reading and action steps, and check the build, the checkpoint and the camera count before comparing two of them"
          >
            Where the milliseconds of one call go
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One call has a part that runs once and a part that repeats. The images are encoded and the backbone
            reads the prefix once; the action head then runs once per refinement step. With{' '}
            <M>{String.raw`t_{\mathrm{see}}`}</M> the time in the image encoders,{' '}
            <M>{String.raw`t_{\mathrm{read}}`}</M> the backbone&apos;s pass over the prefix, <M>K</M> the number
            of refinement steps, <M>{String.raw`t_{\mathrm{step}}`}</M> the time of one action-head pass and{' '}
            <M>{String.raw`t_{\mathrm{call}}`}</M> the time of the whole call:
          </Box>
          <Formula
            name="Time of one VLA call"
            tex={String.raw`t_{\mathrm{call}} = t_{\mathrm{see}} + t_{\mathrm{read}} + K \, t_{\mathrm{step}}`}
          />
          <Box variant="p">
            The first two terms grow with the number of cameras and the size of the backbone. The last grows with
            the step count and the size of the head. For pi0 on an RTX 4090 with 3 cameras, its authors report 14
            ms in the image encoders, 32 ms in the backbone pass and 27 ms for the ten action passes: 73 ms in
            total, 46 of them spent seeing and reading. Cutting pi0&apos;s steps would work on the smaller share.{' '}
            <Cite id="F02-21">pi0 paper, appendix D, table I</Cite>
          </Box>
          <Box variant="p">
            GR00T N1.7 divides the other way. NVIDIA&apos;s model card times it with 4 refinement steps and 1
            camera on an H100 data-centre GPU, and in plain PyTorch it lists 31.3 ms for the backbone and 48.2 ms
            for the action head. The side called fast is the costlier one here: fast names the rate at which
            actions leave, because each call returns a whole chunk. So the term to shrink depends on the model,
            the reading in pi0 and the head in N1.7.{' '}
            <Cite id="F02-40">GR00T N1.7 model card, inference timing table</Cite>
          </Box>
          <Box variant="p">
            The same card shows how much of a published latency is the build. With TensorRT, NVIDIA&apos;s compiler
            that turns a trained network into an optimised inference engine, the stages on the H100 are 6.2 ms of
            data processing, 8.8 ms in the backbone and 12.3 ms in the action head, beside a printed end-to-end
            figure of 27.9 ms (35.9 Hz).{' '}
            <Cite id="F02-40">GR00T N1.7 model card, inference timing table</Cite>
          </Box>
          <Box variant="p">
            A latency without its build, its checkpoint and its camera count cannot be set beside another. NVIDIA
            alone publishes three for GR00T N1.7 on one Jetson AGX Thor, and the slowest is 93.8 / 35.6 ={' '}
            <Derived>2.6</Derived> times the fastest.{' '}
            <Cite id="F02-40">GR00T N1.7 model card, inference timing table</Cite>{' '}
            <Cite id="F02-41">Isaac-GR00T deployment README, benchmark results</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>93.8 ms (10.7 Hz).</strong> The model card: TensorRT, 1 camera.{' '}
              <Cite id="F02-40">GR00T N1.7 model card, inference timing table</Cite>
            </li>
            <li>
              <strong>76.8 ms.</strong> The repository&apos;s deployment guide: TensorRT, a different checkpoint,
              two cameras. Section 17, Running on the Robot, works with this one.{' '}
              <Cite id="F02-41">Isaac-GR00T deployment README, benchmark results</Cite>
            </li>
            <li>
              <strong>35.6 ms, the &quot;~28 Hz&quot; of the repository&apos;s front page.</strong> The same guide,
              with the model also quantised (its numbers stored at lower precision) in a format NVIDIA calls
              NVFP4.{' '}
              <Cite id="F02-41">Isaac-GR00T deployment README, benchmark results</Cite>
            </li>
          </ul>
          <Box variant="p">
            pi0.7 is served from a data centre. Its authors report running it on one H100: 38 ms per call in the
            minimal configuration (3 cameras, 5 refinement steps) and 127 ms in the worst case, with its two
            options switched on: an encoder for recent video, and generated images of the next subgoal added to
            the prompt.{' '}
            <Cite id="F02-51">pi0.7 paper, section IV</Cite>{' '}
            <Cite id="F02-52">pi0.7 paper, appendix D</Cite> Section 17, Running on the Robot, sets latencies like
            these against the tick.
          </Box>
          <Box variant="p">
            Every term of the call is tensor arithmetic on a GPU, and the GPU also has to hold the weights: the
            requirement is more than 8 GB of memory to run pi0 and 16 GB to run GR00T N1.7.{' '}
            <Cite id="F02-54">openpi README, requirements</Cite>{' '}
            <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite> In our reading, capturing and decoding the
            camera frames is separate work for the CPU or the GPU&apos;s video engine, and a published latency
            includes it only where the table says so, as the data-processing stage of NVIDIA&apos;s card does.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Size the GPU memory of a fine-tune from what is frozen, and confirm the run you started trains the weights you meant"
          >
            What one GPU can fine-tune is set by how much of the backbone trains
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Pretraining is out of a reader&apos;s reach, which is why the fine-tune is the job to size.
            NVIDIA&apos;s paper puts GR00T N1 at roughly 50,000 H100 GPU-hours on up to 1,024 GPUs.{' '}
            <Cite id="F02-34">GR00T N1 paper, sections 2 and 3</Cite> Even SmolVLA, at 450M parameters, took
            about 30k GPU-hours across its authors&apos; whole project, as they report.{' '}
            <Cite id="F02-58">SmolVLA paper, section 4</Cite>{' '}
            <Cite id="F02-59">SmolVLA paper, section 4 and table 1</Cite>
          </Box>
          <Box variant="p">
            The backbone-and-head split sets the size of a fine-tune. A weight that trains needs a
            gradient and optimiser state in GPU memory, and a frozen one needs neither (section 15, Training at
            Three Scales). SmolVLA trains only its action expert, about 100M of its 450M parameters. GR00T
            N1.7&apos;s default recipe trains the action head and the small layer that feeds it, keeps the VLM
            frozen and stays under about 35 GB, and NVIDIA sets a minimum of one 40 GB GPU for it. A 24 GB card is
            under that minimum. With the VLM unfrozen, NVIDIA recommends 80 GB or more per GPU.{' '}
            <Cite id="F02-58">SmolVLA paper, section 4</Cite>{' '}
            <Cite id="F02-62">LeRobot configuration_smolvla.py</Cite>{' '}
            <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite>
          </Box>
          <Box variant="p">
            The same choice shows up as batch size on a fixed card. NVIDIA&apos;s GR00T N1 paper tested fine-tuning
            on a single A6000 GPU: a batch of up to 200 when only the action head and the small per-robot layers
            around it train, and up to 16 once the vision encoder trains too.{' '}
            <Cite id="F02-34">GR00T N1 paper, sections 2 and 3</Cite>
          </Box>
          <Box variant="p">
            Between frozen and full sits LoRA (low-rank adaptation), a fine-tune that trains small added matrices
            and leaves the base weights frozen. For the pi0 family, openpi&apos;s table asks for more than 22.5 GB
            for a LoRA fine-tune and more than 70 GB for a full one.{' '}
            <Cite id="F02-54">openpi README, requirements</Cite> LeRobot&apos;s pi0.5 example is sized for a
            single 80 GB GPU.{' '}
            <Cite id="F02-57">LeRobot pi05 guide</Cite> A 7B backbone trained in full leaves the one-GPU size: the
            OpenVLA-OFT authors fine-tuned across 8 A100 or H100 GPUs.{' '}
            <Cite id="F02-69">OpenVLA-OFT paper, section V</Cite>
          </Box>
          <Box variant="p">
            Check which of these runs you started. LeRobot v0.7.0 has one LoRA switch for every policy,{' '}
            <code>--peft.method_type=LORA</code>, and its release notes record a fix: before it,{' '}
            <code>--policy.use_peft=true</code> alone ran a full fine-tune without saying so. Read the count of
            trainable parameters the trainer prints before you trust a memory figure.{' '}
            <Cite id="F02-83">LeRobot v0.7.0 release notes and PEFT guide</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Pick the model to fine-tune for an ${ARM} today, and know which of the models in the news exist only as a paper or a post`}
          >
            What you can download trails what is published
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The model in the news and the model you can fine-tune are usually different models. The newest pi
            model with a paper is pi0.7, and the newest with weights is pi0.5. GR00T 2 is a research page and a
            whitepaper, and the newest GR00T with weights is N1.7: GR00T 2 is the current GR00T to learn from, and
            N1.7 the current GR00T to run. The Gemini Robotics VLA models of July 2026 went to early-access
            partners.{' '}
            <Cite id="F02-53">openpi README, updates and checkpoints</Cite>{' '}
            <Cite id="F02-37">NVIDIA GR00T N1.7 blog post</Cite>{' '}
            <Cite id="F02-44">NVIDIA GR00T 2 research page</Cite>{' '}
            <Cite id="F02-75">Google DeepMind, Gemini Robotics 2 post</Cite>
          </Box>
          <Figure
            cites="F02-34 F02-37 F02-44 F02-48 F02-50 F02-51 F02-53 F02-58 F02-68 F02-74 F02-75 F02-77 F02-78 F02-79"
            caption={
              <>
                Each row is one line of models; read left to right for its releases. Filled markers can be
                downloaded, hollow ones cannot as far as the sources read on 2026-11-20 state. GR00T N1.5 and N1.6,
                between N1 and N1.7, are not drawn.
              </>
            }
          >
            <ReleaseTimeline />
          </Figure>
          <Box variant="p">
            What an {ARM} owner can fine-tune is set by one library. LeRobot v0.7.0, released 2026-11-05, ships 28
            policy packages behind one command, <code>lerobot-train --policy.type=...</code>, and four of them come
            first on this arm.{' '}
            <Cite id="F02-65">LeRobot v0.7.0 policies directory</Cite>{' '}
            <Cite id="F02-102">LeRobot v0.7.0 policies directory, all 28 packages</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>
                <code>smolvla</code>, the first VLA to fine-tune.
              </strong>{' '}
              LeRobot&apos;s guide starts from the 450M checkpoint, fine-tunes on about 50 recorded episodes and
              puts 20,000 steps at roughly 4 hours on a single A100 GPU.{' '}
              <Cite id="F02-63">LeRobot SmolVLA guide</Cite> It is also the model behind the one published result
              close to this task. On an {ARM} pick-and-place task with 50 demonstrations, the SmolVLA authors
              report 90% success against 70% for ACT (Action Chunking with Transformers), the small
              trained-from-scratch policy of section 4, when the object starts where the demonstrations started (in
              distribution), and 50% against 40% when it starts somewhere new (out of distribution). The second
              pair is the figure for a block that is not where you practised. SmolVLA had seen no {ARM} data before those 50 demonstrations.{' '}
              <Cite id="F02-60">SmolVLA paper, table 4</Cite>
            </li>
            <li>
              <strong>
                <code>act</code>, the baseline to beat.
              </strong>{' '}
              It is LeRobot&apos;s own recommendation for a first policy: small, trained from scratch on your
              recordings, with no pretrained model to download. Train it on the same episodes, so that a VLA&apos;s
              success rate has something to be compared with.{' '}
              <Cite id="F02-66">LeRobot ACT guide</Cite>
            </li>
            <li>
              <strong>
                <code>groot</code>, with a 40 GB GPU.
              </strong>{' '}
              This is GR00T N1.7, the newest GR00T you can run, and NVIDIA&apos;s repository has its own guide for
              fine-tuning it on the SO-100 and {ARM}.{' '}
              <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite>{' '}
              <Cite id="F02-43">Isaac-GR00T SO100 and SO101 fine-tuning guide</Cite> LeRobot v0.7.0 supports N1.7
              only: its <code>groot</code> policy rejects N1.5 checkpoints and tells you to pin{' '}
              <code>lerobot==0.5.1</code> to keep using them, so a 2025 tutorial for N1.5 on this arm fails on
              the current release.{' '}
              <Cite id="F02-47">LeRobot configuration_groot.py</Cite>
            </li>
            <li>
              <strong>
                <code>pi05</code>, with an 80 GB GPU.
              </strong>{' '}
              pi0.5 through LeRobot is the practical pi model for this arm, and LeRobot has added optional memory
              of recent frames and joint readings to it.{' '}
              <Cite id="F02-57">LeRobot pi05 guide</Cite>{' '}
              <Cite id="F02-56">LeRobot pi05 guide and config</Cite>
            </li>
          </ul>
          <Box variant="p">
            Three more packages ship a first-party checkpoint for this arm, and each comes with a condition.{' '}
            <code>molmoact2</code> was trained under an older calibration convention, and without a correction the
            arm may move in the wrong direction; the converted LeRobot checkpoint already applies it.{' '}
            <code>g05</code> comes with a fine-tune command and a non-commercial licence. <code>flux3</code>, a 7B
            world action model, has a one-GPU LoRA recipe on an {ARM} dataset, and full fine-tuning is left to
            its vendor&apos;s own repository.{' '}
            <Cite id="F02-97">LeRobot molmoact2 guide</Cite> <Cite id="F02-91">LeRobot g05 guide</Cite>{' '}
            <Cite id="F02-90">LeRobot flux3 guide</Cite>
          </Box>

          <ExpandableSection headerText="For lookup: each line, release by release">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>The pi line.</strong> pi*0.6 (November 2025) moved to a Gemma 3 backbone of 4B parameters
                with an 860M action expert, and added learning from the robot&apos;s own attempts, a form of the
                reinforcement learning of section 8, Reinforcement Learning for Robots.{' '}
                <Cite id="F02-50">pi*0.6 paper, abstract and section V</Cite> pi0.7 (first posted 16 April 2026)
                is the newest Physical Intelligence model with a paper as of 2026-11-20. Its prompt carries more
                than a sentence: also notes about the episode and generated images of the next subgoal.{' '}
                <Cite id="F02-51">pi0.7 paper, section IV</Cite> openpi, the company&apos;s open repository, holds
                pi0, pi0-FAST and pi0.5 only and offers no pi*0.6 or pi0.7 weights. A company post of 2026-10-13
                offers hosted training and inference through an API beta with a waitlist.{' '}
                <Cite id="F02-53">openpi README, updates and checkpoints</Cite>
              </Box>
              <Box variant="p">
                <strong>The GR00T line.</strong> N1.5 (2025) froze the VLM during training.{' '}
                <Cite id="F02-35">NVIDIA GR00T N1.5 page</Cite> N1.6 (December 2025) doubled the action head to 32
                layers.{' '}
                <Cite id="F02-36">NVIDIA GR00T N1.6 page</Cite> N1.7 (blog post 17 April 2026, release tag 18
                April 2026) is the newest GR00T with released weights and code as of 2026-11-20. NVIDIA states it
                was pretrained with 20,854 hours of egocentric human video, video shot from the point of view of
                the person doing the task.{' '}
                <Cite id="F02-37">NVIDIA GR00T N1.7 blog post</Cite> Its released checkpoint has a 32-layer action
                head, where the repository&apos;s code default is 16, so read the layer count from the
                configuration of the checkpoint you load. In the code the chunk is{' '}
                <code>action_horizon = 40</code> and the padded width is <code>max_action_dim = 132</code>.{' '}
                <Cite id="F02-38">Isaac-GR00T gr00t_n1d7.py and the released checkpoint config</Cite>
              </Box>
              <Box variant="p">
                <strong>GR00T 2.</strong> The project page calls its on-robot variant, GR00T 2 Turbo, a smaller
                transformer and prints 2B parameters for it, the same figure the whitepaper gives for the full
                model (section 6); NVIDIA&apos;s two documents do not reconcile them.{' '}
                <Cite id="F02-45">NVIDIA GR00T 2 research page, GR00T 2 Turbo</Cite> NVIDIA reports how fast the
                model adapts: on 50 tasks that NVIDIA selected as ones the model learns from five episodes, it
                succeeds in 40% of trials with no demonstration of the task and in 95% after five demonstrations
                and one fine-tune of about 30 minutes on an RTX 5090. That fine-tune is a LoRA. NVIDIA&apos;s
                whitepaper notes that the five-episode rate is high partly by construction. {GROOT2_LABEL}{' '}
                <Cite id="F02-46">NVIDIA GR00T 2 research page, Fast Adaptation</Cite>
              </Box>
              <Box variant="p">
                <strong>SmolVLA.</strong> The small end of the range: 450M parameters with about 100M in the
                action expert, the VLM frozen during training, 50-action chunks in 10 steps.{' '}
                <Cite id="F02-58">SmolVLA paper, section 4</Cite> LeRobot v0.7.0&apos;s defaults match the paper.{' '}
                <Cite id="F02-62">LeRobot configuration_smolvla.py</Cite>
              </Box>
              <Box variant="p">
                <strong>OpenVLA-OFT.</strong> A 7B VLA of February 2025 that wrote actions as tokens one at a time,
                with its head changed to predict the whole chunk in one parallel pass, as plain numbers. On
                LIBERO its authors report success
                rising from 76.5% to 97.1% with 26x the action throughput. LeRobot v0.7.0 has no package of that
                name.{' '}
                <Cite id="F02-68">OpenVLA-OFT paper, abstract</Cite>{' '}
                <Cite id="F02-102">LeRobot v0.7.0 policies directory, all 28 packages</Cite>
              </Box>
              <Box variant="p">
                <strong>Gemini Robotics.</strong> Gemini Robotics 2.5 (10 November 2026) is the newest Gemini
                Robotics VLA located. Google DeepMind states it was tested on over 200 tasks; the post gives no
                parameter count, training compute or latency.{' '}
                <Cite id="F02-74">Google DeepMind, Gemini Robotics 2.5 post</Cite> Gemini Robotics 2 (30 July
                2026) came as three models that map onto the two clocks: a VLA, a reasoning VLM that acts as the
                agent, and an on-device VLA built to run on the robot. Only the reasoning model is generally
                reachable, as a hosted API.{' '}
                <Cite id="F02-75">Google DeepMind, Gemini Robotics 2 post</Cite> The same post shows the on-device
                model adapted to the {ARM}, in a two-arm setup and behind early access.{' '}
                <Cite id="F02-76">Google DeepMind, Gemini Robotics 2 post, on-device adaptation</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="For lookup: all 28 policy packages in LeRobot v0.7.0, sorted by how sure the fit to the arm is">
            <SpaceBetween size="s">
              <Box variant="p">
                Packages with a documented path to the {ARM} come first, then fits &quot;by shape&quot;, then the three
                with no path. By shape means the package&apos;s padding or dataset code admits six state numbers,
                six action numbers and one or two cameras, and no recipe for the arm was found. The column is read from code and documentation; none of the 28 was run on
                the arm for it. The chunk column gives actions predicted and played per call at the package&apos;s
                defaults.{' '}
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
            description="Place the fine-tune and the call on a machine, and test any announced rate with one division"
          >
            Two jobs for a GPU: a fine-tune gated by memory, a call gated by the chunk
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A VLA gives a GPU two jobs. The fine-tune is a single-GPU run of hours, and GPU memory is what it
            exhausts first, set by how much of the backbone trains (section 15, Training at Three Scales, sets it
            beside the multi-GPU and multi-node sizes). The call on the arm is the same arithmetic against a
            deadline that the chunk sets: it has to return before the actions already handed over run out
            (section 17, Running on the Robot).
          </Box>
          <Box variant="p">
            On an {ARM}, fine-tune <code>smolvla</code> first, from <code>lerobot/smolvla_base</code>, on the same
            50 episodes you recorded for ACT: the published result on this arm is 90% against ACT&apos;s 70%, as
            the SmolVLA authors report. Move to <code>groot</code> when you have a 40 GB GPU.{' '}
            <Cite id="F02-60">SmolVLA paper, table 4</Cite>{' '}
            <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite>
          </Box>
          <Box variant="p">
            For any other announcement, find four numbers before you size anything: the parameters in the backbone
            and in the head, the actions per chunk, and the time to sample one chunk on a named device and build.
            The time gives chunks per second, and chunks per second times the chunk length is the most actions per
            second the head can supply. GR00T N1&apos;s 120 Hz rests on a head that samples 15.6 chunks a second,
            each of 16 actions.{' '}
            <Cite id="F02-33">GR00T N1 paper, section 1</Cite>{' '}
            <Cite id="F02-34">GR00T N1 paper, sections 2 and 3</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
