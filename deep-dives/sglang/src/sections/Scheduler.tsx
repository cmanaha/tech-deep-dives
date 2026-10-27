import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangDocsSrcUrl } from '../components/Cite';

const SCHEDULER = 'python/sglang/srt/managers/scheduler.py';
const POLICY = 'python/sglang/srt/managers/schedule_policy.py';
const BATCH = 'python/sglang/srt/managers/schedule_batch.py';
const RATIO = 'python/sglang/srt/managers/scheduler_components/new_token_ratio_tracker.py';
const RESULTS = 'python/sglang/srt/managers/scheduler_components/batch_result_processor.py';
const REPORTER = 'python/sglang/srt/managers/scheduler_components/metrics_reporter.py';
const OVERLAP = 'python/sglang/srt/managers/overlap_utils.py';
const TP_WORKER = 'python/sglang/srt/managers/tp_worker.py';
const FIELDS = 'python/sglang/srt/arg_groups/fields/schedule.py';
const OBS_FIELDS = 'python/sglang/srt/arg_groups/fields/observability.py';
const OVERRIDES = 'python/sglang/srt/arg_groups/overrides.py';
const SPEC_HOOK = 'python/sglang/srt/arg_groups/speculative_hook.py';
const VALIDATION = 'python/sglang/srt/arg_groups/validation_hook.py';
const MEMORY_HOOK = 'python/sglang/srt/arg_groups/memory_hook.py';
const ENVIRON = 'python/sglang/srt/environ.py';
const BUDGET = 'python/sglang/srt/mem_cache/prefill_budget.py';
const KV_CONF = 'python/sglang/srt/mem_cache/kv_cache_configurator.py';
const COLLECTOR = 'python/sglang/srt/observability/metrics_collector.py';
const HTTP_SERVER = 'python/sglang/srt/entrypoints/http_server.py';
const TUNING = 'advanced_features/hyperparameter_tuning';

const VLLM_SCHEDULER_LINK = (
  <Link href="../vllm/">vLLM dive, section 4: Scheduler &amp; Continuous Batching</Link>
);

/* ------------------------------------------------------------------------ */
/* Diagram 1: the overlap timeline                                          */
/* ------------------------------------------------------------------------ */

interface LaneBlock {
  x: number;
  w: number;
  t: string;
  s?: string;
  kind: 'cpu' | 'gpu' | 'idle' | 'wait';
  eos?: boolean;
}

const NORMAL_CPU: LaneBlock[] = [
  { x: 90, w: 100, t: 'schedule N', kind: 'cpu' },
  { x: 190, w: 140, t: 'waits for GPU', kind: 'wait' },
  { x: 330, w: 100, t: 'process N', kind: 'cpu' },
  { x: 430, w: 110, t: 'schedule N+1', kind: 'cpu' },
  { x: 540, w: 140, t: 'waits for GPU', kind: 'wait' },
  { x: 680, w: 110, t: 'process N+1', kind: 'cpu' },
];

const NORMAL_GPU: LaneBlock[] = [
  { x: 90, w: 100, t: 'idle', kind: 'idle' },
  { x: 190, w: 140, t: 'forward N', kind: 'gpu' },
  { x: 330, w: 210, t: 'GPU idle', kind: 'idle' },
  { x: 540, w: 140, t: 'forward N+1', kind: 'gpu' },
  { x: 680, w: 110, t: 'idle', kind: 'idle' },
];

const OVERLAP_CPU: LaneBlock[] = [
  { x: 90, w: 140, t: 'plan + launch N+1', s: 'R still in the batch', kind: 'cpu' },
  { x: 230, w: 110, t: 'waits for N', kind: 'wait' },
  { x: 340, w: 100, t: 'process N', s: "sees R's EOS", kind: 'cpu' },
  { x: 440, w: 150, t: 'plan + launch N+2', s: 'R left out', kind: 'cpu' },
  { x: 590, w: 100, t: 'process N+1', s: 'finish checks', kind: 'cpu' },
  { x: 690, w: 100, t: 'plan N+3', s: 'and so on', kind: 'cpu' },
];

const OVERLAP_GPU: LaneBlock[] = [
  { x: 90, w: 250, t: 'forward N', s: 'request R samples EOS', kind: 'gpu', eos: true },
  {
    x: 340,
    w: 250,
    t: 'forward N+1',
    s: 'R decoded once more, token discarded',
    kind: 'gpu',
    eos: true,
  },
  { x: 590, w: 200, t: 'forward N+2', s: 'R no longer in the batch', kind: 'gpu' },
];

function renderLane(blocks: LaneBlock[], y: number, h: number, keyPrefix: string) {
  return blocks.map((b, i) => {
    const cx = b.x + b.w / 2;
    const cls =
      b.kind === 'cpu'
        ? 'scheduler-overlap-cpu'
        : b.kind === 'gpu'
          ? 'scheduler-overlap-gpu'
          : b.kind === 'wait'
            ? 'scheduler-overlap-wait'
            : 'scheduler-overlap-idle';
    const twoLines = Boolean(b.s);
    const isGap = b.kind === 'idle' || b.kind === 'wait';
    return (
      <g key={`${keyPrefix}-${i}`}>
        <rect x={b.x + 2} y={y} width={b.w - 4} height={h} rx={4} className={cls} />
        {twoLines ? (
          <>
            <text x={cx} y={y + 18} className="scheduler-overlap-t">
              {b.t}
            </text>
            <text
              x={cx}
              y={y + 34}
              className={b.eos ? 'scheduler-overlap-eos' : 'scheduler-overlap-s'}
            >
              {b.s}
            </text>
          </>
        ) : (
          <text
            x={cx}
            y={y + h / 2 + 4}
            className={isGap ? 'scheduler-overlap-s' : 'scheduler-overlap-t'}
          >
            {b.t}
          </text>
        )}
      </g>
    );
  });
}

function OverlapTimelineDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 800 336"
        role="img"
        aria-labelledby="scheduler-overlap-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="scheduler-overlap-title">
          In the plain loop the CPU and the GPU take turns, so the GPU sits idle while the CPU
          schedules a batch and processes its result. In the default overlap loop the CPU plans and
          launches batch N+1 while the GPU still runs batch N, and the sampled tokens of N become the
          input of N+1 on the GPU, so forwards run back to back. The price is that a request R which
          samples its end-of-sequence token in batch N is already in batch N+1, decodes one extra
          token there, and that token is discarded.
        </title>
        <style>{`
          .scheduler-overlap-h { fill: #16191f; font: 600 12px sans-serif; }
          .scheduler-overlap-lane { fill: #414d5c; font: 600 12px sans-serif; }
          .scheduler-overlap-cpu { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.2; }
          .scheduler-overlap-gpu { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.2; }
          .scheduler-overlap-idle { fill: #ffffff; stroke: #879596; stroke-width: 1; stroke-dasharray: 4 3; }
          .scheduler-overlap-wait { fill: #ffffff; stroke: #6f4cc4; stroke-width: 1; stroke-dasharray: 4 3; }
          .scheduler-overlap-t { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .scheduler-overlap-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .scheduler-overlap-eos { fill: #8b6c00; font: 600 11px sans-serif; text-anchor: middle; }
          .scheduler-overlap-arr { stroke: #5f6b7a; stroke-width: 1.4; fill: none; }
          .scheduler-overlap-relay { stroke: #037f0c; stroke-width: 1.4; fill: none; }
          .scheduler-overlap-relay-t { fill: #037f0c; font: 11px sans-serif; text-anchor: middle; }
          .scheduler-overlap-div { stroke: #d1d5db; stroke-width: 1; stroke-dasharray: 5 4; }
        `}</style>
        <defs>
          <marker
            id="scheduler-overlap-ah"
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
            id="scheduler-overlap-ah-relay"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#037f0c" />
          </marker>
        </defs>

        <rect x={0} y={0} width={800} height={336} rx={8} fill="#ffffff" />

        {/* Panel A: the plain loop */}
        <text x={16} y={22} className="scheduler-overlap-h">
          Plain loop (--disable-overlap-schedule): the CPU and the GPU take turns
        </text>
        <text x={16} y={55} className="scheduler-overlap-lane">
          CPU
        </text>
        <text x={16} y={95} className="scheduler-overlap-lane">
          GPU
        </text>
        {renderLane(NORMAL_CPU, 36, 30, 'normal-cpu')}
        {renderLane(NORMAL_GPU, 76, 30, 'normal-gpu')}

        <line x1={16} y1={122} x2={784} y2={122} className="scheduler-overlap-div" />

        {/* Panel B: the overlap loop */}
        <text x={16} y={146} className="scheduler-overlap-h">
          Overlap loop (default): the CPU plans batch N+1 while the GPU runs batch N
        </text>
        <text x={16} y={186} className="scheduler-overlap-lane">
          CPU
        </text>
        <text x={16} y={258} className="scheduler-overlap-lane">
          GPU
        </text>
        {renderLane(OVERLAP_CPU, 160, 44, 'overlap-cpu')}
        {renderLane(OVERLAP_GPU, 232, 44, 'overlap-gpu')}

        {/* Launch arrows: each launched batch queues behind the one on the GPU */}
        <path
          d="M180,206 L348,229"
          className="scheduler-overlap-arr"
          markerEnd="url(#scheduler-overlap-ah)"
        />
        <path
          d="M530,206 L598,229"
          className="scheduler-overlap-arr"
          markerEnd="url(#scheduler-overlap-ah)"
        />

        {/* Token relay on the GPU */}
        <path
          d="M300,278 Q340,306 378,280"
          className="scheduler-overlap-relay"
          markerEnd="url(#scheduler-overlap-ah-relay)"
        />
        <path
          d="M550,278 Q590,306 628,280"
          className="scheduler-overlap-relay"
          markerEnd="url(#scheduler-overlap-ah-relay)"
        />
        <text x={340} y={324} className="scheduler-overlap-relay-t">
          N&apos;s sampled tokens become N+1&apos;s input on the GPU
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 2: the admission bet                                             */
/* ------------------------------------------------------------------------ */

// Code defaults at v0.5.22 (new_token_ratio_tracker.py L20-L37, environ.py L595-L599).
const RATIO_START = 0.7;
const RATIO_FLOOR = 0.098;
const DECAY_STEPS = 600;
const DECAY_PER_STEP = (RATIO_START - RATIO_FLOOR) / DECAY_STEPS;
// Schematic: where the retraction happens and the value it resets to.
const RETRACT_AT = 700;
const RESET_TO = 0.85;
const STEPS_SHOWN = 1000;

const PLOT_X0 = 90;
const PLOT_X1 = 760;
const PLOT_Y_ZERO = 394;
const PLOT_Y_ONE = 204;

function sx(step: number): number {
  return PLOT_X0 + (step / STEPS_SHOWN) * (PLOT_X1 - PLOT_X0);
}

function sy(ratio: number): number {
  return PLOT_Y_ZERO - ratio * (PLOT_Y_ZERO - PLOT_Y_ONE);
}

function AdmissionBetDiagram() {
  const blue = '#0972d3';
  const blueTint = '#dbe9f8';
  const amber = '#8b6c00';
  const amberFill = '#fbf3d5';
  const neutral = '#879596';
  const secondary = '#5f6b7a';
  const text = '#16191f';
  const divider = '#d1d5db';
  const font = 'sans-serif';

  const endRatio = RESET_TO - DECAY_PER_STEP * (STEPS_SHOWN - RETRACT_AT);
  const decayPath = `M${sx(0)},${sy(RATIO_START)} L${sx(DECAY_STEPS)},${sy(RATIO_FLOOR)} L${sx(RETRACT_AT)},${sy(RATIO_FLOOR)}`;
  const jumpPath = `M${sx(RETRACT_AT)},${sy(RATIO_FLOOR)} L${sx(RETRACT_AT)},${sy(RESET_TO) + 6}`;
  const afterPath = `M${sx(RETRACT_AT)},${sy(RESET_TO)} L${sx(STEPS_SHOWN)},${sy(endRatio)}`;

  const segments: { x: number; w: number; label: string; below: string[]; fill: string; stroke: string; textFill: string; dashed?: boolean }[] = [
    {
      x: 40,
      w: 250,
      label: 'held by running requests',
      below: ['KV already written'],
      fill: blue,
      stroke: '#065299',
      textFill: '#ffffff',
    },
    {
      x: 290,
      w: 190,
      label: 'running reserve',
      below: ['ratio x remaining output', '(remaining capped at 4096)'],
      fill: blueTint,
      stroke: blue,
      textFill: '#0f1b2a',
      dashed: true,
    },
    {
      x: 480,
      w: 160,
      label: 'new request',
      below: ['uncached prompt +', 'up to 4096 output'],
      fill: amberFill,
      stroke: amber,
      textFill: '#0f1b2a',
    },
    {
      x: 640,
      w: 120,
      label: 'spare',
      below: ['admit while spare', 'stays above 0'],
      fill: '#ffffff',
      stroke: neutral,
      textFill: '#0f1b2a',
    },
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 800 420"
        role="img"
        aria-labelledby="scheduler-bet-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="scheduler-bet-title">
          A new request is admitted only if its charge, the uncached prompt plus up to 4096 output
          tokens, fits in free KV plus evictable cache after the running requests have been charged
          new_token_ratio times their remaining output. The ratio starts at 0.7, falls by about
          0.001 on every decode step without a retraction until it reaches its floor of 0.098 after
          600 steps, and a retraction resets it to the completion rate the scheduler observes,
          capped at 1.0, before it decays again.
        </title>
        <rect x={0} y={0} width={800} height={420} rx={8} fill="#ffffff" />

        {/* Part 1: the admission test */}
        <text x={16} y={22} fontSize={12} fontWeight={600} fill={text} fontFamily={font}>
          Admission test: a new request&apos;s charge must fit in the room the running requests
          leave
        </text>
        <text x={525} y={44} fontSize={11} fill={secondary} fontFamily={font} textAnchor="middle">
          free KV plus evictable cache
        </text>
        <path d="M290,58 L290,52 L760,52 L760,58" fill="none" stroke={secondary} strokeWidth={1.2} />
        {segments.map((seg) => {
          const cx = seg.x + seg.w / 2;
          return (
            <g key={seg.label}>
              <rect
                x={seg.x}
                y={62}
                width={seg.w}
                height={34}
                fill={seg.fill}
                stroke={seg.stroke}
                strokeWidth={1.2}
                strokeDasharray={seg.dashed ? '4 3' : undefined}
              />
              <text
                x={cx}
                y={83}
                fontSize={12}
                fontWeight={600}
                fill={seg.textFill}
                fontFamily={font}
                textAnchor="middle"
              >
                {seg.label}
              </text>
              {seg.below.map((line, i) => (
                <text
                  key={line}
                  x={cx}
                  y={114 + i * 14}
                  fontSize={11}
                  fill={secondary}
                  fontFamily={font}
                  textAnchor="middle"
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}

        <line x1={16} y1={146} x2={784} y2={146} stroke={divider} strokeDasharray="5 4" />

        {/* Part 2: the ratio over time */}
        <text x={16} y={170} fontSize={12} fontWeight={600} fill={text} fontFamily={font}>
          The bet over time: new_token_ratio falls while decode runs clean, and jumps at a retraction
        </text>
        <text x={PLOT_X0} y={192} fontSize={11} fontWeight={600} fill={secondary} fontFamily={font}>
          new_token_ratio
        </text>

        {/* Axes */}
        <line x1={PLOT_X0} y1={PLOT_Y_ONE} x2={PLOT_X0} y2={PLOT_Y_ZERO} stroke={secondary} strokeWidth={1} />
        <line x1={PLOT_X0} y1={PLOT_Y_ZERO} x2={PLOT_X1} y2={PLOT_Y_ZERO} stroke={secondary} strokeWidth={1} />

        {/* Cap guide */}
        <line
          x1={PLOT_X0}
          y1={sy(1)}
          x2={PLOT_X1}
          y2={sy(1)}
          stroke={neutral}
          strokeWidth={1}
          strokeDasharray="4 3"
        />
        <text x={PLOT_X1} y={sy(1) + 14} fontSize={11} fill={secondary} fontFamily={font} textAnchor="end">
          cap after a retraction: 1.0
        </text>

        {/* Floor guide, to the right of where the line reaches it */}
        <line
          x1={sx(DECAY_STEPS)}
          y1={sy(RATIO_FLOOR)}
          x2={PLOT_X1}
          y2={sy(RATIO_FLOOR)}
          stroke={neutral}
          strokeWidth={1}
          strokeDasharray="4 3"
        />
        <text x={sx(RETRACT_AT) + 8} y={sy(RATIO_FLOOR) - 8} fontSize={11} fill={secondary} fontFamily={font}>
          floor 0.098, 14% of the start
        </text>

        {/* y-axis tick labels */}
        <text x={82} y={sy(1) + 4} fontSize={11} fill={secondary} fontFamily={font} textAnchor="end">
          1.0
        </text>
        <text x={82} y={sy(RATIO_START) + 4} fontSize={11} fill={secondary} fontFamily={font} textAnchor="end">
          0.7
        </text>
        <text x={82} y={sy(RATIO_FLOOR) + 4} fontSize={11} fill={secondary} fontFamily={font} textAnchor="end">
          0.098
        </text>

        {/* The ratio line */}
        <path d={decayPath} fill="none" stroke={blue} strokeWidth={2.2} />
        <path
          d={jumpPath}
          fill="none"
          stroke={amber}
          strokeWidth={1.6}
          strokeDasharray="4 3"
        />
        <path d={afterPath} fill="none" stroke={blue} strokeWidth={2.2} />
        <circle cx={sx(RETRACT_AT)} cy={sy(RESET_TO)} r={4} fill={amber} />

        {/* Line annotations */}
        <text x={100} y={sy(RATIO_START) - 11} fontSize={11} fill={text} fontFamily={font}>
          start: 0.7 x conservativeness
        </text>
        <text x={220} y={284} fontSize={11} fill={text} fontFamily={font}>
          about 0.001 lower per clean decode step
        </text>
        <text x={sx(RETRACT_AT) - 9} y={226} fontSize={11} fontWeight={600} fill={amber} fontFamily={font} textAnchor="end">
          a retraction resets it to the
        </text>
        <text x={sx(RETRACT_AT) - 9} y={241} fontSize={11} fontWeight={600} fill={amber} fontFamily={font} textAnchor="end">
          observed completion rate, up to 1.0
        </text>

        {/* x-axis ticks and labels */}
        <line x1={sx(DECAY_STEPS)} y1={PLOT_Y_ZERO} x2={sx(DECAY_STEPS)} y2={PLOT_Y_ZERO + 5} stroke={secondary} />
        <line x1={sx(RETRACT_AT)} y1={PLOT_Y_ZERO} x2={sx(RETRACT_AT)} y2={PLOT_Y_ZERO + 5} stroke={secondary} />
        <text x={PLOT_X0} y={410} fontSize={11} fill={secondary} fontFamily={font} textAnchor="middle">
          0
        </text>
        <text x={sx(DECAY_STEPS)} y={410} fontSize={11} fill={secondary} fontFamily={font} textAnchor="middle">
          600
        </text>
        <text x={sx(RETRACT_AT)} y={410} fontSize={11} fill={amber} fontFamily={font} textAnchor="middle">
          retraction
        </text>
        <text x={PLOT_X1} y={410} fontSize={11} fill={secondary} fontFamily={font} textAnchor="end">
          decode steps
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* The instruments table                                                    */
/* ------------------------------------------------------------------------ */

interface SignalRow {
  id: string;
  see: ReactNode;
  means: ReactNode;
  act: ReactNode;
  src: ReactNode;
}

const SIGNAL_ROWS: SignalRow[] = [
  {
    id: 'cautious',
    see: (
      <>
        <code>#queue-req</code> above 0 while <code>token usage</code> stays below 0.9, with{' '}
        <code>#running-req</code> below the <code>max_running_requests</code> the scheduler
        printed at startup
      </>
    ),
    means: (
      <>
        Admission is too cautious: the bet reserves output that never arrives, which happens when
        requests carry a large <code>max_new_tokens</code> and stop early on EOS or a stop string.
      </>
    ),
    act: (
      <>
        Lower <code>--schedule-conservativeness</code>; the tuning guide suggests a value like 0.3.
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangDocsSrcUrl(TUNING, 'L22-L27')}>
          SGLang docs: Hyperparameter Tuning L22-L27
        </Cite>
        ; the <code>#running-req</code> condition:{' '}
        <Cite tier={1} href={sglangUrl(SCHEDULER, 'L1229-L1241')} kind="code">
          scheduler.py L1229-L1241
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(KV_CONF, 'L704-L708')} kind="code">
          kv_cache_configurator.py L704-L708
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(SCHEDULER, 'L3907-L3925')} kind="code">
          scheduler.py L3907-L3925
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4098-L4103')} kind="code">
          scheduler.py L4098-L4103
        </Cite>
      </>
    ),
  },
  {
    id: 'bold',
    see: (
      <>
        Frequent <code>KV cache pool is full. Retract requests.</code> warnings with{' '}
        <code>token usage</code> high
      </>
    ),
    means: <>The bet is too bold: running requests generate more than they were charged for.</>,
    act: (
      <>
        Raise <code>--schedule-conservativeness</code>; the guide suggests a value like 1.3 and
        calls a retraction about once a minute acceptable.
      </>
    ),
    src: (
      <Cite tier={1} href={sglangDocsSrcUrl(TUNING, 'L29-L31')}>
        SGLang docs: Hyperparameter Tuning L29-L31
      </Cite>
    ),
  },
  {
    id: 'ratio',
    see: <code>sglang:new_token_ratio</code>,
    means: (
      <>
        The bet at the most recent prefill batch: the gauge is set only when a prefill batch is
        logged. It steps toward 0.098 while decode runs clean and jumps after a retraction.
      </>
    ),
    act: (
      <>
        Graph it beside the retraction rate; a jump with no retraction beside it is the return to
        the start value after the server went fully idle.
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(COLLECTOR, 'L696-L705')} kind="code">
          metrics_collector.py L696-L705
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(REPORTER, 'L720-L722')} kind="code">
          metrics_reporter.py L720-L722
        </Cite>
      </>
    ),
  },
  {
    id: 'retracted',
    see: (
      <>
        <code>rate(sglang:num_retracted_requests_total[5m])</code> and{' '}
        <code>sglang:num_retracted_output_tokens_total</code>
      </>
    ),
    means: <>How often the bet loses, and how many generated tokens had to be computed again.</>,
    act: <>Alert on the rate; a sustained rise points at the second row.</>,
    src: (
      <Cite tier={1} href={sglangUrl(COLLECTOR, 'L544-L565')} kind="code">
        metrics_collector.py L544-L565
      </Cite>
    ),
  },
  {
    id: 'hit',
    see: (
      <>
        <code>#cached-token</code> against <code>#new-token</code> on prefill lines
      </>
    ),
    means: (
      <>
        The live prefix-cache hit. The <code>sglang:cache_hit_rate</code> gauge holds only the most
        recent prefill batch&apos;s ratio, so it jumps around.
      </>
    ),
    act: (
      <>
        For a dashboard, use{' '}
        <code>
          sum(rate(sglang:cached_tokens_total[5m])) / sum(rate(sglang:prompt_tokens_total[5m]))
        </code>
        ; the two counters carry different labels, so sum each side before dividing.
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(REPORTER, 'L803-L842')} kind="code">
          metrics_reporter.py L803-L842
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(COLLECTOR, 'L2027-L2069')} kind="code">
          metrics_collector.py L2027-L2069
        </Cite>
      </>
    ),
  },
];

const LOG_LINES = `Prefill batch, #new-seq: N, #new-token: N, #cached-token: N, token usage: 0.xx, #running-req: N, #queue-req: N, #pending-token: N, cuda graph: bool, input throughput (token/s): x
Decode batch, #running-req: N, #token: N, token usage: 0.xx, cuda graph: bool, gen throughput (token/s): x, #queue-req: N
KV cache pool is full. Retract requests. #retracted_reqs: N, #new_tokens_gained: N, #new_token_ratio: 0.xxxx -> 0.xxxx`;

/* ------------------------------------------------------------------------ */
/* The section                                                              */
/* ------------------------------------------------------------------------ */

export function Scheduler() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Predict when a request waits, when it is retracted, and which log field tells you, from the two bets the scheduler makes on every step (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            4. The Scheduler: one step ahead, betting on early stops
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The scheduler is the loop inside each GPU process that decides, on every step, which
            requests run and whether the step is a prefill or a decode (section 3, The SGLang
            Runtime, shows one scheduler per GPU). Its challenge is to keep the GPU busy and the KV
            (key-value) cache full without knowing two things: what the step it just launched
            produced, and how long any answer will be.
          </Box>
          <Box variant="p">
            SGLang meets it with two bets. It plans batch N+1 before batch N&apos;s tokens are
            known, so the GPU runs forwards back to back. And it admits work on a forecast that
            answers stop early: a new request is charged its uncached prompt plus up to 4096 output
            tokens{' '}
            <Cite tier={1} href={sglangUrl(POLICY, 'L1336-L1360')}>
              schedule_policy.py L1336-L1360
            </Cite>
            , and a request already running is charged 70% of its remaining output at the start{' '}
            <Cite tier={1} href={sglangUrl(RATIO, 'L20-L37')}>
              new_token_ratio_tracker.py L20-L37
            </Cite>
            , a share that shrinks while decoding runs without trouble. When the forecast is wrong,
            the scheduler retracts requests and runs them again later. Both bets show in the
            server&apos;s log, which is where this section ends.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why the GPU runs forwards back to back by default, and the three places the one-step lead shows up in your traffic"
          >
            One batch ahead of the GPU
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Overlap scheduling is on by default, and <code>--disable-overlap-schedule</code> turns
            it off{' '}
            <Cite tier={1} href={sglangUrl(FIELDS, 'L187-L193')}>
              schedule.py L187-L193
            </Cite>
            . The plain loop does one thing at a time: build a batch, run it, wait for its tokens,
            process them, then build the next, so the GPU idles while Python works{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L1939-L1972')} kind="code">
              scheduler.py L1939-L1972
            </Cite>
            . The overlap loop builds batch N+1 while batch N is still on the GPU, launches it
            without waiting, and only then processes batch N&apos;s result: the finish checks
            (such as EOS, end of sequence), the cache updates and the hand-off to detokenization{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L1974-L2040')} kind="code">
              scheduler.py L1974-L2040
            </Cite>
            .
          </Box>
          <Box variant="p">
            Batch N+1 needs batch N&apos;s sampled tokens as its input, and when N+1 is built those
            tokens exist only on the GPU. So the scheduler leaves N+1&apos;s input empty, and the
            forward of N+1 gathers the tokens on the GPU from a buffer with one slot per request,
            which batch N&apos;s sampler filled{' '}
            <Cite tier={1} href={sglangUrl(OVERLAP, 'L87-L131')} kind="code">
              overlap_utils.py L87-L131
            </Cite>
            . The CPU never waits for token values to plan the next step. Section 27, Inside the
            Codebase, names that class and walks it in its Scheduler &amp; Batching tab. vLLM makes
            the same trade by default and calls it async scheduling ({VLLM_SCHEDULER_LINK}).
          </Box>

          <OverlapTimelineDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. Block lengths are schematic; no measurement of the gap sizes
            was located during this research.
          </Box>

          <Box variant="p">The one-step lead costs three things, and each one shows in traces:</Box>
          <ul>
            <li>
              <strong>One extra token after a stop.</strong> A request that samples EOS or a stop
              string in batch N is already in batch N+1, so it decodes once
              more; that token is discarded and its KV slot freed. Requests that reach{' '}
              <code>max_new_tokens</code> are predicted and left out of N+1 in advance{' '}
              <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4320-L4345')} kind="code">
                scheduler.py L4320-L4345
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(RESULTS, 'L1012-L1017')} kind="code">
                batch_result_processor.py L1012-L1017
              </Cite>
              .
            </li>
            <li>
              <strong>A later first token on prefill bursts.</strong> Two back-to-back prefill
              batches overlap as well, which delays the first one&apos;s result, and its first
              token, by one forward. <code>SGLANG_DISABLE_CONSECUTIVE_PREFILL_OVERLAP=1</code>{' '}
              processes the previous prefill before launching the next, trading some throughput for
              TTFT (time to first token){' '}
              <Cite tier={1} href={sglangUrl(SCHEDULER, 'L2042-L2075')} kind="code">
                scheduler.py L2042-L2075
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(ENVIRON, 'L642')} kind="code">
                environ.py L642
              </Cite>
              .
            </li>
            <li>
              <strong>Sampling that waits on grammars.</strong> With structured output in the batch
              (section 10, Structured Output), the forward of N+1 still overlaps, but its sampling
              waits until the CPU has advanced each grammar with batch N&apos;s tokens, because the
              vocabulary mask depends on them{' '}
              <Cite tier={1} href={sglangUrl(TP_WORKER, 'L667-L689')} kind="code">
                tp_worker.py L667-L689
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4883-L4917')} kind="code">
                scheduler.py L4883-L4917
              </Cite>
              .
            </li>
          </ul>
          <Box variant="p">
            Pipeline parallelism turns overlap off, and the server logs a warning that the two are
            incompatible{' '}
            <Cite tier={1} href={sglangUrl(OVERRIDES, 'L1575-L1580')} kind="code">
              overrides.py L1575-L1580
            </Cite>
            . A pipeline-parallel deployment therefore runs the plain loop, with the GPU gaps of the
            top lane.
          </Box>

          <ExpandableSection headerText="Other cases where overlap is switched off for you">
            <SpaceBetween size="s">
              <Box variant="p">
                Startup hooks also switch overlap off for diffusion language models{' '}
                <Cite tier={1} href={sglangUrl(OVERRIDES, 'L1664-L1674')} kind="code">
                  overrides.py L1664-L1674
                </Cite>
                , for embedding models that use the sparse head (
                <code>SGLANG_EMBEDDINGS_SPARSE_HEAD</code>){' '}
                <Cite tier={1} href={sglangUrl(OVERRIDES, 'L891-L900')} kind="code">
                  overrides.py L891-L900
                </Cite>
                , for speculative decoding on CPU{' '}
                <Cite tier={1} href={sglangUrl(SPEC_HOOK, 'L65-L77')} kind="code">
                  speculative_hook.py L65-L77
                </Cite>
                , and for hybrid Mamba models whose radix cache resolves to the{' '}
                <code>no_buffer</code> strategy{' '}
                <Cite tier={1} href={sglangUrl(OVERRIDES, 'L452-L463')} kind="code">
                  overrides.py L452-L463
                </Cite>
                . PD-multiplexing (prefill/decode multiplexing) refuses to start unless you pass{' '}
                <code>--disable-overlap-schedule</code> yourself{' '}
                <Cite tier={1} href={sglangUrl(VALIDATION, 'L247-L260')} kind="code">
                  validation_hook.py L247-L260
                </Cite>
                .
              </Box>
              <Box variant="p">
                The GPU-side token buffer stays in use with overlap off. Decode inputs come from it
                in both loops, and the two loops differ only in when results are processed{' '}
                <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4734-L4750')} kind="code">
                  scheduler.py L4734-L4750
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
            description="Predict how many requests a prefill step admits, and why a server can queue work while its KV pool is partly empty"
          >
            Admission: a bet that answers stop early
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Admission happens when the scheduler builds a prefill batch. It walks the sorted
            waiting queue and admits requests while three budgets last: new prompt tokens this step
            (<code>--max-prefill-tokens</code>, default 16384{' '}
            <Cite tier={1} href={sglangUrl(FIELDS, 'L67-L77')}>
              schedule.py L67-L77
            </Cite>
            ), the chunk size (<code>--chunked-prefill-size</code>) and KV memory{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4034-L4052')} kind="code">
              scheduler.py L4034-L4052
            </Cite>
            .
          </Box>
          <Box variant="p">
            KV memory is where the bet lives. A candidate is charged its uncached prompt plus{' '}
            <code>min(max_new_tokens, 4096)</code> output tokens{' '}
            <Cite tier={1} href={sglangUrl(POLICY, 'L1336-L1360')} kind="code">
              schedule_policy.py L1336-L1360
            </Cite>
            . Each running request is charged its remaining output, also capped at 4096, times{' '}
            <code>new_token_ratio</code>{' '}
            <Cite tier={1} href={sglangUrl(POLICY, 'L754-L763')} kind="code">
              schedule_policy.py L754-L763
            </Cite>
            . The candidate is admitted only if its charge fits in free KV plus evictable cache,
            minus what the running requests are charged{' '}
            <Cite tier={1} href={sglangUrl(BUDGET, 'L91-L128')} kind="code">
              prefill_budget.py L91-L128
            </Cite>
            . The 4096 cap applies to the charge alone; a request still generates up to its own{' '}
            <code>max_new_tokens</code>{' '}
            <Cite tier={1} href={sglangUrl(POLICY, 'L83-L87')} kind="code">
              schedule_policy.py L83-L87
            </Cite>
            .
          </Box>
          <Box variant="p">
            <code>new_token_ratio</code> is the bet itself. It starts at 0.7 times{' '}
            <code>--schedule-conservativeness</code> (default 1.0), so a running request is first
            charged 70% of its remaining output. Each decode step without a retraction lowers it by
            about 0.001, and it stops at 14% of its start value, 0.098, which it reaches after 600
            steps{' '}
            <Cite tier={1} href={sglangUrl(RATIO, 'L20-L37')}>
              new_token_ratio_tracker.py L20-L37
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(FIELDS, 'L135-L138')}>
              schedule.py L135-L138
            </Cite>
            . When the scheduler goes fully idle, the ratio returns to its start value{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L5072-L5149')} kind="code">
              scheduler.py L5072-L5149
            </Cite>
            . So a server that has run clean for a while charges its running requests less, and
            admits more. The same charge is one reason a server queues requests while its KV pool
            is partly empty: part of the free room is reserved for output the running requests
            have not generated yet. The first row of the table in Reading the scheduler is that
            signal, and its third row is the gauge that reports the ratio.
          </Box>

          <AdmissionBetDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. The decay line uses the v0.5.22 code defaults at{' '}
            <code>--schedule-conservativeness 1.0</code>; the step at which the retraction happens
            and the value it resets to are schematic, and the bar widths are not to scale.
          </Box>

          <Box variant="p">
            A request sent with <code>ignore_eos</code> cannot stop early, so while it runs it is
            charged its remaining output, still capped at 4096, at a ratio of 1.0{' '}
            <Cite tier={1} href={sglangUrl(POLICY, 'L754-L763')} kind="code">
              schedule_policy.py L754-L763
            </Cite>
            . Our reading of the code: a load test that sets <code>ignore_eos</code> on every
            request exercises admission without the bet.
          </Box>

          <ExpandableSection headerText="The bet's constants, and the arithmetic of the knob">
            <SpaceBetween size="s">
              <Box variant="p">
                Each constant is an environment variable{' '}
                <Cite tier={1} href={sglangUrl(ENVIRON, 'L595-L599')} kind="code">
                  environ.py L595-L599
                </Cite>
                : <code>SGLANG_INIT_NEW_TOKEN_RATIO</code> (0.7),{' '}
                <code>SGLANG_MIN_NEW_TOKEN_RATIO_FACTOR</code> (0.14, the floor as a share of the
                start), <code>SGLANG_NEW_TOKEN_RATIO_DECAY_STEPS</code> (600),{' '}
                <code>SGLANG_RETRACT_DECODE_STEPS</code> (20, the per-request headroom in the reset
                formula) and <code>SGLANG_CLIP_MAX_NEW_TOKENS_ESTIMATION</code> (4096, the output
                cap in every charge).
              </Box>
              <Box variant="p">
                The start value is <code>min(0.7 x conservativeness, 1.0)</code>, the floor is 0.14
                times the start, and each clean decode step subtracts the difference divided by 600{' '}
                <Cite tier={1} href={sglangUrl(RATIO, 'L20-L37')}>
                  new_token_ratio_tracker.py L20-L37
                </Cite>
                . By our arithmetic on that formula, <code>--schedule-conservativeness 1.3</code>{' '}
                starts the bet at 0.91 and 0.3 starts it at 0.21; above about 1.43 the start is
                capped at 1.0, which charges running requests their whole remaining output up to
                the 4096 cap. The
                knob scales only what running requests are charged: a new request is charged up to
                4096 output tokens at any setting{' '}
                <Cite tier={1} href={sglangUrl(POLICY, 'L1336-L1360')} kind="code">
                  schedule_policy.py L1336-L1360
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
            description="Which requests are pushed back when KV runs out, what they lose, and how the scheduler moves its bet afterwards"
          >
            When the bet loses: retraction
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Retraction is SGLang&apos;s name for preemption. When the next decode step does not fit
            in the KV pool, the scheduler retracts running requests until it does, always keeping
            at least one{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4335-L4416')} kind="code">
              scheduler.py L4335-L4416
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(BATCH, 'L3298-L3311')} kind="code">
              schedule_batch.py L3298-L3311
            </Cite>
            . Under the default <code>--retraction-policy length</code>, the requests with the
            fewest generated tokens go first, and among equals the one with the longest prompt;{' '}
            <code>priority</code> retracts the lowest priority first{' '}
            <Cite tier={1} href={sglangUrl(FIELDS, 'L122-L134')}>
              schedule.py L122-L134
            </Cite>
            . Beam-search groups cannot be retracted, so they are aborted, and if even the last
            request cannot fit, it is aborted with an out-of-memory error{' '}
            <Cite tier={1} href={sglangUrl(BATCH, 'L3298-L3427')} kind="code">
              schedule_batch.py L3298-L3427
            </Cite>
            .
          </Box>
          <Box variant="p">
            A retracted request frees the KV it owns, while the shared prefix already in the radix
            tree stays. It returns to the waiting queue with its generated tokens and, when
            readmitted, is prefilled again over prompt plus output{' '}
            <Cite tier={1} href={sglangUrl(BATCH, 'L2242-L2277')} kind="code">
              schedule_batch.py L2242-L2277
            </Cite>
            . That recompute is the price, and both engines pay it ({VLLM_SCHEDULER_LINK});{' '}
            <code>sglang:num_retracted_output_tokens_total</code> counts the generated tokens that
            retracted requests take back to the queue{' '}
            <Cite tier={1} href={sglangUrl(COLLECTOR, 'L544-L565')} kind="code">
              metrics_collector.py L544-L565
            </Cite>
            . On a PD (prefill/decode) decode server the KV is copied to host memory first, so the
            request resumes without recompute (section 15, PD Disaggregation).
          </Box>
          <Box variant="p">
            Then the scheduler moves the bet. It sets <code>new_token_ratio</code> to the
            completion rate it observes in the requests that stayed,{' '}
            <code>(tokens decoded so far + 20 x running requests) / total max_new_tokens</code>,
            capped at 1.0, and decays it again from there{' '}
            <Cite tier={1} href={sglangUrl(RATIO, 'L40-L49')} kind="code">
              new_token_ratio_tracker.py L40-L49
            </Cite>
            . The warning the scheduler logs prints the old and new ratio{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4389-L4413')} kind="code">
              scheduler.py L4389-L4413
            </Cite>
            , so one line tells you that the bet lost and how far it moved.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why decoding pauses while a long prompt is prefilled, and the flag that puts both in one forward"
          >
            Prefill first, then decode
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each step the scheduler first tries to build a prefill batch from the waiting queue,
            and runs a decode step for the running batch only when no prefill can be admitted. A
            finished prefill batch joins the running batch for the next decode{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L3766-L3870')} kind="code">
              scheduler.py L3766-L3870
            </Cite>
            . By default, then, a prefill step and a decode step never share a forward, and the
            requests already generating wait while a prefill step runs.
          </Box>
          <Box variant="p">
            Long prompts are chunked. A prompt longer than the remaining chunk budget is split, and
            the scheduler keeps one chunked request in progress: each prefill step continues it
            first, then fills any leftover budget with new requests{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4053-L4060')} kind="code">
              scheduler.py L4053-L4060
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(POLICY, 'L1092-L1175')} kind="code">
              schedule_policy.py L1092-L1175
            </Cite>
            . The chunk size follows GPU memory, 8192 tokens on an 80 GB H100 or A100{' '}
            <Cite tier={1} href={sglangUrl(MEMORY_HOOK, 'L132-L140')} kind="code">
              memory_hook.py L132-L140
            </Cite>
            , and section 6, KV Memory and the Defaults Your GPU Picks, has the full table. A long
            prompt pauses decoding once for each of its chunks, and each of those prefill steps
            prints its own <code>Prefill batch</code> line in the log{' '}
            <Cite tier={1} href={sglangUrl(RESULTS, 'L509-L515')} kind="code">
              batch_result_processor.py L509-L515
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(REPORTER, 'L730-L782')} kind="code">
              metrics_reporter.py L730-L782
            </Cite>
            .
          </Box>
          <Box variant="p">
            <code>--enable-mixed-chunk</code> (default off) adds one decode token for every running
            request to each prefill step, so decoding keeps moving behind a long prompt{' '}
            <Cite tier={1} href={sglangUrl(FIELDS, 'L202-L205')}>
              schedule.py L202-L205
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4250-L4290')} kind="code">
              scheduler.py L4250-L4290
            </Cite>
            . The decode tokens come out of the prefill and chunk budgets, so each such step carries
            that many fewer prompt tokens{' '}
            <Cite tier={1} href={sglangUrl(POLICY, 'L581-L630')} kind="code">
              schedule_policy.py L581-L630
            </Cite>
            . It is skipped for batches that return logprobs, and the NGRAM speculative-decoding
            mode forces it off{' '}
            <Cite tier={1} href={sglangUrl(SPEC_HOOK, 'L1214-L1218')} kind="code">
              speculative_hook.py L1214-L1218
            </Cite>
            .
          </Box>
          <Box variant="p">
            Which waiting requests the prefill step looks at first is the queue policy.{' '}
            <code>fcfs</code> (first-come-first-served) is the default{' '}
            <Cite tier={1} href={sglangUrl(FIELDS, 'L82-L98')}>
              schedule.py L82-L98
            </Cite>
            ; the policies that order the queue by what the radix tree holds, such as{' '}
            <code>lpm</code> (longest prefix match), are opt-in, and section 5, RadixAttention and
            the Radix Cache, covers them.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which log field or metric shows a request waiting, the bet losing or a prefix hitting, and the knob each one moves"
          >
            Reading the scheduler
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Turn on <code>--enable-metrics</code> before the first load test: Prometheus metrics
            are off by default, and with the flag the server serves <code>/metrics</code> on the
            same HTTP port as its API{' '}
            <Cite tier={1} href={sglangUrl(OBS_FIELDS, 'L70')}>
              observability.py L70
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HTTP_SERVER, 'L301-L304')} kind="code">
              http_server.py L301-L304
            </Cite>
            . Log lines and scheduler metrics come from the first rank of each attention TP
            (tensor parallelism) group only, so a server running DP (data parallelism) attention
            gives one stream per DP group, and <code>--enable-metrics-for-all-schedulers</code>{' '}
            makes every rank export its own series{' '}
            <Cite tier={1} href={sglangUrl(COLLECTOR, 'L1325-L1335')} kind="code">
              metrics_collector.py L1325-L1335
            </Cite>
            .
          </Box>
          <Box variant="p">
            Three log lines carry the scheduler&apos;s state: a prefill line for every prefill batch{' '}
            <Cite tier={1} href={sglangUrl(REPORTER, 'L730-L760')} kind="code">
              metrics_reporter.py L730-L760
            </Cite>
            , a decode line every 40 decode steps (<code>--decode-log-interval</code>){' '}
            <Cite tier={1} href={sglangUrl(REPORTER, 'L905-L1020')} kind="code">
              metrics_reporter.py L905-L1020
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(OBS_FIELDS, 'L136-L139')}>
              observability.py L136-L139
            </Cite>
            , and the retraction warning{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4398-L4413')} kind="code">
              scheduler.py L4398-L4413
            </Cite>
            . Their formats, with values replaced by placeholders:
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{LOG_LINES}</pre>

          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={SIGNAL_ROWS}
            columnDefinitions={[
              { id: 'see', header: 'What you see', cell: (r) => r.see, minWidth: 180 },
              { id: 'means', header: 'What it means', cell: (r) => r.means, minWidth: 220 },
              { id: 'act', header: 'What to do', cell: (r) => r.act, minWidth: 200 },
              { id: 'src', header: 'Source', cell: (r) => r.src, minWidth: 170 },
            ]}
          />
          <Box variant="small" color="text-body-secondary">
            The thresholds in the first two rows are the SGLang tuning guide&apos;s advice, not
            measured during this research.
          </Box>

          <Box variant="p">
            <strong>Where to start.</strong> Launch with <code>--enable-metrics</code>, read{' '}
            <code>#queue-req</code>, <code>token usage</code> and the retraction warning together,
            and move <code>--schedule-conservativeness</code> the way they point. Read them knowing
            what the scheduler charges: up to 4096 output tokens for every new request, and 70% of
            the remaining output for every running one at the start. Our reading of the code: a
            client that sends a <code>max_new_tokens</code> close to the answers it expects, below
            4096, lowers that charge directly, with no change on the server.
          </Box>
          <Box variant="p">
            <strong>Against vLLM:</strong> SGLang&apos;s default pauses decode for a prefill step,
            where vLLM shares one token budget per step between decodes and prefill chunks, so ITL
            (inter-token latency) spikes look different, and <code>--enable-mixed-chunk</code> is
            the closer match. SGLang retracts the requests with the fewest generated tokens and so
            protects long generations, where vLLM, under its default FCFS policy, preempts the most
            recently added request and protects early arrivals. Watch{' '}
            <code>sglang:num_retracted_requests_total</code> where you watched{' '}
            <code>vllm:num_preemptions</code> ({VLLM_SCHEDULER_LINK}).
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
