import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangTreeUrl } from '../../components/Cite';

const SRT = 'python/sglang/srt';
const ARGS = `${SRT}/arg_groups`;
const PIPE = `${ARGS}/pipeline.py`;
const OVR = `${ARGS}/overrides.py`;
const MOB = `${ARGS}/model_override_base.py`;
const ATTN_HOOK = `${ARGS}/attention_hook.py`;
const MODEL_OVR = `${ARGS}/model_overrides`;
const MR = `${SRT}/model_executor/model_runner.py`;
const SETUP = `${SRT}/model_executor/model_runner_components/attention_backend_setup.py`;
const ATTN = `${SRT}/layers/attention`;
const REG = `${ATTN}/attention_registry.py`;
const BASE = `${ATTN}/base_attn_backend.py`;
const FA = `${ATTN}/flashattention_backend.py`;
const RADIX_ATTN = `${SRT}/layers/radix_attention.py`;
const FWD_INFO = `${SRT}/model_executor/forward_batch_info.py`;
const FWD_CTX = `${SRT}/model_executor/forward_context.py`;
const RUNNER = `${SRT}/model_executor/runner`;
const SCHED = `${SRT}/managers/scheduler.py`;
const TP = `${SRT}/managers/tp_worker.py`;
const ENGINE = `${SRT}/entrypoints/engine.py`;

export function CodebaseExecution() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h2"
            description="Know before launch which attention kernels and which KV page size your model will run with, and the file that decides each one"
          >
            What decides the backend and the page size
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Two values are fixed at startup, and every forward pass inherits them: the attention
            backend, which supplies the kernels, and the page size, the number of tokens in one KV
            (key-value) page. Both come out of one ordered pass over the server arguments that runs
            before any GPU memory is allocated. A model family rule speaks first, a generic table
            keyed on the GPU fills whatever is still unset, each backend then snaps the page size to
            a value its kernels accept, and a page size that is still unset becomes 1.
          </Box>
          <Box variant="p">
            After resolution the scheduler allocates the pools at that page size, builds the backend
            on top of them and captures CUDA graphs around it. Each step then hands the backend a
            batch whose rows point into the request-to-token table that the radix cache fills (the
            Radix Cache &amp; Memory Pools tab), and the backend reads that row as its page table.
            Section 8 (Attention Backends and Kernels) explains the choices and their trade-offs,
            and section 6 (KV Memory and the Defaults Your GPU Picks) covers what the page size
            costs in prefix reuse. Paths below are relative to{' '}
            <Cite tier={1} href={sglangTreeUrl(SRT)}>
              python/sglang/srt/
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict the backend and page size for your model and GPU by reading four files in the order the resolver runs them"
          >
            Stops 1 to 4: resolving the backend and the page size
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol>
            <li>
              <strong>
                <code>arg_groups/pipeline.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(PIPE, 'L195-L246')} kind="code">
                pipeline.py L195-L246
              </Cite>
              . Owns the order. The platform hooks run first (L195-L204), then the memory settings
              (L208), then the model-specific overrides (L215), then the attention compatibility
              handler (L232), and the page-size default comes last (L246). Speculative decoding
              resolves later still{' '}
              <Cite tier={1} href={sglangUrl(PIPE, 'L292-L294')}>
                pipeline.py L292-L294
              </Cite>
              . Most surprises in this tab follow from that order.
            </li>
            <li>
              <strong>
                <code>arg_groups/model_overrides/</code>
              </strong>{' '}
              <Cite tier={1} href={sglangTreeUrl(MODEL_OVR)}>
                model_overrides/
              </Cite>
              . Owns the family rules, one module per model family. In{' '}
              <code>deepseek_v2.py</code> a single function is registered for twelve architectures{' '}
              <Cite tier={1} href={sglangUrl(`${MODEL_OVR}/deepseek_v2.py`, 'L37-L50')}>
                deepseek_v2.py L37-L50
              </Cite>
              , and on SM100 (NVIDIA compute capability 10.0, datacenter Blackwell) with all three
              attention flags unset it gives DeepSeek V3{' '}
              <code>trtllm_mla</code> and logs{' '}
              <code>Use trtllm_mla as attention backend on sm100 for DeepseekV3ForCausalLM</code>{' '}
              <Cite tier={1} href={sglangUrl(`${MODEL_OVR}/deepseek_v2.py`, 'L179-L189')}>
                deepseek_v2.py L179-L189
              </Cite>
              . Family rules run at L215 and the generic table at L232, so a rule that sets a
              backend wins over the table; passing any of the three attention flags switches this
              DeepSeek rule off.
            </li>
            <li>
              <strong>
                <code>arg_groups/overrides.py</code> and <code>arg_groups/model_override_base.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(OVR, 'L1067-L1081')}>
                overrides.py L1067-L1081
              </Cite>
              . Owns the default. The three flags are <code>--attention-backend</code>,{' '}
              <code>--prefill-attention-backend</code> and <code>--decode-attention-backend</code>,
              and the split flags take priority over the base one{' '}
              <Cite tier={1} href={sglangUrl(`${ARGS}/fields/exec_.py`, 'L165-L192')}>
                fields/exec_.py L165-L192
              </Cite>
              ; each accepts 25 names, two of them deprecated aliases (<code>nsa</code> for{' '}
              <code>dsa</code>, <code>compressed</code> for <code>dsv4</code>){' '}
              <Cite tier={1} href={sglangUrl(`${ARGS}/choices.py`, 'L69-L99')}>
                choices.py L69-L99
              </Cite>
              . Equal prefill and decode flags collapse into <code>attention_backend</code>. A base
              backend still unset goes to <code>get_default_attn_backend</code>, and the choice is
              logged as <code>Attention backend not specified. Use X backend by default.</code>
            </li>
          </ol>
          <Box variant="p">
            The generic table reads the attention architecture first{' '}
            <Cite tier={1} href={sglangUrl(MOB, 'L268-L341')}>
              model_override_base.py L268-L341
            </Cite>
            . For MHA (multi-head attention) models, Hopper (SM90, compute capability 9.0, H100) with
            CUDA 12.3 or later
            gets <code>fa3</code> (FlashAttention 3). SM100-class GPUs, which the function&apos;s
            docstring names as B200, GB200 and B300, get <code>trtllm_mha</code>, the TensorRT-LLM
            MHA kernel from FlashInfer{' '}
            <Cite tier={1} href={sglangUrl(`${ATTN}/trtllm_mha_backend.py`, 'L166-L167')}>
              trtllm_mha_backend.py L166-L167
            </Cite>
            , or <code>fa4</code> (FlashAttention 4) when the model&apos;s K and V rows differ in
            width. AMD GPUs get <code>aiter</code>, Apple GPUs get <code>torch_native</code>, and
            the remaining platforms get <code>flashinfer</code>, or <code>triton</code> when
            FlashInfer is missing or the model uses attention sinks. For MLA (multi-head latent
            attention) models the table gives <code>fa3</code> on Hopper, <code>flashinfer</code>{' '}
            on SM100, <code>aiter</code> on AMD for 16 or 128 KV heads, <code>torch_native</code>{' '}
            on Apple GPUs and <code>triton</code> in the other cases. Two checks come before both branches: an out-of-tree platform plugin
            supplies its own default, and Whisper always gets <code>flashinfer</code>.
          </Box>
          <Box variant="p">
            Speculative decoding changes the MHA rows. With <code>--speculative-eagle-topk</code>{' '}
            above 1, or topk 1 with an explicit page size above 1, Hopper and SM100 fall through to{' '}
            <code>flashinfer</code>{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/utils/common.py`, 'L4014-L4020')}>
              utils/common.py L4014-L4020
            </Cite>
            . On SM100 the row also requires that speculation is off or topk is set{' '}
            <Cite tier={1} href={sglangUrl(MOB, 'L303-L310')} kind="code">
              model_override_base.py L303-L310
            </Cite>
            , and the automatic draft shape that would set topk is filled in only at the
            speculative step, after the table has run{' '}
            <Cite tier={1} href={sglangUrl(`${ARGS}/speculative_hook.py`, 'L1068-L1083')} kind="code">
              speculative_hook.py L1068-L1083
            </Cite>
            . So speculation with topk left unset gives a B200 MHA model <code>flashinfer</code>;
            pass <code>--speculative-num-steps</code> and <code>--speculative-eagle-topk 1</code>,
            and leave <code>--page-size</code> unset, to keep <code>trtllm_mha</code>.
          </Box>
          <ol start={4}>
            <li>
              <strong>
                <code>arg_groups/overrides.py</code>, the page-size passes
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(OVR, 'L1084-L1150')}>
                overrides.py L1084-L1150
              </Cite>
              . Owns the page size. <code>--page-size</code> defaults to unset{' '}
              <Cite tier={1} href={sglangUrl(`${ARGS}/fields/schedule.py`, 'L139-L141')}>
                fields/schedule.py L139-L141
              </Cite>
              , and each backend in this pass replaces any value outside its accepted set with 64,
              logging a warning as it does:
              <ul>
                <li>
                  <code>flashmla</code>: 64 only.
                </li>
                <li>
                  <code>trtllm_mla</code>, <code>tokenspeed_mla</code> and <code>cutedsl_mla</code>:
                  32 or 64.
                </li>
                <li>
                  <code>trtllm_mha</code>: 16, 32, 64 or 128; a comment in the pass says 128 needs GQA
                  (grouped-query attention) and equal query-key and value head sizes.
                </li>
                <li>
                  <code>hpc_ops</code>: 64 only.
                </li>
              </ul>
              FA4 on SM100 for a non-MLA model with topk at most 1 is forced to 128{' '}
              <Cite tier={1} href={sglangUrl(OVR, 'L1236-L1260')}>
                overrides.py L1236-L1260
              </Cite>
              . A page size still unset after all of this becomes 1 on NVIDIA GPUs; Moore Threads GPUs
              and one AMD KV-layout setting get 64 instead{' '}
              <Cite tier={1} href={sglangUrl(OVR, 'L1303-L1326')}>
                overrides.py L1303-L1326
              </Cite>
              .
            </li>
          </ol>
          <Box variant="p">
            The order inside the attention handler decides what the warning says. It runs the
            backend default (L119), then the paged-backend constraints (L183), then the FA4 rule
            (L240){' '}
            <Cite tier={1} href={sglangUrl(ATTN_HOOK, 'L109-L277')} kind="code">
              attention_hook.py L109-L277
            </Cite>
            , and the default of 1 is applied only afterwards, at pipeline.py L246. When you leave{' '}
            <code>--page-size</code> unset, the constraint pass therefore sees no value, and on
            B200 the <code>trtllm_mha</code> warning reports a change from <code>None</code> to 64.
            A value inside the accepted set, such as <code>--page-size 16</code>, passes through
            with no warning.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Match a startup assertion or a hybrid-backend warning to the one step that raised it: pools, backend or graphs"
          >
            Stops 5 to 8: building the pools, the backend and the graphs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol start={5}>
            <li>
              <strong>
                <code>managers/scheduler.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(SCHED, 'L1098-L1111')}>
                scheduler.py L1098-L1111
              </Cite>
              . Owns the startup order: load the weights, allocate the KV pools, build the attention
              backends, capture the CUDA graphs, each for the target worker and then the draft worker{' '}
              <Cite tier={1} href={sglangUrl(SCHED, 'L1068-L1096')}>
                scheduler.py L1068-L1096
              </Cite>
              . The worker builds its <code>ModelRunner</code>{' '}
              <Cite tier={1} href={sglangUrl(TP, 'L477-L484')}>
                tp_worker.py L477-L484
              </Cite>
              , whose <code>initialize</code> loads the model{' '}
              <Cite tier={1} href={sglangUrl(MR, 'L695-L725')}>
                model_runner.py L695-L725
              </Cite>
              .
            </li>
            <li>
              <strong>
                <code>model_executor/model_runner.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(MR, 'L954-L975')}>
                model_runner.py L954-L975
              </Cite>
              . Owns the runner&apos;s pools and backend. <code>alloc_memory_pool</code> stores the
              request-to-token pool, the token-to-KV pool and the allocator the configurator
              returns, the same three objects the radix cache works on. Then{' '}
              <code>init_attention_backends</code> resolves the prefill and decode pair, stamps it on
              the runner and builds the backend{' '}
              <Cite tier={1} href={sglangUrl(MR, 'L1083-L1106')}>
                model_runner.py L1083-L1106
              </Cite>
              .
            </li>
            <li>
              <strong>
                <code>model_executor/model_runner_components/attention_backend_setup.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(SETUP, 'L69-L163')}>
                attention_backend_setup.py L69-L163
              </Cite>
              . Owns the build. A pure state-space model gets the Mamba2 backend in place of an
              attention backend; prefill/decode multiplexing builds a group of backends, two-batch
              overlap wraps one, and every other case builds a single backend. Different prefill and
              decode names produce a <code>HybridAttnBackend</code> and an experimental-feature
              warning{' '}
              <Cite tier={1} href={sglangUrl(SETUP, 'L201-L255')}>
                attention_backend_setup.py L201-L255
              </Cite>
              . The name is looked up in <code>ATTENTION_BACKENDS</code>, and an unknown one raises{' '}
              <code>Invalid attention backend</code>{' '}
              <Cite tier={1} href={sglangUrl(SETUP, 'L271-L277')}>
                attention_backend_setup.py L271-L277
              </Cite>
              .
            </li>
          </ol>
          <Box variant="p">
            <code>layers/attention/attention_registry.py</code> fills that dictionary with one
            decorated factory per name{' '}
            <Cite tier={1} href={sglangUrl(REG, 'L41-L50')}>
              attention_registry.py L41-L50
            </Cite>
            , and the factories hold the hardware checks: <code>fa3</code> asserts compute
            capability 8.x (Ampere and Ada) for non-MLA models, or SM90{' '}
            <Cite tier={1} href={sglangUrl(REG, 'L243-L266')}>
              attention_registry.py L243-L266
            </Cite>
            , and <code>trtllm_mha</code> refuses MLA models{' '}
            <Cite tier={1} href={sglangUrl(REG, 'L282-L288')}>
              attention_registry.py L282-L288
            </Cite>
            . <code>attn_backend_wrapper</code> then wraps the full-attention backend for hybrid
            models such as the linear-attention and sparse families{' '}
            <Cite tier={1} href={sglangUrl(REG, 'L360-L400')}>
              attention_registry.py L360-L400
            </Cite>
            . The hybrid backend routes decode and idle batches to the decode backend, a speculative
            verify batch by <code>--speculative-attention-mode</code>, and everything else to the
            prefill backend{' '}
            <Cite tier={1} href={sglangUrl(`${ATTN}/hybrid_attn_backend.py`, 'L64-L88')}>
              hybrid_attn_backend.py L64-L88
            </Cite>
            .
          </Box>
          <ol start={8}>
            <li>
              <strong>
                <code>model_executor/model_runner.py</code>, graph capture
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(MR, 'L1156-L1190')}>
                model_runner.py L1156-L1190
              </Cite>
              . Owns the three runners: eager, prefill graph and decode graph. Decode graphs default
              to full capture, and prefill on CUDA defaults to the breakable backend{' '}
              <Cite tier={1} href={sglangUrl(`${SRT}/model_executor/cuda_graph_config.py`, 'L119-L154')}>
                cuda_graph_config.py L119-L154
              </Cite>
              . The decode runner is <code>DecodeCudaGraphRunner</code> unless a speculative mode
              installs its own{' '}
              <Cite tier={1} href={sglangUrl(MR, 'L1559-L1575')}>
                model_runner.py L1559-L1575
              </Cite>
              , and its <code>can_run_graph</code> sends a batch larger than the largest captured
              size, or one whose per-request width differs from the capture, to the eager path{' '}
              <Cite tier={1} href={sglangUrl(`${RUNNER}/decode_cuda_graph_runner.py`, 'L715-L761')}>
                decode_cuda_graph_runner.py L715-L761
              </Cite>
              .
            </li>
          </ol>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Trace one decode step from the batch to the kernel call, and see that the page table the kernel reads is the row a cache hit filled"
          >
            Stops 9 to 12: one forward step reaches the kernel
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol start={9}>
            <li>
              <strong>
                <code>managers/tp_worker.py</code> and <code>model_executor/forward_batch_info.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(TP, 'L603-L650')}>
                tp_worker.py L603-L650
              </Cite>
              . Owns the hand-off. <code>forward_batch_generation</code> turns the scheduler&apos;s
              batch into a <code>ForwardBatch</code> and calls <code>model_runner.forward</code>. The
              batch carries a mode (extend, decode, mixed, idle, target verify and others){' '}
              <Cite tier={1} href={sglangUrl(FWD_INFO, 'L196-L220')}>
                forward_batch_info.py L196-L220
              </Cite>{' '}
              and two index tensors that tie it to the cache: <code>req_pool_indices</code>, the
              request rows in the request-to-token pool, and <code>out_cache_loc</code>, the KV slots
              this step writes{' '}
              <Cite tier={1} href={sglangUrl(FWD_INFO, 'L491-L508')}>
                forward_batch_info.py L491-L508
              </Cite>
              .
            </li>
            <li>
              <strong>
                <code>model_executor/model_runner.py</code>, <code>_forward_raw</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(MR, 'L1932-L2031')}>
                model_runner.py L1932-L2031
              </Cite>
              . Owns the dispatch. It publishes a forward context that holds the backend, replays
              the decode graph when <code>can_run_graph</code> allows it, replays a prefill graph
              for an eligible extend batch, and otherwise runs the eager runner. The eager runner
              calls <code>init_forward_metadata</code> once for the whole batch and then runs the
              model{' '}
              <Cite tier={1} href={sglangUrl(`${RUNNER}/eager_runner.py`, 'L240-L267')}>
                eager_runner.py L240-L267
              </Cite>
              .
            </li>
            <li>
              <strong>
                <code>layers/radix_attention.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(RADIX_ATTN, 'L98-L101')}>
                radix_attention.py L98-L101
              </Cite>
              . Owns the call from the model. <code>RadixAttention</code> is the attention layer
              every model instantiates; the radix tree itself lives in <code>mem_cache/</code>.
              Inside a piecewise prefill graph its <code>forward</code> goes through{' '}
              <code>unified_attention_with_output</code>, a custom op registered as a graph split
              point{' '}
              <Cite tier={1} href={sglangUrl(RADIX_ATTN, 'L585-L587')} kind="code">
                radix_attention.py L585-L587
              </Cite>
              ; on the other paths it calls <code>get_attn_backend().forward</code> itself{' '}
              <Cite tier={1} href={sglangUrl(RADIX_ATTN, 'L159-L302')}>
                radix_attention.py L159-L302
              </Cite>
              , and the custom op ends in the same call{' '}
              <Cite tier={1} href={sglangUrl(RADIX_ATTN, 'L548-L556')}>
                radix_attention.py L548-L556
              </Cite>
              . The layer finds the backend through the forward context{' '}
              <Cite tier={1} href={sglangUrl(FWD_CTX, 'L66-L67')}>
                forward_context.py L66-L67
              </Cite>
              , which is how one model file serves every backend.
            </li>
            <li>
              <strong>
                <code>layers/attention/base_attn_backend.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(BASE, 'L36-L57')}>
                base_attn_backend.py L36-L57
              </Cite>
              . Owns the contract every backend implements: per-batch metadata built once and
              shared by all layers, split into a part outside the CUDA graph and a part recorded
              inside it, and a <code>forward</code> that returns an empty output for an idle batch,
              sends a decode batch to <code>forward_decode</code>, a mixed batch on NPU builds to{' '}
              <code>forward_mixed</code> and the rest to <code>forward_extend</code>{' '}
              <Cite tier={1} href={sglangUrl(BASE, 'L265-L307')}>
                base_attn_backend.py L265-L307
              </Cite>
              . Open your own backend&apos;s file next.
            </li>
          </ol>
          <Box variant="p">
            In <code>flashattention_backend.py</code> (the <code>fa3</code> and <code>fa4</code>{' '}
            backend) a normal decode step takes each request&apos;s row of the request-to-token table
            as its page table{' '}
            <Cite tier={1} href={sglangUrl(FA, 'L945-L957')}>
              flashattention_backend.py L945-L957
            </Cite>
            . With a page size above 1 it keeps one entry per page and divides the slot index by the
            page size to get a page id{' '}
            <Cite tier={1} href={sglangUrl(FA, 'L1269-L1282')}>
              flashattention_backend.py L1269-L1282
            </Cite>
            . That is the link to the radix cache: a hit writes cached slot indices into the front
            of the same row, so the kernel reads a shared prefix with no extra work, and the page
            size sets how coarse that sharing can be.
          </Box>
          <ExpandableSection headerText="Where the metadata contract is called">
            <Box variant="p">
              The default <code>init_forward_metadata</code> runs the outside-graph half and then
              the inside-graph half{' '}
              <Cite tier={1} href={sglangUrl(BASE, 'L88-L94')}>
                base_attn_backend.py L88-L94
              </Cite>
              . The eager runner dispatches by mode and runs a mixed batch as extend, except on NPU
              (neural processing unit) builds, which keep a mixed kernel, and under context
              parallelism{' '}
              <Cite tier={1} href={sglangUrl(`${RUNNER}/eager_runner.py`, 'L209-L225')}>
                eager_runner.py L209-L225
              </Cite>
              . The forward context is a frozen dataclass whose only required field is the backend{' '}
              <Cite tier={1} href={sglangUrl(FWD_CTX, 'L34-L40')}>
                forward_context.py L34-L40
              </Cite>
              , and <code>_forward_raw</code> publishes a fresh one for each forward unless a caller
              already did{' '}
              <Cite tier={1} href={sglangUrl(MR, 'L1939-L1942')}>
                model_runner.py L1939-L1942
              </Cite>
              .
            </Box>
          </ExpandableSection>
          <Box variant="p">
            <strong>Against vLLM:</strong> vLLM picks its backend by walking a per-GPU priority list
            and asking each candidate to validate the configuration, where SGLang applies the fixed
            pass order of stops 1 to 4, model family first; both then hand the kernel a per-request
            table of KV block or page ids (
            <Link href="../vllm/">vLLM dive, section 14: Inside the Codebase</Link>;{' '}
            <Link href="../vllm/">vLLM dive, section 5: Paged KV Cache &amp; Block Tables</Link>).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Confirm from the first lines of the startup log which backend and page size you got, and whether a backend replaced a page size you passed"
          >
            The check: the backend line and the page-size warning
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            For a dense MHA model with no family rule, on B200 at default flags, the resolver logs
            these two lines, in this order:
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
            {`Attention backend not specified. Use trtllm_mha backend by default.
TensorRT-LLM MHA only supports page_size of 16, 32, 64 or 128, changing page_size from None to 64.`}
          </pre>
          <Box variant="small" color="text-body-secondary">
            Formats from{' '}
            <Cite tier={1} href={sglangUrl(OVR, 'L1077-L1079')}>
              overrides.py L1077-L1079
            </Cite>{' '}
            and{' '}
            <Cite tier={1} href={sglangUrl(OVR, 'L1133-L1136')}>
              overrides.py L1133-L1136
            </Cite>
            ; the backend name and <code>None</code> filled in by our reading of the pass order, not
            copied from a running server.
          </Box>
          <Box variant="p">
            <code>from None</code> means you did not pass <code>--page-size</code>; a number there
            is a value you passed that the backend replaced. On H100 the first line names{' '}
            <code>fa3</code> and no page-size warning follows, because the page size stays unset
            until the default makes it 1. On B200 a model whose K and V widths differ names{' '}
            <code>fa4</code> and gets the FA4 warning ending <code>to 128.</code> instead. A family
            rule replaces the first line with its own, such as the DeepSeek line in stop 2, and
            different prefill and decode backends add{' '}
            <code>Using hybrid attention backend for decode and prefill:</code>{' '}
            <Cite tier={1} href={sglangUrl(SETUP, 'L240-L248')}>
              attention_backend_setup.py L240-L248
            </Cite>
            .
          </Box>
          <Box variant="p">
            The <code>server_args=</code> line confirms the result: it prints the resolved arguments
            as a dictionary, so it carries the final <code>attention_backend</code> and{' '}
            <code>page_size</code>{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L170-L171')} kind="code">
              engine.py L170-L171
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L1179')} kind="code">
              engine.py L1179
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Run it:</strong> start the server, search the log for{' '}
            <code>Attention backend</code>, <code>only supports</code> and{' '}
            <code>server_args=</code>, and write down the backend and page size you got. If the page
            size is coarser than your shared prompts need, read section 6 and then pass a{' '}
            <code>--page-size</code> from the accepted set in stop 4, such as 16 on{' '}
            <code>trtllm_mha</code>.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
