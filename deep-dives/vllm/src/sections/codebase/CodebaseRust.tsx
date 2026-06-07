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

// ---------------------------------------------------------------------------
// Diagram 1 — the request path: Python frontend vs Rust frontend, both landing
// on the SAME unchanged Python EngineCoreProc over the same ZMQ/MessagePack wire.
// ---------------------------------------------------------------------------

function RequestPathDiagram() {
  const width = 900;
  const height = 430;
  const colW = (width - 80) / 2;
  const leftX = 24;
  const rightX = 56 + colW;

  const box = (
    x: number,
    y: number,
    w: number,
    h: number,
    stroke: string,
    fill: string,
  ) => <rect x={x} y={y} width={w} height={h} rx={6} fill={fill} stroke={stroke} strokeWidth={1.5} />;

  return (
    <div style={{ width: '100%' }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="The Python API server and the opt-in Rust frontend are interchangeable northbound layers; both speak the same ZMQ plus MessagePack wire protocol to the identical unchanged Python EngineCoreProc and GPU path"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <title>Python vs Rust frontend, shared engine</title>
        <defs>
          <marker id="rp-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0,0 L9,4.5 L0,9 z" fill="#687078" />
          </marker>
        </defs>

        <text x={20} y={24} fontSize={13} fontWeight={700} fill="#16191f">
          One engine, two interchangeable northbound layers
        </text>

        {/* HTTP client */}
        <rect x={width / 2 - 110} y={40} width={220} height={34} rx={6} fill="#f4f4f4" stroke="#687078" strokeWidth={1.5} />
        <text x={width / 2} y={62} fontSize={12} fontWeight={700} fill="#16191f" textAnchor="middle">
          OpenAI-compatible HTTP / gRPC client
        </text>

        {/* Left column — Python frontend */}
        {box(leftX, 100, colW, 150, '#0972d3', '#f2f8fd')}
        <text x={leftX + 16} y={124} fontSize={12} fontWeight={700} fill="#0972d3">
          Default: Python API server
        </text>
        {box(leftX + 16, 136, colW - 32, 44, '#0972d3', '#ffffff')}
        <text x={leftX + colW / 2} y={154} fontSize={11} fontWeight={700} fill="#16191f" textAnchor="middle">
          FastAPI / uvicorn (asyncio)
        </text>
        <text x={leftX + colW / 2} y={170} fontSize={10} fill="#687078" textAnchor="middle">
          chat-template render + token-stream parse
        </text>
        {box(leftX + 16, 190, colW - 32, 44, '#0972d3', '#ffffff')}
        <text x={leftX + colW / 2} y={208} fontSize={11} fontWeight={700} fill="#16191f" textAnchor="middle">
          AsyncLLM client (Python)
        </text>
        <text x={leftX + colW / 2} y={224} fontSize={10} fill="#687078" textAnchor="middle">
          GIL-bound: render + parse contend for one lock
        </text>

        {/* Right column — Rust frontend */}
        {box(rightX, 100, colW, 150, '#037f0c', '#ecf7ec')}
        <text x={rightX + 16} y={124} fontSize={12} fontWeight={700} fill="#037f0c">
          Opt-in: Rust frontend (vllm-rs)
        </text>
        {box(rightX + 16, 136, colW - 32, 44, '#037f0c', '#ffffff')}
        <text x={rightX + colW / 2} y={154} fontSize={11} fontWeight={700} fill="#16191f" textAnchor="middle">
          axum HTTP (+ optional gRPC)
        </text>
        <text x={rightX + colW / 2} y={170} fontSize={10} fill="#687078" textAnchor="middle">
          minijinja render + winnow token parse
        </text>
        {box(rightX + 16, 190, colW - 32, 44, '#037f0c', '#ffffff')}
        <text x={rightX + colW / 2} y={208} fontSize={11} fontWeight={700} fill="#16191f" textAnchor="middle">
          vllm-engine-core-client (Rust)
        </text>
        <text x={rightX + colW / 2} y={224} fontSize={10} fill="#687078" textAnchor="middle">
          capped Tokio pool + mimalloc, no GIL
        </text>

        {/* client to both columns */}
        <line x1={width / 2 - 40} y1={74} x2={leftX + colW / 2} y2={100} stroke="#687078" strokeWidth={1.5} markerEnd="url(#rp-arrow)" />
        <line x1={width / 2 + 40} y1={74} x2={rightX + colW / 2} y2={100} stroke="#687078" strokeWidth={1.5} markerEnd="url(#rp-arrow)" />

        {/* shared wire label */}
        <text x={width / 2} y={278} fontSize={11} fontWeight={700} fill="#ec7211" textAnchor="middle">
          identical wire: ZMQ ROUTER/PULL + MessagePack (no FFI)
        </text>
        <line x1={leftX + colW / 2} y1={250} x2={width / 2} y2={296} stroke="#ec7211" strokeWidth={2} markerEnd="url(#rp-arrow)" />
        <line x1={rightX + colW / 2} y1={250} x2={width / 2} y2={296} stroke="#ec7211" strokeWidth={2} markerEnd="url(#rp-arrow)" />

        {/* shared engine */}
        {box(width / 2 - 230, 302, 460, 100, '#7d2105', '#fef3e9')}
        <text x={width / 2} y={326} fontSize={12} fontWeight={700} fill="#7d2105" textAnchor="middle">
          UNCHANGED Python EngineCoreProc (one per engine)
        </text>
        <text x={width / 2} y={348} fontSize={11} fill="#16191f" textAnchor="middle">
          scheduler · PagedAttention KV manager · model executor
        </text>
        <text x={width / 2} y={368} fontSize={11} fontWeight={700} fill="#16191f" textAnchor="middle">
          GPU / accelerator path — byte-for-byte identical either way
        </text>
        <text x={width / 2} y={388} fontSize={10} fill="#687078" textAnchor="middle">
          frontend swap never touches the engine or the kernels
        </text>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Diagram 2 — the Rust crate dependency stack, bottom-up.
// ---------------------------------------------------------------------------

interface StackRow {
  crate: string;
  role: string;
  fill: string;
  stroke: string;
}

const stackRows: StackRow[] = [
  { crate: 'vllm-rs (src/cmd)', role: 'CLI entrypoint — frontend subprocess or managed serve', fill: '#f2f8fd', stroke: '#0972d3' },
  { crate: 'vllm-server', role: 'axum OpenAI-compatible HTTP + optional gRPC Generate', fill: '#f2f8fd', stroke: '#0972d3' },
  { crate: 'vllm-chat', role: 'minijinja / DeepSeek renderers + tool & reasoning parsers', fill: '#ecf7ec', stroke: '#037f0c' },
  { crate: 'vllm-text', role: 'tokenizer + incremental detokenizer', fill: '#ecf7ec', stroke: '#037f0c' },
  { crate: 'vllm-llm', role: 'thin token-in / token-out facade over the engine client', fill: '#ecf7ec', stroke: '#037f0c' },
  { crate: 'vllm-engine-core-client', role: 'ZMQ transport + MessagePack protocol to the engine', fill: '#fef3e9', stroke: '#7d2105' },
  { crate: 'vllm-tokenizer', role: 'HF / tiktoken / tekken token vocab backends', fill: '#fef3e9', stroke: '#7d2105' },
];

function CrateStackDiagram() {
  const width = 880;
  const rowH = 46;
  const gap = 8;
  const top = 44;
  const height = top + stackRows.length * (rowH + gap) + 16;

  return (
    <div style={{ width: '100%' }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="The Rust frontend is a Cargo workspace layered bottom-up: vllm-rs depends on vllm-server, which depends on vllm-chat, vllm-text and vllm-llm, all the way down to vllm-engine-core-client and vllm-tokenizer"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <title>Rust crate dependency stack</title>
        <text x={20} y={26} fontSize={13} fontWeight={700} fill="#16191f">
          Crate stack (depends-on points downward)
        </text>
        {stackRows.map((r, i) => {
          const y = top + i * (rowH + gap);
          return (
            <g key={r.crate}>
              <rect x={24} y={y} width={width - 48} height={rowH} rx={6} fill={r.fill} stroke={r.stroke} strokeWidth={1.5} />
              <text x={42} y={y + 20} fontSize={12} fontWeight={700} fill={r.stroke}>
                {r.crate}
              </text>
              <text x={42} y={y + 37} fontSize={11} fill="#16191f">
                {r.role}
              </text>
              {i < stackRows.length - 1 && (
                <line
                  x1={width / 2}
                  y1={y + rowH}
                  x2={width / 2}
                  y2={y + rowH + gap}
                  stroke="#687078"
                  strokeWidth={1.5}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Support / hard-error capability table.
// ---------------------------------------------------------------------------

interface CapabilityRow {
  capability: string;
  status: 'supported' | 'hard-error' | 'no-op';
  detail: string;
}

const capabilityRows: CapabilityRow[] = [
  { capability: 'OpenAI /v1/chat/completions, /v1/completions (incl. streaming)', status: 'supported', detail: 'Primary axum routes; SSE streaming wired through the same engine client.' },
  { capability: 'Chat-template rendering', status: 'supported', detail: 'minijinja HF renderer (Auto) plus dedicated DeepSeek-V3.2 / V4 renderers.' },
  { capability: 'Tool-call & reasoning parsing', status: 'supported', detail: 'Registry of named parsers + model-name pattern matching (Hermes, Mistral, Qwen, DeepSeek, GLM, Kimi, Llama JSON, ...).' },
  { capability: 'gRPC Generate service', status: 'supported', detail: 'Optional, bound on a separate port (grpc_port). Off unless configured.' },
  { capability: 'Data-parallel / managed or external engines', status: 'supported', detail: 'Manages a Python headless engine child, or joins externally-started engines via the shared handshake.' },
  { capability: 'SSL / TLS termination (--ssl-keyfile, --ssl-certfile, ...)', status: 'hard-error', detail: 'Listed in UnsupportedArgs; passing it aborts startup with a message to remove it.' },
  { capability: 'API-key auth (--api-key)', status: 'hard-error', detail: 'Not implemented; rejected at parse time.' },
  { capability: 'CORS (--allowed-origins / --allowed-methods / --allowed-headers)', status: 'hard-error', detail: 'Not implemented; rejected at parse time.' },
  { capability: 'Dynamic LoRA (--lora-modules)', status: 'hard-error', detail: 'Not implemented; rejected at parse time.' },
  { capability: 'OpenTelemetry tracing (--otlp-traces-endpoint)', status: 'hard-error', detail: 'Not implemented; rejected at parse time.' },
  { capability: 'Custom tokenizer / HF overrides (--tokenizer, --hf-overrides, ...)', status: 'hard-error', detail: 'Frontend-owned engine args the Rust path does not yet honor.' },
  { capability: 'A handful of server knobs (--api-server-count, --enable-auto-tool-choice, ...)', status: 'no-op', detail: 'Accepted but ignored with a warning rather than rejected.' },
];

function statusBadge(status: CapabilityRow['status']) {
  if (status === 'supported') return <Badge color="green">Supported</Badge>;
  if (status === 'no-op') return <Badge color="blue">No-op (ignored)</Badge>;
  return <Badge color="red">Hard error</Badge>;
}

export function CodebaseRust() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="An opt-in Rust drop-in for the API-server process only — never the engine (rust/, pinned to commit 15652a6b, accessed 2026-06-07)"
          >
            The Rust Frontend
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What it is.</strong> vLLM now ships a Rust frontend under{' '}
            <code>rust/</code>. It is a drop-in replacement for one specific
            process — the northbound{' '}
            <strong>API-server / OpenAI-compatible HTTP layer</strong> — and
            nothing else. The scheduler, the PagedAttention KV manager, the
            model executor, and every GPU kernel stay in unchanged Python. The
            crate&apos;s own README is blunt about scope: rebuild the serving
            layer in Rust &quot;while still talking to the core Python vLLM
            engine process(es) via ZMQ over the existing engine boundary.&quot;
          </Box>
          <Box variant="p">
            <strong>Why it exists.</strong> The Python API server does two
            CPU-heavy jobs on every request that both fight for the GIL: it
            renders the chat template into a prompt before the request goes to
            the engine, and it parses the raw token stream coming back into
            structured assistant content, tool calls, and reasoning blocks.
            Under high concurrency that GIL-bound render-and-parse work becomes
            the frontend bottleneck. The Rust frontend moves it off the GIL onto
            a capped Tokio worker pool with the{' '}
            <code>mimalloc</code> global allocator, leaving the engine process
            free to do nothing but schedule and run the model.
          </Box>
          <Box variant="p">
            <strong>The one fact to anchor on.</strong> There is{' '}
            <strong>no FFI</strong>. Rust does not embed the Python interpreter
            and Python does not call into Rust through a C ABI. The two sides are
            separate OS processes that exchange the{' '}
            <strong>exact same ZMQ + MessagePack messages</strong> the Python
            API server already used to reach{' '}
            <code>EngineCoreProc</code>. The frontend is interchangeable
            precisely because the wire is unchanged.
          </Box>
          <Alert type="info">
            The code was merged from the external repo{' '}
            <Link external href="https://github.com/Inferact/vllm-frontend-rs">
              Inferact/vllm-frontend-rs
            </Link>{' '}
            (which preserves the pre-merge history). It is{' '}
            <strong>experimental and not feature-complete</strong> — the project
            README and the in-tree argument inventory both say so explicitly.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The request path: Python vs Rust, same engine</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Both frontends are northbound layers that terminate the OpenAI HTTP
            API and forward token-level work to the engine. They are
            interchangeable because they converge on the identical lower
            boundary — the unchanged Python{' '}
            <code>EngineCoreProc</code> reached over ZMQ.
          </Box>
          <RequestPathDiagram />
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">What changes (frontend only)</Box>
              <Box variant="p">
                HTTP server (FastAPI/uvicorn becomes axum), chat-template
                rendering (Jinja-in-Python becomes minijinja), token-stream
                parsing (Python becomes Rust with{' '}
                <code>winnow</code>), and the engine client (Python AsyncLLM
                client becomes <code>vllm-engine-core-client</code>). All of it
                runs without the GIL.
              </Box>
            </div>
            <div>
              <Box variant="h3">What does not change (the engine)</Box>
              <Box variant="p">
                The engine process, the scheduler, the KV-cache block manager,
                the model executor, and the entire GPU path are byte-for-byte
                identical. Swapping the frontend cannot alter generation
                results, because nothing that produces tokens moved.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The crate stack</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            <code>rust/</code> is a single Cargo workspace (edition 2024,
            toolchain pinned to channel <code>1.95</code> via{' '}
            <code>rust-toolchain.toml</code>). The crates are layered bottom-up:
            the CLI binary sits on top of the HTTP server, which sits on the chat
            layer, down to the ZMQ/MessagePack client and the tokenizer at the
            base.
          </Box>
          <CrateStackDiagram />
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">vllm-chat — the heavy lifting</Box>
              <Box variant="p">
                This is where the GIL pain is actually paid down. It holds the{' '}
                <code>minijinja</code> HF template renderer plus dedicated
                DeepSeek-V3.2 and V4 renderers (selected{' '}
                <code>Auto</code> by model type), and the two parser registries
                that turn raw tokens into structured assistant events.
              </Box>
            </div>
            <div>
              <Box variant="h3">Standalone parser crates</Box>
              <Box variant="p">
                The tool-call and reasoning parsers are published as their own
                crates (<code>vllm-tool-parser</code>,{' '}
                <code>vllm-reasoning-parser</code>). The tool-parser registry
                wires named parsers (Hermes, Mistral, Qwen3, DeepSeek, GLM,
                Kimi-K2, Llama JSON, ...) and resolves a model name to a parser
                by pattern match.
              </Box>
            </div>
          </ColumnLayout>
          <ExpandableSection headerText="How the parser & renderer registries resolve (from source)">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Tool parsers</strong> live in{' '}
                <code>chat/src/parser/tool/mod.rs</code>: a global registry
                registers each parser under a canonical name, then registers
                model-name patterns (for example <code>mistral-</code> and{' '}
                <code>mixtral-</code> route to the Mistral parser;{' '}
                <code>deepseek-v3.2</code> to the DeepSeek-V3.2 parser). The
                parser implementations themselves are in the{' '}
                <code>vllm-tool-parser</code> crate.
              </Box>
              <Box variant="p">
                <strong>Reasoning parsers</strong> (<code>vllm-reasoning-parser</code>)
                expose a small set of base implementations
                (DeepSeek-R1, Qwen3, Gemma4, Kimi, Cohere-Command) with type
                aliases mapping many model families onto the Qwen3 delimited
                parser.
              </Box>
              <Box variant="p">
                <strong>Renderer selection</strong> (<code>chat/src/renderer/selection.rs</code>)
                is an enum — <code>Auto</code>, <code>Hf</code>,{' '}
                <code>DeepSeekV32</code>, <code>DeepSeekV4</code> — where{' '}
                <code>Auto</code> resolves by model type and otherwise falls back
                to the HF minijinja renderer.
              </Box>
              <Box variant="p">
                <strong>The wire client</strong> (<code>engine-core-client/src/transport.rs</code>)
                uses ZMQ <code>RouterSocket</code> / <code>PullSocket</code> and
                MessagePack (<code>encode_msgpack</code> /{' '}
                <code>decode_msgpack</code>). It is wire-compatible with the
                Python engine down to details like the two-byte little-endian
                engine index used as the ZMQ routing identity and the literal{' '}
                <code>ENGINE_CORE_DEAD</code> death sentinel.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">How it is launched and managed</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The Rust frontend is <strong>off by default</strong>. You opt in
            with <code>VLLM_USE_RUST_FRONTEND=1</code>, and Python stays in
            charge of process lifecycle — the Rust binary is a Python-supervised
            worker, not a separate stack you run yourself.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Toggle</Box>
              <Box variant="p">
                <code>VLLM_USE_RUST_FRONTEND=1 vllm serve ...</code>. The flag is
                read in <code>vllm/envs.py</code>;{' '}
                <code>VLLM_RUST_FRONTEND_PATH</code> (default{' '}
                <code>auto</code>) resolves the <code>vllm-rs</code> binary.
              </Box>
            </div>
            <div>
              <Box variant="h3">Launch</Box>
              <Box variant="p">
                <code>RustFrontendProcessManager</code> in{' '}
                <code>vllm/v1/utils.py</code> spawns{' '}
                <code>vllm-rs frontend</code>, passing the inherited listening
                socket fd, the ZMQ input/output addresses, the engine count, and
                the non-default args as JSON.
              </Box>
            </div>
            <div>
              <Box variant="h3">Slot</Box>
              <Box variant="p">
                It is wired into{' '}
                <code>vllm/entrypoints/cli/serve.py</code> as a peer of{' '}
                <code>APIServerProcessManager</code> — same monitoring
                interface, so the rest of the launch path does not care which
                frontend is running.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            <strong>Reverse direction too.</strong> Run standalone, the Rust{' '}
            <code>managed-engine</code> crate can spawn the Python headless
            engine as a child — it shells out to{' '}
            <code>python -m vllm.entrypoints.cli.main serve &lt;model&gt; --headless ...</code>{' '}
            and supervises it. Either way the GPU work runs in Python; only who
            launches whom changes. The Tokio worker pool is also capped (default
            max 32 threads, override with <code>TOKIO_WORKER_THREADS</code>) to
            avoid context-switch thrash on many-core hosts.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">What works today vs what hard-errors</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Because it is experimental, the Rust frontend keeps an explicit
            inventory of Python server flags it recognizes but does not yet
            implement (<code>cmd/src/cli/unsupported.rs</code>). Passing one of
            those flags does not silently degrade — it{' '}
            <strong>aborts startup</strong> with a message telling you to remove
            it (a few low-risk knobs are instead accepted as no-ops with a
            warning). In the pinned commit the inventory carries 63 hard-error
            arguments and 6 no-op arguments.
          </Box>
          <Table
            items={capabilityRows}
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'cap', header: 'Capability', cell: (r) => r.capability, minWidth: 260 },
              { id: 'status', header: 'Rust frontend', cell: (r) => statusBadge(r.status), minWidth: 130 },
              { id: 'detail', header: 'Notes', cell: (r) => r.detail, minWidth: 280 },
            ]}
          />
          <Alert type="warning">
            <strong>Production guardrail.</strong> The hard-error list is the
            real eligibility test. If your deployment relies on TLS termination,
            API-key auth, CORS, dynamic LoRA, or OTLP tracing at the server
            layer, the Rust frontend will refuse to start — by design — until
            those features land. Front it with a proxy that supplies TLS/auth/CORS,
            or stay on the Python API server.
          </Alert>
          <ExpandableSection headerText="Why a hard error instead of a silent fallback">
            <Box variant="p">
              The inventory mirrors the Python argument surface
              (<code>EngineArgs</code>, <code>BaseFrontendArgs</code>,{' '}
              <code>FrontendArgs</code>, and the <code>serve</code> subcommand)
              so the Rust frontend recognizes the same flags a user would pass to
              Python. For anything it cannot honor, failing closed at parse time
              is the safe choice: a server that silently ignored{' '}
              <code>--ssl-keyfile</code> or <code>--api-key</code> would expose an
              endpoint the operator believed was protected. Crash-early beats a
              misleadingly-running server. If you genuinely want a flag to reach
              only the Python engine, the CLI lets you pass it after{' '}
              <code>--</code>, with the explicit caveat that the Rust frontend
              ignores it entirely.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
