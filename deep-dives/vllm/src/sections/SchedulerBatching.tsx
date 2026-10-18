import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

const OPT_GUIDE = vllmDocsUrl('configuration/optimization/');
const V1_GUIDE = vllmDocsUrl('usage/v1_guide/');
const SCHED_CFG = 'vllm/config/scheduler.py';
const SCHED = 'vllm/v1/core/sched/scheduler.py';
const ARG_UTILS = 'vllm/engine/arg_utils.py';
const LOGGERS = 'vllm/v1/metrics/loggers.py';

// ---------------------------------------------------------------------------
// Continuous-batching timeline diagram (inline SVG).
// Rows = requests, columns = engine steps. Each cell is what that request
// contributes to the step: a prefill chunk (P), a decode token (D), a wait in
// the queue, or its last decode (EOS). The schedule follows the default FCFS
// policy: R4 arrives after R3, finds no free KV blocks, and joins at t5, the
// step after R1's last decode frees R1's blocks.
// ---------------------------------------------------------------------------

type CellKind = 'prefill' | 'decode' | 'wait' | 'done' | 'idle';
type Cell = { kind: CellKind; label: string };

const STEPS = ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'];

const P = (label = 'P'): Cell => ({ kind: 'prefill', label });
const D: Cell = { kind: 'decode', label: 'D' };
const W: Cell = { kind: 'wait', label: 'WAIT' };
const E: Cell = { kind: 'done', label: 'EOS' };
const I: Cell = { kind: 'idle', label: '' };

const TIMELINE: { req: string; arrive: string; cells: Cell[] }[] = [
  { req: 'R1 short prompt', arrive: 'arrives t0', cells: [P(), D, D, D, E, I, I, I] },
  { req: 'R2 long prompt', arrive: 'arrives t0', cells: [P('P1'), P('P2'), P('P3'), D, D, D, D, E] },
  { req: 'R3 joins mid-flight', arrive: 'arrives t2', cells: [I, I, P(), D, D, D, E, I] },
  { req: 'R4 waits for blocks', arrive: 'arrives t3', cells: [I, I, I, W, W, P(), D, D] },
];

const LEGEND: { kind: CellKind; label: string; text: string; x: number; y: number }[] = [
  { kind: 'prefill', label: 'P', text: 'prefill, or one chunk of a long prompt', x: 16, y: 266 },
  { kind: 'decode', label: 'D', text: 'decode, one token per step', x: 410, y: 266 },
  { kind: 'wait', label: 'WAIT', text: 'queued: not enough free KV blocks', x: 16, y: 304 },
  { kind: 'done', label: 'EOS', text: 'last decode; blocks freed after this step', x: 410, y: 304 },
];

const TL_X0 = 200;
const TL_CW = 72;
const TL_TOP = 46;
const TL_PITCH = 54;
const TL_CH = 38;

function ContinuousBatchingTimeline() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 800 346"
        role="img"
        aria-labelledby="sb-timeline-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="sb-timeline-title">
          Continuous batching re-forms the batch every engine step. R2&apos;s long prompt is prefilled
          in three chunks beside R1&apos;s decodes, R3 joins the step it arrives, and R4, arriving after
          R3 when no KV blocks are free, waits until R1&apos;s last decode at t4 frees its blocks and
          joins at t5.
        </title>
        <style>{`
          .sbt-head { fill: #414d5c; font: 600 11px sans-serif; }
          .sbt-step { fill: #414d5c; font: 600 12px sans-serif; text-anchor: middle; }
          .sbt-req { fill: #16191f; font: 600 13px sans-serif; }
          .sbt-arr { fill: #5f6b7a; font: 11px sans-serif; }
          .sbt-cell { font: 600 12px sans-serif; text-anchor: middle; }
          .sbt-leg { fill: #16191f; font: 11px sans-serif; }
          .sbt-r-prefill { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.2; }
          .sbt-r-decode { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.2; }
          .sbt-r-wait { fill: #fdf3ec; stroke: #ec7211; stroke-width: 1.2; stroke-dasharray: 4 3; }
          .sbt-r-done { fill: #e9ebed; stroke: #414d5c; stroke-width: 1.2; }
          .sbt-r-idle { fill: #ffffff; stroke: #d5dbdb; stroke-width: 1; stroke-dasharray: 4 3; }
          .sbt-t-prefill { fill: #033160; }
          .sbt-t-decode { fill: #0b4f12; }
          .sbt-t-wait { fill: #7c4516; }
          .sbt-t-done { fill: #414d5c; }
          .sbt-t-idle { fill: #414d5c; }
        `}</style>
        <rect x="0" y="0" width="800" height="346" rx="8" fill="#ffffff" stroke="#e9ebed" />
        <text x="16" y="30" className="sbt-head">
          Request / engine step
        </text>
        {STEPS.map((s, i) => (
          <text key={s} x={TL_X0 + i * TL_CW + TL_CW / 2} y="30" className="sbt-step">
            {s}
          </text>
        ))}
        {TIMELINE.map((row, r) => {
          const y = TL_TOP + r * TL_PITCH;
          return (
            <g key={row.req}>
              <text x="16" y={y + 16} className="sbt-req">
                {row.req}
              </text>
              <text x="16" y={y + 32} className="sbt-arr">
                {row.arrive}
              </text>
              {row.cells.map((c, i) => {
                const x = TL_X0 + i * TL_CW + 5;
                return (
                  <g key={`${row.req}-${STEPS[i]}`}>
                    <rect x={x} y={y} width={TL_CW - 10} height={TL_CH} rx="6" className={`sbt-r-${c.kind}`} />
                    {c.label && (
                      <text x={x + (TL_CW - 10) / 2} y={y + 23} className={`sbt-cell sbt-t-${c.kind}`}>
                        {c.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
        {LEGEND.map((l) => (
          <g key={l.kind}>
            <rect x={l.x} y={l.y} width="52" height="26" rx="6" className={`sbt-r-${l.kind}`} />
            <text x={l.x + 26} y={l.y + 17} className={`sbt-cell sbt-t-${l.kind}`}>
              {l.label}
            </text>
            <text x={l.x + 64} y={l.y + 17} className="sbt-leg">
              {l.text}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The knobs table: one line per flag a reader turns.
// ---------------------------------------------------------------------------

interface KnobRow {
  flag: string;
  dflt: string;
  use: string;
  src: ReactNode;
}

const knobRows: KnobRow[] = [
  {
    flag: '--max-num-batched-tokens',
    dflt: '16384, 8192 or 2048 by GPU tier',
    use: 'Per-step token budget. Raise it for TTFT and throughput; lower it for tighter ITL.',
    src: (
      <Cite tier={1} href={vllmUrl(ARG_UTILS, 'L2858-L2887')}>
        arg_utils.py L2858-L2887
      </Cite>
    ),
  },
  {
    flag: '--max-num-seqs',
    dflt: '1024 on H100-class and larger, 256 otherwise',
    use: 'Most requests in one step. It also sizes the runner buffers and CUDA graph capture. Lower it when preemptions climb.',
    src: (
      <Cite tier={1} href={vllmUrl(ARG_UTILS, 'L2858-L2887')}>
        arg_utils.py L2858-L2887
      </Cite>
    ),
  },
  {
    flag: '--max-num-active-seqs',
    dflt: 'unset (same as --max-num-seqs)',
    use: 'Caps the RUNNING batch only. Lower it to shrink decode batches without resizing the buffers and graphs built at startup.',
    src: (
      <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L70-L78')}>
        scheduler.py L70-L78
      </Cite>
    ),
  },
  {
    flag: '--long-prefill-token-threshold',
    dflt: '0 (off)',
    use: 'Per-request chunk cap for one step. Set it when one long prompt stalls everyone else; add --long-prefill-token-threshold-adaptive for a fair-share floor.',
    src: (
      <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L80-L91')}>
        scheduler.py L80-L91
      </Cite>
    ),
  },
  {
    flag: '--watermark',
    dflt: '0.0 (off)',
    use: 'Fraction of all KV blocks kept free when admitting waiting or preempted requests (0.05 keeps 5%). Set it when preemptions climb.',
    src: (
      <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L197-L202')}>
        scheduler.py L197-L202
      </Cite>
    ),
  },
  {
    flag: '--max-num-queued-reqs, --max-num-queued-tokens',
    dflt: 'unset (unbounded queue)',
    use: 'Past either cap the API server answers HTTP 503, counted across DP (data parallel) ranks, so a load balancer can retry elsewhere. The docstring sizes the token cap as target TTFT x prefill throughput.',
    src: (
      <>
        <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L93-L120')}>
          scheduler.py L93-L120
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('vllm/exceptions.py', 'L148-L175')}>
          exceptions.py L148-L175
        </Cite>
      </>
    ),
  },
  {
    flag: '--scheduling-policy',
    dflt: 'fcfs',
    use: 'priority serves lower per-request priority values first (arrival breaks ties) and preempts the lowest-priority request first. Set it for QoS (quality of service) tiers.',
    src: (
      <>
        <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L160-L166')}>
          scheduler.py L160-L166
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl(SCHED, 'L763-L771')}>
          v1 scheduler.py L763-L771
        </Cite>
      </>
    ),
  },
  {
    flag: '--gpu-memory-utilization',
    dflt: '0.92',
    use: 'Share of each GPU this instance claims; the KV cache is what remains of it after weights and activations. Raise it to grow the KV cache; lower it when another process shares the GPU.',
    src: (
      <>
        <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L103-L112')}>
          cache.py L103-L112
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_worker.py', 'L673-L677')}>
          gpu_worker.py L673-L677
        </Cite>
      </>
    ),
  },
  {
    flag: '--tensor-parallel-size',
    dflt: '1',
    use: 'Shards weights across GPUs, leaving more memory per GPU for KV cache. Raise it when model plus KV cache will not fit.',
    src: (
      <>
        <Cite tier={1} href={vllmUrl('vllm/config/parallel.py', 'L129')}>
          parallel.py L129
        </Cite>{' '}
        <Cite tier={1} href={OPT_GUIDE}>
          vLLM docs: Optimization and tuning
        </Cite>
      </>
    ),
  },
];

export function SchedulerBatching() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="How the scheduler decides what runs each step, the defaults vllm serve starts from on your GPU, and the knobs that trade latency, throughput and admission (verified against vLLM v0.31.0, commit db9527a4, 2026-10-16)"
          >
            4. Scheduler &amp; Continuous Batching
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Requests in one batch finish at different times, because their output lengths differ.
            Static batching collects N requests and runs them together until all of them finish:
            the GPU works through a shrinking batch while it waits on the slowest member, and a
            request that arrives mid-batch waits for the whole batch before it starts.
          </Box>
          <Box variant="p">
            <strong>Continuous (iteration-level) batching</strong> meets that by running the
            scheduler once <em>per forward step</em>. Every step it re-decides the running batch:
            finished requests leave and free their KV-cache (key-value cache) blocks, and waiting
            requests join, without interrupting the requests that are mid-generation. Everything
            else in this section tunes <em>how</em> the scheduler fills each step.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="How to read one engine step's batch, and why under the default policy a later request waits behind an earlier one"
          >
            The Continuous-Batching Timeline
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The diagram shows four requests over eight engine steps; EOS (end of sequence) marks a
            request&apos;s last decode. Read it down a column: each column is the batch that ran in
            one step, a mix of prefill chunks and decode tokens from different requests, and the
            mix changes every step.
          </Box>
          <ContinuousBatchingTimeline />
          <Box variant="small" color="text-body-secondary">
            R2&apos;s prompt runs as three chunks (P1-P3) beside R1&apos;s decodes. R3 takes the last
            free KV blocks at t2. R4 arrives at t3, waits while no blocks are free, and joins at t5,
            once R1&apos;s last decode at t4 has released R1&apos;s blocks. Illustrative schedule, not
            measured output. The timeline plans each step after the previous one finishes. Async
            scheduling, on by default, plans t5 while t4 is still running, before R1&apos;s EOS is
            known, so R1 keeps its blocks one step longer and R4 joins at t6{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L592-L602')}>
              vllm.py L592-L602
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/engine/core.py', 'L686-L757')}>
              core.py L686-L757
            </Cite>
            .
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Requests join mid-flight</Box>
              <Box variant="p">
                R3 arrives at t2 and runs its prefill that same step, without waiting for R1 or R2
                to finish. With static batching it would wait for the whole batch to drain.
              </Box>
            </div>
            <div>
              <Box variant="h3">Requests leave when they finish</Box>
              <Box variant="p">
                R1 emits its EOS token at t4 and is gone from t5. Its KV-cache blocks return to
                the pool once that step&apos;s output is processed, which is what lets R4 in at t5.
              </Box>
            </div>
            <div>
              <Box variant="h3">Prefill is chunked and interleaved</Box>
              <Box variant="p">
                R2&apos;s long prompt runs as chunks P1-P3 across t0-t2, sharing each step&apos;s
                token budget with other requests&apos; decodes instead of taking the GPU for one
                large prefill.
              </Box>
            </div>
            <div>
              <Box variant="h3">Arrival order holds</Box>
              <Box variant="p">
                Under the default FCFS (first come, first served) policy{' '}
                <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L160-L166')}>
                  scheduler.py L160-L166
                </Cite>
                , the scheduler admits from the head of the waiting queue and stops at the first
                request it cannot fit, for lack of token budget or of free KV blocks{' '}
                <Cite tier={1} href={vllmUrl(SCHED, 'L885-L896')}>
                  v1 scheduler.py L885-L896
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl(SCHED, 'L1209-L1230')}>
                  L1209-L1230
                </Cite>
                . A request arriving after R4 would wait behind it. Only requests blocked for
                another reason are set aside so the scan can continue, such as remote KV still
                arriving, a grammar still compiling, or the cap on LoRA (low-rank adaptation)
                adapters per batch{' '}
                <Cite tier={1} href={vllmUrl(SCHED, 'L899-L922')}>
                  L899-L922
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>
          <ExpandableSection headerText="Why iteration-level scheduling beats request-level scheduling">
            <SpaceBetween size="s">
              <Box variant="p">
                The win comes from the variance in output lengths. In a request-level (static)
                batch, the batch&apos;s wall-clock duration is set by its longest generation; every
                shorter request holds a slot it no longer needs, and the GPU processes a shrinking,
                increasingly sparse batch as members finish. Iteration-level scheduling re-packs the
                batch every step, so a finished request&apos;s slot is reclaimed within one step
                rather than at the end of the batch.
              </Box>
              <Box variant="p">
                The cost is scheduler work on every forward step. That path is a dictionary of
                token counts and queue operations, and async scheduling, on unless an incompatible
                option is set, keeps two batches in flight so the next step is scheduled while the
                current one runs{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L592-L602')}>
                  vllm.py L592-L602
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L1576-L1635')}>
                  vllm.py L1576-L1635
                </Cite>
                . <code>--no-async-scheduling</code> turns it off{' '}
                <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L209-L212')}>
                  scheduler.py L209-L212
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
            description="What fills each step, the two numbers that bound it, and the values vllm serve starts with on your GPU"
          >
            The Unified Scheduler &amp; the Per-Step Token Budget
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            In the V1 engine there is no fixed prefill phase followed by a decode phase. The V1{' '}
            <strong>unified scheduler</strong> &quot;treats both prompt and output tokens the same way by
            using a simple dictionary (e.g., <code>{'{request_id: num_tokens}'}</code>) to dynamically
            allocate a fixed token budget per request, enabling features like chunked prefills, prefix
            caching, and speculative decoding without a strict separation between prefill and decode
            phases.&quot;{' '}
            <Cite tier={1} href={V1_GUIDE}>
              vLLM docs: V1 user guide
            </Cite>
          </Box>
          <Box variant="p">
            Each step the scheduler gets a <strong>token budget</strong> (
            <code>max_num_batched_tokens</code>) and a cap on running requests (
            <code>max_num_seqs</code>, or <code>max_num_active_seqs</code> when set). It serves the
            running requests first, then admits waiting ones against what is left. A decoding request
            asks for 1 token, or 1 plus its draft tokens under speculative decoding; a prefilling
            request asks for as many of its remaining prompt tokens as fit, and a prompt longer than
            the leftover budget gets a <em>chunk</em> now and the rest in later steps{' '}
            <Cite tier={1} href={vllmUrl(SCHED, 'L582-L585')}>
              v1 scheduler.py L582-L585
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(SCHED, 'L674-L683')}>
              L674-L683
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(SCHED, 'L1110-L1123')}>
              L1110-L1123
            </Cite>
            .
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">
                <code>max_num_batched_tokens</code>
              </Box>
              <Box variant="p">
                The total tokens (prefill plus decode) the engine processes in one step, and the dial
                between inter-token latency (ITL) and time to first token: &quot;Smaller values (e.g.,
                2048) achieve better ITL because there are fewer prefills slowing down decodes.&quot;
                &quot;Higher values achieve better time to first token (TTFT) as you can process more
                prefill tokens in a batch.&quot;{' '}
                <Cite tier={1} href={OPT_GUIDE}>
                  vLLM docs: Optimization and tuning
                </Cite>
              </Box>
            </div>
            <div>
              <Box variant="h3">
                <code>max_num_seqs</code>
              </Box>
              <Box variant="p">
                The most sequences in one step. Raising it increases concurrency and consumes more KV
                cache; lowering it &quot;reduces the number of concurrent requests in a batch, thereby
                requiring less KV cache space.&quot;{' '}
                <Cite tier={1} href={OPT_GUIDE}>
                  vLLM docs: Optimization and tuning
                </Cite>{' '}
                It also sizes the model runner&apos;s per-request buffers and CUDA graph capture,
                which is why <code>max_num_active_seqs</code> exists as a separate admission cap{' '}
                <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L70-L78')}>
                  scheduler.py L70-L78
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>The starting values depend on the GPU.</strong> <code>vllm serve</code> leaves
            both limits unset and fills them by GPU memory: <strong>16384</strong> batched tokens and{' '}
            <strong>1024</strong> sequences on GPUs with at least 160 GiB, <strong>8192</strong> and{' '}
            <strong>1024</strong> on H100-class GPUs (at least 70 GiB, A100 excluded), and{' '}
            <strong>2048</strong> and <strong>256</strong> on every other GPU{' '}
            <Cite tier={1} href={vllmUrl(ARG_UTILS, 'L2858-L2887')}>
              arg_utils.py L2858-L2887
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/launchers/api_server/entry.py', 'L36-L40')}>
              entry.py L36-L40
            </Cite>
            . The 2048 and 128 declared on <code>SchedulerConfig</code> are class fallbacks, used
            when no usage context matches{' '}
            <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L42-L44')}>
              scheduler.py L42-L44
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(ARG_UTILS, 'L3047-L3062')}>
              arg_utils.py L3047-L3062
            </Cite>
            , and <code>--performance-mode throughput</code> doubles whichever limit you left unset{' '}
            <Cite tier={1} href={vllmUrl(ARG_UTILS, 'L3064-L3069')}>
              arg_utils.py L3064-L3069
            </Cite>
            .
          </Box>
          <Alert type="info">
            <strong>For throughput-bound serving</strong>, vLLM recommends setting{' '}
            <code>max_num_batched_tokens &gt; 8192</code>, &quot;especially for smaller models on
            large GPUs.&quot;{' '}
            <Cite tier={1} href={OPT_GUIDE}>
              vLLM docs: Optimization and tuning
            </Cite>{' '}
            On an H100-class GPU <code>vllm serve</code> already starts at 8192, and at 16384 on a
            GPU with 160 GiB or more. Larger budgets push more prefill tokens into each step, which
            can stall in-flight decodes and raise ITL, so set the value from measured TTFT and ITL
            targets.
          </Alert>
          <ExpandableSection headerText="How the per-step budget interleaves prefill and decode">
            <SpaceBetween size="s">
              <Box variant="p">
                Each step the scheduler walks its candidate requests and assigns each a token count,
                debiting the shared <code>max_num_batched_tokens</code> budget. Decodes are cheap
                (1 token each) so many fit; a prefill takes a chunk sized to whatever budget remains.
                Because both draw from one budget, a step can be pure-decode, pure-prefill, or any
                mix: the &quot;unified&quot; in unified scheduler. This is also why{' '}
                <code>max_num_batched_tokens</code> is the master latency dial: it directly bounds
                how much prefill can crowd into a step alongside decodes.
              </Box>
              <Box variant="p">
                The same shared-budget mechanism is what makes prefix caching and speculative
                decoding compose cleanly: cached-prefix tokens do not need budget, and speculative
                draft tokens are budgeted like extra decode tokens. (Prefix caching is Section 6;
                speculative decoding is Section 11.)
              </Box>
              <Box variant="p">
                Waiting requests that already hold KV blocks, such as one whose KV arrived from a
                remote prefill instance, are admitted before the ordinary queue, so a request
                holding blocks never sits behind one whose failed allocation stops the scan{' '}
                <Cite tier={1} href={vllmUrl(SCHED, 'L212-L216')}>
                  v1 scheduler.py L212-L216
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
            description="Why long prompts stop stalling decodes, and why they still need KV blocks for every token"
          >
            Chunked Prefill
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A long prompt&apos;s prefill is a single compute-heavy operation that, run whole, fills
            a forward step. While it runs, every decoding request in the batch waits: head-of-line
            blocking that raises inter-token latency for everyone. Chunked prefill splits that
            prefill across steps, so each step does a bounded slice of prefill plus the in-flight
            decodes.
          </Box>
          <Box variant="p">
            In V1 this is the default: &quot;Chunked prefill is enabled by default whenever possible,
            unlike in V0 where it was conditionally enabled based on model characteristics.&quot;{' '}
            <Cite tier={1} href={V1_GUIDE}>
              vLLM docs: V1 user guide
            </Cite>{' '}
            Prefill chunks and decode tokens share one per-step budget, &quot;better balancing
            compute-bound (prefill) and memory-bound (decode) operations.&quot;{' '}
            <Cite tier={1} href={OPT_GUIDE}>
              vLLM docs: Optimization and tuning
            </Cite>
          </Box>
          <Box variant="p">
            A prompt is chunked only when it exceeds the leftover budget, so one long prompt can
            still take most of a step. <code>--long-prefill-token-threshold</code> caps each
            prompt&apos;s share of a step. The cap is dropped when that prompt is the only request,
            and with <code>--long-prefill-token-threshold-adaptive</code> it never falls below the
            budget divided by the running plus waiting requests{' '}
            <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L80-L91')}>
              scheduler.py L80-L91
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(SCHED, 'L611-L626')}>
              v1 scheduler.py L611-L626
            </Cite>
            .
          </Box>
          <Alert type="warning" header="Chunking spreads compute; the KV-cache footprint stays the same">
            By default the scheduler admits a new prompt only if all of its tokens fit in free KV
            blocks, then allocates the blocks chunk by chunk{' '}
            <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L191-L195')}>
              scheduler.py L191-L195
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_manager.py', 'L519-L541')}>
              kv_cache_manager.py L519-L541
            </Cite>
            . By the last chunk the request holds blocks for every prompt position: a 30K-token
            prompt needs blocks for all 30K positions whether it prefills in one step or thirty. If
            you are hitting preemption, the constraint is KV-cache capacity (Section 5: Paged KV
            Cache &amp; Block Tables), and the fixes are the memory knobs below.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What happens when running requests outgrow the KV cache, which metric shows it, and the knobs that prevent it"
          >
            Preemption Under Memory Pressure
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Continuous batching admits requests aggressively to keep the GPU busy, and running
            requests keep growing as they generate, so &quot;there are times when KV cache space is
            insufficient to handle all batched requests.&quot; vLLM then <strong>preempts</strong> a
            running request: it frees that request&apos;s blocks for the others and resumes it later{' '}
            <Cite tier={1} href={OPT_GUIDE}>
              vLLM docs: Optimization and tuning
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>V1 has one preemption behavior: recompute.</strong> The preempted request&apos;s
            blocks return to the pool, its computed-token count resets to zero, and it goes back to
            the front of the waiting queue; when it is rescheduled, its prefill runs again{' '}
            <Cite tier={1} href={vllmUrl(SCHED, 'L1538-L1581')}>
              v1 scheduler.py L1538-L1581
            </Cite>
            . The optimization guide speaks of a default <code>RECOMPUTE</code> mode
            &quot;rather than <code>SWAP</code>&quot;{' '}
            <Cite tier={1} href={OPT_GUIDE} kind="doc-code-conflict">
              vLLM docs: Optimization and tuning
            </Cite>
            , but there is no mode to set: the V1 guide lists GPU-CPU KV cache swapping as removed{' '}
            <Cite tier={1} href={V1_GUIDE}>
              vLLM docs: V1 user guide
            </Cite>
            , and the v0.31.0 tree under <code>vllm/</code> contains no{' '}
            <code>PreemptionMode</code>. Under FCFS the victim is the request added to the running
            batch last; under the priority policy it is the lowest-priority one{' '}
            <Cite tier={1} href={vllmUrl(SCHED, 'L763-L803')}>
              v1 scheduler.py L763-L803
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>What to watch.</strong> The optimization guide shows a{' '}
            <code>Sequence group 0 is preempted by PreemptionMode.RECOMPUTE mode</code> warning, a
            V0 message that V1 does not print{' '}
            <Cite tier={1} href={vllmUrl('docs/configuration/optimization.md', 'L29-L35')} kind="doc-code-conflict">
              optimization.md L29-L35
            </Cite>
            . V1 reports preemptions in three places. The periodic stats log line gains a{' '}
            <code>Preemptions: N</code> field, counted over the logging interval and shown only when
            nonzero{' '}
            <Cite tier={1} href={vllmUrl(LOGGERS, 'L141-L159')}>
              loggers.py L141-L159
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(LOGGERS, 'L295-L297')}>
              L295-L297
            </Cite>
            . The Prometheus counter <code>vllm:num_preemptions</code> accumulates them{' '}
            <Cite tier={1} href={vllmUrl(LOGGERS, 'L676-L680')}>
              L676-L680
            </Cite>
            , and the histogram <code>vllm:request_num_preemptions</code> shows whether the same
            requests are preempted again and again{' '}
            <Cite tier={1} href={vllmUrl(LOGGERS, 'L901-L904')}>
              L901-L904
            </Cite>
            .
          </Box>
          <Alert
            type="error"
            header={
              <>
                Treat a climbing <code>vllm:num_preemptions</code> as an alarm
              </>
            }
          >
            Every preemption throws away KV the GPU already computed and runs that prefill again. A
            counter that keeps rising means the running batch is outgrowing the KV cache and the GPU
            is re-prefilling the same requests. It is one of the first signals to check when
            throughput collapses under load.
          </Alert>
          <Box variant="p">
            <strong>How to avoid it.</strong> Every fix lowers KV-cache pressure. The optimization
            guide suggests: &quot;Increase <code>gpu_memory_utilization</code>&quot; (a larger share
            of the GPU for this instance, and so a larger KV cache); &quot;Decrease <code>max_num_seqs</code> or{' '}
            <code>max_num_batched_tokens</code>&quot; (fewer concurrent requests, so they fit);
            &quot;Increase <code>tensor_parallel_size</code>&quot; or &quot;Increase{' '}
            <code>pipeline_parallel_size</code>&quot; (weights spread over more GPUs leave more room
            per GPU for KV cache){' '}
            <Cite tier={1} href={OPT_GUIDE}>
              vLLM docs: Optimization and tuning
            </Cite>
            . Two scheduler knobs act more directly. <code>--watermark</code> keeps a fraction of
            all KV blocks free when admitting waiting or preempted requests, headroom the running
            requests grow into{' '}
            <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L197-L202')}>
              scheduler.py L197-L202
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_manager.py', 'L506-L536')}>
              kv_cache_manager.py L506-L536
            </Cite>
            . <code>--max-num-active-seqs</code> shrinks the running batch without resizing the
            runner buffers and CUDA graphs that <code>max_num_seqs</code> sets{' '}
            <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L70-L78')}>
              scheduler.py L70-L78
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="Why preemption recomputes instead of swapping">
            <Box variant="p">
              Swapping would copy a preempted request&apos;s KV blocks to CPU memory and back on
              resume; recompute discards them and runs the prefill again. V1 only recomputes, and the
              optimization guide gives the reason as lower overhead in the V1 architecture{' '}
              <Cite tier={1} href={OPT_GUIDE}>
                vLLM docs: Optimization and tuning
              </Cite>
              . With paged KV blocks and prefix caching, part of the re-prefill is often a cache
              hit, provided the request&apos;s blocks were not evicted in the meantime: a request
              that restarts from zero computed tokens gets a fresh prefix-cache lookup{' '}
              <Cite tier={1} href={vllmUrl(SCHED, 'L929-L937')}>
                v1 scheduler.py L929-L937
              </Cite>
              . Either way, a preempted request pays for its prefill again.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="One line per flag: the default vllm serve starts from, and when to change it"
          >
            The Knobs You Turn
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            variant="embedded"
            wrapLines
            items={knobRows}
            columnDefinitions={[
              { id: 'flag', header: 'Flag', cell: (r) => <code>{r.flag}</code>, minWidth: 180 },
              { id: 'dflt', header: 'Default for vllm serve', cell: (r) => r.dflt, minWidth: 150 },
              { id: 'use', header: 'What it does, and when to turn it', cell: (r) => r.use, minWidth: 280 },
              { id: 'src', header: 'Source', cell: (r) => r.src, minWidth: 170 },
            ]}
          />
          <Box variant="p">
            <strong>Start here.</strong> Pass <code>--max-num-seqs</code> and{' '}
            <code>--max-num-batched-tokens</code> explicitly on a production server, so the values
            stop depending on which GPU tier the server lands on (8192 tokens and 1024 sequences on
            an H100, 2048 and 256 on an A100). Then watch <code>vllm:num_preemptions</code> under
            load: a rising count points at <code>--watermark</code>,{' '}
            <code>--max-num-active-seqs</code> or <code>--gpu-memory-utilization</code>. A{' '}
            <code>Waiting</code> count in the stats log line that only grows{' '}
            <Cite tier={1} href={vllmUrl(LOGGERS, 'L274-L289')}>
              loggers.py L274-L289
            </Cite>{' '}
            points at <code>--max-num-queued-reqs</code>, which turns the excess into HTTP 503s a
            load balancer can send elsewhere. The batch is bounded by
            KV-cache capacity in the end, which Section 5 covers. The code behind every row is in{' '}
            <strong>Inside the Codebase &rarr; Scheduler &amp; KV Cache</strong>, and the full flag
            table, with every GPU tier, is in{' '}
            <strong>Inside the Codebase &rarr; Configuration</strong>.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
