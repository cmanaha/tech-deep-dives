import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';

// ---------------------------------------------------------------------------
// Continuous-batching timeline diagram.
// Pure-CSS grid (no React Flow, no extra deps): rows = requests, columns =
// engine steps. Each cell shows what that request contributes to the step's
// token budget: prefill chunk (P), decode token (D), or idle/done.
// The point the diagram makes: the running batch changes membership EVERY
// step, requests join and leave mid-flight, and a long prefill is split into
// chunks (P1..Pn) that interleave with other requests' decodes.
// ---------------------------------------------------------------------------

type Cell = { kind: 'prefill' | 'decode' | 'wait' | 'done' | 'idle'; label: string };

const STEPS = ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'];

const TIMELINE: { req: string; arrive: string; cells: Cell[] }[] = [
  {
    req: 'R1 (short prompt)',
    arrive: 'arrives t0',
    cells: [
      { kind: 'prefill', label: 'P' },
      { kind: 'decode', label: 'D' },
      { kind: 'decode', label: 'D' },
      { kind: 'decode', label: 'D' },
      { kind: 'done', label: 'EOS' },
      { kind: 'idle', label: '' },
      { kind: 'idle', label: '' },
      { kind: 'idle', label: '' },
    ],
  },
  {
    req: 'R2 (long prompt)',
    arrive: 'arrives t0',
    cells: [
      { kind: 'prefill', label: 'P1' },
      { kind: 'prefill', label: 'P2' },
      { kind: 'prefill', label: 'P3' },
      { kind: 'decode', label: 'D' },
      { kind: 'decode', label: 'D' },
      { kind: 'decode', label: 'D' },
      { kind: 'decode', label: 'D' },
      { kind: 'done', label: 'EOS' },
    ],
  },
  {
    req: 'R3 (arrives mid-flight)',
    arrive: 'arrives t2',
    cells: [
      { kind: 'idle', label: '' },
      { kind: 'idle', label: '' },
      { kind: 'prefill', label: 'P' },
      { kind: 'decode', label: 'D' },
      { kind: 'decode', label: 'D' },
      { kind: 'decode', label: 'D' },
      { kind: 'done', label: 'EOS' },
      { kind: 'idle', label: '' },
    ],
  },
  {
    req: 'R4 (queued, budget full)',
    arrive: 'arrives t1',
    cells: [
      { kind: 'idle', label: '' },
      { kind: 'wait', label: 'WAIT' },
      { kind: 'wait', label: 'WAIT' },
      { kind: 'wait', label: 'WAIT' },
      { kind: 'prefill', label: 'P' },
      { kind: 'decode', label: 'D' },
      { kind: 'decode', label: 'D' },
      { kind: 'decode', label: 'D' },
    ],
  },
];

const CELL_STYLE: Record<Cell['kind'], React.CSSProperties> = {
  prefill: { background: '#f2f8fd', border: '1px solid #0972d3', color: '#033160' },
  decode: { background: '#ecf7ec', border: '1px solid #037f0c', color: '#0b4f12' },
  wait: { background: '#fdf3ec', border: '1px dashed #ec7211', color: '#7c4516' },
  done: { background: '#e9ebed', border: '1px solid #414d5c', color: '#414d5c' },
  idle: { background: 'transparent', border: '1px dashed #d5dbdb', color: '#aab2b8' },
};

function cellStyle(kind: Cell['kind']): React.CSSProperties {
  return {
    ...CELL_STYLE[kind],
    borderRadius: '6px',
    padding: '8px 0',
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 600,
    minWidth: '44px',
  };
}

function ContinuousBatchingTimeline() {
  const gridCols = `200px repeat(${STEPS.length}, 1fr)`;
  return (
    <div
      style={{
        background: '#fafafa',
        border: '1px solid #e9ebed',
        borderRadius: '8px',
        padding: '16px',
        overflowX: 'auto',
      }}
    >
      {/* Header row: engine steps */}
      <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '6px', alignItems: 'center', minWidth: '640px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#414d5c' }}>request \ engine step &rarr;</div>
        {STEPS.map((s) => (
          <div key={s} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#414d5c' }}>
            {s}
          </div>
        ))}
      </div>

      {/* One row per request */}
      {TIMELINE.map((row) => (
        <div
          key={row.req}
          style={{
            display: 'grid',
            gridTemplateColumns: gridCols,
            gap: '6px',
            alignItems: 'center',
            marginTop: '8px',
            minWidth: '640px',
          }}
        >
          <div style={{ fontSize: '12px', lineHeight: 1.3 }}>
            <div style={{ fontWeight: 700, color: '#16191f' }}>{row.req}</div>
            <div style={{ color: '#5f6b7a', fontSize: '11px' }}>{row.arrive}</div>
          </div>
          {row.cells.map((c, i) => (
            <div key={`${row.req}-${STEPS[i]}`} style={cellStyle(c.kind)}>
              {c.label}
            </div>
          ))}
        </div>
      ))}

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px', fontSize: '12px' }}>
        <span><span style={{ ...cellStyle('prefill'), display: 'inline-block', padding: '2px 8px' }}>P</span> prefill (chunk)</span>
        <span><span style={{ ...cellStyle('decode'), display: 'inline-block', padding: '2px 8px' }}>D</span> decode (1 token)</span>
        <span><span style={{ ...cellStyle('wait'), display: 'inline-block', padding: '2px 8px' }}>WAIT</span> queued, budget full</span>
        <span><span style={{ ...cellStyle('done'), display: 'inline-block', padding: '2px 8px' }}>EOS</span> finished, leaves batch</span>
      </div>
      <Box variant="small" color="text-body-secondary" padding={{ top: 's' }}>
        Read across a column to see one engine step&apos;s running batch. Note that R2&apos;s long prefill is split into
        chunks (P1-P3) that share each step&apos;s token budget with R1&apos;s decodes; R3 joins the batch the step it
        arrives; R4 waits while the budget is saturated, then joins once R1 finishes and frees space. The batch&apos;s
        membership changes every single step: that is continuous (iteration-level) batching. Illustrative schedule,
        not measured output.
      </Box>
    </div>
  );
}

export function SchedulerBatching() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Continuous batching is the single biggest throughput lever in vLLM. This section covers how the scheduler decides what runs each step, and the knobs that trade latency for throughput."
          >
            4. Scheduler &amp; Continuous Batching
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The problem:</strong> Static batching (collect N requests, run them
            together until <em>all</em> finish, then start the next batch) wastes the GPU.
            Requests in a batch finish at different times (different output lengths), so the GPU
            sits at low utilization while the batch drains, waiting on its slowest member. New
            requests that arrive mid-batch must wait for the whole batch to complete before they
            even start. At serving scale this leaves most of the GPU idle most of the time.
          </Box>
          <Box variant="p">
            <strong>The answer:</strong> <strong>Continuous (iteration-level) batching.</strong>{' '}
            The scheduler runs once <em>per forward step</em>, not once per batch. Every step it
            re-decides which requests are in the running batch: finished requests leave immediately
            (freeing their KV-cache blocks), and newly arrived or previously waiting requests join,
            all without interrupting the requests that are mid-generation. The GPU stays
            saturated because there is always work to schedule into the gaps left by departing
            requests. This is the central throughput mechanism; everything else in this section is a
            knob that tunes <em>how</em> the scheduler fills each step.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The Continuous-Batching Timeline</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The diagram below shows four requests over eight engine steps. The key observation is
            <strong> vertical, not horizontal</strong>: read down any column to see the batch that
            actually ran in that step. Each step mixes prefill chunks and decode tokens from
            different requests, and the membership of that mix changes every step.
          </Box>
          <ContinuousBatchingTimeline />
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Requests join mid-flight</Box>
              <Box variant="p">
                R3 arrives at t2 and is scheduled the same step: it does not wait for R1 or
                R2 to finish. With static batching it would block until the whole batch drained.
              </Box>
            </div>
            <div>
              <Box variant="h3">Requests leave the instant they finish</Box>
              <Box variant="p">
                R1 emits EOS at t4 and is gone from t5 onward. Its KV-cache blocks are freed and
                immediately reusable, which is exactly what lets R4 finally get scheduled.
              </Box>
            </div>
            <div>
              <Box variant="h3">Prefill is chunked and interleaved</Box>
              <Box variant="p">
                R2&apos;s long prompt is split into chunks P1-P3 spread across t0-t2, sharing
                each step&apos;s token budget with other requests&apos; decodes rather than monopolizing the
                GPU for one giant prefill.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The Unified Scheduler &amp; the Per-Step Token Budget</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            In the V1 engine there is no fixed prefill phase followed by a decode phase. The V1{' '}
            <strong>unified scheduler</strong> &quot;treats both prompt and output tokens the same way by
            using a simple dictionary (e.g., <code>{'{request_id: num_tokens}'}</code>) to dynamically
            allocate a fixed token budget per request, enabling features like chunked prefills, prefix
            caching, and speculative decoding without a strict separation between prefill and decode
            phases.&quot;{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/stable/usage/v1_guide/"
              ariaLabel="vLLM V1 user guide, accessed 2026-06-07"
            >
              vLLM V1 guide (accessed 2026-06-07)
            </Link>
          </Box>
          <Box variant="p">
            Mechanically, each step the scheduler is handed a <strong>token budget</strong> (
            <code>max_num_batched_tokens</code>) and a cap on how many requests can be in the
            batch (<code>max_num_seqs</code>). It then fills the budget by assigning a token
            count to each candidate request: a decoding request asks for 1 token (its next position),
            while a prefilling request asks for as many of its remaining prompt tokens as fit. When a
            prompt is longer than the leftover budget, the scheduler takes a <em>chunk</em> of it and
            defers the rest to later steps. Prefill chunks and decode tokens compete for the same
            budget, which is what lets vLLM smoothly interleave the two.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">
                <code>max_num_batched_tokens</code>
              </Box>
              <Box variant="p">
                The total tokens (prefill + decode) the engine processes in one step. This is the
                throughput-vs-latency dial. &quot;Smaller values (e.g., 2048) achieve better inter-token
                latency (ITL) because there are fewer prefills slowing down decodes.&quot; &quot;Higher values
                achieve better time to first token (TTFT) as you can process more prefill tokens in a
                batch.&quot;{' '}
                <Link
                  external
                  href="https://docs.vllm.ai/en/stable/configuration/optimization.html"
                  ariaLabel="vLLM optimization guide, accessed 2026-06-07"
                >
                  optimization guide (accessed 2026-06-07)
                </Link>
              </Box>
            </div>
            <div>
              <Box variant="h3">
                <code>max_num_seqs</code>
              </Box>
              <Box variant="p">
                The maximum number of concurrent sequences in the running batch. It caps how many
                requests decode in parallel. Raising it increases concurrency and throughput but
                consumes more KV cache; lowering it &quot;reduces the number of concurrent requests in a
                batch, thereby requiring less KV cache space.&quot;{' '}
                <Link
                  external
                  href="https://docs.vllm.ai/en/stable/configuration/optimization.html"
                  ariaLabel="vLLM optimization guide, accessed 2026-06-07"
                >
                  optimization guide (accessed 2026-06-07)
                </Link>
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            <strong>For throughput-bound serving</strong>, vLLM recommends setting{' '}
            <code>max_num_batched_tokens &gt; 8192</code>, &quot;especially for smaller models on
            large GPUs.&quot; The trade-off is real: large batches push more prefill tokens per step,
            which can stall in-flight decodes and raise ITL. Tune from your actual TTFT/ITL targets,
            not from defaults.{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/stable/configuration/optimization.html"
              ariaLabel="vLLM optimization guide, accessed 2026-06-07"
            >
              optimization guide (accessed 2026-06-07)
            </Link>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Chunked Prefill</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What it does:</strong> A long prompt&apos;s prefill is a single compute-heavy
            operation that, run whole, monopolizes a forward step. While it runs, every decoding
            request in the batch is stalled: classic head-of-line blocking that spikes
            inter-token latency for everyone. Chunked prefill splits that prefill across multiple
            steps so each step does a bounded slice of prefill plus the in-flight decodes. The
            result is smoother ITL and no single request able to freeze the batch.
          </Box>
          <Box variant="p">
            In V1 this is the default: &quot;Chunked prefill is enabled by default whenever possible,
            unlike in V0 where it was conditionally enabled based on model characteristics.&quot;{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/stable/usage/v1_guide/"
              ariaLabel="vLLM V1 user guide, accessed 2026-06-07"
            >
              vLLM V1 guide (accessed 2026-06-07)
            </Link>{' '}
            It works by giving prefill chunks and decode tokens a shared per-step budget, &quot;better
            balancing compute-bound (prefill) and memory-bound (decode) operations.&quot;{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/stable/configuration/optimization.html"
              ariaLabel="vLLM optimization guide, accessed 2026-06-07"
            >
              optimization guide (accessed 2026-06-07)
            </Link>
          </Box>
          <Alert type="warning">
            <strong>Critical caveat: chunked prefill does NOT reduce KV-cache memory.</strong>{' '}
            Chunking is a <em>scheduling</em> technique: it spreads the prefill <em>compute</em> over
            time. It does nothing to the request&apos;s <em>memory</em> footprint. A 30K-token prompt
            still reserves KV-cache blocks for all 30K positions, whether you prefill it in one step
            or thirty. If you are hitting out-of-memory or preemption, chunked prefill will not save
            you. The constraint is KV-cache capacity (covered in{' '}
            <strong>Section 5: PagedAttention &amp; KV-Cache</strong>), and the fixes are the
            memory knobs below, not chunking. [SPECULATIVE: the vLLM docs describe chunked prefill as
            a compute-scheduling/latency feature; the &quot;no KV reduction&quot; framing is the architectural
            consequence (KV footprint is a function of sequence length, not chunk size), not a
            verbatim doc statement.]
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Preemption Under Memory Pressure</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Continuous batching admits requests aggressively to keep the GPU busy, which means
            the scheduler can over-commit KV cache. As accepted requests grow their output, &quot;there
            are times when KV cache space is insufficient to handle all batched requests.&quot; When that
            happens, vLLM <strong>preempts</strong> a request: it evicts the request from the running
            batch to free its blocks for the others, and resumes it later.{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/stable/configuration/optimization.html"
              ariaLabel="vLLM optimization guide, accessed 2026-06-07"
            >
              optimization guide (accessed 2026-06-07)
            </Link>
          </Box>
          <Box variant="p">
            &quot;In vLLM V1, the default preemption mode is <code>RECOMPUTE</code> rather than{' '}
            <code>SWAP</code>.&quot; RECOMPUTE discards the preempted request&apos;s KV cache entirely and
            re-runs its prefill from scratch when it is rescheduled, trading wasted compute for
            freed memory. You can see it happen in the logs:{' '}
            <code>
              WARNING ... scheduler.py ... Sequence group 0 is preempted by
              PreemptionMode.RECOMPUTE mode because there is not enough KV cache space.
            </code>{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/stable/configuration/optimization.html"
              ariaLabel="vLLM optimization guide, accessed 2026-06-07"
            >
              optimization guide (accessed 2026-06-07)
            </Link>
          </Box>
          <Alert type="error">
            <strong>Preemption is a throughput killer: treat repeated preemptions as an alarm.</strong>{' '}
            Every RECOMPUTE throws away a prefill that already ran and re-does it. A steady stream of
            these warnings means you are over-subscribed on KV cache and burning compute re-prefilling
            the same requests. It is one of the first things to grep for when throughput mysteriously
            collapses under load.
          </Alert>
          <Box variant="p">
            <strong>How to avoid it.</strong> The fixes all reduce KV-cache pressure. The vLLM docs
            recommend: &quot;Increase <code>gpu_memory_utilization</code>&quot; (give the KV cache more of the
            GPU&apos;s memory); &quot;Decrease <code>max_num_seqs</code> or <code>max_num_batched_tokens</code>&quot;
            (admit fewer concurrent requests so they fit); &quot;Increase <code>tensor_parallel_size</code>&quot;
            or &quot;Increase <code>pipeline_parallel_size</code>&quot; (shard the model across more GPUs so the
            weights leave more room per GPU for KV cache).{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/stable/configuration/optimization.html"
              ariaLabel="vLLM optimization guide, accessed 2026-06-07"
            >
              optimization guide (accessed 2026-06-07)
            </Link>
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Tuning Quick Reference</Header>}>
        <SpaceBetween size="m">
          <Table
            variant="embedded"
            columnDefinitions={[
              { id: 'knob', header: 'Knob', cell: (e) => e.knob },
              { id: 'effect', header: 'Primary effect', cell: (e) => e.effect },
              { id: 'raise', header: 'Raise when', cell: (e) => e.raise },
              { id: 'lower', header: 'Lower when', cell: (e) => e.lower },
            ]}
            items={[
              {
                knob: <code>max_num_batched_tokens</code>,
                effect: 'Per-step token budget. Higher → better TTFT + throughput; lower → better ITL (fewer prefills stalling decodes).',
                raise: 'Throughput / TTFT matter most; large GPU, small-ish model (docs suggest >8192).',
                lower: 'Tight ITL targets; or to relieve KV-cache pressure / preemption.',
              },
              {
                knob: <code>max_num_seqs</code>,
                effect: 'Max concurrent sequences in the batch. Higher → more parallel decodes + KV usage.',
                raise: 'Have spare KV cache and want more concurrency / throughput.',
                lower: 'Seeing preemption / OOM; fewer requests need less KV space.',
              },
              {
                knob: <code>gpu_memory_utilization</code>,
                effect: 'Fraction of GPU memory vLLM may use; the rest becomes KV cache headroom.',
                raise: 'Preemption warnings: give the KV cache more room (first lever to try).',
                lower: 'Leaving room for other processes on the GPU, or OOM at startup.',
              },
              {
                knob: <code>tensor_parallel_size</code>,
                effect: 'Shards model weights across GPUs; less weight memory per GPU → more KV cache per GPU.',
                raise: 'Model + KV will not fit on one GPU, or to escape preemption.',
                lower: 'Model fits comfortably; avoid cross-GPU communication overhead.',
              },
              {
                knob: 'Chunked prefill (default on)',
                effect: 'Splits long prefills across steps → smoother ITL, less head-of-line blocking. Does NOT reduce KV memory.',
                raise: 'Leave enabled; it is the V1 default.',
                lower: 'Rarely; only if a workload profiles better with whole-prompt prefill.',
              },
            ]}
          />
          <Alert type="info">
            <strong>Cross-links.</strong> The batch size is ultimately bounded by KV-cache
            capacity, not by these knobs alone. See{' '}
            <strong>Section 5: PagedAttention &amp; KV-Cache</strong> for how the cache is laid out
            and why it is the real ceiling. For the actual <code>schedule()</code> implementation
            (the budget loop, the running/waiting queues, and how preemption is wired),
            see the <strong>&quot;Inside the Codebase &rarr; Scheduler &amp; KV Cache&quot;</strong> tab.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Deeper Notes</Header>}>
        <SpaceBetween size="s">
          <ExpandableSection headerText="Why iteration-level scheduling beats request-level scheduling">
            <SpaceBetween size="s">
              <Box variant="p">
                The win comes from the variance in output lengths. In a request-level (static)
                batch, the batch&apos;s wall-clock duration is set by its longest generation; every
                shorter request holds a slot it no longer needs, and the GPU processes a shrinking,
                increasingly sparse batch as members finish. Iteration-level scheduling re-packs the
                batch every step, so a finished request&apos;s slot is reclaimed within one step rather
                than at the end of the batch.
              </Box>
              <Box variant="p">
                The cost is scheduler overhead: vLLM runs the scheduler on every forward step. The
                design keeps that path cheap (a dictionary of pending token counts, simple queue
                operations) so it does not eat the throughput it produces. The actual implementation
                lives in the scheduler module; see the codebase tab.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <ExpandableSection headerText="How the per-step budget interleaves prefill and decode">
            <SpaceBetween size="s">
              <Box variant="p">
                Each step the scheduler walks its candidate requests and assigns each a token count,
                debiting the shared <code>max_num_batched_tokens</code> budget. Decodes are cheap
                (1 token each) so many fit; a prefill takes a chunk sized to whatever budget remains.
                Because both draw from one budget, a step can be pure-decode, pure-prefill, or any
                mix: the &quot;unified&quot; in unified scheduler. This is also why
                <code> max_num_batched_tokens</code> is the master latency dial: it directly bounds
                how much prefill can crowd into a step alongside decodes.
              </Box>
              <Box variant="p">
                The same shared-budget mechanism is what makes prefix caching and speculative
                decoding compose cleanly: cached-prefix tokens simply do not need budget, and
                speculative draft tokens are budgeted like extra decode tokens. (Prefix caching is
                Section 6; speculative decoding is Section 11.)
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <ExpandableSection headerText="RECOMPUTE vs SWAP: why V1 dropped swapping">
            <SpaceBetween size="s">
              <Box variant="p">
                Under preemption, the engine must free a request&apos;s KV blocks. SWAP copies them to
                CPU memory and copies them back on resume; RECOMPUTE discards them and re-runs the
                prefill. V1 defaults to RECOMPUTE: with PagedAttention and prefix caching, a
                re-prefill is often cheaper and simpler than paying the PCIe round-trip of a swap,
                and parts of the recomputation can hit the prefix cache. Either way, preemption
                means wasted work. The right move is to avoid it via the memory knobs above,
                not to optimize which preemption strategy runs.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
