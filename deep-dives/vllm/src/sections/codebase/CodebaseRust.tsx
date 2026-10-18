import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import Badge from '@cloudscape-design/components/badge';
import { Cite, vllmUrl } from '../../components/Cite';

const RUST_TREE = 'https://github.com/vllm-project/vllm/tree/v0.31.0/rust';
const UNSUPPORTED = 'rust/src/cmd/src/cli/unsupported.rs';

// ---------------------------------------------------------------------------
// Diagram 1, the request path: the Python API server and vllm-rs both reach
// the same unchanged Python EngineCore over the same ZMQ + MessagePack wire.
// ---------------------------------------------------------------------------

function RequestPathDiagram() {
  const W = 900;
  const H = 470;
  const colW = 410;
  const leftX = 24;
  const rightX = W - 24 - colW;
  const innerX = (x: number) => x + 16;
  const innerW = colW - 32;
  const rows = [140, 192, 244];

  const blue = '#0972d3';
  const green = '#037f0c';
  const amber = '#8b6c00';
  const ink = '#16191f';
  const grey = '#5f6b7a';
  const font = 'sans-serif';

  const left = [
    ['FastAPI / uvicorn (asyncio)', 'the reference surface for every serve flag'],
    ['Python renderer + tokenizer', 'chat template, tool and reasoning parsers'],
    ['AsyncLLM + EngineCoreClient', '1 to N processes (--api-server-count)'],
  ];
  const right = [
    ['axum HTTP + optional gRPC', 'TLS and mTLS, API key, CORS'],
    ['vllm-chat + vllm-text', 'minijinja render, Rust tokenizer, winnow parse'],
    ['vllm-engine-core-client', 'one process, Tokio pool capped at 32'],
  ];

  const column = (x: number, stroke: string, fill: string, heading: string, items: string[][]) => (
    <g>
      <rect x={x} y={104} width={colW} height={200} rx={6} fill={fill} stroke={stroke} strokeWidth={1.5} />
      <text x={x + 16} y={127} fontSize={12} fontWeight={700} fill={stroke} fontFamily={font}>
        {heading}
      </text>
      {items.map(([title, sub], i) => (
        <g key={title}>
          <rect x={innerX(x)} y={rows[i]} width={innerW} height={44} rx={5} fill="#ffffff" stroke={stroke} strokeWidth={1.2} />
          <text x={x + colW / 2} y={rows[i] + 18} fontSize={12} fontWeight={700} fill={ink} textAnchor="middle" fontFamily={font}>
            {title}
          </text>
          <text x={x + colW / 2} y={rows[i] + 35} fontSize={11} fill={grey} textAnchor="middle" fontFamily={font}>
            {sub}
          </text>
        </g>
      ))}
    </g>
  );

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="rust-reqpath-title"
        style={{ width: '100%', minWidth: 720, height: 'auto' }}
      >
        <title id="rust-reqpath-title">
          The Python API server and the opt-in vllm-rs process are interchangeable front doors: each terminates
          HTTP, renders and tokenizes the prompt and parses the output, and both send token IDs over the same ZMQ
          plus MessagePack wire to the same unchanged Python EngineCore, which holds the scheduler, the KV-cache
          manager, the model executor and the GPU kernels.
        </title>
        <defs>
          <marker id="rust-reqpath-ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 z" fill={grey} />
          </marker>
          <marker id="rust-reqpath-ah-wire" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 z" fill={amber} />
          </marker>
        </defs>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" stroke="#e9ebed" />

        <text x={20} y={26} fontSize={13} fontWeight={700} fill={ink} fontFamily={font}>
          One engine, two interchangeable API-server processes
        </text>

        <rect x={W / 2 - 110} y={44} width={220} height={34} rx={6} fill="#f4f4f4" stroke={grey} strokeWidth={1.5} />
        <text x={W / 2} y={66} fontSize={12} fontWeight={700} fill={ink} textAnchor="middle" fontFamily={font}>
          HTTP / gRPC client
        </text>
        <line x1={W / 2 - 50} y1={78} x2={leftX + colW / 2} y2={102} stroke={grey} strokeWidth={1.5} markerEnd="url(#rust-reqpath-ah)" />
        <line x1={W / 2 + 50} y1={78} x2={rightX + colW / 2} y2={102} stroke={grey} strokeWidth={1.5} markerEnd="url(#rust-reqpath-ah)" />

        {column(leftX, blue, '#f2f8fd', 'Default: Python API server', left)}
        {column(rightX, green, '#ecf7ec', 'Opt-in: vllm-rs (VLLM_USE_RUST_FRONTEND=1)', right)}

        <line x1={leftX + colW / 2} y1={304} x2={leftX + colW / 2} y2={354} stroke={amber} strokeWidth={2} markerEnd="url(#rust-reqpath-ah-wire)" />
        <line x1={rightX + colW / 2} y1={304} x2={rightX + colW / 2} y2={354} stroke={amber} strokeWidth={2} markerEnd="url(#rust-reqpath-ah-wire)" />
        <text x={W / 2} y={326} fontSize={11} fontWeight={700} fill={amber} textAnchor="middle" fontFamily={font}>
          same wire: ZMQ ROUTER/PULL + MessagePack
        </text>
        <text x={W / 2} y={342} fontSize={11} fill={grey} textAnchor="middle" fontFamily={font}>
          frontend and engine are separate processes
        </text>

        <rect x={140} y={358} width={W - 280} height={92} rx={6} fill="#fbf3d5" stroke={amber} strokeWidth={1.5} />
        <text x={W / 2} y={382} fontSize={13} fontWeight={700} fill={ink} textAnchor="middle" fontFamily={font}>
          Unchanged Python EngineCore (one per engine)
        </text>
        <text x={W / 2} y={404} fontSize={11} fill={ink} textAnchor="middle" fontFamily={font}>
          scheduler, KV-cache manager, model executor, GPU kernels
        </text>
        <text x={W / 2} y={426} fontSize={11} fill={grey} textAnchor="middle" fontFamily={font}>
          same engine code either way; the prompt token IDs come from the frontend
        </text>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Diagram 2: the Cargo workspace as a layered dependency DAG. Every arrow is a
// [dependencies] entry in the source crate's Cargo.toml at v0.31.0; edges
// implied by a longer path (the transitive shortcuts) are left out.
// ---------------------------------------------------------------------------

type CrateRole = 'serve' | 'text' | 'wire' | 'leaf' | 'pyo3';

interface CrateNode {
  id: string;
  name: string;
  sub: string;
  x: number;
  y: number;
  w: number;
  role: CrateRole;
}

const CRATE_H = 46;
const crateRows = [40, 112, 184, 256, 328, 400];

const crateNodes: CrateNode[] = [
  { id: 'cmd', name: 'vllm-rs (vllm-cmd)', sub: 'binary: frontend, serve, bench serve, render', x: 250, y: crateRows[0], w: 320, role: 'serve' },
  { id: 'server', name: 'vllm-server', sub: 'axum HTTP + tonic gRPC', x: 130, y: crateRows[1], w: 200, role: 'serve' },
  { id: 'bench', name: 'vllm-bench', sub: 'bench serve load generator', x: 500, y: crateRows[1], w: 200, role: 'serve' },
  { id: 'proto', name: 'vllm-proto', sub: 'gRPC schemas', x: 20, y: crateRows[2], w: 170, role: 'leaf' },
  { id: 'chat', name: 'vllm-chat', sub: 'render, multimodal, parse', x: 270, y: crateRows[2], w: 200, role: 'text' },
  { id: 'managed', name: 'vllm-managed-engine', sub: 'spawns headless Python engine', x: 595, y: crateRows[2], w: 210, role: 'leaf' },
  { id: 'text', name: 'vllm-text', sub: 'tokenize, detokenize', x: 190, y: crateRows[3], w: 200, role: 'text' },
  { id: 'parser', name: 'vllm-parser', sub: 'tool, reasoning, unified', x: 460, y: crateRows[3], w: 200, role: 'text' },
  { id: 'py', name: 'vllm-tool-parser-py', sub: 'PyO3: vllm._rust_tool_parser', x: 695, y: crateRows[3], w: 195, role: 'pyo3' },
  { id: 'mock', name: 'vllm-mock-engine', sub: 'test engine, same wire', x: 20, y: crateRows[4], w: 150, role: 'wire' },
  { id: 'llm', name: 'vllm-llm', sub: 'token-in, token-out facade', x: 200, y: crateRows[4], w: 180, role: 'text' },
  { id: 'tokenizer', name: 'vllm-tokenizer', sub: 'HF, tiktoken, tekken', x: 460, y: crateRows[4], w: 200, role: 'leaf' },
  { id: 'ecc', name: 'vllm-engine-core-client', sub: 'ZMQ + MessagePack wire', x: 175, y: crateRows[5], w: 230, role: 'wire' },
  { id: 'metrics', name: 'vllm-metrics', sub: 'Prometheus metrics', x: 510, y: crateRows[5], w: 180, role: 'leaf' },
];

// [from, to]: "from" depends on "to". Transitive reduction of the manifests.
const crateEdges: [string, string][] = [
  ['cmd', 'server'],
  ['cmd', 'bench'],
  ['server', 'proto'],
  ['server', 'chat'],
  ['bench', 'chat'],
  ['bench', 'managed'],
  ['chat', 'text'],
  ['chat', 'parser'],
  ['py', 'parser'],
  ['text', 'llm'],
  ['text', 'tokenizer'],
  ['parser', 'tokenizer'],
  ['mock', 'ecc'],
  ['llm', 'ecc'],
  ['ecc', 'metrics'],
];

const roleStyle: Record<CrateRole, { fill: string; stroke: string }> = {
  serve: { fill: '#f2f8fd', stroke: '#0972d3' },
  text: { fill: '#ecf7ec', stroke: '#037f0c' },
  wire: { fill: '#fbf3d5', stroke: '#8b6c00' },
  leaf: { fill: '#f4f4f4', stroke: '#879596' },
  pyo3: { fill: '#efe7fb', stroke: '#6f4cc4' },
};

function crateEdgePath(from: CrateNode, to: CrateNode): [number, number, number, number] {
  if (from.y === to.y) {
    // Same row: horizontal arrow between facing sides.
    const fromRight = from.x < to.x;
    const y = from.y + CRATE_H / 2;
    return fromRight ? [from.x + from.w, y, to.x - 2, y] : [from.x, y, to.x + to.w + 2, y];
  }
  const fx = Math.min(Math.max(to.x + to.w / 2, from.x + 24), from.x + from.w - 24);
  const tx = Math.min(Math.max(from.x + from.w / 2, to.x + 24), to.x + to.w - 24);
  return [fx, from.y + CRATE_H, tx, to.y - 2];
}

function CrateStackDiagram() {
  const W = 900;
  const H = 466;
  const font = 'sans-serif';
  const byId = new Map(crateNodes.map((n) => [n.id, n]));
  const legend: [CrateRole, string, number, number][] = [
    ['serve', 'binaries and serving', 20, 52],
    ['text', 'text and parsing', 20, 74],
    ['leaf', 'shared leaf crates', 20, 96],
    ['wire', 'engine wire', 600, 52],
    ['pyo3', 'PyO3 module, in-process', 600, 74],
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="rust-crates-title"
        style={{ width: '100%', minWidth: 720, height: 'auto' }}
      >
        <title id="rust-crates-title">
          The rust/ Cargo workspace as a dependency graph. The vllm-rs binary sits on vllm-server and vllm-bench;
          both use vllm-chat, which builds on vllm-text and vllm-parser; vllm-text sits on vllm-llm and
          vllm-tokenizer; vllm-llm sits on vllm-engine-core-client, which depends only on vllm-metrics. The
          tokenizer is a leaf shared by text and parsing, and a PyO3 module reuses vllm-parser inside the Python
          server.
        </title>
        <defs>
          <marker id="rust-crates-ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
          </marker>
        </defs>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" stroke="#e9ebed" />
        <text x={20} y={24} fontSize={12} fontWeight={700} fill="#16191f" fontFamily={font}>
          Arrow = &quot;depends on&quot; (direct edges only; shortcuts implied by a longer path are not drawn)
        </text>

        {legend.map(([role, label, x, y]) => (
          <g key={role}>
            <rect x={x} y={y - 10} width={12} height={12} rx={2} fill={roleStyle[role].fill} stroke={roleStyle[role].stroke} />
            <text x={x + 18} y={y} fontSize={11} fill="#16191f" fontFamily={font}>
              {label}
            </text>
          </g>
        ))}

        {crateEdges.map(([a, b]) => {
          const from = byId.get(a);
          const to = byId.get(b);
          if (!from || !to) return null;
          const [x1, y1, x2, y2] = crateEdgePath(from, to);
          return (
            <line
              key={`${a}-${b}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#5f6b7a"
              strokeWidth={1.4}
              markerEnd="url(#rust-crates-ah)"
            />
          );
        })}

        {crateNodes.map((n) => (
          <g key={n.id}>
            <rect x={n.x} y={n.y} width={n.w} height={CRATE_H} rx={6} fill={roleStyle[n.role].fill} stroke={roleStyle[n.role].stroke} strokeWidth={1.5} />
            <text x={n.x + n.w / 2} y={n.y + 19} fontSize={13} fontWeight={700} fill="#16191f" textAnchor="middle" fontFamily={font}>
              {n.name}
            </text>
            <text x={n.x + n.w / 2} y={n.y + 36} fontSize={11} fill="#5f6b7a" textAnchor="middle" fontFamily={font}>
              {n.sub}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// What runs on the Rust frontend at v0.31.0, and what refuses to start.
// ---------------------------------------------------------------------------

type CapabilityStatus = 'supported' | 'hard-error' | 'no-op' | 'no-route';

interface CapabilityRow {
  capability: string;
  status: CapabilityStatus;
  detail: ReactNode;
}

const capabilityRows: CapabilityRow[] = [
  {
    capability: 'OpenAI /v1/chat/completions, /v1/completions, /v1/models (with streaming), /tokenize, /detokenize, /health, /metrics',
    status: 'supported',
    detail: (
      <>
        Always-on axum routes.{' '}
        <Cite tier={1} href={vllmUrl('rust/src/server/src/routes.rs', 'L89-L102')}>routes.rs L89-L102</Cite>
      </>
    ),
  },
  {
    capability: 'TLS and mTLS (--ssl-keyfile, --ssl-certfile, --ssl-ca-certs, --ssl-cert-reqs, --ssl-ciphers)',
    status: 'supported',
    detail: (
      <>
        The gRPC port reuses the same TLS settings. Certificate hot reload (--enable-ssl-refresh) is a hard error.{' '}
        <Cite tier={1} href={vllmUrl('rust/src/cmd/src/cli/ssl.rs', 'L14-L41')}>ssl.rs L14-L41</Cite>{' '}
        <Cite tier={1} href={vllmUrl('rust/src/server/src/lib.rs', 'L238-L244')}>lib.rs L238-L244</Cite>{' '}
        <Cite tier={1} href={vllmUrl(UNSUPPORTED, 'L596-L602')}>unsupported.rs L596-L602</Cite>
      </>
    ),
  },
  {
    capability: 'API key (--api-key, or the VLLM_API_KEY env var)',
    status: 'supported',
    detail: (
      <>
        Guards HTTP paths under /v1, /v2 and /inference.{' '}
        <Cite tier={1} href={vllmUrl('rust/src/server/src/middleware/auth.rs', 'L16-L44')}>auth.rs L16-L44</Cite>{' '}
        The gRPC server adds no API-key layer.{' '}
        <Cite tier={1} href={vllmUrl('rust/src/server/src/lib.rs', 'L255-L261')}>lib.rs L255-L261</Cite>
      </>
    ),
  },
  {
    capability: 'CORS (--allowed-origins, --allowed-methods, --allowed-headers, --allow-credentials)',
    status: 'supported',
    detail: (
      <>
        Origins, methods and headers default to *.{' '}
        <Cite tier={1} href={vllmUrl('rust/src/cmd/src/cli.rs', 'L399-L421')}>cli.rs L399-L421</Cite>
      </>
    ),
  },
  {
    capability: 'LoRA adapters (--lora-modules, runtime load and unload)',
    status: 'supported',
    detail: (
      <>
        --lora-modules load at startup; the HTTP load and unload routes need VLLM_ALLOW_RUNTIME_LORA_UPDATING=1.
        --default-mm-loras is a hard error.{' '}
        <Cite tier={1} href={vllmUrl('rust/src/server/src/routes.rs', 'L44-L48')}>routes.rs L44-L48</Cite>{' '}
        <Cite tier={1} href={vllmUrl('rust/src/server/src/routes.rs', 'L110-L114')}>L110-L114</Cite>
      </>
    ),
  },
  {
    capability: 'Chat-template rendering',
    status: 'supported',
    detail: (
      <>
        Hugging Face minijinja renderer by default (Auto), plus native DeepSeek-V3.2, V4 and V4.1, Harmony (gpt-oss),
        Inkling and Kimi-K3 renderers.{' '}
        <Cite tier={1} href={vllmUrl('rust/src/chat/src/renderer/selection.rs', 'L14-L60')}>selection.rs L14-L60</Cite>
      </>
    ),
  },
  {
    capability: 'Tool-call and reasoning parsing (--tool-call-parser, --reasoning-parser)',
    status: 'supported',
    detail: (
      <>
        21 named tool parsers and 32 model-name patterns. Parser plugins (--tool-parser-plugin,
        --reasoning-parser-plugin) are hard errors.{' '}
        <Cite tier={1} href={vllmUrl('rust/src/chat/src/parser/tool/mod.rs', 'L67-L126')}>tool/mod.rs L67-L126</Cite>
      </>
    ),
  },
  {
    capability: 'gRPC on --grpc-port: Inference (Generate, GenerateStream), Control, health',
    status: 'supported',
    detail: (
      <>
        Control carries 20 RPCs (remote procedure calls): server and model info, abort, LoRA, KV event sources, pause and resume, sleep and
        wake, weight transfer. Off unless the port is set. Python&apos;s own --grpc server mode is a hard error.{' '}
        <Cite tier={1} href={vllmUrl('rust/proto/control.proto', 'L7-L36')}>control.proto L7-L36</Cite>
      </>
    ),
  },
  {
    capability: 'HTTP admin and RL (reinforcement learning) routes: pause, resume, sleep, wake, abort, weight transfer',
    status: 'supported',
    detail: (
      <>
        Registered only with VLLM_SERVER_DEV_MODE=1; the gRPC Control service offers the same operations.{' '}
        <Cite tier={1} href={vllmUrl('rust/src/server/src/routes.rs', 'L37-L42')}>routes.rs L37-L42</Cite>{' '}
        <Cite tier={1} href={vllmUrl('rust/src/server/src/routes.rs', 'L116-L158')}>L116-L158</Cite>
      </>
    ),
  },
  {
    capability: 'Multimodal input (image, audio, video)',
    status: 'supported',
    detail: (
      <>
        Media is fetched and preprocessed in Rust. The tuning knobs (--mm-processor-kwargs, --mm-processor-cache-gb,
        --media-io-kwargs, --allowed-local-media-path) are hard errors.{' '}
        <Cite tier={1} href={vllmUrl('rust/src/chat/src/multimodal.rs', 'L1-L12')}>multimodal.rs L1-L12</Cite>
      </>
    ),
  },
  {
    capability: 'Data parallel (DP): internal, external and hybrid load balancing, multi-port supervisor',
    status: 'supported',
    detail: (
      <>
        Under vllm serve, Python strips --data-parallel-rank, --data-parallel-external-lb and
        --data-parallel-hybrid-lb and passes the engine range itself. Standalone vllm-rs serve rejects those three.{' '}
        <Cite tier={1} href={vllmUrl('vllm/v1/utils.py', 'L384-L392')}>utils.py L384-L392</Cite>{' '}
        <Cite tier={1} href={vllmUrl(UNSUPPORTED, 'L261-L289')}>unsupported.rs L261-L289</Cite>
      </>
    ),
  },
  {
    capability: 'OpenTelemetry tracing (--otlp-traces-endpoint, --collect-detailed-traces)',
    status: 'hard-error',
    detail: (
      <>
        No OpenTelemetry dependency appears in any rust/ manifest, and the vllm-tracing crate is a log subscriber and formatter, so there is no OTLP export path.{' '}
        <Cite tier={1} href={vllmUrl(UNSUPPORTED, 'L354-L360')}>unsupported.rs L354-L360</Cite>{' '}
        <Cite tier={1} href={vllmUrl('rust/src/tracing/src/lib.rs', 'L4')}>tracing/src/lib.rs L4</Cite>
      </>
    ),
  },
  {
    capability: 'Admission control (--max-num-queued-reqs, --max-num-queued-tokens)',
    status: 'hard-error',
    detail: (
      <>
        The API-server back-pressure that returns HTTP 503 on the Python server.{' '}
        <Cite tier={1} href={vllmUrl(UNSUPPORTED, 'L366-L375')}>unsupported.rs L366-L375</Cite>
      </>
    ),
  },
  {
    capability: 'Custom tokenizer (--tokenizer, --tokenizer-revision, --skip-tokenizer-init, --hf-config-path)',
    status: 'hard-error',
    detail: (
      <>
        The tokenizer comes from the model path. --hf-overrides is supported.{' '}
        <Cite tier={1} href={vllmUrl(UNSUPPORTED, 'L181-L217')}>unsupported.rs L181-L217</Cite>
      </>
    ),
  },
  {
    capability: 'Per-request trust flags (--trust-request-mm-kwargs, --trust-request-chat-template)',
    status: 'hard-error',
    detail: (
      <Cite tier={1} href={vllmUrl(UNSUPPORTED, 'L406-L421')}>unsupported.rs L406-L421</Cite>
    ),
  },
  {
    capability: 'Server plumbing (--middleware, --root-path, --uvicorn-log-level, --log-config-file)',
    status: 'hard-error',
    detail: (
      <Cite tier={1} href={vllmUrl(UNSUPPORTED, 'L474-L614')}>unsupported.rs L474-L614</Cite>
    ),
  },
  {
    capability: 'Also blocked: --enable-fault-tolerance, --enable-prompt-embeds, --enable-log-outputs, --tokens-only, --hf-token',
    status: 'hard-error',
    detail: (
      <>
        58 hard-error arguments in total.{' '}
        <Cite tier={1} href={vllmUrl(UNSUPPORTED)}>unsupported.rs</Cite>
      </>
    ),
  },
  {
    capability: '/v1/embeddings, /v1/responses, Anthropic /v1/messages, audio endpoints',
    status: 'no-route',
    detail: (
      <>
        No route is registered for them in the Rust server.{' '}
        <Cite tier={1} href={vllmUrl('rust/src/server/src/routes.rs', 'L83-L158')}>routes.rs L83-L158</Cite>
      </>
    ),
  },
  {
    capability: '--api-server-count, --enable-auto-tool-choice, --structured-outputs-config, --renderer-num-workers, and 5 more',
    status: 'no-op',
    detail: (
      <>
        Accepted and logged as ignored. vllm serve forces one Rust process whatever --api-server-count says.{' '}
        <Cite tier={1} href={vllmUrl('vllm/entrypoints/cli/serve.py', 'L129-L134')}>serve.py L129-L134</Cite>
      </>
    ),
  },
];

function statusBadge(status: CapabilityStatus) {
  if (status === 'supported') return <Badge color="green">Supported</Badge>;
  if (status === 'no-op') return <Badge color="blue">No-op (ignored)</Badge>;
  if (status === 'no-route') return <Badge color="grey">No route</Badge>;
  return <Badge color="red">Hard error</Badge>;
}

export function CodebaseRust() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="What vllm-rs replaces, what it shares with the Python engine, and how to tell whether your serve flags can switch to it (rust/ at vLLM v0.31.0, commit db9527a4, accessed 2026-10-16)"
          >
            The Rust Frontend
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What it is.</strong> <code>vllm-rs</code> is a separate Rust binary, built from the{' '}
            <code>rust/</code> Cargo workspace, that takes the place of the Python API-server process when{' '}
            <code>vllm serve</code> runs with <code>VLLM_USE_RUST_FRONTEND=1</code>. The variable defaults to off{' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L1441-L1449')}>envs.py L1441-L1449</Cite>. The binary
            terminates HTTP (and optionally gRPC), renders the chat template, tokenizes, and parses tool calls and
            reasoning out of the token stream. The scheduler, the KV-cache (key-value cache) manager, the model
            executor and every GPU kernel stay in the Python <code>EngineCore</code>.
          </Box>
          <Box variant="p">
            <strong>The fact to anchor on.</strong> The frontend and the engine are separate OS processes that
            exchange the same ZMQ (ZeroMQ) and MessagePack messages the Python API server sends. Python hands{' '}
            <code>vllm-rs</code> the same engine input and output addresses it would give its own server{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/cli/serve.py', 'L344-L375')}>serve.py L344-L375</Cite>,
            so there is no FFI (foreign function interface) on the frontend-to-engine hop. The engine code is the
            same either way; the one engine-side switch is that <code>ModelConfig</code> forces{' '}
            <code>mm_device_do_normalize</code> off when the variable is set{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/model.py', 'L1037-L1063')}>model.py L1037-L1063</Cite>.
            The in-repo README describes the goal as rebuilding &quot;the northbound
            serving layer in Rust while still talking to the core Python vLLM engine process(es) via ZMQ over the
            existing engine boundary&quot;, and calls it experimental and not feature-complete{' '}
            <Cite tier={1} href={vllmUrl('rust/README.md', 'L3-L5')}>rust/README.md L3-L5</Cite>.
          </Box>
          <Box variant="p">
            <strong>Rust is reached a second way, in process.</strong> One Rust crate is also compiled as a PyO3
            (Rust bindings for Python) extension, <code>vllm._rust_tool_parser</code>{' '}
            <Cite tier={1} href={vllmUrl('tools/build_rust.py', 'L48-L66')}>build_rust.py L48-L66</Cite>, which
            the Python API server loads for the MiniMax M3 tool parser{' '}
            <Cite tier={1} href={vllmUrl('vllm/tool_parsers/rust_tool_parser.py', 'L31-L38')}>
              rust_tool_parser.py L31-L38
            </Cite>
            . Both Rust artifacts are optional builds unless <code>VLLM_REQUIRE_RUST_FRONTEND</code> is set{' '}
            <Cite tier={1} href={vllmUrl('setup.py', 'L1518-L1521')}>setup.py L1518-L1521</Cite>, so an install can
            lack them.
          </Box>
          <Box variant="small" color="text-body-secondary">
            Verified against{' '}
            <Cite tier={1} href={RUST_TREE}>
              vllm-project/vllm rust/ @ v0.31.0 (commit db9527a4)
            </Cite>
            : 16 workspace crates, 340 <code>.rs</code> files, 126,169 lines (our count over the tree). The pre-merge
            history lives in{' '}
            <Link external href="https://github.com/Inferact/vllm-frontend-rs/tree/1177cc7f593e991f1dedce940969feef618b3361">
              Inferact/vllm-frontend-rs
            </Link>{' '}
            (archived).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What moves into Rust when you flip the switch, and the one place output can differ"
          >
            The request path: one engine, two frontends
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Both frontends terminate the client API, turn a request into prompt token IDs, and forward them to the
            engine. They meet at the same lower boundary: the Rust client opens a ZMQ ROUTER socket for requests and
            a PULL socket for outputs, encodes MessagePack, and uses the two-byte little-endian engine index as the
            routing identity, as Python does{' '}
            <Cite tier={1} href={vllmUrl('rust/src/engine-core-client/src/transport.rs', 'L15-L29')}>
              transport.rs L15-L29
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('rust/src/engine-core-client/src/transport.rs', 'L54-L72')}>L54-L72</Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/engine/utils.py', 'L78-L80')}>utils.py L78-L80</Cite>.
          </Box>
          <RequestPathDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic. Labels come from the sources cited on this page. Illustrative, not measured.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">What moves to Rust</Box>
              <Box variant="p">
                The HTTP server (FastAPI and uvicorn become axum), chat-template rendering (minijinja), tokenization
                (the Rust <code>tokenizers</code>, tiktoken and tekken backends), output parsing (built on{' '}
                <code>winnow</code>) and the engine client. It runs as one process on a Tokio worker pool capped at
                32 threads by default, overridable with <code>TOKIO_WORKER_THREADS</code>, with the{' '}
                <code>mimalloc</code> allocator{' '}
                <Cite tier={1} href={vllmUrl('rust/src/cmd/src/main.rs', 'L17-L44')}>main.rs L17-L44</Cite>.
              </Box>
            </div>
            <div>
              <Box variant="h3">What stays, and what that implies</Box>
              <Box variant="p">
                The engine process, scheduler, KV-cache manager, model executor and GPU path are the same code
                either way. The engine generates from whatever token IDs it receives, and the Rust frontend produces
                those IDs with its own renderers and tokenizer{' '}
                <Cite tier={1} href={vllmUrl('rust/src/chat/src/renderer/selection.rs', 'L14-L33')}>
                  selection.rs L14-L33
                </Cite>
                . Output parity with the Python server therefore depends on the Rust renderer and tokenizer
                matching Python&apos;s for your model; no parity test was run for this page.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which crate owns which job, so a Rust log line or a bug report points at the right code"
          >
            The crate graph
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <code>rust/</code> is one Cargo workspace of 16 crates on edition 2024{' '}
            <Cite tier={1} href={vllmUrl('rust/Cargo.toml', 'L1-L24')}>Cargo.toml L1-L24</Cite>, with the toolchain
            pinned to channel <code>1.95</code> by <code>rust-toolchain.toml</code> at the repository root. The work
            splits into three bands: serving at the top, text and parsing in the middle, and the engine wire client
            at the bottom, which depends on nothing but the metrics crate. The tokenizer is a leaf that the text and
            parser crates share.
          </Box>
          <CrateStackDiagram />
          <Box variant="small" color="text-body-secondary">
            Each arrow is a <code>[dependencies]</code> entry in the source crate&apos;s <code>Cargo.toml</code>{' '}
            <Cite tier={1} href={RUST_TREE}>rust/ @ v0.31.0</Cite>. Edges implied by a longer path are left out:{' '}
            <code>vllm-server</code>, for example, also depends directly on <code>vllm-llm</code>,{' '}
            <code>vllm-text</code>, <code>vllm-metrics</code> and <code>vllm-engine-core-client</code>. Not drawn:
            the leaf crates <code>vllm-build-info</code> (used by vllm-rs, vllm-server, vllm-bench) and{' '}
            <code>vllm-tracing</code> (used by vllm-rs, vllm-bench, vllm-chat).
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">vllm-chat: requests become token IDs</Box>
              <Box variant="p">
                It selects the renderer (Hugging Face minijinja by default, native renderers for DeepSeek-V3.2, V4
                and V4.1, Harmony, Inkling and Kimi-K3), prepares image, audio and video inputs, and holds the
                registries that map a model name to its tool and reasoning parsers.
              </Box>
            </div>
            <div>
              <Box variant="h3">vllm-parser: one crate, two callers</Box>
              <Box variant="p">
                Tool, reasoning and unified tool-plus-reasoning parsers live in one crate with <code>tool/</code>,{' '}
                <code>reasoning/</code> and <code>unified/</code> modules{' '}
                <Cite tier={1} href="https://github.com/vllm-project/vllm/tree/v0.31.0/rust/src/parser/src">
                  rust/src/parser/src
                </Cite>
                . The Rust frontend calls it through <code>vllm-chat</code>; the Python server calls it through the
                PyO3 wrapper.
              </Box>
            </div>
          </ColumnLayout>
          <ExpandableSection headerText="How the registries and the wire client resolve (from source)">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Tool parsers.</strong> The registry in <code>chat/src/parser/tool/mod.rs</code> registers 21
                parsers under canonical names, then 32 model-name patterns: <code>mistral-</code> and{' '}
                <code>mixtral-</code> route to Mistral, <code>deepseek-v3.2</code> to DeepSeek-V3.2,{' '}
                <code>qwen3-coder</code> to Qwen3 Coder{' '}
                <Cite tier={1} href={vllmUrl('rust/src/chat/src/parser/tool/mod.rs', 'L67-L126')}>
                  tool/mod.rs L67-L126
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>Reasoning parsers.</strong> Base implementations are CohereCmd, DeepSeekR1, DeepSeekV3,
                Glm45, Kimi, MiniMaxM3, Qwen3, SeedOss and Step3p5. Type aliases map most newer families
                (DeepSeek-V4 and V4.1, GLM-4.7, Kimi-K2, MiMo) onto the DeepSeek-V3 parser{' '}
                <Cite tier={1} href={vllmUrl('rust/src/parser/src/reasoning/mod.rs', 'L38-L70')}>
                  reasoning/mod.rs L38-L70
                </Cite>
                . Gemma 4 is handled by a unified tool-plus-reasoning parser.
              </Box>
              <Box variant="p">
                <strong>Renderer selection.</strong> <code>RendererSelection</code> has the variants{' '}
                <code>Auto</code> (default), <code>Hf</code>, <code>DeepSeekV32</code>, <code>DeepSeekV4</code>,{' '}
                <code>DeepSeekV41</code>, <code>Harmony</code>, <code>Inkling</code> and <code>KimiK3</code>;{' '}
                <code>Auto</code> resolves by model type{' '}
                <Cite tier={1} href={vllmUrl('rust/src/chat/src/renderer/selection.rs', 'L14-L60')}>
                  selection.rs L14-L60
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>The wire client.</strong> Beyond the socket types and identity encoding, it recognizes the
                literal <code>ENGINE_CORE_DEAD</code> frame the Python engine sends when it dies{' '}
                <Cite tier={1} href={vllmUrl('rust/src/engine-core-client/src/transport.rs', 'L27-L29')}>
                  transport.rs L27-L29
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/engine/core.py', 'L1088')}>core.py L1088</Cite>, and under
                data parallelism (DP) it subscribes to the DP coordinator&apos;s stats over an <code>XSUB</code> socket{' '}
                <Cite tier={1} href={vllmUrl('rust/src/engine-core-client/src/coordinator/handle.rs', 'L111')}>
                  handle.rs L111
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
            description="The switch, what Python hands the binary, and which deployment shapes it covers"
          >
            How vllm serve launches it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Python stays in charge of the process lifecycle. The environment variable is the only switch; there is
            no <code>vllm serve</code> flag for it. <code>VLLM_RUST_FRONTEND_PATH</code> (default <code>auto</code>)
            looks for <code>vllm-rs</code> inside the installed <code>vllm</code> package and raises{' '}
            <code>FileNotFoundError</code> when the binary is missing{' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L577-L609')}>envs.py L577-L609</Cite>.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Launch</Box>
              <Box variant="p">
                <code>RustFrontendProcessManager</code> runs <code>vllm-rs frontend</code> with the inherited
                listening socket, the ZMQ input and output addresses, the engine range, the DP size, the coordinator
                address when there is one, and the non-default serve args as JSON. API keys and Hugging Face tokens are
                redacted in the launch log line{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/utils.py', 'L338-L411')}>utils.py L338-L411</Cite>.
              </Box>
            </div>
            <div>
              <Box variant="h3">One process</Box>
              <Box variant="p">
                The Python server scales out with several API-server processes. The Rust frontend is one
                multi-threaded process: <code>vllm serve</code> ignores <code>--api-server-count</code> above 1 with
                a warning{' '}
                <Cite tier={1} href={vllmUrl('vllm/entrypoints/cli/serve.py', 'L129-L134')}>serve.py L129-L134</Cite>
                , and the manager slots in where <code>APIServerProcessManager</code> would, with the same monitoring
                interface.
              </Box>
            </div>
            <div>
              <Box variant="h3">Data parallel</Box>
              <Box variant="p">
                In multi-port external load balancing (<code>--data-parallel-multi-port-external-lb</code>), the DP
                supervisor starts one child per local DP rank on <code>--port</code> plus the rank, and each child
                runs the Rust frontend when the variable is set{' '}
                <Cite tier={1} href={vllmUrl('vllm/entrypoints/launchers/dp_supervisor.py', 'L246-L276')}>
                  dp_supervisor.py L246-L276
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>
          <ExpandableSection headerText="The other vllm-rs subcommands: serve, bench serve, render">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong><code>vllm-rs serve</code></strong> inverts the relationship: the Rust binary spawns{' '}
                <code>python -m vllm.entrypoints.cli.main serve &lt;model&gt; --headless ...</code> and supervises it{' '}
                <Cite tier={1} href={vllmUrl('rust/src/managed-engine/src/process.rs', 'L57-L66')}>
                  process.rs L57-L66
                </Cite>
                , or with <code>--data-parallel-size-local 0</code> joins engines started elsewhere{' '}
                <Cite tier={1} href={vllmUrl('rust/src/cmd/src/main.rs', 'L123-L139')}>main.rs L123-L139</Cite>.
                The GPU work runs in Python either way.
              </Box>
              <Box variant="p">
                <strong><code>vllm-rs bench serve</code></strong> is a Rust load generator.{' '}
                <code>vllm bench serve</code> hands off to it when <code>VLLM_USE_RUST_BENCH=1</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/entrypoints/cli/benchmark/main.py', 'L24-L35')}>
                  benchmark/main.py L24-L35
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong><code>vllm-rs render</code></strong> runs request rendering and preprocessing with no engine
                attached{' '}
                <Cite tier={1} href={vllmUrl('rust/src/server/src/render.rs', 'L107-L109')}>render.rs L107-L109</Cite>
                , serving <code>/v1/chat/completions/render</code> and <code>/v1/completions/render</code>, so
                prompt preparation can scale separately from GPUs.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Check your flags here before switching: a blocked flag stops startup and names itself"
          >
            What runs on the Rust frontend, and what refuses to start
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The Rust frontend keeps an inventory of Python serve flags it recognizes but does not implement. At
            v0.31.0 it holds <strong>58 hard-error arguments and 9 no-op arguments</strong>{' '}
            <Cite tier={1} href={vllmUrl(UNSUPPORTED)}>unsupported.rs</Cite>. Under <code>vllm serve</code>, Python
            forwards only the non-default args, and the Rust process checks them when it parses that JSON: any
            hard-error name stops startup with one message listing every offending argument, and each no-op logs a
            warning that it has no effect{' '}
            <Cite tier={1} href={vllmUrl(UNSUPPORTED, 'L103-L134')}>unsupported.rs L103-L134</Cite>. TLS (Transport
            Layer Security) including mTLS (mutual TLS), API keys, CORS (cross-origin resource sharing) and LoRA
            (low-rank adaptation) adapters all run. The live blockers include OTLP (OpenTelemetry Protocol)
            tracing, admission control and a custom tokenizer path.
          </Box>
          <Table
            items={capabilityRows}
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'cap', header: 'Capability or flag', cell: (r) => r.capability, minWidth: 260 },
              { id: 'status', header: 'Rust frontend', cell: (r) => statusBadge(r.status), minWidth: 130 },
              { id: 'detail', header: 'Notes and source', cell: (r) => r.detail, minWidth: 300 },
            ]}
          />
          <ExpandableSection headerText="Why a hard error instead of a silent fallback">
            <Box variant="p">
              The inventory mirrors the Python argument surface (top-level <code>serve</code> arguments,{' '}
              <code>EngineArgs</code> fields the frontend owns, and server arguments) so the Rust frontend
              recognizes the flags a user would pass to Python. Failing at parse time is the safe choice for anything
              it cannot honor: a server that ignored <code>--otlp-traces-endpoint</code> would leave an operator
              believing traces were flowing. To send a flag to the Python engine only, the error text says to put it
              after <code>--</code>, with the warning that the Rust frontend then ignores it entirely{' '}
              <Cite tier={1} href={vllmUrl(UNSUPPORTED, 'L23-L34')}>unsupported.rs L23-L34</Cite>.
            </Box>
          </ExpandableSection>
          <Alert type="info" header="Deciding and switching">
            <SpaceBetween size="xs">
              <Box variant="p">
                <strong>1. List your non-default flags.</strong> The API server logs them at startup as{' '}
                <code>non-default args: {'{...}'}</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/entrypoints/launchers/launcher.py', 'L252-L255')}>
                  launcher.py L252-L255
                </Cite>
                ; that set, minus the DP and API-server-count flags Python handles itself, is what reaches the Rust
                frontend.
              </Box>
              <Box variant="p">
                <strong>2. Match them against the table</strong>, or against the inventory file for the full 58.
                One hard-error name rules the Rust frontend out for that deployment until you drop the flag. A no-op can
                still change behavior: <code>--api-server-count 4</code> becomes one process.
              </Box>
              <Box variant="p">
                <strong>3. Switch</strong> with <code>VLLM_USE_RUST_FRONTEND=1 vllm serve &lt;model&gt; &lt;same
                flags&gt;</code>, after confirming the install ships <code>vllm-rs</code> (or setting{' '}
                <code>VLLM_RUST_FRONTEND_PATH</code>). Before production traffic, compare outputs from both frontends
                on your own prompts, because the Rust frontend renders and tokenizes them, and keep{' '}
                <code>--grpc-port</code> behind mTLS or a private network, since the API key does not
                cover it. Unsetting the variable returns you to the Python server.
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
