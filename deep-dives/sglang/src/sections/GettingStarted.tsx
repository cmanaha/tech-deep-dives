import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Tabs from '@cloudscape-design/components/tabs';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangDocsSrcUrl } from '../components/Cite';

const SRT = 'python/sglang/srt';
const OBS_FIELDS = `${SRT}/arg_groups/fields/observability.py`;
const SCHED_FIELDS = `${SRT}/arg_groups/fields/schedule.py`;
const SERVING = `${SRT}/arg_groups/fields/serving.py`;
const MEMORY_HOOK = `${SRT}/arg_groups/memory_hook.py`;
const OVR = `${SRT}/arg_groups/overrides.py`;
const MOB = `${SRT}/arg_groups/model_override_base.py`;
const SPEC_HOOK = `${SRT}/arg_groups/speculative_hook.py`;
const HTTP = `${SRT}/entrypoints/http_server.py`;
const ENGINE = `${SRT}/entrypoints/engine.py`;
const SERVING_BASE = `${SRT}/entrypoints/openai/serving_base.py`;
const SCHEDULER = `${SRT}/managers/scheduler.py`;
const POLICY = `${SRT}/managers/schedule_policy.py`;
const BATCH = `${SRT}/managers/schedule_batch.py`;
const TOKENIZER = `${SRT}/managers/tokenizer_manager.py`;
const KV_CONF = `${SRT}/mem_cache/kv_cache_configurator.py`;
const RADIX = `${SRT}/mem_cache/radix_cache.py`;
const POOL_CONF = `${SRT}/model_executor/pool_configurator.py`;
const COLLECTOR = `${SRT}/observability/metrics_collector.py`;
const RTC = `${SRT}/runtime_context.py`;
const AUTH = `${SRT}/utils/auth.py`;
const SERVER_ARGS = `${SRT}/server_args.py`;
const PREFILL = `${SRT}/disaggregation/prefill.py`;
const LAUNCH = 'python/sglang/launch_server.py';
const FC_PARSER = `${SRT}/function_call/function_call_parser.py`;
const VLLM_CACHE_103 = 'https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/cache.py#L103-L111';

function vllmLink(n: number, title: string): ReactNode {
  return (
    <Link href="../vllm/">
      vLLM dive, section {n}: {title}
    </Link>
  );
}

/* ------------------------------------------------------------------------ */
/* Routes and the reading map                                               */
/* ------------------------------------------------------------------------ */

type RouteId = 'agentic' | 'moe' | 'aws' | 'vllm';
type MapView = 'all' | RouteId;

interface RouteDef {
  id: RouteId;
  letter: string;
  tab: string;
  forWhom: string;
  color: string;
  tint: string;
  steps: number[];
  addOn: number[];
  addOnLabel: string;
}

const ROUTES: RouteDef[] = [
  {
    id: 'agentic',
    letter: 'A',
    tab: 'A: Agentic or multi-turn',
    forWhom: 'agentic or multi-turn traffic',
    color: '#0972d3',
    tint: '#f2f8fd',
    steps: [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 17, 23, 25, 26],
    addOn: [],
    addOnLabel: '',
  },
  {
    id: 'moe',
    letter: 'M',
    tab: 'M: Large MoE at scale',
    forWhom: 'large MoE models at scale',
    color: '#6f4cc4',
    tint: '#efe7fb',
    steps: [1, 2, 3, 4, 5, 6, 8, 11, 14, 15, 16, 17, 18, 23, 26],
    addOn: [20, 21, 22],
    addOnLabel: 'add when you run on AWS',
  },
  {
    id: 'aws',
    letter: 'W',
    tab: 'W: On AWS this quarter',
    forWhom: 'a deployment on AWS this quarter',
    color: '#8b6c00',
    tint: '#fbf3d5',
    steps: [1, 2, 3, 5, 6, 8, 12, 19, 20, 21, 23, 25, 26],
    addOn: [14, 15, 16, 18, 22],
    addOnLabel: 'add for PD or wide EP',
  },
  {
    id: 'vllm',
    letter: 'V',
    tab: 'V: Moving from vLLM',
    forWhom: 'moving a vLLM deployment',
    color: '#1f7a70',
    tint: '#e6f4f2',
    steps: [1, 2, 4, 6, 9, 10, 12, 23, 25],
    addOn: [],
    addOnLabel: '',
  },
];

interface MapNode {
  n: number;
  name: string;
  x: number;
  y: number;
  w: number;
}

const NODE_H = 42;
const TOP_Y = 22;
const COL_B = { x: 34, w: 120 };
const COL_C = { x: 206, w: 150 };
const COL_D = { x: 404, w: 150 };
const COL_E = { x: 602, w: 132 };
const COL_F = { x: 778, w: 130 };
const rowTop = (r: number) => 106 + 62 * r;

function column(col: { x: number; w: number }, items: [number, string][]): MapNode[] {
  return items.map(([n, name], r) => ({ n, name, x: col.x, y: rowTop(r), w: col.w }));
}

const MAP_NODES: MapNode[] = [
  { n: 1, name: 'Thesis', x: COL_B.x, y: TOP_Y, w: COL_B.w },
  { n: 2, name: 'Getting started', x: COL_C.x, y: TOP_Y, w: COL_C.w },
  { n: 27, name: 'Codebase', x: COL_E.x, y: TOP_Y, w: COL_E.w },
  { n: 28, name: 'Glossary', x: COL_F.x, y: TOP_Y, w: COL_F.w },
  ...column(COL_B, [
    [3, 'Runtime'],
    [4, 'Scheduler'],
    [5, 'Radix cache'],
    [6, 'KV memory'],
    [7, 'HiCache'],
    [8, 'Attention'],
    [9, 'Quantization'],
  ]),
  ...column(COL_C, [
    [10, 'Structured output'],
    [11, 'Speculative'],
    [12, 'APIs and admin'],
    [13, 'RL rollout'],
  ]),
  ...column(COL_D, [
    [14, 'Parallelism'],
    [15, 'PD disaggregation'],
    [16, 'Wide EP'],
    [17, 'Gateway'],
    [18, 'Kubernetes'],
  ]),
  ...column(COL_E, [
    [19, 'SageMaker'],
    [20, 'EKS and EC2'],
    [21, 'EC2 instances'],
    [22, 'PD, EP on EFA'],
  ]),
  ...column(COL_F, [
    [23, 'SGLang vs vLLM'],
    [24, 'Ecosystem'],
    [25, 'Operations'],
    [26, 'Decision guide'],
  ]),
];

interface MapEdge {
  id: string;
  from: number;
  to: number;
  pts: [number, number][];
  /** Where this edge passes over another one; a white gap is cut under it there. */
  bridge?: [number, number];
}

// Row centres: 127, 189, 251, 313, 375, 437, 499. Channels between rows: 158, 220.
const MAP_EDGES: MapEdge[] = [
  { id: 'e1-2', from: 1, to: 2, pts: [[154, 43], [206, 43]] },
  { id: 'e3-4', from: 3, to: 4, pts: [[94, 148], [94, 168]] },
  { id: 'e5-4', from: 5, to: 4, pts: [[94, 230], [94, 210]] },
  { id: 'e5-7', from: 5, to: 7, pts: [[34, 257], [24, 257], [24, 375], [34, 375]] },
  { id: 'e8-5', from: 8, to: 5, pts: [[34, 437], [13, 437], [13, 245], [34, 245]] },
  { id: 'e12-13', from: 12, to: 13, pts: [[281, 272], [281, 292]] },
  { id: 'e15-16', from: 15, to: 16, pts: [[479, 210], [479, 230]] },
  {
    id: 'e6-15',
    from: 6,
    to: 15,
    pts: [[154, 313], [178, 313], [178, 220], [372, 220], [372, 189], [404, 189]],
  },
  { id: 'e15-22', from: 15, to: 22, pts: [[554, 189], [566, 189], [566, 313], [602, 313]] },
  { id: 'e16-22', from: 16, to: 22, pts: [[554, 251], [566, 251], [566, 313], [602, 313]] },
  {
    id: 'e8-21',
    from: 8,
    to: 21,
    pts: [[154, 437], [588, 437], [588, 257], [602, 257]],
    bridge: [588, 313],
  },
  {
    id: 'e12-25',
    from: 12,
    to: 25,
    pts: [[356, 251], [390, 251], [390, 158], [760, 158], [760, 251], [778, 251]],
    bridge: [390, 189],
  },
];

const MAP_HEADERS: [number, string][] = [
  [COL_B.x, 'Runtime and index'],
  [COL_C.x, 'Request features'],
  [COL_D.x, 'Scale-out'],
  [COL_E.x, 'SGLang on AWS'],
  [COL_F.x, 'Compare and decide'],
];

const MAP_W = 920;
const MAP_H = 566;
const FONT = 'sans-serif';
const INK = '#16191f';
const MUTED = '#5f6b7a';
const SLATE = '#414d5c';
const FAINT = '#d1d5db';

function mapTitle(view: MapView): string {
  if (view === 'all') {
    return (
      'Reading map of the dive. Sections 1 and 2 open every route. Sections 3 to 9 cover the runtime and the index, ' +
      '10 to 13 request features, 14 to 18 scale-out, 19 to 22 SGLang on AWS, and 23 to 26 comparison, operations ' +
      'and decisions; 27 and 28 are reference. Arrows mark where one section feeds another, and the letters A, M, W ' +
      'and V mark the four reading routes. Section 23 is on all four.'
    );
  }
  const r = ROUTES.find((x) => x.id === view) as RouteDef;
  const extra = r.addOn.length ? `, and ${r.addOnLabel}: sections ${r.addOn.join(', ')}` : '';
  return `Route ${r.letter}, for ${r.forWhom}: read sections ${r.steps.join(', ')} in that order${extra}.`;
}

function ReadingMapDiagram({ view }: { view: MapView }) {
  // Tabs renders only the active tab's content, so one SVG is in the DOM at a time and the
  // ids below stay unique.
  const slug = 'gs-map';
  const route = view === 'all' ? null : (ROUTES.find((x) => x.id === view) as RouteDef);
  const onRoute = (n: number) => (route ? route.steps.includes(n) || route.addOn.includes(n) : true);

  const node = (m: MapNode) => {
    const cx = m.x + m.w / 2;
    const step = route ? route.steps.indexOf(m.n) : -1;
    const isAddOn = route ? route.addOn.includes(m.n) : false;
    const off = route !== null && step < 0 && !isAddOn;
    const reference = m.n === 27 || m.n === 28;

    let fill = '#ffffff';
    let stroke = '#879596';
    let strokeWidth = 1.2;
    let dash: string | undefined;
    if (route && step >= 0) {
      fill = route.tint;
      stroke = route.color;
      strokeWidth = 2.4;
    } else if (route && isAddOn) {
      stroke = route.color;
      strokeWidth = 1.6;
      dash = '5 3';
    } else if (off) {
      fill = '#f4f4f4';
      stroke = FAINT;
    }

    let badge: ReactNode = null;
    if (!route) {
      badge = reference ? (
        <text x={cx} y={m.y + 35} textAnchor="middle" fill={MUTED} fontSize={10} fontFamily={FONT}>
          on demand
        </text>
      ) : (
        ROUTES.map((r, i) => {
          const sx = cx - 35 + i * 18;
          const member = r.steps.includes(m.n) || r.addOn.includes(m.n);
          return member ? (
            <g key={r.id}>
              <rect x={sx} y={m.y + 25} width={16} height={12} rx={3} fill={r.color} />
              <text
                x={sx + 8}
                y={m.y + 35}
                textAnchor="middle"
                fill="#ffffff"
                fontSize={10}
                fontWeight={700}
                fontFamily={FONT}
              >
                {r.letter}
              </text>
            </g>
          ) : (
            <rect key={r.id} x={sx} y={m.y + 25} width={16} height={12} rx={3} fill="#eef0f2" />
          );
        })
      );
    } else if (step >= 0) {
      badge = (
        <g>
          <rect x={cx - 27} y={m.y + 25} width={54} height={13} rx={6} fill={route.color} />
          <text
            x={cx}
            y={m.y + 35}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={10}
            fontWeight={700}
            fontFamily={FONT}
          >
            {`step ${step + 1}`}
          </text>
        </g>
      );
    } else if (isAddOn) {
      badge = (
        <g>
          <rect
            x={cx - 27}
            y={m.y + 25}
            width={54}
            height={13}
            rx={6}
            fill="#ffffff"
            stroke={route.color}
            strokeWidth={1}
          />
          <text
            x={cx}
            y={m.y + 35}
            textAnchor="middle"
            fill={route.color}
            fontSize={10}
            fontWeight={700}
            fontFamily={FONT}
          >
            add-on
          </text>
        </g>
      );
    }

    return (
      <g key={m.n}>
        <rect
          x={m.x}
          y={m.y}
          width={m.w}
          height={NODE_H}
          rx={6}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={dash}
        />
        <text
          x={cx}
          y={m.y + 18}
          textAnchor="middle"
          fill={off ? MUTED : INK}
          fontSize={12}
          fontWeight={600}
          fontFamily={FONT}
        >
          {`${m.n} ${m.name}`}
        </text>
        {badge}
      </g>
    );
  };

  const isLit = (e: MapEdge) => onRoute(e.from) && onRoute(e.to);

  const edge = (e: MapEdge) => {
    const lit = isLit(e);
    const d = e.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
    return (
      <g key={e.id}>
        {e.bridge && lit ? (
          <line
            x1={e.bridge[0]}
            y1={e.bridge[1] - 7}
            x2={e.bridge[0]}
            y2={e.bridge[1] + 7}
            stroke="#ffffff"
            strokeWidth={7}
          />
        ) : null}
        <path
          d={d}
          fill="none"
          stroke={lit ? (route ? SLATE : MUTED) : FAINT}
          strokeWidth={lit ? 1.6 : 1.2}
          strokeLinejoin="round"
          markerEnd={`url(#${slug}-${lit ? 'ah' : 'ahl'})`}
        />
      </g>
    );
  };

  const legendY = 540;
  const legend: ReactNode = route ? (
    <g>
      <rect x={34} y={legendY} width={54} height={13} rx={6} fill={route.color} />
      <text x={61} y={legendY + 10} textAnchor="middle" fill="#ffffff" fontSize={10} fontWeight={700} fontFamily={FONT}>
        step N
      </text>
      <text x={96} y={legendY + 10} fill={SLATE} fontSize={11} fontFamily={FONT}>
        on the route, in reading order
      </text>
      {route.addOn.length ? (
        <g>
          <rect
            x={300}
            y={legendY}
            width={54}
            height={13}
            rx={6}
            fill="#ffffff"
            stroke={route.color}
            strokeWidth={1}
          />
          <text x={327} y={legendY + 10} textAnchor="middle" fill={route.color} fontSize={10} fontWeight={700} fontFamily={FONT}>
            add-on
          </text>
          <text x={362} y={legendY + 10} fill={SLATE} fontSize={11} fontFamily={FONT}>
            {route.addOnLabel}
          </text>
        </g>
      ) : null}
      <rect x={530} y={legendY} width={24} height={13} rx={3} fill="#f4f4f4" stroke={FAINT} />
      <text x={562} y={legendY + 10} fill={SLATE} fontSize={11} fontFamily={FONT}>
        off the route
      </text>
      <line x1={670} y1={legendY + 6} x2={700} y2={legendY + 6} stroke={SLATE} strokeWidth={1.6} markerEnd={`url(#${slug}-ah)`} />
      <text x={708} y={legendY + 10} fill={SLATE} fontSize={11} fontFamily={FONT}>
        feeds, both ends on the route
      </text>
    </g>
  ) : (
    <g>
      {ROUTES.map((r, i) => {
        const lx = 34 + i * 180;
        return (
          <g key={r.id}>
            <rect x={lx} y={legendY} width={16} height={12} rx={3} fill={r.color} />
            <text x={lx + 8} y={legendY + 10} textAnchor="middle" fill="#ffffff" fontSize={10} fontWeight={700} fontFamily={FONT}>
              {r.letter}
            </text>
            <text x={lx + 22} y={legendY + 10} fill={SLATE} fontSize={11} fontFamily={FONT}>
              {r.tab.slice(3)}
            </text>
          </g>
        );
      })}
      <line x1={760} y1={legendY + 6} x2={790} y2={legendY + 6} stroke={MUTED} strokeWidth={1.4} markerEnd={`url(#${slug}-ah)`} />
      <text x={798} y={legendY + 10} fill={SLATE} fontSize={11} fontFamily={FONT}>
        feeds
      </text>
    </g>
  );

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        role="img"
        aria-labelledby="gs-map-title"
        style={{ width: '100%', minWidth: 760, height: 'auto' }}
      >
        <title id="gs-map-title">{mapTitle(view)}</title>
        <defs>
          <marker id={`${slug}-ah`} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={route ? SLATE : MUTED} />
          </marker>
          <marker id={`${slug}-ahl`} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={FAINT} />
          </marker>
        </defs>
        <rect x={0} y={0} width={MAP_W} height={MAP_H} rx={8} fill="#ffffff" />
        <text x={COL_B.x} y={14} fill={SLATE} fontSize={11} fontWeight={700} fontFamily={FONT}>
          Framing
        </text>
        <text x={COL_E.x} y={14} fill={SLATE} fontSize={11} fontWeight={700} fontFamily={FONT}>
          Reference, on demand
        </text>
        {MAP_HEADERS.map(([x, t]) => (
          <text key={t} x={x} y={96} fill={SLATE} fontSize={11} fontWeight={700} fontFamily={FONT}>
            {t}
          </text>
        ))}
        {MAP_EDGES.filter((e) => !isLit(e)).map(edge)}
        {MAP_EDGES.filter(isLit).map(edge)}
        {MAP_NODES.map(node)}
        {legend}
      </svg>
    </div>
  );
}

function ReadingMapTab({ view }: { view: MapView }) {
  return (
    <SpaceBetween size="xs">
      <ReadingMapDiagram view={view} />
      <Box variant="small" color="text-body-secondary">
        Schematic, not measured. Numbers are section numbers. Arrows follow the reading path (1 to
        2, 3 to 4, 5 to 7), the links listed under the mental models above, and the two sections
        whose traffic section 22 carries over EFA. On a phone, scroll the map sideways.
      </Box>
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* What a vLLM user types differently                                       */
/* ------------------------------------------------------------------------ */

interface DayOneRow {
  id: string;
  setting: ReactNode;
  change: ReactNode;
  section: string;
}

const DAY_ONE_ROWS: DayOneRow[] = [
  {
    id: 'metrics',
    setting: <code>--enable-metrics</code>,
    change: (
      <>
        Prometheus metrics are off by default. The flag mounts <code>/metrics</code> on the
        server&apos;s HTTP port, beside the API{' '}
        <Cite tier={1} href={sglangUrl(OBS_FIELDS, 'L70')}>
          observability.py L70
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L301-L304')} kind="code">
          http_server.py L301-L304
        </Cite>
        .
      </>
    ),
    section: '4, The Scheduler',
  },
  {
    id: 'memfrac',
    setting: <code>--mem-fraction-static</code>,
    change: (
      <>
        Covers the weights and the KV pool; activations and CUDA graphs use the rest. The computed
        default is about 0.83 on an 80 GB H100 at TP 1, by our arithmetic on the code formula{' '}
        <Cite tier={1} href={sglangUrl(MEMORY_HOOK, 'L283-L345')} kind="code">
          memory_hook.py L283-L345
        </Cite>
        , where vLLM&apos;s <code>--gpu-memory-utilization</code> is 0.92 for the whole instance{' '}
        <Cite tier={1} href={VLLM_CACHE_103}>
          vLLM cache.py L103-L111 (v0.31.0)
        </Cite>
        . Do not copy the value across.
      </>
    ),
    section: '6, KV Memory and the Defaults Your GPU Picks',
  },
  {
    id: 'policy',
    setting: <code>--schedule-policy</code>,
    change: (
      <>
        <code>fcfs</code>, first-come-first-served (FCFS), is the default{' '}
        <Cite tier={1} href={sglangUrl(SCHED_FIELDS, 'L82-L98')}>
          schedule.py L82-L98
        </Cite>
        . <code>lpm</code> (longest prefix match) is opt-in, and falls back to FCFS in any round
        where more than 128 requests wait{' '}
        <Cite tier={1} href={sglangUrl(POLICY, 'L300-L311')}>
          schedule_policy.py L300-L311
        </Cite>
        .
      </>
    ),
    section: '4, The Scheduler; 5, RadixAttention and the Radix Cache',
  },
  {
    id: 'mixed',
    setting: <code>--enable-mixed-chunk</code>,
    change: (
      <>
        Steps are prefill-first: a prefill step runs whenever one can be formed, and running
        requests wait for it{' '}
        <Cite tier={1} href={sglangUrl(SCHEDULER, 'L3766-L3870')} kind="code">
          scheduler.py L3766-L3870
        </Cite>
        . The flag, off by default, adds decode tokens to prefill steps, the closer match to
        vLLM&apos;s shared token budget{' '}
        <Cite tier={1} href={sglangUrl(SCHED_FIELDS, 'L202-L205')}>
          schedule.py L202-L205
        </Cite>
        .
      </>
    ),
    section: '4, The Scheduler',
  },
  {
    id: 'retract',
    setting: <code>sglang:num_retracted_requests_total</code>,
    change: (
      <>
        Retraction, SGLang&apos;s name for preemption, takes the requests with the fewest
        generated tokens first under the default <code>--retraction-policy length</code>{' '}
        <Cite tier={1} href={sglangUrl(SCHED_FIELDS, 'L122-L134')}>
          schedule.py L122-L134
        </Cite>
        . Watch this counter where you watched <code>vllm:num_preemptions</code>{' '}
        <Cite tier={1} href={sglangUrl(COLLECTOR, 'L544-L565')} kind="code">
          metrics_collector.py L544-L565
        </Cite>
        .
      </>
    ),
    section: '4, The Scheduler',
  },
  {
    id: 'page',
    setting: <code>--page-size</code>,
    change: (
      <>
        Defaults to 1, and the attention backend raises it{' '}
        <Cite tier={1} href={sglangUrl(OVR, 'L1304-L1326')}>
          overrides.py L1304-L1326
        </Cite>
        . By our reading of the default chain, the same Llama deployment reuses prefixes to the
        token on H100 and in 64-token pages on B200{' '}
        <Cite tier={1} href={sglangUrl(MOB, 'L268-L341')} kind="code">
          model_override_base.py L268-L341
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(OVR, 'L1125-L1137')} kind="code">
          overrides.py L1125-L1137
        </Cite>
        . The B200 figure holds with speculative decoding off, or on with{' '}
        <code>--speculative-eagle-topk 1</code> and <code>--speculative-num-steps</code> set;
        speculation with the topk above 1 or unset moves B200 to <code>flashinfer</code> and page
        1{' '}
        <Cite tier={1} href={sglangUrl(MOB, 'L303-L322')} kind="code">
          model_override_base.py L303-L322
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(SPEC_HOOK, 'L1068-L1090')} kind="code">
          speculative_hook.py L1068-L1090
        </Cite>
        .
      </>
    ),
    section: '6, KV Memory and the Defaults Your GPU Picks; 8, Attention Backends and Kernels',
  },
  {
    id: 'gpus',
    setting: <code>--tp 8 --attn-dp-size 8 --ep 8</code>,
    change: (
      <>
        Is 8 GPUs. Data-parallel attention and EP are widths inside the eight-GPU TP group, and
        neither multiplies it{' '}
        <Cite tier={1} href={sglangUrl(RTC, 'L137-L157')}>
          runtime_context.py L137-L157
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(RTC, 'L173-L178')}>
          runtime_context.py L173-L178
        </Cite>
        .
      </>
    ),
    section: '14, Parallelism',
  },
  {
    id: 'lora',
    setting: (
      <>
        LoRA (low-rank adaptation) adapter in the <code>model</code> field
      </>
    ),
    change: (
      <>
        Address an adapter as <code>model: &quot;base:adapter&quot;</code>, or with{' '}
        <code>lora_path</code> in <code>extra_body</code>. A bare adapter name, as{' '}
        <code>/v1/models</code> lists it, runs the base model with no error{' '}
        <Cite tier={1} href={sglangUrl(SERVING_BASE, 'L40-L71')}>
          serving_base.py L40-L71
        </Cite>
        .
      </>
    ),
    section: '12, Talking to SGLang',
  },
  {
    id: 'admin',
    setting: <code>--admin-api-key</code>,
    change: (
      <>
        With no key, the admin routes (weight updates, cache flush, memory release, LoRA load and
        unload) accept any client that reaches the port, and with <code>--api-key</code> alone
        the inference key opens them. The admin key makes them accept that key alone{' '}
        <Cite tier={1} href={sglangUrl(AUTH, 'L79-L151')}>
          auth.py L79-L151
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(SERVING, 'L154-L161')}>
          serving.py L154-L161
        </Cite>
        .
      </>
    ),
    section: '12, Talking to SGLang, which has the key matrix',
  },
];

const LAUNCH_LINE = `sglang serve --model-path <model> --enable-metrics --admin-api-key <key>`;

const READY_CHECK = `curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:30000/health`;

const CAPACITY_LINE = `max_total_num_tokens=N, chunked_prefill_size=N, max_prefill_tokens=N, max_running_requests=N, context_len=N, available_gpu_mem=N GB`;

const TWICE = `# Send this twice, unchanged. Use a prompt a few hundred tokens long.
curl -s http://127.0.0.1:30000/generate \\
  -H 'Content-Type: application/json' \\
  -d '{"text": "<the same long prompt>", "sampling_params": {"max_new_tokens": 32}}'`;

/* ------------------------------------------------------------------------ */
/* The section                                                              */
/* ------------------------------------------------------------------------ */

export function GettingStarted() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Find your route through the dive in two minutes, and the settings a vLLM user gets wrong on day one (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            2. Getting Started
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This page is the map for the rest of the dive. It is written for a technical lead who
            has run vLLM, has sized a GPU deployment, and wants to know whether SGLang behaves
            differently enough to matter. It assumes no SGLang experience.
          </Box>
          <Box variant="p">
            The challenge for that reader is familiarity. Most vLLM habits carry over, and the few
            that change meaning do so without an error. The memory fraction is the clearest case:
            SGLang computes about <strong>0.83</strong> for <code>--mem-fraction-static</code> on an
            80 GB H100 at TP (tensor parallelism) 1, by our arithmetic on the code formula{' '}
            <Cite tier={1} href={sglangUrl(MEMORY_HOOK, 'L283-L345')} kind="code">
              memory_hook.py L283-L345
            </Cite>
            , against vLLM&apos;s 0.92 for <code>--gpu-memory-utilization</code>{' '}
            <Cite tier={1} href={VLLM_CACHE_103}>
              vLLM cache.py L103-L111 (v0.31.0)
            </Cite>
            , and the two numbers measure different things. What follows: the concepts the dive
            builds on, the order of its mental models, the settings that change meaning, a first
            launch, and four routes through the 28 sections.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Check the four ideas this dive builds on, and open the vLLM dive section that defines any you are missing"
          >
            What to know before you start
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The dive builds on four concepts that the vLLM dive defines:
          </Box>
          <ol>
            <li>
              <strong>Prefill, decode and the KV (key-value) cache.</strong> Prompt processing is
              compute-bound, token generation is memory-bound, and the KV cache holds the attention
              state between them ({vllmLink(2, 'The Inference Workload')}).
            </li>
            <li>
              <strong>Continuous batching under a token budget.</strong> The scheduler forms the
              batch again on every step ({vllmLink(4, 'Scheduler & Continuous Batching')}).
            </li>
            <li>
              <strong>Paged KV memory and hash-based prefix caching.</strong> The cache is a pool of
              fixed-size slots addressed through a per-request table, vLLM finds a cached prefix
              through a chain of block hashes, and MLA (multi-head latent attention) shrinks the KV
              each token costs ({vllmLink(5, 'Paged KV Cache & Block Tables')};{' '}
              {vllmLink(6, 'Automatic Prefix Caching')}). Section 5, RadixAttention and the Radix
              Cache, describes SGLang&apos;s own pools.
            </li>
            <li>
              <strong>
                TP, DP and EP (tensor, data and expert parallelism), and data-parallel attention for
                MoE (mixture of experts) models.
              </strong>{' '}
              Which axis splits attention heads, requests and experts (
              {vllmLink(9, 'Distributed Inference')}). Section 14, Parallelism, shows how SGLang
              counts them.
            </li>
          </ol>
          <Box variant="p">
            Section 22, PD and Wide EP over EFA, has a prerequisite of its own. It brings up PD
            (prefill/decode) KV transfer and the wide-EP all-to-all over EFA (Elastic Fabric
            Adapter) as two stacks, and the layers below SGLang, libfabric and NCCL (NVIDIA
            Collective Communications Library), belong to the EFA dive: read{' '}
            <Link href="../efa/">EFA dive: libfabric and the EFA Provider</Link> and{' '}
            <Link href="../efa/">EFA dive: NCCL over EFA: the aws-ofi-nccl Plugin</Link> first.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read the sections in the order that lets each one explain the next, and know which later section each idea feeds"
          >
            Five mental models, in reading order
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The first half of the dive builds five mental models, in this order:
          </Box>
          <ol>
            <li>
              <strong>Every GPU process schedules for itself, one batch ahead</strong> (section 3,
              The SGLang Runtime; section 4, The Scheduler). Every later behaviour is a scheduler
              decision, so this comes first.
            </li>
            <li>
              <strong>Admission is a bet on early stopping</strong> (section 4). That bet decides
              when a request waits and which request is retracted.
            </li>
            <li>
              <strong>The KV cache is a shared prefix index</strong> (section 5, RadixAttention and
              the Radix Cache; section 7, HiCache). The cache, admission, the gateway and HiCache (the
              hierarchical cache) are
              all organised around it.
            </li>
            <li>
              <strong>The backend picks the page size, so the GPU sets reuse granularity</strong>{' '}
              (section 6, KV Memory and the Defaults Your GPU Picks; section 8, Attention Backends
              and Kernels; section 9, Quantization and KV Precision, checks the format). The page
              size is the tree&apos;s reuse unit, and the GPU picks the backend.
            </li>
            <li>
              <strong>At cluster scale the gateway approximates the index and PD moves it</strong>{' '}
              (sections 14 to 18). Scale-out carries the index model across servers.
            </li>
          </ol>
          <Box variant="p">
            Between models 4 and 5 sit the request features, each a per-deployment choice:
            constrained output and speculation change the step (section 10, Structured Output;
            section 11, Speculative Decoding), and APIs, adapters and RL (reinforcement learning)
            change how clients reach the engine (section 12, Talking to SGLang; section 13, SGLang
            as an RL Rollout Engine). Sections 19 to 22 map the models onto SageMaker, HyperPod, EKS
            (Elastic Kubernetes Service), EC2 (Elastic Compute Cloud) and EFA; sections 23 to 26
            compare, operate and decide. Section 27, Inside the Codebase, is reference to read last
            or on demand.
          </Box>
          <Box variant="p">
            These links between sections are the arrows on the reading map at the end of this page:
          </Box>
          <ul>
            <li>
              Section 4&apos;s admission charges the part of a prompt that section 5&apos;s tree did
              not cover{' '}
              <Cite tier={1} href={sglangUrl(POLICY, 'L1336-L1360')}>
                schedule_policy.py L1336-L1360
              </Cite>
              .
            </li>
            <li>
              Section 8&apos;s page size is section 5&apos;s reuse unit, because the tree matches
              whole pages only{' '}
              <Cite tier={1} href={sglangUrl(RADIX, 'L147-L151')}>
                radix_cache.py L147-L151
              </Cite>
              , and section 21, EC2 Instances, Images and GPU-Dependent Behaviour, maps it to EC2
              instance families.
            </li>
            <li>
              Section 12&apos;s admin plane is what section 13&apos;s trainer calls and what section
              25, Operations, secures.
            </li>
            <li>
              PD&apos;s push (section 15, PD Disaggregation) lands in pages that the decode server
              reserved from the pool section 6 sized{' '}
              <Cite tier={1} href={sglangUrl(PREFILL, 'L462-L537')} kind="code">
                prefill.py L462-L537
              </Cite>
              .
            </li>
            <li>
              Wide EP&apos;s DeepEP modes (section 16, Wide Expert Parallelism) split cleanly only
              under PD&apos;s roles (section 15).
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Move a vLLM habit across without a silent change in behaviour: nine settings and signals, each with the section that owns it"
          >
            What a vLLM user types differently
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each row is a setting whose meaning changes on the way from vLLM, or a signal to watch
            in its place. Section 23, SGLang and vLLM, has the long-form switching checklist,
            including tool-call parser names, regex and EBNF (Extended Backus-Naur Form) fields and
            the speculative draft shape.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={DAY_ONE_ROWS}
            columnDefinitions={[
              { id: 'setting', header: 'Setting or signal', cell: (r) => r.setting, minWidth: 170 },
              { id: 'change', header: 'In SGLang v0.5.22', cell: (r) => r.change, minWidth: 320 },
              { id: 'section', header: 'Section', cell: (r) => r.section, minWidth: 150 },
            ]}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Start a server you can measure, read the startup lines that set its capacity, and watch a repeated prompt hit the cache"
          >
            First launch: see the index work
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One launch line gives a server with metrics on and the admin routes behind their own
            key:
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{LAUNCH_LINE}</pre>
          <Box variant="p">
            <code>sglang serve</code> is the entrypoint the server&apos;s argument parser is built
            around{' '}
            <Cite tier={1} href={sglangUrl(SERVER_ARGS, 'L665')} kind="code">
              server_args.py L665
            </Cite>
            ; <code>python -m sglang.launch_server</code> still starts a server and warns that{' '}
            <code>sglang serve</code> is the recommended entrypoint{' '}
            <Cite tier={1} href={sglangUrl(LAUNCH, 'L70-L76')} kind="code">
              launch_server.py L70-L76
            </Cite>
            . Section 3, The SGLang Runtime, shows the processes it starts.
          </Box>
          <Box variant="p">
            The line keeps the default bind, 127.0.0.1 on port 30000, so only the local host can
            reach the server{' '}
            <Cite tier={1} href={sglangUrl(SERVING, 'L65-L66')}>
              serving.py L65-L66
            </Cite>
            . Add <code>--host 0.0.0.0</code> only when other machines need the port: it opens every
            route to the network, admin routes included. Read the key matrix in section 12, Talking
            to SGLang, first. It sets out the keys each deployment needs, the two serving modes in
            which a key is refused or never checked, and the read route that, by our reading of the
            code, returns the keys themselves.
          </Box>
          <Box variant="p">
            <strong>Wait for ready.</strong> <code>/health</code> answers 503 while the server
            starts and 200 once a one-token check succeeds{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L705-L760')}>
              http_server.py L705-L760
            </Cite>
            :
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{READY_CHECK}</pre>
          <Box variant="p">
            <strong>Read three things in the startup log.</strong>
          </Box>
          <ul>
            <li>
              The <code>server_args=</code> line prints every resolved argument{' '}
              <Cite tier={1} href={sglangUrl(ENGINE, 'L1179')} kind="code">
                engine.py L1179
              </Cite>
              . Check <code>mem_fraction_static</code>, about <strong>0.83</strong> on an 80 GB H100
              at TP 1 by our arithmetic where a vLLM launch line carries 0.92, then{' '}
              <code>attention_backend</code> and <code>page_size</code>.
            </li>
            <li>
              The page-size override warning. A backend that raised the page size says so, for
              example{' '}
              <code>
                TensorRT-LLM MHA only supports page_size of 16, 32, 64 or 128, changing page_size
                from 1 to 64.
              </code>{' '}
              on a B200 serving a Llama-style model{' '}
              <Cite tier={1} href={sglangUrl(OVR, 'L1124-L1137')}>
                overrides.py L1124-L1137
              </Cite>
              . The cache then reuses prefixes in 64-token pages (section 8, Attention Backends and
              Kernels).
            </li>
            <li>
              The capacity line, printed by TP rank 0{' '}
              <Cite tier={1} href={sglangUrl(SCHEDULER, 'L1229-L1241')} kind="code">
                scheduler.py L1229-L1241
              </Cite>
              :
            </li>
          </ul>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{CAPACITY_LINE}</pre>
          <Box variant="p">
            <code>max_total_num_tokens</code> is the KV pool in tokens: the memory left once the
            weights load and the activation share is held back{' '}
            <Cite tier={1} href={sglangUrl(KV_CONF, 'L2671-L2741')} kind="code">
              kv_cache_configurator.py L2671-L2741
            </Cite>
            , divided by the bytes one token costs across all layers{' '}
            <Cite tier={1} href={sglangUrl(POOL_CONF, 'L614-L624')} kind="code">
              pool_configurator.py L614-L624
            </Cite>
            . <code>max_running_requests</code>, left unset, is derived from that count and lands
            between 2048 and 4096 in practice{' '}
            <Cite tier={1} href={sglangUrl(KV_CONF, 'L2800-L2851')} kind="code">
              kv_cache_configurator.py L2800-L2851
            </Cite>
            , or 48 under EAGLE-family, NGRAM, <code>DFLASH</code> or <code>DSPARK</code>{' '}
            speculative decoding{' '}
            <Cite tier={1} href={sglangUrl(SPEC_HOOK, 'L995-L1003')} kind="code">
              speculative_hook.py L995-L1003
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SPEC_HOOK, 'L1204-L1212')} kind="code">
              speculative_hook.py L1204-L1212
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SPEC_HOOK, 'L421-L429')} kind="code">
              speculative_hook.py L421-L429
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SPEC_HOOK, 'L777-L785')} kind="code">
              speculative_hook.py L777-L785
            </Cite>
            . Section 6, KV Memory and the Defaults Your GPU Picks, explains both.
          </Box>
          <Box variant="p">
            <strong>Send one request twice.</strong>
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{TWICE}</pre>
          <Box variant="p">
            Each answer carries a <code>meta_info</code> with <code>prompt_tokens</code> and{' '}
            <code>cached_tokens</code>, the request&apos;s radix-cache hit{' '}
            <Cite tier={1} href={sglangUrl(TOKENIZER, 'L2505-L2557')}>
              tokenizer_manager.py L2505-L2557
            </Cite>
            . On the first answer it counts only tokens an earlier request already left in the
            tree, so a fresh prompt shows little or none. By our reading of the code, the second
            answer reports the whole prompt less one token at page size 1, rounded down to whole
            pages on a backend that raised it. That is the index at work: the second request found
            the first one&apos;s prompt in the tree, and only the unmatched tail was computed again.
            With 64-token pages a prompt shorter than one page is never matched{' '}
            <Cite tier={1} href={sglangDocsSrcUrl('advanced_features/attention_backend', 'L321-L323')}>
              SGLang docs: attention backend (v0.5.22 source)
            </Cite>
            , which is why the prompt above is long.
          </Box>
          <ExpandableSection headerText="Why the second answer is one token short, or rounded to a page">
            <Box variant="p">
              A match stops at least one token before the end of the prompt, so that the last
              position is computed and yields logits{' '}
              <Cite tier={1} href={sglangUrl(BATCH, 'L1696-L1706')} kind="code">
                schedule_batch.py L1696-L1706
              </Cite>
              , and the tree matches whole pages only{' '}
              <Cite tier={1} href={sglangUrl(RADIX, 'L147-L151')}>
                radix_cache.py L147-L151
              </Cite>
              . So on a repeated prompt, <code>cached_tokens</code> is <code>prompt_tokens</code>{' '}
              minus one, rounded down to a multiple of the page size. This is our reading of the
              code, not run.
            </Box>
          </ExpandableSection>
          <Box variant="p">
            Across all traffic, with <code>--enable-metrics</code> on, the same check is{' '}
            <code>sum(rate(sglang:cached_tokens_total[5m])) / sum(rate(sglang:prompt_tokens_total[5m]))</code>
            ; sum each side, since the two counters carry different labels{' '}
            <Cite tier={1} href={sglangUrl(COLLECTOR, 'L2027-L2069')} kind="code">
              metrics_collector.py L2027-L2069
            </Cite>{' '}
            (section 5, RadixAttention and the Radix Cache).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick the route that matches your workload and read its sections in order; section 23 is on every one"
          >
            Four routes through the dive
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each route is a reading order through the sections one kind of workload needs. All four
            open with sections 1 and 2 and pass through section 23, SGLang and vLLM, which keeps
            the long-form comparison. Every mechanism section also ends on an &quot;Against
            vLLM&quot; line, so a reader moving forward meets the differences where they arise.
          </Box>
          <ul>
            <li>
              <strong>A: I serve agentic or multi-turn traffic.</strong> 1, 2, 3, 4, 5, 6, 7, 8, 10,
              12, 17, 23, 25, 26. Prefixes shared across turns put the tree (5), its host-memory
              tier (7) and the cache-aware gateway (17) at the centre, and a required or named tool
              call is enforced with a grammar, the machinery of structured output (10){' '}
              <Cite tier={1} href={sglangUrl(FC_PARSER, 'L295-L380')} kind="code">
                function_call_parser.py L295-L380
              </Cite>
              .
            </li>
            <li>
              <strong>M: I run large MoE models at scale.</strong> 1, 2, 3, 4, 5, 6, 8, 11, 14, 15,
              16, 17, 18, 23, 26; on AWS add 20, 21, 22. The route centres on how SGLang counts and
              carves GPUs (14), splits prefill from decode (15) and spreads experts (16).
            </li>
            <li>
              <strong>W: I deploy on AWS this quarter.</strong> 1, 2, 3, 5, 6, 8, 12, 19, 20, 21,
              23, 25, 26; for PD or wide EP add 14, 15, 16, 18, 22. The AWS sections rest on the
              defaults the GPU sets (6, 8), and section 12 sets the keys each platform needs.
            </li>
            <li>
              <strong>V: I am moving a vLLM deployment.</strong> 1, 2, 4, 6, 9, 10, 12, 23, 25. The
              route covers what a configuration port touches: scheduler defaults (4), the memory
              fraction (6), KV precision (9), and the request fields clients send (10, 12).
            </li>
          </ul>
          <Tabs
            ariaLabel="Reading routes"
            tabs={[
              { id: 'all', label: 'All routes', content: <ReadingMapTab view="all" /> },
              ...ROUTES.map((r) => ({
                id: r.id,
                label: r.tab,
                content: <ReadingMapTab view={r.id} />,
              })),
            ]}
          />
          <Box variant="p">
            <strong>Your next step:</strong> open the first section of your route that you have not
            read. On routes A, M and W that is section 3, The SGLang Runtime; on route V it is
            section 4, The Scheduler, with the launch above running beside it.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
