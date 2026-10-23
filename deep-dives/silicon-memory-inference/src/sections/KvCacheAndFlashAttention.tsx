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
import { Cite } from '../components/Cite';
import { S } from '../sources/KvCacheAndFlashAttention';

const llamaKvNote =
  '2 (K and V) x 80 layers x 8 KV heads x 128 head dim (8,192 / 64 heads) x 2 bytes (BF16) = 327,680 B per token. 8,192 tokens = 2.68 GB; 32 such requests = 85.9 GB; 128,000 tokens = 41.9 GB.';
const weightsNote =
  '70,553,706,496 parameters x 2 B = 141.1 GB in BF16, x 1 B = 70.6 GB in FP8. 70.6 + 85.9 = 156.5 GB, above one H200 at 141 GB. FP8 KV halves 85.9 to 42.9 GB; 70.6 + 42.9 = 113.5 GB.';
const nodeNote = '8 x 141 GB = 1,128 GB of HBM; 1,128 - 70.6 GB of FP8 weights = 1,057 GB.';
const spreadNote = '327,680 B (Llama 3.1 70B, BF16) / 890 B (DeepSeek-V4.1-Flash) = 368.';
const mistralNote = '2 x 32 layers x 8 KV heads x 128 head dim (4,096 / 32 heads) x 2 B = 131,072 B (128 KiB).';
const qwenNote = '2 x 94 layers x 4 KV heads x 128 head dim x 2 B = 192,512 B (188 KiB).';
const mlaNote =
  '(512 latent + 64 RoPE key) x 61 layers x 2 B = 70,272 B (69 KiB), counting only the compressed latent and the decoupled RoPE key, the two vectors the report says are cached.';
const compareNote = '192,512 / 327,680 = 0.59, so 41% less. 327,680 / 70,272 = 4.7.';
const swaNote = '18 of the 36 entries in layer_types are sliding_attention, with sliding_window 128.';
const hybridNote = '48 layers / full_attention_interval 4 = 12 full-attention layers; the other 36 use the linear_* attention settings.';
const throughputNote =
  'H200 BF16 1,979 TFLOPS sparse, 989.5 dense. HGX B200 FP16/BF16 36 PFLOPS sparse for 8 GPUs, 2.25 PFLOPS dense per GPU. 2,250 / 989.5 = 2.3.';

const sfuNote = 'SFU EX2 table: 4.5 (Hopper), 5 (Blackwell) and 10.7 (Blackwell Ultra) TeraExponentials/s.';

interface ModelKvRow {
  model: string;
  bytes: React.ReactNode;
  attention: React.ReactNode;
}

const modelKvRows: ModelKvRow[] = [
  {
    model: 'Mistral 7B',
    bytes: (
      <>
        131,072 B (128 KiB)
        <Cite s={S.mistral7bConfig} kind="derived" note={mistralNote} />
      </>
    ),
    attention: (
      <>
        GQA, 32 query : 8 KV heads (4:1)
        <Cite s={S.mistral7bConfig} />
      </>
    ),
  },
  {
    model: 'Mixtral 8x7B',
    bytes: (
      <>
        131,072 B (128 KiB)
        <Cite s={S.mixtralConfig} kind="derived" note={mistralNote} />
      </>
    ),
    attention: (
      <>
        GQA, 32 query : 8 KV heads (4:1)
        <Cite s={S.mixtralConfig} />
      </>
    ),
  },
  {
    model: 'Llama 3.1 70B',
    bytes: (
      <>
        327,680 B (320 KiB)
        <Cite s={S.llama3Herd} kind="derived" note={llamaKvNote} />
      </>
    ),
    attention: (
      <>
        GQA, 64 query : 8 KV heads (8:1)
        <Cite s={S.llama3Herd} />
      </>
    ),
  },
  {
    model: 'Qwen3-235B-A22B',
    bytes: (
      <>
        192,512 B (188 KiB)
        <Cite s={S.qwen3Config} kind="derived" note={qwenNote} />
      </>
    ),
    attention: (
      <>
        GQA, 64 query : 4 KV heads (16:1)
        <Cite s={S.qwen3Config} />
      </>
    ),
  },
  {
    model: 'DeepSeek-V3',
    bytes: (
      <>
        70,272 B (69 KiB)
        <Cite s={S.deepseekV3Report} kind="derived" note={mlaNote} />
      </>
    ),
    attention: (
      <>
        MLA, one 512-wide latent shared by 128 query heads
        <Cite s={S.deepseekV3Config} />
      </>
    ),
  },
  {
    model: 'DeepSeek-V4.1-Flash',
    bytes: (
      <>
        890 B, global cache
        <Cite s={S.deepseekV41Flash} />
      </>
    ),
    attention: (
      <>
        Compressed sparse attention, FP4 (4-bit floating point) main KV
        <Cite s={S.deepseekV41Flash} />
      </>
    ),
  },
];

export function KvCacheAndFlashAttention() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Size the key-value cache from a model's config before you size the batch, and keep attention's working tile on chip"
          >
            KV Cache and FlashAttention
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Decode sits far below the ridge point (<em>Roofline and Arithmetic Intensity</em>):
            every generated token rereads the weights and the keys and values of every earlier
            token. Batching moves decode toward the ridge, and the KV (key-value) cache decides how
            large a batch fits in HBM (High Bandwidth Memory). FlashAttention works on the other
            half of the ratio: it cuts the bytes attention moves through HBM.
          </Box>
          <Box variant="p">
            KV bytes per token is the figure that decides how much context one GPU holds. Across
            current models it spans more than 300x, from 327,680 bytes for Llama 3.1 70B
            <Cite s={S.llama3Herd} kind="derived" note={llamaKvNote} /> to 890 bytes of global
            cache for DeepSeek-V4.1-Flash.
            <Cite s={S.deepseekV41Flash} />
            <Cite s={S.deepseekV41Flash} kind="derived" note={spreadNote} />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Turn a model config into KV bytes per request, and see when the cache or the weights take most of the HBM"
          >
            KV cache fundamentals
          </Header>
        }
      >
        <SpaceBetween size="m">
          <KvCacheDiagram />
          <Box variant="p">
            <strong>What it stores.</strong> Each layer&apos;s attention produces a key (K) and a
            value (V) vector per KV head for every token, and each new token attends to all the
            earlier ones. The server computes them once and keeps them, so the cache grows by one
            entry per token in every layer.
          </Box>
          <Box variant="p">
            <strong>How big it gets.</strong> For one request, the cache holds{' '}
            <code>2 × num_layers × seq_len × num_kv_heads × head_dim × bytes_per_value</code>. The
            formula covers multi-head, grouped-query and multi-query attention; latent and
            compressed attention follow their own (below). Llama 3.1 70B has 80 layers, 8 KV heads
            and a head dimension of 128.
            <Cite s={S.llama3Herd} /> In BF16 (bfloat16) that is 327,680 bytes per token, 2.68 GB
            for an 8K-token request and 85.9 GB for a batch of 32 such requests. A single
            128,000-token request, within the model&apos;s 128K context
            <Cite s={S.llama31ModelCard} />, holds 41.9 GB.
            <Cite s={S.llama3Herd} kind="derived" note={llamaKvNote} />
          </Box>
          <Box variant="p">
            <strong>What fits on one GPU.</strong> The model has 70.55 billion parameters.
            <Cite s={S.llama70bApi} /> In BF16 the weights are 141.1 GB and fill an H200&apos;s
            141 GB on their own.
            <Cite s={S.h200Page} /> In FP8 (8-bit floating point) they shrink to 70.6 GB, but the
            batch&apos;s 85.9 GB of BF16 KV brings the total to 156.5 GB, more than one H200.
            Storing the KV in FP8 as well halves it to 42.9 GB, and 113.5 GB fits.
            <Cite s={S.llama70bApi} kind="derived" note={weightsNote} />
            <Cite s={S.trtllmQuantization} />
          </Box>
          <Box variant="p">
            <strong>Which one dominates depends on the deployment.</strong> On a single GPU, the
            weights usually take most of the HBM: serving a 13B model on a 40 GB A100, the vLLM
            authors measured about 65% of memory on weights and close to 30% on KV.
            <Cite s={S.vllmPaper} kind="measured" /> Across an eight-GPU node the balance flips.
            Eight H200s hold 1,128 GB, and 70.6 GB of FP8 weights leave about 1,057 GB for the KV
            cache and activations.
            <Cite s={S.h200Page} kind="derived" note={nodeNote} />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why the attention design, more than the parameter count, decides how much context fits in HBM"
          >
            Attention variants and KV bytes per token
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every attention variant shrinks the <code>num_kv_heads × head_dim</code> term or
            replaces it. MHA (multi-head attention) gives each query head its own K and V. GQA
            (grouped-query attention) lets a group of query heads share one KV head, which cuts
            the cache by the group size. MQA (multi-query attention) shares one KV head across all
            query heads; it saves the most and can cost quality, while GQA reaches quality close to
            multi-head attention at a speed close to MQA.
            <Cite s={S.gqaPaper} /> MLA (Multi-head Latent Attention) replaces the per-head K and
            V with one compressed latent. In the table, GQA groups 4 to 16 query heads per KV head, and
            KV bytes assume BF16 entries unless noted.
          </Box>
          <Table
            items={modelKvRows}
            columnDefinitions={[
              { id: 'model', header: 'Model', cell: (r) => r.model },
              { id: 'bytes', header: 'KV bytes per token', cell: (r) => r.bytes },
              { id: 'attention', header: 'Attention', cell: (r) => r.attention },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="p">
            <strong>Read the table as the formula at work.</strong> Mixtral 8x7B, a mixture of
            experts (MoE) with eight experts per layer, stores the same 128 KiB per token as
            Mistral 7B, because its layers and KV heads have the same shape.
            <Cite s={S.mixtralConfig} /> Qwen3-235B-A22B stores 41% less per token than Llama 3.1
            70B, because its 16:1 grouping outweighs its 94 layers.
            <Cite s={S.qwen3Config} kind="derived" note={compareNote} /> From Llama 3.1 70B to
            DeepSeek-V4.1-Flash&apos;s global cache the spread is more than 300x: the same HBM holds
            368 times as many tokens of global cache.
            <Cite s={S.deepseekV41Flash} kind="derived" note={spreadNote} />
          </Box>
          <ExpandableSection headerText="How MLA, sliding windows and hybrid layers change the formula">
            <SpaceBetween size="s">
              <Box variant="p">
                Per token and per layer, MLA stores a 512-wide latent plus a 64-wide rotary
                position embedding (RoPE) key, shared by all 128 query heads.
                <Cite s={S.deepseekV3Config} /> The heads&apos; keys and values are rebuilt from
                the latent, and only the latent and the RoPE key are cached
                <Cite s={S.deepseekV3Report} />, 4.7 times less per token than Llama 3.1 70B.
                <Cite s={S.deepseekV3Report} kind="derived" note={compareNote} /> Kimi K2 keeps
                the same 512-wide latent.
                <Cite s={S.kimiK2Config} />
              </Box>
              <Box variant="p">
                gpt-oss-120b alternates full-attention layers with layers that attend only to the
                last 128 tokens, so half its layers hold a cache of fixed size.
                <Cite s={S.gptOss120bConfig} kind="derived" note={swaNote} /> Qwen3-Next-80B-A3B
                keeps a KV cache in 12 of its 48 layers and uses linear attention in the rest.
                <Cite s={S.qwen3NextConfig} kind="derived" note={hybridNote} />{' '}
                DeepSeek-V4.1-Flash&apos;s 890 bytes cover its global cache; a separate
                sliding-window cache sits outside that figure.
                <Cite s={S.deepseekV41Flash} />
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            Before sizing a deployment, read the model&apos;s <code>config.json</code>:{' '}
            <code>num_key_value_heads</code>, <code>head_dim</code>, <code>kv_lora_rank</code>,{' '}
            <code>layer_types</code>, <code>sliding_window</code> and{' '}
            <code>full_attention_interval</code> set the KV budget.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Same FLOPs, fewer HBM bytes: why fusion speeds up attention, and which generation to run on which GPU"
          >
            FlashAttention: keep the attention tile on chip
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What FlashAttention does.</strong> Unfused attention runs three kernels, the
            queries (Q) times K transposed, a softmax, then a multiply by V, and writes the score matrix to HBM
            between them because it is too large to keep on chip. FlashAttention fuses the three
            into one kernel that streams K and V through on-chip memory in tiles and never writes
            the score matrix out.
            <Cite s={S.flashAttentionPaper} /> The tile lives in SMEM (shared memory) on NVIDIA
            GPUs, in TMEM (Tensor Memory) as well on Blackwell
            <Cite s={S.flashAttention4Paper} />, and in SBUF (State Buffer) on Trainium.
            <Cite s={S.nkiAttentionCte} />
          </Box>
          <Alert type="info" header="FlashAttention keeps the FLOPs and cuts the bytes">
            In the forward pass, FlashAttention performs the same FLOPs as unfused attention. It
            changes the bytes: fewer cross HBM per FLOP, so arithmetic intensity rises and
            bandwidth-bound attention finishes sooner.
            <Cite s={S.flashAttentionPaper} />
          </Alert>
          <Box variant="p">
            <strong>Pick the generation by GPU.</strong> FlashAttention-2 supports Ampere, Ada and
            Hopper GPUs. FlashAttention-3 is a beta built for Hopper (H100)
            <Cite s={S.flashAttentionReadme} />; it overlaps asynchronous data movement and
            Hopper&apos;s warpgroup matrix multiplies (wgmma) with the softmax.
            <Cite s={S.flashAttention3Paper} /> FlashAttention-4 is written in CuTe DSL (
            <em>NVIDIA Compilers and Kernel Tooling</em>), targets Hopper and Blackwell (H100,
            B200) and installs with{' '}
            <code>pip install flash-attn-4</code>.
            <Cite s={S.fa4Readme} /> It ships as betas; fa4-v4.0.0.beta35 came out on
            2026-10-14.
            <Cite s={S.fa4Release} />
          </Box>
          <Box variant="p">
            <strong>Blackwell shifts the bottleneck toward the softmax.</strong> From H200 to B200,
            dense BF16 tensor throughput per GPU rose 2.3x
            <Cite s={S.h200Page} />
            <Cite s={S.hgxPage} kind="derived" note={throughputNote} />, while the special function
            units (SFUs) that compute the softmax&apos;s exponentials went from 4.5 to 5
            TeraExponentials/s. NVIDIA notes that the softmax stage can become a latency bottleneck
            for long-context reasoning models, and Blackwell Ultra doubles SFU throughput for the
            key instructions attention uses.
            <Cite s={S.blackwellUltraBlog} note={sfuNote} /> FlashAttention-4 answers with software-emulated
            exponentials and conditional softmax rescaling: a fused kernel runs at the pace of its
            slowest unit.
            <Cite s={S.flashAttention4Paper} />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Fixed-size blocks let a server fill HBM with live requests, and every lever on this page raises the batch it can hold"
          >
            PagedAttention and the KV cache as managed memory
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Serving systems before vLLM reserved a contiguous buffer per request, sized for its
            maximum length, and only 20.4% to 38.2% of their KV memory held actual token state.
            <Cite s={S.vllmPaper} kind="measured" /> PagedAttention splits the cache into
            fixed-size blocks, like operating-system memory pages, and hands them out from a pool
            as each request grows, which brings the waste near zero and raises the batch a given
            HBM budget can hold.
            <Cite s={S.vllmPaper} kind="measured" /> TensorRT-LLM manages its cache the same way,
            as a pool of blocks, and reuses blocks across requests that share a prefix.
            <Cite s={S.trtllmKvCache} /> <em>Disaggregated Serving and Speculative Decoding</em>{' '}
            covers moving these blocks from prefill to decode.
          </Box>
          <ExpandableSection headerText="Why KV-cache management is the second lever after batching">
            <Box variant="p">
              Batching is the first lever for decode arithmetic intensity (
              <em>Roofline and Arithmetic Intensity</em>), and KV memory caps the batch. Every
              technique on this page raises that cap: fewer KV heads (GQA), a compressed latent
              (MLA), sliding windows and linear-attention layers, fewer bits per entry, and paging.
              FP8 and NVFP4 (NVIDIA&apos;s 4-bit floating point format) KV caches are both
              supported in TensorRT-LLM
              <Cite s={S.trtllmQuantization} />, and DeepSeek-V4.1-Flash stores its main KV in
              FP4.
              <Cite s={S.deepseekV41Flash} /> <em>Quantization and Precision</em> applies the same
              bytes-per-value lever to the weights.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What to run and configure on NVIDIA GPUs and on Trainium, and where the KV cache goes when HBM runs out"
          >
            How this maps to the silicon stack
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">NVIDIA</Box>
              <Box variant="p">
                vLLM and TensorRT-LLM both page the KV cache.
                <Cite s={S.vllmPaper} />
                <Cite s={S.trtllmKvCache} /> In TensorRT-LLM,{' '}
                <code>KvCacheConfig(dtype=&apos;fp8&apos;)</code> stores the cache in FP8, and
                NVFP4 KV is also listed.
                <Cite s={S.trtllmQuantization} />
              </Box>
            </div>
            <div>
              <Box variant="h3">AWS Trainium</Box>
              <Box variant="p">
                The NKI (Neuron Kernel Interface) library ships an attention CTE (context
                encoding) kernel for prefill on Trn2 and Trn3. The fusion is the same, with the
                tile held in SBUF, and the kernel decides what stays there: for K and V longer than
                10K tokens it processes 8K-token sections one at a time to fit in SBUF.
                <Cite s={S.nkiAttentionCte} />
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            When the working set outgrows HBM after every lever above, the KV cache moves down the
            hierarchy: once <code>host_cache_size</code> (default 0) is set, TensorRT-LLM copies an
            evicted block&apos;s KV state to host memory.
            <Cite s={S.trtllmKvCache} /> <em>Flash as a Cache Tier for Inference</em> sizes host
            DRAM and local NVMe for that tier and weighs fetching a cached prefix against
            recomputing it, and the <em>KV Offloading and LMCache</em> section of the{' '}
            <Link href="../vllm/">vLLM Inference Engine</Link> dive covers the software that moves
            it.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
