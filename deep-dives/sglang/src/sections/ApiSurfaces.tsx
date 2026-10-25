import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangTreeUrl, sglangDocsSrcUrl } from '../components/Cite';

const HTTP = 'python/sglang/srt/entrypoints/http_server.py';
const AUTH = 'python/sglang/srt/utils/auth.py';
const SERVING = 'python/sglang/srt/arg_groups/fields/serving.py';
const SP = 'python/sglang/srt/sampling/sampling_params.py';
const PROTOCOL = 'python/sglang/srt/entrypoints/openai/protocol.py';
const SERVING_CHAT = 'python/sglang/srt/entrypoints/openai/serving_chat.py';
const SERVING_BASE = 'python/sglang/srt/entrypoints/openai/serving_base.py';
const SERVING_RESP = 'python/sglang/srt/entrypoints/openai/serving_responses.py';
const SCHEDULER = 'python/sglang/srt/managers/scheduler.py';
const TOKENIZER = 'python/sglang/srt/managers/tokenizer_manager.py';
const ENGINE = 'python/sglang/srt/entrypoints/engine.py';
const ANTHROPIC = 'python/sglang/srt/entrypoints/anthropic/serving.py';
const OLLAMA = 'python/sglang/srt/entrypoints/ollama/serving.py';
const LORA_FIELDS = 'python/sglang/srt/arg_groups/fields/lora.py';
const LORA_HOOK = 'python/sglang/srt/arg_groups/lora_hook.py';
const LORA_MGR = 'python/sglang/srt/lora/lora_manager.py';
const LORA_POOL = 'python/sglang/srt/lora/mem_pool.py';
const SCHED_BATCH = 'python/sglang/srt/managers/schedule_batch.py';
const CONTROL = 'python/sglang/srt/managers/tokenizer_control_mixin.py';
const IO = 'python/sglang/srt/managers/io_struct.py';
const ENVIRON = 'python/sglang/srt/environ.py';
const MODEL_CONFIG = 'python/sglang/srt/configs/model_config.py';
const FC_PARSER = 'python/sglang/srt/function_call/function_call_parser.py';
const REASONING_NAMES = 'python/sglang/srt/parser/reasoning_parser_names.py';
const SERVER_ARGS = 'python/sglang/srt/server_args.py';
const COMMON = 'python/sglang/srt/utils/common.py';
const WATERMARK = 'python/sglang/srt/sampling/watermarking/core.py';
const V1_LOADS = 'python/sglang/srt/entrypoints/v1_loads.py';
const RUST_APP = 'rust/sglang-server/src/api_server/http/app.rs';
const RELEASE_NOTES = 'https://github.com/sgl-project/sglang/releases/tag/v0.5.22';
const AWS_DLC_EKS =
  'https://github.com/aws/deep-learning-containers/blob/23970abd5b8919ea3e1add74692a0d056b2fcbd9/docs/sglang/deployment/eks.md#L8-L55';
const AWS_SM_PING =
  'https://docs.aws.amazon.com/sagemaker/latest/dg/your-algorithms-inference-code.html#your-algorithms-inference-algo-ping-requests';

function vllmUrl(path: string, lines: string): string {
  return `https://github.com/vllm-project/vllm/blob/v0.31.0/${path}#${lines}`;
}

const VLLM_SERVER_LINK = (
  <Link href="../vllm/">vLLM dive, section 12: The OpenAI-Compatible Server</Link>
);
const VLLM_LORA_LINK = (
  <Link href="../vllm/">vLLM dive, section 13: LoRA &amp; Multi-Adapter Serving</Link>
);

/* ------------------------------------------------------------------------ */
/* Diagram: the endpoint map                                                 */
/* ------------------------------------------------------------------------ */

const MAP_DIALECTS: { title: string; sub: string }[] = [
  { title: 'Native /generate', sub: 'default cap 128 tokens' },
  { title: 'OpenAI /v1/completions', sub: 'default cap 16 tokens' },
  { title: 'OpenAI /v1/chat/completions', sub: 'no default cap; model sampling defaults' },
  { title: 'OpenAI /v1/responses', sub: 'model sampling defaults, as on chat' },
  { title: 'Anthropic /v1/messages', sub: 'translated onto the chat handler' },
  { title: 'Ollama /api/chat, /api/generate', sub: 'default cap 2,048 tokens' },
  { title: 'SageMaker /invocations', sub: 'chat body, same chat handler' },
  { title: 'sgl.Engine.generate()', sub: 'in-process, native shape, no HTTP' },
];

const MAP_ADMIN: string[] = [
  'Weight updates and refit',
  'Memory release and resume',
  'Pause, continue, abort',
  'Radix cache flush',
  'LoRA load and unload',
  'Profiling and log levels',
];

function EndpointMapDiagram() {
  const boxX = 24;
  const boxW = 308;
  const boxH = 42;
  const firstY = 62;
  const step = 50;
  const busX = 356;
  const tmX = 384;
  const tmW = 180;
  const tmY = 196;
  const tmH = 88;
  const tmMid = tmY + tmH / 2;
  const tmCx = tmX + tmW / 2;
  const adminX = 626;
  const adminW = 262;
  const adminBoxX = 638;
  const adminBoxW = 238;
  const lastCenter = firstY + (MAP_DIALECTS.length - 1) * step + boxH / 2;

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 480"
        role="img"
        aria-labelledby="apis-map-title"
        aria-describedby="apis-map-desc"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="apis-map-title">
          Every SGLang dialect ends in one call, TokenizerManager.generate_request, and the admin
          plane sits beside the dialects on the same port.
        </title>
        <desc id="apis-map-desc">
          Eight inference dialects on the left: native /generate with a default output cap of 128
          tokens, OpenAI completions with 16, OpenAI chat with no default cap and the model&apos;s
          sampling defaults, OpenAI Responses with the same sampling defaults, Anthropic Messages
          translated onto the chat handler, Ollama with 2,048, SageMaker /invocations on the chat
          handler, and the in-process sgl.Engine. All converge on the TokenizerManager, which hands
          requests to the scheduler. Inference routes need --api-key when it is set. On the right,
          the admin plane (weight updates, memory release, pause, cache flush, LoRA loading,
          profiling and the HiCache storage routes) calls into the same TokenizerManager and is
          guarded by --admin-api-key if set, otherwise by --api-key, otherwise open. The HiCache
          storage attach, detach and query routes return 400 unless an admin key is set. /health, /health_generate, /ready
          and /metrics need no key in any state.
        </desc>
        <style>{`
          .apis-map-band-inf { fill: #f2f8fd; stroke: #b8d4f0; stroke-width: 1; }
          .apis-map-band-adm { fill: #fbf3d5; stroke: #e0c97a; stroke-width: 1; }
          .apis-map-band-t { fill: #414d5c; font: 600 12px sans-serif; }
          .apis-map-band-s { fill: #5f6b7a; font: 11px sans-serif; }
          .apis-map-box { fill: #ffffff; stroke: #0972d3; stroke-width: 1.5; }
          .apis-map-adm { fill: #ffffff; stroke: #8b6c00; stroke-width: 1.5; }
          .apis-map-core { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
          .apis-map-sched { fill: #f4f4f4; stroke: #879596; stroke-width: 1.5; }
          .apis-map-open { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .apis-map-t { fill: #16191f; font: 600 13px sans-serif; }
          .apis-map-s { fill: #5f6b7a; font: 11px sans-serif; }
          .apis-map-at { fill: #16191f; font: 600 12px sans-serif; }
          .apis-map-as { fill: #5c4800; font: 11px sans-serif; }
          .apis-map-ct { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
          .apis-map-cs { fill: #ffffff; font: 11px sans-serif; text-anchor: middle; }
          .apis-map-mt { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .apis-map-ms { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .apis-map-ot { fill: #0f3d38; font: 600 12px sans-serif; }
          .apis-map-os { fill: #0f3d38; font: 11px sans-serif; }
          .apis-map-line { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
          .apis-map-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#apis-map-ah); }
          .apis-map-arr-adm { stroke: #8b6c00; stroke-width: 1.5; fill: none; marker-end: url(#apis-map-ah-adm); }
          .apis-map-lbl { fill: #5c4800; font: 600 11px sans-serif; text-anchor: middle; }
        `}</style>
        <defs>
          <marker
            id="apis-map-ah"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#5f6b7a" />
          </marker>
          <marker
            id="apis-map-ah-adm"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#8b6c00" />
          </marker>
        </defs>

        <rect x={0} y={0} width={900} height={480} rx={8} fill="#ffffff" />

        {/* Inference band */}
        <rect x={12} y={12} width={332} height={454} rx={6} className="apis-map-band-inf" />
        <text x={24} y={34} className="apis-map-band-t">
          Inference dialects
        </text>
        <text x={24} y={50} className="apis-map-band-s">
          need --api-key when it is set
        </text>
        {MAP_DIALECTS.map((d, i) => {
          const y = firstY + i * step;
          const cy = y + boxH / 2;
          return (
            <g key={d.title}>
              <rect x={boxX} y={y} width={boxW} height={boxH} rx={5} className="apis-map-box" />
              <text x={boxX + 12} y={y + 18} className="apis-map-t">
                {d.title}
              </text>
              <text x={boxX + 12} y={y + 34} className="apis-map-s">
                {d.sub}
              </text>
              <line x1={boxX + boxW} y1={cy} x2={busX} y2={cy} className="apis-map-line" />
            </g>
          );
        })}
        <line
          x1={busX}
          y1={firstY + boxH / 2}
          x2={busX}
          y2={lastCenter}
          className="apis-map-line"
        />
        <line x1={busX} y1={tmMid} x2={tmX} y2={tmMid} className="apis-map-arr" />

        {/* One port */}
        <text x={tmCx} y={40} className="apis-map-mt">
          One port
        </text>
        <text x={tmCx} y={56} className="apis-map-ms">
          127.0.0.1:30000 by default
        </text>

        {/* TokenizerManager */}
        <rect x={tmX} y={tmY} width={tmW} height={tmH} rx={6} className="apis-map-core" />
        <text x={tmCx} y={tmY + 26} className="apis-map-ct">
          TokenizerManager
        </text>
        <text x={tmCx} y={tmY + 46} className="apis-map-cs">
          generate_request()
        </text>
        <text x={tmCx} y={tmY + 62} className="apis-map-cs">
          tokenize, then hand
        </text>
        <text x={tmCx} y={tmY + 78} className="apis-map-cs">
          to the scheduler
        </text>

        {/* Scheduler */}
        <line x1={tmCx} y1={tmY + tmH} x2={tmCx} y2={330} className="apis-map-arr" />
        <rect x={tmX} y={330} width={tmW} height={56} rx={6} className="apis-map-sched" />
        <text x={tmCx} y={354} className="apis-map-mt">
          Scheduler and GPU
        </text>
        <text x={tmCx} y={372} className="apis-map-ms">
          sections 3 and 4
        </text>

        {/* Admin band */}
        <rect x={adminX} y={12} width={adminW} height={352} rx={6} className="apis-map-band-adm" />
        <text x={adminX + 12} y={34} className="apis-map-band-t">
          Admin plane
        </text>
        <text x={adminX + 12} y={50} className="apis-map-band-s">
          --admin-api-key if set,
        </text>
        <text x={adminX + 12} y={64} className="apis-map-band-s">
          else --api-key, else open
        </text>
        {MAP_ADMIN.map((label, i) => {
          const y = 78 + i * 38;
          return (
            <g key={label}>
              <rect x={adminBoxX} y={y} width={adminBoxW} height={30} rx={5} className="apis-map-adm" />
              <text x={adminBoxX + 10} y={y + 20} className="apis-map-at">
                {label}
              </text>
            </g>
          );
        })}
        <rect x={adminBoxX} y={306} width={adminBoxW} height={44} rx={5} className="apis-map-adm" />
        <text x={adminBoxX + 10} y={324} className="apis-map-at">
          HiCache attach, detach, query
        </text>
        <text x={adminBoxX + 10} y={340} className="apis-map-as">
          400 unless --admin-api-key is set
        </text>
        <line x1={adminX} y1={tmMid} x2={tmX + tmW} y2={tmMid} className="apis-map-arr-adm" />
        <text x={(adminX + tmX + tmW) / 2} y={tmMid - 8} className="apis-map-lbl">
          control
        </text>

        {/* Always open */}
        <rect x={adminX} y={384} width={adminW} height={72} rx={6} className="apis-map-open" />
        <text x={adminX + 12} y={406} className="apis-map-ot">
          No key in any state
        </text>
        <text x={adminX + 12} y={424} className="apis-map-os">
          /health, /health_generate,
        </text>
        <text x={adminX + 12} y={440} className="apis-map-os">
          /ready, /metrics
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Tables                                                                    */
/* ------------------------------------------------------------------------ */

interface LoraRow {
  id: string;
  flag: ReactNode;
  def: ReactNode;
  what: ReactNode;
}

const LORA_ROWS: LoraRow[] = [
  {
    id: 'paths',
    flag: <code>--lora-paths</code>,
    def: 'none',
    what: (
      <>
        Adapters loaded at start, as <code>PATH</code>, <code>NAME=PATH</code> or JSON with{' '}
        <code>pinned</code>; turns LoRA on, as <code>--enable-lora</code> does without adapters
      </>
    ),
  },
  {
    id: 'per-batch',
    flag: <code>--max-loras-per-batch</code>,
    def: '8',
    what: 'GPU adapter slots per batch; base-model requests take one',
  },
  {
    id: 'rank',
    flag: (
      <>
        <code>--max-lora-rank</code>, <code>--lora-target-modules</code>
      </>
    ),
    def: 'inferred from --lora-paths',
    what: 'Slot size; required when the server starts with no adapters',
  },
  {
    id: 'loaded',
    flag: <code>--max-loaded-loras</code>,
    def: 'unset',
    what: 'Cap on adapters held in CPU memory; at least --max-loras-per-batch',
  },
  {
    id: 'backend',
    flag: <code>--lora-backend</code>,
    def: 'csgmv',
    what: (
      <>
        Kernel; also <code>triton</code>, <code>torch_native</code>, <code>ascend</code>
      </>
    ),
  },
  {
    id: 'drain',
    flag: <code>--lora-drain-wait-threshold</code>,
    def: '0 (off)',
    what: 'Seconds a request may wait before one running adapter is drained',
  },
];

interface AdminRow {
  id: string;
  route: ReactNode;
  does: ReactNode;
  watch: ReactNode;
}

const ADMIN_ROWS: AdminRow[] = [
  {
    id: 'flush',
    route: <code>/flush_cache</code>,
    does: 'Empties the radix cache',
    watch: (
      <>
        Runs only with nothing running or waiting; otherwise 400, or a wait of up to{' '}
        <code>?timeout=</code> seconds{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L1009-L1024')}>
          http_server.py L1009-L1024
        </Cite>
      </>
    ),
  },
  {
    id: 'pause',
    route: (
      <>
        <code>/pause_generation</code>, <code>/continue_generation</code>
      </>
    ),
    does: 'Stops and resumes inference while control calls keep working',
    watch: (
      <>
        <code>mode</code>: <code>abort</code> (default) returns in-flight requests,{' '}
        <code>retract</code> re-queues them, <code>in_place</code> keeps them and their KV
        (key-value) cache, which makes a later flush fail{' '}
        <Cite tier={1} href={sglangUrl(IO, 'L1921-L1940')}>
          io_struct.py L1921-L1940
        </Cite>
      </>
    ),
  },
  {
    id: 'weights',
    route: (
      <>
        <code>/update_weights_from_disk</code> and the tensor, distributed and IPC
        (inter-process communication) forms
      </>
    ),
    does: 'Refit the model in place',
    watch: (
      <>
        Flushes the radix cache after loading; section 13, SGLang as an RL Rollout Engine, covers
        the RL (reinforcement learning) call sequence and memory release{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L1265-L1491')}>
          http_server.py L1265-L1491
        </Cite>
      </>
    ),
  },
  {
    id: 'profile',
    route: (
      <>
        <code>/start_profile</code>, <code>/stop_profile</code>,{' '}
        <code>/start_expert_distribution_record</code>
      </>
    ),
    does: 'Profile or record expert load on a running server',
    watch: (
      <>
        No restart needed; <code>/configure_logging</code> changes log levels the same way{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L1186-L1263')}>
          http_server.py L1186-L1263
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L1676-L1684')}>
          L1676-L1684
        </Cite>
      </>
    ),
  },
];

interface KeyRow {
  id: string;
  start: ReactNode;
  inference: ReactNode;
  admin: ReactNode;
  state: string;
}

const KEY_ROWS: KeyRow[] = [
  {
    id: 'none',
    start: 'No key',
    inference: 'Open',
    admin: 'Open to any client that can reach the port',
    state: 'Open',
  },
  {
    id: 'api',
    start: <code>--api-key</code>,
    inference: 'Need the API key',
    admin: 'Need the same API key',
    state: 'Shared',
  },
  {
    id: 'admin',
    start: <code>--admin-api-key</code>,
    inference: 'Open',
    admin: 'Need the admin key',
    state: 'Split',
  },
  {
    id: 'both',
    start: 'Both keys',
    inference: 'Need the API key',
    admin: 'Need the admin key; the API key gets 401',
    state: 'Split',
  },
];

interface DeployRow {
  id: string;
  where: ReactNode;
  keys: ReactNode;
  why: ReactNode;
}

const DEPLOY_ROWS: DeployRow[] = [
  {
    id: 'sagemaker',
    where: 'SageMaker AI real-time endpoint',
    keys: (
      <>
        <code>--admin-api-key</code> only, passed as <code>SM_SGLANG_ADMIN_API_KEY</code>
      </>
    ),
    why: (
      <>
        <code>/ping</code> is not exempt from <code>--api-key</code>{' '}
        <Cite tier={1} href={sglangUrl(AUTH, 'L101-L106')} kind="code">
          auth.py L101-L106
        </Cite>
        , and AWS documents the health check as a periodic <code>GET /ping</code> and names no way
        to attach a token{' '}
        <Cite tier={1} href={AWS_SM_PING}>
          SageMaker docs: custom inference code, health check
        </Cite>
        , so by our reading of the code, not executed, an inference key fails the health check.
        With only the admin key, our reading of the code is that <code>/ping</code> and{' '}
        <code>/invocations</code> stay unkeyed, and IAM (Identity and Access Management) on{' '}
        <code>InvokeEndpoint</code> guards inference. The entrypoint turns{' '}
        <code>SM_SGLANG_</code> variables into flags{' '}
        <Cite tier={1} href={sglangUrl('docker/serve', 'L4-L34')}>
          docker/serve L4-L34
        </Cite>
        . The key travels in the <code>Environment</code> map, which AWS advises keeping free of
        sensitive data{' '}
        <Cite tier={1} href="https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ContainerDefinition.html">
          SageMaker API: ContainerDefinition
        </Cite>
        ; section 19 covers the rest.
      </>
    ),
  },
  {
    id: 'eks',
    where: 'Amazon EKS or EC2 (Elastic Compute Cloud)',
    keys: (
      <>
        Both keys, with <code>--host 0.0.0.0</code> in the container
      </>
    ),
    why: (
      <>
        Probe <code>/health</code>, which no key guards and which runs a one-token check by
        default{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L705-L760')}>
          http_server.py L705-L760
        </Cite>
        . Keep <code>/server_info</code> off the client path. Section 20 covers the manifests.
      </>
    ),
  },
  {
    id: 'multi-tok',
    where: (
      <>
        Multi-tokenizer server (<code>--tokenizer-worker-num</code> above 1)
      </>
    ),
    keys: 'No key on the server; a gateway authenticates and keeps admin paths from clients',
    why: (
      <>
        <code>--api-key</code> fails an assertion at start{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L240-L250')}>
          http_server.py L240-L250
        </Cite>
        . <code>--admin-api-key</code> starts cleanly and is never checked, because the key
        middleware is installed only in single-tokenizer mode{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L2656-L2690')} kind="code">
          http_server.py L2656-L2690
        </Cite>
        . Our reading of the code, not run: admin routes stay as open as with no key, HiCache
        storage routes included{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L1107-L1173')} kind="code">
          http_server.py L1107-L1173
        </Cite>
        .
      </>
    ),
  },
  {
    id: 'rust',
    where: (
      <>
        Rust frontend (<code>SGLANG_RUST_SERVER=1</code>)
      </>
    ),
    keys: 'Neither key does anything; authenticate in a gateway',
    why: (
      <>
        Its router has no authentication layer and mounts no admin route and no{' '}
        <code>/metrics</code>{' '}
        <Cite tier={1} href={sglangUrl(RUST_APP, 'L77-L89')} kind="code">
          app.rs L77-L89
        </Cite>{' '}
        <Cite tier={1} href={sglangTreeUrl('rust')} kind="code">
          rust/ at v0.5.22
        </Cite>
        . Our reading of the code, not run: <code>--api-key</code> protects nothing and{' '}
        <code>--admin-api-key</code> has nothing to guard (section 3, The SGLang Runtime).
      </>
    ),
  },
];

/* ------------------------------------------------------------------------ */
/* Section                                                                   */
/* ------------------------------------------------------------------------ */

export function ApiSurfaces() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Port a client without surprises in output length, sampling defaults, tool parsing or adapter addressing, and set the admin key your deployment needs (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            12. Talking to SGLang: APIs, LoRA adapters and the admin plane
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One SGLang port answers its native <code>/generate</code>, the OpenAI routes, the
            Anthropic Messages API and the Ollama API, with LoRA (low-rank adaptation) adapters
            chosen per request. The challenge in porting a client is that these dialects share an
            engine and fill in different defaults, and that the same port carries an admin plane
            able to replace the model&apos;s weights.
          </Box>
          <Box variant="p">
            Every dialect is a thin translation into one call,{' '}
            <code>TokenizerManager.generate_request</code>, so the dialects differ in the
            defaults they fill in and the fields they read. The output cap is the first default to
            bite: a request that sets no limit stops at <strong>128 tokens</strong> on{' '}
            <code>/generate</code>, at 16 on <code>/v1/completions</code>, and runs to the context
            limit on chat. Who may call the admin plane depends on which of two keys the server
            starts with.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict what a request gets for every field it leaves unset, whichever route the client speaks"
          >
            One engine, many dialects
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each route parses its own request shape and ends in the same call. The OpenAI handlers
            call <code>generate_request</code> directly{' '}
            <Cite tier={1} href={sglangUrl(SERVING_CHAT, 'L2016')}>
              serving_chat.py L2016
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SERVING_RESP, 'L2699')}>
              serving_responses.py L2699
            </Cite>
            , the Anthropic handler and SageMaker&apos;s <code>/invocations</code> go through the
            chat handler{' '}
            <Cite tier={1} href={sglangUrl(ANTHROPIC, 'L183-L216')}>
              anthropic/serving.py L183-L216
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L2129-L2137')}>
              http_server.py L2129-L2137
            </Cite>
            , the Ollama routes build native requests{' '}
            <Cite tier={1} href={sglangUrl(OLLAMA, 'L68-L112')}>
              ollama/serving.py L68-L112
            </Cite>
            , and <code>sgl.Engine.generate</code> is <code>/generate</code> without HTTP{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L428-L539')}>
              engine.py L428-L539
            </Cite>
            .
          </Box>

          <EndpointMapDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. Output caps apply when a request sets no limit. Route lists
            are abridged; the admin and control block below lists the routes operators use most.
          </Box>

          <Box variant="p">
            Set the output cap explicitly, because each dialect fills it differently.{' '}
            <code>/generate</code> reads <code>max_new_tokens</code> from{' '}
            <code>sampling_params</code> and falls back to <strong>128 tokens</strong>{' '}
            <Cite tier={1} href={sglangUrl(SP, 'L126')}>
              sampling_params.py L126
            </Cite>
            . <code>/v1/completions</code> declares <code>max_tokens</code> with a default of 16{' '}
            <Cite tier={1} href={sglangUrl(PROTOCOL, 'L351-L364')}>
              protocol.py L351-L364
            </Cite>
            . Chat passes <code>max_completion_tokens</code> or <code>max_tokens</code>; with both
            unset, the scheduler treats the limit as unbounded and clips it to the context left
            after the prompt{' '}
            <Cite tier={1} href={sglangUrl(PROTOCOL, 'L1150')}>
              protocol.py L1150
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L2585-L2608')}>
              scheduler.py L2585-L2608
            </Cite>
            . Ollama requests without <code>num_predict</code> get 2,048{' '}
            <Cite tier={1} href={sglangUrl(OLLAMA, 'L41-L66')}>
              ollama/serving.py L41-L66
            </Cite>
            . The same prompt sent to three endpoints can stop at three lengths, so a benchmark that
            mixes endpoints needs a token limit on every request. <code>SGLANG_MAX_NEW_TOKENS_LIMIT</code>{' '}
            (unset by default) adds a server-wide ceiling in the scheduler{' '}
            <Cite tier={1} href={sglangUrl(ENVIRON, 'L600')}>
              environ.py L600
            </Cite>
            .
          </Box>
          <Box variant="p">
            Sampling defaults split the same way. With the default{' '}
            <code>--sampling-defaults model</code>, a chat or Responses request that omits
            temperature, top-p, top-k, min-p or repetition penalty takes the value from the
            model&apos;s <code>generation_config.json</code>{' '}
            <Cite tier={1} href={sglangUrl(SERVING, 'L226-L232')}>
              serving.py L226-L232
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MODEL_CONFIG, 'L2098-L2128')}>
              model_config.py L2098-L2128
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SERVING_CHAT, 'L305-L318')} kind="code">
              serving_chat.py L305-L318
            </Cite>
            ; the order is request value, then generation config, then OpenAI defaults{' '}
            <Cite tier={1} href={sglangUrl(PROTOCOL, 'L1128-L1138')}>
              protocol.py L1128-L1138
            </Cite>
            . <code>/generate</code> and <code>/v1/completions</code> use constant defaults,
            temperature 1.0 among them{' '}
            <Cite tier={1} href={sglangUrl(SP, 'L117-L160')}>
              sampling_params.py L117-L160
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(PROTOCOL, 'L351-L372')}>
              protocol.py L351-L372
            </Cite>
            . To give <code>/generate</code> model-appropriate defaults, start the server with{' '}
            <code>--preferred-sampling-params</code>, a JSON object merged under each
            request&apos;s own <code>sampling_params</code>{' '}
            <Cite tier={1} href={sglangUrl(TOKENIZER, 'L1548-L1567')} kind="code">
              tokenizer_manager.py L1548-L1567
            </Cite>
            .
          </Box>
          <Box variant="p">
            The native API is the one SGLang&apos;s own frontend language and gateway speak{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/lang/backend/runtime_endpoint.py', 'L184-L189')}>
              runtime_endpoint.py L184-L189
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl('sgl-model-gateway/src/server.rs', 'L545')}>
              gateway server.rs L545
            </Cite>
            . It takes <code>text</code>, pre-tokenized <code>input_ids</code> or{' '}
            <code>input_embeds</code>, and a list in any field makes one call a batch{' '}
            <Cite tier={1} href={sglangUrl(IO, 'L177-L380')}>
              io_struct.py L177-L380
            </Cite>
            . Each response carries <code>meta_info.cached_tokens</code>, the request&apos;s
            radix-cache hit and the quickest check that prefix reuse is happening{' '}
            <Cite tier={1} href={sglangUrl(TOKENIZER, 'L2505-L2557')}>
              tokenizer_manager.py L2505-L2557
            </Cite>
            . SGLang registers <code>/generate</code> on every server; vLLM&apos;s token-in generate
            route is opt-in ({VLLM_SERVER_LINK}).
          </Box>
          <Box variant="p">
            On the OpenAI routes, SGLang-specific controls such as <code>top_k</code>,{' '}
            <code>regex</code>, <code>lora_path</code> and <code>chat_template_kwargs</code> ride in
            the SDK&apos;s <code>extra_body</code>{' '}
            <Cite tier={1} href={sglangUrl(PROTOCOL, 'L865-L1000')}>
              protocol.py L865-L1000
            </Cite>
            . Spell them exactly. The chat and completion request models set no strictness rule, so
            pydantic&apos;s default applies and an unknown key, such as <code>top-k</code> for{' '}
            <code>top_k</code>, is dropped without an error; that is our reading of the code, not
            run{' '}
            <Cite tier={1} href={sglangUrl(PROTOCOL, 'L334-L351')} kind="code">
              protocol.py L334-L351
            </Cite>
            . <code>/v1/completions</code> also accepts <code>best_of</code> and <code>suffix</code>{' '}
            and does nothing with them, and chat drops <code>user</code>{' '}
            <Cite tier={1} href={sglangUrl(PROTOCOL, 'L351-L400')} kind="code">
              protocol.py L351-L400
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Get tool calls and reasoning back as structured fields, which an unset parser leaves inside content"
          >
            Tool calls and reasoning text
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Both parsers are off by default. Without <code>--tool-call-parser</code>, a model&apos;s
            tool call comes back as plain text in <code>content</code>. Set the parser for the
            model family (42 names), or set <code>auto</code>, which
            infers the parser from the chat template, logs its choice, and turns parsing off with a
            warning when it cannot tell{' '}
            <Cite tier={1} href={sglangUrl(FC_PARSER, 'L75-L117')}>
              function_call_parser.py L75-L117
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L209-L238')}>
              engine.py L209-L238
            </Cite>
            . Porting a vLLM launch line, drop <code>--enable-auto-tool-choice</code>: a search of
            v0.5.22&apos;s Python source finds no such flag, and <code>--tool-call-parser</code> is
            the one to set{' '}
            <Cite tier={1} href={sglangUrl(SERVER_ARGS, 'L376-L384')} kind="code">
              server_args.py L376-L384
            </Cite>
            , and check the parser name, because the two engines name parsers differently (
            {VLLM_SERVER_LINK}).
          </Box>
          <Box variant="p">
            <code>tool_choice</code> decides what reaches the prompt. <code>&quot;auto&quot;</code>,
            the default, renders every tool and parses whatever the model emits;{' '}
            <code>&quot;required&quot;</code> or a named function constrains decoding to a tool
            call with a grammar (section 10, Structured Output); <code>&quot;none&quot;</code>{' '}
            leaves the tools out of the prompt altogether{' '}
            <Cite tier={1} href={sglangUrl(SERVING_CHAT, 'L1398-L1460')}>
              serving_chat.py L1398-L1460
            </Cite>
            .
          </Box>
          <Box variant="p">
            With <code>--reasoning-parser</code> set (34 names, or <code>auto</code>), chat
            responses split the think block into <code>message.reasoning_content</code>, streamed as{' '}
            <code>delta.reasoning_content</code>, and <code>content</code> holds only the answer;
            without it the thinking text stays in <code>content</code>. A request opts out with{' '}
            <code>separate_reasoning: false</code>{' '}
            <Cite tier={1} href={sglangUrl(REASONING_NAMES, 'L7-L40')}>
              reasoning_parser_names.py L7-L40
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(PROTOCOL, 'L958-L959')}>
              protocol.py L958-L959
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl('advanced_features/separate_reasoning', 'L99-L186')}>
              SGLang docs: separate reasoning (v0.5.22 source)
            </Cite>
            . A hard cap on thinking tokens needs <code>--enable-strict-thinking</code> plus a
            per-request budget; a <code>thinking_budget</code> passed in{' '}
            <code>chat_template_kwargs</code> is a hint the template may ignore{' '}
            <Cite tier={1} href={sglangDocsSrcUrl('advanced_features/thinking_budget', 'L7-L93')}>
              SGLang docs: thinking budget (v0.5.22 source)
            </Cite>
            .
          </Box>
          <Box variant="p">
            The v0.5.22 release notes list three chat-response behaviours under breaking changes{' '}
            <Cite tier={1} href={RELEASE_NOTES}>
              SGLang v0.5.22 release notes
            </Cite>
            . A response without tool calls omits the <code>tool_calls</code> key, in messages and
            in stream deltas, so test for a non-empty value rather than for the key{' '}
            <Cite tier={1} href={sglangUrl(PROTOCOL, 'L1228-L1239')}>
              protocol.py L1228-L1239
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(PROTOCOL, 'L1316-L1321')}>
              protocol.py L1316-L1321
            </Cite>
            . Every chunk of one streamed completion carries the same <code>created</code>{' '}
            timestamp{' '}
            <Cite tier={1} href={sglangUrl(SERVING_CHAT, 'L1966-L1975')}>
              serving_chat.py L1966-L1975
            </Cite>
            . On the DeepSeek V3.2, V4 and V4.1 encodings, <code>tool_choice: &quot;none&quot;</code>{' '}
            keeps the tool list out of the system message, as on every other chat-template path{' '}
            <Cite tier={1} href={sglangUrl(SERVING_CHAT, 'L1600-L1618')}>
              serving_chat.py L1600-L1618
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know which features each compatibility layer honours before you point an SDK at it"
          >
            Responses, Anthropic and Ollama clients
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <code>/v1/responses</code> answers single calls out of the box. Chaining with{' '}
            <code>previous_response_id</code>, <code>background</code> jobs and{' '}
            <code>{'GET /v1/responses/{id}'}</code> need <code>--enable-response-store</code>, which
            keeps responses in process memory with no expiry or size limit and is unsupported with
            PD (prefill/decode) disaggregation. Without the flag those requests return an error,
            and the default <code>store: true</code> has no effect{' '}
            <Cite tier={1} href={sglangUrl(SERVING_RESP, 'L296-L306')}>
              serving_responses.py L296-L306
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SERVING_RESP, 'L1581-L1586')}>
              L1581-L1586
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SERVING, 'L26-L31')}>
              serving.py L26-L31
            </Cite>
            . vLLM keeps Responses state the same way, opt-in and in memory ({VLLM_SERVER_LINK}).
          </Box>
          <Box variant="p">
            <code>/v1/messages</code> and <code>/v1/messages/count_tokens</code> let Anthropic SDKs
            and agent CLIs such as Claude Code talk to a local model, with streaming, tool use and
            thinking blocks{' '}
            <Cite tier={1} href={sglangDocsSrcUrl('basic_usage/anthropic_api', 'L1-L60')}>
              SGLang docs: Anthropic API (v0.5.22 source)
            </Cite>
            . The handler translates onto the chat path, so it inherits that path&apos;s tool and
            reasoning parsers. <code>thinking.budget_tokens</code> is accepted, logged as not
            enforced, and ignored, and by our reading of the code no Messages field reaches strict
            thinking&apos;s per-request budget, so a hard cap needs the chat or native route{' '}
            <Cite tier={1} href={sglangUrl(ANTHROPIC, 'L565-L640')} kind="code">
              anthropic/serving.py L565-L640
            </Cite>
            . Both engines serve this API.
          </Box>
          <Box variant="p">
            The Ollama routes, <code>/api/chat</code>, <code>/api/generate</code>,{' '}
            <code>/api/tags</code> and <code>/api/show</code>, let the Ollama CLI and Python client
            use an SGLang server for text chat and completion{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L2044-L2091')}>
              http_server.py L2044-L2091
            </Cite>
            . They are thin: messages are reduced to role and content and rendered with the
            tokenizer&apos;s chat template, while <code>images</code>, <code>format</code> and{' '}
            <code>think</code> are accepted and never read{' '}
            <Cite tier={1} href={sglangUrl(OLLAMA, 'L41-L103')} kind="code">
              ollama/serving.py L41-L103
            </Cite>
            . <code>options.seed</code> maps to a <code>seed</code> keyword that{' '}
            <code>SamplingParams</code> does not define, so our reading of the code, not run, is
            that a seeded Ollama request fails rather than being seeded{' '}
            <Cite tier={1} href={sglangUrl(OLLAMA, 'L41-L66')} kind="code">
              ollama/serving.py L41-L66
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SP, 'L117-L160')} kind="code">
              sampling_params.py L117-L160
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Select the adapter you meant, and know when a request for one more adapter waits instead of failing"
          >
            Addressing adapters
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Multi-LoRA serving runs one base model with many small adapters, and each request names
            the one it wants, so a batch can mix adapters and base-model requests. The model is a
            fixed set of GPU slots. Adapters live in CPU memory and are copied into
            one of <code>--max-loras-per-batch</code> preallocated GPU slots when a batch needs
            them, evicting an idle adapter, LRU (least recently used) by default, when no slot is
            free{' '}
            <Cite tier={1} href={sglangUrl(LORA_POOL, 'L782-L860')} kind="code">
              mem_pool.py L782-L860
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(LORA_FIELDS, 'L70-L76')}>
              lora.py L70-L76
            </Cite>
            . The slot buffers are sized once, from slot count, maximum rank and target modules,
            whatever the loaded adapters weigh{' '}
            <Cite tier={1} href={sglangUrl(LORA_POOL, 'L529-L575')} kind="code">
              mem_pool.py L529-L575
            </Cite>
            .
          </Box>
          <Box variant="p">
            The cap is per batch: up to 8 adapters by default, with base-model requests taking one
            slot{' '}
            <Cite tier={1} href={sglangUrl(LORA_FIELDS, 'L66-L69')}>
              lora.py L66-L69
            </Cite>
            . The scheduler admits a waiting request only when its adapter is already running or the
            new set still fits, so a request for a ninth adapter queues until a slot frees, and its
            client sees only added latency{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4296-L4318')}>
              scheduler.py L4296-L4318
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(LORA_MGR, 'L415-L440')}>
              lora_manager.py L415-L440
            </Cite>
            . When skewed traffic leaves one adapter waiting too long,{' '}
            <code>--lora-drain-wait-threshold</code> (seconds; 0 and off by default) drains one
            running adapter to make room{' '}
            <Cite tier={1} href={sglangUrl(LORA_FIELDS, 'L109-L112')}>
              lora.py L109-L112
            </Cite>
            . vLLM defaults to one adapter per batch{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/lora.py', 'L37-L38')}>
              vLLM lora.py L37-L38 (v0.31.0)
            </Cite>{' '}
            ({VLLM_LORA_LINK}).
          </Box>
          <Box variant="p">
            Each adapter gets its own branch of the radix tree, because the adapter id is appended
            to the request&apos;s cache namespace{' '}
            <Cite tier={1} href={sglangUrl(SCHED_BATCH, 'L1130-L1140')}>
              schedule_batch.py L1130-L1140
            </Cite>
            . A shared system prompt is cached once per adapter, so budget prefix-cache capacity per
            adapter, as on vLLM.
          </Box>
          <Box variant="p">
            Adapters load and unload on a live server through <code>/load_lora_adapter</code>,{' '}
            <code>/load_lora_adapter_from_tensors</code> and <code>/unload_lora_adapter</code>,
            which are admin routes{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L1617-L1650')}>
              http_server.py L1617-L1650
            </Cite>
            . Unload drains: new requests stop seeing the adapter at once, and it leaves memory when
            its last in-flight request finishes{' '}
            <Cite tier={1} href={sglangUrl(CONTROL, 'L630-L650')}>
              tokenizer_control_mixin.py L630-L650
            </Cite>
            . A server that starts without <code>--lora-paths</code> and loads adapters later needs{' '}
            <code>--max-lora-rank</code> and <code>--lora-target-modules</code> at start, because
            the slots are sized then{' '}
            <Cite tier={1} href={sglangUrl(LORA_MGR, 'L689-L697')}>
              lora_manager.py L689-L697
            </Cite>
            . Runtime loading needs no environment switch on SGLang; vLLM gates it behind one (
            {VLLM_LORA_LINK}).
          </Box>
          <Box variant="p">
            The default kernel is chunked SGMV (segmented gather matrix-vector multiplication),{' '}
            <code>csgmv</code>. The documentation names two backends, <code>triton</code> and{' '}
            <code>csgmv</code>{' '}
            <Cite
              tier={1}
              href={sglangDocsSrcUrl('advanced_features/lora', 'L26')}
              kind="doc-code-conflict"
            >
              SGLang docs: LoRA (v0.5.22 source)
            </Cite>
            ; v0.5.22&apos;s CLI accepts four, adding <code>torch_native</code> and{' '}
            <code>ascend</code> for Huawei Ascend devices{' '}
            <Cite tier={1} href={sglangUrl(LORA_FIELDS, 'L77-L83')}>
              lora.py L77-L83
            </Cite>
            . LoRA combines with n-gram, EAGLE, EAGLE3, DFlash and DSpark speculation and is refused
            with the other algorithms; the draft runs without the adapter{' '}
            <Cite tier={1} href={sglangUrl(LORA_HOOK, 'L160-L185')}>
              lora_hook.py L160-L185
            </Cite>{' '}
            <Cite
              tier={1}
              href={sglangUrl('python/sglang/srt/model_executor/model_runner.py', 'L821-L822')}
              kind="code"
            >
              model_runner.py L821-L822
            </Cite>
            , so our reading is that acceptance can drop for an adapter that moves the output far
            from the base model.
          </Box>

          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            header={<Header variant="h3">LoRA flags and their v0.5.22 defaults</Header>}
            items={LORA_ROWS}
            columnDefinitions={[
              { id: 'flag', header: 'Flag', cell: (r) => r.flag, minWidth: 190 },
              { id: 'def', header: 'Default', cell: (r) => r.def, minWidth: 120 },
              { id: 'what', header: 'What it sets', cell: (r) => r.what, minWidth: 220 },
            ]}
          />
          <Box variant="small">
            Defaults:{' '}
            <Cite tier={1} href={sglangUrl(LORA_FIELDS, 'L30-L112')}>
              lora.py L30-L112
            </Cite>
            ;{' '}
            <Cite tier={1} href={sglangUrl(LORA_HOOK, 'L25-L33')}>
              lora_hook.py L25-L33
            </Cite>
            .
          </Box>

          <Box variant="p">
            <strong>
              Select an adapter with <code>model: &quot;base:adapter&quot;</code>
            </strong>
            , or with <code>lora_path</code> in <code>extra_body</code>. The chat and completions
            handlers split <code>model</code> at its first colon and take the right side as the
            adapter; a model string without a colon selects no adapter{' '}
            <Cite tier={1} href={sglangUrl(SERVING_BASE, 'L40-L71')}>
              serving_base.py L40-L71
            </Cite>
            . <code>/v1/models</code> lists each loaded adapter by its bare name{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L1926-L1956')}>
              http_server.py L1926-L1956
            </Cite>
            , and sending that bare name runs the base model with no error, because those handlers
            do not check the model name. Client code written for vLLM, where the bare adapter name is
            the model ({VLLM_LORA_LINK}), meets exactly this. On <code>/generate</code>, name the
            adapter in <code>lora_path</code>, per item in a batch{' '}
            <Cite tier={1} href={sglangUrl(IO, 'L277')}>
              io_struct.py L277
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find the runtime call that flushes, pauses, profiles or refits a live server, and the probe that matches your health check"
          >
            Admin and control endpoints
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The admin plane is every route that changes the server rather than asking it for tokens.
            In <code>http_server.py</code>, 43 route handlers carry the admin level{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L881-L1790')} kind="code">
              http_server.py L881-L1790
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(AUTH, 'L21-L26')}>
              auth.py L21-L26
            </Cite>
            , and the Python frontend registers 42 of them on every server; the 43rd, a debug
            dumper route, exists only with <code>DUMPER_SERVER_PORT=reuse</code>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L891-L894')} kind="code">
              http_server.py L891-L894
            </Cite>
            . The ones operators reach for first:
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={ADMIN_ROWS}
            columnDefinitions={[
              { id: 'route', header: 'Route', cell: (r) => r.route, minWidth: 190 },
              { id: 'does', header: 'What it does', cell: (r) => r.does, minWidth: 160 },
              { id: 'watch', header: 'What to know', cell: (r) => r.watch, minWidth: 240 },
            ]}
          />
          <Box variant="p">
            The documentation lists an <code>/update_weights</code> route{' '}
            <Cite
              tier={1}
              href={sglangDocsSrcUrl('basic_usage/native_api', 'L6-L26')}
              kind="doc-code-conflict"
            >
              SGLang docs: native API (v0.5.22 source)
            </Cite>
            ; v0.5.22 has none, and the disk path is <code>/update_weights_from_disk</code>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L1265-L1266')}>
              http_server.py L1265-L1266
            </Cite>
            .
          </Box>
          <Box variant="p">
            Three read routes serve probes and routers. <code>/health</code> and{' '}
            <code>/health_generate</code> share one handler: 503 while the server starts or shuts
            down, otherwise a one-token generation that passes if the engine produces output within
            20 s, set by <code>SGLANG_HEALTH_CHECK_TIMEOUT</code>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L698-L783')}>
              http_server.py L698-L783
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L205-L207')}>
              http_server.py L205-L207
            </Cite>
            . The documentation describes only <code>/health_generate</code> as generating{' '}
            <Cite
              tier={1}
              href={sglangDocsSrcUrl('basic_usage/native_api', 'L108-L110')}
              kind="doc-code-conflict"
            >
              SGLang docs: health check (v0.5.22 source)
            </Cite>
            ; at v0.5.22 both do, and <code>SGLANG_ENABLE_HEALTH_ENDPOINT_GENERATION=false</code>{' '}
            turns <code>/health</code> into a plain liveness check{' '}
            <Cite tier={1} href={sglangUrl(ENVIRON, 'L341')}>
              environ.py L341
            </Cite>
            . <code>/ready</code> is the cheap readiness probe: 200 once the TokenizerManager is
            ready, otherwise 503{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L698-L702')}>
              http_server.py L698-L702
            </Cite>
            . <code>GET /v1/loads</code> reports running and queued requests and token usage per
            data-parallel rank, as JSON or Prometheus text, which is what a load-aware router polls{' '}
            <Cite tier={1} href={sglangUrl(V1_LOADS, 'L96-L130')}>
              v1_loads.py L96-L130
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Choose the key state that keeps weight updates and memory release away from inference clients on your platform"
          >
            Set the admin key your deployment needs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Two optional keys put a server in one of three states, and every admin route follows
            one rule{' '}
            <Cite tier={1} href={sglangUrl(AUTH, 'L79-L151')}>
              auth.py L79-L151
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SERVING, 'L154-L161')}>
              serving.py L154-L161
            </Cite>
            : <strong>open</strong> with no key; <strong>shared</strong> when <code>--api-key</code>{' '}
            alone also opens the admin routes; <strong>split</strong> once{' '}
            <code>--admin-api-key</code> makes admin routes accept that key alone. Paths starting{' '}
            <code>/health</code>, <code>/ready</code> or <code>/metrics</code> need no key in any
            state, and the HiCache storage attach, detach and query routes return 400 on a server
            started without an admin key{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L2180-L2198')} kind="code">
              http_server.py L2180-L2198
            </Cite>
            .
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            header={<Header variant="h3">Who can call what, by key state</Header>}
            items={KEY_ROWS}
            columnDefinitions={[
              { id: 'start', header: 'Server started with', cell: (r) => r.start, minWidth: 150 },
              { id: 'inference', header: 'Inference routes', cell: (r) => r.inference, minWidth: 140 },
              { id: 'admin', header: 'Admin routes', cell: (r) => r.admin, minWidth: 200 },
              { id: 'state', header: 'State', cell: (r) => r.state, minWidth: 80 },
            ]}
          />
          <Box variant="p">
            The bind decides how far open reaches. The server binds 127.0.0.1 by default, so an
            open admin plane is open to the local host{' '}
            <Cite tier={1} href={sglangUrl(SERVING, 'L65-L66')}>
              serving.py L65-L66
            </Cite>
            ; containers pass <code>--host 0.0.0.0</code>, and from then on open means open to the
            network{' '}
            <Cite tier={1} href={AWS_DLC_EKS}>
              AWS Deep Learning Containers: SGLang on EKS (Elastic Kubernetes Service)
            </Cite>
            . vLLM registers its sleep, pause and weight-transfer routes only with{' '}
            <code>VLLM_SERVER_DEV_MODE=1</code> and checks no key on them{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/entrypoints/launchers/api_server/routers.py', 'L34-L37')}
            >
              vLLM routers.py L34-L37 (v0.31.0)
            </Cite>{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/entrypoints/serve/middleware/authenticate.py', 'L11-L62')}
              kind="code"
            >
              vLLM authenticate.py L11-L62 (v0.31.0)
            </Cite>
            ; SGLang registers its admin routes on every server and offers the second key (
            {VLLM_SERVER_LINK}).
          </Box>
          <Box variant="p">
            One read route undoes the split if clients can reach it. <code>/server_info</code> and
            its deprecated <code>/get_server_info</code> sit with the inference routes, and our
            reading of the code, not run, is that their response carries <code>api_key</code> and{' '}
            <code>admin_api_key</code> in plain text, so any client allowed to call inference routes
            can read the admin key. Block both paths at the gateway or ingress for everyone but
            operators.
          </Box>
          <ExpandableSection headerText="Why /server_info carries the keys">
            <Box variant="p">
              The documentation lists <code>/server_info</code> among the endpoints the admin key
              guards{' '}
              <Cite
                tier={1}
                href={sglangDocsSrcUrl('advanced_features/server_arguments', 'L1094-L1095')}
                kind="doc-code-conflict"
              >
                SGLang docs: server arguments (v0.5.22 source)
              </Cite>
              . v0.5.22&apos;s code gives both routes no admin level{' '}
              <Cite tier={1} href={sglangUrl(HTTP, 'L837-L874')} kind="code">
                http_server.py L837-L874
              </Cite>
              , and the response is every resolved server argument plus the launch command{' '}
              <Cite tier={1} href={sglangUrl(COMMON, 'L3640-L3650')} kind="code">
                common.py L3640-L3650
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(SERVER_ARGS, 'L315-L330')} kind="code">
                server_args.py L315-L330
              </Cite>
              , with only watermark secrets redacted{' '}
              <Cite tier={1} href={sglangUrl(WATERMARK, 'L26-L104')} kind="code">
                watermarking/core.py L26-L104
              </Cite>
              . Both keys are fields of that record{' '}
              <Cite tier={1} href={sglangUrl(SERVER_ARGS, 'L508-L549')} kind="code">
                server_args.py L508-L549
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(SERVING, 'L154-L161')} kind="code">
                serving.py L154-L161
              </Cite>
              , so by our reading they are part of the response.
            </Box>
          </ExpandableSection>
          <Box variant="p">
            The platform decides which state you can use, and two serving modes change what the
            keys do at all:
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            header={<Header variant="h3">The key matrix by deployment</Header>}
            items={DEPLOY_ROWS}
            columnDefinitions={[
              { id: 'where', header: 'Deployment', cell: (r) => r.where, minWidth: 160 },
              { id: 'keys', header: 'Keys to set', cell: (r) => r.keys, minWidth: 170 },
              { id: 'why', header: 'Why', cell: (r) => r.why, minWidth: 300 },
            ]}
          />
          <Box variant="p">
            Before the port leaves the host, check the state from a client&apos;s seat. On a split
            server, a <code>POST /flush_cache</code> sent with the inference key returns 401 by the
            code{' '}
            <Cite tier={1} href={sglangUrl(AUTH, 'L128-L141')} kind="code">
              auth.py L128-L141
            </Cite>
            ; a 200 or a 400 means the admin plane answers inference clients, as it does in
            multi-tokenizer mode. Then confirm that <code>/server_info</code> is unreachable from
            the client network, and that every client request names its token limit, since the
            server&apos;s answer to an unset one is 128 tokens on <code>/generate</code>.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
