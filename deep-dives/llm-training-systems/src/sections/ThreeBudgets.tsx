import { useRef } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, arxiv, gh, E1_URL, E2_URL, MEGATRON_TAG, PYTORCH_TAG } from '../components/Cite';
import { useNarrow } from '../components/useNarrow';

/* ------------------------------------------------------------------------ */
/* Sources: each figure repeats the citation of the section that owns it    */
/* ------------------------------------------------------------------------ */

/** Kaplan et al., Scaling Laws for Neural Language Models, Sec 2.1 (6N per token). Section 3. */
const KAPLAN = arxiv('2001.08361v1');
/** Chowdhery et al., PaLM, Appendix B (2N forward, 4N backward). Section 3. */
const PALM = arxiv('2204.02311v5');
/** Rajbhandari et al., ZeRO: Sec 1 (50% more communication), 3.1 (16 bytes), 5 (16/d). Sections 3, 5, 8. */
const ZERO = arxiv('1910.02054v3');
/** Korthikanti et al., Reducing Activation Recomputation: Table 2 (2 sbh), Sec 6.2 (33%). Section 5. */
const KORTHIKANTI = arxiv('2205.05198v1');
/** Narayanan et al., Megatron-LM PTD-P (SC 2021): Sec 2.3 and 3.3.2 (all-reduce frequency). Section 7. */
const PTDP = arxiv('2104.04473v5');
/** The Llama 3 Herd of Models: Sec 1 (budget, tokens), 3.3.1 (16K H100), 3.3.2 and Table 4 (MFU), 3.3.4 (interruptions). */
const LLAMA3 = arxiv('2407.21783v3');
/** Meta, Revisiting Reliability in Large-Scale ML Research Clusters, Sec III (MTTF formula). Section 17. */
const META_REL = arxiv('2410.21680v2');
/** Meta's Hugging Face model metadata at pinned revisions (exact parameter counts). Sections 4 and 5. */
const HF_405B =
  'https://huggingface.co/api/models/meta-llama/Llama-3.1-405B/revision/b906e4dc842aa489c962f9db26554dcfdde901fe';
const HF_8B =
  'https://huggingface.co/api/models/meta-llama/Llama-3.1-8B/revision/d04e592bb4f6aa9cfee91e2e20afa771667e1d4b';
/** NVIDIA H100 specification (80 GB, a vendor specification). Sections 3 and 5. */
const H100_SPEC = 'https://www.nvidia.com/en-us/data-center/h100/';
/** NVIDIA NVLink specifications (900 GB/s per Hopper GPU, a vendor specification). Section 7. */
const NVLINK_PAGE = 'https://www.nvidia.com/en-us/data-center/nvlink/';
/** EC2 accelerated computing instance specifications (p5.48xlarge: 8 H100, 3,200 Gb/s EFA). Section 7. */
const EC2_AC = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';
/** EC2 User Guide, Capacity Blocks (termination begins 11:00 UTC, blocks end 11:30 UTC). Section 20. */
const EC2_CB = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html';
/** Megatron Core distributed-optimizer guide: 18 bytes per parameter with 16-bit weights and FP32 gradients. Section 5. */
const MEGATRON_DIST_OPT = gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'docs/user-guide/features/dist_optimizer.md', 'L14-L20');
/** PyTorch v2.15.0 async_save docstring: stage to CPU memory, then save in a separate thread. Sections 15, 18. */
const ASYNC_SAVE = gh('pytorch/pytorch', PYTORCH_TAG, 'torch/distributed/checkpoint/state_dict_saver.py', 'L233-L234');

/** Conditions every E1 figure carries (as in sections 3 and 5). */
const E1_TITLE = 'E1: activation memory per Llama 3.1 8B layer on one GB10, PyTorch 2.15.0, one run';
/** Conditions every E2 figure carries (as in section 5). */
const E2_TITLE = 'E2: step time and recomputation on one GB10, PyTorch 2.15.0, two runs';

/* ------------------------------------------------------------------------ */
/* Figures drawn in the diagram, each stated and cited in the prose          */
/* ------------------------------------------------------------------------ */

/** Llama 3.1 8B model state at 16 bytes per parameter (GB): weights, gradients, optimizer. Sections 3 and 5. */
const STATE_GB = { weights: 16.06, grads: 16.06, optimizer: 96.36 };
const STATE_TOTAL_GB = STATE_GB.weights + STATE_GB.grads + STATE_GB.optimizer;
const H100_GB = 80;
/** Llama 3 405B: 54 days x 24 hours over 419 unexpected interruptions, about 3.1 hours. Section 17. */
const INTERRUPTION_HOURS = (54 * 24) / 419;

/* ------------------------------------------------------------------------ */
/* Diagram: one step at the centre, three budget gauges, the AWS ring        */
/* ------------------------------------------------------------------------ */

/** Container width (px) below which the diagram switches to its stacked layout. */
const BUDGETS_NARROW_PX = 760;

const FONT = 'sans-serif';
const INK = '#16191f';
const MUTED = '#414d5c';
const BLUE = '#0972d3';
const BLUE_DARK = '#065299';
const BLUE_TINT = '#f2f8fd';
const AMBER = '#8b6c00';
const AMBER_TINT = '#fbf3d5';
const PURPLE = '#6f4cc4';
const PURPLE_TINT = '#efe7fb';
const TEAL = '#1f7a70';
const TEAL_TINT = '#e6f4f2';
const SLATE = '#414d5c';
const RING_TINT = '#eef1f4';
const NEUTRAL = '#879596';

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface RingLine {
  text: string;
  y: number;
  bold: boolean;
}

interface BudgetsLayout {
  W: number;
  H: number;
  ring: Rect;
  ringLines: RingLine[];
  inner: Rect;
  step: Rect;
  arith: Rect;
  memory: Rect;
  comm: Rect;
  commLines: string[];
  fail: Rect;
  chips: Rect[];
  ownsLines: RingLine[];
  arrows: boolean;
}

const SHAPES: Array<{ title: string; wide: string[]; narrow: string }> = [
  { title: 'A cluster per job', wide: ['SageMaker training jobs'], narrow: 'SageMaker training jobs' },
  {
    title: 'A long-lived Slurm cluster',
    wide: ['your own Slurm on EC2, AWS PCS,', 'HyperPod with Slurm'],
    narrow: 'your own Slurm on EC2, AWS PCS, HyperPod with Slurm',
  },
  {
    title: 'A long-lived Kubernetes cluster',
    wide: ['self-managed EKS, AWS Batch on EKS,', 'HyperPod with EKS'],
    narrow: 'self-managed EKS, AWS Batch on EKS, HyperPod with EKS',
  },
];

function budgetsLayout(narrow: boolean): BudgetsLayout {
  if (!narrow) {
    const chipW = 276;
    return {
      W: 900,
      H: 556,
      ring: { x: 8, y: 8, w: 884, h: 540 },
      ringLines: [
        { text: 'On AWS, the same step runs on every path; what differs is who owns the cluster around it', y: 32, bold: true },
        { text: 'who runs the cluster, who replaces a broken machine, who restarts the job: seven paths in three shapes', y: 50, bold: false },
      ],
      inner: { x: 24, y: 64, w: 852, h: 362 },
      step: { x: 325, y: 84, w: 250, h: 136 },
      arith: { x: 40, y: 84, w: 250, h: 136 },
      memory: { x: 610, y: 84, w: 250, h: 136 },
      comm: { x: 40, y: 240, w: 820, h: 54 },
      commLines: [
        'Splitting the step across GPUs pays for arithmetic and memory in network traffic',
        'per GPU on a p5.48xlarge: NVLink 450 GB/s, EFA 50 GB/s, nine times apart',
      ],
      fail: { x: 40, y: 314, w: 820, h: 96 },
      chips: [0, 1, 2].map((i) => ({ x: 24 + i * (chipW + 12), y: 440, w: chipW, h: 72 })),
      ownsLines: [
        {
          text: 'On every path, the training script owns its checkpoints, a save before the reservation ends, and a per-step log',
          y: 534,
          bold: true,
        },
      ],
      arrows: true,
    };
  }
  const x = 26;
  const w = 348;
  return {
    W: 400,
    H: 1064,
    ring: { x: 6, y: 6, w: 388, h: 1050 },
    ringLines: [
      { text: 'On AWS, the same step runs on every path;', y: 28, bold: true },
      { text: 'what differs is who owns the cluster around it', y: 46, bold: true },
      { text: 'who runs it, who replaces a broken machine,', y: 64, bold: false },
      { text: 'who restarts the job: seven paths in three shapes', y: 80, bold: false },
    ],
    inner: { x: 14, y: 92, w: 372, h: 708 },
    step: { x, y: 108, w, h: 136 },
    arith: { x, y: 260, w, h: 136 },
    memory: { x, y: 412, w, h: 136 },
    comm: { x, y: 564, w, h: 72 },
    commLines: [
      'Splitting the step pays in traffic',
      'per GPU on a p5.48xlarge: NVLink 450 GB/s,',
      'EFA 50 GB/s, nine times apart',
    ],
    fail: { x, y: 652, w, h: 132 },
    chips: [0, 1, 2].map((i) => ({ x: 14, y: 812 + i * 62, w: 372, h: 54 })),
    ownsLines: [
      { text: 'On every path, the training script owns its', y: 1012, bold: true },
      { text: 'checkpoints, a save before the reservation', y: 1028, bold: true },
      { text: 'ends, and a per-step log', y: 1044, bold: true },
    ],
    arrows: false,
  };
}

function Card({ r, stroke, fill = '#ffffff', width = 1.5 }: { r: Rect; stroke: string; fill?: string; width?: number }) {
  return <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={6} fill={fill} stroke={stroke} strokeWidth={width} />;
}

function StepCard({ r }: { r: Rect }) {
  const pad = 12;
  const gap = 8;
  const pw = (r.w - 2 * pad - 2 * gap) / 3;
  const phases = [
    { name: 'Forward', sub: '2N' },
    { name: 'Backward', sub: '4N' },
    { name: 'Update', sub: 'Adam' },
  ];
  const cx = r.x + r.w / 2;
  return (
    <g>
      <Card r={r} stroke={BLUE_DARK} fill={BLUE_TINT} width={2} />
      <text x={cx} y={r.y + 20} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK} textAnchor="middle">
        One training step
      </text>
      {phases.map((p, i) => {
        const px = r.x + pad + i * (pw + gap);
        return (
          <g key={p.name}>
            <rect x={px} y={r.y + 32} width={pw} height={54} rx={4} fill="#ffffff" stroke={BLUE} strokeWidth={1.5} />
            <text x={px + pw / 2} y={r.y + 54} fontFamily={FONT} fontSize={12} fontWeight={600} fill={INK} textAnchor="middle">
              {p.name}
            </text>
            <text x={px + pw / 2} y={r.y + 72} fontFamily={FONT} fontSize={11} fill={MUTED} textAnchor="middle">
              {p.sub}
            </text>
          </g>
        );
      })}
      <text x={cx} y={r.y + 108} fontFamily={FONT} fontSize={11} fill={MUTED} textAnchor="middle">
        2N + 4N = 6N FLOPs per token
      </text>
      <text x={cx} y={r.y + 124} fontFamily={FONT} fontSize={11} fill={MUTED} textAnchor="middle">
        N = parameters
      </text>
    </g>
  );
}

function ArithmeticGauge({ r }: { r: Rect }) {
  const bx = r.x + 12;
  const bw = r.w - 24;
  const by = r.y + 48;
  const bh = 22;
  const fw = (bw * 2) / 6;
  return (
    <g>
      <Card r={r} stroke={BLUE} />
      <text x={bx} y={r.y + 20} fontFamily={FONT} fontSize={13} fontWeight={600} fill={BLUE_DARK}>
        Arithmetic
      </text>
      <text x={bx} y={r.y + 37} fontFamily={FONT} fontSize={11} fill={MUTED}>
        6 FLOPs per parameter per token
      </text>
      <rect x={bx} y={by} width={fw} height={bh} fill={BLUE_TINT} stroke={BLUE} strokeWidth={1} />
      <rect x={bx + fw} y={by} width={bw - fw} height={bh} fill={BLUE} stroke={BLUE} strokeWidth={1} />
      <text x={bx + fw / 2} y={by + 15} fontFamily={FONT} fontSize={11} fontWeight={600} fill={INK} textAnchor="middle">
        forward 2
      </text>
      <text x={bx + fw + (bw - fw) / 2} y={by + 15} fontFamily={FONT} fontSize={11} fontWeight={600} fill="#ffffff" textAnchor="middle">
        backward 4
      </text>
      <text x={bx} y={r.y + 92} fontFamily={FONT} fontSize={11} fill={MUTED}>
        Llama 3 405B on 15.6T tokens:
      </text>
      <text x={bx} y={r.y + 108} fontFamily={FONT} fontSize={11} fontWeight={600} fill={INK}>
        6ND = 3.80e25 FLOPs,
      </text>
      <text x={bx} y={r.y + 124} fontFamily={FONT} fontSize={11} fill={MUTED}>
        {"Meta's budget: 3.8e25"}
      </text>
    </g>
  );
}

function MemoryGauge({ r }: { r: Rect }) {
  const bx = r.x + 12;
  const bw = r.w - 24;
  const by = r.y + 48;
  const bh = 22;
  const maxGb = 132;
  const sx = (gb: number) => bx + (gb / maxGb) * bw;
  const segs = [
    { from: 0, to: STATE_GB.weights, fill: AMBER_TINT },
    { from: STATE_GB.weights, to: STATE_GB.weights + STATE_GB.grads, fill: AMBER_TINT },
    { from: STATE_GB.weights + STATE_GB.grads, to: STATE_TOTAL_GB, fill: AMBER },
  ];
  const mx = sx(H100_GB);
  /** The optimizer's label sits past the 80 GB line, so the line never crosses it. */
  const optimizerLabelX = (mx + sx(STATE_TOTAL_GB)) / 2;
  return (
    <g>
      <Card r={r} stroke={AMBER} />
      <text x={bx} y={r.y + 20} fontFamily={FONT} fontSize={13} fontWeight={600} fill={AMBER}>
        Memory
      </text>
      <text x={bx} y={r.y + 37} fontFamily={FONT} fontSize={11} fill={MUTED}>
        16 bytes per parameter of model state
      </text>
      {segs.map((seg) => (
        <rect
          key={`mem-${seg.from}`}
          x={sx(seg.from)}
          y={by}
          width={sx(seg.to) - sx(seg.from)}
          height={bh}
          fill={seg.fill}
          stroke={AMBER}
          strokeWidth={1}
        />
      ))}
      {segs.slice(0, 2).map((seg) => (
        <text
          key={`mem-label-${seg.from}`}
          x={(sx(seg.from) + sx(seg.to)) / 2}
          y={by + 15}
          fontFamily={FONT}
          fontSize={11}
          fontWeight={600}
          fill={INK}
          textAnchor="middle"
        >
          2
        </text>
      ))}
      <text x={optimizerLabelX} y={by + 15} fontFamily={FONT} fontSize={11} fontWeight={600} fill="#ffffff" textAnchor="middle">
        12 optimizer
      </text>
      <line x1={mx} y1={by - 5} x2={mx} y2={by + bh + 5} stroke={INK} strokeWidth={1.5} strokeDasharray="4 3" />
      <text x={mx} y={r.y + 89} fontFamily={FONT} fontSize={11} fontWeight={600} fill={INK} textAnchor="middle">
        80 GB: one H100
      </text>
      <text x={bx} y={r.y + 108} fontFamily={FONT} fontSize={11} fontWeight={600} fill={INK}>
        Llama 3.1 8B: 128.5 GB,
      </text>
      <text x={bx} y={r.y + 124} fontFamily={FONT} fontSize={11} fill={MUTED}>
        1.6 times one 80 GB H100
      </text>
    </g>
  );
}

function FailureGauge({ r, narrow }: { r: Rect; narrow: boolean }) {
  const bx = r.x + 12;
  const bw = r.w - 24;
  const by = narrow ? r.y + 86 : r.y + 50;
  const bh = 16;
  const sx = (h: number) => bx + (h / 24) * bw;
  const marks: number[] = [];
  for (let t = INTERRUPTION_HOURS; t < 24; t += INTERRUPTION_HOURS) marks.push(t);
  const ticks = [0, 6, 12, 18, 24];
  const tickY = by + bh + 18;
  return (
    <g>
      <Card r={r} stroke={PURPLE} />
      <text x={bx} y={r.y + 20} fontFamily={FONT} fontSize={13} fontWeight={600} fill={PURPLE}>
        Time between failures
      </text>
      <text x={bx} y={r.y + 37} fontFamily={FONT} fontSize={11} fill={MUTED}>
        a synchronous job can stop when any one GPU fails
      </text>
      <text
        x={narrow ? bx : r.x + r.w - 12}
        y={narrow ? r.y + 56 : r.y + 20}
        fontFamily={FONT}
        fontSize={11}
        fill={MUTED}
        textAnchor={narrow ? 'start' : 'end'}
      >
        Llama 3 405B, up to 16K GPUs, 54 days:
      </text>
      <text
        x={narrow ? bx : r.x + r.w - 12}
        y={narrow ? r.y + 72 : r.y + 37}
        fontFamily={FONT}
        fontSize={11}
        fontWeight={600}
        fill={INK}
        textAnchor={narrow ? 'start' : 'end'}
      >
        one unexpected interruption every 3.1 hours
      </text>
      <rect x={bx} y={by} width={bw} height={bh} fill={PURPLE_TINT} stroke={PURPLE} strokeWidth={1} />
      {marks.map((t) => (
        <line key={`int-${t.toFixed(2)}`} x1={sx(t)} y1={by - 4} x2={sx(t)} y2={by + bh + 4} stroke={PURPLE} strokeWidth={2.5} />
      ))}
      {ticks.map((t) => (
        <g key={`tick-${t}`}>
          <line x1={sx(t)} y1={by + bh} x2={sx(t)} y2={by + bh + 6} stroke={MUTED} strokeWidth={1} />
          <text
            x={sx(t)}
            y={tickY}
            fontFamily={FONT}
            fontSize={11}
            fill={MUTED}
            textAnchor={t === 0 ? 'start' : t === 24 ? 'end' : 'middle'}
          >
            {`${t} h`}
          </text>
        </g>
      ))}
    </g>
  );
}

function CommStrip({ r, lines }: { r: Rect; lines: string[] }) {
  const cx = r.x + r.w / 2;
  return (
    <g>
      <Card r={r} stroke={TEAL} fill={TEAL_TINT} />
      {lines.map((line, i) => (
        <text
          key={line}
          x={cx}
          y={r.y + 20 + i * 17}
          fontFamily={FONT}
          fontSize={i === 0 ? 12 : 11}
          fontWeight={i === 0 ? 600 : 400}
          fill={i === 0 ? INK : MUTED}
          textAnchor="middle"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function ShapeChip({ r, title, lines }: { r: Rect; title: string; lines: string[] }) {
  return (
    <g>
      <Card r={r} stroke={NEUTRAL} />
      <text x={r.x + 12} y={r.y + 20} fontFamily={FONT} fontSize={12} fontWeight={600} fill={INK}>
        {title}
      </text>
      {lines.map((line, i) => (
        <text key={line} x={r.x + 12} y={r.y + 38 + i * 16} fontFamily={FONT} fontSize={11} fill={MUTED}>
          {line}
        </text>
      ))}
    </g>
  );
}

function ThreeBudgetsDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, BUDGETS_NARROW_PX);
  const L = budgetsLayout(narrow);
  const ringCx = L.ring.x + L.ring.w / 2;
  const midY = L.step.y + L.step.h / 2;
  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${L.W} ${L.H}`}
        role="img"
        aria-labelledby="three-budgets-map-title"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <title id="three-budgets-map-title">
          One training step sits at the centre and spends three budgets. Arithmetic: about 6 FLOPs per
          parameter per token, 2 in the forward pass and 4 in the backward pass; for Llama 3 405B on 15.6T
          tokens, 6ND is 3.80e25 FLOPs, Meta&apos;s 3.8e25-FLOP budget. Memory: 16 bytes per parameter of
          model state, 2 for weights, 2 for gradients and 12 for the optimizer, which for Llama 3.1 8B is
          128.5 GB, 1.6 times one 80 GB H100. Time between failures: Llama 3 405B, on up to 16K GPUs, saw
          one unexpected interruption every 3.1 hours over 54 days. Splitting the step across GPUs pays in
          network traffic, and per GPU on a p5.48xlarge NVLink at 450 GB/s is nine times EFA at 50 GB/s.
          Around all of it, on AWS, seven paths in three cluster shapes differ in who runs the cluster,
          who replaces a broken machine and who restarts the job, and on every path the training script
          owns its checkpoints, a save before the reservation ends, and a per-step log.
        </title>
        <defs>
          <marker
            id="three-budgets-map-ah"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill={MUTED} />
          </marker>
        </defs>
        <rect x={0} y={0} width={L.W} height={L.H} rx={8} fill="#ffffff" />
        <rect x={L.ring.x} y={L.ring.y} width={L.ring.w} height={L.ring.h} rx={14} fill={RING_TINT} stroke={SLATE} strokeWidth={1.5} />
        {L.ringLines.map((line) => (
          <text
            key={line.text}
            x={ringCx}
            y={line.y}
            fontFamily={FONT}
            fontSize={line.bold ? 13 : 11}
            fontWeight={line.bold ? 600 : 400}
            fill={line.bold ? INK : MUTED}
            textAnchor="middle"
          >
            {line.text}
          </text>
        ))}
        <rect x={L.inner.x} y={L.inner.y} width={L.inner.w} height={L.inner.h} rx={10} fill="#ffffff" stroke={NEUTRAL} strokeWidth={1} />

        <StepCard r={L.step} />
        <ArithmeticGauge r={L.arith} />
        <MemoryGauge r={L.memory} />
        <CommStrip r={L.comm} lines={L.commLines} />
        <FailureGauge r={L.fail} narrow={narrow} />

        {L.arrows && (
          <g>
            <line
              x1={L.step.x - 2}
              y1={midY}
              x2={L.arith.x + L.arith.w + 4}
              y2={midY}
              stroke={MUTED}
              strokeWidth={1.5}
              markerEnd="url(#three-budgets-map-ah)"
            />
            <line
              x1={L.step.x + L.step.w + 2}
              y1={midY}
              x2={L.memory.x - 4}
              y2={midY}
              stroke={MUTED}
              strokeWidth={1.5}
              markerEnd="url(#three-budgets-map-ah)"
            />
            <line
              x1={L.step.x + L.step.w / 2}
              y1={L.step.y + L.step.h + 2}
              x2={L.step.x + L.step.w / 2}
              y2={L.comm.y - 4}
              stroke={MUTED}
              strokeWidth={1.5}
              markerEnd="url(#three-budgets-map-ah)"
            />
          </g>
        )}

        {SHAPES.map((s, i) => (
          <ShapeChip key={s.title} r={L.chips[i]} title={s.title} lines={narrow ? [s.narrow] : s.wide} />
        ))}
        {L.ownsLines.map((line) => (
          <text key={line.text} x={ringCx} y={line.y} fontFamily={FONT} fontSize={11} fontWeight={600} fill={INK} textAnchor="middle">
            {line.text}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function ThreeBudgets() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Estimate a run's arithmetic, memory and failure budgets before you choose a framework or an AWS service, because those three numbers decide which choices remain (papers, AWS and NVIDIA pages, PyTorch v2.15.0 and Megatron Core core_v0.20.0, read 2026-10-31, and our DGX Spark runs)"
          >
            1. A Training Run Is Three Budgets
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Before a large language model trains, the team running it needs a plan it can buy capacity
            against: how many accelerators, for how long; how to lay the model across them; which
            software and which AWS path; and how to keep the run alive and know that it is healthy. Each
            part of that plan follows from three budgets that the model and the cluster fix before the
            first step runs: arithmetic, memory and time between failures.
          </Box>
          <Box variant="p">
            The challenge is to put a number on each budget while the framework and the service are still
            open choices, because the numbers decide which choices remain. The dive answers six questions
            in this order, each answer resting on the ones before it:
          </Box>
          <ol>
            <li>How much compute does the run need, and how long will it take?</li>
            <li>Will the model fit, and how should it be split across accelerators?</li>
            <li>Which software implements that split?</li>
            <li>How does the run keep going when hardware fails?</li>
            <li>Which AWS path runs it, and what does it cost?</li>
            <li>How do you know it is healthy while it runs?</li>
          </ol>
          <Box variant="p">
            Section 2, Getting Started, gives the order in which the sections answer them and a shorter
            route for each kind of question. This section states the three budgets in plain words, and the one way of
            reasoning that the rest of the dive applies to them.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Hold the three numbers every later section refines: 6 floating-point operations (FLOPs) per parameter per token, 16 bytes per parameter, and on Llama 3's run one unexpected interruption every 3.1 hours"
          >
            Three budgets, in plain words
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">Training a large language model spends three budgets.</Box>
          <ul>
            <li>
              <strong>Arithmetic.</strong> About 6 FLOPs for every parameter, for every token the model
              trains on{' '}
              <Cite tier={3} href={KAPLAN} venue="preprint">
                Scaling Laws for Neural Language Models, Section 2.1
              </Cite>
              : 2 in the forward pass, which runs the model and computes the loss, and 4 in the backward
              pass, which computes the gradients{' '}
              <Cite tier={3} href={PALM} venue="preprint">
                PaLM, Appendix B
              </Cite>
              . The rule holds at full scale. Llama 3 405B has 405,853,388,800 parameters{' '}
              <Cite tier={1} href={HF_405B}>
                Meta&apos;s Llama 3.1 405B model metadata
              </Cite>{' '}
              and was pre-trained on 15.6T tokens{' '}
              <Cite tier={3} href={LLAMA3} venue="preprint">
                Llama 3 Herd of Models, Section 1
              </Cite>
              . Six times parameters times tokens, 6ND, is 3.80e25 FLOPs, so 6ND reproduces Meta&apos;s own
              3.8e25-FLOP budget, our arithmetic (section 4, Counting the Arithmetic).
            </li>
            <li>
              <strong>Memory.</strong> About 16 bytes for every parameter before the model reads a single
              token: 2 for its 16-bit weights, 2 for its 16-bit gradients, and 12 for the optimizer state
              of mixed-precision Adam, a 32-bit master copy of the weights and two running averages{' '}
              <Cite tier={3} href={ZERO} venue="SC 2020">
                ZeRO (Zero Redundancy Optimizer), Section 3.1
              </Cite>
              . Llama 3.1 8B, with 8,030,261,248 parameters{' '}
              <Cite tier={1} href={HF_8B}>
                Meta&apos;s Llama 3.1 8B model metadata
              </Cite>
              , therefore holds 128.5 GB of model state, 1.6 times the 80 GB of one H100{' '}
              <Cite tier={1} href={H100_SPEC} kind="vendor-claim">
                NVIDIA H100 specification
              </Cite>
              , before it stores a single activation, one of the intermediate tensors the backward pass
              reads (section 5, The Memory Budget).
            </li>
            <li>
              <strong>Time between failures.</strong> Training is synchronous, every step waiting on every
              GPU, so &quot;a single GPU failure may require a restart of the entire job&quot;{' '}
              <Cite tier={3} href={LLAMA3} venue="preprint">
                Llama 3 Herd of Models, Section 3.3.4
              </Cite>
              . Llama 3 405B, trained on up to 16K GPUs, saw one unexpected interruption every 3.1 hours
              over a 54-day window of pre-training, and still spent more than 90% of its time training{' '}
              <Cite tier={3} href={LLAMA3} venue="preprint">
                Llama 3 Herd of Models, Sections 3.3.1 and 3.3.4
              </Cite>{' '}
              (section 17, Failure Is the Steady State).
            </li>
          </ul>
          <Box variant="p">
            Splitting the work across GPUs pays for the first two budgets in network traffic, and a split
            that works keeps its most frequent traffic inside one instance. On a p5.48xlarge, an EC2
            (Amazon Elastic Compute Cloud) instance with eight H100s, each GPU reaches the other seven over NVLink at 450 GB/s per direction, our reading of the
            900 GB/s NVIDIA lists per Hopper GPU{' '}
            <Cite tier={1} href={NVLINK_PAGE} kind="vendor-claim">
              NVIDIA NVLink specifications
            </Cite>
            , and the rest of the cluster over a 50 GB/s share of the instance&apos;s 3,200 Gb/s of EFA
            (Elastic Fabric Adapter) bandwidth{' '}
            <Cite tier={1} href={EC2_AC}>
              EC2 accelerated computing instance specifications
            </Cite>
            . Per GPU, NVLink is nine times EFA, our arithmetic from those two pages (section 7,
            Collectives &amp; What They Cost).
          </Box>
          <Box variant="p">
            On AWS the training step is the same on every path: the same model code and the same
            collectives, the calls through which a group of GPUs exchanges data, over EFA. What differs is
            the cluster around the step: who runs it, who replaces a broken machine and who restarts the
            job. Section 20, Who Owns What on AWS, places seven paths in three cluster shapes: a cluster
            per job, as SageMaker training jobs run; a long-lived Slurm cluster, whether your own Slurm on
            EC2, PCS (AWS Parallel Computing Service) or SageMaker HyperPod with Slurm; and a long-lived
            Kubernetes cluster on EKS (Amazon Elastic Kubernetes Service), self-managed, under AWS Batch or
            under HyperPod.
          </Box>
          <Box variant="p">
            On every path the training script owns three things itself: its checkpoints, a per-step log
            that a hang detector can read, and a last save that finishes before the reservation ends. A
            Capacity Block, a reservation of accelerators for
            a fixed window, begins terminating its instances at 11:00 UTC (Coordinated Universal Time) on
            its final day, 30 minutes before it ends at 11:30{' '}
            <Cite tier={1} href={EC2_CB}>
              EC2 User Guide, Capacity Blocks
            </Cite>
            .
          </Box>
          <ThreeBudgetsDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic. The three bars are to scale: 2 and 4 FLOPs per parameter per token; Llama 3.1
            8B&apos;s model state at 2 bytes for 16-bit weights, 2 for 16-bit gradients and 12 for the
            optimizer, against one 80 GB H100; and one day marked at Llama 3 405B&apos;s average interval
            of 3.1 hours. The paper gives counts over 54 days, not times, so the even spacing of the marks
            is illustrative, not measured.
          </Box>
          <ExpandableSection headerText="The arithmetic behind these figures">
            <SpaceBetween size="s">
              <Box variant="p">
                <code>6ND = 6 x 405,853,388,800 x 15.6e12 = 3.80e25 FLOPs</code>, against Meta&apos;s
                stated 3.8e25. The paper does not state how it counts FLOPs, so the match holds for the
                configuration Meta trained and says nothing about Meta&apos;s counting rule (section 4).
              </Box>
              <Box variant="p">
                <code>16 x 8,030,261,248 bytes = 128.5 GB</code>, and 128.5 / 80 = 1.6. A framework that
                keeps 32-bit main gradients beside 16-bit weights pays 18 bytes per parameter instead{' '}
                <Cite tier={1} href={MEGATRON_DIST_OPT}>
                  Megatron Core distributed optimizer guide L14-L20
                </Cite>{' '}
                (section 5).
              </Box>
              <Box variant="p">
                <code>54 days x 24 hours / 419 = 3.1 hours</code>: in the 54-day window the run had 466
                interruptions, 47 of them planned and 419 unexpected{' '}
                <Cite tier={3} href={LLAMA3} venue="preprint">
                  Llama 3 Herd of Models, Section 3.3.4
                </Cite>
                , our arithmetic.
              </Box>
              <Box variant="p">
                <code>3,200 Gb/s / 8 bits per byte / 8 GPUs = 50 GB/s per GPU</code>, and 450 / 50 = 9.
                Neither page prints 450 or 50, and AWS does not state whether its 3,200 Gb/s is per
                direction (section 7).
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict what any technique in the dive costs before a section prices it, by asking which of four resources it buys and which it spends"
          >
            Every technique trades one resource for another
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Arithmetic, memory, communication and time are four resources, and almost every technique in
            the dive buys one of them with another. Three examples, each priced in its own section:
          </Box>
          <ul>
            <li>
              <strong>Recomputation buys memory with arithmetic.</strong> It re-runs each layer&apos;s
              forward pass during the backward pass instead of storing that layer&apos;s activations. Each
              layer then keeps 2 sbh bytes, where sbh is sequence length times micro-batch size times
              hidden size{' '}
              <Cite tier={3} href={KORTHIKANTI} venue="MLSys 2023">
                Reducing Activation Recomputation, Table 2
              </Cite>
              ; for a layer of Llama 3.1 8B, our run on one GB10 measured 34.03 to 41.03 sbh without
              recomputation, depending on whether the layer&apos;s MLP (multilayer perceptron) activation is
              fused, and 2.00 sbh with it{' '}
              <Cite tier={0} href={E1_URL}>
                {E1_TITLE}
              </Cite>
              . The price is one more forward pass, about 33% more FLOPs{' '}
              <Cite tier={3} href={KORTHIKANTI} venue="MLSys 2023">
                Reducing Activation Recomputation, Section 6.2
              </Cite>
              , which cost 14% to 16% more step time in our two runs of a 1B-parameter Llama shape at
              2,048 tokens on one GB10{' '}
              <Cite tier={0} href={E2_URL}>
                {E2_TITLE}
              </Cite>{' '}
              (section 5, The Memory Budget).
            </li>
            <li>
              <strong>Sharding buys memory with communication.</strong> It splits model state across the
              data-parallel ranks, the processes that each train on their own share of the batch, instead
              of copying it to every one. Fully sharded, as FSDP (Fully Sharded Data Parallel) and stage 3
              of ZeRO do it, each of d ranks holds 16/d bytes per parameter{' '}
              <Cite tier={3} href={ZERO} venue="SC 2020">
                ZeRO, Section 5
              </Cite>
              : 16.1 GB per GPU of the 8B model&apos;s 128.5 GB across the eight GPUs of one p5.48xlarge,
              our arithmetic. The price is collectives every step, about 50% more communication volume
              than plain data parallelism{' '}
              <Cite tier={3} href={ZERO} venue="SC 2020">
                ZeRO, Section 1
              </Cite>{' '}
              (section 8, Data Parallelism &amp; Sharding).
            </li>
            <li>
              <strong>Asynchronous checkpoints buy time with host memory.</strong> A checkpoint is the
              saved state a restart resumes from. An asynchronous save first copies that state into CPU
              memory and then writes it in a separate thread{' '}
              <Cite tier={1} href={ASYNC_SAVE} kind="code">
                PyTorch v2.15.0 state_dict_saver.py L233-L234
              </Cite>
              , so training pauses only for the copy, the run can save more often, and each failure loses
              less work. Section 18, Checkpointing, prices the trade for Llama 3.1 70B on 256 H100 GPUs.
            </li>
          </ul>
          <Box variant="p">
            The parallelisms follow the same pattern. Each splits the arithmetic or the memory of a step
            and pays with a collective, and how often that collective fires decides which link it can
            ride. Tensor parallelism all-reduces (sums an array across GPUs and leaves the sum on each)
            inside every layer, twice in the forward pass and twice in the backward, for every
            micro-batch, the slice of the batch that goes through one forward and backward pass{' '}
            <Cite tier={3} href={PTDP} venue="SC 2021">
              Efficient Large-Scale Language Model Training on GPU Clusters, Sections 2.3 and 3.3.2
            </Cite>
            , so it stays on NVLink inside one instance. Data parallelism&apos;s gradient all-reduce can
            run once per batch{' '}
            <Cite tier={3} href={PTDP} venue="SC 2021">
              Efficient Large-Scale Language Model Training on GPU Clusters, Section 3.3.2
            </Cite>
            , so it can cross EFA (section 7, Collectives &amp; What They Cost).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Leave with the three estimates to make first, in order, and where each one turns into a decision"
          >
            Put a number on each budget before you choose
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">Make the three estimates in this order, because every later choice rests on them:</Box>
          <ol>
            <li>
              <strong>Arithmetic.</strong> Multiply 6 by your model&apos;s parameters and its training
              tokens, then divide by the accelerators&apos; peak and an MFU (model FLOPs utilization, the
              share of that peak the model&apos;s own FLOPs achieve) to get accelerator-hours. Calculator A
              in section 4 does the division with 40% MFU as a labelled assumption, inside the 38% to 43%
              that Llama 3 405B reported for its BF16 (bfloat16) pre-training on H100{' '}
              <Cite tier={3} href={LLAMA3} venue="preprint">
                Llama 3 Herd of Models, Section 3.3.2 and Table 4
              </Cite>
              .
            </li>
            <li>
              <strong>Memory.</strong> Multiply the parameters by 16 bytes and set the total against one
              accelerator&apos;s memory. When model state alone does not fit, as Llama 3.1 8B&apos;s 128.5
              GB does not fit one 80 GB H100, the first split is forced before a single activation is
              counted. Calculator B in section 5 adds the activations and prices each lever.
            </li>
            <li>
              <strong>Failures.</strong> Divide one node&apos;s time between failures by your node count:
              the job&apos;s MTTF (mean time to failure) is <code>1 / (N_nodes x r_f)</code>, with r_f the
              failure rate per node{' '}
              <Cite tier={3} href={META_REL} venue="HPCA 2025">
                Revisiting Reliability in Large-Scale ML Research Clusters, Section III
              </Cite>
              . Section 17 reads that interval off for your node count, and Calculator D in section 18
              sizes the checkpoint interval against it.
            </li>
          </ol>
          <Box variant="p">
            With those three numbers, section 20 shows which AWS path takes on which part of keeping the
            run alive, and section 28, Choosing Your Path, turns the comparison into a choice. Begin with
            section 2, Getting Started, for the four ideas the dive builds on and the shortest route to
            your question.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
