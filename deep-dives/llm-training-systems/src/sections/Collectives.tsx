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
  GUIDE_URL,
  PYTORCH_TAG,
  TORCHTITAN_TAG,
  MEGATRON_TAG,
  DEEPSPEED_TAG,
  NCCL_TESTS_TAG,
  AWSOME_DISTRIBUTED_TRAINING_SHA,
} from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** nccl-tests performance notes: algorithm and bus bandwidth, bytes per rank per collective. */
function perf(lines: string): string {
  return gh('NVIDIA/nccl-tests', NCCL_TESTS_TAG, 'doc/PERFORMANCE.md', lines);
}
/** Megatron Core rank generator: default order and the adjacency note. */
function megatronPs(lines: string): string {
  return gh('NVIDIA/Megatron-LM', MEGATRON_TAG, 'megatron/core/parallel_state.py', lines);
}
const TORCHRUN_RANKS = gh(
  'pytorch/pytorch',
  PYTORCH_TAG,
  'torch/distributed/elastic/agent/server/api.py',
  'L618-L688',
);
const DS_LAUNCH = gh('deepspeedai/DeepSpeed', DEEPSPEED_TAG, 'deepspeed/launcher/launch.py', 'L160-L168');
function dsTopo(lines: string): string {
  return gh('deepspeedai/DeepSpeed', DEEPSPEED_TAG, 'deepspeed/runtime/pipe/topology.py', lines);
}
const TT_MESH = gh(
  'pytorch/torchtitan',
  TORCHTITAN_TAG,
  'torchtitan/distributed/parallelism_context.py',
  'L319-L323',
);
/** Slurm srun manual page (current documentation; SchedMD does not version it by URL). */
const SRUN = 'https://slurm.schedmd.com/srun.html';
/** NCCL 2.32.3 user guide, environment variables (NCCL_CROSS_NIC, NCCL_ALGO). */
const NCCL_ENV = 'https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/env.html';
/** NVIDIA technical blog, Massively Scale Your Deep Learning Training with NCCL 2.4 (2019). */
const NCCL_24_BLOG = 'https://developer.nvidia.com/blog/massively-scale-deep-learning-training-nccl-2-4/';
const EC2_ACCEL = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';
const NVLINK_PAGE = 'https://www.nvidia.com/en-us/data-center/nvlink/';
/** Hugging Face model metadata for Llama 3.1 8B at a pinned revision (exact parameter count). */
const HF_LLAMA_8B =
  'https://huggingface.co/api/models/meta-llama/Llama-3.1-8B/revision/d04e592bb4f6aa9cfee91e2e20afa771667e1d4b';
/** AWS sample repository: nccl-tests README with a two-instance p5.48xlarge all_reduce_perf sample. */
const ADT_P5_SAMPLE = gh(
  'aws-samples/awsome-distributed-training',
  AWSOME_DISTRIBUTED_TRAINING_SHA,
  'micro-benchmarks/nccl-tests/README.md',
  'L206-L243',
);
const ZERO = arxiv('1910.02054v3');
const SP_PAPER = arxiv('2205.05198v1');
const PTDP = arxiv('2104.04473v5');
const LLAMA3 = arxiv('2407.21783v3');
const DSV3 = arxiv('2412.19437v2');
const FSDP_PAPER = arxiv('2304.11277v2');
const EC2_PRICE_LIST =
  'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv';
const CB_PRICING = 'https://aws.amazon.com/ec2/capacityblocks/pricing/';
const CB_GUIDE = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html';
const OD_QUOTAS = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html';
const DLAMI_20261027 =
  'https://docs.aws.amazon.com/dlami/latest/devguide/aws-deep-learning-ami-gpubaseoss-ul2404-2026-10-28.html';

/** Register rows cited without re-opening the source keep the register's date. */
const REGISTER_DATE = '2026-10-30';

/* ------------------------------------------------------------------------ */
/* Diagram: the five collectives as before-and-after cards                  */
/* ------------------------------------------------------------------------ */

/** Fill per source rank; index 4 is "summed over all ranks". White text on each passes contrast. */
const OPS_FILL = ['#0972d3', '#1f7a70', '#6f4cc4', '#8b6c00', '#16191f'];
const SUM = 4;

/** One slot: the rank its data came from (or SUM) and which quarter of that rank's array it is. */
type Slot = { src: number; q: number } | null;

const own = (r: number): Slot[] => [0, 1, 2, 3].map((q) => ({ src: r, q }));
const summed = (): Slot[] => [0, 1, 2, 3].map((q) => ({ src: SUM, q }));
const empty = (): Slot[] => [null, null, null, null];
const oneSummed = (r: number): Slot[] => [0, 1, 2, 3].map((q) => (q === r ? { src: SUM, q } : null));

const RANKS = [0, 1, 2, 3];

interface OpCard {
  id: string;
  name: string;
  bytes: string;
  title: string;
  before: Slot[][];
  after: Slot[][];
  /** Ranks drawn faded because they take no part (send and receive). */
  idle?: number[];
}

const OP_CARDS: OpCard[] = [
  {
    id: 'allreduce',
    name: 'all-reduce',
    bytes: '2(n-1)/n x S per rank',
    title:
      'All-reduce on four ranks. Before, each rank holds its own array of four quarters; after, every rank holds the sum of all four arrays. Each rank sends 2(n-1)/n of the array.',
    before: RANKS.map(own),
    after: RANKS.map(summed),
  },
  {
    id: 'reducescatter',
    name: 'reduce-scatter',
    bytes: '(n-1)/n x S per rank',
    title:
      'Reduce-scatter on four ranks. Before, each rank holds its own array; after, rank r holds only quarter r of the sum. Each rank sends (n-1)/n of the array.',
    before: RANKS.map(own),
    after: RANKS.map(oneSummed),
  },
  {
    id: 'allgather',
    name: 'all-gather',
    bytes: '(n-1)/n x S per rank',
    title:
      'All-gather on four ranks. Before, rank r holds only quarter r; after, every rank holds all four quarters. Each rank sends (n-1)/n of the array.',
    before: RANKS.map((r) => [0, 1, 2, 3].map((q) => (q === r ? { src: r, q } : null))),
    after: RANKS.map(() => [0, 1, 2, 3].map((q) => ({ src: q, q }))),
  },
  {
    id: 'alltoall',
    name: 'all-to-all',
    bytes: '(n-1)/n x S per rank',
    title:
      'All-to-all on four ranks. Before, each rank holds four quarters, quarter j addressed to rank j; after, rank r holds quarter r of every rank, so each rank ends with different data. Each rank sends (n-1)/n of the array.',
    before: RANKS.map(own),
    // Rank r receives quarter r of every rank's array, placed in slot j for source rank j.
    after: RANKS.map((r) => [0, 1, 2, 3].map((j) => ({ src: j, q: r }))),
  },
  {
    id: 'sendrecv',
    name: 'send / receive',
    bytes: 'S, one rank to one',
    title:
      'Send and receive between two ranks. Before, rank 0 holds an array; after, rank 1 holds a copy of it. Ranks 2 and 3 take no part. The sender sends the whole array once.',
    before: [own(0), empty(), empty(), empty()],
    after: [own(0), own(0), empty(), empty()],
    idle: [2, 3],
  },
];

/** One rank's buffer: four quarter slots, filled by source rank, or dashed when empty. */
function RankBox({
  x,
  y,
  slots,
  idle,
  width = 56,
}: {
  x: number;
  y: number;
  slots: Slot[];
  idle: boolean;
  width?: number;
}) {
  const slotW = (width - 8) / 4;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={28}
        rx={4}
        fill={idle ? '#f4f4f4' : '#ffffff'}
        stroke={idle ? '#d1d5db' : '#879596'}
        strokeWidth={1}
      />
      {slots.map((s, i) => {
        const sx = x + 4 + i * slotW;
        if (!s) {
          return (
            <rect
              key={`e-${sx}`}
              x={sx + 0.5}
              y={y + 3.5}
              width={slotW - 2}
              height={20}
              rx={2}
              fill="#ffffff"
              stroke="#879596"
              strokeWidth={1}
              strokeDasharray="2 2"
            />
          );
        }
        return (
          <g key={`f-${sx}`}>
            <rect x={sx} y={y + 3} width={slotW - 1} height={22} rx={2} fill={OPS_FILL[s.src]} />
            <text
              x={sx + (slotW - 1) / 2}
              y={y + 18}
              fill="#ffffff"
              fontSize={10}
              fontWeight={600}
              fontFamily="sans-serif"
              textAnchor="middle"
            >
              {s.src === SUM ? 'S' : s.q}
            </text>
          </g>
        );
      })}
    </g>
  );
}

const CARD_BOX_X = [54, 113, 172, 231];

const CARD_STYLE = { width: '100%', height: 'auto' } as const;

/** The drawing inside one card; the svg wrapper and its title live in CollectiveCard. */
function CardBody({ card }: { card: OpCard }) {
  return (
    <g>
      <rect x="0.5" y="0.5" width="299" height="131" rx="8" fill="#ffffff" stroke="#d1d5db" />
      <text x="12" y="22" fill="#16191f" fontSize={13} fontWeight={600} fontFamily="sans-serif">
        {card.name}
      </text>
      <text x="288" y="22" fill="#414d5c" fontSize={11} fontFamily="sans-serif" textAnchor="end">
        {card.bytes}
      </text>
      {RANKS.map((r) => (
        <text
          key={`rl-${r}`}
          x={CARD_BOX_X[r] + 28}
          y="42"
          fill="#414d5c"
          fontSize={11}
          fontFamily="sans-serif"
          textAnchor="middle"
        >
          rank {r}
        </text>
      ))}
      <text x="10" y="67" fill="#414d5c" fontSize={11} fontFamily="sans-serif">
        before
      </text>
      <text x="10" y="105" fill="#414d5c" fontSize={11} fontFamily="sans-serif">
        after
      </text>
      {card.before.map((slots, r) => (
        <RankBox key={`b-${r}`} x={CARD_BOX_X[r]} y={48} slots={slots} idle={card.idle?.includes(r) ?? false} />
      ))}
      {card.after.map((slots, r) => (
        <RankBox key={`a-${r}`} x={CARD_BOX_X[r]} y={86} slots={slots} idle={card.idle?.includes(r) ?? false} />
      ))}
    </g>
  );
}

/** One svg per card, with literal title ids so each diagram carries its own accessible name. */
function CollectiveCard({ card }: { card: OpCard }) {
  const body = <CardBody card={card} />;
  switch (card.id) {
    case 'allreduce':
      return (
        <svg viewBox="0 0 300 132" role="img" aria-labelledby="collectives-op-allreduce-title" style={CARD_STYLE}>
          <title id="collectives-op-allreduce-title">{card.title}</title>
          {body}
        </svg>
      );
    case 'reducescatter':
      return (
        <svg viewBox="0 0 300 132" role="img" aria-labelledby="collectives-op-reducescatter-title" style={CARD_STYLE}>
          <title id="collectives-op-reducescatter-title">{card.title}</title>
          {body}
        </svg>
      );
    case 'allgather':
      return (
        <svg viewBox="0 0 300 132" role="img" aria-labelledby="collectives-op-allgather-title" style={CARD_STYLE}>
          <title id="collectives-op-allgather-title">{card.title}</title>
          {body}
        </svg>
      );
    case 'alltoall':
      return (
        <svg viewBox="0 0 300 132" role="img" aria-labelledby="collectives-op-alltoall-title" style={CARD_STYLE}>
          <title id="collectives-op-alltoall-title">{card.title}</title>
          {body}
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 300 132" role="img" aria-labelledby="collectives-op-sendrecv-title" style={CARD_STYLE}>
          <title id="collectives-op-sendrecv-title">{card.title}</title>
          {body}
        </svg>
      );
  }
}

function CollectivesLegendCard() {
  return (
    <svg viewBox="0 0 300 132" role="img" aria-labelledby="collectives-op-legend-title" style={{ width: '100%', height: 'auto' }}>
      <title id="collectives-op-legend-title">
        How to read the five cards: the fill of a quarter is the rank its data came from, a dark
        quarter marked S is summed over all ranks, a dashed quarter is empty, and the digit names
        which quarter of the source rank&apos;s array it is.
      </title>
      <rect x="0.5" y="0.5" width="299" height="131" rx="8" fill="#ffffff" stroke="#d1d5db" />
      <text x="12" y="22" fill="#16191f" fontSize={13} fontWeight={600} fontFamily="sans-serif">
        How to read the cards
      </text>
      <text x="12" y="42" fill="#414d5c" fontSize={11} fontFamily="sans-serif">
        Fill: the rank the data came from
      </text>
      {RANKS.map((r) => (
        <g key={`leg-${r}`}>
          <rect x={12 + r * 70} y="51" width="12" height="12" rx="2" fill={OPS_FILL[r]} />
          <text x={29 + r * 70} y="61" fill="#414d5c" fontSize={11} fontFamily="sans-serif">
            rank {r}
          </text>
        </g>
      ))}
      <rect x="12" y="74" width="12" height="12" rx="2" fill={OPS_FILL[SUM]} />
      <text x="29" y="84" fill="#414d5c" fontSize={11} fontFamily="sans-serif">
        S: summed over all ranks
      </text>
      <rect x="182.5" y="74.5" width="11" height="11" rx="2" fill="#ffffff" stroke="#879596" strokeDasharray="2 2" />
      <text x="199" y="84" fill="#414d5c" fontSize={11} fontFamily="sans-serif">
        empty
      </text>
      <text x="12" y="106" fill="#414d5c" fontSize={11} fontFamily="sans-serif">
        Digit: quarter of the source rank&apos;s array
      </text>
      <text x="12" y="122" fill="#414d5c" fontSize={11} fontFamily="sans-serif">
        n ranks; S bytes in the full array
      </text>
    </svg>
  );
}

function CollectivesFigure() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 12,
      }}
    >
      {OP_CARDS.map((c) => (
        <CollectiveCard key={c.id} card={c} />
      ))}
      <CollectivesLegendCard />
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: all-reduce as reduce-scatter then all-gather                    */
/* ------------------------------------------------------------------------ */

const DECOMP_BOX_X = [34, 104, 174, 244];

function DecompositionDiagram() {
  const stateY = [40, 134, 228];
  const heads = ["start: each rank's own array", 'after reduce-scatter: one summed quarter each', 'after all-gather: the full sum on every rank'];
  const states: Slot[][][] = [RANKS.map(own), RANKS.map(oneSummed), RANKS.map(summed)];
  const steps = [
    { y: 76, op: 'reduce-scatter' },
    { y: 170, op: 'all-gather' },
  ];
  return (
    <svg
      viewBox="0 0 340 320"
      role="img"
      aria-labelledby="collectives-decomp-title"
      style={{ width: '100%', maxWidth: 460, height: 'auto' }}
    >
      <title id="collectives-decomp-title">
        An all-reduce drawn as its two halves on four ranks. A reduce-scatter leaves each rank with
        the sum of one quarter of the array, moving (n-1)/n of the array per rank; an all-gather
        then copies every summed quarter to every rank, moving another (n-1)/n. The two together
        are the all-reduce, 2(n-1)/n of the array per rank.
      </title>
      <defs>
        <marker
          id="collectives-decomp-ah"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
        </marker>
      </defs>
      <rect x="0" y="0" width="340" height="320" rx="8" fill="#ffffff" />
      {RANKS.map((r) => (
        <text
          key={`dr-${r}`}
          x={DECOMP_BOX_X[r] + 30}
          y="34"
          fill="#414d5c"
          fontSize={11}
          fontFamily="sans-serif"
          textAnchor="middle"
        >
          rank {r}
        </text>
      ))}
      {states.map((st, c) => (
        <g key={`st-${stateY[c]}`}>
          <text x="12" y={c === 0 ? 16 : stateY[c] - 8} fill="#16191f" fontSize={12} fontWeight={600} fontFamily="sans-serif">
            {heads[c]}
          </text>
          {st.map((slots, r) => (
            <RankBox key={`d-${c}-${r}`} x={DECOMP_BOX_X[r]} y={stateY[c]} slots={slots} idle={false} width={60} />
          ))}
        </g>
      ))}
      {steps.map((s) => (
        <g key={s.op}>
          <path d={`M22,${s.y} V${s.y + 34}`} stroke="#5f6b7a" strokeWidth={1.5} fill="none" markerEnd="url(#collectives-decomp-ah)" />
          <text x="36" y={s.y + 15} fill="#16191f" fontSize={13} fontWeight={600} fontFamily="sans-serif">
            {s.op}
          </text>
          <text x="36" y={s.y + 31} fill="#414d5c" fontSize={11} fontFamily="sans-serif">
            (n-1)/n x S per rank
          </text>
        </g>
      ))}
      <text x="12" y="286" fill="#16191f" fontSize={13} fontWeight={600} fontFamily="sans-serif">
        all-reduce = reduce-scatter + all-gather
      </text>
      <text x="12" y="305" fill="#414d5c" fontSize={12} fontFamily="sans-serif">
        2(n-1)/n x S per rank
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: ranks on instances, TP inside and DP across                     */
/* ------------------------------------------------------------------------ */

function RankGridDiagram() {
  const inst = [
    { x: 10, y: 52 },
    { x: 214, y: 52 },
    { x: 10, y: 184 },
    { x: 214, y: 184 },
  ];
  const cellW = 40;
  const cellGap = 6;
  const blue = '#0972d3';
  const amber = '#8b6c00';
  return (
    <svg
      viewBox="0 0 420 360"
      role="img"
      aria-labelledby="collectives-ranks-title"
      style={{ width: '100%', maxWidth: 620, height: 'auto' }}
    >
      <title id="collectives-ranks-title">
        Thirty-two ranks laid out as TP 8 x DP 4 on four p5.48xlarge instances. The launcher gives
        each instance a consecutive block of eight ranks, and a mesh with TP on its fastest-varying
        axis makes each block one tensor-parallel group, so its traffic stays on NVLink inside the
        instance. Each data-parallel group takes the same local GPU from every instance, for
        example ranks 0, 8, 16 and 24, so its traffic crosses EFA.
      </title>
      <rect x="0" y="0" width="420" height="360" rx="8" fill="#ffffff" />
      <text x="10" y="20" fill="#16191f" fontSize={13} fontWeight={600} fontFamily="sans-serif">
        TP 8 x DP 4 = 32 ranks on four p5.48xlarge
      </text>
      <text x="10" y="38" fill="#414d5c" fontSize={11} fontFamily="sans-serif">
        rank = 8 x (DP index) + (TP index)
      </text>
      {inst.map(({ x, y }, k) => (
        <g key={`inst-${k}`}>
          <rect x={x} y={y} width="196" height="120" rx="6" fill="#f2f8fd" stroke={blue} strokeWidth={1.5} />
          <text x={x + 10} y={y + 18} fill="#16191f" fontSize={12} fontWeight={600} fontFamily="sans-serif">
            instance {k}
          </text>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((local) => {
            const cx = x + 9 + (local % 4) * (cellW + cellGap);
            const cy = y + (local < 4 ? 26 : 60);
            const dp0 = local === 0;
            return (
              <g key={`c-${k}-${local}`}>
                <rect
                  x={cx}
                  y={cy}
                  width={cellW}
                  height={28}
                  rx={3}
                  fill={dp0 ? '#fbf3d5' : '#ffffff'}
                  stroke={dp0 ? amber : blue}
                  strokeWidth={dp0 ? 2 : 1}
                />
                <text
                  x={cx + cellW / 2}
                  y={cy + 19}
                  fill="#16191f"
                  fontSize={13}
                  fontWeight={600}
                  fontFamily="sans-serif"
                  textAnchor="middle"
                >
                  {k * 8 + local}
                </text>
              </g>
            );
          })}
          <text x={x + 98} y={y + 110} fill="#414d5c" fontSize={11} fontFamily="sans-serif" textAnchor="middle">
            TP group: ranks {k * 8} to {k * 8 + 7}
          </text>
        </g>
      ))}
      <rect x="10" y="316" width="13" height="13" rx="2" fill="#f2f8fd" stroke={blue} strokeWidth={1.5} />
      <text x="30" y="327" fill="#414d5c" fontSize={11} fontFamily="sans-serif">
        TP group: eight consecutive ranks, one instance, NVLink
      </text>
      <rect x="10" y="338" width="13" height="13" rx="2" fill="#fbf3d5" stroke={amber} strokeWidth={2} />
      <text x="30" y="349" fill="#414d5c" fontSize={11} fontFamily="sans-serif">
        DP group: ranks 0, 8, 16 and 24, one GPU per instance, EFA
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: the two links of a p5.48xlarge                                  */
/* ------------------------------------------------------------------------ */

const LINK_GPU_X = [0, 1, 2, 3, 4, 5, 6, 7].map((g) => 21 + g * 38);

function InstanceLinks({ top, efaBelow }: { top: number; efaBelow: boolean }) {
  const blue = '#0972d3';
  const teal = '#1f7a70';
  // Rows inside one 142-unit instance box, mirrored so the EFA cards always face the network.
  const labelY = efaBelow ? [top + 20, top + 36] : [top + 112, top + 130];
  const switchY = efaBelow ? top + 46 : top + 80;
  const gpuY = efaBelow ? top + 76 : top + 40;
  const efaY = efaBelow ? top + 112 : top + 14;
  return (
    <g>
      <rect x="10" y={top} width="320" height="142" rx="6" fill="#f2f8fd" stroke={blue} strokeWidth={1.5} />
      <text x="22" y={labelY[0]} fill="#16191f" fontSize={13} fontWeight={600} fontFamily="sans-serif">
        p5.48xlarge: 8 x H100
      </text>
      <text x="22" y={labelY[1]} fill="#414d5c" fontSize={11} fontFamily="sans-serif">
        NVLink: 450 GB/s per GPU per direction
      </text>
      <rect x="21" y={switchY} width="298" height="18" rx="3" fill={blue} />
      <text x="170" y={switchY + 13} fill="#ffffff" fontSize={11} fontWeight={600} fontFamily="sans-serif" textAnchor="middle">
        NVSwitch
      </text>
      {LINK_GPU_X.map((gx, g) => (
        <g key={`g-${top}-${g}`}>
          <path
            d={efaBelow ? `M${gx + 16},${switchY + 18} V${gpuY}` : `M${gx + 16},${gpuY + 24} V${switchY}`}
            stroke={blue}
            strokeWidth={2.5}
            fill="none"
          />
          <rect x={gx} y={gpuY} width="32" height="24" rx="3" fill="#ffffff" stroke={blue} strokeWidth={1.5} />
          <text x={gx + 16} y={gpuY + 16} fill="#16191f" fontSize={11} fontWeight={600} fontFamily="sans-serif" textAnchor="middle">
            {g}
          </text>
          <path
            d={efaBelow ? `M${gx + 16},${gpuY + 24} V${efaY}` : `M${gx + 16},${efaY + 14} V${gpuY}`}
            stroke={teal}
            strokeWidth={1.5}
            fill="none"
          />
          <rect x={gx} y={efaY} width="32" height="14" rx="2" fill="#e6f4f2" stroke={teal} strokeWidth={1} />
          <text x={gx + 16} y={efaY + 11} fill="#16191f" fontSize={10} fontFamily="sans-serif" textAnchor="middle">
            EFA
          </text>
        </g>
      ))}
    </g>
  );
}

function LinkHierarchyDiagram() {
  const slate = '#414d5c';
  const teal = '#1f7a70';
  return (
    <svg
      viewBox="0 0 340 384"
      role="img"
      aria-labelledby="collectives-links-title"
      style={{ width: '100%', maxWidth: 460, height: 'auto' }}
    >
      <title id="collectives-links-title">
        Two p5.48xlarge instances. Inside each, eight H100 GPUs, numbered 0 to 7, connect through
        NVSwitch at 450 GB/s per GPU per direction. Each GPU also has a 50 GB/s share of the
        instance&apos;s EFA network bandwidth, 3,200 Gb/s or 400 GB/s for the whole instance, which
        is how traffic reaches the other instance. Per GPU, NVLink is nine times EFA, and the whole
        instance&apos;s EFA is less than one GPU&apos;s NVLink.
      </title>
      <rect x="0" y="0" width="340" height="384" rx="8" fill="#ffffff" />
      <InstanceLinks top={8} efaBelow />
      {LINK_GPU_X.map((gx) => (
        <g key={`fab-${gx}`}>
          <path d={`M${gx + 16},134 V162`} stroke={teal} strokeWidth={1.5} fill="none" />
          <path d={`M${gx + 16},196 V222`} stroke={teal} strokeWidth={1.5} fill="none" />
        </g>
      ))}
      <rect x="10" y="162" width="320" height="34" rx="4" fill={slate} />
      <text x="170" y="176" fill="#ffffff" fontSize={11} fontWeight={600} fontFamily="sans-serif" textAnchor="middle">
        EFA: 3,200 Gb/s = 400 GB/s per instance
      </text>
      <text x="170" y="190" fill="#ffffff" fontSize={11} fontFamily="sans-serif" textAnchor="middle">
        50 GB/s per GPU; each line is one GPU&apos;s share
      </text>
      <InstanceLinks top={208} efaBelow={false} />
      <text x="170" y="372" fill="#16191f" fontSize={12} fontWeight={600} fontFamily="sans-serif" textAnchor="middle">
        Per GPU, NVLink is nine times EFA
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* Where the dive meets each collective                                     */
/* ------------------------------------------------------------------------ */

const WHERE_ROWS: Array<{ op: string; where: string }> = [
  {
    op: 'All-reduce',
    where: 'data-parallel gradients (section 8) and tensor-parallel activations in every layer (section 9).',
  },
  {
    op: 'Reduce-scatter',
    where:
      'sharded gradients under ZeRO (Zero Redundancy Optimizer) and FSDP (section 8), and sequence parallelism (section 9).',
  },
  {
    op: 'All-gather',
    where:
      'sharded parameters gathered before use (section 8), sequence parallelism (section 9), and keys and values under context parallelism (section 11).',
  },
  {
    op: 'All-to-all',
    where: 'tokens sent to their experts and back under expert parallelism (section 12).',
  },
  {
    op: 'Send and receive',
    where: 'activations passed to the next pipeline stage, and their gradients passed back (section 10).',
  },
];

function WhereList() {
  return (
    <ul>
      {WHERE_ROWS.map((r) => (
        <li key={r.op}>
          <strong>{r.op}:</strong> {r.where}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function Collectives() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Price any parallelism in bytes per link before you run it: five operations, one identity, and the two links of a p5.48xlarge, nine times apart per GPU (PyTorch v2.15.0, TorchTitan v0.4.0, Megatron Core core_v0.20.0, DeepSpeed v0.19.9 and nccl-tests v2.21.1, read 2026-10-31)"
          >
            7. Collectives &amp; What They Cost
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every way of splitting a training step across GPUs is paid for in communication. That
            communication arrives as a handful of collective operations, the calls through which a
            group of GPUs exchanges data in NCCL (NVIDIA Collective Communications Library), and each
            one moves a known number of bytes per GPU. A layout can therefore be priced on paper:
            bytes divided by the bandwidth of the link they cross, set against the compute time of a
            step.
          </Box>
          <Box variant="p">
            The challenge is the link. On a p5.48xlarge, a GPU reaches the other seven GPUs of its
            instance with nine times its share of the instance&apos;s EFA (Elastic Fabric Adapter)
            bandwidth to the rest of the cluster{' '}
            <Cite tier={1} href={NVLINK_PAGE} kind="vendor-claim">
              NVIDIA NVLink specifications
            </Cite>{' '}
            <Cite tier={1} href={EC2_ACCEL}>
              EC2 accelerated computing instance specifications
            </Cite>
            , so the same bytes cost very different times depending on where they travel. This
            section gives the
            vocabulary every later section uses, the bytes each operation moves, and the arithmetic
            for deciding which link a collective can live on.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read a layout such as TP 8 x PP 4 x DP 8 as a grid of ranks, and confirm its innermost dimension lands inside one instance"
          >
            Ranks, degrees and where each rank runs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A rank is one training process; on GPUs one rank drives one GPU, and the world size is
            the number of ranks in the job. Each parallelism has a degree, the number of ranks it
            splits its work across, and the degrees of a layout multiply to the world size: TP
            (tensor parallelism, splitting every layer&apos;s matrices) 8 x PP (pipeline parallelism,
            splitting the layers into stages) 4 x DP (data parallelism, copies of the model on
            different data) 8 is 256 ranks, or 32 p5.48xlarge instances of eight H100 GPUs each{' '}
            <Cite tier={1} href={EC2_ACCEL}>
              EC2 accelerated computing instance specifications
            </Cite>
            . Each rank therefore holds a coordinate on a grid, which PyTorch calls a device mesh
            (section 13, Composing the Dimensions).
          </Box>
          <Box variant="p">
            Where a rank runs is settled in two steps: the launcher numbers the ranks, and the
            training framework lays its grid over those numbers. The launchers read for this dive
            give each instance a consecutive block. torchrun assigns each node&apos;s workers a
            contiguous range of global ranks{' '}
            <Cite tier={1} href={TORCHRUN_RANKS} kind="code">
              PyTorch elastic agent api.py L618-L688
            </Cite>
            ; DeepSpeed&apos;s launcher numbers ranks node by node in hostfile order{' '}
            <Cite tier={1} href={DS_LAUNCH} kind="code">
              DeepSpeed launch.py L160-L168
            </Cite>
            ; Slurm&apos;s <code>srun</code> places consecutive tasks on one node by default when tasks
            outnumber nodes, except that with a topology plugin configured and no distribution given
            it follows topology order rather than node index order{' '}
            <Cite tier={1} href={SRUN}>
              Slurm srun manual, --distribution
            </Cite>
            .
          </Box>
          <Box variant="p">
            The frameworks then put tensor parallelism on the fastest-varying axis of the grid.
            TorchTitan builds its mesh as <code>(pp, dp_replicate, dp_shard, cp, tp)</code> over the
            world&apos;s ranks in row-major order, so <code>tp</code> varies fastest{' '}
            <Cite tier={1} href={TT_MESH} kind="code">
              TorchTitan parallelism_context.py L319-L323
            </Cite>
            ; DeepSpeed&apos;s pipeline topology is row-major over <code>pipe, data, model</code>, with
            its model axis (TP) last{' '}
            <Cite tier={1} href={dsTopo('L247-L248')} kind="code">
              DeepSpeed topology.py L247-L248
            </Cite>
            ; Megatron Core defaults to the order <code>tp-cp-ep-dp-pp</code>, leftmost most adjacent{' '}
            <Cite tier={1} href={megatronPs('L641')} kind="code">
              Megatron Core parallel_state.py L641
            </Cite>
            , and expects the caller to keep adjacent ranks on one machine{' '}
            <Cite tier={1} href={megatronPs('L813-L816')} kind="code">
              Megatron Core parallel_state.py L813-L816
            </Cite>
            . Put together, a TP group of eight is eight consecutive ranks, which is one
            p5.48xlarge, and each data-parallel group takes the same local GPU from every instance.
          </Box>
          <RankGridDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative layout, TP 8 x DP 4 on 32 ranks; the numbering follows the launcher and mesh
            code cited above.
          </Box>
          <Box variant="p">
            Our reading of these sources is that one check per cluster settles it: log each
            rank&apos;s global rank and hostname at start-up, and confirm that the eight ranks of every
            TP group report one hostname. A Slurm cluster with a topology plugin is the first place to
            look, since that is the documented case where task order follows topology rather than
            node index.
          </Box>
          <Box variant="p">
            Four codebases supply most of the formulas, defaults and published layouts from here on:
            PyTorch&apos;s own distributed APIs, DDP (Distributed Data Parallel) and FSDP2
            (PyTorch&apos;s current FSDP, Fully Sharded Data Parallel, the <code>fully_shard</code> API),
            with TorchTitan, the PyTorch team&apos;s trainer built on them; NVIDIA&apos;s Megatron Core,
            with Megatron Bridge as its front end; and DeepSpeed. Section 15, The Framework Map, maps
            them as engines and the front ends that configure them.
          </Box>
          <ExpandableSection headerText="The mesh-order code, quoted, and one docstring that disagrees with it">
            <SpaceBetween size="s">
              <Box variant="p">
                TorchTitan: <code>unflatten_mesh(self._world_mesh, (&quot;pp&quot;, &quot;dp_replicate&quot;, &quot;dp_shard&quot;, &quot;cp&quot;, &quot;tp&quot;), ...)</code>{' '}
                <Cite tier={1} href={TT_MESH} kind="code">
                  TorchTitan parallelism_context.py L319-L323
                </Cite>
                . DeepSpeed: &quot;ProcessTopology uses a &apos;row-major&apos; layout of the tensor axes&quot;{' '}
                <Cite tier={1} href={dsTopo('L18-L21')} kind="code">
                  DeepSpeed topology.py L18-L21
                </Cite>{' '}
                and <code>axes=[&apos;pipe&apos;, &apos;data&apos;, &apos;model&apos;]</code>{' '}
                <Cite tier={1} href={dsTopo('L247-L248')} kind="code">
                  DeepSpeed topology.py L247-L248
                </Cite>
                .
              </Box>
              <Box variant="p">
                Megatron Core: the signature reads <code>order: str = &quot;tp-cp-ep-dp-pp&quot;</code>{' '}
                <Cite tier={1} href={megatronPs('L641')} kind="code">
                  Megatron Core parallel_state.py L641
                </Cite>
                ; a docstring in the same file explains the order string as &quot;leftmost token =
                smallest stride = most adjacent ranks&quot;{' '}
                <Cite tier={1} href={megatronPs('L608')} kind="code">
                  Megatron Core parallel_state.py L608
                </Cite>
                ; and &quot;the caller should make sure adjacent ranks are on the same DGX box&quot;. The
                rank generator&apos;s docstring still gives the default as <code>tp-dp-pp</code>{' '}
                <Cite tier={1} href={megatronPs('L773-L775')} kind="doc-code-conflict">
                  Megatron Core parallel_state.py L773-L775
                </Cite>
                ; the signature is what runs.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Recognise a collective from what every rank holds before and after, and read the bytes each rank sends off one card"
          >
            Five operations
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A collective is a call that every rank in a group makes together, and each one is
            defined by what every rank holds before the call and after it. Write S for the size of
            the full array in bytes and n for the number of ranks in the group. An all-reduce sums
            every rank&apos;s array and leaves the sum on every rank. A reduce-scatter sums the same
            way and leaves each rank one 1/n slice of the sum. An all-gather starts with one slice
            per rank and leaves every rank with all of them. An all-to-all starts with n slices per
            rank, one addressed to each rank, and delivers each slice to its rank. Send and receive
            copy a buffer from one rank to one other.
          </Box>
          <CollectivesFigure />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured: four ranks, each array drawn as four quarters. Bytes per
            rank are the bandwidth-optimal figures in the nccl-tests performance notes{' '}
            <Cite tier={1} href={perf('L134-L145')}>
              nccl-tests PERFORMANCE.md L134-L145
            </Cite>
            ; S is the full array on every card, which for a reduce-scatter or an all-gather is the
            per-rank count times n{' '}
            <Cite tier={1} href={perf('L81')}>
              nccl-tests PERFORMANCE.md L81
            </Cite>
            .
          </Box>
          <Box variant="p">Where the rest of the dive meets each one:</Box>
          <WhereList />
          <Box variant="p">
            The published runs use them in exactly these roles. Llama 3&apos;s report names
            all-gather and reduce-scatter in FSDP and point-to-point in PP for its own training{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint" accessed={REGISTER_DATE}>
              Llama 3 Herd of Models, Section 3.3.3
            </Cite>
            ; Megatron&apos;s tensor parallelism runs two all-reduces per layer in the forward pass
            and two in the backward pass, on every micro-batch (one slice of the step&apos;s batch){' '}
            <Cite tier={3} href={PTDP} venue="SC 2021" accessed={REGISTER_DATE}>
              Efficient Large-Scale Language Model Training on GPU Clusters, Section 3.2
            </Cite>
            ; DeepSeek-V3 sends tokens to their experts with an all-to-all that crosses nodes{' '}
            <Cite tier={3} href={DSV3} venue="preprint">
              DeepSeek-V3, Section 3.2.2
            </Cite>
            . The inference form of the same collectives, tensor parallelism inside a serving engine,
            is in the <Link href="../vllm/">vLLM dive, section 9: Distributed Inference</Link> and the{' '}
            <Link href="../sglang/">SGLang dive, section 14: Parallelism: TP, DP Attention &amp; EP</Link>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Hold the one identity that sharding and sequence parallelism both rest on, and see why bytes per rank barely grow with the rank count"
          >
            All-reduce is a reduce-scatter followed by an all-gather
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A bandwidth-optimal all-reduce runs in two steps: a reduce-scatter leaves each rank with
            the sum of one slice, and an all-gather then copies every summed slice to every rank{' '}
            <Cite tier={3} href={ZERO} venue="preprint">
              ZeRO, Section 7.1
            </Cite>
            . Each step moves (n-1)/n of the array per rank, so the all-reduce moves 2(n-1)/n{' '}
            <Cite tier={1} href={perf('L52-L63')}>
              nccl-tests PERFORMANCE.md L52-L63
            </Cite>
            .
          </Box>
          <DecompositionDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured: four ranks, the array drawn as four quarters.
          </Box>
          <Box variant="p">
            Two consequences carry through the dive. First, swapping an all-reduce for a
            reduce-scatter and an all-gather costs no extra bytes: sequence parallelism does exactly
            that inside tensor-parallel layers{' '}
            <Cite tier={3} href={SP_PAPER} venue="MLSys 2023" accessed={REGISTER_DATE}>
              Reducing Activation Recomputation, Section 4.2.2
            </Cite>
            , and ZeRO shards gradients and optimizer state for the same
            2 x N elements per step as plain data parallelism at one micro-batch per step, N being
            the parameter count{' '}
            <Cite tier={3} href={ZERO} venue="preprint" accessed={REGISTER_DATE}>
              ZeRO, Section 7.2.1
            </Cite>{' '}
            (section 8, Data Parallelism &amp; Sharding). Same bytes is not always the same time:
            the sequence-parallelism paper measured the pair running slower than one all-reduce of
            the same data{' '}
            <Cite tier={3} href={SP_PAPER} venue="MLSys 2023" accessed={REGISTER_DATE}>
              Reducing Activation Recomputation, Section 6.2
            </Cite>
            . Second, 2(n-1)/n approaches 2 quickly, 1.75 at 8 ranks and 1.94 at 32 (our arithmetic),
            so spreading data parallelism over more ranks barely changes the bytes each rank sends.
            What changes is the link those bytes cross.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read an nccl-tests row as a time you can plan with and a bandwidth you can hold against the link's peak"
          >
            Reading a collective benchmark
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            nccl-tests, NVIDIA&apos;s collective benchmark, prints two bandwidths for every message
            size. Algorithm bandwidth is size over time, <code>algbw = S / t</code>: divide a message
            size by it to get the time. Bus bandwidth applies the collective&apos;s factor from the
            cards above, <code>busbw = algbw x 2(n-1)/n</code> for an all-reduce, so that the figure
            can be compared with the peak of the hardware link whatever the rank count{' '}
            <Cite tier={1} href={perf('L16-L29')}>
              nccl-tests PERFORMANCE.md L16-L29
            </Cite>
            . It should reflect the speed of the hardware bottleneck, whether NVLink or the
            network{' '}
            <Cite tier={1} href={perf('L145')}>
              nccl-tests PERFORMANCE.md L145
            </Cite>
            .
          </Box>
          <Box variant="p">
            A row from a sample output AWS publishes for two p5.48xlarge instances, 16 ranks, reads:
            17,179,869,184 bytes (16 GiB), 66,132 microseconds, algbw 259.78 GB/s, busbw 487.09
            GB/s{' '}
            <Cite tier={2} href={ADT_P5_SAMPLE} kind="vendor-claim">
              awsome-distributed-training nccl-tests README L206-L243
            </Cite>
            . The arithmetic checks: 17.18 GB / 0.0661 s = 259.8 GB/s, and 259.8 x 2 x 15/16 = 487
            GB/s. The sample states no NCCL or EFA version, so treat it as a vendor sample rather
            than a benchmark of current releases.
          </Box>
          <Box variant="p">
            Small messages measure latency and large ones bandwidth{' '}
            <Cite tier={1} href={perf('L5-L12')}>
              nccl-tests PERFORMANCE.md L5-L12
            </Cite>
            : the same sample reaches 105 GB/s of bus bandwidth at 16 MiB and 487 GB/s at 16 GiB.
            The bytes-per-rank bound holds for a ring, a tree or any other algorithm built from sends
            and receives{' '}
            <Cite tier={1} href={perf('L39')}>
              nccl-tests PERFORMANCE.md L39
            </Cite>
            . Algorithms differ in latency: a ring&apos;s grows linearly with the number of GPUs,
            while the double binary trees NCCL added in version 2.4 keep full bandwidth with
            logarithmic latency{' '}
            <Cite tier={2} href={NCCL_24_BLOG}>
              NVIDIA blog, NCCL 2.4
            </Cite>
            , and NCCL chooses among ring, tree and newer algorithms itself, a choice the{' '}
            <code>NCCL_ALGO</code> variable overrides{' '}
            <Cite tier={1} href={NCCL_ENV}>
              NCCL 2.32.3 environment variables, NCCL_ALGO
            </Cite>
            . Our reading of these sources: for a large gradient all-reduce the bytes term decides
            the time, and for the small per-layer messages of tensor parallelism the latency term
            does.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know the two numbers every estimate divides by: 450 GB/s per GPU inside the instance, 400 GB/s for the whole instance out of it"
          >
            The bandwidth hierarchy on a p5.48xlarge
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Inside a p5.48xlarge, each H100 has 900 GB/s of NVLink, the Hopper column of NVIDIA&apos;s
            per-GPU table; the same page calls the newest generation&apos;s 3 TB/s, the last column of
            that table, bidirectional, and read the same way 900 GB/s is 450 GB/s per direction{' '}
            <Cite tier={1} href={NVLINK_PAGE} kind="vendor-claim">
              NVIDIA NVLink specifications
            </Cite>
            . The instance has 3,200 Gb/s of EFA (Elastic Fabric Adapter) network bandwidth for its
            eight GPUs{' '}
            <Cite tier={1} href={EC2_ACCEL}>
              EC2 accelerated computing instance specifications
            </Cite>
            : 400 GB/s for the instance, 50 GB/s per GPU. Per GPU, NVLink is nine times EFA. All
            three figures are our arithmetic from those two pages, which print neither 450 nor 50,
            and AWS does not state whether its 3,200 Gb/s is per direction.
          </Box>
          <LinkHierarchyDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic, not measured. Each GPU&apos;s EFA share is drawn as one card for clarity; the
            figures are vendor peaks divided as in the text.
          </Box>
          <Box variant="p">
            The ratio belongs to the cluster, and designs follow it. DeepSeek&apos;s H800 cluster had
            160 GB/s of NVLink against 50 GB/s of InfiniBand, about 3.2 times, and DeepSeek-V3
            limited each token to at most four nodes to keep its expert traffic inside that budget{' '}
            <Cite tier={3} href={DSV3} venue="preprint">
              DeepSeek-V3, Section 3.2.2
            </Cite>
            . Section 21, Training Hardware on AWS, gives the EFA bandwidth per accelerator for the
            other training instances.
          </Box>
          <Box variant="p">
            Which number a collective pays depends on whether its bytes can be combined inside the
            instance before they leave it. Collectives that sum or gather (all-reduce,
            reduce-scatter, all-gather) can run their in-instance part on NVLink and send each
            instance&apos;s combined data across EFA, spread over all of the instance&apos;s network
            cards. NCCL assigns each ring or tree a network card, and with several cards per node
            tries to keep each ring on the same card from node to node{' '}
            <Cite tier={1} href={NCCL_ENV}>
              NCCL 2.32.3 environment variables, NCCL_CROSS_NIC
            </Cite>
            , and the AWS sample above reached 487 GB/s of all-reduce bus bandwidth across two
            instances, close to ten times one GPU&apos;s 50 GB/s share{' '}
            <Cite tier={2} href={ADT_P5_SAMPLE} kind="vendor-claim">
              awsome-distributed-training nccl-tests README L242
            </Cite>
            . Collectives whose bytes are addressed GPU to GPU (all-to-all, send and receive) cannot
            shrink at the boundary: every byte bound for another instance crosses, and each GPU pays
            its 50 GB/s share, nine times the cost of the same bytes on NVLink. This split is our
            reading of the NCCL documentation and the AWS sample; the evidence is under &quot;Why the
            crossing is priced per instance&quot; in the next block.
          </Box>
          <Box variant="p">
            How NCCL reaches EFA, through the aws-ofi-nccl plugin and the settings it needs, is in
            the{' '}
            <Link href="../efa/">EFA dive, section 9: NCCL over EFA: the aws-ofi-nccl Plugin</Link>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Turn a layout's collectives into milliseconds: Llama 3.1 8B's gradients take about 62 ms to all-reduce inside one instance, and the crossing between four instances costs about as much again"
          >
            Price a collective before you run it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The estimate is one division per link, <code>time on a link = bytes that cross it / its
            bandwidth</code>, set against the compute time of a step from section 4 (Counting the
            Arithmetic). The bytes come from the cards above. On a p5.48xlarge the bandwidths are 450
            GB/s per GPU inside the instance, and across instances 400 GB/s per instance for
            collectives that combine first, or 50 GB/s per GPU for bytes addressed GPU to GPU.
          </Box>
          <Box variant="p">
            Llama 3.1 8B has 8,030,261,248 parameters{' '}
            <Cite tier={1} href={HF_LLAMA_8B}>
              Hugging Face model metadata, Llama 3.1 8B
            </Cite>
            , so its BF16 (bfloat16, two bytes per value) gradients are 16.06 GB.
          </Box>
          <ul>
            <li>
              <strong>Inside one p5.48xlarge.</strong> An all-reduce over eight GPUs sends 2 x 7/8 x
              16.06 = 28.1 GB per GPU over NVLink: about 62 ms at 450 GB/s.
            </li>
            <li>
              <strong>Across four p5.48xlarge.</strong> Over 32 GPUs each GPU sends 2 x 31/32 x 16.06
              = 31.1 GB, almost the same bytes, and most of them stay on NVLink. What must cross EFA
              is each instance&apos;s combined gradient: treating each instance as one rank of the
              all-reduce, at least 2 x 3/4 x 16.06 = 24.1 GB per instance, about 60 ms at 400 GB/s.
            </li>
          </ul>
          <Box variant="small" color="text-body-secondary">
            Our arithmetic and our reading of the per-instance count. Assumptions: BF16 gradients
            reduced in BF16, one all-reduce per step, link peaks, no overlap with the backward pass.
          </Box>
          <Box variant="p">
            Both figures divide by link peaks. Achieved bus bandwidth on p5 at this dive&apos;s
            pinned software was not measured for this research, so treat every estimate here as the
            time at the link&apos;s full rate until a measured run replaces it.
          </Box>
          <ExpandableSection headerText="Why the crossing is priced per instance">
            <SpaceBetween size="s">
              <Box variant="p">
                The FSDP paper counts every byte a GPU sends in a flat all-reduce as cross-host
                traffic, 2M(W-1)/W per GPU for a gradient of M bytes over W GPUs{' '}
                <Cite tier={3} href={FSDP_PAPER} venue="PVLDB 16(12)">
                  PyTorch FSDP, Section 3.2.2
                </Cite>
                . Applied to the four-instance example, it gives 31.1 GB per GPU over 50 GB/s, 0.62
                s, ten times the in-instance time.
              </Box>
              <Box variant="p">
                The same count applied to AWS&apos;s two-instance sample predicts at least 2 x 15/16 x
                17.18 = 32.2 GB per GPU over 50 GB/s, 0.64 s, for its 16 GiB all-reduce; the sample
                took 66 ms{' '}
                <Cite tier={2} href={ADT_P5_SAMPLE} kind="vendor-claim">
                  awsome-distributed-training nccl-tests README L242
                </Cite>
                . Counting per instance predicts at least 2 x 1/2 x 17.18 = 17.2 GB per instance over
                400 GB/s, 43 ms, which the sample&apos;s 66 ms respects (our arithmetic on the
                sample&apos;s row). One vendor sample with no stated versions supports the
                per-instance count, so it stays our reading until a measured run on current releases
                confirms it; the protocol below is that run.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <ExpandableSection headerText="A1 protocol (not yet run)">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>What it would measure.</strong> nccl-tests <code>all_reduce_perf</code>,{' '}
                <code>reduce_scatter_perf</code>, <code>all_gather_perf</code> and{' '}
                <code>alltoall_perf</code> from 8 B to 16 GB, on one p5.48xlarge (NVLink) and on two
                (EFA), recording bus bandwidth and the EFA counters the EFA dive&apos;s Operations
                section names; then one all-reduce size repeated ten times with the outputs compared
                bitwise, a run-to-run determinism check (
                <Link external href={GUIDE_URL}>
                  research guide, section 5
                </Link>
                ).
              </Box>
              <Box variant="p">
                <strong>On what.</strong> Two p5.48xlarge in a cluster placement group on the Deep
                Learning Base GPU AMI (Amazon Machine Image) release 20261027, which ships EFA
                installer 1.51.0 and aws-ofi-nccl 1.22.0{' '}
                <Cite tier={1} href={DLAMI_20261027} accessed={REGISTER_DATE}>
                  DLAMI release notes, 20261027
                </Cite>
                . Instances from a Capacity Block (accelerators reserved for a fixed date window) take
                no placement group, because Capacity Blocks do not support one{' '}
                <Cite tier={1} href={CB_GUIDE} accessed={REGISTER_DATE}>
                  EC2 Capacity Blocks, considerations
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>Prediction, our reading and not a result.</strong> One instance: all-reduce
                bus bandwidth at the largest sizes in the region of the 450 GB/s NVLink figure. Two
                instances: all-reduce in the range of AWS&apos;s sample, 487 GB/s at 16 GiB, far above
                one GPU&apos;s 50 GB/s; all-to-all far lower, at most about 94 GB/s of bus bandwidth,
                because half of every GPU&apos;s data must leave the instance through its 50 GB/s
                share (our arithmetic: 100 GB/s of algorithm bandwidth x 15/16).
              </Box>
              <Box variant="p">
                <strong>Cost.</strong> About two hours on two instances: 2 x 2 x $55.04 = $220 at the
                On-Demand rate in us-east-1 on 2026-10-30{' '}
                <Cite tier={1} href={EC2_PRICE_LIST} accessed={REGISTER_DATE}>
                  AWS Price List, AmazonEC2 us-east-1, version 20261029175634
                </Cite>
                , once the account&apos;s On-Demand quota for P instances, which starts at 0 vCPUs
                (virtual CPUs), has been raised{' '}
                <Cite tier={1} href={OD_QUOTAS} accessed={REGISTER_DATE}>
                  EC2 On-Demand Instance quotas
                </Cite>
                . The research guide runs A1 with two other experiments in one 7-hour window: $771
                On-Demand, or $2,292 for a one-day Capacity Block for two instances at $47.757 per
                instance-hour in US East (N. Virginia) on 2026-10-30, a block being charged at the
                price quoted at purchase{' '}
                <Cite tier={1} href={CB_PRICING} accessed={REGISTER_DATE}>
                  EC2 Capacity Blocks pricing
                </Cite>
                . Teardown: one stack, deleted at the end and verified by listing instances by the
                stack&apos;s tag.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            To price a candidate layout before running it:
          </Box>
          <ol>
            <li>
              For each parallelism in the layout, name its collective and its bytes per rank from
              the cards; sections 8 to 12 give each parallelism&apos;s array size.
            </li>
            <li>
              Count how often each fires per step: data parallelism&apos;s gradient reduction once
              per step, or once per micro-batch when gradient sync is not deferred (section 8 gives
              the defaults); tensor parallelism&apos;s four all-reduces per layer on every
              micro-batch{' '}
              <Cite tier={3} href={PTDP} venue="SC 2021" accessed={REGISTER_DATE}>
                Efficient Large-Scale Language Model Training on GPU Clusters, Section 3.2
              </Cite>
              ; pipeline parallelism&apos;s send and receive on every micro-batch at every stage
              boundary.
            </li>
            <li>
              Assign each to its link: inside the instance at 450 GB/s per GPU; across instances at
              400 GB/s per instance when the collective combines first, and at 50 GB/s per GPU, nine
              times slower than NVLink, when its bytes are addressed GPU to GPU.
            </li>
            <li>
              Compare the totals with section 4&apos;s compute time per step. A collective whose
              time rivals the compute either overlaps with it (section 8 shows how data parallelism
              does) or belongs on a faster link.
            </li>
          </ol>
          <Box variant="p">
            Then replace the peaks with a measurement: at bring-up, section 31 runs nccl-tests on one
            instance and on two and reads the bus bandwidth against these figures, and that number
            goes into every estimate above.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
