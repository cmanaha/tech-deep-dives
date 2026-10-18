import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

// LMI V30 = DJL-Serving branch 0.38.0-lmi30-dlc at this commit.
const DJL = 'https://github.com/deepjavalibrary/djl-serving/blob';
const DJL30 = `${DJL}/8a99e6e56562bcdff4ef230e2a81b201cb61fe09`;
const LMI30 = `${DJL30}/serving`;
const LMI_GUIDE = `${LMI30}/docs/lmi/user_guides/vllm_user_guide.md`;
const LMI_CONFIG = `${LMI30}/docs/lmi/deployment_guide/configurations.md`;
const LMI_PROPS = `${DJL30}/engines/python/setup/djl_python/properties_manager/vllm_rb_properties.py`;
const LMI_RECOMMENDER = `${DJL30}/wlm/src/main/java/ai/djl/serving/wlm/LmiConfigRecommender.java`;
const LMI_DOCKERFILE = `${LMI30}/docker/lmi.Dockerfile`;
const lmiReqs = (sha: string) => `${DJL}/${sha}/serving/docker/lmi-container-requirements.txt#L12`;
const DJL_DOCS = 'https://docs.djl.ai/master/docs/serving/serving/docs/lmi';
const SM = 'https://docs.aws.amazon.com/sagemaker/latest/dg';
const HP = `${SM}/sagemaker-hyperpod-model-deployment`;
const MHCS = 'https://github.com/aws/model-hosting-container-standards';
const MHCS_TAG = `${MHCS}/blob/v0.1.16`;
const DECISION_GUIDE =
  'https://docs.aws.amazon.com/decision-guides/latest/decision-guides/bedrock-or-sagemaker.html';
const CMI = 'https://docs.aws.amazon.com/bedrock/latest/userguide/model-customization-import-model.html';
const BLOG = 'https://aws.amazon.com/blogs/machine-learning';

function SageMakerPathsDiagram() {
  return (
    <svg
      viewBox="0 0 880 360"
      role="img"
      aria-labelledby="sm-paths-title"
      style={{ width: '100%', minWidth: 660, height: 'auto' }}
    >
      <title id="sm-paths-title">
        The three SageMaker paths to host vLLM on an ownership spectrum, from most AWS-managed on
        the left to most you-managed on the right. Path A is LMI on DJL-Serving, which runs vLLM in
        async mode, the default since LMI v17, with LMI V30 bundling vLLM 0.31.0; you configure it
        with HF_MODEL_ID and OPTION keys and AWS owns the image. Path B is the AWS vLLM Deep
        Learning Container, an AWS-built image running vLLM&apos;s own server, published for vLLM
        0.31.0; AWS owns the image and you own config and the endpoint. Path C is
        Bring-Your-Own-Container, where you own the Dockerfile, the vLLM or SGLang version and the
        serving glue, and can start from vLLM&apos;s vllm-sagemaker Docker target. All three deploy
        onto the same SageMaker real-time or async inference endpoint, which provides managed
        autoscaling, IAM, VPC, CloudWatch and the model registry.
      </title>
      <style>
        {`
          .smcardA { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .smcardB { fill: #effcf8; stroke: #1f7a70; stroke-width: 1.5; }
          .smcardC { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .smbase { fill: #e9f2fb; stroke: #065299; stroke-width: 2; }
          .smtitle { fill: #0f1b2a; font: 600 14px sans-serif; text-anchor: middle; }
          .smsub { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .smspectrum { fill: #5f6b7a; font: 600 12px sans-serif; text-anchor: middle; letter-spacing: 0.4px; }
          .smbasetitle { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .smedge { stroke: #879596; stroke-width: 1.5; fill: none; marker-end: url(#sm-arrow); }
        `}
      </style>
      <defs>
        <marker id="sm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#879596" />
        </marker>
        <marker id="sm-spec-start" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M10,0 L0,5 L10,10 z" fill="#5f6b7a" />
        </marker>
        <marker id="sm-spec-end" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
        </marker>
      </defs>
      <rect x={0} y={0} width={880} height={360} rx={8} fill="#ffffff" />

      {/* Spectrum arrow */}
      <line
        x1={150}
        y1={28}
        x2={730}
        y2={28}
        stroke="#5f6b7a"
        strokeWidth={1.5}
        markerStart="url(#sm-spec-start)"
        markerEnd="url(#sm-spec-end)"
      />
      <text className="smspectrum" x={150} y={18} textAnchor="start">MORE AWS-MANAGED</text>
      <text className="smspectrum" x={730} y={18} textAnchor="end">MORE YOU-MANAGED</text>

      {/* Path A card */}
      <rect className="smcardA" x={20} y={50} width={260} height={150} rx={8} />
      <text className="smtitle" x={150} y={74}>A. LMI / DJL-Serving</text>
      <text className="smsub" x={150} y={96}>vLLM runs in async mode,</text>
      <text className="smsub" x={150} y={112}>the default since LMI v17;</text>
      <text className="smsub" x={150} y={128}>LMI V30 bundles vLLM 0.31.0.</text>
      <text className="smsub" x={150} y={152}>Config, not code:</text>
      <text className="smsub" x={150} y={168}>HF_MODEL_ID + OPTION_* keys</text>
      <text className="smsub" x={150} y={190} style={{ fontWeight: 600 }}>AWS owns the image.</text>

      {/* Path B card */}
      <rect className="smcardB" x={310} y={50} width={260} height={150} rx={8} />
      <text className="smtitle" x={440} y={74}>B. AWS vLLM DLC</text>
      <text className="smsub" x={440} y={96}>AWS-built image running</text>
      <text className="smsub" x={440} y={112}>vLLM&apos;s own server, deployed</text>
      <text className="smsub" x={440} y={128}>straight onto an endpoint;</text>
      <text className="smsub" x={440} y={144}>vLLM 0.31.0 images published.</text>
      <text className="smsub" x={440} y={168}>AWS owns the image;</text>
      <text className="smsub" x={440} y={190} style={{ fontWeight: 600 }}>you own config + endpoint.</text>

      {/* Path C card */}
      <rect className="smcardC" x={600} y={50} width={260} height={150} rx={8} />
      <text className="smtitle" x={730} y={74}>C. Bring-Your-Own-Container</text>
      <text className="smsub" x={730} y={96}>Your Dockerfile, your</text>
      <text className="smsub" x={730} y={112}>vLLM / SGLang version,</text>
      <text className="smsub" x={730} y={128}>your serving glue.</text>
      <text className="smsub" x={730} y={152}>Start from vLLM&apos;s</text>
      <text className="smsub" x={730} y={168}>vllm-sagemaker target.</text>
      <text className="smsub" x={730} y={190} style={{ fontWeight: 600 }}>You own the image.</text>

      {/* Connectors down to the shared endpoint */}
      <path className="smedge" d="M150 200 V250" />
      <path className="smedge" d="M440 200 V250" />
      <path className="smedge" d="M730 200 V250" />

      {/* Shared SageMaker endpoint base */}
      <rect className="smbase" x={20} y={254} width={840} height={86} rx={8} />
      <text className="smbasetitle" x={440} y={286}>SageMaker real-time / async inference endpoint</text>
      <text className="smsub" x={440} y={310}>managed autoscaling, IAM, VPC, CloudWatch,</text>
      <text className="smsub" x={440} y={326}>model registry</text>
    </svg>
  );
}

function BedrockVsSelfHostDiagram() {
  return (
    <svg
      viewBox="0 0 900 504"
      role="img"
      aria-labelledby="bedrock-tree-title"
      style={{ width: '100%', minWidth: 660, height: 'auto' }}
    >
      <title id="bedrock-tree-title">
        A decision tree for choosing between self-hosting vLLM and Amazon Bedrock. First, do you
        need custom or fine-tuned weights? If yes, is the architecture on the Bedrock Custom Model
        Import list? If it is, use Bedrock through Custom Model Import; if not, self-host vLLM. If
        you need no custom weights, do you need a specific vLLM feature such as a multi-LoRA
        fleet, prefill/decode disaggregation, or custom batching and scheduling? If yes, self-host
        vLLM. If no, do you need instance-level hardware control for cost at volume, or VPC and
        data-residency isolation beyond Bedrock&apos;s boundary? If yes, self-host vLLM. If no,
        use Bedrock, the lowest-ops choice. This is our synthesis, not an AWS decision document.
      </title>
      <style>
        {`
          .bq { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .bself { fill: #e9f2fb; stroke: #065299; stroke-width: 2; }
          .bbed { fill: #effcf8; stroke: #1f7a70; stroke-width: 2; }
          .bqt { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .bqs { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .bleaf { fill: #0f1b2a; font: 600 14px sans-serif; text-anchor: middle; }
          .bleafsub { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .bedge { stroke: #879596; stroke-width: 1.5; fill: none; marker-end: url(#bt-arrow); }
          .belbl { fill: #414d5c; font: 600 11px sans-serif; text-anchor: middle; }
        `}
      </style>
      <defs>
        <marker id="bt-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#879596" />
        </marker>
      </defs>
      <rect x={0} y={0} width={900} height={504} rx={8} fill="#ffffff" />

      {/* Q1: custom weights */}
      <rect className="bq" x={225} y={20} width={320} height={56} rx={6} />
      <text className="bqt" x={385} y={44}>Need custom or fine-tuned weights?</text>
      <text className="bqs" x={385} y={64}>weights you trained or tuned yourself</text>

      {/* Q1 -> Q1b (yes, right) */}
      <path className="bedge" d="M545 48 H725 V100" />
      <text className="belbl" x={635} y={40}>yes</text>

      {/* Q1b: Custom Model Import architecture */}
      <rect className="bq" x={600} y={100} width={250} height={76} rx={6} />
      <text className="bqt" x={725} y={122}>Architecture on the Bedrock</text>
      <text className="bqt" x={725} y={140}>Custom Model Import list?</text>
      <text className="bqs" x={725} y={160}>e.g. Llama, Mistral, Qwen, GPT-OSS</text>

      {/* Q1b -> Bedrock CMI (yes) and -> self-host (no) */}
      <path className="bedge" d="M665 176 V230" />
      <text className="belbl" x={683} y={207}>yes</text>
      <path className="bedge" d="M785 176 V230" />
      <text className="belbl" x={800} y={207}>no</text>

      <rect className="bbed" x={570} y={230} width={150} height={64} rx={6} />
      <text className="bleaf" x={645} y={256}>USE BEDROCK</text>
      <text className="bleafsub" x={645} y={276}>Custom Model Import</text>

      <rect className="bself" x={740} y={230} width={140} height={64} rx={6} />
      <text className="bleaf" x={810} y={256}>SELF-HOST vLLM</text>
      <text className="bleafsub" x={810} y={276}>other architectures</text>

      {/* Q1 -> Q2 (no, down) */}
      <path className="bedge" d="M385 76 V128" />
      <text className="belbl" x={403} y={104}>no</text>

      {/* Q2: vLLM feature */}
      <rect className="bq" x={225} y={128} width={320} height={72} rx={6} />
      <text className="bqt" x={385} y={152}>Need a specific vLLM feature?</text>
      <text className="bqs" x={385} y={172}>multi-LoRA fleet, P/D disaggregation,</text>
      <text className="bqs" x={385} y={188}>custom batching / scheduling</text>

      {/* Q2 -> SELF-HOST (yes, left) */}
      <path className="bedge" d="M225 164 H190" />
      <text className="belbl" x={207} y={156}>yes</text>

      <rect className="bself" x={20} y={132} width={170} height={64} rx={6} />
      <text className="bleaf" x={105} y={160}>SELF-HOST vLLM</text>
      <text className="bleafsub" x={105} y={180}>control &amp; specificity</text>

      {/* Q2 -> Q3 (no, down) */}
      <path className="bedge" d="M385 200 V252" />
      <text className="belbl" x={403} y={228}>no</text>

      {/* Q3: hardware control or isolation */}
      <rect className="bq" x={225} y={252} width={320} height={88} rx={6} />
      <text className="bqt" x={385} y={276}>Need instance-level hardware</text>
      <text className="bqt" x={385} y={294}>control for cost-at-volume, OR</text>
      <text className="bqs" x={385} y={314}>VPC / data-residency isolation</text>
      <text className="bqs" x={385} y={330}>beyond Bedrock&apos;s boundary?</text>

      {/* Q3 -> SELF-HOST (yes, left) */}
      <path className="bedge" d="M225 296 H105 V420" />
      <text className="belbl" x={165} y={288}>yes</text>

      {/* Q3 -> BEDROCK (no, down) */}
      <path className="bedge" d="M385 340 V420" />
      <text className="belbl" x={403} y={382}>no</text>

      <rect className="bself" x={20} y={420} width={170} height={64} rx={6} />
      <text className="bleaf" x={105} y={448}>SELF-HOST vLLM</text>
      <text className="bleafsub" x={105} y={468}>maximal control</text>

      <rect className="bbed" x={235} y={420} width={300} height={64} rx={6} />
      <text className="bleaf" x={385} y={448}>USE BEDROCK</text>
      <text className="bleafsub" x={385} y={468}>lowest ops, the startup default</text>
    </svg>
  );
}

function LmiConfigToEngineDiagram() {
  return (
    <svg
      viewBox="0 0 900 360"
      role="img"
      aria-labelledby="lmi-config-title"
      style={{ width: '100%', minWidth: 720, height: 'auto' }}
    >
      <title id="lmi-config-title">
        How LMI configuration reaches the vLLM engine. On the left, two equivalent config sources feed
        LMI: serving.properties using option.* keys, and environment variables using OPTION_*
        keys, where serving.properties overrides env. LMI then splits every key into one of
        two classes: LMI-native keys, which LMI translates into engine settings, and pass-through keys,
        which LMI forwards to vLLM EngineArgs without validating them; a key that names no EngineArgs
        field is dropped without an error. Both classes converge on vLLM&apos;s AsyncLLMEngine,
        which exposes the OpenAI-compatible API serving the chat completions and completions routes.
      </title>
      <style>
        {`
          .lcsrc { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .lclmi { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .lcnative { fill: #effcf8; stroke: #1f7a70; stroke-width: 1.5; }
          .lcpass { fill: #fdf3f1; stroke: #b1462f; stroke-width: 1.5; }
          .lcengine { fill: #e9f2fb; stroke: #065299; stroke-width: 2; }
          .lct { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .lcs { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .lcmono { fill: #5f6b7a; font: 11px monospace; text-anchor: middle; }
          .lcedge { stroke: #879596; stroke-width: 1.5; fill: none; marker-end: url(#lc-arrow); }
          .lclbl { fill: #5f6b7a; font: 600 10px sans-serif; text-anchor: middle; }
        `}
      </style>
      <defs>
        <marker id="lc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#879596" />
        </marker>
      </defs>

      {/* Config sources */}
      <rect className="lcsrc" x={20} y={40} width={200} height={56} rx={6} />
      <text className="lct" x={120} y={62}>serving.properties</text>
      <text className="lcmono" x={120} y={82}>option.* keys</text>

      <rect className="lcsrc" x={20} y={140} width={200} height={56} rx={6} />
      <text className="lct" x={120} y={162}>environment vars</text>
      <text className="lcmono" x={120} y={182}>OPTION_* keys</text>

      <text className="lclbl" x={120} y={120}>serving.properties overrides env</text>

      {/* LMI box */}
      <rect className="lclmi" x={300} y={88} width={150} height={60} rx={6} />
      <text className="lct" x={375} y={114}>LMI</text>
      <text className="lcs" x={375} y={132}>DJL-Serving</text>

      {/* edges sources -> LMI */}
      <path className="lcedge" d="M220 68 H260 V108 H300" />
      <path className="lcedge" d="M220 168 H260 V128 H300" />

      {/* Split into two classes */}
      <rect className="lcnative" x={510} y={36} width={210} height={64} rx={6} />
      <text className="lct" x={615} y={60}>LMI-native keys</text>
      <text className="lcs" x={615} y={80}>LMI translates</text>
      <text className="lcs" x={615} y={94}>into engine settings</text>

      <rect className="lcpass" x={510} y={136} width={210} height={72} rx={6} />
      <text className="lct" x={615} y={160}>pass-through keys</text>
      <text className="lcs" x={615} y={180}>forwarded opaquely to</text>
      <text className="lcs" x={615} y={194}>EngineArgs (not validated)</text>

      {/* edges LMI -> classes */}
      <path className="lcedge" d="M450 108 H480 V68 H510" />
      <path className="lcedge" d="M450 128 H480 V170 H510" />

      {/* Engine box */}
      <rect className="lcengine" x={770} y={86} width={110} height={120} rx={6} />
      <text className="lct" x={825} y={120}>vLLM</text>
      <text className="lcs" x={825} y={138}>AsyncLLMEngine</text>
      <text className="lcs" x={825} y={166}>OpenAI-compatible</text>
      <text className="lcs" x={825} y={180}>API</text>

      {/* edges classes -> engine */}
      <path className="lcedge" d="M720 68 H745 V120 H770" />
      <path className="lcedge" d="M720 172 H745 V150 H770" />

      <text className="lclbl" x={825} y={228}>/v1/chat/completions</text>
    </svg>
  );
}

function SageMakerHostingSurfaceDiagram() {
  return (
    <svg
      viewBox="0 0 920 440"
      role="img"
      aria-labelledby="sm-surface-title"
      style={{ width: '100%', minWidth: 680, height: 'auto' }}
    >
      <title id="sm-surface-title">
        The SageMaker hosting surface for vLLM. A real-time endpoint holds Inference Components:
        one component holds a base model that swaps LoRA adapters per request, components can
        scale to zero, and the endpoint router can send requests that share a prompt prefix to the
        same instance. HyperPod on EKS runs vLLM pods on one or several nodes with a tiered KV
        cache, cache-aware routing, KEDA autoscaling down to zero replicas, native disaggregated
        prefill and decode through a pdSpec, and an Inference Gateway whose endpoint picker
        defaults to llm-d. JumpStart is a one-click source that deploys catalog models onto a
        real-time endpoint, in the container JumpStart selects for each model.
      </title>
      <style>
        {`
          .ssplatform { fill: #f7fafd; stroke: #5f6b7a; stroke-width: 1.5; }
          .ssrt { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .sship { fill: #ffffff; stroke: #0972d3; stroke-width: 1.2; }
          .sshp { fill: #effcf8; stroke: #1f7a70; stroke-width: 1.5; }
          .ssjs { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .sspt { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .ssph { fill: #0f1b2a; font: 600 14px sans-serif; text-anchor: middle; }
          .sss { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .ssmono { fill: #5f6b7a; font: 11px monospace; text-anchor: middle; }
          .ssedge { stroke: #879596; stroke-width: 1.5; fill: none; marker-end: url(#ss-arrow); }
        `}
      </style>
      <defs>
        <marker id="ss-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#879596" />
        </marker>
      </defs>
      <rect x={0} y={0} width={920} height={440} rx={10} fill="#ffffff" />

      {/* Platform frame */}
      <rect className="ssplatform" x={12} y={12} width={896} height={416} rx={10} />
      <text className="ssph" x={460} y={36}>Amazon SageMaker AI: hosting surface for vLLM</text>

      {/* Real-time endpoint with Inference Components */}
      <rect className="ssrt" x={36} y={58} width={400} height={204} rx={8} />
      <text className="sspt" x={236} y={82}>Real-time endpoint: Inference Components</text>

      <rect className="sship" x={56} y={100} width={170} height={114} rx={6} />
      <text className="sspt" x={141} y={124}>IC: base model</text>
      <text className="sss" x={141} y={146}>swaps LoRA adapters</text>
      <text className="sss" x={141} y={162}>per request</text>
      <text className="ssmono" x={141} y={184}>OPTION_MAX_LORAS</text>
      <text className="sss" x={141} y={204}>scale-to-zero</text>

      <rect className="sship" x={246} y={100} width={170} height={114} rx={6} />
      <text className="sspt" x={331} y={124}>IC: base model B</text>
      <text className="sss" x={331} y={146}>its own copy count</text>
      <text className="sss" x={331} y={162}>(Min/Max)</text>
      <text className="sss" x={331} y={188}>coexists on the</text>
      <text className="sss" x={331} y={204}>same endpoint</text>

      <text className="sss" x={236} y={242}>router: PREFIX_AWARE keeps a prefix on one instance</text>

      {/* HyperPod (EKS) */}
      <rect className="sshp" x={460} y={58} width={424} height={204} rx={8} />
      <text className="sspt" x={672} y={82}>HyperPod (EKS)</text>
      <text className="sss" x={672} y={108}>vLLM pods (vllm/vllm-openai), single- or multi-node</text>
      <text className="sss" x={672} y={134}>tiered KV cache (L1 CPU, L2 Redis or tiered storage)</text>
      <text className="sss" x={672} y={160}>routing: prefix-aware, KV-aware, session, round-robin</text>
      <text className="sss" x={672} y={186}>KEDA autoscaling, minReplicaCount: 0</text>
      <text className="sss" x={672} y={212}>native prefill/decode: pdSpec (LMCache + NIXL, EFA)</text>
      <text className="sss" x={672} y={238}>Inference Gateway: llm-d endpoint picker (default)</text>

      {/* JumpStart */}
      <rect className="ssjs" x={36} y={316} width={300} height={86} rx={8} />
      <text className="sspt" x={186} y={342}>JumpStart: one-click source</text>
      <text className="sss" x={186} y={364}>catalog models land in the</text>
      <text className="sss" x={186} y={382}>container JumpStart picks</text>

      {/* JumpStart -> real-time endpoint */}
      <path className="ssedge" d="M186 316 V290 H236 V262" />
      <text className="sss" x={326} y={284}>deploys to the endpoint</text>
    </svg>
  );
}

export function AwsSageMakerBedrock() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Decide first whether Amazon Bedrock removes the need to run vLLM, then pick how much of the container you own on SageMaker, configure it, size the endpoint and read vLLM's own metrics in CloudWatch (verified against vLLM v0.31.0, commit db9527a4, and SageMaker Large Model Inference (LMI) V30, 2026-10-16)"
          >
            25. vLLM on SageMaker &amp; vs Bedrock
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Two decisions, nested: whether calling <strong>Amazon Bedrock&apos;s</strong> managed
            model API removes the need for an inference server, and if not, which of SageMaker&apos;s
            three hosting paths runs vLLM, from an AWS-owned container to your own. Then come the
            mechanics that decide whether a deploy works: LMI configuration, endpoint limits,
            scaling, HyperPod and JumpStart, observability, and placement across SageMaker, Amazon
            EKS (Elastic Kubernetes Service) and EC2.
          </Box>
          <Box variant="p">
            AWS&apos;s decision guide says to choose Bedrock <em>&quot;if you need a fully managed,
            serverless platform to build, run, and operate AI applications and agents at production
            scale&quot;</em>, and to consider SageMaker AI <em>&quot;when you need to manage cost,
            throughput, and latency tradeoffs&quot;</em>{' '}
            <Cite tier={1} href={DECISION_GUIDE}>AWS Decision Guide: Amazon Bedrock or Amazon SageMaker AI?</Cite>.
            The guide does not mention vLLM, which sits on the SageMaker side of that line, so the
            vLLM-specific mapping in the Bedrock section below is our synthesis. The three SageMaker
            hosting paths are documented first-party.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Choose how much of the container AWS owns, and know which vLLM version and request surface each choice gives you"
          >
            The three SageMaker paths to run vLLM
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            SageMaker hosts vLLM at three points on a spectrum of how much of the container and
            serving stack AWS owns: LMI, the AWS vLLM Deep Learning Container (DLC), and your own
            container. The diagram orients them; the expandable sections walk each.
          </Box>

          <div style={{ overflowX: 'auto' }}>
            <Box variant="small" color="text-status-info">
              Three SageMaker paths to host vLLM, ordered by how much AWS owns vs. you own
            </Box>
            <SageMakerPathsDiagram />
          </div>

          <Alert type="info">
            <strong>What all three share:</strong> a <em>SageMaker endpoint</em>, with autoscaling,
            IAM (Identity and Access Management), VPC (Virtual Private Cloud) attachment, CloudWatch
            and the model registry from SageMaker. A, B and C differ in{' '}
            <strong>who owns the container</strong>: AWS (A and B) or you (C).
          </Alert>

          <ExpandableSection
            headerText="Path A: LMI / DJL-Serving runs vLLM in async mode (the managed path)"
            defaultExpanded
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The LMI containers are <em>&quot;a set of high-performance Docker Containers purpose
                built for large language model (LLM) inference&quot;</em>; the project provides{' '}
                <em>&quot;containers that support vLLM and TensorRT-LLM to deploy LLMs on AWS
                SageMaker Endpoints&quot;</em>{' '}
                <Cite tier={1} href={`${DJL_DOCS}/index.html`}>DJL docs: LMI container overview</Cite>,
                each bundling the library with the DJL-Serving model server (DJL: Deep Java Library).
              </Box>
              <Box variant="p">
                <strong>vLLM is selected by configuration, and in current images by default.</strong>{' '}
                Since LMI v17 the default is async mode, which <em>&quot;integrates with the vLLM
                Async Engine via the OpenAI modules&quot;</em> and keeps LMI <em>&quot;in parity with
                upstream vLLM with respect to both engine-configurations and API schemas&quot;</em>{' '}
                <Cite tier={1} href={`${LMI_GUIDE}#L78-L81`}>LMI vLLM user guide L78-L81 (V30 branch)</Cite>.
                No backend flag is needed: the async quick start sets only <code>HF_MODEL_ID</code>{' '}
                and <code>TENSOR_PARALLEL_DEGREE=max</code>{' '}
                <Cite tier={1} href={`${LMI_GUIDE}#L83-L97`}>L83-L97</Cite>. The older rolling-batch
                mode (<code>OPTION_ROLLING_BATCH=vllm</code>) still ships, but async mode{' '}
                <em>&quot;will become the default, and only supported mode, in an upcoming
                release&quot;</em>{' '}
                <Cite tier={1} href={`${LMI_GUIDE}#L81-L120`}>L81-L120</Cite>, so build new deploys
                on async mode.
              </Box>
              <Alert type="info">
                <strong>When Path A fits:</strong> you want vLLM&apos;s throughput without owning a
                container or pinning a vLLM version. AWS owns the image and its upgrade cadence (LMI
                V30 bundles vLLM 0.31.0); you own a handful of <code>OPTION_*</code> variables. This
                is the default recommendation for most teams that self-host on SageMaker.
              </Alert>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="Path B: the AWS vLLM Deep Learning Container deployed directly on an endpoint">
            <SpaceBetween size="s">
              <Box variant="p">
                AWS publishes a <strong>vLLM Deep Learning Container (DLC)</strong>, an AWS-built
                image of vLLM&apos;s own server. Its SageMaker variant <em>&quot;accepts model
                configuration via environment variables and serves on port 8080&quot;</em>, with
                engine arguments as <code>SM_VLLM_*</code> variables such as{' '}
                <code>SM_VLLM_MODEL</code>{' '}
                <Cite tier={1} href="https://aws.github.io/deep-learning-containers/vllm/deployment/sagemaker/">AWS DLC docs: vLLM on SageMaker</Cite>,
                and ECR (Elastic Container Registry) Public carries a vLLM 0.31.0 SageMaker image,{' '}
                <code>0.31.0-gpu-py312-cu130-ubuntu24.04-sagemaker-v1.2</code>{' '}
                <Cite tier={1} href="https://gallery.ecr.aws/deep-learning-containers/vllm">ECR Public: deep-learning-containers/vllm</Cite>.
                In Path A the server is DJL-Serving with vLLM as its engine; here the server{' '}
                <em>is</em> vLLM, and AWS still builds and patches the image.
              </Box>
              <Box variant="p">
                Real-time endpoints also expose an OpenAI-compatible path,{' '}
                <code>/openai/v1/chat/completions</code>, with short-lived bearer tokens the
                SageMaker SDK signs locally, so the client needs no SigV4 (AWS Signature Version 4)
                wrapper; the vLLM DLC is on its supported-container list{' '}
                <Cite tier={1} href={`${SM}/realtime-endpoints-openai-compatible.html`}>SageMaker docs: OpenAI-compatible APIs</Cite>.
                An OpenAI SDK client reaches a Path B endpoint by setting <code>base_url</code> to{' '}
                <code>https://runtime.sagemaker.REGION.amazonaws.com/endpoints/ENDPOINT_NAME/openai/v1</code>.
              </Box>
              <Alert type="info">
                <strong>When Path B fits:</strong> you want vLLM&apos;s own server while AWS owns
                the image build and its security updates.
              </Alert>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="Path C: bring your own container, starting from vLLM's own SageMaker image">
            <SpaceBetween size="s">
              <Box variant="p">
                SageMaker supports <strong>bring-your-own-container (BYOC)</strong>: package any
                server that answers the endpoint runtime contract, <code>/invocations</code> and{' '}
                <code>/ping</code> on port 8080{' '}
                <Cite tier={1} href={`${SM}/hosting-faqs.html`}>SageMaker hosting FAQs</Cite>. Stock
                vLLM already speaks that contract: the Python API server that{' '}
                <code>vllm serve</code> builds by default registers <code>/ping</code> (GET and POST)
                and <code>/invocations</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/entrypoints/serve/sagemaker/api_router.py', 'L91-L113')} kind="code">sagemaker/api_router.py L91-L113</Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/entrypoints/launchers/app.py', 'L45')} kind="code">launchers/app.py L45</Cite>.
                The repository&apos;s <code>vllm-sagemaker</code> Docker target{' '}
                <Cite tier={1} href={vllmUrl('docker/Dockerfile', 'L1377-L1381')} kind="code">Dockerfile L1377-L1381</Cite>{' '}
                runs <code>examples/deployment/sagemaker-entrypoint.sh</code>, which turns every{' '}
                <code>SM_VLLM_*</code> variable into a flag, sets <code>--port 8080</code> and
                launches <code>vllm serve</code>{' '}
                <Cite tier={1} href={vllmUrl('examples/deployment/sagemaker-entrypoint.sh', 'L1-L24')} kind="code">sagemaker-entrypoint.sh L1-L24</Cite>.
                An image built from that target needs no serving glue of its own.
              </Box>
              <Box variant="p">
                For other servers, the AWS Labs <strong>ml-container-creator</strong> CLI generates
                SageMaker BYOC images for vLLM, SGLang, TensorRT-LLM and DJL/LMI, for real-time and
                async endpoints{' '}
                <Cite tier={1} href="https://github.com/awslabs/ml-container-creator/tree/bb89cf9de839f0b6e027f011d2264f326138fb0c">awslabs/ml-container-creator</Cite>.
                Path C fits a specific vLLM or SGLang version, a custom patch, or a dependency neither LMI nor the DLC ships. You
                own the Dockerfile, and with it the upgrade and security burden.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Table
            variant="embedded"
            header={<Header variant="h3">The three paths at a glance</Header>}
            columnDefinitions={[
              { id: 'path', header: 'Path', cell: (i) => <strong>{i.path}</strong> },
              { id: 'owns', header: 'Who owns the container', cell: (i) => i.owns },
              { id: 'select', header: 'How vLLM runs', cell: (i) => i.select },
              { id: 'fit', header: 'Reach for it when', cell: (i) => i.fit },
            ]}
            items={[
              {
                path: 'A. LMI / DJL-Serving',
                owns: 'AWS (the LMI image)',
                select: 'Async mode by default (LMI v17+); V30 bundles vLLM 0.31.0. Configure with HF_MODEL_ID and OPTION_* keys.',
                fit: 'You want vLLM throughput with the least ownership; AWS handles image + upgrades.',
              },
              {
                path: 'B. AWS vLLM DLC',
                owns: 'AWS (the vLLM image)',
                select: "vLLM's own server on port 8080, configured with SM_VLLM_* variables",
                fit: "You want vLLM's native surface but still want AWS to maintain the container.",
              },
              {
                path: 'C. BYOC',
                owns: 'You (your Dockerfile)',
                select: "Whatever you build in; vLLM's vllm-sagemaker target already answers /ping and /invocations",
                fit: 'You need a specific version, a custom patch, or serving glue the others lack.',
              },
            ]}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Set LMI keys knowing which ones LMI checks and which go straight to vLLM, and read off the vLLM version behind each LMI release"
          >
            Configuring vLLM under LMI, and a worked deploy
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            LMI takes config as a <code>serving.properties</code> file of <code>option.*</code> keys or as{' '}
            <code>OPTION_*</code> environment variables, and where both are set,{' '}
            <strong><code>serving.properties</code> overrides the environment</strong>{' '}
            <Cite tier={1} href={`${LMI_CONFIG}#L13-L14`}>LMI configurations.md L13-L14</Cite>.{' '}
            <strong>LMI-native</strong> keys are ones LMI <em>translates</em> into engine settings.{' '}
            <strong>Pass-through</strong> keys go to vLLM&apos;s <code>EngineArgs</code> and{' '}
            <em>&quot;are not processed or validated by LMI&quot;</em>{' '}
            <Cite tier={1} href={`${LMI_GUIDE}#L157-L158`}>LMI vLLM user guide L157-L158</Cite>.
            The code forwards only keys that name an <code>EngineArgs</code> field, so a misspelled
            key is dropped without an error, and a valid key with a bad value fails when the engine
            starts{' '}
            <Cite tier={1} href={`${LMI_PROPS}#L247-L272`} kind="doc-code-conflict">vllm_rb_properties.py L247-L272 (V30 branch)</Cite>.
          </Box>

          <div style={{ overflowX: 'auto' }}>
            <Box variant="small" color="text-status-info">
              LMI config sources split into LMI-native (translated) vs pass-through (forwarded) keys,
              both reaching vLLM&apos;s AsyncLLMEngine
            </Box>
            <LmiConfigToEngineDiagram />
          </div>

          <Table
            variant="embedded"
            header={<Header variant="h3">The LMI config keys you reach for most</Header>}
            columnDefinitions={[
              { id: 'key', header: 'Key (env form)', cell: (i) => <code>{i.key}</code> },
              { id: 'default', header: 'Default / example', cell: (i) => i.def },
              { id: 'what', header: 'What it does', cell: (i) => i.what },
            ]}
            items={[
              { key: 'OPTION_TENSOR_PARALLEL_DEGREE', def: 'unset: all GPUs ("max")', what: 'Tensor-parallel degree across the instance GPUs.' },
              { key: 'OPTION_MAX_ROLLING_BATCH_SIZE', def: '32 in async mode (256 with rolling batch)', what: 'Max concurrent sequences in the continuous batch (vLLM max_num_seqs).' },
              { key: 'OPTION_QUANTIZE', def: 'awq / fp8 / bitsandbytes', what: 'Weight quantization scheme.' },
              { key: 'OPTION_DTYPE', def: 'auto (from the model config)', what: 'Compute dtype for activations/weights.' },
              { key: 'OPTION_MAX_MODEL_LEN', def: 'e.g. 8192', what: 'Max context length the engine will allocate for.' },
              { key: 'OPTION_GPU_MEMORY_UTILIZATION', def: 'e.g. 0.9', what: 'Fraction of GPU memory vLLM may claim for weights + KV (key-value) cache.' },
              { key: 'OPTION_ENABLE_PREFIX_CACHING', def: 'true / false', what: 'Turns on automatic prefix caching (see section 6).' },
              { key: 'OPTION_ENABLE_LORA / OPTION_MAX_LORAS', def: 'false / e.g. 4', what: 'Enables multi-LoRA (Low-Rank Adaptation) serving and caps simultaneously loaded adapters (section 13).' },
              { key: 'OPTION_TRUST_REMOTE_CODE', def: 'false', what: 'Allows custom modeling code from the model repo.' },
              { key: 'OPTION_MODEL_LOADING_TIMEOUT', def: '1200 (s) in the V30 image', what: 'How long LMI waits for the model to load before failing.' },
              { key: 'HF_MODEL_ID', def: 'org/model | s3://... | /opt/ml/model', what: 'Hugging Face Hub id (needs HF_TOKEN for gated models), an S3 URI, or a model_data S3DataSource mounted at /opt/ml/model.' },
            ]}
          />
          <Box variant="small">
            The defaults are what the V30 code sets, and four differ from{' '}
            <Cite tier={1} href={`${LMI_CONFIG}#L91-L96`} kind="doc-code-conflict">LMI configurations.md L91-L96</Cite>,
            which lists 1, 256, fp16 and 1800 s. An unset tensor-parallel degree becomes every GPU,
            and in async mode the batch cap is 32{' '}
            <Cite tier={1} href={`${LMI_RECOMMENDER}#L88-L136`} kind="code">LmiConfigRecommender.java L88-L136</Cite>;
            the dtype default is <code>auto</code>{' '}
            <Cite tier={1} href={`${LMI_PROPS}#L70`} kind="code">vllm_rb_properties.py L70</Cite>;
            the image sets <code>MODEL_LOADING_TIMEOUT=1200</code>{' '}
            <Cite tier={1} href={`${LMI_DOCKERFILE}#L33`} kind="code">lmi.Dockerfile L33</Cite>.
            Other rows are examples. LMI&apos;s defaults for <code>max_num_seqs</code>,{' '}
            <code>max_num_batched_tokens</code> and <code>max_loras</code> differ from{' '}
            <code>vllm serve</code>{' '}
            <Cite tier={1} href={`${LMI_GUIDE}#L229-L231`}>LMI vLLM user guide L229-L231</Cite>, so
            set them explicitly before comparing an LMI endpoint with a <code>vllm serve</code>{' '}
            benchmark.
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">LMI release and the vLLM it bundles</Header>}
            columnDefinitions={[
              { id: 'lmi', header: 'LMI release', cell: (i) => <strong>{i.lmi}</strong> },
              { id: 'date', header: 'Published', cell: (i) => i.date },
              { id: 'vllm', header: 'Bundled vLLM', cell: (i) => i.vllm },
              { id: 'src', header: 'Evidence', cell: (i) => <Cite tier={1} href={i.href}>{i.src}</Cite> },
            ]}
            items={[
              { lmi: 'V30', date: '2026-10-15', vllm: '0.31.0', src: 'requirements, branch 0.38.0-lmi30-dlc', href: lmiReqs('8a99e6e56562bcdff4ef230e2a81b201cb61fe09') },
              { lmi: 'V29', date: '2026-09-21', vllm: '0.28.0', src: 'requirements, branch 0.38.0-lmi29-dlc', href: lmiReqs('9c75526391d8e858bf4bd4172929cbf11a4ae84d') },
              { lmi: 'V28', date: '2026-08-06', vllm: '0.26.0', src: 'requirements, LMI V28 branch', href: lmiReqs('42d8a9db76ee036d48010208536faffa18e4a7e4') },
              { lmi: 'V27', date: 'July 2026', vllm: '0.23.0', src: 'DJL docs: LMI release notes', href: `${DJL_DOCS}/release_notes.html` },
            ]}
          />
          <Box variant="p">
            <strong>LMI V30 bundles vLLM 0.31.0</strong> and shipped on 2026-10-15, ten days after
            upstream v0.31.0{' '}
            <Cite tier={1} href="https://github.com/vllm-project/vllm/releases/tag/v0.31.0">vLLM v0.31.0 release</Cite>,
            so Path A runs a current engine. Images live in ECR account <code>763104351884</code>,
            repository <code>djl-inference</code>; V30&apos;s tag is{' '}
            <code>0.38.0-lmi30.0.0-cu130-v1.0</code>{' '}
            <Cite tier={1} href="https://github.com/aws/deep-learning-containers/releases/tag/v1.0-djl-0.38.0-inf-lmi-30.0.0-cu130">AWS DLC release: LMI 30.0.0</Cite>.
            Pin that tag and check its bundled vLLM here before relying on a flag from a newer vLLM
            release. The per-branch requirements file is the record to check: the DJL release notes
            on master stop at V27.
          </Box>

          <Box variant="div">
            <Box variant="h3">A worked deploy</Box>
            <Box variant="p">
              Pass the LMI image URI and your config as environment variables, then{' '}
              <code>deploy()</code> to a GPU instance. Async mode needs no flag, and passing the URI
              directly avoids depending on the SDK&apos;s image map for a new LMI release:
            </Box>
            <pre style={{ overflowX: 'auto', fontSize: '12px', lineHeight: 1.5 }}>{`# SageMaker Python SDK v2 API
import sagemaker

# LMI V30 image as published in its release (us-west-2)
container_uri = (
    "763104351884.dkr.ecr.us-west-2.amazonaws.com/"
    "djl-inference:0.38.0-lmi30.0.0-cu130-v1.0"
)

model = sagemaker.Model(
    image_uri=container_uri,
    role=role,
    env={
        "HF_MODEL_ID": "meta-llama/Llama-3.1-8B-Instruct",
        "TENSOR_PARALLEL_DEGREE": "max",
    },
)

predictor = model.deploy(
    instance_type="ml.g5.12xlarge",
    initial_instance_count=1,
)`}</pre>
            <Box variant="p">
              A higher-level <code>sagemaker.djl_inference.model.DJLModel</code> wrapper takes the
              same <code>OPTION_*</code> config and infers an image{' '}
              <Cite tier={1} href="https://github.com/aws/sagemaker-python-sdk/blob/v2.257.7/src/sagemaker/djl_inference/model.py#L39-L135" kind="code">sagemaker-python-sdk v2.257.7: djl_inference/model.py L39-L135</Cite>.
            </Box>
          </Box>

          <Alert type="info">
            <strong>One route, two request schemas.</strong> The same <code>/invocations</code> route
            serves both the LMI-native <code>{'{"inputs", "parameters"}'}</code> schema and the OpenAI{' '}
            <code>{'{"messages": [...]}'}</code> schema: the presence of a <code>messages</code>{' '}
            field triggers a <code>chat.completion</code> response. Streaming uses SageMaker&apos;s{' '}
            <code>/invocations-response-stream</code> with <code>{'"stream": true'}</code> (JSON-lines{' '}
            <code>chat.completion.chunk</code> events){' '}
            <Cite tier={1} href={`${DJL_DOCS}/user_guides/chat_input_output_schema.html`}>DJL docs: Chat input/output schema</Cite>{' '}
            <Cite tier={1} href="https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_runtime_InvokeEndpointWithResponseStream.html" accessed="2026-10-18">SageMaker API: InvokeEndpointWithResponseStream</Cite>.
            In async mode the schemas follow upstream vLLM&apos;s OpenAI API (section 12){' '}
            <Cite tier={1} href={`${LMI_GUIDE}#L78-L81`}>LMI vLLM user guide L78-L81</Cite>.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick the endpoint type by payload size and generation length, raise the deploy settings that otherwise fail a large model at startup, and keep repeat prefixes on a warm instance"
          >
            Endpoint types, limits, and the streaming timeout
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every container path lands on a SageMaker endpoint, and the endpoint <em>type</em>{' '}
            decides your payload ceiling, your timeout, and whether scale-to-zero is possible.
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">SageMaker endpoint types for vLLM</Header>}
            columnDefinitions={[
              { id: 'type', header: 'Endpoint type', cell: (i) => <strong>{i.type}</strong> },
              { id: 'gpu', header: 'GPU', cell: (i) => i.gpu },
              { id: 'payload', header: 'Payload / timeout', cell: (i) => i.lim },
              { id: 'use', header: 'Use it for', cell: (i) => i.use },
            ]}
            items={[
              { type: 'Real-time', gpu: 'Yes', lim: '25 MB payload (6 MB in the API reference); 60 s (8 min streaming)', use: 'The PRIMARY choice: interactive, low-latency, streaming serving.' },
              { type: 'Asynchronous', gpu: 'Yes', lim: '1 GB payload; 60 min timeout', use: 'Long / large / batch-like requests; supports scale-to-zero.' },
              { type: 'Batch Transform', gpu: 'Yes (job)', lim: 'Job-based, offline', use: 'Niche offline eval / bulk generation.' },
              { type: 'Serverless', gpu: 'No', lim: '4 MB payload', use: 'INCOMPATIBLE with vLLM: no GPU.' },
            ]}
          />
          <Box variant="small">
            Limits from <Cite tier={1} href={`${SM}/hosting-faqs.html`}>SageMaker hosting FAQs</Cite>;
            endpoint types from{' '}
            <Cite tier={1} href={`${SM}/model-deploy-feature-matrix.html`} accessed="2026-10-18">SageMaker deploy feature matrix</Cite>.
            AWS&apos;s pages disagree on the real-time payload: the FAQs say 25 MB, while the
            feature matrix lists under 6 MB and the InvokeEndpoint API reference caps the body at
            6,291,456 bytes{' '}
            <Cite tier={1} href="https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_runtime_InvokeEndpoint.html" accessed="2026-10-18">SageMaker API: InvokeEndpoint</Cite>.
            Test a payload above 6 MB before you design around it.
          </Box>

          <Alert type="warning">
            <strong>The streaming-timeout footgun.</strong> A real-time <em>non-streaming</em> request
            hard-caps at <strong>60 seconds</strong>. Streaming via{' '}
            <code>/invocations-response-stream</code> extends that to <strong>8 minutes</strong>. A
            long generation that does <em>not</em> stream fails at 60 s, so for very long jobs,
            either stream or move to an <strong>Asynchronous</strong> endpoint (60 min / 1 GB). The
            FAQs put the real-time payload ceiling at <strong>25 MB</strong>, streaming or not{' '}
            <Cite tier={1} href={`${SM}/hosting-faqs.html`}>SageMaker hosting FAQs</Cite>; the API
            reference still says 6 MB.
          </Alert>

          <Alert type="warning">
            <strong>Large-model deploy settings to raise.</strong> vLLM models are big and slow to
            load, so the SageMaker defaults work against you:
            <ul>
              <li>
                <code>VolumeSizeInGB</code>: raise it for models over 30 GB on an instance without a
                local disk, to slightly more than the model&apos;s size. By our arithmetic a 70B model in FP16 (16-bit floating point,
                about 140 GB of weights) wants roughly 180 GB.
              </li>
              <li>
                <code>ModelDataDownloadTimeoutInSeconds</code>: raise it for models over 40 GB;
                AWS&apos;s example uses 1800.
              </li>
              <li>
                <code>ContainerStartupHealthCheckTimeoutInSeconds</code>: AWS&apos;s example uses
                1800. Keep it at least <code>OPTION_MODEL_LOADING_TIMEOUT</code> (1200 s in the
                V30 image), or the startup health check times out while vLLM is still loading.
              </li>
            </ul>
            <Cite tier={1} href={`${SM}/large-model-inference-hosting.html`}>SageMaker large-model inference hosting</Cite>{' '}
            <Cite tier={1} href={`${LMI_CONFIG}#L96`}>LMI configurations.md L96</Cite>{' '}
            <Cite tier={1} href={`${LMI_DOCKERFILE}#L33`} kind="code">lmi.Dockerfile L33</Cite>
          </Alert>

          <Box variant="div">
            <Box variant="h3">Keeping repeat prefixes on a warm instance</Box>
            <Box variant="p">
              vLLM reuses the KV cache of a repeated prefix only on the instance that computed it
              (section 6), so on a multi-instance endpoint the routing decides the hit rate.
              SageMaker has two controls for it, and both work with vLLM.
            </Box>
            <ul>
              <li>
                <strong>Prefix-aware routing</strong> (endpoint configuration, no container change).
                Set <code>RoutingConfig.RoutingStrategy</code> to <code>PREFIX_AWARE</code> on the
                production variant. In <code>PrefixAwareRoutingConfig</code>,{' '}
                <code>PrefixLength</code> is how much of the request is matched (raw body bytes on
                the native Invoke API, so serialize prompts consistently) and{' '}
                <code>ConcurrencyThreshold</code> is the in-flight count at which a request overflows
                to a less loaded instance. AWS reports P50 TTFT (time to first token) down by up to
                77% on Llama 3.1 70B across seven ml.p5.48xlarge instances running vLLM{' '}
                <Cite tier={2} href={`${BLOG}/reduce-llm-latency-with-prefix-aware-routing-on-amazon-sagemaker-inference/`}>AWS ML Blog: prefix-aware routing (vendor benchmark)</Cite>.
              </li>
              <li>
                <strong>Stateful sessions</strong> (container). vLLM wraps its{' '}
                <code>/invocations</code> handler in <code>stateful_session_manager()</code> from{' '}
                <code>aws/model-hosting-container-standards</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/entrypoints/serve/sagemaker/api_router.py', 'L107-L109')} kind="code">api_router.py L107-L109</Cite>.
                Set <code>SAGEMAKER_ENABLE_STATEFUL_SESSIONS=true</code> (default{' '}
                <code>false</code>); a client opens a session with{' '}
                <code>SessionId=&quot;NEW_SESSION&quot;</code> and sends the returned id in{' '}
                <code>X-Amzn-SageMaker-Session-Id</code>, and SageMaker routes the session to one
                instance until <code>SAGEMAKER_SESSIONS_EXPIRATION</code> (1200 s by default){' '}
                <Cite tier={1} href={`${MHCS_TAG}/docs/sagemaker/04_sticky_session_routing.md`}>model-hosting-container-standards v0.1.16: sticky sessions</Cite>.
              </li>
            </ul>
            <Box variant="p">
              Neither control holds KV blocks for you. The library&apos;s session state is a
              per-session directory of JSON files{' '}
              <Cite tier={1} href={`${MHCS_TAG}/python/model_hosting_container_standards/sagemaker/sessions/manager.py#L17-L53`} kind="code">sessions/manager.py L17-L53</Cite>;
              the reuse comes from vLLM&apos;s ordinary prefix cache on the chosen instance. Our
              reading: prefix-aware routing suits a system prompt shared across many users, and
              sessions suit multi-turn chats where one user&apos;s history is the prefix.
            </Box>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pack several models on one endpoint, scale idle ones to zero, and pick the concurrency metric that sees streaming requests"
          >
            Scaling on SageMaker: Inference Components, autoscaling &amp; scale-to-zero
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Inference Components (ICs)</strong> are the modern hosting object on a
            real-time endpoint: a container plus a model that reserves a slice of accelerators and
            memory and carries its own copy count (<code>RuntimeConfig.CopyCount</code>), which
            autoscaling moves between the minimum and maximum capacity you register for{' '}
            <code>sagemaker:inference-component:DesiredCopyCount</code>{' '}
            <Cite tier={1} href={`${SM}/endpoint-auto-scaling-zero-instances.html`} accessed="2026-10-18">SageMaker: scale an endpoint to zero instances</Cite>. Several
            ICs can share one endpoint, which is the shape the multi-LoRA pattern wants: one IC holds
            a vLLM or LMI base model that swaps LoRA adapters per request (section 13), capped by{' '}
            <code>OPTION_MAX_LORAS</code>, next to other base-model ICs{' '}
            <Cite tier={1} href={`${SM}/endpoint-auto-scaling-policy.html`}>SageMaker endpoint auto-scaling policy</Cite>{' '}
            <Cite tier={2} href={`${BLOG}/efficient-and-cost-effective-multi-tenant-lora-serving-with-amazon-sagemaker/`}>AWS ML Blog: multi-tenant LoRA serving</Cite>.
          </Box>

          <Alert type="info">
            <strong>On a real-time endpoint, scale-to-zero is an Inference-Component feature.</strong>{' '}
            Plain variant real-time endpoints cannot scale to zero; ICs can, via{' '}
            <code>MinInstanceCount: 0</code> +{' '}
            <code>ManagedInstanceScaling</code>. Scale-out from zero is driven by the{' '}
            <code>NoCapacityInvocationFailures</code> step policy, and provisioning back up{' '}
            <em>&quot;takes several minutes&quot;</em>, during which invocations return an error{' '}
            <Cite tier={1} href={`${SM}/endpoint-auto-scaling-zero-instances.html`}>SageMaker: scale an endpoint to zero instances</Cite>.
            That is fine for dev and batch tenants and too slow for latency-critical paths.
          </Alert>

          <Table
            variant="embedded"
            header={<Header variant="h3">Autoscaling metrics for LLM endpoints</Header>}
            columnDefinitions={[
              { id: 'metric', header: 'Metric', cell: (i) => <code>{i.metric}</code> },
              { id: 'note', header: 'Note', cell: (i) => i.note },
            ]}
            items={[
              {
                metric: 'SageMakerVariantInvocationsPerInstance',
                note: 'Standard one-minute metric, not LLM-aware: counts invocations, blind to in-flight concurrency and streaming.',
              },
              {
                metric: 'SageMakerVariantConcurrentRequestsPerModelHighResolution',
                note: 'Streaming-aware (ConcurrentRequestsPerModel): counts a request until its LAST streamed token. AWS reports up to 6x faster scale-up detection with it.',
              },
              {
                metric: 'SageMakerInferenceComponentConcurrentRequestsPerCopyHighResolution',
                note: 'Per-copy concurrency (ConcurrentRequestsPerCopy) for IC autoscaling. Scale-FROM-zero still needs a step policy.',
              },
            ]}
          />
          <Box variant="small">
            <Cite tier={2} href={`${BLOG}/amazon-sagemaker-inference-launches-faster-auto-scaling-for-generative-ai-models/`}>AWS ML Blog: faster auto-scaling for generative AI models</Cite>{' '}
            <Cite tier={1} href={`${SM}/endpoint-auto-scaling-add-code-define.html`} accessed="2026-10-17">SageMaker: define an auto-scaling policy</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Move to HyperPod when one model spans instances or needs managed prefill/decode disaggregation or llm-d routing; use JumpStart as the few-line front door onto a real-time endpoint"
          >
            Beyond one endpoint: HyperPod &amp; JumpStart
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>SageMaker HyperPod</strong> inference needs a HyperPod cluster orchestrated by{' '}
            <strong>EKS</strong>{' '}
            <Cite tier={1} href={`${HP}-setup.html`} accessed="2026-10-18">HyperPod: set up inference</Cite>.
            The docs show the <code>vllm/vllm-openai</code> image with{' '}
            <code>--tensor-parallel-size</code>, loading weights from S3, FSx or the Hugging Face Hub,
            with an init container that downloads the model first when{' '}
            <code>prefetchEnabled</code> is set{' '}
            <Cite tier={1} href={`${HP}-deploy-ftm.html`}>HyperPod: deploy a foundation model</Cite>.
            An <strong>Inference Operator</strong> runs the deployment, single-node or multi-node,
            and adds a managed <strong>tiered KV cache</strong> (L1 CPU, L2 in Redis or HyperPod&apos;s tiered
            storage) with the routing strategies <code>prefixaware</code>, <code>kvaware</code>,{' '}
            <code>session</code> and <code>roundrobin</code>{' '}
            <Cite tier={1} href={`${HP}.html`}>HyperPod model deployment</Cite>. Autoscaling runs on
            KEDA (Kubernetes Event-driven Autoscaling), and <code>minReplicaCount: 0</code> in the{' '}
            <code>InferenceEndpointConfig</code> CRD (Custom Resource Definition) scales a model to
            zero <Cite tier={1} href={`${HP}-autoscaling.html`}>HyperPod inference autoscaling</Cite>.
          </Box>
          <Box variant="p">
            Two HyperPod features have no real-time-endpoint equivalent.{' '}
            <strong>Disaggregated prefill and decode</strong> (section 10) is a <code>pdSpec</code>{' '}
            block on the same <code>InferenceEndpointConfig</code>: the operator provisions the
            router and wires prefill and decode pods together through LMCache and NIXL (NVIDIA
            Inference Xfer Library), moving KV over EFA (Elastic Fabric Adapter) with GPUDirect
            RDMA (Remote Direct Memory Access), on ml.p5.48xlarge, ml.p5e.48xlarge, ml.p5en.48xlarge,
            ml.p6-b200.48xlarge and ml.p6-b300.48xlarge only{' '}
            <Cite tier={1} href={`${HP}-dpd.html`}>HyperPod: disaggregated prefill and decode</Cite>.
            The <strong>HyperPod Inference Gateway</strong> puts an Endpoint Picker in front of the
            pods that scores them on queue depth, KV cache utilization, prefix-cache and LoRA
            affinity; its <code>scheduler</code> defaults to <code>llm-d</code> (section 17){' '}
            <Cite tier={1} href={`${HP}-inference-gateway.html`}>HyperPod Inference Gateway</Cite>.
          </Box>

          <div style={{ overflowX: 'auto' }}>
            <Box variant="small" color="text-status-info">
              The SageMaker hosting surface for vLLM: real-time endpoint (Inference Components),
              HyperPod (EKS), and JumpStart as a one-click source onto a real-time endpoint
            </Box>
            <SageMakerHostingSurfaceDiagram />
          </div>

          <Box variant="p">
            <strong>JumpStart</strong> is the one-click, few-line front door:{' '}
            <code>JumpStartModel(model_id=...).deploy()</code> puts a catalog model on a real-time
            endpoint in the container JumpStart selects for that model. Check which image it
            selects, whether that image runs vLLM at all, and at which version, before you depend
            on a v0.31.0 feature. A{' '}
            <code>JumpStartModel</code> CRD also deploys
            to HyperPod (via <code>modelHubName</code> <code>SageMakerPublicHub</code>){' '}
            <Cite tier={1} href={`${HP}-autoscaling.html`}>HyperPod inference autoscaling (JumpStartModel CRD)</Cite>.
          </Box>

          <Alert type="warning">
            <strong>Multi-node on a real-time endpoint is unverified.</strong> Real-time endpoints
            (LMI) document <em>single-instance, multi-GPU</em> tensor parallelism; a first-party page
            describing one vLLM model sharded across instances there was not located during this
            research (2026-10-16). Plan cross-instance vLLM on HyperPod or EKS.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Get vLLM's own TTFT, queue and KV-cache metrics into CloudWatch, then compare what SageMaker, EKS and EC2 each leave you to own"
          >
            Where vLLM should live: SageMaker vs EKS vs EC2
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Observability first, because it decides what you can alert on.</strong> A
            SageMaker endpoint emits CloudWatch infrastructure and invocation metrics:{' '}
            <code>GPUUtilization</code>, <code>ModelLatency</code>,{' '}
            <code>Invocation4XX</code>/<code>5XX</code>, <code>ConcurrentRequestsPerModel</code>,
            and for streaming <code>FirstChunkLatency</code> and <code>MidStreamErrors</code>{' '}
            <Cite tier={1} href={`${SM}/monitoring-cloudwatch.html`}>SageMaker CloudWatch metrics</Cite>.
            Enhanced metrics (<code>EnableEnhancedMetrics</code>) add per-instance, per-GPU and
            per-container dimensions{' '}
            <Cite tier={1} href={`${SM}/monitoring-cloudwatch-enhanced-metrics.html`}>SageMaker enhanced metrics</Cite>,
            and the container&apos;s stdout and stderr, so vLLM&apos;s logs, go to CloudWatch Logs.
          </Box>
          <Box variant="p">
            None of those is a vLLM metric. <strong>Detailed observability</strong> brings
            vLLM&apos;s own: an OpenTelemetry (OTel) collector on each instance scrapes the
            Prometheus endpoints of DCGM (Data Center GPU Manager), the node and the inference
            container into CloudWatch, where native vLLM and SGLang metrics (tokens per second,
            TTFT, inter-token latency, KV cache utilization, queue depth, batch size) arrive{' '}
            <em>&quot;without custom instrumentation&quot;</em>, queryable with PromQL (Prometheus
            Query Language) in CloudWatch Query Studio or Amazon Managed Grafana{' '}
            <Cite tier={1} href={`${SM}/monitoring-cloudwatch-detailed-observability.html`}>SageMaker detailed observability</Cite>.
          </Box>
          <ul>
            <li>
              <strong>Turn it on.</strong> <code>MetricsConfig.EnableDetailedObservability</code>{' '}
              defaults to true for endpoint configurations created after June 17, 2026; an older
              endpoint needs a new endpoint configuration with the flag set, applied with{' '}
              <code>update-endpoint</code>. <code>MetricPublishFrequencyInSeconds</code> sets the
              scrape interval (10, 30, 60, 120, 180, 240 or 300 seconds; default 60). PromQL queries
              also need OTel enrichment switched on once per account (
              <code>aws cloudwatch start-otel-enrichment</code>), which carries a CloudWatch
              ingestion charge{' '}
              <Cite tier={1} href={`${SM}/monitoring-detailed-observability-getting-started.html`}>Getting started with detailed observability</Cite>.
            </li>
            <li>
              <strong>Path A.</strong> LMI V30 serves vLLM&apos;s Prometheus metrics on{' '}
              <code>/metrics</code> and <code>/server/metrics</code> on port 8080, on by default
              (<code>SERVING_ENGINE_METRICS=true</code>), with the <code>vllm serve</code> names and
              labels. Set <code>option.served_model_name</code> or the <code>model_name</code> label
              is the in-container model path; latency histograms exclude time queued in the model
              server; families vLLM registers in its own web server (such as{' '}
              <code>vllm:tool_call_parser_invocations_total</code>) are absent{' '}
              <Cite tier={1} href={`${LMI_GUIDE}#L190-L246`}>LMI vLLM user guide L190-L246</Cite>.
            </li>
            <li>
              <strong>Paths B and C.</strong> The AWS vLLM DLC and the <code>vllm-sagemaker</code>{' '}
              entrypoint both put vLLM&apos;s API server, and with it the <code>/metrics</code> mount{' '}
              <Cite tier={1} href={vllmUrl('vllm/entrypoints/serve/instrumentator/metrics.py', 'L76-L81')} kind="code">instrumentator/metrics.py L76-L81</Cite>,
              on port 8080. For a custom container the getting-started page asks you to name the
              metrics path in <code>ContainerMetricsConfig</code>; the container must serve
              Prometheus format on port 8080, and <code>/metrics</code> is the default path.
            </li>
          </ul>
          <Box variant="p">
            What each <code>vllm:</code> series diagnoses is in{' '}
            <strong>section 20 (Observability &amp; Benchmarking)</strong> and{' '}
            <Cite tier={1} href={vllmDocsUrl('design/metrics/')}>vLLM docs: Metrics</Cite>.
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">Placement: SageMaker managed endpoint vs EKS vs EC2</Header>}
            columnDefinitions={[
              { id: 'dim', header: 'Dimension', cell: (i) => i.dim },
              { id: 'sm', header: 'SageMaker', cell: (i) => i.sm },
              { id: 'eks', header: 'EKS', cell: (i) => i.eks },
              { id: 'ec2', header: 'EC2', cell: (i) => i.ec2 },
            ]}
            items={[
              { dim: 'Managed infra', sm: 'Yes', eks: 'Partial (you run Kubernetes)', ec2: 'No' },
              { dim: 'Cost', sm: 'SageMaker AI instance pricing; compare per instance type', eks: 'EC2 instance price + EKS control plane', ec2: 'EC2 instance price' },
              { dim: 'Spot for inference', sm: 'Real-time endpoints: no. HyperPod: yes, for batch inference (up to 90% off HyperPod On-Demand, per AWS)', eks: 'Yes, with Karpenter (up to 90% off On-Demand, per AWS)', ec2: 'Yes (DIY)' },
              { dim: 'A/B variants', sm: 'Native', eks: 'DIY', ec2: 'DIY' },
              { dim: 'Model Registry', sm: 'Native', eks: 'DIY', ec2: 'DIY' },
              { dim: 'vLLM Prometheus metrics', sm: 'Yes: detailed observability scrapes them into CloudWatch (PromQL)', eks: 'Native', ec2: 'Native' },
              { dim: 'Disaggregation and cache-aware routing', sm: 'Real-time: prefix-aware routing. HyperPod: native prefill/decode (pdSpec) and the llm-d endpoint picker', eks: 'Yes: llm-d, Gateway API Inference Extension (sections 17, 24)', ec2: 'DIY' },
              { dim: 'Streaming', sm: 'Native SSE (Server-Sent Events) + bidirectional streaming (Nov 2025)', eks: 'DIY', ec2: 'DIY' },
              { dim: 'Latest vLLM version', sm: 'Within weeks of upstream (LMI V30 = 0.31.0)', eks: 'Your choice', ec2: 'Your choice' },
              { dim: 'Kubernetes expertise required', sm: 'No', eks: 'Yes', ec2: 'Some' },
            ]}
          />
          <Box variant="small">
            <Cite tier={1} href="https://aws.amazon.com/sagemaker/ai/pricing/">SageMaker AI pricing (HyperPod Spot)</Cite>{' '}
            <Cite tier={1} href="https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html">EKS best practices: AI/ML compute (Spot)</Cite>{' '}
            <Cite tier={1} href="https://aws.amazon.com/about-aws/whats-new/2025/11/sagemaker-ai-inference-bidirectional-streaming/">What&apos;s New: SageMaker AI bidirectional streaming</Cite>.
            Prices are Region- and time-sensitive: compare the pricing pages for your instance
            types. For the EKS path in depth, see <strong>24. vLLM on Amazon EKS</strong>.
          </Box>

          <Box variant="div">
            <Box variant="h3">Useful AWS repositories</Box>
            <Box variant="p">
              <code>aws/model-hosting-container-standards</code> is the Python library vLLM&apos;s
              SageMaker route imports for stateful sessions and LoRA adapter injection; vLLM pins{' '}
              <code>&gt;= 0.1.14, &lt; 1.0.0</code>{' '}
              <Cite tier={1} href={vllmUrl('requirements/common.txt', 'L54')} kind="code">requirements/common.txt L54</Cite>.
              Its example notebooks deploy vLLM with <code>SM_VLLM_MODEL</code>,{' '}
              <code>SM_VLLM_MAX_MODEL_LEN</code> and <code>SM_VLLM_GPU_MEMORY_UTILIZATION</code>{' '}
              <Cite tier={1} href={`${MHCS}/tree/v0.1.16/examples/vllm/notebooks`}>model-hosting-container-standards v0.1.16: vLLM notebooks</Cite>;
              the entrypoint that maps those variables lives in vLLM (Path C). For load testing,{' '}
              <Cite tier={1} href="https://github.com/aws-samples/load-test-llm-with-locust/tree/72854d749cf8d88dc1f625969df1351e526a1321">aws-samples/load-test-llm-with-locust</Cite>{' '}
              ships a <code>sagemaker_vllm_loadtest.ipynb</code>.
            </Box>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Decide first whether you need to operate an inference server at all: most teams start on Bedrock and leave only for a named need"
          >
            The bigger decision: self-host vLLM vs Amazon Bedrock
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Should you operate an inference server at all? For a startup the default answer is
            often &quot;no, call Bedrock&quot;: a few concrete <em>needs</em> justify the weight of
            self-hosting, and absent all of them Bedrock is the lower-total-cost choice.
          </Box>

          <Alert type="warning">
            <strong>[SPECULATIVE: our synthesis]</strong> AWS&apos;s decision guide frames Bedrock
            against SageMaker AI and does not mention vLLM; the vLLM mapping here is ours. Validate
            model availability and instance pricing against first-party sources for your Region and
            your model.
          </Alert>

          <div style={{ overflowX: 'auto' }}>
            <Box variant="small" color="text-status-info">
              Decision tree: managed Bedrock vs self-hosted vLLM (SPECULATIVE: our synthesis)
            </Box>
            <BedrockVsSelfHostDiagram />
          </div>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Amazon Bedrock: the default for startups</Box>
              <Box variant="p">
                Bedrock is the <em>&quot;fully managed, serverless platform&quot;</em> of AWS&apos;s
                decision guide <Cite tier={1} href={DECISION_GUIDE}>AWS Decision Guide</Cite>, serving
                foundation models (FMs) behind an API: no servers, no GPUs to provision, no vLLM to
                operate, pay-per-token by default. <strong>Custom Model Import</strong> extends it to
                your own weights, importing safetensors checkpoints for Llama, Mistral, Mixtral,
                Flan, GPTBigCode, Qwen (including Qwen3) and GPT-OSS architectures (GPT-OSS in
                us-east-1 only) <Cite tier={1} href={CMI}>Bedrock: Custom Model Import</Cite>. The
                trade is control: you serve the models and architectures Bedrock supports, on the
                tuning AWS chose, behind the API AWS exposes.
              </Box>
            </div>
            <div>
              <Box variant="h3">Self-hosted vLLM (EKS / EC2 / SageMaker): when a need forces it</Box>
              <Box variant="p">
                <strong>[SPECULATIVE: our synthesis]</strong> You take on capacity, autoscaling,
                upgrades and on-call in exchange for control. The justifying needs are the ones in
                the tree: an architecture Custom Model Import does not support, hardware control for
                cost at steady volume, a vLLM feature such as prefill/decode (P/D) disaggregation, or
                stricter isolation. Without one, self-hosting is cost without a matching benefit.
              </Box>
            </div>
          </ColumnLayout>

          <Table
            variant="embedded"
            header={<Header variant="h3">Need, and whether it points to Bedrock or self-hosted vLLM (SPECULATIVE: our synthesis)</Header>}
            columnDefinitions={[
              { id: 'need', header: 'The need', cell: (i) => i.need },
              { id: 'choice', header: 'Lean toward', cell: (i) => <strong>{i.choice}</strong> },
              { id: 'why', header: 'Why', cell: (i) => i.why },
            ]}
            items={[
              {
                need: 'Ship fast, minimal ops, standard frontier/foundation models',
                choice: 'Bedrock',
                why: 'No server, no GPU provisioning, pay-per-token. Lowest operational burden; the startup default.',
              },
              {
                need: 'Custom or fine-tuned weights in an architecture Custom Model Import supports',
                choice: 'Bedrock (Custom Model Import)',
                why: 'Bedrock imports the weights and serves them without an instance to run. Check the architecture list and Region first (GPT-OSS imports are us-east-1 only).',
              },
              {
                need: 'Custom weights in an architecture Custom Model Import does not support',
                choice: 'Self-host vLLM',
                why: 'A managed FM API cannot serve an architecture it does not import. vLLM loads Hugging Face or local weights for every architecture it supports.',
              },
              {
                need: 'Cost-at-volume with steady, predictable traffic',
                choice: 'Self-host vLLM',
                why: 'Per-token pricing is convenient but can exceed amortized instance cost at sustained high volume. Instance-level control (right-sizing, reservations, quantization, batching) lets you optimize the unit economics yourself.',
              },
              {
                need: 'A specific vLLM feature: multi-LoRA fleet, P/D disaggregation, custom batching',
                choice: 'Self-host vLLM',
                why: 'These are engine-level capabilities (see sections 13, 10, 4). A managed FM API does not expose them; running vLLM does. This is the single most common reason a startup outgrows Bedrock.',
              },
              {
                need: 'VPC / data-residency isolation beyond a managed API boundary',
                choice: 'Self-host vLLM',
                why: 'Self-hosting puts the model inside your VPC and your account boundary end-to-end, for compliance regimes that require it. (Bedrock also offers private connectivity; self-hosting is the maximal-isolation end of the spectrum.)',
              },
              {
                need: 'Spiky, unpredictable, or low-volume traffic',
                choice: 'Bedrock',
                why: 'Pay-per-token means you pay nothing when idle. A self-hosted endpoint pays for the instance whether or not requests arrive, bad economics for bursty or low traffic.',
              },
            ]}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Count on the same engine improvements whichever path you pick, and read AWS's speedup figures as vendor benchmarks on stated hardware"
          >
            Amazon&apos;s vLLM work lands upstream, in the engine you self-host
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Amazon contributes optimizations directly to vLLM, so the open engine you run yourself{' '}
            <em>and</em> the engine inside AWS&apos;s managed services share the same improvements;
            the managed services layer Amazon-specific tuning on top. Two examples, each from an AWS
            blog with the code in the v0.31.0 tree:
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">fused_moe_lora: multi-LoRA on MoE models</Box>
              <Box variant="p">
                Amazon created a <code>fused_moe_lora</code> kernel that <em>&quot;integrates LoRA
                operations into&quot;</em> the existing Mixture-of-Experts (MoE) kernel, handling
                expert routing and adapter selection together, so that <em>&quot;multiple custom
                models share the same GPU, with only the adapters swapped in and out per
                request.&quot;</em> The blog reports, for GPT-OSS 20B,{' '}
                <strong>&quot;454% OTPS [output tokens per second] improvements and 87% lower TTFT
                [time to first token]&quot;</strong> for vLLM 0.15.0 against 0.11.1rc3, and that AWS-specific
                tuning on top of upstream delivered{' '}
                <strong>&quot;19% higher Output Tokens Per Second&quot;</strong> and{' '}
                <strong>&quot;8% lower Time To First Token&quot;</strong> versus vLLM 0.15.0{' '}
                <Cite tier={2} href={`${BLOG}/efficiently-serve-dozens-of-fine-tuned-models-with-vllm-on-amazon-sagemaker-ai-and-amazon-bedrock/`}>AWS ML Blog: Efficiently serve dozens of fine-tuned models with vLLM</Cite>.
                The kernel is in vLLM, with an 8-bit floating point (FP8) variant beside it{' '}
                <Cite tier={1} href={vllmUrl('vllm/lora/ops/triton_ops/fused_moe_lora_op.py', 'L122')} kind="code">fused_moe_lora_op.py L122</Cite>.
              </Box>
            </div>
            <div>
              <Box variant="h3">P-EAGLE: parallel speculative decoding</Box>
              <Box variant="p">
                Amazon contributed <strong>P-EAGLE</strong>, which turns EAGLE speculative decoding
                from autoregressive to parallel (generating <em>&quot;all K draft tokens in a single
                forward pass&quot;</em>), integrated into vLLM from version 0.16.0. On NVIDIA B200
                the blog reports <strong>&quot;up to 1.69&times; speedup&quot;</strong> over vanilla
                EAGLE-3 at concurrency 1, with gains tapering at higher concurrency{' '}
                <Cite tier={2} href={`${BLOG}/p-eagle-faster-llm-inference-with-parallel-speculative-decoding-in-vllm/`}>AWS ML Blog: P-EAGLE in vLLM</Cite>.
                You enable it with <code>{'"parallel_drafting": true'}</code> in the speculative
                config; it defaults to false and needs a draft model trained for parallel drafting{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L479-L482')} kind="code">config/speculative.py L479-L482</Cite>.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="warning">
            <strong>Read the numbers as AWS&apos;s benchmarks.</strong> Every percentage and
            multiplier above is AWS&apos;s own, on configurations AWS chose: fused_moe_lora on
            GPT-OSS 20B with 1600 input and 600 output tokens, LoRA rank 32 and 8 adapters loaded
            (the post names no GPU for these figures), P-EAGLE on one NVIDIA B200 with GPT-OSS 20B.
            They are not
            independently reproduced here. Do not turn them into &quot;vLLM is 454% faster&quot;:
            they are deltas across specific optimization versions on specific configurations,
            evidence that Amazon&apos;s upstream work is material, not guarantees for your workload.
          </Alert>

          <Box variant="p">
            <strong>Why this matters for the decision.</strong> Self-hosted vLLM inherits{' '}
            <code>fused_moe_lora</code> and P-EAGLE directly; SageMaker AI and Bedrock add
            Amazon-specific tuning on top (the &quot;19% higher OTPS&quot; layer). Choose self-hosting
            for <em>control and specificity</em>; the engine is the same either way.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The order to make the two decisions in, and the first thing to switch on once vLLM runs on SageMaker"
          >
            Where this leaves you
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            <strong>Two nested decisions, in order.</strong> First, start at{' '}
            <strong>Bedrock</strong>; custom weights alone do not force a move when Custom Model
            Import supports the architecture, and a concrete need from the table does. Second, on
            SageMaker, pick the path by how much of the container you want to
            own: <strong>(A) LMI / DJL-Serving</strong> in async mode, the default since v17, with
            V30 bundling vLLM 0.31.0; <strong>(B) the AWS vLLM DLC</strong> for vLLM&apos;s own
            server with AWS maintaining the image; or <strong>(C) BYOC</strong> from vLLM&apos;s{' '}
            <code>vllm-sagemaker</code> target for full control. Before the endpoint takes traffic,
            confirm detailed observability is on and alarm on vLLM&apos;s TTFT and queue-depth
            series.
          </Box>
          <Alert type="info">
            <strong>Cross-links.</strong> For the cases where you should not run vLLM <em>at all</em>{' '}
            (including many of the &quot;just call Bedrock&quot; situations), see{' '}
            <strong>26. When Not vLLM</strong>. For the consolidated end-to-end chooser that folds this
            Bedrock-vs-self-host decision into the broader engine-and-platform selection, see{' '}
            <strong>28. Decision Guide</strong>.
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
