import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

const NIXL = 'vllm/distributed/kv_transfer/kv_connector/v1/nixl';
const DISAGG_DOC = 'docs/features/disagg_prefill.md';
const USAGE_DOC = 'docs/features/nixl_connector_usage.md';
const COMPAT_DOC = 'docs/features/nixl_connector_compatibility.md';
const PROXY_DIR = 'examples/disaggregated/disaggregated_serving';
const RELEASE_NOTES = 'https://github.com/vllm-project/vllm/releases/tag/';

interface PhaseRow {
  phase: string;
  bound: string;
  metric: string;
  scaling: string;
  tuning: string;
}

const phaseRows: PhaseRow[] = [
  {
    phase: 'Prefill',
    bound: 'Compute-bound (FLOPs)',
    metric: 'TTFT (time-to-first-token)',
    scaling: 'Scale with batch size / large prompts; one big parallel pass over the prompt',
    tuning: 'Favor tensor parallel + high compute density; tolerate larger batches',
  },
  {
    phase: 'Decode',
    bound: 'Memory-bandwidth-bound (reads from HBM, high-bandwidth memory)',
    metric: 'ITL (inter-token latency)',
    scaling: 'Scale with concurrent sequences; one token per step per sequence',
    tuning: 'Favor more replicas / KV capacity; keep batches latency-tight',
  },
];

interface ConnectorRow {
  name: string;
  what: string;
}

const connectorRows: ConnectorRow[] = [
  {
    name: 'NixlConnector',
    what: 'NIXL pull mode: the decoder reads the prefiller\'s KV blocks. Alias of NixlPullConnector, and the reference connector for disaggregated prefill.',
  },
  {
    name: 'NixlPushConnector',
    what: 'NIXL push mode, available from v0.24.0: the prefiller writes into KV blocks the decoder allocated.',
  },
  {
    name: 'LMCacheConnectorV1',
    what: 'LMCache integration. Its disaggregated-prefill example uses NIXL for the transfer.',
  },
  {
    name: 'MooncakeConnector',
    what: 'Mooncake transfer engine. Producer and consumer roles, with a bootstrap server port set on prefillers (VLLM_MOONCAKE_BOOTSTRAP_PORT, default 8998).',
  },
  {
    name: 'MoRIIOConnector',
    what: 'ROCm only (AMD GPUs), built on the MoRI-IO point-to-point library.',
  },
  {
    name: 'MultiConnector',
    what: 'Composes an ordered list of child connectors, for example NIXL for the transfer plus a storage connector.',
  },
];

interface CompatRow {
  setting: string;
  rule: string;
  src: ReactNode;
}

const compatRows: CompatRow[] = [
  {
    setting: 'Tensor parallel size',
    rule: 'May differ for dense and MoE models. MLA KV is replicated across TP workers, so there is no head split, and with P TP > D TP only a single read runs. Hybrid SSM / Mamba models need P TP == D TP.',
    src: (
      <Cite tier={1} href={vllmUrl(COMPAT_DOC, 'L50-L72')}>
        compatibility matrix L50-L72
      </Cite>
    ),
  },
  {
    setting: 'Block size',
    rule: 'The P block must be smaller than the D block and divide it. The matrix limits this to models that do not need HMA (non-hybrid); the pull code also maps a hybrid model\'s blocks at the ratio. Push raises on a mismatch for hybrid attention models.',
    src: (
      <>
        <Cite tier={1} href={vllmUrl(COMPAT_DOC, 'L66-L72')} kind="doc-code-conflict">
          compatibility matrix L66-L72
        </Cite>{' '}
        <Cite
          tier={1}
          href={vllmUrl('vllm/distributed/kv_transfer/kv_connector/utils.py', 'L504-L510')}
          kind="code"
        >
          kv_connector/utils.py L504-L510
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl(`${NIXL}/base_worker.py`, 'L3266-L3303')} kind="code">
          base_worker.py L3266-L3303
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl(`${NIXL}/base_worker.py`, 'L2264-L2268')} kind="code">
          base_worker.py L2264-L2268
        </Cite>
      </>
    ),
  },
  {
    setting: 'KV cache layout',
    rule: 'LBHNC (head-major, the HND layout) is the NIXL default for non-MLA models. LBNHC (token-major, the NHD layout) works but rules out heterogeneous-TP head splitting. LBHNC on P with LBNHC on D is experimental, behind enable_permute_local_kv, and not supported with HMA.',
    src: (
      <>
        <Cite tier={1} href={vllmUrl(COMPAT_DOC, 'L101-L105')}>
          compatibility matrix L101-L105
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl(USAGE_DOC, 'L403-L411')}>
          usage guide L403-L411
        </Cite>
      </>
    ),
  },
  {
    setting: 'Pipeline parallel size',
    rule: 'Pull rejects PP > 1 with a hybrid KV cache at startup. Push accepts a PP-sharded prefiller writing into a PP = 1 decoder; decode-side PP and Mamba layers under PP are rejected.',
    src: (
      <>
        <Cite tier={1} href={vllmUrl(COMPAT_DOC, 'L107-L124')}>
          compatibility matrix L107-L124
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl(`${NIXL}/base_worker.py`, 'L786-L806')} kind="code">
          base_worker.py L786-L806
        </Cite>
      </>
    ),
  },
  {
    setting: 'Speculative decoding',
    rule: 'The speculative method and draft-model configuration must match. num_speculative_tokens may differ.',
    src: (
      <Cite tier={1} href={vllmUrl(COMPAT_DOC, 'L76-L99')}>
        compatibility matrix L76-L99
      </Cite>
    ),
  },
  {
    setting: 'Everything the handshake hashes',
    rule: 'vLLM and NIXL connector version, model, attention backend, KV cache dtype and transfer mode must match. The number of KV blocks may differ.',
    src: (
      <Cite tier={1} href={vllmUrl(COMPAT_DOC, 'L76-L99')}>
        compatibility matrix L76-L99
      </Cite>
    ),
  },
];

interface DecisionRow {
  signal: string;
  verdict: string;
  why: string;
}

const decisionRows: DecisionRow[] = [
  {
    signal: 'Strict, separately-negotiated TTFT and ITL SLOs',
    verdict: 'Use it',
    why: 'Physical isolation means a prefill burst cannot blow the decode ITL budget, and vice versa.',
  },
  {
    signal: 'Large prefill:decode imbalance (long prompts, short answers, or the reverse)',
    verdict: 'Use it',
    why: 'Each pool sizes to its own load instead of one engine sized for the worse of the two.',
  },
  {
    signal: 'You need each phase tuned with a different parallel strategy',
    verdict: 'Use it',
    why: 'Prefill and decode are separate processes, so their TP sizes can differ, within the limits of the P/D compatibility table above.',
  },
  {
    signal: 'Goal is raw tokens/sec or cost-per-token',
    verdict: 'Do NOT use it',
    why: 'The docs are explicit: it does not improve throughput. You pay a KV-transfer tax for isolation.',
  },
  {
    signal: 'Single SLO, balanced prompt/response, one pool already meets it',
    verdict: 'Do NOT use it',
    why: 'Chunked prefill in a unified engine is simpler and avoids the cross-instance copy entirely.',
  },
  {
    signal: 'No fast RDMA fabric between the pools',
    verdict: 'Do NOT use it',
    why: 'KV transfer over a slow link can cost more than the prefill stall it was meant to avoid.',
  },
];

function DisaggDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 820 384"
        role="img"
        aria-labelledby="disagg-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="disagg-title">
          Disaggregated prefill and decode: a prefiller pool computes the prompt KV cache, a KV
          connector moves it to a decoder pool that generates the tokens, and each pool scales on
          its own. With NIXL the decoder issues an RDMA READ in pull mode and the prefiller issues
          an RDMA WRITE in push mode, over UCX by default or LIBFABRIC for EFA on AWS.
        </title>
        <style>
          {`
            .dg-pool { stroke-width: 1.5; }
            .dg-prefill { fill: #0972d3; stroke: #065299; }
            .dg-decode { fill: #1f7a70; stroke: #165a53; }
            .dg-xfer { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
            .dg-tt { fill: #ffffff; font: 600 14px sans-serif; text-anchor: middle; }
            .dg-ts { fill: #ffffff; font: 11px sans-serif; text-anchor: middle; }
            .dg-xt { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
            .dg-xs { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
            .dg-xn { fill: #8b6c00; font: 600 11px sans-serif; text-anchor: middle; }
            .dg-lbl { fill: #414d5c; font: 600 12px sans-serif; text-anchor: middle; }
            .dg-sub { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
            .dg-arr { stroke: #5f6b7a; stroke-width: 2; fill: none; }
            .dg-div { stroke: #d5c48a; stroke-width: 1; }
          `}
        </style>
        <defs>
          <marker
            id="dg-ah"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
          </marker>
        </defs>
        <rect x={0} y={0} width={820} height={384} rx={8} fill="#ffffff" />

        <text className="dg-lbl" x={410} y={30}>Request: prompt in, tokens out</text>

        {/* Prefiller pool */}
        <rect className="dg-pool dg-prefill" x={30} y={56} width={220} height={156} rx={8} />
        <text className="dg-tt" x={140} y={92}>Prefiller pool</text>
        <text className="dg-ts" x={140} y={114}>compute-bound</text>
        <text className="dg-ts" x={140} y={132}>owns TTFT</text>
        <text className="dg-ts" x={140} y={162}>runs the one big prompt pass,</text>
        <text className="dg-ts" x={140} y={178}>builds the KV cache</text>

        {/* KV connector */}
        <rect className="dg-xfer" x={300} y={56} width={220} height={156} rx={8} />
        <text className="dg-xt" x={410} y={80}>KV connector</text>
        <text className="dg-xs" x={410} y={102}>NixlConnector (pull)</text>
        <text className="dg-xs" x={410} y={118}>NixlPushConnector (push)</text>
        <text className="dg-xs" x={410} y={134}>LMCache / Mooncake /</text>
        <text className="dg-xs" x={410} y={150}>MoRIIO (ROCm only)</text>
        <line className="dg-div" x1={320} y1={162} x2={500} y2={162} />
        <text className="dg-xn" x={410} y={180}>NIXL: UCX (default) or</text>
        <text className="dg-xn" x={410} y={196}>LIBFABRIC (EFA on AWS)</text>

        {/* Decoder pool */}
        <rect className="dg-pool dg-decode" x={570} y={56} width={220} height={156} rx={8} />
        <text className="dg-tt" x={680} y={92}>Decoder pool</text>
        <text className="dg-ts" x={680} y={114}>memory-bandwidth-bound</text>
        <text className="dg-ts" x={680} y={132}>owns ITL</text>
        <text className="dg-ts" x={680} y={162}>streams tokens one step</text>
        <text className="dg-ts" x={680} y={178}>at a time from the KV</text>

        {/* KV hand-off arrows */}
        <path className="dg-arr" d="M250,134 L298,134" markerEnd="url(#dg-ah)" />
        <path className="dg-arr" d="M520,134 L568,134" markerEnd="url(#dg-ah)" />
        <text className="dg-sub" x={275} y={124}>KV out</text>
        <text className="dg-sub" x={545} y={124}>KV in</text>

        {/* Who initiates, per NIXL mode */}
        <text className="dg-xs" x={410} y={236}>NIXL pull: the decoder issues the READ</text>
        <text className="dg-xs" x={410} y={252}>NIXL push: the prefiller issues the WRITE</text>

        {/* Independent scaling */}
        <text className="dg-sub" x={140} y={236}>scale prefill replicas for TTFT</text>
        <text className="dg-sub" x={680} y={236}>scale decode replicas for ITL</text>
        <path className="dg-arr" d="M140,246 L140,276" markerEnd="url(#dg-ah)" />
        <path className="dg-arr" d="M680,246 L680,276" markerEnd="url(#dg-ah)" />
        <rect className="dg-pool dg-prefill" x={50} y={282} width={180} height={34} rx={6} opacity={0.85} />
        <rect className="dg-pool dg-prefill" x={64} y={294} width={180} height={34} rx={6} opacity={0.55} />
        <rect className="dg-pool dg-decode" x={590} y={282} width={180} height={34} rx={6} opacity={0.85} />
        <rect className="dg-pool dg-decode" x={604} y={294} width={180} height={34} rx={6} opacity={0.55} />
        <text className="dg-ts" x={150} y={304}>+N prefillers</text>
        <text className="dg-ts" x={690} y={304}>+M decoders</text>

        <text className="dg-lbl" x={410} y={362}>
          Each pool scales on its own; the connector is the only coupling
        </text>
      </svg>
    </div>
  );
}

const NPP_P = 120;
const NPP_X = 410;
const NPP_D = 700;

/** A message label on a light pill, so it reads cleanly over a lifeline. */
function NppLabel({ x, y, cls, children }: { x: number; y: number; cls: string; children: string }) {
  const w = children.length * 6.3 + 14;
  return (
    <>
      <rect x={x - w / 2} y={y - 12} width={w} height={16} fill="#fafbfc" />
      <text className={cls} x={x} y={y}>
        {children}
      </text>
    </>
  );
}

function NppHeads() {
  return (
    <>
      {[
        { x: NPP_P, label: 'Prefiller (P)' },
        { x: NPP_X, label: 'Proxy' },
        { x: NPP_D, label: 'Decoder (D)' },
      ].map((h) => (
        <g key={h.label}>
          <rect
            className={h.label === 'Proxy' ? 'npp-headx' : 'npp-head'}
            x={h.x - 75}
            y={36}
            width={150}
            height={28}
            rx={6}
          />
          <text className="npp-ht" x={h.x} y={55}>
            {h.label}
          </text>
          <line className="npp-life" x1={h.x} y1={64} x2={h.x} y2={212} />
        </g>
      ))}
    </>
  );
}

function NixlPullPushDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 820 470"
        role="img"
        aria-labelledby="nixl-pullpush-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="nixl-pullpush-title">
          NIXL pull and push as two message sequences. In pull mode the proxy sends the prefill leg
          first, passes the prefiller&apos;s block ids to the decoder, and the decoder imports the
          prefiller&apos;s memory descriptors and issues a NIXL READ. In push mode the proxy sends
          both legs at once with only the prefiller&apos;s address, the decoder sends its
          pre-allocated block ids in a PUSH_REG notification, and the prefiller imports the
          decoder&apos;s descriptors and issues a NIXL WRITE.
        </title>
        <style>
          {`
            .npp-panel { fill: #fafbfc; stroke: #d1d5db; stroke-width: 1; }
            .npp-hdr { fill: #0f1b2a; font: 600 13px sans-serif; }
            .npp-head { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
            .npp-headx { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.5; }
            .npp-ht { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: middle; }
            .npp-life { stroke: #879596; stroke-width: 1; stroke-dasharray: 4 4; }
            .npp-act { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1; }
            .npp-actl { fill: #0972d3; font: 11px sans-serif; text-anchor: end; }
            .npp-px { stroke: #6f4cc4; stroke-width: 1.5; fill: none; }
            .npp-ctl { stroke: #0972d3; stroke-width: 1.5; fill: none; }
            .npp-data { stroke: #037f0c; stroke-width: 3; fill: none; }
            .npp-lpx { fill: #6f4cc4; font: 11px sans-serif; text-anchor: middle; }
            .npp-lctl { fill: #0972d3; font: 11px sans-serif; text-anchor: middle; }
            .npp-ldata { fill: #037f0c; font: 600 11px sans-serif; text-anchor: middle; }
          `}
        </style>
        <defs>
          <marker id="npp-a-px" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#6f4cc4" />
          </marker>
          <marker id="npp-a-ctl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#0972d3" />
          </marker>
          <marker id="npp-a-data" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#037f0c" />
          </marker>
        </defs>
        <rect x={0} y={0} width={820} height={470} rx={8} fill="#ffffff" />

        {/* ---------- Pull ---------- */}
        <g transform="translate(0,8)">
          <rect className="npp-panel" x={8} y={0} width={804} height={222} rx={8} />
          <text className="npp-hdr" x={22} y={24}>
            Pull: NixlConnector (alias of NixlPullConnector). The decoder initiates.
          </text>
          <NppHeads />
          <rect className="npp-act" x={NPP_P - 6} y={90} width={12} height={28} />
          <text className="npp-actl" x={NPP_P - 12} y={108}>prefill</text>

          <path className="npp-px" d={`M${NPP_X},90 L${NPP_P + 7},90`} markerEnd="url(#npp-a-px)" />
          <NppLabel x={265} y={84} cls="npp-lpx">1. prefill leg (max_tokens=1)</NppLabel>

          <path className="npp-px" d={`M${NPP_P + 6},118 L${NPP_X - 1},118`} markerEnd="url(#npp-a-px)" />
          <NppLabel x={265} y={112} cls="npp-lpx">2. P&apos;s block ids, in kv_transfer_params</NppLabel>

          <path className="npp-px" d={`M${NPP_X},146 L${NPP_D - 1},146`} markerEnd="url(#npp-a-px)" />
          <NppLabel x={555} y={140} cls="npp-lpx">3. decode leg + P&apos;s block ids</NppLabel>

          <path className="npp-ctl" d={`M${NPP_D},174 L${NPP_P + 1},174`} markerEnd="url(#npp-a-ctl)" />
          <NppLabel x={410} y={168} cls="npp-lctl">4. handshake: D imports P&apos;s memory descriptors</NppLabel>

          <path className="npp-data" d={`M${NPP_P},202 L${NPP_D - 1},202`} markerEnd="url(#npp-a-data)" />
          <NppLabel x={410} y={195} cls="npp-ldata">5. NIXL READ posted by D: KV blocks move P to D</NppLabel>
        </g>

        {/* ---------- Push ---------- */}
        <g transform="translate(0,240)">
          <rect className="npp-panel" x={8} y={0} width={804} height={222} rx={8} />
          <text className="npp-hdr" x={22} y={24}>
            Push: NixlPushConnector, from v0.24.0. The prefiller initiates.
          </text>
          <NppHeads />
          <rect className="npp-act" x={NPP_P - 6} y={90} width={12} height={74} />
          <text className="npp-actl" x={NPP_P - 12} y={130}>prefill</text>

          <path className="npp-px" d={`M${NPP_X},90 L${NPP_P + 7},90`} markerEnd="url(#npp-a-px)" />
          <NppLabel x={265} y={84} cls="npp-lpx">1. prefill leg</NppLabel>
          <path className="npp-px" d={`M${NPP_X},90 L${NPP_D - 1},90`} markerEnd="url(#npp-a-px)" />
          <circle cx={NPP_X} cy={90} r={4} fill="#6f4cc4" />
          <NppLabel x={555} y={84} cls="npp-lpx">1. decode leg: P&apos;s address, no block ids</NppLabel>

          <path className="npp-ctl" d={`M${NPP_D},118 L${NPP_P + 7},118`} markerEnd="url(#npp-a-ctl)" />
          <NppLabel x={410} y={112} cls="npp-lctl">2. PUSH_REG notification: D&apos;s pre-allocated block ids</NppLabel>

          <path className="npp-ctl" d={`M${NPP_P + 6},146 L${NPP_D - 1},146`} markerEnd="url(#npp-a-ctl)" />
          <NppLabel x={410} y={140} cls="npp-lctl">3. reverse handshake: P imports D&apos;s memory descriptors</NppLabel>

          <path className="npp-data" d={`M${NPP_P},174 L${NPP_D - 1},174`} markerEnd="url(#npp-a-data)" />
          <NppLabel x={410} y={167} cls="npp-ldata">4. NIXL WRITE posted by P: KV blocks move P to D</NppLabel>

          <path className="npp-ctl" d={`M${NPP_P},202 L${NPP_D - 1},202`} markerEnd="url(#npp-a-ctl)" />
          <NppLabel x={410} y={196} cls="npp-lctl">5. completion notification, then P frees its blocks</NppLabel>
        </g>
      </svg>
    </div>
  );
}

export function DisaggregatedServing() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Run prefill on one set of instances and decode on another, so each phase scales to its own bottleneck and a prefill burst stays off the decode latency budget. You buy latency isolation and pay for moving the cache between them (verified against vLLM v0.31.0, commit db9527a4, 2026-10-16)"
          >
            10. Disaggregated Prefill / Decode
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Alert type="warning" header="Experimental: check names against your vLLM version">
            vLLM marks disaggregated prefilling{' '}
            <em>&quot;experimental and subject to change&quot;</em>{' '}
            <Cite tier={1} href={vllmUrl(DISAGG_DOC, 'L1-L6')}>
              disagg_prefill.md L1-L6
            </Cite>
            . The connector names, config fields and roles below are those of v0.31.0. Read this
            section for the shape of the design, and check the API against the docs for the
            version you run.
          </Alert>
          <Box variant="p">
            A single inference engine serves two phases with opposite resource profiles.{' '}
            <strong>Prefill</strong> processes the whole prompt in one parallel pass, so it is{' '}
            <strong>compute-bound</strong> and it owns{' '}
            <strong>TTFT (time-to-first-token)</strong>. <strong>Decode</strong> then emits one
            token per step, reading the entire KV (key-value) cache every step, so it is{' '}
            <strong>memory-bandwidth-bound</strong> and it owns{' '}
            <strong>ITL (inter-token latency)</strong>. In one engine the two contend: a burst of
            expensive prefills stalls the decode loop and lifts tail ITL, and a packed decode batch
            delays prefills and lifts TTFT. One engine carries two SLOs (service level objectives)
            that pull against each other.
          </Box>
          <Box variant="p">
            Disaggregation splits the phases physically. A <strong>prefiller pool</strong> runs
            prefill, a <strong>decoder pool</strong> runs decode, and a{' '}
            <strong>KV connector</strong> ships each prompt&apos;s KV cache from the prefiller to
            the decoder that generates from it. Each pool then scales to its own load and tunes to
            its own bottleneck, and a prefill burst cannot reach the decode latency budget{' '}
            <Cite tier={1} href={vllmUrl(DISAGG_DOC, 'L12-L13')}>
              disagg_prefill.md L12-L13
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Three boxes and one wire: what each pool owns, and the connector that is their only coupling"
          >
            The data path
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The prefiller does the compute-heavy prompt pass and produces a KV cache. A KV
            connector moves that cache across the network: the reference connector uses NIXL
            (NVIDIA Inference Xfer Library) for RDMA (remote direct memory access), through its
            default UCX (Unified Communication X) backend, or through its LIBFABRIC backend over
            EFA (Elastic Fabric Adapter) on AWS. The decoder receives the cache and runs the
            bandwidth-heavy token loop. The connector is the <em>only</em> coupling between the
            pools: replica count and hardware are chosen per pool, and the parallel layout is
            chosen per pool within the limits the connector checks (below).
          </Box>
          <DisaggDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic, illustrative, not measured.
          </Box>
          <Box variant="p">
            <strong>The same split, one stage earlier.</strong> For multimodal models, vLLM can
            also run the vision encoder in separate instances (encode, prefill, decode, or E/P/D)
            and ship encoder outputs to the prefill side over <code>--ec-transfer-config</code>,
            with the registered EC (encoder cache) connectors <code>ECExampleConnector</code>,{' '}
            <code>ECCPUConnector</code> and <code>ECMooncakeConnector</code>{' '}
            <Cite tier={1} href={vllmDocsUrl('features/disagg_encoder/')}>
              vLLM docs: Disaggregated encoder
            </Cite>{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/distributed/ec_transfer/ec_connector/factory.py', 'L81-L97')}
              kind="code"
            >
              ec_connector/factory.py L81-L97
            </Cite>
            . The reasoning on this page carries over: the encoder fleet scales on its own.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which phase owns which latency metric, and why splitting them buys isolation rather than throughput"
          >
            Two phases, two bottlenecks
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Disaggregation only makes sense once you see how differently the two phases behave.
            Prefill is a wide, one-shot matrix problem; decode is a narrow, repeated,
            memory-streaming problem. In a unified engine you pick one set of knobs and
            compromise both. Split apart, each phase gets the parallel strategy, batch policy,
            and replica count that fit it.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'phase', header: 'Phase', cell: (r) => <strong>{r.phase}</strong>, minWidth: 90 },
              { id: 'bound', header: 'Bottleneck', cell: (r) => r.bound, minWidth: 200 },
              { id: 'metric', header: 'Latency metric it owns', cell: (r) => r.metric, minWidth: 170 },
              { id: 'scaling', header: 'How it scales', cell: (r) => r.scaling, minWidth: 230 },
              { id: 'tuning', header: 'How you tune it', cell: (r) => r.tuning, minWidth: 230 },
            ]}
            items={phaseRows}
          />
          <Alert type="success" header="What the split buys: latency isolation, at the cost of a KV transfer">
            <SpaceBetween size="s">
              <Box variant="p">
                Disaggregation does not make the system faster in aggregate. The vLLM docs put it
                in capitals:{' '}
                <strong><em>&quot;Disaggregated prefill DOES NOT improve throughput&quot;</em></strong>{' '}
                <Cite tier={1} href={vllmUrl(DISAGG_DOC, 'L15-L16')}>
                  disagg_prefill.md L15-L16
                </Cite>
                . You still run the same prefill FLOPs and the same decode steps, plus a KV
                transfer a unified engine never pays.
              </Box>
              <Box variant="p">
                What it buys is <strong>latency isolation and independent SLO tuning</strong>.
                The same page gives two reasons to want it: you can{' '}
                <em>tune TTFT and ITL separately</em> with different parallel strategies for each
                phase, and you <em>control tail ITL</em> by keeping prefill jobs out of the decode
                stream, which the docs call{' '}
                <em>&quot;a much more reliable way to control tail ITL&quot;</em> than finding the
                right chunked-prefill size{' '}
                <Cite tier={1} href={vllmUrl(DISAGG_DOC, 'L12-L13')}>
                  disagg_prefill.md L12-L13
                </Cite>
                . If your goal is tokens/sec or cost-per-token, reach for batching, quantization,
                or prefix caching instead.
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick the connector name and the roles: who issues the RDMA in each NIXL mode, what the proxy forwards, and which layouts each mode accepts"
          >
            Moving KV with NIXL: pull or push
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The cache hand-off rides the same pluggable <strong>KV connector framework</strong>{' '}
            as <strong>section 7 (KV-Cache Offloading &amp; Tiers)</strong>. There, the framework
            moves KV <em>down a memory hierarchy</em> within one engine; here it moves KV{' '}
            <em>across engines</em>. Same surface (<code>--kv-transfer-config</code>), different
            intent{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/kv_transfer.py', 'L60-L127')}>
              config/kv_transfer.py L60-L127
            </Cite>
            . These are the main connectors for the cross-instance path at v0.31.0; the full list of
            registered names is in the <strong>Inside the Codebase &rarr; Distributed &amp; KV
            Transfer</strong> tab{' '}
            <Cite tier={1} href={vllmUrl(DISAGG_DOC, 'L20-L50')}>
              disagg_prefill.md L20-L50
            </Cite>{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/distributed/kv_transfer/kv_connector/factory.py', 'L153-L248')}
              kind="code"
            >
              kv_connector/factory.py L153-L248
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('docs/features/mooncake_connector_usage.md', 'L24-L49')}>
              mooncake_connector_usage.md L24-L49
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('docs/features/moriio_connector_usage.md', 'L3')}>
              moriio_connector_usage.md L3
            </Cite>
            .
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'name', header: 'kv_connector', cell: (r) => <code>{r.name}</code>, minWidth: 190 },
              { id: 'what', header: 'What it is', cell: (r) => r.what },
            ]}
            items={connectorRows}
          />
          <Box variant="p">
            The reference connector is <strong>NixlConnector</strong>, a{' '}
            <em>
              &quot;high-performance KV cache transfer connector for vLLM&apos;s disaggregated
              prefilling feature&quot;
            </em>{' '}
            built on NIXL{' '}
            <Cite tier={1} href={vllmUrl(USAGE_DOC, 'L3')}>
              nixl_connector_usage.md L3
            </Cite>
            . Both the prefiller (P) and the decoder (D) register their KV cache with NIXL at
            startup{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/base_worker.py`, 'L1812-L1824')} kind="code">
              nixl/base_worker.py L1812-L1824
            </Cite>
            , and the connector name decides which side issues the RDMA transfer{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/connector.py`, 'L339-L408')} kind="code">
              nixl/connector.py L339-L408
            </Cite>
            :
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Pull: NixlConnector</Box>
              <Box variant="p">
                <code>NixlConnector</code> is an alias of <code>NixlPullConnector</code>. The proxy
                runs the prefill leg first, P returns its block ids in{' '}
                <code>kv_transfer_params</code>, and the proxy passes them to D with the decode
                leg{' '}
                <Cite
                  tier={1}
                  href={vllmUrl('tests/v1/kv_connector/nixl_integration/toy_proxy_server.py', 'L157-L231')}
                >
                  toy_proxy_server.py L157-L231
                </Cite>
                . D handshakes with P to import P&apos;s memory descriptors and posts a NIXL{' '}
                <code>READ</code> of P&apos;s blocks{' '}
                <Cite tier={1} href={vllmUrl(`${NIXL}/base_worker.py`, 'L1141-L1149')} kind="code">
                  base_worker.py L1141-L1149
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl(`${NIXL}/pull_worker.py`, 'L552-L562')} kind="code">
                  pull_worker.py L552-L562
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">Push: NixlPushConnector</Box>
              <Box variant="p">
                Available from v0.24.0. The proxy sends both legs at once and gives D only
                P&apos;s address and the shared request id. D allocates its blocks up front and
                registers them with P in a NIXL notification; D&apos;s own handshake to P is
                notification-only. P handshakes back to import D&apos;s memory descriptors and
                posts a NIXL <code>WRITE</code> into D&apos;s memory{' '}
                <Cite tier={1} href={vllmDocsUrl('design/nixl_kv_push_connector/')}>
                  vLLM docs: NIXL push-mode KV transfer
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl(`${PROXY_DIR}/disagg_proxy_pushconnector_demo.py`, 'L3-L14')}>
                  disagg_proxy_pushconnector_demo.py L3-L14
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl(`${NIXL}/push_worker.py`, 'L320-L338')} kind="code">
                  push_worker.py L320-L338
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl(`${NIXL}/push_worker.py`, 'L714-L722')} kind="code">
                  push_worker.py L714-L722
                </Cite>{' '}
                <Cite tier={1} href={`${RELEASE_NOTES}v0.24.0`}>
                  vLLM v0.24.0 release notes
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>
          <NixlPullPushDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic, illustrative, not measured. Purple: requests the proxy sends. Blue: control
            messages between the engines. Green: KV bytes over RDMA. In both modes each side
            registered its KV cache with NIXL at startup; the mode decides whose descriptors the
            other side imports and who posts the transfer.
          </Box>
          <Box variant="p">
            <strong>What the mode decides.</strong> Pull is the default, and it is the mode for{' '}
            <strong>bidirectional KV transfer</strong> (below) and for{' '}
            <strong>decode context parallel (DCP) &gt; 1</strong>: the push connector rejects
            both at startup{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/push_scheduler.py`, 'L72-L75')} kind="code">
              push_scheduler.py L72-L75
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/connector.py`, 'L377-L380')} kind="code">
              connector.py L377-L380
            </Cite>
            . Push is the documented route for a pipeline-parallel (PP) prefiller with a hybrid KV
            cache, which pull rejects at startup{' '}
            <Cite tier={1} href={vllmUrl(COMPAT_DOC, 'L107-L116')}>
              nixl_connector_compatibility.md L107-L116
            </Cite>
            . The handshake hashes the transfer mode, so a push prefiller and a pull decoder
            refuse to pair: set the same <code>kv_connector</code> on every P and D instance{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/metadata.py`, 'L142-L199')} kind="code">
              nixl/metadata.py L142-L199
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Roles.</strong> Set <code>kv_role</code> to <code>kv_producer</code> on
            prefillers and <code>kv_consumer</code> on decoders; vLLM requires a role once{' '}
            <code>kv_connector</code> is set{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/kv_transfer.py', 'L135-L139')} kind="code">
              config/kv_transfer.py L135-L139
            </Cite>
            . <code>kv_both</code> is deprecated for NIXL in both modes: the connector logs a
            warning that it <em>&quot;will be removed in a future release&quot;</em>{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/connector.py`, 'L94-L100')} kind="code">
              nixl/connector.py L94-L100
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(USAGE_DOC, 'L380-L388')}>
              nixl_connector_usage.md L380-L388
            </Cite>
            . Other connectors accept it{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/kv_transfer.py', 'L11-L13')} kind="code">
              config/kv_transfer.py L11-L13
            </Cite>
            . The NixlConnector example on the disaggregated
            prefilling page sets <code>kv_both</code>; use producer and consumer when you
            copy it{' '}
            <Cite tier={1} href={vllmUrl(DISAGG_DOC, 'L27')} kind="doc-code-conflict">
              disagg_prefill.md L27
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Transport.</strong> NIXL moves the bytes through a transport backend. The
            default is <code>[&quot;UCX&quot;]</code>, and another
            backend such as <code>LIBFABRIC</code> is selected in{' '}
            <code>kv_connector_extra_config.backends</code>{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/base_worker.py`, 'L560-L562')} kind="code">
              base_worker.py L560-L562
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(USAGE_DOC, 'L37-L52')}>
              nixl_connector_usage.md L37-L52
            </Cite>
            . This applies to the NIXL connectors; Mooncake and MoRIIO bring their own transfer
            libraries{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/distributed/kv_transfer/kv_connector/v1/mooncake/mooncake_connector.py', 'L76')}
              kind="code"
            >
              mooncake_connector.py L76
            </Cite>{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/distributed/kv_transfer/kv_connector/v1/moriio/moriio_engine.py', 'L21')}
              kind="code"
            >
              moriio_engine.py L21
            </Cite>
            . The handshake, block leases and the pull and push worker files are walked
            through in <strong>Inside the Codebase &rarr; Distributed &amp; KV Transfer</strong>.
          </Box>
          <Alert type="info" header="On AWS">
            The EFA data path (GPUs, EFA and the NIXL <code>LIBFABRIC</code> plugin) is{' '}
            <strong>section 22 (vLLM on AWS GPUs, EFA &amp; NIXL)</strong>, and the placement that
            keeps prefiller and decoder pools close enough for the transfer to be cheap is{' '}
            <strong>section 23 (EC2 Topology, Placement Groups &amp; KV Locality)</strong>. The
            fabric itself is the subject of the{' '}
            <Link external href="../efa/">
              EFA deep dive
            </Link>
            .
          </Alert>
          <ExpandableSection headerText="Multi-turn chat: bidirectional KV transfer (pull mode)">
            <SpaceBetween size="s">
              <Box variant="p">
                In a chat, D already holds the KV for the previous turn&apos;s generated tokens.
                With <code>bidirectional_kv_xfer</code> set on both P and D, P pulls those blocks
                back from D over RDMA and computes only the new tokens. A stateful proxy (the
                in-tree <code>disagg_proxy_multiturn.py</code>) caches D&apos;s{' '}
                <code>kv_transfer_params</code> per <code>conversation_id</code> and hands them to
                P on the next turn. Below <code>kv_recompute_threshold</code> (64 remote tokens) P
                recomputes locally instead, and D holds the blocks for{' '}
                <code>decoder_kv_blocks_ttl</code> (480 s, not renewed). It runs on CUDA with a
                device-buffer KV cache{' '}
                <Cite tier={1} href={vllmUrl(USAGE_DOC, 'L135-L311')}>
                  nixl_connector_usage.md L135-L311
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>Watch for reasoning models whose thinking traces get stripped.</strong>{' '}
                D&apos;s blocks cover the full sequence, thinking tokens included. If the client
                drops the <code>&lt;think&gt;</code> trace from the history before the next turn,
                P&apos;s prompt stops being a prefix of D&apos;s sequence, the pulled blocks map to
                the wrong token positions, and the output is incorrect. The docs leave detecting
                that mismatch to the router{' '}
                <Cite tier={1} href={vllmUrl(USAGE_DOC, 'L313-L323')}>
                  nixl_connector_usage.md L313-L323
                </Cite>
                . Either keep the traces in the history, or send those conversations without a{' '}
                <code>conversation_id</code>, which makes the proxy fall back to full recomputation{' '}
                <Cite tier={1} href={vllmUrl(USAGE_DOC, 'L260-L262')}>
                  nixl_connector_usage.md L260-L262
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
            description="Which settings may differ between prefill and decode instances, and which ones the handshake or startup checks reject"
          >
            What prefill and decode may run differently
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            &quot;Each pool tunes independently&quot; holds within a published set. For the NIXL
            connectors, vLLM keeps a compatibility matrix, checks a compatibility hash at
            handshake, and raises at startup for layouts a mode cannot route{' '}
            <Cite tier={1} href={vllmDocsUrl('features/nixl_connector_compatibility/')}>
              vLLM docs: NixlConnector compatibility matrix
            </Cite>
            . The terms: TP (tensor parallel), MoE (mixture of experts), MLA (multi-head latent
            attention), SSM (state space model), and HMA (hybrid memory allocator), which hybrid
            models require.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'setting', header: 'Setting', cell: (r) => <strong>{r.setting}</strong>, minWidth: 150 },
              { id: 'rule', header: 'Between P and D', cell: (r) => r.rule, minWidth: 320 },
              { id: 'src', header: 'Source', cell: (r) => r.src, minWidth: 200 },
            ]}
            items={compatRows}
          />
          <Box variant="p">
            <strong>Hybrid models and block size.</strong> The v0.31.0 matrix says HMA does not
            support different remote block sizes{' '}
            <Cite tier={1} href={vllmUrl(COMPAT_DOC, 'L72')} kind="doc-code-conflict">
              compatibility matrix L72
            </Cite>
            , while the v0.27.0 release notes list{' '}
            <em>&quot;heterogeneous P/D block sizes for hybrid models (#49612)&quot;</em>{' '}
            <Cite tier={1} href={`${RELEASE_NOTES}v0.27.0`}>
              vLLM v0.27.0 release notes
            </Cite>
            . The pull code sides with the release notes: D splits each attention block into
            sub-blocks that pair with P&apos;s smaller blocks and moves Mamba state blocks 1:1{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/pull_worker.py`, 'L424-L436')} kind="code">
              pull_worker.py L424-L436
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/base_worker.py`, 'L3266-L3303')} kind="code">
              base_worker.py L3266-L3303
            </Cite>
            , with the remaining limits checked at handshake{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/base_worker.py`, 'L2527-L2548')} kind="code">
              base_worker.py L2527-L2548
            </Cite>
            . Push raises on a mismatch for hybrid attention models{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/base_worker.py`, 'L2264-L2268')} kind="code">
              base_worker.py L2264-L2268
            </Cite>
            . For a hybrid model, keep P and D block sizes equal on push; on pull, a P block that
            divides D&apos;s is accepted.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The default fails the request, so a bad transfer shows up as an error rate; recompute keeps the request alive at the decoder's expense"
          >
            Failure policy: fail vs recompute
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A cross-instance transfer is a new failure surface a unified engine never has: the
            KV may not arrive. <code>kv_load_failure_policy</code> decides what happens when a
            load fails on the decode side, and the two options encode a real tradeoff{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/kv_transfer.py', 'L103-L106')} kind="code">
              config/kv_transfer.py L103-L106
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(USAGE_DOC, 'L389-L398')}>
              nixl_connector_usage.md L389-L398
            </Cite>
            .
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3"><code>&quot;fail&quot;</code> (default)</Box>
              <Box variant="p">
                Per the docs,{' '}
                <em>
                  &quot;immediately fail the request with an error when KV load fails.&quot;
                </em>{' '}
                Clean and predictable: the failure is visible, the request errors, and you can
                retry it through the router. The cost shows up as an error rate you can alarm
                on, rather than as an unexplained ITL spike.
              </Box>
            </div>
            <div>
              <Box variant="h3"><code>&quot;recompute&quot;</code></Box>
              <Box variant="p">
                The docs describe it as{' '}
                <em>&quot;recompute failed blocks locally on the decode instance.&quot;</em>{' '}
                The request survives, but the decoder, a memory-bandwidth-bound machine sized
                for the token loop, now has to do prefill-shaped compute it was never tuned for.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="warning" header="Treat recompute as a survivability fallback">
            Recompute keeps the request alive at the cost of the very isolation disaggregation
            was built to provide. The decoder pool is provisioned for ITL, not for prompt
            FLOPs; making it recompute KV blocks injects exactly the kind of compute spike that
            splitting the phases was meant to keep off the decode path. The vLLM docs warn
            directly that using{' '}
            <code>kv_load_failure_policy=&quot;recompute&quot;</code>{' '}
            <em>&quot;can lead to performance degradation in production deployments&quot;</em>{' '}
            <Cite tier={1} href={vllmUrl(USAGE_DOC, 'L396-L397')}>
              nixl_connector_usage.md L396-L397
            </Cite>
            . Keep <code>&quot;fail&quot;</code> as the steady-state policy. If your transfers
            fail often enough that recompute matters, fix the fabric rather than the policy.
          </Alert>
        </SpaceBetween>
      </Container>

      <ExpandableSection headerText="Operational notes (deep dive)">
        <SpaceBetween size="s">
          <Box variant="p">
            <strong>The transfer tax is real and fabric-dependent.</strong> Every disaggregated
            request pays a KV hand-off that a unified engine never does. On a fast RDMA fabric
            (section 22 covers EFA on AWS) the tax can stay small next to the prefill it
            isolates; on a slow link it can
            exceed the prefill stall you were trying to avoid, which is why &quot;no fast
            fabric&quot; is a do-not-use signal below. The KV cache moved per request scales
            with prompt length, layer count, and head dimension, so long-context workloads move
            the most bytes and are the most fabric-sensitive.
          </Box>
          <Box variant="p">
            <strong>Size the pool ratio to the traffic.</strong> Because the pools are
            independent, the prefiller:decoder ratio is something you size to your actual
            prompt:response shape and re-tune as traffic shifts. A long-prompt / short-answer
            workload wants more prefillers; a chatty long-generation workload wants more
            decoders. Getting this ratio wrong leaves one pool idle while the other is the
            bottleneck, the imbalance disaggregation was supposed to fix, reintroduced at the
            fleet level.
          </Box>
          <Box variant="p">
            <strong>Routing has to be disaggregation-aware.</strong> A request visits two pools,
            so the router must place prefill, carry the KV handle, and place decode, and ideally
            keep the pair on instances close enough that the transfer is cheap (the EC2 topology
            and placement concern in section 23). The in-tree references show what a router has
            to forward: <code>toy_proxy_server.py</code> for pull, which the NIXL usage guide
            runs{' '}
            <Cite tier={1} href={vllmUrl(USAGE_DOC, 'L98-L109')}>
              nixl_connector_usage.md L98-L109
            </Cite>
            , and <code>disagg_proxy_pushconnector_demo.py</code> for push, which sends both legs
            concurrently and passes D only P&apos;s coordinates (<code>remote_engine_id</code>,
            host, port, <code>tp_size</code>, <code>pp_size</code>) and the shared request id{' '}
            <Cite tier={1} href={vllmUrl(`${PROXY_DIR}/disagg_proxy_pushconnector_demo.py`, 'L3-L14')}>
              disagg_proxy_pushconnector_demo.py L3-L14
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(`${PROXY_DIR}/disagg_proxy_pushconnector_demo.py`, 'L227-L235')}>
              L227-L235
            </Cite>
            . This is the cache-aware-routing problem section 7 raised for cross-replica reuse,
            one step harder: here the route is part of the request&apos;s critical path.
          </Box>
        </SpaceBetween>
      </ExpandableSection>

      <Container
        header={
          <Header
            variant="h2"
            description="Disaggregation is an SLO tool: use it for isolation and imbalance, and keep a unified engine for throughput"
          >
            When to disaggregate, and when not to
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The decision reduces to one question: <strong>do you have separate, strict TTFT and
            ITL SLOs, or a large prefill:decode imbalance?</strong> If yes, the physical split
            buys isolation that no amount of in-engine scheduling can guarantee. If your goal is
            throughput or cost-per-token, or a single unified engine already meets a single SLO,
            disaggregation adds a transfer tax and operational surface for no win.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'signal', header: 'Signal in your workload', cell: (r) => <strong>{r.signal}</strong>, minWidth: 260 },
              {
                id: 'verdict',
                header: 'Verdict',
                cell: (r) => (
                  <Box
                    variant="span"
                    color={r.verdict === 'Use it' ? 'text-status-success' : 'text-status-error'}
                    fontWeight="bold"
                  >
                    {r.verdict}
                  </Box>
                ),
                minWidth: 110,
              },
              { id: 'why', header: 'Why', cell: (r) => r.why, minWidth: 280 },
            ]}
            items={decisionRows}
          />
          <Alert type="info" header="Where to start">
            If you cannot name a latency SLO that a unified engine is violating, you do not yet
            have a reason to disaggregate. Chunked prefill inside one engine is the simpler first
            move. When chunking cannot hold the tail ITL line, start with{' '}
            <code>NixlConnector</code> (pull), <code>kv_producer</code> on prefillers and{' '}
            <code>kv_consumer</code> on decoders, and the in-tree proxy; reach for{' '}
            <code>NixlPushConnector</code> when the compatibility table sends you there.
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
