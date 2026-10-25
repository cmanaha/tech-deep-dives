import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangTreeUrl, sglangDocsSrcUrl } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Source paths, all pinned through the Cite helpers to v0.5.22             */
/* ------------------------------------------------------------------------ */

const SRT = 'python/sglang/srt';
const MOB = `${SRT}/arg_groups/model_override_base.py`;
const OVR = `${SRT}/arg_groups/overrides.py`;
const COMMON = `${SRT}/utils/common.py`;
const SPEC_HOOK = `${SRT}/arg_groups/speculative_hook.py`;
const KV_CONF = `${SRT}/mem_cache/kv_cache_configurator.py`;
const ADAPT = `${SRT}/speculative/adaptive_spec_params.py`;
const RADIX = `${SRT}/mem_cache/radix_cache.py`;
const MEM_FIELDS = `${SRT}/arg_groups/fields/memory.py`;
const SCHED_FIELDS = `${SRT}/arg_groups/fields/schedule.py`;
const POLICY = `${SRT}/managers/schedule_policy.py`;
const METRICS_REPORTER = `${SRT}/managers/scheduler_components/metrics_reporter.py`;
const HICACHE_HOOK = `${SRT}/arg_groups/hicache_hook.py`;
const AUTO_SIZE = `${SRT}/mem_cache/hicache_auto_size.py`;
const TREE_CORE = `${SRT}/mem_cache/unified_cache/unified_tree_core.py`;
const DG = `${SRT}/layers/deep_gemm_wrapper/compile_utils.py`;
const PREFILL = `${SRT}/disaggregation/prefill.py`;
const DISAGG_FIELDS = `${SRT}/arg_groups/fields/disagg.py`;
const HTTP = `${SRT}/entrypoints/http_server.py`;
const AUTH = `${SRT}/utils/auth.py`;
const OBS_FIELDS = `${SRT}/arg_groups/fields/observability.py`;
const SERVING_HOOK = `${SRT}/arg_groups/serving_hook.py`;
const SCHEMA_CHECK = `${SRT}/constrained/json_schema_validation.py`;
const GRAMMAR_BASE = `${SRT}/constrained/base_grammar_backend.py`;
const CHOICES = `${SRT}/arg_groups/choices.py`;
const GW = 'sgl-model-gateway/src';
const AB_DOC = 'advanced_features/attention_backend';

const VLLM_TAG = 'v0.31.0';
function vllmUrl(path: string, lines?: string): string {
  const base = `https://github.com/vllm-project/vllm/blob/${VLLM_TAG}/${path}`;
  return lines ? `${base}#${lines}` : base;
}

const EC2_SPECS = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';
const AWS_SM = 'https://docs.aws.amazon.com/sagemaker/latest/dg';
const SM_CONTRACT = `${AWS_SM}/your-algorithms-inference-code.html`;
const HP_GATEWAY = `${AWS_SM}/sagemaker-hyperpod-model-deployment-inference-gateway.html`;
const HP_DPD = `${AWS_SM}/sagemaker-hyperpod-model-deployment-dpd.html`;
const BEDROCK_IMPORT =
  'https://docs.aws.amazon.com/bedrock/latest/userguide/model-customization-import-model.html';
const ECR_GALLERY = 'https://gallery.ecr.aws/deep-learning-containers/sglang';
const DLC_ENTRYPOINT =
  'https://github.com/aws/deep-learning-containers/blob/23970abd5b8919ea3e1add74692a0d056b2fcbd9/scripts/docker/sglang/sagemaker_entrypoint.sh#L12-L50';
const LLMD_SGLANG =
  'https://github.com/llm-d/llm-d/blob/v1.0.0/guides/recipes/modelserver/components/images/gpu-sglang/release/kustomization.yaml#L4-L6';
const DYNAMO_PYPROJECT = 'https://github.com/ai-dynamo/dynamo/blob/v1.6.0/pyproject.toml#L76-L78';
const RAY_SGLANG_DOC =
  'https://github.com/ray-project/ray/blob/ray-2.59.0/doc/source/serve/llm/user-guides/sglang.md#L27';
const KSERVE_TREE = 'https://github.com/kserve/kserve/tree/v0.21.0';
const LMSYS_EP = 'https://lmsys.org/blog/2025-05-05-large-scale-ep/';

const V10_LINK = <Link href="../vllm/">vLLM dive, section 10: Disaggregated Prefill / Decode</Link>;
const V16_LINK = (
  <Link href="../vllm/">vLLM dive, section 16: Kubernetes: Production-Stack &amp; Router</Link>
);
const V21_LINK = <Link href="../vllm/">vLLM dive, section 21: vLLM on AWS Neuron</Link>;
const V24_LINK = <Link href="../vllm/">vLLM dive, section 24: vLLM on Amazon EKS</Link>;
const V25_LINK = <Link href="../vllm/">vLLM dive, section 25: vLLM on SageMaker &amp; vs Bedrock</Link>;
const V28_LINK = <Link href="../vllm/">vLLM dive, section 28: Decision Guide</Link>;

/* ------------------------------------------------------------------------ */
/* Diagram: the decision tree                                               */
/* ------------------------------------------------------------------------ */

function DecisionTreeDiagram() {
  const leaves = [
    { x: 15, title: 'Shared prefixes', lines: ['shortlist SGLang,', 'then measure both', 'P6 pages: 64 tokens'], sec: 'sections 5, 6, 21' },
    { x: 189, title: 'Structured output', lines: ['no reason to pick', 'either engine;', 'test your schemas'], sec: 'section 10' },
    { x: 363, title: 'Wide-EP MoE', lines: ['decide on operations:', 'widths, PD stack,', 'model recipes'], sec: 'sections 14, 16, 22' },
    { x: 537, title: 'PD at scale', lines: ['all parts in SGLang;', "HyperPod's native PD", 'documents vLLM only'], sec: 'sections 15, 19, 22' },
    { x: 711, title: 'API needs', lines: ['Ollama, /generate:', 'SGLang; Cohere chat:', 'vLLM; OpenAI: both'], sec: 'sections 12, 13' },
  ];
  const w = 154;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 880 474"
        role="img"
        aria-labelledby="decision-tree-title"
        aria-describedby="decision-tree-desc"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="decision-tree-title">
          SGLang decision tree at v0.5.22. Hardware comes first: Trainium, Inferentia or any
          accelerator SGLang does not run sends the workload to the engine that covers it, vLLM
          with its Neuron plugin on AWS. A platform or orchestrator already chosen means checking
          which SGLang release it installs. The workload's shape then picks the branches, each
          pointing to the sections that carry its evidence, and every branch ends in measuring both
          engines on your own traffic before turning features on in order of moving parts.
        </title>
        <desc id="decision-tree-desc">
          Three questions run down the left: does SGLang run on all your hardware, is a platform
          or orchestrator already chosen, and what shape is the workload. The third fans out to
          five branches: shared prefixes, structured output, wide-EP MoE, PD at scale and API
          needs. All five converge on measuring both engines at matched settings, then the
          first-week feature order.
        </desc>
        <style>
          {`
            .decision-tree-q { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
            .decision-tree-stop { fill: #fdf3ec; stroke: #ec7211; stroke-width: 1.5; }
            .decision-tree-check { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
            .decision-tree-leaf { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
            .decision-tree-end { fill: #f2f8fd; stroke: #065299; stroke-width: 1.5; }
            .decision-tree-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
            .decision-tree-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
            .decision-tree-sec { fill: #0f1b2a; font: 600 11px sans-serif; text-anchor: middle; }
            .decision-tree-edge { stroke: #879596; stroke-width: 1.5; fill: none; marker-end: url(#decision-tree-ah); }
            .decision-tree-bus { stroke: #879596; stroke-width: 1.5; fill: none; }
            .decision-tree-el { fill: #5f6b7a; font: 600 11px sans-serif; }
          `}
        </style>
        <defs>
          <marker
            id="decision-tree-ah"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#879596" />
          </marker>
        </defs>
        <rect x={0} y={0} width={880} height={474} rx={8} fill="#ffffff" />

        {/* Question 1: hardware */}
        <rect className="decision-tree-q" x={170} y={12} width={340} height={56} rx={8} />
        <text className="decision-tree-t" x={340} y={35}>Does SGLang run on all your hardware?</text>
        <text className="decision-tree-s" x={340} y={53}>Trainium, Inferentia or a mixed fleet</text>
        <path className="decision-tree-edge" d="M510,40 L552,40" />
        <text className="decision-tree-el" x={531} y={32} textAnchor="middle">no</text>
        <rect className="decision-tree-stop" x={554} y={12} width={308} height={68} rx={8} />
        <text className="decision-tree-t" x={708} y={35}>Use the engine that covers it</text>
        <text className="decision-tree-s" x={708} y={53}>Trainium, Inferentia: vLLM Neuron</text>
        <text className="decision-tree-sec" x={708} y={69}>sections 8 and 19</text>

        {/* Question 2: platform */}
        <path className="decision-tree-edge" d="M340,68 L340,98" />
        <text className="decision-tree-el" x={348} y={87}>yes</text>
        <rect className="decision-tree-q" x={170} y={100} width={340} height={56} rx={8} />
        <text className="decision-tree-t" x={340} y={123}>Platform or orchestrator chosen?</text>
        <text className="decision-tree-s" x={340} y={141}>SageMaker, HyperPod, llm-d, Dynamo, Ray</text>
        <path className="decision-tree-edge" d="M510,128 L552,128" />
        <text className="decision-tree-el" x={531} y={120} textAnchor="middle">yes</text>
        <rect className="decision-tree-check" x={554} y={100} width={308} height={68} rx={8} />
        <text className="decision-tree-t" x={708} y={123}>Check the SGLang it installs</text>
        <text className="decision-tree-s" x={708} y={141}>llm-d v1.0.0 installs v0.5.22</text>
        <text className="decision-tree-sec" x={708} y={157}>sections 18 and 19</text>
        <path className="decision-tree-edge" d="M708,168 L708,216 L512,216" />
        <text className="decision-tree-el" x={716} y={196}>then continue</text>

        {/* Question 3: workload shape */}
        <path className="decision-tree-edge" d="M340,156 L340,186" />
        <text className="decision-tree-el" x={348} y={175}>no</text>
        <rect className="decision-tree-q" x={170} y={188} width={340} height={56} rx={8} />
        <text className="decision-tree-t" x={340} y={211}>What shape is the workload?</text>
        <text className="decision-tree-s" x={340} y={229}>follow every branch that applies</text>

        {/* Fan-out bus */}
        <path className="decision-tree-bus" d="M340,244 L340,258 M92,258 L788,258" />
        {leaves.map((l) => (
          <path key={`drop-${l.x}`} className="decision-tree-edge" d={`M${l.x + w / 2},258 L${l.x + w / 2},280`} />
        ))}

        {/* Workload branches */}
        {leaves.map((l) => {
          const cx = l.x + w / 2;
          return (
            <g key={l.title}>
              <rect className="decision-tree-leaf" x={l.x} y={282} width={w} height={100} rx={8} />
              <text className="decision-tree-t" x={cx} y={305}>{l.title}</text>
              {l.lines.map((line, i) => (
                <text key={line} className="decision-tree-s" x={cx} y={323 + 15 * i}>
                  {line}
                </text>
              ))}
              <text className="decision-tree-sec" x={cx} y={371}>{l.sec}</text>
            </g>
          );
        })}

        {/* Converge */}
        <path
          className="decision-tree-bus"
          d={`${leaves.map((l) => `M${l.x + w / 2},382 L${l.x + w / 2},396`).join(' ')} M92,396 L788,396`}
        />
        <path className="decision-tree-edge" d="M240,396 L240,408" />
        <rect className="decision-tree-end" x={40} y={410} width={400} height={52} rx={8} />
        <text className="decision-tree-t" x={240} y={432}>Measure both engines on your traffic</text>
        <text className="decision-tree-s" x={240} y={450}>matched settings, the versions you run, section 23</text>
        <path className="decision-tree-edge" d="M440,436 L478,436" />
        <rect className="decision-tree-end" x={480} y={410} width={360} height={52} rx={8} />
        <text className="decision-tree-t" x={660} y={432}>Then turn features on</text>
        <text className="decision-tree-s" x={660} y={450}>in order of moving parts (first-week order)</text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* The branches, with their evidence                                        */
/* ------------------------------------------------------------------------ */

interface BranchRow {
  id: string;
  branch: string;
  guidance: ReactNode;
  where: ReactNode;
}

const BRANCH_ROWS: BranchRow[] = [
  {
    id: 'hardware',
    branch: 'Hardware',
    guidance: (
      <>
        SGLang v0.5.22 has no Trainium or Inferentia support; its README lists AWS Trainium under
        integrations in progress{' '}
        <Cite tier={1} href={sglangUrl('README.md', 'L58')}>
          README.md L58
        </Cite>
        . Serve Trainium and Inferentia with vLLM and its Neuron plugin ({V21_LINK}). On EC2
        (Elastic Compute Cloud), SGLang&apos;s path is NVIDIA GPUs: its ROCm images build for AMD
        Instinct, and the EC2 accelerated-computing spec page read for this dive lists no AMD
        Instinct instance{' '}
        <Cite tier={1} href={sglangUrl('.github/workflows/release-docker-amd.yml', 'L33')}>
          release-docker-amd.yml L33
        </Cite>{' '}
        <Cite tier={1} href={EC2_SPECS}>
          Amazon EC2 accelerated computing instance specifications
        </Cite>
        . For a mixed fleet, pick the engine whose hardware list covers all of it.
      </>
    ),
    where: (
      <>
        Section 8, Attention Backends and Kernels; section 19, SGLang on SageMaker AI and HyperPod
      </>
    ),
  },
  {
    id: 'platform',
    branch: 'Platform or orchestrator already chosen',
    guidance: (
      <>
        Check which SGLang release it installs before you rely on a v0.5.22 behaviour. llm-d v1.0.0
        installs v0.5.22{' '}
        <Cite tier={1} href={LLMD_SGLANG}>
          llm-d gpu-sglang release L4-L6
        </Cite>
        , NVIDIA Dynamo v1.6.0 installs 0.5.21{' '}
        <Cite tier={1} href={DYNAMO_PYPROJECT}>
          Dynamo pyproject.toml L76-L78
        </Cite>
        , Ray 2.59.0&apos;s guide installs whatever pip resolves{' '}
        <Cite tier={1} href={RAY_SGLANG_DOC}>
          Ray sglang.md L27
        </Cite>
        , and KServe v0.21.0 ships no SGLang runtime{' '}
        <Cite tier={1} href={KSERVE_TREE} kind="code">
          kserve tree at v0.21.0
        </Cite>
        ; production-stack serves vLLM ({V16_LINK}). On AWS, Bedrock&apos;s Custom Model Import
        takes model files with no engine choice{' '}
        <Cite tier={1} href={BEDROCK_IMPORT}>
          Bedrock docs: import a customized model
        </Cite>
        , AWS publishes SGLang DLCs (Deep Learning Containers) for SageMaker AI{' '}
        <Cite tier={1} href={ECR_GALLERY}>
          AWS public container gallery: SGLang DLC
        </Cite>
        , and the HyperPod Inference Gateway scores SGLang pods once <code>engineType</code> is{' '}
        <code>sglang</code> and the server runs with <code>--enable-metrics</code>{' '}
        <Cite tier={1} href={HP_GATEWAY}>
          HyperPod docs: Inference Gateway
        </Cite>
        .
      </>
    ),
    where: (
      <>
        Section 18, Multi-Node and Kubernetes Orchestrators; section 19, SGLang on SageMaker AI and
        HyperPod; section 20, SGLang on EKS (Elastic Kubernetes Service) and EC2
      </>
    ),
  },
  {
    id: 'prefix',
    branch: 'Shared prefixes: system prompts, few-shot templates, multi-turn chat, agent loops',
    guidance: (
      <>
        Shortlist SGLang and measure both engines. For a dense Llama-style model, the P5 family
        (H100, H200) reuses a shared prefix to the exact token and P6 (B200, B300) in 64-token
        pages, when speculative decoding is off or on with an explicit{' '}
        <code>--speculative-eagle-topk 1</code> and <code>--speculative-num-steps</code> set{' '}
        <Cite tier={1} href={sglangUrl(MOB, 'L293-L315')} kind="code">
          model_override_base.py L293-L315
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(OVR, 'L1124-L1137')} kind="code">
          overrides.py L1124-L1137
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(SPEC_HOOK, 'L1068-L1072')} kind="code">
          speculative_hook.py L1068-L1072
        </Cite>
        ; vLLM uses 16-token blocks on both{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L333-L334')}>
          vLLM cache.py L333-L334
        </Cite>
        . SGLang also offers five eviction policies{' '}
        <Cite tier={1} href={sglangUrl(MEM_FIELDS, 'L25-L42')}>
          memory.py L25-L42
        </Cite>
        , cache-aware queue ordering on request (the default is FCFS, first-come-first-served){' '}
        <Cite tier={1} href={sglangUrl(SCHED_FIELDS, 'L82-L98')}>
          schedule.py L82-L98
        </Cite>
        , a gateway that routes <code>cache_aware</code> by default{' '}
        <Cite tier={1} href={sglangUrl(`${GW}/main.rs`, 'L150-L151')}>
          main.rs L150-L151
        </Cite>{' '}
        and HiCache inside the tree (section 7). vLLM caches prefixes by default too{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L142')}>
          vLLM cache.py L142
        </Cite>
        . What any of this is worth
        depends on your hit rate and prefix lengths; no current-version measurement was located
        during this research.
      </>
    ),
    where: (
      <>
        Section 5, RadixAttention and the Radix Cache; section 6, KV Memory and the Defaults Your GPU Picks;
        section 7, HiCache: GPU, Host and Storage; section 17, The Model Gateway; section 21, EC2
        Instances, Images and GPU-Dependent Behaviour
      </>
    ),
  },
  {
    id: 'structured',
    branch: 'Structured output: JSON schema, regex, EBNF (Extended Backus-Naur Form)',
    guidance: (
      <>
        No reason to pick either engine at these versions: both mask with XGrammar first, and
        SGLang&apos;s jump-forward code is dormant at v0.5.22{' '}
        <Cite tier={1} href={sglangUrl(SERVING_HOOK, 'L232-L237')}>
          serving_hook.py L232-L237
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(GRAMMAR_BASE, 'L119-L145')} kind="code">
          base_grammar_backend.py L119-L145
        </Cite>
        . The difference is fallback. vLLM&apos;s <code>auto</code> backend falls back per request{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/structured_outputs.py', 'L21')}>
          vLLM structured_outputs.py L21
        </Cite>
        ; SGLang runs one backend for every request and answers a schema XGrammar rejects with a
        400{' '}
        <Cite tier={1} href={sglangUrl(SCHEMA_CHECK, 'L167-L201')} kind="code">
          json_schema_validation.py L167-L201
        </Cite>
        , until the server runs with <code>--grammar-backend llguidance</code>{' '}
        <Cite tier={1} href={sglangUrl(CHOICES, 'L131')}>
          choices.py L131
        </Cite>
        . SGLang takes <code>regex</code> and <code>ebnf</code> as top-level request fields{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/entrypoints/openai/protocol.py`, 'L1161-L1189')}>
          protocol.py L1161-L1189
        </Cite>
        , where vLLM nests them under <code>structured_outputs</code>, so client code needs a port.
        Send your production schemas through both.
      </>
    ),
    where: <>Section 10, Structured Output</>,
  },
  {
    id: 'wide-ep',
    branch: 'Wide-EP MoE: DeepSeek-class models across many GPUs',
    guidance: (
      <>
        Both engines run DeepEP-class all-to-all, an expert-parallel load balancer and elastic EP{' '}
        <Cite tier={1} href={sglangTreeUrl(`${SRT}/elastic_ep`)}>
          elastic_ep/
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('vllm/entrypoints/launchers/api_server/routers.py', 'L38-L50')}>
          vLLM routers.py L38-L50
        </Cite>
        , so decide on operations (section 23 lists the shared mechanisms). Widths are counted differently: SGLang&apos;s{' '}
        <code>--attn-dp-size</code> sits inside the TP (tensor parallelism) group, where vLLM
        counts <code>--data-parallel-size</code> replicas and shards experts over TP x PCP
        (prefill context parallelism) x DP (data parallelism){' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/runtime_context.py`, 'L73-L87')}>
          runtime_context.py L73-L87
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/parallel.py', 'L134-L136')}>
          vLLM parallel.py L134-L136
        </Cite>
        . Weigh the PD and routing stack you will run (next row) and which engine the model
        publisher documents a recipe for. LMSYS (Large Model Systems Organization) reports its
        96-H100 wide-EP results for an older SGLang release{' '}
        <Cite tier={2} href={LMSYS_EP}>
          LMSYS blog, 2025-05-05 (project claim)
        </Cite>
        .
      </>
    ),
    where: (
      <>
        Section 14, Parallelism: TP, DP Attention and EP; section 16, Wide Expert Parallelism;
        section 22, PD and Wide EP over EFA (Elastic Fabric Adapter)
      </>
    ),
  },
  {
    id: 'pd',
    branch: 'PD disaggregation at scale',
    guidance: (
      <>
        SGLang gives PD from one project: a mode of the same server{' '}
        <Cite tier={1} href={sglangUrl(DISAGG_FIELDS, 'L55-L58')}>
          disagg.py L55-L58
        </Cite>
        , a push into pages decode reserved, a bootstrap server on each prefill server and a
        gateway that pairs both legs. vLLM picks a KV connector and takes pairing from a proxy,
        llm-d or Dynamo ({V10_LINK}). Size the decode pool first: under the default{' '}
        <code>early</code> policy, decode capacity gates prefill admission{' '}
        <Cite tier={1} href={sglangUrl(PREFILL, 'L462-L537')}>
          prefill.py L462-L537
        </Cite>
        . HyperPod&apos;s built-in disaggregated prefill/decode is documented with vLLM worker
        images only{' '}
        <Cite tier={1} href={HP_DPD}>
          HyperPod docs: disaggregated prefill/decode
        </Cite>
        , so SGLang PD on HyperPod runs as ordinary Kubernetes workloads.
      </>
    ),
    where: (
      <>
        Section 15, PD Disaggregation; section 19, SGLang on SageMaker AI and HyperPod; section 22,
        PD and Wide EP over EFA
      </>
    ),
  },
  {
    id: 'api',
    branch: 'API needs',
    guidance: (
      <>
        Ollama clients and the native text-in <code>/generate</code> are SGLang only{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L911-L975')}>
          http_server.py L911-L975
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(HTTP, 'L2064-L2087')}>
          http_server.py L2064-L2087
        </Cite>
        ; Cohere chat is vLLM only{' '}
        <Cite tier={1} href={vllmUrl('vllm/entrypoints/cohere/api_router.py', 'L116-L117')}>
          vLLM cohere/api_router.py L116-L117
        </Cite>
        ; OpenAI, Anthropic Messages and the SageMaker contract work on both. For RL
        (reinforcement learning) rollouts both expose weight sync: SGLang&apos;s Python frontend
        registers it on every server behind an optional key{' '}
        <Cite tier={1} href={sglangUrl(AUTH, 'L79-L151')}>
          auth.py L79-L151
        </Cite>
        , vLLM only with <code>VLLM_SERVER_DEV_MODE=1</code>{' '}
        <Cite tier={1} href={vllmUrl('vllm/entrypoints/launchers/api_server/routers.py', 'L34-L37')}>
          vLLM routers.py L34-L37
        </Cite>
        .
      </>
    ),
    where: (
      <>
        Section 12, APIs, LoRA (low-rank adaptation) and the Admin Plane; section 13, SGLang as an
        RL Rollout Engine
      </>
    ),
  },
];

/* ------------------------------------------------------------------------ */
/* What it costs: SGLang's own levers                                       */
/* ------------------------------------------------------------------------ */

interface CostRow {
  id: string;
  lever: string;
  cost: ReactNode;
  where: string;
}

const COST_ROWS: CostRow[] = [
  {
    id: 'spec',
    lever: 'Speculative decoding',
    cost: (
      <>
        <strong>
          With <code>--max-running-requests</code> unset, EAGLE-family, NGRAM, DFLASH or DSPARK
          speculation resets it to 48
        </strong>
        , from 2048 to 4096 otherwise{' '}
        <Cite tier={1} href={sglangUrl(SPEC_HOOK, 'L995-L1003')} kind="code">
          speculative_hook.py L995-L1003
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(KV_CONF, 'L2800-L2851')}>
          kv_cache_configurator.py L2800-L2851
        </Cite>
        . A server sized for thousands of concurrent requests then runs 48 at once and queues the
        rest, which reads as a need for more instances. Set the cap to the concurrency you serve,
        then measure.
      </>
    ),
    where: 'Section 11, Speculative Decoding',
  },
  {
    id: 'pd',
    lever: 'PD disaggregation',
    cost: (
      <>
        Prefill and decode are two pools, both billed, and under the default <code>early</code>{' '}
        policy a new prefill request waits until decode has reserved room for it{' '}
        <Cite tier={1} href={sglangUrl(PREFILL, 'L462-L537')}>
          prefill.py L462-L537
        </Cite>
        . A decode pool sized too small leaves prefill GPUs idle.
      </>
    ),
    where: 'Section 15, PD Disaggregation',
  },
  {
    id: 'page',
    lever: '64-token pages on P6',
    cost: (
      <>
        A dense Llama-style model on P6 pages at 64 tokens when speculative decoding is off or on
        with an explicit <code>--speculative-eagle-topk 1</code> and{' '}
        <code>--speculative-num-steps</code> set{' '}
        <Cite tier={1} href={sglangUrl(OVR, 'L1124-L1137')} kind="code">
          overrides.py L1124-L1137
        </Cite>
        . A shared prefix shorter than 64 tokens is never matched, and a partial last page is
        recomputed{' '}
        <Cite tier={1} href={sglangDocsSrcUrl(AB_DOC, 'L322')}>
          SGLang docs: attention backend (v0.5.22 source)
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(RADIX, 'L147-L151')}>
          radix_cache.py L147-L151
        </Cite>
        , which is prefill compute paid again. With speculation off, <code>--page-size 16</code> is
        the lever; with EAGLE at topk 1, an explicit page size above 1 moves the model to{' '}
        <code>flashinfer</code>{' '}
        <Cite tier={1} href={sglangUrl(COMMON, 'L4012-L4020')} kind="code">
          common.py L4012-L4020
        </Cite>
        . The throughput effect of smaller pages was not measured in this research.
      </>
    ),
    where: 'Section 6, KV Memory and the Defaults Your GPU Picks; section 21, EC2 Instances, Images and GPU-Dependent Behaviour',
  },
  {
    id: 'compile',
    lever: 'Cold kernel compile',
    cost: (
      <>
        A block-FP8 (8-bit floating point) model on SM90 (compute capability 9.0, Hopper) or newer
        compiles DeepGEMM kernels inside startup, on every new instance that lacks the cache.
        SGLang&apos;s own log warning estimates 10 to 20 minutes, with no hardware or model stated{' '}
        <Cite tier={1} href={sglangUrl(DG, 'L166-L185')}>
          compile_utils.py L166-L185 (project estimate)
        </Cite>
        , and SageMaker fails a launch whose container does not pass <code>/ping</code> within 8
        minutes by default{' '}
        <Cite tier={1} href={SM_CONTRACT}>
          SageMaker docs: custom inference code with hosting services
        </Cite>
        . Prebuild with <code>python -m sglang.compile_deep_gemm</code> and keep the cache on
        persistent storage{' '}
        <Cite tier={1} href={sglangUrl('python/sglang/compile_deep_gemm.py', 'L1-L48')}>
          compile_deep_gemm.py L1-L48
        </Cite>
        .
      </>
    ),
    where: 'Section 8, Attention Backends and Kernels; section 19, SGLang on SageMaker AI and HyperPod',
  },
  {
    id: 'hicache',
    lever: 'HiCache',
    cost: (
      <>
        HiCache spends host memory to avoid recompute. Outside a PD decode server, the host tier
        targets twice the GPU pool&apos;s tokens per rank, shrunk to fit host memory when no size
        flag is set{' '}
        <Cite tier={1} href={sglangUrl(HICACHE_HOOK, 'L81-L107')}>
          hicache_hook.py L81-L107
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(AUTO_SIZE, 'L82-L125')} kind="code">
          hicache_auto_size.py L82-L125
        </Cite>
        , and a node evicted from the GPU stays in the tree with its host copy{' '}
        <Cite tier={1} href={sglangUrl(TREE_CORE, 'L1758-L1791')}>
          unified_tree_core.py L1758-L1791
        </Cite>
        . Budget host memory per rank before you turn it on.
      </>
    ),
    where: 'Section 7, HiCache: GPU, Host and Storage',
  },
];

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function DecisionGuide() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Decide whether SGLang fits a workload, which deployment path to take, and which features to turn on first (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            26. Decision Guide
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This guide turns the earlier sections into three choices: whether SGLang fits a
            workload, which platform runs it, and which features go on in the first week, from
            metrics to PD (prefill/decode) disaggregation and wide EP (expert parallelism) for MoE
            (mixture of experts) models. Section 23, SGLang and vLLM Compared, shows the two engines
            converged at v0.5.22 and v0.31.0 on paging the KV (key-value) cache, prefix caching and
            CPU-GPU overlap, so the challenge is finding the few differences your workload touches.
          </Box>
          <Box variant="p">
            Every branch below is guidance with its conditions attached, and each one names the
            section that carries its evidence. No benchmark located during this research compares
            SGLang v0.5.22 with vLLM v0.31.0, so no branch is a verdict. Our reading of the
            evidence gives one rule: the workload&apos;s shape picks the features, and the features
            go on in order of moving parts.
          </Box>
          <Box variant="p">
            The figure to carry through this section:{' '}
            <strong>
              turning on EAGLE-family, NGRAM, DFLASH or DSPARK speculation with{' '}
              <code>--max-running-requests</code> unset caps the server at 48 running requests
            </strong>{' '}
            <Cite tier={1} href={sglangUrl(SPEC_HOOK, 'L995-L1003')} kind="code">
              speculative_hook.py L995-L1003
            </Cite>
            . The engine-neutral choices, Bedrock against running an engine yourself, the control
            plane and engine sizing, are in {V28_LINK}.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Follow your hardware, your platform and your workload's shape to a shortlist, and to the sections whose evidence backs it"
          >
            The decision tree
          </Header>
        }
      >
        <SpaceBetween size="m">
          <DecisionTreeDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. The 64-token page and the llm-d release in the boxes are
            cited in the table below, with their conditions.
          </Box>
          <Box variant="p">
            Read the tree from the top. Hardware is a hard criterion, so it comes first. A platform
            already in place narrows the question to the SGLang release it runs. The workload
            branches are not exclusive: an agent product with a JSON tool schema follows both the
            shared-prefix and the structured-output rows.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={BRANCH_ROWS}
            columnDefinitions={[
              { id: 'branch', header: 'Branch', cell: (r: BranchRow) => <strong>{r.branch}</strong>, minWidth: 150 },
              { id: 'guidance', header: 'Guidance at v0.5.22, against vLLM v0.31.0', cell: (r: BranchRow) => r.guidance, minWidth: 340 },
              { id: 'where', header: 'Evidence in', cell: (r: BranchRow) => r.where, minWidth: 180 },
            ]}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Budget the five SGLang-specific levers on GPU count, host memory and startup time before you price the instances"
          >
            What it costs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            These five levers belong to SGLang, and each one changes how many GPUs, how much host
            memory or how much startup time a deployment uses. The list and the cost reading are
            ours, built from the sections named in each row.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={COST_ROWS}
            columnDefinitions={[
              { id: 'lever', header: 'Lever', cell: (r: CostRow) => <strong>{r.lever}</strong>, minWidth: 130 },
              { id: 'cost', header: 'What it costs, and the action', cell: (r: CostRow) => r.cost, minWidth: 360 },
              { id: 'where', header: 'Section', cell: (r: CostRow) => r.where, minWidth: 160 },
            ]}
          />
          <Box variant="p">
            Prices, Spot capacity and reservations are engine-neutral, and the vLLM dive covers
            them for Amazon EKS and SageMaker: {V24_LINK} and{' '}
            {V25_LINK}. This dive ships no price figures.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Port a running vLLM deployment with the checklist built for it, before adding any SGLang feature"
          >
            Coming from vLLM
          </Header>
        }
      >
        <Box variant="p">
          A team that runs vLLM today starts with the switching checklist at the end of section 23,
          SGLang and vLLM Compared. It covers the settings and client habits that change meaning
          between the engines: the metrics flag, the memory fraction, LoRA (low-rank adaptation)
          adapter addressing, tool-call parser names, regex and EBNF fields, the speculative shape
          and the admin key. It ends with benchmarking both engines on your own traffic at matched
          settings, because no published result located during this research covers these two
          versions.
        </Box>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know which flags go on the first day, which wait for a measurement, and which come last"
          >
            The first-week feature order
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This order is our reading, built from the rows cited in each step. The early steps add
            visibility and close the admin plane; each later step adds moving parts and needs the
            metrics the first step turned on.
          </Box>
          <ol style={{ margin: 0, paddingInlineStart: 20 }}>
            <li>
              <strong>
                <code>--enable-metrics</code> and <code>--admin-api-key</code>.
              </strong>{' '}
              A default server serves no <code>/metrics</code>{' '}
              <Cite tier={1} href={sglangUrl(OBS_FIELDS, 'L70')}>
                observability.py L70
              </Cite>
              ; on the SageMaker DLC the switch is <code>SM_SGLANG_ENABLE_METRICS=true</code>{' '}
              <Cite tier={1} href={DLC_ENTRYPOINT}>
                DLC sagemaker_entrypoint.sh L12-L50
              </Cite>
              . With no key, the admin routes accept any client that can reach the port{' '}
              <Cite tier={1} href={sglangUrl(AUTH, 'L79-L151')}>
                auth.py L79-L151
              </Cite>
              ; section 12&apos;s key matrix gives the key state for your platform.
            </li>
            <li>
              <strong>The gateway in front of more than one worker.</strong> Its default policy is{' '}
              <code>cache_aware</code>{' '}
              <Cite tier={1} href={sglangUrl(`${GW}/main.rs`, 'L150-L151')}>
                main.rs L150-L151
              </Cite>
              , which routes by the prompt text it has already sent to each worker{' '}
              <Cite tier={1} href={sglangUrl(`${GW}/policies/cache_aware.rs`, 'L84-L101')}>
                cache_aware.rs L84-L101
              </Cite>{' '}
              (section 17, The Model Gateway).
            </li>
            <li>
              <strong>
                For shared-prefix traffic whose queue stays under 128, a test of{' '}
                <code>--schedule-policy lpm</code>
              </strong>{' '}
              (LPM, longest prefix match). Compare <code>#cached-token</code> with{' '}
              <code>#new-token</code> in the prefill log lines before and after{' '}
              <Cite tier={1} href={sglangUrl(METRICS_REPORTER, 'L730-L760')}>
                metrics_reporter.py L730-L760
              </Cite>
              . LPM falls back to FCFS in any round where more than 128 requests wait{' '}
              <Cite tier={1} href={sglangUrl(POLICY, 'L300-L311')}>
                schedule_policy.py L300-L311
              </Cite>
              , and no measurement of its effect was located during this research (section 5).
            </li>
            <li>
              <strong>HiCache when reusable prefixes outgrow GPU KV</strong>, by our reading.{' '}
              <code>--enable-hierarchical-cache</code> is off by default{' '}
              <Cite tier={1} href={sglangUrl(MEM_FIELDS, 'L98')}>
                memory.py L98
              </Cite>
              ; turn on the host tier alone first and watch its share of hits (section 7).
            </li>
            <li>
              <strong>Speculative decoding, after measuring acceptance at your concurrency</strong>,
              because{' '}
              <strong>it caps running requests at 48</strong> for the EAGLE family, NGRAM, DFLASH
              and DSPARK unless you set <code>--max-running-requests</code>{' '}
              <Cite tier={1} href={sglangUrl(SPEC_HOOK, 'L995-L1003')} kind="code">
                speculative_hook.py L995-L1003
              </Cite>
              . With <code>--speculative-adaptive</code>, batches of 64 or more draft zero steps{' '}
              <Cite tier={1} href={sglangUrl(ADAPT, 'L27-L52')}>
                adaptive_spec_params.py L27-L52
              </Cite>
              . Keep speculation only if throughput at your concurrency beats the same server
              without it (section 11).
            </li>
            <li>
              <strong>PD and wide EP last</strong>, as the steps with the most moving parts, by our
              reading: two pools, the gateway in PD mode, a KV transfer backend and, for wide EP, an
              all-to-all library with its own EFA (Elastic Fabric Adapter) bring-up (sections 15,
              16 and 22).
            </li>
          </ol>
          <Box variant="p">
            Step 1 goes on the launch line you run today. Every later step waits for a reading from
            the metrics step 1 turned on.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
