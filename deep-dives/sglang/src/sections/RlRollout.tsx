import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangDocsSrcUrl } from '../components/Cite';

const README = 'README.md';
const WU = 'python/sglang/srt/managers/scheduler_components/weight_updater.py';
const MR_WU = 'python/sglang/srt/model_executor/model_runner_components/weight_updater.py';
const IO = 'python/sglang/srt/managers/io_struct.py';
const HTTP = 'python/sglang/srt/entrypoints/http_server.py';
const TM = 'python/sglang/srt/managers/tokenizer_manager.py';
const TCM = 'python/sglang/srt/managers/tokenizer_control_mixin.py';
const SCHED = 'python/sglang/srt/managers/scheduler.py';
const ENGINE = 'python/sglang/srt/entrypoints/engine.py';
const WSYNC = 'python/sglang/srt/weight_sync/utils.py';
const BUCKET = 'python/sglang/srt/weight_sync/tensor_bucket.py';
const TMS = 'python/sglang/srt/utils/torch_memory_saver_adapter.py';
const CONSTS = 'python/sglang/srt/constants.py';
const EXEC = 'python/sglang/srt/arg_groups/fields/exec_.py';
const SERVING = 'python/sglang/srt/arg_groups/fields/serving.py';
const PARALLEL = 'python/sglang/srt/arg_groups/fields/parallel.py';
const OVERRIDES = 'python/sglang/srt/arg_groups/overrides.py';
const ATTN_HOOK = 'python/sglang/srt/arg_groups/attention_hook.py';
const CHOICES = 'python/sglang/srt/arg_groups/choices.py';
const BIO = 'python/sglang/srt/batch_invariant_ops/batch_invariant_ops.py';
const RUNNER = 'python/sglang/srt/model_executor/model_runner.py';
const AUTH = 'python/sglang/srt/utils/auth.py';
const VERSIONS = 'python/sglang/srt/utils/weight_versions.py';
const PYPROJECT = 'python/pyproject.toml';
const GATEWAY = 'sgl-model-gateway/src/server.rs';
const RL_DOCS = 'advanced_features/sglang_for_rl';
const DET_DOCS = 'advanced_features/deterministic_inference';
const LMSYS_DET = 'https://www.lmsys.org/blog/2025-09-22-sglang-deterministic/';
const REL_0521 = 'https://github.com/sgl-project/sglang/releases/tag/v0.5.21';

function vllmUrl(path: string, lines: string): string {
  return `https://github.com/vllm-project/vllm/blob/v0.31.0/${path}#${lines}`;
}

const VLLM_SERVER_LINK = (
  <Link href="../vllm/">vLLM dive, section 12: The OpenAI-Compatible Server</Link>
);

/* ------------------------------------------------------------------------ */
/* Diagram: the refit sequence                                              */
/* ------------------------------------------------------------------------ */

function RefitSequenceDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 500"
        role="img"
        aria-labelledby="rl-refit-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="rl-refit-title">
          An RL refit on an SGLang v0.5.22 server, in five calls from the trainer. Step 1,
          pause_generation in retract mode, stops running batches, returns running requests to the
          waiting queue and frees their KV, while new requests wait in the TokenizerManager. Step 2,
          begin_weight_update, opens the weight-update session. Step 3 is one update call per
          bucket: names, dtypes and shapes travel in the HTTP body, and the tensor bytes travel by
          NCCL broadcast from trainer rank 0 or as CUDA IPC handles. After loading, the scheduler
          flushes the radix cache, which succeeds because a paused engine ignores its waiting queue.
          Step 4, end_weight_update, converts quantized layers to kernel layout once and closes the
          session. Step 5, continue_generation, releases the waiting requests; retracted requests
          recompute their KV with the new weights and their responses report weight_versions spans.
          Tensor and NCCL updates sent outside the session fail and change nothing.
        </title>
        <style>{`
          .rl-refit-band { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1; stroke-dasharray: 5 4; }
          .rl-refit-trainer { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.5; }
          .rl-refit-srv { fill: #ffffff; stroke: #0972d3; stroke-width: 1.5; }
          .rl-refit-flush { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .rl-refit-head { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .rl-refit-sub { fill: #414d5c; font: 600 12px sans-serif; text-anchor: middle; }
          .rl-refit-call { fill: #16191f; font: 600 12px sans-serif; }
          .rl-refit-ct { fill: #5f6b7a; font: 11px sans-serif; }
          .rl-refit-s { fill: #16191f; font: 11px sans-serif; }
          .rl-refit-ft { fill: #024a07; font: 600 12px sans-serif; }
          .rl-refit-fs { fill: #024a07; font: 11px sans-serif; }
          .rl-refit-lbl { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .rl-refit-nccl { fill: #4a2f99; font: 11px sans-serif; text-anchor: middle; }
          .rl-refit-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
          .rl-refit-arr-b { stroke: #6f4cc4; stroke-width: 1.5; fill: none; stroke-dasharray: 6 4; }
          .rl-refit-rule { stroke: #879596; stroke-width: 1; }
        `}</style>
        <defs>
          <marker
            id="rl-refit-ah"
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
            id="rl-refit-ah-b"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#6f4cc4" />
          </marker>
        </defs>

        <rect x={0} y={0} width={860} height={500} rx={8} fill="#ffffff" />

        {/* Column headers */}
        <text x={557} y={18} className="rl-refit-head">
          SGLang server
        </text>
        <line x1={270} y1={26} x2={844} y2={26} className="rl-refit-rule" />
        <text x={131} y={44} className="rl-refit-head">
          Trainer
        </text>
        <text x={405} y={44} className="rl-refit-sub">
          TokenizerManager
        </text>
        <text x={702} y={44} className="rl-refit-sub">
          Scheduler
        </text>

        {/* The weight-update session: steps 2 to 4 */}
        <rect x={8} y={140} width={844} height={262} rx={6} className="rl-refit-band" />

        {/* Step 1: pause */}
        <rect x={16} y={56} width={230} height={74} rx={6} className="rl-refit-trainer" />
        <text x={28} y={88} className="rl-refit-call">
          1. /pause_generation
        </text>
        <text x={28} y={106} className="rl-refit-ct">
          body: mode retract
        </text>
        <rect x={270} y={56} width={270} height={74} rx={6} className="rl-refit-srv" />
        <text x={282} y={89} className="rl-refit-s">
          Sets the pause. New requests wait
        </text>
        <text x={282} y={105} className="rl-refit-s">
          here, untokenized, until step 5
        </text>
        <rect x={560} y={56} width={284} height={74} rx={6} className="rl-refit-srv" />
        <text x={572} y={81} className="rl-refit-s">
          Stops running batches. Running
        </text>
        <text x={572} y={97} className="rl-refit-s">
          requests go back to the waiting
        </text>
        <text x={572} y={113} className="rl-refit-s">
          queue, and their KV is freed
        </text>
        <path d="M246,93 L268,93" className="rl-refit-arr" markerEnd="url(#rl-refit-ah)" />
        <path d="M540,93 L558,93" className="rl-refit-arr" markerEnd="url(#rl-refit-ah)" />

        {/* Step 2: begin */}
        <rect x={16} y={146} width={230} height={56} rx={6} className="rl-refit-trainer" />
        <text x={28} y={169} className="rl-refit-call">
          2. /begin_weight_update
        </text>
        <text x={28} y={187} className="rl-refit-ct">
          opens the session
        </text>
        <text x={405} y={172} className="rl-refit-lbl">
          forwarded
        </text>
        <path d="M246,184 L558,184" className="rl-refit-arr" markerEnd="url(#rl-refit-ah)" />
        <rect x={560} y={146} width={284} height={56} rx={6} className="rl-refit-srv" />
        <text x={572} y={170} className="rl-refit-s">
          Opens the session; restores packed
        </text>
        <text x={572} y={186} className="rl-refit-s">
          quantized weights so new ones load
        </text>

        {/* Step 3: buckets */}
        <rect x={16} y={214} width={230} height={112} rx={6} className="rl-refit-trainer" />
        <text x={28} y={254} className="rl-refit-call">
          3. One call per bucket
        </text>
        <text x={28} y={273} className="rl-refit-ct">
          /update_weights_from_distributed
        </text>
        <text x={28} y={289} className="rl-refit-ct">
          or /update_weights_from_tensor
        </text>
        <rect x={270} y={214} width={270} height={56} rx={6} className="rl-refit-srv" />
        <text x={282} y={238} className="rl-refit-s">
          Passes names, dtypes and shapes,
        </text>
        <text x={282} y={254} className="rl-refit-s">
          or the CUDA IPC handles
        </text>
        <path d="M246,242 L268,242" className="rl-refit-arr" markerEnd="url(#rl-refit-ah)" />
        <path d="M540,242 L558,242" className="rl-refit-arr" markerEnd="url(#rl-refit-ah)" />
        <text x={405} y={292} className="rl-refit-nccl">
          tensor bytes: NCCL broadcast from rank 0
        </text>
        <path d="M246,306 L558,306" className="rl-refit-arr-b" markerEnd="url(#rl-refit-ah-b)" />
        <rect x={560} y={214} width={284} height={112} rx={6} className="rl-refit-flush" />
        <text x={572} y={238} className="rl-refit-ft">
          Load the bucket, flush the cache
        </text>
        <text x={572} y={258} className="rl-refit-fs">
          Radix tree and KV pools reset;
        </text>
        <text x={572} y={274} className="rl-refit-fs">
          flush_cache: true by default
        </text>
        <text x={572} y={290} className="rl-refit-fs">
          Paused, the waiting queue does
        </text>
        <text x={572} y={306} className="rl-refit-fs">
          not block the flush
        </text>

        {/* Step 4: end */}
        <rect x={16} y={340} width={230} height={56} rx={6} className="rl-refit-trainer" />
        <text x={28} y={363} className="rl-refit-call">
          4. /end_weight_update
        </text>
        <text x={28} y={381} className="rl-refit-ct">
          closes the session
        </text>
        <text x={405} y={366} className="rl-refit-lbl">
          forwarded
        </text>
        <path d="M246,378 L558,378" className="rl-refit-arr" markerEnd="url(#rl-refit-ah)" />
        <rect x={560} y={340} width={284} height={56} rx={6} className="rl-refit-srv" />
        <text x={572} y={364} className="rl-refit-s">
          Converts quantized layers to kernel
        </text>
        <text x={572} y={380} className="rl-refit-s">
          layout once; the session closes
        </text>

        {/* Step 5: continue */}
        <rect x={16} y={414} width={230} height={74} rx={6} className="rl-refit-trainer" />
        <text x={28} y={446} className="rl-refit-call">
          5. /continue_generation
        </text>
        <text x={28} y={464} className="rl-refit-ct">
          ends the pause
        </text>
        <rect x={270} y={414} width={270} height={74} rx={6} className="rl-refit-srv" />
        <text x={282} y={447} className="rl-refit-s">
          Releases the waiting requests
        </text>
        <text x={282} y={463} className="rl-refit-s">
          to be tokenized and scheduled
        </text>
        <rect x={560} y={414} width={284} height={74} rx={6} className="rl-refit-srv" />
        <text x={572} y={439} className="rl-refit-s">
          Retracted requests recompute their
        </text>
        <text x={572} y={455} className="rl-refit-s">
          KV with the new weights; responses
        </text>
        <text x={572} y={471} className="rl-refit-s">
          report weight_versions spans
        </text>
        <path d="M246,451 L268,451" className="rl-refit-arr" markerEnd="url(#rl-refit-ah)" />
        <path d="M540,451 L558,451" className="rl-refit-arr" markerEnd="url(#rl-refit-ah)" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Tables                                                                   */
/* ------------------------------------------------------------------------ */

interface PauseRow {
  id: string;
  mode: ReactNode;
  running: ReactNode;
  flush: ReactNode;
}

const PAUSE_ROWS: PauseRow[] = [
  {
    id: 'abort',
    mode: (
      <>
        <code>abort</code> (default)
      </>
    ),
    running: <>Aborted and returned to their callers at once</>,
    flush: <>Yes: no request is left holding KV</>,
  },
  {
    id: 'retract',
    mode: <code>retract</code>,
    running: (
      <>
        Moved back to the waiting queue with their KV freed, then recomputed after{' '}
        <code>/continue_generation</code>. Retraction is SGLang&apos;s name for preemption
      </>
    ),
    flush: <>Yes: while the engine is paused, the flush ignores the waiting queue</>,
  },
  {
    id: 'in_place',
    mode: <code>in_place</code>,
    running: <>Kept, with their KV, and resumed where they stopped</>,
    flush: <>No: the running batch still holds KV, so a refit&apos;s flush fails</>,
  },
];

interface PathRow {
  id: string;
  path: string;
  fits: ReactNode;
  calls: ReactNode;
  bytes: ReactNode;
  session: ReactNode;
  src: ReactNode;
}

const PATH_ROWS: PathRow[] = [
  {
    id: 'disk',
    path: 'From disk',
    fits: <>A checkpoint on shared storage; new rollout servers can load the same files</>,
    calls: (
      <>
        <code>/update_weights_from_disk</code> with <code>model_path</code>
      </>
    ),
    bytes: <>Read from storage by the server</>,
    session: <>Not needed</>,
    src: (
      <>
        <Cite tier={1} href={sglangUrl(WU, 'L138-L163')}>
          weight_updater.py L138-L163
        </Cite>{' '}
        <Cite tier={1} href={sglangDocsSrcUrl(RL_DOCS, 'L110-L122')}>
          SGLang docs: SGLang for RL
        </Cite>
      </>
    ),
  },
  {
    id: 'nccl',
    path: 'NCCL broadcast',
    fits: <>Disaggregated: trainer and rollout on separate GPUs</>,
    calls: (
      <>
        <code>/init_weights_update_group</code> once, then{' '}
        <code>/update_weights_from_distributed</code> per bucket
      </>
    ),
    bytes: (
      <>
        Names, dtypes and shapes in the HTTP body; the tensors by NCCL broadcast from trainer rank
        0
      </>
    ),
    session: <>Required</>,
    src: (
      <>
        <Cite tier={1} href={sglangUrl(MR_WU, 'L100-L144')}>
          weight_updater.py (model runner) L100-L144
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(MR_WU, 'L258-L316')}>
          L258-L316
        </Cite>
      </>
    ),
  },
  {
    id: 'tensor',
    path: 'CUDA IPC handles',
    fits: <>Colocated: trainer and rollout share the GPUs</>,
    calls: (
      <>
        <code>/update_weights_from_tensor</code> per bucket
      </>
    ),
    bytes: <>IPC handles in the body; the server maps the trainer&apos;s GPU memory and copies</>,
    session: <>Required</>,
    src: (
      <Cite tier={1} href={sglangUrl(WSYNC, 'L16-L60')}>
        weight_sync/utils.py L16-L60
      </Cite>
    ),
  },
  {
    id: 'ipc',
    path: 'checkpoint-engine',
    fits: <>Spreading checkpoint reads across loader processes and nodes</>,
    calls: (
      <>
        <code>/update_weights_from_ipc</code>, with the <code>checkpoint-engine</code> extra
        (0.1.2) installed
      </>
    ),
    bytes: <>Broadcast or peer-to-peer over CUDA IPC from torchrun-managed loader processes</>,
    session: <>Not needed</>,
    src: (
      <>
        <Cite tier={1} href={sglangUrl(PYPROJECT, 'L110')}>
          pyproject.toml L110
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(WU, 'L265-L289')}>
          weight_updater.py L265-L289
        </Cite>{' '}
        <Cite tier={1} href={sglangDocsSrcUrl('advanced_features/checkpoint_engine', 'L24-L35')}>
          SGLang docs: checkpoint engine
        </Cite>
      </>
    ),
  },
];

interface FlagRow {
  id: string;
  flag: string;
  def: ReactNode;
  effect: ReactNode;
  src: ReactNode;
}

const FLAG_ROWS: FlagRow[] = [
  {
    id: 'saver',
    flag: '--enable-memory-saver',
    def: <>False</>,
    effect: (
      <>
        Lets <code>/release_memory_occupation</code> free GPU memory; without it the call frees
        nothing
      </>
    ),
    src: (
      <Cite tier={1} href={sglangUrl(EXEC, 'L56-L59')}>
        exec_.py L56-L59
      </Cite>
    ),
  },
  {
    id: 'admin',
    flag: '--admin-api-key',
    def: (
      <>
        <code>None</code>
      </>
    ),
    effect: <>When set, the refit and memory routes accept only this key (section 12)</>,
    src: (
      <Cite tier={1} href={sglangUrl(SERVING, 'L158-L161')}>
        serving.py L158-L161
      </Cite>
    ),
  },
  {
    id: 'host',
    flag: '--host',
    def: <>127.0.0.1</>,
    effect: <>Who can reach the port, and so the unkeyed admin routes</>,
    src: (
      <Cite tier={1} href={sglangUrl(SERVING, 'L65-L66')}>
        serving.py L65-L66
      </Cite>
    ),
  },
  {
    id: 'det',
    flag: '--enable-deterministic-inference',
    def: <>False</>,
    effect: <>Batch-invariant kernels; a reported 34.35% average slowdown (2025 project claim)</>,
    src: (
      <Cite tier={1} href={sglangUrl(EXEC, 'L1073-L1075')}>
        exec_.py L1073-L1075
      </Cite>
    ),
  },
  {
    id: 'onpolicy',
    flag: '--rl-on-policy-target',
    def: (
      <>
        <code>None</code> (choice <code>fsdp</code>)
      </>
    ),
    effect: <>Turns deterministic inference on to match an FSDP trainer</>,
    src: (
      <Cite tier={1} href={sglangUrl(ATTN_HOOK, 'L579-L591')}>
        attention_hook.py L579-L591
      </Cite>
    ),
  },
  {
    id: 'backup',
    flag: '--enable-weights-cpu-backup',
    def: <>False</>,
    effect: <>Saves the weights to CPU memory on release and restores them on resume</>,
    src: (
      <Cite tier={1} href={sglangUrl(EXEC, 'L60-L63')}>
        exec_.py L60-L63
      </Cite>
    ),
  },
  {
    id: 'version',
    flag: '--weight-version',
    def: <>default</>,
    effect: <>The label every response reports until an update sets a new one</>,
    src: (
      <Cite tier={1} href={sglangUrl(SERVING, 'L166-L169')}>
        serving.py L166-L169
      </Cite>
    ),
  },
];

const LAUNCH_LINE = `sglang serve --model-path <model> \\
  --enable-memory-saver \\
  --admin-api-key <admin-key> \\
  --enable-deterministic-inference      # optional`;

const REFIT_CALLS = `POST /pause_generation               {"mode": "retract"}
POST /begin_weight_update            {}
POST /update_weights_from_distributed   one call per bucket
     {"names": [...], "dtypes": [...], "shapes": [...],
      "flush_cache": false, "weight_version": "step-42"}
POST /update_weights_from_distributed   the last bucket
     {"names": [...], "dtypes": [...], "shapes": [...],
      "flush_cache": true,  "weight_version": "step-42"}
POST /end_weight_update              {}
POST /continue_generation            {}`;

/* ------------------------------------------------------------------------ */
/* The section                                                              */
/* ------------------------------------------------------------------------ */

export function RlRollout() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The launch flags and the five-call refit a trainer needs to push new weights into SGLang without any later request reusing KV computed with the old ones (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            13. SGLang as an RL Rollout Engine
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            In RL (reinforcement learning) post-training, a trainer samples completions through an
            inference server, scores them, updates the policy, and pushes the new weights back into
            the server, a step called a refit. SGLang describes itself as optimized for
            &quot;agentic workloads, large-scale serving, and RL rollouts&quot;{' '}
            <Cite tier={1} href={sglangUrl(README, 'L21')}>
              README.md L21
            </Cite>
            . On the serving side the challenge is the moment of the refit: once the weights change,
            no later request may reuse KV (key-value) cache entries computed with the old weights,
            and every request in flight needs a defined outcome.
          </Box>
          <Box variant="p">
            SGLang meets it with a bracket. The trainer pauses generation, opens a weight-update
            session, sends the new weights in buckets (over NCCL, the NVIDIA Collective
            Communications Library, or as CUDA IPC, inter-process communication, handles), closes
            the session and resumes. Each update
            call flushes the radix cache by default, and the pause is what lets that flush succeed.
            This section covers the server side: the calls, the flags, and what each one guarantees.
            Which RL frameworks drive these calls, and the SGLang release each pins, is in section
            24, Ecosystem and Production Users.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Follow five calls in order, and see why the pause is what lets the cache flush succeed"
          >
            A refit is a bracket
          </Header>
        }
      >
        <SpaceBetween size="m">
          <RefitSequenceDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured: the call order at v0.5.22. Every call is an HTTP POST to an
            admin route. The shaded band is the weight-update session. Without step 1, a request
            still queued at step 3 makes the flush fail, and the call returns 400 after the weights
            changed.
          </Box>
          <Box variant="p">
            The pause comes first because a flush needs an idle scheduler.{' '}
            <code>/pause_generation</code> stops the scheduler from running batches while control
            calls keep working, and requests that arrive during the pause wait in the
            TokenizerManager until <code>/continue_generation</code>{' '}
            <Cite tier={1} href={sglangUrl(TM, 'L939-L940')} kind="code">
              tokenizer_manager.py L939-L940
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SCHED, 'L1947-L1950')} kind="code">
              scheduler.py L1947-L1950
            </Cite>
            . Its <code>mode</code> decides what happens to the requests already running{' '}
            <Cite tier={1} href={sglangUrl(IO, 'L1921-L1940')}>
              io_struct.py L1921-L1940
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(RL_DOCS, 'L653-L655')}>
              SGLang docs: pause modes
            </Cite>
            . The flush column is our reading of the scheduler code, not run.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={PAUSE_ROWS}
            columnDefinitions={[
              { id: 'mode', header: 'Pause mode', cell: (r) => r.mode, minWidth: 120 },
              { id: 'running', header: 'Requests already running', cell: (r) => r.running, minWidth: 260 },
              { id: 'flush', header: 'Can a refit flush the cache during the pause?', cell: (r) => r.flush, minWidth: 220 },
            ]}
          />
          <Box variant="p">
            Every weight-update request carries <code>flush_cache: true</code> unless the caller
            turns it off{' '}
            <Cite tier={1} href={sglangUrl(IO, 'L1966-L2070')}>
              io_struct.py L1966-L2070
            </Cite>
            . After a load, the scheduler resets the radix tree and clears the KV pools, the grammar
            cache and any draft model&apos;s cache pool, but only when it is idle; a paused engine
            ignores its waiting queue for that check, which is why <code>retract</code> and a refit
            compose{' '}
            <Cite tier={1} href={sglangUrl(SCHED, 'L5348-L5375')} kind="code">
              scheduler.py L5348-L5375
            </Cite>
            . A flush refused because requests are still running or queued turns the update into a
            failure: HTTP 400 with <code>Weights were updated, but the cache was not flushed</code>,
            sent after the new weights are already in place{' '}
            <Cite tier={1} href={sglangUrl(WU, 'L120-L133')}>
              weight_updater.py L120-L133
            </Cite>
            . The documented order is pause, update, continue{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(RL_DOCS, 'L618')}>
              SGLang docs: SGLang for RL L618
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="What the flush and the update lock check, in code">
            <SpaceBetween size="s">
              <Box variant="p">
                The scheduler counts as idle when its running batch is empty, no chunked prefill is
                in progress, no overlapped result is pending and, unless the engine is paused, the
                waiting queue is empty{' '}
                <Cite tier={1} href={sglangUrl(SCHED, 'L5168-L5200')} kind="code">
                  scheduler.py L5168-L5200
                </Cite>
                . A refused flush logs <code>Cache not flushed because there are pending
                requests</code> with the queue and running counts, the line to search for when a
                refit returns 400{' '}
                <Cite tier={1} href={sglangUrl(SCHED, 'L5368-L5375')} kind="code">
                  scheduler.py L5368-L5375
                </Cite>
                .
              </Box>
              <Box variant="p">
                Without a pause, a tensor or NCCL update takes the TokenizerManager&apos;s writer lock{' '}
                <Cite tier={1} href={sglangUrl(TCM, 'L499-L529')} kind="code">
                  tokenizer_control_mixin.py L499-L529
                </Cite>
                , and every generate request holds the reader lock from tokenization until its
                response completes{' '}
                <Cite tier={1} href={sglangUrl(TM, 'L942-L958')} kind="code">
                  tokenizer_manager.py L942-L958
                </Cite>
                , so the update waits for all in-flight requests to finish. Passing{' '}
                <code>abort_all_requests: true</code> on the update aborts them first instead{' '}
                <Cite tier={1} href={sglangUrl(TCM, 'L509-L510')} kind="code">
                  tokenizer_control_mixin.py L509-L510
                </Cite>
                . A pause in <code>abort</code> mode aborts every request and polls once a second
                until none holds the lock{' '}
                <Cite tier={1} href={sglangUrl(TM, 'L2266-L2279')} kind="code">
                  tokenizer_manager.py L2266-L2279
                </Cite>
                ; <code>retract</code> instead pulls running requests out of the batch and frees
                their KV inside the scheduler{' '}
                <Cite tier={1} href={sglangUrl(SCHED, 'L5604-L5700')} kind="code">
                  scheduler.py L5604-L5700
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
            description="Choose disk, an NCCL broadcast or CUDA IPC handles from where the trainer's weights live, and know which paths need the session bracket"
          >
            Pick the refit path your training topology implies
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            SGLang offers several refit paths, each a server route, and the table covers the four a
            trainer drives{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L1265-L1491')}>
              http_server.py L1265-L1491
            </Cite>
            . The docs recommend disk for elastic scaling and checkpointing, tensors for colocated
            training and rollout, and a distributed group for disaggregated setups{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(RL_DOCS, 'L110-L114')}>
              SGLang docs: how to choose
            </Cite>
            . NCCL carries the disaggregated path, and CUDA IPC handles carry the colocated one.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={PATH_ROWS}
            columnDefinitions={[
              { id: 'path', header: 'Path', cell: (r) => r.path, minWidth: 110 },
              { id: 'fits', header: 'Fits', cell: (r) => r.fits, minWidth: 170 },
              { id: 'calls', header: 'Calls', cell: (r) => r.calls, minWidth: 190 },
              { id: 'bytes', header: 'Where the weight bytes travel', cell: (r) => r.bytes, minWidth: 190 },
              { id: 'session', header: 'Session bracket', cell: (r) => r.session, minWidth: 100 },
              { id: 'src', header: 'Source', cell: (r) => r.src, minWidth: 160 },
            ]}
          />
          <Box variant="p">
            On the NCCL path the trainer creates the group as rank 0, and each rollout GPU joins at{' '}
            <code>rank_offset + tp_rank</code>; <code>load_format: &quot;flattened_bucket&quot;</code>{' '}
            packs a bucket of tensors into one broadcast{' '}
            <Cite tier={1} href={sglangUrl(MR_WU, 'L100-L144')}>
              weight_updater.py (model runner) L100-L144
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(BUCKET, 'L19-L40')}>
              tensor_bucket.py L19-L40
            </Cite>
            . For a colocated FSDP (Fully Sharded Data Parallel) or DTensor trainer,{' '}
            <code>sglang.srt.weight_sync.utils.update_weights</code> turns each tensor into a CUDA
            IPC handle, gathers the handles per inference TP (tensor parallelism) rank and sends
            them through <code>update_weights_from_tensor</code>{' '}
            <Cite tier={1} href={sglangUrl(WSYNC, 'L16-L60')}>
              weight_sync/utils.py L16-L60
            </Cite>
            . A trainer that embeds the engine in its own process calls the same operations as{' '}
            <code>sgl.Engine</code> methods; <code>engine.py</code> at the tag defines no pause or
            continue method, so the pause modes above are server routes{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L1494-L1830')} kind="code">
              engine.py L1494-L1830
            </Cite>
            .
          </Box>
          <Box variant="p">
            Tensor and NCCL updates run inside a session. <code>/begin_weight_update</code> restores
            the few quantization schemes whose kernel layout changes parameter shapes, the update
            calls write checkpoint-format values, and <code>/end_weight_update</code> converts every
            quantized layer to kernel layout once, so that cost is paid once per refit rather than
            once per bucket{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(RL_DOCS, 'L331-L345')}>
              SGLang docs: weight update session
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MR_WU, 'L318-L328')}>
              weight_updater.py (model runner) L318-L328
            </Cite>
            . An update outside a session, a second begin, or an end without one returns{' '}
            <code>success: false</code> (HTTP 400) and leaves the weights untouched{' '}
            <Cite tier={1} href={sglangUrl(WU, 'L187-L336')}>
              weight_updater.py L187-L336
            </Cite>
            . An integration written for a release before v0.5.21 must add the bracket and replace
            the old <code>disable_draft_model</code> field with <code>selector: &quot;target&quot;</code>{' '}
            <Cite tier={1} href={REL_0521}>
              SGLang v0.5.21 release notes
            </Cite>
            . Under speculative decoding (section 11), <code>selector</code> sends weights to the
            target, the draft or both, and defaults to <code>all</code>{' '}
            <Cite tier={1} href={sglangUrl(IO, 'L2011')}>
              io_struct.py L2011
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Getting buckets right.</strong> Flush once: each bucket call flushes by default,
            so send <code>flush_cache: false</code> on every bucket but the last, and keep it true
            on the last one, or KV computed with the old weights survives the refit{' '}
            <Cite tier={1} href={sglangUrl(WU, 'L219-L227')} kind="code">
              weight_updater.py L219-L227
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L1667-L1689')}>
              engine.py L1667-L1689
            </Cite>
            . If a bucket&apos;s load raises, the call reports that the weights are partially
            updated and should be discarded{' '}
            <Cite tier={1} href={sglangUrl(MR_WU, 'L330-L346')} kind="code">
              weight_updater.py (model runner) L330-L346
            </Cite>
            ; our reading is that the safe recovery is to resend every bucket before continuing.
            Both the tensor and the NCCL paths assert one data-parallel replica per server,{' '}
            <code>--dp-size 1</code>, the default; attention data parallelism inside the TP group
            (section 14) is a separate setting{' '}
            <Cite tier={1} href={sglangUrl(TCM, 'L499-L567')} kind="code">
              tokenizer_control_mixin.py L499-L567
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(PARALLEL, 'L73-L90')}>
              parallel.py L73-L90
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Free the KV cache, weights and CUDA graphs between rollout phases, with the launch flag that decides whether anything is freed at all"
          >
            Colocated rollout: hand the GPU back to the trainer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            When trainer and rollout share GPUs, the server has to give its memory back while the
            trainer runs. <code>/release_memory_occupation</code> pauses three memory regions
            through the <code>torch_memory_saver</code> library: <code>kv_cache</code>,{' '}
            <code>weights</code> and <code>cuda_graph</code>, all three when <code>tags</code> is
            omitted. <code>/resume_memory_occupation</code> brings them back. Releasing{' '}
            <code>kv_cache</code> also flushes the radix cache{' '}
            <Cite tier={1} href={sglangUrl(WU, 'L337-L422')}>
              weight_updater.py L337-L422
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(CONSTS, 'L1-L10')}>
              constants.py L1-L10
            </Cite>
            . The release asserts that the server is idle, ignoring the waiting queue only while
            the engine is paused, so pause generation first{' '}
            <Cite tier={1} href={sglangUrl(WU, 'L337-L341')} kind="code">
              weight_updater.py L337-L341
            </Cite>
            .
          </Box>
          <Box variant="p">
            The release frees memory only on a server started with{' '}
            <code>--enable-memory-saver</code>, which is off by default{' '}
            <Cite tier={1} href={sglangUrl(EXEC, 'L56-L59')}>
              exec_.py L56-L59
            </Cite>
            . Without it the memory saver is a no-op object: the call succeeds, flushes the cache
            and frees nothing{' '}
            <Cite tier={1} href={sglangUrl(TMS, 'L27-L51')} kind="code">
              torch_memory_saver_adapter.py L27-L51
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(TMS, 'L139-L170')} kind="code">
              L139-L170
            </Cite>
            . A success response does not show that memory was freed; read the GPU&apos;s free
            memory after the first release in a new deployment. <code>--enable-weights-cpu-backup</code> saves
            the weights to CPU memory on release and restores them on resume{' '}
            <Cite tier={1} href={sglangUrl(EXEC, 'L60-L63')}>
              exec_.py L60-L63
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="The documentation lists two memory tags; the code has three">
            <Box variant="p">
              The release request&apos;s <code>tags</code> field is documented with the values{' '}
              <code>kv_cache</code> and <code>weights</code>{' '}
              <Cite tier={1} href={sglangDocsSrcUrl(RL_DOCS, 'L38-L72')} kind="doc-code-conflict">
                SGLang docs: release memory
              </Cite>
              . v0.5.22&apos;s code also accepts <code>cuda_graph</code>, and an omitted{' '}
              <code>tags</code> releases all three{' '}
              <Cite tier={1} href={sglangUrl(CONSTS, 'L1-L10')}>
                constants.py L1-L10
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(WU, 'L345-L379')}>
                weight_updater.py L345-L379
              </Cite>
              , so name <code>cuda_graph</code> explicitly when a partial release should keep the
              captured graphs resident.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Label each refit so a response that spans one tells the trainer, token by token, which weights produced it"
          >
            Know which weights produced each token
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every response&apos;s <code>meta_info</code> carries a <code>weight_version</code>,{' '}
            <code>default</code> until something sets it{' '}
            <Cite tier={1} href={sglangUrl(SERVING, 'L166-L169')}>
              serving.py L166-L169
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(TM, 'L2505-L2511')}>
              tokenizer_manager.py L2505-L2511
            </Cite>
            . Pass <code>weight_version</code> on the update call. When it changes, the scheduler
            records the switch for every live request that already has output tokens and logs{' '}
            <code>Weight version changed</code> with the count{' '}
            <Cite tier={1} href={sglangUrl(SCHED, 'L5419-L5438')} kind="code">
              scheduler.py L5419-L5438
            </Cite>
            . A request that spans the refit, such as one retracted at step 1 and recomputed after
            step 5, then reports <code>weight_versions</code>: half-open <code>[start, end)</code>{' '}
            ranges over output-token indices, prompt excluded, one per version{' '}
            <Cite tier={1} href={sglangUrl(VERSIONS, 'L90-L107')}>
              weight_versions.py L90-L107
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(RL_DOCS, 'L598-L611')}>
              SGLang docs: per-token weight version
            </Cite>
            . An off-policy correction can then tell which tokens came from which weights.
          </Box>
          <Box variant="p">
            <code>/update_weight_version</code> relabels the server without loading weights. The
            documentation describes it as relabelling a request while it is still generating{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(RL_DOCS, 'L600')} kind="doc-code-conflict">
              SGLang docs: SGLang for RL L600
            </Cite>
            ; v0.5.22&apos;s request body defaults to <code>abort_all_requests: true</code>, so it
            aborts in-flight requests unless the call sends <code>false</code>{' '}
            <Cite tier={1} href={sglangUrl(IO, 'L2149-L2153')}>
              io_struct.py L2149-L2153
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L1492-L1500')}>
              http_server.py L1492-L1500
            </Cite>
            . Putting <code>weight_version</code> on the update call itself avoids the question. The
            current label is in <code>/model_info</code>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L796-L810')}>
              http_server.py L796-L810
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Decide whether bit-identical rollouts are worth the 34.35% average slowdown the SGLang team reported in 2025, and pick a backend that keeps the radix cache"
          >
            Deterministic rollouts: what the flag changes and what it costs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Rollout and training often compute the same token probabilities with different kernels
            and batch shapes, so the two drift apart even with identical weights; the docs call this
            the training-inference mismatch{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(RL_DOCS, 'L663-L665')}>
              SGLang docs: deterministic inference for RL
            </Cite>
            . <code>--enable-deterministic-inference</code>, off by default, makes a request&apos;s
            output independent of what it is batched with{' '}
            <Cite tier={1} href={sglangUrl(EXEC, 'L1073-L1075')}>
              exec_.py L1073-L1075
            </Cite>
            :
          </Box>
          <ul>
            <li>
              PyTorch&apos;s <code>mm</code>, <code>addmm</code>, <code>_log_softmax</code> and{' '}
              <code>mean.dim</code> (and <code>bmm</code>) are replaced by batch-invariant
              kernels{' '}
              <Cite tier={1} href={sglangUrl(BIO, 'L1004-L1021')}>
                batch_invariant_ops.py L1004-L1021
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(RUNNER, 'L825-L829')}>
                model_runner.py L825-L829
              </Cite>
              .
            </li>
            <li>
              The sampler is forced to PyTorch, and FlashInfer all-reduce fusion is turned off{' '}
              <Cite tier={1} href={sglangUrl(OVERRIDES, 'L988-L1031')}>
                overrides.py L988-L1031
              </Cite>
              .
            </li>
            <li>
              With TP above 1 on CUDA, NCCL runs <code>allreduce:tree</code> with a pinned channel
              count, and custom and symmetric-memory all-reduce are disabled{' '}
              <Cite tier={1} href={sglangUrl(ATTN_HOOK, 'L667-L699')} kind="code">
                attention_hook.py L667-L699
              </Cite>
              .
            </li>
            <li>
              An unset attention backend becomes <code>fa3</code> on Hopper and older GPUs,{' '}
              <code>flashinfer</code> on Blackwell, and <code>triton</code> for DeepSeek-family
              models on Blackwell; an explicit backend outside six accepted names stops the server
              at start{' '}
              <Cite tier={1} href={sglangUrl(OVERRIDES, 'L1033-L1063')}>
                overrides.py L1033-L1063
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(CHOICES, 'L113-L120')}>
                choices.py L113-L120
              </Cite>
              .
            </li>
          </ul>
          <Box variant="p">
            Seeded sampling (<code>sampling_seed</code>) keeps output reproducible above
            temperature 0{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DET_DOCS, 'L140-L190')}>
              SGLang docs: deterministic inference
            </Cite>
            . <code>--rl-on-policy-target fsdp</code> turns the mode on as part of matching an FSDP
            trainer{' '}
            <Cite tier={1} href={sglangUrl(ATTN_HOOK, 'L579-L591')}>
              attention_hook.py L579-L591
            </Cite>
            ; fully on-policy training also needs the trainer to run the same deterministic
            kernels{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(RL_DOCS, 'L665')}>
              SGLang docs: SGLang for RL L665
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Keeping the radix cache.</strong> Deterministic mode keeps the radix cache only
            with <code>fa3</code>, <code>fa4</code>, <code>triton</code> or <code>ascend</code>;
            with <code>flashinfer</code> it turns the cache off{' '}
            <Cite tier={1} href={sglangUrl(ATTN_HOOK, 'L655-L663')}>
              attention_hook.py L655-L663
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(CHOICES, 'L247')}>
              choices.py L247
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DET_DOCS, 'L40-L54')}>
              SGLang docs: backend compatibility table
            </Cite>
            . On Blackwell the unset backend resolves to <code>flashinfer</code>, so by our reading
            of the code, not run, a deterministic rollout server there runs with no prefix reuse
            unless <code>--attention-backend</code> names another accepted backend that the GPU
            supports (section 8, Attention Backends and Kernels).
          </Box>
          <Box variant="p">
            <strong>What it costs.</strong> On the LMSYS (Large Model Systems Organization) blog in
            September 2025, the SGLang team reported an average slowdown of 34.35% with the
            FlashInfer and FA3 (FlashAttention 3) backends, against 61.5% for Thinking Machines
            Lab&apos;s batch-invariant kernels, whose conditions the post does not state. The setup
            was Qwen3-8B at TP 1 on one H200, end-to-end latency over three RL rollout workloads of
            256 requests at lengths of 1,024, 4,096 and 8,192, with the radix cache disabled for all
            benchmarks{' '}
            <Cite tier={2} href={LMSYS_DET}>
              LMSYS blog, 2025-09-22 (project claim)
            </Cite>
            . The v0.5.22 deterministic-inference docs publish no cost figure, and the claim
            predates v0.5.22. Budget the mode as a real slowdown and measure it on your own model.
          </Box>
          <ExpandableSection headerText="Where the deterministic-inference docs and v0.5.22's code disagree">
            <SpaceBetween size="s">
              <Box variant="p">
                The documentation says deterministic inference supports three attention backends,
                FlashInfer, FA3 and Triton{' '}
                <Cite tier={1} href={sglangDocsSrcUrl(DET_DOCS, 'L24-L28')} kind="doc-code-conflict">
                  SGLang docs: supported backends
                </Cite>
                . v0.5.22&apos;s validator accepts six, adding <code>fa4</code>,{' '}
                <code>ascend</code> and <code>intel_xpu</code>{' '}
                <Cite tier={1} href={sglangUrl(CHOICES, 'L113-L120')}>
                  choices.py L113-L120
                </Cite>
                ; treat those three as accepted, with no published compatibility table.
              </Box>
              <Box variant="p">
                The documentation gives <code>--attention-backend</code> a default of{' '}
                <code>fa3</code> for this mode{' '}
                <Cite tier={1} href={sglangDocsSrcUrl(DET_DOCS, 'L104-L110')} kind="doc-code-conflict">
                  SGLang docs: server arguments
                </Cite>
                . The code picks <code>fa3</code> only on Hopper and older GPUs and{' '}
                <code>flashinfer</code> on Blackwell, which also turns the radix cache off{' '}
                <Cite tier={1} href={sglangUrl(OVERRIDES, 'L1041-L1052')}>
                  overrides.py L1041-L1052
                </Cite>
                , so set the backend explicitly on Blackwell.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Start a rollout server with the flags an RL integration needs, and check them before the first refit"
          >
            Launching a rollout server
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Three flags carry this section. <code>--enable-memory-saver</code> for colocated
            rollout, so a release frees memory. <code>--admin-api-key</code>, because every refit
            and memory route is an admin route: with no key set they accept any client that can
            reach the port, which is the local host at the default 127.0.0.1 bind and the network
            once <code>--host 0.0.0.0</code> is set{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L1423-L1453')}>
              http_server.py L1423-L1453
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(AUTH, 'L133-L143')}>
              auth.py L133-L143
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SERVING, 'L65-L66')}>
              serving.py L65-L66
            </Cite>
            . With the key set, the trainer sends it as <code>Authorization: Bearer</code>{' '}
            <Cite tier={1} href={sglangUrl(AUTH, 'L108-L117')}>
              auth.py L108-L117
            </Cite>
            ; section 12 lays out what each combination of keys opens. Optionally,{' '}
            <code>--enable-deterministic-inference</code>, budgeted against the 34.35% average
            slowdown the SGLang team reported in 2025.
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
            <code>{LAUNCH_LINE}</code>
          </pre>
          <Box variant="p">
            The refit itself, on the NCCL path after one <code>/init_weights_update_group</code>{' '}
            call per training job:
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
            <code>{REFIT_CALLS}</code>
          </pre>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            header={<Header variant="h3">The flags this section explains</Header>}
            items={FLAG_ROWS}
            columnDefinitions={[
              { id: 'flag', header: 'Flag', cell: (r) => <code>{r.flag}</code>, minWidth: 200 },
              { id: 'def', header: 'Default at v0.5.22', cell: (r) => r.def, minWidth: 130 },
              { id: 'effect', header: 'What it does for a rollout server', cell: (r) => r.effect, minWidth: 240 },
              { id: 'src', header: 'Source', cell: (r) => r.src, minWidth: 150 },
            ]}
          />
          <Box variant="p">
            <strong>Before the first refit:</strong> send refit calls to every rollout server
            directly. The in-tree gateway forwards <code>/flush_cache</code> to every worker, and a
            search of its source at the tag finds no weight-update route{' '}
            <Cite tier={1} href={sglangUrl(GATEWAY, 'L401-L402')} kind="code">
              server.rs L401-L402
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(GATEWAY, 'L609')} kind="code">
              server.rs L609
            </Cite>
            . Check which SGLang your RL framework installs: each pins its own release, and of the
            frameworks checked for this dive only Miles tracks v0.5.22 (section 24, Ecosystem and
            Production Users). By our reading of the v0.5.21 release note, a framework pinned to an
            earlier release must add the session bracket before it can drive a v0.5.22 server. After
            the first refit, confirm that a response reports the new <code>weight_version</code>{' '}
            and, when colocated, that the release freed GPU memory.
          </Box>
          <Box variant="p">
            <strong>Against vLLM:</strong> both engines expose what an RL trainer needs. vLLM
            registers its sleep, wake-up, pause, <code>collective_rpc</code> and weight-transfer
            routes only when <code>VLLM_SERVER_DEV_MODE=1</code> (default 0), with no key check{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/entrypoints/launchers/api_server/routers.py', 'L33-L36')}
            >
              vLLM routers.py L33-L36
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L1453')}>
              vLLM envs.py L1453
            </Cite>
            . SGLang registers its refit routes on every server, so set{' '}
            <code>--admin-api-key</code> or keep the port on a private network before the trainer
            connects ({VLLM_SERVER_LINK}).
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
