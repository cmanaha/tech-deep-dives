import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode, RefObject } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import {
  Cite,
  arxiv,
  gh,
  E1_URL,
  LLAMA_MODELS_TAG,
  MEGATRON_TAG,
  TORCHTITAN_TAG,
} from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Kaplan et al., Scaling Laws for Neural Language Models, Sec 2.1 (6N per token). */
const KAPLAN = arxiv('2001.08361v1');
/** Chowdhery et al., PaLM, Appendix B (2N forward, 4N backward; the attention term). */
const PALM = arxiv('2204.02311v5');
/** Narayanan et al., Megatron-LM PTD-P (SC 2021): notation (Sec 3.1) and FLOP appendix. */
const MEGATRON_PTDP = arxiv('2104.04473v5');
/** Rajbhandari et al., ZeRO, Sec 3.1 (16 bytes per parameter) and Sec 3.2 (residual memory). */
const ZERO = arxiv('1910.02054v3');
/** Korthikanti et al., Reducing Activation Recomputation in Large Transformer Models, Sec 4.1. */
const KORTHIKANTI = arxiv('2205.05198v1');
/** Dao et al., FlashAttention, Sec 3.1. */
const FLASH = arxiv('2205.14135v2');
/** Micikevicius et al., Mixed Precision Training (ICLR 2018), Sec 3.1. */
const MPT = arxiv('1710.03740v3');
/** Kalamkar et al., A Study of BFLOAT16 for Deep Learning Training, Sec 3 and Table 1. */
const BF16_STUDY = arxiv('1905.12322v3');
/** The Llama 3 Herd of Models: Table 3 (shapes) and Table 4 (layouts, MFU, tokens per batch). */
const LLAMA3 = arxiv('2407.21783v3');
/** NVIDIA H100 product specifications (vendor specification). */
const H100_SPEC = 'https://www.nvidia.com/en-us/data-center/h100/';
/** EC2 accelerated computing instance specifications (p5.48xlarge rows). */
const EC2_AC = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';
/** Meta's Hugging Face model metadata for Llama 3.1 8B (exact parameter count). */
const HF_LLAMA_8B = 'https://huggingface.co/api/models/meta-llama/Llama-3.1-8B/revision/d04e592bb4f6aa9cfee91e2e20afa771667e1d4b';
/** Meta's Hugging Face model metadata for Llama 3.1 70B. */
const HF_LLAMA_70B = 'https://huggingface.co/api/models/meta-llama/Llama-3.1-70B/revision/349b2ddb53ce8f2849a6c168a81980ab25258dac';
/** Llama 3 tokenizer at llama-models v0.2.0: 256 special tokens on top of the base vocabulary. */
const LLAMA_TOKENIZER = gh('meta-llama/llama-models', LLAMA_MODELS_TAG, 'models/llama3/tokenizer.py', 'L53-L103');
/** Llama 3.1 model card at llama-models v0.2.0 (training tokens). */
const LLAMA_CARD = gh('meta-llama/llama-models', LLAMA_MODELS_TAG, 'models/llama3_1/MODEL_CARD.md');
/** Megatron Core distributed-optimizer guide: bytes per parameter by dtype. */
const MEGATRON_DIST_OPT = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'docs/user-guide/features/dist_optimizer.md', 'L14-L20');
/** TorchTitan v0.4.0 SwiGLU activation (eager silu times up). */
const TORCHTITAN_ACTIVATION = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/models/common/activation.py', 'L166-L177');
/** TorchTitan v0.4.0 Llama 3 config: local_compile_regions defaults include fused_binary_activation. */
const TORCHTITAN_LLAMA_COMPILE = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/models/llama3/model.py', 'L87-L89');

/** Conditions every E1 figure carries. */
const E1_TITLE = 'E1: activation memory per Llama 3.1 8B layer on one GB10, PyTorch 2.15.0, one run';

/* ------------------------------------------------------------------------ */
/* Diagram: one step as a timeline, with model state and activations        */
/* ------------------------------------------------------------------------ */

/** Container width (px) below which the diagram switches to its narrow layout. */
const STEP_NARROW_PX = 560;

function useNarrow(ref: RefObject<HTMLDivElement>): boolean {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => {
      const width = el.getBoundingClientRect().width;
      if (width > 0) setNarrow(width < STEP_NARROW_PX);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return narrow;
}

/** Llama 3.1 8B at s = 8,192, b = 1 (GB): BF16 weights, BF16 gradients, optimizer state, peak activations. */
const STEP_GB = { weights: 16.06, grads: 16.06, optimizer: 96.36, activations: 36.51 };

function StepTimelineDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref);

  const W = narrow ? 400 : 900;
  const x0 = narrow ? 44 : 64;
  const x1 = W - (narrow ? 10 : 24);
  const unit = (x1 - x0) / 8;
  const xB = x0 + 2 * unit;
  const xU = x0 + 6 * unit;
  const gap = 4;

  const laneTop = 50;
  const laneH = 58;
  const plotTop = laneTop + laneH + 24;
  const scale = narrow ? 1.15 : 1.3;
  const plotBottom = plotTop + 180 * scale;
  const H = plotBottom + 30;
  const y = (gb: number) => plotBottom - gb * scale;

  const gWeights = STEP_GB.weights;
  const gGrads = gWeights + STEP_GB.grads;
  const gState = gGrads + STEP_GB.optimizer;
  const gPeak = gState + STEP_GB.activations;

  const ink = '#16191f';
  const muted = '#414d5c';
  const font = 'sans-serif';

  const phases = [
    { x: x0, w: 2 * unit - gap, name: 'Forward', l1: '2N per token', l2: 'layers 1 to L', fill: '#f2f8fd', stroke: '#0972d3' },
    { x: xB, w: 4 * unit - gap, name: 'Backward', l1: '4N per token', l2: 'two gradients per layer', fill: '#f2f8fd', stroke: '#065299' },
    { x: xU, w: x1 - xU, name: 'Update', l1: 'Adam step', l2: 'new weights', fill: '#ecf7ec', stroke: '#037f0c' },
  ];

  const bands = [
    { from: 0, to: gWeights, fill: '#f2f8fd', stroke: '#0972d3', lines: ['BF16 weights: 2 bytes per parameter, 16.1 GB'] },
    { from: gWeights, to: gGrads, fill: '#e6f4f2', stroke: '#1f7a70', lines: ['BF16 gradients: 2 bytes per parameter, 16.1 GB'] },
    {
      from: gGrads,
      to: gState,
      fill: '#fbf3d5',
      stroke: '#8b6c00',
      lines: ['Optimizer state: 12 bytes per parameter, 96.4 GB', "FP32 master weights and Adam's two moments"],
    },
  ];

  const ticks = [0, 40, 80, 120, 160];

  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="step-timeline-title"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <title id="step-timeline-title">
          One training step of Llama 3.1 8B on one 8,192-token sequence, drawn as a timeline. The
          forward pass, at 2N FLOPs per token, saves activations layer by layer up to a peak of 36.5
          GB. The backward pass, at 4N FLOPs per token and so twice as long, computes two gradients
          per layer and frees each layer&apos;s activations as it goes. The optimizer update then
          writes new weights. Underneath, 128.5 GB of model state stays constant through the whole
          step: 16.1 GB of BF16 weights, 16.1 GB of BF16 gradients and 96.4 GB of optimizer state.
          Model state and activations together are about 165 GB, twice the 80 GB of one H100.
        </title>
        <defs>
          <marker id="step-timeline-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={muted} />
          </marker>
        </defs>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />

        <text x={x0} y={20} fontFamily={font} fontSize={13} fontWeight={600} fill={ink}>
          One step of Llama 3.1 8B
        </text>
        <text x={x0} y={36} fontFamily={font} fontSize={11} fill={muted}>
          one 8,192-token sequence, b = 1, no recomputation
        </text>

        {phases.map((p) => (
          <g key={p.name}>
            <rect x={p.x} y={laneTop} width={p.w} height={laneH} rx={4} fill={p.fill} stroke={p.stroke} strokeWidth={1.5} />
            <text x={p.x + p.w / 2} y={laneTop + 18} fontFamily={font} fontSize={13} fontWeight={600} fill={ink} textAnchor="middle">
              {p.name}
            </text>
            <text x={p.x + p.w / 2} y={laneTop + 34} fontFamily={font} fontSize={11} fill={muted} textAnchor="middle">
              {p.l1}
            </text>
            <text x={p.x + p.w / 2} y={laneTop + 49} fontFamily={font} fontSize={11} fill={muted} textAnchor="middle">
              {p.l2}
            </text>
          </g>
        ))}

        {[xB - gap / 2, xU - gap / 2].map((x) => (
          <line key={x} x1={x} y1={laneTop + laneH} x2={x} y2={plotBottom} stroke="#d1d5db" strokeWidth={1} strokeDasharray="5 4" />
        ))}

        {bands.map((b) => (
          <g key={b.lines[0]}>
            <rect x={x0} y={y(b.to)} width={x1 - x0} height={(b.to - b.from) * scale} fill={b.fill} stroke={b.stroke} strokeWidth={1} />
            {b.lines.map((line, i) => (
              <text
                key={line}
                x={x0 + 8}
                y={b.lines.length === 1 ? (y(b.to) + y(b.from)) / 2 + 4 : y(b.to) + 18 + i * 15}
                fontFamily={font}
                fontSize={11}
                fontWeight={i === 0 ? 600 : 400}
                fill={ink}
              >
                {line}
              </text>
            ))}
          </g>
        ))}

        <polygon
          points={`${x0},${y(gState)} ${xB - gap / 2},${y(gPeak)} ${xU - gap / 2},${y(gState)}`}
          fill="#efe7fb"
          stroke="#6f4cc4"
          strokeWidth={1.5}
        />
        <text
          x={narrow ? xB - 70 : xB - gap / 2}
          y={y(gPeak) - 8}
          fontFamily={font}
          fontSize={11}
          fontWeight={600}
          fill="#6f4cc4"
          textAnchor={narrow ? 'start' : 'middle'}
        >
          Activations: 36.5 GB at the peak
        </text>

        <text x={(xU + x1) / 2} y={y(gState) - 22} fontFamily={font} fontSize={11} fontWeight={600} fill={ink} textAnchor="middle">
          {narrow ? 'model state' : 'Model state: 128.5 GB,'}
        </text>
        <text x={(xU + x1) / 2} y={y(gState) - 8} fontFamily={font} fontSize={11} fill={muted} textAnchor="middle">
          {narrow ? '128.5 GB' : 'kept between steps'}
        </text>

        <line x1={x0} y1={y(80)} x2={x1} y2={y(80)} stroke={muted} strokeWidth={1.5} strokeDasharray="6 4" />
        <text x={x1 - 6} y={y(80) - 5} fontFamily={font} fontSize={11} fontWeight={600} fill={muted} textAnchor="end">
          80 GB: one H100
        </text>

        <line x1={x0} y1={plotTop} x2={x0} y2={plotBottom} stroke={muted} strokeWidth={1} />
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x0 - 4} y1={y(t)} x2={x0} y2={y(t)} stroke={muted} strokeWidth={1} />
            <text x={x0 - 7} y={y(t) + 4} fontFamily={font} fontSize={11} fill={muted} textAnchor="end">
              {t}
            </text>
          </g>
        ))}
        <text x={x0 - 7} y={plotTop + 4} fontFamily={font} fontSize={11} fontWeight={600} fill={muted} textAnchor="end">
          GB
        </text>

        <line x1={x1 - 56} y1={plotBottom + 16} x2={x1} y2={plotBottom + 16} stroke={muted} strokeWidth={1.5} markerEnd="url(#step-timeline-ah)" />
        <text x={x1 - 62} y={plotBottom + 20} fontFamily={font} fontSize={11} fill={muted} textAnchor="end">
          time
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Tables                                                                   */
/* ------------------------------------------------------------------------ */

const cell: CSSProperties = {
  padding: '6px 8px',
  borderBottom: '1px solid #e9ebed',
  textAlign: 'left',
  verticalAlign: 'top',
};
const headCell: CSSProperties = { ...cell, fontWeight: 700, borderBottom: '2px solid #d1d5db' };

function StepFlopsTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>Phase</th>
            <th style={headCell}>FLOPs per token</th>
            <th style={headCell}>One 8,192-token sequence of Llama 3.1 8B</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cell}>Forward pass</td>
            <td style={cell}>2N = 1.61e10</td>
            <td style={cell}>1.32e14</td>
          </tr>
          <tr>
            <td style={cell}>Backward pass</td>
            <td style={cell}>4N = 3.21e10</td>
            <td style={cell}>2.63e14</td>
          </tr>
          <tr>
            <td style={cell}>
              <strong>Step, by the 6N rule</strong>
            </td>
            <td style={cell}>
              <strong>6N = 4.82e10</strong>
            </td>
            <td style={cell}>
              <strong>3.95e14, about 1.0 s of one H100 at 40% MFU</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

interface NotationRow {
  sym: string;
  meaning: ReactNode;
  value: ReactNode;
}

function NotationTable({ rows }: { rows: NotationRow[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>Symbol</th>
            <th style={headCell}>Meaning; Llama 3.1 8B&apos;s value, or the section where it first matters</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.sym}>
              <td style={cell}>
                <code>{r.sym}</code>
              </td>
              <td style={cell}>
                {r.meaning}
                <Box variant="small" display="block" color="text-body-secondary">
                  {r.value}
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TwoBillsTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>Bill, before any split</th>
            <th style={headCell}>Llama 3.1 8B</th>
            <th style={headCell}>Llama 3.1 70B</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cell}>Parameters N</td>
            <td style={cell}>8.03 billion</td>
            <td style={cell}>70.55 billion</td>
          </tr>
          <tr>
            <td style={cell}>Layers L, hidden size h</td>
            <td style={cell}>32, 4,096</td>
            <td style={cell}>80, 8,192</td>
          </tr>
          <tr>
            <td style={cell}>FLOPs per token, 6N</td>
            <td style={cell}>4.82e10</td>
            <td style={cell}>4.23e11</td>
          </tr>
          <tr>
            <td style={cell}>FLOPs for one 8,192-token sequence, and its time on one H100</td>
            <td style={cell}>3.95e14, about 1.0 s</td>
            <td style={cell}>3.47e15, about 8.8 s</td>
          </tr>
          <tr>
            <td style={cell}>
              <strong>Model state, 16N bytes</strong>
            </td>
            <td style={cell}>
              <strong>128.5 GB, 1.6 times one 80 GB H100</strong>
            </td>
            <td style={cell}>
              <strong>1,128.9 GB, 14.1 times one 80 GB H100</strong>
            </td>
          </tr>
          <tr>
            <td style={cell}>Activations of one 8,192-token sequence</td>
            <td style={cell}>36.5 GB at 34 sbh per layer (44.0 GB at 41 sbh)</td>
            <td style={cell}>179.9 GB at 33.5 sbh per layer, our derivation, not measured</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function TrainingStep() {
  const notation: NotationRow[] = [
    {
      sym: 'N',
      meaning: (
        <>
          Parameters: all of them, for memory and for the FLOPs figures this dive quotes; section 4
          notes the matmul-only count
        </>
      ),
      value: (
        <>
          8,030,261,248{' '}
          <Cite tier={1} href={HF_LLAMA_8B}>
            Meta&apos;s Llama 3.1 8B model metadata
          </Cite>
        </>
      ),
    },
    {
      sym: 'D',
      meaning: 'Training tokens',
      value: (
        <>
          15T+ for Llama 3.1{' '}
          <Cite tier={1} href={LLAMA_CARD}>
            Llama 3.1 model card, llama-models v0.2.0
          </Cite>
        </>
      ),
    },
    { sym: 's', meaning: 'Sequence length, in tokens', value: '8,192 in this section' },
    { sym: 'b', meaning: 'Micro-batch size, in sequences', value: '1 in this section' },
    {
      sym: 'm',
      meaning: 'Micro-batches per step per data-parallel rank (the gradient accumulation steps)',
      value: 'Sections 8, 10 and 14',
    },
    { sym: 'd', meaning: 'Data-parallel degree', value: 'Section 8' },
    {
      sym: 'B',
      meaning: (
        <>
          Global batch in sequences, <code>B = b x m x d</code>; <code>B x s</code> tokens
        </>
      ),
      value: 'Llama 3 405B: 16.8M tokens per step',
    },
    {
      sym: 'L',
      meaning: 'Layers',
      value: (
        <>
          32{' '}
          <Cite tier={3} href={LLAMA3} venue="preprint">
            Llama 3 Herd of Models, Table 3
          </Cite>
        </>
      ),
    },
    { sym: 'h', meaning: 'Hidden size', value: '4,096' },
    { sym: 'a', meaning: 'Attention heads', value: '32, sharing 8 key-value heads' },
    {
      sym: 'V',
      meaning: 'Vocabulary size',
      value: (
        <>
          128,256: the tokenizer adds 256 special and reserved tokens to its base vocabulary{' '}
          <Cite tier={1} href={LLAMA_TOKENIZER} kind="code">
            llama-models v0.2.0 tokenizer.py L53-L103
          </Cite>
          , where the paper&apos;s Table 3 prints 128,000{' '}
          <Cite tier={3} href={LLAMA3} venue="preprint" kind="doc-code-conflict">
            Llama 3 Herd of Models, Table 3
          </Cite>
        </>
      ),
    },
    { sym: 't', meaning: 'Tensor-parallel degree', value: 'Section 9' },
    { sym: 'p', meaning: 'Pipeline stages', value: 'Section 10' },
    { sym: 'v', meaning: 'Interleaved chunks per pipeline stage', value: 'Section 10' },
    { sym: 'n', meaning: 'Ranks taking part in one collective', value: 'Section 7' },
    { sym: 'r_f', meaning: 'Failures per node-day', value: 'Section 17' },
    { sym: 'w_cp', meaning: 'Time a checkpoint save blocks training', value: 'Section 18' },
  ];

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Count the arithmetic and the bytes of one step for your own model before you split either: about 6 floating-point operations (FLOPs) per parameter per token, 16 bytes per parameter of model state, and activations that live only inside the step (papers, NVIDIA and AWS pages, TorchTitan v0.4.0, Megatron Core core_v0.20.0 and Meta's llama-models v0.2.0, read 2026-10-31, and our DGX Spark run)"
          >
            3. One Training Step: What It Computes and Keeps
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A training step reads a batch of token sequences, works out how each weight should change
            to lower the loss on them, and changes the weights. Its cost comes as two bills that the
            model&apos;s shape fixes before anything runs: one in FLOPs and one in bytes of
            accelerator memory.
          </Box>
          <Box variant="p">
            Every later section of this dive splits, schedules or checkpoints some part of those two
            bills, so the challenge here is to name every FLOP and every byte of one step.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read any training loop as three phases and know which one spends the arithmetic: about 6 FLOPs per parameter per token, a third forward and two thirds backward"
          >
            Two passes and one update
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">A step makes two passes over the model, then one update:</Box>
          <ul>
            <li>
              <strong>The forward pass</strong> runs the model on a micro-batch, the sequences that
              go through the model together, and computes the loss. Every weight takes part in one
              multiply-add per token, so the pass costs about 2 FLOPs per parameter per token, the
              same arithmetic an inference engine spends on a prompt{' '}
              <Cite tier={3} href={PALM} venue="JMLR 2023">
                PaLM, Appendix B
              </Cite>
              . On the way it saves the activations, the intermediate tensors the backward pass will
              read.
            </li>
            <li>
              <strong>The backward pass</strong> runs the layers in reverse and computes two
              gradients for each one: the gradient with respect to the layer&apos;s input, which it
              hands back to the layer before, and the gradient with respect to the layer&apos;s
              weights, which the optimizer needs{' '}
              <Cite tier={3} href={MEGATRON_PTDP} venue="SC 2021">
                Megatron-LM on GPU Clusters, Appendix: Floating-point operations
              </Cite>
              . Each matrix multiply of the forward pass becomes two, so this pass costs about 4
              FLOPs per parameter per token{' '}
              <Cite tier={3} href={PALM} venue="JMLR 2023">
                PaLM, Appendix B
              </Cite>
              .
            </li>
            <li>
              <strong>The optimizer update</strong> reads the gradients and the optimizer&apos;s own
              state and writes new weights. For Adam in mixed precision that state is a 32-bit master
              copy of the weights plus two moments per parameter, running averages of each gradient
              and of its square.
            </li>
          </ul>
          <Box variant="p">
            Adding the passes gives the rule this dive counts with: a step costs about 6N FLOPs per
            token, where N is the number of parameters{' '}
            <Cite tier={3} href={KAPLAN} venue="preprint">
              Scaling Laws for Neural Language Models, Section 2.1
            </Cite>
            . Attention adds a term that grows with sequence length, which section 4, Counting the
            Arithmetic, adds to the rule; this section counts 6N only, with N as the full parameter
            count.
          </Box>
          <Box variant="p">
            In numbers, for Llama 3.1 8B, with N = 8,030,261,248{' '}
            <Cite tier={1} href={HF_LLAMA_8B}>
              Meta&apos;s Llama 3.1 8B model metadata
            </Cite>
            , one sequence of 8,192 tokens, and one H100 at an assumed 40% MFU (model FLOPs
            utilization, the share of the accelerator&apos;s peak arithmetic that the model&apos;s own
            FLOPs achieve):
          </Box>
          <StepFlopsTable />
          <Box variant="p">
            The time divides 3.95e14 FLOPs by 989.5 TFLOPS (trillion FLOPs per second), the
            H100&apos;s dense BF16 (bfloat16) peak, half the 1,979 TFLOPS NVIDIA lists &quot;with
            sparsity&quot;{' '}
            <Cite tier={1} href={H100_SPEC} kind="vendor-claim">
              NVIDIA H100 specification
            </Cite>
            , times 40% MFU, an assumption inside the 38% to 43% of Llama 3 405B&apos;s BF16
            pre-training on H100{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.2 and Table 4
            </Cite>
            . Section 4 explains both and adds attention, 13% to 27% more for this sequence by our
            arithmetic below.
          </Box>
          <ExpandableSection headerText="The arithmetic behind these figures">
            <SpaceBetween size="s">
              <Box variant="p">
                <code>6N x s = 6 x 8,030,261,248 x 8,192 = 3.95e14 FLOPs</code>, split as 2N x s =
                1.32e14 forward and 4N x s = 2.63e14 backward.
              </Box>
              <Box variant="p">
                <code>time = 3.95e14 / (989.5e12 x 0.40) = 1.0 s</code>, with 989.5 TFLOPS = 1,979 / 2
                (the dense half of NVIDIA&apos;s sparse figure, a vendor specification) and 40% MFU as
                an assumption, BF16 throughout. Llama 3&apos;s own figures fit the dense denominator:
                430 TFLOPS per GPU at 43% MFU divides out to about 1,000{' '}
                <Cite tier={3} href={LLAMA3} venue="preprint">
                  Llama 3 Herd of Models, Table 4
                </Cite>
                .
              </Box>
              <Box variant="p">
                Attention: the matrix multiplies inside attention add 12 x L x H x Q x T FLOPs per
                token, for H heads of dimension Q and sequence length T{' '}
                <Cite tier={3} href={PALM} venue="JMLR 2023">
                  PaLM, Appendix B
                </Cite>
                . With H x Q = h and T = s that is 12 x L x h x s, a count of the full s x s score
                matrix. For the 8B model at 8,192 tokens it is 12 x 32 x 4,096 x 8,192 = 1.29e10 per
                token, against 6N = 4.82e10, so the sequence costs 5.00e14 FLOPs, 27% more; a causal
                kernel computes about half of the score matrix, which makes it about 13% more, for
                4.48e14. Our arithmetic from the model&apos;s shape.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Tell the state that persists from the state that comes and goes, because every memory lever in the dive acts on one of the two: for one 8B sequence, 128.5 GB stays and 36.5 GB peaks"
          >
            What the step keeps, and for how long
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">Two kinds of state follow from the three phases, and the rest of the dive turns on the difference.</Box>
          <ul>
            <li>
              <strong>Model state</strong> is the weights, the gradients and the optimizer state. It
              persists from step to step and scales with N. With mixed-precision Adam it is 16 bytes
              per parameter: 2 for 16-bit weights, 2 for 16-bit gradients, and 12 for the
              optimizer&apos;s FP32 (32-bit floating-point) master copy of the weights and its two
              moments, 4 bytes each{' '}
              <Cite tier={3} href={ZERO} venue="SC 2020">
                ZeRO (Zero Redundancy Optimizer), Section 3.1
              </Cite>
              . Llama 3.1 8B therefore holds 128.5 GB of model state before it reads a single token,
              1.6 times the 80 GB of one H100{' '}
              <Cite tier={1} href={H100_SPEC} kind="vendor-claim">
                NVIDIA H100 specification
              </Cite>
              .
            </li>
            <li>
              <strong>Activations</strong> are what the forward pass saves for the backward pass.
              They accumulate layer by layer as the forward pass runs, and the backward pass frees
              each layer&apos;s activations once it has used them, so they live only from a
              micro-batch&apos;s forward pass to its backward pass. Their size per layer is a
              multiple of s x b x h: sequence length times micro-batch size, the tokens in flight,
              times the hidden size{' '}
              <Cite tier={3} href={KORTHIKANTI} venue="MLSys 2023">
                Reducing Activation Recomputation, Section 4.1
              </Cite>
              , so they scale with the tokens in flight and with the number of layers.
            </li>
          </ul>
          <Box variant="p">
            For Llama&apos;s layer with a FlashAttention-style kernel, which never stores the s x s
            attention matrix{' '}
            <Cite tier={3} href={FLASH} venue="preprint">
              FlashAttention, Section 3.1
            </Cite>
            , the multiple is about 34: 34 sbh bytes per layer, our derivation by Korthikanti et
            al.&apos;s method. Our run on one GB10 measured 34.03 sbh with a fused SwiGLU (the gated
            MLP, or multilayer perceptron, that Llama uses) and 41.03 sbh with the eager{' '}
            <code>F.silu(gate) * up</code> that the model code of TorchTitan v0.4.0, the PyTorch
            team&apos;s reference trainer, computes{' '}
            <Cite tier={0} href={E1_URL}>
              {E1_TITLE}
            </Cite>{' '}
            <Cite tier={1} href={TORCHTITAN_ACTIVATION} kind="code">
              TorchTitan v0.4.0 activation.py L166-L177
            </Cite>
            . TorchTitan v0.4.0&apos;s Llama 3 config wraps that function in a{' '}
            <code>torch.compile</code> region by default{' '}
            <Cite tier={1} href={TORCHTITAN_LLAMA_COMPILE} kind="code">
              TorchTitan v0.4.0 llama3/model.py L87-L89
            </Cite>
            , and whether the compiled region stores 34 sbh or 41 was not tested. Across the 8B
            model&apos;s 32 layers, one 8,192-token sequence at micro-batch 1 holds 36.5 GB of
            activations at 34 sbh and 44.0 GB at 41 sbh.
          </Box>
          <StepTimelineDiagram />
          <Box variant="small" color="text-body-secondary">
            Memory to scale for Llama 3.1 8B at s = 8,192 and b = 1, fused SwiGLU, FlashAttention-style
            kernel, no recomputation, 32 layers before the output head. Phase widths follow the 2N to
            4N split of FLOPs; the update&apos;s width and the straight-line rise and fall of
            activations are illustrative, not measured. With gradient accumulation, forward and
            backward repeat once per micro-batch before the single update, and the activation peak
            repeats with them.
          </Box>
          <Box variant="p">
            Set against one accelerator, 128.5 GB of model state plus 36.5 GB of activations is about
            165 GB, twice the 80 GB of one of the eight H100s in a p5.48xlarge{' '}
            <Cite tier={1} href={EC2_AC}>
              AWS accelerated computing instance specifications
            </Cite>
            . Which of the two dominates depends on the tokens in flight: a 1.5-billion-parameter
            GPT-2 at sequence length 1K and batch 32 needs about 60 GB of activations against at
            least 24 GB of model state{' '}
            <Cite tier={3} href={ZERO} venue="SC 2020">
              ZeRO, Sections 3.1 and 3.2
            </Cite>
            . Temporary buffers and memory fragmentation claim more on top of both{' '}
            <Cite tier={3} href={ZERO} venue="SC 2020">
              ZeRO, Section 3.2
            </Cite>
            , which is why section 5, The Memory Budget, plans with headroom.
          </Box>
          <ExpandableSection headerText="Where 34 sbh comes from, and what our run measured">
            <SpaceBetween size="s">
              <Box variant="p">
                Korthikanti et al.&apos;s method adds up the bytes of every tensor the backward pass
                reads, at 2 bytes per 16-bit element. For a GPT layer it gives sbh(34 + 5as/h), where
                5as/h is the s x s attention matrix and its softmax{' '}
                <Cite tier={3} href={KORTHIKANTI} venue="MLSys 2023">
                  Reducing Activation Recomputation, Section 4.1
                </Cite>
                , which a FlashAttention-style kernel never stores{' '}
                <Cite tier={3} href={FLASH} venue="preprint">
                  FlashAttention, Section 3.1
                </Cite>
                . For Llama&apos;s layer (RMSNorm, root mean square normalization; no dropout; 8 key-value
                heads; a three-matrix SwiGLU 3.5 times the hidden size wide) the saved tensors are:
              </Box>
              <ul>
                <li>
                  Attention block: the norm input, the projections&apos; shared input, the queries
                  after rotary embedding and the attention output at 2sbh each, plus the keys and
                  values at 1,024 wide: 8sbh + 4,096sb.
                </li>
                <li>
                  MLP block: the norm input and the shared input of the gate and up projections at
                  2sbh each, plus the two SwiGLU inputs and the down projection&apos;s input at 2sbF
                  each, with F = 14,336: 4sbh + 6sbF.
                </li>
                <li>
                  Total for the 8B model, h = 4,096: sbh x (12 + 4,096/h + 6F/h) = sbh x (12 + 1 + 21)
                  = 34 sbh. An eager SwiGLU also saves the SiLU (sigmoid linear unit) output, 2sbF more, for 41 sbh. Our
                  derivation; the same count gives 33.5 sbh for 70B.
                </li>
              </ul>
              <Box variant="p">
                Our run built one to four layers of the 8B shape with random BF16 weights and read the
                CUDA caching allocator&apos;s byte count after the forward pass, at 2,048 to 8,192
                tokens and micro-batch 1 and 2: 34.03 sbh with a fused SwiGLU, 41.03 with the eager
                one, and 2.00 with full recomputation (re-running each layer&apos;s forward pass during
                the backward pass instead of storing its activations). The coefficient held at every
                length and micro-batch size and with each attention backend tried (FlashAttention,
                cuDNN and memory-efficient); the extra 0.03 is FP32 per-row statistics. One run, on one
                GB10 with PyTorch 2.15.0. The coefficients are byte counts set by the model code and
                the PyTorch version, so we read them as carrying to an H100; peak memory there also
                depends on the allocator and kernel workspaces, which the run did not measure{' '}
                <Cite tier={0} href={E1_URL}>
                  {E1_TITLE}
                </Cite>
                .
              </Box>
              <Box variant="p">
                The output head sits outside these figures. In the same run, one 8,192-token sequence
                with FP32 logits saved 4.27 GB at the head, and the head and loss briefly reached 8.5
                GB during the forward pass and 11.6 GB during the backward pass, gradients excluded{' '}
                <Cite tier={0} href={E1_URL}>
                  {E1_TITLE}
                </Cite>
                . Section 5 budgets them.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know where 4 of the 16 bytes come from before section 6 changes the compute format"
          >
            Why a 16-bit run keeps a 32-bit copy
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Mixed precision, as this dive uses the term, means computing in 16 bits and keeping an
            FP32 master copy of the weights for the update. The forward and backward passes read a
            16-bit copy, and the optimizer updates the 32-bit master{' '}
            <Cite tier={3} href={MPT} venue="ICLR 2018">
              Mixed Precision Training, Section 3.1
            </Cite>
            .
          </Box>
          <Box variant="p">
            The reason is addition. FP16, the older 16-bit format, has 10 mantissa bits, so when a weight is more than about
            2,048 times larger than its update, aligning the binary points shifts the update out of the
            mantissa and the sum comes back as the old weight{' '}
            <Cite tier={3} href={MPT} venue="ICLR 2018">
              Mixed Precision Training, Section 3.1
            </Cite>
            . BF16 keeps FP32&apos;s exponent range with 7 mantissa bits, trains without loss scaling,
            and still updates an FP32 copy of the weights{' '}
            <Cite tier={3} href={BF16_STUDY} venue="preprint">
              A Study of BFLOAT16 for Deep Learning Training, Section 3 and Table 1
            </Cite>
            ; by the same reasoning its threshold is about 256, our arithmetic. The FP32 master holds
            the updates a 16-bit weight would round away, and it costs 4 of the 16 bytes.
          </Box>
          <Box variant="p">
            Section 6, Precision for Training, covers the formats below 16 bits; their bit layouts are
            in the{' '}
            <Link href="../silicon-memory-inference/">
              Silicon, Memory and Modern Inference dive, section 27: Quantization and Precision
            </Link>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Write any run's batch as one identity, B = b x m x d, which every later sizing step solves"
          >
            Micro-batch, accumulation and the global batch
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">Three numbers set how many sequences one optimizer update learns from:</Box>
          <ul>
            <li>
              <strong>The micro-batch size b</strong> is the number of sequences that go through one
              forward and one backward pass together. Activation memory scales with it.
            </li>
            <li>
              <strong>Gradient accumulation</strong> runs m micro-batches through forward and backward
              passes, adding their gradients together, before a single optimizer update.
            </li>
            <li>
              <strong>The data-parallel degree d</strong> is the number of copies of the model that
              each process their own micro-batches and combine gradients before the update. Each copy
              runs on one or more ranks, a rank being one process, usually one per accelerator
              (section 8, Data Parallelism &amp; Sharding).
            </li>
          </ul>
          <Box variant="p">
            Together they fix the global batch:{' '}
            <code>B = b x m x d</code> sequences, or B x s tokens{' '}
            <Cite tier={3} href={MEGATRON_PTDP} venue="SC 2021">
              Megatron-LM on GPU Clusters, Section 3.1
            </Cite>
            . The tensor-parallel and pipeline degrees do not appear in it: the same paper counts
            the accelerators as p x t x d, and those two degrees split the work of each micro-batch
            across accelerators. Llama 3 405B&apos;s 8,192-GPU stage shows the identity at work: 64
            data-parallel copies, 32 sequences each per step, 8,192 tokens each, so 64 x 32 x 8,192 =
            16.8M tokens, the &quot;16M&quot; tokens per batch of the paper&apos;s table{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Table 4
            </Cite>
            .
          </Box>
          <Box variant="p">
            The identity also shows how a run trades memory for passes. Activation memory follows b,
            while the update runs once per B: for a fixed global batch, a smaller b with a larger m
            holds fewer activations at once, at the price of more and smaller passes per update (our
            reading of these sources). Section 8 and section 14, Set My Ranks, show what that choice
            does to communication.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read every later formula in one set of symbols, with Llama 3.1 8B's values beside the ones a model fixes"
          >
            The notation the dive uses
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every formula from section 4 onward uses these symbols, and section 32, Glossary &amp;
            Sources, repeats the list. Every traffic formula says whether it counts elements or bytes;
            one BF16 element is 2 bytes.
          </Box>
          <NotationTable rows={notation} />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Leave with your own model's FLOPs per token and bytes per parameter, the two numbers sections 4 and 5 start from"
          >
            Your model&apos;s two bills
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A step is a fixed bill in FLOPs and a fixed bill in bytes, and distributed training is the
            work of splitting both across accelerators. Before any split, each bill is a few lines of
            arithmetic on the model&apos;s shape:
          </Box>
          <ul>
            <li>
              <strong>FLOPs:</strong> 6N per token before attention, so <code>6N x B x s</code> per
              step.
            </li>
            <li>
              <strong>Model state:</strong> 16N bytes with mixed-precision Adam and 16-bit gradients,
              18N with BF16 weights and FP32 main gradients, NVIDIA Megatron Core&apos;s figure for
              that setting{' '}
              <Cite tier={1} href={MEGATRON_DIST_OPT}>
                Megatron Core distributed optimizer guide L14-L20
              </Cite>
              .
            </li>
            <li>
              <strong>Activations:</strong> about 34 sbh bytes per layer, times L, for Llama&apos;s
              layer with a fused SwiGLU, a FlashAttention-style kernel and no recomputation; 41 sbh
              with an eager SwiGLU.
            </li>
          </ul>
          <TwoBillsTable />
          <Box variant="small" color="text-body-secondary">
            N for 70B from{' '}
            <Cite tier={1} href={HF_LLAMA_70B}>
              Meta&apos;s Llama 3.1 70B model metadata
            </Cite>
            ; L and h from the Llama 3 paper&apos;s Table 3. Times at the 989.5 TFLOPS dense BF16
            peak and an assumed 40% MFU; activations at micro-batch 1, no recomputation. All figures
            are our arithmetic on these inputs; our GB10 run also measured the 8B coefficient.
          </Box>
          <Box variant="p">
            Run the same three lines for your own model; N, L and h from its configuration are
            enough. For Llama 3.1 8B the model state alone, 128.5 GB, is already more than one H100
            holds, so the first split is forced before a single activation is counted. Take the FLOPs
            into section 4 to turn them into accelerator-hours, and the bytes into section 5 to see
            which lever, from sharding to recomputation, brings them under an accelerator&apos;s
            memory.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
