import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangTreeUrl } from '../../components/Cite';

const SRT = 'python/sglang/srt';
const CLI_MAIN = 'python/sglang/cli/main.py';
const CLI_SERVE = 'python/sglang/cli/serve.py';
const LAUNCH = 'python/sglang/launch_server.py';
const SERVER_ARGS = `${SRT}/server_args.py`;
const PIPELINE = `${SRT}/arg_groups/pipeline.py`;
const OVERRIDES = `${SRT}/arg_groups/overrides.py`;
const RES_HOOKS = `${SRT}/arg_groups/resolution_hooks.py`;
const MEMORY_HOOK = `${SRT}/arg_groups/memory_hook.py`;
const PARALLEL_HOOK = `${SRT}/arg_groups/parallel_hook.py`;
const MODEL_HOOK = `${SRT}/arg_groups/model_hook.py`;
const SPEC_HOOK = `${SRT}/arg_groups/speculative_hook.py`;
const ATTN_HOOK = `${SRT}/arg_groups/attention_hook.py`;
const SCHED_FIELDS = `${SRT}/arg_groups/fields/schedule.py`;
const RUNTIME_CTX = `${SRT}/runtime_context.py`;
const HTTP = `${SRT}/entrypoints/http_server.py`;
const ENGINE = `${SRT}/entrypoints/engine.py`;
const SCHEDULER = `${SRT}/managers/scheduler.py`;
const RATIO = `${SRT}/managers/scheduler_components/new_token_ratio_tracker.py`;
const POLICY = `${SRT}/managers/schedule_policy.py`;
const KV_CONF = `${SRT}/mem_cache/kv_cache_configurator.py`;
const DOCS_ARGS = 'docs/docs/advanced_features/server_arguments.mdx';
const DOCS_SPEC = 'docs/docs/advanced_features/speculative_decoding.mdx';
const DOCS_ALLOW = 'docs/docs/advanced_features/server_arguments_undocumented.txt';
const DOCS_TEST = 'test/registered/unit/server_args/test_server_args_docs_coverage.py';

/* ------------------------------------------------------------------------ */
/* The module map                                                           */
/* ------------------------------------------------------------------------ */

type BoxKind = 'launch' | 'core' | 'client' | 'breadth' | 'side' | 'outside';

interface MapBox {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  kind: BoxKind;
}

const LAUNCH_BOXES: MapBox[] = [
  { x: 20, y: 38, w: 160, h: 44, title: 'cli/serve.py', sub: 'sglang serve', kind: 'launch' },
  { x: 210, y: 38, w: 170, h: 44, title: 'launch_server.py', sub: 'calls resolve_once()', kind: 'launch' },
  {
    x: 410,
    y: 38,
    w: 240,
    h: 44,
    title: 'server_args.py, arg_groups/',
    sub: 'fields, then 81 named hooks',
    kind: 'launch',
  },
  {
    x: 680,
    y: 38,
    w: 200,
    h: 44,
    title: 'entrypoints/engine.py',
    sub: 'starts the processes below',
    kind: 'launch',
  },
];

const PATH_BOXES: MapBox[] = [
  { x: 20, y: 126, w: 100, h: 44, title: 'client', kind: 'client' },
  { x: 150, y: 126, w: 194, h: 44, title: 'entrypoints/', sub: 'HTTP, OpenAI, native routes', kind: 'core' },
  {
    x: 374,
    y: 126,
    w: 250,
    h: 44,
    title: 'managers/tokenizer_manager.py',
    sub: 'tokenize, track, stream back',
    kind: 'core',
  },
  { x: 150, y: 212, w: 194, h: 44, title: 'mem_cache/', sub: 'radix tree, KV pools', kind: 'core' },
  {
    x: 374,
    y: 212,
    w: 250,
    h: 44,
    title: 'managers/scheduler.py',
    sub: 'batch, admit, retract',
    kind: 'core',
  },
  {
    x: 654,
    y: 212,
    w: 226,
    h: 44,
    title: 'model_executor/',
    sub: 'ModelRunner, CUDA graphs',
    kind: 'core',
  },
  {
    x: 374,
    y: 372,
    w: 250,
    h: 42,
    title: 'managers/detokenizer_manager.py',
    sub: 'token ids to text',
    kind: 'core',
  },
];

const SIDE_CHIPS: MapBox[] = [
  { x: 20, y: 282, w: 140, h: 28, title: 'constrained/', kind: 'side' },
  { x: 176, y: 282, w: 140, h: 28, title: 'speculative/', kind: 'side' },
  { x: 20, y: 318, w: 140, h: 28, title: 'disaggregation/', kind: 'side' },
  { x: 176, y: 318, w: 140, h: 28, title: 'lora/', kind: 'side' },
];

const OUTSIDE_CHIPS: MapBox[] = [
  { x: 230, y: 454, w: 220, h: 28, title: 'sgl-model-gateway/ (Rust gateway)', kind: 'outside' },
  { x: 462, y: 454, w: 232, h: 28, title: 'rust/ (frontend, radix tree core)', kind: 'outside' },
  { x: 708, y: 454, w: 172, h: 28, title: 'python/sglang/kernels/', kind: 'outside' },
];

function renderBox(b: MapBox) {
  const cx = b.x + b.w / 2;
  const cls = `cb-arch-box-${b.kind}`;
  const titleCls = b.kind === 'side' || b.kind === 'outside' ? 'cb-arch-chip-t' : 'cb-arch-t';
  return (
    <g key={`${b.title}-${b.x}-${b.y}`}>
      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={6} className={cls} />
      {b.sub ? (
        <>
          <text x={cx} y={b.y + 18} className={titleCls}>
            {b.title}
          </text>
          <text x={cx} y={b.y + 34} className="cb-arch-s">
            {b.sub}
          </text>
        </>
      ) : (
        <text x={cx} y={b.y + b.h / 2 + 4} className={titleCls}>
          {b.title}
        </text>
      )}
    </g>
  );
}

function StepMark({ n, x, y }: { n: number; x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={8} className="cb-arch-step" />
      <text x={x} y={y + 3.5} className="cb-arch-step-t">
        {n}
      </text>
    </g>
  );
}

function ModuleMapDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 496"
        role="img"
        aria-labelledby="cb-arch-map-title"
        aria-describedby="cb-arch-map-desc"
        style={{ width: '100%', minWidth: 720, height: 'auto' }}
      >
        <title id="cb-arch-map-title">
          The SGLang source tree as one request meets it. A launch runs once through cli/serve.py,
          launch_server.py, the argument resolution in server_args.py and arg_groups/, and
          entrypoints/engine.py, which starts the processes. A request then enters entrypoints/ and
          the TokenizerManager in the main process, crosses ZMQ (ZeroMQ) to the scheduler, which matches
          prefixes in mem_cache/ and runs the forward through model_executor/ into models/ and
          layers/; its token ids go to the detokenizer, whose text returns to the TokenizerManager.
        </title>
        <desc id="cb-arch-map-desc">
          models/ and layers/ are drawn as the largest box because they hold over 40% of the
          runtime&apos;s lines and grow with every model and kernel added. Request features such as
          constrained/, speculative/, disaggregation/ and lora/ sit beside the path, drawn in the
          scheduler process, where most of their code runs. The gateway, the Rust crates and the in-tree kernel library live
          outside python/sglang/srt/.
        </desc>
        <style>{`
          .cb-arch-lane-launch { fill: #f4f4f4; stroke: #d1d5db; stroke-width: 1; }
          .cb-arch-lane-main { fill: #ffffff; stroke: #d1d5db; stroke-width: 1; }
          .cb-arch-lane-sched { fill: #f2f8fd; stroke: #d1d5db; stroke-width: 1; }
          .cb-arch-lane-detok { fill: #ffffff; stroke: #d1d5db; stroke-width: 1; }
          .cb-arch-lane-out { fill: #e6f4f2; stroke: #d1d5db; stroke-width: 1; }
          .cb-arch-lane-h { fill: #414d5c; font: 600 11px sans-serif; }
          .cb-arch-box-launch { fill: #ffffff; stroke: #879596; stroke-width: 1.2; }
          .cb-arch-box-core { fill: #ffffff; stroke: #0972d3; stroke-width: 2; }
          .cb-arch-box-client { fill: #ffffff; stroke: #879596; stroke-width: 1.2; stroke-dasharray: 4 3; }
          .cb-arch-box-breadth { fill: #ffffff; stroke: #414d5c; stroke-width: 1.4; }
          .cb-arch-box-side { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.2; stroke-dasharray: 4 3; }
          .cb-arch-box-outside { fill: #ffffff; stroke: #1f7a70; stroke-width: 1.2; }
          .cb-arch-t { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .cb-arch-chip-t { fill: #16191f; font: 600 11px sans-serif; text-anchor: middle; }
          .cb-arch-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .cb-arch-side-h { fill: #6f4cc4; font: 600 11px sans-serif; }
          .cb-arch-edge { stroke: #5f6b7a; stroke-width: 1.4; fill: none; }
          .cb-arch-path { stroke: #0972d3; stroke-width: 1.8; fill: none; }
          .cb-arch-path-t { fill: #065299; font: 600 11px sans-serif; }
          .cb-arch-step { fill: #0972d3; }
          .cb-arch-step-t { fill: #ffffff; font: 600 10px sans-serif; text-anchor: middle; }
        `}</style>
        <defs>
          <marker
            id="cb-arch-ah"
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
            id="cb-arch-ah-blue"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#0972d3" />
          </marker>
        </defs>

        <rect x={0} y={0} width={900} height={496} rx={8} fill="#ffffff" />

        {/* Lanes */}
        <rect x={8} y={8} width={884} height={84} rx={6} className="cb-arch-lane-launch" />
        <text x={20} y={27} className="cb-arch-lane-h">
          Launch, once, in the process you start
        </text>
        <rect x={8} y={100} width={884} height={78} rx={6} className="cb-arch-lane-main" />
        <text x={20} y={118} className="cb-arch-lane-h">
          Main process: HTTP server and TokenizerManager
        </text>
        <rect x={8} y={186} width={884} height={170} rx={6} className="cb-arch-lane-sched" />
        <text x={20} y={204} className="cb-arch-lane-h">
          Scheduler process, one per GPU: plans and runs every step
        </text>
        <rect x={8} y={364} width={884} height={56} rx={6} className="cb-arch-lane-detok" />
        <text x={20} y={382} className="cb-arch-lane-h">
          Detokenizer process
        </text>
        <rect x={8} y={428} width={884} height={60} rx={6} className="cb-arch-lane-out" />
        <text x={20} y={446} className="cb-arch-lane-h">
          Outside python/sglang/srt/
        </text>

        {/* Launch chain */}
        {LAUNCH_BOXES.map(renderBox)}
        <line x1={180} y1={60} x2={208} y2={60} className="cb-arch-edge" markerEnd="url(#cb-arch-ah)" />
        <line x1={380} y1={60} x2={408} y2={60} className="cb-arch-edge" markerEnd="url(#cb-arch-ah)" />
        <line x1={650} y1={60} x2={678} y2={60} className="cb-arch-edge" markerEnd="url(#cb-arch-ah)" />

        {/* Request path boxes */}
        {PATH_BOXES.map(renderBox)}

        {/* Breadth: models/ and layers/ */}
        <rect x={454} y={276} width={426} height={72} rx={6} className="cb-arch-box-breadth" />
        <text x={667} y={296} className="cb-arch-t">
          models/ and layers/
        </text>
        <text x={667} y={314} className="cb-arch-s">
          247 model files; attention, MoE and quantization kernels
        </text>
        <text x={667} y={332} className="cb-arch-s">
          over 40% of the runtime&apos;s lines; open it for one model
        </text>

        {/* Features beside the path */}
        <text x={20} y={274} className="cb-arch-side-h">
          beside the path
        </text>
        {SIDE_CHIPS.map(renderBox)}

        {/* Outside srt */}
        {OUTSIDE_CHIPS.map(renderBox)}

        {/* 1: client to entrypoints */}
        <line x1={120} y1={148} x2={148} y2={148} className="cb-arch-path" markerEnd="url(#cb-arch-ah-blue)" />
        <StepMark n={1} x={135} y={163} />
        {/* 2: entrypoints to TokenizerManager */}
        <line x1={344} y1={148} x2={372} y2={148} className="cb-arch-path" markerEnd="url(#cb-arch-ah-blue)" />
        <StepMark n={2} x={359} y={163} />
        {/* 3: TokenizerManager to scheduler over ZMQ */}
        <line x1={499} y1={170} x2={499} y2={210} className="cb-arch-path" markerEnd="url(#cb-arch-ah-blue)" />
        <StepMark n={3} x={483} y={192} />
        <text x={507} y={196} className="cb-arch-path-t">
          ZMQ
        </text>
        {/* 4: scheduler and mem_cache */}
        <line
          x1={372}
          y1={234}
          x2={346}
          y2={234}
          className="cb-arch-path"
          markerStart="url(#cb-arch-ah-blue)"
          markerEnd="url(#cb-arch-ah-blue)"
        />
        <StepMark n={4} x={359} y={249} />
        {/* 5: scheduler to model_executor */}
        <line x1={624} y1={234} x2={652} y2={234} className="cb-arch-path" markerEnd="url(#cb-arch-ah-blue)" />
        <StepMark n={5} x={639} y={249} />
        {/* 6: model_executor into models/ and layers/ */}
        <line x1={767} y1={256} x2={767} y2={274} className="cb-arch-path" markerEnd="url(#cb-arch-ah-blue)" />
        <StepMark n={6} x={785} y={265} />
        {/* 7: sampled token ids to the detokenizer */}
        <line x1={414} y1={256} x2={414} y2={370} className="cb-arch-path" markerEnd="url(#cb-arch-ah-blue)" />
        <StepMark n={7} x={430} y={330} />
        <text x={406} y={300} className="cb-arch-path-t" textAnchor="end">
          token ids
        </text>
        {/* 8: text back to the TokenizerManager */}
        <path d="M624,393 L886,393 L886,148 L626,148" className="cb-arch-path" markerEnd="url(#cb-arch-ah-blue)" />
        <StepMark n={8} x={700} y={162} />
        <text x={755} y={140} className="cb-arch-path-t" textAnchor="middle">
          text back to the TokenizerManager
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Reading path                                                             */
/* ------------------------------------------------------------------------ */

interface StopRow {
  id: string;
  stop: string;
  file: ReactNode;
  owns: ReactNode;
}

const LAUNCH_STOPS: StopRow[] = [
  {
    id: 'cli',
    stop: '1',
    file: (
      <>
        <Cite tier={1} href={sglangUrl(CLI_MAIN, 'L46-L51')}>
          cli/main.py L46-L51
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(CLI_SERVE, 'L171-L215')}>
          cli/serve.py L171-L215
        </Cite>
      </>
    ),
    owns: (
      <>
        <code>sglang serve</code> loads plugins, then hands the arguments to one of its two built-in
        serving backends, detected from the model or forced with <code>--model-type</code>: the LLM (large
        language model) runtime, or SGLang Diffusion (L134-L147). Diffusion is a separate engine under <code>python/sglang/multimodal_gen/</code>, so
        you can leave that tree closed for text serving.
      </>
    ),
  },
  {
    id: 'parse',
    stop: '2',
    file: (
      <>
        <Cite tier={1} href={sglangUrl(CLI_SERVE, 'L91-L100')}>
          cli/serve.py L91-L100
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(SERVER_ARGS, 'L654-L706')}>
          server_args.py L654-L706
        </Cite>
      </>
    ),
    owns: (
      <>
        <code>prepare_server_args</code> parses the command line into a raw <code>ServerArgs</code>{' '}
        record and keeps the launch command on it. Nothing is resolved yet.
      </>
    ),
  },
  {
    id: 'assemble',
    stop: '3',
    file: (
      <Cite tier={1} href={sglangUrl(SERVER_ARGS, 'L509-L551')}>
        server_args.py L509-L551
      </Cite>
    ),
    owns: (
      <>
        <code>ServerArgs</code> is assembled from 21 namespace classes declared in the 12 files of{' '}
        <Cite tier={1} href={sglangTreeUrl(`${SRT}/arg_groups/fields`)}>
          arg_groups/fields/
        </Cite>
        , one field per flag.
      </>
    ),
  },
  {
    id: 'run',
    stop: '4',
    file: (
      <Cite tier={1} href={sglangUrl(LAUNCH, 'L17-L67')}>
        launch_server.py L17-L67
      </Cite>
    ),
    owns: (
      <>
        <code>run_server</code> calls <code>resolve_once()</code> at L29, then picks the HTTP
        server, the legacy <code>--smg-grpc-mode</code> gRPC server, Ray or the encoder server. Running{' '}
        <code>python -m sglang.launch_server</code> still works and warns that{' '}
        <code>sglang serve</code> is the recommended entrypoint (L70-L77).
      </>
    ),
  },
  {
    id: 'resolve',
    stop: '5',
    file: (
      <>
        <Cite tier={1} href={sglangUrl(SERVER_ARGS, 'L243-L299')}>
          server_args.py L243-L299
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(PIPELINE, 'L20-L353')}>
          pipeline.py L20-L353
        </Cite>
      </>
    ),
    owns: (
      <>
        <code>resolve_once</code> runs the resolution pipeline once per record: 81 named hooks in a
        fixed order, 83 calls in all because two run twice, with four post-process passes and one
        finalize step among them. The next block explains what a step does.
      </>
    ),
  },
  {
    id: 'http',
    stop: '6',
    file: (
      <Cite tier={1} href={sglangUrl(HTTP, 'L2901-L2961')}>
        http_server.py L2901-L2961
      </Cite>
    ),
    owns: (
      <>
        <code>launch_server</code> starts the engine&apos;s processes, then serves the FastAPI app
        in front of the TokenizerManager.
      </>
    ),
  },
  {
    id: 'spawn',
    stop: '7',
    file: (
      <Cite tier={1} href={sglangUrl(ENGINE, 'L1121-L1370')}>
        engine.py L1121-L1370
      </Cite>
    ),
    owns: (
      <>
        <code>Engine._launch_subprocesses</code> publishes the configuration for this process
        (L1169), logs <code>server_args=</code> (L1179), starts one scheduler process per GPU (L1215,
        body at L889-L987), then the detokenizer (L1317) and the TokenizerManager (L1325-L1333), and
        waits for the schedulers to load the model (L1338). <code>sglang.Engine</code> enters here
        too, so an offline job resolves flags the same way a server does.
      </>
    ),
  },
  {
    id: 'sched',
    stop: '8',
    file: (
      <Cite tier={1} href={sglangUrl(SCHEDULER, 'L6076-L6157')}>
        scheduler.py L6076-L6157
      </Cite>
    ),
    owns: (
      <>
        <code>run_scheduler_process</code>, inside each scheduler process: publishes the
        configuration for the scheduler role, builds the <code>Scheduler</code> and runs its loop.
        The Scheduler &amp; Batching tab starts here.
      </>
    ),
  },
];

const STOP_COLUMNS = [
  { id: 'stop', header: '#', cell: (r: StopRow) => r.stop, width: 50 },
  { id: 'file', header: 'File and lines (v0.5.22)', cell: (r: StopRow) => r.file, minWidth: 220 },
  { id: 'owns', header: 'What it owns', cell: (r: StopRow) => r.owns, minWidth: 320 },
];

/* ------------------------------------------------------------------------ */
/* The tab                                                                  */
/* ------------------------------------------------------------------------ */

export function CodebaseArchitecture() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h2"
            description="Know which directory owns each step of a request before you open a file, and which large directories you can leave closed"
          >
            The module map: where each step of a request lives
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Before the first request arrives, a launch line settles every flag to a value and starts
            the processes that serve. This tab follows both steps through the source, from{' '}
            <code>sglang serve</code> to the first scheduler loop, so you can find where any flag
            gets its value and confirm it in the log of the server you run. Section 3, The SGLang
            Runtime, describes the processes, and section 6, KV Memory and the Defaults Your GPU
            Picks, lists the values your GPU decides for the KV (key-value) cache.
          </Box>
          <Box variant="p">
            The runtime, SRT (SGLang Runtime), is <code>python/sglang/srt/</code>: 2,028 Python
            files and 880,863 lines at v0.5.22, by our count with <code>find</code> and{' '}
            <code>wc</code>{' '}
            <Cite tier={1} href={sglangTreeUrl(SRT)} kind="code">
              python/sglang/srt/
            </Cite>
            . Over 40% of those lines sit in two directories that grow as models and kernels are
            added: <code>layers/</code>, with 198,576 lines of attention backends, MoE (mixture of
            experts) and quantization kernels{' '}
            <Cite tier={1} href={sglangTreeUrl(`${SRT}/layers`)} kind="code">
              layers/
            </Cite>
            , and <code>models/</code>, with 186,498 lines and 247 model files at its top level{' '}
            <Cite tier={1} href={sglangTreeUrl(`${SRT}/models`)} kind="code">
              models/
            </Cite>
            . The control logic this dive describes lives in smaller directories on the request
            path: <code>entrypoints/</code>, <code>managers/</code>, <code>mem_cache/</code>,{' '}
            <code>model_executor/</code> and <code>arg_groups/</code>. Open <code>models/</code> for
            the one architecture you serve and <code>layers/</code> for the one kernel you are
            tracing.
          </Box>

          <ModuleMapDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. Box sizes show each directory&apos;s role on the request
            path; only the models/ and layers/ box reflects size. Numbers 1 to 8 follow one request,
            and the ZMQ (ZeroMQ) hops between processes are the ring section 3 describes.
          </Box>

          <Box variant="p">
            Three trees sit outside the runtime. The gateway that routes between servers is Rust, in{' '}
            <Cite tier={1} href={sglangTreeUrl('sgl-model-gateway')}>
              sgl-model-gateway/
            </Cite>{' '}
            (172 <code>.rs</code> files and 63,379 lines under <code>src/</code> by our count).{' '}
            <Cite tier={1} href={sglangTreeUrl('rust')}>
              rust/
            </Cite>{' '}
            holds 108,848 lines of Rust crates, among them the opt-in Rust frontend and the radix
            tree core, and{' '}
            <Cite tier={1} href={sglangTreeUrl('python/sglang/kernels')}>
              python/sglang/kernels/
            </Cite>{' '}
            is the in-tree kernel library. The vLLM dive maps its own tree the same way (
            <Link href="../vllm/">vLLM dive, section 14: Inside the Codebase</Link>).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Follow the launch in the order it runs, so a startup error or a surprising default points you to one file"
          >
            From sglang serve to running processes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The launch is one call chain in the process you start. Read it in this order; each line
            range is pinned to the v0.5.22 tag.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={LAUNCH_STOPS}
            columnDefinitions={STOP_COLUMNS}
          />
          <Box variant="p">
            Stop 5 settles every flag and stop 7 creates the processes that section 3 counts.
            Resolution runs in the process you started, before any other process exists, and so
            does the validation pass stop 7 runs before it spawns anything{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L1157')} kind="code">
              engine.py L1157
            </Cite>
            , so a startup traceback that ends in <code>arg_groups/</code> failed at stop 5 or in
            that validation pass.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict a flag's effective value from three places in the code, and know when the documented default stops applying"
          >
            How a flag gets its value
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A flag&apos;s value is settled in up to three places, in this order. Read all three
            before you trust a default.
          </Box>
          <ol>
            <li>
              <strong>The field declares it.</strong> Each flag is a field in a namespace class under{' '}
              <code>arg_groups/fields/</code>, with its type, help text and declared default. Many
              declared defaults are <code>None</code>, which means a later step decides:{' '}
              <code>--chunked-prefill-size</code> is one{' '}
              <Cite tier={1} href={sglangUrl(SCHED_FIELDS, 'L52-L55')}>
                schedule.py L52-L55
              </Cite>
              .
            </li>
            <li>
              <strong>A resolution step decides it.</strong> <code>resolve_once</code> runs{' '}
              <strong>81 named hooks</strong> in a fixed order, 83 calls in all because two run
              twice, with four post-process passes and one finalize step among them{' '}
              <Cite tier={1} href={sglangUrl(PIPELINE, 'L20-L353')} kind="code">
                pipeline.py L20-L353
              </Cite>
              . A step reads the current view of the configuration and appends its decisions to a
              list. The raw input stays as you typed it, and for each field the last decision wins{' '}
              <Cite tier={1} href={sglangUrl(OVERRIDES, 'L14-L20')}>
                overrides.py L14-L20
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(OVERRIDES, 'L110-L135')}>
                L110-L135
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(OVERRIDES, 'L178-L191')}>
                L178-L191
              </Cite>
              . A plugin can wrap or replace any named hook in its place in the order{' '}
              <Cite tier={1} href={sglangUrl(RES_HOOKS, 'L104-L135')}>
                resolution_hooks.py L104-L135
              </Cite>
              .
            </li>
            <li>
              <strong>The scheduler sizes what needs the loaded model.</strong> Values that depend
              on the memory left after the weights load, such as the KV pool&apos;s
              token count and the default <code>--max-running-requests</code>, are computed inside
              each scheduler process{' '}
              <Cite tier={1} href={sglangUrl(KV_CONF, 'L2800-L2871')} kind="code">
                kv_cache_configurator.py L2800-L2871
              </Cite>
              .
            </li>
          </ol>
          <Box variant="p">
            Runtime code reads the results through per-process configuration bags such as{' '}
            <code>get_schedule()</code> and <code>get_exec()</code>, which <code>publish</code>{' '}
            fills in each process at startup{' '}
            <Cite tier={1} href={sglangUrl(RUNTIME_CTX, 'L1296-L1345')}>
              runtime_context.py L1296-L1345
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(RUNTIME_CTX, 'L1481-L1508')}>
              L1481-L1508
            </Cite>
            . <code>get_server_args()</code> answers a different question, what the operator typed,
            and the retired global accessor&apos;s error message says so{' '}
            <Cite tier={1} href={sglangUrl(SERVER_ARGS, 'L627-L635')}>
              server_args.py L627-L635
            </Cite>
            . When you read code, follow the bag, because the raw record can still hold the{' '}
            <code>None</code> you started with.
          </Box>
          <Box variant="p">
            <strong>One flag through the order.</strong> Follow <code>--chunked-prefill-size</code>{' '}
            on 80 GB H100s. The field says <code>None</code>. The GPU-memory step declares 8192
            for GPUs from 60 to 90 GiB{' '}
            <Cite tier={1} href={sglangUrl(MEMORY_HOOK, 'L132-L140')} kind="code">
              memory_hook.py L132-L140
            </Cite>
            . With attention DP (data parallelism) on, the data-parallelism step runs later in the
            order{' '}
            <Cite tier={1} href={sglangUrl(PIPELINE, 'L206-L208')} kind="code">
              pipeline.py L206-L208
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(PIPELINE, 'L264')} kind="code">
              L264
            </Cite>{' '}
            and declares the size divided by <code>--attn-dp-size</code>; the same step multiplies{' '}
            <code>--schedule-conservativeness</code> by 0.3 and logs a warning about the chunk size{' '}
            <Cite tier={1} href={sglangUrl(PARALLEL_HOOK, 'L308-L324')} kind="code">
              parallel_hook.py L308-L324
            </Cite>
            . By our arithmetic on those lines, <code>--tp-size 8 --attn-dp-size 8</code> gives each
            attention-DP rank chunks of 1024 tokens, for a model no other step adjusts, and the
            admission bet of section 4, The Scheduler, starts at 0.21 in place of 0.7, because the
            ratio tracker reads the resolved conservativeness{' '}
            <Cite tier={1} href={sglangUrl(RATIO, 'L20-L32')} kind="code">
              new_token_ratio_tracker.py L20-L32
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Why the documentation trails the code.</strong> The server-arguments page lists
            each flag with its field&apos;s declared default, so <code>--chunked-prefill-size</code>{' '}
            reads <code>None</code> there{' '}
            <Cite tier={1} href={sglangUrl(DOCS_ARGS, 'L464-L468')}>
              SGLang docs: server arguments L464-L468 (v0.5.22 source)
            </Cite>
            , and the values the resolution steps decide do not appear on it. The test that keeps
            the page current compares flag names only: it fails when a live flag has no row or the
            page names a flag that no longer registers, and its coverage check reads only the
            Argument column{' '}
            <Cite tier={1} href={sglangUrl(DOCS_TEST, 'L1-L3')}>
              test_server_args_docs_coverage.py L1-L3
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(DOCS_TEST, 'L83-L102')}>
              L83-L102
            </Cite>
            . Its allow list names 92 live flags that have no row at all{' '}
            <Cite tier={1} href={sglangUrl(DOCS_ALLOW)}>
              server_arguments_undocumented.txt
            </Cite>
            . Our reading of the test: a default or a restriction that a resolution step changes can
            drift from the page without failing it.
          </Box>
          <ExpandableSection headerText="Four documented values the v0.5.22 code resolves differently">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Memory fraction fallback.</strong> The page says{' '}
                <code>--mem-fraction-static</code> defaults to 0.88 when GPU memory cannot be
                detected{' '}
                <Cite
                  tier={1}
                  href={sglangUrl(DOCS_ARGS, 'L440-L445')}
                  kind="doc-code-conflict"
                >
                  SGLang docs: server arguments L440-L445
                </Cite>
                ; the memory step falls back to 0.95{' '}
                <Cite tier={1} href={sglangUrl(MEMORY_HOOK, 'L326-L330')} kind="code">
                  memory_hook.py L326-L330
                </Cite>
                . Set the fraction yourself where the memory query is unavailable.
              </Box>
              <Box variant="p">
                <strong>Queue policies.</strong> The page lists seven choices for{' '}
                <code>--schedule-policy</code>{' '}
                <Cite
                  tier={1}
                  href={sglangUrl(DOCS_ARGS, 'L487-L492')}
                  kind="doc-code-conflict"
                >
                  SGLang docs: server arguments L487-L492
                </Cite>
                ; the field accepts nine, adding <code>hrrn</code> and{' '}
                <code>shortest-prefill-first</code>{' '}
                <Cite tier={1} href={sglangUrl(SCHED_FIELDS, 'L82-L98')}>
                  schedule.py L82-L98
                </Cite>
                . <code>priority</code> is accepted by the parser but matches no policy class, so by
                our reading, not run, the scheduler raises &quot;Unknown schedule_policy&quot; when
                it builds the policy; priority scheduling is the separate{' '}
                <code>--enable-priority-scheduling</code> switch{' '}
                <Cite tier={1} href={sglangUrl(POLICY, 'L320-L340')} kind="code">
                  schedule_policy.py L320-L340
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>Conservativeness under attention DP.</strong> The page gives{' '}
                <code>--schedule-conservativeness</code> a default of 1.0{' '}
                <Cite tier={1} href={sglangUrl(DOCS_ARGS, 'L518-L522')}>
                  SGLang docs: server arguments L518-L522
                </Cite>
                , and with attention DP on, the data-parallelism step multiplies whatever value you
                pass by 0.3{' '}
                <Cite tier={1} href={sglangUrl(PARALLEL_HOOK, 'L308-L313')} kind="code">
                  parallel_hook.py L308-L313
                </Cite>
                . None of the three v0.5.22 docs pages that mention the flag, found with{' '}
                <code>grep -rl conservativeness docs/docs</code>, states the multiplier.
              </Box>
              <Box variant="p">
                <strong>Speculative decoding and overlap.</strong> The speculative-decoding page says
                the NGRAM and DFLASH algorithms disable the overlap scheduler{' '}
                <Cite
                  tier={1}
                  href={sglangUrl(DOCS_SPEC, 'L100-L118')}
                  kind="doc-code-conflict"
                >
                  SGLang docs: speculative decoding L100-L118
                </Cite>
                . The speculative step turns overlap off only on CPU{' '}
                <Cite tier={1} href={sglangUrl(SPEC_HOOK, 'L63-L77')} kind="code">
                  speculative_hook.py L63-L77
                </Cite>
                , and the DFLASH step does not call that function{' '}
                <Cite tier={1} href={sglangUrl(SPEC_HOOK, 'L279-L431')} kind="code">
                  speculative_hook.py L279-L431
                </Cite>
                , so on GPU both keep overlap, read from source and not run. Section 11,
                Speculative Decoding, covers what that means for a deployment.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Confirm the value your server resolved, and the step that set it, before you tune against a documented default"
          >
            Check a flag on your own server
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol>
            <li>
              <strong>Read the field.</strong>{' '}
              <code>grep -n chunked_prefill_size python/sglang/srt/arg_groups/fields/*.py</code>{' '}
              gives the declared default and the help text the documentation copies.
            </li>
            <li>
              <strong>List every step that can decide it.</strong>{' '}
              <code>grep -rn &quot;chunked_prefill_size=&quot; python/sglang/srt/arg_groups/</code>{' '}
              finds each declaration, and the position of its step in <code>pipeline.py</code>{' '}
              tells you which one wins. For this flag the search finds the GPU-memory step, the
              data-parallelism step, and steps that turn chunking off for some checkpoints and for
              multi-item scoring{' '}
              <Cite tier={1} href={sglangUrl(MODEL_HOOK, 'L207-L221')} kind="code">
                model_hook.py L207-L221
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(ATTN_HOOK, 'L563-L569')} kind="code">
                attention_hook.py L563-L569
              </Cite>
              .
            </li>
            <li>
              <strong>Read what your server resolved.</strong> The <code>server_args=</code> line
              at startup prints every field after the resolution steps{' '}
              <Cite tier={1} href={sglangUrl(ENGINE, 'L1179')} kind="code">
                engine.py L1179
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(SERVER_ARGS, 'L315-L332')} kind="code">
                server_args.py L315-L332
              </Cite>
              . The scheduler&apos;s line that begins <code>max_total_num_tokens=</code> prints the
              chunk size, the prefill cap and <code>max_running_requests</code> after the third
              stage{' '}
              <Cite tier={1} href={sglangUrl(SCHEDULER, 'L1229-L1241')} kind="code">
                scheduler.py L1229-L1241
              </Cite>
              . By our reading of the code, <code>max_running_requests=None</code> in the first line
              is expected when you left it unset and no resolution step declared it, as the speculative
              steps do with 48{' '}
              <Cite tier={1} href={sglangUrl(SPEC_HOOK, 'L995-L1003')} kind="code">
                speculative_hook.py L995-L1003
              </Cite>
              ; the second line carries the number the scheduler uses.
            </li>
          </ol>
          <Box variant="p">
            Run these three reads whenever a value from a document, a blog post or another
            engine&apos;s launch line goes into yours. Between the field and the value your server
            uses sit <strong>81 named hooks</strong>, and the two startup lines show where they
            landed.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
