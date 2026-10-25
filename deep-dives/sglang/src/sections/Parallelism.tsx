import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangDocsSrcUrl } from '../components/Cite';

const SRT = 'python/sglang/srt';
const PAR_FIELDS = `${SRT}/arg_groups/fields/parallel.py`;
const EXEC_FIELDS = `${SRT}/arg_groups/fields/exec_.py`;
const RTC = `${SRT}/runtime_context.py`;
const HOOK = `${SRT}/arg_groups/parallel_hook.py`;
const OVERRIDES = `${SRT}/arg_groups/overrides.py`;
const SERVER_ARGS = `${SRT}/server_args.py`;
const MOB = `${SRT}/arg_groups/model_override_base.py`;
const DSV2 = `${SRT}/arg_groups/model_overrides/deepseek_v2.py`;
const POOL = `${SRT}/model_executor/pool_configurator.py`;
const MODEL_CONFIG = `${SRT}/configs/model_config.py`;
const DPA = `${SRT}/layers/dp_attention.py`;
const ENGINE = `${SRT}/entrypoints/engine.py`;
const DP_CTRL = `${SRT}/managers/data_parallel_controller.py`;
const PSTATE = `${SRT}/distributed/parallel_state.py`;
const PP_MIXIN = `${SRT}/managers/scheduler_pp_mixin.py`;
const DPA_DOC = 'advanced_features/dp_dpa_smg_guide';
const DCP_DOC = 'advanced_features/dcp';
const PCP_DOC = 'advanced_features/prefill_cp';
const PP_DOC = 'advanced_features/pipeline_parallelism';
const RELEASE_NOTES = 'https://github.com/sgl-project/sglang/releases/tag/v0.5.22';
const VLLM_PARALLEL =
  'https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/parallel.py#L134-L136';
const VLLM_WORLD =
  'https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/parallel.py#L899-L903';

const LAUNCH_NODES = `# node 0
sglang serve --model-path <model> --tp 16 --nnodes 2 --node-rank 0 \\
  --dist-init-addr <node0-ip>:25000

# node 1: the same line with its own rank
sglang serve --model-path <model> --tp 16 --nnodes 2 --node-rank 1 \\
  --dist-init-addr <node0-ip>:25000`;

/* ------------------------------------------------------------------ */
/* Diagram: one TP group carved for attention and for experts          */
/* ------------------------------------------------------------------ */

function ParallelismMapDiagram() {
  const blue = '#0972d3';
  const blueFill = '#f2f8fd';
  const purple = '#6f4cc4';
  const purpleFill = '#efe7fb';
  const amber = '#8b6c00';
  const amberFill = '#fbf3d5';
  const neutral = '#879596';
  const slate = '#414d5c';
  const slateFill = '#f4f4f4';
  const text = '#16191f';
  const secondary = '#5f6b7a';
  const divider = '#d1d5db';
  const font = 'sans-serif';

  const x0 = 170;
  const pitch = 43;
  const tileW = 39;
  const nodeGap = 24;
  const colX = (i: number) => x0 + i * pitch + (i >= 8 ? nodeGap : 0);
  const cols = Array.from({ length: 16 }, (_, i) => i);
  const groups = [0, 1, 2, 3];
  const right = colX(15) + tileW;
  const midX = (colX(0) + right) / 2;
  const netX = (colX(7) + tileW + colX(8)) / 2;

  const frameTop = 38;
  const frameH = 278;
  const rankY = 66;
  const attnY = 102;
  const attnH = 74;
  const bandY = 190;
  const bandH = 48;
  const moeY = 252;
  const moeH = 44;

  const groupX = (g: number) => colX(4 * g) + 6;
  const groupW = 3 * pitch + tileW - 12;
  const groupMid = (g: number) => groupX(g) + groupW / 2;

  const label = (y: number, lines: [string, string, string?]) => (
    <g>
      <text x={16} y={y} fontSize={13} fontWeight={600} fill={text} fontFamily={font}>
        {lines[0]}
      </text>
      <text x={16} y={y + 17} fontSize={11} fill={secondary} fontFamily={font}>
        {lines[1]}
      </text>
      {lines[2] && (
        <text x={16} y={y + 33} fontSize={11} fill={secondary} fontFamily={font}>
          {lines[2]}
        </text>
      )}
    </g>
  );

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 404"
        role="img"
        aria-labelledby="par-map-title"
        style={{ width: '100%', minWidth: 720, height: 'auto' }}
      >
        <title id="par-map-title">
          One SGLang replica launched with --tp 16 --attn-dp-size 4 --ep 16 --nnodes 2 uses 16
          GPUs, eight TP ranks on each of two nodes. The attention layers carve the TP group into
          four data-parallel groups of four GPUs, each with its own requests and KV cache and its
          attention heads split four ways, and the MoE layers carve the same 16 GPUs into 16 expert
          shards. The token exchange at the MoE boundary crosses the network between the nodes,
          while attention traffic stays inside each node. Only --dp-size copies a replica onto more
          GPUs, and it is rejected next to an attention-DP width above 1.
        </title>
        <defs>
          <marker
            id="par-map-ah"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill={secondary} />
          </marker>
        </defs>

        <rect x={0} y={0} width={900} height={404} rx={8} fill="#ffffff" />

        <text
          x={450}
          y={26}
          textAnchor="middle"
          fontSize={13}
          fontWeight={600}
          fill={text}
          fontFamily={font}
        >
          One replica on two 8-GPU nodes: --tp 16 --attn-dp-size 4 --ep 16 --nnodes 2 is 16 GPUs
        </text>

        {/* Node frames */}
        <rect
          x={colX(0) - 8}
          y={frameTop}
          width={colX(7) + tileW + 8 - (colX(0) - 8)}
          height={frameH}
          rx={8}
          fill="#ffffff"
          stroke={neutral}
          strokeWidth={1.2}
        />
        <rect
          x={colX(8) - 8}
          y={frameTop}
          width={right + 8 - (colX(8) - 8)}
          height={frameH}
          rx={8}
          fill="#ffffff"
          stroke={neutral}
          strokeWidth={1.2}
        />
        <text
          x={(colX(0) + colX(7) + tileW) / 2}
          y={56}
          textAnchor="middle"
          fontSize={11}
          fontWeight={600}
          fill={slate}
          fontFamily={font}
        >
          node 0: TP ranks 0-7
        </text>
        <text
          x={(colX(8) + right) / 2}
          y={56}
          textAnchor="middle"
          fontSize={11}
          fontWeight={600}
          fill={slate}
          fontFamily={font}
        >
          node 1: TP ranks 8-15
        </text>

        {/* Network boundary between the nodes */}
        <line
          x1={netX}
          y1={frameTop}
          x2={netX}
          y2={frameTop + frameH + 8}
          stroke={amber}
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />

        {/* TP rank row */}
        <text x={16} y={rankY + 17} fontSize={12} fontWeight={600} fill={text} fontFamily={font}>
          TP rank
        </text>
        {cols.map((i) => (
          <g key={`rank-${i}`}>
            <rect
              x={colX(i)}
              y={rankY}
              width={tileW}
              height={24}
              rx={4}
              fill={slateFill}
              stroke={neutral}
            />
            <text
              x={colX(i) + tileW / 2}
              y={rankY + 16}
              textAnchor="middle"
              fontSize={11}
              fill={text}
              fontFamily={font}
            >
              {i}
            </text>
          </g>
        ))}

        {/* Attention carving */}
        {label(attnY + 22, ['Attention layers', '--attn-dp-size 4', '4 groups x attn TP 4'])}
        {groups.map((g) => (
          <g key={`grp-${g}`}>
            <rect
              x={groupX(g)}
              y={attnY}
              width={groupW}
              height={attnH}
              rx={6}
              fill={blueFill}
              stroke={blue}
              strokeWidth={1.5}
            />
            <text
              x={groupMid(g)}
              y={attnY + 22}
              textAnchor="middle"
              fontSize={13}
              fontWeight={600}
              fill={text}
              fontFamily={font}
            >
              {`DP group ${g}`}
            </text>
            <text
              x={groupMid(g)}
              y={attnY + 41}
              textAnchor="middle"
              fontSize={11}
              fill={secondary}
              fontFamily={font}
            >
              own requests, own KV
            </text>
            <text
              x={groupMid(g)}
              y={attnY + 59}
              textAnchor="middle"
              fontSize={11}
              fill={secondary}
              fontFamily={font}
            >
              heads split 4 ways
            </text>
            <line
              x1={groupMid(g)}
              y1={attnY + attnH + 1}
              x2={groupMid(g)}
              y2={bandY - 1}
              stroke={secondary}
              strokeWidth={1.5}
              markerEnd="url(#par-map-ah)"
            />
            <line
              x1={groupMid(g)}
              y1={bandY + bandH + 1}
              x2={groupMid(g)}
              y2={moeY - 1}
              stroke={secondary}
              strokeWidth={1.5}
              markerEnd="url(#par-map-ah)"
            />
          </g>
        ))}

        {/* MoE boundary exchange */}
        {label(bandY + 20, ['MoE boundary', 'every MoE layer'])}
        <rect
          x={colX(0)}
          y={bandY}
          width={right - colX(0)}
          height={bandH}
          rx={6}
          fill={amberFill}
          stroke={amber}
          strokeWidth={1.5}
        />
        <text
          x={midX}
          y={bandY + 19}
          textAnchor="middle"
          fontSize={12}
          fontWeight={600}
          fill={text}
          fontFamily={font}
        >
          Tokens from all four DP groups are exchanged across all 16 GPUs
        </text>
        <text
          x={midX}
          y={bandY + 37}
          textAnchor="middle"
          fontSize={11}
          fill={secondary}
          fontFamily={font}
        >
          gather and scatter by default; all-to-all dispatch and combine with an all-to-all backend
        </text>

        {/* MoE carving */}
        {label(moeY + 14, ['MoE layers', '--ep 16, MoE TP 1', '1/16 of experts each'])}
        {cols.map((i) => (
          <g key={`moe-${i}`}>
            <rect
              x={colX(i)}
              y={moeY}
              width={tileW}
              height={moeH}
              rx={4}
              fill={purpleFill}
              stroke={purple}
              strokeWidth={1.2}
            />
            <text
              x={colX(i) + tileW / 2}
              y={moeY + 26}
              textAnchor="middle"
              fontSize={11}
              fill={text}
              fontFamily={font}
            >
              1/16
            </text>
          </g>
        ))}

        <text
          x={netX}
          y={342}
          textAnchor="middle"
          fontSize={11}
          fontWeight={600}
          fill={amber}
          fontFamily={font}
        >
          network between the nodes: the MoE exchange crosses it, attention stays inside each node
        </text>

        {/* What adds GPUs instead */}
        <rect x={16} y={356} width={868} height={34} rx={6} fill={slateFill} stroke={divider} />
        <text
          x={450}
          y={378}
          textAnchor="middle"
          fontSize={12}
          fill={slate}
          fontFamily={font}
        >
          Only --dp-size copies a replica onto more GPUs, and v0.5.22 rejects it next to
          --attn-dp-size above 1
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tables                                                              */
/* ------------------------------------------------------------------ */

interface CountRow {
  launch: ReactNode;
  gpus: string;
  attention: string;
  moe: string;
}

const countRows: CountRow[] = [
  {
    launch: <code>--tp 8</code>,
    gpus: '8',
    attention: 'One group, heads split 8 ways (attention TP 8)',
    moe: 'Every expert split 8 ways (MoE TP 8)',
  },
  {
    launch: <code>--tp 8 --ep 8</code>,
    gpus: '8',
    attention: 'Attention TP 8',
    moe: 'Experts spread over 8 GPUs (EP 8, MoE TP 1)',
  },
  {
    launch: <code>--tp 8 --attn-dp-size 8 --ep 8</code>,
    gpus: '8',
    attention: '8 groups, each with its own requests and KV (attention TP 1)',
    moe: 'EP 8, MoE TP 1',
  },
  {
    launch: <code>--tp 8 --attn-dp-size 2</code>,
    gpus: '8',
    attention: '2 groups x attention TP 4',
    moe: 'MoE TP 8',
  },
  {
    launch: <code>--tp 16 --moe-a2a-backend deepep</code>,
    gpus: '16',
    attention: 'Attention TP 16',
    moe: 'EP reset to 16 by the backend',
  },
  {
    launch: <code>--tp 8 --pp-size 2</code>,
    gpus: '16',
    attention: 'Two pipeline stages, each attention TP 8',
    moe: 'MoE TP 8 in each stage',
  },
  {
    launch: <code>--tp 8 --dp-size 2</code>,
    gpus: '16',
    attention: 'Two replicas, each attention TP 8',
    moe: 'MoE TP 8 in each replica',
  },
  {
    launch: <code>--tp 8 --dp-size 2 --attn-dp-size 2</code>,
    gpus: 'Rejected',
    attention: 'Fails at startup: replicas and attention DP do not combine',
    moe: '',
  },
];

interface AxisRow {
  axis: ReactNode;
  splits: string;
  sends: string;
  crosses: string;
}

const axisRows: AxisRow[] = [
  {
    axis: (
      <>
        Replica DP, <code>--dp-size</code>
      </>
    ),
    splits: 'Requests, across whole copies of the model',
    sends: 'Nothing between replicas',
    crosses: 'Never; each replica is self-contained',
  },
  {
    axis: (
      <>
        PP, <code>--pp-size</code>
      </>
    ),
    splits: 'Layers, into stages',
    sends: 'Activations at stage boundaries',
    crosses: 'Only at stage boundaries; nodes take whole stages first',
  },
  {
    axis: <>Attention TP, what remains of the TP group</>,
    splits: 'Attention heads and weights',
    sends: 'All-reduce inside the attention group',
    crosses: 'Only when an attention group spans nodes',
  },
  {
    axis: (
      <>
        Attention DP, <code>--attn-dp-size</code>
      </>
    ),
    splits: 'Requests, each group with its own KV',
    sends: 'Tokens meet at every MoE boundary',
    crosses: 'Through the MoE exchange when the TP group spans nodes',
  },
  {
    axis: (
      <>
        Prefill CP, <code>--attn-cp-size</code>
      </>
    ),
    splits: 'One prompt by token',
    sends: 'KV all-gather inside the CP group',
    crosses: 'DSA layouts assert a single machine',
  },
  {
    axis: (
      <>
        DCP, <code>--dcp-size</code>
      </>
    ),
    splits: "One request's KV by token position",
    sends: 'Partial outputs and LSE, merged in decode attention',
    crosses: 'Keep each DCP group inside one attention group',
  },
  {
    axis: (
      <>
        EP, <code>--ep-size</code>
      </>
    ),
    splits: 'Experts',
    sends: 'Gather and scatter, or all-to-all dispatch and combine',
    crosses: 'Whenever EP spans nodes (wide EP, section 16)',
  },
];

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export function Parallelism() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Count the GPUs a launch uses, then map each flag onto what it splits and what it sends across the network (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            14. Parallelism: one TP group, carved for attention and experts
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An SGLang launch line can carry several parallel widths, and the first thing to get right
            is how many GPUs they add up to. SGLang builds one TP (tensor parallelism) group per
            replica and then carves it: the attention layers split it one way, the MoE (mixture of
            experts) layers split the same GPUs another way, and only three flags add GPUs, two that
            size a replica and one that copies it. The count decides the hardware you reserve; the
            carving decides which collectives cross the network.
          </Box>
          <Box variant="p">
            The figure to carry through this section:{' '}
            <strong>
              <code>--tp 8 --attn-dp-size 8 --ep 8</code> is 8 GPUs, not 64
            </strong>
            . Attention DP (data parallelism) and EP (expert parallelism) are both widths inside the
            eight-GPU TP group: eight attention groups, each with its own requests and KV (key-value)
            cache, and eight expert shards, over the same eight GPUs. Neither multiplies the group{' '}
            <Cite tier={1} href={sglangUrl(RTC, 'L137-L157')}>
              runtime_context.py L137-L157
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(RTC, 'L173-L178')}>
              runtime_context.py L173-L178
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Work out the GPUs any launch line needs before reading what its other flags do"
          >
            Count GPUs first: two flags size a replica, one copies it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every parallel width defaults to 1, so a bare <code>sglang serve</code> runs on one GPU{' '}
            <Cite tier={1} href={sglangUrl(PAR_FIELDS, 'L43-L90')}>
              parallel.py L43-L90
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(PAR_FIELDS, 'L269-L276')}>
              parallel.py L269-L276
            </Cite>
            . From there one rule counts any launch. A replica spans <code>tp_size x pp_size</code>{' '}
            GPUs, one TP group for each PP (pipeline parallelism) stage{' '}
            <Cite tier={1} href={sglangUrl(RTC, 'L173-L178')}>
              runtime_context.py L173-L178
            </Cite>
            . <code>--dp-size N</code> runs N replicas, each on its own range of{' '}
            <code>tp_size x pp_size</code> GPUs, under the one DataParallelController that section
            3, The SGLang Runtime, adds to the process listing{' '}
            <Cite tier={1} href={sglangUrl(DP_CTRL, 'L393-L421')}>
              data_parallel_controller.py L393-L421
            </Cite>
            . Every other width carves the replica&apos;s TP group and adds no GPUs.
          </Box>
          <Box variant="p">
            The carving is two factorizations of the same TP width, checked when the configuration
            is published:{' '}
            <code>tp_size == attn_tp_size x attn_dp_size x attn_cp_size</code> for the attention
            layers and <code>tp_size == moe_ep_size x moe_dp_size x moe_tp_size</code> for the MoE
            layers{' '}
            <Cite tier={1} href={sglangUrl(RTC, 'L294-L312')}>
              runtime_context.py L294-L312
            </Cite>
            . Attention TP and MoE TP are what is left after the other factors, and you never set
            them:{' '}
            <code>attn_tp_size = tp_size / attn_dp_size / attn_cp_size</code> and{' '}
            <code>moe_tp_size = tp_size / ep_size / moe_dp_size</code>{' '}
            <Cite tier={1} href={sglangUrl(RTC, 'L73-L76')}>
              runtime_context.py L73-L76
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(RTC, 'L137-L157')}>
              runtime_context.py L137-L157
            </Cite>
            .
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'launch', header: 'Launch flags', cell: (r: CountRow) => r.launch },
              { id: 'gpus', header: 'GPUs', cell: (r: CountRow) => r.gpus },
              { id: 'attn', header: 'Attention layers', cell: (r: CountRow) => r.attention },
              { id: 'moe', header: 'MoE layers', cell: (r: CountRow) => r.moe },
            ]}
            items={countRows}
          />
          <Box variant="small" color="text-body-secondary">
            Counts follow the formulas above, the startup check in{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L279-L286')}>
              parallel_hook.py L279-L286
            </Cite>{' '}
            and the EP override in{' '}
            <Cite tier={1} href={sglangUrl(OVERRIDES, 'L1529-L1572')}>
              overrides.py L1529-L1572
            </Cite>
            ; they are read from source, not counted on a running server. A launch with{' '}
            <code>--tp 8 --attn-dp-size 8 --ep 8</code> runs eight schedulers plus the controller,
            11 processes by section 3&apos;s count.
          </Box>
          <Box variant="p">
            On spelling: <code>--tp</code> and <code>--dp</code> in SGLang examples are argparse
            abbreviations of <code>--tp-size</code> and <code>--dp-size</code>, because the parser
            keeps argparse&apos;s default prefix matching{' '}
            <Cite tier={1} href={sglangUrl(SERVER_ARGS, 'L665')} kind="code">
              server_args.py L665
            </Cite>
            . <code>--ep</code> is a declared alias of <code>--ep-size</code>. Write{' '}
            <code>--pp-size</code> in full: three flags start with <code>--pp-</code>, so{' '}
            <code>--pp</code> is ambiguous{' '}
            <Cite tier={1} href={sglangUrl(PAR_FIELDS, 'L59-L72')}>
              parallel.py L59-L72
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See where each width lands on real GPUs, and which traffic leaves the node"
          >
            The map: one TP group, carved twice
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The map follows one launch across two 8-GPU nodes:{' '}
            <code>--tp 16 --attn-dp-size 4 --ep 16 --nnodes 2</code>. The TP group is 16 GPUs with
            eight TP ranks per node, because each node takes whole pipeline stages first and then an
            equal slice of the TP ranks{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L2014-L2046')}>
              engine.py L2014-L2046
            </Cite>
            . The attention layers see four DP groups of four GPUs. Ranks are laid out with the DP
            index outermost and TP fastest, so each group is four consecutive TP ranks and here sits
            inside one node{' '}
            <Cite tier={1} href={sglangUrl(RTC, 'L79-L92')}>
              runtime_context.py L79-L92
            </Cite>
            . The MoE layers see the same 16 GPUs as 16 expert shards, with nothing left over for
            MoE TP.
          </Box>

          <ParallelismMapDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. GPU placement is our reading of the rank formulas in
            runtime_context.py and engine.py. The attention-TP all-reduce inside each group is left
            out for clarity.
          </Box>

          <Box variant="p">
            Between the two carvings sits the exchange. Attention runs per group on local requests.
            At the MoE boundary every group&apos;s tokens are gathered into one buffer, or dispatched
            all-to-all when an expert all-to-all backend is set, and scattered back after{' '}
            <Cite tier={1} href={sglangUrl(DPA, 'L937-L1060')}>
              dp_attention.py L937-L1060
            </Cite>
            . Inside each group, attention&apos;s TP all-reduce runs over the attention TP group{' '}
            <Cite tier={1} href={sglangUrl(DPA, 'L1225-L1226')}>
              dp_attention.py L1225-L1226
            </Cite>
            . By our reading of the rank formulas, the MoE exchange crosses the network in this
            layout, every MoE layer, while attention traffic stays inside a node. A dense
            feed-forward layer, which by default stays tensor parallel over the whole TP group, crosses it too{' '}
            <Cite tier={1} href={sglangUrl(PAR_FIELDS, 'L81-L90')}>
              parallel.py L81-L90
            </Cite>
            . The same 16 GPUs launched as plain <code>--tp 16</code> would also all-reduce attention
            across both nodes.
          </Box>
          <ExpandableSection headerText="Why an idle group still pays for the exchange">
            <Box variant="p">
              Every DP group joins the MoE collectives on every step, including a group with no
              requests, so the exchange pads token counts. <code>MAX_LEN</code> pads every group to
              the longest and all-gathers; <code>SUM_LEN</code> pads to the total and all-reduces{' '}
              <Cite tier={1} href={sglangUrl(DPA, 'L135-L160')}>
                dp_attention.py L135-L160
              </Cite>
              . This is the mechanism behind section 16, Wide Expert Parallelism, where the EP group
              moves in lockstep.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Decide what each attention group owns, and write --attn-dp-size the v0.5.22 way"
          >
            Attention: split by requests, by tokens or by heads
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Inside the TP group, attention splits three ways. Attention DP gives each group
            different requests, which it batches on its own against its own KV cache, while the
            feed-forward layers stay tensor parallel{' '}
            <Cite tier={1} href={sglangUrl(PAR_FIELDS, 'L81-L90')}>
              parallel.py L81-L90
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DPA_DOC, 'L47-L49')}>
              SGLang docs: how DPA works (v0.5.22 source)
            </Cite>
            . CP and DCP (context parallelism, decode context parallelism) give the ranks different
            tokens of one request. Attention TP, the remainder, gives each rank different heads. A
            request reaches one attention group through the DataParallelController, round-robin by
            default (section 3, The SGLang Runtime).
          </Box>
          <Box variant="p">
            <code>--attn-dp-size N</code> is the v0.5.22 flag, and <code>--dp-size</code> counts
            whole replicas only. A launch with both above 1 fails at startup with
            &quot;data-parallel replicas combined with attention data parallelism are not
            supported&quot;{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L279-L286')}>
              parallel_hook.py L279-L286
            </Cite>{' '}
            <Cite tier={1} href={RELEASE_NOTES}>
              SGLang v0.5.22 release notes
            </Cite>
            . The TP width must divide by <code>--attn-dp-size</code>{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L314')}>
              parallel_hook.py L314
            </Cite>
            . Old launch lines keep working: <code>--dp-size 8 --enable-dp-attention</code> prints a
            deprecation warning and runs as <code>--attn-dp-size 8</code>, and the old flag is
            scheduled for removal after 2026-12-31{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L39-L61')}>
              parallel_hook.py L39-L61
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SERVER_ARGS, 'L415-L423')}>
              server_args.py L415-L423
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="Mixed spellings, and the one layout that still reads --dp-size as attention DP">
            <SpaceBetween size="s">
              <Box variant="p">
                <code>--dp-size N --enable-dp-attention --attn-dp-size N</code> fails: the old flag
                rewrites <code>--dp-size</code> only when <code>--attn-dp-size</code> is unset, so
                both widths stay above 1.{' '}
                <code>--attn-dp-size N --enable-dp-attention</code> with <code>--dp-size 1</code> is
                accepted, and the old flag adds nothing{' '}
                <Cite tier={1} href={sglangUrl(HOOK, 'L49-L61')}>
                  parallel_hook.py L49-L61
                </Cite>
                .
              </Box>
              <Box variant="p">
                DeepSeek prefill context-parallel layouts (DSA, DeepSeek sparse attention; MLA,
                multi-head latent attention; and DeepSeek-V4) still read{' '}
                <code>--dp-size N</code> alone as N attention-DP groups, with a warning that it will
                be rejected after 2026-12-31{' '}
                <Cite tier={1} href={sglangUrl(MOB, 'L229-L247')}>
                  model_override_base.py L229-L247
                </Cite>
                . Write <code>--attn-dp-size N</code> there too.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            Turning attention DP on also moves two scheduler settings. Each group gets{' '}
            <code>chunked_prefill_size / N</code> tokens per prefill chunk, logged as a warning at
            startup, and <code>schedule_conservativeness</code> is multiplied by 0.3, so admission
            gets more aggressive{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L308-L324')}>
              parallel_hook.py L308-L324
            </Cite>
            . Size <code>--chunked-prefill-size</code> for the whole TP group; the server divides it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict whether --attn-dp-size will grow your batch or leave it where TP already put it"
          >
            Why attention DP suits MLA models
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The case for attention DP sits in the KV cache sizing code. For MLA models, the bytes
            per token are the latent dimension times
            layers times element size, with no TP term{' '}
            <Cite tier={1} href={sglangUrl(POOL, 'L349-L380')}>
              pool_configurator.py L349-L380
            </Cite>
            . For MHA and GQA (multi-head and grouped-query attention) models, they scale with the
            KV heads divided by the attention TP width, down to one head per GPU{' '}
            <Cite tier={1} href={sglangUrl(POOL, 'L464-L470')}>
              pool_configurator.py L464-L470
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MODEL_CONFIG, 'L1591-L1602')}>
              model_config.py L1591-L1602
            </Cite>
            .
          </Box>
          <Box variant="p">
            So under plain TP 8, every GPU of an MLA model stores the same latent KV for the same
            batch: eight copies. Attention DP turns those eight copies into eight different batches,
            each group holding KV for its own requests only{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DPA_DOC, 'L23-L29')}>
              SGLang docs: DP, DPA and SGLang DP Router (v0.5.22 source)
            </Cite>
            . The documented DeepSeek layout pairs full attention DP with full EP:{' '}
            <code>--tp 8 --attn-dp-size 8 --ep 8 --moe-a2a-backend deepep --moe-runner-backend
            deep_gemm</code>, 8 GPUs{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DPA_DOC, 'L77-L87')}>
              SGLang docs: recommended setup for DeepSeek (v0.5.22 source)
            </Cite>
            .
          </Box>
          <Box variant="p">
            GQA models get much less from it. TP already divides their KV heads, so attention DP
            frees little KV room (our reading of the sizing code), and the documentation recommends
            plain TP or replica DP for models like Llama{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DPA_DOC, 'L106')}>
              SGLang docs: target models (v0.5.22 source)
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict the EP width a launch really runs, including when the all-to-all backend overrides --ep-size"
          >
            MoE layers: experts first, then what is left
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The MoE layers run on the same GPUs as attention. EP decides how the experts spread over
            them, and whatever width is left tensor-splits each expert{' '}
            <Cite tier={1} href={sglangUrl(RTC, 'L137-L157')}>
              runtime_context.py L137-L157
            </Cite>
            . On <code>--tp 8</code>, <code>--ep 8</code> leaves MoE TP 1, and the default{' '}
            <code>--ep 1</code> splits every expert eight ways.
          </Box>
          <Box variant="p">
            How tokens reach the experts is a separate flag. <code>--moe-a2a-backend</code> defaults
            to <code>none</code>, which keeps the MoE layers on gather and reduce collectives over
            the TP group; naming an all-to-all backend such as <code>deepep</code> switches to
            all-to-all dispatch and combine{' '}
            <Cite tier={1} href={sglangUrl(EXEC_FIELDS, 'L773-L806')}>
              exec_.py L773-L806
            </Cite>
            . DeepEP and the other all-to-all backends reset EP to the TP width whatever{' '}
            <code>--ep-size</code> says, and log the change: <code>--tp 16 --moe-a2a-backend deepep</code>{' '}
            runs EP 16{' '}
            <Cite tier={1} href={sglangUrl(OVERRIDES, 'L1529-L1572')}>
              overrides.py L1529-L1572
            </Cite>
            . With <code>--moe-a2a-backend none</code>, EP can be narrower than TP.
          </Box>
          <Box variant="p">
            DeepEP modes, the load balancer and overlap are section 16, Wide Expert Parallelism.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know when to split one request's tokens instead of spreading requests, and the one size rule v0.5.22 leaves to you"
          >
            One long request: prefill CP and DCP
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Context parallelism splits the tokens of one request across ranks inside the TP group.
            Prefill CP spreads a long prompt&apos;s tokens across an attention CP group and
            all-gathers the KV so each rank has the keys and values it needs{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(PCP_DOC, 'L5-L7')}>
              SGLang docs: Prefill Context Parallelism (v0.5.22 source)
            </Cite>
            . It takes <code>--enable-prefill-cp</code>, a width from <code>--attn-cp-size</code>,
            and a strategy, without which startup fails: <code>zigzag</code> gives each rank one
            early and one late block to balance causal work, and <code>interleave</code> assigns
            tokens modulo the CP size{' '}
            <Cite tier={1} href={sglangUrl(PAR_FIELDS, 'L153-L163')}>
              parallel.py L153-L163
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L145-L158')}>
              parallel_hook.py L145-L158
            </Cite>
            . DSA CP stays inside one machine at v0.5.22: it asserts{' '}
            <code>tp_size &lt;= 8</code> and, with zigzag, forces DeepEP and EP equal to TP{' '}
            <Cite tier={1} href={sglangUrl(DSV2, 'L115-L144')}>
              deepseek_v2.py L115-L144
            </Cite>
            .
          </Box>
          <Box variant="p">
            DCP, <code>--dcp-size c</code>, stripes a request&apos;s MLA KV by token position, so
            each of the c ranks stores and reads about 1/c of the cache, and the partial attention
            outputs merge through an exact LSE (log-sum-exp) reduction{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DCP_DOC, 'L7-L9')}>
              SGLang docs: Decode Context Parallelism (v0.5.22 source)
            </Cite>
            . DCP and prefill CP do not combine:{' '}
            <code>--dcp-size</code> above 1 with <code>--enable-prefill-cp</code> is rejected{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L235-L247')}>
              parallel_hook.py L235-L247
            </Cite>
            .
          </Box>
          <Box variant="p">
            When you combine attention DP with DCP, keep each DCP group inside one attention group by
            choosing sizes so that <code>(tp_size / attn_dp_size) % dcp_size == 0</code>. TP 64 with
            attention DP 4 and DCP 16 makes four valid 16-rank groups; DCP 32 would straddle them{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DCP_DOC, 'L22-L33')}>
              SGLang docs: DCP topology (v0.5.22 source)
            </Cite>
            . DCP groups are consecutive slices of the TP group{' '}
            <Cite tier={1} href={sglangUrl(PSTATE, 'L2711-L2720')} kind="code">
              parallel_state.py L2711-L2720
            </Cite>
            , and we found no startup check for this containment in v0.5.22&apos;s argument
            handling, which matches the warning on the documentation page. Check it yourself.
          </Box>
          <Box variant="p">
            The terms map onto vLLM&apos;s: SGLang&apos;s prefill CP (<code>--attn-cp-size</code>) is
            the counterpart of vLLM&apos;s PCP (prefill context parallelism), and DCP exists in both
            engines, <code>--dcp-size</code> here and <code>-dcp</code> in vLLM (
            <Link href="../vllm/">vLLM dive, section 9: Distributed Inference</Link>). They count
            GPUs differently: vLLM&apos;s PCP multiplies its world size{' '}
            <Cite tier={1} href={VLLM_WORLD}>
              vLLM parallel.py L899-L903
            </Cite>
            , while <code>--attn-cp-size</code> carves the TP group, so <code>-tp 8 -pcp 2</code> on
            vLLM is 16 GPUs and <code>--tp 8 --attn-cp-size 2</code> here is 8. Their internals
            were not compared for this dive.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Launch a replica over several nodes and put the cross-node traffic where you meant it to go"
          >
            Across nodes: one command per node, stages before TP slices
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A multi-node replica is one launch command per node, each with the same{' '}
            <code>--dist-init-addr host:port</code> and <code>--nnodes N</code> and its own{' '}
            <code>--node-rank</code>{' '}
            <Cite tier={1} href={sglangUrl(PAR_FIELDS, 'L32-L44')}>
              parallel.py L32-L44
            </Cite>
            . Each node works out its own share: pipeline stages first, then an equal slice of the TP
            ranks{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L2014-L2046')}>
              engine.py L2014-L2046
            </Cite>
            . TP 8 x PP 4 on four nodes puts one stage on each node; TP 16 on two nodes puts eight TP
            ranks on each, so the TP group crosses the network.
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{LAUNCH_NODES}</pre>
          <Box variant="p">
            Pipeline parallelism needs cross-node communication only at the boundaries of each
            stage{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(PP_DOC, 'L8')}>
              SGLang docs: Pipeline Parallelism for Long Context (v0.5.22 source)
            </Cite>
            , and the documented long-context prefill recipe for DeepSeek-V3.1 runs TP 8 x PP 4 on
            four nodes{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(PP_DOC, 'L70-L77')}>
              SGLang docs: DeepSeek-V3.1 PP recipe (v0.5.22 source)
            </Cite>
            . <code>--pp-size</code> above 1 turns off the CPU/GPU overlap scheduler of section 4,
            The Scheduler, and runs a dedicated pipeline scheduler loop instead{' '}
            <Cite tier={1} href={sglangUrl(OVERRIDES, 'L1575-L1580')}>
              overrides.py L1575-L1580
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(PP_MIXIN, 'L101')}>
              scheduler_pp_mixin.py L101
            </Cite>
            . Replicas from <code>--dp-size</code> exchange nothing during a request{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DPA_DOC, 'L15-L17')}>
              SGLang docs: DP key characteristics (v0.5.22 source)
            </Cite>
            , and the documentation recommends the gateway of section 17, The Model Gateway, over
            in-server <code>--dp-size</code> for production replicas{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DPA_DOC, 'L176-L184')}>
              SGLang docs: native DP versus the gateway (v0.5.22 source)
            </Cite>
            .
          </Box>
          <Table
            variant="embedded"
            wrapLines
            header={<Header variant="h3">What each axis splits, and what it sends</Header>}
            columnDefinitions={[
              { id: 'axis', header: 'Axis and flag', cell: (r: AxisRow) => r.axis },
              { id: 'splits', header: 'Splits', cell: (r: AxisRow) => r.splits },
              { id: 'sends', header: 'Traffic', cell: (r: AxisRow) => r.sends },
              { id: 'crosses', header: 'Across nodes', cell: (r: AxisRow) => r.crosses },
            ]}
            items={axisRows}
          />
          <Box variant="small" color="text-body-secondary">
            Each row restates a cited claim from this section. Section 3, The SGLang Runtime, lists
            what runs on each node; section 18, Multi-Node and Kubernetes Orchestrators, runs the
            launch under an orchestrator.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Carry a layout between engines by GPU count, then pick attention DP or DCP by what your model's KV needs"
          >
            Translate a vLLM layout, then choose the carving
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Against vLLM:</strong> attention DP is a width inside SGLang&apos;s TP group and
            EP spans that group, while vLLM&apos;s DP attention is <code>--data-parallel-size</code>{' '}
            replicas plus <code>--enable-expert-parallel</code>, with the MoE layers sharded over TP
            x PCP x DP{' '}
            <Cite tier={1} href={VLLM_PARALLEL}>
              vLLM parallel.py L134-L136
            </Cite>
            . The same 8-GPU layout is <code>--tp 8 --attn-dp-size 8 --ep 8</code> on SGLang and{' '}
            <code>-dp 8 -tp 1 --enable-expert-parallel</code> on vLLM (
            <Link href="../vllm/">vLLM dive, section 9: Distributed Inference</Link>).
          </Box>
          <Box variant="p">
            <strong>The translation rule:</strong> count GPUs, then map flags.{' '}
            <strong>
              <code>--tp 8 --attn-dp-size 8 --ep 8</code> is 8 GPUs, not 64
            </strong>
            . Read with vLLM&apos;s meaning, where each data-parallel rank is a replica, eight ranks at
            TP 8 would be 64 GPUs. Move a layout between the engines by its GPU count and what each
            GPU holds, never by matching flag names.
          </Box>
          <Box variant="p">
            <strong>The choice rule:</strong> for an MLA model short on KV room, attention DP grows
            how many requests fit, and DCP grows the longest context one request can hold{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DCP_DOC, 'L7-L9')}>
              SGLang docs: Decode Context Parallelism (v0.5.22 source)
            </Cite>
            . For a GQA model, whose KV heads TP already splits, attention DP does little (our
            reading of the KV sizing); use TP or replicas, as the documentation advises for
            Llama-class models{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DPA_DOC, 'L106')}>
              SGLang docs: target models (v0.5.22 source)
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Where to start:</strong> multiply <code>--tp-size</code> by{' '}
            <code>--pp-size</code> and by <code>--dp-size</code> to get the GPUs to reserve. Check
            that <code>--attn-dp-size</code>, <code>--attn-cp-size</code> and <code>--ep-size</code>{' '}
            divide the TP width and that each DCP group fits inside one attention group. Then read
            the startup log, which reports the per-group chunked-prefill size under attention DP and
            any EP reset by an all-to-all backend.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
