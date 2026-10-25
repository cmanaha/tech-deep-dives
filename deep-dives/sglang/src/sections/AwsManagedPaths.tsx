import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangTreeUrl, sglangDocsSrcUrl } from '../components/Cite';

const SRT = 'python/sglang/srt';
const HTTP = `${SRT}/entrypoints/http_server.py`;
const ENGINE = `${SRT}/entrypoints/engine.py`;
const SCHEDULER = `${SRT}/managers/scheduler.py`;
const AUTH = `${SRT}/utils/auth.py`;
const ENVIRON = `${SRT}/environ.py`;
const ARG_UTILS = `${SRT}/arg_groups/arg_utils.py`;
const SERVER_ARGS = `${SRT}/server_args.py`;
const OBSERVABILITY = `${SRT}/arg_groups/fields/observability.py`;
const SM_DOC = 'basic_usage/aws_sagemaker';

const AWS_SM = 'https://docs.aws.amazon.com/sagemaker/latest/dg';
const AWS_SM_API = 'https://docs.aws.amazon.com/sagemaker/latest/APIReference';
const SM_CONTRACT = `${AWS_SM}/your-algorithms-inference-code.html`;
const SM_OPENAI = `${AWS_SM}/realtime-endpoints-openai-compatible.html`;
const SM_LMI_HOSTING = `${AWS_SM}/large-model-inference-hosting.html`;
const SM_LMI_DOCS = `${AWS_SM}/large-model-inference-container-docs.html`;
const SM_DEPLOY_OPTIONS = `${AWS_SM}/deploy-model-options.html`;
const SM_OBSERVABILITY = `${AWS_SM}/monitoring-cloudwatch-detailed-observability.html`;
const SM_VARIANT = `${AWS_SM_API}/API_ProductionVariant.html`;
const SM_CONTAINER_DEF = `${AWS_SM_API}/API_ContainerDefinition.html`;
const HP_DEPLOY = `${AWS_SM}/sagemaker-hyperpod-model-deployment-deploy-ftm.html`;
const HP_GATEWAY = `${AWS_SM}/sagemaker-hyperpod-model-deployment-inference-gateway.html`;
const HP_DPD = `${AWS_SM}/sagemaker-hyperpod-model-deployment-dpd.html`;
const BEDROCK_IMPORT =
  'https://docs.aws.amazon.com/bedrock/latest/userguide/model-customization-import-model.html';
const BEDROCK_SAMPLES =
  'https://docs.aws.amazon.com/bedrock/latest/userguide/custom-model-import-code-samples.html';
const ECR_GALLERY = 'https://gallery.ecr.aws/deep-learning-containers/sglang';
const NEURON_DOC =
  'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/vllm-neuron/docs/design/vllm/additional-config.html';

const DLC_SHA = '23970abd5b8919ea3e1add74692a0d056b2fcbd9';
function dlcUrl(path: string, lines?: string): string {
  const base = `https://github.com/aws/deep-learning-containers/blob/${DLC_SHA}/${path}`;
  return lines ? `${base}#${lines}` : base;
}
const BEAM_SAMPLE =
  'https://github.com/aws-samples/sagemaker-genai-hosting-examples/blob/63f058214b2965f7546c1b233758e14eab109893/SageMakerHyperpod/reflection-beam/reflection-beam-sglang.yaml';
const MCC_TEMPLATE =
  'https://github.com/awslabs/ml-container-creator/blob/5cd526362880ff9c07658d2f288e6b958dffd38d/templates/code/serve.d/sglang/sglang.ejs';
const AWSOME_SM =
  'https://github.com/aws-samples/awsome-inference/tree/d3236c8cfabb5699c4292f7e0351e4dbc9099de3/2.projects/sglang-sagemaker';

const ML_BLOG = 'https://aws.amazon.com/blogs/machine-learning';
const BLOG_BEAM = `${ML_BLOG}/introducing-reflection-beam-an-open-weight-model-for-agentic-coding-on-aws/`;
const BLOG_METRICS = `${ML_BLOG}/monitor-and-debug-generative-ai-inference-with-sagemaker-detailed-metrics-and-insights-dashboard-on-cloudwatch/`;
const BLOG_YTD = `${ML_BLOG}/amazon-sagemaker-inference-2026-year-to-date-launches-in-review/`;
const BLOG_INSTANTSTART = `${ML_BLOG}/run-agent-driven-amazon-sagemaker-hyperpod-operations-with-instantstart/`;
const BLOG_GATEWAY = `${ML_BLOG}/introducing-amazon-sagemaker-hyperpod-inference-gateway/`;
const BLOG_STRANDS = `${ML_BLOG}/building-custom-model-provider-for-strands-agents-with-llms-hosted-on-sagemaker-ai-endpoints/`;
const BLOG_MOE_RL = `${ML_BLOG}/scaling-moe-reinforcement-learning-on-amazon-eks-with-efa-and-deepep-with-40-more-throughput/`;
const BLOG_LLMD = `${ML_BLOG}/introducing-disaggregated-inference-on-aws-powered-by-llm-d/`;

const PR_45897 = 'https://github.com/sgl-project/sglang/pull/45897';
const PR_45986 = 'https://github.com/sgl-project/sglang/pull/45986';

const FASTAPI_ROUTING = 'https://github.com/fastapi/fastapi/blob/0.162.0/fastapi/routing.py';
const FASTAPI_0132 = 'https://github.com/fastapi/fastapi/releases/tag/0.132.0';

const VLLM_SM_ROUTER =
  'https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/serve/sagemaker/api_router.py#L82-L110';
const VLLM_PLUGINS =
  'https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/plugins/__init__.py#L23';

const VLLM_SM_LINK = (
  <Link href="../vllm/">vLLM dive, section 25: vLLM on SageMaker &amp; vs Bedrock</Link>
);
const VLLM_NEURON_LINK = <Link href="../vllm/">vLLM dive, section 21: vLLM on AWS Neuron</Link>;

/* ------------------------------------------------------------------------ */
/* Diagram: the AWS path tree for SGLang                                     */
/* ------------------------------------------------------------------------ */

type LeafTone = 'here' | 'next' | 'none' | 'other';

interface TreeLeaf {
  y: number;
  title: string;
  fact: string;
  where: string;
  tone: LeafTone;
}

const LEAF_X = 620;
const LEAF_W = 264;
const LEAF_H = 62;

const TREE_LEAVES: TreeLeaf[] = [
  {
    y: 14,
    title: 'Amazon Bedrock',
    fact: 'imports weights, no engine choice',
    where: 'vLLM dive, section 25: the trade-off',
    tone: 'none',
  },
  {
    y: 88,
    title: 'SageMaker AI real-time endpoint',
    fact: 'first /ping within 8 min by default',
    where: 'this section',
    tone: 'here',
  },
  {
    y: 162,
    title: 'SageMaker HyperPod',
    fact: 'operator, gateway engineType: sglang',
    where: 'this section',
    tone: 'here',
  },
  {
    y: 236,
    title: 'Amazon EKS',
    fact: 'your pods, probes on /health',
    where: 'section 20',
    tone: 'next',
  },
  {
    y: 310,
    title: 'Amazon EC2',
    fact: 'your image, driver and EFA stack',
    where: 'section 20',
    tone: 'next',
  },
  {
    y: 384,
    title: 'vLLM on AWS Neuron',
    fact: 'no SGLang Neuron backend at v0.5.22',
    where: 'vLLM dive, section 21',
    tone: 'other',
  },
];

const OPERATOR_EDGES: { row: number; label: string }[] = [
  { row: 1, label: 'managed endpoint' },
  { row: 2, label: 'managed cluster' },
  { row: 3, label: 'your cluster' },
  { row: 4, label: 'your instances' },
];

function leafCenter(row: number): number {
  return TREE_LEAVES[row].y + LEAF_H / 2;
}

function AwsPathTreeDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 460"
        role="img"
        aria-labelledby="awsmgd-tree-title"
        style={{ width: '100%', minWidth: 720, height: 'auto' }}
      >
        <title id="awsmgd-tree-title">
          Choosing an AWS path for SGLang takes two questions. First: must you run SGLang itself,
          with its own flags, cache or PD? If a managed model is enough, Amazon Bedrock imports
          the weights and offers no engine choice. If you need SGLang on Trainium or Inferentia,
          SGLang v0.5.22 has no Neuron backend, so serve with vLLM on AWS Neuron. On GPUs, the
          second question is who operates the platform. A SageMaker AI real-time endpoint is
          managed for you and must pass its first /ping within 8 minutes by default. SageMaker
          HyperPod manages the cluster and runs SGLang through its inference operator and a
          gateway set to engineType sglang. On Amazon EKS you run the cluster, with probes on
          /health; on Amazon EC2 you run the instances, with your own image, driver and EFA
          stack. This section covers SageMaker AI and HyperPod; section 20 covers EKS and EC2.
        </title>
        <style>{`
          .awsmgd-tree-q { fill: #f4f4f4; stroke: #414d5c; stroke-width: 1.5; }
          .awsmgd-tree-here { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .awsmgd-tree-next { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .awsmgd-tree-none { fill: #f4f4f4; stroke: #414d5c; stroke-width: 1.5; }
          .awsmgd-tree-other { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .awsmgd-tree-qt { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .awsmgd-tree-lt { fill: #16191f; font: 600 13px sans-serif; text-anchor: start; }
          .awsmgd-tree-lt-amber { fill: #5c4700; font: 600 13px sans-serif; text-anchor: start; }
          .awsmgd-tree-lf { fill: #414d5c; font: 11px sans-serif; text-anchor: start; }
          .awsmgd-tree-lw { fill: #5f6b7a; font: italic 11px sans-serif; text-anchor: start; }
          .awsmgd-tree-el { fill: #16191f; font: 11px sans-serif; text-anchor: middle; }
          .awsmgd-tree-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
        `}</style>
        <defs>
          <marker
            id="awsmgd-tree-ah"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#5f6b7a" />
          </marker>
        </defs>

        <rect x={0} y={0} width={900} height={460} rx={8} fill="#ffffff" />

        {/* Question 1 */}
        <rect x={16} y={190} width={200} height={80} rx={6} className="awsmgd-tree-q" />
        <text x={116} y={216} className="awsmgd-tree-qt">
          Must you run SGLang
        </text>
        <text x={116} y={234} className="awsmgd-tree-qt">
          itself, with its flags,
        </text>
        <text x={116} y={252} className="awsmgd-tree-qt">
          cache or PD?
        </text>

        {/* Question 2 */}
        <rect x={300} y={196} width={170} height={68} rx={6} className="awsmgd-tree-q" />
        <text x={385} y={226} className="awsmgd-tree-qt">
          Who operates
        </text>
        <text x={385} y={244} className="awsmgd-tree-qt">
          the platform?
        </text>

        {/* Question 1 to Bedrock */}
        <path
          d={`M116,190 L116,${leafCenter(0)} L${LEAF_X - 2},${leafCenter(0)}`}
          className="awsmgd-tree-arr"
          markerEnd="url(#awsmgd-tree-ah)"
        />
        <text x={380} y={leafCenter(0) - 8} className="awsmgd-tree-el">
          no: a managed model is enough
        </text>

        {/* Question 1 to question 2 */}
        <path d="M216,230 L298,230" className="awsmgd-tree-arr" markerEnd="url(#awsmgd-tree-ah)" />
        <text x={257} y={222} className="awsmgd-tree-el">
          yes, GPU
        </text>

        {/* Question 1 to Neuron */}
        <path
          d={`M116,270 L116,${leafCenter(5)} L${LEAF_X - 2},${leafCenter(5)}`}
          className="awsmgd-tree-arr"
          markerEnd="url(#awsmgd-tree-ah)"
        />
        <text x={380} y={leafCenter(5) - 8} className="awsmgd-tree-el">
          yes, on Trainium or Inferentia
        </text>

        {/* Question 2 to the four operator choices */}
        <path d="M470,230 L490,230" className="awsmgd-tree-arr" />
        <path d={`M490,${leafCenter(1)} L490,${leafCenter(4)}`} className="awsmgd-tree-arr" />
        {OPERATOR_EDGES.map((e) => (
          <g key={e.label}>
            <path
              d={`M490,${leafCenter(e.row)} L${LEAF_X - 2},${leafCenter(e.row)}`}
              className="awsmgd-tree-arr"
              markerEnd="url(#awsmgd-tree-ah)"
            />
            <text x={556} y={leafCenter(e.row) - 8} className="awsmgd-tree-el">
              {e.label}
            </text>
          </g>
        ))}

        {/* Leaves */}
        {TREE_LEAVES.map((l) => (
          <g key={l.title}>
            <rect
              x={LEAF_X}
              y={l.y}
              width={LEAF_W}
              height={LEAF_H}
              rx={6}
              className={`awsmgd-tree-${l.tone}`}
            />
            <text
              x={LEAF_X + 14}
              y={l.y + 21}
              className={l.tone === 'other' ? 'awsmgd-tree-lt-amber' : 'awsmgd-tree-lt'}
            >
              {l.title}
            </text>
            <text x={LEAF_X + 14} y={l.y + 38} className="awsmgd-tree-lf">
              {l.fact}
            </text>
            <text x={LEAF_X + 14} y={l.y + 54} className="awsmgd-tree-lw">
              {l.where}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Table: how each SageMaker entrypoint turns variables into flags           */
/* ------------------------------------------------------------------------ */

interface EntrypointRow {
  id: string;
  entrypoint: ReactNode;
  prefix: ReactNode;
  isTrue: ReactNode;
  isFalse: ReactNode;
  empty: ReactNode;
}

const ENTRYPOINT_ROWS: EntrypointRow[] = [
  {
    id: 'sglang-serve',
    entrypoint: (
      <>
        SGLang&apos;s <code>docker/serve</code>, the in-tree SageMaker image{' '}
        <Cite tier={1} href={sglangUrl('docker/serve', 'L9-L16')} kind="code">
          docker/serve L9-L16
        </Cite>
      </>
    ),
    prefix: <code>SM_SGLANG_</code>,
    isTrue: (
      <>
        <code>--flag true</code>, which argparse is expected to reject; read from code, not run{' '}
        <Cite tier={1} href={sglangUrl(SERVER_ARGS, 'L682')} kind="code">
          server_args.py L682
        </Cite>
      </>
    ),
    isFalse: (
      <>
        <code>--flag false</code>, expected to fail the same way
      </>
    ),
    empty: (
      <>
        bare <code>--flag</code>
      </>
    ),
  },
  {
    id: 'aws-dlc',
    entrypoint: (
      <>
        AWS DLC <code>sagemaker_entrypoint.sh</code>, both image lines{' '}
        <Cite tier={1} href={dlcUrl('scripts/docker/sglang/sagemaker_entrypoint.sh', 'L17-L32')}>
          sagemaker_entrypoint.sh L17-L32
        </Cite>{' '}
        <Cite tier={1} href={dlcUrl('docker/sglang/Dockerfile.amzn2023', 'L529-L541')}>
          Dockerfile.amzn2023 L529-L541
        </Cite>
      </>
    ),
    prefix: <code>SM_SGLANG_</code>,
    isTrue: (
      <>
        bare <code>--flag</code>{' '}
        <Cite tier={1} href={dlcUrl('docs/sglang/configuration.md', 'L35-L38')}>
          DLC docs: configuration L35-L38
        </Cite>
      </>
    ),
    isFalse: 'flag omitted',
    empty: (
      <>
        bare <code>--flag</code>
      </>
    ),
  },
  {
    id: 'mcc',
    entrypoint: (
      <>
        AWS Labs <code>ml-container-creator</code> template, which runs <code>sglang serve</code>{' '}
        <Cite tier={2} href={`${MCC_TEMPLATE}#L97-L104`}>
          sglang.ejs L97-L104 (AWS sample)
        </Cite>{' '}
        <Cite tier={2} href={`${MCC_TEMPLATE}#L153`}>
          sglang.ejs L153
        </Cite>
      </>
    ),
    prefix: (
      <>
        <code>SGLANG_</code>, forwarded only when the flag appears in{' '}
        <code>sglang serve --help</code>{' '}
        <Cite tier={2} href={`${MCC_TEMPLATE}#L36-L46`}>
          sglang.ejs L36-L46
        </Cite>
      </>
    ),
    isTrue: (
      <>
        bare <code>--flag</code>
      </>
    ),
    isFalse: 'flag omitted',
    empty: (
      <>
        bare <code>--flag</code>
      </>
    ),
  },
];

/* ------------------------------------------------------------------------ */
/* Section                                                                   */
/* ------------------------------------------------------------------------ */

export function AwsManagedPaths() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Pick SageMaker AI, HyperPod, EKS or EC2 for an SGLang workload, and get a SageMaker endpoint through its first health check with metrics on (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            19. SGLang on SageMaker AI and HyperPod
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AWS offers five places to run an open-weight model, and they differ in how much of the
            serving engine you control. Amazon Bedrock runs imported weights with no engine choice.
            SageMaker AI runs your container behind a managed endpoint. SageMaker HyperPod and
            Amazon EKS (Elastic Kubernetes Service) give you Kubernetes, and Amazon EC2 (Elastic
            Compute Cloud) gives you the machine. This section covers the two SageMaker paths;
            section 20, SGLang on EKS and EC2, covers the other two.
          </Box>
          <Box variant="p">
            The managed endpoint has the tightest contract, and SGLang already speaks it. What
            varies between deployments is the entrypoint that turns environment variables into
            flags, the keys you set and the start budget, and the start budget is the one that
            fails deployments:{' '}
            <strong>
              SageMaker fails an instance launch whose container does not pass <code>/ping</code>{' '}
              within 8 minutes of startup
            </strong>{' '}
            <Cite tier={1} href={SM_CONTRACT}>
              SageMaker docs: custom inference code with hosting services
            </Cite>
            , and SGLang answers <code>/ping</code> only after its weights are loaded and its CUDA
            graphs captured{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L1098-L1111')} kind="code">
              scheduler.py L1098-L1111
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L2924-L2961')} kind="code">
              http_server.py L2924-L2961
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Rule out the two paths that cannot run SGLang, then pick who operates the platform, before any container work"
          >
            Four AWS paths, chosen by how much of SGLang you run
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The first question is whether you need SGLang itself. Bedrock&apos;s Custom Model
            Import takes model files in Hugging Face weights format, with no container{' '}
            <Cite tier={1} href={BEDROCK_IMPORT}>
              Bedrock docs: import a customized model
            </Cite>
            , and neither Custom Model Import page read during this research names an inference
            engine{' '}
            <Cite tier={1} href={BEDROCK_SAMPLES}>
              Bedrock docs: Custom Model Import code samples
            </Cite>
            . It fits when a managed model is enough. When you need SGLang&apos;s flags, its radix
            cache or PD (prefill/decode) disaggregation, the choice is among the other three, and
            the managed-versus-self-run trade reads the same as for vLLM ({VLLM_SM_LINK}).
          </Box>
          <Box variant="p">
            On GPUs the second question is who operates the platform. A SageMaker AI real-time
            endpoint runs your container image on instances SageMaker provisions{' '}
            <Cite tier={1} href={SM_CONTRACT}>
              SageMaker docs: custom inference code with hosting services
            </Cite>
            . SageMaker HyperPod
            adds an inference operator and a gateway to a Kubernetes cluster{' '}
            <Cite tier={1} href={HP_DEPLOY}>
              HyperPod docs: deploy models
            </Cite>{' '}
            <Cite tier={1} href={HP_GATEWAY}>
              HyperPod docs: Inference Gateway
            </Cite>
            . On EKS and EC2 you supply more of the stack, from the image to the EFA (Elastic
            Fabric Adapter) installer, and section 20 lists what. Trainium and Inferentia are a
            separate branch, because SGLang v0.5.22 has no Neuron backend.
          </Box>
          <AwsPathTreeDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic decision tree, not measured. The 8-minute figure is SageMaker&apos;s
            startup health-check window, cited above and in the start-budget block below.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know which routes SageMaker calls, the one body each accepts, and the switch that removes them"
          >
            SGLang already speaks the SageMaker contract
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            SageMaker&apos;s container contract is small: listen on port 8080, answer{' '}
            <code>/ping</code> and accept <code>POST /invocations</code>{' '}
            <Cite tier={1} href={SM_CONTRACT}>
              SageMaker docs: custom inference code with hosting services
            </Cite>
            . SGLang registers both routes in its FastAPI app{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L2122-L2137')}>
              http_server.py L2122-L2137
            </Cite>
            , so every SGLang server on the default Python HTTP frontend meets the contract once an
            entrypoint starts it on port 8080 and host <code>0.0.0.0</code>. The opt-in Rust
            frontend, <code>SGLANG_RUST_SERVER=1</code> (default off){' '}
            <Cite tier={1} href={sglangUrl(ENVIRON, 'L1902')}>
              environ.py L1902
            </Cite>
            , replaces the Python server, and a search of the <code>rust/</code> tree finds neither
            route{' '}
            <Cite tier={1} href={sglangTreeUrl('rust')} kind="code">
              rust/ at v0.5.22
            </Cite>
            . Keep it unset on SageMaker; section 3, The SGLang Runtime, covers the switch.
          </Box>
          <Box variant="p">
            <code>/invocations</code> is SGLang&apos;s chat completions handler under a second
            name. It parses an OpenAI <code>ChatCompletionRequest</code> and calls the same handler
            as <code>/v1/chat/completions</code>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L2129-L2137')}>
              http_server.py L2129-L2137
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L1803-L1812')}>
              http_server.py L1803-L1812
            </Cite>
            . Send <code>messages</code>, <code>max_tokens</code> and <code>stream</code>; a native{' '}
            <code>/generate</code> body, a <code>/v1/completions</code> prompt and an embeddings
            request do not fit that schema. SageMaker&apos;s OpenAI-compatible path,{' '}
            <code>/openai/v1/chat/completions</code>, needs the container to implement{' '}
            <code>/v1/chat/completions</code> and lists the SGLang DLC (Deep Learning Container) as
            supported{' '}
            <Cite tier={1} href={SM_OPENAI}>
              SageMaker docs: OpenAI-compatible APIs
            </Cite>
            . That route reaches SGLang&apos;s own <code>/v1/chat/completions</code>, which rejects
            any content type other than <code>application/json</code>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L679-L692')}>
              http_server.py L679-L692
            </Cite>
            . <code>/invocations</code> skips that check, but FastAPI parses its body as JSON only
            when the header names JSON, and FastAPI 0.132.0 and later refuse a missing header too{' '}
            <Cite tier={1} href={`${FASTAPI_ROUTING}#L458-L475`} kind="code">
              FastAPI routing.py L458-L475 (0.162.0)
            </Cite>{' '}
            <Cite tier={1} href={FASTAPI_0132}>
              FastAPI 0.132.0 release notes
            </Cite>
            , so send <code>Content-Type: application/json</code> on both paths, as SGLang&apos;s
            own <code>invoke_endpoint</code> example does{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(SM_DOC, 'L105-L113')}>
              SGLang docs: Amazon SageMaker AI L105-L113
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="Two smaller contract details: GET-only /ping and streaming">
            <SpaceBetween size="s">
              <Box variant="p">
                SGLang registers <code>/ping</code> for GET only{' '}
                <Cite tier={1} href={sglangUrl(HTTP, 'L2123')}>
                  http_server.py L2123
                </Cite>
                . SageMaker&apos;s periodic health checks are GET requests, while the same AWS page
                also says the container must accept POST on <code>/ping</code>{' '}
                <Cite tier={1} href={SM_CONTRACT}>
                  SageMaker docs: custom inference code with hosting services
                </Cite>
                . A POST gets FastAPI&apos;s 405, which matters only to an integration that probes
                with POST; not tested.
              </Box>
              <Box variant="p">
                A streaming request returns the handler&apos;s streaming response unchanged,
                because <code>model_json_response</code> passes non-pydantic results through{' '}
                <Cite tier={1} href={sglangUrl(`${SRT}/utils/json_response.py`, 'L34-L41')}>
                  json_response.py L34-L41
                </Cite>
                ; read from source, not run against <code>InvokeEndpointWithResponseStream</code>.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            <strong>Against vLLM:</strong> vLLM registers <code>/ping</code> for GET and POST and
            runs its health check behind it, and its <code>/invocations</code> dispatches chat,
            completion and pooling bodies by type{' '}
            <Cite tier={1} href={VLLM_SM_ROUTER} kind="code">
              vLLM api_router.py L82-L110 (v0.31.0)
            </Cite>
            ; SGLang&apos;s <code>/ping</code> is a static GET and its <code>/invocations</code>{' '}
            takes chat bodies only ({VLLM_SM_LINK}).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Write SM_SGLANG_ variables that become the flags you meant on the image you chose, booleans included"
          >
            Pick the image, then match its flag translation
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            SGLang on SageMaker means the SGLang DLC or an image you build. SGLang appears on
            neither the LMI (Large Model Inference) container page nor the deployment-options page
            read for this research{' '}
            <Cite tier={1} href={SM_LMI_DOCS}>
              SageMaker docs: LMI container documentation
            </Cite>{' '}
            <Cite tier={1} href={SM_DEPLOY_OPTIONS}>
              SageMaker docs: deployment options
            </Cite>
            ; the vLLM dive&apos;s section 25 covers what LMI runs. AWS publishes the SGLang DLC in
            two lines. The Ubuntu line is built from <code>lmsysorg/sglang:v0.5.22</code> and adds
            the EFA installer and the SageMaker entrypoint, under tags such as{' '}
            <code>0.5.22-gpu-py312-cu130-ubuntu24.04-sagemaker</code>{' '}
            <Cite tier={1} href={dlcUrl('docker/sglang/Dockerfile', 'L1-L6')}>
              DLC Dockerfile L1-L6
            </Cite>{' '}
            <Cite tier={1} href={dlcUrl('.github/config/image/sglang/sagemaker-ubuntu.yml', 'L1-L20')}>
              sagemaker-ubuntu.yml L1-L20
            </Cite>{' '}
            <Cite tier={1} href={dlcUrl('docs/src/data/sglang/0.5.22-gpu-sagemaker.yml', 'L10-L14')}>
              0.5.22-gpu-sagemaker.yml L10-L14
            </Cite>
            . The Amazon Linux 2023 &quot;server&quot; line, <code>server-sagemaker-cuda</code>,
            runs SGLang 0.5.19{' '}
            <Cite tier={1} href={dlcUrl('docs/sglang/changelog/index.md', 'L7-L22')}>
              DLC changelog L7-L22
            </Cite>
            . Section 21, EC2 Instances, Images and GPU-Dependent Behaviour, picks between the
            lines. SGLang&apos;s own SageMaker page uses <code>server-sagemaker-cuda-v1.0</code> as
            its example tag{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(SM_DOC, 'L13-L25')}>
              SGLang docs: Amazon SageMaker AI (v0.5.22 source)
            </Cite>
            , a floating tag last pushed on 2026-06-18 in Amazon ECR (Elastic Container Registry)
            Public{' '}
            <Cite tier={1} href={ECR_GALLERY}>
              Amazon ECR Public Gallery: deep-learning-containers/sglang
            </Cite>
            , so pin a versioned tag.
          </Box>
          <Box variant="p">
            To build your own, SGLang ships <code>docker/sagemaker.Dockerfile</code>, which is{' '}
            <code>FROM lmsysorg/sglang:latest</code> with the <code>serve</code> script as its
            entrypoint{' '}
            <Cite tier={1} href={sglangUrl('docker/sagemaker.Dockerfile', 'L1-L6')}>
              sagemaker.Dockerfile L1-L6
            </Cite>
            . Change the base to <code>lmsysorg/sglang:v0.5.22</code> before you build, or the
            image moves under you.
          </Box>
          <Box variant="p">
            Every image turns the model&apos;s <code>Environment</code> map into SGLang flags.
            SGLang&apos;s <code>docker/serve</code> strips the <code>SM_SGLANG_</code> prefix,
            lowercases the rest and turns <code>_</code> into <code>-</code>, so{' '}
            <code>SM_SGLANG_CONTEXT_LENGTH=4096</code> becomes <code>--context-length 4096</code>;
            it defaults{' '}
            <code>--port 8080</code>, <code>--host 0.0.0.0</code> and{' '}
            <code>--model-path /opt/ml/model</code>, then runs{' '}
            <code>python3 -m sglang.launch_server</code>{' '}
            <Cite tier={1} href={sglangUrl('docker/serve', 'L4-L34')}>
              docker/serve L4-L34
            </Cite>
            . SageMaker caps the map at 100 entries, 1,024 bytes per key or value and 32 KB in all{' '}
            <Cite tier={1} href={SM_CONTAINER_DEF}>
              SageMaker API: ContainerDefinition
            </Cite>
            . The entrypoints in use differ on booleans, and SGLang&apos;s parser turns a boolean
            field into an argparse <code>store_true</code> flag that takes no value{' '}
            <Cite tier={1} href={sglangUrl(ARG_UTILS, 'L393-L398')}>
              arg_utils.py L393-L398
            </Cite>
            :
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            header={<Header variant="h3">What each entrypoint makes of a boolean variable</Header>}
            items={ENTRYPOINT_ROWS}
            columnDefinitions={[
              { id: 'entrypoint', header: 'Entrypoint', cell: (r) => r.entrypoint, minWidth: 200 },
              { id: 'prefix', header: 'Prefix', cell: (r) => r.prefix, minWidth: 120 },
              { id: 'true', header: 'Value true', cell: (r) => r.isTrue, minWidth: 170 },
              { id: 'false', header: 'Value false', cell: (r) => r.isFalse, minWidth: 120 },
              { id: 'empty', header: 'Empty value', cell: (r) => r.empty, minWidth: 100 },
            ]}
          />
          <Box variant="p">
            So on the AWS DLC write <code>SM_SGLANG_TRUST_REMOTE_CODE=true</code>, and on an image
            built from SGLang&apos;s <code>docker/serve</code> give a boolean an empty value, which
            the <code>Environment</code> map allows, since its minimum value length is 0{' '}
            <Cite tier={1} href={SM_CONTAINER_DEF}>
              SageMaker API: ContainerDefinition
            </Cite>
            .
          </Box>
          <Box variant="p">
            The host AMI (Amazon Machine Image) has to match the image&apos;s CUDA version.
            SGLang&apos;s SageMaker page requires an <code>InferenceAmiVersion</code>, because the
            default host AMI&apos;s NVIDIA drivers do not fit CUDA 13 images, and its examples set{' '}
            <code>al2023-ami-sagemaker-inference-gpu-4-1</code>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(SM_DOC, 'L137-L140')}>
              SGLang docs: Amazon SageMaker AI L137-L140
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(SM_DOC, 'L98')}>
              L98
            </Cite>
            . That AMI carries NVIDIA driver 580 and CUDA 13.0{' '}
            <Cite tier={1} href={SM_VARIANT}>
              SageMaker API: ProductionVariant
            </Cite>
            ; the DLC tag above is a CUDA 13 build (<code>cu130</code>). The repository&apos;s
            example deploy script names <code>al2-ami-sagemaker-inference-gpu-3-1</code>{' '}
            <Cite tier={1} href={sglangUrl('examples/sagemaker/deploy_and_serve_endpoint.py', 'L32-L38')}>
              deploy_and_serve_endpoint.py L32-L38
            </Cite>
            , which carries NVIDIA driver 550 and CUDA 12.4{' '}
            <Cite tier={1} href={SM_VARIANT}>
              SageMaker API: ProductionVariant
            </Cite>
            ; use gpu-4-1.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Set keys that leave SageMaker's health check reachable, and turn on the metrics route its dashboards and HyperPod's gateway read"
          >
            Keep /ping open and /metrics on
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            SGLang&apos;s key check lets three path prefixes through without a token:{' '}
            <code>/health</code>, <code>/ready</code> and <code>/metrics</code>{' '}
            <Cite tier={1} href={sglangUrl(AUTH, 'L101-L106')} kind="code">
              auth.py L101-L106
            </Cite>
            . <code>/ping</code> is not one of them, and AWS names no way to attach a token to
            SageMaker&apos;s health check{' '}
            <Cite tier={1} href={SM_CONTRACT}>
              SageMaker docs: custom inference code with hosting services
            </Cite>
            , so a server started with <code>--api-key</code> (<code>SM_SGLANG_API_KEY</code>)
            is expected to fail its first <code>/ping</code> and never reach InService; read from
            code, not run. Callers already need IAM (Identity and Access Management) permission for{' '}
            <code>sagemaker:InvokeEndpoint</code> on the endpoint{' '}
            <Cite tier={1} href={SM_OPENAI}>
              SageMaker docs: OpenAI-compatible APIs
            </Cite>
            . Section 12, Talking to SGLang, gives the key matrix: on SageMaker set only the admin
            key, as <code>SM_SGLANG_ADMIN_API_KEY</code>, which by our reading of the code leaves{' '}
            <code>/ping</code> and <code>/invocations</code> unkeyed behind IAM. That key travels in the <code>Environment</code> map with every other{' '}
            <code>SM_SGLANG_</code> variable, and AWS advises keeping sensitive data out of that map{' '}
            <Cite tier={1} href={SM_CONTAINER_DEF}>
              SageMaker API: ContainerDefinition
            </Cite>
            .
          </Box>
          <Box variant="p">
            SageMaker&apos;s detailed observability lists native SGLang metrics, TTFT (time to first
            token), KV (key-value) cache utilization and queue depth among them, as available
            without custom instrumentation, and does not mention a flag{' '}
            <Cite tier={1} href={SM_OBSERVABILITY} kind="doc-code-conflict">
              SageMaker docs: detailed observability
            </Cite>
            . v0.5.22 mounts <code>/metrics</code> only when <code>--enable-metrics</code> is set,
            and the flag defaults to off{' '}
            <Cite tier={1} href={sglangUrl(OBSERVABILITY, 'L70')} kind="code">
              observability.py L70
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L301-L304')} kind="code">
              http_server.py L301-L304
            </Cite>
            ; neither SageMaker entrypoint adds it{' '}
            <Cite tier={1} href={dlcUrl('scripts/docker/sglang/sagemaker_entrypoint.sh', 'L12-L50')}>
              sagemaker_entrypoint.sh L12-L50
            </Cite>
            . CloudWatch&apos;s token-level dashboard columns fill only for vLLM and SGLang
            containers{' '}
            <Cite tier={2} href={BLOG_METRICS}>
              AWS ML blog, 2026-06-18: SageMaker detailed metrics
            </Cite>
            , and on SGLang only with the flag. Set <code>SM_SGLANG_ENABLE_METRICS=true</code> on
            the DLC, or an empty value on an image built from <code>docker/serve</code>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Size the startup health-check timeout for download, load and graph capture against the 8-minute default, and move a DeepGEMM compile out of it, so every new instance comes up"
          >
            Budget the start against the 8-minute window
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On SGLang, <code>/ping</code> answers one question: has the model loaded. The HTTP
            server that serves it starts only after the scheduler process has loaded the weights,
            built the KV pools and captured CUDA graphs, and reported ready{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L1098-L1111')} kind="code">
              scheduler.py L1098-L1111
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L6128-L6131')} kind="code">
              scheduler.py L6128-L6131
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L1336-L1338')}>
              engine.py L1336-L1338
            </Cite>
            , so all of that time is spent inside SageMaker&apos;s window.{' '}
            <strong>
              SageMaker fails the launch if <code>/ping</code> has not begun answering 200 within 8
              minutes of startup
            </strong>
            , with a 2-second timeout on each attempt{' '}
            <Cite tier={1} href={SM_CONTRACT}>
              SageMaker docs: custom inference code with hosting services
            </Cite>
            . The production variant&apos;s <code>ContainerStartupHealthCheckTimeoutInSeconds</code>{' '}
            is the timeout for passing that check, from 60 to 3600 seconds, and{' '}
            <code>ModelDataDownloadTimeoutInSeconds</code> covers the download from Amazon S3 with
            the same range{' '}
            <Cite tier={1} href={SM_VARIANT}>
              SageMaker API: ProductionVariant
            </Cite>
            ; AWS&apos;s large-model page sets both to 1800 in its example{' '}
            <Cite tier={1} href={SM_LMI_HOSTING}>
              SageMaker docs: endpoint parameters for large model inference
            </Cite>
            .
          </Box>
          <Box variant="p">
            Every instance launch pays the full start, and SageMaker launches instances well after
            the first deploy: on endpoint updates, capacity changes, security patching and the
            replacement of unhealthy instances{' '}
            <Cite tier={1} href={SM_CONTRACT}>
              SageMaker docs: custom inference code with hosting services
            </Cite>
            . Set the startup timeout for download plus weight load plus graph capture, measured on
            a cold start of your model, rather than for container start.
          </Box>
          <Box variant="p">
            One start cost is easy to miss. On SM90 (compute capability 9.0, Hopper) or newer, SGLang
            runs block-quantized FP8 (8-bit floating point) linear layers on DeepGEMM{' '}
            <Cite
              tier={1}
              href={sglangUrl(`${SRT}/layers/deep_gemm_wrapper/configurer.py`, 'L32-L56')}
            >
              configurer.py L32-L56
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/layers/quantization/fp8_utils.py`, 'L1025-L1053')}>
              fp8_utils.py L1025-L1053
            </Cite>{' '}
            and compiles its kernels for each new weight shape inside startup, before the server is
            ready (section 8, Attention Backends and Kernels). SGLang&apos;s own log warning
            estimates that compile at 10 to 20 minutes, with no hardware or model stated{' '}
            <Cite
              tier={1}
              href={sglangUrl(`${SRT}/layers/deep_gemm_wrapper/compile_utils.py`, 'L166-L185')}
            >
              compile_utils.py L166-L185 (project estimate)
            </Cite>
            . Set against an 8-minute default window, our reading is that a cold block-FP8 start on
            these GPUs can fail its launch. Run <code>python -m sglang.compile_deep_gemm</code> with
            the exact serving flags while you build the image{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/compile_deep_gemm.py', 'L1-L48')}>
              compile_deep_gemm.py L1-L48
            </Cite>
            ; section 8 gives the cache directories to keep with it.
          </Box>
          <Box variant="p">
            The same design sets what <code>/ping</code> cannot tell you. It returns a static 200
            and never consults the engine{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L2123-L2126')} kind="code">
              http_server.py L2123-L2126
            </Cite>
            , the pattern AWS&apos;s contract page advises against, because SageMaker keeps
            routing requests to an instance whose <code>/ping</code> keeps answering 200{' '}
            <Cite tier={1} href={SM_CONTRACT}>
              SageMaker docs: custom inference code with hosting services
            </Cite>
            . By our reading of the code, an engine that hangs behind a live HTTP process keeps
            passing it, so watch the endpoint&apos;s invocation errors and SGLang&apos;s own
            metrics rather than instance health alone.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Deploy SGLang through HyperPod's inference operator with the two settings its gateway needs, and know which HyperPod feature runs vLLM only"
          >
            HyperPod: SGLang pods behind an SGLang-aware gateway
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            HyperPod&apos;s inference operator deploys the image you name, and its deploy page lists
            SGLang among the runtimes that download weights themselves at startup{' '}
            <Cite tier={1} href={HP_DEPLOY}>
              HyperPod docs: deploy models
            </Cite>
            ; every worked example on that page uses a vLLM image. AWS positions SGLang or vLLM on
            HyperPod for teams that &quot;need to control the serving image, runtime arguments,
            quantization, or distributed execution&quot;{' '}
            <Cite tier={2} href={BLOG_BEAM}>
              AWS ML blog, 2026-10-16: Reflection Beam
            </Cite>
            . The Reflection Beam sample is the first AWS-published SGLang deployment on HyperPod
            found in this research: an <code>InferenceEndpointConfig</code> that runs{' '}
            <code>python -m sglang.launch_server</code> with <code>--api-key</code> and{' '}
            <code>--admin-api-key</code>, and points the load balancer and all three Kubernetes
            probes at <code>/health</code>{' '}
            <Cite tier={2} href={`${BEAM_SAMPLE}#L1-L105`}>
              reflection-beam-sglang.yaml L1-L105 (AWS sample)
            </Cite>
            . The keys are safe there because <code>/health</code> bypasses them, and the start
            budget is a Kubernetes startup probe you set: the sample allows 360 checks 10 seconds
            apart{' '}
            <Cite tier={2} href={`${BEAM_SAMPLE}#L84-L91`}>
              reflection-beam-sglang.yaml L84-L91
            </Cite>
            .
          </Box>
          <Box variant="p">
            The HyperPod Inference Gateway routes to SGLang once it knows what it is talking to.
            Its <code>engineType</code> field, <code>vllm</code> or <code>sglang</code> with{' '}
            <code>vllm</code> the default, selects the Prometheus metric names the Endpoint Picker
            scrapes to score pods, and the page says to start SGLang with{' '}
            <code>--enable-metrics</code>{' '}
            <Cite tier={1} href={HP_GATEWAY}>
              HyperPod docs: Inference Gateway
            </Cite>
            . The Beam manifest passes no <code>--enable-metrics</code>{' '}
            <Cite tier={2} href={`${BEAM_SAMPLE}#L26-L61`}>
              reflection-beam-sglang.yaml L26-L61
            </Cite>
            , so to put it behind the gateway, add the flag and set <code>engineType: sglang</code>;
            as published, the replica serves no <code>/metrics</code> for the picker to score.
          </Box>
          <Box variant="p">
            HyperPod&apos;s built-in disaggregated prefill/decode is documented with vLLM worker
            images only, both carrying LMCache 0.4.3, vLLM 0.19.0 and NIXL (NVIDIA Inference Xfer
            Library) 1.0.0{' '}
            <Cite tier={1} href={HP_DPD}>
              HyperPod docs: disaggregated prefill/decode
            </Cite>
            . SGLang PD on a HyperPod cluster means running SGLang&apos;s own PD stack as ordinary
            Kubernetes workloads (section 15, PD Disaggregation; section 18, Multi-Node and
            Kubernetes Orchestrators). No AWS page or blog post read during this research gives a
            recipe for it, and AWS&apos;s disaggregated-inference post is built on llm-d with vLLM{' '}
            <Cite tier={2} href={BLOG_LLMD}>
              AWS ML blog: disaggregated inference powered by llm-d
            </Cite>
            . AWS&apos;s InstantStart control plane can place SGLang&apos;s cache-aware router in
            front of SGLang replicas on HyperPod{' '}
            <Cite tier={2} href={BLOG_INSTANTSTART}>
              AWS ML blog, 2026-09-04: HyperPod InstantStart
            </Cite>
            ; section 17, The Model Gateway, covers that router.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Route Trainium and Inferentia work to vLLM now, and know the hook an SGLang Neuron backend would use"
          >
            Trainium and Inferentia: serve with vLLM today
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            SGLang v0.5.22 has no Trainium or Inferentia support. Its README lists AWS Trainium
            under integrations in progress{' '}
            <Cite tier={1} href={sglangUrl('README.md', 'L58')}>
              README.md L58
            </Cite>
            , and a search of the tag&apos;s Python tree for Trainium, Inferentia and Neuron terms
            finds no backend code{' '}
            <Cite tier={1} href={sglangTreeUrl('python')} kind="code">
              python/ at v0.5.22
            </Cite>
            . The one SGLang reference a search of the Neuron SDK documentation returned is vLLM
            Neuron disabling logprobs for jump-forward decoding, &quot;taking inspiration from the
            original jump-forward implementation in SGLang&quot;{' '}
            <Cite tier={1} href={NEURON_DOC}>
              Neuron docs 2.33.0: vLLM Neuron additional config
            </Cite>
            .
          </Box>
          <Box variant="p">
            Out-of-tree hardware enters SGLang through a platform plugin: a pip package that
            registers an entry point in the <code>sglang.srt.platforms</code> group, loaded when{' '}
            <code>SGLANG_PLATFORM</code> names it, with startup failing if the named plugin is not
            installed{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/plugins/__init__.py`, 'L28')}>
              plugins/__init__.py L28
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/platforms/__init__.py`, 'L95-L130')}>
              platforms/__init__.py L95-L130
            </Cite>
            . Upstream Trainium work after v0.5.22 targets an out-of-tree Neuron platform plugin.
            PR #45897, merged on 2026-10-23 after the tag, lets such platforms bind group devices
            and custom ops and was tested on &quot;AWS trn3, 2 NeuronCores&quot;{' '}
            <Cite tier={2} href={PR_45897}>
              PR #45897 (project statement)
            </Cite>
            , and the open PR #45986 was motivated by per-shape compiles on Trainium through that
            plugin{' '}
            <Cite tier={2} href={PR_45986}>
              PR #45986 (project statement)
            </Cite>
            . No public repository for the plugin was located by the GitHub searches{' '}
            <code>sglang neuron</code>, <code>org:aws-neuron sglang</code> and{' '}
            <code>sglang trainium</code> on 2026-10-24.
          </Box>
          <Box variant="p">
            <strong>Against vLLM:</strong> both engines take out-of-tree hardware through Python
            entry points, <code>vllm.platform_plugins</code> in vLLM{' '}
            <Cite tier={1} href={VLLM_PLUGINS}>
              vLLM plugins/__init__.py L23 (v0.31.0)
            </Cite>{' '}
            and <code>sglang.srt.platforms</code> in SGLang. To serve on Trainium or Inferentia
            now, use vLLM with its Neuron plugin ({VLLM_NEURON_LINK}); on AWS, SGLang is a GPU
            choice.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Leave with a SageMaker endpoint configured to pass /ping inside its window with metrics on, or with the path that fits better"
          >
            Next step: an endpoint that passes its first health check
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ExpandableSection headerText="AWS-authored SGLang material, dated">
            <ul>
              <li>
                2026-10-16, Reflection Beam on HyperPod: the SGLang sample used above{' '}
                <Cite tier={2} href={BLOG_BEAM}>
                  AWS ML blog: Reflection Beam
                </Cite>
                .
              </li>
              <li>
                2026-09-25, MoE (mixture of experts) reinforcement learning on EKS with EFA and
                DeepEP: SGLang 0.5.17 as the rollout engine on the AWS SGLang DLC{' '}
                <Cite tier={2} href={BLOG_MOE_RL}>
                  AWS ML blog: MoE reinforcement learning on EKS
                </Cite>
                ; section 22, PD and Wide EP over EFA, carries its throughput claim with its
                conditions.
              </li>
              <li>
                2026-09-18, HyperPod Inference Gateway launch: works with any OpenAI-compatible
                model server, SGLang named among them{' '}
                <Cite tier={2} href={BLOG_GATEWAY}>
                  AWS ML blog: HyperPod Inference Gateway
                </Cite>
                .
              </li>
              <li>
                2026-09-18, SageMaker Inference year-to-date review: OpenAI-compatible endpoints in
                14 AWS Regions, with the vLLM and SGLang DLCs supported{' '}
                <Cite tier={2} href={BLOG_YTD}>
                  AWS ML blog: SageMaker Inference 2026 review
                </Cite>
                .
              </li>
              <li>
                2026-03-05, Strands Agents custom model provider: Llama 3.1 8B Instruct served by
                SGLang on an <code>ml.g6.12xlarge</code> endpoint built with ml-container-creator,
                with a parser added because SGLang returns OpenAI-format output{' '}
                <Cite tier={2} href={BLOG_STRANDS}>
                  AWS ML blog: Strands Agents custom model provider
                </Cite>
                .
              </li>
              <li>
                Code: a bring-your-own-container SGLang endpoint on <code>ml.p5.48xlarge</code>{' '}
                <Cite tier={2} href={AWSOME_SM}>
                  aws-samples/awsome-inference sglang-sagemaker (AWS sample)
                </Cite>
                .
              </li>
            </ul>
          </ExpandableSection>
          <Box variant="p">
            For a SageMaker AI endpoint, set these before the first deploy:
          </Box>
          <ol>
            <li>
              Image: the Ubuntu DLC tag for 0.5.22, or your own build{' '}
              <code>FROM lmsysorg/sglang:v0.5.22</code>, with <code>SGLANG_RUST_SERVER</code>{' '}
              unset.
            </li>
            <li>
              Host: <code>InferenceAmiVersion</code> set to{' '}
              <code>al2023-ami-sagemaker-inference-gpu-4-1</code>.
            </li>
            <li>
              Keys: no <code>SM_SGLANG_API_KEY</code>; only <code>SM_SGLANG_ADMIN_API_KEY</code>,
              as section 12&apos;s matrix gives it.
            </li>
            <li>
              Metrics: <code>SM_SGLANG_ENABLE_METRICS=true</code> on the DLC, an empty value on a{' '}
              <code>docker/serve</code> image.
            </li>
            <li>
              Start: for a block-FP8 model on SM90 or newer, the DeepGEMM cache built into the
              image; then <code>ContainerStartupHealthCheckTimeoutInSeconds</code> sized for
              download, load and graph capture, since the window without it is 8 minutes.
            </li>
            <li>
              Clients: OpenAI chat bodies on <code>/invocations</code>, and{' '}
              <code>Content-Type: application/json</code> on both paths.
            </li>
          </ol>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
            <code>{`# boto3, after SGLang's SageMaker docs page, with the start and metrics settings added
sm.create_model(
    ModelName="sglang-model",
    PrimaryContainer={
        "Image": "763104351884.dkr.ecr.us-west-2.amazonaws.com/sglang:0.5.22-gpu-py312-cu130-ubuntu24.04-sagemaker",
        "Environment": {
            "SM_SGLANG_MODEL_PATH": "openai/gpt-oss-20b",
            "SM_SGLANG_ENABLE_METRICS": "true",   # AWS DLC: true becomes a bare flag
        },
    },
    ExecutionRoleArn="<execution role ARN>",
)
sm.create_endpoint_config(
    EndpointConfigName="sglang-config",
    ProductionVariants=[{
        "VariantName": "default",
        "ModelName": "sglang-model",
        "InstanceType": "ml.g5.2xlarge",
        "InitialInstanceCount": 1,
        "InferenceAmiVersion": "al2023-ami-sagemaker-inference-gpu-4-1",
        "ContainerStartupHealthCheckTimeoutInSeconds": 1800,   # 60 to 3600
        "ModelDataDownloadTimeoutInSeconds": 1800,
    }],
)`}</code>
          </pre>
          <Box variant="p">
            On HyperPod, the matching settings are <code>engineType: sglang</code> on the gateway,{' '}
            <code>--enable-metrics</code> on the server and a startup probe sized for the same
            download, load and graph capture. With the path chosen, section 21, EC2 Instances,
            Images and GPU-Dependent Behaviour, picks the instance family and the image line.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
