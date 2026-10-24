import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangDocsSrcUrl } from '../components/Cite';

const SRT = 'python/sglang/srt';
const EXEC_FIELDS = `${SRT}/arg_groups/fields/exec_.py`;
const PAR_FIELDS = `${SRT}/arg_groups/fields/parallel.py`;
const MOE_HOOK = `${SRT}/arg_groups/moe_hook.py`;
const PAR_HOOK = `${SRT}/arg_groups/parallel_hook.py`;
const VALIDATION_HOOK = `${SRT}/arg_groups/validation_hook.py`;
const OVERRIDES = `${SRT}/arg_groups/overrides.py`;
const MOE_UTILS = `${SRT}/layers/moe/utils.py`;
const DEEPEP = `${SRT}/layers/moe/token_dispatcher/deepep.py`;
const MOONCAKE = `${SRT}/layers/moe/token_dispatcher/mooncake.py`;
const NIXL = `${SRT}/layers/moe/token_dispatcher/nixl.py`;
const MOE_LAYER = `${SRT}/layers/moe/fused_moe_triton/layer.py`;
const FP8 = `${SRT}/layers/quantization/fp8.py`;
const DP_ATTN = `${SRT}/managers/scheduler_components/dp_attn.py`;
const METRICS_REPORTER = `${SRT}/managers/scheduler_components/metrics_reporter.py`;
const METRICS = `${SRT}/observability/metrics_collector.py`;
const EPLB_MGR = `${SRT}/eplb/eplb_manager.py`;
const EXPERT_DIST = `${SRT}/eplb/expert_distribution.py`;
const EPLB_ALGOS = `${SRT}/eplb/eplb_algorithms/__init__.py`;
const MODEL_RUNNER = `${SRT}/model_executor/model_runner.py`;
const OPS_STRATEGY = `${SRT}/batch_overlap/operations_strategy.py`;
const TBO = `${SRT}/batch_overlap/two_batch_overlap.py`;
const ELASTIC_TEST = 'test/manual/ep/test_elastic_recover.py';
const EP_DOC = 'advanced_features/expert_parallelism';
const PD_DOC = 'advanced_features/pd_disaggregation';
const LMSYS_EP = 'https://lmsys.org/blog/2025-05-05-large-scale-ep/';
const VLLM_CFG = 'https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/parallel.py';

const PD_EP_LAUNCH = `# prefill server: one line per node (--node-rank 0, then 1)
sglang serve --model-path <model> --disaggregation-mode prefill \\
  --tp 16 --attn-dp-size 8 --moe-a2a-backend deepep --deepep-mode normal \\
  --nnodes 2 --node-rank 0 --dist-init-addr <prefill-node0>:5000

# decode server: same layout, low-latency mode keeps decode CUDA graphs
sglang serve --model-path <model> --disaggregation-mode decode \\
  --tp 16 --attn-dp-size 8 --moe-a2a-backend deepep --deepep-mode low_latency \\
  --nnodes 2 --node-rank 0 --dist-init-addr <decode-node0>:5000`;

/* ------------------------------------------------------------------ */
/* Diagram: DeepEP mode by step, colocated against split by PD         */
/* ------------------------------------------------------------------ */

type CellKind = 'decode' | 'prefill' | 'normal' | 'll' | 'graphOn' | 'graphOff';

function DeepEpModeTimeline() {
  const blue = '#0972d3';
  const blueFill = '#f2f8fd';
  const purple = '#6f4cc4';
  const purpleFill = '#efe7fb';
  const amber = '#8b6c00';
  const amberFill = '#fbf3d5';
  const green = '#037f0c';
  const greenFill = '#ecf7ec';
  const neutral = '#879596';
  const text = '#16191f';
  const secondary = '#5f6b7a';
  const slate = '#414d5c';
  const font = 'sans-serif';

  const x0 = 200;
  const pitch = 112;
  const cellW = 100;
  const cellH = 22;
  const colX = (i: number) => x0 + i * pitch;
  const steps = [0, 1, 2, 3, 4, 5];

  // Work each attention-DP rank runs on each step of the colocated server.
  const ranks: Array<Array<'decode' | 'prefill'>> = [
    ['decode', 'decode', 'decode', 'decode', 'prefill', 'decode'],
    ['decode', 'decode', 'decode', 'decode', 'decode', 'decode'],
    ['decode', 'prefill', 'prefill', 'decode', 'decode', 'decode'],
    ['decode', 'decode', 'decode', 'decode', 'decode', 'decode'],
  ];
  const mixed = steps.map((s) => ranks.some((r) => r[s] === 'prefill'));

  const style: Record<CellKind, { fill: string; stroke: string; label: string; ink: string }> = {
    decode: { fill: blueFill, stroke: blue, label: 'decode', ink: text },
    prefill: { fill: purpleFill, stroke: purple, label: 'prefill chunk', ink: text },
    normal: { fill: amberFill, stroke: amber, label: 'normal', ink: text },
    ll: { fill: greenFill, stroke: green, label: 'low-latency', ink: text },
    graphOn: { fill: '#ffffff', stroke: green, label: 'graph on', ink: green },
    graphOff: { fill: '#ffffff', stroke: amber, label: 'graph off', ink: amber },
  };

  const cell = (key: string, step: number, y: number, kind: CellKind) => (
    <g key={key}>
      <rect
        x={colX(step)}
        y={y}
        width={cellW}
        height={cellH}
        rx={4}
        fill={style[kind].fill}
        stroke={style[kind].stroke}
        strokeWidth={1.2}
      />
      <text
        x={colX(step) + cellW / 2}
        y={y + 15}
        textAnchor="middle"
        fontSize={11}
        fill={style[kind].ink}
        fontFamily={font}
      >
        {style[kind].label}
      </text>
    </g>
  );

  const rowLabel = (y: number, label: string, strong = true) => (
    <text
      x={28}
      y={y + 15}
      fontSize={12}
      fontWeight={strong ? 600 : 400}
      fill={strong ? text : secondary}
      fontFamily={font}
    >
      {label}
    </text>
  );

  // Panel A rows
  const aTop = 38;
  const aRankY = (r: number) => 86 + r * 26;
  const aModeY = 196;
  const aGraphY = 222;
  // Panel B rows
  const bTop = 268;
  const bPrefillY = 300;
  const bPrefillModeY = 326;
  const bDecodeY = 362;
  const bDecodeModeY = 388;
  const bGraphY = 414;

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 460"
        role="img"
        aria-labelledby="wideep-mode-title"
        style={{ width: '100%', minWidth: 720, height: 'auto' }}
      >
        <title id="wideep-mode-title">
          Under DP attention with --deepep-mode auto, the EP group runs one DeepEP mode per step for
          every rank. On any step where one DP rank runs a prefill chunk, all ranks use normal mode
          and none can use the decode CUDA graph, so the ranks that were only decoding lose
          low-latency mode on that step. With prefill and decode on separate PD servers, the prefill
          server runs normal mode on every step and the decode server runs low-latency mode with its
          decode CUDA graph on every step.
        </title>

        <rect x={0} y={0} width={900} height={460} rx={8} fill="#ffffff" />

        <text
          x={450}
          y={24}
          textAnchor="middle"
          fontSize={13}
          fontWeight={600}
          fill={text}
          fontFamily={font}
        >
          DeepEP mode by step: the EP group moves in lockstep
        </text>

        {/* Panel A: colocated */}
        <rect
          x={12}
          y={aTop}
          width={876}
          height={218}
          rx={8}
          fill="#ffffff"
          stroke={neutral}
          strokeWidth={1.2}
        />
        <text x={28} y={aTop + 20} fontSize={12} fontWeight={600} fill={slate} fontFamily={font}>
          A. One server, prefill and decode colocated, --deepep-mode auto
        </text>
        {steps.map((s) => (
          <text
            key={`a-step-${s}`}
            x={colX(s) + cellW / 2}
            y={78}
            textAnchor="middle"
            fontSize={11}
            fontWeight={600}
            fill={secondary}
            fontFamily={font}
          >
            {`step ${s + 1}`}
          </text>
        ))}

        {/* Mixed-step outlines: one rank prefilling flips the whole column */}
        {steps
          .filter((s) => mixed[s])
          .map((s) => (
            <rect
              key={`a-mix-${s}`}
              x={colX(s) - 4}
              y={aRankY(0) - 4}
              width={cellW + 8}
              height={aGraphY + cellH + 4 - (aRankY(0) - 4)}
              rx={6}
              fill="none"
              stroke={amber}
              strokeWidth={1.2}
              strokeDasharray="5 4"
            />
          ))}

        {ranks.map((row, r) => (
          <g key={`a-rank-${r}`}>
            {rowLabel(aRankY(r), `DP rank ${r}`)}
            {row.map((work, s) => cell(`a-${r}-${s}`, s, aRankY(r), work))}
          </g>
        ))}

        {rowLabel(aModeY, 'Mode for all ranks')}
        {steps.map((s) => cell(`a-mode-${s}`, s, aModeY, mixed[s] ? 'normal' : 'll'))}
        {rowLabel(aGraphY, 'Decode CUDA graph')}
        {steps.map((s) => cell(`a-graph-${s}`, s, aGraphY, mixed[s] ? 'graphOff' : 'graphOn'))}

        {/* Panel B: split by PD */}
        <rect
          x={12}
          y={bTop}
          width={876}
          height={180}
          rx={8}
          fill="#ffffff"
          stroke={neutral}
          strokeWidth={1.2}
        />
        <text x={28} y={bTop + 20} fontSize={12} fontWeight={600} fill={slate} fontFamily={font}>
          B. Split by PD: each server stays in one mode on every step
        </text>

        {rowLabel(bPrefillY, 'Prefill server')}
        {steps.map((s) => cell(`b-p-${s}`, s, bPrefillY, 'prefill'))}
        {rowLabel(bPrefillModeY, 'Mode for all ranks', false)}
        {steps.map((s) => cell(`b-pm-${s}`, s, bPrefillModeY, 'normal'))}

        {rowLabel(bDecodeY, 'Decode server')}
        {steps.map((s) => cell(`b-d-${s}`, s, bDecodeY, 'decode'))}
        {rowLabel(bDecodeModeY, 'Mode for all ranks', false)}
        {steps.map((s) => cell(`b-dm-${s}`, s, bDecodeModeY, 'll'))}
        {rowLabel(bGraphY, 'Decode CUDA graph', false)}
        {steps.map((s) => cell(`b-dg-${s}`, s, bGraphY, 'graphOn'))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tables                                                              */
/* ------------------------------------------------------------------ */

interface BackendRow {
  backend: ReactNode;
  modes: ReactNode;
  auto: string;
  rule: ReactNode;
}

const backendRows: BackendRow[] = [
  {
    backend: (
      <>
        <code>deepep</code> (DeepEP)
      </>
    ),
    modes: (
      <>
        <code>auto</code>, <code>normal</code>, <code>low_latency</code>
      </>
    ),
    auto: 'Switches per step, for the whole EP group',
    rule: (
      <>
        <code>normal</code> turns CUDA graphs off for the server
      </>
    ),
  },
  {
    backend: (
      <>
        <code>mooncake</code> (Mooncake EP)
      </>
    ),
    modes: <code>low_latency</code>,
    auto: 'Fails when the dispatcher is built at model load',
    rule: 'Also an elastic-EP backend',
  },
  {
    backend: (
      <>
        <code>nixl</code> (NIXL-EP)
      </>
    ),
    modes: <code>low_latency</code>,
    auto: 'Fails when the dispatcher is built at model load',
    rule: 'Also an elastic-EP backend',
  },
  {
    backend: (
      <>
        <code>mori</code> (MORI-EP, AMD GPUs)
      </>
    ),
    modes: <code>normal</code>,
    auto: 'Rewritten to normal at startup, logged',
    rule: (
      <>
        Its v2 kernels also map <code>low_latency</code> to <code>normal</code>
      </>
    ),
  },
  {
    backend: (
      <>
        <code>pplx</code> (pplx-kernels)
      </>
    ),
    modes: (
      <>
        <code>low_latency</code>; <code>normal</code> is rejected
      </>
    ),
    auto: 'Rewritten to low_latency at startup, logged',
    rule: (
      <>
        Needs <code>--attn-dp-size</code> of 2 or more and the DeepGEMM runner
      </>
    ),
  },
  {
    backend: <code>flashinfer</code>,
    modes: (
      <>
        <code>--deepep-mode</code> is ignored
      </>
    ),
    auto: 'Not used',
    rule: (
      <>
        Needs <code>--attn-dp-size</code> equal to <code>--tp-size</code>
      </>
    ),
  },
  {
    backend: (
      <>
        <code>deepep_v2</code> (DeepEP v2)
      </>
    ),
    modes: (
      <>
        Own topology flag, <code>--deepep-v2-mode direct</code> or <code>hybrid</code>
      </>
    ),
    auto: 'Not used; layout is picked per batch by phase',
    rule: (
      <>
        <code>direct</code> is single-node NVLink and is rejected above one node; no TBO or SBO
      </>
    ),
  },
];

interface EplbRow {
  flag: ReactNode;
  def: string;
  does: string;
}

const eplbRows: EplbRow[] = [
  {
    flag: <code>--enable-eplb</code>,
    def: 'False',
    does: 'Starts the expert-load recorder and the rebalance cycle; needs EP above 1',
  },
  {
    flag: <code>--eplb-rebalance-num-iterations</code>,
    def: '1000',
    does: 'Forward passes between rebalances. Raise it when rebalances come too often for your traffic',
  },
  {
    flag: <code>--eplb-rebalance-layers-per-chunk</code>,
    def: 'None (all layers at once)',
    does: 'Spreads one rebalance over several forward passes, one chunk of layers per pass',
  },
  {
    flag: <code>--eplb-min-rebalancing-utilization-threshold</code>,
    def: '1.0',
    does: 'Skips a rebalance when recent balance is already above it; at 1.0 nothing is skipped',
  },
  {
    flag: <code>--ep-num-redundant-experts</code>,
    def: '0',
    does: 'Extra expert slots EPLB can fill with copies of hot experts',
  },
  {
    flag: <code>--expert-balancedness-report-mode</code>,
    def: 'off',
    does: 'server_log, prometheus or both: where the per-pass balance figure goes',
  },
];

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export function WideExpertParallelism() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Run a large MoE model across nodes with the right all-to-all mode on each role, and set the load balancer's cadence in the unit the code counts (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            16. Wide Expert Parallelism: DeepEP, EPLB and overlap
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Wide EP (expert parallelism) spreads the experts of a large MoE (mixture of experts)
            model, such as DeepSeek-V3, over many GPUs and usually several nodes. Each GPU holds a
            few experts, and every MoE layer sends each token to the GPUs that own its chosen
            experts and brings the results back. That exchange is an all-to-all collective, and
            running it well is the challenge here: which all-to-all library and mode each server
            runs, how experts move when traffic piles onto a few of them, and how compute hides the
            exchange. SGLang meets it with DeepEP and its sibling backends, EPLB (expert-parallel
            load balancer) and two overlap schemes.
          </Box>
          <Box variant="p">
            The figure to carry through this section:{' '}
            <strong>EPLB rebalances every 1000 forward passes by default</strong>. The
            documentation describes the cadence in requests{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(EP_DOC, 'L244')} kind="doc-code-conflict">
              SGLang docs: Expert Parallelism, workload balancer (v0.5.22 source)
            </Cite>
            ; the v0.5.22 counter ticks once per forward pass{' '}
            <Cite tier={1} href={sglangUrl(EPLB_MGR, 'L72-L94')}>
              eplb_manager.py L72-L94
            </Cite>
            , so the interval follows the server&apos;s step rate rather than its request rate.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict which DeepEP mode every rank runs on a given step, and why a colocated server drops its decode CUDA graphs whenever one rank prefills"
          >
            The EP group moves in lockstep
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            DeepEP, the all-to-all library in SGLang&apos;s documented DeepSeek layouts, has two
            dispatch kernels. Normal mode is built for throughput on prefill batches; low-latency mode is
            built for decode and can be captured in CUDA graphs{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(EP_DOC, 'L73')}>
              SGLang docs: Expert Parallelism (v0.5.22 source)
            </Cite>
            . <code>--deepep-mode</code> takes <code>auto</code>, <code>normal</code> or{' '}
            <code>low_latency</code>, default <code>auto</code>{' '}
            <Cite tier={1} href={sglangUrl(EXEC_FIELDS, 'L835-L838')}>
              exec_.py L835-L838
            </Cite>
            , and <code>auto</code> decides per forward pass: normal when the batch contains any
            prefill (extend) work, low-latency otherwise{' '}
            <Cite tier={1} href={sglangUrl(MOE_UTILS, 'L253-L272')}>
              moe/utils.py L253-L272
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(DEEPEP, 'L1093-L1101')}>
              deepep.py L1093-L1101
            </Cite>
            .
          </Box>
          <Box variant="p">
            All-to-all is a collective, so every rank in the EP group has to make the same choice on
            the same step. Under DP (data parallelism) attention, each attention group runs its own
            batch, so SGLang agrees the choice before the forward pass: the has-prefill bit is a
            maximum over all DP ranks, and the can-run-decode-graph bit is a minimum{' '}
            <Cite tier={1} href={sglangUrl(DP_ATTN, 'L256-L263')}>
              dp_attn.py L256-L263
            </Cite>
            . <strong>
              Under DP attention with <code>--deepep-mode auto</code>, one rank prefilling forces
              DeepEP normal mode and no decode CUDA graph on all ranks for that step.
            </strong>{' '}
            The ranks that were only decoding pay for the prefill on that step. Without DP
            attention every rank runs the same batch, so the group agrees trivially and the mode
            follows the step type that section 4, The Scheduler, composes (our reading).
          </Box>

          <DeepEpModeTimeline />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. Four DP ranks and six steps stand for any EP group; the two
            servers in panel B step independently, and their columns line up only for comparison.
            The mode and graph rows are our reading of DeepEPMode.resolve and the DP-attention sync
            in dp_attn.py.
          </Box>

          <Box variant="p">
            Pinning the mode moves the cost elsewhere. <code>--deepep-mode normal</code> turns CUDA
            graphs off for the whole server, with the log line{' '}
            <code>Cuda graph is disabled because deepep_mode=`normal`</code>{' '}
            <Cite tier={1} href={sglangUrl(MOE_HOOK, 'L319-L334')}>
              moe_hook.py L319-L334
            </Cite>
            , so it belongs on servers that only prefill. Separate prefill and decode servers, the
            subject of section 15, PD Disaggregation, are what let each side keep its own mode, as
            panel B shows (our reading of the same rule).
          </Box>
          <Box variant="p">
            The terms map onto vLLM&apos;s. DeepEP normal mode is the counterpart of vLLM&apos;s{' '}
            <code>deepep_high_throughput</code> all-to-all backend, and low-latency mode of{' '}
            <code>deepep_low_latency</code>. vLLM names the mode inside the backend value{' '}
            <Cite tier={1} href={`${VLLM_CFG}#L44-L58`}>
              vLLM parallel.py L44-L58
            </Cite>
            ; SGLang names the library once with <code>--moe-a2a-backend deepep</code> and picks the
            mode with <code>--deepep-mode</code>, which can switch per step. This dive did not
            compare the two integrations&apos; internals, so read them as counterparts (
            <Link href="../vllm/">vLLM dive, section 9: Distributed Inference</Link>).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Choose --moe-a2a-backend and a --deepep-mode it can start with, and predict the EP width and expert kernel you get"
          >
            Pick the all-to-all backend, then the mode it accepts
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            MoE token exchange is pluggable. <code>--moe-a2a-backend</code> defaults to{' '}
            <code>none</code>, which keeps the MoE layers on all-reduce or all-gather inside the TP
            (tensor parallelism) group; v0.5.22 accepts 12 values, and the ones that matter for
            wide EP swap in all-to-all dispatch and combine: <code>deepep</code>,{' '}
            <code>mooncake</code>, <code>nixl</code> (NIXL-EP, on NIXL, the NVIDIA Inference Xfer
            Library), <code>mori</code>, <code>pplx</code>, <code>flashinfer</code> and{' '}
            <code>deepep_v2</code>{' '}
            <Cite tier={1} href={sglangUrl(EXEC_FIELDS, 'L773-L806')}>
              exec_.py L773-L806
            </Cite>
            . Every all-to-all backend resets EP to the TP width whatever <code>--ep-size</code>{' '}
            says, and logs the change, so <code>--tp 16 --moe-a2a-backend deepep</code> runs EP 16{' '}
            <Cite tier={1} href={sglangUrl(OVERRIDES, 'L1529-L1572')}>
              overrides.py L1529-L1572
            </Cite>
            . Section 14, Parallelism, counts the GPUs that launch uses.
          </Box>
          <Box variant="p">
            The expert kernel is a separate choice, <code>--moe-runner-backend</code>, default{' '}
            <code>auto</code>{' '}
            <Cite tier={1} href={sglangUrl(EXEC_FIELDS, 'L821-L828')}>
              exec_.py L821-L828
            </Cite>
            . On an FP8 (8-bit floating point) MoE checkpoint, <code>auto</code> runs DeepGEMM grouped GEMMs (general
            matrix multiplications) when the all-to-all backend is DeepEP, Mooncake EP or NIXL-EP
            and JIT (just-in-time) DeepGEMM is enabled, and Triton fused MoE on CUDA when it is not{' '}
            <Cite tier={1} href={sglangUrl(FP8, 'L1409-L1432')}>
              fp8.py L1409-L1432
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(FP8, 'L2836-L2848')}>
              fp8.py L2836-L2848
            </Cite>
            .
          </Box>
          <Box variant="p">
            Each backend accepts its own set of DeepEP modes, and starting a server means picking one
            it supports:
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'backend', header: '--moe-a2a-backend', cell: (r: BackendRow) => r.backend },
              { id: 'modes', header: 'Modes it runs', cell: (r: BackendRow) => r.modes },
              { id: 'auto', header: 'What --deepep-mode auto does', cell: (r: BackendRow) => r.auto },
              { id: 'rule', header: 'Other launch rule', cell: (r: BackendRow) => r.rule },
            ]}
            items={backendRows}
          />
          <Box variant="small" color="text-body-secondary">
            Read from source:{' '}
            <Cite tier={1} href={sglangUrl(MOE_HOOK, 'L276-L372')} kind="code">
              moe_hook.py L276-L372
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MOE_HOOK, 'L407-L534')} kind="code">
              moe_hook.py L407-L534
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(EXEC_FIELDS, 'L813-L820')}>
              exec_.py L813-L820
            </Cite>
            , and the dispatchers cited below.
          </Box>
          <Box variant="p">
            The documentation says the DeepEP and Mooncake backends support both modes, and
            recommends <code>--deepep-mode auto</code>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(EP_DOC, 'L73')} kind="doc-code-conflict">
              SGLang docs: Expert Parallelism, dispatch modes (v0.5.22 source)
            </Cite>
            . v0.5.22&apos;s Mooncake EP and NIXL-EP dispatchers raise{' '}
            <code>NotImplementedError</code> whenever normal mode is enabled, and <code>auto</code>{' '}
            enables it, so the default fails as the model loads{' '}
            <Cite tier={1} href={sglangUrl(MOONCAKE, 'L331-L344')}>
              mooncake.py L331-L344
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(NIXL, 'L476-L482')}>
              nixl.py L476-L482
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MOE_UTILS, 'L258-L262')}>
              moe/utils.py L258-L262
            </Cite>
            . Set <code>--deepep-mode low_latency</code> for both.
          </Box>
          <ExpandableSection headerText="Why auto reaches the Mooncake EP and NIXL-EP dispatchers unchanged">
            <SpaceBetween size="s">
              <Box variant="p">
                SGLang rewrites <code>auto</code> at startup for some backends: MORI gets{' '}
                <code>normal</code> and PPLX gets <code>low_latency</code>, each with a log line{' '}
                <Cite tier={1} href={sglangUrl(MOE_HOOK, 'L467-L511')}>
                  moe_hook.py L467-L511
                </Cite>
                . Our search of the v0.5.22 argument hooks found no such rewrite for{' '}
                <code>mooncake</code> or <code>nixl</code>, and the MoE layer passes the configured
                mode straight to the dispatcher it builds{' '}
                <Cite tier={1} href={sglangUrl(MOE_LAYER, 'L162-L197')} kind="code">
                  fused_moe_triton/layer.py L162-L197
                </Cite>
                .
              </Box>
              <Box variant="p">
                The in-tree elastic-EP recovery test launches Mooncake EP with{' '}
                <code>--deepep-mode low_latency</code>{' '}
                <Cite tier={1} href={sglangUrl(ELASTIC_TEST, 'L83-L90')}>
                  test_elastic_recover.py L83-L90
                </Cite>
                ; that test was read, not run. For NIXL-EP the documentation agrees with the code
                that it runs in low-latency mode; its general advice to use <code>auto</code> is
                the part that fails.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Turn on the load balancer, set its cadence in forward passes, and watch the balance figure and the stall each move costs"
          >
            EPLB: move hot experts on a cadence you set
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Routing in an MoE model is uneven: some experts draw more tokens than others, so the
            GPUs holding them do more work in each MoE layer while the rest wait at the collective
            (our reading). EPLB records how many
            tokens each expert receives and periodically moves experts between EP ranks; with{' '}
            <code>--ep-num-redundant-experts N</code> it can also place copies of hot experts. It is
            off by default{' '}
            <Cite tier={1} href={sglangUrl(EXEC_FIELDS, 'L851-L879')}>
              exec_.py L851-L879
            </Cite>
            .
          </Box>
          <Box variant="p">
            <code>--enable-eplb</code> alone starts it. It sets the expert-distribution recorder to{' '}
            <code>stat</code> and the dispatch algorithm to <code>static</code>, or{' '}
            <code>dynamic</code> with <code>--moe-a2a-backend none</code>, and it is rejected
            without EP above 1{' '}
            <Cite tier={1} href={sglangUrl(PAR_HOOK, 'L689-L731')}>
              parallel_hook.py L689-L731
            </Cite>
            . The solver defaults to DeepSeek&apos;s EPLB, in its hierarchical form (expert groups to
            nodes, then experts to GPUs) when the model&apos;s expert groups divide evenly by the node
            count{' '}
            <Cite tier={1} href={sglangUrl(EPLB_ALGOS, 'L75-L87')}>
              eplb_algorithms/__init__.py L75-L87
            </Cite>
            ; elastic EP switches it to an elasticity-aware variant{' '}
            <Cite tier={1} href={sglangUrl(PAR_HOOK, 'L496-L513')}>
              parallel_hook.py L496-L513
            </Cite>
            .
          </Box>
          <Box variant="p">
            The documentation says to configure periodic rebalancing &quot;e.g., every 1000
            requests&quot;{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(EP_DOC, 'L244')} kind="doc-code-conflict">
              SGLang docs: Expert Parallelism, workload balancer (v0.5.22 source)
            </Cite>
            . v0.5.22&apos;s code counts forward passes: the model runner ticks the manager once at
            the end of every forward pass on CUDA GPUs, and the manager rebalances after{' '}
            <code>--eplb-rebalance-num-iterations</code> ticks{' '}
            <Cite tier={1} href={sglangUrl(EPLB_MGR, 'L72-L94')}>
              eplb_manager.py L72-L94
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MODEL_RUNNER, 'L1865-L1867')}>
              model_runner.py L1865-L1867
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(EXEC_FIELDS, 'L861-L863')}>
              exec_.py L861-L863
            </Cite>
            . So set the flag in steps. <strong>EPLB rebalances every 1000 forward passes</strong>,
            and the interval in seconds is 1000 divided by your server&apos;s forward passes per
            second: at a few hundred passes a second, every few seconds (our arithmetic).
          </Box>
          <Table
            variant="embedded"
            wrapLines
            header={<Header variant="h3">The EPLB knobs</Header>}
            columnDefinitions={[
              { id: 'flag', header: 'Flag', cell: (r: EplbRow) => r.flag },
              { id: 'def', header: 'Default', cell: (r: EplbRow) => r.def },
              { id: 'does', header: 'What it does', cell: (r: EplbRow) => r.does },
            ]}
            items={eplbRows}
          />
          <Box variant="small" color="text-body-secondary">
            Defaults from{' '}
            <Cite tier={1} href={sglangUrl(EXEC_FIELDS, 'L851-L883')}>
              exec_.py L851-L883
            </Cite>
            ; chunking from{' '}
            <Cite tier={1} href={sglangUrl(EPLB_MGR, 'L144-L177')}>
              eplb_manager.py L144-L177
            </Cite>
            ; the skip check from{' '}
            <Cite tier={1} href={sglangUrl(EPLB_MGR, 'L225-L238')}>
              eplb_manager.py L225-L238
            </Cite>
            .
          </Box>
          <Box variant="p">
            The balance figure is the mean over the maximum of tokens per GPU, averaged over MoE
            layers, so 1.0 is perfectly even{' '}
            <Cite tier={1} href={sglangUrl(EXPERT_DIST, 'L1153-L1168')} kind="code">
              expert_distribution.py L1153-L1168
            </Cite>
            . The skip threshold compares its average over a recent window against{' '}
            <code>--eplb-min-rebalancing-utilization-threshold</code>, and at the default 1.0 the
            window is never tracked, so every cycle moves experts{' '}
            <Cite tier={1} href={sglangUrl(EXPERT_DIST, 'L1012-L1034')} kind="code">
              expert_distribution.py L1012-L1034
            </Cite>
            . Set it below 1.0 to skip moves when the load is already even.
          </Box>
          <Box variant="p">
            Watch it in two places. The log prints <code>[EPLBManager] rebalance start</code> and,
            when the move is not chunked, <code>rebalance end time=...s</code>, the time that
            rebalance spent{' '}
            <Cite tier={1} href={sglangUrl(EPLB_MGR, 'L115-L185')}>
              eplb_manager.py L115-L185
            </Cite>
            ; compare it with your ITL (inter-token latency) budget, and chunk the move with{' '}
            <code>--eplb-rebalance-layers-per-chunk</code> if it does not fit.{' '}
            <code>--expert-balancedness-report-mode prometheus</code>, with{' '}
            <code>--enable-metrics</code>, exports <code>sglang:eplb_balancedness</code>, labelled
            by forward mode, from EP rank 0{' '}
            <Cite tier={1} href={sglangUrl(METRICS, 'L993-L998')} kind="code">
              metrics_collector.py L993-L998
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(METRICS_REPORTER, 'L1167-L1172')} kind="code">
              metrics_reporter.py L1167-L1172
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="The one platform where the counter skips passes">
            <Box variant="p">
              The tick is gated by <code>should_advance_eplb_counter</code>, which returns true on
              every pass except in one configuration on ROCm (AMD&apos;s GPU software stack): the{' '}
              <code>megamoe</code> all-to-all backend with two <code>SGLANG_AITER_MEGA_*</code>{' '}
              environment variables set, where only passes that contain prefill count{' '}
              <Cite tier={1} href={sglangUrl(EXPERT_DIST, 'L65-L104')} kind="code">
                expert_distribution.py L65-L104
              </Cite>
              . Draft models in speculative decoding get no EPLB manager{' '}
              <Cite tier={1} href={sglangUrl(MODEL_RUNNER, 'L769-L780')} kind="code">
                model_runner.py L769-L780
              </Cite>
              , so only the target model&apos;s passes tick it.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Hide the all-to-all behind compute, after checking that your model has a two-batch strategy"
          >
            Overlap: two batches or one
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            TBO (two-batch overlap), <code>--enable-two-batch-overlap</code>, default off, splits a
            batch into two micro-batches and runs one&apos;s attention while the other&apos;s tokens
            are in dispatch or combine{' '}
            <Cite tier={1} href={sglangUrl(EXEC_FIELDS, 'L967-L970')}>
              exec_.py L967-L970
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(EP_DOC, 'L218-L233')}>
              SGLang docs: Two-Batch Overlap (v0.5.22 source)
            </Cite>
            . It is the counterpart of vLLM&apos;s DBO (dual-batch overlap,{' '}
            <code>--enable-dbo</code>){' '}
            <Cite tier={1} href={`${VLLM_CFG}#L228`}>
              vLLM parallel.py L228
            </Cite>
            ; this dive did not compare the two implementations. The documentation&apos;s &quot;up
            to 2x throughput&quot; is a project claim that points at the LMSYS blog below.
          </Box>
          <Box variant="p">
            TBO is model-specific. It needs an operation strategy for the model&apos;s decoder layer,
            and v0.5.22 has them for DeepSeek V2 and V3, DeepSeek-V4, Qwen3 MoE and MiMo V2; any
            other layer raises <code>NotImplementedError</code>{' '}
            <Cite tier={1} href={sglangUrl(OPS_STRATEGY, 'L33-L76')}>
              operations_strategy.py L33-L76
            </Cite>
            . Two startup checks bound it: <code>deepep_v2</code> rejects both overlap flags{' '}
            <Cite tier={1} href={sglangUrl(MOE_HOOK, 'L356-L361')}>
              moe_hook.py L356-L361
            </Cite>
            , and without an all-to-all backend TBO requires attention DP{' '}
            <Cite tier={1} href={sglangUrl(VALIDATION_HOOK, 'L691-L707')}>
              validation_hook.py L691-L707
            </Cite>
            .
          </Box>
          <Box variant="p">
            One long prompt still overlaps. When the best split at a sequence boundary leaves either
            half with less than 48% of the tokens, TBO cuts one sequence across both micro-batches;{' '}
            <code>--tbo-token-distribution-threshold</code> sets that 0.48, and 0 turns the cut off{' '}
            <Cite tier={1} href={sglangUrl(EXEC_FIELDS, 'L974-L977')}>
              exec_.py L974-L977
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(TBO, 'L102-L132')}>
              two_batch_overlap.py L102-L132
            </Cite>
            .
          </Box>
          <Box variant="p">
            SBO (single-batch overlap), <code>--enable-single-batch-overlap</code>, default off, is
            the lighter scheme: it keeps one batch and hides communication behind work in the same
            batch through dispatcher hooks, for example the shared experts&apos; compute during
            DeepEP&apos;s combine{' '}
            <Cite tier={1} href={sglangUrl(EXEC_FIELDS, 'L971-L973')}>
              exec_.py L971-L973
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(EP_DOC, 'L235-L237')}>
              SGLang docs: Single-Batch Overlap (v0.5.22 source)
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Keep a wide-EP deployment serving through a failed rank, or grow it at runtime, with the launch checks it must pass"
          >
            Elastic EP: lose a rank without a restart
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Elastic EP lets a wide-EP deployment rejoin a failed rank (
            <code>--elastic-ep-join-mode recover</code>) or grow at runtime (<code>scale</code>)
            without a restart, on Mooncake or NIXL collectives chosen with{' '}
            <code>--elastic-ep-backend</code>, default none{' '}
            <Cite tier={1} href={sglangUrl(EXEC_FIELDS, 'L888-L917')}>
              exec_.py L888-L917
            </Cite>
            . PP (pipeline parallelism) must be 1. Runtime scale-up adds more checks:{' '}
            <code>--max-ep-size</code> above the TP width to preallocate room, attention DP equal to
            TP and EP equal to TP, <code>--elastic-ep-backend mooncake</code> with{' '}
            <code>--moe-a2a-backend nixl</code>, and the joining group at{' '}
            <code>--node-rank 1</code> with <code>--elastic-ep-join-rank-offset</code> set to the
            current EP size{' '}
            <Cite tier={1} href={sglangUrl(PAR_HOOK, 'L496-L686')}>
              parallel_hook.py L496-L686
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(PAR_FIELDS, 'L284-L302')}>
              parallel.py L284-L302
            </Cite>
            .
          </Box>
          <Box variant="p">
            When the all-to-all backend is Mooncake EP or NIXL-EP, the low-latency-only rule above
            applies: launch with <code>--deepep-mode low_latency</code>, as the in-tree recovery
            test does with Mooncake EP{' '}
            <Cite tier={1} href={sglangUrl(ELASTIC_TEST, 'L83-L90')}>
              test_elastic_recover.py L83-L90
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Lay out prefill and decode servers so each keeps its own DeepEP mode, then carry a vLLM layout over by GPU count"
          >
            The recipe: PD first, one DeepEP mode per role
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Against vLLM:</strong> attention DP is a width inside SGLang&apos;s TP group and
            EP spans that group, while vLLM&apos;s DP attention is <code>--data-parallel-size</code>{' '}
            replicas plus <code>--enable-expert-parallel</code>, with the MoE layers sharded over TP
            x DP{' '}
            <Cite tier={1} href={`${VLLM_CFG}#L134-L136`}>
              vLLM parallel.py L134-L136
            </Cite>
            . Translate configs by GPU count, not flag name (
            <Link href="../vllm/">vLLM dive, section 9: Distributed Inference</Link>).
          </Box>
          <ExpandableSection headerText="What the PD plus wide-EP stack was built for: the LMSYS 96-H100 deployment (project claim, May 2025)">
            <SpaceBetween size="s">
              <Box variant="p">
                LMSYS (Large Model Systems Organization) reports, in a May 2025 post by the SGLang
                team on an older SGLang release, DeepSeek-V3 on 96 H100 GPUs across 12 nodes with
                PD (prefill/decode) disaggregation and large-scale EP: 52.3k input and 22.3k output
                tokens per second per node for 2,000-token inputs, up to 5x the output throughput
                of vanilla TP on the same resources, and a cost the post puts at $0.20 per million
                output tokens{' '}
                <Cite tier={2} href={LMSYS_EP}>
                  LMSYS blog, 2025-05-05 (project claim)
                </Cite>
                . Prefill was measured on 4 nodes (EP32) and decode on 9 nodes (EP72), as separate
                measurements.
              </Box>
              <Box variant="p">
                The post states its limits: TTFT (time to first token) of 2 to 5 seconds and ITL
                around 100 ms, a throughput setting; short sequences; in-distribution data for EPLB;
                and Hopper GPUs only. v0.5.22 adds a FlashInfer MegaMoE all-to-all that requires
                SM100 (compute capability 10.0, Blackwell){' '}
                <Cite tier={1} href={sglangUrl(MOE_HOOK, 'L285-L291')}>
                  moe_hook.py L285-L291
                </Cite>
                . The post also gives the reason for PD here: DeepEP&apos;s auto mode &quot;cannot
                simultaneously support both normal dispatch (for prefill) and low-latency dispatch
                (for decode)&quot; in one communication group. At v0.5.22, auto switches per step,
                but the whole group switches together, which is the lockstep above.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            The documented DeepSeek multi-node PD recipe runs both roles on two nodes with{' '}
            <code>--tp-size 16 --attn-dp-size 8 --moe-a2a-backend deepep</code> and leaves{' '}
            <code>--deepep-mode</code> at <code>auto</code>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(PD_DOC, 'L174-L238')}>
              SGLang docs: PD Disaggregation, DeepSeek multi-node (v0.5.22 source)
            </Cite>
            . By our reading of the auto rule, its prefill steps then resolve to normal and its
            decode steps to low-latency on their own. Pinning the modes writes that into the launch
            line, with <code>normal</code> on prefill only because it turns CUDA graphs off:
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{PD_EP_LAUNCH}</pre>
          <Box variant="small" color="text-body-secondary">
            The documented layout with the modes pinned. The bootstrap, transfer-backend and gateway
            flags come from section 15, PD Disaggregation.
          </Box>
          <Box variant="p">
            DeepEP normal on prefill servers and low-latency on decode servers is why PD and wide EP
            are deployed together: each side stays in its own DeepEP mode (our reading of the
            lockstep rule). In order, from there:
          </Box>
          <Box variant="p">
            <strong>1.</strong> Bring up the PD pair from section 15 with an all-to-all backend on
            both roles, and count GPUs with section 14&apos;s rule.{' '}
            <strong>2.</strong> On Mooncake EP or NIXL-EP, pass <code>--deepep-mode low_latency</code>{' '}
            on both roles. <strong>3.</strong> Add <code>--enable-eplb</code> with{' '}
            <code>--expert-balancedness-report-mode prometheus</code>, read{' '}
            <code>sglang:eplb_balancedness</code>, and size{' '}
            <code>--eplb-rebalance-num-iterations</code> in steps:{' '}
            <strong>the default rebalances every 1000 forward passes</strong>.{' '}
            <strong>4.</strong> Turn on <code>--enable-two-batch-overlap</code> if your model has a
            TBO strategy. <strong>5.</strong> For the transport underneath, including DeepEP over
            EFA (Elastic Fabric Adapter) on AWS, continue to section 22, PD and Wide EP over EFA.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
