import type { CSSProperties, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Derived } from '../components/Cite';
import { Figure, AnimatedFigure } from '../components/Figure';
import { ARM, TASK_STORY } from '../lib/task';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const ROBOT_FILL = '#fff6d6';
const ROBOT_INK = '#7a5c00';
const GPU_FILL = '#e6f6ea';
const GPU_INK = '#1e7b3a';
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
/* Diagram 5.1: one VLA as blocks, with shapes on the arrows                */
/* ------------------------------------------------------------------------ */

function VlaBlocks() {
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 558" role="img" aria-labelledby="vla-blocks-title" style={{ width: '100%', height: 'auto' }}>
        <title id="vla-blocks-title">One vision-language-action model as blocks: pi0 with the SO-101&apos;s shapes</title>
        <desc>
          Two camera images and one sentence enter the backbone, a vision-language model. Its tokens, the prefix, pass
          to the action head. Six joint angles, zero-padded to 32, also enter the action head. The action head starts
          from noise shaped 50 by 32 and refines it in 10 steps into a chunk of 50 actions, of which the first six
          columns are the arm&apos;s joint targets.
        </desc>
        <defs>
          <marker id="vla-blocks-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill={NEUTRAL_INK} />
          </marker>
        </defs>
        <rect x="0" y="0" width="400" height="558" fill="#fbfbfd" />

        {/* inputs */}
        <rect x="10" y="12" width="120" height="54" rx="4" fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1.5" />
        <text x="70" y="34" textAnchor="middle" {...TITLE}>
          2 cameras
        </text>
        <text x="70" y="52" textAnchor="middle" {...LABEL}>
          640 x 480 pixels
        </text>
        <rect x="140" y="12" width="120" height="54" rx="4" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <text x="200" y="34" textAnchor="middle" {...TITLE}>
          Instruction
        </text>
        <text x="200" y="52" textAnchor="middle" {...LABEL}>
          one sentence
        </text>
        <rect x="270" y="12" width="120" height="54" rx="4" fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1.5" />
        <text x="330" y="34" textAnchor="middle" {...TITLE}>
          6 joint angles
        </text>
        <text x="330" y="52" textAnchor="middle" {...LABEL}>
          the arm&apos;s state
        </text>

        {/* cameras and instruction into the backbone */}
        <line x1="70" y1="68" x2="70" y2="118" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#vla-blocks-arrow)" />
        <text x="79" y="98" {...LABEL}>
          image tokens
        </text>
        <line x1="200" y1="68" x2="200" y2="118" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#vla-blocks-arrow)" />
        <text x="209" y="98" {...LABEL}>
          text tokens
        </text>

        {/* backbone */}
        <rect x="10" y="122" width="252" height="92" rx="4" fill={GPU_FILL} stroke={GPU_INK} strokeWidth="1.5" />
        <text x="22" y="144" {...TITLE}>
          Backbone
        </text>
        <text x="22" y="162" {...LABEL}>
          a vision-language model (PaliGemma)
        </text>
        <text x="22" y="180" {...LABEL}>
          3B parameters, pretrained on the web
        </text>
        <text x="22" y="198" {...LABEL}>
          reads images and text once per call
        </text>

        {/* state straight to the action head */}
        <line x1="372" y1="68" x2="372" y2="296" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#vla-blocks-arrow)" />
        <text x="364" y="170" textAnchor="end" {...LABEL}>
          zero-padded
        </text>
        <text x="364" y="186" textAnchor="end" {...LABEL}>
          from 6 to 32
        </text>

        {/* backbone to action head */}
        <line x1="70" y1="216" x2="70" y2="296" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#vla-blocks-arrow)" />
        <text x="80" y="248" {...LABEL}>
          prefix: the image and text tokens,
        </text>
        <text x="80" y="264" {...LABEL}>
          computed once, then cached
        </text>

        {/* action head */}
        <rect x="10" y="300" width="380" height="96" rx="4" fill={GPU_FILL} stroke={EMPHASIS} strokeWidth="2.5" />
        <text x="22" y="322" {...TITLE}>
          Action head (the action expert)
        </text>
        <text x="22" y="340" {...LABEL}>
          300M parameters, initialised from scratch
        </text>
        <text x="22" y="358" {...LABEL}>
          starts from random noise shaped 50 x 32
        </text>
        <text x="22" y="376" {...LABEL}>
          refines it in 10 steps, reading the prefix at each step
        </text>

        {/* out */}
        <line x1="200" y1="398" x2="200" y2="446" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#vla-blocks-arrow)" />
        <text x="210" y="427" {...LABEL}>
          action chunk, 50 x 32
        </text>
        <rect x="10" y="450" width="380" height="96" rx="4" fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1.5" />
        <text x="22" y="472" {...TITLE}>
          50 future actions
        </text>
        <text x="22" y="490" {...LABEL}>
          columns 1 to 6: the SO-101&apos;s six joint targets
        </text>
        <text x="22" y="508" {...LABEL}>
          columns 7 to 32: padding, dropped
        </text>
        <text x="22" y="526" {...LABEL}>
          the host plays them at 30 per second
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 5.2 (animated): two clocks                                       */
/* ------------------------------------------------------------------------ */

const CLOCK_STEPS = [
  'Camera frames and the instruction enter the slow system, the vision-language model.',
  'It reads them and emits plan A: a set of output tokens that tells the action head what to do. Producing one plan takes one slow tick.',
  'The fast system starts emitting actions from plan A. The slow system is already reading newer frames.',
  'More actions leave on the same plan. The slow system has not answered again yet.',
  'Twelve actions have gone out on one plan. That is the ratio of the two rates: 120 actions a second against 10 plans a second.',
  'The slow system delivers plan B. The fast system picks it up on its next action and never stops.',
];

const FAST_CELLS = Array.from({ length: 24 }, (_, i) => i);
const CELL_PITCH = 340 / 24;

function TwoClocks({ step, reduced }: { step: number; reduced: boolean }) {
  const s = step + 1;
  const fade = (on: boolean): CSSProperties => ({ opacity: on ? 1 : 0, transition: reduced ? 'none' : 'opacity 300ms ease' });
  const filled = s >= 6 ? 16 : s === 5 ? 12 : s === 4 ? 8 : s === 3 ? 4 : 0;
  const hot = (on: boolean, ink: string) => ({ stroke: on ? EMPHASIS : ink, strokeWidth: on ? 2.5 : 1 });
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 408" role="img" aria-labelledby="vla-clocks-title" style={{ width: '100%', height: 'auto' }}>
        <title id="vla-clocks-title">Two clocks: a slow system that updates a plan and a fast system that emits actions</title>
        <desc>
          Two stacked lanes. The slow system at the top, a vision-language model, produces 10 plans a second. The fast
          system below, the action head, emits 120 actions a second, so twelve actions leave on each plan. When a new
          plan arrives the fast system switches to it without pausing.
        </desc>
        <defs>
          <marker id="vla-clocks-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill={NEUTRAL_INK} />
          </marker>
        </defs>
        <rect x="0" y="0" width="400" height="408" fill="#fbfbfd" />

        {/* inputs */}
        <rect x="60" y="10" width="280" height="38" rx="4" fill={ROBOT_FILL} {...hot(s === 1, ROBOT_INK)} />
        <text x="200" y="34" textAnchor="middle" {...LABEL}>
          camera frames + the instruction
        </text>
        <line x1="200" y1="50" x2="200" y2="72" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#vla-clocks-arrow)" />

        {/* slow lane */}
        <rect x="10" y="76" width="380" height="110" rx="4" fill={GPU_FILL} {...hot(s === 1 || s === 2 || s === 6, GPU_INK)} />
        <text x="24" y="98" {...TITLE}>
          Slow system (System 2)
        </text>
        <text x="24" y="116" {...LABEL}>
          vision-language model: 10 plans a second
        </text>
        <rect x="30" y="130" width="170" height="40" fill="none" stroke={GPU_INK} strokeWidth="1" strokeDasharray="3 3" />
        <rect x="200" y="130" width="170" height="40" fill="none" stroke={GPU_INK} strokeWidth="1" strokeDasharray="3 3" />
        <text x="115" y="155" textAnchor="middle" {...LABEL} style={fade(s === 1)}>
          slow tick 1: reading
        </text>
        <text x="285" y="155" textAnchor="middle" {...LABEL} style={fade(s <= 5)}>
          slow tick 2
        </text>
        <g style={fade(s >= 2)}>
          <rect x="30" y="130" width="170" height="40" fill={GPU_INK} />
          <text x="115" y="155" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill="#ffffff">
            plan A
          </text>
        </g>
        <g style={fade(s >= 6)}>
          <rect x="200" y="130" width="170" height="40" fill={EMPHASIS} />
          <text x="285" y="155" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill="#ffffff">
            plan B
          </text>
        </g>

        {/* plans handed down */}
        <g style={fade(s >= 2)}>
          <line x1="50" y1="188" x2="50" y2="208" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#vla-clocks-arrow)" />
          <text x="60" y="203" {...LABEL}>
            output tokens
          </text>
        </g>
        <g style={fade(s >= 6)}>
          <line x1="220" y1="188" x2="220" y2="208" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#vla-clocks-arrow)" />
          <text x="230" y="203" {...LABEL}>
            output tokens
          </text>
        </g>

        {/* fast lane */}
        <rect x="10" y="212" width="380" height="110" rx="4" fill={GPU_FILL} {...hot(s >= 3, GPU_INK)} />
        <text x="24" y="234" {...TITLE}>
          Fast system (System 1)
        </text>
        <text x="24" y="252" {...LABEL}>
          action head: 120 actions a second
        </text>
        {FAST_CELLS.map((i) => {
          const on = i < filled;
          const ink = i < 12 ? GPU_INK : EMPHASIS;
          return (
            <rect
              key={i}
              x={30 + i * CELL_PITCH}
              y="264"
              width="12"
              height="24"
              fill={on ? ink : '#ffffff'}
              stroke={on ? ink : NEUTRAL_INK}
              strokeWidth="1"
            />
          );
        })}
        <text x="30" y="308" {...LABEL} style={fade(s <= 2)}>
          one cell is one action; none emitted yet
        </text>
        <text x="115" y="308" textAnchor="middle" {...LABEL} style={fade(s >= 3)}>
          from plan A
        </text>
        <text x="285" y="308" textAnchor="middle" {...LABEL} style={fade(s >= 6)}>
          from plan B
        </text>

        {/* out */}
        <line x1="200" y1="324" x2="200" y2="346" stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#vla-clocks-arrow)" />
        <rect x="60" y="350" width="280" height="38" rx="4" fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1" />
        <text x="200" y="374" textAnchor="middle" {...LABEL}>
          to the motors, one action at a time
        </text>
      </svg>
    </div>
  );
}

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
  { pkg: 'diffusion', what: 'Diffusion Policy: refines noise into an action sequence, conditioned on recent images', chunk: '64 / 32', fit: 'Yes, in our reading: features come from the dataset', id: 'F02-17', src: 'LeRobot diffusion config' },
  { pkg: 'vqbet', what: 'VQ-BeT: a transformer that predicts discrete action codes', chunk: '3 prediction tokens of 5 actions each', fit: 'Yes, in our reading; no arm recipe read', id: 'F02-102', src: 'LeRobot vqbet config' },
  { pkg: 'tdmpc', what: 'TD-MPC: a learned model of the task used to plan a few steps ahead; a reinforcement-learning method', chunk: 'planning horizon 5 / 1', fit: 'Not a fine-tune from demonstrations; no SO-101 recipe read', id: 'F02-102', src: 'LeRobot tdmpc config' },
  { pkg: 'gaussian_actor', what: "The actor network of LeRobot's reinforcement-learning path, trained by trial and error on the real robot (section 8)", chunk: 'no chunk: one action per step', fit: 'Yes, through that reinforcement-learning workflow', id: 'F02-92', src: 'LeRobot gaussian_actor config' },
  { pkg: 'multi_task_dit', what: 'Multitask DiT: Diffusion Policy scaled to a language-conditioned transformer of about 450M parameters', chunk: '32 / 24', fit: 'Yes, in our reading; trained on your own data', id: 'F02-98', src: 'LeRobot multi_task_dit guide' },
  { pkg: 'smolvla', what: 'SmolVLA: a 450M-parameter VLA with a flow-matching action expert', chunk: '50 / 50', fit: 'Yes. A first-party fine-tune guide, which puts the run at about 4 h on one A100', id: 'F02-63', src: 'LeRobot SmolVLA guide' },
  { pkg: 'pi0', what: 'pi0: a 3.3B-class VLA with a flow-matching action expert, ported from openpi', chunk: '50 / 50', fit: 'Yes, by padding to 32', id: 'F02-80', src: 'LeRobot pi0 guide' },
  { pkg: 'pi0_fast', what: 'pi0-FAST: the same backbone writing compressed action tokens one at a time', chunk: '50 / 50', fit: 'Yes, by padding to 32', id: 'F02-29', src: 'LeRobot pi0_fast config' },
  { pkg: 'pi05', what: "pi0.5: pi0's successor, with optional memory in LeRobot", chunk: '50 / 50', fit: 'Yes, by padding to 32; example sized for one 80 GB GPU', id: 'F02-57', src: 'LeRobot pi05 guide' },
  { pkg: 'fineart_vla', what: 'FineART-VLA: pi0.5 plus a language head that names the next subtask before acting', chunk: '50 / 50 (inherited)', fit: 'Yes, in our reading; mid-trained on two-arm data', id: 'F02-89', src: 'LeRobot fineart_vla README' },
  { pkg: 'groot', what: 'GR00T N1.7 (NVIDIA): a VLA with a diffusion-transformer action head', chunk: '16 / 16 in that recipe', fit: 'Yes, via the recipe for a new robot body (a new embodiment)', id: 'F02-81', src: 'LeRobot groot guide' },
  { pkg: 'xvla', what: 'X-VLA: a 0.9B VLA with a small set of learned prompt vectors per robot body', chunk: '32', fit: 'Yes, in our reading, via a new prompt set for the arm', id: 'F02-82', src: 'LeRobot xvla config' },
  { pkg: 'eo1', what: 'EO-1: a Qwen2.5-VL 3B backbone with a flow-matching action head', chunk: '16 / 16', fit: "Yes. The guide's own example runs on an SO-101 follower", id: 'F02-86', src: 'LeRobot eo1 guide' },
  { pkg: 'evo1', what: 'EVO1: an InternVL3 1B backbone with a flow-matching head, trained in two stages', chunk: '50 / 50', fit: 'Yes, in our reading, by padding to 24', id: 'F02-87', src: 'LeRobot evo1 config' },
  { pkg: 'dm05', what: 'DM0.5 (Dexmal): a VLA for open-world control', chunk: '50 / 50', fit: 'Yes, in our reading: state and action up to 32 numbers', id: 'F02-85', src: 'LeRobot dm05 config' },
  { pkg: 'g05', what: 'G0.5 (Galaxea): a Qwen3.5 2B VLA that writes reasoning text, then actions; non-commercial licence', chunk: '16 / 16 (SO-101 checkpoint: 32 / 16)', fit: 'Yes. First-party SO-101 checkpoint and fine-tune command', id: 'F02-91', src: 'LeRobot g05 guide' },
  { pkg: 'molmoact2', what: 'MolmoAct2 (Allen Institute for AI), LeRobot port', chunk: '30 / 30', fit: 'Yes. First-party SO-100/SO-101 checkpoint; mind the calibration correction', id: 'F02-97', src: 'LeRobot molmoact2 guide' },
  { pkg: 'lingbot_vla_v2', what: 'LingBot-VLA 2.0 (Robbyant): a Qwen3-VL 4B backbone and an action expert over 55 shared state and action slots', chunk: '50 / 50', fit: "Yes, by slot mapping; the guide's example arm has the SO-101's shape; about 96 GB for a full fine-tune", id: 'F02-95', src: 'LeRobot lingbot_vla_v2 guide' },
  { pkg: 'wall_oss_05', what: 'Wall-OSS-0.5 (X Square Robot): a 4B Qwen2.5-VL VLA with a flow-matching expert', chunk: '32 / 32', fit: 'Yes, in our reading, by zero-padding to 26', id: 'F02-100', src: 'LeRobot wall_oss_05 guide' },
  { pkg: 'wall_x', what: 'WALL-OSS, the earlier release from the same company', chunk: '32 / 32', fit: 'Yes, in our reading, by padding to 20', id: 'F02-101', src: 'LeRobot wall_x config' },
  { pkg: 'vla_jepa', what: 'VLA-JEPA: a Qwen3-VL 2B VLA trained with an extra video-prediction loss from V-JEPA 2 (section 7); the predictor is dropped at inference', chunk: '7 / 7', fit: 'Yes, by re-initialising the action layers for a 6-number action', id: 'F02-99', src: 'LeRobot vla_jepa guide' },
  { pkg: 'cosmos3', what: 'Cosmos 3 as a world action model: predicts future video and actions together', chunk: '16 / 16', fit: 'Yes, in our reading; LeRobot measured 21 GB for a LoRA fine-tune of the smaller variant; the larger needs 80 GB GPUs', id: 'F02-84', src: 'LeRobot cosmos3 guide' },
  { pkg: 'flux3', what: 'FLUX 3 Action (Black Forest Labs): a 7B world action model, actions refined together with future frames', chunk: '32 / 32 (SO-101 checkpoint predicts 42)', fit: 'Yes. First-party SO-101 checkpoint and a one-GPU LoRA recipe', id: 'F02-90', src: 'LeRobot flux3 guide' },
  { pkg: 'fastwam', what: 'Fast-WAM: a Wan 2.2 5B world action model that skips generating future frames at inference', chunk: '32 / 32', fit: 'Yes, in our reading, with the action and state widths set to 6', id: 'F02-88', src: 'LeRobot fastwam guide' },
  { pkg: 'lawam', what: 'LaWAM: a world action model that predicts in a compressed space, on Qwen3-VL 2B', chunk: '8 / 8', fit: 'Yes, in our reading, by padding to 32', id: 'F02-93', src: 'LeRobot lawam guide' },
  { pkg: 'longwam', what: 'Long-WAM: a world action model that reads 48 steps of visual history', chunk: '32 / 10', fit: 'No path documented: its checkpoints use a 7-number action from a simulated benchmark', id: 'F02-96', src: 'LeRobot longwam guide' },
  { pkg: 'lingbot_va', what: 'LingBot-VA: a video-and-action model on Wan 2.2, about 5B', chunk: '16 per chunk (our arithmetic)', fit: 'Not directly: it predicts gripper poses, and an SO-101 recording holds joint angles', id: 'F02-94', src: 'LeRobot lingbot_va guide' },
];

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
            description="Read any 2026 robot-model announcement and know what the backbone, the action head and the two rates are (papers, model cards and LeRobot v0.7.0, read 2026-11-20)"
          >
            5. Vision-Language-Action Models
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A vision-language-action model (VLA) is a policy built from a model that already reads images and text.
            Two things are added to that model: a way in for the robot&apos;s joint readings, and a part that
            outputs motion in place of words. Most of the robot models announced in 2025 and 2026 that this section
            covers have this shape.
          </Box>
          <Box variant="p">
            This section gives you the two ideas that make those announcements readable. A VLA is a backbone plus an
            action head, and it runs on two clocks. Then it sorts the current models into the ones you can read
            about and the ones you can download and fine-tune for the {ARM} today.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="What changes at the bench when the policy can read a sentence">
            An instruction in words
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The same arm, the same block, the same cup. The policy of section 4, Learning From Demonstrations, was
            trained on fifty recordings of one task, and that one task is what it does: {TASK_STORY}. This time
            there is a text box beside the camera views. You type &quot;{INSTRUCTION}&quot;
            and the arm does it. The sentence goes into the model on every call, together with the camera frames
            and the joint angles.{' '}
            <Cite id="F02-18">pi0 paper, section IV</Cite>
          </Box>
          <Box variant="p">
            The larger change is where the model comes from. The section 4 policy learned everything it knows from
            your fifty episodes. This one arrives already trained, on images and text from the web and on
            recordings from other robots, and your episodes only adapt it to this arm and this task.{' '}
            <Cite id="F02-32">pi0 paper, section IV, model size</Cite>{' '}
            <Cite id="F02-59">SmolVLA paper, section 4 and table 1</Cite>
          </Box>
          <Box variant="p">
            One published result is close to this dive&apos;s own task. On an {ARM} pick-and-place task with 50
            demonstrations, the SmolVLA authors report 90% success for their VLA against 70% for ACT (Action
            Chunking with Transformers), the small trained-from-scratch policy of section 4, when the object starts
            where the demonstrations started. When it starts somewhere new they report 50% against 40%. SmolVLA had
            seen no {ARM} data before those 50 demonstrations.{' '}
            <Cite id="F02-60">SmolVLA paper, table 4</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="The two parts every announcement names, and the tensors that pass between them">
            What a VLA is: a backbone plus an action head
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Start from a vision-language model (VLM): a network pretrained on images and text from the web that
            takes pictures and a prompt and writes text. Inside a robot model it is called the backbone. It turns
            each camera image and the instruction into tokens, and its job is to understand the scene and the
            request.
          </Box>
          <Box variant="p">
            A backbone alone writes words, and a servo needs numbers. So a second, smaller network is attached: the
            action head, which Physical Intelligence calls the action expert. It reads the backbone&apos;s tokens
            and the robot&apos;s state (the joint angles, its proprioception in the terms of section 3) and outputs
            an action chunk, the next several actions in one answer (section 4 explains why policies answer in
            chunks). pi0, the October 2024 model from Physical
            Intelligence, is the clearest picture of the two parts: its backbone is PaliGemma, a VLM of 3B
            parameters, and its action expert adds 300M parameters initialised from scratch, 3.3B in total.{' '}
            <Cite id="F02-32">pi0 paper, section IV, model size</Cite>{' '}
            <Cite id="F02-18">pi0 paper, section IV, inputs and outputs</Cite>
          </Box>
          <Box variant="p">
            The figure draws pi0 with the {ARM}&apos;s shapes, as LeRobot v0.7.0 runs it. Read it as the worked
            example for this section: every number on it is a real shape.
          </Box>
          <Figure
            cites="F02-18 F02-20 F02-23 F02-29 F02-32 F02-67"
            caption={
              <>
                Read it top to bottom. Green boxes are the model, yellow boxes are the robot. Sizes are from the pi0
                paper; the padding to 32 and the 50-action chunk are the defaults of the LeRobot v0.7.0 port; the
                camera size and the rate of 30 per second are LeRobot&apos;s recording examples for the arm.
              </>
            }
          >
            <VlaBlocks />
          </Figure>
          <Box variant="p">Follow one call through it.</Box>
          <ul style={LIST}>
            <li>
              <strong>The prefix.</strong> Two camera frames become image tokens and the sentence becomes text
              tokens. Together they are the prefix. The backbone reads the prefix once per call and its internal
              results are cached.{' '}
              <Cite id="F02-20">pi0 paper, section IV and appendix D</Cite>
            </li>
            <li>
              <strong>The state.</strong> The six joint angles go to the action head. One set of pi0 weights serves
              many robot bodies, so its state and action vectors have a fixed width of 32, and the {ARM}&apos;s six
              numbers fill six slots with zeros in the rest.{' '}
              <Cite id="F02-23">pi0 paper, section V-A, and openpi pi0_config.py</Cite>
            </li>
            <li>
              <strong>The action head.</strong> It uses flow matching, the method from section 4 that starts from
              random noise and refines it into an action chunk in a few steps. Announcements call these denoising
              steps. The noise has the shape of the answer, 50 rows by 32 columns. pi0 refines it in 10 steps, and
              each step re-runs only the action head against the cached prefix.{' '}
              <Cite id="F02-20">pi0 paper, section IV and appendix D</Cite>{' '}
              <Cite id="F02-29">LeRobot pi0 and pi0_fast configs</Cite>
            </li>
            <li>
              <strong>The output.</strong> A tensor of 50 actions by 32 numbers. The host keeps the first six
              columns and plays one row per tick.{' '}
              <Cite id="F02-29">LeRobot pi0 and pi0_fast configs</Cite>
            </li>
          </ul>
          <Box variant="p">
            Every model in this section fills in the same template with different numbers: which VLM is the
            backbone, how large the action head is, how long the chunk is, how many refinement steps it takes. When
            an announcement gives one parameter count, it is the sum of the two parts, and in the models here the backbone is the larger part.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Why announcements quote two rates, and what each one counts">
            Two clocks: a slow system that reasons, a fast one that moves
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Understanding a scene and a sentence takes a large network, and a large network is slow. Motors need a
            new target many times a second. Every current design meets this with two parts that run at two rates:
            a slow part that understands and a fast part that moves.
          </Box>
          <Box variant="p">
            NVIDIA&apos;s GR00T N1 paper of March 2025 gave the two parts the names announcements still use. System
            2 is the vision-language model, which the paper reports running at 10 Hz (hertz, times per second) on an L40 GPU. System 1 is the
            action head. In GR00T it is a DiT (diffusion transformer), a transformer used as the network that
            refines noise into actions. It reads System 2&apos;s output tokens and the robot state, and the paper
            reports motor actions leaving it at 120 Hz. The names are borrowed from Daniel Kahneman&apos;s book
            Thinking, Fast and Slow.{' '}
            <Cite id="F02-33">GR00T N1 paper, section 1</Cite>
          </Box>
          <AnimatedFigure
            name="two clocks"
            steps={CLOCK_STEPS}
            intervalMs={2600}
            cites="F02-33"
            caption={
              <>
                Step through to watch one plan feed many actions. A schematic drawn from the two rates NVIDIA&apos;s
                paper names, not a measurement: in the released model the actions leave in chunks of 16.
              </>
            }
          >
            {(step, reduced) => <TwoClocks step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            The two rates count different things. The slow rate counts passes of the backbone. The fast rate counts
            actions, and an action is one row of a chunk. With <code>actions per chunk</code> the chunk length and{' '}
            <code>chunks per second</code> how often the action head can produce one:
          </Box>
          <Box variant="p">
            <code>actions per second = actions per chunk x chunks per second</code>
          </Box>
          <Box variant="p">
            The first factor is free: a longer chunk raises the action rate with no extra compute. The second is
            the real speed of the network. The same NVIDIA paper reports 63.9 ms to sample one chunk of 16 actions
            on an L40. By our arithmetic that is about 15.6 chunks a second, and 15.6 x 16 gives room for 250
            actions a second. So 120 Hz is a rate of actions; the action head itself runs about 15.6 times a
            second. When an announcement quotes a fast rate, ask which of the two it counts.{' '}
            <Cite id="F02-34">GR00T N1 paper, sections 2 and 3</Cite>{' '}
            <Cite id="F02-33">GR00T N1 paper, section 1</Cite>
          </Box>
          <Box variant="p">
            On the {ARM} the two clocks are easy to see. The host plays 30 actions a second. SmolVLA returns 50
            actions per call and LeRobot&apos;s default plays all 50, so the model is called once every 50 / 30 ={' '}
            <Derived>1.67</Derived> s (our arithmetic).{' '}
            <Cite id="F02-62">LeRobot configuration_smolvla.py</Cite>{' '}
            <Cite id="F02-67">LeRobot so_follower.py and imitation learning tutorial</Cite>
          </Box>
          <Box variant="p">
            Designs differ in where they cut between slow and fast. In our reading of the releases since 2025, the
            cut has kept moving outward.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Inside one network.</strong> pi0.5 (April 2025) first writes a short text subtask such as
              &quot;pick up the cutting board&quot;, then produces the action chunk conditioned on it.{' '}
              <Cite id="F02-48">pi0.5 paper, section I</Cite>
            </li>
            <li>
              <strong>Two modules on one GPU.</strong> The GR00T N1 line, up to N1.7: a VLM and a DiT action head
              side by side.{' '}
              <Cite id="F02-37">NVIDIA GR00T N1.7 blog post</Cite>
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
              action model as a tool.{' '}
              <Cite id="F02-45">NVIDIA GR00T 2 research page, Agentic Control</Cite>
            </li>
          </ul>
          <Box variant="p">
            GR00T 2 is the current form of the idea, and it changes the model underneath. It is a world action
            model: one diffusion transformer refines future video and the action chunk together, so the model
            predicts what the camera will see as well as what the robot should do. Section 6, World Models:
            Predicting What Happens Next, takes that up.{' '}
            <Cite id="F02-44">NVIDIA GR00T 2 research page, Model Architecture</Cite>
          </Box>
          <Box variant="p">
            Its on-robot variant, GR00T 2 Turbo, has 2B parameters. NVIDIA reports one prediction in 38 ms on an RTX
            5090 desktop GPU and 124 ms on a Jetson Thor, its onboard computer for robots, where the model plans
            1.6 s chunks about once per second and a separate controller executes them at 50 Hz. The reasoning
            model is the only part that runs off the robot. Section 3, The Robot as a Computer, drew this stack as
            a rate ladder. {GROOT2_LABEL}{' '}
            <Cite id="F02-45">NVIDIA GR00T 2 research page, GR00T 2 Turbo</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="What is current in each line, and which of it you can download">
            The current lines, November 2026
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            There are two lists, and they differ. One is what has been published: papers and posts. The other is
            what a reader can download and fine-tune. In our reading, the second list trails the first by a model
            generation or more in most lines.
          </Box>
          <Figure
            cites="F02-34 F02-37 F02-44 F02-48 F02-50 F02-51 F02-53 F02-58 F02-68 F02-74 F02-75 F02-77 F02-78 F02-79"
            caption={
              <>
                Each row is one line of models; read left to right for its releases. Filled markers can be
                downloaded, hollow ones cannot as far as the sources read on 2026-11-20 state. GR00T N1.5 and N1.6
                sit between N1 and N1.7 and are left out for space.
              </>
            }
          >
            <ReleaseTimeline />
          </Figure>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 760 }}>
              <thead>
                <tr>
                  <th style={TH}>Model</th>
                  <th style={TH}>Date</th>
                  <th style={TH}>Size</th>
                  <th style={TH}>What you can download</th>
                  <th style={TH}>Runs on LeRobot v0.7.0</th>
                  <th style={TH}>Sources</th>
                </tr>
              </thead>
              <tbody>
                <Row
                  cells={[
                    'pi0.7 (Physical Intelligence)',
                    'Paper, 16 April 2026',
                    'About 5B, of which 860M is the action expert',
                    'Nothing for pi0.7. The open repository, openpi, holds pi0, pi0-FAST and pi0.5',
                    <>
                      No. The packages are <code>pi0</code>, <code>pi0_fast</code> and <code>pi05</code>
                    </>,
                  ]}
                  cite={
                    <>
                      <Cite id="F02-51">pi0.7 paper, section IV</Cite>{' '}
                      <Cite id="F02-53">openpi README, updates and checkpoints</Cite>{' '}
                      <Cite id="F02-56">LeRobot pi05 guide and config</Cite>
                    </>
                  }
                />
                <Row
                  cells={[
                    'GR00T N1.7 (NVIDIA)',
                    'Blog post, 17 April 2026',
                    '3B',
                    'Weights and code. The newest GR00T you can download',
                    <>
                      Yes, as <code>groot</code>
                    </>,
                  ]}
                  cite={
                    <>
                      <Cite id="F02-37">NVIDIA GR00T N1.7 blog post</Cite>{' '}
                      <Cite id="F02-47">LeRobot configuration_groot.py</Cite>
                    </>
                  }
                />
                <Row
                  cells={[
                    'GR00T 2 (NVIDIA)',
                    'Research page and whitepaper, November 2026',
                    'Turbo variant: 2B. The full model has no size on the page',
                    'Nothing yet. Code is announced for December',
                    'No',
                  ]}
                  cite={
                    <>
                      <Cite id="F02-44">NVIDIA GR00T 2 research page</Cite>{' '}
                      <Cite id="F02-45">NVIDIA GR00T 2 research page, GR00T 2 Turbo</Cite>
                    </>
                  }
                />
                <Row
                  cells={[
                    'SmolVLA (Hugging Face)',
                    'Paper, June 2025. No successor located in this research',
                    '450M',
                    <>
                      Weights and code, as <code>lerobot/smolvla_base</code>
                    </>,
                    <>
                      Yes, as <code>smolvla</code>
                    </>,
                  ]}
                  cite={
                    <>
                      <Cite id="F02-58">SmolVLA paper, section 4</Cite>{' '}
                      <Cite id="F02-63">LeRobot SmolVLA guide</Cite>{' '}
                      <Cite id="F02-64">Hugging Face model list, lerobot/smolvla</Cite>
                    </>
                  }
                />
                <Row
                  cells={[
                    'OpenVLA-OFT',
                    'Paper, February 2025. No 2026 successor located in this research',
                    '7B',
                    'A code repository, last pushed 2025-09-09',
                    'No package of that name among the 28',
                  ]}
                  cite={
                    <>
                      <Cite id="F02-68">OpenVLA-OFT paper, abstract</Cite>{' '}
                      <Cite id="F02-102">LeRobot v0.7.0 policies directory</Cite>
                    </>
                  }
                />
                <Row
                  cells={[
                    'Gemini Robotics 2.5 (Google DeepMind)',
                    'Post, 10 November 2026',
                    'Not published',
                    'Nothing. The VLA models of the July 2026 release went to early-access partners',
                    'No',
                  ]}
                  cite={
                    <>
                      <Cite id="F02-74">Google DeepMind, Gemini Robotics 2.5 post</Cite>{' '}
                      <Cite id="F02-75">Google DeepMind, Gemini Robotics 2 post</Cite>
                    </>
                  }
                />
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Read the table by its fourth column. Two rows are both current and downloadable, GR00T N1.7 and SmolVLA,
            and both run on LeRobot. GR00T 2 is the current GR00T to learn from and N1.7 is the current GR00T to
            run. The detail for each line is below.
          </Box>

          <ExpandableSection headerText="The pi line: pi0 to pi0.7, and what openpi holds">
            <SpaceBetween size="s">
              <Box variant="p">
                pi0.5 (April 2025) added the text subtask described above.{' '}
                <Cite id="F02-48">pi0.5 paper, section I</Cite> pi*0.6 (November 2025) moved to a Gemma 3 backbone of
                4B parameters with an 860M action expert, and added learning from the robot&apos;s own attempts, a
                form of the reinforcement learning that section 8 covers.{' '}
                <Cite id="F02-50">pi*0.6 paper, abstract and section V</Cite>
              </Box>
              <Box variant="p">
                pi0.7 (first posted 16 April 2026) is the newest Physical Intelligence model with a paper as of
                2026-11-20. It has about 5B parameters: a 4B backbone, an 860M flow-matching action expert and an
                encoder for recent video. It generates 50-step chunks in 5 refinement steps and plays 15 or 25 of
                the 50 before asking again. Its prompt carries more than a sentence: also notes about the episode
                and generated images of the next subgoal.{' '}
                <Cite id="F02-51">pi0.7 paper, section IV</Cite>
              </Box>
              <Box variant="p">
                openpi, the company&apos;s open repository, holds pi0, pi0-FAST and pi0.5 only; its last commit is
                dated 2026-08-24 and it offers no pi*0.6 or pi0.7 weights. No model newer than pi0.7 was named as
                of a 2026-10-20 archive copy of the company site. A post of 2026-10-13 offers hosted training and
                inference through an API beta with a waitlist.{' '}
                <Cite id="F02-53">openpi README, updates and checkpoints</Cite> For an {ARM} the practical pi model
                is therefore pi0.5 through LeRobot, which has added optional memory of recent frames and joint
                readings to it.{' '}
                <Cite id="F02-56">LeRobot pi05 guide and config</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="The GR00T line: N1 to N1.7, then GR00T 2">
            <SpaceBetween size="s">
              <Box variant="p">
                GR00T N1 (March 2025) had 2.2B parameters and a 16-action chunk.{' '}
                <Cite id="F02-34">GR00T N1 paper, sections 2 and 3</Cite> N1.5 (2025) froze the VLM during training.{' '}
                <Cite id="F02-35">NVIDIA GR00T N1.5 page</Cite> N1.6 (December 2025) doubled the action head to 32
                layers.{' '}
                <Cite id="F02-36">NVIDIA GR00T N1.6 page</Cite>
              </Box>
              <Box variant="p">
                GR00T N1.7 (blog post 17 April 2026, release tag 18 April 2026) is the newest GR00T with released
                weights and code as of 2026-11-20. It is a 3B-parameter VLA whose System 2 is a VLM named
                Cosmos-Reason2-2B and whose System 1 is a flow-matching DiT. NVIDIA states it was pretrained with
                20,854 hours of egocentric human video, video shot from the point of view of the person doing the
                task.{' '}
                <Cite id="F02-37">NVIDIA GR00T N1.7 blog post</Cite>
              </Box>
              <Box variant="p">
                The released checkpoint has a 32-layer action head, where the repository&apos;s code default is 16.
                The code sets a chunk of 40 actions (<code>action_horizon = 40</code>), state and action vectors
                padded to 132 numbers (<code>max_action_dim = 132</code>) and 4 refinement steps.{' '}
                <Cite id="F02-38">Isaac-GR00T gr00t_n1d7.py and the released checkpoint config</Cite>
              </Box>
              <Box variant="p">
                GR00T 2 is a different kind of model, the world action model described above.{' '}
                <Cite id="F02-44">NVIDIA GR00T 2 research page</Cite> NVIDIA reports how fast it adapts: on 50
                tasks that NVIDIA selected as ones the model learns from five episodes, it succeeds in 40% of
                trials with no demonstration of the task and in 95% after five demonstrations and one fine-tune of
                about 30 minutes on an RTX 5090. That fine-tune is a LoRA (low-rank adaptation), which trains small
                added matrices and leaves the base weights frozen. NVIDIA&apos;s whitepaper notes that the
                five-episode rate is high partly by construction. {GROOT2_LABEL}{' '}
                <Cite id="F02-46">NVIDIA GR00T 2 research page, Fast Adaptation</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="SmolVLA: the small end, and the one result on this arm">
            <SpaceBetween size="s">
              <Box variant="p">
                SmolVLA (June 2025) is a 450M-parameter VLA with about 100M of that in the action expert. It keeps
                only the first 16 layers of its VLM&apos;s language model, keeps the VLM frozen during training,
                and its flow-matching action expert outputs 50-action chunks in 10 steps.{' '}
                <Cite id="F02-58">SmolVLA paper, section 4</Cite> LeRobot v0.7.0&apos;s defaults match the paper.{' '}
                <Cite id="F02-62">LeRobot configuration_smolvla.py</Cite>
              </Box>
              <Box variant="p">
                The paper tests on the {ARM} with 50 demonstrations per task. The two columns of its table have
                names worth knowing. In distribution means the object starts in positions the demonstrations
                covered: 90% for SmolVLA, 70% for ACT. Out of distribution means it starts somewhere new: 50% and
                40%. The second column is the honest figure for a block that is not where you practised.{' '}
                <Cite id="F02-60">SmolVLA paper, table 4</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="OpenVLA-OFT: a plain head that held up">
            <Box variant="p">
              OpenVLA-OFT (February 2025) took a 7B VLA that wrote actions as tokens one at a time and changed its
              head to predict the whole chunk in one parallel pass, as plain numbers. On LIBERO, a suite of
              simulated manipulation tasks used as a benchmark, its authors report success rising from 76.5% to
              97.1% with 26x the action throughput. In our reading, the noise-refining heads of section 4 are a
              strong tendency in current models and not a requirement.{' '}
              <Cite id="F02-68">OpenVLA-OFT paper, abstract</Cite>
            </Box>
          </ExpandableSection>

          <ExpandableSection headerText="Gemini Robotics: published results, no download">
            <SpaceBetween size="s">
              <Box variant="p">
                Gemini Robotics 2.5 (10 November 2026) is the newest Gemini Robotics VLA located. Google DeepMind
                states it was tested on over 200 tasks. The post gives no parameter count, training compute or
                latency.{' '}
                <Cite id="F02-74">Google DeepMind, Gemini Robotics 2.5 post</Cite>
              </Box>
              <Box variant="p">
                Gemini Robotics 2 (30 July 2026) came as three models that map onto the two clocks: a VLA, a
                reasoning VLM that acts as the agent, and an on-device VLA built to run on the robot. Only the
                reasoning model is generally reachable, as a hosted API. The two VLAs are for early-access
                partners.{' '}
                <Cite id="F02-75">Google DeepMind, Gemini Robotics 2 post</Cite> The same post shows the on-device
                model adapted to the {ARM}, in a two-arm setup and behind that early access.{' '}
                <Cite id="F02-76">Google DeepMind, Gemini Robotics 2 post, on-device adaptation</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Where to start on an SO-101, from the 28 policies LeRobot v0.7.0 ships">
            Which can be fine-tuned for the arm today
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The practical list is set by one library. LeRobot v0.7.0, released 2026-11-05, ships 28 policy packages
            behind one command, <code>lerobot-train --policy.type=...</code>. By our count from that list, 19 are
            VLAs or other policies trained from demonstrations, 7 are world action models or are trained with an
            added loss for predicting what happens next, and 2 are components for reinforcement learning (section
            8, Reinforcement Learning for Robots).{' '}
            <Cite id="F02-102">LeRobot v0.7.0 policies directory, all 28 packages</Cite>
          </Box>
          <Box variant="p">For the {ARM}, start here and move down only when you have a reason.</Box>
          <ul style={LIST}>
            <li>
              <strong>
                First, <code>act</code>.
              </strong>{' '}
              It is LeRobot&apos;s own recommendation for a first policy: small, trained from scratch on your
              recordings, with no pretrained model to download. It gives you a baseline to compare a VLA against.{' '}
              <Cite id="F02-66">LeRobot ACT guide</Cite>
            </li>
            <li>
              <strong>
                Then <code>smolvla</code>, your first VLA.
              </strong>{' '}
              LeRobot&apos;s guide fine-tunes the 450M checkpoint on about 50 recorded episodes and puts 20,000
              steps at roughly 4 hours on a single A100 GPU.{' '}
              <Cite id="F02-63">LeRobot SmolVLA guide</Cite> It is also the model behind the one result on this
              arm: 90% against ACT&apos;s 70% with 50 demonstrations, as its authors report.{' '}
              <Cite id="F02-60">SmolVLA paper, table 4</Cite>
            </li>
            <li>
              <strong>
                With a larger GPU, <code>groot</code> or <code>pi05</code>.
              </strong>{' '}
              NVIDIA sets a minimum of one GPU with 40 GB of memory to fine-tune GR00T N1.7.{' '}
              <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite> LeRobot&apos;s pi0.5 example is sized for
              a single 80 GB GPU.{' '}
              <Cite id="F02-57">LeRobot pi05 guide</Cite>
            </li>
            <li>
              <strong>Three more ship a first-party checkpoint for this arm.</strong> <code>flux3</code> is a 7B
              world action model with a one-GPU recipe on an {ARM} dataset that uses LoRA (low-rank adaptation), a
              fine-tune that trains small added matrices and leaves the base weights frozen. <code>g05</code> comes with a
              fine-tune command and a non-commercial licence. <code>molmoact2</code> needs a calibration
              correction that the converted LeRobot checkpoint already applies.{' '}
              <Cite id="F02-90">LeRobot flux3 guide</Cite> <Cite id="F02-91">LeRobot g05 guide</Cite>{' '}
              <Cite id="F02-97">LeRobot molmoact2 guide</Cite>
            </li>
          </ul>
          <Box variant="p">
            One trap when following older tutorials: LeRobot v0.7.0 supports GR00T N1.7 only. Its{' '}
            <code>groot</code> policy rejects N1.5 checkpoints and tells you to pin <code>lerobot==0.5.1</code> to
            keep using them.{' '}
            <Cite id="F02-47">LeRobot configuration_groot.py</Cite>
          </Box>
          <ExpandableSection headerText="All 28 policy packages in LeRobot v0.7.0, and whether each fits the arm">
            <SpaceBetween size="s">
              <Box variant="p">
                The chunk column gives actions predicted and actions played per call, as the package&apos;s
                defaults set them. The last column is a reading of each package&apos;s code and documentation
                against the {ARM}&apos;s shape (six state numbers, six action numbers, one or two cameras). Where
                it says &quot;in our reading&quot;, the fit rests on padding or dataset code and no recipe for the
                arm was found. None of the 28 was trained on an {ARM} in this research.{' '}
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
                    {POLICIES.map((p) => (
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
            description="The publishers' figures for one call and for training, and the GPU your own fine-tune needs"
          >
            What it costs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One call to a VLA has a part that runs once and a part that repeats. The images are encoded and the
            backbone reads the prefix once. The action head then runs once per refinement step. With{' '}
            <code>t_see</code> the time in the image encoders, <code>t_read</code> the backbone&apos;s pass over the
            prefix, <code>K</code> the number of refinement steps and <code>t_step</code> the time of one
            action-head pass:
          </Box>
          <Box variant="p">
            <code>time per call = t_see + t_read + K x t_step</code>
          </Box>
          <Box variant="p">
            The first two terms are the slow system. They grow with the number of cameras and the size of the
            backbone. The last term is the fast system, and it grows with the step count and the size of the action
            head. For pi0 on an RTX 4090 with 3 cameras, its authors report 14 ms in the image encoders, 32 ms in
            the backbone pass and 27 ms for the ten action passes: 73 ms in total, 46 of them spent seeing and
            reading.{' '}
            <Cite id="F02-21">pi0 paper, appendix D, table I</Cite>
          </Box>
          <Box variant="p">
            NVIDIA&apos;s model card for GR00T N1.7 prints the same split, for 4 refinement steps and 1 camera. On
            an H100 data-centre GPU with TensorRT, NVIDIA&apos;s compiler that turns a trained network into an
            optimised inference engine, the stages are 6.2 ms of data processing, 8.8 ms in the backbone and 12.3
            ms in the action head, beside a printed end-to-end figure of 27.9 ms (35.9 Hz). On a Jetson AGX Thor the
            card gives 93.8 ms (10.7 Hz).{' '}
            <Cite id="F02-40">GR00T N1.7 model card, inference timing table</Cite>
          </Box>
          <Box variant="p">
            The same card shows that the fast system is not the cheap one. In plain PyTorch on the H100, with no
            compilation, it lists 31.3 ms for the backbone and 48.2 ms for the action head&apos;s 4 steps. Fast
            names the rate at which actions leave, because each call returns a whole chunk.{' '}
            <Cite id="F02-40">GR00T N1.7 model card, inference timing table</Cite>
          </Box>
          <Box variant="p">
            pi0.7 is served from a data centre. Its authors report running it on one H100: 38 ms per call in the minimal configuration (3 cameras, 5 refinement steps) and 127 ms in the
            worst case, with memory and subgoal images switched on.{' '}
            <Cite id="F02-52">pi0.7 paper, appendix D</Cite> Section 17, Running on the Robot, sets these latencies
            against the tick.
          </Box>
          <Box variant="p">
            All of this is tensor arithmetic on a GPU, plus the GPU memory that holds the weights: more than 8 GB
            to run pi0 by openpi&apos;s table, and 16 GB to run GR00T N1.7 by NVIDIA&apos;s guide.{' '}
            <Cite id="F02-54">openpi README, requirements</Cite>{' '}
            <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite> In our reading, capturing and decoding the
            camera frames is separate work for the CPU or the GPU&apos;s video engine, and a published latency includes it only
            where the table says so, as the data-processing stage above does.
          </Box>
          <Box variant="p">
            Training splits into two bills. Pretraining is the publisher&apos;s. NVIDIA&apos;s paper puts GR00T N1
            at roughly 50,000 H100 GPU-hours on up to 1,024 GPUs.{' '}
            <Cite id="F02-34">GR00T N1 paper, sections 2 and 3</Cite> The SmolVLA authors report about 30k
            GPU-hours for their whole project.{' '}
            <Cite id="F02-59">SmolVLA paper, section 4 and table 1</Cite> For the pi line and for Gemini Robotics,
            no pretraining compute was located in this research.
          </Box>
          <Box variant="p">
            Fine-tuning is yours, and what sets its size is how much of the backbone stays frozen. SmolVLA trains
            only its action expert, and GR00T N1.7&apos;s default recipe keeps the VLM frozen and stays under about
            35 GB of GPU memory.{' '}
            <Cite id="F02-62">LeRobot configuration_smolvla.py</Cite>{' '}
            <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite> A 7B backbone trained in full is a
            different job: the OpenVLA-OFT authors fine-tuned across 8 A100 or H100 GPUs.{' '}
            <Cite id="F02-69">OpenVLA-OFT paper, section V</Cite> Section 15, Training at Three Scales, places
            these runs on one axis.
          </Box>
          <Box variant="p">
            So the first VLA to fine-tune on an {ARM} is <code>smolvla</code>, started from{' '}
            <code>lerobot/smolvla_base</code> on the same 50 episodes you recorded for ACT. It is the model with a
            published result on this arm, 90% against 70%, and by LeRobot&apos;s figure its fine-tune is roughly 4
            hours on a single A100. Move to <code>groot</code> when you have a 40 GB GPU and want the model NVIDIA
            maintains, and read the GR00T 2 whitepaper for where that line goes next.{' '}
            <Cite id="F02-63">LeRobot SmolVLA guide</Cite> <Cite id="F02-60">SmolVLA paper, table 4</Cite>{' '}
            <Cite id="F02-42">Isaac-GR00T hardware recommendation</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
