import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, sglangUrl } from '../../components/Cite';

const SRT = 'python/sglang/srt';
const SCHEDULER = `${SRT}/managers/scheduler.py`;
const RECEIVER = `${SRT}/managers/scheduler_components/request_receiver.py`;
const OVERLAP = `${SRT}/managers/overlap_utils.py`;
const POLICY = `${SRT}/managers/schedule_policy.py`;
const BATCH = `${SRT}/managers/schedule_batch.py`;
const RATIO = `${SRT}/managers/scheduler_components/new_token_ratio_tracker.py`;
const RESULTS = `${SRT}/managers/scheduler_components/batch_result_processor.py`;
const METRICS = `${SRT}/managers/scheduler_components/metrics_reporter.py`;
const POOL_STATS = `${SRT}/managers/scheduler_components/pool_stats_observer.py`;
const COLLECTOR = `${SRT}/observability/metrics_collector.py`;
const ENVIRON = `${SRT}/environ.py`;
const SCHED_FIELDS = `${SRT}/arg_groups/fields/schedule.py`;
const OBS_FIELDS = `${SRT}/arg_groups/fields/observability.py`;

/* ------------------------------------------------------------------------ */
/* Reading path                                                             */
/* ------------------------------------------------------------------------ */

interface StopRow {
  id: string;
  stop: string;
  file: ReactNode;
  owns: ReactNode;
}

const WALK: StopRow[] = [
  {
    id: 'proc',
    stop: '1',
    file: (
      <>
        <Cite tier={1} href={sglangUrl(SCHEDULER, 'L6076-L6157')}>
          scheduler.py L6076-L6157
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(SCHEDULER, 'L460-L723')}>
          L460-L723
        </Cite>
      </>
    ),
    owns: (
      <>
        <code>run_scheduler_process</code> publishes the scheduler&apos;s configuration (L6093-L6101),
        builds the <code>Scheduler</code> (L6128) and runs its loop (L6134). <code>__init__</code>{' '}
        is a sequence of <code>init_*</code> calls by design (L465-L468);{' '}
        <code>init_model_worker</code> loads the weights, sizes the KV (key-value) pools and
        captures CUDA graphs (L1098-L1130).
      </>
    ),
  },
  {
    id: 'recv',
    stop: '2',
    file: (
      <>
        <Cite tier={1} href={sglangUrl(RECEIVER, 'L80-L212')}>
          request_receiver.py L80-L212
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(SCHEDULER, 'L2098-L2136')}>
          scheduler.py L2098-L2136
        </Cite>
      </>
    ),
    owns: (
      <>
        On the first PP (pipeline parallelism) stage, attention-TP (tensor parallelism) rank 0
        drains the ZMQ (ZeroMQ) socket from the TokenizerManager without blocking (L112-L161) and
        broadcasts what it read to the other ranks (L163-L212). <code>ingest_requests</code> hands each message on; a generate request becomes a{' '}
        <code>Req</code> in <code>handle_generate_request</code> (L2820) and joins the waiting queue
        in <code>_add_request_to_queue</code> (L3353-L3366).
      </>
    ),
  },
  {
    id: 'dispatch',
    stop: '3',
    file: (
      <Cite tier={1} href={sglangUrl(SCHEDULER, 'L5975-L6013')}>
        scheduler.py L5975-L6013
      </Cite>
    ),
    owns: (
      <>
        <code>dispatch_event_loop</code> picks one of eleven loops from the PD (prefill-decode)
        disaggregation mode, the PP size and the overlap flag. A GPU server with default flags
        runs <code>event_loop_overlap</code>.
      </>
    ),
  },
  {
    id: 'loops',
    stop: '4',
    file: (
      <Cite tier={1} href={sglangUrl(SCHEDULER, 'L1939-L2086')}>
        scheduler.py L1939-L2086
      </Cite>
    ),
    owns: (
      <>
        <code>event_loop_normal</code> (L1939-L1972) and <code>event_loop_overlap</code>{' '}
        (L1974-L2048): the order of one step. <code>is_disable_overlap_for_batch</code>{' '}
        (L2050-L2086) decides when the overlap loop processes the previous result before launching.
      </>
    ),
  },
  {
    id: 'run',
    stop: '5',
    file: (
      <>
        <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4530-L4627')}>
          scheduler.py L4530-L4627
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(OVERLAP, 'L255-L328')}>
          overlap_utils.py L255-L328
        </Cite>
      </>
    ),
    owns: (
      <>
        <code>run_batch</code>&apos;s overlap branch launches the forward and leaves the next
        step&apos;s input to <code>FutureMap</code>, the relay the next block walks.
      </>
    ),
  },
  {
    id: 'next',
    stop: '6',
    file: (
      <Cite tier={1} href={sglangUrl(SCHEDULER, 'L3766-L3905')}>
        scheduler.py L3766-L3905
      </Cite>
    ),
    owns: (
      <>
        <code>get_next_batch_to_run</code>: a prefill batch runs first if one can be formed
        (L3870-L3872); otherwise the running requests take a decode step.
      </>
    ),
  },
  {
    id: 'policy',
    stop: '7',
    file: (
      <Cite tier={1} href={sglangUrl(POLICY, 'L133-L311')}>
        schedule_policy.py L133-L311
      </Cite>
    ),
    owns: (
      <>
        The policy enums (L168-L182) and <code>calc_priority</code> (L209-L276), which orders the
        waiting queue each time a prefill batch is planned.
      </>
    ),
  },
  {
    id: 'adder',
    stop: '8',
    file: (
      <>
        <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4034-L4052')}>
          scheduler.py L4034-L4052
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(POLICY, 'L581-L640')}>
          schedule_policy.py L581-L640
        </Cite>
      </>
    ),
    owns: (
      <>
        <code>_get_new_batch_prefill_raw</code> (from L3954) builds a <code>PrefillAdder</code>{' '}
        for the step; the adder holds the token budget and admits waiting requests one at a time in{' '}
        <code>add_one_req</code> (L1336-L1360).
      </>
    ),
  },
  {
    id: 'ratio',
    stop: '9',
    file: (
      <Cite tier={1} href={sglangUrl(RATIO, 'L20-L49')}>
        new_token_ratio_tracker.py L20-L49
      </Cite>
    ),
    owns: (
      <>
        <code>NewTokenRatioTracker</code>: the bet on how much of its remaining output a running
        request will still produce.
      </>
    ),
  },
  {
    id: 'retract',
    stop: '10',
    file: (
      <>
        <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4335-L4418')}>
          scheduler.py L4335-L4418
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(BATCH, 'L3298-L3427')}>
          schedule_batch.py L3298-L3427
        </Cite>
      </>
    ),
    owns: (
      <>
        <code>update_running_batch</code> prepares the decode step and retracts requests when the KV
        pool cannot hold it; <code>retract_decode</code> chooses which, and the module-level{' '}
        <code>release_req</code> (schedule_batch.py L2242-L2276) frees their memory.
      </>
    ),
  },
  {
    id: 'result',
    stop: '11',
    file: (
      <>
        <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4921-L4957')}>
          scheduler.py L4921-L4957
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(RESULTS, 'L942-L1016')}>
          batch_result_processor.py L942-L1016
        </Cite>
      </>
    ),
    owns: (
      <>
        <code>process_batch_result</code> routes a finished batch to the prefill or decode handler
        (batch_result_processor.py L258 and L942), which append tokens, update each
        request&apos;s finish state and stream outputs to the detokenizer.
      </>
    ),
  },
  {
    id: 'log',
    stop: '12',
    file: (
      <Cite tier={1} href={sglangUrl(METRICS, 'L696-L1020')}>
        metrics_reporter.py L696-L1020
      </Cite>
    ),
    owns: (
      <>
        <code>report_prefill_stats</code> (L696-L760) and <code>report_decode_stats</code>{' '}
        (L878-L1020) write the two periodic log lines the last block maps.
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
/* Log fields                                                               */
/* ------------------------------------------------------------------------ */

interface LogRow {
  id: string;
  field: ReactNode;
  source: ReactNode;
  reads: ReactNode;
}

const LOG_FIELDS: LogRow[] = [
  {
    id: 'newseq',
    field: <code>#new-seq</code>,
    source: (
      <>
        <code>len(adder.can_run_list)</code>
      </>
    ),
    reads: 'Requests the PrefillAdder admitted to this prefill batch.',
  },
  {
    id: 'newtok',
    field: <code>#new-token</code>,
    source: <code>adder.log_input_tokens</code>,
    reads: 'Prompt tokens computed in this batch, after the prefix match.',
  },
  {
    id: 'cached',
    field: <code>#cached-token</code>,
    source: <code>adder.log_hit_tokens</code>,
    reads: 'Prompt tokens reused from the radix cache, so neither computed nor charged.',
  },
  {
    id: 'usage',
    field: <code>token usage</code>,
    source: (
      <>
        <code>full_token_usage</code>{' '}
        <Cite tier={1} href={sglangUrl(POOL_STATS, 'L104-L149')} kind="code">
          pool_stats_observer.py L104-L149
        </Cite>
      </>
    ),
    reads: 'The fraction of the KV pool in use when the line prints.',
  },
  {
    id: 'running',
    field: <code>#running-req</code>,
    source: (
      <>
        prefill line: running batch when the batch was built; decode line:{' '}
        <code>len(batch.reqs)</code>
      </>
    ),
    reads: 'Requests decoding together.',
  },
  {
    id: 'queue',
    field: <code>#queue-req</code>,
    source: <code>len(self.scheduler.waiting_queue)</code>,
    reads: 'Requests waiting for admission, read when the line prints.',
  },
  {
    id: 'retract',
    field: (
      <>
        <code>KV cache pool is full. Retract requests.</code>
      </>
    ),
    source: (
      <>
        <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4398-L4413')} kind="code">
          scheduler.py L4398-L4413
        </Cite>
      </>
    ),
    reads: (
      <>
        Retracted count, tokens freed and <code>#new_token_ratio: old -&gt; new</code>: the bet was
        too low for this mix, and the ratio jumps.
      </>
    ),
  },
];

/* ------------------------------------------------------------------------ */
/* The tab                                                                  */
/* ------------------------------------------------------------------------ */

export function CodebaseScheduler() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h2"
            description="Open the scheduler in the order a step runs, so each behaviour from section 4 maps to one function you can read"
          >
            The scheduler loop in twelve stops
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each scheduler process runs one loop: take in new requests, plan the next batch, launch
            it on the GPU, and process the results of the batch before it. Section 4, The Scheduler,
            explains the two bets that loop makes. It plans one batch ahead of the GPU, and it
            admits requests against a predicted output length, charging a new request up to{' '}
            <strong>4096 output tokens</strong> and a running request{' '}
            <strong>70% of its remaining output</strong> at the start. This tab names the code
            behind both, in the order one step runs.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={WALK}
            columnDefinitions={STOP_COLUMNS}
          />
          <Box variant="p">
            The launch that creates this process, and the resolution steps that size its chunk and
            its budget, are in the Launch Path &amp; Argument Resolution tab. <code>scheduler.py</code>{' '}
            alone is 6,171 lines at v0.5.22; stops 4 to 10 are the part a performance question
            usually lands in.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See where the CPU stops waiting for the GPU, so a log line or a stall lines up with the batch that caused it"
          >
            One batch ahead, in code
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <code>event_loop_overlap</code> runs a step in this order: take in requests, plan batch
            N+1, launch it, queue it, then process the result of batch N, and only then sample batch
            N+1 when its sampling was deferred, because sampling can depend on the previous result
            (grammar state, for example){' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L1974-L2048')} kind="code">
              scheduler.py L1974-L2048
            </Cite>
            . <code>event_loop_normal</code> runs the same steps with each result processed right
            after its own launch{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L1939-L1972')} kind="code">
              scheduler.py L1939-L1972
            </Cite>
            . Overlap is on unless the resolved <code>disable_overlap_schedule</code> is true,
            from <code>--disable-overlap-schedule</code> or from a resolution step{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L495-L497')}>
              scheduler.py L495-L497
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>The class behind section 4&apos;s relay is <code>FutureMap</code>.</strong> Its
            docstring calls it an &quot;Always-on pool-indexed relay for cross-iter values&quot;,
            and its <code>output_tokens_buf</code> holds one token per row of the request pool{' '}
            <Cite tier={1} href={sglangUrl(OVERLAP, 'L255-L291')}>
              overlap_utils.py L255-L291
            </Cite>
            . <code>init_overlap</code> creates it in both loops, because the normal loop relays
            decode inputs through it too{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L1617-L1639')}>
              scheduler.py L1617-L1639
            </Cite>
            . One overlapped step, in <code>run_batch</code>:
          </Box>
          <ol>
            <li>
              The forward stream waits for the scheduling stream, and{' '}
              <code>resolve_forward_inputs</code> fills the batch&apos;s input ids (L4538-L4544).
            </li>
            <li>
              After the forward, <code>_relay_forward_payload</code> writes the sampled tokens into{' '}
              <code>output_tokens_buf</code> at each request&apos;s pool row{' '}
              <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4830-L4852')} kind="code">
                scheduler.py L4830-L4852
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(OVERLAP, 'L627-L663')} kind="code">
                overlap_utils.py L627-L663
              </Cite>
              .
            </li>
            <li>
              The copy of the result to the host runs on a separate copy stream, behind a{' '}
              <code>copy_done</code> event (L4594-L4616).
            </li>
            <li>
              <code>batch.input_ids</code> is set to <code>None</code> (L4619-L4620). On the next
              step, <code>resolve_forward_inputs</code> gathers{' '}
              <code>output_tokens_buf[batch.req_pool_indices]</code> on the GPU{' '}
              <Cite tier={1} href={sglangUrl(OVERLAP, 'L87-L131')} kind="code">
                overlap_utils.py L87-L131
              </Cite>
              , so the CPU plans step N+1 without ever reading step N&apos;s token values.
            </li>
          </ol>
          <Box variant="p">
            Line numbers in this list are in{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4530-L4627')} kind="code">
              scheduler.py L4530-L4627
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Where the one-step lag shows.</strong> The CPU waits on the GPU at one point:
            the decode result handler blocks on the previous batch&apos;s <code>copy_done</code>{' '}
            <Cite tier={1} href={sglangUrl(RESULTS, 'L947-L948')} kind="code">
              batch_result_processor.py L947-L948
            </Cite>
            . A request that hit EOS (end of sequence) in batch N was already planned into batch N+1,
            so the handler skips its extra token and the over-allocated KV slot is freed with the
            request{' '}
            <Cite tier={1} href={sglangUrl(RESULTS, 'L1012-L1016')} kind="code">
              batch_result_processor.py L1012-L1016
            </Cite>
            . Requests whose queued result already finishes them by length are dropped before the
            next decode step is planned{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4320-L4345')} kind="code">
              scheduler.py L4320-L4345
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="When the overlap loop processes a result before launching">
            <Box variant="p">
              <code>is_disable_overlap_for_batch</code> returns true in two cases: two prefill
              batches in a row with <code>SGLANG_DISABLE_CONSECUTIVE_PREFILL_OVERLAP</code> set,
              which is off by default, and a speculative decode step whose grammar needs the
              previous step&apos;s tokens{' '}
              <Cite tier={1} href={sglangUrl(SCHEDULER, 'L2050-L2086')} kind="code">
                scheduler.py L2050-L2086
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(ENVIRON, 'L642')}>
                environ.py L642
              </Cite>
              . In either case the loop processes batch N first and then launches N+1 serially, for
              that step only.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Trace a queued request, a slow admission or a retraction warning to the arithmetic that produced it"
          >
            Admission and retraction, in code
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Order the queue.</strong> <code>calc_priority</code> sorts the waiting queue by
            the active policy each time a prefill batch is planned{' '}
            <Cite tier={1} href={sglangUrl(POLICY, 'L209-L276')} kind="code">
              schedule_policy.py L209-L276
            </Cite>
            . The default is FCFS (first come, first served){' '}
            <Cite tier={1} href={sglangUrl(SCHED_FIELDS, 'L82-L98')}>
              schedule.py L82-L98
            </Cite>
            . LPM (longest prefix match) and HRRN (highest response ratio next) fall back to FCFS
            while more than 128 requests wait, because prefix matching every waiting request costs
            CPU time on every step{' '}
            <Cite tier={1} href={sglangUrl(POLICY, 'L133')} kind="code">
              schedule_policy.py L133
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(POLICY, 'L300-L311')} kind="code">
              L300-L311
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Charge each request.</strong> The scheduler builds a <code>PrefillAdder</code>{' '}
            per step and passes it the tracker&apos;s current ratio{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4034-L4052')} kind="code">
              scheduler.py L4034-L4052
            </Cite>
            . <code>add_one_req</code> charges a new request its uncached prompt plus{' '}
            <code>min(max_new_tokens - output so far, 4096)</code>{' '}
            <Cite tier={1} href={sglangUrl(POLICY, 'L1336-L1360')} kind="code">
              schedule_policy.py L1336-L1360
            </Cite>
            , and charges each running request its remaining output, capped the same way, times
            the ratio; a request with <code>ignore_eos</code> is charged at 1.0{' '}
            <Cite tier={1} href={sglangUrl(POLICY, 'L754-L763')} kind="code">
              schedule_policy.py L754-L763
            </Cite>
            . The cap is <code>SGLANG_CLIP_MAX_NEW_TOKENS_ESTIMATION</code>, and the comment beside
            it says it changes the estimate only, never the stop condition{' '}
            <Cite tier={1} href={sglangUrl(POLICY, 'L80-L86')}>
              schedule_policy.py L80-L86
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Move the bet.</strong> <code>NewTokenRatioTracker.from_config</code> starts the
            ratio at <code>min(0.7 x schedule_conservativeness, 1.0)</code>, sets the floor at 0.14
            times the start, and spreads the descent over 600 steps{' '}
            <Cite tier={1} href={sglangUrl(RATIO, 'L20-L32')} kind="code">
              new_token_ratio_tracker.py L20-L32
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(ENVIRON, 'L595-L599')}>
              environ.py L595-L599
            </Cite>
            . Every decode step that needs no retraction lowers it one notch{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4417-L4418')} kind="code">
              scheduler.py L4417-L4418
            </Cite>
            , and an idle scheduler resets it to the start{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L5149')} kind="code">
              scheduler.py L5149
            </Cite>
            . By our arithmetic at the default conservativeness, it falls from 0.7 to 0.098 over 600
            decode steps. The tracker reads the resolved <code>schedule_conservativeness</code>{' '}
            through <code>get_schedule()</code>, so the attention-DP (data parallelism) multiplier
            from the Launch Path &amp; Argument Resolution tab lands here: a 0.21 start.
          </Box>
          <Box variant="p">
            <strong>Retract when the bet loses.</strong> When the KV pool cannot hold the next
            decode step, <code>update_running_batch</code> calls <code>retract_decode</code>, logs
            the warning and puts the retracted requests back in the waiting queue{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4352-L4416')} kind="code">
              scheduler.py L4352-L4416
            </Cite>
            . Under the default <code>length</code> policy it retracts the request with the fewest
            output tokens first, the longest prompt breaking ties, and always keeps one{' '}
            <Cite tier={1} href={sglangUrl(BATCH, 'L3298-L3427')} kind="code">
              schedule_batch.py L3298-L3427
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SCHED_FIELDS, 'L122-L133')}>
              schedule.py L122-L133
            </Cite>
            . <code>release_req</code> frees the request&apos;s KV and evicts 20 tokens from the
            radix tree for each request still running{' '}
            <Cite tier={1} href={sglangUrl(BATCH, 'L2242-L2276')} kind="code">
              schedule_batch.py L2242-L2276
            </Cite>
            . The ratio is then reset to what the remaining requests have shown: decoded tokens plus
            20 per request, over the sum of their <code>max_new_tokens</code>{' '}
            <Cite tier={1} href={sglangUrl(RATIO, 'L40-L49')} kind="code">
              new_token_ratio_tracker.py L40-L49
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Map the scheduler's two periodic log lines to the variables above, and tell an admission limit from a memory limit on your own server"
          >
            Read the scheduler&apos;s log against its code
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The <code>Prefill batch</code> line prints when a prefill batch&apos;s result is
            processed, from counts captured when the batch was built{' '}
            <Cite tier={1} href={sglangUrl(RESULTS, 'L509-L515')} kind="code">
              batch_result_processor.py L509-L515
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4239-L4248')} kind="code">
              scheduler.py L4239-L4248
            </Cite>
            . The <code>Decode batch</code> line prints every 40 decode steps, the default{' '}
            <code>--decode-log-interval</code>{' '}
            <Cite tier={1} href={sglangUrl(METRICS, 'L911')} kind="code">
              metrics_reporter.py L911
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(OBS_FIELDS, 'L136-L139')}>
              observability.py L136-L139
            </Cite>
            . Only attention-TP rank 0 writes either line{' '}
            <Cite tier={1} href={sglangUrl(COLLECTOR, 'L1329')} kind="code">
              metrics_collector.py L1329
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(METRICS, 'L781-L782')} kind="code">
              metrics_reporter.py L781-L782
            </Cite>
            , so by our reading each attention-DP rank logs its own lines. Our reading of the overlap loop: batch N&apos;s prefill line prints after batch N+1
            has launched, so its token counts describe batch N while its <code>#queue-req</code>{' '}
            is the queue at print time.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={LOG_FIELDS}
            columnDefinitions={[
              { id: 'field', header: 'Log field', cell: (r: LogRow) => r.field, minWidth: 150 },
              { id: 'source', header: 'Where the value comes from', cell: (r: LogRow) => r.source, minWidth: 200 },
              { id: 'reads', header: 'What it tells you', cell: (r: LogRow) => r.reads, minWidth: 220 },
            ]}
          />
          <Box variant="small" color="text-body-secondary">
            Prefill fields are built in{' '}
            <Cite tier={1} href={sglangUrl(METRICS, 'L100-L154')} kind="code">
              metrics_reporter.py L100-L154
            </Cite>{' '}
            and formatted in{' '}
            <Cite tier={1} href={sglangUrl(METRICS, 'L696-L760')} kind="code">
              L696-L760
            </Cite>
            ; decode fields in{' '}
            <Cite tier={1} href={sglangUrl(METRICS, 'L878-L1020')} kind="code">
              L878-L1020
            </Cite>
            .
          </Box>
          <Box variant="p">
            Read three fields together on your own server. A <code>#queue-req</code> that grows
            while <code>token usage</code> stays well below 1.0 is, by our reading of the adder, the
            charge holding requests back: the pool is reserved for output not yet generated. A
            retraction warning is the opposite case, a bet that was too low, and its ratio pair
            shows how far the tracker had to jump. A high <code>#cached-token</code> against{' '}
            <code>#new-token</code> means admission is cheap for those requests, because cached
            prompt tokens are not charged. Then compare the queue to what the scheduler charges: up
            to <strong>4096 output tokens</strong> for every new request and{' '}
            <strong>70% of the remaining output</strong> for every running one at the start. If your
            answers run far shorter, send a <code>max_new_tokens</code> near their real length from
            the client before you change <code>--schedule-conservativeness</code> on the server.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
