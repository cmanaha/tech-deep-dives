import { useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import {
  Cite,
  gh,
  ghTree,
  GUIDE_URL,
  HYPERPOD_RECIPES_TAG,
  NEURON_SDK_SHA,
  TORCHTITAN_NEURON_TAG,
  TORCHTITAN_TAG,
} from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import { DENSE_MODELS, GB, INSTANCES, PRICES, SOURCES, rankFacts, shapeOf } from '../lib/presets';
import type { InstanceId, PricePath } from '../lib/presets';
import { modelStateBytes } from '../lib/memory';
import { evaluateLayout } from '../lib/parallelism';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Register rows cited without re-opening their source keep the register's date. */
const REGISTER_DATE = '2026-10-30';

/** AWS Neuron SDK documentation source at the v2.33.0 commit (read 2026-10-31). */
function neuron(path: string, lines?: string): string {
  return gh('aws-neuron/aws-neuron-sdk', NEURON_SDK_SHA, path, lines);
}
const TTN_ABOUT = 'training/torchtitan/about-torchtitan-neuron.rst';
const TTN_STACK = neuron(TTN_ABOUT, 'L19-L26');
const TTN_MATRIX = neuron(TTN_ABOUT, 'L37-L60');
const TTN_PARALLEL = neuron(TTN_ABOUT, 'L62-L99');
const TTN_LAYERS = neuron(TTN_ABOUT, 'L102-L162');
const TTN_VALIDATED = neuron(TTN_ABOUT, 'L165-L200');
const TTN_RANKS = neuron(TTN_ABOUT, 'L203-L209');
const TTN_MAPPING = neuron(TTN_ABOUT, 'L234-L257');
const TTN_LIMITS = neuron(TTN_ABOUT, 'L262-L274');
const TRN3_NOTE = neuron('includes/torch/trn3-sizing-note.txt', 'L1-L11');
const TUT = 'training/torchtitan/tutorials/tutorial-basic-training.rst';
const TUT_LIMITS = neuron(TUT, 'L59-L65');
const TUT_LAUNCH = neuron(TUT, 'L45-L117');
const SETUP_LINE = neuron('training/torchtitan/get-started/setup-torchtitan-neuron.rst', 'L49-L84');
const TUT_HEALTHY = neuron(TUT, 'L145-L158');
const TUT_NGPU = neuron(TUT, 'L166-L178');
const TUT_MULTI = neuron(TUT, 'L182-L246');
const TTN_RN = neuron('release-notes/components/torchtitan-neuron.rst', 'L11-L36');
const TN_BETA = neuron('release-notes/components/torchneuron.rst', 'L15-L22');
const TN_MX = neuron('release-notes/components/torchneuron.rst', 'L186-L187');
const TORCH_BETA = neuron('torch/about-pytorch-neuron.rst', 'L12-L16');
const TORCH_DTYPES = neuron('torch/about-pytorch-neuron.rst', 'L115-L118');
const NXDT_ARCHIVE = neuron('archive/nxd-training/index.rst', 'L21-L27');
const ANN = 'about-neuron/announcements/neuron2.x/';
const ANN_DEC = neuron(`${ANN}announcement-end-of-support-nxdt-nxd-core.rst`, 'L1-L15');
const ANN_FEB = neuron(`${ANN}announce-eos-nxdt-nxd-core-training.rst`, 'L1-L15');
const ANN_MAY = neuron(`${ANN}announce-maintenance-nxdt-nxd-core-training.rst`, 'L1-L14');
const DLAMI_TTN = neuron('release-notes/components/dlamis.rst', 'L28');
const DLAMI_NXDT = neuron('release-notes/components/dlamis.rst', 'L74');
const LNC_DOC = 'about-neuron/arch/neuron-features/logical-neuroncore-config.rst';
const LNC = neuron(LNC_DOC, 'L12-L14');
const LNC_HBM = neuron(LNC_DOC, 'L51-L66');
const TRN2_ARCH = neuron('about-neuron/arch/neuron-hardware/trn2-arch.rst', 'L27-L54');
const TRN2_SPECS = neuron('about-neuron/arch/neuron-hardware/trn2-arch.rst', 'L55-L105');
const TRN2_CHIP = neuron('about-neuron/arch/neuron-hardware/trainium2.rst', 'L19-L32');
const TRN3_CHIP = neuron('about-neuron/arch/neuron-hardware/trainium3.rst', 'L27-L35');
const NC3 = neuron('about-neuron/arch/neuron-hardware/neuron-core-v3.rst', 'L21-L26');

/** AWS's TorchTitan Neuron fork at the Neuron 2.33.0 release tag (read 2026-10-31). */
const FORK = 'aws-neuron/torchtitan-neuron';
const TTN_PEAK = gh(FORK, TORCHTITAN_NEURON_TAG, 'torchtitan/tools/utils.py', 'L194-L206');
const TTN_70B = gh(FORK, TORCHTITAN_NEURON_TAG, 'torchtitan_neuron/docs/dense-tutorials.md', 'L121-L143');
const TTN_TESTS = gh(FORK, TORCHTITAN_NEURON_TAG, 'torchtitan_neuron/tests/README.md', 'L3-L5');
const TTN_BENCH = ghTree(FORK, TORCHTITAN_NEURON_TAG, 'benchmarks');
const TTN_CI = ghTree(FORK, TORCHTITAN_NEURON_TAG, '.github/workflows');
const TTN_DIR = ghTree(FORK, TORCHTITAN_NEURON_TAG, 'torchtitan_neuron');

/** The GPU path the earlier sections use. */
const TT_RELEASE = 'https://github.com/pytorch/torchtitan/releases/tag/v0.4.0';
const TT_H100_BENCH = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'docs/benchmarks/llama3_h100_202412_torchtitan.md');

/** AWS documentation for the paths (read 2026-10-31 unless a Cite says otherwise). */
const SM_DG = 'https://docs.aws.amazon.com/sagemaker/latest/dg/';
const HP_EKS_DEEP = `${SM_DG}sagemaker-hyperpod-eks-resiliency-deep-health-checks.html`;
const HP_SLURM_DEEP = `${SM_DG}sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html`;
const HP_AUTO_RESUME = `${SM_DG}sagemaker-hyperpod-resiliency-slurm-auto-resume.html`;
const HP_TRN_SLURM_TUTORIAL = `${SM_DG}hyperpod-trainium-slurm-cluster-pretrain-tutorial.html`;
const SM_TRN_JOBS_TUTORIAL = `${SM_DG}sagemaker-hyperpod-trainium-sagemaker-training-jobs-pretrain-tutorial.html`;
const SM_PLANS = `${SM_DG}reserve-capacity-with-training-plans.html`;
const WARM_POOLS = `${SM_DG}train-warm-pools.html`;
const EKS_NEURON = 'https://docs.aws.amazon.com/eks/latest/userguide/device-management-neuron.html';
const PCS_PRICING = 'https://aws.amazon.com/pcs/pricing/';
const FSX_EFA = 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/efa-file-systems.html';
const RECIPES = 'aws/sagemaker-hyperpod-recipes';
const RECIPES_CURRENT = ghTree(RECIPES, HYPERPOD_RECIPES_TAG);
const RECIPES_V2 = ghTree(RECIPES, 'v2.0.0');
const RECIPES_V1 = ghTree(RECIPES, 'v1.5.1');

/* ------------------------------------------------------------------------ */
/* Numbers: every figure comes from the presets or a calculator             */
/* ------------------------------------------------------------------------ */

/** A preset figure this section prints; a missing one is a programming error, so fail at load. */
function need<T>(value: T | undefined, what: string): T {
  if (value === undefined) throw new RangeError(`Trainium section: no preset row for ${what}`);
  return value;
}

const TRN2 = INSTANCES['trn2.48xlarge'];
const P5 = INSTANCES['p5.48xlarge'];
const TRN2_RANKS = rankFacts(TRN2).ranksPerInstance;
const TRN2_CHIPS = TRN2.acceleratorsPerInstance.value;
const RANKS_PER_CHIP = rankFacts(TRN2).ranksPerAccelerator;
const TRN2_HBM_GIB = TRN2.hbmPerAccelerator[0].value;
const TRN2_RANK_GIB = need(TRN2.hbmPerRank?.[0], 'trn2 HBM per rank').value;
const TRN2_BF16 = TRN2.denseBf16TflopsPerAccelerator.value;
const TRN2_FP8 = need(TRN2.denseFp8TflopsPerAccelerator, 'trn2 dense FP8 peak').value;
const TRN2_EFA = TRN2.efaGbpsPerInstance.value;
const TRN2_EFA_PER_CHIP = TRN2_EFA / TRN2_CHIPS;
const P5_GPUS = P5.acceleratorsPerInstance.value;
const P5_EFA = P5.efaGbpsPerInstance.value;
const TRN3_RANK_GIB = INSTANCES['trn3-gen2-ultraserver'].hbmPerAccelerator[0].value / RANKS_PER_CHIP;

function rateOf(instance: InstanceId, path: PricePath): number {
  return need(
    PRICES.find((p) => p.instance === instance && p.path === path),
    `${path} rate for ${instance}`,
  ).usdPerUnitHour.value;
}
const TRN2_CB = rateOf('trn2.48xlarge', 'capacityBlock');
const TRN2_OD_HYD = rateOf('trn2.48xlarge', 'ec2OnDemand');
const TRN2_JOB = rateOf('trn2.48xlarge', 'sagemakerTraining');
const TRN2_PLAN = rateOf('trn2.48xlarge', 'trainingPlan');
const TRN1_CB = rateOf('trn1.32xlarge', 'capacityBlock');
const P5_CB = rateOf('p5.48xlarge', 'capacityBlock');

/** Dollars per peak dense BF16 PFLOP-hour on a Capacity Block (05 section 3.2). */
function perPeakPflopHour(instance: InstanceId, rate: number): number {
  const p = INSTANCES[instance];
  return rate / ((p.acceleratorsPerInstance.value * p.denseBf16TflopsPerAccelerator.value) / 1_000);
}
const TRN2_PER_PFLOP = perPeakPflopHour('trn2.48xlarge', TRN2_CB);
const TRN1_PER_PFLOP = perPeakPflopHour('trn1.32xlarge', TRN1_CB);
const P5_PER_PFLOP = perPeakPflopHour('p5.48xlarge', P5_CB);
const TRN1_BF16 = INSTANCES['trn1.32xlarge'].denseBf16TflopsPerAccelerator.value;
const P5_BF16 = P5.denseBf16TflopsPerAccelerator.value;

/** Calculator C on AWS's validated one-node layout, Llama 3.1 8B at TP 4 x FSDP 16 (T03-38, 03 W3). */
const SEQ = 8_192;
const LAYOUT_8B = evaluateLayout(
  {
    model: shapeOf(DENSE_MODELS['llama-3.1-8b']),
    instance: TRN2,
    instanceCount: 1,
    sequenceLength: SEQ,
    globalBatch: { sequences: 16 },
  },
  {
    tp: 4,
    cp: 1,
    pp: 1,
    dp: 16,
    interleavedChunks: 1,
    sharding: 'fsdp',
    microBatch: 1,
    recompute: 'none',
    gradientSync: 'everyMicroBatch',
  },
);
const STATE_8B_GB = LAYOUT_8B.memory.modelState.totalBytes / GB;
const TOTAL_8B_GB = LAYOUT_8B.memory.totalGB;
const RANK_GB = LAYOUT_8B.memory.capacity.gb;

/** The fork's four-node 70B command: TP 4 x FSDP 64 = 256 ranks (wave2-frameworks G3). */
const RANKS_70B = 4 * 64;
const P70 = DENSE_MODELS['llama-3.1-70b'].totalParameters.value;
const STATE_70B_PER_RANK_GB = modelStateBytes(P70, 16) / RANKS_70B / GB;

/** TorchTitan Neuron's MFU peak: 79 BF16 TFLOPS per NeuronCore x LNC 2 (utils.py L194-L206). */
const TTN_PEAK_PER_RANK = 79 * 2;
const TTN_PEAK_PER_CHIP = TTN_PEAK_PER_RANK * RANKS_PER_CHIP;

function fix(x: number, digits: number): string {
  return x.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
function int(x: number): string {
  return Math.round(x).toLocaleString('en-US');
}
function usd(x: number, digits = 2): string {
  return `$${fix(x, digits)}`;
}
/** Rates as the price files print them (no rounding). */
function rate(x: number): string {
  return `$${x.toLocaleString('en-US', { maximumFractionDigits: 5 })}`;
}

/* ------------------------------------------------------------------------ */
/* Diagram: the two training stacks, with the rank unit marked on each       */
/* ------------------------------------------------------------------------ */

const FONT = 'sans-serif';
const INK = '#0f1b2a';
const MUTED = '#5f6b7a';
const GREEN = '#037f0c';

type Side = 'gpu' | 'neuron';

const SIDE_STYLE: Record<Side, { fill: string; stroke: string }> = {
  gpu: { fill: '#f4f4f4', stroke: '#879596' },
  neuron: { fill: '#f2f8fd', stroke: '#0972d3' },
};

interface StackLayer {
  label: [string, string?];
  gpu: [string, string];
  neuron: [string, string];
}

const LAYERS: StackLayer[] = [
  {
    label: ['Training', 'library'],
    gpu: ['TorchTitan v0.4.0', 'the GPU path of sections 7 to 15'],
    neuron: ['TorchTitan Neuron 0.2.2+neuron.1', 'FSDP2, TP, CP, EP; PP not in tutorials'],
  },
  {
    label: ['PyTorch'],
    gpu: ['PyTorch 2.15', 'DeviceMesh, DTensor, fully_shard'],
    neuron: ['PyTorch 2.14.0', 'DeviceMesh, DTensor, fully_shard'],
  },
  {
    label: ['Device', 'backend'],
    gpu: ['CUDA device', 'nccl process group'],
    neuron: ['TorchNeuron, torch-neuronx 2.14.3.0', 'neuron device and process group'],
  },
  {
    label: ['Compiler and', 'collectives'],
    gpu: ['CUDA kernels and NCCL', 'NCCL reaches EFA through a plugin'],
    neuron: ['Neuron compiler and runtime', 'collectives; compiled graphs cached'],
  },
  {
    label: ['Links'],
    gpu: ['NVLink inside, EFA between', `${int(P5_EFA)} Gbps of EFA per instance`],
    neuron: ['NeuronLink-v3 inside, EFA between', `${int(TRN2_EFA)} Gbps of EFA, ${int(TRN2_EFA_PER_CHIP)} per chip`],
  },
];

const RANK_TEXT: Record<Side, string[]> = {
  gpu: ['1 rank = 1 H100 GPU', `NVLink joins all ${P5_GPUS}`, `${P5_GPUS} ranks per instance`, `TP ${P5_GPUS} = one instance (outlined)`],

  neuron: [
    '1 rank = 1 logical core',
    `${RANKS_PER_CHIP} ranks per chip at LNC=2`,
    `${TRN2_RANKS} ranks per instance`,
    `TP ${RANKS_PER_CHIP} = one chip (outlined)`,
  ],
};

const COLUMN_TITLE: Record<Side, [string, string]> = {
  gpu: ['GPU path: p5.48xlarge', `${P5_GPUS} x H100`],
  neuron: ['Neuron path: trn2.48xlarge', `${TRN2_CHIPS} x Trainium2, Neuron SDK 2.33.0`],
};

const STACK_TITLE =
  `The training stack on a GPU instance and on Trainium, layer by layer, with the unit a rank stands for. ` +
  `On a p5.48xlarge, TorchTitan v0.4.0 runs on PyTorch 2.15 with the CUDA device and NCCL, NVLink inside the ` +
  `instance and EFA between instances, and one rank is one H100 GPU, ${P5_GPUS} per instance. On a trn2.48xlarge, ` +
  `TorchTitan Neuron 0.2.2+neuron.1 runs on PyTorch 2.14.0 with TorchNeuron's neuron device and process group and ` +
  `the Neuron compiler, runtime and collectives, NeuronLink-v3 inside the instance and EFA between, and one rank is ` +
  `one logical NeuronCore: ${RANKS_PER_CHIP} per Trainium2 chip at LNC=2 and ${TRN2_RANKS} per instance, so a TP group ` +
  `of ${RANKS_PER_CHIP} fills one chip. Both instances carry ${int(TRN2_EFA)} Gbps of EFA.`;

const CELL_W = 32;
const CELL_H = 22;
const CELL_GAP = 5;

/** The rank grid: 8 GPUs (2 x 4) or 16 Trainium2 chips (4 x 4) with four logical cores each. */
function RankGrid({ side, x, y }: { side: Side; x: number; y: number }) {
  const rows = side === 'gpu' ? 2 : 4;
  const cols = 4;
  const w = cols * CELL_W + (cols - 1) * CELL_GAP;
  const h = rows * CELL_H + (rows - 1) * CELL_GAP;
  const cells: ReactNode[] = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const cx = x + c * (CELL_W + CELL_GAP);
      const cy = y + r * (CELL_H + CELL_GAP);
      const key = `${side}-${r}-${c}`;
      if (side === 'gpu') {
        cells.push(<rect key={key} x={cx} y={cy} width={CELL_W} height={CELL_H} rx={3} fill="#e9ebed" stroke="#414d5c" strokeWidth={1} />);
      } else {
        const first = r === 0 && c === 0;
        const iw = (CELL_W - 3 * 3) / 2;
        const ih = (CELL_H - 3 * 3) / 2;
        cells.push(
          <g key={key}>
            <rect
              x={cx}
              y={cy}
              width={CELL_W}
              height={CELL_H}
              rx={3}
              fill="#ffffff"
              stroke={first ? GREEN : '#065299'}
              strokeWidth={first ? 2.2 : 1}
            />
            {[0, 1].map((ir) =>
              [0, 1].map((ic) => (
                <rect
                  key={`${ir}${ic}`}
                  x={cx + 3 + ic * (iw + 3)}
                  y={cy + 3 + ir * (ih + 3)}
                  width={iw}
                  height={ih}
                  rx={1}
                  fill="#0972d3"
                />
              )),
            )}
          </g>,
        );
      }
    }
  }
  return (
    <g>
      {cells}
      {side === 'gpu' && (
        <rect
          x={x - 4}
          y={y - 4}
          width={w + 8}
          height={h + 8}
          rx={5}
          fill="none"
          stroke={GREEN}
          strokeWidth={2}
          strokeDasharray="5 3"
        />
      )}
    </g>
  );
}

const GRID_W = 4 * CELL_W + 3 * CELL_GAP;

/** A rank panel is as tall as its grid or its four caption lines, whichever is taller. */
function panelHeight(side: Side): number {
  const rows = side === 'gpu' ? 2 : 4;
  return Math.max(rows * CELL_H + (rows - 1) * CELL_GAP + 28, 26 + 3 * 18 + 14);
}


function LayerBox({ side, x, y, w, h, lines }: { side: Side; x: number; y: number; w: number; h: number; lines: [string, string] }) {
  const s = SIDE_STYLE[side];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill={s.fill} stroke={s.stroke} strokeWidth={1.2} />
      <text x={x + 10} y={y + 18} fontFamily={FONT} fontSize={12} fontWeight={600} fill={INK}>
        {lines[0]}
      </text>
      <text x={x + 10} y={y + 34} fontFamily={FONT} fontSize={11} fill={MUTED}>
        {lines[1]}
      </text>
    </g>
  );
}

function RankPanel({ side, x, y, w, h }: { side: Side; x: number; y: number; w: number; h: number }) {
  const s = SIDE_STYLE[side];
  const gridX = x + 12;
  const gridY = y + 14;
  const textX = gridX + GRID_W + 16;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill="#ffffff" stroke={s.stroke} strokeWidth={1.2} />
      <RankGrid side={side} x={gridX} y={gridY} />
      {RANK_TEXT[side].map((line, i) => (
        <text
          key={line}
          x={textX}
          y={y + 26 + i * 18}
          fontFamily={FONT}
          fontSize={i === 2 ? 12 : 11}
          fontWeight={i === 2 ? 600 : 400}
          fill={i === 3 ? GREEN : INK}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function TrainiumStackDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, 700);

  if (narrow) {
    const W = 400;
    const labelW = 96;
    const boxX = 12 + labelW;
    const boxW = W - boxX - 12;
    const rowH = 44;
    const rowGap = 6;
    const headH = 40;
    const rankHeadH = 20;
    const blockH = (side: Side) => headH + LAYERS.length * (rowH + rowGap) + rankHeadH + panelHeight(side);
    const blockGap = 22;
    const order: Side[] = ['neuron', 'gpu'];
    const blockY = (bi: number) => 12 + order.slice(0, bi).reduce((sum, sd) => sum + blockH(sd) + blockGap, 0);
    const H = blockY(order.length) - blockGap + 12;
    return (
      <div ref={ref}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby="trainium-stack-title"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <title id="trainium-stack-title">{STACK_TITLE}</title>
          <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
          {order.map((side, bi) => {
            const y0 = blockY(bi);
            const rankY = y0 + headH + LAYERS.length * (rowH + rowGap);
            return (
              <g key={side}>
                <text x={12} y={y0 + 16} fontFamily={FONT} fontSize={14} fontWeight={600} fill={INK}>
                  {COLUMN_TITLE[side][0]}
                </text>
                <text x={12} y={y0 + 32} fontFamily={FONT} fontSize={11} fill={MUTED}>
                  {COLUMN_TITLE[side][1]}
                </text>
                {LAYERS.map((layer, li) => {
                  const y = y0 + headH + li * (rowH + rowGap);
                  return (
                    <g key={layer.label[0]}>
                      <text x={12} y={y + (layer.label[1] ? 18 : 26)} fontFamily={FONT} fontSize={11} fontWeight={600} fill={MUTED}>
                        {layer.label[0]}
                      </text>
                      {layer.label[1] && (
                        <text x={12} y={y + 32} fontFamily={FONT} fontSize={11} fontWeight={600} fill={MUTED}>
                          {layer.label[1]}
                        </text>
                      )}
                      <LayerBox side={side} x={boxX} y={y} w={boxW} h={rowH} lines={layer[side]} />
                    </g>
                  );
                })}
                <text x={12} y={rankY + 13} fontFamily={FONT} fontSize={11} fontWeight={600} fill={MUTED}>
                  Rank unit
                </text>
                <RankPanel side={side} x={12} y={rankY + rankHeadH} w={W - 24} h={panelHeight(side)} />
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  const W = 900;
  const labelX = 16;
  const colW = 356;
  const colX: Record<Side, number> = { gpu: 152, neuron: 528 };
  const rowTop = 62;
  const rowH = 44;
  const rowGap = 8;
  const rankY = rowTop + LAYERS.length * (rowH + rowGap) + 6;
  const panelH = Math.max(panelHeight('gpu'), panelHeight('neuron'));
  const H = rankY + panelH + 14;
  const sides: Side[] = ['gpu', 'neuron'];

  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="trainium-stack-title"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <title id="trainium-stack-title">{STACK_TITLE}</title>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
        {sides.map((side) => (
          <g key={side}>
            <text x={colX[side]} y={26} fontFamily={FONT} fontSize={14} fontWeight={600} fill={INK}>
              {COLUMN_TITLE[side][0]}
            </text>
            <text x={colX[side]} y={44} fontFamily={FONT} fontSize={11} fill={MUTED}>
              {COLUMN_TITLE[side][1]}
            </text>
          </g>
        ))}
        {LAYERS.map((layer, li) => {
          const y = rowTop + li * (rowH + rowGap);
          return (
            <g key={layer.label[0]}>
              <text x={labelX} y={y + (layer.label[1] ? 19 : 27)} fontFamily={FONT} fontSize={12} fontWeight={600} fill={MUTED}>
                {layer.label[0]}
              </text>
              {layer.label[1] && (
                <text x={labelX} y={y + 35} fontFamily={FONT} fontSize={12} fontWeight={600} fill={MUTED}>
                  {layer.label[1]}
                </text>
              )}
              {sides.map((side) => (
                <LayerBox key={side} side={side} x={colX[side]} y={y} w={colW} h={rowH} lines={layer[side]} />
              ))}
            </g>
          );
        })}
        <text x={labelX} y={rankY + 27} fontFamily={FONT} fontSize={12} fontWeight={600} fill={MUTED}>
          Rank unit
        </text>
        {sides.map((side) => (
          <RankPanel key={side} side={side} x={colX[side]} y={rankY} w={colW} h={panelH} />
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* What each AWS path supplies for Trainium                                  */
/* ------------------------------------------------------------------------ */

const tableStyle: CSSProperties = { width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' };
const headCell: CSSProperties = {
  textAlign: 'left',
  verticalAlign: 'bottom',
  padding: '6px 8px',
  borderBottom: '2px solid #d1d5db',
  fontWeight: 600,
};
const cell: CSSProperties = {
  textAlign: 'left',
  verticalAlign: 'top',
  padding: '6px 8px',
  borderBottom: '1px solid #e9ebed',
  overflowWrap: 'anywhere',
};

interface PathRow {
  path: string;
  supplies: ReactNode;
}

const PATH_ROWS: PathRow[] = [
  {
    path: 'EC2 with your own cluster',
    supplies: (
      <>
        Capacity Blocks in Ohio and Hyderabad{' '}
        <Cite tier={1} href={SOURCES.capacityBlocks.url}>
          EC2 Capacity Blocks pricing
        </Cite>
        ; the Neuron 2.33.0 DLAMI, with TorchTitan included{' '}
        <Cite tier={1} href={DLAMI_TTN}>
          Neuron DLAMI release notes L28
        </Cite>
        .
      </>
    ),
  },
  {
    path: 'AWS PCS',
    supplies: (
      <>
        Trn instances bill at the advanced node-management tier{' '}
        <Cite tier={1} href={PCS_PRICING}>
          AWS PCS pricing
        </Cite>
        ; a Trainium node group runs an AMI you build, our reading (section 24, The Slurm Family).
      </>
    ),
  },
  {
    path: 'Amazon EKS',
    supplies: (
      <>
        The Neuron DRA (dynamic resource allocation) driver, recommended from Kubernetes 1.34 and absent from EKS Auto
        Mode, or the Neuron device plugin, which needs the Neuron scheduler extension for contiguous devices on a
        trn2.48xlarge{' '}
        <Cite tier={1} href={EKS_NEURON}>
          EKS User Guide, Neuron devices
        </Cite>{' '}
        (section 25).
      </>
    ),
  },
  {
    path: 'HyperPod with Slurm',
    supplies: (
      <>
        Checks that read Neuron sysfs counters and test EFA{' '}
        <Cite tier={1} href={HP_AUTO_RESUME}>
          HyperPod Slurm auto-resume checks
        </Cite>
        ; its deep health checks list GPU instances only{' '}
        <Cite tier={1} href={HP_SLURM_DEEP}>
          HyperPod Slurm deep health checks
        </Cite>
        ; its Trainium tutorial launches a recipe script no longer shipped{' '}
        <Cite tier={1} href={HP_TRN_SLURM_TUTORIAL} kind="doc-code-conflict">
          HyperPod Trainium Slurm tutorial
        </Cite>
        .
      </>
    ),
  },
  {
    path: 'HyperPod with EKS',
    supplies: (
      <>
        Deep health checks for Trainium: Neuron sysfs, a Neuron hardware check that &quot;Runs a training workload and
        verifies the results&quot;, and collective-communication tests on one Trainium node and across nodes{' '}
        <Cite tier={1} href={HP_EKS_DEEP}>
          HyperPod EKS deep health checks
        </Cite>
        .
      </>
    ),
  },
  {
    path: 'Training jobs and training plans',

    supplies: (
      <>
        ml.trn2.48xlarge in Ohio{' '}
        <Cite tier={1} href={SOURCES.sagemakerUse2.url} accessed={REGISTER_DATE}>
          AWS Price List, AmazonSageMaker us-east-2, version 20261029165009
        </Cite>
        ; training plans cover &quot;AWS Trainium chips&quot;{' '}
        <Cite tier={1} href={SM_PLANS}>
          SageMaker training plans
        </Cite>
        ; the Trainium training-job tutorial sets a recipe path removed at v2.0.0{' '}
        <Cite tier={1} href={SM_TRN_JOBS_TUTORIAL} kind="doc-code-conflict">
          SageMaker Trainium training-job tutorial
        </Cite>
        .
      </>
    ),
  },
];

function PathTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <colgroup>
          <col style={{ width: '30%' }} />
          <col style={{ width: '70%' }} />
        </colgroup>
        <thead>
          <tr>
            <th style={headCell}>Path</th>
            <th style={headCell}>What AWS supplies for Trainium</th>
          </tr>
        </thead>
        <tbody>
          {PATH_ROWS.map((r) => (
            <tr key={r.path}>
              <td style={{ ...cell, fontWeight: 600 }}>{r.path}</td>
              <td style={cell}>{r.supplies}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Commands, verbatim from the Neuron 2.33.0 tutorial                         */
/* ------------------------------------------------------------------------ */

const ONE_NODE = `NGPU=64 \\
MODULE=torchtitan_neuron.models.qwen3 \\
CONFIG=qwen3_8b_tp4_fsdp16_sac \\
./run_train.sh`;

const TWO_NODES = `mpirun --allow-run-as-root -np 2 --hostfile <hostfile> \\
  -x PATH=<venv-path>/bin:$PATH -x CCOM_SOCKET_IFNAME=eth0 \\
  -x NEURON_LOGICAL_NC_CONFIG=2 -x NEURON_RT_NUM_CORES=64 \\
  bash -c 'cd /path/to/torchtitan-neuron && \\
  NGPU=64 NNODES=2 RDZV_ENDPOINT=<node-0 address>:29500 \\
  MODULE=torchtitan_neuron.models.qwen3 CONFIG=qwen3_8b_tp4_fsdp16_sac \\
  ./run_train.sh'`;

const SAMPLE_LINE =
  'step:  3  loss: 11.04064  grad_norm:  5.3200  memory:  9.38GiB(26.07%)  tps: 587  tflops: 30.92  mfu: 19.57%';
const SETUP_SAMPLE_LINE =
  'step: 10  loss:  6.95994  grad_norm: 28.3022  memory:  9.14GiB(38.10%)  tps: 496  tflops: 26.13  mfu: 16.54%';

const PRE: CSSProperties = { margin: 0, whiteSpace: 'pre', overflowX: 'auto' };

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function Trainium() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={`Start a Trainium training run on the stack AWS supports today, TorchTitan Neuron on TorchNeuron in BF16, with ranks counted the Neuron way: ${TRN2_RANKS} per trn2.48xlarge (Neuron SDK 2.33.0 documentation and TorchTitan Neuron release-2.33.0, read 2026-10-31)`}
          >
            27. Trainium: The Neuron Path
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Trainium is AWS&apos;s family of training accelerators, and Neuron is the software stack that compiles and
            runs a model on it. The training step of sections 3 to 14 is the same on Trainium, split by the same
            parallel dimensions. What changes is the software, the unit a rank stands for, the precision, and what
            each AWS path supplies. The chip and its compiler belong to the{' '}
            <Link href="../silicon-memory-inference/">
              Silicon, Memory and Modern Inference dive, section 19: AWS Trainium, Inferentia and Neuron
            </Link>{' '}
            and its{' '}
            <Link href="../silicon-memory-inference/">section 20: AWS Compilers and Kernel Tooling</Link>.
          </Box>
          <Box variant="p">
            The challenge is finding the current stack: AWS moved Trainium training to a new software path between
            December 2025 and October 2026, and two of its Trainium tutorials still call recipe paths that no longer
            exist. The section ends on a sequence that starts from what AWS has validated.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Install the stack AWS recommends today, and recognise material written for the one it ended: NxD Training reached end-of-support as of Neuron 2.32"
          >
            The training stack: TorchTitan Neuron on TorchNeuron
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            NxD Training (NeuronX Distributed Training), the library most Trainium training material is written for,
            and &quot;the XLA-based torch-neuronx training flow&quot; (XLA, Accelerated Linear Algebra, the compiler
            behind PyTorch/XLA) &quot;have reached end-of-support as of Neuron 2.32&quot;{' '}
            <Cite tier={1} href={NXDT_ARCHIVE}>
              Neuron 2.33 NxD Training archive L21-L27
            </Cite>
            . AWS recommends &quot;native PyTorch with standard distributed primitives (DTensor, FSDP, DDP) and
            TorchTitan&quot; in their place: PyTorch&apos;s distributed tensor, Fully Sharded Data Parallel and
            Distributed Data Parallel{' '}
            <Cite tier={1} href={ANN_MAY}>
              Neuron maintenance-mode announcement, 20 May 2026
            </Cite>
            . The announced end moved twice on the way, from no support at Neuron 2.29 to maintenance mode from 2.30
            and then to 2.32 (the notices are in the disclosure below). Read any recipe, tutorial or post that imports{' '}
            <code>neuronx_distributed_training</code> as a description of the ended stack.
          </Box>
          <Box variant="p">
            The replacement has two parts, both beta at Neuron 2.33.0. TorchNeuron is the native PyTorch backend: it
            adds a <code>neuron</code> device through PyTorch&apos;s <code>PrivateUse1</code> extension, and Neuron
            2.33.0 introduces it as a public beta{' '}
            <Cite tier={1} href={TN_BETA}>
              TorchNeuron 2.33.0 release notes L15-L22
            </Cite>{' '}
            on Trainium2 (trn2) and Trainium3 (trn3) instances{' '}
            <Cite tier={1} href={TORCH_BETA}>
              What is TorchNeuron? L12-L16
            </Cite>
            . TorchTitan Neuron 0.2.2+neuron.1 (Beta) is AWS&apos;s fork of TorchTitan, PyTorch&apos;s pre-training
            library, on torch-neuronx 2.14 with PyTorch 2.14.0{' '}
            <Cite tier={1} href={TTN_RN}>
              TorchTitan Neuron 2.33.0 release notes L11-L36
            </Cite>{' '}
            <Cite tier={1} href={TTN_MATRIX}>
              What is TorchTitan Neuron? L37-L60
            </Cite>
            . TorchTitan builds every parallel dimension from <code>DeviceMesh</code>, DTensor,{' '}
            <code>fully_shard</code> and <code>torch.distributed</code> collectives, and TorchNeuron registers the{' '}
            <code>neuron</code> device and a <code>neuron</code> process-group backend that implement them{' '}
            <Cite tier={1} href={TTN_STACK}>
              What is TorchTitan Neuron? L19-L26
            </Cite>
            . The Neuron 2.33.0 DLAMI (Deep Learning AMI, an Amazon Machine Image) ships torch-neuronx with TorchTitan{' '}
            <Cite tier={1} href={DLAMI_TTN}>
              Neuron DLAMI release notes L28
            </Cite>
            .
          </Box>
          <Box variant="p">
            Every parallel dimension of sections 8 to 12 has a path on Trainium, with one gap. FSDP2 (PyTorch&apos;s
            second FSDP, <code>fully_shard</code>), TP (tensor parallelism), CP (context parallelism) and EP (expert
            parallelism, for MoE (mixture of experts) models) are &quot;Supported&quot;; PP (pipeline parallelism) is
            &quot;Supported by TorchNeuron&quot; and &quot;Not covered by the TorchTitan tutorials&quot;{' '}
            <Cite tier={1} href={TTN_PARALLEL}>
              What is TorchTitan Neuron? L62-L99
            </Cite>
            . No file in the fork&apos;s Neuron folder at release-2.33.0 is named for pipeline parallelism, our check of
            its tree{' '}
            <Cite tier={1} href={TTN_DIR} kind="code">
              torchtitan-neuron release-2.33.0, torchtitan_neuron/
            </Cite>
            . Build a Trainium layout from FSDP, TP, CP and EP, and test PP yourself.
          </Box>
          <TrainiumStackDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. Layer contents and counts are from the sources cited in this block and the
            next.
          </Box>
          <Box variant="p">
            The stacks part below PyTorch. The GPU path runs TorchTitan v0.4.0, aligned with PyTorch 2.15{' '}
            <Cite tier={1} href={TT_RELEASE} accessed={REGISTER_DATE}>
              TorchTitan v0.4.0 release
            </Cite>
            , on NCCL (NVIDIA Collective Communications Library), which reaches EFA (Elastic Fabric Adapter) through a
            plugin (<Link href="../efa/">EFA dive, section 9: NCCL over EFA: the aws-ofi-nccl Plugin</Link>); the
            Neuron path runs TorchNeuron over the Neuron compiler, runtime and collectives{' '}
            <Cite tier={1} href={TTN_LAYERS}>
              What is TorchTitan Neuron? L102-L162
            </Cite>
            . Both instances carry {int(TRN2_EFA)} Gbps of EFA{' '}
            <Cite tier={1} href={SOURCES.ec2Specs.url}>
              Amazon EC2 instance types, accelerated computing
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="NxD Training's end of support, notice by notice">
            <SpaceBetween size="s">
              <ul>
                <li>
                  16 December 2025: &quot;Neuron support for PyTorch 2.9 will be the last to include&quot; NxD Training,
                  with no support &quot;Starting with Neuron support for PyTorch 2.10&quot;{' '}
                  <Cite tier={1} href={ANN_DEC}>
                    Neuron end-of-support announcement, 16 December 2025
                  </Cite>
                  .
                </li>
                <li>
                  26 February 2026: Neuron 2.28 (PyTorch 2.9) &quot;will be the last release to include&quot; it, with
                  no support from Neuron 2.29, and existing users &quot;should stay on Neuron SDK 2.28 (PyTorch 2.9)
                  until ready to migrate&quot;{' '}
                  <Cite tier={1} href={ANN_FEB}>
                    Neuron end-of-support announcement, 26 February 2026
                  </Cite>
                  .
                </li>
                <li>
                  20 May 2026: maintenance mode &quot;Starting with Neuron Release 2.30.0&quot;, critical security
                  fixes only, &quot;and we will gradually end support&quot;; native PyTorch with TorchTitan is
                  recommended from Neuron 2.31 and PyTorch 2.12{' '}
                  <Cite tier={1} href={ANN_MAY}>
                    Neuron maintenance-mode announcement, 20 May 2026
                  </Cite>
                  .
                </li>
                <li>
                  Neuron 2.31.0: NxD Training is no longer included in the Neuron DLAMIs{' '}
                  <Cite tier={1} href={DLAMI_NXDT}>
                    Neuron DLAMI release notes L74
                  </Cite>
                  .
                </li>
                <li>
                  The archive: end-of-support as of Neuron 2.32{' '}
                  <Cite tier={1} href={NXDT_ARCHIVE}>
                    Neuron 2.33 NxD Training archive L21-L27
                  </Cite>
                  .
                </li>
              </ul>
              <Box variant="p">
                The December and February notices name one end in two units, PyTorch 2.10 and Neuron 2.29; the end then
                became gradual from 2.30 and was set at 2.32, our reading of the five pages.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Set NGPU=64 on a trn2.48xlarge: a rank is one logical NeuronCore, ${RANKS_PER_CHIP} to a chip, so TP ${RANKS_PER_CHIP} fills one chip and section 14's procedure carries over with ${TRN2_RANKS} ranks of ${TRN2_RANK_GIB} GiB`}
          >
            Counting ranks the Neuron way: {TRN2_RANKS} per trn2.48xlarge
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On Trainium a rank, one training process, owns one logical NeuronCore. LNC (logical NeuronCore
            configuration) sets how many physical cores form one: a Trainium2 chip has eight physical NeuronCore-v3,
            and at the default LNC=2 they form four logical cores{' '}
            <Cite tier={1} href={LNC}>
              Neuron 2.33 Logical NeuronCore configuration L12-L14
            </Cite>
            . &quot;On a trn2.48xlarge with the default LNC=2, that is 64 ranks per node: 16 Trainium2 devices with 4
            logical cores each&quot;{' '}
            <Cite tier={1} href={TTN_RANKS}>
              What is TorchTitan Neuron? L203-L209
            </Cite>
            . The process count &quot;maps to NeuronCores&quot;, so the tutorial starts a node with{' '}
            <code>NGPU=64</code> where a p5.48xlarge takes {P5_GPUS}{' '}
            <Cite tier={1} href={TUT_NGPU}>
              Neuron 2.33 TorchTitan tutorial L166-L178
            </Cite>
            .
          </Box>
          <Box variant="p">
            Each logical core&apos;s two physical cores share one of the chip&apos;s four HBM (high-bandwidth memory)
            banks{' '}
            <Cite tier={1} href={LNC_HBM}>
              Neuron 2.33 Logical NeuronCore configuration L51-L66
            </Cite>
            , so a rank holds {TRN2_RANK_GIB} GiB of the chip&apos;s {TRN2_HBM_GIB} GiB{' '}
            <Cite tier={1} href={TRN2_CHIP} kind="vendor-claim">
              Neuron 2.33 Trainium2 architecture L19-L32
            </Cite>{' '}
            (our arithmetic: {TRN2_HBM_GIB} / {RANKS_PER_CHIP}), the capacity Calculators B and C take for trn2 in
            sections 5 and 14. LNC=1, the only other setting, exposes all eight physical cores{' '}
            <Cite tier={1} href={LNC}>
              L12-L14
            </Cite>
            ; changing it changes the ranks per node and &quot;triggers a recompile&quot;{' '}
            <Cite tier={1} href={TTN_MAPPING}>
              What is TorchTitan Neuron? L234-L257
            </Cite>
            . The counts are for Trn2; recalculate them for Trn3{' '}
            <Cite tier={1} href={TRN3_NOTE}>
              Neuron 2.33 Trn3 sizing note
            </Cite>
            .
          </Box>
          <Box variant="p">
            Placement adds one level to section 7&apos;s bandwidth hierarchy: ranks on one chip communicate fastest,
            then ranks on one instance, then across instances. AWS recommends keeping each TP group on one chip, &quot;TP=4

            matches the 4 logical NeuronCores of a Trainium2 device at LNC=2&quot;, while FSDP &quot;can span devices
            and nodes&quot;{' '}
            <Cite tier={1} href={TTN_MAPPING}>
              What is TorchTitan Neuron? L234-L257
            </Cite>
            . That is section 14&apos;s procedure with two substitutions: {TRN2_RANKS} ranks of {TRN2_RANK_GIB} GiB per
            instance, and {RANKS_PER_CHIP} as the TP size that stays on one chip.
          </Box>
          <Box variant="p">The validated layouts are the place to start:</Box>
          <ul>
            <li>
              Llama3-8B at TP 4 x FSDP 16 on one trn2.48xlarge, in eager mode, with <code>torch.compile</code>, and
              with SimpleFSDP plus <code>torch.compile</code>; Qwen3-32B (dense) at TP 4 x FSDP 16, {TRN2_RANKS} ranks
              and so one trn2.48xlarge (our arithmetic), with full activation checkpointing, the recomputation of
              section 5{' '}
              <Cite tier={1} href={TTN_VALIDATED}>
                What is TorchTitan Neuron? L165-L200
              </Cite>
              .
            </li>
            <li>
              Qwen3-8B at TP 4 x FSDP 16 on one trn2.48xlarge and TP 4 x FSDP 32 on two ({2 * TRN2_RANKS} ranks), in
              eager mode with selective activation checkpointing, the training tutorial&apos;s layouts{' '}
              <Cite tier={1} href={TUT_LIMITS}>
                Neuron 2.33 TorchTitan tutorial L59-L65
              </Cite>
              .
            </li>
            <li>
              DeepSeek-V3 and GPT-OSS mixture-of-experts pre-training, listed as validated without a layout
              (SimpleFSDP with <code>torch.compile</code> for DeepSeek-V3). Other TorchTitan models &quot;are expected
              to run, but they don&apos;t have a validated TorchNeuron configuration yet&quot;{' '}
              <Cite tier={1} href={TTN_VALIDATED}>
                L165-L200
              </Cite>
              .
            </li>
          </ul>
          <Box variant="p">
            The memory arithmetic carries over. At TP 4 x FSDP 16, Llama 3.1 8B&apos;s model state at 16 bytes per
            parameter (BF16 (bfloat16) weights and gradients, FP32 (32-bit floating point) Adam moments and master
            weights, section 5) is {fix(STATE_8B_GB, 1)} GB per rank of {fix(RANK_GB, 1)} GB, and Calculator C puts
            the whole layout at {fix(TOTAL_8B_GB, 1)} GB at {SEQ.toLocaleString('en-US')} tokens, micro-batch 1 and
            no recomputation, inputs AWS does not state (our assumption; estimate; confirm with a measured step). The
            TP 4 comes from the placement rule, since memory alone would allow less: TorchTitan&apos;s own H100 runs
            train the 8B model at FSDP 8 with no TP{' '}
            <Cite tier={1} href={TT_H100_BENCH} accessed={REGISTER_DATE}>
              TorchTitan v0.4.0 Llama 3 H100 benchmarks
            </Cite>
            , our reading.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Plan a trn2 run in BF16 at Neuron 2.33.0, and buy it as a Capacity Block in Ohio: ${rate(TRN2_CB)} per instance-hour, the second-cheapest block per peak BF16 PFLOP-hour of the rows priced`}
          >
            BF16 on Trainium2, and where to buy a trn2.48xlarge
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On TorchNeuron 2.33.0, Trainium2 trains in BF16: &quot;bfloat16 is the training baseline&quot;, and
            &quot;FP8 and MXFP8 require Trainium 3&quot;{' '}
            <Cite tier={1} href={TORCH_DTYPES}>
              What is TorchNeuron? L115-L118
            </Cite>
            , FP8 being 8-bit floating point and MXFP8 its microscaled form. The limit is the software release&apos;s:
            the Trainium2 chip lists {int(TRN2_FP8)} FP8 TFLOPS (trillion floating-point operations per second) against{' '}
            {int(TRN2_BF16)} for BF16{' '}

            <Cite tier={1} href={TRN2_CHIP} kind="vendor-claim">
              Neuron 2.33 Trainium2 architecture L19-L32
            </Cite>
            , and TorchNeuron 2.33.0 ships without &quot;TorchAO integration or composite MXFP8 data type
            support&quot;{' '}
            <Cite tier={1} href={TN_MX}>
              TorchNeuron 2.33.0 release notes L186-L187
            </Cite>
            . Section 6, Precision for Training: BF16, FP8 &amp; Microscaled Formats, covers MXFP8 on Trainium3.
          </Box>
          <Box variant="p">
            A trn2.48xlarge carries {TRN2_CHIPS} Trainium2 chips at {TRN2_HBM_GIB} GiB each, joined by NeuronLink-v3 in
            a 4x4 2D torus, and four trn2u.48xlarge form a Trn2 UltraServer of 64 chips{' '}
            <Cite tier={1} href={TRN2_ARCH}>
              Neuron 2.33 Trn2 architecture L27-L54
            </Cite>
            . Its {int(TRN2_EFA)} Gbps of EFA is {int(TRN2_EFA_PER_CHIP)} Gbps per chip (our arithmetic){' '}
            <Cite tier={1} href={TRN2_SPECS}>
              L55-L105
            </Cite>
            . FSx for Lustre accepts EFA clients &quot;excluding the trn2 instance family&quot;{' '}
            <Cite tier={1} href={FSX_EFA}>
              FSx for Lustre user guide, EFA-enabled file systems
            </Cite>
            , so a trn2 cluster reads its file system on the path without EFA that section 23, Storage for Training,
            sizes.
          </Box>
          <Box variant="p">
            EC2 (Amazon Elastic Compute Cloud) has no On-Demand rate for trn2.48xlarge in any US Region; the only one
            in the Price List is Hyderabad&apos;s {rate(TRN2_OD_HYD)}{' '}
            <Cite tier={1} href={SOURCES.ec2PriceAllRegions.url}>
              AWS Price List, AmazonEC2 all Regions, version 20261029175634
            </Cite>
            . It sells through Capacity Blocks, fixed-window reservations, at {rate(TRN2_CB)} per instance-hour in US
            East (Ohio) and Hyderabad, read 2026-10-31; a block is charged at the rate quoted at purchase{' '}
            <Cite tier={1} href={SOURCES.capacityBlocks.url}>
              EC2 Capacity Blocks pricing
            </Cite>
            . SageMaker sells ml.trn2.48xlarge in Ohio at {rate(TRN2_JOB)} per instance-hour for training jobs and{' '}
            {rate(TRN2_PLAN)} as a training plan&apos;s up-front hourly fee, read 2026-10-30{' '}
            <Cite tier={1} href={SOURCES.sagemakerUse2.url} accessed={REGISTER_DATE}>
              AWS Price List, AmazonSageMaker us-east-2, version 20261029165009
            </Cite>
            . Section 22, Capacity &amp; Cost, prices a whole run.
          </Box>
          <Box variant="p">
            Per peak BF16 PFLOP-hour, a quadrillion floating-point operations every second for an hour, the Ohio block
            costs {usd(TRN2_PER_PFLOP)}:{' '}
            <code>
              {rate(TRN2_CB)} / ({TRN2_CHIPS} x {fix(TRN2_BF16 / 1_000, 3)})
            </code>
            , our arithmetic on the vendor peak: the second-cheapest Capacity Block row, after Trn1&apos;s{' '}
            {usd(TRN1_PER_PFLOP)} ({rate(TRN1_CB)} for 16 chips at {int(TRN1_BF16)} TFLOPS{' '}
            <Cite tier={1} href={SOURCES.trainium.url} kind="vendor-claim" accessed={REGISTER_DATE}>
              Neuron 2.33 Trainium architecture
            </Cite>
            ) and against {usd(P5_PER_PFLOP)} for a p5.48xlarge block ({rate(P5_CB)} for {P5_GPUS} H100 at{' '}
            {fix(P5_BF16, 1)} TFLOPS{' '}
            <Cite tier={1} href={SOURCES.h100.url} kind="vendor-claim" accessed={REGISTER_DATE}>
              NVIDIA H100 specification (dense is half the listed sparse figure)

            </Cite>
            ), both in N. Virginia. Peak is what the block rents; MFU (model FLOPs utilization, the share of peak a
            run achieves) decides what a useful FLOP costs.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick the path for its capacity, devices and health checks, and plan to bring the Neuron training stack yourself on every one: no managed path read ships a current Trainium training recipe"
          >
            What each AWS path gives a Trainium run
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On Trainium the AWS path decides who builds the software around the training stack: the image, the device
            exposure and the health checks. The training stack itself is the team&apos;s on every path read, our
            reading of the sources in the table. PCS is AWS Parallel Computing Service; EKS is Amazon Elastic
            Kubernetes Service.
          </Box>
          <PathTable />
          <Box variant="p">
            None of the managed paths read ships a current Trainium training recipe. The HyperPod recipes repository
            has no Trainium path at release {HYPERPOD_RECIPES_TAG}{' '}
            <Cite tier={1} href={RECIPES_CURRENT} kind="code">
              sagemaker-hyperpod-recipes {HYPERPOD_RECIPES_TAG}
            </Cite>{' '}
            or at v2.0.0{' '}
            <Cite tier={1} href={RECIPES_V2} kind="code">
              v2.0.0
            </Cite>
            , while v1.5.1 still carries the script and the recipe the two tutorials name{' '}
            <Cite tier={1} href={RECIPES_V1} kind="code">
              v1.5.1
            </Cite>
            , our check of the three trees. Section 20, Who Owns What on AWS, holds the full matrix, and sections 24
            to 26 set up each family.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Judge your first steps against the two sample lines AWS prints, 496 tokens per second per rank at 16.54% MFU in a 10-step install check on a trn2.48xlarge, knowing the MFU divides by ${TTN_PEAK_PER_RANK} TFLOPS per rank`}
          >
            The two published sample steps, and how to read their MFU
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AWS publishes no Trainium2 throughput or MFU benchmark for TorchTitan Neuron in the Neuron 2.33 docs or the
            fork.
          </Box>
          <ExpandableSection headerText="Where the fork was searched for a benchmark">
            <Box variant="p">
              The fork&apos;s benchmarks folder holds only upstream GPU reports{' '}
              <Cite tier={1} href={TTN_BENCH} kind="code">
                torchtitan-neuron release-2.33.0, benchmarks/
              </Cite>
              , none of its CI (continuous integration) workflows names a Neuron device{' '}
              <Cite tier={1} href={TTN_CI} kind="code">
                .github/workflows
              </Cite>
              , and its tests README says to &quot;Keep hardware-specific tests device-guarded and prefer
              CPU-runnable config and registry tests when validating extension contracts&quot;{' '}
              <Cite tier={1} href={TTN_TESTS}>
                torchtitan_neuron/tests/README.md L3-L5
              </Cite>
              .
            </Box>
          </ExpandableSection>
          <Box variant="p">
            The docs print two sample lines instead, for the same Qwen3-8B config. The setup guide runs it for 10
            steps on &quot;all 64 NeuronCores on a <code>trn2.48xlarge</code>&quot; at TP 4 x FSDP 16, with a bundled test
            tokenizer and the small <code>c4_test</code> split, and prints this as a healthy step line, &quot;values
            will vary&quot;{' '}
            <Cite tier={1} href={SETUP_LINE}>
              Neuron 2.33 TorchTitan setup L49-L84
            </Cite>
            :
          </Box>
          <pre style={PRE}>
            <code>{SETUP_SAMPLE_LINE}</code>
          </pre>
          <Box variant="p">
            Its memory field implies 24 GiB per rank (our arithmetic: 9.14 / 0.381), which matches Trainium2&apos;s{' '}
            {TRN2_RANK_GIB} GiB. The tutorial shows a second line as what &quot;A healthy step looks like&quot;{' '}
            <Cite tier={1} href={TUT_HEALTHY}>
              Neuron 2.33 TorchTitan tutorial L145-L158
            </Cite>
            :
          </Box>
          <pre style={PRE}>
            <code>{SAMPLE_LINE}</code>
          </pre>
          <Box variant="p">
            It is step 3 of an eager run. The tutorial&apos;s launch command is labelled for a trn2.48xlarge{' '}
            <Cite tier={1} href={TUT_LAUNCH}>
              Neuron 2.33 TorchTitan tutorial L45-L117
            </Cite>
            , yet the line&apos;s memory field implies 36 GiB per rank (our
            arithmetic: 9.38 / 0.2607), which matches a Trainium3 chip&apos;s 144 GiB over four logical cores (eight
            NeuronCore-v4 at LNC=2), {fix(TRN3_RANK_GIB, 0)} GiB{' '}
            <Cite tier={1} href={TRN3_CHIP} kind="vendor-claim">
              Neuron 2.33 Trainium3 architecture L27-L35
            </Cite>
            , against Trainium2&apos;s {TRN2_RANK_GIB} GiB; that the line came from Trainium3 is our reading, not
            verified. The MFU field divides by TorchTitan Neuron&apos;s hard-coded peak, 79 BF16 TFLOPS per NeuronCore times
            2 for LNC=2, {TTN_PEAK_PER_RANK} per rank{' '}
            <Cite tier={1} href={TTN_PEAK} kind="code">
              torchtitan-neuron release-2.33.0 tools/utils.py L194-L206
            </Cite>
            , which both lines confirm: 26.13 / 0.1654 and 30.92 / 0.1957 each give 158 (our arithmetic).
          </Box>
          <Box variant="p">
            That is {int(TTN_PEAK_PER_CHIP)} TFLOPS per Trainium2 chip, the NeuronCore-v3 page&apos;s 79 per core{' '}
            <Cite tier={1} href={NC3} kind="vendor-claim">
              Neuron 2.33 NeuronCore-v3 architecture
            </Cite>{' '}
            over eight cores, below the {int(TRN2_BF16)} the chip page lists, so a TorchTitan Neuron MFU reads about
            5.5% higher than one against {int(TRN2_BF16)} (our arithmetic, as in section 4, Counting the Arithmetic).
            Convert before comparing:{' '}
            <code>
              MFU against {int(TRN2_BF16)} = printed MFU x {int(TTN_PEAK_PER_CHIP)} / {int(TRN2_BF16)}
            </code>
            . The function returns {TTN_PEAK_PER_RANK} for every Trn2 and Trn3 device whatever LNC the run sets, so at
            LNC=1 the printed MFU would be half the true share, our reading of the code.
          </Box>
          <Box variant="p">
            Until a measured step exists, the 40% MFU that the dive&apos;s calculators assume on Trainium2 stays an
            assumption. The two sample lines are illustrations whose values the docs say will vary:
            the setup line&apos;s 16.54% at step 10 on a test split is about 15.7% against {int(TRN2_BF16)} (our
            arithmetic), and no first-party MFU benchmark for dense Llama-class training on Trainium2 was located in
            this research. Experiment A5 would measure one.
          </Box>
          <ExpandableSection headerText="A5 protocol (not yet run)">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>What it would measure.</strong> Tokens per second and MFU against {int(TRN2_BF16)} TFLOPS per
                Trainium2 chip over 200 steps of the Llama3-8B layout TorchTitan Neuron validates on one trn2.48xlarge,
                TP 4 x FSDP 16 across {TRN2_RANKS} ranks{' '}
                <Cite tier={1} href={TTN_VALIDATED}>
                  What is TorchTitan Neuron? L165-L200
                </Cite>{' '}
                (
                <Link external href={GUIDE_URL}>
                  research guide, section 5
                </Link>
                ). The trainer prints MFU against {int(TTN_PEAK_PER_CHIP)} per chip, so the run would convert it with
                the formula above.
              </Box>
              <Box variant="p">
                <strong>On what.</strong> A SageMaker training job on one ml.trn2.48xlarge in us-east-2.
              </Box>
              <Box variant="p">
                <strong>Prediction, our reading and not a result.</strong> The research guide states none; the run
                would replace the 40% that the calculators&apos; Trainium2 rows assume.
              </Box>
              <Box variant="p">
                <strong>Cost.</strong> About three hours at {rate(TRN2_JOB)} per instance-hour, the training-job rate in
                US East (Ohio) on 2026-10-30, so about {usd(3 * TRN2_JOB, 0)}{' '}
                <Cite tier={1} href={SOURCES.sagemakerUse2.url} accessed={REGISTER_DATE}>
                  AWS Price List, AmazonSageMaker us-east-2, version 20261029165009
                </Cite>
                . Teardown: the job ends itself; the warm-pool keep-alive stays at 0 so no instance is kept, because a
                warm pool is billed while it waits{' '}
                <Cite tier={1} href={WARM_POOLS} accessed={REGISTER_DATE}>
                  SageMaker managed warm pools
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Leave with the order of operations: pin Neuron 2.33.0, run the validated ${TRN2_RANKS}-rank layout on one trn2.48xlarge, scale to ${2 * TRN2_RANKS} ranks on two, and treat anything larger as a step you measure`}
          >
            Start the run: one node, two nodes, then a measured step
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol>
            <li>
              <Box variant="p">
                <strong>Get capacity.</strong> A Capacity Block for trn2.48xlarge in Ohio, or SageMaker in Ohio, as
                priced above.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <strong>Pin the stack.</strong> Neuron SDK 2.33.0, torch-neuronx 2.14.3.0 with PyTorch 2.14.0, and the
                TorchTitan Neuron fork at tag <code>{TORCHTITAN_NEURON_TAG}</code>{' '}
                <Cite tier={1} href={TTN_MATRIX}>
                  What is TorchTitan Neuron? L37-L60
                </Cite>
                . The fork tracks an upstream TorchTitan commit older than v0.4.0, so check an upstream feature
                against the fork before relying on it (section 15, The Framework Map).
              </Box>
            </li>
            <li>
              <Box variant="p">
                <strong>Run one node, {TRN2_RANKS} ranks.</strong> The tutorial&apos;s Qwen3-8B config sets TP 4 x FSDP
                16, the batch size and the sequence length{' '}
                <Cite tier={1} href={TUT_LAUNCH}>
                  Neuron 2.33 TorchTitan tutorial L45-L117
                </Cite>
                :
              </Box>
              <pre style={PRE}>
                <code>{ONE_NODE}</code>
              </pre>
              <Box variant="p">
                Expect the first step to take several minutes while the Neuron compiler builds every graph; later steps,
                and later runs with the same configuration, reuse the cache. Keep the sequence length and local batch
                size fixed for a run: <code>torch.compile</code> on Neuron requires static shapes, and each new input
                shape triggers a new compilation{' '}
                <Cite tier={1} href={TTN_LIMITS}>
                  What is TorchTitan Neuron? L262-L274
                </Cite>
                . A healthy run steps with finite loss that trends downward over the first several steps{' '}
                <Cite tier={1} href={TUT_HEALTHY}>
                  Neuron 2.33 TorchTitan tutorial L145-L158
                </Cite>
                .
              </Box>
            </li>
            <li>
              <Box variant="p">
                <strong>Run two nodes, {2 * TRN2_RANKS} ranks.</strong> Confirm first that each node has EFA: the
                tutorial&apos;s <code>fi_info -p efa</code> check must count more than zero endpoints per node. Then
                start <code>run_train.sh</code> once per node with <code>mpirun</code>, the LNC and core count set
                explicitly; FSDP grows to 32 and TP stays at 4{' '}
                <Cite tier={1} href={TUT_MULTI}>
                  Neuron 2.33 TorchTitan tutorial L182-L246
                </Cite>
                :
              </Box>
              <pre style={PRE}>
                <code>{TWO_NODES}</code>
              </pre>
            </li>
            <li>
              <Box variant="p">
                <strong>Plan anything larger as a measured step.</strong> For four nodes the tutorial changes{' '}
                <code>-np</code> and <code>NNODES</code> to 4 and nothing else{' '}
                <Cite tier={1} href={TUT_MULTI}>
                  L182-L246
                </Cite>
                , though AWS validates one and two nodes only. The fork&apos;s docs also carry an unvalidated
                four-node Llama 3.1 70B command at TP 4 x FSDP 64, {RANKS_70B} ranks, with full activation
                checkpointing{' '}
                <Cite tier={1} href={TTN_70B}>
                  torchtitan-neuron release-2.33.0 docs/dense-tutorials.md L121-L143
                </Cite>
                ; {TRN2_RANKS} processes per node fits a trn2.48xlarge, our reading, and its model state is{' '}
                {fix(STATE_70B_PER_RANK_GB, 1)} GB per rank (our arithmetic: {fix(P70 / 1e9, 2)} billion parameters x
                16 bytes / {RANKS_70B}). Run either as the measured step of section 31, Bring-Up: From One Node to the
                Full Run, record tokens per second and MFU as section 29, What to Measure in a Run, sets out, and put
                the converted MFU into Calculator A in section 4 in place of the 40% assumption.

              </Box>
            </li>
          </ol>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
