import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';

interface FormatRow {
  format: string;
  bits: string;
  family: string;
  notes: string;
}

const formatRows: FormatRow[] = [
  {
    format: 'AWQ',
    bits: 'W4A16 (weight-only INT4)',
    family: 'Weight-only',
    notes:
      'Activation-aware weight quantization. Prequantized checkpoints (AutoAWQ / llm-compressor). Dequantizes to FP16 for matmul; runs on Marlin kernels where available.',
  },
  {
    format: 'GPTQ / GPTQModel',
    bits: 'W4A16 / W8A16 (weight-only INT4/INT8)',
    family: 'Weight-only',
    notes:
      'Per-group post-training quantization. The widest checkpoint ecosystem on the Hub. GPTQModel is the maintained successor to AutoGPTQ.',
  },
  {
    format: 'Marlin',
    bits: 'W4A16 / W8A16 (kernel, not a checkpoint format)',
    family: 'Kernel backend',
    notes:
      'High-throughput INT4/INT8 mixed-precision GEMM kernels that AWQ/GPTQ checkpoints dispatch onto. Repacks weights at load time; not a standalone checkpoint format.',
  },
  {
    format: 'bitsandbytes',
    bits: 'W8A16 / W4A16 (NF4)',
    family: 'Weight-only',
    notes:
      'On-the-fly weight quantization at load time, with no separate prequantized checkpoint needed. Convenient for quick experiments; lower throughput than Marlin-backed paths.',
  },
  {
    format: 'GGUF',
    bits: 'mixed (Q4_K_M, Q5_K, Q8_0, ...)',
    family: 'Weight-only',
    notes:
      'llama.cpp checkpoint format. Broadest hardware reach (incl. Volta and AMD). Loaded directly; useful for portability rather than peak throughput.',
  },
  {
    format: 'INT8 W8A8',
    bits: 'W8A8 (8-bit weights + activations)',
    family: 'W8A8',
    notes:
      'Both weights and activations in INT8: the activations are quantized too, so the matmul runs in INT8. Prequantized via llm-compressor (SmoothQuant-style). A real compute speedup, not only a memory saving.',
  },
  {
    format: 'FP8 W8A8 (E4M3)',
    bits: 'W8A8 (8-bit float)',
    family: 'W8A8',
    notes:
      'The default 8-bit serving path on Ada/Hopper. Per-tensor or per-channel weight scale + per-token dynamic activation scale. Available online (no calibration) or from a prequantized checkpoint.',
  },
  {
    format: 'FP8 E5M2',
    bits: '8-bit float (KV-cache use)',
    family: 'KV cache / W8A8',
    notes:
      'Wider exponent, less mantissa than E4M3. Mainly seen as a KV-cache dtype option; lower precision than E4M3 for the same 8 bits.',
  },
  {
    format: 'NVFP4 / MXFP4 / MXFP8',
    bits: 'W4A4 / W8A8 (block-scaled low-bit float)',
    family: 'Low-bit float (Blackwell)',
    notes:
      'Microscaling block formats with hardware acceleration on Blackwell. Authored via NVIDIA Model Optimizer / llm-compressor. The frontier of accuracy-per-byte for the newest silicon.',
  },
  {
    format: 'FP8 KV cache',
    bits: 'KV entries in FP8 (E4M3 / E5M2)',
    family: 'KV cache',
    notes:
      'Orthogonal to weight quantization: it shrinks the per-request KV footprint so more concurrent sequences fit. Enabled separately via kv_cache_dtype.',
  },
];

interface HwRow {
  impl: string;
  volta: string;
  turing: string;
  ampere: string;
  ada: string;
  hopper: string;
  amd: string;
}

// Per https://docs.vllm.ai/en/stable/features/quantization/ supported-hardware
// matrix, accessed 2026-06-07. Y = supported, N = not supported, Y* = caveat.
const hwRows: HwRow[] = [
  { impl: 'AWQ', volta: 'N', turing: 'Y', ampere: 'Y', ada: 'Y', hopper: 'Y', amd: 'N' },
  { impl: 'GPTQ', volta: 'Y', turing: 'Y', ampere: 'Y', ada: 'Y', hopper: 'Y', amd: 'N' },
  { impl: 'Marlin', volta: 'N', turing: 'Y*', ampere: 'Y', ada: 'Y', hopper: 'Y', amd: 'N' },
  { impl: 'INT8 (W8A8)', volta: 'N', turing: 'Y', ampere: 'Y', ada: 'Y', hopper: 'Y', amd: 'N' },
  { impl: 'FP8 (W8A8)', volta: 'N', turing: 'N', ampere: 'N', ada: 'Y', hopper: 'Y', amd: 'Y' },
  { impl: 'bitsandbytes', volta: 'Y', turing: 'Y', ampere: 'Y', ada: 'Y', hopper: 'Y', amd: 'N' },
  { impl: 'GGUF', volta: 'Y', turing: 'Y', ampere: 'Y', ada: 'Y', hopper: 'Y', amd: 'Y' },
];

function DecisionDiagram() {
  return (
    <svg
      viewBox="0 0 720 300"
      role="img"
      aria-labelledby="quant-decision-title"
      style={{ width: '100%', height: 'auto', maxWidth: 720 }}
    >
      <title id="quant-decision-title">
        Choosing a vLLM quantization path by hardware generation and accuracy budget
      </title>
      <defs>
        <marker id="qarrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#5f6b7a" />
        </marker>
      </defs>
      {/* root */}
      <rect x="270" y="10" width="180" height="44" rx="6" fill="#f1f3f3" stroke="#5f6b7a" />
      <text x="360" y="30" textAnchor="middle" fontSize="13" fill="#16191f">
        What silicon?
      </text>
      <text x="360" y="46" textAnchor="middle" fontSize="11" fill="#5f6b7a">
        (start here)
      </text>

      {/* branch lines */}
      <line x1="330" y1="54" x2="120" y2="100" stroke="#5f6b7a" markerEnd="url(#qarrow)" />
      <line x1="360" y1="54" x2="360" y2="100" stroke="#5f6b7a" markerEnd="url(#qarrow)" />
      <line x1="390" y1="54" x2="600" y2="100" stroke="#5f6b7a" markerEnd="url(#qarrow)" />

      {/* Ampere & older */}
      <rect x="20" y="104" width="200" height="48" rx="6" fill="#fbf3e6" stroke="#bd6c1c" />
      <text x="120" y="124" textAnchor="middle" fontSize="12" fill="#16191f">
        Ampere / Turing / Volta
      </text>
      <text x="120" y="140" textAnchor="middle" fontSize="11" fill="#5f6b7a">
        no FP8 compute
      </text>

      {/* Ada / Hopper */}
      <rect x="260" y="104" width="200" height="48" rx="6" fill="#e8f5e9" stroke="#1d8102" />
      <text x="360" y="124" textAnchor="middle" fontSize="12" fill="#16191f">
        Ada / Hopper
      </text>
      <text x="360" y="140" textAnchor="middle" fontSize="11" fill="#5f6b7a">
        FP8 native
      </text>

      {/* Blackwell */}
      <rect x="500" y="104" width="200" height="48" rx="6" fill="#e7f0fb" stroke="#0972d3" />
      <text x="600" y="124" textAnchor="middle" fontSize="12" fill="#16191f">
        Blackwell
      </text>
      <text x="600" y="140" textAnchor="middle" fontSize="11" fill="#5f6b7a">
        FP4 / MXFP native
      </text>

      {/* leaves */}
      <line x1="120" y1="152" x2="120" y2="200" stroke="#5f6b7a" markerEnd="url(#qarrow)" />
      <line x1="360" y1="152" x2="360" y2="200" stroke="#5f6b7a" markerEnd="url(#qarrow)" />
      <line x1="600" y1="152" x2="600" y2="200" stroke="#5f6b7a" markerEnd="url(#qarrow)" />

      <rect x="20" y="204" width="200" height="74" rx="6" fill="#fff" stroke="#879596" />
      <text x="120" y="226" textAnchor="middle" fontSize="12" fill="#16191f">
        AWQ / GPTQ W4A16
      </text>
      <text x="120" y="244" textAnchor="middle" fontSize="11" fill="#5f6b7a">
        via Marlin kernels;
      </text>
      <text x="120" y="260" textAnchor="middle" fontSize="11" fill="#5f6b7a">
        weight-only shrink
      </text>

      <rect x="260" y="204" width="200" height="74" rx="6" fill="#fff" stroke="#879596" />
      <text x="360" y="226" textAnchor="middle" fontSize="12" fill="#16191f">
        FP8 W8A8 (E4M3)
      </text>
      <text x="360" y="244" textAnchor="middle" fontSize="11" fill="#5f6b7a">
        online or prequantized;
      </text>
      <text x="360" y="260" textAnchor="middle" fontSize="11" fill="#5f6b7a">
        + FP8 KV cache
      </text>

      <rect x="500" y="204" width="200" height="74" rx="6" fill="#fff" stroke="#879596" />
      <text x="600" y="226" textAnchor="middle" fontSize="12" fill="#16191f">
        NVFP4 / MXFP4
      </text>
      <text x="600" y="244" textAnchor="middle" fontSize="11" fill="#5f6b7a">
        Model Optimizer /
      </text>
      <text x="600" y="260" textAnchor="middle" fontSize="11" fill="#5f6b7a">
        llm-compressor
      </text>
    </svg>
  );
}

export function Quantization() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="vLLM's quantization support surface: what the formats buy you in production, which run on your GPU, and how to turn them on"
          >
            8. Quantization &amp; Precision
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why quantize for serving.</strong> Two scarce resources bound
            an inference deployment: HBM capacity and HBM bandwidth. Quantization
            attacks both. Storing weights in 8 or 4 bits instead of 16 shrinks the
            parameter footprint by 2-4x, which either lets a model fit on
            fewer GPUs or frees HBM that the KV cache can then use for more
            concurrent requests. Because decode is memory-bandwidth bound (Section
            2), moving fewer bytes per parameter per token also raises throughput
            directly. The cost is accuracy: every format trades some numerical
            fidelity for those bytes, and how much depends on the scheme and the
            model.
          </Box>
          <Box variant="p">
            <strong>What this section is, and is not.</strong> This is the
            practitioner&apos;s map of vLLM&apos;s quantization{' '}
            <em>support surface</em>: the families it accepts, which run on which
            silicon, and the flags that enable them. It does not re-derive the
            number formats themselves. For how FP8 E4M3/E5M2, NVFP4, MXFP4 and
            MXFP8 are constructed bit-by-bit and why block scaling matters at the
            hardware level, see the{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference
            </Link>{' '}
            deep dive (Section 24, "Quantization and Precision"). For
            how vLLM picks the concrete kernel for a given format at runtime, see
            the <strong>Inside the Codebase</strong> section, "Model Layer,
            Quantization &amp; LoRA" tab. This section stops at the{' '}
            <code>--quantization</code> flag; that tab follows it down to{' '}
            <code>get_quant_method</code> and the kernel priority lists.
          </Box>
          <Box variant="small">
            The format and hardware-support claims below are pinned to vLLM&apos;s{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/stable/features/quantization/"
            >
              quantization documentation
            </Link>{' '}
            as accessed 2026-06-07. vLLM ships roughly bi-weekly and this matrix
            moves. Re-verify against the docs before relying on a specific
            cell.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two axes: how few bits, and whether activations are quantized too"
          >
            The two questions every format answers
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every quantization format in vLLM can be located by answering two
            questions. <strong>How many bits per weight?</strong> 8, 4, or
            (on Blackwell) 4-bit float. And <strong>are the activations
            quantized too?</strong> This is the difference between
            "weight-only" and "W8A8". That second axis is
            the one practitioners most often miss, and it determines whether you
            get a real compute speedup or only a memory saving.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Weight-only (W4A16, W8A16)</Box>
              <Box variant="p">
                Only the weights are stored in low precision; activations stay in
                FP16/BF16. The kernel <em>dequantizes</em> weights back to 16-bit
                inside the GEMM. You save HBM and bandwidth on the weights, but the
                matmul still runs at 16-bit math. AWQ, GPTQ, bitsandbytes and GGUF
                all live here. Best fit: bandwidth-bound decode where the weight
                bytes dominate, and older silicon without 8-bit tensor cores.
              </Box>
            </div>
            <div>
              <Box variant="h3">W8A8 (and lower)</Box>
              <Box variant="p">
                Both weights <em>and</em> activations are quantized, so the matmul
                itself executes in INT8 or FP8 on dedicated tensor cores. This is a
                true compute speedup on top of the memory saving, but it
                requires the hardware to have those low-precision tensor cores
                (Ada/Hopper for FP8) and is more sensitive to activation outliers,
                which is why W8A8 checkpoints lean on per-token dynamic activation
                scales or SmoothQuant-style calibration.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            <strong>KV-cache quantization is a separate lever.</strong> FP8 KV
            cache is orthogonal to weight/activation quantization: it shrinks the
            per-request KV footprint rather than the weights, so it composes with
            any of the formats above. You can run BF16 weights with an FP8 KV
            cache, or FP8 weights with a BF16 KV cache. They are independent
            flags. See Section 5 (PagedAttention &amp; KV-Cache) for why KV
            footprint is the binding constraint on batch size.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Format → bits → family → what it buys you (vLLM docs, accessed 2026-06-07)"
          >
            The format catalogue
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={formatRows}
            columnDefinitions={[
              { id: 'format', header: 'Format', cell: (r) => r.format, minWidth: 150 },
              { id: 'bits', header: 'Bits', cell: (r) => r.bits, minWidth: 170 },
              { id: 'family', header: 'Family', cell: (r) => r.family, minWidth: 130 },
              { id: 'notes', header: 'Notes', cell: (r) => r.notes, minWidth: 320 },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            Families and bit-widths from the vLLM quantization docs index (
            <Link
              external
              href="https://docs.vllm.ai/en/stable/features/quantization/"
            >
              docs.vllm.ai/features/quantization
            </Link>
            , accessed 2026-06-07), FP8 page (
            <Link
              external
              href="https://docs.vllm.ai/en/stable/features/quantization/fp8.html"
            >
              fp8.html
            </Link>
            ) and quantized-KV-cache page (
            <Link
              external
              href="https://docs.vllm.ai/en/stable/features/quantization/quantized_kvcache.html"
            >
              quantized_kvcache.html
            </Link>
            ). Block-scaled FP4/MXFP formats are authored with NVIDIA Model
            Optimizer or llm-compressor; the docs list these under the supported
            methods rather than as a single fixed bit-width.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which formats run on which NVIDIA GPU generation (and AMD): the cell that decides your options"
          >
            Hardware-support matrix
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The single most important fact about quantization is that{' '}
            <strong>support is gated by silicon generation</strong>. FP8 compute
            needs compute capability &ge; 8.9 (Ada Lovelace and Hopper); on
            Ampere, Turing or Volta an FP8 checkpoint can only run weight-only,
            and you should reach for INT4/INT8 weight-only formats instead. The
            table below reproduces vLLM&apos;s compatibility matrix as published.
          </Box>
          <Table
            items={hwRows}
            columnDefinitions={[
              { id: 'impl', header: 'Implementation', cell: (r) => r.impl, minWidth: 140 },
              { id: 'volta', header: 'Volta', cell: (r) => r.volta },
              { id: 'turing', header: 'Turing', cell: (r) => r.turing },
              { id: 'ampere', header: 'Ampere', cell: (r) => r.ampere },
              { id: 'ada', header: 'Ada', cell: (r) => r.ada },
              { id: 'hopper', header: 'Hopper', cell: (r) => r.hopper },
              { id: 'amd', header: 'AMD GPU', cell: (r) => r.amd },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            Y = supported, N = not supported, Y* = caveat. From vLLM&apos;s
            supported-hardware table (
            <Link
              external
              href="https://docs.vllm.ai/en/stable/features/quantization/"
            >
              docs.vllm.ai/features/quantization
            </Link>
            , accessed 2026-06-07). The published table also lists Intel GPU and
            x86 CPU columns (omitted here for width). Turing carries a caveat:
            per the docs, it does not support Marlin MXFP4. FP8 W8A8 is the only
            row supported on AMD GPU (MI300-class) in this matrix. Blackwell-class
            low-bit float formats (NVFP4/MXFP4/MXFP8) are documented on their own
            method pages rather than in this generation grid. Treat
            Blackwell support as additive to the Hopper column and confirm against
            the per-method page.
          </Box>
          <Alert type="warning">
            <strong>Read the caveats, not just the checkmarks.</strong> A green
            cell means "vLLM has a kernel path for this format on this
            generation," not "it is fast." On Ampere/Turing, FP8
            checkpoints fall back to weight-only W8A16 via Marlin, with correct
            output, but you lose the FP8 compute speedup. Always match the format
            to silicon that has native tensor-core support for it.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="--quantization, checkpoint-embedded config, and online vs prequantized"
          >
            How to enable it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            There are two ways vLLM learns what quantization to apply, and they
            cover the two common situations.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Checkpoint-embedded config (the common case)</Box>
              <Box variant="p">
                Prequantized checkpoints from the Hub carry a quantization config
                in their metadata (for example a <code>quantization_config</code>{' '}
                block in <code>config.json</code>). vLLM auto-detects it, so you
                just point at the model and serve. This is the path for any AWQ,
                GPTQ, FP8 or NVFP4 checkpoint someone has already produced. No flag
                needed; the config in the checkpoint is the source of truth.
              </Box>
            </div>
            <div>
              <Box variant="h3">The <code>--quantization</code> flag (override / online)</Box>
              <Box variant="p">
                Passing <code>--quantization fp8</code> (or the engine arg{' '}
                <code>quantization=&quot;fp8&quot;</code>) tells vLLM to quantize an
                unquantized checkpoint <em>online</em> at load time, or to force a
                specific method/backend. Online FP8 uses a per-tensor scale and is
                the zero-friction way to get FP8 from a BF16 model, though the
                docs note latency gains are more limited than a properly
                prequantized checkpoint.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>KV cache is enabled separately.</strong> Quantizing the KV
            cache is its own flag: <code>--kv-cache-dtype fp8</code> (engine arg{' '}
            <code>kv_cache_dtype=&quot;fp8&quot;</code>), with{' '}
            <code>auto</code> meaning "use the model&apos;s native
            dtype." Scales can be left at 1.0, estimated on-the-fly during
            warmup (<code>calculate_kv_scales=True</code>), or (for best
            accuracy) baked in from a dataset calibration via llm-compressor.
            Source:{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/stable/features/quantization/quantized_kvcache.html"
            >
              quantized_kvcache.html
            </Link>
            , accessed 2026-06-07.
          </Box>
          <Alert type="info">
            <strong>Online vs prequantized, in one line.</strong> Online
            quantization is convenient and needs no separate artifact, but it
            applies a coarse (per-tensor) scheme at load time and leaves
            throughput on the table. Prequantized checkpoints carry per-channel /
            per-group scales computed offline with calibration data, giving better
            accuracy and better speed, at the cost of producing the checkpoint
            once. For production, prefer prequantized; for a quick fit-it-on-the-GPU
            experiment, online is fine.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Accuracy vs throughput vs what your GPU actually supports"
          >
            Choosing a format
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Work backward from the constraint. The decision is rarely
            "which format is best" in the abstract. It is
            "what does my silicon support, and how much accuracy can this
            workload give up?"
          </Box>
          <DecisionDiagram />
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Start with hardware</Box>
              <Box variant="p">
                The matrix prunes the option set before accuracy even enters. Ada
                or Hopper: FP8 W8A8 is the default high-throughput path. Ampere or
                older: INT4/INT8 weight-only (AWQ/GPTQ on Marlin). Blackwell: the
                FP4 microscaling formats give the best accuracy-per-byte.
              </Box>
            </div>
            <div>
              <Box variant="h3">Then accuracy budget</Box>
              <Box variant="p">
                8-bit (FP8/INT8) is the conservative choice: the docs cite up
                to ~1.6x throughput with minimal accuracy impact for FP8. 4-bit
                weight-only saves the most memory but costs more accuracy and
                benefits most from calibration (AWQ&apos;s activation-aware
                weighting, GPTQ&apos;s per-group scales). Always measure on your own
                eval, not the model card&apos;s.
              </Box>
            </div>
            <div>
              <Box variant="h3">Then throughput shape</Box>
              <Box variant="p">
                Weight-only formats help most when weight bytes dominate (small
                batch, bandwidth-bound decode). W8A8 adds compute speedup that
                shows up at larger batches. Layer FP8 KV cache on top when KV
                footprint, not weights, is what caps your batch size.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="small">
            FP8 throughput/accuracy framing from{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/stable/features/quantization/fp8.html"
            >
              docs.vllm.ai/features/quantization/fp8
            </Link>
            , accessed 2026-06-07 ("up to a 1.6x improvement in throughput
            with minimal impact on accuracy"). Treat the exact multiplier as
            model- and workload-dependent.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Going deeper</Header>}>
        <SpaceBetween size="s">
          <ExpandableSection headerText="Prequantized vs online: what actually differs in the checkpoint">
            <SpaceBetween size="s">
              <Box variant="p">
                A prequantized checkpoint ships the low-precision weights{' '}
                <em>plus</em> the scale tensors computed offline. Tools like
                llm-compressor and AutoAWQ run a calibration pass over a small
                dataset to choose per-channel or per-group scales that minimise the
                quantization error where it matters most. vLLM loads those weights
                and scales directly. No quantization happens at serve time.
              </Box>
              <Box variant="p">
                Online quantization (<code>--quantization fp8</code> on a BF16
                model) computes scales at load time with no calibration data,
                typically a single per-tensor scale per weight. It is strictly
                less precise than an offline-calibrated checkpoint and, per the FP8
                docs, yields more limited latency improvement. The mental model:
                online buys you the memory shrink immediately; prequantized buys you
                the memory shrink <em>and</em> the throughput, at the cost of
                producing the artifact.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="Why one format maps to several kernels (and where to read the dispatch)">
            <SpaceBetween size="s">
              <Box variant="p">
                A single checkpoint format is not one kernel. A block-scaled FP8
                checkpoint can dispatch to DeepGEMM or CUTLASS on Hopper/Blackwell,
                fall back to Marlin on older silicon, or to a portable Triton
                kernel as a last resort. vLLM picks the highest-priority kernel
                whose minimum compute capability the device satisfies, which
                is why an AWQ checkpoint runs on Marlin on an A100 but the same
                logical format may take a different path on an H100.
              </Box>
              <Box variant="p">
                That selection logic (
                <code>quant_config.get_quant_method()</code>, the per-format kernel
                priority lists, and the capability gating) is walked
                file-by-file in the <strong>Inside the Codebase</strong> section,
                "Model Layer, Quantization &amp; LoRA" tab. This section
                tells you which formats exist and how to ask for them; that tab
                shows how the request becomes a concrete GEMM call.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="The number formats themselves (FP8 / NVFP4 / MXFP4): where to go">
            <Box variant="p">
              This section deliberately treats the formats as a support surface and
              does not re-derive the bit layouts. FP8 E4M3 vs E5M2 (mantissa vs
              dynamic-range trade-off), the microscaling block formats NVFP4 /
              MXFP4 / MXFP8, and why block scaling is the key to low-bit accuracy
              are covered at the hardware level in the{' '}
              <Link external href="../silicon-memory-inference/">
                Silicon, Memory &amp; Inference
              </Link>{' '}
              deep dive, Section 24 ("Quantization and Precision") and
              Section 13 ("NVIDIA Blackwell"). Read those for the{' '}
              <em>why these formats exist</em>; read this for{' '}
              <em>how vLLM lets you use them</em>.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
