import { useRef } from 'react';
import type { CSSProperties } from 'react';
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
  DEEPSPEED_TAG,
  MEGATRON_TAG,
  PYTORCH_TAG,
  TORCHTITAN_TAG,
} from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import { DENSE_MODELS, INSTANCES, rankFacts, shapeOf } from '../lib/presets';
import { evaluateLayout, type Layout, type LinkLoad, type ParallelismInput } from '../lib/parallelism';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** The Llama 3 Herd of Models: Sec 3.3.1 (servers, network), 3.3.2 (Table 4, Figure 5, nesting, CP), 3.3.3. */
const LLAMA3 = arxiv('2407.21783v3');
/** Narayanan et al., Megatron-LM on GPU clusters (PTD-P), SC 2021: Sec 1, 3.2, 3.3, 4.1, 5.2 and Table 2. */
const PTDP = arxiv('2104.04473v5');
/** TorchTitan paper: Sec 3.3.1 to 3.3.4 (scaling guidance), Tables 3 and 4. */
const TT_PAPER = arxiv('2410.06511v3');
/** DeepSeek-V3 Technical Report: Sec 3.1 (cluster), 3.2 (layout), 3.2.1 (1:1 ratio), 3.2.2 (node-limited dispatch). */
const DSV3 = arxiv('2412.19437v2');

/** PyTorch v2.15.0 DeviceMesh: an n-d array of ranks, communication per mesh dimension. */
const PT_MESH_DOC = gh('pytorch/pytorch', PYTORCH_TAG, 'torch/distributed/device_mesh.py', 'L190-L196');
/** PyTorch v2.15.0 init_device_mesh example: mesh_shape=(2, 8), mesh_dim_names=("dp", "tp"). */
const PT_MESH_EXAMPLE = gh('pytorch/pytorch', PYTORCH_TAG, 'torch/distributed/device_mesh.py', 'L1688');
/** PyTorch v2.15.0 default mesh layout: strides from the suffix product of the shape (row-major). */
const PT_MESH_LAYOUT = gh('pytorch/pytorch', PYTORCH_TAG, 'torch/distributed/_mesh_layout.py', 'L291-L301');

/** TorchTitan v0.4.0: the dense mesh unflattened as (pp, dp_replicate, dp_shard, cp, tp). */
const TT_MESH = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/distributed/parallelism_context.py', 'L319-L323');
/** TorchTitan v0.4.0: dp_replicate is the DDP or HSDP replicate axis; FSDP shards along dp_shard. */
const TT_AXES = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/distributed/parallelism_context.py', 'L257');
/** TorchTitan v0.4.0 benchmark document (end of 2024): hardware, Tables 1, 3, 4 and 5, versions. */
function ttBench(lines: string): string {
  return gh('pytorch/torchtitan', TORCHTITAN_TAG, 'docs/benchmarks/llama3_h100_202412_torchtitan.md', lines);
}

/** Megatron Core core_v0.20.0 rank generator: default order, stride rule, adjacency note, stale docstring. */
function megatronPs(lines: string): string {
  return gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/parallel_state.py', lines);
}
/** DeepSpeed v0.19.9 pipeline topology: row-major over pipe, data, model. */
function dsTopo(lines: string): string {
  return gh('deepspeedai/DeepSpeed', DEEPSPEED_TAG, 'deepspeed/runtime/pipe/topology.py', lines);
}
/** torchrun (PyTorch elastic agent): each node's workers get a contiguous block of global ranks. */
const TORCHRUN_RANKS = gh('pytorch/pytorch', PYTORCH_TAG, 'torch/distributed/elastic/agent/server/api.py', 'L618-L683');
/** DeepSpeed launcher: ranks numbered node by node in hostfile order. */
const DS_LAUNCH = gh('deepspeedai/DeepSpeed', DEEPSPEED_TAG, 'deepspeed/launcher/launch.py', 'L160-L168');
/** Slurm srun manual page (current documentation; SchedMD does not version it by URL). */
const SRUN = 'https://slurm.schedmd.com/srun.html';
/** AWS accelerated computing instance specifications (p5.48xlarge: 8 H100, 3,200 Gigabit with EFA). */
const EC2_ACCEL = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';
/** NVIDIA NVLink specifications: 900 GB/s per GPU for Hopper, in a table that calls its newest figure bidirectional. */
const NVLINK_PAGE = 'https://www.nvidia.com/en-us/data-center/nvlink/';

/* ------------------------------------------------------------------------ */
/* Worked layout from Calculator C (src/lib/parallelism.ts, section 14)     */
/* ------------------------------------------------------------------------ */

const P5 = INSTANCES['p5.48xlarge'];
const FACTS = rankFacts(P5);

/** 02 section 3.2, as in section 10: Llama 3.1 70B on 32 p5.48xlarge, 512 sequences of 8,192 tokens, 6N compute, 34 sbh. */
const WORKED_INPUT: ParallelismInput = {
  model: shapeOf(DENSE_MODELS['llama-3.1-70b']),
  instance: P5,
  instanceCount: 32,
  sequenceLength: 8_192,
  globalBatch: { sequences: 512 },
  attention: 'none',
  activations: { sbhPerLayer: 34 },
};

/** The thesis layout: TP 8 x PP 4 (five interleaved chunks) x DP 8 with ZeRO-1, micro-batch 1, no recomputation. */
const WORKED_LAYOUT: Layout = {
  tp: 8,
  cp: 1,
  pp: 4,
  dp: 8,
  interleavedChunks: 5,
  sharding: 'zero1',
  microBatch: 1,
  recompute: 'none',
  gradientSync: 'oncePerStep',
};

const WORKED = evaluateLayout(WORKED_INPUT, WORKED_LAYOUT);

function linkOf(dimension: LinkLoad['dimension']): LinkLoad {
  const found = WORKED.links.find((l) => l.dimension === dimension);
  if (!found) throw new Error(`Calculator C returned no ${dimension} load for the worked layout`);
  return found;
}

const TP_LOAD = linkOf('TP');
const PP_LOAD = linkOf('PP');
const DP_LOAD = linkOf('DP');

/**
 * Bytes one GPU sends per step. A per-instance load from a group with one member per instance
 * (DP here: each DP group takes one GPU from each of eight instances) is the eight GPUs' sum.
 */
function perGpuBytes(l: LinkLoad): number {
  return l.basis === 'per instance' ? l.bytesPerStep / FACTS.ranksPerInstance : l.bytesPerStep;
}

const LAYERS_PER_STAGE = WORKED_INPUT.model.layers / WORKED_LAYOUT.pp;
const MICRO_BATCHES = WORKED.microBatchesPerStep;
/** Megatron TP: two all-reduces forward and two backward per layer per micro-batch (2104.04473v5 Sec 3.2). */
const TP_COLLECTIVES_PER_STEP = 4 * LAYERS_PER_STAGE * MICRO_BATCHES;
const TP_GB = perGpuBytes(TP_LOAD) / 1e9;
const PP_GB = perGpuBytes(PP_LOAD) / 1e9;
const DP_GB = perGpuBytes(DP_LOAD) / 1e9;
const DP_INSTANCE_GB = DP_LOAD.bytesPerStep / 1e9;
const COMPUTE_S = WORKED.computeSeconds;
/** The same TP bytes over each GPU's EFA share, as a TP group spread one GPU per instance would pay. */
const TP_ON_EFA_S = perGpuBytes(TP_LOAD) / FACTS.efaBytesPerSecondPerRank;
const MIN_RATIO = Math.min(TP_GB / PP_GB, TP_GB / DP_GB);
const RATIO_FLOOR = Math.floor(MIN_RATIO / 100) * 100;
/** Inputs to the arithmetic block. */
const TP_PER_LAYER_GB = TP_GB / (LAYERS_PER_STAGE * MICRO_BATCHES);
const PP_PER_SEND_MB = (perGpuBytes(PP_LOAD) / (2 * MICRO_BATCHES * WORKED_LAYOUT.interleavedChunks)) / 1e6;
const DP_SHARD_GB = (WORKED_INPUT.model.totalParameters / (WORKED_LAYOUT.tp * WORKED_LAYOUT.pp)) * 2 / 1e9;

const fmt0 = (x: number) => x.toLocaleString('en-US', { maximumFractionDigits: 0 });
const fmt1 = (x: number) => x.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const fmt2 = (x: number) => x.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (x: number, digits = 0) => `${(x * 100).toFixed(digits)}%`;

/* ------------------------------------------------------------------------ */
/* Diagram: Llama 3 405B's mesh as nested boxes                             */
/* ------------------------------------------------------------------------ */

interface MeshLevel {
  id: string;
  badge: string;
  stroke: string;
  fill: string;
  dashed?: boolean;
  wide: [string, string];
  narrow: [string, string];
  link: string;
}

/** Outermost first, as the boxes nest. Degrees from Llama 3 Table 4, 8,192-GPU row. */
const MESH_LEVELS: MeshLevel[] = [
  {
    id: 'dp',
    badge: 'DP 64',
    stroke: '#8b6c00',
    fill: '#fbf3d5',
    wide: [
      'Data parallelism: 64 copies of the pipeline inside',
      'FSDP all-gather of weights and reduce-scatter of gradients, prefetched ahead of use',
    ],
    narrow: ['64 copies of the pipeline', 'FSDP: gather weights, reduce gradients'],
    link: 'between servers',
  },
  {
    id: 'pp',
    badge: 'PP 16',
    stroke: '#6f4cc4',
    fill: '#efe7fb',
    wide: [
      'Pipeline parallelism: 16 stages, one server each',
      'Point-to-point send of activations forward and gradients back, every micro-batch',
    ],
    narrow: ['16 stages, one server each', 'sends activations, every micro-batch'],
    link: 'between servers',
  },
  {
    id: 'cp',
    badge: 'CP 1',
    stroke: '#1f7a70',
    fill: '#e6f4f2',
    dashed: true,
    wide: [
      'Context parallelism: 1 at 8,192 tokens, 16 at 131,072',
      'All-gather of keys and values in every attention layer, when it is on',
    ],
    narrow: ['1 at 8,192 tokens, 16 at 131,072', 'all-gathers keys and values'],
    link: 'off in this row',
  },
  {
    id: 'tp',
    badge: 'TP 8',
    stroke: '#0972d3',
    fill: '#f2f8fd',
    wide: [
      'Tensor parallelism: every layer split over 8 GPUs',
      'Four all-reduces (or reduce-scatter and all-gather pairs) per layer, every micro-batch',
    ],
    narrow: ['every layer split over 8 GPUs', '4 collectives per layer, each micro-batch'],
    link: 'NVLink inside the server',
  },
];

const MESH_NARROW_PX = 560;

function MeshNestDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, MESH_NARROW_PX);

  const W = narrow ? 400 : 900;
  const margin = narrow ? 6 : 16;
  const inset = narrow ? 7 : 18;
  const headerH = narrow ? 66 : 50;
  const top0 = narrow ? 72 : 56;
  const badgeW = narrow ? 54 : 78;
  const badgeH = narrow ? 24 : 30;
  const textX = narrow ? 68 : 102;
  const bottomPad = narrow ? 9 : 12;

  const n = MESH_LEVELS.length;
  const tpX = margin + (n - 1) * inset;
  const tpW = W - 2 * tpX;
  const gpuTop = top0 + n * headerH + (narrow ? 2 : 4);
  const gpuH = narrow ? 30 : 34;
  const gpuGap = narrow ? 7 : 12;
  const gpuW = narrow ? (tpW - 16 - 7 * gpuGap) / 8 : 60;
  const gpuRowW = 8 * gpuW + 7 * gpuGap;
  const gpuX0 = tpX + (tpW - gpuRowW) / 2;
  const serverLabelY = gpuTop + gpuH + (narrow ? 16 : 20);
  const tpBottom = serverLabelY + (narrow ? 10 : 14);
  const boxes = MESH_LEVELS.map((lvl, i) => {
    const x = margin + i * inset;
    const y = top0 + i * headerH;
    const bottom = tpBottom + (n - 1 - i) * bottomPad;
    return { lvl, x, y, w: W - 2 * x, h: bottom - y };
  });
  const H = boxes[0].y + boxes[0].h + (narrow ? 8 : 12);

  const ink = '#16191f';
  const muted = '#414d5c';
  const font = 'sans-serif';

  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="composing-mesh-title"
        aria-describedby="composing-mesh-desc"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <title id="composing-mesh-title">
          Llama 3 405B&apos;s layout on 8,192 GPUs, TP 8 x CP 1 x PP 16 x DP 64, drawn as a device
          mesh of nested boxes. Tensor parallelism is the innermost axis: eight GPUs of one server,
          joined by NVLink, with four collectives in every layer on every micro-batch. Context
          parallelism is next, off at 8,192 tokens. Pipeline parallelism makes 16 stages of one
          server each, sending activations between servers on every micro-batch. Data parallelism
          is outermost: 64 copies of the pipeline whose FSDP gathers and gradient reductions cross
          between servers and are prefetched ahead of use.
        </title>
        <desc id="composing-mesh-desc">
          The degrees multiply to the world size, 8 x 1 x 16 x 64 = 8,192. One server holds the same
          eight GPUs as one p5.48xlarge.
        </desc>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />

        {narrow ? (
          <>
            <text x={margin + 2} y={20} fill={ink} fontSize={14} fontWeight={600} fontFamily={font}>
              Llama 3 405B on 8,192 GPUs, 43% MFU
            </text>
            <text x={margin + 2} y={39} fill={ink} fontSize={12.5} fontFamily={font}>
              TP 8 x CP 1 x PP 16 x DP 64 = 8,192
            </text>
            <text x={margin + 2} y={57} fill={muted} fontSize={11.5} fontFamily={font}>
              innermost axis inside one server
            </text>
          </>
        ) : (
          <>
            <text x={margin + 2} y={22} fill={ink} fontSize={14} fontWeight={600} fontFamily={font}>
              Llama 3 405B on 8,192 GPUs: TP 8 x CP 1 x PP 16 x DP 64 = 8,192, at 43% MFU
            </text>
            <text x={margin + 2} y={42} fill={muted} fontSize={11.5} fontFamily={font}>
              Each box is one axis of the mesh. The innermost stays inside one server; the axes
              around it cross between servers.
            </text>
          </>
        )}

        {boxes.map(({ lvl, x, y, w, h }) => (
          <g key={lvl.id}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx={6}
              fill={lvl.fill}
              stroke={lvl.stroke}
              strokeWidth={1.5}
              strokeDasharray={lvl.dashed ? '6 4' : undefined}
            />
            <rect x={x + (narrow ? 8 : 12)} y={y + (narrow ? 8 : 10)} width={badgeW} height={badgeH} rx={4} fill={lvl.stroke} />
            <text
              x={x + (narrow ? 8 : 12) + badgeW / 2}
              y={y + (narrow ? 8 : 10) + badgeH / 2 + (narrow ? 4.5 : 5)}
              fill="#ffffff"
              fontSize={narrow ? 13 : 14}
              fontWeight={700}
              fontFamily={font}
              textAnchor="middle"
            >
              {lvl.badge}
            </text>
            {narrow ? (
              <>
                <text x={x + textX} y={y + 20} fill={ink} fontSize={12} fontWeight={600} fontFamily={font}>
                  {lvl.narrow[0]}
                </text>
                <text x={x + textX} y={y + 37} fill={muted} fontSize={11.5} fontFamily={font}>
                  {lvl.narrow[1]}
                </text>
                <text x={x + textX} y={y + 54} fill={lvl.stroke} fontSize={11.5} fontWeight={700} fontFamily={font}>
                  {lvl.link}
                </text>
              </>
            ) : (
              <>
                <text x={x + textX} y={y + 22} fill={ink} fontSize={12.5} fontWeight={600} fontFamily={font}>
                  {lvl.wide[0]}
                </text>
                <text x={x + textX} y={y + 39} fill={muted} fontSize={11} fontFamily={font}>
                  {lvl.wide[1]}
                </text>
                <text
                  x={x + w - 14}
                  y={y + 22}
                  fill={lvl.stroke}
                  fontSize={11.5}
                  fontWeight={700}
                  fontFamily={font}
                  textAnchor="end"
                >
                  {lvl.link}
                </text>
              </>
            )}
          </g>
        ))}

        {Array.from({ length: 8 }, (_, g) => {
          const gx = gpuX0 + g * (gpuW + gpuGap);
          return (
            <g key={`gpu-${g}`}>
              <rect x={gx} y={gpuTop} width={gpuW} height={gpuH} rx={4} fill="#ffffff" stroke="#0972d3" strokeWidth={1.5} />
              <text
                x={gx + gpuW / 2}
                y={gpuTop + gpuH / 2 + 4.5}
                fill={ink}
                fontSize={12.5}
                fontWeight={600}
                fontFamily={font}
                textAnchor="middle"
              >
                {narrow ? `${g}` : `GPU ${g}`}
              </text>
            </g>
          );
        })}
        <text
          x={W / 2}
          y={serverLabelY}
          fill={muted}
          fontSize={11.5}
          fontFamily={font}
          textAnchor="middle"
        >
          {narrow
            ? 'one server: 8 H100s, as in one p5.48xlarge'
            : 'One server: 8 H100 GPUs on NVLink, the same eight-GPU domain as one p5.48xlarge'}
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

const LLAMA3_ROWS: Array<{ gpus: string; seq: string; layout: string; mfu: string }> = [
  { gpus: '8,192', seq: '8,192', layout: 'TP 8 x CP 1 x PP 16 x DP 64', mfu: '43%' },
  { gpus: '16,384', seq: '8,192', layout: 'TP 8 x CP 1 x PP 16 x DP 128', mfu: '41%' },
  { gpus: '16,384', seq: '131,072', layout: 'TP 8 x CP 16 x PP 16 x DP 8', mfu: '38%' },
];

function Llama3Rows() {
  return (
    <ul>
      {LLAMA3_ROWS.map((r) => (
        <li key={r.layout}>
          <strong>{r.gpus} GPUs</strong>, {r.seq}-token sequences: {r.layout}, {r.mfu} MFU
        </li>
      ))}
    </ul>
  );
}

function PerLevelTable() {
  const rows = [
    {
      axis: `TP ${WORKED_LAYOUT.tp}`,
      what: `4 collectives per layer, every micro-batch: ${fmt0(TP_COLLECTIVES_PER_STEP)} per step`,
      link: 'NVLink, 450 GB/s per GPU',
      per: `${fmt0(TP_GB)} GB, ${fmt2(TP_LOAD.seconds)} s (${pct(TP_LOAD.shareOfCompute)})`,
    },
    {
      axis: `PP ${WORKED_LAYOUT.pp}, v ${WORKED_LAYOUT.interleavedChunks}`,
      what: 'Activations and gradients across each stage boundary, every micro-batch and chunk',
      link: 'EFA, 50 GB/s per GPU',
      per: `${fmt1(PP_GB)} GB, ${fmt2(PP_LOAD.seconds)} s (${pct(PP_LOAD.shareOfCompute, 1)})`,
    },
    {
      axis: `DP ${WORKED_LAYOUT.dp}, ZeRO-1`,
      what: 'Gradient reduce-scatter and parameter all-gather, once per step',
      link: 'EFA, one member per instance: 50 GB/s per GPU',
      per: `${fmt1(DP_GB)} GB, ${fmt2(DP_LOAD.seconds)} s (${pct(DP_LOAD.shareOfCompute, 1)})`,
    },
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>Axis</th>
            <th style={headCell}>What it sends</th>
            <th style={headCell}>Link</th>
            <th style={headCell}>Per GPU per step (share of compute)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.axis}>
              <td style={cell}>
                <strong>{r.axis}</strong>
              </td>
              <td style={cell}>{r.what}</td>
              <td style={cell}>{r.link}</td>
              <td style={cell}>{r.per}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const ORDER_ROWS: Array<{ source: string; order: string; outermost: string }> = [
  { source: 'Llama 3 405B', order: 'TP, CP, PP, DP', outermost: 'DP' },
  { source: 'Megatron Core default', order: 'TP, CP, EP, DP, PP', outermost: 'PP' },
  { source: 'TorchTitan mesh', order: 'TP, CP, DP shard, DP replicate, PP', outermost: 'PP' },
  { source: 'DeepSpeed pipeline topology', order: 'model (TP), data, pipe', outermost: 'PP' },
];

function OrderTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>Source</th>
            <th style={headCell}>Innermost to outermost</th>
            <th style={headCell}>Outermost</th>
          </tr>
        </thead>
        <tbody>
          {ORDER_ROWS.map((r) => (
            <tr key={r.source}>
              <td style={cell}>{r.source}</td>
              <td style={cell}>{r.order}</td>
              <td style={cell}>{r.outermost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function ComposingLayouts() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={`Read any published training layout as a grid of ranks whose innermost axis stays inside one instance: for Llama 3.1 70B on 32 p5.48xlarge, tensor parallelism sends about ${fmt1(TP_GB / 1000)} TB per GPU per step, more than ${RATIO_FLOOR} times either dimension that crosses between instances (papers, Megatron Core core_v0.20.0, TorchTitan v0.4.0, DeepSpeed v0.19.9 and PyTorch v2.15.0, read 2026-10-31)`}
          >
            13. Composing the Dimensions
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A frontier training run uses several parallelisms at once. Llama 3 405B trained on 8,192
            GPUs as TP (tensor parallelism, splitting every layer&apos;s matrices) 8 x CP (context
            parallelism, splitting each sequence) 1 x PP (pipeline parallelism, splitting the layers
            into stages) 16 x DP (data parallelism, copies of the model on different data) 64, at 43%
            MFU (model FLOPs utilization: the share of peak floating-point operations, FLOPs, that a
            run achieves){' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Table 4
            </Cite>
            . Sections 8 to 12 price each dimension alone. Composing them raises one more question:
            which of them shares an instance.
          </Box>
          <Box variant="p">
            The challenge is placement. The same four degrees can put the dimension that talks most
            often on NVLink inside an instance, or on EFA (Elastic Fabric Adapter) between instances,
            nine times slower per GPU on a p5.48xlarge (section 7, Collectives &amp; What They Cost),
            and the order of the grid decides which. This section reads published layouts on that
            grid, so that any layout you meet reads as which link each dimension rides and why its
            degree was chosen.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Write any layout as a grid whose degrees multiply to the world size, and see that its rank order decides which axis lands inside an instance"
          >
            The device mesh: one axis per parallelism
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A rank is one training process driving one GPU; the world size is the number of ranks. A
            device mesh arranges the world&apos;s ranks as an n-dimensional array, one axis per
            parallelism, and runs each axis&apos;s communication separately{' '}
            <Cite tier={1} href={PT_MESH_DOC}>
              PyTorch device_mesh.py L190-L196
            </Cite>
            . Each degree is the length of its axis, so the degrees multiply to the world size: 8 x 1
            x 16 x 64 = 8,192 for Llama 3 (our arithmetic).
          </Box>
          <Box variant="p">
            A rank&apos;s coordinate holds one index per axis, and a group is the set of ranks whose
            coordinates differ in one axis only. Llama 3&apos;s report draws 16 GPUs as TP 2 x CP 2 x
            PP 2 x DP 2, where GPU 0 shares a TP group with GPU 1, a CP group with GPU 2, a PP group
            with GPU 4 and a DP group with GPU 8{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Figure 5
            </Cite>
            . Each parallelism&apos;s collective, the call through which a group exchanges data, runs
            inside its groups: TP&apos;s all-reduces among the GPUs of a TP group, in every layer and
            on every micro-batch (one slice of the step&apos;s batch).
          </Box>
          <Box variant="p">
            The order of the axes decides which ranks are neighbours. The meshes read here are
            row-major, so the last axis listed varies fastest. PyTorch&apos;s default mesh takes its
            strides from the suffix product of the shape, which is that layout{' '}
            <Cite tier={1} href={PT_MESH_LAYOUT} kind="code">
              PyTorch _mesh_layout.py L291-L301
            </Cite>
            , and its own example is{' '}
            <code>mesh_shape=(2, 8), mesh_dim_names=(&quot;dp&quot;, &quot;tp&quot;)</code>{' '}
            <Cite tier={1} href={PT_MESH_EXAMPLE}>
              PyTorch device_mesh.py L1688
            </Cite>
            . Launchers give each instance a consecutive block of ranks (section 7), so the
            fastest-varying axis, which this page calls the innermost, lands inside an instance; the
            first axis listed is the outermost. The diagram draws Llama 3&apos;s mesh, with its DP run
            as FSDP (Fully Sharded Data Parallel: data parallelism with the model state sharded across
            the DP ranks).
          </Box>
          <MeshNestDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. Degrees from Llama 3&apos;s 8,192-GPU row{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Table 4
            </Cite>
            ; Meta&apos;s server holds eight H100 GPUs joined by NVLink{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.1
            </Cite>
            , the GPU count of one p5.48xlarge{' '}
            <Cite tier={1} href={EC2_ACCEL}>
              AWS accelerated computing instance specifications
            </Cite>
            .
          </Box>
          <Box variant="p">
            Placement sets the price of every other axis. When the innermost axis fills the instance,
            as TP 8 fills a p5.48xlarge, each group of every other axis has one member per instance,
            and its traffic leaves through each GPU&apos;s 50 GB/s share of the instance&apos;s 3,200
            Gbps of EFA{' '}
            <Cite tier={1} href={EC2_ACCEL}>
              AWS accelerated computing instance specifications
            </Cite>
            . When it does not fill the instance, the next axis shares the instance as well, and a
            group with several members per instance is priced per instance over the whole 400 GB/s.
            Section 7 gives both counts, our reading of the NCCL (NVIDIA Collective Communications
            Library) documentation and an AWS sample.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read four published layouts as which link each axis rides and why its degree was chosen, from Llama 3 405B's TP 8 x CP 1 x PP 16 x DP 64 to DeepSeek-V3's grid with no tensor parallelism"
          >
            Published layouts, read on the grid
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Llama 3 405B.</strong> TP 8 is one server&apos;s NVLink domain, the eight GPUs of a
            p5.48xlarge, so 8,192 GPUs would be 1,024 p5.48xlarge (our arithmetic). Meta&apos;s table
            gives three layouts{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Table 4
            </Cite>
            :
          </Box>
          <Llama3Rows />
          <Box variant="p">
            Every row trains on 16M tokens per batch, which is 2,048 sequences at 8,192 tokens and
            128 at 131,072, so DP times the sequences per DP group is fixed: 64 x 32, 128 x 16 and 8
            x 16 (our arithmetic). Doubling the GPUs halved each DP group&apos;s share, and Meta
            attributes the fall from 43% to 41% to that smaller batch per DP group{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.2
            </Cite>
            . At 131,072 tokens CP 16 takes one GPU per server, since TP 8 fills the server (our
            reading of the grid), so its all-gathers of keys and values cross servers; Meta accepts
            their exposed latency because grouped-query attention (GQA) keeps keys and values much
            smaller than queries{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.2
            </Cite>
            . Meta explored its configurations with a memory-consumption estimator and a
            performance-projection tool{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.2
            </Cite>
            ; no release of either was located during this research.
          </Box>
          <Box variant="p">
            <strong>DeepSeek-V3.</strong> 2,048 H800 GPUs, eight per node on NVLink, with InfiniBand
            between nodes{' '}
            <Cite tier={3} href={DSV3} venue="preprint">
              DeepSeek-V3, Section 3.1
            </Cite>
            , laid out as PP 16, EP (expert parallelism, spreading a mixture-of-experts layer&apos;s
            experts over GPUs) 64 spanning 8 nodes, ZeRO-1 DP (stage 1 of the Zero Redundancy
            Optimizer, which shards optimizer state across the DP ranks), and no TP, which its memory
            optimizations made unnecessary{' '}
            <Cite tier={3} href={DSV3} venue="preprint">
              DeepSeek-V3, Section 3.2
            </Cite>
            . Its attention layers then run DP 2,048 / 16 = 128 and its expert layers EP 64 x 2 copies
            (our arithmetic; section 12, Mixture of Experts: Expert Parallelism, reads that second
            grid). An EP group of 64 fills eight whole nodes, so its all-to-all crosses InfiniBand,
            and DeepSeek puts the resulting computation-to-communication ratio at about 1:1, which
            its DualPipe schedule was built to hide{' '}
            <Cite tier={3} href={DSV3} venue="preprint">
              DeepSeek-V3, Section 3.2.1
            </Cite>
            . Each token goes to at most four nodes, crossing InfiniBand once to the GPU with the same
            in-node index and then NVLink to its experts{' '}
            <Cite tier={3} href={DSV3} venue="preprint">
              DeepSeek-V3, Section 3.2.2
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>TorchTitan.</strong> The PyTorch team&apos;s trainer composes FSDP2 (PyTorch&apos;s
            current FSDP, the <code>fully_shard</code> API), TP, PP and CP on one device mesh, built
            as <code>(pp, dp_replicate, dp_shard, cp, tp)</code>{' '}
            <Cite tier={1} href={TT_MESH} kind="code">
              TorchTitan parallelism_context.py L319-L323
            </Cite>
            , whose two DP axes are the replicate and shard groups of HSDP (hybrid sharded data
            parallel: shard inside a group, replicate across groups){' '}
            <Cite tier={1} href={TT_AXES} kind="code">
              TorchTitan parallelism_context.py L257
            </Cite>
            . Its paper calls FSDP alone often sufficient when communication is faster than
            computation, for example up to 512 GPUs, then adds TP, usually capped at 8 inside NVLink,
            and PP, with CP in the mesh dimension just outside TP{' '}
            <Cite tier={3} href={TT_PAPER} venue="preprint">
              TorchTitan, Sections 3.3.1 to 3.3.4
            </Cite>
            . The published runs: Llama 3.1 8B as FSDP 8 on 8 GPUs and FSDP 128 on 128, 70B as FSDP
            32 x TP 8 on 256, and 405B as FSDP 8 x TP 8 x PP 8 on 512{' '}
            <Cite tier={1} href={ttBench('L23-L60')}>
              TorchTitan benchmarks, Tables 1, 3, 4 and 5
            </Cite>
            , on hosts of eight H100s with 400 Gb/s of network per GPU{' '}
            <Cite tier={1} href={ttBench('L12-L14')}>
              TorchTitan benchmarks, Hardware
            </Cite>
            , which is 50 GB/s, the share a p5.48xlarge gives each GPU (our arithmetic). The 8B runs
            have no TP, so each FSDP group of 128 has eight members in every host and section 7&apos;s
            per-instance count prices it; the 70B and 405B runs fill each host with TP 8, leaving one
            FSDP member per host.
          </Box>
          <ExpandableSection headerText="The TorchTitan paper and its repository report different numbers">
            <Box variant="p">
              The paper reports different figures for the same models: Llama 3.1 405B as FSDP 4
              x TP 8 x PP 16 at a global batch of 128, and 70B at 897 and 1,010 tokens per second per
              GPU{' '}
              <Cite tier={3} href={TT_PAPER} venue="preprint">
                TorchTitan, Tables 3 and 4
              </Cite>
              , against FSDP 8 x TP 8 x PP 8 at a global batch of 256, and 829 and 876, in the
              repository&apos;s benchmark document{' '}
              <Cite tier={1} href={ttBench('L48-L60')}>
                TorchTitan benchmarks, Tables 4 and 5
              </Cite>
              . Neither says which supersedes the other. This page cites the repository document at
              v0.4.0, which records the torch, torchao and torchtitan commits its runs used{' '}
              <Cite tier={1} href={ttBench('L71-L77')}>
                TorchTitan benchmarks, Versions and Dates
              </Cite>
              .
            </Box>
          </ExpandableSection>
          <Box variant="p">
            <strong>Megatron Core.</strong> NVIDIA&apos;s engine builds its groups from an order string
            whose default is <code>tp-cp-ep-dp-pp</code>{' '}
            <Cite tier={1} href={megatronPs('L641')} kind="code">
              Megatron Core parallel_state.py L641
            </Cite>
            , and the leftmost axis gets stride 1{' '}
            <Cite tier={1} href={megatronPs('L357')} kind="code">
              Megatron Core parallel_state.py L357
            </Cite>
            , so TP ranks are adjacent and PP is outermost. Keeping adjacent ranks on one machine is
            left to the caller{' '}
            <Cite tier={1} href={megatronPs('L813-L816')} kind="code">
              Megatron Core parallel_state.py L813-L816
            </Cite>
            . A docstring in the same function gives the default as <code>tp-dp-pp</code>{' '}
            <Cite tier={1} href={megatronPs('L773-L775')} kind="doc-code-conflict">
              Megatron Core parallel_state.py L773-L775
            </Cite>
            ; the signature is what runs.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know when sharding alone stops scaling: on A100s, Megatron's combined layout beat ZeRO-3 without model parallelism by 70% once the GPU count doubled at a fixed batch"
          >
            Why the largest runs split the model as well as the data
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Model parallelism is TP and PP, the dimensions that split the model itself. Megatron&apos;s
            PTD-P (pipeline, tensor and data parallelism combined) uses TP up to the GPUs of one
            server and PP across servers{' '}
            <Cite tier={3} href={PTDP} venue="SC 2021">
              Megatron-LM on GPU Clusters, Section 3.2, Takeaway #1
            </Cite>
            , a model-parallel size TP x PP at which the parameters and intermediate metadata fit in
            GPU memory, and DP to scale to more GPUs{' '}
            <Cite tier={3} href={PTDP} venue="SC 2021">
              Megatron-LM on GPU Clusters, Section 3.3, Takeaway #2
            </Cite>
            . In the authors&apos; experiments a poor split between TP and PP cost up to half the
            throughput, even with fast links between servers{' '}
            <Cite tier={3} href={PTDP} venue="SC 2021">
              Megatron-LM on GPU Clusters, Section 1
            </Cite>
            .
          </Box>
          <Box variant="p">
            The evidence for adding model parallelism at that scale: on A100s in 2021, PTD-P beat
            ZeRO-3 (the stage that shards weights and gradients as well as optimizer state) without
            model parallelism by 6% and 24% for 175B and 530B models at the smaller GPU counts, and
            by 70% after the GPU count doubled at a fixed global batch, which the authors attribute
            to less cross-node communication{' '}
            <Cite tier={3} href={PTDP} venue="SC 2021">
              Megatron-LM on GPU Clusters, Section 5.2
            </Cite>
            . They compared only ZeRO-3 without tensor parallelism, so the result is evidence for
            splitting the model at that scale; the order of the axes is a separate question, taken up
            next. TorchTitan&apos;s 512-GPU guidance above points the same way.
          </Box>
          <ExpandableSection headerText="The throughput behind the 6%, 24% and 70%">
            <Box variant="p">
              Per-GPU throughput for the 175B model at a global batch of 1,536 sequences: ZeRO-3 144,
              88 and 44 TFLOP/s (trillion FLOPs per second) on 384, 768 and 1,536 A100s, against 153,
              149 and 141 for PTD-P with a model-parallel size of 96. For the 530B model at a batch of
              2,240: ZeRO-3 98 on 1,120 GPUs and 48 on 2,240, and 138 on 640 GPUs at a batch of
              2,560 because it did not fit on 560 at a micro-batch of 4, against 171, 167 and 159 for
              PTD-P on 560, 1,120 and 2,240 with a model-parallel size of 280{' '}
              <Cite tier={3} href={PTDP} venue="SC 2021">
                Megatron-LM on GPU Clusters, Table 2
              </Cite>
              . ZeRO-3 loses 39% to 51% of its per-GPU throughput at each doubling (our arithmetic);
              PTD-P barely moves.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Put the dimension that fires most often on the fastest link: in the 70B example TP sends about ${fmt1(TP_GB / 1000)} TB per GPU per step over NVLink, more than ${RATIO_FLOOR} times what either outer dimension sends over EFA`}
          >
            Nest innermost-fastest
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every source read here puts TP innermost, inside one instance, and those with a CP axis
            put CP next to it. Llama 3 gives the reason: the innermost parallelism needs the highest
            bandwidth and the lowest latency, so it stays inside a server, while the outermost may
            spread across a multi-hop network{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.2
            </Cite>
            . Frequency times size sets the need. TP runs two all-reduces in each layer&apos;s forward
            pass and two in its backward pass, on every micro-batch, each the size of the
            layer&apos;s activations{' '}
            <Cite tier={3} href={PTDP} venue="SC 2021">
              Megatron-LM on GPU Clusters, Section 3.2
            </Cite>
            ; PP sends one activation slice per micro-batch across each stage boundary{' '}
            <Cite tier={3} href={PTDP} venue="SC 2021">
              Megatron-LM on GPU Clusters, Section 4.1
            </Cite>
            ; DP with ZeRO-1 reduces gradients once per step (section 8, Data Parallelism &amp;
            Sharding).
          </Box>
          <Box variant="p">
            The dive&apos;s 70B layout makes the gap concrete: Llama 3.1 70B on 32 p5.48xlarge as TP{' '}
            {WORKED_LAYOUT.tp} x PP {WORKED_LAYOUT.pp} x DP {WORKED_LAYOUT.dp}, with{' '}
            {WORKED_LAYOUT.interleavedChunks} interleaved chunks per stage (section 10&apos;s v) and
            ZeRO-1, priced by section 14&apos;s calculator against {fmt1(COMPUTE_S)} s of compute per
            step:
          </Box>
          <PerLevelTable />
          <Box variant="small" color="text-body-secondary">
            Our arithmetic from the papers&apos; formulas. Assumptions: 512 sequences of 8,192 tokens
            per step, micro-batch 1, BF16 (bfloat16, two bytes per value) activations and gradients,
            no recomputation, 6 FLOPs per parameter per token at an assumed 40% MFU, inside the 38%
            to 43% Llama 3 405B reached{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Table 4
            </Cite>
            ; NVLink at 450 GB/s per GPU per direction, our reading of NVIDIA&apos;s 900 GB/s{' '}
            <Cite tier={1} href={NVLINK_PAGE} kind="vendor-claim">
              NVIDIA NVLink specifications
            </Cite>
            ; link peaks and no overlap with compute. TP&apos;s four collectives are all-reduces, or
            with SP (sequence parallelism) reduce-scatter and all-gather pairs of the same bytes
            (section 9).
          </Box>
          <Box variant="p">
            TP sends {fmt0(TP_GB)} GB per GPU per step, more than {RATIO_FLOOR} times what the
            pipeline or data parallelism sends, and even on NVLink it costs{' '}
            {pct(TP_LOAD.shareOfCompute)} of the compute. Spread one GPU per instance, a TP group would
            pay each GPU&apos;s 50 GB/s share instead, about {fmt0(TP_ON_EFA_S)} s per step against{' '}
            {fmt1(COMPUTE_S)} s of compute (our arithmetic; section 9, Tensor &amp; Sequence
            Parallelism, prices it per layer). The outer two cost about a percent each. That is the
            mental model: nest innermost-fastest, with the dimension that fires most often on the
            fastest link.
          </Box>
          <ExpandableSection headerText="The arithmetic behind the three rows">
            <SpaceBetween size="s">
              <Box variant="p">
                TP: <code>8bsh(t-1)/t</code> elements per layer per micro-batch{' '}
                <Cite tier={3} href={PTDP} venue="SC 2021">
                  Megatron-LM on GPU Clusters, Section 3.2
                </Cite>
                , here <code>8 x 1 x 8,192 x 8,192 x 7/8 x 2 bytes = {fmt2(TP_PER_LAYER_GB)} GB</code>,
                times {LAYERS_PER_STAGE} layers per stage and {MICRO_BATCHES} micro-batches per step
                (512 sequences over DP {WORKED_LAYOUT.dp}): {fmt0(TP_GB)} GB, over 450 GB/s.
              </Box>
              <Box variant="p">
                PP: <code>bsh/t</code> per stage boundary per direction with Megatron&apos;s
                scatter-gather sends{' '}
                <Cite tier={3} href={PTDP} venue="SC 2021">
                  Megatron-LM on GPU Clusters, Section 4.1
                </Cite>
                , <code>8,192 x 8,192 / 8 x 2 bytes = {fmt1(PP_PER_SEND_MB)} MB</code>, times two
                directions, {MICRO_BATCHES} micro-batches and {WORKED_LAYOUT.interleavedChunks} chunks
                (section 10): {fmt1(PP_GB)} GB, over each GPU&apos;s 50 GB/s.
              </Box>
              <Box variant="p">
                DP with ZeRO-1: a reduce-scatter of gradients and an all-gather of updated parameters
                once per step, each (n-1)/n of the shard (section 8). The shard is 70.55 billion
                parameters over TP x PP = 32 ranks in BF16, {fmt2(DP_SHARD_GB)} GB, so{' '}
                <code>2 x 7/8 x {fmt2(DP_SHARD_GB)} GB = {fmt1(DP_GB)} GB</code> per GPU. Eight DP
                groups take one GPU each from every instance, so the instance sends{' '}
                {fmt1(DP_INSTANCE_GB)} GB over its 400 GB/s, the same {fmt2(DP_LOAD.seconds)} s.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            The outer two differ. Llama 3 nests [TP, CP, PP, DP] with DP outermost{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.2
            </Cite>
            , while Megatron Core&apos;s default order{' '}
            <Cite tier={1} href={megatronPs('L641')} kind="code">
              Megatron Core parallel_state.py L641
            </Cite>
            , TorchTitan&apos;s mesh{' '}
            <Cite tier={1} href={TT_MESH} kind="code">
              TorchTitan parallelism_context.py L319-L323
            </Cite>{' '}
            and DeepSpeed&apos;s pipeline topology, row-major over <code>pipe, data, model</code>{' '}
            <Cite tier={1} href={dsTopo('L18-L21')} kind="code">
              DeepSpeed topology.py L18-L21
            </Cite>{' '}
            <Cite tier={1} href={dsTopo('L248')} kind="code">
              DeepSpeed topology.py L248
            </Cite>
            , put PP outermost and DP inside it. Megatron&apos;s string lists the innermost axis
            first and the other two list the outermost first; the table writes all four innermost
            first:
          </Box>
          <OrderTable />
          <Box variant="p">
            Once TP fills the instance, PP and DP both cross EFA under either order, each with one
            member per instance, so both pay each GPU&apos;s 50 GB/s share. The order still decides
            which instances sit close together. Llama 3&apos;s cluster is built from pods of 3,072
            GPUs with full bisection bandwidth, oversubscribed 1:7 above the pods, and Meta&apos;s
            parallelism and scheduler aim to keep traffic inside a pod{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.1
            </Cite>
            . Meta places DP outermost because FSDP tolerates latency by prefetching weights and
            reducing gradients asynchronously{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.2
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="How the two orders fall on Llama 3's pods">
            <Box variant="p">
              On Meta&apos;s grid one pipeline, TP 8 x PP 16, is 128 consecutive GPUs, small enough
              for one pod (our arithmetic), and DP spans the pods. A PP-outermost order with the same
              degrees fills each block of 512 consecutive GPUs with one stage of all 64 DP copies, so
              DP stays inside a pod, pipeline neighbours sit 512 ranks apart, and a pod holds six
              stages, so two of the fifteen stage boundaries cross a pod if ranks fill the pods in
              order (our arithmetic).
            </Box>
          </ExpandableSection>
          <Box variant="p">
            Our reading of these sources: put outermost the axis whose traffic best tolerates
            distance, and on AWS read distance from the network topology Amazon EC2 (Elastic Compute
            Cloud) reports for each instance, which the{' '}
            <Link href="../efa/">EFA dive, section 7: The EC2 Instance Topology API</Link> covers.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Before you size anything, write your layout as a mesh with TP inside one instance, and confirm on the cluster that every TP group landed on one host"
          >
            Write your layout as a mesh
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol>
            <li>
              Write the degrees innermost first and multiply them: TP 8 x PP 4 x DP 8 = 256 ranks, 32
              p5.48xlarge. The product must equal the world size. Megatron&apos;s order string takes
              the axes in this direction; TorchTitan&apos;s mesh and DeepSpeed&apos;s topology take
              them outermost first.
            </li>
            <li>
              Make TP the innermost axis, at most the eight GPUs of a p5.48xlarge. If TP is smaller,
              the next axis shares the instance: CP, or the sharding axis, as in TorchTitan&apos;s
              FSDP-only 8B runs.
            </li>
            <li>
              For every other axis, count its members per instance: one means each GPU&apos;s 50
              GB/s share, several mean a per-instance count over 400 GB/s (section 7). Sections 8 to
              12 give each dimension&apos;s bytes.
            </li>
            <li>
              Check the launcher&apos;s rank order. torchrun gives each node a contiguous block of
              global ranks{' '}
              <Cite tier={1} href={TORCHRUN_RANKS} kind="code">
                PyTorch elastic agent api.py L618-L683
              </Cite>
              ; DeepSpeed&apos;s launcher numbers ranks node by node in hostfile order{' '}
              <Cite tier={1} href={DS_LAUNCH} kind="code">
                DeepSpeed launch.py L160-L168
              </Cite>
              ; Slurm&apos;s <code>srun</code> places consecutive tasks on one node by default when
              tasks outnumber nodes, and with a topology plugin configured it takes the nodes in
              topology order rather than node-index order{' '}
              <Cite tier={1} href={SRUN}>
                Slurm srun manual, --distribution
              </Cite>
              .
            </li>
            <li>
              Log each rank&apos;s global rank and hostname at start-up, and confirm that the eight
              ranks of every TP group report one hostname. That one check per cluster is our reading
              of the sources above. On a Slurm cluster with a topology plugin, also expect the node
              order, and so which instances hold neighbouring ranks, to follow the topology rather
              than the node names.
            </li>
          </ol>
          <Box variant="p">
            Then size the degrees. Section 14, Set My Ranks, takes this mesh through the memory,
            batch and bubble checks and returns two or three layouts worth measuring. Whatever it
            returns, the innermost axis carries the {fmt1(TP_GB / 1000)} TB per GPU per step of the
            70B example, more than {RATIO_FLOOR} times anything else in the layout, and it belongs on
            NVLink inside one instance.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
