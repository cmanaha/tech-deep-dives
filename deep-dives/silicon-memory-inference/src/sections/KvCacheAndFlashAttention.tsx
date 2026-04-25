import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { KvCacheDiagram } from '../components/KvCacheDiagram';

interface ModelKvRow {
  model: string;
  variant: string;
  qHeads: string;
  kvHeads: string;
  ratio: string;
}

const modelKvRows: ModelKvRow[] = [
  { model: 'Llama 2 70B', variant: 'GQA', qHeads: '64', kvHeads: '8', ratio: '8:1' },
  { model: 'Llama 3.1 70B', variant: 'GQA', qHeads: '64', kvHeads: '8', ratio: '8:1' },
  { model: 'Mistral 7B', variant: 'GQA', qHeads: '32', kvHeads: '8', ratio: '4:1' },
  { model: 'Mixtral 8x7B', variant: 'GQA', qHeads: '32', kvHeads: '8', ratio: '4:1' },
  { model: 'Qwen3-235B-A22B', variant: 'GQA', qHeads: '64', kvHeads: '8', ratio: '8:1' },
  { model: 'DeepSeek-V3', variant: 'MLA (kv_lora_rank=512)', qHeads: '128', kvHeads: 'compressed latent', ratio: 'further reduced' },
];

export function KvCacheAndFlashAttention() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The two software-side levers that move decode arithmetic intensity right of the ridge"
          >
            KV cache and FlashAttention
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why this section.</strong> Section 3 said decode workloads
            sit two orders of magnitude below the ridge point on the roofline.
            Sections 22 (MoE) and 23 (Quantization) showed two architectural
            ways to move that placement. This section covers the two software
            techniques that do the same job at the kernel level — KV-cache
            management for attention&apos;s memory cost, and FlashAttention-
            class fusion for attention&apos;s arithmetic intensity. They are
            in every production inference stack worth mentioning.
          </Box>
          <Box variant="p">
            <strong>The connection to the silicon.</strong> Section 5
            (Anatomy of a kernel execution) had the FlashAttention example
            already — it collapses the three-stage attention chain into a
            single fused kernel that keeps a tile resident in SMEM / TMEM /
            SBUF rather than round-tripping to HBM. KV cache management is
            the complementary technique: it determines how much HBM each
            in-flight request is consuming and how much memory headroom the
            serving stack has for batching. Together they decide whether
            decode is fed.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What the KV cache is and why it grows"
          >
            KV cache fundamentals
          </Header>
        }
      >
        <SpaceBetween size="m">
          <KvCacheDiagram />
          <Box variant="p">
            <strong>What it stores.</strong> Each transformer layer&apos;s
            attention block produces K (key) and V (value) tensors for every
            token in the sequence. During decode, every new token attends to
            every prior token&apos;s K and V. Recomputing those tensors per
            token would be quadratic; instead, the K and V values are cached
            after the first computation and reused.
          </Box>
          <Box variant="p">
            <strong>How big it gets.</strong> Per request, the KV cache is
            roughly{' '}
            <code>2 × num_layers × seq_len × num_kv_heads × head_dim × bytes_per_value</code>
            . For Llama 3 70B (80 layers, 8 KV heads after GQA, 128 head_dim)
            in FP16 at 8K context: about 5 GB per request. At batch 32 that
            is 160 GB — exceeding H200&apos;s 141 GB before the model weights
            even fit. Continuous-batching servers (vLLM, TensorRT-LLM, SGLang)
            spend most of their memory budget on KV cache, not on model
            parameters.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="MHA, GQA, MQA, and MLA — the same idea taken progressively further"
          >
            Attention variants — how to shrink the KV cache
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The simplest way to reduce KV-cache size is to reduce the
            <code>num_kv_heads</code> factor. The attention variants in
            production all do this, with progressive aggression.
          </Box>
          <Table
            items={modelKvRows}
            columnDefinitions={[
              { id: 'model', header: 'Model', cell: (r) => r.model, minWidth: 200 },
              { id: 'var', header: 'Variant', cell: (r) => r.variant },
              { id: 'q', header: 'Q heads', cell: (r) => r.qHeads },
              { id: 'kv', header: 'KV heads', cell: (r) => r.kvHeads },
              { id: 'ratio', header: 'Q:KV ratio', cell: (r) => r.ratio },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            Numbers from each model&apos;s author docs / HuggingFace model card.
            DeepSeek-V3 uses Multi-Head Latent Attention (MLA) which compresses
            KV further than GQA via a learned latent — covered in the
            DeepSeek-V3 technical report
            ({' '}
            <Link external href="https://arxiv.org/abs/2412.19437">
              arXiv:2412.19437
            </Link>
            , accessed 2026-04-23).
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">MHA → GQA → MQA</Box>
              <Box variant="p">
                MHA has one KV pair per query head. GQA groups query heads
                (typically 4:1 or 8:1) to share KV pairs, cutting KV cache
                memory by the same factor. MQA uses one KV pair shared across
                all query heads. Almost every modern model uses GQA; MQA
                trades quality for the largest KV-cache reduction.
              </Box>
            </div>
            <div>
              <Box variant="h3">MLA (DeepSeek-V3)</Box>
              <Box variant="p">
                Multi-Head Latent Attention compresses KV through a learned
                low-rank projection (kv_lora_rank=512 for DeepSeek-V3). The
                cache stores compressed latents; the K and V are reconstructed
                on read. Cuts KV-cache memory aggressively while preserving
                quality — one reason DeepSeek-V3 fits its 671B parameters
                into a deployable footprint.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The kernel that proved fusion's value to production inference"
          >
            FlashAttention — fusion as the lever
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What FlashAttention does.</strong> Naïve attention is three
            kernels — a Q × K^T matmul, a softmax, and a softmax × V matmul.
            Each kernel pair has to round-trip through HBM because the
            intermediate (the attention scores tensor) is too large to keep
            in SMEM and the softmax kernel cannot assume the previous
            kernel&apos;s SMEM state. FlashAttention fuses the three operators
            into a single kernel. The working tile lives in SMEM / TMEM / SBUF
            for the entire computation. Two HBM round-trips disappear.
          </Box>
          <Alert type="info" header="The math FlashAttention does not change">
            The total FLOPs for attention is identical between naïve attention
            and FlashAttention — same matmul counts, same softmax. What
            changes is the byte count in the denominator of arithmetic
            intensity. By keeping the tile resident, fewer bytes flow through
            HBM per FLOP performed. Arithmetic intensity rises, the workload
            moves right on the roofline, and on bandwidth-bound silicon the
            wall-clock improves.
          </Alert>
          <Box variant="p">
            <strong>Generations.</strong> FlashAttention v1 (2022) targeted
            Volta and Ampere. v2 added support for backward and parallelism
            improvements. v3 (2024) targeted Hopper specifically — uses async
            copy + wgmma — and is the production version on H100 / H200.
            Blackwell variants land on tcgen05.mma + TMEM via the same
            general technique. Equivalent fusion has been ported to Trainium
            via NKI kernels.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The serving-side memory management technique"
          >
            PagedAttention and the KV cache as managed memory
          </Header>
        }
      >
        <Box variant="p">
          PagedAttention is the technique vLLM popularized for managing KV
          cache memory across many concurrent requests. Instead of giving each
          request a contiguous KV-cache buffer (which fragments under variable
          context lengths and dynamic batching), PagedAttention breaks the
          cache into fixed-size pages — analogous to virtual memory pages in
          an OS. Requests acquire and release pages from a pool. The result is
          near-zero memory waste from fragmentation, which directly raises the
          maximum batch size the server can sustain on a given HBM budget.
          Section 24 (Disaggregated Serving) covers how this composes with
          prefill / decode disaggregation.
        </Box>
        <ExpandableSection headerText="Why KV-cache management is the second lever after batching">
          <Box variant="p">
            Section 3 said batching is the first-order lever for moving decode
            arithmetic intensity rightward on the roofline. Batching is bounded
            by KV-cache memory. KV-cache shrinking techniques (GQA, MLA,
            FP8 KV-cache, paging) raise the ceiling on batch size, which in
            turn raises arithmetic intensity. Quantization (Section 23) does
            the same job from a different angle — fewer bytes per parameter
            also means fewer bytes per KV-cache entry. In production these
            techniques compose; in panels and architecture reviews they are
            often discussed in isolation, which obscures the through-line.
          </Box>
        </ExpandableSection>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where the KV-cache and FlashAttention story intersects with silicon"
          >
            How this maps to the silicon stack
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">NVIDIA</Box>
            <Box variant="p">
              FlashAttention-3 is the production attention kernel on Hopper.
              Blackwell adds tcgen05 + TMEM staging. PagedAttention shipped in
              vLLM and TRT-LLM. KV-cache FP8 is supported in TRT-LLM&apos;s
              PyTorch workflow. Triton and CuTeDSL host alternative
              implementations.
            </Box>
          </div>
          <div>
            <Box variant="h3">AWS Trainium</Box>
            <Box variant="p">
              FlashAttention equivalents are authored in NKI and ship as
              first-class kernels in the Neuron SDK. The fusion principle is
              identical — keep the tile in SBUF rather than round-tripping
              to HBM. The compiler-managed memory model makes this even more
              direct: SBUF residency is an explicit compile-time decision,
              not a runtime cache outcome.
            </Box>
          </div>
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
}
