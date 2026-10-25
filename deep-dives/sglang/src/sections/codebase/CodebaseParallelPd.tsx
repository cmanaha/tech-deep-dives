import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangTreeUrl } from '../../components/Cite';

const SRT = 'python/sglang/srt';
const ARGS = `${SRT}/arg_groups`;
const PAR_FIELDS = `${ARGS}/fields/parallel.py`;
const DISAGG_FIELDS = `${ARGS}/fields/disagg.py`;
const PAR_HOOK = `${ARGS}/parallel_hook.py`;
const OVR = `${ARGS}/overrides.py`;
const RTC = `${SRT}/runtime_context.py`;
const SCHED = `${SRT}/managers/scheduler.py`;
const DP_CTRL = `${SRT}/managers/data_parallel_controller.py`;
const ENGINE = `${SRT}/entrypoints/engine.py`;
const DPA = `${SRT}/layers/dp_attention.py`;
const DP_ATTN = `${SRT}/managers/scheduler_components/dp_attn.py`;
const MOE_LAYER = `${SRT}/layers/moe/fused_moe_triton/layer.py`;
const DEEPEP = `${SRT}/layers/moe/token_dispatcher/deepep.py`;
const MOE_UTILS = `${SRT}/layers/moe/utils.py`;
const EPLB_MGR = `${SRT}/eplb/eplb_manager.py`;
const MR = `${SRT}/model_executor/model_runner.py`;
const DISAGG = `${SRT}/disaggregation`;
const DISAGG_SVC = `${SRT}/managers/disagg_service.py`;
const COMMON_CONN = `${DISAGG}/common/conn.py`;
const BASE_CONN = `${DISAGG}/base/conn.py`;
const PREFILL = `${DISAGG}/prefill.py`;
const DECODE = `${DISAGG}/decode.py`;
const DECODE_BATCH = `${DISAGG}/decode_schedule_batch_mixin.py`;
const MOONCAKE_CONN = `${DISAGG}/mooncake/conn.py`;
const MOONCAKE_TE = `${SRT}/distributed/device_communicators/mooncake_transfer_engine.py`;
const NIXL_CONN = `${DISAGG}/nixl/conn.py`;
const GW_HTTP = 'sgl-model-gateway/src/routers/http';

const TITLES = `sglang::scheduler_DP0_TP0_EP0
sglang::scheduler_DP0_TP1_EP1
sglang::scheduler_DP1_TP2_EP2
sglang::scheduler_DP1_TP3_EP3
sglang::scheduler_DP2_TP4_EP4
sglang::scheduler_DP2_TP5_EP5
sglang::scheduler_DP3_TP6_EP6
sglang::scheduler_DP3_TP7_EP7`;

const REGISTRY_QUERY = `curl -s "http://127.0.0.1:8998/route?prefill_dp_rank=-1&prefill_cp_rank=-1&target_tp_rank=-1&target_pp_rank=-1"`;

export function CodebaseParallelPd() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h2"
            description="Know which file turns your parallel flags into ranks, and which files carry one request from the gateway's room id to KV written into decode's pages"
          >
            What this path explains
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One SGLang server spans <code>tp_size x pp_size</code> GPUs, and every parallel width
            except <code>--dp-size</code> carves that TP (tensor parallelism) group instead of
            adding GPUs. The carving is integer arithmetic on each scheduler&apos;s global rank, run
            once per process before any communication group exists, and its result names the
            process in <code>ps</code> and in the log. So{' '}
            <strong>
              <code>--tp 8 --attn-dp-size 8 --ep 8</code> is 8 GPUs and eight schedulers
            </strong>
            : eight attention DP (data parallelism) groups and eight EP (expert parallelism) shards
            over the same eight devices{' '}
            <Cite tier={1} href={sglangUrl(RTC, 'L137-L157')}>
              runtime_context.py L137-L157
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(RTC, 'L173-L178')}>
              runtime_context.py L173-L178
            </Cite>
            .
          </Box>
          <Box variant="p">
            PD (prefill/decode) disaggregation is a rendezvous between two servers on one random
            room id. The gateway stamps the id on both legs of a request; decode looks up the
            prefill rank that holds its slice of the KV (key-value) cache in the prefill
            server&apos;s bootstrap registry, reserves pages and publishes their addresses; prefill
            writes the KV into them. The registry is indexed by the same rank layout the first half
            of this path computes, so one check covers both. Section 14 (Parallelism: TP, DP
            Attention &amp; EP), section 15 (PD Disaggregation) and section 16 (Wide Expert Parallelism) explain the behaviour;
            this tab gives the files, in the order a launch and then a request meet them. Paths are
            relative to{' '}
            <Cite tier={1} href={sglangTreeUrl(SRT)}>
              python/sglang/srt/
            </Cite>{' '}
            unless they start with <code>sgl-model-gateway/</code>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Trace a launch line to the rank, GPU and label each scheduler gets, so you can predict the process list before you start it"
          >
            Stops 1 to 4: from flags to ranks
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol>
            <li>
              <strong>
                <code>arg_groups/fields/parallel.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(PAR_FIELDS, 'L17-L90')}>
                parallel.py L17-L90
              </Cite>
              . Owns the widths. The <code>Parallel</code> struct declares{' '}
              <code>--tp-size</code>, <code>--pp-size</code>, <code>--dp-size</code> and{' '}
              <code>--attn-dp-size</code>, each defaulting to 1, and <code>--ep-size</code>, with
              the declared alias <code>--ep</code>, also 1{' '}
              <Cite tier={1} href={sglangUrl(PAR_FIELDS, 'L269-L276')}>
                parallel.py L269-L276
              </Cite>
              . The widths you never set, <code>attn_tp_size</code>, <code>num_dp_ranks</code> and{' '}
              <code>moe_tp_size</code>, are declared as derived fields computed at publication and
              not stored with the server arguments{' '}
              <Cite tier={1} href={sglangUrl(PAR_FIELDS, 'L304-L340')}>
                parallel.py L304-L340
              </Cite>
              .
            </li>
            <li>
              <strong>
                <code>arg_groups/parallel_hook.py</code> and <code>arg_groups/overrides.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(PAR_HOOK, 'L39-L61')}>
                parallel_hook.py L39-L61
              </Cite>
              . Owns the startup rules. <code>handle_deprecated_dp_attention</code> rewrites{' '}
              <code>--dp-size N --enable-dp-attention</code> into <code>--attn-dp-size N</code>{' '}
              with <code>dp_size</code> 1. <code>handle_data_parallelism</code> rejects{' '}
              <code>--dp-size</code> and <code>--attn-dp-size</code> both above 1, and under
              attention DP multiplies <code>schedule_conservativeness</code> by 0.3 and divides{' '}
              <code>chunked_prefill_size</code> by <code>attn_dp_size</code>, logging{' '}
              <code>DP attention is enabled. chunked prefill size is adjusted from X to Y.</code>{' '}
              <Cite tier={1} href={sglangUrl(PAR_HOOK, 'L270-L324')}>
                parallel_hook.py L270-L324
              </Cite>
              . Then <code>_a2a_ep_size</code> sets <code>ep_size</code> to <code>tp_size</code>{' '}
              for every all-to-all backend in <code>_A2A_EP_SPANNING_BACKENDS</code>, with an info
              line that ends <code>adjusted from X to the tensor parallel size [N].</code>{' '}
              <Cite tier={1} href={sglangUrl(OVR, 'L1529-L1572')}>
                overrides.py L1529-L1572
              </Cite>
              , which is why <code>--tp 16 --moe-a2a-backend deepep</code> runs EP 16 whatever{' '}
              <code>--ep-size</code> says.
            </li>
            <li>
              <strong>
                <code>runtime_context.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(RTC, 'L73-L92')}>
                runtime_context.py L73-L92
              </Cite>
              . Owns the arithmetic, in five small functions:
              <ul>
                <li>
                  <code>derive_attn_tp_size</code>: what is left of the TP group for attention,{' '}
                  <code>tp_size // attn_dp_size // attn_cp_size</code>, where CP is context
                  parallelism.
                </li>
                <li>
                  <code>derive_attention_ranks</code>: the layout is (dp, cp, tp) with tp fastest,
                  so a process at TP rank t sits in attention DP group{' '}
                  <code>t // (attn_tp_size x attn_cp_size)</code> at attention TP rank{' '}
                  <code>t % attn_tp_size</code>.
                </li>
                <li>
                  <code>derive_spawn_ranks</code>: the global rank is{' '}
                  <code>offset + tp_size x pp_rank + tp_rank</code>, so TP groups are contiguous
                  blocks and PP (pipeline parallelism) groups are strided by <code>tp_size</code>;
                  the MoE (mixture of experts) EP and TP ranks come from the same TP rank{' '}
                  <Cite tier={1} href={sglangUrl(RTC, 'L106-L134')}>
                    runtime_context.py L106-L134
                  </Cite>
                  .
                </li>
                <li>
                  <code>derive_parallel_widths</code>:{' '}
                  <code>moe_tp_size = tp_size // ep_size // moe_dp_size</code>, the width that
                  tensor-splits each expert after EP has spread them{' '}
                  <Cite tier={1} href={sglangUrl(RTC, 'L137-L157')}>
                    runtime_context.py L137-L157
                  </Cite>
                  .
                </li>
                <li>
                  <code>launch_world_size_of</code> and <code>num_dp_ranks_of</code>: the world is{' '}
                  <code>tp_size x pp_size</code> (plus the elastic-EP join offset), and the DP rank
                  count is <code>dp_size x attn_dp_size</code>, one of the two always 1{' '}
                  <Cite tier={1} href={sglangUrl(RTC, 'L173-L207')}>
                    runtime_context.py L173-L207
                  </Cite>
                  .
                </li>
              </ul>
              <code>_validate_parallel</code> then checks every rank against its width and both
              factorizations of the TP group,{' '}
              <code>tp_size == attn_tp_size x attn_dp_size x attn_cp_size</code> and{' '}
              <code>tp_size == moe_ep_size x moe_dp_size x moe_tp_size</code>, and raises{' '}
              <code>parallel topology is inconsistent (set by publish)</code> when one fails{' '}
              <Cite tier={1} href={sglangUrl(RTC, 'L266-L350')}>
                runtime_context.py L266-L350
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(RTC, 'L1565-L1588')}>
                runtime_context.py L1565-L1588
              </Cite>
              .
            </li>
            <li>
              <strong>
                <code>entrypoints/engine.py</code>, <code>managers/data_parallel_controller.py</code>{' '}
                and <code>managers/scheduler.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(ENGINE, 'L904-L963')}>
                engine.py L904-L963
              </Cite>
              . Owns placement. The engine starts one scheduler process for each PP and TP rank
              pair this node owns, on GPU <code>base + PP offset + tp_rank % tp_size_per_node</code>,
              with the node&apos;s ranges computed by <code>_calculate_rank_ranges</code>{' '}
              <Cite tier={1} href={sglangUrl(ENGINE, 'L2014-L2046')}>
                engine.py L2014-L2046
              </Cite>
              ; under replica DP the DP controller runs the same loop once per replica. Under
              attention DP the controller hands each process its DP rank and its own ZMQ (ZeroMQ)
              ports{' '}
              <Cite tier={1} href={sglangUrl(DP_CTRL, 'L660-L732')}>
                data_parallel_controller.py L660-L732
              </Cite>
              . Each process publishes its placement as <code>SpawnRanks</code>, which runs stop 3
              {' '}
              <Cite tier={1} href={sglangUrl(SCHED, 'L6076-L6101')}>
                scheduler.py L6076-L6101
              </Cite>
              , and <code>configure_scheduler_process</code> turns the ranks into the process title
              and log prefix: DP whenever a DP rank is set, then PP, ATTN_CP, MOE_DP, TP and EP,
              each only when its width is above 1{' '}
              <Cite tier={1} href={sglangUrl(SCHED, 'L6023-L6064')}>
                scheduler.py L6023-L6064
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
            description="Find where the attention groups hand tokens to the experts, and why one rank's prefill changes the step for every rank"
          >
            Stops 5 to 7: the exchange at the MoE layer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol start={5}>
            <li>
              <strong>
                <code>layers/dp_attention.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(DPA, 'L135-L193')}>
                dp_attention.py L135-L193
              </Cite>
              . Owns the padding. <code>MAX_LEN</code> pads every DP group to the longest and
              all-gathers; <code>SUM_LEN</code> pads to the total and all-reduces. An extend batch
              spread over several ranks takes <code>SUM_LEN</code>, PPLX always takes{' '}
              <code>MAX_LEN</code>, and otherwise the cheaper mode wins. <code>_dp_gather</code>{' '}
              and <code>dp_scatter</code> then move every group&apos;s tokens into the MoE buffer
              and back{' '}
              <Cite tier={1} href={sglangUrl(DPA, 'L937-L1060')}>
                dp_attention.py L937-L1060
              </Cite>
              .
            </li>
            <li>
              <strong>
                <code>managers/scheduler_components/dp_attn.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(DP_ATTN, 'L256-L263')}>
                dp_attn.py L256-L263
              </Cite>
              . Owns the per-step agreement. The DP ranks all-gather a small info tensor every
              step; the decode CUDA graph flag is the minimum over ranks and the has-extend flag is
              the maximum. One rank running a prefill chunk takes every rank off the decode graph
              for that step.
            </li>
            <li>
              <strong>
                <code>layers/moe/fused_moe_triton/layer.py</code> and{' '}
                <code>layers/moe/token_dispatcher/deepep.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(MOE_LAYER, 'L162-L199')}>
                layer.py L162-L199
              </Cite>
              . Owns the dispatcher. <code>create_moe_dispatcher</code> gives{' '}
              <code>--moe-a2a-backend none</code> the <code>StandardDispatcher</code>, which keeps
              MoE on the TP group&apos;s all-reduce or all-gather, and gives <code>deepep</code>,{' '}
              <code>mooncake</code>, <code>mori</code>, <code>nixl</code> and <code>pplx</code> the
              DeepEP-style dispatcher. That dispatcher picks its kernel on every call{' '}
              <Cite tier={1} href={sglangUrl(DEEPEP, 'L1093-L1101')}>
                deepep.py L1093-L1101
              </Cite>
              , and in <code>auto</code> mode a batch with any extend gets <code>normal</code> and
              any other batch <code>low_latency</code>{' '}
              <Cite tier={1} href={sglangUrl(MOE_UTILS, 'L264-L271')}>
                moe/utils.py L264-L271
              </Cite>
              . The extend flag is stop 6&apos;s maximum, so the whole EP group switches together.
            </li>
          </ol>
          <Box variant="p">
            EPLB (the expert-parallel load balancer), when enabled, advances one step at the end of
            every forward pass{' '}
            <Cite tier={1} href={sglangUrl(MR, 'L1865-L1867')}>
              model_runner.py L1865-L1867
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(EPLB_MGR, 'L72-L94')}>
              eplb_manager.py L72-L94
            </Cite>
            , so its rebalance interval counts forward passes; section 16 covers the knobs.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Follow one request from the gateway's room id to KV written into decode's pages, and find the line where prefill waits for decode"
          >
            Stops 8 to 15: the PD rendezvous
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol start={8}>
            <li>
              <strong>
                <code>managers/scheduler.py</code>, the loop choice
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(SCHED, 'L5984-L6013')}>
                scheduler.py L5984-L6013
              </Cite>
              . Owns the role. <code>--disaggregation-mode prefill</code> or <code>decode</code>{' '}
              selects a different event loop in the same binary, each with its own queues.
            </li>
            <li>
              <strong>
                <code>sgl-model-gateway/src/routers/http/pd_router.rs</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(`${GW_HTTP}/pd_router.rs`, 'L242-L300')}>
                pd_router.rs L242-L300
              </Cite>
              . Owns the room id. <code>inject_bootstrap_into_value</code> writes{' '}
              <code>bootstrap_host</code>, <code>bootstrap_port</code> and{' '}
              <code>bootstrap_room</code> into the request body, the room drawn at random and
              masked to 63 bits{' '}
              <Cite tier={1} href={sglangUrl(`${GW_HTTP}/pd_types.rs`, 'L59-L63')}>
                pd_types.rs L59-L63
              </Cite>
              , and both legs are sent at once{' '}
              <Cite tier={1} href={sglangUrl(`${GW_HTTP}/pd_router.rs`, 'L701-L730')}>
                pd_router.rs L701-L730
              </Cite>
              . How the pair is picked is in the Gateway &amp; Rust Frontend tab.
            </li>
            <li>
              <strong>
                <code>managers/disagg_service.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(DISAGG_SVC, 'L21-L51')}>
                disagg_service.py L21-L51
              </Cite>
              . Owns the registry&apos;s start. Only a prefill server starts one, or every PD
              instance under <code>--enable-pd-role-switch</code>, on the HTTP server&apos;s host
              and <code>--disaggregation-bootstrap-port</code>, default 8998{' '}
              <Cite tier={1} href={sglangUrl(DISAGG_FIELDS, 'L78-L80')}>
                disagg.py L78-L80
              </Cite>
              . Its startup line is{' '}
              <code>CommonKVBootstrapServer started successfully on HOST:PORT</code>{' '}
              <Cite tier={1} href={sglangUrl(COMMON_CONN, 'L2903-L2907')}>
                conn.py L2903-L2907
              </Cite>
              .
            </li>
            <li>
              <strong>
                <code>disaggregation/common/conn.py</code>, the registry
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(COMMON_CONN, 'L2614-L2670')}>
                conn.py L2614-L2670
              </Cite>
              . Owns the address book: an aiohttp app on a daemon thread serving{' '}
              <code>/route</code>, <code>/register_dp_rank</code>, <code>/query_dp_ranks</code> and{' '}
              <code>/health</code>. Every prefill scheduler registers with a <code>PUT /route</code>{' '}
              carrying its attention DP, CP, TP and PP ranks{' '}
              <Cite tier={1} href={sglangUrl(COMMON_CONN, 'L1382-L1421')}>
                conn.py L1382-L1421
              </Cite>
              , and the registry files its IP and port under exactly those four keys, the stop 3
              layout{' '}
              <Cite tier={1} href={sglangUrl(COMMON_CONN, 'L2750-L2766')}>
                conn.py L2750-L2766
              </Cite>
              . It refuses a rank whose allocation policy differs from the ranks before it, and it
              expects <code>dp_size x attn_cp_size x attn_tp_size x pp_size</code> registrations
              before it answers lookups with anything but 503{' '}
              <Cite tier={1} href={sglangUrl(COMMON_CONN, 'L2652-L2664')}>
                conn.py L2652-L2664
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(COMMON_CONN, 'L2710-L2714')}>
                conn.py L2710-L2714
              </Cite>
              . Decode asks it with <code>_get_bootstrap_info_from_server</code>{' '}
              <Cite tier={1} href={sglangUrl(COMMON_CONN, 'L2381-L2399')}>
                conn.py L2381-L2399
              </Cite>
              .
            </li>
            <li>
              <strong>
                <code>disaggregation/base/conn.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(BASE_CONN, 'L118-L123')}>
                base/conn.py L118-L123
              </Cite>
              . Owns the contract every transfer backend implements. A transfer reports one of five
              states: <code>Failed</code>, <code>Bootstrapping</code>,{' '}
              <code>WaitingForInput</code>, <code>Transferring</code>, <code>Success</code>. The
              prefill side&apos;s sender has <code>send</code>, which ships the KV at given
              indices, and the decode side&apos;s receiver has <code>send_metadata</code>, which
              tells prefill where to write{' '}
              <Cite tier={1} href={sglangUrl(BASE_CONN, 'L160-L187')}>
                base/conn.py L160-L187
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(BASE_CONN, 'L267-L279')}>
                base/conn.py L267-L279
              </Cite>
              . Each backend is one directory under{' '}
              <Cite tier={1} href={sglangTreeUrl(DISAGG)}>
                disaggregation/
              </Cite>
              .
            </li>
            <li>
              <strong>
                <code>disaggregation/decode.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(DECODE, 'L1-L19')}>
                decode.py L1-L19
              </Cite>
              . Owns the reservation. The docstring lists the four stages: preallocation queue,
              transfer queue, a prebuilt batch, the running batch. <code>_pre_alloc</code> takes a
              request-to-token row and KV slots for the request{' '}
              <Cite tier={1} href={sglangUrl(DECODE, 'L2166-L2199')}>
                decode.py L2166-L2199
              </Cite>
              , and <code>_send_kv_metadata</code> passes their page indices to the receiver&apos;s{' '}
              <code>send_metadata</code>{' '}
              <Cite tier={1} href={sglangUrl(DECODE, 'L1786-L1817')}>
                decode.py L1786-L1817
              </Cite>
              . That call is the message prefill waits for. The transfer queue then polls each
              receiver until <code>Success</code>, and the prebuilt batch installs the received KV
              and first token without running the model{' '}
              <Cite tier={1} href={sglangUrl(DECODE_BATCH, 'L22-L29')}>
                decode_schedule_batch_mixin.py L22-L29
              </Cite>
              .
            </li>
            <li>
              <strong>
                <code>disaggregation/prefill.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(PREFILL, 'L462-L536')}>
                prefill.py L462-L536
              </Cite>
              . Owns the wait. <code>pop_bootstrapped</code> first all-reduces the poll results
              over the attention CP and TP groups, so every rank of an attention group agrees. A
              request in <code>WaitingForInput</code>, meaning decode&apos;s indices have arrived,
              moves to the waiting queue. A request still in <code>Bootstrapping</code> moves only
              as an optimistic attempt, which <code>--optimistic-prefill-attempts</code> allows and
              which defaults to 0{' '}
              <Cite tier={1} href={sglangUrl(DISAGG_FIELDS, 'L122-L124')}>
                disagg.py L122-L124
              </Cite>
              , or under the opt-in <code>prefill_complete</code> policy. Under the default{' '}
              <code>early</code> policy, then, prefill starts computing a request only after
              decode&apos;s reservation is in. During chunked prefill each finished chunk goes out
              through <code>send_kv_chunk</code>{' '}
              <Cite tier={1} href={sglangUrl(PREFILL, 'L1369-L1401')}>
                prefill.py L1369-L1401
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(PREFILL, 'L1454-L1471')}>
                prefill.py L1454-L1471
              </Cite>
              .
            </li>
            <li>
              <strong>
                <code>disaggregation/mooncake/conn.py</code> and{' '}
                <code>distributed/device_communicators/mooncake_transfer_engine.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(MOONCAKE_CONN, 'L2943-L2962')}>
                mooncake/conn.py L2943-L2962
              </Cite>
              . Owns the push for the default backend. A bootstrap thread on prefill collects each
              decode rank&apos;s destination info for a room and sets the room to{' '}
              <code>WaitingForInput</code> once every required rank has reported.{' '}
              <code>_transfer_data</code> hands source addresses, destination addresses and
              lengths to <code>batch_transfer_sync</code>{' '}
              <Cite tier={1} href={sglangUrl(MOONCAKE_CONN, 'L792-L799')}>
                mooncake/conn.py L792-L799
              </Cite>
              , which calls Mooncake&apos;s <code>batch_transfer_sync_write</code>: prefill writes
              into decode&apos;s memory{' '}
              <Cite tier={1} href={sglangUrl(MOONCAKE_TE, 'L246-L260')}>
                mooncake_transfer_engine.py L246-L260
              </Cite>
              . The NIXL (NVIDIA Inference Xfer Library) backend does the same with a{' '}
              <code>WRITE</code> transfer{' '}
              <Cite tier={1} href={sglangUrl(NIXL_CONN, 'L1911-L1916')}>
                nixl/conn.py L1911-L1916
              </Cite>
              .
            </li>
          </ol>
          <ExpandableSection headerText="What the registry checks, read from code">
            <Box variant="p">
              The registry is built as a bare <code>web.Application()</code> with no middleware{' '}
              <Cite tier={1} href={sglangUrl(COMMON_CONN, 'L2615-L2624')} kind="code">
                conn.py L2615-L2624
              </Cite>
              , so by our reading of the code, not run, it checks no key: any client that reaches
              the bootstrap port can call its routes, including the <code>PUT /route</code> that
              registers a prefill rank. It binds the HTTP server&apos;s host, which is 127.0.0.1
              unless <code>--host</code> changes it. Section 15 (PD Disaggregation) covers that
              bind across nodes, and section 12 (APIs, LoRA &amp; the Admin Plane) covers the server&apos;s keys,
              none of which this registry reads. Keep the bootstrap port on the private network
              that carries the KV.
            </Box>
          </ExpandableSection>
          <Box variant="p">
            <strong>Against vLLM:</strong> the vLLM dive&apos;s walk of the same ground covers its
            parallel-group topology and its KV connector framework, where PD is a connector named
            in <code>--kv-transfer-config</code>; its reference <code>NixlConnector</code> pulls
            and <code>NixlPushConnector</code> pushes, while every SGLang backend in stop 15 writes
            from prefill into pages decode reserved (
            <Link href="../vllm/">vLLM dive, section 14: Inside the Codebase</Link>, Distributed
            &amp; KV Transfer tab;{' '}
            <Link href="../vllm/">vLLM dive, section 10: Disaggregated Prefill / Decode</Link>).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Confirm before and after launch that the schedulers, their labels and the registered prefill ranks add up to your GPU count"
          >
            The check: count the ranks, then ask the registry
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Before launch, run stop 3 by hand. A replica needs <code>tp_size x pp_size</code> GPUs,
            and <code>--dp-size</code> multiplies that; nothing else adds a device. Then, for each
            TP rank t, the attention DP group is <code>t // (attn_tp_size x attn_cp_size)</code>{' '}
            and, with <code>moe_dp_size</code> 1, the EP rank is <code>t // moe_tp_size</code>.
            For <code>--tp 8 --attn-dp-size 4 --ep 8</code> that gives{' '}
            <code>attn_tp_size</code> 2 and <code>moe_tp_size</code> 1: TP ranks 0 and 1 form
            attention group 0, ranks 2 and 3 group 1, and so on, while each rank holds its own
            expert shard. Stop 4 writes that layout into the process titles:
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{TITLES}</pre>
          <Box variant="small" color="text-body-secondary">
            Title format from{' '}
            <Cite tier={1} href={sglangUrl(SCHED, 'L6045-L6060')}>
              scheduler.py L6045-L6060
            </Cite>
            ; the ranks are filled in by our reading of stop 3, not copied from a running server.
          </Box>
          <Box variant="p">
            After launch, run <code>ps -eo pid,args | grep sglang::scheduler</code>. Expect one line
            per GPU, eight here, carrying the labels you computed, and the same labels at the start
            of each scheduler&apos;s log lines. <code>--tp 8 --attn-dp-size 8 --ep 8</code> also
            gives eight lines, <code>DP0_TP0_EP0</code> to <code>DP7_TP7_EP7</code>, because 8
            GPUs is all it uses. If the count or the labels differ from your arithmetic, a hook in
            stop 2 resolved a width differently: the startup <code>server_args=</code> line prints
            the resolved values{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L1179')} kind="code">
              engine.py L1179
            </Cite>
            .
          </Box>
          <Box variant="p">
            On a PD prefill server, ask the registry for its topology with the all-minus-one
            lookup that decode uses:
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{REGISTRY_QUERY}</pre>
          <Box variant="p">
            While ranks are still registering it answers 503 with{' '}
            <code>Prefill server not fully registered yet (N workers registered).</code>; once
            complete it returns JSON with <code>dp_size</code>, <code>attn_cp_size</code>,{' '}
            <code>attn_tp_size</code>, <code>pp_size</code>, <code>page_size</code> and the
            allocation policy{' '}
            <Cite tier={1} href={sglangUrl(COMMON_CONN, 'L2789-L2821')}>
              conn.py L2789-L2821
            </Cite>
            . By our reading of stop 3 and stop 11, the product of the four widths equals the
            prefill server&apos;s GPU count, one registration per scheduler. Read from source, not
            run. If the 503 does not clear, N tells you how many prefill ranks are missing; check
            the logs of the schedulers whose labels you computed, then read section 15&apos;s queue
            gauges once the count is complete.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
