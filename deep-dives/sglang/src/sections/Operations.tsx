import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangTreeUrl, sglangDocsSrcUrl } from '../components/Cite';

/* SGLang source paths at v0.5.22 */
const SRT = 'python/sglang/srt';
const HTTP = `${SRT}/entrypoints/http_server.py`;
const ENGINE = `${SRT}/entrypoints/engine.py`;
const AUTH = `${SRT}/utils/auth.py`;
const COMMON = `${SRT}/utils/common.py`;
const SERVER_ARGS = `${SRT}/server_args.py`;
const SERVING = `${SRT}/arg_groups/fields/serving.py`;
const OBSERVABILITY = `${SRT}/arg_groups/fields/observability.py`;
const EXEC_FIELDS = `${SRT}/arg_groups/fields/exec_.py`;
const SCHEDULER = `${SRT}/managers/scheduler.py`;
const TOKENIZER_MGR = `${SRT}/managers/tokenizer_manager.py`;
const POOL_STATS = `${SRT}/managers/scheduler_components/pool_stats_observer.py`;
const COLLECTOR = `${SRT}/observability/metrics_collector.py`;
const GRAMMAR_MGR = `${SRT}/constrained/grammar_manager.py`;
const SERVING_BASE = `${SRT}/entrypoints/openai/serving_base.py`;
const DG = `${SRT}/layers/deep_gemm_wrapper/compile_utils.py`;
const DECODE = `${SRT}/disaggregation/decode.py`;
const COMMON_CONN = `${SRT}/disaggregation/common/conn.py`;
const ENVIRON = `${SRT}/environ.py`;
const CUSTOM_LP = `${SRT}/sampling/custom_logit_processor.py`;
const WATERMARK = `${SRT}/sampling/watermarking/core.py`;
const DG_CONF = `${SRT}/layers/deep_gemm_wrapper/configurer.py`;
const FP8_UTILS = `${SRT}/layers/quantization/fp8_utils.py`;
const JIT_CACHE = 'python/sglang/kernels/jit/utils/compile/cache.py';
const MM_ARGS = 'python/sglang/multimodal_gen/runtime/server_args/server_args.py';
const MM_UPLOAD = 'python/sglang/multimodal_gen/runtime/entrypoints/openai/utils.py';
const MM_SCHED = 'python/sglang/multimodal_gen/runtime/managers/scheduler.py';
const RUST_APP = 'rust/sglang-server/src/api_server/http/app.rs';
const GW = 'sgl-model-gateway/src';
const K8S_SAMPLE = 'docker/k8s-sglang-service.yaml';
const TUNING = 'advanced_features/hyperparameter_tuning';
const SERVER_ARGS_DOC = 'advanced_features/server_arguments';
const REL_0522 = 'https://github.com/sgl-project/sglang/releases/tag/v0.5.22';
const SECURITY_POLICY = 'https://github.com/sgl-project/sglang/security/policy';
const ADVISORIES = 'https://github.com/advisories?query=ecosystem%3Apip+sglang';
const GHSA = 'https://github.com/advisories';

/* AWS and Kubernetes documentation, and AWS samples pinned to the SHAs register 09 read */
const SM_CONTRACT =
  'https://docs.aws.amazon.com/sagemaker/latest/dg/your-algorithms-inference-code.html';
const SM_VARIANT =
  'https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ProductionVariant.html';
const K8S_PROBES =
  'https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/';
const DLC_ENTRYPOINT =
  'https://github.com/aws/deep-learning-containers/blob/23970abd5b8919ea3e1add74692a0d056b2fcbd9/scripts/docker/sglang/sagemaker_entrypoint.sh#L17-L32';
const NVD_3059 = 'https://nvd.nist.gov/vuln/detail/CVE-2026-3059';
const NVD_7669 = 'https://nvd.nist.gov/vuln/detail/CVE-2026-7669';
const DLC_EKS =
  'https://github.com/aws/deep-learning-containers/blob/23970abd5b8919ea3e1add74692a0d056b2fcbd9/docs/sglang/deployment/eks.md#L24-L55';
const PD_SAMPLE =
  'https://github.com/awslabs/awsome-distributed-ai/blob/24a8d72095b3920bb0827a45c1c2bd6ce677cebe/examples/inference/sglang/dsv41flash-pd-autodiscovery/manifests-pd-rdma/prefill.yaml';
const DSR1 =
  'https://github.com/awslabs/awsome-distributed-ai/blob/24a8d72095b3920bb0827a45c1c2bd6ce677cebe/examples/inference/sglang/dsr1-deepep-efa/README.md';

const VLLM_SERVE_INIT =
  'https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/serve/__init__.py#L19-L22';

const VLLM_OBS_LINK = (
  <Link href="../vllm/">vLLM dive, section 20: Observability &amp; Benchmarking</Link>
);
const VLLM_OPS_LINK = (
  <Link href="../vllm/">vLLM dive, section 27: Operations &amp; Failure Modes</Link>
);

/* ------------------------------------------------------------------------ */
/* The symptom-to-cause table                                               */
/* ------------------------------------------------------------------------ */

interface SymptomRow {
  id: string;
  symptom: ReactNode;
  cause: ReactNode;
  fix: ReactNode;
  section: string;
}

/** Inline code that may wrap at any character, so long metric names fit a narrow table column. */
function C({ children }: { children: ReactNode }) {
  return <code style={{ overflowWrap: 'anywhere' }}>{children}</code>;
}

const METRIC_ROWS: SymptomRow[] = [
  {
    id: 'no-metrics',
    symptom: (
      <>
        A Prometheus scrape of <C>/metrics</C> finds nothing, and a dashboard built for vLLM
        stays empty
      </>
    ),
    cause: (
      <>
        Prometheus metrics are off by default, and <C>/metrics</C> is mounted only with the
        flag{' '}
        <Cite tier={1} href={sglangUrl(OBSERVABILITY, 'L70')}>
          observability.py L70
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L301-L304')}>
          http_server.py L301-L304
        </Cite>
      </>
    ),
    fix: (
      <>
        <C>--enable-metrics</C>; on the SageMaker DLC (Deep Learning Container),{' '}
        <C>SM_SGLANG_ENABLE_METRICS=true</C>{' '}
        <Cite tier={1} href={DLC_ENTRYPOINT}>
          DLC sagemaker_entrypoint.sh L17-L32
        </Cite>
      </>
    ),
    section: 'Section 4, The Scheduler; section 19, SGLang on SageMaker AI and HyperPod',
  },
  {
    id: 'retract',
    symptom: (
      <>
        Frequent <C>KV cache pool is full. Retract requests.</C> warnings with{' '}
        <C>token usage</C> high, and <C>sglang:new_token_ratio</C> jumping after them
      </>
    ),
    cause: (
      <>
        The admission bet is too bold: running requests generate more than they were charged for,
        so the scheduler retracts some and runs them again later{' '}
        <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4398-L4413')} kind="code">
          scheduler.py L4398-L4413
        </Cite>
      </>
    ),
    fix: (
      <>
        Raise <C>--schedule-conservativeness</C>; the tuning guide suggests a value like 1.3
        and calls about one retraction a minute acceptable (project advice, not measured here){' '}
        <Cite tier={1} href={sglangDocsSrcUrl(TUNING, 'L29-L31')}>
          SGLang docs: Hyperparameter Tuning L29-L31
        </Cite>
        . Alert on <C>rate(sglang:num_retracted_requests_total[5m])</C>{' '}
        <Cite tier={1} href={sglangUrl(COLLECTOR, 'L544-L565')} kind="code">
          metrics_collector.py L544-L565
        </Cite>
      </>
    ),
    section: 'Section 4, The Scheduler',
  },
  {
    id: 'cautious',
    symptom: (
      <>
        <C>#queue-req</C> above 0 while <C>token usage</C> stays below 0.9
      </>
    ),
    cause: (
      <>
        Admission is too cautious: the bet reserves output that never arrives, as when requests
        carry a large <C>max_new_tokens</C> and stop early on EOS (end of sequence) or a stop
        string
      </>
    ),
    fix: (
      <>
        Lower <C>--schedule-conservativeness</C>; the guide suggests a value like 0.3{' '}
        <Cite tier={1} href={sglangDocsSrcUrl(TUNING, 'L22-L27')}>
          SGLang docs: Hyperparameter Tuning L22-L27
        </Cite>
        . By our reading of the code, clients that send a <C>max_new_tokens</C> close to the
        answers they expect lower the charge directly
      </>
    ),
    section: 'Section 4, The Scheduler',
  },
  {
    id: 'usage',
    symptom: (
      <>
        Low <C>sglang:token_usage</C> on a busy server whose KV (key-value) pool is full
      </>
    ),
    cause: (
      <>
        The gauge counts only slots held by running or locked requests; cached KV that nothing
        references counts as free{' '}
        <Cite tier={1} href={sglangUrl(POOL_STATS, 'L235-L245')} kind="code">
          pool_stats_observer.py L235-L245
        </Cite>
      </>
    ),
    fix: (
      <>
        Nothing to fix. Read the gauge as pressure, and read reuse from{' '}
        <C>sum(rate(sglang:cached_tokens_total[5m])) / sum(rate(sglang:prompt_tokens_total[5m]))</C>{' '}
        <Cite tier={1} href={sglangUrl(COLLECTOR, 'L2027-L2069')} kind="code">
          metrics_collector.py L2027-L2069
        </Cite>
      </>
    ),
    section: 'Section 5, RadixAttention and the Radix Cache',
  },
];

const START_ROWS: SymptomRow[] = [
  {
    id: 'deepgemm',
    symptom: <>A block-FP8 model takes many minutes to start on SM90 or newer GPUs</>,
    cause: (
      <>
        DeepGEMM compiles its kernels for each new weight shape inside startup, before the server
        is ready. SGLang&apos;s own log warning estimates 10 to 20 minutes, with no hardware or
        model stated{' '}
        <Cite tier={1} href={sglangUrl(DG, 'L166-L185')}>
          compile_utils.py L166-L185 (project estimate)
        </Cite>
      </>
    ),
    fix: (
      <>
        Run <C>python -m sglang.compile_deep_gemm</C> with the exact serving flags at image
        build time{' '}
        <Cite tier={1} href={sglangUrl('python/sglang/compile_deep_gemm.py', 'L1-L48')}>
          compile_deep_gemm.py L1-L48
        </Cite>
        , and keep <C>SGLANG_CACHE_DIR</C> and <C>SGLANG_JIT_CACHE_DIR</C> on persistent
        storage
      </>
    ),
    section: 'Section 8, Attention Backends and Kernels',
  },
  {
    id: 'sagemaker',
    symptom: <>A SageMaker instance launch fails, or the endpoint never reaches InService</>,
    cause: (
      <>
        SageMaker fails a launch whose container has not begun answering <C>/ping</C> with
        200 within 8 minutes{' '}
        <Cite tier={1} href={SM_CONTRACT}>
          SageMaker docs: custom inference code with hosting services
        </Cite>
        , and SGLang answers only after weight load and CUDA graph capture{' '}
        <Cite tier={1} href={sglangUrl(SCHEDULER, 'L1098-L1111')} kind="code">
          scheduler.py L1098-L1111
        </Cite>
        . With <C>--api-key</C> set, <C>/ping</C> fails too: it is not exempt from the
        key (read from source, not run){' '}
        <Cite tier={1} href={sglangUrl(AUTH, 'L101-L106')} kind="code">
          auth.py L101-L106
        </Cite>
        , and AWS names no way to attach a token to the health check{' '}
        <Cite tier={1} href={SM_CONTRACT}>
          SageMaker docs: custom inference code with hosting services
        </Cite>
      </>
    ),
    fix: (
      <>
        Set <C>ContainerStartupHealthCheckTimeoutInSeconds</C> (60 to 3600) above download,
        load and graph capture{' '}
        <Cite tier={1} href={SM_VARIANT}>
          SageMaker API: ProductionVariant
        </Cite>
        , prebuild the DeepGEMM cache, and set the admin key alone, without{' '}
        <C>--api-key</C>
      </>
    ),
    section: 'Section 19, SGLang on SageMaker AI and HyperPod',
  },
  {
    id: 'ping-static',
    symptom: (
      <>
        SageMaker keeps routing to an instance whose engine has stopped answering
      </>
    ),
    cause: (
      <>
        <C>/ping</C> returns a static 200 and never consults the engine{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L2123-L2126')} kind="code">
          http_server.py L2123-L2126
        </Cite>
      </>
    ),
    fix: <>Alarm on the endpoint&apos;s invocation errors and SGLang&apos;s own metrics</>,
    section: 'Section 19, SGLang on SageMaker AI and HyperPod',
  },
  {
    id: 'probe-timeout',
    symptom: (
      <>
        Kubernetes probes on <C>/health</C> time out against a healthy server, and pods
        restart
      </>
    ),
    cause: (
      <>
        The handler waits one second before its first look at the engine, so a healthy answer takes
        at least one second{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L762-L769')} kind="code">
          http_server.py L762-L769
        </Cite>
        , and a Kubernetes probe times out after one second by default{' '}
        <Cite tier={1} href={K8S_PROBES}>
          Kubernetes docs: probe configuration fields
        </Cite>
        . Read from source, not run
      </>
    ),
    fix: (
      <>
        A <C>timeoutSeconds</C> above 1 on every <C>/health</C> probe; SGLang&apos;s
        sample sets 10{' '}
        <Cite tier={1} href={sglangUrl(K8S_SAMPLE, 'L76-L92')}>
          k8s-sglang-service.yaml L76-L92
        </Cite>
      </>
    ),
    section: 'Section 20, SGLang on EKS and EC2',
  },
  {
    id: 'health-503',
    symptom: (
      <>
        <C>/health</C> answers 503, and the log shows{' '}
        <C>Health check failed. Server couldn&apos;t get a response from detokenizer for last 20 seconds</C>
      </>
    ),
    cause: (
      <>
        The engine produced no output for 20 seconds (<C>SGLANG_HEALTH_CHECK_TIMEOUT</C>){' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L205-L207')}>
          http_server.py L205-L207
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L762-L783')} kind="code">
          http_server.py L762-L783
        </Cite>
        : a hung engine, or a weight-sync pause longer than 20 seconds, since a pause holds the
        check&apos;s request until generation resumes{' '}
        <Cite tier={1} href={sglangUrl(TOKENIZER_MGR, 'L939-L940')} kind="code">
          tokenizer_manager.py L939-L940
        </Cite>
        . Read from source, not run
      </>
    ),
    fix: (
      <>
        Keep the liveness failure window longer than your longest weight sync, and put readiness
        on <C>/ready</C>, which answers without generating
      </>
    ),
    section: 'Section 20, SGLang on EKS and EC2',
  },
  {
    id: 'follower',
    symptom: (
      <>
        Probes on the worker pods of a multi-node instance stay green while the model does not
        answer
      </>
    ),
    cause: (
      <>
        On the Python frontend, every node after node 0 waits for its schedulers to load, then
        serves a stub app on <C>--port</C> whose <C>/health</C>, <C>/health_generate</C> and{' '}
        <C>/ping</C> always answer 200{' '}
        <Cite tier={1} href={sglangUrl(ENGINE, 'L1228-L1281')} kind="code">
          engine.py L1228-L1281
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(COMMON, 'L3678-L3702')} kind="code">
          common.py L3678-L3702
        </Cite>
        . Read from source, not run
      </>
    ),
    fix: (
      <>
        Put the engine probes on the leader pod, node 0; by our reading its one-token check needs
        every rank of a TP group that spans the nodes
      </>
    ),
    section: 'Section 3, The SGLang Runtime; section 20, SGLang on EKS and EC2',
  },
];

const REQUEST_ROWS: SymptomRow[] = [
  {
    id: 'grammar',
    symptom: (
      <>
        Every request with one schema fails at once with a 400 ending in{' '}
        <C>Grammar preprocessing timed out</C>, after one slow compile
      </>
    ),
    cause: (
      <>
        A grammar still compiling after 10,000 polls (<C>SGLANG_GRAMMAR_MAX_POLL_ITERATIONS</C>
        , at least 50 seconds by arithmetic on the code) is abandoned, and its schema is cached as
        failed{' '}
        <Cite tier={1} href={sglangUrl(GRAMMAR_MGR, 'L312-L322')} kind="code">
          grammar_manager.py L312-L322
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(GRAMMAR_MGR, 'L177-L189')} kind="code">
          grammar_manager.py L177-L189
        </Cite>
      </>
    ),
    fix: (
      <>
        <C>/flush_cache</C>, an admin route that runs only when the server is idle and drops
        every cached prefix, or a restart; for large schemas, raise{' '}
        <C>SGLANG_GRAMMAR_MAX_POLL_ITERATIONS</C> at launch
      </>
    ),
    section: 'Section 10, Structured Output',
  },
  {
    id: 'lora',
    symptom: <>A request meant for a LoRA adapter answers like the base model, with no error</>,
    cause: (
      <>
        The chat and completions handlers take the adapter from the right side of the first
        colon in{' '}
        <C>model</C>; the bare adapter name that <C>/v1/models</C> lists selects no
        adapter, and the model name is not checked{' '}
        <Cite tier={1} href={sglangUrl(SERVING_BASE, 'L40-L71')}>
          serving_base.py L40-L71
        </Cite>
      </>
    ),
    fix: (
      <>
        <C>{'model="<base>:<adapter>"'}</C>, or <C>lora_path</C> in{' '}
        <C>extra_body</C>; on <C>/generate</C>, <C>lora_path</C>
      </>
    ),
    section: 'Section 12, Talking to SGLang',
  },
];

const SCALE_ROWS: SymptomRow[] = [
  {
    id: 'pd-bootstrap',
    symptom: (
      <>
        <C>sglang:num_prefill_bootstrap_queue_reqs</C> keeps growing while prefill GPUs sit
        idle
      </>
    ),
    cause: (
      <>
        Decode capacity, by our reading of the queue design: under the default <C>early</C>{' '}
        policy a request waits there until decode reserves its pages{' '}
        <Cite tier={1} href={sglangUrl(COLLECTOR, 'L574-L676')}>
          metrics_collector.py L574-L676
        </Cite>
      </>
    ),
    fix: (
      <>
        Add decode capacity, or test <C>prefill_complete</C> if long prompts are what hold
        the pages
      </>
    ),
    section: 'Section 15, PD Disaggregation',
  },
  {
    id: 'pd-transfer',
    symptom: (
      <>
        <C>sglang:num_decode_transfer_queue_reqs</C> keeps growing
      </>
    ),
    cause: (
      <>
        The fabric, or prefill compute, by the same reading: pages are reserved, and the request
        stays there until its last chunk lands
      </>
    ),
    fix: (
      <>
        Compare <C>sglang:kv_transfer_speed_gb_s</C> with the link first; for EFA, section 22,
        PD and Wide EP (expert parallelism) over EFA
      </>
    ),
    section: 'Section 15, PD Disaggregation',
  },
  {
    id: 'pd-fail',
    symptom: (
      <>
        Decode answers HTTP 500, or logs <C>Lost connection with prefill instance</C>
      </>
    ),
    cause: (
      <>
        A failed KV transfer aborts the request with a 500{' '}
        <Cite tier={1} href={sglangUrl(DECODE, 'L2760-L2786')}>
          decode.py L2760-L2786
        </Cite>
        ; two missed heartbeats, 5 seconds apart, fail every unfinished request from that prefill
        server, some 10 seconds at the defaults{' '}
        <Cite tier={1} href={sglangUrl(ENVIRON, 'L708-L709')}>
          environ.py L708-L709
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(COMMON_CONN, 'L1817-L1916')}>
          conn.py L1817-L1916
        </Cite>
      </>
    ),
    fix: (
      <>
        Count them with <C>sglang:num_transfer_failed_reqs_total</C> and{' '}
        <C>sglang:num_bootstrap_failed_reqs_total</C>; a gateway in PD mode drops the paired
        decode request when the prefill leg fails{' '}
        <Cite tier={1} href={sglangUrl(`${GW}/routers/http/pd_router.rs`, 'L732-L745')} kind="code">
          pd_router.rs L732-L745
        </Cite>
      </>
    ),
    section: 'Section 15, PD Disaggregation',
  },
  {
    id: 'gw-dead',
    symptom: <>A dead worker keeps receiving gateway traffic for minutes</>,
    cause: (
      <>
        The gateway probes each worker&apos;s <C>/health</C> every 60 seconds with a 5-second
        timeout, and 3 failures mark it unhealthy{' '}
        <Cite tier={1} href={sglangUrl(`${GW}/main.rs`, 'L403-L425')}>
          main.rs L403-L425
        </Cite>
        ; on live traffic, 10 failures in a row open the worker&apos;s circuit breaker sooner{' '}
        <Cite tier={1} href={sglangUrl(`${GW}/core/circuit_breaker.rs`, 'L104-L252')} kind="code">
          circuit_breaker.rs L104-L252
        </Cite>
      </>
    ),
    fix: (
      <>
        Watch <C>smg_worker_health</C> and <C>smg_worker_cb_state</C> on the
        gateway&apos;s metrics port, 29000{' '}
        <Cite tier={1} href={sglangUrl(`${GW}/observability/metrics.rs`, 'L151-L331')}>
          metrics.rs L151-L331
        </Cite>
        ; <C>--health-check-interval-secs</C> sets the 60 seconds
      </>
    ),
    section: 'Section 17, The Model Gateway',
  },
  {
    id: 'nccl-sockets',
    symptom: (
      <>
        Prefill TTFT (time to first token) 3 to 5 times worse over EFA, with{' '}
        <C>NET/Plugin: Could not find: libnccl-net.so</C> in the NCCL (NVIDIA Collective
        Communications Library) log
      </>
    ),
    cause: (
      <>
        NCCL looks for <C>libnccl-net.so</C>, the
        EFA installer ships <C>libnccl-net-ofi.so</C>, and NCCL falls back to TCP sockets:
        about 14 GB/s against about 400 GB/s, an AWS sample&apos;s report{' '}
        <Cite tier={2} href={`${DSR1}#L93-L93`}>
          AWS sample dsr1-deepep-efa L93
        </Cite>
      </>
    ),
    fix: (
      <>
        <C>NCCL_NET_PLUGIN=ofi</C>, then confirm with <C>NCCL_DEBUG=INFO</C> that the
        OFI (OpenFabrics Interfaces) plugin loads before any benchmark
      </>
    ),
    section: 'Section 22, PD and Wide EP over EFA',
  },
  {
    id: 'mooncake-tcp',
    symptom: (
      <>
        PD over EFA passes a smoke test, then deadlocks under sustained high-concurrency prefill
        with <C>KVTransferError ... session is not alive</C>
      </>
    ),
    cause: (
      <>
        Without <C>MOONCAKE_PROTOCOL=efa</C> the KV moved over TCP sockets, and the server log
        shows <C>Installing TCP transport</C>. An AWS sample&apos;s report, on SGLang
        0.5.13.post1{' '}
        <Cite tier={2} href={`${DSR1}#L68-L83`}>
          AWS sample dsr1-deepep-efa L68-L83
        </Cite>{' '}
        <Cite tier={2} href={`${DSR1}#L18-L27`}>
          AWS sample L18-L27
        </Cite>
      </>
    ),
    fix: (
      <>
        Set <C>MOONCAKE_PROTOCOL=efa</C>, and check every role&apos;s log for{' '}
        <C>EfaTransport: Initialized EFA device</C>{' '}
        <Cite tier={2} href={`${DSR1}#L248-L252`}>
          AWS sample L248-L252
        </Cite>
      </>
    ),
    section: 'Section 22, PD and Wide EP over EFA',
  },
];

/* ------------------------------------------------------------------------ */
/* Where a key does not reach                                               */
/* ------------------------------------------------------------------------ */

const KEY_GAP_ROWS: SymptomRow[] = [
  {
    id: 'server-info',
    symptom: <>Any client allowed on the inference routes can read the admin key</>,
    cause: (
      <>
        The documentation lists <C>/server_info</C> among the routes the admin key guards{' '}
        <Cite tier={1} href={sglangDocsSrcUrl(SERVER_ARGS_DOC, 'L1094-L1095')} kind="doc-code-conflict">
          SGLang docs: server arguments (v0.5.22 source)
        </Cite>
        . v0.5.22&apos;s code gives it and the deprecated <C>/get_server_info</C> no admin level{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L837-L874')} kind="code">
          http_server.py L837-L874
        </Cite>
        , so both follow the inference rule{' '}
        <Cite tier={1} href={sglangUrl(AUTH, 'L145-L151')} kind="code">
          auth.py L145-L151
        </Cite>
        , and both return every resolved server argument, <C>api_key</C> and{' '}
        <C>admin_api_key</C> among them{' '}
        <Cite tier={1} href={sglangUrl(SERVER_ARGS, 'L315-L330')} kind="code">
          server_args.py L315-L330
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(COMMON, 'L3640-L3650')} kind="code">
          common.py L3640-L3650
        </Cite>
        , with only watermark secrets redacted{' '}
        <Cite tier={1} href={sglangUrl(WATERMARK, 'L26-L104')} kind="code">
          watermarking/core.py L26-L104
        </Cite>
        . Read from source, not run
      </>
    ),
    fix: (
      <>
        Keep <C>/server_info</C> and <C>/get_server_info</C> off the client path: block
        both at the gateway, ingress or load balancer for everyone but operators
      </>
    ),
    section: 'Section 12, Talking to SGLang',
  },
  {
    id: 'gw-server-info',
    symptom: (
      <>
        The gateway answers <C>/server_info</C> to clients that hold no gateway key
      </>
    ),
    cause: (
      <>
        The gateway serves <C>/server_info</C> and <C>/get_server_info</C> in its public
        route group, outside its own key check, and proxies them to a worker{' '}
        <Cite tier={1} href={sglangUrl(`${GW}/server.rs`, 'L593-L605')} kind="code">
          server.rs L593-L605
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(`${GW}/routers/http/router.rs`, 'L92-L131')} kind="code">
          router.rs L92-L131
        </Cite>
        . Read from source, not run
      </>
    ),
    fix: <>Block both paths at the load balancer or ingress in front of the gateway</>,
    section: 'Section 17, The Model Gateway',
  },
  {
    id: 'multi-tok',
    symptom: (
      <>
        A server with <C>--tokenizer-worker-num</C> above 1 and <C>--admin-api-key</C>{' '}
        set
      </>
    ),
    cause: (
      <>
        The key middleware is installed only in single-tokenizer mode, so the admin key is never
        checked and the admin routes stay as open as with no key;{' '}
        <C>--api-key</C> fails an assertion at start{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L2656-L2690')} kind="code">
          http_server.py L2656-L2690
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L240-L250')}>
          http_server.py L240-L250
        </Cite>
        . Read from source, not run
      </>
    ),
    fix: <>No key on the server; a gateway authenticates and keeps admin paths from clients</>,
    section: 'Section 3, The SGLang Runtime; section 12, Talking to SGLang',
  },
  {
    id: 'rust',
    symptom: (
      <>
        A Rust-frontend server (<C>SGLANG_RUST_SERVER=1</C>) started with a key
      </>
    ),
    cause: (
      <>
        Its router has no authentication layer, so <C>--api-key</C> protects nothing{' '}
        <Cite tier={1} href={sglangUrl(RUST_APP, 'L77-L92')} kind="code">
          app.rs L77-L92
        </Cite>
        , and it mounts no admin route and no <C>/metrics</C>{' '}
        <Cite tier={1} href={sglangTreeUrl('rust')} kind="code">
          rust/ at v0.5.22
        </Cite>
        . Read from source, not run
      </>
    ),
    fix: (
      <>
        Keep the Python frontend where you need a key or <C>/metrics</C>, or authenticate in a
        gateway
      </>
    ),
    section: 'Section 3, The SGLang Runtime; section 12, Talking to SGLang',
  },
];

function SymptomTable({
  title,
  rows,
  firstHeader = 'Symptom',
}: {
  title: string;
  rows: SymptomRow[];
  firstHeader?: string;
}) {
  return (
    <Table
      variant="embedded"
      wrapLines
      trackBy="id"
      header={<Header variant="h3">{title}</Header>}
      items={rows}
      columnDefinitions={[
        { id: 'symptom', header: firstHeader, cell: (r) => r.symptom, minWidth: 180 },
        { id: 'fix', header: 'Flag or fix', cell: (r) => r.fix, minWidth: 220 },
        { id: 'cause', header: 'Cause', cell: (r) => r.cause, minWidth: 260 },
        { id: 'section', header: 'Section', cell: (r) => r.section, minWidth: 140 },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------ */
/* The nine advisories                                                      */
/* ------------------------------------------------------------------------ */

interface CveRow {
  id: string;
  ghsa: string;
  severity: string;
  where: string;
  affected: string;
  patched: string;
}

const CVE_ROWS: CveRow[] = [
  {
    id: 'CVE-2026-3059',
    ghsa: 'GHSA-rgq9-fqf5-fv58',
    severity: 'Critical',
    where: 'Diffusion runtime: multimodal generation pickle socket',
    affected: '0.5.9 and earlier',
    patched: '0.5.10',
  },
  {
    id: 'CVE-2026-3060',
    ghsa: 'GHSA-jx93-g359-86wm',
    severity: 'Critical',
    where: 'EPD: encoder disaggregation pickle socket',
    affected: '0.5.9 and earlier',
    patched: '0.5.10',
  },
  {
    id: 'CVE-2026-3989',
    ghsa: 'GHSA-hvwj-8w5g-28rg',
    severity: 'High',
    where: 'replay_request_dump.py pickle load',
    affected: '0.5.9 and earlier',
    patched: '0.5.10',
  },
  {
    id: 'CVE-2026-7669',
    ghsa: 'GHSA-6m5f-673f-5vh7',
    severity: 'Medium',
    where: 'get_tokenizer deserialization',
    affected: '0.5.9 and earlier',
    patched: 'None listed',
  },
  {
    id: 'CVE-2026-7301',
    ghsa: 'GHSA-gwv6-pq6m-p3rq',
    severity: 'Critical',
    where: 'Diffusion runtime: scheduler socket on 0.0.0.0 with pickle',
    affected: '0.5.5 to 0.5.12',
    patched: 'None listed',
  },
  {
    id: 'CVE-2026-7302',
    ghsa: 'GHSA-qwrp-wghp-94q2',
    severity: 'Critical',
    where: 'Diffusion runtime: upload filename path traversal',
    affected: '0.5.5 to 0.5.12',
    patched: 'None listed',
  },
  {
    id: 'CVE-2026-7304',
    ghsa: 'GHSA-36m8-w8qf-g76p',
    severity: 'Critical',
    where: '--enable-custom-logit-processor dill load',
    affected: '0.4.1.post7 to 0.5.12',
    patched: 'None listed',
  },
  {
    id: 'CVE-2026-10300',
    ghsa: 'GHSA-m2jr-x4gq-5rmj',
    severity: 'Low',
    where: 'LoRA lora_path reachable assertion',
    affected: '0.5.10.post1 and earlier',
    patched: 'None listed',
  },
  {
    id: 'CVE-2026-10775',
    ghsa: 'GHSA-jrcc-j37m-v8fg',
    severity: 'Low',
    where: 'data_hash denial of service',
    affected: '0.5.11 and earlier',
    patched: 'None listed',
  },
];

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function Operations() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Know what to watch in week one, how to move a slow first start to build time, which keys to set where, and which log line names which failure (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            25. Operations: metrics, warm-up, keys and failure signatures
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Running SGLang day to day comes down to reading the signals the server already emits.
            Most of the failures in this dive have one log line or one gauge that names them, and
            the earlier sections each own a few. This section collects them by symptom, each with
            its fix and the section that holds the mechanism.
          </Box>
          <Box variant="p">
            One decision comes before any symptom can show.{' '}
            <strong>
              With no key set, the admin routes accept any client that can reach the port
            </strong>
            : weight updates, memory release, cache flush, LoRA (low-rank adaptation) loading and
            pause among them{' '}
            <Cite tier={1} href={sglangUrl(AUTH, 'L133-L143')}>
              auth.py L133-L143
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SERVING, 'L154-L161')}>
              serving.py L154-L161
            </Cite>
            , the three HiCache storage routes excepted, which refuse to run without an admin key{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L1106-L1173')}>
              http_server.py L1106-L1173
            </Cite>
            . The last block of this section closes that plane.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Turn on the instruments before the first load test, so every row of the symptom table has a signal to read"
          >
            What to watch in week one
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Start every server with <code>--enable-metrics</code>. Prometheus metrics are off by
            default, and with the flag the server serves <code>/metrics</code> on its HTTP port{' '}
            <Cite tier={1} href={sglangUrl(OBSERVABILITY, 'L70')}>
              observability.py L70
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L301-L304')}>
              http_server.py L301-L304
            </Cite>
            . Paths starting <code>/health</code>, <code>/ready</code> or <code>/metrics</code> need
            no key{' '}
            <Cite tier={1} href={sglangUrl(AUTH, 'L101-L106')}>
              auth.py L101-L106
            </Cite>
            , so probes and scrapes keep working once you set keys. vLLM mounts{' '}
            <code>/metrics</code> on every server{' '}
            <Cite tier={1} href={VLLM_SERVE_INIT}>
              vLLM serve/__init__.py L19-L22 (v0.31.0)
            </Cite>
            , so a scrape config copied from a vLLM deployment finds nothing on a default SGLang
            server ({VLLM_OBS_LINK}).
          </Box>
          <Box variant="p">Then read five signals, each owned by an earlier section:</Box>
          <ul>
            <li>
              <strong>Admission:</strong> <code>#queue-req</code> and <code>token usage</code> on the
              scheduler&apos;s prefill and decode log lines, read with the retraction warning, and{' '}
              <code>rate(sglang:num_retracted_requests_total[5m])</code> (section 4, The Scheduler).
            </li>
            <li>
              <strong>Pressure and reuse:</strong> <code>sglang:token_usage</code> as pressure, and
              the cached share of prompt tokens as reuse, with <code>#cached-token</code> against{' '}
              <code>#new-token</code> on each prefill line (section 5, RadixAttention and the Radix
              Cache).
            </li>
            <li>
              <strong>PD (prefill/decode) queues:</strong> the bootstrap and in-flight queues on
              prefill, the preallocation and transfer queues on decode, and the transfer speed
              (section 15, PD Disaggregation).
            </li>
            <li>
              <strong>The gateway:</strong> its own <code>smg_*</code> series on port 29000, while
              engine metrics stay on each worker&apos;s <code>/metrics</code> (section 17, The Model
              Gateway).
            </li>
            <li>
              <strong>Health:</strong> <code>/health</code> runs a one-token generation and{' '}
              <code>/ready</code> answers without one. The probe plan for Amazon EKS (Elastic
              Kubernetes Service) and EC2 (Elastic Compute Cloud) is in section 20, SGLang on EKS
              and EC2.
            </li>
          </ul>
          <Box variant="p">
            Log lines and scheduler metrics come from the first rank of each attention TP (tensor
            parallelism) group only, so a server running DP (data parallelism) attention gives one stream per DP group{' '}
            <Cite tier={1} href={sglangUrl(COLLECTOR, 'L1325-L1335')} kind="code">
              metrics_collector.py L1325-L1335
            </Cite>
            . Graph each group&apos;s series, or pass <code>--enable-metrics-for-all-schedulers</code>{' '}
            to make every rank export its own.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pay for weight load, graph capture, warmup and kernel compiles once, at build time or in a startup budget, so a new instance never fails its first health check"
          >
            Move the slow first start to build time
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Measure your model&apos;s cold start on the instance you will run, then size the start
            window above it. A loading SGLang server answers nothing. The HTTP server starts only
            after the weights are loaded and the CUDA graphs captured{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L1336-L1338')}>
              engine.py L1336-L1338
            </Cite>
            , and <code>/health</code> stays at 503 until the warmup request completes{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L715-L720')}>
              http_server.py L715-L720
            </Cite>
            . The start budget is download, weight load, graph capture and warmup together, and
            SageMaker and Kubernetes each put a limit on it: SageMaker fails a launch that has not passed{' '}
            <code>/ping</code> within 8 minutes{' '}
            <Cite tier={1} href={SM_CONTRACT}>
              SageMaker docs: custom inference code with hosting services
            </Cite>
            , and Kubernetes kills a container whose startup probe fails{' '}
            <code>failureThreshold</code> times in a row{' '}
            <Cite tier={1} href={K8S_PROBES}>
              Kubernetes docs: startup probe
            </Cite>
            . For reference, AWS&apos;s SGLang PD sample allows 1,800 seconds for a DeepSeek-V4.1-Flash
            engine with weights pre-staged on local disk{' '}
            <Cite tier={2} href={`${PD_SAMPLE}#L215-L228`}>
              AWS sample prefill.yaml L215-L228
            </Cite>
            .
          </Box>
          <Box variant="p">
            One start cost belongs at build time instead. On SM90 (compute capability 9.0, Hopper)
            or newer, block-quantized FP8 (8-bit floating point) linear layers run on DeepGEMM by
            default wherever the installed DeepGEMM build supports the GPU{' '}
            <Cite tier={1} href={sglangUrl(DG_CONF, 'L32-L56')}>
              configurer.py L32-L56
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(FP8_UTILS, 'L1025-L1053')}>
              fp8_utils.py L1025-L1053
            </Cite>
            , and its kernels compile for each new weight shape inside startup{' '}
            <Cite tier={1} href={sglangUrl(DG, 'L42-L113')}>
              compile_utils.py L42-L113
            </Cite>
            . SGLang&apos;s own log warning estimates that compile at 10 to 20 minutes, with no
            hardware or model stated{' '}
            <Cite tier={1} href={sglangUrl(DG, 'L166-L185')}>
              compile_utils.py L166-L185 (project estimate)
            </Cite>
            , above SageMaker&apos;s 8-minute default window, so by our reading a cold block-FP8
            start there can fail its launch. Run{' '}
            <code>python -m sglang.compile_deep_gemm</code> with the exact serving flags while you
            build the image{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/compile_deep_gemm.py', 'L1-L48')}>
              compile_deep_gemm.py L1-L48
            </Cite>
            , and keep <code>SGLANG_CACHE_DIR</code> and <code>SGLANG_JIT_CACHE_DIR</code> on
            persistent storage, since the JIT (just-in-time) kernel cache does not follow the first
            variable{' '}
            <Cite tier={1} href={sglangUrl(JIT_CACHE, 'L302')} kind="code">
              kernels/jit cache.py L302
            </Cite>{' '}
            (section 8, Attention Backends and Kernels).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find the log line or gauge you are looking at and apply the flag or fix beside it; the cause and the section that holds the mechanism follow"
          >
            Match the symptom to its cause
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each row keeps the conditions its section established. A row marked &quot;read from
            source, not run&quot; describes v0.5.22&apos;s code as we read it; we did not reproduce
            it on a running server.
          </Box>
          <SymptomTable title="Metrics, admission and the cache" rows={METRIC_ROWS} />
          <SymptomTable title="Startup and health" rows={START_ROWS} />
          <SymptomTable title="Requests" rows={REQUEST_ROWS} />
          <SymptomTable title="PD, the gateway and EFA (Elastic Fabric Adapter)" rows={SCALE_ROWS} />
          <Box variant="p">
            Where you watched <code>vllm:num_preemptions</code>, watch{' '}
            <code>sglang:num_retracted_requests_total</code>: retraction is SGLang&apos;s name for
            preemption (section 4). The vLLM side of these signatures is in the {VLLM_OPS_LINK}.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Close the admin plane with a key or the network before the port leaves the host, keep three opt-in surfaces off exposed hosts, and know where SGLang's advisories appear"
          >
            Close the admin plane before the port leaves the host
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The admin plane is the set of routes an RL (reinforcement learning) trainer or an
            operator calls to change a running server, and the default Python frontend registers it
            on every server.{' '}
            <strong>
              With no key set, the admin routes accept any client that can reach the port
            </strong>{' '}
            <Cite tier={1} href={sglangUrl(AUTH, 'L133-L143')}>
              auth.py L133-L143
            </Cite>
            . The bind decides how far that reaches. SGLang binds 127.0.0.1 by default, so an open
            admin plane is open to the local host{' '}
            <Cite tier={1} href={sglangUrl(SERVING, 'L65-L66')}>
              serving.py L65-L66
            </Cite>
            . Container deployments set <code>--host 0.0.0.0</code>: SGLang&apos;s SageMaker
            entrypoint adds it unless you pass a host{' '}
            <Cite tier={1} href={sglangUrl('docker/serve', 'L23-L26')}>
              docker/serve L23-L26
            </Cite>
            , and an EKS pod needs it for a Service to reach the server{' '}
            <Cite tier={1} href={DLC_EKS}>
              AWS DLC docs: EKS deployment
            </Cite>
            . From then on, open means open to the network.
          </Box>
          <Box variant="p">
            The v0.5.22 release notes carry the fix &quot;Require admin auth for{' '}
            <code>/load_lora_adapter_from_tensors</code> and <code>/set_trace_level</code>&quot;{' '}
            <Cite tier={1} href={REL_0522} kind="doc-code-conflict">
              SGLang v0.5.22 release notes
            </Cite>
            . In code they follow the same rule as every other admin route, and require the admin
            key only when one is configured{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L1208-L1209')} kind="code">
              http_server.py L1208-L1209
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L1628-L1629')} kind="code">
              http_server.py L1628-L1629
            </Cite>
            . So set <code>--admin-api-key</code> on any server reachable beyond its own host.
          </Box>
          <Box variant="p">
            Two defaults protect you, and both are worth keeping. One is the loopback bind. The
            other is <code>--enable-custom-logit-processor</code>, off by default{' '}
            <Cite tier={1} href={sglangUrl(EXEC_FIELDS, 'L68-L71')}>
              exec_.py L68-L71
            </Cite>
            : it lets a request carry a serialized Python object that the server loads with{' '}
            <code>dill</code>{' '}
            <Cite tier={1} href={sglangUrl(CUSTOM_LP, 'L15-L21')}>
              custom_logit_processor.py L15-L21
            </Cite>
            , so turning it on lets any client that reaches the port run code on the server.
          </Box>
          <Box variant="p">
            A key also has gaps. Four configurations leave a route or a whole server outside the key
            you set:
          </Box>
          <SymptomTable title="Where a key does not reach" rows={KEY_GAP_ROWS} firstHeader="Exposure" />

          <Header variant="h3">Nine advisories in 2026, and what to keep off an exposed host</Header>
          <Box variant="p">
            Nine CVEs (Common Vulnerabilities and Exposures) against SGLang were published between
            March and June 2026, five of them rated critical{' '}
            <Cite tier={1} href={ADVISORIES}>
              GitHub Advisory Database: pip, sglang
            </Cite>
            . Every critical one is code execution or file write through Python deserialization or
            an upload filename: three in the diffusion runtime, one behind the opt-in{' '}
            <code>--enable-custom-logit-processor</code> flag, and one in EPD (encoder-prefill-decode
            disaggregation), so none of the five sits in the default LLM (large language model)
            serving path. Six of the nine
            advisories list no patched version.
          </Box>
          <Box variant="p">
            So keep the diffusion server, EPD and <code>--enable-custom-logit-processor</code> off
            exposed hosts, and run v0.5.22 or later. v0.5.22 is the first release with the hardening
            for the surfaces CVE-2026-7301 and CVE-2026-7302 name: the diffusion scheduler&apos;s
            socket stays on loopback when <code>--host</code> is a wildcard{' '}
            <Cite tier={1} href={sglangUrl(MM_ARGS, 'L3289-L3312')}>
              multimodal_gen server_args.py L3289-L3312
            </Cite>
            , and upload filenames are reduced to a safe basename{' '}
            <Cite tier={1} href={sglangUrl(MM_UPLOAD, 'L329-L339')}>
              multimodal_gen openai/utils.py L329-L339
            </Cite>
            . The socket still deserializes pickle{' '}
            <Cite tier={1} href={sglangUrl(MM_SCHED, 'L1329')}>
              multimodal_gen scheduler.py L1329
            </Cite>
            , and an explicit interface address binds it on that interface. Those two advisories list
            affected versions up to 0.5.12 and no patched version; whether 0.5.13 to 0.5.21 are exposed was not
            tested in this research.
          </Box>
          <ExpandableSection headerText="The nine advisories, 2026-03-12 to 2026-06-04">
            <Table
              variant="embedded"
              wrapLines
              trackBy="id"
              items={CVE_ROWS}
              columnDefinitions={[
                {
                  id: 'cve',
                  header: 'CVE and GitHub advisory',
                  cell: (r) => (
                    <Cite tier={1} href={`${GHSA}/${r.ghsa}`}>
                      {`${r.id} (${r.ghsa})`}
                    </Cite>
                  ),
                  minWidth: 200,
                },
                { id: 'severity', header: 'Severity (GitHub)', cell: (r) => r.severity, minWidth: 120 },
                { id: 'where', header: 'Where', cell: (r) => r.where, minWidth: 200 },
                { id: 'affected', header: 'Affected', cell: (r) => r.affected, minWidth: 130 },
                { id: 'patched', header: 'Patched in', cell: (r) => r.patched, minWidth: 120 },
              ]}
            />
          </ExpandableSection>
          <Box variant="p">
            Watch the GitHub Advisory Database and the NVD (National Vulnerability Database) for the{' '}
            <code>sglang</code> pip package: that is where its CVEs reach you, filed by outside
            reporters, and the NVD records name the CERT Coordination Center or VulDB as their
            source{' '}
            <Cite tier={1} href={NVD_3059}>
              NVD: CVE-2026-3059
            </Cite>{' '}
            <Cite tier={1} href={NVD_7669}>
              NVD: CVE-2026-7669
            </Cite>
            . As of 2026-10-24, SGLang publishes no security policy file and no repository security
            advisories on GitHub, and its security page offers GitHub&apos;s private vulnerability
            reporting{' '}
            <Cite tier={1} href={SECURITY_POLICY}>
              sgl-project/sglang security policy page
            </Cite>
            .
          </Box>
          <Box variant="p">
            Section 12, Talking to SGLang, holds the key matrix for each deployment: SageMaker, EKS
            and EC2, multi-tokenizer servers and the Rust frontend. The order that closes the plane:
            run v0.5.22 or later; keep <code>--host</code> at 127.0.0.1, or put the server on a
            private network behind the gateway, because{' '}
            <strong>with no key, the admin routes answer anyone who reaches the port</strong>; then
            set the keys that matrix gives for your deployment before the port leaves the host.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
