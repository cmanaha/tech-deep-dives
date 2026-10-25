import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangDocsSrcUrl } from '../components/Cite';

/* Source paths at v0.5.22 (repo root relative). */
const MODEL_CONFIG = 'python/sglang/srt/configs/model_config.py';
const QUANT_INIT = 'python/sglang/srt/layers/quantization/__init__.py';
const CHOICES = 'python/sglang/srt/arg_groups/choices.py';
const ARG_UTILS = 'python/sglang/srt/arg_groups/arg_utils.py';
const MODEL_FIELDS = 'python/sglang/srt/arg_groups/fields/model.py';
const EXEC_FIELDS = 'python/sglang/srt/arg_groups/fields/exec_.py';
const OVERRIDES = 'python/sglang/srt/arg_groups/overrides.py';
const KV_HOOK = 'python/sglang/srt/arg_groups/kv_cache_hook.py';
const ATTN_DEFAULTS = 'python/sglang/srt/arg_groups/model_override_base.py';
const WEIGHT_UTILS = 'python/sglang/srt/model_loader/weight_utils.py';
const LOADER = 'python/sglang/srt/model_loader/loader.py';
const Q = 'python/sglang/srt/layers/quantization';
const FP8 = `${Q}/fp8.py`;
const FP8_UTILS = `${Q}/fp8_utils.py`;
const FP4_UTILS = `${Q}/fp4_utils.py`;
const MARLIN_FP8 = `${Q}/marlin_utils_fp8.py`;
const MODELOPT = `${Q}/modelopt_quant.py`;
const W8A8_FP8 = `${Q}/w8a8_fp8.py`;
const W8A8_INT8 = `${Q}/w8a8_int8.py`;
const W4AFP8 = `${Q}/w4afp8.py`;
const NVFP4_ONLINE = `${Q}/nvfp4_online.py`;
const MXFP4 = `${Q}/mxfp4.py`;
const AWQ = `${Q}/awq/awq.py`;
const GPTQ = `${Q}/gptq/gptq.py`;
const BLOCK_INT8 = `${Q}/blockwise_int8.py`;
const BNB = `${Q}/bitsandbytes.py`;
const GGUF = `${Q}/gguf.py`;
const UNQUANT = `${Q}/unquant.py`;
const KV_DTYPE = 'python/sglang/srt/mem_cache/kv_cache_dtype.py';
const MEM_POOL = 'python/sglang/srt/mem_cache/memory_pool.py';
const POOL_CONF = 'python/sglang/srt/model_executor/pool_configurator.py';
const MODEL_RUNNER = 'python/sglang/srt/model_executor/model_runner.py';
const LOAD_UTILS = 'python/sglang/srt/model_executor/model_runner_components/load_model_utils.py';
const PD_CONN = 'python/sglang/srt/disaggregation/common/conn.py';
const FP8_KERNEL = 'python/sglang/kernels/ops/quantization/fp8_kernel.py';
const SPARSE_MLA = 'python/sglang/kernels/ops/attention/dsa/triton_sparse_mla.py';

const QUANT_DOC = 'advanced_features/quantization';
const KVQ_DOC = 'advanced_features/quantized_kv_cache';
const ATTN_DOC = 'advanced_features/attention_backend';

const NVIDIA_CC = 'https://developer.nvidia.com/cuda/gpus';
const EC2_SPECS = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';

const VLLM_QUANT_LINK = (
  <Link href="../vllm/">vLLM dive, section 8: Quantization &amp; Precision</Link>
);

/* ------------------------------------------------------------------------ */
/* Format-by-GPU table                                                      */
/* ------------------------------------------------------------------------ */

interface FormatRow {
  id: string;
  format: ReactNode;
  floor: ReactNode;
  refused: ReactNode;
  runs: ReactNode;
  src: ReactNode;
}

const FORMAT_ROWS: FormatRow[] = [
  {
    id: 'fp8',
    format: (
      <>
        <code>fp8</code>: FP8 checkpoints (per-tensor, per-channel or 128x128 blocks), and{' '}
        <code>--quantization fp8</code> on a BF16 checkpoint
      </>
    ),
    floor: 'SM80',
    refused: 'None',
    runs: (
      <>
        SM80 to SM88 (P4d, P4de, G5): FP8 weights, 16-bit math through Marlin in the linear layers.
        SM89 and newer: FP8 math; block-FP8 layers run DeepGEMM on H100 and B200,{' '}
        <code>cutlass</code> on SM120
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(FP8, 'L323-L333')}>
          fp8.py L323-L333
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(FP8_UTILS, 'L2540-L2546')} kind="code">
          fp8_utils.py L2540-L2546
        </Cite>
      </>
    ),
  },
  {
    id: 'modelopt-fp8',
    format: (
      <>
        <code>modelopt_fp8</code> (ModelOpt FP8 checkpoints) and <code>w8a8_fp8</code>
      </>
    ),
    floor: 'SM89',
    refused: 'P4d, P4de, G5',
    runs: 'FP8 math',
    src: (
      <>
        <Cite tier={1} href={sglangUrl(MODELOPT, 'L461-L462')}>
          modelopt_quant.py L461-L462
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(W8A8_FP8, 'L66-L67')}>
          w8a8_fp8.py L66-L67
        </Cite>
      </>
    ),
  },
  {
    id: 'w4afp8',
    format: (
      <>
        <code>w4afp8</code> (4-bit weights, FP8 activations)
      </>
    ),
    floor: 'SM90',
    refused: 'P4d, P4de, G5, G6, G6e',
    runs: 'Hopper and newer',
    src: (
      <Cite tier={1} href={sglangUrl(W4AFP8, 'L70-L71')}>
        w4afp8.py L70-L71
      </Cite>
    ),
  },
  {
    id: 'nvfp4',
    format: (
      <>
        <code>modelopt_fp4</code> (NVFP4 checkpoints)
      </>
    ),
    floor: 'SM80',
    refused: 'None',
    runs: (
      <>
        Marlin W4A16 (4-bit weights, 16-bit math) on SM80 to SM9x, which covers P4d, P4de, G5, G6,
        G6e and the P5 family; <code>flashinfer_cutedsl</code> on SM100 and SM103 (P6);{' '}
        <code>flashinfer_cutlass</code> otherwise, including SM120 (G7e, G7)
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(MODELOPT, 'L1528-L1529')}>
          modelopt_quant.py L1528-L1529
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(FP4_UTILS, 'L149-L162')}>
          fp4_utils.py L149-L162
        </Cite>
      </>
    ),
  },
  {
    id: 'blackwell',
    format: (
      <>
        <code>mxfp8</code> weights (checkpoint or online) and <code>nvfp4_online</code> (MoE
        experts quantized at load)
      </>
    ),
    floor: 'SM100',
    refused: 'P4d, P4de, G5, G6, G6e, P5, P5e, P5en',
    runs: (
      <>
        The P6 family. G7e and G7 (SM120) clear the numeric floor; the kernels behind these two
        paths on SM120 were not checked in this research
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(FP8, 'L323-L333')}>
          fp8.py L323-L333
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(NVFP4_ONLINE, 'L108-L109')}>
          nvfp4_online.py L108-L109
        </Cite>
      </>
    ),
  },
  {
    id: 'int4',
    format: (
      <>
        GPTQ and AWQ checkpoints (served as <code>gptq_marlin</code>, <code>awq_marlin</code>),{' '}
        <code>mxfp4</code>, <code>blockwise_int8</code>
      </>
    ),
    floor: 'SM80',
    refused: 'None',
    runs: (
      <>
        GPTQ and AWQ through Marlin. <code>mxfp4</code> off SM100 and <code>blockwise_int8</code>{' '}
        log the not-fully-optimized warning
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(GPTQ, 'L386-L387')}>
          gptq.py L386-L387
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(AWQ, 'L307-L308')}>
          awq.py L307-L308
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(MXFP4, 'L338-L339')}>
          mxfp4.py L338-L339
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(BLOCK_INT8, 'L83-L84')}>
          blockwise_int8.py L83-L84
        </Cite>
      </>
    ),
  },
  {
    id: 'older',
    format: (
      <>
        <code>w8a8_int8</code>, <code>bitsandbytes</code>, <code>gguf</code>
      </>
    ),
    floor: 'SM75, SM70, SM60',
    refused: 'None',
    runs: (
      <>
        <code>bitsandbytes</code> and <code>gguf</code> log the not-fully-optimized warning
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(W8A8_INT8, 'L87-L88')}>
          w8a8_int8.py L87-L88
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(BNB, 'L100-L101')}>
          bitsandbytes.py L100-L101
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(GGUF, 'L107-L108')}>
          gguf.py L107-L108
        </Cite>
      </>
    ),
  },
];

/* ------------------------------------------------------------------------ */
/* KV cache dtype table                                                     */
/* ------------------------------------------------------------------------ */

interface KvRow {
  id: string;
  value: ReactNode;
  stores: ReactNode;
  where: ReactNode;
  src: ReactNode;
}

const KV_ROWS: KvRow[] = [
  {
    id: 'auto',
    value: (
      <>
        <code>auto</code> (default)
      </>
    ),
    stores:
      'The model dtype, or FP8 E4M3 when the checkpoint declares an FP8 KV cache or a model rule sets it',
    where: 'Everywhere; read the result from the startup log',
    src: (
      <Cite tier={1} href={sglangUrl(KV_DTYPE, 'L38-L48')} kind="code">
        kv_cache_dtype.py L38-L48
      </Cite>
    ),
  },
  {
    id: 'e4m3',
    value: <code>fp8_e4m3</code>,
    stores: 'FP8 E4M3, largest value 448 on NVIDIA',
    where: (
      <>
        On AMD it maps to the platform FP8 type. The only value that reads{' '}
        <code>--quantization-param-path</code>
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(KV_DTYPE, 'L49-L60')}>
          kv_cache_dtype.py L49-L60
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(LOAD_UTILS, 'L119-L141')}>
          load_model_utils.py L119-L141
        </Cite>
      </>
    ),
  },
  {
    id: 'e5m2',
    value: <code>fp8_e5m2</code>,
    stores: 'FP8 E5M2 (5 exponent bits, 2 mantissa bits), largest value 57,344',
    where: (
      <>
        Rejected on CPU. FA3 (FlashAttention 3) does not take it, so <code>fa3</code> is switched
        to{' '}
        <code>triton</code>
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(KV_DTYPE, 'L49-L55')}>
          kv_cache_dtype.py L49-L55
        </Cite>{' '}
        <Cite tier={1} href={sglangDocsSrcUrl(KVQ_DOC, 'L24')}>
          quantized_kv_cache.mdx L24
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(OVERRIDES, 'L1225-L1233')} kind="code">
          overrides.py L1225-L1233
        </Cite>
      </>
    ),
  },
  {
    id: 'bf16',
    value: (
      <>
        <code>bf16</code>, <code>bfloat16</code>
      </>
    ),
    stores: 'BF16',
    where: (
      <>
        Keeps BF16 when auto would pick FP8. Both spellings work in most paths, but the{' '}
        <code>trtllm_mla</code> check accepts only <code>bf16</code> and the DeepSeek V4 check
        only <code>bfloat16</code>
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(KV_DTYPE, 'L63-L64')}>
          kv_cache_dtype.py L63-L64
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(OVERRIDES, 'L1164-L1167')} kind="code">
          overrides.py L1164-L1167
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(OVERRIDES, 'L878-L886')} kind="code">
          overrides.py L878-L886
        </Cite>
      </>
    ),
  },
  {
    id: 'mxfp8',
    value: <code>mxfp8</code>,
    stores: 'FP8 E4M3 values plus one scale byte per 32 values',
    where:
      'Blackwell only, for the FA4 (FlashAttention 4) attention path; not described on the quantized KV cache page',
    src: (
      <>
        <Cite tier={1} href={sglangUrl(KV_HOOK, 'L100-L109')}>
          kv_cache_hook.py L100-L109
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(POOL_CONF, 'L499-L503')} kind="code">
          pool_configurator.py L499-L503
        </Cite>
      </>
    ),
  },
  {
    id: 'nvfp4',
    value: <code>nvfp4</code>,
    stores: 'FP4 E2M1 in 16-value blocks, with E4M3 block scales and a per-tensor scale',
    where: (
      <>
        SM100 or SM120; picks its own attention backends; on SM100 it rejects PD (prefill/decode)
        disaggregation, HiCache and LMCache
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(KV_HOOK, 'L124-L131')}>
          kv_cache_hook.py L124-L131
        </Cite>{' '}
        <Cite tier={1} href={sglangDocsSrcUrl(KVQ_DOC, 'L33-L36')}>
          quantized_kv_cache.mdx L33-L36
        </Cite>
      </>
    ),
  },
  {
    id: 'fp4mx',
    value: <code>fp4_mx_block16</code>,
    stores: 'FP4 E2M1, a block-size-16 recipe distinct from the OCP (Open Compute Project) MXFP4 format',
    where: 'CUDA only, with a short list of attention backends',
    src: (
      <>
        <Cite tier={1} href={sglangUrl(KV_HOOK, 'L296-L318')}>
          kv_cache_hook.py L296-L318
        </Cite>{' '}
        <Cite tier={1} href={sglangDocsSrcUrl(KVQ_DOC, 'L33-L36')}>
          quantized_kv_cache.mdx L33-L36
        </Cite>
      </>
    ),
  },
];

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function Quantization() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Know which format your checkpoint will run as, on which GPU, and in what precision the KV cache will be stored, before you launch (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            9. Quantization and KV Precision
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Quantization in SGLang is two settings that are easy to run together. The weight format
            decides how the linear and MoE (mixture of experts) layers store and multiply their
            weights. The KV (key-value) cache dtype decides how many bytes each cached token costs,
            and so how many tokens fit on the GPU (section 6, KV Memory and the Defaults Your GPU
            Picks). The challenge is to know both before launch, because neither comes from the
            flag a newcomer would guess: the checkpoint names the weight format, the GPU decides how
            that format computes, and <code>--kv-cache-dtype auto</code> can mean FP8 (8-bit
            floating point).
          </Box>
          <Box variant="p">
            One figure is worth carrying through the section. FP8 E4M3, with 4 exponent bits and 3 mantissa bits, is the type SGLang stores an FP8 KV cache in
            on NVIDIA GPUs unless you ask for E5M2, and its largest value is 448{' '}
            <Cite tier={1} href={sglangUrl(KV_DTYPE, 'L56-L60')} kind="code">
              kv_cache_dtype.py L56-L60
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(FP8_KERNEL, 'L583')} kind="code">
              fp8_kernel.py L583
            </Cite>
            . SGLang&apos;s quantized KV cache page gives 240{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(KVQ_DOC, 'L24-L25')} kind="doc-code-conflict">
              quantized_kv_cache.mdx L24-L25
            </Cite>
            , which is the limit of the FNUZ variant (an E4M3 encoding with no infinity) that
            AMD&apos;s MI300 uses{' '}
            <Cite tier={1} href={sglangUrl(SPARSE_MLA, 'L25')} kind="code">
              triton_sparse_mla.py L25
            </Cite>
            . Scales for an FP8 KV cache on NVIDIA are worked out against 448, as the KV precision
            block shows.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Serve a pre-quantized checkpoint with no flag, and reach for --quantization only to quantize an unquantized model at load or to pick a declared compatible loader"
          >
            The checkpoint decides the format
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            SGLang reads <code>quant_method</code> from the <code>quantization_config</code> in the
            checkpoint&apos;s <code>config.json</code> (or from ModelSlim metadata on Ascend) and
            picks the loader itself. Where a faster kernel serves the same checkpoint, it switches:
            a Marlin-compatible GPTQ or AWQ (activation-aware weight quantization) checkpoint, both
            weight-only formats computed offline
            from a calibration set, loads as <code>gptq_marlin</code> or <code>awq_marlin</code>{' '}
            <Cite tier={1} href={sglangUrl(MODEL_CONFIG, 'L1964-L1995')}>
              model_config.py L1964-L1995
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(GPTQ, 'L414-L429')}>
              gptq.py L414-L429
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(QUANT_DOC, 'L8-L9')}>
              quantization.mdx L8-L9
            </Cite>
            . For a pre-quantized model, leave <code>--quantization</code> off. The documentation
            says so in bold and recommends pre-quantized checkpoints over online quantization{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(QUANT_DOC, 'L15-L17')}>
              quantization.mdx L15-L17
            </Cite>
            .
          </Box>
          <Box variant="p">
            A flag that disagrees with the checkpoint stops the server at startup with{' '}
            <code>does not match</code>. The exceptions are pairs the code declares compatible,
            such as <code>modelopt_fp4</code> on a ModelOpt (NVIDIA Model Optimizer) checkpoint or{' '}
            <code>w8a8_fp8</code> on a compressed-tensors one, and requantization methods such as{' '}
            <code>quark_mxfp4</code>, which converts an NVFP4 (NVIDIA&apos;s 4-bit floating-point
            format with 16-value blocks) or FP8 checkpoint to MXFP4 (microscaling 4-bit floating
            point){' '}
            <Cite tier={1} href={sglangUrl(MODEL_CONFIG, 'L1932-L1943')}>
              model_config.py L1932-L1943
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MODEL_CONFIG, 'L2026-L2036')}>
              model_config.py L2026-L2036
            </Cite>
            .
          </Box>
          <Box variant="p">
            The flag earns its place for online quantization of a BF16 (bfloat16) or FP16
            checkpoint. <code>--quantization fp8</code> quantizes linear and MoE weights to FP8 as
            they load and computes activation scales at runtime; <code>mxfp8</code> does the same in
            MXFP8 (microscaling FP8, one shared scale per block of values) on Blackwell; and{' '}
            <code>nvfp4_online</code> converts MoE experts to NVFP4 on SM100 (compute capability
            10.0, Blackwell){' '}
            <Cite tier={1} href={sglangUrl(WEIGHT_UTILS, 'L346-L375')}>
              weight_utils.py L346-L375
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(FP8, 'L255-L281')}>
              fp8.py L255-L281
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(QUANT_DOC, 'L825-L849')}>
              quantization.mdx L825-L849
            </Cite>
            .
          </Box>
          <Box variant="p">
            Plain GPTQ is on the menu with no loader on GPUs. <code>--quantization gptq</code> passes
            argument parsing; on NVIDIA and AMD GPUs the loader then logs that it is forcing{' '}
            <code>gptq</code>, and model setup fails with <code>Unknown quantization method</code>,
            because at v0.5.22 the plain GPTQ loader is registered only on Ascend, CPU and Intel XPU
            (read from code, not run){' '}
            <Cite tier={1} href={sglangUrl(GPTQ, 'L431-L437')} kind="code">
              gptq.py L431-L437
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(QUANT_INIT, 'L62-L135')} kind="code">
              quantization/__init__.py L62-L135
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MODEL_CONFIG, 'L2038-L2043')} kind="code">
              model_config.py L2038-L2043
            </Cite>
            . Leave the flag off, or pass <code>gptq_marlin</code>.
          </Box>
          <Box variant="p">
            Formats outside SGLang&apos;s list of optimized methods log{' '}
            <code>quantization is not fully optimized yet</code> at startup, with the note that
            speed can be slower than the unquantized model. <code>bitsandbytes</code>,{' '}
            <code>gguf</code>, plain <code>awq</code> and <code>blockwise_int8</code> are among
            them; MXFP4 and MXFP8 are exempt on SM100{' '}
            <Cite tier={1} href={sglangUrl(MODEL_CONFIG, 'L1908-L1931')} kind="code">
              model_config.py L1908-L1931
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MODEL_CONFIG, 'L2049-L2059')} kind="code">
              model_config.py L2049-L2059
            </Cite>
            . When that line appears, expect the memory saving and test the throughput.
          </Box>
          <ExpandableSection headerText="Every name --quantization accepts at v0.5.22">
            <Box variant="p">
              The command line accepts 31 names, and which of them has a loader depends on the
              device, because the registry is assembled at import time: <code>mxfp4</code>{' '}
              registers on CUDA, CPU, AMD gfx95x and XPU; plain <code>gptq</code> only on Ascend,
              CPU and XPU; <code>mlx_q4</code> and <code>mlx_q8</code> only on Apple MPS (Metal Performance
              Shaders){' '}
              <Cite tier={1} href={sglangUrl(CHOICES, 'L32-L67')}>
                choices.py L32-L67
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(QUANT_INIT, 'L62-L155')}>
                quantization/__init__.py L62-L155
              </Cite>
              . Formats with a loader: FP8 (per-tensor, per-channel and 128x128 block), MXFP8,
              MXFP4, NVFP4 (ModelOpt, online, and Petit on AMD), INT8 (W8A8, 8-bit weights and
              activations, and blockwise), AWQ and GPTQ through Marlin, W4A8 (4-bit weights, 8-bit
              activations: <code>w4afp8</code>, and Ascend <code>mxfp_w4a8</code>), GGUF, bitsandbytes, compressed-tensors, AMD
              Quark, Intel auto-round, Ascend ModelSlim, Apple MLX 4-bit and 8-bit, and{' '}
              <code>humming</code>.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know, for the EC2 family you plan to rent, whether the loader accepts a format and whether it computes in that format or only stores it"
          >
            The GPU decides how it runs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each format declares a minimum compute capability, and the loader compares the
            GPU&apos;s against it; below the minimum the server stops with{' '}
            <code>Minimum capability: X. Current capability: Y.</code>{' '}
            <Cite tier={1} href={sglangUrl(LOADER, 'L249-L261')}>
              loader.py L249-L261
            </Cite>
            . The EC2 GPU families map onto capabilities as follows: SM80 (compute capability 8.0,
            Ampere) for the A100 in P4d and P4de; SM86 (compute capability 8.6) for the A10G in G5, by equivalence
            with the A10, since NVIDIA&apos;s table does not list the A10G; SM89 (compute capability
            8.9, Ada) for the L4 in G6 and the L40S in G6e; SM90 (compute capability 9.0, Hopper) for the H100 and H200 in P5, P5e and
            P5en; SM100 (compute capability 10.0, Blackwell) for the B200 in P6-B200 and P6e-GB200; SM103 (compute capability
            10.3, Blackwell) for the B300 in P6-B300; and SM120 (compute capability 12.0, Blackwell) for the RTX
            PRO Blackwell GPUs in G7e and G7{' '}
            <Cite tier={1} href={NVIDIA_CC}>
              NVIDIA: CUDA GPU compute capability
            </Cite>{' '}
            <Cite tier={1} href={EC2_SPECS}>
              EC2 accelerated computing specifications
            </Cite>
            . In the table, SMxy is compute capability x.y, and SM9x is any Hopper part.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={FORMAT_ROWS}
            columnDefinitions={[
              { id: 'format', header: 'Format', cell: (r) => r.format, minWidth: 200 },
              { id: 'floor', header: 'Floor at load', cell: (r) => r.floor, minWidth: 90 },
              { id: 'refused', header: 'Refused on', cell: (r) => r.refused, minWidth: 130 },
              { id: 'runs', header: 'How it runs above the floor', cell: (r) => r.runs, minWidth: 240 },
              { id: 'src', header: 'Source', cell: (r) => r.src, minWidth: 180 },
            ]}
          />
          <Box variant="p">
            The FP8 row holds the practical surprise. On P4d, P4de and G5 an FP8 checkpoint still
            loads: SGLang switches its linear layers to the Marlin kernel, keeps the weights in FP8 and computes in
            16-bit, so FP8 saves weight memory there without FP8 math, and the startup log says{' '}
            <code>Your GPU does not have native support for FP8 computation</code>{' '}
            <Cite tier={1} href={sglangUrl(FP8_UTILS, 'L2540-L2546')} kind="code">
              fp8_utils.py L2540-L2546
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MARLIN_FP8, 'L105-L110')} kind="code">
              marlin_utils_fp8.py L105-L110
            </Cite>
            . A ModelOpt FP8 checkpoint goes through a different loader whose floor is SM89, so the
            same three families refuse it at startup. <code>SGLANG_FORCE_FP8_MARLIN=1</code> forces
            the weight-only path on any NVIDIA GPU{' '}
            <Cite tier={1} href={sglangUrl(FP8, 'L506-L512')}>
              fp8.py L506-L512
            </Cite>
            .
          </Box>
          <Box variant="p">
            Three flags choose the GEMM (matrix multiply) kernels, all <code>auto</code> by
            default. <code>--fp8-gemm-backend auto</code> serves block-quantized FP8 weights
            (DeepSeek-style 128x128 blocks) with DeepGEMM first, then FlashInfer&apos;s TRT-LLM
            (TensorRT-LLM) GEMM on Blackwell, then the remaining kernels in a fixed order with
            Triton last; on H100 and B200 with the default install those layers run DeepGEMM, and on
            SM120 <code>auto</code> becomes <code>cutlass</code>{' '}
            <Cite tier={1} href={sglangUrl(FP8_UTILS, 'L1025-L1065')}>
              fp8_utils.py L1025-L1065
            </Cite>
            . DeepGEMM compiles each new shape at first start; section 8, Attention Backends and
            Kernels, moves that compile to build time. <code>--fp4-gemm-backend auto</code> picks
            the NVFP4 kernel in the table above.{' '}
            <code>--bf16-gemm-backend auto</code> applies to unquantized models too: on SM100 and
            SM103 it selects <code>cutedsl</code>, which routes each shape to SGLang&apos;s own
            just-in-time compiled GEMM kernels or to cuBLAS, and{' '}
            <code>--bf16-gemm-backend torch</code> restores plain cuBLAS{' '}
            <Cite tier={1} href={sglangUrl(UNQUANT, 'L248-L254')}>
              unquant.py L248-L254
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(EXEC_FIELDS, 'L223-L248')}>
              exec_.py L223-L248
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="Where the documentation's compatibility table differs from the code">
            <SpaceBetween size="s">
              <Box variant="p">
                The documentation marks <code>mxfp8</code> as unsupported on NVIDIA and AMD GPUs{' '}
                <Cite tier={1} href={sglangDocsSrcUrl(QUANT_DOC, 'L53-L58')} kind="doc-code-conflict">
                  quantization.mdx L53-L58
                </Cite>
                ; v0.5.22&apos;s code registers it with a floor of SM100 on NVIDIA, and on AMD runs
                it natively on gfx95x and on gfx942 after converting the weights to block FP8, and
                the same page documents MXFP8 GEMM backends on SM100{' '}
                <Cite tier={1} href={sglangUrl(FP8, 'L323-L333')}>
                  fp8.py L323-L333
                </Cite>{' '}
                <Cite tier={1} href={sglangUrl('python/sglang/srt/utils/common.py', 'L4736-L4747')} kind="code">
                  utils/common.py L4736-L4747
                </Cite>{' '}
                <Cite tier={1} href={sglangDocsSrcUrl(QUANT_DOC, 'L262')}>
                  quantization.mdx L262
                </Cite>
                , so plan MXFP8 for P6.
              </Box>
              <Box variant="p">
                The documentation gives <code>modelopt_fp8</code> as Hopper/SM90+{' '}
                <Cite tier={1} href={sglangDocsSrcUrl(QUANT_DOC, 'L151-L156')} kind="doc-code-conflict">
                  quantization.mdx L151-L156
                </Cite>
                ; the code&apos;s floor is SM89, so G6 and G6e load ModelOpt FP8 checkpoints{' '}
                <Cite tier={1} href={sglangUrl(MODELOPT, 'L461-L462')}>
                  modelopt_quant.py L461-L462
                </Cite>
                .
              </Box>
              <Box variant="p">
                The <code>--kv-cache-dtype</code> help text says <code>auto</code> uses the model
                data type{' '}
                <Cite tier={1} href={sglangUrl(MODEL_FIELDS, 'L194-L196')} kind="doc-code-conflict">
                  model.py L194-L196
                </Cite>
                ; the code turns <code>auto</code> into FP8 when the checkpoint declares an FP8 KV
                cache, as the next block shows{' '}
                <Cite tier={1} href={sglangUrl(KV_DTYPE, 'L38-L48')}>
                  kv_cache_dtype.py L38-L48
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
            description="Know which dtype your KV pool really runs, how many more tokens it buys, and the range its scales must cover"
          >
            KV cache precision: what auto picks and what FP8 holds
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The KV cache dtype is set apart from the weight format: a BF16 model can keep an FP8
            cache, and an FP8 checkpoint can keep a BF16 one. <code>--kv-cache-dtype</code>{' '}
            defaults to <code>auto</code> and accepts FP8 (<code>fp8_e4m3</code>,{' '}
            <code>fp8_e5m2</code>), MXFP8, BF16 and two FP4 E2M1 (2 exponent bits, 1 mantissa bit)
            recipes, <code>nvfp4</code> and <code>fp4_mx_block16</code>{' '}
            <Cite tier={1} href={sglangUrl(MODEL_FIELDS, 'L191-L214')}>
              model.py L191-L214
            </Cite>
            .
          </Box>
          <Box variant="p">
            <code>auto</code> means the model dtype, with two routes to FP8 that need no flag. A
            checkpoint whose quantization config declares an FP8 KV cache, as a ModelOpt checkpoint
            does with <code>kv_cache_quant_algo: FP8</code>, gets an FP8 E4M3 pool{' '}
            <Cite tier={1} href={sglangUrl(KV_DTYPE, 'L38-L48')} kind="code">
              kv_cache_dtype.py L38-L48
            </Cite>
            . A model family can also set it: DeepSeek models with DeepSeek sparse attention resolve{' '}
            <code>auto</code> to <code>fp8_e4m3</code> on compute capability 10.0 and above (BF16
            below that, or when the model has learnable attention sinks), and DeepSeek V4 resolves
            it to <code>fp8_e4m3</code> on GPUs, each with a warning in the startup log{' '}
            <Cite tier={1} href={sglangUrl(OVERRIDES, 'L466-L523')} kind="code">
              overrides.py L466-L523
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(OVERRIDES, 'L867-L889')} kind="code">
              overrides.py L867-L889
            </Cite>
            . Pass <code>--kv-cache-dtype bf16</code> to keep a BF16 pool (DeepSeek V4&apos;s check
            accepts only the long name, <code>bfloat16</code>{' '}
            <Cite tier={1} href={sglangUrl(OVERRIDES, 'L878-L886')} kind="code">
              overrides.py L878-L886
            </Cite>
            ), and confirm the result in
            the startup line <code>KV Cache is allocated. dtype: ..., #tokens: ...</code>, which
            reports the dtype and token count the pool got{' '}
            <Cite tier={1} href={sglangUrl(MEM_POOL, 'L2087-L2112')} kind="code">
              memory_pool.py L2087-L2112
            </Cite>
            .
          </Box>
          <Box variant="p">
            For an MHA or GQA (multi-head or grouped-query attention) model, the pool charges each
            token the product of its KV heads, its K plus V width, its layer count and the bytes per
            element, so by our arithmetic on the sizing code an FP8 pool costs half the bytes per
            token of a BF16 one and holds twice the tokens in the same memory{' '}
            <Cite tier={1} href={sglangUrl(POOL_CONF, 'L464-L471')} kind="code">
              pool_configurator.py L464-L471
            </Cite>
            . For <code>nvfp4</code>, the documentation&apos;s arithmetic is 0.5 bytes of packed
            data plus 1/16 byte of block scale per value against 2 bytes for BF16, about 3.56 times
            the tokens{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(KVQ_DOC, 'L141-L150')}>
              quantized_kv_cache.mdx L141-L150
            </Cite>
            . MLA (multi-head latent attention) models use their own layouts, so read their token
            count from the startup line. Section 6 turns bytes per token into a token budget.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={KV_ROWS}
            columnDefinitions={[
              { id: 'value', header: '--kv-cache-dtype', cell: (r) => r.value, minWidth: 140 },
              { id: 'stores', header: 'What the pool stores', cell: (r) => r.stores, minWidth: 220 },
              { id: 'where', header: 'Where it runs', cell: (r) => r.where, minWidth: 220 },
              { id: 'src', header: 'Source', cell: (r) => r.src, minWidth: 180 },
            ]}
          />
          <Box variant="p">
            E4M3 and E5M2 trade precision for range. E5M2 keeps 2 mantissa bits and reaches 57,344;
            E4M3 keeps 3 and, as <code>float8_e4m3fn</code>, the type SGLang stores on NVIDIA GPUs,
            reaches 448{' '}
            <Cite tier={1} href={sglangUrl(FP8_KERNEL, 'L106-L112')} kind="code">
              fp8_kernel.py L106-L112
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(FP8_KERNEL, 'L583')} kind="code">
              fp8_kernel.py L583
            </Cite>
            . The quantized KV cache page gives E4M3 a range of plus or minus 240{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(KVQ_DOC, 'L24-L25')} kind="doc-code-conflict">
              quantized_kv_cache.mdx L24-L25
            </Cite>
            , the limit of the <code>float8_e4m3fnuz</code> variant on AMD&apos;s MI300{' '}
            <Cite tier={1} href={sglangUrl(SPARSE_MLA, 'L25')} kind="code">
              triton_sparse_mla.py L25
            </Cite>
            ; its E5M2 figure is right. E4M3 is generally the more accurate of the two{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(KVQ_DOC, 'L154-L156')}>
              quantized_kv_cache.mdx L154-L156
            </Cite>
            , and on P5 it also keeps the default backend: FA3 (FlashAttention 3) takes FP8 only as
            E4M3, so <code>fp8_e5m2</code> switches attention to <code>triton</code> with a warning{' '}
            <Cite tier={1} href={sglangUrl(OVERRIDES, 'L1225-L1233')} kind="code">
              overrides.py L1225-L1233
            </Cite>
            .
          </Box>
          <Box variant="p">
            The scales are what keep values inside that range. The MHA pool divides each K and V
            value by a per-tensor scale, one per layer, and casts the result to FP8{' '}
            <Cite tier={1} href={sglangUrl(MEM_POOL, 'L2860-L2866')} kind="code">
              memory_pool.py L2860-L2866
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(KVQ_DOC, 'L102-L104')}>
              quantized_kv_cache.mdx L102-L104
            </Cite>
            . Scales come from the checkpoint (<code>k_scale</code> and <code>v_scale</code>, which
            ModelOpt checkpoints carry) or from a JSON file passed with{' '}
            <code>--quantization-param-path</code>; with neither, the scale is 1.0, which can cost
            accuracy{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(KVQ_DOC, 'L106-L131')}>
              quantized_kv_cache.mdx L106-L131
            </Cite>
            . The loader reads the JSON file only when the flag&apos;s value is{' '}
            <code>fp8_e4m3</code>, and an <code>auto</code> that the checkpoint turned into FP8
            still reads as <code>auto</code> at that point; the{' '}
            <code>Defaulting to scaling factors of 1.0</code> warning likewise checks only whether a
            JSON path was given, never whether the checkpoint carries scales (read from code, not
            run){' '}
            <Cite tier={1} href={sglangUrl(LOAD_UTILS, 'L119-L141')} kind="code">
              load_model_utils.py L119-L141
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MODEL_RUNNER, 'L1324-L1327')} kind="code">
              model_runner.py L1324-L1327
            </Cite>
            . By our reading of that path, a scale you calibrate yourself is the largest observed
            magnitude divided by 448 on NVIDIA.
          </Box>
          <Box variant="p">
            Each default backend a dense Llama-style model gets on EC2 with speculative decoding
            off, <code>fa3</code> on P5,{' '}
            <code>trtllm_mha</code> on P6 and <code>flashinfer</code> on the other families{' '}
            <Cite tier={1} href={sglangUrl(ATTN_DEFAULTS, 'L268-L324')} kind="code">
              model_override_base.py L268-L324
            </Cite>
            , is marked as supporting an FP8 KV cache in the attention backend page&apos;s table{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(ATTN_DOC, 'L32-L114')}>
              attention_backend.mdx L32-L114
            </Cite>
            . The quantized KV cache page warns that a backend which dequantizes outside its
            attention kernel can be extremely slow and can cancel the memory gain{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(KVQ_DOC, 'L10-L14')}>
              quantized_kv_cache.mdx L10-L14
            </Cite>
            . In PD (prefill/decode) disaggregation the decode server refuses a prefill server whose
            KV cache dtype differs, so set the same <code>--kv-cache-dtype</code> on both roles
            (section 15, PD Disaggregation){' '}
            <Cite tier={1} href={sglangUrl(PD_CONN, 'L1191-L1199')} kind="code">
              conn.py L1191-L1199
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="FP4 KV caches: backends, limits and the project's accuracy figures">
            <SpaceBetween size="s">
              <Box variant="p">
                <code>nvfp4</code> overrides the attention choice. Decode always runs TRT-LLM MHA on
                the packed FP4 cache; prefill reads FP4 directly on SM100, or dequantizes into an
                FP8 workspace for FlashInfer on SM120, as{' '}
                <code>--prefill-kv-cache-dequant-dtype auto</code> resolves it{' '}
                <Cite tier={1} href={sglangUrl(KV_HOOK, 'L25-L97')}>
                  kv_cache_hook.py L25-L97
                </Cite>
                . On SM100 the native path rejects PD disaggregation, HiCache (section 7) and
                LMCache at startup, because their transfer and host pools do not keep its
                block-scale layout{' '}
                <Cite tier={1} href={sglangUrl(KV_HOOK, 'L251-L264')}>
                  kv_cache_hook.py L251-L264
                </Cite>
                .
              </Box>
              <Box variant="p">
                Both FP4 recipes need a PyTorch build with <code>float4_e2m1fn_x2</code> (PyTorch
                2.8 or later with CUDA 12.8 or later), run only on CUDA, and log an accuracy warning
                at startup{' '}
                <Cite tier={1} href={sglangUrl(KV_DTYPE, 'L65-L77')}>
                  kv_cache_dtype.py L65-L77
                </Cite>{' '}
                <Cite tier={1} href={sglangUrl(KV_HOOK, 'L317-L318')}>
                  kv_cache_hook.py L317-L318
                </Cite>
                . With one attention backend for both phases, an FP4 cache needs <code>triton</code>,{' '}
                <code>torch_native</code>, <code>flex_attention</code> or <code>trtllm_mha</code>{' '}
                for an MHA model, and an MLA model <code>flashinfer</code> or{' '}
                <code>trtllm_mla</code>; <code>fa3</code>, the P5 default, is not on the list{' '}
                <Cite tier={1} href={sglangUrl(KV_HOOK, 'L296-L318')} kind="code">
                  kv_cache_hook.py L296-L318
                </Cite>
                .
              </Box>
              <Box variant="p">
                SGLang&apos;s documentation reports preliminary accuracy results from two pull
                requests. On Qwen3-235B-A22B, gsm8k held (0.9168 with a 16-bit KV cache, 0.9186
                with FP4) while aime25 fell from 0.7733 to 0.6000; on DeepSeek-R1-0528, aime25 fell
                from 0.5067 to 0.4000{' '}
                <Cite tier={2} href={sglangDocsSrcUrl(KVQ_DOC, 'L158-L218')}>
                  quantized_kv_cache.mdx L158-L218 (project claim)
                </Cite>
                . Run your hardest evaluation before keeping an FP4 cache.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <ExpandableSection headerText="Why the documentation says 240">
            <Box variant="p">
              E4M3 comes in two encodings. OCP (Open Compute Project) E4M3,{' '}
              <code>float8_e4m3fn</code> in PyTorch, reaches 448; <code>float8_e4m3fnuz</code>, a
              variant with no infinity that AMD&apos;s MI300-class (gfx94x) GPUs use, reaches 240{' '}
              <Cite tier={1} href={sglangUrl(FP8_KERNEL, 'L118-L128')} kind="code">
                fp8_kernel.py L118-L128
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(SPARSE_MLA, 'L25')} kind="code">
                triton_sparse_mla.py L25
              </Cite>
              . SGLang picks the encoding per device: FNUZ on gfx94x, OCP E4M3 on NVIDIA and on
              MI350-class (gfx95x), and on AMD both <code>fp8_e4m3</code> and <code>fp8_e5m2</code>{' '}
              map to the platform&apos;s native FP8 type{' '}
              <Cite tier={1} href={sglangUrl(FP8_KERNEL, 'L98-L112')}>
                fp8_kernel.py L98-L112
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(KV_DTYPE, 'L49-L60')}>
                kv_cache_dtype.py L49-L60
              </Cite>
              . Its own FP8 quantizers clamp at 224 on gfx94x, below the FNUZ limit{' '}
              <Cite tier={1} href={sglangUrl(FP8_KERNEL, 'L106-L108')} kind="code">
                fp8_kernel.py L106-L108
              </Cite>
              . The EC2 accelerated computing specification page read for this dive lists no AMD
              Instinct instance{' '}
              <Cite tier={1} href={EC2_SPECS}>
                EC2 accelerated computing specifications
              </Cite>
              , so on AWS the figure that applies is 448.
            </Box>
          </ExpandableSection>
          <Box variant="p">
            <strong>Against vLLM:</strong> both engines read the format from the checkpoint and both
            run the linear layers of an FP8 checkpoint on Ampere as Marlin weight-only. For online
            FP8, SGLang keeps the plain <code>--quantization fp8</code> name, while vLLM v0.31.0
            uses scheme names such as <code>fp8_per_tensor</code>, which SGLang&apos;s argument
            parser does not accept; and SGLang&apos;s KV dtypes offer MXFP8 and two FP4 recipes but
            no integer KV cache, where vLLM v0.31.0 lists NVFP4 and per-token-head INT8 and INT4
            formats{' '}
            <Cite
              tier={1}
              href="https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/cache.py#L39-L58"
            >
              vLLM cache.py L39-L58
            </Cite>{' '}
            ({VLLM_QUANT_LINK}).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Confirm, from the checkpoint's config and the first minute of startup log, which weight format and KV precision your server will run"
          >
            Before you launch: six checks
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol>
            <li>
              Open the checkpoint&apos;s <code>config.json</code> and read{' '}
              <code>quantization_config.quant_method</code>. If it is there, launch without{' '}
              <code>--quantization</code>; add the flag only to quantize a BF16 model at load (
              <code>fp8</code>) or for a declared compatible pair.
            </li>
            <li>
              Match the format&apos;s floor to the instance in the format table. On P4d, P4de and
              G5, plain FP8 runs weight-only, and ModelOpt FP8 and W8A8 FP8 do not load; MXFP8
              weights and <code>nvfp4_online</code> need SM100 or newer.
            </li>
            <li>
              Translate a command copied from vLLM. <code>--quantization fp8_per_tensor</code> and
              the other vLLM scheme names fail SGLang&apos;s argument parser, where plain{' '}
              <code>fp8</code> is the online FP8 name{' '}
              <Cite tier={1} href={sglangUrl(CHOICES, 'L32-L67')} kind="code">
                choices.py L32-L67
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(ARG_UTILS, 'L384-L385')} kind="code">
                arg_utils.py L384-L385
              </Cite>
              ; replace <code>--quantization gptq</code> with <code>gptq_marlin</code>, or drop it.
            </li>
            <li>
              Choose the KV dtype on purpose. Look for <code>kv_cache_quant_algo</code> in the
              checkpoint&apos;s quantization config and check whether the model is a DeepSeek
              sparse-attention model or DeepSeek V4, because each turns <code>auto</code> into FP8.
              Pass <code>bf16</code> to keep BF16 (<code>bfloat16</code> on DeepSeek V4), or{' '}
              <code>fp8_e4m3</code> to opt in; on P5 prefer
              it to <code>fp8_e5m2</code>, which moves attention off FA3. Set the same value on
              prefill and decode servers.
            </li>
            <li>
              Give an FP8 KV cache its scales. If the checkpoint carries <code>k_scale</code> and{' '}
              <code>v_scale</code>, nothing more is needed. Otherwise pass{' '}
              <code>--quantization-param-path</code> with <code>--kv-cache-dtype fp8_e4m3</code>{' '}
              set explicitly, and, by our reading of the scale path above, calibrate each scale
              against 448, the E4M3 maximum on NVIDIA, rather than the 240 the documentation gives.
            </li>
            <li>
              Read the first minute of the startup log: <code>Detected fp8 checkpoint.</code> or
              the Marlin conversion line for the format{' '}
              <Cite tier={1} href={sglangUrl(FP8, 'L276-L278')} kind="code">
                fp8.py L276-L278
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(GPTQ, 'L423-L429')} kind="code">
                gptq.py L423-L429
              </Cite>
              , the weight-only FP8 warning on Ampere, any <code>not fully optimized</code> line,
              and <code>KV Cache is allocated. dtype: ...</code> for the pool. Then run your own
              evaluation before serving; the documentation asks that quantized models be validated
              by benchmark after quantization{' '}
              <Cite tier={1} href={sglangDocsSrcUrl(QUANT_DOC, 'L20-L21')}>
                quantization.mdx L20-L21
              </Cite>
              .
            </li>
          </ol>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
