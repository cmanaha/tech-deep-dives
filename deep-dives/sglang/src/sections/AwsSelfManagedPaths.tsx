import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangDocsSrcUrl } from '../components/Cite';

/* SGLang source paths at v0.5.22 */
const HTTP = 'python/sglang/srt/entrypoints/http_server.py';
const ENGINE = 'python/sglang/srt/entrypoints/engine.py';
const COMMON = 'python/sglang/srt/utils/common.py';
const AUTH = 'python/sglang/srt/utils/auth.py';
const ENVIRON = 'python/sglang/srt/environ.py';
const SERVING = 'python/sglang/srt/arg_groups/fields/serving.py';
const OBSERVABILITY = 'python/sglang/srt/arg_groups/fields/observability.py';
const TOKENIZER_MGR = 'python/sglang/srt/managers/tokenizer_manager.py';
const MM_UTILS = 'python/sglang/srt/managers/mm_utils.py';
const LOAD_SNAPSHOT = 'python/sglang/srt/managers/load_snapshot.py';
const NETWORK = 'python/sglang/srt/utils/network.py';
const PD_CONN = 'python/sglang/srt/disaggregation/common/conn.py';
const K8S_SAMPLE = 'docker/k8s-sglang-service.yaml';
const LWS_DOC = 'references/multi_node_deployment/deploy_on_k8s';

/* AWS Deep Learning Containers repository, pinned to the SHA register 09 read */
const DLC =
  'https://github.com/aws/deep-learning-containers/blob/23970abd5b8919ea3e1add74692a0d056b2fcbd9';
const DLC_EKS = `${DLC}/docs/sglang/deployment/eks.md#L24-L55`;
const DLC_EC2 = `${DLC}/docs/sglang/deployment/ec2.md#L29-L42`;
const DLC_DOCKERFILE = `${DLC}/docker/sglang/Dockerfile`;
const DLC_ENTRY = `${DLC}/scripts/docker/sglang/dockerd_entrypoint.sh#L1-L6`;
const DLC_GALLERY = 'https://gallery.ecr.aws/deep-learning-containers/sglang';

/* AWS sample repositories, pinned to the SHAs register 09 read (Tier 2) */
const ADAI =
  'https://github.com/awslabs/awsome-distributed-ai/blob/24a8d72095b3920bb0827a45c1c2bd6ce677cebe/examples/inference/sglang';
const PD_SAMPLE = `${ADAI}/dsv41flash-pd-autodiscovery/manifests-pd-rdma/prefill.yaml`;
const ADAI_README = `${ADAI}/README.md`;
const AI_ON_EKS =
  'https://github.com/awslabs/ai-on-eks/blob/667e3022df4c90c55f7c74cc1412d5b66ebff8a9/blueprints/inference/nvidia-dynamo/sglang/sglang-disaggregated-default.yaml#L82-L134';

/* First-party documentation */
const EKS_EFA = 'https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html';
const EKS_REALTIME = 'https://docs.aws.amazon.com/eks/latest/userguide/ml-realtime-inference.html';
const EKS_QUICKSTART =
  'https://docs.aws.amazon.com/eks/latest/userguide/ml-inference-load-serve-model.html';
const EKS_BP_COMPUTE = 'https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html';
const EFA_CHANGELOG = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-changelog.html';
const OFI_GIN =
  'https://github.com/aws/aws-ofi-nccl/blob/v1.22.0/doc/gin-getting-started.md#L35-L44';
const K8S_PROBES =
  'https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/';
const CUDA_NOTES = 'https://docs.nvidia.com/cuda/cuda-toolkit-release-notes/index.html';

const VLLM_EKS_LINK = <Link href="../vllm/">vLLM dive, section 24: vLLM on Amazon EKS</Link>;

/* ------------------------------------------------------------------------- */
/* Tables                                                                    */
/* ------------------------------------------------------------------------- */

interface ContainerRow {
  id: string;
  setting: string;
  value: ReactNode;
  why: ReactNode;
}

const CONTAINER_ROWS: ContainerRow[] = [
  {
    id: 'bind',
    setting: 'Bind',
    value: <code>--host 0.0.0.0</code>,
    why: (
      <>
        SGLang binds 127.0.0.1 on port 30000 by default{' '}
        <Cite tier={1} href={sglangUrl(SERVING, 'L65-L66')}>
          serving.py L65-L66
        </Cite>
        , and a Service cannot reach a loopback bind. The AWS DLC&apos;s <code>-ec2</code> image runs{' '}
        <code>python3 -m sglang.launch_server &quot;$@&quot;</code> and adds no host{' '}
        <Cite tier={1} href={DLC_ENTRY}>
          AWS DLC dockerd_entrypoint.sh L1-L6
        </Cite>
        , so the flag is yours to pass.
      </>
    ),
  },
  {
    id: 'shm',
    setting: 'Shared memory',
    value: (
      <>
        A memory-backed <code>emptyDir</code> at <code>/dev/shm</code>, counted in the pod&apos;s
        memory request
      </>
    ),
    why: (
      <>
        SGLang passes multimodal features between its processes through <code>/dev/shm</code> and
        keeps DP (data parallelism) load snapshots there{' '}
        <Cite tier={1} href={sglangUrl(MM_UTILS, 'L1467-L1480')}>
          mm_utils.py L1467-L1480
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(LOAD_SNAPSHOT, 'L295-L299')}>
          load_snapshot.py L295-L299
        </Cite>
        . When it fills, feature transport falls back to pickling with a single &quot;Consider
        increasing /dev/shm size&quot; warning. Pages written there count against the pod&apos;s
        memory. SGLang&apos;s sample caps it at 10Gi and AWS&apos;s PD sample at 64Gi{' '}
        <Cite tier={1} href={sglangUrl(K8S_SAMPLE, 'L93-L97')}>
          k8s-sglang-service.yaml L93-L97
        </Cite>{' '}
        <Cite tier={2} href={`${PD_SAMPLE}#L237-L245`}>
          AWS sample prefill.yaml L237-L245
        </Cite>
        .
      </>
    ),
  },
  {
    id: 'metrics',
    setting: 'Metrics',
    value: <code>--enable-metrics</code>,
    why: (
      <>
        <code>/metrics</code> is mounted only with this flag, which is off by default{' '}
        <Cite tier={1} href={sglangUrl(OBSERVABILITY, 'L70')}>
          observability.py L70
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L301-L304')}>
          http_server.py L301-L304
        </Cite>
        , and the Prometheus metrics the EKS overview names depend on it. Paths starting{' '}
        <code>/health</code>, <code>/ready</code> or <code>/metrics</code> need no key{' '}
        <Cite tier={1} href={sglangUrl(AUTH, 'L101-L106')}>
          auth.py L101-L106
        </Cite>
        , so probes and scrapes work on a keyed server.
      </>
    ),
  },
  {
    id: 'image',
    setting: 'Image',
    value: (
      <>
        A pinned tag: <code>lmsysorg/sglang:v0.5.22</code>, or the DLC&apos;s{' '}
        <code>0.5.22-gpu-py312-cu130-ubuntu24.04-ec2</code>
      </>
    ),
    why: (
      <>
        SGLang&apos;s sample pulls <code>lmsysorg/sglang:latest</code> with{' '}
        <code>imagePullPolicy: Always</code>{' '}
        <Cite tier={1} href={sglangUrl(K8S_SAMPLE, 'L42-L43')}>
          k8s-sglang-service.yaml L42-L43
        </Cite>
        , so a restart can pull a newer release. The sample starts the server in{' '}
        <code>command:</code>{' '}
        <Cite tier={1} href={sglangUrl(K8S_SAMPLE, 'L46-L55')}>
          k8s-sglang-service.yaml L46-L55
        </Cite>
        ; the DLC&apos;s entrypoint already runs the launcher, so it takes server flags in{' '}
        <code>args:</code>{' '}
        <Cite tier={1} href={DLC_EKS}>
          AWS DLC docs: EKS deployment
        </Cite>
        . <code>sglang serve</code> is the recommended launch command{' '}
        <Cite tier={1} href={sglangUrl('python/sglang/launch_server.py', 'L69-L76')}>
          launch_server.py L69-L76
        </Cite>
        .
      </>
    ),
  },
];

interface ProbeRow {
  id: string;
  probe: string;
  path: ReactNode;
  means: ReactNode;
  set: ReactNode;
}

const PROBE_ROWS: ProbeRow[] = [
  {
    id: 'startup',
    probe: 'Startup',
    path: <code>/health</code>,
    means: 'Weights loaded, CUDA graphs captured, warmup done, and the engine answered',
    set: (
      <>
        <code>failureThreshold</code> times <code>periodSeconds</code> above the measured cold
        start; AWS&apos;s PD sample allows 1,800 seconds
      </>
    ),
  },
  {
    id: 'liveness',
    probe: 'Liveness',
    path: <code>/health</code>,
    means: 'The engine produced output within 20 seconds',
    set: (
      <>
        <code>timeoutSeconds</code> above 1, and a failure window longer than any weight-sync
        pause
      </>
    ),
  },
  {
    id: 'readiness',
    probe: 'Readiness',
    path: <code>/ready</code>,
    means: 'Up, not paused and not shutting down; a failed /health holds it at 503',
    set: 'The Kubernetes defaults; it answers without generating',
  },
];

interface ManifestRow {
  id: string;
  source: ReactNode;
  liveness: string;
  readiness: string;
  timeout: string;
}

const MANIFEST_ROWS: ManifestRow[] = [
  {
    id: 'sglang-single',
    source: (
      <>
        SGLang single-node sample{' '}
        <Cite tier={1} href={sglangUrl(K8S_SAMPLE, 'L76-L92')}>
          k8s-sglang-service.yaml L76-L92
        </Cite>
      </>
    ),
    liveness: '/health after 120 s, every 15 s, 3 failures',
    readiness: '/health_generate after 120 s, every 15 s',
    timeout: '10 s',
  },
  {
    id: 'dlc-eks',
    source: (
      <>
        AWS DLC EKS page{' '}
        <Cite tier={1} href={DLC_EKS}>
          AWS DLC docs: EKS deployment
        </Cite>
      </>
    ),
    liveness: '/health after 120 s',
    readiness: '/health after 120 s',
    timeout: 'Not set (Kubernetes default, 1 s)',
  },
  {
    id: 'aws-pd',
    source: (
      <>
        AWS SGLang PD sample, DeepSeek-V4.1-Flash{' '}
        <Cite tier={2} href={`${PD_SAMPLE}#L215-L236`}>
          AWS sample prefill.yaml L215-L236
        </Cite>
      </>
    ),
    liveness: '/health after 1,800 s, every 60 s, 5 failures',
    readiness: '/health after 180 s, every 10 s',
    timeout: '5 s',
  },
  {
    id: 'sglang-lws',
    source: (
      <>
        SGLang LWS (LeaderWorkerSet) example, leader pod{' '}
        <Cite tier={1} href={sglangDocsSrcUrl(LWS_DOC, 'L131-L135')}>
          SGLang docs: Deploy On Kubernetes (v0.5.22 source)
        </Cite>
      </>
    ),
    liveness: 'None',
    readiness: 'TCP check on the port after 15 s, every 10 s',
    timeout: 'Not set',
  },
];

/* ------------------------------------------------------------------------- */
/* Section                                                                   */
/* ------------------------------------------------------------------------- */

export function AwsSelfManagedPaths() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Run SGLang on EKS or EC2 with the probes, devices and image each path needs, and know what you supply yourself (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            20. SGLang on EKS and EC2
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Amazon EKS (Elastic Kubernetes Service) and Amazon EC2 (Elastic Compute Cloud) are the
            two AWS paths on which you run SGLang yourself. EKS supplies scheduling, restarts and
            health probes; EC2 supplies the machine. On both, the image and the EFA (Elastic Fabric
            Adapter) stack are your choice, and the settings that decide whether a server starts and
            stays healthy live in the container: its bind address, its shared memory, its probes and
            the devices it requests.
          </Box>
          <Box variant="p">
            SGLang appears among the open-source model servers in the EKS real-time inference
            overview, while the EKS hands-on quickstart runs vLLM only{' '}
            <Cite tier={1} href={EKS_REALTIME}>
              EKS User Guide: real-time inference
            </Cite>{' '}
            <Cite tier={1} href={EKS_QUICKSTART}>
              EKS User Guide: load and serve a model
            </Cite>
            . The cluster pieces of that quickstart (Karpenter GPU node pools, device plugins,
            observability) are engine-neutral by our reading, so read them in the {VLLM_EKS_LINK}.
            What differs for SGLang is the bind address, its use of <code>/dev/shm</code> and the
            behaviour of its health endpoints.
          </Box>
          <Box variant="p">
            The figure to carry through this section is <strong>1,800 seconds</strong>. That is how
            long AWS&apos;s SGLang PD (prefill/decode) sample waits before the first liveness probe
            on a DeepSeek-V4.1-Flash engine, where SGLang&apos;s own single-node sample and the AWS
            DLC (Deep Learning Container) EKS page wait 120{' '}
            <Cite tier={2} href={`${PD_SAMPLE}#L215-L228`}>
              AWS sample prefill.yaml L215-L228
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(K8S_SAMPLE, 'L76-L92')}>
              k8s-sglang-service.yaml L76-L92
            </Cite>{' '}
            <Cite tier={1} href={DLC_EKS}>
              AWS DLC docs: EKS deployment
            </Cite>
            . Until the server has loaded its weights, captured its CUDA graphs and warmed up, every
            probe it receives fails.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Give each pod a reachable bind, memory-backed shared memory, metrics and a pinned image before any probe or device question comes up"
          >
            Configure the container every SGLang pod runs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Four settings apply to every SGLang pod on EKS, single-node or multi-node, and three of
            them replace a default that assumes one host.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={CONTAINER_ROWS}
            columnDefinitions={[
              { id: 'setting', header: 'Setting', cell: (r) => r.setting, minWidth: 110 },
              { id: 'value', header: 'What to set', cell: (r) => r.value, minWidth: 180 },
              { id: 'why', header: 'Why', cell: (r) => r.why, minWidth: 300 },
            ]}
          />
          <Box variant="p">
            Set the keys from the key matrix in section 12, Talking to SGLang, in the same change,
            since the admin routes listen on this port.
          </Box>
          <Box variant="p">
            SGLang&apos;s sample publishes the pod through a <code>type: LoadBalancer</code> Service
            on port 80{' '}
            <Cite tier={1} href={sglangUrl(K8S_SAMPLE, 'L106-L117')}>
              k8s-sglang-service.yaml L106-L117
            </Cite>
            . Whatever fronts SGLang or its gateway, whether a Service, an Ingress or a load
            balancer, keep <code>/server_info</code> and <code>/get_server_info</code> off the
            client path: section 12 reads their response as carrying both keys, and section 17, The
            Model Gateway, found that the gateway serves them outside its own key check.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Write startup, liveness and readiness probes that leave a loading server alone and restart a hung one"
          >
            Probe the engine and budget the start
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            SGLang&apos;s health check runs the engine, which makes it the right probe target and
            the reason its timing needs care. <code>/health</code> and <code>/health_generate</code>{' '}
            share one handler. It answers 503 while the server is starting or shutting down;
            otherwise it submits a one-token generation and answers 200 once the engine has
            produced any output, checking once a second, or 503 after 20 seconds without any{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L705-L783')}>
              http_server.py L705-L783
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L205-L207')}>
              http_server.py L205-L207
            </Cite>
            . SageMaker&apos;s <code>/ping</code> is a static 200 by comparison (section 19, SGLang
            on SageMaker AI and HyperPod).
          </Box>
          <Box variant="p">
            A loading server answers nothing. The HTTP server starts only after the model has loaded
            and the CUDA graphs are captured{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L1336-L1338')}>
              engine.py L1336-L1338
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L2929-L2961')}>
              http_server.py L2929-L2961
            </Cite>
            , and <code>/health</code> stays at 503 until the warmup request completes{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L715-L720')}>
              http_server.py L715-L720
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L2415-L2424')}>
              http_server.py L2415-L2424
            </Cite>
            . The start budget is download, weight load, graph capture and warmup together, and it
            belongs in a startup probe: Kubernetes runs no liveness or readiness probe until the
            startup probe succeeds, and kills the container once the startup probe fails{' '}
            <code>failureThreshold</code> times in a row{' '}
            <Cite tier={1} href={K8S_PROBES}>
              Kubernetes docs: Liveness, Readiness, and Startup Probes
            </Cite>
            . AWS&apos;s PD sample allows <strong>1,800 seconds</strong> for a model whose weights
            are pre-staged on local NVMe (Non-Volatile Memory Express) disk, and its comment names
            weight load and CUDA graph capture as what the delay clears{' '}
            <Cite tier={2} href={`${PD_SAMPLE}#L215-L228`}>
              AWS sample prefill.yaml L215-L228
            </Cite>{' '}
            <Cite tier={2} href={`${PD_SAMPLE}#L246-L257`}>
              AWS sample prefill.yaml L246-L257
            </Cite>
            . Measure your model&apos;s cold start on the instance you will run, and size{' '}
            <code>failureThreshold</code> times <code>periodSeconds</code> above it.
          </Box>
          <Box variant="p">
            Give every <code>/health</code> probe an explicit <code>timeoutSeconds</code>. The
            handler sleeps one second before its first look at the engine{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L762-L769')} kind="code">
              http_server.py L762-L769
            </Cite>
            , so a healthy answer takes at least one second, and the Kubernetes default probe timeout
            is one second{' '}
            <Cite tier={1} href={K8S_PROBES}>
              Kubernetes docs: probe configuration fields
            </Cite>
            . By our reading of the code, not run, a probe left at the default times out against a
            healthy server. SGLang&apos;s sample sets 10 seconds and AWS&apos;s PD sample 5{' '}
            <Cite tier={1} href={sglangUrl(K8S_SAMPLE, 'L76-L92')}>
              k8s-sglang-service.yaml L76-L92
            </Cite>{' '}
            <Cite tier={2} href={`${PD_SAMPLE}#L219-L236`}>
              AWS sample prefill.yaml L219-L236
            </Cite>
            ; the DLC EKS page sets none{' '}
            <Cite tier={1} href={DLC_EKS} kind="doc-code-conflict">
              AWS DLC docs: EKS deployment
            </Cite>
            .
          </Box>
          <Box variant="p">
            <code>/ready</code> is the cheap readiness check: 200 while the server is up, not paused
            and not shutting down, 503 otherwise{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L698-L702')}>
              http_server.py L698-L702
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(TOKENIZER_MGR, 'L713-L719')}>
              tokenizer_manager.py L713-L719
            </Cite>
            . It follows the engine check: a failed <code>/health</code> marks the server unhealthy,
            which holds <code>/ready</code> at 503 until a later check passes{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L762-L783')} kind="code">
              http_server.py L762-L783
            </Cite>
            . A pause for a weight update during RL (reinforcement learning) rollouts (section 13,
            SGLang as an RL Rollout Engine) also turns <code>/ready</code> to 503{' '}
            <Cite tier={1} href={sglangUrl(TOKENIZER_MGR, 'L2266-L2268')}>
              tokenizer_manager.py L2266-L2268
            </Cite>
            , so a readiness probe on <code>/ready</code> takes the pod out of its Services&apos;
            endpoints for the pause{' '}
            <Cite tier={1} href={K8S_PROBES}>
              Kubernetes docs: readiness probe
            </Cite>
            . The same pause holds the health check&apos;s request until generation resumes{' '}
            <Cite tier={1} href={sglangUrl(TOKENIZER_MGR, 'L939-L940')} kind="code">
              tokenizer_manager.py L939-L940
            </Cite>
            , so by our reading a pause longer than 20 seconds fails <code>/health</code>: keep the
            liveness failure window longer than your longest weight sync.
          </Box>
          <Box variant="p">
            To make <code>/health</code> a cheap liveness check, set{' '}
            <code>SGLANG_ENABLE_HEALTH_ENDPOINT_GENERATION=0</code>. <code>/health</code> then
            answers 200 without generating, and <code>/health_generate</code> keeps the engine check{' '}
            <Cite tier={1} href={sglangUrl(ENVIRON, 'L341')}>
              environ.py L341
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L729-L733')}>
              http_server.py L729-L733
            </Cite>
            . Point the liveness probe at <code>/health_generate</code> in that mode, or it stops
            seeing a hung engine.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            header={
              <Header variant="h3">
                A probe plan for one server, built from the handler&apos;s behaviour (our reading)
              </Header>
            }
            items={PROBE_ROWS}
            columnDefinitions={[
              { id: 'probe', header: 'Probe', cell: (r) => r.probe, minWidth: 100 },
              { id: 'path', header: 'Path', cell: (r) => r.path, minWidth: 90 },
              { id: 'means', header: 'A 200 means', cell: (r) => r.means, minWidth: 200 },
              { id: 'set', header: 'What to set', cell: (r) => r.set, minWidth: 220 },
            ]}
          />
          <ExpandableSection headerText="How the published manifests set their probes">
            <SpaceBetween size="s">
              <Box variant="p">
                None of these four manifests sets a startup probe; each covers the start with an
                initial delay instead.
              </Box>
              <Table
                variant="embedded"
                wrapLines
                trackBy="id"
                items={MANIFEST_ROWS}
                columnDefinitions={[
                  { id: 'source', header: 'Manifest', cell: (r) => r.source, minWidth: 200 },
                  { id: 'liveness', header: 'Liveness', cell: (r) => r.liveness, minWidth: 160 },
                  { id: 'readiness', header: 'Readiness', cell: (r) => r.readiness, minWidth: 160 },
                  { id: 'timeout', header: 'Timeout', cell: (r) => r.timeout, minWidth: 120 },
                ]}
              />
            </SpaceBetween>
          </ExpandableSection>

          <Header variant="h3">Probe the leader of a multi-node group</Header>
          <Box variant="p">
            A model instance spread over several nodes serves HTTP from node 0 only. Every other
            node runs its schedulers and a stub app on <code>--port</code> whose{' '}
            <code>/health</code>, <code>/health_generate</code> and <code>/ping</code> always answer
            200{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L1228-L1281')}>
              engine.py L1228-L1281
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(COMMON, 'L3678-L3702')}>
              common.py L3678-L3702
            </Cite>
            , as section 3, The SGLang Runtime, found. A probe on a worker pod therefore reports that
            the stub is up, and nothing about the model. Put the engine probes on the leader pod. By
            our reading, the leader&apos;s one-token check needs every rank of a tensor-parallel
            group that spans the nodes, so a hung worker shows up as a 503 on the leader. SGLang&apos;s
            example sets the LWS (LeaderWorkerSet) restart policy{' '}
            <code>RecreateGroupOnPodRestart</code>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(LWS_DOC, 'L76-L125')}>
              SGLang docs: Deploy On Kubernetes (v0.5.22 source)
            </Cite>
            , which restarts the whole group when any pod fails (section 18, Multi-Node and
            Kubernetes Orchestrators); by our reading, a failing leader probe then brings the
            instance back as one unit.
          </Box>
          <Box variant="p">
            That example probes the leader with a TCP check, which passes once the HTTP server
            listens and misses an engine that hangs later{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(LWS_DOC, 'L131-L135')}>
              SGLang docs: Deploy On Kubernetes, leader probe
            </Cite>
            ; the <code>/health</code> probes above catch both. If you add a probe to a worker pod
            anyway, pass <code>--host 0.0.0.0</code> to that worker too: the stub binds the{' '}
            <code>--host</code> value{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L1275-L1279')}>
              engine.py L1275-L1279
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(COMMON, 'L3709-L3712')}>
              common.py L3709-L3712
            </Cite>
            , Kubernetes sends HTTP probes to the pod IP{' '}
            <Cite tier={1} href={K8S_PROBES}>
              Kubernetes docs: HTTP probes
            </Cite>
            , and the example passes the flag to the leader only{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(LWS_DOC, 'L166-L186')}>
              SGLang docs: Deploy On Kubernetes, worker command
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Ask the scheduler for the three resources an EFA pod needs, and run an image that can use them"
          >
            Request EFA devices and hugepages for PD and multi-node pods
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A single-node server needs no device beyond <code>nvidia.com/gpu</code> and runs the
            upstream image unchanged{' '}
            <Cite tier={2} href={`${ADAI_README}#L35-L47`}>
              AWS sample README L35-L47
            </Cite>
            . A pod that moves KV (key-value) cache between PD roles, or runs NCCL (NVIDIA
            Collective Communications Library) traffic across nodes, over EFA asks for three
            extended resources: GPUs, <code>vpc.amazonaws.com/efa</code> devices and{' '}
            <code>hugepages-2Mi</code>. EFA requires hugepages: instances with the EFA driver
            installed pre-allocate 5128 pages of 2 MiB, which pods request as{' '}
            <code>hugepages-2Mi</code>{' '}
            <Cite tier={1} href={EKS_EFA}>
              EKS User Guide: Manage EFA devices on Amazon EKS
            </Cite>
            . The NCCL-test pod on that page claims all 32 EFA devices of a p5.48xlarge:
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
            <code>{`resources:
  limits:
    nvidia.com/gpu: 8
    hugepages-2Mi: 5120Mi
    vpc.amazonaws.com/efa: 32
    memory: 32000Mi
  requests:
    nvidia.com/gpu: 8
    hugepages-2Mi: 5120Mi
    vpc.amazonaws.com/efa: 32
    memory: 32000Mi`}</code>
          </pre>
          <Box variant="small">
            Resource block of the NCCL-test pod on the EKS EFA page, as published. Size memory for
            SGLang yourself, including <code>/dev/shm</code>.
          </Box>
          <Box variant="p">
            On the EKS-optimized AL2023 (Amazon Linux 2023) accelerated AMIs (Amazon Machine
            Images), the device plugin aligns the allocated EFA devices with their topologically
            local GPUs{' '}
            <Cite tier={1} href={EKS_EFA}>
              EKS User Guide: Manage EFA devices on Amazon EKS
            </Cite>
            . The pod does not need privileged mode for EFA: AWS&apos;s SGLang PD sample adds only
            the <code>IPC_LOCK</code> capability, so libfabric can pin memory for GPUDirect RDMA
            (remote direct memory access){' '}
            <Cite tier={2} href={`${PD_SAMPLE}#L101-L106`}>
              AWS sample prefill.yaml L101-L106
            </Cite>
            . For new deployments on Kubernetes 1.34 and later with Karpenter, managed node groups
            or self-managed nodes, AWS recommends the EFA DRA (Dynamic Resource Allocation) driver,
            with a ResourceClaimTemplate in place of the extended resource{' '}
            <Cite tier={1} href={EKS_EFA}>
              EKS User Guide: EFA DRA driver vs. EFA device plugin
            </Cite>
            ; the SGLang manifests cited in this section use the device plugin.
          </Box>
          <Box variant="p">
            AWS&apos;s SGLang PD sample for p6-b200 and p6-b300 nodes shows the rest of an EFA pod{' '}
            <Cite tier={2} href={`${PD_SAMPLE}#L98-L245`}>
              AWS sample prefill.yaml L98-L245
            </Cite>
            . It requests two EFA devices per two-GPU engine pod and sets{' '}
            <code>SGLANG_HOST_IP</code> from <code>status.podIP</code>, so prefill advertises the
            pod&apos;s address for the KV bootstrap; SGLang reads that variable before it looks at
            any interface{' '}
            <Cite tier={1} href={sglangUrl(NETWORK, 'L383-L386')}>
              network.py L383-L386
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(PD_CONN, 'L333')}>
              disaggregation/common/conn.py L333
            </Cite>
            . The NIXL (NVIDIA Inference Xfer Library) and libfabric variables it sets are section
            22&apos;s subject. It requests no hugepages, while the EKS EFA page says EFA requires
            them, and which of the two SGLang needs was not tested. Request them as the EKS page
            does.
          </Box>
          <Box variant="p">
            To spread one instance over nodes, keep the LeaderWorkerSet shape from SGLang&apos;s
            documentation (section 18). Its example runs host networking and privileged pods for
            RDMA, and lists both as remaining issues{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(LWS_DOC, 'L83-L97')}>
              SGLang docs: Deploy On Kubernetes, leader template
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(LWS_DOC, 'L333-L336')}>
              SGLang docs: Deploy On Kubernetes, remaining issues
            </Cite>
            . On EKS, swap them for <code>vpc.amazonaws.com/efa</code>, <code>hugepages-2Mi</code>{' '}
            and <code>IPC_LOCK</code>, as the EKS EFA page and AWS&apos;s sample do. Whether
            multi-node tensor parallelism over NCCL runs without host networking on EKS was not
            tested here; the EKS page&apos;s NCCL-test example does not set it.
          </Box>
          <Box variant="p">
            Run an EFA-ready image for these pods. The upstream <code>lmsysorg/sglang</code> image
            cannot move KV over EFA on its own, so AWS&apos;s samples layer the EFA installer onto it{' '}
            <Cite tier={2} href={`${ADAI_README}#L35-L47`}>
              AWS sample README L35-L47
            </Cite>
            . The AWS DLC <code>0.5.22-gpu-py312-cu130-ubuntu24.04-ec2</code> is the upstream
            v0.5.22 image plus the EFA installer and AWS patches{' '}
            <Cite tier={1} href={`${DLC_DOCKERFILE}#L1-L13`}>
              AWS DLC Dockerfile L1-L13
            </Cite>{' '}
            <Cite tier={1} href={DLC_GALLERY}>
              AWS public image gallery: deep-learning-containers/sglang
            </Cite>
            . Section 21, EC2 Instances, Images and GPU-Dependent Behaviour, picks the image line for
            each instance family, and section 22 picks the KV transfer stack.
          </Box>
          <ExpandableSection headerText="What AWS publishes for SGLang on EKS">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>EKS documentation.</strong> On the pages read for this research, SGLang
                appears only in the real-time inference overview. The quickstart is vLLM only, and
                the EKS Best Practices AI/ML pages for compute, networking and performance do not
                name it{' '}
                <Cite tier={1} href={EKS_QUICKSTART}>
                  EKS User Guide: load and serve a model
                </Cite>{' '}
                <Cite tier={1} href={EKS_BP_COMPUTE}>
                  EKS Best Practices: AI/ML compute
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>AI on EKS.</strong> No standalone SGLang blueprint at the commit read. Its
                SGLang path runs
                NVIDIA Dynamo&apos;s <code>sglang-runtime:0.5.0</code> image on A10G nodes from a{' '}
                <code>g5-gpu-karpenter</code> node pool, with no EFA resources, so it shows the
                Dynamo wiring rather than a production PD layout{' '}
                <Cite tier={2} href={AI_ON_EKS}>
                  ai-on-eks sglang-disaggregated-default.yaml L82-L134
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>awsome-distributed-ai.</strong> The most complete AWS-authored SGLang
                material found: six samples, five as EKS or HyperPod manifests and one as an EC2
                Docker recipe. Three run on <code>lmsysorg/sglang:v0.5.12.post1-cu130</code> (one
                with an EFA layer added), ten releases behind v0.5.22, one on a custom 0.5.13.post1
                build and two on development images pinned by digest{' '}
                <Cite tier={2} href={`${ADAI_README}#L6-L29`}>
                  AWS sample README L6-L29
                </Cite>
                . Every serving pod starts with <code>--enable-metrics</code>{' '}
                <Cite tier={2} href={`${ADAI_README}#L67-L69`}>
                  AWS sample README L67-L69
                </Cite>
                . Reuse the manifest shapes and re-pin the image to v0.5.22.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Assemble what an EC2 host leaves to you, then give your own supervisor the same health contract as an EKS probe"
          >
            On EC2, bring the image, driver, EFA and supervision
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An EC2 instance arrives with GPUs and nothing that knows about SGLang. Five pieces are
            yours.
          </Box>
          <Box variant="p">
            <strong>The image.</strong> <code>lmsysorg/sglang:v0.5.22</code> is a CUDA 13.0 image
            for amd64 and arm64, and the release workflow publishes no CUDA 12 tag{' '}
            <Cite tier={1} href={sglangUrl('.github/workflows/release-docker.yml', 'L52')}>
              release-docker.yml L52
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl('.github/workflows/_docker-build-and-publish.yml', 'L117')}>
              _docker-build-and-publish.yml L117
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl('.github/workflows/_docker-build-and-publish.yml', 'L196')}>
              _docker-build-and-publish.yml L196
            </Cite>
            . The AWS DLC <code>-ec2</code> tag is that image plus the EFA installer, built for
            amd64 only{' '}
            <Cite tier={1} href={`${DLC_DOCKERFILE}#L148-L161`}>
              AWS DLC Dockerfile L148-L161
            </Cite>{' '}
            <Cite tier={1} href={DLC_GALLERY}>
              AWS public image gallery: deep-learning-containers/sglang
            </Cite>
            . Section 21 picks between them by instance family.
          </Box>
          <Box variant="p">
            <strong>The driver.</strong> CUDA 13 images need an NVIDIA driver from the 580 branch or
            later on the host{' '}
            <Cite tier={1} href={CUDA_NOTES}>
              NVIDIA CUDA Toolkit release notes: driver branch table
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>The container flags.</strong> Run the container with{' '}
            <code>--shm-size 32g --ipc=host</code>, as SGLang&apos;s install guide does{' '}
            <Cite tier={1} href={sglangDocsSrcUrl('get-started/install', 'L50-L56')}>
              SGLang docs: Install (v0.5.22 source)
            </Cite>
            , and pass <code>--host 0.0.0.0</code> to the server, as the DLC&apos;s EC2 page does,
            because its entrypoint hands your flags to <code>python3 -m sglang.launch_server</code>{' '}
            unchanged{' '}
            <Cite tier={1} href={DLC_EC2}>
              AWS DLC docs: EC2 deployment
            </Cite>{' '}
            <Cite tier={1} href={DLC_ENTRY}>
              AWS DLC dockerd_entrypoint.sh L1-L6
            </Cite>
            . On a host without a container, the default 127.0.0.1 bind keeps an unkeyed admin plane
            local; set the keys from section 12 before you bind 0.0.0.0.
          </Box>
          <Box variant="p">
            <strong>
              EFA, for PD or wide EP (expert parallelism across nodes; section 16, Wide Expert
              Parallelism).
            </strong>{' '}
            The upstream image cannot move KV over EFA on its own, so add the EFA installer or use
            the DLC{' '}
            <Cite tier={2} href={`${ADAI_README}#L35-L47`}>
              AWS sample README L35-L47
            </Cite>
            . GPU-initiated NCCL traffic over EFA, which DeepEP V2&apos;s expert all-to-all uses
            (section 22), needs P5en, P6-B200 or P6-B300 and EFA installer 1.50.0 or later{' '}
            <Cite tier={1} href={OFI_GIN}>
              aws-ofi-nccl v1.22.0: GIN getting started
            </Cite>
            . Installer 1.50.0 (2026-08-21) brings aws-ofi-nccl 1.21.1, and 1.51.0 (2026-10-22)
            brings libfabric 2.7.0amzn2.0 and aws-ofi-nccl 1.22.0{' '}
            <Cite tier={1} href={EFA_CHANGELOG}>
              EC2 User Guide: EFA software changelog
            </Cite>
            . The Ubuntu DLC installs whichever installer is latest when the image is built{' '}
            <Cite tier={1} href={`${DLC_DOCKERFILE}#L13`}>
              AWS DLC Dockerfile L13
            </Cite>{' '}
            <Cite tier={1} href={`${DLC_DOCKERFILE}#L70-L73`}>
              AWS DLC Dockerfile L70-L73
            </Cite>
            . Section 22 brings up each stack with its check.
          </Box>
          <Box variant="p">
            <strong>Supervision.</strong> The DLC&apos;s EC2 entrypoint is a single launcher call{' '}
            <Cite tier={1} href={DLC_ENTRY}>
              AWS DLC dockerd_entrypoint.sh L1-L6
            </Cite>
            , so by our reading restarting a server that exits or hangs is your process
            supervisor&apos;s job, and routing around one is your load balancer&apos;s. Give their
            health checks the EKS probe contract: <code>/health</code>, a timeout above one second,
            and a start allowance that covers load, graph capture and warmup. Keep{' '}
            <code>/server_info</code> and <code>/get_server_info</code> off the client path of any
            load balancer in front of SGLang, as on EKS.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Finish the path you picked with the settings that decide whether the server starts, then choose the instance"
          >
            Your next step on each path
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>On EKS,</strong> write the probes first: a startup probe sized above your
            model&apos;s measured cold start (AWS&apos;s PD sample allows{' '}
            <strong>1,800 seconds</strong>), a <code>timeoutSeconds</code> above one second on
            every <code>/health</code> probe, readiness on <code>/ready</code>, and engine probes on
            the leader of a multi-node group. For PD or multi-node, add{' '}
            <code>vpc.amazonaws.com/efa</code>, <code>hugepages-2Mi</code>, <code>IPC_LOCK</code>{' '}
            and an EFA-ready image. Then pick the instance family in section 21, EC2 Instances,
            Images and GPU-Dependent Behaviour.
          </Box>
          <Box variant="p">
            <strong>On EC2,</strong> pick the image and instance in section 21, check that the host
            driver is from the 580 branch or later, and for PD or wide EP bring up EFA with section
            22, PD and Wide EP over EFA.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
