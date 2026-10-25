import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangTreeUrl, sglangDocsSrcUrl } from '../components/Cite';

const MEMORY_HOOK = 'python/sglang/srt/arg_groups/memory_hook.py';
const PIPELINE = 'python/sglang/srt/arg_groups/pipeline.py';
const OVERRIDES = 'python/sglang/srt/arg_groups/overrides.py';
const MODEL_BASE = 'python/sglang/srt/arg_groups/model_override_base.py';
const SPEC_HOOK = 'python/sglang/srt/arg_groups/speculative_hook.py';
const SCHED_FIELDS = 'python/sglang/srt/arg_groups/fields/schedule.py';
const OBS_FIELDS = 'python/sglang/srt/arg_groups/fields/observability.py';
const KV_CONF = 'python/sglang/srt/mem_cache/kv_cache_configurator.py';
const KV_DTYPE = 'python/sglang/srt/mem_cache/kv_cache_dtype.py';
const MEMORY_POOL = 'python/sglang/srt/mem_cache/memory_pool.py';
const RADIX = 'python/sglang/srt/mem_cache/radix_cache.py';
const PAGED_ALLOC = 'python/sglang/srt/mem_cache/allocator/paged.py';
const POOL_CONF = 'python/sglang/srt/model_executor/pool_configurator.py';
const GRAPH_RUNNER = 'python/sglang/srt/model_executor/runner/decode_cuda_graph_runner.py';
const MODEL_CONFIG = 'python/sglang/srt/configs/model_config.py';
const SCHEDULER = 'python/sglang/srt/managers/scheduler.py';
const POLICY = 'python/sglang/srt/managers/schedule_policy.py';
const POOL_STATS = 'python/sglang/srt/managers/scheduler_components/pool_stats_observer.py';
const COLLECTOR = 'python/sglang/srt/observability/metrics_collector.py';
const ENGINE = 'python/sglang/srt/entrypoints/engine.py';
const HTTP_SERVER = 'python/sglang/srt/entrypoints/http_server.py';
const COMMON = 'python/sglang/srt/utils/common.py';
const ENVIRON = 'python/sglang/srt/environ.py';
const SERVER_ARGS_DOC = 'advanced_features/server_arguments';
const TUNING_DOC = 'advanced_features/hyperparameter_tuning';
const BACKEND_DOC = 'advanced_features/attention_backend';

/** Qwen3-8B on Hugging Face, pinned to the commit read on 2026-10-24. */
const QWEN_REV = 'b968826d9c46dd6066d109eabc6255188de91218';
const QWEN_CONFIG = `https://huggingface.co/Qwen/Qwen3-8B/blob/${QWEN_REV}/config.json`;
const QWEN_INDEX = `https://huggingface.co/Qwen/Qwen3-8B/blob/${QWEN_REV}/model.safetensors.index.json`;
const EC2_SPECS = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';
const VLLM_CACHE = 'https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/cache.py#L103';

const VLLM_OPS_LINK = (
  <Link href="../vllm/">vLLM dive, section 27: Operations &amp; Failure Modes</Link>
);
const VLLM_PAGED_LINK = (
  <Link href="../vllm/">vLLM dive, section 5: Paged KV Cache &amp; Block Tables</Link>
);

/* ------------------------------------------------------------------------ */
/* Diagram: the GPU memory bar, H100 and B200 on one scale                  */
/* ------------------------------------------------------------------------ */

/** 4 viewBox units per GiB, so the two bars compare by length. */
const GIB = 4;
const X0 = 40;

interface Segment {
  w: number;
  cls: 'w' | 'kv' | 'ns';
  l1: string;
  l2: string;
}

/** Widths in GiB from the worked example; labels written out so no rounding surprises. */
const H100_BAR: Segment[] = [
  { w: 15.26 * GIB, cls: 'w', l1: '15.3', l2: 'GiB' },
  {
    w: 50.85 * GIB,
    cls: 'kv',
    l1: 'KV pool 50.9 GiB',
    l2: 'about 370,000 tokens',
  },
  { w: 13.54 * GIB, cls: 'ns', l1: '13.5', l2: 'GiB' },
];
const B200_BAR: Segment[] = [
  { w: 15.26 * GIB, cls: 'w', l1: '15.3', l2: 'GiB' },
  {
    w: 137.61 * GIB,
    cls: 'kv',
    l1: 'KV pool 137.6 GiB',
    l2: 'about 1,000,000 tokens',
  },
  { w: 26.13 * GIB, cls: 'ns', l1: '26.1', l2: 'GiB' },
];

function MemoryBar({ segs, y }: { segs: Segment[]; y: number }) {
  let x = X0;
  return (
    <g>
      {segs.map((s, i) => {
        const left = x;
        x += s.w;
        const cx = left + s.w / 2;
        const big = s.cls === 'kv';
        return (
          <g key={i}>
            <rect x={left} y={y} width={s.w} height={50} className={`kvmem-bar-${s.cls}`} />
            <text x={cx} y={y + 22} className={big ? 'kvmem-bar-kvt' : `kvmem-bar-${s.cls}t`}>
              {s.l1}
            </text>
            <text x={cx} y={y + 39} className={big ? 'kvmem-bar-kvs' : `kvmem-bar-${s.cls}t`}>
              {s.l2}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function Bracket({ x2, y, label }: { x2: number; y: number; label: string }) {
  return (
    <g>
      <text x={(X0 + x2) / 2} y={y - 8} className="kvmem-bar-br">
        {label}
      </text>
      <path d={`M ${X0} ${y + 8} V ${y} H ${x2} V ${y + 8}`} className="kvmem-bar-brl" />
    </g>
  );
}

function GpuMemoryBarDiagram() {
  const h100Static = X0 + (15.26 + 50.85) * GIB;
  const b200Static = X0 + (15.26 + 137.61) * GIB;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 820 400"
        role="img"
        aria-labelledby="kvmem-bar-title"
        aria-describedby="kvmem-bar-desc"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="kvmem-bar-title">
          The same model on two GPUs. SGLang loads the 15.3 GiB of Qwen3-8B weights, holds back a
          non-static share for activations and CUDA graphs, and gives the rest to the KV pool.
          mem_fraction_static covers the weights plus the KV pool: 0.830 on an H100 leaves room for
          about 370,000 tokens and 0.854 on a B200 for about 1,000,000, because the weights are a
          fixed charge. The attention backend sets the page size: 1 token with fa3 on the H100, 64
          tokens with trtllm_mha on the B200.
        </title>
        <desc id="kvmem-bar-desc">
          Both bars use one scale of 4 units per GiB. The figures are arithmetic on the v0.5.22 code
          formula with assumed GPU totals, at TP 1 with a BF16 KV cache, and are upper bounds.
        </desc>
        <style>{`
          .kvmem-bar-bg { fill: #ffffff; }
          .kvmem-bar-row { fill: #16191f; font: 600 13px sans-serif; }
          .kvmem-bar-w { fill: #414d5c; stroke: #ffffff; stroke-width: 1; }
          .kvmem-bar-kv { fill: #0972d3; stroke: #ffffff; stroke-width: 1; }
          .kvmem-bar-ns { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .kvmem-bar-wt { fill: #ffffff; font: 600 12px sans-serif; text-anchor: middle; }
          .kvmem-bar-kvt { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
          .kvmem-bar-kvs { fill: #ffffff; font: 12px sans-serif; text-anchor: middle; }
          .kvmem-bar-nst { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .kvmem-bar-br { fill: #065299; font: 600 12px sans-serif; text-anchor: middle; }
          .kvmem-bar-brl { fill: none; stroke: #065299; stroke-width: 1.5; }
          .kvmem-bar-note { fill: #f2f8fd; stroke: #879596; stroke-width: 1; }
          .kvmem-bar-nt { fill: #0f1b2a; font: 600 13px sans-serif; }
          .kvmem-bar-ns2 { fill: #414d5c; font: 12px sans-serif; }
          .kvmem-bar-lgt { fill: #16191f; font: 600 12px sans-serif; }
          .kvmem-bar-lgs { fill: #5f6b7a; font: 12px sans-serif; }
        `}</style>
        <rect x={0} y={0} width={820} height={400} rx={8} className="kvmem-bar-bg" />

        <text x={X0} y={28} className="kvmem-bar-row">
          P5: one H100, 81,559 MiB assumed (79.6 GiB)
        </text>
        <Bracket x2={h100Static} y={58} label="mem_fraction_static = 0.830" />
        <MemoryBar segs={H100_BAR} y={70} />
        <rect x={400} y={70} width={380} height={50} rx={6} className="kvmem-bar-note" />
        <text x={414} y={90} className="kvmem-bar-nt">
          fa3 backend: page size 1
        </text>
        <text x={414} y={109} className="kvmem-bar-ns2">
          a cached prefix is reused to the exact token
        </text>

        <text x={X0} y={160} className="kvmem-bar-row">
          P6-B200: one B200, 183,296 MiB assumed (179 GiB)
        </text>
        <Bracket x2={b200Static} y={190} label="mem_fraction_static = 0.854" />
        <MemoryBar segs={B200_BAR} y={202} />
        <rect x={X0} y={264} width={716} height={50} rx={6} className="kvmem-bar-note" />
        <text x={54} y={284} className="kvmem-bar-nt">
          trtllm_mha backend: page size 64
        </text>
        <text x={54} y={303} className="kvmem-bar-ns2">
          a cached prefix is reused in whole 64-token pages; a prompt under 64 tokens is never
          cached
        </text>

        <rect x={40} y={336} width={14} height={14} className="kvmem-bar-w" />
        <text x={62} y={348} className="kvmem-bar-lgt">
          Weights
        </text>
        <text x={62} y={366} className="kvmem-bar-lgs">
          Qwen3-8B in BF16: 15.3 GiB,
        </text>
        <text x={62} y={382} className="kvmem-bar-lgs">
          the same charge on any GPU
        </text>

        <rect x={300} y={336} width={14} height={14} className="kvmem-bar-kv" />
        <text x={322} y={348} className="kvmem-bar-lgt">
          KV pool
        </text>
        <text x={322} y={366} className="kvmem-bar-lgs">
          what is left once weights load,
        </text>
        <text x={322} y={382} className="kvmem-bar-lgs">
          at 144 KiB per token
        </text>

        <rect x={560} y={336} width={14} height={14} className="kvmem-bar-ns" />
        <text x={582} y={348} className="kvmem-bar-lgt">
          Non-static share
        </text>
        <text x={582} y={366} className="kvmem-bar-lgs">
          (1 - fraction) of pre-load memory,
        </text>
        <text x={582} y={382} className="kvmem-bar-lgs">
          for activations and graphs
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Tables                                                                   */
/* ------------------------------------------------------------------------ */

interface ExampleRow {
  id: string;
  item: ReactNode;
  h100: ReactNode;
  b200: ReactNode;
  src: ReactNode;
}

const EXAMPLE_ROWS: ExampleRow[] = [
  {
    id: 'gpu',
    item: 'GPU memory SGLang sees (assumed)',
    h100: '81,559 MiB (79.6 GiB)',
    b200: '183,296 MiB (179 GiB)',
    src: (
      <Cite tier={1} href={EC2_SPECS}>
        EC2 accelerated computing specs (8 x 80 GiB, 8 x 179 GiB)
      </Cite>
    ),
  },
  {
    id: 'chunk',
    item: (
      <>
        <code>chunked_prefill_size</code>
      </>
    ),
    h100: '8192',
    b200: '16384',
    src: (
      <Cite tier={1} href={sglangUrl(MEMORY_HOOK, 'L89-L180')} kind="code">
        memory_hook.py L89-L180
      </Cite>
    ),
  },
  {
    id: 'maxbs',
    item: 'Decode CUDA-graph max batch, TP 1',
    h100: '256',
    b200: '512',
    src: (
      <Cite tier={1} href={sglangUrl(MEMORY_HOOK, 'L89-L180')} kind="code">
        memory_hook.py L89-L180
      </Cite>
    ),
  },
  {
    id: 'reserve',
    item: 'Reserve for activations and graphs',
    h100: '13,904 MiB (13.6 GiB)',
    b200: '26,832 MiB (26.2 GiB)',
    src: (
      <Cite tier={1} href={sglangUrl(MEMORY_HOOK, 'L300-L330')} kind="code">
        memory_hook.py L300-L330
      </Cite>
    ),
  },
  {
    id: 'frac',
    item: (
      <>
        <code>mem_fraction_static</code>
      </>
    ),
    h100: '0.830',
    b200: '0.854',
    src: (
      <Cite tier={1} href={sglangUrl(MEMORY_HOOK, 'L325-L330')} kind="code">
        memory_hook.py L325-L330
      </Cite>
    ),
  },
  {
    id: 'ns',
    item: 'Non-static share, (1 - fraction) of GPU memory',
    h100: '13.5 GiB',
    b200: '26.1 GiB',
    src: (
      <Cite tier={1} href={sglangUrl(KV_CONF, 'L2671-L2741')} kind="code">
        kv_cache_configurator.py L2671-L2741
      </Cite>
    ),
  },
  {
    id: 'kv',
    item: 'KV pool, at most',
    h100: '50.9 GiB',
    b200: '137.6 GiB',
    src: (
      <Cite tier={1} href={sglangUrl(KV_CONF, 'L2671-L2741')} kind="code">
        kv_cache_configurator.py L2671-L2741
      </Cite>
    ),
  },
  {
    id: 'tokens',
    item: (
      <>
        <code>max_total_num_tokens</code>, BF16 KV, at most
      </>
    ),
    h100: 'about 370,000',
    b200: 'about 1,000,000',
    src: (
      <Cite tier={1} href={sglangUrl(POOL_CONF, 'L614-L624')} kind="code">
        pool_configurator.py L614-L624
      </Cite>
    ),
  },
  {
    id: 'fp8',
    item: 'The same with an FP8 KV cache',
    h100: 'about 740,000',
    b200: 'about 2,000,000',
    src: 'Section 9 covers the dtype',
  },
  {
    id: 'backend',
    item: 'Attention backend, page size',
    h100: (
      <>
        <code>fa3</code>, 1
      </>
    ),
    b200: (
      <>
        <code>trtllm_mha</code>, 64
      </>
    ),
    src: (
      <Cite tier={1} href={sglangUrl(MODEL_BASE, 'L293-L324')} kind="code">
        model_override_base.py L293-L324
      </Cite>
    ),
  },
];

interface TierRow {
  id: string;
  mem: string;
  chunk: string;
  bs: string;
  ec2: string;
}

const TIER_ROWS: TierRow[] = [
  { id: 't1', mem: 'Under 20 GiB', chunk: '2048', bs: '8 / 8', ec2: '-' },
  {
    id: 't2',
    mem: '20 to 35 GiB',
    chunk: '4096',
    bs: '48 / 160',
    ec2: 'A10G (G5) and L4 (G6), 22 GiB; RTX PRO 4500 (G7), 32 GiB',
  },
  {
    id: 't3',
    mem: '35 to 60 GiB',
    chunk: '4096',
    bs: '32 / 160',
    ec2: 'A100 40 GB (P4d), 40 GiB; L40S (G6e), 44 GiB',
  },
  {
    id: 't4',
    mem: '60 to 90 GiB',
    chunk: '8192',
    bs: '256 / 512',
    ec2: 'A100 80 GB (P4de) and H100 (P5), 80 GiB',
  },
  {
    id: 't5',
    mem: '90 to 160 GiB',
    chunk: '8192',
    bs: '256 / 512',
    ec2: 'RTX PRO 6000 (G7e), 96 GiB; H200 (P5e, P5en), 141 GiB',
  },
  {
    id: 't6',
    mem: '160 GiB and up',
    chunk: '16384',
    bs: '512 / 512',
    ec2: 'B200 (P6-B200 179 GiB, P6e-GB200 185 GiB); B300 (P6-B300), 268 GiB',
  },
  {
    id: 't7',
    mem: 'Not detected',
    chunk: '4096',
    bs: '160 / 160',
    ec2: 'Only when the memory query returns no size',
  },
];

interface PageRow {
  id: string;
  backend: ReactNode;
  page: string;
  when: string;
}

const PAGE_ROWS: PageRow[] = [
  {
    id: 'one',
    backend: (
      <>
        <code>fa3</code>, <code>flashinfer</code>, <code>triton</code>
      </>
    ),
    page: '1 (the default stands)',
    when: 'fa3: the MHA and GQA default on Hopper. flashinfer: the default on Ampere, Ada and SM120 (compute capability 12.0, the RTX Blackwell GPUs in G7e and G7)',
  },
  {
    id: 'trtmha',
    backend: <code>trtllm_mha</code>,
    page: '16, 32, 64 or 128 accepted; any other value becomes 64',
    when: 'MHA and GQA default on SM100 and SM103 with speculative decoding off, or on with --speculative-eagle-topk 1 and --speculative-num-steps set',
  },
  {
    id: 'fa4',
    backend: <code>fa4</code>,
    page: '128 on SM100 and SM103 for non-MLA models, unless EAGLE topk is above 1',
    when: 'SM100 and SM103 default when K and V head widths differ, under the same speculation condition',
  },
  {
    id: 'mla',
    backend: (
      <>
        <code>flashmla</code>; <code>trtllm_mla</code>, <code>cutedsl_mla</code>,{' '}
        <code>tokenspeed_mla</code>
      </>
    ),
    page: '64; 32 or 64 accepted, any other value becomes 64',
    when: 'MLA models (section 8 has the per-model choice)',
  },
  {
    id: 'hpc',
    backend: <code>hpc_ops</code>,
    page: '64',
    when: 'Opt-in',
  },
  {
    id: 'xpu',
    backend: <code>intel_xpu</code>,
    page: '64 or 128 (also 16 or 32 for MLA); any other value becomes 128',
    when: 'Intel GPUs',
  },
];

interface KnobRow {
  id: string;
  knob: ReactNode;
  def: ReactNode;
  moves: string;
  where: string;
}

const KNOB_ROWS: KnobRow[] = [
  {
    id: 'frac',
    knob: <code>--mem-fraction-static</code>,
    def: 'Unset; computed per GPU (0.830 on an 80 GB H100 at TP 1, our arithmetic)',
    moves: 'The bytes left for the KV pool',
    where: 'This section',
  },
  {
    id: 'maxtok',
    knob: <code>--max-total-tokens</code>,
    def: 'Unset; profiled from memory',
    moves: 'Caps the pool; it can only lower the profiled count',
    where: 'This section',
  },
  {
    id: 'dtype',
    knob: <code>--kv-cache-dtype</code>,
    def: (
      <>
        <code>auto</code>
      </>
    ),
    moves: 'Bytes per token, so tokens per GiB',
    where: 'Section 9, Quantization and KV Precision',
  },
  {
    id: 'page',
    knob: <code>--page-size</code>,
    def: 'Unset; 1, raised by the attention backend',
    moves: 'The prefix reuse unit',
    where: 'This section; section 8, Attention Backends and Kernels',
  },
  {
    id: 'graph',
    knob: (
      <>
        <code>--chunked-prefill-size</code>, <code>--cuda-graph-max-bs-decode</code>
      </>
    ),
    def: 'By GPU memory and TP',
    moves: 'The reserve, so the computed fraction',
    where: 'This section; section 4, The Scheduler',
  },
  {
    id: 'running',
    knob: <code>--max-running-requests</code>,
    def: '2048 to 4096; 48 under speculative decoding',
    moves: 'How many requests run at once',
    where: 'Section 4; section 11, Speculative Decoding',
  },
];

/* ------------------------------------------------------------------------ */
/* The section                                                              */
/* ------------------------------------------------------------------------ */

export function KvMemory() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="How many tokens fit on your GPU, which startup defaults move when you change instance type, and where the server tells you what it chose (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            6. KV Memory and the Defaults Your GPU Picks
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            At startup SGLang divides each GPU&apos;s memory three ways: the model weights, a KV
            (key-value) cache pool sized in tokens, and a share held back for activations and CUDA
            graphs. The pool&apos;s token count sets how many requests can run at once and how much
            prefix cache stays resident, so it is the first number to know about a deployment.
          </Box>
          <Box variant="p">
            The challenge is that SGLang computes most of the inputs to that number itself. Many
            server flags declare a default of <code>None</code>, and a resolution hook fills in the
            real value at startup from the GPU, the model and the other flags, in a fixed order{' '}
            <Cite tier={1} href={sglangUrl(PIPELINE, 'L15-L283')} kind="code">
              pipeline.py L15-L283
            </Cite>
            . The same launch line therefore resolves to different defaults on a P5 and on a
            P6-B200, and several documented values in this section differ from what the v0.5.22
            hooks compute. Read the value the server reports. The <code>server_args=</code> line it
            logs at startup and <code>GET /server_info</code> both carry the resolved values{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L1145-L1179')} kind="code">
              engine.py L1145-L1179
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HTTP_SERVER, 'L847-L874')} kind="code">
              http_server.py L847-L874
            </Cite>
            , and one line reports the pool:
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
            {`max_total_num_tokens=N, chunked_prefill_size=N, max_prefill_tokens=N, max_running_requests=N, context_len=N, available_gpu_mem=N GB`}
          </pre>
          <Box variant="small" color="text-body-secondary">
            Format from{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L1229-L1241')} kind="code">
              scheduler.py L1229-L1241
            </Cite>
            , values replaced by placeholders; printed by TP rank 0.
          </Box>
          <Box variant="p">
            The first resolved value to check is <code>mem_fraction_static</code>. On an 80 GB H100
            at TP (tensor parallelism) 1 it resolves to about 0.83 by our arithmetic on the code
            formula, against the 0.92 that vLLM uses by default for{' '}
            <code>--gpu-memory-utilization</code>{' '}
            <Cite tier={1} href={VLLM_CACHE}>
              vLLM v0.31.0 config/cache.py L103
            </Cite>
            , and the two numbers measure different things.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Estimate the token count a model gets on your GPU before you launch, from the model's config and the GPU's memory"
          >
            How many tokens fit
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Once the weights are loaded, SGLang measures free GPU memory and subtracts the
            non-static share: <code>(1 - mem_fraction_static)</code> times the memory that was free
            before the model loaded, plus any multimodal reservation. What remains is the KV pool{' '}
            <Cite tier={1} href={sglangUrl(KV_CONF, 'L2671-L2741')} kind="code">
              kv_cache_configurator.py L2671-L2741
            </Cite>
            . Divided by the bytes one token costs across all layers, and rounded down to whole
            pages, it gives <code>max_total_num_tokens</code>{' '}
            <Cite tier={1} href={sglangUrl(POOL_CONF, 'L614-L624')} kind="code">
              pool_configurator.py L614-L624
            </Cite>
            . So <code>mem_fraction_static</code> is the share of the GPU that the weights and the
            KV pool split between them, and the larger the weights, the smaller the pool. If the
            weights leave nothing, startup fails with an error that prints the lowest viable{' '}
            <code>--mem-fraction-static</code>{' '}
            <Cite tier={1} href={sglangUrl(KV_CONF, 'L2723-L2739')} kind="code">
              kv_cache_configurator.py L2723-L2739
            </Cite>
            . <code>--max-total-tokens</code> can lower the computed count; a larger value is
            ignored with a warning{' '}
            <Cite tier={1} href={sglangUrl(KV_CONF, 'L2770-L2786')} kind="code">
              kv_cache_configurator.py L2770-L2786
            </Cite>
            .
          </Box>
          <Box variant="p">The bytes per token depend on the attention type:</Box>
          <ul>
            <li>
              <strong>MHA and GQA (multi-head and grouped-query attention).</strong> KV heads per
              rank, times K head width plus V head width, times layers, times bytes per element{' '}
              <Cite tier={1} href={sglangUrl(POOL_CONF, 'L464-L471')} kind="code">
                pool_configurator.py L464-L471
              </Cite>
              . The pool is one K tensor and one V tensor per layer, with a row per token slot{' '}
              <Cite tier={1} href={sglangUrl(MEMORY_POOL, 'L2518-L2582')} kind="code">
                memory_pool.py L2518-L2582
              </Cite>
              . KV heads per rank are the model&apos;s KV heads divided by TP, never fewer than one{' '}
              <Cite tier={1} href={sglangUrl(MODEL_CONFIG, 'L1591-L1602')} kind="code">
                model_config.py L1591-L1602
              </Cite>
              , so raising TP shrinks the per-GPU cost until TP reaches the KV head count.
            </li>
            <li>
              <strong>MLA (multi-head latent attention), for DeepSeek-class models.</strong> The
              compressed latent plus the rotary key part, <code>kv_lora_rank</code> plus{' '}
              <code>qk_rope_head_dim</code>, times layers, times bytes per element, held in one
              buffer per layer{' '}
              <Cite tier={1} href={sglangUrl(POOL_CONF, 'L373-L380')} kind="code">
                pool_configurator.py L373-L380
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(MEMORY_POOL, 'L4728-L4745')} kind="code">
                memory_pool.py L4728-L4745
              </Cite>
              . The cost does not grow with the head count, which is why MLA models fit more tokens
              per GiB. Our reading of the code: the MLA formula has no TP term, so every TP rank
              holds the full latent, and adding TP ranks does not shrink the per-GPU cost.
            </li>
          </ul>
          <Box variant="p">
            The bytes per element come from <code>--kv-cache-dtype</code>. Its default,{' '}
            <code>auto</code>, keeps the model&apos;s dtype unless the checkpoint declares an FP8
            (8-bit floating point) KV cache, in which case the pool is FP8 E4M3 (4 exponent bits, 3
            mantissa bits) with no flag set{' '}
            <Cite tier={1} href={sglangUrl(KV_DTYPE, 'L38-L48')} kind="code">
              kv_cache_dtype.py L38-L48
            </Cite>
            . DeepSeek V4, and DeepSeek&apos;s sparse-attention models on Blackwell, also resolve{' '}
            <code>auto</code> to FP8 E4M3{' '}
            <Cite tier={1} href={sglangUrl(OVERRIDES, 'L508-L513')} kind="code">
              overrides.py L508-L513
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(OVERRIDES, 'L878-L880')} kind="code">
              overrides.py L878-L880
            </Cite>
            . An FP8 cache halves the cell of a BF16 (bfloat16) model and doubles its token count;
            section 9, Quantization and KV Precision, covers the options.
          </Box>

          <Box variant="h3">Worked example: Qwen3-8B on P5 and on P6-B200</Box>
          <Box variant="p">
            Qwen3-8B has 36 layers, 8 KV heads and a head width of 128 in BF16{' '}
            <Cite tier={1} href={QWEN_CONFIG}>
              Qwen3-8B config.json at b968826
            </Cite>
            , so one token costs 8 x (128 + 128) x 36 x 2 bytes = 147,456 bytes, or 144 KiB. Its
            weights are 16,381,470,720 bytes, 15.3 GiB{' '}
            <Cite tier={1} href={QWEN_INDEX}>
              model.safetensors.index.json at b968826
            </Cite>
            . It is a dense model, and our search of{' '}
            <Cite tier={1} href={sglangTreeUrl('python/sglang/srt/arg_groups/model_overrides')}>
              arg_groups/model_overrides/
            </Cite>{' '}
            found no override registered for its architecture, <code>Qwen3ForCausalLM</code>, so it
            takes the generic memory and attention defaults. The table is our arithmetic on the v0.5.22 code formula at
            TP 1, not an observation on hardware. It assumes the GPU totals shown and that the whole
            GPU is free before the weights load, so the KV figures are upper bounds.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={EXAMPLE_ROWS}
            columnDefinitions={[
              {
                id: 'item',
                header: 'Value',
                cell: (r) => r.item,
                minWidth: 190,
              },
              {
                id: 'h100',
                header: 'P5 (H100)',
                cell: (r) => r.h100,
                minWidth: 120,
              },
              {
                id: 'b200',
                header: 'P6-B200 (B200)',
                cell: (r) => r.b200,
                minWidth: 120,
              },
              { id: 'src', header: 'Code', cell: (r) => r.src, minWidth: 190 },
            ]}
          />
          <Box variant="small" color="text-body-secondary">
            Our arithmetic, not measured. The 81,559 MiB H100 total is an assumed nvidia-smi figure;
            the EC2 table&apos;s 80 GiB gives the same 0.830. The fraction is rounded to three
            decimals, so the non-static share differs slightly from the reserve.
          </Box>
          <GpuMemoryBarDiagram />
          <Box variant="small" color="text-body-secondary">
            Drawn to scale from the worked example above: our arithmetic on the code formula, not
            measured on hardware.
          </Box>
          <Box variant="p">
            The B200 has 2.25 times the H100&apos;s memory and, in this arithmetic, 2.7 times its
            tokens. The weights are a fixed charge, so every extra GiB goes to the pool, minus a
            larger reserve. The page size changes too, from one token to 64, which the page-size
            block below explains.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know what 0.83 covers before you copy a memory setting from a vLLM launch line, and when to set the fraction yourself"
          >
            mem_fraction_static: computed for your GPU
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <code>--mem-fraction-static</code> covers the weights and the KV pool, and the server
            uses the rest for activations and CUDA graphs. vLLM&apos;s{' '}
            <code>--gpu-memory-utilization</code>, 0.92 by default, is the share of GPU memory the
            vLLM instance may use for everything: weights, activations, the CUDA graph pool and the
            KV cache ({VLLM_OPS_LINK}). SGLang&apos;s computed 0.83 sits below vLLM&apos;s 0.92
            because it counts fewer things. Do not copy one value into the other engine. By our
            arithmetic, 0.92 in SGLang would leave 6.4 GiB of an 80 GB H100 for activations and
            graphs, under half of the worked example&apos;s 13.6 GiB reserve, which the formula
            below computes.
          </Box>
          <Box variant="p">
            Left unset, <code>--mem-fraction-static</code>{' '}
            <Cite tier={1} href={sglangUrl(SCHED_FIELDS, 'L27-L30')}>
              schedule.py L27-L30
            </Cite>{' '}
            is <code>(GPU memory - reserve) / GPU memory</code>, rounded to three decimals. The
            reserve is an activation budget that grows with the chunked-prefill size, a term that
            grows with TP and PP (pipeline parallelism), and a CUDA-graph term that grows with the
            decode graph&apos;s maximum batch, with a floor of 10 GiB on GPUs over 60 GiB{' '}
            <Cite tier={1} href={sglangUrl(MEMORY_HOOK, 'L283-L345')} kind="code">
              memory_hook.py L283-L345
            </Cite>
            . The fraction therefore falls as TP, chunk size and graph size grow: by our arithmetic,
            0.830 on an H100 at TP 1, 0.812 at TP 8, where the decode graph doubles to 512 and the
            TP term grows, and 0.854 on a B200 at TP 1. Our reading of the formula: it has no weight
            term, so a small and a large dense MHA or GQA text model at the same TP on the same
            NVIDIA GPU get the same fraction, and the model decides only how that share splits
            between weights and pool.
          </Box>
          <Box variant="p">
            To tune it, SGLang&apos;s tuning guide recommends reading <code>available_gpu_mem</code>{' '}
            in the startup line: 5 to 8 GB is a good setting, 10 to 20 GB means the fraction can go
            up, and much less risks out-of-memory errors later, so the fraction should come down.
            The guide also suggests raising it in steps of 0.01 until your workload runs out of
            memory{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(TUNING_DOC, 'L33-L57')}>
              SGLang docs: hyperparameter tuning (v0.5.22 source)
            </Cite>
            .
          </Box>
          <Box variant="p">
            Set it explicitly on any platform where SGLang cannot read the device&apos;s memory
            size, because the code then falls back to 0.95, a higher value than the 0.88 the
            documentation gives. The expandable block below has the conditions.
          </Box>

          <ExpandableSection headerText="Where the documentation and v0.5.22's code differ on the fraction">
            <SpaceBetween size="s">
              <Box variant="p">
                The server-arguments page lists the default as <code>None</code> and says the
                computed value falls back to 0.88 when GPU memory cannot be detected{' '}
                <Cite
                  tier={1}
                  href={sglangDocsSrcUrl(SERVER_ARGS_DOC, 'L440-L442')}
                  kind="doc-code-conflict"
                >
                  SGLang docs: server arguments (v0.5.22 source)
                </Cite>
                . v0.5.22&apos;s code falls back to 0.95{' '}
                <Cite tier={1} href={sglangUrl(MEMORY_HOOK, 'L325-L330')} kind="code">
                  memory_hook.py L325-L330
                </Cite>
                , which leaves 5% of the device for activations and graphs.
              </Box>
              <Box variant="p">
                Our reading of the memory query: the fallback is narrow. On CUDA a failed{' '}
                <code>nvidia-smi</code> falls back to PyTorch&apos;s own memory query{' '}
                <Cite tier={1} href={sglangUrl(COMMON, 'L748-L816')} kind="code">
                  common.py L748-L816
                </Cite>
                , and the AMD, Intel and Apple GPU queries raise an error when they fail. The value
                is missing when the device is one SGLang has no query for, or when an out-of-tree
                platform plugin reports no size{' '}
                <Cite tier={1} href={sglangUrl(COMMON, 'L953-L980')} kind="code">
                  common.py L953-L980
                </Cite>
                , and on CPU when <code>SGLANG_CPU_OMP_THREADS_BIND</code> is set{' '}
                <Cite tier={1} href={sglangUrl(COMMON, 'L862-L865')} kind="code">
                  common.py L862-L865
                </Cite>
                .
              </Box>
              <Box variant="p">
                The resolution function&apos;s own docstring gives a two-term reserve, chunk size
                times 1.5 plus decode batch times 2, in GB{' '}
                <Cite tier={1} href={sglangUrl(MEMORY_HOOK, 'L66-L67')} kind="code">
                  memory_hook.py L66-L67
                </Cite>
                . The code after it works in MiB, adds more terms, and is what runs. In full, the reserve is 512 MiB, plus 1.5 MiB per
                activation token (the chunked-prefill size, at least 2048), plus 1,024 MiB times TP
                times PP divided by 8, plus 2 MiB per decode batch slot up to the graph maximum,
                plus 8 MiB per captured prefill size (1.5 GiB in total on MLA backends), floored at
                10 GiB on GPUs over 60 GiB{' '}
                <Cite tier={1} href={sglangUrl(MEMORY_HOOK, 'L300-L317')} kind="code">
                  memory_hook.py L300-L317
                </Cite>{' '}
                <Cite tier={1} href={sglangUrl(MEMORY_HOOK, 'L359-L401')} kind="code">
                  memory_hook.py L359-L401
                </Cite>
                . DP (data parallelism) attention adds more per decode slot, the all-to-all buffers
                of DeepEP, the expert-parallel communication library, add 2 GiB on top of the floor,
                and multimodal models take a further cut sized to the vision tower{' '}
                <Cite tier={1} href={sglangUrl(MEMORY_HOOK, 'L404-L464')} kind="code">
                  memory_hook.py L404-L464
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
            description="See which startup values change when one launch line moves to another instance family, and the caps that keep concurrency below the token count"
          >
            The defaults that follow GPU memory
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The chunked-prefill size and the decode CUDA-graph maximum batch both follow the GPU
            memory size SGLang reads, and the fraction is computed from them, so all three move
            together when the instance family changes.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={TIER_ROWS}
            columnDefinitions={[
              {
                id: 'mem',
                header: 'GPU memory',
                cell: (r) => r.mem,
                minWidth: 120,
              },
              {
                id: 'chunk',
                header: 'chunked_prefill_size',
                cell: (r) => r.chunk,
                minWidth: 120,
              },
              {
                id: 'bs',
                header: 'Decode graph max batch, TP under 4 / TP 4 or more',
                cell: (r) => r.bs,
                minWidth: 150,
              },
              {
                id: 'ec2',
                header: 'EC2 GPUs in the tier',
                cell: (r) => r.ec2,
                minWidth: 240,
              },
            ]}
          />
          <Box variant="small" color="text-body-secondary">
            Tiers from{' '}
            <Cite tier={1} href={sglangUrl(MEMORY_HOOK, 'L89-L180')} kind="code">
              memory_hook.py L89-L180
            </Cite>
            . EC2 GPUs placed by our reading of the per-GPU memory in the{' '}
            <Cite tier={1} href={EC2_SPECS}>
              EC2 accelerated computing specs
            </Cite>
            ; SGLang reads the size from <code>nvidia-smi</code>. An explicit{' '}
            <code>--max-running-requests</code> also caps the decode graph batch.
          </Box>
          <Box variant="p">
            A decode batch larger than the captured maximum still runs, without a graph{' '}
            <Cite tier={1} href={sglangUrl(GRAPH_RUNNER, 'L715-L760')} kind="code">
              decode_cuda_graph_runner.py L715-L760
            </Cite>
            , and the decode log line then shows <code>cuda graph: False</code> (section 4, The
            Scheduler: one step ahead, betting on early stops, lists the line). That is the signal
            to raise <code>--cuda-graph-max-bs-decode</code> and give back some of the fraction.
          </Box>
          <Box variant="p">
            Three limits sit between the token count and the number of requests that run at once.
            When unset, <code>--max-running-requests</code> is the token count divided by the
            context length times 512, clamped to 2048 to 4096, and at most half the token count, so
            2048 to 4096 in practice{' '}
            <Cite tier={1} href={sglangUrl(KV_CONF, 'L2800-L2851')} kind="code">
              kv_cache_configurator.py L2800-L2851
            </Cite>
            . Admission then charges each new request its uncached prompt plus up to 4096 output
            tokens{' '}
            <Cite tier={1} href={sglangUrl(POLICY, 'L1347-L1353')} kind="code">
              schedule_policy.py L1347-L1353
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(ENVIRON, 'L599')} kind="code">
              environ.py L599
            </Cite>
            , which section 4 explains. And with <code>--max-running-requests</code> unset,
            EAGLE-family and NGRAM speculative decoding reset it to 48{' '}
            <Cite tier={1} href={sglangUrl(SPEC_HOOK, 'L995-L1003')} kind="code">
              speculative_hook.py L995-L1003
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SPEC_HOOK, 'L1204-L1213')} kind="code">
              speculative_hook.py L1204-L1213
            </Cite>
            , so a pool of a million tokens can still run only 48 requests at once; section 11,
            Speculative Decoding: draft, verify, keep the agreed prefix, covers when to raise it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict how finely prefixes are reused on H100 and on B200, and decide when to set --page-size yourself"
          >
            Page size: the attention backend sets the reuse unit
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The page is the block of KV slots the paged allocator hands out as one unit{' '}
            <Cite tier={1} href={sglangUrl(KV_CONF, 'L2595-L2618')} kind="code">
              kv_cache_configurator.py L2595-L2618
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(PAGED_ALLOC, 'L181-L202')} kind="code">
              paged.py L181-L202
            </Cite>
            , and it is also the unit the radix cache matches in: keys are cut to whole pages before
            match and insert{' '}
            <Cite tier={1} href={sglangUrl(RADIX, 'L147-L151')} kind="code">
              radix_cache.py L147-L151
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(RADIX, 'L406-L438')} kind="code">
              radix_cache.py L406-L438
            </Cite>
            ; section 5, RadixAttention and the Radix Cache, explains the tree.{' '}
            <code>--page-size</code> is unset by default and resolves to 1
            on NVIDIA GPUs{' '}
            <Cite tier={1} href={sglangUrl(SCHED_FIELDS, 'L139-L141')}>
              schedule.py L139-L141
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(OVERRIDES, 'L1303-L1326')} kind="code">
              overrides.py L1303-L1326
            </Cite>
            , but the attention backend&apos;s constraints run before that default, so a backend
            that needs pages wins{' '}
            <Cite tier={1} href={sglangUrl(PIPELINE, 'L232-L246')} kind="code">
              pipeline.py L232-L246
            </Cite>
            .
          </Box>
          <Box variant="p">
            For a dense Llama-style model with no attention flag set, the default chain gives{' '}
            <code>fa3</code> (FlashAttention 3) on SM90 (compute capability 9.0, Hopper) and{' '}
            <code>trtllm_mha</code> (the TensorRT-LLM MHA kernels) on SM100 and SM103 (compute
            capability 10.0 and 10.3, datacenter Blackwell: B200, GB200, B300){' '}
            <Cite tier={1} href={sglangUrl(MODEL_BASE, 'L293-L324')} kind="code">
              model_override_base.py L293-L324
            </Cite>
            . So the same model reuses prefixes to the exact token on a P5 and in 64-token pages on
            a P6, by our reading of the default chain in code. It holds with speculative decoding
            off, or on with an explicit <code>--speculative-eagle-topk 1</code> and{' '}
            <code>--speculative-num-steps</code> set{' '}
            <Cite tier={1} href={sglangUrl(SPEC_HOOK, 'L1068-L1072')} kind="code">
              speculative_hook.py L1068-L1072
            </Cite>
            . EAGLE with topk above 1 moves both GPUs to <code>flashinfer</code>, or{' '}
            <code>triton</code> where FlashInfer is missing{' '}
            <Cite tier={1} href={sglangUrl(COMMON, 'L4014-L4020')} kind="code">
              common.py L4014-L4020
            </Cite>
            , and on a P6 so does speculation with <code>--speculative-eagle-topk</code> unset{' '}
            <Cite tier={1} href={sglangUrl(MODEL_BASE, 'L303-L315')} kind="code">
              model_override_base.py L303-L315
            </Cite>
            .
          </Box>
          <Box variant="p">
            The startup log names the backend in{' '}
            <code>Attention backend not specified. Use fa3 backend by default.</code> (with{' '}
            <code>trtllm_mha</code> on a P6){' '}
            <Cite tier={1} href={sglangUrl(OVERRIDES, 'L1076-L1079')} kind="code">
              overrides.py L1076-L1079
            </Cite>
            , and on a P6 it adds a warning that TensorRT-LLM MHA is changing <code>page_size</code>{' '}
            to 64{' '}
            <Cite tier={1} href={sglangUrl(OVERRIDES, 'L1124-L1137')} kind="code">
              overrides.py L1124-L1137
            </Cite>
            . The table lists the attention backends whose resolution rules change the page size
            on NVIDIA and Intel GPUs.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={PAGE_ROWS}
            columnDefinitions={[
              {
                id: 'backend',
                header: 'Attention backend',
                cell: (r) => r.backend,
                minWidth: 170,
              },
              {
                id: 'page',
                header: 'Page size',
                cell: (r) => r.page,
                minWidth: 200,
              },
              {
                id: 'when',
                header: 'When it is the default',
                cell: (r) => r.when,
                minWidth: 200,
              },
            ]}
          />
          <Box variant="small" color="text-body-secondary">
            Page constraints from{' '}
            <Cite tier={1} href={sglangUrl(OVERRIDES, 'L1084-L1152')} kind="code">
              overrides.py L1084-L1152
            </Cite>{' '}
            and{' '}
            <Cite tier={1} href={sglangUrl(OVERRIDES, 'L1237-L1300')} kind="code">
              overrides.py L1237-L1300
            </Cite>
            ; defaults from{' '}
            <Cite tier={1} href={sglangUrl(MODEL_BASE, 'L268-L341')} kind="code">
              model_override_base.py L268-L341
            </Cite>
            .
          </Box>
          <Box variant="p">
            A whole page has to match before anything is reused. With 64-token pages, a 32-token
            prompt is never cached, and a 65-token shared prefix reuses only its first 64 tokens{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(BACKEND_DOC, 'L322')}>
              SGLang docs: attention backend (v0.5.22 source)
            </Cite>
            . The same docs note that larger pages generally make the attention kernels faster, and
            advise a page size above 1 when prefix reuse is not critical.
          </Box>
          <Box variant="p">
            <strong>What to set on P6.</strong> If your shared prefixes are short or do not end on a
            page boundary, set <code>--page-size 16</code>; <code>trtllm_mha</code> accepts 16, 32,
            64 or 128 in the code at v0.5.22{' '}
            <Cite tier={1} href={sglangUrl(OVERRIDES, 'L1124-L1137')} kind="code">
              overrides.py L1124-L1137
            </Cite>
            . Either way, size system prompts and few-shot blocks to page multiples so they match in
            full. The throughput effect of smaller pages was not measured in this research. Watch
            for one interaction: with EAGLE at topk 1, an explicit page size above 1 also moves an
            MHA model off <code>fa3</code> or <code>trtllm_mha</code> to <code>flashinfer</code>{' '}
            <Cite tier={1} href={sglangUrl(COMMON, 'L4014-L4020')} kind="code">
              common.py L4014-L4020
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="Where the documentation and v0.5.22's code differ on page sizes">
            <Box variant="p">
              The attention-backend page lists TensorRT-LLM MHA&apos;s native page sizes as 16, 32
              or 64{' '}
              <Cite tier={1} href={sglangDocsSrcUrl(BACKEND_DOC, 'L325')} kind="doc-code-conflict">
                SGLang docs: attention backend (v0.5.22 source)
              </Cite>
              . v0.5.22&apos;s code also accepts 128 and turns any other value, including an
              explicit 1 or an unset page size, into 64 with a warning{' '}
              <Cite tier={1} href={sglangUrl(OVERRIDES, 'L1124-L1137')} kind="code">
                overrides.py L1124-L1137
              </Cite>
              .
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The settings that move KV capacity, the gauge that shows how much of it live requests hold, and the order to check them in"
          >
            Knobs, the first metric, and where to start
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={KNOB_ROWS}
            columnDefinitions={[
              {
                id: 'knob',
                header: 'Knob',
                cell: (r) => r.knob,
                minWidth: 170,
              },
              {
                id: 'def',
                header: 'Default at v0.5.22',
                cell: (r) => r.def,
                minWidth: 190,
              },
              {
                id: 'moves',
                header: 'What it moves',
                cell: (r) => r.moves,
                minWidth: 160,
              },
              {
                id: 'where',
                header: 'Covered in',
                cell: (r) => r.where,
                minWidth: 170,
              },
            ]}
          />
          <Box variant="p">
            The gauge to read first is <code>sglang:token_usage</code>, exported once{' '}
            <code>--enable-metrics</code> is set, since metrics are off by default{' '}
            <Cite tier={1} href={sglangUrl(OBS_FIELDS, 'L70')}>
              observability.py L70
            </Cite>
            . It is the share of <code>max_total_num_tokens</code> held by running or locked
            requests: cached KV that no request holds counts as free{' '}
            <Cite tier={1} href={sglangUrl(POOL_STATS, 'L235-L245')} kind="code">
              pool_stats_observer.py L235-L245
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(COLLECTOR, 'L396-L400')} kind="code">
              metrics_collector.py L396-L400
            </Cite>
            . Multiplied by the token count from the startup line, it gives the tokens live requests
            hold right now; section 5 explains why a pool full of reusable prefixes still reads low.
          </Box>
          <Box variant="p">
            <strong>Against vLLM:</strong> <code>--mem-fraction-static</code> counts weights and KV,
            where <code>--gpu-memory-utilization</code> counts the whole instance ({VLLM_OPS_LINK});
            and for a dense Llama-style model at defaults with speculative decoding off, SGLang
            reuses prefixes to the token on H100 and in 64-token pages on B200, where vLLM uses
            16-token blocks on both and neither caches the trailing partial unit ({VLLM_PAGED_LINK}
            ).
          </Box>
          <Box variant="p">
            <strong>Where to start.</strong> Launch once with the defaults. Read the{' '}
            <code>server_args=</code> line for <code>mem_fraction_static</code>,{' '}
            <code>attention_backend</code> and <code>page_size</code>, and the startup line for{' '}
            <code>max_total_num_tokens</code> and <code>available_gpu_mem</code>. Check that the
            token count covers your target concurrency times prompt plus output length. Tune the
            fraction by the tuning guide&apos;s 5 to 8 GB rule, and on a P6 decide the page size
            before the first load test. Expect about 0.83 on an 80 GB H100 at TP 1, and leave
            vLLM&apos;s 0.92 behind: it measures a different thing.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
