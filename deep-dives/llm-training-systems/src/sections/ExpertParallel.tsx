import { useRef } from 'react';
import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, arxiv, gh, MEGATRON_TAG } from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import { DEEPSEEK_V3, DEFAULT_HEADROOM, GB, INSTANCES, moeShapeOf } from '../lib/presets';
import { evaluateMoeGrid, routedExpertParameters, type MoeCandidate, type MoeInput } from '../lib/parallelism';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** DeepSeek-V3 Technical Report: 2.1.2 routing and no dropping, 3.1 cluster, 3.2 layout, 3.2.1 ratio, 3.2.2 kernels, 3.3.3 precision, 4.2 shapes. */
const DSV3 = arxiv('2412.19437v2');
/** Switch Transformers (JMLR 23, 2022), Sec 2.2: expert capacity and dropped tokens. */
const SWITCH = arxiv('2101.03961v3');
/** GShard, Sec 3.3.2: AllToAll reshards tokens to experts and back. */
const GSHARD = arxiv('2006.16668v1');
/** MoE Parallel Folding (Megatron Core), Sec 3.2. */
const FOLDING = arxiv('2504.14960v3');
const NVLINK_PAGE = 'https://www.nvidia.com/en-us/data-center/nvlink/';
const EC2_ACCEL = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';
const P6_PAGE = 'https://aws.amazon.com/ec2/instance-types/p6/';

/** Megatron Core at the pinned tag. */
function mg(path: string, lines?: string): string {
  return gh('NVIDIA/Megatron-LM', MEGATRON_TAG, path, lines);
}
const MG_MOE_README = 'megatron/core/transformer/moe/README.md';
const MG_GUIDE = 'docs/user-guide/parallelism-guide.md';
const MG_PSTATE = 'megatron/core/parallel_state.py';
const MG_PCONFIG = 'megatron/core/model_parallel_config.py';
const MG_TCONFIG = 'megatron/core/transformer/transformer_config.py';
const MG_ROUTER = 'megatron/core/transformer/moe/router.py';
const MG_MOE_UTILS = 'megatron/core/transformer/moe/moe_utils.py';
const MG_COMBINED = 'megatron/core/pipeline_parallel/combined_1f1b.py';
const MG_ARGS = 'megatron/training/arguments.py';

/** Register rows cited without re-opening the source keep the register's date. */
const REGISTER_DATE = '2026-10-30';

/* ------------------------------------------------------------------------ */
/* Numbers from Calculator C's MoE mode (src/lib/parallelism.ts)            */
/* ------------------------------------------------------------------------ */

const DSV3_SHAPE = moeShapeOf(DEEPSEEK_V3);
/** 256 p5.48xlarge = 2,048 H100s, the GPU count of DeepSeek-V3's run. */
const ON_P5: MoeInput = { model: DSV3_SHAPE, instance: INSTANCES['p5.48xlarge'], instanceCount: 256 };
/** DeepSeek-V3's published degrees: PP 16, EP 64, no TP; DP and EDP follow from 2,048 GPUs. */
const DSV3_GRID = evaluateMoeGrid(ON_P5, { tp: 1, pp: 16, dp: 128, etp: 1, ep: 64, edp: 2 });
/** A grid that keeps every expert group inside one instance. */
const IN_INSTANCE_GRID = evaluateMoeGrid(ON_P5, { tp: 8, pp: 8, dp: 32, etp: 1, ep: 8, edp: 32 });
/** Megatron Core guide's DeepSeek-V3 row: 1,024 GPUs, TP 2, PP 16, CP 1, EP 64 (128 p5.48xlarge). */
const ON_1024: MoeInput = { ...ON_P5, instanceCount: 128 };
const GUIDE_DEFAULT_ETP = evaluateMoeGrid(ON_1024, { tp: 2, pp: 16, dp: 32, etp: 2, ep: 64, edp: 1 });
const GUIDE_ETP_1 = evaluateMoeGrid(ON_1024, { tp: 2, pp: 16, dp: 32, etp: 1, ep: 64, edp: 1 });

const ROUTED = routedExpertParameters(DSV3_SHAPE);
const TRAFFIC = DSV3_GRID.expertTraffic;
const MOE_LAYERS = DSV3_SHAPE.layers - DSV3_SHAPE.denseLayers;
/** One token's hidden state in BF16. */
const TOKEN_BYTES = DSV3_SHAPE.hidden * 2;

const kb = (bytes: number): string => `${Math.round(bytes / 1e3)} KB`;
const mb = (bytes: number): string => `${Math.round(bytes / 1e6)} MB`;
const gb1 = (bytes: number): string => `${(bytes / GB).toFixed(1)} GB`;
const int = (n: number): string => n.toLocaleString('en-US');

const DISPATCH_KB = kb(TRAFFIC.dispatchBytesPerTokenPerMoeLayer);
const COMBINE_KB = kb(TRAFFIC.combineBytesPerTokenPerMoeLayer);
const LAYER_KB = kb(TRAFFIC.bytesPerTokenPerMoeLayer);
const CROSS_KB = kb(TRAFFIC.crossNodeDispatchBytesPerTokenPerMoeLayer);
const ALL_LAYERS_MB = mb(TRAFFIC.bytesPerTokenAllMoeLayers);
const TOKEN_KB = kb(TOKEN_BYTES);
const TOKEN_MULTIPLE = Math.round(TRAFFIC.bytesPerTokenPerMoeLayer / TOKEN_BYTES);
const HEADROOM_GB = (DEFAULT_HEADROOM.value * DSV3_GRID.modelState.capacityBytes) / GB;
const CAPACITY_GB = DSV3_GRID.modelState.capacityBytes / GB;
const HEADROOM_PCT = Math.round(DEFAULT_HEADROOM.value * 100);

/* ------------------------------------------------------------------------ */
/* Diagram: one token's dispatch and combine across two instances           */
/* ------------------------------------------------------------------------ */

const INK = '#16191f';
const MUTED = '#414d5c';
const FONT = 'sans-serif';
const BLUE = '#0972d3';
const BLUE_FILL = '#f2f8fd';
const GREEN = '#037f0c';
const GREEN_FILL = '#ecf7ec';
const ORANGE = '#ec7211';
const ORANGE_FILL = '#fdf3ec';
const GREY = '#879596';
const PANEL_FILL = '#f4f4f4';
const TEAL = '#1f7a70';
const TEAL_FILL = '#e6f4f2';

type Role = 'token' | 'expert' | 'relay' | 'idle';

/** The token sits on GPU 6 of instance A; its experts are GPUs 1 and 3 of A and 0, 3 and 4 of B. */
const TOKEN_GPU = 6;
const EXPERTS_A = [1, 3];
const EXPERTS_B = [0, 3, 4];
const GPU_IDS = [0, 1, 2, 3, 4, 5, 6, 7];

function roleOf(instance: 'A' | 'B', gpu: number): Role {
  if (gpu === TOKEN_GPU) return instance === 'A' ? 'token' : 'relay';
  return (instance === 'A' ? EXPERTS_A : EXPERTS_B).includes(gpu) ? 'expert' : 'idle';
}

function roleStyle(role: Role): { fill: string; stroke: string } {
  if (role === 'token') return { fill: BLUE_FILL, stroke: BLUE };
  if (role === 'expert') return { fill: GREEN_FILL, stroke: GREEN };
  if (role === 'relay') return { fill: ORANGE_FILL, stroke: ORANGE };
  return { fill: '#ffffff', stroke: GREY };
}

const ROLE_LABEL: Record<Role, string> = { token: 'token', expert: 'expert', relay: 'forwards', idle: '' };

const ROUTE_LEGEND = [
  "Blue: the token's GPU. Green: the GPUs holding its experts. Orange: the one copy that crosses EFA and the GPU that forwards it.",
  `Combine runs the same routes in reverse: GPU ${TOKEN_GPU} of B sums its three experts' outputs before one copy crosses back.`,
  `DeepSeek-V3 caps a token at 4 nodes: at most ${CROSS_KB} of its ${DISPATCH_KB} dispatch crosses per MoE layer.`,
];

function GpuBox({ x, y, w, h, gpu, role, fs }: { x: number; y: number; w: number; h: number; gpu: number; role: Role; fs: number }) {
  const { fill, stroke } = roleStyle(role);
  const label = ROLE_LABEL[role];
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill={fill} stroke={stroke} strokeWidth={role === 'idle' ? 1 : 1.6} />
      <text
        x={cx}
        y={label ? y + h / 2 - 3 : y + h / 2 + fs / 3}
        fill={INK}
        fontSize={fs}
        fontWeight={600}
        fontFamily={FONT}
        textAnchor="middle"
      >
        GPU {gpu}
      </text>
      {label && (
        <text x={cx} y={y + h / 2 + fs + 1} fill={MUTED} fontSize={fs} fontFamily={FONT} textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  );
}

function RouteMarkers() {
  return (
    <defs>
      <marker id="expert-parallel-route-ah-g" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill={GREEN} />
      </marker>
      <marker id="expert-parallel-route-ah-o" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill={ORANGE} />
      </marker>
    </defs>
  );
}

/** A green connector with an arrowhead at (x, y2). */
function Hop({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  const back = y2 > y1 ? -2 : 2;
  return <line x1={x} y1={y1} x2={x} y2={y2 + back} stroke={GREEN} strokeWidth={2} markerEnd="url(#expert-parallel-route-ah-g)" />;
}

/** Wide layout: each instance is one row of eight GPUs with its NVLink switch drawn as a bar. */
const WIDE_ROUTE = { W: 880, H: 486, x0: 46, boxW: 88, step: 100, boxH: 48 };

function WideRouteBody() {
  const g = WIDE_ROUTE;
  const cx = (i: number) => g.x0 + i * g.step + g.boxW / 2;
  const left = g.x0;
  const right = g.x0 + 7 * g.step + g.boxW;
  const panelA = { y: 58, h: 140 };
  const barA = { y: 88, h: 20 };
  const rowA = 136;
  const panelB = { y: 272, h: 140 };
  const rowB = 288;
  const barB = { y: 364, h: 20 };
  const routeA = [TOKEN_GPU, ...EXPERTS_A];
  const routeB = [TOKEN_GPU, ...EXPERTS_B];
  return (
    <g>
      <rect x={0} y={0} width={g.W} height={g.H} rx={8} fill="#ffffff" />
      <text x={left} y={24} fill={INK} fontSize={13} fontWeight={600} fontFamily={FONT}>
        One token&apos;s dispatch under node-limited routing, across two instances
      </text>
      <text x={left} y={42} fill={MUTED} fontSize={11} fontFamily={FONT}>
        The token on GPU {TOKEN_GPU} of instance A goes to five experts: two on A, three on B.
      </text>

      <rect x={left - 12} y={panelA.y} width={right - left + 24} height={panelA.h} rx={6} fill={PANEL_FILL} stroke={GREY} strokeWidth={1} />
      <text x={left} y={78} fill={MUTED} fontSize={11} fontWeight={600} fontFamily={FONT}>
        Instance A: one p5.48xlarge, 8 GPUs
      </text>
      <rect x={left} y={barA.y} width={right - left} height={barA.h} rx={3} fill={TEAL_FILL} stroke={TEAL} strokeWidth={1} />
      <text x={(left + right) / 2} y={barA.y + 14} fill={INK} fontSize={11} fontFamily={FONT} textAnchor="middle">
        NVLink, 450 GB/s per GPU
      </text>
      <line x1={cx(Math.min(...routeA))} y1={barA.y + barA.h} x2={cx(Math.max(...routeA))} y2={barA.y + barA.h} stroke={GREEN} strokeWidth={3} />
      <Hop x={cx(TOKEN_GPU)} y1={rowA} y2={barA.y + barA.h + 1} />
      {EXPERTS_A.map((i) => (
        <Hop key={`wa-${i}`} x={cx(i)} y1={barA.y + barA.h} y2={rowA} />
      ))}
      {GPU_IDS.map((i) => (
        <GpuBox key={`wga-${i}`} x={g.x0 + i * g.step} y={rowA} w={g.boxW} h={g.boxH} gpu={i} role={roleOf('A', i)} fs={11} />
      ))}

      <text x={cx(TOKEN_GPU) - 16} y={232} fill={INK} fontSize={11} fontWeight={600} fontFamily={FONT} textAnchor="end">
        EFA: one copy crosses per remote instance
      </text>
      <text x={cx(TOKEN_GPU) - 16} y={249} fill={MUTED} fontSize={11} fontFamily={FONT} textAnchor="end">
        each GPU&apos;s share is 50 GB/s, a ninth of its NVLink
      </text>

      <rect x={left - 12} y={panelB.y} width={right - left + 24} height={panelB.h} rx={6} fill={PANEL_FILL} stroke={GREY} strokeWidth={1} />
      <rect x={left} y={barB.y} width={right - left} height={barB.h} rx={3} fill={TEAL_FILL} stroke={TEAL} strokeWidth={1} />
      <text x={(left + right) / 2} y={barB.y + 14} fill={INK} fontSize={11} fontFamily={FONT} textAnchor="middle">
        NVLink, 450 GB/s per GPU
      </text>
      <line x1={cx(Math.min(...routeB))} y1={barB.y} x2={cx(Math.max(...routeB))} y2={barB.y} stroke={GREEN} strokeWidth={3} />
      <Hop x={cx(TOKEN_GPU)} y1={rowB + g.boxH} y2={barB.y - 1} />
      {EXPERTS_B.map((i) => (
        <Hop key={`wb-${i}`} x={cx(i)} y1={barB.y} y2={rowB + g.boxH} />
      ))}
      {GPU_IDS.map((i) => (
        <GpuBox key={`wgb-${i}`} x={g.x0 + i * g.step} y={rowB} w={g.boxW} h={g.boxH} gpu={i} role={roleOf('B', i)} fs={11} />
      ))}
      <text x={left} y={402} fill={MUTED} fontSize={11} fontWeight={600} fontFamily={FONT}>
        Instance B: one p5.48xlarge, 8 GPUs
      </text>
      <line x1={cx(TOKEN_GPU)} y1={rowA + g.boxH} x2={cx(TOKEN_GPU)} y2={rowB - 2} stroke={ORANGE} strokeWidth={3} markerEnd="url(#expert-parallel-route-ah-o)" />

      {ROUTE_LEGEND.map((line, i) => (
        <text key={line} x={left - 4} y={438 + i * 18} fill={MUTED} fontSize={11} fontFamily={FONT}>
          {line}
        </text>
      ))}
    </g>
  );
}

/**
 * Narrow layout: each instance is two rows of four GPUs with the NVLink bar between them.
 * Instance B is drawn mirrored (GPUs 4 to 7 on top) so the token's GPU 6 sits straight above
 * B's GPU 6 and the EFA hop crosses nothing.
 */
const NARROW_ROUTE = { W: 400, H: 536, x0: 16, boxW: 84, step: 96, boxH: 44, fs: 12 };

function NarrowRouteBody() {
  const g = NARROW_ROUTE;
  const left = g.x0;
  const right = g.x0 + 3 * g.step + g.boxW;
  const col = (gpu: number) => gpu % 4;
  const cx = (gpu: number) => g.x0 + col(gpu) * g.step + g.boxW / 2;
  // Instance A: GPUs 0-3 on top, bar, GPUs 4-7 below.
  const aTop = 94;
  const aBar = { y: 162, h: 20 };
  const aBottom = 206;
  // Instance B, mirrored: GPUs 4-7 on top, bar, GPUs 0-3 below.
  const bTop = 340;
  const bBar = { y: 408, h: 20 };
  const bBottom = 452;
  const yA = (gpu: number) => (gpu < 4 ? aTop : aBottom);
  const yB = (gpu: number) => (gpu >= 4 ? bTop : bBottom);
  const hopToBar = (gpuY: number, bar: { y: number; h: number }) =>
    gpuY < bar.y ? { from: gpuY + g.boxH, to: bar.y } : { from: gpuY, to: bar.y + bar.h };
  const tokenHopA = hopToBar(yA(TOKEN_GPU), aBar);
  const tokenHopB = hopToBar(yB(TOKEN_GPU), bBar);
  return (
    <g>
      <rect x={0} y={0} width={g.W} height={g.H} rx={8} fill="#ffffff" />
      <text x={left} y={22} fill={INK} fontSize={13} fontWeight={600} fontFamily={FONT}>
        Node-limited dispatch of one token
      </text>
      <text x={left} y={41} fill={MUTED} fontSize={g.fs} fontFamily={FONT}>
        GPU {TOKEN_GPU} of instance A sends the token to five
      </text>
      <text x={left} y={57} fill={MUTED} fontSize={g.fs} fontFamily={FONT}>
        experts: two on A, three on B.
      </text>

      <rect x={left - 8} y={66} width={right - left + 16} height={196} rx={6} fill={PANEL_FILL} stroke={GREY} strokeWidth={1} />
      <text x={left} y={84} fill={MUTED} fontSize={g.fs} fontWeight={600} fontFamily={FONT}>
        Instance A: p5.48xlarge
      </text>
      <rect x={left} y={aBar.y} width={right - left} height={aBar.h} rx={3} fill={TEAL_FILL} stroke={TEAL} strokeWidth={1} />
      <text x={(left + right) / 2} y={aBar.y + 14} fill={INK} fontSize={g.fs} fontFamily={FONT} textAnchor="middle">
        NVLink, 450 GB/s per GPU
      </text>
      <Hop x={cx(TOKEN_GPU)} y1={tokenHopA.from} y2={tokenHopA.to} />
      {EXPERTS_A.map((i) => {
        const h = hopToBar(yA(i), aBar);
        return <Hop key={`na-${i}`} x={cx(i)} y1={h.to} y2={h.from} />;
      })}
      {GPU_IDS.map((i) => (
        <GpuBox key={`nga-${i}`} x={g.x0 + col(i) * g.step} y={yA(i)} w={g.boxW} h={g.boxH} gpu={i} role={roleOf('A', i)} fs={g.fs} />
      ))}

      <text x={cx(TOKEN_GPU) - 12} y={286} fill={INK} fontSize={g.fs} fontWeight={600} fontFamily={FONT} textAnchor="end">
        EFA: one copy per remote instance
      </text>
      <text x={cx(TOKEN_GPU) - 12} y={303} fill={MUTED} fontSize={g.fs} fontFamily={FONT} textAnchor="end">
        50 GB/s per GPU, a ninth of NVLink
      </text>

      <rect x={left - 8} y={322} width={right - left + 16} height={204} rx={6} fill={PANEL_FILL} stroke={GREY} strokeWidth={1} />
      <rect x={left} y={bBar.y} width={right - left} height={bBar.h} rx={3} fill={TEAL_FILL} stroke={TEAL} strokeWidth={1} />
      <text x={(left + right) / 2} y={bBar.y + 14} fill={INK} fontSize={g.fs} fontFamily={FONT} textAnchor="middle">
        NVLink, 450 GB/s per GPU
      </text>
      <Hop x={cx(TOKEN_GPU)} y1={tokenHopB.from} y2={tokenHopB.to} />
      {EXPERTS_B.map((i) => {
        const h = hopToBar(yB(i), bBar);
        return <Hop key={`nb-${i}`} x={cx(i)} y1={h.to} y2={h.from} />;
      })}
      {GPU_IDS.map((i) => (
        <GpuBox key={`ngb-${i}`} x={g.x0 + col(i) * g.step} y={yB(i)} w={g.boxW} h={g.boxH} gpu={i} role={roleOf('B', i)} fs={g.fs} />
      ))}
      <text x={left} y={514} fill={MUTED} fontSize={g.fs} fontWeight={600} fontFamily={FONT}>
        Instance B: p5.48xlarge
      </text>
      <line x1={cx(TOKEN_GPU)} y1={yA(TOKEN_GPU) + g.boxH} x2={cx(TOKEN_GPU)} y2={yB(TOKEN_GPU) - 2} stroke={ORANGE} strokeWidth={3} markerEnd="url(#expert-parallel-route-ah-o)" />
    </g>
  );
}

function RouteDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, 700);
  const g = narrow ? NARROW_ROUTE : WIDE_ROUTE;
  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${g.W} ${g.H}`}
        role="img"
        aria-labelledby="expert-parallel-route-title"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <title id="expert-parallel-route-title">
          One token&apos;s dispatch under node-limited routing across two instances of eight GPUs. The
          token sits on GPU 6 of instance A and is routed to five experts, two on instance A and three
          on instance B. Inside instance A it reaches its two experts over NVLink. One copy crosses
          EFA to GPU 6 of instance B, the GPU with the same index, which forwards it over NVLink to
          the three experts there. Combine runs the same routes in reverse, with instance B summing
          its experts&apos; outputs before one copy crosses back. Each GPU&apos;s share of EFA is 50
          GB/s, a ninth of its 450 GB/s of NVLink.
        </title>
        <RouteMarkers />
        {narrow ? <NarrowRouteBody /> : <WideRouteBody />}
      </svg>
      {narrow && (
        <Box variant="small" color="text-body-secondary" margin={{ top: 'xs' }}>
          {ROUTE_LEGEND.join(' ')}
        </Box>
      )}
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

function GridTable() {
  const g = DSV3_GRID.grid;
  const rows = [
    {
      layers: 'Attention and dense layers',
      grid: `TP ${g.tp} x CP 1 x DP ${g.dp} x PP ${g.pp}`,
      product: DSV3_GRID.attentionGrid.product,
      state: DSV3_GRID.modelState.attentionGridBytesPerRank,
    },
    {
      layers: 'Expert layers',
      grid: `ETP ${g.etp} x EP ${g.ep} x EDP ${g.edp} x PP ${g.pp}`,
      product: DSV3_GRID.expertGrid.product,
      state: DSV3_GRID.modelState.expertGridBytesPerRank,
    },
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>Layers</th>
            <th style={headCell}>Grid</th>
            <th style={headCell}>Product</th>
            <th style={headCell}>Model state per GPU</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.layers}>
              <td style={cell}>{r.layers}</td>
              <td style={cell}>{r.grid}</td>
              <td style={cell}>{int(r.product)}</td>
              <td style={cell}>{gb1(r.state)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function shortGrid(c: MoeCandidate): string {
  const g = c.grid;
  return `attention TP ${g.tp} x PP ${g.pp} x DP ${g.dp}; experts ETP ${g.etp} x EP ${g.ep} x EDP ${g.edp}`;
}

const CANDIDATES = [
  {
    name: "DeepSeek-V3's degrees",
    c: DSV3_GRID,
    link: `EFA between ${DSV3_GRID.grid.ep / 8} instances; node-limited dispatch crosses at most ${CROSS_KB} per token per layer`,
  },
  { name: 'Experts inside one instance', c: IN_INSTANCE_GRID, link: 'NVLink only' },
];

function CandidateTable() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, 520);
  return (
    <div ref={ref}>
      {narrow ? (
        <SpaceBetween size="s">
          {CANDIDATES.map((r) => (
            <div key={r.name} style={{ borderBottom: '1px solid #e9ebed', paddingBottom: 8 }}>
              <Box variant="p" margin={{ bottom: 'xxs' }}>
                <strong>{r.name}:</strong> {shortGrid(r.c)}
              </Box>
              <Box variant="p" margin={{ bottom: 'xxs' }}>
                All-to-all: {r.link}
              </Box>
              <Box variant="p">
                Model state per GPU: {gb1(r.c.modelState.totalBytesPerRank)}. Activations: {r.c.activations}.
              </Box>
            </div>
          ))}
        </SpaceBetween>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={headCell}>Candidate grid to test</th>
                <th style={headCell}>Where the all-to-all runs</th>
                <th style={headCell}>Model state per GPU</th>
                <th style={headCell}>Activations</th>
              </tr>
            </thead>
            <tbody>
              {CANDIDATES.map((r) => (
                <tr key={r.name}>
                  <td style={cell}>
                    <strong>{r.name}:</strong> {shortGrid(r.c)}
                  </td>
                  <td style={cell}>{r.link}</td>
                  <td style={cell}>{gb1(r.c.modelState.totalBytesPerRank)}</td>
                  <td style={cell}>{r.c.activations}</td>
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
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function ExpertParallel() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={`Place experts so the all-to-all stays inside the fast domain, and size the expert grid separately from the dense one: DeepSeek-V3 sends about ${LAYER_KB} per token per mixture-of-experts (MoE) layer in the forward pass alone (Megatron Core core_v0.20.0, read 2026-10-31)`}
          >
            12. Mixture of Experts: Expert Parallelism
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A mixture-of-experts layer replaces a transformer layer&apos;s single feed-forward block with
            many smaller ones, the experts, and a router that sends each token to k of the E experts.
            The model holds every expert&apos;s weights while each token computes with only k of them.
            Why that sparsity pays and how inference dispatches tokens are in the{' '}
            <Link href="../silicon-memory-inference/">
              Silicon, Memory and Modern Inference dive, section 25: Mixture of Experts and Sparse
              Activation
            </Link>
            . This section keeps what training adds.
          </Box>
          <Box variant="p">
            Training adds three things. EP (expert parallelism) places the experts on different GPUs,
            and the backward pass repeats every token exchange, so each MoE layer runs four all-to-alls
            for every micro-batch. A capacity factor decides how many tokens an expert accepts. And the expert layers
            want a different split from attention, so an MoE model runs on two grids at once. The
            challenge is placement: where the experts sit decides whether every token&apos;s copies ride
            NVLink inside an instance or EFA (Elastic Fabric Adapter) between instances.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Count what expert parallelism moves before you place it: k copies of each token's hidden state per MoE layer, out and back, about ${LAYER_KB} per token per layer for DeepSeek-V3 in the forward pass`}
          >
            Dispatch and combine: k copies of every token, out and back
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each MoE layer runs two exchanges. Dispatch sends every token&apos;s hidden state, the
            vector of h values that carries the token between layers, from the GPU that holds the token
            to the GPUs that hold its experts. Combine returns each expert&apos;s output to the
            token&apos;s GPU, which adds them up. Both are all-to-alls, the collective in which every
            GPU sends a different slice of its data to every other GPU (section 7, Collectives &amp;
            What They Cost); GShard uses an AllToAll to reshard tokens to experts and another to bring
            them back{' '}
            <Cite tier={3} href={GSHARD} venue="preprint">
              GShard, Section 3.3.2 and Figure 8
            </Cite>
            . The backward pass runs both again in the opposite direction, carrying gradients (our
            reading).
          </Box>
          <Box variant="p">
            Per MoE layer, the bytes that leave one GPU in the forward pass come to about
          </Box>
          <Box variant="p">
            <code>2 x T x k x h x bytes per value x (EP - 1) / EP</code>
          </Box>
          <Box variant="p">
            with T tokens on the GPU, k experts per token, hidden size h, and EP the expert-parallel
            degree, the number of GPUs the experts are spread over; (EP - 1)/EP is the share of a
            token&apos;s experts on other GPUs when routing is even. The backward pass moves the same
            again. The formula is our derivation; no source located in this research prints it for
            top-k routing. It counts before capacity padding and before per-node de-duplication.
          </Box>
          <Box variant="p">
            DeepSeek-V3 has a hidden size of 7,168 and sends each token to 8 of 256 routed experts in 58
            of its 61 layers, the first three being dense{' '}
            <Cite tier={3} href={DSV3} venue="preprint">
              DeepSeek-V3 Technical Report, Section 4.2
            </Cite>
            . It dispatches in FP8 (8-bit floating point, one byte per value) and combines in BF16
            (bfloat16, two bytes per value){' '}
            <Cite tier={3} href={DSV3} venue="preprint">
              DeepSeek-V3 Technical Report, Section 3.3.3
            </Cite>
            . Per token, per MoE layer, in the forward pass:
          </Box>
          <ul>
            <li>
              <strong>Dispatch:</strong> <code>8 x 7,168 x 1 byte</code> = {DISPATCH_KB}.
            </li>
            <li>
              <strong>Combine:</strong> <code>8 x 7,168 x 2 bytes</code> = {COMBINE_KB}.
            </li>
            <li>
              <strong>Together:</strong> {LAYER_KB}, {TOKEN_MULTIPLE} times the token&apos;s own{' '}
              {TOKEN_KB} hidden state in BF16; across the {MOE_LAYERS} MoE layers, about{' '}
              {ALL_LAYERS_MB} per token, before the backward pass repeats it.
            </li>
          </ul>
          <Box variant="small" color="text-body-secondary">
            Our arithmetic on the paper&apos;s figures, the same count Calculator C&apos;s MoE mode
            makes (section 14, Set My Ranks: The Sizing Procedure). It counts every copy, including any
            whose expert sits on the token&apos;s own GPU.
          </Box>
          <Box variant="p">
            The formula has no term for the number of experts or for their size. The bytes follow k and
            h, so a model built from many small experts, with more of them active per token, moves more
            bytes per token while each expert&apos;s matrices shrink (our reading of the formula). That
            is why the expert layers favour a different split from attention, as the layout block below
            shows.
          </Box>
          <Box variant="p">
            Price the exchange per GPU. Its bytes are addressed GPU to GPU, so every copy bound for
            another instance crosses EFA: an instance&apos;s crossing is its eight GPUs&apos; distinct
            copies over its 400 GB/s, the same as each GPU sending its own over a 50 GB/s share. A
            p5.48xlarge, an Amazon EC2 (Elastic Compute Cloud) instance,
            carries eight H100s and 3,200 Gb/s of EFA{' '}
            <Cite tier={1} href={EC2_ACCEL} accessed={REGISTER_DATE}>
              EC2 accelerated computing instance specifications
            </Cite>
            , against 450 GB/s per GPU per direction on NVLink{' '}
            <Cite tier={1} href={NVLINK_PAGE} kind="vendor-claim" accessed={REGISTER_DATE}>
              NVIDIA NVLink specifications
            </Cite>{' '}
            (our arithmetic). A copy costs nine times as much once it leaves the instance.
          </Box>
          <Box variant="p">
            The capacity factor sizes each expert&apos;s intake. Switch Transformer sets{' '}
            <code>expert capacity = (tokens per batch / number of experts) x capacity factor</code>: 1.0
            is an even share, a larger factor leaves room for uneven routing at a cost in computation
            and memory, and a token past its expert&apos;s capacity is dropped, skipping the expert and
            passing to the next layer through the residual connection{' '}
            <Cite tier={3} href={SWITCH} venue="JMLR 23 (2022)" accessed={REGISTER_DATE}>
              Switch Transformers, Section 2.2
            </Cite>
            . Megatron Core drops tokens only when a capacity factor is set{' '}
            <Cite tier={1} href={mg(MG_ROUTER, 'L1105-L1114')} kind="code">
              Megatron Core router.py L1105-L1114
            </Cite>
            , and its default sets none{' '}
            <Cite tier={1} href={mg(MG_TCONFIG, 'L1024-L1026')} kind="code">
              Megatron Core transformer_config.py L1024-L1026
            </Cite>
            . DeepSeek-V3 dropped no tokens in training, crediting its load balancing{' '}
            <Cite tier={3} href={DSV3} venue="preprint">
              DeepSeek-V3 Technical Report, Section 2.1.2
            </Cite>
            .
          </Box>
          <ExpandableSection headerText={`The arithmetic behind ${LAYER_KB}, and how Megatron Core counts capacity under top-k routing`}>
            <SpaceBetween size="s">
              <Box variant="p">
                Dispatch: 8 x 7,168 x 1 = 57,344 bytes. Combine: 8 x 7,168 x 2 = 114,688 bytes. Together
                172,032 bytes per token per MoE layer; times {MOE_LAYERS} MoE layers (61 - 3) ={' '}
                {int(TRAFFIC.bytesPerTokenAllMoeLayers)} bytes. One BF16 hidden state is 7,168 x 2 ={' '}
                {int(TOKEN_BYTES)} bytes, and 172,032 / 14,336 = {TOKEN_MULTIPLE}.
              </Box>
              <Box variant="p">
                Megatron Core counts the even share over every token&apos;s k choices: it calls its
                capacity function with the token count times top-k{' '}
                <Cite tier={1} href={mg(MG_MOE_UTILS, 'L1097-L1102')} kind="code">
                  Megatron Core moe_utils.py L1097-L1102
                </Cite>
                , which returns <code>ceil(tokens / experts x capacity factor)</code>{' '}
                <Cite tier={1} href={mg(MG_MOE_UTILS, 'L273')} kind="code">
                  moe_utils.py L273
                </Cite>
                , so a factor of 1.0 gives each expert exactly its even share of the T x k assignments
                (our reading of the code).
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="When experts must span instances, borrow DeepSeek-V3's routing: each token reaches at most four nodes, crosses the network once per node, and fans out over NVLink"
          >
            Cross the slow link once, then fan out on NVLink
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            DeepSeek-V3 trained on 2,048 H800 GPUs, eight per node on NVLink and NVSwitch{' '}
            <Cite tier={3} href={DSV3} venue="preprint">
              DeepSeek-V3 Technical Report, Section 3.1
            </Cite>
            , with 16-way pipeline parallelism, 64-way expert parallelism spanning 8 nodes, ZeRO-1 data
            parallelism (the Zero Redundancy Optimizer&apos;s first stage, which shards optimizer
            state across data-parallel ranks) and no tensor parallelism{' '}
            <Cite tier={3} href={DSV3} venue="preprint">
              DeepSeek-V3 Technical Report, Section 3.2
            </Cite>
            . Spreading the experts across nodes left computation and communication at about 1:1{' '}
            <Cite tier={3} href={DSV3} venue="preprint">
              DeepSeek-V3 Technical Report, Section 3.2.1
            </Cite>
            , so the team built its routing and its pipeline schedule around the network. Section 10
            (Pipeline Parallelism &amp; the Bubble) covers the schedule, DualPipe; the routing decides
            what crosses the network.
          </Box>
          <Box variant="p">
            Node-limited routing sends each token to at most M = 4 nodes, chosen by the sum of the
            highest expert scores on each node{' '}
            <Cite tier={3} href={DSV3} venue="preprint">
              DeepSeek-V3 Technical Report, Sections 2.1.2 and 4.2
            </Cite>
            . A token crosses InfiniBand once per target node, to the GPU with the same index inside
            that node, and that GPU forwards it over NVLink to the GPUs that hold its experts; combine
            runs the same routes in reverse, accumulating the expert outputs before they cross back.
            With NVLink at 160 GB/s, about 3.2 times InfiniBand&apos;s 50 GB/s, a token reaches an
            average of 3.2 experts per node at no extra NVLink cost, so 4 nodes could serve up to 13
            experts for the same communication cost{' '}
            <Cite tier={3} href={DSV3} venue="preprint">
              DeepSeek-V3 Technical Report, Section 3.2.2
            </Cite>
            .
          </Box>
          <RouteDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured: two instances and five experts for legibility. The routes
            follow DeepSeek-V3&apos;s Section 3.2.2; the link figures are vendor peaks per GPU on a
            p5.48xlarge.
          </Box>
          <Box variant="p">
            The cap bounds what crosses. At most 4 copies of a DeepSeek-V3 token&apos;s dispatch leave
            for other nodes, <code>4 x 7,168 x 1 byte</code> = {CROSS_KB} per token per MoE layer,
            where a copy per expert would be {DISPATCH_KB} (our arithmetic, the same count as
            Calculator C). It is the pattern of section 8&apos;s HSDP (hybrid sharded data parallel)
            applied to tokens: cross the slow link once, fan out on the fast one.
          </Box>
          <Box variant="p">
            The ratio on AWS is steeper: nine times on a p5.48xlarge, where DeepSeek&apos;s cluster had
            3.2. EP 64 spans 8 p5.48xlarge, so every copy bound for another instance pays it. The same
            64 GPUs fit inside one 72-GPU P6e-GB200 UltraServer, which puts up to 72 Blackwell GPUs
            in one NVLink domain{' '}
            <Cite tier={1} href={P6_PAGE}>
              Amazon EC2 P6 instances, P6e UltraServers
            </Cite>
            , and there the exchange need not leave NVLink (our arithmetic). Section 21, Training
            Hardware on AWS, gives the scale-up domain of each training instance.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Lay out attention and experts on separate grids that share only the pipeline, and check that each multiplies to the world size before the framework does"
          >
            An MoE model runs two layouts at once
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A layout is a grid of GPUs with one axis per kind of parallelism. Each axis has a degree,
            the number of GPUs it splits across, and the degrees multiply to the world size, the number
            of GPUs in the job (section 7). Megatron Core&apos;s MoE Parallel Folding gives the
            attention layers a grid of TP (tensor parallelism) x CP (context parallelism) x DP (data
            parallelism) x PP (pipeline parallelism), and the expert layers their own grid of ETP
            (expert tensor parallelism) x EP x EDP (expert data parallelism) x PP. The two grids share
            only the pipeline{' '}
            <Cite tier={1} href={mg(MG_MOE_README, 'L332-L336')}>
              Megatron Core MoE guide L332-L336
            </Cite>{' '}
            <Cite tier={3} href={FOLDING} venue="preprint" accessed={REGISTER_DATE}>
              MoE Parallel Folding, Section 3.2
            </Cite>
            . That lifts the older rule that EP be a sub-group of DP, which capped EP at the DP degree{' '}
            <Cite tier={1} href={mg(MG_MOE_README, 'L326-L327')}>
              Megatron Core MoE guide L326-L327
            </Cite>
            .
          </Box>
          <Box variant="p">
            The code builds the expert grid on its own. Megatron Core sets ETP to the TP degree when
            none is given, multiplies ETP x EP x PP, takes EDP as the world size divided by that
            product, and stops with a <code>RuntimeError</code> when it does not divide{' '}
            <Cite tier={1} href={mg(MG_PSTATE, 'L946-L960')} kind="code">
              Megatron Core parallel_state.py L946-L960
            </Cite>
            . Both products must equal the world size. For DeepSeek-V3&apos;s degrees on 2,048 GPUs,
            with model state (weights, gradients and optimizer state) per GPU:
          </Box>
          <GridTable />
          <Box variant="small" color="text-body-secondary">
            DP {DSV3_GRID.grid.dp} and EDP {DSV3_GRID.grid.edp} are our arithmetic on the published
            degrees (2,048 / 16 and 2,048 / (64 x 16)). Model state from Calculator C&apos;s MoE mode
            on 256 p5.48xlarge: 16 bytes per parameter for mixed-precision Adam, optimizer state
            sharded over DP and EDP, averaged across pipeline stages. Activations, the tensors the
            forward pass keeps for the backward pass, are not modelled.
          </Box>
          <Box variant="p">
            The expert grid carries most of the model. DeepSeek-V3 has 671 billion parameters, 37
            billion of them active per token{' '}
            <Cite tier={3} href={DSV3} venue="preprint">
              DeepSeek-V3 Technical Report, Section 4.2
            </Cite>
            ; a token skips 248 of the 256 routed experts, so the 634 billion it skips are 248/256 of
            the routed weights, {(ROUTED / 1e9).toFixed(1)} billion, or{' '}
            {Math.round((ROUTED / DSV3_SHAPE.totalParameters) * 1000) / 10}% of the model (our
            arithmetic, as Calculator C counts it). Shrinking EP raises every GPU&apos;s share of those
            weights without changing the attention grid. That is the mental model: one MoE model, two
            parallel layouts.
          </Box>
          <Box variant="p">
            Megatron Core&apos;s parallelism guide gives a single formula instead,{' '}
            <code>Total GPUs = TP x PP x CP x EP x DP</code>{' '}
            <Cite tier={1} href={mg(MG_GUIDE, 'L174-L180')} kind="doc-code-conflict">
              Megatron Core parallelism guide L174-L180
            </Cite>
            , which the code above does not follow; under the code the guide&apos;s own DeepSeek-V3
            row holds only with ETP 1.
          </Box>
          <ExpandableSection headerText="The guide's DeepSeek-V3 row, checked against the code">
            <SpaceBetween size="s">
              <Box variant="p">
                The row is 1,024 GPUs at TP 2, PP 16, CP 1 and EP 64{' '}
                <Cite tier={1} href={mg(MG_GUIDE, 'L166-L170')} kind="doc-code-conflict">
                  Megatron Core parallelism guide L166-L170
                </Cite>
                . The guide&apos;s formula gives 2 x 16 x 64 = 2,048 before any DP, more than the
                row&apos;s GPUs. Calculator C&apos;s world-size check on 1,024 GPUs:
              </Box>
              <ul>
                <li>
                  Attention grid, TP 2 x PP 16 x DP 32 = {int(GUIDE_DEFAULT_ETP.attentionGrid.product)}:{' '}
                  {GUIDE_DEFAULT_ETP.attentionGrid.matchesWorldSize ? 'passes' : 'fails'}.
                </li>
                <li>
                  Expert grid at the default ETP = TP = 2, 2 x 64 x 16 ={' '}
                  {int(GUIDE_DEFAULT_ETP.expertGrid.product)} on {int(GUIDE_DEFAULT_ETP.worldSize)} GPUs:{' '}
                  {GUIDE_DEFAULT_ETP.expertGrid.matchesWorldSize ? 'passes' : 'fails, and Megatron Core stops'}.
                </li>
                <li>
                  Expert grid with <code>--expert-tensor-parallel-size 1</code>, 1 x 64 x 16 ={' '}
                  {int(GUIDE_ETP_1.expertGrid.product)}, EDP 1:{' '}
                  {GUIDE_ETP_1.expertGrid.matchesWorldSize ? 'passes' : 'fails'}.
                </li>
              </ul>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            The code is the authority: check both grids, and set ETP rather than inherit it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Turn an MoE model and a cluster into two or three candidate grids, then measure a step of each before you choose"
          >
            Set the expert grid
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol>
            <li>
              <strong>Keep EP x ETP inside the NVLink domain.</strong> Megatron Core&apos;s MoE guide
              asks that EP x TP fit within one node, typically 8 GPUs, and beyond one node prefers
              pipeline parallelism over spreading TP or EP across nodes{' '}
              <Cite tier={1} href={mg(MG_MOE_README, 'L182-L197')}>
                Megatron Core MoE guide L182-L197
              </Cite>
              . That is 8 GPUs on a p5.48xlarge and up to 72 on a P6e-GB200 UltraServer. DeepSeek-V3
              took the other road, EP 64 across 8 nodes with {LAYER_KB} per token per MoE layer, and
              paid for it with node-limited routing and a schedule built to hide a 1:1 ratio; on p5
              every copy that crosses costs nine times NVLink.
            </li>
            <li>
              <strong>Prefer EP over TP for the experts.</strong> The guide reports EP 8 x TP 1
              outperforming EP 4 x TP 2 for Mixtral 8x7B{' '}
              <Cite tier={1} href={mg(MG_MOE_README, 'L207-L216')}>
                Megatron Core MoE guide L207-L216
              </Cite>{' '}
              and recommends ETP 1 for fine-grained models, many small experts with several active
              per token, such as DeepSeek-V3&apos;s 256 experts of intermediate size 2,048{' '}
              <Cite tier={1} href={mg(MG_MOE_README, 'L524')}>
                Megatron Core MoE guide L524
              </Cite>
              . Pass <code>--expert-tensor-parallel-size 1</code> explicitly: left unset, ETP takes the
              TP degree{' '}
              <Cite tier={1} href={mg(MG_PCONFIG, 'L551-L552')} kind="code">
                Megatron Core model_parallel_config.py L551-L552
              </Cite>
              .
            </li>
            <li>
              <strong>Check the world size against both grids.</strong> TP x CP x DP x PP must equal the
              GPU count{' '}
              <Cite tier={1} href={mg(MG_ARGS, 'L468-L495')} kind="code">
                Megatron-LM arguments.py L468-L495
              </Cite>
              , and so must ETP x EP x EDP x PP{' '}
              <Cite tier={1} href={mg(MG_PSTATE, 'L946-L960')} kind="code">
                Megatron Core parallel_state.py L946-L960
              </Cite>
              . The expert count must be a multiple of EP{' '}
              <Cite tier={1} href={mg(MG_ARGS, 'L1567-L1571')} kind="code">
                Megatron-LM arguments.py L1567-L1571
              </Cite>
              .
            </li>
            <li>
              <strong>Choose a dispatcher that exchanges tokens.</strong> Megatron Core&apos;s default
              token dispatcher is <code>allgather</code>{' '}
              <Cite tier={1} href={mg(MG_TCONFIG, 'L998-L1000')} kind="code">
                Megatron Core transformer_config.py L998-L1000
              </Cite>
              . Its guide recommends <code>alltoall</code> for EP above 1 and the <code>flex</code>{' '}
              dispatcher with DeepSeek&apos;s DeepEP backend for cross-node EP, which removes redundant
              tokens on the cross-node leg{' '}
              <Cite tier={1} href={mg(MG_MOE_README, 'L307-L313')}>
                Megatron Core MoE guide L307-L313
              </Cite>
              , on our reading the per-node de-duplication of the diagram above.
            </li>
            <li>
              <strong>Hide the exchange behind the other micro-batch.</strong> For MoE, Megatron Core
              runs one micro-batch&apos;s forward pass beside another&apos;s backward, so that each
              all-to-all hides behind the other&apos;s computation{' '}
              <Cite tier={1} href={mg(MG_COMBINED, 'L54-L61')} kind="code">
                Megatron Core combined_1f1b.py L54-L61
              </Cite>
              , with <code>--overlap-moe-expert-parallel-comm</code> and{' '}
              <code>--delay-wgrad-compute</code>, both off by default{' '}
              <Cite tier={1} href={mg(MG_MOE_README, 'L433-L438')}>
                Megatron Core MoE guide L433-L438
              </Cite>{' '}
              <Cite tier={1} href={mg(MG_MOE_README, 'L563-L564')}>
                L563-L564
              </Cite>
              . The guide puts unhidden all-to-all at 30% to 40% of training time, without stating the
              model or the cluster{' '}
              <Cite tier={1} href={mg(MG_MOE_README, 'L431')} kind="vendor-claim">
                Megatron Core MoE guide L431
              </Cite>
              .
            </li>
          </ol>
          <ExpandableSection headerText="What the all-to-all overlap requires in Megatron Core core_v0.20.0">
            <SpaceBetween size="s">
              <Box variant="p">
                Among its checks, the configuration rejects{' '}
                <code>--overlap-moe-expert-parallel-comm</code> unless EP is above 1, the dispatcher is <code>alltoall</code> or <code>flex</code>, the model runs in
                BF16 or FP16 (16-bit floating point), full recomputation is off and no recomputation
                covers the MoE layers, and, when PP is above 1, an interleaved pipeline (section
                10&apos;s virtual stages) is set{' '}
                <Cite tier={1} href={mg(MG_TCONFIG, 'L3613-L3648')} kind="code">
                  Megatron Core transformer_config.py L3613-L3648
                </Cite>
                . A grid that fits only with full recomputation, which repeats the forward pass in the
                backward to avoid storing activations, therefore gives up the overlap (our reading).
              </Box>
              <Box variant="p">
                On an H100, Megatron-LM&apos;s training script warns when TP or CP is above 1 together
                with the overlap: TP and CP want <code>CUDA_DEVICE_MAX_CONNECTIONS=1</code> and the overlap a
                larger value, so the run sets 1 or 32 by which of the two it favours{' '}
                <Cite tier={1} href={mg(MG_ARGS, 'L1392-L1401')} kind="code">
                  Megatron-LM arguments.py L1392-L1401
                </Cite>
                . With TP and CP both at 1, as in DeepSeek-V3&apos;s degrees, the check does not fire
                (our reading of its condition).
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            Then treat what passes as candidate grids to test. Two grids for DeepSeek-V3&apos;s shape
            on 256 p5.48xlarge, 2,048 H100s, both passing the world-size checks on both grids:
          </Box>
          <CandidateTable />
          <Box variant="small" color="text-body-secondary">
            Calculator C&apos;s MoE mode; estimate, confirm with a measured step. Model state as in the
            grid table above, against the calculator&apos;s default headroom target of {HEADROOM_GB.toFixed(0)} GB, {HEADROOM_PCT}% of{' '}
            {CAPACITY_GB.toFixed(0)} GB, an assumption. Neither 8 nor 16 divides 61 layers, so both grids
            need uneven pipeline stages, the groups of layers each pipeline rank holds (section 10).
          </Box>
          <Box variant="p">
            The two put the cost in different places. DeepSeek-V3&apos;s degrees, experts spread over 8
            instances, hold {gb1(DSV3_GRID.modelState.totalBytesPerRank)} of model state per GPU, about{' '}
            {(HEADROOM_GB - DSV3_GRID.modelState.totalBytesPerRank / GB).toFixed(0)} GB under the target,
            and send every remote copy over EFA. Keeping the experts inside one instance, with half the
            pipeline stages, holds the exchange on NVLink and costs{' '}
            {gb1(IN_INSTANCE_GRID.modelState.totalBytesPerRank)}, about{' '}
            {(HEADROOM_GB - IN_INSTANCE_GRID.modelState.totalBytesPerRank / GB).toFixed(0)} GB under it
            (our arithmetic). Which wins turns on activation memory and on how much of the exchange
            hides behind computation.
          </Box>
          <Box variant="p">
            Activations are the open input. Expert parallelism divides the expert weights and their
            optimizer state by its degree and leaves peak activation memory at about one times, varying
            with how evenly tokens spread{' '}
            <Cite tier={1} href={mg(MG_MOE_README, 'L160-L166')}>
              Megatron Core MoE guide L160-L166
            </Cite>
            , and no activation formula for MoE layers or for DeepSeek-V3&apos;s multi-head latent
            attention was located in this research. Calculator C therefore sizes MoE model state and
            expert-parallel bytes only and labels activation memory &quot;not modelled; measure a
            step&quot;.
          </Box>
          <Box variant="p">
            Run Calculator C&apos;s MoE mode in section 14 (Set My Ranks: The Sizing Procedure) for your
            model and cluster, keep the two or three grids that pass both world-size checks with the
            most room under the target, and measure a few hundred steps of each, peak memory and step
            time, before you choose. Section 31 (Bring-Up: From One Node to the Full Run) runs that
            comparison.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
