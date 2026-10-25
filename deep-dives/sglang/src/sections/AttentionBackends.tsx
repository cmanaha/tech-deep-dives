import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import type { ReactNode } from 'react';
import { Cite, sglangUrl, sglangTreeUrl, sglangDocsSrcUrl } from '../components/Cite';

const SRT = 'python/sglang/srt';
const MOB = `${SRT}/arg_groups/model_override_base.py`;
const OVR = `${SRT}/arg_groups/overrides.py`;
const PIPE = `${SRT}/arg_groups/pipeline.py`;
const ATTN_HOOK = `${SRT}/arg_groups/attention_hook.py`;
const EXEC = `${SRT}/arg_groups/fields/exec_.py`;
const MODEL_OVR = `${SRT}/arg_groups/model_overrides`;
const ENV = `${SRT}/environ.py`;
const REG = `${SRT}/layers/attention/attention_registry.py`;
const DG = `${SRT}/layers/deep_gemm_wrapper/compile_utils.py`;
const PYPROJ = 'python/pyproject.toml';
const AOT = 'python/sglang/kernels/aot';
const AB_DOC = 'advanced_features/attention_backend';

function vllmUrl(path: string, lines: string): string {
  return `https://github.com/vllm-project/vllm/blob/v0.31.0/${path}#${lines}`;
}

/* ------------------------------------------------------------------ */
/* Diagram: how the attention backend is resolved at startup           */
/* ------------------------------------------------------------------ */

interface Leaf {
  x: number;
  y: number;
  title: string;
  backend: string;
  note?: string;
  muted?: boolean;
}

const LEAF_W = 206;
const LEAF_H = 66;

const platformLeaves: Leaf[] = [
  { x: 240, y: 16, title: 'CPU, x86', backend: 'intel_amx' },
  { x: 459, y: 16, title: 'CPU, Arm', backend: 'torch_native' },
  { x: 678, y: 16, title: 'Ascend NPU', backend: 'ascend' },
];

const familyLeaves: Leaf[] = [
  {
    x: 240,
    y: 120,
    title: 'DeepSeek V3 family, SM100',
    backend: 'trtllm_mla, page 64',
    note: 'also Kimi K2.5, Mistral Large 3',
  },
  {
    x: 459,
    y: 120,
    title: 'DeepSeek sparse attention',
    backend: 'dsa, page 64 x indexer pool',
    note: 'DeepSeek V3.2, GLM-5',
  },
  {
    x: 678,
    y: 120,
    title: 'DeepSeek V4',
    backend: 'dsv4, always',
    note: 'own Ascend, ROCm and CUDA paths',
  },
  {
    x: 240,
    y: 198,
    title: 'Qwen3.5 hybrids, SM100',
    backend: 'triton, page 1',
    note: 'else trtllm_mha, page 64',
  },
  {
    x: 459,
    y: 198,
    title: 'GPT-OSS',
    backend: 'trtllm_mha on SM100',
    note: 'fa3 on SM90, aiter on ROCm',
  },
  {
    x: 678,
    y: 198,
    title: '29 more modules',
    backend: '',
    note: 'rules for other architectures',
    muted: true,
  },
];

interface GridRow {
  y: number;
  gpu: string;
  gpuNote: string;
  mha: string;
  mhaNote?: string;
  mla: string;
  mlaNote?: string;
}

const gridRows: GridRow[] = [
  { y: 330, gpu: 'SM90, Hopper', gpuNote: 'CUDA 12.3 or later', mha: 'fa3, page 1', mla: 'fa3, page 1' },
  {
    y: 374,
    gpu: 'SM100, SM103',
    gpuNote: 'B200, GB200, B300',
    mha: 'trtllm_mha, page 64',
    mhaNote: 'fa4, page 128 if K, V widths differ',
    mla: 'flashinfer, page 1',
  },
  {
    y: 418,
    gpu: 'ROCm, AMD',
    gpuNote: 'Instinct GPUs',
    mha: 'aiter, page 1',
    mla: 'aiter or triton, page 1',
    mlaNote: 'aiter at 16 or 128 KV heads per rank',
  },
  {
    y: 462,
    gpu: 'Other CUDA GPUs',
    gpuNote: 'SM8x, SM120',
    mha: 'flashinfer, page 1',
    mhaNote: 'triton if sinks or no FlashInfer',
    mla: 'triton, page 1',
  },
];

function BackendSelectionDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 516"
        role="img"
        aria-labelledby="kernels-select-title"
        style={{ width: '100%', minWidth: 740, height: 'auto' }}
      >
        <title id="kernels-select-title">
          SGLang resolves the attention backend in three steps at startup. Platform hooks run first
          for CPU servers and Ascend NPUs. On a CUDA or ROCm GPU the model&apos;s override module
          decides next, for example trtllm_mla with 64-token pages for the DeepSeek V3 family on
          SM100. Only a model with no rule reaches the generic table, which picks by GPU generation
          and attention type: fa3 with page 1 on Hopper, trtllm_mha with page 64 for MHA models on
          SM100 and SM103, and flashinfer or triton elsewhere. Tree speculation moves Hopper and
          SM100 MHA models to flashinfer with page 1.
        </title>
        <defs>
          <marker
            id="kernels-sel-ah"
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
        <style>{`
          .kernels-sel-stage { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .kernels-sel-leaf { fill: #ffffff; stroke: #879596; stroke-width: 1.2; }
          .kernels-sel-muted { fill: #f4f4f4; stroke: #d1d5db; stroke-width: 1.2; }
          .kernels-sel-cell { fill: #ffffff; stroke: #879596; stroke-width: 1; }
          .kernels-sel-lab { fill: #f4f4f4; stroke: #879596; stroke-width: 1; }
          .kernels-sel-warn { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.2; }
          .kernels-sel-h { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .kernels-sel-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .kernels-sel-t { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .kernels-sel-b { fill: #065299; font: 600 12px sans-serif; text-anchor: middle; }
          .kernels-sel-n { fill: #5f6b7a; font: 10px sans-serif; text-anchor: middle; }
          .kernels-sel-col { fill: #414d5c; font: 600 12px sans-serif; text-anchor: middle; }
          .kernels-sel-edge { fill: #5f6b7a; font: 11px sans-serif; }
          .kernels-sel-wt { fill: #8b6c00; font: 600 12px sans-serif; text-anchor: middle; }
          .kernels-sel-ws { fill: #8b6c00; font: 11px sans-serif; text-anchor: middle; }
          .kernels-sel-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#kernels-sel-ah); }
          .kernels-sel-br { stroke: #879596; stroke-width: 1.2; fill: none; }
        `}</style>
        <rect x={0} y={0} width={900} height={516} rx={8} fill="#ffffff" />

        {/* brackets joining each stage to its answers */}
        <path d="M224,50 H232 M232,20 V80" className="kernels-sel-br" />
        <path d="M224,192 H232 M232,124 V260" className="kernels-sel-br" />
        <path d="M224,400 H232 M232,304 V500" className="kernels-sel-br" />

        {/* stage 1 */}
        <rect x={16} y={16} width={208} height={68} rx={6} className="kernels-sel-stage" />
        <text x={120} y={40} className="kernels-sel-h">1. Platform hook</text>
        <text x={120} y={58} className="kernels-sel-s">CPU servers and</text>
        <text x={120} y={73} className="kernels-sel-s">Ascend NPUs</text>
        {platformLeaves.map((l) => (
          <g key={l.title + l.x}>
            <rect x={l.x} y={l.y} width={LEAF_W} height={68} rx={6} className="kernels-sel-leaf" />
            <text x={l.x + LEAF_W / 2} y={l.y + 28} className="kernels-sel-t">{l.title}</text>
            <text x={l.x + LEAF_W / 2} y={l.y + 48} className="kernels-sel-b">{l.backend}</text>
          </g>
        ))}

        <line x1={120} y1={84} x2={120} y2={118} className="kernels-sel-arr" />
        <text x={130} y={106} className="kernels-sel-edge">a CUDA or ROCm GPU</text>

        {/* stage 2 */}
        <rect x={16} y={120} width={208} height={144} rx={6} className="kernels-sel-stage" />
        <text x={120} y={162} className="kernels-sel-h">2. Override module</text>
        <text x={120} y={182} className="kernels-sel-s">33 modules, one per</text>
        <text x={120} y={198} className="kernels-sel-s">model family</text>
        <text x={120} y={214} className="kernels-sel-s">(five rules shown)</text>
        {familyLeaves.map((l) => (
          <g key={l.title}>
            <rect
              x={l.x}
              y={l.y}
              width={LEAF_W}
              height={LEAF_H}
              rx={6}
              className={l.muted ? 'kernels-sel-muted' : 'kernels-sel-leaf'}
            />
            <text x={l.x + LEAF_W / 2} y={l.y + 20} className="kernels-sel-t">{l.title}</text>
            {l.backend && (
              <text x={l.x + LEAF_W / 2} y={l.y + 38} className="kernels-sel-b">{l.backend}</text>
            )}
            {l.note && (
              <text x={l.x + LEAF_W / 2} y={l.backend ? l.y + 55 : l.y + 40} className="kernels-sel-n">
                {l.note}
              </text>
            )}
          </g>
        ))}

        <line x1={120} y1={264} x2={120} y2={298} className="kernels-sel-arr" />
        <text x={130} y={286} className="kernels-sel-edge">no rule set a backend</text>

        {/* stage 3 */}
        <rect x={16} y={300} width={208} height={200} rx={6} className="kernels-sel-stage" />
        <text x={120} y={326} className="kernels-sel-h">3. Generic GPU table</text>
        <text x={120} y={346} className="kernels-sel-s">GPU generation, then</text>
        <text x={120} y={362} className="kernels-sel-s">attention type</text>
        <rect x={28} y={380} width={184} height={108} rx={6} className="kernels-sel-warn" />
        <text x={120} y={402} className="kernels-sel-wt">Tree speculation</text>
        <text x={120} y={421} className="kernels-sel-ws">(topk above 1) moves</text>
        <text x={120} y={437} className="kernels-sel-ws">SM90 and SM100 MHA</text>
        <text x={120} y={453} className="kernels-sel-ws">to flashinfer, page 1</text>
        <text x={120} y={474} className="kernels-sel-ws">(section 11)</text>

        <text x={535} y={318} className="kernels-sel-col">MHA and GQA models</text>
        <text x={772} y={318} className="kernels-sel-col">MLA models</text>
        {gridRows.map((r) => (
          <g key={r.gpu}>
            <rect x={240} y={r.y} width={170} height={38} rx={4} className="kernels-sel-lab" />
            <text x={325} y={r.y + 17} className="kernels-sel-t">{r.gpu}</text>
            <text x={325} y={r.y + 31} className="kernels-sel-n">{r.gpuNote}</text>
            <rect x={420} y={r.y} width={230} height={38} rx={4} className="kernels-sel-cell" />
            <text x={535} y={r.mhaNote ? r.y + 17 : r.y + 24} className="kernels-sel-b">{r.mha}</text>
            {r.mhaNote && (
              <text x={535} y={r.y + 31} className="kernels-sel-n">{r.mhaNote}</text>
            )}
            <rect x={660} y={r.y} width={224} height={38} rx={4} className="kernels-sel-cell" />
            <text x={772} y={r.mlaNote ? r.y + 17 : r.y + 24} className="kernels-sel-b">{r.mla}</text>
            {r.mlaNote && (
              <text x={772} y={r.y + 31} className="kernels-sel-n">{r.mlaNote}</text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tables                                                              */
/* ------------------------------------------------------------------ */

interface PageRow {
  backend: string;
  page: ReactNode;
  src: ReactNode;
}

const pageRows: PageRow[] = [
  {
    backend: 'fa3, flashinfer, triton',
    page: 'Keep the default of 1: reuse is exact to the token.',
    src: (
      <Cite tier={1} href={sglangUrl(OVR, 'L1304-L1326')}>
        overrides.py L1304-L1326
      </Cite>
    ),
  },
  {
    backend: 'trtllm_mha',
    page: 'Accepts 16, 32, 64 or 128. Any other value, including the default, becomes 64 with a warning.',
    src: (
      <Cite tier={1} href={sglangUrl(OVR, 'L1124-L1137')}>
        overrides.py L1124-L1137
      </Cite>
    ),
  },
  {
    backend: 'trtllm_mla, cutedsl_mla, tokenspeed_mla',
    page: 'Accept 32 or 64; anything else becomes 64.',
    src: (
      <Cite tier={1} href={sglangUrl(OVR, 'L1096-L1123')}>
        overrides.py L1096-L1123
      </Cite>
    ),
  },
  {
    backend: 'flashmla, hpc_ops',
    page: '64, always.',
    src: (
      <>
        <Cite tier={1} href={sglangUrl(OVR, 'L1085-L1095')}>
          overrides.py L1085-L1095
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(OVR, 'L1138-L1147')}>
          overrides.py L1138-L1147
        </Cite>
      </>
    ),
  },
  {
    backend: 'fa4 (SM100, MHA models)',
    page: '128, except under tree speculation, where it stays at 1.',
    src: (
      <Cite tier={1} href={sglangUrl(OVR, 'L1237-L1262')}>
        overrides.py L1237-L1262
      </Cite>
    ),
  },
  {
    backend: 'dsa',
    page: '64 times the indexer pool on CUDA and ROCm GPUs (64 for DeepSeek V3.2); 128 on Intel GPUs.',
    src: (
      <Cite tier={1} href={sglangUrl(`${MODEL_OVR}/deepseek_v2.py`, 'L145-L178')}>
        deepseek_v2.py L145-L178
      </Cite>
    ),
  },
  {
    backend: 'intel_xpu',
    page: 'On Intel GPUs: 64 or 128 (also 16 and 32 for MLA); anything else becomes 128.',
    src: (
      <Cite tier={1} href={sglangUrl(OVR, 'L1287-L1301')}>
        overrides.py L1287-L1301
      </Cite>
    ),
  },
];

interface SourceRow {
  backend: string;
  plain?: boolean;
  from: ReactNode;
  pin: ReactNode;
  src: ReactNode;
}

const sourceRows: SourceRow[] = [
  {
    backend: 'flashinfer',
    from: 'The FlashInfer library: paged attention for MHA models, FlashInfer MLA for MLA models.',
    pin: (
      <>
        <code>flashinfer_python</code> 0.7.1, CUDA 13 build
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(PYPROJ, 'L42')}>
          pyproject.toml L42
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(REG, 'L53-L77')}>
          attention_registry.py L53-L77
        </Cite>
      </>
    ),
  },
  {
    backend: 'trtllm_mha, trtllm_mla, cutedsl_mla',
    from: "TensorRT-LLM-generated kernels and a CuTe DSL MLA decode kernel, called through FlashInfer's trtllm entry points. TensorRT-LLM itself is not a dependency.",
    pin: (
      <>
        <code>flashinfer_python</code> 0.7.1
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(`${SRT}/layers/attention/trtllm_mha_backend.py`, 'L1700-L1719')}>
          trtllm_mha_backend.py L1700-L1719
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/layers/attention/trtllm_mla_backend.py`, 'L1036-L1045')}>
          trtllm_mla_backend.py L1036-L1045
        </Cite>
      </>
    ),
  },
  {
    backend: 'fa3',
    from: "FlashAttention 3, compiled from sgl-project/sgl-attn, SGLang's fork of Dao-AILab's flash-attention.",
    pin: (
      <>
        <code>sglang-kernel</code> 0.4.9 (in-tree build; the PyPI (Python Package Index) wheel was
        not inspected)
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(`${AOT}/CMakeLists.txt`, 'L83-L89')}>
          CMakeLists.txt L83-L89
        </Cite>{' '}
        <Cite
          tier={1}
          href="https://github.com/sgl-project/sgl-attn/tree/f89bc2306632d1ec5f97b014dded4254f5b4a907"
        >
          sgl-attn at f89bc230
        </Cite>
      </>
    ),
  },
  {
    backend: 'flashmla',
    from: "DeepSeek's FlashMLA decode kernel, compiled from SGLang's fork.",
    pin: (
      <>
        <code>sglang-kernel</code> 0.4.9 (same caveat)
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(`${AOT}/cmake/flashmla.cmake`, 'L1-L17')}>
          flashmla.cmake L1-L17
        </Cite>{' '}
        <Cite
          tier={1}
          href="https://github.com/sgl-project/FlashMLA/tree/3620b63fc4ebe33950c50e1b7701b6607f44150e"
        >
          sgl-project/FlashMLA at 3620b63f
        </Cite>
      </>
    ),
  },
  {
    backend: 'fa4',
    from: 'FlashAttention 4, written in CuTe DSL, with its kernel sources vendored in SGLang\'s tree.',
    pin: 'No separate pin: it moves with the sglang release.',
    src: (
      <Cite tier={1} href={sglangUrl('python/sglang/kernels/ops/attention/flash_attention_v4.py', 'L9-L21')}>
        flash_attention_v4.py L9-L21
      </Cite>
    ),
  },
  {
    backend: 'tokenspeed_mla',
    from: (
      <>
        TokenSpeed MLA; refuses to start unless the GPU is Blackwell and{' '}
        <code>--kv-cache-dtype</code> is <code>fp8_e4m3</code>.
      </>
    ),
    pin: (
      <>
        <code>tokenspeed_mla</code> 0.1.8
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(PYPROJ, 'L88')}>
          pyproject.toml L88
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(OVR, 'L1171-L1180')}>
          overrides.py L1171-L1180
        </Cite>
      </>
    ),
  },
  {
    backend: 'triton',
    from: "SGLang's own Triton kernels, the portable fallback wherever Triton runs.",
    pin: 'In the sglang tree.',
    src: (
      <Cite tier={1} href={sglangUrl(`${SRT}/layers/attention/triton_backend.py`, 'L163-L180')}>
        triton_backend.py L163-L180
      </Cite>
    ),
  },
  {
    backend: 'aiter',
    from: "AMD's AITER (AI Tensor Engine for ROCm) kernel library.",
    pin: 'Built from a pinned commit in the ROCm image; no pip pin.',
    src: (
      <>
        <Cite tier={1} href={sglangUrl('docker/rocm.Dockerfile', 'L64')}>
          rocm.Dockerfile L64
        </Cite>{' '}
        <Cite
          tier={1}
          href="https://github.com/ROCm/aiter/blob/e7d2453f25e5aaeea72a3a40b284ba453e026624/README.md#L14"
        >
          ROCm/aiter README L14
        </Cite>
      </>
    ),
  },
  {
    backend: 'DeepGEMM (linear layers, not attention)',
    plain: true,
    from: "SGLang's fork of DeepSeek's FP8 (8-bit floating point) GEMM (general matrix multiplication) library.",
    pin: (
      <>
        <code>sgl-deep-gemm</code> 0.2.2
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(PYPROJ, 'L80')}>
          pyproject.toml L80
        </Cite>{' '}
        <Cite tier={1} href="https://github.com/sgl-project/DeepGEMM/tree/v0.2.2">
          sgl-project/DeepGEMM v0.2.2
        </Cite>
      </>
    ),
  },
];

interface PlatformRow {
  platform: string;
  path: ReactNode;
  src: ReactNode;
}

const platformRows: PlatformRow[] = [
  {
    platform: 'NVIDIA GPUs (CUDA)',
    path: 'The generic table and family rules in this section, with the kernel packages above.',
    src: (
      <Cite tier={1} href={sglangUrl(MOB, 'L268-L341')}>
        model_override_base.py L268-L341
      </Cite>
    ),
  },
  {
    platform: 'AMD Instinct (ROCm)',
    path: (
      <>
        <code>aiter</code> attention by default. AITER&apos;s other kernels (norms, activations, FP8
        GEMM, sampling) sit behind <code>SGLANG_USE_AITER</code>, off in code and set to 1 in the
        official ROCm image, so a pip install on ROCm behaves differently from the image. Release
        images exist for MI300-class and MI350-class GPUs.
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(ENV, 'L883')}>
          environ.py L883
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl('docker/rocm.Dockerfile', 'L1150')}>
          rocm.Dockerfile L1150
        </Cite>{' '}
        <Cite tier={1} href="https://github.com/sgl-project/sglang/releases/tag/v0.5.22">
          v0.5.22 release notes
        </Cite>
      </>
    ),
  },
  {
    platform: 'Intel GPUs (XPU)',
    path: (
      <>
        <code>intel_xpu</code> from the separate <code>sglang-kernel-xpu</code> wheel, selected
        explicitly: there is no platform default, so a generic model falls through to{' '}
        <code>triton</code>. Decode CUDA graphs are off unless you pass a graph flag.
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl('python/pyproject_xpu.toml', 'L59')}>
          pyproject_xpu.toml L59
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/platform_hook.py`, 'L113-L148')}>
          platform_hook.py L113-L148
        </Cite>
      </>
    ),
  },
  {
    platform: 'CPU servers',
    path: (
      <>
        <code>intel_amx</code> on x86 with AMX (Advanced Matrix Extensions), from the{' '}
        <code>sglang-kernel-cpu</code> build; <code>torch_native</code> on CPUs without AMX and on
        Arm hosts such as Graviton.
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/platform_hook.py`, 'L151-L166')}>
          platform_hook.py L151-L166
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(OVR, 'L1264-L1273')}>
          overrides.py L1264-L1273
        </Cite>
      </>
    ),
  },
  {
    platform: 'Huawei Ascend NPUs',
    path: (
      <>
        The largest non-CUDA backend in the tree: attention, MoE,
        quantization, a graph runner and an <code>ascend</code> KV transfer engine for PD
        (prefill/decode) disaggregation, with kernels in the separate <code>sgl-kernel-npu</code>{' '}
        project. It has its own Dockerfile and no image in the v0.5.22 release table.
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangTreeUrl(`${SRT}/hardware_backend/npu`)}>
          hardware_backend/npu/
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl('docker/npu.Dockerfile', 'L139-L157')}>
          npu.Dockerfile L139-L157
        </Cite>
      </>
    ),
  },
  {
    platform: 'Apple Silicon',
    path: (
      <>
        <code>SGLANG_USE_MLX=1</code> swaps in an MLX model runner; without it SGLang runs PyTorch
        on MPS with <code>torch_native</code> attention and no overlap
        scheduling. A developer and edge target with no release image.
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(ENV, 'L996')}>
          environ.py L996
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/platform_hook.py`, 'L41-L50')}>
          platform_hook.py L41-L50
        </Cite>
      </>
    ),
  },
];

interface KnobRow {
  flag: string;
  def: ReactNode;
  effect: ReactNode;
  src: ReactNode;
}

const knobRows: KnobRow[] = [
  {
    flag: '--attention-backend',
    def: 'unset, resolved at startup',
    effect: 'One backend for both phases. 25 accepted names, two of them deprecated aliases.',
    src: (
      <>
        <Cite tier={1} href={sglangUrl(EXEC, 'L165-L172')}>
          exec_.py L165-L172
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/choices.py`, 'L69-L101')}>
          choices.py L69-L101
        </Cite>
      </>
    ),
  },
  {
    flag: '--prefill-attention-backend, --decode-attention-backend',
    def: 'unset',
    effect: 'Different values build a split pair, routed per batch by phase.',
    src: (
      <Cite tier={1} href={sglangUrl(EXEC, 'L173-L192')}>
        exec_.py L173-L192
      </Cite>
    ),
  },
  {
    flag: '--page-size',
    def: 'unset, resolved to 1 unless the backend raises it',
    effect: "The radix cache's reuse unit.",
    src: (
      <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/fields/schedule.py`, 'L139-L141')}>
        schedule.py L139-L141
      </Cite>
    ),
  },
  {
    flag: '--linear-attn-backend',
    def: 'triton',
    effect: 'Kernels for the linear layers of hybrid models.',
    src: (
      <Cite tier={1} href={sglangUrl(EXEC, 'L480-L486')}>
        exec_.py L480-L486
      </Cite>
    ),
  },
  {
    flag: '--speculative-attention-mode',
    def: 'prefill',
    effect: 'Which half of a split pair runs speculative draft and verify.',
    src: (
      <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/fields/spec.py`, 'L129-L136')}>
        spec.py L129-L136
      </Cite>
    ),
  },
  {
    flag: 'SGLANG_JIT_DEEPGEMM_FAST_WARMUP',
    def: 'off',
    effect: '1 compiles about 3,000 sampled token counts per shape instead of every one.',
    src: (
      <Cite tier={1} href={sglangUrl(DG, 'L66-L92')}>
        compile_utils.py L66-L92
      </Cite>
    ),
  },
  {
    flag: 'SGLANG_CACHE_DIR',
    def: '~/.cache/sglang',
    effect: 'Root for the DeepGEMM, Triton, Inductor, CUDA, TileLang and FlashInfer caches.',
    src: (
      <Cite tier={1} href={sglangUrl(ENV, 'L2053-L2081')}>
        environ.py L2053-L2081
      </Cite>
    ),
  },
  {
    flag: 'SGLANG_JIT_CACHE_DIR',
    def: 'unset, meaning ~/.cache/sglang/jit',
    effect: 'The tvm-ffi JIT kernel cache. It does not follow SGLANG_CACHE_DIR.',
    src: (
      <Cite tier={1} href={sglangUrl('python/sglang/kernels/jit/utils/compile/cache.py', 'L301-L303')}>
        cache.py L301-L303
      </Cite>
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export function AttentionBackends() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Predict which attention kernel your model gets on a given GPU, the page size that choice sets, which upstream kernel project and pin it runs, and how to keep a cold DeepGEMM compile out of startup (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            8. Attention Backends and Kernels
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An attention backend is the module that computes attention over the paged KV (key and
            value) cache. Every model calls one attention layer, <code>RadixAttention</code>, and that
            layer hands the work to whichever backend the server chose at startup{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/layers/radix_attention.py`, 'L294-L302')}>
              radix_attention.py L294-L302
            </Cite>
            . Three flags can name it, <code>--attention-backend</code> and the per-phase{' '}
            <code>--prefill-attention-backend</code> and <code>--decode-attention-backend</code>, and
            all three are unset by default{' '}
            <Cite tier={1} href={sglangUrl(EXEC, 'L165-L192')}>
              exec_.py L165-L192
            </Cite>
            .
          </Box>
          <Box variant="p">
            The choice decides three things the command line never shows: which kernel runs, which
            KV page size the server uses, and so how finely the radix cache of section 5 reuses
            prefixes, and which upstream kernel project, at which pin, you are running. The challenge
            is to predict all three before launch and confirm them after it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict a new model's backend in two lookups: its override module first, then the GPU table"
          >
            Model family first, GPU generation second
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The backend is resolved at startup in a fixed order{' '}
            <Cite tier={1} href={sglangUrl(PIPE, 'L196-L246')}>
              pipeline.py L196-L246
            </Cite>
            . Platform hooks run first and set a backend for CPU servers and Ascend NPUs (neural
            processing units): <code>intel_amx</code> on x86 CPUs, <code>torch_native</code> on Arm
            CPUs, <code>ascend</code> on Ascend NPUs{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/platform_hook.py`, 'L151-L176')}>
              platform_hook.py L151-L176
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/hardware_backend/npu/utils.py`, 'L80-L95')}>
              npu/utils.py L80-L95
            </Cite>
            . On CUDA and ROCm (AMD&apos;s GPU stack) GPUs, the 33 per-architecture override modules
            come next, each holding the rules for one model family{' '}
            <Cite tier={1} href={sglangTreeUrl(MODEL_OVR)}>
              arg_groups/model_overrides/
            </Cite>
            . Only a model whose module leaves the backend unset reaches the generic table, which
            reads the GPU generation and then the attention type{' '}
            <Cite tier={1} href={sglangUrl(MOB, 'L268-L341')}>
              model_override_base.py L268-L341
            </Cite>
            . Page-size and KV-dtype constraints run last, and can raise <code>--page-size</code> or
            reject the combination.
          </Box>
          <Box variant="p">
            The generic table splits by attention type. MHA and GQA (multi-head and grouped-query
            attention) covers Llama-style and Qwen dense models; MLA (multi-head latent attention) is
            the DeepSeek-family design. SM90 (compute capability 9.0, Hopper: H100, H200) with CUDA
            12.3 or later gets <code>fa3</code> (FlashAttention 3) for both. SM100 and SM103 (compute
            capability 10.0 and 10.3, datacenter Blackwell: B200, GB200, B300) give MHA models{' '}
            <code>trtllm_mha</code>, the TensorRT-LLM (TRT-LLM) attention kernels, or <code>fa4</code>{' '}
            (FlashAttention 4) when the model&apos;s K and V head widths differ, and give MLA models{' '}
            <code>flashinfer</code>. ROCm GPUs get <code>aiter</code>, and Apple MPS (Metal
            Performance Shaders) gets <code>torch_native</code>. Everything else takes the last
            branch: <code>flashinfer</code> for MHA, or <code>triton</code> when
            FlashInfer is missing or the model has attention sinks, and <code>triton</code> for MLA{' '}
            <Cite tier={1} href={sglangUrl(MOB, 'L268-L341')}>
              model_override_base.py L268-L341
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/utils/common.py`, 'L285-L306')}>
              utils/common.py L285-L306
            </Cite>
            . That branch includes SM8x (compute capability 8.x: A100, L4, L40S) and SM120 (compute
            capability 12.0: RTX PRO 6000 and RTX PRO 4500 Blackwell), which get none of the
            datacenter Blackwell defaults{' '}
            <Cite tier={1} href="https://developer.nvidia.com/cuda/gpus">
              NVIDIA: CUDA GPUs and compute capability
            </Cite>
            .
          </Box>
          <BackendSelectionDiagram />
          <Box variant="small" color="text-body-secondary">
            Read from source, not measured. The five family rules are examples from the 33 override
            modules. Apple MPS takes <code>torch_native</code> from the generic step, and Intel GPUs,
            which have no default, fall through to <code>triton</code>. After this tree, the page-size
            rules in the next block run and can raise the page size further.
          </Box>
          <Box variant="p">
            The DeepSeek V3 family on SM100 gets <code>trtllm_mla</code>, a rule also registered
            for Kimi K2.5, Mistral Large 3 and other MLA models{' '}
            <Cite tier={1} href={sglangUrl(`${MODEL_OVR}/deepseek_v2.py`, 'L35-L50')}>
              deepseek_v2.py L35-L50
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(`${MODEL_OVR}/deepseek_v2.py`, 'L179-L191')}>
              deepseek_v2.py L179-L191
            </Cite>
            . Models with DeepSeek Sparse Attention (DSA), such as DeepSeek V3.2 and GLM-5, get{' '}
            <code>dsa</code>{' '}
            <Cite tier={1} href={sglangUrl(`${MODEL_OVR}/deepseek_v2.py`, 'L99-L112')}>
              deepseek_v2.py L99-L112
            </Cite>
            , and DeepSeek V4 always gets <code>dsv4</code>{' '}
            <Cite tier={1} href={sglangUrl(`${MODEL_OVR}/deepseek_v4.py`, 'L20-L24')}>
              deepseek_v4.py L20-L24
            </Cite>
            . GPT-OSS has a rule per platform, because the generic table avoids FlashInfer for models
            with attention sinks{' '}
            <Cite tier={1} href={sglangUrl(`${MODEL_OVR}/gpt_oss.py`, 'L24-L44')}>
              gpt_oss.py L24-L44
            </Cite>
            .
          </Box>
          <Box variant="p">
            Hybrid models mix full-attention layers with linear-attention or state-space layers, and
            take a second backend for the linear layers, <code>--linear-attn-backend</code>, default{' '}
            <code>triton</code>{' '}
            <Cite tier={1} href={sglangUrl(EXEC, 'L480-L486')}>
              exec_.py L480-L486
            </Cite>
            . For the Qwen3.5 and Qwen3-Next hybrids on SM100, the full-attention layers get{' '}
            <code>triton</code> with page size 1 when token-level prefix caching is possible (radix
            cache on, no Mamba extra buffer, no speculation), and <code>trtllm_mha</code> with 64-token
            pages otherwise{' '}
            <Cite tier={1} href={sglangUrl(`${MODEL_OVR}/qwen3_5.py`, 'L17-L48')}>
              qwen3_5.py L17-L48
            </Cite>
            .
          </Box>
          <Box variant="p">
            The choice can also be split by phase. Different values for the two per-phase flags build
            both backends inside one <code>HybridAttnBackend</code>, which sends decode batches to the
            decode backend and prefill batches to the prefill backend, and SGLang logs that the split
            is experimental{' '}
            <Cite
              tier={1}
              href={sglangUrl(`${SRT}/model_executor/model_runner_components/attention_backend_setup.py`, 'L199-L247')}
            >
              attention_backend_setup.py L199-L247
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/layers/attention/hybrid_attn_backend.py`, 'L64-L88')}>
              hybrid_attn_backend.py L64-L88
            </Cite>
            . The documented example pairs FA4 prefill with TRT-LLM MLA decode on Blackwell{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(AB_DOC, 'L512-L524')}>
              SGLang docs: attention backend (v0.5.22 source)
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know how finely the radix cache reuses prefixes on your GPU before you size shared prompts: to the token on H100, in 64-token pages on B200, for the same Llama deployment"
          >
            The backend sets the page size
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <code>--page-size</code> defaults to 1 token (64 on Moore Threads GPUs, and on ROCm
            with <code>SGLANG_AITER_KV_CACHE_LAYOUT=vectorized_5d</code>), and a backend that needs
            pages raises it{' '}
            <Cite tier={1} href={sglangUrl(OVR, 'L1304-L1326')}>
              overrides.py L1304-L1326
            </Cite>
            . The radix cache matches whole pages only{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/mem_cache/radix_cache.py`, 'L147-L151')}>
              radix_cache.py L147-L151
            </Cite>
            , so choosing a backend also chooses how finely prefixes are reused.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'backend', header: 'Backend', cell: (r: PageRow) => <code>{r.backend}</code> },
              { id: 'page', header: 'Page size it sets', cell: (r: PageRow) => r.page },
              { id: 'src', header: 'Source', cell: (r: PageRow) => r.src },
            ]}
            items={pageRows}
          />
          <Box variant="p">
            Moving the same Llama deployment from H100 (<code>fa3</code>, page 1) to B200 (
            <code>trtllm_mha</code>, page 64) therefore changes prefix reuse from token-exact to
            64-token steps, with no flag change, by our reading of the default chain in code{' '}
            <Cite tier={1} href={sglangUrl(MOB, 'L268-L341')} kind="code">
              model_override_base.py L268-L341
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(OVR, 'L1125-L1137')} kind="code">
              overrides.py L1125-L1137
            </Cite>
            . A prompt shorter than one page is never matched: with 64-token pages a 32-token system
            prompt is never cached, and a 65-token prefix reuses only its first 64 tokens{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(AB_DOC, 'L321-L323')}>
              SGLang docs: attention backend (v0.5.22 source)
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/mem_cache/radix_cache.py`, 'L182-L220')}>
              radix_cache.py L182-L220
            </Cite>
            . On a TRT-LLM or FlashMLA backend, size shared prefixes to page multiples. Section 6 (KV
            Memory and the Defaults Your GPU Picks) covers when a smaller accepted page, such as{' '}
            <code>--page-size 16</code> on <code>trtllm_mha</code>, is worth passing.
          </Box>
          <Box variant="p">
            Speculative decoding moves the default. Tree speculation is speculation where the draft
            proposes several candidate tokens per step (<code>topk</code> above 1; section 11,
            Speculative Decoding){' '}
            <Cite tier={1} href={sglangDocsSrcUrl(AB_DOC, 'L318')}>
              SGLang docs: attention backend (v0.5.22 source)
            </Cite>
            . With <code>--speculative-eagle-topk</code> above 1, or topk 1 with an explicit page size
            above 1, Hopper and B200 MHA models drop to <code>flashinfer</code> (<code>triton</code>{' '}
            without FlashInfer) and page size 1{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/utils/common.py`, 'L4014-L4020')}>
              utils/common.py L4014-L4020
            </Cite>
            . On B200 the code goes one step further: with speculation on and{' '}
            <code>--speculative-eagle-topk</code> left unset, the default is also{' '}
            <code>flashinfer</code>, because the backend is resolved before SGLang fills in its
            automatic draft shape{' '}
            <Cite tier={1} href={sglangUrl(MOB, 'L303-L311')} kind="code">
              model_override_base.py L303-L311
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(PIPE, 'L232-L294')} kind="code">
              pipeline.py L232-L294
            </Cite>
            . To keep <code>trtllm_mha</code> under speculation on B200, set{' '}
            <code>--speculative-num-steps</code> and <code>--speculative-eagle-topk 1</code> yourself{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/speculative_hook.py`, 'L1068-L1090')} kind="code">
              speculative_hook.py L1068-L1090
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Tell whether an upstream kernel fix has reached your deployment: each backend name routes to one upstream project at one pin"
          >
            Where each kernel comes from
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Most backend names are routes to an upstream kernel project, and each project arrives
            through its own package and pin. A fix upstream reaches a deployment when that pin moves.
            CuTe DSL, which appears twice below, is NVIDIA&apos;s Python DSL (domain-specific
            language) for CUDA kernels, compiled at runtime.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              {
                id: 'backend',
                header: 'Backend',
                cell: (r: SourceRow) => (r.plain ? r.backend : <code>{r.backend}</code>),
              },
              { id: 'from', header: 'Kernels come from', cell: (r: SourceRow) => r.from },
              { id: 'pin', header: 'Package and pin at v0.5.22', cell: (r: SourceRow) => r.pin },
              { id: 'src', header: 'Source', cell: (r: SourceRow) => r.src },
            ]}
            items={sourceRows}
          />
          <Box variant="p">
            <code>sglang-kernel</code> is the AOT (ahead-of-time) kernel wheel, imported as{' '}
            <code>sgl_kernel</code>, with its source at <code>python/sglang/kernels/aot/</code>{' '}
            <Cite tier={1} href={sglangUrl(`${AOT}/pyproject.toml`, 'L10-L11')}>
              aot/pyproject.toml L10-L11
            </Cite>
            . It compiles in pinned NVIDIA CUTLASS (CUDA Templates for Linear Algebra Subroutines), parts of FlashInfer and SGLang&apos;s FlashAttention
            3 and FlashMLA forks{' '}
            <Cite tier={1} href={sglangUrl(`${AOT}/CMakeLists.txt`, 'L52-L89')}>
              CMakeLists.txt L52-L89
            </Cite>
            . So FA3 and FlashMLA move with <code>sglang-kernel</code>, while <code>flashinfer</code>{' '}
            and the <code>trtllm_*</code> backends move with the separate{' '}
            <code>flashinfer_python</code> pin, and a pinned <code>sglang</code> release pins both
            exactly{' '}
            <Cite tier={1} href={sglangUrl(PYPROJ, 'L41-L88')}>
              pyproject.toml L41-L88
            </Cite>
            . To check which kernel build you run, read those two versions in the image.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Keep a block-FP8 model's first start from spending the 10 to 20 minutes SGLang's own log warning estimates for a cold DeepGEMM compile"
          >
            Move kernel compilation to build time
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            DeepGEMM is DeepSeek&apos;s FP8 GEMM library for linear layers. SGLang uses its fork whenever the GPU is SM90 or newer, the
            package imports and <code>SGLANG_ENABLE_JIT_DEEPGEMM</code> is not set to 0{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/layers/deep_gemm_wrapper/configurer.py`, 'L32-L56')}>
              configurer.py L32-L56
            </Cite>
            . Under the default <code>--fp8-gemm-backend auto</code>, block-quantized FP8 linear
            layers try DeepGEMM first, so on H100 and B200 a DeepSeek-style block-FP8 checkpoint runs
            them on DeepGEMM{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/layers/quantization/fp8_utils.py`, 'L1025-L1053')}>
              fp8_utils.py L1025-L1053
            </Cite>
            .
          </Box>
          <Box variant="p">
            Its kernels are specialised per GEMM shape and per token count. The first time a server
            meets a weight shape, the first rank on each node compiles that shape for every token
            count from 1 to 16,384 at default chunk sizes, into <code>~/.cache/sglang/deep_gemm</code>{' '}
            <Cite tier={1} href={sglangUrl(DG, 'L59-L113')}>
              compile_utils.py L59-L113
            </Cite>
            . The compile runs inside startup, before the server is ready.{' '}
            <strong>
              SGLang&apos;s own log warning estimates it at 10 to 20 minutes, with no hardware or
              model stated
            </strong>
            , and the same code&apos;s per-shape log line says about 1 second once the precompile has
            run{' '}
            <Cite tier={1} href={sglangUrl(DG, 'L166-L185')}>
              compile_utils.py L166-L185 (project estimate)
            </Cite>
            . The DeepSeek V3 cookbook gives about 10 minutes, also with no hardware stated{' '}
            <Cite tier={1} href={sglangUrl('docs/cookbook/autoregressive/DeepSeek/DeepSeek-V3.mdx', 'L72-L74')}>
              SGLang cookbook: DeepSeek V3 (v0.5.22 source, project estimate)
            </Cite>
            . Health checks and autoscaler timeouts have to allow for it, or the cache has to exist
            before the server starts.
          </Box>
          <Box variant="p">
            <code>python -m sglang.compile_deep_gemm</code> builds that cache. It takes the same
            arguments as <code>launch_server</code>, starts a real server with CUDA graphs and
            torch.compile off, sends one short request so every GEMM shape is compiled, then exits{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/compile_deep_gemm.py', 'L1-L48')}>
              compile_deep_gemm.py L1-L48
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/compile_deep_gemm.py', 'L108-L206')}>
              compile_deep_gemm.py L108-L206
            </Cite>
            . Run it once per model, parallel layout and image, with the exact serving flags, for
            example while building the container or AMI (Amazon Machine Image).
          </Box>
          <Box variant="p">
            Keep the result on a persistent volume. Importing <code>sglang</code> points the Triton,
            Inductor, CUDA, TileLang and FlashInfer caches at <code>SGLANG_CACHE_DIR</code> (default{' '}
            <code>~/.cache/sglang</code>) unless those variables are already set, and the DeepGEMM
            cache lives under it too{' '}
            <Cite tier={1} href={sglangUrl(ENV, 'L2053-L2081')}>
              environ.py L2053-L2081
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(ENV, 'L1232-L1247')}>
              environ.py L1232-L1247
            </Cite>
            . The exception is the JIT (just-in-time) cache for SGLang&apos;s C++ and CUDA kernels,
            which compile on the serving host through Apache tvm-ffi: it stays at{' '}
            <code>~/.cache/sglang/jit</code> when <code>SGLANG_CACHE_DIR</code> moves, so set{' '}
            <code>SGLANG_JIT_CACHE_DIR</code> as well{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/kernels/jit/utils/compile/loader.py', 'L48-L60')}>
              jit loader.py L48-L60
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/kernels/jit/utils/compile/cache.py', 'L301-L303')}>
              cache.py L301-L303
            </Cite>
            .
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
            <code>{`export SGLANG_CACHE_DIR=/mnt/cache/sglang
export SGLANG_JIT_CACHE_DIR=/mnt/cache/sglang/jit
# same flags you will serve with; usage line from compile_deep_gemm.py
python3 -m sglang.compile_deep_gemm --model deepseek-ai/DeepSeek-V3 --tp 8 --trust-remote-code`}</code>
          </pre>
          <Box variant="p">
            Section 19 (SGLang on SageMaker AI and HyperPod) joins this step to SageMaker&apos;s
            startup health-check window.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know which backend choices switch CUDA graphs off, and why attention sits outside the prefill graph"
          >
            CUDA graphs around the attention kernel
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Decode runs one full CUDA graph per captured batch size, and prefill uses a breakable
            graph by default on CUDA{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/model_executor/cuda_graph_config.py`, 'L119-L153')}>
              cuda_graph_config.py L119-L153
            </Cite>
            . A breakable graph is a chain of graph segments with eager calls between them, and
            attention is the eager break, because its shapes depend on each request&apos;s prefix and
            length{' '}
            <Cite
              tier={1}
              href={sglangUrl(
                `${SRT}/model_executor/runner_backend_utils/breakable_cuda_graph/breakable_cuda_graph.py`,
                'L222-L322'
              )}
            >
              breakable_cuda_graph.py L222-L322
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/layers/radix_attention.py`, 'L740-L825')}>
              radix_attention.py L740-L825
            </Cite>
            . By our reading, the attention backend therefore changes prefill graph coverage less than
            the GEMM and MoE (mixture of experts) kernels between attention calls do. Section 6 sizes the decode graphs.
          </Box>
          <ul>
            <li>
              <code>torch_native</code> and <code>flex_attention</code> turn CUDA graphs off for both
              phases, so treat them as correctness references{' '}
              <Cite tier={1} href={sglangUrl(ATTN_HOOK, 'L121-L160')}>
                attention_hook.py L121-L160
              </Cite>
              .
            </li>
            <li>
              DeepSeek V3 on <code>trtllm_mla</code>, the B200 default, has its prefill graph turned
              off unless you set the prefill graph backend yourself, because a captured prefill graph
              forces a FlashAttention fallback for prefill{' '}
              <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/cuda_graph_hook.py`, 'L241-L270')}>
                cuda_graph_hook.py L241-L270
              </Cite>
              .
            </li>
            <li>
              With a split pair, decode graphs are captured on the decode backend, and speculative
              verification runs on the prefill backend by default{' '}
              <Cite tier={1} href={sglangUrl(`${SRT}/layers/attention/hybrid_attn_backend.py`, 'L131-L137')}>
                hybrid_attn_backend.py L131-L137
              </Cite>
              . The documentation recommends <code>--speculative-attention-mode decode</code>, so draft
              and verify share the graph-captured decode kernel{' '}
              <Cite tier={1} href={sglangDocsSrcUrl(AB_DOC, 'L526-L538')}>
                SGLang docs: attention backend (v0.5.22 source)
              </Cite>
              .
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know which hardware path applies on AWS before opening any platform guide"
          >
            Hardware beyond NVIDIA
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ul>
            <li>
              <strong>NVIDIA GPUs are SGLang&apos;s path on EC2.</strong> SGLang&apos;s ROCm images
              build for AMD Instinct gfx942 and gfx950 GPUs{' '}
              <Cite tier={1} href={sglangUrl('.github/workflows/release-docker-amd.yml', 'L33')}>
                release-docker-amd.yml L33
              </Cite>
              , and the EC2 accelerated-computing spec page read for this dive lists no AMD Instinct
              instance{' '}
              <Cite tier={1} href="https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html">
                Amazon EC2 accelerated computing instance specifications
              </Cite>
              .
            </li>
            <li>
              <strong>Trainium</strong> is listed as in progress in the README{' '}
              <Cite tier={1} href={sglangUrl('README.md', 'L58')}>
                README.md L58
              </Cite>
              ; section 19 (SGLang on SageMaker AI and HyperPod) carries the full statement and the
              path to use today.
            </li>
            <li>
              <strong>TPUs</strong> (Tensor Processing Units): the TPU guide routes them to SGLang-JAX,
              a separate JAX engine in the same GitHub organisation{' '}
              <Cite tier={1} href={sglangDocsSrcUrl('hardware-platforms/tpu', 'L5-L9')}>
                SGLang docs: TPU (v0.5.22 source)
              </Cite>
              , whose releases are all marked prerelease, the newest <code>v0.1.0rc0</code> at the
              research date{' '}
              <Cite tier={1} href="https://github.com/sgl-project/sglang-jax/tree/v0.1.0rc0">
                sglang-jax v0.1.0rc0
              </Cite>
              . The README also names SGL-torchtpu, which has no code in the v0.5.22 tree{' '}
              <Cite tier={1} href={sglangUrl('README.md', 'L52')} kind="code">
                README.md L52
              </Cite>
              .
            </li>
          </ul>
          <ExpandableSection headerText="Coverage by platform: default backend, kernel package and how it ships">
            <Table
              variant="embedded"
              wrapLines
              columnDefinitions={[
                { id: 'platform', header: 'Platform', minWidth: 150, cell: (r: PlatformRow) => r.platform },
                { id: 'path', header: 'What SGLang v0.5.22 runs', cell: (r: PlatformRow) => r.path },
                { id: 'src', header: 'Source', cell: (r: PlatformRow) => r.src },
              ]}
              items={platformRows}
            />
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read the startup lines that name the backend and page size, then pin a flag when you need a different answer"
          >
            Confirm what you got before you serve
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The startup log names both answers. The <code>server_args=</code> line prints the
            resolved arguments, <code>attention_backend</code> and <code>page_size</code> among them{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/entrypoints/engine.py`, 'L1179')} kind="code">
              engine.py L1179
            </Cite>
            . <code>Attention backend not specified. Use X backend by default.</code> appears only
            when the generic table decided{' '}
            <Cite tier={1} href={sglangUrl(OVR, 'L1068-L1080')}>
              overrides.py L1068-L1080
            </Cite>
            , while family rules log their own line, such as{' '}
            <code>Use trtllm_mla as attention backend on sm100 for DeepseekV3ForCausalLM</code>{' '}
            <Cite tier={1} href={sglangUrl(`${MODEL_OVR}/deepseek_v2.py`, 'L188-L190')}>
              deepseek_v2.py L188-L190
            </Cite>
            . A backend that raised the page size logs a warning that begins{' '}
            <code>TensorRT-LLM MHA only supports page_size of 16, 32, 64 or 128</code>, or the
            equivalent for its own backend{' '}
            <Cite tier={1} href={sglangUrl(OVR, 'L1085-L1150')}>
              overrides.py L1085-L1150
            </Cite>
            .
          </Box>
          <Table
            variant="embedded"
            wrapLines
            header={<Header variant="h3">The knobs this section explains</Header>}
            columnDefinitions={[
              { id: 'flag', header: 'Flag or variable', cell: (r: KnobRow) => <code>{r.flag}</code> },
              { id: 'def', header: 'Default at v0.5.22', cell: (r: KnobRow) => r.def },
              { id: 'effect', header: 'What it changes', cell: (r: KnobRow) => r.effect },
              { id: 'src', header: 'Source', cell: (r: KnobRow) => r.src },
            ]}
            items={knobRows}
          />
          <ExpandableSection headerText="Where the attention-backend documentation and v0.5.22's code differ">
            <ul>
              <li>
                The documentation lists TRT-LLM MHA page sizes as 16, 32 or 64{' '}
                <Cite tier={1} href={sglangDocsSrcUrl(AB_DOC, 'L325')} kind="doc-code-conflict">
                  SGLang docs: attention backend (v0.5.22 source)
                </Cite>
                ; v0.5.22&apos;s code also accepts 128, which uses the dynamic tokens-per-page kernels
                and needs GQA with equal Q, K and V head widths{' '}
                <Cite tier={1} href={sglangUrl(OVR, 'L1124-L1137')}>
                  overrides.py L1124-L1137
                </Cite>
                , so 128 is a valid <code>--page-size</code> on <code>trtllm_mha</code>.
              </li>
              <li>
                The documentation says Blackwell defaults MHA models to <code>trtllm_mha</code> unless
                speculation uses topk above 1, and MLA models to <code>flashinfer</code>{' '}
                <Cite tier={1} href={sglangDocsSrcUrl(AB_DOC, 'L547-L559')} kind="doc-code-conflict">
                  SGLang docs: attention backend (v0.5.22 source)
                </Cite>
                ; in v0.5.22&apos;s code that holds for SM100 and SM103 only, SM120 gets{' '}
                <code>flashinfer</code> for MHA and <code>triton</code> for MLA, MHA models with
                differing K and V widths get <code>fa4</code>, and speculation with topk unset also
                leaves <code>trtllm_mha</code>{' '}
                <Cite tier={1} href={sglangUrl(MOB, 'L293-L341')}>
                  model_override_base.py L293-L341
                </Cite>
                . On SM120 GPUs, read the last branch of the generic table.
              </li>
              <li>
                The support matrix still lists Cutlass MLA (page 128) and Dual Chunk FlashAttention{' '}
                <Cite tier={1} href={sglangDocsSrcUrl(AB_DOC, 'L325-L330')} kind="doc-code-conflict">
                  SGLang docs: attention backend (v0.5.22 source)
                </Cite>
                ; both were removed in v0.5.20{' '}
                <Cite tier={1} href="https://github.com/sgl-project/sglang/releases/tag/v0.5.20">
                  v0.5.20 release notes
                </Cite>{' '}
                and neither is an accepted <code>--attention-backend</code> value at v0.5.22{' '}
                <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/choices.py`, 'L69-L101')}>
                  choices.py L69-L101
                </Cite>
                .
              </li>
              <li>
                For hybrid linear-attention models, the documentation allows only <code>triton</code>,{' '}
                <code>trtllm_mha</code> or <code>fa4</code> on SM100, and <code>trtllm_mha</code> for
                decode only on SM120{' '}
                <Cite tier={1} href={sglangDocsSrcUrl(AB_DOC, 'L398-L405')} kind="doc-code-conflict">
                  SGLang docs: attention backend (v0.5.22 source)
                </Cite>
                ; v0.5.22&apos;s code also accepts <code>flashinfer</code> on SM100 and{' '}
                <code>trtllm_mha</code> for SM120 prefill, except that SM120 TRT-LLM prefill rejects
                an FP8 KV cache{' '}
                <Cite tier={1} href={sglangUrl(REG, 'L455-L472')}>
                  attention_registry.py L455-L472
                </Cite>{' '}
                <Cite tier={1} href={sglangUrl(ATTN_HOOK, 'L198-L217')}>
                  attention_hook.py L198-L217
                </Cite>
                .
              </li>
              <li>
                The documentation calls <code>tilelang</code> the ROCm default for DSA{' '}
                <Cite tier={1} href={sglangDocsSrcUrl(AB_DOC, 'L472-L476')} kind="doc-code-conflict">
                  SGLang docs: attention backend (v0.5.22 source)
                </Cite>
                ; v0.5.22 defaults both DSA phases to <code>triton</code> on ROCm and picks{' '}
                <code>tilelang</code> only with <code>--enable-hisparse</code>{' '}
                <Cite tier={1} href={sglangUrl(OVR, 'L684-L689')}>
                  overrides.py L684-L689
                </Cite>{' '}
                <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/hisparse_hook.py`, 'L26-L29')}>
                  hisparse_hook.py L26-L29
                </Cite>
                , so pass <code>--dsa-prefill-backend tilelang --dsa-decode-backend tilelang</code> to
                get it.
              </li>
              <li>
                The MLA support matrix marks FlashMLA as able to use an FP4 (4-bit floating point) KV
                cache{' '}
                <Cite tier={1} href={sglangDocsSrcUrl(AB_DOC, 'L222-L229')} kind="doc-code-conflict">
                  SGLang docs: attention backend (v0.5.22 source)
                </Cite>
                ; v0.5.22&apos;s FP4 KV check accepts only <code>flashinfer</code> or{' '}
                <code>trtllm_mla</code> for MLA, so <code>flashmla</code> with an FP4 KV cache fails at
                startup{' '}
                <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/kv_cache_hook.py`, 'L254-L310')}>
                  kv_cache_hook.py L254-L310
                </Cite>
                . Section 9 (Quantization and KV Precision) covers the KV formats.
              </li>
            </ul>
          </ExpandableSection>
          <Box variant="p">
            <strong>Where to start:</strong> before launch, find your model&apos;s module under{' '}
            <code>arg_groups/model_overrides/</code>, then its row in the generic table, and note the
            page size that answer carries. After launch, read <code>attention_backend</code> and{' '}
            <code>page_size</code> on the <code>server_args=</code> line. On B200 with shared prefixes
            shorter than 64 tokens or not page-aligned, read section 6 before accepting the 64-token
            default. For a block-FP8 model on SM90 or newer, run{' '}
            <code>python -m sglang.compile_deep_gemm</code> with the serving flags at build time and
            keep <code>SGLANG_CACHE_DIR</code> and <code>SGLANG_JIT_CACHE_DIR</code> on persistent
            storage, so the first start skips the compile SGLang&apos;s own log warning puts at 10 to
            20 minutes for an unstated model and GPU.
          </Box>
          <Box variant="p">
            <strong>Against vLLM:</strong> on H100 both engines default a dense model to FlashAttention
            3, and on B200 both land in FlashInfer, SGLang through its own <code>trtllm_mha</code>{' '}
            wrapper{' '}
            <Cite tier={1} href={sglangUrl(MOB, 'L293-L324')}>
              model_override_base.py L293-L324
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/platforms/cuda.py', 'L154-L179')}>
              vLLM cuda.py L154-L179
            </Cite>
            . The kernels are close to parity, and the page size is the practical difference: 64-token
            pages in SGLang on B200 against vLLM&apos;s default 16-token blocks{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L333-L334')}>
              vLLM cache.py L333-L334
            </Cite>
            . SGLang resolves the backend from fixed rules, model family first, where vLLM walks a
            per-GPU priority list and asks each candidate to validate the configuration (
            <Link href="../vllm/">vLLM dive, section 14: Inside the Codebase</Link>;{' '}
            <Link href="../vllm/">vLLM dive, section 5: Paged KV Cache &amp; Block Tables</Link>).
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
