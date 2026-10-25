import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangTreeUrl } from '../components/Cite';

const SRT = 'python/sglang/srt';
const POLICY = `${SRT}/managers/schedule_policy.py`;
const SCHEDULER = `${SRT}/managers/scheduler.py`;
const BATCH = `${SRT}/managers/schedule_batch.py`;
const SCHED_FIELDS = `${SRT}/arg_groups/fields/schedule.py`;
const OVR = `${SRT}/arg_groups/overrides.py`;
const MOB = `${SRT}/arg_groups/model_override_base.py`;
const HTTP = `${SRT}/entrypoints/http_server.py`;
const SERVING = `${SRT}/arg_groups/fields/serving.py`;
const PREFILL = `${SRT}/disaggregation/prefill.py`;
const DISAGG = `${SRT}/arg_groups/fields/disagg.py`;

const VLLM_TAG = 'v0.31.0';
function vllmUrl(path: string, lines?: string): string {
  const base = `https://github.com/vllm-project/vllm/blob/${VLLM_TAG}/${path}`;
  return lines ? `${base}#${lines}` : base;
}
function vllmTreeUrl(dir: string): string {
  return `https://github.com/vllm-project/vllm/tree/${VLLM_TAG}/${dir}`;
}

const VLLM_ROUTER_FORK = 'https://github.com/vllm-project/router/blob/v0.1.16/README.md#L339';
const AWS_DLC_EKS =
  'https://github.com/aws/deep-learning-containers/blob/23970abd5b8919ea3e1add74692a0d056b2fcbd9/docs/sglang/deployment/eks.md#L8-L55';
const DYNAMO_PYPROJECT = 'https://github.com/ai-dynamo/dynamo/blob/v1.6.0/pyproject.toml#L62-L78';
const LLMD_IMAGES = 'https://github.com/llm-d/llm-d/blob/v1.0.0/guides/recipes/modelserver/components/images';
const NEURON_DOC =
  'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/vllm-neuron/docs/design/vllm/additional-config.html';

const ARXIV_SGLANG = 'https://arxiv.org/abs/2312.07104v2';
const LMSYS_2024_01 = 'https://lmsys.org/blog/2024-01-17-sglang/';
const LMSYS_2024_02 = 'https://lmsys.org/blog/2024-02-05-compressed-fsm/';
const LMSYS_2024_07 = 'https://lmsys.org/blog/2024-07-25-sglang-llama3/';
const LMSYS_2024_09 = 'https://lmsys.org/blog/2024-09-04-sglang-v0-3/';
const LMSYS_2024_12 = 'https://lmsys.org/blog/2024-12-04-sglang-v0-4/';
const LMSYS_2025_08 = 'https://lmsys.org/blog/2025-08-27-gpt-oss/';
const LMSYS_2026_04 = 'https://lmsys.org/blog/2026-04-25-deepseek-v4/';
const LMSYS_2026_08 = 'https://lmsys.org/blog/2026-08-07-hpc-ops-sglang';
const VLLM_BLOG_2024_09 = 'https://vllm.ai/blog/2024-09-05-perf-update';
const SA_INFERENCEMAX = 'https://newsletter.semianalysis.com/p/inferencemax-open-source-inference';
const SA_INFERENCEX_V2 = 'https://newsletter.semianalysis.com/p/inferencex-v2-nvidia-blackwell-vs';
const SA_INFERENCEX_V3 = 'https://newsletter.semianalysis.com/p/agentx-inferencexv3-does-cuda-moat';
const INFERENCEX_REPO =
  'https://github.com/SemiAnalysisAI/InferenceX/tree/a0287f0b3617ad3ce7eebf61b768286547d1c0ca';
const INFERENCEX_DASHBOARD = 'https://inferencex.semianalysis.com/inference';
const ARXIV_INFERENCEBENCH = 'https://arxiv.org/abs/2607.20468v1';
const ARXIV_BENCH360 = 'https://arxiv.org/abs/2511.16682v1';

const V3_LINK = <Link href="../vllm/">vLLM dive, section 3: The V1 Engine Architecture</Link>;
const V4_LINK = <Link href="../vllm/">vLLM dive, section 4: Scheduler &amp; Continuous Batching</Link>;
const V5_LINK = <Link href="../vllm/">vLLM dive, section 5: Paged KV Cache &amp; Block Tables</Link>;
const V6_LINK = <Link href="../vllm/">vLLM dive, section 6: Automatic Prefix Caching</Link>;
const V9_LINK = <Link href="../vllm/">vLLM dive, section 9: Distributed Inference</Link>;
const V10_LINK = <Link href="../vllm/">vLLM dive, section 10: Disaggregated Prefill / Decode</Link>;
const V11_LINK = <Link href="../vllm/">vLLM dive, section 11: Speculative Decoding</Link>;
const V12_LINK = <Link href="../vllm/">vLLM dive, section 12: The OpenAI-Compatible Server</Link>;
const V13_LINK = <Link href="../vllm/">vLLM dive, section 13: LoRA &amp; Multi-Adapter Serving</Link>;
const V16_LINK = (
  <Link href="../vllm/">vLLM dive, section 16: Kubernetes: Production-Stack &amp; Router</Link>
);
const V17_LINK = (
  <Link href="../vllm/">vLLM dive, section 17: Kubernetes: llm-d, KServe &amp; Gateway API</Link>
);
const V20_LINK = <Link href="../vllm/">vLLM dive, section 20: Observability &amp; Benchmarking</Link>;
const V21_LINK = <Link href="../vllm/">vLLM dive, section 21: vLLM on AWS Neuron</Link>;
const V27_LINK = <Link href="../vllm/">vLLM dive, section 27: Operations &amp; Failure Modes</Link>;

/* ------------------------------------------------------------------------ */
/* Diagram: one request through each engine, stage by stage                 */
/* ------------------------------------------------------------------------ */

interface PathRow {
  y: number;
  stage: string;
  status: string;
  same: boolean;
  sg: [string, string];
  vl: [string, string];
  vlOutside?: boolean;
}

const ROW_H = 48;
const STAGE_X = 14;
const STAGE_W = 140;
const SG_X = 168;
const VL_X = 534;
const COL_W = 352;

const PATH_ROWS: PathRow[] = [
  {
    y: 62,
    stage: 'Route',
    status: 'differs',
    same: false,
    sg: ['sgl-model-gateway, in the engine repository', 'Rust; cache_aware routing policy by default'],
    vl: ['Routers from separate projects', 'production-stack, vllm-project/router, llm-d'],
    vlOutside: true,
  },
  {
    y: 124,
    stage: 'HTTP and tokens',
    status: 'detokenizer differs',
    same: false,
    sg: ['Main process: HTTP and TokenizerManager', 'DetokenizerManager in a process of its own'],
    vl: ['API server process', 'HTTP, tokenize, detokenize, stream'],
  },
  {
    y: 186,
    stage: 'Schedule',
    status: 'differs',
    same: false,
    sg: ['A scheduler in every GPU process', 'rank 0 broadcasts; every rank runs the same batch'],
    vl: ['One EngineCore per data-parallel rank', 'sends the step decision to GPU workers'],
  },
  {
    y: 248,
    stage: 'Prefix lookup',
    status: 'index differs',
    same: false,
    sg: ['Radix tree walk', 'page size set by the attention backend'],
    vl: ['Block-hash chain lookup', '16-token blocks by default'],
  },
  {
    y: 310,
    stage: 'Forward pass',
    status: 'same default',
    same: true,
    sg: ['Forward inside each scheduler process', 'overlap on: plans step N+1 while step N runs'],
    vl: ['Forward in separate GPU worker processes', 'async scheduling on: step N+1 while step N runs'],
  },
  {
    y: 406,
    stage: 'PD transfer',
    status: 'differs',
    same: false,
    sg: ['A scheduler mode that always pushes', 'prefill writes KV into pages decode reserved'],
    vl: ['A KV connector plugin', 'reference NixlConnector pulls; push is optional'],
  },
  {
    y: 468,
    stage: 'RL admin routes',
    status: 'differs',
    same: false,
    sg: ['Registered on every Python HTTP server', '--admin-api-key splits them from inference'],
    vl: ['Registered only with VLLM_SERVER_DEV_MODE=1', 'no key check on those routes'],
  },
];

function RequestPathDiagram() {
  const sgMid = SG_X + COL_W / 2;
  const vlMid = VL_X + COL_W / 2;
  const pathRows = PATH_ROWS.slice(0, 5);
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 560"
        role="img"
        aria-labelledby="vsvllm-path-title"
        style={{ width: '100%', minWidth: 700, height: 'auto' }}
      >
        <title id="vsvllm-path-title">
          One request through SGLang v0.5.22 and vLLM v0.31.0, stage by stage. By default both
          engines keep HTTP and tokenization off the GPU-driving process, and both plan step N+1 while step N
          runs on the GPU. They split the rest differently: SGLang runs a scheduler in every GPU
          process and walks a radix tree for cached prefixes, while vLLM runs one EngineCore
          scheduler per data-parallel rank and looks up a chain of block hashes. Beside the
          request path, SGLang&apos;s gateway, PD (prefill/decode) control plane and RL admin
          routes ship in the engine repository and are on or available by default; vLLM&apos;s
          routers come from separate projects, its PD is a KV connector plugin, and its RL routes
          appear only in development mode.
        </title>
        <style>{`
          .vsvllm-path-stage-same { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .vsvllm-path-stage-diff { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .vsvllm-path-sg { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .vsvllm-path-vl { fill: #f4f4f4; stroke: #414d5c; stroke-width: 1.5; }
          .vsvllm-path-out { fill: #ffffff; stroke: #879596; stroke-width: 1.5; stroke-dasharray: 6 4; }
          .vsvllm-path-in { fill: #ffffff; stroke: #414d5c; stroke-width: 1.5; }
          .vsvllm-path-hsg { fill: #0972d3; }
          .vsvllm-path-hvl { fill: #414d5c; }
          .vsvllm-path-ht { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
          .vsvllm-path-hstage { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .vsvllm-path-st { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .vsvllm-path-ss-same { fill: #024a07; font: 11px sans-serif; text-anchor: middle; }
          .vsvllm-path-ss-diff { fill: #5c4700; font: 11px sans-serif; text-anchor: middle; }
          .vsvllm-path-ct { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .vsvllm-path-cs { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .vsvllm-path-div { stroke: #d1d5db; stroke-width: 1.5; stroke-dasharray: 5 4; }
          .vsvllm-path-dl { fill: #414d5c; font: 600 11px sans-serif; text-anchor: start; }
          .vsvllm-path-lg { fill: #414d5c; font: 11px sans-serif; text-anchor: start; }
          .vsvllm-path-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
        `}</style>
        <defs>
          <marker
            id="vsvllm-path-ah"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#5f6b7a" />
          </marker>
        </defs>

        <rect x={0} y={0} width={900} height={560} rx={8} fill="#ffffff" />

        {/* Column headers */}
        <text x={STAGE_X + STAGE_W / 2} y={36} className="vsvllm-path-hstage">
          Stage
        </text>
        <rect x={SG_X} y={14} width={COL_W} height={34} rx={6} className="vsvllm-path-hsg" />
        <text x={sgMid} y={36} className="vsvllm-path-ht">
          SGLang v0.5.22
        </text>
        <rect x={VL_X} y={14} width={COL_W} height={34} rx={6} className="vsvllm-path-hvl" />
        <text x={vlMid} y={36} className="vsvllm-path-ht">
          vLLM v0.31.0
        </text>

        {/* Arrows down the request path in each column */}
        {[48, ...pathRows.slice(0, 4).map((r) => r.y + ROW_H)].map((y0) => (
          <g key={`arr-${y0}`}>
            <line x1={sgMid} y1={y0} x2={sgMid} y2={y0 + 13} className="vsvllm-path-arr" markerEnd="url(#vsvllm-path-ah)" />
            <line x1={vlMid} y1={y0} x2={vlMid} y2={y0 + 13} className="vsvllm-path-arr" markerEnd="url(#vsvllm-path-ah)" />
          </g>
        ))}

        {/* Divider between the request path and the pieces beside it */}
        <line x1={14} y1={376} x2={886} y2={376} className="vsvllm-path-div" />
        <text x={14} y={395} className="vsvllm-path-dl">
          Beside the request path
        </text>

        {PATH_ROWS.map((r) => (
          <g key={r.stage}>
            <rect
              x={STAGE_X}
              y={r.y}
              width={STAGE_W}
              height={ROW_H}
              rx={6}
              className={r.same ? 'vsvllm-path-stage-same' : 'vsvllm-path-stage-diff'}
            />
            <text x={STAGE_X + STAGE_W / 2} y={r.y + 20} className="vsvllm-path-st">
              {r.stage}
            </text>
            <text
              x={STAGE_X + STAGE_W / 2}
              y={r.y + 37}
              className={r.same ? 'vsvllm-path-ss-same' : 'vsvllm-path-ss-diff'}
            >
              {r.status}
            </text>

            <rect x={SG_X} y={r.y} width={COL_W} height={ROW_H} rx={6} className="vsvllm-path-sg" />
            <text x={sgMid} y={r.y + 20} className="vsvllm-path-ct">
              {r.sg[0]}
            </text>
            <text x={sgMid} y={r.y + 37} className="vsvllm-path-cs">
              {r.sg[1]}
            </text>

            <rect
              x={VL_X}
              y={r.y}
              width={COL_W}
              height={ROW_H}
              rx={6}
              className={r.vlOutside ? 'vsvllm-path-out' : 'vsvllm-path-vl'}
            />
            <text x={vlMid} y={r.y + 20} className="vsvllm-path-ct">
              {r.vl[0]}
            </text>
            <text x={vlMid} y={r.y + 37} className="vsvllm-path-cs">
              {r.vl[1]}
            </text>
          </g>
        ))}

        {/* Legend */}
        <rect x={14} y={534} width={14} height={12} rx={2} className="vsvllm-path-stage-same" />
        <text x={34} y={545} className="vsvllm-path-lg">
          same default in both
        </text>
        <rect x={174} y={534} width={14} height={12} rx={2} className="vsvllm-path-stage-diff" />
        <text x={194} y={545} className="vsvllm-path-lg">
          placement or default differs
        </text>
        <rect x={390} y={534} width={14} height={12} rx={2} className="vsvllm-path-out" />
        <text x={410} y={545} className="vsvllm-path-lg">
          outside the engine repository
        </text>
        <rect x={606} y={534} width={14} height={12} rx={2} className="vsvllm-path-in" />
        <text x={626} y={545} className="vsvllm-path-lg">
          inside the engine repository
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* The design table                                                         */
/* ------------------------------------------------------------------------ */

interface DiffRow {
  id: string;
  axis: string;
  sglang: ReactNode;
  vllm: ReactNode;
  changes: ReactNode;
  where: ReactNode;
}

const DIFF_ROWS: DiffRow[] = [
  {
    id: 'step',
    axis: 'Step composition and admission',
    sglang: (
      <>
        Prefill-first: a prefill step runs whenever one can be formed and decode runs in steps of
        its own; <code>--enable-mixed-chunk</code> (off) mixes them{' '}
        <Cite tier={1} href={sglangUrl(SCHEDULER, 'L3766-L3870')} kind="code">
          scheduler.py L3766-L3870
        </Cite>
        . A new request is charged its uncached prompt plus up to 4096 output tokens{' '}
        <Cite tier={1} href={sglangUrl(POLICY, 'L1336-L1360')}>
          schedule_policy.py L1336-L1360
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(POLICY, 'L85-L87')}>
          schedule_policy.py L85-L87
        </Cite>
        ; retraction, SGLang&apos;s name for preemption, re-queues the requests with the fewest
        generated tokens{' '}
        <Cite tier={1} href={sglangUrl(BATCH, 'L3298-L3418')}>
          schedule_batch.py L3298-L3418
        </Cite>
        .
      </>
    ),
    vllm: (
      <>
        One token budget per step, shared by decodes and prefill chunks{' '}
        <Cite tier={1} href={vllmUrl('vllm/engine/arg_utils.py', 'L2858-L2887')}>
          arg_utils.py L2858-L2887
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L582-L888')}>
          scheduler.py L582-L888
        </Cite>
        . Admits on prompt fit and grows blocks step by step{' '}
        <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_manager.py', 'L519-L541')}>
          kv_cache_manager.py L519-L541
        </Cite>
        ; under FCFS, preemption recomputes the most recently added request{' '}
        <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L765-L803')}>
          scheduler.py L765-L803
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L1538-L1581')}>
          scheduler.py L1538-L1581
        </Cite>
        .
      </>
    ),
    changes: (
      <>
        ITL (inter-token latency) spikes under prefill load look different, and{' '}
        <code>--enable-mixed-chunk</code> is the closer match to vLLM&apos;s default. SGLang
        protects long generations where vLLM protects early arrivals: watch{' '}
        <code>sglang:num_retracted_requests_total</code> where you watched{' '}
        <code>vllm:num_preemptions</code>.
      </>
    ),
    where: <>Section 4, The Scheduler; {V4_LINK}</>,
  },
  {
    id: 'reuse',
    axis: 'Prefix reuse granularity, by GPU',
    sglang: (
      <>
        For a dense Llama-style model at defaults: to the exact token on H100 (FlashAttention 3,{' '}
        <code>fa3</code>, page 1) and in 64-token pages on B200 (<code>trtllm_mha</code>){' '}
        <Cite tier={1} href={sglangUrl(MOB, 'L293-L324')}>
          model_override_base.py L293-L324
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(OVR, 'L1125-L1137')}>
          overrides.py L1125-L1137
        </Cite>
        . On B200 the default leaves <code>trtllm_mha</code> and 64-token pages for{' '}
        <code>flashinfer</code> at page size 1, unless you set one, when speculation is on with{' '}
        <code>--speculative-eagle-topk</code> above 1, and also when it is on with that flag unset{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/utils/common.py`, 'L4014-L4020')}>
          utils/common.py L4014-L4020
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(MOB, 'L303-L322')} kind="code">
          model_override_base.py L303-L322
        </Cite>
        . FlashMLA models use 64-token pages{' '}
        <Cite tier={1} href={sglangUrl(OVR, 'L1085-L1152')}>
          overrides.py L1085-L1152
        </Cite>
        .
      </>
    ),
    vllm: (
      <>
        16-token blocks on both GPUs{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L333-L334')}>
          cache.py L333-L334
        </Cite>
        ; for a single KV-cache group the hash unit equals the block size{' '}
        <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L760-L765')}>
          kv_cache_utils.py L760-L765
        </Cite>
        .
      </>
    ),
    changes: (
      <>
        On H100 SGLang reuses a shared prefix to the token and vLLM to its last full 16-token
        block; on B200 at defaults the comparison flips. On AWS that is the move from P5 (H100) to
        P6 (B200 or B300): the same Llama deployment goes from token-exact reuse to 64-token pages
        with no attention or page-size flag, when speculative decoding is off, or on with an
        explicit <code>--speculative-eagle-topk 1</code> and <code>--speculative-num-steps</code>{' '}
        set, by our reading of the default chain (section 21, EC2 Instances, Images and
        GPU-Dependent Behaviour).
      </>
    ),
    where: (
      <>
        Section 5, RadixAttention and the Radix Cache; section 8, Attention Backends and Kernels;{' '}
        {V5_LINK}; {V6_LINK}
      </>
    ),
  },
  {
    id: 'grammar',
    axis: 'Structured output',
    sglang: (
      <>
        An unset <code>--grammar-backend</code> resolves to XGrammar for every request{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/serving_hook.py`, 'L232-L237')}>
          serving_hook.py L232-L237
        </Cite>
        ; a schema XGrammar rejects returns 400, and no request field picks another backend.
        Jump-forward decoding is dormant at v0.5.22{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/constrained/outlines_backend.py`, 'L148-L161')} kind="code">
          outlines_backend.py L148-L161
        </Cite>
        .
      </>
    ),
    vllm: (
      <>
        <code>auto</code>: each request tries xgrammar and falls back to guidance or outlines{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/structured_outputs.py', 'L21')}>
          structured_outputs.py L21
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('vllm/sampling_params.py', 'L1297-L1341')}>
          sampling_params.py L1297-L1341
        </Cite>
        .
      </>
    ),
    changes: (
      <>
        Both mask with XGrammar first. An unusual schema can pass on vLLM and fail on SGLang until
        it runs with <code>--grammar-backend llguidance</code>, and regex and EBNF (Extended
        Backus-Naur Form) constraints ride in different request fields.
      </>
    ),
    where: <>Section 10, Structured Output; {V12_LINK}</>,
  },
  {
    id: 'spec',
    axis: 'Speculative decoding defaults',
    sglang: (
      <>
        Off by default{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/fields/spec.py`, 'L31-L34')}>
          spec.py L31-L34
        </Cite>
        . EAGLE with a <code>LlamaForCausalLM</code> target and no step flags drafts a tree: 5
        steps, top-k 4, 8 verified nodes{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/speculative_hook.py`, 'L1340-L1371')}>
          speculative_hook.py L1340-L1371
        </Cite>
        .
      </>
    ),
    vllm: (
      <>
        Off by default{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L391')}>
          vllm.py L391
        </Cite>
        ; K-token chains, with no token-tree option found in its speculative config or attention
        backends{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L455-L513')}>
          speculative.py L455-L513
        </Cite>
        .
      </>
    ),
    changes: (
      <>
        Moving an EAGLE deployment changes the verify shape, tree against chain. Compare at matched
        settings, with <code>--speculative-eagle-topk 1</code> and{' '}
        <code>--speculative-num-steps</code> set on SGLang.
      </>
    ),
    where: <>Section 11, Speculative Decoding; {V11_LINK}</>,
  },
  {
    id: 'dp-ep',
    axis: 'DP attention and EP (expert parallelism)',
    sglang: (
      <>
        Attention DP is a width inside the TP (tensor parallelism) group,{' '}
        <code>--attn-dp-size</code>, and EP spans the TP group{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/runtime_context.py`, 'L73-L87')}>
          runtime_context.py L73-L87
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/fields/exec_.py`, 'L773-L806')}>
          exec_.py L773-L806
        </Cite>
        .
      </>
    ),
    vllm: (
      <>
        <code>--data-parallel-size</code> replicas plus <code>--enable-expert-parallel</code>, with
        MoE (mixture of experts) layers sharded over TP x PCP (prefill context parallelism) x DP{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/parallel.py', 'L134-L136')}>
          parallel.py L134-L136
        </Cite>
        .
      </>
    ),
    changes: (
      <>
        The same 8-GPU layout is <code>--tp 8 --attn-dp-size 8 --ep 8</code> on SGLang and{' '}
        <code>-dp 8 -tp 1 --enable-expert-parallel</code> on vLLM. Count GPUs first, then map
        flags.
      </>
    ),
    where: <>Section 14, Parallelism: TP, DP Attention and EP; {V9_LINK}</>,
  },
  {
    id: 'pd',
    axis: 'PD direction and control plane',
    sglang: (
      <>
        A scheduler mode, <code>--disaggregation-mode prefill</code> or <code>decode</code>, with
        the transfer backend set by one flag, Mooncake by default{' '}
        <Cite tier={1} href={sglangUrl(DISAGG, 'L65-L71')}>
          disagg.py L65-L71
        </Cite>
        . Prefill always pushes KV into pages decode reserved, and the gateway sends both legs at
        once{' '}
        <Cite tier={1} href={sglangUrl('sgl-model-gateway/src/routers/http/pd_router.rs', 'L701-L730')}>
          pd_router.rs L701-L730
        </Cite>
        . Under the default <code>early</code> policy, with{' '}
        <code>--optimistic-prefill-attempts</code> at its default 0, prefill waits for
        decode&apos;s page reservation, so the handshake is done before prefill finishes{' '}
        <Cite tier={1} href={sglangUrl(PREFILL, 'L462-L537')}>
          prefill.py L462-L537
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(DISAGG, 'L122-L124')}>
          disagg.py L122-L124
        </Cite>
        .
      </>
    ),
    vllm: (
      <>
        A KV connector chosen by <code>--kv-transfer-config</code>: the reference{' '}
        <code>NixlConnector</code> pulls, vLLM&apos;s reference pull proxy runs prefill first, and{' '}
        <code>NixlPushConnector</code> pushes{' '}
        <Cite tier={1} href={vllmUrl('vllm/distributed/kv_transfer/kv_connector/v1/nixl/connector.py', 'L9-L12')}>
          nixl/connector.py L9-L12
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('tests/v1/kv_connector/nixl_integration/toy_proxy_server.py', 'L213-L241')}>
          toy_proxy_server.py L213-L241
        </Cite>
        .
      </>
    ),
    changes: (
      <>
        SGLang gives PD from one project, and decode capacity gates prefill admission. vLLM offers
        a wider connector choice and takes pairing from a proxy, llm-d or Dynamo.
      </>
    ),
    where: <>Section 15, PD Disaggregation; {V10_LINK}</>,
  },
  {
    id: 'router',
    axis: 'Router',
    sglang: (
      <>
        A first-party Rust gateway, <code>sgl-model-gateway</code>, in the engine repository, with{' '}
        <code>cache_aware</code> as its default policy{' '}
        <Cite tier={1} href={sglangUrl('sgl-model-gateway/src/main.rs', 'L150-L151')}>
          main.rs L150-L151
        </Cite>
        ; PD pairing and dual dispatch are built in.
      </>
    ),
    vllm: (
      <>
        No router in the engine repository: production-stack&apos;s router, llm-d, and{' '}
        <code>vllm-project/router</code>, a fork of the SGLang gateway{' '}
        <Cite tier={1} href={VLLM_ROUTER_FORK}>
          vllm-project/router v0.1.16 README L339
        </Cite>
        .
      </>
    ),
    changes: (
      <>
        SGLang&apos;s default install routes cache-aware; vLLM&apos;s common Kubernetes router
        routes round-robin until a cache-aware policy is chosen{' '}
        <Cite
          tier={1}
          href="https://github.com/vllm-project/production-stack/blob/vllm-stack-0.1.13/helm/values.yaml#L550"
        >
          production-stack values.yaml L550
        </Cite>
        .
      </>
    ),
    where: (
      <>
        Section 17, The Model Gateway; {V16_LINK}; {V17_LINK}
      </>
    ),
  },
  {
    id: 'lora',
    axis: 'LoRA (low-rank adaptation) addressing',
    sglang: (
      <>
        <code>model: &quot;base:adapter&quot;</code>; a bare adapter name runs the base model with
        no error{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/entrypoints/openai/serving_base.py`, 'L40-L71')}>
          serving_base.py L40-L71
        </Cite>
        . Up to 8 adapters per batch, base model included{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/fields/lora.py`, 'L66-L69')}>
          lora.py L66-L69
        </Cite>
        .
      </>
    ),
    vllm: (
      <>
        The adapter name is the <code>model</code>; one adapter per batch by default{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/lora.py', 'L37')}>
          lora.py L37
        </Cite>
        .
      </>
    ),
    changes: (
      <>
        Client code written for vLLM, <code>model=&quot;sql-lora&quot;</code>, runs the base model
        on SGLang without an error: the likeliest silent porting bug.
      </>
    ),
    where: <>Section 12, Talking to SGLang: APIs, LoRA and the Admin Plane; {V13_LINK}</>,
  },
  {
    id: 'api',
    axis: 'API surfaces',
    sglang: (
      <>
        Always-on native <code>/generate</code>, text or <code>input_ids</code>{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L911-L975')}>
          http_server.py L911-L975
        </Cite>
        ; OpenAI routes; Anthropic <code>/v1/messages</code>; Ollama <code>/api/chat</code> and{' '}
        <code>/api/generate</code>{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L2064-L2112')}>
          http_server.py L2064-L2112
        </Cite>
        ; SageMaker <code>/ping</code> and <code>/invocations</code>{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L2123-L2139')}>
          http_server.py L2123-L2139
        </Cite>
        .
      </>
    ),
    vllm: (
      <>
        OpenAI routes; Anthropic <code>/v1/messages</code>{' '}
        <Cite tier={1} href={vllmUrl('vllm/entrypoints/anthropic/api_router.py', 'L52')}>
          anthropic/api_router.py L52
        </Cite>
        ; Cohere <code>/cohere/v2/chat</code>{' '}
        <Cite tier={1} href={vllmUrl('vllm/entrypoints/cohere/api_router.py', 'L116-L117')}>
          cohere/api_router.py L116-L117
        </Cite>
        ; the SageMaker router on every server{' '}
        <Cite tier={1} href={vllmUrl('vllm/entrypoints/launchers/api_server/routers.py', 'L28-L32')}>
          routers.py L28-L32
        </Cite>
        ; a tokens-only generate route in scale-out or render modes only{' '}
        <Cite tier={1} href={vllmUrl('vllm/entrypoints/scale_out/factories.py', 'L65-L94')}>
          scale_out/factories.py L65-L94
        </Cite>
        .
      </>
    ),
    changes: (
      <>
        OpenAI, Anthropic and SageMaker clients work against both. Ollama clients and text-in{' '}
        <code>/generate</code> are SGLang-only; Cohere chat is vLLM-only.
      </>
    ),
    where: <>Section 12, Talking to SGLang: APIs, LoRA and the Admin Plane; {V12_LINK}</>,
  },
  {
    id: 'metrics',
    axis: 'Metrics endpoint',
    sglang: (
      <>
        <code>/metrics</code> mounts only with <code>--enable-metrics</code>, off by default{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/fields/observability.py`, 'L70')}>
          observability.py L70
        </Cite>
        .
      </>
    ),
    vllm: (
      <>
        <code>/metrics</code> on every server{' '}
        <Cite tier={1} href={vllmUrl('vllm/entrypoints/launchers/api_server/routers.py', 'L18-L20')}>
          routers.py L18-L20
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('vllm/entrypoints/serve/instrumentator/metrics.py', 'L56-L79')}>
          instrumentator/metrics.py L56-L79
        </Cite>
        .
      </>
    ),
    changes: <>A Prometheus scrape config copied from vLLM finds nothing on a default SGLang server.</>,
    where: <>Section 4, The Scheduler; {V20_LINK}</>,
  },
  {
    id: 'rl',
    axis: 'RL and weight-sync routes',
    sglang: (
      <>
        Weight update, memory release, pause, flush and LoRA routes on every Python HTTP server,
        split from inference by an optional <code>--admin-api-key</code>{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/utils/auth.py`, 'L79-L151')}>
          auth.py L79-L151
        </Cite>
        . With neither <code>--api-key</code> nor <code>--admin-api-key</code> set they accept any
        client that can reach the port, the three HiCache storage routes excepted{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L1106-L1173')}>
          http_server.py L1106-L1173
        </Cite>
        : localhost at the default 127.0.0.1 bind{' '}
        <Cite tier={1} href={sglangUrl(SERVING, 'L65')}>
          serving.py L65
        </Cite>
        , the network once a container passes <code>--host 0.0.0.0</code>{' '}
        <Cite tier={1} href={AWS_DLC_EKS}>
          AWS Deep Learning Containers: SGLang on EKS
        </Cite>
        .
      </>
    ),
    vllm: (
      <>
        Sleep, wake-up, pause, <code>collective_rpc</code> and weight-transfer routes only with{' '}
        <code>VLLM_SERVER_DEV_MODE=1</code> (default 0), with no key check{' '}
        <Cite tier={1} href={vllmUrl('vllm/entrypoints/launchers/api_server/routers.py', 'L34-L37')}>
          routers.py L34-L37
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L1453')}>
          envs.py L1453
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('vllm/entrypoints/serve/middleware/authenticate.py', 'L11-L62')} kind="code">
          serve/middleware/authenticate.py L11-L62
        </Cite>
        .
      </>
    ),
    changes: (
      <>
        Both expose what an RL trainer needs. SGLang ships the routes on,
        so a production server needs <code>--admin-api-key</code> or network isolation.
      </>
    ),
    where: (
      <>
        Section 12, Talking to SGLang: APIs, LoRA and the Admin Plane; section 13, SGLang as an RL Rollout Engine;{' '}
        {V12_LINK}
      </>
    ),
  },
  {
    id: 'neuron',
    axis: 'AWS Trainium and Inferentia',
    sglang: (
      <>
        No Neuron backend at v0.5.22; the README lists AWS Trainium under integrations in progress{' '}
        <Cite tier={1} href={sglangUrl('README.md', 'L58')}>
          README.md L58
        </Cite>
        .
      </>
    ),
    vllm: <>A released Neuron plugin.</>,
    changes: <>On AWS, SGLang is a GPU choice; to serve on Trainium or Inferentia now, use vLLM with its Neuron plugin.</>,
    where: <>Section 19, SGLang on SageMaker AI and HyperPod; {V21_LINK}</>,
  },
];

/* ------------------------------------------------------------------------ */
/* Benchmark records                                                        */
/* ------------------------------------------------------------------------ */

interface BenchProps {
  header: string;
  source: ReactNode;
  versions: ReactNode;
  setup: ReactNode;
  result: ReactNode;
  transfer: ReactNode;
}

function Bench({ header, source, versions, setup, result, transfer }: BenchProps) {
  return (
    <ExpandableSection headerText={header}>
      <SpaceBetween size="xs">
        <Box variant="p">
          <strong>Source:</strong> {source}
        </Box>
        <Box variant="p">
          <strong>Versions:</strong> {versions}
        </Box>
        <Box variant="p">
          <strong>Hardware, workload and conditions:</strong> {setup}
        </Box>
        <Box variant="p">
          <strong>Stated result:</strong> {result}
        </Box>
        <Box variant="p">
          <strong>What transfers to your versions:</strong> {transfer}
        </Box>
      </SpaceBetween>
    </ExpandableSection>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function SglangVsVllm() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Know which differences change behaviour on your workload, which ones are gone, and why no published benchmark answers the question for your versions (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            23. SGLang and vLLM: what differs, what converged, and how to read the benchmarks
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A team that runs vLLM and is weighing SGLang has three things to separate: differences
            that change what its workload does, differences that have since closed, and benchmark
            numbers measured on versions neither engine ships today. This section compares SGLang
            v0.5.22 with vLLM v0.31.0, with vLLM read at commit <code>db9527a4</code>, and ends
            with the checklist for moving a vLLM launch line and its clients.
          </Box>
          <Box variant="p">
            Start with the convergence. Both engines page the KV (key-value) cache{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/mem_cache/allocator/paged.py`, 'L136')}>
              paged.py L136
            </Cite>{' '}
            ({V5_LINK}), cache prefixes by default{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/mem_cache/registry.py`, 'L83-L146')}>
              registry.py L83-L146
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L142')}>
              vLLM cache.py L142
            </Cite>
            , overlap CPU and GPU work by default{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L1974-L2040')}>
              scheduler.py L1974-L2040
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L1576-L1635')}>
              vLLM vllm.py L1576-L1635
            </Cite>
            , queue requests first-come-first-served (FCFS){' '}
            <Cite tier={1} href={sglangUrl(SCHED_FIELDS, 'L82-L98')}>
              schedule.py L82-L98
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/scheduler.py', 'L160')}>
              vLLM scheduler.py L160
            </Cite>
            , recompute on preemption, outside the decode mode of SGLang&apos;s PD (prefill/decode)
            disaggregation{' '}
            <Cite tier={1} href={sglangUrl(BATCH, 'L3298-L3418')}>
              schedule_batch.py L3298-L3418
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L1538-L1581')}>
              vLLM scheduler.py L1538-L1581
            </Cite>
            , and, on NVIDIA, run the same kernel projects, FlashInfer as released and
            FlashAttention through each project&apos;s own fork{' '}
            <Cite tier={1} href={sglangUrl('python/pyproject.toml', 'L41-L88')}>
              pyproject.toml L41-L88
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/kernels/aot/CMakeLists.txt', 'L83-L89')}>
              kernels/aot/CMakeLists.txt L83-L89
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('requirements/cuda.txt', 'L17-L18')}>
              vLLM requirements/cuda.txt L17-L18
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('cmake/external_projects/vllm_flash_attn.cmake', 'L41-L42')}>
              vLLM vllm_flash_attn.cmake L41-L42
            </Cite>
            . So the often-quoted &quot;SGLang LPM against vLLM FCFS&quot; compares a non-default
            SGLang mode, LPM (longest prefix match) queue ordering, with vLLM&apos;s default.
          </Box>
          <Box variant="p">
            Our reading of the two codebases: they are the same engine class with different
            defaults at the edges, and SGLang puts more of the fleet in one repository. The gateway,
            the PD control plane and the RL (reinforcement learning) admin routes ship with the
            engine, where vLLM leaves
            them to separate projects, a connector plugin or a development switch. A feature list
            therefore mostly finds parity; a configuration comparison finds the differences.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See which stages of a request split the same work differently, which converged, and which pieces arrive with the engine instead of from a separate project"
          >
            One request through each engine
          </Header>
        }
      >
        <SpaceBetween size="m">
          <RequestPathDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. Stage placement from each engine&apos;s code at the pinned
            versions; the facts behind each cell are cited in the paragraph below and in the table
            that follows.
          </Box>
          <Box variant="p">
            SGLang runs HTTP and the tokenizer in the main process, a scheduler in every GPU
            process with rank 0 receiving and broadcasting, and detokenization in a process of its
            own{' '}
            <Cite
              tier={1}
              href={sglangUrl(`${SRT}/managers/scheduler_components/request_receiver.py`, 'L162-L216')}
            >
              request_receiver.py L162-L216
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/managers/detokenizer_manager.py`, 'L123-L135')}>
              detokenizer_manager.py L123-L135
            </Cite>
            , so within a TP (tensor parallelism) group only the new requests cross the process
            boundary and every GPU
            process makes the scheduling decision itself. vLLM schedules once per DP (data
            parallelism) rank in EngineCore and sends the decision to separate GPU workers, with
            HTTP, tokenization and detokenization in its API server process{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/engine/core.py', 'L640-L641')}>
              vLLM core.py L640-L641
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/executor/multiproc_executor.py', 'L340-L351')}>
              vLLM multiproc_executor.py L340-L351
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/engine/core_client.py', 'L705-L706')}>
              vLLM core_client.py L705-L706
            </Cite>{' '}
            ({V3_LINK}). Both identify a cached prefix by everything before it: SGLang walks a
            radix tree of variable-length token runs and evicts whole leaves{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/mem_cache/radix_cache.py`, 'L552-L580')}>
              radix_cache.py L552-L580
            </Cite>
            , vLLM follows a chain of fixed-size block hashes and evicts block by block{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L684-L714')}>
              vLLM kv_cache_utils.py L684-L714
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/block_pool.py', 'L684-L700')}>
              vLLM block_pool.py L684-L700
            </Cite>
            . Section 3, The SGLang Runtime, and section 5, RadixAttention and the Radix Cache,
            cover the SGLang side.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find the rows that change behaviour on your workload, each with the section of this dive and of the vLLM dive that covers its side"
          >
            The differences that change a decision
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each of these twelve rows changes what a reader types, chooses or watches. Each row
            states the SGLang default at v0.5.22, the vLLM default at v0.31.0, and what the gap
            does to a workload.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={DIFF_ROWS}
            columnDefinitions={[
              { id: 'axis', header: 'Axis', cell: (r: DiffRow) => <strong>{r.axis}</strong>, minWidth: 140 },
              { id: 'sglang', header: 'SGLang v0.5.22', cell: (r: DiffRow) => r.sglang, minWidth: 260 },
              { id: 'vllm', header: 'vLLM v0.31.0', cell: (r: DiffRow) => r.vllm, minWidth: 220 },
              { id: 'changes', header: 'What it changes for you', cell: (r: DiffRow) => r.changes, minWidth: 220 },
              { id: 'where', header: 'Covered in', cell: (r: DiffRow) => r.where, minWidth: 180 },
            ]}
          />
          <ExpandableSection headerText="What else converged: shared code, one router origin, the PD bootstrap port, API dialects and the large-scale vocabulary">
            <ul>
              <li>
                <strong>Code moves in both directions.</strong> vLLM v0.31.0 carries SGLang&apos;s
                Triton decode and prefill attention kernels, credited in their headers{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/attention/ops/triton_decode_attention.py', 'L4-L14')}>
                  vLLM triton_decode_attention.py L4-L14
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/attention/ops/triton_prefill_attention.py', 'L4-L5')}>
                  vLLM triton_prefill_attention.py L4-L5
                </Cite>
                , and a vendored directory of SGLang CPU kernels{' '}
                <Cite tier={1} href={vllmTreeUrl('csrc/cpu/sgl-kernels')}>
                  vLLM csrc/cpu/sgl-kernels
                </Cite>
                . In SGLang v0.5.22, 80 files under <code>python/sglang/srt</code> carry the header
                &quot;Adapted from https://github.com/vllm-project/vllm&quot;, and more credit vLLM
                in other wording, by our search of the tag{' '}
                <Cite tier={1} href={sglangTreeUrl(SRT)} kind="code">
                  python/sglang/srt at v0.5.22
                </Cite>
                . The headers establish provenance only, so treat &quot;SGLang&apos;s
                kernels against vLLM&apos;s kernels&quot; as a weak axis.
              </li>
              <li>
                <strong>One origin for the cache-aware Rust routers.</strong>{' '}
                <code>vllm-project/router</code> describes itself as a fork of SGLang Model Gateway{' '}
                <Cite tier={1} href={VLLM_ROUTER_FORK}>
                  vllm-project/router v0.1.16 README L339
                </Cite>
                . Cache-aware routing by prompt-text history is common to both ecosystems; SGLang
                ships it with the engine and makes it the default.
              </li>
              <li>
                <strong>A shared PD control-plane idea.</strong> vLLM&apos;s Mooncake connector runs
                a prefill-side bootstrap server on <code>VLLM_MOONCAKE_BOOTSTRAP_PORT</code>,
                default 8998{' '}
                <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L237')}>
                  vLLM envs.py L237
                </Cite>
                , the pattern and port SGLang&apos;s bootstrap server uses (section 15, PD
                Disaggregation). vLLM can also push, as SGLang always does; the differences left are
                the reference connector&apos;s pull and where PD lives, a scheduler mode or a
                connector plugin.
              </li>
              <li>
                <strong>Opt-in Rust frontends in both.</strong> Each takes over the API server,
                tokenization and detokenization. SGLang&apos;s runs inside the rank-0 scheduler
                process{' '}
                <Cite tier={1} href={sglangUrl(`${SRT}/entrypoints/engine.py`, 'L1291-L1312')}>
                  engine.py L1291-L1312
                </Cite>
                ; vLLM&apos;s takes the place of its API server process and still reaches the engine
                over ZMQ (ZeroMQ){' '}
                <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L1441-L1443')}>
                  vLLM envs.py L1441-L1443
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('rust/src/text/src/lib.rs', 'L4-L8')}>
                  vLLM rust/src/text/src/lib.rs L4-L8
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('rust/README.md', 'L3')}>
                  vLLM rust/README.md L3
                </Cite>
                .
              </li>
              <li>
                <strong>The main API dialects.</strong> OpenAI, Anthropic Messages, Responses and
                the SageMaker container contract are served by both{' '}
                <Cite tier={1} href={sglangUrl(HTTP, 'L1999-L2139')}>
                  http_server.py L1999-L2139
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/entrypoints/launchers/api_server/routers.py', 'L28-L32')}>
                  vLLM routers.py L28-L32
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/entrypoints/generate/api_router.py', 'L21-L44')}>
                  vLLM generate/api_router.py L21-L44
                </Cite>
                ; the one-sided surfaces are small: Ollama and native <code>/generate</code> on
                SGLang, Cohere chat on vLLM.
              </li>
              <li>
                <strong>The large-scale parallelism vocabulary.</strong> Wide-EP MoE serving in both
                uses DeepEP-class all-to-all, an expert-parallel load balancer, DCP (decode context
                parallelism) for MLA (multi-head latent attention) models and elastic EP{' '}
                <Cite tier={1} href={sglangTreeUrl(`${SRT}/elastic_ep`)}>
                  elastic_ep/ at v0.5.22
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/entrypoints/launchers/api_server/routers.py', 'L38-L50')}>
                  vLLM routers.py L38-L50
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/parallel.py', 'L44-L58')}>
                  vLLM parallel.py L44-L58
                </Cite>
                . The difference is how the widths are counted, the DP-and-EP row above.
              </li>
              <li>
                <strong>HiSparse in both.</strong> Sparse attention with KV kept in host memory is
                an opt-in flag in SGLang{' '}
                <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/fields/memory.py`, 'L225')}>
                  memory.py L225
                </Cite>{' '}
                and a KV connector in vLLM{' '}
                <Cite tier={1} href={vllmTreeUrl('vllm/distributed/kv_transfer/kv_connector/v1/hisparse')}>
                  vLLM kv_connector/v1/hisparse
                </Cite>
                ; which project adopted it from the other was not established during this
                research.
              </li>
              <li>
                <strong>The same speculative families.</strong> EAGLE-3, n-gram, DFlash, DSpark and
                block verification exist in both{' '}
                <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/fields/spec.py`, 'L31-L34')}>
                  spec.py L31-L34
                </Cite>{' '}
                <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/fields/spec.py`, 'L120-L121')}>
                  spec.py L120-L121
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L69-L85')}>
                  vLLM speculative.py L69-L85
                </Cite>
                . What differs is SGLang&apos;s tree drafting, its accept-length-adaptive steps and
                its overlap coverage.
              </li>
              <li>
                <strong>Grammar enforcement on XGrammar.</strong> The 2024 structured-output edge,
                jump-forward over a compressed state machine, is dormant in SGLang v0.5.22. vLLM
                Neuron has an opt-in jump-forward (JF) decoding of its own, and its documentation names
                SGLang for one detail: &quot;Taking inspiration from the original jump-forward
                implementation in SGLang, we disable proper logprobs for JF decoding&quot;{' '}
                <Cite tier={1} href={NEURON_DOC}>
                  Neuron docs 2.33.0: vLLM Neuron additional config
                </Cite>
                .
              </li>
              <li>
                <strong>Batch-invariant inference and fast loading.</strong> Bitwise-reproducible
                outputs are an opt-in in both, off by default{' '}
                <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/fields/exec_.py`, 'L1073-L1075')}>
                  exec_.py L1073-L1075
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L631')}>
                  vLLM envs.py L631
                </Cite>
                , and the InstantTensor loader is a load format in both{' '}
                <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/fields/model.py`, 'L61-L62')}>
                  model.py L61-L62
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/load.py', 'L38-L39')}>
                  vLLM load.py L38-L39
                </Cite>
                .
              </li>
              <li>
                <strong>The same orchestrators, at near-current pins.</strong> Dynamo v1.6.0 pins
                SGLang 0.5.21 and vLLM 0.31.0{' '}
                <Cite tier={1} href={DYNAMO_PYPROJECT}>
                  Dynamo v1.6.0 pyproject.toml L62-L78
                </Cite>
                , and llm-d v1.0.0 installs SGLang v0.5.22 and vLLM v0.31.0{' '}
                <Cite tier={1} href={`${LLMD_IMAGES}/gpu-sglang/release/kustomization.yaml#L4-L6`}>
                  llm-d v1.0.0 gpu-sglang release L4-L6
                </Cite>{' '}
                <Cite tier={1} href={`${LLMD_IMAGES}/gpu-vllm/release/kustomization.yaml`}>
                  llm-d v1.0.0 gpu-vllm release
                </Cite>
                , so the fleet layer
                rarely forces the engine choice. Ray Serve LLM is the exception: vLLM by default,
                SGLang through a server class whose integration Ray marks as early development
                (section 18, Multi-Node and Kubernetes Orchestrators).
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Judge a published SGLang-versus-vLLM number by its date, versions, hardware and conditions before it moves a decision"
          >
            How to read the benchmarks
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            No benchmark located during this research compares SGLang v0.5.22 with vLLM v0.31.0;
            the InferenceX dashboard, which runs recent images of both engines, could not be read{' '}
            <Cite tier={3} href={INFERENCEX_DASHBOARD}>
              InferenceX dashboard
            </Cite>
            . Every published head-to-head located is two years old, has an unnamed comparator,
            measures one kernel, measures accuracy only, compares hardware, or runs small dense
            models on old or unstated versions.
          </Box>
          <Box variant="p">
            Most of them also predate the convergence. The 2024 SGLang paper ran against vLLM
            v0.2.5, which had no prefix cache{' '}
            <Cite tier={3} href={ARXIV_SGLANG}>
              arXiv 2312.07104v2
            </Cite>
            . At the versions this dive covers, both engines page the KV cache, cache prefixes by
            default, overlap CPU and GPU work by default, queue requests FCFS, recompute on
            preemption and, on NVIDIA, run the same kernel projects. A gap
            measured before then includes differences that have since closed. In our reading, a
            head-to-head result tracks release dates and matched flags more than engine identity:
            the InferenceX v2 report describes steady release-to-release gains inside each engine{' '}
            <Cite tier={3} href={SA_INFERENCEX_V2}>
              SemiAnalysis InferenceX v2, 2026-02-16
            </Cite>
            .
          </Box>
          <Box variant="p">
            Before a number moves a decision, check its run date, both engine versions or image
            tags (a tagged release against a nightly is not a matched pair), the speculative method
            and its acceptance rate, the KV offload connector, the parallel layout, single-node or
            disaggregated serving, and whether the prompts share prefixes at all. Random-token
            prompts remove prefix reuse, which the SGLang paper credits first for its gains.
          </Box>

          <Header variant="h3">Project and author claims</Header>
          <Bench
            header="2024-06-06: the SGLang paper (Tier 3, the authors' own numbers)"
            source={
              <Cite tier={3} href={ARXIV_SGLANG}>
                arXiv 2312.07104v2, &quot;SGLang: Efficient Execution of Structured Language Model
                Programs&quot;
              </Cite>
            }
            versions={
              <>
                vLLM v0.2.5 &quot;and its default API server&quot;, Guidance v0.1.8, LMQL v0.7.3. A
                footnote says RadixAttention had been partially integrated into the latest vLLM as
                an experimental feature, so the authors used an earlier version.
              </>
            }
            setup={
              <>
                Mostly AWS EC2 G5 (A10G 24 GB), some A100 80 GB; Llama-2, Mixtral-8x7B and LLaVA;
                few-shot question answering, agent programs, tree-of-thought, JSON decoding,
                multi-turn chat and a retrieval pipeline.
              </>
            }
            result={
              <>
                &quot;Up to 6.4x higher throughput&quot; and up to 3.7x lower latency, which the
                paper attributes to KV cache reuse plus parallelism and constrained decoding;
                multi-turn chat with long outputs shows &quot;almost no speedup&quot;.
              </>
            }
            transfer={
              <>
                The mechanism and the paper&apos;s own limit, little gain where little is shared.
                The baseline had no prefix cache, and vLLM v0.31.0 caches prefixes by default.
              </>
            }
          />
          <Bench
            header="2024-01-17: LMSYS (Large Model Systems Organization), RadixAttention and SGLang (Tier 2, project claim)"
            source={
              <Cite tier={2} href={LMSYS_2024_01}>
                LMSYS blog, 2024-01-17
              </Cite>
            }
            versions={<>vLLM v0.2.5, Guidance v0.1.8, TGI (Text Generation Inference) v1.3.0.</>}
            setup={
              <>
                Llama-7B on one A10G and Mixtral-8x7B on eight A10G; the paper&apos;s program
                workloads; per-workload numbers in figures only.
              </>
            }
            result={
              <>
                &quot;SGLang achieves up to 5 times higher throughput compared to existing systems,
                namely Guidance and vLLM&quot;, pooled across baselines with no vLLM-only multiplier
                in the text.
              </>
            }
            transfer={<>Nothing, for the paper&apos;s reasons.</>}
          />
          <Bench
            header="2024-02-05: LMSYS, compressed finite state machine for JSON decoding (Tier 2, project claim)"
            source={
              <Cite tier={2} href={LMSYS_2024_02}>
                LMSYS blog, 2024-02-05
              </Cite>
            }
            versions={
              <>
                SGLang unversioned, against Outlines v0.2.5 on vLLM v0.2.7, and guidance with
                llama.cpp.
              </>
            }
            setup={<>Llama-7B on one A10.</>}
            result={
              <>
                Up to 2x lower latency and 2.5x higher throughput. In the character generation task
                SGLang without jump-forward also had higher throughput than Outlines on vLLM, which
                the post suspects is &quot;due to some overhead in Outlines&quot;.
              </>
            }
            transfer={
              <>
                Nothing: the comparator was Outlines wrapping vLLM v0.2.7, vLLM v0.31.0 has built-in
                structured outputs, and SGLang&apos;s jump-forward is dormant at v0.5.22.
              </>
            }
          />
          <Bench
            header="2024-07-25: LMSYS, Llama 3 serving against TensorRT-LLM and vLLM (Tier 2, project claim)"
            source={
              <Cite tier={2} href={LMSYS_2024_07}>
                LMSYS blog, 2024-07-25
              </Cite>
            }
            versions={
              <>
                SGLang v0.2, vLLM 0.5.2 (&quot;0.5.3.post1 was tried but often crashed under high
                load&quot;), TensorRT-LLM v0.10.0.
              </>
            }
            setup={
              <>
                One A100 (8B), eight A100 (70B in BF16, bfloat16), eight H100 (70B in FP8, 8-bit
                floating point, and 405B in FP8 with dummy weights); synthetic random lengths and ShareGPT offline, 1024/1024 online at 1 to 16
                requests per second; prefix caching off for all; vLLM at default arguments,
                TensorRT-LLM tuned.
              </>
            }
            result={
              <>
                &quot;SGLang consistently outperforms vLLM, achieving up to 3.1x higher throughput
                on Llama-70B&quot;; for 405B most time is in GPU kernels, which narrows the gap.
              </>
            }
            transfer={
              <>
                Little. vLLM 0.5.2 predates the V1 engine and default async scheduling, and SGLang
                v0.2 predates the overlap scheduler; the test measured scheduler and kernel overhead
                that both projects have since reworked.
              </>
            }
          />
          <Bench
            header="2024-09-04: LMSYS, SGLang v0.3 MLA and torch.compile (Tier 2, project claim)"
            source={
              <Cite tier={2} href={LMSYS_2024_09}>
                LMSYS blog, 2024-09-04
              </Cite>
            }
            versions={<>SGLang v0.3 against vLLM with no version stated.</>}
            setup={
              <>
                H100, DeepSeek-Coder-V2 Lite and full, BF16 and FP8, 5,000 ShareGPT prompts;
                settings unmatched, with FP8 KV cache on SGLang only and{' '}
                <code>--max-model-len 4096</code> on vLLM only.
              </>
            }
            result={
              <>
                &quot;3x to 7x higher throughput than the baseline system&quot; with the MLA
                optimizations, and &quot;up to a 1.5x speedup&quot; with torch.compile, which the
                post turns on for batch sizes 1 to 32.
              </>
            }
            transfer={
              <>
                Nothing: an unversioned baseline, unmatched settings, and both engines ship MLA
                attention backends at the pinned versions.
              </>
            }
          />
          <Bench
            header="2024-12-04: LMSYS, SGLang v0.4 (Tier 2, project claim; no vLLM comparison)"
            source={
              <Cite tier={2} href={LMSYS_2024_12}>
                LMSYS blog, 2024-12-04
              </Cite>
            }
            versions={<>SGLang v0.4 against SGLang v0.3 and unnamed &quot;state-of-the-art baselines&quot;.</>}
            setup={<>The zero-overhead scheduler, the cache-aware load balancer and structured outputs.</>}
            result={<>&quot;1.3x speedup against other state-of-the-art baselines&quot;, unnamed.</>}
            transfer={<>It compares SGLang releases with each other and with unnamed baselines, so it carries no evidence about vLLM.</>}
          />
          <Bench
            header="2025-08-27: LMSYS, gpt-oss accuracy (Tier 2, project claim; accuracy only)"
            source={
              <Cite tier={2} href={LMSYS_2025_08}>
                LMSYS blog, 2025-08-27
              </Cite>
            }
            versions={<>Unstated; the vLLM column links a moving recipes page.</>}
            setup={<>gpt-oss-120b on one reasoning test at three reasoning efforts.</>}
            result={<>Both engines within 2 points of the official GPQA score at each effort.</>}
            transfer={<>It is an accuracy check and carries no performance evidence.</>}
          />
          <Bench
            header="2026-04-25: LMSYS, DeepSeek-V4 on day 0 (Tier 2, project claim; comparator unnamed)"
            source={
              <Cite tier={2} href={LMSYS_2026_04}>
                LMSYS blog, 2026-04-25
              </Cite>
            }
            versions={<>SGLang unversioned, against an unnamed &quot;other OSS engine&quot;.</>}
            setup={
              <>
                B200 at TP 8 (V4 Pro), H200 at TP 4 (V4 Flash); batch-1 decode with a 30K-token
                prompt; different speculative settings per engine.
              </>
            }
            result={
              <>
                &quot;Figure 1 is a Day-0 snapshot of SGLang on DeepSeek-V4, not a definitive
                ranking&quot;; numbers in the figure only.
              </>
            }
            transfer={<>The page never names the comparator, so it carries no evidence about vLLM.</>}
          />
          <Bench
            header="2026-08-07: LMSYS, HPC-Ops fused-MoE kernel (Tier 2, vendor and project claim)"
            source={
              <Cite tier={2} href={LMSYS_2026_08}>
                LMSYS blog, 2026-08-07, Tencent Hunyuan and SGLang Team
              </Cite>
            }
            versions={<>None stated.</>}
            setup={
              <>
                A fused-MoE kernel microbenchmark on H20 against SGLang&apos;s MoE kernel,
                &quot;vLLM Triton&quot; and &quot;vLLM CUTLASS&quot;.
              </>
            }
            result={
              <>
                HPC-Ops &quot;1.08x at TP8 / EP1 and 1.21x at TP1 / EP8 over the best of the SGLang
                and vLLM baselines&quot;.
              </>
            }
            transfer={
              <>
                Kernel level only, written by the vendor of the measured kernel; it says nothing
                about end-to-end serving.
              </>
            }
          />
          <Bench
            header="2024-09-05: vLLM blog, v0.6.0 performance update (Tier 2, project claim)"
            source={
              <Cite tier={2} href={VLLM_BLOG_2024_09}>
                vLLM blog, 2024-09-05
              </Cite>
            }
            versions={
              <>
                vLLM v0.6.0 against TensorRT-LLM r24.07, SGLang v0.3.0 and LMDeploy v0.6.0a0; vLLM
                ran <code>--num-scheduler-steps 10</code>, a non-default setting, and the others
                &quot;their default setting&quot;. The 2.7x and 5x headline compares vLLM v0.6.0
                with vLLM v0.5.3.
              </>
            }
            setup={
              <>
                One and four H100 (appendix on A100); Llama 3 8B and 70B; ShareGPT plus
                prefill-heavy and decode-heavy synthetic sets, 500 prompts.
              </>
            }
            result={
              <>
                &quot;In ShareGPT and Decode-heavy dataset, vLLM achieves highest throughput on H100
                when serving Llama-3 models&quot;, with vLLM lower on the prefill-heavy set; for
                Llama 3 70B on four A100 the engines have &quot;similar TTFT and TPOT&quot; (time to
                first token, time per
                output token).
              </>
            }
            transfer={
              <>
                Nothing: both versions are about two years old, a tuned flag ran against defaults,
                and the post states nothing about prefix sharing in its dense Llama prompts. The
                vLLM blog posts from
                2025 and 2026 checked during this research carry no SGLang performance comparison.
              </>
            }
          />

          <Header variant="h3">Third-party measurements</Header>
          <Bench
            header="2025-10-09: SemiAnalysis InferenceMAX (Tier 3; one engine picked per model)"
            source={
              <Cite tier={3} href={SA_INFERENCEMAX}>
                SemiAnalysis, &quot;InferenceMAX: Open Source Inference Benchmarking&quot;
              </Cite>
            }
            versions={<>vLLM, SGLang and TensorRT-LLM &quot;depending on the model&quot;, run nightly.</>}
            setup={
              <>
                H100, H200, B200, GB200 NVL72, MI300X, MI325X and MI355X; Llama 70B, DeepSeek R1 and
                gpt-oss 120B; 1k/1k, 1k/8k and 8k/1k with random tokens &quot;to avoid prefix
                caching&quot;; vendor-submitted configurations.
              </>
            }
            result={
              <>
                &quot;We decided to first pick only one of vLLM or SGLang as the default engine for
                each model&quot;: SGLang for DeepSeek, vLLM for Llama 3 70B.
              </>
            }
            transfer={
              <>
                Its charts compare hardware with one engine picked per model, and its random tokens
                remove prefix reuse.
              </>
            }
          />
          <Bench
            header="2026-02-16: SemiAnalysis InferenceX v2 (Tier 3; hardware comparison)"
            source={
              <Cite tier={3} href={SA_INFERENCEX_V2}>
                SemiAnalysis, &quot;InferenceX v2: NVIDIA Blackwell Vs AMD vs Hopper&quot;
              </Cite>
            }
            versions={
              <>
                SGLang 0.5.7 (B200, 2026-01-23) and 0.5.8 (MI325X, 2026-02-12); NVIDIA vLLM
                &quot;between vLLM 0.11.2 and 0.13.0&quot;; MI355X on a fork of vLLM 0.10.1.
              </>
            }
            setup={<>DeepSeek-R1-0528 and gpt-oss 120B; prefix caching off on random data.</>}
            result={
              <>
                No same-model, same-hardware SGLang-versus-vLLM statement in the text; &quot;B200
                SGLang has seen steady and continuous improvement&quot;.
              </>
            }
            transfer={
              <>
                On B200 with DeepSeek R1 the report has SGLang &quot;throughput per GPU doubling
                at some interactivity levels since last October&quot;, so by our reading a
                cross-engine gap measured months earlier can be out of date.
              </>
            }
          />
          <Bench
            header="2026-08-24: SemiAnalysis AgentX, InferenceX v3 (Tier 3; agentic replay)"
            source={
              <Cite tier={3} href={SA_INFERENCEX_V3}>
                SemiAnalysis, &quot;AgentX - InferenceXv3&quot;
              </Cite>
            }
            versions={
              <>
                vLLM, SGLang with HiCache, TensorRT-LLM, ATOM, Dynamo and llm-d; configurations
                &quot;mainly track recipes.vllm.ai and SGLang cookbook on upstream images&quot;.
              </>
            }
            setup={
              <>
                393 anonymized coding-agent traces replayed on schedule; long-context, multi-turn
                traffic with a &quot;95%+ KV cache hit rate&quot;; hardware from MI355X to RTX Pro,
                over 1,000 chips.
              </>
            }
            result={
              <>
                No same-model, same-hardware SGLang-versus-vLLM sentence in the text;
                &quot;individual points along a single curve may use different optimization
                techniques and configurations&quot;.
              </>
            }
            transfer={
              <>
                The closest workload shape to a shared-prefix question. Techniques differ point by
                point and each submitter picks the offload connector, so its curves compare whole
                stacks.
              </>
            }
          />
          <Bench
            header="2026-10-24: the InferenceX repository (Tier 3; results not readable)"
            source={
              <Cite tier={3} href={INFERENCEX_REPO}>
                SemiAnalysisAI/InferenceX at commit a0287f0b
              </Cite>
            }
            versions={
              <>
                Example B200 pair: <code>lmsysorg/sglang:v0.5.20-cu130</code> against a vLLM
                nightly image; no pinned pair is SGLang v0.5.22 with vLLM v0.31.0.
              </>
            }
            setup={
              <>
                Matched model and GPU pairs with both engines exist only in agentic scenarios
                (DeepSeek-V4-Pro, DeepSeek-V4.1-Flash, MiniMax-M3.1-Flash, in FP4, 4-bit floating
                point).
              </>
            }
            result={<>None transcribed: the dashboard loads its data by JavaScript and could not be read.</>}
            transfer={
              <>
                When results appear, apply the checks above, in particular tagged release against
                nightly, speculative method and offload connector.
              </>
            }
          />
          <Bench
            header="InferenceBench preprint, v1 dated 2026-05-20 (Tier 3; best-matched method found)"
            source={
              <Cite tier={3} href={ARXIV_INFERENCEBENCH}>
                arXiv 2607.20468v1, &quot;InferenceBench&quot;
              </Cite>
            }
            versions={<>vLLM v0.11.0 baseline, SGLang v0.5.10 and TGI v3.3.6-dev0 as references.</>}
            setup={
              <>
                One H100 80 GB; Mistral-7B-Instruct-v0.3; four synthetic scenarios (prefill
                8192/1024 at concurrency 1, decode 1024/8192 at 1, throughput 1024/1024 up to 64,
                mixed 4096/2048 at 4); defaults first, then an equal-budget hyperparameter search.
              </>
            }
            result={
              <>
                At defaults, speedup over naive PyTorch of 4.05x for vLLM and 3.92x for SGLang in
                aggregate, &quot;with SGLang slightly ahead on Scenarios C and D&quot;; tuned,
                &quot;SGLang is the strongest engine for prefill (Scenario A) under all three
                optimizers&quot; and vLLM &quot;strongest for decode-heavy long-output generation
                (Scenario B) when it produces a valid final result&quot;.
              </>
            }
            transfer={
              <>
                The method: same GPU, model, defaults and tuning budget, with the conclusion that
                the better engine depends on the scenario. The numbers are 15 SGLang and 32 vLLM
                GitHub releases old, on one small dense model with LongBench v2 prompts whose prefix
                sharing the paper does not state, and no structured output.
              </>
            }
          />
          <Bench
            header="Bench360 preprint, November 2025 (Tier 3; no engine versions)"
            source={
              <Cite tier={3} href={ARXIV_BENCH360}>
                arXiv 2511.16682v1, &quot;Bench360&quot;
              </Cite>
            }
            versions={<>vLLM, SGLang, TGI and LMDeploy, with no engine versions stated.</>}
            setup={
              <>
                One L4, A10 or A30; 7B to 8B dense models in FP16 (16-bit floating point); about 320 input and 32 output
                tokens.
              </>
            }
            result={
              <>
                &quot;SGLang delivers the highest TPS across all batch sizes, reaching 648.5 TPS on
                A10 at B=128&quot; (TPS: tokens per second); &quot;On the high-end A30, vLLM takes
                the lead, peaking at 964.4 TPS for B=128&quot;.
              </>
            }
            transfer={
              <>
                Without versions it cannot be placed; its lesson is the ordering flip between two
                GPUs inside one study.
              </>
            }
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Port a vLLM launch line and its clients without a silent change in behaviour, then measure both engines on your own traffic"
          >
            Switching from vLLM: the checklist
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Because both engines page the KV cache, cache prefixes, overlap CPU and GPU work, queue
            FCFS, recompute on preemption and share kernel projects, a move between them is a
            configuration port. These are the settings and client habits that change meaning on
            the way:
          </Box>
          <ol>
            <li>
              <strong>
                Add <code>--enable-metrics</code>.
              </strong>{' '}
              A default SGLang server serves no <code>/metrics</code>{' '}
              <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/fields/observability.py`, 'L70')}>
                observability.py L70
              </Cite>{' '}
              ({V20_LINK}).
            </li>
            <li>
              <strong>
                Do not copy <code>--gpu-memory-utilization</code> into{' '}
                <code>--mem-fraction-static</code>.
              </strong>{' '}
              SGLang&apos;s fraction covers weights and KV only{' '}
              <Cite tier={1} href={sglangUrl(SCHED_FIELDS, 'L27-L30')}>
                schedule.py L27-L30
              </Cite>
              , vLLM&apos;s 0.92 covers the whole instance{' '}
              <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L103-L111')}>
                vLLM cache.py L103-L111
              </Cite>
              , so SGLang&apos;s computed default, about 0.81 to 0.83 on an 80 GB H100, sits below
              0.92 without reserving less in total{' '}
              <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/memory_hook.py`, 'L283-L345')}>
                memory_hook.py L283-L345
              </Cite>{' '}
              (section 6, KV Memory and the Defaults Your GPU Picks; {V27_LINK}).
            </li>
            <li>
              <strong>
                Send LoRA requests as{' '}
                <code>model=&quot;&lt;base&gt;:&lt;adapter&gt;&quot;</code>
              </strong>
              , or name the adapter in <code>lora_path</code>; a bare adapter name runs the base
              model with no error{' '}
              <Cite tier={1} href={sglangUrl(`${SRT}/entrypoints/openai/serving_base.py`, 'L40-L71')}>
                serving_base.py L40-L71
              </Cite>
              .
            </li>
            <li>
              <strong>
                Drop <code>--enable-auto-tool-choice</code> and map tool-call parser names.
              </strong>{' '}
              SGLang has no such flag, by our search of the v0.5.22 Python source, and needs only{' '}
              <code>--tool-call-parser</code>, or <code>auto</code>{' '}
              <Cite tier={1} href={sglangUrl(`${SRT}/server_args.py`, 'L376-L384')}>
                server_args.py L376-L384
              </Cite>
              , and the names differ, for example vLLM&apos;s <code>llama3_json</code> against
              SGLang&apos;s <code>llama3</code>{' '}
              <Cite tier={1} href={vllmUrl('vllm/tool_parsers/__init__.py', 'L129')} kind="code">
                vLLM tool_parsers/__init__.py L129
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(`${SRT}/function_call/function_call_parser.py`, 'L93')} kind="code">
                function_call_parser.py L93
              </Cite>
              .
            </li>
            <li>
              <strong>Move regex and EBNF constraints to SGLang&apos;s fields.</strong>{' '}
              SGLang takes <code>regex</code> and <code>ebnf</code> as top-level{' '}
              <code>extra_body</code> fields{' '}
              <Cite tier={1} href={sglangUrl(`${SRT}/entrypoints/openai/protocol.py`, 'L1161-L1189')}>
                protocol.py L1161-L1189
              </Cite>
              , where vLLM nests them under <code>structured_outputs</code>{' '}
              <Cite tier={1} href={vllmUrl('vllm/entrypoints/openai/chat_completion/protocol.py', 'L377')}>
                vLLM chat_completion/protocol.py L377
              </Cite>
              ; <code>response_format</code>{' '}
              with a JSON schema works the same on both (section 10, Structured Output; {V12_LINK}).
            </li>
            <li>
              <strong>Match the speculative shape.</strong> Set{' '}
              <code>--speculative-eagle-topk 1</code> with <code>--speculative-num-steps</code> for
              chain drafting like vLLM&apos;s; a top-k without a step count fails an assertion at
              startup. On B200, leave <code>--page-size</code> unset as well, which keeps{' '}
              <code>trtllm_mha</code> and its 64-token pages{' '}
              <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/speculative_hook.py`, 'L1068-L1090')} kind="code">
                speculative_hook.py L1068-L1090
              </Cite>{' '}
              (section 8, Attention Backends and Kernels; section 11, Speculative Decoding).
            </li>
            <li>
              <strong>
                Set <code>--admin-api-key</code> unless the port is reachable only from the
                trainer&apos;s network.
              </strong>{' '}
              With neither <code>--api-key</code> nor <code>--admin-api-key</code> set, the admin
              routes accept any client that can reach the port{' '}
              <Cite tier={1} href={sglangUrl(`${SRT}/utils/auth.py`, 'L79-L151')}>
                auth.py L79-L151
              </Cite>{' '}
              (section 12, Talking to SGLang: APIs, LoRA and the Admin Plane).
            </li>
          </ol>
          <Box variant="p">
            Then benchmark both engines on your own traffic at matched settings: the same GPU,
            model and precision, the same speculative shape, both servers at the versions you will
            run, and prompts that share prefixes the way your users&apos; do. No published result
            located during this research answers the question for SGLang v0.5.22 against vLLM
            v0.31.0, so your measurement is the one that decides.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
