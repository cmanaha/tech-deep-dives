import { useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import {
  Cite,
  arxiv,
  gh,
  DCGM_EXPORTER_TAG,
  DCGM_TAG,
  MEGATRON_TAG,
  METASEQ_SHA,
  PYTORCH_TAG,
  TORCHTITAN_TAG,
} from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import { DEFAULT_MFU, DENSE_MODELS, INSTANCES, shapeOf, type DenseModelId } from '../lib/presets';
import { denseRuntimeInputs, estimateRun, flopsPerToken, mfuFromThroughput, type AttentionMode } from '../lib/runtime';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** TorchTitan v0.4.0: what its trainer logs and how it computes throughput and MFU. */
function tt(path: string, lines: string): string {
  return gh('pytorch/torchtitan', TORCHTITAN_TAG, path, lines);
}
const TT_PERF = tt('torchtitan/observability/metrics.py', 'L115-L135');
const TT_LOG = tt('torchtitan/observability/metrics.py', 'L509-L575');
const TT_LOG_DOC = tt('torchtitan/observability/metrics.py', 'L526');
const TT_DATA_PCT = tt('torchtitan/observability/metrics.py', 'L547-L549');
const TT_MEM = tt('torchtitan/observability/metrics.py', 'L72-L95');
const TT_CLIP = tt('torchtitan/distributed/utils.py', 'L534-L631');
const TT_FINITE = tt('torchtitan/components/optim/optim.py', 'L163-L192');
const TT_PEAKS = tt('torchtitan/tools/utils.py', 'L109-L144');
const TT_NON_DP = tt('torchtitan/distributed/parallelism_context.py', 'L653-L655');

/** Megatron Core core_v0.20.0: NaN checks, the rerun state machine and per-GPU straggler logging. */
function mg(path: string, lines: string): string {
  return gh('NVIDIA/Megatron-LM', MEGATRON_TAG, path, lines);
}
const MG_CHECKS = mg('megatron/training/config/resilience_config.py', 'L20-L29');
const MG_STRAGGLER = mg('megatron/training/config/resilience_config.py', 'L32-L46');
const MG_ARGS = mg('megatron/training/arguments.py', 'L2818-L2823');
const MG_RERUN_NOTE = mg('megatron/core/rerun_state_machine.py', 'L21-L30');
const MG_RERUN_CODES = mg('megatron/core/rerun_state_machine.py', 'L36-L40');
const MG_RERUN_DIAG = mg('megatron/core/rerun_state_machine.py', 'L60-L66');

/** PyTorch v2.15.0: the caching allocator's statistics and the memory snapshot guide. */
const PT_STATS = gh('pytorch/pytorch', PYTORCH_TAG, 'torch/cuda/memory.py', 'L243-L318');
const PT_DEFS = gh('pytorch/pytorch', PYTORCH_TAG, 'torch/cuda/memory.py', 'L526-L606');
const PT_SNAPSHOT = gh('pytorch/pytorch', PYTORCH_TAG, 'docs/source/torch_cuda_memory.md', 'L1-L39');
const PT_SNAPSHOT_NCCL = gh('pytorch/pytorch', PYTORCH_TAG, 'docs/source/torch_cuda_memory.md', 'L16-L19');
const PT_SNAPSHOT_RAW = gh('pytorch/pytorch', PYTORCH_TAG, 'docs/source/torch_cuda_memory.md', 'L97-L109');

/** DCGM v4.7.0 field definitions (the public API header). */
function dcgm(lines: string): string {
  return gh('NVIDIA/DCGM', DCGM_TAG, 'dcgmlib/dcgm_fields.h', lines);
}

/** dcgm-exporter 4.8.4's default counter set (commented lines are off). */
const EXPORTER_DEFAULTS = gh('NVIDIA/dcgm-exporter', DCGM_EXPORTER_TAG, 'etc/default-counters.csv', 'L28-L107');
/** The same file's NVLink error counters, grouped by GPU generation. */
const EXPORTER_NVLINK = gh('NVIDIA/dcgm-exporter', DCGM_EXPORTER_TAG, 'etc/default-counters.csv', 'L66-L75');

/** First-party documentation pages (unversioned; read 2026-10-31). */
const DCGM_GUIDE = 'https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/feature-overview.html';
const XID_CATALOG = 'https://docs.nvidia.com/deploy/xid-errors/analyzing-xid-catalog.html';
const EKS_OBS = 'https://docs.aws.amazon.com/eks/latest/best-practices/aiml-observability.html';

/** Papers and team notes. */
const OLMO2 = arxiv('2501.00656v3');
const OLMO2_VENUE = 'preprint; shorter version at COLM 2025';
const OPT = arxiv('2205.01068v4');
const OPT_NOTES = gh('facebookresearch/metaseq', METASEQ_SHA, 'projects/OPT/chronicles/56_percent_update.md', 'L43');
const PALM = arxiv('2204.02311v5');
const LLAMA3 = arxiv('2407.21783v3');
const DEEPSEEK = arxiv('2412.19437v2');
const MEGASCALE = arxiv('2402.15627v1');

/* ------------------------------------------------------------------------ */
/* Numbers: tokens per second at the default MFU, from Calculator A         */
/* ------------------------------------------------------------------------ */

/** Dense BF16 peak of one H100 in a p5.48xlarge, TFLOPS (half the sparse figure NVIDIA lists). */
const H100_PEAK = INSTANCES['p5.48xlarge'].denseBf16TflopsPerAccelerator.value;
/** The dive's default MFU, an assumption inside Llama 3 405B's measured 38% to 43%. */
const MFU = DEFAULT_MFU.value;
/** A throughput a reader might see in the log for Llama 3.1 8B on one H100. */
const LOGGED_TPS = 4_000;
const LONG_SEQ = 8_192;
const SHORT_SEQ = 2_048;

/** sixN: 6N with every parameter and no attention term; torchtitan: TorchTitan v0.4.0's count. */
type FlopCount = 'sixN' | 'torchtitan';

interface Reference {
  flopsPerToken: number;
  tokensPerSecond: number;
  mfuAtLogged: number;
}

function reference(id: DenseModelId, count: FlopCount, sequenceLength: number): Reference {
  const inputs = denseRuntimeInputs(shapeOf(DENSE_MODELS[id]), count === 'sixN' ? 'full' : 'nonEmbedding');
  const attention: AttentionMode = count === 'sixN' ? 'none' : 'noDiscount';
  const perToken = flopsPerToken({ ...inputs, sequenceLength, attention });
  const run = estimateRun({
    ...inputs,
    tokens: 1e12,
    sequenceLength,
    attention,
    peakTflopsPerAccelerator: H100_PEAK,
    accelerators: 1,
    mfu: MFU,
  });
  const mfuAtLogged = mfuFromThroughput({
    tokensPerSecondPerAccelerator: LOGGED_TPS,
    flopsPerToken: perToken.total,
    peakTflopsPerAccelerator: H100_PEAK,
  });
  return { flopsPerToken: perToken.total, tokensPerSecond: run.tokensPerSecondPerAccelerator, mfuAtLogged };
}

const R8 = reference('llama-3.1-8b', 'sixN', LONG_SEQ);
const R70 = reference('llama-3.1-70b', 'sixN', LONG_SEQ);
const T8 = reference('llama-3.1-8b', 'torchtitan', LONG_SEQ);
const T70 = reference('llama-3.1-70b', 'torchtitan', LONG_SEQ);
const T8_SHORT = reference('llama-3.1-8b', 'torchtitan', SHORT_SEQ);

const num = (x: number) => x.toLocaleString('en-US');
/** "About" figures: nearest 100 above 2,000 tokens per second, nearest 5 below. */
const about = (x: number) => num(x >= 2_000 ? Math.round(x / 100) * 100 : Math.round(x / 5) * 5);
const pct1 = (x: number) => `${(x * 100).toFixed(1)}%`;
const pct0 = (x: number) => `${Math.round(x * 100)}%`;
const sci = (x: number) => x.toExponential(2).replace('e+', 'e');

const R8_TPS = about(R8.tokensPerSecond);
const R8_AT_LOGGED = pct1(R8.mfuAtLogged);
const MFU_PCT = pct0(MFU);

/* ------------------------------------------------------------------------ */
/* Diagram: three layers of signal, and the symptoms each explains          */
/* ------------------------------------------------------------------------ */

const STACK_NARROW_PX = 720;

interface Symptom {
  text: string;
  note: string;
  /** Seen in another layer's numbers, explained by this one. */
  crossLayer?: boolean;
}

interface Layer {
  name: string;
  stroke: string;
  fill: string;
  signals: [string, string];
  tools: string;
  symptoms: Symptom[];
}

const LAYERS: Layer[] = [
  {
    name: 'Model health',
    stroke: '#6f4cc4',
    fill: '#efe7fb',
    signals: ['loss (average and maximum across ranks),', 'gradient norm, NaN or Inf in either'],
    tools: 'from the training loop and its checks',
    symptoms: [
      { text: 'Loss spike, throughput steady', note: 'roll back, skip batches' },
      { text: 'Gradient norm drifting up', note: 'it leads the loss' },
      { text: 'NaN or Inf in the loss', note: 'stop before the update' },
    ],
  },
  {
    name: 'Job efficiency',
    stroke: '#0972d3',
    fill: '#f2f8fd',
    signals: ['tokens per second per accelerator, MFU,', 'step-time shares, per-rank compute, memory'],
    tools: 'from the training log, per-rank traces, DCGM',
    symptoms: [
      { text: 'Throughput down, loss healthy', note: 'look down the stack' },
      { text: 'Data loading over 20% of step', note: 'fix the input pipeline' },
      { text: "One rank's compute is slowest", note: 'straggler, section 19' },
      { text: 'SM activity below 0.5', note: 'likely ineffective use' },
    ],
  },
  {
    name: 'Hardware health',
    stroke: '#1f7a70',
    fill: '#e6f4f2',
    signals: ['Xid errors, ECC and row remapping,', 'clock throttling, NVLink and EFA counters'],
    tools: 'from DCGM, the driver, the EFA device',
    symptoms: [
      { text: 'Throttled clocks, no error', note: 'it shows as a slow rank' },
      { text: 'Xid 48, 74 or 79 on a node', note: 'out until reset or reboot' },
      { text: 'Spike or NaN, no model cause', note: 'silent fault: rerun it', crossLayer: true },
    ],
  },
];

function SignalStackDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, STACK_NARROW_PX);

  const ink = '#16191f';
  const muted = '#414d5c';
  const font = 'sans-serif';

  const W = narrow ? 400 : 900;
  const bandX = narrow ? 8 : 16;
  const bandW = W - 2 * bandX;
  const top = narrow ? 50 : 56;
  const gap = narrow ? 10 : 12;

  // Wide: signals on the left, symptoms in two columns on the right.
  const wideBandH = 116;
  const chipW = 220;
  const chipH = 42;
  const chipCols = [416, 652];
  // Narrow: signals on top, one symptom per row below.
  const narrowHead = 92;
  const narrowChipH = 28;
  const narrowChipGap = 6;
  const bandH = (layer: Layer) =>
    narrow ? narrowHead + layer.symptoms.length * (narrowChipH + narrowChipGap) - narrowChipGap + 12 : wideBandH;

  const bandTops: number[] = [];
  let y = top;
  for (const layer of LAYERS) {
    bandTops.push(y);
    y += bandH(layer) + gap;
  }
  const rulesTop = y + 2;
  const rulesH = narrow ? 86 : 60;
  const H = rulesTop + rulesH + 12;

  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="measure-stack-title"
        aria-describedby="measure-stack-desc"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <title id="measure-stack-title">
          A training run reports on three layers of signal, and a symptom seen in one layer is often
          explained by another: throughput falling while the loss stays healthy sends you down the
          stack to the job and the hardware, and a loss spike under steady throughput sends you to
          the model and the data first, then to a silent hardware fault.
        </title>
        <desc id="measure-stack-desc">
          Model health is the loss, averaged and maximised across ranks, the gradient norm, and any NaN
          or Inf in either, all from the training loop; it explains a loss spike with steady
          throughput, a drifting gradient norm, and a NaN or Inf. Job efficiency is tokens per second
          per accelerator, MFU, the shares of step time, per-rank compute time and memory, from the
          training log, per-rank traces and DCGM; it explains throughput falling under a healthy loss,
          data loading above 20% of the step, one rank with the slowest compute, and SM activity below
          0.5. Hardware health is Xid errors, ECC errors and row remapping, clock throttling, and NVLink
          and EFA counters, from DCGM, the driver and the EFA device; it explains throttled clocks that
          raise no error and show as a slow rank, an Xid 48, 74 or 79 that takes a node out until it is
          reset, and a spike or NaN with no model cause, a silent fault found by re-running the step.
        </desc>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />

        <text x={bandX + (narrow ? 4 : 8)} y={22} fontFamily={font} fontSize={13} fontWeight={600} fill={ink}>
          {narrow ? 'Three layers of signal' : 'Three layers of signal, and the symptoms each layer explains'}
        </text>
        <text x={bandX + (narrow ? 4 : 8)} y={38} fontFamily={font} fontSize={11} fill={muted}>
          {narrow
            ? 'and the symptoms each layer explains'
            : 'Each band: what the layer measures and where its numbers come from, then the symptoms that send you to it'}
        </text>

        {LAYERS.map((layer, li) => {
          const by = bandTops[li];
          const h = bandH(layer);
          const textX = bandX + (narrow ? 12 : 16);
          return (
            <g key={layer.name}>
              <rect x={bandX} y={by} width={bandW} height={h} rx={8} fill={layer.fill} stroke={layer.stroke} strokeWidth={1.5} />
              <text x={textX} y={by + (narrow ? 24 : 28)} fontFamily={font} fontSize={14} fontWeight={600} fill={ink}>
                {layer.name}
              </text>
              {layer.signals.map((line, i) => (
                <text
                  key={line}
                  x={textX}
                  y={by + (narrow ? 44 : 50) + i * 16}
                  fontFamily={font}
                  fontSize={11}
                  fill={ink}
                >
                  {line}
                </text>
              ))}
              <text x={textX} y={by + (narrow ? 80 : 92)} fontFamily={font} fontSize={11} fill={muted}>
                {layer.tools}
              </text>
              {!narrow && (
                <line x1={400} y1={by + 12} x2={400} y2={by + h - 12} stroke={layer.stroke} strokeWidth={1} strokeDasharray="4 4" />
              )}
              {layer.symptoms.map((s, si) => {
                const dash = s.crossLayer ? '5 4' : undefined;
                if (narrow) {
                  const cx = bandX + 10;
                  const cw = bandW - 20;
                  const cy = by + narrowHead + si * (narrowChipH + narrowChipGap);
                  return (
                    <g key={s.text}>
                      <rect x={cx} y={cy} width={cw} height={narrowChipH} rx={4} fill="#ffffff" stroke={layer.stroke} strokeWidth={1} strokeDasharray={dash} />
                      <text x={cx + 8} y={cy + 18} fontFamily={font} fontSize={11} fontWeight={600} fill={ink}>
                        {s.text}
                      </text>
                      <text x={cx + cw - 8} y={cy + 18} fontFamily={font} fontSize={10} fill={muted} textAnchor="end">
                        {s.note}
                      </text>
                    </g>
                  );
                }
                const rowsTop = by + (wideBandH - (2 * chipH + 10)) / 2;
                const cx = chipCols[si % 2];
                const cy = rowsTop + Math.floor(si / 2) * (chipH + 10);
                return (
                  <g key={s.text}>
                    <rect x={cx} y={cy} width={chipW} height={chipH} rx={4} fill="#ffffff" stroke={layer.stroke} strokeWidth={1} strokeDasharray={dash} />
                    <text x={cx + 10} y={cy + 17} fontFamily={font} fontSize={11} fontWeight={600} fill={ink}>
                      {s.text}
                    </text>
                    <text x={cx + 10} y={cy + 33} fontFamily={font} fontSize={11} fill={muted}>
                      {s.note}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        <rect x={bandX} y={rulesTop} width={bandW} height={rulesH} rx={8} fill="#ffffff" stroke="#879596" strokeWidth={1} strokeDasharray="5 4" />
        {narrow ? (
          <>
            <text x={bandX + 12} y={rulesTop + 20} fontFamily={font} fontSize={11} fontWeight={600} fill={ink}>
              Throughput down, loss healthy:
            </text>
            <text x={bandX + 12} y={rulesTop + 36} fontFamily={font} fontSize={11} fill={ink}>
              look down the stack, at the job and the hardware.
            </text>
            <text x={bandX + 12} y={rulesTop + 56} fontFamily={font} fontSize={11} fontWeight={600} fill={ink}>
              Loss spike, throughput steady:
            </text>
            <text x={bandX + 12} y={rulesTop + 72} fontFamily={font} fontSize={11} fill={ink}>
              model or data first, then a silent hardware fault.
            </text>
          </>
        ) : (
          <>
            <text x={bandX + 16} y={rulesTop + 24} fontFamily={font} fontSize={11} fill={ink}>
              <tspan fontWeight={600}>Throughput down, loss healthy:</tspan> look down the stack, at the job and the hardware.
            </text>
            <text x={bandX + 16} y={rulesTop + 44} fontFamily={font} fontSize={11} fill={ink}>
              <tspan fontWeight={600}>Loss spike, throughput steady:</tspan> the model or the data first, then a silent hardware
              fault (dashed).
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Tables                                                                   */
/* ------------------------------------------------------------------------ */

const cell: CSSProperties = {
  padding: '6px 8px',
  borderBottom: '1px solid #e9ebed',
  textAlign: 'left',
  verticalAlign: 'top',
  overflowWrap: 'anywhere',
};
const headCell: CSSProperties = { ...cell, fontWeight: 700, borderBottom: '2px solid #d1d5db' };
/** Number cells: no hyphenation inside a figure, but free to wrap between words on a phone. */
const numCell: CSSProperties = { ...cell, overflowWrap: 'normal' };

function ReferenceRatesTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>One H100, {MFU_PCT} MFU</th>
            <th style={headCell}>6N: every parameter, no attention</th>
            <th style={headCell}>TorchTitan&apos;s count, {num(LONG_SEQ)} tokens</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cell}>Llama 3.1 8B, tokens per second</td>
            <td style={numCell}>
              about {R8_TPS}
              <Box variant="small" display="block" color="text-body-secondary">
                {sci(R8.flopsPerToken)} FLOPs per token
              </Box>
            </td>
            <td style={numCell}>
              about {about(T8.tokensPerSecond)}
              <Box variant="small" display="block" color="text-body-secondary">
                {sci(T8.flopsPerToken)} FLOPs per token
              </Box>
            </td>
          </tr>
          <tr>
            <td style={cell}>Llama 3.1 70B, tokens per second</td>
            <td style={numCell}>
              about {about(R70.tokensPerSecond)}
              <Box variant="small" display="block" color="text-body-secondary">
                {sci(R70.flopsPerToken)} FLOPs per token
              </Box>
            </td>
            <td style={numCell}>
              about {about(T70.tokensPerSecond)}
              <Box variant="small" display="block" color="text-body-secondary">
                {sci(T70.flopsPerToken)} FLOPs per token
              </Box>
            </td>
          </tr>
          <tr>
            <td style={cell}>
              <strong>8B logging {num(LOGGED_TPS)} tokens per second reads as</strong>
            </td>
            <td style={numCell}>
              <strong>{R8_AT_LOGGED} MFU</strong>
            </td>
            <td style={numCell}>
              <strong>about {pct0(T8.mfuAtLogged)} MFU</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

interface MeasureRow {
  metric: string;
  how: ReactNode;
  range: ReactNode;
  source: ReactNode;
}

const MEASURE_ROWS: MeasureRow[] = [
  {
    metric: 'Loss, average and maximum',
    how: "Over every valid token on every rank; maximum of each rank's own average",
    range: 'No range; score its spikes',
    source: (
      <Cite tier={1} href={TT_LOG} kind="code">
        TorchTitan metrics.py L509-L575
      </Cite>
    ),
  },
  {
    metric: 'Gradient norm',
    how: 'Total norm before clipping, every step',
    range: 'No range; score values 7 or more standard deviations from the 1,000-step rolling average',
    source: (
      <Cite tier={3} href={OLMO2} venue={OLMO2_VENUE}>
        OLMo 2, Section 3
      </Cite>
    ),
  },
  {
    metric: 'NaN or Inf',
    how: 'Finite check on the loss and the gradient norm before the update',
    range: 'None allowed',
    source: (
      <Cite tier={1} href={TT_FINITE} kind="code">
        TorchTitan optim.py L163-L192
      </Cite>
    ),
  },
  {
    metric: 'Tokens per second per accelerator',
    how: 'Window tokens / (seconds x context x tensor x pipeline degrees)',
    range: 'No range; compare with the reference rates above',
    source: (
      <Cite tier={1} href={TT_PERF} kind="code">
        TorchTitan metrics.py L115-L135
      </Cite>
    ),
  },
  {
    metric: 'MFU',
    how: 'FLOPs per token x tokens per second / dense peak; name the FLOP count',
    range: 'Llama 3 405B measured 38% to 43%, BF16 on H100',
    source: (
      <Cite tier={3} href={LLAMA3} venue="preprint">
        Llama 3 Herd of Models, Table 4
      </Cite>
    ),
  },
  {
    metric: 'Data-loading share',
    how: 'Time waiting for batches / time of the window',
    range: 'Optimise the pipeline above 20%',
    source: <Cite tier={1} href={EKS_OBS}>EKS Best Practices Guide</Cite>,
  },
  {
    metric: 'Per-rank compute time',
    how: 'Forward and backward pass of each rank, timed apart from collectives',
    range: 'No range; the slowest rank is the suspect',
    source: (
      <Cite tier={3} href={MEGASCALE} venue="NSDI 2024">
        MegaScale, Section 6.3
      </Cite>
    ),
  },
  {
    metric: 'Memory',
    how: 'Peak allocated, peak reserved, allocator retries',
    range: 'No range; compare the peak with Calculator B',
    source: (
      <Cite tier={1} href={PT_STATS} kind="code">
        PyTorch memory.py L243-L318
      </Cite>
    ),
  },
  {
    metric: 'SM activity (DCGM 1002)',
    how: 'Share of cycles an SM has at least one warp assigned',
    range: '0.8 or more necessary, not sufficient; below 0.5 likely ineffective; AWS targets 0.8 as a rule of thumb',
    source: (
      <>
        <Cite tier={1} href={DCGM_GUIDE}>
          DCGM User Guide
        </Cite>{' '}
        <Cite tier={1} href={EKS_OBS}>
          EKS Best Practices Guide
        </Cite>
      </>
    ),
  },
  {
    metric: 'Tensor activity (DCGM 1004)',
    how: 'Share of cycles any tensor pipe is active',
    range: 'No range located in the sources read',
    source: (
      <Cite tier={1} href={dcgm('L2633-L2637')} kind="code">
        DCGM dcgm_fields.h L2633-L2637
      </Cite>
    ),
  },
  {
    metric: 'Xid errors, ECC, row remapping',
    how: "Driver error codes, read against the catalog's resolution buckets",
    range: "RESET_GPU or RESTART_BM takes the node out; a WORKFLOW_ bucket sends you to that Xid's workflow in the catalog (our reading)",
    source: <Cite tier={1} href={XID_CATALOG}>NVIDIA Xid catalog</Cite>,
  },
  {
    metric: 'Throttling',
    how: 'Clock-event reasons (field 112); power and thermal violation time (240, 241; deprecated for 1617, 1618)',
    range: 'No range; it shows as a slow rank',
    source: (
      <Cite tier={1} href={dcgm('L585-L592')} kind="code">
        DCGM dcgm_fields.h L585-L592
      </Cite>
    ),
  },
  {
    metric: 'NVLink and EFA counters',
    how: 'NVLink bytes (1011, 1012) and error totals (409, 419, 429, 439; 497 to 499 on H100); EFA device counters',
    range: 'No range here; the EFA dive reads the EFA counters',
    source: (
      <Cite tier={1} href={dcgm('L2676-L2690')} kind="code">
        DCGM dcgm_fields.h L2676-L2690
      </Cite>
    ),
  },
];

function MeasurementTable() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, 640);
  return (
    <div ref={ref}>
      {narrow ? (
        <SpaceBetween size="s">
          {MEASURE_ROWS.map((r) => (
            <div key={r.metric} style={{ borderBottom: '1px solid #e9ebed', paddingBottom: 8, overflowWrap: 'anywhere' }}>
              <Box variant="h4">{r.metric}</Box>
              <Box variant="p">
                <strong>Computed:</strong> {r.how}
              </Box>
              <Box variant="p">
                <strong>Healthy range:</strong> {r.range}
              </Box>
              <Box variant="small">{r.source}</Box>
            </div>
          ))}
        </SpaceBetween>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={headCell}>Metric</th>
                <th style={headCell}>How it is computed</th>
                <th style={headCell}>Healthy range, where a source gives one</th>
                <th style={headCell}>Source</th>
              </tr>
            </thead>
            <tbody>
              {MEASURE_ROWS.map((r) => (
                <tr key={r.metric}>
                  <td style={cell}>
                    <strong>{r.metric}</strong>
                  </td>
                  <td style={cell}>{r.how}</td>
                  <td style={cell}>{r.range}</td>
                  <td style={cell}>{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface XidRow {
  xid: string;
  meaning: string;
  immediate: string;
  next: string;
}

const XID_ROWS: XidRow[] = [
  { xid: '48', meaning: 'Double-bit ECC error, uncorrectable; a GPU reset or node reboot clears it', immediate: 'WORKFLOW_XID_48', next: 'WORKFLOW_XID_48' },
  { xid: '63', meaning: 'Row-remapping event: the memory repaired a row', immediate: 'IGNORE', next: 'IGNORE' },
  { xid: '64', meaning: 'Row-remapping failure', immediate: 'RESET_GPU', next: 'CONTACT_SUPPORT' },
  {
    xid: '74',
    meaning: 'NVLink error; can be reported by a healthy GPU whose peer failed',
    immediate: 'WORKFLOW_NVLINK_ERR',
    next: 'CONTACT_SUPPORT',
  },
  { xid: '79', meaning: 'GPU fallen off the bus, often a PCI Express link failure', immediate: 'RESTART_BM', next: 'CONTACT_SUPPORT' },
];

function XidTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>Xid</th>
            <th style={headCell}>What it reports</th>
            <th style={headCell}>Immediate bucket</th>
            <th style={headCell}>Investigation</th>
          </tr>
        </thead>
        <tbody>
          {XID_ROWS.map((r) => (
            <tr key={r.xid}>
              <td style={numCell}>{r.xid}</td>
              <td style={cell}>{r.meaning}</td>
              <td style={cell}>
                <code>{r.immediate}</code>
              </td>
              <td style={cell}>
                <code>{r.next}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

/** How far apart the two FLOP counts are for 8B at 8,192 tokens. */
const COUNT_GAP = pct0(T8.flopsPerToken / R8.flopsPerToken - 1);

export function WhatToMeasure() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={`Watch three layers of signal and know which one moved when a run goes wrong. At ${MFU_PCT} MFU (model FLOPs utilization) and 6 FLOPs per parameter per token, an H100 trains Llama 3.1 8B at about ${R8_TPS} tokens per second, so a log showing ${num(LOGGED_TPS)} means about ${R8_AT_LOGGED} MFU (TorchTitan v0.4.0, Megatron Core core_v0.20.0, PyTorch v2.15.0 and NVIDIA Data Center GPU Manager (DCGM) v4.7.0 code, with NVIDIA and AWS documentation and papers, read 2026-10-31)`}
          >
            29. What to Measure in a Run
          </Header>
        }
      >
        <Box variant="p">
          A training run reports thousands of numbers on every step, one set per rank (one training
          process per accelerator), and most of them stay flat for weeks. The challenge is to watch few
          enough to read and to tell, the moment one moves, whether the model, the job or a machine moved
          it.
        </Box>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Tell which layer moved when a run goes wrong: efficiency falling under a healthy loss points at the infrastructure, and a loss spike under steady throughput points at the model, the data or a silent hardware fault"
          >
            Three layers of signal
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A run reports on three layers, each with its own tools. <strong>Model health</strong> is the
            loss, the gradient norm (the size of the step&apos;s gradient across every weight) and any NaN
            (not a number) or Inf (infinity) in either, computed by the training loop.{' '}
            <strong>Job efficiency</strong> is tokens per second per accelerator, MFU and the shares of
            step time, from the same loop and per-rank traces, with SM (streaming multiprocessor) activity
            from DCGM. <strong>Hardware health</strong> is Xid
            errors (the NVIDIA driver&apos;s numbered GPU error reports), ECC (error-correcting code) errors
            and row remapping, clock throttling, and NVLink and EFA (Elastic Fabric Adapter) counters, read
            through DCGM{' '}
            <Cite tier={1} href={dcgm('L2610-L2640')} kind="code">
              DCGM v4.7.0 dcgm_fields.h L2610-L2640
            </Cite>{' '}
            and the driver{' '}
            <Cite tier={1} href={XID_CATALOG}>
              NVIDIA Xid catalog
            </Cite>
            .
          </Box>
          <Box variant="p">
            The layers explain each other&apos;s symptoms. Efficiency falling under a healthy loss points at
            the infrastructure: a throttled GPU, a slow rank, a starved input pipeline. A loss spike under
            steady throughput points at the model or the data, or at a hardware fault that corrupted a
            result without raising an error. Megatron Core can re-run a suspect step to tell those two
            apart{' '}
            <Cite tier={1} href={MG_RERUN_NOTE} kind="code">
              Megatron Core rerun_state_machine.py L21-L30
            </Cite>
            .
          </Box>
          <SignalStackDiagram />
          <Box variant="small" color="text-body-secondary">
            Our reading of the sources cited in this section. The thresholds (20%, 0.5) are the
            sources&apos; own; the table at the end of the section cites each.
          </Box>
          <Box variant="p">
            TorchTitan&apos;s default log covers the first two layers: the global average and maximum loss
            across ranks, the gradient norm, tokens per second per device, achieved TFLOPS (trillion FLOPs
            per second), MFU, the data-loading share of the logging window, and peak memory with the
            allocator&apos;s retry and out-of-memory counts{' '}
            <Cite tier={1} href={TT_LOG} kind="code">
              TorchTitan v0.4.0 metrics.py L509-L575
            </Cite>
            . Start a dashboard from that list and add the hardware layer.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Check a run's efficiency in the unit its log prints: at ${MFU_PCT} MFU an H100 trains Llama 3.1 8B at about ${R8_TPS} tokens per second by 6N alone, so ${num(LOGGED_TPS)} means about ${R8_AT_LOGGED} MFU`}
          >
            Job efficiency: read MFU in tokens per second
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            MFU is the share of the dense peak that the model&apos;s own arithmetic achieves: tokens per
            second times FLOPs per token, divided by the peak (section 4, Counting the Arithmetic: 6ND, MFU
            &amp; Run Time, defines it and its denominator). Tokens per second per accelerator is the
            number to compare across runs and instance types; MFU divides it by a vendor peak and inherits
            that peak&apos;s assumptions.
          </Box>
          <Box variant="p">
            TorchTitan logs throughput per device as the window&apos;s tokens over its seconds, divided by
            the product of the context-, tensor- and pipeline-parallel degrees{' '}
            <Cite tier={1} href={TT_PERF} kind="code">
              TorchTitan v0.4.0 metrics.py L115-L135
            </Cite>{' '}
            <Cite tier={1} href={TT_NON_DP} kind="code">
              parallelism_context.py L653-L655
            </Cite>
            , and MFU against a hard-coded 989 TFLOPS for an H100 in BF16 (bfloat16){' '}
            <Cite tier={1} href={TT_PEAKS} kind="code">
              tools/utils.py L109-L144
            </Cite>
            . It drops MFU from the log when a quantized recipe such as Float8 is on{' '}
            <Cite tier={1} href={TT_PERF} kind="code">
              metrics.py L131-L134
            </Cite>
            ; an FP8 (8-bit floating point) run divides by the FP8 dense peak (section 4).
          </Box>
          <Box variant="p">
            At {MFU_PCT} MFU, counting 6N FLOPs per token with the full parameter count and no attention
            term, an H100 trains Llama 3.1 8B at about {R8_TPS} tokens per second and 70B at about{' '}
            {about(R70.tokensPerSecond)}, so{' '}
            <strong>8B at {num(LOGGED_TPS)} tokens per second is near 20% MFU</strong>{' '}
            ({R8_AT_LOGGED}). TorchTitan&apos;s MFU column also counts attention and leaves out the
            embedding table, so at {num(LONG_SEQ)}-token sequences its {MFU_PCT} is about{' '}
            {about(T8.tokensPerSecond)} tokens per second for 8B and about {about(T70.tokensPerSecond)} for
            70B, and {num(LOGGED_TPS)} reads as about {pct0(T8.mfuAtLogged)}. At {num(SHORT_SEQ)} tokens
            the two counts nearly agree (about {about(T8_SHORT.tokensPerSecond)} for 8B), because
            attention&apos;s share grows with sequence length. Our arithmetic through Calculator A, on the
            dense BF16 peak of {num(H100_PEAK)} TFLOPS; the {MFU_PCT} is an assumption inside the 38% to
            43% Llama 3 405B measured in BF16 on H100s{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Table 4
            </Cite>
            .
          </Box>
          <ReferenceRatesTable />
          <Box variant="p">
            Compare a measured rate with an estimate on the same FLOP count, or 8B at {num(LONG_SEQ)}{' '}
            tokens is off by {COUNT_GAP}; section 31, Bring-Up: From One Node to the Full Run, makes that a
            rung of its ladder.
          </Box>
          <Box variant="p">
            <strong>Data loading.</strong> TorchTitan logs the share of each window spent waiting for
            batches{' '}
            <Cite tier={1} href={TT_DATA_PCT} kind="code">
              TorchTitan v0.4.0 metrics.py L547-L549
            </Cite>
            , and the EKS (Amazon Elastic Kubernetes Service) Best Practices Guide sets 20% of training
            time as the level above which to optimise the pipeline{' '}
            <Cite tier={1} href={EKS_OBS}>
              EKS Best Practices Guide, AI/ML observability
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Per-rank compute time.</strong> A synchronous step runs at the pace of its slowest
            rank, and the others book their wait as time in collectives (communication steps every rank
            joins), so the straggler is the rank with the longest forward and backward pass. Section 19,
            Resuming Correctly, adds that timing to the log. Megatron Core&apos;s{' '}
            <code>log_straggler</code> logs per-GPU throughput, off by default{' '}
            <Cite tier={1} href={MG_STRAGGLER} kind="code">
              Megatron Core resilience_config.py L32-L46
            </Cite>
            . Treat a slow decline like a drop: MegaScale traced an MFU that fell gradually over a run to
            ranks launching the data-parallel reduce-scatter late, from irregular garbage collection and
            some PyTorch operations{' '}
            <Cite tier={3} href={MEGASCALE} venue="NSDI 2024">
              MegaScale, Section 6.3
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Catch a diverging run while a rollback is still cheap: gradient-norm spikes come more often than loss spikes and often before them, and a NaN should stop the step before the update"
          >
            Model health: watch the gradient norm ahead of the loss
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The loss is the lagging signal and the gradient norm the leading one. In the training of
            OLMo-0424, the model before OLMo 2, gradient-norm spikes came more often than loss spikes and
            the larger ones often came first, and a slow upward drift in the norm went with more frequent
            spikes; the OLMo 2 authors write that together these would lead to divergence at larger scale.
            OLMo 2 scores spikiness as the share of values at least 7 standard deviations from
            a rolling average of the last 1,000, on the loss and on the gradient norm{' '}
            <Cite tier={3} href={OLMO2} venue={OLMO2_VENUE}>
              2 OLMo 2 Furious, Section 3
            </Cite>
            .
          </Box>
          <Box variant="p">
            Large runs handled spikes operationally: roll back to a checkpoint before the spike, skip the
            batches, or lower the learning rate. That needs checkpoints close enough to go back about 100
            steps and a data loader that can skip a known range of batches, which section 18,
            Checkpointing, and section 19, Resuming Correctly, set up.
          </Box>
          <ExpandableSection headerText="How four large runs reported their instabilities">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>PaLM 540B</strong> saw about 20 loss spikes despite gradient clipping, restarted
                from a checkpoint about 100 steps before each one and skipped about 200 to 500 data batches{' '}
                <Cite tier={3} href={PALM} venue="JMLR 2023">
                  PaLM, Section 5.1
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>OPT-175B</strong> saw divergence go with its FP16 (16-bit floating point) loss
                scaler crashing to 0 and the last layer&apos;s activation norm spiking, and recovered by
                lowering the learning rate and restarting from an earlier checkpoint{' '}
                <Cite tier={3} href={OPT} venue="preprint">
                  OPT, Section 2.5
                </Cite>
                ; one 10% learning-rate cut stabilised the gradient and activation norms{' '}
                <Cite tier={2} href={OPT_NOTES}>
                  OPT team notes, 56% update, L43
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>Llama 3 405B</strong> observed few loss spikes and needed no interventions for
                divergence{' '}
                <Cite tier={3} href={LLAMA3} venue="preprint">
                  Llama 3 Herd of Models, Section 3.4.1
                </Cite>
                ; <strong>DeepSeek-V3</strong> reports no irrecoverable loss spikes and no rollbacks{' '}
                <Cite tier={3} href={DEEPSEEK} venue="preprint">
                  DeepSeek-V3 Technical Report, Introduction
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            <strong>Read the logged norm as the pre-clip total.</strong> TorchTitan&apos;s logger docstring
            says the norm is after clipping{' '}
            <Cite tier={1} href={TT_LOG_DOC} kind="doc-code-conflict">
              TorchTitan v0.4.0 metrics.py L526
            </Cite>
            , but its clipping function returns the total it computed before clipping{' '}
            <Cite tier={1} href={TT_CLIP} kind="code">
              distributed/utils.py L534-L631
            </Cite>
            . A logged norm above the clip threshold (the norm above which gradients are scaled down) is
            therefore expected, and a run of steps above it means clipping acts on every step, our
            reading.
          </Box>
          <Box variant="p">
            <strong>Stop on NaN or Inf before the update.</strong> TorchTitan takes the minimum of a
            finite-loss flag across ranks, combines it with a finite check on the gradient norm and asserts
            before every optimizer step: &quot;Loss or gradient norm is not finite. Stopping before the
            update.&quot;{' '}
            <Cite tier={1} href={TT_FINITE} kind="code">
              TorchTitan v0.4.0 optim.py L163-L192
            </Cite>
            . Megatron Core checks loss and gradients for NaN by default (
            <code>--no-check-for-nan-in-loss-and-grad</code> turns it off){' '}
            <Cite tier={1} href={MG_ARGS} kind="code">
              Megatron Core arguments.py L2818-L2823
            </Cite>{' '}
            <Cite tier={1} href={MG_CHECKS} kind="code">
              resilience_config.py L20-L29
            </Cite>
            . Its rerun state machine, on by default, re-executes a suspect step: a transient error when
            the same GPU cannot reproduce the result, a persistent one when the same GPU does and a
            different GPU does not{' '}
            <Cite tier={1} href={MG_RERUN_DIAG} kind="code">
              rerun_state_machine.py L60-L66
            </Cite>
            , with exit codes 16 (restart to disambiguate) and 17 (failed validation) for the orchestrator{' '}
            <Cite tier={1} href={MG_RERUN_CODES} kind="code">
              L36-L40
            </Cite>
            . The module calls itself experimental, alpha-level code not tested at scale{' '}
            <Cite tier={1} href={MG_RERUN_NOTE} kind="code">
              L21-L30
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know how close each rank runs to its memory limit from two allocator peaks, and see fragmentation building before the first out-of-memory error"
          >
            Memory: read the allocator&apos;s peaks and count each byte once
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Track two peaks. Peak allocated (<code>max_memory_allocated</code>) is the most memory tensors
            occupied; peak reserved (<code>max_memory_reserved</code>) is the most the caching allocator
            held, a pool that contains the allocated blocks{' '}
            <Cite tier={1} href={PT_DEFS} kind="code">
              PyTorch v2.15.0 memory.py L526-L606
            </Cite>
            . <code>num_alloc_retries</code> counts failed <code>cudaMalloc</code> calls that forced a
            cache flush and a retry{' '}
            <Cite tier={1} href={PT_STATS} kind="code">
              memory.py L243-L318
            </Cite>
            , TorchTitan warns on any{' '}
            <Cite tier={1} href={TT_MEM} kind="code">
              TorchTitan v0.4.0 metrics.py L72-L95
            </Cite>
            , and a count that keeps rising is fragmentation building before an out-of-memory error, our
            reading. Compare the peak with Calculator B in section 5, The Memory Budget.
          </Box>
          <Box variant="p">
            To find the allocation that set the peak, record a snapshot with{' '}
            <code>torch.cuda.memory._record_memory_history()</code> and <code>_dump_snapshot(...)</code>{' '}
            and open it in pytorch.org/memory_viz, which runs locally and uploads nothing{' '}
            <Cite tier={1} href={PT_SNAPSHOT}>
              PyTorch v2.15.0 torch_cuda_memory.md L1-L39
            </Cite>
            . It sees only PyTorch&apos;s allocator, and NCCL (NVIDIA Collective Communications Library)
            allocates its memory outside it{' '}
            <Cite tier={1} href={PT_SNAPSHOT_NCCL}>
              torch_cuda_memory.md L16-L19
            </Cite>
            , so read <code>torch.cuda.device_memory_used</code> for the device total{' '}
            <Cite tier={1} href={PT_SNAPSHOT_RAW}>
              torch_cuda_memory.md L97-L109
            </Cite>
            .
          </Box>
          <Box variant="p">
            Plot allocated and reserved separately, never their sum. The EKS guide&apos;s Prometheus
            example reports GPU memory in use as <code>memory_allocated + memory_reserved</code>{' '}
            <Cite tier={1} href={EKS_OBS} kind="doc-code-conflict">
              EKS Best Practices Guide, Prometheus and Grafana example
            </Cite>
            , which counts the tensors twice because reserved contains them{' '}
            <Cite tier={1} href={PT_DEFS} kind="code">
              PyTorch v2.15.0 memory.py L526-L606
            </Cite>
            : the sum reads between one and two times the real footprint, our arithmetic from the
            definitions.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read the device in counters that mean something: GPU utilization only says a kernel ran, SM activity below 0.5 likely means the GPU is used ineffectively, and an Xid's catalog bucket says whether the node stays"
          >
            Hardware health: judge the GPU by its counters
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            &quot;GPU utilization&quot; only says a kernel ran during the sample{' '}
            <Cite tier={1} href={EKS_OBS}>
              EKS Best Practices Guide, AI/ML observability
            </Cite>
            . SM activity is the share of cycles an SM has at least one warp (a
            group of threads it schedules together) assigned{' '}
            <Cite tier={1} href={dcgm('L2620-L2624')} kind="code">
              DCGM v4.7.0 dcgm_fields.h L2620-L2624
            </Cite>
            , and both vendors give it thresholds: NVIDIA calls 0.8 or more necessary but not sufficient for
            effective use and says below 0.5 likely indicates ineffective use{' '}
            <Cite tier={1} href={DCGM_GUIDE}>
              DCGM User Guide, Profiling Metrics
            </Cite>
            ; AWS&apos;s EKS guide sets 0.8 as a rule-of-thumb target{' '}
            <Cite tier={1} href={EKS_OBS}>
              EKS Best Practices Guide
            </Cite>
            . Warps waiting on memory requests count as active{' '}
            <Cite tier={1} href={DCGM_GUIDE}>
              DCGM User Guide
            </Cite>
            , so SM activity can read high while little arithmetic runs; tensor activity, the share of
            cycles any tensor pipe is active (field 1004){' '}
            <Cite tier={1} href={dcgm('L2633-L2637')} kind="code">
              dcgm_fields.h L2633-L2637
            </Cite>
            , is the closer view of busy matrix units, our reading. Neither replaces MFU, which counts
            FLOPs in software.
          </Box>
          <Box variant="p">
            <strong>Errors arrive as Xids.</strong> NVIDIA&apos;s catalog gives each Xid an immediate and an
            investigatory resolution bucket: RESTART_APP restarts the application with no GPU reset or node
            restart, RESET_GPU resets the GPU, RESTART_BM restarts the bare-metal node, and some Xids have a
            WORKFLOW_ bucket of their own{' '}
            <Cite tier={1} href={XID_CATALOG}>
              NVIDIA Xid catalog, Table 1 and Resolution Buckets
            </Cite>
            . Xid 48, an uncorrectable double-bit ECC error, is WORKFLOW_XID_48 and needs a GPU reset or
            node reboot to clear; Xid 79, a GPU fallen off the bus, is RESTART_BM.
          </Box>
          <ExpandableSection headerText="Five Xids a training run meets, with their buckets on H100">
            <SpaceBetween size="s">
              <XidTable />
              <Box variant="small" color="text-body-secondary">
                From the catalog&apos;s Table 1, page last updated 2026-09-09{' '}
                <Cite tier={1} href={XID_CATALOG}>
                  NVIDIA Xid catalog
                </Cite>
                . An Xid 74 on several GPUs of one node points at one failed peer rather than many bad
                links, our reading of the catalog&apos;s note on Xid 74.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            <strong>Throttling raises no error.</strong> DCGM reports why clocks are held down as a bitmask
            of clock-event reasons (field 112, alias <code>CLOCK_THROTTLE_REASONS</code>){' '}
            <Cite tier={1} href={dcgm('L585-L592')} kind="code">
              DCGM v4.7.0 dcgm_fields.h L585-L592
            </Cite>{' '}
            and accumulates power and thermal violation time in nanoseconds (fields 240 and 241){' '}
            <Cite tier={1} href={dcgm('L843-L855')} kind="code">
              L843-L855
            </Cite>
            , which v4.7.0 marks deprecated in favour of fields 1617 and 1618, counted in seconds{' '}
            <Cite tier={1} href={dcgm('L3644-L3652')} kind="code">
              L3644-L3652
            </Cite>
            . A throttled GPU becomes a slow rank every other rank waits for: on Llama 3 405B, mid-day
            temperatures acting on the GPUs&apos; dynamic voltage and frequency scaling moved throughput by
            1% to 2% over the day{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.4
            </Cite>
            .
          </Box>
          <Box variant="p">
            The EFA device counters are read in the{' '}
            <Link href="../efa/">EFA dive, section 17: Operations, Observability and Failure Modes</Link>.
          </Box>
          <ExpandableSection headerText="Field IDs for dashboards: the v4.7.0 renames and the NVLink counters by GPU generation">
            <SpaceBetween size="s">
              <Box variant="p">
                Key dashboards on field IDs: DCGM v4.7.0 renamed its profiling fields, for example{' '}
                <code>DCGM_FI_PROF_SM_ACTIVE</code> to <code>DCGM_FI_PROF_SM_UTIL_RATIO</code>, and keeps the
                old names as deprecated aliases with the same IDs, 1002 and 1004{' '}
                <Cite tier={1} href={dcgm('L3954')} kind="code">
                  DCGM v4.7.0 dcgm_fields.h L3954
                </Cite>{' '}
                <Cite tier={1} href={dcgm('L4174-L4176')} kind="code">
                  L4174-L4176
                </Cite>
                .
              </Box>
              <Box variant="p">
                NVLink bytes sent and received are fields 1011 and 1012{' '}
                <Cite tier={1} href={dcgm('L2676-L2690')} kind="code">
                  dcgm_fields.h L2676-L2690
                </Cite>
                , and its CRC (cyclic redundancy check), replay and recovery error totals are fields 409, 419, 429 and 439{' '}
                <Cite tier={1} href={dcgm('L4104-L4107')} kind="code">
                  L4104-L4107
                </Cite>
                . dcgm-exporter 4.8.4&apos;s counter file lists those four for GPUs before Hopper and gives an H100
                the data-link CRC, recovery and replay totals, fields 497, 498 and 499{' '}
                <Cite tier={1} href={EXPORTER_NVLINK} kind="code">
                  dcgm-exporter 4.8.4 default-counters.csv L66-L75
                </Cite>{' '}
                <Cite tier={1} href={dcgm('L1718-L1731')} kind="code">
                  dcgm_fields.h L1718-L1731
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
            description="Have one table and six alerts running before the long run starts, so the first slow, spiking or failing step is caught at the layer that explains it"
          >
            The measurement table and the alert set
          </Header>
        }
      >
        <SpaceBetween size="m">
          <MeasurementTable />
          <Box variant="p">
            The alert set is our reading of the sources above; each threshold is a source&apos;s own.
          </Box>
          <ol style={{ margin: 0, paddingLeft: 20 }}>
            <li>
              <strong>A sustained throughput drop</strong>: tokens per second per accelerator below the
              run&apos;s own recent level, slow declines included.
            </li>
            <li>
              <strong>A gradient-norm spike</strong>: a value 7 or more standard deviations from the
              rolling 1,000-step average, with the spike score trended.
            </li>
            <li>
              <strong>Any NaN or Inf</strong> in the loss or the gradient norm: the framework stops the
              step, and the alert says why the job ended.
            </li>
            <li>
              <strong>SM activity below 0.5</strong>, sustained.
            </li>
            <li>
              <strong>Data loading above 20% of step time.</strong>
            </li>
            <li>
              <strong>Any Xid whose immediate bucket asks for more than an application restart</strong>:
              RESET_GPU, RESTART_BM, or a WORKFLOW_ bucket such as those of Xid 48 and Xid 74. Treat
              Xid 45 apart: the driver logs it whenever an application is aborted, Control-C, sigkill
              and GPU resets included, so follow the other Xid when one arrives with it, and act only
              on Xid 45 alone, where the catalog's action is RESTART_FM{' '}
              <Cite tier={1} href={XID_CATALOG}>
                NVIDIA Xid catalog, Xid 45 and WORKFLOW_XID_45
              </Cite>
              .
            </li>
          </ol>
          <Box variant="p">
            Wire each alert to the log line or DCGM field it reads. Some of those fields are off by
            default: dcgm-exporter 4.8.4&apos;s default set leaves out SM activity, the power and thermal
            violation counters and the ECC counters{' '}
            <Cite tier={1} href={EXPORTER_DEFAULTS} kind="code">
              dcgm-exporter 4.8.4 default-counters.csv L28-L107
            </Cite>
            , and section 30, The Telemetry Stack on AWS, turns on what each AWS path leaves off. Then take
            the first measured step to section 31, Bring-Up: From One Node to the Full Run. If 8B on one
            H100 logs {num(LOGGED_TPS)} tokens per second, the run is at about {R8_AT_LOGGED} MFU by 6N and
            about {pct0(T8.mfuAtLogged)} in TorchTitan&apos;s column, and the gap to the {MFU_PCT} estimate
            is the first thing to explain.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
