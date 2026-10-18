import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Link from '@cloudscape-design/components/link';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { DisaggregatedServingDiagram } from '../components/DisaggregatedServingDiagram';
import { Cite } from '../components/Cite';
import { S } from '../sources/DisaggregatedServingAndSpeculative';

const kvNote =
  '2 (K and V) x 80 layers x 8 KV heads x 128 head dim x 2 bytes (BF16) = 327,680 B per token. 8,192 tokens = 2.68 GB; 128,000 tokens = 41.9 GB.';

const flashKvNote = '327,680 / 890 = 368.';

const transferNote =
  'Time = bytes / rate, with Gbps / 8 = GB/s; 2.68 GB for an 8K prompt as in the text. NVLink 5 is 1.8 TB/s bidirectional, used here at 900 GB/s one way. EFA figures carry no direction label; the times read them as per-direction line rates.';

const prefillNote =
  'From Flash as a Cache Tier for Inference: an 8K Llama 3.1 70B prefix costs 1.24 PFLOP, 0.157 s at 8 x 989.5 TFLOPS dense BF16 (NVIDIA lists the sparse 1,979; dense is half). 6.7 / 157 = 4%; 54 / 157 = 34%.';

const specNote =
  'a = 0.8, g = 4: (1 - 0.8^5) / 0.2 = 3.36 tokens; / (1 + 4 x 0.05) = 2.8x. a = 0.5: (1 - 0.5^5) / 0.5 = 1.94 tokens; / 1.2 = 1.6x. The authors found c "always less than 0.05" for drafters a couple of orders of magnitude smaller than the target.';

interface TransferRow {
  path: string;
  rate: React.ReactNode;
  perGb: string;
  short: string;
}

const transferRows: TransferRow[] = [
  {
    path: 'NVLink 5, inside an NVL72 domain',
    rate: (
      <>
        900 GB/s each way
        <Cite s={S.blackwellUltraBlog} />
      </>
    ),
    perGb: '1.1 ms',
    short: '3.0 ms',
  },
  {
    path: 'EFA, p5.48xlarge, all 8 GPUs sending',
    rate: (
      <>
        3,200 Gbps per instance
        <Cite s={S.ec2AcceleratedSpecs} />
      </>
    ),
    perGb: '2.5 ms',
    short: '6.7 ms',
  },
  {
    path: 'EFA, one P5 GPU',
    rate: (
      <>
        400 Gbps
        <Cite s={S.ec2AcceleratedSpecs} kind="derived" note="3,200 Gbps / 8 GPUs." />
      </>
    ),
    perGb: '20 ms',
    short: '54 ms',
  },
  {
    path: 'EFA, one P6-B300 GPU',
    rate: (
      <>
        800 Gbps
        <Cite s={S.ec2AcceleratedSpecs} kind="derived" note="p6-b300.48xlarge: 6,400 Gbps / 8 GPUs." />
      </>
    ),
    perGb: '10 ms',
    short: '27 ms',
  },
  {
    path: 'EFA, one P6e-GB200 GPU',
    rate: (
      <>
        400 Gbps
        <Cite s={S.p6Page} /> or 800 Gbps
        <Cite
          s={S.ec2AcceleratedSpecs}
          kind="derived"
          note="The P6 page gives 400 Gbps of EFAv4 per GPU; the instance specification gives 3,200 Gbps per four-GPU p6e-gb200.36xlarge, 800 per GPU."
        />
      </>
    ),
    perGb: '20 or 10 ms',
    short: '54 or 27 ms',
  },
];

export function DisaggregatedServingAndSpeculative() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="When splitting prefill from decode pays for its KV transfer, and how many tokens one read of the weights can buy"
          >
            Disaggregated Serving and Speculative Decoding
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Prefill reuses each weight read across the whole prompt and sits far above the ridge;
            decode rereads the weights for every token and sits far below it (
            <em>Roofline and Arithmetic Intensity</em>). Sharing GPUs makes the phases interfere
            and forces one parallelism plan on both.
            <Cite s={S.distServe} /> Disaggregated serving gives each phase its own pool and moves
            the KV (key-value) cache between them; speculative decoding lets one weight read emit
            several tokens.
            <Cite s={S.distServe} />
            <Cite s={S.leviathan} />
          </Box>
          <Box variant="p">
            <strong>The split reaches silicon.</strong> On NVIDIA&apos;s Vera Rubin platform,
            Rubin GPUs run prefill and decode attention while the Groq 3 LPX, a rack of LPUs
            (Language Processing Units), runs decode&apos;s FFN (feed-forward network) and MoE
            (mixture of experts) layers and can draft for speculative decoding. Activations then
            cross between the two chips every token.
            <Cite s={S.lpxBlog} />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two pools sized for different latency targets, one KV transfer per request, and when that transfer is cheap enough"
          >
            Disaggregated serving
          </Header>
        }
      >
        <SpaceBetween size="m">
          <DisaggregatedServingDiagram />
          <Box variant="p">
            The router sends the prompt to a prefill worker, which builds the KV cache. NIXL
            (NVIDIA Inference Xfer Library), a point-to-point transfer library
            <Cite s={S.nixlReadme} />, moves the cache from that GPU&apos;s memory straight into a
            decode worker&apos;s over NVLink or EFA (Elastic Fabric Adapter), without blocking
            other requests&apos; forward passes.
            <Cite s={S.dynamoDisaggDoc} />
            <Cite s={S.nixl} /> DistServe served 7.4x more requests within latency targets than
            colocated systems.
            <Cite s={S.distServe} kind="measured" />
          </Box>
          <Box variant="p">
            <strong>Size the pools separately</strong>, prefill for TTFT (time to first token) and
            decode for TPOT (time per output token).
            <Cite s={S.distServe} /> Dynamo&apos;s DeepSeek-R1 recipe on 36 GB200 GPUs gives
            decode eight nodes and prefill one
            <Cite s={S.dynamoR1Recipe} />; AWS&apos;s llm-d test of GPT-OSS on one P6-B200 ran
            prefill as four one-GPU pods and decode as one four-GPU pod.
            <Cite s={S.awsLlmdBlog} />
          </Box>

          <Box variant="h3">What the KV handoff costs</Box>
          <Box variant="p">
            The handoff carries prompt tokens times the model&apos;s KV bytes per token. Llama 3.1
            70B in BF16 (bfloat16), with GQA (grouped-query attention) over 8 KV heads and 80
            layers, stores 327,680 bytes per token: 2.7 GB at 8K tokens, 42 GB at 128K.
            <Cite s={S.llama3Herd} kind="derived" note={kvNote} /> DeepSeek-V4.1-Flash compresses
            its global KV cache, with sparse attention and FP4 (4-bit floating point) entries, to
            890 bytes per token
            <Cite s={S.deepseekV41Flash} />, about 370 times less.
            <Cite s={S.deepseekV41Flash} kind="derived" note={flashKvNote} />
          </Box>
          <Table
            variant="embedded"
            wrapLines
            items={transferRows}
            header={
              <Box variant="h4">
                Time to move a Llama 3.1 70B KV cache
                <Cite s={S.ec2AcceleratedSpecs} kind="derived" note={transferNote} />
              </Box>
            }
            columnDefinitions={[
              { id: 'path', header: 'Path', cell: (r) => r.path, minWidth: 150 },
              { id: 'rate', header: 'Rate', cell: (r) => r.rate, minWidth: 130 },
              { id: 'gb', header: 'Per GB', cell: (r) => r.perGb, minWidth: 80 },
              { id: 'short', header: '8K, 2.7 GB', cell: (r) => r.short, minWidth: 90 },
            ]}
          />
          <Box variant="p">
            <strong>Compare the handoff with the prefill it follows.</strong> An 8K prefill of
            the dense 70B on 8x H100 takes about 0.16 s at dense BF16 peak: the 6.7 ms
            instance-rate handoff is 4% of that, the 54 ms one-GPU handoff 34%.
            <Cite s={S.h100Page} kind="derived" note={prefillNote} /> A one-GPU worker gets 4 of
            a p5.48xlarge&apos;s 32 EFA interfaces, the per-GPU row.
            <Cite s={S.awsLlmdBlog} /> Keep a large-KV model&apos;s handoff on NVLink or spread
            over every interface; a compressed-KV model crosses EFA from one GPU in
            milliseconds.
          </Box>

          <Box variant="h3">Selecting the EFA path</Box>
          <Box variant="p">
            NIXL reaches EFA through its libfabric plugin, alongside UCX (Unified Communication X)
            and storage plugins
            <Cite s={S.nixl} />, and neither engine selects libfabric by default. vLLM&apos;s
            NixlConnector defaults to UCX
            <Cite s={S.vllmNixlWorker} />: set{' '}
            <code>&quot;backends&quot;: [&quot;LIBFABRIC&quot;]</code> in{' '}
            <code>kv_connector_extra_config</code>.
            <Cite s={S.awsLlmdBlog} /> SGLang defaults to Mooncake, and to UCX under NIXL
            <Cite s={S.sglangDisagg} />
            <Cite s={S.sglangEnviron} />: pass <code>--disaggregation-transfer-backend nixl</code>{' '}
            with <code>SGLANG_DISAGGREGATION_NIXL_BACKEND=LIBFABRIC</code>. Dynamo&apos;s EFA
            recipe warns that UCX otherwise falls back to TCP on kernel 6.8 and later.
            <Cite s={S.dynamoGlm5EfaRecipe} /> The vLLM dive&apos;s section{' '}
            <em>vLLM on AWS GPUs, EFA &amp; NIXL</em> covers the setup.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which stack runs the split today, and the pinned recipe or guide to start from"
          >
            Serving stacks
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">NVIDIA Dynamo</Box>
            <Box variant="p">
              Disaggregates SGLang, TensorRT-LLM and vLLM backends
              <Cite s={S.dynamoReadme} /> and orchestrates the Rubin-plus-LPX decode loop.
              <Cite s={S.lpxBlog} /> Pinned recipes cover DeepSeek-R1 on GB200
              <Cite s={S.dynamoR1Recipe} /> and GLM-5 on GB200 over EFA.
              <Cite s={S.dynamoGlm5EfaRecipe} />
            </Box>
          </div>
          <div>
            <Box variant="h3">vLLM</Box>
            <Box variant="p">
              Prefill/decode disaggregation is marked experimental. The KV cache moves through a
              connector such as NixlConnector, MooncakeConnector or LMCache.
              <Cite s={S.vllmDisaggDoc} />
            </Box>
          </div>
          <div>
            <Box variant="h3">SGLang</Box>
            <Box variant="p">
              <code>--disaggregation-mode</code> makes a server prefill or decode
              <Cite s={S.sglangDisagg} />; transfer backends include mooncake, nixl, ascend and
              mori.
              <Cite s={S.sglangChoices} /> Mooncake comes from a KV-centric architecture that
              separates prefill and decode clusters.
              <Cite s={S.mooncakeArxiv} />
            </Box>
          </div>
          <div>
            <Box variant="h3">llm-d</Box>
            <Box variant="p">
              A Kubernetes stack on vLLM with prefill/decode disaggregation and wide expert
              parallelism.
              <Cite s={S.llmdReadme} /> AWS ships an llm-d container with EFA support for EKS
              (Elastic Kubernetes Service) and SageMaker HyperPod, and reports up to 70% more
              tokens per second than plain vLLM for GPT-OSS at 1,024 tokens in and out.
              <Cite s={S.awsLlmdBlog} kind="vendor-claim" />
            </Box>
          </div>
          <div>
            <Box variant="h3">Trainium and Inferentia</Box>
            <Box variant="p">
              NxD Inference (NeuronX Distributed Inference) runs disaggregated inference in Beta
              on Inf2, Trn1 and Trn2, moving the KV cache over EFA device to device with no copy
              through host memory. Automatic prefix caching is not supported with it.
              <Cite s={S.neuronDisagg} />
            </Box>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="How many tokens one read of the weights buys, and the acceptance rate that decides it"
          >
            Speculative decoding
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A drafter proposes γ tokens; the target scores them in one pass, keeps the prefix it
            agrees with and adds one of its own, so a pass emits 1 to γ + 1 tokens with the
            output distribution unchanged.
            <Cite s={S.leviathan} /> Drafters are small models, heads trained on the target such
            as EAGLE (Extrapolation Algorithm for Greater Language-model Efficiency) and Medusa
            <Cite s={S.eagle3} />
            <Cite s={S.medusa} />, or MTP (multi-token prediction) modules shipped in the
            checkpoint, as in DeepSeek-V3.
            <Cite s={S.deepseekV3Report} />
          </Box>
          <Box variant="p">
            With a per-token acceptance rate α, a pass emits on average E = (1 - α
            <sup>γ+1</sup>) / (1 - α) tokens, and the wall-clock speedup is E / (1 + γc), where c
            is the drafter&apos;s step time over the target&apos;s.
            <Cite s={S.leviathan} /> At α = 0.8, γ = 4 and c = 0.05, E is 3.4 tokens and the
            speedup 2.8x; at α = 0.5, 1.9 tokens and 1.6x.
            <Cite s={S.leviathan} kind="derived" note={specNote} />
          </Box>
          <Box variant="p">
            <strong>Why verification is nearly free in decode.</strong> The target reads its
            weights and KV cache once per pass, so memory traffic per token falls by E, provided
            spare compute covers the extra evaluations.
            <Cite s={S.leviathan} /> Small-batch decode has that compute; a large batch uses it
            up. EAGLE-3 measured up to 6.5x speedup, but 1.38x throughput in SGLang at batch 64.
            <Cite s={S.eagle3} kind="measured" />
          </Box>
          <Box variant="p">
            <strong>Acceptance decides the gain.</strong> Draft models a couple of orders of
            magnitude smaller than the target reached α of 0.5 to 0.9 in Leviathan et al.&apos;s
            tests.
            <Cite s={S.leviathan} kind="measured" /> DeepSeek-V3&apos;s MTP module had its second
            token accepted 85 to 90% of the time, for 1.8 times the tokens per second.
            <Cite s={S.deepseekV3Report} kind="measured" /> In vLLM, one plus{' '}
            <code>vllm:spec_decode_num_accepted_tokens_total</code> over{' '}
            <code>vllm:spec_decode_num_drafts_total</code> is the mean acceptance length, the E
            above, on your own traffic.
            <Cite s={S.vllmSpecMetrics} />
          </Box>
          <ExpandableSection headerText="Methods by serving stack, and reported speedups">
            <Box variant="p">
              vLLM and SGLang ship EAGLE-3, MTP (NEXTN in SGLang) and DFlash drafting
              <Cite s={S.vllmSpecConfig} />
              <Cite s={S.sglangSpec} />, TensorRT-LLM supports speculative decoding
              <Cite s={S.trtllmSpecDoc} />, and NxD Inference supports a draft model, Medusa,
              EAGLE v1 and fused speculation.
              <Cite s={S.neuronFeatureGuide} /> Authors measured, on their own models: 2x to 3x
              for the original method on T5-XXL
              <Cite s={S.leviathan} kind="measured" />, 2.3x to 3.6x for Medusa-2, which verifies
              a tree of candidates per pass
              <Cite s={S.medusa} kind="measured" />, up to 6.5x for EAGLE-3
              <Cite s={S.eagle3} kind="measured" /> and over 6x for DFlash, a block-diffusion
              drafter.
              <Cite s={S.dflash} kind="measured" />
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where to start on AWS, and the two numbers to measure before sizing either technique"
          >
            Combining them
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The two compose. Dynamo&apos;s GLM-5 recipe runs SGLang across five
            p6e-gb200.36xlarge: decode on 16 GPUs with EAGLE drafting, prefill on 4, and the KV
            cache on NIXL&apos;s libfabric backend over EFA.
            <Cite s={S.dynamoGlm5EfaRecipe} /> Start from a pinned recipe like it, or from
            AWS&apos;s llm-d container.
            <Cite s={S.awsLlmdBlog} />
          </Box>
          <Box variant="p">
            Then measure two numbers. KV bytes per token, 327,680 for a dense 70B against 890 for
            DeepSeek-V4.1-Flash
            <Cite s={S.llama3Herd} kind="derived" note={kvNote} />
            <Cite s={S.deepseekV41Flash} />, decides whether the handoff can cross EFA or stays
            on NVLink: <em>KV Cache and FlashAttention</em> covers what sets it,{' '}
            <em>Flash as a Cache Tier for Inference</em> weighs fetching against recomputing, and
            the <em>KV-Cache Offloading &amp; LMCache</em> section of the{' '}
            <Link href="../vllm/">vLLM Inference Engine</Link> dive covers moving it. Mean
            acceptance length on your own traffic decides whether a drafter pays.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
