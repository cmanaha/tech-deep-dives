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
  E1_URL,
  E3_URL,
  GUIDE_URL,
  PYTORCH_TAG,
  TORCHTITAN_TAG,
  NEMO_2_TAG,
  NCCL_TESTS_TAG,
  DEEPSPEED_TAG,
} from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Li et al., PyTorch Distributed: Experiences on Accelerating Data Parallel Training (VLDB 2020). */
const DDP_PAPER = arxiv('2006.15704v1');
/** Rajbhandari et al., ZeRO: Memory Optimizations Toward Training Trillion Parameter Models. */
const ZERO = arxiv('1910.02054v3');
/** Zhao et al., PyTorch FSDP: Experiences on Scaling Fully Sharded Data Parallel (PVLDB 16(12)). */
const FSDP_PAPER = arxiv('2304.11277v2');
/** Wang et al., ZeRO++: Extremely Efficient Collective Communication for Giant Model Training. */
const ZERO_PP = arxiv('2306.10209v1');
/** McCandlish et al., An Empirical Model of Large-Batch Training. */
const LARGE_BATCH = arxiv('1812.06162v1');
/** The Llama 3 Herd of Models: Section 3.3.2 and Table 4 (layouts, MFU, batch per DP group). */
const LLAMA3 = arxiv('2407.21783v3');
/** Kaplan et al., Scaling Laws for Neural Language Models, Section 2.1 (6N FLOPs per token). */
const KAPLAN = arxiv('2001.08361v1');

/** PyTorch DDP: default bucket size, first-bucket rule and the bucket_cap_mb docstring. */
function ddpPy(lines: string): string {
  return gh('pytorch/pytorch', PYTORCH_TAG, 'torch/nn/parallel/distributed.py', lines);
}
/** PyTorch FSDP2 fully_shard: behaviour docstring, 2D mesh (HSDP) and the accumulation setters. */
function fullyShard(lines: string): string {
  return gh('pytorch/pytorch', PYTORCH_TAG, 'torch/distributed/fsdp/_fully_shard/_fully_shard.py', lines);
}
/** FSDP2 parameter-group defaults: reduce_grads, all_reduce_grads, reshard_after_backward. */
const FSDP_PARAM_GROUP = gh(
  'pytorch/pytorch',
  PYTORCH_TAG,
  'torch/distributed/fsdp/_fully_shard/_fsdp_param_group.py',
  'L268-L276',
);
/** FSDP2 MixedPrecisionPolicy: no separate master copy, and the reduce_dtype change in 2.15. */
function fsdpApi(lines: string): string {
  return gh('pytorch/pytorch', PYTORCH_TAG, 'torch/distributed/fsdp/_fully_shard/_fsdp_api.py', lines);
}
/** TorchTitan: fsdp_defer_gradient_reduction default, and what the trainer does when it is set. */
const DS_ZERO2_REDUCE = gh('deepspeedai/DeepSpeed', DEEPSPEED_TAG, 'deepspeed/runtime/zero/stage_1_and_2.py', 'L2293-L2295');
const TT_DEFER_DEFAULT = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/config/parallelism.py', 'L61-L62');
const TT_DEFER_ENGINE = gh('pytorch/torchtitan', TORCHTITAN_TAG, 'torchtitan/training_engine.py', 'L772-L776');
/** NeMo 2.x auto-configurator heuristics: global batch 256 for 8B-class models at 8,192 tokens. */
const NEMO_HEURISTIC = gh(
  'NVIDIA/NeMo',
  NEMO_2_TAG,
  'nemo/collections/llm/tools/auto_configurator/core/training_config.py',
  'L364-L398',
);
/** nccl-tests performance notes: bytes per rank for an all-reduce. */
const NCCL_PERF_ALLREDUCE = gh('NVIDIA/nccl-tests', NCCL_TESTS_TAG, 'doc/PERFORMANCE.md', 'L52-L63');
/** Hugging Face model metadata for Llama 3.1 8B at a pinned revision (exact parameter count). */
const HF_LLAMA_8B =
  'https://huggingface.co/api/models/meta-llama/Llama-3.1-8B/revision/d04e592bb4f6aa9cfee91e2e20afa771667e1d4b';
const H100_SPEC = 'https://www.nvidia.com/en-us/data-center/h100/';
const EC2_ACCEL = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';
const NVLINK_PAGE = 'https://www.nvidia.com/en-us/data-center/nvlink/';
const EC2_PRICE_LIST =
  'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv';
const CB_PRICING = 'https://aws.amazon.com/ec2/capacityblocks/pricing/';
const OD_QUOTAS = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html';

/** Register rows cited without re-opening the source keep the register's date. */
const REGISTER_DATE = '2026-10-30';

const E3_TITLE = 'E3: FSDP2 collectives per step, two processes on one DGX Spark CPU, PyTorch 2.15.0';
const E1_TITLE = 'E1: activation memory per Llama 3.1 8B layer on one GB10, PyTorch 2.15.0, one run';

/* ------------------------------------------------------------------------ */
/* Diagram: DDP, ZeRO-1, ZeRO-3 and HSDP on two instances of eight GPUs     */
/* ------------------------------------------------------------------------ */

const DP_BLUE = '#0972d3';
const DP_AMBER = '#8b6c00';
const DP_INK = '#16191f';
const DP_MUTED = '#414d5c';
const DP_FONT = 'sans-serif';

/** A collective band: 'span' crosses both instances (EFA), 'inside' runs once per instance (NVLink). */
interface ShardBand {
  kind: 'span' | 'inside';
  label: string;
}

interface ShardCardSpec {
  id: 'ddp' | 'zero1' | 'zero3' | 'hsdp';
  name: string;
  holds: string;
  /** Bytes of model state per parameter on each GPU, as printed in the cell. */
  bytesLabel: string;
  bytesPerParameter: number;
  bands: ShardBand[];
  traffic: string;
  title: string;
}

const SHARD_CARDS: ShardCardSpec[] = [
  {
    id: 'ddp',
    name: 'DDP',
    holds: 'every GPU holds a full copy of the model state',
    bytesLabel: '16',
    bytesPerParameter: 16,
    bands: [{ kind: 'span', label: 'gradient all-reduce, once per step' }],
    traffic: 'about 2N elements per GPU per step',
    title:
      'DDP on two instances of eight GPUs. Every GPU holds all 16 bytes of model state per parameter, and one gradient all-reduce per step spans both instances, so it crosses EFA.',
  },
  {
    id: 'zero1',
    name: 'ZeRO stage 1',
    holds: 'optimizer state split over all 16 GPUs',
    bytesLabel: '4.75',
    bytesPerParameter: 4.75,
    bands: [{ kind: 'span', label: 'gradient reduce-scatter, then weight all-gather' }],
    traffic: 'the same bytes as DDP, once per step',
    title:
      'ZeRO stage 1 on two instances of eight GPUs. The optimizer state is split over all 16 GPUs, leaving 4.75 bytes per parameter on each; a gradient reduce-scatter and a weight all-gather per step span both instances and cross EFA, the same bytes as DDP.',
  },
  {
    id: 'zero3',
    name: 'ZeRO stage 3, or FSDP over 16',
    holds: 'weights, gradients and optimizer state all split',
    bytesLabel: '1',
    bytesPerParameter: 1,
    bands: [
      { kind: 'span', label: 'weight all-gathers, forward and backward' },
      { kind: 'span', label: 'gradient reduce-scatter' },
    ],
    traffic: '3N per forward and backward, 1.5 times DDP',
    title:
      'ZeRO stage 3, or FSDP over all 16 GPUs, on two instances. Every class of model state is split, leaving 1 byte per parameter on each GPU; weight all-gathers in the forward and backward passes and the gradient reduce-scatter all span both instances and cross EFA, 1.5 times the bytes of DDP.',
  },
  {
    id: 'hsdp',
    name: 'HSDP: shard 8, replicate 2',
    holds: "split over each instance's 8 GPUs, copied across",
    bytesLabel: '2',
    bytesPerParameter: 2,
    bands: [
      { kind: 'inside', label: 'gathers and scatters' },
      { kind: 'span', label: "all-reduce of each GPU's 1/8 gradient shard" },
    ],
    traffic: 'crossing: 2M(W-G)/(GW) bytes per GPU',
    title:
      "HSDP with one sharding group per instance. The eight GPUs of each instance split the model state between them, 2 bytes per parameter each, and the second instance holds a copy. Weight all-gathers and gradient reduce-scatters stay inside each instance on NVLink; only an all-reduce of each GPU's one-eighth gradient shard, with the matching GPU of the other instance, crosses EFA.",
  },
];

const INST_X = [8, 188];
const INST_W = 164;
const CELL_DX = [8, 47, 86, 125];
const CELL_W = 34;
const CELL_H = 28;
const CELL_ROWS_Y = [72, 106];
const BAND_Y = [150, 176];
const BAND_H = 20;

const SHARD_CARD_STYLE: CSSProperties = { width: '100%', height: 'auto', display: 'block' };

function ShardCell({ x, y, label, bytesPerParameter }: { x: number; y: number; label: string; bytesPerParameter: number }) {
  const barW = 26;
  return (
    <g>
      <rect x={x} y={y} width={CELL_W} height={CELL_H} rx={3} fill="#ffffff" stroke="#879596" strokeWidth={1} />
      <text x={x + CELL_W / 2} y={y + 15} fill={DP_INK} fontSize={12} fontWeight={600} fontFamily={DP_FONT} textAnchor="middle">
        {label}
      </text>
      <rect x={x + 4} y={y + 20} width={barW} height={4} rx={1} fill="#e9ebed" />
      <rect x={x + 4} y={y + 20} width={(barW * bytesPerParameter) / 16} height={4} rx={1} fill={DP_MUTED} />
    </g>
  );
}

/** The drawing inside one card; the svg wrapper and its title live in ShardCard. */
function ShardCardBody({ card }: { card: ShardCardSpec }) {
  return (
    <g>
      <rect x="0.5" y="0.5" width="359" height="225" rx="8" fill="#ffffff" stroke="#d1d5db" />
      <text x="12" y="22" fill={DP_INK} fontSize={13} fontWeight={600} fontFamily={DP_FONT}>
        {card.name}
      </text>
      <text x="12" y="40" fill={DP_MUTED} fontSize={11} fontFamily={DP_FONT}>
        {card.holds}
      </text>
      {INST_X.map((ix, k) => (
        <g key={`inst-${ix}`}>
          <rect x={ix} y={50} width={INST_W} height={92} rx={6} fill="#fafafa" stroke="#879596" strokeWidth={1} />
          <text x={ix + 8} y={65} fill={DP_MUTED} fontSize={11} fontFamily={DP_FONT}>
            instance {k}
          </text>
          {CELL_ROWS_Y.map((cy) =>
            CELL_DX.map((dx) => (
              <ShardCell
                key={`cell-${ix}-${cy}-${dx}`}
                x={ix + dx}
                y={cy}
                label={card.bytesLabel}
                bytesPerParameter={card.bytesPerParameter}
              />
            )),
          )}
        </g>
      ))}
      {card.bands.map((band, row) =>
        band.kind === 'span' ? (
          <g key={`band-${band.label}`}>
            <rect x={INST_X[0]} y={BAND_Y[row]} width={INST_X[1] + INST_W - INST_X[0]} height={BAND_H} rx={4} fill={DP_AMBER} />
            <text x="180" y={BAND_Y[row] + 14} fill="#ffffff" fontSize={11} fontWeight={600} fontFamily={DP_FONT} textAnchor="middle">
              {band.label}
            </text>
          </g>
        ) : (
          <g key={`band-${band.label}`}>
            {INST_X.map((ix) => (
              <g key={`in-${ix}`}>
                <rect x={ix} y={BAND_Y[row]} width={INST_W} height={BAND_H} rx={4} fill={DP_BLUE} />
                <text x={ix + INST_W / 2} y={BAND_Y[row] + 14} fill="#ffffff" fontSize={11} fontWeight={600} fontFamily={DP_FONT} textAnchor="middle">
                  {band.label}
                </text>
              </g>
            ))}
          </g>
        ),
      )}
      <text x="12" y="216" fill={DP_INK} fontSize={11} fontWeight={600} fontFamily={DP_FONT}>
        {card.traffic}
      </text>
    </g>
  );
}

/** One svg per card, with literal title ids so each diagram carries its own accessible name. */
function ShardCard({ card }: { card: ShardCardSpec }) {
  const body = <ShardCardBody card={card} />;
  switch (card.id) {
    case 'ddp':
      return (
        <svg viewBox="0 0 360 226" role="img" aria-labelledby="data-parallel-ddp-title" style={SHARD_CARD_STYLE}>
          <title id="data-parallel-ddp-title">{card.title}</title>
          {body}
        </svg>
      );
    case 'zero1':
      return (
        <svg viewBox="0 0 360 226" role="img" aria-labelledby="data-parallel-zero1-title" style={SHARD_CARD_STYLE}>
          <title id="data-parallel-zero1-title">{card.title}</title>
          {body}
        </svg>
      );
    case 'zero3':
      return (
        <svg viewBox="0 0 360 226" role="img" aria-labelledby="data-parallel-zero3-title" style={SHARD_CARD_STYLE}>
          <title id="data-parallel-zero3-title">{card.title}</title>
          {body}
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 360 226" role="img" aria-labelledby="data-parallel-hsdp-title" style={SHARD_CARD_STYLE}>
          <title id="data-parallel-hsdp-title">{card.title}</title>
          {body}
        </svg>
      );
  }
}

function ShardLegendCard() {
  return (
    <svg viewBox="0 0 360 226" role="img" aria-labelledby="data-parallel-legend-title" style={SHARD_CARD_STYLE}>
      <title id="data-parallel-legend-title">
        How to read the four cards: the number in each GPU is the bytes of model state it holds per
        parameter, 16 being a full copy; a blue band is a collective that stays inside one instance
        on NVLink, and an amber band is a collective whose group spans both instances, so it crosses
        EFA.
      </title>
      <rect x="0.5" y="0.5" width="359" height="225" rx="8" fill="#ffffff" stroke="#d1d5db" />
      <text x="12" y="22" fill={DP_INK} fontSize={13} fontWeight={600} fontFamily={DP_FONT}>
        How to read the cards
      </text>
      <ShardCell x={12} y={36} label="16" bytesPerParameter={16} />
      <text x="56" y="47" fill={DP_MUTED} fontSize={11} fontFamily={DP_FONT}>
        bytes of model state per parameter on
      </text>
      <text x="56" y="62" fill={DP_MUTED} fontSize={11} fontFamily={DP_FONT}>
        that GPU; 16 is a full copy (2 weights,
      </text>
      <text x="56" y="77" fill={DP_MUTED} fontSize={11} fontFamily={DP_FONT}>
        2 gradients, 12 optimizer state)
      </text>
      <rect x="12" y="92" width="96" height={BAND_H} rx={4} fill={DP_BLUE} />
      <text x="60" y="106" fill="#ffffff" fontSize={11} fontWeight={600} fontFamily={DP_FONT} textAnchor="middle">
        NVLink
      </text>
      <text x="120" y="106" fill={DP_MUTED} fontSize={11} fontFamily={DP_FONT}>
        stays inside one instance
      </text>
      <rect x="12" y="120" width="96" height={BAND_H} rx={4} fill={DP_AMBER} />
      <text x="60" y="134" fill="#ffffff" fontSize={11} fontWeight={600} fontFamily={DP_FONT} textAnchor="middle">
        EFA
      </text>
      <text x="120" y="134" fill={DP_MUTED} fontSize={11} fontFamily={DP_FONT}>
        group spans both instances
      </text>
      <text x="12" y="164" fill={DP_MUTED} fontSize={11} fontFamily={DP_FONT}>
        Two p5.48xlarge, eight H100 GPUs each.
      </text>
      <text x="12" y="181" fill={DP_MUTED} fontSize={11} fontFamily={DP_FONT}>
        N parameters; M bytes of gradient; W GPUs,
      </text>
      <text x="12" y="198" fill={DP_MUTED} fontSize={11} fontFamily={DP_FONT}>
        G per instance. 2N and 3N are ZeRO&apos;s counts
      </text>
      <text x="12" y="215" fill={DP_MUTED} fontSize={11} fontFamily={DP_FONT}>
        per GPU, the large-rank-count limit.
      </text>
    </svg>
  );
}

function ShardingFigure() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))',
        gap: 12,
      }}
    >
      {SHARD_CARDS.map((c) => (
        <ShardCard key={c.id} card={c} />
      ))}
      <ShardLegendCard />
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Chart: bytes leaving each instance per step, four settings               */
/* ------------------------------------------------------------------------ */

interface CrossingRow {
  label: string;
  gb: number;
  /** The same collectives counted as one flat ring over all 32 GPUs. */
  ringGb?: number;
  value: string;
  hover: string;
}

const CROSSING_GROUPS: Array<{ header: string; rows: CrossingRow[] }> = [
  {
    header: 'At FSDP2 defaults: sync on every micro-batch',
    rows: [
      {
        label: 'Flat FSDP over 32 GPUs',
        gb: 289,
        ringGb: 373,
        value: '289 GB (373 flat ring), 0.72 s',
        hover: 'Flat FSDP at the defaults: at least 289 GB per instance per step, 373 GB as a flat ring, about 0.72 s at 400 GB/s',
      },
      {
        label: 'HSDP: shard 8, replicate 4',
        gb: 193,
        value: '193 GB, 0.48 s',
        hover: 'HSDP at the defaults: 193 GB per instance per step, about 0.48 s at 400 GB/s',
      },
    ],
  },
  {
    header: 'Sync deferred to the last micro-batch',
    rows: [
      {
        label: 'Flat FSDP over 32 GPUs',
        gb: 120,
        ringGb: 156,
        value: '120 GB (156 flat ring), 0.30 s',
        hover: 'Flat FSDP with deferred sync: at least 120 GB per instance per step, 156 GB as a flat ring, about 0.30 s',
      },
      {
        label: 'HSDP: shard 8, replicate 4',
        gb: 24.1,
        value: '24.1 GB, 0.06 s',
        hover: 'HSDP with deferred sync: 24.1 GB per instance per step, about 60 ms',
      },
    ],
  },
];

function CrossingChart() {
  const x0 = 10;
  const x1 = 370;
  const maxGb = 400;
  const sx = (gb: number) => x0 + ((x1 - x0) * gb) / maxGb;
  const barH = 14;
  const groupY = [60, 156];
  const ticks = [0, 100, 200, 300, 400];
  /** Rounded data-end, square at the baseline. */
  const barPath = (y: number, gb: number) => {
    const xe = sx(gb);
    const r = Math.min(4, (xe - x0) / 2);
    return `M${x0},${y} H${xe - r} Q${xe},${y} ${xe},${y + r} V${y + barH - r} Q${xe},${y + barH} ${xe - r},${y + barH} H${x0} Z`;
  };
  return (
    <svg
      viewBox="0 0 380 276"
      role="img"
      aria-labelledby="data-parallel-crossing-title"
      style={{ width: '100%', maxWidth: 560, height: 'auto', display: 'block' }}
    >
      <title id="data-parallel-crossing-title">
        Bytes leaving each p5.48xlarge per training step for Llama 3.1 8B on four instances, eight
        micro-batches, BF16, as lower bounds at 400 GB/s per instance. At FSDP2&apos;s defaults, flat
        FSDP over 32 GPUs sends at least 289 GB (373 GB as a flat ring) and HSDP 193 GB. With gradient
        sync deferred to the last micro-batch, flat FSDP sends at least 120 GB (156 GB) and HSDP 24.1
        GB. Deferral cuts the bytes more than the layout does, and HSDP with deferral sends about 12
        times less than flat FSDP at its defaults.
      </title>
      <rect x="0" y="0" width="380" height="276" rx="8" fill="#ffffff" />
      <text x={x0} y="20" fill={DP_INK} fontSize={12} fontWeight={600} fontFamily={DP_FONT}>
        GB leaving each instance per step, lower bound
      </text>
      <text x={x0} y="37" fill={DP_MUTED} fontSize={11} fontFamily={DP_FONT}>
        Llama 3.1 8B, 4 x p5.48xlarge, 8 micro-batches, BF16
      </text>
      {CROSSING_GROUPS.map((g, gi) => (
        <g key={g.header}>
          <text x={x0} y={groupY[gi]} fill={DP_INK} fontSize={11} fontWeight={600} fontFamily={DP_FONT}>
            {g.header}
          </text>
          {g.rows.map((row, ri) => {
            const labelY = groupY[gi] + 18 + ri * 38;
            const barY = labelY + 6;
            return (
              <g key={`${g.header}-${row.label}`}>
                <title>{row.hover}</title>
                <text x={x0} y={labelY} fill={DP_MUTED} fontSize={11} fontFamily={DP_FONT}>
                  {row.label}
                </text>
                <text x={x1} y={labelY} fill={DP_INK} fontSize={11} fontWeight={600} fontFamily={DP_FONT} textAnchor="end">
                  {row.value}
                </text>
                <path d={barPath(barY, row.gb)} fill={DP_AMBER} />
                {row.ringGb !== undefined && (
                  <g>
                    <line x1={sx(row.gb) + 2} y1={barY + barH / 2} x2={sx(row.ringGb)} y2={barY + barH / 2} stroke={DP_AMBER} strokeWidth={2} />
                    <line x1={sx(row.ringGb)} y1={barY + 2} x2={sx(row.ringGb)} y2={barY + barH - 2} stroke={DP_AMBER} strokeWidth={2} />
                  </g>
                )}
              </g>
            );
          })}
        </g>
      ))}
      <line x1={x0} y1={66} x2={x0} y2={240} stroke="#879596" strokeWidth={1} />
      <line x1={x0} y1={240} x2={x1} y2={240} stroke="#879596" strokeWidth={1} />
      {ticks.map((t) => (
        <line key={`tickmark-${t}`} x1={sx(t)} y1={240} x2={sx(t)} y2={244} stroke="#879596" strokeWidth={1} />
      ))}
      {ticks.map((t) => (
        <text
          key={`tick-${t}`}
          x={sx(t)}
          y="254"
          fill={DP_MUTED}
          fontSize={11}
          fontFamily={DP_FONT}
          textAnchor={t === 0 ? 'start' : t === maxGb ? 'end' : 'middle'}
        >
          {t === maxGb ? '400 GB' : t}
        </text>
      ))}
      <text x={x0} y="270" fill={DP_MUTED} fontSize={11} fontFamily={DP_FONT}>
        Line past a bar: the same collectives as one flat ring
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* Table: model state per GPU under each ZeRO stage                         */
/* ------------------------------------------------------------------------ */

const cell: CSSProperties = {
  padding: '6px 8px',
  borderBottom: '1px solid #e9ebed',
  textAlign: 'left',
  verticalAlign: 'top',
};
const headCell: CSSProperties = { ...cell, fontWeight: 700, borderBottom: '2px solid #d1d5db' };

const ZERO_ROWS: Array<{ stage: string; formula: string; d8: string; d32: string }> = [
  { stage: 'DDP, nothing sharded', formula: '16', d8: '128.5', d32: '128.5' },
  { stage: 'Stage 1: optimizer state', formula: '4 + 12/d', d8: '44.2', d32: '35.1' },
  { stage: 'Stage 2: plus gradients', formula: '2 + 14/d', d8: '30.1', d32: '19.6' },
  { stage: 'Stage 3 (FSDP): plus weights', formula: '16/d', d8: '16.1', d32: '4.0' },
];

function ZeroStageTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>What is sharded</th>
            <th style={headCell}>Bytes per parameter per GPU</th>
            <th style={headCell}>GB per GPU, d = 8</th>
            <th style={headCell}>GB per GPU, d = 32</th>
          </tr>
        </thead>
        <tbody>
          {ZERO_ROWS.map((r) => (
            <tr key={r.stage}>
              <td style={cell}>{r.stage}</td>
              <td style={cell}>
                <code>{r.formula}</code>
              </td>
              <td style={cell}>{r.d8}</td>
              <td style={cell}>{r.d32}</td>
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

export function DataParallel() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Shard model state across data-parallel ranks, keep the sharding on the fast link, and set the gradient-sync mode, the larger of the two levers: on Llama 3.1 8B across four p5.48xlarge, together they send about 12 times fewer bytes between instances (PyTorch v2.15.0 and TorchTitan v0.4.0, read 2026-10-31, and our DGX Spark runs)"
          >
            8. Data Parallelism &amp; Sharding: DDP, ZeRO, FSDP &amp; HSDP
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Data parallelism is how most runs first use more than one GPU: every GPU runs the same
            model on a different slice of the batch, and the GPUs average their gradients before
            each update. It is the outermost dimension of almost every layout in this dive, and it
            is where the model state either fits or does not. Llama 3.1 8B has 8,030,261,248
            parameters{' '}
            <Cite tier={1} href={HF_LLAMA_8B}>
              Hugging Face model metadata, Llama 3.1 8B
            </Cite>{' '}
            and needs 16 bytes of model state for each{' '}
            <Cite tier={3} href={ZERO} venue="SC 2020">
              ZeRO, Section 3.1
            </Cite>
            : 128.5 GB, 1.6 times the 80 GB of one H100{' '}
            <Cite tier={1} href={H100_SPEC} kind="vendor-claim">
              NVIDIA H100 specification
            </Cite>
            . A full copy per GPU cannot train it.
          </Box>
          <Box variant="p">
            The challenge is to stop copying that state without paying for it on the slow link.
            Sharding, splitting the model state across GPUs instead of copying it to each, trades
            memory for collectives, and where those collectives run sets the price. This section
            builds the four answers in order, DDP (Distributed Data Parallel), ZeRO (Zero Redundancy
            Optimizer), FSDP (Fully Sharded Data Parallel) and HSDP (hybrid sharded data parallel),
            then prices them on one example, Llama 3.1 8B on four p5.48xlarge, where the choice of
            when gradients are synchronised moves more bytes than the choice of layout.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See what one data-parallel step sends, about two copies of the gradients per GPU at any GPU count, and how DDP hides it behind the backward pass"
          >
            Data parallelism and DDP
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            In DP (data parallelism) every rank, one training process driving one GPU, holds a full
            copy of the model, called a replica. Each rank runs the forward and backward passes on
            its own data, then all ranks sum their gradients with an all-reduce, so every replica
            applies the same update. An all-reduce cannot start until every rank has joined it, so
            the slowest rank sets the pace{' '}
            <Cite tier={3} href={DDP_PAPER} venue="VLDB 2020" accessed={REGISTER_DATE}>
              PyTorch Distributed, Section 2.3
            </Cite>
            .
          </Box>
          <Box variant="p">
            PyTorch&apos;s DDP (Distributed Data Parallel) hides most of that all-reduce behind the
            backward pass: it groups gradients into buckets in reverse parameter order and
            all-reduces each bucket as soon as its gradients exist{' '}
            <Cite tier={3} href={DDP_PAPER} venue="VLDB 2020" accessed={REGISTER_DATE}>
              PyTorch Distributed, Section 3.2.3
            </Cite>
            . At PyTorch v2.15.0 a bucket holds 25 MiB (mebibytes) by default, set by{' '}
            <code>bucket_cap_mb</code>{' '}
            <Cite tier={1} href={ddpPy('L712-L717')}>
              PyTorch distributed.py L712-L717
            </Cite>
            , with a smaller first bucket so the earliest gradients start moving sooner{' '}
            <Cite tier={1} href={ddpPy('L105-L110')} kind="code">
              PyTorch distributed.py L105-L110
            </Cite>
            . Bucket size trades each collective&apos;s fixed overhead against a later first
            all-reduce, and the DDP paper tells applications to measure it{' '}
            <Cite tier={3} href={DDP_PAPER} venue="VLDB 2020" accessed={REGISTER_DATE}>
              PyTorch Distributed, Section 4.2
            </Cite>
            .
          </Box>
          <Box variant="p">
            The bytes follow from the identity of section 7, Collectives &amp; What They Cost: an
            all-reduce over n ranks sends
            2(n-1)/n of the array from every rank{' '}
            <Cite tier={1} href={NCCL_PERF_ALLREDUCE}>
              nccl-tests PERFORMANCE.md L52-L63
            </Cite>
            . With N parameters, DP sends 2N(n-1)/n gradient elements per rank per step, close to 2N
            at any useful rank count{' '}
            <Cite tier={3} href={ZERO} venue="SC 2020">
              ZeRO, Section 7.1
            </Cite>
            , so more replicas barely change what each one sends. For Llama 3.1 8B&apos;s 16.06 GB
            of BF16 (bfloat16, two bytes per value) gradients, section 7 prices that at about 62 ms
            inside one p5.48xlarge, and across four at least 24.1 GB
            leaving each instance, about 60 ms over its 400 GB/s of EFA (Elastic Fabric Adapter).
          </Box>
          <Box variant="p">
            What DP does not shrink is memory: every replica keeps all 16 bytes per parameter of
            mixed-precision Adam, 2 for BF16 weights, 2 for BF16 gradients and 12 for the optimizer
            state (an FP32, 32-bit floating point, master copy plus Adam&apos;s two moments, running
            averages of each gradient and of its square){' '}
            <Cite tier={3} href={ZERO} venue="SC 2020">
              ZeRO, Section 3.1
            </Cite>
            . That is the 128.5 GB that does not fit one H100.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Choose a ZeRO stage from two numbers: the bytes per parameter it leaves on each GPU, and the extra traffic it costs, which is none for stage 1"
          >
            ZeRO: shard the copies one class at a time
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            ZeRO (Zero Redundancy Optimizer) removes the copies in three stages. Each stage shards
            one more class of model state across the d data-parallel ranks, so each rank keeps 1/d of
            it. Stage 1 shards the optimizer state and leaves 4 + 12/d bytes per parameter on each
            rank; stage 2 adds the gradients, 2 + 14/d; stage 3 adds the weights, 16/d, so memory
            falls in proportion to the rank count{' '}
            <Cite tier={3} href={ZERO} venue="SC 2020">
              ZeRO, Sections 5.1 to 5.3
            </Cite>
            .
          </Box>
          <ZeroStageTable />
          <Box variant="small" color="text-body-secondary">
            Llama 3.1 8B, model state only, before activations; our arithmetic from ZeRO&apos;s
            formulas and the parameter count, decimal GB.
          </Box>
          <Box variant="p">
            The traffic holds the surprise. Stages 1 and 2 send the same bytes as plain DP, because
            the all-reduce already was a reduce-scatter followed by an all-gather and ZeRO keeps both
            halves: it reduce-scatters the gradients so each rank updates only its own shard, then
            all-gathers the updated weights, N plus N elements per step{' '}
            <Cite tier={3} href={ZERO} venue="SC 2020">
              ZeRO, Section 7.2.1
            </Cite>
            . That holds for one micro-batch per step. Under gradient accumulation DeepSpeed reduces
            stage 2&apos;s partitioned gradients on every backward pass, where stage 1 waits for the
            accumulation boundary, so stage 2 sends one gradient reduce-scatter per micro-batch{' '}
            <Cite tier={1} href={DS_ZERO2_REDUCE} kind="code">
              DeepSpeed stage_1_and_2.py L2293-L2295
            </Cite>
            . Stage 3 keeps no full copy of the weights to compute with, so it all-gathers them
            before the forward pass and again before the backward pass, on top of the gradient
            reduce-scatter: 3N per step, 1.5 times DP{' '}
            <Cite tier={3} href={ZERO} venue="SC 2020">
              ZeRO, Section 7.2.2
            </Cite>
            . Sharding the optimizer state is free in communication; sharding the weights is what
            turns sharding into a bandwidth decision.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Put each sharding group inside one instance, so the gathers stay on NVLink and only one all-reduce of each GPU's shard crosses to the other instances"
          >
            FSDP and HSDP: how wide to shard
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            FSDP (Fully Sharded Data Parallel) is PyTorch&apos;s ZeRO stage 3, generalised with a
            sharding factor F, the number of ranks the state is split over: F = 1 is DDP, F equal to
            the world size W shards fully, and values between are hybrid sharding{' '}
            <Cite tier={3} href={FSDP_PAPER} venue="PVLDB 16(12)">
              PyTorch FSDP, Section 3.2
            </Cite>
            . FSDP2, PyTorch&apos;s current FSDP and the <code>fully_shard</code> API, works one
            wrapped module, a unit, at a time: it gathers the unit&apos;s weights before its forward
            pass, frees them, gathers them again for the backward pass, then reduce-scatters the
            gradients{' '}
            <Cite tier={1} href={fullyShard('L115-L123')}>
              PyTorch _fully_shard.py L115-L123
            </Cite>
            . A step usually runs several micro-batches, slices of the batch whose gradients are
            summed before one optimizer update (gradient accumulation). Counted with two processes
            on one DGX Spark&apos;s CPU, FSDP2 at PyTorch 2.15.0 issued two all-gathers and one
            reduce-scatter per unit on every micro-batch at its defaults, one all-gather fewer for
            the root unit, which stays gathered after its forward pass{' '}
            <Cite tier={0} href={E3_URL}>
              {E3_TITLE}
            </Cite>
            .
          </Box>
          <Box variant="p">
            HSDP (hybrid sharded data parallel) maps each sharding group onto one instance. The G
            GPUs of an instance hold one sharded copy of the model between them, and the GPUs with
            the same local index on different instances form a replication group. The weight
            all-gathers and the gradient reduce-scatter then run inside the instance on NVLink, and
            only an all-reduce of each GPU&apos;s 1/G gradient shard, across its replication group,
            crosses to other instances{' '}
            <Cite tier={3} href={FSDP_PAPER} venue="PVLDB 16(12)">
              PyTorch FSDP, Section 3.2.2
            </Cite>
            . In FSDP2 that is a two-dimensional device mesh, replicated across its first dimension
            and sharded across its second{' '}
            <Cite tier={1} href={fullyShard('L182-L188')}>
              PyTorch _fully_shard.py L182-L188
            </Cite>
            . For an M-byte gradient over W GPUs, the crossing is 2M(W-G)/(GW) bytes per GPU per
            synchronisation, our arithmetic from the paper&apos;s definitions; the block below the
            figure explains why it differs from the formula the paper prints.
          </Box>
          <ShardingFigure />
          <Box variant="small" color="text-body-secondary">
            Schematic, not measured: two p5.48xlarge of eight GPUs. Bytes per parameter from
            ZeRO&apos;s formulas at d = 16, and 16/8 for HSDP (our arithmetic); band colour shows
            whether the collective&apos;s group stays inside one instance or spans both.
          </Box>
          <Box variant="p">
            This is the section&apos;s mental model: cross the slow link once, fan out on the fast
            one. HSDP pays for it in memory, since each GPU holds 1/G of the state where flat FSDP
            holds 1/W: for Llama 3.1 8B on four p5.48xlarge, 16.1 GB per GPU against 4.0 GB (the
            table above, d = 8 and d = 32). The FSDP paper aims hybrid sharding at models too large
            to train fully replicated and too small to need full sharding, and its authors report
            that the smaller all-reduces run faster than global ones because of stragglers and
            network interference{' '}
            <Cite tier={3} href={FSDP_PAPER} venue="PVLDB 16(12)" accessed={REGISTER_DATE}>
              PyTorch FSDP, Section 3.2.2
            </Cite>
            , with no figure attached.
          </Box>
          <Box variant="p">
            DeepSpeed&apos;s ZeRO++ cuts the same cross-node bytes for ZeRO stage 3 from 3M to 0.75M:
            weights all-gathered in INT8 (8-bit integers) in the forward pass, a secondary copy of
            the weights in each node so the backward all-gather stays there, and gradients
            reduce-scattered in INT4 (4-bit integers) through an all-to-all that reduces inside the
            node first; its authors report up to 2.16 times the throughput at 384 GPUs{' '}
            <Cite tier={3} href={ZERO_PP} venue="ICLR 2024" accessed={REGISTER_DATE}>
              ZeRO++, Section 1 and abstract
            </Cite>
            . The secondary copy is HSDP&apos;s trade again: memory spent to keep a collective off
            the slow link.
          </Box>
          <ExpandableSection headerText="The HSDP crossing, and the formula the FSDP paper prints">
            <SpaceBetween size="s">
              <Box variant="p">
                The FSDP paper defines F as the number of ranks over which parameters are sharded,
                then says to set F = W/G to keep the all-gathers and reduce-scatters inside a host,
                and prints the hybrid cross-host traffic per GPU as 2M(W-1)/(GW){' '}
                <Cite tier={3} href={FSDP_PAPER} venue="PVLDB 16(12)">
                  PyTorch FSDP, Section 3.2.2, from the paper&apos;s LaTeX source
                </Cite>
                . With W/G hosts, a sharding factor of W/G would shard across hosts. The surrounding
                text, replication groups of same-local-rank accelerators across hosts, matches F =
                G, which is the reading this page uses.
              </Box>
              <Box variant="p">
                Re-derived for a ring: each GPU owns an M/G shard and all-reduces it with the W/G
                GPUs of the same local rank, sending <code>2 x (M/G) x (W/G - 1)/(W/G) = 2M(W-G)/(GW)</code>{' '}
                bytes across hosts. For Llama 3.1 8B on four p5.48xlarge (M = 16.06 GB, G = 8, W =
                32) that is 3.01 GB per GPU per synchronisation, against 3.89 GB from the printed
                form (our arithmetic). The replication group has one member per instance, so the
                per-instance count of section 7 gives the same answer: eight GPUs of 3.01 GB each,
                24.1 GB leaving each instance.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Set the gradient-sync mode first: on Llama 3.1 8B across four p5.48xlarge it cuts the bytes between instances more than the sharding layout does, and the two together cut them about 12 times"
          >
            Price it: Llama 3.1 8B on four p5.48xlarge
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Llama 3.1 8B, 16.06 GB of BF16 weights, trains on 32 H100 GPUs in four p5.48xlarge at
            8,192 tokens per sequence, with a global batch of 256 sequences, about 2.1M tokens, the
            batch NeMo&apos;s sizing heuristics give a model of this size at this length{' '}
            <Cite tier={1} href={NEMO_HEURISTIC} kind="code" accessed={REGISTER_DATE}>
              NeMo v2.7.3 auto-configurator training_config.py L364-L398
            </Cite>
            . Each GPU runs 8 sequences per step as 8 micro-batches of one. Compute is about 8 s per
            step by the 6N rule (6 FLOPs, floating-point operations, per parameter per token){' '}
            <Cite tier={3} href={KAPLAN} venue="preprint" accessed={REGISTER_DATE}>
              Scaling Laws for Neural Language Models, Section 2.1
            </Cite>{' '}
            at an assumed 40% MFU (model FLOPs utilization, the share of peak arithmetic achieved),
            inside the 38% to 43% Llama 3 measured on H100{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint" accessed={REGISTER_DATE}>
              Llama 3 Herd of Models, Table 4
            </Cite>
            , of the H100&apos;s 989.5 TFLOPS dense BF16, half the 1,979 NVIDIA lists with sparsity{' '}
            <Cite tier={1} href={H100_SPEC} kind="vendor-claim">
              NVIDIA H100 specification
            </Cite>
            ; about 9 s once section 4, Counting the Arithmetic, adds attention.
          </Box>
          <Box variant="p">
            Cross-instance traffic is priced as section 7 argues:
            per instance, against its 3,200 Gb/s (400 GB/s) of EFA{' '}
            <Cite tier={1} href={EC2_ACCEL}>
              EC2 accelerated computing instance specifications
            </Cite>
            . A collective whose group spans the four instances moves at least 3/4 of its array out
            of each, 3/4 x 16.06 = 12.05 GB per all-gather or reduce-scatter. That count is our
            reading, so every figure below is a lower bound at the link&apos;s full rate, with a flat
            ring over all 32 GPUs (31/32 of the array) in parentheses.
          </Box>
          <ul>
            <li>
              <strong>Flat FSDP over 32 GPUs, FSDP2 defaults.</strong> Two all-gathers and one
              reduce-scatter per unit on each of the 8 micro-batches, 24 per step across the whole
              model: at least 24 x 12.05 = 289 GB leaving each instance (373 GB as a flat ring),
              about 0.72 s.
            </li>
            <li>
              <strong>HSDP, shard 8 inside each instance and replicate 4, defaults.</strong> The
              gathers and scatters stay on NVLink. On each of the 8 micro-batches the eight GPUs of
              an instance all-reduce their shards, which add up to the whole gradient: 2 x 3/4 x
              16.06 = 24.1 GB per instance, 193 GB per step, about 0.48 s. A factor of about 1.5
              against flat FSDP.
            </li>
            <li>
              <strong>Flat FSDP, sync deferred to the last micro-batch.</strong> 9 all-gathers and 1
              reduce-scatter per unit, at least 10 x 12.05 = 120 GB (156 GB), about 0.30 s.
            </li>
            <li>
              <strong>HSDP, sync deferred.</strong> One all-reduce of the shards, 24.1 GB, about 60
              ms. A factor of about 5 against flat FSDP with the same setting.
            </li>
          </ul>
          <CrossingChart />
          <Box variant="small" color="text-body-secondary">
            Our arithmetic, matching the sizing calculator of section 14, Set My Ranks. Assumptions:
            BF16 weights gathered and BF16 gradients reduced, micro-batch 1, 8 micro-batches per
            step, link peaks, no overlap. Collective counts per unit from E3 on PyTorch 2.15.0.
          </Box>
          <Box variant="p">
            Read the chart by lever. Keeping the sharding inside the instance cuts the crossing by
            about 1.5 at the defaults. Deferring the gradient sync cuts it 2.4 times for flat FSDP
            and 8 times for HSDP. Together, HSDP with deferred sync sends about 12 times fewer bytes
            between instances than flat FSDP at its defaults: 24.1 GB against 289 GB per instance
            per step. The sync mode is the larger lever, and in TorchTitan it is one setting,{' '}
            <code>fsdp_defer_gradient_reduction</code>.
          </Box>
          <Box variant="p">
            The largest crossing is about 0.72 s against about 8 s of compute, and the backward pass
            can hide part of it. Bytes are not yet time, either: HSDP&apos;s gathers still run on
            NVLink, about 337 GB per GPU per step at the defaults, about 0.75 s at 450 GB/s{' '}
            <Cite tier={1} href={NVLINK_PAGE} kind="vendor-claim">
              NVIDIA NVLink specifications
            </Cite>
            , while a flat collective&apos;s in-instance part shares that link with its crossing (our
            reading, the sizing calculator&apos;s model). HSDP&apos;s gain in time can be smaller
            than its gain in bytes; which link binds first, and how much overlap hides, is what the
            A2 protocol below would measure.
          </Box>
          <Box variant="p">
            Both levers cost memory. With sync off, gradients accumulate on the unsharded
            parameters{' '}
            <Cite tier={1} href={fullyShard('L606-L608')}>
              PyTorch _fully_shard.py L606-L608
            </Cite>
            , a full 16.06 GB gradient per GPU in BF16, and HSDP holds four times flat FSDP&apos;s
            model state. At micro-batch 1, the dive&apos;s memory estimate puts HSDP with deferred
            sync at about 75 GB per GPU of an 80 GB H100 with a fused SwiGLU (swish-gated linear
            unit) and about 82 GB, past NVIDIA&apos;s 80 GB, with an eager (uncompiled) one.
            Full recomputation, re-running each layer&apos;s forward pass in the backward pass
            instead of storing its activations, brings either to about 42 GB (section 5, The Memory
            Budget; activations at 34 and 41 sbh bytes per layer, s tokens, b sequences, h hidden
            size, measured on one GB10{' '}
            <Cite tier={0} href={E1_URL}>
              {E1_TITLE}
            </Cite>
            ).
          </Box>
          <Box variant="p">
            For this model on four instances: HSDP with one instance per sharding group, gradient
            sync deferred to the last micro-batch, and full recomputation to make room for the
            unsharded gradient. To get the 24.1 GB, turn gradient sync off on every micro-batch but
            the last; the block below gives the settings.
          </Box>
          <ExpandableSection headerText="The FSDP2 and TorchTitan defaults behind these numbers">
            <SpaceBetween size="s">
              <Box variant="p">
                Each FSDP2 parameter group starts with <code>reduce_grads</code>, <code>all_reduce_grads</code> and{' '}
                <code>reshard_after_backward</code> set to <code>True</code>, so every backward pass
                reduce-scatters and every next forward pass all-gathers again{' '}
                <Cite tier={1} href={FSDP_PARAM_GROUP} kind="code">
                  PyTorch _fsdp_param_group.py L268-L276
                </Cite>
                .
              </Box>
              <Box variant="p">
                <code>set_requires_gradient_sync(False)</code>, FSDP2&apos;s equivalent of
                FSDP1&apos;s <code>no_sync</code>, accumulates without communication; for HSDP it
                controls the reduce-scatter and the all-reduce together{' '}
                <Cite tier={1} href={fullyShard('L597-L615')}>
                  PyTorch _fully_shard.py L597-L615
                </Cite>
                . <code>set_reshard_after_backward(False)</code> keeps the weights unsharded between
                micro-batches, trading memory for the skipped all-gather{' '}
                <Cite tier={1} href={fullyShard('L687-L694')}>
                  PyTorch _fully_shard.py L687-L694
                </Cite>
                . For HSDP alone, <code>set_requires_all_reduce(False)</code> keeps the in-instance
                reduce-scatter and skips only the all-reduce across instances{' '}
                <Cite tier={1} href={fullyShard('L634-L640')}>
                  PyTorch _fully_shard.py L634-L640
                </Cite>
                .
              </Box>
              <Box variant="p">
                E3 counted the effect on a five-unit test model over four micro-batches: 36
                all-gathers and 20 reduce-scatters per step at the defaults, 36 and 5 with sync off on
                the first three, and 21 and 5 with resharding after backward also off, k + 1
                all-gathers per unit for k micro-batches{' '}
                <Cite tier={0} href={E3_URL}>
                  {E3_TITLE}
                </Cite>
                . Sync off alone removes only the reduce-scatters, at least 17 x 12.05 = 205 GB per
                instance for the 8B example, so the low figures need both settings (our arithmetic
                from E3&apos;s counts).
              </Box>
              <Box variant="p">
                TorchTitan v0.4.0 keeps FSDP2&apos;s default: <code>fsdp_defer_gradient_reduction</code>{' '}
                is <code>False</code>{' '}
                <Cite tier={1} href={TT_DEFER_DEFAULT} kind="code">
                  TorchTitan parallelism.py L61-L62
                </Cite>
                ; set to <code>True</code>, the trainer turns gradient sync, resharding after backward
                and <code>set_is_last_backward</code> on only for the last accumulation step{' '}
                <Cite tier={1} href={TT_DEFER_ENGINE} kind="code">
                  TorchTitan training_engine.py L772-L776
                </Cite>
                .
              </Box>
              <Box variant="p">
                The reduction dtype moved in PyTorch 2.15. FSDP2 keeps sharded parameters in their own
                dtype, with no separate master copy{' '}
                <Cite tier={1} href={fsdpApi('L22-L26')}>
                  PyTorch _fsdp_api.py L22-L26
                </Cite>
                , so a run often stores FP32 parameters and computes in BF16. With{' '}
                <code>reduce_dtype</code> unset, gradients are now reduced in the parameter&apos;s
                gradient dtype, FP32 for FP32 parameters, where earlier releases reduced in{' '}
                <code>param_dtype</code>; <code>reduce_dtype=torch.bfloat16</code> restores the
                previous behaviour, and FSDP1 still reduces in <code>param_dtype</code>{' '}
                <Cite tier={1} href={fsdpApi('L41-L59')}>
                  PyTorch _fsdp_api.py L41-L59
                </Cite>
                . Left unset, it doubles the reduce-scatter bytes: flat FSDP at the defaults then
                sends at least 16 x 12.05 + 8 x 24.09 = 385 GB per instance per step (498 GB as a
                flat ring), about 0.96 s, and a deferred FP32 gradient holds 32.1 GB per GPU (our
                arithmetic). Choose the dtype on purpose, and write the PyTorch version next to any
                byte count.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <ExpandableSection headerText="A2 protocol (not yet run)">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>What it would measure.</strong> Tokens per second, MFU against 989.5 TFLOPS,
                peak memory per GPU and EFA bytes per step for TorchTitan v0.4.0 training Llama 3.1
                8B at 8,192 tokens and 8 micro-batches, in FSDP 8 on one p5.48xlarge and in flat FSDP
                16 and HSDP (shard 8, replicate 2) on two, each with and without deferred gradient
                reduction (
                <Link external href={GUIDE_URL}>
                  research guide, section 5
                </Link>
                ). The same runs would check the memory estimates above against measured peaks.
              </Box>
              <Box variant="p">
                <strong>On what.</strong> Two p5.48xlarge, the instances the collective baseline in
                section 7 uses.
              </Box>
              <Box variant="p">
                <strong>Prediction, our reading and not a result.</strong> EFA bytes per instance per
                step at or above the sizing calculator&apos;s lower bounds for two instances at 8
                micro-batches: flat FSDP 16 about 193 GB at the defaults and 80 GB deferred, HSDP about
                128 GB and 16.1 GB, the four-instance ordering with deferral the larger lever. No
                tokens-per-second figure is predicted; the measured MFU replaces the 40% assumption.
              </Box>
              <Box variant="p">
                <strong>Cost.</strong> About three hours on two instances: 2 x 3 x $55.04 = $330 at
                the On-Demand rate in us-east-1 on 2026-10-30{' '}
                <Cite tier={1} href={EC2_PRICE_LIST} accessed={REGISTER_DATE}>
                  AWS Price List, AmazonEC2 us-east-1, version 20261029175634
                </Cite>
                , after raising the On-Demand quota for P instances from its starting 0 vCPUs (virtual
                CPUs){' '}
                <Cite tier={1} href={OD_QUOTAS} accessed={REGISTER_DATE}>
                  EC2 On-Demand Instance quotas
                </Cite>
                . The research guide shares the window with two other experiments: 7 hours, $771
                On-Demand, or $2,292 for a one-day Capacity Block for two instances at $47.757 per
                instance-hour in US East (N. Virginia) on 2026-10-30, charged at the price quoted at
                purchase{' '}
                <Cite tier={1} href={CB_PRICING} accessed={REGISTER_DATE}>
                  EC2 Capacity Blocks pricing
                </Cite>
                . Teardown: one stack, deleted at the end and verified by listing instances by the
                stack&apos;s tag.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know when more replicas stop helping: past the critical batch size, or when a fixed batch is split so thin that each rank's share costs utilisation"
          >
            The ceiling on data parallelism is the batch
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Data parallelism has a limit that no link sets. The global batch is the DP degree times
            the micro-batch times the micro-batches per step, so adding replicas either grows the
            batch or thins each rank&apos;s share of it. Growing it helps only up to the critical
            batch size: below it, doubling the batch nearly halves the number of steps; past it, a
            larger batch stops cutting the steps in proportion and mostly spends compute{' '}
            <Cite tier={3} href={LARGE_BATCH} venue="preprint" accessed={REGISTER_DATE}>
              An Empirical Model of Large-Batch Training, Sections 2.2 and 2.3
            </Cite>
            . The critical batch size grows as training proceeds and the gradient shrinks{' '}
            <Cite tier={3} href={LARGE_BATCH} venue="preprint" accessed={REGISTER_DATE}>
              An Empirical Model of Large-Batch Training, Sections 2.5 and 3.1
            </Cite>
            .
          </Box>
          <Box variant="p">
            Holding the batch fixed moves the cost into utilisation. Llama 3 kept its global tokens
            per batch constant going from 8,192 to 16,384 GPUs, which halved the batch per DP group
            from 32 to 16 sequences, and Meta attributes the MFU falling from 43% to 41% to that
            smaller per-group batch{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint" accessed={REGISTER_DATE}>
              Llama 3 Herd of Models, Section 3.3.2 and Table 4
            </Cite>
            . Past that point, further GPUs belong to the dimensions that split the model instead of
            the batch: tensor, pipeline and context parallelism, sections 9 to 11.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Make four settings, in this order, before you size the rest of the layout"
          >
            Set the data-parallel dimension
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol>
            <li>
              <strong>Shard the optimizer state first.</strong> ZeRO stage 1 takes Llama 3.1 8B from
              128.5 GB to 44.2 GB of model state per GPU on one instance for no extra bytes. Shard
              the gradients and weights as well only when that still leaves too little room for the
              activations.
            </li>
            <li>
              <strong>Keep the sharding group inside the instance.</strong> HSDP with one instance
              per sharding group keeps the gathers on NVLink and sends one all-reduce of each
              GPU&apos;s shard across; check that its 1/G share of the state fits.
            </li>
            <li>
              <strong>Set the gradient-sync mode on purpose.</strong> FSDP2 and TorchTitan
              synchronise on every micro-batch by default. Deferring to the last micro-batch is the
              larger lever; combined with HSDP it takes the example from 289 GB per instance per
              step, flat FSDP at the defaults, to 24.1 GB, about 12 times less, paid for with a full
              unsharded gradient per GPU. Set <code>reduce_dtype</code> explicitly and record the
              PyTorch version with the byte count.
            </li>
            <li>
              <strong>Treat the global batch as the cap on DP.</strong> When each rank&apos;s share
              falls to a few sequences, put further GPUs into the dimensions that split the model.
            </li>
          </ol>
          <Box variant="p">
            Then price the candidate layout with the sizing calculator in section 14, which takes the
            sync mode as an input, and measure the two or three layouts that pass.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
