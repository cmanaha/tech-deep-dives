import { useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import FormField from '@cloudscape-design/components/form-field';
import RadioGroup from '@cloudscape-design/components/radio-group';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import {
  Cite,
  gh,
  ghTree,
  PYTORCH_TAG,
  TORCHTITAN_TAG,
  TORCHTITAN_NEURON_TAG,
  MEGATRON_TAG,
  MEGATRON_BRIDGE_TAG,
  NEMO_TAG,
  NEMO_AUTOMODEL_TAG,
  NEMO_RL_TAG,
  DEEPSPEED_TAG,
  ACCELERATE_TAG,
  TRANSFORMERS_TAG,
  NANOTRON_TAG,
  AXOLOTL_TAG,
  NEURON_SDK_SHA,
  DLC_SHA,
  AWSOME_DISTRIBUTED_TRAINING_SHA,
} from '../components/Cite';
import { useNarrow } from '../components/useNarrow';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Register rows cited without re-opening their source carry the register's read date. */
const REGISTER_DATE = '2026-10-30';

/** PyTorch at the pinned tag. */
function pt(path: string, lines?: string): string {
  return gh('pytorch/pytorch', PYTORCH_TAG, path, lines);
}
const DTENSOR_ALPHA = pt('docs/source/distributed.tensor.md', 'L9');
const DTENSOR_DEF = pt('docs/source/distributed.tensor.md', 'L30-L38');
const PIPELINING_ALPHA = pt('docs/source/distributed.pipelining.md', 'L9');
const TP_EXPERIMENTAL = pt('docs/source/distributed.tensor.parallel.md', 'L12');
const CP_PROTOTYPE = pt('torch/distributed/tensor/experimental/_context_parallel/_attention.py', 'L1573-L1575');
const CP_ALLGATHER_DEFAULT = pt('torch/distributed/tensor/experimental/_context_parallel/_attention.py', 'L77');
const ASYNC_SAVE = pt('torch/distributed/checkpoint/state_dict_saver.py', 'L228-L237');
const DCP_DOC = pt('docs/source/distributed.checkpoint.md', 'L9-L14');
const FULLY_SHARD_DOC = pt('docs/source/distributed.fsdp.fully_shard.md', 'L1-L13');
const PT_SCHEDULES = pt('torch/distributed/pipelining/schedules.py', 'L5228-L5236');
const FULLY_SHARD_BEHAVIOUR = pt('torch/distributed/fsdp/_fully_shard/_fully_shard.py', 'L117-L123');
const FULLY_SHARD_HSDP = pt('torch/distributed/fsdp/_fully_shard/_fully_shard.py', 'L182-L188');
const FULLY_SHARD_RESHARD = pt('torch/distributed/fsdp/_fully_shard/_fully_shard.py', 'L190-L200');

/** TorchTitan at the pinned tag. */
function tt(path: string, lines?: string): string {
  return gh('pytorch/torchtitan', TORCHTITAN_TAG, path, lines);
}
const TT_DEV = tt('README.md', 'L38-L39');
const TT_FEATURES = tt('README.md', 'L130-L134');
const TT_HF = tt('README.md', 'L161');
const TT_PIN = tt('README.md', 'L220-L221');
const TT_TORCHAO = tt('README.md', 'L228-L230');
const TT_RELEASE = 'https://github.com/pytorch/torchtitan/releases/tag/v0.4.0';
const TT_CONFIG = tt('torchtitan/config/README.md', 'L3-L22');
const TT_PP_DEFAULT = tt('torchtitan/config/parallelism.py', 'L114');
const TT_QUANT = tt('torchtitan/quantization/README.md', 'L5-L13');

/** AWS Neuron SDK documentation at the 2.33.0 commit. */
function neuron(path: string, lines?: string): string {
  return gh('aws-neuron/aws-neuron-sdk', NEURON_SDK_SHA, path, lines);
}
const TTN_RELEASE = neuron('release-notes/components/torchtitan-neuron.rst', 'L11-L36');
const TTN_FORK_POINT = neuron('training/torchtitan/about-torchtitan-neuron.rst', 'L50-L56');
const TTN_SUPPORT = neuron('training/torchtitan/about-torchtitan-neuron.rst', 'L62-L95');
const TTN_VALIDATED = neuron('training/torchtitan/about-torchtitan-neuron.rst', 'L176-L186');
const TTN_RANKS = neuron('training/torchtitan/about-torchtitan-neuron.rst', 'L203-L209');
const TORCHNEURON_BETA = neuron('release-notes/components/torchneuron.rst', 'L20-L22');
const NEURON_PRECISION = neuron('torch/about-pytorch-neuron.rst', 'L115-L118');
const NEURON_DLAMI = neuron('release-notes/components/dlamis.rst', 'L28');
const NEURON_DLAMI_NXDT = neuron('release-notes/components/dlamis.rst', 'L74');
const NXDT_EOS = neuron('archive/nxd-training/index.rst', 'L23-L25');
const NEURON_RECOMMENDS = neuron(
  'about-neuron/announcements/neuron2.x/announce-maintenance-nxdt-nxd-core-training.rst',
  'L12',
);
const TTN_FORK = ghTree('aws-neuron/torchtitan-neuron', TORCHTITAN_NEURON_TAG);

/** Megatron-LM and Megatron Core at the pinned tag. */
function mg(path: string, lines?: string): string {
  return gh('NVIDIA/Megatron-LM', MEGATRON_TAG, path, lines);
}
const MG_ABOUT = mg('README.md', 'L16-L22');
const MG_DEV_BRANCH = mg('README.md', 'L59');
const MG_FSDP_MAP = mg('docs/user-guide/features/megatron_fsdp.md', 'L435');
const MG_DIST_OPT_TABLE = mg('docs/user-guide/features/dist_optimizer.md', 'L16-L19');
const MG_USE_DIST_OPT = mg('megatron/training/arguments.py', 'L3102-L3103');
const MG_SHARDING_DEFAULT = mg('megatron/training/arguments.py', 'L3136-L3138');
const MG_FSDP2_ZERO2 = mg('megatron/training/arguments.py', 'L3183-L3185');
const MG_CP_DEFAULT = mg('megatron/training/arguments.py', 'L3186');
const MG_ASYNC_SAVE = mg('megatron/training/arguments.py', 'L1808-L1814');
const MG_DEPRECATED_FLAG = mg('megatron/training/arguments.py', 'L2979-L2981');
const MG_NO_LOAD_OPTIM = mg('megatron/training/checkpointing.py', 'L2864-L2872');
const MG_CKPT_SAVE_FORMAT = mg('megatron/training/checkpointing.py', 'L620-L627');
const MG_CKPT_TP_PP_ERROR = mg('megatron/training/checkpointing.py', 'L2904-L2914');
const MG_CKPT_OTHER_ERROR = mg('megatron/training/checkpointing.py', 'L2894-L2903');
const MG_DP_ONLY = mg('megatron/core/optimizer/distrib_optimizer.py', 'L1596-L1602');
const MG_FULLY_RESHARDABLE = mg('megatron/training/config/training_config.py', 'L659-L660');
const MG_DIST_CKPT_RESHARD = mg('docs/api-guide/core/dist_checkpointing.md', 'L17-L20');
const MG_DIST_CKPT_FORMATS = mg('docs/api-guide/core/dist_checkpointing.md', 'L102-L110');
const MG_DIST_CKPT_WORKFLOW = mg('docs/api-guide/core/dist_checkpointing.md', 'L112-L121');
const MG_LOW_PRECISION = mg('docs/user-guide/features/low_precision_training.md', 'L41-L45');
const MG_FP8_DEFAULT = mg('megatron/core/transformer/transformer_config.py', 'L664-L673');
const MG_COMBINED_1F1B = mg('megatron/core/pipeline_parallel/combined_1f1b.py', 'L55-L58');
const MG_SCHEDULES = mg('megatron/core/pipeline_parallel/schedules.py');
const MG_MOE_DEFAULTS = mg('megatron/core/transformer/moe/README.md', 'L563-L564');
const MG_ARGS = mg('megatron/training/arguments.py');

/** Megatron Bridge, NeMo AutoModel, NeMo RL and NVIDIA/NeMo at their pinned tags. */
function br(path: string, lines?: string): string {
  return gh('NVIDIA-NeMo/Megatron-Bridge', MEGATRON_BRIDGE_TAG, path, lines);
}
const BR_OVERVIEW = br('README.md', 'L68-L72');
const BR_MATRIX = br('README.md', 'L79-L81');
const BR_SUBMODULE = br('README.md', 'L100');
const BR_RECIPE_70B = br('src/megatron/bridge/recipes/llama/h100/llama3.py', 'L717-L739');
const BR_CONFIG = br('docs/nemo2-migration-guide.md', 'L3-L7');
function am(lines: string): string {
  return gh('NVIDIA-NeMo/Automodel', NEMO_AUTOMODEL_TAG, 'README.md', lines);
}
const AM_RECIPES = am('L107');
const AM_PARALLEL = am('L165');
const AM_PRECISION = am('L168-L169');
const AM_CKPT = am('L174');
const AM_LAUNCH = am('L177');
const NEMO_RL_BACKENDS = gh('NVIDIA-NeMo/RL', NEMO_RL_TAG, 'README.md', 'L87-L88');
const NEMO_SPEECH = gh('NVIDIA/NeMo', NEMO_TAG, 'README.md', 'L10-L33');
const NEMO_COLLECTIONS = ghTree('NVIDIA/NeMo', NEMO_TAG, 'nemo/collections');
const TORCHTUNE = gh('meta-pytorch/torchtune', 'bd2a0fc7c31430972728494fa01aaeeb0ebf1ba1', 'README.md', 'L4');
const AXOLOTL = gh('axolotl-ai-cloud/axolotl', AXOLOTL_TAG, 'README.md', 'L102');

/** DeepSpeed at the pinned tag. */
function ds(path: string, lines?: string): string {
  return gh('deepspeedai/DeepSpeed', DEEPSPEED_TAG, path, lines);
}
const DS_STAGE = ds('deepspeed/runtime/zero/config.py', 'L95-L100');
const DS_ELASTIC = ds('deepspeed/runtime/zero/config.py', 'L158-L162');
const DS_FP8_TEST = ds('tests/unit/runtime/half_precision/test_fp8.py', 'L20-L98');
const DS_UNIVERSAL = ds('docs/_tutorials/universal-checkpointing.md', 'L21-L47');
const DS_HOSTFILE = ds('docs/_tutorials/getting-started.md', 'L175-L190');
const DS_NO_SSH = ds('docs/_tutorials/getting-started.md', 'L230-L248');
const DS_PIPE_ZERO = ds('deepspeed/runtime/pipe/engine.py', 'L76-L77');
const DS_DUALPIPEV = ds('docs/_tutorials/pipeline.md', 'L322');
const DS_INFINITY = ds('docs/_tutorials/zero.md', 'L20');
const DS_AUTOTP = ds('docs/_tutorials/autotp-training.md', 'L21');
const DS_ALST = ds('docs/_tutorials/ulysses-alst-sequence-parallelism.md', 'L2-L7');

/** Accelerate and transformers at their pinned tags. */
function ac(path: string, lines?: string): string {
  return gh('huggingface/accelerate', ACCELERATE_TAG, path, lines);
}
const AC_PARALLELISM = ac('src/accelerate/parallelism_config.py', 'L34-L76');
const AC_CP_DOCSTRING = ac('src/accelerate/parallelism_config.py', 'L52-L53');
const AC_CP_CODE = ac('src/accelerate/accelerator.py', 'L4200-L4215');
const AC_FSDP_VERSION = ac('src/accelerate/utils/dataclasses.py', 'L1591-L1593');
const AC_FSDP_ENV = ac('src/accelerate/utils/dataclasses.py', 'L1830-L1831');
const AC_FP8 = ac('docs/source/usage_guides/low_precision_training.md', 'L33-L35');
const AC_MEGATRON = ac('docs/source/usage_guides/megatron_lm.md', 'L26');
const AC_SP_EXPERIMENTAL = ac('docs/source/concept_guides/sequence_parallelism.md', 'L212');
function tf(lines: string): string {
  return gh('huggingface/transformers', TRANSFORMERS_TAG, 'src/transformers/training_args.py', lines);
}
const TF_ACCELERATE = tf('L1811-L1814');
const TF_FSDP_V2 = tf('L2780');
const TF_CONFIG = tf('L1428-L1443');

/** AWS images and samples. */
function dlc(path: string, lines?: string): string {
  return gh('aws/deep-learning-containers', DLC_SHA, path, lines);
}
const DLC_DEPS = dlc('docker/pytorch/2.14/cuda/pyproject.toml', 'L5-L10');
const DLC_BUILD = dlc('.github/config/image/pytorch/2.14-ec2-cuda.yml', 'L20-L25');
const AWSOME_TRAINING = ghTree('awslabs/awsome-distributed-ai', AWSOME_DISTRIBUTED_TRAINING_SHA, 'examples/training');

/** Hugging Face Ultra-Scale Playbook (Tier 3) and the Nanotron repository behind it. */
const PLAYBOOK =
  'https://huggingface.co/spaces/nanotron/ultrascale-playbook/tree/c93890dd4b22356ee18ed9b863e6f2d0909729bc';
const NANOTRON = ghTree('huggingface/nanotron', NANOTRON_TAG);

/* ------------------------------------------------------------------------ */
/* Responsive table                                                         */
/* ------------------------------------------------------------------------ */

const cell: CSSProperties = {
  padding: '6px 8px',
  borderBottom: '1px solid #e9ebed',
  textAlign: 'left',
  verticalAlign: 'top',
  overflowWrap: 'anywhere',
};
const headCell: CSSProperties = { ...cell, fontWeight: 700, borderBottom: '2px solid #d1d5db' };
/** The first column holds framework names: wide enough that a name breaks only between words. */
const firstCell: CSSProperties = { ...cell, minWidth: 128, overflowWrap: 'break-word' };
const firstHeadCell: CSSProperties = { ...headCell, minWidth: 128, overflowWrap: 'break-word' };

interface TableRow {
  key: string;
  cells: ReactNode[];
}

/** A plain table when wide; below 600px each row becomes a stacked block of "header: value". */
function FrameworkTable({ headers, rows }: { headers: string[]; rows: TableRow[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, 600);
  return (
    <div ref={ref}>
      {narrow ? (
        <SpaceBetween size="s">
          {rows.map((r) => (
            <div key={r.key} style={{ borderBottom: '1px solid #e9ebed', paddingBottom: 8, overflowWrap: 'anywhere' }}>
              <Box variant="p">
                <strong>{r.cells[0]}</strong>
              </Box>
              {r.cells.slice(1).map((c, j) => (
                <Box key={headers[j + 1]} variant="p">
                  <strong>{headers[j + 1]}:</strong> {c}
                </Box>
              ))}
            </div>
          ))}
        </SpaceBetween>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                {headers.map((h, j) => (
                  <th key={h} style={j === 0 ? firstHeadCell : headCell}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key}>
                  {r.cells.map((c, j) => (
                    <td key={headers[j]} style={j === 0 ? firstCell : cell}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: three engines, front ends stacked on the engine each calls      */
/* ------------------------------------------------------------------------ */

type Maturity = 'pre' | 'beta' | 'dev' | 'none' | 'ended';

const MATURITY_STYLE: Record<Maturity, { stroke: string; fill: string; dash?: string }> = {
  pre: { stroke: '#8b6c00', fill: '#fbf3d5' },
  beta: { stroke: '#6f4cc4', fill: '#efe7fb' },
  dev: { stroke: '#0972d3', fill: '#f2f8fd' },
  none: { stroke: '#879596', fill: '#f4f5f6' },
  ended: { stroke: '#414d5c', fill: '#ffffff', dash: '5 4' },
};

const LEGEND: { m: Maturity; label: string }[] = [
  { m: 'pre', label: 'alpha, experimental or prototype' },
  { m: 'beta', label: 'beta' },
  { m: 'dev', label: 'under active development' },
  { m: 'none', label: 'no stability label recorded' },
  { m: 'ended', label: 'ended or moved' },
];

interface MapBox {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  m: Maturity;
  /** First line is the bold name; the rest are 11px detail lines. */
  lines: string[];
  /** Font size of the first line. */
  titleSize: number;
  /** Font size of the detail lines (11 in the wide layout, 12 in the narrow one). */
  detailSize?: number;
}

const INK = '#16191f';
const MUTED = '#414d5c';
const FONT = 'sans-serif';

/** Wide layout (900 units): engines in the bottom row, front ends stacked on the engine each calls. */
const W_POST_Y = 12;
const W_L2_Y = 70;
const W_L1_Y = 142;
const W_ENGINE_Y = 214;
const W_FE_H = 62;
const W_ENGINE_H = 78;
const W_LEGEND_Y = 316;
const W_ENDED_LABEL_Y = 352;
const W_ENDED_Y = 362;
const W_ENDED_H = 46;
const W_HEIGHT = 420;

const WIDE_BOXES: MapBox[] = [
  { id: 'ttn', x: 20, y: W_L2_Y, w: 140, h: W_FE_H, m: 'beta', titleSize: 12, lines: ['TorchTitan Neuron', '0.2.2+neuron.1', 'on TorchNeuron'] },
  {
    id: 'trainer',
    x: 300,
    y: W_L2_Y,
    w: 300,
    h: W_FE_H,
    m: 'none',
    titleSize: 12,
    lines: ['transformers Trainer', 'v5.22.1', 'requires Accelerate; FSDP2 by default'],
  },
  { id: 'tt', x: 20, y: W_L1_Y, w: 140, h: W_FE_H, m: 'dev', titleSize: 12, lines: ['TorchTitan', 'v0.4.0', 'recipes, torchrun'] },
  { id: 'am', x: 170, y: W_L1_Y, w: 120, h: W_FE_H, m: 'none', titleSize: 12, lines: ['NeMo AutoModel', 'v0.7.0', 'YAML recipes'] },
  {
    id: 'acc',
    x: 300,
    y: W_L1_Y,
    w: 300,
    h: W_FE_H,
    m: 'none',
    titleSize: 12,
    lines: ['Accelerate', 'v1.15.0', 'DDP, FSDP1 or FSDP2, DeepSpeed backend'],
  },
  { id: 'mlm', x: 610, y: W_L1_Y, w: 125, h: W_FE_H, m: 'none', titleSize: 12, lines: ['Megatron-LM', 'core_v0.20.0', 'reference scripts'] },
  { id: 'bridge', x: 745, y: W_L1_Y, w: 135, h: W_FE_H, m: 'none', titleSize: 12, lines: ['Megatron Bridge', 'v0.7.0', 'recipes, conversion'] },
  {
    id: 'pytorch',
    x: 20,
    y: W_ENGINE_Y,
    w: 400,
    h: W_ENGINE_H,
    m: 'pre',
    titleSize: 13,
    lines: ['PyTorch distributed v2.15.0', 'FSDP2, DTensor, pipelining, context_parallel', 'alpha, experimental and prototype APIs'],
  },
  {
    id: 'deepspeed',
    x: 430,
    y: W_ENGINE_Y,
    w: 170,
    h: W_ENGINE_H,
    m: 'none',
    titleSize: 13,
    lines: ['DeepSpeed v0.19.9', 'ZeRO stages 0 to 3,', 'pipeline, Ulysses'],
  },
  {
    id: 'megatron',
    x: 610,
    y: W_ENGINE_Y,
    w: 270,
    h: W_ENGINE_H,
    m: 'none',
    titleSize: 13,
    lines: ['Megatron Core core_v0.20.0', 'TP, SP, CP, PP and EP,', 'distributed optimizer'],
  },
  {
    id: 'nemo',
    x: 20,
    y: W_ENDED_Y,
    w: 280,
    h: W_ENDED_H,
    m: 'ended',
    titleSize: 12,
    lines: ['NVIDIA/NeMo v3.0.0', 'speech only; LLM training moved'],
  },
  { id: 'torchtune', x: 310, y: W_ENDED_Y, w: 280, h: W_ENDED_H, m: 'ended', titleSize: 12, lines: ['torchtune', 'no longer actively maintained'] },
  {
    id: 'nxdt',
    x: 600,
    y: W_ENDED_Y,
    w: 280,
    h: W_ENDED_H,
    m: 'ended',
    titleSize: 12,
    lines: ['NxD Training', 'end-of-support as of Neuron 2.32'],
  },
];

/** Narrow layout (400 units): one engine group at a time, front ends indented above their engine. */
interface NarrowRow {
  id: string;
  indent: 0 | 1 | 2;
  m: Maturity;
  lines: string[];
  engine?: boolean;
  /** A plain text note with no box. */
  note?: boolean;
}

const NARROW_GROUPS: NarrowRow[][] = [
  [
    { id: 'n-ttn', indent: 2, m: 'beta', lines: ['TorchTitan Neuron 0.2.2+neuron.1', 'AWS fork of TorchTitan, on TorchNeuron'] },
    { id: 'n-tt', indent: 1, m: 'dev', lines: ['TorchTitan v0.4.0', 'recipes, torchrun'] },
    { id: 'n-am', indent: 1, m: 'none', lines: ['NeMo AutoModel v0.7.0', 'YAML recipes'] },
    { id: 'n-trainer', indent: 2, m: 'none', lines: ['transformers Trainer v5.22.1', 'requires Accelerate; FSDP2 by default'] },
    { id: 'n-acc', indent: 1, m: 'none', lines: ['Accelerate v1.15.0', 'also drives DeepSpeed and a Megatron-LM plugin'] },
    {
      id: 'n-pytorch',
      indent: 0,
      m: 'pre',
      engine: true,
      lines: ['PyTorch distributed v2.15.0', 'FSDP2, DTensor, pipelining, context_parallel', 'alpha, experimental and prototype APIs'],
    },
  ],
  [
    { id: 'n-ds-note', indent: 1, m: 'none', note: true, lines: ['configured through Accelerate and the Trainer'] },
    { id: 'n-ds', indent: 0, m: 'none', engine: true, lines: ['DeepSpeed v0.19.9', 'ZeRO stages 0 to 3, pipeline, Ulysses', 'JSON configuration'] },
  ],
  [
    { id: 'n-bridge', indent: 1, m: 'none', lines: ['Megatron Bridge v0.7.0', 'recipes, Hugging Face conversion'] },
    { id: 'n-mlm', indent: 1, m: 'none', lines: ['Megatron-LM core_v0.20.0', 'reference scripts'] },
    {
      id: 'n-megatron',
      indent: 0,
      m: 'none',
      engine: true,
      lines: ['Megatron Core core_v0.20.0', 'TP, SP, CP, PP and EP', 'distributed optimizer, opt-in'],
    },
  ],
];

const NARROW_ENDED: { id: string; lines: string[] }[] = [
  { id: 'n-nemo', lines: ['NVIDIA/NeMo v3.0.0', 'speech only; LLM training moved'] },
  { id: 'n-torchtune', lines: ['torchtune', 'no longer actively maintained'] },
  { id: 'n-nxdt', lines: ['NxD Training', 'end-of-support as of Neuron 2.32'] },
];

function BoxShape({ b }: { b: MapBox }) {
  const s = MATURITY_STYLE[b.m];
  const cx = b.x + b.w / 2;
  const detail = b.detailSize ?? 11;
  const first = b.y + b.titleSize + 7 + (b.titleSize >= 13 && detail === 11 ? 2 : 0);
  const step = detail + (b.titleSize >= 13 && detail === 11 ? 8 : 5);
  return (
    <g className="frameworks-map-box">
      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={6} fill={s.fill} stroke={s.stroke} strokeWidth={1.5} strokeDasharray={s.dash} />
      {b.lines.map((line, i) => (
        <text
          key={line}
          x={cx}
          y={first + i * step}
          textAnchor="middle"
          fontFamily={FONT}
          fontSize={i === 0 ? b.titleSize : detail}
          fontWeight={i === 0 ? 700 : 400}
          fill={i === 0 ? INK : MUTED}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function Swatch({ x, y, m }: { x: number; y: number; m: Maturity }) {
  const s = MATURITY_STYLE[m];
  return <rect x={x} y={y} width={14} height={14} rx={3} fill={s.fill} stroke={s.stroke} strokeWidth={1.5} strokeDasharray={m === 'ended' ? '3 2' : undefined} />;
}

function WideMap() {
  let lx = 20;
  const legend = LEGEND.map((item) => {
    const x = lx;
    lx += 14 + 6 + Math.ceil(item.label.length * 5.7) + 24;
    return { ...item, x };
  });
  return (
    <svg
      viewBox={`0 0 900 ${W_HEIGHT}`}
      role="img"
      aria-labelledby="frameworks-map-title"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <title id="frameworks-map-title">
        Framework map: three engines in the bottom row (PyTorch distributed, DeepSpeed, Megatron Core), the front ends
        stacked on the engine each calls, post-training frameworks above them, and three projects that ended or moved,
        coloured by each project&apos;s own maturity label
      </title>
      <rect x={0} y={0} width={900} height={W_HEIGHT} fill="#ffffff" />
      <rect x={20} y={W_POST_Y} width={860} height={46} rx={6} fill="#ffffff" stroke="#d1d5db" strokeWidth={1.5} />
      <text x={450} y={W_POST_Y + 19} textAnchor="middle" fontFamily={FONT} fontSize={12} fontWeight={700} fill={INK}>
        Post-training frameworks (section 16)
      </text>
      <text x={450} y={W_POST_Y + 36} textAnchor="middle" fontFamily={FONT} fontSize={11} fill={MUTED}>
        each reuses an engine below: NeMo RL through DTensor or Megatron Bridge, Axolotl through FSDP2 or DeepSpeed
      </text>
      {WIDE_BOXES.map((b) => (
        <BoxShape key={b.id} b={b} />
      ))}
      {legend.map((item) => (
        <g key={item.m} className="frameworks-map-legend">
          <Swatch x={item.x} y={W_LEGEND_Y - 11} m={item.m} />
          <text x={item.x + 20} y={W_LEGEND_Y} fontFamily={FONT} fontSize={11} fill={INK}>
            {item.label}
          </text>
        </g>
      ))}
      <text x={20} y={W_ENDED_LABEL_Y} fontFamily={FONT} fontSize={12} fontWeight={700} fill={INK}>
        Ended or moved
      </text>
    </svg>
  );
}

function NarrowMap() {
  const X0 = 12;
  const X1 = 388;
  const ROW_H = 46;
  const ENGINE_H = 64;
  const GAP = 5;
  const GROUP_GAP = 16;
  const parts: ReactNode[] = [];
  let y = 12;

  parts.push(
    <g key="post">
      <rect x={X0} y={y} width={X1 - X0} height={ROW_H} rx={6} fill="#ffffff" stroke="#d1d5db" strokeWidth={1.5} />
      <text x={200} y={y + 20} textAnchor="middle" fontFamily={FONT} fontSize={13} fontWeight={700} fill={INK}>
        Post-training frameworks (section 16)
      </text>
      <text x={200} y={y + 37} textAnchor="middle" fontFamily={FONT} fontSize={12} fill={MUTED}>
        each reuses an engine below
      </text>
    </g>,
  );
  y += ROW_H + GROUP_GAP;

  NARROW_GROUPS.forEach((group, gi) => {
    group.forEach((row) => {
      const x = X0 + row.indent * 20;
      const w = X1 - x;
      if (row.note) {
        parts.push(
          <text key={row.id} x={x} y={y + 14} fontFamily={FONT} fontSize={12} fontStyle="italic" fill={MUTED}>
            {row.lines[0]}
          </text>,
        );
        y += 20 + GAP;
        return;
      }
      const h = row.engine ? ENGINE_H : ROW_H;
      const b: MapBox = { id: row.id, x, y, w, h, m: row.m, titleSize: 13, detailSize: 12, lines: row.lines };
      if (row.engine) {
        const s = MATURITY_STYLE[row.m];
        parts.push(
          <g key={row.id} className="frameworks-map-box">
            <rect x={x} y={y} width={w} height={h} rx={6} fill={s.fill} stroke={s.stroke} strokeWidth={1.5} />
            {row.lines.map((line, i) => (
              <text
                key={line}
                x={x + w / 2}
                y={y + 21 + i * 17}
                textAnchor="middle"
                fontFamily={FONT}
                fontSize={i === 0 ? 14 : 12}
                fontWeight={i === 0 ? 700 : 400}
                fill={i === 0 ? INK : MUTED}
              >
                {line}
              </text>
            ))}
          </g>,
        );
      } else {
        parts.push(<BoxShape key={row.id} b={b} />);
      }
      y += h + GAP;
    });
    y += gi < NARROW_GROUPS.length - 1 ? GROUP_GAP : 0;
  });

  y += 14;
  LEGEND.forEach((item) => {
    parts.push(
      <g key={`legend-${item.m}`} className="frameworks-map-legend">
        <Swatch x={X0} y={y} m={item.m} />
        <text x={X0 + 20} y={y + 12} fontFamily={FONT} fontSize={12} fill={INK}>
          {item.label}
        </text>
      </g>,
    );
    y += 22;
  });

  y += 16;
  parts.push(
    <text key="ended-label" x={X0} y={y} fontFamily={FONT} fontSize={13} fontWeight={700} fill={INK}>
      Ended or moved
    </text>,
  );
  y += 10;
  NARROW_ENDED.forEach((e) => {
    parts.push(
      <BoxShape key={e.id} b={{ id: e.id, x: X0, y, w: X1 - X0, h: ROW_H, m: 'ended', titleSize: 13, detailSize: 12, lines: e.lines }} />,
    );
    y += ROW_H + GAP;
  });
  const H = y + 8;

  return (
    <svg viewBox={`0 0 400 ${H}`} role="img" aria-labelledby="frameworks-map-title" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <title id="frameworks-map-title">
        Framework map: three engines (PyTorch distributed, DeepSpeed, Megatron Core), each with the front ends that call it
        indented above it, post-training frameworks at the top, and three projects that ended or moved, coloured by each
        project&apos;s own maturity label
      </title>
      <rect x={0} y={0} width={400} height={H} fill="#ffffff" />
      {parts}
    </svg>
  );
}

function FrameworkMapDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref);
  return (
    <SpaceBetween size="xs">
      <div ref={ref}>{narrow ? <NarrowMap /> : <WideMap />}</div>
      <Box variant="small" color="text-body-secondary">
        Illustrative, not measured. Each box sits on the engine it calls; the colour is the project&apos;s own maturity
        word at the pinned tag, as quoted in the table below. Accelerate spans PyTorch and DeepSpeed because it drives
        both. The grouping into engines and front ends is our reading of these sources.
      </Box>
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Chooser                                                                  */
/* ------------------------------------------------------------------------ */

type Accel = 'hopper-bf16' | 'hopper-fp8' | 'blackwell-mxfp8' | 'trainium';
type Source = 'hf' | 'own';
type Depth = 'read' | 'library' | 'config';

interface Pick {
  engine: string;
  frontEnd: string;
  pin: string;
  check: string;
}

const PIN_TT = 'TorchTitan v0.4.0 (aligned with PyTorch 2.15), with the torch and torchao nightlies its release pins';
const PIN_MEGATRON = 'Megatron Bridge v0.7.0 with the Megatron Core commit its submodule pins, or Megatron-LM at core_v0.20.0';
const PIN_HF = 'Accelerate v1.15.0 and transformers v5.22.1, or NeMo AutoModel v0.7.0';
const PIN_DS = 'DeepSpeed v0.19.9 (the AWS PyTorch 2.14 container carries 0.19.6)';

/** Each answer combines facts cited in the section above; the pairing itself is our reading. */
function pickStack(accel: Accel, source: Source, depth: Depth): Pick {
  if (accel === 'trainium') {
    return {
      engine: 'PyTorch through TorchNeuron, the Neuron backend (public beta)',
      frontEnd:
        depth === 'read'
          ? 'TorchTitan Neuron 0.2.2+neuron.1 (Beta)'
          : 'TorchTitan Neuron 0.2.2+neuron.1 (Beta); no library or config-file front end for Trainium was read in this research',
      pin: 'Neuron 2.33.0: torch-neuronx 2.14 and the fork at tag release-2.33.0',
      check:
        source === 'hf'
          ? 'Train in BF16 (FP8 and MXFP8 require Trainium 3); confirm your architecture is among the supported models (Llama3, Qwen3, DeepSeek-V3, GPT-OSS); start from the validated TP 4 x FSDP 16 on one trn2.48xlarge; no TorchTitan Neuron tutorial covers PP'
          : 'Train in BF16 (FP8 and MXFP8 require Trainium 3); start from the validated TP 4 x FSDP 16 on one trn2.48xlarge; no TorchTitan Neuron tutorial covers PP',
    };
  }
  if (accel === 'hopper-fp8') {
    if (depth === 'config') {
      return source === 'hf'
        ? {
            engine: 'PyTorch FSDP2 with Transformer Engine or torchao layers',
            frontEnd: 'Accelerate (or the Trainer on it) with mixed_precision="fp8", or NeMo AutoModel',
            pin: PIN_HF,
            check: 'Set the FSDP version explicitly: Accelerate defaults to FSDP1, the Trainer to FSDP2',
          }
        : {
            engine: 'DeepSpeed, with Transformer Engine layers in your model',
            frontEnd: 'A DeepSpeed JSON configuration',
            pin: PIN_DS,
            check: 'DeepSpeed has no FP8 switch: FP8 comes from the Transformer Engine layers; set zero_optimization.stage, which defaults to 0',
          };
    }
    return {
      engine: 'Megatron Core with Transformer Engine',
      frontEnd: depth === 'read' ? "Megatron-LM's reference scripts" : 'Megatron Bridge',
      pin: PIN_MEGATRON,
      check:
        'FP8 stays off until --fp8-format is set, and the recipe then defaults to delayed scaling; pass --use-distributed-optimizer, which is off by default',
    };
  }
  if (accel === 'blackwell-mxfp8') {
    if (depth === 'read') {
      return {
        engine: 'PyTorch FSDP2 with torchao',
        frontEnd: 'TorchTitan v0.4.0, MXFP8 for dense and MoE models',
        pin: PIN_TT,
        check: 'Install the torchao nightly that matches your torch build; parameters and checkpoint state stay in high precision',
      };
    }
    if (depth === 'library') {
      return {
        engine: 'Megatron Core with Transformer Engine',
        frontEnd: 'Megatron Bridge, or Megatron-LM with --fp8-recipe mxfp8 --fp8-format e4m3',
        pin: PIN_MEGATRON,
        check: 'mxfp8 requires Blackwell; pass --use-distributed-optimizer, which is off by default',
      };
    }
    return {
      engine: 'PyTorch with Transformer Engine or torchao',
      frontEnd:
        'No config-file front end with a documented dense MXFP8 path on B200 was read in this research; NeMo AutoModel documents MXFP8 for MoE experts on GB200',
      pin: 'NeMo AutoModel v0.7.0',
      check: 'For a dense model, move one level down the stack: TorchTitan or Megatron Bridge',
    };
  }
  // Hopper, BF16
  if (depth === 'read') {
    return {
      engine: 'PyTorch FSDP2 and DTensor',
      frontEnd: 'TorchTitan v0.4.0',
      pin: PIN_TT,
      check: 'Set NGPU to the product of the degrees; FSDP2 synchronises gradients on every micro-batch unless you defer it (section 8)',
    };
  }
  if (depth === 'library') {
    return {
      engine: 'Megatron Core',
      frontEnd: source === 'hf' ? 'Megatron Bridge (Hugging Face checkpoints both ways)' : 'Megatron Bridge, or Megatron-LM for its scripts',
      pin: PIN_MEGATRON,
      check: 'Pass --use-distributed-optimizer, which is off by default; save fully reshardable before any TP, PP or EP change',
    };
  }
  return source === 'hf'
    ? {
        engine: "PyTorch FSDP2, or DeepSpeed as Accelerate's backend",
        frontEnd: 'The transformers Trainer or Accelerate, or NeMo AutoModel',
        pin: PIN_HF,
        check: 'Set the FSDP version explicitly: Accelerate defaults to FSDP1, the Trainer to FSDP2',
      }
    : {
        engine: 'DeepSpeed',
        frontEnd: 'A DeepSpeed JSON configuration, launched with the deepspeed launcher',
        pin: PIN_DS,
        check: 'ZeRO is off until zero_optimization.stage is set; its pipeline engine refuses ZeRO-2 and ZeRO-3',
      };
}

const ACCEL_OPTIONS = [
  { value: 'hopper-bf16', label: 'H100 or H200, BF16' },
  { value: 'hopper-fp8', label: 'H100 or H200, FP8' },
  { value: 'blackwell-mxfp8', label: 'B200 or GB200, MXFP8' },
  { value: 'trainium', label: 'Trainium2, BF16' },
];
const SOURCE_OPTIONS = [
  { value: 'hf', label: 'A Hugging Face checkpoint' },
  { value: 'own', label: 'Our own model code' },
];
const DEPTH_OPTIONS = [
  { value: 'read', label: 'All of it', description: 'a short trainer I can read end to end' },
  { value: 'library', label: 'A library', description: 'tuned recipes on a performance engine' },
  { value: 'config', label: 'A config file', description: 'the least code I can write' },
];

function StackChooser() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref);
  const [accel, setAccel] = useState<Accel>('hopper-bf16');
  const [source, setSource] = useState<Source>('hf');
  const [depth, setDepth] = useState<Depth>('read');
  const pick = pickStack(accel, source, depth);
  return (
    <SpaceBetween size="m">
      <ColumnLayout columns={3}>
        <FormField label="1. Accelerator and precision">
          <RadioGroup value={accel} onChange={({ detail }) => setAccel(detail.value as Accel)} items={ACCEL_OPTIONS} />
        </FormField>
        <FormField label="2. Where the model comes from">
          <RadioGroup value={source} onChange={({ detail }) => setSource(detail.value as Source)} items={SOURCE_OPTIONS} />
        </FormField>
        <FormField label="3. How much of the stack to read">
          <RadioGroup value={depth} onChange={({ detail }) => setDepth(detail.value as Depth)} items={DEPTH_OPTIONS} />
        </FormField>
      </ColumnLayout>
      <div ref={ref}>
        <KeyValuePairs
          columns={narrow ? 1 : 2}
        items={[
          { label: 'Engine', value: pick.engine },
          { label: 'Front end', value: pick.frontEnd },
          { label: 'Version to pin', value: pick.pin },
          { label: 'Check first', value: pick.check },
        ]}
        />
      </div>
      <Box variant="small" color="text-body-secondary">
        Each answer combines facts cited in the blocks above; the pairing of an answer to a framework is our reading.
      </Box>
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function FrameworkMap() {
  const zeroRows: TableRow[] = [
    {
      key: 'stage1',
      cells: [
        'Stage 1: optimizer state',
        <>
          <code>stage: 1</code>
        </>,
        <>
          The distributed optimizer (<code>--use-distributed-optimizer</code>), or Megatron-FSDP <code>optim</code>
        </>,
        'No separate setting',
      ],
    },
    {
      key: 'stage2',
      cells: [
        'Stage 2: and gradients',
        <>
          <code>stage: 2</code>
        </>,
        <>
          Megatron-FSDP <code>optim_grads</code>
        </>,
        <>
          <code>fully_shard</code> with <code>reshard_after_forward=False</code> comes closest: it keeps the gathered
          weights from forward to backward{' '}
          <Cite tier={1} href={FULLY_SHARD_RESHARD} kind="code">
            fully_shard docstring L190-L200
          </Cite>
          , and Megatron&apos;s flag for it reads &quot;Set to enable FSDP ZeRO-2&quot;{' '}
          <Cite tier={1} href={MG_FSDP2_ZERO2} kind="code">
            Megatron arguments.py L3183-L3185
          </Cite>
        </>,
      ],
    },
    {
      key: 'stage3',
      cells: [
        'Stage 3: and weights',
        <>
          <code>stage: 3</code>
        </>,
        <>
          Megatron-FSDP <code>optim_grads_params</code>, its default{' '}
          <Cite tier={1} href={MG_SHARDING_DEFAULT} kind="code">
            Megatron arguments.py L3136-L3138
          </Cite>
        </>,
        <>
          <code>fully_shard</code>; a 2D mesh gives HSDP{' '}
          <Cite tier={1} href={FULLY_SHARD_HSDP} kind="code">
            fully_shard docstring L182-L188
          </Cite>
        </>,
      ],
    },
    {
      key: 'default',
      cells: [
        'With no setting',
        <>
          Stage 0, documented as disabled{' '}
          <Cite tier={1} href={DS_STAGE} kind="code">
            DeepSpeed zero/config.py L95-L100
          </Cite>
        </>,
        <>
          Distributed optimizer off{' '}
          <Cite tier={1} href={MG_USE_DIST_OPT} kind="code">
            Megatron arguments.py L3102-L3103
          </Cite>
        </>,
        'Nothing is sharded until fully_shard is called',
      ],
    },
  ];

  const maturityRows: TableRow[] = [
    {
      key: 'pytorch',
      cells: [
        'PyTorch distributed',
        'v2.15.0',
        <>
          DTensor and pipelining &quot;alpha&quot;; tensor parallel &quot;experimental&quot;;{' '}
          <code>context_parallel</code> &quot;prototype&quot;; <code>async_save</code> &quot;experimental&quot; (cited
          above)
        </>,
        'Building blocks for your own trainer, and the base of every PyTorch-native row',
      ],
    },
    {
      key: 'torchtitan',
      cells: [
        'TorchTitan',
        <>
          v0.4.0, with the nightlies its release pins{' '}
          <Cite tier={1} href={TT_RELEASE}>
            TorchTitan v0.4.0 release
          </Cite>
        </>,
        <>
          &quot;under active development&quot;{' '}
          <Cite tier={1} href={TT_DEV}>
            TorchTitan README L38-L39
          </Cite>
        </>,
        'Readable PyTorch-native pre-training; Blackwell low precision',
      ],
    },
    {
      key: 'ttn',
      cells: [
        'TorchTitan Neuron',
        <>
          0.2.2+neuron.1, tag <code>release-2.33.0</code>, on torch-neuronx 2.14{' '}
          <Cite tier={1} href={TTN_RELEASE}>
            TorchTitan Neuron release notes L11-L36
          </Cite>
        </>,
        <>
          &quot;Beta&quot;, on TorchNeuron, a &quot;public beta&quot;{' '}
          <Cite tier={1} href={TORCHNEURON_BETA}>
            TorchNeuron release notes L20-L22
          </Cite>
        </>,
        'Pre-training on Trn2 and Trn3 with the PyTorch-native stack',
      ],
    },
    {
      key: 'megatron',
      cells: [
        'Megatron Core and Megatron-LM',
        'core_v0.20.0',
        <>
          Core &quot;a composable library&quot;, Megatron-LM &quot;a reference example&quot;{' '}
          <Cite tier={1} href={MG_ABOUT}>
            Megatron README L16-L22
          </Cite>
          ; the dev branch carries &quot;experimental features&quot;{' '}
          <Cite tier={1} href={MG_DEV_BRANCH}>
            README L59
          </Cite>
        </>,
        'The largest dense and MoE (mixture of experts) pre-training on NVIDIA GPUs; FP8 (8-bit floating point) on H100 and H200',
      ],
    },
    {
      key: 'bridge',
      cells: [
        'Megatron Bridge',
        'v0.7.0',
        <>
          &quot;a refactor of the previous NeMo training stack&quot;{' '}
          <Cite tier={1} href={BR_OVERVIEW}>
            Megatron Bridge README L68-L72
          </Cite>
        </>,
        'Megatron performance from Hugging Face checkpoints',
      ],
    },
    {
      key: 'automodel',
      cells: ['NeMo AutoModel', 'v0.7.0', 'None recorded in this research', 'Hugging Face models at scale on NVIDIA, PyTorch-native'],
    },
    {
      key: 'deepspeed',
      cells: [
        'DeepSpeed',
        'v0.19.9',
        'None recorded in this research',
        'Memory-constrained fine-tuning with offload or ZeRO-3; long-context sequence parallelism',
      ],
    },
    {
      key: 'accelerate',
      cells: [
        'Accelerate',
        'v1.15.0',
        <>
          Its sequence-parallel API is &quot;still in its experimental stage&quot;{' '}
          <Cite tier={1} href={AC_SP_EXPERIMENTAL}>
            Accelerate sequence parallelism guide L212
          </Cite>
        </>,
        'Hugging Face models up to the size FSDP2 plus TP handles',
      ],
    },
    {
      key: 'trainer',
      cells: ['transformers Trainer', 'v5.22.1', 'None recorded in this research', 'Simple fine-tuning runs'],
    },
  ];

  const implRows: TableRow[] = [
    {
      key: 'pytorch',
      cells: [
        'PyTorch v2.15.0',
        <>
          DDP, FSDP2 and HSDP; DTensor TP and SP; <code>context_parallel</code>, all-gather of keys and values by
          default{' '}
          <Cite tier={1} href={CP_ALLGATHER_DEFAULT} kind="code">
            _attention.py L77
          </Cite>
          ; pipelining with 1F1B (one forward, one backward), Interleaved1F1B, GPipe, LoopedBFS, InterleavedZeroBubble,
          ZBVZeroBubble and DualPipeV{' '}
          <Cite tier={1} href={PT_SCHEDULES} kind="code">
            schedules.py L5228-L5236
          </Cite>
        </>,
        <>
          Low-precision formats come from libraries above it: TorchTitan&apos;s MXFP8 and NVFP4 (NVIDIA&apos;s 4-bit
          floating-point format) need a torchao nightly{' '}
          <Cite tier={1} href={TT_TORCHAO}>
            TorchTitan README L228-L230
          </Cite>
        </>,
      ],
    },
    {
      key: 'torchtitan',
      cells: [
        'TorchTitan v0.4.0',
        <>
          FSDP2, HSDP, DDP; TP with async TP; any PyTorch pipeline schedule, <code>1F1B</code> by default{' '}
          <Cite tier={1} href={TT_PP_DEFAULT} kind="code">
            parallelism.py L114
          </Cite>
          ; CP by all-gather or Ulysses; EP with DeepEP or HybridEP dispatch{' '}
          <Cite tier={1} href={TT_FEATURES}>
            README L130-L134
          </Cite>
        </>,
        <>
          BF16; MXFP8 for dense and MoE models and NVFP4 (experimental) on Blackwell, with parameters and checkpoint
          state kept in high precision{' '}
          <Cite tier={1} href={TT_QUANT}>
            quantization README L5-L13
          </Cite>
          ; legacy Float8 removed in v0.4.0{' '}
          <Cite tier={1} href={TT_RELEASE}>
            v0.4.0 release
          </Cite>
        </>,
      ],
    },
    {
      key: 'ttn',
      cells: [
        'TorchTitan Neuron',
        <>
          FSDP2, SimpleFSDP, TP, CP (ring), EP; PP &quot;Supported by TorchNeuron&quot; but &quot;Not covered by the
          TorchTitan tutorials&quot;{' '}
          <Cite tier={1} href={TTN_SUPPORT}>
            About TorchTitan Neuron L62-L95
          </Cite>
        </>,
        <>
          BF16 on Trn2: &quot;FP8 and MXFP8 require Trainium 3&quot;{' '}
          <Cite tier={1} href={NEURON_PRECISION}>
            About PyTorch Neuron L115-L118
          </Cite>
        </>,
      ],
    },
    {
      key: 'megatron',
      cells: [
        'Megatron Core core_v0.20.0',
        <>
          TP, SP, CP with a <code>p2p</code> ring by default{' '}
          <Cite tier={1} href={MG_CP_DEFAULT} kind="code">
            arguments.py L3186
          </Cite>
          , PP with 1F1B and interleaved virtual stages, EP; a combined 1F1B module for MoE overlap{' '}
          <Cite tier={1} href={MG_SCHEDULES} kind="code">
            pipeline_parallel/schedules.py
          </Cite>
        </>,
        <>
          BF16; FP8 recipes <code>delayed</code> (default), <code>tensorwise</code> and <code>blockwise</code> on
          Hopper; <code>mxfp8</code> and <code>nvfp4</code> on Blackwell; all through Transformer Engine{' '}
          <Cite tier={1} href={MG_LOW_PRECISION}>
            low_precision_training.md L41-L45
          </Cite>
          . FP8 stays off until <code>--fp8-format</code> is set{' '}
          <Cite tier={1} href={MG_FP8_DEFAULT} kind="code">
            transformer_config.py L664-L673
          </Cite>
        </>,
      ],
    },
    {
      key: 'automodel',
      cells: [
        'NeMo AutoModel v0.7.0',
        <>
          FSDP2, HSDP, TP, CP, SP and PP from PyTorch{' '}
          <Cite tier={1} href={AM_PARALLEL}>
            AutoModel README L165
          </Cite>
        </>,
        <>
          FP8 through torchao or Transformer Engine; MXFP8 for MoE experts on GB200{' '}
          <Cite tier={1} href={AM_PRECISION}>
            README L168-L169
          </Cite>
        </>,
      ],
    },
    {
      key: 'deepspeed',
      cells: [
        'DeepSpeed v0.19.9',
        <>
          ZeRO stages 0 to 3, with ZeRO-Infinity offload to CPU memory and NVMe{' '}
          <Cite tier={1} href={DS_INFINITY}>
            ZeRO tutorial L20
          </Cite>
          ; a pipeline engine that refuses ZeRO-2 and ZeRO-3{' '}
          <Cite tier={1} href={DS_PIPE_ZERO} kind="code">
            pipe/engine.py L76-L77
          </Cite>{' '}
          and a DualPipeV schedule{' '}
          <Cite tier={1} href={DS_DUALPIPEV}>
            pipeline tutorial L322
          </Cite>
          ; AutoTP with ZeRO 0 to 2{' '}
          <Cite tier={1} href={DS_AUTOTP}>
            AutoTP tutorial L21
          </Cite>
          ; Ulysses and ALST (Arctic Long Sequence Training){' '}
          <Cite tier={1} href={DS_ALST}>
            ALST tutorial L2-L7
          </Cite>
        </>,
        'No FP8 switch in its configuration; FP8 through Transformer Engine layers in the model (below)',
      ],
    },
    {
      key: 'accelerate',
      cells: [
        'Accelerate v1.15.0',
        <>
          DDP, FSDP1 or FSDP2, HSDP, TP; CP with FSDP2; SP through DeepSpeed; no pipeline field{' '}
          <Cite tier={1} href={AC_PARALLELISM} kind="code">
            parallelism_config.py L34-L76
          </Cite>
        </>,
        <>
          FP8 through Transformer Engine or torchao{' '}
          <Cite tier={1} href={AC_FP8}>
            low-precision guide L33-L35
          </Cite>
        </>,
      ],
    },
    {
      key: 'bridge-trainer',
      cells: ['Megatron Bridge and the Trainer', "Their engine's: Megatron Core's and Accelerate's", "Their engine's"],
    },
  ];

  const configRows: TableRow[] = [
    {
      key: 'torchtitan',
      cells: [
        'TorchTitan',
        <>
          A Python function returning <code>Trainer.Config</code>, with no general <code>--section.option</code>{' '}
          command line; <code>run_train.sh</code> launches torchrun, and <code>NGPU</code> must match the product of
          the degrees{' '}
          <Cite tier={1} href={TT_CONFIG}>
            config README L3-L22
          </Cite>
        </>,
        <>
          An example in AWS&apos;s reference repository, Slurm only{' '}
          <Cite tier={1} href={AWSOME_TRAINING} accessed={REGISTER_DATE}>
            awsome-distributed-ai examples/training
          </Cite>
        </>,
      ],
    },
    {
      key: 'ttn',
      cells: [
        'TorchTitan Neuron',
        <>
          One rank per logical NeuronCore: 64 ranks per trn2.48xlarge at the default LNC (logical NeuronCore) setting
          of 2{' '}
          <Cite tier={1} href={TTN_RANKS}>
            About TorchTitan Neuron L203-L209
          </Cite>
          ; validated at TP 4 x FSDP 16 for Llama3-8B on one trn2.48xlarge and for Qwen3-32B with full activation
          checkpointing{' '}
          <Cite tier={1} href={TTN_VALIDATED}>
            L176-L186
          </Cite>
        </>,
        <>
          The Neuron 2.33.0 torch-neuronx 2.14.3.0 DLAMI includes TorchTitan{' '}
          <Cite tier={1} href={NEURON_DLAMI}>
            DLAMI release notes L28
          </Cite>
        </>,
      ],
    },
    {
      key: 'megatron',
      cells: [
        'Megatron-LM',
        <>
          Command-line flags to its training scripts{' '}
          <Cite tier={1} href={MG_ARGS} kind="code">
            megatron/training/arguments.py
          </Cite>
        </>,
        'Transformer Engine 2.18.0 in the AWS PyTorch container; an example in the reference repository',
      ],
    },
    {
      key: 'bridge',
      cells: [
        'Megatron Bridge',
        <>
          Python recipes returning a <code>ConfigContainer</code>{' '}
          <Cite tier={1} href={BR_CONFIG}>
            migration guide L3-L7
          </Cite>
          , for example Llama 3 70B on 32 H100 at TP 4, PP 4, VP (virtual pipeline chunks) 5 and CP 2{' '}
          <Cite tier={1} href={BR_RECIPE_70B} kind="code">
            llama3.py L717-L739
          </Cite>
        </>,
        'An example in the reference repository',
      ],
    },
    {
      key: 'automodel',
      cells: [
        'NeMo AutoModel',
        <>
          YAML recipes, any field overridable from the command line{' '}
          <Cite tier={1} href={AM_RECIPES}>
            README L107
          </Cite>
          ; Slurm, SkyPilot, and Kubernetes through SkyPilot{' '}
          <Cite tier={1} href={AM_LAUNCH}>
            README L177
          </Cite>
        </>,
        'None recorded in this research',
      ],
    },
    {
      key: 'deepspeed',
      cells: [
        'DeepSpeed',
        <>
          A JSON file; the <code>deepspeed</code> launcher reads a hostfile of hosts reached over passwordless SSH{' '}
          <Cite tier={1} href={DS_HOSTFILE}>
            getting-started L175-L190
          </Cite>
          , or runs once per node with <code>--no_ssh</code>{' '}
          <Cite tier={1} href={DS_NO_SSH}>
            L230-L248
          </Cite>
        </>,
        'DeepSpeed 0.19.6 in the AWS PyTorch container; an example in the reference repository',
      ],
    },
    {
      key: 'accelerate',
      cells: [
        'Accelerate and the Trainer',
        <>
          <code>accelerate launch</code> with a config file; the Trainer takes <code>TrainingArguments</code> with an{' '}
          <code>fsdp_config</code> or a DeepSpeed JSON path{' '}
          <Cite tier={1} href={TF_CONFIG} kind="code">
            training_args.py L1428-L1443
          </Cite>
        </>,
        "Not among the AWS container's direct dependencies (its lock file was not read)",
      ],
    },
  ];

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Choose a training framework by the engine underneath it, at a pinned version, after reading its maturity label: three engines implement the parallelism and every other framework here configures one of them (code and docs at PyTorch v2.15.0, TorchTitan v0.4.0, Megatron Core core_v0.20.0, DeepSpeed v0.19.9 and the other tags in the tables, read 2026-10-31)"
          >
            15. The Framework Map
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A training framework is the code between a model definition and the collectives. It shards the model
            state across ranks, schedules the micro-batches, writes the checkpoints and launches one process per
            accelerator. This section compares nine of them at pinned tags, read in code and documentation.
          </Box>
          <Box variant="p">
            Read that way, the field has three engines that implement the parallelism (PyTorch&apos;s distributed
            package, Megatron Core and DeepSpeed) and front ends that choose a configuration and a training loop for
            one of them, so choosing a framework is mostly choosing an engine (our reading of these sources). The
            challenge is that the names on top change faster than the engines: among the projects read here, one
            repository pivoted to speech, one fine-tuning library stopped being maintained and one AWS training
            library reached end of support.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read any framework as an engine plus a front end and you know what to compare first: three engines implement the parallelism, and the front ends differ in configuration, recipes and launchers"
          >
            Three engines, and the front ends on top
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An engine shards the tensors and issues the collectives. PyTorch&apos;s is FSDP2 (Fully Sharded Data
            Parallel, the <code>fully_shard</code> API), which shards each layer&apos;s parameters, all-gathers them
            before compute and reduce-scatters the gradients after{' '}
            <Cite tier={1} href={FULLY_SHARD_BEHAVIOUR} kind="code">
              fully_shard docstring L117-L123
            </Cite>
            , with DTensor (PyTorch&apos;s distributed tensor), one logical tensor sharded or replicated across a
            device mesh{' '}
            <Cite tier={1} href={DTENSOR_DEF}>
              DTensor docs L30-L38
            </Cite>
            . Megatron Core describes itself as &quot;a composable library with GPU-optimized building blocks for
            custom training frameworks&quot;{' '}
            <Cite tier={1} href={MG_ABOUT}>
              Megatron README L16-L22
            </Cite>
            . DeepSpeed implements ZeRO (Zero Redundancy Optimizer) stages set in a JSON configuration{' '}
            <Cite tier={1} href={DS_STAGE} kind="code">
              DeepSpeed zero/config.py L95-L100
            </Cite>
            , a pipeline engine and Ulysses sequence parallelism.
          </Box>
          <Box variant="p">
            A front end picks the degrees, the recipe and the launcher, and calls an engine. TorchTitan composes PyTorch&apos;s FSDP2 with TP (tensor parallelism), PP (pipeline parallelism), CP (context
            parallelism) and EP (expert parallelism){' '}
            <Cite tier={1} href={TT_FEATURES}>
              TorchTitan README L130-L134
            </Cite>
            ; TorchTitan Neuron is AWS&apos;s fork of it for Trainium{' '}
            <Cite tier={1} href={TTN_FORK_POINT}>
              About TorchTitan Neuron L50-L56
            </Cite>
            . Megatron-LM is &quot;a reference example that includes Megatron Core plus pre-configured training
            scripts&quot;{' '}
            <Cite tier={1} href={MG_ABOUT}>
              Megatron README L16-L22
            </Cite>
            , and Megatron Bridge runs its loop on Megatron Core and converts Hugging Face checkpoints both
            ways{' '}
            <Cite tier={1} href={BR_OVERVIEW}>
              Megatron Bridge README L68-L72
            </Cite>
            . NeMo AutoModel composes PyTorch&apos;s FSDP2, HSDP (hybrid sharded data parallel), TP, CP, SP (sequence
            parallelism) and PP{' '}
            <Cite tier={1} href={AM_PARALLEL}>
              AutoModel README L165
            </Cite>
            . Accelerate configures DDP (Distributed Data Parallel), FSDP1, FSDP2 or DeepSpeed{' '}
            <Cite tier={1} href={AC_PARALLELISM} kind="code">
              Accelerate parallelism_config.py L34-L76
            </Cite>{' '}
            and a Megatron-LM plugin{' '}
            <Cite tier={1} href={AC_MEGATRON}>
              Accelerate Megatron-LM guide L26
            </Cite>
            , and the transformers Trainer runs on Accelerate{' '}
            <Cite tier={1} href={TF_ACCELERATE} kind="code">
              training_args.py L1811-L1814
            </Cite>
            . At the bottom of the map sit three projects that ended or moved: NVIDIA/NeMo, torchtune and NxD
            (NeuronX Distributed) Training.
          </Box>
          <FrameworkMapDiagram />
          <Box variant="p">
            Post-training frameworks follow the pattern: every one read in this research reuses an engine, NeMo RL
            (reinforcement learning) through a DTensor or a Megatron Bridge backend{' '}
            <Cite tier={1} href={NEMO_RL_BACKENDS}>
              NeMo RL README L87-L88
            </Cite>
            , and Axolotl through FSDP2 or DeepSpeed{' '}
            <Cite tier={1} href={AXOLOTL}>
              Axolotl README L102
            </Cite>
            (section 16, Fine-Tuning &amp; Post-Training Runs).
          </Box>
          <ExpandableSection headerText="Where the split into engines and front ends comes from, and where Nanotron fits">
            <SpaceBetween size="s">
              <Box variant="p">
                No single source states the split; it is our reading of how each project describes itself, cited
                above. Two details support it: Megatron Bridge pins Megatron Core as a git submodule{' '}
                <Cite tier={1} href={BR_SUBMODULE}>
                  Bridge README L100
                </Cite>
                , and its support matrix lists Bridge as Megatron-based, AutoModel as DTensor-based and NeMo RL as a
                post-training library with both backends{' '}
                <Cite tier={1} href={BR_MATRIX}>
                  Bridge README L79-L81
                </Cite>
                .
              </Box>
              <Box variant="p">
                Nanotron enters only as the code behind Hugging Face&apos;s Ultra-Scale Playbook, which calls it
                &quot;a production training codebase used at Hugging Face&quot;{' '}
                <Cite tier={3} href={PLAYBOOK}>
                  Ultra-Scale Playbook
                </Cite>{' '}
                <Cite tier={1} href={NANOTRON}>
                  Nanotron v0.5
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
            description="Translate a sharding setting before you compare two frameworks' memory numbers: ZeRO's three stages carry a different name in each engine, and DeepSpeed and Megatron leave sharding off unless you set it"
          >
            One idea, four names
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            ZeRO splits the model state across the DP (data parallelism) ranks in three stages: stage 1 splits the
            optimizer state, stage 2 the gradients as well, stage 3 the weights as well. Section 8, Data Parallelism
            &amp; Sharding, prices each stage. Each engine exposes the stages under its own name, and Megatron&apos;s
            FSDP documentation states the mapping: its sharding strategy &quot;supports DDP, ZeRO-1 (optimizer),
            ZeRO-2 (optimizer and gradients), and ZeRO-3 (optimizer, gradients, and parameters)&quot;{' '}
            <Cite tier={1} href={MG_FSDP_MAP}>
              megatron_fsdp.md L435
            </Cite>
            .
          </Box>
          <FrameworkTable headers={['What is split', 'DeepSpeed', 'Megatron', 'PyTorch']} rows={zeroRows} />
          <Box variant="p">
            Megatron&apos;s distributed optimizer is the stage 1 row by our arithmetic of its own table: with BF16
            (bfloat16) parameters and FP32 (32-bit floating point) gradients it holds 6 + 12/d bytes per parameter
            against 18 without it, for d data-parallel ranks, so only the optimizer&apos;s 12 bytes are divided{' '}
            <Cite tier={1} href={MG_DIST_OPT_TABLE}>
              dist_optimizer.md L16-L19
            </Cite>
            . Two of the four names start switched off, DeepSpeed&apos;s <code>stage</code> and Megatron&apos;s
            distributed optimizer, so a memory figure quoted for either says nothing until it names the stage.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pin each framework at a tag and read its own words about stability before its feature list: the PyTorch-native stack rests on APIs labelled alpha, experimental and prototype, and three projects on this map have ended or moved"
          >
            Read the maturity label before the feature list
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every project here states how far to trust its APIs, and that statement belongs in the specification you
            pin. PyTorch labels DTensor &quot;alpha&quot;{' '}
            <Cite tier={1} href={DTENSOR_ALPHA}>
              DTensor docs L9
            </Cite>
            , <code>torch.distributed.pipelining</code> &quot;alpha&quot;{' '}
            <Cite tier={1} href={PIPELINING_ALPHA}>
              pipelining docs L9
            </Cite>
            , its tensor-parallel APIs &quot;experimental and subject to change&quot;{' '}
            <Cite tier={1} href={TP_EXPERIMENTAL}>
              tensor parallel docs L12
            </Cite>
            , <code>context_parallel</code> &quot;a prototype feature&quot;{' '}
            <Cite tier={1} href={CP_PROTOTYPE} kind="code">
              _attention.py L1573-L1575
            </Cite>{' '}
            and DCP (PyTorch Distributed Checkpoint) <code>async_save</code> &quot;experimental&quot;{' '}
            <Cite tier={1} href={ASYNC_SAVE} kind="code">
              state_dict_saver.py L228-L237
            </Cite>
            . The <code>fully_shard</code> page carries no such label and directs FSDP1 users to migrate{' '}
            <Cite tier={1} href={FULLY_SHARD_DOC}>
              fully_shard docs L1-L13
            </Cite>
            .
          </Box>
          <Box variant="p">
            TorchTitan pins each stable release to &quot;the nightly versions of{' '}
            <code>torch</code> and <code>torchao</code> it was validated against&quot;{' '}
            <Cite tier={1} href={TT_PIN}>
              TorchTitan README L220-L221
            </Cite>
            : pin the release and install the nightlies it names. TorchTitan Neuron forked from an upstream commit of
            2026-07-08{' '}
            <Cite tier={1} href="https://github.com/pytorch/torchtitan/commit/7cdf0aa9f9788ed39521edb192e0dcd2815a374e">
              torchtitan commit 7cdf0aa9
            </Cite>
            , before v0.4.0 shipped on 2026-10-28: check an upstream change against the fork before relying on it
            (our reading of the dates){' '}
            <Cite tier={1} href={TTN_FORK}>
              torchtitan-neuron release-2.33.0
            </Cite>
            .
          </Box>
          <FrameworkTable headers={['Framework', 'Version to pin', 'Its own words', 'Best fit (our reading)']} rows={maturityRows} />
          <Box variant="p">
            Three projects on the map have ended or moved. The NVIDIA/NeMo repository at v3.0.0 says it &quot;has
            pivoted to focus on audio, speech, and multimodal LLM&quot;{' '}
            <Cite tier={1} href={NEMO_SPEECH}>
              NeMo README L10-L33
            </Cite>
            , and its LLM training moved to Megatron Bridge, AutoModel and NeMo RL, which Bridge&apos;s README lists
            side by side{' '}
            <Cite tier={1} href={BR_MATRIX}>
              Bridge README L79-L81
            </Cite>
            ; read NeMo 2 tutorials as history (our reading). torchtune &quot;is no longer actively
            maintained&quot;{' '}
            <Cite tier={1} href={TORCHTUNE}>
              torchtune README L4
            </Cite>
            . NxD Training &quot;reached end-of-support as of Neuron 2.32&quot;{' '}
            <Cite tier={1} href={NXDT_EOS}>
              NxD Training archive L23-L25
            </Cite>
            , and AWS recommends &quot;native PyTorch with standard distributed primitives (DTensor, FSDP, DDP) and
            TorchTitan&quot; in its place{' '}
            <Cite tier={1} href={NEURON_RECOMMENDS}>
              Neuron maintenance announcement L12
            </Cite>
            ; section 27, Trainium: The Neuron Path, follows that route.
          </Box>
          <ExpandableSection headerText="NeMo's pivot in its own repository">
            <Box variant="p">
              At v3.0.0 the NVIDIA/NeMo README is titled &quot;NVIDIA NeMo Speech&quot;{' '}
              <Cite tier={1} href={NEMO_SPEECH}>
                NeMo README L10-L33
              </Cite>
              , and its collections are <code>asr</code>, <code>audio</code>, <code>common</code>,{' '}
              <code>speechlm2</code> and <code>tts</code>{' '}
              <Cite tier={1} href={NEMO_COLLECTIONS}>
                nemo/collections at v3.0.0
              </Cite>
              .
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Match the parallelism and the precision you need against what each framework implements at its tag: FP8 on H100 runs through Transformer Engine, and TorchTitan v0.4.0 removed its legacy Float8 path"
          >
            What each engine implements, and in which precision
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Precision is gated twice, by the silicon and by the framework version: MXFP8 (microscaled FP8) needs
            Blackwell or Trainium3 wherever it is documented, and FP8 on H100 comes from Transformer Engine (our
            reading of the rows below).
          </Box>
          <FrameworkTable headers={['Framework', 'Parallelism and pipeline schedules', 'Training precision']} rows={implRows} />
          <Box variant="p">
            DeepSpeed&apos;s configuration has no FP8 switch: FP8 comes from Transformer Engine layers in the model,
            and no full-model FP8 recipe for DeepSpeed was located in this research.
          </Box>
          <ExpandableSection headerText="DeepSpeed's FP8 test">
            <Box variant="p">
              DeepSpeed&apos;s own test suite trains a Transformer Engine linear layer under <code>fp8_autocast</code>{' '}
              at ZeRO stages 0, 1, 2 and 3 on Hopper or later and checks that the losses match{' '}
              <Cite tier={1} href={DS_FP8_TEST} kind="code">
                test_fp8.py L20-L98
              </Cite>
              . A one-layer test shows that the two compose.
            </Box>
          </ExpandableSection>
          <Box variant="p">
            Megatron Core&apos;s pipeline schedules are 1F1B, interleaved and a combined 1F1B in which &quot;the forward
            pass of Transformer layers for one micro-batch runs in parallel with the backward pass of another&quot;{' '}
            <Cite tier={1} href={MG_COMBINED_1F1B} kind="code">
              combined_1f1b.py L55-L58
            </Cite>
            ; no Zero Bubble or DualPipe schedule by name was found in its pipeline-schedule code, where PyTorch and
            DeepSpeed both ship
            DualPipeV. Its MoE all-to-all overlap flags are off by default{' '}
            <Cite tier={1} href={MG_MOE_DEFAULTS}>
              MoE README L563-L564
            </Cite>
            ; section 12, Mixture of Experts: Expert Parallelism, sets them.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Decide a Megatron TP, PP or EP change before the checkpoint is written: PyTorch reshards at load, DeepSpeed converts after the fact, and Megatron's default optimizer state reshards only across data-parallel ranks"
          >
            Resharding: three engines, three meanings
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Resharding is loading a checkpoint saved under one layout or rank count into another, which a run needs
            whenever it changes its node count or a parallelism degree. Each engine does it its own way.
          </Box>
          <Box variant="p">
            <strong>PyTorch reshards at load.</strong> DCP &quot;handles load-time resharding which enables saving in
            one cluster topology and loading into another&quot;, writing at least one file per rank{' '}
            <Cite tier={1} href={DCP_DOC}>
              DCP docs L9-L14
            </Cite>
            . TorchTitan and AutoModel save through it, and both also write Hugging Face safetensors{' '}
            <Cite tier={1} href={TT_HF}>
              TorchTitan README L161
            </Cite>{' '}
            <Cite tier={1} href={AM_CKPT}>
              AutoModel README L174
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>DeepSpeed reshards after the fact.</strong> Its flow is to &quot;save a regular DeepSpeed ZeRO
            checkpoint, convert that checkpoint to Universal format, then load it with{' '}
            <code>checkpoint.load_universal</code> enabled&quot;, using <code>ds_to_universal.py</code>{' '}
            <Cite tier={1} href={DS_UNIVERSAL}>
              universal-checkpointing L21-L47
            </Cite>
            . The older path is retired: &quot;ZeRO-3 elastic checkpointing is no longer supported&quot;{' '}
            <Cite tier={1} href={DS_ELASTIC} kind="code">
              zero/config.py L158-L162
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Megatron reshards weights freely and optimizer state only across DP.</strong> A checkpoint saved
            under one tensor, pipeline or data-parallel configuration loads under another{' '}
            <Cite tier={1} href={MG_DIST_CKPT_RESHARD}>
              dist_checkpointing.md L17-L20
            </Cite>
            , but the distributed optimizer&apos;s default <code>dp_reshardable</code> format &quot;allows checkpoint
            resharding only in DP dimension&quot;{' '}
            <Cite tier={1} href={MG_DP_ONLY} kind="code">
              distrib_optimizer.py L1596-L1602
            </Cite>
            . The fully reshardable format is opt-in, a field documented as &quot;(TP/PP/EP/DP)&quot; that defaults to{' '}
            <code>False</code>{' '}
            <Cite tier={1} href={MG_FULLY_RESHARDABLE} kind="code">
              training_config.py L659-L660
            </Cite>
            , and slower to save than the default{' '}
            <Cite tier={1} href={MG_DIST_CKPT_FORMATS}>
              dist_checkpointing.md L102-L110
            </Cite>
            . A node-count change that keeps TP and PP is a data-parallel change and loads from the default format. A
            TP or PP change on a <code>dp_reshardable</code> checkpoint stops the load with an error{' '}
            <Cite tier={1} href={MG_CKPT_TP_PP_ERROR} kind="code">
              checkpointing.py L2904-L2914
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="The documented workflow and what the load code checks">
            <SpaceBetween size="s">
              <Box variant="p">
                Megatron&apos;s checkpointing guide describes a workflow in which you stop training, change the model
                parallelism, and &quot;Resume training with <code>--dist-ckpt-optim-fully-reshardable</code>&quot;{' '}
                <Cite tier={1} href={MG_DIST_CKPT_WORKFLOW} kind="doc-code-conflict">
                  dist_checkpointing.md L112-L121
                </Cite>
                . The load path reads the format from the checkpoint&apos;s own metadata, which the save wrote as{' '}
                <code>fully_reshardable</code> or <code>dp_reshardable</code>{' '}
                <Cite tier={1} href={MG_CKPT_SAVE_FORMAT} kind="code">
                  checkpointing.py L620-L627
                </Cite>
                , and raises <code>RuntimeError</code> when TP or PP changed and that recorded format is not fully
                reshardable{' '}
                <Cite tier={1} href={MG_CKPT_TP_PP_ERROR} kind="code">
                  L2904-L2914
                </Cite>
                . The flag at resume therefore decides what the next save writes; this load still reads the format
                recorded at save time (our reading of the code).
              </Box>
              <Box variant="p">
                The error ends with &quot;Please use <code>--ckpt-fully-parallel-save</code> flag during checkpoint
                saving.&quot;, a flag whose help text now reads &quot;Deprecated: see
                --no-ckpt-fully-parallel-save.&quot;{' '}
                <Cite tier={1} href={MG_DEPRECATED_FLAG} kind="code">
                  arguments.py L2979-L2981
                </Cite>
                . The code&apos;s other optimizer load error, raised when a GPT checkpoint loads into a hybrid model,
                names the working flag,{' '}
                <code>--dist-ckpt-optim-fully-reshardable</code>, or <code>--no-load-optim</code> &quot;to start from a
                fresh optimizer&quot;{' '}
                <Cite tier={1} href={MG_CKPT_OTHER_ERROR} kind="code">
                  checkpointing.py L2894-L2903
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            So on Megatron, save with <code>--dist-ckpt-optim-fully-reshardable</code> before any planned TP, PP or EP
            change, and return to the faster default afterwards. A checkpoint already written as{' '}
            <code>dp_reshardable</code> resumes under a new TP or PP only with <code>--no-load-optim</code>, which skips
            the optimizer state{' '}
            <Cite tier={1} href={MG_NO_LOAD_OPTIM} kind="code">
              checkpointing.py L2864-L2872
            </Cite>{' '}
            and starts a fresh optimizer.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Write down the defaults that differ between front ends, and check what the AWS images carry before you pin: Accelerate starts on FSDP1, the Trainer on FSDP2, and the AWS PyTorch container sits one minor version behind this dive's PyTorch pin"
          >
            Configuration, launchers and the AWS images
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Two front ends disagree on a default for the same plugin. Accelerate&apos;s FSDP plugin defaults <code>fsdp_version</code> to 1{' '}
            <Cite tier={1} href={AC_FSDP_VERSION} kind="code">
              dataclasses.py L1591-L1593
            </Cite>
            , read from <code>FSDP_VERSION</code> when unset{' '}
            <Cite tier={1} href={AC_FSDP_ENV} kind="code">
              L1830-L1831
            </Cite>
            , while the transformers Trainer passes <code>{'fsdp_config.get("version", 2)'}</code> to the same
            plugin{' '}
            <Cite tier={1} href={TF_FSDP_V2} kind="code">
              training_args.py L2780
            </Cite>
            . By our reading of the two defaults, the same settings run FSDP1 under <code>accelerate launch</code> and
            FSDP2 under the Trainer: write the version down.
          </Box>
          <Box variant="p">
            Accelerate&apos;s <code>ParallelismConfig</code> docstring calls <code>cp_size</code> &quot;Currently not
            supported&quot;{' '}
            <Cite tier={1} href={AC_CP_DOCSTRING} kind="doc-code-conflict">
              parallelism_config.py L52-L53
            </Cite>
            , while the code runs context parallelism on its torch backend when <code>cp_size</code> is above 1 and
            otherwise logs &quot;Context parallel training is not enabled&quot; once and runs without it{' '}
            <Cite tier={1} href={AC_CP_CODE} kind="code">
              accelerator.py L4200-L4215
            </Cite>
            : check the log for that line.
          </Box>
          <FrameworkTable headers={['Framework', 'Configuration and launcher', 'In the AWS images and samples']} rows={configRows} />
          <Box variant="p">
            AWS&apos;s PyTorch 2.14 DLC (Deep Learning Container) for EC2 (Elastic Compute Cloud) lists{' '}
            <code>torch==2.14.0</code> and <code>deepspeed==0.19.6</code> among its direct dependencies{' '}
            <Cite tier={1} href={DLC_DEPS} kind="code">
              DLC pyproject.toml L5-L10
            </Cite>
            , and its build configuration sets Transformer Engine 2.18.0{' '}
            <Cite tier={1} href={DLC_BUILD} kind="code">
              2.14-ec2-cuda.yml L20-L25
            </Cite>
            . Each sits behind this dive&apos;s pins (PyTorch v2.15.0, DeepSpeed v0.19.9, Transformer Engine v2.21.0):
            re-read a default at the image&apos;s version before you rely on it there. On Trainium, the image is a
            Neuron DLAMI (Deep Learning AMI, an Amazon Machine Image), from which NxD Training has been left out since
            Neuron 2.31.0{' '}
            <Cite tier={1} href={NEURON_DLAMI_NXDT}>
              DLAMI release notes L74
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Answer three questions and get the engine, the front end and the version to pin, then size the layout in section 14"
          >
            Three questions that pick an engine and a front end
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The three engines answer most of the choice: the questions below pick one, name the front end over it and
            say what to check first.
          </Box>
          <ExpandableSection headerText="Four defaults that change a result, owned by other sections">
            <Box variant="p">
              TorchTitan v0.4.0 removed legacy Float8 (section 6, Precision for Training); FSDP2 and TorchTitan
              synchronise gradients on every micro-batch by default (section 8, Data Parallelism &amp; Sharding);
              Megatron&apos;s distributed optimizer is off by default (section 14, Set My Ranks); and Megatron turns{' '}
              <code>--async-save</code> off with a warning unless <code>--use-persistent-ckpt-worker</code> is set{' '}
              <Cite tier={1} href={MG_ASYNC_SAVE} kind="code">
                arguments.py L1808-L1814
              </Cite>{' '}
              (section 18, Checkpointing).
            </Box>
          </ExpandableSection>
          <StackChooser />
          <Box variant="p">
            Pin the versions the chooser names, then take the degrees to section 14, Set My Ranks, and measure the two
            or three layouts that pass.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
